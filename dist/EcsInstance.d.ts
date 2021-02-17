import { EntityManager } from './EntityManager';
import { ComponentManager } from './ComponentManager';
import { SystemManager } from './SystemManager';
import { TagManager } from './TagManager';
import { GroupManager } from './GroupManager';
import { Entity } from './Entity';
import { Component } from './Component';
export declare class EcsInstance {
    entityManager: EntityManager;
    componentManager: ComponentManager;
    systemManager: SystemManager;
    tagManager: TagManager;
    groupManager: GroupManager;
    private __updating;
    private __deleting;
    private __delta;
    private __lastTime;
    private __elapsed;
    constructor();
    get delta(): number;
    get elapsed(): number;
    create(): Entity;
    addComponent(entity: Entity, component: Component): void;
    removeComponent(component: Component): void;
    hasComponent(entity: Entity, type: number): boolean;
    resolve(entity: Entity): void;
    deleteEntity(entity: Entity): void;
    resolveEntities(): void;
    updateTime(time: number): void;
    updateByDelta(delta: number): void;
    cleanUp(): void;
}
//# sourceMappingURL=EcsInstance.d.ts.map