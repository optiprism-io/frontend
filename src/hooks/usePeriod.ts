import { TimeBetweenTypeEnum, TimeFromTypeEnum } from '@/api'
import { formatDateTime } from '@/helpers/getStringDates'
import { useProfileStore } from '@/stores/profile/profile'

import type { TimeBetween, TimeFrom } from '@/api';

export const TimeTypeEnum = {
  Last: 'last',
  Since: 'since',
  Between: 'between',
  Each: 'each'
} as const;

export type TimeTypeEnum = typeof TimeTypeEnum[keyof typeof TimeTypeEnum]

const getDateLast = (controlsPeriod: string | number, count: number) => {
  const lastCount = controlsPeriod === 'calendar' ? count : Number(controlsPeriod)
  const result = new Date()
  result.setDate(result.getDate() - (lastCount - 1))
  return result
}

export const usePeriod = () => {
  const profileStore = useProfileStore()

  const getRequestTime = (
    type: TimeTypeEnum,
    controlsPeriod: string | number,
    from?: string,
    to?: string,
    last?: number
  ): TimeBetween | TimeFrom => {
    switch (type) {
      case TimeTypeEnum.Last:
        return {
          type: TimeBetweenTypeEnum.Between,
          from: formatDateTime(getDateLast(controlsPeriod, last || 0), 0, 0, 0, 0),
          to: formatDateTime(new Date(), 23, 59, 59, 999),
          timezone: profileStore.profile.timezone,
        }
      case TimeTypeEnum.Since:
        return {
          type: TimeFromTypeEnum.From,
          from: from ? formatDateTime(from, 0, 0, 0) : '',
          timezone: profileStore.profile.timezone,
        }
      case TimeTypeEnum.Between:
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
