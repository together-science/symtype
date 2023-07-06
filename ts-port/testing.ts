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

const x = new Symbol("x");
const n = _Number_.new(2.6804)
const mexpr = nsimplify(new Mul(true, true, n, x));
console.log(_simple_dens(mexpr));