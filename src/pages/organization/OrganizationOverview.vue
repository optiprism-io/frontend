<template>
  <div>
    <h2>{{ organization.name }}</h2>
    <UiLabelAndSlot label="Name">
      {{ organization.name }}
    </UiLabelAndSlot>
  </div>
</template>

<script setup lang="ts">
import { Organization } from '@/api'
import UiLabelAndSlot from '@/components/uikit/UiLabelAndSlot.vue'

interface IProps {
  organization: Organization
}

defineProps<IProps>()
</script>
