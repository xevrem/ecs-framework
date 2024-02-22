import { EcsInstance } from './EcsInstance';
import { ComponentOptionTuple, ComponentTuple, JoinedResult } from './types';

export declare interface QueryFuncParams<
  T extends ComponentTuple,
  V extends ComponentOptionTuple = [],
  W extends ComponentTuple = [],
> {
  query: FuncQuery<T, V, W>;
  ecs: EcsInstance;
  delta: number;
}

export declare type QueryFunc<
  T extends ComponentTuple,
  V extends ComponentOptionTuple = [],
  W extends ComponentTuple = [],
> = (params: QueryFuncParams<T, V, W>) => void;

export class FuncQuery<
  N extends ComponentTuple,
  O extends ComponentOptionTuple = [],
  U extends ComponentTuple = [],
> {
  ecs: EcsInstance;
  needed: [...N];
  optional: [...O];
  unwanted: [...U];

  constructor(
    ecs: EcsInstance,
    needed: [...N],
    optional?: [...O],
    unwanted?: [...U],
  ) {
    this.ecs = ecs;
    this.needed = needed;
    this.optional = optional || ([] as unknown as [...O]);
    this.unwanted = unwanted || ([] as unknown as [...U]);
  }

  join(): IterableIterator<JoinedResult<N, O>> {
    const results = this.ecs.joinAll(this.needed, this.optional, this.unwanted);
    return results;
  }
}
