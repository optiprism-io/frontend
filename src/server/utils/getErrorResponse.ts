import { fromPairs } from 'lodash'
import { HttpStatusCode } from 'axios'

type KeyError = string
type MessageError = string

interface ServerErrorResponse {
  error: {
    status: number
    fields?: Record<string, string>
    message?: string
  }
}

export function getErrorResponse(errors: [KeyError, MessageError][]): ServerErrorResponse {
  const fields = fromPairs(errors)

  return {
    error: {
      status: HttpStatusCode.BadRequest,
      fields,
    },
  }
}