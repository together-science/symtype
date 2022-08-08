import {Add} from "./add.js";
import {_Number_} from "./numbers.js";
import {Symbol} from "./symbol.js";

const n1 = _Number_.new(2);
const n2 = _Number_.new(3);
const x = new Symbol("x");
console.log(new Add(true, true, n1, n1, n2, x, x, x));
