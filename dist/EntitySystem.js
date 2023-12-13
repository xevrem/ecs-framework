import { Bag } from './Bag';
import { Query } from './Query';
export class EntitySystem {
    constructor(props) {
        this._id = -1;
        this._entities = new Bag();
        this._active = true;
        this._dirty = false;
        this.reactive = false;
        this.props = props;
        this._id = props.id;
        this._ecsInstance = props.ecsInstance;
        this.reactive = props.reactive || false;
        this._priority = props.priority || 0;
        this.needed = props.needed;
        this.optional = props.optional || [];
        this.unwanted = props.unwanted || [];
    }
    get id() {
        return this._id;
    }
    get ecs() {
        return this._ecsInstance;
    }
    get ecsInstance() {
        return this._ecsInstance;
    }
    set ecsInstance(value) {
        this._ecsInstance = value;
    }
    get entities() {
        return this._entities;
    }
    get isReactive() {
        return this.reactive;
    }
    get priority() {
        return this._priority;
    }
    get query() {
        return this._query;
    }
    get active() {
        return this._active;
    }
    get dirty() {
        return this._dirty;
    }
    get componentTypes() {
        // let result: [...T,...V,...W] = this.needed;
        // if (this.optional) {
        //   let foo = result.concat(this.optional);
        //   result = foo;
        // }
        // if (this.unwanted) {
        //   result = result.concat(this.unwanted);
        // }
        return [...this.needed, ...this.optional, ...this.unwanted];
    }
    /**
     * enable this system
     */
    enable() {
        this._active = true;
    }
    /**
     * disable this system
     */
    disable() {
        this._active = false;
    }
    buildQuery() {
        this._query = new Query({
            ecsInstance: this._ecsInstance,
            needed: this.needed,
            unwanted: this.unwanted || [],
            optional: this.optional || [],
        });
    }
    /**
     * remove the given entity from this system, calling the system's removed function
     * if successful
     * @param entity the entity to remove
     */
    removeEntity(entity) {
        if (this._entities.has(entity.id)) {
            this._entities.set(entity.id, undefined);
            this.query.entity = entity;
            this.removed?.(entity);
            this._dirty = true;
        }
    }
    removeEntityById(id) {
        const entity = this._entities.get(id);
        if (entity) {
            this._entities.set(id, undefined);
            this.query.entity = entity;
            this.removed?.(entity);
            this._dirty = true;
        }
    }
    /**
     * creation/assignment of entities upon initial resolution
     */
    initialResolve(entity) {
        this._entities.set(entity.id, entity);
        this.query.entity = entity;
        this.created?.(entity);
        this._dirty = true;
    }
    /**
     * creation/assignment of enttiies after load
     */
    initialCreate(entity) {
        this.query.entity = entity;
        this.created?.(entity);
        this._dirty = true;
    }
    /**
     * add the entity with the given id to this system
     * @param id the id of the entity to add
     */
    addEntityById(id) {
        const entity = this._ecsInstance.getEntity(id);
        if (!entity)
            return;
        this.addEntity(entity);
    }
    /**
     * add the entity to this system
     * @param entity the entity to add
     */
    addEntity(entity) {
        if (!this._entities.has(entity.id)) {
            this._entities.set(entity.id, entity);
            this.query.entity = entity;
            this.added?.(entity);
            this._dirty = true;
        }
    }
    createEntity(entity) {
        this._entities.set(entity.id, entity);
        this.query.entity = entity;
        this.created?.(entity);
        this._dirty = true;
    }
    /**
     * adds an entity without calling `added`
     * @param id the id of the entity to add
     */
    addByUpdateById(id) {
        const entity = this._ecsInstance.getEntity(id);
        if (!entity)
            return;
        this.addByUpdate(entity);
    }
    /**
     * adds an entity without calling `added`
     * @param entity the entity to add
     */
    addByUpdate(entity) {
        this._entities.set(entity.id, entity);
        this._dirty = true;
    }
    deleteEntity(entity) {
        if (this.reactive) {
            this.query.entity = entity;
            this.deleted?.(entity);
            this._dirty = true;
        }
        else {
            if (this._entities.has(entity.id)) {
                this._entities.set(entity.id, undefined);
                this.query.entity = entity;
                this.deleted?.(entity);
                this._dirty = true;
            }
        }
    }
    /**
     * clean this system, calling its `cleanUp` function and clearing
     * all owned entities
     */
    cleanSystem() {
        this.cleanUp && this.cleanUp(this._entities);
        this._entities.clear();
    }
    /**
     * process all entities
     */
    processAll() {
        if (this.shouldProcess()) {
            this.begin && this.begin();
            this.processEntities();
            this.processJoin();
            this.end && this.end();
        }
    }
    processJoin() {
        if (!this.join)
            return;
        // if we have no entities, don't bother running
        if (!this._entities.count)
            return;
        if (this._dirty)
            this.resolveQuery();
        const data = this._query.data;
        for (let i = data.length; i--;) {
            this.join(data[i]);
        }
    }
    /**
     * processes entities one by one calling the system's `process` function
     * and passing the results of the systems `Query`
     */
    processEntities() {
        if (!this.process)
            return;
        // if we have no entiteis, don't bother
        if (!this._entities.count)
            return;
        // process up to the last inserted entity
        for (let i = this._entities.length; i--;) {
            const entity = this._entities.get(i);
            if (!entity)
                continue;
            this._query.entity = entity;
            this.process(entity, this._query, this._ecsInstance.delta);
        }
    }
    /**
     * determine whether or not this system should process
     */
    shouldProcess() {
        return true;
    }
    resolveQuery() {
        this.query.resolve(this._entities);
        this._dirty = false;
    }
    resetSystem() {
        this.reset && this.reset();
        this._entities.clear();
    }
    updateById(id, updates) {
        const entity = this.entities.get(id);
        if (entity)
            this.updated?.(entity, updates);
    }
    update(entity) {
        this.updated?.(entity);
    }
}
//# sourceMappingURL=EntitySystem.js.map