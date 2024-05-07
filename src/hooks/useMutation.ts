import { ref } from 'vue'
import { ErrorResponse } from '@/api'

/* Simple version of the function - https://tanstack.com/query/latest/docs/framework/vue/reference/useMutation */
export function useMutation<T, A extends any[]>(fn: (...args: A) => Promise<T>) {
  const isLoading = ref(false)
  const error = ref<Error | null>(null)

  async function mutate(...args: A) {
    isLoading.value = true
    error.value = null
    try {
      return await fn(...args)
    } catch (e) {
      if (e instanceof Error) error.value = e
      if (isServerErrorWithMsg(e)) error.value = new Error(e.error.message)
    } finally {
      isLoading.value = false
    }
  }

  return { mutate, isLoading, error }
}

function isServerErrorWithMsg(e: any): e is Required<ErrorResponse> {
  return e && e.error && typeof e.error.message === 'string'
}
