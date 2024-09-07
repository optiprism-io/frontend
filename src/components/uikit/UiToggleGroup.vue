<template>
  <div
    class="pf-v5-c-toggle-group"
    :class="{
      'pf-v5-m-compact': isCompact,
    }"
  >
    <div
      v-if="$slots.before"
      class="pf-v5-c-toggle-group__item"
    >
      <slot name="before" />
    </div>
    <div
      v-for="item in props.items"
      :key="item.key"
      class="pf-v5-c-toggle-group__item"
    >
      <button
        class="pf-v5-c-toggle-group__button"
        :class="{
          'pf-v5-m-selected': item.selected,
        }"
        type="button"
        :disabled="item.disabled"
        @click="select(item)"
      >
        <span
          v-if="item.iconBefore"
          class="pf-v5-c-toggle-group__icon"
        >
          <UiIcon :icon="item.iconBefore" />
        </span>
        <span
          v-if="item.nameDisplay"
          class="pf-v5-c-toggle-group__text"
        >
          {{ item.nameDisplay }}
        </span>
        <span
          v-if="item.iconAfter"
          class="pf-v5-c-toggle-group__icon"
        >
          <UiIcon :icon="item.iconAfter" />
        </span>
      </button>
    </div>
    <div
      v-if="$slots.after"
      class="pf-v5-c-toggle-group__item"
    >
      <slot name="after" />
    </div>
  </div>
</template>

<script lang="ts" setup>
import UiIcon from '@/components/uikit/UiIcon.vue'

export interface UiToggleGroupItem {
    key: string | number;
    nameDisplay: string;
    value: string;
    selected?: boolean;
    disabled?: boolean;
    iconBefore?: string;
    iconAfter?: string;
}

export interface Props {
    items: UiToggleGroupItem[];
    isCompact?: boolean,
}

const props = withDefaults(defineProps<Props>(), {
    isCompact: false,
});

const emit = defineEmits<{
    (e: 'select', item: string): void;
}>();

const select = (item: UiToggleGroupItem) => {
    emit('select', item.value);
}
</script>

<style lang="scss" scoped>
.multi-select-list-item {
    &__input {
        pointer-events: none;
    }
}
</style>
