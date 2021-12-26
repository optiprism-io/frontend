<template>
    <div class="pf-l-flex pf-m-column">
        <SelectedEvent
            v-for="(event, index) in events"
            :key="index"
            :event-ref="event.ref"
            :filters="event.filters"
            :index="index"
            @change-event="changeEvent"
            @remove-event="removeEvent"
            @add-filter="addFilter"
            @remove-filter="removeFilter"
            @change-filter-property="changeFilterProperty"
            @change-filter-operation="changeFilterOperation"
            @add-filter-value="addFilterValue"
            @remove-filter-value="removeFilterValue"
        />
        <div class="pf-l-flex">
            <EventSelect @select="addEvent">
                <UiButton
                    class="pf-m-main"
                    :is-link="true"
                    :before-icon="'fas fa-plus-circle'"
                    @click="getEvents"
                >
                    Add Event
                </UiButton>
            </EventSelect>
        </div>
    </div>
</template>

<script setup lang="ts">
import { EventRef, OperationId, PropertyRef, Value } from "../../../types";
import { eventsStore as newEventsStore } from "../../../stores/eventSegmentation/events";
import { lexiconStore } from "../../../stores/lexicon";
import EventSelect from "./EventSelect.vue";
import SelectedEvent from "./SelectedEvent.vue";
import UiButton from "@/components/uikit/UiButton.vue";

const lexicon = lexiconStore();
const getEvents = () => {
    if (!lexicon.events.length) {
        lexicon.getEvents();
        lexicon.getEventProperties();
    }
};

const eventsStore = newEventsStore();
const events = eventsStore.events;

const addEvent = (ref: EventRef) => {
    eventsStore.addEventByRef(ref);
};

const changeEvent = (index: number, ref: EventRef) => {
    eventsStore.changeEvent(index, ref);
};

const removeEvent = (idx: number): void => {
    eventsStore.deleteEvent(idx);
};

const addFilter = (idx: number): void => {
    eventsStore.addFilter(idx);
};

const removeFilter = (eventIdx: number, filterIdx: number): void => {
    eventsStore.removeFilter(eventIdx, filterIdx);
};

const changeFilterProperty = (eventIdx: number, filterIdx: number, propRef: PropertyRef) => {
    eventsStore.changeFilterProperty(eventIdx, filterIdx, propRef);
};

const changeFilterOperation = (eventIdx: number, filterIdx: number, opId: OperationId) => {
    eventsStore.changeFilterOperation(eventIdx, filterIdx, opId);
};

const addFilterValue = (eventIdx: number, filterIdx: number, value: Value) => {
    eventsStore.addFilterValue(eventIdx, filterIdx, value);
};

const removeFilterValue = (eventIdx: number, filterIdx: number, value: Value) => {
    eventsStore.removeFilterValue(eventIdx, filterIdx, value);
};
</script>
