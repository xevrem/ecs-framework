import { Entity } from './Entity';

interface Tags {
  [key: string]: Entity;
}

export class TagManager {
  private __tags: Tags = {};

  getEntityByTag(tag: string): Entity {
    return this.__tags[tag];
  }

  tagEntity(tag: string, entity: Entity): void {
    this.__tags[tag] = entity;
  }

  deleteEntity(entity: Entity): void {
    Object.keys(this.__tags).forEach(key => {
      if (this.__tags[key].id === entity.id) delete this.__tags[key];
    });
  }

  removeTag(tag: string) {
    delete this.__tags[tag];
  }

  cleanUp(): void {
    this.__tags = {};
  }
}

