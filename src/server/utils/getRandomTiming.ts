import { getRandomValue } from '@/utils/getRandomValue'

export function getRandomTiming(from = 0, to = 0) {
  // TODO ADD HEADER SWITCHER OR URL SEARCH PARAMETR LIKE => timingMocks=100-200
  return getRandomValue(from, to)
}
