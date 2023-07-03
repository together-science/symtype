import {Add} from "../ts-port/core/add";
import {Mul} from "../ts-port/core/mul";
import {_Number_} from "../ts-port/core/numbers";
import {Pow} from "../ts-port/core/power";
import {_Expr} from "../ts-port/core/expr";
import {Util} from "../ts-port/core/utility";
import {S} from "../ts-port/core/singleton";
import {Symbol} from "../ts-port/core/symbol";
import {Eq, Ne, Gt, Lt, Ge, Le, is_eq, is_ge} from "../ts-port/core/relational";


// it tracks supers correctly
console.log(Symbol.supers)
// it fails with naming
console.log(_Expr.supers)
console.log(new Add(true, true).isinstance(_Expr))
console.log(S.Zero.isinstance(_Expr))
console.log(S.Zero.isinstance(_Number_))