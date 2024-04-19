import { FunnelResponse } from '@/api'

export default {
  steps: [
    {
      step: 'Product Viewed',
      data: [
        {
          groups: ['0'],
          ts: 1713021771785,
          total: 38,
          conversionRatio: 100.0,
          avgTimeToConvert: 0.0,
          droppedOff: 0,
          dropOffRatio: 0.0,
          timeToConvert: 0,
          timeToConvertFromStart: 0,
        },
      ],
    },
    {
      step: 'Product Added To Cart',
      data: [
        {
          groups: ['0'],
          ts: 1713021771785,
          total: 25,
          conversionRatio: 46.94444444444445,
          avgTimeToConvert: 31166.666666666668,
          droppedOff: 13,
          dropOffRatio: 53.05555555555556,
          timeToConvert: 974000,
          timeToConvertFromStart: 974000,
        },
      ],
    },
    {
      step: 'Order Completed',
      data: [
        {
          groups: ['0'],
          ts: 1713021771785,
          total: 7,
          conversionRatio: 13.888888888888891,
          avgTimeToConvert: 25875.0,
          droppedOff: 18,
          dropOffRatio: 61.111111111111114,
          timeToConvert: 680000,
          timeToConvertFromStart: 964000,
        },
      ],
    },
  ],
} satisfies FunnelResponse
