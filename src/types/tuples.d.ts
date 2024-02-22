import { None, Option, Some } from 'onsreo';
import { Entity } from '../Entity';
import { Component } from '../Component';
import { InstanceOf, ComponentOptionTypes, ComponentTypes } from '../types';

export declare type ComponentTuple = [...ComponentTypes];
export declare type ComponentOptionTuple = [...ComponentOptionTypes];

export declare type OrderedComponentTuple<T extends ComponentTuple> = {
  [P in keyof T]: InstanceOf<T[P]>; // ? Comp : undefined;
};

// export declare type OrderedComponentTuple<
//   T extends Component,
//   U extends InstanceOf<T> = InstanceOf<T>,
//   V extends U[] = U[],
// > = Tuple<U, V>;

export declare type OrderedComponentOptionTuple<
  T extends ComponentOptionTuple,
> = {
  // [P in keyof U]: U[P] extends Option<infer O> ? Option<O> : U[P];
  [P in keyof T]: T[P] extends Option<infer O> ? Option<InstanceOf<O>> : T[P];
};

// export declare type OrderedComponentOptionTuple<
//   T extends typeof Component,
//   U extends InstanceOf<T> = InstanceOf<T>,
//   V extends U[] = U[],
// > = OptionTuple<U, V>;

export declare type OrderedComponentSomeTuple<T extends ComponentOptionTuple> =
  {
    // [P in keyof U]: U[P] extends Option<infer O> ? Some<O> : Option<U[P]>;

    [P in keyof T]: T[P] extends Option<infer O>
      ? InstanceOf<Some<O>>
      : InstanceOf<Option<T[P]>>;
  };

// export declare type OrderedComponentSomeTuple<
//   T extends typeof Component,
//   U extends InstanceOf<T> = InstanceOf<T>,
//   V extends U[] = U[],
// > = SomeTuple<U, V>;

export declare type OrderedComponentNoneTuple<T extends ComponentOptionTuple> =
  {
    // [P in keyof U]: U[P] extends Option<any> ? None : Option<U[P]>;
    [P in keyof T]: T[P] extends Option<any> ? None : InstanceOf<Option<T[P]>>;
  };

// export declare type OrderedComponentNoneTuple<
//   T extends typeof Component,
//   U extends InstanceOf<T> = InstanceOf<T>,
//   V extends U[] = U[],
// > = NoneTuple<U, V>;

export declare type JoinedResult<
  T extends ComponentTuple,
  V extends ComponentOptionTuple,
> = [
  components: [...OrderedComponentTuple<T>, ...OrderedComponentOptionTuple<V>],
  entity: Entity,
];

export declare type JoinedData<
  T extends ComponentTuple,
  V extends ComponentOptionTuple,
> = [...OrderedComponentTuple<T>, ...OrderedComponentOptionTuple<V>];
export declare type JoinedQuery<
  T extends ComponentTuple,
  V extends ComponentOptionTuple,
> = [components: JoinedData<T, V>, entity: Entity];

export declare type SmartUpdate = [component: Component, systems: boolean[]];
export declare type SmartResolve = [entity: Entity, systems: boolean[]];
