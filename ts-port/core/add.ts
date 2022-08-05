/*
Work-in progress: currently forms unevaluated add objects
*/

import {Expr} from "./expr.js";
import {AssocOp} from "./operations.js";
import {base, mix, HashDict} from "./utility.js";
import {S} from "./singleton.js";
import {Basic} from "./basic.js";
import {_Number_} from "./numbers.js";
import {ManagedProperties} from "./assumptions.js";
import {Symbol} from "./symbol.js";

function _addsort(args: any[]) {
    // eslint-disable-next-line new-cap
    args.sort((a, b) => Basic.cmp(a, b));
}


// eslint-disable-next-line no-unused-vars
class Add extends mix(base).with(Expr, AssocOp) {
    /*
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
    */
    __slots__: any[] = [];
    args: any[];
    static is_Add = true;
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
            if (b.constructor.is_rational) {
                [a, b] = [b, a];
            }
            if (a.constructor.is_Rational) {
                if (b.constructor.is_Mul) {
                    rv = [[a, b], [], undefined];
                }
            } if (typeof rv !== "undefined") {
                let all_commutative = true;
                for (const s of rv[0]) {
                    if (!(s.constructor.is_commutative)) {
                        all_commutative = false;
                    }
                }
                if (all_commutative) {
                    return rv;
                }
                return [[], rv[0], undefined];
            }
        }

        const terms: HashDict = new HashDict();
        let coeff: any = S.Zero;
        let order_factors: any[] = [];
        const extra: any[] = [];
        for (let o of seq) {
            if (o.constructor.is_Order) {
                if (o.expr.constructor.is_zero) {
                    continue;
                } for (const o1 of order_factors) {
                    if (o1.has(o)) {
                        o = undefined;
                        break;
                    }
                }
                if (typeof o === "undefined") {
                    continue;
                }
                const temp = [o];
                for (const o1 of order_factors) {
                    if (!(o.has(o1))) {
                        temp.push(o1);
                    }
                }
                order_factors = temp;
                continue;
            }
            const c = S.One;
            const s = o;
            // if (s in terms.dict) {
            //     terms.add(s, [terms.get(s)].concat(c));
            // } else {
            //     terms.add(s, c);
            // }
            terms.add(s, c);
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
            }
            noncommutative = noncommutative || !(s.constructor.is_commutative);
        }
        if (order_factors.length) {
            const newseq2: any[] = [];
            for (let t of newseq) {
                for (const o of order_factors) {
                    if (o.has(t)) {
                        t = undefined;
                        break;
                    }
                }
                if (typeof t !== "undefined") {
                    newseq2.push(t);
                }
            }
            newseq = newseq2.concat(order_factors);
            for (const o of order_factors) {
                if (o.has(coeff)) {
                    coeff = S.Zero;
                    break;
                }
            }
        }
        _addsort(newseq);

        if (coeff !== S.Zero) {
            newseq.splice(0, 0, coeff);
        }

        if (extra.length) {
            newseq.push(extra);
            noncommutative = true;
        }

        if (noncommutative) {
            return [[], newseq, undefined];
        } else {
            return [newseq, [], undefined];
        }
    }
}

ManagedProperties.register(Add);

export {Add};

const n1 = _Number_.new(0);
const n2 = _Number_.new(2);
const n3 = _Number_.new(1);
const x = new Symbol("x");
// This example works, and returns Add(2, x)
console.log(new Add(true, true, n1, x, n2));

// This example does NOT work, because the system currently has no way to
// evaluate 1 + 2, and I'm not quite sure how this is evaluated in their code.
// This SHOULD return Add(3, x)
console.log(new Add(true, true, n1, n3, x));

