<template>
  <div class="pf-c-page__sidebar">
    <div class="pf-c-page__sidebar-body">
      <nav class="pf-c-nav">
        <ul class="pf-c-nav__list">
          <li
            v-for="(item, idx) in items"
            :key="idx"
            class="pf-c-nav__item"
          >
            <RouterLink
              :to="item.to"
              class="pf-c-nav__link"
              active-class="pf-m-current"
              :class="{ 'pf-m-current': item.isActive }"
            >
              {{ item.title }}
            </RouterLink>
          </li>
        </ul>
      </nav>
    </div>
  </div>
</template>

<script setup lang="ts">
import { RouterLink } from 'vue-router'

import type { RouteLocationMatched, RouteLocationRaw} from 'vue-router';

interface NavItem {
  title: string
  to: RouteLocationMatched | RouteLocationRaw
  isActive?: boolean
}

interface IProps {
  items: NavItem[]
}

defineProps<IProps>()
</script>
