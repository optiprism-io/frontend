import {defineStore} from 'pinia';
import useI18n from '@/hooks/useI18n';
import schemaService from '@/api/services/schema.service';
import {
    customEventRef,
    EventRef,
    eventRef,
    eventsQueries,
    EventsQuery,
    PropertyRef,
    UserCustomProperty,
    EventQueryRef,
} from '@/types/events';
import { $T, $TKeyExists } from '@/utils/i18n';
import { Cohort, ApplyPayload } from '@/types';
import { aggregates } from '@/types/aggregate';
import { Group, Item } from '@/components/Select/SelectTypes';
import { useEventsStore, Events } from '@/stores/eventSegmentation/events';
import {
    PropertyType,
    CustomEvent,
    EventType,
    Property,
    Event,
    CustomProperty,
    QueryAggregate,
} from '@/api';
import {
    useCommonStore,
    PropertyTypeEnum,
} from '@/stores/common';
import { errorHandler } from '@/helpers/errorHandlerHelper';

type Lexicon = {
    i18n: {
        t: $T,
        keyExists: $TKeyExists,
    },
    cohorts: Cohort[];

    events: Event[];
    customEvents: CustomEvent[]
    eventsLoading: boolean;

    eventProperties: Property[];
    eventCustomProperties: CustomProperty[];
    eventPropertiesLoading: boolean;

    userPropertyPopup: boolean;
    userProperties: Property[];
    userCustomProperties: UserCustomProperty[];
    userPropertiesLoading: boolean;

    systemProperties: Property[];
    systemPropertiesLoading: boolean;
};

export const useLexiconStore = defineStore('lexicon', {
    state: (): Lexicon => ({
        i18n: useI18n(),
        cohorts: [
            {
                id: 1,
                name: 'Active users'
            },
            {
                id: 2,
                name: 'iOS users'
            },
            {
                id: 3,
                name: 'Profitable users'
            }
        ],
        eventsLoading: false,
        events: [],
        customEvents: [],

        eventPropertiesLoading: false,
        eventProperties: [],
        eventCustomProperties: [],

        userPropertyPopup: false,
        userPropertiesLoading: false,
        userProperties: [],
        userCustomProperties: [],

        systemProperties: [],
        systemPropertiesLoading: false,
    }),
    actions: {
        deleteCustomEvent(payload: number) {
            const indexEvent = this.customEvents.findIndex(event => event.id === payload);
            this.customEvents.splice(indexEvent, 1);
        },
        async updateEventProperty(payload: ApplyPayload) {
            const commonStore = useCommonStore()
            try {
                const res = await schemaService.updateEventProperty(commonStore.organizationId, commonStore.projectId, String(commonStore.editEventPropertyPopupId), payload)
                if (res?.data) {
                    const newProperty: Property = res.data;
                    const index: number = this.eventProperties.findIndex(property => Number(property.id) === commonStore.editEventPropertyPopupId)

                    if (~index) {
                        this.eventProperties[index] = newProperty;
                    }
                }
            } catch (e) {
                console.log('error update event property');
            }
        },
        async updateUserProperty(payload: ApplyPayload) {
            const commonStore = useCommonStore()
            try {
                const res = await schemaService.updateUserProperty(commonStore.organizationId, commonStore.projectId, Number(commonStore.editEventPropertyPopupId), payload)
                if (res?.data) {
                    const newProperty: Property = res.data;
                    const index: number = this.userProperties.findIndex(property => Number(property.id) === Number(commonStore.editEventPropertyPopupId))

                    if (~index) {
                        this.userProperties[index] = newProperty
                    }
                }
            } catch (e) {
                throw new Error('error update user property')
            }
        },
        async updateProperty(payload: ApplyPayload) {
            const commonStore = useCommonStore()
            if (commonStore.editEventPropertyPopupType === PropertyTypeEnum.EventProperty) {
                await this.updateEventProperty(payload)
            } else {
                await this.updateUserProperty(payload)
            }
        },
        async updateEvent(payload: ApplyPayload) {
            const commonStore = useCommonStore()

            try {
                const res = await schemaService.updateEvent(commonStore.organizationId, commonStore.projectId, String(commonStore.editEventManagementPopupId), payload)

                if (res?.data) {
                    const newEvent: Event = res.data;
                    const eventIndex: number = this.events.findIndex(event => Number(event.id) === commonStore.editEventManagementPopupId)

                    if (~eventIndex) {
                        this.events[eventIndex] = newEvent
                    }
                }
            } catch (error) {
                throw new Error('error update event')
            }
        },
        async getEvents() {
            const commonStore = useCommonStore()
            this.eventsLoading = true

            try {
                const res = await schemaService.events(commonStore.organizationId, commonStore.projectId)
                if (res.data?.data) {
                    this.events = res.data?.data;
                }
                const responseCustomEvents = await schemaService.customEvents(commonStore.organizationId, commonStore.projectId)
                if (responseCustomEvents?.data?.data) {
                    this.customEvents = <CustomEvent[]>responseCustomEvents.data?.data || [];
                }
            } catch (error) {
                console.log('error customEvents')
            }

            this.eventsLoading = false;
        },
        async getEventProperties() {
            const commonStore = useCommonStore()

            this.eventPropertiesLoading = true
            try {
                const res = await schemaService.eventProperties(commonStore.organizationId, commonStore.projectId)
                if (res?.data?.data) {
                    this.eventProperties = res.data.data
                }

                const resCustom = await schemaService.eventCustomProperties(commonStore.organizationId, commonStore.projectId);
                if (resCustom?.data?.events) {
                    this.eventCustomProperties = resCustom.data.events;
                }
            } catch(e) {
                console.log('error getEventProperties');
            }

            this.eventPropertiesLoading = false;
        },
        async getSystemProperties() {
            const commonStore = useCommonStore();

            this.systemPropertiesLoading = true;

            try {
                const res = await schemaService.systemProperties(commonStore.organizationId, commonStore.projectId);
                if (res?.data?.data) {
                    this.systemProperties = res.data.data;
                }
            } catch(e) {
                console.log('Error Get System Properties');
            }

            this.systemPropertiesLoading = false;
        },
        async getUserProperties() {
            const commonStore = useCommonStore()
            this.eventPropertiesLoading = true;
            try {
                const res = await schemaService.userProperties(commonStore.organizationId, commonStore.projectId);

                this.userProperties = Array.isArray(res?.data?.data) ? res?.data?.data : [];
            } catch (error) {
                console.log('error getUserProperties');
            }
            this.eventPropertiesLoading = false;
        },
    },
    getters: {
        propertiesLength(state) {
            return state.eventProperties?.length +
                state.eventCustomProperties?.length +
                state.userProperties?.length +
                state.userCustomProperties?.length +
                state.systemProperties?.length;
        },
        findEventById(state: Lexicon) {
            return (id: number): Event => {
                const e = state.events.find((event): boolean => Number(event.id) === Number(id))
                if (e) {
                    return e
                }
                throw new Error(`undefined event id: ${id}`)
            }
        },
        findEventByName(state: Lexicon) {
            return (name: string): Event => {
                const e = state.events.find((event): boolean => name === event.name)
                if (e) {
                    return e
                }
                throw new Error(`undefined event name: ${name}`)
            }
        },
        findCustomEventById(state: Lexicon) {
            return (id: number): CustomEvent => {
                const e = state.customEvents.find((event): boolean => Number(event.id) === Number(id))
                if (e) {
                    return e
                }
                throw new Error(`undefined custom event id: ${id}`)
            }
        },
        findCustomEventByName(state: Lexicon) {
            return (name: string): CustomEvent => {
                const e = state.customEvents.find((event): boolean => name === event.name)
                if (e) {
                    return e
                }
                throw new Error(`undefined custom event name: ${name}`)
            }
        },
        eventName() {
            return (ref: EventRef): string => {
                switch (ref.type) {
                    case EventType.Regular:
                        return this.findEventById(ref.id).name
                    case EventType.Custom:
                        return this.findCustomEventById(ref.id).name
                }
            };
        },
        findEvent() {
            return (ref: EventRef) => {
                switch (ref.type) {
                    case EventType.Regular:
                        return ref.id ? this.findEventById(ref.id) : ref.name ? this.findEventByName(ref.name) : {} as Event;
                    case EventType.Custom:
                        return this.findCustomEventById(ref.id)
                }
            };
        },
        findEventProperties(state: Lexicon) {
            return (ref: EventRef): Property[] => {
                const event = ref?.id ? this.findEventById(ref.id) : ref.name ? this.findEventByName(ref.name) : {} as Event;
                return state.eventProperties.filter((prop): boolean => !!event.eventProperties && event.eventProperties.includes(Number(prop.id)))
            };
        },
        findEventCustomProperties(state: Lexicon) {
            return (ref: EventRef): CustomProperty[] => {
                const event = ref?.id ? this.findEventById(ref.id) : ref.name ? this.findEventByName(ref.name) : {} as Event;
                return state.eventCustomProperties.filter((prop): boolean => !!event.userProperties?.includes(Number(prop.id)))
            };
        },
        findEventPropertyByName(state: Lexicon) {
            return (name: string | number): Property | undefined => {
                const property = state.eventProperties.find((prop): boolean => prop.name === name);
                if (!property) {
                    errorHandler(`undefined property name: ${name}`);
                }
                return property;
            }
        },
        findEventCustomPropertyByName(state: Lexicon) {
            return (name: string): CustomProperty | undefined => {
                const property = state.eventCustomProperties.find((prop): boolean => prop.name === name)
                if (!property) {
                    errorHandler(`undefined custom property name: ${name}`)
                }
                return property;
            }
        },
        findEventCustomPropertyById(state: Lexicon) {
            return (id: number): CustomProperty | undefined => {
                const property = state.eventCustomProperties.find((prop): boolean => prop.id === id);
                if (!property) {
                    errorHandler(`undefined custom property id: ${id}`)
                }
                return property;
            };
        },
        findSystemPropertyByName(state: Lexicon) {
            return (name: string | number): Property | undefined => {
                const property = state.systemProperties.find((prop): boolean => prop.name === name);
                if (!property) {
                    errorHandler(`undefined System property name: ${name}`);
                }
                return property;
            }
        },
        findSystemPropertyById(state: Lexicon) {
            return (id: number): Property | undefined => {
                const property = state.systemProperties.find((prop): boolean => Number(prop.id) === Number(id));
                if (!property) {
                    errorHandler(`undefined System property id: ${id}`)
                }
                return property;
            };
        },
        findUserPropertyByName(state: Lexicon) {
            return (name: string | number): Property | undefined => {
                const property = state.userProperties.find((prop): boolean => prop.name === name);
                if (!property) {
                    errorHandler(`undefined user property name: ${name}`);
                }
                return property;
            }
        },
        findUserPropertyById(state: Lexicon) {
            return (id: number): Property | undefined => {
                const property = state.userProperties.find((prop): boolean => Number(prop.id) === Number(id));
                if (!property) {
                    errorHandler(`undefined user property id: ${id}`)
                }
                return property;
            };
        },
        findEventPropertyById(state: Lexicon) {
            return (id: number): Property | undefined => {
                const property = state.eventProperties.find((prop): boolean => Number(prop.id) === Number(id));
                if (!property) {
                    errorHandler(`undefined property id: ${id}`);
                }
                return property;
            };
        },
        findEventProperty(state: Lexicon) {
            return (ref: PropertyRef): Property | undefined => {
                const property = ref?.name ? state.eventProperties.find((prop): boolean => (prop.name || prop.displayName) === ref.name) : this.findEventPropertyById(ref.id);
                if (!property) {
                    errorHandler(`undefined property name: ${ref?.name}`);
                }
                return property;
            };
        },
        property() {
            return (ref: PropertyRef): Property | CustomProperty | UserCustomProperty | undefined => {
                switch (ref.type) {
                    case PropertyType.Event:
                        return this.findEventPropertyById(ref.id);
                    case PropertyType.Custom:
                        return this.findEventCustomPropertyById(ref.id);
                    case PropertyType.User:
                        return this.findUserPropertyById(ref.id);
                    default:
                        return undefined;
                }
            };
        },
        propertyName() {
            return (ref: PropertyRef): string => {
                switch (ref.type) {
                    case PropertyType.Event:
                        return this.findEventPropertyById(ref.id)?.name || '';
                    case PropertyType.Custom:
                        return this.findEventCustomPropertyById(ref.id)?.name || '';
                    case PropertyType.User:
                        return this.findUserPropertyById(ref.id)?.name || '';
                }
            };
        },
        findCohortById(state: Lexicon) {
            return (id: number): Cohort => {
                const e = state.cohorts.find((cohort): boolean => cohort.id === id);
                if (e) {
                    return e;
                }
                throw new Error(`undefined cohort id: ${id}`)
            };
        },
        eventsList(state: Lexicon) {
            const eventsList: Group<Item<EventRef, null>[]>[] = [];
            const eventsListCustom: Item<EventRef, null>[] = [];

            const setToList = (name: string, item: Item<EventRef, null>) => {
                const group = eventsList.find(g => g.name === name);

                if (!group) {
                    eventsList.push({
                        name: name,
                        items: [item],
                    });
                } else {
                    group.items.push(item);
                }
            };

            if (state.customEvents) {
                state.customEvents.forEach((e: CustomEvent) => {
                    eventsListCustom.push({
                        item: customEventRef(e),
                        name: e.name,
                        description: e?.description,
                        editable: true
                    });
                });
            }

            eventsList.push({
                type: 'custom',
                name: 'Custom Events',
                items: eventsListCustom?.length ? eventsListCustom : [],
                action: {
                    type: 'createCustomEvent',
                    icon: 'fas fa-plus-circle',
                    text: 'common.create',
                },
            });

            state.events.forEach((e: Event) => {
                const item: Item<EventRef, null> = {
                    item: eventRef(e),
                    name: e.displayName || e.name,
                    description: e?.description
                };

                if (Array.isArray(e.tags) && e.tags.length) {
                    e.tags.forEach((tag: string) => {
                        setToList(tag, item);
                    });
                } else {
                    setToList('Other', item);
                }
            });

            if (!state.events?.length && !state.customEvents?.length) {
                eventsList.push({
                    type: '',
                    name: '',
                    items: [{
                        item: {
                            type: EventType.Regular,
                            id: 0,
                            name: '',
                        },
                        name: this.i18n.t('events.noEvents'),
                        description: this.i18n.t('events.noEventsText'),
                        editable: false,
                        noSelected: true,
                    }],
                });
            }

            return eventsList;
        },
        eventsQueryAggregates() {
            return aggregates.map((aggregate): Item<EventQueryRef, null> => ({
                item: {
                    typeAggregate: aggregate.id as QueryAggregate,
                },
                name: aggregate.name || '',
            }));
        },
        eventsQueries() {
            const eventsStore: Events = useEventsStore();

            return eventsQueries.map((item) => {
                const query: Item<EventQueryRef, Item<EventQueryRef, null>[] | undefined> = {
                    item: {
                        type: item.type,
                        name: item.name || '',
                    },
                    name: item.grouped ? `${item.displayName} ${eventsStore.group}` : item.displayName,
                };

                if (item.hasAggregate && item.hasProperty) {
                    query.items = this.eventsQueryAggregates;
                }

                return query;
            })
        },
        findQuery() {
            return (ref: EventQueryRef | undefined): EventsQuery | undefined => {
                return ref ? eventsQueries.find((item: EventsQuery) => {
                    return item.type === ref.type;
                }) : ref;
            }
        },
        findQueryItem() {
            return (ref: EventQueryRef): Item<EventQueryRef, Item<EventQueryRef, null>[] | undefined> | undefined => {
                return this.eventsQueries.find(query => {
                    return JSON.stringify(query.item) === JSON.stringify(ref);
                });
            };
        },
    },
});
