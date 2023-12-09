import type { FuncQuery } from "FuncQuery";
import type { ComponentTuple } from "./tuples";
import type { EcsInstance } from "EcsInstance";

export declare interface QueryFuncParams<T extends ComponentTuple> {
  query: FuncQuery<T>;
  ecs: EcsInstance;
  delta: number;
}

export declare type QueryFunc<T extends ComponentTuple> = (
  params: QueryFuncParams<T>
) => void;
