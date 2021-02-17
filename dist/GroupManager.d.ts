import { Bag } from './Bag';
import { Entity } from './Entity';
export declare type GroupType = {
    [key: string]: Bag<Entity>;
};
export declare class GroupManager {
    private _groups;
    addEntityToGroup(group: string, entity: Entity): void;
    getGroup(group: string): Bag<Entity>;
    deleteEntity(entity: Entity): void;
    cleanUp(): void;
}
//# sourceMappingURL=GroupManager.d.ts.map