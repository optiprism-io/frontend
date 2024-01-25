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
  isLoading: boolean
  errors: ProjectErrors
  isEdit: ProjectEdit
}

export const useProjectsStore = defineStore('projects', {
  state: (): ProjectState => ({
    project: null,
    isLoading: false,
    errors: {
      updateProject: {
        name: undefined,
        sessionTimeoutSeconds: undefined,
      },
    },
    isEdit: {
      name: false,
      sessionTimeoutSeconds: false,
    },
  }),

  getters: {
    projectId(): number | undefined {
      const authStore = useAuthStore()
      return authStore.decodedAccessToken?.projectId
    },
  },

  actions: {
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

    async saveSessionDuration(sessionTimeoutSeconds: number) {
      const dCheck = safeParse(moreThanZeroScheme, sessionTimeoutSeconds)
      if (!dCheck.success) {
        this.errors.updateProject.sessionTimeoutSeconds = dCheck.error
        return
      }

      try {
        await this.__updateProject({ sessionTimeoutSeconds })
      } catch (error) {
        if (isErrorResponseError(error)) {
          const err = error.error

          if (err?.fields?.sessionTimeoutSeconds) {
            this.errors.updateProject.sessionTimeoutSeconds = new Error(
              err.fields.sessionTimeoutSeconds
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
      this.isEdit.sessionTimeoutSeconds = false
      this.clearErrorSessionDuration()
    },

    clearErrorName() {
      this.errors.updateProject.name = undefined
    },

    clearErrorSessionDuration() {
      this.errors.updateProject.sessionTimeoutSeconds = undefined
    },
  },
})