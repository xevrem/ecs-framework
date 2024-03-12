import { is_ok } from 'onsreo';
import ecsRig from './EcsRig';
import { proxify } from './Proxify';
import { Component } from './Component';

describe('Proxify', () => {
  it('proxify should cause auto-updates on property set', () => {
    ecsRig(rig => {
      const Foo = rig.makeComponentType();
      const Bar = rig.makeComponentType<{ a: { b: { c: number } } }>();
      rig.init();
      rig.update();

      const ignoredProps: (keyof Component)[] = ['type', 'owner'];

      const entity = rig.ecs
        .create()
        .add(proxify(new Foo(), rig.ecs, ignoredProps))
        .addWith(() => {
          const bar = new Bar();
          bar.data = { a: { b: { c: 0 } } };
          return proxify(bar, rig.ecs, ignoredProps);
        })
        .tag('foo')
        .build();

      rig.update();

      expect(rig.ecs.updating.count).toEqual(0);

      const foo = rig.getComponent(entity, Foo);
      foo.data = 344;
      expect(rig.ecs.updating.count).toEqual(1);
      const bar = rig.getComponent(entity, Bar);
      bar.data.a.b.c = 42;
      // only one entity is updating
      expect(rig.ecs.updating.count).toEqual(1);
      // but two components should be updating
      if (is_ok(entity)) {
        expect(rig.ecs.updating.first?.count).toEqual(2);
        expect(rig.ecs.updating.first?.get(foo.type)).toContainEqual(foo);
        expect(rig.ecs.updating.first?.get(bar.type)).toContainEqual(bar);
      }

      // updat should of course reset
      rig.update();
      expect(rig.ecs.updating.count).toEqual(0);
    }, 7);
  });

  it('proxify should cause auto-updates on property set when entity builder set to autoUpdate', () => {
    ecsRig(rig => {
      const Foo = rig.makeComponentType();
      const Bar = rig.makeComponentType<{ a: { b: { c: number } } }>();
      rig.init();
      rig.update();

      const entity = rig.ecs
        .create()
        .add(new Foo(), true)
        .addWith(b => {
          const bar = new Bar();
          bar.data = { a: { b: { c: 0 } } };
          return bar;
        }, true)
        .tag('foo')
        .build();

      rig.update();

      expect(rig.ecs.updating.count).toEqual(0);

      const foo = rig.getComponent(entity, Foo);
      foo.data = 344;
      expect(rig.ecs.updating.count).toEqual(1);
      const bar = rig.getComponent(entity, Bar);
      bar.data.a.b.c = 42;
      // only one entity is updating
      expect(rig.ecs.updating.count).toEqual(1);
      // but two components should be updating
      if (is_ok(entity)) {
        expect(rig.ecs.updating.first?.count).toEqual(2);
        expect(rig.ecs.updating.first?.get(foo.type)).toContainEqual(foo);
        expect(rig.ecs.updating.first?.get(bar.type)).toContainEqual(bar);
      }

      // updat should of course reset
      rig.update();
      expect(rig.ecs.updating.count).toEqual(0);
    }, 7);
  });
});
