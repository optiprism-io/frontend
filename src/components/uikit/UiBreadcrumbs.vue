<template>
  <nav class="pf-v5-c-breadcrumb" aria-label="breadcrumb">
    <ol class="pf-v5-c-breadcrumb__list">
      <li
        v-for="(item, idx) in items"
        :key="idx"
        class="pf-v5-c-breadcrumb__item"
      >
        <span v-if="idx !== 0" class="pf-v5-c-breadcrumb__item-divider">
          <i class="fas fa-angle-right" aria-hidden="true" />
        </span>
        <RouterLink
          :to="item.to"
          :custom="!item.isActive"
          exact-active-class="pf-v5-m-current"
        >
          <span
            :class="{
              'pf-v5-c-breadcrumb__link': !item.isActive,
              'pf-v5-m-current': !item.isActive,
            }"
          >
            {{ capitalize(item.title) || 'Breadcrumb' }}
          </span>
        </RouterLink>
      </li>
    </ol>
  </nav>
</template>

<script setup lang="ts">
import { capitalize } from 'vue'

import { RouterLink } from 'vue-router'

import type { RouteLocationMatched} from 'vue-router';

interface BreadcrumbItem {
  title: string
  to: RouteLocationMatched
  isActive?: boolean
}

interface IProps {
  items: BreadcrumbItem[]
}

defineProps<IProps>()
</script>
