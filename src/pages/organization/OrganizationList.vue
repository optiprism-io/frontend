<template>
  <div>
    <RouterLink
      v-for="org in organizationList.data"
      :key="org.id"
      :to="{ name: pagesMap.organizationOverview, params: { id: org.id } }"
    >
      {{ org.name }}
    </RouterLink>
  </div>
</template>

<script setup lang="ts">
import { RouterLink } from 'vue-router'

import { apiClient } from '@/api/apiClient'
import { pagesMap } from '@/router'

const { data: organizationList } = await apiClient.organizations.organizationsList()
</script>

<style scoped lang="scss"></style>
