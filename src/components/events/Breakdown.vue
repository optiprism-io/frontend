<template>
    <div class="breakdown pf-l-flex">
        <UiIcon v-if="hasIcon" icon="fas fa-layer-group" />
        <div class="pf-c-action-list">
            <CommonIdentifier
                v-if="showIdentifier"
                :index="index"
            />
            <div class="pf-c-action-list__item">
                <PropertySelect
                    v-if="breakdown.propRef"
                    :event-ref="eventRef"
                    :selected="breakdown.propRef"
                    :disabled-items="selectedItems"
                    @select="changeProperty"
                >
                    <UiButton class="pf-m-secondary">
                        {{ propertyName(breakdown.propRef) }}
                    </UiButton>
                </PropertySelect>
                <PropertySelect
                    v-else
                    :is-open-mount="true"
                    :event-ref="eventRef"
                    :update-open="updateOpen"
                    :disabled-items="selectedItems"
                    @select="changeProperty"
                >
                    <UiButton
                        :before-icon="'fas fa-plus-circle'"
                        class="pf-m-primary"
                        type="button"
                        @click="handleSelectProperty"
                    >
                        Select Breakdown
                    </UiButton>
                </PropertySelect>
            </div>
            <div
                v-if="breakdown.error"
                class="pf-c-action-list__item"
            >
                <VTooltip popper-class="ui-hint">
                    <UiIcon
                        class="pf-u-warning-color-100"
                        icon="fas fa-exclamation-triangle"
                    />
                    <template #popper>
                        {{ $t('events.errorBreakdown') }}
                    </template>
                </VTooltip>
            </div>
            <div class="pf-c-action-list__item breakdown__control-item">
                <UiButton
                    class="pf-m-plain"
                    icon="fas fa-times"
                    @click="removeBreakdown"
                />
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { EventBreakdown } from '@/stores/eventSegmentation/events';
import { useLexiconStore } from '@/stores/lexicon';
import PropertySelect from '@/components/events/PropertySelect.vue';
import { EventRef, PropertyRef } from '@/types/events';
import UiButton from '@/components/uikit/UiButton.vue';
import CommonIdentifier from '@/components/common/identifier/CommonIdentifier.vue';
import { PropertyType } from '@/api'

interface IProps {
  eventRef?: EventRef;
  eventRefs?: EventRef[];
  breakdown: EventBreakdown;
  index: number;
  updateOpen?: boolean;
  selectedItems?: EventBreakdown[];
  showIdentifier?: boolean;
  hasIcon?: boolean;
}

const props = withDefaults(defineProps<IProps>(), {
  hasIcon: true
});

const emit = defineEmits<{
    (e: 'removeBreakdown', index: number): void;
    (e: 'changeBreakdownProperty', breakdownIdx: number, propRef: PropertyRef): void;
    (e: 'handleSelectProperty'): void;
}>();

const lexiconStore = useLexiconStore();

const removeBreakdown = (): void => {
    emit('removeBreakdown', props.index);
};

const changeProperty = (propRef: PropertyRef): void => {
    emit('changeBreakdownProperty', props.index, propRef);
};

const handleSelectProperty = (): void => {
    emit('handleSelectProperty');
};

const propertyName = (ref: PropertyRef): string => {
    switch (ref.type) {
        case PropertyType.Event:
            return lexiconStore.findEventPropertyById(ref.id)?.name || '';
        case PropertyType.Custom:
            return lexiconStore.findEventCustomPropertyById(ref.id)?.name || '';
        case PropertyType.User:
            return lexiconStore.findUserPropertyById(ref.id)?.name || '';
        case PropertyType.System:
            return lexiconStore.findSystemPropertyById(ref.id)?.displayName || lexiconStore.findSystemPropertyById(ref.id)?.name || '';
        default:
            return ''
    }
};
</script>

<style scoped lang="scss">
.breakdown {
    &:hover {
        .breakdown__control-item {
            opacity: 1;
        }
    }

    &__control-item {
        opacity: 0;
    }
}
</style>
