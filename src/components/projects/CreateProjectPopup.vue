<template>
  <UiPopupWindow
    :title="$t('project.createProject')"
    :apply-button="$t('common.save')"
    :cancel-button="$t('common.close')"
    :apply-disabled="projectName.trim() === ''"
    @apply="createProject"
  >
    <UiFormLabel
      :text="$t('project.name')"
      :required="true"
      for="project-name"
    >
      <UiInput
        ref="input"
        v-model="projectName"
        :required="true"
        name="project-name"
        :autofocus="true"
        @keyup.enter="createProject"
      />
    </UiFormLabel>
  </UiPopupWindow>
</template>

<script setup lang="ts">
import { ref } from 'vue'

import UiFormLabel from '@/components/uikit/UiFormLabel.vue'
import UiInput from '@/components/uikit/UiInput.vue'
import UiPopupWindow from '@/components/uikit/UiPopupWindow.vue'

import { apiClient } from '@/api/apiClient'

import type { Project } from '@/api'

const emit = defineEmits<{
  (e: 'created-project', project: Project): void
}>()

const projectName = ref('')

async function createProject() {
  if (!projectName.value.trim()) return

  const { data } = await apiClient.projects.createProject({
    name: projectName.value,
  })
  emit('created-project', data)
}
</script>
