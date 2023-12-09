import { Bag } from './Bag';
import { Entity } from './Entity';

export class EntityManager {
  private _entities: Bag<Entity>;
  private _oldIds: number[];
  private _nextId: number;

  constructor() {
    this._entities = new Bag<Entity>();
    this._oldIds = [];
    this._nextId = 0;
  }

  get entities(): Bag<Entity> {
    return this._entities;
  }

  get oldIds(): Array<number> {
    return this._oldIds;
  }

  /**
   * create a new unique entity
   * @returns the new entity
   */
  create(): Entity {
    const entity = new Entity();
    //re-use old IDs first
    if (this._oldIds.length > 0) {
      entity.id = this._oldIds.shift() as number;
    } else {
      entity.id = this._nextId++;
    }
    //add to entities, and return a reference
    this._entities.set(entity.id, entity);
    return entity;
  }

  /**
   * returns the entity with the spcified `id` if it exists
   * @param id the id of the entity requested
   * @returns the requried entity if found or `undefined`
   */
  getEntity(id: number): Option<Entity> {
    return this._entities.get(id);
  }

  /**
   * delete an entity
   * @param entity the entity to delete
   */
  deleteEntity(entity: Entity): void {
    if (!this._entities.get(entity.id)) return; // prevent double deletion of entities
    this._oldIds.push(entity.id);
    this._entities.set(entity.id, undefined);
  }

  reset(): void {
    this._oldIds = [];
    this._entities.clear();
    this._nextId = 0;
  }

  /**
   * clean up the manager, clearing old ids and entities
   */
  cleanUp(): void {
    this._oldIds = [];
    this._entities.clear();
    this._nextId = 0;
  }
}

export default EntityManager;
