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
            '--pf-c-table__sticky-column--MinWidth': minWidth,
            '--pf-c-table__sticky-column--Left': left,
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

const props = defineProps<Props>();
const cell = ref<HTMLElement | null>(null);
const left = ref('');
const minWidth = ref('');

const cellComponent = computed(() => props.isHeadCell ? 'th' : 'td');

</script>

<style lang="scss">
</style>
