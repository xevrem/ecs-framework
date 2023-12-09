import { Entity } from 'Entity';
import { Component } from 'Component';
import { ComponentOptionTypes, ComponentTypes } from './components';

declare type OrderedTuple<T extends unknown[]> = {
  [P in keyof T]: T[P]; // extends new () => infer U ? U : undefined;
};

declare type OptionTypes<T> = Option<T>[];
declare type OptionTuple<T> = [...OptionTypes<T>];
declare type SomeTuple<T> = [...Some<T>[]];
declare type NoneTuple = [...None[]];

declare type OrderedOptionTuple<T extends OptionTuple<T>> = {
  [P in keyof T]: Option<T[P]>;
};

declare type OrderedSomeTuple<T extends OptionTuple<T>> = {
  [P in keyof T]: Some<T[P]>;
};
declare type OrderedNoneTuple<T extends OptionTuple<T>> = {
  [P in keyof T]: None;
};

// declare type OrderedOptionTuple<T extends any> =
//   | OrderedSomeTuple<T>
//   | OrderedNoneTuple<T>;

declare type ComponentTuple = [...ComponentTypes];
declare type ComponentOptionTuple = [...ComponentOptionTypes];

declare type OrderedComponentTuple<T extends ComponentTuple> = {
  [P in keyof T]: InstanceOf<T[P]>; // ? Comp : undefined;
};

declare type OrderedComponentOptionTuple<T extends ComponentOptionTuple> = {
  [P in keyof T]: T[P] extends Option<any> ? Option<InstanceOf<T[P]>> : unknown;
};

declare type OrderedComponentSomeTuple<T extends ComponentOptionTuple> = {
  [P in keyof T]: T[P] extends Some<any>
    ? InstanceOf<Some<T[P]>>
    : InstanceOf<Option<T[P]>>;
};

declare type OrderedComponentNoneTuple<T extends ComponentOptionTuple> = {
  [P in keyof T]: T[P] extends None ? None : InstanceOf<Option<T[P]>>;
};

declare type JoinedResult<
  T extends ComponentTuple,
  V extends ComponentOptionTuple
> = [
  components: [...OrderedComponentTuple<T>, ...OrderedComponentOptionTuple<V>],
  entity: Entity
];

declare type JoinedData<
  T extends ComponentTuple,
  V extends ComponentOptionTuple
> = [...OrderedComponentTuple<T>, ...OrderedComponentOptionTuple<V>];
declare type JoinedQuery<
  T extends ComponentTuple,
  V extends ComponentOptionTuple
> = [components: JoinedData<T, V>, entity: Entity];

declare type SmartUpdate = [component: Component, systems: boolean[]];
declare type SmartResolve = [entity: Entity, systems: boolean[]];
