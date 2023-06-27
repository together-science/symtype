import {Add} from "../ts-port/core/add";
import {Mul} from "../ts-port/core/mul";
import {_Number_} from "../ts-port/core/numbers";
import {Pow} from "../ts-port/core/power";
import {S} from "../ts-port/core/singleton";
import {_Expr, _AtomicExpr} from "../ts-port/core/expr";
import {is_gt, is_ge} from "../ts-port/core/relational";

console.log(new Pow(_Number_.new(1, 5), S.NegativeInfinity).toString());