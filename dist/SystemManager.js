export class SystemManager {
    constructor(ecsInstance) {
        this.__ecsInstance = ecsInstance;
        this.__systems = [];
    }
    get systems() {
        return this.__systems;
    }
    setSystem(system, ...components) {
        components.forEach(component => {
            this.__ecsInstance.componentManager.registerComponent(component);
            system.componentTypes.push(component.type);
        });
        system.ecsInstance = this.__ecsInstance;
        this.__systems.push(system);
        return system;
    }
    initializeSystems() {
        this.__systems.forEach(system => system.initialize());
    }
    systemsLoadContent() {
        this.__systems.forEach(system => system.loadContent());
    }
    resolve(entity) {
        let valid = false;
        this.__systems.forEach(system => {
            valid = true;
            system.componentTypes.forEach(type => {
                valid = valid && this.__ecsInstance.hasComponent(entity, type);
            });
            if (valid) {
                system.addEntity(entity);
            }
            else {
                // attempt to remove if we ever had it before
                system.removeEntity(entity);
            }
        });
    }
    deleteEntity(entity) {
        this.__systems.forEach(system => system.removeEntity(entity));
    }
    cleanUp() {
        this.__systems.forEach(system => system.cleanSystem());
        this.__systems = [];
    }
}
//# sourceMappingURL=SystemManager.js.map