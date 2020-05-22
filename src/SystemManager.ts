import { EcsInstance } from "./EcsInstance";
import { EntitySystem } from "./EntitySystem";
import { Component } from "./Component";
import { Entity } from "./Entity";

export class SystemManager {
  private __ecsInstance: EcsInstance;
  private __systems: Array<EntitySystem>;

  constructor(ecsInstance: EcsInstance) {
    this.__ecsInstance = ecsInstance;
    this.__systems = [];
  }

  get systems(): Array<EntitySystem> {
    return this.__systems;
  }

  setSystem(system: EntitySystem, ...components: Component[]): EntitySystem {
    components.forEach(component => {
      this.__ecsInstance.componentManager.registerComponent(component);
      system.componentTypes.push(component.type);
    });
    system.ecsInstance = this.__ecsInstance;
    this.__systems.push(system);
    return system;
  }

  initializeSystems(): void {
    this.__systems.forEach(system => system.initialize());
  }

  systemsLoadContent(): void {
    this.__systems.forEach(system => system.loadContent());
  }

  resolve(entity: Entity): void {
    let valid = false;

    this.__systems.forEach(system => {
      valid = true;
      system.componentTypes.forEach(type => {
        valid = valid && this.__ecsInstance.hasComponent(entity, type);
      });
      if (valid) {
        system.addEntity(entity);
      } else {
        // attempt to remove if we ever had it before
        system.removeEntity(entity);
      }
    });
  }

  deleteEntity(entity: Entity): void {
    this.__systems.forEach(system => system.removeEntity(entity));
  }

  cleanUp(): void {
    this.__systems.forEach(system => system.cleanSystem());
    this.__systems = [];
  }
}
