<template>
  <li
    class="ui-select-item pf-c-menu__list-item"
    :class="{
      'pf-c-menu__list-item--selected': selected,
      'pf-c-menu__list-item--disabled': disabled,
    }"
    @click="emit('click')"
    @mouseover="emit('mouse-over')"
    @mouseout="emit('mouse-out')"
  >
    <div
      class="pf-c-menu__item"
    >
      <span class="ui-select-item__content">
        <span class="pf-c-menu__item-text">{{ label }}</span>
        <span
          v-if="editable"
          class="ui-select-item__content-edit"
        >
          <VTooltip
            popper-class="ui-hint"
          >
            <UiIcon icon="fas fa-edit" />
            <template #popper>
              {{ $t('common.edit') }}
            </template>
          </VTooltip>
        </span>
      </span>
    </div>
  </li>
</template>

<script setup lang="ts">
import { VTooltip } from 'floating-vue'

import UiIcon from '@/components/uikit/UiIcon.vue'

interface IProps {
  label?: string
  selected?: boolean
  disabled?: boolean
  editable?: boolean
}

withDefaults(defineProps<IProps>(), {
  label: '',
  selected: false,
  disabled: false,
  editable: false,
})

const emit = defineEmits<{
  (e: 'click'): void
  (e: 'mouse-over'): void
  (e: 'mouse-out'): void
}>()
</script>

<style lang="scss" scoped>
.pf-c-menu__item:hover,
.pf-c-menu__list-item--selected {
  background-color: var(--pf-c-menu__list-item--hover--BackgroundColor);
  cursor: pointer;
}

.pf-c-menu__list-item--disabled {
  background-color: var(--pf-c-menu__list-item--hover--BackgroundColor);
  opacity: .5;
  pointer-events: none;
  cursor: initial;
}

.pf-c-menu {
  &__list-item {
    cursor: pointer;
  }
}

.ui-select-item {
  &__sub-menu {
    width: 100%;
    min-width: 100%;
  }

  &__icon {
    display: inline-block;
    color: var(--pf-c-menu__item--Color);
    font-size: .6rem;
    margin-left: 1rem;
  }

  &__content {
    display: flex;
    align-items: center;
    padding-right: 1rem;
    position: relative;

    &:hover {
      .select-list-item__content-edit {
        opacity: 1;
      }
    }
  }

  &__content-edit {
    position: absolute;
    top: 50%;
    right: 2px;
    transform: translateY(-50%);
    opacity: 0;
  }
}
</style>
