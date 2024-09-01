<template>
  <div
    class="pf-v5-c-inline-edit pf-v5-u-w-100"
    :class="{
      'pf-v5-m-inline-editable': isEditable,
    }"
  >
    <div class="pf-v5-c-inline-edit__group">
      <div class="pf-v5-c-inline-edit__value" @click="curIsEditable = true">
        {{ placeholder }}
      </div>
      <div class="pf-v5-c-inline-edit__action pf-v5-m-enable-editable pf-v5-u-ml-auto">
        <button
          class="pf-v5-c-button pf-v5-m-plain"
          type="button"
          aria-label="Edit"
          @click="curIsEditable = true"
        >
          <i class="fas fa-pencil-alt" aria-hidden="true" />
        </button>
      </div>
    </div>
    <div class="pf-v5-c-inline-edit__group">
      <div class="pf-v5-c-inline-edit__input">
        <slot />
      </div>
      <div class="pf-v5-c-inline-edit__group pf-v5-m-action-group pf-v5-m-icon-group pf-v5-u-mt-auto">
        <div class="pf-v5-c-inline-edit__action pf-v5-m-valid">
          <button
            class="pf-v5-c-button pf-v5-m-plain"
            type="button"
            aria-label="Save edits"
            @click="emit('save')"
          >
            <i class="fas fa-check" aria-hidden="true" />
          </button>
        </div>
        <div class="pf-v5-c-inline-edit__action">
          <button
            class="pf-v5-c-button pf-v5-m-plain"
            type="button"
            aria-label="Cancel edits"
            @click="emit('cancel')"
          >
            <i class="fas fa-times" aria-hidden="true" />
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useVModel } from '@vueuse/core'

interface Props {
  isEditable: boolean
  placeholder?: string
}

const props = withDefaults(defineProps<Props>(), {
  placeholder: '',
})

const emit = defineEmits(['update:isEditable', 'save', 'cancel'])

const curIsEditable = useVModel(props, 'isEditable', emit)
</script>
