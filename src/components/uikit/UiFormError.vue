<template>
  <div
    v-if="error"
    class="pf-c-form__helper-text"
    aria-live="polite"
  >
    <div class="pf-c-helper-text">
      <div class="pf-c-helper-text__item pf-m-error">
        <span class="pf-c-helper-text__item-text"> {{ error }} </span>
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
