import { Bag } from './Bag';
import { Entity } from './Entity';
export declare class GroupManager {
    private _groups;
    constructor();
    get groups(): Record<PropertyKey, Bag<Entity>>;
    /**
     * adds a given entity to the specified group
     * @param group the group to which to add the entity
     * @param entity the entity to add
     */
    addEntityToGroup(group: string, entity: Entity): void;
    /**
     * returns the `Bag` of entities for the specified group
     * @param group the group to retrieve
     * @returns the bag for the specified group
     */
    getGroup(group: string): Bag<Entity> | undefined;
    /**
     * delete the specified entity from all groups
     * @param entity the entity to delete
     */
    deleteEntity(entity: Entity): void;
    removeEntityFromGroup(entity: Entity, group: string): void;
    /**
     * remove a specified group
     * @param group the group to remove
     */
    removeGroup(group: string): void;
    /**
     * clean up all the groups
     */
    cleanUp(): void;
}
//# sourceMappingURL=GroupManager.d.ts.map