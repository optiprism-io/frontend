import { HttpStatusCode } from 'axios'
import { Response } from 'miragejs'

import { userId } from '@/mocks/profile'
import {
  ADMIN_EMAIL,
  ADMIN_PASSWORD,
  EMPTY_HEADER_RESPONSE,
  EMPTY_SUCCESS_RES,
  Stub,
  Tokens,
} from '@/server/constants'
import { Profile } from '@/server/models/Profile'
import { MIN_PASSWORD_LENGTH } from '@/server/services/auth.service'
import { getErrorResponse } from '@/server/utils/getErrorResponse'

import type {
  SetProfileEmailRequest,
  SetProfilePasswordRequest,
  UpdateProfileEmailRequest,
  UpdateProfileNameRequest,
  UpdateProfilePasswordRequest,
} from '@/api'
import type { Schema } from '@/server/types'
import type { Request, Server } from 'miragejs'

export function profileRoutes(server: Server) {
  server.get('/profile', getProfile)
  server.put('/profile/name', putProfileName)
  server.put('/profile/email', putProfileEmail)
  server.put('/profile/set-email', putProfileEmail)
  server.put('/profile/password', putProfilePassword)
  server.put('/profile/set-password', putSetProfilePassword)
}

function getProfile(schema: Schema) {
  const profile = schema.db.profile.at(0)
  return new Profile({
    name: profile.name,
    email: profile.email,
    forceUpdatePassword: !profile.password || profile.password === ADMIN_PASSWORD,
    forceUpdateEmail: !profile.email || profile.email === ADMIN_EMAIL,
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
  const res = JSON.parse(request.requestBody) as (UpdateProfileEmailRequest | SetProfileEmailRequest)

  if ('password' in res) {
    if (res.password.toLowerCase() === Stub.TOAST)
      return new Response(HttpStatusCode.BadRequest, EMPTY_HEADER_RESPONSE, {
        error: {
          status: HttpStatusCode.BadRequest,
          message: Stub.ERROR,
        },
      })

    if (res.password.toLowerCase() === Stub.ERROR)
      return new Response(
        HttpStatusCode.BadRequest,
        EMPTY_HEADER_RESPONSE,
        getErrorResponse([['password', 'Password is incorrect']])
      )
  }

  schema.db.profile.update(userId, { email: res.email })
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

  if (password.toLowerCase() === Stub.TOAST)
    return new Response(HttpStatusCode.BadRequest, EMPTY_HEADER_RESPONSE, {
      error: {
        status: HttpStatusCode.BadRequest,
        message: Stub.ERROR,
      },
    })

  if (password.length < MIN_PASSWORD_LENGTH)
    return new Response(
      HttpStatusCode.BadRequest,
      EMPTY_HEADER_RESPONSE,
      getErrorResponse([['password', 'Password is too short']])
    )

  return Tokens
}
