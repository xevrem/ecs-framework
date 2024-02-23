import { is_some, is_none, Result, Option } from 'onsreo';
import { Bag } from './Bag';
import { Component } from './Component';
import { EcsInstance } from './EcsInstance';
import { Entity } from './Entity';

/**
 * creates an Entity builder that allows you to chain common entity build patterns
 * NOTE: entity is not actually created until `build()` is called on this builder
 */
export declare type EntityBuilder = {
  /**
   *
   */
  also(callback: DataBuilderFunction): EntityBuilder;
  /**
   * finalizes the build of this component
   * @return a `Result<Entity, Error>` that is either `Ok<Entity>` on success
   *         or `Err<Error>` on failure
   */
  build<E>(): Result<Entity, E>;
  /**
   * add component to entity
   * @param component the component to add
   * @return this `EntityBuilder`
   */
  add(component: Component): EntityBuilder;
  /**
   * optionally add a component to entity
   * @param maybe is either `Some<Component>` or `None`
   * @return this `EntityBuilder`
   */
  addMaybe(maybe: Option<Component>): EntityBuilder;
  /**
   *
   */
  addMaybeWith(callback: ComponentMaybeBuilderFunction): EntityBuilder;
  /**
   * add component to entity using a callback function
   * @param callback a `ComponentBuilderFunction` that returns a component
   * @return this `EntityBuilder`
   */
  addWith(callback: ComponentBuilderFunction): EntityBuilder;
  /**
   * add an entity to a group
   * @param group the group to which to add the entity
   * @return this `EntityBuilder`
   */
  group(group: string): EntityBuilder;
  /**
   * add an entity to a group defined by the string returned by `callback`
   * @param callback a `StringBuilderFunction` that returns a string
   * @return this `EntityBuilder`
   */
  groupWith(callback: StringBuilderFunction): EntityBuilder;
  /**
   * get the data stored at the given `key`
   * @param key the location of the data
   * @return the data specified
   */
  getData<T>(key: PropertyKey): T;
  /**
   * get the entity
   * @return the current building entity
   */
  getEntity(): Entity;
  /**
   * get any prior added component
   * @param component the component type desired
   * @return an instance of that component
   */
  get<C extends typeof Component>(component: C): InstanceType<C>;
  /**
   *
   */
  init(callback: DataBuilderFunction): EntityBuilder;
  /**
   * insert data into builder to be used later in build chain
   * @param key location to store data
   * @param value data to store
   * @return this `EntityBuilder`
   */
  insertData<T>(key: PropertyKey, value: T): EntityBuilder;
  /**
   * set data while with a builder callback,
   * WARNING: does not return a builder (i.e., cannot be chained)
   * @param key the location to store the data
   * @param value the data to store
   */
  setData<T>(key: PropertyKey, value: T): void;
  /**
   * tag an entity with a string
   * @param tag the string with which to tag the entity
   * @return this `EntityBuilder`
   */
  tag(tag: string): EntityBuilder;
  /**
   * tag an entity with the string returned by `callback`
   * @param callback a `StringBuilderFunction` that returns a string
   * @return this `EntityBuilder`
   */
  tagWith(callback: StringBuilderFunction): EntityBuilder;
};

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
  let entity!: Entity;
  const alsoCallbacks: DataBuilderFunction[] = [];
  const components = new Bag<Component>();
  const componentCallbacks: (
    | ComponentBuilderFunction
    | ComponentMaybeBuilderFunction
  )[] = [];
  const groupCallbacks: StringBuilderFunction[] = [];
  const groups: string[] = [];
  let initCallback: Option<DataBuilderFunction> = null;
  const tags: string[] = [];
  const tagCallbacks: StringBuilderFunction[] = [];
  const workingData: Record<PropertyKey, unknown> = {};
  const builder: EntityBuilder = {
    build<E>(): Result<Entity, E> {
      entity = ecs.createEntity();
      let currentBuilder: EntityBuilder = this;
      try {
        currentBuilder = is_some(initCallback)
          ? initCallback(currentBuilder)
          : this;
        for (let i = 0; i < componentCallbacks.length; i++) {
          const component = componentCallbacks[i](currentBuilder);
          if (is_some(component)) {
            components.set(component.type, component);
            ecs.addComponent(entity, component);
          }
        }
        // we do standard adds after callbacks because callbacks can add inside them
        for (let i = 0; i < components.length; i++) {
          const component = components.get(i);
          component && ecs.addComponent(entity, component);
        }
        for (let i = 0; i < alsoCallbacks.length; i++) {
          currentBuilder = alsoCallbacks[i](currentBuilder);
        }
        for (let i = 0; i < tags.length; i++) {
          ecs.tagManager.tagEntity(tags[i], entity);
        }
        for (let i = 0; i < tagCallbacks.length; i++) {
          ecs.tagManager.tagEntity(tagCallbacks[i](currentBuilder), entity);
        }
        for (let i = 0; i < groups.length; i++) {
          ecs.groupManager.addEntityToGroup(groups[i], entity);
        }
        for (let i = 0; i < groupCallbacks.length; i++) {
          ecs.groupManager.addEntityToGroup(
            groupCallbacks[i](currentBuilder),
            entity,
          );
        }
        return entity;
      } catch (e) {
        console.error('ENTITY BUILDER ERROR:', e);
        ecs.abort(entity);
        return e as Result<Entity, E>;
      }
    },
    add(component: Component): EntityBuilder {
      components.set(component.type, component);
      return this;
    },
    addMaybe(maybe: Option<Component>): EntityBuilder {
      if (is_some(maybe)) {
        components.set(maybe.type, maybe);
      }
      return this;
    },
    addMaybeWith(callback: ComponentMaybeBuilderFunction): EntityBuilder {
      componentCallbacks.push(callback);
      return this;
    },
    addWith(callback: ComponentBuilderFunction): EntityBuilder {
      componentCallbacks.push(callback);
      return this;
    },
    also(callback: DataBuilderFunction): EntityBuilder {
      alsoCallbacks.push(callback);
      return this;
    },
    get<C extends typeof Component>(component: C): InstanceType<C> {
      const comp = components.get(component.type);
      if (is_none(comp))
        throw new Error(`builder component ${component.name} is undefined`);
      return comp as InstanceType<C>;
    },
    getData<T>(key: PropertyKey): T {
      const data = workingData[key];
      if (is_none(data))
        throw new Error(`builder data ${key as string} is undefined`);
      return data as T;
    },
    getEntity(): Entity {
      return entity;
    },
    group(group: string): EntityBuilder {
      groups.push(group);
      return this;
    },
    groupWith(callback: StringBuilderFunction): EntityBuilder {
      groupCallbacks.push(callback);
      return this;
    },
    init(callback: DataBuilderFunction): EntityBuilder {
      initCallback = callback;
      return this;
    },
    insertData<T>(key: PropertyKey, value: T): EntityBuilder {
      workingData[key] = value;
      return this;
    },
    setData<T>(key: PropertyKey, value: T): void {
      workingData[key] = value;
    },
    tag(tag: string): EntityBuilder {
      tags.push(tag);
      return this;
    },
    tagWith(callback: StringBuilderFunction): EntityBuilder {
      tagCallbacks.push(callback);
      return this;
    },
  };
  return builder;
}
