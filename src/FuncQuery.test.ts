import { is_none, is_some } from 'onsreo';
import { Component } from './Component';
import { ecsRig } from './EcsRig';

describe('FuncQuery', () => {
  it('should handle running Functional Systems', () => {
    ecsRig(rig => {
      const Foo = rig.makeComponentType();
      const Bar = rig.makeComponentType<string>();
      // class Foo extends Component {
      //   data!: number;
      // }
      // class Bar extends Component {
      //   data!: string;
      // }
      // rig.ecs.registerComponent(Foo);
      // rig.ecs.registerComponent(Bar);

      rig.ecs.withSystem([[Foo], [Bar]], ({ query }) => {
        for (const [[foo, bar], _entity] of query.join()) {
          foo.data = 42;
          if (is_some(bar)) {
            bar.data = 'oh hi';
          }
        }
      });

      rig.init();
      rig.update();
      const _ent = rig.ecs
        .create()
        .add(new Foo())
        .add(new Bar())
        .tag('foo')
        .build();
      rig.update();
      rig.update();
      rig.update();
      rig.update();

      const bar = rig.ecs.getComponentByTag('foo', Bar);
      const foo = rig.ecs.getComponentByTag('foo', Foo);
      expect(bar).toBeDefined();
      expect(foo).toBeDefined();
      if (is_some(foo)) {
        expect(foo.data).toEqual(42);
      } else {
        throw new Error();
      }
    });
  });
});
