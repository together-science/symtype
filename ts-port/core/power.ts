
import {ManagedProperties} from "./assumptions.js";
import {_Expr} from "./expr.js";
import {Global} from "./global.js";
import {_Number_} from "./numbers.js";
import {global_parameters} from "./parameters.js";
import {S} from "./singleton.js";

export class Pow extends _Expr {
    static is_Pow = true;
    __slots__ = ["is_commutative"];

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
                    if (b.constructor.is_positive || b.is_positive()) {
                        return S.Infinity;
                    } else if (b.constructor.is_zero) {
                        return S.Zero;
                    } else {
                        if (b.is_finite() || b.constructor.is_finite) {
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
                } else if ((e.constructor.is_Symbol && e.constructor.is_integer ||
                    e.constructor.is_Integer && (b.constructor.is_Number &&
                    b.constructor.is_Mul || b.constructor.is_Number)) && (e.is_extended_negative === true)) {
                    if (e.is_even() || e.constructor.is_even) {
                        b = b.__mul__(S.NegativeOne);
                    } else {
                        return new Pow(b.__mul__(S.NegativeOne), e).__mul__(S.NegativeOne);
                    }
                }
                if (b === S.NaN || e === S.NaN) {
                    return S.NaN;
                } else if (b === S.One) {
                    if (e.is_infinite()) {
                        return S.NaN;
                    }
                    return S.One;
                } else if (e.constructor.is_Number && b.constructor.is_Number ) {
                    // base E stuff not yet implemented
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

    // _eval_expand_power_base() {
    //     const b = this._args[0];
    //     const e = this._args[1];
    //     if (!(b.constructor.is_Mul)) {
    //         return this;
    //     }

    //     let [cargs, nc] = b.args_cnc(false, true, false);

    //     if (nc) {
    //         const temp = [];
    //         for (const i of nc) {
    //             if (i._eval_expand_power_base) {
    //                 temp.push(i._eval_expand_power_base());
    //             } else {
    //                 temp.push(i);
    //             }
    //         }
    //         nc = temp;
    //         let rv;
    //         if (e.constructor.is_Integer) {
    //             if (e.constructor.is_positive) {
    //                 rv = new Mul(true, true, ...Util.arrMul(nc, e.p));
    //             } else {
    //                 const mularg = [];
    //                 for (const i of nc.reverse()) {
    //                     mularg.push(i._eval_power(-1));
    //                 }
    //                 rv = new Mul(true, true, ...Util.arrMul(mularg, -e.p));
    //             }
    //             if (cargs) {
    //                 const rvarg: any = new Mul(true, true, ...cargs)._eval_power(e);
    //                 rv = rv.__mul__(rvarg);
    //             }
    //             return rv;
    //         }
    //         if (!cargs) {
    //             return this.constructor(new Mul(true, true, ...nc), e, false);
    //         }

    //         nc = [new Mul(true, true, ...nc)];
    //     }
    //     const [other, maybe_real] = sift(cargs, (x: any) => x.constructor.is_extended_real === false, true);
    //     function pred(x: any) {
    //         const polar = x.constructor.is_polar;
    //         if (polar) {
    //             return true;
    //         } else if (typeof polar === "undefined") {
    //             return fuzzy_bool_v2(x.constructor.is_extended_nonnegative);
    //         }
    //     }
    //     const sifted = sift(maybe_real, pred);
    //     const nonneg = sifted.get("true");
    // }

    /*
    def _eval_expand_power_base(self, **hints):
        # sift the commutative bases
        other, maybe_real = sift(cargs, lambda x: x.is_extended_real is False,
            binary=True)
        def pred(x):
            if x is S.ImaginaryUnit:
                return S.ImaginaryUnit
            polar = x.is_polar
            if polar:
                return True
            if polar is None:
                return fuzzy_bool(x.is_extended_nonnegative)
        sifted = sift(maybe_real, pred)
        nonneg = sifted[True]
        other += sifted[None]
        neg = sifted[False]

        # bring out the bases that can be separated from the base

        if force or e.is_integer:
            # treat all commutatives the same and put nc in other
            cargs = nonneg + neg + other
            other = nc
        else:
            # this is just like what is happening automatically, except
            # that now we are doing it for an arbitrary exponent for which
            # no automatic expansion is done

            assert not e.is_Integer

            # handle negatives by making them all positive and putting
            # the residual -1 in other
            if len(neg) > 1:
                o = S.One
                if not other and neg[0].is_Number:
                    o *= neg.pop(0)
                if len(neg) % 2:
                    o = -o
                for n in neg:
                    nonneg.append(-n)
                if o is not S.One:
                    other.append(o)
            elif neg and other:
                if neg[0].is_Number and neg[0] is not S.NegativeOne:
                    other.append(S.NegativeOne)
                    nonneg.append(-neg[0])
                else:
                    other.extend(neg)
            else:
                other.extend(neg)
            del neg

            cargs = nonneg
            other += nc

        rv = S.One
        if cargs:
            if e.is_Rational:
                npow, cargs = sift(cargs, lambda x: x.is_Pow and
                    x.exp.is_Rational and x.base.is_number,
                    binary=True)
                rv = Mul(*[self.func(b.func(*b.args), e) for b in npow])
            rv *= Mul(*[self.func(b, e, evaluate=False) for b in cargs])
        if other:
            rv *= self.func(Mul(*other), e, evaluate=False)
        return rv

    */

    static _new(b: any, e: any) {
        return new Pow(b, e);
    }
}

ManagedProperties.register(Pow);
Global.register("Pow", Pow._new);


export function nroot(y: number, n: number) {
    const x = Math.floor(y ** (1 / n));
    return [x, x**n === y];
}
