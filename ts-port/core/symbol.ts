/*
Notable changes
- Still a work in progress (not all methods implemented)
- Class structure reworked based on a constructor system (view source)
*/

import {mix, base, HashDict} from "./utility.js";
import {AtomicExpr} from "./expr.js";
import {Boolean} from "./boolalg.js";
import {NumberKind, UndefinedKind} from "./kind.js";
import {fuzzy_bool_v2} from "./logic.js";
import {StdFactKB} from "./assumptions.js";
import {ManagedProperties} from "./assumptions.js";


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

    constructor(name: any, properties: Record<any, any> = undefined) {
        super();
        const assumptions = new HashDict(properties);
        Symbol._sanitize(assumptions);
        this.name = name;
        const tmp_asm_copy = assumptions.copy();
        const is_commutative = fuzzy_bool_v2(assumptions.get("commutative", true));
        assumptions.add("commutative", is_commutative);
        this._assumptions = new StdFactKB(assumptions);
        this._assumptions._generator = tmp_asm_copy;
    }

    equals(other: Symbol) {
        if (this.name = other.name) {
            if (this._assumptions.isSame(other._assumptions)) {
                return true;
            }
        }
        return false;
    }

    static _sanitize(assumptions: HashDict = new HashDict()) {
        // remove none, convert values to bool, check commutativity *in place*

        // be strict about commutativity: cannot be undefined
        const is_commutative = fuzzy_bool_v2(assumptions.get("commutative", true));
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
}

// eslint-disable-next-line new-cap
ManagedProperties.register(Symbol);

export {Symbol};
