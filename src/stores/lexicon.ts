import { defineStore } from "pinia";
import schemaService from "../api/services/schema.service";
import {
    CustomEvent,
    EventProperty,
    UserCustomProperty,
    DataType,
    Event,
    EventCustomProperty,
    EventStatus,
    UserProperty,
    EventType,
    EventRef,
    Cohort
} from "../types";

type Lexicon = {
    cohorts: Cohort[];

    events: Event[];
    customEvents: CustomEvent[];
    eventsLoading: boolean;

    eventProperties: EventProperty[];
    eventCustomProperties: EventCustomProperty[];
    userProperties: UserProperty[];
    userCustomProperties: UserCustomProperty[];
};

export const lexiconStore = defineStore("lexicon", {
    state: (): Lexicon => ({
        cohorts: [
            {
                id: 1,
                name: "Active users"
            },
            {
                id: 2,
                name: "iOS users"
            },
            {
                id: 3,
                name: "Profitable users"
            }
        ],
        eventProperties: [
            {
                id: 1,
                eventId: 2,
                createdAt: new Date(),
                createdBy: 0,
                updatedBy: 0,
                tags: [],
                name: "Query",
                type: DataType.String,
                nullable: false,
                is_array: false,
                is_dictionary: false
            },
            {
                id: 2,
                eventId: 3,
                createdAt: new Date(),
                createdBy: 0,
                updatedBy: 0,
                tags: [],
                name: "Product name",
                type: DataType.String,
                nullable: false,
                is_array: false,
                is_dictionary: true,
                dictionary_type: DataType.UInt16
            },
            {
                id: 3,
                eventId: 3,
                createdAt: new Date(),
                createdBy: 0,
                updatedBy: 0,
                tags: [],
                name: "Product Category",
                type: DataType.String,
                nullable: false,
                is_array: false,
                is_dictionary: true,
                dictionary_type: DataType.UInt16
            },
            {
                id: 4,
                eventId: 3,
                createdAt: new Date(),
                createdBy: 0,
                updatedBy: 0,
                tags: [],
                name: "Product Price",
                type: DataType.Float64,
                is_array: false,
                nullable: false,
                is_dictionary: false
            },
            {
                id: 5,
                eventId: 4,
                createdAt: new Date(),
                createdBy: 0,
                updatedBy: 0,
                tags: [],
                name: "Product name",
                type: DataType.String,
                is_array: false,
                nullable: false,
                is_dictionary: true,
                dictionary_type: DataType.UInt64
            },
            {
                id: 6,
                eventId: 4,
                createdAt: new Date(),
                createdBy: 0,
                updatedBy: 0,
                tags: [],
                name: "Product Category",
                type: DataType.String,
                is_array: false,
                nullable: false,
                is_dictionary: true,
                dictionary_type: DataType.UInt16
            },
            {
                id: 7,
                eventId: 4,
                createdAt: new Date(),
                createdBy: 0,
                updatedBy: 0,
                tags: [],
                name: "Product Price",
                type: DataType.Float64,
                is_array: false,
                nullable: false,
                is_dictionary: false
            },
            {
                id: 8,
                eventId: 5,
                createdAt: new Date(),
                createdBy: 0,
                updatedBy: 0,
                tags: [],
                name: "Product name",
                type: DataType.String,
                is_array: false,
                nullable: false,
                is_dictionary: true,
                dictionary_type: DataType.UInt64
            },
            {
                id: 9,
                eventId: 5,
                createdAt: new Date(),
                createdBy: 0,
                updatedBy: 0,
                tags: [],
                name: "Product Category",
                type: DataType.String,
                is_array: false,
                nullable: false,
                is_dictionary: true,
                dictionary_type: DataType.UInt16
            },
            {
                id: 10,
                eventId: 5,
                createdAt: new Date(),
                createdBy: 0,
                updatedBy: 0,
                tags: [],
                name: "Product Price",
                type: DataType.Float64,
                is_array: false,
                nullable: false,
                is_dictionary: false
            },
            {
                id: 11,
                eventId: 5,
                createdAt: new Date(),
                createdBy: 0,
                updatedBy: 0,
                tags: [],
                name: "Discount",
                type: DataType.Float64,
                is_array: false,
                nullable: false,
                is_dictionary: false
            },
            {
                id: 12,
                eventId: 5,
                createdAt: new Date(),
                createdBy: 0,
                updatedBy: 0,
                tags: [],
                name: "Revenue",
                type: DataType.Float64,
                is_array: false,
                nullable: false,
                is_dictionary: false
            }
        ],
        eventCustomProperties: [
            {
                id: 1,
                eventId: 1,
                createdAt: new Date(),
                createdBy: 0,
                updatedBy: 0,
                tags: [],
                name: "custom prop 1",
                type: DataType.String,
                is_array: false,
                nullable: false,
                is_dictionary: false
            }
        ],
        eventsLoading: false,
        events: [],
        customEvents: [],
        userProperties: [
            {
                id: 1,
                schema_id: 0,
                createdAt: new Date(),
                createdBy: 0,
                updatedBy: 0,
                tags: [],
                name: "Name",
                type: DataType.String,
                is_array: false,
                nullable: false,
                is_dictionary: true,
                dictionary_type: DataType.UInt64
            },
            {
                id: 2,
                schema_id: 0,
                createdAt: new Date(),
                createdBy: 0,
                updatedBy: 0,
                tags: [],
                name: "Age",
                type: DataType.UInt8,
                is_array: false,
                nullable: false,
                is_dictionary: false
            },
            {
                id: 3,
                schema_id: 0,
                createdAt: new Date(),
                createdBy: 0,
                updatedBy: 0,
                tags: [],
                name: "Country",
                type: DataType.String,
                is_array: false,
                nullable: false,
                is_dictionary: true,
                dictionary_type: DataType.UInt8
            },
            {
                id: 4,
                schema_id: 0,
                createdAt: new Date(),
                createdBy: 0,
                updatedBy: 0,
                tags: [],
                name: "Device",
                type: DataType.String,
                is_array: false,
                nullable: false,
                is_dictionary: true,
                dictionary_type: DataType.UInt32
            }
        ],
        userCustomProperties: [
            {
                id: 1,
                schemaId: 0,
                createdAt: new Date(),
                createdBy: 0,
                updatedBy: 0,
                tags: [],
                name: "custom user prop",
                type: DataType.String,
                isArray: false,
                nullable: false,
                isDictionary: true,
                dictionaryType: DataType.UInt64
            }
        ]
    }),
    actions: {
        async getEvents() {
            this.eventsLoading = true;
            try {
                this.events = await schemaService.events();
                this.customEvents = await schemaService.customEvents();
            } catch (error) {
                console.log(error);
            }
            this.eventsLoading = false;
        }
    },
    getters: {
        eventName(state: Lexicon) {
            return (type: EventType, id: number): string => {
                switch (type) {
                    case EventType.Regular:
                        return lexiconStore().findEventById(id).name;
                    case EventType.Custom:
                        return lexiconStore().findCustomEventById(id).name;
                }
            };
        },
        findEventById(state: Lexicon) {
            return (id: number): Event => {
                const e = state.events.find((event): boolean => event.id === id);
                if (e) {
                    return e;
                }
                throw new Error(`undefined event id: {$id}`);
            };
        },
        findCustomEventById(state: Lexicon) {
            return (id: number): CustomEvent => {
                const e = state.customEvents.find((event): boolean => event.id === id);
                if (e) {
                    return e;
                }
                throw new Error(`undefined custom event id: {$id}`);
            };
        },
        findEventProperties(state: Lexicon) {
            return (eventId: number): EventProperty[] => {
                return state.eventProperties.filter((prop): boolean => prop.eventId === eventId);
            };
        },
        findEventCustomProperties(state: Lexicon) {
            return (eventId: number): EventCustomProperty[] => {
                return state.eventCustomProperties.filter(
                    (prop): boolean => prop.eventId === eventId
                );
            };
        },
        findEventPropertyById(state: Lexicon) {
            return (id: number): EventProperty => {
                const e = state.eventProperties.find((prop): boolean => prop.id === id);
                if (e) {
                    return e;
                }
                throw new Error(`undefined property id: {$id}`);
            };
        },
        findEventCustomPropertyById(state: Lexicon) {
            return (id: number): EventCustomProperty => {
                const e = state.eventCustomProperties.find((prop): boolean => prop.id === id);
                if (e) {
                    return e;
                }
                throw new Error(`undefined custom property id: {$id}`);
            };
        },
        findUserPropertyById(state: Lexicon) {
            return (id: number): UserProperty => {
                const e = state.userProperties.find((prop): boolean => prop.id === id);
                if (e) {
                    return e;
                }
                throw new Error(`undefined user property id: {$id}`);
            };
        },
        findUserCustomPropertyById(state: Lexicon) {
            return (id: number): UserCustomProperty => {
                const e = state.userCustomProperties.find((prop): boolean => prop.id === id);
                if (e) {
                    return e;
                }
                throw new Error(`undefined user custom property id: {$id}`);
            };
        },
        findCohortById(state: Lexicon) {
            return (id: number): Cohort => {
                const e = state.cohorts.find((cohort): boolean => cohort.id === id);
                if (e) {
                    return e;
                }
                throw new Error(`undefined cohort id: {$id}`);
            };
        }
    }
});
