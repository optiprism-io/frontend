import { defineStore } from 'pinia'
import { useAuthStore } from '@/stores/auth/auth'
import projectsService from '@/api/services/projects.service'
import { Project, UpdateProjectRequest } from '@/api'
import { safeParse } from 'valibot'
import { moreThanZeroNumber, notEmptyString } from '@/utils/validationSchemes'
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
        sessionDurationSeconds: undefined,
      },
    },
    isEdit: {
      name: false,
      sessionDurationSeconds: false,
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
      const nCheck = safeParse(notEmptyString, name)
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
      const dCheck = safeParse(moreThanZeroNumber, sessionDurationSeconds)
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
