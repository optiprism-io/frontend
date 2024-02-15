<template>
  <div class="pf-l-bullseye">
    <DataEmptyPlaceholder :hide-icon="true">
      {{ $t('project.noProject') }}
      <UiButton class="pf-m-primary" :before-icon="'fas fa-plus'" @click="setShowCreatePopup(true)">
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
import UiButton from '@/components/uikit/UiButton.vue'
import DataEmptyPlaceholder from '@/components/common/data/DataEmptyPlaceholder.vue'
import CreateProjectPopup from '@/components/projects/CreateProjectPopup.vue'
import { useToggle } from '@vueuse/core'
import { useRouter } from 'vue-router'
import { pagesMap } from '@/router'

const [showCreatePopup, setShowCreatePopup] = useToggle(false)
const router = useRouter()

function onCreatedProject() {
  setShowCreatePopup(false)
  router.push({ name: pagesMap.dashboards.name })
}
</script>
