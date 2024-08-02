export interface ChartElement {
  value: number
  label: string
  percentage: number
  percentageLabel: string
}

export interface ColumnStackedItem {
  columnName: string
  primary: ChartElement
  secondary: ChartElement
}

export interface ChartStackedItem {
  groupName: string
  elements: ColumnStackedItem[]
}
