import type { Ref } from 'vue'
import { computed } from 'vue'

const WIDTH_ONE_COLUMN = 250 // value calculated experimentally

export function useScrollX(columns: Ref<any[]>) {
  const scrollX = computed(() => columns.value.length * WIDTH_ONE_COLUMN)

  return { scrollX }
}
