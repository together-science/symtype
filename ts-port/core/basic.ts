import {ManagedProperties} from "./assumptions.js";
import {Util, HashDict, mix} from "./utility.js";
import {UndefinedKind} from "./kind.js";

const Basic = (superclass: any) => class Basic extends superclass {
    /*
    Base class for all SymPy objects.
    Notes and conventions
    =====================
    1) Always use ``.args``, when accessing parameters of some instance:
    >>> from sympy import cot
    >>> from sympy.abc import x, y
    >>> cot(x).args
    (x,)
    >>> cot(x).args[0]
    x
    >>> (x*y).args
    (x, y)
    >>> (x*y).args[1]
    y
    2) Never use internal methods or variables (the ones prefixed with ``_``):
    >>> cot(x)._args    # do not use this, use cot(x).args instead
    (x,)
    3)  By "SymPy object" we mean something that can be returned by
        ``sympify``.  But not all objects one encounters using SymPy are
        subclasses of Basic.  For example, mutable objects are not:
        >>> from sympy import Basic, Matrix, sympify
        >>> A = Matrix([[1, 2], [3, 4]]).as_mutable()
        >>> isinstance(A, Basic)
        False
        >>> B = sympify(A)
        >>> isinstance(B, Basic)
        True
    */

    __slots__ = ["_mhash", "_args", "_assumptions"];

    _args: [Basic, any];
    _mhash: Number | undefined;
    _assumptions;

    // To be overridden with True in the appropriate subclasses
    is_number = false;
    is_Atom = false;
    is_Symbol = false;
    is_symbol = false;
    is_Indexed = false;
    is_Dummy = false;
    is_Wild = false;
    is_Function = false;
    is_Add = false;
    is_Mul = false;
    is_Pow = false;
    is_Number = false;
    is_Float = false;
    is_Rational = false;
    is_Integer = false;
    is_NumberSymbol = false;
    is_Order = false;
    is_Derivative = false;
    is_Piecewise = false;
    is_Poly = false;
    is_AlgebraicNumber = false;
    is_Relational = false;
    is_Equality = false;
    is_Boolean = false;
    is_Not = false;
    is_Matrix = false;
    is_Vector = false;
    is_Point = false;
    is_MatAdd = false;
    is_MatMul = false;
    is_negative: boolean | undefined;
    is_commutative: boolean | undefined;

    kind = UndefinedKind;


    constructor(...args: any) {
        super();
        const cls: any = this.constructor;
        this._assumptions = cls.default_assumptions;
        this._mhash = undefined;
        this._args = args;
    }


    __getnewargs__() {
        return this._args;
    }

    __getstate__(): any {
        return undefined;
    }

    hash() {
        if (typeof this._mhash === "undefined") {
            return this.constructor.name + this._hashable_content();
        }
        return this._mhash;
    }

    assumptions0() {
        /*
        Return object `type` assumptions.
        For example:
          Symbol('x', real=True)
          Symbol('x', integer=True)
        are different objects. In other words, besides Python type (Symbol in
        this case), the initial assumptions are also forming their typeinfo.
        Examples
        ========
        >>> from sympy import Symbol
        >>> from sympy.abc import x
        >>> x.assumptions0
        {'commutative': True}
        >>> x = Symbol("x", positive=True)
        >>> x.assumptions0
        {'commutative': True, 'complex': True, 'extended_negative': False,
         'extended_nonnegative': True, 'extended_nonpositive': False,
         'extended_nonzero': True, 'extended_positive': True, 'extended_real':
         True, 'finite': True, 'hermitian': True, 'imaginary': False,
         'infinite': False, 'negative': False, 'nonnegative': True,
         'nonpositive': False, 'nonzero': True, 'positive': True, 'real':
         True, 'zero': False}
        */
        return {};
    }

    _hashable_content() {
        /* Return a tuple of information about self that can be used to
        compute the hash. If a class defines additional attributes,
        like ``name`` in Symbol, then this method should be updated
        accordingly to return such relevant attributes.
        Defining more than _hashable_content is necessary if __eq__ has
        been defined by a class. See note about this in Basic.__eq__.*/

        return this._args;
    }

    cmp(other: any): any {
        /*
        Return -1, 0, 1 if the object is smaller, equal, or greater than other.
        Not in the mathematical sense. If the object is of a different type
        from the "other" then their classes are ordered according to
        the sorted_classes list.
        Examples
        ========
        >>> from sympy.abc import x, y
        >>> x.compare(y)
        -1
        >>> x.compare(x)
        0
        >>> y.compare(x)
        1
        */
        if (this === other) {
            return 0;
        }
        const n1 = this.constructor.name;
        const n2 = other.constructor.name;
        if (n1 && n2) {
            return (n1 > n2 as unknown as number) - (n1 < n2 as unknown as number);
        }

        const st = this._hashable_content();
        const ot = other._hashable_content();
        if (st && ot) {
            return (st.length > ot.length as unknown as number) - (st.length < ot.length as unknown as number);
        }
        for (const elem of Util.zip(st, ot)) {
            const l = elem[0];
            const r = elem[1];
            // !!! skipping frozenset stuff
            let c;
            if (l instanceof Basic) {
                c = l.cmp(r);
            } else {
                c = (l > r as unknown as number) - (l < r as unknown as number);
            }
            if (c) {
                return c;
            }
        }
        return 0;
    }
};

ManagedProperties.register(Basic);

const Atom = (superclass: any) => class Atom extends mix(superclass).with(Basic) {
    /*
    A parent class for atomic things. An atom is an expression with no subexpressions.
    Examples
    ========
    Symbol, Number, Rational, Integer, ...
    But not: Add, Mul, Pow, ...
    */

    is_Atom = true;

    __slots__: any[] = [];

    matches(expr: any, repl_dict: HashDict = undefined, old: any = false) {
        if (this === expr) {
            if (typeof repl_dict === "undefined") {
                return new HashDict();
            }
            return repl_dict.copy();
        }
    }

    xreplace(rule: any, hack2: any = false) {
        return rule.get(this);
    }

    doit(...hints: any) {
        return this;
    }
};

export {Basic, Atom};
