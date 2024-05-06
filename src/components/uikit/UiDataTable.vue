<template>
    <NDataTable
      :columns="columns"
      :data="data"
      :bordered="bordered"
      :bottom-bordered="bottomBordered"
      :single-line="singleLine"
      :virtual-scroll="virtualScroll"
      :single-column="singleColumn"
      :max-height="maxHeight"
    />
</template>

<script setup lang="ts">
import { NDataTable, } from 'naive-ui'
import { TableColumns, RowData } from 'naive-ui/es/data-table/src/interface'

type DataTableProps = {
  columns: TableColumns<any>
  data: RowData[]
  bordered?: boolean
  bottomBordered?: boolean
  virtualScroll?: boolean
  singleLine?: boolean
  singleColumn?: boolean
  maxHeight?: string | number
}

withDefaults(
    defineProps<DataTableProps>(),
    {
        singleLine: true,
    }
);
</script>