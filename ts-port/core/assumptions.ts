/*
Notable changes made (and notes):
- ManagedProperties reworked as normal class - each class is registered directly
  after defined
- ManagedProperties loops through superclasses to assign static properties that
  aren't inherited (thanks TypeScript)
- Getit acts as a lambda, so properties are now accessed with function notation
  i.e., myobject.is_property()
*/

import {FactKB, FactRules} from "./facts";
import {BasicMeta} from "./core";
import {HashDict, HashSet, Util} from "./utility";


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
    /* A FactKB specialized for the built-in rules
    This is the only kind of FactKB that Basic objects should use.
    */

    _generator;

    constructor(facts: any = undefined) {
        super(_assume_rules);
        // save a copy of facts dict
        if (typeof facts === "undefined") {
            this._generator = {};
        } else if (!(facts instanceof FactKB)) {
            this._generator = facts.copy();
        } else {
            this._generator = (facts as any).generator; // !!!
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

export function as_property(fact: any) {
    return "is_" + fact;
}

export function make_property(obj: any, fact: any) {
    // choosing to run getit() on make_property to add consistency in accessing
    // propoerties of symtype objects. this may slow down symtype slightly
    if (!fact.includes("is_")) {
        obj[as_property(fact)] = getit
    } else {
        obj[fact] = getit;
    }
    function getit() {
        if (typeof obj._assumptions[fact] !== "undefined") {
            return obj._assumptions.get(fact);
        } else {
            return _ask(fact, obj);
        }
    }
}


// eslint-disable-next-line no-unused-vars
function _ask(fact: any, obj: any) {
    /*
    Find the truth value for a property of an object.
    This function is called when a request is made to see what a fact
    value is.
    For this we use several techniques:
    First, the fact-evaluation function is tried, if it exists (for
    example _eval_is_integer). Then we try related facts. For example
        rational   -->   integer
    another example is joined rule:
        integer & !odd  --> even
    so in the latter case if we are looking at what 'even' value is,
    'integer' and 'odd' facts will be asked.
    In all cases, when we settle on some fact value, its implications are
    deduced, and the result is cached in ._assumptions.
    */

    // FactKB which is dict-like and maps facts to their known values:
    const assumptions: StdFactKB = obj._assumptions;

    // A dict that maps facts to their handlers:
    const handler_map: HashDict = obj._prop_handler;

    // This is our queue of facts to check:
    let facts_to_check = new Array(fact);
    const facts_queued = new HashSet([fact]);

    const cls = obj.constructor;

    for (let i = 0; i < facts_to_check.length; i++) {
        const fact_i = facts_to_check[i];
        if (typeof assumptions.get(fact_i) !== "undefined") {
            continue;
        } else if (cls[as_property(fact)]) {
            return (cls[as_property(fact)]);
        }
        let fact_i_value = undefined;
        let handler_i = handler_map.get(fact_i);
        if (typeof handler_i !== "undefined") {
            fact_i_value = obj[handler_i.name]();
        }

        if (typeof fact_i_value !== "undefined") {
            assumptions.deduce_all_facts([[fact_i, fact_i_value]]);
        }

        const fact_value = assumptions.get(fact);
        if (typeof fact_value !== "undefined") {
            return fact_value;
        }
        const factset = _assume_rules.prereq.get(fact_i).difference(facts_queued).toArray();
        if (factset.size !== 0) {
            Util.shuffleArray(factset);
            facts_to_check = facts_to_check.concat(factset).flat();
            facts_queued.addArr(facts_to_check);
        } else {
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
    static all_explicit_assumptions: HashDict = new HashDict();
    static all_default_assumptions: HashSet = new HashSet();


    static register(cls: any) {
        // register with BasicMeta (record class name)
        BasicMeta.register(cls);

        // For all properties we want to define, determine if they are defined
        // by the class or if we set them as undefined.
        // Add these properties to a dict called local_defs
        const local_defs = new HashDict();
        const cls_props = Object.getOwnPropertyNames(cls);
        for (const k of _assume_defined.toArray()) {
            const attrname = as_property(k);
            if (cls_props.includes(attrname)) {
                let v = cls[attrname];
                if ((typeof v === "number" && Number.isInteger(v)) || typeof v === "boolean" || typeof v === "undefined") {
                    if (typeof v !== "undefined") {
                        v = !!v;
                    }
                    local_defs.add(k, v);
                }
            }
        }

        const all_defs = new HashDict()
        for (const base of Util.getSupers(cls).reverse()) {
            const assumptions = base._explicit_class_assumptions;
            if (typeof assumptions !== "undefined") {
                all_defs.merge(assumptions)
            }
        }

        all_defs.merge(local_defs);

        // Set class properties for assume_defined
        cls._explicit_class_assumptions = all_defs
        cls.default_assumptions = new StdFactKB(all_defs);

        // Add default assumptions as class properties
        for (const item of cls.default_assumptions.entries()) {
            if (item[0].includes("is")) {
                cls[item[0]] = item[1];
            } else {
                cls[as_property(item[0])] = item[1];
            }
        }
        // get the misc. properties of the superclasses and assign to class
        for (const supercls of Util.getSupers(cls)) {
            const staticDefs = new HashSet(Object.getOwnPropertyNames(cls).filter(
                prop => prop.includes("is_") && !_assume_defined.has(prop.replace("is_", ""))));

            const otherProps = new HashSet(Object.getOwnPropertyNames(supercls).filter(
                prop => prop.includes("is_") && !_assume_defined.has(prop.replace("is_", ""))));

            const uniqueProps = otherProps.difference(staticDefs);
            for (const fact of uniqueProps.toArray()) {
                cls[fact] = supercls[fact]
            }
        }
    }
}

export {StdFactKB, ManagedProperties};
