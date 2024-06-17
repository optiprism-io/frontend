<template>
  <div class="pf-l-bullseye">
    <ForceUpdatePasswordPopup @changed-password="onChangedPassword" />
  </div>
</template>

<script lang="ts" setup>
import { useRouter } from 'vue-router'
import ForceUpdatePasswordPopup from '@/components/profile/ForceUpdatePasswordPopup.vue'
import { useProfileStore } from '@/stores/profile/profile'
import { pagesMap } from '@/router'
import { TokensResponse } from '@/api'

const router = useRouter()
const profileStore = useProfileStore()
const { setFirstPassword } = profileStore

async function onChangedPassword(tokens: TokensResponse) {
  setFirstPassword(tokens)
  await router.push({ name: pagesMap.dashboards.name })
}
</script>
