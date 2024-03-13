import { Bag } from './Bag';
import { EcsInstance } from './EcsInstance';
import { Component } from './Component';
import { Entity } from './Entity';
import {
  ComponentOptionTuple,
  ComponentTuple,
  JoinedData,
  JoinedQuery,
  JoinedResult,
} from './types';

export declare interface QueryArgs<
  T extends ComponentTuple = ComponentTuple,
  V extends ComponentOptionTuple = ComponentOptionTuple,
  W extends ComponentTuple = ComponentTuple,
> {
  ecsInstance: EcsInstance;
  needed: [...T];
  optional?: [...V];
  unwanted?: [...W];
}

export class Query<
  Needed extends ComponentTuple = [],
  Optional extends ComponentOptionTuple = [],
  Unwanted extends ComponentTuple = [],
> {
  private _ecsInstance: EcsInstance;
  private _needed: [...Needed];
  private _optional: [...Optional];
  private _unwanted: [...Unwanted];
  private _data: JoinedQuery<Needed, Optional>[];
  private _entity!: Entity;

  constructor(props: QueryArgs<Needed, Optional, Unwanted>) {
    this._ecsInstance = props.ecsInstance;
    this._needed = props.needed;
    this._optional = props.optional || ([] as unknown as [...Optional]);
    this._unwanted = props.unwanted || ([] as unknown as [...Unwanted]);
    this._data = [];
  }

  /**
   * current needed components
   */
  get needed(): (typeof Component)[] {
    return this._needed;
  }

  get data(): JoinedQuery<Needed, Optional>[] {
    return this._data;
  }

  set entity(value: Entity) {
    this._entity = value;
  }

  /**
   * a very useful component retrieval function
   * @param component - the component type to retrieve
   * @returns the instance of that component, if any
   */
  get<T extends typeof Component>(component: T): InstanceType<T> {
    return this._ecsInstance.getComponent(
      this._entity,
      component,
    ) as InstanceType<T>;
  }

  resolve(entities: Bag<Entity>): void {
    this._data = [];
    entityLoop: for (let e = entities.length; e--; ) {
      const entity = entities.get(e);
      if (!entity) continue;
      for (let i = this._unwanted.length; i--; ) {
        if (this._ecsInstance.hasComponent(entity, this._unwanted[i]))
          continue entityLoop;
      }
      const components: any[] = [];
      // for the following for-loops, order maters
      for (let i = 0; i < this._needed.length; i++) {
        const component = this._ecsInstance.getComponent(
          entity,
          this._needed[i],
        );
        if (!component) continue entityLoop;
        components.push(component);
      }

      for (let i = 0; i < this._optional.length; i++) {
        const component = this._ecsInstance.getComponent(
          entity,
          this._optional[i],
        );
        components.push(component);
      }
      this._data.push([components, entity] as JoinedQuery<Needed, Optional>);
    }
  }

  /**
   * does the given entity have an unwanted component
   * @param entity the entity to check
   * @returns 'true' if an unwanted component was found
   */
  isInvalid(entity: Entity): boolean {
    for (let i = this._unwanted.length; i--; ) {
      if (
        this._ecsInstance.hasComponentOfTypeId(entity, this._unwanted[i].type)
      )
        return true;
    }
    return false;
  }

  /**
   * does the given entity, found by its id, have an unwanted component
   * @param id the id of the entity to check
   * @returns 'true' if an unwanted component was found
   */
  isInvalidById(id: number): boolean {
    for (let i = this._unwanted.length; i--; ) {
      if (
        this._ecsInstance.hasComponentByIdOfTypeId(id, this._unwanted[i].type)
      )
        return true;
    }
    return false;
  }

  isNeededComponent(component: Component): boolean {
    return this._needed.includes(component.constructor as typeof Component);
  }

  /**
   * does the entity contain every component required by the query
   * @param entity the entity to check
   * @returns 'true' if all required components were found
   */
  isValid(entity: Entity): boolean {
    for (let i = this._needed.length; i--; ) {
      if (!this._ecsInstance.hasComponentOfTypeId(entity, this._needed[i].type))
        return false;
    }
    return true;
  }

  /**
   * does the entity, found by its id, contain every component required by the query
   * @param id the id of the entity to check
   * @returns 'true' if all required components were found
   */
  isValidById(id: number): boolean {
    for (let i = this._needed.length; i--; ) {
      if (!this._ecsInstance.hasComponentByIdOfTypeId(id, this._needed[i].type))
        return false;
    }
    return true;
  }

  isOptional(entity: Entity): boolean {
    for (let i = this._optional.length; i--; ) {
      if (this._ecsInstance.hasComponent(entity, this._optional[i]))
        return true;
    }
    return false;
  }

  isOptionalById(id: number): boolean {
    for (let i = this._optional.length; i--; ) {
      if (this._ecsInstance.hasComponentById(id, this._optional[i]))
        return true;
    }
    return false;
  }

  /**
   * checks if the given component is valid for this query
   * @param component the component to check
   * @returns `true` if valid, `false` if not
   */
  isValidComponent(component: Component): boolean {
    // IDEA: use bags instead of Arrays or maybe both depending on context
    //       this will give us O(1) validity checks
    return (
      this._needed.includes(component.constructor as typeof Component) ||
      this._optional.includes(component.constructor as typeof Component)
    );
  }

  join(
    entities: Entity[],
    needed?: [...Needed],
    optional?: [...Optional],
    unwanted?: [...Unwanted],
  ): IterableIterator<JoinedResult<Needed, Optional>> {
    return this._ecsInstance.join(entities, needed, optional, unwanted);
  }

  joinById(
    ids: number[],
    needed?: [...Needed],
    optional?: [...Optional],
    unwanted?: [...Unwanted],
  ): IterableIterator<JoinedResult<Needed, Optional>> {
    return this._ecsInstance.joinById(ids, needed, optional, unwanted);
  }

  joinAll(
    needed?: [...Needed],
    optional?: [...Optional],
    unwanted?: [...Unwanted],
  ): IterableIterator<JoinedResult<Needed, Optional>> {
    return this._ecsInstance.joinAll(needed, optional, unwanted);
  }

  retrieve(): JoinedData<Needed, Optional> {
    return this._ecsInstance.retrieve(
      this._entity,
      this._needed,
      this._optional,
    );
  }

  // retrieveById(id: number): JoinedData<[], Optional> {
  //   return this._ecsInstance.retrieveById(id, [...this._optional]);
  // }

  /**
   * validates the given entity for this query
   * @param entity the entity to validate
   * @returns `true` if valid, `false` if not
   */
  validate(entity: Entity): boolean {
    const valid = this.isValid(entity);
    const invalid = this.isInvalid(entity);
    return valid && !invalid;
  }

  /**
   * validates the given entity id for this query
   * @param id the id of the entity to validate
   * @returns `true` if valid, `false` if not
   */
  validateById(id: number): boolean {
    const valid = this.isValidById(id);
    const invalid = this.isInvalidById(id);
    return valid && !invalid;
  }
}
