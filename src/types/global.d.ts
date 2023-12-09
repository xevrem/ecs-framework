declare type Some<T> = T;

declare type None = null | undefined;

declare type Option<T> = Some<T> | None;

declare type Ok<T> = T;

declare type Err<E extends Error = Error> = E;

declare type Result<T, E extends Error = Error> = Ok<T> | Err<E>;

declare type ValueOf<T, K = keyof T> = K extends keyof T ? T[K] : never;
declare type InstanceOf<T> = T extends new () => infer R ? R : undefined;

declare type InstanceKey<T> = keyof InstanceOf<T>;
declare type InstanceValue<T> = InstanceOf<T>[InstanceKey<T>];
