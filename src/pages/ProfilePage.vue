<template>
  <div class="pf-v5-u-p-md pf-v5-u-pb-3xl">
    <ToolsLayout>
      <template #title>
        {{ $t('profile.title') }}
      </template>
      <template #main>
        <UiCard class="pf-v5-c-card pf-v5-m-compact pf-v5-u-h-100">
          <UiSpinner
            v-if="isLoading"
            class="pf-v5-u-display-flex pf-v5-u-m-auto"
            size="lg"
          />
          <ProfileForm
            v-else
            v-model:is-edit="isEdit"
            :name="profile.name"
            :email="profile.email"
            :errors="errors"
            @input-name="clearNameError"
            @input-email="clearEmailError"
            @input-pass-email="clearCurPasswordForEmailError"
            @input-pass="clearCurPasswordError"
            @input-pass-confirm="clearNewAndConfirmPasswordError"
            @save-name="saveEditName"
            @save-email="saveEditEmail"
            @save-password="saveEditPassword"
          />
        </UiCard>
      </template>
    </ToolsLayout>
  </div>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia'

import ProfileForm from '@/components/profile/ProfileForm.vue'
import UiCard from '@/components/uikit/UiCard/UiCard.vue'
import UiSpinner from '@/components/uikit/UiSpinner.vue'
import ToolsLayout from '@/layout/ToolsLayout.vue'

import { useProfileStore } from '@/stores/profile/profile'

const profileStore = useProfileStore()
const {
  saveEditName,
  saveEditEmail,
  saveEditPassword,
  clearNameError,
  clearEmailError,
  clearCurPasswordForEmailError,
  clearCurPasswordError,
  clearNewAndConfirmPasswordError,
} = profileStore
const { profile, isLoading, errors, isEdit } = storeToRefs(profileStore)
</script>
