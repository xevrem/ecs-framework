import { Option, Result, is_err, is_none } from 'onsreo';
import { ComponentOptionTuple, ComponentTuple, ComponentType } from './types';
import { Bag } from './Bag';
import { Component } from './Component';
import { EcsInstance } from './EcsInstance';
import { Entity } from './Entity';
import { EntitySystem, type EntitySystemArgs } from './EntitySystem';
import { Query } from './Query';
import { EntityBuildError } from './EntityBuilder';

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

export class EcsRigError extends Error {
  constructor(message: string, options?: ErrorOptions & { cause: any }) {
    if (options?.cause?.cause) {
      super(message, {
        cause: options.cause.cause,
      });
    } else {
      super(message, options);
    }
  }
}

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

  addComponent<C extends Component>(
    entity: Option<Entity> | Result<Entity, EntityBuildError>,
    component: C,
    auto: boolean = false,
  ) {
    if (is_none(entity)) {
      throw new EcsRigError('ENTITY DOES NOT EXIST!');
    } else if (is_err<any, Error>(entity)) {
      if (entity instanceof EntityBuildError) {
        throw new EcsRigError(`ENTITY HAS BUILD ERROR:\n${entity.message}`, {
          cause: entity.cause,
        });
      } else {
        throw new EcsRigError('IS ERROR, NOT ENTITY:', { cause: entity });
      }
    } else {
      this.ecs.addComponent(entity, component, auto);
    }
  }

  deleteEntity(entity: Option<Entity> | Result<Entity, EntityBuildError>) {
    if (is_none(entity)) {
      throw new EcsRigError('ENTITY DOES NOT EXIST!');
    } else if (is_err<any, Error>(entity)) {
      if (entity instanceof EntityBuildError) {
        throw new EcsRigError(`ENTITY HAS BUILD ERROR:\n${entity.message}`, {
          cause: entity.cause,
        });
      } else {
        throw new EcsRigError('IS ERROR, NOT ENTITY:', { cause: entity });
      }
    } else {
      this.ecs.deleteEntity(entity);
    }
  }

  getComponent<C extends typeof Component>(
    entity: Option<Entity> | Result<Entity, EntityBuildError>,
    componentType: C,
  ): InstanceType<C> {
    if (is_none(entity)) {
      throw new EcsRigError('ENTITY DOES NOT EXIST!');
    } else if (is_err<any, Error>(entity)) {
      if (entity instanceof EntityBuildError) {
        throw new EcsRigError(`ENTITY HAS BUILD ERROR:\n${entity.message}`, {
          cause: entity.cause,
        });
      } else {
        throw new EcsRigError('IS ERROR, NOT ENTITY:', { cause: entity });
      }
    } else {
      const comp = this.ecs.getComponent(entity, componentType);
      if (is_none(comp)) throw new EcsRigError('COMPONENT DOES NOT EXIST!');
      return comp;
    }
  }

  getComponentByTag<C extends typeof Component>(tag: string, componentType: C) {
    const entity = this.ecs.getEntityByTag(tag);
    return this.getComponent(entity, componentType);
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

  resolve(entity: Option<Entity> | Result<Entity, EntityBuildError>) {
    if (is_none(entity)) {
      throw new EcsRigError('ENTITY DOES NOT EXIST!');
    } else if (is_err<any, Error>(entity)) {
      if (entity instanceof EntityBuildError) {
        throw new EcsRigError(`ENTITY HAS BUILD ERROR:\n${entity.message}`, {
          cause: entity.cause,
        });
      } else {
        throw new EcsRigError('IS ERROR, NOT ENTITY:', { cause: entity });
      }
    } else {
      this.ecs.resolve(entity);
    }
  }

  update(time: number = performance.now()): void {
    this.ecs.updateTime(time);
    this.ecs.resolveEntities();
    this.ecs.runSystems();
  }

  updateByEntity(entity: Option<Entity> | Result<Entity, EntityBuildError>) {
    if (is_none(entity)) {
      throw new EcsRigError('ENTITY DOES NOT EXIST!');
    } else if (is_err<any, Error>(entity)) {
      if (entity instanceof EntityBuildError) {
        throw new EcsRigError(`ENTITY HAS BUILD ERROR:\n${entity.message}`, {
          cause: entity.cause,
        });
      } else {
        throw new EcsRigError('IS ERROR, NOT ENTITY:', { cause: entity });
      }
    } else {
      this.ecs.updateByEntity(entity);
    }
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
      throw new EcsRigError(
        `EXCEPTION ENCOUNTERED IN ECSRIG: \n${cause.message}`,
        {
          cause,
        },
      );
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
