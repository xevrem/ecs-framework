import { Bag } from './Bag';
import { EcsInstance } from './EcsInstance';
import { Entity } from './Entity';
import { Component } from './Component';
import { Option } from 'types';
export declare class ComponentManager {
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
//# sourceMappingURL=ComponentManager.d.ts.map