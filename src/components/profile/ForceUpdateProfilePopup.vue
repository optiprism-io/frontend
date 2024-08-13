<template>
  <UiPopupWindow
    :title="title"
    :apply-button="strings.save"
    :apply-disabled="applyDisabled"
    :closable="false"
    :loading-content="loading"
    :apply-loading="isLoading || isLoadingEmail"
    @apply="setFields"
  >
    <UiFormGroup
      v-if="forceEmail"
      :label="strings.setEmailText"
      :error="confirmErrorEmail"
      :for="'force-email'"
      :required="true"
    >
      <UiInput
        v-model="email"
        name="force-email"
        :invalid="!!confirmErrorEmail"
        @update:model-value="clearError"
      />
    </UiFormGroup>
    <UiFormGroup
      v-if="forceEmail"
      :label="strings.confirmEmail"
      :error="confirmErrorEmail"
      :for="'confirm-email'"
      :required="true"
    >
      <UiInput
        v-model="confirmEmail"
        name="confirm-email"
        :invalid="!!confirmErrorEmail"
        @update:model-value="clearError"
      />
      <UiFormError :error="confirmErrorEmail" />
    </UiFormGroup>
    <UiFormGroup
      v-if="forcePass"
      :label="strings.setPassText"
      :error="confirmErrorPassword"
      :for="'force-password'"
      :required="true"
    >
      <InputPassword
        v-model="password"
        :autofocus="true"
        :invalid="!!confirmErrorPassword"
        name="force-password"
        @update:model-value="clearError"
      />
    </UiFormGroup>
    <UiFormGroup
      v-if="forcePass"
      :label="strings.confirmPassword"
      :error="confirmErrorPassword"
      :for="'confirm-password'"
      :required="true"
    >
      <InputPassword
        v-model="confirmPassword"
        :invalid="!!confirmErrorPassword"
        name="confirm-password"
        @update:model-value="clearError"
      />
      <UiFormError :error="confirmErrorPassword" />
    </UiFormGroup>
  </UiPopupWindow>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'

import { safeParse } from 'valibot'

import InputPassword from '@/components/login/InputPassword.vue'
import UiFormError from '@/components/uikit/UiFormError.vue'
import UiFormGroup from '@/components/uikit/UiFormGroup.vue'
import UiInput from '@/components/uikit/UiInput.vue'
import UiPopupWindow from '@/components/uikit/UiPopupWindow.vue'

import { apiClient } from '@/api/apiClient'
import usei18n from '@/hooks/useI18n'
import { useMutation } from '@/hooks/useMutation'
import { confirmPassword as confirmPasswordScheme } from '@/plugins/valibot'
import { confirmEmail as confirmEmailScheme } from '@/plugins/valibot'

import type { TokensResponse } from '@/api'

const { t } = usei18n()

const props = defineProps({
  forcePass: Boolean,
  forceEmail: Boolean,
  loading: Boolean
})

const emit = defineEmits<{
  (e: 'submit-fields'): void
  (e: 'changed-password', tokens: TokensResponse): void
  (e: 'changed-email', tokens: TokensResponse): void
}>()

const strings = computed(() => {
  return {
    setEmailText: t('profile.setEmailText'),
    confirmEmail: t('profile.confirmEmail'),
    setPassText: t('profile.setPasswordText'),
    confirmPassword: t('profile.confirmPassword'),
    setPassword: t('profile.setPassword'),
    setEmail: t('profile.setEmail'),
    setEmailAndPassword: t('profile.setEmailAndPassword'),
    save: t('common.save'),
  }
})

const title = computed(() => {
  if (props.forceEmail && props.forcePass) {
    return strings.value.setEmailAndPassword
  }

  if (props.forceEmail) {
    return strings.value.setEmail
  }

  if (props.forcePass) {
    return strings.value.setPassword
  }

  return '';
})

const password = ref('')
const confirmPassword = ref('')
const confirmErrorPassword = ref<string | null>(null)

const email = ref('')
const confirmEmail = ref('')
const confirmErrorEmail = ref<string | null>(null)

const { mutate: setPassword, isLoading } = useMutation(changePassword)
const { mutate: setEmail, isLoading: isLoadingEmail } = useMutation(changeEmail)

async function changeEmail() {
  const check = safeParse(
    confirmEmailScheme,
    {
      newEmail: email.value,
      confirmEmail: confirmEmail.value,
    },
    { abortEarly: true }
  )
  if (!check.success) {
    confirmErrorEmail.value = check.issues[0].message
    return
  }

  const { data } = await apiClient.profile.setProfileEmail({
    email: email.value,
  })

  emit('changed-email', data)
}

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
    confirmErrorPassword.value = check.issues[0].message
    return
  }

  const { data } = await apiClient.profile.setProfilePassword({
    password: password.value,
  })

  emit('changed-password', data)
}

function clearError() {
  confirmErrorPassword.value = null
  confirmErrorEmail.value = null
}

const passwordDisabled = computed(() => !password.value.trim() || !confirmPassword.value.trim())
const emailDisabled = computed(() => !email.value.trim() || !confirmEmail.value.trim())
const applyDisabled = computed(
  () => (props.forceEmail && emailDisabled.value) || (props.forcePass && passwordDisabled.value)
)

const setFields = () => {
  if (props.forceEmail) {
    setEmail()
  }
  if (props.forcePass) {
    setPassword()
  }

  if (!confirmErrorPassword.value || !confirmErrorEmail.value) {
    emit('submit-fields')
  }
}
</script>
