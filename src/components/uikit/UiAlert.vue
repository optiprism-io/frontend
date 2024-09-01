<template>
  <div
    class="pf-v5-c-alert pf-v5-m-inline"
    :class="typeClass"
  >
    <div class="pf-v5-c-alert__icon">
      <i
        class="fas fa-fw"
        :class="config[props.item.type]"
        aria-hidden="true"
      />
    </div>
    <p class="pf-v5-c-alert__title">
      {{ props.item.text }}
    </p>
    <div
      v-if="!props.item.noClose"
      class="pf-v5-c-alert__action"
      @click="closeItem(props.item.id)"
    >
      <button
        class="pf-v5-c-button pf-v5-m-plain"
        type="button"
      >
        <i
          class="fas fa-times"
          aria-hidden="true"
        />
      </button>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed } from 'vue'

import type { Alert } from '@/hooks/useAlert'

const props = defineProps<{
    item: Alert
}>()

const emit = defineEmits<{
    (e: 'close', id: string): void
}>()

const config = {
    default: 'fa-bell',
    info: 'fa-info-circle',
    success: 'fa-check-circle',
    warning: 'fa-exclamation-triangle',
    danger: 'fa-exclamation-circle',
}

const typeClass = computed(() => `pf-m-${props.item.type}`)

const closeItem = (id: string) => emit('close', id)
</script>

<style lang="scss">
</style>
