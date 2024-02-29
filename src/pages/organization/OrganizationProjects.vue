<template>
  <div>
    <div class="pf-l-flex pf-m-justify-content-space-between">
      <h2>Projects</h2>
      <UiButton class="pf-m-primary" :before-icon="'fas fa-plus'" @click="setShowCreatePopup(true)">
        {{ $t('project.createProject') }}
      </UiButton>
    </div>
    <UiTable
      :items="items"
      :columns="columns"
      :is-loading="projectsStore.isLoading"
      :show-toolbar="false"
    />

    <CreateProjectPopup
      v-if="showCreatePopup"
      @cancel="setShowCreatePopup(false)"
      @created-project="onCreatedProject"
    />
  </div>
</template>

<script setup lang="ts">
import { useProjectsStore } from '@/stores/projects/projects'
import UiTable from '@/components/uikit/UiTable/UiTable.vue'
import { Column, Row } from '@/components/uikit/UiTable/UiTable'
import { computed } from 'vue'
import UiButton from '@/components/uikit/UiButton.vue'
import CreateProjectPopup from '@/components/projects/CreateProjectPopup.vue'
import { useToggle } from '@vueuse/core'

const projectsStore = useProjectsStore()

const items = computed<Row[]>(() =>
  projectsStore.projects.map(project =>
    columns.map(col => ({
      key: col.value,
      title: (project as any)[col.value] || 'N/A',
    }))
  )
)

const columns: Column[] = [
  { title: 'ID', value: 'id' },
  { title: 'Name', value: 'name' },
  { title: 'Creator', value: 'creator' },
  { title: 'Created At', value: 'createdAt' },
  { title: 'Updated At', value: 'updatedAt' },
  { title: 'SDK Token', value: 'sdkToken' },
]

const [showCreatePopup, setShowCreatePopup] = useToggle(false)
function onCreatedProject() {
  setShowCreatePopup(false)
  projectsStore.getProjectsList()
}
</script>
