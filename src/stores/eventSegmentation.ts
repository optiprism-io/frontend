import {defineStore} from 'pinia'
import * as types from "../types";
import {EventRef} from "../types";

enum Op {
    Eq,
    Neq,
    Gt,
    Gte,
    Lt,
    Lte,
    Null,
    NotNull,
    Any,
    All,
    Regex
}

type ConditionValue = {
    type: types.DataType;
    value: number | string | boolean;
}

type EventCondition = {
    propertyType: types.PropertyType;
    propertyId: number;
    op: Op;
    values?: ConditionValue[]
}

export type Event = {
    ref: EventRef,
    where: EventCondition[]
}

type EventSegmentation = {
    events: Event[]
}

export const eventSegmentationStore = defineStore('eventSegmentation', {
    state: (): EventSegmentation => ({events: []}),
    actions: {
        addEvent(id: number): void {
            this.events.push(<Event>{ref: <EventRef>{id: id, type: types.EventType.Regular}, where: []})
        },
        addCustomEvent(id: number): void {
            this.events.push(<Event>{ref: <EventRef>{id: id, type: types.EventType.Custom}, where: []})
        },
        deleteEvent(idx: number): void {
            this.events.splice(idx, 1);
        }
    }
})