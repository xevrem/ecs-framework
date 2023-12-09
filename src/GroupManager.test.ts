import ecsRig from './EcsRig';
import { GroupManager } from './GroupManager';

describe('GroupManager', () => {
  it('should instantiate without crashing', () => {
    expect(() => new GroupManager()).not.toThrow();
  });

  it('should be able to add and get groups of entities', () => {
    ecsRig((rig) => {
      const entity = rig.ecs.createEntity();
      const entity2 = rig.ecs.createEntity();
      expect(rig.ecs.groupManager.getGroup('foo')).toBeUndefined();
      rig.ecs.groupManager.addEntityToGroup('foo', entity);
      rig.ecs.groupManager.addEntityToGroup('foo', entity2);
      expect(rig.ecs.groupManager.getGroup('foo')?.count).toEqual(2);
    });
  });

  it('should be able to delete entities', () => {
    ecsRig((rig) => {
      const entity = rig.ecs.createEntity();
      const entity2 = rig.ecs.createEntity();
      rig.ecs.groupManager.addEntityToGroup('foo', entity);
      rig.ecs.groupManager.addEntityToGroup('foo', entity2);
      expect(rig.ecs.groupManager.getGroup('foo')?.count).toEqual(2);
      rig.ecs.groupManager.deleteEntity(entity);
      expect(rig.ecs.groupManager.getGroup('foo')?.count).toEqual(1);
    });
  });

  it('should be able to remove groups', () => {
    ecsRig((rig) => {
      const entity = rig.ecs.createEntity();
      const entity2 = rig.ecs.createEntity();
      rig.ecs.groupManager.addEntityToGroup('foo', entity);
      rig.ecs.groupManager.addEntityToGroup('foo', entity2);
      expect(rig.ecs.groupManager.getGroup('foo')?.count).toEqual(2);
      rig.ecs.groupManager.removeGroup('foo');
      expect(rig.ecs.groupManager.getGroup('foo')).toBeUndefined();
    });
  });

  it('should be able to cleanUp', () => {
    ecsRig((rig) => {
      const entity = rig.ecs.createEntity();
      const entity2 = rig.ecs.createEntity();
      rig.ecs.groupManager.addEntityToGroup('foo', entity);
      rig.ecs.groupManager.addEntityToGroup('bar', entity2);
      expect(rig.ecs.groupManager.getGroup('foo')?.count).toEqual(1);
      expect(rig.ecs.groupManager.getGroup('bar')?.count).toEqual(1);
      rig.ecs.groupManager.cleanUp();
      expect(rig.ecs.groupManager.getGroup('foo')).toBeUndefined();
      expect(rig.ecs.groupManager.getGroup('bar')).toBeUndefined();
    });
  });
});
