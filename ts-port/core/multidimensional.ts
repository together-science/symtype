/*
Provides functionality for multidimensional usage of scalar-functions.
Read the vectorize docstring for more details.
*/

/*

Notable changes made (WB and GM):
- Removed everything related to kwargs
- Restructed vectorize class as a function

*/

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
            return x.map((e: any) => f_reduced(e));
        } else {
            args[n] = x;
            return f(...args);
        }
    }
    // f_reduced will call itself recursively so that in the end f is applied to
    // all basic elements.
    const res = structure.map((e: any) => f_reduced(e));

    // returned element should only be an array if structure is an array
    if (res.length === 1) {
        return res[0];
    }
    return res;
}

function iter_copy(structure: any): any {
    const l = [];
    for (const i of structure) {
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

/*
    Generalizes a function taking scalars to accept multidimensional arguments.

    Examples

    ========
    >>> from sympy import vectorize, diff, sin, symbols, Function
    >>> x, y, z = symbols('x y z')
    >>> f, g, h = list(map(Function, 'fgh'))
    >>> @vectorize(0)
    ... def vsin(x):
    ...     return sin(x)
    >>> vsin([1, x, y])
    [sin(1), sin(x), sin(y)]
    >>> @vectorize(0, 1)
    ... def vdiff(f, y):
    ...     return diff(f, y)
    >>> vdiff([f(x, y, z), g(x, y, z), h(x, y, z)], [x, y, z])
    [[Derivative(f(x, y, z), x), Derivative(f(x, y, z), y), Derivative(f(x, y, z), z)],
    [Derivative(g(x, y, z), x), Derivative(g(x, y, z), y), Derivative(g(x, y, z), z)],
    [Derivative(h(x, y, z), x), Derivative(h(x, y, z), y), Derivative(h(x, y, z), z)]]
*/
// eslint-disable-next-line no-unused-vars
function vectorize(func: any, mdargs: any) {
    /*
    The given numbers and strings characterize the arguments that will be
    treated as data structures, where the decorated function will be applied
    to every single element.

    If no argument is given, everything is treated as multidimensional.
    */
    function wrapper(...args: any) {
        if (!(Array.isArray(mdargs))) {
            mdargs = [mdargs];
        }
        if (mdargs !== null) {
            for (const n of mdargs) {
                const entry = args[n];
                if ((Symbol.iterator in Object(entry))) {
                    args[n] = structure_copy(entry);
                    return apply_on_element(wrapper, args, n);
                }
            }
            return func(...args);
        }
    }
    return wrapper;
}


