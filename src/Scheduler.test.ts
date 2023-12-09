import ecsRig from './EcsRig';
import { Scheduler } from './Scheduler';

describe('Scheduler', () => {
  it('should instantiate without crashing', () => {
    expect(() => new Scheduler()).not.toThrow();
  });

  it('should be able to sort multiple systems', () => {
    ecsRig((rig) => {
      const Foo = rig.makeComponentType();
      const SysA = rig.makeSystemType({
        needed: [Foo],
      });
      const SysB = rig.makeSystemType({
        needed: [Foo],
      });
      const sysA = rig.ecs.systemManager.registerSystem(SysA, {
        priority: 2,
      });
      const sysB = rig.ecs.systemManager.registerSystem(SysB, {
        priority: 1,
        reactive: true,
      });
      rig.ecs.scheduleSystems();
      expect(rig.ecs.scheduler.systems[1]).toEqual(sysB);
      expect(rig.ecs.scheduler.systems[0]).toEqual(sysA);
    });
  });

  it('should be able to run both static and reactive systems', () => {
    ecsRig((rig) => {
      const Foo = rig.makeComponentType();
      const SysA = rig.makeSystemType({
        needed: [Foo],
      });
      const SysB = rig.makeSystemType({
        needed: [Foo],
      });
      const sysA = rig.ecs.systemManager.registerSystem(SysA, {
        priority: 2,
      });
      const sysB = rig.ecs.systemManager.registerSystem(SysB, {
        priority: 1,
        reactive: true,
      });
      rig.ecs.scheduleSystems();
      const entity = rig.ecs.createEntity();
      const foo = new Foo();
      rig.ecs.addComponent(entity, foo);
      rig.ecs.resolve(entity);
      rig.ecs.resolveEntities();
      const spy = jest.spyOn(sysA, 'process');
      const spy2 = jest.spyOn(sysB, 'process');
      rig.ecs.scheduler.runSystems();
      expect(spy).toHaveBeenCalled();
      expect(spy2).toHaveBeenCalled();
      jest.clearAllMocks();
      rig.ecs.resolveEntities();
      rig.ecs.scheduler.runSystems();
      expect(spy).toHaveBeenCalled();
      expect(spy2).not.toHaveBeenCalled();
      jest.clearAllMocks();
      foo.foo = 2;
      rig.ecs.update(foo);
      rig.ecs.resolveEntities();
      rig.ecs.scheduler.runSystems();
      expect(spy).toHaveBeenCalled();
      expect(spy2).toHaveBeenCalled();
      jest.clearAllMocks();
      rig.ecs.resolveEntities();
      rig.ecs.scheduler.runSystems();
      expect(spy).toHaveBeenCalled();
      expect(spy2).not.toHaveBeenCalled();
    });
  });
});
