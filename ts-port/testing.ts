import {Add} from "../ts-port/core/add";
import {Mul} from "../ts-port/core/mul";
import {_Number_} from "../ts-port/core/numbers";
import {Pow} from "../ts-port/core/power";
import {S} from "../ts-port/core/singleton";
import {Symbol} from "../ts-port/core/symbol";
import {Eq, Ne, Gt, Lt, Ge, Le, is_eq, is_ge} from "../ts-port/core/relational";

const f = _Number_.new(1.5)
const n = _Number_.new(2)
const r = _Number_.new(-2, 3)
const x = new Symbol("x");

// console.log(Ge.new(new Add(true, true, x, r), n).toString());
console.log(new Add(true, true, x, r).is_scalar())