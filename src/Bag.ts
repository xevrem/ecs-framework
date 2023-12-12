import { Option } from "./types";

export class Bag<T> {
  private _data: Array<Option<T>> = [];
  private _length = 0;
  private _count = 0;
  private _last = -1;
  private _invalidated = true;

  constructor(capacity = 16) {
    this._data = new Array<Option<T>>(capacity);
    this._length = 0;
  }

  /**
   * iterator symbol for Bags
   */
  [Symbol.iterator]() {
    let i = 0;
    const next = (): { value: T; done: boolean } => {
      const value = this._data[i++];
      return value
        ? {
            value,
            done: i >= this._length,
          }
        : next();
    };
    return {
      next,
    };
  }

  iter() {
    return this[Symbol.iterator];
  }

  /**
   * total number indicies the bag contains
   */
  get capacity(): number {
    return this._data.length;
  }

  /**
   * are there any populated indexes in this bag
   */
  get isEmpty(): boolean {
    return this._length === 0;
  }

  /**
   * the furthest populated index in this bag
   */
  get length(): number {
    return this._length;
  }

  /**
   * the current count of non-undefined data elements
   */
  get count(): number {
    return this._count;
  }

  /**
   * the base data structure of the bag
   */
  get data(): Array<Option<T>> {
    return this._data;
  }

  lastIndex(start: number): number {
    if (this._last !== -1 && !this._invalidated) return this._last;
    for (let i = start; i--; ) {
      if (this._data[i]) {
        this._last = i;
        this._invalidated = false;
        return i;
      }
    }
    return -1;
  }

  /**
   * return the last populated item
   */
  get last(): Option<T> {
    return this._data[this.lastIndex(this._data.length)];
  }

  /**
   * return the first item
   */
  get first(): Option<T> {
    const size = this._data.length;
    for (let i = 0; i < size; i++) {
      const item = this.get(i);
      if (item) return item;
    }
    return undefined;
  }

  /**
   * perform a functional `forEach` operation on this bag
   * @param args args the standard `forEach` arguments
   * @param [context] the optional context to use
   */
  forEach(
    args: (item: Option<T>, index: number, array: Array<Option<T>>) => void,
    context?: Bag<T>
  ): void {
    return this._data.forEach(args, context);
  }

  /**
   * perform a functional `map` operation on this bag
   * @param args args the standard `map` arguments
   * @param [context] the optional context to use
   * @returns the results of the `map` operation
   */
  map(
    args: (
      item: Option<T>,
      index: number,
      array: Array<Option<T>>
    ) => Option<T>,
    context?: Bag<T>
  ): Array<Option<T>> {
    return this._data.map(args, context);
  }

  /**
   * perform a functional `filter` operation on this bag
   * @param args args the standard `filter` arguments
   * @param [context] the optional context to use
   * @returns the results of the `filter` operation
   */
  filter(
    args: (item: Option<T>, index: number, array: Array<Option<T>>) => boolean,
    context?: Bag<T>
  ): Array<Option<T>> {
    return this._data.filter(args, context);
  }

  /**
   * perform a functional `reduce` operation on this bag
   * @param args args the standard `reduce` arguments
   * @param init the optional context to use
   * @returns the results of the `reduce` operation
   */
  reduce<V>(
    args: (
      acc: V,
      item: Option<T>,
      index: number,
      array: Array<Option<T>>
    ) => V,
    init: V
  ): V {
    return this._data.reduce(args, init);
  }

  /**
   * perform a functional `slice` operation on this bag
   * @param start the standard `slice` arguments
   * @param end the optional context to use
   * @returns the results of the `slice` operation
   */
  slice(start?: number, end?: number): Array<Option<T>> {
    return this._data.slice(start, end);
  }

  some(
    predicate: (
      value: Option<T>,
      index: number,
      array: Array<Option<T>>
    ) => boolean
  ): boolean {
    return this._data.some(predicate);
  }

  /**
   * gets the item at the specified index
   * @param index the index of the item to retrieve
   * @returns the item if found otherwise `undefined`
   */
  get<U extends T>(index: number): Option<U> {
    return this._data[index] as U;
  }

  /**
   * sets the index to the given value. grows the bag if index exceeds capacity.
   * @param index the index to set
   * @param value the value to set
   * @returns a copy of the value if successfully inserted, otherwise `undefined`
   */
  set(index: number, value: Option<T>): Option<T> {
    if (index < 0) {
      return undefined;
    }
    if (index >= this._data.length) {
      this.grow(index * 2);
    }
    // IF we are setting a valid value larger than the current index
    // THEN update our length
    if (index >= this._length && value) {
      this._length = index + 1;
    } else if (
      // IF we already are the furthest item
      index === this._length - 1 &&
      // AND we're unassignining it
      !value
    ) {
      // THEN get the furthest index lower than ours
      const last = this.lastIndex(index);
      if (last === index) {
        // throw an error if for whatever reason we get our index as the last
        // even though we are "unset"-ing ourself
        throw new Error('Last Index Invalid');
      } else {
        this._length = last + 1;
      }
    }

    if (!this._data[index] && value) this._count += 1;
    if (this._data[index] && !value) this._count -= 1;
    if (index > this._last) this._last = index;
    this._data[index] = value;
    return value;
  }

  /**
   * adds the given element to the end of the bags contents
   * @param element the element to add
   */
  add(element: Option<T>): number {
    if (this._length >= this._data.length) {
      this.grow();
    }
    const index = this._length;
    this._data[this._length] = element;
    this._length++;
    this._count += 1;
    if (index > this._last) this._last = index;
    return index;
  }

  /**
   * adds the given bag to this one
   * @param bag the bad to add
   */
  addBag(bag: Bag<T>): void {
    for (let i = 0; bag.length > i; i++) {
      this.add(bag.get(i));
    }
  }

  /**
   * sets each defined item of the bag into this one
   * @param bag - the bag to set with
   */
  setBag(bag: Bag<T>): void {
    for (let i = bag.length; i--; ) {
      const item = bag.get(i);
      // only set the item if it exists
      item && this.set(i, item);
    }
    this._invalidated = true;
  }

  /**
   * clears the contents of the bag
   */
  clear(): void {
    this._data = new Array(this._data.length);
    this._length = 0;
    this._count = 0;
  }

  /**
   * checks if an element with the given id is populated
   */
  has(id: number): boolean {
    if (id < 0 || id > this._length) return false;
    return !!this._data[id];
  }

  /**
   * checks if the bag contains the given element
   * @param element the element to check
   * @param [compare] the optional comparator function to use
   * @returns `true` if found, `false` if not
   */
  contains(element: T, compare = (a: T, b: Option<T>) => a === b): boolean {
    for (let i = this._length; i--; ) {
      if (compare(element, this._data[i])) return true;
    }
    return false;
  }

  /**
   * check if an element exists within the bag via strict equals
   * @param element the element to check
   * @param fromIndex the optional starting index
   * @returns `true` if found, `false` if not
   */
  includes(element: T, fromIndex = 0): boolean {
    return this._data.includes(element, fromIndex);
  }

  /**
   * removes the specified element from the bag
   * @param element the element to remove
   * @returns the element removed or `undefined` if no element was found
   */
  remove(element: T): Option<T> {
    const index = this._data.indexOf(element);
    if (index === this._last) this._invalidated = true;
    return this.removeAt(index);
  }

  /**
   * removes the element at the specified index
   * @param index the index for the element to remove
   * @returns the removed element or `undefined` if it was empty or out of bounds
   */
  removeAt(index: number): Option<T> {
    if (index < this._data.length && index >= 0) {
      const item = this._data[index];
      this.set(index, undefined);
      if (this._length < 0) this._length = 0;
      return item;
    } else {
      return undefined;
    }
  }

  /**
   * remove the element in the last filled position
   * @returns the element if found or `undefined` if not
   */
  removeLast(): Option<T> {
    const index = this._length - 1;
    const item = this._data[index];
    this.set(index, undefined);
    if (this._length < 0) this._length = 0;
    this._invalidated = true;
    return item;
  }

  /**
   * grow the bag to the specified size, so long as it is larger.
   * @param size the size to grow the bag
   */
  grow(size: number = 2 * this._data.length + 1): void {
    if (size <= this._data.length) return;
    this._data = this._data.concat(
      new Array<Option<T>>(size - this._data.length)
    );
  }
}
