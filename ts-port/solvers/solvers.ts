/*
Notes by WB:
- checksol has a reduced functionality, but it is enough for the current solve
  capibilities
*/

import { Add } from "../core/add";
import { _Expr } from "../core/expr";
import { Mul } from "../core/mul";
import { _AssocOp } from "../core/operations";
import { Eq, Ne } from "../core/relational";
import { S } from "../core/singleton";
import {Symbol, Dummy} from "../core/symbol";
import { preorder_traversal } from "../core/traversal";
import { HashDict, HashSet } from "../core/utility";
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


function checksol(f: any, symbol: Symbol, sol: any = undefined, kwgs: Record<string, boolean> | HashDict = undefined) {
    /*
    Checks whether sol is a solution of equation f == 0.

    Explanation
    ===========

    Input can be either a single symbol and corresponding value
    or a dictionary of symbols and values. When given as a dictionary
    and flag ``simplify=True``, the values in the dictionary will be
    simplified. *f* can be a single equation or an iterable of equations.
    A solution must satisfy all equations in *f* to be considered valid;
    if a solution does not satisfy any equation, False is returned; if one or
    more checks are inconclusive (and none are False) then None is returned.

    Examples
    ========

    >>> from sympy import checksol, symbols
    >>> x, y = symbols('x,y')
    >>> checksol(x**4 - 1, x, 1)
    True
    >>> checksol(x**4 - 1, x, 0)
    False
    >>> checksol(x**2 + y**2 - 5**2, {x: 3, y: 4})
    True

    To check if an expression is zero using ``checksol()``, pass it
    as *f* and send an empty dictionary for *symbol*:

    >>> checksol(x**2 + x - x*(x + 1), {})
    True

    None is returned if ``checksol()`` could not conclude.

    flags:
        'numerical=True (default)'
           do a fast numerical check if ``f`` has only one symbol.
        'minimal=True (default is False)'
           a very fast, minimal testing.
        'warn=True (default is False)'
           show a warning if checksol() could not conclude.
        'simplify=True (default)'
           simplify solution before substituting into function and
           simplify the function before trying specific simplifications
        'force=True (default is False)'
           make positive all symbols without assumptions regarding sign.
    */
    let flags: HashDict;
    if (kwgs && !(kwgs instanceof HashDict)) {
        flags = new HashDict(kwgs);
    } else if (!kwgs) {
        flags = new HashDict();
    }

    const minimal = flags.get("minimal", false);
    if (typeof sol !== "undefined") {
        sol = {symbol: sol}; // ???????
    } else if (symbol instanceof HashDict) {
        sol = symbol;
    } else {
        throw new Error("Expecting (sym, val) or ({sym: val}, None)");
    }

    if (Array.isArray(f)) {
        if (!f) {
            throw new Error("no functions to check");

        }
        let rv = true;
        for (const fi of f) {
            const check = checksol(fi, sol, undefined, flags);
            if (check) {
                continue;
            }
            if (check === false) {
                return false;
            }
            rv = undefined;
        }
        return rv;
    }

    if (f.is_number()) {
        return f.is_zero();
    }

    if (f instanceof Eq || f instanceof Ne) {
        if (f.rhs === true || f.rhs === false) {
            f = !f;
        }
        const [B, E] = f._args;
        // skipping booleanatom since we never use it
        f = f.rewrite(Add, undefined, true, {"evaluate" : false});
    }

    // skipping boolean atoms again
    if (!f.is_Relational() && !f) {
        return f as boolean;
    }

    const illegal = new HashSet([S.NaN, S.Infinity, S.NegativeInfinity, S.ComplexInfinity]);
    if (sol.items().some(([k, v]: any) => v.atoms().intersects(illegal))) {
        return false;
    }

    throw new Error("the rest of checksol is not yet implemented");
}

function solve(f: any, symbols: Symbol[], kwargs: Record<string, boolean>) {
    /*
    Algebraically solves equations and systems of equations.

    Explanation
    ===========

    Currently supported:
        - polynomial
        - transcendental
        - piecewise combinations of the above
        - systems of linear and polynomial equations
        - systems containing relational expressions

    Examples
    ========

    The output varies according to the input and can be seen by example:

        >>> from sympy import solve, Poly, Eq, Function, exp
        >>> from sympy.abc import x, y, z, a, b
        >>> f = Function('f')

    Boolean or univariate Relational:

        >>> solve(x < 3)
        (-oo < x) & (x < 3)


    To always get a list of solution mappings, use flag dict=True:

        >>> solve(x - 3, dict=True)
        [{x: 3}]
        >>> sol = solve([x - 3, y - 1], dict=True)
        >>> sol
        [{x: 3, y: 1}]
        >>> sol[0][x]
        3
        >>> sol[0][y]
        1


    To get a list of *symbols* and set of solution(s) use flag set=True:

        >>> solve([x**2 - 3, y - 1], set=True)
        ([x, y], {(-sqrt(3), 1), (sqrt(3), 1)})


    Single expression and single symbol that is in the expression:

        >>> solve(x - y, x)
        [y]
        >>> solve(x - 3, x)
        [3]
        >>> solve(Eq(x, 3), x)
        [3]
        >>> solve(Poly(x - 3), x)
        [3]
        >>> solve(x**2 - y**2, x, set=True)
        ([x], {(-y,), (y,)})
        >>> solve(x**4 - 1, x, set=True)
        ([x], {(-1,), (1,), (-I,), (I,)})

    Single expression with no symbol that is in the expression:

        >>> solve(3, x)
        []
        >>> solve(x - 3, y)
        []

    Single expression with no symbol given. In this case, all free *symbols*
    will be selected as potential *symbols* to solve for. If the equation is
    univariate then a list of solutions is returned; otherwise - as is the case
    when *symbols* are given as an iterable of length greater than 1 - a list of
    mappings will be returned:

        >>> solve(x - 3)
        [3]
        >>> solve(x**2 - y**2)
        [{x: -y}, {x: y}]
        >>> solve(z**2*x**2 - z**2*y**2)
        [{x: -y}, {x: y}, {z: 0}]
        >>> solve(z**2*x - z**2*y**2)
        [{x: y**2}, {z: 0}]

    When an object other than a Symbol is given as a symbol, it is
    isolated algebraically and an implicit solution may be obtained.
    This is mostly provided as a convenience to save you from replacing
    the object with a Symbol and solving for that Symbol. It will only
    work if the specified object can be replaced with a Symbol using the
    subs method:

    >>> solve(f(x) - x, f(x))
    [x]
    >>> solve(f(x).diff(x) - f(x) - x, f(x).diff(x))
    [x + f(x)]
    >>> solve(f(x).diff(x) - f(x) - x, f(x))
    [-x + Derivative(f(x), x)]
    >>> solve(x + exp(x)**2, exp(x), set=True)
    ([exp(x)], {(-sqrt(-x),), (sqrt(-x),)})

    >>> from sympy import Indexed, IndexedBase, Tuple, sqrt
    >>> A = IndexedBase('A')
    >>> eqs = Tuple(A[1] + A[2] - 3, A[1] - A[2] + 1)
    >>> solve(eqs, eqs.atoms(Indexed))
    {A[1]: 1, A[2]: 2}

        * To solve for a symbol implicitly, use implicit=True:

            >>> solve(x + exp(x), x)
            [-LambertW(1)]
            >>> solve(x + exp(x), x, implicit=True)
            [-exp(x)]

        * It is possible to solve for anything that can be targeted with
          subs:

            >>> solve(x + 2 + sqrt(3), x + 2)
            [-sqrt(3)]
            >>> solve((x + 2 + sqrt(3), x + 4 + y), y, x + 2)
            {y: -2 + sqrt(3), x + 2: -sqrt(3)}

        * Nothing heroic is done in this implicit solving so you may end up
          with a symbol still in the solution:

            >>> eqs = (x*y + 3*y + sqrt(3), x + 4 + y)
            >>> solve(eqs, y, x + 2)
            {y: -sqrt(3)/(x + 3), x + 2: -2*x/(x + 3) - 6/(x + 3) + sqrt(3)/(x + 3)}
            >>> solve(eqs, y*x, x)
            {x: -y - 4, x*y: -3*y - sqrt(3)}

        * If you attempt to solve for a number remember that the number
          you have obtained does not necessarily mean that the value is
          equivalent to the expression obtained:

            >>> solve(sqrt(2) - 1, 1)
            [sqrt(2)]
            >>> solve(x - y + 1, 1)  # /!\ -1 is targeted, too
            [x/(y - 1)]
            >>> [_.subs(z, -1) for _ in solve((x - y + 1).subs(-1, z), 1)]
            [-x + y]

        * To solve for a function within a derivative, use ``dsolve``.

    Single expression and more than one symbol:

        * When there is a linear solution:

            >>> solve(x - y**2, x, y)
            [(y**2, y)]
            >>> solve(x**2 - y, x, y)
            [(x, x**2)]
            >>> solve(x**2 - y, x, y, dict=True)
            [{y: x**2}]

        * When undetermined coefficients are identified:

            * That are linear:

                >>> solve((a + b)*x - b + 2, a, b)
                {a: -2, b: 2}

            * That are nonlinear:

                >>> solve((a + b)*x - b**2 + 2, a, b, set=True)
                ([a, b], {(-sqrt(2), sqrt(2)), (sqrt(2), -sqrt(2))})

        * If there is no linear solution, then the first successful
          attempt for a nonlinear solution will be returned:

            >>> solve(x**2 - y**2, x, y, dict=True)
            [{x: -y}, {x: y}]
            >>> solve(x**2 - y**2/exp(x), x, y, dict=True)
            [{x: 2*LambertW(-y/2)}, {x: 2*LambertW(y/2)}]
            >>> solve(x**2 - y**2/exp(x), y, x)
            [(-x*sqrt(exp(x)), x), (x*sqrt(exp(x)), x)]

    Iterable of one or more of the above:

        * Involving relationals or bools:

            >>> solve([x < 3, x - 2])
            Eq(x, 2)
            >>> solve([x > 3, x - 2])
            False

        * When the system is linear:

            * With a solution:

                >>> solve([x - 3], x)
                {x: 3}
                >>> solve((x + 5*y - 2, -3*x + 6*y - 15), x, y)
                {x: -3, y: 1}
                >>> solve((x + 5*y - 2, -3*x + 6*y - 15), x, y, z)
                {x: -3, y: 1}
                >>> solve((x + 5*y - 2, -3*x + 6*y - z), z, x, y)
                {x: 2 - 5*y, z: 21*y - 6}

            * Without a solution:

                >>> solve([x + 3, x - 3])
                []

        * When the system is not linear:

            >>> solve([x**2 + y -2, y**2 - 4], x, y, set=True)
            ([x, y], {(-2, -2), (0, 2), (2, -2)})

        * If no *symbols* are given, all free *symbols* will be selected and a
          list of mappings returned:

            >>> solve([x - 2, x**2 + y])
            [{x: 2, y: -4}]
            >>> solve([x - 2, x**2 + f(x)], {f(x), x})
            [{x: 2, f(x): -4}]

        * If any equation does not depend on the symbol(s) given, it will be
          eliminated from the equation set and an answer may be given
          implicitly in terms of variables that were not of interest:

            >>> solve([x - y, y - 3], x)
            {x: y}

    **Additional Examples**

    ``solve()`` with check=True (default) will run through the symbol tags to
    elimate unwanted solutions. If no assumptions are included, all possible
    solutions will be returned:

        >>> from sympy import Symbol, solve
        >>> x = Symbol("x")
        >>> solve(x**2 - 1)
        [-1, 1]

    By using the positive tag, only one solution will be returned:

        >>> pos = Symbol("pos", positive=True)
        >>> solve(pos**2 - 1)
        [1]

    Assumptions are not checked when ``solve()`` input involves
    relationals or bools.

    When the solutions are checked, those that make any denominator zero
    are automatically excluded. If you do not want to exclude such solutions,
    then use the check=False option:

        >>> from sympy import sin, limit
        >>> solve(sin(x)/x)  # 0 is excluded
        [pi]

    If check=False, then a solution to the numerator being zero is found: x = 0.
    In this case, this is a spurious solution since $\sin(x)/x$ has the well
    known limit (without dicontinuity) of 1 at x = 0:

        >>> solve(sin(x)/x, check=False)
        [0, pi]

    In the following case, however, the limit exists and is equal to the
    value of x = 0 that is excluded when check=True:

        >>> eq = x**2*(1/x - z**2/x)
        >>> solve(eq, x)
        []
        >>> solve(eq, x, check=False)
        [0]
        >>> limit(eq, x, 0, '-')
        0
        >>> limit(eq, x, 0, '+')
        0

    **Disabling High-Order Explicit Solutions**

    When solving polynomial expressions, you might not want explicit solutions
    (which can be quite long). If the expression is univariate, ``CRootOf``
    instances will be returned instead:

        >>> solve(x**3 - x + 1)
        [-1/((-1/2 - sqrt(3)*I/2)*(3*sqrt(69)/2 + 27/2)**(1/3)) -
        (-1/2 - sqrt(3)*I/2)*(3*sqrt(69)/2 + 27/2)**(1/3)/3,
        -(-1/2 + sqrt(3)*I/2)*(3*sqrt(69)/2 + 27/2)**(1/3)/3 -
        1/((-1/2 + sqrt(3)*I/2)*(3*sqrt(69)/2 + 27/2)**(1/3)),
        -(3*sqrt(69)/2 + 27/2)**(1/3)/3 -
        1/(3*sqrt(69)/2 + 27/2)**(1/3)]
        >>> solve(x**3 - x + 1, cubics=False)
        [CRootOf(x**3 - x + 1, 0),
         CRootOf(x**3 - x + 1, 1),
         CRootOf(x**3 - x + 1, 2)]

    If the expression is multivariate, no solution might be returned:

        >>> solve(x**3 - x + a, x, cubics=False)
        []

    Sometimes solutions will be obtained even when a flag is False because the
    expression could be factored. In the following example, the equation can
    be factored as the product of a linear and a quadratic factor so explicit
    solutions (which did not require solving a cubic expression) are obtained:

        >>> eq = x**3 + 3*x**2 + x - 1
        >>> solve(eq, cubics=False)
        [-1, -1 + sqrt(2), -sqrt(2) - 1]

    **Solving Equations Involving Radicals**

    Because of SymPy's use of the principle root, some solutions
    to radical equations will be missed unless check=False:

        >>> from sympy import root
        >>> eq = root(x**3 - 3*x**2, 3) + 1 - x
        >>> solve(eq)
        []
        >>> solve(eq, check=False)
        [1/3]

    In the above example, there is only a single solution to the
    equation. Other expressions will yield spurious roots which
    must be checked manually; roots which give a negative argument
    to odd-powered radicals will also need special checking:

        >>> from sympy import real_root, S
        >>> eq = root(x, 3) - root(x, 5) + S(1)/7
        >>> solve(eq)  # this gives 2 solutions but misses a 3rd
        [CRootOf(7*x**5 - 7*x**3 + 1, 1)**15,
        CRootOf(7*x**5 - 7*x**3 + 1, 2)**15]
        >>> sol = solve(eq, check=False)
        >>> [abs(eq.subs(x,i).n(2)) for i in sol]
        [0.48, 0.e-110, 0.e-110, 0.052, 0.052]

    The first solution is negative so ``real_root`` must be used to see that it
    satisfies the expression:

        >>> abs(real_root(eq.subs(x, sol[0])).n(2))
        0.e-110

    If the roots of the equation are not real then more care will be
    necessary to find the roots, especially for higher order equations.
    Consider the following expression:

        >>> expr = root(x, 3) - root(x, 5)

    We will construct a known value for this expression at x = 3 by selecting
    the 1-th root for each radical:

        >>> expr1 = root(x, 3, 1) - root(x, 5, 1)
        >>> v = expr1.subs(x, -3)

    The ``solve`` function is unable to find any exact roots to this equation:

        >>> eq = Eq(expr, v); eq1 = Eq(expr1, v)
        >>> solve(eq, check=False), solve(eq1, check=False)
        ([], [])

    The function ``unrad``, however, can be used to get a form of the equation
    for which numerical roots can be found:

        >>> from sympy.solvers.solvers import unrad
        >>> from sympy import nroots
        >>> e, (p, cov) = unrad(eq)
        >>> pvals = nroots(e)
        >>> inversion = solve(cov, x)[0]
        >>> xvals = [inversion.subs(p, i) for i in pvals]

    Although ``eq`` or ``eq1`` could have been used to find ``xvals``, the
    solution can only be verified with ``expr1``:

        >>> z = expr - v
        >>> [xi.n(chop=1e-9) for xi in xvals if abs(z.subs(x, xi).n()) < 1e-9]
        []
        >>> z1 = expr1 - v
        >>> [xi.n(chop=1e-9) for xi in xvals if abs(z1.subs(x, xi).n()) < 1e-9]
        [-3.0]

    Parameters
    ==========

    f :
        - a single Expr or Poly that must be zero
        - an Equality
        - a Relational expression
        - a Boolean
        - iterable of one or more of the above

    symbols : (object(s) to solve for) specified as
        - none given (other non-numeric objects will be used)
        - single symbol
        - denested list of symbols
          (e.g., ``solve(f, x, y)``)
        - ordered iterable of symbols
          (e.g., ``solve(f, [x, y])``)

    flags :
        dict=True (default is False)
            Return list (perhaps empty) of solution mappings.
        set=True (default is False)
            Return list of symbols and set of tuple(s) of solution(s).
        exclude=[] (default)
            Do not try to solve for any of the free symbols in exclude;
            if expressions are given, the free symbols in them will
            be extracted automatically.
        check=True (default)
            If False, do not do any testing of solutions. This can be
            useful if you want to include solutions that make any
            denominator zero.
        numerical=True (default)
            Do a fast numerical check if *f* has only one symbol.
        minimal=True (default is False)
            A very fast, minimal testing.
        warn=True (default is False)
            Show a warning if ``checksol()`` could not conclude.
        simplify=True (default)
            Simplify all but polynomials of order 3 or greater before
            returning them and (if check is not False) use the
            general simplify function on the solutions and the
            expression obtained when they are substituted into the
            function which should be zero.
        force=True (default is False)
            Make positive all symbols without assumptions regarding sign.
        rational=True (default)
            Recast Floats as Rational; if this option is not used, the
            system containing Floats may fail to solve because of issues
            with polys. If rational=None, Floats will be recast as
            rationals but the answer will be recast as Floats. If the
            flag is False then nothing will be done to the Floats.
        manual=True (default is False)
            Do not use the polys/matrix method to solve a system of
            equations, solve them one at a time as you might "manually."
        implicit=True (default is False)
            Allows ``solve`` to return a solution for a pattern in terms of
            other functions that contain that pattern; this is only
            needed if the pattern is inside of some invertible function
            like cos, exp, ect.
        particular=True (default is False)
            Instructs ``solve`` to try to find a particular solution to
            a linear system with as many zeros as possible; this is very
            expensive.
        quick=True (default is False; ``particular`` must be True)
            Selects a fast heuristic to find a solution with many zeros
            whereas a value of False uses the very slow method guaranteed
            to find the largest number of zeros possible.
        cubics=True (default)
            Return explicit solutions when cubic expressions are encountered.
            When False, quartics and quintics are disabled, too.
        quartics=True (default)
            Return explicit solutions when quartic expressions are encountered.
            When False, quintics are disabled, too.
        quintics=True (default)
            Return explicit solutions (if possible) when quintic expressions
            are encountered.

    See Also
    ========

    rsolve: For solving recurrence relationships
    dsolve: For solving differential equations

    */

    const flags = new HashDict(kwargs);
    const hints = ["cubics", "quartics", "quintics"];
    const def = true;
    for (const k of hints) {
        flags.setdefault(k, flags.get(k, def) as boolean);
    }
}