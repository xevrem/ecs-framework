export declare const ComponentSymbol: unique symbol;
export declare class Component implements Component {
    static type: number;
    owner: number;
    /**
     * this allows us to interogate a type to see if it is a component type
     * @returns whether type is a type of Component
     */
    static get [ComponentSymbol](): boolean;
    /**
     * this allows us to interogate an object to see if it is a component
     * @returns whether an object is a Component
     */
    get [ComponentSymbol](): boolean;
    /**
     * get the registerd type of this component
     */
    get type(): number;
    /**
     * set the type number for all components of this type
     */
    set type(value: number);
}
/**
 * confirms whether the given object is a Component Type or Component Instance
 */
export declare function isComponent<T extends typeof Component | Component>(object: T): object is T;
/**
 * confirms whether the given component is of the stated component type
 */
export declare function isComponentOfType<T extends typeof Component | Component>(object: Component | typeof Component, type: T): object is T;
//# sourceMappingURL=Component.d.ts.map