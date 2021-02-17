import { Bag } from './Bag';
import { Component } from './Component';
import { EcsInstance } from './EcsInstance';
import { Entity } from './Entity';

export class ComponentManager {
  __ecsInstance: EcsInstance;
  __components: Bag<Bag<Component>>;
  __nextTypeId: number;

  constructor(ecsInstance: EcsInstance) {
    this.__ecsInstance = ecsInstance;
    this.__components = new Bag<Bag<Component>>();
    this.__nextTypeId = 0;
  }

  registerComponent(component: Component): void {
    if (!(component.type >= 0)) {
      component.type = this.__nextTypeId++;
    }
    if (component.type < this.__components.capacity) {
      if (this.__components.get(component.type) === undefined) {
        this.__components.set(component.type, new Bag<Component>());
      }
    } else {
      this.__components.set(component.type, new Bag<Component>());
    }
  }

  get components(): Bag<Bag<Component>> {
    return this.__components;
  }

  getComponent(entity: Entity, component: Component): Component {
    return this.__components.get(component.type).get(entity.id);
  }

  addComponent(entity: Entity, component: Component): void {
    component.owner = entity.id;
    this.__components.get(component.type).set(entity.id, component);
  }

  removeComponents(entity: Entity): void {
    for (let i = 0; i < this.__components.count; i++) {
      this.__components.get(i).set(entity.id, undefined);
    }
  }

  removeComponent(component: Component): void {
    this.__components.get(component.type).set(component.owner, undefined);
  }

  deleteEntity(entity: Entity): void {
    this.removeComponents(entity);
  }

  hasComponent(entity: Entity, type: number): boolean {
    if (type < this.__components.capacity) {
      if (entity.id < this.__components.get(type).capacity) {
        if (this.__components.get(type).get(entity.id) !== undefined) {
          return true;
        }
      }
    }
    return false;
  }

  cleanUp(): void {
    for (let i = 0; i < this.__components.count; i++) {
      if (this.__components.get(i) !== undefined) {
        this.__components.get(i).clear();
      }
    }
  }
}
