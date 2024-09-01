<template>
  <div class="legend-marker">
    <span
      class="legend-marker__point"
      :style="{ background: color }"
    />
    <span class="legend-marker__name">{{ markerName }}</span>
  </div>
</template>

<script setup lang="ts">
interface IProps {
  markerName: string
  color: string
}

withDefaults(defineProps<IProps>(), {})
</script>

<style lang="scss" scoped>
.legend-marker {
  display: flex;
  gap: 0.5rem;
  align-items: center;
}

.legend-marker__point {
  width: 1rem;
  height: 1rem;
  border-radius: 0.125rem;
}

.legend-marker__name {
  font-size: var(--pf-v5-global--FontSize--sm);
  white-space: nowrap;
}
</style>
