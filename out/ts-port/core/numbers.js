import { _AtomicExpr } from "./expr.js";
import { NumberKind } from "./kind.js";
import { ManagedProperties } from "./assumptions.js";
import { global_parameters } from "./parameters.js";
import { Add } from "./add.js";
import { S, Singleton } from "./singleton.js";
import Decimal from "decimal.js";
import { as_int } from "../utilities/misc.js";
import { Pow } from "./power.js";
import { Global } from "./global.js";
import { divmod, factorint, factorrat, perfect_power } from "../ntheory/factor_.js";
import { HashDict } from "./utility.js";
import { Mul } from "./mul.js";
function igcd(x, y) {
    while (y) {
        const t = y;
        y = x % y;
        x = t;
    }
    return x;
}
export function int_nthroot(y, n) {
    const x = Math.floor(y ** (1 / n));
    const isexact = x ** n === y;
    return [x, isexact];
}
function toRatio(n, eps) {
    const gcde = (e, x, y) => {
        const _gcd = (a, b) => (b < e ? a : _gcd(b, a % b));
        return _gcd(Math.abs(x), Math.abs(y));
    };
    const c = gcde(Boolean(eps) ? eps : (1 / 10000), 1, n);
    return [Math.floor(n / c), Math.floor(1 / c)];
}
function igcdex(a = undefined, b = undefined) {
    if (typeof a === "undefined" && typeof b === "undefined") {
        return [0, 1, 0];
    }
    if (typeof a === "undefined") {
        return [0, Math.floor(b / Math.abs(b)), Math.abs(b)];
    }
    if (typeof b === "undefined") {
        return [Math.floor(a / Math.abs(a)), 0, Math.abs(a)];
    }
    let x_sign;
    let y_sign;
    if (a < 0) {
        a = -1;
        x_sign = -1;
    }
    else {
        x_sign = 1;
    }
    if (b < 0) {
        b = -b;
        y_sign = -1;
    }
    else {
        y_sign = 1;
    }
    let [x, y, r, s] = [1, 0, 0, 1];
    let c;
    let q;
    while (b) {
        [c, q] = [a % b, Math.floor(a / b)];
        [a, b, r, s, x, y] = [b, c, x - q * r, y - q * s, r, s];
    }
    return [x * x_sign, y * y_sign, a];
}
function mod_inverse(a, m) {
    let c = undefined;
    [a, m] = [as_int(a), as_int(m)];
    if (m !== 1 && m !== -1) {
        const [x, b, g] = igcdex(a, m);
        if (g === 1) {
            c = x & m;
        }
    }
    return c;
}
Global.registerfunc("mod_inverse", mod_inverse);
class _Number_ extends _AtomicExpr {
    static new(...obj) {
        if (obj.length === 1) {
            obj = obj[0];
        }
        if (obj instanceof _Number_) {
            return obj;
        }
        else if (typeof obj === "number" && !Number.isInteger(obj) || obj instanceof Decimal || typeof obj === "string") {
            return new Float(obj);
        }
        else if (Number.isInteger(obj)) {
            return new Integer(obj);
        }
        else if (obj.length === 2) {
            return new Rational(obj[0], obj[1]);
        }
        else if (typeof obj === "string") {
            const _obj = obj.toLowerCase();
            if (_obj === "nan") {
                return S.NaN;
            }
            else if (_obj === "inf") {
                return S.Infinity;
            }
            else if (_obj === "+inf") {
                return S.Infinity;
            }
            else if (_obj === "-inf") {
                return S.NegativeInfinity;
            }
            else {
                throw new Error("argument for number is invalid");
            }
        }
        throw new Error("argument for number is invalid");
    }
    as_coeff_Mul(rational = false) {
        if (rational && !this.is_Rational) {
            return [S.One, this];
        }
        if (this) {
            return [this, S.One];
        }
        else {
            return [S.One, this];
        }
    }
    as_coeff_Add() {
        return [this, S.Zero];
    }
    __add__(other) {
        if (other instanceof _Number_ && global_parameters.evaluate) {
            if (other === S.NaN) {
                return S.NaN;
            }
            else if (other === S.Infinity) {
                return S.Infinity;
            }
            else if (other === S.NegativeInfinity) {
                return S.NegativeInfinity;
            }
        }
        return super.__add__(other);
    }
    __sub__(other) {
        if (other instanceof _Number_ && global_parameters.evaluate) {
            if (other === S.NaN) {
                return S.NaN;
            }
            else if (other === S.Infinity) {
                return S.NegativeInfinity;
            }
            else if (other === S.NegativeInfinity) {
                return S.Infinity;
            }
        }
        return super.__sub__(other);
    }
    __mul__(other) {
        if (other instanceof _Number_ && global_parameters.evaluate) {
            const cls = this.constructor;
            if (other === S.Nan) {
                return S.Nan;
            }
            else if (other === S.Infinity) {
                if (cls.is_zero) {
                    return S.NaN;
                }
                else if (cls.is_positive) {
                    return S.Infinity;
                }
                else {
                    return S.NegativeInfinity;
                }
            }
            else if (other === S.NegativeInfinity) {
                if (cls.is_zero) {
                    return S.NaN;
                }
                else if (cls.is_positive) {
                    return S.NegativeInfinity;
                }
                else {
                    return S.Infinity;
                }
            }
        }
        return super.__mul__(other);
    }
    __truediv__(other) {
        if (other instanceof _Number_ && global_parameters.evaluate) {
            if (other === S.NaN) {
                return S.NaN;
            }
            else if (other === S.Infinity || other === S.NegativeInfinity) {
                return S.Zero;
            }
        }
        return super.__truediv__(other);
    }
    eval_evalf(prec) {
        return new Float(this._float_val(prec), prec);
    }
    _float_val(prec) {
        return undefined;
    }
}
_Number_.is_commutative = true;
_Number_.is_number = true;
_Number_.is_Number = true;
_Number_.kind = NumberKind;
;
ManagedProperties.register(_Number_);
Global.register("_Number_", _Number_.new);
class Float extends _Number_ {
    constructor(num, prec = 15) {
        super();
        this.__slots__ = ["_mpf_", "_prec"];
        this.prec = prec;
        if (typeof num !== "undefined") {
            if (num instanceof Float) {
                this.decimal = num.decimal;
            }
            else if (num instanceof Decimal) {
                this.decimal = num;
            }
            else {
                this.decimal = new Decimal(num);
            }
        }
    }
    __add__(other) {
        if (global_parameters.evaluate && other instanceof _Number_) {
            const val = other._float_val(this.prec);
            return new Float(Decimal.set({ precision: this.prec }).add(this.decimal, val.decimal), this.prec);
        }
        return super.__add__(other);
    }
    __sub__(other) {
        if (global_parameters.evaluate && other instanceof _Number_) {
            const val = other._float_val(this.prec);
            return new Float(Decimal.set({ precision: this.prec }).sub(this.decimal, val.decimal), this.prec);
        }
        return super.__sub__(other);
    }
    __mul__(other) {
        if (global_parameters.evaluate && other instanceof _Number_) {
            const val = other._float_val(this.prec);
            return new Float(Decimal.set({ precision: this.prec }).mul(this.decimal, val.decimal), this.prec);
        }
        return super.__mul__(other);
    }
    __truediv__(other) {
        if (global_parameters.evaluate && other instanceof _Number_) {
            const val = other._float_val(this.prec);
            return new Float(Decimal.set({ precision: this.prec }).div(this.decimal, val.decimal), this.prec);
        }
        return super.__div__(other);
    }
    _eval_is_negative() {
        return this.decimal.lessThan(0);
    }
    _eval_is_positive() {
        return this.decimal.greaterThan(0);
    }
    _eval_power(expt) {
        if (this === S.Zero) {
            if (expt.is_extended_positive) {
                return this;
            }
            if (expt.is_extended_negative) {
                return S.ComplexInfinity;
            }
        }
        if (expt instanceof _Number_) {
            if (expt instanceof Integer) {
                const prec = this.prec;
                return new Float(Decimal.set({ precision: this.prec }).pow(this.decimal, expt.p), prec);
            }
            else if (expt instanceof Rational &&
                expt.p === 1 && expt.q % 2 !== 0 && this.is_negative()) {
                const negpart = (this.__mul__(S.NegativeOne))._eval_power(expt);
                return new Mul(true, true, negpart, new Pow(S.NegativeOne, expt, false));
            }
            const val = expt._float_val(this.prec).decimal;
            const res = Decimal.set({ precision: this.prec }).pow(this.decimal, val);
            if (res.isNaN()) {
                throw new Error("complex and imaginary numbers not yet implemented");
            }
            return new Float(res);
        }
    }
    _float_val(prec) {
        return this;
    }
    inverse() {
        return new Float(1 / this.decimal);
    }
    _eval_is_finite() {
        return this.decimal.isFinite();
    }
}
Float.is_rational = undefined;
Float.is_irrational = undefined;
Float.is_number = true;
Float.is_real = true;
Float.is_extended_real = true;
Float.is_Float = true;
ManagedProperties.register(Float);
class Rational extends _Number_ {
    constructor(p, q = undefined, gcd = undefined, simplify = true) {
        super();
        this.__slots__ = ["p", "q"];
        if (typeof q === "undefined") {
            if (p instanceof Rational) {
                return p;
            }
            else {
                if (typeof p === "number" && p % 1 !== 0) {
                    return new Rational(toRatio(p, 0.0001));
                }
                else { }
            }
            q = 1;
            gcd = 1;
        }
        if (!Number.isInteger(p)) {
            p = new Rational(p);
            q *= p.q;
            p = p.p;
        }
        if (!Number.isInteger(q)) {
            q = new Rational(q);
            p *= q.q;
            q = q.p;
        }
        if (q === 0) {
            if (p === 0) {
                return S.Nan;
            }
            return S.ComplexInfinity;
        }
        if (q < 0) {
            q = -q;
            p = -p;
        }
        if (typeof gcd === "undefined") {
            gcd = igcd(Math.abs(p), q);
        }
        if (gcd > 1) {
            p = p / gcd;
            q = q / gcd;
        }
        if (q === 1 && simplify) {
            return new Integer(p);
        }
        this.p = p;
        this.q = q;
    }
    hashKey() {
        return this.constructor.name + this.p + this.q;
    }
    __add__(other) {
        if (global_parameters.evaluate) {
            if (other instanceof Integer) {
                return new Rational(this.p + this.q * other.p, this.q, 1);
            }
            else if (other instanceof Rational) {
                return new Rational(this.p * other.q + this.q * other.p, this.q * other.q);
            }
            else if (other instanceof Float) {
                return other.__add__(this);
            }
            else {
                return super.__add__(other);
            }
        }
        return super.__add__(other);
    }
    __radd__(other) {
        return this.__add__(other);
    }
    __sub__(other) {
        if (global_parameters.evaluate) {
            if (other instanceof Integer) {
                return new Rational(this.q * other.p - this.p, this.q, 1);
            }
            else if (other instanceof Rational) {
                return new Rational(this.p * other.q - this.q * other.p, this.q * other.q);
            }
            else if (other instanceof Float) {
                return this.__mul__(S.NegativeOne).__add__(other);
            }
            else {
                return super.__sub__(other);
            }
        }
        return super.__sub__(other);
    }
    __rsub__(other) {
        if (global_parameters.evaluate) {
            if (other instanceof Integer) {
                return new Rational(this.p - this.q * other.p, this.q, 1);
            }
            else if (other instanceof Rational) {
                return new Rational(this.q * other.p - this.p * other.q, this.q * other.q);
            }
            else if (other instanceof Float) {
                return other.__mul__(S.NegativeOne).__add__(this);
            }
            else {
                return super.__rsub__(other);
            }
        }
        return super.__rsub__(other);
    }
    __mul__(other) {
        if (global_parameters.evaluate) {
            if (other instanceof Integer) {
                return new Rational(this.p * other.p, this.q, igcd(other.p, this.q));
            }
            else if (other instanceof Rational) {
                return new Rational(this.p * other.p, this.q * other.q, igcd(this.p, other.q) * igcd(this.q, other.p));
            }
            else if (other instanceof Float) {
                return other.__mul__(this);
            }
            else {
                return super.__mul__(other);
            }
        }
        return super.__mul__(other);
    }
    __rmul__(other) {
        return this.__mul__(other);
    }
    __truediv__(other) {
        if (global_parameters.evaluate) {
            if (other instanceof Integer) {
                return new Rational(this.p, this.q * other.p, igcd(this.p, other.p));
            }
            else if (other instanceof Rational) {
                return new Rational(this.p * other.q, this.q * other.p, igcd(this.p, other.p) * igcd(this.q, other.q));
            }
            else if (other instanceof Float) {
                return this.__mul__(other.inverse());
            }
            else {
                return super.__truediv__(other);
            }
        }
        return super.__truediv__(other);
    }
    __rtruediv__(other) {
        if (global_parameters.evaluate) {
            if (other instanceof Integer) {
                return new Rational(other.p * this.q, this.p, igcd(this.p, other.p));
            }
            else if (other instanceof Rational) {
                return new Rational(other.p * this.q, other.q * this.p, igcd(this.p, other.p) * igcd(this.q, other.q));
            }
            else if (other instanceof Float) {
                return other.__mul__(S.One.__truediv__(this));
            }
            else {
                return super.__rtruediv__(other);
            }
        }
        return super.__rtruediv__(other);
    }
    _eval_power(expt) {
        if (expt instanceof _Number_) {
            if (expt instanceof Float) {
                return this.eval_evalf(expt.prec)._eval_power(expt);
            }
            else if (expt instanceof Integer) {
                return new Rational(this.p ** expt.p, this.q ** expt.p, 1);
            }
            else if (expt instanceof Rational) {
                let intpart = Math.floor(expt.p / expt.q);
                if (intpart) {
                    intpart++;
                    const remfracpart = intpart * expt.q - expt.p;
                    const ratfracpart = new Rational(remfracpart, expt.q);
                    if (this.p !== 1) {
                        return new Integer(this.p)._eval_power(expt).__mul__(new Integer(this.q))._eval_power(ratfracpart).__mul__(new Rational(1, this.q ** intpart, 1));
                    }
                    return new Integer(this.q)._eval_power(ratfracpart).__mul__(new Rational(1, this.q ** intpart, 1));
                }
                else {
                    const remfracpart = expt.q - expt.p;
                    const ratfracpart = new Rational(remfracpart, expt.q);
                    if (this.p !== 1) {
                        const p1 = new Integer(this.p)._eval_power(expt);
                        const p2 = new Integer(this.q)._eval_power(ratfracpart);
                        return p1.__mul__(p2).__mul__(new Rational(1, this.q, 1));
                    }
                    return new Integer(this.q)._eval_power(ratfracpart).__mul__(new Rational(1, this.q, 1));
                }
            }
        }
    }
    as_coeff_Add() {
        return [this, S.Zero];
    }
    _float_val(prec) {
        const a = new Decimal(this.p);
        const b = new Decimal(this.q);
        return new Float(Decimal.set({ precision: prec }).div(a, b));
    }
    _as_numer_denom() {
        return [new Integer(this.p), new Integer(this.q)];
    }
    factors(limit = undefined) {
        return factorrat(this, limit);
    }
    _eval_is_negative() {
        if (this.p < 0 && this.q > 0) {
            return true;
        }
        else {
            return false;
        }
    }
    _eval_is_positive() {
        return !this._eval_is_negative;
    }
    _eval_is_odd() {
        return this.p % 2 !== 0;
    }
    _eval_is_even() {
        return this.p % 2 === 0;
    }
    _eval_is_finite() {
        return this.p === S.Infinity || this.p === S.NegativeInfinity;
    }
    eq(other) {
        return this.p === other.p && this.q === other.q;
    }
}
Rational.is_real = true;
Rational.is_integer = false;
Rational.is_rational = true;
Rational.is_number = true;
Rational.is_Rational = true;
;
ManagedProperties.register(Rational);
class Integer extends Rational {
    constructor(p) {
        super(p, undefined, undefined, false);
        this.__slots__ = [];
        if (p === 1) {
            return S.One;
        }
        else if (p === 0) {
            return S.Zero;
        }
        else if (p === -1) {
            return S.NegativeOne;
        }
        this.p = p;
    }
    factors(limit = undefined) {
        return factorint(this.p, limit);
    }
    __add__(other) {
        if (global_parameters.evaluate) {
            if (Number.isInteger(other)) {
                return new Integer(this.p + other);
            }
            else if (other instanceof Integer) {
                return new Integer(this.p + other.p);
            }
            else if (other instanceof Rational) {
                return new Rational(this.p * other.q + other.p, other.q, 1);
            }
            else {
                return super.__add__(other);
            }
        }
        else {
            return new Add(true, true, this, other);
        }
    }
    __radd__(other) {
        if (global_parameters.evaluate) {
            if (Number.isInteger(other)) {
                return new Integer(other + this.p);
            }
            else if (other instanceof Rational) {
                return new Rational(other.p + this.p * other.q, other.q, 1);
            }
            else {
                return super.__radd__(other);
            }
        }
        else {
            return super.__radd__(other);
        }
    }
    __sub__(other) {
        if (global_parameters.evaluate) {
            if (Number.isInteger(other)) {
                return new Integer(this.p - other);
            }
            else if (other instanceof Integer) {
                return new Integer(this.p - other.p);
            }
            else if (other instanceof Rational) {
                return new Rational(this.p * other.q - other.p, other.q, 1);
            }
            else {
                return super.__sub__(other);
            }
        }
        else {
            return super.__sub__(other);
        }
    }
    __rsub__(other) {
        if (global_parameters.evaluate) {
            if (Number.isInteger(other)) {
                return new Integer(this.p - other);
            }
            else if (other instanceof Rational) {
                return new Rational(other.p - this.p * other.q, other.q, 1);
            }
            else {
                return super.__rsub__(other);
            }
        }
        else {
            return super.__rsub__(other);
        }
    }
    __mul__(other) {
        if (global_parameters.evaluate) {
            if (Number.isInteger(other)) {
                return new Integer(this.p * other);
            }
            else if (other instanceof Integer) {
                return new Integer(this.p * other.p);
            }
            else if (other instanceof Rational) {
                return new Rational(this.p * other.p, other.q, igcd(this.p, other.q));
            }
            else {
                return super.__mul__(other);
            }
        }
        else {
            return super.__mul__(other);
        }
    }
    __rmul__(other) {
        if (global_parameters.evaluate) {
            if (Number.isInteger(other)) {
                return new Integer(other * this.p);
            }
            else if (other instanceof Rational) {
                return new Rational(other.p * this.p, other.q, igcd(this.p, other.q));
            }
            else {
                return super.__rmul__(other);
            }
        }
        else {
            return super.__rmul__(other);
        }
    }
    _eval_is_negative() {
        return this.p < 0;
    }
    _eval_is_positive() {
        return this.p > 0;
    }
    _eval_is_odd() {
        return this.p % 2 === 1;
    }
    _eval_power(expt) {
        if (expt === S.Infinity) {
            if (this.p > 1) {
                return S.Infinity;
            }
        }
        if (expt === S.NegativeInfinity) {
            return new Rational(1, this, 1)._eval_power(S.Infinity);
        }
        if (!(expt instanceof _Number_)) {
            if (this.is_negative && expt.is_even) {
                return this.__mul__(S.NegativeOne)._eval_power(expt);
            }
        }
        if (expt instanceof Float) {
            return super._eval_power(expt);
        }
        if (!(expt instanceof Rational)) {
            return undefined;
        }
        if (expt.is_negative()) {
            const ne = expt.__mul__(S.NegativeOne);
            if (this.is_negative()) {
                return S.NegativeOne._eval_power(expt).__mul__(new Rational(1, this.__mul__(S.NegativeOne), 1))._eval_power(ne);
            }
            else {
                return new Rational(1, this.p, 1)._eval_power(ne);
            }
        }
        const [x, xexact] = int_nthroot(Math.abs(this.p), expt.q);
        if (xexact) {
            let result = new Integer(x ** Math.abs(expt.p));
            if (this.is_negative()) {
                result = result.__mul__(S.NegativeOne._eval_power(expt));
            }
            return result;
        }
        const b_pos = Math.abs(this.p);
        const p = perfect_power(b_pos);
        let dict = new HashDict();
        if (p !== false) {
            dict.add(p[0], p[1]);
        }
        else {
            dict = new Integer(b_pos).factors(2 ** 15);
        }
        let out_int = 1;
        let out_rad = S.One;
        let sqr_int = 1;
        let sqr_gcd = 0;
        const sqr_dict = new HashDict();
        let prime;
        let exponent;
        for ([prime, exponent] of dict.entries()) {
            exponent *= expt.p;
            const [div_e, div_m] = divmod(exponent, expt.q);
            if (div_e > 0) {
                out_int *= prime ** div_e;
            }
            if (div_m > 0) {
                const g = igcd(div_m, expt.q);
                if (g !== 1) {
                    out_rad = out_rad.__mul__(new Pow(prime, new Rational(Math.floor(div_m / g), Math.floor(expt.q / g), 1)));
                }
                else {
                    sqr_dict.add(prime, div_m);
                }
            }
        }
        for (const [, ex] of sqr_dict.entries()) {
            if (sqr_gcd === 0) {
                sqr_gcd = ex;
            }
            else {
                sqr_gcd = igcd(sqr_gcd, ex);
                if (sqr_gcd === 1) {
                    break;
                }
            }
        }
        for (const [k, v] of sqr_dict.entries()) {
            sqr_int *= k ** (Math.floor(v / sqr_gcd));
        }
        let result;
        if (sqr_int === b_pos && out_int === 1 && out_rad === S.One) {
            result = undefined;
        }
        else {
            const p1 = out_rad.__mul__(new Integer(out_int));
            const p2 = new Pow(new Integer(sqr_int), new Rational(sqr_gcd, expt.q));
            result = new Mul(true, true, p1, p2);
            if (this.is_negative()) {
                result = result.__mul__(new Pow(S.NegativeOne, expt));
            }
        }
        return result;
    }
}
Integer.is_integer = true;
Integer.is_Integer = true;
;
ManagedProperties.register(Integer);
class IntegerConstant extends Integer {
    constructor() {
        super(...arguments);
        this.__slots__ = [];
    }
}
;
ManagedProperties.register(IntegerConstant);
class Zero extends IntegerConstant {
    constructor() {
        super(0);
        this.__slots__ = [];
    }
}
Zero.is_positive = false;
Zero.static = false;
Zero.is_zero = true;
Zero.is_number = true;
Zero.is_comparable = true;
;
ManagedProperties.register(Zero);
class One extends IntegerConstant {
    constructor() {
        super(1);
        this.__slots__ = [];
    }
}
One.is_number = true;
One.is_positive = true;
One.is_zero = false;
;
ManagedProperties.register(One);
class NegativeOne extends IntegerConstant {
    constructor() {
        super(-1);
        this.__slots__ = [];
    }
    _eval_power(expt) {
        if (expt.is_odd) {
            return S.NegativeOne;
        }
        else if (expt.is_even) {
            return S.One;
        }
        if (expt instanceof _Number_) {
            if (expt instanceof Float) {
                return new Float(-1.0)._eval_power(expt);
            }
            if (expt === S.NaN) {
                return S.NaN;
            }
            if (expt === S.Infinity || expt === S.NegativeInfinity) {
                return S.NaN;
            }
        }
        return;
    }
}
NegativeOne.is_number = true;
;
ManagedProperties.register(NegativeOne);
class NaN extends _Number_ {
    constructor() {
        super(...arguments);
        this.__slots__ = [];
    }
}
NaN.is_commutative = true;
NaN.is_extended_real = undefined;
NaN.is_real = undefined;
NaN.is_rationa = undefined;
NaN.is_algebraic = undefined;
NaN.is_transcendental = undefined;
NaN.is_integer = undefined;
NaN.is_comparable = false;
NaN.is_finite = undefined;
NaN.is_zero = undefined;
NaN.is_prime = undefined;
NaN.is_positive = undefined;
NaN.is_negative = undefined;
NaN.is_number = true;
ManagedProperties.register(NaN);
class ComplexInfinity extends _AtomicExpr {
    constructor() {
        super();
        this.kind = NumberKind;
        this.__slots__ = [];
    }
}
ComplexInfinity.is_commutative = true;
ComplexInfinity.is_infinite = true;
ComplexInfinity.is_number = true;
ComplexInfinity.is_prime = false;
ComplexInfinity.is_complex = false;
ComplexInfinity.is_extended_real = false;
ManagedProperties.register(ComplexInfinity);
class Infinity extends _Number_ {
    constructor() {
        super();
        this.__slots__ = [];
    }
    __add__(other) {
        if (other instanceof _Number_ && global_parameters.evaluate) {
            if (other === S.Infinity || other === S.NaN) {
                return S.NaN;
            }
            return this;
        }
        return super.__add__(other);
    }
    __mul__(other) {
        if (other instanceof _Number_ && global_parameters.evaluate) {
            if (other === S.Zero || other === S.NaN) {
                return S.NaN;
            }
            else if (other.is_extended_positive) {
                return this;
            }
            return S.NegativeInfinity;
        }
        return super.__mul__(other);
    }
}
Infinity.is_commutative = true;
Infinity.is_number = true;
Infinity.is_complex = false;
Infinity.is_extended_real = true;
Infinity.is_infinite = true;
Infinity.is_comparable = true;
Infinity.is_extended_positive = true;
Infinity.is_prime = false;
class NegativeInfinity extends _Number_ {
    constructor() {
        super();
        this.__slots__ = [];
    }
    __add__(other) {
        if (other instanceof _Number_ && global_parameters.evaluate) {
            if (other === S.NegativeInfinity || other === S.NaN) {
                return S.NaN;
            }
            return this;
        }
        return super.__add__(other);
    }
    __mul__(other) {
        if (other instanceof _Number_ && global_parameters.evaluate) {
            if (other === S.Zero || other === S.NaN) {
                return S.NaN;
            }
            else if (other.is_extended_positive) {
                return this;
            }
            return S.Infinity;
        }
        return super.__mul__(other);
    }
}
NegativeInfinity.is_extended_real = true;
NegativeInfinity.is_complex = false;
NegativeInfinity.is_commutative = true;
NegativeInfinity.is_infinite = true;
NegativeInfinity.is_comparable = true;
NegativeInfinity.is_extended_negative = true;
NegativeInfinity.is_number = true;
NegativeInfinity.is_prime = false;
Singleton.register("Zero", Zero);
S.Zero = Singleton.registry["Zero"];
Singleton.register("One", One);
S.One = Singleton.registry["One"];
Singleton.register("NegativeOne", NegativeOne);
S.NegativeOne = Singleton.registry["NegativeOne"];
Singleton.register("NaN", NaN);
S.NaN = Singleton.registry["NaN"];
Singleton.register("ComplexInfinity", ComplexInfinity);
S.ComplexInfinity = Singleton.registry["ComplexInfinity"];
Singleton.register("Infinity", Infinity);
S.Infinity = Singleton.registry["Infinity"];
Singleton.register("NegativeInfinity", NegativeInfinity);
S.NegativeInfinity = Singleton.registry["NegativeInfinity"];
export { Rational, _Number_, Float, Integer, Zero, One };
//# sourceMappingURL=numbers.js.map