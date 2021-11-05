import {defineStore} from 'pinia'
import * as types from "../types";
import {EventRef, EventType, PropertyRef} from "../types";

type FilterValue = {
    type: types.DataType;
    value: number | string | boolean;
}

export interface EventFilter {
    propRef?: PropertyRef;
    opId?: types.OperationId;
    values?: FilterValue[]
}

export type Event = {
    ref: EventRef,
    filters: EventFilter[]
}

type EventSegmentation = {
    events: Event[]
}

export const eventSegmentationStore = defineStore('eventSegmentation', {
    state: (): EventSegmentation => ({events: []}),
    actions: {
        changeEvent(index: number, ref: EventRef): void {
            this.events[index] = <Event>{ref: ref, filters: []}
        },
        addEventByRef(ref: EventRef): void {
            switch (ref.type) {
                case EventType.Regular:
                    this.addEvent(ref.id);
                    break
                case EventType.Custom:
                    this.addCustomEvent(ref.id);
                    break
            }
        },
        addEvent(id: number): void {
            this.events.push(<Event>{ref: <EventRef>{type: types.EventType.Regular, id: id}, filters: []})
        },
        addCustomEvent(id: number): void {
            this.events.push(<Event>{ref: <EventRef>{type: types.EventType.Custom, id: id}, filters: []})
        },
        deleteEvent(idx: number): void {
            this.events.splice(idx, 1);
        },
        addFilter(idx: number): void {
            // duplicates check
            if (this.events[idx].filters.find((filter): boolean => filter.opId === undefined)) {
                return
            }
            this.events[idx].filters.push(<EventFilter>{});
        },
        removeFilter(idx: number): void {
            this.events[idx].filters.splice(idx, 1);
        },
        changeFilterProperty(eventIdx: number, filterIdx: number, propRef: PropertyRef): void {
            this.events[eventIdx].filters[filterIdx] = <EventFilter>{propRef: propRef, opId: types.OperationId.Eq};
        },
        changeFilterOperation(eventIdx: number, filterIdx: number, opId: types.OperationId): void {
            this.events[eventIdx].filters[filterIdx].opId = opId;
        },
    }
})