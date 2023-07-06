/*
Notes (WB)
- Fraction is fully implemented with the exception of the exact parameter, which
  is unncessary for solve capability and requires a lot more stuff to be ported
*/

import { Mul } from "../core/mul";
import { _Number_ } from "../core/numbers";
import { _AssocOp } from "../core/operations";
import { Pow } from "../core/power";
import { S } from "../core/singleton";

function fraction(expr: any) {
    /*
    Returns a pair with expression's numerator and denominator.
    If the given expression is not a fraction then this function
    will return the tuple (expr, 1).

    This function will not make any attempt to simplify nested
    fractions or to do any term rewriting at all.

    If only one of the numerator/denominator pair is needed then
    use numer(expr) or denom(expr) functions respectively.

    >>> from sympy import fraction, Rational, Symbol
    >>> from sympy.abc import x, y

    >>> fraction(x/y)
    (x, y)
    >>> fraction(x)
    (x, 1)

    >>> fraction(1/y**2)
    (1, y**2)

    >>> fraction(x*y/2)
    (x*y, 2)
    >>> fraction(Rational(1, 2))
    (1, 2)

    This function will also work fine with assumptions:

    >>> k = Symbol('k', negative=True)
    >>> fraction(x * y**k)
    (x, y**(-k))

    If we know nothing about sign of some exponent and ``exact``
    flag is unset, then structure this exponent's structure will
    be analyzed and pretty fraction will be returned:

    >>> from sympy import exp, Mul
    >>> fraction(2*x**(-y))
    (2, x**y)

    >>> fraction(exp(-x))
    (1, exp(x))

    >>> fraction(exp(-x), exact=True)
    (exp(-x), 1)

    The ``exact`` flag will also keep any unevaluated Muls from
    being evaluated:

    >>> u = Mul(2, x + 1, evaluate=False)
    >>> fraction(u)
    (2*x + 2, 1)
    >>> fraction(u, exact=True)
    (2*(x  + 1), 1)
    */

    const [numer, denom]: any[] = [[], []];
    for (const term of _AssocOp.make_args(Mul, expr)) {
        if (term.is_commutative() && term.is_Pow()) {
            const [b, ex] = term.as_base_exp();
            if (ex.is_negative()) {
                if (ex === S.NegativeOne) {
                    denom.push(b);
                }
                // skipping exact part (TODO: add this)
                else {
                    denom.append(new Pow(b, ex.__neg__()))
                }
            } else if (ex.is_positive()) {
                numer.push(term);
            } else if (ex.is_Mul()) {
                const [n, d] = term.as_numer_denom();
                if (n !== S.One) {
                    numer.push(n)
                }
                denom.push(n);
            } else {
                numer.push(term);
            }
        } else if (term.is_Rational() && !term.is_Integer()) {
            if (term.p !== 1) {
                numer.push(_Number_.new(term.p));
            }
            denom.push(_Number_.new(term.q));
        } else {
            numer.push(term);
        }
    }
    return [new Mul(true, true, ...numer), new Mul(true, true, ...denom)];
}

export function denom(expr: any) {
    return fraction(expr)[1];
}