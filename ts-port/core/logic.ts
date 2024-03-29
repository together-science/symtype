/* eslint-disable new-cap */
/* eslint-disable no-unused-vars */
/*

Notable chnages made (WB & GM):
- Undefined is being used as a third boolean value instead of 'none'
- Arrays are being used instead of tuples
- The methods hashKey() and toString() are added to Logic for hashing. The
  static method hashKey() is also added to Logic and hashes depending on the input.
- A constructor is added to the logic class, which is used by Logic and its
  subclasses (AndOr_Base, And, Or, Not)
- In the flatten method of AndOr_Base we removed the try catch and changed the
  while loop to depend on the legnth of the args array
- Added expand() and eval_propagate_not as abstract methods to the Logic class
- Added static New methods to Not, And, and Or which function as constructors
*/

import {Util, HashSet} from "./utility";


function _torf(args: any[]): boolean | undefined {
    /* Return True if all args are True, False if they
    are all False, else None
    >>> from sympy.core.logic import _torf
    >>> _torf((True, True))
    True
    >>> _torf((False, False))
    False
    >>> _torf((True, False))
    */
    let sawT = false;
    let sawF = false;
    for (const a of args) {
        if (a) {
            if (sawF) {
                return undefined;
            }
            sawT = true;
        } else if (!a) {
            if (sawT) {
                return undefined;
            }
            sawF = true;
        } else {
            return undefined;
        }
    }
    return sawT;
}

export function _fuzzy_group(args: any[], quick_exit = false): boolean | undefined {
    /* Return True if all args are True, None if there is any None else False
    unless ``quick_exit`` is True (then return None as soon as a second False
    is seen.
     ``_fuzzy_group`` is like ``fuzzy_and`` except that it is more
    conservative in returning a False, waiting to make sure that all
    arguments are True or False and returning None if any arguments are
    None. It also has the capability of permiting only a single False and
    returning None if more than one is seen. For example, the presence of a
    single transcendental amongst rationals would indicate that the group is
    no longer rational; but a second transcendental in the group would make the
    determination impossible.
    Examples
    ========
    >>> from sympy.core.logic import _fuzzy_group
    By default, multiple Falses mean the group is broken:
    >>> _fuzzy_group([False, False, True])
    False
    If multiple Falses mean the group status is unknown then set
    `quick_exit` to True so None can be returned when the 2nd False is seen:
    >>> _fuzzy_group([False, False, True], quick_exit=True)
    But if only a single False is seen then the group is known to
    be broken:
    >>> _fuzzy_group([False, True, True], quick_exit=True)
    False
    */
    let saw_other = false;
    for (const a of args) {
        if (a) {
            continue;
        } if (typeof a === "undefined") {
            return undefined;
        } if (quick_exit && saw_other) {
            return undefined;
        }
        saw_other = true;
    }
    if (saw_other) {
        return false;
    }
    return true;
}

function fuzzy_bool(x: Logic): boolean | undefined {
    /* Return True, False or None according to x.
    Whereas bool(x) returns True or False, fuzzy_bool allows
    for the None value and non - false values(which become None), too.
    Examples
    ========
    >>> from sympy.core.logic import fuzzy_bool
    >>> from sympy.abc import x
    >>> fuzzy_bool(x), fuzzy_bool(None)
    (None, None)
    >>> bool(x), bool(None)
        (True, False)
    */
    if (typeof x === "undefined") {
        return undefined;
    }
    if (x) {
        return true;
    }
    if (!x) {
        return false;
    }
}

function fuzzy_and(args: any[]): boolean | undefined {
    /* Return True (all True), False (any False) or None.
    Examples
    ========
    >>> from sympy.core.logic import fuzzy_and
    >>> from sympy import Dummy
    If you had a list of objects to test the commutivity of
    and you want the fuzzy_and logic applied, passing an
    iterator will allow the commutativity to only be computed
    as many times as necessary.With this list, False can be
    returned after analyzing the first symbol:
    >>> syms =[Dummy(commutative = False), Dummy()]
    >>> fuzzy_and(s.is_commutative for s in syms)
    False
    That False would require less work than if a list of pre - computed
    items was sent:
    >>> fuzzy_and([s.is_commutative for s in syms])
    False
    */

    let rv = true;
    for (let ai of args) {
        ai = fuzzy_bool(ai);
        if (!ai) {
            return false;
        } if (rv) { // this will stop updating if a None is ever trapped
            rv = ai;
        }
    }
    return rv;
}

function fuzzy_not(v: any): boolean | undefined {
    /*
    Not in fuzzy logic
        Return None if `v` is None else `not v`.
        Examples
        ========
        >>> from sympy.core.logic import fuzzy_not
        >>> fuzzy_not(True)
    False
        >>> fuzzy_not(None)
        >>> fuzzy_not(False)
    True
    */
    if (typeof v === "undefined") {
        return v;
    } else if (v) {
        return false;
    }
    return true;
}

function fuzzy_or(args: any[]): boolean | undefined {
    /*
    Or in fuzzy logic.Returns True(any True), False(all False), or None
        See the docstrings of fuzzy_and and fuzzy_not for more info.fuzzy_or is
        related to the two by the standard De Morgan's law.
        >>> from sympy.core.logic import fuzzy_or
        >>> fuzzy_or([True, False])
    True
        >>> fuzzy_or([True, None])
    True
        >>> fuzzy_or([False, False])
    False
        >>> print(fuzzy_or([False, None]))
    None
    */
    let rv = false;

    for (let ai of args) {
        ai = fuzzy_bool(ai);
        if (ai) {
            return true;
        }
        if (!rv) { // this will stop updating if a None is ever trapped
            rv = ai;
        }
    }
    return rv;
}

function fuzzy_xor(args: any[]): boolean | undefined {
    /* Return None if any element of args is not True or False, else
    True(if there are an odd number of True elements), else False. */
    let t = 0;
    let f = 0;
    for (const a of args) {
        const ai = fuzzy_bool(a);
        if (ai) {
            t += 1;
        } else if (!ai) {
            f += 1;
        } else {
            return undefined;
        }
    }
    if (t % 2 == 1) {
        return true;
    }
    return false;
}

function fuzzy_nand(args: any[]): boolean | undefined {
    /* Return False if all args are True, True if they are all False,
    else None. */
    return fuzzy_not(fuzzy_and(args));
}


class Logic {
    static True: Logic;
    static False: Logic;

    static op_2class: Record<string, (...args: any[]) => Logic> = {
        "&": (...args) => {
            return And.New(...args);
        },
        "|": (...args) => {
            return Or.New(...args);
        },
        "!": (arg) => {
            return Not.New(arg);
        },
    };

    args: any[];

    constructor(...args: any[]) {
        this.args = args.flat();
    }

    _eval_propagate_not(): any {
        throw new Error("Eval propagate not is abstract in Logic");
    }

    expand(): any {
        throw new Error("Expand is abstract in Logic");
    }

    static __new__(cls: any, ...args: any[]): any {
        if (cls === Not) {
            return new Not(args[0]);
        } else if (cls === And) {
            return new And(args);
        } else if (cls === Or) {
            return new Or(args);
        }
    }

    get_op_x_notx(): any {
        return undefined;
    }

    hashKey(): string {
        return this.toString();
    }

    toString() {
        return "Logic " + this.args.toString();
    }

    getNewArgs(): any[] {
        return this.args;
    }

    static equals(a: any, b: any): boolean {
        if (!(b instanceof a.constructor)) {
            return false;
        } else {
            if (a.args == b.args) {
                return true;
            }
            return false;
        }
    }

    static notEquals(a: any, b: any): boolean {
        if (!(b instanceof a.constructor)) {
            return true;
        } else {
            if (a.args == b.args) {
                return false;
            }
            return true;
        }
    }

    lessThan(other: Object): boolean {
        if (this.compare(other) == -1) {
            return true;
        }
        return false;
    }

    compare(other: any): number {
        let a; let b;
        if (typeof this != typeof other) {
            const unkSelf: unknown = <unknown> this.constructor;
            const unkOther: unknown = <unknown> other.constructor;
            a = <string> unkSelf;
            b = <string> unkOther;
        } else {
            a = this.args;
            b = other.args;
        }
        if (a > b) {
            return 1;
        } else {
            return 0;
        }
    }

    static fromstring(text: string) {
        /* Logic from string with space around & and | but none after !.
           e.g.
           !a & b | c
        */
        let lexpr = null; // current logical expression
        let schedop = null; // scheduled operation
        for (const term of text.split(" ")) {
            let flexTerm: string | Logic = term;
            // operation symbol
            if ("&|".includes(flexTerm)) {
                if (schedop != null) {
                    throw new Error("double op forbidden " + flexTerm + " " + schedop);
                }
                if (lexpr == null) {
                    throw new Error(flexTerm + " cannot be in the beginning of expression");
                }
                schedop = flexTerm;
                continue;
            }
            if (flexTerm.includes("|") || flexTerm.includes("&")) {
                throw new Error("& and | must have space around them");
            }
            if (flexTerm[0] == "!") {
                if (flexTerm.length == 1) {
                    throw new Error("do not include space after !");
                }
                flexTerm = Not.New(flexTerm.substring(1));
            }
            // already scheduled operation, e.g. '&'
            if (schedop) {
                const op = Logic.op_2class[schedop];
                lexpr = op(lexpr, flexTerm);
                schedop = null;
                continue;
            }
            // this should be atom
            if (lexpr != null) {
                throw new Error("missing op between " + lexpr + " and " + flexTerm );
            }
            lexpr = flexTerm;
        }

        // let's check that we ended up in correct state
        if (schedop != null) {
            throw new Error("premature end-of-expression in " + text);
        }
        if (lexpr == null) {
            throw new Error(text + " is empty");
        }
        // everything looks good now
        return lexpr;
    }
}

class AndOr_Base extends Logic {
    static __new__(cls: any, op_x_notx: any, ...args: any[]) {
        const bargs: any[] = [];
        for (const a of args) {
            if (a === op_x_notx) {
                return a;
            } else if (a === !op_x_notx) {
                continue; // skip this argument
            }
            bargs.push(a);
        }

        // prev version: args = sorted(set(this.flatten(bargs)), key=hash)
        // we think we don't need the sort and set
        args = new HashSet(AndOr_Base.flatten(bargs)).toArray().sort(
            (a, b) => Util.hashKey(a).localeCompare(Util.hashKey(b))
        );

        // creating a set with hash keys for args
        const args_set = new HashSet(args);

        for (const a of args) {
            if (args_set.has(Not.New(a))) {
                return op_x_notx;
            }
        }

        if (args.length == 1) {
            return args.pop();
        } else if (args.length == 0) {
            if (op_x_notx) {
                return false;
            }
            return true;
        }

        return super.__new__(cls, ...args);
    }

    static flatten(args: any[]): any[] {
        // quick-n-dirty flattening for And and Or
        const args_queue: any[] = args;
        const res = [];
        while (args_queue.length > 0) {
            const arg: any = args_queue.pop();
            if (arg instanceof Logic) {
                if (arg instanceof this) {
                    args_queue.push(...arg.args);
                    continue;
                }
            }
            res.push(arg);
        }
        return res;
    }
}

class And extends AndOr_Base {
    static New(...args: any[]) {
        return super.__new__(And, false, ...args);
    }


    _eval_propagate_not(): Or {
        // ! (a&b&c ...) == !a | !b | !c ...
        const param: any[] = [];
        for (const a of param) {
            param.push(Not.New(a)); // ??
        }
        return Or.New(...param); // ???
    }

    // (a|b|...) & c == (a&c) | (b&c) | ...
    expand(): any {
        // first locate Or
        for (let i = 0; i < this.args.length; i++) {
            const arg = this.args[i];
            if (arg instanceof Or) {
                // copy of this.args with arg at position i removed

                const arest = [...this.args].splice(i, 1);

                // step by step version of the map below
                /*
                let orterms = [];
                for (let a of arg.args) {
                    orterms.push(new And(...arest.concat([a])))
                }
                */

                const orterms = arg.args.map((e) => And.New(...arest.concat([e])));


                for (let j = 0; j < orterms.length; j++) {
                    if (orterms[j] instanceof Logic) {
                        orterms[j] = orterms[j].expand();
                    }
                }
                const res = Or.New(...orterms);
                return res;
            }
        }
        return this;
    }
}

class Or extends AndOr_Base {
    static New(...args: any[]) {
        return super.__new__(Or, true, ...args);
    }

    _eval_propagate_not(): And {
        // ! (a&b&c ...) == !a | !b | !c ...
        const param: any[] = [];
        for (const a of param) {
            param.push(Not.New(a));
        }
        return And.New(...param);
    }
}

class Not extends Logic {
    static New(args: any) {
        return Not.__new__(Not, args);
    }

    static __new__(cls: any, arg: any) {
        if (typeof arg === "string") {
            return super.__new__(cls, arg);
        } else if (arg === true) {
            return false;
        } else if (arg === false) {
            return true;
        } else if (arg instanceof Not) {
            return arg.args[0];
        } else if (arg instanceof Logic) {
            // XXX this is a hack to expand right from the beginning
            arg = arg._eval_propagate_not();
            return arg;
        } else {
            throw new Error("Not: unknown argument " + arg);
        }
    }

    arg() {
        return this.args[0];
    }
}

export { Logic, And, Or, Not, fuzzy_and, fuzzy_bool, fuzzy_not, fuzzy_xor };


