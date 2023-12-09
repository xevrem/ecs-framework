/*eslint no-empty-function: off*/
import { Bag } from './Bag';
import { Component } from './Component';
import ecsRig from './EcsRig';
import { Entity } from './Entity';
import { EntitySystem } from './EntitySystem';
import { Query } from './Query';

describe('EntitySystem', () => {
  class TestComp extends Component {
    foo!: number;
  }

  class TestSystem extends EntitySystem {
    needed = [TestComp];
    initialize(): void {}
    load(_entities: Bag<Entity>): void {}
    created(_entity: Entity): void {}
    deleted(_entity: Entity): void {}
    removed(_entity: Entity): void {}
    added(_entity: Entity): void {}
    cleanUp(_entities: Bag<Entity>): void {}
    reset(): void {
      this.entities.clear();
    }
    begin(): void {}
    end(): void {}
    process(_entity: Entity, _query: Query, _delta: number): void {}
  }

  it('should instantiate without crashing', () => {
    ecsRig((rig) => {
      expect(() =>
        rig.ecs.systemManager.registerSystem(TestSystem, {})
      ).not.toThrow();
    });
  });

  it('should handle initializing', () => {
    ecsRig((rig) => {
      const system = rig.ecs.systemManager.registerSystem(TestSystem, {});
      const spy = jest.spyOn(system, 'initialize');
      rig.ecs.systemManager.initializeSystems();
      expect(spy).toHaveBeenCalled();
    });
  });

  it('should handle loading', () => {
    ecsRig((rig) => {
      const system = rig.ecs.systemManager.registerSystem(TestSystem, {});
      const spy = jest.spyOn(system, 'load');
      rig.ecs.systemManager.loadSystems();
      expect(spy).toHaveBeenCalled();
    });
  });

  it('should handle adding entities', () => {
    ecsRig((rig) => {
      const system = rig.ecs.systemManager.registerSystem(TestSystem, {});
      const spy = jest.spyOn(system, 'created');
      const entity = rig.ecs.createEntity();
      const comp = new TestComp();
      rig.ecs.addComponent(entity, comp);
      rig.ecs.resolveEntities();
      expect(spy).toHaveBeenCalled();
    });
  });

  it('should handle deleting entities', () => {
    ecsRig((rig) => {
      const system = rig.ecs.systemManager.registerSystem(TestSystem, {});
      const spy = jest.spyOn(system, 'deleted');
      const entity = rig.ecs.createEntity();
      const comp = new TestComp();
      rig.ecs.addComponent(entity, comp);
      expect(system.entities.count).toEqual(0);
      rig.ecs.resolveEntities();
      expect(system.entities.count).toEqual(1);
      rig.ecs.deleteEntity(entity);
      rig.ecs.resolveEntities();
      expect(system.entities.count).toEqual(0);
      expect(spy).toHaveBeenCalled();
    });
  });

  it('should handle adding entities', () => {
    ecsRig((rig) => {
      const system = rig.ecs.systemManager.registerSystem(TestSystem, {});
      const spy = jest.spyOn(system, 'added');
      const entity = rig.ecs.createEntity();
      rig.ecs.resolveEntities();
      expect(system.entities.count).toEqual(0);
      const comp = new TestComp();
      rig.ecs.addComponent(entity, comp);
      rig.ecs.resolve(entity);
      rig.ecs.resolveEntities();
      expect(system.entities.count).toEqual(1);
      expect(spy).toHaveBeenCalled();
    });
  });

  it('should handle removing entities', () => {
    ecsRig((rig) => {
      const system = rig.ecs.systemManager.registerSystem(TestSystem, {});
      const spy = jest.spyOn(system, 'removed');
      const entity = rig.ecs.createEntity();
      const comp = new TestComp();
      rig.ecs.addComponent(entity, comp);
      rig.ecs.resolveEntities();
      rig.ecs.removeComponent(comp);
      rig.ecs.resolve(entity);
      rig.ecs.resolveEntities();
      expect(spy).toHaveBeenCalled();
    });
  });

  it('should handle cleaning up', () => {
    ecsRig((rig) => {
      const system = rig.ecs.systemManager.registerSystem(TestSystem, {});
      const spy = jest.spyOn(system, 'cleanUp');
      const entity = rig.ecs.createEntity();
      const comp = new TestComp();
      rig.ecs.addComponent(entity, comp);
      rig.ecs.resolveEntities();
      expect(system.entities.contains(entity)).toBeTruthy();
      rig.ecs.cleanUp();
      expect(spy).toHaveBeenCalled();
      expect(system.entities.contains(entity)).toBeFalsy();
    });
  });

  it('should handle reset', () => {
    ecsRig((rig) => {
      const system = rig.ecs.systemManager.registerSystem(TestSystem, {});
      const spy = jest.spyOn(system, 'reset');
      const entity = rig.ecs.createEntity();
      const comp = new TestComp();
      rig.ecs.addComponent(entity, comp);
      rig.ecs.resolveEntities();
      expect(system.entities.contains(entity)).toBeTruthy();
      rig.ecs.reset();
      expect(spy).toHaveBeenCalled();
      expect(system.entities.contains(entity)).toBeFalsy();
    });
  });

  it('should be able to process', () => {
    ecsRig((rig) => {
      const system = rig.ecs.systemManager.registerSystem(TestSystem, {});
      const entity = rig.ecs.createEntity();
      const comp = new TestComp();
      rig.ecs.addComponent(entity, comp);
      rig.ecs.resolveEntities();
      const spy = jest.spyOn(system, 'process');
      rig.ecs.scheduleSystems();
      rig.ecs.runSystems();
      expect(spy).toHaveBeenCalled();
    });
  });

  it('should call begin and end during processing', () => {
    ecsRig((rig) => {
      const system = rig.ecs.systemManager.registerSystem(TestSystem, {});
      const entity = rig.ecs.createEntity();
      const comp = new TestComp();
      rig.ecs.addComponent(entity, comp);
      rig.ecs.resolveEntities();
      const spy = jest.spyOn(system, 'begin');
      const spy2 = jest.spyOn(system, 'end');
      rig.ecs.scheduleSystems();
      rig.ecs.runSystems();
      expect(spy).toHaveBeenCalled();
      expect(spy2).toHaveBeenCalled();
    });
  });
});
