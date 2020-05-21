import { Bag } from './Bag';
export class EntitySystem {
    constructor() {
        this.__componentTypes = [];
        this.__entities = new Bag();
        this.__ecsInstance = null;
    }
    get ecsInstance() {
        return this.__ecsInstance;
    }
    set ecsInstance(value) {
        this.__ecsInstance = value;
    }
    get componentTypes() {
        return this.__componentTypes;
    }
    set componentTypes(value) {
        this.__componentTypes = value;
    }
    get entities() {
        return this.__entities;
    }
    loadContent() {
        this.preLoadContent(this.__entities);
    }
    removeEntity(entity) {
        if (this.__entities.remove(entity))
            this.removed(entity);
    }
    addEntity(entity) {
        if (!this.__entities.contains(entity, (a, b) => b && a.id === b.id)) {
            this.__entities.add(entity);
            this.added(entity);
        }
    }
    cleanSystem() {
        this.cleanUp(this.__entities);
        this.__entities.clear();
    }
    processAll() {
        if (this.shouldProcess()) {
            this.begin();
            this.processEntities();
            this.end();
        }
    }
    processEntities() {
        this.__entities.forEach((entity) => {
            entity && this.process(entity, this.__ecsInstance.delta);
        });
    }
    shouldProcess() {
        return true;
    }
    //overloadable functions
    initialize() { }
    ;
    preLoadContent(_entities) { }
    ;
    removed(_entity) { }
    ;
    added(_entity) { }
    ;
    updated(_entity) { }
    ;
    cleanUp(_entities) { }
    ;
    begin() { }
    ;
    end() { }
    ;
    process(_entity, _delta) { }
    ;
}
//# sourceMappingURL=EntitySystem.js.map