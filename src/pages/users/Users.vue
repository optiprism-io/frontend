<template>
  <section>
    <UiTabs class="pf-u-mb-md" :items="items" />
    <RouterView />
  </section>
</template>

<script setup lang="ts">
import { computed } from 'vue'

import { useRoute, RouterView } from 'vue-router'

import UiTabs from '@/components/uikit/UiTabs.vue'

import useI18n from '@/hooks/useI18n'
import { pagesMap } from '@/router'

const { t } = useI18n()
const route = useRoute()

const items = computed(() => [
  {
    name: t('users.properties'),
    value: pagesMap.usersProperties,
    link: {
      name: pagesMap.usersProperties,
    },
    active: route.name === pagesMap.usersProperties,
  },
])
</script>

<style scoped lang="scss"></style>
