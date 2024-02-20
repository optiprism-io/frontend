<template>
  <nav class="pf-c-nav pf-m-horizontal-subnav" aria-label="Local">
    <ul class="pf-c-nav__list">
      <li v-for="item in items" :key="item.name" class="pf-c-nav__item">
        <RouterLink
          v-if="item.to"
          :to="item.to"
          class="pf-c-nav__link"
          aria-current="page"
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
import { pagesMap } from '@/router'
import usei18n from '@/hooks/useI18n'
import { RouterLink } from 'vue-router'

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
      name: pagesMap.reportsEventSegmentation.name,
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

<style scoped>
.pf-c-nav__link.pf-m-current,
.pf-c-nav__link.pf-m-current:hover,
.pf-c-nav__item.pf-m-current:not(.pf-m-expanded) .pf-c-nav__link {
  color: var(--pf-c-nav__link--m-current--Color);
  background-color: var(--pf-global--palette--cyan-700);
}
</style>
