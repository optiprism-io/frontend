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
      <template v-else-if="reportSteps.length">
        <ChartStacked
          v-if="checkedRowKeys.length"
          :data="normalizedReportSteps"
          height="25rem"
        />
        <DataEmptyPlaceholder
          v-else
          :content="$t('funnels.view.selectRowInTable')"
        />
      </template>
      <DataEmptyPlaceholder
        v-else
        :content="$t('funnels.view.selectToStart')"
      />
    </template>
    <template
      v-if="reportSteps.length"
      #table
    >
      <FunnelsTable
        :checked-row-keys="checkedRowKeys"
        :report-steps="reportSteps"
        :groups="groups"
        :max-checked-rows="MAX_CHECKED_ROWS"
        :loading="loading"
        @update:checked-row-keys="setCheckedRowKeys"
      />
    </template>
  </FunnelContentGrid>
</template>

<script lang="ts" setup>
import { computed, nextTick, ref, watch } from 'vue'

import ChartStacked from '@/components/charts/ChartStacked.vue'
import DataEmptyPlaceholder from '@/components/common/data/DataEmptyPlaceholder.vue'
import DataLoader from '@/components/common/data/DataLoader.vue'
import FunnelsTable from '@/components/funnels/view/funnel-steps/FunnelStepsTable.vue'
import FunnelContentGrid from '@/components/funnels/view/FunnelContentGrid.vue'
import type { DataPickerPeriod } from '@/components/uikit/UiDatePickerWrapper.vue'

import {
  type EventRecordsListRequestTime,
  FunnelQueryCountEnum,
  FunnelStepsChartTypeTypeEnum,
} from '@/api'
import { apiClient } from '@/api/apiClient'
import {
  hasEmptyFilterValuesInExcludes,
  hasEmptyFilterValuesInFilters,
  hasEmptyFilterValuesInSteps,
  MIN_COUNT_FOR_REQUEST,
} from '@/components/funnels/view/shared'
import {
  DEFAULT_CHECKED_ROWS,
  MAX_CHECKED_ROWS,
  useCheckedRows,
} from '@/components/funnels/view/useCheckedRows'
import { DEFAULT_SEPARATOR } from '@/constants'
import { useMutation } from '@/hooks/useMutation'
import { useStepsStore } from '@/stores/funnels/steps'
import { useProjectsStore } from '@/stores/projects/projects'
import { useBreakdownsStore } from '@/stores/reports/breakdowns'
import { useFilterGroupsStore } from '@/stores/reports/filters'

import type { FunnelResponseStepsInner } from '@/api'
import type { ChartStackedItem } from '@/components/charts/types'
import type { ControlsPeriod } from '@/components/funnels/view/useCalendarTime'
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

const stepsStore = useStepsStore()
const projectsStore = useProjectsStore()
const filterGroupsStore = useFilterGroupsStore()
const breakdownsStore = useBreakdownsStore()

const reportSteps = ref<FunnelResponseStepsInner[]>([])
const groups = ref<string[]>([])

const { checkedRowKeys, setCheckedRowKeys } = useCheckedRows()

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

const normalizedReportSteps = computed<ChartStackedItem[]>(() =>
  filteredReportSteps.value.map(step => {
    return {
      groupName: step.step,
      elements: step.data.map(item => ({
        columnName: item.groups.join(DEFAULT_SEPARATOR),
        primary: {
          value: item.total,
          percentage: item.conversionRatio,
          label: 'Total',
          percentageLabel: 'Conversion Ratio',
        },
        secondary: {
          value: item.droppedOff,
          percentage: item.dropOffRatio,
          label: 'Dropped Off',
          percentageLabel: 'Dropped Off Ratio',
        },
      })),
    }
  })
)

const { mutate: getReports, isLoading: loading } = useMutation(fetchReports)

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
    const checkedRows =
      res.data.steps[0]?.data
        .map(item => item.groups.join(DEFAULT_SEPARATOR))
        .slice(0, DEFAULT_CHECKED_ROWS) ?? []
    setCheckedRowKeys(checkedRows)
  }
}

function resetFunnelViews(): void {
  reportSteps.value = []
  groups.value = []
}

watch(() => [stepsStore, filterGroupsStore, breakdownsStore, props.time], getReports, {
  deep: true,
  immediate: true,
})

watch(
  () => stepsStore.getSteps.length,
  (value, oldValue) => {
    if (value < MIN_COUNT_FOR_REQUEST && oldValue > value) resetFunnelViews()
  }
)
</script>
