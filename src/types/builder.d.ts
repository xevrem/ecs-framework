import { Component } from '../Component';
import { Entity } from '../Entity';
import { Option, Result } from './common';

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
   * @return a `Result` that is either `Ok<Entity>` on success
   *         or `Err<Error>` on failure
   */
  build(): Result<Entity, Error>;
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

export declare type ComponentBuilderFunction = (builder: EntityBuilder) => Component;
export declare type ComponentMaybeBuilderFunction = (
  builder: EntityBuilder
) => Option<Component>;
export declare type StringBuilderFunction = (builder: EntityBuilder) => string;
export declare type DataBuilderFunction = (builder: EntityBuilder) => EntityBuilder;
