/*
Notes and changes (by WB):
- AssumptionsWrapper and the Assumptions parameter are not needed in symtype
  since this is used to merge Sympy's new and old assumptions, whereas symtype
  has a consistent syntax for its assumptions
    - If you want to do a relational with assumptions, apply assumptions to the
      objects first and then do the relational
- Multiple dispatch is currently not implemented. TODO: find an alternative
- Boolean and BooleanAtom sympy classes are not accounted for in is_eq
- Typescript constructors may not return booleans, so a static new method is
  implemented for relational classes

*/

import {fuzzy_bool, fuzzy_and, fuzzy_not, fuzzy_xor} from "./logic";
import {Basic} from "./basic";
import {_Expr} from "./expr";
import {_Boolean} from "./boolalg";
import {Add} from "./add";
import {Mul} from "./mul";
import {S} from "./singleton";
import {Float} from "./numbers";
import {_AssocOp} from "./operations";
import {HashDict} from "./utility";
import { global_parameters } from "./parameters";

class Relational extends _Boolean {
    /*
    Base class for all relation types.

    Explanation
    ===========

    Subclasses of Relational should generally be instantiated directly, but
    Relational can be instantiated with a valid ``rop`` value to dispatch to
    the appropriate subclass.

    Parameters
    ==========

    rop : str or None
        Indicates what subclass to instantiate.  Valid values can be found
        in the keys of Relational.ValidRelationOperator.

    Examples
    ========

    >>> from sympy import Rel
    >>> from sympy.abc import x, y
    >>> Rel(y, x + x**2, '==')
    Eq(y, x**2 + x)

    A relation's type can be defined upon creation using ``rop``.
    The relation type of an existing expression can be obtained
    using its ``rel_op`` property.
    Here is a table of all the relation types, along with their
    ``rop`` and ``rel_op`` values:

    +---------------------+----------------------------+------------+
    |Relation             |``rop``                     |``rel_op``  |
    +=====================+============================+============+
    |``Equality``         |``==`` or ``eq`` or ``None``|``==``      |
    +---------------------+----------------------------+------------+
    |``Unequality``       |``!=`` or ``ne``            |``!=``      |
    +---------------------+----------------------------+------------+
    |``GreaterThan``      |``>=`` or ``ge``            |``>=``      |
    +---------------------+----------------------------+------------+
    |``LessThan``         |``<=`` or ``le``            |``<=``      |
    +---------------------+----------------------------+------------+
    |``StrictGreaterThan``|``>`` or ``gt``             |``>``       |
    +---------------------+----------------------------+------------+
    |``StrictLessThan``   |``<`` or ``lt``             |``<``       |
    +---------------------+----------------------------+------------+

    For example, setting ``rop`` to ``==`` produces an
    ``Equality`` relation, ``Eq()``.
    So does setting ``rop`` to ``eq``, or leaving ``rop`` unspecified.
    That is, the first three ``Rel()`` below all produce the same result.
    Using a ``rop`` from a different row in the table produces a
    different relation type.
    For example, the fourth ``Rel()`` below using ``lt`` for ``rop``
    produces a ``StrictLessThan`` inequality:

    >>> from sympy import Rel
    >>> from sympy.abc import x, y
    >>> Rel(y, x + x**2, '==')
        Eq(y, x**2 + x)
    >>> Rel(y, x + x**2, 'eq')
        Eq(y, x**2 + x)
    >>> Rel(y, x + x**2)
        Eq(y, x**2 + x)
    >>> Rel(y, x + x**2, 'lt')
        y < x**2 + x

    To obtain the relation type of an existing expression,
    get its ``rel_op`` property.
    For example, ``rel_op`` is ``==`` for the ``Equality`` relation above,
    and ``<`` for the strict less than inequality above:

    >>> from sympy import Rel
    >>> from sympy.abc import x, y
    >>> my_equality = Rel(y, x + x**2, '==')
    >>> my_equality.rel_op
        '=='
    >>> my_inequality = Rel(y, x + x**2, 'lt')
    >>> my_inequality.rel_op
        '<'
    */

    static ValidRelationOperator: HashDict = new HashDict();

    constructor(lhs: any, rhs: any, rop: any = undefined) {
        super(lhs, rhs);
        let cls: any = this.constructor;
        if (cls.name === "Relational") {
            cls = Relational.ValidRelationOperator.get(rop);
            if (typeof cls === "undefined") {
                throw new Error("invalid operator for rel")
            }
            // TODO: BOOLEAN STUFF (WITH CLASS)
            if (cls.name !== "Eq" && cls.name !== "Ne")
                if (typeof lhs === "boolean" || typeof rhs === "boolean") {
                    throw new Error("bool arg can only be used for eq and ne")
                }
            return cls.new(lhs, rhs);
        }
    }

}

class Equality extends Relational {
    /*
    An equal relation between two objects.

    Explanation
    ===========

    Represents that two objects are equal.  If they can be easily shown
    to be definitively equal (or unequal), this will reduce to True (or
    False).  Otherwise, the relation is maintained as an unevaluated
    Equality object.  Use the ``simplify`` function on this object for
    more nontrivial evaluation of the equality relation.

    As usual, the keyword argument ``evaluate=False`` can be used to
    prevent any evaluation.

    Examples
    ========

    >>> from sympy import Eq, simplify, exp, cos
    >>> from sympy.abc import x, y
    >>> Eq(y, x + x**2)
    Eq(y, x**2 + x)
    >>> Eq(2, 5)
    False
    >>> Eq(2, 5, evaluate=False)
    Eq(2, 5)
    >>> _.doit()
    False
    >>> Eq(exp(x), exp(x).rewrite(cos))
    Eq(exp(x), sinh(x) + cosh(x))
    >>> simplify(_)
    True

    See Also
    ========

    sympy.logic.boolalg.Equivalent : for representing equality between two
        boolean expressions

    Notes
    =====

    Python treats 1 and True (and 0 and False) as being equal; SymPy
    does not. And integer will always compare as unequal to a Boolean:

    >>> Eq(True, 1), True == 1
    (False, True)

    This class is not the same as the == operator.  The == operator tests
    for exact structural equality between two expressions; this class
    compares expressions mathematically.

    If either object defines an ``_eval_Eq`` method, it can be used in place of
    the default algorithm.  If ``lhs._eval_Eq(rhs)`` or ``rhs._eval_Eq(lhs)``
    returns anything other than None, that return value will be substituted for
    the Equality.  If None is returned by ``_eval_Eq``, an Equality object will
    be created as usual.

    Since this object is already an expression, it does not respond to
    the method ``as_expr`` if one tries to create `x - y` from ``Eq(x, y)``.
    This can be done with the ``rewrite(Add)`` method.

    .. deprecated:: 1.5

       ``Eq(expr)`` with a single argument is a shorthand for ``Eq(expr, 0)``,
       but this behavior is deprecated and will be removed in a future version
       of SymPy.
    */

    static new(lhs: any, rhs: any, evaluate: boolean = undefined) {
        if (typeof evaluate === "undefined") {
            evaluate = global_parameters.evaluate;
        }
        if (evaluate) {
            const val = is_eq(lhs, rhs);
            if (typeof val === "undefined") {
                // return an Eq object if we can't process the args
                return new Eq(lhs, rhs);
            } else {
                // otherwise return our value
                return val;
            }
        }
    }

    toString() {
        return this._args[0].toString() + " == " + this._args[1].toString()
    }
}

export const Eq = Equality;

class Unequality extends Relational {
    /*
    An unequal relation between two objects.

    Explanation
    ===========

    Represents that two objects are not equal.  If they can be shown to be
    definitively equal, this will reduce to False; if definitively unequal,
    this will reduce to True.  Otherwise, the relation is maintained as an
    Unequality object.

    Examples
    ========

    >>> from sympy import Ne
    >>> from sympy.abc import x, y
    >>> Ne(y, x+x**2)
    Ne(y, x**2 + x)

    See Also
    ========
    Equality

    Notes
    =====
    This class is not the same as the != operator.  The != operator tests
    for exact structural equality between two expressions; this class
    compares expressions mathematically.

    This class is effectively the inverse of Equality.  As such, it uses the
    same algorithms, including any available `_eval_Eq` methods.
    */

    static new(lhs: any, rhs: any, evaluate: boolean = undefined) {
        if (typeof evaluate === "undefined") {
            evaluate = global_parameters.evaluate;
        }
        if (evaluate) {
            const val = is_neq(lhs, rhs);
            if (typeof val === "undefined") {
                // return an Eq object if we can't process the args
                return new Ne(lhs, rhs);
            } else {
                // otherwise return our value
                return val;
            }
        }
    }

    toString() {
        return this._args[0].toString() + " != " + this._args[1].toString()
    }
}

export const Ne = Unequality;

class Inequality extends Relational {
    /*
    Internal subclass for greater than, less than, greater than or equal to,
    and less than or equal to.
    Each subclass most implement _eval_relation to provide the method of comparing
    */

    static new(cls: any, lhs: any, rhs: any, evaluate: boolean = undefined) {
        if (typeof evaluate === "undefined") {
            evaluate = global_parameters.evaluate;
        }
        if (evaluate) {
            for (const side of [lhs, rhs]) {
                if (side.is_extended_real() === false || side === S.NaN) {
                    throw new Error("invalid comparison")
                }
            }
            return Inequality._eval_relation(cls, lhs, rhs);
        }
        return new Relational(lhs, rhs, evaluate);
    }

    static _eval_relation(cls: any, lhs: any, rhs: any) {
        const val = cls._eval_fuzzy_relation(lhs, rhs);
        if (typeof val === "undefined") {
            return new cls(lhs, rhs);
        } else {
            return val;
        }
    }
}

class GreaterThan extends Relational {
    /*
    Class representations of inequalities.

    Explanation
    ===========

    The ``*Than`` classes represent inequal relationships, where the left-hand
    side is generally bigger or smaller than the right-hand side.  For example,
    the GreaterThan class represents an inequal relationship where the
    left-hand side is at least as big as the right side, if not bigger.  In
    mathematical notation:

    lhs $\ge$ rhs

    In total, there are four ``*Than`` classes, to represent the four
    inequalities:

    +-----------------+--------+
    |Class Name       | Symbol |
    +=================+========+
    |GreaterThan      | ``>=`` |
    +-----------------+--------+
    |LessThan         | ``<=`` |
    +-----------------+--------+
    |StrictGreaterThan| ``>``  |
    +-----------------+--------+
    |StrictLessThan   | ``<``  |
    +-----------------+--------+

    All classes take two arguments, lhs and rhs.

    +----------------------------+-----------------+
    |Signature Example           | Math Equivalent |
    +============================+=================+
    |GreaterThan(lhs, rhs)       |   lhs $\ge$ rhs |
    +----------------------------+-----------------+
    |LessThan(lhs, rhs)          |   lhs $\le$ rhs |
    +----------------------------+-----------------+
    |StrictGreaterThan(lhs, rhs) |   lhs $>$ rhs   |
    +----------------------------+-----------------+
    |StrictLessThan(lhs, rhs)    |   lhs $<$ rhs   |
    +----------------------------+-----------------+

    In addition to the normal .lhs and .rhs of Relations, ``*Than`` inequality
    objects also have the .lts and .gts properties, which represent the "less
    than side" and "greater than side" of the operator.  Use of .lts and .gts
    in an algorithm rather than .lhs and .rhs as an assumption of inequality
    direction will make more explicit the intent of a certain section of code,
    and will make it similarly more robust to client code changes:

    >>> from sympy import GreaterThan, StrictGreaterThan
    >>> from sympy import LessThan, StrictLessThan
    >>> from sympy import And, Ge, Gt, Le, Lt, Rel, S
    >>> from sympy.abc import x, y, z
    >>> from sympy.core.relational import Relational

    >>> e = GreaterThan(x, 1)
    >>> e
    x >= 1
    >>> '%s >= %s is the same as %s <= %s' % (e.gts, e.lts, e.lts, e.gts)
    'x >= 1 is the same as 1 <= x'

    Examples
    ========

    One generally does not instantiate these classes directly, but uses various
    convenience methods:

    >>> for f in [Ge, Gt, Le, Lt]:  # convenience wrappers
    ...     print(f(x, 2))
    x >= 2
    x > 2
    x <= 2
    x < 2

    Another option is to use the Python inequality operators (``>=``, ``>``,
    ``<=``, ``<``) directly.  Their main advantage over the ``Ge``, ``Gt``,
    ``Le``, and ``Lt`` counterparts, is that one can write a more
    "mathematical looking" statement rather than littering the math with
    oddball function calls.  However there are certain (minor) caveats of
    which to be aware (search for 'gotcha', below).

    >>> x >= 2
    x >= 2
    >>> _ == Ge(x, 2)
    True

    However, it is also perfectly valid to instantiate a ``*Than`` class less
    succinctly and less conveniently:

    >>> Rel(x, 1, ">")
    x > 1
    >>> Relational(x, 1, ">")
    x > 1

    >>> StrictGreaterThan(x, 1)
    x > 1
    >>> GreaterThan(x, 1)
    x >= 1
    >>> LessThan(x, 1)
    x <= 1
    >>> StrictLessThan(x, 1)
    x < 1

    Notes
    =====

    There are a couple of "gotchas" to be aware of when using Python's
    operators.

    The first is that what your write is not always what you get:

        >>> 1 < x
        x > 1

        Due to the order that Python parses a statement, it may
        not immediately find two objects comparable.  When ``1 < x``
        is evaluated, Python recognizes that the number 1 is a native
        number and that x is *not*.  Because a native Python number does
        not know how to compare itself with a SymPy object
        Python will try the reflective operation, ``x > 1`` and that is the
        form that gets evaluated, hence returned.

        If the order of the statement is important (for visual output to
        the console, perhaps), one can work around this annoyance in a
        couple ways:

        (1) "sympify" the literal before comparison

        >>> S(1) < x
        1 < x

        (2) use one of the wrappers or less succinct methods described
        above

        >>> Lt(1, x)
        1 < x
        >>> Relational(1, x, "<")
        1 < x

    The second gotcha involves writing equality tests between relationals
    when one or both sides of the test involve a literal relational:

        >>> e = x < 1; e
        x < 1
        >>> e == e  # neither side is a literal
        True
        >>> e == x < 1  # expecting True, too
        False
        >>> e != x < 1  # expecting False
        x < 1
        >>> x < 1 != x < 1  # expecting False or the same thing as before
        Traceback (most recent call last):
        ...
        TypeError: cannot determine truth value of Relational

        The solution for this case is to wrap literal relationals in
        parentheses:

        >>> e == (x < 1)
        True
        >>> e != (x < 1)
        False
        >>> (x < 1) != (x < 1)
        False

    The third gotcha involves chained inequalities not involving
    ``==`` or ``!=``. Occasionally, one may be tempted to write:

        >>> e = x < y < z
        Traceback (most recent call last):
        ...
        TypeError: symbolic boolean expression has no truth value.

        Due to an implementation detail or decision of Python [1]_,
        there is no way for SymPy to create a chained inequality with
        that syntax so one must use And:

        >>> e = And(x < y, y < z)
        >>> type( e )
        And
        >>> e
        (x < y) & (y < z)

        Although this can also be done with the '&' operator, it cannot
        be done with the 'and' operarator:

        >>> (x < y) & (y < z)
        (x < y) & (y < z)
        >>> (x < y) and (y < z)
        Traceback (most recent call last):
        ...
        TypeError: cannot determine truth value of Relational

    .. [1] This implementation detail is that Python provides no reliable
       method to determine that a chained inequality is being built.
       Chained comparison operators are evaluated pairwise, using "and"
       logic (see
       http://docs.python.org/reference/expressions.html#not-in). This
       is done in an efficient way, so that each object being compared
       is only evaluated once and the comparison can short-circuit. For
       example, ``1 > 2 > 3`` is evaluated by Python as ``(1 > 2) and (2
       > 3)``. The ``and`` operator coerces each side into a bool,
       returning the object itself when it short-circuits. The bool of
       the --Than operators will raise TypeError on purpose, because
       SymPy cannot determine the mathematical ordering of symbolic
       expressions. Thus, if we were to compute ``x > y > z``, with
       ``x``, ``y``, and ``z`` being Symbols, Python converts the
       statement (roughly) into these steps:

        (1) x > y > z
        (2) (x > y) and (y > z)
        (3) (GreaterThanObject) and (y > z)
        (4) (GreaterThanObject.__bool__()) and (y > z)
        (5) TypeError

       Because of the ``and`` added at step 2, the statement gets turned into a
       weak ternary statement, and the first object's ``__bool__`` method will
       raise TypeError.  Thus, creating a chained inequality is not possible.

           In Python, there is no way to override the ``and`` operator, or to
           control how it short circuits, so it is impossible to make something
           like ``x > y > z`` work.  There was a PEP to change this,
           :pep:`335`, but it was officially closed in March, 2012.
    */

    static new(lhs: any, rhs: any, evaluate: boolean = undefined) {
        return Inequality.new(GreaterThan, lhs, rhs, evaluate);
    }


    static _eval_fuzzy_relation(lhs: any, rhs: any) {
        return is_ge(lhs, rhs);
    }

    toString() {
        return this._args[0].toString() + " >= " + this._args[1].toString()
    }
    
}

export const Ge = GreaterThan;

class LessThan extends Relational {

    static new(lhs: any, rhs: any, evaluate: boolean = undefined) {
        return Inequality.new(LessThan, lhs, rhs, evaluate);
    }

    static _eval_fuzzy_relation(lhs: any, rhs: any) {
        return is_le(lhs, rhs);
    }

    toString() {
        return this._args[0].toString() + " <= " + this._args[1].toString()
    }
    
}

export const Le = LessThan;

class StrictGreaterThan extends Relational {

    static new(lhs: any, rhs: any, evaluate: boolean = undefined) {
        return Inequality.new(StrictGreaterThan, lhs, rhs, evaluate);
    }

    static _eval_fuzzy_relation(lhs: any, rhs: any) {
        return is_gt(lhs, rhs);
    }

    toString() {
        return this._args[0].toString() + " > " + this._args[1].toString()
    }
    
}

export const Gt = StrictGreaterThan;

class StrictLessThan extends Relational {

    static new(lhs: any, rhs: any, evaluate: boolean = undefined) {
        return Inequality.new(StrictLessThan, lhs, rhs, evaluate);
    }

    static _eval_fuzzy_relation(lhs: any, rhs: any) {
        return is_lt(lhs, rhs);
    }

    toString() {
        return this._args[0].toString() + " < " + this._args[1].toString()
    }
    
}

export const Lt = StrictLessThan;

Relational.ValidRelationOperator = new HashDict({
    None: Equality,
    "==": Equality,
    "eq": Equality,
    "!=": Unequality,
    "<>": Unequality,
    "ne": Unequality,
    ">=": GreaterThan,
    "ge": GreaterThan,
    "<=": LessThan,
    "le": LessThan,
    ">": StrictGreaterThan,
    "gt": StrictGreaterThan,
    "<": StrictLessThan,
    "lt": StrictLessThan,
});

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

    let n2 = _n2(lhs, rhs);
    if (typeof n2 !== "undefined") {
        if (n2 === S.Infinity) {
            n2 = Number(n2);
        } else if (n2 === S.NegativeInfinity) {
            n2 = (-1) * Number(n2)
        }
        return n2.__ge__(S.Zero)
    }

    // assumptions wrapper not needed (see header)

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

function is_neq(lhs: any, rhs: any): any {
    /*
    Fuzzy bool for lhs does not equal rhs.

    See the docstring for :func:`~.is_eq` for more.
    */
    return fuzzy_not(is_eq(lhs, rhs))
}

function is_eq(lhs: any, rhs: any): any {
    /*
    Fuzzy bool representing mathematical equality between *lhs* and *rhs*.

    Parameters
    ==========

    lhs : Expr
        The left-hand side of the expression, must be sympified.

    rhs : Expr
        The right-hand side of the expression, must be sympified.

    assumptions: Boolean, optional
        Assumptions taken to evaluate the equality.

    Returns
    =======

    ``True`` if *lhs* is equal to *rhs*, ``False`` is *lhs* is not equal to *rhs*,
    and ``None`` if the comparison between *lhs* and *rhs* is indeterminate.

    Explanation
    ===========

    This function is intended to give a relatively fast determination and
    deliberately does not attempt slow calculations that might help in
    obtaining a determination of True or False in more difficult cases.

    :func:`~.is_neq` calls this function to return its value, so supporting
    new type with this function will ensure correct behavior for ``is_neq``
    as well.

    Examples
    ========

    >>> from sympy import Q, S
    >>> from sympy.core.relational import is_eq, is_neq
    >>> from sympy.abc import x
    >>> is_eq(S(0), S(0))
    True
    >>> is_neq(S(0), S(0))
    False
    >>> is_eq(S(0), S(2))
    False
    >>> is_neq(S(0), S(2))
    True

    Assumptions can be passed to evaluate the equality which is otherwise
    indeterminate.

    >>> print(is_eq(x, S(0)))
    None
    >>> is_eq(x, S(0), assumptions=Q.zero(x))
    True

    New types can be supported by dispatching to ``_eval_is_eq``.

    >>> from sympy import Basic, sympify
    >>> from sympy.multipledispatch import dispatch
    >>> class MyBasic(Basic):
    ...     def __new__(cls, arg):
    ...         return Basic.__new__(cls, sympify(arg))
    ...     @property
    ...     def value(self):
    ...         return self.args[0]
    ...
    >>> @dispatch(MyBasic, MyBasic)
    ... def _eval_is_eq(a, b):
    ...     return is_eq(a.value, b.value)
    ...
    >>> a = MyBasic(1)
    >>> b = MyBasic(1)
    >>> is_eq(a, b)
    True
    >>> is_neq(a, b)
    False
    */

    // skipping dispatch stuff for now cuz its confusing

    if (lhs === rhs) {
        return true;
    }

    if (lhs.is_infinite() || rhs.is_infinite()) {
        if (fuzzy_xor([lhs.is_infinite(), rhs.is_infinite()])) {
            return false;
        }
        if (fuzzy_xor([lhs.is_extended_real(), rhs.is_extended_real()])) {
            return false;
        }
        if (fuzzy_and([lhs.is_extended_real(), rhs.is_extended_real()])) {
            return fuzzy_xor([lhs.is_extended_positive(), fuzzy_not(rhs.is_extended_positive())]);
        }


        // complex numbers not yet supported
    }

    if (lhs.is_Expr() && rhs.is_Expr()) {
        const dif = lhs.__sub__(rhs);
        const z = dif.is_zero();
        if (typeof z !== "undefined") {
            if (!z && dif.is_commutative()) {
                return false;
            }
            if (z) {
                return true;
            }
        }

        const n2 = _n2(lhs, rhs);
        if (typeof n2 !== "undefined") {
            return n2 === S.Zero;
        }

        const [n, d] = dif.as_numer_denom();

        let rv: any = undefined;
        if (n.is_zero()) {
            rv = d.is_nonzero();
        } else if (n.is_finite()) {
            if (d.is_finite()) {
                rv = true;
            } else if (n.is_zero === false) {
                rv = d.is_infinite();
                if (typeof rv === "undefined") {
                    throw new Error("clear coefficients not yet implemented in symtype");
                }
            }
        } else if (_AssocOp.make_args(Add, n).some((a: any) => a.is_infinite())) {
            rv = false;
        }
        if (typeof rv !== "undefined") {
            return rv;
        }
    }
}