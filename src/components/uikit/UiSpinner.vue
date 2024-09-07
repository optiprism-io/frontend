<template>
  <span
    class="pf-v5-c-spinner"
    :class="classSize"
    role="progressbar"
    aria-label="Loading..."
  >
    <span class="pf-v5-c-spinner__clipper" />
    <span class="pf-v5-c-spinner__lead-ball" />
    <span class="pf-v5-c-spinner__tail-ball" />
  </span>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Props {
    size?: 'sm' | 'md' | 'lg' | 'xl' | string;
}

const props = withDefaults(defineProps<Props>(), {
    size: 'md'
})

const classSize = computed(() => `pf-m-${props.size}`)
</script>

<style lang="scss"></style>
