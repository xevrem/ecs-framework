import { Entity } from "./Entity";
import { Component } from "./Component";
import { EcsInstance } from "./EcsInstance";


export class ComponentMapper {
  private _type: number;
  private _ecsInstance: EcsInstance;

  constructor(component: Component, ecsInstance: EcsInstance) {
    this._type = component.type;
    this._ecsInstance = ecsInstance;
  }

  get(entity: Entity): Component {
    return this._ecsInstance.componentManager.components
      .get(this._type)
      .get(entity.id);
  }

  static get(component: Component, entity: Entity, ecsInstance: EcsInstance): Component {
    return ecsInstance.componentManager.components.get(component.type).get(entity.id);
  }
}
