// export { Bag } from './Bag';
// export { Component } from './Component';
// export { ComponentManager } from './ComponentManager';
// export { ComponentMapper } from './ComponentMapper';
// export { EcsInstance } from './EcsInstance';
// export { Entity } from './Entity';
// export { EntityManager } from './EntityManager';
// export { EntitySystem } from './EntitySystem';
// export { GroupManager } from './GroupManager';
// export { SystemManager } from './SystemManager';
// export { TagManager } from './TagManager';
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
      class Comp extends Component { };
      const cm = new ComponentMapper(new Comp(), new EcsInstance());
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
      class Foo extends EntitySystem {
        initialize(): void {
        }
        preLoadContent(_entities: Bag<Entity>): void {
        }
        removed(entity: Entity): void {
        }
        added(entity: Entity): void {
        }
        updated(entity: Entity): void {
        }
        cleanUp(entities: Bag<Entity>): void {
        }
        begin(): void {
        }
        end(): void {
        }
        process(entity: Entity, delta: number): void {
        }
      }
      const foo = new Foo();
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
  describe('setup', () => {
    it('should...', () => { });
  });
});
