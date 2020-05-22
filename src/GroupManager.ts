import { Bag } from './Bag';

import { Entity } from './Entity';

export type GroupType = {
  [key: string]: Bag<Entity>
};

export class GroupManager {
  private _groups: GroupType; // {
  //   [key: string]: Bag<Entity>
  // } = {};

  addEntityToGroup(group: string, entity: Entity): void {
    if (!this._groups.hasOwnProperty(group)) {
      this._groups[group] = new Bag();
    }

    if (!this._groups[group].contains(entity)) {
      this._groups[group].add(entity);
    }
  }

  getGroup(group: string): Bag<Entity> {
    return this._groups[group];
  }

  // refresh(entity) { }

  deleteEntity(entity: Entity): void {
    Object.values(this._groups).forEach((group: Bag<Entity>) => {
      group.remove(entity);
    });
  }

  cleanUp(): void {
    Object.keys(this._groups).forEach(key => {
      this._groups[key].clear();
      delete this._groups[key];
    });
  }
}
