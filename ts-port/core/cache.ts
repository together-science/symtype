/* Caching facility for SymPy */

/*

Notable changes made (WB and GM):
- Removed caching utilities (like print_cache and clear_cache) as they are not
  yet necesary in this port
- Restructured caching system around LRU cache class in utilities.ts
- Added settings dictionary instead of local env variable to choose what caching
  function to use

*/

import {LRUCache} from "./utility";

const settings = {
    debug: false,
    no_cache: false,
};

export let cacheit: any;

if (settings.debug) {
    cacheit = _cacheit_debug;
} else if (settings.no_cache) {
    cacheit = _cacheit_nocache;
} else {
    cacheit = _cacheit;
}


function _cacheit(func: any, maxsize: number = 10): (x: any) => any {
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

function _cacheit_nocache(func: any) {
    return func;
}

function _cacheit_debug(func: any, maxsize: number = 10): (x: any) => any {
    const cache = new LRUCache(maxsize);
    return ((...x) => {
        let res = cache.get(x);
        if (typeof res === "undefined") {
            res = func(...x);
            cache.put(x, res);
        } if (res !== func(x)) {
            throw new Error("returned values are not the same");
        }
        return res;
    });
}

