import {Add} from "../ts-port/core/add";
import {Mul} from "../ts-port/core/mul";
import {_Number_} from "../ts-port/core/numbers";
import {Pow} from "../ts-port/core/power";
import {S} from "../ts-port/core/singleton";
import {Symbol} from "../ts-port/core/symbol";
import {_Expr, _AtomicExpr} from "../ts-port/core/expr";
import {is_gt, is_ge} from "../ts-port/core/relational";

const n = _Number_.new(2);
const n2 = _Number_.new(4);
const x: any = new Symbol("x")
const a = new Add(true, true); 


console.log(new Pow(new Pow(x, new Add(true, true, x, n)), n).toString());
console.log(new Mul(true, true, n, x).__truediv__(new Mul(true, true, n, x)).toString());
console.log(new Mul(true, true, n, x).__truediv__(new Mul(true, true, n, x)).toString());
console.log(new Pow(n, x).__truediv__(new Pow(n, x)).toString());
console.log(new Mul(true, true, new Mul(true, true, x, n), new Mul(true, true, x, n2)).toString());