import type { ApplyPayload, Each } from '@/components/uikit/UiCalendar/UiCalendar'
import type { OperationId, Value } from '@/types'
import type { EventRef, PropertyRef } from '@/types/events'

export type Ids = {
    idx: number
    idxParent: number
}

type FilterIds = Ids & {
    idxFilter: number
}

export interface ChangeFilterPropertyCondition extends FilterIds {
    propRef: PropertyRef
}

export interface ChangeEventCondition extends Ids {
    ref: EventRef
}

export type RemoveFilterCondition = FilterIds

export interface ChangeFilterOperation extends FilterIds {
    opId: OperationId
}

export interface FilterValueCondition extends FilterIds {
    value: Value
}

export interface PeriodConditionPayload extends Ids {
    value: ApplyPayload
}

export interface PayloadChangeAggregateCondition extends Ids {
    value: {
        id: string
        name: string
    }
}

export interface PayloadChangeValueItem extends Ids {
    value: string | number
}

export interface PayloadChangeEach extends Ids {
    value: Each
}
