import { None, Option, Some } from 'onsreo';
import { Entity } from '../Entity';
import { Component } from '../Component';
import {
  InstanceOf,
  ComponentOptionTypes,
  ComponentTypes,
  ConstructorType,
} from '../types';

export declare type ComponentTuple = [...ComponentTypes];
export declare type ComponentOptionTuple = [...ComponentOptionTypes];

export declare type OrderedComponentTuple<T extends ComponentTuple> = {
  [P in keyof T]: InstanceType<T[P]>; // ? Comp : undefined;
};

export declare type OrderedComponentOptionTuple<
  T extends ComponentOptionTuple,
> = {
  // [P in keyof U]: U[P] extends Option<infer O> ? Option<O> : U[P];
  [P in keyof T]: T[P] extends Option<infer O>
    ? O extends ConstructorType
      ? Option<InstanceType<O>>
      : never
    : T[P];
};

export declare type OrderedComponentSomeTuple<T extends ComponentOptionTuple> =
  {
    // [P in keyof U]: U[P] extends Option<infer O> ? Some<O> : Option<U[P]>;

    [P in keyof T]: T[P] extends Option<infer O>
      ? Some<O> extends ConstructorType
        ? InstanceType<Some<O>>
        : never
      : Option<T[P]> extends ConstructorType
        ? InstanceType<Option<T[P]>>
        : never;
  };

export declare type OrderedComponentNoneTuple<T extends ComponentOptionTuple> =
  {
    // [P in keyof U]: U[P] extends Option<any> ? None : Option<U[P]>;
    [P in keyof T]: T[P] extends Option<any> ? None : InstanceOf<Option<T[P]>>;
  };

export declare type JoinedResult<
  T extends ComponentTuple,
  V extends ComponentOptionTuple = [],
> = [
  components: [...OrderedComponentTuple<T>, ...OrderedComponentOptionTuple<V>],
  entity: Entity,
];

export declare type JoinedData<
  T extends ComponentTuple,
  V extends ComponentOptionTuple = [],
> = [...OrderedComponentTuple<T>, ...OrderedComponentOptionTuple<V>];
export declare type JoinedQuery<
  T extends ComponentTuple,
  V extends ComponentOptionTuple = [],
> = [components: JoinedData<T, V>, entity: Entity];

export declare type SmartUpdate = [component: Component, systems: boolean[]];
export declare type SmartResolve = [entity: Entity, systems: boolean[]];
