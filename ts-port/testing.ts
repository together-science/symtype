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

console.log(new Pow(n, n2));
/*
// Addition

// Basic evaluated add
console.log(new Add(true, true, n, n2, x));
// Add without eval
console.log(new Add(false, true, n, n2, x));
// Combine coeffs and convert to mul
console.log(new Add(true, true, x, x, x));
// Add with nested add
console.log(new Add(true, true, x, x, new Add(true, true, n, n2, x)));
// Add with nested mul
console.log(new Add(true, true, x, new Mul(true, true, n, x)));

// Multiplication

// Basic evaluated mul
console.log(new Mul(true, true, n, n2, x));
// Mul without eval
console.log(new Mul(false, true, n, n2, x));
// Combine coeffs and convert to pow
console.log(new Mul(true, true, x, x, x));
// Nested muls
console.log(new Mul(true, true, x, x, new Mul(true, true, n, n2, x)));
// Nested mul with pow
console.log(new Mul(true, true, x, new Pow(n, x)));
// Mul pow expressions (combine exponents)
console.log(new Mul(true, true, new Pow(n, x), new Pow(n, x)));

// Exponentials

// Basic pow
console.log(new Pow(n, n));
// Unevaluated pow with symbol
console.log(new Pow(n, x));
// Simplify int raised to rational
console.log(new Pow(n, n2));
// Simplify negative float raised to rational
console.log(new Pow(n3, n4));

// Substitution

console.log(new Pow(n, x).subs(x, n4));
console.log(new Mul(false, true, n, n2, x).subs(x, n2));
console.log(new Add(false, true, n, n2, x).subs(x, n));

// Factoring

// Factor a big integer
const bigint = _Number_.new(285);
console.log(factorint(bigint));
// Factor a complicated rational
const bigrat = _Number_.new(271, 932);
console.log(factorrat(bigrat));

// Testing weird inputs

// NOTE: Pow(n, S.NegativeInfinity) is not currently supported - _eval_power needs
// to be added and debugged for S.Infinity, S.NegativeInfinity, and S.NegativeOne

console.log(new Mul(true, true, S.ComplexInfinity, S.NegativeInfinity, x));
console.log(new Mul(true, true, S.Infinity, n2, x));
console.log(new Pow(n, S.NaN));
*/