<template>
  <ChartLine
    :options="chartOptions"
    :loading="loading"
  />
</template>

<script setup lang="ts">
import { computed } from 'vue'

import ChartLine from '@/components/charts/ChartLine.vue'

import { DEFAULT_SEPARATOR } from '@/constants'
import { dayjs } from '@/plugins/dayjs'

import type { FunnelResponseStepsInner } from '@/api'
import type { RowKey } from 'naive-ui/es/data-table/src/interface'

interface IProps {
  reportConversion: FunnelResponseStepsInner | undefined
  timeInterval: string
  checkedRowKeys?: RowKey[]
  loading?: boolean
  height?: number
}

const props = withDefaults(defineProps<IProps>(), {
  checkedRowKeys: undefined,
  loading: false,
  height: 350,
})

const filteredData = computed<FunnelResponseStepsInner | undefined>(() => {
  if (!props.reportConversion) return

  return {
    ...props.reportConversion,
    data: props.reportConversion.data.filter(
      item => props.checkedRowKeys?.includes(item.groups.join(DEFAULT_SEPARATOR)) || true
    ),
  }
})

const normalizedData = computed(() => {
  if (!filteredData.value) return

  return filteredData.value.data
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
    height: props.height,
    component: 'ChartLine',
    xField: 'date',
    yField: 'value',
    seriesField: 'category',
    xAxis: {
      type: 'time',
      label: {
        formatter: (n: number): string => {
          const format =
            props.timeInterval === 'hour'
              ? 'HH:mm MMM-DD'
              : props.timeInterval === 'day' || props.timeInterval === 'week'
                ? 'DD MMM'
                : 'YYYY-MM-DD'
          return dayjs(n).format(format)
        },
      },
    },
    yAxis: {
      label: {
        formatter: (n: number): string => n + '%',
      },
    },
    tooltip: {
      formatter: (datum: any) => {
        return {
          name: datum.category,
          value: datum.value + '%',
        }
      },
    },
  }
})
</script>
