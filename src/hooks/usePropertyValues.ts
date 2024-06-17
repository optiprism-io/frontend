import { apiClient } from '@/api/apiClient'
import { useProjectsStore } from '@/stores/projects/projects'

import type { EventType, ListPropertyValuesRequest, Value } from '@/api'
import type { PropertyRef, EventRef } from '@/types/events'

export const usePropertyValues = () => {
  const projectsStore = useProjectsStore()

  const getValues = async (propRef: PropertyRef, eventRef: EventRef) => {
    let valuesList: Value[] = []

    const valuesRequest: ListPropertyValuesRequest = {
      eventName: eventRef.name,
      eventType: eventRef.type as EventType,
      propertyName: propRef.name,
      propertyType: propRef.type,
    }

    if (propRef.group || propRef.group === 0) {
      valuesRequest.group = propRef.group
    }

    try {
      const res = await apiClient.propertyValues.propertyValuesList(
        projectsStore.projectId,
        valuesRequest
      )

      if (res?.data?.data) {
        valuesList = res.data.data
      }
    } catch (_) {
      throw new Error('Error Get Property Values')
    }

    return valuesList
  }

  return {
    getValues,
  }
}
