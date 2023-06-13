import { ManagedProperties } from "./assumptions.js";
import { _Expr } from "./expr.js";
import { Global } from "./global.js";
import { _Number_ } from "./numbers.js";
import { global_parameters } from "./parameters.js";
import { S } from "./singleton.js";
export class Pow extends _Expr {
    constructor(b, e, evaluate = undefined, simplify = true) {
        super(b, e);
        this.__slots__ = ["is_commutative"];
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
                    if (b.constructor.is_positive || b.is_positive()) {
                        return S.Infinity;
                    }
                    else if (b.constructor.is_zero) {
                        return S.Zero;
                    }
                    else {
                        if (b.is_finite() || b.constructor.is_finite) {
                            return S.ComplexInfinity;
                        }
                        else {
                            return S.NaN;
                        }
                    }
                }
                if (e === S.Zero) {
                    return S.One;
                }
                else if (e === S.One) {
                    return b;
                }
                else if (e === S.NegativeOne && !b) {
                    return S.ComplexInfinity;
                }
                else if ((e.constructor.is_Symbol && e.constructor.is_integer ||
                    e.constructor.is_Integer && (b.constructor.is_Number &&
                        b.constructor.is_Mul || b.constructor.is_Number)) && (e.is_extended_negative === true)) {
                    if (e.is_even() || e.constructor.is_even) {
                        b = b.__mul__(S.NegativeOne);
                    }
                    else {
                        return new Pow(b.__mul__(S.NegativeOne), e).__mul__(S.NegativeOne);
                    }
                }
                if (b === S.NaN || e === S.NaN) {
                    return S.NaN;
                }
                else if (b === S.One) {
                    if (e.is_infinite()) {
                        return S.NaN;
                    }
                    return S.One;
                }
                else if (e.constructor.is_Number && b.constructor.is_Number) {
                    const obj = b._eval_power(e);
                    if (typeof obj !== "undefined") {
                        obj.is_commutative = (b.constructor.is_commutative && e.constructor.is_commutative);
                        return obj;
                    }
                }
            }
        }
        this.is_commutative = (b.constructor.is_commutative && e.constructor.is_commutative);
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
    static _new(b, e) {
        return new Pow(b, e);
    }
}
Pow.is_Pow = true;
ManagedProperties.register(Pow);
Global.register("Pow", Pow._new);
export function nroot(y, n) {
    const x = Math.floor(y ** (1 / n));
    return [x, x ** n === y];
}
//# sourceMappingURL=power.js.map