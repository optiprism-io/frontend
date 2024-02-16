<template>
  <div class="pf-c-page__main-section pf-u-p-md pf-u-pb-3xl">
    <ToolsLayout>
      <template #title>
        {{ $t('profile.title') }}
      </template>
      <template #main>
        <UiCard class="pf-c-card pf-m-compact pf-u-h-100">
          <UiSpinner v-if="isLoading" class="pf-u-display-flex pf-u-m-auto" size="lg" />
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
import UiSpinner from '@/components/uikit/UiSpinner.vue'
import UiCard from '@/components/uikit/UiCard/UiCard.vue'
import ToolsLayout from '@/layout/tools/ToolsLayout.vue'

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
