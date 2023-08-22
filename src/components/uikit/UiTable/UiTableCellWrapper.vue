<template>
    <component
        :is="cellComponent"
        ref="cell"
        :class="{
            'pf-c-table__sticky-column': props.fixed,
            'pf-m-truncate': props.truncate,
            'pf-m-border-right': props.lastFixed,
            'pf-c-table__sort': props.sorted,
            'pf-c-table__action': props.type === 'action',
            'pf-u-text-nowrap': props.noWrap,
            'pf-m-nowrap': props.noWrap,
            'pf-m-fit-content': props.fitContent,
        }"
        :role="props.isHeadCell ? 'columnheader' : ''"
        :colspan="colspan"
        :style="{
            left: left,
        }"
    >
        <slot />
    </component>
</template>

<script lang="ts" setup>
import { onMounted, ref, computed } from 'vue'

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

const cellComponent = computed(() => props.isHeadCell ? 'th' : 'td');

onMounted(() => {
    setTimeout(() => {
        if (props.fixed) {
            const cellEl = cell.value;
            if (cellEl) {
                const parentEl = cellEl.parentElement;

                if (parentEl) {
                    const boundingClientRectParent = parentEl.getBoundingClientRect()
                    left.value = `${cellEl.offsetLeft - boundingClientRectParent.left}px`
                }
            }
        }
    }, 100)
})
</script>

<style lang="scss"></style>
