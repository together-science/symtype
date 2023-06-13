import { divmod } from "../ntheory/factor_.js";
import { Add } from "./add.js";
import { ManagedProperties } from "./assumptions.js";
import { Basic } from "./basic.js";
import { Expr } from "./expr.js";
import { Global } from "./global.js";
import { fuzzy_notv2, _fuzzy_groupv2 } from "./logic.js";
import { Integer, Rational } from "./numbers.js";
import { AssocOp } from "./operations.js";
import { global_parameters } from "./parameters.js";
import { Pow } from "./power.js";
import { S } from "./singleton.js";
import { mix, base, HashDict, HashSet, ArrDefaultDict } from "./utility.js";
class NC_Marker {
    constructor() {
        this.is_Order = false;
        this.is_Mul = false;
        this.is_Number = false;
        this.is_Poly = false;
        this.is_commutative = false;
    }
}
function _mulsort(args) {
    args.sort((a, b) => Basic.cmp(a, b));
}
export class Mul extends mix(base).with(Expr, AssocOp) {
    constructor(evaluate, simplify, ...args) {
        super(Mul, evaluate, simplify, ...args);
        this.__slots__ = [];
        this._args_type = Expr;
    }
    flatten(seq) {
        let rv = undefined;
        if (seq.length === 2) {
            let [a, b] = seq;
            if (b.constructor.is_Rational) {
                [a, b] = [b, a];
                seq = [a, b];
            }
            if (!(a.constructor.is_zero && a.constructor.is_Rational)) {
                let r;
                [r, b] = b.as_coeff_Mul();
                if (b.constructor.is_Add) {
                    if (r !== S.One) {
                        let arb;
                        const ar = a.__mul__(r);
                        if (ar === S.One) {
                            arb = b;
                        }
                        else {
                            arb = this.constructor(false, true, a.__mul__(r), b);
                        }
                        rv = [[arb], [], undefined];
                    }
                    else if (global_parameters.distribute && b.is_commutative()) {
                        const arg = [];
                        for (const bi of b._args) {
                            arg.push(this._keep_coeff(a, bi));
                        }
                        const newb = new Add(true, true, ...arg);
                        rv = [[newb], [], undefined];
                    }
                }
            }
            if (rv) {
                return rv;
            }
        }
        let c_part = [];
        const nc_seq = [];
        let nc_part = [];
        let coeff = S.One;
        let c_powers = [];
        let neg1e = S.Zero;
        let num_exp = [];
        const pnum_rat = new HashDict();
        const order_symbols = [];
        for (let o of seq) {
            if (o.constructor.is_Mul) {
                if (o.constructor.is_commutative) {
                    seq.push(...o._args);
                }
                else {
                    for (const q of o._args) {
                        if (q.constructor.is_commutative) {
                            seq.push(q);
                        }
                        else {
                            nc_seq.push(q);
                        }
                    }
                }
                continue;
            }
            else if (o.constructor.is_Number) {
                if (o === S.NaN || coeff === S.ComplexInfinity && o.constructor.is_zero) {
                    return [[S.NaN], [], undefined];
                }
                else if (coeff.constructor.is_Number) {
                    coeff = coeff.__mul__(o);
                    if (coeff === S.NaN) {
                        return [[S.NaN], [], undefined];
                    }
                }
                continue;
            }
            else if (o === S.ComplexInfinity) {
                if (!(coeff)) {
                    return [[S.NaN], [], undefined];
                }
                coeff = S.ComplexInfinity;
                continue;
            }
            else if (o.is_commutative || o.constructor.is_commutative) {
                let e;
                let b;
                [b, e] = o.as_base_exp();
                if (o.constructor.is_Pow) {
                    if (b.constructor.is_Number) {
                        if (e.constructor.is_Rational) {
                            if (e.constructor.is_Integer) {
                                coeff = coeff.__mul__(new Pow(b, e));
                                continue;
                            }
                            else if (e.is_negative()) {
                                seq.push(new Pow(b, e));
                                continue;
                            }
                            else if (b.is_negative()) {
                                neg1e = neg1e.__add__(e);
                                b = b.__mul__(S.NegativeOne);
                            }
                            if (b !== S.One) {
                                pnum_rat.setdefault(b, []).push(e);
                            }
                            continue;
                        }
                        else if (b.is_positive() || b.constructor.is_integer) {
                            num_exp.push([b, e]);
                            continue;
                        }
                    }
                }
                c_powers.push([b, e]);
            }
            else {
                if (o !== NC_Marker) {
                    nc_seq.push(o);
                }
                while (nc_seq) {
                    o = nc_seq.splice(0, 1);
                    if (!(nc_part)) {
                        nc_part.push(o);
                        continue;
                    }
                    const o1 = nc_part.pop();
                    const [b1, e1] = o1.as_base_exp();
                    const [b2, e2] = o.as_base_exp();
                    const new_exp = e1.__add__(e2);
                    if (b1.eq(b2) && !(new_exp.constructor.is_Add)) {
                        const o12 = b1._eval_power(new_exp);
                        if (o12.constructor.is_commutative) {
                            seq.push(o12);
                            continue;
                        }
                        else {
                            nc_seq.splice(0, 0, o12);
                        }
                    }
                    else {
                        nc_part.push(o1);
                        nc_part.push(o);
                    }
                }
            }
        }
        function _gather(c_powers) {
            const common_b = new HashDict();
            for (const [b, e] of c_powers) {
                const co = e.as_coeff_Mul();
                common_b.setdefault(b, new HashDict()).setdefault(co[1], []).push(co[0]);
            }
            for (const [b, d] of common_b.entries()) {
                for (const [di, li] of d.entries()) {
                    d.add(di, new Add(true, true, ...li));
                }
            }
            const new_c_powers = [];
            for (const [b, e] of common_b.entries()) {
                for (const [t, c] of e.entries()) {
                    new_c_powers.push([b, c.__mul__(t)]);
                }
            }
            return new_c_powers;
        }
        c_powers = _gather(c_powers);
        num_exp = _gather(num_exp);
        for (let i = 0; i < 2; i++) {
            const new_c_powers = [];
            let changed = false;
            for (let [b, e] of c_powers) {
                let p;
                if (e.constructor.is_zero === true) {
                    if ((b.constructor.is_Add || b.constructor.is_Mul &&
                        b._args.includes(S.ComplexInfinity, S.Infinity, S.NefativeInfinity))) {
                        return [[S.NaN], [], undefined];
                    }
                    continue;
                }
                if (e === S.One) {
                    if (b.constructor.is_Number) {
                        coeff = coeff.__mul__(b);
                        continue;
                    }
                    p = b;
                }
                if (e !== S.One) {
                    p = new Pow(b, e);
                    if (p.constructor.is_Pow && !b.constructor.is_Pow) {
                        const bi = b;
                        [b, e] = p.as_base_exp();
                        if (b !== bi) {
                            changed = true;
                        }
                    }
                }
                c_part.push(p);
                new_c_powers.push([b, e]);
            }
            const argset = new HashSet();
            for (const [b, e] of new_c_powers) {
                argset.add(b);
            }
            if (changed && argset.size !== new_c_powers.length) {
                c_part = [];
                c_powers = _gather(new_c_powers);
            }
            else {
                break;
            }
        }
        const inv_exp_dict = new HashDict();
        for (const [b, e] of num_exp) {
            inv_exp_dict.setdefault(e, []).push(b);
        }
        for (const [e, b] of inv_exp_dict.entries()) {
            inv_exp_dict.add(e, new Mul(true, true, ...b));
        }
        const c_part_arg = [];
        for (const [e, b] of inv_exp_dict.entries()) {
            if (e) {
                c_part_arg.push(new Pow(b, e));
            }
        }
        c_part.push(...c_part_arg);
        const comb_e = new HashDict();
        for (const [b, e] of pnum_rat.entries()) {
            comb_e.setdefault(new Add(true, true, ...e), []).push(b);
        }
        const num_rat = [];
        for (let [e, b] of comb_e.entries()) {
            b = new Mul(true, true, ...b);
            if (e.q === 1) {
                coeff = coeff.__mul__(new Pow(b, e));
                continue;
            }
            if (e.p > e.q) {
                const [e_i, ep] = divmod(e.p, e.q);
                coeff = coeff.__mul__(new Pow(b, e_i));
                e = new Rational(ep, e.q);
            }
            num_rat.push([b, e]);
        }
        const pnew = new ArrDefaultDict();
        let i = 0;
        while (i < num_rat.length) {
            let [bi, ei] = num_rat[i];
            const grow = [];
            for (let j = i + 1; j < num_rat.length; j++) {
                const [bj, ej] = num_rat[j];
                const g = bi.gcd(bj);
                if (g !== S.One) {
                    let e = ei.__add__(ej);
                    if (e.q === 1) {
                        coeff = coeff.__mul__(new Pow(g, e));
                    }
                    else {
                        if (e.p > e.q) {
                            const [e_i, ep] = divmod(e.p, e.q);
                            coeff = coeff.__mul__(new Pow(g, e_i));
                            e = new Rational(ep, e.q);
                        }
                        grow.push([g, e]);
                    }
                    num_rat[j] = [bj / g, ej];
                    bi = bi / g;
                    if (bi === S.One) {
                        break;
                    }
                }
            }
            if (bi !== S.One) {
                const obj = new Pow(bi, ei);
                if (obj.constructor.is_Number) {
                    coeff = coeff.__mul__(obj);
                }
                else {
                    for (const item of this.make_args(Mul, obj)) {
                        if (item.constructor.is_Number) {
                            coeff = coeff.__mul__(obj);
                        }
                        else {
                            [bi, ei] = item._args;
                            pnew.add(ei, pnew.get(ei).push(bi));
                        }
                    }
                }
            }
            num_rat.push(...grow);
            i++;
        }
        if (neg1e !== S.Zero) {
            let n;
            let q;
            let p;
            [p, q] = neg1e._as_numer_denom();
            [n, p] = divmod(p.p, q.p);
            if (n % 2 !== 0) {
                coeff = coeff.__mul__(S.NegativeOne);
            }
            if (q === 2) {
                throw new Error("imaginary numbers not yet supported");
            }
            else if (p) {
                neg1e = new Rational(p, q);
                let enterelse = true;
                for (const [e, b] of pnew.entries()) {
                    if (e === neg1e && b.is_positive()) {
                        pnew.add(e, pnew.get(e) - b);
                        enterelse = false;
                        break;
                    }
                }
                if (enterelse) {
                    c_part.push(new Pow(S.NegativeOne, neg1e, false));
                }
            }
        }
        const c_part_argv2 = [];
        for (const [b, e] of pnew.entries()) {
            c_part_argv2.push(new Pow(b, e));
        }
        c_part.push(...c_part_argv2);
        if (coeff === S.Infinity || coeff === S.NegativeInfinity) {
            function _handle_for_oo(c_part, coeff_sign) {
                const new_c_part = [];
                for (const t of c_part) {
                    if (t.is_extended_negative) {
                        continue;
                    }
                    if (t.is_extended_negative) {
                        coeff_sign *= -1;
                        continue;
                    }
                    new_c_part.push(t);
                }
                return [new_c_part, coeff_sign];
            }
            let coeff_sign;
            [c_part, coeff_sign] = _handle_for_oo(c_part, 1);
            [nc_part, coeff_sign] = _handle_for_oo(nc_part, coeff_sign);
            coeff = coeff.__mul__(new Integer(coeff_sign));
        }
        if (coeff === S.ComplexInfinity) {
            const ctemp = [];
            for (const c of c_part) {
                if (!(fuzzy_notv2(c.constructor.is_zero) && c.is_extended_real() !== "undefined")) {
                    ctemp.push(c);
                }
            }
            c_part = ctemp;
            const nctemp = [];
            for (const c of nc_part) {
                if (!(fuzzy_notv2(c.constructor.is_zero) && c.is_extended_real() !== "undefined")) {
                    nctemp.push(c);
                }
            }
            nc_part = nctemp;
        }
        else if (coeff.constructor.is_zero) {
            for (const c of c_part) {
                if (c.is_finite() === false) {
                    return [[S.NaN], [], order_symbols];
                }
            }
        }
        const _new = [];
        for (const i of c_part) {
            if (i.constructor.is_Number) {
                coeff = coeff.__mul__(i);
            }
            else {
                _new.push(i);
            }
        }
        c_part = _new;
        _mulsort(c_part);
        if (coeff !== S.One) {
            c_part.splice(0, 0, coeff);
        }
        if (global_parameters.distribute && !nc_part && c_part.length === 2 &&
            c_part[0].constructor.is_Number && c_part[0].is_finite() && c_part[1].constructor.is_Add) {
            coeff = c_part[0];
            const addarg = [];
            for (const f of c_part[1]._args) {
                addarg.push(coeff.__mul__(f));
            }
            c_part = new Add(true, true, ...addarg);
        }
        return [c_part, nc_part, order_symbols];
    }
    as_coeff_Mul(rational = false) {
        const coeff = this._args.slice(0, 1)[0];
        const args = this._args.slice(1);
        if (coeff.constructor.is_Number) {
            if (!rational || coeff.constructor.is_Rational) {
                if (args.length === 1) {
                    return [coeff, args[0]];
                }
                else {
                    return [coeff, this._new_rawargs(true, ...args)];
                }
            }
            else if (coeff.constructor.is_extended_negative) {
                return [S.NegativeOne, this._new_rawargs(true, ...[-coeff].concat(args))];
            }
        }
        return [S.One, this];
    }
    _eval_power(e) {
        const [cargs, nc] = this.args_cnc(false, true, false);
        if (e.constructor.is_Integer) {
            const mulargs = [];
            for (const b of cargs) {
                mulargs.push(new Pow(b, e, false));
            }
            return new Mul(true, true, ...mulargs).__mul__(new Pow(this._from_args(Mul, undefined, ...nc), e, false));
        }
        const p = new Pow(this, e, false);
        if (e.constructor.is_Rational || e.constructor.is_Float) {
            return p._eval_expand_power_base();
        }
        return p;
    }
    _keep_coeff(coeff, factors, clear = true, sign = false) {
        if (!(coeff.constructor.is_Number)) {
            if (factors.constructor.is_Number) {
                [factors, coeff] = [coeff, factors];
            }
            else {
                return coeff.__mul__(factors);
            }
        }
        if (factors === S.One) {
            return coeff;
        }
        if (coeff === S.One) {
            return factors;
        }
        else if (coeff === S.NegativeOne && !sign) {
            return factors.__mul__(S.NegativeOne);
        }
        else if (factors.constructor.isAdd) {
            if (!clear && coeff.constructor.is_Rational && coeff.q !== 1) {
                let args = [];
                for (const i of factors._args) {
                    args.push(i.as_coeff_Mul());
                }
                const temp = [];
                for (const [c, m] of args) {
                    temp.push([this._keep_coeff(c, coeff), m]);
                }
                args = temp;
                for (const [c] of args) {
                    if (c.constructor.is_Integer) {
                        const temparg = [];
                        for (const i of args) {
                            if (i[0] === 1) {
                                temparg.push(i.slice(0, 1));
                            }
                            else {
                                i;
                            }
                        }
                        return this._from_args(Add, undefined, ...this._from_args(Mul, undefined, ...temparg));
                        break;
                    }
                }
            }
            return new Mul(false, true, coeff, factors);
        }
        else if (factors.constructor.isMul) {
            const margs = factors._args;
            if (margs[0].constructor.is_Number) {
                margs[0] = margs[0].__mul__(coeff);
                if (margs[0] === 1) {
                    margs.splice(2, 1);
                }
            }
            else {
                margs.splice(0, 0, coeff);
            }
            return this._from_args(Mul, undefined, ...margs);
        }
        else {
            let m = coeff.__mul__(factors);
            if (m.constructor.is_Number && !(factors.constructor.is_Number)) {
                m = this._from_args(Mul, undefined, coeff, factors);
            }
            return m;
        }
    }
    static _new(evaluate, simplify, ...args) {
        return new Mul(evaluate, simplify, ...args);
    }
    _eval_is_commutative() {
        const allargs = [];
        for (const a of this._args) {
            allargs.push(a.constructor.is_commutative);
        }
        return _fuzzy_groupv2(allargs);
    }
}
Mul.is_Mul = true;
Mul.identity = S.One;
ManagedProperties.register(Mul);
Global.register("Mul", Mul._new);
//# sourceMappingURL=mul.js.map