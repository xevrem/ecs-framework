import type { EcsInstance } from './EcsInstance';
import type { ComponentTuple, OrderedComponentTuple } from 'types/tuples';

// export declare type VariadricQuery<T extends ComponentTuple> = [...T];

export class FuncQuery<T extends ComponentTuple> {
  ecs!: EcsInstance;
  data!: [...T];

  constructor(ecs: EcsInstance, data: [...T]) {
    this.ecs = ecs;
    this.data = data;
  }

  join(): IterableIterator<OrderedComponentTuple<T>> {
    return this.ecs.query<T>(this.data);
  }
}
