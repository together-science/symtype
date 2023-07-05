import {Symbol, Dummy} from "../core/symbol";

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