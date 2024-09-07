import dayjslib from 'dayjs'
import isToday from 'dayjs/plugin/isToday'
import isYesterday from 'dayjs/plugin/isYesterday'

dayjslib.extend(isToday)
dayjslib.extend(isYesterday)

export const dayjs = dayjslib
