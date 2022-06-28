/* This is rule-based deduction system for SymPy
The whole thing is split into two parts
 - rules compilation and preparation of tables
 - runtime inference
For rule-based inference engines, the classical work is RETE algorithm [1],
[2] Although we are not implementing it in full (or even significantly)
it's still worth a read to understand the underlying ideas.
In short, every rule in a system of rules is one of two forms:
 - atom                     -> ...      (alpha rule)
 - And(atom1, atom2, ...)   -> ...      (beta rule)
The major complexity is in efficient beta-rules processing and usually for an
expert system a lot of effort goes into code that operates on beta-rules.
Here we take minimalistic approach to get something usable first.
 - (preparation)    of alpha- and beta- networks, everything except
 - (runtime)        FactRules.deduce_all_facts
             _____________________________________
            ( Kirr: I've never thought that doing )
            ( logic stuff is that difficult...    )
             -------------------------------------
                    o   ^__^
                     o  (oo)\_______
                        (__)\       )\/\
                            ||----w |
                            ||     ||
Some references on the topic
----------------------------
[1] https://en.wikipedia.org/wiki/Rete_algorithm
[2] http://reports-archive.adm.cs.cmu.edu/anon/1995/CMU-CS-95-113.pdf
https://en.wikipedia.org/wiki/Propositional_formula
https://en.wikipedia.org/wiki/Inference_rule
https://en.wikipedia.org/wiki/List_of_rules_of_inference
*/

/*

Significant changes made (WB and GM):
- Created the Implication class, use to represent the implication p -> q which
  is stored as a tuple in sympy
- Created the SetDefaultDict, HashDict and HashSet classes. SetDefaultDict acts
  as a replcacement defaultdict(set), and HashDict and HashSet replace the 
  dict and set classes.
- Added isSubset() to the utility class to help with this program

*/


import { Logic, True, False, And, Or, Not } from "./logic.js";

import { Util, HashSet, SetDefaultDict, HashDict, Implication } from "./utility.js";


function _base_fact(atom: any) {
    /*  Return the literal fact of an atom.
    Effectively, this merely strips the Not around a fact.
    */
   if (atom instanceof Not) {
       return atom.arg;
   } else {
       return atom;
   }
}


function _as_pair(atom: any) {
    /*  Return the literal fact of an atom.
    Effectively, this merely strips the Not around a fact.
    */
   if (atom instanceof Not) {
       return new Implication(atom.arg, Logic.False);
   } else {
       return new Implication(atom, Logic.True);
   }
}

// XXX this prepares forward-chaining rules for alpha-network

function transitive_closure(implications: Implication[]) {
    /*
    Computes the transitive closure of a list of implications
    Uses Warshall's algorithm, as described at
    http://www.cs.hope.edu/~cusack/Notes/Notes/DiscreteMath/Warshall.pdf.
    */

    let full_implications = new HashSet(implications);
    let literals = new Set(implications.flat());

    for (let k of literals) {
        for (let i of literals) {
            if (full_implications.has(new Implication(i, k))) {
                for (let j of literals) {
                    if (full_implications.has(new Implication(k, j))) {
                        full_implications.add(new Implication(i, j));
                    }
                }
            }
        }
    }
    return full_implications;
}


function deduce_alpha_implications(implications: Implication[]) {
    /* deduce all implications
       Description by example
       ----------------------
       given set of logic rules:
         a -> b
         b -> c
       we deduce all possible rules:
         a -> b, c
         b -> c
       implications: [] of (a,b)
       return:       {} of a -> set([b, c, ...])
       */
    let new_arr: any[] = [];
    for (let impl of implications) {
        new_arr.push(new Implication(Not.New(impl.q), Not.New(impl.p)));
    }
    implications = implications.concat(new_arr);
    let res = new SetDefaultDict();
    let full_implications = transitive_closure(implications);
    for (let impl of full_implications.toArray()) {
        if (impl.p === impl.q) {
            continue; // skip a->a cyclic input
        }
        let currSet = res.get(impl.p);
        currSet.add(impl.q);
        res.add(impl.p, currSet);
    } 
    // Clean up tautologies and check consistency
    // impl is the set
    for (let item of res.entries()) {
        let a = item[0];
        let impl: HashSet = item[1]; 
        impl.remove(a);
        let na = Not.New(a);
        if (impl.has(na)) {  
            throw new Error("implications are inconsistent: " + a + " -> " + na + " " + impl)
        }
    }
    return res;
}

function apply_beta_to_alpha_route(alpha_implications: HashDict, beta_rules: any[]) {
    /* apply additional beta-rules (And conditions) to already-built
    alpha implication tables
       TODO: write about
       - static extension of alpha-chains
       - attaching refs to beta-nodes to alpha chains
       e.g.
       alpha_implications:
       a  ->  [b, !c, d]
       b  ->  [d]
       ...
       beta_rules:
       &(b,d) -> e
       then we'll extend a's rule to the following
       a  ->  [b, !c, d, e]
    */

       // is beta_rules an array or a dictionary?

    let x_impl: HashDict =  new HashDict; 
    for (let x of alpha_implications.keys()) {
        let newset = new HashSet();
        newset.add(alpha_implications.get(x));
        let imp = new Implication(newset, []);
        x_impl.add(x, imp);
    }
    for (let item of beta_rules) {
        let bcond = item[0];
        let bimpl = item[1];
        for (let bk of bcond.args) {
            if (x_impl.has(bk)) {
                continue;
            }
            let imp = new Implication(new HashSet(), []);
            x_impl.add(imp.p, imp.q);
        }
    }
    // static extensions to alpha rules:
    // A: x -> a,b   B: &(a,b) -> c  ==>  A: x -> a,b,c

    let seen_static_extension: Logic = Logic.True;
    while (seen_static_extension instanceof True) {
        seen_static_extension = Logic.False;

        for (let impl of beta_rules) {
            let bcond = impl.p;
            let bimpl = impl.q;
            if (!(bcond instanceof And)) {
                throw new Error("Cond is not And");
            }
            let bargs = new HashSet(bcond.args);
            for (let item of x_impl.entries()) {
                let x = item[0];     
                let impl = item[1];
                let ximpls = impl.p;
                let bb = impl.q;
                let x_all = ximpls.clone().add(x);
                // A: ... -> a   B: &(...) -> a  is non-informative
                if (!(x_all.includes(bimpl)) && Util.isSubset(bargs.toArray(), x_all)) { 
                    ximpls.add(bimpl);

                    // we introduced new implication - now we have to restore
                    // completeness of the whole set.

                    let bimpl_impl = x_impl.get(bimpl);
                    if (bimpl_impl != null) {
                        ximpls |= bimpl_impl[0];
                    }
                    seen_static_extension = Logic.True;
                }
            }   
        }
    }
    // attach beta-nodes which can be possibly triggered by an alpha-chain
    for (let bidx = 0; bidx < beta_rules.length; bidx++) {
        let impl = beta_rules[bidx];
        let bcond = impl.p;
        let bimpl = impl.q;
        let bargs = new HashSet(bcond.args);
        for (let item of x_impl.entries()) {
            let x = item[0];
            let value: Implication = item[1];
            let ximpls = value.p;
            let bb = value.q;
            let x_all = ximpls.clone().add(x); 
            if (x_all.has(bimpl)) {
                continue;
            }
            // A: x -> a...  B: &(!a,...) -> ... (will never trigger)
            // A: x -> a...  B: &(...) -> !a     (will never trigger)
            if (x_all.some((e: any) => (bargs.has(Not.New(e)) || Not.New(e) === bimpl))) { 
                continue;
            }
            if (bargs && x_all) {
                bb.push(bidx); 
            }
        }
    }
    return x_impl;
}


function rules_2prereq(rules: SetDefaultDict) {
    /* build prerequisites table from rules
       Description by example
       ----------------------
       given set of logic rules:
         a -> b, c
         b -> c
       we build prerequisites (from what points something can be deduced):
         b <- a
         c <- a, b
       rules:   {} of a -> [b, c, ...]
       return:  {} of c <- [a, b, ...]
       Note however, that this prerequisites may be *not* enough to prove a
       fact. An example is 'a -> b' rule, where prereq(a) is b, and prereq(b)
       is a. That's because a=T -> b=T, and b=F -> a=F, but a=F -> b=? 
    */

    let prereq = new SetDefaultDict();
    for (let item of rules.entries()) { 
        let a = item[0].p;
        let impl = item[1];
        if (a instanceof Not) {
            a = a.args[0];
        }
        for (let item of impl.toArray()) { 
            let i = item.p;
            if (i instanceof Not) {
                i = i.args[0];
            }
            prereq.get(i).add(a); 
        }
    }
    return prereq;
}


//////////////////
// RULES PROVER //
//////////////////

class TautologyDetected extends Error { 

    args;

    constructor(...args: any[]) {
        super();
        this.args = args;
    }
    // (internal) Prover uses it for reporting detected tautology
}

class Prover {
    
    /* ai - prover of logic rules
       given a set of initial rules, Prover tries to prove all possible rules
       which follow from given premises.
       As a result proved_rules are always either in one of two forms: alpha or
       beta:
       Alpha rules
       -----------
       This are rules of the form::
         a -> b & c & d & ...
       Beta rules
       ----------
       This are rules of the form::
         &(a,b,...) -> c & d & ...
       i.e. beta rules are join conditions that say that something follows when
       *several* facts are true at the same time.
    */

    proved_rules: any[]; 
    _rules_seen;
   
    constructor() {
        this.proved_rules = [];
        this._rules_seen = new HashSet();
   }

   split_alpha_beta() {
        // split proved rules into alpha and beta chains
        let rules_alpha = []    // a      -> b
        let rules_beta = []     // &(...) -> b
        for (let impl of this.proved_rules) {
            let a = impl.p;
            let b = impl.q;
            if (a instanceof And) {
                rules_beta.push(new Implication(a, b));
            } else {
                rules_alpha.push(new Implication(a, b));
            }
        }
        return [rules_alpha, rules_beta];
   }

    rules_alpha() {
        return this.split_alpha_beta()[0];
    }

    rules_beta() {
        return this.split_alpha_beta()[1];
    }

    process_rule(a: any, b: any) {
        // process a -> b rule  ->  TODO write more?
        if (b instanceof True || b instanceof False) { 
            return;
        } 
        if (a instanceof True || a instanceof False) { 
            return;
        }
        if (this._rules_seen.has(new Implication(a, b))) { 
            return;
        } else {
            this._rules_seen.add(new Implication(a, b))
        }
        // this is the core of the processing
        try {
            this._process_rule(a, b);
        } 
        catch(error) {  
            if (!(error instanceof TautologyDetected)) {
                throw Error;
            }
        }
    }

    _process_rule(a: any, b: any) {
        // right part first
    
        // a -> b & c   -->    a-> b  ;  a -> c
    
        //  (?) FIXME this is only correct when b & c != null !
    
        if (b instanceof And) {
            for (let barg of b.args) {
                this.process_rule(a, barg);
            }
        }
    
        // a -> b | c    -->  !b & !c -> !a
        //               -->   a & !b -> c
        //               -->   a & !c -> b
    
        else if (b instanceof Or) {
            // detect tautology first
            if (!(a instanceof Logic)) { // atom
                // tautology:  a -> a|c|...
                if (b.args.includes(a)) {
                    throw new TautologyDetected(a, b, 'a -> a|c|...'); 
                }
            }
            let not_bargs: any[] = new Array();
            for (let barg of b.args) {
                not_bargs.push(Not.New(barg));
            }
            this.process_rule(And.New(...not_bargs), Not.New(a));
    
            for (let bidx = 0; bidx < b.args.length; bidx++) {
                let barg = b.args[bidx];
                let brest = [...b.args].splice(bidx, 1);
                this.process_rule(And.New(a, Not.New(barg)), Or.New(...brest));
            }
        }
    
        // left part
        // a & b -> c    -->  IRREDUCIBLE CASE -- WE STORE IT AS IS
        //                    (this will be the basis of beta-network)
    
        else if (a instanceof And) {
            if (a.args.includes(b)) {
                throw new TautologyDetected(a, b, 'a & b -> a')
            }
            this.proved_rules.push(new Implication(a, b));
            // XXX NOTE at present we ignore  !c -> !a | !b
        }
    
        else if (a instanceof Or) {
            if (a.args.includes(b)) {
                throw new TautologyDetected(a, b, 'a & b -> a');
            }
            for (let aarg of a.args) {
                this.process_rule(aarg, b);
            }
        }
    
        else {
            // both 'a' and 'b' are atoms
            this.proved_rules.push(new Implication(a, b)); // a -> b
            this.proved_rules.push(new Implication(Not.New(b), Not.New(a)));
        }
    }

}

/////////////////////////////////////

class FactRules {
    /* Rules that describe how to deduce facts in logic space
    When defined, these rules allow implications to quickly be determined
    for a set of facts. For this precomputed deduction tables are used.
    see `deduce_all_facts`   (forward-chaining)
    Also it is possible to gather prerequisites for a fact, which is tried
    to be proven.    (backward-chaining)
    Definition Syntax
    -----------------
    a -> b       -- a=T -> b=T  (and automatically b=F -> a=F)
    a -> !b      -- a=T -> b=F
    a == b       -- a -> b & b -> a
    a -> b & c   -- a=T -> b=T & c=T
    # TODO b | c
    Internals
    ---------
    .full_implications[k, v]: all the implications of fact k=v
    .beta_triggers[k, v]: beta rules that might be triggered when k=v
    .prereq  -- {} k <- [] of k's prerequisites
    .defined_facts -- set of defined fact names
    */

    beta_rules: any[];
    defined_facts;
    full_implications;
    beta_triggers;
    prereq;

    constructor(rules: any[] | string) {
        // Compile rules into internal lookup tables
        if (typeof rules === "string") {
            rules = rules.split('\n');
        }
        // --- parse and process rules ---
        let P: Prover = new Prover;

        for (let rule of rules) {
            // XXX `a` is hardcoded to be always atom
            let [a, op, b] = rule.split(" ", 3);
            a = Logic.fromstring(a);
            b = Logic.fromstring(b);

            if (op === "->") {
                P.process_rule(a, b);
            } else if (op === '==') {
                P.process_rule(a, b);
                P.process_rule(b, a);
            } else {
                throw new Error("unknown op " + op);
            }
        }
        // --- build deduction networks ---

        this.beta_rules = [];
        for (let item of P.rules_beta()) {
            let bcond = item.p;
            let bimpl = item.q;
            let pairs: HashSet = new HashSet()
            bcond.args.forEach((a: any) => pairs.add(_as_pair(a)));
            this.beta_rules.push(new Implication(pairs, _as_pair(bimpl))); 
        }

        // deduce alpha implications
        let impl_a = deduce_alpha_implications(P.rules_alpha());

        // now:
        // - apply beta rules to alpha chains  (static extension), and
        // - further associate beta rules to alpha chain (for inference
        // at runtime)

        let impl_ab = apply_beta_to_alpha_route(impl_a, P.rules_beta());

        // extract defined fact names
        this.defined_facts =  new HashSet();

        for (let k of impl_ab.keys()) {
            this.defined_facts.add(_base_fact(k));
        }

        // build rels (forward chains)

        let full_implications = new SetDefaultDict();
        let beta_triggers = new SetDefaultDict();
        for (let item of impl_ab.entries()) {
            let k = item[0];
            let val = item[1];
            let impl: HashSet = val.p;
            let betaidxs = val.q;
            let setToAdd = new HashSet();
            impl.toArray().forEach((e: any) => setToAdd.add(_as_pair(e)))
            full_implications.add(_as_pair(k), setToAdd);
            beta_triggers.add(_as_pair(k), betaidxs);
        }
        this.full_implications = full_implications;
        this.beta_triggers = beta_triggers

        // build prereq (backward chains)
        let prereq = new SetDefaultDict();
        let rel_prereq = rules_2prereq(full_implications);
        for (let item of rel_prereq.entries()) {
            let k = item[0];
            let pitems = item[1]; 
            prereq.get(k).add(pitems);
        }
        this.prereq = prereq;
    }

}


class InconsistentAssumptions extends Error {

    args;

    constructor(...args: any[]) {
        super();
        this.args = args;
    }

     static __str__(...args: any[]) { 
        let [kb, fact, value] = args;
        return kb + ", " + fact + "=" + value;

    }
}

class FactKB extends HashDict { 
    /*
    A simple propositional knowledge base relying on compiled inference rules.
    */

    rules;

    toString(): string {
        // string representation of dictionary
        let res: string = '';
        for (let item of Object.values(this.dict)) {
            res += item[0] + " : " + item[1] + ",\n";
        }
        return res;
    }

    constructor(rules: any) {
        super();
        this.rules = rules;
    }

    _tell(k: any, v: any) {
        /* Add fact k=v to the knowledge base.
        Returns True if the KB has actually been updated, False otherwise.
        */
        if (k in this.dict && typeof this.get(k) !== "undefined") {
            if (this.get(k) === v) {
                return Logic.False;
            } else {
                throw new InconsistentAssumptions(this, k, v);
            }
        } else {
            this.add(k, v);
            return Logic.True;
        }
    }

    ////////////////////////////////////////////////
    //* This is the workhorse, so keep it *fast*. //
    ////////////////////////////////////////////////

    deduce_all_facts(facts: any) {
        /*
        Update the KB with all the implications of a list of facts.
        Facts can be specified as a dictionary or as a list of (key, value)
        pairs.
        */
        // keep frequently used attributes locally, so we'll avoid extra
        // attribute access overhead

        let full_implications: SetDefaultDict = this.rules.full_implications;
        let beta_triggers: SetDefaultDict = this.rules.beta_triggers;
        let beta_rules: any[] = this.rules.beta_rules;

        if (facts instanceof HashDict) {
            facts = facts.entries();
        }

        while (facts.length != 0) {
            let beta_maytrigger = new HashSet();

            // --- alpha chains ---
            for (let item of facts) {
                let k = item[0];
                let v = item[1];
                if (this._tell(k, v) instanceof False || (typeof v === "undefined")) {
                    continue;
                }

                // lookup routing tables
                let arr = full_implications.get(new Implication(k, v)).toArray();
                for (let item of arr) { 
                    this._tell(item[0], item[1]); 
                }
                let currimp = beta_triggers.get(new Implication(k, v));
                if (!(currimp.isEmpty())) {
                    beta_maytrigger.add(beta_triggers.get(new Implication(k, v)))
                }
            }
            // --- beta chains ---
            facts = [];
            for (let bidx of beta_maytrigger.toArray()) {
                let [bcond, bimpl] = beta_rules[bidx];
                for (let item of bcond) {
                    let k = item[0];
                    let v = item[1];
                    if (this.get(k) !== v) { 
                        continue;
                    }
                    facts.push(bimpl);
                }
            }
        }
    }
}