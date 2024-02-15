<template>
  <div class="pf-c-page">
    <Header />
    <main class="pf-c-page__main">
      <RouterView />
    </main>

    <CreateCustomEvent
      v-if="commonStore.showCreateCustomEvent"
      @apply="applyCreateCustomEvent"
      @cancel="togglePopupCreateCustomEvent(false)"
    />
  </div>
</template>

<script setup lang="ts">
import Header from '@/components/common/Header.vue'
import CreateCustomEvent from '@/components/events/CreateCustomEvent.vue'
import { useCommonStore } from '@/stores/common'

const commonStore = useCommonStore()

const togglePopupCreateCustomEvent = (payload: boolean) => {
  commonStore.togglePopupCreateCustomEvent(payload)
}

const applyCreateCustomEvent = () => {
  togglePopupCreateCustomEvent(false)
}
</script>
