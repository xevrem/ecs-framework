import { EntityManager } from './EntityManager';
import { ComponentManager } from './ComponentManager';
import { SystemManager } from './SystemManager';
import { TagManager } from './TagManager';
import { GroupManager } from './GroupManager';
import { Entity } from './Entity';
import { Component } from './Component';

export class EcsInstance {
  entityManager: EntityManager;
  componentManager: ComponentManager;
  systemManager: SystemManager;
  tagManager: TagManager;
  groupManager: GroupManager;

  private __updating: Array<Entity>;
  private __deleting: Array<Entity>;
  private __delta: number;
  private __lastTime: number;
  private __elapsed: number;

  constructor() {
    this.entityManager = new EntityManager();
    this.componentManager = new ComponentManager(this);
    this.systemManager = new SystemManager(this);
    this.tagManager = new TagManager();
    this.groupManager = new GroupManager();
    this.__updating = [];
    this.__deleting = [];
    this.__delta = 0;
    this.__lastTime = 0;
    this.__elapsed = 0;
  }

  get delta(): number {
    return this.__delta;
  }

  get elapsed(): number {
    return this.__elapsed;
  }

  create(): Entity {
    return this.entityManager.create();
  }

  addComponent(entity: Entity, component: Component): void {
    this.componentManager.addComponent(entity, component);
  }

  removeComponent(component: Component): void {
    this.componentManager.removeComponent(component);
  }

  hasComponent(entity: Entity, type: number): boolean {
    return this.componentManager.hasComponent(entity, type);
  }

  resolve(entity: Entity): void {
    if (entity) this.__updating.push(entity);
  }

  deleteEntity(entity: Entity): void {
    if (entity) this.__deleting.push(entity);
  }

  resolveEntities(): void {
    if (this.__updating.length > 0) {
      this.__updating.forEach(entity => this.systemManager.resolve(entity));
      this.__updating = [];
    }

    if (this.__deleting.length > 0) {
      this.__deleting.forEach(entity => {
        this.systemManager.deleteEntity(entity);
        this.tagManager.deleteEntity(entity);
        this.groupManager.deleteEntity(entity);
        this.componentManager.deleteEntity(entity);
        this.entityManager.deleteEntity(entity);
      });
      this.__deleting = [];
    }
  }

  updateTime(time: number): void {
    this.__delta = time - this.__lastTime;
    this.__elapsed += this.__delta;
    this.__lastTime = time;
  }

  updateByDelta(delta: number): void {
    this.__delta = delta;
    this.__elapsed += this.__delta;
    this.__lastTime = performance.now();
  }

  cleanUp(): void {
    this.entityManager.cleanUp();
    this.componentManager.cleanUp();
    this.systemManager.cleanUp();
    this.groupManager.cleanUp();
    this.tagManager.cleanUp();
  }
}
