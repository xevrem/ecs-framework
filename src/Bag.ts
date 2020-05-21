export class Bag<T> {
  __data: Array<T> = [];
  __count: number = 0;

  constructor(capacity: number = 16) {
    this.__data = new Array(capacity);
    this.__count = 0;
  }

  get capacity(): number {
    return this.__data.length;
  }

  get isEmpty(): boolean {
    return this.__count === 0;
  }

  get count(): number {
    return this.__count;
  }

  forEach(args: (item: T, index: number, array: Array<T>) => void, context?: Bag<T>): void {
    return this.__data.forEach(args, context);
  }

  map(args: (item: T, index: number, array: Array<T>) => T, context?: Bag<T>): Array<T> {
    return this.__data.map(args, context);
  }

  filter(args: (item: T, index: number, array: Array<T>) => boolean, context?: Bag<T>): Array<T> {
    return this.__data.filter(args, context);
  }

  reduce(args: (acc: any, item: T, index: number, array: Array<T>) => any, init: any): any {
    return this.__data.reduce(args, init);
  }

  get(index: number): T {
    return this.__data[index];
  }

  set(index: number, value: T): T {
    if (index < 0) {
      return null;
    }
    if (index >= this.__data.length) {
      this.grow(index * 2);
    } else if (index >= this.__count) {
      this.__count = index + 1;
    }
    this.__data[index] = value;
    return value;
  }

  add(element: T) {
    if (this.__count >= this.__data.length) {
      this.grow();
    }
    this.__data[this.__count] = element;
    this.__count++;
  }

  addRange(bag: Bag<T>) {
    for (let i = 0; bag.count > i; i++) {
      this.add(bag.get(i));
    }
  }

  clear() {
    this.__data = this.__data.map(_ => undefined);
    this.__count = 0;
  }

  contains(element: T, compare = (a: T, b: T) => a === b): boolean {
    return !!this.__data.find((cur: T) => compare(element, cur));
  }

  remove(element: T): T {
    const index = this.__data.indexOf(element);
    return this.removeAt(index);
  }

  removeAt(index: number): T {
    if (index < this.__data.length && index >= 0) {
      const item = this.__data[index];
      this.__count--;
      this.__data[index] = this.__data[this.__count];
      this.__data[this.__count] = undefined;
      return item;
    } else {
      return null;
    }
  }

  removeLast(): T {
    this.__count--;
    const item = this.__data[this.__count];
    this.__data[this.__count] = undefined;
    return item;
  }

  grow(size: number = 2 * this.__data.length + 1) {
    this.__data = [...this.__data, ...new Array(size - this.__data.length)];
  }
}
