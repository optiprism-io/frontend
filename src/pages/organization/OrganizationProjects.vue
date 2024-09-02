<template>
  <RouterView v-if="route.name === pagesMap.organizationProject" />
  <div v-else>
    <div class="pf-l-flex pf-m-justify-content-space-between">
      <h2>Projects</h2>
      <UiButton
        class="pf-m-primary"
        before-icon="fas fa-plus"
        @click="setShowCreatePopup(true)"
      >
        {{ $t('project.createProject') }}
      </UiButton>
    </div>
    <UiTable
      :items="items"
      :columns="columns"
      :is-loading="projectsStore.isLoading"
      :show-toolbar="false"
      @on-action="onAction"
    />

    <CreateProjectPopup
      v-if="showCreatePopup"
      @cancel="setShowCreatePopup(false)"
      @created-project="onCreatedProject"
    />
  </div>
</template>

<script setup lang="ts">
import { capitalize, computed } from 'vue'

import { useToggle } from '@vueuse/core'
import { useRoute, useRouter, RouterView } from 'vue-router'

import CreateProjectPopup from '@/components/projects/CreateProjectPopup.vue'
import UiCellToolMenu from '@/components/uikit/cells/UiCellToolMenu.vue'
import UiButton from '@/components/uikit/UiButton.vue'
import UiTable from '@/components/uikit/UiTable/UiTable.vue'

import { pagesMap } from '@/router'
import { useProjectsStore } from '@/stores/projects/projects'

import type { Action, Column, Row } from '@/components/uikit/UiTable/UiTable'

const router = useRouter()
const route = useRoute()
const projectsStore = useProjectsStore()

enum Actions {
  edit = 'edit',
}

const toolMenu = Object.values(Actions).map(action => ({
  label: capitalize(action),
  value: action,
}))

const items = computed<Row[]>(() =>
  projectsStore.projects.map(project =>
    columns.map(col => ({
      key: col.value,
      title: (project as any)[col.value] || 'N/A',
      type: col.type || undefined,
      items: col.type === 'action' ? toolMenu : [],
      component: col.type === 'action' ? UiCellToolMenu : undefined,
      value: project.id,
    }))
  )
)

const columns: Column[] = [
  { title: 'Name', value: 'name' },
  { title: '', value: 'action', type: 'action' },
]

async function onAction(payload: Action) {
  if (payload.name === Actions.edit) {
    await router.push({ name: pagesMap.organizationProject, params: { projectId: payload.type } })
  }
}

const [showCreatePopup, setShowCreatePopup] = useToggle(false)
function onCreatedProject() {
  setShowCreatePopup(false)
  projectsStore.getProjectsList()
}
</script>
