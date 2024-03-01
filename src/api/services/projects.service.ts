import { CreateProjectRequest, ProjectsApi, UpdateProjectRequest } from '@/api'
import { config } from '@/api/services/config'

const api = new ProjectsApi(config)

export const schemaProjects = {
  project: async (projectId: number) => await api.project(projectId),
  projectsList: async () => await api.projectsList(),
  createProject: async (createProjectRequest: CreateProjectRequest) =>
    await api.createProject(createProjectRequest),
  updateProject: async (projectId: number, updateProjectRequest: UpdateProjectRequest) =>
    await api.updateProject(projectId, updateProjectRequest),
}
