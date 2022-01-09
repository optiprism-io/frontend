import { defineStore } from "pinia";
import * as types from "../../types";
import {
    EventRef,
    EventType,
    OperationId,
    PropertyRef,
    Value,
    PropertyType,
    Group,
    EventQueryRef,
} from "@/types";
import schemaService from "@/api/services/schema.service";
import { useLexiconStore } from "@/stores/lexicon";

export interface EventFilter {
    propRef?: PropertyRef;
    opId: OperationId;
    values: Value[];
    valuesList: string[];
}

export interface EventBreakdown {
    propRef?: PropertyRef;
}

export interface EventQuery {
    queryRef?: EventQueryRef;
    noDelete?: boolean;
}

export type Event = {
    ref: EventRef;
    filters: EventFilter[];
    breakdowns: EventBreakdown[];
    queries: EventQuery[];
};

export type Events = {
    events: Event[];
    group: Group;
};

const initialQuery = <EventQuery[]>[
    {
        queryRef: <EventQueryRef>{
            type: types.QueryType.simple,
            name: "countEvents"
        },
        noDelete: true,
    }
]

export const useEventsStore = defineStore("events", {
    state: (): Events => ({
        events: [],
        group: Group.User,
    }),
    actions: {
        changeEvent(index: number, ref: EventRef): void {
            this.events[index] = <Event>{
                ref: ref,
                filters: [],
                breakdowns: [],
                queries: initialQuery,
            };
        },
        addEventByRef(ref: EventRef): void {
            switch (ref.type) {
                case EventType.Regular:
                    this.addEvent(ref.id);
                    break;
                case EventType.Custom:
                    this.addCustomEvent(ref.id);
                    break;
            }
        },
        addEvent(id: number): void {
            this.events.push(<Event>{
                ref: <EventRef>{ type: types.EventType.Regular, id: id },
                filters: [],
                breakdowns: [],
                queries: initialQuery,
            });
        },
        addCustomEvent(id: number): void {
            this.events.push(<Event>{
                ref: <EventRef>{ type: types.EventType.Custom, id: id },
                filters: [],
                breakdowns: [],
                queries: initialQuery,
            });
        },
        deleteEvent(idx: number): void {
            this.events.splice(idx, 1);
        },
        addFilter(idx: number): void {
            const emptyFilter = this.events[idx].filters.find((filter): boolean => filter.propRef === undefined);

            if (emptyFilter) {
                return;
            }
            this.events[idx].filters.push(<EventFilter>{
                opId: OperationId.Eq,
                values: [],
                valuesList: []
            });
        },
        removeFilter(eventIdx: number, filterIdx: number): void {
            this.events[eventIdx].filters.splice(filterIdx, 1);
        },
        async changeFilterProperty(eventIdx: number, filterIdx: number, propRef: PropertyRef) {
            const lexiconStore = useLexiconStore();
            const eventRef: EventRef = this.events[eventIdx].ref;
            let valuesList: string[] = [];

            try {
                const res = await schemaService.propertiesValues({
                    event_name: lexiconStore.eventName(eventRef),
                    event_type: EventType[eventRef.type],
                    property_name: lexiconStore.propertyName(propRef),
                    property_type: PropertyType[propRef.type]
                });
                if (res) {
                    valuesList = res;
                }
            } catch (error) {
                throw new Error("error getEventsValues");
            }

            this.events[eventIdx].filters[filterIdx] = <EventFilter>{
                propRef: propRef,
                opId: types.OperationId.Eq,
                values: [],
                valuesList: valuesList
            };
        },
        changeFilterOperation(eventIdx: number, filterIdx: number, opId: types.OperationId): void {
            this.events[eventIdx].filters[filterIdx].opId = opId;
            this.events[eventIdx].filters[filterIdx].values = [];
        },
        addFilterValue(eventIdx: number, filterIdx: number, value: Value): void {
            this.events[eventIdx].filters[filterIdx].values.push(value);
        },
        removeFilterValue(eventIdx: number, filterIdx: number, value: Value): void {
            this.events[eventIdx].filters[filterIdx].values =
                this.events[eventIdx].filters[filterIdx].values.filter(v =>  v !== value);
        },

        /**
         * Breakdown
         *
         * You cannot create two identical groupings.
         * The grouping can be removed by hovering and clicking on the cross.
         *
         * @func removeBreakdown
         * @func addBreakdown
         * @func changeBreakdownProperty
         */
        removeBreakdown(eventIdx: number, breakdownIdx: number): void {
            this.events[eventIdx].breakdowns.splice(breakdownIdx, 1);
        },
        addBreakdown(idx: number): void {
            const emptyBreakdown = this.events[idx].breakdowns.findIndex((breakdown): boolean => breakdown.propRef === undefined);

            if (emptyBreakdown !== -1) {
                this.removeBreakdown(idx, emptyBreakdown);
            }

            this.events[idx].breakdowns.push(<EventFilter>{
                propRef: undefined,
            });
        },
        changeBreakdownProperty(eventIdx: number, breakdownIdx: number, propRef: PropertyRef) {
            this.events[eventIdx].breakdowns[breakdownIdx] = <EventFilter>{
                propRef: propRef,
            };
        },

        /**
         * Query
         *
         * @func removeQuery
         * @func addQuery
         * @func changeQuery
         */
        removeQuery(eventIdx: number, queryIdx: number): void {
            this.events[eventIdx].queries.splice(queryIdx, 1);
        },
        addQuery(idx: number): void {
            const emptyQueryIndex = this.events[idx].queries.findIndex((query): boolean => query.queryRef === undefined);

            if (emptyQueryIndex !== -1) {
                this.removeQuery(idx, emptyQueryIndex);
            }

            this.events[idx].queries.push(<EventQuery>{
                queryRef: undefined,
            });
        },
        changeQuery(eventIdx: number, queryIdx: number, queryRef: EventQueryRef) {
            const queries = [...this.events[eventIdx].queries];

            queries[queryIdx] = <EventQuery>{
                queryRef: queryRef,
                noDelete: queryIdx === 0,
            };

            this.events[eventIdx].queries = queries;
        },
    },
});