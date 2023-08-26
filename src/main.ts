import '@patternfly/patternfly/patternfly.scss';
import '@patternfly/patternfly/patternfly-addons.scss';
import 'floating-vue/dist/style.css';
import '@/assets/styles/main.scss';
import 'vue3-drr-grid-layout/dist/style.css';
import { createApp } from 'vue';
import { createPinia } from 'pinia';
import lang from '@/lang';
import App from '@/App.vue';
import makeServer from '@/server';
import FloatingVue from 'floating-vue';
import { router } from '@/router';
import uikitPlugin from '@/plugins/uikit';
import i18nPlugin from '@/plugins/i18n';
import GridLayout from 'vue3-drr-grid-layout';

const isEnabledMocks = localStorage.getItem('isEnabledMocks');
if (import.meta.env.VITE_MOCK_API) {
    if ((isEnabledMocks && Number(isEnabledMocks)) || !isEnabledMocks) {
        makeServer({ isSeed: localStorage.getItem('isEmptyMocks') !== '1' });
        localStorage.setItem('isEnabledMocks', '1');
    }
}

const pinia = createPinia();
const app = createApp(App);

app.use(router);
app.use(pinia);
FloatingVue.options.disposeTimeout = 300;
app.use(FloatingVue);
app.use(GridLayout);
app.use(uikitPlugin);
app.use(i18nPlugin);

app.directive('click-outside', {
    mounted(el, binding, vnode) {
        el.clickOutsideEvent = function(event: Event) {
            if (!(el === event.target || el.contains(event.target))) {
                binding.value(event, el)
            }
        }
        document.body.addEventListener('mousedown', el.clickOutsideEvent)
    },
    unmounted(el) {
        document.body.removeEventListener('mousedown', el.clickOutsideEvent)
    }
});

app.config.globalProperties.loadDictionary(lang.en);
app.mount('#app');

app.config.errorHandler = (error, instance, info) => {
    if (process.env.NODE_ENV) {
        console.error('[errorHandler]:', error);
    }
};
