"use strict";
(() => {
  // src/Bag.ts
  var Bag = class {
    constructor(capacity = 16) {
      this._data = [];
      this._length = 0;
      this._count = 0;
      this._last = -1;
      this._invalidated = true;
      this._data = new Array(capacity);
      this._length = 0;
    }
    /**
     * iterator symbol for Bags
     */
    [Symbol.iterator]() {
      let i = 0;
      const next = () => {
        const value = this._data[i++];
        return value ? {
          value,
          done: i >= this._length
        } : next();
      };
      return {
        next
      };
    }
    iter() {
      return this[Symbol.iterator];
    }
    /**
     * total number indicies the bag contains
     */
    get capacity() {
      return this._data.length;
    }
    /**
     * are there any populated indexes in this bag
     */
    get isEmpty() {
      return this._length === 0;
    }
    /**
     * the furthest populated index in this bag
     */
    get length() {
      return this._length;
    }
    /**
     * the current count of non-undefined data elements
     */
    get count() {
      return this._count;
    }
    /**
     * the base data structure of the bag
     */
    get data() {
      return this._data;
    }
    lastIndex(start) {
      if (this._last !== -1 && !this._invalidated)
        return this._last;
      for (let i = start; i--; ) {
        if (this._data[i]) {
          this._last = i;
          this._invalidated = false;
          return i;
        }
      }
      return -1;
    }
    /**
     * return the last populated item
     */
    get last() {
      return this._data[this.lastIndex(this._data.length)];
    }
    /**
     * return the first item
     */
    get first() {
      const size = this._data.length;
      for (let i = 0; i < size; i++) {
        const item = this.get(i);
        if (item)
          return item;
      }
      return void 0;
    }
    /**
     * perform a functional `forEach` operation on this bag
     * @param args args the standard `forEach` arguments
     * @param [context] the optional context to use
     */
    forEach(args, context) {
      return this._data.forEach(args, context);
    }
    /**
     * perform a functional `map` operation on this bag
     * @param args args the standard `map` arguments
     * @param [context] the optional context to use
     * @returns the results of the `map` operation
     */
    map(args, context) {
      return this._data.map(args, context);
    }
    /**
     * perform a functional `filter` operation on this bag
     * @param args args the standard `filter` arguments
     * @param [context] the optional context to use
     * @returns the results of the `filter` operation
     */
    filter(args, context) {
      return this._data.filter(args, context);
    }
    /**
     * perform a functional `reduce` operation on this bag
     * @param args args the standard `reduce` arguments
     * @param init the optional context to use
     * @returns the results of the `reduce` operation
     */
    reduce(args, init) {
      return this._data.reduce(args, init);
    }
    /**
     * perform a functional `slice` operation on this bag
     * @param start the standard `slice` arguments
     * @param end the optional context to use
     * @returns the results of the `slice` operation
     */
    slice(start, end) {
      return this._data.slice(start, end);
    }
    some(predicate) {
      return this._data.some(predicate);
    }
    /**
     * gets the item at the specified index
     * @param index the index of the item to retrieve
     * @returns the item if found otherwise `undefined`
     */
    get(index) {
      return this._data[index];
    }
    /**
     * sets the index to the given value. grows the bag if index exceeds capacity.
     * @param index the index to set
     * @param value the value to set
     * @returns a copy of the value if successfully inserted, otherwise `undefined`
     */
    set(index, value) {
      if (index < 0) {
        return void 0;
      }
      if (index >= this._data.length) {
        this.grow(index * 2);
      }
      if (index >= this._length && value) {
        this._length = index + 1;
      } else if (
        // IF we already are the furthest item
        index === this._length - 1 && // AND we're unassignining it
        !value
      ) {
        const last = this.lastIndex(index);
        if (last === index) {
          throw new Error("Last Index Invalid");
        } else {
          this._length = last + 1;
        }
      }
      if (!this._data[index] && value)
        this._count += 1;
      if (this._data[index] && !value)
        this._count -= 1;
      if (index > this._last)
        this._last = index;
      this._data[index] = value;
      return value;
    }
    /**
     * adds the given element to the end of the bags contents
     * @param element the element to add
     */
    add(element) {
      if (this._length >= this._data.length) {
        this.grow();
      }
      const index = this._length;
      this._data[this._length] = element;
      this._length++;
      this._count += 1;
      if (index > this._last)
        this._last = index;
      return index;
    }
    /**
     * adds the given bag to this one
     * @param bag the bad to add
     */
    addBag(bag) {
      for (let i = 0; bag.length > i; i++) {
        this.add(bag.get(i));
      }
    }
    /**
     * sets each defined item of the bag into this one
     * @param bag - the bag to set with
     */
    setBag(bag) {
      for (let i = bag.length; i--; ) {
        const item = bag.get(i);
        item && this.set(i, item);
      }
      this._invalidated = true;
    }
    /**
     * clears the contents of the bag
     */
    clear() {
      this._data = new Array(this._data.length);
      this._length = 0;
      this._count = 0;
    }
    /**
     * checks if an element with the given id is populated
     */
    has(id) {
      if (id < 0 || id > this._length)
        return false;
      return !!this._data[id];
    }
    /**
     * checks if the bag contains the given element
     * @param element the element to check
     * @param [compare] the optional comparator function to use
     * @returns `true` if found, `false` if not
     */
    contains(element, compare = (a, b) => a === b) {
      for (let i = this._length; i--; ) {
        if (compare(element, this._data[i]))
          return true;
      }
      return false;
    }
    /**
     * check if an element exists within the bag via strict equals
     * @param element the element to check
     * @param fromIndex the optional starting index
     * @returns `true` if found, `false` if not
     */
    includes(element, fromIndex = 0) {
      return this._data.includes(element, fromIndex);
    }
    /**
     * removes the specified element from the bag
     * @param element the element to remove
     * @returns the element removed or `undefined` if no element was found
     */
    remove(element) {
      const index = this._data.indexOf(element);
      if (index === this._last)
        this._invalidated = true;
      return this.removeAt(index);
    }
    /**
     * removes the element at the specified index
     * @param index the index for the element to remove
     * @returns the removed element or `undefined` if it was empty or out of bounds
     */
    removeAt(index) {
      if (index < this._data.length && index >= 0) {
        const item = this._data[index];
        this.set(index, void 0);
        if (this._length < 0)
          this._length = 0;
        return item;
      } else {
        return void 0;
      }
    }
    /**
     * remove the element in the last filled position
     * @returns the element if found or `undefined` if not
     */
    removeLast() {
      const index = this._length - 1;
      const item = this._data[index];
      this.set(index, void 0);
      if (this._length < 0)
        this._length = 0;
      this._invalidated = true;
      return item;
    }
    /**
     * grow the bag to the specified size, so long as it is larger.
     * @param size the size to grow the bag
     */
    grow(size = 2 * this._data.length + 1) {
      if (size <= this._data.length)
        return;
      this._data = this._data.concat(
        new Array(size - this._data.length)
      );
    }
  };

  // src/Component.ts
  var ComponentSymbol = Symbol("Component");
  var Component = class {
    constructor() {
      this.owner = -1;
    }
    /**
     * this allows us to interogate a type to see if it is a component type
     * @returns whether type is a type of Component
     */
    static get [ComponentSymbol]() {
      return true;
    }
    /**
     * this allows us to interogate an object to see if it is a component
     * @returns whether an object is a Component
     */
    get [ComponentSymbol]() {
      return true;
    }
    /**
     * get the registerd type of this component
     */
    get type() {
      const inst = this.constructor;
      return inst.type;
    }
    /**
     * set the type number for all components of this type
     */
    set type(value) {
      const inst = this.constructor;
      inst.type = value;
    }
  };
  Component.type = -1;
  function isComponent(object) {
    if (object[ComponentSymbol]) {
      return true;
    } else {
      return false;
    }
  }
  function isComponentOfType(object, type) {
    if (object.type === type.type) {
      return true;
    } else {
      return false;
    }
  }

  // src/ComponentManager.ts
  var ComponentManager = class {
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
      } else if (!this._componentTypes[component.name]) {
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
      this._components.forEach((components) => {
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
        return void 0;
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
      return components ? components.get(entity.id) : void 0;
    }
    getComponentByTypeAndId(id, type) {
      const components = this._components.get(type);
      return components ? components.get(id) : void 0;
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
      for (let i = components.length; i--; ) {
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
          components.set(entity.id, void 0);
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
        components.set(component.owner, void 0);
      }
    }
    removeComponents(components) {
      for (const component of components) {
        this._components.get(component.type)?.set(component.owner, void 0);
      }
    }
    /**
     * remove the specific component instance from its owner
     * @param component the component instance to remove
     */
    removeComponentType(entity, component) {
      const components = this._components.get(component.type);
      if (components) {
        components.set(entity.id, void 0);
      }
    }
    removeComponentTypeById(id, component) {
      const components = this._components.get(component.type);
      if (components) {
        components.set(id, void 0);
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
      return !!this._components.get(type)?.get(entity.id);
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
      return !!this._components.get(component.type)?.get(entity.id);
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
      this._componentTypes = {};
      this._nextTypeId = 0;
    }
  };

  // src/ComponentMapper.ts
  var ComponentMapper = class {
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
      return this._ecsInstance.componentManager.getComponentByType(
        entity,
        this._type
      );
    }
    getById(id) {
      return this._ecsInstance.componentManager.getComponentByTypeAndId(
        id,
        this._type
      );
    }
    /**
     * get the component from the specified entity
     * @param component class of component to retrieve
     * @param entity the entity to get the component for
     * @param ecsInstance the instance from which to retrieve the component
     * @returns the component if found, otherwise `undefined`
     */
    static get(component, entity, ecsInstance) {
      const components = ecsInstance.componentManager.components.get(
        component.type
      );
      if (components) {
        return components.get(entity.id);
      } else {
        return void 0;
      }
    }
  };

  // src/Entity.ts
  var Entity = class {
    constructor() {
      this.id = -1;
    }
  };

  // src/EntityManager.ts
  var EntityManager = class {
    constructor() {
      this._entities = new Bag();
      this._oldIds = [];
      this._nextId = 0;
    }
    get entities() {
      return this._entities;
    }
    get oldIds() {
      return this._oldIds;
    }
    /**
     * create a new unique entity
     * @returns the new entity
     */
    create() {
      const entity = new Entity();
      if (this._oldIds.length > 0) {
        entity.id = this._oldIds.shift();
      } else {
        entity.id = this._nextId++;
      }
      this._entities.set(entity.id, entity);
      return entity;
    }
    /**
     * returns the entity with the spcified `id` if it exists
     * @param id the id of the entity requested
     * @returns the requried entity if found or `undefined`
     */
    getEntity(id) {
      return this._entities.get(id);
    }
    /**
     * delete an entity
     * @param entity the entity to delete
     */
    deleteEntity(entity) {
      if (!this._entities.get(entity.id))
        return;
      this._oldIds.push(entity.id);
      this._entities.set(entity.id, void 0);
    }
    reset() {
      this._oldIds = [];
      this._entities.clear();
      this._nextId = 0;
    }
    /**
     * clean up the manager, clearing old ids and entities
     */
    cleanUp() {
      this._oldIds = [];
      this._entities.clear();
      this._nextId = 0;
    }
  };

  // src/SystemManager.ts
  var SystemManager = class {
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
        ...args
      };
      const system = new System(props);
      system.buildQuery();
      system.componentTypes.forEach((component) => {
        this._ecsInstance.componentManager.registerComponent(component);
      });
      if (system.isReactive) {
        this._reactiveSystems.push(system);
      } else {
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
      for (let i = systems.length; i--; ) {
        this.systems[i].initialize?.();
      }
    }
    /**
     * load all registered systems
     */
    loadSystems() {
      const systems = this.systems;
      for (let i = systems.length; i--; ) {
        const system = this.systems[i];
        system.load?.(system.entities);
      }
    }
    initialResolve(entity) {
      const systems = this.systems;
      for (let i = systems.length; i--; ) {
        const system = this.systems[i];
        if (system.query.validate(entity)) {
          system.initialResolve(entity);
        }
      }
    }
    initialCreate(entity) {
      const systems = this.systems;
      for (let i = systems.length; i--; ) {
        const system = this.systems[i];
        system.query.validate(entity) && system.initialCreate(entity);
      }
    }
    /**
     * attempt to add the created entity to all registered systems
     * @param entity the entity to add
     */
    createEntity(entity) {
      for (let i = this._staticSystems.length; i--; ) {
        const system = this._staticSystems[i];
        system.query.validate(entity) && system.createEntity(entity);
      }
      for (let i = this._reactiveSystems.length; i--; ) {
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
      for (let i = resolving.length; i--; ) {
        const data = resolving.get(i);
        if (!data)
          continue;
        const [entity, ignored] = data;
        for (let i2 = this._staticSystems.length; i2--; ) {
          const system = this._staticSystems[i2];
          if (ignored[system.id])
            continue;
          if (system.query.validate(entity)) {
            system.addEntity(entity);
          } else {
            system.removeEntity(entity);
          }
        }
        for (let i2 = this._reactiveSystems.length; i2--; ) {
          const system = this._reactiveSystems[i2];
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
      for (let i = this._staticSystems.length; i--; ) {
        this._staticSystems[i].deleteEntity(entity);
      }
      for (let i = this._reactiveSystems.length; i--; ) {
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
      for (let i = this._systems.length; i--; ) {
        const system = this._systems[i];
        for (let owner = updated.length; owner--; ) {
          const data = updated.get(owner);
          if (!data)
            continue;
          const maybeValid = data.some((item) => {
            if (item) {
              const [component, ignored] = item;
              return !ignored[system.id] && system.query.isValidComponent(component);
            }
            return false;
          });
          if (maybeValid && system.query.isValidById(owner)) {
            if (system.isReactive)
              system.addByUpdateById(owner);
            else {
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
      for (let i = this._systems.length; i--; ) {
        const system = this._systems[i];
        if (system.query.validate(entity)) {
          system.isReactive && system.addByUpdate(entity);
          !system.isReactive && system.update(entity);
        }
      }
    }
    reset() {
      const systems = this.systems;
      for (let i = systems.length; i--; ) {
        this.systems[i].resetSystem();
      }
    }
    /**
     * clean up all registred systems
     */
    cleanUp() {
      this.systems.forEach((system) => system.cleanSystem());
      this._staticSystems = [];
      this._reactiveSystems = [];
      this._systemTypes = {};
      this._systems = [];
    }
  };

  // src/TagManager.ts
  var TagManager = class {
    constructor() {
      this._tags = {};
    }
    /**
     * gets the entity assigned to the given tag
     * @param tag the tag to retrieve
     * @returns the entity if tagged, otherwise `undefined`
     */
    getEntityByTag(tag) {
      return this._tags[tag];
    }
    /**
     * tags an entity
     * @param tag the tag to use
     * @param entity the entity to tag
     */
    tagEntity(tag, entity) {
      this._tags[tag] = entity;
    }
    tagExists(tag) {
      return Object.hasOwn(this._tags, tag);
    }
    /**
     * delete the given entity from all tags
     * @param entity the entity to delete
     */
    deleteEntity(entity) {
      Object.keys(this._tags).forEach((key) => {
        if (this._tags[key].id === entity.id)
          delete this._tags[key];
      });
    }
    /**
     * remove the given tag
     * @param tag the tag to remove
     */
    removeTag(tag) {
      delete this._tags[tag];
    }
    /**
     * clean up all tags
     */
    cleanUp() {
      this._tags = {};
    }
  };

  // src/GroupManager.ts
  var GroupManager = class {
    constructor() {
      this._groups = {};
    }
    get groups() {
      return this._groups;
    }
    /**
     * adds a given entity to the specified group
     * @param group the group to which to add the entity
     * @param entity the entity to add
     */
    addEntityToGroup(group, entity) {
      if (!this._groups[group]) {
        this._groups[group] = new Bag();
      }
      if (!this._groups[group].includes(entity)) {
        this._groups[group].add(entity);
      }
    }
    /**
     * returns the `Bag` of entities for the specified group
     * @param group the group to retrieve
     * @returns the bag for the specified group
     */
    getGroup(group) {
      return this._groups[group];
    }
    /**
     * delete the specified entity from all groups
     * @param entity the entity to delete
     */
    deleteEntity(entity) {
      Object.values(this._groups).forEach((group) => {
        group.remove(entity);
      });
    }
    removeEntityFromGroup(entity, group) {
      const targetGroup = this._groups[group];
      if (!targetGroup)
        return;
      targetGroup.remove(entity);
    }
    /**
     * remove a specified group
     * @param group the group to remove
     */
    removeGroup(group) {
      delete this._groups[group];
    }
    /**
     * clean up all the groups
     */
    cleanUp() {
      Object.keys(this._groups).forEach((key) => {
        this._groups[key].clear();
        delete this._groups[key];
      });
    }
  };

  // src/Scheduler.ts
  var Scheduler = class {
    constructor() {
      this._systems = [];
    }
    /**
     * currently scheduled systems
     */
    get systems() {
      return this._systems;
    }
    /**
     * set the scheduled systems
     */
    set systems(value) {
      this._systems = value;
    }
    /**
     * clean up systems
     */
    cleanUp() {
      this._systems = [];
    }
    /**
     * sort the systems by priority
     */
    sortSystems() {
      this._systems.sort(
        (a, b) => b.priority - a.priority
      );
    }
    /**
     * run the systems in order of priority
     */
    runSystems() {
      const systems = this._systems;
      for (let i = systems.length; i--; ) {
        const system = systems[i];
        if (system.active) {
          system.processAll();
          if (system.isReactive)
            system.entities.clear();
        }
      }
    }
  };

  // src/utils.ts
  function is_some(val) {
    if (!!val || typeof val === "number" || typeof val === "boolean")
      return true;
    return false;
  }
  function is_none(val) {
    if (is_some(val))
      return false;
    return true;
  }
  function is_ok(val) {
    if (val instanceof Error)
      return false;
    return true;
  }
  function is_err(val) {
    if (val instanceof Error)
      return true;
    return false;
  }
  function all_some(val) {
    if (val.some((v) => is_none(v)))
      return false;
    return true;
  }
  function all_none(val) {
    if (val.some((v) => is_some(v)))
      return false;
    return true;
  }
  function lerp(a, b, percent) {
    return (b - a) * percent + a;
  }
  function makeTimer(deltaMax) {
    let start = performance.now();
    let stop = Number.MAX_SAFE_INTEGER;
    let delta = 0;
    function begin() {
      start = performance.now();
    }
    function end(text, ...args) {
      stop = performance.now();
      delta = stop - start;
      if (delta > deltaMax) {
        console.info(`ms: ${delta} -`, text, ...args);
      }
    }
    return {
      begin,
      end,
      get delta() {
        return delta;
      }
    };
  }

  // src/EntityBuilder.ts
  function makeEntityBuilder(ecs) {
    let entity;
    const alsoCallbacks = [];
    const components = new Bag();
    const componentCallbacks = [];
    const groupCallbacks = [];
    const groups = [];
    let initCallback = null;
    const tags = [];
    const tagCallbacks = [];
    const workingData = {};
    const builder = {
      build() {
        entity = ecs.createEntity();
        let currentBuilder = this;
        try {
          currentBuilder = is_some(initCallback) ? initCallback(currentBuilder) : this;
          for (let i = 0; i < componentCallbacks.length; i++) {
            const component = componentCallbacks[i](currentBuilder);
            if (is_some(component)) {
              components.set(component.type, component);
              ecs.addComponent(entity, component);
            }
          }
          for (let i = 0; i < components.length; i++) {
            const component = components.get(i);
            component && ecs.addComponent(entity, component);
          }
          for (let i = 0; i < alsoCallbacks.length; i++) {
            currentBuilder = alsoCallbacks[i](currentBuilder);
          }
          for (let i = 0; i < tags.length; i++) {
            ecs.tagManager.tagEntity(tags[i], entity);
          }
          for (let i = 0; i < tagCallbacks.length; i++) {
            ecs.tagManager.tagEntity(tagCallbacks[i](currentBuilder), entity);
          }
          for (let i = 0; i < groups.length; i++) {
            ecs.groupManager.addEntityToGroup(groups[i], entity);
          }
          for (let i = 0; i < groupCallbacks.length; i++) {
            ecs.groupManager.addEntityToGroup(
              groupCallbacks[i](currentBuilder),
              entity
            );
          }
          return entity;
        } catch (e) {
          console.error("ENTITY BUILDER ERROR:", e);
          ecs.abort(entity);
          return e;
        }
      },
      add(component) {
        components.set(component.type, component);
        return this;
      },
      addMaybe(maybe) {
        if (is_some(maybe)) {
          components.set(maybe.type, maybe);
        }
        return this;
      },
      addMaybeWith(callback) {
        componentCallbacks.push(callback);
        return this;
      },
      addWith(callback) {
        componentCallbacks.push(callback);
        return this;
      },
      also(callback) {
        alsoCallbacks.push(callback);
        return this;
      },
      get(component) {
        const comp = components.get(component.type);
        if (is_none(comp))
          throw new Error(`builder component ${component.name} is undefined`);
        return comp;
      },
      getData(key) {
        const data = workingData[key];
        if (is_none(data))
          throw new Error(`builder data ${key} is undefined`);
        return data;
      },
      getEntity() {
        return entity;
      },
      group(group) {
        groups.push(group);
        return this;
      },
      groupWith(callback) {
        groupCallbacks.push(callback);
        return this;
      },
      init(callback) {
        initCallback = callback;
        return this;
      },
      insertData(key, value) {
        workingData[key] = value;
        return this;
      },
      setData(key, value) {
        workingData[key] = value;
      },
      tag(tag) {
        tags.push(tag);
        return this;
      },
      tagWith(callback) {
        tagCallbacks.push(callback);
        return this;
      }
    };
    return builder;
  }

  // src/FuncQuery.ts
  var FuncQuery = class {
    constructor(ecs, data) {
      this.ecs = ecs;
      this.data = data;
    }
    join() {
      return this.ecs.query(this.data);
    }
  };

  // src/EcsInstance.ts
  var timer = makeTimer(1);
  var EcsInstance = class {
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
      this._creating.set(entity.id, void 0);
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
      for (let i = entities.length; i--; ) {
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
        return void 0;
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
      return this.componentManager.getComponentByType(
        entity,
        typeId
      );
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
      for (let i = ignoredSystems.length; i--; ) {
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
      for (let i = ignoredSystems.length; i--; ) {
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
      if (creating.count > 0) {
        for (let i = creating.length; i--; ) {
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
      if (creating.count > 0) {
        for (let i = creating.length; i--; ) {
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
      const deleting = this._deleting, resolving = this._resolving, updating = this._updating, updatingEntities = this._updatingEntities, creating = this._creating;
      this._deleting = new Bag(deleting.capacity);
      this._resolving = new Bag(resolving.capacity);
      this._updating = new Bag(updating.capacity);
      this._updatingEntities = [];
      if (deleting.count > 0) {
        for (let i = deleting.length; i--; ) {
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
      for (let i = updatingEntities.length; i--; ) {
        this.systemManager.updateEntity(updatingEntities[i]);
      }
      if (creating.count > 0) {
        for (let i = creating.length; i--; ) {
          const entity = creating.get(i);
          entity && this.systemManager.createEntity(entity);
          this._creating.set(i, void 0);
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
        for (let i = ignoredSystems.length; i--; ) {
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
      for (let i = components.length; i--; ) {
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
      this._delta = (time - this._lastTime) / 1e3;
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
        for (let j = unwanted ? unwanted.length : 0; j--; ) {
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
          const gotComponents = this.componentManager.components.get(
            needed[j].type
          );
          const value = gotComponents ? gotComponents.get(id) : void 0;
          valid = value && valid;
          if (!valid)
            break;
          result.push(value);
        }
        if (!valid)
          return null;
      }
      if (optional) {
        for (let j = 0; j < optional.length; j++) {
          const gotComponents = this.componentManager.components.get(
            optional[j].type
          );
          const value = gotComponents ? gotComponents.get(id) : void 0;
          result.push(value);
        }
      }
      if (valid)
        return [result, entity];
      return null;
    }
    *join(entities, needed, optional, unwanted) {
      for (let i = entities.length; i--; ) {
        const entity = entities[i];
        const id = entity.id;
        let valid = true;
        const result = [];
        if (unwanted) {
          for (let j = unwanted ? unwanted.length : 0; j--; ) {
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
            const gotComponents = this.componentManager.components.get(
              needed[j].type
            );
            const value = gotComponents ? gotComponents.get(id) : void 0;
            valid = value && valid;
            if (!valid)
              break;
            result.push(value);
          }
          if (!valid)
            continue;
        }
        if (optional) {
          for (let j = 0; j < optional.length; j++) {
            const gotComponents = this.componentManager.components.get(
              optional[j].type
            );
            const value = gotComponents ? gotComponents.get(id) : void 0;
            result.push(value);
          }
        }
        if (valid)
          yield [result, entity];
      }
      return;
    }
    *joinByBag(bag, needed, optional, unwanted) {
      for (let i = bag.length; i--; ) {
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
      for (let i = bag.length; i--; ) {
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
      for (let i = ids.length; i--; ) {
        const id = ids[i];
        const entity = this.getEntity(id);
        if (!entity)
          continue;
        let valid = true;
        const result = [];
        if (unwanted) {
          for (let j = unwanted ? unwanted.length : 0; j--; ) {
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
            const gotComponents = this.componentManager.components.get(
              needed[j].type
            );
            const value = gotComponents ? gotComponents.get(id) : null;
            valid = value && valid;
            if (!valid || is_none(value))
              break;
            result.push(value);
          }
          if (!valid)
            continue;
        }
        if (optional) {
          for (let j = 0; j < optional.length; j++) {
            const gotComponents = this.componentManager.components.get(
              optional[j].type
            );
            const value = gotComponents ? gotComponents.get(id) : null;
            result.push(value);
          }
        }
        if (valid)
          yield [result, entity];
      }
      return;
    }
    *joinByTag(tags, needed, optional, unwanted) {
      for (let i = tags.length; i--; ) {
        const tag = tags[i];
        const entity = this.tagManager.getEntityByTag(tag);
        if (!entity)
          continue;
        let valid = true;
        const result = [];
        if (unwanted) {
          for (let j = unwanted ? unwanted.length : 0; j--; ) {
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
            const gotComponents = this.componentManager.components.get(
              needed[j].type
            );
            const value = gotComponents ? gotComponents.get(entity.id) : null;
            valid = value && valid;
            if (!valid)
              break;
            result.push(value);
          }
          if (!valid)
            continue;
        }
        if (optional) {
          for (let j = 0; j < optional.length; j++) {
            const gotComponents = this.componentManager.components.get(
              optional[j].type
            );
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
      for (let i = this.entityManager.entities.length; i--; ) {
        const entity = this.entityManager.entities.get(i);
        if (!entity)
          continue;
        let valid = true;
        const result = [];
        if (unwanted) {
          for (let j = unwanted ? unwanted.length : 0; j--; ) {
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
            const gotComponents = this.componentManager.components.get(
              needed[j].type
            );
            if (gotComponents) {
              const value = gotComponents.get(i);
              if (value && valid) {
                result.push(value);
                continue;
              } else {
                valid = false;
                break;
              }
            } else {
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
            const gotComponents = this.componentManager.components.get(
              compType.type
            );
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
        const gotComponents = this.componentManager.components.get(
          components[j].type
        );
        const value = gotComponents ? gotComponents.get(entity.id) : void 0;
        results.push(value);
      }
      return results;
    }
    *query(needed) {
      for (let i = this.entityManager.entities.length; i--; ) {
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
          yield result;
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
          delta: this._delta
        });
        timer.end("query system::", [...data]);
      }
    }
  };

  // src/Query.ts
  var Query = class {
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
      return this._ecsInstance.getComponent(
        this._entity,
        component
      );
    }
    resolve(entities) {
      this._data = [];
      entityLoop:
        for (let e = entities.length; e--; ) {
          const entity = entities.get(e);
          if (!entity)
            continue;
          for (let i = this._unwanted.length; i--; ) {
            if (this._ecsInstance.hasComponentOfType(entity, this._unwanted[i]))
              continue entityLoop;
          }
          const components = [];
          for (let i = 0; i < this._needed.length; i++) {
            const component = this._ecsInstance.getComponent(
              entity,
              this._needed[i]
            );
            if (!component)
              continue entityLoop;
            components.push(component);
          }
          for (let i = 0; i < this._optional.length; i++) {
            const component = this._ecsInstance.getComponent(
              entity,
              this._optional[i]
            );
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
      for (let i = this._unwanted.length; i--; ) {
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
      for (let i = this._unwanted.length; i--; ) {
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
      for (let i = this._needed.length; i--; ) {
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
      for (let i = this._needed.length; i--; ) {
        if (!this._ecsInstance.hasComponentById(id, this._needed[i].type))
          return false;
      }
      return true;
    }
    isOptional(entity) {
      for (let i = this._optional.length; i--; ) {
        if (this._optional[i] && this._ecsInstance.hasComponent(entity, this._optional[i].type))
          return true;
      }
      return false;
    }
    isOptionalById(id) {
      for (let i = this._optional.length; i--; ) {
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
      return this._needed.includes(component.constructor) || this._optional.includes(component.constructor);
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
        ...this._optional
      ]);
    }
    retrieveById(id) {
      return this._ecsInstance.retrieveById(id, [
        ...this._needed,
        ...this._optional
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
  };

  // src/EntitySystem.ts
  var EntitySystem = class {
    //[...W];
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
        optional: this.optional || []
      });
    }
    /**
     * remove the given entity from this system, calling the system's removed function
     * if successful
     * @param entity the entity to remove
     */
    removeEntity(entity) {
      if (this._entities.has(entity.id)) {
        this._entities.set(entity.id, void 0);
        this.query.entity = entity;
        this.removed?.(entity);
        this._dirty = true;
      }
    }
    removeEntityById(id) {
      const entity = this._entities.get(id);
      if (entity) {
        this._entities.set(id, void 0);
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
      } else {
        if (this._entities.has(entity.id)) {
          this._entities.set(entity.id, void 0);
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
      if (!this._entities.count)
        return;
      if (this._dirty)
        this.resolveQuery();
      const data = this._query.data;
      for (let i = data.length; i--; ) {
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
      if (!this._entities.count)
        return;
      for (let i = this._entities.length; i--; ) {
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
  };
})();
//# sourceMappingURL=index.js.map
