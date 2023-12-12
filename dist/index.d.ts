declare module "Bag" {
    export class Bag<T> {
        private _data;
        private _length;
        private _count;
        private _last;
        private _invalidated;
        constructor(capacity?: number);
        /**
         * iterator symbol for Bags
         */
        [Symbol.iterator](): {
            next: () => {
                value: T;
                done: boolean;
            };
        };
        iter(): () => {
            next: () => {
                value: T;
                done: boolean;
            };
        };
        /**
         * total number indicies the bag contains
         */
        get capacity(): number;
        /**
         * are there any populated indexes in this bag
         */
        get isEmpty(): boolean;
        /**
         * the furthest populated index in this bag
         */
        get length(): number;
        /**
         * the current count of non-undefined data elements
         */
        get count(): number;
        /**
         * the base data structure of the bag
         */
        get data(): Array<Option<T>>;
        lastIndex(start: number): number;
        /**
         * return the last populated item
         */
        get last(): Option<T>;
        /**
         * return the first item
         */
        get first(): Option<T>;
        /**
         * perform a functional `forEach` operation on this bag
         * @param args args the standard `forEach` arguments
         * @param [context] the optional context to use
         */
        forEach(args: (item: Option<T>, index: number, array: Array<Option<T>>) => void, context?: Bag<T>): void;
        /**
         * perform a functional `map` operation on this bag
         * @param args args the standard `map` arguments
         * @param [context] the optional context to use
         * @returns the results of the `map` operation
         */
        map(args: (item: Option<T>, index: number, array: Array<Option<T>>) => Option<T>, context?: Bag<T>): Array<Option<T>>;
        /**
         * perform a functional `filter` operation on this bag
         * @param args args the standard `filter` arguments
         * @param [context] the optional context to use
         * @returns the results of the `filter` operation
         */
        filter(args: (item: Option<T>, index: number, array: Array<Option<T>>) => boolean, context?: Bag<T>): Array<Option<T>>;
        /**
         * perform a functional `reduce` operation on this bag
         * @param args args the standard `reduce` arguments
         * @param init the optional context to use
         * @returns the results of the `reduce` operation
         */
        reduce<V>(args: (acc: V, item: Option<T>, index: number, array: Array<Option<T>>) => V, init: V): V;
        /**
         * perform a functional `slice` operation on this bag
         * @param start the standard `slice` arguments
         * @param end the optional context to use
         * @returns the results of the `slice` operation
         */
        slice(start?: number, end?: number): Array<Option<T>>;
        some(predicate: (value: Option<T>, index: number, array: Array<Option<T>>) => boolean): boolean;
        /**
         * gets the item at the specified index
         * @param index the index of the item to retrieve
         * @returns the item if found otherwise `undefined`
         */
        get<U extends T>(index: number): Option<U>;
        /**
         * sets the index to the given value. grows the bag if index exceeds capacity.
         * @param index the index to set
         * @param value the value to set
         * @returns a copy of the value if successfully inserted, otherwise `undefined`
         */
        set(index: number, value: Option<T>): Option<T>;
        /**
         * adds the given element to the end of the bags contents
         * @param element the element to add
         */
        add(element: Option<T>): number;
        /**
         * adds the given bag to this one
         * @param bag the bad to add
         */
        addBag(bag: Bag<T>): void;
        /**
         * sets each defined item of the bag into this one
         * @param bag - the bag to set with
         */
        setBag(bag: Bag<T>): void;
        /**
         * clears the contents of the bag
         */
        clear(): void;
        /**
         * checks if an element with the given id is populated
         */
        has(id: number): boolean;
        /**
         * checks if the bag contains the given element
         * @param element the element to check
         * @param [compare] the optional comparator function to use
         * @returns `true` if found, `false` if not
         */
        contains(element: T, compare?: (a: T, b: Option<T>) => boolean): boolean;
        /**
         * check if an element exists within the bag via strict equals
         * @param element the element to check
         * @param fromIndex the optional starting index
         * @returns `true` if found, `false` if not
         */
        includes(element: T, fromIndex?: number): boolean;
        /**
         * removes the specified element from the bag
         * @param element the element to remove
         * @returns the element removed or `undefined` if no element was found
         */
        remove(element: T): Option<T>;
        /**
         * removes the element at the specified index
         * @param index the index for the element to remove
         * @returns the removed element or `undefined` if it was empty or out of bounds
         */
        removeAt(index: number): Option<T>;
        /**
         * remove the element in the last filled position
         * @returns the element if found or `undefined` if not
         */
        removeLast(): Option<T>;
        /**
         * grow the bag to the specified size, so long as it is larger.
         * @param size the size to grow the bag
         */
        grow(size?: number): void;
    }
}
declare module "Component" {
    export const ComponentSymbol: unique symbol;
    export class Component implements Component {
        static type: number;
        owner: number;
        /**
         * this allows us to interogate a type to see if it is a component type
         * @returns whether type is a type of Component
         */
        static get [ComponentSymbol](): boolean;
        /**
         * this allows us to interogate an object to see if it is a component
         * @returns whether an object is a Component
         */
        get [ComponentSymbol](): boolean;
        /**
         * get the registerd type of this component
         */
        get type(): number;
        /**
         * set the type number for all components of this type
         */
        set type(value: number);
    }
    /**
     * confirms whether the given object is a Component Type or Component Instance
     */
    export function isComponent<T extends typeof Component | Component>(object: T): object is T;
    /**
     * confirms whether the given component is of the stated component type
     */
    export function isComponentOfType<T extends typeof Component | Component>(object: Component | typeof Component, type: T): object is T;
}
declare module "Entity" {
    export class Entity {
        id: number;
    }
}
declare module "EntityManager" {
    import { Bag } from "Bag";
    import { Entity } from "Entity";
    export class EntityManager {
        private _entities;
        private _oldIds;
        private _nextId;
        constructor();
        get entities(): Bag<Entity>;
        get oldIds(): Array<number>;
        /**
         * create a new unique entity
         * @returns the new entity
         */
        create(): Entity;
        /**
         * returns the entity with the spcified `id` if it exists
         * @param id the id of the entity requested
         * @returns the requried entity if found or `undefined`
         */
        getEntity(id: number): Option<Entity>;
        /**
         * delete an entity
         * @param entity the entity to delete
         */
        deleteEntity(entity: Entity): void;
        reset(): void;
        /**
         * clean up the manager, clearing old ids and entities
         */
        cleanUp(): void;
    }
    export default EntityManager;
}
declare module "Query" {
    import { Bag } from "Bag";
    import { EcsInstance } from "EcsInstance";
    import { Component } from "Component";
    import { Entity } from "Entity";
    import type { ComponentOptionTuple, ComponentTuple, JoinedData, JoinedQuery, JoinedResult } from 'types/tuples';
    export interface QueryArgs<T extends ComponentTuple = ComponentTuple, V extends ComponentOptionTuple = ComponentOptionTuple, W extends ComponentTuple = ComponentTuple> {
        ecsInstance: EcsInstance;
        needed: [...T];
        optional?: [...V];
        unwanted?: [...W];
    }
    export class Query<T extends ComponentTuple = ComponentTuple, V extends ComponentOptionTuple = ComponentOptionTuple, W extends ComponentTuple = ComponentTuple> {
        private _ecsInstance;
        private _needed;
        private _optional;
        private _unwanted;
        private _data;
        private _entity;
        constructor(props: QueryArgs<T, V, W>);
        /**
         * current needed components
         */
        get needed(): (typeof Component)[];
        get data(): JoinedQuery<T, V>[];
        set entity(value: Entity);
        /**
         * a very useful component retrieval function
         * @param component - the component type to retrieve
         * @returns the instance of that component, if any
         */
        get<T extends typeof Component>(component: T): InstanceType<T>;
        resolve(entities: Bag<Entity>): void;
        /**
         * does the given entity have an unwanted component
         * @param entity the entity to check
         * @returns 'true' if an unwanted component was found
         */
        isInvalid(entity: Entity): boolean;
        /**
         * does the given entity, found by its id, have an unwanted component
         * @param id the id of the entity to check
         * @returns 'true' if an unwanted component was found
         */
        isInvalidById(id: number): boolean;
        isNeededComponent(component: Component): boolean;
        /**
         * does the entity contain every component required by the query
         * @param entity the entity to check
         * @returns 'true' if all required components were found
         */
        isValid(entity: Entity): boolean;
        /**
         * does the entity, found by its id, contain every component required by the query
         * @param id the id of the entity to check
         * @returns 'true' if all required components were found
         */
        isValidById(id: number): boolean;
        isOptional(entity: Entity): boolean;
        isOptionalById(id: number): boolean;
        /**
         * checks if the given component is valid for this query
         * @param component the component to check
         * @returns `true` if valid, `false` if not
         */
        isValidComponent(component: Component): boolean;
        join<T extends (typeof Component)[], V extends (typeof Component)[], W extends (typeof Component)[]>(entities: Entity[], needed?: [...T], optional?: [...V], unwanted?: [...W]): IterableIterator<JoinedResult<T, V>>;
        joinById<T extends (typeof Component)[], V extends (typeof Component)[], W extends (typeof Component)[]>(ids: number[], needed?: [...T], optional?: [...V], unwanted?: [...W]): IterableIterator<JoinedResult<T, V>>;
        joinAll<T extends (typeof Component)[], V extends (typeof Component)[], W extends (typeof Component)[]>(needed?: [...T], optional?: [...V], unwanted?: [...W]): IterableIterator<JoinedResult<T, V>>;
        retrieve(): JoinedData<T, V>;
        retrieveById(id: number): JoinedData<T, V>;
        /**
         * validates the given entity for this query
         * @param entity the entity to validate
         * @returns `true` if valid, `false` if not
         */
        validate(entity: Entity): boolean;
        /**
         * validates the given entity id for this query
         * @param id the id of the entity to validate
         * @returns `true` if valid, `false` if not
         */
        validateById(id: number): boolean;
    }
}
declare module "EntitySystem" {
    import { Bag } from "Bag";
    import { Entity } from "Entity";
    import { EcsInstance } from "EcsInstance";
    import { Query } from "Query";
    import type { ComponentOptionTuple, ComponentTuple, JoinedResult, SmartUpdate } from 'types/tuples';
    import { EntitySystemArgs } from 'types/system';
    export class EntitySystem<T extends ComponentTuple = any, Props = any, V extends ComponentOptionTuple = any, W extends ComponentTuple = any> {
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
}
declare module "SystemManager" {
    import { EcsInstance } from "EcsInstance";
    import { EntitySystem } from "EntitySystem";
    import { Bag } from "Bag";
    import { Entity } from "Entity";
    import type { ComponentOptionTuple, ComponentTuple, SmartResolve, SmartUpdate } from 'types/tuples';
    import { EntitySystemArgs, SystemRegistrationArgs } from 'types/system';
    export class SystemManager {
        private _ecsInstance;
        private _staticSystems;
        private _reactiveSystems;
        private _systemTypes;
        private _systems;
        private _nextId;
        constructor(ecsInstance: EcsInstance);
        /**
         * an array of the currently managed systems
         * memoized on startup
         */
        get systems(): EntitySystem<any, any, any, any>[];
        /**
         * WARNING this is a debug function
         * get the system registered by the specified class name
         * @param name class name of the registered system
         * @returns the registered system with the given name
         */
        getSystemByTypeName<T extends EntitySystem<any, any, any, any>>(name: string): T;
        /**
         * register a given system class
         * @param System the system class to register
         * @param args the system registration arguments
         * @returns a reference to the registered system
         */
        registerSystem<T extends ComponentTuple, V extends ComponentOptionTuple, W extends ComponentTuple, Props, Sys extends typeof EntitySystem<T, Props, V, W>, Args extends EntitySystemArgs<T, Props, V, W>>(System: Sys, args: SystemRegistrationArgs<Props>): EntitySystem<T, Props, V, W>;
        /**
         * initialize all registered systems
         */
        initializeSystems(): void;
        /**
         * load all registered systems
         */
        loadSystems(): void;
        initialResolve(entity: Entity): void;
        initialCreate(entity: Entity): void;
        /**
         * attempt to add the created entity to all registered systems
         * @param entity the entity to add
         */
        createEntity(entity: Entity): void;
        /**
         * resolve the given entity with the static systems.  if valid, will be added
         * if it doesnt already have the entity or removed if invalid
         * @param resolving the entities to resolve
         */
        resolveEntities(resolving: Bag<SmartResolve>): void;
        /**
         * delete the given entity from all registered systems
         * @param entity the deleted entity
         */
        deleteEntity(entity: Entity): void;
        /**
         * IDEA: make update work like smart resolves (should be faster)
         * notify the registered reactive systems that any entities with the
         * supplied components should be added for processing
         * @param updated the arrays of components by owner requiring updates
         */
        update(updated: Bag<Bag<SmartUpdate>>): void;
        /**
         * notify the registered reactive systems that these entities
         * should be added for processing
         * @param entity the entity to update
         */
        updateEntity(entity: Entity): void;
        reset(): void;
        /**
         * clean up all registred systems
         */
        cleanUp(): void;
    }
}
declare module "TagManager" {
    import { Entity } from "Entity";
    export class TagManager {
        private _tags;
        /**
         * gets the entity assigned to the given tag
         * @param tag the tag to retrieve
         * @returns the entity if tagged, otherwise `undefined`
         */
        getEntityByTag(tag: string): Entity | undefined;
        /**
         * tags an entity
         * @param tag the tag to use
         * @param entity the entity to tag
         */
        tagEntity(tag: string, entity: Entity): void;
        tagExists(tag: string): boolean;
        /**
         * delete the given entity from all tags
         * @param entity the entity to delete
         */
        deleteEntity(entity: Entity): void;
        /**
         * remove the given tag
         * @param tag the tag to remove
         */
        removeTag(tag: string): void;
        /**
         * clean up all tags
         */
        cleanUp(): void;
    }
}
declare module "GroupManager" {
    import { Bag } from "Bag";
    import { Entity } from "Entity";
    export class GroupManager {
        private _groups;
        constructor();
        get groups(): Record<PropertyKey, Bag<Entity>>;
        /**
         * adds a given entity to the specified group
         * @param group the group to which to add the entity
         * @param entity the entity to add
         */
        addEntityToGroup(group: string, entity: Entity): void;
        /**
         * returns the `Bag` of entities for the specified group
         * @param group the group to retrieve
         * @returns the bag for the specified group
         */
        getGroup(group: string): Bag<Entity> | undefined;
        /**
         * delete the specified entity from all groups
         * @param entity the entity to delete
         */
        deleteEntity(entity: Entity): void;
        removeEntityFromGroup(entity: Entity, group: string): void;
        /**
         * remove a specified group
         * @param group the group to remove
         */
        removeGroup(group: string): void;
        /**
         * clean up all the groups
         */
        cleanUp(): void;
    }
}
declare module "ComponentMapper" {
    import { Entity } from "Entity";
    import { Component } from "Component";
    import { EcsInstance } from "EcsInstance";
    export class ComponentMapper<T extends Component> {
        private _type;
        private _ecsInstance;
        constructor(component: new () => T, ecsInstance: EcsInstance);
        /**
         * get the component from the specified entity
         * @param entity the entity to get the component for
         * @returns the component if found, otherwise `undefined`
         */
        get(entity: Entity): T;
        getById(id: number): T;
        /**
         * get the component from the specified entity
         * @param component class of component to retrieve
         * @param entity the entity to get the component for
         * @param ecsInstance the instance from which to retrieve the component
         * @returns the component if found, otherwise `undefined`
         */
        static get<T extends typeof Component>(component: T, entity: Entity, ecsInstance: EcsInstance): InstanceType<T> | undefined;
    }
}
declare module "Scheduler" {
    import { EntitySystem } from "EntitySystem";
    export class Scheduler {
        private _systems;
        /**
         * currently scheduled systems
         */
        get systems(): EntitySystem<any, any, any, any>[];
        /**
         * set the scheduled systems
         */
        set systems(value: EntitySystem<any, any, any, any>[]);
        /**
         * clean up systems
         */
        cleanUp(): void;
        /**
         * sort the systems by priority
         */
        sortSystems(): void;
        /**
         * run the systems in order of priority
         */
        runSystems(): void;
    }
}
declare module "FuncQuery" {
    import type { EcsInstance } from "EcsInstance";
    import type { ComponentTuple, OrderedComponentTuple } from 'types/tuples';
    export class FuncQuery<T extends ComponentTuple> {
        ecs: EcsInstance;
        data: [...T];
        constructor(ecs: EcsInstance, data: [...T]);
        join(): IterableIterator<OrderedComponentTuple<T>>;
    }
}
declare module "utils" {
    import { OptionTuple, OrderedNoneTuple, OrderedOptionTuple, OrderedSomeTuple } from "types";
    export function is_some<T>(val: Option<T>): val is Some<T>;
    export function is_none<T>(val: Option<T>): val is None;
    export function is_ok<T, E extends Error>(val: Result<T, E>): val is Ok<T>;
    export function is_err<T, E extends Error>(val: Result<T, E>): val is Err<E>;
    export function all_some<T extends OptionTuple<T>>(val: OrderedOptionTuple<T>): val is OrderedSomeTuple<T>;
    export function all_none<T extends OptionTuple<T>>(val: OrderedOptionTuple<T>): val is OrderedNoneTuple<T>;
    export function lerp(a: number, b: number, percent: number): number;
    export function makeTimer(deltaMax: number): {
        begin: () => void;
        end: (text: string, ...args: any[]) => void;
        readonly delta: number;
    };
}
declare module "EntityBuilder" {
    import { EcsInstance } from "EcsInstance";
    import type { EntityBuilder } from 'types/builder';
    /**
     * creates a builder that allows you to chain calls to build up an entity
     * making creation of entities extremely easy while remaining lightweight
     * and performant.
     */
    export function makeEntityBuilder(ecs: EcsInstance): EntityBuilder;
}
declare module "EcsInstance" {
    import { EntityManager } from "EntityManager";
    import { ComponentManager } from "ComponentManager";
    import { SystemManager } from "SystemManager";
    import { TagManager } from "TagManager";
    import { GroupManager } from "GroupManager";
    import { ComponentMapper } from "ComponentMapper";
    import { Scheduler } from "Scheduler";
    import { EntitySystem } from "EntitySystem";
    import { Bag } from "Bag";
    import { FuncQuery } from "FuncQuery";
    import { Entity } from "Entity";
    import { Component } from "Component";
    import type { ComponentOptionTuple, ComponentTuple, JoinedData, JoinedResult, OrderedComponentOptionTuple, OrderedComponentTuple } from 'types/tuples';
    import type { EntityBuilder } from 'types/builder';
    import type { QueryFunc } from 'types/query';
    import type { SystemRegistrationArgs } from 'types/system';
    export class EcsInstance {
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
         * @param component a component type to use to build the mapper
         * @return a component mapper for the given component type
         */
        makeMapper<C extends Component>(component: new () => C): ComponentMapper<C>;
        /**
         * registeres a component with the component manager
         * @param component the component type to register
         */
        registerComponent<C extends typeof Component>(component: C): void;
        registerSystem<T extends ComponentTuple, V extends ComponentOptionTuple, W extends ComponentTuple, Props, Sys extends typeof EntitySystem<T, Props, V, W>>(System: Sys, args: SystemRegistrationArgs<Props>): EntitySystem<T, Props, V, W>;
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
}
declare module "ComponentManager" {
    import { Bag } from "Bag";
    import { EcsInstance } from "EcsInstance";
    import { Entity } from "Entity";
    import { Component } from "Component";
    export class ComponentManager {
        private _ecsInstance;
        private _components;
        private _nextTypeId;
        private _componentTypes;
        constructor(ecsInstance: EcsInstance);
        get allTypes(): Record<PropertyKey, typeof Component>;
        /**
         * registers the given component class
         * @param component the component class to register
         */
        registerComponent<C extends typeof Component>(component: C): void;
        /**
         * the current bag of component bags
         */
        get components(): Bag<Bag<Component>>;
        /**
         * WARNING this is a debug only function
         * gets all the components of a given entity
         * @param entity entity for which to retrieve components
         * @returns a record with component entries by type name
         */
        getAllEntityComponents(entity: Entity): Record<string, Component>;
        /**
         * WARNING this is a debug only function
         * gets all the components of a given entity
         * @param id id of entity for which to retrieve components
         * @returns a record with component entries by type name
         */
        getAllEntityComponentsById(id: number): Option<Record<string, Component>>;
        /**
         * WARNING this is a debug function
         * returns a component type by its type name
         * @param name the class name string of the component type desired
         * @returns that component type
         */
        getComponentTypeByTypeName(name: string): typeof Component;
        /**
         * gets all components of the given type
         * @param component component type to retrieve
         * @returns a bag of components of the type specified
         */
        getComponentsByType<C extends typeof Component>(component: C): Option<Bag<InstanceType<C>>>;
        /**
         * get the component for the specified entity of the specified component class
         * @param entity the owning eneity
         * @param component the class of component to retrieve
         * @returns the component for the entity or `undefined` if it doesnt exist
         */
        getComponent<C extends typeof Component>(entity: Entity, component: C): Option<InstanceType<C>>;
        /**
         * get the component for the specified entity id of the specified component class
         * @param id the id of the owning entity
         * @param component the class of component to retrieve
         * @returns the component for the entity or `undefined` if it doesnt exist
         */
        getComponentById<C extends typeof Component>(id: number, component: C): Option<InstanceType<C>>;
        getComponentByType<C extends typeof Component>(entity: Entity, type: number): Option<InstanceType<C>>;
        getComponentByTypeAndId<C extends typeof Component>(id: number, type: number): Option<InstanceType<C>>;
        /**
         * adds the given component to the entity
         * @param entity the entity to add the component to
         * @param component the component instance to add to the entity
         */
        addComponent<C extends Component>(entity: Entity, component: C): void;
        /**
         * adds the given component to the entity with the given id
         * @param id the id of the entity to which to add the component
         * @param component the component instance to add to the entity
         */
        addComponentById<C extends Component>(id: number, component: C): void;
        addComponents<C extends Component>(id: number, components: C[]): void;
        /**
         * remove all components for the given entity
         * @param entity the entity from which to remove components
         */
        removeAllComponents(entity: Entity): void;
        /**
         * remove the specific component instance from its owner
         * @param component the component instance to remove
         */
        removeComponent<C extends Component>(component: C): void;
        removeComponents<C extends Component>(components: C[]): void;
        /**
         * remove the specific component instance from its owner
         * @param component the component instance to remove
         */
        removeComponentType<C extends typeof Component>(entity: Entity, component: C): void;
        removeComponentTypeById<C extends typeof Component>(id: number, component: C): void;
        /**
         * handles the deletion of entities
         * @param entity the deleted entity
         */
        deleteEntity(entity: Entity): void;
        /**
         * does the given entity have a component of the specified type
         * @param entity the entity to check
         * @param type the component type to check
         * @returns `true` if the entity has that component, otherwise `false`
         */
        hasComponent(entity: Entity, type: number): boolean;
        /**
         * checks if the entity with he given id has a component of the specified entity type
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
        hasComponentOfTypeByTag(tag: string, component: typeof Component): boolean;
        reset(): void;
        /**
         * clean up all the managed components
         */
        cleanUp(): void;
    }
}
declare module "EcsRig" {
    import { EntitySystemArgs } from 'types/system';
    import { Component } from "Component";
    import { EcsInstance } from "EcsInstance";
    import { EntitySystem } from "EntitySystem";
    import type { ComponentOptionTuple, ComponentTuple } from 'types/tuples';
    class Bar extends Component {
        [x: string]: number;
    }
    type SystemQuery<T extends ComponentTuple, V extends ComponentOptionTuple, W extends ComponentTuple> = {
        needed: [...T];
        optional?: [...V];
        unwanted?: [...W];
    };
    export interface EcsRig {
        ecs: EcsInstance;
        makeComponentType: () => typeof Bar;
        makeSystemType: <T extends ComponentTuple, Props extends Record<PropertyKey, any>, V extends ComponentOptionTuple, W extends ComponentTuple>(queries: SystemQuery<T, V, W>) => new (props: EntitySystemArgs<T, Props, V, W>) => EntitySystem<T, Props, V, W>;
    }
    export type EcsRigCallback = (rig: EcsRig) => void;
    export default function ecsRig(callback: EcsRigCallback): void;
}
declare module "index" {
    export * from "Bag";
    export * from "Component";
    export * from "ComponentManager";
    export * from "ComponentMapper";
    export * from "EcsInstance";
    export * from "Entity";
    export * from "EntityBuilder";
    export * from "EntityManager";
    export * from "EntitySystem";
    export * from "FuncQuery";
    export * from "GroupManager";
    export * from "SystemManager";
    export * from "TagManager";
    export * from "Query";
    export * from "Scheduler";
    export * from "utils";
}
//# sourceMappingURL=index.d.ts.map