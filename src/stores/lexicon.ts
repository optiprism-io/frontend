import { defineStore } from 'pinia'
import useI18n from '@/hooks/useI18n'
import {
  customEventRef,
  EventQueryRef,
  eventRef,
  EventRef,
  eventsQueries,
  EventsQuery,
  PropertyRef,
  UserCustomProperty,
} from '@/types/events'
import { $T, $TKeyExists } from '@/utils/i18n'
import { ApplyPayload, Cohort } from '@/types'
import { aggregates } from '@/types/aggregate'
import { Group as GroupSelect, Item } from '@/components/Select/SelectTypes'
import { Events, useEventsStore } from '@/stores/eventSegmentation/events'
import {
  CustomEvent,
  CustomProperty,
  Event,
  EventType,
  Property,
  PropertyRef as PropertyRefApi,
  PropertyType,
  QueryAggregate,
  Group
} from '@/api'
import { PropertyTypeEnum, useCommonStore } from '@/stores/common'
import { useProjectsStore } from '@/stores/projects/projects'
import { errorHandler } from '@/helpers/errorHandlerHelper'
import { apiClient } from '@/api/apiClient'

type Lexicon = {
  i18n: {
    t: $T
    keyExists: $TKeyExists
  }
  cohorts: Cohort[]

  events: Event[]
  customEvents: CustomEvent[]
  eventsLoading: boolean

  eventProperties: Property[]
  eventCustomProperties: CustomProperty[]
  eventPropertiesLoading: boolean
  
  groups: Group[],
  groupProperties: Property[][]
  
  userPropertyPopup: boolean
  userCustomProperties: UserCustomProperty[]
  userPropertiesLoading: boolean

  systemProperties: Property[]
  systemPropertiesLoading: boolean
}

export const useLexiconStore = defineStore('lexicon', {
  state: (): Lexicon => ({
    i18n: useI18n(),
    cohorts: [
      {
        id: 1,
        name: 'Active users',
      },
      {
        id: 2,
        name: 'iOS users',
      },
      {
        id: 3,
        name: 'Profitable users',
      },
    ],
    eventsLoading: false,
    events: [],
    customEvents: [],

    eventPropertiesLoading: false,
    eventProperties: [],
    eventCustomProperties: [],

    groups: [],
    groupProperties: [],

    userPropertyPopup: false,
    userPropertiesLoading: false,
    userCustomProperties: [],

    systemProperties: [],
    systemPropertiesLoading: false,
  }),
  actions: {
    deleteCustomEvent(payload: number) {
      const indexEvent = this.customEvents.findIndex(event => event.id === payload)
      this.customEvents.splice(indexEvent, 1)
    },
    async updateEventProperty(payload: ApplyPayload) {
      const commonStore = useCommonStore()
      const projectsStore = useProjectsStore()

      try {
        const res = await apiClient.eventProperties.updateEventProperty(
          projectsStore.projectId,
          String(commonStore.editEventPropertyPopupId),
          payload
        )
        if (res?.data) {
          const newProperty: Property = res.data
          const index: number = this.eventProperties.findIndex(
            property => Number(property.id) === commonStore.editEventPropertyPopupId
          )

          if (~index) {
            this.eventProperties[index] = newProperty
          }
        }
      } catch (e) {
        console.error('error update event property')
      }
    },
    async updateUserProperty(payload: ApplyPayload) {
      // const commonStore = useCommonStore()
      // const projectsStore = useProjectsStore()

      // try {
      //   const res = await apiClient.userProperties.updateUserProperty(
      //     projectsStore.projectId,
      //     Number(commonStore.editEventPropertyPopupId),
      //     payload
      //   )
      //   if (res?.data) {
      //     const newProperty: Property = res.data
      //     const index: number = this.userProperties.findIndex(
      //       property => Number(property.id) === Number(commonStore.editEventPropertyPopupId)
      //     )

      //     if (~index) {
      //       this.userProperties[index] = newProperty
      //     }
      //   }
      // } catch (e) {
      //   throw new Error('error update user property')
      // }
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
      const projectsStore = useProjectsStore()

      try {
        const res = await apiClient.events.updateEvent(
          projectsStore.projectId,
          String(commonStore.editEventManagementPopupId),
          payload
        )

        if (res?.data) {
          const newEvent: Event = res.data
          const eventIndex: number = this.events.findIndex(
            event => Number(event.id) === commonStore.editEventManagementPopupId
          )

          if (~eventIndex) {
            this.events[eventIndex] = newEvent
          }
        }
      } catch (error) {
        throw new Error('error update event')
      }
    },
    async getEvents() {
      const projectsStore = useProjectsStore()
      this.eventsLoading = true

      try {
        const res = await apiClient.events.eventsList(projectsStore.projectId)
        if (res.data?.data) {
          this.events = res.data?.data
        }
        const responseCustomEvents = await apiClient.customEvents.customEventsList(projectsStore.projectId)
        if (responseCustomEvents?.data?.data) {
          this.customEvents = <CustomEvent[]>responseCustomEvents.data?.data || []
        }
      } catch (error) {
        console.error('error customEvents')
      }

      this.eventsLoading = false
    },
    async getEventProperties() {
      const projectsStore = useProjectsStore()

      this.eventPropertiesLoading = true
      try {
        const res = await apiClient.eventProperties.eventPropertiesList(projectsStore.projectId)
        if (res?.data?.data) {
          this.eventProperties = res.data.data
        }
      } catch (e) {
        console.error('error getEventProperties')
      }

      this.eventPropertiesLoading = false
    },
    async getSystemProperties() {
      const projectsStore = useProjectsStore()

      this.systemPropertiesLoading = true

      try {
        const res = await apiClient.systemProperties.systemPropertiesList(projectsStore.projectId)
        if (res?.data?.data) {
          this.systemProperties = res.data.data
        }
      } catch (e) {
        console.error('Error Get System Properties')
      }

      this.systemPropertiesLoading = false
    },
    async getGroups() {
      const projectsStore = useProjectsStore()
      try {
        const res = await apiClient.groups.groupList(projectsStore.projectId)
        this.groups = res?.data?.data || []
      } catch (error) {
        console.error('Error Get Groups')
      }
    },
    async getGroupProperties() {
      const projectsStore = useProjectsStore()
      this.eventPropertiesLoading = true
      try {
        console.log('INFO:', this.groups);
        this.groupProperties = await Promise.all(this.groups.map(async (group) => {
          const res = await apiClient.groupProperties.groupPropertiesList(projectsStore.projectId, `${group.id}`)
          return res?.data?.data || []
        }))
      } catch (error) {
        console.error('error getGroupProperties')
      }
      this.eventPropertiesLoading = false
    },
  },
  getters: {
    properties(state) {
      return [
        ...state.eventProperties.map((item): PropertyRefApi => {
          return {
            propertyType: PropertyType.Event,
            propertyName: item.name || item.displayName,
          }
        }),
        ...state.groupProperties.flat().map((item): PropertyRefApi => {
          return {
            propertyType: PropertyType.Group,
            propertyName: item.name || item.displayName,
          }
        }),
        ...state.systemProperties.map((item): PropertyRefApi => {
          return {
            propertyType: PropertyType.System,
            propertyName: item.name || item.displayName,
          }
        })
      ]
    },
    propertiesLength(): number {
      return this.properties.length
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
            return ref.name ? this.findEventByName(ref.name).name : ''
          case EventType.Custom:
            return ref.name ? this.findCustomEventByName(ref.name).name : ''
          default:
            return ref?.name || '';
        }
      }
    },
    findEvent() {
      return (ref: EventRef) => {
        switch (ref.type) {
          case EventType.Regular:
            return ref.id
              ? this.findEventById(ref.id)
              : ref.name
                ? this.findEventByName(ref.name)
                : ({} as Event)
          case EventType.Custom:
            return this.findCustomEventByName(ref.name)
        }
      }
    },
    findEventProperties(state: Lexicon) {
      return (ref: EventRef): Property[] => {
        const event = ref?.id
          ? this.findEventById(ref.id)
          : ref.name
            ? this.findEventByName(ref.name)
            : ({} as Event)
        return state.eventProperties.filter(
          (prop): boolean =>
            !!event.eventProperties && event.eventProperties.includes(Number(prop.id))
        )
      }
    },
    findEventCustomProperties(state: Lexicon) {
      return (ref: EventRef): CustomProperty[] => {
        // const event = ref.name
      //     ? this.findEventByName(ref.name)
      //     : ({} as Event)
        // return state.eventCustomProperties.filter(
        //   (prop): boolean => !!event.userProperties?.includes(Number(prop.id))
        // )

        // TODO
        return []
      }
    },
    findEventPropertyByName(state: Lexicon) {
      return (name: string | number): Property | undefined => {
        const property = state.eventProperties.find((prop): boolean => prop.name === name)
        if (!property) {
          errorHandler(`undefined property name: ${name}`)
        }
        return property
      }
    },
    findEventCustomProperty(state: Lexicon) {
      return (name: string): CustomProperty | undefined => {
        const property = state.eventCustomProperties.find((prop): boolean => prop.name === name)
        if (!property) {
          errorHandler(`undefined custom property name: ${name}`)
        }
        return property
      }
    },
    findEventCustomPropertyById(state: Lexicon) {
      return (id: number): CustomProperty | undefined => {
        const property = state.eventCustomProperties.find((prop): boolean => prop.id === id)
        if (!property) {
          errorHandler(`undefined custom property id: ${id}`)
        }
        return property
      }
    },
    findSystemPropertyByName(state: Lexicon) {
      return (name: string | number): Property | undefined => {
        const property = state.systemProperties.find((prop): boolean => prop.name === name)
        if (!property) {
          errorHandler(`undefined System property name: ${name}`)
        }
        return property
      }
    },
    findGroupProperty(state: Lexicon) {
      return (name: string | number): Property | undefined => {
        const property = state.groupProperties.flat().find((prop): boolean => prop.name === name)
        if (!property) {
          errorHandler(`undefined group property name: ${name}`)
        }
        return property
      }
    },
    findGroupPropertyById(state: Lexicon) {
      return (id: number): Property | undefined => {
        const property = state.groupProperties.flat().find(
          (prop): boolean => Number(prop.id) === Number(id)
        )
        if (!property) {
          errorHandler(`undefined group property id: ${id}`)
        }
        return property
      }
    },
    findEventPropertyById(state: Lexicon) {
      return (id: number): Property | undefined => {
        const property = state.eventProperties.find(
          (prop): boolean => Number(prop.id) === Number(id)
        )
        if (!property) {
          errorHandler(`undefined property id: ${id}`)
        }
        return property
      }
    },
    findEventProperty(state: Lexicon) {
      return (ref: PropertyRef): Property | undefined => {
        const property = ref?.name
          ? state.eventProperties.find(
              (prop): boolean => (prop.name || prop.displayName) === ref.name
            )
          : this.findEventPropertyByName(ref.name)
        if (!property) {
          errorHandler(`undefined property name: ${ref?.name}`)
        }
        return property
      }
    },
    property() {
      return (ref: PropertyRef): Property | CustomProperty | UserCustomProperty | undefined => {
        switch (ref.type) {
          case PropertyType.Event:
            return this.findEventPropertyByName(ref.name)
          case PropertyType.Custom:
            return this.findEventCustomProperty(ref.name)
          case PropertyType.Group:
            return this.findGroupProperty(ref.name)
          case PropertyType.System:
            return this.findSystemPropertyByName(ref.name)
          default:
            return undefined
        }
      }
    },
    findCohortById(state: Lexicon) {
      return (id: number): Cohort => {
        const e = state.cohorts.find((cohort): boolean => cohort.id === id)
        if (e) {
          return e
        }
        throw new Error(`undefined cohort id: ${id}`)
      }
    },
    eventsList(state: Lexicon) {
      const eventsList: GroupSelect<Item<EventRef, null>[]>[] = []
      const eventsListCustom: Item<EventRef, null>[] = []

      const setToList = (name: string, item: Item<EventRef, null>) => {
        const group = eventsList.find(g => g.name === name)

        if (!group) {
          eventsList.push({
            name: name,
            items: [item],
          })
        } else {
          group.items.push(item)
        }
      }

      if (state.customEvents) {
        state.customEvents.forEach((e: CustomEvent) => {
          eventsListCustom.push({
            item: customEventRef(e),
            name: e.name,
            description: e?.description,
            editable: true,
          })
        })
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
      })

      state.events.forEach((e: Event) => {
        const item: Item<EventRef, null> = {
          item: eventRef(e),
          name: e.displayName || e.name,
          description: e?.description,
        }

        if (Array.isArray(e.tags) && e.tags.length) {
          e.tags.forEach((tag: string) => {
            setToList(tag, item)
          })
        } else {
          setToList('Other', item)
        }
      })

      if (!state.events?.length && !state.customEvents?.length) {
        eventsList.push({
          type: '',
          name: '',
          items: [
            {
              item: {
                type: EventType.Regular,
                id: 0,
                name: '',
              },
              name: this.i18n.t('events.noEvents'),
              description: this.i18n.t('events.noEventsText'),
              editable: false,
              noSelected: true,
            },
          ],
        })
      }

      return eventsList
    },
    eventsQueryAggregates() {
      return aggregates.map(
        (aggregate): Item<EventQueryRef, null> => ({
          item: {
            typeAggregate: aggregate.id as QueryAggregate,
          },
          name: aggregate.name || '',
        })
      )
    },
    eventsQueries() {
      const eventsStore: Events = useEventsStore()

      return eventsQueries.map(item => {
        const query: Item<EventQueryRef, Item<EventQueryRef, null>[] | undefined> = {
          item: {
            type: item.type,
            name: item.name || '',
          },
          name: item.grouped ? `${item.displayName} ${eventsStore.group}` : item.displayName,
        }

        if (item.hasAggregate && item.hasProperty) {
          query.items = this.eventsQueryAggregates
        }

        return query
      })
    },
    findQuery() {
      return (ref: EventQueryRef | undefined): EventsQuery | undefined => {
        return ref
          ? eventsQueries.find((item: EventsQuery) => {
              return item.type === ref.type
            })
          : ref
      }
    },
    findQueryItem() {
      return (
        ref: EventQueryRef
      ): Item<EventQueryRef, Item<EventQueryRef, null>[] | undefined> | undefined => {
        return this.eventsQueries.find(query => {
          return JSON.stringify(query.item) === JSON.stringify(ref)
        })
      }
    },
  },
})
