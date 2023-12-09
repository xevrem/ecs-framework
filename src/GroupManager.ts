import { Bag } from './Bag';
import { Entity } from './Entity';

export class GroupManager {
  private _groups: Record<PropertyKey, Bag<Entity>>;

  constructor() {
    this._groups = {};
  }

  get groups(): Record<PropertyKey, Bag<Entity>> {
    return this._groups;
  }

  /**
   * adds a given entity to the specified group
   * @param group the group to which to add the entity
   * @param entity the entity to add
   */
  addEntityToGroup(group: string, entity: Entity): void {
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
  getGroup(group: string): Bag<Entity> | undefined {
    return this._groups[group];
  }

  /**
   * delete the specified entity from all groups
   * @param entity the entity to delete
   */
  deleteEntity(entity: Entity): void {
    Object.values(this._groups).forEach((group: Bag<Entity>) => {
      group.remove(entity);
    });
  }

  removeEntityFromGroup(entity: Entity, group: string): void {
    const targetGroup = this._groups[group];
    if (!targetGroup) return;
    targetGroup.remove(entity);
  }

  /**
   * remove a specified group
   * @param group the group to remove
   */
  removeGroup(group: string): void {
    delete this._groups[group];
  }

  /**
   * clean up all the groups
   */
  cleanUp(): void {
    Object.keys(this._groups).forEach((key) => {
      this._groups[key].clear();
      delete this._groups[key];
    });
  }
}
