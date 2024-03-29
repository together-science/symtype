/* eslint-disable no-unused-vars */
/*
Algorithms and classes to support enumerative combinatorics.

Currently just multiset partitions, but more could be added.

Terminology (following Knuth, algorithm 7.1.2.5M TAOCP)
*multiset* aaabbcccc has a *partition* aaabc | bccc

The submultisets, aaabc and bccc of the partition are called
*parts*, or sometimes *vectors*.  (Knuth notes that multiset
partitions can be thought of as partitions of vectors of integers,
where the ith element of the vector gives the multiplicity of
element i.)

The values a, b and c are *components* of the multiset.  These
correspond to elements of a set, but in a multiset can be present
with a multiplicity greater than 1.

The algorithm deserves some explanation.

Think of the part aaabc from the multiset above.  If we impose an
ordering on the components of the multiset, we can represent a part
with a vector, in which the value of the first element of the vector
corresponds to the multiplicity of the first component in that
part. Thus, aaabc can be represented by the vector [3, 1, 1].  We
can also define an ordering on parts, based on the lexicographic
ordering of the vector (leftmost vector element, i.e., the element
with the smallest component number, is the most significant), so
that [3, 1, 1] > [3, 1, 0] and [3, 1, 1] > [2, 1, 4].  The ordering
on parts can be extended to an ordering on partitions: First, sort
the parts in each partition, left-to-right in decreasing order. Then
partition A is greater than partition B if A's leftmost/greatest
part is greater than B's leftmost part.  If the leftmost parts are
equal, compare the second parts, and so on.

In this ordering, the greatest partition of a given multiset has only
one part.  The least partition is the one in which the components
are spread out, one per part.

The enumeration algorithms in this file yield the partitions of the
argument multiset in decreasing order.  The main data structure is a
stack of parts, corresponding to the current partition.  An
important invariant is that the parts on the stack are themselves in
decreasing order.  This data structure is decremented to find the
next smaller partition.  Most often, decrementing the partition will
only involve adjustments to the smallest parts at the top of the
stack, much as adjacent integers *usually* differ only in their last
few digits.

Knuth's algorithm uses two main operations on parts:

Decrement - change the part so that it is smaller in the
  (vector) lexicographic order, but reduced by the smallest amount possible.
  For example, if the multiset has vector [5,
  3, 1], and the bottom/greatest part is [4, 2, 1], this part would
  decrement to [4, 2, 0], while [4, 0, 0] would decrement to [3, 3,
  1].  A singleton part is never decremented -- [1, 0, 0] is not
  decremented to [0, 3, 1].  Instead, the decrement operator needs
  to fail for this case.  In Knuth's pseudocode, the decrement
  operator is step m5.

Spread unallocated multiplicity - Once a part has been decremented,
  it cannot be the rightmost part in the partition.  There is some
  multiplicity that has not been allocated, and new parts must be
  created above it in the stack to use up this multiplicity.  To
  maintain the invariant that the parts on the stack are in
  decreasing order, these new parts must be less than or equal to
  the decremented part.
  For example, if the multiset is [5, 3, 1], and its most
  significant part has just been decremented to [5, 3, 0], the
  spread operation will add a new part so that the stack becomes
  [[5, 3, 0], [0, 0, 1]].  If the most significant part (for the
  same multiset) has been decremented to [2, 0, 0] the stack becomes
  [[2, 0, 0], [2, 0, 0], [1, 3, 1]].  In the pseudocode, the spread
  operation for one part is step m2.  The complete spread operation
  is a loop of steps m2 and m3.

In order to facilitate the spread operation, Knuth stores, for each
component of each part, not just the multiplicity of that component
in the part, but also the total multiplicity available for this
component in this part or any lesser part above it on the stack.

One added twist is that Knuth does not represent the part vectors as
arrays. Instead, he uses a sparse representation, in which a
component of a part is represented as a component number (c), plus
the multiplicity of the component in that part (v) as well as the
total multiplicity available for that component (u).  This saves
time that would be spent skipping over zeros.
*/

/*

Notable changes made (WB and GM):
- Replaced all tuples with arrays

*/

import {HashSet} from "../core/utility";

class PartComponent {
    /* Internal class used in support of the multiset partitions
    enumerators and the associated visitor functions.

    Represents one component of one part of the current partition.

    A stack of these, plus an auxiliary frame array, f, represents a
    partition of the multiset.

    Knuth's pseudocode makes c, u, and v separate arrays.
    */

    __slots__ = ["c", "u", "v"];
    c;
    u;
    v;

    constructor() {
        this.c = 0; // Component numbe
        this.u = 0; // The as yet unpartitioned amount in component c
        // *before* it is allocated by this triple
        this.v = 0; // Amount of c component in the current part
        // (v<=u).  An invariant of the representation is
        // that the next higher triple for this component
        // (if there is one) will have a value of u-v in
        // its u attribute.
    }

    toString() { // for debug
        return this.c + ", " + this.u + ", " + this.v;
    }

    equals(other: any) {
        return (other.constructor.name === this.constructor.name &&
            this.c === other.c &&
            this.u === other.u &&
            this.v === other.v);
    }

    notEquals(other: any) {
        return !this.equals(other);
    }
}

// This function tries to be a faithful implementation of algorithm
// 7.1.2.5M in Volume 4A, Combinatoral Algorithms, Part 1, of The Art
// of Computer Programming, by Donald Knuth.  This includes using
// (mostly) the same variable names, etc.  This makes for rather
// low-level Python.

//  Changes from Knuth's pseudocode include
// - use PartComponent struct/object instead of 3 arrays
// - make the function a generator
// - map (with some difficulty) the GOTOs to Python control structures.
// - Knuth uses 1-based numbering for components, this code is 0-based
// - renamed variable l to lpart.
// - flag variable x takes on values True/False instead of 1/0
//

function* multiset_partitions_taocp(multiplicities: any[]) {
    /* Enumerates partitions of a multiset.

    Parameters
    ==========

    multiplicities
         list of integer multiplicities of the components of the multiset.

    Yields
    ======

    state
        Internal data structure which encodes a particular partition.
        This output is then usually processed by a visitor function
        which combines the information from this data structure with
        the components themselves to produce an actual partition.

        Unless they wish to create their own visitor function, users will
        have little need to look inside this data structure.  But, for
        reference, it is a 3-element list with components:

        f
            is a frame array, which is used to divide pstack into parts.

        lpart
            points to the base of the topmost part.

        pstack
            is an array of PartComponent objects.

        The ``state`` output offers a peek into the internal data
        structures of the enumeration function.  The client should
        treat this as read-only; any modification of the data
        structure will cause unpredictable (and almost certainly
        incorrect) results.  Also, the components of ``state`` are
        modified in place at each iteration.  Hence, the visitor must
        be called at each loop iteration.  Accumulating the ``state``
        instances and processing them later will not work.

    Examples
    ========

    >>> from sympy.utilities.enumerative import list_visitor
    >>> from sympy.utilities.enumerative import multiset_partitions_taocp
    >>> # variables components and multiplicities represent the multiset 'abb'
    >>> components = 'ab'
    >>> multiplicities = [1, 2]
    >>> states = multiset_partitions_taocp(multiplicities)
    >>> list(list_visitor(state, components) for state in states)
    [[['a', 'b', 'b']],
    [['a', 'b'], ['b']],
    [['a'], ['b', 'b']],
    [['a'], ['b'], ['b']]]

    See Also
    ========

    sympy.utilities.iterables.multiset_partitions: Takes a multiset
        as input and directly yields multiset partitions.  It
        dispatches to a number of functions, including this one, for
        implementation.  Most users will find it more convenient to
        use than multiset_partitions_taocp.

    */

    // important variables
    // m is the number of components, i.e., number of distinct elements
    const m = multiplicities.length;
    // n is the cardinality, total number of elements whether or not distinct
    let n: number = 0;
    multiplicities.forEach((e: any) => n += e);
    // The main data structure, f segments pstack into parts.  See
    // list_visitor() for example code indicating how this internal
    // state corresponds to a partition.

    // Note: allocation of space for stack is conservative.  Knuth's
    // exercise 7.2.1.5.68 gives some indication of how to tighten this
    // bound, but this is not implemented.
    const pstack: any[] = [];
    for (let i = 0; i < n * m + 1; i++) {
        pstack.push(new PartComponent());
    }
    const f = new Array(n + 1).fill(0);
    // Step M1 in Knuth (Initialize)
    // Initial state - entire multiset in one part.

    for (let j = 0; j < m; j++) {
        const ps = pstack[j];
        ps.c = j;
        ps.u = multiplicities[j];
        ps.v = multiplicities[j];
    }

    // other variables
    f[0] = 0;
    let a = 0;
    let lpart = 0;
    f[1] = m;
    let b = m; // in general, current stack frame is from a to b - 1

    while (true) {
        while (true) {
            // Step M2 (Subtract v from u)
            let j = a;
            let k = b;
            let x = false;
            while (j < b) {
                pstack[k].u = pstack[j].u - pstack[j].v;
                if (pstack[k].u === 0) {
                    x = true;
                } else if (!x) {
                    pstack[k].c = pstack[j].c;
                    pstack[k].v = Math.min(pstack[j].v, pstack[k].u);
                    x = pstack[k].u < pstack[j].v;
                    k++;
                } else { // x is true
                    pstack[k].c = pstack[j].c;
                    pstack[k].v = pstack[k].u;
                    k++;
                }
                j++;
                // Note: x is True iff v has changed
            }
            // Step M3 (Push if nonzero.)
            if (k > b) {
                a = b;
                b = k;
                lpart++;
                f[lpart + 1] = b;
                // return to M@
            } else {
                break; // continue to M4
            }
        }
        // M4 visit a partition
        const state = [f, lpart, pstack];
        yield state;

        // M5 (decrease v)
        while (true) {
            let j = b - 1;
            while (pstack[j].v === 0) {
                j--;
            }
            if (j === a && pstack[j].v === 1) {
                // M6 (backtrack)
                if (lpart === 0) {
                    return;
                }
                lpart--;
                b = a;
                a = f[lpart];
                // Return to M5
            } else {
                pstack[j].v--;
                for (let k = j + 1; j < b; j++) {
                    pstack[k].v = pstack[k].u;
                }
                break; // goto M2
            }
        }
    }
}

// --------------- Visitor functions for multiset partitions ---------------
// A visitor takes the partition state generated by
// multiset_partitions_taocp or other enumerator, and produces useful
// output (such as the actual partition).

function factoring_visitor(state: any, primes: any[]) {
    /* Use with multiset_partitions_taocp to enumerate the ways a
    number can be expressed as a product of factors.  For this usage,
    the exponents of the prime factors of a number are arguments to
    the partition enumerator, while the corresponding prime factors
    are input here.

    Examples
    ========

    To enumerate the factorings of a number we can think of the elements of the
    partition as being the prime factors and the multiplicities as being their
    exponents.

    >>> from sympy.utilities.enumerative import factoring_visitor
    >>> from sympy.utilities.enumerative import multiset_partitions_taocp
    >>> from sympy import factorint
    >>> primes, multiplicities = zip(*factorint(24).items())
    >>> primes
    (2, 3)
    >>> multiplicities
    (3, 1)
    >>> states = multiset_partitions_taocp(multiplicities)
    >>> list(factoring_visitor(state, primes) for state in states)
    [[24], [8, 3], [12, 2], [4, 6], [4, 2, 3], [6, 2, 2], [2, 2, 2, 3]]
    */

    const [f, lpart, pstack] = state;
    const factoring: any = [];
    for (let i = 0; i < lpart + 1; i++) {
        let factor = 1;
        for (const ps of pstack.slice(f[i], f[i + 1])) {
            if (ps.v > 0) {
                factor *= primes[ps.c] ** ps.v;
            }
        }
        factoring.push(factor);
    }
    return factoring;
}


function list_visitor(state: any, components: any) {
    /* Return a list of lists to represent the partition.

    Examples
    ========

    >>> from sympy.utilities.enumerative import list_visitor
    >>> from sympy.utilities.enumerative import multiset_partitions_taocp
    >>> states = multiset_partitions_taocp([1, 2, 1])
    >>> s = next(states)
    >>> list_visitor(s, 'abc')  # for multiset 'a b b c'
    [['a', 'b', 'b', 'c']]
    >>> s = next(states)
    >>> list_visitor(s, [1, 2, 3])  # for multiset '1 2 2 3
    [[1, 2, 2], [3]]
    */
    const [f, lpart, pstack] = state;

    const partition: any[] = [];
    for (let i = 0; i < lpart + 1; i++) {
        const part: any[] = [];
        for (const ps of pstack.slice(f[i], f[i + 1])) {
            if (ps.v > 0) {
                part.push(new Array(ps.v).fill(components[ps.c]));
            }
        }
        partition.push(part);
    }
    return partition;
}

class MultisetPartitionTraverser {
    /*
    Has methods to ``enumerate`` and ``count`` the partitions of a multiset.

    This implements a refactored and extended version of Knuth's algorithm
    7.1.2.5M [AOCP]_."

    The enumeration methods of this class are generators and return
    data structures which can be interpreted by the same visitor
    functions used for the output of ``multiset_partitions_taocp``.

    Examples
    ========

    >>> from sympy.utilities.enumerative import MultisetPartitionTraverser
    >>> m = MultisetPartitionTraverser()
    >>> m.count_partitions([4,4,4,2])
    127750
    >>> m.count_partitions([3,3,3])
    686

    See Also
    ========

    multiset_partitions_taocp
    sympy.utilities.iterables.multiset_partitions

    References
    ==========

    .. [AOCP] Algorithm 7.1.2.5M in Volume 4A, Combinatoral Algorithms,
           Part 1, of The Art of Computer Programming, by Donald Knuth.

    .. [Factorisatio] On a Problem of Oppenheim concerning
           "Factorisatio Numerorum" E. R. Canfield, Paul Erdos, Carl
           Pomerance, JOURNAL OF NUMBER THEORY, Vol. 17, No. 1. August
           1983.  See section 7 for a description of an algorithm
           similar to Knuth's.

    .. [Yorgey] Generating Multiset Partitions, Brent Yorgey, The
           Monad.Reader, Issue 8, September 2007.
    */

    debug;
    k1;
    k2;
    p1;
    pstack: any;
    f: any;
    lpart;
    discarded;
    dp_stack: any;
    dp_map;
    pcount: any;

    constructor() {
        this.debug = false;
        // TRACING variables.  These are useful for gathering
        // statistics on the algorithm itself, but have no particular
        // benefit to a user of the code.
        this.k1 = 0;
        this.k2 = 0;
        this.p1 = 0;
        this.pstack = undefined;
        this.f = undefined;
        this.lpart = 0;
        this.discarded = 0;
        // dp_stack is list of lists of (part_key, start_count) pairs
        this.dp_stack = [];

        // dp_map is map part_key-> count, where count represents the
        // number of multiset which are descendants of a part with this
        // key, **or any of its decrements**

        // Thus, when we find a part in the map, we add its count
        // value to the running total, cut off the enumeration, and
        // backtrack

        if (!(this.dp_map)) {
            this.dp_map = new HashSet();
        }
    }

    db_trace(msg: any) {
        /* Useful for understanding/debugging the algorithms.  Not
        generally activated in end-user code. */
        if (this.debug) {
            // XXX: animation_visitor is undefined... Clearly this does not
            // work and was not tested. Previous code in comments below.
            throw new Error;
            // letters = 'abcdefghijklmnopqrstuvwxyz'
            // state = [self.f, self.lpart, self.pstack]
            // print("DBG:", msg,
            //      ["".join(part) for part in list_visitor(state, letters)],
            //      animation_visitor(state))
        }
    }

    // Helper methods for enumeration

    _initialize_enumeration(multiplicities: any[]) {
        /* Allocates and initializes the partition stack.

        This is called from the enumeration/counting routines, so
        there is no need to call it separately. */

        const num_components = multiplicities.length;
        // cardinality is the total number of elements, whether or not distinct
        let cardinality: number = 0;
        multiplicities.forEach((e: any) => cardinality += e);
        // pstack is the partition stack, which is segmented by
        // f into parts.
        const parr: any[] = [];
        for (let i = 0; i < num_components * cardinality + 1; i++) {
            parr.push(new PartComponent());
        }
        this.pstack = parr;
        this.f = new Array(cardinality + 1).fill(0);
        // Initial state - entire multiset in one part.
        for (let j = 0; j < num_components; j++) {
            const ps = this.pstack[j];
            ps.c = j;
            ps.u = multiplicities[j];
            ps.v = multiplicities[j];
        }
        this.f[0] = 0;
        this.f[1] = num_components;
        this.lpart = 0;
    }

    // The decrement_part() method corresponds to step M5 in Knuth's
    // algorithm.  This is the base version for enum_all().  Modified
    // versions of this method are needed if we want to restrict
    // sizes of the partitions produced.

    decrement_part(part: any) {
        /* Decrements part (a subrange of pstack), if possible, returning
        True iff the part was successfully decremented.

        If you think of the v values in the part as a multi-digit
        integer (least significant digit on the right) this is
        basically decrementing that integer, but with the extra
        constraint that the leftmost digit cannot be decremented to 0.

        Parameters
        ==========

        part
           The part, represented as a list of PartComponent objects,
           which is to be decremented.
        */

        const plen = part.length;
        for (let j = plen - 1; j > -1; j--) {
            if ((j === 0 && part[j].v > 1) || (j > 0 && part[j].v > 0)) {
                // found val to decrement
                part[j].v--;
                // reset trailing parts back to maximum
                for (let k = j + 1; k < plen; k++) {
                    part[k].v = part[k].u;
                }
                return true;
            }
        }
        return false;
    }

    // Version to allow number of parts to be bounded from above.
    // Corresponds to (a modified) step M5.
    decrement_part_small(part: any, ub: any) {
        /* Decrements part (a subrange of pstack), if possible, returning
        True iff the part was successfully decremented.

        Parameters
        ==========

        part
            part to be decremented (topmost part on the stack)

        ub
            the maximum number of parts allowed in a partition
            returned by the calling traversal.

        Notes
        =====

        The goal of this modification of the ordinary decrement method
        is to fail (meaning that the subtree rooted at this part is to
        be skipped) when it can be proved that this part can only have
        child partitions which are larger than allowed by ``ub``. If a
        decision is made to fail, it must be accurate, otherwise the
        enumeration will miss some partitions.  But, it is OK not to
        capture all the possible failures -- if a part is passed that
        should not be, the resulting too-large partitions are filtered
        by the enumeration one level up.  However, as is usual in
        constrained enumerations, failing early is advantageous.

        The tests used by this method catch the most common cases,
        although this implementation is by no means the last word on
        this problem.  The tests include:

        1) ``lpart`` must be less than ``ub`` by at least 2.  This is because
           once a part has been decremented, the partition
           will gain at least one child in the spread step.

        2) If the leading component of the part is about to be
           decremented, check for how many parts will be added in
           order to use up the unallocated multiplicity in that
           leading component, and fail if this number is greater than
           allowed by ``ub``.  (See code for the exact expression.)  This
           test is given in the answer to Knuth's problem 7.2.1.5.69.

        3) If there is *exactly* enough room to expand the leading
           component by the above test, check the next component (if
           it exists) once decrementing has finished.  If this has
           ``v == 0``, this next component will push the expansion over the
           limit by 1, so fail.
        */
        if (this.lpart >= ub - 1) {
            this.p1++; // increment to keep track of usefulness of tests
            return false;
        }
        const plen = part.length;
        for (let j = plen - 1; j > -1; j--) {
            // Knuth's mod, (answer to problem 7.2.1.5.69)
            if (j == 0 && (part[0].v - 1) * (ub - this.lpart) < part[0].u) {
                this.k1++;
                return false;
            }
            if ((j == 0 && part[j].v > 1) || (j > 0 && part[j].v > 0)) {
                // found val to decrement
                part[j].v--;
                // reset trailing parts back to maximum
                for (let k = j + 1; k < plen; k++) {
                    part[k].v = part[k].u;
                }
                // Have now decremented part, but are we doomed to
                // failure when it is expanded?  Check one oddball case
                // that turns out to be surprisingly common - exactly
                // enough room to expand the leading component, but no
                // room for the second component, which has v=0.
                if (plen > 1 && part[1].v === 0 && (part[0].u - part[0].v) ===
                    ((ub - this.lpart - 1) * part[0].v)) {
                    this.k2++;
                    this.db_trace("decrement fails test 3");
                    return false;
                }
                return true;
            }
        }
        return false;
    }
    /*

            if j == 0 and (part[0].v - 1)*(ub - self.lpart) < part[0].u:
                self.k1 += 1
                return False

            if j == 0 and part[j].v > 1 or j > 0 and part[j].v > 0:
                # found val to decrement
                part[j].v -= 1
                # Reset trailing parts back to maximum
                for k in range(j + 1, plen):

                if (plen > 1 and part[1].v == 0 and
                    (part[0].u - part[0].v) ==
                        ((ub - self.lpart - 1) * part[0].v)):
                    self.k2 += 1
                    self.db_trace("Decrement fails test 3")
                    return False
                return True
        return False
    */

    decrement_part_large(part: any, amt: any, lb: any) {
        /* Decrements part, while respecting size constraint.

        A part can have no children which are of sufficient size (as
        indicated by ``lb``) unless that part has sufficient
        unallocated multiplicity.  When enforcing the size constraint,
        this method will decrement the part (if necessary) by an
        amount needed to ensure sufficient unallocated multiplicity.

        Returns True iff the part was successfully decremented.

        Parameters
        ==========

        part
            part to be decremented (topmost part on the stack)

        amt
            Can only take values 0 or 1.  A value of 1 means that the
            part must be decremented, and then the size constraint is
            enforced.  A value of 0 means just to enforce the ``lb``
            size constraint.

        lb
            The partitions produced by the calling enumeration must
            have more parts than this value.

        */

        if (amt === 1) {
            // In this case we always need to increment, *before*
            // enforcing the "sufficient unallocated multiplicity"
            // constraint.  Easiest for this is just to call the
            // regular decrement method.
            if (!this.decrement_part(part)) {
                return false;
            }
        }

        // Next, perform any needed additional decrementing to respect
        // "sufficient unallocated multiplicity" (or fail if this is
        // not possible).

        const min_unalloc = lb - this.lpart;
        if (min_unalloc <= 0) {
            return true;
        }
        let total_mult = 0;
        let total_alloc = 0;
        part.forEach((pc: any) => {
            total_mult += pc.u;
            total_alloc += pc.v;
        });
        if (total_mult <= min_unalloc) {
            return false;
        }
        let deficit = min_unalloc - (total_mult - total_alloc);
        if (deficit <= 0) {
            return true;
        }
        for (let i = part.length - 1; i > -1; i--) {
            if (i === 0) {
                if (part[0].v > deficit) {
                    part[0].v -= deficit;
                    return true;
                } else {
                    return false; // this shouldn't happen, due to above check
                }
            } else {
                if (part[i].v >= deficit) {
                    part[i].v -= deficit;
                    return true;
                } else {
                    deficit -= part[i].v;
                    part[i].v = 0;
                }
            }
        }
    }

    decrement_part_range(part: any, lb: any, ub: any) {
        /* Decrements part (a subrange of pstack), if possible, returning
        True iff the part was successfully decremented.

        Parameters
        ==========

         part
            part to be decremented (topmost part on the stack)

        ub
            the maximum number of parts allowed in a partition
            returned by the calling traversal.

        lb
            The partitions produced by the calling enumeration must
            have more parts than this value.

        Notes
        =====

        Combines the constraints of _small and _large decrement
        methods.  If returns success, part has been decremented at
        least once, but perhaps by quite a bit more if needed to meet
        the lb constraint.
        */

        // Constraint in the range case is just enforcing both the
        // constraints from _small and _large cases.  Note the 0 as the
        // second argument to the _large call -- this is the signal to
        // decrement only as needed to for constraint enforcement.  The
        // short circuiting and left-to-right order of the 'and'
        // operator is important for this to work correctly.
        return this.decrement_part_small(part, ub) &&
            this.decrement_part_large(part, 0, lb);
    }

    spread_part_multiplicity() {
        /* Returns True if a new part has been created, and
        adjusts pstack, f and lpart as needed.

        Notes
        =====

        Spreads unallocated multiplicity from the current top part
        into a new part created above the current on the stack.  This
        new part is constrained to be less than or equal to the old in
        terms of the part ordering.

        This call does nothing (and returns False) if the current top
        part has no unallocated multiplicity.

        */

        const j = this.f[this.lpart]; // base of current top part
        let k = this.f[this.lpart + 1]; // ub of current; potential base of next
        const base = k; // save for later comparison
        let changed = false; // Set to true when the new part (so far) is
        // strictly less than (as opposed to less than
        // or equal) to the old.
        for (let j = this.f[this.lpart]; j < this.f[this.lpart + 1]; j++) {
            this.pstack[k].u = this.pstack[j].u - this.pstack[j].v;
            if (this.pstack[k].u === 0) {
                changed = true;
            } else {
                this.pstack[k].c = this.pstack[j].c;
                if (changed) { // Put all available multiplicity in this part
                    this.pstack[k].v = this.pstack[k].u;
                } else { // Still maintaining ordering constraint
                    if (this.pstack[k].u < this.pstack[j].v) {
                        this.pstack[k].v = this.pstack[k].u;
                        changed = true;
                    } else {
                        this.pstack[k].v = this.pstack[j].v;
                    }
                }
                k++;
            }
        }
        if (k > base) {
            // Adjust for the new part on stack
            this.lpart++;
            this.f[this.lpart + 1] = k;
            return true;
        }
        return false;
    }

    /*
        j = self.f[self.lpart]  # base of current top part
        k = self.f[self.lpart + 1]  # ub of current; potential base of next
        base = k  # save for later comparison

        changed = False  # Set to true when the new part (so far) is
                         # strictly less than (as opposed to less than
                         # or equal) to the old.
        for j in range(self.f[self.lpart], self.f[self.lpart + 1]):
            self.pstack[k].u = self.pstack[j].u - self.pstack[j].v
            if self.pstack[k].u == 0:
                changed = True
            else:
                self.pstack[k].c = self.pstack[j].c
                if changed:  # Put all available multiplicity in this part
                    self.pstack[k].v = self.pstack[k].u
                else:  # Still maintaining ordering constraint
                    if self.pstack[k].u < self.pstack[j].v:
                        self.pstack[k].v = self.pstack[k].u
                        changed = True
                    else:
                        self.pstack[k].v = self.pstack[j].v
                k = k + 1
        if k > base:
            # Adjust for the new part on stack
            self.lpart = self.lpart + 1
            self.f[self.lpart + 1] = k
            return True
        return False
    */

    top_part() {
        /* Return current top part on the stack, as a slice of pstack.

        */

        return this.pstack.slice(this.f[this.lpart], this.f[this.lpart + 1]);
    }

    // Same interface and functionality as multiset_partitions_taocp(),
    // but some might find this refactored version easier to follow.
    * enum_all(multiplicities: any[]) {
        /* Enumerate the partitions of a multiset.

        Examples
        ========

        >>> from sympy.utilities.enumerative import list_visitor
        >>> from sympy.utilities.enumerative import MultisetPartitionTraverser
        >>> m = MultisetPartitionTraverser()
        >>> states = m.enum_all([2,2])
        >>> list(list_visitor(state, 'ab') for state in states)
        [[['a', 'a', 'b', 'b']],
        [['a', 'a', 'b'], ['b']],
        [['a', 'a'], ['b', 'b']],
        [['a', 'a'], ['b'], ['b']],
        [['a', 'b', 'b'], ['a']],
        [['a', 'b'], ['a', 'b']],
        [['a', 'b'], ['a'], ['b']],
        [['a'], ['a'], ['b', 'b']],
        [['a'], ['a'], ['b'], ['b']]]

        See Also
        ========

        multiset_partitions_taocp():
            which provides the same result as this method, but is
            about twice as fast.  Hence, enum_all is primarily useful
            for testing.  Also see the function for a discussion of
            states and visitors.

        */

        this._initialize_enumeration(multiplicities);
        while (true) {
            while (this.spread_part_multiplicity()) {
            }

            // M4 visit a partition
            const state = [this.f, this.lpart, this.pstack];
            yield state;

            // M5 (decrease v)
            while (!this.decrement_part(this.top_part())) {
                // M6 (backtrack)
                if (this.lpart === 0) {
                    return;
                }
                this.lpart--;
            }
        }
    }

    * enum_small(multiplicies: any[], ub: any) {
        /* Enumerate multiset partitions with no more than ``ub`` parts.

        Equivalent to enum_range(multiplicities, 0, ub)

        Parameters
        ==========

        multiplicities
             list of multiplicities of the components of the multiset.

        ub
            Maximum number of parts

        Examples
        ========

        >>> from sympy.utilities.enumerative import list_visitor
        >>> from sympy.utilities.enumerative import MultisetPartitionTraverser
        >>> m = MultisetPartitionTraverser()
        >>> states = m.enum_small([2,2], 2)
        >>> list(list_visitor(state, 'ab') for state in states)
        [[['a', 'a', 'b', 'b']],
        [['a', 'a', 'b'], ['b']],
        [['a', 'a'], ['b', 'b']],
        [['a', 'b', 'b'], ['a']],
        [['a', 'b'], ['a', 'b']]]

        The implementation is based, in part, on the answer given to
        exercise 69, in Knuth [AOCP]_.

        See Also
        ========

        enum_all, enum_large, enum_range

        */

        // Keep track of iterations which do not yield a partition.
        // Clearly, we would like to keep this number small.
        this.discarded = 0;
        if (ub <= 0) {
            return;
        }
        this._initialize_enumeration(multiplicies);
        while (true) {
            while (this.spread_part_multiplicity()) {
                this.db_trace("spread 1");
                if (this.lpart >= ub) {
                    this.discarded++;
                    this.db_trace(" discarding");
                    this.lpart = ub - 2;
                    break;
                }
            } if (!this.spread_part_multiplicity()) {
                // M4 visit a partition
                const state = [this.f, this.lpart, this.pstack];
                yield state;
            }
            // M5 (decrease v)
            const top = this.top_part();
            const opaisj = ub;
            while (!(this.decrement_part_small(this.top_part(), ub))) {
                this.db_trace("Failed decrement, going to backtrack");
                // m6 (backtrack)
                if (this.lpart === 0) {
                    return;
                }
                this.lpart--;
                this.db_trace("Backtracked to");
            }
            this.db_trace("decrement ok, about to expand");
        }
    }

    * enum_large(multiplicities: any[], lb: any) {
        /* Enumerate the partitions of a multiset with lb < num(parts)

        Equivalent to enum_range(multiplicities, lb, sum(multiplicities))

        Parameters
        ==========

        multiplicities
            list of multiplicities of the components of the multiset.

        lb
            Number of parts in the partition must be greater than
            this lower bound.


        Examples
        ========

        >>> from sympy.utilities.enumerative import list_visitor
        >>> from sympy.utilities.enumerative import MultisetPartitionTraverser
        >>> m = MultisetPartitionTraverser()
        >>> states = m.enum_large([2,2], 2)
        >>> list(list_visitor(state, 'ab') for state in states)
        [[['a', 'a'], ['b'], ['b']],
        [['a', 'b'], ['a'], ['b']],
        [['a'], ['a'], ['b', 'b']],
        [['a'], ['a'], ['b'], ['b']]]

        See Also
        ========

        enum_all, enum_small, enum_range

        */
        this.discarded = 0;
        let sum: number = 0;
        multiplicities.forEach((e: any) => sum += e);
        if (lb >= sum) {
            return;
        }
        this._initialize_enumeration(multiplicities);
        this.decrement_part_large(this.top_part(), 0, lb);
        while (true) {
            let good_partition = true;
            while (this.spread_part_multiplicity()) {
                if (!this.decrement_part_large(this.top_part(), 0, lb)) {
                    this.discarded++;
                    good_partition = false;
                    break;
                }
            }
            // M4 Visit a partition
            if (good_partition) {
                const state = [this.f, this.lpart, this.pstack];
                yield state;
            }
            // M5 (Decrease v)
            while (!this.decrement_part_large(this.top_part(), 1, lb)) {
                // M6 (Backtrack)
                if (this.lpart === 0) {
                    return;
                }
                this.lpart--;
            }
        }
    }

    * enum_range(multiplicities: any[], lb: any, ub: any) {
        /* Enumerate the partitions of a multiset with
        ``lb < num(parts) <= ub``.

        In particular, if partitions with exactly ``k`` parts are
        desired, call with ``(multiplicities, k - 1, k)``.  This
        method generalizes enum_all, enum_small, and enum_large.

        Examples
        ========

        >>> from sympy.utilities.enumerative import list_visitor
        >>> from sympy.utilities.enumerative import MultisetPartitionTraverser
        >>> m = MultisetPartitionTraverser()
        >>> states = m.enum_range([2,2], 1, 2)
        >>> list(list_visitor(state, 'ab') for state in states)
        [[['a', 'a', 'b'], ['b']],
        [['a', 'a'], ['b', 'b']],
        [['a', 'b', 'b'], ['a']],
        [['a', 'b'], ['a', 'b']]]

        */

        this.discarded = 0;
        let sum: number = 0;
        multiplicities.forEach((e: any) => sum += e);
        if (ub <= 0 || lb >= sum) {
            return;
        }
        this._initialize_enumeration(multiplicities);
        this.decrement_part_large(this.top_part(), 0, lb);
        while (true) {
            let good_partition = true;
            while (this.spread_part_multiplicity()) {
                this.db_trace("spread 1");
                if (!(this.decrement_part_large(this.top_part(), 0, lb))) {
                    // failure here - possibly in range case?
                    this.db_trace(" discarding (large cons)");
                    this.discarded++;
                    good_partition = false;
                    break;
                } else if (this.lpart >= ub) {
                    this.discarded++;
                    good_partition = false;
                    this.db_trace(" discarding small cons");
                    this.lpart = ub - 2;
                    break;
                }
            }
            // M4 visit a partition
            if (good_partition) {
                const state = [this.f, this.lpart, this.pstack];
                yield state;
            }
            // M5 (decrease v)
            while (!this.decrement_part_range(this.top_part(), lb, ub)) {
                this.db_trace("Failed decrement, going to backtrack");
                // M6 (backtrack)
                if (this.lpart === 0) {
                    return;
                }
                this.lpart--;
                this.db_trace("Backtracked to");
            }
            this.db_trace("decrement ok, about to expand");
        }
    }

    count_partitions_slow(multiplicies: any[]) {
        /* Returns the number of partitions of a multiset whose elements
        have the multiplicities given in ``multiplicities``.

        Primarily for comparison purposes.  It follows the same path as
        enumerate, and counts, rather than generates, the partitions.

        See Also
        ========

        count_partitions
            Has the same calling interface, but is much faster.

        */
        this.pcount = 0;
        this._initialize_enumeration(multiplicies);
        while (true) {
            while (this.spread_part_multiplicity()) {

            }

            // M4 Visit (count) a partition
            this.pcount += 1;

            // M5 (decrease v)
            while (!this.decrement_part(this.top_part())) {
                // M6 (backtrack)
                if (this.lpart === 0) {
                    return this.pcount;
                }
                this.lpart--;
            }
        }
    }

    count_partitions(multiplicities: any[]) {
        /* Returns the number of partitions of a multiset whose components
        have the multiplicities given in ``multiplicities``.

        For larger counts, this method is much faster than calling one
        of the enumerators and counting the result.  Uses dynamic
        programming to cut down on the number of nodes actually
        explored.  The dictionary used in order to accelerate the
        counting process is stored in the ``MultisetPartitionTraverser``
        object and persists across calls.  If the user does not
        expect to call ``count_partitions`` for any additional
        multisets, the object should be cleared to save memory.  On
        the other hand, the cache built up from one count run can
        significantly speed up subsequent calls to ``count_partitions``,
        so it may be advantageous not to clear the object.

        Examples
        ========

        >>> from sympy.utilities.enumerative import MultisetPartitionTraverser
        >>> m = MultisetPartitionTraverser()
        >>> m.count_partitions([9,8,2])
        288716
        >>> m.count_partitions([2,2])
        9
        >>> del m

        Notes
        =====

        If one looks at the workings of Knuth's algorithm M [AOCP]_, it
        can be viewed as a traversal of a binary tree of parts.  A
        part has (up to) two children, the left child resulting from
        the spread operation, and the right child from the decrement
        operation.  The ordinary enumeration of multiset partitions is
        an in-order traversal of this tree, and with the partitions
        corresponding to paths from the root to the leaves. The
        mapping from paths to partitions is a little complicated,
        since the partition would contain only those parts which are
        leaves or the parents of a spread link, not those which are
        parents of a decrement link.

        For counting purposes, it is sufficient to count leaves, and
        this can be done with a recursive in-order traversal.  The
        number of leaves of a subtree rooted at a particular part is a
        function only of that part itself, so memoizing has the
        potential to speed up the counting dramatically.

        This method follows a computational approach which is similar
        to the hypothetical memoized recursive function, but with two
        differences:

        1) This method is iterative, borrowing its structure from the
           other enumerations and maintaining an explicit stack of
           parts which are in the process of being counted.  (There
           may be multisets which can be counted reasonably quickly by
           this implementation, but which would overflow the default
           Python recursion limit with a recursive implementation.)

        2) Instead of using the part data structure directly, a more
           compact key is constructed.  This saves space, but more
           importantly coalesces some parts which would remain
           separate with physical keys.

        Unlike the enumeration functions, there is currently no _range
        version of count_partitions.  If someone wants to stretch
        their brain, it should be possible to construct one by
        memoizing with a histogram of counts rather than a single
        count, and combining the histograms.
        */
        // number of partitions so far in the enumeration
        this.pcount = 0;

        // dp_stack is list of lists of (part_key, start_count) pairs
        this.dp_stack = [];

        this._initialize_enumeration(multiplicities);
        let pkey = part_key(this.top_part());
        this.dp_stack.push([[pkey, 9]]);
        while (true) {
            while (this.spread_part_multiplicity()) {
                pkey = part_key(this.top_part());
                if (this.dp_map.has(pkey)) {
                    // Already have a cached value for the count of the
                    // subtree rooted at this part.  Add it to the
                    // running counter, and break out of the spread
                    // loop.  The -1 below is to compensate for the
                    // leaf that this code path would otherwise find,
                    // and which gets incremented for below.

                    this.pcount += (this.dp_map.get(pkey) -1);
                    this.lpart--;
                    break;
                } else {
                    this.dp_stack.append([[pkey, this.pcount]]);
                }
            }
            // M4 count a leaf partition
            this.pcount++;

            // M5 (decrease v)
            while (!this.decrement_part(this.top_part())) {
                // M6 (backtrack)
                for (const item of this.dp_stack.pop()) {
                    const key = item[0];
                    const oldcount = item[1];
                    this.dp_map.set(key, this.pcount - oldcount);
                }
                if (this.lpart === 0) {
                    return this.pcount;
                }
                this.lpart--;
            }
            // At this point have successfully decremented the part on
            // the stack and it does not appear in the cache.  It needs
            // to be added to the list at the top of dp_stack
            pkey = part_key(this.top_part());
            this.dp_stack[this.dp_stack.length - 1].push([pkey, this.pcount]);
        }
    }
}

function part_key(part: any) {
    /* Helper for MultisetPartitionTraverser.count_partitions that
    creates a key for ``part``, that only includes information which can
    affect the count for that part.  (Any irrelevant information just
    reduces the effectiveness of dynamic programming.)

    Notes
    =====

    This member function is a candidate for future exploration. There
    are likely symmetries that can be exploited to coalesce some
    ``part_key`` values, and thereby save space and improve
    performance.

    */

    // The component number is irrelevant for counting partitions, so
    // leave it out of the memo key.
    const rval: any[] = [];
    for (const ps of part) {
        rval.push(ps.u);
        rval.push(ps.v);
    }
    return rval;
}

export {multiset_partitions_taocp, list_visitor, MultisetPartitionTraverser};
