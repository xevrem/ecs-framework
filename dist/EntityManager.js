import { Bag } from './Bag';
import { Entity } from './Entity';
export class EntityManager {
    constructor() {
        this._entities = new Bag();
        this._oldIds = [];
        this._nextId = 0;
    }
    get entities() {
        return this._entities;
    }
    get oldIds() {
        return this._oldIds;
    }
    /**
     * create a new unique entity
     * @returns the new entity
     */
    create() {
        const entity = new Entity();
        //re-use old IDs first
        if (this._oldIds.length > 0) {
            entity.id = this._oldIds.shift();
        }
        else {
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
    getEntity(id) {
        return this._entities.get(id);
    }
    /**
     * delete an entity
     * @param entity the entity to delete
     */
    deleteEntity(entity) {
        if (!this._entities.get(entity.id))
            return; // prevent double deletion of entities
        this._oldIds.push(entity.id);
        this._entities.set(entity.id, undefined);
    }
    reset() {
        this._oldIds = [];
        this._entities.clear();
        this._nextId = 0;
    }
    /**
     * clean up the manager, clearing old ids and entities
     */
    cleanUp() {
        this._oldIds = [];
        this._entities.clear();
        this._nextId = 0;
    }
}
export default EntityManager;
//# sourceMappingURL=EntityManager.js.map