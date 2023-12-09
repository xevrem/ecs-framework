import { Bag } from './Bag';
import { ComponentManager } from './ComponentManager';
import { ComponentMapper } from './ComponentMapper';
import { EcsInstance } from './EcsInstance';
import { Entity } from './Entity';
import { EntitySystem } from './EntitySystem';
import { GroupManager } from './GroupManager';
import { SystemManager } from './SystemManager';
import { TagManager } from './TagManager';
import { Component } from './Component';
import { EntityManager } from './EntityManager';

describe('Library', () => {
  describe('import/instantiation', () => {
    it('Bag should be importable and instantiable', () => {
      const instance = new Bag();
      expect(instance).toBeDefined();
    });
    it('EcsInstance should be importable and instantiable', () => {
      const instance = new EcsInstance();
      expect(instance).toBeDefined();
    });
    it('ComponentManager should be importable and instantiable', () => {
      const cm = new ComponentManager(new EcsInstance());
      expect(cm).toBeDefined();
    });
    it('ComponentMapper should be importable and instantiable', () => {
      class Comp extends Component {}
      const cm = new ComponentMapper(Comp, new EcsInstance());
      expect(cm).toBeDefined();
    });
    it('Entity should be importable and instantiable', () => {
      const instance = new Entity();
      expect(instance).toBeDefined();
    });
    it('EntityManager should be importable and instantiable', () => {
      const instance = new EntityManager();
      expect(instance).toBeDefined();
    });
    it('EntitySystem should be importable and instantiable', () => {
      const ecs = new EcsInstance();
      class Foo extends EntitySystem {}
      const foo = new Foo({ id: 1, priority: 1, ecsInstance: ecs });
      expect(foo).toBeDefined();
    });
    it('GroupManager should be importable and instantiable', () => {
      const instance = new GroupManager();
      expect(instance).toBeDefined();
    });
    it('SystemManager should be importable and instantiable', () => {
      const instance = new SystemManager(new EcsInstance());
      expect(instance).toBeDefined();
    });
    it('TagManager should be importable and instantiable', () => {
      const instance = new TagManager();
      expect(instance).toBeDefined();
    });
  });
});
