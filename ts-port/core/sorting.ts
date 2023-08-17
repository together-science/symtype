import { Global } from "./global";
import { ArrDefaultDict, HashDict, HashSet } from "./utility";

export function default_sort_key(item: any, order: any = undefined) {
    /*
    Return a key that can be used for sorting.

    The key has the structure:

    (class_key, (len(args), args), exponent.sort_key(), coefficient)

    This key is supplied by the sort_key routine of Basic objects when
    ``item`` is a Basic object or an object (other than a string) that
    sympifies to a Basic object. Otherwise, this function produces the
    key.

    The ``order`` argument is passed along to the sort_key routine and is
    used to determine how the terms *within* an expression are ordered.
    (See examples below) ``order`` options are: 'lex', 'grlex', 'grevlex',
    and reversed values of the same (e.g. 'rev-lex'). The default order
    value is None (which translates to 'lex').

    Examples
    ========

    >>> from sympy import S, I, default_sort_key, sin, cos, sqrt
    >>> from sympy.core.function import UndefinedFunction
    >>> from sympy.abc import x

    The following are equivalent ways of getting the key for an object:

    >>> x.sort_key() == default_sort_key(x)
    True

    Here are some examples of the key that is produced:

    >>> default_sort_key(UndefinedFunction('f'))
    ((0, 0, 'UndefinedFunction'), (1, ('f',)), ((1, 0, 'Number'),
        (0, ()), (), 1), 1)
    >>> default_sort_key('1')
    ((0, 0, 'str'), (1, ('1',)), ((1, 0, 'Number'), (0, ()), (), 1), 1)
    >>> default_sort_key(S.One)
    ((1, 0, 'Number'), (0, ()), (), 1)
    >>> default_sort_key(2)
    ((1, 0, 'Number'), (0, ()), (), 2)


    While sort_key is a method only defined for SymPy objects,
    default_sort_key will accept anything as an argument so it is
    more robust as a sorting key. For the following, using key=
    lambda i: i.sort_key() would fail because 2 does not have a sort_key
    method; that's why default_sort_key is used. Note, that it also
    handles sympification of non-string items likes ints:

    >>> a = [2, I, -I]
    >>> sorted(a, key=default_sort_key)
    [2, -I, I]

    The returned key can be used anywhere that a key can be specified for
    a function, e.g. sort, min, max, etc...:

    >>> a.sort(key=default_sort_key); a[0]
    2
    >>> min(a, key=default_sort_key)
    2

    Note
    ----

    The key returned is useful for getting items into a canonical order
    that will be the same across platforms. It is not directly useful for
    sorting lists of expressions:

    >>> a, b = x, 1/x

    Since ``a`` has only 1 term, its value of sort_key is unaffected by
    ``order``:

    >>> a.sort_key() == a.sort_key('rev-lex')
    True

    If ``a`` and ``b`` are combined then the key will differ because there
    are terms that can be ordered:

    >>> eq = a + b
    >>> eq.sort_key() == eq.sort_key('rev-lex')
    False
    >>> eq.as_ordered_terms()
    [x, 1/x]
    >>> eq.as_ordered_terms('rev-lex')
    [1/x, x]

    But since the keys for each of these terms are independent of ``order``'s
    value, they do not sort differently when they appear separately in a list:

    >>> sorted(eq.args, key=default_sort_key)
    [1/x, x]
    >>> sorted(eq.args, key=lambda i: default_sort_key(i, order='rev-lex'))
    [1/x, x]

    The order of terms obtained when using these keys is the order that would
    be obtained if those terms were *factors* in a product.

    Although it is useful for quickly putting expressions in canonical order,
    it does not sort expressions based on their complexity defined by the
    number of operations, power of variables and others:

    >>> sorted([sin(x)*cos(x), sin(x)], key=default_sort_key)
    [sin(x)*cos(x), sin(x)]
    >>> sorted([x, x**2, sqrt(x), x**3], key=default_sort_key)
    [sqrt(x), x, x**2, x**3]

    See Also
    ========

    ordered, sympy.core.expr.Expr.as_ordered_factors, sympy.core.expr.Expr.as_ordered_terms
    */

    if (item.isinstance) { // checks if item is instanceof Basic
        return item.sort_key(order);
    }

    // changing this part a lot since sympy relies on some unique python stuff

    let args: any[];
    let unordered: boolean;

    // currently no way of handling normal dictionaries !!!!!
    if (item instanceof HashDict) {
        args = item.entries();
        unordered = true;
    } else if (item instanceof HashSet) {
        args = item.toArray();
        unordered = true;
    } else if (item instanceof Set) {
        args = Array.from(item);
        unordered = true;
    } else if (Array.isArray(item)) {
        args = item;
        unordered = false;
    }


    // fancy way of checking if item is an iterable of the kinds defined above
    let cls_index;
    if (args.length > 0) {
        args = args.map((arg: any) => default_sort_key(arg, order))
        if (unordered) {
            args = args.sort();
        }
    
        let cls_index;
        [cls_index, args] = [10, [args.length, args]];
    } else {
        [cls_index, args] = [0, [1, item as string]];
    }

    const sone = Global.construct("_Number", 1);
    return [[cls_index, 0, item.constructor.name], args, sone.sort_key(), sone];
}

function _node_count(e: any) {
    if (e.is_Float()) {
        return 0.5;
    }
    return 1 + e._args.map((item: any) => _node_count(item)).reduce((a: any, b: any) => a + b, 0);
}

function _nodes(e: any): any {
    /*
    A helper for ordered() which returns the node count of ``e`` which
    for Basic objects is the number of Basic nodes in the expression tree
    but for other objects is 1 (unless the object is an iterable or dict
    for which the sum of nodes is returned).
    */

    if (e.isinstance) {
        if (e.is_Derivative()) {
            return _nodes(e.expr) + e.variable_count.map((i: any) => {
                if (i[1].is_Number()) {
                    return i[1];
                }
                return _nodes(i[1]);
            }).reduce((a: any, b: any) => a + b, 0);
        } else {
            return _node_count(e);
        }
    } else if (Array.isArray(e)) {
        return 1 + e.map((ei: any) => _nodes(ei)).reduce((a: any, b: any) => a + b, 0);
    } else if (e instanceof HashDict) {
        return 1 + e.entries().map((item: any) => _nodes(item[0] + _nodes(item[1]))).reduce((a: any, b: any) => a + b, 0);
    } else {
        return 1;
    }
}

export function* ordered(seq: any, keys: any = undefined, def: boolean = true, warn: boolean = false) {
    /*
    Return an iterator of the seq where keys are used to break ties in
    a conservative fashion: if, after applying a key, there are no ties
    then no other keys will be computed.

    Two default keys will be applied if 1) keys are not provided or 2) the
    given keys do not resolve all ties (but only if ``default`` is True). The
    two keys are ``_nodes`` (which places smaller expressions before large) and
    ``default_sort_key`` which (if the ``sort_key`` for an object is defined
    properly) should resolve any ties.

    If ``warn`` is True then an error will be raised if there were no
    keys remaining to break ties. This can be used if it was expected that
    there should be no ties between items that are not identical.

    Examples
    ========

    >>> from sympy import ordered, count_ops
    >>> from sympy.abc import x, y

    The count_ops is not sufficient to break ties in this list and the first
    two items appear in their original order (i.e. the sorting is stable):

    >>> list(ordered([y + 2, x + 2, x**2 + y + 3],
    ...    count_ops, default=False, warn=False))
    ...
    [y + 2, x + 2, x**2 + y + 3]

    The default_sort_key allows the tie to be broken:

    >>> list(ordered([y + 2, x + 2, x**2 + y + 3]))
    ...
    [x + 2, y + 2, x**2 + y + 3]

    Here, sequences are sorted by length, then sum:

    >>> seq, keys = [[[1, 2, 1], [0, 3, 1], [1, 1, 3], [2], [1]], [
    ...    lambda x: len(x),
    ...    lambda x: sum(x)]]
    ...
    >>> list(ordered(seq, keys, default=False, warn=False))
    [[1], [2], [1, 2, 1], [0, 3, 1], [1, 1, 3]]

    If ``warn`` is True, an error will be raised if there were not
    enough keys to break ties:

    >>> list(ordered(seq, keys, default=False, warn=True))
    Traceback (most recent call last):
    ...
    ValueError: not enough keys to break ties


    Notes
    =====

    The decorated sort is one of the fastest ways to sort a sequence for
    which special item comparison is desired: the sequence is decorated,
    sorted on the basis of the decoration (e.g. making all letters lower
    case) and then undecorated. If one wants to break ties for items that
    have the same decorated value, a second key can be used. But if the
    second key is expensive to compute then it is inefficient to decorate
    all items with both keys: only those items having identical first key
    values need to be decorated. This function applies keys successively
    only when needed to break ties. By yielding an iterator, use of the
    tie-breaker is delayed as long as possible.

    This function is best used in cases when use of the first key is
    expected to be a good hashing function; if there are no unique hashes
    from application of a key, then that key should not have been used. The
    exception, however, is that even if there are many collisions, if the
    first group is small and one does not need to process all items in the
    list then time will not be wasted sorting what one was not interested
    in. For example, if one were looking for the minimum in a list and
    there were several criteria used to define the sort order, then this
    function would be good at returning that quickly if the first group
    of candidates is small relative to the number of items being processed.
    */

    const d = new ArrDefaultDict();
    if (typeof keys !== "undefined") {
        let f: any;
        if (Array.isArray(keys)) {
            f = keys.shift();
        } else {
            f = keys;
            keys = [];
        }
        seq.forEach((a: any) => d.add(f(a), d.get(f(a)).push(a)));
    } else {
        if (!def) {
            throw new Error("if default is false, keys must be provided")
        }
        d.add(undefined, d.get(undefined).concat(seq));
    }

    for (let [k, value] of d.entries().sort()) {
        if (value.length > 1) {
            if (keys) {
                value = ordered(value, keys, def, warn);
            } else if (def) {
                value = ordered(value, [_nodes, default_sort_key], false, warn);
            } else if (warn) {
                const u = new HashSet(value);
                if (u.size > 1) {
                    throw new Error("not enough keys to break ties")
                }
            }
        }
        yield* value;
    }
}