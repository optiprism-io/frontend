<template>
  <UiPopupWindow
    :title="$t('profile.setPassword')"
    :apply-button="$t('common.save')"
    :apply-disabled="password.trim() === ''"
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
      <InputPassword v-model="password" :autofocus="true" />
    </UiFormLabel>
  </UiPopupWindow>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import UiPopupWindow from '@/components/uikit/UiPopupWindow.vue'
import UiFormLabel from '@/components/uikit/UiFormLabel.vue'
import { apiClient } from '@/api/apiClient'
import InputPassword from '@/components/login/InputPassword.vue'
import { useMutation } from '@/hooks/useMutation'
import { TokensResponse } from '@/api'

const emit = defineEmits<{
  (e: 'changed-password', tokens: TokensResponse): void
}>()

const password = ref('')

const { mutate: setPassword, isLoading } = useMutation(changePassword)

async function changePassword() {
  if (!password.value.trim()) return

  const { data } = await apiClient.profile.setProfilePassword({
    password: password.value,
  })

  emit('changed-password', data)
}
</script>
