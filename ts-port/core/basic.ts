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
import { Dummy } from "./symbol";
import { Global } from "./global";
import { S } from "./singleton";


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
    static clsname = "Basic"

    // To be overridden with True in the appropriate subclasses
    static is_number = false;
    static is_Atom = false;
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
    static is_Vector = false;
    static is_Point = false;
    static is_MatAdd = false;
    static is_MatMul = false;
    static is_negative: boolean | undefined;
    static is_commutative: boolean | undefined;

    static kind = UndefinedKind;

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

    isinstance(cls: any) {
        if (this instanceof cls) {
            return true;
        }
        const supers: Set<string> = (this.constructor as any).supers;
        if (supers) {
            if (cls.clsname) {
                return [...supers].some((e: any) => e.includes(cls.clsname)) || (this.constructor as any).clsname === cls.clsname;
            }
            return [...supers].some((e: any) => e.includes(cls.name)) || (this.constructor as any).clsname === cls.name;
        }
        return false;
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
        // compare class names
        const n1 = self.constructor.name;
        const n2 = other.constructor.name;
        let c = (n1 > n2 as unknown as number) - (n1 < n2 as unknown as number)
        if (c !== 0) {
            return c
        }
        // compare length of hashable content arrays
        const st = self._hashable_content();
        const ot = other._hashable_content();
        c = (st.length > ot.length as unknown as number) - (st.length < ot.length as unknown as number);
        if (c !== 0) {
            return c;
        }
        // otherwise, go arg by arg and compare
        for (const elem of Util.zip(st, ot)) {
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
        if ((!(this.is_Number()) && other.is_Number()) && this.constructor.name !== other.constructor.name) {
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

    subs(kwargs: Record<any, any> = {}, ...args: any[]) {
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

        if (kwargs["simultaneous"]) {
            console.log("???")
            const reps: Record<any, any> = {};
            let rv = this;
            kwargs["hack2"] = true;
            const m = Global.construct("Dummy", "subs_m");
            for (const item of sequence) {
                const old = item[0];
                const _new = item[1];
                let com = _new.is_commutative();
                if (typeof com === "undefined") {
                    com = true;
                }
                const d = Global.construct("Dummy", "subs_d", undefined, {"commutative" : com});
                rv = rv._subs(kwargs, old, d.__mul__(m));
                if (!(rv.isinstance)) { // shows that its a basic
                    break;
                }
                reps[d] = _new;
            }
            reps[m] = S.One;
            return rv.xreplace(reps)

        } else {
            let rv = this;
            for (const item of sequence) {
                const old = item[0];
                const _new = item[1];
                rv = rv._subs(kwargs, old, _new);
                if (!(rv.isinstance)) {
                    break;
                }
            }
            return rv;
        }
    }

    _subs(kwargs: Record<any, any> = {} , old: any, _new: any) {
        function fallback(cls: any, old: any, _new: any) {
            let hit = false;
            const args = cls._args;
            for (let i = 0; i < args.length; i++) {
                let arg = args[i];
                if (!(arg._eval_subs)) {
                    continue;
                }
                arg = arg._subs(kwargs, old, _new);
                if (!(cls._aresame(arg, args[i]))) {
                    hit = true;
                    args[i] = arg;
                }
            }
            if (hit) {
                let rv;
                if (cls.constructor.name.includes("Mul") || cls.constructor.name.includes("Add")) {
                    rv = new cls.constructor(true, true, ...args);
                } else if (cls.constructor.name.includes("Pow")) {
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

    free_symbols() {
        /*
        Return from the atoms of self those which are free symbols.

        Not all free symbols are ``Symbol``. Eg: IndexedBase('I')[0].free_symbols

        For most expressions, all symbols are free symbols. For some classes
        this is not true. e.g. Integrals use Symbols for the dummy variables
        which are bound variables, so Integral has a method to return all
        symbols except those. Derivative keeps track of symbols with respect
        to which it will perform a derivative; those are
        bound variables, too, so it has its own free_symbols method.

        Any other method that uses bound variables should implement a
        free_symbols method.
        */
        const res = new HashSet();
        for (const a of this._args) {
            res.merge(a.free_symbols());
        }
        return res;
    }

    
    // important change: changing parameter structure significantly
    // intsead of having an args parameter, I'm adding pattern and rule as positional
    // arguments (since those are the intended inputs according to sympy)

    // im also making hints an optional dictionary since this replicates their 
    // keyword parameter functionality

    // NOTE: PATTERN NOT YET SUPPORTED (only the bare minimum for linear solve)
    rewrite(rule: any = undefined, pattern: any = undefined, deep: boolean = true, hints: Record<any, any> = {}) {
        /*
        Rewrite *self* using a defined rule.

        Rewriting transforms an expression to another, which is mathematically
        equivalent but structurally different. For example you can rewrite
        trigonometric functions as complex exponentials or combinatorial
        functions as gamma function.

        This method takes a *pattern* and a *rule* as positional arguments.
        *pattern* is optional parameter which defines the types of expressions
        that will be transformed. If it is not passed, all possible expressions
        will be rewritten. *rule* defines how the expression will be rewritten.

        Parameters
        ==========

        args : *rule*, or *pattern* and *rule*.
            - *pattern* is a type or an iterable of types.
            - *rule* can be any object.

        deep : bool, optional.
            If ``True``, subexpressions are recursively transformed. Default is
            ``True``.

        Examples
        ========

        If *pattern* is unspecified, all possible expressions are transformed.

        >>> from sympy import cos, sin, exp, I
        >>> from sympy.abc import x
        >>> expr = cos(x) + I*sin(x)
        >>> expr.rewrite(exp)
        exp(I*x)

        Pattern can be a type or an iterable of types.

        >>> expr.rewrite(sin, exp)
        exp(I*x)/2 + cos(x) - exp(-I*x)/2
        >>> expr.rewrite([cos,], exp)
        exp(I*x)/2 + I*sin(x) + exp(-I*x)/2
        >>> expr.rewrite([cos, sin], exp)
        exp(I*x)

        Rewriting behavior can be implemented by defining ``_eval_rewrite()``
        method.

        >>> from sympy import Expr, sqrt, pi
        >>> class MySin(Expr):
        ...     def _eval_rewrite(self, rule, args, **hints):
        ...         x, = args
        ...         if rule == cos:
        ...             return cos(pi/2 - x, evaluate=False)
        ...         if rule == sqrt:
        ...             return sqrt(1 - cos(x)**2)
        >>> MySin(MySin(x)).rewrite(cos)
        cos(-cos(-x + pi/2) + pi/2)
        >>> MySin(x).rewrite(sqrt)
        sqrt(1 - cos(x)**2)

        Defining ``_eval_rewrite_as_[...]()`` method is supported for backwards
        compatibility reason. This may be removed in the future and using it is
        discouraged.

        >>> class MySin(Expr):
        ...     def _eval_rewrite_as_cos(self, *args, **hints):
        ...         x, = args
        ...         return cos(pi/2 - x, evaluate=False)
        >>> MySin(x).rewrite(cos)
        cos(-x + pi/2)
        */

        if (!rule && !pattern) {
            return this;
        }

        hints = new HashDict(hints);
        hints.add("deep", deep); // can either set the value or add it

        let method;
        if (typeof rule === "string") {
            method = "_eval_rewrite_as_" + rule;
        } else if (rule.name) {
            method = "_eval_rewrite_as_" + rule.name.replace("_", "");
        } else if (rule.clsname) { // adding this to account for clsname prop
            method = "_eval_rewrite_as_" + rule.clsname;
        } else { // rule is an instance
            const cls = rule.constructor.name.replace("_", "");;
            method = "_eval_rewrite_as_" + cls;
        }

        if (pattern) {
            throw new Error("pattern functionality for rewrite not implemented")
        }

        return this._rewrite(pattern, rule, method, hints)
    }

    _rewrite(pattern: any, rule: any, method: string, hints: any) {
        const deep = hints.get("deep");
        let args = [];
        if (deep) {
            for (const a of this._args) {
                args.push(a._rewrite(pattern, rule, method, hints));
            }
        } else {
            args = this._args;
        }
        if (!pattern || pattern.any((p: any) => this.isinstance(p))) {
            const meth = this[method];
            let rewritten;
            if (typeof meth !== "undefined") {
                rewritten = meth(hints, ...args);
            } else {
                rewritten = this._eval_rewrite(rule, args, hints)
            }
            if (typeof rewritten !== "undefined") {
                return rewritten;
            }
        }
        if (args.length === 0) {
            return this;
        }
        return this.func(...args);
    }

    // this is not yet implemented in subclasses, but it should be to support
    // full rewrite functionality
    _eval_rewrite(rule: any, args: any[], hints: any): any {
        return undefined;
    }

    // reworking func system to account for the weird parameter structure
    // of Add and Mul, which makes it so that they need their own func methods
    func(...args: any[]) {
        return new (this.constructor as any)(...args);
    }

    xreplace(rule: Record<any, any>) {
        /*
        Replace occurrences of objects within the expression.

        Parameters
        ==========

        rule : dict-like
            Expresses a replacement rule

        Returns
        =======

        xreplace : the result of the replacement

        Examples
        ========

        >>> from sympy import symbols, pi, exp
        >>> x, y, z = symbols('x y z')
        >>> (1 + x*y).xreplace({x: pi})
        pi*y + 1
        >>> (1 + x*y).xreplace({x: pi, y: 2})
        1 + 2*pi

        Replacements occur only if an entire node in the expression tree is
        matched:

        >>> (x*y + z).xreplace({x*y: pi})
        z + pi
        >>> (x*y*z).xreplace({x*y: pi})
        x*y*z
        >>> (2*x).xreplace({2*x: y, x: z})
        y
        >>> (2*2*x).xreplace({2*x: y, x: z})
        4*z
        >>> (x + y + 2).xreplace({x + y: 2})
        x + y + 2
        >>> (x + 2 + exp(x + 2)).xreplace({x + 2: y})
        x + exp(y) + 2

        xreplace does not differentiate between free and bound symbols. In the
        following, subs(x, y) would not change x since it is a bound symbol,
        but xreplace does:

        >>> from sympy import Integral
        >>> Integral(x, (x, 1, 2*x)).xreplace({x: y})
        Integral(y, (y, 1, 2*y))

        Trying to replace x with an expression raises an error:

        >>> Integral(x, (x, 1, 2*x)).xreplace({x: 2*y}) # doctest: +SKIP
        ValueError: Invalid limits given: ((2*y, 1, 4*y),)

        See Also
        ========
        replace: replacement capable of doing wildcard-like matching,
                 parsing of match, and conditional replacements
        subs: substitution of subexpressions as defined by the objects
              themselves.

        */
        const [val, _] = this._xreplace(rule);
        return val;
    }

    _xreplace(rule: Record<any, any>) {
        if (!(rule instanceof HashDict)) {
            rule = new HashDict(rule)
        }
        if (rule.has(this)) {
            return [rule.get(this), true];
        } else if (rule.size > 0) {
            const args = [];
            let changed: number = 0;
            for (const a of this._args) {
                if (typeof a["_xreplace"] !== "undefined") {
                    const a_xr = a["_xreplace"](rule);
                    args.push(a_xr[0]);
                    changed |= Number(a_xr[1]);
                } else {
                    args.push(a);
                }
            }
            if (changed === 1) {
                return [this.func(...args), true];
            }
        }
        return [this, false];
    }

    atoms(...types: any[]) {
        /*
        Returns the atoms that form the current object.

        By default, only objects that are truly atomic and cannot
        be divided into smaller pieces are returned: symbols, numbers,
        and number symbols like I and pi. It is possible to request
        atoms of any type, however, as demonstrated below.

        Examples
        ========

        >>> from sympy import I, pi, sin
        >>> from sympy.abc import x, y
        >>> (1 + x + 2*sin(y + I*pi)).atoms()
        {1, 2, I, pi, x, y}

        If one or more types are given, the results will contain only
        those types of atoms.

        >>> from sympy import Number, NumberSymbol, Symbol
        >>> (1 + x + 2*sin(y + I*pi)).atoms(Symbol)
        {x, y}

        >>> (1 + x + 2*sin(y + I*pi)).atoms(Number)
        {1, 2}

        >>> (1 + x + 2*sin(y + I*pi)).atoms(Number, NumberSymbol)
        {1, 2, pi}

        >>> (1 + x + 2*sin(y + I*pi)).atoms(Number, NumberSymbol, I)
        {1, 2, I, pi}

        Note that I (imaginary unit) and zoo (complex infinity) are special
        types of number symbols and are not part of the NumberSymbol class.

        The type can be given implicitly, too:

        >>> (1 + x + 2*sin(y + I*pi)).atoms(x) # x is a Symbol
        {x, y}

        Be careful to check your assumptions when using the implicit option
        since ``S(1).is_Integer = True`` but ``type(S(1))`` is ``One``, a special type
        of SymPy atom, while ``type(S(2))`` is type ``Integer`` and will find all
        integers in an expression:

        >>> from sympy import S
        >>> (1 + x + 2*sin(y + I*pi)).atoms(S(1))
        {1}

        >>> (1 + x + 2*sin(y + I*pi)).atoms(S(2))
        {1, 2}

        Finally, arguments to atoms() can select more than atomic atoms: any
        SymPy type (loaded in core/__init__.py) can be listed as an argument
        and those types of "atoms" as found in scanning the arguments of the
        expression recursively:

        >>> from sympy import Function, Mul
        >>> from sympy.core.function import AppliedUndef
        >>> f = Function('f')
        >>> (1 + f(x) + 2*sin(y + I*pi)).atoms(Function)
        {f(x), sin(y + I*pi)}
        >>> (1 + f(x) + 2*sin(y + I*pi)).atoms(AppliedUndef)
        {f(x)}

        >>> (1 + x + 2*sin(y + I*pi)).atoms(Mul)
        {I*pi, 2*sin(y + I*pi)}

        """
        */
        const nodes = new preorder_traversal(this).asIter();
        let res = [];
        if (types) {
            res = nodes.filter((node: any) => types.some((type: any) => node instanceof type));
        } else {
            res = nodes.filter((node: any) => !node._args);
        }
        return new Set(res);
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
