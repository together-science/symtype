import {ManagedProperties} from "./assumptions.js";
import {Expr} from "./expr.js";
import {AssocOp} from "./operations.js";
import {Pow} from "./power.js";
import {S} from "./singleton.js";
import {mix, base} from "./utility.js";

class Mul extends mix(base).with(Expr, AssocOp) {
    __slots__: any[] = [];
    args: any[];
    static is_Mul = true;
    _args_type = Expr;
    static identity = S.One;

    constructor(evaluate: boolean, simplify: boolean, ...args: any) {
        super(Mul, evaluate, simplify, ...args);
    }

    flatten(seq: any) {
        let c_part = [];
        const nc_part: any[] = [];
        let coeff = S.One;
        const c_powers = [];
        const order_symbols: any[] = [];

        for (const o of seq) {
            if (o.constructor.is_Number && coeff.constructor.is_Number) {
                coeff = coeff.__mul__(o);
                continue;
            } else if (o.constructor.is_commutative) {
                const [b, e] = o.as_base_exp();
                c_powers.push([b, e]);
            }
        }

        for (let i = 0; i < 2; i++) {
            const new_c_powers: any[] = [];
            for (const [b, e] of c_powers) {
                let p;
                if (e.constructor.is_zero) {
                    continue;
                }
                if (e === S.One) {
                    if (b.constructor.is_Number) {
                        coeff = coeff.__mul__(b);
                        continue;
                    }
                    p = b;
                }
                if (e !== S.One) {
                    p = new Pow(b, e);
                }
                c_part.push(p);
                new_c_powers.push([b, e]);
            }
            break;
        }
        const _new = [];
        for (const i of c_part) {
            if (i.constructor.is_Number) {
                coeff = coeff.__mul__(i);
            } else {
                _new.push(i);
            }
        }
        c_part = _new;
        if (coeff !== S.One) {
            c_part.splice(0, 0, coeff);
        }
        return [c_part, nc_part, order_symbols];
    }
}

ManagedProperties.register(Mul);

export {Mul};
