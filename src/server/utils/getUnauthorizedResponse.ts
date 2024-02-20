import { Response } from 'miragejs'
import { HttpStatusCode } from 'axios'

export function getUnauthorizedResponse() {
  return new Response(HttpStatusCode.Unauthorized)
}
