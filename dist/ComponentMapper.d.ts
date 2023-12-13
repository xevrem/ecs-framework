import { Entity } from './Entity';
import { Component } from './Component';
import { EcsInstance } from './EcsInstance';
/**
 * @deprecated
 */
export declare class ComponentMapper<T extends Component> {
    private _type;
    private _ecsInstance;
    constructor(component: new () => T, ecsInstance: EcsInstance);
    /**
     * get the component from the specified entity
     * @param entity the entity to get the component for
     * @returns the component if found, otherwise `undefined`
     */
    get(entity: Entity): T;
    getById(id: number): T;
    /**
     * get the component from the specified entity
     * @param component class of component to retrieve
     * @param entity the entity to get the component for
     * @param ecsInstance the instance from which to retrieve the component
     * @returns the component if found, otherwise `undefined`
     */
    static get<T extends typeof Component>(component: T, entity: Entity, ecsInstance: EcsInstance): InstanceType<T> | undefined;
}
//# sourceMappingURL=ComponentMapper.d.ts.map