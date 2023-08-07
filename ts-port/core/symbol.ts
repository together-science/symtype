/*
Notable changes
- Still a work in progress (not all methods implemented)
- Class structure reworked based on a constructor system (view source)
*/

import {mix, base, HashDict, HashSet} from "./utility";
import {AtomicExpr} from "./expr";
import {Boolean} from "./boolalg";
import {NumberKind, UndefinedKind} from "./kind";
import {fuzzy_bool} from "./logic";
import {StdFactKB} from "./assumptions";
import {ManagedProperties} from "./assumptions";
import { Global } from "./global";


class Symbol extends mix(base).with(Boolean, AtomicExpr) {
    /*
    Assumptions:
       commutative = True
    You can override the default assumptions in the constructor.
    Examples
    ========
    >>> from sympy import symbols
    >>> A,B = symbols('A,B', commutative = False)
    >>> bool(A*B != B*A)
    True
    >>> bool(A*B*2 == 2*A*B) == True # multiplication by scalars is commutative
    True
    */

    static is_comparable = false;

    __slots__ = ["name"];

    name: string;

    static is_Symbol = true;

    static is_symbol = true;

    static is_commutative = true;

    args: any[];

    kind() {
        if ((this.constructor as any).is_commutative) {
            return NumberKind;
        }
        return UndefinedKind;
    }

    _diff_wrt() {
        return true;
    }

    _hashable_content() {
        return [this.name].concat(this._assumptions.entries().flat())
    }

    constructor(name: any, properties: Record<string, boolean> = undefined) {
        super();
        this.name = name;

        // add user assumptions
        const assumptions: HashDict = new HashDict(properties);
        Symbol._sanitize(assumptions);
        const tmp_asm_copy = assumptions.copy();

        // strict commutativity
        const is_commutative = fuzzy_bool(assumptions.get("commutative", true));
        assumptions.add("is_commutative", is_commutative);

        // Merge with object assumptions and reassign object properties
        this._assumptions = new StdFactKB(assumptions)
        this._assumptions._generator = tmp_asm_copy;
    }

    __eq__(other: Symbol) {
        if (!(other instanceof Symbol)) {
            return super.__eq__(other);
        }
        if (this.name === other.name) {
            if (this._assumptions.isSame(other._assumptions)) {
                return true;
            }
        }
        return false;
    }

    static _sanitize(assumptions: HashDict = new HashDict()) {
        // remove none, convert values to bool, check commutativity *in place*

        // be strict about commutativity: cannot be undefined
        const is_commutative = fuzzy_bool(assumptions.get("commutative", true));
        if (typeof is_commutative === "undefined") {
            throw new Error("commutativity must be true or false");
        }
        for (const key of assumptions.keys()) {
            const v = assumptions.get(key);
            if (typeof v === "undefined") {
                assumptions.delete(key);
                continue;
            }
            assumptions.add(key, v as boolean);
        }
    }

    free_symbols() {
        const res: HashSet= new HashSet();
        res.add(this);
        return res;
    }


    toString() {
        return this.name;
    }
}

// eslint-disable-next-line new-cap
ManagedProperties.register(Symbol);

class Dummy extends Symbol {
    /*
    Dummy symbols are each unique, even if they have the same name:

    Examples
    ========

    >>> from sympy import Dummy
    >>> Dummy("x") == Dummy("x")
    False

    If a name is not supplied then a string value of an internal count will be
    used. This is useful when a temporary variable is needed and the name
    of the variable used in the expression is not important.

    >>> Dummy() #doctest: +SKIP
    _Dummy_10

    """

    # In the rare event that a Dummy object needs to be recreated, both the
    # `name` and `dummy_index` should be passed.  This is used by `srepr` for
    # example:
    # >>> d1 = Dummy()
    # >>> d2 = eval(srepr(d1))
    # >>> d2 == d1
    # True
    #
    # If a new session is started between `srepr` and `eval`, there is a very
    # small chance that `d2` will be equal to a previously-created Dummy.
    */
    static count = 0;
    static _base_dummy_index = Math.floor(Math.random() * (9*10**6 - 10**6 + 1)) + 10**6;
    static is_Dummy = true;

    constructor(name: string = undefined, dummy_index: number = undefined, properties: Record<string, boolean> = {}) {
        super(name, properties); // this handles sanitization and properties

        if (typeof name !== "undefined") {
            name = "Dummy_" + String(Dummy.count);
        }

        if (typeof dummy_index === "undefined") {
            dummy_index = Dummy._base_dummy_index + Dummy.count;
            Dummy.count += 1;
        }

        this.dummy_index = dummy_index;
    }

    _hashable_content() {
        return super._hashable_content().concat(this.dummy_index);
    }

    static _new(...args: any[]) {
        return new Dummy(...args);
    }


}

ManagedProperties.register(Dummy);
Global.register("Dummy", Dummy._new);

export {Symbol, Dummy};
