<template>
  <UiCardContainer>
    <UiCardTitle v-if="title">
      <RouterLink v-if="link" :to="link">
        {{ title }}
      </RouterLink>
      <span v-else>
        {{ title }}
      </span>
      <template v-if="$slots.rightTitle" #right>
        <slot name="rightTitle" />
      </template>
    </UiCardTitle>
    <UiCardBody>
      <slot />
    </UiCardBody>
  </UiCardContainer>
</template>

<script setup lang="ts">
import { RouterLink } from 'vue-router'

import UiCardBody from '@/components/uikit/UiCard/UiCardBody.vue'
import UiCardContainer from '@/components/uikit/UiCard/UiCardContainer.vue'
import UiCardTitle from '@/components/uikit/UiCard/UiCardTitle.vue'

interface IProps {
  title?: string
  link?: string | Record<string, unknown>
}

withDefaults(defineProps<IProps>(), {
  title: '',
  link: undefined,
})
</script>
