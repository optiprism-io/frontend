import { ref } from 'vue'

import type { DataTableRowKey } from 'naive-ui'

export const MAX_CHECKED_ROWS = 12
export const DEFAULT_CHECKED_ROWS = 5

export function useCheckedRows() {
  const checkedRowKeys = ref<DataTableRowKey[]>([])

  function setCheckedRowKeys(payload: DataTableRowKey[]) {
    checkedRowKeys.value = payload
  }

  return {
    checkedRowKeys,
    setCheckedRowKeys,
  }
}
