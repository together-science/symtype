import {Add} from "../ts-port/core/add";
import {Mul} from "../ts-port/core/mul";
import {_Number_} from "../ts-port/core/numbers";
import {Pow} from "../ts-port/core/power";
import {_Expr} from "../ts-port/core/expr";
import {Util} from "../ts-port/core/utility";
import {S} from "../ts-port/core/singleton";
import {Symbol} from "../ts-port/core/symbol";
import {Eq, Ne, Gt, Lt, Ge, Le, is_eq, is_ge} from "../ts-port/core/relational";

const x = new Symbol("x");
const n = _Number_.new(2)


const l = new Add(true, true, x, x, n)
const r = _Number_.new(38, 3904);
const eexpr = Eq.new(l, r)
console.log(eexpr.toString())
console.log(eexpr.rewrite(Add).toString())