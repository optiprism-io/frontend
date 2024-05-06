<template>
  <div class="pf-c-card pf-u-mb-md">
    <div class="pf-c-toolbar">
      <div class="pf-c-toolbar__content">
        <div class="pf-c-toolbar__content-section pf-m-nowrap">
          <div class="pf-c-toolbar__item">
            <UiToggleGroup :items="itemsPeriod" @select="selectPeriod">
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
      <FunnelsChart :report-steps="reportSteps" />
      <FunnelsTable :report-steps="reportSteps" />
    </template>
    <DataEmptyPlaceholder v-else>
      {{ $t('funnels.view.selectToStart') }}
    </DataEmptyPlaceholder>
  </div>
</template>

<script lang="ts" setup>
import { computed, ref, watch } from 'vue'
import UiDatePicker from '@/components/uikit/UiDatePicker.vue'
import { periodMap } from '@/configs/events/controls'
import { UiToggleGroupItem } from '@/components/uikit/UiToggleGroup.vue'
import { getStringDateByFormat, getYYYYMMDD } from '@/helpers/getStringDates'
import { ApplyPayload } from '@/components/uikit/UiCalendar/UiCalendar'
import FunnelsChart from '@/components/funnels/view/FunnelsChart.vue'
import { UiDropdownItem } from '@/components/uikit/UiDropdown.vue'
import FunnelsTable from '@/components/funnels/view/FunnelsTable.vue'
import { useStepsStore } from '@/stores/funnels/steps'
import DataEmptyPlaceholder from '@/components/common/data/DataEmptyPlaceholder.vue'
import DataLoader from '@/components/common/data/DataLoader.vue'
import { FUNNEL_VIEWS } from './funnelViews'
import { useProjectsStore } from '@/stores/projects/projects'
import {
  EventRecordsListRequestTime,
  FunnelQueryCountEnum,
  FunnelResponseStepsInner,
  FunnelStepsChartTypeTypeEnum,
  TimeUnitWithSession,
} from '@/api'
import { useMutation } from '@/hooks/useMutation'
import { getLastNDaysRange } from '@/helpers/calendarHelper'
import { storeToRefs } from 'pinia'
import { TimeTypeEnum, usePeriod } from '@/hooks/usePeriod'
import { apiClient } from '@/api/apiClient'

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

const stepsStore = useStepsStore()
const { size, unit } = storeToRefs(stepsStore)

const reportSteps = ref<FunnelResponseStepsInner[]>([])

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

/* TODO: refactor this */
async function fetchReports(): Promise<void> {
  const projectsStore = useProjectsStore()

  const res = await apiClient.query.funnelQuery(projectsStore.projectId, {
    time: timeRequest.value,
    group: '',
    steps: stepsStore.getSteps,
    timeWindow: {
      n: size.value,
      /* TODO: fix type and remove "as TimeUnitWithSession" */
      unit: unit.value as TimeUnitWithSession,
    },
    chartType: {
      type: FunnelStepsChartTypeTypeEnum.Steps,
    },
    count: FunnelQueryCountEnum.NonUnique,
    touch: {
      type: 'first',
    },
  })

  if (res?.data?.steps) {
    reportSteps.value = res.data.steps
  }
}

watch(() => stepsStore.steps.length, getReports)
</script>
