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

console.log(new Mul(true, true, n, n2, n3, x).toString());


// // Addition

// // Basic evaluated add
// console.log(new Add(true, true, n, n2).toString());
// // Basic evaluated add with variable
// console.log(new Add(true, true, n, n2, x).toString());
// // Basic evaluated add with subtraction
// console.log(new Add(true, true, n, n3, x).toString());
// // Add without eval
// console.log(new Add(false, true, n, n2, x).toString());
// // Combine coeffs and convert to mul
// console.log(new Add(true, true, x, x, x).toString());
// // Add with nested add
// console.log(new Add(true, true, x, x, new Add(true, true, n, n2, x)).toString());
// // Add with nested mul
// console.log(new Add(true, true, x, new Mul(true, true, n, x)).toString());
// // Add with nested pow
// console.log(new Add(true, true, x, new Pow(n, x)).toString());


// // Multiplication

// // Basic evaluated mul
// console.log(new Mul(true, true, n, n2, x).toString());
// // Basic division
// console.log(new Mul(true, true, n, _Number_.new(1, 2)).toString());
// // Mul without eval
// console.log(new Mul(false, true, n, n2, x).toString());
// // Combine coeffs and convert to pow
// console.log(new Mul(true, true, x, x, x).toString());
// // Nested muls
// console.log(new Mul(true, true, x, x, new Mul(true, true, n, n2, x)).toString());
// // Mul with pow
// console.log(new Mul(true, true, x, new Pow(n, x)).toString());
// // Multiply pow expressions (combine exponents)
// console.log(new Mul(true, true, new Pow(n, x), new Pow(n, x)).toString());
// // distributive property
// console.log(new Mul(true, true, n, new Add(true, true, x, n)).toString())

// // Exponentials

// // Basic pow
// console.log(new Pow(n, n).toString());
// // Unevaluated pow with symbol
// console.log(new Pow(n, x).toString());
// // Simplify int raised to rational
// console.log(new Pow(n, n2).toString());


/*
// // Substitution

// console.log(new Pow(n, x).subs(x, n4).toString());
// console.log(new Mul(false, true, n, n2, x).subs(x, n2).toString());
// console.log(new Add(false, true, n, n2, x).subs(x, n).toString());

// // Factoring

// // Factor a big integer
// const bigint = _Number_.new(285);
// console.log(factorint(bigint));
// // Factor a complicated rational
// const bigrat = _Number_.new(271, 932);
// console.log(factorrat(bigrat));

// Testing weird inputs

// NOTE: Pow(n, S.NegativeInfinity) is not currently supported - _eval_power needs
// to be added and debugged for S.Infinity, S.NegativeInfinity, and S.NegativeOne

console.log(new Mul(true, true, S.ComplexInfinity, S.NegativeInfinity, x).toString());
console.log(new Mul(true, true, S.Infinity, n2, x).toString()); 
console.log(new Add(true, true, S.Infinity, n2, x).toString()); 
console.log(new Add(true, true, S.ComplexInfinity, n3, x).toString()); // DOESNT WORK
console.log(new Pow(n, S.NaN).toString());
*/
