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

  const modifiedBreadcrumbs = breadcrumbs.map(breadcrumb => {
    if (breadcrumb.to.name === pagesMap.organization) {
      return {
        ...breadcrumb,
        title: organization.name,
      }
    }
    return breadcrumb
  })

  return modifiedBreadcrumbs
})

const { data: organization } = await schemaOrganizations.getOrganization(+route.params.id)
</script>

<style scoped lang="scss">
.pf-c-page {
  min-height: inherit;
}
</style>
