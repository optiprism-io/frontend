<template>
  <div class="pf-l-flex pf-u-justify-content-center pf-u-flex-nowrap">
    <LegendMarker
      v-for="(item, i) in flatSteps"
      :key="i"
      :marker-name="item.dimension"
      :color="barsColors[i]"
    />
  </div>
  <FunnelChartStacked :data="flatSteps" :width="1071" :colors="barsColors" />
</template>

<script setup lang="ts">
import { computed } from 'vue'
import LegendMarker from '@/components/charts/LegendMarker.vue'
import FunnelChartStacked from '@/components/funnels/view/FunnelChartStacked.vue'

import { CHART_COLORS_7 } from '@/helpers/colorHelper'

import type { FunnelResponseStepsInner } from '@/api'

interface IProps {
  reportSteps: FunnelResponseStepsInner[]
}

const props = withDefaults(defineProps<IProps>(), {})

const flatSteps = computed(() => {
  const steps: Record<string, any>[] = []

  props.reportSteps.forEach(x => {
    x.data.forEach(y => {
      const newObj = {
        ...y,
        dimension: x.step,
      }
      steps.push(newObj)
    })
  })

  return steps
})

const barsColors = computed(() => CHART_COLORS_7.slice(0, flatSteps.value.length))
</script>
