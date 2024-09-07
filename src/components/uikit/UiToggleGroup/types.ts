export interface UiToggleGroupItem<T> {
  key: string | number
  nameDisplay: string
  value: T
  selected?: boolean
  disabled?: boolean
  iconBefore?: string
  iconAfter?: string
}
