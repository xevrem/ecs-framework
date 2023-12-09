import { Bag } from './Bag';
import { Entity } from './Entity';
import { EcsInstance } from './EcsInstance';
import { Query } from './Query';
import type {
  ComponentOptionTuple,
  ComponentTuple,
  JoinedResult,
  SmartUpdate,
} from 'types/tuples';
import { EntitySystemArgs } from 'types/system';

export class EntitySystem<
  T extends ComponentTuple = any,
  Props = any,
  V extends ComponentOptionTuple = any,
  W extends ComponentTuple = any
> {
  private _id = -1;
  private _entities: Bag<Entity> = new Bag<Entity>();
  private _ecsInstance: EcsInstance;
  private _priority: number;
  private _query!: Query<T, V, W>;
  private _active = true;
  private _dirty = false;
  protected reactive = false;
  props: EntitySystemArgs<T, Props, V, W>;
  needed!: [...T];
  optional!: [...V]; //[...V];
  unwanted!: [...W]; //[...W];

  constructor(props: EntitySystemArgs<T, Props, V, W>) {
    this.props = props;
    this._id = props.id;
    this._ecsInstance = props.ecsInstance;
    this.reactive = props.reactive || false;
    this._priority = props.priority || 0;
    this.needed = props.needed;
    this.optional = props.optional || ([] as any);
    this.unwanted = props.unwanted || ([] as any);
  }

  get id(): number {
    return this._id;
  }

  get ecs(): EcsInstance {
    return this._ecsInstance;
  }

  get ecsInstance(): EcsInstance {
    return this._ecsInstance;
  }

  set ecsInstance(value: EcsInstance) {
    this._ecsInstance = value;
  }

  get entities(): Bag<Entity> {
    return this._entities;
  }

  get isReactive(): boolean {
    return this.reactive;
  }

  get priority(): number {
    return this._priority;
  }

  get query(): Query<T, V, W> {
    return this._query;
  }

  get active(): boolean {
    return this._active;
  }

  get dirty(): boolean {
    return this._dirty;
  }

  get componentTypes(): [...T, ...V, ...W] {
    // let result: [...T,...V,...W] = this.needed;
    // if (this.optional) {
    //   let foo = result.concat(this.optional);
    //   result = foo;
    // }
    // if (this.unwanted) {
    //   result = result.concat(this.unwanted);
    // }
    return [...this.needed, ...this.optional, ...this.unwanted];
  }

  /**
   * enable this system
   */
  enable(): void {
    this._active = true;
  }

  /**
   * disable this system
   */
  disable(): void {
    this._active = false;
  }

  buildQuery(): void {
    this._query = new Query<T, V, W>({
      ecsInstance: this._ecsInstance,
      needed: this.needed,
      unwanted: this.unwanted || ([] as any),
      optional: this.optional || ([] as any),
    });
  }

  /**
   * remove the given entity from this system, calling the system's removed function
   * if successful
   * @param entity the entity to remove
   */
  removeEntity(entity: Entity): void {
    if (this._entities.has(entity.id)) {
      this._entities.set(entity.id, undefined);
      this.query.entity = entity;
      this.removed?.(entity);
      this._dirty = true;
    }
  }

  removeEntityById(id: number): void {
    const entity = this._entities.get(id);
    if (entity) {
      this._entities.set(id, undefined);
      this.query.entity = entity;
      this.removed?.(entity);
      this._dirty = true;
    }
  }

  /**
   * creation/assignment of entities upon initial resolution
   */
  initialResolve(entity: Entity): void {
    this._entities.set(entity.id, entity);
    this.query.entity = entity;
    this.created?.(entity);
    this._dirty = true;
  }

  /**
   * creation/assignment of enttiies after load
   */
  initialCreate(entity: Entity): void {
    this.query.entity = entity;
    this.created?.(entity);
    this._dirty = true;
  }

  /**
   * add the entity with the given id to this system
   * @param id the id of the entity to add
   */
  addEntityById(id: number): void {
    const entity = this._ecsInstance.getEntity(id);
    if (!entity) return;
    this.addEntity(entity);
  }

  /**
   * add the entity to this system
   * @param entity the entity to add
   */
  addEntity(entity: Entity): void {
    if (!this._entities.has(entity.id)) {
      this._entities.set(entity.id, entity);
      this.query.entity = entity;
      this.added?.(entity);
      this._dirty = true;
    }
  }

  createEntity(entity: Entity): void {
    this._entities.set(entity.id, entity);
    this.query.entity = entity;
    this.created?.(entity);
    this._dirty = true;
  }

  /**
   * adds an entity without calling `added`
   * @param id the id of the entity to add
   */
  addByUpdateById(id: number): void {
    const entity = this._ecsInstance.getEntity(id);
    if (!entity) return;
    this.addByUpdate(entity);
  }

  /**
   * adds an entity without calling `added`
   * @param entity the entity to add
   */
  addByUpdate(entity: Entity): void {
    this._entities.set(entity.id, entity);
    this._dirty = true;
  }

  deleteEntity(entity: Entity): void {
    if (this.reactive) {
      this.query.entity = entity;
      this.deleted?.(entity);
      this._dirty = true;
    } else {
      if (this._entities.has(entity.id)) {
        this._entities.set(entity.id, undefined);
        this.query.entity = entity;
        this.deleted?.(entity);
        this._dirty = true;
      }
    }
  }

  /**
   * clean this system, calling its `cleanUp` function and clearing
   * all owned entities
   */
  cleanSystem(): void {
    this.cleanUp && this.cleanUp(this._entities);
    this._entities.clear();
  }

  /**
   * process all entities
   */
  processAll(): void {
    if (this.shouldProcess()) {
      this.begin && this.begin();
      this.processEntities();
      this.processJoin();
      this.end && this.end();
    }
  }

  processJoin(): void {
    if (!this.join) return;
    // if we have no entities, don't bother running
    if (!this._entities.count) return;
    if (this._dirty) this.resolveQuery();
    const data = this._query.data;
    for (let i = data.length; i--; ) {
      this.join(data[i]);
    }
  }

  /**
   * processes entities one by one calling the system's `process` function
   * and passing the results of the systems `Query`
   */
  processEntities(): void {
    if (!this.process) return;
    // if we have no entiteis, don't bother
    if (!this._entities.count) return;
    // process up to the last inserted entity
    for (let i = this._entities.length; i--; ) {
      const entity = this._entities.get(i);
      if (!entity) continue;
      this._query.entity = entity;
      this.process(entity, this._query, this._ecsInstance.delta);
    }
  }

  /**
   * determine whether or not this system should process
   */
  shouldProcess(): boolean {
    return true;
  }

  resolveQuery() {
    this.query.resolve(this._entities);
    this._dirty = false;
  }

  resetSystem(): void {
    this.reset && this.reset();
    this._entities.clear();
  }

  updateById(id: number, updates: Bag<SmartUpdate>): void {
    const entity = this.entities.get(id);
    if (entity) this.updated?.(entity, updates);
  }

  update(entity: Entity): void {
    this.updated?.(entity);
  }

  /*
   * extendable lifecycle functions
   */
  initialize?(): void;
  load?(entities: Bag<Entity>): void;
  created?(entity: Entity): void;
  deleted?(entity: Entity): void;
  added?(entity: Entity): void;
  removed?(entity: Entity): void;
  cleanUp?(entities: Bag<Entity>): void;
  reset?(): void;
  begin?(): void;
  end?(): void;
  process?(entity: Entity, query: Query<T, V, W>, delta: number): void;
  /**
   * alternate to `process`, but auto-retrieves all needed/optional components
   * for entities in a very efficient data structure. Components are returned in
   * the exact order of the `needed` array followed by `optional` array
   */
  join?(result: JoinedResult<T, V>): void;
  /**
   * called for static systems when a given entity it owns has a component update
   */
  updated?(entity: Entity, updates?: Bag<SmartUpdate>): void;
}
