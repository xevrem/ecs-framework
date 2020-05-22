import { Entity } from "./Entity";
import { Component } from "./Component";
import { EcsInstance } from "./EcsInstance";
export declare class ComponentMapper {
    private _type;
    private _ecsInstance;
    constructor(type: number, ecsInstance: EcsInstance);
    get(entity: Entity): Component;
    static get(type: number, entity: Entity, ecsInstance: EcsInstance): Component;
}
