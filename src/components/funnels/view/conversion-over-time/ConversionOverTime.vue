<template>
  <FunnelContentGrid
    :funnel-view="funnelView"
    @change-view="emit('change-view', $event)"
  >
    <template #chart>
      <div>CHART</div>
    </template>

    <template #table>
      <div>TABLE</div>
    </template>
  </FunnelContentGrid>
</template>

<script setup lang="ts">
import FunnelContentGrid from '@/components/funnels/view/FunnelContentGrid.vue'

import type { FunnelChartType } from '@/pages/reports/funnelViews'

interface IProps {
  funnelView: FunnelChartType
}

withDefaults(defineProps<IProps>(), {})

const emit = defineEmits<{
  (e: 'change-view', payload: FunnelChartType): void
}>()
</script>
