import {Add} from "../ts-port/core/add";
import {Mul} from "../ts-port/core/mul";
import {_Number_} from "../ts-port/core/numbers";
import {Pow} from "../ts-port/core/power";
import {S} from "../ts-port/core/singleton";
import {Symbol} from "../ts-port/core/symbol";
import {factorint, factorrat} from "../ts-port/ntheory/factor_";

const r1 = _Number_.new(2, 3)
const r2 = _Number_.new(3, 4)

// Testing Pow
console.log(new Pow(r1, r2).toString())