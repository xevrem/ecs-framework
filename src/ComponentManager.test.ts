import { Component } from './Component';
import { ComponentManager } from './ComponentManager';
import { EcsInstance } from './EcsInstance';
import ecsRig from './EcsRig';

describe('ComponentManager', () => {
  it('should initialize without crashing', () => {
    const ecs = new EcsInstance();
    expect(() => new ComponentManager(ecs)).not.toThrow();
  });

  it('should handle registering a component', () => {
    ecsRig((rig) => {
      const Foo = rig.makeComponentType();
      rig.ecs.componentManager.registerComponent(Foo);
      const foo = new Foo();
      expect(foo.type).toEqual(Foo.type);
      expect(Foo.type).not.toEqual(Component.type);
    });
  });

  it('should not change type assignment on re-register', () => {
    ecsRig((rig) => {
      const Foo = rig.makeComponentType();
      rig.ecs.componentManager.registerComponent(Foo);
      const foo = new Foo();
      expect(foo.type).toEqual(Foo.type);
      expect(Foo.type).not.toEqual(Component.type);
      const compType = foo.type;
      rig.ecs.componentManager.registerComponent(Foo);
      expect(foo.type).toEqual(compType);
    });
  });

  it('should handle adding components to entities', () => {
    ecsRig((rig) => {
      const Foo = rig.makeComponentType();
      rig.ecs.componentManager.registerComponent(Foo);
      const foo = new Foo();
      const entity = rig.ecs.createEntity();
      expect(
        rig.ecs.componentManager.getComponent(entity, Foo)
      ).toBeUndefined();
      rig.ecs.componentManager.addComponent(entity, foo);
      const comp = rig.ecs.componentManager.getComponent(entity, Foo);
      expect(comp).toBeDefined();
      expect(comp).toEqual(foo);
    });
  });

  it('should handle removing components from entities', () => {
    ecsRig((rig) => {
      const Foo = rig.makeComponentType();
      rig.ecs.componentManager.registerComponent(Foo);
      const foo = new Foo();
      const entity = rig.ecs.createEntity();
      rig.ecs.componentManager.addComponent(entity, foo);
      expect(rig.ecs.componentManager.getComponent(entity, Foo)).toBeDefined();
      rig.ecs.componentManager.removeComponent(foo);
      expect(
        rig.ecs.componentManager.getComponent(entity, Foo)
      ).toBeUndefined();
    });
  });

  it('should delete components when entity is deleted', () => {
    ecsRig((rig) => {
      const Foo = rig.makeComponentType();
      rig.ecs.componentManager.registerComponent(Foo);
      const foo = new Foo();
      const entity = rig.ecs.createEntity();
      rig.ecs.componentManager.addComponent(entity, foo);
      expect(rig.ecs.componentManager.getComponent(entity, Foo)).toBeDefined();
      rig.ecs.componentManager.deleteEntity(entity);
      expect(
        rig.ecs.componentManager.getComponent(entity, Foo)
      ).toBeUndefined();
    });
  });

  it('should be able to check if an entity has a component', () => {
    ecsRig((rig) => {
      const Foo = rig.makeComponentType();
      rig.ecs.componentManager.registerComponent(Foo);
      const Bar = rig.makeComponentType();
      rig.ecs.componentManager.registerComponent(Bar);
      const foo = new Foo();
      const entity = rig.ecs.createEntity();
      rig.ecs.componentManager.addComponent(entity, foo);
      rig.ecs.tagManager.tagEntity('tag', entity);
      expect(
        rig.ecs.componentManager.hasComponent(entity, foo.type)
      ).toBeTruthy();
      expect(
        rig.ecs.componentManager.hasComponent(entity, Bar.type)
      ).toBeFalsy();
      expect(
        rig.ecs.componentManager.hasComponentById(entity.id, foo.type)
      ).toBeTruthy();
      expect(
        rig.ecs.componentManager.hasComponentById(entity.id, Bar.type)
      ).toBeFalsy();
      expect(rig.ecs.tagManager.getEntityByTag('tag')).toEqual(entity);
      expect(
        rig.ecs.componentManager.hasComponentByTag('tag', foo.type)
      ).toBeTruthy();
    });
  });

  it('should handle cleanup', () => {
    ecsRig((rig) => {
      const Foo = rig.makeComponentType();
      rig.ecs.componentManager.registerComponent(Foo);
      const foo = new Foo();
      const entity = rig.ecs.createEntity();
      rig.ecs.componentManager.addComponent(entity, foo);
      expect(rig.ecs.componentManager.getComponent(entity, Foo)).toBeDefined();
      rig.ecs.componentManager.cleanUp();
      expect(
        rig.ecs.componentManager.getComponent(entity, Foo)
      ).toBeUndefined();
    });
  });
});
