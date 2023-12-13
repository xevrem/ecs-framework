import { EcsInstance } from '../EcsInstance';
import { Option } from './common';
import { ComponentOptionTuple, ComponentTuple } from './tuples';

export declare type SystemRegistrationArgs = {
  reactive?: Option<boolean>;
  priority?: Option<number>;
}; 

export declare type EntitySystemArgs<
  T extends ComponentTuple = ComponentTuple,
  Props = any,
  V extends ComponentOptionTuple = ComponentOptionTuple,
  W extends ComponentTuple = ComponentTuple
> = {
  id: number;
  ecsInstance: EcsInstance;
  needed: [...T];
  optional?: [...V];
  unwanted?: [...W];
} & SystemRegistrationArgs & {
  [Key in keyof Props]: Props[Key];
};
