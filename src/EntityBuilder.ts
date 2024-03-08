import { is_some, is_none, Result, Option } from 'onsreo';
import { Bag } from './Bag';
import { Component } from './Component';
import { EcsInstance } from './EcsInstance';
import { Entity } from './Entity';

/**
 * creates an Entity builder that allows you to chain common entity build patterns
 * NOTE: entity is not actually created until `build()` is called on this builder
 */
export class EntityBuilder {
  ecs: EcsInstance;
  alsoCallbacks: DataBuilderFunction[] = [];
  components = new Bag<Component>();
  componentCallbacks: (
    | ComponentBuilderFunction
    | ComponentMaybeBuilderFunction
  )[] = [];
  groupCallbacks: StringBuilderFunction[] = [];
  groups: string[] = [];
  initCallback: Option<DataBuilderFunction> = null;
  tags: string[] = [];
  tagCallbacks: StringBuilderFunction[] = [];
  workingData: Record<PropertyKey, unknown> = {};

  entity!: Entity;

  constructor(ecs: EcsInstance) {
    this.ecs = ecs;
  }

  /**
   *
   */
  also(callback: DataBuilderFunction): EntityBuilder {
    this.alsoCallbacks.push(callback);
    return this;
  }
  /**
   * finalizes the build of this component
   * @return a `Result<Entity, Error>` that is either `Ok<Entity>` on success
   *         or `Err<Error>` on failure
   */
  build<E>(): Result<Entity, E> {
    this.entity = this.ecs.createEntity();
    try {
      // run init if specified
      is_some(this.initCallback) && this.initCallback(this);

      for (let i = 0; i < this.componentCallbacks.length; i++) {
        const component = this.componentCallbacks[i](this);
        if (is_some(component)) {
          this.components.set(component.type, component);
          this.ecs.addComponent(this.entity, component);
        }
      }
      // we do standard adds after callbacks because callbacks can add inside them
      for (let i = 0; i < this.components.length; i++) {
        const component = this.components.get(i);
        is_some(component) && this.ecs.addComponent(this.entity, component);
      }
      for (let i = 0; i < this.alsoCallbacks.length; i++) {
        this.alsoCallbacks[i](this);
      }
      for (let i = 0; i < this.tags.length; i++) {
        this.ecs.tagManager.tagEntity(this.tags[i], this.entity);
      }
      for (let i = 0; i < this.tagCallbacks.length; i++) {
        this.ecs.tagManager.tagEntity(this.tagCallbacks[i](this), this.entity);
      }
      for (let i = 0; i < this.groups.length; i++) {
        this.ecs.groupManager.addEntityToGroup(this.groups[i], this.entity);
      }
      for (let i = 0; i < this.groupCallbacks.length; i++) {
        this.ecs.groupManager.addEntityToGroup(
          this.groupCallbacks[i](this),
          this.entity,
        );
      }
      return this.entity;
    } catch (e) {
      console.error('ENTITY BUILDER ERROR:', e);
      this.ecs.abort(this.entity);
      return e as Result<Entity, E>;
    }
  }
  /**
   * add component to entity
   * @param component the component to add
   * @return this `EntityBuilder`
   */
  add(component: Component): EntityBuilder {
    this.components.set(component.type, component);
    return this;
  }
  /**
   * optionally add a component to entity
   * @param maybe is either `Some<Component>` or `None`
   * @return this `EntityBuilder`
   */
  addMaybe(maybe: Option<Component>): EntityBuilder {
    if (is_some(maybe)) {
      this.components.set(maybe.type, maybe);
    }
    return this;
  }
  /**
   *
   */
  addMaybeWith(callback: ComponentMaybeBuilderFunction): EntityBuilder {
    this.componentCallbacks.push(callback);
    return this;
  }
  /**
   * add component to entity using a callback function
   * @param callback a `ComponentBuilderFunction` that returns a component
   * @return this `EntityBuilder`
   */
  addWith(callback: ComponentBuilderFunction): EntityBuilder {
    this.componentCallbacks.push(callback);
    return this;
  }
  /**
   * add an entity to a group
   * @param group the group to which to add the entity
   * @return this `EntityBuilder`
   */
  group(group: string): EntityBuilder {
    this.groups.push(group);
    return this;
  }

  /**
   * add an entity to a group defined by the string returned by `callback`
   * @param callback a `StringBuilderFunction` that returns a string
   * @return this `EntityBuilder`
   */
  groupWith(callback: StringBuilderFunction): EntityBuilder {
    this.groupCallbacks.push(callback);
    return this;
  }
  /**
   * get the data stored at the given `key`
   * @param key the location of the data
   * @return the data specified
   */
  getData<T>(key: PropertyKey): T {
    const data = this.workingData[key];
    if (is_none(data))
      throw new Error(`builder data ${key as string} is undefined`);
    return data as T;
  }
  /**
   * get the entity
   * @return the current building entity
   */
  getEntity(): Entity {
    return this.entity;
  }

  /**
   * get any prior added component
   * @param component the component type desired
   * @return an instance of that component
   */
  get<C extends typeof Component>(component: C): InstanceType<C> {
    const comp = this.components.get(component.type);
    if (is_none(comp))
      throw new Error(`builder component ${component.name} is undefined`);
    return comp as InstanceType<C>;
  }
  /**
   *
   */
  init(callback: DataBuilderFunction): EntityBuilder {
    this.initCallback = callback;
    return this;
  }

  /**
   * insert data into builder to be used later in build chain
   * @param key location to store data
   * @param value data to store
   * @return this `EntityBuilder`
   */
  insertData<T>(key: PropertyKey, value: T): EntityBuilder {
    this.workingData[key] = value;
    return this;
  }
  /**
   * set data while with a builder callback,
   * WARNING: does not return a builder (i.e., cannot be chained)
   * @param key the location to store the data
   * @param value the data to store
   */
  setData<T>(key: PropertyKey, value: T): void {
    this.workingData[key] = value;
  }
  /**
   * tag an entity with a string
   * @param tag the string with which to tag the entity
   * @return this `EntityBuilder`
   */
  tag(tag: string): EntityBuilder {
    this.tags.push(tag);
    return this;
  }
  /**
   * tag an entity with the string returned by `callback`
   * @param callback a `StringBuilderFunction` that returns a string
   * @return this `EntityBuilder`
   */
  tagWith(callback: StringBuilderFunction): EntityBuilder {
    this.tagCallbacks.push(callback);
    return this;
  }
}

export declare type ComponentBuilderFunction = (
  builder: EntityBuilder,
) => Component;
export declare type ComponentMaybeBuilderFunction = (
  builder: EntityBuilder,
) => Option<Component>;
export declare type StringBuilderFunction = (builder: EntityBuilder) => string;
export declare type DataBuilderFunction = (
  builder: EntityBuilder,
) => EntityBuilder;

/**
 * creates a builder that allows you to chain calls to build up an entity
 * making creation of entities extremely easy while remaining lightweight
 * and performant.
 */
export function makeEntityBuilder(ecs: EcsInstance): EntityBuilder {
  return new EntityBuilder(ecs);
}
