import { Entity } from './Entity';
export declare class TagManager {
    private __tags;
    getEntityByTag(tag: string): Entity;
    tagEntity(tag: string, entity: Entity): void;
    deleteEntity(entity: Entity): void;
    cleanUp(): void;
}
//# sourceMappingURL=TagManager.d.ts.map