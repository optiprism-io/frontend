<template>
  <NDataTable
    :columns="columns"
    :data="data"
    :scroll-x="scrollX"
    :single-line="false"
  />
</template>

<script lang="ts" setup>
import type { FunnelResponseStepsInner } from '@/api'
import { NDataTable } from 'naive-ui'
import { computed } from 'vue'
import { camelize } from '@/utils/camelize'
import { uncamelize } from '@/utils/uncamelize'
import {
  TableBaseColumn,
  TableColumn,
  TableColumnGroup,
} from 'naive-ui/es/data-table/src/interface'
import { StepKey } from '@/components/funnels/view/funnelViews'

interface IProps {
  reportSteps: FunnelResponseStepsInner[]
}

const props = withDefaults(defineProps<IProps>(), {})

const KEY_SPLITTER = '_'
const KEY_PREFIX = '__'

const data = computed(() => {
  const length = props.reportSteps.at(0)?.data.length ?? 0

  const arr = new Array(length).fill({})

  props.reportSteps.forEach(step => {
    step.data.forEach((el, index) => {
      const keys = Object.keys(el) as (keyof typeof el)[]

      keys.forEach(key => {
        const stepName = camelize(step.step)
        const newKey = KEY_PREFIX + stepName + KEY_SPLITTER + key
        arr[index][newKey] = el[key]
      })
    })
  })

  return arr
})

const columns = computed(() => {
  const VISIBLE_KEY: StepKey[] = ['total', 'droppedOff', 'conversionRatio', 'dropOffRatio'] as const

  const arr: TableColumn[] = []

  props.reportSteps.forEach(step => {
    const parentEl: TableColumnGroup = {
      title: step.step,
      key: step.step,
      children: [],
    }

    VISIBLE_KEY.forEach(key => {
      const stepName = camelize(step.step)
      const newKey = KEY_PREFIX + stepName + KEY_SPLITTER + key
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

const scrollX = computed(() => {
  const WIDTH_ONE_COLUMN = 500 // value calculated experimentally
  return columns.value.length * WIDTH_ONE_COLUMN
})
</script>
