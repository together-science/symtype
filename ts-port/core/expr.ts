/*
Notable changes made (and notes):
- Very barebones versions of Expr implemented so far - very few util methods
*/
import {_Basic, Atom} from "./basic.js";
import {base, mix} from "./utility.js";
import {ManagedProperties} from "./assumptions.js";
import {S} from "./singleton.js";


const Expr = (superclass: any) => class Expr extends mix(base).with(_Basic) { // !!! evalfmixin not yet implemented
    /*
    Base class for algebraic expressions.
    Explanation
    ===========
    Everything that requires arithmetic operations to be defined
    should subclass this class, instead of Basic (which should be
    used only for argument storage and expression manipulation, i.e.
    pattern matching, substitutions, etc).
    If you want to override the comparisons of expressions:
    Should use _eval_is_ge for inequality, or _eval_is_eq, with multiple dispatch.
    _eval_is_ge return true if x >= y, false if x < y, and None if the two types
    are not comparable or the comparison is indeterminate
    See Also
    ========
    sympy.core.basic.Basic
    */

    __slots__: any[] = [];

    static is_scalar = true;

    constructor(...args: any) {
        super(args);
    }

    as_base_exp() {
        return [this, S.One];
    }

    // !!! other stuff not yet implemented
};

// eslint-disable-next-line new-cap
const _Expr = Expr(Object);
ManagedProperties.register(_Expr);

const AtomicExpr = (superclass: any) => class AtomicExpr extends mix(base).with(Atom, Expr) {
    /*
    A parent class for object which are both atoms and Exprs.
    For example: Symbol, Number, Rational, Integer, ...
    But not: Add, Mul, Pow, ...
    */
    static is_number = false;
    static is_Atom = true;

    __slots__: any[] = [];

    _eval_is_polynomial(syms: any) {
        return true;
    }

    _eval_is_rational_function(syms: any) {
        return true;
    }

    eval_is_algebraic_expr(syms: any) {
        return true;
    }

    _eval_nseries(x: any, n: any, logx: any, cdor: any = 0) {
        return this;
    }
};

// eslint-disable-next-line new-cap
const _AtomicExpr = AtomicExpr(Object);
ManagedProperties.register(_AtomicExpr);

export {AtomicExpr, _AtomicExpr, Expr, _Expr};
