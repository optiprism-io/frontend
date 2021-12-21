import "@patternfly/patternfly/patternfly.css";

import { createApp } from "vue";
import App from "./App.vue";
import VuePatternfly4 from "@vue-patternfly/core";

import { createPinia } from "pinia";

const app = createApp(App);
app.use(createPinia());
app.use(VuePatternfly4);
app.mount("#app");
app.config.errorHandler = (err, vm, info) => {
    console.log(err, vm, info);
    // err: error trace
    // vm: component in which error occured
    // info: Vue specific error information such as lifecycle hooks, events etc.

    // TODO: Perform any custom logic or log to server
};
