<template>
    <div class="filter pf-l-flex">
        <div class="pf-c-action-list">
            <div
                class="pf-c-action-list__item pf-u-ml-2xl"
                :class="{
                    'op-opacity-0': isNowSelectedFilterRef
                }"
            >
                with
            </div>
            <div class="pf-c-action-list__item">
                <PropertySelect
                    v-if="filter.propRef"
                    :event-ref="eventRef"
                    :selected="filter.propRef"
                    @select="changeProperty"
                >
                    <UiButton class="pf-m-main pf-m-secondary">
                        {{ propertyName(filter.propRef) }}
                    </UiButton>
                </PropertySelect>
                <PropertySelect
                    v-else
                    :is-open-mount="true"
                    :event-ref="eventRef"
                    @select="changeProperty"
                >
                    <UiButton
                        :before-icon="'fas fa-plus-circle'"
                        class="pf-m-main pf-m-primary"
                        type="button"
                        @click="handleSelectProperty"
                    >
                        Select property
                    </UiButton>
                </PropertySelect>
            </div>

            <div v-if="filter.propRef" class="pf-c-action-list__item">
                <OperationSelect
                    :property-ref="filter.propRef"
                    :selected="filter.opId"
                    @select="changeOperation"
                >
                    <UiButton class="pf-m-main pf-m-secondary">
                        {{ operationById?.get(filter.opId)?.name }}
                    </UiButton>
                </OperationSelect>
            </div>

            <div v-if="filter.propRef" class="pf-c-action-list__item">
                <ValueSelect
                    :property-ref="filter.propRef"
                    :selected="filter.values"
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
                                <UiButton class="pf-m-main pf-m-secondary">
                                    {{ value }}

                                    <span class="pf-c-button__icon pf-m-end">
                                        <UiIcon
                                            icon="fas fa-times"
                                            @click.stop="removeValueButton(value)"
                                        />
                                    </span>
                                </UiButton>
                            </div>
                        </div>
                    </template>
                    <template v-else>
                        <UiButton class="pf-m-main" :before-icon="'fas fa-plus-circle'">
                            Select value
                        </UiButton>
                    </template>
                </ValueSelect>
            </div>

            <div class="pf-c-action-list__item filter__control-item">
                <UiButton class="pf-m-plain" icon="fas fa-times" @click="removeFilter"></UiButton>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { EventFilter } from "@/stores/eventSegmentation/events";
import { useLexiconStore } from "@/stores/lexicon";
import PropertySelect from "./PropertySelect.vue";
import OperationSelect from "./OperationSelect.vue";
import ValueSelect from "./ValueSelect.vue";
import {
    EventRef,
    EventType,
    PropertyRef,
    PropertyType,
    operationById,
    OperationId,
    Value
} from "../../../types";
import { computed, ref } from "vue";
import UiIcon from "@/components/uikit/UiIcon.vue";
import UiButton from "@/components/uikit/UiButton.vue";

const props = defineProps<{
    eventRef: EventRef;
    filter: EventFilter;
    index: number;
}>();

const isNowSelectedFilterRef = computed(() => !props?.filter?.propRef);

const emit = defineEmits<{
    (e: "removeFilter", index: number): void;
    (e: "changeFilterProperty", filterIdx: number, propRef: PropertyRef): void;
    (e: "changeFilterOperation", filterIdx: number, opId: OperationId): void;
    (e: "addFilterValue", filterIdx: number, value: Value): void;
    (e: "removeFilterValue", filterIdx: number, value: Value): void;
    (e: "handleSelectProperty"): void;
}>();
const lexiconStore = useLexiconStore();

const removeFilter = (): void => {
    emit("removeFilter", props.index);
};

const changeProperty = (propRef: PropertyRef): void => {
    emit("changeFilterProperty", props.index, propRef);
};

const handleSelectProperty = (): void => {
    emit("handleSelectProperty");
};

const changeOperation = (opId: OperationId): void => {
    emit("changeFilterOperation", props.index, opId);
};

const addValue = (value: Value): void => {
    emit("addFilterValue", props.index, value);
};

const removeValue = (value: Value) => {
    emit("removeFilterValue", props.index, value);
};

const removeValueButton = (value: Value) => {
    emit("removeFilterValue", props.index, value);
};

const propertyName = (ref: PropertyRef): string => {
    switch (ref.type) {
        case PropertyType.Event:
            return lexiconStore.findEventPropertyById(ref.id).name;
        case PropertyType.EventCustom:
            return lexiconStore.findEventCustomPropertyById(ref.id).name;
        case PropertyType.User:
            return lexiconStore.findUserPropertyById(ref.id).name;
        case PropertyType.UserCustom:
            return lexiconStore.findUserCustomPropertyById(ref.id).name;
    }
    throw new Error("unhandled");
};
</script>

<style scoped lang="scss">
.filter {
    &:hover {
        .filter__control-item {
            opacity: 1;
        }
    }

    &__control-item {
        opacity: 0;
    }
}
</style>
