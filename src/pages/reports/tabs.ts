import { pagesMap } from '@/router'
import i18n from '@/utils/i18n'

export const REPORT_TABS = [
  {
    name: i18n.t('events.event_segmentation'),
    value: pagesMap.reportsEventSegmentation.name,
    link: {
      name: pagesMap.reportsEventSegmentation.name,
    },
  },
  {
    name: i18n.t('funnels.funnels'),
    value: pagesMap.funnels.name,
    link: {
      name: pagesMap.funnels.name,
    },
  },
]
