<template>
  <nav class="pf-c-nav pf-m-horizontal-subnav" aria-label="Local">
    <ul class="pf-c-nav__list">
      <li
        v-for="item in items"
        :key="item.name"
        class="pf-c-nav__item"
      >
        <RouterLink
          v-if="item.to"
          :to="item.to"
          class="pf-c-nav__link"
          aria-current="page"
          active-class="pf-m-current"
          @click="onClick($event, item.to.name)"
        >
          {{ item.name }}
        </RouterLink>
      </li>
    </ul>
  </nav>
</template>

<script lang="ts" setup>
import { computed } from 'vue'

import { RouterLink } from 'vue-router'

import usei18n from '@/hooks/useI18n'
import { pagesMap } from '@/router'

const { t } = usei18n()

const emit = defineEmits<{
  (e: 'on-click-item', event: PointerEvent, name: string): void
}>()

const configNav = [
  {
    name: 'dashboards.title',
    to: {
      name: pagesMap.dashboards.name,
    },
  },
  {
    name: 'reports.title',
    to: {
      name: pagesMap.reports,
      params: {
        id: null,
      },
    },
  },
  {
    name: 'events.events',
    to: {
      name: pagesMap.eventsLiveStream.name,
    },
  },
]

const items = computed(() => {
  return configNav.map(item => {
    return {
      ...item,
      name: t(item.name),
    }
  })
})

const onClick = (event: PointerEvent, name: string) => {
  emit('on-click-item', event, name)
}
</script>
