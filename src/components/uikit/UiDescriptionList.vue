<template>
  <dl
    class="ui-description-list pf-v5-c-description-list"
    :class="{
      'pf-v5-m-horizontal': props.horizontal,
      'pf-v5-m-compact': props.compact,
    }"
  >
    <div
      v-for="item in props.items"
      :key="item.label"
      class="pf-v5-c-description-list__group"
    >
      <dt class="pf-v5-c-description-list__term pf-v5-u-pt-xs">
        <span class="pf-v5-c-description-list__text">{{ item.label }}</span>
      </dt>
      <dd class="pf-v5-c-description-list__description">
        <component
          :is="item.component"
          :value="item.value"
          @input="onInput($event, item.key)"
        >
          {{ item.value }}
        </component>
      </dd>
    </div>
  </dl>
</template>

<script lang="ts" setup>
import type { defineComponent } from 'vue'

export type Item = {
    label: string
    key: string
    value: string | string[] | boolean
    editable?: boolean
    component?: ReturnType<typeof defineComponent> | 'p'
}

export type ActionPayload = {
    key: string
    value: string | string[] | boolean
}

type Props = {
    compact?: boolean
    horizontal?: boolean | undefined
    items: Item[]
}

const emit = defineEmits<{
    (e: 'onInput', payload: ActionPayload): void
}>()

const props = withDefaults(defineProps<Props>(), {
    horizontal: undefined,
    compact: true
})

const onInput = (payload: Event | string | boolean, key: string) => {
    emit('onInput', {
        key,
        value: typeof payload === 'object' && !Array.isArray(payload) ? String(payload) : payload,
    })
}
</script>

<style lang="scss">
.ui-description-list {
    .pf-v5-c-description-list {
        &__group {
            align-items: start;
        }
    }
}
</style>
