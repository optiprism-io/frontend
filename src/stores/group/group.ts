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
  Value,
} from '@/api'
import type { Period } from '@/hooks/usePeriod'

export const useGroupStore = defineStore('group', () => {
  const { getRequestTime } = usePeriod()
  const projectsStore = useProjectsStore()
  const filterGroupsStore = useFilterGroupsStore()

  const items = ref<Array<GroupRecord>>([])
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

  const setStatePropertyPopup = (value: boolean) => (propertyPopup.value = value)

  const getList = async (noLoading?: boolean) => {
    if (!noLoading) {
      loading.value = true
    }

    try {
      const props: GroupRecordsListRequest = {
        time: timeRequest.value,
        group: group.value,
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

    setStatePropertyPopup,
    getList,
    update,
  }
})
