<template>
  <div class="pf-l-flex pf-l-flex__item pf-m-align-items-center">
    <span class="pf-l-flex__item legend-marker" :style="{ background: color }" />
    <span>{{ markerName }}</span>
  </div>
</template>

<script setup lang="ts">
import { getRandomColor } from '@/helpers/colorHelper'

interface IProps {
  markerName: string
  color?: string
}

withDefaults(defineProps<IProps>(), {
  color: getRandomColor(),
})
</script>

<style lang="scss" scoped>
.legend-marker {
  width: 1rem;
  height: 1rem;
  border-radius: 0.125rem;
}
</style>
