export class SystemManager {
    constructor(ecsInstance) {
        this._systemTypes = {};
        this._ecsInstance = ecsInstance;
        this._staticSystems = [];
        this._reactiveSystems = [];
        this._nextId = 0;
    }
    /**
     * an array of the currently managed systems
     * memoized on startup
     */
    get systems() {
        if (this._systems)
            return this._systems;
        this._systems = this._staticSystems.concat(this._reactiveSystems);
        return this._systems;
    }
    /**
     * WARNING this is a debug function
     * get the system registered by the specified class name
     * @param name class name of the registered system
     * @returns the registered system with the given name
     */
    getSystemByTypeName(name) {
        return this._systemTypes[name];
    }
    /**
     * register a given system class
     * @param System the system class to register
     * @param args the system registration arguments
     * @returns a reference to the registered system
     */
    registerSystem(System, args) {
        const props = {
            id: this._nextId++,
            ecsInstance: this._ecsInstance,
            reactive: false,
            priority: 0,
            ...args,
        };
        const system = new System(props);
        system.buildQuery();
        system.componentTypes.forEach(component => {
            this._ecsInstance.componentManager.registerComponent(component);
        });
        if (system.isReactive) {
            this._reactiveSystems.push(system);
        }
        else {
            this._staticSystems.push(system);
        }
        this._systemTypes[system.constructor.name] = system;
        return system;
    }
    /**
     * initialize all registered systems
     */
    initializeSystems() {
        const systems = this.systems;
        for (let i = systems.length; i--;) {
            this.systems[i].initialize?.();
        }
    }
    /**
     * load all registered systems
     */
    loadSystems() {
        const systems = this.systems;
        for (let i = systems.length; i--;) {
            const system = this.systems[i];
            system.load?.(system.entities);
        }
    }
    initialResolve(entity) {
        const systems = this.systems;
        for (let i = systems.length; i--;) {
            const system = this.systems[i];
            if (system.query.validate(entity)) {
                system.initialResolve(entity);
            }
        }
    }
    initialCreate(entity) {
        const systems = this.systems;
        for (let i = systems.length; i--;) {
            const system = this.systems[i];
            system.query.validate(entity) && system.initialCreate(entity);
        }
    }
    /**
     * attempt to add the created entity to all registered systems
     * @param entity the entity to add
     */
    createEntity(entity) {
        // since this is performance critical, we do each system explicitly
        // rather than using `this.systems`
        for (let i = this._staticSystems.length; i--;) {
            const system = this._staticSystems[i];
            system.query.validate(entity) && system.createEntity(entity);
        }
        for (let i = this._reactiveSystems.length; i--;) {
            const system = this._reactiveSystems[i];
            system.query.validate(entity) && system.createEntity(entity);
        }
    }
    /**
     * resolve the given entity with the static systems.  if valid, will be added
     * if it doesnt already have the entity or removed if invalid
     * @param resolving the entities to resolve
     */
    resolveEntities(resolving) {
        for (let i = resolving.length; i--;) {
            const data = resolving.get(i);
            if (!data)
                continue;
            const [entity, ignored] = data;
            for (let i = this._staticSystems.length; i--;) {
                const system = this._staticSystems[i];
                if (ignored[system.id])
                    continue;
                if (system.query.validate(entity)) {
                    system.addEntity(entity);
                }
                else {
                    // attempt to remove if we ever had it before
                    system.removeEntity(entity);
                }
            }
            for (let i = this._reactiveSystems.length; i--;) {
                const system = this._reactiveSystems[i];
                if (ignored[system.id])
                    continue;
                if (system.query.validate(entity)) {
                    system.addEntity(entity);
                }
            }
        }
    }
    // IDEA: for when we introduce smart resolves
    // resolveAdd(components: Component[]) {
    //   const systems = this.systems;
    //   // for-of is a little faster with sparse data
    //   for (const system of systems) {
    //     let valid = false;
    //     for (const component of components) {
    //       // IF any of the components added are valid,
    //       valid = valid || system.query.isValidComponent(component);
    //     }
    //     // AND we're not an invalid entity
    //     if (valid && system.query.isValidById(components[0].owner)) {
    //       // THEN add this entity
    //       system.addEntityById(components[0].owner);
    //     }
    //   }
    // }
    // IDEA: for when we introduce smart resolves
    // resolveRemove(components: Component[]) {
    //   const systems = this.systems;
    //   // for-of is a little faster with sparse data
    //   for (const system of systems) {
    //     let needed = false;
    //     for (const component of components) {
    //       // IF any are a needed component
    //       needed = needed || system.query.isNeededComponent(component);
    //     }
    //     // AND we're still considered valid
    //     if (needed && system.query.isValidById(components[0].owner)) {
    //       // THEN remove this entity
    //       system.removeEntityById(components[0].owner);
    //     }
    //   }
    // }
    /**
     * delete the given entity from all registered systems
     * @param entity the deleted entity
     */
    deleteEntity(entity) {
        for (let i = this._staticSystems.length; i--;) {
            this._staticSystems[i].deleteEntity(entity);
        }
        // due to the way that we keep reactive systems sparse, we
        // must validate beforehand. this allows reactive systems
        // to receive deletion notifications and do any special
        // cleanup if they alter their internal state based on prior
        // processed entities
        for (let i = this._reactiveSystems.length; i--;) {
            const system = this._reactiveSystems[i];
            system.query.validate(entity) && system.deleteEntity(entity);
        }
    }
    /**
     * IDEA: make update work like smart resolves (should be faster)
     * notify the registered reactive systems that any entities with the
     * supplied components should be added for processing
     * @param updated the arrays of components by owner requiring updates
     */
    update(updated) {
        for (let i = this._systems.length; i--;) {
            const system = this._systems[i];
            for (let owner = updated.length; owner--;) {
                const data = updated.get(owner);
                if (!data)
                    continue;
                // IF any of the components added are valid,
                const maybeValid = data.some(item => {
                    if (item) {
                        const [component, ignored] = item;
                        return (!ignored[system.id] && system.query.isValidComponent(component));
                    }
                    return false;
                });
                // AND we're not an invalid entity
                if (maybeValid && system.query.isValidById(owner)) {
                    // THEN add this entity
                    if (system.isReactive)
                        system.addByUpdateById(owner);
                    else {
                        // static system
                        system.updateById(owner, data);
                    }
                }
            }
        }
    }
    /**
     * notify the registered reactive systems that these entities
     * should be added for processing
     * @param entity the entity to update
     */
    updateEntity(entity) {
        for (let i = this._systems.length; i--;) {
            const system = this._systems[i];
            if (system.query.validate(entity)) {
                system.isReactive && system.addByUpdate(entity);
                !system.isReactive && system.update(entity);
            }
        }
    }
    reset() {
        const systems = this.systems;
        for (let i = systems.length; i--;) {
            this.systems[i].resetSystem();
        }
    }
    /**
     * clean up all registred systems
     */
    cleanUp() {
        this.systems.forEach(system => system.cleanSystem());
        this._staticSystems = [];
        this._reactiveSystems = [];
        this._systemTypes = {};
        this._systems = [];
    }
}
//# sourceMappingURL=SystemManager.js.map