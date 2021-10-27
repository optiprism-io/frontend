import {numberToPos} from "vite/dist/node/utils";

export enum DataType {
    String,
    Float64,
    Int8,
    Int16,
    Int32,
    Int64,
    UInt8,
    UInt16,
    UInt32,
    UInt64,
    Boolean
}

export enum EventType {
    Regular,
    Custom
}

export enum PropertyType {
    Event,
    EventCustom,
    User,
    UserCustom
}

export type PropertyRef = {
    type: PropertyType;
    id: number;
}

export enum EventStatus {
    Enabled = "enabled",
    Disabled = "disabled",
}

export type EventRef = {
    type: EventType;
    id: number;
}

export function eventRef(e: Event): EventRef {
    return <EventRef>{type: EventType.Regular, id: e.id}
}

export function customEventRef(e: CustomEvent): EventRef {
    return <EventRef>{type: EventType.Custom, id: e.id}
}

export interface CustomEvent {
    id: number;
    createdAt: Date;
    updatedAt?: Date;
    createdBy: number;
    updatedBy: number;
    projectId: number;
    tags: string[];
    name: string;
    description?: string;
    status: EventStatus;
}

export interface Event {
    id: number;
    createdAt: Date;
    updatedAt?: Date;
    createdBy: number;
    updatedBy: number;
    projectId: number;
    tags: string[];
    name: string;
    description?: string;
    status: EventStatus;
    properties?: number[];
}

export interface EventProperty {
    id: number;
    eventId: number;
    createdAt: Date;
    updatedA?: Date;
    createdBy: number;
    updatedBy: number;
    tags: string[];
    name: string;
    type: DataType;
    nullable: boolean;
    is_dictionary: boolean;
    dictionary_type?: DataType;
}

export interface EventCustomProperty {
    id: number;
    eventId: number;
    createdAt: Date;
    updatedA?: Date;
    createdBy: number;
    updatedBy: number;
    tags: string[];
    name: string;
    type: DataType;
    nullable: boolean;
    is_dictionary: boolean;
    dictionary_type?: DataType;
}

export interface UserProperty {
    id: number;
    schema_id: number;
    createdAt: Date;
    updatedAt?: Date;
    createdBy: number;
    updatedBy: number;
    tags: string[];
    name: string;
    type: DataType;
    nullable: boolean;
    is_dictionary: boolean;
    dictionary_type?: DataType;
}

export interface UserCustomProperty {
    id: number;
    schema_id: number;
    createdAt: Date;
    updatedAt?: Date;
    createdBy: number;
    updatedBy: number;
    tags: string[];
    name: string;
    type: DataType;
    nullable: boolean;
    is_dictionary: boolean;
    dictionary_type?: DataType;
}