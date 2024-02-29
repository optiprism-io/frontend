<template>
  <div class="pf-c-page pf-u-p-0">
    <UiPageSidebar :items="items" />

    <main class="pf-c-page__main">
      <UiBreadcrumbs :items="breadcrumbs" />

      <section class="pf-c-page__main-section pf-m-light">
        <div class="pf-c-page__main-body">
          <RouterView class="pf-c-content" :organization="organization" />
        </div>
      </section>
    </main>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { pagesMap } from '@/router'
import UiBreadcrumbs from '@/components/uikit/UiBreadcrumbs.vue'
import UiPageSidebar from '@/components/uikit/UiPageSidebar.vue'
import { useRoute } from 'vue-router'
import { schemaOrganizations } from '@/api/services/organizations.service'

const route = useRoute()

const items = computed(() => [
  { title: 'Overview', to: { name: pagesMap.orgOverview } },
  { title: 'Projects', to: { name: pagesMap.orgProjects } },
])

const breadcrumbs = computed(() =>
  route.matched
    .filter(r => r.path)
    .map(route => ({
      title: route.meta.breadcrumb,
      to: route.path,
    }))
)

const { data: organization } = await schemaOrganizations.getOrganization(+route.params.id)
</script>

<style scoped lang="scss">
.pf-c-page {
  min-height: inherit;
}
</style>
