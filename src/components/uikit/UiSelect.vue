<template>
  <div class="pf-c-select">
    <VDropdown
      :placement="props.placement"
      :triggers="[]"
      :shown="isOpen"
      @hide="onHide"
    >
      <div v-if="$slots.action" @click="onToggle">
        <slot name="action" />
      </div>
      <button
        v-else
        :class="{
          'pf-u-w-100': props.w100,
          'pf-c-select__toggle': props.isToggle,
          'pf-c-dropdown__toggle pf-m-plain pf-m-text': props.isTextSelect,
        }"
        type="button"
        aria-haspopup="true"
        aria-expanded="false"
        aria-labelledby="select-single-label select-single-toggle"
        @click="onToggle"
      >
        <div
          class="pf-c-select__toggle-wrapper"
          :class="{
            'pf-c-select__toggle-wrapper_full': props.fullText,
          }"
        >
          <span class="pf-c-select__toggle-text">{{ textValue }}</span>
        </div>
        <span
          v-if="selectedSingleOption && clearable"
          class="pf-c-select__menu-item-icon"
          @click="removeSelect"
        >
          <UiIcon :icon="'fas fa-times'" />
        </span>
        <span v-else class="pf-c-select__toggle-arrow">
          <i class="fas fa-caret-down" aria-hidden="true" />
        </span>
      </button>
      <template #popper>
        <div class="pf-c-select">
          <ul
            class="pf-c-select__menu"
            role="listbox"
            aria-labelledby="select-single-label"
          >
            <li
              v-for="item in options"
              :key="item.key"
              v-close-popper="props.variant === 'single'"
              role="presentation"
              @click="onSelect(item)"
            >
              <button
                class="pf-c-select__menu-item"
                role="option"
                :class="{
                  'pf-m-selected': item.selected,
                }"
              >
                {{ item.nameDisplay }}
                <span v-if="item.selected" class="pf-c-select__menu-item-icon">
                  <UiIcon :icon="'fas fa-check'" />
                </span>
              </button>
            </li>
          </ul>
        </div>
      </template>
    </VDropdown>
  </div>
</template>

<script setup lang="ts">
import { defineComponent, PropType, ref, computed } from 'vue'

type Value = string | number | Record<string, any> | any[]

export interface UiSelectGroupItem {
  title: string,
  items: UiSelectItem<Value>[]
}

export interface UiSelectItem<T> {
  key: string | number
  nameDisplay: string
  value: T
  disabled?: boolean
  isTextSelect?: boolean
}

export interface Props {
  items?: UiSelectItem<Value>[]
  groupItems?: UiSelectGroupItem[]
  selections?: Value[]
  textButton?: string
  placeholder?: string
  variant?: 'single' | 'checkbox' | 'multiple'
  typehead?: boolean
  clearable?: boolean
  fullText?: boolean
  isTextSelect?: boolean
  placement?: 'bottom-start' | 'bottom-end'
  isToggle: boolean
  w100?: boolean
}


const props = withDefaults(defineProps<Props>(), {
  items: [],
  variant: 'single',
  isToggle: true,
  placement: 'bottom-start'
})

const emit = defineEmits<{
    (e: 'cancel', target: string): void
    (e: 'onSelect'): void
    (e: 'onClear'): void
}>()


const isOpen = ref(false)

const textValue = computed(() => {
  if (props.variant === 'single') {
    return props.textButton
      ? props.textButton
      : selectedSingleOption.value
        ? selectedSingleOption.value?.nameDisplay
        : props.placeholder || ''
  } else {
    return props.textButton || props.placeholder || ''
  }
})

const options = computed(() => {
  return props.items.map(item => {
    return {
      ...item,
      selected: props.selections.includes(item.value),
    }
  })
})

  const selectedSingleOption = computed(() => {
    const selected = props.items.find(item => props.selections.includes(item.value))

    return selected || null
  })

  const onToggle = () => {
    isOpen.value = !isOpen.value
  }

  const onHide = () => {
    isOpen.value = false
  }

  const onSelect = (item: UiSelectItem<Value>) => {
    emit('onSelect', item.value)
  }

  const removeSelect = (e: Event) => {
    e.stopPropagation()
    emit('onClear')
  }
</script>

<style lang="scss">
.pf-c-select {
  --min-width: 10rem;

  &__toggle {
    min-width: var(--min-width);
  }

  &__toggle-wrapper {
    padding-right: 1.4rem;

    &_full {
      max-width: 100%;
    }
  }

  &__menu {
    position: initial;
    min-width: var(--min-width);
  }
}
</style>
