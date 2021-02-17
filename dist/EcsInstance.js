import { EntityManager } from './EntityManager';
import { ComponentManager } from './ComponentManager';
import { SystemManager } from './SystemManager';
import { TagManager } from './TagManager';
import { GroupManager } from './GroupManager';
export class EcsInstance {
    constructor() {
        this.entityManager = new EntityManager();
        this.componentManager = new ComponentManager(this);
        this.systemManager = new SystemManager(this);
        this.tagManager = new TagManager();
        this.groupManager = new GroupManager();
        this.__updating = [];
        this.__deleting = [];
        this.__delta = 0;
        this.__lastTime = 0;
        this.__elapsed = 0;
    }
    get delta() {
        return this.__delta;
    }
    get elapsed() {
        return this.__elapsed;
    }
    create() {
        return this.entityManager.create();
    }
    addComponent(entity, component) {
        this.componentManager.addComponent(entity, component);
    }
    removeComponent(component) {
        this.componentManager.removeComponent(component);
    }
    hasComponent(entity, type) {
        return this.componentManager.hasComponent(entity, type);
    }
    resolve(entity) {
        if (entity)
            this.__updating.push(entity);
    }
    deleteEntity(entity) {
        if (entity)
            this.__deleting.push(entity);
    }
    resolveEntities() {
        if (this.__updating.length > 0) {
            this.__updating.forEach(entity => this.systemManager.resolve(entity));
            this.__updating = [];
        }
        if (this.__deleting.length > 0) {
            this.__deleting.forEach(entity => {
                this.systemManager.deleteEntity(entity);
                this.tagManager.deleteEntity(entity);
                this.groupManager.deleteEntity(entity);
                this.componentManager.deleteEntity(entity);
                this.entityManager.deleteEntity(entity);
            });
            this.__deleting = [];
        }
    }
    updateTime(time) {
        this.__delta = time - this.__lastTime;
        this.__elapsed += this.__delta;
        this.__lastTime = time;
    }
    updateByDelta(delta) {
        this.__delta = delta;
        this.__elapsed += this.__delta;
        this.__lastTime = performance.now();
    }
    cleanUp() {
        this.entityManager.cleanUp();
        this.componentManager.cleanUp();
        this.systemManager.cleanUp();
        this.groupManager.cleanUp();
        this.tagManager.cleanUp();
    }
}
//# sourceMappingURL=EcsInstance.js.map