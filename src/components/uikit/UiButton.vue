<template>
  <button
    class="ui-button pf-v5-c-button"
    :class="{
      'pf-v5-m-in-progress': props.progress,
      'pf-v5-m-link': props.isLink,
    }"
    :disabled="disabled"
    :type="type"
    :aria-label="ariaLabel"
  >
    <span v-if="beforeIcon" class="pf-v5-c-button__icon pf-v5-u-mr-md">
      <UiIcon :icon="beforeIcon" />
    </span>
    <span v-if="progress" class="pf-v5-c-button__progress">
      <UiSpinner class="pf-v5-m-md" />
    </span>
    <UiIcon v-if="icon" :icon="icon" />
    <slot />
    <span v-if="afterIcon" class="pf-v5-c-button__icon pf-v5-u-ml-sm">
      <UiIcon :icon="afterIcon" />
    </span>
  </button>
</template>

<script setup lang="ts">
import UiSpinner from './UiSpinner.vue'
import UiIcon from '@/components/uikit/UiIcon.vue'

interface Props {
  active?: boolean
  disabled?: boolean
  type?: 'submit' | 'button' | 'reset' | undefined
  progress?: boolean
  icon?: string | undefined
  ariaLabel?: string
  beforeIcon?: string
  isLink?: boolean
  afterIcon?: string
}

const props = withDefaults(defineProps<Props>(), {
  type: 'button',
  beforeIcon: '',
  icon: '',
  ariaLabel: '',
  afterIcon: undefined,
})
</script>

<style lang="scss">
.ui-button.pf-v5-c-button.pf-v5-m-secondary {
  --pf-v5-c-button--m-secondary--BackgroundColor: #fff;
}
</style>
