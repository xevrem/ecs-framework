import { Bag } from './Bag';

import { Entity } from './Entity';


export class GroupManager {
  private __groups: {
    [key: string]: Bag<Entity>
  } = {};

  addEntityToGroup(group: string, entity: Entity): void {
    if (!this.__groups.hasOwnProperty(group)) {
      this.__groups[group] = new Bag();
    }

    if (!this.__groups[group].contains(entity)) {
      this.__groups[group].add(entity);
    }
  }

  getGroup(group: string): Bag<Entity> {
    return this.__groups[group];
  }

  // refresh(entity) { }

  deleteEntity(entity: Entity): void {
    Object.values(this.__groups).forEach((group: Bag<Entity>) => {
      group.remove(entity);
    });
  }

  cleanUp(): void {
    Object.keys(this.__groups).forEach(key => {
      this.__groups[key].clear();
      delete this.__groups[key];
    });
  }
}
