/*
Notable changes made (and notes):
- ManagedProperties reworked as normal class - each class is registered directly
  after defined
- ManagedProperties tracks properties of base classes by tracking all properties
  (see comments within class)
*/

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

function make_property(cls: any, fact: any) {
    cls[as_property(fact)] = () => {
        try {
            return cls._assumptions[fact];
        } catch (Error) {
            if (cls._assumptions === cls.default_assumptions) {
                cls._assumptions = cls.default_assumptions.copy();
            }
            return _ask(fact, cls);
        }
    };
}

/*
def make_property(fact):
    """Create the automagic property corresponding to a fact."""

    def getit(self):
        try:
            return self._assumptions[fact]
        except KeyError:
            if self._assumptions is self.default_assumptions:
                self._assumptions = self.default_assumptions.copy()
            return _ask(fact, self)

    getit.func_name = as_property(fact)
    return property(getit)
*/

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
    const assumptions: FactKB = obj.default_assumptions;

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
        facts_to_check.flat();
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

    static all_explicit_assumptions: HashDict = new HashDict();
    static all_default_assumptions: HashSet = new HashSet();


    static register(cls: any) {
        // register with BasicMeta (record class name)
        BasicMeta.register(cls);

        // For all properties we want to define, determine if they are defined
        // by the class or if we set them as undefined.
        // Add these properties to a dict called local_defs
        const local_defs = new HashDict();
        for (const k of _assume_defined.toArray()) {
            const attrname = as_property(k);
            let v = cls[attrname];
            if ((typeof v === "number" && Number.isInteger(v)) || typeof v === "boolean" || typeof v === "undefined") {
                if (typeof v !== "undefined") {
                    v = !!v;
                }
                local_defs.add(k, v);
            }
        }

        // Keep track of the explicit assumptions for all registered classes.
        // For a given class, this looks like the assumptions for all of its
        // superclasses since we register classes top-down.
        this.all_explicit_assumptions.merge(local_defs);

        // Set class properties
        cls._explicit_class_assumptions = this.all_explicit_assumptions;
        cls.default_assumptions = new StdFactKB(this.all_explicit_assumptions);

        // Create a dictionary to handle the current properties of the class
        cls._prop_handler = new HashDict();
        for (const k of _assume_defined.toArray()) {
            // note: most of the _eval_is_ methods are not yet implemented
            const meth1 = "_eval_is_" + k;
            const meth2 = "_eval_is_";
            if (cls.meth1) {
                cls._prop_handler.add(k, meth1);
            } else if (cls.meth2) {
                cls._prop_handler.add(k, meth2);
            }
        }

        // Add default assumptions as class properties
        for (const item of cls.default_assumptions.entries()) {
            cls[as_property(item[0])] = item[1];
        }

        // Create two sets: one of the default assumption keys for this class
        // another for the base classes
        const s = new HashSet();
        s.addArr(cls.default_assumptions.keys());
        this.all_default_assumptions.addArr(cls.default_assumptions.keys());


        // Add only the properties from base classes that we don't already have
        for (const fact of this.all_default_assumptions.difference(s).toArray()) {
            const pname = as_property(fact);
            if (!(pname in cls)) {
                make_property(cls, fact); // need to debug !!!!!!!
            }
        }

        // Make sure we're not missing anything (add all properties left over)
        for (const fact of _assume_defined.toArray()) {
            const pname = as_property(fact);
            if (!(pname in cls)) {
                make_property(cls, fact); // need to debug !!!!!!!!
            }
        }
    }
}

export {StdFactKB, ManagedProperties, make_property};
