import { defineStore } from "pinia";
import schemaService from "@/api/services/schema.service";
import {
    CustomEvent,
    EventProperty,
    UserCustomProperty,
    Event,
    EventCustomProperty,
    UserProperty,
    EventType,
    Cohort,
    customEventRef,
    eventRef,
    PropertyRef,
    PropertyType,
    EventRef,
    eventsQueries,
    EventQueryRef,
    aggregates,
} from "@/types";
import { Group, Item } from "@/components/Select/SelectTypes";
import { useEventsStore, Events } from "@/stores/eventSegmentation/events";

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
    userPropertiesLoading: boolean;
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

        eventsLoading: false,
        events: [],
        customEvents: [],

        eventPropertiesLoading: false,
        eventProperties: [],
        eventCustomProperties: [],

        userPropertiesLoading: false,
        userProperties: [],
        userCustomProperties: [],
    }),
    actions: {
        async getEvents() {
            this.eventsLoading = true;
            try {
                this.events = await schemaService.events();
                this.customEvents = await schemaService.customEvents();
            } catch (error) {
                throw new Error("error getEvents");
            }
            this.eventsLoading = false;
        },
        async getEventProperties() {
            this.eventPropertiesLoading = true;
            try {
                this.eventProperties = await schemaService.eventProperties();
                this.eventCustomProperties = await schemaService.eventCustomProperties();
            } catch (error) {
                throw new Error("error getEventProperties");
            }
            this.eventPropertiesLoading = false;
        },
        async getUserProperties() {
            this.eventPropertiesLoading = true;
            try {
                this.userProperties = await schemaService.userProperties();
                this.userCustomProperties = await schemaService.userCustomProperties();
            } catch (error) {
                throw new Error("error getUserProperties");
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
            return (ref: EventRef): string => {
                switch (ref.type) {
                    case EventType.Regular:
                        return this.findEventById(ref.id).name;
                    case EventType.Custom:
                        return this.findCustomEventById(ref.id).name;
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
        propertyName() {
            return (ref: PropertyRef): string => {
                switch (ref.type) {
                    case PropertyType.Event:
                        return this.findEventPropertyById(ref.id).name;
                    case PropertyType.EventCustom:
                        return this.findEventCustomPropertyById(ref.id).name;
                    case PropertyType.User:
                        return this.findUserPropertyById(ref.id).name;
                    case PropertyType.UserCustom:
                        return this.findUserCustomPropertyById(ref.id).name;
                }
                throw new Error("unhandled");
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
        },
        eventsList(state: Lexicon): Group[] {
            const eventsList: Group[] = [];

            if (state.customEvents.length) {
                const items: Item[] = [];

                state.customEvents.forEach((e: CustomEvent) => {
                    items.push({
                        item: customEventRef(e),
                        name: e.name,
                        description: e?.description
                    });
                });

                if (items.length) {
                    eventsList.push({ name: "Custom Events", items });
                }
            }

            state.events.forEach((e: Event) => {
                const item: Item = {
                    item: eventRef(e),
                    name: e.name,
                    description: e?.description
                };

                const setToList = (name: string, item: Item) => {
                    const group = eventsList.find((g: Group) => g.name === name);

                    if (!group) {
                        eventsList.push({
                            name: name,
                            items: [item]
                        });
                    } else {
                        group.items.push(item);
                    }
                };

                if (Array.isArray(e.tags) && e.tags.length) {
                    e.tags.forEach((tag: string) => {
                        setToList(tag, item);
                    });
                } else {
                    setToList("Other", item);
                }
            });

            return eventsList;
        },
        eventsQueries(state: Lexicon): Item[] {
            const eventsStore: Events = useEventsStore();

            return eventsQueries.map(item => {
                const query: Item = {
                    item: <EventQueryRef>{
                        type: item.type,
                        name: item.name || '',
                    },
                    name: item.grouped ? `${item.displayName} ${eventsStore.group}` : item.displayName,
                };

                if (item.hasAggregate) {
                    query.items = aggregates.map(aggregate => {
                        return {
                            item: {
                                type: aggregate.id
                            },
                            name: aggregate.name
                        };
                    });
                }

                return query;
            })
        },
        findQuery(state: Lexicon) {
            return (ref: EventQueryRef): Item | undefined => {
                return this.eventsQueries.find((query: Item) => {
                    return JSON.stringify(query.item) === JSON.stringify(ref);
                });
            };
        },
    },
});