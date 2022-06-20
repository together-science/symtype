from itertools import combinations_with_replacement
from sympy.core import symbols, Add, Dummy
from sympy.core.numbers import Rational
from sympy.polys import cancel, ComputationFailed, parallel_poly_from_expr, reduced, Poly
from sympy.polys.monomials import Monomial, monomial_div
from sympy.polys.polyerrors import DomainError, PolificationFailed
from sympy.utilities.misc import debug

def ratsimp(expr):
    """
    Put an expression over a common denominator, cancel and reduce.

    Examples
    ========

    >>> from sympy import ratsimp
    >>> from sympy.abc import x, y
    >>> ratsimp(1/x + 1/y)
    (x + y)/(x*y)
    """

    f, g = cancel(expr).as_numer_denom()
    try:
        Q, r = reduced(f, [g], field=True, expand=False)
    except ComputationFailed:
        return f/g

    return Add(*Q) + cancel(r/g)


def ratsimpmodprime(expr, G, *gens, quick=True, polynomial=False, **args):
    """
    Simplifies a rational expression ``expr`` modulo the prime ideal
    generated by ``G``.  ``G`` should be a Groebner basis of the
    ideal.

    Examples
    ========

    >>> from sympy.simplify.ratsimp import ratsimpmodprime
    >>> from sympy.abc import x, y
    >>> eq = (x + y**5 + y)/(x - y)
    >>> ratsimpmodprime(eq, [x*y**5 - x - y], x, y, order='lex')
    (-x**2 - x*y - x - y)/(-x**2 + x*y)

    If ``polynomial`` is ``False``, the algorithm computes a rational
    simplification which minimizes the sum of the total degrees of
    the numerator and the denominator.

    If ``polynomial`` is ``True``, this function just brings numerator and
    denominator into a canonical form. This is much faster, but has
    potentially worse results.

    References
    ==========

    .. [1] M. Monagan, R. Pearce, Rational Simplification Modulo a Polynomial
        Ideal, http://citeseer.ist.psu.edu/viewdoc/summary?doi=10.1.1.163.6984
        (specifically, the second algorithm)
    """
    from sympy.solvers.solvers import solve

    debug('ratsimpmodprime', expr)

    # usual preparation of polynomials:

    num, denom = cancel(expr).as_numer_denom()

    try:
        polys, opt = parallel_poly_from_expr([num, denom] + G, *gens, **args)
    except PolificationFailed:
        return expr

    domain = opt.domain

    if domain.has_assoc_Field:
        opt.domain = domain.get_field()
    else:
        raise DomainError(
            "Cannot compute rational simplification over %s" % domain)

    # compute only once
    leading_monomials = [g.LM(opt.order) for g in polys[2:]]
    tested = set()

    def staircase(n):
        """
        Compute all monomials with degree less than ``n`` that are
        not divisible by any element of ``leading_monomials``.
        """
        if n == 0:
            return [1]
        S = []
        for mi in combinations_with_replacement(range(len(opt.gens)), n):
            m = [0]*len(opt.gens)
            for i in mi:
                m[i] += 1
            if all(monomial_div(m, lmg) is None for lmg in
                   leading_monomials):
                S.append(m)

        return [Monomial(s).as_expr(*opt.gens) for s in S] + staircase(n - 1)

    def _ratsimpmodprime(a, b, allsol, N=0, D=0):
        r"""
        Computes a rational simplification of ``a/b`` which minimizes
        the sum of the total degrees of the numerator and the denominator.

        Explanation
        ===========

        The algorithm proceeds by looking at ``a * d - b * c`` modulo
        the ideal generated by ``G`` for some ``c`` and ``d`` with degree
        less than ``a`` and ``b`` respectively.
        The coefficients of ``c`` and ``d`` are indeterminates and thus
        the coefficients of the normalform of ``a * d - b * c`` are
        linear polynomials in these indeterminates.
        If these linear polynomials, considered as system of
        equations, have a nontrivial solution, then `\frac{a}{b}
        \equiv \frac{c}{d}` modulo the ideal generated by ``G``. So,
        by construction, the degree of ``c`` and ``d`` is less than
        the degree of ``a`` and ``b``, so a simpler representation
        has been found.
        After a simpler representation has been found, the algorithm
        tries to reduce the degree of the numerator and denominator
        and returns the result afterwards.

        As an extension, if quick=False, we look at all possible degrees such
        that the total degree is less than *or equal to* the best current
        solution. We retain a list of all solutions of minimal degree, and try
        to find the best one at the end.
        """
        c, d = a, b
        steps = 0

        maxdeg = a.total_degree() + b.total_degree()
        if quick:
            bound = maxdeg - 1
        else:
            bound = maxdeg
        while N + D <= bound:
            if (N, D) in tested:
                break
            tested.add((N, D))

            M1 = staircase(N)
            M2 = staircase(D)
            debug('%s / %s: %s, %s' % (N, D, M1, M2))

            Cs = symbols("c:%d" % len(M1), cls=Dummy)
            Ds = symbols("d:%d" % len(M2), cls=Dummy)
            ng = Cs + Ds

            c_hat = Poly(
                sum([Cs[i] * M1[i] for i in range(len(M1))]), opt.gens + ng)
            d_hat = Poly(
                sum([Ds[i] * M2[i] for i in range(len(M2))]), opt.gens + ng)

            r = reduced(a * d_hat - b * c_hat, G, opt.gens + ng,
                        order=opt.order, polys=True)[1]

            S = Poly(r, gens=opt.gens).coeffs()
            sol = solve(S, Cs + Ds, particular=True, quick=True)

            if sol and not all(s == 0 for s in sol.values()):
                c = c_hat.subs(sol)
                d = d_hat.subs(sol)

                # The "free" variables occurring before as parameters
                # might still be in the substituted c, d, so set them
                # to the value chosen before:
                c = c.subs(dict(list(zip(Cs + Ds, [1] * (len(Cs) + len(Ds))))))
                d = d.subs(dict(list(zip(Cs + Ds, [1] * (len(Cs) + len(Ds))))))

                c = Poly(c, opt.gens)
                d = Poly(d, opt.gens)
                if d == 0:
                    raise ValueError('Ideal not prime?')

                allsol.append((c_hat, d_hat, S, Cs + Ds))
                if N + D != maxdeg:
                    allsol = [allsol[-1]]

                break

            steps += 1
            N += 1
            D += 1

        if steps > 0:
            c, d, allsol = _ratsimpmodprime(c, d, allsol, N, D - steps)
            c, d, allsol = _ratsimpmodprime(c, d, allsol, N - steps, D)

        return c, d, allsol

    # preprocessing. this improves performance a bit when deg(num)
    # and deg(denom) are large:
    num = reduced(num, G, opt.gens, order=opt.order)[1]
    denom = reduced(denom, G, opt.gens, order=opt.order)[1]

    if polynomial:
        return (num/denom).cancel()

    c, d, allsol = _ratsimpmodprime(
        Poly(num, opt.gens, domain=opt.domain), Poly(denom, opt.gens, domain=opt.domain), [])
    if not quick and allsol:
        debug('Looking for best minimal solution. Got: %s' % len(allsol))
        newsol = []
        for c_hat, d_hat, S, ng in allsol:
            sol = solve(S, ng, particular=True, quick=False)
            newsol.append((c_hat.subs(sol), d_hat.subs(sol)))
        c, d = min(newsol, key=lambda x: len(x[0].terms()) + len(x[1].terms()))

    if not domain.is_Field:
        cn, c = c.clear_denoms(convert=True)
        dn, d = d.clear_denoms(convert=True)
        r = Rational(cn, dn)
    else:
        r = Rational(1)

    return (c*r.q)/(d*r.p)
