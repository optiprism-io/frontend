<template>
    <div
        class="pf-c-inline-edit pf-u-w-100"
        :class="{
            'pf-m-inline-editable': isEditable,
        }"
    >
        <div class="pf-c-inline-edit__group">
            <div class="pf-c-inline-edit__value">
                {{ placeholder }}
            </div>
            <div class="pf-c-inline-edit__action pf-m-enable-editable pf-u-ml-auto">
                <button
                    class="pf-c-button pf-m-plain"
                    type="button"
                    aria-label="Edit"
                    @click="curIsEditable = true"
                >
                    <i
                        class="fas fa-pencil-alt"
                        aria-hidden="true"
                    />
                </button>
            </div>
        </div>
        <div class="pf-c-inline-edit__group">
            <div class="pf-c-inline-edit__input">
                <slot />
            </div>
            <div
                class="pf-c-inline-edit__group pf-m-action-group pf-m-icon-group pf-u-mt-auto"
            >
                <div class="pf-c-inline-edit__action pf-m-valid">
                    <button
                        class="pf-c-button pf-m-plain"
                        type="button"
                        aria-label="Save edits"
                        @click="emit('save')"
                    >
                        <i
                            class="fas fa-check"
                            aria-hidden="true"
                        />
                    </button>
                </div>
                <div class="pf-c-inline-edit__action">
                    <button
                        class="pf-c-button pf-m-plain"
                        type="button"
                        aria-label="Cancel edits"
                        @click="emit('cancel')"
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
import { useVModel } from '@vueuse/core';

interface Props {
  isEditable: boolean;
  placeholder?: string;
}

const props = withDefaults(defineProps<Props>(), {
    placeholder: '',
});

const emit = defineEmits(['update:isEditable', 'save', 'cancel']);

const curIsEditable = useVModel(props, 'isEditable', emit);
</script>
