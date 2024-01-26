import { ProjectsApi, UpdateProjectRequest } from '@/api'
import { config } from '@/api/services/config'

const api = new ProjectsApi(config)

const schemaProjects = {
  project: async (projectId: number) => await api.project(projectId),
  updateProject: async (projectId: number, updateProjectRequest: UpdateProjectRequest) =>
    await api.updateProject(projectId, updateProjectRequest),
}

export default schemaProjects
