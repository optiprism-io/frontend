<template>
  <input
    :id="props.name"
    ref="input"
    class="pf-c-form-control"
    :value="props.modelValue || props.value"
    :placeholder="props.placeholder"
    :min="props.min"
    :required="props.required"
    :name="props.name"
    :type="props.type"
    :aria-invalid="invalid"
    :autocomplete="props.autocomplete"
    :disabled="disabled"
    @input="updateValue"
    @blur="blur"
  >
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useFocus } from '@vueuse/core'

const emit = defineEmits(['update:modelValue', 'blur', 'input'])

interface Props {
  modelValue?: number | string
  value?: number | string
  type?: string
  placeholder?: string
  min?: number
  mountFocus?: boolean
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
  mountFocus: false,
  placeholder: undefined,
  min: undefined,
  name: undefined,
  error: undefined,
  autocomplete: undefined,
  disabled: false,
  autofocus: false,
})

const input = ref<HTMLCanvasElement | null>(null)

onMounted(() => {
  if (props.mountFocus) {
    const inputElement = input.value
    if (inputElement) {
      inputElement.focus()
    }
  }
})

const updateValue = (e: Event) => {
  const target = e.target as HTMLInputElement

  emit('update:modelValue', target.value)
  emit('input', target.value)
}

const blur = (e: any) => emit('blur', e)

const { focused } = useFocus(input)
onMounted(() => {
  if (props.autofocus) focused.value = true
})
</script>
