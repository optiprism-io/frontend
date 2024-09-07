import { computed } from 'vue'

import { useI18n } from 'vue-i18n'

import { PropertyType } from '@/api'
import { useLexiconStore } from '@/stores/lexicon'

import type { Property } from '@/api'
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
        dataType: item.dataType,
      })

      return acc
    }, []),
  }
}

const userProperty = () => {
  const lexiconStore = useLexiconStore()
  const { t } = useI18n()

  const noDataProperties = computed(() => {
    return !lexiconStore.propertiesLength
  })

  const groupedProperties = computed(() => {
    const ret: Group<PropertyItem[]>[] = []

    if (noDataProperties.value) {
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

  const usersProperties = computed<Group<PropertyItem[]> | null>(() => {
    const groupIndex = lexiconStore.groups.findIndex(item => item.name === 'user')
    const group = lexiconStore.groups[groupIndex]

    if (group && lexiconStore.groupProperties.length) {
      return getProperties(
        lexiconStore.groupProperties[groupIndex],
        group.name,
        PropertyType.Group,
        group.id
      )
    }

    return null
  })

  return {
    groupedProperties,
    usersProperties,
  }
}

export default userProperty
