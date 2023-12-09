import { EntitySystem } from './EntitySystem';

export class Scheduler {
  private _systems: EntitySystem<any, any, any, any>[] = [];

  /**
   * currently scheduled systems
   */
  get systems(): EntitySystem<any, any, any, any>[] {
    return this._systems;
  }

  /**
   * set the scheduled systems
   */
  set systems(value: EntitySystem<any, any, any, any>[]) {
    this._systems = value;
  }

  /**
   * clean up systems
   */
  cleanUp(): void {
    this._systems = [];
  }

  /**
   * sort the systems by priority
   */
  sortSystems(): void {
    this._systems.sort(
      (
        a: EntitySystem<any, any, any, any>,
        b: EntitySystem<any, any, any, any>
      ) => b.priority - a.priority
    );
  }

  /**
   * run the systems in order of priority
   */
  runSystems(): void {
    const systems = this._systems;
    for (let i = systems.length; i--; ) {
      const system = systems[i];
      if (system.active) {
        system.processAll();
        if (system.isReactive) system.entities.clear();
      }
    }
  }
}
