import {mix, base, HashDict} from "./utility.js";
import {AtomicExpr} from "./expr.js";
import {Boolean} from "./boolalg.js";
import {NumberKind, UndefinedKind} from "./kind.js";
import {fuzzy_bool} from "./logic.js";
import {Expr} from "./expr.js";
import {StdFactKB} from "./assumptions.js";
import {cacheit} from "./cache.js";

// eslint-disable-next-line new-cap
const _Expr = Expr(Object);

// eslint-disable-next-line no-unused-vars
class Symbol extends mix(base).with(AtomicExpr, Boolean) {
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

    is_comparable = false;

    __slots__ = ["name"];

    name: string;

    is_Symbol = true;

    is_symbol = true;


    kind() {
        if (this.is_commutative) {
            return NumberKind;
        }
        return UndefinedKind;
    }

    _diff_wrt() {
        return true;
    }

    static _sanitize(aspts: Record<any, any> = undefined) {
        // remove none, convert values to bool, check commutativity *in place*

        // be strict about commutativity: cannot be undefined
        if (typeof aspts !== "undefined") {
            const assumptions = new HashDict(aspts);
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
    }

    constructor(name: any, assumptions: Record<any, any> = undefined) {
        super();
        Symbol._sanitize(assumptions);
        const res: any = Symbol.__xnew_cached(name, assumptions);
        return res;
    }

    static __xnew__(name: any, aspts: Record<any, any>) {
        if (typeof name !== "string") {
            throw new Error("name must be string");
        }
        const assumptions = new HashDict();
        if (typeof aspts !== "undefined") {
            assumptions.merge(new HashDict(aspts));
        }
        const obj = new _Expr();
        obj.name = name;
        const is_commutative = fuzzy_bool(assumptions.get("commutative", true));
        assumptions.add("commutative", is_commutative);
        const tmp_asm_copy = assumptions.copy();
        obj._assumptions = new StdFactKB(assumptions);
        obj._assumptions._generator = tmp_asm_copy;
        return obj;
    }

    static __xnew_cached = cacheit(Symbol.__xnew__);
}
