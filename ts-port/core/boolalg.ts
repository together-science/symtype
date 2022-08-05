/*
Notable changes made (and notes):
- Barebones implementation - only enough as needed for symbol
*/

import {_Basic} from "./basic.js";
import {BooleanKind} from "./kind.js";
import {base, mix} from "./utility.js";
import {ManagedProperties} from "./assumptions.js";

const Boolean = (superclass: any) => class Boolean extends mix(base).with(_Basic) {
    __slots__: any[] = [];

    static kind = BooleanKind;

    // !!!  methods not yet implemented
};

ManagedProperties.register(Boolean(Object));

export {Boolean};

/*

@sympify_method_args
class Boolean(Basic):
    """A Boolean object is an object for which logic operations make sense."""

    __slots__ = ()

    kind = BooleanKind

    @sympify_return([('other', 'Boolean')], NotImplemented)
    def __and__(self, other):
        return And(self, other)

    __rand__ = __and__

    @sympify_return([('other', 'Boolean')], NotImplemented)
    def __or__(self, other):
        return Or(self, other)

    __ror__ = __or__

    def __invert__(self):
        """Overloading for ~"""
        return Not(self)

    @sympify_return([('other', 'Boolean')], NotImplemented)
    def __rshift__(self, other):
        return Implies(self, other)

    @sympify_return([('other', 'Boolean')], NotImplemented)
    def __lshift__(self, other):
        return Implies(other, self)

    __rrshift__ = __lshift__
    __rlshift__ = __rshift__

    @sympify_return([('other', 'Boolean')], NotImplemented)
    def __xor__(self, other):
        return Xor(self, other)

    __rxor__ = __xor__

    def equals(self, other):
        """
        Returns ``True`` if the given formulas have the same truth table.
        For two formulas to be equal they must have the same literals.

        Examples
        ========

        >>> from sympy.abc import A, B, C
        >>> from sympy import And, Or, Not
        >>> (A >> B).equals(~B >> ~A)
        True
        >>> Not(And(A, B, C)).equals(And(Not(A), Not(B), Not(C)))
        False
        >>> Not(And(A, Not(A))).equals(Or(B, Not(B)))
        False

        """
        from sympy.logic.inference import satisfiable
        from sympy.core.relational import Relational

        if self.has(Relational) or other.has(Relational):
            raise NotImplementedError('handling of relationals')
        return self.atoms() == other.atoms() and \
            not satisfiable(Not(Equivalent(self, other)))

    def to_nnf(self, simplify=True):
        # override where necessary
        return self

    def as_set(self):
        """
        Rewrites Boolean expression in terms of real sets.

        Examples
        ========

        >>> from sympy import Symbol, Eq, Or, And
        >>> x = Symbol('x', real=True)
        >>> Eq(x, 0).as_set()
        {0}
        >>> (x > 0).as_set()
        Interval.open(0, oo)
        >>> And(-2 < x, x < 2).as_set()
        Interval.open(-2, 2)
        >>> Or(x < -2, 2 < x).as_set()
        Union(Interval.open(-oo, -2), Interval.open(2, oo))

        """
        from sympy.calculus.util import periodicity
        from sympy.core.relational import Relational

        free = self.free_symbols
        if len(free) == 1:
            x = free.pop()
            if x.kind is NumberKind:
                reps = {}
                for r in self.atoms(Relational):
                    if periodicity(r, x) not in (0, None):
                        s = r._eval_as_set()
                        if s in (S.EmptySet, S.UniversalSet, S.Reals):
                            reps[r] = s.as_relational(x)
                            continue
                        raise NotImplementedError(filldedent('''
                            as_set is not implemented for relationals
                            with periodic solutions
                            '''))
                new = self.subs(reps)
                if new.func != self.func:
                    return new.as_set()  # restart with new obj
                else:
                    return new._eval_as_set()

            return self._eval_as_set()
        else:
            raise NotImplementedError("Sorry, as_set has not yet been"
                                      " implemented for multivariate"
                                      " expressions")

    @property
    def binary_symbols(self):
        from sympy.core.relational import Eq, Ne
        return set().union(*[i.binary_symbols for i in self.args
                           if i.is_Boolean or i.is_Symbol
                           or isinstance(i, (Eq, Ne))])

    def _eval_refine(self, assumptions):
        from sympy.assumptions import ask
        ret = ask(self, assumptions)
        if ret is True:
            return true
        elif ret is False:
            return false
        return None

*/
