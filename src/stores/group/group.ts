import { ref, reactive, computed } from 'vue'
import { defineStore } from 'pinia'

import { apiClient } from '@/api/apiClient'
import { TimeTypeEnum, usePeriod } from '@/hooks/usePeriod'
import { useProjectsStore } from '@/stores/projects/projects'

import type {
  DataTableResponseColumnsInner,
  EventRecordsListRequestTime,
  GroupRecord,
  Value,
} from '@/api'

export type Group = {
  loading: boolean
  loadingOne: boolean
  controlsPeriod: string | number
  propertyPopup: boolean
  period: {
    from: string
    to: string
    last: number
    type: TimeTypeEnum
  }
  group: number
}

export const useGroupStore = defineStore('group', () => {
  const { getRequestTime } = usePeriod()
  const projectsStore = useProjectsStore()

  const items = ref<Array<GroupRecord>>([])
  const columns = ref<Array<DataTableResponseColumnsInner>>([])
  const loading = ref(false)
  const loadingOne = ref(false)
  const controlsPeriod = ref<string | number>('30')
  const propertyPopup = ref(false)
  const group = ref(0)

  const period = reactive({
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

    try {
      const res = await apiClient.groupRecords.groupRecordsList(projectsStore.projectId, {
        time: timeRequest.value,
        group: group.value,
      })
      columns.value = res?.data?.columns?.length ? res.data.columns : []
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
        properties: properties.value,
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
    isPeriodActive,
    isNoData,
    timeRequest,

    getList,
    update,
  }
})
