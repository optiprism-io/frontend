<template>
  <div
    class="ui-table-cell-date"
    :class="{
      'pf-u-text-nowrap': props.nowrap,
    }"
  >
    {{ formattedDate }}
  </div>
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import { useDateFormat } from '@vueuse/core'
import { isNumber } from 'lodash'

type Props = {
  title: string | number
  value?: string | number
  nowrap?: boolean
}

const props = defineProps<Props>()

const formattedDate = computed(() =>
  isNumber(props.value) ? useDateFormat(props.value / 1000000, 'YYYY-MM-DD HH:mm') : '-'
)
</script>
