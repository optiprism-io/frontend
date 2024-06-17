<template>
  <nav class="pf-c-breadcrumb" aria-label="breadcrumb">
    <ol class="pf-c-breadcrumb__list">
      <li
        v-for="(item, idx) in items"
        :key="idx"
        class="pf-c-breadcrumb__item"
      >
        <span v-if="idx !== 0" class="pf-c-breadcrumb__item-divider">
          <i class="fas fa-angle-right" aria-hidden="true" />
        </span>
        <RouterLink
          :to="item.to"
          :custom="!item.isActive"
          exact-active-class="pf-m-current"
        >
          <span
            :class="{
              'pf-c-breadcrumb__link': !item.isActive,
              'pf-m-current': !item.isActive,
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
