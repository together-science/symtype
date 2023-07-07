import { variable } from "@tensorflow/tfjs";
import { Expr, _Expr } from "./expr";
import { Integer, _Number_ } from "./numbers";
import { S } from "./singleton";
import { Dummy, Symbol } from "./symbol";
import { HashDict, Util, base, mix } from "./utility";
import { topological_sort } from "../utilities/iterables";
import { ManagedProperties } from "./assumptions";
import { Global } from "./global";


export class Derivative extends mix(base).with(Expr)  {
    /*
    Carries out differentiation of the given expression with respect to symbols.

    Examples
    ========

    >>> from sympy import Derivative, Function, symbols, Subs
    >>> from sympy.abc import x, y
    >>> f, g = symbols('f g', cls=Function)

    >>> Derivative(x**2, x, evaluate=True)
    2*x

    Denesting of derivatives retains the ordering of variables:

        >>> Derivative(Derivative(f(x, y), y), x)
        Derivative(f(x, y), y, x)

    Contiguously identical symbols are merged into a tuple giving
    the symbol and the count:

        >>> Derivative(f(x), x, x, y, x)
        Derivative(f(x), (x, 2), y, x)

    If the derivative cannot be performed, and evaluate is True, the
    order of the variables of differentiation will be made canonical:

        >>> Derivative(f(x, y), y, x, evaluate=True)
        Derivative(f(x, y), x, y)

    Derivatives with respect to undefined functions can be calculated:

        >>> Derivative(f(x)**2, f(x), evaluate=True)
        2*f(x)

    Such derivatives will show up when the chain rule is used to
    evalulate a derivative:

        >>> f(g(x)).diff(x)
        Derivative(f(g(x)), g(x))*Derivative(g(x), x)

    Substitution is used to represent derivatives of functions with
    arguments that are not symbols or functions:

        >>> f(2*x + 3).diff(x) == 2*Subs(f(y).diff(y), y, 2*x + 3)
        True

    Notes
    =====

    Simplification of high-order derivatives:

    Because there can be a significant amount of simplification that can be
    done when multiple differentiations are performed, results will be
    automatically simplified in a fairly conservative fashion unless the
    keyword ``simplify`` is set to False.

        >>> from sympy import sqrt, diff, Function, symbols
        >>> from sympy.abc import x, y, z
        >>> f, g = symbols('f,g', cls=Function)

        >>> e = sqrt((x + 1)**2 + x)
        >>> diff(e, (x, 5), simplify=False).count_ops()
        136
        >>> diff(e, (x, 5)).count_ops()
        30

    Ordering of variables:

    If evaluate is set to True and the expression cannot be evaluated, the
    list of differentiation symbols will be sorted, that is, the expression is
    assumed to have continuous derivatives up to the order asked.

    Derivative wrt non-Symbols:

    For the most part, one may not differentiate wrt non-symbols.
    For example, we do not allow differentiation wrt `x*y` because
    there are multiple ways of structurally defining where x*y appears
    in an expression: a very strict definition would make
    (x*y*z).diff(x*y) == 0. Derivatives wrt defined functions (like
    cos(x)) are not allowed, either:

        >>> (x*y*z).diff(x*y)
        Traceback (most recent call last):
        ...
        ValueError: Can't calculate derivative wrt x*y.

    To make it easier to work with variational calculus, however,
    derivatives wrt AppliedUndef and Derivatives are allowed.
    For example, in the Euler-Lagrange method one may write
    F(t, u, v) where u = f(t) and v = f'(t). These variables can be
    written explicitly as functions of time::

        >>> from sympy.abc import t
        >>> F = Function('F')
        >>> U = f(t)
        >>> V = U.diff(t)

    The derivative wrt f(t) can be obtained directly:

        >>> direct = F(t, U, V).diff(U)

    When differentiation wrt a non-Symbol is attempted, the non-Symbol
    is temporarily converted to a Symbol while the differentiation
    is performed and the same answer is obtained:

        >>> indirect = F(t, U, V).subs(U, x).diff(x).subs(x, U)
        >>> assert direct == indirect

    The implication of this non-symbol replacement is that all
    functions are treated as independent of other functions and the
    symbols are independent of the functions that contain them::

        >>> x.diff(f(x))
        0
        >>> g(x).diff(f(x))
        0

    It also means that derivatives are assumed to depend only
    on the variables of differentiation, not on anything contained
    within the expression being differentiated::

        >>> F = f(x)
        >>> Fx = F.diff(x)
        >>> Fx.diff(F)  # derivative depends on x, not F
        0
        >>> Fxx = Fx.diff(x)
        >>> Fxx.diff(Fx)  # derivative depends on x, not Fx
        0

    The last example can be made explicit by showing the replacement
    of Fx in Fxx with y:

        >>> Fxx.subs(Fx, y)
        Derivative(y, x)

        Since that in itself will evaluate to zero, differentiating
        wrt Fx will also be zero:

        >>> _.doit()
        0

    Replacing undefined functions with concrete expressions

    One must be careful to replace undefined functions with expressions
    that contain variables consistent with the function definition and
    the variables of differentiation or else insconsistent result will
    be obtained. Consider the following example:

    >>> eq = f(x)*g(y)
    >>> eq.subs(f(x), x*y).diff(x, y).doit()
    y*Derivative(g(y), y) + g(y)
    >>> eq.diff(x, y).subs(f(x), x*y).doit()
    y*Derivative(g(y), y)

    The results differ because `f(x)` was replaced with an expression
    that involved both variables of differentiation. In the abstract
    case, differentiation of `f(x)` by `y` is 0; in the concrete case,
    the presence of `y` made that derivative nonvanishing and produced
    the extra `g(y)` term.

    Defining differentiation for an object

    An object must define ._eval_derivative(symbol) method that returns
    the differentiation result. This function only needs to consider the
    non-trivial case where expr contains symbol and it should call the diff()
    method internally (not _eval_derivative); Derivative should be the only
    one to call _eval_derivative.

    Any class can allow derivatives to be taken with respect to
    itself (while indicating its scalar nature). See the
    docstring of Expr._diff_wrt.

    See Also
    ========
    _sort_variable_count
    */

    static clsname = "Derivative"

    constructor(expr: any, evaluate: boolean, ...variables: any[]) { // using any since we might reassign
        super(expr, ...variables);
        if (!expr.free_symbols) {
            throw new Error("invalid expr")
        }

        if (variables.length === 0) {
            variables = expr.free_symbols().toArray()
            if (variables.length !== 1) {
                if (expr.is_number()) {
                    return S.Zero;
                }
                if (variables.length == 0) {
                    throw new Error("Since there are no variables in the expression, the variables of differentiation must be supplied");
                }
                else {
                    throw new Error("Since there is more than one variable in the expression, the variables of differentiation must be supplied");
                }
            }
        }

        let variable_count: any[] = [];
        let count: Integer = S.Zero;
        // replacing array types with just array since tuple and list 
        // do not exist in symtype

        for (let i = 0; i < variables.length; i++) {
            let v = variables[i];
            if (Array.isArray(v)) {
                if (v.length === 0) {
                    continue;
                }
                if (Array.isArray(v[0])) {
                    if (v.length === 1) {
                        v = new Array(v[0]); // ??????????
                        count = S.One;
                    } else {
                        [v, count] = v;
                        v = new Array(v);
                    }
                } else {
                    [v, count] = v;
                }
                if (count === S.Zero) {
                    continue;
                }
                variable_count.push([v, count]);
                continue;
            }

            if (v instanceof Integer) {
                if (i === 0) {
                    throw new Error("first variable cannot be a number")
                }
                count = v;
                const [prev, prevcount] = variable_count[variable_count.length - 1];
                if (prevcount !== 1) {
                    throw new Error("bad arg format")
                }
                if (count === S.Zero) {
                    variable_count.pop();
                } else {
                    variable_count[variable_count.length - 1] = [prev, count];
                }

            } else {
                count = S.One;
                variable_count.push([v, count]);
            }
        }

        const merged: any[][] = [];
        for (const t of variable_count) {
            let [v, c] = t;
            if (c.is_negative()) {
                throw new Error("order of differentiation must be nonnegative")
            }
            if (merged.length > 0 && merged[merged.length - 1][0].__eq__(v)) {
                c += merged[merged.length - 1][0];
                if (!c) {
                    merged.pop();
                } else {
                    merged.push(t);
                }
            } else {
                merged.push(t);
            }
        }

        variable_count = merged;

        for (const [v, c] of variable_count) {
            if (!v._diff_wrt) {
                throw new Error("can't calculate derivative wrt");
            }
        }

        if (variable_count.length === 0) {
            return expr;
        }

        if (evaluate) {
            if (expr instanceof Derivative) {
                expr = expr.canonical();
            }
            for (let i = 0; i < variable_count.length; i++) {
                const [v, c] = variable_count[i];
                if (v instanceof Derivative) {
                    variable_count[i] = v.canonical();
                }
            }

            let zero = false;
            const free = expr.free_symbols();
            for (const [v, c] of variable_count) {
                const vfree = v.free_symbols();
                if (c.is_positive() && vfree.size > 0) {
                    if (v instanceof Symbol && !free.has(v)) {
                        zero = true;
                        break;
                    } else {
                        if (free.size === 0 && vfree.size > 0) {
                            zero = true;
                            break;
                        }
                    }
                }
            }
            if (zero) {
                return this._get_zero_with_shape_like(expr); // finicky
            }
            variable_count = this._sort_variable_count(variable_count);
        }

        if (expr instanceof Derivative) {
            variable_count = expr.variable_count().concat(variable_count);
            expr = expr.expr();
            return _derivative_dispatch(expr, ...variable_count);
        }

        if (!evaluate || !expr._eval_derivative) {
            if (evaluate && Util.arrEq([expr, 1], variable_count) && expr.is_scalar()) {
                return S.One;
            }
        } 

        if (evaluate) {
            let nderivs: Integer = S.Zero;
            let unhandled: any[] = [];
            for (let i = 0; i < variable_count.length; i++) {
                let [v, c] = variable_count[i];
                
                const old_expr = expr;
                let old_v: any = undefined;
    
                const is_symbol = v.is_Symbol() || Array.isArray(v);
    
                if (!is_symbol) {
                    old_v = v;
                    v = new Dummy("xi");
                    expr = expr.xreplace(new HashDict({old_v: v}));
                    if (!(old_v instanceof Derivative) || !(expr.free_symbols().has(v))) {
                        return expr.diff(v);
                    }
                    if (!v.is_scalar() && !old_v._eval_derivative) {
                        expr = expr.__mul__(old_v.diff(old_v));
                    }
                }
                let obj = this._dispatch_eval_derivative_n_times(expr, v, count);
                if (typeof obj !== "undefined" && obj.is_zero()) {
                    return obj;
                }
    
                nderivs = nderivs.__add__(count);
    
                if (typeof old_v !== "undefined") {
                    if (typeof obj !== "undefined") {
                        obj = obj.subs({}, v, old_v);
                    }
                    expr = old_expr;
                }
    
                if (typeof obj === "undefined") {
                    unhandled = variable_count.slice(i);
                    break;
                }
    
                expr = obj;
            }
    
            expr = expr.replace((x: any) => x instanceof Derivative, (x: any) => x.canonical())
    
            if (unhandled.length > 0) {
                if (expr instanceof Derivative) {
                    unhandled = expr.variable_count().concat(unhandled);
                    expr = expr.expr();
                }
                expr = new _Expr(expr, ...unhandled);
            }
    
            if (nderivs.__gt__(S.One)) {
                throw new Error("exprtools factor terms not yet implemented")
            }
            return expr;
        }
    }

    canonical() {
        return this.func(this.expr(), true, ...this._sort_variable_count(this.variable_count()));
    }

    _sort_variable_count(vc: any[]) {
        /*
        Sort (variable, count) pairs into canonical order while
        retaining order of variables that do not commute during
        differentiation:

        * symbols and functions commute with each other
        * derivatives commute with each other
        * a derivative does not commute with anything it contains
        * any other object is not allowed to commute if it has
          free symbols in common with another object

        Examples
        ========

        >>> from sympy import Derivative, Function, symbols
        >>> vsort = Derivative._sort_variable_count
        >>> x, y, z = symbols('x y z')
        >>> f, g, h = symbols('f g h', cls=Function)

        Contiguous items are collapsed into one pair:

        >>> vsort([(x, 1), (x, 1)])
        [(x, 2)]
        >>> vsort([(y, 1), (f(x), 1), (y, 1), (f(x), 1)])
        [(y, 2), (f(x), 2)]

        Ordering is canonical.

        >>> def vsort0(*v):
        ...     # docstring helper to
        ...     # change vi -> (vi, 0), sort, and return vi vals
        ...     return [i[0] for i in vsort([(i, 0) for i in v])]

        >>> vsort0(y, x)
        [x, y]
        >>> vsort0(g(y), g(x), f(y))
        [f(y), g(x), g(y)]

        Symbols are sorted as far to the left as possible but never
        move to the left of a derivative having the same symbol in
        its variables; the same applies to AppliedUndef which are
        always sorted after Symbols:

        >>> dfx = f(x).diff(x)
        >>> assert vsort0(dfx, y) == [y, dfx]
        >>> assert vsort0(dfx, x) == [dfx, x]
        */
        if (vc.length === 0) {
            return [];
        }
        if (vc.length === 1) {
            return [vc[0]];
        }
        const V = Util.range(vc.length);
        const E = [];
        const v = (i: any) => vc[i][0];
        const D = new Dummy();
        function _block(d: any, v: any, wrt: boolean = false) {
            if (d.__eq__(v)) {
                return wrt;
            }
            if (d.is_Symbol()) {
                return false;
            }
            if (d instanceof Derivative) {
                if (D._wrt_variables().some((k: any) => _block(k, v, true))) {
                    return true;
                }
                return false;
            }
            if (v.is_Symbol()) {
                return d.free_symbols().has(v)
            }
            return d.free_symbols().intersects(v.free_symbols());
        }
        for (let i = 0; i < vc.length; i++) {
            for (let j = 0; j < i; j++) {
                if (_block(v(j), v(i))) {
                    E.push([j, i]);
                }
            }
        }
        const temp = Util.zip([...new Set(vc.map((item: any) => item[0]))], Util.range(vc.length));
        const O = new HashDict();
        temp.forEach((item: any) => O.add(item[0], item[1]));
        const ix = topological_sort([V, E], (i: any) => O.get(v(i)));
        const merged: any[][] = [];
        for (const [v, c] of ix.map((i: any) => vc[i])) {
            if (merged.length > 0 && merged[merged.length - 1][0].__eq__(v)) {
                merged[merged.length - 1][1] += c;
            } else {
                merged.push([v, c])
            }
        }
        return merged;
    }

    _get_zero_with_shape_like(expr: any) {
        return S.Zero;
    }

    _dispatch_eval_derivative_n_times(expr: any, v: Symbol, count: Integer) {
        return expr._eval_derivative_n_times(v, count);
    }

    expr() {
        return this._args[0];
    }

    _wrt_variables() {
        return this.variable_count().map((i: any) => i[0]);
    }

    variable_count() {
        return this._args.slice(1);
    }

    free_symbols() {
        const ret = this.expr().free_symbols();
        for (const [_, count] of this.variable_count()) {
            ret.add(count.free_symbols());
        }
        return ret;
    }

    doit() {
        const expr = this.expr();
        let rv = this.func(expr, true, ...this.variable_count());
        if (rv.__ne__(this) && rv.has(Derivative)) {
            rv = rv.doit();
        }
        return rv;
    }

    toString() {
        return "Derivative(" + this.expr().toString() + ")"
    }
}

export function _derivative_dispatch(expr: any, ...variables: any[]) {
    return new Derivative(expr, true, ...variables);
}

ManagedProperties.register(Derivative);
Global.register("_derivative_dispatch", _derivative_dispatch);