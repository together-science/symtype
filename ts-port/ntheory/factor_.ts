import {Rational, int_nthroot, Integer} from "../core/numbers.js";
import {S} from "../core/singleton.js";
import {HashDict, Util} from "../core/utility.js";
import {as_int} from "../utilities/misc.js";

const small_trailing = new Array(256).fill(0);
for (let j = 1; j < 8; j++) {
    Util.assignElements(small_trailing, new Array((1<<(7-j))).fill(j), 1<<j, 1<<(j+1));
}

function bitcount(n: number) {
    let bits = 0;
    while (n !== 0) {
        bits += bitCount32(n | 0);
        n /= 0x100000000;
    }
    return bits;
}

function bitCount32(n: number) {
    n = n - ((n >> 1) & 0x55555555);
    n = (n & 0x33333333) + ((n >> 2) & 0x33333333);
    return ((n + (n >> 4) & 0xF0F0F0F) * 0x1010101) >> 24;
}

function trailing(n: number) {
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

// eslint-disable-next-line no-unused-vars
function primefactors(n: number, limit: any = undefined) {
    n = Math.floor(n);
    const factors = factorint(n, limit).keys().sort();
    const s = [];
    for (const f of factors.splice(0, factors.length-1)) {
        if (!(f === -1 || f === 0 || f === 1)) {
            s.push(f);
        }
    }
    if (factors && isprime(factors[factors.length - 1])) {
        s.push(factors[factors.length - 1]);
    }
    return s;
}

function _check_termination(factors: any, n: number, limitp1: any) {
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
    function done(n: number, d: number) {
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
                /*
                            if not found_trial:
                if (use_pm1 or use_rho):
                    high_root = max(int(math.log(high_**0.7)), low, 3)

                    # Pollard p-1
                    if use_pm1:
                        if verbose:
                            print(pm1_msg % (high_root, high_))
                        c = pollard_pm1(n, B=high_root, seed=high_)
                        if c:
                            # factor it and let _trial do the update
                            ps = factorint(c, limit=limit - 1,
                                           use_trial=use_trial,
                                           use_rho=use_rho,
                                           use_pm1=use_pm1,
                                           use_ecm=use_ecm,
                                           verbose=verbose)
                            n, _ = _trial(factors, n, ps, verbose=False)
                            _check_termination(factors, n, limit, use_trial,
                                               use_rho, use_pm1, verbose)

                    # Pollard rho
                    if use_rho:
                        max_steps = high_root
                        if verbose:
                            print(rho_msg % (1, max_steps, high_))
                        c = pollard_rho(n, retries=1, max_steps=max_steps,
                                        seed=high_)
                        if c:
                            # factor it and let _trial do the update
                            ps = factorint(c, limit=limit - 1,
                                           use_trial=use_trial,
                                           use_rho=use_rho,
                                           use_pm1=use_pm1,
                                           use_ecm=use_ecm,
                                           verbose=verbose)
                            n, _ = _trial(factors, n, ps, verbose=False)
                            _check_termination(factors, n, limit, use_trial,
                                               use_rho, use_pm1, verbose)
                */
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
                // const factor = _ecm_one_factor(n, B1, B2, num_curves);
                // const ps = factorint(factor, limit-1);
                // let blank;
                // eslint-disable-next-line no-unused-vars
                // [n, blank] = _trial(factors, n, ps);
                _check_termination(factors, n, limit);
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
