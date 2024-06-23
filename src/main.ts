import '@patternfly/patternfly/patternfly.scss'
import '@patternfly/patternfly/patternfly-addons.scss'
import 'floating-vue/dist/style.css'
import '@/assets/styles/main.scss'
import 'vue3-drr-grid-layout/dist/style.css'

import { createApp } from 'vue'

import { createPinia } from 'pinia'

import App from '@/App.vue'

import lang from '@/lang'
import i18nPlugin from '@/plugins/i18n'
import uikitPlugin from '@/plugins/uikit'
import { router } from '@/router'

/* =====================================MOCK_SERVER================================================ */
const MOCK_API = import.meta.env.VITE_MOCK_API === 'true'
const IS_EMPTY_MOCKS = import.meta.env.VITE_IS_EMPTY_MOCKS === 'true'

if (MOCK_API) {
  /* "await" is necessary so that the mock server can be created before creating the application */
  await import('@/server/server').then(({ makeHttpServer }) => {
    makeHttpServer({ isSeed: !IS_EMPTY_MOCKS })
  })
}
/* =============================================================================================== */

const pinia = createPinia()
const app = createApp(App)

app.use(router)
app.use(pinia)
app.use(uikitPlugin)
app.use(i18nPlugin)

app.config.globalProperties.loadDictionary(lang.en)
app.mount('#app')

app.config.errorHandler = (error, _instance, _info) => {
  if (process.env.NODE_ENV) {
    console.error('[errorHandler]:', error)
  }
}
