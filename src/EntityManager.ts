import { Bag } from './Bag';
import { Entity } from './Entity';

export class EntityManager {
  private __entities: Bag<Entity>;
  private __oldIds: Array<number>;
  private __nextId: number;

  constructor() {
    this.__entities = new Bag<Entity>();
    this.__oldIds = [];
    this.__nextId = 0;
  }

  create(): Entity {
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

  getEntityCount():number {
    return this.__entities.count;
  }

  deleteEntity(entity: Entity): void {
    this.__oldIds.push(entity.id);
    this.__entities.set(entity.id, undefined);
  }

  cleanUp(): void {
    this.__oldIds = [];
    this.__entities.clear();
  }
}

export default EntityManager;
