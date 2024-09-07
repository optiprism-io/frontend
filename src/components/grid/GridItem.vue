<template>
  <div
    class="pf-l-grid__item"
    :class="[`pf-m-${col}-col`, `pf-m-${colLg}-col-on-lg`]"
  >
    <slot />
  </div>
</template>

<script setup lang="ts">
interface IProps {
  col?: string | number
  colLg?: string | number
}

withDefaults(defineProps<IProps>(), {
  col: 12,
  colLg: 6,
})
</script>
