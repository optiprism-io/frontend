<template>
  <label
    class="pf-v5-c-switch"
    :class="{
      'pf-v5-m-reverse': props.reverse,
    }"
  >
    <span
      v-if="props.beforeLabel"
      class="pf-v5-c-switch__label pf-v5-c-switch__before-label"
    >
      {{ props.beforeLabel }}
    </span>
    <input
      class="pf-v5-c-switch__input"
      type="checkbox"
      :checked="props.value"
      @input="updateValue"
    >
    <span class="pf-v5-c-switch__toggle" />
    <span
      v-if="props.label"
      class="pf-v5-c-switch__label"
    >
      {{ props.label }}
    </span>
  </label>
</template>

<script lang="ts" setup>
interface Props {
    modelValue?: number | string | boolean
    value?: boolean
    label?: string
    beforeLabel?: string
    reverse?: boolean
}

const emit = defineEmits(['update:modelValue', 'input']);

const props = withDefaults(defineProps<Props>(), {
    modelValue: false,
    label: '',
    beforeLabel: '',
    reverse: false,
});

const updateValue = (e: Event) => {
    const target = e.target as HTMLInputElement

    emit('input', target.checked)
}
</script>

<style>
.pf-v5-c-switch.pf-v5-c-switch-white {
    --pf-v5-c-switch__input--checked__label--Color: var(--pf-v5-global--Color--light-100);
}
</style>
