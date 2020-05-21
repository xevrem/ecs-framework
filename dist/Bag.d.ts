export declare class Bag<T> {
    __data: Array<T>;
    __count: number;
    constructor(capacity?: number);
    get capacity(): number;
    get isEmpty(): boolean;
    get count(): number;
    forEach(args: (item: T, index: number, array: Array<T>) => void, context?: Bag<T>): void;
    map(args: (item: T, index: number, array: Array<T>) => T, context?: Bag<T>): Array<T>;
    filter(args: (item: T, index: number, array: Array<T>) => boolean, context?: Bag<T>): Array<T>;
    reduce(args: (acc: any, item: T, index: number, array: Array<T>) => any, init: any): any;
    get(index: number): T;
    set(index: number, value: T): T;
    add(element: T): void;
    addRange(bag: Bag<T>): void;
    clear(): void;
    contains(element: T, compare?: (a: T, b: T) => boolean): boolean;
    remove(element: T): T;
    removeAt(index: number): T;
    removeLast(): T;
    grow(size?: number): void;
}
