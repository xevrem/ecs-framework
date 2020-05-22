import { Component } from "./Component";

describe('Component', () => {
  class Bar extends Component {  }

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

  describe('extendability', () => {
    class Foo extends Component { };

    beforeEach(() => {
      Component.type = -1;
      Foo.type = -1;
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
      Component.type = 5;
      Foo.type = 3;
      const comp = new Component();
      const foo = new Foo();
      expect(comp.type).toEqual(5);
      expect(foo.type).toEqual(3);
    });
  });

  describe('ownership', ()=> {
    class Foo extends Component { };

    it('should have an owner', ()=>{
      let foo = new Foo();
      expect(foo).not.toBeNull()
    });
  });

});
