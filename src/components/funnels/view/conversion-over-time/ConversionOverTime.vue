<template>
  <FunnelContentGrid
    :funnel-view="funnelView"
    :period="period"
    :controls-period="controlsPeriod"
    @change-view="emit('change-view', $event)"
    @change-period="emit('change-period', $event)"
    @change-controls-period="emit('change-controls-period', $event)"
  >
    <template #chart>
      <DataLoader v-if="loading" />
      <ChartLine
        v-else-if="reportConversion"
        :options="chartOptions"
        :loading="loading"
      />
      <DataEmptyPlaceholder
        v-else
        :content="$t('funnels.view.selectToStart')"
      />
    </template>

    <template #table>
      <ConversionOverTimeTable
        v-if="reportConversion"
        :report-conversion="reportConversion"
      />
    </template>
  </FunnelContentGrid>
</template>

<script setup lang="ts">
import { computed, nextTick, ref, watch } from 'vue'

import ChartLine from '@/components/charts/ChartLine.vue'
import DataEmptyPlaceholder from '@/components/common/data/DataEmptyPlaceholder.vue'
import DataLoader from '@/components/common/data/DataLoader.vue'
import ConversionOverTimeTable from '@/components/funnels/view/conversion-over-time/ConversionOverTimeTable.vue'
import FunnelContentGrid from '@/components/funnels/view/FunnelContentGrid.vue'
import type { DataPickerPeriod } from '@/components/uikit/UiDatePickerWrappet.vue'

import {
  type EventRecordsListRequestTime,
  FunnelConversionOverTimeChartTypeTypeEnum,
  FunnelQueryCountEnum,
} from '@/api'
import { apiClient } from '@/api/apiClient'
import {
  hasEmptyFilterValuesInExcludes,
  hasEmptyFilterValuesInFilters,
  hasEmptyFilterValuesInSteps,
  MIN_COUNT_FOR_REQUEST,
} from '@/components/funnels/view/shared'
import { type ControlsPeriod } from '@/components/funnels/view/useCalendarTime'
import { DEFAULT_SEPARATOR } from '@/constants'
import { useMutation } from '@/hooks/useMutation'
import { useStepsStore } from '@/stores/funnels/steps'
import { useProjectsStore } from '@/stores/projects/projects'
import { useBreakdownsStore } from '@/stores/reports/breakdowns'
import { useFilterGroupsStore } from '@/stores/reports/filters'

import type { FunnelResponseStepsInner } from '@/api'
import type { FunnelChartType } from '@/pages/reports/funnelViews'

interface IProps {
  funnelView: FunnelChartType
  period: DataPickerPeriod
  controlsPeriod: ControlsPeriod
  time: EventRecordsListRequestTime
}

const props = withDefaults(defineProps<IProps>(), {})

const emit = defineEmits<{
  (e: 'change-view', payload: FunnelChartType): void
  (e: 'change-period', payload: DataPickerPeriod): void
  (e: 'change-controls-period', payload: ControlsPeriod): void
}>()

const reportConversion = ref<FunnelResponseStepsInner | undefined>()

const stepsStore = useStepsStore()
const projectsStore = useProjectsStore()
const filterGroupsStore = useFilterGroupsStore()
const breakdownsStore = useBreakdownsStore()

const { mutate: getReports, isLoading: loading } = useMutation(fetchReports)

const normalizedData = computed(() => {
  return reportConversion.value?.data
    .toSorted((a, b) => a.ts - b.ts)
    .map(item => ({
      date: new Date(item.ts),
      value: item.conversionRatio,
      category: item.groups.join(DEFAULT_SEPARATOR),
    }))
})

const chartOptions = computed(() => {
  return {
    data: normalizedData.value,
    height: 350,
    component: 'ChartLine',
    xField: 'date',
    yField: 'value',
    seriesField: 'category',
    xAxis: {
      type: 'time',
    },
  }
})

async function fetchReports(): Promise<void> {
  /* need nextTick for update stepsStore.getSteps */
  await nextTick()
  const steps = stepsStore.getSteps
  if (
    steps.length < MIN_COUNT_FOR_REQUEST ||
    hasEmptyFilterValuesInSteps(steps) ||
    hasEmptyFilterValuesInFilters(filterGroupsStore.filterGroups) ||
    hasEmptyFilterValuesInExcludes(stepsStore.excludedEvents)
  )
    return

  const res = await apiClient.query.funnelQuery(projectsStore.projectId, {
    steps,
    time: props.time,
    group: stepsStore.group,
    breakdowns: breakdownsStore.breakdownsItems,
    filters: filterGroupsStore.filters,
    timeWindow: {
      n: stepsStore.size,
      unit: stepsStore.unit,
    },
    chartType: {
      type: FunnelConversionOverTimeChartTypeTypeEnum.ConversionOverTime,
      intervalUnit: 'day',
    },
    count: FunnelQueryCountEnum.NonUnique,
    touch: {
      type: 'first',
    },
    exclude: stepsStore.getExcluded,
    holdingConstants: stepsStore.getHoldingProperties,
  })

  if (res?.data) {
    reportConversion.value = res.data.steps.at(-1)
  }
}

watch(() => [stepsStore, filterGroupsStore, breakdownsStore, props.time], getReports, {
  deep: true,
  immediate: true,
})
</script>
