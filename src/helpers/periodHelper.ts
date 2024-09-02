import dayjs from 'dayjs'

import { TimeBetweenTypeEnum, TimeFromTypeEnum } from '@/api'

import type { TimeBetween, TimeFrom } from '@/api'

export const TimeTypeEnum = {
  Last: 'last',
  Since: 'since',
  Between: 'between',
  Each: 'each',
} as const

export type TimeTypeEnum = (typeof TimeTypeEnum)[keyof typeof TimeTypeEnum]

export function formatDateTime(
  startDate: string | Date,
  hours?: number,
  minutes?: number,
  second?: number,
  ms?: number
) {
  const initialDate = new Date(startDate)
  return new Date(
    Date.UTC(
      initialDate.getFullYear(),
      initialDate.getMonth(),
      initialDate.getDate(),
      hours,
      minutes,
      second,
      ms
    )
  ).toJSON()
}

export const getRequestTime = (
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
      }
    case TimeTypeEnum.Since:
      return {
        type: TimeFromTypeEnum.From,
        from: from ? formatDateTime(from, 0, 0, 0) : '',
      }
    case TimeTypeEnum.Between:
    default:
      return {
        type: TimeBetweenTypeEnum.Between,
        from: from ? formatDateTime(from, 0, 0, 0, 0) : '',
        to: to ? formatDateTime(to, 23, 59, 59, 999) : '',
      }
  }
}

function getDateLast(controlsPeriod: string | number, count: number) {
  const lastCount = controlsPeriod === 'calendar' ? count : Number(controlsPeriod)
  return dayjs().subtract(lastCount - 1, 'day').toDate()
}
