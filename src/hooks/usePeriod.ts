import { useProfileStore } from '@/stores/profile/profile'
import { formatDateTime } from '@/helpers/getStringDates'
import { TimeBetweenTypeEnum, TimeFromTypeEnum, TimeBetween, TimeFrom } from '@/api'

const getDateLast = (controlsPeriod: string | number, count: number) => {
  const lastCount = controlsPeriod === 'calendar' ? count : Number(controlsPeriod)
  const result = new Date()
  result.setDate(result.getDate() - lastCount)
  return result
}

export const usePeriod = () => {
  const profileStore = useProfileStore()

  const getRequestTime = (
    type: string,
    controlsPeriod: string | number,
    from?: string,
    to?: string,
    last?: number
  ): TimeBetween | TimeFrom => {
    switch (type) {
      case 'last':
        return {
          type: TimeBetweenTypeEnum.Between,
          from: formatDateTime(getDateLast(controlsPeriod, last || 0), 0, 0, 0, 0),
          to: formatDateTime(new Date(), 23, 59, 59, 999),
          timezone: profileStore.profile.timezone,
        }
      case 'since':
        return {
          type: TimeFromTypeEnum.From,
          from: from ? formatDateTime(from, 0, 0, 0) : '',
          timezone: profileStore.profile.timezone,
        }
      case 'between':
      default:
        return {
          type: TimeBetweenTypeEnum.Between,
          from: from ? formatDateTime(from, 0, 0, 0, 0) : '',
          to: to ? formatDateTime(to, 23, 59, 59, 999) : '',
          timezone: profileStore.profile.timezone,
        }
    }
  }

  return {
    getRequestTime,
  }
}
