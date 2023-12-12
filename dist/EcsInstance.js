import { EntityManager } from './EntityManager';
import { ComponentManager } from './ComponentManager';
import { SystemManager } from './SystemManager';
import { TagManager } from './TagManager';
import { GroupManager } from './GroupManager';
import { ComponentMapper } from './ComponentMapper';
import { Scheduler } from './Scheduler';
import { Bag } from './Bag';
import { makeEntityBuilder } from './EntityBuilder';
import { FuncQuery } from './FuncQuery';
import { is_none, makeTimer } from './utils';
const timer = makeTimer(1);
export class EcsInstance {
    constructor() {
        this._destroyed = false;
        this.qSysTuple = [];
        this.entityManager = new EntityManager();
        this.componentManager = new ComponentManager(this);
        this.systemManager = new SystemManager(this);
        this.tagManager = new TagManager();
        this.groupManager = new GroupManager();
        this.scheduler = new Scheduler();
        this._creating = new Bag();
        this._resolving = new Bag();
        this._deleting = new Bag();
        this._updatingEntities = [];
        this._updating = new Bag();
        this._delta = 0;
        this._lastTime = 0;
        this._elapsed = 0;
    }
    get delta() {
        return this._delta;
    }
    get elapsed() {
        return this._elapsed;
    }
    get lastTime() {
        return this._lastTime;
    }
    /**
     * stop a recently created entity from being resolved
     * @param entity the entity to abort
     */
    abort(entity) {
        this._creating.set(entity.id, undefined);
        this.componentManager.deleteEntity(entity);
        this.entityManager.deleteEntity(entity);
    }
    /**
     * add a component to an entity
     * @param entity the entity to receive the component
     * @param component the component to add
     */
    addComponent(entity, component) {
        this.componentManager.addComponent(entity, component);
    }
    addComponentById(id, component) {
        this.componentManager.addComponentById(id, component);
    }
    /**
     * create a new entity
     * @returns the created entity
     */
    createEntity() {
        const entity = this.entityManager.create();
        this._creating.set(entity.id, entity);
        return entity;
    }
    create() {
        return makeEntityBuilder(this);
    }
    /**
     * delete an entity
     * @param entity the entity to delete
     */
    deleteEntity(entity) {
        this._deleting.set(entity.id, entity);
    }
    /**
     * deletes multiple entities
     * @param entities the entity to delete
     */
    deleteEntities(entities) {
        for (let i = entities.length; i--;) {
            this.deleteEntity(entities[i]);
        }
    }
    deleteEntityBag(entities) {
        this._deleting.setBag(entities);
    }
    getComponentsByType(component) {
        return this.componentManager.getComponentsByType(component);
    }
    /**
     * get the component for the specified entity of the specified component class
     * @param entity the owning entity
     * @param component the class of component to retrieve
     * @returns the component for the entity or `undefined` if it doesnt exist
     */
    getComponent(entity, component) {
        return this.componentManager.getComponent(entity, component);
    }
    getComponentById(id, component) {
        return this.componentManager.getComponentById(id, component);
    }
    getComponentByTag(tag, component) {
        const entity = this.getEntityByTag(tag);
        if (!entity)
            return undefined;
        return this.componentManager.getComponent(entity, component);
    }
    /**
     * a very useful component retrieval function
     * @param entity entity who owns the component
     * @param component the component type to retrieve
     * @returns the instance of that component, if any
     */
    getComponentOfType(entity, component) {
        return this.getComponent(entity, component);
    }
    /**
     * a very useful component retrieval function
     * @param id id of entity who owns the component
     * @param component the component type to retrieve
     * @returns the instance of that component, if any
     */
    getComponentOfTypeById(id, component) {
        return this.getComponentById(id, component);
    }
    getComponentOfTypeByTag(tag, component) {
        return this.getComponentByTag(tag, component);
    }
    /**
     * gets a component for the given entity with the given typeId
     * @param entity to retrieve component from
     * @param typeId the numeric type of the component
     * @returns the instance of that component type, if any
     */
    getComponentByTypeId(entity, typeId) {
        return this.componentManager.getComponentByType(entity, typeId);
    }
    /**
     * returns the entity with the spcified `id` if it exists
     * @param id the id of the entity requested
     * @returns the required entity if found or `undefined`
     */
    getEntity(id) {
        return this.entityManager.getEntity(id);
    }
    /**
     * gets the entity assigned to the given tag
     * @param tag the tag to retrieve
     * @returns the entity if tagged, otherwise `undefined`
     */
    getEntityByTag(tag) {
        return this.tagManager.getEntityByTag(tag);
    }
    tagExists(tag) {
        return this.tagManager.tagExists(tag);
    }
    /**
     * returns the `Bag` of entities for the specified group
     * @param group the group to retrieve
     * @returns the bag for the specified group
     */
    getGroup(group) {
        return this.groupManager.getGroup(group);
    }
    /**
     * checks if the given entity has a component of the specified entity type
     * @param entity the entity to check
     * @param type the type field of the component to check
     * @returns `true` if the entity has the component otherwise `false`
     */
    hasComponent(entity, type) {
        return this.componentManager.hasComponent(entity, type);
    }
    /**
     * checks if the given entity has a component of the specified entity type
     * @param entity the entity to check
     * @param componentType type to check
     * @returns `true` if the entity has the component otherwise `false`
     */
    hasComponentOfType(entity, componentType) {
        return this.componentManager.hasComponent(entity, componentType.type);
    }
    /**
     * checkes if the given entity has a component of the specified entity type
     * @param id the entity id to check
     * @param componentType type to check
     * @returns `true` if the entity has the component otherwise `false`
     */
    hasComponentOfTypeById(id, componentType) {
        return this.componentManager.hasComponentById(id, componentType.type);
    }
    /**
     * checks if the entity witht he given id has a component of the specified entity type
     * @param id the id of the entity to check
     * @param type the type field of the component to check
     * @returns `true` if the entity has the component otherwise `false`
     */
    hasComponentById(id, type) {
        return this.componentManager.hasComponentById(id, type);
    }
    /**
     * checks if the tagged entity has a component of the specified entity type
     * @param tag the tagged entity to check
     * @param type the type field of the component to check
     * @returns `true` if the entity has the component otherwise `false`
     */
    hasComponentByTag(tag, type) {
        return this.componentManager.hasComponentByTag(tag, type);
    }
    /**
     * checks if the tagged entity has a component of the specified entity type
     * @param tag the tagged entity to check
     * @param component the componen type to check
     * @returns `true` if the entity has the component otherwise `false`
     */
    hasComponentOfTypeByTag(tag, component) {
        return this.componentManager.hasComponentOfTypeByTag(tag, component);
    }
    initializeSystems() {
        this.systemManager.initializeSystems();
    }
    loadSystems() {
        this.systemManager.loadSystems();
    }
    /**
     * makes a component mapper for the specific component type
     * @deprecated
     * @param component a component type to use to build the mapper
     * @return a component mapper for the given component type
     */
    makeMapper(component) {
        return new ComponentMapper(component, this);
    }
    /**
     * registeres a component with the component manager
     * @param component the component type to register
     */
    registerComponent(component) {
        this.componentManager.registerComponent(component);
    }
    registerSystem(System, args) {
        return this.systemManager.registerSystem(System, args);
    }
    /**
     * remove the given component from its owner
     * @param component the component to remove
     */
    removeComponent(component) {
        this.componentManager.removeComponent(component);
    }
    /**
     * remove the component of the given type from the specified entity
     * @param entity the target entity
     * @param component the component type to remove
     */
    removeComponentType(entity, component) {
        this.componentManager.removeComponentType(entity, component);
    }
    removeComponentTypeById(id, component) {
        this.componentManager.removeComponentTypeById(id, component);
    }
    /**
     * resolve the given entity against the current ecs instance. This will
     * let all registered systems whose queries match the entity receive it
     * for processing
     * @param entity the entity to resolve
     */
    resolve(entity, ignoredSystems = []) {
        const ignored = [];
        for (let i = ignoredSystems.length; i--;) {
            ignored[ignoredSystems[i]] = true;
        }
        this._resolving.set(entity.id, [entity, ignored]);
    }
    /**
     * resolve the entity that has the given id against he current ecs instance.
     * this will let all registered sytems whose queries match the entity receive
     * it for processing
     * @param id the id of the entity to resolve
     */
    resolveById(id, ignoredSystems = []) {
        const ignored = [];
        for (let i = ignoredSystems.length; i--;) {
            ignored[ignoredSystems[i]] = true;
        }
        const entity = this.getEntity(id);
        entity && this._resolving.set(id, [entity, ignored]);
    }
    /**
     * performs initial resolve of all early defined entities
     */
    initialResolve() {
        const creating = this._creating;
        this._creating = new Bag(creating.capacity);
        // verify there is work to do in the sparse bag
        if (creating.count > 0) {
            for (let i = creating.length; i--;) {
                const entity = creating.get(i);
                entity && this.systemManager.initialResolve(entity);
            }
        }
    }
    /**
     * performs initial create of all early defined entities (load phase)
     */
    initialCreate() {
        const creating = this._creating;
        this._creating = new Bag(creating.capacity);
        // verify there is work to do in the sparse bag
        if (creating.count > 0) {
            for (let i = creating.length; i--;) {
                const entity = creating.get(i);
                entity && this.systemManager.initialCreate(entity);
            }
        }
    }
    /**
     * triggers the resolution update cycle. this processes all new, resolving,
     * updating, and deleting entities
     */
    resolveEntities() {
        // move the memory into some temp variables, so that if any of the below
        // processes cause an update to any of them, they are not possibly lost
        const deleting = this._deleting, resolving = this._resolving, updating = this._updating, updatingEntities = this._updatingEntities, creating = this._creating;
        this._deleting = new Bag(deleting.capacity);
        this._resolving = new Bag(resolving.capacity);
        this._updating = new Bag(updating.capacity);
        this._updatingEntities = [];
        if (deleting.count > 0) {
            for (let i = deleting.length; i--;) {
                const entity = deleting.get(i);
                if (!entity)
                    continue;
                this.systemManager.deleteEntity(entity);
                this.tagManager.deleteEntity(entity);
                this.groupManager.deleteEntity(entity);
                this.componentManager.deleteEntity(entity);
                this.entityManager.deleteEntity(entity);
            }
        }
        if (resolving.count > 0) {
            this.systemManager.resolveEntities(resolving);
        }
        if (updating.count > 0) {
            this.systemManager.update(updating);
        }
        for (let i = updatingEntities.length; i--;) {
            this.systemManager.updateEntity(updatingEntities[i]);
        }
        // verify there is work to do in the sparse bag
        if (creating.count > 0) {
            for (let i = creating.length; i--;) {
                const entity = creating.get(i);
                entity && this.systemManager.createEntity(entity);
                // we do not want to update creating unil after creation is completed
                this._creating.set(i, undefined);
            }
        }
    }
    /**
     * request the scheduler to run all registered systems
     */
    runSystems() {
        this.scheduler.runSystems();
        this.runQuerySystems();
    }
    /**
     * take all registered systems and schedule them
     */
    scheduleSystems() {
        this.scheduler.systems = this.systemManager.systems;
        this.scheduler.sortSystems();
    }
    /**
     * notify any reactive systems that utilize this component to process
     * the owning entity during its next processing cycle
     * @param component the component to notify systems about
     * @param ignoredSystems the systems this update should ignore
     */
    update(component, ignoredSystems = []) {
        if (!this._updating.has(component.owner))
            this._updating.set(component.owner, new Bag());
        const data = this._updating.get(component.owner);
        if (data) {
            const smartUpdate = data.get(component.type);
            let ignored = [];
            if (smartUpdate) {
                ignored = smartUpdate[1];
            }
            for (let i = ignoredSystems.length; i--;) {
                ignored[ignoredSystems[i]] = true;
            }
            data.set(component.type, [component, ignored]);
        }
    }
    /**
     * notify any reactive systems any entities with the given component type should
     * be processed
     * @param entity which owns the component
     * @param componentType the component type to notify systems about
     * @param ignoredSystems the systems this update should ignore
     */
    updateComponent(entity, componentType, ignoredSystems = []) {
        const maybeComponent = this.getComponent(entity, componentType);
        if (maybeComponent) {
            this.update(maybeComponent, ignoredSystems);
        }
    }
    /**
     * notify any reactive systems that utilize these components to
     * process the owning entity during its next processing cycle
     * @param components the components to notify systems about
     * @param ignoredSystems the systems this update should ignore
     */
    updateAll(components, ignoredSystems = []) {
        for (let i = components.length; i--;) {
            this.update(components[i], ignoredSystems);
        }
    }
    /**
     * notify any reactive systems to process this entity,
     * if its components satisfy their queries
     * @param entity
     */
    updateByEntity(entity) {
        this._updatingEntities.push(entity);
    }
    updateByEntities(entities) {
        this._updatingEntities = this._updatingEntities.concat(entities);
    }
    /**
     * update the internal ecs instance timing information with the current time
     * @param time current time in miliseconds
     */
    updateTime(time) {
        this._delta = (time - this._lastTime) / 1000;
        this._elapsed += this._delta;
        this._lastTime = time;
    }
    /**
     * update the internal ecs instance timing information with a delta time
     * @param delta the time delta since the ecs instance was last updated
     */
    updateByDelta(delta) {
        this._delta = delta;
        this._elapsed += this._delta;
        this._lastTime = performance.now();
    }
    destroy() {
        if (!this._destroyed) {
            this._destroyed = true;
            this.cleanUp();
        }
    }
    reset() {
        this.systemManager.reset();
        this.componentManager.reset();
        this.tagManager.cleanUp();
        this.groupManager.cleanUp();
        this.entityManager.reset();
    }
    /**
     * tell the ecs instance to cleanup everything
     */
    cleanUp() {
        this.systemManager.cleanUp();
        this.componentManager.cleanUp();
        this.groupManager.cleanUp();
        this.tagManager.cleanUp();
        this.entityManager.cleanUp();
        this.scheduler.cleanUp();
    }
    _joiner(entity, needed, optional, unwanted) {
        const id = entity.id;
        let valid = true;
        const result = [];
        if (unwanted) {
            for (let j = unwanted ? unwanted.length : 0; j--;) {
                if (this.hasComponentById(id, unwanted[j].type)) {
                    valid = false;
                    break;
                }
            }
            if (!valid)
                return null;
        }
        if (needed) {
            for (let j = 0; j < needed.length; j++) {
                const gotComponents = this.componentManager.components.get(needed[j].type);
                const value = gotComponents ? gotComponents.get(id) : undefined;
                valid = (value && valid);
                if (!valid)
                    break;
                result.push(value);
            }
            if (!valid)
                return null;
        }
        if (optional) {
            for (let j = 0; j < optional.length; j++) {
                const gotComponents = this.componentManager.components.get(optional[j].type);
                const value = gotComponents ? gotComponents.get(id) : undefined;
                result.push(value);
            }
        }
        if (valid)
            return [result, entity];
        return null;
    }
    *join(entities, needed, optional, unwanted) {
        //   [components: [...OrderedTuple<T>, ...OrderedTuple<V>], entity: Entity]
        // > {
        for (let i = entities.length; i--;) {
            const entity = entities[i];
            const id = entity.id;
            let valid = true;
            const result = [];
            if (unwanted) {
                for (let j = unwanted ? unwanted.length : 0; j--;) {
                    if (this.hasComponentById(id, unwanted[j].type)) {
                        valid = false;
                        break;
                    }
                }
                if (!valid)
                    continue;
            }
            if (needed) {
                for (let j = 0; j < needed.length; j++) {
                    const gotComponents = this.componentManager.components.get(needed[j].type);
                    const value = gotComponents ? gotComponents.get(id) : undefined;
                    valid = (value && valid);
                    if (!valid)
                        break;
                    result.push(value);
                }
                if (!valid)
                    continue;
            }
            if (optional) {
                for (let j = 0; j < optional.length; j++) {
                    const gotComponents = this.componentManager.components.get(optional[j].type);
                    const value = gotComponents ? gotComponents.get(id) : undefined;
                    result.push(value);
                }
            }
            if (valid)
                yield [result, entity];
            // [
            //     components: [...OrderedTuple<T>, ...OrderedTuple<V>],
            //     entity: Entity
            //   ];
        }
        return;
    }
    *joinByBag(bag, needed, optional, unwanted) {
        for (let i = bag.length; i--;) {
            const entity = bag.get(i);
            if (!entity)
                continue;
            const valid = this._joiner(entity, needed, optional, unwanted);
            if (!valid)
                continue;
            yield valid;
        }
        return;
    }
    *joinByComponentBag(bag, needed, optional, unwanted) {
        for (let i = bag.length; i--;) {
            const component = bag.get(i);
            if (!component)
                continue;
            const entity = this.getEntity(component.owner);
            if (!entity)
                continue;
            const valid = this._joiner(entity, needed, optional, unwanted);
            if (!valid)
                continue;
            yield valid;
        }
        return;
    }
    *joinByGroup(group, needed, optional, unwanted) {
        const bag = this.groupManager.getGroup(group);
        if (!bag)
            return [];
        yield* this.joinByBag(bag, needed, optional, unwanted);
    }
    *joinById(ids, needed, optional, unwanted) {
        //   [components: [...OrderedTuple<T>, ...OrderedTuple<V>], entity: Entity]
        // > {
        for (let i = ids.length; i--;) {
            const id = ids[i];
            const entity = this.getEntity(id);
            if (!entity)
                continue;
            let valid = true;
            const result = [];
            if (unwanted) {
                for (let j = unwanted ? unwanted.length : 0; j--;) {
                    if (this.hasComponentById(id, unwanted[j].type)) {
                        valid = false;
                        break;
                    }
                }
                if (!valid)
                    continue;
            }
            if (needed) {
                for (let j = 0; j < needed.length; j++) {
                    const gotComponents = this.componentManager.components.get(needed[j].type);
                    const value = gotComponents ? gotComponents.get(id) : null;
                    valid = (value && valid);
                    if (!valid || is_none(value))
                        break;
                    result.push(value);
                }
                if (!valid)
                    continue;
            }
            if (optional) {
                for (let j = 0; j < optional.length; j++) {
                    const gotComponents = this.componentManager.components.get(optional[j].type);
                    const value = gotComponents ? gotComponents.get(id) : null;
                    result.push(value);
                }
            }
            if (valid)
                yield [result, entity];
            // as [
            //     [...OrderedTuple<T>, ...OrderedTuple<V>],
            //     Entity
            //   ];
        }
        return;
    }
    *joinByTag(tags, needed, optional, unwanted) {
        for (let i = tags.length; i--;) {
            const tag = tags[i];
            const entity = this.tagManager.getEntityByTag(tag);
            if (!entity)
                continue;
            let valid = true;
            const result = [];
            if (unwanted) {
                for (let j = unwanted ? unwanted.length : 0; j--;) {
                    if (this.hasComponent(entity, unwanted[j].type)) {
                        valid = false;
                        break;
                    }
                }
                if (!valid)
                    continue;
            }
            if (needed) {
                for (let j = 0; j < needed.length; j++) {
                    const gotComponents = this.componentManager.components.get(needed[j].type);
                    const value = gotComponents ? gotComponents.get(entity.id) : null;
                    valid = (value && valid);
                    if (!valid)
                        break;
                    result.push(value);
                }
                if (!valid)
                    continue;
            }
            if (optional) {
                for (let j = 0; j < optional.length; j++) {
                    const gotComponents = this.componentManager.components.get(optional[j].type);
                    const value = gotComponents ? gotComponents.get(entity.id) : null;
                    result.push(value);
                }
            }
            if (valid)
                yield [result, entity];
        }
        return;
    }
    /**
     *
     */
    *joinAll(needed, optional, unwanted) {
        for (let i = this.entityManager.entities.length; i--;) {
            const entity = this.entityManager.entities.get(i);
            if (!entity)
                continue;
            let valid = true;
            const result = [];
            if (unwanted) {
                for (let j = unwanted ? unwanted.length : 0; j--;) {
                    if (this.hasComponentById(i, unwanted[j].type)) {
                        valid = false;
                        break;
                    }
                }
                if (!valid)
                    continue;
            }
            if (needed) {
                for (let j = 0; j < needed.length; j++) {
                    const gotComponents = this.componentManager.components.get(needed[j].type);
                    if (gotComponents) {
                        const value = gotComponents.get(i);
                        if (value && valid) {
                            result.push(value);
                            continue;
                        }
                        else {
                            valid = false;
                            break;
                        }
                    }
                    else {
                        valid = false;
                        break;
                    }
                }
                if (!valid)
                    continue;
            }
            if (optional) {
                for (let j = 0; j < optional.length; j++) {
                    const compType = optional[j];
                    if (is_none(compType))
                        continue;
                    const gotComponents = this.componentManager.components.get(compType.type);
                    if (is_none(gotComponents))
                        continue;
                    const value = gotComponents.get(i);
                    result.push(value);
                }
            }
            if (valid)
                yield [result, entity];
        }
        return;
    }
    *joinBySet(set, needed, optional, unwanted) {
        for (const entity of set) {
            const value = this._joiner(entity, needed, optional, unwanted);
            if (value) {
                yield value;
            }
        }
    }
    *joinByComponentSet(set, needed, optional, unwanted) {
        for (const component of set) {
            const entity = this.getEntity(component.owner);
            if (!entity)
                continue;
            const value = this._joiner(entity, needed, optional, unwanted);
            if (!value)
                continue;
            yield value;
        }
    }
    retrieve(entity, components) {
        const results = [];
        for (let i = 0; i < components.length; i++) {
            const compType = components[i];
            if (is_none(compType))
                continue;
            const gotComponents = this.componentManager.components.get(compType.type);
            if (is_none(gotComponents))
                continue;
            const value = gotComponents.get(entity.id);
            results.push(value);
        }
        return results;
    }
    retrieveById(id, components) {
        const results = [];
        for (let i = 0; i < components.length; i++) {
            const compType = components[i];
            if (is_none(compType))
                continue;
            const gotComponents = this.componentManager.components.get(compType.type);
            if (is_none(gotComponents))
                continue;
            const value = gotComponents.get(id);
            results.push(value);
        }
        return results;
    }
    retrieveByTag(tag, components) {
        const results = [];
        const entity = this.getEntityByTag(tag);
        if (!entity)
            return results;
        for (let j = 0; j < components.length; j++) {
            const gotComponents = this.componentManager.components.get(components[j].type);
            const value = gotComponents ? gotComponents.get(entity.id) : undefined;
            results.push(value);
        }
        return results;
    }
    *query(needed) {
        for (let i = this.entityManager.entities.length; i--;) {
            const entity = this.entityManager.entities.get(i);
            if (!entity)
                continue;
            let valid = true;
            const result = [];
            for (let j = 0; j < needed.length; j++) {
                const components = this.componentManager.components.get(needed[j].type);
                if (components) {
                    const component = components.get(i);
                    if (is_none(component)) {
                        valid = false;
                        break;
                    }
                    valid = !!component && valid;
                    if (!valid)
                        break;
                    result.push(component);
                }
            }
            if (valid)
                yield result; // as OptionTuple<T>;
        }
        return;
    }
    withSystem(data, queryFunc) {
        this.qSysTuple.push([queryFunc, data]);
    }
    runQuerySystems() {
        for (let i = 0; i < this.qSysTuple.length; i++) {
            const [func, data] = this.qSysTuple[i];
            timer.begin();
            func({
                query: new FuncQuery(this, data),
                ecs: this,
                delta: this._delta,
            });
            timer.end('query system::', [...data]);
        }
    }
}
//# sourceMappingURL=EcsInstance.js.map