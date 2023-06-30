import {Add} from "../ts-port/core/add";
import {Mul} from "../ts-port/core/mul";
import {_Number_, igcdex} from "../ts-port/core/numbers";
import {Pow} from "../ts-port/core/power";
import {S} from "../ts-port/core/singleton";
import {Symbol} from "../ts-port/core/symbol";
import {_Expr, _AtomicExpr} from "../ts-port/core/expr";
import {Eq, Ne, Gt, Lt, Ge, Le} from "../ts-port/core/relational";


const x: any = new Symbol("x")
const n = _Number_.new(2);
const lhs = _Number_.new(2.5);
const rhs = new Add(true, true, new Mul(true, true, x, n), n)

console.log(Eq.new(lhs, rhs).toString())

// console.log(Eq.new(x, n).toString())
// console.log(Eq.new(n2, n).toString())

// console.log(Ne.new(x, n).toString())
// console.log(Ne.new(n2, n).toString())

// console.log(Gt.new(x, n).toString())
// console.log(Gt.new(n2, n).toString())

// console.log(Ge.new(x, n).toString())
// console.log(Ge.new(n2, n).toString())

// console.log(Lt.new(x, n).toString())
// console.log(Lt.new(n2, n).toString())

// console.log(Le.new(x, n).toString())
// console.log(Le.new(n2, n).toString())

const a: any = new Symbol("a", {"commutative": false})
const b: any = new Symbol("b", {"commutative": false})
console.log(new Mul(true, true, a, b))
// console.log(Eq.new(new Mul(true, true, a, b), new Mul(true, true, b, a)))
