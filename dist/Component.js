export const ComponentSymbol = Symbol('Component');
export class Component {
    constructor() {
        this.owner = -1;
    }
    /**
     * this allows us to interogate a type to see if it is a component type
     * @returns whether type is a type of Component
     */
    static get [ComponentSymbol]() {
        return true;
    }
    /**
     * this allows us to interogate an object to see if it is a component
     * @returns whether an object is a Component
     */
    get [ComponentSymbol]() {
        return true;
    }
    /**
     * get the registerd type of this component
     */
    get type() {
        const inst = this.constructor;
        return inst.type;
    }
    /**
     * set the type number for all components of this type
     */
    set type(value) {
        const inst = this.constructor;
        inst.type = value;
    }
}
Component.type = -1;
/**
 * confirms whether the given object is a Component Type or Component Instance
 */
export function isComponent(object) {
    if (object[ComponentSymbol]) {
        return true;
    }
    else {
        return false;
    }
}
/**
 * confirms whether the given component is of the stated component type
 */
export function isComponentOfType(object, type) {
    if (object.type === type.type) {
        return true;
    }
    else {
        return false;
    }
}
// type BaseType = {
//   readonly name: string;
//   readonly type: number;
// };
// type BaseComp = {
//   owner: number;
//   [ComponentSymbol]: true;
// } & BaseType;
// type ProtoComp<C> = C & BaseComp;
// type ProtoCompBuilder<C> = (owner: number) => ProtoComp<C>;
// function registerComponent<C>(
//   name: string,
//   defaultData: C,
//   nextId: number
// ): [baseType: BaseType, builder: ProtoCompBuilder<C>] {
//   const _typeId = nextId++;
//   const _name = name;
//   function makeComponent(owner: number) {
//     const inner: ProtoComp<C> = {
//       ...defaultData,
//       owner,
//       name: _name,
//       type: _typeId,
//       [ComponentSymbol]: true as const,
//     };
//     return inner;
//   }
//   return [
//     {
//       type: _typeId,
//       name: _name,
//     },
//     makeComponent,
//   ];
// }
//# sourceMappingURL=Component.js.map