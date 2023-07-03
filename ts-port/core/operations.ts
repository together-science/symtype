/*
Notable changes made and notes:
- Order-symbols and related componented not yet implemented
- Most methods not yet implemented (but enough to evaluate add in theory)
- Simplify argument added to constructor to prevent infinite recursion
*/

import {_Basic} from "./basic";
import {mix} from "./utility";
import {global_parameters} from "./parameters";
import {fuzzy_and} from "./logic";
import {ManagedProperties} from "./assumptions";
import {S} from "./singleton";


const AssocOp = (superclass: any) => class AssocOp extends mix(superclass).with(_Basic) {
    /* Associative operations, can separate noncommutative and
    commutative parts.
    (a op b) op c == a op (b op c) == a op b op c.
    Base class for Add and Mul.
    This is an abstract base class, concrete derived classes must define
    the attribute `identity`.
    .. deprecated:: 1.7
       Using arguments that aren't subclasses of :class:`~.Expr` in core
       operators (:class:`~.Mul`, :class:`~.Add`, and :class:`~.Pow`) is
       deprecated. See :ref:`non-expr-args-deprecated` for details.
    Parameters
    ==========
    *args :ƒ
        Arguments which are operated
    evaluate : bool, optional
        Evaluate the operation. If not passed, refer to ``global_parameters.evaluate``.
    */

    // for performance reason, we don't let is_commutative go to assumptions,
    // and keep it right here

    __slots__: any[] = ["is_commutative"];
    static _args_type: any = undefined;
    static clsname = "AssocOp";

    constructor(cls: any, evaluate: any, simplify: boolean, ...args: any) {
        // identity wasn't working for some reason, so here is a bandaid fix
        if (cls.name === "Mul") {
            cls.identity = S.One;
        } else if (cls.name === "Add") {
            cls.identity = S.Zero;
        }
        super(...args);
        if (simplify) {
            if (typeof evaluate === "undefined") {
                evaluate = global_parameters.evaluate;
            } else if (evaluate === false) {
                let obj = this._from_args(cls, undefined, ...args);
                obj = this._exec_constructor_postprocessors(obj);
                return obj;
            }
            const argsTemp: any[] = [];
            for (const a of args) {
                if (a !== cls.identity) {
                    argsTemp.push(a);
                }
            }
            args = argsTemp;
            if (args.length === 0) {
                return cls.identity;
            } else if (args.length === 1) {
                return args[0];
            }
            // eslint-disable-next-line no-unused-vars
            const [c_part, nc_part, order_symbols] = this.flatten(args);
            const is_commutative: boolean = nc_part.length === 0;
            let obj: any = this._from_args(cls, is_commutative, ...c_part.concat(nc_part));
            obj = this._exec_constructor_postprocessors(obj);
            // !!! order symbols not yet implemented
            return obj;
        }
    }

    _from_args(cls: any, is_commutative: any, ...args: any) {
        /* "Create new instance with already-processed args.
        If the args are not in canonical order, then a non-canonical
        result will be returned, so use with caution. The order of
        args may change if the sign of the args is changed. */
        if (args.length === 0) {
            return cls.identity;
        } else if (args.length === 1) {
            return args[0];
        }
        // eslint-disable-next-line new-cap
        const obj: any = new cls(true, false, ...args);
        if (typeof is_commutative === "undefined") {
            const input: any[] = [];
            for (const a of args) {
                input.push(a.is_commutative());
            }
            is_commutative = fuzzy_and(input);
        }
        obj.is_commutative = () => is_commutative;
        return obj;
    }

    _new_rawargs(reeval: boolean, ...args: any) {
        let is_commutative;
        if (reeval && this.is_commutative === false) {
            is_commutative = undefined;
        } else {
            is_commutative = this.is_commutative;
        }
        return this._from_args(this.constructor, is_commutative, ...args);
    }

    static make_args(cls: any, expr: any) {
        if (expr instanceof cls) {
            return expr._args;
        } else {
            return [expr];
        }
    }
};

const _AssocOp = AssocOp(Object)

// eslint-disable-next-line new-cap
ManagedProperties.register(_AssocOp);

export {AssocOp, _AssocOp};
