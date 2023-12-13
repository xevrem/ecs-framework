export class Scheduler {
    constructor() {
        this._systems = [];
    }
    /**
     * currently scheduled systems
     */
    get systems() {
        return this._systems;
    }
    /**
     * set the scheduled systems
     */
    set systems(value) {
        this._systems = value;
    }
    /**
     * clean up systems
     */
    cleanUp() {
        this._systems = [];
    }
    /**
     * sort the systems by priority
     */
    sortSystems() {
        this._systems.sort((a, b) => b.priority - a.priority);
    }
    /**
     * run the systems in order of priority
     */
    runSystems() {
        const systems = this._systems;
        for (let i = systems.length; i--;) {
            const system = systems[i];
            if (system.active) {
                system.processAll();
                if (system.isReactive)
                    system.entities.clear();
            }
        }
    }
}
//# sourceMappingURL=Scheduler.js.map