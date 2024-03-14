import { schemaProjects } from '@/api/services/projects.service'
import { ref } from 'vue'
import { ProjectEdit, ProjectErrors } from '@/stores/projects/types'
import { safeParse } from 'valibot'
import { moreThanZeroNumber, notEmptyString } from '@/utils/validationSchemes'
import { useProjectsStore } from '@/stores/projects/projects'

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
    const { data } = await schemaProjects.project(id)
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
    const nCheck = safeParse(notEmptyString, name)
    if (!nCheck.success) {
      errors.value.updateProject.name = nCheck.error
      return
    }

    await saveProjectNameStore(id, name)
    resetEditName()
  }

  async function saveSessionDuration(id: number, duration: number) {
    const dCheck = safeParse(moreThanZeroNumber, duration)
    if (!dCheck.success) {
      errors.value.updateProject.sessionDurationSeconds = dCheck.error
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
