export enum DataTypeKind {
    String,
    Number,
    Boolean
}

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

export type Value = string | number | boolean;

export const dataTypeKinds: Map<DataType, DataTypeKind> = new Map([
    [DataType.String, DataTypeKind.String],
    [DataType.Float64, DataTypeKind.Number],
    [DataType.Int8, DataTypeKind.Number],
    [DataType.Int16, DataTypeKind.Number],
    [DataType.Int32, DataTypeKind.Number],
    [DataType.Int64, DataTypeKind.Number],
    [DataType.UInt8, DataTypeKind.Number],
    [DataType.UInt16, DataTypeKind.Number],
    [DataType.UInt32, DataTypeKind.Number],
    [DataType.UInt64, DataTypeKind.Number],
    [DataType.Boolean, DataTypeKind.Boolean]
]);

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
};

export enum EventStatus {
    Enabled = "enabled",
    Disabled = "disabled"
}

export type EventRef = {
    type: EventType;
    id: number;
};

export function eventRef(e: Event): EventRef {
    return <EventRef>{ type: EventType.Regular, id: e.id };
}

export function customEventRef(e: CustomEvent): EventRef {
    return <EventRef>{ type: EventType.Custom, id: e.id };
}

export function eventPropertyRef(e: EventProperty): PropertyRef {
    return <PropertyRef>{ type: PropertyType.Event, id: e.id };
}

export function eventCustomPropertyRef(e: EventCustomProperty): PropertyRef {
    return <PropertyRef>{ type: PropertyType.EventCustom, id: e.id };
}

export function userPropertyRef(e: UserProperty): PropertyRef {
    return <PropertyRef>{ type: PropertyType.User, id: e.id };
}

export function userCustomPropertyRef(e: UserCustomProperty): PropertyRef {
    return <PropertyRef>{ type: PropertyType.UserCustom, id: e.id };
}

export interface Cohort {
    id: number;
    name: string;
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
    isSystyem: boolean;
    tags: string[];
    name: string;
    displayName: string;
    description?: string;
    status: EventStatus;
    properties?: number[];
    custom_properties?: number[];
}

export interface EventProperty {
    id: number;
    createdAt: Date;
    updatedAt?: Date;
    createdBy: number;
    updatedBy: number;
    projectId: number;
    events: number[];
    isSystem: boolean;
    isGlobal: boolean;
    tags: string[];
    name: string;
    displayName: string;
    description: string;
    status: EventStatus;
    type: DataType;
    db_col: any;
    isRequired: boolean;
    nullable: boolean;
    isArray: boolean;
    isDictionary: boolean;
    dictionaryType?: DataType;
}

export interface EventCustomProperty {
    id: number;
    createdAt: Date;
    updatedAt?: Date;
    createdBy: number;
    updatedBy: number;
    projectId: number;
    events: number[];
    isSystem: boolean;
    status: EventStatus;
    name: string;
    description: string;
    type: DataType;
    nullable: boolean;
    isArray: boolean;
    tags: string[];
}

export interface UserProperty {
    id: number;
    createdBy: number;
    createdAt: Date;
    updatedAt?: Date;
    updatedBy: number;
    projectId: number;
    isSystem: boolean;
    tags: string[];
    name: string;
    displayName: string;
    description: string;
    status: EventStatus;
    type: DataType;
    db_col?: any;
    nullable: boolean;
    isArray: boolean;
    isDictionary: boolean;
    dictionaryType?: DataType;
}

export interface UserCustomProperty {
    id: number;
    createdBy: number;
    createdAt: Date;
    updatedAt?: Date;
    updatedBy: number;
    projectId: number;
    events: number[];
    isSystem: boolean;
    isGlobal: boolean;
    tags: string[];
    name: string;
    displayName: string;
    description: string;
    status: EventStatus;
    type: DataType;
    db_col?: any;
    isRequired: boolean;
    nullable: boolean;
    isArray: boolean;
    isDictionary: boolean;
    dictionaryType?: DataType;
}

export enum OperationId {
    Eq = "=",
    Neq = "neq",
    Gt = "gt",
    Gte = "gte",
    Lt = "lt",
    Lte = "lte",
    True = "true",
    False = "false",
    Exists = "exists",
    Empty = "empty",
    ArrAll = "arr_all",
    ArrNone = "arr_none",
    Regex = "regex"
}

export interface Operation {
    id: OperationId;
    name: string;
    typeKinds?: DataTypeKind[];
    flags?: OpFlag[];
}

enum OpFlag {
    Null,
    Array
}

// eq, gt,gte,lt,lte,ne,exists,empty, arr_all,arr_none,arr_any,regexp
export const operations: Operation[] = [
    {
        id: OperationId.Eq,
        name: "Equal (=)"
    },
    {
        id: OperationId.Neq,
        name: "Not Equal (!=)"
    },
    {
        id: OperationId.Gt,
        name: "Greater (>)",
        typeKinds: [DataTypeKind.Number]
    },
    {
        id: OperationId.Gte,
        name: "Greater or Equal (>=)",
        typeKinds: [DataTypeKind.Number]
    },
    {
        id: OperationId.Lt,
        name: "Less (<)",
        typeKinds: [DataTypeKind.Number]
    },
    {
        id: OperationId.Lte,
        name: "Less or Equal (<=)",
        typeKinds: [DataTypeKind.Number]
    },
    {
        id: OperationId.True,
        name: "True",
        typeKinds: [DataTypeKind.Boolean]
    },
    {
        id: OperationId.False,
        name: "False",
        typeKinds: [DataTypeKind.Boolean]
    },
    {
        id: OperationId.Exists,
        name: "Exists",
        flags: [OpFlag.Null]
    },
    {
        id: OperationId.Empty,
        name: "Is Empty",
        flags: [OpFlag.Null]
    },
    {
        id: OperationId.ArrAll,
        name: "All in array",
        flags: [OpFlag.Array]
    },
    {
        id: OperationId.ArrNone,
        name: "None in array",
        flags: [OpFlag.Array]
    },
    {
        id: OperationId.Regex,
        name: "Regex",
        typeKinds: [DataTypeKind.String]
    }
];

export const operationById: Map<OperationId, Operation> = new Map();
operations.forEach(op => operationById.set(op.id, op));

export const findOperations = (
    type: DataType,
    nullable: boolean,
    isArray: boolean
): Operation[] => {
    const kind = dataTypeKinds.get(type);
    return operations.filter(op => {
        if (op.typeKinds && !op.typeKinds.find(t => t === kind)) {
            return false;
        }

        if (nullable && op.flags && !op.flags.find(f => f === OpFlag.Null)) {
            return false;
        }

        if (isArray && op.flags && !op.flags.find(f => f === OpFlag.Array)) {
            return false;
        }

        return true;
    });
};

export enum Group {
    User = "user",
    Country = "country"
}

export enum AggregateId {
    Sum = "sum",
    Avg = "avg",
    Median = "median",
    Min = "min",
    Max = "max",
    DistinctCount = "distinctCount",
    PercentileTh25 = "25thPercentile",
    PercentileTh75 = "75thPercentile",
    PercentileTh90 = "90thPercentile",
    PercentileTh99 = "99thPercentile"
}

export interface Aggregate {
    id: AggregateId;
    name: string;
    description?: string;
}

export const aggregates: Aggregate[] = [
    {
        id: AggregateId.Sum,
        name: "Sum"
    },
    {
        id: AggregateId.Avg,
        name: "Average"
    },
    {
        id: AggregateId.Median,
        name: "Median"
    },
    {
        id: AggregateId.Min,
        name: "Minimum"
    },
    {
        id: AggregateId.Max,
        name: "Maximum"
    },
    {
        id: AggregateId.DistinctCount,
        name: "Distinct count"
    },
    {
        id: AggregateId.PercentileTh25,
        name: "25th Percentile"
    },
    {
        id: AggregateId.PercentileTh75,
        name: "75th Percentile"
    },
    {
        id: AggregateId.PercentileTh90,
        name: "90th Percentile"
    },
    {
        id: AggregateId.PercentileTh99,
        name: "99th Percentile"
    },
]

export enum QueryType {
    simple,
    countPerGroup,
    aggregateProperty,
    aggregatePropertyPerGroup,
    formula,
}

export type EventQueryRef = {
    type: QueryType;
    name?: string;
};

export interface EventsQuery {
    type: QueryType;
    name?: string;
    displayName: string;
    hasAggregate?: boolean;
    grouped?: boolean;
}

export const eventsQueries: EventsQuery[] = [
    {
        type: QueryType.simple,
        name: "countEvents",
        displayName: "Count",
    },
    {
        type: QueryType.simple,
        name: "countUnique",
        displayName: "Count Unique",
        grouped: true,
    },
    {
        type: QueryType.simple,
        name: "dailyActive",
        displayName: "Daily Active",
        grouped: true,
    },
    {
        type: QueryType.simple,
        name: "weeklyActive",
        displayName: "Weekly Active",
        grouped: true,
    },
    {
        type: QueryType.simple,
        name: "monthlyActive",
        displayName: "Monthly Active",
        grouped: true,
    },
    {
        type: QueryType.countPerGroup,
        name: "countPer",
        displayName: "Count per",
        grouped: true,
        hasAggregate: true,
    },
]