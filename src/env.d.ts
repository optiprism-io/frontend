/// <reference types="vite/client" />

declare module "*.vue" {
    import type { DefineComponent } from "vue";
    const component: DefineComponent<Record<string, unknown>, Record<string, unknown>, unknown>;
    export default component;
}

declare module "vue3-popper" {
    import { Component } from "vue";
    const file: Component;
    export default file;
}
