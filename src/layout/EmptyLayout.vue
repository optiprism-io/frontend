<template>
  <div class="pf-v5-c-page">
    <main class="pf-v5-c-page__main">
      <Suspense>
        <RouterView class="pf-v5-c-page__main-section" />
        <template #fallback>
          <UiSpinner class="pf-v5-u-m-auto" size="xl" />
        </template>
      </Suspense>
    </main>
  </div>
</template>

<script setup lang="ts">
import { RouterView } from 'vue-router'

import UiSpinner from '@/components/uikit/UiSpinner.vue'
</script>
