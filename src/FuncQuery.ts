import { EcsInstance } from 'EcsInstance';
import { ComponentOptionTuple, ComponentTuple, JoinedResult } from 'types';

export class FuncQuery<
  T extends ComponentTuple,
  V extends ComponentOptionTuple = [],
  W extends ComponentTuple = [],
> {
  ecs: EcsInstance;
  needed: [...T];
  optional: [...V];
  unwanted: [...W];

  constructor(
    ecs: EcsInstance,
    needed: [...T],
    optional: [...V] = [] as any,
    unwanted: [...W] = [] as any,
  ) {
    this.ecs = ecs;
    this.needed = needed;
    this.optional = optional;
    this.unwanted = unwanted;
  }

  join(): IterableIterator<JoinedResult<T, V>> {
    return this.ecs.joinAll<T, V, W>(
      [...this.needed],
      [...this.optional],
      [...this.unwanted],
    );
  }
}
