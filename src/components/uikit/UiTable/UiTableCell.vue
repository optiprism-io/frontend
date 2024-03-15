<template>
  <div
    class="ui-table-cell"
    :class="{
      'pf-u-text-nowrap': props.nowrap,
    }"
    :title="isHasTooltip ? tableCellVal : ''"
  >
    {{ tableCellVal }}
  </div>
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import { humanReadable } from '@/utils/humanReadable'
import { isNumber } from 'lodash-es'

type Props = {
  title: string | number
  value?: string | number
  nowrap?: boolean
}

const props = defineProps<Props>()

const tableCellVal = computed(() =>
  isNumber(props.title) ? humanReadable(props.title) : props.title
)

const isHasTooltip = computed(() => tableCellVal.value.length > 46)
</script>

<style lang="scss">
.ui-table-cell {
  &.pf-u-text-nowrap {
    overflow: hidden;
    text-overflow: ellipsis;
  }
}
</style>