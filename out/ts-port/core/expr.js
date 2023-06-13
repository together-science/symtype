import { _Basic, Atom } from "./basic.js";
import { HashSet, mix } from "./utility.js";
import { ManagedProperties } from "./assumptions.js";
import { S } from "./singleton.js";
import { Global } from "./global.js";
import { as_int } from "../utilities/misc.js";
const Expr = (superclass) => { var _a; return _a = class Expr extends mix(superclass).with(_Basic) {
        constructor(...args) {
            super(...args);
            this.__slots__ = [];
        }
        as_base_exp() {
            return [this, S.One];
        }
        as_coeff_Mul(rational = false) {
            return [S.One, this];
        }
        as_coeff_Add() {
            return [S.Zero, this];
        }
        __add__(other) {
            return Global.construct("Add", true, true, this, other);
        }
        __radd__(other) {
            return Global.construct("Add", true, true, other, this);
        }
        __sub__(other) {
            return Global.construct("Add", true, true, this, other.__mul__(S.NegativeOne));
        }
        __rsub__(other) {
            return Global.construct("Add", true, true, other, this.__mul__(S.NegativeOne));
        }
        __mul__(other) {
            return Global.construct("Mul", true, true, this, other);
        }
        __rmul__(other) {
            return Global.construct("Mul", true, true, other, this);
        }
        _pow(other) {
            return Global.construct("Pow", this, other);
        }
        __pow__(other, mod = undefined) {
            if (typeof mod === "undefined") {
                return this._pow(other);
            }
            let _self;
            let _other;
            let _mod;
            try {
                [_self, _other, _mod] = [as_int(this), as_int(other), as_int(mod)];
                if (other >= 0) {
                    return Global.construct("_Number_", _self ** _other % _mod);
                }
                else {
                    return Global.construct("_Number_", Global.evalfunc("mod_inverse", (_self ** (_other) % mod), mod));
                }
            }
            catch (Error) {
                const power = this._pow(_other);
                try {
                    throw new Error("mod class not yet implemented");
                }
                catch (Error) {
                    throw new Error("not implemented");
                }
            }
        }
        __rpow__(other) {
            return Global.construct("Pow", other, this);
        }
        __truediv__(other) {
            const denom = Global.construct("Pow", other, S.NegativeOne);
            if (this === S.One) {
                return denom;
            }
            else {
                return Global.construct("Mul", true, true, this, denom);
            }
        }
        __rtruediv__(other) {
            const denom = Global.construct("Pow", this, S.NegativeOne);
            if (other === S.One) {
                return denom;
            }
            else {
                return Global.construct("Mul", true, true, other, denom);
            }
        }
        _eval_power(other) {
            return undefined;
        }
        args_cnc(cset = false, warn = true, split_1 = true) {
            let args;
            if (this.constructor.is_Mul) {
                args = this._args;
            }
            else {
                args = [this];
            }
            let c;
            let nc;
            let loop2 = true;
            for (let i = 0; i < args.length; i++) {
                const mi = args[i];
                if (!(mi.is_commutative)) {
                    c = args.slice(0, i);
                    nc = args.slice(i);
                    loop2 = false;
                    break;
                }
            }
            if (loop2) {
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
    },
    _a.is_scalar = true,
    _a; };
const _Expr = Expr(Object);
ManagedProperties.register(_Expr);
const AtomicExpr = (superclass) => { var _a; return _a = class AtomicExpr extends mix(superclass).with(Atom, Expr) {
        constructor(...args) {
            super(AtomicExpr, args);
            this.__slots__ = [];
        }
        _eval_is_polynomial(syms) {
            return true;
        }
        _eval_is_rational_function(syms) {
            return true;
        }
        eval_is_algebraic_expr(syms) {
            return true;
        }
        _eval_nseries(x, n, logx, cdor = 0) {
            return this;
        }
    },
    _a.is_number = false,
    _a.is_Atom = true,
    _a; };
const _AtomicExpr = AtomicExpr(Object);
ManagedProperties.register(_AtomicExpr);
export { AtomicExpr, _AtomicExpr, Expr, _Expr };
//# sourceMappingURL=expr.js.map