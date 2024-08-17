<template>
  <div class="pf-c-page pf-u-p-0">
    <UiPageSidebar :items="items" />

    <main class="pf-c-page__main">
      <UiBreadcrumbs
        class="pf-c-page__main-breadcrumb pf-u-pb-sm pf-u-pt-lg"
        :items="breadcrumbs"
      />

      <section class="pf-c-page__main-section pf-m-light pf-u-p-0">
        <div class="pf-c-page__main-body">
          <RouterView
            class="pf-c-content"
            :organization="organization"
          />
        </div>
      </section>
    </main>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

import { storeToRefs } from 'pinia'
import { RouterView, useRoute } from 'vue-router'

import UiBreadcrumbs from '@/components/uikit/UiBreadcrumbs.vue'
import UiPageSidebar from '@/components/uikit/UiPageSidebar.vue'

import { apiClient } from '@/api/apiClient'
import { pagesMap } from '@/router'
import { useProjectsStore } from '@/stores/projects/projects'

const route = useRoute()

const items = computed(() => [
  { title: 'Overview', to: { name: pagesMap.organizationOverview } },
  { title: 'Projects', to: { name: pagesMap.organizationProjectList } },
])

const breadcrumbs = computed(() => {
  const routesWithoutRoot = route.matched.filter(r => r.path && r.name)

  const breadcrumbs = routesWithoutRoot.map((route, index) => ({
    title: route.meta.breadcrumb?.toString() || '',
    to: route,
    isActive: route.name !== pagesMap.organizations && index !== routesWithoutRoot.length - 1,
  }))

  return breadcrumbs.map(breadcrumb => {
    if (breadcrumb.to.name === pagesMap.organization) {
      return {
        ...breadcrumb,
        title: organization.name,
      }
    }

    if (breadcrumb.to.name === pagesMap.organizationProject) {
      return {
        ...breadcrumb,
        title:
          projects.value.find(x => x.id.toString() === route.params.projectId.toString())?.name ||
          'Project',
      }
    }

    return breadcrumb
  })
})

const { data: organization } = await apiClient.organizations.organization(+route.params.id)
const { projects } = storeToRefs(useProjectsStore())
</script>

<style scoped lang="scss">
.pf-c-page {
  min-height: inherit;
}
</style>
