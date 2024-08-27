<template>
  <FunnelContentGrid
    :funnel-view="funnelView"
    @change-view="emit('change-view', $event)"
  >
    <template #chart>
      <pre> {{ reportConversion }} </pre>
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

import ConversionOverTimeTable from '@/components/funnels/view/conversion-over-time/ConversionOverTimeTable.vue'
import FunnelContentGrid from '@/components/funnels/view/FunnelContentGrid.vue'

import { FunnelConversionOverTimeChartTypeTypeEnum, FunnelQueryCountEnum } from '@/api'
import { apiClient } from '@/api/apiClient'
import { useMutation } from '@/hooks/useMutation'
import { TimeTypeEnum, usePeriod } from '@/hooks/usePeriod'
import { useStepsStore } from '@/stores/funnels/steps'
import { useProjectsStore } from '@/stores/projects/projects'
import { useBreakdownsStore } from '@/stores/reports/breakdowns'
import { useFilterGroupsStore } from '@/stores/reports/filters'

import type { EventRecordsListRequestTime, FunnelResponseStepsInner } from '@/api'
import type { FunnelChartType } from '@/pages/reports/funnelViews'

interface IProps {
  funnelView: FunnelChartType
}

withDefaults(defineProps<IProps>(), {})

const emit = defineEmits<{
  (e: 'change-view', payload: FunnelChartType): void
}>()

interface Period {
  from: string
  to: string
  last: number
  type: TimeTypeEnum
}

const reportConversion = ref<FunnelResponseStepsInner | undefined>()

const stepsStore = useStepsStore()
const projectsStore = useProjectsStore()
const filterGroupsStore = useFilterGroupsStore()
const breakdownsStore = useBreakdownsStore()

const { mutate: getReports } = useMutation(fetchReports)

const controlsPeriod = ref<string | number>('30')
const period = ref<Period>({
  from: '',
  to: '',
  type: TimeTypeEnum.Last,
  last: 30,
})

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

async function fetchReports(): Promise<void> {
  /* need nextTick for update stepsStore.getSteps */
  await nextTick()
  const steps = stepsStore.getSteps

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

watch(() => [stepsStore, filterGroupsStore, breakdownsStore, timeRequest], getReports, {
  deep: true,
  immediate: true,
})
</script>

<style lang="scss" scoped>
pre {
  height: 40rem;
  overflow: auto;
}
</style>
