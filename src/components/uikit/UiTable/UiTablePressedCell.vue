<template>
  <div class="pf-u-display-flex pf-u-flex-direction-row pf-u-align-items-center">
    <div class="pf-l-flex__item">
      <div class="pf-u-display-flex pf-u-flex-direction-row pf-u-align-items-center">
        <UiButton
          class="pf-u-text-nowrap pf-m-link pf-m-inline"
          @click="props.action && onAction(props.action)"
        >
          {{ title }}
        </UiButton>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import type { defineComponent } from 'vue'

import UiButton from '../UiButton.vue'

import type { Action } from './UiTable'

type Props = {
    value?: string | number
    title: string | number
    actions?: Action[]
    action?: Action,
    component?: ReturnType<typeof defineComponent>
}

const props = withDefaults(defineProps<Props>(), {
    value: undefined,
    actions: undefined,
    action: undefined,
    component: undefined,
})

const emit = defineEmits<{
    (e: 'on-action', payload: Action): void
}>()

const onAction = (payload: Action) => {
    emit('on-action', payload)
}
</script>

<style lang="scss" scoped>
.pf-c-table {
    tr:hover {
        .ui-table-event-cell__action-list {
            opacity: 1;
        }
    }
}
</style>
