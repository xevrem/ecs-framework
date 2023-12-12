import { FuncQuery } from "FuncQuery";
import { ComponentTuple } from "./tuples";
import { EcsInstance } from "EcsInstance";

export declare interface QueryFuncParams<T extends ComponentTuple> {
  query: FuncQuery<T>;
  ecs: EcsInstance;
  delta: number;
}

export declare type QueryFunc<T extends ComponentTuple> = (
  params: QueryFuncParams<T>
) => void;
