<template>
  <UiInputGroup>
    <UiInput
      v-model="curModelValue"
      :name="name"
      :type="showPassword ? 'text' : 'password'"
      :invalid="invalid"
      :autofocus="autofocus"
      @input="emit('input', $event)"
    />
    <UiButton class="pf-v5-m-control" @click="showPassword = !showPassword">
      <UiIcon :icon="['fas', showPassword ? 'fa-eye-slash' : 'fa-eye']" />
    </UiButton>
  </UiInputGroup>
</template>

<script setup lang="ts">
import { ref } from 'vue'

import { useVModel } from '@vueuse/core'

import UiButton from '@/components/uikit/UiButton.vue'
import UiIcon from '@/components/uikit/UiIcon.vue'
import UiInput from '@/components/uikit/UiInput.vue'
import UiInputGroup from '@/components/uikit/UiInputGroup.vue'

interface Props {
  modelValue: string
  invalid?: boolean
  autofocus?: boolean
  name?: string
}

const props = withDefaults(defineProps<Props>(), {
  invalid: false,
  autofocus: false,
  name: 'password',
})

const emit = defineEmits(['update:modelValue', 'input'])

const curModelValue = useVModel(props, 'modelValue', emit)

const showPassword = ref(false)
</script>
