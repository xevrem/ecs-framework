import { Entity } from './Entity';
import { Component } from './Component';
import { ComponentMapper } from './ComponentMapper';
import { EcsInstance } from './EcsInstance';

describe('ComponentMapper', () => {
  let ecs: EcsInstance;
  class Foo extends Component {
    data!: number;
  }

  beforeEach(() => {
    ecs = new EcsInstance();
    ecs.componentManager.registerComponent(Foo);
  });

  it('should be intantiable', () => {
    new ComponentMapper(Foo, ecs);
  });

  it('should be able to retrieve defined components', () => {
    const cm = new ComponentMapper(Foo, ecs);
    const entity = ecs.createEntity();
    const foo = new Foo();
    foo.data = 5;
    ecs.addComponent(entity, foo);
    ecs.resolveEntities();
    const comp = cm.get(entity);
    expect(comp).toBeDefined();
    expect(comp?.data).toEqual(foo.data);
  });

  it('should get undefined components if nothing defined', () => {
    const cm = new ComponentMapper(Foo, ecs);
    expect(cm.get(new Entity())).toBeUndefined();
  });

  it('should statically get components', () => {
    expect(ComponentMapper.get(Foo, new Entity(), ecs)).toBeUndefined();
  });
});
