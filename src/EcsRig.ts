import {
  ComponentOptionTuple,
  ComponentTuple,
  EntitySystemArgs,
} from './types';
import { Bag } from './Bag';
import { Component } from './Component';
import { EcsInstance } from './EcsInstance';
import { Entity } from './Entity';
import { EntitySystem } from './EntitySystem';
import { Query } from './Query';

class Bar<T> extends Component {
  data!: T;
}

type SystemQuery<
  T extends ComponentTuple,
  V extends ComponentOptionTuple,
  W extends ComponentTuple,
> = {
  needed: [...T];
  optional?: [...V];
  unwanted?: [...W];
};

export declare interface EcsRig {
  ecs: EcsInstance;
  init(): void;
  update(time?: number): void;
  makeComponentType<T = number>(): typeof Bar<T>;
  makeSystemType<
    Props,
    T extends ComponentTuple,
    V extends ComponentOptionTuple,
    W extends ComponentTuple,
    EsArgs extends EntitySystemArgs<Props, T, V, W>,
    Sys extends EntitySystem<Props, T, V, W>,
  >(
    queries: SystemQuery<T, V, W>,
  ): new (props: EsArgs) => Sys;
}

export declare type EcsRigCallback = (rig: EcsRig) => void;

export default function ecsRig(callback: EcsRigCallback): void {
  const rig: EcsRig = {
    ecs: new EcsInstance(),
    init() {
      rig.ecs.initializeSystems();
      rig.ecs.initialResolve();
      rig.ecs.loadSystems();
      rig.ecs.initialCreate();
      rig.ecs.scheduleSystems();
    },
    makeComponentType<T = number>() {
      class Foo extends Bar<T> {}
      rig.ecs.registerComponent(Foo);
      return Foo;
    },
    makeSystemType<
      Props,
      T extends ComponentTuple,
      V extends ComponentOptionTuple,
      W extends ComponentTuple,
      EsArgs extends EntitySystemArgs<Props, T, V, W>,
      Sys extends EntitySystem<Props, T, V, W>,
    >(query: SystemQuery<T, V, W>): new (props: EsArgs) => Sys {
      class System extends EntitySystem<Props, T, V, W> {
        needed = query.needed;
        optional = query.optional || ([] as any);
        unwanted = query.unwanted || ([] as any);
        constructor(props: EsArgs) {
          super(props);
        }
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
      return System as any;
    },
    update(time = performance.now()) {
      rig.ecs.updateTime(time);
      rig.ecs.resolveEntities();
      rig.ecs.runSystems();
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
