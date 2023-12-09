import { Entity } from './Entity';
export declare class TagManager {
    private _tags;
    /**
     * gets the entity assigned to the given tag
     * @param tag the tag to retrieve
     * @returns the entity if tagged, otherwise `undefined`
     */
    getEntityByTag(tag: string): Entity | undefined;
    /**
     * tags an entity
     * @param tag the tag to use
     * @param entity the entity to tag
     */
    tagEntity(tag: string, entity: Entity): void;
    tagExists(tag: string): boolean;
    /**
     * delete the given entity from all tags
     * @param entity the entity to delete
     */
    deleteEntity(entity: Entity): void;
    /**
     * remove the given tag
     * @param tag the tag to remove
     */
    removeTag(tag: string): void;
    /**
     * clean up all tags
     */
    cleanUp(): void;
}
//# sourceMappingURL=TagManager.d.ts.map