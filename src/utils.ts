import {
  Err,
  None,
  Ok,
  Option,
  OptionTuple,
  OrderedNoneTuple,
  OrderedOptionTuple,
  OrderedSomeTuple,
  Result,
  Some,
} from 'types';

export function is_some<T>(val: Option<T>): val is Some<T> {
  if (!!val || typeof val === 'number' || typeof val === 'boolean') return true;
  return false;
}

export function is_none<T>(val: Option<T>): val is None {
  if (is_some(val)) return false;
  return true;
}

export function is_ok<T, E extends Error>(val: Result<T, E>): val is Ok<T> {
  if (val instanceof Error) return false;
  return true;
}

export function is_err<T, E extends Error>(val: Result<T, E>): val is Err<E> {
  if (val instanceof Error) return true;
  return false;
}

export function all_some<T extends OptionTuple<T>>(
  val: OrderedOptionTuple<T>
): val is OrderedSomeTuple<T> {
  if (val.some((v: T) => is_none(v))) return false;
  return true;
}

export function all_none<T extends OptionTuple<T>>(
  val: OrderedOptionTuple<T>
): val is OrderedNoneTuple<T> {
  if (val.some((v: T) => is_some(v))) return false;
  return true;
}

export function lerp(a: number, b: number, percent: number): number {
  return (b - a) * percent + a;
}

export function makeTimer(deltaMax: number) {
  let start = performance.now();
  let stop = Number.MAX_SAFE_INTEGER;
  let delta = 0;

  function begin(): void {
    start = performance.now();
  }

  function end(text: string, ...args: any[]): void {
    stop = performance.now();

    delta = stop - start;

    if (delta > deltaMax) {
      console.info(`ms: ${delta} -`, text, ...args);
    }
  }

  return {
    begin,
    end,
    get delta(): number {
      return delta;
    },
  };
}
