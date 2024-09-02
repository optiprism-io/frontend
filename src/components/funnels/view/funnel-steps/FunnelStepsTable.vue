<template>
  <UiDataTable
    :checked-row-keys="checkedRowKeys"
    :columns="columns"
    :data="data"
    :scroll-x="scrollX"
    :single-line="false"
    :render-cell="renderCell"
    :row-key="rowKey"
    :loading="loading"
    @update:checked-row-keys="handleCheck"
  />
</template>

<script lang="ts" setup>
import { computed } from 'vue'

import { useVModel } from '@vueuse/core'

import UiDataTable from '@/components/uikit/UiDataTable.vue'

import { useScrollX } from '@/components/funnels/view/useScrollX'
import { DEFAULT_SEPARATOR } from '@/constants'
import { uncamelize } from '@/utils/uncamelize'

import type { FunnelResponseStepsInner } from '@/api'
import type { StepKey } from '@/components/funnels/view/funnel-steps/types'
import type { DataTableBaseColumn, DataTableRowKey } from 'naive-ui'
import type {
  RowData,
  TableBaseColumn,
  TableColumn,
  TableColumnGroup,
} from 'naive-ui/es/data-table/src/interface'

interface IProps {
  reportSteps: FunnelResponseStepsInner[]
  groups: string[]
  checkedRowKeys: DataTableRowKey[]
  maxCheckedRows: number
  loading?: boolean
}

const props = withDefaults(defineProps<IProps>(), {
  loading: false,
})

const emit = defineEmits<{
  (e: 'update:checkedRowKeys', value: typeof props['checkedRowKeys']): void
}>()

const KEY_SPLITTER = '_'
const KEY_PREFIX = '__'
const KEY_GROUPS: StepKey = 'groups'
const KEY_TOTAL: StepKey = 'conversionRatio'
const INDEX_FIRST_ARR_ELEMENT = 0
const TOTAL_CONVERSION = 'TOTAL_CONVERSION'
const UNIQ_KEY = 'id'

const curCheckedRowKeys = useVModel(props, 'checkedRowKeys', emit)

const data = computed<RowData[]>(() => {
  const length = props.reportSteps.at(0)?.data.length ?? 0
  const lastIndex = props.reportSteps.length - 1

  const arr: RowData[] = Array.from({ length }, () => ({}))

  props.reportSteps.forEach((step, stepIndex) => {
    step.data.forEach((el, index) => {
      const keys = Object.keys(el) as (keyof typeof el)[]

      keys.forEach(key => {
        const newKey = KEY_PREFIX + key + KEY_SPLITTER + stepIndex
        arr[index][newKey] = el[key]
      })

      arr[index][UNIQ_KEY] = step.data[index].groups.join(DEFAULT_SEPARATOR)
    })
  })

  arr.forEach(x => (x[TOTAL_CONVERSION] = x[KEY_PREFIX + KEY_TOTAL + KEY_SPLITTER + lastIndex]))

  return arr
})

const rowKey = (row: RowData) => row[UNIQ_KEY]

function handleCheck(rowKeys: DataTableRowKey[]) {
  curCheckedRowKeys.value = rowKeys.slice(0, props.maxCheckedRows)
}

const selectionColumn = computed<TableColumn>(() => ({
  type: 'selection',
  disabled(row: RowData) {
    return (
      props.checkedRowKeys.length === props.maxCheckedRows &&
      !props.checkedRowKeys.includes(rowKey(row))
    )
  },
}))

const groupsColumns = computed<TableColumn[]>(() => {
  const cols = props.groups.map((x, index) => ({
    title: x,
    key: KEY_PREFIX + KEY_GROUPS + KEY_SPLITTER + INDEX_FIRST_ARR_ELEMENT + `[${index}]`,
  }))

  cols.push({
    title: 'Conversion Ratio',
    key: TOTAL_CONVERSION,
  })

  return cols
})

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
      }
      parentEl.children.push(childrenEl)
    })

    arr.push(parentEl)
  })

  return arr
})

const columns = computed(() => [
  selectionColumn.value,
  ...groupsColumns.value,
  ...dimensionsColumns.value,
])

function renderCell(value: any, rowData: object, column: DataTableBaseColumn) {
  if (typeof column.title !== 'string') throw new Error('Column title must be a string')
  return column.title.includes('Ratio') ? `${value}%` : value
}

const { scrollX } = useScrollX(columns)
</script>
