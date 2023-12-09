import { Entity } from './Entity';

export class TagManager {
  private _tags: Record<string, Entity> = {};

  /**
   * gets the entity assigned to the given tag
   * @param tag the tag to retrieve
   * @returns the entity if tagged, otherwise `undefined`
   */
  getEntityByTag(tag: string): Entity | undefined {
    return this._tags[tag];
  }

  /**
   * tags an entity
   * @param tag the tag to use
   * @param entity the entity to tag
   */
  tagEntity(tag: string, entity: Entity): void {
    this._tags[tag] = entity;
  }

  tagExists(tag: string): boolean {
    return Object.hasOwn(this._tags, tag);
  }

  /**
   * delete the given entity from all tags
   * @param entity the entity to delete
   */
  deleteEntity(entity: Entity): void {
    Object.keys(this._tags).forEach((key) => {
      if (this._tags[key].id === entity.id) delete this._tags[key];
    });
  }

  /**
   * remove the given tag
   * @param tag the tag to remove
   */
  removeTag(tag: string): void {
    delete this._tags[tag];
  }

  /**
   * clean up all tags
   */
  cleanUp(): void {
    this._tags = {};
  }
}
