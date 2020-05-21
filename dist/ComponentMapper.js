export class ComponentMapper {
    constructor(component, ecsInstance) {
        this.__type = component.type;
        this.__ecsInstance = ecsInstance;
    }
    get(entity) {
        return this.__ecsInstance.componentManager.components
            .get(this.__type)
            .get(entity.id);
    }
    static get(type, entity, ecsInstance) {
        return ecsInstance.componentManager.components.get(type).get(entity.id);
    }
}
//# sourceMappingURL=ComponentMapper.js.map