import { None, Option, Some } from 'onsreo';
import { Entity } from '../Entity';
import { Component } from '../Component';
import { InstanceOf } from './common';
import { ComponentOptionTypes, ComponentTypes } from './components';

export declare type ComponentTuple = [...ComponentTypes];
export declare type ComponentOptionTuple = [...ComponentOptionTypes];

export declare type OrderedComponentTuple<T extends ComponentTuple> = {
  [P in keyof T]: InstanceOf<T[P]>; // ? Comp : undefined;
};

export declare type OrderedComponentOptionTuple<
  T extends ComponentOptionTuple
> = {
  [P in keyof T]: T[P] extends Option<any> ? Option<InstanceOf<T[P]>> : unknown;
};

export declare type OrderedComponentSomeTuple<T extends ComponentOptionTuple> =
  {
    [P in keyof T]: T[P] extends Some<any>
      ? InstanceOf<Some<T[P]>>
      : InstanceOf<Option<T[P]>>;
  };

export declare type OrderedComponentNoneTuple<T extends ComponentOptionTuple> =
  {
    [P in keyof T]: T[P] extends None ? None : InstanceOf<Option<T[P]>>;
  };

export declare type JoinedResult<
  T extends ComponentTuple,
  V extends ComponentOptionTuple
> = [
  components: [...OrderedComponentTuple<T>, ...OrderedComponentOptionTuple<V>],
  entity: Entity
];

export declare type JoinedData<
  T extends ComponentTuple,
  V extends ComponentOptionTuple
> = [...OrderedComponentTuple<T>, ...OrderedComponentOptionTuple<V>];
export declare type JoinedQuery<
  T extends ComponentTuple,
  V extends ComponentOptionTuple
> = [components: JoinedData<T, V>, entity: Entity];

export declare type SmartUpdate = [component: Component, systems: boolean[]];
export declare type SmartResolve = [entity: Entity, systems: boolean[]];
