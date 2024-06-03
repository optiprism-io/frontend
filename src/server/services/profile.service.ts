import {
  SetProfilePasswordRequest,
  UpdateProfileEmailRequest,
  UpdateProfileNameRequest,
  UpdateProfilePasswordRequest,
} from '@/api'
import { Request, Response, Server } from 'miragejs'
import { getErrorResponse } from '@/server/utils/getErrorResponse'
import { userId } from '@/mocks/profile'
import { Profile } from '@/server/models/Profile'
import {
  ADMIN_PASSWORD,
  EMPTY_HEADER_RESPONSE,
  EMPTY_SUCCESS_RES,
  Stub,
  Tokens,
} from '@/server/constants'
import { Schema } from '@/server/types'
import { HttpStatusCode } from 'axios'

export function profileRoutes(server: Server) {
  server.get('/profile', getProfile)
  server.put('/profile/name', putProfileName)
  server.put('/profile/email', putProfileEmail)
  server.put('/profile/password', putProfilePassword)
  server.put('/profile/set-password', putSetProfilePassword)
}

function getProfile(schema: Schema) {
  const profile = schema.db.profile.at(0)
  return new Profile({
    id: profile.id,
    name: profile.name,
    email: profile.email,
    timezone: profile.timezone,
    forceUpdatePassword: !profile.password || profile.password === ADMIN_PASSWORD,
  })
}

function putProfileName(schema: Schema, request: Request) {
  const { name } = JSON.parse(request.requestBody) as UpdateProfileNameRequest

  if (name.toLowerCase() === Stub.TOAST)
    return new Response(HttpStatusCode.BadRequest, EMPTY_HEADER_RESPONSE, {
      error: {
        status: HttpStatusCode.BadRequest,
        message: Stub.ERROR,
      },
    })

  if (name.toLowerCase() === Stub.ERROR)
    return new Response(
      HttpStatusCode.BadRequest,
      EMPTY_HEADER_RESPONSE,
      getErrorResponse([['name', 'Name is incorrect']])
    )

  schema.db.profile.update(userId, { name })
  return EMPTY_SUCCESS_RES
}

function putProfileEmail(schema: Schema, request: Request) {
  const { email, password } = JSON.parse(request.requestBody) as UpdateProfileEmailRequest

  if (password.toLowerCase() === Stub.TOAST)
    return new Response(HttpStatusCode.BadRequest, EMPTY_HEADER_RESPONSE, {
      error: {
        status: HttpStatusCode.BadRequest,
        message: Stub.ERROR,
      },
    })

  if (password.toLowerCase() === Stub.ERROR)
    return new Response(
      HttpStatusCode.BadRequest,
      EMPTY_HEADER_RESPONSE,
      getErrorResponse([['password', 'Password is incorrect']])
    )

  schema.db.profile.update(userId, { email })
  return Tokens
}

function putProfilePassword(schema: Schema, request: Request) {
  const { password, newPassword } = JSON.parse(request.requestBody) as UpdateProfilePasswordRequest

  if (password.toLowerCase() === Stub.TOAST || newPassword.toLowerCase() === Stub.TOAST)
    return new Response(HttpStatusCode.BadRequest, EMPTY_HEADER_RESPONSE, {
      error: {
        status: HttpStatusCode.BadRequest,
        message: Stub.ERROR,
      },
    })

  if (password.toLowerCase() === Stub.ERROR && newPassword.toLowerCase() === Stub.ERROR)
    return new Response(
      HttpStatusCode.BadRequest,
      EMPTY_HEADER_RESPONSE,
      getErrorResponse([
        ['password', 'Password is incorrect'],
        ['newPassword', 'Password is incorrect'],
      ])
    )

  if (password.toLowerCase() === Stub.ERROR)
    return new Response(
      HttpStatusCode.BadRequest,
      EMPTY_HEADER_RESPONSE,
      getErrorResponse([['password', 'Password is incorrect']])
    )

  if (newPassword.toLowerCase() === Stub.ERROR)
    return new Response(
      HttpStatusCode.BadRequest,
      EMPTY_HEADER_RESPONSE,
      getErrorResponse([['newPassword', 'Password is incorrect']])
    )

  schema.db.profile.update(userId, { password: newPassword })
  return Tokens
}

function putSetProfilePassword(schema: Schema, request: Request) {
  const { password } = JSON.parse(request.requestBody) as SetProfilePasswordRequest

  schema.db.profile.update(userId, { password })
  return Tokens
}
