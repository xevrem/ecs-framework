import { EcsInstance } from './EcsInstance';
import { ComponentTuple, OrderedComponentTuple } from './types';
export declare class FuncQuery<T extends ComponentTuple> {
    ecs: EcsInstance;
    data: [...T];
    constructor(ecs: EcsInstance, data: [...T]);
    join(): IterableIterator<OrderedComponentTuple<T>>;
}
//# sourceMappingURL=FuncQuery.d.ts.map