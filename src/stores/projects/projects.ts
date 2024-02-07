import { defineStore } from 'pinia'
import { useAuthStore } from '@/stores/auth/auth'
import projectsService from '@/api/services/projects.service'
import { Project, UpdateProjectRequest } from '@/api'
import { safeParse } from 'valibot'
import { moreThanZeroScheme, notEmptyStringScheme } from '@/utils/validationSchemes'
import { isErrorResponseError } from '@/stores/profile/types'
import { ProjectEdit, ProjectErrors } from '@/stores/projects/types'

interface ProjectState {
  project: Project | null
  projectId: number | null
  isLoading: boolean
  errors: ProjectErrors
  isEdit: ProjectEdit
  projects: Project[]
}

const STORAGE_PROJECT_ID_KEY = 'projectId'

export const useProjectsStore = defineStore('projects', {
  state: (): ProjectState => ({
    project: null,
    projectId: null,
    projects: [],
    isLoading: false,
    errors: {
      updateProject: {
        name: undefined,
        sessionDurationSeconds: undefined,
      },
    },
    isEdit: {
      name: false,
      sessionDurationSeconds: false,
    },
  }),

  getters: {
    projectIds(): number[] {
      return this.projects.map(item => item.id)
    },
    projectsLength(): number {
      return this.projects.length
    },
  },

  actions: {
    async getProjectId() {
      if (!this.projectId) {
        const projectId = Number(
          localStorage.getItem(STORAGE_PROJECT_ID_KEY) || this.projects[0]?.id || null
        )

        if (projectId && this.projectIds.includes(projectId)) {
          this.projectId = projectId
          localStorage.setItem(STORAGE_PROJECT_ID_KEY, String(this.projectId))
        }
      }
    },
    setProjectId(projectId: number) {
      this.projectId = projectId
      localStorage.setItem(STORAGE_PROJECT_ID_KEY, String(this.projectId))
    },
    async getProject() {
      this.isLoading = true
      try {
        if (!this.projectId) throw Error
        const { data } = await projectsService.project(this.projectId)
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
        const res = await projectsService.projectsList()

        this.projects = res.data?.data || []
      } catch (error) {
        throw new Error('error get projects list')
      } finally {
        this.isLoading = false
      }
    },
    async init() {
      await this.getProjectsList()

      if (!this.projectId) {
        let projectId = Number(localStorage.getItem(STORAGE_PROJECT_ID_KEY))

        if (!this.projectIds.includes(projectId)) {
          projectId = this.projectIds[0]
        }

        if (projectId && this.projectIds.includes(projectId)) {
          this.setProjectId(projectId)
        }
      }
    },
    async saveProjectName(name: string) {
      const nCheck = safeParse(notEmptyStringScheme, name)
      if (!nCheck.success) {
        this.errors.updateProject.name = nCheck.error
        return
      }

      try {
        await this.__updateProject({ name })
      } catch (error) {
        if (isErrorResponseError(error)) {
          const err = error.error

          if (err?.fields?.name) {
            this.errors.updateProject.name = new Error(err.fields.name)
            return
          }

          if (err?.message) throw new Error(err.message)
        }
        throw new Error('error save project name')
      }

      this.resetEditName()
    },

    async saveSessionDuration(sessionDurationSeconds: number) {
      const dCheck = safeParse(moreThanZeroScheme, sessionDurationSeconds)
      if (!dCheck.success) {
        this.errors.updateProject.sessionDurationSeconds = dCheck.error
        return
      }

      try {
        await this.__updateProject({ sessionDurationSeconds })
      } catch (error) {
        if (isErrorResponseError(error)) {
          const err = error.error

          if (err?.fields?.sessionDurationSeconds) {
            this.errors.updateProject.sessionDurationSeconds = new Error(
              err.fields.sessionDurationSeconds
            )
            return
          }

          if (err?.message) throw new Error(err.message)
        }
        throw new Error('error session duration')
      }

      this.resetEditSessionDuration()
    },

    async __updateProject(req: UpdateProjectRequest) {
      if (!this.projectId) throw Error
      const { data } = await projectsService.updateProject(this.projectId, req)
      this.project = data
    },

    resetEditName() {
      this.isEdit.name = false
      this.clearErrorName()
    },

    resetEditSessionDuration() {
      this.isEdit.sessionDurationSeconds = false
      this.clearErrorSessionDuration()
    },

    clearErrorName() {
      this.errors.updateProject.name = undefined
    },

    clearErrorSessionDuration() {
      this.errors.updateProject.sessionDurationSeconds = undefined
    },
  },
})
