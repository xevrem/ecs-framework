export const ComponentSymbol: unique symbol = Symbol('Component');

export class Component implements Component {
  static type = -1;
  owner = -1;

  /**
   * this allows us to interogate a type to see if it is a component type
   * @returns whether type is a type of Component
   */
  static get [ComponentSymbol](): boolean {
    return true;
  }

  /**
   * this allows us to interogate an object to see if it is a component
   * @returns whether an object is a Component
   */
  get [ComponentSymbol](): boolean {
    return true;
  }

  /**
   * get the registerd type of this component
   */
  get type(): number {
    const inst = this.constructor as typeof Component;
    return inst.type;
  }
  /**
   * set the type number for all components of this type
   */
  set type(value: number) {
    const inst = this.constructor as typeof Component;
    inst.type = value;
  }
}

/**
 * confirms whether the given object is a Component Type or Component Instance
 */
export function isComponent<T extends typeof Component | Component>(
  object: T
): object is T {
  if (object[ComponentSymbol]) {
    return true;
  } else {
    return false;
  }
}

/**
 * confirms whether the given component is of the stated component type
 */
export function isComponentOfType<T extends typeof Component | Component>(
  object: Component | typeof Component,
  type: T
): object is T {
  if (object.type === type.type) {
    return true;
  } else {
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
