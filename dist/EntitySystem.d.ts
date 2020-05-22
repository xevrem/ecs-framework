import { Bag } from './Bag';
import { Entity } from './Entity';
import { EcsInstance } from './EcsInstance';
export declare class EntitySystem {
    _componentTypes: Array<number>;
    _entities: Bag<Entity>;
    _ecsInstance: EcsInstance;
    get ecsInstance(): EcsInstance;
    set ecsInstance(value: EcsInstance);
    get componentTypes(): Array<number>;
    set componentTypes(value: Array<number>);
    get entities(): Bag<Entity>;
    loadContent(): void;
    removeEntity(entity: Entity): void;
    addEntity(entity: Entity): void;
    cleanSystem(): void;
    processAll(): void;
    processEntities(): void;
    shouldProcess(): boolean;
    initialize(): void;
    preLoadContent(_entities: Bag<Entity>): void;
    removed(_entity: Entity): void;
    added(_entity: Entity): void;
    updated(_entity: Entity): void;
    cleanUp(_entities: Bag<Entity>): void;
    begin(): void;
    end(): void;
    process(_entity: Entity, _delta: number): void;
}
//# sourceMappingURL=EntitySystem.d.ts.map