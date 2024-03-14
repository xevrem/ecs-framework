import { Option } from 'onsreo';
import { Bag } from './Bag';
import { Entity } from './Entity';

export class GroupManager {
  private _groups: Map<PropertyKey, Bag<Entity>>;

  constructor() {
    this._groups = new Map();
  }

  get groups(): Map<PropertyKey, Bag<Entity>> {
    return this._groups;
  }

  /**
   * adds a given entity to the specified group
   * @param group the group to which to add the entity
   * @param entity the entity to add
   */
  addEntityToGroup(group: string, entity: Entity): void {
    if (!this._groups.has(group)) {
      this._groups.set(group, new Bag());
    }

    if (!this._groups.get(group)?.includes(entity)) {
      this._groups.get(group)?.add(entity);
    }
  }

  /**
   * returns the `Bag` of entities for the specified group
   * @param group the group to retrieve
   * @returns the bag for the specified group
   */
  getGroup(group: string): Option<Bag<Entity>> {
    return this._groups.get(group);
  }

  /**
   * delete the specified entity from all groups
   * @param entity the entity to delete
   */
  deleteEntity(entity: Entity): void {
    this._groups.forEach(group => group.remove(entity));
  }

  removeEntityFromGroup(entity: Entity, group: string): void {
    this._groups.get(group)?.remove(entity);
  }

  /**
   * remove a specified group
   * @param group the group to remove
   */
  removeGroup(group: string): void {
    this._groups.delete(group);
  }

  /**
   * clean up all the groups
   */
  cleanUp(): void {
    this._groups.forEach((group, key) => {
      group.clear();
      this._groups.delete(key);
    });
  }
}
