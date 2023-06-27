/*
Notable changes made (and notes):
- Very barebones versions of Expr implemented so far - very few util methods
- Note that expression uses global.ts to construct add and mul objects, which
  avoids cyclical imports
*/

import {_Basic, Atom} from "./basic";
import {HashSet, mix} from "./utility";
import {ManagedProperties} from "./assumptions";
import {S} from "./singleton";
import {Global} from "./global";
import {as_int} from "../utilities/misc";


const Expr = (superclass: any) => class Expr extends mix(superclass).with(_Basic) {
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
    static is_Expr = true;

    constructor(...args: any) {
        super(...args);
    }

    as_base_exp() {
        return [this, S.One];
    }

    as_coeff_Mul(rational: boolean = false) {
        return [S.One, this];
    }

    as_coeff_Add() {
        return [S.Zero, this];
    }

    __add__(other: any) {
        return Global.construct("Add", true, true, this, other);
    }

    __radd__(other: any) {
        return Global.construct("Add", true, true, other, this);
    }

    __sub__(other: any) {
        return Global.construct("Add", true, true, this, other.__mul__(S.NegativeOne));
    }

    __rsub__(other: any) {
        return Global.construct("Add", true, true, other, this.__mul__(S.NegativeOne));
    }

    __mul__(other: any) {
        return Global.construct("Mul", true, true, this, other);
    }

    __rmul__(other: any) {
        return Global.construct("Mul", true, true, other, this);
    }

    _pow(other: any) {
        return Global.construct("Pow", this, other);
    }

    __pow__(other: any, mod: boolean = undefined) {
        if (typeof mod === "undefined") {
            return this._pow(other);
        }
        let _self; let _other; let _mod;
        try {
            [_self, _other, _mod] = [as_int(this), as_int(other), as_int(mod)];
            if (other >= 0) {
                return Global.construct("_Number_", _self**_other % _mod);
            } else {
                return Global.construct("_Number_", Global.evalfunc("mod_inverse", (_self ** (_other) % (mod as any)), mod));
            }
        } catch (Error) {
            // eslint-disable-next-line no-unused-vars
            const power = this._pow(_other);
            try {
                // return power.__mod__(mod);
                throw new Error("mod class not yet implemented");
            } catch (Error) {
                throw new Error("not implemented");
            }
        }
    }

    __rpow__(other: any) {
        return Global.construct("Pow", other, this);
    }

    __truediv__(other: any) {
        const denom = Global.construct("Pow", other, S.NegativeOne);
        if (this === S.One) {
            return denom;
        } else {
            return Global.construct("Mul", true, true, this, denom);
        }
    }

    __rtruediv__(other: any) {
        const denom = Global.construct("Pow", this, S.NegativeOne);
        if (other === S.One) {
            return denom;
        } else {
            return Global.construct("Mul", true, true, other, denom);
        }
    }

    _eval_power(other: any): any {
        return undefined;
    }

    args_cnc(cset: boolean = false, warn: boolean = true, split_1: boolean = true) {
        let args;
        if ((this.constructor as any).is_Mul) {
            args = this._args;
        } else {
            args = [this];
        }
        let c; let nc;
        let loop2 = true;
        for (let i = 0; i < args.length; i++) {
            const mi = args[i];
            if (!(mi.is_commutative)) {
                c = args.slice(0, i);
                nc = args.slice(i);
                loop2 = false;
                break;
            }
        } if (loop2) {
            c = args;
            nc = [];
        }

        if (c && split_1 &&
            c[0].is_Number &&
            c[0].is_extended_negative &&
            c[0] !== S.NegativeOne) {
            c.splice(0, 1, S.NegativeOne, c[0].__mul__(S.NegativeOne));
        }

        if (cset) {
            const clen = c.length;
            const cset = new HashSet();
            cset.addArr(c);
            if (clen && warn && cset.size !== clen) {
                throw new Error("repeated commutative args");
            }
        }
        return [c, nc];
    }
};

// eslint-disable-next-line new-cap
const _Expr = Expr(Object);
ManagedProperties.register(_Expr);

const AtomicExpr = (superclass: any) => class AtomicExpr extends mix(superclass).with(Atom, Expr) {
    /*
    A parent class for object which are both atoms and Exprs.
    For example: Symbol, Number, Rational, Integer, ...
    But not: Add, Mul, Pow, ...
    */
    static is_number = false;
    static is_Atom = true;

    __slots__: any[] = [];

    constructor(...args: any) {
        super(AtomicExpr, args);
    }

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
