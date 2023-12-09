import { EcsInstance } from './EcsInstance';
import { SystemManager } from './SystemManager';
import ecsRig from './EcsRig';
import { Bag } from './Bag';
import { RootReducer } from 'types/modules';
import { SmartResolve } from 'types/ecs';

describe('SystemManager', () => {
  it('should instantiate without crashing', () => {
    const manager = new SystemManager(new EcsInstance());
    expect(manager).toBeDefined();
  });

  it('should be able to register systems', () => {
    ecsRig((rig) => {
      const system = rig.ecs.systemManager.registerSystem(
        rig.makeSystemType({
          needed: [],
        }),
        {}
      );
      expect(system).toEqual(system);
      expect(rig.ecs.systemManager.systems.includes(system)).toBeTruthy();
    });
  });

  it('should initializeSystems', () => {
    ecsRig((rig) => {
      const system = rig.ecs.systemManager.registerSystem(
        rig.makeSystemType({ needed: [] }),
        {}
      );
      const spy = jest.spyOn(system, 'initialize');
      rig.ecs.systemManager.initializeSystems();
      expect(spy).toHaveBeenCalled();
    });
  });

  it('should systemsLoadContent', () => {
    ecsRig((rig) => {
      const system = rig.ecs.systemManager.registerSystem(
        rig.makeSystemType({ needed: [] }),
        {}
      );
      const spy = jest.spyOn(system, 'load');
      rig.ecs.systemManager.loadSystems();
      expect(spy).toHaveBeenCalled();
    });
  });

  it('should resolve entities for static systems', () => {
    ecsRig((rig) => {
      const Foo = rig.makeComponentType();
      const system = rig.ecs.systemManager.registerSystem(
        rig.makeSystemType({ needed: [Foo] }),
        {}
      );
      const entity = rig.ecs.createEntity();
      const comp = new Foo();
      rig.ecs.addComponent(entity, comp);
      expect(system.entities.count).toEqual(0);
      rig.ecs.systemManager.createEntity(entity);
      expect(system.entities.count).toEqual(1);
      rig.ecs.removeComponent(comp);
      const resolving = new Bag<SmartResolve>();
      resolving.set(entity.id, [entity, []]);
      rig.ecs.systemManager.resolveEntities(resolving);
      expect(system.entities.count).toEqual(0);
    });
  });

  it("should not resolve entities for components it doesn't want", () => {
    ecsRig((rig) => {
      const Foo = rig.makeComponentType();
      const OtherComp = rig.makeComponentType();
      const system = rig.ecs.systemManager.registerSystem(
        rig.makeSystemType({
          needed: [Foo],
          unwanted: [OtherComp],
        }),
        {}
      );
      const entity = rig.ecs.createEntity();
      const comp = new Foo();
      rig.ecs.addComponent(entity, comp);
      expect(system.entities.count).toEqual(0);
      rig.ecs.systemManager.createEntity(entity);
      expect(system.entities.count).toEqual(1);
      const other = new OtherComp();
      rig.ecs.addComponent(entity, other);
      const resolving = new Bag<SmartResolve>();
      resolving.set(entity.id, [entity, []]);
      rig.ecs.systemManager.resolveEntities(resolving);
      expect(system.entities.count).toEqual(0);
    });
  });

  it('should resolve entities for reactive systems', () => {
    ecsRig((rig) => {
      const Foo = rig.makeComponentType();
      const system = rig.ecs.systemManager.registerSystem(
        rig.makeSystemType({
          needed: [Foo],
        }),
        {
          reactive: true,
        }
      );
      const entity = rig.ecs.createEntity();
      const comp = new Foo();
      rig.ecs.addComponent(entity, comp);
      expect(system.entities.count).toEqual(0);
      rig.ecs.resolveEntities();
      expect(system.entities.count).toEqual(1);
      rig.ecs.scheduleSystems();
      rig.ecs.runSystems({} as RootReducer);
      expect(system.entities.count).toEqual(0);
      rig.ecs.update(comp);
      rig.ecs.resolveEntities();
      expect(system.entities.count).toEqual(1);
    });
  });

  it('should delete an entity', () => {
    ecsRig((rig) => {
      const Foo = rig.makeComponentType();
      const system = rig.ecs.systemManager.registerSystem(
        rig.makeSystemType({
          needed: [Foo],
        }),
        {}
      );
      const entity = rig.ecs.createEntity();
      const comp = new Foo();
      rig.ecs.addComponent(entity, comp);
      expect(system.entities.count).toEqual(0);
      const resolving = new Bag<SmartResolve>();
      resolving.set(entity.id, [entity, []]);
      rig.ecs.systemManager.resolveEntities(resolving);
      expect(system.entities.count).toEqual(1);
      rig.ecs.systemManager.deleteEntity(entity);
      expect(system.entities.count).toEqual(0);
    });
  });

  it('should cleanUp', () => {
    ecsRig((rig) => {
      const Foo = rig.makeComponentType();
      rig.ecs.systemManager.registerSystem(
        rig.makeSystemType({
          needed: [Foo],
        }),
        {}
      );
      expect(rig.ecs.systemManager.systems.length).toEqual(1);
      rig.ecs.systemManager.cleanUp();
      expect(rig.ecs.systemManager.systems.length).toEqual(0);
    });
  });
});
