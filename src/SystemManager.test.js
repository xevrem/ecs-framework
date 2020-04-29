import { EcsInstance } from 'EcsInstance';
import { SystemManager } from 'SystemManager';
import { EntitySystem } from 'EntitySystem';
import { Component } from 'Component';
import { Entity } from 'Entity';

describe('SystemManager', () => {
  it('should instantiate without crashing', () => {
    const manager = new SystemManager(new EcsInstance());
    expect(manager).toBeDefined();
  });

  it('should be able to setSystem', () => {
    const manager = new SystemManager(new EcsInstance());
    const system = new EntitySystem();
    const component = new Component();
    const result = manager.setSystem(system, component);
    expect(result).toEqual(system);
    expect(manager.__systems.includes(system)).toBeTruthy();
    expect(result.componentTypes.includes(component.type)).toBeTruthy();
  });

  it('should initializeSystems', () => {
    const manager = new SystemManager(new EcsInstance());
    const system = new EntitySystem();
    const spy = jest.spyOn(system, 'initialize');
    const component = new Component();
    manager.setSystem(system, component);
    manager.initializeSystems();
    expect(spy).toHaveBeenCalled();
  });

  it('should systemsLoadContent', () => {
    const manager = new SystemManager(new EcsInstance());
    const system = new EntitySystem();
    const spy = jest.spyOn(system, 'loadContent');
    const component = new Component();
    manager.setSystem(system, component);
    manager.systemsLoadContent();
    expect(spy).toHaveBeenCalled();
  });

  describe('integrations', () => {
    it('should resolve entities', () => {
      const ecs = new EcsInstance();
      const system = ecs.systemManager.setSystem(new EntitySystem(), Component);
      const entity = ecs.create();
      ecs.addComponent(entity, new Component());
      ecs.systemManager.resolve(entity);
      expect(system.__entities.count).toEqual(1);
    });

    it('should delete an entity', () => {});

    it('should cleanUp', () => {});
  });
});
