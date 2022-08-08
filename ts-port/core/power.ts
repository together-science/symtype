import {_Expr} from "./expr.js";
import {global_parameters} from "./parameters.js";
import {S} from "./singleton.js";

class Pow extends _Expr {
    is_Pow = true;

    __slots__ = ["is_commutative"];

    constructor(b: any, e: any, evaluate: boolean = undefined, simplify: boolean = true) {
        super(b, e);
        if (typeof evaluate === "undefined") {
            evaluate = global_parameters.evaluate;
        }
        if (simplify) {
            if (evaluate) {
                if (e === S.Zero) {
                    return S.One;
                } else if (e === S.One) {
                    return b;
                } else if (b === S.One) {
                    return S.One;
                } else if (e.constructor.is_Number && b.constructor.is_Number ) {
                    const obj = b._eval_power(e);
                    if (typeof obj !== "undefined") {
                        obj.is_commutative = (b.constructor.is_commutative && e.constructor.is_commutative);
                        return obj;
                    }
                }
            }
        } else {
            const obj = new Pow(b, e, false, false);
            obj.is_commutative = (b.constructor.is_commutative && e.constructor.is_commutative);
            return obj;
        }
    }
}

export {Pow};

