import { EcsInstance } from './EcsInstance';
import { Entity } from './Entity';
import { ComponentOptionTuple, ComponentTuple, JoinedResult } from './types';

export declare interface QueryFuncParams<
  Needed extends ComponentTuple,
  Optional extends ComponentOptionTuple = [],
  Unwanted extends ComponentTuple = [],
> {
  query: FuncQuery<Needed, Optional, Unwanted>;
  ecs: EcsInstance;
  delta: number;
}

export declare type QueryFunc<
  Needed extends ComponentTuple,
  Optional extends ComponentOptionTuple = [],
  Unwanted extends ComponentTuple = [],
> = (params: QueryFuncParams<Needed, Optional, Unwanted>) => void;

export class FuncQuery<
  Needed extends ComponentTuple,
  Optional extends ComponentOptionTuple = [],
  Unwanted extends ComponentTuple = [],
> {
  ecs: EcsInstance;
  needed: [...Needed];
  optional: [...Optional];
  unwanted: [...Unwanted];
  entities: Entity[];
  reactive: boolean;

  constructor(
    ecs: EcsInstance,
    needed: [...Needed],
    optional?: [...Optional],
    unwanted?: [...Unwanted],
    reactive: boolean = false,
  ) {
    this.ecs = ecs;
    this.needed = needed;
    this.optional = optional || ([] as unknown as [...Optional]);
    this.unwanted = unwanted || ([] as unknown as [...Unwanted]);
    this.entities = [];
    this.reactive = reactive;
  }

  /**
   * clear entity list
   */
  clear(): void {
    this.entities = [];
  }

  /**
   * does the given entity have an unwanted component
   * @param entity the entity to check
   * @returns 'true' if an unwanted component was found
   */
  isInvalid(entity: Entity): boolean {
    for (let i = this.unwanted.length; i--; ) {
      if (this.ecs.hasComponentOfTypeId(entity, this.unwanted[i].type))
        return true;
    }
    return false;
  }

  /**
   * does the entity contain every component required by the query
   * @param entity the entity to check
   * @returns 'true' if all required components were found
   */
  isValid(entity: Entity): boolean {
    for (let i = this.needed.length; i--; ) {
      if (!this.ecs.hasComponentOfTypeId(entity, this.needed[i].type))
        return false;
    }
    return true;
  }

  join(): IterableIterator<JoinedResult<Needed, Optional>> {
    /* IF entities is populated,
     * THEN join on it,
     * ELSE join on all
     */
    return this.reactive
      ? this.joinOn()
      : this.ecs.joinAll(this.needed, this.optional, this.unwanted);
  }

  private joinOn(): IterableIterator<JoinedResult<Needed, Optional>> {
    const results = this.ecs.join(
      this.entities,
      this.needed,
      this.optional,
      this.unwanted,
    );
    return results;
  }

  *onEntities(): IterableIterator<Entity> {
    for (let i = this.entities.length; i--; ) {
      yield this.entities[i];
    }
    return;
  }
}
