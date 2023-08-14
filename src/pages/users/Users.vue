<template>
    <section class="pf-c-page__main-section">
        <UiTabs
            class="pf-u-mb-md"
            :items="items"
        />
        <router-view />
    </section>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import { pagesMap } from '@/router';
import usei18n from '@/hooks/useI18n';
import UiTabs from '@/components/uikit/UiTabs.vue';

const { t } = usei18n();
const route = useRoute();

const items = computed(() => ([
    {
        name: t('users.title'),
        value: pagesMap.usersGroupRecords,
        link: {
            name: pagesMap.usersGroupRecords,
        },
        active: route.name === pagesMap.usersGroupRecords,
    },
    {
        name: t('users.properties'),
        value: pagesMap.usersProperties,
        link: {
            name: pagesMap.usersProperties,
        },
        active: route.name === pagesMap.usersProperties,
    },
]));
</script>

<style scoped lang="scss"></style>
