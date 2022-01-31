import { App as Application } from "vue";
import UiButton from "@/components/uikit/UiButton.vue";
import UiIcon from "@/components/uikit/UiIcon.vue";
import UiSpinner from "@/components/uikit/UiSpinner.vue";
import UiDropdown from "@/components/uikit/UiDropdown.vue";
import UiToggleGroup from "@/components/uikit/UiToggleGroup.vue";
import UiTabs from "@/components/uikit/UiTabs.vue";

const componentMap: any = {
    UiButton,
    UiIcon,
    UiSpinner,
    UiDropdown,
    UiToggleGroup,
    UiTabs,
};

declare module '@vue/runtime-core' {
    export interface GlobalComponents {
        UiButton: typeof UiButton,
        UiToggleGroup: typeof UiToggleGroup,
        UiTabs: typeof UiTabs,
    }
}

export default {
    install(Vue: Application) {
        for (const name in componentMap) {
            Vue.component(name, componentMap[name]);
        }
    },
};