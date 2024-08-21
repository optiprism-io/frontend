<template>
  <NDataTable
    :columns="columns"
    :data="data"
    :checked-row-keys="checkedRowKeys"
    :bordered="bordered"
    :bottom-bordered="bottomBordered"
    :single-line="singleLine"
    :virtual-scroll="virtualScroll"
    :single-column="singleColumn"
    :max-height="maxHeight"
    :scroll-x="scrollX"
    :render-cell="renderCell"
    :row-key="rowKey"
    @update:checked-row-keys="emit('update:checked-row-keys', $event)"
  />
</template>

<script setup lang="ts">
import type { VNodeChild } from 'vue'

import { NDataTable } from 'naive-ui'

import type {
  InternalRowData,
  RowData,
  RowKey,
  TableBaseColumn,
  TableColumns,
} from 'naive-ui/es/data-table/src/interface'

type DataTableProps = {
  columns: TableColumns<any>
  data: RowData[]
  checkedRowKeys?: RowKey[]
  renderCell?:
    | ((value: any, rowData: object, column: TableBaseColumn<InternalRowData>) => VNodeChild)
    | undefined
  rowKey?: (row: any) => RowKey
  bordered?: boolean
  bottomBordered?: boolean
  virtualScroll?: boolean
  singleLine?: boolean
  singleColumn?: boolean
  maxHeight?: string | number
  scrollX?: string | number
}

withDefaults(defineProps<DataTableProps>(), {
  singleLine: true,
  maxHeight: undefined,
  checkedRowKeys: undefined,
  renderCell: undefined,
  rowKey: undefined,
  scrollX: undefined,
})

const emit = defineEmits<{
  (e: 'update:checked-row-keys', keys: Array<string | number>): void
}>()
</script>
