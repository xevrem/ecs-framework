import { Bag } from './Bag';

export class EntitySystem {
  __componentTypes = [];
  __entities = new Bag();
  __ecsInstance = null;

  get ecsInstance() {
    return this.__ecsInstance;
  }

  set ecsInstance(value) {
    this.__ecsInstance = value;
  }

  get componentTypes() {
    return this.__componentTypes;
  }

  set componentTypes(value) {
    this.__componentTypes = value;
  }

  loadContent() {
    this.preLoadContent(this.__entities);
  }

  removeEntity(entity) {
    if (this.__entities.remove(entity)) this.removed(entity);
  }

  addEntity(entity) {
    if (!this.__entities.contains(entity, (a, b) => b && a.id === b.id)) {
      this.__entities.add(entity);
      this.added(entity);
    } else {
      this.updated(entity);
    }
  }

  cleanSystem() {
    this.cleanUp(this.__entities);
    this.__entities.clear();
  }

  processAll() {
    if (this.shouldProcess()) {
      this.begin();
      this.processEntities(this.__entities);
      this.end();
    }
  }

  processEntities(entities) {
    entities.forEach(entity => {
      entity && this.process(entity, this.__ecsInstance.delta);
    });
  }

  shouldProcess() {
    return true;
  }

  //overloadable functions
  initialize() {}
  preLoadContent(entities) {}
  removed(entity) {}
  added(entity) {}
  updated(entity) {}
  cleanUp(entities) {}
  begin() {}
  end() {}
  process(entity) {}
}
