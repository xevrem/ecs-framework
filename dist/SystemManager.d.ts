import { EcsInstance } from "./EcsInstance";
import { EntitySystem } from "./EntitySystem";
import { Component } from "./Component";
import { Entity } from "./Entity";
export declare class SystemManager {
    private __ecsInstance;
    private __systems;
    constructor(ecsInstance: EcsInstance);
    get systems(): Array<EntitySystem>;
    setSystem(system: EntitySystem, ...components: Component[]): EntitySystem;
    initializeSystems(): void;
    systemsLoadContent(): void;
    resolve(entity: Entity): void;
    deleteEntity(entity: Entity): void;
    cleanUp(): void;
}
//# sourceMappingURL=SystemManager.d.ts.map