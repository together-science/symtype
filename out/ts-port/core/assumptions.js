import { FactKB, FactRules } from "./facts.js";
import { BasicMeta } from "./core.js";
import { HashDict, HashSet, Util } from "./utility.js";
const _assume_rules = new FactRules([
    "integer -> rational",
    "rational -> real",
    "rational -> algebraic",
    "algebraic -> complex",
    "transcendental == complex & !algebraic",
    "real -> hermitian",
    "imaginary -> complex",
    "imaginary -> antihermitian",
    "extended_real -> commutative",
    "complex -> commutative",
    "complex -> finite",
    "odd == integer & !even",
    "even == integer & !odd",
    "real -> complex",
    "extended_real -> real | infinite",
    "real == extended_real & finite",
    "extended_real == extended_negative | zero | extended_positive",
    "extended_negative == extended_nonpositive & extended_nonzero",
    "extended_positive == extended_nonnegative & extended_nonzero",
    "extended_nonpositive == extended_real & !extended_positive",
    "extended_nonnegative == extended_real & !extended_negative",
    "real == negative | zero | positive",
    "negative == nonpositive & nonzero",
    "positive == nonnegative & nonzero",
    "nonpositive == real & !positive",
    "nonnegative == real & !negative",
    "positive == extended_positive & finite",
    "negative == extended_negative & finite",
    "nonpositive == extended_nonpositive & finite",
    "nonnegative == extended_nonnegative & finite",
    "nonzero == extended_nonzero & finite",
    "zero -> even & finite",
    "zero == extended_nonnegative & extended_nonpositive",
    "zero == nonnegative & nonpositive",
    "nonzero -> real",
    "prime -> integer & positive",
    "composite -> integer & positive & !prime",
    "!composite -> !positive | !even | prime",
    "irrational == real & !rational",
    "imaginary -> !extended_real",
    "infinite == !finite",
    "noninteger == extended_real & !integer",
    "extended_nonzero == extended_real & !zero",
]);
export const _assume_defined = _assume_rules.defined_facts.clone();
class StdFactKB extends FactKB {
    constructor(facts = undefined) {
        super(_assume_rules);
        if (typeof facts === "undefined") {
            this._generator = {};
        }
        else if (!(facts instanceof FactKB)) {
            this._generator = facts.copy();
        }
        else {
            this._generator = facts.generator;
        }
        if (facts) {
            this.deduce_all_facts(facts);
        }
    }
    stdclone() {
        return new StdFactKB(this);
    }
    generator() {
        return this._generator.copy();
    }
}
export function as_property(fact) {
    return "is_" + fact;
}
export function make_property(obj, fact) {
    obj[as_property(fact)] = getit;
    function getit() {
        if (typeof obj._assumptions[fact] !== "undefined") {
            return obj._assumptions[fact];
        }
        else {
            return _ask(fact, obj);
        }
    }
}
function _ask(fact, obj) {
    const assumptions = obj._assumptions;
    const handler_map = obj._prop_handler;
    const facts_to_check = new Array(fact);
    const facts_queued = new HashSet([fact]);
    const cls = obj.constructor;
    for (const fact_i of facts_to_check) {
        if (typeof assumptions.get(fact_i) !== "undefined") {
            continue;
        }
        else if (cls[as_property(fact)]) {
            return (cls[as_property(fact)]);
        }
        let fact_i_value = undefined;
        let handler_i = handler_map.get(fact_i);
        if (typeof handler_i !== "undefined") {
            handler_i = handler_i.name;
            if (obj[handler_i]) {
                fact_i_value = obj[handler_i]();
            }
            else {
                fact_i_value = undefined;
            }
        }
        if (typeof fact_i_value !== "undefined") {
            assumptions.deduce_all_facts([[fact_i, fact_i_value]]);
        }
        const fact_value = assumptions.get(fact);
        if (typeof fact_value !== "undefined") {
            return fact_value;
        }
        const factset = _assume_rules.prereq.get(fact_i).difference(facts_queued);
        if (factset.size !== 0) {
            const new_facts_to_check = new Array(_assume_rules.prereq.get(fact_i).difference(facts_queued));
            Util.shuffleArray(new_facts_to_check);
            facts_to_check.push(new_facts_to_check);
            facts_to_check.flat();
            facts_queued.addArr(new_facts_to_check);
        }
        else {
            continue;
        }
    }
    if (assumptions.has(fact)) {
        return assumptions.get(fact);
    }
    assumptions._tell(fact, undefined);
    return undefined;
}
class ManagedProperties {
    static register(cls) {
        BasicMeta.register(cls);
        const local_defs = new HashDict();
        for (const k of _assume_defined.toArray()) {
            const attrname = as_property(k);
            if (attrname in cls) {
                let v = cls[attrname];
                if ((typeof v === "number" && Number.isInteger(v)) || typeof v === "boolean" || typeof v === "undefined") {
                    if (typeof v !== "undefined") {
                        v = !!v;
                    }
                    local_defs.add(k, v);
                }
            }
        }
        this.all_explicit_assumptions.merge(local_defs);
        cls._explicit_class_assumptions = this.all_explicit_assumptions;
        cls.default_assumptions = new StdFactKB(this.all_explicit_assumptions);
        for (const item of cls.default_assumptions.entries()) {
            cls[as_property(item[0])] = item[1];
        }
        const s = new HashSet();
        s.addArr(cls.default_assumptions.keys());
        this.all_default_assumptions.addArr(cls.default_assumptions.keys());
        for (const fact of this.all_default_assumptions.difference(s).toArray()) {
            const pname = as_property(fact);
            if (!(pname in cls)) {
                make_property(cls, fact);
            }
        }
        const alldefs = new HashSet(Object.keys(cls));
        for (const fact of alldefs.difference(cls.default_assumptions).toArray()) {
            cls.default_assumptions.add(fact, cls[fact]);
        }
    }
}
ManagedProperties.all_explicit_assumptions = new HashDict();
ManagedProperties.all_default_assumptions = new HashSet();
export { StdFactKB, ManagedProperties };
//# sourceMappingURL=assumptions.js.map