<template>
  <input
    :id="props.name"
    class="pf-c-form-control"
    :value="modelValue || value"
    :placeholder="placeholder"
    :min="min"
    :required="required"
    :name="name"
    :type="type"
    :aria-invalid="invalid"
    :autocomplete="props.autocomplete"
    :disabled="disabled"
    :autofocus="autofocus"
    @input="updateValue"
    @blur="blur"
  >
</template>

<script setup lang="ts">
interface Props {
  modelValue?: number | string
  value?: number | string
  type?: string
  placeholder?: string
  min?: number
  required?: boolean
  name?: string
  error?: string
  invalid?: boolean
  autocomplete?: 'new-password' | 'current-password' | 'username'
  disabled?: boolean
  autofocus?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: '',
  value: '',
  type: 'text',
  placeholder: undefined,
  min: undefined,
  name: undefined,
  error: undefined,
  autocomplete: undefined,
  disabled: false,
  autofocus: false,
})

const emit = defineEmits<{
  (e: 'input', value: string): void
  (e: 'blur', value: any): void
  (e: 'update:modelValue', value: typeof props['modelValue']): void
}>()

const updateValue = (e: Event) => {
  const target = e.target as HTMLInputElement

  emit('update:modelValue', target.value)
  emit('input', target.value)
}

const blur = (e: any) => emit('blur', e)
</script>
