import { EventType } from '@/api'
import { apiClient } from '@/api/apiClient'
import { useLexiconStore } from '@/stores/lexicon'
import { useProjectsStore } from '@/stores/projects/projects'

import type { Value, ListPropertyValuesRequest } from '@/api';
import type { EventRef, PropertyRef } from '@/types/events'

interface UseFilter {
  getEventRef: (id: number) => EventRef | undefined
  getValues: (propRef: PropertyRef) => Promise<Value[]>
}

export const useFilter = (): UseFilter => {
  const lexiconStore = useLexiconStore()
  const projectsStore = useProjectsStore()

  const getEventRef = (id: number): EventRef | undefined => {
    const event = lexiconStore.events.find(item => {
      if (item.eventProperties) {
        return item.eventProperties.includes(id)
      }
    })

    let eventRef

    lexiconStore.eventsList.forEach(item => {
      const eventStoreRef: any = item.items.find(itemInner => itemInner.item.id === event?.id)

      if (event) {
        eventRef = eventStoreRef
      }
    })

    return eventRef
  }

  const getValues = async (propRef: PropertyRef) => {
    const property = lexiconStore.property(propRef)
    let valuesList: Value[] = []

    if (property) {
      const eventRef = property.id ? getEventRef(property.id) : null

      const props: ListPropertyValuesRequest = {
        eventType: (eventRef?.type as EventType) || EventType.Regular,
        propertyName: property.name || '',
        propertyType: propRef.type,
      }

      if (propRef?.group || propRef?.group === 0) {
        props.group = propRef.group
      }

      if (eventRef) {
        props.eventName = eventRef.name
      }

      try {
        const res = await apiClient.propertyValues.propertyValuesList(projectsStore.projectId, props)

        if (res.data.data) {
          valuesList = res.data.data
        }
      } catch (error) {
        throw new Error('error getEventsValues')
      }
    }
    return valuesList
  }

  return { getValues, getEventRef }
}
