/*
Notable changes made (and notes):
- Basic reworked with constructor system
- Basic handles OBJECT properties, ManagedProperties handles CLASS properties
- Since _eval_is_properties are not static, Basic is now assigned to create the
  class property handler (and does so only once per object)
- Some properties of Basic (and subclasses) are now static
- Aside from setting object properties from _assume_defined, Basic now also
  sets the static properties of the class as properties for the object
*/

import {as_property, make_property, ManagedProperties, _assume_defined, StdFactKB} from "./assumptions";
import {Util, HashDict, mix, base, HashSet} from "./utility";
import {UndefinedKind} from "./kind";
import {preorder_traversal} from "./traversal";


const _Basic = (superclass: any) => class _Basic extends superclass {
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
    _args: any[];
    _mhash: Number | undefined;
    _assumptions: StdFactKB;

    // To be overridden with True in the appropriate subclasses
    static is_number = false;
    static is_Atom = false;
    static is_Basic = true;
    static is_Symbol = false;
    static is_symbol = false;
    static is_Indexed = false;
    static is_Dummy = false;
    static is_Wild = false;
    static is_Function = false;
    static is_Add = false;
    static is_Mul = false;
    static is_Pow = false;
    static is_Number = false;
    static is_Float = false;
    static is_Rational = false;
    static is_Integer = false;
    static is_NumberSymbol = false;
    static is_Order = false;
    static is_Derivative = false;
    static is_Piecewise = false;
    static is_Poly = false;
    static is_AlgebraicNumber = false;
    static is_Relational = false;
    static is_Equality = false;
    static is_Boolean = false;
    static is_Not = false;
    static is_Matrix = false;
    static is_Expr = false;
    static is_Vector = false;
    static is_Point = false;
    static is_MatAdd = false;
    static is_MatMul = false;
    static is_negative: boolean | undefined;
    static is_commutative: boolean | undefined;

    static kind = UndefinedKind;
    static all_unique_props: HashSet = new HashSet();

    constructor(...args: any) {
        super();
        const cls: any = this.constructor;
        this._assumptions = cls.default_assumptions.stdclone();
        this._mhash = undefined;
        this._args = args;
        this.assignProps();
    }

    assignProps() {
        const cls: any = this.constructor;
        // Create a dictionary to handle the current properties of the class
        // Only evuated once per class
        if (typeof cls._prop_handler === "undefined") {
            cls._prop_handler = new HashDict();
            for (const k of _assume_defined.toArray()) {
                const meth1 = "_eval_is_" + k;
                if (this[meth1]) {
                    cls._prop_handler.add(k, this[meth1]);
                }
            }
        }
        this._prop_handler = cls._prop_handler.copy();
        for (const fact of _assume_defined.toArray()) {
            make_property(this, fact);
        }
        // Add misc. static properties of class as object properties
        const otherProps = new HashSet(Object.getOwnPropertyNames(cls).filter(
            prop => prop.includes("is_") && !_assume_defined.has(prop.replace("is_", ""))));
        for (const miscprop of otherProps.toArray()) {
            this[miscprop] = () => cls[miscprop];
        }
    }

    __getnewargs__() {
        return this._args;
    }

    __getstate__(): any {
        return undefined;
    }

    hash() {
        if (typeof this._mhash === "undefined") {
            return this.constructor.name + this.hashKey();
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

    static cmp(self: any, other: any): any {
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
        if (self === other) {
            return 0;
        }
        const n1 = self.constructor.name;
        const n2 = other.constructor.name;
        let c = (n1 > n2 as unknown as number) - (n1 < n2 as unknown as number)
        if (c !== 0) {
            return c
        }

        const st = self._hashable_content();
        const ot = other._hashable_content();
        c = (st.length > ot.length as unknown as number) - (st.length < ot.length as unknown as number);
        if (c !== 0) {
            return c;
        }
        for (const elem of Util.zip([...st], [...ot])) {
            const l = elem[0];
            const r = elem[1];
            // !!! skipping frozenset stuff
            let c;
            if (l instanceof Basic) {
                c = Basic.cmp(l, r);
            } else {
                c = (l > r as unknown as number) - (l < r as unknown as number);
            }
            if (c) {
                return c;
            }
        }
        return 0;
    }

    _constructor_postprocessor_mapping: Record<any, any> = {};

    _exec_constructor_postprocessors(obj: any) {
        const clsname = this.constructor.name;
        const postprocessors = new HashDict();
        // !!! for loop not implemented - complicated to recreate
        for (const f of postprocessors.get(clsname, [])) {
            obj = f(obj);
        }
        return obj;
    }

    _eval_subs(old: any, _new: any): any {
        // don't need any other utilities until we do more complicated subs
        return undefined;
    }

    _aresame(a: any, b: any) {
        if (a.is_Number && b.is_Number) {
            return a === b && a.constructor.name === b.constructor.name;
        }
        // eslint-disable-next-line new-cap
        for (const item of Util.zip(new preorder_traversal(a).asIter(), new preorder_traversal(b).asIter())) {
            const i = item[0];
            const j = item[1];
            if (i !== j || typeof i !== typeof j) {
                return false;
            }
        }
        return true;
    }

    __eq__(other: any) {
        if (this === other) {
            return true;
        }
        if ((!(this.is_Number()) && other.is_Number()) && typeof this !== typeof other) {
            return false;
        }
        const [a, b]: any = [this._hashable_content(), other._hashable_content()];
        if (!Util.arrEq(a, b)) {
            return false;
        }
        for (const elem of Util.zip(a, b)) {
            const elem0 = elem[0];
            const elem1 = elem[1];
            if (!(elem0 instanceof Basic)) {
                continue;
            }
            if (elem0.is_Number() && typeof elem0 !== typeof elem1) {
                return false;
            }    
        }
        return true;
    }

    subs(...args: any) {
        let sequence;
        if (args.length === 1) {
            sequence = args[0];
            if (sequence instanceof HashSet) {
            } else if (sequence instanceof HashDict) {
                sequence = sequence.entries();
            } else if (Symbol.iterator in Object(sequence)) {
                // eslint-disable-next-line max-len
                throw new Error("When a single argument is passed to subs it should be a dictionary of old: new pairs or an iterable of (old, new) tuples");
            }
        } else if (args.length === 2) {
            sequence = [args];
        } else {
            throw new Error("sub accepts 1 or 2 args");
        }
        let rv = this;
        for (const item of sequence) {
            const old = item[0];
            const _new = item[1];
            rv = rv._subs(old, _new);
            if (!(rv instanceof Basic)) {
                break;
            }
        }
        return rv;
    }

    _subs(old: any, _new: any) {
        function fallback(cls: any, old: any, _new: any) {
            let hit = false;
            const args = cls._args;
            for (let i = 0; i < args.length; i++) {
                let arg = args[i];
                if (!(arg._eval_subs)) {
                    continue;
                }
                arg = arg._subs(old, _new);
                if (!(cls._aresame(arg, args[i]))) {
                    hit = true;
                    args[i] = arg;
                }
            }
            if (hit) {
                let rv;
                if (cls.constructor.name === "Mul" || cls.constructor.name === "Add") {
                    rv = new cls.constructor(true, true, ...args);
                } else if (cls.constructor.name === "Pow") {
                    rv = new cls.constructor(...args);
                }
                return rv;
            }
            return cls;
        }
        if (this._aresame(this, old)) {
            return _new;
        }

        let rv = this._eval_subs(old, _new);
        if (typeof rv === "undefined") {
            rv = fallback(this, old, _new);
        }
        return rv;
    }

    is_comparable() {
        if (this.is_extended_real() === false) {
            return false;
        }
        if (!this.is_number()) {
            return false;
        }
        let n = this;
        if (!n.is_Number()) {
            const n = this.eval_evalf(2);
        }
        if (!n.is_Number()) {
            return false;
        }
        return n.precision != 1
    }
};

// eslint-disable-next-line new-cap
const Basic = _Basic(Object);
ManagedProperties.register(Basic);

const Atom = (superclass: any) => class Atom extends mix(base).with(_Basic) {
    /*
    A parent class for atomic things. An atom is an expression with no subexpressions.
    Examples
    ========
    Symbol, Number, Rational, Integer, ...
    But not: Add, Mul, Pow, ...
    */

    static is_Atom = true;

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

// eslint-disable-next-line new-cap
const _AtomicExpr = Atom(Object);
ManagedProperties.register(_AtomicExpr);

export {_Basic, Basic, Atom, _AtomicExpr};
