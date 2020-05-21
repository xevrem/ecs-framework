import { Bag } from './Bag';
import { Entity } from './Entity';
import { EcsInstance } from './EcsInstance';

export class EntitySystem {
  __componentTypes: Array<number> = [];
  __entities: Bag<Entity> = new Bag<Entity>();
  __ecsInstance: EcsInstance = null;

  get ecsInstance(): EcsInstance {
    return this.__ecsInstance;
  }

  set ecsInstance(value: EcsInstance) {
    this.__ecsInstance = value;
  }

  get componentTypes(): Array<number> {
    return this.__componentTypes;
  }

  set componentTypes(value: Array<number>) {
    this.__componentTypes = value;
  }

  get entities(): Bag<Entity> {
    return this.__entities;
  }

  loadContent(): void {
    this.preLoadContent(this.__entities);
  }

  removeEntity(entity: Entity): void {
    if (this.__entities.remove(entity)) this.removed(entity);
  }

  addEntity(entity: Entity): void {
    if (!this.__entities.contains(entity, (a, b) => b && a.id === b.id)) {
      this.__entities.add(entity);
      this.added(entity);
    }
  }

  cleanSystem(): void {
    this.cleanUp(this.__entities);
    this.__entities.clear();
  }

  processAll(): void {
    if (this.shouldProcess()) {
      this.begin();
      this.processEntities();
      this.end();
    }
  }

  processEntities(): void {
    this.__entities.forEach((entity: Entity) => {
      entity && this.process(entity, this.__ecsInstance.delta);
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
