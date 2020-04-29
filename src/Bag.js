export class Bag {
  __data = [];
  __count = 0;

  constructor(capacity = 16) {
    this.__data = new Array(capacity);
    this.__count = 0;
  }

  get capacity() {
    return this.__data.length;
  }

  get isEmpty() {
    return this.__count === 0;
  }

  get count() {
    return this.__count;
  }

  forEach(...args) {
    return this.__data.forEach(...args);
  }

  map(...args) {
    return this.__data.map(...args);
  }

  filter(...args) {
    return this.__data.filter(...args);
  }

  reduce(...args) {
    return this.__data.reduce(...args);
  }

  get(index) {
    return this.__data[index];
  }

  set(index, value) {
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

  add(element) {
    if (this.__count >= this.__data.length) {
      this.grow();
    }
    this.__data[this.__count] = element;
    this.__count++;
  }

  addRange(bag) {
    for (let i = 0; bag.length > i; i++) {
      this.add(bag.get(i));
    }
  }

  clear() {
    this.__data = this.__data.map(_ => undefined);
    this.__count = 0;
  }

  contains(element, compare = (a, b) => a === b) {
    return !!this.__data.find(cur => compare(element, cur));
  }

  remove(element) {
    const index = this.__data.indexOf(element);
    return this.removeAt(index);
  }

  removeAt(index) {
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

  removeLast() {
    this.__count--;
    const item = this.__data[this.__count];
    this.__data[this.__count] = undefined;
    return item;
  }

  grow(size = 2 * this.__data.length + 1) {
    this.__data = [...this.__data, ...new Array(size - this.__data.length)];
  }
}
