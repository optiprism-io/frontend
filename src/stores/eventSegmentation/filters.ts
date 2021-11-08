import {defineStore} from 'pinia'
import * as types from "../../types";
import {OperationId, PropertyRef, Value} from "../../types";
import {Prop} from "vue";

export interface Filter {
    propRef: PropertyRef;
    opId: OperationId;
    values: Value[];
}

type Filters = {
    filters: Filter[]
}

export const filtersStore = defineStore('filters', {
    state: (): Filters => ({filters: []}),
    actions: {
        addFilter(propRef: PropertyRef): void {
            // duplicates check
            if (this.filters.find((filter): boolean => filter.opId === undefined)) {
                return
            }
            this.filters.push(<Filter>{propRef: propRef, opId: OperationId.Eq, values: []});
        },
        removeFilter(idx: number): void {
            this.filters.splice(idx, 1);
        },
        changeFilterProperty(filterIdx: number, propRef: PropertyRef): void {
            this.filters[filterIdx] = <Filter>{
                propRef: propRef,
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