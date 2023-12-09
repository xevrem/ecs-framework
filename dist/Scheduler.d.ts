import { EntitySystem } from './EntitySystem';
export declare class Scheduler {
    private _systems;
    /**
     * currently scheduled systems
     */
    get systems(): EntitySystem<any, any, any, any>[];
    /**
     * set the scheduled systems
     */
    set systems(value: EntitySystem<any, any, any, any>[]);
    /**
     * clean up systems
     */
    cleanUp(): void;
    /**
     * sort the systems by priority
     */
    sortSystems(): void;
    /**
     * run the systems in order of priority
     */
    runSystems(): void;
}
//# sourceMappingURL=Scheduler.d.ts.map