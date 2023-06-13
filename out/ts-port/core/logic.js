import { Util } from "./utility.js";
function _torf(args) {
    let sawT = Logic.False;
    let sawF = Logic.False;
    for (const a of args) {
        if (a === Logic.True) {
            if (sawF instanceof True) {
                return null;
            }
            sawT = Logic.True;
        }
        else if (a === Logic.False) {
            if (sawT instanceof True) {
                return null;
            }
            sawF = Logic.True;
        }
        else {
            return null;
        }
    }
    return sawT;
}
function _fuzzy_group(args, quick_exit = Logic.False) {
    let saw_other = Logic.False;
    for (const a of args) {
        if (a === Logic.True) {
            continue;
        }
        if (a == null) {
            return null;
        }
        if (quick_exit instanceof True && saw_other instanceof True) {
            return null;
        }
        saw_other = Logic.True;
    }
    if (saw_other instanceof True) {
        return Logic.False;
    }
    return Logic.True;
}
export function _fuzzy_groupv2(args) {
    const res = _fuzzy_group(args);
    if (res === Logic.True) {
        return true;
    }
    else if (res === Logic.False) {
        return false;
    }
    return undefined;
}
function fuzzy_bool(x) {
    if (x == null) {
        return null;
    }
    if (x instanceof True) {
        return Logic.True;
    }
    if (x instanceof False) {
        return Logic.False;
    }
}
function fuzzy_bool_v2(x) {
    if (typeof x === "undefined") {
        return null;
    }
    if (x === true) {
        return true;
    }
    if (x === false) {
        return false;
    }
}
function fuzzy_and(args) {
    let rv = Logic.True;
    for (let ai of args) {
        ai = fuzzy_bool(ai);
        if (ai instanceof False) {
            return Logic.False;
        }
        if (rv instanceof True) {
            rv = ai;
        }
    }
    return rv;
}
function fuzzy_and_v2(args) {
    let rv = true;
    for (let ai of args) {
        ai = fuzzy_bool_v2(ai);
        if (ai === false) {
            return false;
        }
        if (rv === true) {
            rv = ai;
        }
    }
    return rv;
}
function fuzzy_not(v) {
    if (v == null) {
        return v;
    }
    else if (v instanceof True) {
        return Logic.False;
    }
    return Logic.True;
}
export function fuzzy_notv2(v) {
    if (v == undefined) {
        return undefined;
    }
    else if (v === true) {
        return false;
    }
    return true;
}
function fuzzy_or(args) {
    let rv = Logic.False;
    for (let ai of args) {
        ai = fuzzy_bool(ai);
        if (ai instanceof True) {
            return Logic.True;
        }
        if (rv instanceof False) {
            rv = ai;
        }
    }
    return rv;
}
function fuzzy_xor(args) {
    let t = 0;
    let f = 0;
    for (const a of args) {
        const ai = fuzzy_bool(a);
        if (ai instanceof True) {
            t += 1;
        }
        else if (ai instanceof False) {
            f += 1;
        }
        else {
            return null;
        }
    }
    if (t % 2 == 1) {
        return Logic.True;
    }
    return Logic.False;
}
function fuzzy_nand(args) {
    return fuzzy_not(fuzzy_and(args));
}
class Logic {
    constructor(...args) {
        this.args = args;
    }
    _eval_propagate_not() {
        throw new Error("Eval propagate not is abstract in Logic");
    }
    expand() {
        throw new Error("Expand is abstract in Logic");
    }
    static __new__(cls, ...args) {
        if (cls === Not) {
            return new Not(args[0]);
        }
        else if (cls === And) {
            return new And(args);
        }
        else if (cls === Or) {
            return new Or(args);
        }
    }
    get_op_x_notx() {
        return null;
    }
    hashKey() {
        return this.toString();
    }
    toString() {
        return "Logic " + this.args.toString();
    }
    getNewArgs() {
        return this.args;
    }
    static equals(a, b) {
        if (!(b instanceof a.constructor)) {
            return Logic.False;
        }
        else {
            if (a.args == b.args) {
                return Logic.True;
            }
            return Logic.False;
        }
    }
    static notEquals(a, b) {
        if (!(b instanceof a.constructor)) {
            return Logic.True;
        }
        else {
            if (a.args == b.args) {
                return Logic.False;
            }
            return Logic.True;
        }
    }
    lessThan(other) {
        if (this.compare(other) == -1) {
            return Logic.True;
        }
        return Logic.False;
    }
    compare(other) {
        let a;
        let b;
        if (typeof this != typeof other) {
            const unkSelf = this.constructor;
            const unkOther = other.constructor;
            a = unkSelf;
            b = unkOther;
        }
        else {
            a = this.args;
            b = other.args;
        }
        if (a > b) {
            return 1;
        }
        else {
            return 0;
        }
    }
    static fromstring(text) {
        let lexpr = null;
        let schedop = null;
        for (const term of text.split(" ")) {
            let flexTerm = term;
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
            if (schedop) {
                lexpr = Logic.op_2class[schedop](lexpr, flexTerm);
                schedop = null;
                continue;
            }
            if (lexpr != null) {
                throw new Error("missing op between " + lexpr + " and " + flexTerm);
            }
            lexpr = flexTerm;
        }
        if (schedop != null) {
            throw new Error("premature end-of-expression in " + text);
        }
        if (lexpr == null) {
            throw new Error(text + " is empty");
        }
        return lexpr;
    }
}
Logic.op_2class = {
    "&": (...args) => {
        return And.__new__(And.prototype, ...args);
    },
    "|": (...args) => {
        return Or.__new__(Or.prototype, ...args);
    },
    "!": (arg) => {
        return Not.__new__(Not.prototype, arg);
    },
};
class True extends Logic {
    _eval_propagate_not() {
        return False.False;
    }
    expand() {
        return this;
    }
}
class False extends Logic {
    _eval_propagate_not() {
        return True.True;
    }
    expand() {
        return this;
    }
}
class AndOr_Base extends Logic {
    static __new__(cls, ...args) {
        const bargs = [];
        for (const a of args) {
            if (a == cls.get_op_x_notx()) {
                return a;
            }
            else if (a == !(cls.get_op_x_notx())) {
                continue;
            }
            bargs.push(a);
        }
        args = AndOr_Base.flatten(bargs);
        const args_set = new Set(args.map((e) => Util.hashKey(e)));
        for (const a of args) {
            if (args_set.has((Not.New(a)).hashKey())) {
                return cls.get_op_x_notx();
            }
        }
        if (args.length == 1) {
            return args.pop();
        }
        else if (args.length == 0) {
            if (cls.get_op_x_notx() instanceof True) {
                return Logic.False;
            }
            return Logic.True;
        }
        return super.__new__(cls, ...args);
    }
    static flatten(args) {
        const args_queue = [...args];
        const res = [];
        while (args_queue.length > 0) {
            const arg = args_queue.pop();
            if (arg instanceof Logic) {
                if (arg instanceof this) {
                    args_queue.push(arg.args);
                    continue;
                }
            }
            res.push(arg);
        }
        return res;
    }
}
class And extends AndOr_Base {
    static New(...args) {
        return super.__new__(And, args);
    }
    get_op_x_notx() {
        return Logic.False;
    }
    _eval_propagate_not() {
        const param = [];
        for (const a of param) {
            param.push(Not.New(a));
        }
        return Or.New(...param);
    }
    expand() {
        for (let i = 0; i < this.args.length; i++) {
            const arg = this.args[i];
            if (arg instanceof Or) {
                const arest = [...this.args].splice(i, 1);
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
    static New(...args) {
        return super.__new__(Or, args);
    }
    get_op_x_notx() {
        return Logic.True;
    }
    _eval_propagate_not() {
        const param = [];
        for (const a of param) {
            param.push(Not.New(a));
        }
        return And.New(...param);
    }
}
class Not extends Logic {
    static New(args) {
        return Not.__new__(Not, args);
    }
    static __new__(cls, arg) {
        if (typeof arg === "string") {
            return super.__new__(cls, arg);
        }
        else if (arg instanceof True) {
            return Logic.False;
        }
        else if (arg instanceof False) {
            return Logic.True;
        }
        else if (arg instanceof Not) {
            return arg.args[0];
        }
        else if (arg instanceof Logic) {
            arg = arg._eval_propagate_not();
            return arg;
        }
        else {
            throw new Error("Not: unknown argument " + arg);
        }
    }
    arg() {
        return this.args[0];
    }
}
Logic.True = new True();
Logic.False = new False();
export { Logic, True, False, And, Or, Not, fuzzy_bool, fuzzy_and, fuzzy_bool_v2, fuzzy_and_v2 };
//# sourceMappingURL=logic.js.map