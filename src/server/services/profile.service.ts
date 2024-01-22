import { BASE_PATH } from '@/api/base'
import {
  UpdateProfileEmailRequest,
  UpdateProfileNameRequest,
  UpdateProfilePasswordRequest,
} from '@/api'
import { Stub } from '@/server/constants/stub'
import { Request, Response, Server } from 'miragejs'
import { HttpStatusCode } from '@/server/constants/httpStatusCode'
import { getErrorResponse } from '@/server/utils/getErrorResponse'
import { userId } from '@/mocks/profile'
import { EMPTY_HEADER_RESPONSE, EMPTY_SUCCESS_RES } from '@/server/constants/empty'
import { Tokens } from '@/server/constants/tokens'
import { Schema } from '@/server/types/types'
import { getRandomTiming } from '@/server/utils/getRandomTiming'

export function profileRoutes(server: Server) {
  server.get(`${BASE_PATH}/v1/profile`, getProfile, { timing: getRandomTiming() })
  server.put(`${BASE_PATH}/v1/profile/name`, putProfileName, { timing: getRandomTiming() })
  server.put(`${BASE_PATH}/v1/profile/email`, putProfileEmail, { timing: getRandomTiming() })
  server.put(`${BASE_PATH}/v1/profile/password`, putProfilePassword, { timing: getRandomTiming() })
}

function getProfile(schema: Schema) {
  return schema.db.profile.at(0)
}

function putProfileName(schema: Schema, request: Request) {
  const { name } = JSON.parse(request.requestBody) as UpdateProfileNameRequest

  if (name.toLowerCase() === Stub.TOAST)
    return new Response(HttpStatusCode.BAD_REQUEST, EMPTY_HEADER_RESPONSE, {
      error: {
        status: HttpStatusCode.BAD_REQUEST,
        message: Stub.ERROR,
      },
    })

  if (name.toLowerCase() === Stub.ERROR)
    return new Response(
      HttpStatusCode.BAD_REQUEST,
      EMPTY_HEADER_RESPONSE,
      getErrorResponse([['name', 'Name is incorrect']])
    )

  schema.db.profile.update(userId, { name })
  return EMPTY_SUCCESS_RES
}

function putProfileEmail(schema: Schema, request: Request) {
  const { email, password } = JSON.parse(request.requestBody) as UpdateProfileEmailRequest

  if (password.toLowerCase() === Stub.TOAST)
    return new Response(HttpStatusCode.BAD_REQUEST, EMPTY_HEADER_RESPONSE, {
      error: {
        status: HttpStatusCode.BAD_REQUEST,
        message: Stub.ERROR,
      },
    })

  if (password.toLowerCase() === Stub.ERROR)
    return new Response(
      HttpStatusCode.BAD_REQUEST,
      EMPTY_HEADER_RESPONSE,
      getErrorResponse([['password', 'Password is incorrect']])
    )

  schema.db.profile.update(userId, { email })
  return Tokens
}

function putProfilePassword(schema: Schema, request: Request) {
  const { password, newPassword } = JSON.parse(request.requestBody) as UpdateProfilePasswordRequest

  if (password.toLowerCase() === Stub.TOAST || newPassword.toLowerCase() === Stub.TOAST)
    return new Response(HttpStatusCode.BAD_REQUEST, EMPTY_HEADER_RESPONSE, {
      error: {
        status: HttpStatusCode.BAD_REQUEST,
        message: Stub.ERROR,
      },
    })

  if (password.toLowerCase() === Stub.ERROR && newPassword.toLowerCase() === Stub.ERROR)
    return new Response(
      HttpStatusCode.BAD_REQUEST,
      EMPTY_HEADER_RESPONSE,
      getErrorResponse([
        ['password', 'Password is incorrect'],
        ['newPassword', 'Password is incorrect'],
      ])
    )

  if (password.toLowerCase() === Stub.ERROR)
    return new Response(
      HttpStatusCode.BAD_REQUEST,
      EMPTY_HEADER_RESPONSE,
      getErrorResponse([['password', 'Password is incorrect']])
    )

  if (newPassword.toLowerCase() === Stub.ERROR)
    return new Response(
      HttpStatusCode.BAD_REQUEST,
      EMPTY_HEADER_RESPONSE,
      getErrorResponse([['newPassword', 'Password is incorrect']])
    )

  schema.db.profile.update(userId, { password: newPassword })
  return Tokens
}
