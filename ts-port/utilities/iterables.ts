// /* eslint-disable no-unused-vars */
// /*
// Notable changes made (WB and GM):
// - iterable and is_sequence are reworked but have the same functionality
// - Current progress: some things are not yet ported, and some things are ported
//   but still buggy - revisit this whenever those become necessary
// */

import {ArrDefaultDict} from "../core/utility";

// import {HashDict} from "../core/utility.js";

// class NotIterable {
//     /*
//     Use this as mixin when creating a class which is not supposed to
//     return true when iterable() is called on its instances because
//     calling list() on the instance, for example, would result in
//     an infinite loop.
//     */
// }


// function iterable(i: any, exclude: any = undefined): boolean {
//     /*
//     Return a boolean indicating whether ``i`` is SymPy iterable.
//     True also indicates that the iterator is finite, e.g. you can
//     call list(...) on the instance.
//     When SymPy is working with iterables, it is almost always assuming
//     that the iterable is not a string or a mapping, so those are excluded
//     by default. If you want a pure Python definition, make exclude=None. To
//     exclude multiple items, pass them as a tuple.
//     You can also set the _iterable attribute to True or False on your class,
//     which will override the checks here, including the exclude test.
//     As a rule of thumb, some SymPy functions use this to check if they should
//     recursively map over an object. If an object is technically iterable in
//     the Python sense but does not desire this behavior (e.g., because its
//     iteration is not finite, or because iteration might induce an unwanted
//     computation), it should disable it by setting the _iterable attribute to False.
//     See also: is_sequence
//     Examples
//     ========
//     >>> from sympy.utilities.iterables import iterable
//     >>> from sympy import Tuple
//     >>> things = [[1], (1,), set([1]), Tuple(1), (j for j in [1, 2]), {1:2}, '1', 1]
//     >>> for i in things:
//     ...     print('%s %s' % (iterable(i), type(i)))
//     True <... 'list'>
//     True <... 'tuple'>
//     True <... 'set'>
//     True <class 'sympy.core.containers.Tuple'>
//     True <... 'generator'>
//     False <... 'dict'>
//     False <... 'str'>
//     False <... 'int'>
//     >>> iterable({}, exclude=None)
//     True
//     >>> iterable({}, exclude=str)
//     True
//     >>> iterable("no", exclude=str)
//     False
//     */
//     if (typeof exclude === "undefined") {
//         if (i.constructor.name === "String" || i instanceof HashDict || i instanceof NotIterable) {
//             return false;
//         }
//     } else if (typeof exclude !== "undefined") {
//         if (i.constructor.name === exclude) {
//             return false;
//         }
//     }
//     if (Symbol.iterator in Object(i)) {
//         return true;
//     }
//     try {
//         Object.values(i);
//     } catch (Error) {
//         return false;
//     }
//     return true;
// }

// function is_sequence(i: any, include: any = undefined): boolean {
//     /*
//     Return a boolean indicating whether ``i`` is a sequence in the SymPy
//     sense. If anything that fails the test below should be included as
//     being a sequence for your application, set 'include' to that object's
//     type; multiple types should be passed as a tuple of types.
//     Note: although generators can generate a sequence, they often need special
//     handling to make sure their elements are captured before the generator is
//     exhausted, so these are not included by default in the definition of a
//     sequence.
//     See also: iterable
//     Examples
//     ========
//     >>> from sympy.utilities.iterables import is_sequence
//     >>> from types import GeneratorType
//     >>> is_sequence([])
//     True
//     >>> is_sequence(set())
//     False
//     >>> is_sequence('abc')
//     False
//     >>> is_sequence('abc', include=str)
//     True
//     >>> generator = (c for c in 'abc')
//     >>> is_sequence(generator)
//     False
//     >>> is_sequence(generator, include=(str, GeneratorType))
//     True
//     */
//     return (i.__getitem__ &&
//     iterable(i) ||
//     typeof include !== "undefined" &&
//     i instanceof include);
// }

// export {is_sequence, iterable};

// function is_palindromic(s: any, i: any = 0, j: any = undefined) {
//     /*
//     Return True if the sequence is the same from left to right as it
//     is from right to left in the whole sequence (default) or in the
//     Python slice ``s[i: j]``; else False.
//     Examples
//     ========
//     >>> from sympy.utilities.iterables import is_palindromic
//     >>> is_palindromic([1, 0, 1])
//     True
//     >>> is_palindromic('abcbb')
//     False
//     >>> is_palindromic('abcbb', 1)
//     False
//     Normal Python slicing is performed in place so there is no need to
//     create a slice of the sequence for testing:
//     >>> is_palindromic('abcbb', 1, -1)
//     True
//     >>> is_palindromic('abcbb', -4, -1)
//     True
//     See Also
//     ========
//     sympy.ntheory.digits.is_palindromic: tests integers
//     */

//     const copy = [...s];
//     for (let i = 0; i < s.length; i++) {
//         if (!(copy[i] === s[i])) {
//             return false;
//         }
//     }
//     return true;
// }

// function flatten(arr: any[], level: number = 1): any {
//     return arr.flat(level);
// }

// function unflatten(arr: any[], n: number = 2) {
//     if (arr.length % n !== 0) {
//         throw new Error("array length is not a multiple of n");
//     }
//     const res: any[] = [];
//     for (let i = 0; i < arr.length; i += n) {
//         res.push(arr.slice(i, i + n));
//     }
//     return res;
// }

// function reshape(arr: any[], shape: any[]) {
//     /* Reshape the sequence according to the template in ``how``.
//     Examples
//     ========
//     >>> from sympy.utilities import reshape
//     >>> seq = list(range(1, 9))
//     >>> reshape(seq, [4]) # lists of 4
//     [[1, 2, 3, 4], [5, 6, 7, 8]]
//     >>> reshape(seq, (4,)) # tuples of 4
//     [(1, 2, 3, 4), (5, 6, 7, 8)]
//     >>> reshape(seq, (2, 2)) # tuples of 4
//     [(1, 2, 3, 4), (5, 6, 7, 8)]
//     >>> reshape(seq, (2, [2])) # (i, i, [i, i])
//     [(1, 2, [3, 4]), (5, 6, [7, 8])]
//     >>> reshape(seq, ((2,), [2])) # etc....
//     [((1, 2), [3, 4]), ((5, 6), [7, 8])]
//     >>> reshape(seq, (1, [2], 1))
//     [(1, [2, 3], 4), (5, [6, 7], 8)]
//     >>> reshape(tuple(seq), ([[1], 1, (2,)],))
//     (([[1], 2, (3, 4)],), ([[5], 6, (7, 8)],))
//     >>> reshape(tuple(seq), ([1], 1, (2,)))
//     (([1], 2, (3, 4)), ([5], 6, (7, 8)))
//     >>> reshape(list(range(12)), [2, [3], {2}, (1, (3,), 1)])
//     [[0, 1, [2, 3, 4], {5, 6}, (7, (8, 9, 10), 11)]]
//     */
//     let m: number = 0;
//     flatten(shape).forEach((e: any) => m += e);
//     const [n, rem] = [arr.length / m, arr.length % m];
//     if (m < 0 || rem) {
//         throw new Error("template must sum to positive number that divides the length of the sequence");
//     }
//     let i = 0;
//     const rv = new Array(n).fill(undefined);
//     for (let k = 0; k < rv.length; k++) {
//         rv[k] = [];
//         for (const hi of shape) {
//             if (Number.isInteger(hi)) {
//                 rv[k].push(arr.slice(i, i + hi));
//                 i += hi;
//             } else {
//                 let n = 0;
//                 hi.forEach((e: any) => n += i);
//                 rv[k].push(reshape(arr.slice(i, i + n), hi)[0]);
//                 i += n;
//             }
//         }
//     }
//     return rv;
// }

// function group(arr: any[], multiple: boolean = true): any {
//     /*
//     Splits a sequence into a list of lists of equal, adjacent elements.
//     Examples
//     ========
//     >>> from sympy import group
//     >>> group([1, 1, 1, 2, 2, 3])
//     [[1, 1, 1], [2, 2], [3]]
//     >>> group([1, 1, 1, 2, 2, 3], multiple=False)
//     [(1, 3), (2, 2), (3, 1)]
//     >>> group([1, 1, 3, 2, 2, 1], multiple=False)
//     [(1, 2), (3, 1), (2, 2), (1, 1)]
//     See Also
//     ========
//     multiset
//         */
//     if (!arr) {
//         return [];
//     }
//     let current: any[] = [arr[0]];
//     const groups: any[] = [];

//     for (const elem of arr.slice(1, arr.length)) {
//         if (elem === current[current.length - 1]) {
//             current.push(elem);
//         } else {
//             groups.push(current);
//             current = [elem];
//         }
//     }

//     groups.push(current);

//     if (multiple) {
//         return groups;
//     }

//     for (let i = 0; i < groups.length; i++) {
//         const current = groups[i];
//         groups[i] = [current[0], current.length];
//     }

//     return groups;
// }

// function* _iproduct2(arr1: any[], arr2: any[]) {
//     // Cartesian product of two possibly infinite iterables
//     const a1 = new Iterator(arr1);
//     const a2 = new Iterator(arr2);

//     const elems1: any[] = [];
//     const elems2: any[] = [];

//     function append(a: Iterator, elems: any[]) {
//         const e = a.next();
//         if (typeof e !== "undefined") {
//             elems.push(e);
//         }
//     }

//     let n = 0;
//     append(a1, elems1);
//     append(a2, elems2);

//     while (n <= elems1.length + elems2.length) {
//         for (let m = n - elems1.length + 1; m < elems2.length; m++) {
//             yield [elems1[n - m], elems2[m]];
//         }
//         n++;
//         append(a1, elems1);
//         append(a2, elems2);
//     }
// }


// function* iproduct(...iterables: any[]): any {
//     /*
//     Cartesian product of iterables.
//     Generator of the Cartesian product of iterables. This is analogous to
//     itertools.product except that it works with infinite iterables and will
//     yield any item from the infinite product eventually.
//     Examples
//     ========
//     >>> from sympy.utilities.iterables import iproduct
//     >>> sorted(iproduct([1,2], [3,4]))
//     [(1, 3), (1, 4), (2, 3), (2, 4)]
//     With an infinite iterator:
//     >>> from sympy import S
//     >>> (3,) in iproduct(S.Integers)
//     True
//     >>> (3, 4) in iproduct(S.Integers, S.Integers)
//     True
//     .. seealso::
//        `itertools.product <https://docs.python.org/3/library/itertools.html#itertools.product>`_
//     */
//     if (iterables.length === 0) {
//         yield [];
//         return;
//     } else if (iterables.length === 1) {
//         for (const e of iterables[0]) {
//             yield [e];
//         }
//     } else if (iterables.length === 2) {
//         for (const e of _iproduct2(iterables[0], iterables[1])) {
//             yield e;
//         }
//     } else {
//         const first = iterables[0];
//         const others = iterables.slice(1, iterables.length);
//         for (const e of _iproduct2(first, iproduct(...others))) {
//             yield [e[0]] + e[1];
//         }
//     }
// }


// function multiset(seq: any) {
//     /* Return the hashable sequence in multiset form with values being the
//     multiplicity of the item in the sequence.
//     Examples
//     ========
//     >>> from sympy.utilities.iterables import multiset
//     >>> multiset('mississippi')
//     {'i': 4, 'm': 1, 'p': 2, 's': 4}
//     See Also
//     ========
//     group
//     */

//     const rv = new IntDefaultDict();
//     for (const s of seq) {
//         rv.increment(s, 1);
//     }
//     return rv.dict;
// }


// function ibin(n: any, bits: any = undefined, str: boolean = false): any {
//     /* Return a list of length ``bits`` corresponding to the binary value
//     of ``n`` with small bits to the right (last). If bits is omitted, the
//     length will be the number required to represent ``n``. If the bits are
//     desired in reversed order, use the ``[::-1]`` slice of the returned list.
//     If a sequence of all bits-length lists starting from ``[0, 0,..., 0]``
//     through ``[1, 1, ..., 1]`` are desired, pass a non-integer for bits, e.g.
//     ``'all'``.
//     If the bit *string* is desired pass ``str=True``.
//     Examples
//     ========
//     >>> from sympy.utilities.iterables import ibin
//     >>> ibin(2)
//     [1, 0]
//     >>> ibin(2, 4)
//     [0, 0, 1, 0]
//     If all lists corresponding to 0 to 2**n - 1, pass a non-integer
//     for bits:
//     >>> bits = 2
//     >>> for i in ibin(2, 'all'):
//     ...     print(i)
//     (0, 0)
//     (0, 1)
//     (1, 0)
//     (1, 1)
//     If a bit string is desired of a given length, use str=True:
//     >>> n = 123
//     >>> bits = 10
//     >>> ibin(n, bits, str=True)
//     '0001111011'
//     >>> ibin(n, bits, str=True)[::-1]  # small bits left
//     '1101111000'
//     >>> list(ibin(3, 'all', str=True))
//     ['000', '001', '010', '011', '100', '101', '110', '111']
//     */
//     if (n < 0) {
//         throw new Error("negative numbers are not allowed");
//     }
//     n = as_int(n);

//     if (typeof bits === "undefined") {
//         bits = 0;
//     } else {
//         try {
//             bits = as_int(bits);
//         } catch (Error) {
//             bits = -1;
//         }
//         if (bits !== -1) {
//             throw new Error("improper format for bits");
//         }
//     } if (!str) {
//         if (bits >= 0) {
//             const res: any[] = [];
//             const bin = Util.bin(n);
//             for (const i of bin.padStart(bits, "0")) {
//                 if (i === "1") {
//                     res.push(1);
//                 } else {
//                     res.push(0);
//                 }
//             }
//             return res;
//         } else {
//             return variations([0, 1], n, true);
//         }
//     } else {
//         if (bits >= 0) {
//             const bin = Util.bin(n);
//             return bin.padStart(bits, "0");
//         } else {
//             const res: any[] = [];
//             for (let i = 0; i < Math.pow(2, n); i++) {
//                 const bin = Util.bin(i);
//                 bin.padStart(n, "0");
//             }
//             return res;
//         }
//     }
// }

// function variations(seq: any[], n: any, repetition = false) {
//     /* Returns an iterator over the n-sized variations of ``seq`` (size N).
//     ``repetition`` controls whether items in ``seq`` can appear more than once;
//     Examples
//     ========
//     ``variations(seq, n)`` will return `\frac{N!}{(N - n)!}` permutations without
//     repetition of ``seq``'s elements:
//         >>> from sympy import variations
//         >>> list(variations([1, 2], 2))
//         [(1, 2), (2, 1)]
//     ``variations(seq, n, True)`` will return the `N^n` permutations obtained
//     by allowing repetition of elements:
//         >>> list(variations([1, 2], 2, repetition=True))
//         [(1, 1), (1, 2), (2, 1), (2, 2)]
//     If you ask for more items than are in the set you get the empty set unless
//     you allow repetitions:
//         >>> list(variations([0, 1], 3, repetition=False))
//         []
//         >>> list(variations([0, 1], 3, repetition=True))[:4]
//         [(0, 0, 0), (0, 0, 1), (0, 1, 0), (0, 1, 1)]
//     .. seealso::
//        `itertools.permutations <https://docs.python.org/3/library/itertools.html#itertools.permutations>`_,
//        `itertools.product <https://docs.python.org/3/library/itertools.html#itertools.product>`_
//     */
//     if (!repetition) {
//         if (seq.length < n) {
//             return new Iterator([]);
//         }
//         return Util.permutations(seq, n);
//     } else {
//         if (n === 0) {
//             return new Iterator([[]]);
//         } else {
//             return Util.product(n, seq);
//         }
//     }
// }

// function subsets(seq: any[], k: any = undefined, repetition: boolean = false) { // !!! TEST
//     /* Generates all `k`-subsets (combinations) from an `n`-element set, ``seq``.
//     A `k`-subset of an `n`-element set is any subset of length exactly `k`. The
//     number of `k`-subsets of an `n`-element set is given by ``binomial(n, k)``,
//     whereas there are `2^n` subsets all together. If `k` is ``None`` then all
//     `2^n` subsets will be returned from shortest to longest.
//     Examples
//     ========
//     >>> from sympy import subsets
//     ``subsets(seq, k)`` will return the `\frac{n!}{k!(n - k)!}` `k`-subsets (combinations)
//     without repetition, i.e. once an item has been removed, it can no
//     longer be "taken":
//         >>> list(subsets([1, 2], 2))
//         [(1, 2)]
//         >>> list(subsets([1, 2]))
//         [(), (1,), (2,), (1, 2)]
//         >>> list(subsets([1, 2, 3], 2))
//         [(1, 2), (1, 3), (2, 3)]
//     ``subsets(seq, k, repetition=True)`` will return the `\frac{(n - 1 + k)!}{k!(n - 1)!}`
//     combinations *with* repetition:
//         >>> list(subsets([1, 2], 2, repetition=True))
//         [(1, 1), (1, 2), (2, 2)]
//     If you ask for more items than are in the set you get the empty set unless
//     you allow repetitions:
//         >>> list(subsets([0, 1], 3, repetition=False))
//         []
//         >>> list(subsets([0, 1], 3, repetition=True))
//         [(0, 0, 0), (0, 0, 1), (0, 1, 1), (1, 1, 1)]
//     */
//     if (typeof k === "undefined") {
//         if (!repetition) {
//             const arg: any[] = [];
//             for (k = 0; k < seq.length + 1; k++) {
//                 arg.push(Util.combinations(seq, k));
//             }
//             return Util.from_iterable(arg);
//         } else {
//             const arg: any[] = [];
//             for (k = 0; k < seq.length + 1; k++) {
//                 arg.push(Util.combinations_with_replacement(seq, k));
//             }
//             return Util.from_iterable(arg);
//         }
//     } else {
//         if (!repetition) {
//             return Util.combinations(seq, k);
//         } else {
//             return Util.combinations_with_replacement(seq, k);
//         }
//     }
// }

// function* filter_symbols(iterator: any, exclude: any) {
//     /*
//     Only yield elements from `iterator` that do not occur in `exclude`.
//     Parameters
//     ==========
//     iterator : iterable
//         iterator to take elements from
//     exclude : iterable
//         elements to exclude
//     Returns
//     =======
//     iterator : iterator
//         filtered iterator
//     */
//     const temp = new HashSet();
//     temp.addArr(exclude);
//     exclude = temp;
//     for (const s of iterator) {
//         if (!(exclude.has(s))) {
//             yield s;
//         }
//     }
// }

// function* numbered_symbols(prefix: any = "x", cls: any = undefined, start: any = 0, exclude: any = [], ...args: any[]) {
//     /*
//     Generate an infinite stream of Symbols consisting of a prefix and
//     increasing subscripts provided that they do not occur in ``exclude``.
//     Parameters
//     ==========
//     prefix : str, optional
//         The prefix to use. By default, this function will generate symbols of
//         the form "x0", "x1", etc.
//     cls : class, optional
//         The class to use. By default, it uses ``Symbol``, but you can also use ``Wild`` or ``Dummy``.
//     start : int, optional
//         The start number.  By default, it is 0.
//     Returns
//     =======
//     sym : Symbol
//         The subscripted symbols.
//     */
//     const temp = new HashSet();
//     if (exclude) {
//         temp.addArr(exclude);
//     }
//     exclude = temp;
//     if (typeof cls === "undefined") {
//         cls = Symbol;
//     }
//     while (true) {
//         const name = prefix + start;
//         const s = new cls(name, ...args); // !!!
//         if (!(exclude.has(s))) {
//             yield s;
//         }
//         start++;
//     }
// }

export function sift(seq: any[], keyfunc: any, binary: boolean = false) {
    /*
    Sift the sequence, ``seq`` according to ``keyfunc``.
    Returns
    =======
    When ``binary`` is ``False`` (default), the output is a dictionary
    where elements of ``seq`` are stored in a list keyed to the value
    of keyfunc for that element. If ``binary`` is True then a tuple
    with lists ``T`` and ``F`` are returned where ``T`` is a list
    containing elements of seq for which ``keyfunc`` was ``True`` and
    ``F`` containing those elements for which ``keyfunc`` was ``False``;
    a ValueError is raised if the ``keyfunc`` is not binary.
    Examples
    ========
    >>> from sympy.utilities import sift
    >>> from sympy.abc import x, y
    >>> from sympy import sqrt, exp, pi, Tuple
    >>> sift(range(5), lambda x: x % 2)
    {0: [0, 2, 4], 1: [1, 3]}
    sift() returns a defaultdict() object, so any key that has no matches will
    give [].
    >>> sift([x], lambda x: x.is_commutative)
    {True: [x]}
    >>> _[False]
    []
    Sometimes you will not know how many keys you will get:
    >>> sift([sqrt(x), exp(x), (y**x)**2],
    ...      lambda x: x.as_base_exp()[0])
    {E: [exp(x)], x: [sqrt(x)], y: [y**(2*x)]}
    Sometimes you expect the results to be binary; the
    results can be unpacked by setting ``binary`` to True:
    >>> sift(range(4), lambda x: x % 2, binary=True)
    ([1, 3], [0, 2])
    >>> sift(Tuple(1, pi), lambda x: x.is_rational, binary=True)
    ([1], [pi])
    A ValueError is raised if the predicate was not actually binary
    (which is a good test for the logic where sifting is used and
    binary results were expected):
    >>> unknown = exp(1) - pi  # the rationality of this is unknown
    >>> args = Tuple(1, pi, unknown)
    >>> sift(args, lambda x: x.is_rational, binary=True)
    Traceback (most recent call last):
    ...
    ValueError: keyfunc gave non-binary output
    The non-binary sifting shows that there were 3 keys generated:
    >>> set(sift(args, lambda x: x.is_rational).keys())
    {None, False, True}
    If you need to sort the sifted items it might be better to use
    ``ordered`` which can economically apply multiple sort keys
    to a sequence while sorting.
    See Also
    ========
    ordered
    */
    if (!binary) {
        const m = new ArrDefaultDict();
        for (const i of seq) {
            m.get(keyfunc(i)).push(i);
        }
        return m;
    }
    const F: any[] = [];
    const T: any[] = [];
    const sift = [F, T];
    for (const i of seq) {
        try {
            sift[keyfunc(i)].push(i);
        } catch (Error) {
            throw new Error("keyfunc gave non-binary output");
        }
    }
    return [T, F];
}

// function take(iter: any[], n: any) {
//     // "Return ``n`` items from ``iter`` iterator
//     const res = [];
//     const range = new Array(n).fill(0).map((_, idx) => idx);
//     for (const item of Util.zip(range, iter)) {
//         res.push(item[1]);
//     }
//     return res;
// }

// function dict_merge(...dicts: any[]) {
//     const res = new HashDict();
//     for (const d of dicts) {
//         res.merge(d);
//     }
//     return res;
// }

// function common_prefix(...seqs: any[]) {
//     /* Return the subsequence that is a common start of sequences in ``seqs``.
//     >>> from sympy.utilities.iterables import common_prefix
//     >>> common_prefix(list(range(3)))
//     [0, 1, 2]
//     >>> common_prefix(list(range(3)), list(range(4)))
//     [0, 1, 2]
//     >>> common_prefix([1, 2, 3], [1, 2, 5])
//     [1, 2]
//     >>> common_prefix([1, 2, 3], [1, 3, 5])
//     [1]
//     */
//     for (const a of seqs) {
//         if (!a) {
//             return [];
//         }
//     }
//     if (seqs.length === 1) {
//         return seqs[0];
//     }
//     let i = 0;
//     let alltr: boolean;
//     const imax = Math.min(...seqs.map((s: any) => s.length));
//     find: {
//         for (i = 0; i < imax; i++) {
//             alltr = true;
//             Util.range(seqs.length).forEach((j: any) => {
//                 if (seqs[j][i] !== seqs[0][i]) {
//                     alltr = false;
//                 }
//             });
//             if (!alltr) {
//                 break find;
//             }
//         }
//         i++;
//     }
//     return seqs[0].slice(0, i);
// }

// function common_suffix(...seqs: any[]) {
//     /* Return the subsequence that is a common ending of sequences in ``seqs``.
//     >>> from sympy.utilities.iterables import common_suffix
//     >>> common_suffix(list(range(3)))
//     [0, 1, 2]
//     >>> common_suffix(list(range(3)), list(range(4)))
//     []
//     >>> common_suffix([1, 2, 3], [9, 2, 3])
//     [2, 3]
//     >>> common_suffix([1, 2, 3], [9, 7, 3])
//     [3]
//     */
//     for (const a of seqs) {
//         if (!a) {
//             return [];
//         }
//     }
//     if (seqs.length === 1) {
//         return seqs[0];
//     }
//     let i = 0;
//     let alltr: boolean;
//     const imin = -Math.min(...seqs.map((s: any) => s.length)) - 1;
//     find: {
//         for (i = -1; i > imin; i--) {
//             alltr = true;
//             Util.range(seqs.length).forEach((j: any) => {
//                 if (seqs[j][seqs[j].length + i] !== seqs[0][seqs[0].length + i]) {
//                     alltr = false;
//                 }
//             });
//             if (!alltr) {
//                 break find;
//             }
//         }
//         i--;
//     }
//     if (i === -1) {
//         return [];
//     } else {
//         console.log(i);
//         return seqs[0].slice(i + 1);
//     }
// }

// function* prefixes(seq: any[]) {
//     /*
//     Generate all prefixes of a sequence.
//     Examples
//     ========
//     >>> from sympy.utilities.iterables import prefixes
//     >>> list(prefixes([1,2,3,4]))
//     [[1], [1, 2], [1, 2, 3], [1, 2, 3, 4]]
//     */
//     const n = seq.length;

//     for (const i of Util.range(n)) {
//         yield seq.slice(0, i + 1);
//     }
// }

// function* postfixes(seq: any[]) {
//     /*
//     Generate all postfixes of a sequence.
//     Examples
//     ========
//     >>> from sympy.utilities.iterables import postfixes
//     >>> list(postfixes([1,2,3,4]))
//     [[4], [3, 4], [2, 3, 4], [1, 2, 3, 4]]
//     */
//     const n = seq.length;

//     for (const i of Util.range(n)) {
//         yield seq.slice(n - i - 1);
//     }
// }

// function topological_sort(graph: any[], key: any = undefined) { // / !!! to do: debug
//     /*
//     Topological sort of graph's vertices.
//     Parameters
//     ==========
//     graph : tuple[list, list[tuple[T, T]]
//         A tuple consisting of a list of vertices and a list of edges of
//         a graph to be sorted topologically.
//     key : callable[T] (optional)
//         Ordering key for vertices on the same level. By default the natural
//         (e.g. lexicographic) ordering is used (in this case the base type
//         must implement ordering relations).
//     Examples
//     ========
//     Consider a graph::
//         +---+     +---+     +---+
//         | 7 |\    | 5 |     | 3 |
//         +---+ \   +---+     +---+
//           |   _\___/ ____   _/ |
//           |  /  \___/    \ /   |
//           V  V           V V   |
//          +----+         +---+  |
//          | 11 |         | 8 |  |
//          +----+         +---+  |
//           | | \____   ___/ _   |
//           | \      \ /    / \  |
//           V  \     V V   /  V  V
//         +---+ \   +---+ |  +----+
//         | 2 |  |  | 9 | |  | 10 |
//         +---+  |  +---+ |  +----+
//                \________/
//     where vertices are integers. This graph can be encoded using
//     elementary Python's data structures as follows::
//         >>> V = [2, 3, 5, 7, 8, 9, 10, 11]
//         >>> E = [(7, 11), (7, 8), (5, 11), (3, 8), (3, 10),
//         ...      (11, 2), (11, 9), (11, 10), (8, 9)]
//     To compute a topological sort for graph ``(V, E)`` issue::
//         >>> from sympy.utilities.iterables import topological_sort
//         >>> topological_sort((V, E))
//         [3, 5, 7, 8, 11, 2, 9, 10]
//     If specific tie breaking approach is needed, use ``key`` parameter::
//         >>> topological_sort((V, E), key=lambda v: -v)
//         [7, 5, 11, 3, 10, 8, 9, 2]
//     Only acyclic graphs can be sorted. If the input graph has a cycle,
//     then ``ValueError`` will be raised::
//         >>> topological_sort((V, E + [(10, 7)]))
//         Traceback (most recent call last):
//         ...
//         ValueError: cycle detected
//     References
//     ==========
//     .. [1] https://en.wikipedia.org/wiki/Topological_sorting
//     */
//     const [V, E] = graph;
//     const L = [];
//     const S = new HashSet();
//     S.addArr(V);

//     for (const item of E) {
//         if (S.has(item[1])) {
//             S.remove(item[1]);
//         }
//     }

//     if (typeof key === "undefined") {
//         key = (a: any, b: any) => a - b;
//     }

//     S.sort(key, true);

//     while (S.size > 0) {
//         const node = S.pop();
//         L.push(node);
//         for (const item of E) {
//             const u = item[0];
//             const v = item[1];
//             if (u === node) {
//                 const idx = Util.getArrIndex(E, [u, v]);
//                 E.splice(idx, 1);
//                 find: {
//                     for (const elem of E) {
//                         const _u = elem[0];
//                         const _v = elem[1];
//                         // console.log(v, _v)
//                         if (v === _v) {
//                             break find;
//                         }
//                     }
//                     const arr = S.sortedArr;
//                     search: {
//                         for (let i = 0; i < arr.length; i++) {
//                             const s = arr[i];

//                             if (key(v, s) > 0) {
//                                 console.log(i, v);
//                                 S.add([i, v]);
//                                 break search;
//                             }
//                         }
//                         S.add(v);
//                     }
//                 }
//             }
//         }
//     }
//     if (E) {
//         throw "cycle detected";
//     } else {
//         return L;
//     }
// }
