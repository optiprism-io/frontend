import { computed } from 'vue'

import { PropertyType } from '@/api'
import usei18n from '@/hooks/useI18n'
import { useLexiconStore } from '@/stores/lexicon'

import type { Property } from '@/api';
import type { Group, Item } from '@/components/Select/SelectTypes'
import type { PropertyRef } from '@/types/events'

export type PropertyItem = Item<PropertyRef, null>

const getProperties = (items: Property[], name: string, type: PropertyType, group?: number) => {
  return {
    name,
    items: items.reduce((acc: PropertyItem[], item) => {
      const propertyRef: PropertyRef = {
        type: type,
        id: item.id,
        name: item.name,
      }

      if (item.groupId) {
        propertyRef.group = item.groupId
      }

      if (group || group === 0) {
        propertyRef.group = group
      }

      acc.push({
        item: propertyRef,
        name: item.name,
        description: item?.description,
        hidden: item.hidden,
        dataType: item.dataType
      })

      return acc
    }, []),
  }
}

const userProperty = () => {
  const lexiconStore = useLexiconStore()
  const { t } = usei18n()

  const strings = {
    systemProperties: t('events.systemProperties'),
  }

  const noDataPropertyes = computed(() => {
    return !lexiconStore.propertiesLength
  })

  const systemProperties =  computed(() => {
    return getProperties(
      lexiconStore.systemProperties,
      strings.systemProperties,
      PropertyType.System)
  })

  const groupedProperties = computed(() => {
    const ret: Group<PropertyItem[]>[] = []

    if (noDataPropertyes.value) {
      return [
        {
          name: '',
          items: [
            {
              item: {
                type: PropertyType.Event,
                id: 0,
                name: '',
              },
              name: t('common.noProperties'),
              description: t('common.noPropertiesText'),
              editable: false,
              noSelected: true,
            },
          ],
        },
      ]
    }

    const eventProperties = getProperties(
      lexiconStore.eventProperties,
      t('events.eventProperties'),
      PropertyType.Event
    )

    if (lexiconStore.systemProperties?.length) {
      ret.push(systemProperties.value)
    }

    if (eventProperties.items.length) {
      ret.push(eventProperties)
    }

    if (lexiconStore.groupProperties.length) {
      lexiconStore.groups.forEach((item, i) => {
        const properties = getProperties(
          lexiconStore.groupProperties[i],
          item.name,
          PropertyType.Group,
          item.id
        )

        if (properties.items.length) {
          ret.push(properties)
        }
      })
    }

    return ret
  })

  return {
    groupedProperties,
    systemProperties,
  }
}

export default userProperty;