import { defineComponent, ref } from 'vue'
import {
  DataTableResponse,
  DataTableResponseColumnsInner,
  DataTableResponseColumnsInnerData,
} from '@/api'
import { getStringDateByFormat } from '@/helpers/getStringDates'
import { Column, Row } from '@/components/uikit/UiTable/UiTable'
import UiTableCellDate from '@/components/uikit/UiTable/UiTableCellDate.vue'

const FIXED_COLUMNS_TYPES_DEFAULT = ['dimension', 'metric']

const componentsMap: { [key: string]: ReturnType<typeof defineComponent> } = {
  created_at: UiTableCellDate,
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
  fixedColumn?: string[]
): ResponseUseDataTable {
  const fixedColumnsTypes = fixedColumn || FIXED_COLUMNS_TYPES_DEFAULT

  const columnsData = (payload?.columns || []).reduce(
    (acc: DataTableResponseColumnsInnerData[], item) => {
      if (Array.isArray(item.data) && item.data.length) {
        acc.push(item.data)
      } else {
        acc.push([])
      }
      return acc
    },
    []
  )

  const tableRowsLength = columnsData.reduce((sum, columnData) => {
    return columnData.length > sum ? columnData.length : sum
  }, 0)

  const hasData = Boolean(payload?.columns && payload?.columns.length && columnsData.length)
  const dimensionColumns = payload?.columns
    ? payload.columns.filter(column => column.type === 'dimension')
    : []
  const metricColumns = payload?.columns
    ? payload?.columns.filter(column => column.type === 'metric')
    : []
  const metricValueColumns = payload?.columns
    ? payload?.columns.filter(column => column.type === 'metricValue')
    : []

  const totalColumn = metricValueColumns.reduce(
    (total, item) => {
      total.data = item.data.map((value, i) => {
        return Number(total.data[i] || 0) + Number(value)
      })
      return total
    },
    { data: [] as DataTableResponseColumnsInnerData }
  )

  const fixedColumnLength = dimensionColumns.length + metricColumns.length - 1

  let tableColumns = {}
  let tableData: Row[] = []
  let lineChart = []
  let pieChart: any[] = []

  if (payload?.columns) {
    tableColumns = {
      ...payload?.columns.reduce((acc: any, column: DataTableResponseColumnsInner, i: number) => {
        if (column.name && column.type) {
          if (fixedColumnsTypes.includes(column.type)) {
            acc[column.name] = {
              value: column.name,
              title: column.name,
              truncate: true,
              lastFixed: fixedColumnLength === i,
              fixed: true,
              nowrap: noWrapContent,
              index: i,
            }
          } else {
            acc[column.name] = {
              value: column.name,
              title: getStringDateByFormat(column.name, '%d %b, %Y'),
              nowrap: noWrapContent,
              index: i,
            }
          }
        }

        return acc
      }, {}),
    }

    tableData = payload?.columns.reduce(
      (tableRows: Row[], column: DataTableResponseColumnsInner, indexColumn: number) => {
        const isFixedColumn = fixedColumnsTypes.includes(column.type)

        if (column.data) {
          column.data.forEach((item, i) => {
            if (!tableRows[i]) {
              tableRows[i] = []
            }

            tableRows[i][indexColumn] = {
              key: column.name,
              value: item,
              title: item || '-',
              nowrap: noWrapContent,
              lastFixed: isFixedColumn && indexColumn === fixedColumnLength,
              fixed: isFixedColumn,
              component: componentsMap[column.name] || null,
            }
          })
        } else {
          for (let i = 0; i < tableRowsLength; i++) {
            tableRows[i][indexColumn] = {
              key: column.name,
              value: undefined,
              title: '-',
              nowrap: noWrapContent,
              lastFixed: isFixedColumn && indexColumn === fixedColumnLength,
              fixed: isFixedColumn,
              component: componentsMap[column.name] || null,
            }
          }
        }

        return tableRows
      },
      []
    )
  }

  const tableColumnsValues: Column[] = Object.values(tableColumns)

  if (hasData) {
    lineChart = metricValueColumns.reduce((acc: any[], item: DataTableResponseColumnsInner) => {
      if (item.data) {
        item.data.forEach((value, indexValue: number) => {
          acc.push({
            date: item.name ? new Date(item.name) : '',
            value: value ?? 0,
            category: dimensionColumns
              .map((column: DataTableResponseColumnsInner) => {
                return column.data ? column.data[indexValue] : ''
              })
              .filter(item => Boolean(item))
              .join(', '),
          })
        })
      }
      return acc
    }, [])
  }

  if (hasData && totalColumn?.data) {
    pieChart = totalColumn.data.map((item, index: number) => {
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
  }

  return {
    hasData,
    tableColumns,
    tableData,
    tableColumnsValues,
    lineChart,
    pieChart,
  }
}
