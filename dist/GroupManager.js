import { Bag } from './Bag';
export class GroupManager {
    //   [key: string]: Bag<Entity>
    // } = {};
    addEntityToGroup(group, entity) {
        if (!this._groups.hasOwnProperty(group)) {
            this._groups[group] = new Bag();
        }
        if (!this._groups[group].contains(entity)) {
            this._groups[group].add(entity);
        }
    }
    getGroup(group) {
        return this._groups[group];
    }
    // refresh(entity) { }
    deleteEntity(entity) {
        Object.values(this._groups).forEach((group) => {
            group.remove(entity);
        });
    }
    cleanUp() {
        Object.keys(this._groups).forEach(key => {
            this._groups[key].clear();
            delete this._groups[key];
        });
    }
}
//# sourceMappingURL=GroupManager.js.map