import { Entity } from './Entity';
export declare class EntityManager {
    private __entities;
    private __oldIds;
    private __nextId;
    constructor();
    create(): Entity;
    getEntityCount(): number;
    deleteEntity(entity: Entity): void;
    cleanUp(): void;
}
export default EntityManager;
//# sourceMappingURL=EntityManager.d.ts.map