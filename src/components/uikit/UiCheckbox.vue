<template>
  <label class="ui-checkbox pf-v5-c-check">
    <input
      class="pf-v5-c-check__input"
      type="checkbox"
      :checked="props.modelValue || props.value"
      @input="updateValue"
    >

    <span
      v-if="label"
      class="pf-v5-c-check__label"
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

const emit = defineEmits(['update:modelValue', 'input']);

const updateValue = (e: Event) => {
    const target = e.target as HTMLInputElement

    emit('update:modelValue', target.checked)
    emit('input', target.checked)
}
</script>