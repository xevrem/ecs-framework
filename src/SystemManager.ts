import { EcsInstance } from './EcsInstance';
import {
  AnySystem,
  type EntitySystemArgs,
  type SystemRegistrationArgs,
} from './EntitySystem';
import { Bag } from './Bag';
import { Entity } from './Entity';
import {
  ComponentOptionTuple,
  ComponentTuple,
  SmartResolve,
  SmartUpdate,
} from './types';
import { FuncQuery, type QueryFunc } from './FuncQuery';

export declare type FuncQuerySysEntry = [
  func: (params: {
    query: FuncQuery<any, any, any>;
    ecs: EcsInstance;
    delta: number;
  }) => void,
  funcQuery: FuncQuery<any, any, any>,
];

export class SystemManager {
  private _ecsInstance: EcsInstance;
  private _staticSystems: AnySystem[];
  private _reactiveSystems: AnySystem[];
  private _systemTypes: Record<string, AnySystem> = {};
  private _systems!: AnySystem[];
  private _nextId: number;
  private _functionalSystems: FuncQuerySysEntry[] = [];
  private _functionalAddSystems: FuncQuerySysEntry[] = [];
  private _functionalCreateSystems: FuncQuerySysEntry[] = [];
  private _functionalDeleteSystems: FuncQuerySysEntry[] = [];
  private _functionalUpdateSystems: FuncQuerySysEntry[] = [];

  constructor(ecsInstance: EcsInstance) {
    this._ecsInstance = ecsInstance;
    this._staticSystems = [];
    this._reactiveSystems = [];
    this._nextId = 0;
  }

  /**
   * an array of the currently managed systems
   * memoized on startup
   */
  get systems(): AnySystem[] {
    if (this._systems) return this._systems;
    this._systems = this._staticSystems.concat(this._reactiveSystems);
    return this._systems;
  }

  /**
   * WARNING this is a debug function
   * get the system registered by the specified class name
   * @param name class name of the registered system
   * @returns the registered system with the given name
   */
  getSystemByTypeName<T extends AnySystem>(name: string): T {
    return this._systemTypes[name] as T;
  }

  /**
   * register a given system class
   * @param System the system class to register
   * @param args the system registration arguments
   * @returns a reference to the registered system
   */
  registerSystem<
    Props,
    SysArgs extends SystemRegistrationArgs<Props>,
    EsArgs extends EntitySystemArgs<Props, any, any, any, any>,
    Sys extends AnySystem<Props>,
  >(System: new (args: EsArgs) => Sys, args: SysArgs): Sys {
    const props: EsArgs = {
      id: this._nextId++,
      ecsInstance: this._ecsInstance,
      ...args,
    } as any;
    const system = new System(props);

    system.buildQuery();

    system.componentTypes.forEach(component => {
      this._ecsInstance.componentManager.registerComponent(component);
    });
    if (system.isReactive) {
      this._reactiveSystems.push(system);
    } else {
      this._staticSystems.push(system);
    }
    this._systemTypes[system.constructor.name] = system;
    return system;
  }

  /**
   * initialize all registered systems
   */
  initializeSystems(): void {
    const systems = this.systems;
    for (let i = systems.length; i--; ) {
      this.systems[i].initialize?.();
    }
  }

  /**
   * load all registered systems
   */
  loadSystems(): void {
    const systems = this.systems;
    for (let i = systems.length; i--; ) {
      const system = this.systems[i];
      system.load?.(system.entities);
    }
  }

  initialResolve(entity: Entity): void {
    const systems = this.systems;
    for (let i = systems.length; i--; ) {
      const system = this.systems[i];
      if (system.query.validate(entity)) {
        system.initialResolve(entity);
      }
    }
  }

  initialCreate(entity: Entity): void {
    const systems = this.systems;
    for (let i = systems.length; i--; ) {
      const system = this.systems[i];
      system.query.validate(entity) && system.initialCreate(entity);
    }
  }

  /**
   * attempt to add the created entity to all registered systems
   * @param entity the entity to add
   */
  createEntity(entity: Entity): void {
    // since this is performance critical, we do each system explicitly
    // rather than using `this.systems`
    for (let i = this._staticSystems.length; i--; ) {
      const system = this._staticSystems[i];
      system.query.validate(entity) && system.createEntity(entity);
    }
    for (let i = this._reactiveSystems.length; i--; ) {
      const system = this._reactiveSystems[i];
      system.query.validate(entity) && system.createEntity(entity);
    }
    for (let i = this._functionalCreateSystems.length; i--; ) {
      const [_system, query] = this._functionalCreateSystems[i];
      query.entities.push(entity);
    }
  }

  /**
   * resolve the given entity with the static systems.  if valid, will be added
   * if it doesnt already have the entity or removed if invalid
   * @param resolving the entities to resolve
   */
  resolveEntities(resolving: Bag<SmartResolve>): void {
    for (let i = resolving.length; i--; ) {
      const data = resolving.get(i);
      if (!data) continue;
      const [entity, ignored] = data;
      for (let i = this._staticSystems.length; i--; ) {
        const system = this._staticSystems[i];
        if (ignored[system.id]) continue;
        if (system.query.validate(entity)) {
          system.addEntity(entity);
        } else {
          // attempt to remove if we ever had it before
          system.removeEntity(entity);
        }
      }

      for (let i = this._reactiveSystems.length; i--; ) {
        const system = this._reactiveSystems[i];
        if (ignored[system.id]) continue;
        if (system.query.validate(entity)) {
          system.addEntity(entity);
        }
      }

      for (let i = this._functionalAddSystems.length; i--; ) {
        const [_system, query] = this._functionalAddSystems[i];
        query.entities.push(entity);
      }
    }
  }

  // IDEA: for when we introduce smart resolves
  // resolveAdd(components: Component[]) {
  //   const systems = this.systems;
  //   // for-of is a little faster with sparse data
  //   for (const system of systems) {
  //     let valid = false;
  //     for (const component of components) {
  //       // IF any of the components added are valid,
  //       valid = valid || system.query.isValidComponent(component);
  //     }
  //     // AND we're not an invalid entity
  //     if (valid && system.query.isValidById(components[0].owner)) {
  //       // THEN add this entity
  //       system.addEntityById(components[0].owner);
  //     }
  //   }
  // }

  // IDEA: for when we introduce smart resolves
  // resolveRemove(components: Component[]) {
  //   const systems = this.systems;
  //   // for-of is a little faster with sparse data
  //   for (const system of systems) {
  //     let needed = false;
  //     for (const component of components) {
  //       // IF any are a needed component
  //       needed = needed || system.query.isNeededComponent(component);
  //     }

  //     // AND we're still considered valid
  //     if (needed && system.query.isValidById(components[0].owner)) {
  //       // THEN remove this entity
  //       system.removeEntityById(components[0].owner);
  //     }
  //   }
  // }

  /**
   * delete the given entity from all registered systems
   * @param entity the deleted entity
   */
  deleteEntity(entity: Entity): void {
    for (let i = this._staticSystems.length; i--; ) {
      this._staticSystems[i].deleteEntity(entity);
    }
    // due to the way that we keep reactive systems sparse, we
    // must validate beforehand. this allows reactive systems
    // to receive deletion notifications and do any special
    // cleanup if they alter their internal state based on prior
    // processed entities
    for (let i = this._reactiveSystems.length; i--; ) {
      const system = this._reactiveSystems[i];
      system.query.validate(entity) && system.deleteEntity(entity);
    }
    for (let i = this._functionalDeleteSystems.length; i--; ) {
      const [system, query] = this._functionalDeleteSystems[i];
      query.entities.push(entity);
      system({
        delta: this._ecsInstance.delta,
        ecs: this._ecsInstance,
        query,
      });
      query.clear();
    }
  }

  /**
   * IDEA: make update work like smart resolves (should be faster)
   * notify the registered reactive systems that any entities with the
   * supplied components should be added for processing
   * @param updated the arrays of components by owner requiring updates
   */
  update(updated: Bag<Bag<SmartUpdate>>): void {
    for (let i = this._systems.length; i--; ) {
      const system = this._systems[i];
      for (let owner = updated.length; owner--; ) {
        const data = updated.get(owner);
        if (!data) continue;
        // IF any of the components added are valid,
        const maybeValid = data.some(item => {
          if (item) {
            const [component, ignored] = item;
            return (
              !ignored[system.id] && system.query.isValidComponent(component)
            );
          }
          return false;
        });
        // AND we're not an invalid entity
        if (maybeValid && system.query.isValidById(owner)) {
          // THEN add this entity
          if (system.isReactive) system.addByUpdateById(owner);
          else {
            // static system
            system.updateById(owner, data);
          }
        }
      }
    }
    // get all All populated entity entries
    const entities = updated.populated().reduce<Entity[]>((entities, id) => {
      const maybe_entity = this._ecsInstance.getEntity(id);
      return maybe_entity ? entities.addItem(maybe_entity) : entities;
    }, []);
    // then notify functional update systems to run against the updates
    for (let i = this._functionalUpdateSystems.length; i--; ) {
      const [_system, query] = this._functionalUpdateSystems[i];
      query.entities.add(entities);
    }
  }

  /**
   * notify the registered reactive systems that these entities
   * should be added for processing
   * @param entity the entity to update
   */
  updateEntity(entity: Entity): void {
    for (let i = this._systems.length; i--; ) {
      const system = this._systems[i];
      if (system.query.validate(entity)) {
        system.isReactive && system.addByUpdate(entity);
        !system.isReactive && system.update(entity);
      }
    }

    // notify functional update systems to run against the entity
    for (let i = this._functionalUpdateSystems.length; i--; ) {
      const [_system, query] = this._functionalUpdateSystems[i];
      query.entities.push(entity);
    }
  }

  reset(): void {
    const systems = this.systems;
    for (let i = systems.length; i--; ) {
      this.systems[i].resetSystem();
    }
  }

  /**
   * clean up all registred systems
   */
  cleanUp(): void {
    this.systems.forEach(system => system.cleanSystem());
    this._staticSystems = [];
    this._reactiveSystems = [];
    this._systemTypes = {};
    this._systems = [];
    this._nextId = 0;
  }

  /**
   * create a functional system that runs every frame
   */
  withSystem<
    Needed extends ComponentTuple,
    Optional extends ComponentOptionTuple = [],
    Unwanted extends ComponentTuple = [],
  >(
    data: [
      needed: [...Needed],
      optional?: [...Optional],
      unwanted?: [...Unwanted],
    ],
    queryFunc: QueryFunc<Needed, Optional, Unwanted>,
  ): void {
    this._functionalSystems.push([
      queryFunc,
      new FuncQuery<Needed, Optional, Unwanted>(
        this._ecsInstance,
        data[0],
        data?.[1],
        data?.[2],
        false,
      ),
    ]);
  }

  /**
   * create a functional system that runs when an entity has one
   * or more components added/removed that then cause it to
   * match this system
   */
  withAddSystem<
    Needed extends ComponentTuple,
    Optional extends ComponentOptionTuple = [],
    Unwanted extends ComponentTuple = [],
  >(
    data: [
      needed: [...Needed],
      optional?: [...Optional],
      unwanted?: [...Unwanted],
    ],
    queryFunc: QueryFunc<Needed, Optional, Unwanted>,
  ): void {
    this._functionalAddSystems.push([
      queryFunc,
      new FuncQuery<Needed, Optional, Unwanted>(
        this._ecsInstance,
        data[0],
        data?.[1],
        data?.[2],
        true,
      ),
    ]);
  }

  /**
   * create a functional system that runs when an entity
   * is created that matches this system
   */
  withCreateSystem<
    Needed extends ComponentTuple,
    Optional extends ComponentOptionTuple = [],
    Unwanted extends ComponentTuple = [],
  >(
    data: [
      needed: [...Needed],
      optional?: [...Optional],
      unwanted?: [...Unwanted],
    ],
    queryFunc: QueryFunc<Needed, Optional, Unwanted>,
  ): void {
    this._functionalCreateSystems.push([
      queryFunc,
      new FuncQuery<Needed, Optional, Unwanted>(
        this._ecsInstance,
        data[0],
        data?.[1],
        data?.[2],
        true,
      ),
    ]);
  }

  /**
   * create a functional system that runs when an entity
   * is deleted that matches this system
   */
  withDeleteSystem<
    Needed extends ComponentTuple,
    Optional extends ComponentOptionTuple = [],
    Unwanted extends ComponentTuple = [],
  >(
    data: [
      needed: [...Needed],
      optional?: [...Optional],
      unwanted?: [...Unwanted],
    ],
    queryFunc: QueryFunc<Needed, Optional, Unwanted>,
  ): void {
    this._functionalDeleteSystems.push([
      queryFunc,
      new FuncQuery<Needed, Optional, Unwanted>(
        this._ecsInstance,
        data[0],
        data?.[1],
        data?.[2],
        true,
      ),
    ]);
  }

  /**
   * create a functional system that runs when an entity
   * is explicity updated or has a component updated
   * that matches this system
   */
  withUpdateSystem<
    Needed extends ComponentTuple,
    Optional extends ComponentOptionTuple = [],
    Unwanted extends ComponentTuple = [],
  >(
    data: [
      needed: [...Needed],
      optional?: [...Optional],
      unwanted?: [...Unwanted],
    ],
    queryFunc: QueryFunc<Needed, Optional, Unwanted>,
  ): void {
    this._functionalUpdateSystems.push([
      queryFunc,
      new FuncQuery<Needed, Optional, Unwanted>(
        this._ecsInstance,
        data[0],
        data?.[1],
        data?.[2],
        true,
      ),
    ]);
  }

  runQuerySystems(delta: number): void {
    this._functionalSystems.forEach(([func, query]) =>
      func({
        query,
        ecs: this._ecsInstance,
        delta,
      }),
    );
    this._functionalAddSystems.forEach(([func, query]) => {
      func({
        query,
        ecs: this._ecsInstance,
        delta,
      });
      query.clear();
    });
    this._functionalUpdateSystems.forEach(([func, query]) => {
      func({
        query,
        ecs: this._ecsInstance,
        delta,
      });
      query.clear();
    });
    this._functionalCreateSystems.forEach(([func, query]) => {
      func({
        query,
        ecs: this._ecsInstance,
        delta,
      });
      query.clear();
    });
  }
}
