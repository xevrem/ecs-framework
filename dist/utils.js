export function is_some(val) {
    if (!!val || typeof val === 'number' || typeof val === 'boolean')
        return true;
    return false;
}
export function is_none(val) {
    if (is_some(val))
        return false;
    return true;
}
export function is_ok(val) {
    if (val instanceof Error)
        return false;
    return true;
}
export function is_err(val) {
    if (val instanceof Error)
        return true;
    return false;
}
export function all_some(val) {
    if (val.some((v) => is_none(v)))
        return false;
    return true;
}
export function all_none(val) {
    if (val.some((v) => is_some(v)))
        return false;
    return true;
}
export function lerp(a, b, percent) {
    return (b - a) * percent + a;
}
export function makeTimer(deltaMax) {
    let start = performance.now();
    let stop = Number.MAX_SAFE_INTEGER;
    let delta = 0;
    function begin() {
        start = performance.now();
    }
    function end(text, ...args) {
        stop = performance.now();
        delta = stop - start;
        if (delta > deltaMax) {
            console.info(`ms: ${delta} -`, text, ...args);
        }
    }
    return {
        begin,
        end,
        get delta() {
            return delta;
        },
    };
}
//# sourceMappingURL=utils.js.map