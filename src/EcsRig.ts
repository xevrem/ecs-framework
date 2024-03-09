import { ComponentOptionTuple, ComponentTuple } from './types';
import { Bag } from './Bag';
import { Component } from './Component';
import { EcsInstance } from './EcsInstance';
import { Entity } from './Entity';
import { EntitySystem, type EntitySystemArgs } from './EntitySystem';
import { Query } from './Query';

class Bar<T> extends Component {
  data!: T;
  constructor(data?: T) {
    super();
    if (data) {
      this.data = data;
    }
  }
}

type SystemQuery<
  Needed extends ComponentTuple,
  Optional extends ComponentOptionTuple = [],
  Unwanted extends ComponentTuple = [],
> = {
  needed: [...Needed];
  optional?: [...Optional];
  unwanted?: [...Unwanted];
};

export class EcsRig {
  ecs: EcsInstance;
  log: typeof console.log;

  constructor() {
    this.ecs = new EcsInstance();
    this.log = console.log;
  }

  destroy() {
    this.ecs.cleanUp();
  }

  init(): void {
    this.ecs.initializeSystems();
    this.ecs.initialResolve();
    this.ecs.loadSystems();
    this.ecs.initialCreate();
    this.ecs.scheduleSystems();
  }

  makeComponentType<T = number>(): typeof Bar<T> {
    class Foo extends Bar<T> {}
    this.ecs.registerComponent(Foo);
    return Foo;
  }

  makeSystemType<
    Props,
    Needed extends ComponentTuple,
    Optional extends ComponentOptionTuple = [],
    Unwanted extends ComponentTuple = [],
    EsArgs extends EntitySystemArgs<Props, Needed, Optional, Unwanted> = any,
    Sys extends EntitySystem<Props, Needed, Optional, Unwanted> = any,
  >(
    query: SystemQuery<Needed, Optional, Unwanted>,
  ): new (props: EsArgs) => Sys {
    class System extends EntitySystem<Props, Needed, Optional, Unwanted> {
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
      process(
        _entity: Entity,
        _query: Query<
          typeof this.needed,
          typeof this.optional,
          typeof this.unwanted
        >,
        _delta: number,
      ): void {}
    }
    return System as any;
  }

  update(time: number = performance.now()): void {
    this.ecs.updateTime(time);
    this.ecs.resolveEntities();
    this.ecs.runSystems();
  }
}

export declare type EcsRigCallback = (rig: EcsRig) => void;

export function ecsRig(
  callback: EcsRigCallback,
  assertions: number = -1,
): void {
  const rig = new EcsRig();

  try {
    callback(rig);
  } catch (cause) {
    if (cause instanceof Error) {
      const err = new Error(
        'ERROR encountered in ecsRig callback: \n${cause.message}',
        {
          cause: cause.cause,
        },
      );
      err.stack = cause.stack;
      throw err;
    } else {
      throw cause;
    }
  } finally {
    if (assertions > 0) {
      expect.assertions(assertions);
    }
    rig.destroy();
  }
}

export default ecsRig;
