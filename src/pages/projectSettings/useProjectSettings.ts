import { ref } from 'vue'

import { safeParse } from 'valibot'

import { apiClient } from '@/api/apiClient'
import { moreThanZeroNumber, notEmptyString } from '@/plugins/valibot'
import { useProjectsStore } from '@/stores/projects/projects'

import type { ProjectEdit, ProjectErrors } from '@/stores/projects/types'

export function useProjectSettings() {
  const { saveProjectName: saveProjectNameStore, saveSessionDuration: saveSessionDurationStore } =
    useProjectsStore()

  const errors = ref<ProjectErrors>({
    updateProject: {
      name: undefined,
      sessionDurationSeconds: undefined,
    },
  })

  const isEdit = ref<ProjectEdit>({
    name: false,
    sessionDurationSeconds: false,
  })

  async function getProject(id: number) {
    const { data } = await apiClient.projects.project(id)
    return data
  }

  function resetEditName() {
    isEdit.value.name = false
    clearErrorName()
  }

  function resetEditSessionDuration() {
    isEdit.value.sessionDurationSeconds = false
    clearErrorSessionDuration()
  }

  function clearErrorName() {
    errors.value.updateProject.name = undefined
  }

  function clearErrorSessionDuration() {
    errors.value.updateProject.sessionDurationSeconds = undefined
  }

  async function saveProjectName(id: number, name: string) {
    const nCheck = safeParse(notEmptyString, name, { abortEarly: true })
    if (!nCheck.success) {
      errors.value.updateProject.name = new Error(nCheck.issues[0].message)
      return
    }

    await saveProjectNameStore(id, name)
    resetEditName()
  }

  async function saveSessionDuration(id: number, duration: number) {
    const dCheck = safeParse(moreThanZeroNumber, duration, { abortEarly: true })
    if (!dCheck.success) {
      errors.value.updateProject.sessionDurationSeconds = new Error(dCheck.issues[0].message)
      return
    }

    await saveSessionDurationStore(id, duration)
    resetEditSessionDuration()
  }

  return {
    errors,
    isEdit,
    getProject,
    clearErrorName,
    clearErrorSessionDuration,
    saveProjectName,
    saveSessionDuration,
  }
}
