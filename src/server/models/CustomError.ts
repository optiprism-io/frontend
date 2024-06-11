import { HttpStatusCode } from 'axios'
import { Response } from 'miragejs'

export class CustomError {
  BadRequest(msg = 'bad request') {
    return new Response(HttpStatusCode.BadRequest, {}, msg)
  }

  Unauthorized(msg = 'unauthorized') {
    return new Response(HttpStatusCode.Unauthorized, {}, msg)
  }

  NotFound(msg = 'not found') {
    return new Response(HttpStatusCode.NotFound, {}, msg)
  }

  NotImplemented(msg = 'not implemented') {
    return new Response(HttpStatusCode.NotImplemented, {}, msg)
  }
}
