import { Bag } from 'Bag';

export class GroupManager {
  constructor() {
    this.__groups = {};
  }

  addEntityToGroup(group, entity) {
    if (!this.__groups.hasOwnProperty(group)) {
      this.__groups[group] = new Bag();
    }

    if (!this.__groups[group].contains(entity)) {
      this.__groups[group].add(entity);
    }
  }

  getGroup(group) {
    return this.__groups[group];
  }

  refresh(entity) {}

  deleteEntity(entity) {
    Object.values(this.__groups).forEach(group => {
      group.remove(entity);
    });
  }

  cleanUp() {
    Object.keys(this.__groups).forEach(key => {
      this.__groups[key].clear();
      delete this.__groups[key];
    });
  }
}
