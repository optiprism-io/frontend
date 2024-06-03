<template>
  <div class="pf-c-page">
    <main class="pf-c-page__main">
      <Suspense>
        <RouterView class="pf-c-page__main-section" />
        <template #fallback>
          <UiSpinner class="pf-u-m-auto" size="xl" />
        </template>
      </Suspense>
    </main>
  </div>
</template>

<script setup lang="ts">
import UiSpinner from '@/components/uikit/UiSpinner.vue'
</script>
