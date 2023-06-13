import { as_property, make_property, ManagedProperties, _assume_defined } from "./assumptions.js";
import { Util, HashDict, mix, base, HashSet } from "./utility.js";
import { UndefinedKind } from "./kind.js";
import { preorder_traversal } from "./traversal.js";
const _Basic = (superclass) => { var _a; return _a = class _Basic extends superclass {
        constructor(...args) {
            super();
            this.__slots__ = ["_mhash", "_args", "_assumptions"];
            this._constructor_postprocessor_mapping = {};
            const cls = this.constructor;
            this._assumptions = cls.default_assumptions.stdclone();
            this._mhash = undefined;
            this._args = args;
            if (typeof cls._prop_handler === "undefined") {
                cls._prop_handler = new HashDict();
                for (const k of _assume_defined.toArray()) {
                    const meth1 = "_eval_is_" + k;
                    if (this[meth1]) {
                        cls._prop_handler.add(k, this[meth1]);
                    }
                }
            }
            this._prop_handler = cls._prop_handler.copy();
            for (const fact of _assume_defined.toArray()) {
                const pname = as_property(fact);
                if (typeof cls[pname] === "undefined") {
                    make_property(this, fact);
                }
            }
        }
        __getnewargs__() {
            return this._args;
        }
        __getstate__() {
            return undefined;
        }
        hash() {
            if (typeof this._mhash === "undefined") {
                return this.constructor.name + this.hashKey();
            }
            return this._mhash;
        }
        instanceofBasic() {
            return true;
        }
        assumptions0() {
            return {};
        }
        hashKey() {
            return this._args;
        }
        static cmp(self, other) {
            if (self === other) {
                return 0;
            }
            const n1 = self.constructor.name;
            const n2 = other.constructor.name;
            if (n1 && n2) {
                return (n1 > n2) - (n1 < n2);
            }
            const st = self._hashable_content();
            const ot = other._hashable_content();
            if (st && ot) {
                return (st.length > ot.length) - (st.length < ot.length);
            }
            for (const elem of Util.zip(st, ot)) {
                const l = elem[0];
                const r = elem[1];
                let c;
                if (l instanceof Basic) {
                    c = l.cmp(r);
                }
                else {
                    c = (l > r) - (l < r);
                }
                if (c) {
                    return c;
                }
            }
            return 0;
        }
        _exec_constructor_postprocessors(obj) {
            const clsname = this.constructor.name;
            const postprocessors = new HashDict();
            for (const f of postprocessors.get(clsname, [])) {
                obj = f(obj);
            }
            return obj;
        }
        _eval_subs(old, _new) {
            return undefined;
        }
        _aresame(a, b) {
            if (a.is_Number && b.is_Number) {
                return a === b && a.constructor.name === b.constructor.name;
            }
            for (const item of Util.zip(new preorder_traversal(a).asIter(), new preorder_traversal(b).asIter())) {
                const i = item[0];
                const j = item[1];
                if (i !== j || typeof i !== typeof j) {
                    return false;
                }
            }
            return true;
        }
        subs(...args) {
            let sequence;
            if (args.length === 1) {
                sequence = args[0];
                if (sequence instanceof HashSet) {
                }
                else if (sequence instanceof HashDict) {
                    sequence = sequence.entries();
                }
                else if (Symbol.iterator in Object(sequence)) {
                    throw new Error("When a single argument is passed to subs it should be a dictionary of old: new pairs or an iterable of (old, new) tuples");
                }
            }
            else if (args.length === 2) {
                sequence = [args];
            }
            else {
                throw new Error("sub accepts 1 or 2 args");
            }
            let rv = this;
            for (const item of sequence) {
                const old = item[0];
                const _new = item[1];
                rv = rv._subs(old, _new);
                if (!(rv instanceof Basic)) {
                    break;
                }
            }
            return rv;
        }
        _subs(old, _new) {
            function fallback(cls, old, _new) {
                let hit = false;
                const args = cls._args;
                for (let i = 0; i < args.length; i++) {
                    let arg = args[i];
                    if (!(arg._eval_subs)) {
                        continue;
                    }
                    arg = arg._subs(old, _new);
                    if (!(cls._aresame(arg, args[i]))) {
                        hit = true;
                        args[i] = arg;
                    }
                }
                if (hit) {
                    let rv;
                    if (cls.constructor.name === "Mul" || cls.constructor.name === "Add") {
                        rv = new cls.constructor(true, true, ...args);
                    }
                    else if (cls.constructor.name === "Pow") {
                        rv = new cls.constructor(...args);
                    }
                    return rv;
                }
                return cls;
            }
            if (this._aresame(this, old)) {
                return _new;
            }
            let rv = this._eval_subs(old, _new);
            if (typeof rv === "undefined") {
                rv = fallback(this, old, _new);
            }
            return rv;
        }
    },
    _a.is_number = false,
    _a.is_Atom = false,
    _a.is_Symbol = false,
    _a.is_symbol = false,
    _a.is_Indexed = false,
    _a.is_Dummy = false,
    _a.is_Wild = false,
    _a.is_Function = false,
    _a.is_Add = false,
    _a.is_Mul = false,
    _a.is_Pow = false,
    _a.is_Number = false,
    _a.is_Float = false,
    _a.is_Rational = false,
    _a.is_Integer = false,
    _a.is_NumberSymbol = false,
    _a.is_Order = false,
    _a.is_Derivative = false,
    _a.is_Piecewise = false,
    _a.is_Poly = false,
    _a.is_AlgebraicNumber = false,
    _a.is_Relational = false,
    _a.is_Equality = false,
    _a.is_Boolean = false,
    _a.is_Not = false,
    _a.is_Matrix = false,
    _a.is_Vector = false,
    _a.is_Point = false,
    _a.is_MatAdd = false,
    _a.is_MatMul = false,
    _a.kind = UndefinedKind,
    _a.all_unique_props = new HashSet(),
    _a; };
const Basic = _Basic(Object);
ManagedProperties.register(Basic);
const Atom = (superclass) => { var _a; return _a = class Atom extends mix(base).with(_Basic) {
        constructor() {
            super(...arguments);
            this.__slots__ = [];
        }
        matches(expr, repl_dict = undefined, old = false) {
            if (this === expr) {
                if (typeof repl_dict === "undefined") {
                    return new HashDict();
                }
                return repl_dict.copy();
            }
        }
        xreplace(rule, hack2 = false) {
            return rule.get(this);
        }
        doit(...hints) {
            return this;
        }
    },
    _a.is_Atom = true,
    _a; };
const _AtomicExpr = Atom(Object);
ManagedProperties.register(_AtomicExpr);
export { _Basic, Basic, Atom, _AtomicExpr };
//# sourceMappingURL=basic.js.map