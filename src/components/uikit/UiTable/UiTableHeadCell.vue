<template>
  <div :key="value" class="ui-table-th pf-v5-u-max-width">
    <button v-if="sorted" class="pf-v5-c-table__button">
      <div class="pf-v5-c-table__button-content">
        <span class="pf-v5-c-table__text">{{ title }}</span>
        <span class="pf-v5-c-table__sort-indicator">
          <i class="fas fa-arrows-alt-v" />
        </span>
      </div>
    </button>
    <span
      v-else
      class="pf-v5-c-table__text"
      :title="title.toString()"
    >
      {{ title }}
    </span>
  </div>
</template>

<script lang="ts" setup>
type Props = {
  value: string | number
  title: string | number
  sorted?: boolean
}

defineProps<Props>()
</script>

<style>
.ui-table-th {
  --pf-v5-u-max-width--MaxWidth: 400px;
}
</style>
