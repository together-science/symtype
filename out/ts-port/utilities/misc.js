class Undecidable extends Error {
}
function strlines(s, c = 64, short = false) {
    throw new Error("strlines is not yet implemented");
}
function rawlines(s) {
    throw new Error("rawlines is not yet implemented");
}
function debug_decorator(func) {
    throw new Error("debug_decorator is not yet implemented");
}
function debug(...args) {
    throw new Error("debug is not yet implemented");
}
function find_executable(executable, path = undefined) {
    throw new Error("find_executable is not yet implemented");
}
function func_name(x, short = false) {
    throw new Error("func_name is not yet implemented");
}
function _replace(reps) {
    throw new Error("_replace is not yet implemented");
}
function replace(str, ...reps) {
    throw new Error("replace is not yet implemented");
}
function translate(s, a, b = undefined, c = undefined) {
    throw new Error("translate is not yet implemented");
}
function ordinal(num) {
    throw new Error("ordinal is not yet implemented");
}
function as_int(n) {
    if (!Number.isInteger(n)) {
        throw new Error(n + " is not int");
    }
    return n;
}
export { as_int };
//# sourceMappingURL=misc.js.map