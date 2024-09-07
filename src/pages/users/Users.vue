<template>
  <section>
    <UiTabs class="pf-u-mb-md" :items="items" />
    <RouterView />
  </section>
</template>

<script setup lang="ts">

import { computed, onMounted } from 'vue'

import { useI18n } from 'vue-i18n'
import { useRoute, RouterView } from 'vue-router'

import UiTabs from '@/components/uikit/UiTabs.vue'

import { pagesMap } from '@/router'
import { useLexiconStore } from '@/stores/lexicon'

const { t } = useI18n()
const route = useRoute()
const lexiconStore = useLexiconStore()

const items = computed(() => [
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
])

onMounted(() => {
  lexiconStore.getEventProperties()
})
</script>

<style scoped lang="scss"></style>
