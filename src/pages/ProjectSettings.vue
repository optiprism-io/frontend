<template>
  <div class="pf-c-page__main-section pf-u-p-md pf-u-pb-3xl">
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
            :session-timeout-seconds="project.sessionTimeoutSeconds"
            :errors="errors"
            @input-name="clearErrors"
            @input-duration="clearErrors"
            @save-project="saveProject"
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
import { useProjectsStore } from '@/stores/projects/projects'
import { storeToRefs } from 'pinia'
import ProjectsForm from '@/components/projects/ProjectsForm.vue'

const projectsStore = useProjectsStore()
const { getProject, saveProject, clearErrors } = projectsStore
const { isLoading, project, errors, isEdit } = storeToRefs(projectsStore)

getProject()
</script>
