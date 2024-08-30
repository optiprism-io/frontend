import { ref, reactive, computed } from 'vue'

import { defineStore } from 'pinia'

import { apiClient } from '@/api/apiClient'
import { TimeTypeEnum, usePeriod } from '@/hooks/usePeriod'
import { useProjectsStore } from '@/stores/projects/projects'
import { useFilterGroupsStore } from '@/stores/reports/filters'

import type {
  DataTableResponseColumnsInner,
  EventGroupedFiltersGroupsInnerFiltersInner,
  EventRecordsListRequestTime,
  GroupRecord,
  GroupRecordsListRequest,
  PropertyRef as PropertyRefApi,
  Value,
} from '@/api'
import type { Period } from '@/hooks/usePeriod'
import type { PropertyRef } from '@/types/events'

export const defaultColumns = ['']

export const useGroupStore = defineStore('group', () => {
  const { getRequestTime } = usePeriod()
  const projectsStore = useProjectsStore()
  const filterGroupsStore = useFilterGroupsStore()

  const items = ref<Array<GroupRecord>>([])
  const activeColumns = ref<PropertyRef[]>([])
  const columns = ref<DataTableResponseColumnsInner[]>([])
  const loading = ref(false)
  const loadingOne = ref(false)
  const controlsPeriod = ref<string | number>('30')
  const propertyPopup = ref(false)
  const group = ref(0)

  const period = reactive<Period>({
    from: '',
    to: '',
    type: TimeTypeEnum.Last,
    last: 30,
  })

  const isPeriodActive = computed(
    () => Boolean(period.from) && Boolean(period.to) && controlsPeriod.value === 'calendar'
  )
  const isNoData = computed(() => !items.value.length && !loading.value)

  const timeRequest = computed<EventRecordsListRequestTime>(() => {
    return getRequestTime(period.type, controlsPeriod.value, period.from, period.to, period.last)
  })

  const getList = async (noLoading?: boolean) => {
    if (!noLoading) {
      loading.value = true
    }

    const properties = activeColumns.value.map(item => {
      const property: PropertyRefApi = {
        propertyName: item?.name || '',
        propertyType: item?.type || '',
      }

      if (item.group || item.group === 0) {
        property.group = item.group
      }

      return property
    })

    try {
      const props: GroupRecordsListRequest = {
        time: timeRequest.value,
        group: group.value,
      }

      if (properties.length) {
        props.properties = properties
      }

      if (filterGroupsStore.isSelectedAnyFilter) {
        const filters = filterGroupsStore.filters.groups[0].filters.reduce(
          (acc: EventGroupedFiltersGroupsInnerFiltersInner[], filter) => {
            if ('value' in filter && filter.value?.length) {
              acc.push(filter)
            }

            return acc
          },
          []
        )

        if (filters.length) {
          props.filters = {
            groupsCondition: 'and',
            groups: [
              {
                filtersCondition: 'and',
                filters,
              },
            ],
          }
        }
      }

      const res = await apiClient.groupRecords.groupRecordsList(projectsStore.projectId, props)
      columns.value = res?.data?.columns?.length ? res.data?.columns : []
    } catch (e) {
      console.error('error update event property')
    }
    if (!noLoading) {
      loading.value = false
    }
  }

  const toggleColumns = (payload: PropertyRef[]) => {
    activeColumns.value = payload
  }

  const update = async (id: number, properties: { [key: string]: Value }, noLoading: boolean) => {
    if (!noLoading) {
      loading.value = true
    }
    try {
      await apiClient.groupRecords.updateGroupRecord(projectsStore.projectId, id, {
        properties: properties,
      })
      await getList(noLoading || true)
    } catch (e) {
      if (!noLoading) {
        loading.value = false
      }
      console.error('error update event property')
    }
  }

  return {
    isPeriodActive,
    items,
    columns,
    loading,
    loadingOne,
    controlsPeriod,
    propertyPopup,
    group,
    period,
    isNoData,
    timeRequest,
    activeColumns,

    toggleColumns,
    getList,
    update,
  }
})
