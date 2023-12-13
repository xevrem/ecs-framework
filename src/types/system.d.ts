import { EcsInstance } from '../EcsInstance';
import { Option } from './common';
import { ComponentOptionTuple, ComponentTuple } from './tuples';

export declare type SystemRegistrationArgs<Props> = {
  reactive?: Option<boolean>;
  priority?: Option<number>;
} & {
  [Key in keyof Props]: Props[Key];
};

export declare type EntitySystemArgs<
  Props,
  T extends ComponentTuple,
  V extends ComponentOptionTuple = ComponentOptionTuple,
  W extends ComponentTuple = ComponentTuple
> = SystemRegistrationArgs<Props> & {
  id: number;
  ecsInstance: EcsInstance;
  needed: [...T];
  optional?: [...V];
  unwanted?: [...W];
};
