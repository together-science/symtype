function _torf(args) {
    let sawT = false;
    let sawF = false;
    for (let a of args) {
        if (a === true) {
            if (sawF) {
                return null;
            }
            sawT = true;
        }
        else if (a === false) {
            if (sawT) {
                return null;
            }
            sawF = true;
        }
        else {
            return null;
        }
    }
    return sawT;
}
function _fuzzy_group(args, quick_exit = false) {
    let saw_other = false;
    for (let a of args) {
        if (a === true) {
            continue;
        }
        if (a == null) {
            return null;
        }
        if (quick_exit && saw_other) {
            return null;
        }
        saw_other = true;
    }
    return !saw_other;
}
function fuzzy_bool(x) {
    if (x == null) {
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
    let rv = true;
    for (let ai of args) {
        ai = fuzzy_bool(ai);
        if (ai === false) {
            return false;
        }
        if (rv) {
            rv = ai;
        }
    }
    return rv;
}
function fuzzy_not(v) {
    if (v == null) {
        return v;
    }
    else {
        return !v;
    }
}
function fuzzy_or(args) {
    let rv = false;
    for (let ai of args) {
        ai = fuzzy_bool(ai);
        if (ai === true) {
            return true;
        }
        if (rv === false) {
            rv = ai;
        }
    }
}
function fuzzy_xor(args) {
    let t = 0;
    let f = 0;
    for (let a of args) {
        let ai = fuzzy_bool(a);
        if (ai === true) {
            t += 1;
        }
        else if (ai === false) {
            f += 1;
        }
        else {
            return null;
        }
    }
    return t % 2 == 1;
}
function fuzzy_nand(args) {
    return fuzzy_not(fuzzy_and(args));
}
class Logic {
    constructor(...args) {
        this.args = args;
    }
    static hashKey(x) {
        if (x === null) {
            return "null";
        }
        if (x.hashKey) {
            return x.hashKey();
        }
        return x.toString();
    }
    static __new__(cls, ...args) {
        return new Logic(...args);
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
            return false;
        }
        else {
            return a.args == b.args;
        }
    }
    static notEquals(a, b) {
        if (!(b instanceof a.constructor)) {
            return true;
        }
        else {
            return a.args != b.args;
        }
    }
    lessThan(other) {
        if (this.compare(other) == -1) {
            return true;
        }
        return false;
    }
    compare(other) {
        let a, b;
        if (typeof this != typeof other) {
            let unkSelf = this.constructor;
            let unkOther = other.constructor;
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
        for (let term of text.split(" ")) {
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
                flexTerm = new Not(flexTerm.substring(1));
            }
            if (schedop) {
                console.log(lexpr);
                console.log(flexTerm);
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
        console.log("done");
        return lexpr;
    }
}
Logic.op_2class = {
    '&': (...args) => {
        return And.__new__(And.prototype, ...args);
    },
    '|': (...args) => {
        return Or.__new__(Or.prototype, ...args);
    },
    '!': (arg) => {
        return Not.__new__(Not.prototype, arg);
    }
};
class AndOr_Base extends Logic {
    static __new__(cls, ...args) {
        let bargs = [];
        for (let a of args) {
            if (a == cls.get_op_x_notx()) {
                return a;
            }
            else if (a == !(cls.get_op_x_notx())) {
                continue;
            }
            bargs.push(a);
        }
        args = AndOr_Base.flatten(bargs);
        let args_set = new Set(args.map((e) => Logic.hashKey(e)));
        for (let a of args) {
            if (args_set.has((new Not()).hashKey())) {
                return cls.get_op_x_notx();
            }
        }
        if (args.length == 1) {
            return args.pop();
        }
        else if (args.length == 0) {
            return !cls.get_op_x_notx();
        }
        return super.__new__(cls, ...args);
    }
    static flatten(args) {
        let args_queue = [...args];
        let res = [];
        while (args_queue.length > 0) {
            let arg;
            arg = args_queue.pop();
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
    get_op_x_notx() {
        return false;
    }
    _eval_propagate_not() {
        let param = new Array();
        for (let a of param) {
            param.push(new Not(a));
        }
        return new Or(...param);
    }
    expand() {
        for (let i = 0; i < this.args.length; i++) {
            let arg = this.args[i];
            if (arg instanceof Or) {
                let arest = [...this.args].splice(i, 1);
                let orterms = arg.args.map((e) => new And(...arest.concat([e])));
                for (let j = 0; j < orterms.length; j++) {
                    if (orterms[j] instanceof Logic) {
                        orterms[j] = orterms[j].expand();
                    }
                }
                let res = new Or(...orterms);
                return res;
            }
        }
        return this;
    }
}
class Or extends AndOr_Base {
    get_op_x_notx() {
        return true;
    }
    _eval_propagate_not() {
        let param = new Array();
        for (let a of param) {
            param.push(new Not(a));
        }
        return new And(...param);
    }
}
class Not extends Logic {
    static __new__(cls, arg) {
        console.log(cls);
        if (arg instanceof cls) {
            return super.__new__(cls, arg);
        }
        else if (arg instanceof Boolean) {
            return !arg;
        }
        else if (arg instanceof Not) {
            return arg.args[0];
        }
        else if (arg instanceof Logic) {
            arg = arg._eval_propagate_not();
            return arg;
        }
        else {
            console.log(cls);
        }
    }
    arg() {
        return this.args[0];
    }
}
function test() {
    let a = Logic.fromstring("a |b");
    let b = Logic.fromstring("a & b");
    console.log('done');
}
test();
//# sourceMappingURL=logic.js.map