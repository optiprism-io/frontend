import i18n from '@/utils/i18n'
import type { FunnelResponseStepsInnerDataInner } from '@/api'
import { FunnelResponseStepsInner } from '@/api'

export type StepKey = keyof FunnelResponseStepsInnerDataInner | keyof FunnelResponseStepsInner

interface FunnelCol {
  title: string
  value: StepKey
}

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

export const FUNNEL_COLUMNS: FunnelCol[] = [
  {
    title: 'Step',
    value: 'step',
  },
  {
    title: 'Total',
    value: 'total',
  },
  {
    title: 'Conversion Ratio',
    value: 'conversionRatio',
  },
  {
    title: 'Dropped Off',
    value: 'droppedOff',
  },
  {
    title: 'Drop Off Ratio',
    value: 'dropOffRatio',
  },
] as const
