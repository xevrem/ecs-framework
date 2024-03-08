import { Option } from 'onsreo';
import { Entity } from './Entity';

export class TagManager {
  _tags: Map<string, Entity>;

  constructor() {
    this._tags = new Map();
  }

  /**
   * gets the entity assigned to the given tag
   * @param tag the tag to retrieve
   * @returns the entity if tagged, otherwise `undefined`
   */
  getEntityByTag(tag: string): Option<Entity> {
    return this._tags.get(tag);
  }

  /**
   * tags an entity
   * @param tag the tag to use
   * @param entity the entity to tag
   */
  tagEntity(tag: string, entity: Entity): void {
    this._tags.set(tag, entity);
  }

  tagExists(tag: string): boolean {
    return Object.hasOwn(this._tags, tag);
  }

  /**
   * delete the given entity from all tags
   * @param entity the entity to delete
   */
  deleteEntity(entity: Entity): void {
    this._tags.forEach((_entity, tag) => {
      if (this._tags.get(tag)?.id === entity.id) this._tags.delete(tag);
    });
  }

  /**
   * remove the given tag
   * @param tag the tag to remove
   */
  removeTag(tag: string): void {
    this._tags.delete(tag);
  }

  /**
   * clean up all tags
   */
  cleanUp(): void {
    this._tags.clear();
  }
}
