// export declare type VariadricQuery<T extends ComponentTuple> = [...T];
export class FuncQuery {
    constructor(ecs, data) {
        this.ecs = ecs;
        this.data = data;
    }
    join() {
        return this.ecs.query(this.data);
    }
}
//# sourceMappingURL=FuncQuery.js.map