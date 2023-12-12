/**
 * @deprecated
 */
export class ComponentMapper {
    constructor(component, ecsInstance) {
        this._type = new component().type;
        this._ecsInstance = ecsInstance;
    }
    /**
     * get the component from the specified entity
     * @param entity the entity to get the component for
     * @returns the component if found, otherwise `undefined`
     */
    get(entity) {
        return this._ecsInstance.componentManager.getComponentByType(entity, this._type);
        // const components = this._ecsInstance.componentManager.components.get(
        //   this._type
        // );
        // if (components) {
        //   return components.get(entity.id) as T;
        // } else {
        //   return undefined;
        // }
    }
    getById(id) {
        return this._ecsInstance.componentManager.getComponentByTypeAndId(id, this._type);
        // const components = this._ecsInstance.componentManager.components.get(
        //   this._type
        // );
        // if (components) {
        //   return components.get(id) as T;
        // } else {
        //   return undefined;
        // }
    }
    /**
     * get the component from the specified entity
     * @param component class of component to retrieve
     * @param entity the entity to get the component for
     * @param ecsInstance the instance from which to retrieve the component
     * @returns the component if found, otherwise `undefined`
     */
    static get(component, entity, ecsInstance) {
        const components = ecsInstance.componentManager.components.get(component.type);
        if (components) {
            return components.get(entity.id);
        }
        else {
            return undefined;
        }
    }
}
//# sourceMappingURL=ComponentMapper.js.map