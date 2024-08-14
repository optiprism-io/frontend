<template>
  <div class="pf-l-bullseye">
    <ForceUpdateProfilePopup
      :force-pass="forcePass"
      :force-email="forceEmail"
      :force-project="forceProject"
      @changed-password="onChangedPassword"
      @changed-email="onChangedEmail"
      @changed-project="onChangedProject"
      @submit-fields="submitFields"
    />
  </div>
</template>

<script lang="ts" setup>
import { computed } from 'vue'

import { useRoute, useRouter } from 'vue-router'

import ForceUpdateProfilePopup from '@/components/profile/ForceUpdateProfilePopup.vue'

import { pagesMap } from '@/router'
import { useProfileStore } from '@/stores/profile/profile'
import { useProjectsStore } from '@/stores/projects/projects'

import type { Project, TokensResponse } from '@/api'

const router = useRouter()
const route = useRoute()

const forceEmail = computed(() => route.query.email === 'true')
const forcePass = computed(() => route.query.password === 'true')
const forceProject = computed(() => route.query.project === 'true')

if (!forceEmail.value && !forcePass.value && !forceProject.value) {
  router.push({ name: pagesMap.dashboards.name })
}

const profileStore = useProfileStore()
const { setFirstPassword, setFirstEmail } = profileStore

const projectStore = useProjectsStore()
const { addProjectToList, setProjectId } = projectStore

function onChangedPassword(tokens: TokensResponse) {
  setFirstPassword(tokens)
}

function onChangedEmail(tokens: TokensResponse) {
  setFirstEmail(tokens)
}

function onChangedProject(project: Project) {
  addProjectToList(project)
  setProjectId(project.id)
}

const submitFields = () => {
  router.push({ name: pagesMap.dashboards.name })
}
</script>
