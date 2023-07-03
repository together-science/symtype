/*
Changes made (WB and GM):
- Added constructor to explicitly call AssocOp superclass
- Added "simplify" argument, which prevents infinite recursion in AssocOp
- Note: Order objects in Add are not yet implemented
*/

import {Expr} from "./expr";
import {AssocOp} from "./operations";
import {base, mix, HashDict} from "./utility";
import {S} from "./singleton";
import {Basic} from "./basic";
import {ManagedProperties} from "./assumptions";
import {Mul} from "./mul";
import {Global} from "./global";
import {_fuzzy_group} from "./logic";

function _addsort(args: any[]) {
    // eslint-disable-next-line new-cap
    return args.sort((a, b) => Basic.cmp(a, b));
}

export class Add extends mix(base).with(Expr, AssocOp) {
    /*
    """
    Expression representing addition operation for algebraic group.
    .. deprecated:: 1.7
       Using arguments that aren't subclasses of :class:`~.Expr` in core
       operators (:class:`~.Mul`, :class:`~.Add`, and :class:`~.Pow`) is
       deprecated. See :ref:`non-expr-args-deprecated` for details.
    Every argument of ``Add()`` must be ``Expr``. Infix operator ``+``
    on most scalar objects in SymPy calls this class.
    Another use of ``Add()`` is to represent the structure of abstract
    addition so that its arguments can be substituted to return different
    class. Refer to examples section for this.
    ``Add()`` evaluates the argument unless ``evaluate=False`` is passed.
    The evaluation logic includes:
    1. Flattening
        ``Add(x, Add(y, z))`` -> ``Add(x, y, z)``
    2. Identity removing
        ``Add(x, 0, y)`` -> ``Add(x, y)``
    3. Coefficient collecting by ``.as_coeff_Mul()``
        ``Add(x, 2*x)`` -> ``Mul(3, x)``
    4. Term sorting
        ``Add(y, x, 2)`` -> ``Add(2, x, y)``
    If no argument is passed, identity element 0 is returned. If single
    element is passed, that element is returned.
    Note that ``Add(*args)`` is more efficient than ``sum(args)`` because
    it flattens the arguments. ``sum(a, b, c, ...)`` recursively adds the
    arguments as ``a + (b + (c + ...))``, which has quadratic complexity.
    On the other hand, ``Add(a, b, c, d)`` does not assume nested
    structure, making the complexity linear.
    Since addition is group operation, every argument should have the
    same :obj:`sympy.core.kind.Kind()`.
    Examples
    ========
    >>> from sympy import Add, I
    >>> from sympy.abc import x, y
    >>> Add(x, 1)
    x + 1
    >>> Add(x, x)
    2*x
    >>> 2*x**2 + 3*x + I*y + 2*y + 2*x/5 + 1.0*y + 1
    2*x**2 + 17*x/5 + 3.0*y + I*y + 1
    If ``evaluate=False`` is passed, result is not evaluated.
    >>> Add(1, 2, evaluate=False)
    1 + 2
    >>> Add(x, x, evaluate=False)
    x + x
    ``Add()`` also represents the general structure of addition operation.
    >>> from sympy import MatrixSymbol
    >>> A,B = MatrixSymbol('A', 2,2), MatrixSymbol('B', 2,2)
    >>> expr = Add(x,y).subs({x:A, y:B})
    >>> expr
    A + B
    >>> type(expr)
    <class 'sympy.matrices.expressions.matadd.MatAdd'>
    Note that the printers do not display in args order.
    >>> Add(x, 1)
    x + 1
    >>> Add(x, 1).args
    (1, x)
    See Also
    ========
    MatAdd
    """
    */

    __slots__: any[] = [];
    args: any[];
    static is_Add: any = true; 
    // eslint-disable-next-line new-cap
    static _args_type = Expr(Object);
    static identity = S.Zero; 

    constructor(evaluate: boolean, simplify: boolean, ...args: any) {
        super(Add, evaluate, simplify, ...args);
    }

    flatten(seq: any[]) {
        /*
        Takes the sequence "seq" of nested Adds and returns a flatten list.
        Returns: (commutative_part, noncommutative_part, order_symbols)
        Applies associativity, all terms are commutable with respect to
        addition.
        NB: the removal of 0 is already handled by AssocOp.__new__
        See also
        ========
        sympy.core.mul.Mul.flatten
        */
        let rv = undefined;
        if (seq.length === 2) {
            let [a, b] = seq;
            if (b.is_Rational()) {
                [a, b] = [b, a];
            }
            if (a.is_Rational()) {
                if (b.is_Mul()) {
                    rv = [[a, b], [], undefined];
                }
            }
            if (rv) {
                let allc = true;
                for (const s of rv[0]) {
                    if (s.is_commutative() === false) {
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
            if (o.is_Number()) {
                if ((o === S.NaN || (coeff === S.ComplexInfinity && o.is_finite() === false))) {
                    return [[S.NaN], [], undefined];
                }
                if (coeff.is_Number()) {
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
            } else if (o.is_Add()) {
                seq.push(...o._args);
                continue;
            } else if (o.is_Mul()) {
                [c, s] = o.as_coeff_Mul();
            } else if (o.is_Pow()) {
                const pair = o.as_base_exp();
                const b = pair[0];
                const e = pair[1];
                if (b.is_Number() && (e.is_Integer() || (e.is_Rational() && e.is_negative()))) {
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
            if (c.is_zero()) {
                continue;
            } else if (c === S.One) {
                newseq.push(s);
            } else {
                if (s.is_Mul()) {
                    const cs = s._new_rawargs(true, ...[c].concat(s._args));
                    newseq.push(cs);
                } else if (s.is_Add()) {
                    newseq.push(new Mul(false, true, c, s));
                } else {
                    newseq.push(new Mul(true, true, c, s));
                }
            }
            noncommutative = noncommutative || !(s.is_commutative());
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
                if (!(c.is_finite() === true || typeof c.is_extended_real() !== "undefined")) {
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
            fuzzyarg.push(a.is_commutative());
        }
        return _fuzzy_group(fuzzyarg);
    }

    as_coeff_Add() {
        const [coeff, args] = [this.args[0], this.args.slice(1)];
        if (coeff.is_Number() && coeff.is_Rational()) {
            return [coeff, this._new_rawargs(true, ...args)];
        }
        return [S.Zero, this];
    }

    static _new(evaluate: boolean, simplify: boolean, ...args: any) {
        return new Add(evaluate, simplify, ...args);
    }

    // WB addition for jasmine tests
    toString() {
        let result = "";
        const num_args = this._args.length
        for (let i = 0; i < num_args; i++) {
            const arg = this._args[i];
            let temp;
            if (i != num_args - 1) {
                temp = arg.toString() + " + "
            } else {
                temp = arg.toString();
            }
            result = result.concat(temp)
        }
 
        return result;
    }
}

ManagedProperties.register(Add);
Global.register("Add", Add._new);
