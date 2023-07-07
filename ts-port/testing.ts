import {Add} from "../ts-port/core/add";
import {Mul} from "../ts-port/core/mul";
import {_Number_, Rational} from "../ts-port/core/numbers";
import {Pow} from "../ts-port/core/power";
import {_Expr} from "../ts-port/core/expr";
import {Util} from "../ts-port/core/utility";
import {S} from "../ts-port/core/singleton";
import {Symbol} from "../ts-port/core/symbol";
import {Eq, Ne, Gt, Lt, Ge, Le, is_eq, is_ge} from "../ts-port/core/relational";
import { nsimplify } from "./simplify/simplify";
import { Basic, _Basic } from "./core/basic";
import { _simple_dens } from "./solvers/solvers";
import { Derivative } from "./core/function";

const f = _Number_.new(1.5)
const n = _Number_.new(2)
const r = _Number_.new(-2, 3)
const x = new Symbol("x");
const y =  new Symbol("y");
const addexpr1 = new Add(true, true, x, f, y);
const addexpr2 = new Add(true, true, x, x, y, n, r);
const mulexpr1 = new Mul(true, true, x, f);
const mulexpr2 = new Mul(true, true, x, y, n);


console.log(mulexpr2.isinstance(Derivative))