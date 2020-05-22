import { Entity } from "./Entity";
import { Component } from "./Component";
import { EcsInstance } from "./EcsInstance";
export declare class ComponentMapper {
    private _type;
    private _ecsInstance;
    constructor(component: typeof Component, ecsInstance: EcsInstance);
    get(entity: Entity): Component;
    static get(component: typeof Component, entity: Entity, ecsInstance: EcsInstance): Component;
}
