import type { FunnelResponse } from '@/api'

export default {
  groups: ['Country', 'City'],
  steps: [
    {
      step: 'Product Viewed',
      data: [
        {
          groups: ['Spain', 'Barcelona'],
          ts: 1713528506195,
          total: 10,
          conversionRatio: 100.0,
          avgTimeToConvert: 0.0,
          droppedOff: 0,
          dropOffRatio: 0.0,
          timeToConvert: 0,
          timeToConvertFromStart: 0,
          avgTimeToConvertFromStart: 0,
        },
        {
          groups: ['Spain', 'Madrid'],
          ts: 1713528506195,
          total: 10,
          conversionRatio: 100.0,
          avgTimeToConvert: 0.0,
          droppedOff: 0,
          dropOffRatio: 0.0,
          timeToConvert: 0,
          timeToConvertFromStart: 0,
          avgTimeToConvertFromStart: 0,
        },
        {
          groups: ['USA', 'New York'],
          ts: 1713528506195,
          total: 10,
          conversionRatio: 100.0,
          avgTimeToConvert: 0.0,
          droppedOff: 0,
          dropOffRatio: 0.0,
          timeToConvert: 0,
          timeToConvertFromStart: 0,
          avgTimeToConvertFromStart: 0,
        },
        {
          groups: ['USA', 'Los Angeles'],
          ts: 1713528506195,
          total: 10,
          conversionRatio: 100.0,
          avgTimeToConvert: 0.0,
          droppedOff: 0,
          dropOffRatio: 0.0,
          timeToConvert: 0,
          timeToConvertFromStart: 0,
          avgTimeToConvertFromStart: 0,
        },
      ],
    },
    {
      step: 'Product Added To Cart',
      data: [
        {
          groups: ['Spain', 'Barcelona'],
          ts: 1713528506195,
          total: 5,
          conversionRatio: 50.0,
          avgTimeToConvert: 142000.0,
          droppedOff: 5,
          dropOffRatio: 50.0,
          timeToConvert: 142000,
          timeToConvertFromStart: 142000,
          avgTimeToConvertFromStart: 0,
        },
        {
          groups: ['Spain', 'Madrid'],
          ts: 1713528506195,
          total: 8,
          conversionRatio: 80.0,
          avgTimeToConvert: 142000.0,
          droppedOff: 2,
          dropOffRatio: 20.0,
          timeToConvert: 142000,
          timeToConvertFromStart: 142000,
          avgTimeToConvertFromStart: 0,
        },
        {
          groups: ['USA', 'New York'],
          ts: 1713528506195,
          total: 4,
          conversionRatio: 40.0,
          avgTimeToConvert: 142000.0,
          droppedOff: 6,
          dropOffRatio: 60.0,
          timeToConvert: 142000,
          timeToConvertFromStart: 142000,
          avgTimeToConvertFromStart: 0,
        },
        {
          groups: ['USA', 'Los Angeles'],
          ts: 1713528506195,
          total: 2,
          conversionRatio: 20.0,
          avgTimeToConvert: 26000.0,
          droppedOff: 8,
          dropOffRatio: 80.0,
          timeToConvert: 52000,
          timeToConvertFromStart: 52000,
          avgTimeToConvertFromStart: 0,
        },
      ],
    },
    {
      step: 'Order Completed',
      data: [
        {
          groups: ['Spain', 'Barcelona'],
          ts: 1713528506195,
          total: 5,
          conversionRatio: 100.0,
          avgTimeToConvert: 26000.0,
          droppedOff: 0,
          dropOffRatio: 0.0,
          timeToConvert: 142000,
          timeToConvertFromStart: 142000,
          avgTimeToConvertFromStart: 0,
        },
        {
          groups: ['Spain', 'Madrid'],
          ts: 1713528506195,
          total: 1,
          conversionRatio: 12.5,
          avgTimeToConvert: 661000.0,
          droppedOff: 7,
          dropOffRatio: 87.5,
          timeToConvert: 661000,
          timeToConvertFromStart: 803000,
          avgTimeToConvertFromStart: 0,
        },
        {
          groups: ['USA', 'New York'],
          ts: 1713528506195,
          total: 2,
          conversionRatio: 25.0,
          avgTimeToConvert: 142000.0,
          droppedOff: 6,
          dropOffRatio: 75.0,
          timeToConvert: 142000,
          timeToConvertFromStart: 142000,
          avgTimeToConvertFromStart: 0,
        },
        {
          groups: ['USA', 'Los Angeles'],
          ts: 1713528506195,
          total: 1,
          conversionRatio: 50.0,
          avgTimeToConvert: 133000.0,
          droppedOff: 1,
          dropOffRatio: 50.0,
          timeToConvert: 266000,
          timeToConvertFromStart: 318000,
          avgTimeToConvertFromStart: 0,
        },
      ],
    },
  ],
} satisfies FunnelResponse
