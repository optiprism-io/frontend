import { useDateFormat } from '@vueuse/core'

import { DataType } from '@/api'
import { getStringDateByFormat } from '@/helpers/getStringDates'

import type { DataTableResponse, DataTableResponseColumnsInner } from '@/api'
import type { Column, Row } from '@/components/uikit/UiTable/UiTable'

const FIXED_COLUMNS_TYPES_DEFAULT: { [key: string]: string } = {
  dimension: 'dimension',
}

type ColumnMap = {
  [key: string]: Column
}

export type ResponseUseDataTable = {
  hasData: boolean
  columns: ColumnMap
  rows: Row[]
  tableColumnsValues: Column[]
  lineChart: any[]
  pieChart: any[]
}

export default function useDataTable(
  payload: DataTableResponse,
  noWrapContent = false,
  fixedColumn?: { [key: string]: string }
): ResponseUseDataTable {
  const payloadColumns = Array.isArray(payload?.columns) ? payload.columns : []
  const fixedColumnsTypes = fixedColumn || FIXED_COLUMNS_TYPES_DEFAULT
  const dimensionColumns: DataTableResponseColumnsInner[] = []
  const totalColumnData: number[] = []
  const columns: { [key: string]: Column } = {}
  const rows: Row[] = []
  const lineChart: any[] = []
  let pieChart = []

  payloadColumns.forEach((column, i, arr) => {
    const fixed = Boolean(fixedColumnsTypes[column.type])
    const lastFixed = !fixedColumnsTypes[arr[i + 1]?.type]

    if (column.type === 'dimension') {
      dimensionColumns.push(column)
    }

    columns[column.name] = {
      value: column.name,
      title: fixed ? getStringDateByFormat(column.name, '%d %b, %Y') : column.name,
      truncate: true,
      lastFixed: lastFixed,
      fixed: fixed,
      nowrap: noWrapContent,
      index: i,
    }

    if (column.data?.length) {
      column.data.forEach((item, indexData) => {
        if (column.type !== 'dimension') {
          lineChart.push({
            date: column.name ? new Date(column.name) : '',
            value: item ?? 0,
            category: dimensionColumns.reduce(
              (categoryName, dimensionColumn: DataTableResponseColumnsInner, i) => {
                if (dimensionColumn.name !== 'Average') {
                  const value = (dimensionColumn.data || [])[indexData] || ''
                  return categoryName + (dimensionColumns[i + 1] ? `, ${value}` : '')
                }

                return categoryName
              },
              ''
            ),
          })

          if (column.dataType === DataType.Decimal) {
            totalColumnData[indexData] = Number(totalColumnData[indexData] || 0) + Number(item)
          }
        }

        if (!rows[indexData]) {
          rows[indexData] = []
        }

        let value: number | string | boolean = item || ''

        if (column.dataType === DataType.Timestamp && item) {
          value = useDateFormat(+item, 'YYYY-MM-DD HH:mm')?.value
        }

        rows[indexData][i] = {
          key: column.name,
          value: item,
          title: value || '-',
          lastFixed: lastFixed,
          fixed: fixed,
          nowrap: noWrapContent,
        }
      })
    }
  })

  pieChart = totalColumnData.map((item, index: number) => {
    return {
      type: dimensionColumns
        .map((column: DataTableResponseColumnsInner) => {
          return column.data ? column.data[index] : ''
        })
        .filter(item => Boolean(item))
        .join(', '),
      value: item,
    }
  })

  return {
    hasData: !!totalColumnData.length,
    columns,
    rows,
    tableColumnsValues: Object.values(columns),
    lineChart,
    pieChart,
  }
}
