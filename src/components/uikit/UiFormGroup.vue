<template>
  <div
    class="ui-form-group pf-v5-c-form__group"
    :class="{
      'pf-v5-m-action': props.action,
      'pf-v5-u-mb-md': props.indent,
    }"
  >
    <label
      v-if="props.label"
      class="pf-v5-c-form__label"
      :for="props.for"
    >
      <span class="pf-v5-c-form__label-text">
        {{ props.label }}
      </span>
      <span
        v-if="props.required"
        class="pf-v5-c-form__label-required"
        aria-hidden="true"
      >
        &#42;
      </span>
    </label>
    <slot />
    <p
      v-if="props.error"
      class="pf-v5-c-form__helper-text pf-v5-m-error"
      aria-live="polite"
    >
      <span class="pf-v5-c-form__helper-text-icon">
        <i
          class="fas fa-exclamation-circle"
          aria-hidden="true"
        />
      </span>
      {{ props.error }}
    </p>
  </div>
</template>

<script setup lang="ts">
interface Props {
    error?: string | null
    label?: string
    for?: string
    required?: boolean
    action?: boolean
    indent?: boolean
}

const props = withDefaults(defineProps<Props>(), {
    error: '',
    label: '',
    for: undefined,
    required: false,
    action: false,
    indent: true,
});
</script>
