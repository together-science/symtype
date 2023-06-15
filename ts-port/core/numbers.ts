/*
Notable changes made (and notes):
- Number classes registered after they are defined
- Float is handeled entirely by decimal.js, and now only takes precision in
  # of decimal points
- Note: only methods necessary for add, mul, and pow have been implemented
*/

// basic implementations only - no utility added yet
import {_AtomicExpr} from "./expr.js";
import {NumberKind} from "./kind.js";
import {ManagedProperties} from "./assumptions.js";
import {global_parameters} from "./parameters.js";
import {Add} from "./add.js";
import {S, Singleton} from "./singleton.js";
import Decimal from "decimal.js";
import {as_int} from "../utilities/misc.js";
import {Pow} from "./power.js";
import {Global} from "./global.js";
import {divmod, factorint, factorrat, perfect_power} from "../ntheory/factor_.js";
import {HashDict} from "./utility.js";
import {Mul} from "./mul.js";

/*
utility functions

These are somewhat written differently than in sympy (which depends on mpmath)
but they provide the same functionality
*/

function igcd(x: number, y: number) {
    while (y) {
        const t = y;
        y = x % y;
        x = t;
    }
    return x;
}

export function int_nthroot(y: number, n: number) {
    const x = Math.floor(y**(1/n));
    const isexact = x**n === y;
    return [x, isexact];
}

// turn a float to a rational -> repliacates mpmath functionality but we should
// probably find a library to do this eventually
function toRatio(n: any, eps: number) {
    const gcde = (e: number, x: number, y: number) => {
        const _gcd: any = (a: number, b: number) => (b < e ? a : _gcd(b, a % b));
        return _gcd(Math.abs(x), Math.abs(y));
    };
    const c = gcde(Boolean(eps) ? eps : (1 / 10000), 1, n);
    return [Math.floor(n / c), Math.floor(1 / c)];
}

function igcdex(a: number = undefined, b: number = undefined) {
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
    } else {
        x_sign = 1;
    }
    if (b < 0) {
        b = -b;
        y_sign = -1;
    } else {
        y_sign = 1;
    }

    let [x, y, r, s] = [1, 0, 0, 1];
    let c; let q;
    while (b) {
        [c, q] = [a % b, Math.floor(a / b)];
        [a, b, r, s, x, y] = [b, c, x - q * r, y - q * s, r, s];
    }
    return [x * x_sign, y * y_sign, a];
}

function mod_inverse(a: any, m: any) {
    let c = undefined;
    [a, m] = [as_int(a), as_int(m)];
    if (m !== 1 && m !== -1) {
        // eslint-disable-next-line no-unused-vars
        const [x, b, g] = igcdex(a, m);
        if (g === 1) {
            c = x & m;
        }
    }
    return c;
}

Global.registerfunc("mod_inverse", mod_inverse);

class _Number_ extends _AtomicExpr {
    /*
    Represents atomic numbers in SymPy.
    Explanation
    ===========
    Floating point numbers are represented by the Float class.
    Rational numbers (of any size) are represented by the Rational class.
    Integer numbers (of any size) are represented by the Integer class.
    Float and Rational are subclasses of Number; Integer is a subclass
    of Rational.
    For example, ``2/3`` is represented as ``Rational(2, 3)`` which is
    a different object from the floating point number obtained with
    Python division ``2/3``. Even for numbers that are exactly
    represented in binary, there is a difference between how two forms,
    such as ``Rational(1, 2)`` and ``Float(0.5)``, are used in SymPy.
    The rational form is to be preferred in symbolic computations.
    Other kinds of numbers, such as algebraic numbers ``sqrt(2)`` or
    complex numbers ``3 + 4*I``, are not instances of Number class as
    they are not atomic.
    See Also
    ========
    Float, Integer, Rational
    */
    static is_commutative = true;
    static is_number = true;
    static is_Number = true;
    static kind = NumberKind;

    static new(...obj: any) {
        if (obj.length === 1) {
            obj = obj[0];
        }
        if (obj instanceof _Number_) {
            return obj;
        } else if (typeof obj === "number" && !Number.isInteger(obj) || obj instanceof Decimal || typeof obj === "string") {
            return new Float(obj);
        } else if (Number.isInteger(obj)) {
            return new Integer(obj);
        } else if (obj.length === 2) {
            return new Rational(obj[0], obj[1]);
        } else if (typeof obj === "string") {
            const _obj = obj.toLowerCase();
            if (_obj === "nan") {
                return S.NaN;
            } else if (_obj === "inf") {
                return S.Infinity;
            } else if (_obj === "+inf") {
                return S.Infinity;
            } else if (_obj === "-inf") {
                return S.NegativeInfinity;
            } else {
                throw new Error("argument for number is invalid");
            }
        }
        throw new Error("argument for number is invalid");
    }

    as_coeff_Mul(rational: boolean = false) {
        if (rational && !this.is_Rational) {
            return [S.One, this];
        }
        if (this) {
            return [this, S.One];
        } else {
            return [S.One, this];
        }
    }

    as_coeff_Add() {
        return [this, S.Zero];
    }

    // NOTE: THESE METHODS ARE NOT YET IMPLEMENTED IN THE SUPERCLASS

    __add__(other: any) {
        if (other instanceof _Number_ && global_parameters.evaluate) {
            if (other === S.NaN) {
                return S.NaN;
            } else if (other === S.Infinity) {
                return S.Infinity;
            } else if (other === S.NegativeInfinity) {
                return S.NegativeInfinity;
            }
        }
        return super.__add__(other);
    }

    __sub__(other: any) {
        if (other instanceof _Number_ && global_parameters.evaluate) {
            if (other === S.NaN) {
                return S.NaN;
            } else if (other === S.Infinity) {
                return S.NegativeInfinity;
            } else if (other === S.NegativeInfinity) {
                return S.Infinity;
            }
        }
        return super.__sub__(other);
    }

    __mul__(other: any) {
        if (other instanceof _Number_ && global_parameters.evaluate) {
            const cls: any = this.constructor;
            if (other === S.Nan) {
                return S.Nan;
            } else if (other === S.Infinity) {
                if (cls.is_zero) {
                    return S.NaN;
                } else if (cls.is_positive) {
                    return S.Infinity;
                } else {
                    return S.NegativeInfinity;
                }
            } else if (other === S.NegativeInfinity) {
                if (cls.is_zero) {
                    return S.NaN;
                } else if (cls.is_positive) {
                    return S.NegativeInfinity;
                } else {
                    return S.Infinity;
                }
            }
        }
        return super.__mul__(other);
    }
    __truediv__(other: any) {
        if (other instanceof _Number_ && global_parameters.evaluate) {
            if (other === S.NaN) {
                return S.NaN;
            } else if (other === S.Infinity || other === S.NegativeInfinity) {
                return S.Zero;
            }
        }
        return super.__truediv__(other);
    }

    eval_evalf(prec: number) {
        return new Float(this._float_val(prec), prec);
    }

    _float_val(prec: number): any {
        return undefined;
    }
};

// eslint-disable-next-line new-cap
ManagedProperties.register(_Number_);
Global.register("_Number_", _Number_.new);

class Float extends _Number_ {
    /*
    (not copying sympy comment because this implementation is very different)
    see header comment for changes
    */
    __slots__: any[] = ["_mpf_", "_prec"];
    _mpf_: [number, number, number, number];
    static is_rational: any = undefined;
    static is_irrational: any = undefined;
    static is_number = true;
    static is_real = true;
    static is_extended_real = true;
    static is_Float = true;
    decimal: Decimal;
    prec: number;

    constructor(num: any, prec: any = 15) {
        super();
        this.prec = prec;
        if (typeof num !== "undefined") {
            if (num instanceof Float) {
                this.decimal = num.decimal;
            } else if (num instanceof Decimal) {
                this.decimal = num;
            } else {
                this.decimal = new Decimal(num);
            }
        }
    }

    __add__(other: any) {
        if (global_parameters.evaluate && other instanceof _Number_) {
            const val = other._float_val(this.prec);
            return new Float(Decimal.set({precision: this.prec}).add(this.decimal, val.decimal), this.prec);
        }
        return super.__add__(other);
    }

    __sub__(other: any) {
        if (global_parameters.evaluate && other instanceof _Number_) {
            const val = other._float_val(this.prec);
            return new Float(Decimal.set({precision: this.prec}).sub(this.decimal, val.decimal), this.prec);
        }
        return super.__sub__(other);
    }

    __mul__(other: any) {
        if (global_parameters.evaluate && other instanceof _Number_) {
            const val = other._float_val(this.prec);
            return new Float(Decimal.set({precision: this.prec}).mul(this.decimal, val.decimal), this.prec);
        }
        return super.__mul__(other);
    }

    __truediv__(other: any) {
        if (global_parameters.evaluate && other instanceof _Number_) {
            const val = other._float_val(this.prec);
            return new Float(Decimal.set({precision: this.prec}).div(this.decimal, val.decimal), this.prec);
        }
        return super.__div__(other);
    }

    _eval_is_negative() {
        return this.decimal.lessThan(0);
    }

    _eval_is_positive() {
        return this.decimal.greaterThan(0);
    }

    // return new Float(Decimal.set({precision: this.prec}).pow(this.decimal, other.eval_evalf(this.prec).decimal), this.prec);

    _eval_power(expt: any) {
        if (this === S.Zero) {
            if (expt.is_extended_positive) {
                return this;
            } if (expt.is_extended_negative) {
                return S.ComplexInfinity;
            }
        }
        if (expt instanceof _Number_) {
            if (expt instanceof Integer) {
                const prec = this.prec;
                return new Float(Decimal.set({precision: this.prec}).pow(this.decimal, expt.p), prec);
            } else if (expt instanceof Rational &&
                expt.p === 1 && expt.q % 2 !== 0 && this.is_negative()) {
                const negpart = (this.__mul__(S.NegativeOne))._eval_power(expt);
                return new Mul(true, true, negpart, new Pow(S.NegativeOne, expt, false));
            }
            const val = expt._float_val(this.prec).decimal;
            const res = Decimal.set({precision: this.prec}).pow(this.decimal, val);
            if (res.isNaN()) {
                throw new Error("complex and imaginary numbers not yet implemented");
            }
            return new Float(res);
        }
    }

    _float_val(prec: number): any {
        return this;
    }

    inverse() {
        return new Float(1/(this.decimal as any));
    }

    _eval_is_finite() {
        return this.decimal.isFinite();
    }
}

ManagedProperties.register(Float);


class Rational extends _Number_ {
    static is_real = true;
    static is_integer = false;
    static is_rational = true;
    static is_number = true;
    p: number;
    q: number;
    __slots__: any[] = ["p", "q"];

    static is_Rational = true;


    constructor(p: any, q: any = undefined, gcd: number = undefined, simplify: boolean = true) {
        super();
        if (typeof q === "undefined") {
            if (p instanceof Rational) {
                return p;
            } else {
                if (typeof p === "number" && p % 1 !== 0) {
                    return new Rational(toRatio(p, 0.0001));
                } else {}
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
            p = p/gcd;
            q = q/gcd;
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

    __add__(other: any) {
        if (global_parameters.evaluate) {
            if (other instanceof Integer) {
                return new Rational(this.p + this.q * other.p, this.q, 1);
            } else if (other instanceof Rational) {
                return new Rational(this.p * other.q + this.q * other.p, this.q * other.q);
            } else if (other instanceof Float) {
                return other.__add__(this);
            } else {
                return super.__add__(other);
            }
        }
        return super.__add__(other);
    }

    __radd__(other: any) {
        return this.__add__(other);
    }

    __sub__(other: any) {
        if (global_parameters.evaluate) {
            if (other instanceof Integer) {
                return new Rational(this.q * other.p - this.p, this.q, 1);
            } else if (other instanceof Rational) {
                return new Rational(this.p * other.q - this.q * other.p, this.q * other.q);
            } else if (other instanceof Float) {
                return this.__mul__(S.NegativeOne).__add__(other);
            } else {
                return super.__sub__(other);
            }
        }
        return super.__sub__(other);
    }

    __rsub__(other: any) {
        if (global_parameters.evaluate) {
            if (other instanceof Integer) {
                return new Rational(this.p - this.q * other.p, this.q, 1);
            } else if (other instanceof Rational) {
                return new Rational(this.q * other.p - this.p * other.q, this.q * other.q);
            } else if (other instanceof Float) {
                return other.__mul__(S.NegativeOne).__add__(this);
            } else {
                return super.__rsub__(other);
            }
        }
        return super.__rsub__(other);
    }

    __mul__(other: any) {
        if (global_parameters.evaluate) {
            if (other instanceof Integer) {
                return new Rational(this.p * other.p, this.q, igcd(other.p, this.q));
            } else if (other instanceof Rational) {
                return new Rational(this.p * other.p, this.q * other.q, igcd(this.p, other.q) * igcd(this.q, other.p));
            } else if (other instanceof Float) {
                return other.__mul__(this);
            } else {
                return super.__mul__(other);
            }
        }
        return super.__mul__(other);
    }

    __rmul__(other: any) {
        return this.__mul__(other);
    }

    __truediv__(other: any) {
        if (global_parameters.evaluate) {
            if (other instanceof Integer) {
                return new Rational(this.p, this.q * other.p, igcd(this.p, other.p));
            } else if (other instanceof Rational) {
                return new Rational(this.p * other.q, this.q * other.p, igcd(this.p, other.p) * igcd(this.q, other.q));
            } else if (other instanceof Float) {
                return this.__mul__(other.inverse());
            } else {
                return super.__truediv__(other);
            }
        }
        return super.__truediv__(other);
    }

    __rtruediv__(other: any) {
        if (global_parameters.evaluate) {
            if (other instanceof Integer) {
                return new Rational(other.p * this.q, this.p, igcd(this.p, other.p));
            } else if (other instanceof Rational) {
                return new Rational(other.p * this.q, other.q * this.p, igcd(this.p, other.p) * igcd(this.q, other.q));
            } else if (other instanceof Float) {
                return other.__mul__(S.One.__truediv__(this));
            } else {
                return super.__rtruediv__(other);
            }
        }
        return super.__rtruediv__(other);
    }


    _eval_power(expt: any) {
        if (expt instanceof _Number_) {
            if (expt instanceof Float) {
                return this.eval_evalf(expt.prec)._eval_power(expt);
            } else if (expt instanceof Integer) {
                return new Rational(this.p ** expt.p, this.q ** expt.p, 1);
            } else if (expt instanceof Rational) {
                let intpart = Math.floor(expt.p / expt.q);
                if (intpart) {
                    intpart++;
                    const remfracpart = intpart * expt.q - expt.p;
                    const ratfracpart = new Rational(remfracpart, expt.q);
                    if (this.p !== 1) {
                        // eslint-disable-next-line max-len
                        return new Integer(this.p)._eval_power(expt).__mul__(new Integer(this.q))._eval_power(ratfracpart).__mul__(new Rational(1, this.q ** intpart, 1));
                    }
                    return new Integer(this.q)._eval_power(ratfracpart).__mul__(new Rational(1, this.q ** intpart, 1));
                } else {
                    const remfracpart = expt.q - expt.p;
                    const ratfracpart = new Rational(remfracpart, expt.q);
                    if (this.p !== 1) {
                        // eslint-disable-next-line max-len
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

    _float_val(prec: number): any {
        const a = new Decimal(this.p);
        const b = new Decimal(this.q);
        return new Float(Decimal.set({precision: prec}).div(a, b));
    }
    _as_numer_denom() {
        return [new Integer(this.p), new Integer(this.q)];
    }

    factors(limit: any = undefined) {
        return factorrat(this, limit);
    }

    _eval_is_negative() {
        if (this.p < 0 && this.q > 0) {
            return true;
        } else {
            return false;
        }
    }

    _eval_is_positive() {
        return !this._eval_is_negative;
    }

    _eval_is_odd() {
        console.log("hello");
        console.log(this);
        return this.p % 2 !== 0;
    }

    _eval_is_even() {
        console.log("eval even")
        return this.p % 2 === 0;
    }

    _eval_is_finite() {
        return this.p === S.Infinity || this.p === S.NegativeInfinity;
    }

    eq(other: Rational) {
        return this.p === other.p && this.q === other.q;
    }
};

// eslint-disable-next-line new-cap
ManagedProperties.register(Rational);

class Integer extends Rational {
    /*
    Represents integer numbers of any size.
    Examples
    ========
    >>> from sympy import Integer
    >>> Integer(3)
    3
    If a float or a rational is passed to Integer, the fractional part
    will be discarded; the effect is of rounding toward zero.
    >>> Integer(3.8)
    3
    >>> Integer(-3.8)
    -3
    A string is acceptable input if it can be parsed as an integer:
    >>> Integer("9" * 20)
    99999999999999999999
    It is rarely needed to explicitly instantiate an Integer, because
    Python integers are automatically converted to Integer when they
    are used in SymPy expressions.
    """
    */
    static is_integer = true;
    static is_Integer = true;
    __slots__: any[] = [];
    constructor(p: number) {
        super(p, undefined, undefined, false);
        this.p = p;
        if (p === 1) {
            return S.One;
        } else if (p === 0) {
            return S.Zero;
        } else if (p === -1) {
            return S.NegativeOne;
        }
    }

    factors(limit: any = undefined) {
        return factorint(this.p, limit);
    }

    __add__(other: any): any {
        if (global_parameters.evaluate) {
            if (Number.isInteger(other)) {
                return new Integer(this.p + other);
            } else if (other instanceof Integer) {
                return new Integer(this.p + other.p);
            } else if (other instanceof Rational) {
                return new Rational(this.p * other.q + other.p, other.q, 1);
            } else {
                return super.__add__(other);
            }
        } else {
            return new Add(true, true, this, other);
        }
    }

    __radd__(other: any): any {
        if (global_parameters.evaluate) {
            if (Number.isInteger(other)) {
                return new Integer(other + this.p);
            } else if (other instanceof Rational) {
                return new Rational(other.p + this.p * other.q, other.q, 1);
            } else {
                return super.__radd__(other);
            }
        } else {
            return super.__radd__(other);
        }
    }

    __sub__(other: any): any {
        if (global_parameters.evaluate) {
            if (Number.isInteger(other)) {
                return new Integer(this.p - other);
            } else if (other instanceof Integer) {
                return new Integer(this.p - other.p);
            } else if (other instanceof Rational) {
                return new Rational(this.p * other.q - other.p, other.q, 1);
            } else {
                return super.__sub__(other);
            }
        } else {
            return super.__sub__(other);
        }
    }

    __rsub__(other: any): any {
        if (global_parameters.evaluate) {
            if (Number.isInteger(other)) {
                return new Integer(this.p - other);
            } else if (other instanceof Rational) {
                return new Rational(other.p - this.p * other.q, other.q, 1);
            } else {
                return super.__rsub__(other);
            }
        } else {
            return super.__rsub__(other);
        }
    }

    __mul__(other: any): any {
        if (global_parameters.evaluate) {
            if (Number.isInteger(other) ) {
                return new Integer(this.p * other);
            } else if (other instanceof Integer) {
                return new Integer(this.p * other.p);
            } else if (other instanceof Rational) {
                return new Rational(this.p * other.p, other.q, igcd(this.p, other.q));
            } else {
                return super.__mul__(other);
            }
        } else {
            return super.__mul__(other);
        }
    }

    __rmul__(other: any): any {
        if (global_parameters.evaluate) {
            if (Number.isInteger(other) ) {
                return new Integer(other * this.p);
            } else if (other instanceof Rational) {
                return new Rational(other.p * this.p, other.q, igcd(this.p, other.q));
            } else {
                return super.__rmul__(other);
            }
        } else {
            return super.__rmul__(other);
        }
    }

    _eval_is_negative() {
        console.log("eval negative")
        return this.p < 0;
    }

    _eval_is_positive() {
        console.log("eval positive")
        return this.p > 0;
    }

    _eval_is_odd() {
        return this.p % 2 === 1;
    }

    _eval_power(expt: any): any {
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
            } else {
                return new Rational(1, this.p, 1)._eval_power(ne);
            }
        }
        const [x, xexact] = int_nthroot(Math.abs(this.p), expt.q);
        if (xexact) {
            let result = new Integer((x as number)**Math.abs(expt.p));
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
        } else {
            dict = new Integer(b_pos).factors(2**15);
        }

        let out_int = 1;
        let out_rad: Integer = S.One;
        let sqr_int = 1;
        let sqr_gcd = 0;
        const sqr_dict = new HashDict();
        let prime; let exponent;
        for ([prime, exponent] of dict.entries()) {
            exponent *= expt.p;
            const [div_e, div_m] = divmod(exponent, expt.q);
            if (div_e > 0) {
                out_int *= prime**div_e;
            }
            if (div_m > 0) {
                const g = igcd(div_m, expt.q);
                if (g !== 1) {
                    out_rad = out_rad.__mul__(new Pow(prime, new Rational(Math.floor(div_m/g), Math.floor(expt.q/g), 1)));
                } else {
                    sqr_dict.add(prime, div_m);
                }
            }
        }
        for (const [, ex] of sqr_dict.entries()) {
            if (sqr_gcd === 0) {
                sqr_gcd = ex;
            } else {
                sqr_gcd = igcd(sqr_gcd, ex);
                if (sqr_gcd === 1) {
                    break;
                }
            }
        }
        for (const [k, v] of sqr_dict.entries()) {
            sqr_int *= k**(Math.floor(v/sqr_gcd));
        }
        let result: any;
        if (sqr_int === b_pos && out_int === 1 && out_rad === S.One) {
            result = undefined;
        } else {
            const p1 = out_rad.__mul__(new Integer(out_int));
            const p2 = new Pow(new Integer(sqr_int), new Rational(sqr_gcd, expt.q));
            result = new Mul(true, true, p1, p2);
            if (this.is_negative()) {
                result = result.__mul__(new Pow(S.NegativeOne, expt));
            }
        }
        return result;
    }
};

ManagedProperties.register(Integer);


class IntegerConstant extends Integer {
    __slots__: any[] = [];
};

ManagedProperties.register(IntegerConstant);

class Zero extends IntegerConstant {
    /*
    The number zero.
    Zero is a singleton, and can be accessed by ``S.Zero``
    Examples
    ========
    >>> from sympy import S, Integer
    >>> Integer(0) is S.Zero
    True
    >>> 1/S.Zero
    zoo
    References
    ==========
    .. [1] https://en.wikipedia.org/wiki/Zero
    */
    __slots__: any[] = [];
    static is_positive = false;
    static static = false;
    static is_zero = true;
    static is_number = true;
    static is_comparable = true;
    constructor() {
        super(0);
    }
};

ManagedProperties.register(Zero);


class One extends IntegerConstant {
    /*
    The number one.
    One is a singleton, and can be accessed by ``S.One``.
    Examples
    ========
    >>> from sympy import S, Integer
    >>> Integer(1) is S.One
    True
    References
    ==========
    .. [1] https://en.wikipedia.org/wiki/1_%28number%29
    */
    static is_number = true;
    static is_positive = true;
    static is_zero = false;
    __slots__: any[] = [];
    constructor() {
        super(1);
    }
};

ManagedProperties.register(One);


class NegativeOne extends IntegerConstant {
    /*
    The number negative one.
    NegativeOne is a singleton, and can be accessed by ``S.NegativeOne``.
    Examples
    ========
    >>> from sympy import S, Integer
    >>> Integer(-1) is S.NegativeOne
    True
    See Also
    ========
    One
    References
    ==========
    .. [1] https://en.wikipedia.org/wiki/%E2%88%921_%28number%29
    */
    static is_number = true;
    __slots__: any[] = [];
    constructor() {
        super(-1);
    }

    _eval_power(expt: any) {
        if (expt.is_odd) {
            return S.NegativeOne;
        } else if (expt.is_even) {
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
};

ManagedProperties.register(NegativeOne);

class NaN extends _Number_ {
    /*
    Not a Number.
    Explanation
    ===========
    This serves as a place holder for numeric values that are indeterminate.
    Most operations on NaN, produce another NaN.  Most indeterminate forms,
    such as ``0/0`` or ``oo - oo` produce NaN.  Two exceptions are ``0**0``
    and ``oo**0``, which all produce ``1`` (this is consistent with Python's
    float).
    NaN is loosely related to floating point nan, which is defined in the
    IEEE 754 floating point standard, and corresponds to the Python
    ``float('nan')``.  Differences are noted below.
    NaN is mathematically not equal to anything else, even NaN itself.  This
    explains the initially counter-intuitive results with ``Eq`` and ``==`` in
    the examples below.
    NaN is not comparable so inequalities raise a TypeError.  This is in
    contrast with floating point nan where all inequalities are false.
    NaN is a singleton, and can be accessed by ``S.NaN``, or can be imported
    as ``nan``.
    Examples
    ========
    >>> from sympy import nan, S, oo, Eq
    >>> nan is S.NaN
    True
    >>> oo - oo
    nan
    >>> nan + 1
    nan
    >>> Eq(nan, nan)   # mathematical equality
    False
    >>> nan == nan     # structural equality
    True
    References
    ==========
    .. [1] https://en.wikipedia.org/wiki/NaN
    */
    static is_commutative = true;
    static is_extended_real: any = undefined;
    static is_real: any = undefined;
    static is_rationa: any = undefined;
    static is_algebraic: any = undefined;
    static is_transcendental: any = undefined;
    static is_integer: any = undefined;
    static is_comparable = false;
    static is_finite: any = undefined;
    static is_zero: any = undefined;
    static is_prime: any = undefined;
    static is_positive: any = undefined;
    static is_negative: any = undefined;
    static is_number = true;
    __slots__: any = [];
}

ManagedProperties.register(NaN);

// eslint-disable-next-line new-cap
class ComplexInfinity extends _AtomicExpr {
    /*
    Complex infinity.
    Explanation
    ===========
    In complex analysis the symbol `\tilde\infty`, called "complex
    infinity", represents a quantity with infinite magnitude, but
    undetermined complex phase.
    ComplexInfinity is a singleton, and can be accessed by
    ``S.ComplexInfinity``, or can be imported as ``zoo``.
    Examples
    ========
    >>> from sympy import zoo
    >>> zoo + 42
    zoo
    >>> 42/zoo
    0
    >>> zoo + zoo
    nan
    >>> zoo*zoo
    zoo
    See Also
    ========
    Infinity
    */
    static is_commutative = true;
    static is_infinite = true;
    static is_number = true;
    static is_prime = false;
    static is_complex = false;
    static is_extended_real = false;
    kind = NumberKind;
    __slots__: any = [];

    constructor() {
        super();
    }
}

ManagedProperties.register(ComplexInfinity);

class Infinity extends _Number_ {
    /*
    Positive infinite quantity.
    Explanation
    ===========
    In real analysis the symbol `\infty` denotes an unbounded
    limit: `x\to\infty` means that `x` grows without bound.
    Infinity is often used not only to define a limit but as a value
    in the affinely extended real number system.  Points labeled `+\infty`
    and `-\infty` can be added to the topological space of the real numbers,
    producing the two-point compactification of the real numbers.  Adding
    algebraic properties to this gives us the extended real numbers.
    Infinity is a singleton, and can be accessed by ``S.Infinity``,
    or can be imported as ``oo``.
    Examples
    ========
    >>> from sympy import oo, exp, limit, Symbol
    >>> 1 + oo
    oo
    >>> 42/oo
    0
    >>> x = Symbol('x')
    >>> limit(exp(x), x, oo)
    oo
    See Also
    ========
    NegativeInfinity, NaN
    References
    ==========
    .. [1] https://en.wikipedia.org/wiki/Infinity
    */
    static is_commutative = true;
    static is_number = true;
    static is_complex = false;
    static is_extended_real = true;
    static is_infinite = true;
    static is_comparable = true;
    static is_extended_positive = true;
    static is_prime = false;
    __slots__: any = [];

    constructor() {
        super();
    }

    // NOTE: more arithmetic methods should be implemented but I have only
    // done enough such that add and mul can handle infinity as an argument
    __add__(other: any) {
        if (other instanceof _Number_ && global_parameters.evaluate) {
            if (other === S.Infinity || other === S.NaN) {
                return S.NaN;
            }
            return this;
        }
        return super.__add__(other);
    }

    __mul__(other: any) {
        if (other instanceof _Number_ && global_parameters.evaluate) {
            if (other === S.Zero || other === S.NaN) {
                return S.NaN;
            } else if (other.is_extended_positive) {
                return this;
            }
            return S.NegativeInfinity;
        }
        return super.__mul__(other);
    }
}

class NegativeInfinity extends _Number_ {
    /*
    "Negative infinite quantity.
    NegativeInfinity is a singleton, and can be accessed
    by ``S.NegativeInfinity``.
    See Also
    ========
    Infinity
    */
    static is_extended_real = true;
    static is_complex = false;
    static is_commutative = true;
    static is_infinite = true;
    static is_comparable = true;
    static is_extended_negative = true;
    static is_number = true;
    static is_prime = false;
    __slots__: any = [];

    constructor() {
        super();
    }

    // NOTE: more arithmetic methods should be implemented but I have only
    // done enough such that add and mul can handle negativeinfinity as an argument
    __add__(other: any) {
        if (other instanceof _Number_ && global_parameters.evaluate) {
            if (other === S.NegativeInfinity || other === S.NaN) {
                return S.NaN;
            }
            return this;
        }
        return super.__add__(other);
    }

    __mul__(other: any) {
        if (other instanceof _Number_ && global_parameters.evaluate) {
            if (other === S.Zero || other === S.NaN) {
                return S.NaN;
            } else if (other.is_extended_positive) {
                return this;
            }
            return S.Infinity;
        }
        return super.__mul__(other);
    }
}

// Registering singletons (see singleton class)
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

export {Rational, _Number_, Float, Integer, Zero, One};
