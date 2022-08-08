/*
Work-in progress: currently forms unevaluated add objects
*/

import {Expr} from "./expr.js";
import {AssocOp} from "./operations.js";
import {base, mix, HashDict} from "./utility.js";
import {S} from "./singleton.js";
import {Basic} from "./basic.js";
import {ManagedProperties} from "./assumptions.js";
import {Mul} from "./mul.js";

function _addsort(args: any[]) {
    // eslint-disable-next-line new-cap
    args.sort((a, b) => Basic.cmp(a, b));
}

class Add extends mix(base).with(Expr, AssocOp) {
    __slots__: any[] = [];
    args: any[];
    static is_Add = true;
    // eslint-disable-next-line new-cap
    static _args_type = Expr(Object);
    static identity = S.Zero; // !!! unsure abt this

    constructor(evaluate: boolean, simplify: boolean, ...args: any) {
        super(Add, evaluate, simplify, ...args);
    }

    flatten(seq: any[]) {
        const terms: HashDict = new HashDict();
        let coeff = S.Zero;
        const extra: any[] = [];
        for (const o of seq) {
            if (o.constructor.is_Number && coeff.constructor.is_Number) {
                coeff = coeff.__add__(o);
            } else {
                const c = S.One;
                const s = o;
                if (terms.has(s)) {
                    terms.add(s, terms.get(s).__add__(c));
                } else {
                    terms.add(s, c);
                }
            }
        }
        const newseq: any[] = [];
        let noncommutative: boolean = false;
        for (const item of terms.entries()) {
            const s: any = item[0];
            const c: any = item[1];
            if (c.constructor.is_zero) {
                continue;
            } else if (c === S.One) {
                newseq.push(s);
            } else {
                newseq.push(new Mul(true, true, c, s));
            }
            noncommutative = noncommutative || !(s.constructor.is_commutative);
        }

        _addsort(newseq);

        if (coeff !== S.Zero) {
            newseq.splice(0, 0, coeff);
        }

        if (extra.length) {
            newseq.push(extra);
            noncommutative = true;
        }

        if (noncommutative) {
            return [[], newseq, undefined];
        } else {
            return [newseq, [], undefined];
        }
    }
}

ManagedProperties.register(Add);

export {Add};
