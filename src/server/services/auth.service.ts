import { BASE_PATH } from '@/api/base'
import { TokensResponse } from '@/api'
import { Response, Server } from 'miragejs'
import { getRandomTiming } from '@/server/utils/getRandomTiming'
import { HttpStatusCode } from 'axios'
import { EMPTY_HEADER_RESPONSE, Tokens } from '@/server/constants'
import { getErrorResponse } from '@/server/utils/getErrorResponse'

const MIN_EMAIL_LENGTH = 8
const MIN_PASSWORD_LENGTH = 5

export function authRoutes(server: Server) {
  server.post(`${BASE_PATH}/v1/auth/login`, (_, request) => {
    const property = JSON.parse(request.requestBody)

    if (property.email.length < MIN_EMAIL_LENGTH)
      return new Response(
        HttpStatusCode.BadRequest,
        EMPTY_HEADER_RESPONSE,
        getErrorResponse([['email', 'Email is too short']])
      )

    if (property.password.length < MIN_PASSWORD_LENGTH)
      return new Response(
        HttpStatusCode.BadRequest,
        EMPTY_HEADER_RESPONSE,
        getErrorResponse([['password', 'Password is too short']])
      )

    return Tokens
  })

  server.post(`${BASE_PATH}/v1/auth/refresh-token`, (): TokensResponse => Tokens, {
    timing: getRandomTiming(),
  })
}
