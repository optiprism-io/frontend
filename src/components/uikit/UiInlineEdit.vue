<template>
  <div
    class="pf-v5-c-inline-edit"
    :class="{
      'pf-v5-m-inline-editable': isEditable,
    }"
  >
    <div
      class="pf-v5-c-inline-edit__group"
      @click="setEditable(true)"
    >
      <div
        v-if="!props.hideText"
        class="pf-v5-c-inline-edit__value"
      >
        {{ value || props.placeholderValue }}
      </div>
      <div
        v-if="!props.hideControlEdit"
        class="pf-v5-c-inline-edit__action pf-v5-m-enable-editable"
      >
        <button
          class="pf-v5-c-button pf-v5-m-plain"
          type="button"
          aria-label="Edit"
        >
          <i
            class="fas fa-pencil-alt"
            aria-hidden="true"
          />
        </button>
      </div>
    </div>
    <div class="pf-v5-c-inline-edit__group">
      <div class="pf-v5-c-inline-edit__input">
        <input
          ref="input"
          class="pf-v5-c-form-control"
          type="text"
          :value="valueEdit"
          @input="updateValue"
        >
      </div>
      <div class="pf-v5-c-inline-edit__group pf-v5-m-action-group pf-v5-m-icon-group">
        <div class="pf-v5-c-inline-edit__action pf-v5-m-valid">
          <button
            class="pf-v5-c-button pf-v5-m-plain"
            type="button"
            aria-label="Save edits"
            @click="onInput"
          >
            <i
              class="fas fa-check"
              aria-hidden="true"
            />
          </button>
        </div>
        <div class="pf-v5-c-inline-edit__action">
          <button
            class="pf-v5-c-button pf-v5-m-plain"
            type="button"
            aria-label="Cancel edits"
            @click="setEditable(false)"
          >
            <i
              class="fas fa-times"
              aria-hidden="true"
            />
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'

interface Props {
    value: number | string
    placeholderValue?: string
    hideText?: boolean
    hideControlEdit?: boolean
}

const props = withDefaults(defineProps<Props>(), {
    value: '',
    placeholderValue: '',
    hideText: false,
    hideControlEdit: false
})

const emit = defineEmits([
    'on-input',
    'on-edit',
])

const valueEdit = ref<string | number>('')
const isEditable = ref(false)
const input = ref<HTMLCanvasElement | null>(null)

const updateValue = (e: Event) => {
    const target = e.target as HTMLInputElement
    valueEdit.value = target.value
}

const setEditable = (payload: boolean) => {
    const inputElement = input.value
    emit('on-edit', payload);
    valueEdit.value = props.value
    isEditable.value = payload
    setTimeout(() => {
        if (payload && inputElement) {
            inputElement.focus()
        }
    }, 300);
}

const onInput = () => {
    emit('on-input', valueEdit.value)
    setEditable(false)
}
</script>

<style lang="scss">
.pf-v5-c-inline-edit {
    &__value {
        cursor: pointer;
    }
}
</style>