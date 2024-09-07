import type { FunnelResponseStepsInner, FunnelResponseStepsInnerDataInner } from '@/api'

export type StepKey = keyof FunnelResponseStepsInnerDataInner | keyof FunnelResponseStepsInner
