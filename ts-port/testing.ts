import {factorint, factorrat} from "./ntheory/factor_.js";
import {Add} from "./core/add.js";
import {Mul} from "./core/mul.js";
import {_Number_, Integer} from "./core/numbers.js";
import {Util} from "./core/utility.js";
import {Pow} from "./core/power.js";
import {S} from "./core/singleton.js";
import {Symbol} from "./core/symbol.js";


// Define integers, rationals, floats, and symbols
const n = _Number_.new(4);
const n2 = _Number_.new(4, 9);
const n3 = _Number_.new(-1.5);
const n4 = _Number_.new(1, 3);
const x = new Symbol("x");


const bigint = _Number_.new(285);
console.log(factorint(bigint).factorsToString());
// Factor a complicated rational
const bigrat = _Number_.new(271, 932);
console.log(factorrat(bigrat).factorsToString());


/*
// // Substitution

// console.log(new Pow(n, x).subs(x, n4).toString());
// console.log(new Mul(false, true, n, n2, x).subs(x, n2).toString());
// console.log(new Add(false, true, n, n2, x).subs(x, n).toString());

// // Factoring



// Testing weird inputs

// NOTE: Pow(n, S.NegativeInfinity) is not currently supported - _eval_power needs
// to be added and debugged for S.Infinity, S.NegativeInfinity, and S.NegativeOne

console.log(new Mul(true, true, S.ComplexInfinity, S.NegativeInfinity, x).toString());
console.log(new Mul(true, true, S.Infinity, n2, x).toString()); 
console.log(new Add(true, true, S.Infinity, n2, x).toString()); 
console.log(new Add(true, true, S.ComplexInfinity, n3, x).toString()); // DOESNT WORK
console.log(new Pow(n, S.NaN).toString());
*/
