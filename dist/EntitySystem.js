import { Bag } from './Bag';
export class EntitySystem {
    constructor() {
        this._componentTypes = [];
        this._entities = new Bag();
        this._ecsInstance = null;
    }
    get ecsInstance() {
        return this._ecsInstance;
    }
    set ecsInstance(value) {
        this._ecsInstance = value;
    }
    get componentTypes() {
        return this._componentTypes;
    }
    set componentTypes(value) {
        this._componentTypes = value;
    }
    get entities() {
        return this._entities;
    }
    loadContent() {
        this.preLoadContent(this._entities);
    }
    removeEntity(entity) {
        if (this._entities.remove(entity))
            this.removed(entity);
    }
    addEntity(entity) {
        if (!this._entities.contains(entity, (a, b) => b && a.id === b.id)) {
            this._entities.add(entity);
            this.added(entity);
        }
    }
    cleanSystem() {
        this.cleanUp(this._entities);
        this._entities.clear();
    }
    processAll() {
        if (this.shouldProcess()) {
            this.begin();
            this.processEntities();
            this.end();
        }
    }
    processEntities() {
        this._entities.forEach((entity) => {
            entity && this.process(entity, this._ecsInstance.delta);
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