import { Entity } from "./Entity";
import { Component } from "./Component";
import { EcsInstance } from "./EcsInstance";


export class ComponentMapper{
  private _type: number;
  private _ecsInstance: EcsInstance;

  constructor(type: number, ecsInstance: EcsInstance) {
    this._type = type;
    this._ecsInstance = ecsInstance;
  }

  get(entity: Entity): Component {
    return this._ecsInstance.componentManager.components
      .get(this._type)
      .get(entity.id);
  }

  static get(type: number, entity: Entity, ecsInstance: EcsInstance): Component {
    return ecsInstance.componentManager.components.get(type).get(entity.id);
  }
}
