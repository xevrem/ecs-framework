import { EcsInstance } from './EcsInstance';
import { EntitySystem } from './EntitySystem';
import { Bag } from './Bag';
import { Entity } from './Entity';
import type { ComponentOptionTuple, ComponentTuple, SmartResolve, SmartUpdate } from 'types/tuples';
import { EntitySystemArgs, SystemRegistrationArgs } from 'types/system';
export declare class SystemManager {
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
//# sourceMappingURL=SystemManager.d.ts.map