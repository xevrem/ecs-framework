import { Err, None, Ok, Option, OptionTuple, OrderedNoneTuple, OrderedOptionTuple, OrderedSomeTuple, Result, Some } from 'types';
export declare function is_some<T>(val: Option<T>): val is Some<T>;
export declare function is_none<T>(val: Option<T>): val is None;
export declare function is_ok<T, E extends Error>(val: Result<T, E>): val is Ok<T>;
export declare function is_err<T, E extends Error>(val: Result<T, E>): val is Err<E>;
export declare function all_some<T extends OptionTuple<T>>(val: OrderedOptionTuple<T>): val is OrderedSomeTuple<T>;
export declare function all_none<T extends OptionTuple<T>>(val: OrderedOptionTuple<T>): val is OrderedNoneTuple<T>;
export declare function lerp(a: number, b: number, percent: number): number;
export declare function makeTimer(deltaMax: number): {
    begin: () => void;
    end: (text: string, ...args: any[]) => void;
    readonly delta: number;
};
//# sourceMappingURL=utils.d.ts.map