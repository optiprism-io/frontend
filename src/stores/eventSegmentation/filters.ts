import { defineStore } from "pinia";
import { OperationId, Value } from "@/types";

export type FilterRefUserProperty = {
    type: string;
    id: number;
};

export type FilterRefUserCustomProperty = {
    type: string;
    id: number;
};

export type FilterRefCohort = {
    type: string;
};

export type FilterRef = FilterRefUserProperty | FilterRefUserCustomProperty | FilterRefCohort;

export const newFilterCohort = () => {
    return <FilterRefCohort>{ type: "Cohort" };
};

export const newFilterUserProperty = (id: number) => {
    return <FilterRefUserProperty>{ type: "UserProperty", id: id };
};

export const newFilterUserCustomProperty = (id: number) => {
    return <FilterRefUserCustomProperty>{ type: "UserCustomProperty", id: id };
};

export const isFilterUserProperty = (ref: FilterRef): boolean => {
    return ref.type === "UserProperty";
};

export const isFilterUserCustomProperty = (ref: FilterRef): boolean => {
    return ref.type === "UserCustomProperty";
};

export const isFilterCohort = (ref: FilterRef): boolean => {
    return ref.type === "Cohort";
};

export interface Filter {
    ref: FilterRef;
    opId: OperationId;
    values: Value[];
}

type Filters = {
    filters: Filter[];
};

export const filtersStore = defineStore("filters", {
    state: (): Filters => ({ filters: [] }),
    actions: {
        addFilter(ref: FilterRef): void {
            this.filters.push(<Filter>{
                ref: ref,
                opId: OperationId.Eq,
                values: []
            });
        },
        removeFilter(idx: number): void {
            this.filters.splice(idx, 1);
        },
        changeFilterRef(filterIdx: number, ref: FilterRef): void {
            this.filters[filterIdx] = <Filter>{
                ref: ref,
                opId: OperationId.Eq,
                values: []
            };
        },
        changeFilterOperation(filterIdx: number, opId: OperationId): void {
            this.filters[filterIdx].opId = opId;
        },
        addFilterValue(filterIdx: number, value: Value): void {
            this.filters[filterIdx].values.push(value);
        },
        removeFilterValue(filterIdx: number, value: Value): void {
            this.filters[filterIdx].values = this.filters[filterIdx].values.filter(v => {
                return v !== value;
            });
        }
    }
});
