<template>
  <div>
    <RouterLink
      v-for="org in organizationList.data"
      :key="org.id"
      :to="{ name: pagesMap.orgOverview, params: { id: org.id } }"
    >
      {{ org.name }}
    </RouterLink>
  </div>
</template>

<script setup lang="ts">
import { schemaOrganizations } from '@/api/services/organizations.service'
import { pagesMap } from '@/router'

const { data: organizationList } = await schemaOrganizations.getOrganizationList()
</script>

<style scoped lang="scss"></style>
