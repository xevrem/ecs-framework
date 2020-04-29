import { Bag } from './Bag';
import { Entity } from './Entity';

export class EntityManager {
  constructor(ecsInstance) {
    this.__ecsInstance = ecsInstance;
    this.__entities = new Bag();
    this.__oldIds = [];
    this.__nextId = 0;
  }

  create() {
    const entity = new Entity();
    //re-use old IDs first
    if (this.__oldIds.length > 0) {
      entity.id = this.__oldIds.shift();
    } else {
      entity.id = this.__nextId++;
    }
    //add to entities, and return a reference
    this.__entities.set(entity.id, entity);
    return entity;
  }

  getEntityCount() {
    return this.__entities.count;
  }

  deleteEntity(entity) {
    this.__oldIds.push(entity.id);
    this.__entities.set(entity.id, undefined);
  }

  cleanUp() {
    this.__oldIds = [];
    this.__entities.clear();
  }
}

export default EntityManager;
