/*
Work-in progress: currently forms unevaluated add objects
*/

import {Expr} from "./expr.js";
import {AssocOp} from "./operations.js";
import {base, mix, HashDict} from "./utility.js";
import {S} from "./singleton.js";
import {Basic} from "./basic.js";
import {ManagedProperties} from "./assumptions.js";
import {Mul} from "./mul.js";
import {Global} from "./global.js";
import {_fuzzy_groupv2} from "./logic.js";

function _addsort(args: any[]) {
    // eslint-disable-next-line new-cap
    args.sort((a, b) => Basic.cmp(a, b));
}

export class Add extends mix(base).with(Expr, AssocOp) {
    __slots__: any[] = [];
    args: any[];
    static is_Add: any = true;
    // eslint-disable-next-line new-cap
    static _args_type = Expr(Object);
    static identity = S.Zero; // !!! unsure abt this

    constructor(evaluate: boolean, simplify: boolean, ...args: any) {
        super(Add, evaluate, simplify, ...args);
    }

    flatten(seq: any[]) {
        let rv = undefined;
        if (seq.length === 2) {
            let [a, b] = seq;
            if (b.constructor.is_Rational) {
                [a, b] = [b, a];
            }
            if (a.constructor.is_Rational) {
                if (b.constructor.is_Mul) {
                    rv = [[a, b], [], undefined];
                }
            }
            if (rv) {
                let allc = true;
                for (const s of rv[0]) {
                    if (s.constructor.is_commutative === false) {
                        allc = false;
                    }
                }
                if (allc) {
                    return rv;
                } else {
                    return [[], rv[0], undefined];
                }
            }
        }
        const terms: HashDict = new HashDict();
        let coeff = S.Zero;
        const extra: any[] = [];
        for (const o of seq) {
            let c;
            let s;
            if (o.constructor.is_Number) {
                if ((o === S.NaN || coeff === S.ComplexInfinity && o.is_finite() === false)) {
                    return [[S.NaN], [], undefined];
                }
                if (coeff.constructor.is_Number) {
                    coeff = coeff.__add__(o);
                    if (coeff === S.NaN || !extra) {
                        return [[S.NaN], [], undefined];
                    }
                }
                continue;
            } else if (o === S.ComplexInfinity) {
                if (coeff.is_finite() === false) {
                    return [[S.NaN], [], undefined];
                }
                coeff = S.ComplexInfinity;
                continue;
            } else if (o.constructor.is_Add) {
                seq.push(...o._args);
                continue;
            } else if (o.constructor.is_Mul) {
                [c, s] = o.as_coeff_Mul();
            } else if (o.is_Pow) {
                const pair = o.as_base_exp();
                const b = pair[0];
                const e = pair[1];
                if (b.constructor.is_Number && (e.constructor.is_Integer || (e.constructor.is_Rational && e.is_negative()))) {
                    seq.push(b._eval_power(e));
                    continue;
                }
                [c, s] = [S.One, o];
            } else {
                c = S.One;
                s = o;
            }
            if (terms.has(s)) {
                terms.add(s, terms.get(s).__add__(c));
                if (terms.get(s) === S.NaN) {
                    return [[S.NaN], [], undefined];
                }
            } else {
                terms.add(s, c);
            }
        }
        let newseq: any[] = [];
        let noncommutative: boolean = false;
        for (const item of terms.entries()) {
            const s: any = item[0];
            const c: any = item[1];
            if (c.constructor.is_zero) {
                continue;
            } else if (c === S.One) {
                newseq.push(s);
            } else {
                if (s.constructor.is_Mul) {
                    const cs = s._new_rawargs(true, ...[c].concat(s._args));
                    newseq.push(cs);
                } else if (s.constructor.is_Add) {
                    newseq.push(new Mul(false, true, c, s));
                } else {
                    newseq.push(new Mul(true, true, c, s));
                }
            }
            noncommutative = noncommutative || !(s.constructor.is_commutative);
        }
        const temp = [];
        if (coeff === S.Infinity) {
            for (const f of newseq) {
                if (!(f.is_extended_nonnegative())) {
                    temp.push(f);
                }
            }
            newseq = temp;
        } else if (coeff === S.NegativeInfinity) {
            for (const f of newseq) {
                if (!(f.is_extended_nonpositive())) {
                    temp.push(f);
                }
            }
            newseq = temp;
        }
        const temp2 = [];
        if (coeff === S.ComplexInfinity) {
            for (const c of newseq) {
                if (!(c.is_finite() || c.is_extended_real() !== "undefined")) {
                    temp2.push(c);
                }
            }
            newseq = temp2;
        }
        _addsort(newseq);
        if (coeff !== S.Zero) {
            newseq.splice(0, 0, coeff);
        }
        if (noncommutative) {
            return [[], newseq, undefined];
        } else {
            return [newseq, [], undefined];
        }
    }

    _eval_is_commutative() {
        const fuzzyarg = [];
        for (const a of this._args) {
            fuzzyarg.push(a.constructor.is_commutative);
        }
        return _fuzzy_groupv2(fuzzyarg);
    }

    as_coeff_Add() {
        const [coeff, args] = [this.args[0], this.args.slice(1)];
        if (coeff.constructor.is_Number && coeff.constructor.is_Rational) {
            return [coeff, this._new_rawargs(true, ...args)];
        }
        return [S.Zero, this];
    }

    static _new(evaluate: boolean, simplify: boolean, ...args: any) {
        return new Add(evaluate, simplify, ...args);
    }
}

ManagedProperties.register(Add);
Global.register("Add", Add._new);
