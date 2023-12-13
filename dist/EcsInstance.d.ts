import { EntityManager } from './EntityManager';
import { ComponentManager } from './ComponentManager';
import { SystemManager } from './SystemManager';
import { TagManager } from './TagManager';
import { GroupManager } from './GroupManager';
import { ComponentMapper } from './ComponentMapper';
import { Scheduler } from './Scheduler';
import { EntitySystem } from './EntitySystem';
import { Bag } from './Bag';
import { FuncQuery } from './FuncQuery';
import { Entity } from './Entity';
import { Component } from './Component';
import { ComponentOptionTuple, ComponentTuple, JoinedData, JoinedResult, OrderedComponentOptionTuple, OrderedComponentTuple, EntityBuilder, QueryFunc, Option } from './types';
export declare class EcsInstance {
    entityManager: EntityManager;
    componentManager: ComponentManager;
    systemManager: SystemManager;
    tagManager: TagManager;
    groupManager: GroupManager;
    scheduler: Scheduler;
    private _creating;
    private _resolving;
    private _deleting;
    private _updatingEntities;
    private _updating;
    private _delta;
    private _lastTime;
    private _elapsed;
    private _destroyed;
    constructor();
    get delta(): number;
    get elapsed(): number;
    get lastTime(): number;
    /**
     * stop a recently created entity from being resolved
     * @param entity the entity to abort
     */
    abort(entity: Entity): void;
    /**
     * add a component to an entity
     * @param entity the entity to receive the component
     * @param component the component to add
     */
    addComponent(entity: Entity, component: Component): void;
    addComponentById(id: number, component: Component): void;
    /**
     * create a new entity
     * @returns the created entity
     */
    createEntity(): Entity;
    create(): EntityBuilder;
    /**
     * delete an entity
     * @param entity the entity to delete
     */
    deleteEntity(entity: Entity): void;
    /**
     * deletes multiple entities
     * @param entities the entity to delete
     */
    deleteEntities(entities: Entity[]): void;
    deleteEntityBag(entities: Bag<Entity>): void;
    getComponentsByType(component: typeof Component): Option<Bag<Component>>;
    /**
     * get the component for the specified entity of the specified component class
     * @param entity the owning entity
     * @param component the class of component to retrieve
     * @returns the component for the entity or `undefined` if it doesnt exist
     */
    getComponent<C extends typeof Component>(entity: Entity, component: C): Option<InstanceType<C>>;
    getComponentById(id: number, component: typeof Component): Option<Component>;
    getComponentByTag<T extends typeof Component>(tag: string, component: T): Option<InstanceType<T>>;
    /**
     * a very useful component retrieval function
     * @param entity entity who owns the component
     * @param component the component type to retrieve
     * @returns the instance of that component, if any
     */
    getComponentOfType<T extends typeof Component>(entity: Entity, component: T): Option<InstanceType<T>>;
    /**
     * a very useful component retrieval function
     * @param id id of entity who owns the component
     * @param component the component type to retrieve
     * @returns the instance of that component, if any
     */
    getComponentOfTypeById<T extends typeof Component>(id: number, component: T): Option<InstanceType<T>>;
    getComponentOfTypeByTag<T extends typeof Component>(tag: string, component: T): Option<InstanceType<T>>;
    /**
     * gets a component for the given entity with the given typeId
     * @param entity to retrieve component from
     * @param typeId the numeric type of the component
     * @returns the instance of that component type, if any
     */
    getComponentByTypeId<T extends typeof Component>(entity: Entity, typeId: number): Option<InstanceType<T>>;
    /**
     * returns the entity with the spcified `id` if it exists
     * @param id the id of the entity requested
     * @returns the required entity if found or `undefined`
     */
    getEntity(id: number): Option<Entity>;
    /**
     * gets the entity assigned to the given tag
     * @param tag the tag to retrieve
     * @returns the entity if tagged, otherwise `undefined`
     */
    getEntityByTag(tag: string): Option<Entity>;
    tagExists(tag: string): boolean;
    /**
     * returns the `Bag` of entities for the specified group
     * @param group the group to retrieve
     * @returns the bag for the specified group
     */
    getGroup(group: string): Option<Bag<Entity>>;
    /**
     * checks if the given entity has a component of the specified entity type
     * @param entity the entity to check
     * @param type the type field of the component to check
     * @returns `true` if the entity has the component otherwise `false`
     */
    hasComponent(entity: Entity, type: number): boolean;
    /**
     * checks if the given entity has a component of the specified entity type
     * @param entity the entity to check
     * @param componentType type to check
     * @returns `true` if the entity has the component otherwise `false`
     */
    hasComponentOfType<C extends typeof Component>(entity: Entity, componentType: C): boolean;
    /**
     * checkes if the given entity has a component of the specified entity type
     * @param id the entity id to check
     * @param componentType type to check
     * @returns `true` if the entity has the component otherwise `false`
     */
    hasComponentOfTypeById<C extends typeof Component>(id: number, componentType: C): boolean;
    /**
     * checks if the entity witht he given id has a component of the specified entity type
     * @param id the id of the entity to check
     * @param type the type field of the component to check
     * @returns `true` if the entity has the component otherwise `false`
     */
    hasComponentById(id: number, type: number): boolean;
    /**
     * checks if the tagged entity has a component of the specified entity type
     * @param tag the tagged entity to check
     * @param type the type field of the component to check
     * @returns `true` if the entity has the component otherwise `false`
     */
    hasComponentByTag(tag: string, type: number): boolean;
    /**
     * checks if the tagged entity has a component of the specified entity type
     * @param tag the tagged entity to check
     * @param component the componen type to check
     * @returns `true` if the entity has the component otherwise `false`
     */
    hasComponentOfTypeByTag<C extends typeof Component>(tag: string, component: C): boolean;
    initializeSystems(): void;
    loadSystems(): void;
    /**
     * makes a component mapper for the specific component type
     * @deprecated
     * @param component a component type to use to build the mapper
     * @return a component mapper for the given component type
     */
    makeMapper<C extends Component>(component: new () => C): ComponentMapper<C>;
    /**
     * registeres a component with the component manager
     * @param component the component type to register
     */
    registerComponent<C extends typeof Component>(component: C): void;
    registerSystem<Args, Sys extends EntitySystem>(System: new (args: Args) => Sys, args: Args): Sys;
    /**
     * remove the given component from its owner
     * @param component the component to remove
     */
    removeComponent(component: Component): void;
    /**
     * remove the component of the given type from the specified entity
     * @param entity the target entity
     * @param component the component type to remove
     */
    removeComponentType(entity: Entity, component: typeof Component): void;
    removeComponentTypeById(id: number, component: typeof Component): void;
    /**
     * resolve the given entity against the current ecs instance. This will
     * let all registered systems whose queries match the entity receive it
     * for processing
     * @param entity the entity to resolve
     */
    resolve(entity: Entity, ignoredSystems?: number[]): void;
    /**
     * resolve the entity that has the given id against he current ecs instance.
     * this will let all registered sytems whose queries match the entity receive
     * it for processing
     * @param id the id of the entity to resolve
     */
    resolveById(id: number, ignoredSystems?: number[]): void;
    /**
     * performs initial resolve of all early defined entities
     */
    initialResolve(): void;
    /**
     * performs initial create of all early defined entities (load phase)
     */
    initialCreate(): void;
    /**
     * triggers the resolution update cycle. this processes all new, resolving,
     * updating, and deleting entities
     */
    resolveEntities(): void;
    /**
     * request the scheduler to run all registered systems
     */
    runSystems(): void;
    /**
     * take all registered systems and schedule them
     */
    scheduleSystems(): void;
    /**
     * notify any reactive systems that utilize this component to process
     * the owning entity during its next processing cycle
     * @param component the component to notify systems about
     * @param ignoredSystems the systems this update should ignore
     */
    update(component: Component, ignoredSystems?: number[]): void;
    /**
     * notify any reactive systems any entities with the given component type should
     * be processed
     * @param entity which owns the component
     * @param componentType the component type to notify systems about
     * @param ignoredSystems the systems this update should ignore
     */
    updateComponent(entity: Entity, componentType: typeof Component, ignoredSystems?: number[]): void;
    /**
     * notify any reactive systems that utilize these components to
     * process the owning entity during its next processing cycle
     * @param components the components to notify systems about
     * @param ignoredSystems the systems this update should ignore
     */
    updateAll(components: Component[], ignoredSystems?: number[]): void;
    /**
     * notify any reactive systems to process this entity,
     * if its components satisfy their queries
     * @param entity
     */
    updateByEntity(entity: Entity): void;
    updateByEntities(entities: Entity[]): void;
    /**
     * update the internal ecs instance timing information with the current time
     * @param time current time in miliseconds
     */
    updateTime(time: number): void;
    /**
     * update the internal ecs instance timing information with a delta time
     * @param delta the time delta since the ecs instance was last updated
     */
    updateByDelta(delta: number): void;
    destroy(): void;
    reset(): void;
    /**
     * tell the ecs instance to cleanup everything
     */
    cleanUp(): void;
    _joiner<T extends ComponentTuple, V extends ComponentTuple, W extends ComponentTuple>(entity: Entity, needed?: [...T], optional?: [...V], unwanted?: [...W]): Option<JoinedResult<T, V>>;
    join<T extends ComponentTuple, V extends ComponentTuple, W extends ComponentTuple>(entities: Entity[], needed?: [...T], optional?: [...V], unwanted?: [...W]): IterableIterator<JoinedResult<T, V>>;
    joinByBag<T extends ComponentTuple, V extends ComponentTuple, W extends ComponentTuple>(bag: Bag<Entity>, needed?: [...T], optional?: [...V], unwanted?: [...W]): IterableIterator<JoinedResult<T, V>>;
    joinByComponentBag<T extends ComponentTuple, V extends ComponentTuple, W extends ComponentTuple>(bag: Bag<Component>, needed?: [...T], optional?: [...V], unwanted?: [...W]): IterableIterator<JoinedResult<T, V>>;
    joinByGroup<T extends ComponentTuple, V extends ComponentTuple, W extends ComponentTuple>(group: string, needed?: [...T], optional?: [...V], unwanted?: [...W]): IterableIterator<JoinedResult<T, V>>;
    joinById<T extends ComponentTuple, V extends ComponentTuple, W extends ComponentTuple>(ids: number[], needed?: [...T], optional?: [...V], unwanted?: [...W]): IterableIterator<JoinedResult<T, V>>;
    joinByTag<T extends ComponentTuple, V extends ComponentTuple, W extends ComponentTuple>(tags: string[], needed?: [...T], optional?: [...V], unwanted?: [...W]): IterableIterator<JoinedResult<T, V>>;
    /**
     *
     */
    joinAll<T extends ComponentTuple, V extends ComponentOptionTuple, W extends ComponentTuple>(needed?: [...T], optional?: [...V], unwanted?: [...W]): IterableIterator<JoinedResult<T, V>>;
    joinBySet<T extends ComponentTuple, V extends ComponentTuple, W extends ComponentTuple>(set: Set<Entity>, needed?: [...T], optional?: [...V], unwanted?: [...W]): IterableIterator<JoinedResult<T, V>>;
    joinByComponentSet<T extends ComponentTuple, V extends ComponentTuple, W extends ComponentTuple>(set: Set<Component>, needed?: [...T], optional?: [...V], unwanted?: [...W]): IterableIterator<JoinedResult<T, V>>;
    retrieve<T extends ComponentTuple, V extends ComponentOptionTuple>(entity: Entity, components: [...T, ...V]): JoinedData<T, V>;
    retrieveById<T extends ComponentTuple, V extends ComponentOptionTuple>(id: number, components: [...T, ...V]): JoinedData<T, V>;
    retrieveByTag<T extends ComponentTuple>(tag: string, components: [...T]): OrderedComponentOptionTuple<T>;
    query<T extends ComponentTuple>(needed: T): IterableIterator<OrderedComponentTuple<T>>;
    qSysTuple: [
        func: (params: {
            query: FuncQuery<any>;
            ecs: EcsInstance;
            delta: number;
        }) => void,
        data: ComponentTuple
    ][];
    withSystem<T extends ComponentTuple>(data: [...T], queryFunc: QueryFunc<T>): void;
    runQuerySystems(): void;
}
//# sourceMappingURL=EcsInstance.d.ts.map