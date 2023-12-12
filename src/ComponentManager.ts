import { Bag } from './Bag';
import { EcsInstance } from './EcsInstance';
import { Entity } from './Entity';
import { Component } from './Component';
import { Option } from './types';

export class ComponentManager {
  private _ecsInstance: EcsInstance;
  private _components: Bag<Bag<Component>>;
  private _nextTypeId: number;
  private _componentTypes: Record<PropertyKey, typeof Component> = {};

  constructor(ecsInstance: EcsInstance) {
    this._ecsInstance = ecsInstance;
    this._components = new Bag<Bag<Component>>();
    this._nextTypeId = 0;
  }

  get allTypes(): Record<PropertyKey, typeof Component> {
    return this._componentTypes;
  }

  /**
   * registers the given component class
   * @param component the component class to register
   */
  registerComponent<C extends typeof Component>(component: C): void {
    if (component.type < 0) {
      component.type = this._nextTypeId++;
      this._componentTypes[component.name] = component;
    } else if (!this._componentTypes[component.name]) {
      this._componentTypes[component.name] = component;
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
  getComponentTypeByTypeName(name: string): typeof Component {
    return this._componentTypes[name];
  }

  /**
   * gets all components of the given type
   * @param component component type to retrieve
   * @returns a bag of components of the type specified
   */
  getComponentsByType<C extends typeof Component>(
    component: C
  ): Option<Bag<InstanceType<C>>> {
    return this._components.get(component.type);
  }

  /**
   * get the component for the specified entity of the specified component class
   * @param entity the owning eneity
   * @param component the class of component to retrieve
   * @returns the component for the entity or `undefined` if it doesnt exist
   */
  getComponent<C extends typeof Component>(
    entity: Entity,
    component: C
  ): Option<InstanceType<C>> {
    return this._components.get(component.type)?.get(entity.id);
  }

  /**
   * get the component for the specified entity id of the specified component class
   * @param id the id of the owning entity
   * @param component the class of component to retrieve
   * @returns the component for the entity or `undefined` if it doesnt exist
   */
  getComponentById<C extends typeof Component>(
    id: number,
    component: C
  ): Option<InstanceType<C>> {
    return this._components.get(component.type)?.get(id);
  }

  getComponentByType<C extends typeof Component>(
    entity: Entity,
    type: number
  ): Option<InstanceType<C>> {
    const components = this._components.get(type);
    return components ? components.get(entity.id) : undefined;
  }

  getComponentByTypeAndId<C extends typeof Component>(
    id: number,
    type: number
  ): Option<InstanceType<C>> {
    const components = this._components.get(type);
    return components ? components.get(id) : undefined;
  }

  /**
   * adds the given component to the entity
   * @param entity the entity to add the component to
   * @param component the component instance to add to the entity
   */
  addComponent<C extends Component>(entity: Entity, component: C): void {
    component.owner = entity.id;
    const components = this._components.get(component.type);
    if (components) {
      components.set(entity.id, component);
    }
  }

  /**
   * adds the given component to the entity with the given id
   * @param id the id of the entity to which to add the component
   * @param component the component instance to add to the entity
   */
  addComponentById<C extends Component>(id: number, component: C): void {
    component.owner = id;
    const components = this._components.get(component.type);
    if (components) {
      components.set(id, component);
    }
  }

  addComponents<C extends Component>(id: number, components: C[]): void {
    for (let i = components.length; i--; ) {
      this.addComponentById(id, components[i]);
    }
  }

  /**
   * remove all components for the given entity
   * @param entity the entity from which to remove components
   */
  removeAllComponents(entity: Entity): void {
    for (let i = 0; i < this._components.length; i++) {
      const components = this._components.get(i);
      if (components) {
        components.set(entity.id, undefined);
      }
    }
  }

  /**
   * remove the specific component instance from its owner
   * @param component the component instance to remove
   */
  removeComponent<C extends Component>(component: C): void {
    const components = this._components.get(component.type);
    if (components) {
      components.set(component.owner, undefined);
    }
  }

  removeComponents<C extends Component>(components: C[]): void {
    for (const component of components) {
      this._components.get(component.type)?.set(component.owner, undefined);
      // const bag = this._components.get(component.type);
      // if (bag) {
      //   bag.set(component.owner, undefined);
      // }
    }
  }

  /**
   * remove the specific component instance from its owner
   * @param component the component instance to remove
   */
  removeComponentType<C extends typeof Component>(
    entity: Entity,
    component: C
  ): void {
    const components = this._components.get(component.type);
    if (components) {
      components.set(entity.id, undefined);
    }
  }

  removeComponentTypeById<C extends typeof Component>(
    id: number,
    component: C
  ): void {
    const components = this._components.get(component.type);
    if (components) {
      components.set(id, undefined);
    }
  }

  /**
   * handles the deletion of entities
   * @param entity the deleted entity
   */
  deleteEntity(entity: Entity): void {
    this.removeAllComponents(entity);
  }

  /**
   * does the given entity have a component of the specified type
   * @param entity the entity to check
   * @param type the component type to check
   * @returns `true` if the entity has that component, otherwise `false`
   */
  hasComponent(entity: Entity, type: number): boolean {
    if (type < this._components.capacity) {
      return this._components.get(type)?.has(entity.id) ?? false;
    }
    return false;
  }

  /**
   * checks if the entity with he given id has a component of the specified entity type
   * @param id the id of the entity to check
   * @param type the type field of the component to check
   * @returns `true` if the entity has the component otherwise `false`
   */
  hasComponentById(id: number, type: number): boolean {
    if (type < this._components.capacity) {
      return this._components.get(type)?.has(id) ?? false;
    }
    return false;
  }

  /**
   * checks if the tagged entity has a component of the specified entity type
   * @param tag the tagged entity to check
   * @param type the type field of the component to check
   * @returns `true` if the entity has the component otherwise `false`
   */
  hasComponentByTag(tag: string, type: number): boolean {
    const entity = this._ecsInstance.getEntityByTag(tag);
    if (!entity) return false;
    return !!this._components.get(type)?.get(entity.id) ?? false;
  }

  /**
   * checks if the tagged entity has a component of the specified entity type
   * @param tag the tagged entity to check
   * @param component the componen type to check
   * @returns `true` if the entity has the component otherwise `false`
   */
  hasComponentOfTypeByTag(tag: string, component: typeof Component): boolean {
    const entity = this._ecsInstance.tagManager.getEntityByTag(tag);
    if (!entity) return false;
    return !!this._components.get(component.type)?.get(entity.id) ?? false;
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
      const components = this._components.get(i);
      if (components) {
        components.clear();
      }
    }
    this._components.clear();
    // reset the types
    // Object.values(this._componentTypes).forEach((component) => {
    //   component.type = -1;
    // });
    this._componentTypes = {};
    this._nextTypeId = 0;
  }
}
