/*
Notable changes made (and notes):
- Number classes registered after they are defined
- Most methods are not yet implemented
- (As with other subclasses of basic) all properties are static
*/

// basic implementations only - no utility added yet
import {AtomicExpr} from "./expr.js";
import {mix, base} from "./utility.js";
import {NumberKind} from "./kind.js";
import {ManagedProperties} from "./assumptions.js";
import {S} from "./singleton.js";

const _Number = (superclass: any) => class _Number extends mix(base).with(AtomicExpr) {
    static is_commutative = true;
    static is_number = true;
    static is_Number = true;
    static kind = NumberKind;

    static new(...obj: any) {
        if (obj.length === 1) {
            obj = obj[0];
        }
        if (obj instanceof _Number) {
            return obj;
        }
        if (Number.isInteger(obj)) {
            if (obj === 0) {
                return S.Zero;
            } if (obj === 1) {
                return S.One;
            }
            return new Integer(obj);
        }
        if (obj.length === 2) {
            return new Rational(...obj);
        }
    }
};

// eslint-disable-next-line new-cap
const _Number_ = _Number(Object);
ManagedProperties.register(_Number_);

const _Rational = (superclass: any) => class _Rational extends mix(base).with(_Number) {
    static is_real = true;
    static is_integer = false;
    static is_rational = true;
    static is_number = true;
    p: Number;
    q: Number;

    __slots__: any[] = ["p", "q"];

    static is_Rational = true;

    constructor(...args: any[]) {
        super();
        this.p = args[0];
        this.q = args[1];
    }

    hashKey() {
        return this.constructor.name + this.p + this.q;
    }
};

// eslint-disable-next-line new-cap
const Rational = _Rational(Object);
ManagedProperties.register(Rational);

const _Integer = (superclass: any) => class _Integer extends mix(base).with(_Rational) {
    static is_integer = true;
    static q = 1;
    static is_Integer = true;
    __slots__: any[] = [];

    constructor(p: any) {
        super();
        this.p = p;
    }
};

// eslint-disable-next-line new-cap
const Integer = _Integer(Object);
ManagedProperties.register(Integer);

const _IntegerConstant = (superclass: any) => class _IntegerConstant extends mix(base).with(_Integer) {
    __slots__: any[] = [];
};

// eslint-disable-next-line new-cap
// eslint-disable-next-line new-cap
const IntegerConstant = _IntegerConstant(Object);
ManagedProperties.register(IntegerConstant);

const _Zero = (superclass: any) => class _Zero extends mix(base).with(_IntegerConstant) {
    __slots__: any[] = [];
    static p = 0;
    static q = 1;
    static is_positive = false;
    static is_negative = false;
    static is_zero = true;
    static is_number = true;
    static is_comparable = true;
};

// eslint-disable-next-line new-cap
const Zero = _Zero(Object);
ManagedProperties.register(Zero);


const _One = (superclass: any) => class _One extends mix(base).with(_IntegerConstant) {
    static is_number = true;
    static is_positive = true;
    static p = 1;
    static q = 1;
    __slots__: any[] = [];
};

// eslint-disable-next-line new-cap
const One = _One(Object);
ManagedProperties.register(One);


export {Rational, _Number_, Zero, One};
