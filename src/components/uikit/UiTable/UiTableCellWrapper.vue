<template>
  <component
    :is="cellComponent"
    ref="cell"
    :class="{
      'pf-v5-c-table__sticky-column': props.fixed,
      'pf-v5-m-truncate': props.truncate,
      'pf-v5-m-border-right': props.lastFixed,
      'pf-v5-c-table__sort': props.sorted,
      'pf-v5-c-table__action': props.type === 'action',
      'pf-v5-u-text-nowrap': props.noWrap,
      'pf-v5-m-nowrap': props.noWrap,
      'pf-v5-m-fit-content': props.fitContent,
    }"
    :role="props.isHeadCell ? 'columnheader' : ''"
    :colspan="colspan"
    :style="{
      '--pf-v5-c-table__sticky-column--MinWidth': minWidth,
      '--pf-v5-c-table__sticky-column--Left': left,
    }"
  >
    <slot />
  </component>
</template>

<script lang="ts" setup>
import { onMounted, ref, computed, nextTick } from 'vue'

type Props = {
  fixed?: boolean
  lastFixed?: boolean
  truncate?: boolean
  sorted?: boolean
  colspan?: number
  noWrap?: boolean
  type?: string
  fitContent?: boolean
  isHeadCell?: boolean
}

const props = defineProps<Props>()
const cell = ref<HTMLElement | null>(null)
const left = ref('')
const minWidth = ref('')
const cellComponent = computed(() => (props.isHeadCell ? 'th' : 'td'))

const updateLeftOffset = () => {
  const cellEl = cell.value
  if (cellEl) {
    const parentEl = cellEl.parentElement
    if (parentEl) {
      const boundingClientRectParent = parentEl.getBoundingClientRect()
      left.value = `${cellEl.offsetLeft - boundingClientRectParent.left}px`
    }
  }
}

onMounted(async () => {
  await nextTick()
  if (props.fixed) {
    updateLeftOffset()
  }
})
</script>

<style lang="scss"></style>
