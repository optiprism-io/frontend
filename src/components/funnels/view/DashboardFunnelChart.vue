<template>
  <FunnelStepsChart
    v-if="isStepsChart && reportSteps.length"
    :report-steps="reportSteps"
    :height="height + 'px'"
    :lite-chart="true"
  />
  <ConversionOverTimeChart
    v-else-if="timeInterval"
    :report-conversion="reportSteps.at(-1)"
    :time-interval="timeInterval"
    :height="height"
  />
</template>

<script setup lang="ts">
import { computed } from 'vue'

import { isString } from 'lodash-es'

import ConversionOverTimeChart from '@/components/funnels/view/conversion-over-time/ConversionOverTimeChart.vue'
import FunnelStepsChart from '@/components/funnels/view/funnel-steps/FunnelStepsChart.vue'

import { FunnelStepsChartTypeTypeEnum } from '@/api'

import type { FunnelResponseStepsInner, Report, TimeUnit } from '@/api'

type Props = {
  reportSteps: FunnelResponseStepsInner[]
  report: Report | undefined
  height?: number
}

const props = withDefaults(defineProps<Props>(), {
  height: 240,
})

const isStepsChart = computed<boolean>(() => {
  if (!props.report?.query?.chartType || isString(props.report.query.chartType)) return false
  return props.report.query.chartType.type === FunnelStepsChartTypeTypeEnum.Steps
})

const timeInterval = computed<TimeUnit | null>(() => {
  if (!props.report?.query?.chartType || isString(props.report.query.chartType)) return null

  if ('intervalUnit' in props.report.query.chartType) {
    return props.report.query.chartType.intervalUnit
  }
  return null
})
</script>
