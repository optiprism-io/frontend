<template>
  <div class="pf-l-flex pf-u-justify-content-center">
    <LegendMarker
      v-for="(item, i) in reportSteps.at(0)?.data || []"
      :key="i"
      :marker-name="item.groups.join(DEFAULT_SEPARATOR)"
      :color="barsColors[i]"
    />
  </div>
  <div
    :class="{
      'pf-c-scroll-inner-wrapper': !props.liteChart,
    }"
  >
    <div
      ref="container"
      class="pf-l-flex pf-u-flex-nowrap"
      :class="{
        'pf-u-m-lg': !props.liteChart,
      }"
    >
      <div
        v-for="(item, j) in reportSteps"
        :key="j"
        class="pf-m-flex-1 pf-m-spacer-none"
      >
        <FunnelChartStacked
          :data="item.data"
          :width="stepWidth"
          :colors="barsColors"
          :height="props.height"
          :lite-chart="props.liteChart"
        >
          <div class="pf-u-text-align-center">
            {{ item.step }}
          </div>
        </FunnelChartStacked>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'

import { useElementSize } from '@vueuse/core'

import LegendMarker from '@/components/charts/LegendMarker.vue'
import FunnelChartStacked from '@/components/funnels/view/FunnelChartStacked.vue'

import { DEFAULT_SEPARATOR } from '@/constants'
import { getPseudoRandomColor } from '@/utils/colorHelper'

import type { FunnelResponseStepsInner } from '@/api'

interface IProps {
  reportSteps: FunnelResponseStepsInner[]
  minWidthStep?: number
  height?: number
  liteChart?: boolean
}

const props = withDefaults(defineProps<IProps>(), {
  minWidthStep: 550,
  height: undefined,
  liteChart: false,
})

const barsColors = computed<string[]>(
  () => props.reportSteps.at(0)?.data.map((_, i) => getPseudoRandomColor(i)) || []
)

const container = ref<HTMLDivElement | null>(null)
const { width: containerWidth } = useElementSize(container)

const stepWidth = computed(() => {
  return Math.max(containerWidth.value / props.reportSteps.length, props.minWidthStep)
})
</script>
