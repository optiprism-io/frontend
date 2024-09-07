<template>
  <div class="pf-v5-c-form">
    <div class="pf-v5-c-form__group-label">
      <label
        class="pf-v5-c-form__label"
        :for="props.for"
      >
        <span class="pf-v5-c-form__label-text">{{ props.text }}</span>
        <span
          v-if="props.required"
          class="pf-v5-c-form__label-required"
          aria-hidden="true"
        >&#42;</span>
        <button
          v-if="props.info"
          class="pf-v5-c-form__group-label-help"
          aria-label="More info"
        >
          <i
            class="pficon pf-v5-icon-help"
            aria-hidden="true"
          />
        </button>
        <div class="pf-v5-c-form__group-control pf-v5-u-mt-xs">
          <slot />
        </div>
      </label>
      <div class="pf-v5-c-form__group-control pf-v5-u-mt-xs">
        <slot name="after" />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
interface Props {
    required?: boolean
    text: string
    for?: string
    info?: string
}

const props = defineProps<Props>()
</script>