import { factorint, factorrat } from "./ntheory/factor_.js";
import { Add } from "./core/add.js";
import { Mul } from "./core/mul.js";
import { _Number_ } from "./core/numbers.js";
import { Pow } from "./core/power.js";
import { S } from "./core/singleton.js";
import { Symbol } from "./core/symbol.js";
let n = _Number_.new(4);
let x = new Symbol("x");
x = new Add(true, true, n, n, x);
x = new Mul(true, true, n, n, x);
x = new Pow(n, n);
const bigint = _Number_.new(285);
x = factorint(bigint);
const bigrat = _Number_.new(271, 932);
x = factorrat(bigrat);
x = new Pow(n, S.NaN);
//# sourceMappingURL=symtype.js.map