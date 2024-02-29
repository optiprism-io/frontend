<template>
  <div>
    <h2>{{ organization.name }}</h2>
  </div>
</template>

<script setup lang="ts">
import { Organization } from '@/api'

interface IProps {
  organization: Organization
}

defineProps<IProps>()
</script>
