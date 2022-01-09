export interface Item {
    item: any;
    name: string;
    description?: string;
    disabled?: boolean | undefined;
    items?: Item[];
}

export interface Group {
    name: string;
    items: Item[];
}
