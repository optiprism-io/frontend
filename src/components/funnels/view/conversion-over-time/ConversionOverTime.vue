<template>
  <FunnelContentGrid
    :funnel-view="funnelView"
    :period="period"
    :controls-period="controlsPeriod"
    @change-view="emit('change-view', $event)"
    @change-period="emit('change-period', $event)"
    @change-controls-period="emit('change-controls-period', $event)"
  >
    <template #toolbar>
      <UiSelect
        class="pf-u-w-initial"
        :items="TIME_INTERVAL_VALUES"
        :text-button="timeIntervalText"
        :selections="[timeInterval]"
        @on-select="selectTimeInterval"
      />
    </template>
    <template #chart>
      <DataLoader v-if="loading" />
      <ConversionOverTimeChart
        v-else-if="reportConversion"
        :time-interval="timeInterval"
        :report-conversion="reportConversion"
        :checked-row-keys="checkedRowKeys"
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
        :checked-row-keys="checkedRowKeys"
        :report-conversion="reportConversion"
        :loading="loading"
        :max-checked-rows="MAX_CHECKED_ROWS"
        @update:checked-row-keys="setCheckedRowKeys"
      />
    </template>
  </FunnelContentGrid>
</template>

<script setup lang="ts">
import { nextTick, ref, watch } from 'vue'

import DataEmptyPlaceholder from '@/components/common/data/DataEmptyPlaceholder.vue'
import DataLoader from '@/components/common/data/DataLoader.vue'
import ConversionOverTimeChart from '@/components/funnels/view/conversion-over-time/ConversionOverTimeChart.vue'
import ConversionOverTimeTable from '@/components/funnels/view/conversion-over-time/ConversionOverTimeTable.vue'
import FunnelContentGrid from '@/components/funnels/view/FunnelContentGrid.vue'
import type { DataPickerPeriod } from '@/components/uikit/UiDatePickerWrapper.vue'
import UiSelect from '@/components/uikit/UiSelect.vue'

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
import {
  DEFAULT_CHECKED_ROWS,
  MAX_CHECKED_ROWS,
  useCheckedRows,
} from '@/components/funnels/view/useCheckedRows'
import { TIME_INTERVAL_VALUES, useTimeInterval } from '@/components/funnels/view/useTimeInterval'
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

const { timeInterval, timeIntervalText, selectTimeInterval } = useTimeInterval()
const { checkedRowKeys, setCheckedRowKeys } = useCheckedRows()

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
      intervalUnit: timeInterval.value,
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
    /* select first N rows */
    const availableKeys =
      res.data.steps.at(-1)?.data.map(item => item.groups.join(DEFAULT_SEPARATOR)) || []
    const checkedRows = Array.from(new Set(availableKeys)).slice(0, DEFAULT_CHECKED_ROWS)
    setCheckedRowKeys(checkedRows)
  }
}

watch(
  () => [stepsStore, filterGroupsStore, breakdownsStore, props.time, timeInterval.value],
  getReports,
  {
    deep: true,
    immediate: true,
  }
)
</script>
