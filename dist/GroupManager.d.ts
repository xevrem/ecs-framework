import { Bag } from './Bag';
import { Entity } from './Entity';
export declare class GroupManager {
    private __groups;
    addEntityToGroup(group: string, entity: Entity): void;
    getGroup(group: string): Bag<Entity>;
    deleteEntity(entity: Entity): void;
    cleanUp(): void;
}
