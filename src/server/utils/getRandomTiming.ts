export function getRandomTiming(from = 0, to = 0) {
  // TODO ADD HEADER SWITCHER OR URL SEARCH PARAMETR LIKE => timingMocks=100-200
  return Math.floor(Math.random() * (to - from)) + from
}
