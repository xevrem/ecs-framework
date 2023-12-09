import { is_none, is_some } from './utils';
import { Bag } from './Bag';
import { Component } from './Component';
import { EcsInstance } from './EcsInstance';
import { Entity } from './Entity';
import type {
  ComponentBuilderFunction,
  ComponentMaybeBuilderFunction,
  DataBuilderFunction,
  EntityBuilder,
  StringBuilderFunction,
} from 'types/builder';

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
    build<E extends Error = Error>(): Result<Entity, E> {
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
            entity
          );
        }
        return entity;
      } catch (e) {
        console.error('ENTITY BUILDER ERROR:', e);
        ecs.abort(entity);
        return e as E;
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
