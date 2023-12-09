import type { EcsInstance } from './EcsInstance';
import type { ComponentTuple, OrderedComponentTuple } from 'types/tuples';
export declare class FuncQuery<T extends ComponentTuple> {
    ecs: EcsInstance;
    data: [...T];
    constructor(ecs: EcsInstance, data: [...T]);
    join(): IterableIterator<OrderedComponentTuple<T>>;
}
//# sourceMappingURL=FuncQuery.d.ts.map