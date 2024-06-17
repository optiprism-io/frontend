import type { App as Application} from 'vue';
import { createApp } from 'vue';

import type { Props as UiPopupWindowType } from '@/components/uikit/UiPopupWindow.vue';
import UiPopupWindow from '@/components/uikit/UiPopupWindow.vue'

export default {
    install(app: Application) {
        app.config.globalProperties.$confirm = function (text: string, params: UiPopupWindowType = {}) {
            return new Promise((resolve, reject) => {
                const confirm = createApp(UiPopupWindow, {
                    content: text,
                    applyButton: params.applyButton ?? 'apply',
                    cancelButton: params.cancelButton ?? 'cancel',
                    ...params,
                    onApply: () => {
                        confirm.unmount();
                        resolve(true);
                    },
                    onCancel: (e: string) => {
                        confirm.unmount();
                        reject(e === 'cancel-button' ? false : null);
                    }
                })

                const wrapper = document.createElement('div');
                confirm.mount(wrapper);
                document.body.appendChild(wrapper);
            })
        }
        app.provide('$confirm', app.config.globalProperties.$confirm)
    },
}
