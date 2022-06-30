/*
Provides functionality for multidimensional usage of scalar-functions.
Read the vectorize docstring for more details.
*/

// !!! - import for wraps thing
import { Logic, True, False } from "./logic.js" 

function apply_on_element(f: any, args: any[], n: any) {
    /*
    Returns a structure with the same dimension as the specified argument,
    where each basic element is replaced by the function f applied on it. All
    other arguments stay the same.
    */
    // Get the specified argument

    let structure = args[n];

    // if structure isn't an array, wrap it in an array so we can call map later
    if (!(Array.isArray(structure))) {
        structure = [structure];
    }

    // Define reduced function that is only dependent on the specified argument.
    function f_reduced(x: any) {
        if (Symbol.iterator in Object(x)) {
            return x.map((e: any) => f_reduced(e)); // !!!
        } else {
            return f(x);
        }
    }
    // f_reduced will call itself recursively so that in the end f is applied to
    // all basic elements.
    let res = structure.map((e: any) => f_reduced(e));

    // returned element should only be an array if structure is an array
    if (res.length === 1) {
        return res[0];
    }
    return res;
}

// wrap a scalar function so that it can be applied to vectors and matricies
// works on vector and scalar inputs
function vectorize(func: any): (x: any) => any[] {
    return ((x) => {
        // if x is not an array, return the function value
        if (typeof x.length === "undefined") {
            return func(x);
        }
        // else, apply the function on every value
        let res = [];
        for (let i = 0; i < x.length; i++) {
            let eval_arr = apply_on_element(func, x, i);
            res.push(eval_arr);
        }
        return res;
    })
}

let sin_vectorized = vectorize(Math.sin);

console.log(sin_vectorized(Math.PI/2))
console.log(sin_vectorized([Math.PI/2, Math.PI]))
console.log(sin_vectorized([[Math.PI/2, 0, [Math.PI / 2]], Math.PI]))

/*

Ported code not currently being used

function iter_copy(structure: any): any {

    let l = [];
    for (let i of structure) {
        if (Symbol.iterator in Object(i)) {
            l.push(iter_copy(i));
        } else {
            l.push(i);
        }
    }
    return l;
 }
 
 function structure_copy(structure: any) {
     if (structure.copy) {
         return structure.copy();
     }
     return iter_copy(structure);
 }
 
*/


