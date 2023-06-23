import {divmod} from "../ntheory/factor_";
import {Add} from "./add";
import {ManagedProperties} from "./assumptions";
import {Basic} from "./basic";
import {Expr} from "./expr";
import {Global} from "./global";
import {fuzzy_notv2, _fuzzy_groupv2} from "./logic";
import {Integer, Rational} from "./numbers";
import {AssocOp} from "./operations";
import {global_parameters} from "./parameters";
import {Pow} from "./power";
import {S} from "./singleton";
import {mix, base, HashDict, HashSet, ArrDefaultDict} from "./utility";

// # internal marker to indicate:
// "there are still non-commutative objects -- don't forget to process them"

// not currently being used
class NC_Marker {
    is_Order = false;
    is_Mul = false;
    is_Number = false;
    is_Poly = false;

    is_commutative = false;
}

function _mulsort(args: any[]) {
    // eslint-disable-next-line new-cap
    args.sort((a, b) => Basic.cmp(a, b));
}

export class Mul extends mix(base).with(Expr, AssocOp) {
    /*
    Expression representing multiplication operation for algebraic field.
    .. deprecated:: 1.7
       Using arguments that aren't subclasses of :class:`~.Expr` in core
       operators (:class:`~.Mul`, :class:`~.Add`, and :class:`~.Pow`) is
       deprecated. See :ref:`non-expr-args-deprecated` for details.
    Every argument of ``Mul()`` must be ``Expr``. Infix operator ``*``
    on most scalar objects in SymPy calls this class.
    Another use of ``Mul()`` is to represent the structure of abstract
    multiplication so that its arguments can be substituted to return
    different class. Refer to examples section for this.
    ``Mul()`` evaluates the argument unless ``evaluate=False`` is passed.
    The evaluation logic includes:
    1. Flattening
        ``Mul(x, Mul(y, z))`` -> ``Mul(x, y, z)``
    2. Identity removing
        ``Mul(x, 1, y)`` -> ``Mul(x, y)``
    3. Exponent collecting by ``.as_base_exp()``
        ``Mul(x, x**2)`` -> ``Pow(x, 3)``
    4. Term sorting
        ``Mul(y, x, 2)`` -> ``Mul(2, x, y)``
    Since multiplication can be vector space operation, arguments may
    have the different :obj:`sympy.core.kind.Kind()`. Kind of the
    resulting object is automatically inferred.
    Examples
    ========
    >>> from sympy import Mul
    >>> from sympy.abc import x, y
    >>> Mul(x, 1)
    x
    >>> Mul(x, x)
    x**2
    If ``evaluate=False`` is passed, result is not evaluated.
    >>> Mul(1, 2, evaluate=False)
    1*2
    >>> Mul(x, x, evaluate=False)
    x*x
    ``Mul()`` also represents the general structure of multiplication
    operation.
    >>> from sympy import MatrixSymbol
    >>> A = MatrixSymbol('A', 2,2)
    >>> expr = Mul(x,y).subs({y:A})
    >>> expr
    x*A
    >>> type(expr)
    <class 'sympy.matrices.expressions.matmul.MatMul'>
    See Also
    ========
    MatMul
    */
    __slots__: any[] = [];
    args: any[];
    static is_Mul = true;
    _args_type = Expr;
    static identity = S.One;

    constructor(evaluate: boolean, simplify: boolean, ...args: any) {
        super(Mul, evaluate, simplify, ...args);
    }

    flatten(seq: any) {
        /* Return commutative, noncommutative and order arguments by
        combining related terms.
        Notes
        =====
            * In an expression like ``a*b*c``, Python process this through SymPy
              as ``Mul(Mul(a, b), c)``. This can have undesirable consequences.
              -  Sometimes terms are not combined as one would like:
                 {c.f. https://github.com/sympy/sympy/issues/4596}
                >>> from sympy import Mul, sqrt
                >>> from sympy.abc import x, y, z
                >>> 2*(x + 1) # this is the 2-arg Mul behavior
                2*x + 2
                >>> y*(x + 1)*2
                2*y*(x + 1)
                >>> 2*(x + 1)*y # 2-arg result will be obtained first
                y*(2*x + 2)
                >>> Mul(2, x + 1, y) # all 3 args simultaneously processed
                2*y*(x + 1)
                >>> 2*((x + 1)*y) # parentheses can control this behavior
                2*y*(x + 1)
                Powers with compound bases may not find a single base to
                combine with unless all arguments are processed at once.
                Post-processing may be necessary in such cases.
                {c.f. https://github.com/sympy/sympy/issues/5728}
                >>> a = sqrt(x*sqrt(y))
                >>> a**3
                (x*sqrt(y))**(3/2)
                >>> Mul(a,a,a)
                (x*sqrt(y))**(3/2)
                >>> a*a*a
                x*sqrt(y)*sqrt(x*sqrt(y))
                >>> _.subs(a.base, z).subs(z, a.base)
                (x*sqrt(y))**(3/2)
              -  If more than two terms are being multiplied then all the
                 previous terms will be re-processed for each new argument.
                 So if each of ``a``, ``b`` and ``c`` were :class:`Mul`
                 expression, then ``a*b*c`` (or building up the product
                 with ``*=``) will process all the arguments of ``a`` and
                 ``b`` twice: once when ``a*b`` is computed and again when
                 ``c`` is multiplied.
                 Using ``Mul(a, b, c)`` will process all arguments once.
            * The results of Mul are cached according to arguments, so flatten
              will only be called once for ``Mul(a, b, c)``. If you can
              structure a calculation so the arguments are most likely to be
              repeats then this can save time in computing the answer. For
              example, say you had a Mul, M, that you wished to divide by ``d[i]``
              and multiply by ``n[i]`` and you suspect there are many repeats
              in ``n``. It would be better to compute ``M*n[i]/d[i]`` rather
              than ``M/d[i]*n[i]`` since every time n[i] is a repeat, the
              product, ``M*n[i]`` will be returned without flattening -- the
              cached value will be returned. If you divide by the ``d[i]``
              first (and those are more unique than the ``n[i]``) then that will
              create a new Mul, ``M/d[i]`` the args of which will be traversed
              again when it is multiplied by ``n[i]``.
              {c.f. https://github.com/sympy/sympy/issues/5706}
              This consideration is moot if the cache is turned off.
            NB
            --
              The validity of the above notes depends on the implementation
              details of Mul and flatten which may change at any time. Therefore,
              you should only consider them when your code is highly performance
              sensitive.
              Removal of 1 from the sequence is already handled by AssocOp.__new__.
        */
        let rv = undefined;
        if (seq.length === 2) {
            let [a, b] = seq;
            if (b.is_Rational()) {
                [a, b] = [b, a];
                seq = [a, b];
            }
            if (!(a.is_zero() && a.is_Rational())) {
                let r;
                [r, b] = b.as_coeff_Mul();
                if (b.is_Add()) {
                    if (r !== S.One) {
                        let arb;
                        const ar = a.__mul__(r);
                        if (ar === S.One) {
                            arb = b;
                        } else {
                            arb = this.constructor(false, true, a.__mul__(r), b);
                        }
                        rv = [[arb], [], undefined];
                    } else if (global_parameters.distribute && b.is_commutative()) {
                        const arg: any = [];
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

        let c_part: any = [];
        const nc_seq = [];
        let nc_part: any = [];
        let coeff = S.One;
        let c_powers = [];
        let neg1e = S.Zero; let num_exp = [];
        const pnum_rat = new HashDict();
        const order_symbols: any[] = [];

        for (let o of seq) {
            if (o.is_Mul()) {
                if (o.is_commutative()) {
                    seq.push(...o._args);
                } else {
                    for (const q of o._args) {
                        if (q.is_commutative()) {
                            seq.push(q);
                        } else {
                            nc_seq.push(q);
                        }
                    }
                }
                continue;
            } else if (o.is_Number()) {
                if (o === S.NaN || coeff === S.ComplexInfinity && o.is_zero()) {
                    return [[S.NaN], [], undefined];
                } else if (coeff.is_Number()) {
                    coeff = coeff.__mul__(o);
                    if (coeff === S.NaN) {
                        return [[S.NaN], [], undefined];
                    }
                }
                continue;
            } else if (o === S.ComplexInfinity) {
                if (!(coeff)) {
                    return [[S.NaN], [], undefined];
                }
                coeff = S.ComplexInfinity;
                continue;
            } else if (o.is_commutative()) {
                let e; let b;
                [b, e] = o.as_base_exp();
                if (o.is_Pow()) {
                    if (b.is_Number()) {
                        if (e.is_Rational()) {
                            if (e.is_Integer()) {
                                coeff = coeff.__mul__(new Pow(b, e));
                                continue;
                            } else if (e.is_negative()) {
                                seq.push(new Pow(b, e));
                                continue;
                            } else if (b.is_negative()) {
                                neg1e = neg1e.__add__(e);
                                b = b.__mul__(S.NegativeOne);
                            }
                            if (b !== S.One) {
                                pnum_rat.setdefault(b, []).push(e);
                            }
                            continue;
                        } else if (b.is_positive() || b.is_integer()) {
                            num_exp.push([b, e]);
                            continue;
                        }
                    }
                }
                c_powers.push([b, e]);
            } else {
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
                    if (b1.eq(b2) && !(new_exp.is_Add())) {
                        const o12 = b1._eval_power(new_exp);
                        if (o12.is_commutative()) {
                            seq.push(o12);
                            continue;
                        } else {
                            nc_seq.splice(0, 0, o12);
                        }
                    } else {
                        nc_part.push(o1);
                        nc_part.push(o);
                    }
                }
            }
        }

        function _gather(c_powers: any[]) {
            const common_b = new HashDict();
            for (const [b, e] of c_powers) {
                const co = e.as_coeff_Mul();
                common_b.setdefault(b, new HashDict()).setdefault(co[1], []).push(co[0]);
            }
            // eslint-disable-next-line no-unused-vars
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
            const new_c_powers: any[] = [];
            let changed = false;
            for (let [b, e] of c_powers) {
                let p: any;
                if (e.is_zero() === true) {
                    if ((b.is_Add() || b.is_Mul() &&
                        b._args.includes(S.ComplexInfinity, S.Infinity, S.NefativeInfinity))) {
                        return [[S.NaN], [], undefined];
                    }
                    continue;
                }
                if (e === S.One) {
                    if (b.is_Number()) {
                        coeff = coeff.__mul__(b);
                        continue;
                    }
                    p = b;
                }
                if (e !== S.One) {
                    p = new Pow(b, e);
                    if (p.is_Pow() && !b.is_Pow()) {
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
            // eslint-disable-next-line no-unused-vars
            for (const [b, e] of new_c_powers) {
                argset.add(b);
            }
            if (changed && argset.size !== new_c_powers.length) {
                c_part = [];
                c_powers = _gather(new_c_powers);
            } else {
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
            let [bi, ei]: any = num_rat[i];
            const grow = [];
            for (let j = i + 1; j < num_rat.length; j++) {
                const [bj, ej]: any = num_rat[j];
                const g = bi.gcd(bj);
                if (g !== S.One) {
                    let e = ei.__add__(ej);
                    if (e.q === 1) {
                        coeff = coeff.__mul__(new Pow(g, e));
                    } else {
                        if (e.p > e.q) {
                            const [e_i, ep] = divmod(e.p, e.q);
                            coeff = coeff.__mul__(new Pow(g, e_i));
                            e = new Rational(ep, e.q);
                        }
                        grow.push([g, e]);
                    }
                    num_rat[j] = [bj/g, ej];
                    bi = bi/g;
                    if (bi === S.One) {
                        break;
                    }
                }
            }
            if (bi !== S.One) {
                const obj: any = new Pow(bi, ei);
                if (obj.is_Number()) {
                    coeff = coeff.__mul__(obj);
                } else {
                    for (const item of this.make_args(Mul, obj)) { // !!!!!!
                        if (item.is_Number()) {
                            coeff = coeff.__mul__(obj);
                        } else {
                            [bi, ei] = item._args;
                            pnew.add(ei, pnew.get(ei).concat(bi));
                        }
                    }
                }
            }
            num_rat.push(...grow);
            i++;
        }

        if (neg1e !== S.Zero) {
            let n; let q; let p;
            [p, q] = neg1e._as_numer_denom();
            [n, p] = divmod(p.p, q.p);
            if (n % 2 !== 0) {
                coeff = coeff.__mul__(S.NegativeOne);
            }
            if (q === 2) {
                throw new Error("imaginary numbers not yet supported");
            } else if (p) {
                neg1e = new Rational(p, q);
                let enterelse: boolean = true;
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
        for (let [e, b] of pnew.entries()) {
            if (Array.isArray(b)) {
                b = b[0];
            }
            c_part_argv2.push(new Pow(b, e));
        }
        c_part.push(...c_part_argv2);

        if (coeff === S.Infinity || coeff === S.NegativeInfinity) {
            function _handle_for_oo(c_part: any[], coeff_sign: number) {
                const new_c_part = [];
                for (const t of c_part) {
                    if (t.is_extended_positive()) {
                        continue;
                    }
                    if (t.is_extended_negative()) {
                        coeff_sign *= -1;
                        continue;
                    }
                    new_c_part.push(t);
                }
                return [new_c_part, coeff_sign];
            }
            let coeff_sign: any;
            [c_part, coeff_sign] = _handle_for_oo(c_part, 1);
            [nc_part, coeff_sign] = _handle_for_oo(nc_part, coeff_sign);
            coeff = coeff.__mul__(new Integer(coeff_sign));
        }

        if (coeff === S.ComplexInfinity) {
            const ctemp = [];
            for (const c of c_part) {
                if (!(fuzzy_notv2(c.is_zero()) && c.is_extended_real() !== "undefined")) {
                    ctemp.push(c);
                }
            }
            c_part = ctemp;
            const nctemp = [];
            for (const c of nc_part) {
                if (!(fuzzy_notv2(c.is_zero()) && c.is_extended_real() !== "undefined")) {
                    nctemp.push(c);
                }
            }
            nc_part = nctemp;
        } else if (coeff.is_zero()) {
            for (const c of c_part) {
                if (c.is_finite() === false) {
                    return [[S.NaN], [], order_symbols];
                }
            }
        }

        const _new = [];
        for (const i of c_part) {
            if (i.is_Number()) {
                coeff = coeff.__mul__(i);
            } else {
                _new.push(i);
            }
        }
        c_part = _new;

        _mulsort(c_part);

        if (coeff !== S.One) {
            c_part.splice(0, 0, coeff);
        }

        if (global_parameters.distribute && !nc_part && c_part.length === 2 &&
            c_part[0].is_Number() && c_part[0].is_finite() && c_part[1].is_Add()) {
            coeff = c_part[0];
            const addarg = [];
            for (const f of c_part[1]._args) {
                addarg.push(coeff.__mul__(f));
            }
            c_part = new Add(true, true, ...addarg);
        }
        return [c_part, nc_part, order_symbols];
    }

    as_coeff_Mul(rational: boolean = false) {
        const coeff: any = this._args.slice(0, 1)[0];
        const args: any = this._args.slice(1);

        if (coeff.is_Number()) {
            if (!rational || coeff.is_Rational()) {
                if (args.length === 1) {
                    return [coeff, args[0]];
                } else {
                    return [coeff, this._new_rawargs(true, ...args)];
                }
            } else if (coeff.is_extended_negative()) {
                return [S.NegativeOne, this._new_rawargs(true, ...[-coeff].concat(args))];
            }
        }
        return [S.One, this];
    }

    _eval_power(e: any) {
        const [cargs, nc] = this.args_cnc(false, true, false);
        if (e.is_Integer()) {
            const mulargs = [];
            for (const b of cargs) {
                mulargs.push(new Pow(b, e, false));
            }
            return new Mul(true, true, ...mulargs).__mul__(
                new Pow(this._from_args(Mul, undefined, ...nc), e, false));
        }
        const p = new Pow(this, e, false);

        if (e.is_Rational() || e.is_Float()) {
            return p._eval_expand_power_base();
        }

        return p;
    }

    _keep_coeff(coeff: any, factors: any, clear: boolean = true, sign: boolean = false): any {
        /* Return ``coeff*factors`` unevaluated if necessary.
        If ``clear`` is False, do not keep the coefficient as a factor
        if it can be distributed on a single factor such that one or
        more terms will still have integer coefficients.
        If ``sign`` is True, allow a coefficient of -1 to remain factored out.
        Examples
        ========
        >>> from sympy.core.mul import _keep_coeff
        >>> from sympy.abc import x, y
        >>> from sympy import S
        >>> _keep_coeff(S.Half, x + 2)
        (x + 2)/2
        >>> _keep_coeff(S.Half, x + 2, clear=False)
        x/2 + 1
        >>> _keep_coeff(S.Half, (x + 2)*y, clear=False)
        y*(x + 2)/2
        >>> _keep_coeff(S(-1), x + y)
        -x - y
        >>> _keep_coeff(S(-1), x + y, sign=True)
        -(x + y)
        */
        if (!(coeff.is_Number())) {
            if (factors.is_Number()) {
                [factors, coeff] = [coeff, factors];
            } else {
                return coeff.__mul__(factors);
            }
        }
        if (factors === S.One) {
            return coeff;
        }
        if (coeff === S.One) {
            return factors;
        } else if (coeff === S.NegativeOne && !sign) {
            return factors.__mul__(S.NegativeOne);
        } else if (factors.is_Add()) {
            if (!clear && coeff.is_Rational() && coeff.q !== 1) {
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
                    if (c.is_Integer()) {
                        const temparg = [];
                        for (const i of args) {
                            if (i[0] === 1) {
                                temparg.push(i.slice(0, 1));
                            } else {
                                i;
                            }
                        }
                        return this._from_args(Add, undefined,
                            ...this._from_args(Mul, undefined, ...temparg));
                        break;
                    }
                }
            }
            return new Mul(false, true, coeff, factors);
        } else if (factors.is_Mul()) {
            const margs: any[] = factors._args;
            if (margs[0].is_Number()) {
                margs[0] = margs[0].__mul__(coeff);
                if (margs[0] === 1) {
                    margs.splice(2, 1);
                }
            } else {
                margs.splice(0, 0, coeff);
            }
            return this._from_args(Mul, undefined, ...margs);
        } else {
            let m = coeff.__mul__(factors);
            if (m.is_Number() && !(factors.is_Number())) {
                m = this._from_args(Mul, undefined, coeff, factors);
            }
            return m;
        }
    }

    static _new(evaluate: boolean, simplify: boolean, ...args: any) {
        return new Mul(evaluate, simplify, ...args);
    }


    _eval_is_commutative() {
        const allargs = [];
        for (const a of this._args) {
            allargs.push(a.is_commutative());
        }
        return _fuzzy_groupv2(allargs);
    }

    // WB addition for jasmine tests
    toString() {
        let result = "";
        const num_args = this._args.length
        for (let i = 0; i < num_args; i++) {
            const arg = this._args[i];
            let temp;
            if (i != num_args - 1) {
                temp = arg.toString() + "*"
            } else {
                temp = arg.toString();
            }
            result = result.concat(temp)
        }
    
        return result;
    }
}

ManagedProperties.register(Mul);
Global.register("Mul", Mul._new);
