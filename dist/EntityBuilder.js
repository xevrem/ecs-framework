import { is_some, is_none } from 'onsreo';
import { Bag } from './Bag';
/**
 * creates a builder that allows you to chain calls to build up an entity
 * making creation of entities extremely easy while remaining lightweight
 * and performant.
 */
export function makeEntityBuilder(ecs) {
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
                currentBuilder = is_some(initCallback)
                    ? initCallback(currentBuilder)
                    : this;
                for (let i = 0; i < componentCallbacks.length; i++) {
                    const component = componentCallbacks[i](currentBuilder);
                    if (is_some(component)) {
                        components.set(component.type, component);
                        ecs.addComponent(entity, component);
                    }
                }
                // we do standard adds after callbacks because callbacks can add inside them
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
                    ecs.groupManager.addEntityToGroup(groupCallbacks[i](currentBuilder), entity);
                }
                return entity;
            }
            catch (e) {
                console.error('ENTITY BUILDER ERROR:', e);
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
        },
    };
    return builder;
}
//# sourceMappingURL=EntityBuilder.js.map