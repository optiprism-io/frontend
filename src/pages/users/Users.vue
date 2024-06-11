<template>
  <section>
    <UiTabs class="pf-u-mb-md" :items="items" />
    <router-view />
  </section>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useRoute, RouterView } from 'vue-router'
import { pagesMap } from '@/router'
import usei18n from '@/hooks/useI18n'
import UiTabs from '@/components/uikit/UiTabs.vue'
import { useLexiconStore } from '@/stores/lexicon'

const { t } = usei18n()
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
