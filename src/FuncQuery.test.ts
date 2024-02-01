import ecsRig from 'EcsRig';
import { is_some } from 'onsreo';

describe('FuncQuery', () => {
  it('should handle running Functional Systems', () => {
    ecsRig(rig => {
      const Foo = rig.makeComponentType();

      rig.ecs.withSystem([Foo], ({ query }) => {
        for (const [foo] of query.join()) {
          foo.data = 42;
        }
      });

      rig.ecs.create().add(new Foo()).tag('foo').build();

      rig.init();
      rig.update();

      const foo = rig.ecs.getComponentByTag('foo', Foo);
      expect(foo).toBeDefined();
      if (is_some(foo)) {
        expect(foo.data).toEqual(42);
      } else {
        throw new Error();
      }
    });
  });
});
