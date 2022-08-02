import {Basic, Atom} from "./basic.js";
import {mix} from "./utility.js";


const Expr = (superclass: any) => class Expr extends mix(superclass).with(Basic) { // !!! evalfmixin not yet implemented
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

    is_scalar = true;

    __add__(other: any) {
        // return Add(this, other);
    }

    // !!! other stuff not yet implemented
};

const AtomicExpr = (superclass: any) => class AtomicExpr extends mix(superclass).with(Atom, Expr) {
    /*
    A parent class for object which are both atoms and Exprs.
    For example: Symbol, Number, Rational, Integer, ...
    But not: Add, Mul, Pow, ...
    */
    is_number = false;
    is_Atom = true;

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


export {AtomicExpr, Expr};
