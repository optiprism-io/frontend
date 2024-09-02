<template>
  <div
    ref="inputTags"
    class="ui-input-tags"
  >
    <UiInput
      v-if="edit || !props.value?.length"
      :value="inputValue"
      :mount-focus="Boolean(props.value?.length)"
      @input="onInput"
      @blur="onBlur"
    />
    <div
      v-else
      @click="setEdit"
    >
      <UiTags :value="props.value" />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'

import UiInput from './UiInput.vue'
import UiTags from './UiTags.vue'

interface Props {
  value: string[]
}

const props = defineProps<Props>()

const emit = defineEmits<{
  (e: 'input', value: typeof props['value']): void
}>()

const inputValue = ref('')
const edit = ref(false)
const inputTags = ref<HTMLElement>();

const setEdit = () => {
    inputValue.value = props.value?.join(', ')
    edit.value = true;
    if (inputTags.value) {
        inputTags.value.addEventListener('keypress', eventKeypressEnter);
    }
}

const onInput = (payload: string) => {
    inputValue.value = payload;
}

const onBlur = () => {
    edit.value = false
    emit('input', inputValue.value.replace(/\s/g, '').split(',').filter(item => Boolean(item)))
}

const eventKeypressEnter = (e: KeyboardEvent) => {
    if (e?.key === 'Enter') {
        onBlur();
    }
};

onMounted(() => {
    if (inputTags.value) {
        inputTags.value.addEventListener('keypress', eventKeypressEnter);
    }
});

onBeforeUnmount(() => {
    if (inputTags.value) {
        inputTags.value.removeEventListener('keypress', eventKeypressEnter);
    }
});
</script>

<style lang="scss">
.ui-input-tags {
    cursor: pointer;
    min-height: 37px;

    .ui-tag {
        min-height: 34px;
    }
}
</style>
