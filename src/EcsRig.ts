import { ComponentOptionTuple, ComponentTuple, EntitySystemArgs } from './types';
import { Bag } from './Bag';
import { Component } from './Component';
import { EcsInstance } from './EcsInstance';
import { Entity } from './Entity';
import { EntitySystem } from './EntitySystem';
import { Query } from './Query';

class Bar extends Component {
  [x: string]: number;
}

type SystemQuery<
  T extends ComponentTuple,
  V extends ComponentOptionTuple,
  W extends ComponentTuple
> = {
  needed: [...T];
  optional?: [...V];
  unwanted?: [...W];
};

export declare interface EcsRig {
  ecs: EcsInstance;
  makeComponentType: () => typeof Bar;
  makeSystemType: <
    T extends ComponentTuple,
    Props extends Record<PropertyKey, any>,
    V extends ComponentOptionTuple,
    W extends ComponentTuple
  >(
    queries: SystemQuery<T, V, W>
  ) => new (props: EntitySystemArgs<T, Props, V, W>) => EntitySystem<
    T,
    Props,
    V,
    W
  >;
}

export declare type EcsRigCallback = (rig: EcsRig) => void;

export default function ecsRig(callback: EcsRigCallback): void {
  const rig: EcsRig = {
    ecs: new EcsInstance(),
    makeComponentType: () => {
      return class Foo extends Bar {};
    },
    makeSystemType: <
      T extends ComponentTuple,
      Props extends Record<PropertyKey, any>,
      V extends ComponentOptionTuple,
      W extends ComponentTuple
    >(
      query: SystemQuery<T, V, W>
    ): new (props: EntitySystemArgs<T, Props, V, W>) => EntitySystem<
      T,
      Props,
      V,
      W
    > => {
      class Sys extends EntitySystem<T, Props, V, W> {
        needed = query.needed;
        optional = query.optional || ([] as V);
        unwanted = query.unwanted || ([] as W);
        initialize(): void {}
        load(_entities: Bag<Entity>): void {}
        created(_entity: Entity): void {}
        deleted(_entity: Entity): void {}
        added(_entity: Entity): void {}
        removed(_entity: Entity): void {}
        cleanUp(_entities: Bag<Entity>): void {}
        reset(): void {}
        begin(): void {}
        end(): void {}
        process(_entity: Entity, _query: Query, _delta: number): void {}
      }
      return Sys;
    },
  };

  const destroy = () => {
    rig.ecs.cleanUp();
  };

  try {
    callback(rig);
  } catch (error) {
    console.error('ERROR encountered in ecsRig callback:', error);
    throw error;
  } finally {
    destroy();
  }
}
