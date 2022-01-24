import { App as Application } from "vue";
import UiButton from "@/components/uikit/UiButton.vue";
import UiIcon from "@/components/uikit/UiIcon.vue";
import UiSpinner from "@/components/uikit/UiSpinner.vue";
import UiDropdown from "@/components/uikit/UiDropdown.vue";
import UiInput from "@/components/uikit/UiInput.vue";

const componentMap: any = {
    UiButton,
    UiIcon,
    UiSpinner,
    UiDropdown,
    UiInput,
};

declare module '@vue/runtime-core' {
    export interface GlobalComponents {
        UiButton: typeof UiButton,
        UiInput: typeof UiInput,
    }
}

export default {
    install(Vue: Application) {
        for (const name in componentMap) {
            Vue.component(name, componentMap[name]);
        }
    },
};