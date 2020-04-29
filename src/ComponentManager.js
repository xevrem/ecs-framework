import { Bag } from './Bag';

export class ComponentManager {
  constructor(ecsInstance) {
    this.__ecsInstance = ecsInstance;
    this.__components = new Bag();
    this.__nextTypeId = 0;
  }

  registerComponent(component) {
    if (!(component.type >= 0)) {
      component.type = this.__nextTypeId++;
    }
    if (component.type < this.__components.capacity) {
      if (this.__components.get(component.type) === undefined) {
        this.__components.set(component.type, new Bag());
      }
    } else {
      this.__components.set(component.type, new Bag());
    }
  }

  get components() {
    return this.__components;
  }

  getComponent(entity, component) {
    return this.__components.get(component.type).get(entity.id);
  }

  addComponent(entity, component) {
    component.owner = entity.id;
    this.__components.get(component.type).set(entity.id, component);
  }

  removeComponents(entity) {
    for (let i = 0; i < this.__components.count; i++) {
      this.__components.get(i).set(entity.id, undefined);
    }
  }

  removeComponent(component) {
    this.__components.get(component.type).set(component.owner, undefined);
  }

  deleteEntity(entity) {
    this.removeComponents(entity);
  }

  hasComponent(entity, type) {
    if (type < this.__components.capacity) {
      if (entity.id < this.__components.get(type).capacity) {
        if (this.__components.get(type).get(entity.id) !== undefined) {
          return true;
        }
      }
    }
    return false;
  }

  cleanUp() {
    for (let i = 0; i < this.__components.count; i++) {
      if (this.__components.get(i) !== undefined) {
        this.__components.get(i).clear();
      }
    }
  }
}
