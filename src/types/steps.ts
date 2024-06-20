import type { EventRef } from '@/types/events'
import type { Filter } from '@/types/filters'

export interface Step {
    events: {
        event: EventRef
        filters: Filter[]
    }[]
}
