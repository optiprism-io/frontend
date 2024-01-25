<template>
    <router-view />
    <UiAlertGroup
        v-if="alertsStore.items.length"
        class="app-toast-alerts"
        :items="alertsStore.items"
        @close="closeAlert"
    />
</template>

<script lang="ts" setup>
import axios, { HttpStatusCode } from 'axios'
import { useAuthStore } from '@/stores/auth/auth';
import { useAlertsStore } from '@/stores/alerts';
import { ErrorResponse } from '@/api';
import UiAlertGroup from './components/uikit/UiAlertGroup.vue';
import usei18n from '@/hooks/useI18n';

const { t } = usei18n();
const authStore = useAuthStore();
const alertsStore = useAlertsStore();

const closeAlert = (id: string) => alertsStore.closeAlert(id);

const createErrorGeneral = (res: ErrorResponse, text?: string) => {
    alertsStore.createAlert({
        time: 7000,
        type: 'danger',
        text: text ?? res.error?.message ?? t('errors.internal'),
    });
};

axios.interceptors.response.use(res => res, async err => {
    const error = `${err?.response?.status || err?.error?.status || ''} ${err?.code || ''} ${err?.message}`;


    if (err?.response) {
        if (err.code === 'ERR_NETWORK') {
            createErrorGeneral(err.response, error);
            return Promise.reject(err);
        }

        switch (err?.response?.status || err?.error?.status) {
            case HttpStatusCode.BadRequest:
                if (err.response?.data) {
                    if (err.response?.data?.error?.message) {
                        createErrorGeneral(
                            err.response,
                            err.response.data.error.message
                        );
                    }
                    return Promise.reject(err.response.data);
                }
                break;
            case HttpStatusCode.Unauthorized:
                await authStore.onRefreshToken();
                return Promise.reject(err);
            case HttpStatusCode.InternalServerError:
            case HttpStatusCode.ServiceUnavailable:
            default:
                createErrorGeneral(err, error);
                break;

        }
    }

    return Promise.resolve();
});
</script>

<style lang="scss">
@mixin styled-scroll {
    scrollbar-width: thin;
    scrollbar-color: var(--pf-global--palette--black-150) transparent;

    &::-webkit-scrollbar {
        margin-top: 1rem;
        display: block;
        width: 0.6rem;
        height: 0.6rem;
    }

    &::-webkit-scrollbar-track {
        background-color: var(--pf-global--BackgroundColor--200);
        border-radius: 0.4rem;
    }

    &::-webkit-scrollbar-thumb {
        background-color: #979da3;
        border-radius: 0.4rem;
    }
}

.pf-icon {
    -moz-osx-font-smoothing: grayscale;
    -webkit-font-smoothing: antialiased;
    display: inline-block;
    font-style: normal;
    font-variant: normal;
    text-rendering: auto;
    line-height: 1;
}

#app {
    min-height: 100vh;
}

.pf-c-page {
    background-color: var(--op-base-background);
    min-height: 100vh;

    &__main-section {
        padding: var(--pf-global--spacer--md);
    }

    &__main {
        z-index: initial
    }
}

.pf-c-menu.pf-m-scrollable {
    .pf-c-menu__content {
        @include styled-scroll();
    }
}

.op-opacity-0 {
    opacity: 0;
}

.app-toast-alerts {
    position: fixed;
    top: 30px;
    right: 30px;
    z-index: 1000;
    max-width: 550px;
    max-height: calc(100vh - 50px);
    overflow: auto;
}
</style>
