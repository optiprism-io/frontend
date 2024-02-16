import { defineStore } from 'pinia'
import projectsService from '@/api/services/projects.service'
import { Project, UpdateProjectRequest } from '@/api'
import { safeParse } from 'valibot'
import { moreThanZeroNumber, notEmptyString } from '@/utils/validationSchemes'
import { isErrorResponseError } from '@/stores/profile/types'
import { ProjectEdit, ProjectErrors } from '@/stores/projects/types'

interface ProjectState {
  project: Project | null
  projectId: number
  isLoading: boolean
  errors: ProjectErrors
  isEdit: ProjectEdit
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
export const DEFAULT_SESSION_DURATION = 0

export const useProjectsStore = defineStore('projects', {
  state: (): ProjectState => ({
    project: null,
    projectId: 0,
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
      if (this.projectList.length) return
      await this.getProjectsList()

      let projectId = Number(localStorage.getItem(STORAGE_PROJECT_ID_KEY))
      if (!this.projectsMap[projectId]) {
        projectId = Number(this.projects[0]?.id || 0)
      }
      this.setProjectId(projectId)
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

    addProjectToList(project: Project) {
      this.projects.push(project)
    },

    async __updateProject(req: UpdateProjectRequest) {
      if (!this.projectId) throw Error
      const { data } = await projectsService.updateProject(this.projectId, req)

      if (data) {
        this.projects = this.projects.map((item) => {
          return Number(item.id) === Number(data.id) ? data : item;
        });
      }
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
