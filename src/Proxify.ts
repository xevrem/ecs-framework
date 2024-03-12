import { EcsInstance } from './EcsInstance';

export function proxify<T extends Object>(
  obj: T,
  ecs: EcsInstance,
  source?: any,
) {
  source = source ? source : obj;
  return new Proxy(obj, {
    set(target, key, value): boolean {
      if (typeof value === 'object') {
        value = proxify(value, ecs, source);
      }
      target[key as keyof T] = value;
      ecs.update(source);
      return true;
    },
  });
}
