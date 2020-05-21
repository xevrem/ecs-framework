import { Entity } from './Entity';

interface Tags {
  [key: string]: Entity
}

export class TagManager {
  private __tags: Tags = {};

  getEntityByTag(tag: string): Entity {
    return this.__tags[tag];
  }

  tagEntity(tag: string, entity: Entity): void {
    this.__tags[tag] = entity;
  }

  // refresh(entity: Entity) {}

  deleteEntity(entity: Entity): void {
    Object.keys(this.__tags).forEach(key => {
      if (this.__tags[key] === entity) delete this.__tags[key];
    });
  }

  cleanUp(): void {
    this.__tags = {};
  }
}
