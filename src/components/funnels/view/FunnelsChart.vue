<template>
  <div class="pf-l-flex pf-u-justify-content-center pf-u-flex-nowrap">
    <div
      v-for="(item, i) in flatSteps"
      :key="i"
      class="pf-l-flex pf-l-flex__item pf-m-align-items-center"
    >
      <span class="pf-l-flex__item legend-marker" :style="{ background: barsColors[i] }" />
      <span>{{ item.dimension }}</span>
    </div>
  </div>
  <FunnelChartStacked :data="flatSteps" :width="1071" :colors="barsColors" />
</template>

<script setup lang="ts">
import type { FunnelResponseStepsInner } from '@/api'
import FunnelChartStacked from '@/components/funnels/view/FunnelChartStacked.vue'
import { computed } from 'vue'

import { CHART_COLORS_7 } from '@/helpers/colorHelper'

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

<style lang="scss" scoped>
.legend-marker {
  width: 1rem;
  height: 1rem;
  border-radius: 0.125rem;
}
</style>
