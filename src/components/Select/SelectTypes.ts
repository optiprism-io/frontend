export interface Item {
    item: any;
    name: string;
    description?: string;
    disabled?: boolean | undefined;
}

export interface Group {
    name: string;
    items: Item[];
}
