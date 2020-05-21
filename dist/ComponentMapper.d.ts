import { Entity } from "Entity";
import { Component } from "Component";
import { EcsInstance } from "EcsInstance";
export declare class ComponentMapper {
    private __type;
    private __ecsInstance;
    constructor(component: Component, ecsInstance: EcsInstance);
    get(entity: Entity): Component;
    static get(component: Component, entity: Entity, ecsInstance: EcsInstance): Component;
}
