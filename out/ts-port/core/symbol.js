import { mix, base, HashDict } from "./utility.js";
import { AtomicExpr } from "./expr.js";
import { Boolean } from "./boolalg.js";
import { NumberKind, UndefinedKind } from "./kind.js";
import { fuzzy_bool_v2 } from "./logic.js";
import { StdFactKB } from "./assumptions.js";
import { ManagedProperties } from "./assumptions.js";
class Symbol extends mix(base).with(Boolean, AtomicExpr) {
    constructor(name, properties = undefined) {
        super();
        this.__slots__ = ["name"];
        const assumptions = new HashDict(properties);
        Symbol._sanitize(assumptions);
        this.name = name;
        const tmp_asm_copy = assumptions.copy();
        const is_commutative = fuzzy_bool_v2(assumptions.get("commutative", true));
        assumptions.add("commutative", is_commutative);
        this._assumptions = new StdFactKB(assumptions);
        this._assumptions._generator = tmp_asm_copy;
    }
    kind() {
        if (this.constructor.is_commutative) {
            return NumberKind;
        }
        return UndefinedKind;
    }
    _diff_wrt() {
        return true;
    }
    hashKey() {
        return this.name + this.args;
    }
    equals(other) {
        if (this.name = other.name) {
            if (this._assumptions.isSame(other._assumptions)) {
                return true;
            }
        }
        return false;
    }
    static _sanitize(assumptions = new HashDict()) {
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
            assumptions.add(key, v);
        }
    }
}
Symbol.is_comparable = false;
Symbol.is_Symbol = true;
Symbol.is_symbol = true;
Symbol.is_commutative = true;
ManagedProperties.register(Symbol);
export { Symbol };
//# sourceMappingURL=symbol.js.map