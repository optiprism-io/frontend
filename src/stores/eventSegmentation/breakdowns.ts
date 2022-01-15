import { defineStore } from "pinia";
import { EventRef } from "@/types/events";

export type BreakdownUserProperty = {
    type: string;
    propertyId: number;
};

export type BreakdownUserCustomProperty = {
    type: string;
    propertyId: number;
};

export type BreakdownEventCommonProperty = {
    type: string;
    propertyId: number;
};

export type BreakdownEventCommonCustomProperty = {
    type: string;
    propertyId: number;
};

export type BreakdownEventProperty = {
    type: string;
    eventRef: EventRef;
    propertyId: number;
};

export type BreakdownEventCustomProperty = {
    type: string;
    eventRef: EventRef;
    propertyId: number;
};

export type BreakdownCohort = {
    type: string;
    cohortId?: number;
};

export const newBreakdownCohort = (cohortId?: number) =>
    <BreakdownCohort>{
        type: "Cohort",
        cohortId: cohortId
    };

export const newBreakdownUserProperty = (propertyId: number) =>
    <BreakdownUserProperty>{
        type: "UserProperty",
        propertyId: propertyId
    };
export const newBreakdownUserCustomProperty = (propertyId: number) =>
    <BreakdownUserCustomProperty>{
        type: "UserCustomProperty",
        propertyId: propertyId
    };

export const newBreakdownEventCommonProperty = (propertyId: number) =>
    <BreakdownEventCommonProperty>{
        type: "EventCommonProperty",
        propertyId: propertyId
    };

export const newBreakdownEventCommonCustomProperty = (propertyId: number) =>
    <BreakdownEventCommonCustomProperty>{
        type: "EventCommonCustomProperty",
        propertyId: propertyId
    };

export const isBreakdownUserProperty = (breakdown: Breakdown) => breakdown.type === "UserProperty";
export const isBreakdownUserCustomProperty = (breakdown: Breakdown) =>
    breakdown.type === "UserCustomProperty";
export const isBreakdownEventCommonProperty = (breakdown: Breakdown) =>
    breakdown.type === "EventCommonProperty";
export const isBreakdownEventCommonCustomProperty = (breakdown: Breakdown) =>
    breakdown.type === "EventCommonCustomProperty";
export const isBreakdownEventProperty = (breakdown: Breakdown) =>
    breakdown.type === "EventEventProperty";
export const isBreakdownEventCustomProperty = (breakdown: Breakdown) =>
    breakdown.type === "EventCustomProperty";
export const isBreakdownCohort = (breakdown: Breakdown) => breakdown.type === "Cohort";

export type BreakdownType =
    | "UserProperty"
    | "UserCustomProperty"
    | "EventCommonProperty"
    | "EventCommonCustomProperty"
    | "EventProperty"
    | "EventCustomProperty"
    | "Cohort";

export type Breakdown =
    | BreakdownUserProperty
    | BreakdownUserCustomProperty
    | BreakdownEventCommonProperty
    | BreakdownEventCommonCustomProperty
    | BreakdownEventProperty
    | BreakdownEventCustomProperty
    | BreakdownCohort;

type Breakdowns = {
    breakdowns: Breakdown[];
};

export const breakdownsStore = defineStore("breakdowns", {
    state: (): Breakdowns => ({ breakdowns: [] }),
    actions: {
        addBreakdown(breakdown: Breakdown): void {
            this.breakdowns.push(breakdown);
        },
        removeBreakdown(idx: number): void {
            this.breakdowns.splice(idx, 1);
        },
        changeBreakdown(idx: number, breakdown: Breakdown): void {
            this.breakdowns[idx] = breakdown;
        }
    }
});
