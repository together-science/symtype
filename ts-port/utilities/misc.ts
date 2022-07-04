/* Miscellaneous stuff that does not really fit anywhere else */

/*

Notable changes made (WB and GM):
- Filldedent and as_int are rewritten to include the same functionality with
  different methodology
- Many functions are not yet implemented and will be completed as we find them
  necessary
}

*/


import dedent from "dedent";


class Undecidable extends Error {
    // an error to be raised when a decision cannot be made definitively
    // where a definitive answer is needed
}

function filldedent(s: string, w: number = 70): string {
    /*
    Strips leading and trailing empty lines from a copy of ``s``, then dedents,
    fills and returns it.

    Empty line stripping serves to deal with docstrings like this one that
    start with a newline after the initial triple quote, inserting an empty
    line at the beginning of the string.

    See Also
    ========
    strlines, rawlines

    */
    
    // remove empty blank lines
    let str = s.replace(/^\s*\n/gm, "")
    // dedent
    str = dedent(str);
    // wrap
    let arr = str.split(" ");
    let res = "";
    let linelength = 0;
    for (let word of arr) {
        if (linelength <= w + word.length) {
            res += word;
            linelength += word.length;
        } else {
            res += "\n";
            linelength = 0;
        }
    }
    return res;   
}


function strlines(s: string, c: number = 64, short=false) {
    throw new Error("strlines is not yet implemented")
}

function rawlines(s: string) {
    throw new Error("rawlines is not yet implemented")
}

function debug_decorator(func: any) {
    throw new Error("debug_decorator is not yet implemented")
}

function debug(...args: any) {
    throw new Error("debug is not yet implemented")
}

function find_executable(executable: any, path: any=undefined) {
    throw new Error("find_executable is not yet implemented")
}

function func_name(x: any, short: any=false) {
    throw new Error("func_name is not yet implemented")
}

function _replace(reps: any) {
    throw new Error("_replace is not yet implemented")
}

function replace(str: string, ...reps: any) {
    throw new Error("replace is not yet implemented")
}

function translate(s: any, a: any, b: any=undefined, c: any=undefined) {
    throw new Error("translate is not yet implemented")
}

function ordinal(num: any) {
    throw new Error("ordinal is not yet implemented")
}

function as_int(n: any) {

    if (!Number.isInteger(n)) { // !!! - might need to update this
        throw new Error(n + " is not int")
    }
}
