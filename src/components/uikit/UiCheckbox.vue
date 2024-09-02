<template>
  <label class="ui-checkbox pf-c-check">
    <input
      class="pf-c-check__input"
      type="checkbox"
      :checked="props.modelValue || props.value"
      @input="updateValue"
    >

    <span
      v-if="label"
      class="pf-c-check__label"
    >{{ label }}</span>
  </label>
</template>

<script setup lang="ts">
interface Props {
    modelValue?: boolean
    value?: boolean
    label?: string
}

const props = defineProps<Props>()

const emit = defineEmits<{
  (e: 'input', value: boolean): void
  (e: 'update:modelValue', value: typeof props['modelValue']): void
}>()

const updateValue = (e: Event) => {
    const target = e.target as HTMLInputElement

    emit('update:modelValue', target.checked)
    emit('input', target.checked)
}
</script>
