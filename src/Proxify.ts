import { EcsInstance } from './EcsInstance';

export function proxify<T extends Object>(
  obj: T,
  ecs: EcsInstance,
  ignored: (keyof T)[] = [],
  source: any = undefined,
) {
  let inner_source = source ? source : obj;

  const modified = (Object.getOwnPropertyNames(obj) as (keyof T)[]).reduce<T>(
    (modified: T, prop: keyof T) => {
      if (prop in ignored) return modified;
      if (typeof modified[prop] === 'object') {
        modified[prop] = proxify<any>(
          modified[prop],
          ecs,
          ignored,
          inner_source,
        );
      }
      return modified;
    },
    obj,
  );

  return new Proxy<any>(modified, {
    set(target, key, value, _receiver): boolean {
      target[key as keyof T] = value;
      ecs.update(inner_source);
      return true;
    },
  });
}
