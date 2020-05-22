import { EcsInstance } from './EcsInstance';
import { EntitySystem } from './EntitySystem';
import { Component } from './Component';
import { SystemManager } from './SystemManager';

describe('SystemManager', () => {
  let instance: EcsInstance, system: EntitySystem, component: Component;

  class Comp extends Component {
  }

  class Sys extends EntitySystem {
  }

  beforeEach(() => {
    instance = new EcsInstance();
    system = new Sys();
    component = new Comp();
  })

  it('should instantiate without crashing', () => {
    const manager = new SystemManager(new EcsInstance());
    expect(manager).toBeDefined();
  });

  it('should be able to setSystem', () => {
    const manager = new SystemManager(instance);
    const result = manager.setSystem(system, Comp);
    expect(result).toEqual(system);
    expect(manager.systems.includes(system)).toBeTruthy();
    expect(result.componentTypes.includes(component.type)).toBeTruthy();
  });

  it('should initializeSystems', () => {
    const manager = new SystemManager(new EcsInstance());
    const spy = jest.spyOn(system, 'initialize');
    manager.setSystem(system, Comp);
    manager.initializeSystems();
    expect(spy).toHaveBeenCalled();
  });

  it('should systemsLoadContent', () => {
    const manager = new SystemManager(new EcsInstance());
    const spy = jest.spyOn(system, 'loadContent');
    manager.setSystem(system, Comp);
    manager.systemsLoadContent();
    expect(spy).toHaveBeenCalled();
  });

  describe('integrations', () => {
    it('should resolve entities', () => {
      const ecs = new EcsInstance();
      system = ecs.systemManager.setSystem(new Sys(), Comp);
      const entity = ecs.create();
      ecs.addComponent(entity, new Comp());
      ecs.systemManager.resolve(entity);
      expect(system.entities.count).toEqual(1);
    });

    it('should delete an entity', () => { });

    it('should cleanUp', () => { });
  });
});
