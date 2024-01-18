import {OperationId, Value} from '@/types'
import {PropertyRef} from '@/types/events'
import {
    CreateCustomEventRequest,
    CustomEventEvent,
    EventsApi,
    EventType,
    EventPropertiesApi,
    CustomEventsApi,
    PropertiesApi,
    PropertyValuesApi,
    UserPropertiesApi,
    PropertyType,
    UpdateEventRequest,
    UpdatePropertyRequest,
    UpdateCustomEventRequest,
    ListPropertyValuesRequest,
    SystemPropertiesApi,
} from '@/api'
import {config} from '@/api/services/config';

const api = new EventsApi(config)
const customEventsApi = new CustomEventsApi(config)
const propertiesApi = new PropertiesApi(config)
const propertyValuesApi = new PropertyValuesApi(config)
const eventPropertiesApi = new EventPropertiesApi(config)
const userPropertiesApi = new UserPropertiesApi(config)
const systemPropertiesApi = new SystemPropertiesApi(config)

export type FilterCustomEvent = {
    filterType: string
    propertyName: string
    propertyType: PropertyType,
    operation: OperationId
    value: Value[]
    propRef: PropertyRef
    valuesList?: string[]
}

export interface Event extends Omit<CustomEventEvent, 'eventType'> {
    eventType: EventType
}

export interface CustomEvents extends Omit<CreateCustomEventRequest, 'events'> {
    events: Array<Event>
}

const schemaService = {
    events: async (projectId: number) => await api.eventsList(projectId),
    updateEvent: async(projectId: number, eventId: string, params: UpdateEventRequest) => await api.updateEvent(projectId, eventId, params),
    customEvents: async (projectId: number) => await customEventsApi.customEventsList(projectId),
    createCustomEvent: async (projectId: number, params: CreateCustomEventRequest) => await customEventsApi.createCustomEvent(projectId, params),
    updateCustomEvent: async(projectId: number, eventId: string, params: UpdateCustomEventRequest) => await customEventsApi.updateCustomEvent(projectId, eventId, params),
    deleteCustomEvents: async (projectId: number, eventId: number) => await customEventsApi.deleteCustomEvent(projectId, eventId),
    eventCustomProperties: async (projectId: number) => await propertiesApi.customPropertiesList(projectId),
    eventProperties: async (projectId: number) => await eventPropertiesApi.eventPropertiesList(projectId),
    updateEventProperty: async(projectId: number, propertyId: string, params: UpdatePropertyRequest) => await eventPropertiesApi.updateEventProperty(projectId, propertyId, params),
    userProperties: async (projectId: number) => await userPropertiesApi.userPropertiesList(projectId),
    updateUserProperty: async(projectId: number, propertyId: number, params: UpdatePropertyRequest) => await userPropertiesApi.updateUserProperty(projectId, propertyId, params),
    propertyValues: async(projectId: number, params: ListPropertyValuesRequest) => await propertyValuesApi.propertyValuesList(projectId, params),
    systemProperties: async(projectId: number) => await systemPropertiesApi.systemPropertiesList(projectId),
};

export default schemaService
