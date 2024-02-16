import { CreateProjectRequest, UpdateProjectRequest } from '@/api'
import { Request, Server } from 'miragejs'
import { Schema } from '@/server/types'
import { getNewProject } from '@/mocks/projects'

export function projectsRoutes(server: Server) {
  server.get('/projects/:project_id', getProject)
  server.post('/projects', postProject)
  server.put('/projects/:project_id', putProject)
  server.get('/projects', getProjects)
}

function getProjects(schema: Schema) {
  return  { data: schema.db.projects }
}

function postProject(schema: Schema, request: Request) {
  const { name, sessionDurationSeconds } = JSON.parse(request.requestBody) as CreateProjectRequest
  const newProject = getNewProject({ name, sessionDurationSeconds})
  return schema.db.projects.insert(newProject)
}

function getProject(schema: Schema, request: Request) {
  return schema.db.projects.find(request.params.project_id)
}

function putProject(schema: Schema, request: Request) {
  const req = JSON.parse(request.requestBody) as UpdateProjectRequest
  return schema.db.projects.update(request.params.project_id, { ...req })
}
