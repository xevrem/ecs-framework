import { Component } from './Component';
import { EcsInstance } from './EcsInstance';

describe('Component', () => {
  class Bar extends Component {
    foo = 1;
    bar = 'baz';
  }

  it('should instantiate without crashing', () => {
    const component = new Bar();
    expect(component).toBeDefined();
  });

  it('should have a type value of -1 by default', () => {
    const component = new Bar();
    expect(component.type).toBeDefined();
    expect(component.type).toEqual(-1);
  });

  it('should have a static type value by default', () => {
    expect(Bar.type).toBeDefined();
    expect(Bar.type).toEqual(-1);
  });

  it('should allow the type value to be set', () => {
    Bar.type = 5;
    expect(Bar.type).toEqual(5);
  });

  it('should show set component value in instances too', () => {
    const component = new Bar();
    Bar.type = 5;
    expect(component.type).toEqual(5);
  });

  it('should be able to get data fields', () => {
    const component = new Bar();
    expect(component.foo).toEqual(1);
    expect(component.bar).toEqual('baz');
  });

  describe('extendability', () => {
    class Foo extends Component {
      foo = 42;
    }
    class Bar extends Component {
      bar = 'baz';
    }

    beforeEach(() => {
      Component.type = -1;
      Foo.type = -1;
      Bar.type = -1;
    });

    it('should be extendable', () => {
      const foo = new Foo();
      expect(foo).toBeDefined();
    });

    it('should have -1 as default type', () => {
      expect(Foo.type).toEqual(-1);
    });

    it('should have different types from Component', () => {
      Component.type = 5;
      expect(Foo.type).not.toEqual(5);
    });

    it('should have different instance types from Component', () => {
      Bar.type = 5;
      Foo.type = 3;
      const bar = new Bar();
      const foo = new Foo();
      expect(bar.type).toEqual(5);
      expect(bar.type).not.toEqual(Component.type);
      expect(foo.type).toEqual(3);
      expect(foo.type).not.toEqual(Component.type);
    });

    it('should have different data', () => {
      const bar = new Bar();
      const foo = new Foo();
      expect(bar.bar).toBeDefined();
      expect(foo).not.toHaveProperty('bar');
      expect(foo.foo).toBeDefined();
      expect(bar).not.toHaveProperty('foo');
    });
  });

  describe('ownership', () => {
    class Foo extends Component {}

    it('should have an owner', () => {
      const foo = new Foo();
      expect(foo.owner).not.toBeNull();
    });
  });
});
