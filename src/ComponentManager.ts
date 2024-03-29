import { type Option, is_some } from 'onsreo';
import { Bag } from './Bag';
import { EcsInstance } from './EcsInstance';
import { Entity } from './Entity';
import { Component } from './Component';
import { proxify } from './Proxify';

export class ComponentManager {
  private _ecsInstance: EcsInstance;
  private _components: Bag<Bag<Component>>;
  private _nextTypeId: number;
  private _componentTypes: Map<string, typeof Component>;

  constructor(ecsInstance: EcsInstance) {
    this._ecsInstance = ecsInstance;
    this._components = new Bag<Bag<Component>>();
    this._nextTypeId = 0;
    this._componentTypes = new Map();
  }

  get allTypes(): Map<string, typeof Component> {
    return this._componentTypes;
  }

  /**
   * registers the given component class
   * @param component the component class to register
   */
  registerComponent<C extends typeof Component>(component: C): void {
    if (component.type < 0) {
      component.type = this._nextTypeId++;
      this._componentTypes.set(component.name, component);
    } else if (!this._componentTypes.has(component.name)) {
      this._componentTypes.set(component.name, component);
    }
    if (!this._components.has(component.type)) {
      this._components.set(component.type, new Bag<Component>());
    }
  }

  /**
   * the current bag of component bags
   */
  get components(): Bag<Bag<Component>> {
    return this._components;
  }

  /**
   * WARNING this is a debug only function
   * gets all the components of a given entity
   * @param entity entity for which to retrieve components
   * @returns a record with component entries by type name
   */
  getAllEntityComponents(entity: Entity): Record<string, Component> {
    const allComponents: Record<string, Component> = {};
    this._components.forEach(components => {
      if (!components) return;
      const component = components.get(entity.id);
      if (!component) return;
      allComponents[component.constructor.name] = component;
    });
    return allComponents;
  }

  /**
   * WARNING this is a debug only function
   * gets all the components of a given entity
   * @param id id of entity for which to retrieve components
   * @returns a record with component entries by type name
   */
  getAllEntityComponentsById(id: number): Option<Record<string, Component>> {
    const entity = this._ecsInstance.getEntity(id);
    if (!entity) return undefined;
    return this.getAllEntityComponents(entity);
  }

  /**
   * WARNING this is a debug function
   * returns a component type by its type name
   * @param name the class name string of the component type desired
   * @returns that component type
   */
  getComponentTypeByTypeName<C extends typeof Component>(
    name: string,
  ): Option<C> {
    return this._componentTypes.get(name) as Option<C>;
  }

  /**
   * gets all components of the given type
   * @param component component type to retrieve
   * @returns a bag of components of the type specified
   */
  getComponentsByType<C extends typeof Component>(
    component: Option<C>,
  ): Option<Bag<InstanceType<C>>> {
    return is_some(component)
      ? this._components.get(component.type)
      : undefined;
  }

  /**
   * get the component for the specified entity of the specified component class
   * @param entity the owning eneity
   * @param component the class of component to retrieve
   * @returns the component for the entity or `undefined` if it doesnt exist
   */
  getComponent<C extends typeof Component>(
    entity: Entity,
    component: Option<C>,
  ): Option<InstanceType<C>> {
    return is_some(component)
      ? this._components.get(component.type)?.get(entity.id)
      : undefined;
  }

  /**
   * get the component for the specified entity id of the specified component class
   * @param id the id of the owning entity
   * @param component the class of component to retrieve
   * @returns the component for the entity or `undefined` if it doesnt exist
   */
  getComponentById<C extends typeof Component>(
    id: number,
    component: Option<C>,
  ): Option<InstanceType<C>> {
    return is_some(component)
      ? this._components.get(component.type)?.get(id)
      : undefined;
  }

  getComponentOfTypeId<C extends typeof Component>(
    entity: Entity,
    typeId: number,
  ): Option<InstanceType<C>> {
    return this._components.get(typeId)?.get(entity.id);
  }

  getComponentByIdOfTypeId<C extends typeof Component>(
    id: number,
    typeId: number,
  ): Option<InstanceType<C>> {
    return this._components.get(typeId)?.get(id);
  }

  /**
   * adds the given component to the entity
   * @param entity - the entity to add the component to
   * @param component - the component instance to add to the entity
   * @param auto - whether to enable auto-update for this component [default: false]
   */
  addComponent<C extends Component>(
    entity: Entity,
    component: C,
    auto: boolean = false,
  ): void {
    this.addComponentById(entity.id, component, auto);
  }

  /**
   * adds the given component to the entity with the given id
   * @param id - the id of the entity to which to add the component
   * @param component - the component instance to add to the entity
   * @param auto - whether to enable auto-update for this component [default: false]
   */
  addComponentById<C extends Component>(
    id: number,
    component: C,
    auto: boolean = false,
  ): void {
    component.owner = id;
    if (auto) {
      proxify(component, this._ecsInstance, ['type', 'owner']);
      this._components
        .get(component.type)
        ?.set(id, proxify(component, this._ecsInstance, ['type', 'owner']));
    } else {
      this._components.get(component.type)?.set(id, component);
    }
  }

  /**
   * @param id - the id of the entity to which to add the component
   * @param components - the components to add to the entity
   * @param auto - whether to enable auto-update for these components [default: false]
   */
  addComponentsById<C extends Component>(
    id: number,
    components: C[],
    auto: boolean = false,
  ): void {
    for (let i = components.length; i--; ) {
      this.addComponentById(id, components[i], auto);
    }
  }

  /**
   * remove all components for the given entity
   * @param entity the entity from which to remove components
   */
  removeAllComponents(entity: Entity): void {
    for (let i = 0; i < this._components.length; i++) {
      this._components.get(i)?.set(entity.id, undefined);
    }
  }

  /**
   * remove the specific component instance from its owner
   * @param component the component instance to remove
   */
  removeComponent<C extends Component>(component: C): void {
    this._components.get(component.type)?.set(component.owner, undefined);
  }

  removeComponents<C extends Component>(components: C[]): void {
    for (const component of components) {
      this._components.get(component.type)?.set(component.owner, undefined);
    }
  }

  /**
   * remove the specific component instance from its owner
   * @param component the component instance to remove
   */
  removeComponentType<C extends typeof Component>(
    entity: Entity,
    component: C,
  ): void {
    this._components.get(component.type)?.set(entity.id, undefined);
  }

  removeComponentTypeById<C extends typeof Component>(
    id: number,
    component: C,
  ): void {
    this._components.get(component.type)?.set(id, undefined);
  }

  /**
   * handles the deletion of entities
   * @param entity the deleted entity
   */
  deleteEntity(entity: Entity): void {
    this.removeAllComponents(entity);
  }

  /**
   * does the given entity have a component of the specified typeId
   * @param entity the entity to check
   * @param typeId the component type to check
   * @returns `true` if the entity has that component, otherwise `false`
   */
  hasComponentOfTypeId(entity: Entity, typeId: number): boolean {
    if (typeId < this._components.capacity) {
      return this._components.get(typeId)?.has(entity.id) ?? false;
    }
    return false;
  }

  /**
   * does the given entity have a component of the specified type
   * @param entity the entity to check
   * @param type the component type to check
   * @returns `true` if the entity has that component, otherwise `false`
   */
  hasComponent<C extends typeof Component>(
    entity: Entity,
    componentType: Option<C>,
  ): boolean {
    return (
      is_some(componentType) &&
      this.hasComponentOfTypeId(entity, componentType.type)
    );
  }

  /**
   * checks if the entity with he given id has a component of the specified typeId
   * @param id the id of the entity to check
   * @param typeId the type field of the component to check
   * @returns `true` if the entity has the component otherwise `false`
   */
  hasComponentByIdOfTypeId(id: number, typeId: number): boolean {
    return this._components.get(typeId)?.has(id) ?? false;
  }

  /**
   * checks if the entity with he given id has a component of the specified type
   * @param id the id of the entity to check
   * @param type the type field of the component to check
   * @returns `true` if the entity has the component otherwise `false`
   */
  hasComponentById<C extends typeof Component>(
    id: number,
    componentType: Option<C>,
  ): boolean {
    return (
      is_some(componentType) &&
      this.hasComponentByIdOfTypeId(id, componentType.type)
    );
  }

  /**
   * checks if the tagged entity has a component of the specified entity type
   * @param tag the tagged entity to check
   * @param typeId the type field of the component to check
   * @returns `true` if the entity has the component otherwise `false`
   */
  hasComponentByTagOfTypeId(tag: string, typeId: number): boolean {
    const entity = this._ecsInstance.getEntityByTag(tag);
    return (
      is_some(entity) && (this._components.get(typeId)?.has(entity.id) ?? false)
    );
  }

  /**
   * checks if the tagged entity has a component of the specified entity type
   * @param tag the tagged entity to check
   * @param component the componen type to check
   * @returns `true` if the entity has the component otherwise `false`
   */
  hasComponentByTag<C extends typeof Component>(
    tag: string,
    component: Option<C>,
  ): boolean {
    return (
      is_some(component) && this.hasComponentByTagOfTypeId(tag, component.type)
    );
  }

  reset(): void {
    for (let i = 0; i < this._components.length; i++) {
      const components = this._components.get(i);
      if (components) {
        components.clear();
      }
    }
  }

  /**
   * clean up all the managed components
   */
  cleanUp(): void {
    for (let i = 0; i < this._components.length; i++) {
      this._components.get(i)?.clear();
    }
    this._components.clear();
    // reset the types
    this._componentTypes.forEach(componentType => {
      componentType.type = -1;
    });
    this._componentTypes.clear();
    this._nextTypeId = 0;
  }
}
