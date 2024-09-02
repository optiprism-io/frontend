<template>
  <RouterView v-slot="{ Component }">
    <template v-if="Component">
      <Suspense>
        <Component :is="Component" />
        <template #fallback>
          <AppPreloader />
        </template>
      </Suspense>
    </template>
  </RouterView>

  <UiAlertGroup
    v-if="alerts.length"
    class="app-toast-alerts"
    :items="alerts"
    @close="closeAlert"
  />
</template>

<script lang="ts" setup>
import { HttpStatusCode } from 'axios'
import { RouterView } from 'vue-router'

import UiAlertGroup from './components/uikit/UiAlertGroup.vue'
import AppPreloader from '@/components/common/AppPreloader.vue'

import { AlertTypeEnum, useAlert } from '@/hooks/useAlert'
import usei18n from '@/hooks/useI18n'
import { axiosInstance } from '@/plugins/axios'
import { useAuthStore } from '@/stores/auth/auth'

import type { ErrorResponse } from '@/api'

const { t } = usei18n()
const authStore = useAuthStore()
const { items: alerts, createAlert, closeAlert } = useAlert()

const createErrorGeneral = (res: ErrorResponse, text?: string) => {
  createAlert({
    type: AlertTypeEnum.Danger,
    text: text ?? res.error?.message ?? t('errors.internal'),
  })
}

/* TODO: think about where to move the interceptors to a more suitable place */
axiosInstance.interceptors.response.use(
  res => res,
  async err => {
    const status = err.response ? err.response.status : err.error ? err.error.status : null
    const error = `${err?.response?.status || err?.error?.status || ''} ${err?.code || ''} ${err?.message}`

    if (err.code === 'ERR_NETWORK') {
      createErrorGeneral(err.response, error)
      return Promise.reject(err)
    }

    switch (status) {
      case HttpStatusCode.Unauthorized:
        return authStore.onRefreshToken().then(_ => {
          /* add an exception when the refresh token is expired */
          if (err.config.url.includes('refresh-token')) {
            authStore.logout()
            return Promise.reject(err)
          }

          /* add an exception for some auth methods (login and signup doesn't require retry) */
          if (err.config.url.includes('auth')) {
            return Promise.reject(err)
          }

          err.config.headers['Authorization'] = 'Bearer ' + authStore.accessToken
          err.config.baseURL = undefined
          return axiosInstance.request(err.config)
        })

      case HttpStatusCode.BadRequest:
        if (err.response?.data) {
          if (err.response?.data?.error?.message) {
            createErrorGeneral(err.response, err.response.data.error.message)
          }
          return Promise.reject(err.response.data)
        }
        break
      case HttpStatusCode.InternalServerError:
      case HttpStatusCode.ServiceUnavailable:
      default:
        createErrorGeneral(err, error)
        break
    }
  }
)
</script>
