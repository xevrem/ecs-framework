export class Query {
    constructor(props) {
        this._ecsInstance = props.ecsInstance;
        this._needed = props.needed;
        this._optional = props.optional || [];
        this._unwanted = props.unwanted || [];
        this._data = [];
    }
    /**
     * current needed components
     */
    get needed() {
        return this._needed;
    }
    get data() {
        return this._data;
    }
    set entity(value) {
        this._entity = value;
    }
    /**
     * a very useful component retrieval function
     * @param component - the component type to retrieve
     * @returns the instance of that component, if any
     */
    get(component) {
        return this._ecsInstance.getComponent(this._entity, component);
    }
    resolve(entities) {
        this._data = [];
        entityLoop: for (let e = entities.length; e--;) {
            const entity = entities.get(e);
            if (!entity)
                continue;
            for (let i = this._unwanted.length; i--;) {
                if (this._ecsInstance.hasComponentOfType(entity, this._unwanted[i]))
                    continue entityLoop;
            }
            const components = [];
            // for the following for-loops, order maters
            for (let i = 0; i < this._needed.length; i++) {
                const component = this._ecsInstance.getComponent(entity, this._needed[i]);
                if (!component)
                    continue entityLoop;
                components.push(component);
            }
            for (let i = 0; i < this._optional.length; i++) {
                const component = this._ecsInstance.getComponent(entity, this._optional[i]);
                components.push(component);
            }
            this._data.push([components, entity]);
        }
    }
    /**
     * does the given entity have an unwanted component
     * @param entity the entity to check
     * @returns 'true' if an unwanted component was found
     */
    isInvalid(entity) {
        for (let i = this._unwanted.length; i--;) {
            if (this._ecsInstance.hasComponent(entity, this._unwanted[i].type))
                return true;
        }
        return false;
    }
    /**
     * does the given entity, found by its id, have an unwanted component
     * @param id the id of the entity to check
     * @returns 'true' if an unwanted component was found
     */
    isInvalidById(id) {
        for (let i = this._unwanted.length; i--;) {
            if (this._ecsInstance.hasComponentById(id, this._unwanted[i].type))
                return true;
        }
        return false;
    }
    isNeededComponent(component) {
        return this._needed.includes(component.constructor);
    }
    /**
     * does the entity contain every component required by the query
     * @param entity the entity to check
     * @returns 'true' if all required components were found
     */
    isValid(entity) {
        for (let i = this._needed.length; i--;) {
            if (!this._ecsInstance.hasComponent(entity, this._needed[i].type))
                return false;
        }
        return true;
    }
    /**
     * does the entity, found by its id, contain every component required by the query
     * @param id the id of the entity to check
     * @returns 'true' if all required components were found
     */
    isValidById(id) {
        for (let i = this._needed.length; i--;) {
            if (!this._ecsInstance.hasComponentById(id, this._needed[i].type))
                return false;
        }
        return true;
    }
    isOptional(entity) {
        for (let i = this._optional.length; i--;) {
            if (this._optional[i] &&
                this._ecsInstance.hasComponent(entity, this._optional[i].type))
                return true;
        }
        return false;
    }
    isOptionalById(id) {
        for (let i = this._optional.length; i--;) {
            if (this._ecsInstance.hasComponentById(id, this._optional[i].type))
                return true;
        }
        return false;
    }
    /**
     * checks if the given component is valid for this query
     * @param component the component to check
     * @returns `true` if valid, `false` if not
     */
    isValidComponent(component) {
        // IDEA: use bags instead of Arrays or maybe both depending on context
        //       this will give us O(1) validity checks
        return (this._needed.includes(component.constructor) ||
            this._optional.includes(component.constructor));
    }
    join(entities, needed, optional, unwanted) {
        return this._ecsInstance.join(entities, needed, optional, unwanted);
    }
    joinById(ids, needed, optional, unwanted) {
        return this._ecsInstance.joinById(ids, needed, optional, unwanted);
    }
    joinAll(needed, optional, unwanted) {
        return this._ecsInstance.joinAll(needed, optional, unwanted);
    }
    retrieve() {
        return this._ecsInstance.retrieve(this._entity, [
            ...this._needed,
            ...this._optional,
        ]);
    }
    retrieveById(id) {
        return this._ecsInstance.retrieveById(id, [
            ...this._needed,
            ...this._optional,
        ]);
    }
    /**
     * validates the given entity for this query
     * @param entity the entity to validate
     * @returns `true` if valid, `false` if not
     */
    validate(entity) {
        const valid = this.isValid(entity);
        const invalid = this.isInvalid(entity);
        return valid && !invalid;
    }
    /**
     * validates the given entity id for this query
     * @param id the id of the entity to validate
     * @returns `true` if valid, `false` if not
     */
    validateById(id) {
        const valid = this.isValidById(id);
        const invalid = this.isInvalidById(id);
        return valid && !invalid;
    }
}
//# sourceMappingURL=Query.js.map