import {
    DataTableResponse,
    DataTableResponseColumnsInner,
    DataTableResponseColumnsInnerData,
} from '@/api'
import {getStringDateByFormat} from '@/helpers/getStringDates'
import {Cell, Column, Row} from '@/components/uikit/UiTable/UiTable'

const FIXED_COLUMNS_TYPES = ['dimension', 'metric']

type ColumnMap = {
    [key: string]: Column;
}

export type ResponseUseDataTable = {
    hasData: boolean
    tableColumns: ColumnMap
    tableData: Row[]
    tableColumnsValues: Column[]
    lineChart: any[]
    pieChart: any[]
}

type OptionsType = {
    accName: string | null,
}

export default function useDataTable(
    payload: DataTableResponse,
    noWrapContent = false,
): ResponseUseDataTable {
    const columnsData = (payload?.columns || []).reduce((acc: DataTableResponseColumnsInnerData[], item) => {
        if (Array.isArray(item.data) && item.data.length) {
            acc.push(item.data);
        } else {
            acc.push([]);
        }
        return acc;
    }, []);

    const tableRowsLength = columnsData.reduce((sum, columnData) => {
        return columnData.length > sum ? columnData.length : sum;;
    }, 0);

    const hasData = Boolean(payload?.columns && payload?.columns.length && columnsData.length);
    const dimensionColumns = payload?.columns ? payload.columns.filter(column => column.type === 'dimension') : [];
    const metricColumns = payload?.columns ? payload?.columns.filter(column => column.type === 'metric') : [];
    const metricValueColumns = payload?.columns ? payload?.columns.filter(column => column.type === 'metricValue') : [];
    const totalColumn = metricValueColumns.reduce((total, item) => {
        total.data = item.data.map((value, i) => {
            return Number((total.data[i] || 0)) + Number(value);
        });
        return total;
    }, {data: [] as DataTableResponseColumnsInnerData });
    const fixedColumnLength = dimensionColumns.length + metricColumns.length - 1;

    let tableColumns = {}
    let tableData: Row[] = []
    let lineChart = []
    let pieChart: any[] = []

    if (payload?.columns) {
        tableColumns = {
            ...payload?.columns.reduce((acc: any, column: DataTableResponseColumnsInner, i: number) => {
                if (column.name && column.type) {
                    if (FIXED_COLUMNS_TYPES.includes(column.type)) {
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

        tableData = payload?.columns.reduce((tableRows: Row[], column: DataTableResponseColumnsInner, indexColumn: number) => {
            const isFixedColumn = FIXED_COLUMNS_TYPES.includes(column.type);

            if (column.data) {
                column.data.forEach((item, i) => {
                    if (!tableRows[i]) {
                        tableRows[i] = []
                    }

                    tableRows[i][indexColumn] = {
                        key: column.name,
                        value: item,
                        title: item || '-',
                        nowrap: isFixedColumn && noWrapContent,
                        lastFixed: isFixedColumn && indexColumn === fixedColumnLength,
                        fixed: isFixedColumn,
                    }
                })
            } else {
                for (let i = 0; i < tableRowsLength; i++) {
                    tableRows[i][indexColumn] = {
                        key: column.name,
                        value: undefined,
                        title: '-',
                        nowrap: isFixedColumn && noWrapContent,
                        lastFixed: isFixedColumn && indexColumn === fixedColumnLength,
                        fixed: isFixedColumn,
                    };
                }
            }

            return tableRows
        }, [])
    }

    const tableColumnsValues: Column[] = Object.values(tableColumns)

    if (hasData) {
        lineChart = metricValueColumns.reduce((acc: any[], item: DataTableResponseColumnsInner) => {
            if (item.data) {
                item.data.forEach((value, indexValue: number) => {

                    acc.push({
                        date: item.name ? new Date(item.name) : '',
                        value,
                        category: dimensionColumns.map((column: DataTableResponseColumnsInner) => {
                            return column.data ? column.data[indexValue] : ''
                        }).filter(item => Boolean(item)).join(', '),
                    });
                });
            }
            return acc
        }, [])
    }

    if (hasData && totalColumn?.data) {
        pieChart = totalColumn.data.map((item, index: number) => {
            return {
                type: dimensionColumns.map((column: DataTableResponseColumnsInner) => {
                    return column.data ? column.data[index] : ''
                }).filter(item => Boolean(item)).join(', '),
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
