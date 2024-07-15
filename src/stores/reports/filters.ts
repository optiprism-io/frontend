import { defineStore } from 'pinia'

import { EventGroupedFiltersGroupsConditionEnum } from '@/api';
import { OperationId } from '@/types'

import type {
  EventGroupedFilters,
  EventGroupedFiltersGroupsInnerFiltersInner,
} from '@/api'
import type { Filter } from '@/types/filters'

export const filterConditions = [EventGroupedFiltersGroupsConditionEnum.And, EventGroupedFiltersGroupsConditionEnum.Or] as const

export interface FilterGroup {
  condition?: EventGroupedFiltersGroupsConditionEnum
  filters: Filter[]
}

type ChangeFilterGroupConditionPayload = {
  index: number
  condition: EventGroupedFiltersGroupsConditionEnum
}

type AddFilterToGroupPayload = {
  index: number
  filter: Filter
}

type RemoveFilterFromGroupPayload = {
  index: number
  filterIndex: number
}

type EditFilterForGroupPayload = {
  index: number
  filterIndex: number
  filter: Partial<Filter>
}

interface FilterGroupsStore {
  condition: EventGroupedFiltersGroupsConditionEnum
  filterGroups: FilterGroup[]
  isFiltersAdvanced: boolean
}

export const useFilterGroupsStore = defineStore('filter-groups', {
  state: (): FilterGroupsStore => ({
    condition: EventGroupedFiltersGroupsConditionEnum.And,
    filterGroups: [
      {
        condition: EventGroupedFiltersGroupsConditionEnum.And,
        filters: [],
      },
    ],
    isFiltersAdvanced: false,
  }),
  actions: {
    setCondition(payload: EventGroupedFiltersGroupsConditionEnum): void {
      this.condition = payload
    },
    addFilterGroup(): void {
      this.filterGroups.push({
        condition: 'and',
        filters: [],
      })
    },
    removeFilterGroup(index: number) {
      this.filterGroups.splice(index, 1)
    },
    changeFilterGroupCondition(payload: ChangeFilterGroupConditionPayload): void {
      this.filterGroups[payload.index].condition = payload.condition
    },
    addFilterToGroup(payload: AddFilterToGroupPayload): void {
      this.filterGroups[payload.index].filters.push(payload.filter)
    },
    removeFilterForGroup(payload: RemoveFilterFromGroupPayload): void {
      this.filterGroups[payload.index].filters.splice(payload.filterIndex, 1)
    },
    editFilterForGroup(payload: EditFilterForGroupPayload): void {
      this.filterGroups[payload.index].filters[payload.filterIndex] = {
        ...this.filterGroups[payload.index].filters[payload.filterIndex],
        ...payload.filter,
      }
    },
  },
  getters: {
    filters(): EventGroupedFilters {
      return {
        groupsCondition: this.condition,
        groups: this.filterGroups.map(group => {
          return {
            filtersCondition: group.condition,
            filters: group.filters.reduce(
              (acc: EventGroupedFiltersGroupsInnerFiltersInner[], filter) => {
                const item = {
                  type: 'property',
                  /* TODO: fix typescript error */
                  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                  // @ts-ignore: Unreachable code error
                  cohortId: 0,
                  groupId: 0,
                  propertyName: filter.propRef?.name || '',
                  propertyType: filter.propRef?.type || 'event',
                  operation: filter.opId,
                  value: filter.values,
                } satisfies EventGroupedFiltersGroupsInnerFiltersInner

                if (filter.propRef?.group || filter.propRef?.group === 0) {
                  item.groupId = filter.propRef.group
                }

                if (filter.opId === OperationId.Empty ||
                  filter.opId === OperationId.Exists ||
                  filter.opId === OperationId.True ||
                  filter.opId === OperationId.False ||
                  filter.values.length
                ) {
                  acc.push(item)
                }

                return acc
              },
              []
            ),
          }
        }),
      }
    },
    isSelectedAnyFilter(): boolean {
      return Boolean(this.filterGroups.length && this.filterGroups[0].filters?.length)
    },
  },
})
