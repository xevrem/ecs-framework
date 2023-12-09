import { Bag } from './Bag';
import { Component } from './Component';
import { EcsInstance } from './EcsInstance';
import { Entity } from './Entity';
import { EntitySystem, EntitySystemArgs } from './EntitySystem';
import { Query } from './Query';

class Bar extends Component {
  [x: string]: number;
}

export declare interface EcsRig {
  ecs: EcsInstance;
  makeComponentType: () => typeof Bar;
  makeSystemType: (queries: {
    needed?: (typeof Component)[];
    optional?: (typeof Component)[];
    unwanted?: (typeof Component)[];
  }) => new (props: EntitySystemArgs) => EntitySystem;
}

export declare type EcsRigCallback = (rig: EcsRig) => void;

export default function ecsRig(callback: EcsRigCallback): void {
  const rig: EcsRig = {
    ecs: new EcsInstance(),
    makeComponentType: (): typeof Bar => {
      return class Foo extends Bar {};
    },
    makeSystemType: ({ needed = [], optional = [], unwanted = [] } = {}): new (
      props: EntitySystemArgs
    ) => EntitySystem => {
      class Sys extends EntitySystem {
        needed = needed;
        optional = optional;
        unwanted = unwanted;
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
