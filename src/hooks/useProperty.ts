import { computed } from 'vue'
import { PropertyType, Property } from '@/api'
import { PropertyRef } from '@/types/events'
import { Group, Item } from '@/components/Select/SelectTypes'
import { useLexiconStore } from '@/stores/lexicon'
import usei18n from '@/hooks/useI18n'

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

export const useProperty = () => {
  const lexiconStore = useLexiconStore()
  const { t } = usei18n()

  const noDataPropertyes = computed(() => {
    return !lexiconStore.propertiesLength
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

    const systemProperties = getProperties(
      lexiconStore.systemProperties,
      t('events.systemProperties'),
      PropertyType.System
    )

    const eventProperties = getProperties(
      lexiconStore.eventProperties,
      t('events.eventProperties'),
      PropertyType.Event
    )

    if (systemProperties.items.length) {
      ret.push(systemProperties)
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
  }
}
