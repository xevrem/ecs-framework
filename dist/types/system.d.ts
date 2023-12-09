import type { EcsInstance } from 'EcsInstance';
import type { ComponentOptionTuple, ComponentTuple } from './tuples';

declare type SystemRegistrationArgs<
  Props
> = {
  reactive?: Option<boolean>;
  priority?: Option<number>;
} & {
  [Key in keyof Props]: Props[Key];
};

declare type EntitySystemArgs<
  T extends ComponentTuple,
  Props,
  V extends ComponentOptionTuple,
  W extends ComponentTuple,
> = {
  id: number;
  ecsInstance: EcsInstance;
  reactive?: Option<boolean>;
  priority?: number;
  needed: [...T];
  optional?: [...V];
  unwanted?: [...W];
} & {
  [Key in keyof Props]: Props[Key];
};
