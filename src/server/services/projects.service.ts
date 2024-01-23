import { BASE_PATH } from '@/api/base'
import { UpdateProjectRequest } from '@/api'
import { Request, Server } from 'miragejs'
import { Schema } from '@/server/types/types'
import { getRandomTiming } from '@/server/utils/getRandomTiming'
import { projectId } from '@/mocks/projects'

export function projectsRoutes(server: Server) {
  server.get(`${BASE_PATH}/v1/projects/:project_id`, getProject, {
    timing: getRandomTiming(),
  })

  server.put(`${BASE_PATH}/v1/projects/:project_id`, putProject, {
    timing: getRandomTiming(),
  })
}

function getProject(schema: Schema) {
  return schema.db.projects.at(0)
}

function putProject(schema: Schema, request: Request) {
  const { name, sessionTimeoutSeconds } = JSON.parse(request.requestBody) as UpdateProjectRequest
  return schema.db.projects.update(projectId, { name, sessionTimeoutSeconds })
}
