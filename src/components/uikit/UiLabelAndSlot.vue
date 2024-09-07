<template>
  <div class="pf-v5-l-flex pf-v5-m-column pf-v5-m-space-items-none">
    <span
      v-if="!hideLabel"
      id="label-group-category-label"
      class="pf-v5-c-label-group__label pf-v5-u-font-weight-bold"
    >
      {{ label }}
    </span>
    <slot />
  </div>
</template>

<script setup lang="ts">
export interface Props {
  label: string
  hideLabel?: boolean
}

withDefaults(defineProps<Props>(), {
  hideLabel: false,
})
</script>
