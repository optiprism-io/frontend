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
    eventPropertiesLoading: boolean;

    userProperties: UserProperty[];
    userCustomProperties: UserCustomProperty[];
};

export const useLexiconStore = defineStore("lexicon", {
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
        eventProperties: [],
        eventCustomProperties: [],
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
        ],

        eventPropertiesLoading: false,
        eventsLoading: false
    }),
    actions: {
        async getEvents() {
            this.eventsLoading = true;
            try {
                this.events = await schemaService.events();
                this.customEvents = await schemaService.customEvents();
            } catch (error) {
                console.log(error); // TODO error handler
            }
            this.eventsLoading = false;
        },
        async getEventProperties() {
            this.eventPropertiesLoading = true;
            try {
                this.eventProperties = await schemaService.eventProperties();
                this.eventCustomProperties = await schemaService.eventCustomProperties();
            } catch (error) {
                console.log(error); // TODO error handler
            }
            this.eventPropertiesLoading = false;
        }
    },
    getters: {
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
        eventName(state: Lexicon) {
            return (type: EventType, id: number): string => {
                switch (type) {
                    case EventType.Regular:
                        return this.findEventById(id).name;
                    case EventType.Custom:
                        return this.findCustomEventById(id).name;
                }
            };
        },
        findEventProperties(state: Lexicon) {
            return (eventId: number): EventProperty[] => {
                return state.eventProperties.filter((prop): boolean => prop.id === eventId);
            };
        },
        findEventCustomProperties(state: Lexicon) {
            return (eventId: number): EventCustomProperty[] => {
                return state.eventCustomProperties.filter((prop): boolean => prop.id === eventId);
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
