<template>
  <UiPopupWindow
    :title="$t('profile.setPassword')"
    :apply-button="$t('common.save')"
    :apply-disabled="applyDisabled"
    :closable="false"
    :apply-loading="isLoading"
    @apply="setPassword"
  >
    <span class="pf-u-display-block pf-u-mb-md">
      {{ $t('profile.setPasswordText') }}
    </span>

    <UiFormLabel
      :text="$t('profile.password')"
      :required="true"
      for="password"
    >
      <InputPassword
        v-model="password"
        :autofocus="true"
        :invalid="!!confirmError"
        @update:model-value="clearError"
      />
    </UiFormLabel>
    <UiFormLabel
      :text="$t('profile.confirmPassword')"
      :required="true"
      for="confirm-password"
    >
      <InputPassword
        v-model="confirmPassword"
        :invalid="!!confirmError"
        name="confirm-password"
        @update:model-value="clearError"
      />
      <UiFormError :error="confirmError" />
    </UiFormLabel>
  </UiPopupWindow>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import UiPopupWindow from '@/components/uikit/UiPopupWindow.vue'
import UiFormLabel from '@/components/uikit/UiFormLabel.vue'
import { apiClient } from '@/api/apiClient'
import InputPassword from '@/components/login/InputPassword.vue'
import { useMutation } from '@/hooks/useMutation'
import { TokensResponse } from '@/api'
import UiFormError from '@/components/uikit/UiFormError.vue'
import { safeParse } from 'valibot'
import { confirmPassword as confirmPasswordScheme } from '@/utils/validationSchemes'

const emit = defineEmits<{
  (e: 'changed-password', tokens: TokensResponse): void
}>()

const password = ref('')
const confirmPassword = ref('')
const confirmError = ref<string | null>(null)

const { mutate: setPassword, isLoading } = useMutation(changePassword)

async function changePassword() {
  const check = safeParse(
    confirmPasswordScheme,
    {
      newPassword: password.value,
      confirmPassword: confirmPassword.value,
    },
    { abortEarly: true }
  )
  if (!check.success) {
    confirmError.value = check.issues[0].message
    return
  }

  const { data } = await apiClient.profile.setProfilePassword({
    password: password.value,
  })

  emit('changed-password', data)
}

function clearError() {
  confirmError.value = null
}

const applyDisabled = computed(() => !password.value.trim() || !confirmPassword.value.trim())
</script>
