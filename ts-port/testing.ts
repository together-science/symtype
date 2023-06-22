import {Add} from "../ts-port/core/add";
import {Mul} from "../ts-port/core/mul";
import {_Number_} from "../ts-port/core/numbers";
import {Pow} from "../ts-port/core/power";
import {S} from "../ts-port/core/singleton";
import {Symbol} from "../ts-port/core/symbol";
import {factorint, factorrat} from "../ts-port/ntheory/factor_";

const n = _Number_.new(2)
const x = new Symbol("x");

console.log("\n ADD \n")

// Testing add
console.log(new Add(true, true, n, x, S.ComplexInfinity).toString())
console.log(new Add(true, true, n, x, S.Infinity).toString())
console.log(new Add(true, true, n, x, S.NegativeInfinity).toString())
console.log(new Add(true, true, n, x, S.Infinity, S.NegativeInfinity).toString())
console.log(new Add(true, true, n, x, S.ComplexInfinity, S.Infinity).toString())
console.log(new Add(true, true, n, x, S.NaN, S.Infinity).toString())

console.log("\n MUL \n")

// Testing mul
console.log(new Mul(true, true, n, x, S.ComplexInfinity).toString())
console.log(new Mul(true, true, n, x, S.Infinity).toString())
console.log(new Mul(true, true, n, x, S.NegativeInfinity).toString())
console.log(new Mul(true, true, n, x, S.Infinity, S.NegativeInfinity).toString())
console.log(new Mul(true, true, n, x, S.ComplexInfinity, S.Infinity).toString())
console.log(new Mul(true, true, n, x, S.NaN, S.Infinity).toString())

console.log("\n POW \n")

// Testing Pow
console.log(new Pow(n, S.ComplexInfinity).toString()) // good
console.log(new Pow(n, S.Infinity).toString()) // good
console.log(new Pow(n, S.NaN).toString()) // good
console.log(new Pow(n, S.ComplexInfinity, S.Infinity).toString()) // good
console.log(new Pow(n, S.NaN, S.Infinity).toString()) // good
