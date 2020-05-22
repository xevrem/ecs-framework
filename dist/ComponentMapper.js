export class ComponentMapper {
    constructor(component, ecsInstance) {
        this._type = component.type;
        this._ecsInstance = ecsInstance;
    }
    get(entity) {
        return this._ecsInstance.componentManager.components
            .get(this._type)
            .get(entity.id);
    }
    static get(component, entity, ecsInstance) {
        return ecsInstance.componentManager.components.get(component.type).get(entity.id);
    }
}
//# sourceMappingURL=ComponentMapper.js.map