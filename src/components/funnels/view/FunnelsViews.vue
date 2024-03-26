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
                  :active-tab-controls="funnelsStore.period.type"
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
            <UiDropdown :items="FUNNEL_VIEWS" :text-button="itemText" @select-value="selectItem" />
          </div>
        </div>
      </div>
    </div>

    <DataEmptyPlaceholder v-if="reports.length === 0">
      {{ $t('funnels.view.selectToStart') }}
    </DataEmptyPlaceholder>
    <DataLoader v-else-if="loading" />
    <template v-else>
      <FunnelsChart :reports="reports" />
      <FunnelsTable class="pf-u-mt-xl" :reports="reports" :step-numbers="stepNumbers" />
    </template>
  </div>
</template>

<script lang="ts" setup>
import { computed, ref, watch } from 'vue'
import UiDatePicker from '@/components/uikit/UiDatePicker.vue'
import { periodMap } from '@/configs/events/controls'
import { UiToggleGroupItem } from '@/components/uikit/UiToggleGroup.vue'
import { useFunnelsStore } from '@/stores/funnels/funnels'
import { getStringDateByFormat } from '@/helpers/getStringDates'
import { ApplyPayload } from '@/components/uikit/UiCalendar/UiCalendar'
import FunnelsChart from '@/components/funnels/view/FunnelsChart.vue'
import { UiDropdownItem } from '@/components/uikit/UiDropdown.vue'
import FunnelsTable from '@/components/funnels/view/FunnelsTable.vue'
import { useStepsStore } from '@/stores/funnels/steps'
import DataEmptyPlaceholder from '@/components/common/data/DataEmptyPlaceholder.vue'
import DataLoader from '@/components/common/data/DataLoader.vue'
import { storeToRefs } from 'pinia'
import { FUNNEL_VIEWS } from './funnelViews'
import { useProjectsStore } from '@/stores/projects/projects'
import { useBreakdownsStore } from '@/stores/reports/breakdowns'
import { useFilterGroupsStore } from '@/stores/reports/filters'
import { useSegmentsStore } from '@/stores/reports/segments'
import queryService from '@/api/services/query.service'
import {
  DataTableResponseColumnsInner,
  DataTableResponseColumnsInnerTypeEnum,
  FunnelQueryChartTypeTypeEnum,
  FunnelQueryCountEnum,
  TimeUnit,
} from '@/api'
import { isNumber } from 'lodash'

const item = ref<string | number>(0)
const itemText = computed(() => FUNNEL_VIEWS.find(c => c.key === item.value)?.nameDisplay ?? '')

const selectItem = (value: UiDropdownItem<string>) => {
  item.value = value.key
}

const funnelsStore = useFunnelsStore()
const stepsStore = useStepsStore()

const reports = ref<DataTableResponseColumnsInner[]>([])
const loading = ref<boolean>(false)

const { period, controlsPeriod, timeRequest } = storeToRefs(funnelsStore)
const { setControlsPeriod, initPeriod, setPeriod } = funnelsStore

const stepNumbers = computed<number[]>(() => {
  const metricValueColumns = reports.value.filter(
    col => col.type === DataTableResponseColumnsInnerTypeEnum.Metric
  )
  const stepNumbers = metricValueColumns.map(col => col.step).filter(isNumber)
  return [...new Set(stepNumbers)]
})

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
async function getReports(): Promise<void> {
  const projectsStore = useProjectsStore()
  const stepsStore = useStepsStore()
  const breakdownsStore = useBreakdownsStore()
  const filterGroupsStore = useFilterGroupsStore()
  const segmentsStore = useSegmentsStore()

  loading.value = true

  try {
    const res = await queryService.funnelQuery(projectsStore.projectId, {
      time: timeRequest.value,
      group: '',
      steps: stepsStore.getSteps,
      timeWindow: {
        n: stepsStore.size,
        unit: stepsStore.unit,
      },
      chartType: {
        type: FunnelQueryChartTypeTypeEnum.ConversionSteps,
        intervalUnit: TimeUnit.Day,
      },
      count: FunnelQueryCountEnum.NonUnique,
      stepOrder: 'any',
      holdingConstants: stepsStore.getHoldingProperties,
      exclude: stepsStore.getExcluded,
      breakdowns: breakdownsStore.breakdownsItems,
      segments: segmentsStore.segmentationItems,
      filters: filterGroupsStore.filters,
    })

    if (res?.data?.columns) {
      reports.value = res.data.columns
    }
  } catch (e) {
    console.log('Error while getting funnel reports')
  } finally {
    loading.value = false
  }
}

watch(() => stepsStore.steps.length, getReports)
</script>
