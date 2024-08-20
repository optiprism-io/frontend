import { ref } from 'vue'

import { generateUUID } from '@/utils/generateUuid'

export enum AlertTypeEnum {
  Default = 'default',
  Info = 'info',
  Success = 'success',
  Warning = 'warning',
  Danger = 'danger',
}

export type Alert = {
  id: string
  type: AlertTypeEnum
  text: string
  noClose?: boolean
}

const ALERT_TIME = 7000

export function useAlert() {
  const items = ref<Alert[]>([])

  function createAlert(item: Omit<Alert, 'id'>) {
    const alert: Alert = {
      id: generateUUID(),
      type: item.type,
      text: item.text,
    }
    items.value.push(alert)

    setTimeout(() => closeAlert(alert.id), ALERT_TIME)
  }

  function closeAlert(id: string) {
    items.value = items.value.filter(item => item.id !== id)
  }

  return {
    items,

    createAlert,
    closeAlert,
  }
}
