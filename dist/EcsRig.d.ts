import { ComponentOptionTuple, ComponentTuple, EntitySystemArgs } from './types';
import { Component } from './Component';
import { EcsInstance } from './EcsInstance';
import { EntitySystem } from './EntitySystem';
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
    makeSystemType: <Props, T extends ComponentTuple, V extends ComponentOptionTuple, W extends ComponentTuple, EsArgs extends EntitySystemArgs<Props, T, V, W>, Sys extends EntitySystem<Props, T, V, W>>(queries: SystemQuery<T, V, W>) => new (props: EsArgs) => Sys;
}
export declare type EcsRigCallback = (rig: EcsRig) => void;
export default function ecsRig(callback: EcsRigCallback): void;
export {};
//# sourceMappingURL=EcsRig.d.ts.map