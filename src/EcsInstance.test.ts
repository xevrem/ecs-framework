import { EcsInstance } from './EcsInstance';
import ecsRig from './EcsRig';

describe('EcsInstance', () => {
  it('should create an ECS instance without crashing', () => {
    expect(() => new EcsInstance()).not.toThrow();
  });

  it('should check for components by entity ID', () => {
    ecsRig((rig) => {
      const Foo = rig.makeComponentType();
      rig.ecs.componentManager.registerComponent(Foo);
      const foo = new Foo();
      const entity = rig.ecs.createEntity();
      expect(rig.ecs.hasComponentById(entity.id, foo.type)).toBeFalsy();
      rig.ecs.addComponent(entity, foo);
      expect(rig.ecs.hasComponentById(entity.id, foo.type)).toBeTruthy();
    });
  });

  it('should check for components by tag', () => {
    ecsRig((rig) => {
      const Foo = rig.makeComponentType();
      rig.ecs.componentManager.registerComponent(Foo);
      const foo = new Foo();
      const entity = rig.ecs.createEntity();
      rig.ecs.addComponent(entity, foo);
      expect(rig.ecs.hasComponentByTag('tag', foo.type)).toBeFalsy();
      rig.ecs.tagManager.tagEntity('tag', entity);
      expect(rig.ecs.hasComponentByTag('tag', foo.type)).toBeTruthy();
    });
  });

  it('should be able to make a component mapper', () => {
    ecsRig((rig) => {
      const Foo = rig.makeComponentType();
      rig.ecs.componentManager.registerComponent(Foo);
      const foo = new Foo();
      const entity = rig.ecs.createEntity();
      rig.ecs.addComponent(entity, foo);
      expect(rig.ecs.hasComponentById(entity.id, foo.type)).toBeTruthy();
      const mapper = rig.ecs.makeMapper(Foo);
      const component = mapper.get(entity);
      expect(component).toEqual(foo);
    });
  });

  it('should be able to delete an entity', () => {
    ecsRig((rig) => {
      const entity = rig.ecs.createEntity();
      expect(rig.ecs.getEntity(entity.id)).toEqual(entity);
      rig.ecs.deleteEntity(entity);
      rig.ecs.resolveEntities();
      expect(rig.ecs.getEntity(entity.id)).not.toEqual(entity);
    });
  });

  it('should be able to resolve all entities', () => {
    ecsRig((rig) => {
      const Foo = rig.makeComponentType();
      rig.ecs.componentManager.registerComponent(Foo);
      const foo = new Foo();
      const entity = rig.ecs.createEntity();
      rig.ecs.addComponent(entity, foo);
      const system = rig.ecs.systemManager.registerSystem(
        rig.makeSystemType({ needed: [Foo] }),
        {}
      );
      rig.ecs.resolve(entity);
      rig.ecs.resolveEntities();
      expect(system.entities.contains(entity)).toBeTruthy();
    });
  });

  it('should be able to update time', () => {
    ecsRig((rig) => {
      const time = performance.now();
      rig.ecs.updateTime(time);
      expect(rig.ecs.delta).not.toEqual(0);
      expect(rig.ecs.elapsed).not.toEqual(0);
      expect(rig.ecs.lastTime).toEqual(time);
    });
  });

  it('should be able to update time by delta', () => {
    ecsRig((rig) => {
      const time = performance.now();
      rig.ecs.updateByDelta(time);
      expect(rig.ecs.delta).toEqual(time);
      expect(rig.ecs.elapsed).not.toEqual(0);
      expect(rig.ecs.lastTime).not.toEqual(0);
    });
  });

  it('should be able to iterate over entity queries with joinAll', () => {
    ecsRig((rig) => {
      const Foo = rig.makeComponentType();
      rig.ecs.componentManager.registerComponent(Foo);
      const Bar = rig.makeComponentType();
      rig.ecs.componentManager.registerComponent(Bar);
      const Baz = rig.makeComponentType();
      rig.ecs.componentManager.registerComponent(Baz);
      const e1 = rig.ecs.createEntity();
      const e2 = rig.ecs.createEntity();
      const e3 = rig.ecs.createEntity();

      rig.ecs.addComponent(e1, new Foo());
      rig.ecs.addComponent(e2, new Foo());
      rig.ecs.addComponent(e3, new Foo());
      rig.ecs.addComponent(e2, new Bar());
      rig.ecs.addComponent(e3, new Baz());
      rig.ecs.resolveEntities();
      let neededCount = 0,
        optionalCount = 0;
      for (const [[foo, bar]] of rig.ecs.joinAll([Foo], [Bar], [Baz])) {
        foo && neededCount++;
        bar && optionalCount++;
      }
      expect(neededCount).toEqual(2);
      expect(optionalCount).toEqual(1);
    });
  });

  it('should be able to iterate over entity queries with join', () => {
    ecsRig((rig) => {
      const Foo = rig.makeComponentType();
      rig.ecs.componentManager.registerComponent(Foo);
      const Bar = rig.makeComponentType();
      rig.ecs.componentManager.registerComponent(Bar);
      const Baz = rig.makeComponentType();
      rig.ecs.componentManager.registerComponent(Baz);
      const e1 = rig.ecs.createEntity();
      const e2 = rig.ecs.createEntity();
      const e3 = rig.ecs.createEntity();

      rig.ecs.addComponent(e1, new Foo());
      rig.ecs.addComponent(e2, new Foo());
      rig.ecs.addComponent(e3, new Foo());
      rig.ecs.addComponent(e2, new Bar());
      rig.ecs.addComponent(e3, new Baz());
      rig.ecs.resolveEntities();
      let neededCount = 0,
        optionalCount = 0;
      for (const [[foo, bar]] of rig.ecs.join(
        [e1, e2, e3],
        [Foo],
        [Bar],
        [Baz]
      )) {
        foo && neededCount++;
        bar && optionalCount++;
      }
      expect(neededCount).toEqual(2);
      expect(optionalCount).toEqual(1);
    });
  });

  it('should be able to retrieve components for entities', () => {
    ecsRig((rig) => {
      const Foo = rig.makeComponentType();
      rig.ecs.componentManager.registerComponent(Foo);
      const Bar = rig.makeComponentType();
      rig.ecs.componentManager.registerComponent(Bar);
      const Baz = rig.makeComponentType();
      rig.ecs.componentManager.registerComponent(Baz);
      const e1 = rig.ecs.createEntity();
      const e2 = rig.ecs.createEntity();

      rig.ecs.addComponent(e1, new Foo());
      rig.ecs.addComponent(e2, new Foo());
      rig.ecs.addComponent(e2, new Bar());
      rig.ecs.resolveEntities();

      let [foo, bar] = rig.ecs.retrieve(e1, [Foo, Bar]);
      expect(foo).toBeDefined();
      expect(bar).not.toBeDefined();
      [foo, bar] = rig.ecs.retrieve(e2, [Foo, Bar]);
      expect(foo).toBeDefined();
      expect(bar).toBeDefined();
    });
  });

  it('should be able to retrieveById components for entities', () => {
    ecsRig((rig) => {
      const Foo = rig.makeComponentType();
      rig.ecs.componentManager.registerComponent(Foo);
      const Bar = rig.makeComponentType();
      rig.ecs.componentManager.registerComponent(Bar);
      const Baz = rig.makeComponentType();
      rig.ecs.componentManager.registerComponent(Baz);
      const e1 = rig.ecs.createEntity();
      const e2 = rig.ecs.createEntity();

      rig.ecs.addComponent(e1, new Foo());
      rig.ecs.addComponent(e2, new Foo());
      rig.ecs.addComponent(e2, new Bar());
      rig.ecs.resolveEntities();

      let [foo, bar] = rig.ecs.retrieveById(e1.id, [Foo, Bar]);
      expect(foo).toBeDefined();
      expect(bar).not.toBeDefined();
      [foo, bar] = rig.ecs.retrieveById(e2.id, [Foo, Bar]);
      expect(foo).toBeDefined();
      expect(bar).toBeDefined();
    });
  });
});
