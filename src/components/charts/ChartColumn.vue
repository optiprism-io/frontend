<template>
  <div class="chart-line">
    <ChartWrapper
      :loading="props.loading"
      :default-options="defaultOptions"
      :options="props.options"
      :chart-constructor="Column"
      :height="props.options?.height ? `${props.options.height}px` : '350px'"
    />
  </div>
</template>

<script setup lang="ts">
import { Column } from '@antv/g2plot'

import ChartWrapper from '@/components/charts/ChartWrapper.vue'

import { chartOptions as defaultOptions } from '@/components/charts/chartOptions'

const props = withDefaults(
  defineProps<{
    options: any
    loading: boolean
  }>(),
  {
    options: {},
    loading: false,
  }
)
</script>
