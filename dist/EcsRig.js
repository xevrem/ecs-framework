import { Component } from './Component';
import { EcsInstance } from './EcsInstance';
import { EntitySystem } from './EntitySystem';
class Bar extends Component {
}
export default function ecsRig(callback) {
    const rig = {
        ecs: new EcsInstance(),
        makeComponentType: () => {
            return class Foo extends Bar {
            };
        },
        makeSystemType: (query) => {
            class System extends EntitySystem {
                constructor(props) {
                    super(props);
                    this.needed = query.needed;
                    this.optional = query.optional || [];
                    this.unwanted = query.unwanted || [];
                }
                initialize() { }
                load(_entities) { }
                created(_entity) { }
                deleted(_entity) { }
                added(_entity) { }
                removed(_entity) { }
                cleanUp(_entities) { }
                reset() { }
                begin() { }
                end() { }
                process(_entity, _query, _delta) { }
            }
            return System;
        },
    };
    const destroy = () => {
        rig.ecs.cleanUp();
    };
    try {
        callback(rig);
    }
    catch (error) {
        console.error('ERROR encountered in ecsRig callback:', error);
        throw error;
    }
    finally {
        destroy();
    }
}
//# sourceMappingURL=EcsRig.js.map