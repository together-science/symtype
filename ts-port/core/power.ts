
import {ManagedProperties} from "./assumptions";
import {_Expr} from "./expr";
import {Global} from "./global";
import {_Number_} from "./numbers";
import {global_parameters} from "./parameters";
import {S} from "./singleton";

export class Pow extends _Expr {
    /*
    Defines the expression x**y as "x raised to a power y"
    .. deprecated:: 1.7
       Using arguments that aren't subclasses of :class:`~.Expr` in core
       operators (:class:`~.Mul`, :class:`~.Add`, and :class:`~.Pow`) is
       deprecated. See :ref:`non-expr-args-deprecated` for details.
    Singleton definitions involving (0, 1, -1, oo, -oo, I, -I):
    +--------------+---------+-----------------------------------------------+
    | expr         | value   | reason                                        |
    +==============+=========+===============================================+
    | z**0         | 1       | Although arguments over 0**0 exist, see [2].  |
    +--------------+---------+-----------------------------------------------+
    | z**1         | z       |                                               |
    +--------------+---------+-----------------------------------------------+
    | (-oo)**(-1)  | 0       |                                               |
    +--------------+---------+-----------------------------------------------+
    | (-1)**-1     | -1      |                                               |
    +--------------+---------+-----------------------------------------------+
    | S.Zero**-1   | zoo     | This is not strictly true, as 0**-1 may be    |
    |              |         | undefined, but is convenient in some contexts |
    |              |         | where the base is assumed to be positive.     |
    +--------------+---------+-----------------------------------------------+
    | 1**-1        | 1       |                                               |
    +--------------+---------+-----------------------------------------------+
    | oo**-1       | 0       |                                               |
    +--------------+---------+-----------------------------------------------+
    | 0**oo        | 0       | Because for all complex numbers z near        |
    |              |         | 0, z**oo -> 0.                                |
    +--------------+---------+-----------------------------------------------+
    | 0**-oo       | zoo     | This is not strictly true, as 0**oo may be    |
    |              |         | oscillating between positive and negative     |
    |              |         | values or rotating in the complex plane.      |
    |              |         | It is convenient, however, when the base      |
    |              |         | is positive.                                  |
    +--------------+---------+-----------------------------------------------+
    | 1**oo        | nan     | Because there are various cases where         |
    | 1**-oo       |         | lim(x(t),t)=1, lim(y(t),t)=oo (or -oo),       |
    |              |         | but lim( x(t)**y(t), t) != 1.  See [3].       |
    +--------------+---------+-----------------------------------------------+
    | b**zoo       | nan     | Because b**z has no limit as z -> zoo         |
    +--------------+---------+-----------------------------------------------+
    | (-1)**oo     | nan     | Because of oscillations in the limit.         |
    | (-1)**(-oo)  |         |                                               |
    +--------------+---------+-----------------------------------------------+
    | oo**oo       | oo      |                                               |
    +--------------+---------+-----------------------------------------------+
    | oo**-oo      | 0       |                                               |
    +--------------+---------+-----------------------------------------------+
    | (-oo)**oo    | nan     |                                               |
    | (-oo)**-oo   |         |                                               |
    +--------------+---------+-----------------------------------------------+
    | oo**I        | nan     | oo**e could probably be best thought of as    |
    | (-oo)**I     |         | the limit of x**e for real x as x tends to    |
    |              |         | oo. If e is I, then the limit does not exist  |
    |              |         | and nan is used to indicate that.             |
    +--------------+---------+-----------------------------------------------+
    | oo**(1+I)    | zoo     | If the real part of e is positive, then the   |
    | (-oo)**(1+I) |         | limit of abs(x**e) is oo. So the limit value  |
    |              |         | is zoo.                                       |
    +--------------+---------+-----------------------------------------------+
    | oo**(-1+I)   | 0       | If the real part of e is negative, then the   |
    | -oo**(-1+I)  |         | limit is 0.                                   |
    +--------------+---------+-----------------------------------------------+
    Because symbolic computations are more flexible than floating point
    calculations and we prefer to never return an incorrect answer,
    we choose not to conform to all IEEE 754 conventions.  This helps
    us avoid extra test-case code in the calculation of limits.
    See Also
    ========
    sympy.core.numbers.Infinity
    sympy.core.numbers.NegativeInfinity
    sympy.core.numbers.NaN
    References
    ==========
    .. [1] https://en.wikipedia.org/wiki/Exponentiation
    .. [2] https://en.wikipedia.org/wiki/Exponentiation#Zero_to_the_power_of_zero
    .. [3] https://en.wikipedia.org/wiki/Indeterminate_forms
    */
    static is_Pow = true;
    __slots__ = ["is_commutative"];

    // to-do: needs support for e^x
    constructor(b: any, e: any, evaluate: boolean = undefined, simplify: boolean = true) {
        super(b, e);
        this._args = [b, e];
        if (typeof evaluate === "undefined") {
            evaluate = global_parameters.evaluate;
        }
        if (simplify) {
            if (evaluate) {
                if (e === S.ComplexInfinity) {
                    return S.NaN;
                }
                if (e === S.Infinity) {
                    // this part is not fully done
                    // should be updated to use relational
                    if (b.is_positive()) {
                        return S.Infinity;
                    } else if (b.is_zero()) {
                        return S.Zero;
                    } else {
                        if (b.is_finite()) {
                            return S.ComplexInfinity;
                        } else {
                            return S.NaN;
                        }
                    }
                }
                if (e === S.Zero) {
                    return S.One;
                } else if (e === S.One) {
                    return b;
                } else if (e === S.NegativeOne && !b) {
                    return S.ComplexInfinity;
                } else if ((e.is_Symbol() && e.is_integer() ||
                    e.is_Integer() && (b.is_Number() &&
                    b.is_Mul() || b.is_Number())) && (e.is_extended_negative === true)) {
                    if (e.is_even() || e.is_even()) {
                        b = b.__mul__(S.NegativeOne);
                    } else {
                        return new Pow(b.__mul__(S.NegativeOne), e).__mul__(S.NegativeOne);
                    }
                }
                0.
                if (b === S.NaN || e === S.NaN) {
                    return S.NaN;
                } else if (b === S.One) {
                    if (e.is_infinite()) {
                        return S.NaN;
                    }
                    return S.One;
                } else if (e.is_Number() && b.is_Number()) {
                    // base E stuff not yet implemented
                    const obj = b._eval_power(e);
                    if (typeof obj !== "undefined") {
                        obj.is_commutative = () => (b.is_commutative() && e.is_commutative());
                        return obj;
                    }
                }
            }
        }
        this.is_commutative = () => (b.is_commutative() && e.is_commutative());
    }

    as_base_exp() {
        const b = this._args[0];
        const e = this._args[1];
        if (b.is_Rational && b.p === 1 && b.q !== 1) {
            const p1 = _Number_.new(b.q);
            const p2 = e.__mul__(S.NegativeOne);
            return [p1, p2];
        }
        return [b, e];
    }

    static _new(b: any, e: any) {
        return new Pow(b, e);
    }

    // WB addition for jasmine tests
    toString() {
        const b = this._args[0].toString();
        const e = this._args[1].toString();
        return b + "^" + e;
    }
}

ManagedProperties.register(Pow);
Global.register("Pow", Pow._new);

// implemented different than sympy, but has same functionality (for now)
export function nroot(y: number, n: number) {
    const x = Math.floor(y ** (1 / n));
    return [x, x**n === y];
}
