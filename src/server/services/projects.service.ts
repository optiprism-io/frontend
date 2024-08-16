import { HttpStatusCode } from 'axios'
import { Response } from 'miragejs'

import { EMPTY_HEADER_RESPONSE, Stub } from '@/server/constants'
import { Project } from '@/server/models/Project'

import type { CreateProjectRequest, UpdateProjectRequest } from '@/api'
import type { Schema } from '@/server/types'
import type { Request, Server } from 'miragejs'

export function projectsRoutes(server: Server) {
  server.get('/projects/:project_id', getProject)
  server.post('/projects', postProject)
  server.put('/projects/:project_id', putProject)
  server.get('/projects', getProjects)
}

function getProjects(schema: Schema) {
  return { data: schema.db.projects }
}

function postProject(schema: Schema, request: Request) {
  const { name, sessionDurationSeconds } = JSON.parse(request.requestBody) as CreateProjectRequest

  if (name.toLowerCase() === Stub.TOAST)
    return new Response(HttpStatusCode.BadRequest, EMPTY_HEADER_RESPONSE, {
      error: {
        status: HttpStatusCode.BadRequest,
        message: Stub.ERROR,
      },
    })

  const newProject = new Project({ name, sessionDurationSeconds: Number(sessionDurationSeconds) })
  return schema.db.projects.insert(newProject)
}

function getProject(schema: Schema, request: Request) {
  return schema.db.projects.find(request.params.project_id)
}

function putProject(schema: Schema, request: Request) {
  const req = JSON.parse(request.requestBody) as UpdateProjectRequest
  return schema.db.projects.update(request.params.project_id, { ...req })
}
