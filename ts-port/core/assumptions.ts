import {FactKB, FactRules} from "./facts.js";
import {BasicMeta} from "./core.js";
import {HashDict, HashSet, Util} from "./utility.js";


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


const _assume_defined = _assume_rules.defined_facts.clone();

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

    copy() {
        return this.constructor();
    }

    generator() {
        return this._generator.copy();
    }
}

function as_property(fact: any) {
    return "is_" + fact;
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
    const assumptions: FactKB = obj._assumptions;

    // A dict that maps facts to their handlers:
    const handler_map: HashDict = obj._prop_handler;

    // This is our queue of facts to check:
    const facts_to_check = new Array(fact);
    const facts_queued = new HashSet(fact);

    for (const fact_i of facts_to_check) {
        if (assumptions.has(fact_i)) {
            continue;
        }
        let fact_i_value = undefined;
        const handler_i = handler_map.get(fact_i);
        if (typeof handler_i !== "undefined") {
            fact_i_value = handler_i(obj);
        }

        if (typeof fact_i_value !== "undefined") {
            assumptions.deduce_all_facts;
        }

        const fact_value = assumptions.get(fact);
        if (typeof fact_value !== "undefined") {
            return fact_value;
        }
        const new_facts_to_check = new Array(_assume_rules.prereq.get(fact_i).difference(facts_queued));
        Util.shuffleArray(new_facts_to_check);
        facts_to_check.push(new_facts_to_check);
        facts_queued.addArr(new_facts_to_check);
    }

    if (assumptions.has(fact)) {
        return assumptions.get(fact);
    }

    assumptions._tell(fact, undefined);
    return undefined;
}


class ManagedProperties {
    // static __dict__: Record<any, any>;
    // static __bases__: any[];
    // static _explicit_class_assumptions: HashDict;
    // static _prop_handler: Record<any, any>;
    // static default_assumptions: StdFactKB;


    // Metaclass for classes with old-style assumptions

    // get(fact: any) {
    //     let cls: any = this.constructor;
    //     let dict: FactKB = cls._assumptions;
    //     if (dict.has(fact)) {
    //         return dict.get(fact);
    //     } else {
    //         cls._assumptions.dict = cls.default_assumptions.dict.copy();
    //         return _ask(fact, cls);
    //     }
    // }


    static register(cls: any) {
        BasicMeta.register(cls);
        const local_defs = new HashDict();
        for (const k of _assume_defined.toArray()) {
            let v = cls.k;
            if ((typeof v === "number" && Number.isInteger(v)) || typeof v === "boolean" || typeof v === "undefined") {
                if (!(typeof v === "undefined")) {
                    v = !!v;
                }
                local_defs.add(k, v);
            }
        }
        const defs = new HashDict();
        for (const base of Util.getSupers(cls).reverse()) {
            if (base._explicit_class_assumptions) {
                defs.merge(base._explicit_class_assumptions());
            }
        }
        defs.merge(local_defs);

        cls._explicit_class_assumptions = defs;
        cls.default_assumptions = new StdFactKB(defs);

        cls._prop_handler = new HashDict();
        for (const k of _assume_defined.toArray()) {
            const meth1 = "_eval_is_" + k;
            const meth2 = "_eval_is_";
            if ((this as any).meth1) {
                cls._prop_handler(k, meth1);
            } else if ((this as any).meth2) {
                cls._prop_handler(k, meth2);
            }
        }
        for (const item of cls.default_assumptions.entries()) {
            cls[as_property(item[0])] = item[1];
        }

        const derived_from_bases = new HashSet();
        for (const base of Util.getSupers(cls)) {
            if (base.default_assumptions) {
                derived_from_bases.add(cls.default_assumptions);
            }
        }

        const s = new HashSet();
        s.add(cls.default_assumptions);

        for (const fact of derived_from_bases.difference(s).toArray()) {
            const pname = as_property(fact);
            if (!(pname in cls.__dict__)) {
                cls[pname] = fact;
            }
        }

        for (const fact of _assume_defined.toArray()) {
            const pname = as_property(fact);
            if (!(this as any).fact) {
                cls[pname] = fact; // !!! doubts about this
            }
        }
    }
}

export {StdFactKB, ManagedProperties};
