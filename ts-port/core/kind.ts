/*
Notable changes made (and notes):
- Very barebones versions of classes implemented so far
- Same registry system as Singleton - using static dictionary
*/

/* eslint-disable new-cap */
class KindRegistry {
    static registry: Record<any, any> = {};

    static register(name: string, cls: any) {
        KindRegistry.registry[name] = new cls();
    }
}

class Kind { // !!! metaclass situation
    /*
    Base class for kinds.
    Kind of the object represents the mathematical classification that
    the entity falls into. It is expected that functions and classes
    recognize and filter the argument by its kind.
    Kind of every object must be carefully selected so that it shows the
    intention of design. Expressions may have different kind according
    to the kind of its arguements. For example, arguements of ``Add``
    must have common kind since addition is group operator, and the
    resulting ``Add()`` has the same kind.
    For the performance, each kind is as broad as possible and is not
    based on set theory. For example, ``NumberKind`` includes not only
    complex number but expression containing ``S.Infinity`` or ``S.NaN``
    which are not strictly number.
    Kind may have arguments as parameter. For example, ``MatrixKind()``
    may be constructed with one element which represents the kind of its
    elements.
    ``Kind`` behaves in singleton-like fashion. Same signature will
    return the same object.
    */

    static new(cls: any, ...args: any) {
        let inst;
        if (args in KindRegistry.registry) {
            inst = KindRegistry.registry[args];
        } else {
            KindRegistry.register(cls.name, cls);
            inst = new cls();
        }
        return inst;
    }

    // constructor(...args: any) {
    //     let inst;
    //     let cls: any = this.constructor;
    //     if (args in KindRegistry.registry) {
    //         inst = KindRegistry.registry[args];
    //     } else {
    //         inst = new Object(args);
    //         KindRegistry.register(this.constructor.name, inst);
    //     }
    //     return inst;
    // }
}

class _UndefinedKind extends Kind {
    /*
    Default kind for all SymPy object. If the kind is not defined for
    the object, or if the object cannot infer the kind from its
    arguments, this will be returned.
    Examples
    ========
    >>> from sympy import Expr
    >>> Expr().kind
    UndefinedKind
    */

    constructor() {
        super();
    }

    static new() {
        return Kind.new(_UndefinedKind);
    }

    toString() {
        return "UndefinedKind";
    }
}

const UndefinedKind = _UndefinedKind.new();

class _NumberKind extends Kind {
    /*
    Kind for all numeric object.
    This kind represents every number, including complex numbers,
    infinity and ``S.NaN``. Other objects such as quaternions do not
    have this kind.
    Most ``Expr`` are initially designed to represent the number, so
    this will be the most common kind in SymPy core. For example
    ``Symbol()``, which represents a scalar, has this kind as long as it
    is commutative.
    Numbers form a field. Any operation between number-kind objects will
    result this kind as well.
    Examples
    ========
    >>> from sympy import S, oo, Symbol
    >>> S.One.kind
    NumberKind
    >>> (-oo).kind
    NumberKind
    >>> S.NaN.kind
    NumberKind
    Commutative symbol are treated as number.
    >>> x = Symbol('x')
    >>> x.kind
    NumberKind
    >>> Symbol('y', commutative=False).kind
    UndefinedKind
    Operation between numbers results number.
    >>> (x+1).kind
    NumberKind
    See Also
    ========
    sympy.core.expr.Expr.is_Number : check if the object is strictly
    subclass of ``Number`` class.
    sympy.core.expr.Expr.is_number : check if the object is number
    without any free symbol.
    */

    constructor() {
        super();
    }

    static new() {
        return Kind.new(_NumberKind);
    }

    toString() {
        return "NumberKind";
    }
}

const NumberKind = _NumberKind.new();

class _BooleanKind extends Kind {
    /*
    Kind for boolean objects.
    SymPy's ``S.true``, ``S.false``, and built-in ``True`` and ``False``
    have this kind. Boolean number ``1`` and ``0`` are not relevent.
    Examples
    ========
    >>> from sympy import S, Q
    >>> S.true.kind
    BooleanKind
    >>> Q.even(3).kind
    BooleanKind
    */

    constructor() {
        super();
    }

    static new() {
        return Kind.new(_BooleanKind);
    }

    toString() {
        return "BooleanKind";
    }
}

const BooleanKind = _BooleanKind.new();


export {UndefinedKind, NumberKind, BooleanKind};
