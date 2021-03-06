import { Entity } from "./Entity";
import { Component } from "./Component";
import { EcsInstance } from "./EcsInstance";
export declare class ComponentMapper {
    private _type;
    private _ecsInstance;
    constructor(component: Component, ecsInstance: EcsInstance);
    get(entity: Entity): Component;
    static get(component: Component, entity: Entity, ecsInstance: EcsInstance): Component;
}
//# sourceMappingURL=ComponentMapper.d.ts.map