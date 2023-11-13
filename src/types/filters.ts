import {PropertyRef} from '@/types/events'
import {OperationId, Value} from '@/types'

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
