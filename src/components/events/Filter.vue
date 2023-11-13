<template>
    <div
        class="filter pf-l-flex"
        :class="orientationClass"
    >
        <div
            class="filter__items pf-c-action-list"
            :class="{
                'filter__items_hover': isAnyButtonHovered
            }"
        >
            <CommonIdentifier
                v-if="showIdentifier"
                :index="index"
            />
            <div
                v-else-if="!hidePrefix"
                :class="{
                    'min-w-50': minWidthPrefix,
                }"
                class="pf-c-action-list__item pf-u-mb-0 pf-u-mt-xs pf-u-text-align-right"
            >
                <slot
                    name="prefix"
                >
                    {{ $t('filters.with') }}
                </slot>
            </div>
            <div class="pf-c-action-list__item">
                <PropertySelect
                    v-if="filter.propRef"
                    :event-ref="eventRef"
                    :event-refs="eventRefs"
                    :selected="filter.propRef"
                    :popper-container="props.popperContainer"
                    @select="changeProperty"
                >
                    <UiButton
                        :class="{
                            'pf-m-control pf-m-small': props.forPreview,
                            'pf-m-secondary': !props.forPreview,
                        }"
                        :disabled="props.forPreview"
                    >
                        {{ propertyButtonText }}
                    </UiButton>
                </PropertySelect>
                <PropertySelect
                    v-else
                    :is-open-mount="filter.propRef ? false : true"
                    :event-ref="eventRef"
                    :update-open="updateOpen"
                    :popper-container="props.popperContainer"
                    @select="changeProperty"
                >
                    <UiButton
                        :before-icon="'fas fa-plus-circle'"
                        class="pf-m-primary"
                        type="button"
                        @click="handleSelectProperty"
                    >
                        {{ $t('events.selectProperty') }}
                    </UiButton>
                </PropertySelect>
            </div>
            <div
                v-if="isShowOperation && filter.propRef"
                class="pf-c-action-list__item"
            >
                <OperationSelect
                    :property-ref="filter.propRef"
                    :selected="filter.opId"
                    :popper-container="props.popperContainer"
                    @select="changeOperation"
                >
                    <UiButton
                        :class="[props.forPreview ? 'pf-m-control pf-m-small' : 'pf-m-secondary']"
                        :disabled="props.forPreview"
                    >
                        {{ operationButtonText }}
                    </UiButton>
                </OperationSelect>
            </div>
            <div
                v-if="isShowValues && filter.propRef"
                class="pf-c-action-list__item"
            >
                <ValueSelect
                    :property-ref="filter.propRef"
                    :selected="filter.values"
                    :items="filterItemValues"
                    :popper-container="props.popperContainer"
                    @add="addValue"
                    @deselect="removeValue"
                >
                    <template v-if="filter.values.length > 0">
                        <div class="pf-c-action-list">
                            <div
                                v-for="(value, i) in filter.values"
                                :key="i"
                                class="pf-c-action-list__item"
                            >
                                <UiButton
                                    :class="[props.forPreview ? 'pf-m-control pf-m-small' : 'pf-m-secondary']"
                                    :disabled="props.forPreview"
                                >
                                    {{ value }}
                                    <span
                                        v-if="!props.forPreview"
                                        class="pf-c-button__icon pf-m-end"
                                    >
                                        <UiIcon
                                            icon="fas fa-times"
                                            @click.stop="removeValueButton(value)"
                                        />
                                    </span>
                                </UiButton>
                            </div>
                            <div
                                class="pf-c-action-list__item filter__control-item"
                            >
                                <UiButton
                                    ref="elButtonValues"
                                    class="pf-m-plain"
                                    icon="fas fa-times"
                                    @click="removeFilter"
                                />
                            </div>
                        </div>
                    </template>
                    <template v-else>
                        <UiButton
                            :before-icon="'fas fa-plus-circle'"
                            class="pf-m-link"
                        >
                            {{ $t('events.select_value') }}
                        </UiButton>
                    </template>
                </ValueSelect>
            </div>

            <div
                v-if="filter.error || (filter?.propRef && !filterProperty)"
                class="pf-c-action-list__item pf-u-mt-xs"
            >
                <VTooltip popper-class="ui-hint">
                    <UiIcon
                        class="pf-u-warning-color-100"
                        icon="fas fa-exclamation-triangle"
                    />
                    <template #popper>
                        {{ $t('filters.noPropertiesError') }}
                    </template>
                </VTooltip>
            </div>
            <div
                v-if="filter.values.length === 0"
                class="pf-c-action-list__item filter__control-item"
            >
                <UiButton
                    ref="elButtonMain"
                    class="pf-m-plain"
                    icon="fas fa-times"
                    @click="removeFilter"
                />
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed } from 'vue';
import { useElementHover } from '@vueuse/core';
import { EventFilter } from '@/stores/eventSegmentation/events';
import { useLexiconStore } from '@/stores/lexicon';
import PropertySelect from '@/components/events/PropertySelect.vue';
import OperationSelect from '@/components/events/OperationSelect.vue';
import ValueSelect from '@/components/events/ValueSelect.vue';
import { EventRef, PropertyRef } from '@/types/events';
import { operationById, OperationId, Value } from '@/types';
import CommonIdentifier from '@/components/common/identifier/CommonIdentifier.vue';
import { PropertyType } from '@/api';
import { OrientationTypeEnum, OrientationEnum } from '@/types/filters';

type Props = {
    eventRef?: EventRef;
    eventRefs?: EventRef[];
    filter: EventFilter;
    index: number;
    updateOpen?: boolean;
    showIdentifier?: boolean;
    popperContainer?: string;
    forPreview?: boolean;
    hidePrefix?: boolean;
    orientation?: OrientationEnum;
    minWidthPrefix?: boolean;
}

const lexiconStore = useLexiconStore();

const props = withDefaults(defineProps<Props>(), {
    orientation: OrientationTypeEnum.VERTICAL,
    minWidthPrefix: true,
});

const elButtonMain = ref(null);
const elButtonValues = ref(null);
const isHoveredButtonMain = useElementHover(elButtonMain);
const isHoveredButtonValues = useElementHover(elButtonValues);

const isAnyButtonHovered = computed(() => {
    return isHoveredButtonMain.value || isHoveredButtonValues.value;
});

const emit = defineEmits<{
    (e: 'changeFilterProperty', filterIdx: number, propRef: PropertyRef): void;
    (e: 'removeFilter', index: number): void;
    (e: 'changeFilterOperation', filterIdx: number, opId: OperationId): void;
    (e: 'addFilterValue', filterIdx: number, value: Value): void;
    (e: 'removeFilterValue', filterIdx: number, value: Value): void;
    (e: 'handleSelectProperty'): void;
}>();

const orientationClass = computed(() => `filter_${props.orientation}`);

const operationButtonText = computed(() => {
    return props.filter.opId ? operationById?.get(props.filter.opId)?.shortName || operationById?.get(props.filter.opId)?.name : '';
});

const propertyButtonText = computed(() => {
    return props.filter?.propRef?.name || filterProperty.value?.name || props.filter?.propRef?.id;
});

const filterItemValues = computed(() =>
    props.filter.valuesList.map((item: any) => {
        return { item, name: item };
    })
);

const isShowOperation = computed(() => {
    return !(props.forPreview && !props.filter.values.length)
})

const isShowValues = computed(() => {
    return !['exists', 'empty'].includes(props.filter.opId) && isShowOperation.value
});

const filterPropRefType = computed((): PropertyType | null => {
    return props?.filter?.propRef?.type || null;
});

const filterPropRefId = computed((): number | null => {
    return props?.filter?.propRef?.id || null;
});

const filterProperty = computed(() => {
    if (filterPropRefType.value && filterPropRefId.value) {
        switch (filterPropRefType.value) {
            case PropertyType.Event:
                return lexiconStore.findEventPropertyById(filterPropRefId.value);
            case PropertyType.Custom:
                return lexiconStore.findEventCustomPropertyById(filterPropRefId.value);
            case PropertyType.User:
                return lexiconStore.findUserPropertyById(filterPropRefId.value);
        }
    }
    return undefined;
});

const removeFilter = (): void => {
    emit('removeFilter', props.index);
};

const changeProperty = (propRef: PropertyRef): void => {
    emit('changeFilterProperty', props.index, propRef);
};

const handleSelectProperty = (): void => {
    emit('handleSelectProperty');
};

const changeOperation = (opId: OperationId): void => {
    emit('changeFilterOperation', props.index, opId);
};

const addValue = (value: Value): void => {
    emit('addFilterValue', props.index, value);
};

const removeValue = (value: Value) => {
    emit('removeFilterValue', props.index, value);
};

const removeValueButton = (value: Value) => {
    emit('removeFilterValue', props.index, value);
};

</script>

<style lang="scss">
.filter {
    &:hover {
        .filter__control-item {
            opacity: 1;
        }
    }
    &__control-item {
        opacity: 0;
    }
    &__items {
        &_hover {
            .pf-c-button {
                --pf-c-button--after--BorderWidth: var(--pf-c-button--hover--after--BorderWidth);
                text-decoration: none;
                &.pf-m-secondary {
                    --pf-c-button--m-secondary--Color: var(--pf-c-button--m-secondary--hover--Color);
                    --pf-c-button--m-secondary--BackgroundColor: #fff;
                    --pf-c-button--after--BorderColor: var(--pf-c-button--m-secondary--hover--after--BorderColor);
                }
            }

        }
    }
    &_horizontal {
        .pf-c-action-list {
            &__item {
                margin-bottom: 0;
            }
        }
        > .pf-c-action-list {
            padding-right: 0;
        }
    }
    &_vertical {
        margin-bottom: 0;
        .pf-c-action-list {
            &__item {
                margin-bottom: 11px;
            }
        }
        > .pf-c-action-list {
            padding-right: 30px;
        }
    }
    > .pf-c-action-list {
        position: relative;
    }
    .pf-c-action-list {
        position: relative;
        flex-wrap: wrap;
        align-items: flex-start;
        .multi-select__action {
            .pf-c-action-list {
                margin-bottom: -11px;
            }
        }
    }
}
</style>
