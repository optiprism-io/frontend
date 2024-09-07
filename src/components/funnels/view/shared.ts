import type { FunnelQueryStepsInner } from '@/api'
import type { ExcludedEvent } from '@/stores/funnels/steps'
import type { FilterGroup } from '@/stores/reports/filters'

export const MIN_COUNT_FOR_REQUEST = 2

export function hasEmptyFilterValuesInSteps(steps: FunnelQueryStepsInner[]): boolean {
  return steps.some(step =>
    step.events.some(event => event.filters.some(filter => !filter.value?.length))
  )
}

export function hasEmptyFilterValuesInFilters(filters: FilterGroup[]): boolean {
  return filters.some(filter => filter.filters.some(filter => !filter.values.length))
}

export function hasEmptyFilterValuesInExcludes(excludes: ExcludedEvent[]): boolean {
  return excludes.some(exclude => exclude.filters.some(filter => !filter.values.length))
}
