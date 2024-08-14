<template>
  <UiPopupWindow
    :title="strings.setInitialParams"
    :apply-button="strings.save"
    :apply-disabled="applyDisabled"
    :closable="false"
    :apply-loading="isLoading"
    @apply="setFields"
  >
    <UiFormGroup
      v-if="forceProject"
      :label="strings.projectName"
      for="project-name"
      :required="true"
    >
      <UiInput
        v-model="projectName"
        :required="true"
        name="project-name"
        :invalid="!!projectNameError"
      />
      <UiFormError :error="projectNameError" />
    </UiFormGroup>

    <UiFormGroup
      v-if="forceEmail"
      :label="strings.setEmailText"
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
      :for="'force-password'"
      :required="true"
    >
      <InputPassword
        v-model="password"
        :invalid="!!confirmErrorPassword"
        name="force-password"
        @update:model-value="clearError"
      />
    </UiFormGroup>
    <UiFormGroup
      v-if="forcePass"
      :label="strings.confirmPassword"
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
import {
  confirmEmail as confirmEmailScheme,
  confirmPassword as confirmPasswordScheme,
  notEmptyString,
} from '@/plugins/valibot'
import { isErrorResponseError } from '@/stores/profile/types'

import type { Project, TokensResponse } from '@/api'

interface IProps {
  forcePass: boolean
  forceEmail: boolean
  forceProject: boolean
}

const props = withDefaults(defineProps<IProps>(), {})

const emit = defineEmits<{
  (e: 'submit-fields'): void
  (e: 'changed-password', tokens: TokensResponse): void
  (e: 'changed-email', tokens: TokensResponse): void
  (e: 'changed-project', project: Project): void
}>()

const { t } = usei18n()

const strings = computed(() => {
  return {
    setEmailText: t('profile.setEmailText'),
    confirmEmail: t('profile.confirmEmail'),
    setPassText: t('profile.setPasswordText'),
    confirmPassword: t('profile.confirmPassword'),
    save: t('common.save'),
    projectName: t('project.name'),
    setInitialParams: t('profile.setInitialParams'),
  }
})

const password = ref('')
const confirmPassword = ref('')
const confirmErrorPassword = ref<string | null>(null)

const email = ref('')
const confirmEmail = ref('')
const confirmErrorEmail = ref<string | null>(null)

const projectName = ref('')
const projectNameError = ref<string | null>(null)

const { mutate: setPassword, isLoading: isLoadingPassword } = useMutation(changePassword)
const { mutate: setEmail, isLoading: isLoadingEmail } = useMutation(changeEmail)
const { mutate: setProjectName, isLoading: isLoadingProjectName } = useMutation(changeProjectName)

const isLoading = computed(
  () => isLoadingPassword.value || isLoadingEmail.value || isLoadingProjectName.value
)

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

  const res = await apiClient.profile
    .setProfileEmail({
      email: email.value,
    })
    .catch(error => {
      if (isErrorResponseError(error)) {
        const err = error.error

        if (err?.fields?.email) {
          confirmErrorEmail.value = err.fields.email
          return
        }

        if (err?.message) throw new Error(err.message)
      }
    })

  if (!res) return

  emit('changed-email', res.data)
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

  const res = await apiClient.profile
    .setProfilePassword({
      password: password.value,
    })
    .catch(error => {
      if (isErrorResponseError(error)) {
        const err = error.error

        if (err?.fields?.password) {
          confirmErrorPassword.value = err.fields.password
          return
        }

        if (err?.message) throw new Error(err.message)
      }
    })

  if (!res) return

  emit('changed-password', res.data)
}

async function changeProjectName() {
  const check = safeParse(notEmptyString, projectName.value, { abortEarly: true })
  if (!check.success) {
    projectNameError.value = check.issues[0].message
    return
  }

  const res = await apiClient.projects.createProject({
    name: projectName.value,
  })

  emit('changed-project', res.data)
}

function clearError() {
  confirmErrorPassword.value = null
  confirmErrorEmail.value = null
  projectNameError.value = null
}

const passwordDisabled = computed(() => !password.value.trim() || !confirmPassword.value.trim())
const emailDisabled = computed(() => !email.value.trim() || !confirmEmail.value.trim())
const applyDisabled = computed(
  () =>
    (props.forceEmail && emailDisabled.value) ||
    (props.forcePass && passwordDisabled.value) ||
    (props.forceProject && !projectName.value.trim())
)

async function setFields() {
  const promises: Array<() => Promise<void | undefined>> = []
  if (props.forceEmail) promises.push(setEmail)
  if (props.forcePass) promises.push(setPassword)
  if (props.forceProject) promises.push(setProjectName)

  await Promise.all(promises.map(promise => promise()))

  if (!confirmErrorPassword.value || !confirmErrorEmail.value || !projectNameError.value) {
    emit('submit-fields')
  }
}
</script>
