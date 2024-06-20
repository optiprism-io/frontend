<template>
  <div class="pf-c-page">
    <Header />
    <main class="pf-c-page__main">
      <Suspense>
        <RouterView class="pf-c-page__main-section " />
        <template #fallback>
          <UiSpinner class="pf-u-m-auto" size="xl" />
        </template>
      </Suspense>
    </main>

    <CreateCustomEvent
      v-if="commonStore.showCreateCustomEvent"
      @apply="togglePopupCreateCustomEvent(false)"
      @cancel="togglePopupCreateCustomEvent(false)"
    />
  </div>
</template>

<script setup lang="ts">
import { RouterView } from 'vue-router'

import Header from '@/components/common/Header.vue'
import CreateCustomEvent from '@/components/events/CreateCustomEvent.vue'
import UiSpinner from '@/components/uikit/UiSpinner.vue'

import { useInitialAppData } from '@/hooks/useInitialAppData'
import { useCommonStore } from '@/stores/common'

const commonStore = useCommonStore()

const togglePopupCreateCustomEvent = (payload: boolean) => {
  commonStore.togglePopupCreateCustomEvent(payload)
}

const { loadAppData } = useInitialAppData()
await loadAppData()
</script>
