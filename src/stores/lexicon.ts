import {defineStore} from 'pinia'
import {
    CustomEvent,
    EventProperty,
    UserCustomProperty,
    DataType,
    Event,
    EventCustomProperty,
    EventStatus,
    UserProperty, EventType, EventRef,
} from '../types'

type Lexicon = {
    events: Event[],
    customEvents: CustomEvent[],
    eventProperties: EventProperty[],
    eventCustomProperties: EventCustomProperty[],
    userProperties: UserProperty[],
    userCustomProperties: UserCustomProperty[],
}

export const lexiconStore = defineStore('lexicon', {
    state: (): Lexicon => ({
        eventProperties: [
            {
                id: 1,
                eventId: 2,
                createdAt: new Date(),
                createdBy: 0,
                updatedBy: 0,
                tags: [],
                name: 'Query',
                type: DataType.String,
                nullable: false,
                is_dictionary: false,
            },
            {
                id: 2,
                eventId: 3,
                createdAt: new Date(),
                createdBy: 0,
                updatedBy: 0,
                tags: [],
                name: 'Product name',
                type: DataType.String,
                nullable: false,
                is_dictionary: true,
                dictionary_type: DataType.UInt16,
            },
            {
                id: 3,
                eventId: 3,
                createdAt: new Date(),
                createdBy: 0,
                updatedBy: 0,
                tags: [],
                name: 'Product Category',
                type: DataType.String,
                nullable: false,
                is_dictionary: true,
                dictionary_type: DataType.UInt16,
            },
            {
                id: 4,
                eventId: 3,
                createdAt: new Date(),
                createdBy: 0,
                updatedBy: 0,
                tags: [],
                name: 'Product Price',
                type: DataType.Float64,
                nullable: false,
                is_dictionary: false,
            },
            {
                id: 5,
                eventId: 4,
                createdAt: new Date(),
                createdBy: 0,
                updatedBy: 0,
                tags: [],
                name: 'Product name',
                type: DataType.String,
                nullable: false,
                is_dictionary: true,
                dictionary_type: DataType.UInt64,
            },
            {
                id: 6,
                eventId: 4,
                createdAt: new Date(),
                createdBy: 0,
                updatedBy: 0,
                tags: [],
                name: 'Product Category',
                type: DataType.String,
                nullable: false,
                is_dictionary: true,
                dictionary_type: DataType.UInt16,
            },
            {
                id: 7,
                eventId: 4,
                createdAt: new Date(),
                createdBy: 0,
                updatedBy: 0,
                tags: [],
                name: 'Product Price',
                type: DataType.Float64,
                nullable: false,
                is_dictionary: false,
            },
            {
                id: 8,
                eventId: 5,
                createdAt: new Date(),
                createdBy: 0,
                updatedBy: 0,
                tags: [],
                name: 'Product name',
                type: DataType.String,
                nullable: false,
                is_dictionary: true,
                dictionary_type: DataType.UInt64,
            },
            {
                id: 9,
                eventId: 5,
                createdAt: new Date(),
                createdBy: 0,
                updatedBy: 0,
                tags: [],
                name: 'Product Category',
                type: DataType.String,
                nullable: false,
                is_dictionary: true,
                dictionary_type: DataType.UInt16,
            },
            {
                id: 10,
                eventId: 5,
                createdAt: new Date(),
                createdBy: 0,
                updatedBy: 0,
                tags: [],
                name: 'Product Price',
                type: DataType.Float64,
                nullable: false,
                is_dictionary: false,
            },
            {
                id: 11,
                eventId: 5,
                createdAt: new Date(),
                createdBy: 0,
                updatedBy: 0,
                tags: [],
                name: 'Discount',
                type: DataType.Float64,
                nullable: false,
                is_dictionary: false,
            },
            {
                id: 12,
                eventId: 5,
                createdAt: new Date(),
                createdBy: 0,
                updatedBy: 0,
                tags: [],
                name: 'Revenue',
                type: DataType.Float64,
                nullable: false,
                is_dictionary: false,
            }
        ],
        eventCustomProperties: [{
            id: 1,
            eventId: 1,
            createdAt: new Date(),
            createdBy: 0,
            updatedBy: 0,
            tags: [],
            name: 'custom prop 1',
            type: DataType.String,
            nullable: false,
            is_dictionary: false,
        }],
        events: [
            {
                id: 1,
                createdAt: new Date(),
                createdBy: 0,
                updatedBy: 0,
                projectId: 0,
                tags: ['Onboarding'],
                name: 'Sign Up',
                description: 'When user signs up',
                status: EventStatus.Enabled,
            },
            {
                id: 2,
                createdAt: new Date(),
                createdBy: 0,
                updatedBy: 0,
                projectId: 0,
                tags: ['General'],
                name: 'Search',
                description: 'Search',
                status: EventStatus.Enabled,
                properties: [1]
            },
            {
                id: 3,
                createdAt: new Date(),
                createdBy: 0,
                updatedBy: 0,
                projectId: 0,
                tags: ['General'],
                name: 'View Product',
                description: 'View product',
                status: EventStatus.Enabled,
                properties: [2, 3, 4]
            },
            {
                id: 4,
                createdAt: new Date(),
                createdBy: 0,
                updatedBy: 0,
                projectId: 0,
                tags: ['Revenue'],
                name: 'Add Product to Cart',
                description: 'Add Product to Cart',
                status: EventStatus.Enabled,
                properties: [5, 6, 7]
            },
            {
                id: 5,
                createdAt: new Date(),
                createdBy: 0,
                updatedBy: 0,
                projectId: 0,
                tags: ['Revenue'],
                name: 'Purchase Product',
                description: 'When product was purchased',
                status: EventStatus.Enabled,
                properties: [8, 9, 10, 11, 12]
            }
        ],
        customEvents: [
            {
                id: 5,
                createdAt: new Date(),
                createdBy: 0,
                updatedBy: 0,
                projectId: 0,
                tags: ['1'],
                name: 'Custom event',
                description: 'This is custom event',
                status: EventStatus.Enabled,
            }
        ],
        userProperties: [
            {
                id: 1,
                schema_id: 0,
                createdAt: new Date(),
                createdBy: 0,
                updatedBy: 0,
                tags: [],
                name: 'Name',
                type: DataType.String,
                nullable: false,
                is_dictionary: true,
                dictionary_type: DataType.UInt64,
            },
            {
                id: 1,
                schema_id: 0,
                createdAt: new Date(),
                createdBy: 0,
                updatedBy: 0,
                tags: [],
                name: 'Age',
                type: DataType.UInt8,
                nullable: false,
                is_dictionary: false,
            },
            {
                id: 1,
                schema_id: 0,
                createdAt: new Date(),
                createdBy: 0,
                updatedBy: 0,
                tags: [],
                name: 'Country',
                type: DataType.String,
                nullable: false,
                is_dictionary: true,
                dictionary_type: DataType.UInt8,
            },
            {
                id: 1,
                schema_id: 0,
                createdAt: new Date(),
                createdBy: 0,
                updatedBy: 0,
                tags: [],
                name: 'Device',
                type: DataType.String,
                nullable: false,
                is_dictionary: true,
                dictionary_type: DataType.UInt32,
            }
        ],
        userCustomProperties: [{
            id: 1,
            schema_id: 0,
            createdAt: new Date(),
            createdBy: 0,
            updatedBy: 0,
            tags: [],
            name: 'custom user prop',
            type: DataType.String,
            nullable: false,
            is_dictionary: true,
            dictionary_type: DataType.UInt64,
        },]
    }),
    getters: {
        eventName(state: Lexicon) {
            return (type: EventType, id: number): string => {
                switch (type) {
                    case EventType.Regular:
                        return lexiconStore().findEventById(id).name
                    case EventType.Custom:
                        return lexiconStore().findCustomEventById(id).name
                }
            }
        },
        findEventById(state: Lexicon) {
            return (id: number): Event => {
                let e = state.events.find((event): boolean => event.id === id)
                if (e) {
                    return e
                }
                throw new Error(`undefined event id: {$id}`)
            }
        },
        findCustomEventById(state: Lexicon) {
            return (id: number): CustomEvent => {
                let e = state.customEvents.find((event): boolean => event.id === id)
                if (e) {
                    return e
                }
                throw new Error(`undefined custom event id: {$id}`)
            }
        },
        findEventProperties(state: Lexicon) {
            return (eventId: number): EventProperty[] => {
                return state.eventProperties.filter((prop): boolean => prop.eventId === eventId)
            }
        },
        findEventCustomProperties(state: Lexicon) {
            return (eventId: number): EventCustomProperty[] => {
                return state.eventCustomProperties.filter((prop): boolean => prop.eventId === eventId)
            }
        },
        findEventPropertyById(state: Lexicon) {
            return (id: number): EventProperty => {
                let e = state.eventProperties.find((prop): boolean => prop.id === id)
                if (e) {
                    return e
                }
                throw new Error(`undefined property id: {$id}`)
            }
        },
        findEventCustomPropertyById(state: Lexicon) {
            return (id: number): EventCustomProperty => {
                let e = state.eventCustomProperties.find((prop): boolean => prop.id === id)
                if (e) {
                    return e
                }
                throw new Error(`undefined custom property id: {$id}`)
            }
        },
        findUserPropertyById(state: Lexicon) {
            return (id: number): UserProperty => {
                let e = state.userProperties.find((prop): boolean => prop.id === id)
                if (e) {
                    return e
                }
                throw new Error(`undefined user property id: {$id}`)
            }
        },
        findUserCustomPropertyById(state: Lexicon) {
            return (id: number): UserCustomProperty => {
                let e = state.userCustomProperties.find((prop): boolean => prop.id === id)
                if (e) {
                    return e
                }
                throw new Error(`undefined user custom property id: {$id}`)
            }
        },
    },
})