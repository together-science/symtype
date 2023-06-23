/*
Integer and rational factorization

Notable changes made
- A few functions in .generator and .evalf have been moved here for simplicity
- Note: most parameters for factorint and factorrat have not been implemented
- See notes within perfect_power for specific changes
- All factor functions return hashdictionaries
- Advanced factoring algorithms for factorint are not yet implemented
*/

import {Rational, int_nthroot, Integer} from "../core/numbers";
import {S} from "../core/singleton";
import {HashDict, Util} from "../core/utility";
import {as_int} from "../utilities/misc";

const small_trailing = new Array(256).fill(0);
for (let j = 1; j < 8; j++) {
    Util.assignElements(small_trailing, new Array((1<<(7-j))).fill(j), 1<<j, 1<<(j+1));
}

function bitcount(n: number) {
    // Return smallest integer, b, such that |n|/2**b < 1
    let bits = 0;
    while (n !== 0) {
        bits += bitCount32(n | 0);
        n /= 0x100000000;
    }
    return bits;
}

// small bitcount used to faciliate larger one
function bitCount32(n: number) {
    n = n - ((n >> 1) & 0x55555555);
    n = (n & 0x33333333) + ((n >> 2) & 0x33333333);
    return ((n + (n >> 4) & 0xF0F0F0F) * 0x1010101) >> 24;
}

function trailing(n: number) {
    /*
    Count the number of trailing zero digits in the binary
    representation of n, i.e. determine the largest power of 2
    that divides n.
    Examples
    ========
    >>> from sympy import trailing
    >>> trailing(128)
    7
    >>> trailing(63)
    0
    */
    n = Math.floor(Math.abs(n));
    const low_byte = n & 0xff;
    if (low_byte) {
        return small_trailing[low_byte];
    }
    const z = bitcount(n) - 1;
    if (Number.isInteger(z)) {
        if (n === 1 << z) {
            return z;
        }
    }
    if (z < 300) {
        let t = 8;
        n >>= 8;
        while (!(n & 0xff)) {
            n >>= 8;
            t += 8;
        }
        return t + small_trailing[n & 0xff];
    }
    let t = 0;
    let p = 8;
    while (!(n & 1)) {
        while (!(n & ((1 << p) - 1))) {
            n >>= p;
            t += p;
            p *= 2;
        }
        p = Math.floor(p/2);
    }
    return t;
}

// note: this is different than the original sympy version - implement later
function isprime(num: number) {
    for (let i = 2, s = Math.sqrt(num); i <= s; i++) {
        if (num % i === 0) {
            return false;
        }
    }
    return (num > 1);
}

function* primerange(a: number, b: number = undefined) {
    /*
    Generate all prime numbers in the range [2, a) or [a, b).
    Examples
    ========
    >>> from sympy import sieve, prime
    All primes less than 19:
    >>> print([i for i in sieve.primerange(19)])
    [2, 3, 5, 7, 11, 13, 17]
    All primes greater than or equal to 7 and less than 19:
    >>> print([i for i in sieve.primerange(7, 19)])
    [7, 11, 13, 17]
    All primes through the 10th prime
    >>> list(sieve.primerange(prime(10) + 1))
    [2, 3, 5, 7, 11, 13, 17, 19, 23, 29]
    */
    if (typeof b === "undefined") {
        [a, b] = [2, a];
    }
    if (a >= b) {
        return;
    }
    a = Math.ceil(a) - 1;
    b = Math.floor(b);

    while (1) {
        a = nextprime(a);
        if (a < b) {
            yield a;
        } else {
            return;
        }
    }
}

function nextprime(n: number, ith: number = 1) {
    /*
    Return the ith prime greater than n.
    i must be an integer.
    Notes
    =====
    Potential primes are located at 6*j +/- 1. This
    property is used during searching.
    >>> from sympy import nextprime
    >>> [(i, nextprime(i)) for i in range(10, 15)]
    [(10, 11), (11, 13), (12, 13), (13, 17), (14, 17)]
    >>> nextprime(2, ith=2) # the 2nd prime after 2
    5
    See Also
    ========
    prevprime : Return the largest prime smaller than n
    primerange : Generate all primes in a given range
    */
    n = Math.floor(n);
    const i = as_int(ith);
    if (i > 1) {
        let pr = n;
        let j = 1;
        while (1) {
            pr = nextprime(pr);
            j++;
            if (j > 1) {
                break;
            }
        }
        return pr;
    }
    if (n < 2) {
        return 2;
    }
    if (n < 7) {
        return {2: 3, 3: 5, 4: 5, 5: 7, 6: 7}[n];
    }
    const nn = 6 * Math.floor(n/6);
    if (nn === n) {
        n++;
        if (isprime(n)) {
            return n;
        }
        n += 4;
    } else if (n - nn === 5) {
        n += 2;
        if (isprime(n)) {
            return n;
        }
        n += 4;
    } else {
        n = nn + 5;
    }
    while (1) {
        if (isprime(n)) {
            return n;
        }
        n += 2;
        if (isprime(n)) {
            return n;
        }
        n += 4;
    }
}

export const divmod = (a: number, b: number) => [Math.floor(a/b), a%b];

function multiplicity(p: any, n: any): any {
    /*
    Find the greatest integer m such that p**m divides n.
    Examples
    ========
    >>> from sympy import multiplicity, Rational
    >>> [multiplicity(5, n) for n in [8, 5, 25, 125, 250]]
    [0, 1, 2, 3, 3]
    >>> multiplicity(3, Rational(1, 9))
    -2
    Note: when checking for the multiplicity of a number in a
    large factorial it is most efficient to send it as an unevaluated
    factorial or to call ``multiplicity_in_factorial`` directly:
    >>> from sympy.ntheory import multiplicity_in_factorial
    >>> from sympy import factorial
    >>> p = factorial(25)
    >>> n = 2**100
    >>> nfac = factorial(n, evaluate=False)
    >>> multiplicity(p, nfac)
    52818775009509558395695966887
    >>> _ == multiplicity_in_factorial(p, n)
    True
    */
    try {
        [p, n] = [as_int(p), as_int(n)];
    } catch (Error) {
        if (Number.isInteger(p) || p instanceof Rational && Number.isInteger(n) || n instanceof Rational) {
            p = new Rational(p);
            n = new Rational(n);
            if (p.q === 1) {
                if (n.p === 1) {
                    return -multiplicity(p.p, n.q);
                }
                return multiplicity(p.p, n.p) - multiplicity(p.p, n.q);
            } else if (p.p === 1) {
                return multiplicity(p.q, n.q);
            } else {
                const like = Math.min(multiplicity(p.p, n.p), multiplicity(p.q, n.q));
                const cross = Math.min(multiplicity(p.q, n.p), multiplicity(p.p, n.q));
                return like - cross;
            }
        }
    }
    if (n === 0) {
        throw new Error("no int exists");
    }
    if (p === 2) {
        return trailing(n);
    }
    if (p < 2) {
        throw new Error("p must be int");
    }
    if (p === n) {
        return 1;
    }

    let m = 0;
    n = Math.floor(n/p);
    let rem = n % p;
    while (!rem) {
        m++;
        if (m > 5) {
            let e = 2;
            while (1) {
                const ppow = p**e;
                if (ppow < n) {
                    const nnew = Math.floor(n/ppow);
                    rem = n % ppow;
                    if (!(rem)) {
                        m += e;
                        e *= 2;
                        n = nnew;
                        continue;
                    }
                }
                return m + multiplicity(p, n);
            }
        }
        [n, rem] = divmod(n, p);
    }
    return m;
}

function divisors(n: number, generator: boolean = false, proper: boolean = false) {
    /*
    Return all divisors of n sorted from 1..n by default.
    If generator is ``True`` an unordered generator is returned.
    The number of divisors of n can be quite large if there are many
    prime factors (counting repeated factors). If only the number of
    factors is desired use divisor_count(n).
    Examples
    ========
    >>> from sympy import divisors, divisor_count
    >>> divisors(24)
    [1, 2, 3, 4, 6, 8, 12, 24]
    >>> divisor_count(24)
    8
    >>> list(divisors(120, generator=True))
    [1, 2, 4, 8, 3, 6, 12, 24, 5, 10, 20, 40, 15, 30, 60, 120]
    Notes
    =====
    This is a slightly modified version of Tim Peters referenced at:
    https://stackoverflow.com/questions/1010381/python-factorization
    See Also
    ========
    primefactors, factorint, divisor_count
    */
    n = as_int(Math.abs(n));
    if (isprime(n)) {
        if (proper) {
            return [1];
        }
        return [1, n];
    }
    if (n === 1) {
        if (proper) {
            return [];
        }
        return [1];
    }
    if (n === 0) {
        return [];
    }
    const rv = _divisors(n, proper);
    if (!generator) {
        const temp = [];
        for (const i of rv) {
            temp.push(i);
        }
        temp.sort();
        return temp;
    }
    return rv;
}

function* _divisors(n: number, generator: boolean = false, proper: boolean = false) {
    // Helper function for divisors which generates the divisors.
    const factordict = factorint(n);
    const ps = factordict.keys().sort();

    function* rec_gen(n: number = 0): any {
        if (n === ps.length) {
            yield 1;
        } else {
            const pows = [1];
            for (let j = 0; j < factordict.get(ps[n]); j++) {
                pows.push(pows[pows.length - 1] * ps[n]);
            }
            for (const q of rec_gen(n + 1)) {
                for (const p of pows) {
                    yield p * q;
                }
            }
        }
    }
    if (proper) {
        for (const p of rec_gen()) {
            if (p != n) {
                yield p;
            }
        }
    } else {
        for (const p of rec_gen()) {
            yield p;
        }
    }
}


function _check_termination(factors: any, n: number, limitp1: any) {
    /*
    Helper function for integer factorization. Checks if ``n``
    is a prime or a perfect power, and in those cases updates
    the factorization and raises ``StopIteration``.
    */
    const p = perfect_power(n, undefined, true, false);
    if (p !== false) {
        const [base, exp] = p;
        let limit;
        if (limitp1) {
            limit = limitp1 = 1;
        } else {
            limit = limitp1;
        }
        const facs = factorint(base, limit);
        for (const [b, e] of facs.entries()) {
            factors[b] = exp*e;
            throw new Error();
        }
    }
    if (isprime(n)) {
        factors.add(n, 1);
        throw new Error();
    }
    if (n === 1) {
        throw new Error();
    }
}

function _trial(factors: any, n: number, candidates: any) {
    /*
    Helper function for integer factorization. Trial factors ``n`
    against all integers given in the sequence ``candidates``
    and updates the dict ``factors`` in-place. Returns the reduced
    value of ``n`` and a flag indicating whether any factors were found.
    */
    const nfactors = factors.length;
    for (const d of candidates) {
        if (n % d === 0) {
            const m = multiplicity(d, n);
            n = Math.floor(n/(d**m));
            factors[d] = m;
        }
    }
    return [n, factors.length !== nfactors];
}

function _factorint_small(factors: HashDict, n: any, limit: any, fail_max: any) {
    /*
    Return the value of n and either a 0 (indicating that factorization up
    to the limit was complete) or else the next near-prime that would have
    been tested.
    Factoring stops if there are fail_max unsuccessful tests in a row.
    If factors of n were found they will be in the factors dictionary as
    {factor: multiplicity} and the returned value of n will have had those
    factors removed. The factors dictionary is modified in-place.
    */
    function done(n: number, d: number) {
        /*
        return n, d if the sqrt(n) was not reached yet, else
        n, 0 indicating that factoring is done.
        */
        if (d*d <= n) {
            return [n, d];
        }
        return [n, 0];
    }
    let d = 2;
    let m = trailing(n);
    if (m) {
        factors.add(d, m);
        n >>= m;
    }
    d = 3;
    if (limit < d) {
        if (n > 1) {
            factors.add(n, 1);
        }
        return done(n, d);
    }
    m = 0;
    while (n % d === 0) {
        n = Math.floor(n/d);
        m++;
        if (m === 20) {
            const mm = multiplicity(d, n);
            m += mm;
            n = Math.floor(n/(d**mm));
            break;
        }
    }
    if (m) {
        factors.add(d, m);
    }
    let maxx;
    if (limit * limit > n) {
        maxx = 0;
    } else {
        maxx = limit*limit;
    }
    let dd = maxx || n;
    d = 5;
    let fails = 0;
    while (fails < fail_max) {
        if (d*d > dd) {
            break;
        }
        m = 0;
        while (n % d === 0) {
            n = Math.floor(n/d);
            m++;
            if (m === 20) {
                const mm = multiplicity(d, n);
                m += mm;
                n = Math.floor(n / (d**mm));
                break;
            }
        }
        if (m) {
            factors.add(d, m);
            dd = maxx || n;
            fails = 0;
        } else {
            fails++;
        }
        d += 2;
        if (d*d> dd) {
            break;
        }
        m = 0;
        while (n % d === 0) {
            n = Math.floor(n / d);
            m++;
            if (m === 20) {
                const mm = multiplicity(d, n);
                m += mm;
                n = Math.floor(n/(d**mm));
                break;
            }
        }
        if (m) {
            factors.add(d, m);
            dd = maxx || n;
            fails = 0;
        } else {
            fails++;
        }
        d +=4;
    }
    return done(n, d);
}

export function factorint(n: any, limit: any = undefined): HashDict {
    /*
    Given a positive integer ``n``, ``factorint(n)`` returns a dict containing
    the prime factors of ``n`` as keys and their respective multiplicities
    as values. For example:
    >>> from sympy.ntheory import factorint
    >>> factorint(2000)    # 2000 = (2**4) * (5**3)
    {2: 4, 5: 3}
    >>> factorint(65537)   # This number is prime
    {65537: 1}
    For input less than 2, factorint behaves as follows:
        - ``factorint(1)`` returns the empty factorization, ``{}``
        - ``factorint(0)`` returns ``{0:1}``
        - ``factorint(-n)`` adds ``-1:1`` to the factors and then factors ``n``
    Partial Factorization:
    If ``limit`` (> 3) is specified, the search is stopped after performing
    trial division up to (and including) the limit (or taking a
    corresponding number of rho/p-1 steps). This is useful if one has
    a large number and only is interested in finding small factors (if
    any). Note that setting a limit does not prevent larger factors
    from being found early; it simply means that the largest factor may
    be composite. Since checking for perfect power is relatively cheap, it is
    done regardless of the limit setting.
    This number, for example, has two small factors and a huge
    semi-prime factor that cannot be reduced easily:
    >>> from sympy.ntheory import isprime
    >>> a = 1407633717262338957430697921446883
    >>> f = factorint(a, limit=10000)
    >>> f == {991: 1, int(202916782076162456022877024859): 1, 7: 1}
    True
    >>> isprime(max(f))
    False
    This number has a small factor and a residual perfect power whose
    base is greater than the limit:
    >>> factorint(3*101**7, limit=5)
    {3: 1, 101: 7}
    List of Factors:
    If ``multiple`` is set to ``True`` then a list containing the
    prime factors including multiplicities is returned.
    >>> factorint(24, multiple=True)
    [2, 2, 2, 3]
    Visual Factorization:
    If ``visual`` is set to ``True``, then it will return a visual
    factorization of the integer.  For example:
    >>> from sympy import pprint
    >>> pprint(factorint(4200, visual=True))
     3  1  2  1
    2 *3 *5 *7
    Note that this is achieved by using the evaluate=False flag in Mul
    and Pow. If you do other manipulations with an expression where
    evaluate=False, it may evaluate.  Therefore, you should use the
    visual option only for visualization, and use the normal dictionary
    returned by visual=False if you want to perform operations on the
    factors.
    You can easily switch between the two forms by sending them back to
    factorint:
    >>> from sympy import Mul
    >>> regular = factorint(1764); regular
    {2: 2, 3: 2, 7: 2}
    >>> pprint(factorint(regular))
     2  2  2
    2 *3 *7
    >>> visual = factorint(1764, visual=True); pprint(visual)
     2  2  2
    2 *3 *7
    >>> print(factorint(visual))
    {2: 2, 3: 2, 7: 2}
    If you want to send a number to be factored in a partially factored form
    you can do so with a dictionary or unevaluated expression:
    >>> factorint(factorint({4: 2, 12: 3})) # twice to toggle to dict form
    {2: 10, 3: 3}
    >>> factorint(Mul(4, 12, evaluate=False))
    {2: 4, 3: 1}
    The table of the output logic is:
        ====== ====== ======= =======
                       Visual
        ------ ----------------------
        Input  True   False   other
        ====== ====== ======= =======
        dict    mul    dict    mul
        n       mul    dict    dict
        mul     mul    dict    dict
        ====== ====== ======= =======
    Notes
    =====
    Algorithm:
    The function switches between multiple algorithms. Trial division
    quickly finds small factors (of the order 1-5 digits), and finds
    all large factors if given enough time. The Pollard rho and p-1
    algorithms are used to find large factors ahead of time; they
    will often find factors of the order of 10 digits within a few
    seconds:
    >>> factors = factorint(12345678910111213141516)
    >>> for base, exp in sorted(factors.items()):
    ...     print('%s %s' % (base, exp))
    ...
    2 2
    2507191691 1
    1231026625769 1
    Any of these methods can optionally be disabled with the following
    boolean parameters:
        - ``use_trial``: Toggle use of trial division
        - ``use_rho``: Toggle use of Pollard's rho method
        - ``use_pm1``: Toggle use of Pollard's p-1 method
    ``factorint`` also periodically checks if the remaining part is
    a prime number or a perfect power, and in those cases stops.
    For unevaluated factorial, it uses Legendre's formula(theorem).
    If ``verbose`` is set to ``True``, detailed progress is printed.
    See Also
    ========
    smoothness, smoothness_p, divisors
    */
    if (n instanceof Integer) {
        n = n.p;
    }
    n = as_int(n);
    if (limit) {
        limit = limit as number;
    }
    if (n < 0) {
        const factors = factorint(-n, limit);
        factors.add(factors.size - 1, 1);
        return factors;
    }
    if (limit && limit < 2) {
        if (n === 1) {
            return new HashDict();
        }
        return new HashDict({n: 1});
    } else if (n < 10) {
        return new HashDict([{0: 1}, {}, {2: 1}, {3: 1}, {2: 2}, {5: 1},
            {2: 1, 3: 1}, {7: 1}, {2: 3}, {3: 2}][n]);
    }

    const factors = new HashDict();
    let small = 2**15;
    const fail_max = 600;
    small = Math.min(small, limit || small);
    let next_p;
    [n, next_p] = _factorint_small(factors, n, small, fail_max);
    let sqrt_n: any;
    try {
        if (limit && next_p > limit) {
            _check_termination(factors, n, limit);
            if (n > 1) {
                factors.add(n, 1);
            }
            return factors;
        } else {
            sqrt_n = int_nthroot(n, 2)[0];
            let a = sqrt_n + 1;
            const a2 = a**2;
            let b2 = a2 - n;
            let b: any; let fermat: any;
            for (let i = 0; i < 3; i++) {
                [b, fermat] = int_nthroot(b2, 2);
                if (fermat) {
                    break;
                }
                b2 += 2*a + 1;
                a++;
            }
            if (fermat) {
                if (limit) {
                    limit -= 1;
                }
                for (const r of [a - b, a + b]) {
                    const facs = factorint(r, limit);
                    for (const [k, v] of facs.entries()) {
                        factors.add(k, factors.get(k, 0) + v);
                    }
                }
                throw new Error();
            }
            _check_termination(factors, n, limit);
        }
    } catch (Error) {
        return factors;
    }

    let [low, high] = [next_p, 2 * next_p];
    limit = (limit || sqrt_n) as number;
    limit++;
    while (1) {
        try {
            let high_ = high;
            if (limit < high_) {
                high_ = limit;
            }
            const ps = primerange(low, high_);
            let found_trial;
            [n, found_trial] = _trial(factors, n, ps);
            if (found_trial) {
                _check_termination(factors, n, limit);
            }
            if (high > limit) {
                if (n > 1) {
                    factors.add(n, 1);
                }
                throw new Error();
            }
            if (!found_trial) {
                throw new Error("advanced factoring methods are not yet implemented");
            }
        } catch (Error) {
            return factors;
        }
        [low, high] = [high, high*2];
    }
    let B1 = 10000;
    let B2 = 100*B1;
    let num_curves = 50;
    while (1) {
        while (1) {
            try {
                throw new Error("ecm one factor not yet implemented");
                // _check_termination(factors, n, limit);
            } catch (Error) {
                return factors;
            }
        }
        B1 *= 5;
        // eslint-disable-next-line no-unused-vars
        B2 = 100*B1;
        // eslint-disable-next-line no-unused-vars
        num_curves *= 4;
    }
}

export function perfect_power(n: any, candidates: any = undefined, big: boolean = true,
    factor: boolean = true, num_iterations: number = 15): any {
    /*
    Return ``(b, e)`` such that ``n`` == ``b**e`` if ``n`` is a unique
    perfect power with ``e > 1``, else ``False`` (e.g. 1 is not a
    perfect power). A ValueError is raised if ``n`` is not Rational.
    By default, the base is recursively decomposed and the exponents
    collected so the largest possible ``e`` is sought. If ``big=False``
    then the smallest possible ``e`` (thus prime) will be chosen.
    If ``factor=True`` then simultaneous factorization of ``n`` is
    attempted since finding a factor indicates the only possible root
    for ``n``. This is True by default since only a few small factors will
    be tested in the course of searching for the perfect power.
    The use of ``candidates`` is primarily for internal use; if provided,
    False will be returned if ``n`` cannot be written as a power with one
    of the candidates as an exponent and factoring (beyond testing for
    a factor of 2) will not be attempted.
    Examples
    ========
    >>> from sympy import perfect_power, Rational
    >>> perfect_power(16)
    (2, 4)
    >>> perfect_power(16, big=False)
    (4, 2)
    Negative numbers can only have odd perfect powers:
    >>> perfect_power(-4)
    False
    >>> perfect_power(-8)
    (-2, 3)
    Rationals are also recognized:
    >>> perfect_power(Rational(1, 2)**3)
    (1/2, 3)
    >>> perfect_power(Rational(-3, 2)**3)
    (-3/2, 3)
    Notes
    =====
    To know whether an integer is a perfect power of 2 use
        >>> is2pow = lambda n: bool(n and not n & (n - 1))
        >>> [(i, is2pow(i)) for i in range(5)]
        [(0, False), (1, True), (2, True), (3, False), (4, True)]
    It is not necessary to provide ``candidates``. When provided
    it will be assumed that they are ints. The first one that is
    larger than the computed maximum possible exponent will signal
    failure for the routine.
        >>> perfect_power(3**8, [9])
        False
        >>> perfect_power(3**8, [2, 4, 8])
        (3, 8)
        >>> perfect_power(3**8, [4, 8], big=False)
        (9, 4)
    See Also
    ========
    sympy.core.power.integer_nthroot
    sympy.ntheory.primetest.is_square
    */
    let pp;
    if (n instanceof Rational && !(n.is_integer)) {
        const [p, q] = n._as_numer_denom();
        if (p === S.One) {
            pp = perfect_power(q);
            if (pp) {
                pp = [n.constructor(1, pp[0]), pp[1]];
            }
        } else {
            pp = perfect_power(p);
            if (pp) {
                const [num, e] = pp;
                const pq = perfect_power(q, [e]);
                if (pq) {
                    // eslint-disable-next-line no-unused-vars
                    const [den, blank] = pq;
                    pp = [n.constructor(num, den), e];
                }
            }
        }
        return pp;
    }

    n = as_int(n);
    if (n < 0) {
        pp = perfect_power(-n);
        if (pp) {
            const [b, e] = pp;
            if (e % 2 !== 0) {
                return [-b, e];
            }
        }
        return false;
    }

    if (n <= 3) {
        return false;
    }

    const logn = Math.log2(n);
    const max_possible = Math.floor(logn) + 2;
    const not_square = [2, 3, 7, 8].includes(n % 10);
    const min_possible = 2 + (not_square as any as number);
    if (typeof candidates === "undefined") {
        candidates = primerange(min_possible, max_possible);
    } else {
        const temp = [];
        candidates.sort();
        for (const i of candidates) {
            if (min_possible <= i && i <= max_possible) {
                temp.push(i);
            }
        }
        candidates = temp;
        if (n % 2 === 0) {
            const e = trailing(n);
            const temp2 = [];
            for (const i of candidates) {
                if (e % i === 0) {
                    temp2.push(i);
                }
            }
            candidates = temp2;
        }
        if (big) {
            candidates.reverse();
        }
        for (const e of candidates) {
            const [r, ok] = int_nthroot(n, e);
            if (ok) {
                return [r, e];
            }
        }
        return false;
    }
    function* _factors(length: number) {
        let rv = 2 + n % 2;
        for (let i = 0; i < length; i++) {
            yield rv;
            rv = nextprime(rv);
        }
    }
    // original algorithm generates infinite sequences of the following
    // for now we will generate limited sized arrays and use those
    const _candidates = [];
    for (const i of candidates) {
        _candidates.push(i);
    }
    const _factors_ = [];
    for (const i of _factors(_candidates.length)) {
        _factors_.push(i);
    }
    for (const item of Util.zip(_factors_, _candidates)) {
        const fac = item[0];
        let e = item[1];
        let r;
        let exact;
        if (factor && n % fac === 0) {
            if (fac === 2) {
                e = trailing(n);
            } else {
                e = multiplicity(fac, n);
            }
            if (e === 1) {
                return false;
            }

            [r, exact] = int_nthroot(n, e);
            if (!(exact)) {
                const m = Math.floor(n / fac) ** e;
                const rE = perfect_power(m, divisors(e, true));
                if (!(rE)) {
                    return false;
                } else {
                    let [r, E] = rE;
                    [r, e] = [fac**(Math.floor(e/E)*r), E];
                }
            }
            return [r, e];
        }
        if (logn/e < 40) {
            const b = 2.0**(logn/e);
            if (Math.abs(Math.floor(b + 0.5) - b) > 0.01) {
                continue;
            }
        }
        [r, exact] = int_nthroot(n, e);
        if (exact) {
            const m = perfect_power(r, undefined, big, factor);
            if (m) {
                [r, e] = [m[0], e * m[1]];
            }
            return [Math.floor(r), e];
        }
    }
    return false;
}

export function factorrat(rat: any, limit: number = undefined) {
    /*
    Given a Rational ``r``, ``factorrat(r)`` returns a dict containing
    the prime factors of ``r`` as keys and their respective multiplicities
    as values. For example:
    >>> from sympy import factorrat, S
    >>> factorrat(S(8)/9)    # 8/9 = (2**3) * (3**-2)
    {2: 3, 3: -2}
    >>> factorrat(S(-1)/987)    # -1/789 = -1 * (3**-1) * (7**-1) * (47**-1)
    {-1: 1, 3: -1, 7: -1, 47: -1}
    Please see the docstring for ``factorint`` for detailed explanations
    and examples of the following keywords:
        - ``limit``: Integer limit up to which trial division is done
        - ``use_trial``: Toggle use of trial division
        - ``use_rho``: Toggle use of Pollard's rho method
        - ``use_pm1``: Toggle use of Pollard's p-1 method
        - ``verbose``: Toggle detailed printing of progress
        - ``multiple``: Toggle returning a list of factors or dict
        - ``visual``: Toggle product form of output
    */
    const f = factorint(rat.p, limit);
    for (const item of factorint(rat.q, limit).entries()) {
        const p = item[0];
        const e = item[1];
        f.add(p, f.get(p, 0) - e);
    }
    if (f.size > 1 && f.has(1)) {
        f.remove(1);
    }
    return f;
}
