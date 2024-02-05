<template>
    <div
        class="ui-table-cell"
        :class="{
            'pf-u-text-nowrap': props.nowrap,
        }"
    >
        {{ tableCellVal }}
    </div>
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import { humanReadable } from '@/utils/humanReadable'
import { isNumber } from 'lodash'

type Props = {
    title: string | number
    value?: string | number
    nowrap?: boolean
}

const props = defineProps<Props>()

const tableCellVal = computed(() => isNumber(props.title) ? humanReadable(props.title) : props.title)
</script>