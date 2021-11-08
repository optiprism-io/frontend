import {defineStore} from 'pinia'
import * as types from "../../types";
import {OperationId, PropertyRef, Value} from "../../types";
import {Prop} from "vue";


export enum FilterType {
    UserProperty,
    UserCustomProperty,
    Cohort
}

export interface FilterRef {
    type: FilterType
    id?: number;
}

export interface Filter {
    ref: FilterRef;
    opId: OperationId;
    values: Value[];
}

type Filters = {
    filters: Filter[]
}

export const filtersStore = defineStore('filters', {
    state: (): Filters => ({filters: []}),
    actions: {
        addFilter(ref: FilterRef): void {
            this.filters.push(<Filter>{ref: ref, opId: OperationId.Eq, values: []});
        },
        removeFilter(idx: number): void {
            this.filters.splice(idx, 1);
        },
        changeFilterRef(filterIdx: number, ref: FilterRef): void {
            this.filters[filterIdx] = <Filter>{
                ref: ref,
                opId: types.OperationId.Eq,
                values: []
            };
        },
        changeFilterOperation(filterIdx: number, opId: types.OperationId): void {
            this.filters[filterIdx].opId = opId;
        },
        addFilterValue(filterIdx: number, value: Value): void {
            this.filters[filterIdx].values.push(value);
        },
        removeFilterValue(filterIdx: number, value: Value): void {
            this.filters[filterIdx].values = this.filters[filterIdx].values.filter((v) => {
                return v !== value;
            })
        },
    }
})