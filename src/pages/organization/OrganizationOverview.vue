<template>
  <div>
    <h2>{{ organization.name }}</h2>
    <UiLabelAndSlot label="Name">
      {{ organization.name }}
    </UiLabelAndSlot>
  </div>
</template>

<script setup lang="ts">
import UiLabelAndSlot from '@/components/uikit/UiLabelAndSlot.vue'

import type { Organization } from '@/api'

interface IProps {
  organization: Organization
}

defineProps<IProps>()
</script>
