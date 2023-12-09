import { Bag } from './Bag';
import { Entity } from './Entity';
export declare class EntityManager {
    private _entities;
    private _oldIds;
    private _nextId;
    constructor();
    get entities(): Bag<Entity>;
    get oldIds(): Array<number>;
    /**
     * create a new unique entity
     * @returns the new entity
     */
    create(): Entity;
    /**
     * returns the entity with the spcified `id` if it exists
     * @param id the id of the entity requested
     * @returns the requried entity if found or `undefined`
     */
    getEntity(id: number): Option<Entity>;
    /**
     * delete an entity
     * @param entity the entity to delete
     */
    deleteEntity(entity: Entity): void;
    reset(): void;
    /**
     * clean up the manager, clearing old ids and entities
     */
    cleanUp(): void;
}
export default EntityManager;
//# sourceMappingURL=EntityManager.d.ts.map