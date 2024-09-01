<template>
  <div
    v-if="error"
    class="pf-v5-c-form__helper-text"
    aria-live="polite"
  >
    <div class="pf-v5-c-helper-text">
      <div class="pf-v5-c-helper-text__item pf-v5-m-error">
        <span class="pf-v5-c-helper-text__item-text"> {{ error }} </span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  error?: string | null
}

withDefaults(defineProps<Props>(), {
  error: null,
})
</script>
