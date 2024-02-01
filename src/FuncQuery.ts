import { EcsInstance } from 'EcsInstance';
import { ComponentTuple, OrderedComponentTuple } from 'types';

export class FuncQuery<T extends ComponentTuple> {
  ecs: EcsInstance;
  data: [...T];

  constructor(ecs: EcsInstance, data: [...T]) {
    this.ecs = ecs;
    this.data = data;
  }

  join(): IterableIterator<OrderedComponentTuple<T>> {
    return this.ecs.query<T>(this.data);
  }
}
