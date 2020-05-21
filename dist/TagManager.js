export class TagManager {
    constructor() {
        this.__tags = {};
    }
    getEntityByTag(tag) {
        return this.__tags[tag];
    }
    tagEntity(tag, entity) {
        this.__tags[tag] = entity;
    }
    // refresh(entity: Entity) {}
    deleteEntity(entity) {
        Object.keys(this.__tags).forEach(key => {
            if (this.__tags[key] === entity)
                delete this.__tags[key];
        });
    }
    cleanUp() {
        this.__tags = {};
    }
}
//# sourceMappingURL=TagManager.js.map