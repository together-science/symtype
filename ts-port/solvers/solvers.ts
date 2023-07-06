import { _Expr } from "../core/expr";
import { Mul } from "../core/mul";
import { _AssocOp } from "../core/operations";
import { S } from "../core/singleton";
import {Symbol, Dummy} from "../core/symbol";
import { preorder_traversal } from "../core/traversal";
import { HashSet } from "../core/utility";
import { denom } from "../simplify/radsimp";

function recast_to_symbols(eqs: any[], symbols: any[]) {
    /*
    Return (e, s, d) where e and s are versions of *eqs* and
    *symbols* in which any non-Symbol objects in *symbols* have
    been replaced with generic Dummy symbols and d is a dictionary
    that can be used to restore the original expressions.

    Examples
    ========

    >>> from sympy.solvers.solvers import recast_to_symbols
    >>> from sympy import symbols, Function
    >>> x, y = symbols('x y')
    >>> fx = Function('f')(x)
    >>> eqs, syms = [fx + 1, x, y], [fx, y]
    >>> e, s, d = recast_to_symbols(eqs, syms); (e, s, d)
    ([_X0 + 1, x, y], [_X0, y], {_X0: f(x)})

    The original equations and symbols can be restored using d:

    >>> assert [i.xreplace(d) for i in eqs] == eqs
    >>> assert [d.get(i, i) for i in s] == syms
    */
    const new_symbols: any[] = [...symbols];
    const swap_sym: Record<any, any> = {};
    for (let i = 0; i < symbols.length; i++) {
        const s = symbols[i];
        if (!(s instanceof Symbol || swap_sym.has(s))) {
            swap_sym[s] = new Dummy("X" + i);
            new_symbols[i] = swap_sym[s];
        }
    }
    const new_f = [];
    for (const i of eqs) {
        const isubs = i["subs"];
        if (typeof isubs !== "undefined") {
            new_f.push(isubs(swap_sym));
        } else {
            new_f.push(i);
        }
    }
    for (const item of Object.entries(swap_sym)) {
        swap_sym[item[1]] = item[0];
    }
    return [new_f, new_symbols, swap_sym];
}

export function _simple_dens(f: any, ...symbols: Symbol[]) {
    // when checking if a denominator is zero, we can just check the
    // base of powers with nonzero exponents since if the base is zero
    // the power will be zero, too. To keep it simple and fast, we
    // limit simplification to exponents that are Numbers
    const dens: Set<any> = new Set();
    for (let d of denoms(f, ...symbols).toArray()) {
        if (d.is_Pow() && d._args[1].is_Number()) {
            if (d._args[1].is_zero()) {
                continue;
            }
            d = d._args[0];
        }
        dens.add(d);
    }
    return dens;
}

function denoms(eq: any, ...symbols: Symbol[]): HashSet {
    /*
    Return (recursively) set of all denominators that appear in *eq*
    that contain any symbol in *symbols*; if *symbols* are not
    provided then all denominators will be returned.

    Examples
    ========

    >>> from sympy.solvers.solvers import denoms
    >>> from sympy.abc import x, y, z

    >>> denoms(x/y)
    {y}

    >>> denoms(x/(y*z))
    {y, z}

    >>> denoms(3/x + y/z)
    {x, z}

    >>> denoms(x/2 + y/z)
    {2, z}

    If *symbols* are provided then only denominators containing
    those symbols will be returned:

    >>> denoms(1/x + 1/y + 1/z, y, z)
    {y, z}
    */

    const pot = new preorder_traversal(eq);
    const dens: HashSet= new HashSet();
    for (const p of pot.asIter()) {
        if (!p.isinstance(_Expr)) {
            continue;
        }
        const den = denom(p);
        if (den === S.One) {
            continue;
        } 
        for (const d of _AssocOp.make_args(Mul, den)) {
            dens.add(d);
        }
    }
        
    if (symbols.length === 0) {
        return dens;
    } else if (symbols.length === 1) {
        if (Array.isArray(symbols[0])) {
            symbols = symbols[0];
        }
    }
    const rv = [];
    for (const d of dens.toArray()) {
        const free: Set<any> = d.free_symbols();
        if (symbols.some((s: any) => free.has(s))) {
            rv.push(d)
        }
    }
    return new HashSet(rv);
}
/*


def denoms(eq, *symbols):
    pot = preorder_traversal(eq)
    dens = set()
    for p in pot:
        # Here p might be Tuple or Relational
        # Expr subtrees (e.g. lhs and rhs) will be traversed after by pot
        if not isinstance(p, Expr):
            continue
        den = denom(p)
        if den is S.One:
            continue
        for d in Mul.make_args(den):
            dens.add(d)
    if not symbols:
        return dens
    elif len(symbols) == 1:
        if iterable(symbols[0]):
            symbols = symbols[0]
    return {d for d in dens if any(s in d.free_symbols for s in symbols)}

*/