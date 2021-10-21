import { createApp } from 'vue'
import App from './App.vue'
import VuePatternfly4 from '@vue-patternfly/core';

import { createPinia } from 'pinia'

let app = createApp(App);
app.use(createPinia())
app.use(VuePatternfly4)
app.mount('#app')
