import { EntitySystemArgs } from 'types/system';
import { Component } from './Component';
import { EcsInstance } from './EcsInstance';
import { EntitySystem } from './EntitySystem';
import type { ComponentOptionTuple, ComponentTuple } from 'types/tuples';
declare class Bar extends Component {
    [x: string]: number;
}
type SystemQuery<T extends ComponentTuple, V extends ComponentOptionTuple, W extends ComponentTuple> = {
    needed: [...T];
    optional?: [...V];
    unwanted?: [...W];
};
export declare interface EcsRig {
    ecs: EcsInstance;
    makeComponentType: () => typeof Bar;
    makeSystemType: <T extends ComponentTuple, Props extends Record<PropertyKey, any>, V extends ComponentOptionTuple, W extends ComponentTuple>(queries: SystemQuery<T, V, W>) => new (props: EntitySystemArgs<T, Props, V, W>) => EntitySystem<T, Props, V, W>;
}
export declare type EcsRigCallback = (rig: EcsRig) => void;
export default function ecsRig(callback: EcsRigCallback): void;
export {};
//# sourceMappingURL=EcsRig.d.ts.map