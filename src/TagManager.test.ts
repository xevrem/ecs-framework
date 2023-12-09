import ecsRig from './EcsRig';
import { TagManager } from './TagManager';

describe('TagManager', () => {
  it('should instantiate without crashing', () => {
    expect(() => new TagManager()).not.toThrow();
  });

  it('should should be able to tag and get an entity', () => {
    ecsRig((rig) => {
      const entity = rig.ecs.createEntity();
      rig.ecs.tagManager.tagEntity('foo', entity);
      expect(rig.ecs.tagManager.getEntityByTag('foo')).toEqual(entity);
    });
  });

  it('should be able to delete an entity', () => {
    ecsRig((rig) => {
      const entity = rig.ecs.createEntity();
      rig.ecs.tagManager.tagEntity('foo', entity);
      expect(rig.ecs.tagManager.getEntityByTag('foo')).toEqual(entity);
      rig.ecs.tagManager.deleteEntity(entity);
      expect(rig.ecs.tagManager.getEntityByTag('foo')).toBeUndefined();
    });
  });

  it('should be able to remove a tag', () => {
    ecsRig((rig) => {
      const entity = rig.ecs.createEntity();
      rig.ecs.tagManager.tagEntity('foo', entity);
      expect(rig.ecs.tagManager.getEntityByTag('foo')).toEqual(entity);
      rig.ecs.tagManager.removeTag('foo');
      expect(rig.ecs.tagManager.getEntityByTag('foo')).toBeUndefined();
    });
  });

  it('should be able to cleanup', () => {
    ecsRig((rig) => {
      const entity = rig.ecs.createEntity();
      rig.ecs.tagManager.tagEntity('foo', entity);
      expect(rig.ecs.tagManager.getEntityByTag('foo')).toEqual(entity);
      rig.ecs.tagManager.cleanUp();
      expect(rig.ecs.tagManager.getEntityByTag('foo')).toBeUndefined();
    });
  });
});
