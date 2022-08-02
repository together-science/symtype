/* Caching facility for SymPy */

/*

Notable changes made (WB and GM):
- Removed caching utilities (like print_cache and clear_cache) as they are not
  yet necesary in this port
- Restructured caching system around LRU cache class in utilities.ts
- Added settings dictionary instead of local env variable to choose what caching
  function to use

*/

import {LRUCache} from "./utility.js";

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


// class _cache extends Array {
//     /* List of cached functions */

//     print_cache() {
//         for (let item of this) {
//             let name = item.constructor.name;
//             if (item.hasAttribute('cache_info')) {
//                 console.log(item + " is wrapped"); // !!!
//             }
//         }
//     }

//     clear_cache() {
//         /* clear cache content */
//         for (let item of this) {
//             if (item.hasAttribute('__wrapped__')) {
//                 item.clearCache(); // !!!
//             }
//         }
//     }
// }


// // global cache registry:
// let CACHE = new _cache()
// // make clear and print methods available
// let print_cache = CACHE.print_cache
// let clear_cache = CACHE.clear_cache // !!!

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

