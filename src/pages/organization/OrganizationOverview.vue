<template>
  <div>
    <h2>{{ organization.name }}</h2>
    <UiFormLabel text="Name" for="name">
      <UiInput :model-value="organization.name" name="name" :disabled="true" />
    </UiFormLabel>
  </div>
</template>

<script setup lang="ts">
import { Organization } from '@/api'
import UiInput from '@/components/uikit/UiInput.vue'
import UiFormLabel from '@/components/uikit/UiFormLabel.vue'

interface IProps {
  organization: Organization
}

defineProps<IProps>()
</script>
