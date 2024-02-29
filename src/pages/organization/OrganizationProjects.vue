<template>
  <div>
    <h2>Projects</h2>
    <UiTable :items="items" :columns="columns" :show-toolbar="false" />
  </div>
</template>

<script setup lang="ts">
import { useProjectsStore } from '@/stores/projects/projects'
import UiTable from '@/components/uikit/UiTable/UiTable.vue'
import { Column, Row } from '@/components/uikit/UiTable/UiTable'
import { computed } from 'vue'

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
</script>
