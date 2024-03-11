<template>
  <UiSpinner v-if="isLoading" class="pf-u-display-flex pf-u-m-auto" size="lg" />
  <ProjectsForm
    v-else-if="project"
    v-model:is-edit="isEdit"
    :name="project.name"
    :session-duration-seconds="project.sessionDurationSeconds"
    :errors="errors"
    @input-name="clearErrorName"
    @input-duration="clearErrorSessionDuration"
    @save-project-name="saveProjectNameHandler"
    @save-session-duration="saveSessionDurationHandler"
  />
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router'
import { ref } from 'vue'
import { useProjectSettings } from '@/pages/useProjectSettings'
import { Project } from '@/api'
import ProjectsForm from '@/components/projects/ProjectsForm.vue'
import UiSpinner from '@/components/uikit/UiSpinner.vue'

const route = useRoute()
const projectID = +route.params.projectId
const isLoading = ref(false)

const {
  errors,
  isEdit,
  getProject,
  clearErrorName,
  clearErrorSessionDuration,
  saveProjectName,
  saveSessionDuration,
} = useProjectSettings()

const project = ref<Project | null>(null)
await updateProject()

async function saveProjectNameHandler(name: string) {
  await saveProjectName(projectID, name)
  await updateProject()
}

async function saveSessionDurationHandler(duration: number) {
  await saveSessionDuration(projectID, duration)
  await updateProject()
}

async function updateProject() {
  isLoading.value = true
  try {
    project.value = await getProject(projectID)
  } finally {
    isLoading.value = false
  }
}
</script>

<style scoped lang="scss"></style>
