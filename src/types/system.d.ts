import { EcsInstance } from '../EcsInstance';
import { Option } from './common';
import { ComponentOptionTuple, ComponentTuple } from './tuples';

export declare type SystemRegistrationArgs<Props = any> = {
  reactive?: Option<boolean>;
  priority?: Option<number>;
} & {
  [Key in keyof Props]: Props[Key];
};

export declare type EntitySystemArgs<
  T extends ComponentTuple = ComponentTuple,
  Props = any,
  V extends ComponentOptionTuple = ComponentOptionTuple,
  W extends ComponentTuple = ComponentTuple
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
