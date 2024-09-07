<template>
  <form
    class="ui-form pf-v5-c-form"
    @submit.prevent="handleSubmit"
  >
    <div
      v-if="props.errorMain"
      class="ui-form__error"
    >
      <UiAlert
        class="ui-form__error pf-v5-c-form__helper-text pf-v5-m-error"
        :item="errorMainItem"
      />
    </div>
    <div class="ui-form__content">
      <slot />
    </div>
  </form>
</template>

<script setup lang="ts">
import { computed } from 'vue'

import UiAlert from '@/components/uikit/UiAlert.vue'

import { AlertTypeEnum } from '@/hooks/useAlert'
import { generateUUID } from '@/utils/generateUuid'

interface Props {
    errorMain?: string
}

const emit = defineEmits<{
    (e: 'submit', event: Event): void,
}>()

const props = withDefaults(defineProps<Props>(), {
    errorMain: '',
});

const errorMainItem = computed(() => {
    return {
        id: generateUUID(),
        type: AlertTypeEnum.Danger,
        text: props.errorMain,
        noClose: true,
    };
});

const handleSubmit = (event: Event) => {
    emit('submit', event);
};
</script>
