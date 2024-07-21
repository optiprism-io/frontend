<template>
  <div class="pf-l-bullseye">
    <ForceUpdateProfilePopup
      :force-pass="profileStore.profile.forceUpdatePassword"
      :force-email="profileStore.profile.forceUpdateEmail"
      @changed-password="onChangedPassword"
      @changed-email="onChangedEmail"
      @submit-fields="submitFields"
    />
  </div>
</template>

<script lang="ts" setup>
import { onMounted } from 'vue'

import { useRouter } from 'vue-router'

import ForceUpdateProfilePopup from '@/components/profile/ForceUpdateProfilePopup.vue'

import { pagesMap } from '@/router'
import { useProfileStore } from '@/stores/profile/profile'

import type { TokensResponse } from '@/api'

const router = useRouter()
const profileStore = useProfileStore()
const { setFirstPassword, setFirstEmail, getProfile } = profileStore

async function onChangedPassword(tokens: TokensResponse) {
  setFirstPassword(tokens)
}

async function onChangedEmail(tokens: TokensResponse) {
  setFirstEmail(tokens)
}

const submitFields = () => {
  router.push({ name: pagesMap.dashboards.name })
}

onMounted(async () => {
  await getProfile()

  if (!profileStore.profile.forceUpdatePassword && !profileStore.profile.forceUpdateEmail) {
    router.push({ name: pagesMap.dashboards.name })
  }
})
</script>
