import type { OperationId, Value } from '@/types'
import type { PropertyRef } from '@/types/events'

export interface Filter {
    propRef?: PropertyRef;
    opId: OperationId;
    values: Value[];
    valuesList: Value[]
}

export const OrientationTypeEnum = {
    HORIZONTAL: 'horizontal',
    VERTICAL: 'vertical',
};

export type OrientationEnum = typeof OrientationTypeEnum[keyof typeof OrientationTypeEnum];
