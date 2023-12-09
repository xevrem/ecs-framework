import { Bag } from './Bag';

describe('Bag', () => {
  it('should instantiate without crashing', () => {
    const bag = new Bag<number>();
    expect(bag).toBeDefined();
  });

  it('should initialize data and count on creation', () => {
    const bag = new Bag<number>();
    expect(bag.data).toBeDefined();
    expect(bag.data.length).toEqual(16);
    expect(bag.length).toBeDefined();
    expect(bag.length).toEqual(0);
  });

  it('should initialize data to passed capacity', () => {
    const bag = new Bag<number>(32);
    expect(bag.data.length).toEqual(32);
  });

  it('should support various getters', () => {
    const bag = new Bag<number>();
    expect(bag.capacity).toEqual(bag.data.length);
    expect(bag.isEmpty).toEqual(bag.length === 0);
    expect(bag.length).toEqual(bag.reduce((acc, d) => (d ? acc++ : acc), 0));
  });

  it('return undefined values by default', () => {
    const bag = new Bag<number>();
    expect(bag.get(5)).toBeUndefined();
  });

  it('should handle forEach', () => {
    expect.assertions(21);
    const bag = new Bag<number>();
    Array(20)
      .fill(1)
      .forEach((i) => bag.add(i));
    expect(bag.length).toEqual(20);
    bag.forEach((foo, i) => {
      i < 20 && expect(typeof foo).toEqual('number');
      i >= 20 && expect(typeof foo).toEqual('undefined');
    });
  });

  it('should handle map', () => {
    expect.assertions(24);
    const bag = new Bag<number>();
    Array(20)
      .fill(1)
      .forEach((i) => bag.add(i));
    expect(bag.length).toEqual(20);
    expect(bag.capacity).toEqual(33);
    const bar = bag.map((foo, i) => {
      i < 20 && expect(typeof foo).toEqual('number');
      i >= 20 && expect(typeof foo).toEqual('undefined');
      return foo;
    });
    expect(bar).toBeDefined();
    expect(bar.length).toEqual(33);
  });

  it('should handle filter', () => {
    expect.assertions(3);
    const bag = new Bag<number>();
    Array(20)
      .fill(1)
      .forEach((i) => bag.add(i));
    expect(bag.length).toEqual(20);
    const bar = bag.filter((_, i) => i < 20);
    expect(bar).toBeDefined();
    expect(bar.length).toEqual(20);
  });

  it('should handle reduce', () => {
    expect.assertions(2);
    const bag = new Bag<number>();
    Array(20)
      .fill(1)
      .forEach((i) => bag.add(i));
    expect(bag.length).toEqual(20);
    const bar = bag.reduce((acc, item, i) => (item ? acc + i + item : acc), 0);
    expect(bar).toEqual(210);
  });

  it('should set values', () => {
    const bag = new Bag<number>();
    bag.set(2, 42);
    expect(bag.get(2)).toEqual(42);
  });

  it('should increase length when setting a value', () => {
    const bag = new Bag<number>();
    expect(bag.length).toEqual(0);
    bag.set(2, 42);
    expect(bag.length).toEqual(3);
  });

  it('should decrease length when removing a value', () => {
    const bag = new Bag<number>();
    expect(bag.length).toEqual(0);
    bag.set(2, 42);
    expect(bag.length).toEqual(3);
  });

  it('should be able to add elements', () => {
    const bag = new Bag<number>();
    expect(bag.length).toEqual(0);
    expect(bag.get(0)).toBeUndefined();
    bag.add(42);
    expect(bag.get(0)).toEqual(42);
  });

  it('should be able to add bags to bags', () => {
    const bag = new Bag<number>();
    const bag2 = new Bag<number>();
    Array(20)
      .fill(1)
      .map((i) => bag2.add(i));
    expect(bag.length).toEqual(0);
    expect(bag.capacity).toEqual(16);
    bag.addBag(bag2);
    expect(bag.length).toEqual(bag2.length);
    expect(bag.capacity).toEqual(33);
  });

  it('should remove all values on clear', () => {
    const bag = new Bag<number>();
    Array(20)
      .fill(1)
      .map((i) => bag.add(i));
    expect(bag.length).toEqual(20);
    bag.clear();
    expect(bag.length).toEqual(0);
  });

  it('should see if it contains a value', () => {
    const bag = new Bag<number>();
    Array(20)
      .fill(1)
      .map((_, i) => bag.add(i));
    expect(bag.length).toEqual(20);
    expect(bag.contains(10)).toBeTruthy();
  });

  it('should see if it contains a value with custom compare', () => {
    const bag = new Bag<{ [id: string]: number }>();
    Array(20)
      .fill(1)
      .map((_, i) => bag.add({ id: i }));
    expect(bag.length).toEqual(20);
    expect(
      bag.contains({ id: 10 }, (a, b) => (a && b ? a.id === b.id : false))
    ).toBeTruthy();
  });

  it('should be able to remove a specific element', () => {
    const bag = new Bag<{ [id: string]: number }>();
    const elems = Array(20)
      .fill(1)
      .map((_, i) => {
        const elem = { id: i };
        bag.add(elem);
        return elem;
      });
    expect(bag.get(5)).toEqual(elems[5]);
    expect(bag.count).toEqual(20);
    const removed = bag.remove(elems[5]);
    expect(removed).toEqual(elems[5]);
    expect(bag.get(5)).not.toEqual(elems[5]);
    expect(bag.count).toEqual(19);
    expect(bag.contains(elems[5])).toBeFalsy();
  });

  it('should be able to remove an element at an index', () => {
    const bag = new Bag<{ [id: string]: number }>();
    const elems = Array(20)
      .fill(1)
      .map((_, i) => {
        const elem = { id: i };
        bag.add(elem);
        return elem;
      });
    expect(bag.get(5)).toEqual(elems[5]);
    expect(bag.length).toEqual(20);
    expect(bag.count).toEqual(20);
    const removed = bag.removeAt(5);
    expect(removed).toEqual(elems[5]);
    expect(bag.get(5)).not.toEqual(elems[5]);
    expect(bag.length).toEqual(20);
    expect(bag.count).toEqual(19);
    expect(bag.contains(elems[5])).toBeFalsy();
  });

  it('should be able to remove the last element', () => {
    const bag = new Bag<{ [id: string]: number }>();
    const elems = Array(20)
      .fill(1)
      .map((_, i) => {
        const elem = { id: i };
        bag.add(elem);
        return elem;
      });
    expect(bag.get(5)).toEqual(elems[5]);
    expect(bag.length).toEqual(20);
    expect(bag.get(bag.length - 1)).toEqual(elems[19]);
    const removed = bag.removeLast();
    expect(removed).toEqual(elems[19]);
    expect(bag.get(bag.length - 1)).not.toEqual(elems[19]);
    expect(bag.get(bag.length - 1)).toEqual(elems[18]);
  });

  it('should be able to grow the bag', () => {
    const bag = new Bag<number>(16);
    expect(bag.capacity).toEqual(16);
    bag.grow(32);
    expect(bag.capacity).toEqual(32);
  });

  it('should be grow the bag after adding an element beyond data length', () => {
    const bag = new Bag<object>(1);
    expect(bag.length).toEqual(0);
    expect(bag.capacity).toEqual(1);
    bag.add({});
    expect(bag.length).toEqual(1);
    expect(bag.capacity).toEqual(1);
    bag.add({});
    expect(bag.length).toEqual(2);
    expect(bag.capacity).toEqual(3);
    bag.add({});
    bag.add({});
    expect(bag.length).toEqual(4);
    expect(bag.capacity).toEqual(7);
  });

  it('should be grow the bag after setting an element beyond capacity', () => {
    const bag = new Bag<number>(16);
    expect(bag.capacity).toEqual(16);
    bag.set(bag.capacity + 5, 42);
    expect(bag.capacity).toEqual(2 * (16 + 5));
    expect(bag.get(21)).toEqual(42);
  });
});
