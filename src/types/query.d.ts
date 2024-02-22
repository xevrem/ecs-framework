import { FuncQuery } from '../FuncQuery';
import { ComponentOptionTuple, ComponentTuple } from './tuples';
import { EcsInstance } from '../EcsInstance';

export declare interface QueryFuncParams<
  T extends ComponentTuple,
  V extends ComponentOptionTuple,
  W extends ComponentTuple,
> {
  query: FuncQuery<T, V, W>;
  ecs: EcsInstance;
  delta: number;
}

export declare type QueryFunc<
  T extends ComponentTuple,
  V extends ComponentOptionTuple,
  W extends ComponentTuple,
> = (params: QueryFuncParams<T, V, W>) => void;
