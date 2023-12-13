export declare type Some<T> = T;

export declare type None = null | undefined;

export declare type Option<T> = Some<T> | None;

export declare type Ok<T> = T;

export declare type Err<E extends Error = Error> = E;

export declare type Result<T, E extends Error = Error> = Ok<T> | Err<E>;

export declare type ValueOf<T, K = keyof T> = K extends keyof T ? T[K] : never;
export declare type InstanceOf<T> = T extends new () => infer R ? R : undefined;
// export declare type TypeOf<T> = T extends new () => infer R ? typeof R : unknown;

export declare type InstanceKey<T> = keyof InstanceOf<T>;
export declare type InstanceValue<T> = InstanceOf<T>[InstanceKey<T>];
