import { Bag } from './Bag';
export class ComponentManager {
    constructor(ecsInstance) {
        this._componentTypes = {};
        this._ecsInstance = ecsInstance;
        this._components = new Bag();
        this._nextTypeId = 0;
    }
    get allTypes() {
        return this._componentTypes;
    }
    /**
     * registers the given component class
     * @param component the component class to register
     */
    registerComponent(component) {
        if (component.type < 0) {
            component.type = this._nextTypeId++;
            this._componentTypes[component.name] = component;
        }
        else if (!this._componentTypes[component.name]) {
            this._componentTypes[component.name] = component;
        }
        if (!this._components.has(component.type)) {
            this._components.set(component.type, new Bag());
        }
    }
    /**
     * the current bag of component bags
     */
    get components() {
        return this._components;
    }
    /**
     * WARNING this is a debug only function
     * gets all the components of a given entity
     * @param entity entity for which to retrieve components
     * @returns a record with component entries by type name
     */
    getAllEntityComponents(entity) {
        const allComponents = {};
        this._components.forEach(components => {
            if (!components)
                return;
            const component = components.get(entity.id);
            if (!component)
                return;
            allComponents[component.constructor.name] = component;
        });
        return allComponents;
    }
    /**
     * WARNING this is a debug only function
     * gets all the components of a given entity
     * @param id id of entity for which to retrieve components
     * @returns a record with component entries by type name
     */
    getAllEntityComponentsById(id) {
        const entity = this._ecsInstance.getEntity(id);
        if (!entity)
            return undefined;
        return this.getAllEntityComponents(entity);
    }
    /**
     * WARNING this is a debug function
     * returns a component type by its type name
     * @param name the class name string of the component type desired
     * @returns that component type
     */
    getComponentTypeByTypeName(name) {
        return this._componentTypes[name];
    }
    /**
     * gets all components of the given type
     * @param component component type to retrieve
     * @returns a bag of components of the type specified
     */
    getComponentsByType(component) {
        return this._components.get(component.type);
    }
    /**
     * get the component for the specified entity of the specified component class
     * @param entity the owning eneity
     * @param component the class of component to retrieve
     * @returns the component for the entity or `undefined` if it doesnt exist
     */
    getComponent(entity, component) {
        return this._components.get(component.type)?.get(entity.id);
    }
    /**
     * get the component for the specified entity id of the specified component class
     * @param id the id of the owning entity
     * @param component the class of component to retrieve
     * @returns the component for the entity or `undefined` if it doesnt exist
     */
    getComponentById(id, component) {
        return this._components.get(component.type)?.get(id);
    }
    getComponentByType(entity, type) {
        const components = this._components.get(type);
        return components ? components.get(entity.id) : undefined;
    }
    getComponentByTypeAndId(id, type) {
        const components = this._components.get(type);
        return components ? components.get(id) : undefined;
    }
    /**
     * adds the given component to the entity
     * @param entity the entity to add the component to
     * @param component the component instance to add to the entity
     */
    addComponent(entity, component) {
        component.owner = entity.id;
        const components = this._components.get(component.type);
        if (components) {
            components.set(entity.id, component);
        }
    }
    /**
     * adds the given component to the entity with the given id
     * @param id the id of the entity to which to add the component
     * @param component the component instance to add to the entity
     */
    addComponentById(id, component) {
        component.owner = id;
        const components = this._components.get(component.type);
        if (components) {
            components.set(id, component);
        }
    }
    addComponents(id, components) {
        for (let i = components.length; i--;) {
            this.addComponentById(id, components[i]);
        }
    }
    /**
     * remove all components for the given entity
     * @param entity the entity from which to remove components
     */
    removeAllComponents(entity) {
        for (let i = 0; i < this._components.length; i++) {
            const components = this._components.get(i);
            if (components) {
                components.set(entity.id, undefined);
            }
        }
    }
    /**
     * remove the specific component instance from its owner
     * @param component the component instance to remove
     */
    removeComponent(component) {
        const components = this._components.get(component.type);
        if (components) {
            components.set(component.owner, undefined);
        }
    }
    removeComponents(components) {
        for (const component of components) {
            this._components.get(component.type)?.set(component.owner, undefined);
            // const bag = this._components.get(component.type);
            // if (bag) {
            //   bag.set(component.owner, undefined);
            // }
        }
    }
    /**
     * remove the specific component instance from its owner
     * @param component the component instance to remove
     */
    removeComponentType(entity, component) {
        const components = this._components.get(component.type);
        if (components) {
            components.set(entity.id, undefined);
        }
    }
    removeComponentTypeById(id, component) {
        const components = this._components.get(component.type);
        if (components) {
            components.set(id, undefined);
        }
    }
    /**
     * handles the deletion of entities
     * @param entity the deleted entity
     */
    deleteEntity(entity) {
        this.removeAllComponents(entity);
    }
    /**
     * does the given entity have a component of the specified type
     * @param entity the entity to check
     * @param type the component type to check
     * @returns `true` if the entity has that component, otherwise `false`
     */
    hasComponent(entity, type) {
        if (type < this._components.capacity) {
            return this._components.get(type)?.has(entity.id) ?? false;
        }
        return false;
    }
    /**
     * checks if the entity with he given id has a component of the specified entity type
     * @param id the id of the entity to check
     * @param type the type field of the component to check
     * @returns `true` if the entity has the component otherwise `false`
     */
    hasComponentById(id, type) {
        if (type < this._components.capacity) {
            return this._components.get(type)?.has(id) ?? false;
        }
        return false;
    }
    /**
     * checks if the tagged entity has a component of the specified entity type
     * @param tag the tagged entity to check
     * @param type the type field of the component to check
     * @returns `true` if the entity has the component otherwise `false`
     */
    hasComponentByTag(tag, type) {
        const entity = this._ecsInstance.getEntityByTag(tag);
        if (!entity)
            return false;
        return !!this._components.get(type)?.get(entity.id) ?? false;
    }
    /**
     * checks if the tagged entity has a component of the specified entity type
     * @param tag the tagged entity to check
     * @param component the componen type to check
     * @returns `true` if the entity has the component otherwise `false`
     */
    hasComponentOfTypeByTag(tag, component) {
        const entity = this._ecsInstance.tagManager.getEntityByTag(tag);
        if (!entity)
            return false;
        return !!this._components.get(component.type)?.get(entity.id) ?? false;
    }
    reset() {
        for (let i = 0; i < this._components.length; i++) {
            const components = this._components.get(i);
            if (components) {
                components.clear();
            }
        }
    }
    /**
     * clean up all the managed components
     */
    cleanUp() {
        for (let i = 0; i < this._components.length; i++) {
            const components = this._components.get(i);
            if (components) {
                components.clear();
            }
        }
        this._components.clear();
        // reset the types
        // Object.values(this._componentTypes).forEach((component) => {
        //   component.type = -1;
        // });
        this._componentTypes = {};
        this._nextTypeId = 0;
    }
}
//# sourceMappingURL=ComponentManager.js.map