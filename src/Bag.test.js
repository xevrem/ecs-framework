import { Bag } from 'Bag';

describe('Bag', () => {
  it('should instantiate without crashing', () => {
    const bag = new Bag();
    expect(bag).toBeDefined();
  });

  it('should initialize data and count on creation', () => {
    const bag = new Bag();
    expect(bag.__data).toBeDefined();
    expect(bag.__data.length).toEqual(16);
    expect(bag.__count).toBeDefined();
    expect(bag.__count).toEqual(0);
  });

  it('should initialize data to passed capacity', () => {
    const bag = new Bag(32);
    expect(bag.__data.length).toEqual(32);
  });

  it('should support various getters', () => {
    const bag = new Bag();
    expect(bag.capacity).toEqual(bag.__data.length);
    expect(bag.isEmpty).toEqual(bag.__count === 0);
    expect(bag.count).toEqual(bag.__count);
  });

  it('return undefined values by default', () => {
    const bag = new Bag();
    expect(bag.get(5)).toBeUndefined();
  });

  it('should handle forEach', () => {
    const bag = new Bag();
    Array(20)
      .fill(1)
      .forEach(i => bag.add(i));
    expect(bag.count).toEqual(20);
    bag.forEach((foo, i) => {
      i < 20 && expect(typeof foo).toEqual('number');
      i >= 20 && expect(typeof foo).toEqual('undefined');
    });
  });

  it('should set values', () => {});

  it('should increase count when setting a value', () => {});

  it('should decrease count when removing a value', () => {});

  it('should be able to add elements', () => {});

  it('should be able to add bags', () => {});

  it('should remove all values on clear', () => {});

  it('should see if it contains a value', () => {
    const bag = new Bag();
    Array(20).fill(1).map((_,i)=>bag.add(i));
    expect(bag.count).toEqual(20);
    expect(bag.contains(10)).toBeTruthy();
  });

  it('should see if it contains a value with custom compare', () => {
    const bag = new Bag();
    Array(20).fill(1).map((_,i)=>bag.add({id:i}));
    expect(bag.count).toEqual(20);
    expect(bag.contains({id:10}, (a,b)=> b && a.id === b.id)).toBeTruthy();
  });

  it('should be able to remove a specific element', () => {});

  it('should be able to remove an element at an index', () => {});

  it('should be able to remove the last element', () => {});

  it('should be able to grow the bag', () => {});

  it('should be grow the bag after adding an element beyond data length', () => {
    const bag = new Bag(1);
    expect(bag.count).toEqual(0);
    expect(bag.capacity).toEqual(1);
    bag.add({});
    expect(bag.count).toEqual(1);
    expect(bag.capacity).toEqual(1);
    bag.add({});
    expect(bag.count).toEqual(2);
    expect(bag.capacity).toEqual(3);
    bag.add({});
    bag.add({});
    expect(bag.count).toEqual(4);
    expect(bag.capacity).toEqual(7);
  });

  it('should be grow the bag after setting an element beyond data length', () => {});
});
