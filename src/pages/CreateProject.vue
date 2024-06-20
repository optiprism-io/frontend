<template>
  <div class="pf-l-bullseye">
    <DataEmptyPlaceholder :hide-icon="true">
      <span v-if="!projectStore.projectList.length" class="pf-u-mx-sm">
        {{ $t('project.noProject') }}
      </span>
      <UiButton
        class="pf-m-primary"
        :before-icon="'fas fa-plus'"
        @click="setShowCreatePopup(true)"
      >
        {{ $t('project.createProject') }}
      </UiButton>
    </DataEmptyPlaceholder>

    <CreateProjectPopup
      v-if="showCreatePopup"
      @cancel="setShowCreatePopup(false)"
      @created-project="onCreatedProject"
    />
  </div>
</template>

<script setup lang="ts">
import { useToggle } from '@vueuse/core'
import { useRouter } from 'vue-router'

import DataEmptyPlaceholder from '@/components/common/data/DataEmptyPlaceholder.vue'
import CreateProjectPopup from '@/components/projects/CreateProjectPopup.vue'
import UiButton from '@/components/uikit/UiButton.vue'

import { pagesMap } from '@/router'
import { useProjectsStore } from '@/stores/projects/projects'

const [showCreatePopup, setShowCreatePopup] = useToggle(false)
const router = useRouter()

function onCreatedProject() {
  setShowCreatePopup(false)
  router.push({ name: pagesMap.dashboards.name }).then(() => window.location.reload())
}

const projectStore = useProjectsStore()
</script>
