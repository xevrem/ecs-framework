import ECS from './index.js';

describe('Library', () => {
  const {
    Bag,
    Component,
    ComponentManager,
    ComponentMapper,
    EcsInstance,
    Entity,
    EntityManager,
    EntitySystem,
    GroupManager,
    SystemManager,
    TagManager
  } = ECS;

  describe('import/instantiation', () => {
    it('Bag should be importable and instantiable', () => {
      const instance = new Bag();
      expect(instance).toBeDefined();
    });
    it('Component should be importable and instantiable', () => {
      const instance = new Component();
      expect(instance).toBeDefined();
    });
    it('ComponentManager should be importable and instantiable', () => {
      const instance = new ComponentManager();
      expect(instance).toBeDefined();
    });
    it('ComponentMapper should be importable and instantiable', () => {
      const instance = new ComponentMapper(new Component(), new EcsInstance());
      expect(instance).toBeDefined();
    });
    it('EcsInstance should be importable and instantiable', () => {
      const instance = new EcsInstance();
      expect(instance).toBeDefined();
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
      const instance = new EntitySystem();
      expect(instance).toBeDefined();
    });
    it('GroupManager should be importable and instantiable', () => {
      const instance = new GroupManager();
      expect(instance).toBeDefined();
    });
    it('SystemManager should be importable and instantiable', () => {
      const instance = new SystemManager();
      expect(instance).toBeDefined();
    });
    it('TagManager should be importable and instantiable', () => {
      const instance = new TagManager();
      expect(instance).toBeDefined();
    });
  });
  describe('setup', () => {
    it('should...', () => {});
  });
});
