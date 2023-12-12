import { Bag } from './Bag';
import { Entity } from './Entity';
import { EcsInstance } from './EcsInstance';
import { Query } from './Query';
import { ComponentOptionTuple, ComponentTuple, JoinedResult, SmartUpdate, EntitySystemArgs } from './types';
export declare class EntitySystem<T extends ComponentTuple = any, Props = any, V extends ComponentOptionTuple = any, W extends ComponentTuple = any> {
    private _id;
    private _entities;
    private _ecsInstance;
    private _priority;
    private _query;
    private _active;
    private _dirty;
    protected reactive: boolean;
    props: EntitySystemArgs<T, Props, V, W>;
    needed: [...T];
    optional: [...V];
    unwanted: [...W];
    constructor(props: EntitySystemArgs<T, Props, V, W>);
    get id(): number;
    get ecs(): EcsInstance;
    get ecsInstance(): EcsInstance;
    set ecsInstance(value: EcsInstance);
    get entities(): Bag<Entity>;
    get isReactive(): boolean;
    get priority(): number;
    get query(): Query<T, V, W>;
    get active(): boolean;
    get dirty(): boolean;
    get componentTypes(): [...T, ...V, ...W];
    /**
     * enable this system
     */
    enable(): void;
    /**
     * disable this system
     */
    disable(): void;
    buildQuery(): void;
    /**
     * remove the given entity from this system, calling the system's removed function
     * if successful
     * @param entity the entity to remove
     */
    removeEntity(entity: Entity): void;
    removeEntityById(id: number): void;
    /**
     * creation/assignment of entities upon initial resolution
     */
    initialResolve(entity: Entity): void;
    /**
     * creation/assignment of enttiies after load
     */
    initialCreate(entity: Entity): void;
    /**
     * add the entity with the given id to this system
     * @param id the id of the entity to add
     */
    addEntityById(id: number): void;
    /**
     * add the entity to this system
     * @param entity the entity to add
     */
    addEntity(entity: Entity): void;
    createEntity(entity: Entity): void;
    /**
     * adds an entity without calling `added`
     * @param id the id of the entity to add
     */
    addByUpdateById(id: number): void;
    /**
     * adds an entity without calling `added`
     * @param entity the entity to add
     */
    addByUpdate(entity: Entity): void;
    deleteEntity(entity: Entity): void;
    /**
     * clean this system, calling its `cleanUp` function and clearing
     * all owned entities
     */
    cleanSystem(): void;
    /**
     * process all entities
     */
    processAll(): void;
    processJoin(): void;
    /**
     * processes entities one by one calling the system's `process` function
     * and passing the results of the systems `Query`
     */
    processEntities(): void;
    /**
     * determine whether or not this system should process
     */
    shouldProcess(): boolean;
    resolveQuery(): void;
    resetSystem(): void;
    updateById(id: number, updates: Bag<SmartUpdate>): void;
    update(entity: Entity): void;
    initialize?(): void;
    load?(entities: Bag<Entity>): void;
    created?(entity: Entity): void;
    deleted?(entity: Entity): void;
    added?(entity: Entity): void;
    removed?(entity: Entity): void;
    cleanUp?(entities: Bag<Entity>): void;
    reset?(): void;
    begin?(): void;
    end?(): void;
    process?(entity: Entity, query: Query<T, V, W>, delta: number): void;
    /**
     * alternate to `process`, but auto-retrieves all needed/optional components
     * for entities in a very efficient data structure. Components are returned in
     * the exact order of the `needed` array followed by `optional` array
     */
    join?(result: JoinedResult<T, V>): void;
    /**
     * called for static systems when a given entity it owns has a component update
     */
    updated?(entity: Entity, updates?: Bag<SmartUpdate>): void;
}
//# sourceMappingURL=EntitySystem.d.ts.map