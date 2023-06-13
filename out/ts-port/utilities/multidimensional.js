function apply_on_element(f, args, n) {
    let structure = args[n];
    if (!(Array.isArray(structure))) {
        structure = [structure];
    }
    function f_reduced(x) {
        if (Symbol.iterator in Object(x)) {
            return x.map((e) => f_reduced(e));
        }
        else {
            args[n] = x;
            return f(...args);
        }
    }
    const res = structure.map((e) => f_reduced(e));
    if (res.length === 1) {
        return res[0];
    }
    return res;
}
function iter_copy(structure) {
    const l = [];
    for (const i of structure) {
        if (Symbol.iterator in Object(i)) {
            l.push(iter_copy(i));
        }
        else {
            l.push(i);
        }
    }
    return l;
}
function structure_copy(structure) {
    if (structure.copy) {
        return structure.copy();
    }
    return iter_copy(structure);
}
function vectorize(func, mdargs) {
    function wrapper(...args) {
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
//# sourceMappingURL=multidimensional.js.map