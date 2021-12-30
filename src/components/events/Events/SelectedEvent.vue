<template>
    <div class="selected-event pf-l-flex pf-m-column">
        <div class="pf-l-flex">
            <div class="pf-l-flex__item selected-event__identifier">
                {{ identifier }}
            </div>
            <div class="pf-c-action-list">
                <div class="pf-c-action-list__item">
                    <Select grouped :items="eventItems" :selected="eventRef" @select="changeEvent">
                        <UiButton class="pf-m-main pf-m-secondary">
                            {{ eventName(eventRef) }}
                        </UiButton>
                    </Select>
                </div>
                <div class="pf-c-action-list__item selected-event__control">
                    <UiButton class="pf-m-plain" icon="fas fa-filter" @click="addFilter"></UiButton>
                </div>
                <div class="pf-c-action-list__item selected-event__control">
                    <UiButton
                        class="pf-m-plain"
                        icon="fas fa-times"
                        @click="removeEvent"
                    ></UiButton>
                </div>
            </div>
        </div>
        <Filter
            v-for="(filter, i) in filters"
            :key="i"
            :event-ref="eventRef"
            :filter="filter"
            :index="i"
            @remove-filter="removeFilter"
            @change-filter-property="changeFilterProperty"
            @change-filter-operation="changeFilterOperation"
            @add-filter-value="addFilterValue"
            @remove-filter-value="removeFilterValue"
            @handle-select-property="handleSelectProperty"
        />
    </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { EventRef, EventType, OperationId, PropertyRef, Value } from "@/types";
import { useLexiconStore } from "@/stores/lexicon";
import { EventFilter } from "@/stores/eventSegmentation/events";
import Select from "@/components/Select/Select.vue";
import Filter from "./Filter.vue";
import UiButton from "@/components/uikit/UiButton.vue";
import { Group } from "@/components/Select/SelectTypes";

const props = withDefaults(
    defineProps<{
        eventRef: EventRef;
        filters: EventFilter[];
        eventItems: Group[];
        index: number;
    }>(),
    {
        eventItems: () => []
    }
);

const emit = defineEmits<{
    (e: "changeEvent", index: number, ref: EventRef): void;
    (e: "removeEvent", index: number): void;
    (e: "addFilter", index: number): void;
    (e: "removeFilter", eventIdx: number, filterIdx: number): void;
    (e: "changeFilterProperty", eventIdx: number, filterIdx: number, propRef: PropertyRef): void;
    (e: "changeFilterOperation", eventIdx: number, filterIdx: number, opId: OperationId): void;
    (e: "addFilterValue", eventIdx: number, filterIdx: number, value: Value): void;
    (e: "removeFilterValue", eventIdx: number, filterIdx: number, value: Value): void;
    (e: "handleSelectProperty"): void;
}>();

const lexiconStore = useLexiconStore();

const handleSelectProperty = (): void => {
    emit("handleSelectProperty");
};

const changeEvent = (ref: EventRef): void => {
    emit("changeEvent", props.index, ref);
};

const removeEvent = (): void => {
    emit("removeEvent", props.index);
};

const removeFilter = (filterIdx: number): void => {
    emit("removeFilter", props.index, filterIdx);
};

const addFilter = (): void => {
    emit("addFilter", props.index);
};

const changeFilterProperty = (filterIdx: number, propRef: PropertyRef): void => {
    emit("changeFilterProperty", props.index, filterIdx, propRef);
};

const changeFilterOperation = (filterIdx: number, opId: OperationId): void => {
    emit("changeFilterOperation", props.index, filterIdx, opId);
};

const addFilterValue = (filterIdx: number, value: Value): void => {
    emit("addFilterValue", props.index, filterIdx, value);
};

const removeFilterValue = (filterIdx: number, value: Value): void => {
    emit("removeFilterValue", props.index, filterIdx, value);
};

const eventName = (ref: EventRef): string => {
    switch (ref.type) {
        case EventType.Regular:
            return lexiconStore.findEventById(ref.id).name;
        case EventType.Custom:
            return lexiconStore.findCustomEventById(ref.id).name;
    }
    throw new Error("unhandled");
};

const alphabet = "abcdefghijklmnopqrstuvwxyz".split("");
const identifier = computed((): string => alphabet[props.index]);
</script>

<style scoped lang="scss">
.selected-event {
    &__identifier {
        width: 20px;
        text-transform: uppercase;
        text-align: center;
        color: var(--pf-global--main-color--100);
    }

    &__control {
        opacity: 0;
    }

    &:hover {
        .selected-event {
            &__control {
                opacity: 1;
            }
        }
    }
}
</style>
