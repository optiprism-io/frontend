import { i18n } from '@/plugins/i18n'
import { pagesMap } from '@/router'

export const REPORT_TABS = [
  {
    name: i18n.global.t('events.event_segmentation'),
    value: pagesMap.reportsEventSegmentation.name,
    link: {
      name: pagesMap.reportsEventSegmentation.name,
    },
  },
  {
    name: i18n.global.t('funnels.funnels'),
    value: pagesMap.funnels.name,
    link: {
      name: pagesMap.funnels.name,
    },
  },
]
