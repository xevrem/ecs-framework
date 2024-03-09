import { is_some } from 'onsreo';
import { ecsRig } from './EcsRig';

describe('FuncQuery', () => {
  it('should handle running Functional Systems', () => {
    ecsRig(rig => {
      const Foo = rig.makeComponentType();
      const Bar = rig.makeComponentType<string>();

      rig.ecs.withSystem([[Foo], [Bar]], ({ query }) => {
        for (const [[foo, bar], _entity] of query.join()) {
          foo.data = 42;
          if (is_some(bar)) {
            bar.data = 'oh hi';
          }
        }
      });
      const _ent = rig.ecs.create().add(new Foo()).tag('foo').build();

      rig.init();
      rig.update();

      const foo = rig.ecs.getComponentByTag('foo', Foo);
      expect(foo).toBeDefined();
      expect(rig.ecs.hasComponentByTag('foo', Bar)).toBeFalsy();
      if (is_some(foo)) {
        expect(foo.data).toEqual(42);
      } else {
        throw new Error();
      }
    });
  });

  it('should handle running Functional Add Systems', () => {
    ecsRig(rig => {
      const Foo = rig.makeComponentType();
      const Bar = rig.makeComponentType<string>();

      rig.ecs.withAddSystem([[Foo, Bar]], ({ query }) => {
        for (const [[foo, bar], _entity] of query.join()) {
          foo.data = 42;
          bar.data = 'world';
        }
      });
      const entity = rig.ecs
        .create()
        .addWith(() => {
          const foo = new Foo();
          foo.data = 24;
          return foo;
        })
        .tag('foo')
        .build();

      rig.init();
      rig.update();

      expect(rig.ecs.hasComponentByTag('foo', Foo)).toBeTruthy();
      expect(rig.ecs.getComponentByTag('foo', Foo)?.data).toEqual(24);
      expect(rig.ecs.hasComponentByTag('foo', Bar)).toBeFalsy();
      let bar = new Bar();
      bar.data = 'hello';
      rig.ecs.addComponent(entity, bar);
      rig.ecs.resolve(entity);
      rig.update();
      expect(rig.ecs.getComponentByTag('foo', Foo)?.data).toEqual(42);
      expect(rig.ecs.hasComponentByTag('foo', Bar)).toBeTruthy();
      expect(rig.ecs.getComponentByTag('foo', Bar)?.data).toEqual('world');
    });
  });

  it('should handle running Functional Create Systems', () => {
    ecsRig(rig => {
      const Foo = rig.makeComponentType();
      rig.ecs.withCreateSystem([[Foo]], ({ query }) => {
        for (const [[foo], _entity] of query.join()) {
          foo.data = 42;
        }
      });
      rig.ecs.create().add(new Foo(24)).tag('foo').build();

      rig.init();
      rig.update();

      expect(rig.ecs.hasComponentByTag('foo', Foo)).toBeTruthy();
      // since this was created early, it wont run on this entity
      // so data should be 24
      expect(rig.ecs.getComponentByTag('foo', Foo)?.data).toEqual(24);
      // create a new entity
      rig.ecs.create().add(new Foo(34)).tag('bar').build();
      rig.update();
      // foo should still be 24
      expect(rig.ecs.getComponentByTag('foo', Foo)?.data).toEqual(24);
      // but bar should be 42
      expect(rig.ecs.getComponentByTag('bar', Foo)?.data).toEqual(42);
    });
  });

  it('should handle running Functional Delete Systems', () => {
    ecsRig(rig => {
      const Foo = rig.makeComponentType();
      let deleted = false;
      rig.ecs.withDeleteSystem([[Foo]], ({ query }) => {
        // delete systems should run over entities instead of join
        // as the join would not return anything
        for (const _entity of query.onEntities()) {
          deleted = true;
        }
      });

      rig.init();
      const entity = rig.ecs.create().add(new Foo(24)).tag('foo').build();
      rig.update();

      expect(rig.ecs.hasComponentByTag('foo', Foo)).toBeTruthy();
      expect(rig.ecs.getComponentByTag('foo', Foo)?.data).toEqual(24);
      expect(deleted).toBeFalsy();
      // now delete the entity
      rig.ecs.deleteEntity(entity);
      rig.update();
      // foo should be undefined
      expect(rig.ecs.getComponentByTag('foo', Foo)?.data).toBeUndefined();
      // and deleted should be true
      expect(deleted).toBeTruthy();
    });
  });

  it('should handle running Functional Update Systems', () => {
    ecsRig(rig => {
      const Foo = rig.makeComponentType();
      rig.ecs.withUpdateSystem([[Foo]], ({ query }) => {
        // delete systems should run over entities instead of join
        // as the join would not return anything
        for (const [[foo], _entity] of query.join()) {
          foo.data = 42;
        }
      });

      const entity = rig.ecs.create().add(new Foo(24)).tag('foo').build();

      rig.init();
      rig.update();

      expect(rig.ecs.hasComponentByTag('foo', Foo)).toBeTruthy();
      expect(rig.ecs.getComponentByTag('foo', Foo)?.data).toEqual(24);
      rig.update();
      rig.update();
      rig.update();
      // should still be 24
      expect(rig.ecs.getComponentByTag('foo', Foo)?.data).toEqual(24);
      // now update the entity
      rig.ecs.updateByEntity(entity);
      rig.update();
      // now should equal 42
      expect(rig.ecs.getComponentByTag('foo', Foo)?.data).toEqual(42);
    });
  });
});
