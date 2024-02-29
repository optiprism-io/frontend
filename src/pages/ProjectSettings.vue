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
            :session-duration-seconds="project.sessionDurationSeconds"
            :errors="errors"
            @input-name="clearErrorName"
            @input-duration="clearErrorSessionDuration"
            @save-project-name="saveProjectName"
            @save-session-duration="saveSessionDuration"
          />
        </UiCard>
      </template>
    </ToolsLayout>
  </div>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia'

import UiSpinner from '@/components/uikit/UiSpinner.vue'
import UiCard from '@/components/uikit/UiCard/UiCard.vue'
import ToolsLayout from '@/layout/tools/ToolsLayout.vue'
import { useProjectsStore } from '@/stores/projects/projects'
import ProjectsForm from '@/components/projects/ProjectsForm.vue'

const projectsStore = useProjectsStore()

const { saveProjectName, saveSessionDuration, clearErrorName, clearErrorSessionDuration } =
  projectsStore
const { isLoading, errors, isEdit, project } = storeToRefs(projectsStore)
</script>
