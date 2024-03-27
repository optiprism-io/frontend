import { useDateFormat } from '@vueuse/core'
import {
  DataTableResponse,
  DataTableResponseColumnsInner,
  DataType,
} from '@/api'
import { getStringDateByFormat } from '@/helpers/getStringDates'
import { Column, Row } from '@/components/uikit/UiTable/UiTable'

const FIXED_COLUMNS_TYPES_DEFAULT: { [key: string]: string } = {
  dimension: 'dimension',
}

type ColumnMap = {
  [key: string]: Column
}

export type ResponseUseDataTable = {
  hasData: boolean
  tableColumns: ColumnMap
  tableData: Row[]
  tableColumnsValues: Column[]
  lineChart: any[]
  pieChart: any[]
}

export default function useDataTable(
  payload: DataTableResponse,
  noWrapContent = false,
  fixedColumn?: { [key: string]: string }
): ResponseUseDataTable {

  const columns = (Array.isArray(payload?.columns) ? payload.columns : [])
  const fixedColumnsTypes = fixedColumn || FIXED_COLUMNS_TYPES_DEFAULT
  const dimensionColumns: DataTableResponseColumnsInner[] = []
  const totalColumnData: number[] = []
  const tableColumns: { [key: string]: Column } = {}
  const tableData: Row[] = []
  const lineChart: any[] = []
  let pieChart = [];

  columns.forEach((column, i, arr) => {
    const fixed = Boolean(fixedColumnsTypes[column.type]);
    const lastFixed = !fixedColumnsTypes[arr[i + 1]?.type];
        
    if (column.type === 'dimension') {
      dimensionColumns.push(column)
    }

    tableColumns[column.name] = {
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
            category: dimensionColumns
              .map((columnInner: DataTableResponseColumnsInner) => {
                return (columnInner.data || [])[indexData] || ''
              })
              .filter(item => Boolean(item))
              .join(', '),
          })
  
          if (column.dataType === DataType.Decimal) {
            totalColumnData.push(Number(totalColumnData[indexData] || 0) + Number(item))
          }
        }

        if (!tableData[indexData]) {
          tableData[indexData] = []
        }
        
        let value: number | string | boolean = item || '';

        if (column.dataType === DataType.Timestamp && item) {
          value = useDateFormat(+item, 'YYYY-MM-DD HH:mm')?.value
        }
        
        tableData[indexData][i] = {
          key: column.name,
          value: item,
          title: value || '-',
          lastFixed: lastFixed,
          fixed: fixed,
          nowrap: noWrapContent,
        }
      });
    }
  });
  
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
    tableColumns,
    tableData,
    tableColumnsValues: Object.values(tableColumns),
    lineChart,
    pieChart,
  }
}
