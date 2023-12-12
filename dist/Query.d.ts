import { Bag } from './Bag';
import { EcsInstance } from './EcsInstance';
import { Component } from './Component';
import { Entity } from './Entity';
import { ComponentOptionTuple, ComponentTuple, JoinedData, JoinedQuery, JoinedResult } from 'types';
export declare interface QueryArgs<T extends ComponentTuple = ComponentTuple, V extends ComponentOptionTuple = ComponentOptionTuple, W extends ComponentTuple = ComponentTuple> {
    ecsInstance: EcsInstance;
    needed: [...T];
    optional?: [...V];
    unwanted?: [...W];
}
export declare class Query<T extends ComponentTuple = ComponentTuple, V extends ComponentOptionTuple = ComponentOptionTuple, W extends ComponentTuple = ComponentTuple> {
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
//# sourceMappingURL=Query.d.ts.map