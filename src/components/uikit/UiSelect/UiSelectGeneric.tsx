// TODO: add types for UiSelectGeneric
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import type { PropType, Ref } from 'vue';
import { computed, defineComponent, ref } from 'vue';

import { Dropdown as VDropdown } from 'floating-vue'

import UiIcon from '@/components/uikit/UiIcon.vue'
import UiSelectGroup from '@/components/uikit/UiSelect/UiSelectGroup.vue'
import UiSelectItem from '@/components/uikit/UiSelect/UiSelectItem.vue'

import type { UiSelectItemInterface } from './types';
import '@/components/uikit/UiSelect/styles.scss'

export function UiSelectGeneric<T>() {
    return defineComponent({
        name: 'UiSelect',
        components: {
            UiSelectItem,
            VDropdown
        },
        props: {
            items: {
                type: Array as PropType<UiSelectItemInterface<T>[]>,
                default: () => []
            },
            modelValue: {
                type: [String, Number, Object] as PropType<T | null>,
                default: null
            },
            showSearch: {
                type: Boolean,
                default: true
            },
        },
        emits: ['update:modelValue', 'search'],
        setup(props, {slots, emit}) {
            const hovered = ref<UiSelectItemInterface<T, 'item'> | null>(null)
            const search = ref('')

            const filteredItems = computed(() => {
                return props.items.filter(item => {
                    if (item.__type === 'item') {
                        return item.label.toLowerCase().includes(search.value.toLowerCase())
                    } else {
                        return !!item.items.find(subItem => {
                            return subItem.label.toLowerCase().includes(search.value.toLowerCase())
                        })
                    }
                })
            })

            const handleInput = (e: Event): void => {
                search.value = (e.target as HTMLInputElement).value;
                emit('search', search.value, filteredItems.value)
            }

            const handleSelect = (item: T, callback?: () => void): void => {
                emit('update:modelValue', item)
                callback?.()
            }

            const handleMouseOver = (item: UiSelectItemInterface<T, 'item'>): void => {
                (hovered as Ref<UiSelectItemInterface<T, 'item'>>).value = item
            }

            const handleMouseOut = (): void => {
                hovered.value = null
            }

            return () => (
                <VDropdown class="ui-select" placement="bottom-start">
                    {{
                        default: () => <div class="relative">{ slots.default?.() }</div>,
                        popper: ({ hide }: { hide: () => void }) => (
                            <div class="pf-v5-c-card pf-v5-m-display-lg pf-v5-u-min-width">
                                <div class="ui-select__content">
                                    <div class="ui-select__box">
                                        <div class="pf-v5-c-menu pf-v5-m-plain pf-v5-m-scrollable">
                                            {
                                                props.showSearch && (
                                                    <div class="pf-v5-c-menu__search">
                                                        <div class="pf-v5-c-menu__search-input">
                                                            <input
                                                                class="pf-v5-c-form-control pf-v5-m-search"
                                                                type="search"
                                                                name="search-input"
                                                                aria-label="Search"
                                                                value={search.value}
                                                                onInput={handleInput}
                                                            />
                                                        </div>
                                                    </div>
                                                )
                                            }
                                            {
                                                filteredItems.value.length > 0 && (
                                                    <div class="pf-v5-c-menu__content">
                                                        <ul class="pf-v5-c-menu__list">
                                                            {
                                                                filteredItems.value.map(item => {
                                                                    if (item.__type === 'item') {
                                                                        return <UiSelectItem
                                                                            key={item.id}
                                                                            label={item.label}
                                                                            selected={item.value === props.modelValue}
                                                                            onClick={() => handleSelect(item.value, hide)}
                                                                            onMouseOver={() => handleMouseOver(item)}
                                                                            onMouseOut={handleMouseOut}
                                                                        />
                                                                    } else {
                                                                        return <UiSelectGroup label={item.label}>
                                                                            {
                                                                                item.items.map(subItem => {
                                                                                    return <UiSelectItem
                                                                                        key={item.id}
                                                                                        label={subItem.label}
                                                                                        onClick={() => handleSelect(subItem.value, hide)}
                                                                                    />
                                                                                })
                                                                            }
                                                                        </UiSelectGroup>
                                                                    }
                                                                })
                                                            }
                                                        </ul>
                                                    </div>
                                                )
                                            }
                                        </div>
                                    </div>
                                    {
                                        slots.description && hovered.value && (
                                            <div class="ui-select__description">
                                                <div class="pf-v5-c-card__body pf-v5-u-pt-lg pf-v5-u-p-sm pf-v5-u-color-200">
                                                    <div class="pf-v5-l-flex">
                                                        <div class="select__description-icon pf-v5-l-flex__item">
                                                            <UiIcon icon="fas fa-info-circle"/>
                                                        </div>
                                                        <div class="select__description-text pf-v5-l-flex__item">
                                                            {slots.description?.({item: hovered})}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        )
                                    }
                                </div>
                            </div>
                        )
                    }}
                </VDropdown>
            )
        }
    })
}
