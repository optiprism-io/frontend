export interface Item {
    item: any;
    name: string;
    description?: string;
}

export interface Group {
    name: string;
    items: Item[];
}
