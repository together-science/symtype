/*
Replacement rules.
*/

/*

Notable changes made (WB and GM):
- Combined __get__ and get_item

*/

// eslint-disable-next-line no-unused-vars
class Transform {
    /*
    Immutable mapping that can be used as a generic transformation rule.

    Parameters
    ==========

    transform : callable
        Computes the value corresponding to any key.

    filter : callable, optional
        If supplied, specifies which objects are in the mapping.

    Examples
    ========

    >>> from sympy.core.rules import Transform
    >>> from sympy.abc import x

    This Transform will return, as a value, one more than the key:

    >>> add1 = Transform(lambda x: x + 1)
    >>> add1[1]
    2
    >>> add1[x]
    x + 1

    By default, all values are considered to be in the dictionary. If a filter
    is supplied, only the objects for which it returns True are considered as
    being in the dictionary:

    >>> add1_odd = Transform(lambda x: x + 1, lambda x: x%2 == 1)
    >>> 2 in add1_odd
    False
    >>> add1_odd.get(2, 0)
    0
    >>> 3 in add1_odd
    True
    >>> add1_odd[3]
    4
    >>> add1_odd.get(3, 0)
    4
    */

    _transform;

    _filter;

    constructor(transform: ((x: any) => any), filter: ((x: any) => boolean) = ((x: any) => true)) {
        this._transform = transform;
        this._filter = filter;
    }

    has(item: any): boolean {
        return this._filter(item);
    }

    get(key: any, def?: any) {
        if (this._filter(key)) {
            return this._transform(key);
        } else {
            if (typeof def !== "undefined") {
                return def;
            }
            throw new Error(key + " is not valid");
        }
    }
}
