import { Bag } from './Bag';
export class GroupManager {
    constructor() {
        this._groups = {};
    }
    get groups() {
        return this._groups;
    }
    /**
     * adds a given entity to the specified group
     * @param group the group to which to add the entity
     * @param entity the entity to add
     */
    addEntityToGroup(group, entity) {
        if (!this._groups[group]) {
            this._groups[group] = new Bag();
        }
        if (!this._groups[group].includes(entity)) {
            this._groups[group].add(entity);
        }
    }
    /**
     * returns the `Bag` of entities for the specified group
     * @param group the group to retrieve
     * @returns the bag for the specified group
     */
    getGroup(group) {
        return this._groups[group];
    }
    /**
     * delete the specified entity from all groups
     * @param entity the entity to delete
     */
    deleteEntity(entity) {
        Object.values(this._groups).forEach((group) => {
            group.remove(entity);
        });
    }
    removeEntityFromGroup(entity, group) {
        const targetGroup = this._groups[group];
        if (!targetGroup)
            return;
        targetGroup.remove(entity);
    }
    /**
     * remove a specified group
     * @param group the group to remove
     */
    removeGroup(group) {
        delete this._groups[group];
    }
    /**
     * clean up all the groups
     */
    cleanUp() {
        Object.keys(this._groups).forEach((key) => {
            this._groups[key].clear();
            delete this._groups[key];
        });
    }
}
//# sourceMappingURL=GroupManager.js.map