<template>
  <label
    class="pf-c-switch"
    :class="{
      'pf-m-reverse': props.reverse,
    }"
  >
    <span
      v-if="props.beforeLabel"
      class="pf-c-switch__label pf-c-switch__before-label"
    >
      {{ props.beforeLabel }}
    </span>
    <input
      class="pf-c-switch__input"
      type="checkbox"
      :checked="props.value"
      @input="updateValue"
    >
    <span class="pf-c-switch__toggle" />
    <span
      v-if="props.label"
      class="pf-c-switch__label"
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

const props = withDefaults(defineProps<Props>(), {
    modelValue: false,
    label: '',
    beforeLabel: '',
    reverse: false,
});

const emit = defineEmits<{
  (e: 'input', value: boolean): void
  (e: 'update:modelValue', value: typeof props['modelValue']): void
}>()

const updateValue = (e: Event) => {
    const target = e.target as HTMLInputElement

    emit('input', target.checked)
}
</script>

<style>
.pf-c-switch.pf-c-switch-white {
    --pf-c-switch__input--checked__label--Color: var(--pf-global--Color--light-100);
}
</style>
