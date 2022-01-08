import "@patternfly/patternfly/patternfly.scss";
import "@patternfly/patternfly/patternfly-addons.scss";
import "v-tooltip/dist/v-tooltip.css";
import "@/assets/styles/main.scss";

import { createApp } from "vue";
import { createPinia } from "pinia";
import App from "@/App.vue";
import makeServer from "@/server";
import VTooltipPlugin from "v-tooltip";
import { router } from '@/router'

if (typeof makeServer === "function") {
    makeServer();
}

const app = createApp(App);
app.use(createPinia());
app.use(VTooltipPlugin);
app.use(router);
app.mount("#app");

app.config.errorHandler = (err, vm, info) => {
    console.log(err, vm, info);
    // err: error trace
    // vm: component in which error occured
    // info: Vue specific error information such as lifecycle hooks, events etc.

    // TODO: Perform any custom logic or log to server
};
