<template>
  <UiPopupWindow
    :title="$t('project.createProject')"
    :apply-button="$t('common.save')"
    :cancel-button="$t('common.close')"
    :apply-disabled="projectName.trim() === ''"
    @apply="createProject"
  >
    <UiFormLabel :text="$t('project.name')" :required="true" for="project-name">
      <UiInput
        v-model="projectName"
        :required="true"
        name="project-name"
        @keyup.enter="createProject"
      />
    </UiFormLabel>
  </UiPopupWindow>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import UiPopupWindow from '@/components/uikit/UiPopupWindow.vue'
import UiInput from '@/components/uikit/UiInput.vue'
import UiFormLabel from '@/components/uikit/UiFormLabel.vue'
import projectsService from '@/api/services/projects.service'
import { DEFAULT_SESSION_DURATION } from '@/stores/projects/projects'
import { Project } from '@/api'

const emit = defineEmits<{
  (e: 'created-project', project: Project): void
}>()

const projectName = ref('')

async function createProject() {
  if (!projectName.value.trim()) return

  const { data } = await projectsService.createProject({
    name: projectName.value,
    sessionDurationSeconds: DEFAULT_SESSION_DURATION,
  })
  emit('created-project', data)
}
</script>
