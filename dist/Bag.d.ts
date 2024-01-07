import { Option } from "onsreo";
export declare class Bag<T> {
    private _data;
    private _length;
    private _count;
    private _last;
    private _invalidated;
    constructor(capacity?: number);
    /**
     * iterator symbol for Bags
     */
    [Symbol.iterator](): {
        next: () => {
            value: T;
            done: boolean;
        };
    };
    iter(): () => {
        next: () => {
            value: T;
            done: boolean;
        };
    };
    /**
     * total number indicies the bag contains
     */
    get capacity(): number;
    /**
     * are there any populated indexes in this bag
     */
    get isEmpty(): boolean;
    /**
     * the furthest populated index in this bag
     */
    get length(): number;
    /**
     * the current count of non-undefined data elements
     */
    get count(): number;
    /**
     * the base data structure of the bag
     */
    get data(): Array<Option<T>>;
    lastIndex(start: number): number;
    /**
     * return the last populated item
     */
    get last(): Option<T>;
    /**
     * return the first item
     */
    get first(): Option<T>;
    /**
     * perform a functional `forEach` operation on this bag
     * @param args args the standard `forEach` arguments
     * @param [context] the optional context to use
     */
    forEach(args: (item: Option<T>, index: number, array: Array<Option<T>>) => void, context?: Bag<T>): void;
    /**
     * perform a functional `map` operation on this bag
     * @param args args the standard `map` arguments
     * @param [context] the optional context to use
     * @returns the results of the `map` operation
     */
    map(args: (item: Option<T>, index: number, array: Array<Option<T>>) => Option<T>, context?: Bag<T>): Array<Option<T>>;
    /**
     * perform a functional `filter` operation on this bag
     * @param args args the standard `filter` arguments
     * @param [context] the optional context to use
     * @returns the results of the `filter` operation
     */
    filter(args: (item: Option<T>, index: number, array: Array<Option<T>>) => boolean, context?: Bag<T>): Array<Option<T>>;
    /**
     * perform a functional `reduce` operation on this bag
     * @param args args the standard `reduce` arguments
     * @param init the optional context to use
     * @returns the results of the `reduce` operation
     */
    reduce<V>(args: (acc: V, item: Option<T>, index: number, array: Array<Option<T>>) => V, init: V): V;
    /**
     * perform a functional `slice` operation on this bag
     * @param start the standard `slice` arguments
     * @param end the optional context to use
     * @returns the results of the `slice` operation
     */
    slice(start?: number, end?: number): Array<Option<T>>;
    some(predicate: (value: Option<T>, index: number, array: Array<Option<T>>) => boolean): boolean;
    /**
     * gets the item at the specified index
     * @param index the index of the item to retrieve
     * @returns the item if found otherwise `undefined`
     */
    get<U extends T>(index: number): Option<U>;
    /**
     * sets the index to the given value. grows the bag if index exceeds capacity.
     * @param index the index to set
     * @param value the value to set
     * @returns a copy of the value if successfully inserted, otherwise `undefined`
     */
    set(index: number, value: Option<T>): Option<T>;
    /**
     * adds the given element to the end of the bags contents
     * @param element the element to add
     */
    add(element: Option<T>): number;
    /**
     * adds the given bag to this one
     * @param bag the bad to add
     */
    addBag(bag: Bag<T>): void;
    /**
     * sets each defined item of the bag into this one
     * @param bag - the bag to set with
     */
    setBag(bag: Bag<T>): void;
    /**
     * clears the contents of the bag
     */
    clear(): void;
    /**
     * checks if an element with the given id is populated
     */
    has(id: number): boolean;
    /**
     * checks if the bag contains the given element
     * @param element the element to check
     * @param [compare] the optional comparator function to use
     * @returns `true` if found, `false` if not
     */
    contains(element: T, compare?: (a: T, b: Option<T>) => boolean): boolean;
    /**
     * check if an element exists within the bag via strict equals
     * @param element the element to check
     * @param fromIndex the optional starting index
     * @returns `true` if found, `false` if not
     */
    includes(element: T, fromIndex?: number): boolean;
    /**
     * removes the specified element from the bag
     * @param element the element to remove
     * @returns the element removed or `undefined` if no element was found
     */
    remove(element: T): Option<T>;
    /**
     * removes the element at the specified index
     * @param index the index for the element to remove
     * @returns the removed element or `undefined` if it was empty or out of bounds
     */
    removeAt(index: number): Option<T>;
    /**
     * remove the element in the last filled position
     * @returns the element if found or `undefined` if not
     */
    removeLast(): Option<T>;
    /**
     * grow the bag to the specified size, so long as it is larger.
     * @param size the size to grow the bag
     */
    grow(size?: number): void;
}
//# sourceMappingURL=Bag.d.ts.map