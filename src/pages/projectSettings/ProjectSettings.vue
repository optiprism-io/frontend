<template>
  <div class="pf-u-p-md pf-u-pb-3xl">
    <ToolsLayout>
      <template #title>
        {{ $t('project.settings.title') }}
      </template>
      <template #main>
        <UiCard class="pf-c-card pf-m-compact pf-u-h-100">
          <UiSpinner v-if="isLoading" class="pf-u-display-flex pf-u-m-auto" size="lg" />
          <ProjectsForm
            v-else-if="project"
            v-model:is-edit="isEdit"
            :name="project.name"
            :sdk-token="project.sdkToken"
            :session-duration-seconds="project.sessionDurationSeconds"
            :errors="errors"
            @input-name="clearErrorName"
            @input-duration="clearErrorSessionDuration"
            @save-project-name="saveProjectNameHandler"
            @save-session-duration="saveSessionDurationHandler"
          />
        </UiCard>
      </template>
    </ToolsLayout>
  </div>
</template>

<script setup lang="ts">
import UiSpinner from '@/components/uikit/UiSpinner.vue'
import UiCard from '@/components/uikit/UiCard/UiCard.vue'
import ToolsLayout from '@/layout/tools/ToolsLayout.vue'
import ProjectsForm from '@/components/projects/ProjectsForm.vue'
import { ref } from 'vue'
import { useRoute } from 'vue-router'
import { Project } from '@/api'
import { useProjectSettings } from '@/pages/projectSettings/useProjectSettings'
import { useMutation } from '@/hooks/useMutation'

const route = useRoute()
const projectID = +route.params.id

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

const { isLoading, mutate: updProject } = useMutation(updateProject)
updProject()

async function saveProjectNameHandler(name: string) {
  await saveProjectName(projectID, name)
  await updProject()
}

async function saveSessionDurationHandler(duration: number) {
  await saveSessionDuration(projectID, duration)
  await updProject()
}

async function updateProject() {
  project.value = await getProject(projectID)
}
</script>
