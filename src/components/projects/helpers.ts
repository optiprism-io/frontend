import i18n from '@/utils/i18n'

type TimeoutTuple = [number, Period]

export const SECONDS_IN_MINUTE = 60
const MINUTES_IN_HOUR = 60
export const SECONDS_IN_HOUR = SECONDS_IN_MINUTE * MINUTES_IN_HOUR

export const enum Period {
  MINUTES = 'minutes',
  HOURS = 'hours',
}

export const sessionPeriodOptions = [
  {
    value: Period.MINUTES,
    key: Period.MINUTES,
    nameDisplay: i18n.t('common.timeUnits.minute'),
  },
  {
    value: Period.HOURS,
    key: Period.HOURS,
    nameDisplay: i18n.t('common.timeUnits.hour'),
  },
]

export function fromSessionTimeout(timeoutSeconds: number): TimeoutTuple {
  if (timeoutSeconds % SECONDS_IN_HOUR === 0) {
    const timeout = timeoutSeconds / SECONDS_IN_HOUR
    return [timeout, Period.HOURS]
  }

  const timeout = Math.floor(timeoutSeconds / SECONDS_IN_MINUTE)
  return [timeout, Period.MINUTES]
}

export function toSessionTimeout([timeout, period]: TimeoutTuple): number {
  if (period === Period.MINUTES) return timeout * SECONDS_IN_MINUTE
  return timeout * SECONDS_IN_HOUR
}