<template>
  <div
    class="pf-v5-u-display-flex pf-v5-u-justify-content-center pf-v5-u-align-items-center"
    :class="{
      'pf-v5-u-h-100': props.h100,
      'pf-v5-u-my-4xl': !props.h100,
    }"
  >
    <div>
      <div
        v-if="!props.hideIcon"
        class="pf-v5-u-m-auto pf-v5-u-color-400 pf-v5-u-text-align-center"
      >
        <UiIcon
          class="pf-v5-u-font-size-4xl"
          :icon="'fas fa-search'"
        />
      </div>
      <div
        v-if="props.content"
        :class="titleClass"
        v-html="props.content"
      />
      <div
        v-else
        :class="titleClass"
      >
        <slot />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import UiIcon from '@/components/uikit/UiIcon.vue'

const props = defineProps<{
    hideIcon?: boolean;
    h100?: boolean;
    content?: string;
}>();

const titleClass = 'pf-v5-u-font-weight-bold pf-v5-u-text-align-center pf-v5-u-font-size-lg pf-v5-u-color-400 pf-v5-u-mt-xl';
</script>
