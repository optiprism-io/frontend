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
import { useProjectsStore } from '@/stores/projects/projects'
import UiTable from '@/components/uikit/UiTable/UiTable.vue'
import { Action, Column, Row } from '@/components/uikit/UiTable/UiTable'
import { capitalize, computed } from 'vue'
import UiButton from '@/components/uikit/UiButton.vue'
import CreateProjectPopup from '@/components/projects/CreateProjectPopup.vue'
import { useToggle } from '@vueuse/core'
import UiCellToolMenu from '@/components/uikit/cells/UiCellToolMenu.vue'
import { useRouter } from 'vue-router'
import { pagesMap } from '@/router'

const router = useRouter()
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
  { title: 'ID', value: 'id' },
  { title: 'Name', value: 'name' },
  { title: 'Creator', value: 'creator' },
  { title: 'Created At', value: 'createdAt' },
  { title: 'Updated At', value: 'updatedAt' },
  { title: 'SDK Token', value: 'sdkToken' },
  { title: '', value: 'action', type: 'action' },
]

async function onAction(payload: Action) {
  if (payload.name === Actions.edit) {
    /*
     Now the project settings page is made for the selected project,
      so you need to make the project selected before going to the page,
      it might be worth redoing this approach,
      but for this you need to redo the logic on the project settings page
    */
    projectsStore.setProjectId(Number(payload.type))
    await projectsStore.getProject()
    await router.push({ name: pagesMap.projectsSettings, params: { id: payload.type } })
  }
}

const [showCreatePopup, setShowCreatePopup] = useToggle(false)
function onCreatedProject() {
  setShowCreatePopup(false)
  projectsStore.getProjectsList()
}
</script>
