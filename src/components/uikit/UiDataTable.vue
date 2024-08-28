<template>
  <NDataTable
    :columns="tableColumns"
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
    :loading="loading"
    @update:checked-row-keys="emit('update:checked-row-keys', $event)"
  />
</template>

<script setup lang="ts">
import type { VNodeChild } from 'vue'
import { computed } from 'vue'

import { NDataTable } from 'naive-ui'

import type { EllipsisProps } from 'naive-ui'
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
  loading?: boolean

  // Custom props
  ellipsis?: EllipsisProps | boolean
  resizable?: boolean
}

const props = withDefaults(defineProps<DataTableProps>(), {
  singleLine: true,
  maxHeight: undefined,
  checkedRowKeys: undefined,
  renderCell: undefined,
  rowKey: undefined,
  scrollX: undefined,
  loading: false,

  // Custom props
  // eslint-disable-next-line vue/require-valid-default-prop
  ellipsis: () => ({
    tooltip: true,
  }),
  resizable: true,
})

const tableColumns = computed(() =>
  props.columns.map(column => ({ ellipsis: props.ellipsis, resizable: props.resizable, ...column }))
)

const emit = defineEmits<{
  (e: 'update:checked-row-keys', keys: Array<string | number>): void
}>()
</script>
