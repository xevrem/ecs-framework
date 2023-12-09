import ecsRig from './EcsRig';
import { Query } from './Query';

describe('Query', () => {
  it('should instantiate without crashing', () => {
    ecsRig((rig) => {
      const Foo = rig.makeComponentType();
      expect(
        () =>
          new Query({
            ecsInstance: rig.ecs,
            needed: [Foo],
          })
      ).not.toThrow();
    });
  });

  it('should be able to test validity by id', () => {
    ecsRig((rig) => {
      const Foo = rig.makeComponentType();
      rig.ecs.componentManager.registerComponent(Foo);
      const entity = rig.ecs.createEntity();
      const foo = new Foo();
      rig.ecs.addComponent(entity, foo);
      const query = new Query({
        ecsInstance: rig.ecs,
        needed: [Foo],
      });
      expect(query.isValidById(entity.id)).toBeTruthy();
    });
  });

  it('should be able to test invalidity by id', () => {
    ecsRig((rig) => {
      const Foo = rig.makeComponentType();
      const Bar = rig.makeComponentType();
      rig.ecs.componentManager.registerComponent(Foo);
      rig.ecs.componentManager.registerComponent(Bar);
      const entity = rig.ecs.createEntity();
      const foo = new Foo();
      const bar = new Bar();
      rig.ecs.addComponent(entity, foo);
      rig.ecs.addComponent(entity, bar);
      const query = new Query({
        ecsInstance: rig.ecs,
        needed: [Foo],
        unwanted: [Bar],
      });
      expect(query.isInvalidById(entity.id)).toBeTruthy();
    });
  });

  it('should be able to validateById', () => {
    ecsRig((rig) => {
      const Foo = rig.makeComponentType();
      const Bar = rig.makeComponentType();
      rig.ecs.componentManager.registerComponent(Foo);
      rig.ecs.componentManager.registerComponent(Bar);
      const entity = rig.ecs.createEntity();
      const foo = new Foo();
      rig.ecs.addComponent(entity, foo);
      const query = new Query({
        ecsInstance: rig.ecs,
        needed: [Foo],
        unwanted: [Bar],
      });
      expect(query.validateById(entity.id)).toBeTruthy();
      const bar = new Bar();
      rig.ecs.addComponent(entity, bar);
      expect(query.validateById(entity.id)).toBeFalsy();
    });
  });

  it('should be able to get components', () => {
    ecsRig((rig) => {
      const Foo = rig.makeComponentType();
      const Bar = rig.makeComponentType();
      rig.ecs.componentManager.registerComponent(Foo);
      rig.ecs.componentManager.registerComponent(Bar);
      const entity = rig.ecs.createEntity();
      const foo = new Foo();
      const bar = new Bar();
      rig.ecs.addComponent(entity, foo);
      rig.ecs.addComponent(entity, bar);
      const query = new Query({
        ecsInstance: rig.ecs,
        needed: [Foo],
      });
      query.entity = entity;
      expect(query.get(Foo)).toEqual(foo);
    });
  });
});
