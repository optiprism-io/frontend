import { FunnelResponse } from '@/api'

export default {
  steps: [
    {
      step: 'created_at',
      data: [
        {
          groups: ['0'],
          ts: 1712775102301,
          total: 29,
          conversionRatio: 91.66666666666667,
          avgTimeToConvert: 0.0,
          droppedOff: 0,
          dropOffRatio: 0.0,
          timeToConvert: 0,
          timeToConvertFromStart: 0,
        },
      ],
    },
    {
      step: 'u_str_4',
      data: [
        {
          groups: ['0'],
          ts: 1712775102301,
          total: 24,
          conversionRatio: 69.44444444444444,
          avgTimeToConvert: 61154.166666666664,
          droppedOff: 4,
          dropOffRatio: 13.888888888888891,
          timeToConvert: 1669000,
          timeToConvertFromStart: 1669000,
        },
      ],
    },
    {
      step: 'u_str_11',
      data: [
        {
          groups: ['0'],
          ts: 1712775102301,
          total: 13,
          conversionRatio: 44.44444444444444,
          avgTimeToConvert: 91250.0,
          droppedOff: 5,
          dropOffRatio: 30.555555555555557,
          timeToConvert: 1696000,
          timeToConvertFromStart: 2432000,
        },
      ],
    },
  ],
} satisfies FunnelResponse
