export class Component {
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
//# sourceMappingURL=Component.js.map