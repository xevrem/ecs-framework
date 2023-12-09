import ecsRig from './EcsRig';
import EntityManager from './EntityManager';

describe('EntityManager', () => {
  it('should instantiate without crashing', () => {
    expect(() => new EntityManager()).not.toThrow();
  });

  it('should be able to create entities', () => {
    ecsRig((rig) => {
      const entity = rig.ecs.createEntity();
      expect(entity).toBeDefined();
      expect(rig.ecs.getEntity(entity.id)).toBeDefined();
    });
  });

  it('should be able to delete entities', () => {
    ecsRig((rig) => {
      const entity = rig.ecs.createEntity();
      expect(rig.ecs.getEntity(entity.id)).toBeDefined();
      rig.ecs.entityManager.deleteEntity(entity);
      expect(rig.ecs.getEntity(entity.id)).toBeUndefined();
    });
  });

  it('should be able to re-use deleted entity ids', () => {
    ecsRig((rig) => {
      const entity = rig.ecs.createEntity();
      expect(rig.ecs.getEntity(entity.id)).toBeDefined();
      rig.ecs.entityManager.deleteEntity(entity);
      expect(rig.ecs.getEntity(entity.id)).toBeUndefined();
      expect(rig.ecs.entityManager.oldIds).toContain(entity.id);
      const entity2 = rig.ecs.createEntity();
      expect(entity2.id).toEqual(entity.id);
    });
  });

  it('should prevent the double deletion of entities', () => {
    ecsRig((rig) => {
      const entity = rig.ecs.createEntity();
      expect(rig.ecs.getEntity(entity.id)).toBeDefined();
      rig.ecs.entityManager.deleteEntity(entity);
      expect(rig.ecs.getEntity(entity.id)).toBeUndefined();
      expect(rig.ecs.entityManager.oldIds).toContain(entity.id);
      rig.ecs.entityManager.deleteEntity(entity);
      expect(rig.ecs.entityManager.oldIds).toHaveLength(1);
      const entity2 = rig.ecs.createEntity();
      expect(entity2.id).toEqual(entity.id);
      const entity3 = rig.ecs.createEntity();
      expect(entity3.id).not.toEqual(entity.id);
    });
  });

  it('should be able to cleanup', () => {
    ecsRig((rig) => {
      const entity = rig.ecs.createEntity();
      expect(rig.ecs.getEntity(entity.id)).toBeDefined();
      rig.ecs.entityManager.cleanUp();
      expect(rig.ecs.getEntity(entity.id)).toBeUndefined();
    });
  });
});
