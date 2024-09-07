<template>
  <ChartStacked
    :data="normalizedReportSteps"
    :height="height"
    :lite-chart="liteChart"
  />
</template>

<script setup lang="ts">
import { computed } from 'vue'

import ChartStacked from '@/components/charts/ChartStacked.vue'

import { DEFAULT_SEPARATOR } from '@/constants'

import type { FunnelResponseStepsInner } from '@/api'
import type { ChartStackedItem } from '@/components/charts/types'
import type { RowKey } from 'naive-ui/es/data-table/src/interface'

const props = withDefaults(
  defineProps<{
    reportSteps: FunnelResponseStepsInner[]
    checkedRowKeys?: RowKey[]
    height?: string
    liteChart?: boolean
  }>(),
  {
    checkedRowKeys: undefined,
    height: '25rem',
    liteChart: false,
  }
)

const filteredReportSteps = computed<FunnelResponseStepsInner[]>(() => {
  return props.reportSteps.map(step => {
    return {
      ...step,
      data: step.data.filter(
        item => props.checkedRowKeys?.includes(item.groups.join(DEFAULT_SEPARATOR)) || true
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
</script>
