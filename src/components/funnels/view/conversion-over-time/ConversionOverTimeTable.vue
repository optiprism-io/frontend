<template>
  <UiDataTable
    :columns="columns"
    :data="data"
    :scroll-x="scrollX"
    :loading="loading"
  />
</template>

<script setup lang="ts">
import { computed } from 'vue'

import UiDataTable from '@/components/uikit/UiDataTable.vue'

import { useScrollX } from '@/components/funnels/view/useScrollX'
import { DEFAULT_SEPARATOR } from '@/constants'
import { getYYYYMMDD } from '@/helpers/getStringDates'

import type { FunnelResponseStepsInner, FunnelResponseStepsInnerDataInner } from '@/api'
import type { RowData, TableColumn } from 'naive-ui/es/data-table/src/interface'

interface IProps {
  reportConversion: FunnelResponseStepsInner | undefined
  loading?: boolean
}

interface PreparedData {
  [group: string]: {
    [ts: number]: number
  }
}

const props = withDefaults(defineProps<IProps>(), {})

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
  return [PREDEFINED_COLUMNS, ...timestampsColumns.value]
})

const { scrollX } = useScrollX(timestampsColumns)
</script>
