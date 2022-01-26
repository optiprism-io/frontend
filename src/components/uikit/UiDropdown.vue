<template>
    <div class="pf-c-dropdown pf-m-expanded">
        <VDropdown
            placement="bottom-start"
            :triggers="[]"
            :shown="isOpen"
            @hide="onHide"
        >
            <template v-if="$slots.button">
                <slot name="button" />
            </template>
            <button
                v-else
                class="pf-c-dropdown__toggle"
                aria-expanded="true"
                type="button"
                @click="onToggle"
            >
                <span
                    class="pf-c-dropdown__toggle-text"
                    :class="{
                        'pf-u-color-400': !textValue,
                    }"
                >
                    {{ textValue }}
                </span>
                <span class="pf-c-dropdown__toggle-icon">
                    <i
                        class="fas fa-caret-down"
                        aria-hidden="true"
                    />
                </span>
            </button>
            <template #popper>
                <div class="pf-c-dropdown">
                    <ul
                        class="pf-c-dropdown__menu"
                        aria-labelledby="dropdown-expanded-button"
                    >
                        <li
                            v-for="item in items"
                            :key="item.key"
                            v-close-popper
                            @click="onClick(item)"
                        >
                            <a
                                v-if="item.href"
                                class="pf-c-dropdown__menu-item"
                                href="#"
                            >
                                {{ item.nameDisplay }}
                            </a>
                            <button
                                v-else
                                class="pf-c-dropdown__menu-item"
                                :class="{
                                    'pf-u-background-color-200': item.selected,
                                }"
                                type="button"
                            >
                                {{ item.nameDisplay }}
                            </button>
                        </li>
                    </ul>
                </div>
            </template>
        </VDropdown>
    </div>
</template>

<script lang="ts">
import { defineComponent, PropType, ref, computed } from 'vue';

export interface UiDropdownItem<T> {
    key: string | number;
    nameDisplay: string;
    value: T;
    selected?: boolean;
    disabled?: boolean;
    iconBefore?: boolean;
    iconAfter?: string;
    href?: string;
}

class UiDropdownFactory<T = unknown> {
    define() {
        return defineComponent({
            name: 'UiDropdown',
            props: {
                items: {
                    type: Array as PropType<UiDropdownItem<T>[]>,
                    required: true,
                },
                isCompact: Boolean,
                placeholder: {
                    type: String,
                    default: '',
                },
                textButton: {
                    type: String,
                    default: '',
                },
            },
            emits: {
                deselect: (payload: UiDropdownItem<T>) => payload,
                select: (payload: UiDropdownItem<T>) => payload
            },
            setup(props, { emit }) {

                const isOpen = ref(false);
                const textValue = computed(() => {
                    return props.textButton ? props.textButton : props.placeholder;
                })

                const onClick = (item: UiDropdownItem<T>) => {
                    emit('select', item);
                };

                const onToggle = () => {
                    isOpen.value = !isOpen.value;
                };

                const onHide = () => {
                    isOpen.value = false;
                };

                return {
                    isOpen,
                    textValue,
                    onClick,
                    onHide,
                    onToggle,
                };
            }
        })
    }
}

const main = new UiDropdownFactory().define();

export function GenericUiDropdown<T>() {
    return main as ReturnType<UiDropdownFactory<T>['define']>;
}

export default main;
</script>

<style lang="scss">
.v-popper {
    &--theme-dropdown {
        .v-popper__arrow-container {
            display: none;
        }
        .v-popper {
            &__inner {
                padding: 0;
                border-radius: 0;
                border: initial;
            }
        }
    }
}

.pf-c-dropdown {
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
