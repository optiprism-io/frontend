<template>
    <div class="pf-c-select">
        <VDropdown
            placement="bottom-start"
            :triggers="[]"
            :shown="isOpen"
            @hide="onHide"
        >
            <span hidden>Choose one</span>
            <button
                class="pf-c-select__toggle"
                type="button"
                aria-haspopup="true"
                aria-expanded="false"
                aria-labelledby="select-single-label select-single-toggle"
                @click="onToggle"
            >
                <div class="pf-c-select__toggle-wrapper">
                    <span class="pf-c-select__toggle-text">{{ textValue }}</span>
                </div>
                <span class="pf-c-select__toggle-arrow">
                    <i
                        class="fas fa-caret-down"
                        aria-hidden="true"
                    />
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
                        >
                            <button
                                class="pf-c-select__menu-item"
                                role="option"
                                :class="{
                                    'pf-m-selected': item.selected,
                                }"
                            >
                                {{ item.nameDisplay }}
                            </button>
                            <span
                                v-if="item.selected"
                                class="pf-c-select__menu-item-icon"
                            >
                                <UiIcon :icon="'fas fa-check'" />
                            </span>
                        </li>
                    </ul>
                </div>
            </template>
        </VDropdown>
    </div>
</template>

<script lang="ts" setup>
import {ref, computed} from 'vue';

interface UiSelectOption {
    key: string | number;
    nameDisplay: string;
    value: string;
    disabled?: boolean;
}

interface Props {
    items: UiSelectOption[]
    selections?: string[]
    textButton?: string
    placeholder?: string
    variant?: 'single' | 'checkbox' | 'multiple'
    typehead?: boolean
}

const props = withDefaults(defineProps<Props>(), {
    textButton: '',
    placeholder: '',
    typehead: false,
    variant: 'single',
    selections: () => [],
});

const emit = defineEmits<{
    (e: "on-select", payload: string): void;
}>();

const isOpen = ref(false);

const textValue = computed(() => {
    if (props.variant === 'single') {
        return selectedSingleOption.value ? selectedSingleOption.value?.nameDisplay : props.textButton || props.placeholder || '';
    } else {
        return props.textButton || props.placeholder || '';
    }
})

const options = computed(() => {
    return props.items.map(item => {
        return {
            ...item,
            selected: props.selections.includes(item.value),
        };
    });
})

const selectedSingleOption = computed(() => {
    const selected = props.items.find(item => props.selections.includes(item.value));

    return selected || null;
})

const onToggle = () => {
    isOpen.value = !isOpen.value;
};

const onHide = () => {
    isOpen.value = false;
};

const onSelect = (value: string) => {
    emit('on-select', value);
};
</script>

<style lang="scss">
.pf-c-select {
    --min-width: 10rem;

    &__toggle {
        min-width: var(--min-width);
    }

    &__menu {
        position: initial;
        min-width: var(--min-width);
    }
}
</style>