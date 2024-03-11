import { defineStore } from 'pinia'
import { schemaProjects } from '@/api/services/projects.service'
import { Project, UpdateProjectRequest } from '@/api'

interface ProjectState {
  project: Project | null
  projectId: number
  isLoading: boolean
  projects: Project[]
}

type ProjectsMap = {
  [key: number]: Project
}

interface ProjectsListItem {
  key: number
  nameDisplay: string
  value: number
}

const STORAGE_PROJECT_ID_KEY = 'projectId'

export const useProjectsStore = defineStore('projects', {
  state: (): ProjectState => ({
    project: null,
    projectId: 0,
    projects: [],
    isLoading: false,
  }),

  getters: {
    projectsMap(): ProjectsMap {
      return this.projects.reduce((objMap: ProjectsMap, item) => {
        objMap[Number(item.id)] = item
        return objMap
      }, {})
    },
    projectList(): ProjectsListItem[] {
      return this.projects.map((item: Project) => {
        return {
          key: item.id,
          nameDisplay: item.name,
          value: Number(item.id),
        }
      })
    },
    selectedProject(): Project | null {
      return this.projectsMap[this.projectId] || null
    },
    projectsLength(): number {
      return this.projects.length
    },
  },

  actions: {
    async getProjectId() {
      if (!this.projectId) {
        const projectId = Number(
          localStorage.getItem(STORAGE_PROJECT_ID_KEY) || this.projects[0]?.id || 0
        )

        if (projectId && this.projectsMap[projectId]) {
          this.projectId = projectId
          localStorage.setItem(STORAGE_PROJECT_ID_KEY, String(this.projectId))
        }
      }
    },
    setProjectId(projectId: number) {
      this.projectId = projectId
      localStorage.setItem(STORAGE_PROJECT_ID_KEY, String(projectId))
    },
    async getProject() {
      this.isLoading = true
      try {
        if (!this.projectId) throw Error
        const { data } = await schemaProjects.project(this.projectId)
        this.project = data
      } catch (error) {
        throw new Error('error get project')
      } finally {
        this.isLoading = false
      }
    },
    async getProjectsList() {
      this.isLoading = true
      try {
        const res = await schemaProjects.projectsList()

        this.projects = res.data?.data || []
      } catch (error) {
        throw new Error('error get projects list')
      } finally {
        this.isLoading = false
      }
    },
    async init() {
      if (this.projectList.length) return
      await this.getProjectsList()

      let projectId = Number(localStorage.getItem(STORAGE_PROJECT_ID_KEY))
      if (!this.projectsMap[projectId]) {
        projectId = Number(this.projects[0]?.id || 0)
      }
      this.setProjectId(projectId)
    },

    async saveProjectName(id: number, name: string) {
      try {
        await this.__updateProject(id, { name })
      } catch (error) {
        throw new Error('error save project name')
      }
    },

    async saveSessionDuration(id: number, sessionDurationSeconds: number) {
      try {
        await this.__updateProject(id, { sessionDurationSeconds })
      } catch (error) {
        throw new Error('error session duration')
      }
    },

    addProjectToList(project: Project) {
      this.projects.push(project)
    },

    async __updateProject(id: number, req: UpdateProjectRequest) {
      if (!this.projectId) throw Error
      const { data } = await schemaProjects.updateProject(id || this.projectId, req)

      if (data) {
        this.projects = this.projects.map(item => {
          return Number(item.id) === Number(data.id) ? data : item
        })
      }
      this.project = data
    },
  },
})
