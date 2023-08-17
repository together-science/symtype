/*
Notable changes made (and notes):
- Very barebones versions of Expr implemented so far - very few util methods
- Note that expression uses global.ts to construct add and mul objects, which
  avoids cyclical imports
*/

import {_Basic, Atom} from "./basic";
import {HashDict, HashSet, mix} from "./utility";
import {ManagedProperties} from "./assumptions";
import {S} from "./singleton";
import {Global} from "./global";
import {as_int} from "../utilities/misc";
import { default_sort_key } from "./sorting";


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
    static clsname = "Expr";

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
        return Global.construct("Add", true, true, this, other.__neg__());
    }

    __rsub__(other: any) {
        return Global.construct("Add", true, true, other, this.__neg__());
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

    __neg__() {
        return Global.construct("Mul", this, S.NegativeOne);
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
            c.splice(0, 1, S.NegativeOne, c[0].__neg__());
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

    as_numer_denom() {
        return [this, S.One];
    }

    __ge__(other: any) {
        return Global.construct("Ge", this, other);
    }

    __le__(other: any) {
        return Global.construct("Le", this, other);
    }

    __gt__(other: any) {
        return Global.construct("Gt", this, other);
    }

    __lt__(other: any) {
        return Global.construct("Lt", this, other);
    }

    diff(...symbols: any[]) {
        return Global.construct("_derivative_dispatch", this, ...symbols);
    }

    static _expand_hint(expr: any, hint: string, deep: boolean = true, hints: HashDict) {
        /*
        Helper for ``expand()``.  Recursively calls ``expr._eval_expand_hint()``.

        Returns ``(expr, hit)``, where expr is the (possibly) expanded
        ``expr`` and ``hit`` is ``True`` if ``expr`` was truly expanded and
        ``False`` otherwise.
        */
        let hit = false;
        if (deep && expr._args && !expr.is_Atom()) {
            const sargs = [];
            for (const arg of expr._args) {
                const [args, arghit] = Expr._expand_hint(arg, hint, true, hints);
                hit = ((hit as unknown as number) | (arghit as unknown as number)) as unknown as boolean; // ????
                sargs.push(arg);
            }
            if (hit) {
                expr = expr.func(...sargs);
            }
        }

        if (expr[hint]) {
            const newexpr = expr[hint](hints) 
            if (newexpr.__ne__(expr)) {
                return [newexpr, true];
            }
        }

        return [expr, hit];
    }


    _expand(hints: HashDict) {
        let expr = this;
        if (hints.pop("frac", false)) {
            const [n, d] = Global.evalfunc("fraction", this).map((a: any) => a._expand(hints));
            return n.__truediv__(d);
        } else if (hints.pop("denom", false)) {
            const [n, d] = Global.evalfunc("fraction", this);
            return (n.__truediv__(d)).expand(hints);
        } else if (hints.pop("numer", false)) {
            const [n, d] = Global.evalfunc("fraction", this);
            return (n.expand(hints)).__truediv__(d);
        }

        function _expand_hint_key(hint: string) {
            if (hint === "mul") {
                return "mulz";
            }
            return hint;
        }

        const compare_func = (a: any, b: any) => {
            if (_expand_hint_key(a) > _expand_hint_key(b)) {
                return 1;
            } else if (_expand_hint_key(a) < _expand_hint_key(b)) {
                return -1;
            }
            return 0;
        } 

        for (let hint of hints.keys().sort(compare_func)) {
            const use_hint = hints.get(hint);
            if (use_hint) {
                hint = "_eval_expand_" + hint;;
                expr = Expr._expand_hint(expr, hint, true, hints)[0];
            }
        }

        while (true) {
            const was = expr;
            if (hints.get("multinomial", false)) {
                expr = Expr._expand_hint(expr, "_eval_expand_multinomial", true, hints)[0];
            }
            if (hints.get("mul", false)) {
                expr = Expr._expand_hint(expr, "_eval_expand_mul", true, hints)[0];
            }
            if (hints.get("log", false)) {
                expr = Expr._expand_hint(expr, "_eval_expand_log", true, hints)[0];
            }
            if (expr.__eq__(was)) {
                break;
            }
        }

        // modulus is not yet supported

        return expr;
    }

    expand(params: {
        deep?: boolean,
        modulus?: any,
        power_base?: boolean,
        power_exp?: boolean,
        mul?: boolean,
        log?: boolean,
        multinomial?: boolean,
        basic?: boolean,
        frac?: boolean,
        denom?: boolean,
        numer?: boolean,
        }={}) {

        // define the defaults
        const defaults = {
            deep: true,
            modulus: true,
            power_base: true,
            power_exp: true,
            mul: true,
            log: true,
            multinomial: true,
            basic: true,
            frac: false,
            numer: false,
            denom: false
        };

        // put defaults into options
        params = {...defaults, ...params};

        const hints = new HashDict(params);

        return this._expand(hints);
    }

    sort_key(order: boolean = undefined) {
        let [coeff, expr] = this.as_coeff_Mul();
        let exp;

        if (expr.is_Pow()) {
            [expr, exp] = expr._args;
        } else {
            exp = S.One;
        }

        let args;
        if (expr.is_Dummy()) {
            args  = [expr.sort_key()];
        } else if (expr.is_Atom()) {
            args = [expr.toString()]
        } else {
            if (expr.is_Add()) {
                throw new Error("as_ordered_terms not yet implemented");
                // args = expr.as_ordered_terms(order);
            } else if (expr.is_Mul()) {
                throw new Error("as_ordered_factors not yet implemented");
                // args = expr.as_ordered_factors(order);
            } else {
                args = expr.args;
            }
            args = args.map((arg: any) => default_sort_key(arg, order));
        }

        args = [args.length, [args]];
        exp = exp.sort_key(order);
        return [expr.class_key(), args, exp, coeff];
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
    static clsname = "AtomicExpr";

    __slots__: any[] = [];

    constructor(...args: any) {
        super(...args);
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

    _eval_derivative(s: any) {
        if (this.__eq__(s)) {
            return S.One;
        }
        return S.Zero;
    }
};

// eslint-disable-next-line new-cap
const _AtomicExpr = AtomicExpr(Object);
ManagedProperties.register(_AtomicExpr);

export {AtomicExpr, _AtomicExpr, Expr, _Expr};
