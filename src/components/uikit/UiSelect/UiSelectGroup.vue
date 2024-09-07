<template>
  <VMenu
    placement="right-start"
    :triggers="['hover']"
    :delay="200"
    :offset="[0, 0]"
    class="select-list-item__sub-menu"
  >
    <div class="pf-v5-c-menu__item">
      <div class="select-list-item__content">
        <span class="pf-v5-c-menu__item-text">{{ label }}</span>
        <UiIcon
          class="select-list-item__icon"
          icon="fas fa-chevron-right"
        />
      </div>
    </div>
    <template #popper>
      <div class="pf-v5-c-card pf-v5-m-display-lg pf-v5-u-min-width">
        <div class="pf-v5-c-menu pf-v5-m-plain pf-v5-m-scrollable">
          <ul class="pf-v5-c-menu__list">
            <slot />
          </ul>
        </div>
      </div>
    </template>
  </VMenu>
</template>

<script setup lang="ts">
import { Menu as VMenu } from 'floating-vue'

import UiIcon from '@/components/uikit/UiIcon.vue'

defineProps({
    label: {
        type: String,
        default: '',
    },
})
</script>
