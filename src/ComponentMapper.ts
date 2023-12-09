import { Entity } from './Entity';
import { Component } from './Component';
import { EcsInstance } from './EcsInstance';

export class ComponentMapper<T extends Component> {
  private _type: number;
  private _ecsInstance: EcsInstance;

  constructor(component: new () => T, ecsInstance: EcsInstance) {
    this._type = new component().type;
    this._ecsInstance = ecsInstance;
  }

  /**
   * get the component from the specified entity
   * @param entity the entity to get the component for
   * @returns the component if found, otherwise `undefined`
   */
  get(entity: Entity): T {
    return this._ecsInstance.componentManager.getComponentByType(
      entity,
      this._type
    ) as T;
    // const components = this._ecsInstance.componentManager.components.get(
    //   this._type
    // );
    // if (components) {
    //   return components.get(entity.id) as T;
    // } else {
    //   return undefined;
    // }
  }

  getById(id: number): T {
    return this._ecsInstance.componentManager.getComponentByTypeAndId(
      id,
      this._type
    ) as T;
    // const components = this._ecsInstance.componentManager.components.get(
    //   this._type
    // );
    // if (components) {
    //   return components.get(id) as T;
    // } else {
    //   return undefined;
    // }
  }

  /**
   * get the component from the specified entity
   * @param component class of component to retrieve
   * @param entity the entity to get the component for
   * @param ecsInstance the instance from which to retrieve the component
   * @returns the component if found, otherwise `undefined`
   */
  static get<T extends typeof Component>(
    component: T,
    entity: Entity,
    ecsInstance: EcsInstance
  ): InstanceType<T> | undefined {
    const components = ecsInstance.componentManager.components.get(
      component.type
    );
    if (components) {
      return components.get(entity.id) as InstanceType<T>;
    } else {
      return undefined;
    }
  }
}
