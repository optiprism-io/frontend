import { BASE_PATH } from '@/api/base'
import { UpdateProjectRequest } from '@/api'
import { Request, Server } from 'miragejs'
import { Schema } from '@/server/types'
import { getRandomTiming } from '@/server/utils/getRandomTiming'
import { projectId } from '@/mocks/projects'
import { log } from 'console'

export function projectsRoutes(server: Server) {
  server.get(`${BASE_PATH}/v1/projects/:project_id`, getProject, {
    timing: getRandomTiming(),
  })

  server.put(`${BASE_PATH}/v1/projects/:project_id`, putProject, {
    timing: getRandomTiming(),
  })

  server.get(`${BASE_PATH}/v1/projects`, getProjects , {
    timing: getRandomTiming(),
  })
}

function getProjects(schema: Schema) {
  return  { data: schema.db.projects }
}

function getProject(schema: Schema) {
  return schema.db.projects[0]
}

function putProject(schema: Schema, request: Request) {
  const req = JSON.parse(request.requestBody) as UpdateProjectRequest
  return schema.db.projects.update(projectId, { ...req })
}
