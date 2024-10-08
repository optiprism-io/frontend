import { HttpStatusCode } from 'axios'
import { Response } from 'miragejs'

import { EMPTY_HEADER_RESPONSE, Tokens } from '@/server/constants'
import { getErrorResponse } from '@/server/utils/getErrorResponse'

import type { TokensResponse } from '@/api'
import type { Server } from 'miragejs';

const MIN_EMAIL_LENGTH = 8
export const MIN_PASSWORD_LENGTH = 5

export function authRoutes(server: Server) {
  server.post('/auth/login', (_, request) => {
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

  server.post('/auth/refresh-token', (): TokensResponse => Tokens)
}
