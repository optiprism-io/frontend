import i18n from '@/utils/i18n'

import type { FunnelResponseStepsInner } from '@/api'
import type { FunnelResponseStepsInnerDataInner } from '@/api'

export type StepKey = keyof FunnelResponseStepsInnerDataInner | keyof FunnelResponseStepsInner

export const FUNNEL_VIEWS = [
  {
    key: 0,
    value: 0,
    nameDisplay: i18n.t('funnels.view.funnelSteps'),
  },
  {
    key: 1,
    value: 1,
    nameDisplay: i18n.t('funnels.view.conversionOverTime'),
  },
  {
    key: 2,
    value: 2,
    nameDisplay: i18n.t('funnels.view.timeToConvert'),
  },
]
