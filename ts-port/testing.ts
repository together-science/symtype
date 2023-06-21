import {S} from "./core/singleton.js";
import {_Number_, Integer} from "./core/numbers.js";

const n = _Number_.new(3)
console.log(n._assumptions)
console.log(n.is_even())
console.log(n._assumptions)
console.log(S.Infinity.is_finite())
console.log(S.Infinity.is_Pow())