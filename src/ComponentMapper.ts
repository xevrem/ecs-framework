import { Entity } from "Entity";
import { Component } from "Component";
import { EcsInstance } from "EcsInstance";

export class ComponentMapper {
  private __type: number;
  private __ecsInstance: EcsInstance;
 
  constructor(component: Component, ecsInstance: EcsInstance) {
    this.__type = component.type;
    this.__ecsInstance = ecsInstance;
  }

  get(entity: Entity ): Component {
    return this.__ecsInstance.componentManager.components
      .get(this.__type)
      .get(entity.id);
  }

  static get(type: number, entity: Entity, ecsInstance: EcsInstance): Component {
    return ecsInstance.componentManager.components.get(type).get(entity.id);
  }
}
