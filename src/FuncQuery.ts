import { EcsInstance } from './EcsInstance';
import { ComponentOptionTuple, ComponentTuple, JoinedResult } from './types';

export declare interface QueryFuncParams<
  Needed extends ComponentTuple,
  Optional extends ComponentOptionTuple = [],
  Unwanted extends ComponentTuple = [],
> {
  query: FuncQuery<Needed, Optional, Unwanted>;
  ecs: EcsInstance;
  delta: number;
}

export declare type QueryFunc<
  Needed extends ComponentTuple,
  Optional extends ComponentOptionTuple = [],
  Unwanted extends ComponentTuple = [],
> = (params: QueryFuncParams<Needed, Optional, Unwanted>) => void;

export class FuncQuery<
  Needed extends ComponentTuple,
  Optional extends ComponentOptionTuple = [],
  Unwanted extends ComponentTuple = [],
> {
  ecs: EcsInstance;
  needed: [...Needed];
  optional: [...Optional];
  unwanted: [...Unwanted];

  constructor(
    ecs: EcsInstance,
    needed: [...Needed],
    optional?: [...Optional],
    unwanted?: [...Unwanted],
  ) {
    this.ecs = ecs;
    this.needed = needed;
    this.optional = optional || ([] as unknown as [...Optional]);
    this.unwanted = unwanted || ([] as unknown as [...Unwanted]);
  }

  join(): IterableIterator<JoinedResult<Needed, Optional>> {
    const results = this.ecs.joinAll(this.needed, this.optional, this.unwanted);
    return results;
  }
}
