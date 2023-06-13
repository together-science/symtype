import { LRUCache } from "./utility.js";
const settings = {
    debug: false,
    no_cache: false,
};
export let cacheit;
if (settings.debug) {
    cacheit = _cacheit_debug;
}
else if (settings.no_cache) {
    cacheit = _cacheit_nocache;
}
else {
    cacheit = _cacheit;
}
function _cacheit(func, maxsize = 10) {
    const cache = new LRUCache(maxsize);
    return ((...x) => {
        let res = cache.get(x);
        if (typeof res === "undefined") {
            res = func(...x);
            cache.put(x, res);
        }
        return res;
    });
}
function _cacheit_nocache(func) {
    return func;
}
function _cacheit_debug(func, maxsize = 10) {
    const cache = new LRUCache(maxsize);
    return ((...x) => {
        let res = cache.get(x);
        if (typeof res === "undefined") {
            res = func(...x);
            cache.put(x, res);
        }
        if (res !== func(x)) {
            throw new Error("returned values are not the same");
        }
        return res;
    });
}
//# sourceMappingURL=cache.js.map