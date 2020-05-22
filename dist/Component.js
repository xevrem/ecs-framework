let Component = /** @class */ (() => {
    class Component {
        constructor() {
            this.owner = -1;
        }
        get type() {
            let inst = this.constructor;
            return inst.type;
        }
        set type(value) {
            let inst = this.constructor;
            inst.type = value;
        }
    }
    Component.type = -1;
    return Component;
})();
export { Component };
//# sourceMappingURL=Component.js.map