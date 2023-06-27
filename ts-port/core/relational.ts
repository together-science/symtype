/*
Notes and changes (by WB):
- Currently implementing only enough for POW to work well (extremely barebones,
  will port more later when it becomes necessary)
*/

import {fuzzy_bool, fuzzy_and, fuzzy_not} from "./logic";
import {Basic} from "./basic";
import {_Expr} from "./expr";
import {Add} from "./add";
import {Mul} from "./mul";
import {S} from "./singleton";
import {Float} from "./numbers";

function _n2(a: any, b: any) {
    /*
    Return (a - b).evalf(2) if a and b are comparable, else None.
    This should only be used when a and b are already sympified.
    */
    if (a.is_comparable() && b.is_comparable()) {
        // TODO: UPDATE TO USE REAL EVALF
        let diff: any = a.__sub__(b);
        diff = diff.eval_evalf(2);
        if (diff.is_comparable()) {
            return diff
        }
    }
    return undefined;
}

function _eval_is_ge(lhs: any, rhs: any): any {
    return undefined;
}

function _eval_is_eq(lhs: any, rhs: any): any {
    return false;
}

export function is_lt(lhs: any, rhs: any) {
    /*
    Fuzzy bool for lhs is strictly less than rhs.
    See the docstring for :func:`~.is_ge` for more.
    */
    return fuzzy_not(is_ge(lhs, rhs));
}

export function is_gt(lhs: any, rhs: any) {
    /*
    "Fuzzy bool for lhs is strictly greater than rhs.
    See the docstring for :func:`~.is_ge` for more.
    */
    return fuzzy_not(is_le(lhs, rhs))
}

export function is_le(lhs: any, rhs: any) {
    /*
    Fuzzy bool for lhs is less than or equal to rhs.
    See the docstring for :func:`~.is_ge` for more.
    */
    return is_ge(rhs, lhs);
}


export function is_ge(lhs: any, rhs: any) {
    /*
    Fuzzy bool for *lhs* is greater than or equal to *rhs*.

    Parameters
    ==========

    lhs : Expr
        The left-hand side of the expression, must be sympified,
        and an instance of expression. Throws an exception if
        lhs is not an instance of expression.

    rhs : Expr
        The right-hand side of the expression, must be sympified
        and an instance of expression. Throws an exception if
        lhs is not an instance of expression.

    assumptions: Boolean, optional
        Assumptions taken to evaluate the inequality.

    Returns
    =======

    ``True`` if *lhs* is greater than or equal to *rhs*, ``False`` if *lhs*
    is less than *rhs*, and ``None`` if the comparison between *lhs* and
    *rhs* is indeterminate.

    Explanation
    ===========

    This function is intended to give a relatively fast determination and
    deliberately does not attempt slow calculations that might help in
    obtaining a determination of True or False in more difficult cases.

    The four comparison functions ``is_le``, ``is_lt``, ``is_ge``, and ``is_gt`` are
    each implemented in terms of ``is_ge`` in the following way:

    is_ge(x, y) := is_ge(x, y)
    is_le(x, y) := is_ge(y, x)
    is_lt(x, y) := fuzzy_not(is_ge(x, y))
    is_gt(x, y) := fuzzy_not(is_ge(y, x))

    Therefore, supporting new type with this function will ensure behavior for
    other three functions as well.

    To maintain these equivalences in fuzzy logic it is important that in cases where
    either x or y is non-real all comparisons will give None.

    Examples
    ========

    >>> from sympy import S, Q
    >>> from sympy.core.relational import is_ge, is_le, is_gt, is_lt
    >>> from sympy.abc import x
    >>> is_ge(S(2), S(0))
    True
    >>> is_ge(S(0), S(2))
    False
    >>> is_le(S(0), S(2))
    True
    >>> is_gt(S(0), S(2))
    False
    >>> is_lt(S(2), S(0))
    False

    Assumptions can be passed to evaluate the quality which is otherwise
    indeterminate.

    >>> print(is_ge(x, S(0)))
    None
    >>> is_ge(x, S(0), assumptions=Q.positive(x))
    True

    New types can be supported by dispatching to ``_eval_is_ge``.

    >>> from sympy import Expr, sympify
    >>> from sympy.multipledispatch import dispatch
    >>> class MyExpr(Expr):
    ...     def __new__(cls, arg):
    ...         return super().__new__(cls, sympify(arg))
    ...     @property
    ...     def value(self):
    ...         return self.args[0]
    >>> @dispatch(MyExpr, MyExpr)
    ... def _eval_is_ge(a, b):
    ...     return is_ge(a.value, b.value)
    >>> a = MyExpr(1)
    >>> b = MyExpr(2)
    >>> is_ge(b, a)
    True
    >>> is_le(a, b)
    True
    */

    if (!(lhs.is_Expr() && rhs.is_Expr())) {
        throw new Error("can only compare inequalities with Expr")
    }

    const retval = _eval_is_ge(lhs, rhs);

    if (typeof retval !== "undefined") {
        return retval;
    } else {
        let n2 = _n2(lhs, rhs);
        if (typeof n2 !== "undefined") {
            if (n2 === S.Infinity) {
                n2 = Number(n2);
            } else if (n2 === S.NegativeInfinity) {
                n2 = (-1) * Number(n2)
            }
            return n2.__ge__(S.Zero)
        }

        // SKIPPING ASSUMPTIONS WRAPPER FOR NOW

        if (lhs.is_extended_real() && rhs.is_extended_real()) {
            if ((lhs.is_infinite() && lhs.is_extended_positive()) || (rhs.is_infinite() && rhs.is_extended_negative())) {
                return true;
            }
            const diff = new Add(true, true, lhs, new Mul(true, true, rhs, S.NegativeOne));
            if (diff !== S.NaN) {
                const rv = diff.is_extended_nonnegative()
                if (typeof rv !== "undefined") {
                    return rv
                }
            }
        }
    }
}