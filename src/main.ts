import '@patternfly/patternfly/patternfly.scss'
import '@patternfly/patternfly/patternfly-addons.scss'
import 'floating-vue/dist/style.css'
import '@/assets/styles/main.scss'
import 'vue3-drr-grid-layout/dist/style.css'
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import lang from '@/lang'
import App from '@/App.vue'
import FloatingVue from 'floating-vue'
import { router } from '@/router'
import uikitPlugin from '@/plugins/uikit'
import i18nPlugin from '@/plugins/i18n'
import GridLayout from 'vue3-drr-grid-layout'

const pinia = createPinia()
const app = createApp(App);

app.use(router);
app.use(pinia);
FloatingVue.options.disposeTimeout = 300;
app.use(FloatingVue);
app.use(GridLayout);
app.use(uikitPlugin);
app.use(i18nPlugin);

/* =====================================MOCK_SERVER================================================ */
const MOCK_API = import.meta.env.VITE_MOCK_API === 'true'
const IS_EMPTY_MOCKS = import.meta.env.VITE_IS_EMPTY_MOCKS === 'true'

if (MOCK_API) {
  import('@/server/server').then(({ makeHttpServer }) => {
    makeHttpServer({ isSeed: !IS_EMPTY_MOCKS })
  })
}
/* =============================================================================================== */

app.config.globalProperties.loadDictionary(lang.en);
app.mount('#app');

app.config.errorHandler = (error, instance, info) => {
    if (process.env.NODE_ENV) {
        console.error('[errorHandler]:', error);
    }
};
