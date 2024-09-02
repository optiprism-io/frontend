<template>
  <UiDataTable
    :checked-row-keys="checkedRowKeys"
    :columns="columns"
    :data="data"
    :scroll-x="scrollX"
    :loading="loading"
    :row-key="rowKey"
    @update:checked-row-keys="handleCheck"
  />
</template>

<script setup lang="ts">
import { computed } from 'vue'

import { useVModel } from '@vueuse/core'

import UiDataTable from '@/components/uikit/UiDataTable.vue'

import { useScrollX } from '@/components/funnels/view/useScrollX'
import { DEFAULT_SEPARATOR } from '@/constants'
import { getYYYYMMDD } from '@/helpers/getStringDates'

import type { FunnelResponseStepsInner, FunnelResponseStepsInnerDataInner } from '@/api'
import type { DataTableRowKey } from 'naive-ui'
import type { RowData, TableColumn } from 'naive-ui/es/data-table/src/interface'

interface IProps {
  reportConversion: FunnelResponseStepsInner | undefined
  checkedRowKeys: DataTableRowKey[]
  maxCheckedRows: number
  loading?: boolean
}

interface PreparedData {
  [group: string]: {
    [ts: number]: number
  }
}

const props = withDefaults(defineProps<IProps>(), {})

const emit = defineEmits<{
  (e: 'update:checkedRowKeys', value: typeof props['checkedRowKeys']): void
}>()

const curCheckedRowKeys = useVModel(props, 'checkedRowKeys', emit)

const UNIQ_KEY = 'name'

function handleCheck(rowKeys: DataTableRowKey[]) {
  curCheckedRowKeys.value = rowKeys.slice(0, props.maxCheckedRows)
}

const rowKey = (row: RowData) => row[UNIQ_KEY]

const preparedData = computed(() => {
  const res: PreparedData = {}

  if (!props.reportConversion) return []

  for (let i = 0; i < props.reportConversion.data.length; i++) {
    const el: FunnelResponseStepsInnerDataInner = props.reportConversion.data[i]
    const groupString = el.groups.join(DEFAULT_SEPARATOR)
    if (!res[groupString]) res[groupString] = {}
    res[groupString][el.ts] = el.conversionRatio
  }

  return res
})

const data = computed<RowData[]>(() => {
  const res: RowData[] = Object.values(preparedData.value)

  for (let i = 0; i < res.length; i++) {
    const group = Object.keys(preparedData.value)[i]
    res[i].name = group
  }

  return res
})

const selectionColumn = computed<TableColumn>(() => ({
  type: 'selection',
  disabled(row: RowData) {
    return (
      props.checkedRowKeys.length === props.maxCheckedRows &&
      !props.checkedRowKeys.includes(rowKey(row))
    )
  },
}))

const PREDEFINED_COLUMNS: TableColumn = {
  key: 'name',
  title: 'Groups',
}

const timestampsColumns = computed(() => {
  const columns: TableColumn[] = []
  const timestamps: Set<number> = new Set()

  Object.values(preparedData.value).forEach(data => {
    Object.keys(data).forEach(ts => timestamps.add(+ts))
  })

  Array.from(timestamps)
    .toSorted((a, b) => a - b)
    .forEach(ts => {
      columns.push({
        key: ts,
        title: getYYYYMMDD(new Date(ts)),
        render: (rowData: RowData) => {
          const value = rowData[ts] || 0
          return value + '%'
        },
      })
    })

  return columns
})

const columns = computed<TableColumn[]>(() => {
  return [selectionColumn.value, PREDEFINED_COLUMNS, ...timestampsColumns.value]
})

const { scrollX } = useScrollX(timestampsColumns)
</script>
