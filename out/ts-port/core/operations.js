import { _Basic } from "./basic.js";
import { mix } from "./utility.js";
import { global_parameters } from "./parameters.js";
import { fuzzy_and_v2 } from "./logic.js";
import { ManagedProperties } from "./assumptions.js";
import { S } from "./singleton.js";
const AssocOp = (superclass) => { var _a; return _a = class AssocOp extends mix(superclass).with(_Basic) {
        constructor(cls, evaluate, simplify, ...args) {
            if (cls.name === "Mul") {
                cls.identity = S.One;
            }
            else if (cls.name === "Add") {
                cls.identity = S.Zero;
            }
            super(...args);
            this.__slots__ = ["is_commutative"];
            if (simplify) {
                if (typeof evaluate === "undefined") {
                    evaluate = global_parameters.evaluate;
                }
                else if (evaluate === false) {
                    let obj = this._from_args(cls, undefined, ...args);
                    obj = this._exec_constructor_postprocessors(obj);
                    return obj;
                }
                const argsTemp = [];
                for (const a of args) {
                    if (a !== cls.identity) {
                        argsTemp.push(a);
                    }
                }
                args = argsTemp;
                if (args.length === 0) {
                    return cls.identity;
                }
                else if (args.length === 1) {
                    return args[0];
                }
                const [c_part, nc_part, order_symbols] = this.flatten(args);
                const is_commutative = nc_part.length === 0;
                let obj = this._from_args(cls, is_commutative, ...c_part.concat(nc_part));
                obj = this._exec_constructor_postprocessors(obj);
                return obj;
            }
        }
        _from_args(cls, is_commutative, ...args) {
            if (args.length === 0) {
                return cls.identity;
            }
            else if (args.length === 1) {
                return args[0];
            }
            const obj = new cls(true, false, ...args);
            if (typeof is_commutative === "undefined") {
                const input = [];
                for (const a of args) {
                    input.push(a.is_commutative);
                }
                is_commutative = fuzzy_and_v2(input);
            }
            obj.is_commutative = is_commutative;
            return obj;
        }
        _new_rawargs(reeval, ...args) {
            let is_commutative;
            if (reeval && this.is_commutative === false) {
                is_commutative = undefined;
            }
            else {
                is_commutative = this.is_commutative;
            }
            return this._from_args(this.constructor, is_commutative, ...args);
        }
        make_args(cls, expr) {
            if (expr instanceof cls) {
                return expr._args;
            }
            else {
                return [expr];
            }
        }
    },
    _a._args_type = undefined,
    _a; };
ManagedProperties.register(AssocOp(Object));
export { AssocOp };
//# sourceMappingURL=operations.js.map