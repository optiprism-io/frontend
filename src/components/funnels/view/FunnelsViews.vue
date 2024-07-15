<template>
  <div class="pf-c-card pf-u-p-md">
    <div class="pf-c-toolbar">
      <div class="pf-c-toolbar__content">
        <div class="pf-c-toolbar__content-section pf-m-nowrap">
          <div class="pf-c-toolbar__item">
            <UiToggleGroup
              :items="itemsPeriod"
              @select="selectPeriod"
            >
              <template #after>
                <UiDatePicker
                  :value="calendarValue"
                  :last-count="period.last"
                  :active-tab-controls="period.type"
                  @on-apply="applyPeriod"
                >
                  <template #action>
                    <button
                      class="pf-c-toggle-group__button"
                      :class="{
                        'pf-m-selected': calendarValueString,
                      }"
                      type="button"
                    >
                      <div class="pf-u-display-flex pf-u-align-items-center">
                        <UiIcon :icon="'far fa-calendar-alt'" />
                        &nbsp;
                        {{ calendarValueString }}
                      </div>
                    </button>
                  </template>
                </UiDatePicker>
              </template>
            </UiToggleGroup>
          </div>

          <div class="pf-c-toolbar__item pf-u-ml-auto">
            <UiDropdown
              :items="FUNNEL_VIEWS"
              :text-button="itemText"
              @select-value="selectItem"
            />
          </div>
        </div>
      </div>
    </div>

    <DataLoader v-if="loading" />
    <template v-else-if="reportSteps.length">
      <FunnelsChart
        v-if="checkedRowKeys.length"
        :report-steps="filteredReportSteps"
      />
      <DataEmptyPlaceholder v-else>
        {{ $t('funnels.view.selectRowInTable') }}
      </DataEmptyPlaceholder>
    </template>
    <DataEmptyPlaceholder v-else>
      {{ $t('funnels.view.selectToStart') }}
    </DataEmptyPlaceholder>
  </div>

  <div
    v-if="reportSteps.length"
    class="pf-c-card pf-u-mt-md"
  >
    <FunnelsTable
      v-model:checked-row-keys="checkedRowKeys"
      :report-steps="reportSteps"
      :groups="groups"
      :max-checked-rows="MAX_CHECKED_ROWS"
    />
  </div>
</template>

<script lang="ts" setup>
import { computed, nextTick, ref, watch } from 'vue'

import DataEmptyPlaceholder from '@/components/common/data/DataEmptyPlaceholder.vue'
import DataLoader from '@/components/common/data/DataLoader.vue'
import FunnelsChart from '@/components/funnels/view/FunnelsChart.vue'
import FunnelsTable from '@/components/funnels/view/FunnelsTable.vue'
import UiDatePicker from '@/components/uikit/UiDatePicker.vue'
import type { UiDropdownItem } from '@/components/uikit/UiDropdown.vue'
import UiDropdown from '@/components/uikit/UiDropdown.vue'
import UiIcon from '@/components/uikit/UiIcon.vue'
import type { UiToggleGroupItem } from '@/components/uikit/UiToggleGroup.vue'
import UiToggleGroup from '@/components/uikit/UiToggleGroup.vue'

import { FunnelQueryCountEnum, FunnelStepsChartTypeTypeEnum } from '@/api'
import { apiClient } from '@/api/apiClient'
import { periodMap } from '@/configs/events/controls'
import { DEFAULT_SEPARATOR } from '@/constants'
import { getLastNDaysRange } from '@/helpers/calendarHelper'
import { getStringDateByFormat, getYYYYMMDD } from '@/helpers/getStringDates'
import { useMutation } from '@/hooks/useMutation'
import { TimeTypeEnum, usePeriod } from '@/hooks/usePeriod'
import { useStepsStore } from '@/stores/funnels/steps'
import { useProjectsStore } from '@/stores/projects/projects'
import { useBreakdownsStore } from '@/stores/reports/breakdowns'
import { useFilterGroupsStore } from '@/stores/reports/filters'

import { FUNNEL_VIEWS } from './funnelViews'

import type {
  EventRecordsListRequestTime,
  FunnelResponseStepsInner,
  FunnelQueryStepsInner,
} from '@/api'
import type { ApplyPayload } from '@/components/uikit/UiCalendar/UiCalendar'
import type { FilterGroup } from '@/stores/reports/filters'
import type { DataTableRowKey } from 'naive-ui'

const MIN_COUNT_FOR_REQUEST = 2
const MAX_CHECKED_ROWS = 12
const DEFAULT_CHECKED_ROWS = 5

const stepsStore = useStepsStore()
const projectsStore = useProjectsStore()
const filterGroupsStore = useFilterGroupsStore()
const breakdownsStore = useBreakdownsStore()

interface Period {
  from: string
  to: string
  last: number
  type: TimeTypeEnum
}

const item = ref<string | number>(0)
const itemText = computed(() => FUNNEL_VIEWS.find(c => c.key === item.value)?.nameDisplay ?? '')

const selectItem = (value: UiDropdownItem<string>) => {
  item.value = value.key
}

const reportSteps = ref<FunnelResponseStepsInner[]>([])
const groups = ref<string[]>([])
const checkedRowKeys = ref<DataTableRowKey[]>([])

const filteredReportSteps = computed<FunnelResponseStepsInner[]>(() => {
  return reportSteps.value.map(step => {
    return {
      ...step,
      data: step.data.filter(item =>
        checkedRowKeys.value.includes(item.groups.join(DEFAULT_SEPARATOR))
      ),
    }
  })
})

const controlsPeriod = ref<string | number>('30')
const period = ref<Period>({
  from: '',
  to: '',
  type: TimeTypeEnum.Last,
  last: 30,
})

const { mutate: getReports, isLoading: loading } = useMutation(fetchReports)

const timeRequest = computed<EventRecordsListRequestTime>(() => {
  const { getRequestTime } = usePeriod()
  return getRequestTime(
    period.value.type,
    controlsPeriod.value,
    period.value.from,
    period.value.to,
    period.value.last
  )
})

function setControlsPeriod(payload: string) {
  controlsPeriod.value = payload
}

function setPeriod(payload: Period) {
  period.value = payload
}

function initPeriod(): void {
  const lastNDateRange = getLastNDaysRange(20)
  period.value = {
    from: getYYYYMMDD(lastNDateRange.from),
    to: getYYYYMMDD(new Date()),
    type: 'last',
    last: 20,
  }
}

const itemsPeriod = computed(() => {
  const config = periodMap.find(item => item.type === 'day')

  return (
    config?.items.map(
      (key): UiToggleGroupItem => ({
        key,
        nameDisplay: key + config.text,
        value: key,
        selected: key === controlsPeriod.value,
      })
    ) ?? []
  )
})

const calendarValue = computed(() => {
  return {
    from: period.value.from,
    to: period.value.to,
    multiple: false,
    dates: [],
  }
})

const calendarValueString = computed(() => {
  if (period.value.from && period.value.to && controlsPeriod.value === 'calendar') {
    switch (period.value.type) {
      case 'last':
        return `Last ${period.value.last} ${period.value.last === 1 ? 'day' : 'days'}`
      case 'since':
        return `Since ${getStringDateByFormat(period.value.from, '%d %b, %Y')}`
      case 'between':
        return `${getStringDateByFormat(period.value.from, '%d %b, %Y')} - ${getStringDateByFormat(period.value.to, '%d %b, %Y')}`
      default:
        return ''
    }
  } else {
    return ''
  }
})

const selectPeriod = (payload: string): void => {
  setControlsPeriod(payload)
  initPeriod()
}

const applyPeriod = (payload: ApplyPayload): void => {
  setControlsPeriod('calendar')
  setPeriod({
    ...period.value,
    from: payload.value.from || '',
    to: payload.value.to || '',
    type: payload.type,
    last: payload.last,
  })
}

async function fetchReports(): Promise<void> {
  /* need nextTick for update stepsStore.getSteps */
  await nextTick()
  const steps = stepsStore.getSteps
  if (
    steps.length < MIN_COUNT_FOR_REQUEST ||
    hasEmptyFilterValuesInSteps(steps) ||
    hasEmptyFilterValuesInFilters(filterGroupsStore.filterGroups)
  )
    return

  const res = await apiClient.query.funnelQuery(projectsStore.projectId, {
    steps,
    time: timeRequest.value,
    group: stepsStore.group,
    breakdowns: breakdownsStore.breakdownsItems,
    filters: filterGroupsStore.filters,
    timeWindow: {
      n: stepsStore.size,
      unit: stepsStore.unit,
    },
    chartType: {
      type: FunnelStepsChartTypeTypeEnum.Steps,
    },
    count: FunnelQueryCountEnum.NonUnique,
    touch: {
      type: 'first',
    },
    exclude: stepsStore.getExcluded,
    holdingConstants: stepsStore.getHoldingProperties,
  })

  if (res?.data) {
    reportSteps.value = res.data.steps
    groups.value = res.data.groups

    /* select first N rows */
    checkedRowKeys.value =
      res.data.steps[0]?.data
        .map(item => item.groups.join(DEFAULT_SEPARATOR))
        .slice(0, DEFAULT_CHECKED_ROWS) ?? []
  }
}

function resetFunnelViews(): void {
  reportSteps.value = []
  groups.value = []
}

function hasEmptyFilterValuesInSteps(steps: FunnelQueryStepsInner[]): boolean {
  return steps.some(step =>
    step.events.some(event => event.filters.some(filter => !filter.value?.length))
  )
}

function hasEmptyFilterValuesInFilters(filters: FilterGroup[]): boolean {
  return filters.some(filter => filter.filters.some(filter => !filter.values.length))
}

watch(() => [stepsStore, filterGroupsStore, breakdownsStore, timeRequest], getReports, {
  deep: true,
})

watch(
  () => stepsStore.getSteps.length,
  (value, oldValue) => {
    if (value < MIN_COUNT_FOR_REQUEST && oldValue > value) resetFunnelViews()
  }
)
</script>
