import { Bag } from './Bag';
import { Entity } from './Entity';
import { EcsInstance } from './EcsInstance';

export class EntitySystem {
  _componentTypes: Array<number> = [];
  _entities: Bag<Entity> = new Bag<Entity>();
  _ecsInstance: EcsInstance = null;

  get ecsInstance(): EcsInstance {
    return this._ecsInstance;
  }

  set ecsInstance(value: EcsInstance) {
    this._ecsInstance = value;
  }

  get componentTypes(): Array<number> {
    return this._componentTypes;
  }

  set componentTypes(value: Array<number>) {
    this._componentTypes = value;
  }

  get entities(): Bag<Entity> {
    return this._entities;
  }

  loadContent(): void {
    this.preLoadContent(this._entities);
  }

  removeEntity(entity: Entity): void {
    if (this._entities.remove(entity)) this.removed(entity);
  }

  addEntity(entity: Entity): void {
    if (!this._entities.contains(entity, (a, b) => b && a.id === b.id)) {
      this._entities.add(entity);
      this.added(entity);
    }
  }

  cleanSystem(): void {
    this.cleanUp(this._entities);
    this._entities.clear();
  }

  processAll(): void {
    if (this.shouldProcess()) {
      this.begin();
      this.processEntities();
      this.end();
    }
  }

  processEntities(): void {
    this._entities.forEach((entity: Entity) => {
      entity && this.process(entity, this._ecsInstance.delta);
    });
  }

  shouldProcess(): boolean {
    return true;
  }

  //overloadable functions
  initialize(): void { };
  preLoadContent(_entities: Bag<Entity>): void { };
  removed(_entity: Entity): void { };
  added(_entity: Entity): void { };
  updated(_entity: Entity): void { };
  cleanUp(_entities: Bag<Entity>): void { };
  begin(): void { };
  end(): void { };
  process(_entity: Entity, _delta: number): void { };
}
