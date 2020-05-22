import { Bag } from './Bag';
import { Component } from './Component';
import { EcsInstance } from './EcsInstance';
import { Entity } from './Entity';
export declare class ComponentManager {
    __ecsInstance: EcsInstance;
    __components: Bag<Bag<Component>>;
    __nextTypeId: number;
    constructor(ecsInstance: EcsInstance);
    registerComponent(component: typeof Component): void;
    get components(): Bag<Bag<Component>>;
    getComponent(entity: Entity, component: Component): Component;
    addComponent(entity: Entity, component: Component): void;
    removeComponents(entity: Entity): void;
    removeComponent(component: Component): void;
    deleteEntity(entity: Entity): void;
    hasComponent(entity: Entity, type: number): boolean;
    cleanUp(): void;
}
//# sourceMappingURL=ComponentManager.d.ts.map