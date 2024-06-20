<template>
  <NDataTable
    :columns="columns"
    :data="data"
    :scroll-x="scrollX"
    :single-line="false"
  />
</template>

<script lang="ts" setup>
import { computed } from 'vue'

import { NDataTable } from 'naive-ui'

import { uncamelize } from '@/utils/uncamelize'

import type { FunnelResponseStepsInner } from '@/api'
import type { StepKey } from '@/components/funnels/view/funnelViews'
import type {
  TableBaseColumn,
  TableColumn,
  TableColumnGroup,
} from 'naive-ui/es/data-table/src/interface'

interface IProps {
  reportSteps: FunnelResponseStepsInner[]
  groups: string[]
}

const props = withDefaults(defineProps<IProps>(), {})

const KEY_SPLITTER = '_'
const KEY_PREFIX = '__'
const KEY_GROUPS = 'groups'
const INDEX_FIRST_ARR_ELEMENT = 0

const data = computed(() => {
  const length = props.reportSteps.at(0)?.data.length ?? 0

  const arr: Record<string, any> = Array.from({ length }, () => ({}))

  props.reportSteps.forEach((step, stepIndex) => {
    step.data.forEach((el, index) => {
      const keys = Object.keys(el) as (keyof typeof el)[]

      keys.forEach(key => {
        const newKey = KEY_PREFIX + key + KEY_SPLITTER + stepIndex
        arr[index][newKey] = el[key]
      })
    })
  })

  return arr
})

const groupsColumns = computed<TableColumn[]>(() =>
  props.groups.map((x, index) => ({
    title: x,
    key: KEY_PREFIX + KEY_GROUPS + KEY_SPLITTER + INDEX_FIRST_ARR_ELEMENT + `[${index}]`,
    resizable: true,
  }))
)

const dimensionsColumns = computed(() => {
  const VISIBLE_KEY: StepKey[] = ['total', 'droppedOff', 'conversionRatio', 'dropOffRatio'] as const

  const arr: TableColumn[] = []

  props.reportSteps.forEach((step, stepIndex) => {
    const parentEl: TableColumnGroup = {
      title: step.step,
      key: step.step,
      children: [],
    }

    VISIBLE_KEY.forEach(key => {
      const newKey = KEY_PREFIX + key + KEY_SPLITTER + stepIndex
      const childrenEl: TableBaseColumn = {
        title: uncamelize(key),
        key: newKey,
        resizable: true,
      }
      parentEl.children.push(childrenEl)
    })

    arr.push(parentEl)
  })

  return arr
})

const columns = computed(() => [...groupsColumns.value, ...dimensionsColumns.value])

const scrollX = computed(() => {
  const WIDTH_ONE_COLUMN = 350 // value calculated experimentally
  return columns.value.length * WIDTH_ONE_COLUMN
})
</script>
