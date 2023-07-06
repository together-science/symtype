/*
Notes (by WB):
- nsimplify does not yet support tolerance as a parameter since that requires
  the limit denominator method for rationals. this method relies on a python 
  library which does not exist for javascript and is hard to recreate otherwise,
  so it won't be implemented until necessary. the current implementation is 
  sufficient for the solve algorithm
*/

import {S} from "../core/singleton";
import {Float, Rational, _Number_} from "../core/numbers";
import { Pow } from "../core/power";
import { HashDict } from "../core/utility";

export function nsimplify(expr: any, constants: any[] = [], tolerance: number = undefined, 
    full: boolean = false, rational: boolean = undefined, rational_conversion: string = "base10") {
    /*
    Find a simple representation for a number or, if there are free symbols or
    if ``rational=True``, then replace Floats with their Rational equivalents. If
    no change is made and rational is not False then Floats will at least be
    converted to Rationals.

    Explanation
    ===========

    For numerical expressions, a simple formula that numerically matches the
    given numerical expression is sought (and the input should be possible
    to evalf to a precision of at least 30 digits).

    Optionally, a list of (rationally independent) constants to
    include in the formula may be given.

    A lower tolerance may be set to find less exact matches. If no tolerance
    is given then the least precise value will set the tolerance (e.g. Floats
    default to 15 digits of precision, so would be tolerance=10**-15).

    With ``full=True``, a more extensive search is performed
    (this is useful to find simpler numbers when the tolerance
    is set low).

    When converting to rational, if rational_conversion='base10' (the default), then
    convert floats to rationals using their base-10 (string) representation.
    When rational_conversion='exact' it uses the exact, base-2 representation.

    Examples
    ========

    >>> from sympy import nsimplify, sqrt, GoldenRatio, exp, I, pi
    >>> nsimplify(4/(1+sqrt(5)), [GoldenRatio])
    -2 + 2*GoldenRatio
    >>> nsimplify((1/(exp(3*pi*I/5)+1)))
    1/2 - I*sqrt(sqrt(5)/10 + 1/4)
    >>> nsimplify(I**I, [pi])
    exp(-pi/2)
    >>> nsimplify(pi, tolerance=0.01)
    22/7

    >>> nsimplify(0.333333333333333, rational=True, rational_conversion='exact')
    6004799503160655/18014398509481984
    >>> nsimplify(0.333333333333333, rational=True)
    1/3

    See Also
    ========

    sympy.core.function.nfloat

    */
    if (expr === S.Infinity || expr === S.NegativeInfinity) {
        return expr;
    }
    if (rational || expr.free_symbols().size > 0) {
        return _real_to_rational(expr, tolerance, rational_conversion);
    }
    
    if (typeof tolerance === "undefined") {
        const tol_args: number[] = [15];
        expr.atoms(Float).forEach((e: any) => tol_args.push(e.precision))
        tolerance = 10 ** (-Math.min(...tol_args))
    }

    const prec = 30;
    const bprec = Math.floor(prec * 3.33);

    const constants_dict: Record<any, any> = {};
    for (const constant of constants) {
        const v = constant.eval_evalf(prec); // TODO: REPLACE WITH EVALF
        if (!v.is_Float()) {
            throw new Error("invalid constants")
        }
        // didn't see why I would need the fancy "to_mpmath" function here since we know that
        // v is a Float object, meaning we can always access its decimal object with .decimal
        constants_dict[constant.toString()] = v.decimal; 
    }

    const exprval = expr.eval_evalf(prec)

    return expr;

    // IMPORTANT NOTE: THE REST OF THIS FUNCTION IS NOT IMPLEMENTED BECAUSE:
    // 1. It is not necessary for the linear solve
    // 2. It uses mpmath algorithms with no javascript alternative that would
    //    be difficult to deal with.


}

function _real_to_rational(expr: any, tolerance: any = undefined, rational_conversion: string = "base10") {
    /*
    Replace all reals in expr with rationals.

    Examples
    ========

    >>> from sympy.simplify.simplify import _real_to_rational
    >>> from sympy.abc import x

    >>> _real_to_rational(.76 + .1*x**.5)
    sqrt(x)/10 + 19/25

    If rational_conversion='base10', this uses the base-10 string. If
    rational_conversion='exact', the exact, base-2 representation is used.

    >>> _real_to_rational(0.333333333333333, rational_conversion='exact')
    6004799503160655/18014398509481984
    >>> _real_to_rational(0.333333333333333)
    1/3
    */

    let reduce_num: any = undefined;
    const p = expr;
    let reps: HashDict = new HashDict();

    if (tolerance && tolerance < 1) {
        reduce_num = Math.ceil(1 / tolerance);
    }

    for (let fl of p.atoms(Float)) {
        const key = fl;
        let r;
        let d;
        if (typeof reduce_num !== "undefined") {
            r = new Rational(fl).limit_denominator(reduce_num);
        } else if (typeof tolerance !== "undefined" && tolerance >= 1 && fl.is_Integer() === false) {
            r = new Rational(tolerance * Math.round(fl.__truediv__(_Number_.new(tolerance)))).limit_denominator(Math.floor(tolerance));
        } else {
            if (rational_conversion === "exact") {
                r = new Rational(fl);
                reps.add(key, r);
                continue;
            } else if (rational_conversion !== "base10") {
                throw new Error("rational conversion must be exact or base10");
            }
            r = nsimplify(fl, [], undefined, false, false);
            if (fl && !r) {
                r = new Rational(fl);
            } else if (!r.is_Rational()) {
                if (fl === S.Infinity || fl === S.NegativeInfinity) {
                    r = S.ComplexInfinity;
                } else if (fl.__lt__(S.Zero)) {
                    fl = fl.__neg__()
                    d = new Pow(_Number_.new(10), _Number_.new(Math.floor(Math.log(fl.eval_evalf()) / Math.log(10))));
                    r = new Rational(fl.__truediv__(d)).__neg__().__mul__(d);
                } else if (fl.__gt__(S.Zero)) {
                    d = new Pow(_Number_.new(10), _Number_.new(Math.floor(Math.log(fl.eval_evalf()) / Math.log(10))));
                    const ratarg = fl.__truediv__(d);
                    r = new Rational(ratarg)
                    r = r.__mul__(d);
                } else {
                    r = S.Zero;
                }
            }
        }
        reps.add(key, r);
    }
    return p.subs({"simultaneous": true}, reps);

}