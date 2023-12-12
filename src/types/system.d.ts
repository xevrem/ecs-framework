import { EcsInstance } from '../EcsInstance';
import { Option } from './common';
import { ComponentOptionTuple, ComponentTuple } from './tuples';

export declare type SystemRegistrationArgs<
  Props = any
> = {
  reactive?: Option<boolean>;
  priority?: Option<number>;
} & {
  [Key in keyof Props]: Props[Key];
};

export declare type EntitySystemArgs<
  T extends ComponentTuple = any,
  Props = any,
  V extends ComponentOptionTuple = any,
  W extends ComponentTuple = any,
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
