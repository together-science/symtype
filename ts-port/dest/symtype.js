(() => {
  // ts-port/core/utility.ts
  var Util = class {
    static hashKey(x2) {
      if (typeof x2 === "undefined") {
        return "undefined";
      }
      if (x2.hashKey) {
        return x2.hashKey();
      }
      if (Array.isArray(x2)) {
        return x2.map((e) => Util.hashKey(e)).join(",");
      }
      if (x2 === null) {
        return "null";
      }
      return x2.toString();
    }
    static isSubset(arr1, arr2) {
      const temparr = arr2.map((i) => Util.hashKey(i));
      for (const e of arr1) {
        if (!temparr.includes(Util.hashKey(e))) {
          return false;
        }
      }
      return true;
    }
    static bin(num) {
      return (num >>> 0).toString(2);
    }
    static *product(repeat = 1, ...args) {
      const toAdd = [];
      for (const a of args) {
        toAdd.push([a]);
      }
      const pools = [];
      for (let i = 0; i < repeat; i++) {
        toAdd.forEach((e) => pools.push(e[0]));
      }
      let res = [[]];
      for (const pool of pools) {
        const res_temp = [];
        for (const x2 of res) {
          for (const y of pool) {
            if (typeof x2[0] === "undefined") {
              res_temp.push([y]);
            } else {
              res_temp.push(x2.concat(y));
            }
          }
        }
        res = res_temp;
      }
      for (const prod of res) {
        yield prod;
      }
    }
    static *permutations(iterable, r = void 0) {
      const n2 = iterable.length;
      if (typeof r === "undefined") {
        r = n2;
      }
      const range = this.range(n2);
      for (const indices of Util.product(r, range)) {
        if (indices.length === r) {
          const y = [];
          for (const i of indices) {
            y.push(iterable[i]);
          }
          yield y;
        }
      }
    }
    static *from_iterable(iterables) {
      for (const it of iterables) {
        for (const element of it) {
          yield element;
        }
      }
    }
    static arrEq(arr1, arr2) {
      if (arr1.length !== arr2.length) {
        return false;
      }
      for (let i = 0; i < arr1.length; i++) {
        if (!(arr1[i] === arr2[i])) {
          return false;
        }
      }
      return true;
    }
    static *combinations(iterable, r) {
      const n2 = iterable.length;
      const range = this.range(n2);
      for (const indices of Util.permutations(range, r)) {
        if (Util.arrEq(indices.sort(function(a, b) {
          return a - b;
        }), indices)) {
          const res = [];
          for (const i of indices) {
            res.push(iterable[i]);
          }
          yield res;
        }
      }
    }
    static *combinations_with_replacement(iterable, r) {
      const n2 = iterable.length;
      const range = this.range(n2);
      for (const indices of Util.product(r, range)) {
        if (Util.arrEq(indices.sort(function(a, b) {
          return a - b;
        }), indices)) {
          const res = [];
          for (const i of indices) {
            res.push(iterable[i]);
          }
          yield res;
        }
      }
    }
    static zip(arr1, arr2, fillvalue = "-") {
      const res = arr1.map(function(e, i) {
        return [e, arr2[i]];
      });
      res.forEach((zip) => {
        if (zip.includes(void 0)) {
          zip.splice(1, 1, fillvalue);
        }
      });
      return res;
    }
    static range(n2) {
      return new Array(n2).fill(0).map((_, idx) => idx);
    }
    static getArrIndex(arr2d, arr) {
      for (let i = 0; i < arr2d.length; i++) {
        if (Util.arrEq(arr2d[i], arr)) {
          return i;
        }
      }
      return void 0;
    }
    static getSupers(cls) {
      const sprs = [];
      const supercls = Object.getPrototypeOf(cls);
      if (supercls !== Object.prototype && supercls !== null) {
        sprs.push(supercls);
        const parents = Util.getSupers(supercls);
        sprs.push(...parents);
      }
      return sprs;
    }
    static shuffleArray(arr) {
      for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        const temp = arr[i];
        arr[i] = arr[j];
        arr[j] = temp;
      }
    }
    static arrMul(arr, n2) {
      const res = [];
      for (let i = 0; i < n2; i++) {
        res.push(arr);
      }
      return res;
    }
    static assignElements(arr, newvals, start, step) {
      let count = 0;
      for (let i = start; i < arr.length; i += step) {
        arr[i] = newvals[count];
        count++;
      }
    }
    static splitLogicStr(s) {
      const match = s.match(/^(.+?)\s+(.+?)\s+(.*)/);
      return match == null ? void 0 : match.slice(1);
    }
  };
  var HashSet = class {
    constructor(arr) {
      this.size = 0;
      this.dict = {};
      if (arr) {
        Array.from(arr).forEach((element) => {
          this.add(element);
        });
      }
    }
    clone() {
      const newset = new HashSet();
      for (const item of Object.values(this.dict)) {
        newset.add(item);
      }
      return newset;
    }
    encode(item) {
      return Util.hashKey(item);
    }
    add(item) {
      const key = this.encode(item);
      if (!(key in this.dict)) {
        this.size++;
      }
      ;
      this.dict[key] = item;
    }
    addArr(arr) {
      for (const e of arr) {
        this.add(e);
      }
    }
    has(item) {
      return this.encode(item) in this.dict;
    }
    toArray() {
      return Object.values(this.dict);
    }
    hashKey() {
      return this.toArray().map((e) => Util.hashKey(e)).sort().join(",");
    }
    isEmpty() {
      return this.size === 0;
    }
    remove(item) {
      this.size--;
      delete this.dict[this.encode(item)];
    }
    get(key) {
      return this.dict[Util.hashKey(key)];
    }
    set(key, val) {
      this.dict[Util.hashKey(key)] = val;
    }
    sort(keyfunc = (a, b) => a - b, reverse = true) {
      this.sortedArr = this.toArray();
      this.sortedArr.sort(keyfunc);
      if (reverse) {
        this.sortedArr.reverse();
      }
    }
    pop() {
      this.sort();
      if (this.sortedArr.length >= 1) {
        const temp = this.sortedArr[this.sortedArr.length - 1];
        this.remove(temp);
        return temp;
      } else {
        return void 0;
      }
    }
    difference(other) {
      const res = new HashSet();
      for (const i of this.toArray()) {
        if (!other.has(i)) {
          res.add(i);
        }
      }
      return res;
    }
    intersects(other) {
      for (const i of this.toArray()) {
        if (other.has(i)) {
          return true;
        }
      }
      return false;
    }
  };
  var HashDict = class {
    constructor(d = {}) {
      this.size = 0;
      this.dict = {};
      for (const item of Object.entries(d)) {
        this.dict[Util.hashKey(item[0])] = [item[0], item[1]];
      }
    }
    clone() {
      return new HashDict(this.dict);
    }
    remove(item) {
      this.size--;
      delete this.dict[Util.hashKey(item)];
    }
    setdefault(key, value) {
      if (this.has(key)) {
        return this.get(key);
      } else {
        this.add(key, value);
        return this.get(key);
      }
    }
    get(key, def = void 0) {
      const hash = Util.hashKey(key);
      if (hash in this.dict) {
        return this.dict[hash][1];
      }
      return def;
    }
    has(key) {
      const hashKey = Util.hashKey(key);
      return hashKey in this.dict;
    }
    add(key, value) {
      const keyHash = Util.hashKey(key);
      if (!(keyHash in Object.keys(this.dict))) {
        this.size++;
      }
      this.dict[keyHash] = [key, value];
    }
    keys() {
      const vals = Object.values(this.dict);
      return vals.map((e) => e[0]);
    }
    values() {
      const vals = Object.values(this.dict);
      return vals.map((e) => e[1]);
    }
    entries() {
      return Object.values(this.dict);
    }
    addArr(arr) {
      const keyHash = Util.hashKey(arr[0]);
      this.dict[keyHash] = arr;
    }
    delete(key) {
      const keyhash = Util.hashKey(key);
      if (keyhash in this.dict) {
        this.size--;
        delete this.dict[keyhash];
      }
    }
    merge(other) {
      for (const item of other.entries()) {
        this.add(item[0], item[1]);
      }
    }
    copy() {
      const res = new HashDict();
      for (const item of this.entries()) {
        res.add(item[0], item[1]);
      }
      return res;
    }
    isSame(other) {
      const arr1 = this.entries().sort();
      const arr2 = other.entries().sort();
      for (let i = 0; i < arr1.length; i++) {
        if (!Util.arrEq(arr1[i], arr2[i])) {
          return false;
        }
      }
      return true;
    }
    factorsToString() {
      let numerator = "";
      let denominator = "";
      for (const [factor, exp2] of this.entries()) {
        for (let i = 0; i < Math.abs(exp2); i++) {
          if (exp2 < 0) {
            denominator += factor.toString() + "*";
          } else {
            numerator += factor.toString() + "*";
          }
        }
      }
      if (denominator.length == 0) {
        return numerator.slice(0, -1);
      } else {
        return numerator.slice(0, -1) + "/" + denominator.slice(0, -1);
      }
    }
  };
  var SetDefaultDict = class extends HashDict {
    constructor() {
      super();
    }
    get(key) {
      const keyHash = Util.hashKey(key);
      if (keyHash in this.dict) {
        return this.dict[keyHash][1];
      }
      return new HashSet();
    }
  };
  var ArrDefaultDict = class extends HashDict {
    constructor() {
      super();
    }
    get(key) {
      const keyHash = Util.hashKey(key);
      if (keyHash in this.dict) {
        return this.dict[keyHash][1];
      }
      return [];
    }
  };
  var Implication = class {
    constructor(p, q) {
      this.p = p;
      this.q = q;
    }
    hashKey() {
      return this.p + this.q;
    }
  };
  var MixinBuilder = class {
    constructor(superclass) {
      this.superclass = superclass;
    }
    with(...mixins) {
      return mixins.reduce((c, mixin) => mixin(c), this.superclass);
    }
  };
  var base = class {
  };
  var mix = (superclass) => new MixinBuilder(superclass);

  // ts-port/core/logic.ts
  function _fuzzy_group(args, quick_exit = false) {
    let saw_other = false;
    for (const a of args) {
      if (a) {
        continue;
      }
      if (typeof a === "undefined") {
        return void 0;
      }
      if (quick_exit && saw_other) {
        return void 0;
      }
      saw_other = true;
    }
    if (saw_other) {
      return false;
    }
    return true;
  }
  function fuzzy_bool(x2) {
    if (typeof x2 === "undefined") {
      return void 0;
    }
    if (x2) {
      return true;
    }
    if (!x2) {
      return false;
    }
  }
  function fuzzy_and(args) {
    let rv = true;
    for (let ai of args) {
      ai = fuzzy_bool(ai);
      if (!ai) {
        return false;
      }
      if (rv) {
        rv = ai;
      }
    }
    return rv;
  }
  function fuzzy_not(v) {
    if (typeof v === "undefined") {
      return v;
    } else if (v) {
      return false;
    }
    return true;
  }
  var _Logic = class {
    constructor(...args) {
      this.args = args.flat();
    }
    _eval_propagate_not() {
      throw new Error("Eval propagate not is abstract in Logic");
    }
    expand() {
      throw new Error("Expand is abstract in Logic");
    }
    static __new__(cls, ...args) {
      if (cls === Not) {
        return new Not(args[0]);
      } else if (cls === And) {
        return new And(args);
      } else if (cls === Or) {
        return new Or(args);
      }
    }
    get_op_x_notx() {
      return void 0;
    }
    hashKey() {
      return this.toString();
    }
    toString() {
      return "Logic " + this.args.toString();
    }
    getNewArgs() {
      return this.args;
    }
    static equals(a, b) {
      if (!(b instanceof a.constructor)) {
        return false;
      } else {
        if (a.args == b.args) {
          return true;
        }
        return false;
      }
    }
    static notEquals(a, b) {
      if (!(b instanceof a.constructor)) {
        return true;
      } else {
        if (a.args == b.args) {
          return false;
        }
        return true;
      }
    }
    lessThan(other) {
      if (this.compare(other) == -1) {
        return true;
      }
      return false;
    }
    compare(other) {
      let a;
      let b;
      if (typeof this != typeof other) {
        const unkSelf = this.constructor;
        const unkOther = other.constructor;
        a = unkSelf;
        b = unkOther;
      } else {
        a = this.args;
        b = other.args;
      }
      if (a > b) {
        return 1;
      } else {
        return 0;
      }
    }
    static fromstring(text) {
      let lexpr = null;
      let schedop = null;
      for (const term of text.split(" ")) {
        let flexTerm = term;
        if ("&|".includes(flexTerm)) {
          if (schedop != null) {
            throw new Error("double op forbidden " + flexTerm + " " + schedop);
          }
          if (lexpr == null) {
            throw new Error(flexTerm + " cannot be in the beginning of expression");
          }
          schedop = flexTerm;
          continue;
        }
        if (flexTerm.includes("|") || flexTerm.includes("&")) {
          throw new Error("& and | must have space around them");
        }
        if (flexTerm[0] == "!") {
          if (flexTerm.length == 1) {
            throw new Error("do not include space after !");
          }
          flexTerm = Not.New(flexTerm.substring(1));
        }
        if (schedop) {
          const op = _Logic.op_2class[schedop];
          lexpr = op(lexpr, flexTerm);
          schedop = null;
          continue;
        }
        if (lexpr != null) {
          throw new Error("missing op between " + lexpr + " and " + flexTerm);
        }
        lexpr = flexTerm;
      }
      if (schedop != null) {
        throw new Error("premature end-of-expression in " + text);
      }
      if (lexpr == null) {
        throw new Error(text + " is empty");
      }
      return lexpr;
    }
  };
  var Logic = _Logic;
  Logic.op_2class = {
    "&": (...args) => {
      return And.New(...args);
    },
    "|": (...args) => {
      return Or.New(...args);
    },
    "!": (arg) => {
      return Not.New(arg);
    }
  };
  var AndOr_Base = class extends Logic {
    static __new__(cls, op_x_notx, ...args) {
      const bargs = [];
      for (const a of args) {
        if (a === op_x_notx) {
          return a;
        } else if (a === !op_x_notx) {
          continue;
        }
        bargs.push(a);
      }
      args = new HashSet(AndOr_Base.flatten(bargs)).toArray().sort(
        (a, b) => Util.hashKey(a).localeCompare(Util.hashKey(b))
      );
      const args_set = new HashSet(args);
      for (const a of args) {
        if (args_set.has(Not.New(a))) {
          return op_x_notx;
        }
      }
      if (args.length == 1) {
        return args.pop();
      } else if (args.length == 0) {
        if (op_x_notx) {
          return false;
        }
        return true;
      }
      return super.__new__(cls, ...args);
    }
    static flatten(args) {
      const args_queue = args;
      const res = [];
      while (args_queue.length > 0) {
        const arg = args_queue.pop();
        if (arg instanceof Logic) {
          if (arg instanceof this) {
            args_queue.push(...arg.args);
            continue;
          }
        }
        res.push(arg);
      }
      return res;
    }
  };
  var And = class extends AndOr_Base {
    static New(...args) {
      return super.__new__(And, false, ...args);
    }
    _eval_propagate_not() {
      const param = [];
      for (const a of param) {
        param.push(Not.New(a));
      }
      return Or.New(...param);
    }
    expand() {
      for (let i = 0; i < this.args.length; i++) {
        const arg = this.args[i];
        if (arg instanceof Or) {
          const arest = [...this.args].splice(i, 1);
          const orterms = arg.args.map((e) => And.New(...arest.concat([e])));
          for (let j = 0; j < orterms.length; j++) {
            if (orterms[j] instanceof Logic) {
              orterms[j] = orterms[j].expand();
            }
          }
          const res = Or.New(...orterms);
          return res;
        }
      }
      return this;
    }
  };
  var Or = class extends AndOr_Base {
    static New(...args) {
      return super.__new__(Or, true, ...args);
    }
    _eval_propagate_not() {
      const param = [];
      for (const a of param) {
        param.push(Not.New(a));
      }
      return And.New(...param);
    }
  };
  var Not = class extends Logic {
    static New(args) {
      return Not.__new__(Not, args);
    }
    static __new__(cls, arg) {
      if (typeof arg === "string") {
        return super.__new__(cls, arg);
      } else if (arg === true) {
        return false;
      } else if (arg === false) {
        return true;
      } else if (arg instanceof Not) {
        return arg.args[0];
      } else if (arg instanceof Logic) {
        arg = arg._eval_propagate_not();
        return arg;
      } else {
        throw new Error("Not: unknown argument " + arg);
      }
    }
    arg() {
      return this.args[0];
    }
  };

  // ts-port/core/facts.ts
  function _base_fact(atom) {
    if (atom instanceof Not) {
      return atom.arg();
    } else {
      return atom;
    }
  }
  function _as_pair(atom) {
    if (atom instanceof Not) {
      return new Implication(atom.arg(), false);
    } else {
      return new Implication(atom, true);
    }
  }
  function transitive_closure(implications) {
    let temp = new Array();
    for (const impl of implications) {
      temp.push(impl.p);
      temp.push(impl.q);
    }
    temp = temp.flat();
    const full_implications = new HashSet(implications);
    const literals = new HashSet(temp);
    for (const k of literals.toArray()) {
      for (const i of literals.toArray()) {
        if (full_implications.has(new Implication(i, k))) {
          for (const j of literals.toArray()) {
            if (full_implications.has(new Implication(k, j))) {
              full_implications.add(new Implication(i, j));
            }
          }
        }
      }
    }
    return full_implications;
  }
  function deduce_alpha_implications(implications) {
    const new_arr = [];
    for (const impl of implications) {
      new_arr.push(new Implication(Not.New(impl.q), Not.New(impl.p)));
    }
    implications = implications.concat(new_arr);
    const res = new SetDefaultDict();
    const full_implications = transitive_closure(implications);
    for (const impl of full_implications.toArray()) {
      if (impl.p === impl.q) {
        continue;
      }
      const currSet = res.get(impl.p);
      currSet.add(impl.q);
      res.add(impl.p, currSet);
    }
    for (const item of res.entries()) {
      const a = item[0];
      const impl = item[1];
      impl.remove(a);
      const na = Not.New(a);
      if (impl.has(na)) {
        throw new Error("implications are inconsistent: " + a + " -> " + na + " " + impl);
      }
    }
    return res;
  }
  function apply_beta_to_alpha_route(alpha_implications, beta_rules) {
    const x_impl = new HashDict();
    for (const x2 of alpha_implications.keys()) {
      const newset = new HashSet();
      newset.addArr(alpha_implications.get(x2).toArray());
      const imp = new Implication(newset, []);
      x_impl.add(x2, imp);
    }
    for (const item of beta_rules) {
      const bcond = item.p;
      for (const bk of bcond.args) {
        if (x_impl.has(bk)) {
          continue;
        }
        const imp = new Implication(new HashSet(), []);
        x_impl.add(bk, imp);
      }
    }
    let seen_static_extension = true;
    while (seen_static_extension) {
      seen_static_extension = false;
      for (const impl of beta_rules) {
        const bcond = impl.p;
        const bimpl = impl.q;
        if (!(bcond instanceof And)) {
          throw new Error("Cond is not And");
        }
        const bargs = new HashSet(bcond.args);
        for (const item of x_impl.entries()) {
          const x2 = item[0];
          const impl2 = item[1];
          let ximpls = impl2.p;
          const x_all = ximpls.clone();
          x_all.add(x2);
          if (!x_all.has(bimpl) && Util.isSubset(bargs.toArray(), x_all.toArray())) {
            ximpls.add(bimpl);
            const bimpl_impl = x_impl.get(bimpl);
            if (bimpl_impl != null) {
              ximpls |= bimpl_impl[0];
            }
            seen_static_extension = true;
          }
        }
      }
    }
    for (let bidx = 0; bidx < beta_rules.length; bidx++) {
      const impl = beta_rules[bidx];
      const bcond = impl.p;
      const bimpl = impl.q;
      const bargs = new HashSet(bcond.args);
      for (const item of x_impl.entries()) {
        const x2 = item[0];
        const value = item[1];
        const ximpls = value.p;
        const bb = value.q;
        const x_all = ximpls.clone();
        x_all.add(x2);
        if (x_all.has(bimpl)) {
          continue;
        }
        if (x_all.toArray().some((e) => bargs.has(Not.New(e)) || Util.hashKey(Not.New(e)) === Util.hashKey(bimpl))) {
          continue;
        }
        if (bargs.intersects(x_all)) {
          bb.push(bidx);
        }
      }
    }
    return x_impl;
  }
  function rules_2prereq(rules) {
    const prereq = new SetDefaultDict();
    for (const item of rules.entries()) {
      let a = item[0].p;
      const impl = item[1];
      if (a instanceof Not) {
        a = a.args[0];
      }
      for (const item2 of impl.toArray()) {
        let i = item2.p;
        if (i instanceof Not) {
          i = i.args[0];
        }
        const toAdd = prereq.get(i);
        toAdd.add(a);
        prereq.add(i, toAdd);
      }
    }
    return prereq;
  }
  var TautologyDetected = class extends Error {
    constructor(...args) {
      super();
      this.args = args;
    }
  };
  var Prover = class {
    constructor() {
      this.proved_rules = [];
      this._rules_seen = new HashSet();
    }
    split_alpha_beta() {
      const rules_alpha = [];
      const rules_beta = [];
      for (const impl of this.proved_rules) {
        const a = impl.p;
        const b = impl.q;
        if (a instanceof And) {
          rules_beta.push(new Implication(a, b));
        } else {
          rules_alpha.push(new Implication(a, b));
        }
      }
      return [rules_alpha, rules_beta];
    }
    rules_alpha() {
      return this.split_alpha_beta()[0];
    }
    rules_beta() {
      return this.split_alpha_beta()[1];
    }
    process_rule(a, b) {
      if (!a || typeof b === "boolean") {
        return;
      }
      if (typeof a === "boolean") {
        return;
      }
      if (this._rules_seen.has(new Implication(a, b))) {
        return;
      } else {
        this._rules_seen.add(new Implication(a, b));
      }
      try {
        this._process_rule(a, b);
      } catch (error) {
        if (!(error instanceof TautologyDetected)) {
          throw Error;
        }
      }
    }
    _process_rule(a, b) {
      if (b instanceof And) {
        for (const barg of b.args) {
          this.process_rule(a, barg);
        }
      } else if (b instanceof Or) {
        if (!(a instanceof Logic)) {
          if (b.args.includes(a)) {
            throw new TautologyDetected(a, b, "a -> a|c|...");
          }
        }
        const not_bargs = [];
        for (const barg of b.args) {
          not_bargs.push(Not.New(barg));
        }
        this.process_rule(And.New(...not_bargs), Not.New(a));
        for (let bidx = 0; bidx < b.args.length; bidx++) {
          const barg = b.args[bidx];
          const brest = [...b.args];
          brest.splice(bidx, 1);
          this.process_rule(And.New(a, Not.New(barg)), Or.New(...brest));
        }
      } else if (a instanceof And) {
        if (a.args.includes(b)) {
          throw new TautologyDetected(a, b, "a & b -> a");
        }
        this.proved_rules.push(new Implication(a, b));
      } else if (a instanceof Or) {
        if (a.args.includes(b)) {
          throw new TautologyDetected(a, b, "a & b -> a");
        }
        for (const aarg of a.args) {
          this.process_rule(aarg, b);
        }
      } else {
        this.proved_rules.push(new Implication(a, b));
        this.proved_rules.push(new Implication(Not.New(b), Not.New(a)));
      }
    }
  };
  var FactRules = class {
    constructor(rules) {
      if (typeof rules === "string") {
        rules = rules.split("\n");
      }
      const P2 = new Prover();
      for (const rule of rules) {
        let [a, op, b] = Util.splitLogicStr(rule);
        a = Logic.fromstring(a);
        b = Logic.fromstring(b);
        if (op === "->") {
          P2.process_rule(a, b);
        } else if (op === "==") {
          P2.process_rule(a, b);
          P2.process_rule(b, a);
        } else {
          throw new Error("unknown op " + op);
        }
      }
      this.beta_rules = [];
      for (const item of P2.rules_beta()) {
        const bcond = item.p;
        const bimpl = item.q;
        const pairs = new HashSet();
        bcond.args.forEach((a) => pairs.add(_as_pair(a)));
        this.beta_rules.push(new Implication(pairs, _as_pair(bimpl)));
      }
      const impl_a = deduce_alpha_implications(P2.rules_alpha());
      const impl_ab = apply_beta_to_alpha_route(impl_a, P2.rules_beta());
      this.defined_facts = new HashSet();
      for (const k of impl_ab.keys()) {
        this.defined_facts.add(_base_fact(k));
      }
      const full_implications = new SetDefaultDict();
      const beta_triggers = new ArrDefaultDict();
      for (const item of impl_ab.entries()) {
        const k = item[0];
        const val = item[1];
        const impl = val.p;
        const betaidxs = val.q;
        const setToAdd = new HashSet();
        impl.toArray().forEach((e) => setToAdd.add(_as_pair(e)));
        full_implications.add(_as_pair(k), setToAdd);
        beta_triggers.add(_as_pair(k), betaidxs);
      }
      this.full_implications = full_implications;
      this.beta_triggers = beta_triggers;
      const prereq = new SetDefaultDict();
      const rel_prereq = rules_2prereq(full_implications);
      for (const item of rel_prereq.entries()) {
        const k = item[0];
        const pitems = item[1];
        const toAdd = prereq.get(k);
        toAdd.addArr(pitems.toArray());
        prereq.add(k, toAdd);
      }
      this.prereq = prereq;
    }
  };
  var InconsistentAssumptions = class extends Error {
    constructor(...args) {
      super();
      this.args = args;
    }
    static __str__(...args) {
      const [kb, fact, value] = args;
      return kb + ", " + fact + "=" + value;
    }
  };
  var FactKB = class extends HashDict {
    constructor(rules) {
      super();
      this.rules = rules;
    }
    _tell(k, v) {
      if (k in this.dict && typeof this.get(k) !== "undefined") {
        if (this.get(k) === v) {
          return false;
        } else {
          throw new InconsistentAssumptions(this, k, v);
        }
      } else {
        this.add(k, v);
        return true;
      }
    }
    deduce_all_facts(facts) {
      const full_implications = this.rules.full_implications;
      const beta_triggers = this.rules.beta_triggers;
      const beta_rules = this.rules.beta_rules;
      if (facts instanceof HashDict || facts instanceof StdFactKB) {
        facts = facts.entries();
      }
      while (facts.length != 0) {
        const beta_maytrigger = new HashSet();
        for (const item of facts) {
          const k = item[0];
          const v = item[1];
          if (!this._tell(k, v) || typeof v === "undefined") {
            continue;
          }
          const arr = full_implications.get(new Implication(k, v)).toArray();
          for (const item2 of arr) {
            this._tell(item2.p, item2.q);
          }
          const currimp = beta_triggers.get(new Implication(k, v));
          if (!(currimp.length == 0)) {
            beta_maytrigger.addArr(currimp);
          }
        }
        facts = [];
        for (const bidx of beta_maytrigger.toArray()) {
          const { p: bcond, q: bimpl } = beta_rules[bidx];
          if (bcond.toArray().every((imp) => this.get(imp.p) == imp.q)) {
            facts.push([bimpl.p, bimpl.q]);
          }
        }
      }
    }
  };

  // ts-port/core/core.ts
  var ordering_of_classes = {
    Zero: 0,
    One: 1,
    Half: 2,
    Infinity: 3,
    NaN: 4,
    NegativeOne: 5,
    NegativeInfinity: 6,
    Integer: 7,
    Rational: 8,
    Float: 9,
    Exp1: 10,
    Pi: 11,
    ImaginaryUnit: 12,
    Symbol: 13,
    Wild: 14,
    Temporary: 15,
    Pow: 16,
    Mul: 17,
    Add: 18,
    Derivative: 19,
    Integral: 20,
    Abs: 21,
    Sign: 22,
    Sqrt: 23,
    Floor: 24,
    Ceiling: 25,
    Re: 26,
    Im: 27,
    Arg: 28,
    Conjugate: 29,
    Exp: 30,
    Log: 31,
    Sin: 32,
    Cos: 33,
    Tan: 34,
    Cot: 35,
    ASin: 36,
    ACos: 37,
    ATan: 38,
    ACot: 39,
    Sinh: 40,
    Cosh: 41,
    Tanh: 42,
    ASinh: 43,
    ACosh: 44,
    ATanh: 45,
    ACoth: 46,
    RisingFactorial: 47,
    FallingFactorial: 48,
    factorial: 49,
    binomial: 50,
    Gamma: 51,
    LowerGamma: 52,
    UpperGama: 53,
    PolyGamma: 54,
    Erf: 55,
    Chebyshev: 56,
    Chebyshev2: 57,
    Function: 58,
    WildFunction: 59,
    Lambda: 60,
    Order: 61,
    Equallity: 62,
    Unequality: 63,
    StrictGreaterThan: 64,
    StrictLessThan: 65,
    GreaterThan: 66,
    LessThan: 66
  };
  var all_classes = new HashSet();
  var BasicMeta = class {
    static register(cls) {
      all_classes.add(cls);
      cls.__sympy__ = true;
    }
    static compare(self2, other) {
      if (!(other instanceof BasicMeta)) {
        return -1;
      }
      const n1 = self2.constructor.name;
      const n2 = other.constructor.name;
      if (ordering_of_classes.has(n1) && ordering_of_classes.has(n2)) {
        const idx1 = ordering_of_classes[n1];
        const idx2 = ordering_of_classes[n2];
        return Math.sign(idx1 - idx2);
      }
      if (n1 > n2) {
        return 1;
      } else if (n1 === n2) {
        return 0;
      }
      return -1;
    }
    lessThan(other) {
      if (BasicMeta.compare(self, other) === -1) {
        return true;
      }
      return false;
    }
    greaterThan(other) {
      if (BasicMeta.compare(self, other) === 1) {
        return true;
      }
      return false;
    }
  };

  // ts-port/core/assumptions.ts
  var _assume_rules = new FactRules([
    "integer -> rational",
    "rational -> real",
    "rational -> algebraic",
    "algebraic -> complex",
    "transcendental == complex & !algebraic",
    "real -> hermitian",
    "imaginary -> complex",
    "imaginary -> antihermitian",
    "extended_real -> commutative",
    "complex -> commutative",
    "complex -> finite",
    "odd == integer & !even",
    "even == integer & !odd",
    "real -> complex",
    "extended_real -> real | infinite",
    "real == extended_real & finite",
    "extended_real == extended_negative | zero | extended_positive",
    "extended_negative == extended_nonpositive & extended_nonzero",
    "extended_positive == extended_nonnegative & extended_nonzero",
    "extended_nonpositive == extended_real & !extended_positive",
    "extended_nonnegative == extended_real & !extended_negative",
    "real == negative | zero | positive",
    "negative == nonpositive & nonzero",
    "positive == nonnegative & nonzero",
    "nonpositive == real & !positive",
    "nonnegative == real & !negative",
    "positive == extended_positive & finite",
    "negative == extended_negative & finite",
    "nonpositive == extended_nonpositive & finite",
    "nonnegative == extended_nonnegative & finite",
    "nonzero == extended_nonzero & finite",
    "zero -> even & finite",
    "zero == extended_nonnegative & extended_nonpositive",
    "zero == nonnegative & nonpositive",
    "nonzero -> real",
    "prime -> integer & positive",
    "composite -> integer & positive & !prime",
    "!composite -> !positive | !even | prime",
    "irrational == real & !rational",
    "imaginary -> !extended_real",
    "infinite == !finite",
    "noninteger == extended_real & !integer",
    "extended_nonzero == extended_real & !zero"
  ]);
  var _assume_defined = _assume_rules.defined_facts.clone();
  var StdFactKB = class extends FactKB {
    constructor(facts = void 0) {
      super(_assume_rules);
      if (typeof facts === "undefined") {
        this._generator = {};
      } else if (!(facts instanceof FactKB)) {
        this._generator = facts.copy();
      } else {
        this._generator = facts.generator;
      }
      if (facts) {
        this.deduce_all_facts(facts);
      }
    }
    stdclone() {
      return new StdFactKB(this);
    }
    generator() {
      return this._generator.copy();
    }
  };
  function as_property(fact) {
    return "is_" + fact;
  }
  function make_property(obj, fact) {
    obj[as_property(fact)] = getit;
    function getit() {
      if (typeof obj._assumptions[fact] !== "undefined") {
        return obj._assumptions.get(fact);
      } else {
        return _ask(fact, obj);
      }
    }
  }
  function _ask(fact, obj) {
    const assumptions = obj._assumptions;
    const handler_map = obj._prop_handler;
    let facts_to_check = new Array(fact);
    const facts_queued = new HashSet([fact]);
    const cls = obj.constructor;
    for (let i = 0; i < facts_to_check.length; i++) {
      const fact_i = facts_to_check[i];
      if (typeof assumptions.get(fact_i) !== "undefined") {
        continue;
      } else if (cls[as_property(fact)]) {
        return cls[as_property(fact)];
      }
      let fact_i_value = void 0;
      let handler_i = handler_map.get(fact_i);
      if (typeof handler_i !== "undefined") {
        fact_i_value = obj[handler_i.name]();
      }
      if (typeof fact_i_value !== "undefined") {
        assumptions.deduce_all_facts([[fact_i, fact_i_value]]);
      }
      const fact_value = assumptions.get(fact);
      if (typeof fact_value !== "undefined") {
        return fact_value;
      }
      const factset = _assume_rules.prereq.get(fact_i).difference(facts_queued).toArray();
      if (factset.size !== 0) {
        Util.shuffleArray(factset);
        facts_to_check = facts_to_check.concat(factset).flat();
        facts_queued.addArr(facts_to_check);
      } else {
        continue;
      }
    }
    if (assumptions.has(fact)) {
      return assumptions.get(fact);
    }
    assumptions._tell(fact, void 0);
    return void 0;
  }
  var ManagedProperties = class {
    static register(cls) {
      BasicMeta.register(cls);
      const local_defs = new HashDict();
      const cls_props = Object.getOwnPropertyNames(cls);
      for (const k of _assume_defined.toArray()) {
        const attrname = as_property(k);
        if (cls_props.includes(attrname)) {
          let v = cls[attrname];
          if (typeof v === "number" && Number.isInteger(v) || typeof v === "boolean" || typeof v === "undefined") {
            if (typeof v !== "undefined") {
              v = !!v;
            }
            local_defs.add(k, v);
          }
        }
      }
      const all_defs = new HashDict();
      const supers = Util.getSupers(cls);
      for (let i = supers.length - 1; i >= 0; i--) {
        const base2 = supers[i];
        const assumptions = base2._explicit_class_assumptions;
        if (typeof assumptions !== "undefined") {
          all_defs.merge(assumptions);
        }
      }
      all_defs.merge(local_defs);
      cls._explicit_class_assumptions = all_defs;
      cls.default_assumptions = new StdFactKB(all_defs);
      for (const item of cls.default_assumptions.entries()) {
        cls[as_property(item[0])] = item[1];
      }
      for (const supercls of Util.getSupers(cls)) {
        const staticDefs = new HashSet(Object.getOwnPropertyNames(cls).filter(
          (prop) => prop.includes("is_") && !_assume_defined.has(prop.replace("is_", ""))
        ));
        const otherProps = new HashSet(Object.getOwnPropertyNames(supercls).filter(
          (prop) => prop.includes("is_") && !_assume_defined.has(prop.replace("is_", ""))
        ));
        const uniqueProps = otherProps.difference(staticDefs);
        for (const fact of uniqueProps.toArray()) {
          cls[fact] = supercls[fact];
        }
      }
    }
  };
  ManagedProperties.all_explicit_assumptions = new HashDict();
  ManagedProperties.all_default_assumptions = new HashSet();

  // ts-port/core/kind.ts
  var _KindRegistry = class {
    static register(name, cls) {
      _KindRegistry.registry[name] = new cls();
    }
  };
  var KindRegistry = _KindRegistry;
  KindRegistry.registry = {};
  var Kind = class {
    static new(cls, ...args) {
      let inst;
      if (args in KindRegistry.registry) {
        inst = KindRegistry.registry[args];
      } else {
        KindRegistry.register(cls.name, cls);
        inst = new cls();
      }
      return inst;
    }
  };
  var _UndefinedKind = class extends Kind {
    constructor() {
      super();
    }
    static new() {
      return Kind.new(_UndefinedKind);
    }
    toString() {
      return "UndefinedKind";
    }
  };
  var UndefinedKind = _UndefinedKind.new();
  var _NumberKind = class extends Kind {
    constructor() {
      super();
    }
    static new() {
      return Kind.new(_NumberKind);
    }
    toString() {
      return "NumberKind";
    }
  };
  var NumberKind = _NumberKind.new();
  var _BooleanKind = class extends Kind {
    constructor() {
      super();
    }
    static new() {
      return Kind.new(_BooleanKind);
    }
    toString() {
      return "BooleanKind";
    }
  };
  var BooleanKind = _BooleanKind.new();

  // ts-port/core/traversal.ts
  var preorder_traversal = class {
    constructor(node) {
      this._skip_flag = false;
      this._pt = this._preorder_traversal(node);
    }
    *_preorder_traversal(node) {
      yield node;
      if (this._skip_flag) {
        this._skip_flag = false;
        return;
      }
      if (node.instanceofBasic) {
        let args;
        if (node._argset) {
          args = node._argset;
        } else {
          args = node._args;
        }
        for (const arg of args) {
          for (const val of this._preorder_traversal(arg)) {
            yield val;
          }
        }
      } else if (Symbol.iterator in Object(node)) {
        for (const item of node) {
          for (const val of this._preorder_traversal(item)) {
            yield val;
          }
        }
      }
    }
    asIter() {
      const res = [];
      for (const item of this._pt) {
        res.push(item);
      }
      return res;
    }
  };

  // ts-port/core/basic.ts
  var _Basic = (superclass) => {
    var _a;
    return _a = class extends superclass {
      constructor(...args) {
        super();
        this.__slots__ = ["_mhash", "_args", "_assumptions"];
        this._constructor_postprocessor_mapping = {};
        const cls = this.constructor;
        this._assumptions = cls.default_assumptions.stdclone();
        this._mhash = void 0;
        this._args = args;
        this.assignProps();
      }
      assignProps() {
        const cls = this.constructor;
        if (typeof cls._prop_handler === "undefined") {
          cls._prop_handler = new HashDict();
          for (const k of _assume_defined.toArray()) {
            const meth1 = "_eval_is_" + k;
            if (this[meth1]) {
              cls._prop_handler.add(k, this[meth1]);
            }
          }
        }
        this._prop_handler = cls._prop_handler.copy();
        for (const fact of _assume_defined.toArray()) {
          make_property(this, fact);
        }
        const otherProps = new HashSet(Object.getOwnPropertyNames(cls).filter(
          (prop) => prop.includes("is_") && !_assume_defined.has(prop.replace("is_", ""))
        ));
        for (const miscprop of otherProps.toArray()) {
          this[miscprop] = () => cls[miscprop];
        }
      }
      __getnewargs__() {
        return this._args;
      }
      __getstate__() {
        return void 0;
      }
      hash() {
        if (typeof this._mhash === "undefined") {
          return this.constructor.name + this.hashKey();
        }
        return this._mhash;
      }
      instanceofBasic() {
        return true;
      }
      assumptions0() {
        return {};
      }
      hashKey() {
        return this._args;
      }
      static cmp(self2, other) {
        if (self2 === other) {
          return 0;
        }
        const n1 = self2.constructor.name;
        const n2 = other.constructor.name;
        if (n1 && n2) {
          return (n1 > n2) - (n1 < n2);
        }
        const st = self2._hashable_content();
        const ot = other._hashable_content();
        if (st && ot) {
          return (st.length > ot.length) - (st.length < ot.length);
        }
        for (const elem of Util.zip(st, ot)) {
          const l = elem[0];
          const r = elem[1];
          let c;
          if (l instanceof Basic) {
            c = l.cmp(r);
          } else {
            c = (l > r) - (l < r);
          }
          if (c) {
            return c;
          }
        }
        return 0;
      }
      _exec_constructor_postprocessors(obj) {
        const clsname = this.constructor.name;
        const postprocessors = new HashDict();
        for (const f of postprocessors.get(clsname, [])) {
          obj = f(obj);
        }
        return obj;
      }
      _eval_subs(old, _new) {
        return void 0;
      }
      _aresame(a, b) {
        if (a.is_Number && b.is_Number) {
          return a === b && a.constructor.name === b.constructor.name;
        }
        for (const item of Util.zip(new preorder_traversal(a).asIter(), new preorder_traversal(b).asIter())) {
          const i = item[0];
          const j = item[1];
          if (i !== j || typeof i !== typeof j) {
            return false;
          }
        }
        return true;
      }
      subs(...args) {
        let sequence;
        if (args.length === 1) {
          sequence = args[0];
          if (sequence instanceof HashSet) {
          } else if (sequence instanceof HashDict) {
            sequence = sequence.entries();
          } else if (Symbol.iterator in Object(sequence)) {
            throw new Error("When a single argument is passed to subs it should be a dictionary of old: new pairs or an iterable of (old, new) tuples");
          }
        } else if (args.length === 2) {
          sequence = [args];
        } else {
          throw new Error("sub accepts 1 or 2 args");
        }
        let rv = this;
        for (const item of sequence) {
          const old = item[0];
          const _new = item[1];
          rv = rv._subs(old, _new);
          if (!(rv instanceof Basic)) {
            break;
          }
        }
        return rv;
      }
      _subs(old, _new) {
        function fallback(cls, old2, _new2) {
          let hit = false;
          const args = cls._args;
          for (let i = 0; i < args.length; i++) {
            let arg = args[i];
            if (!arg._eval_subs) {
              continue;
            }
            arg = arg._subs(old2, _new2);
            if (!cls._aresame(arg, args[i])) {
              hit = true;
              args[i] = arg;
            }
          }
          if (hit) {
            let rv2;
            if (cls.constructor.name === "Mul" || cls.constructor.name === "Add") {
              rv2 = new cls.constructor(true, true, ...args);
            } else if (cls.constructor.name === "Pow") {
              rv2 = new cls.constructor(...args);
            }
            return rv2;
          }
          return cls;
        }
        if (this._aresame(this, old)) {
          return _new;
        }
        let rv = this._eval_subs(old, _new);
        if (typeof rv === "undefined") {
          rv = fallback(this, old, _new);
        }
        return rv;
      }
    }, _a.is_number = false, _a.is_Atom = false, _a.is_Symbol = false, _a.is_symbol = false, _a.is_Indexed = false, _a.is_Dummy = false, _a.is_Wild = false, _a.is_Function = false, _a.is_Add = false, _a.is_Mul = false, _a.is_Pow = false, _a.is_Number = false, _a.is_Float = false, _a.is_Rational = false, _a.is_Integer = false, _a.is_NumberSymbol = false, _a.is_Order = false, _a.is_Derivative = false, _a.is_Piecewise = false, _a.is_Poly = false, _a.is_AlgebraicNumber = false, _a.is_Relational = false, _a.is_Equality = false, _a.is_Boolean = false, _a.is_Not = false, _a.is_Matrix = false, _a.is_Vector = false, _a.is_Point = false, _a.is_MatAdd = false, _a.is_MatMul = false, _a.kind = UndefinedKind, _a.all_unique_props = new HashSet(), _a;
  };
  var Basic = _Basic(Object);
  ManagedProperties.register(Basic);
  var Atom = (superclass) => {
    var _a;
    return _a = class extends mix(base).with(_Basic) {
      constructor() {
        super(...arguments);
        this.__slots__ = [];
      }
      matches(expr, repl_dict = void 0, old = false) {
        if (this === expr) {
          if (typeof repl_dict === "undefined") {
            return new HashDict();
          }
          return repl_dict.copy();
        }
      }
      xreplace(rule, hack2 = false) {
        return rule.get(this);
      }
      doit(...hints) {
        return this;
      }
    }, _a.is_Atom = true, _a;
  };
  var _AtomicExpr = Atom(Object);
  ManagedProperties.register(_AtomicExpr);

  // ts-port/core/singleton.ts
  var _Singleton = class {
    static register(name, cls) {
      ManagedProperties.register(cls);
      _Singleton.registry[name] = new cls();
    }
  };
  var Singleton = _Singleton;
  Singleton.registry = {};
  var S = new Singleton();

  // ts-port/core/global.ts
  var _Global = class {
    static construct(classname, ...args) {
      const constructor = _Global.constructors[classname];
      return constructor(...args);
    }
    static register(cls, constructor) {
      _Global.constructors[cls] = constructor;
    }
    static registerfunc(name, func) {
      _Global.functions[name] = func;
    }
    static evalfunc(name, ...args) {
      const func = _Global.functions[name];
      return func(...args);
    }
  };
  var Global = _Global;
  Global.constructors = {};
  Global.functions = {};

  // ts-port/utilities/misc.ts
  function as_int(n2) {
    if (!Number.isInteger(n2)) {
      throw new Error(n2 + " is not int");
    }
    return n2;
  }

  // ts-port/core/expr.ts
  var Expr = (superclass) => {
    var _a;
    return _a = class extends mix(superclass).with(_Basic) {
      constructor(...args) {
        super(...args);
        this.__slots__ = [];
      }
      as_base_exp() {
        return [this, S.One];
      }
      as_coeff_Mul(rational = false) {
        return [S.One, this];
      }
      as_coeff_Add() {
        return [S.Zero, this];
      }
      __add__(other) {
        return Global.construct("Add", true, true, this, other);
      }
      __radd__(other) {
        return Global.construct("Add", true, true, other, this);
      }
      __sub__(other) {
        return Global.construct("Add", true, true, this, other.__mul__(S.NegativeOne));
      }
      __rsub__(other) {
        return Global.construct("Add", true, true, other, this.__mul__(S.NegativeOne));
      }
      __mul__(other) {
        return Global.construct("Mul", true, true, this, other);
      }
      __rmul__(other) {
        return Global.construct("Mul", true, true, other, this);
      }
      _pow(other) {
        return Global.construct("Pow", this, other);
      }
      __pow__(other, mod2 = void 0) {
        if (typeof mod2 === "undefined") {
          return this._pow(other);
        }
        let _self;
        let _other;
        let _mod;
        try {
          [_self, _other, _mod] = [as_int(this), as_int(other), as_int(mod2)];
          if (other >= 0) {
            return Global.construct("_Number_", _self ** _other % _mod);
          } else {
            return Global.construct("_Number_", Global.evalfunc("mod_inverse", _self ** _other % mod2, mod2));
          }
        } catch (Error2) {
          const power = this._pow(_other);
          try {
            throw new Error2("mod class not yet implemented");
          } catch (Error3) {
            throw new Error3("not implemented");
          }
        }
      }
      __rpow__(other) {
        return Global.construct("Pow", other, this);
      }
      __truediv__(other) {
        const denom = Global.construct("Pow", other, S.NegativeOne);
        if (this === S.One) {
          return denom;
        } else {
          return Global.construct("Mul", true, true, this, denom);
        }
      }
      __rtruediv__(other) {
        const denom = Global.construct("Pow", this, S.NegativeOne);
        if (other === S.One) {
          return denom;
        } else {
          return Global.construct("Mul", true, true, other, denom);
        }
      }
      _eval_power(other) {
        return void 0;
      }
      args_cnc(cset = false, warn = true, split_1 = true) {
        let args;
        if (this.constructor.is_Mul) {
          args = this._args;
        } else {
          args = [this];
        }
        let c;
        let nc;
        let loop2 = true;
        for (let i = 0; i < args.length; i++) {
          const mi = args[i];
          if (!mi.is_commutative) {
            c = args.slice(0, i);
            nc = args.slice(i);
            loop2 = false;
            break;
          }
        }
        if (loop2) {
          c = args;
          nc = [];
        }
        if (c && split_1 && c[0].is_Number && c[0].is_extended_negative && c[0] !== S.NegativeOne) {
          c.splice(0, 1, S.NegativeOne, c[0].__mul__(S.NegativeOne));
        }
        if (cset) {
          const clen = c.length;
          const cset2 = new HashSet();
          cset2.addArr(c);
          if (clen && warn && cset2.size !== clen) {
            throw new Error("repeated commutative args");
          }
        }
        return [c, nc];
      }
    }, _a.is_scalar = true, _a;
  };
  var _Expr = Expr(Object);
  ManagedProperties.register(_Expr);
  var AtomicExpr = (superclass) => {
    var _a;
    return _a = class extends mix(superclass).with(Atom, Expr) {
      constructor(...args) {
        super(_a, args);
        this.__slots__ = [];
      }
      _eval_is_polynomial(syms) {
        return true;
      }
      _eval_is_rational_function(syms) {
        return true;
      }
      eval_is_algebraic_expr(syms) {
        return true;
      }
      _eval_nseries(x2, n2, logx, cdor = 0) {
        return this;
      }
    }, _a.is_number = false, _a.is_Atom = true, _a;
  };
  var _AtomicExpr2 = AtomicExpr(Object);
  ManagedProperties.register(_AtomicExpr2);

  // ts-port/core/parameters.ts
  var _global_parameters = class {
    constructor(dict) {
      this.dict = {};
      this.dict = dict;
      this.evaluate = this.dict["evaluate"];
      this.distribute = this.dict["distribute"];
      this.exp_is_pow = this.dict["exp_is_pow"];
    }
  };
  var global_parameters = new _global_parameters({ "evaluate": true, "distribute": true, "exp_is_pow": false });

  // ts-port/core/operations.ts
  var AssocOp = (superclass) => {
    var _a;
    return _a = class extends mix(superclass).with(_Basic) {
      constructor(cls, evaluate, simplify, ...args) {
        if (cls.name === "Mul") {
          cls.identity = S.One;
        } else if (cls.name === "Add") {
          cls.identity = S.Zero;
        }
        super(...args);
        this.__slots__ = ["is_commutative"];
        if (simplify) {
          if (typeof evaluate === "undefined") {
            evaluate = global_parameters.evaluate;
          } else if (evaluate === false) {
            let obj2 = this._from_args(cls, void 0, ...args);
            obj2 = this._exec_constructor_postprocessors(obj2);
            return obj2;
          }
          const argsTemp = [];
          for (const a of args) {
            if (a !== cls.identity) {
              argsTemp.push(a);
            }
          }
          args = argsTemp;
          if (args.length === 0) {
            return cls.identity;
          } else if (args.length === 1) {
            return args[0];
          }
          const [c_part, nc_part, order_symbols] = this.flatten(args);
          const is_commutative = nc_part.length === 0;
          let obj = this._from_args(cls, is_commutative, ...c_part.concat(nc_part));
          obj = this._exec_constructor_postprocessors(obj);
          return obj;
        }
      }
      _from_args(cls, is_commutative, ...args) {
        if (args.length === 0) {
          return cls.identity;
        } else if (args.length === 1) {
          return args[0];
        }
        const obj = new cls(true, false, ...args);
        if (typeof is_commutative === "undefined") {
          const input = [];
          for (const a of args) {
            input.push(a.is_commutative());
          }
          is_commutative = fuzzy_and(input);
        }
        obj.is_commutative = () => is_commutative;
        return obj;
      }
      _new_rawargs(reeval, ...args) {
        let is_commutative;
        if (reeval && this.is_commutative === false) {
          is_commutative = void 0;
        } else {
          is_commutative = this.is_commutative;
        }
        return this._from_args(this.constructor, is_commutative, ...args);
      }
      make_args(cls, expr) {
        if (expr instanceof cls) {
          return expr._args;
        } else {
          return [expr];
        }
      }
    }, _a._args_type = void 0, _a;
  };
  ManagedProperties.register(AssocOp(Object));

  // ts-port/core/power.ts
  var _Pow = class extends _Expr {
    constructor(b, e, evaluate = void 0, simplify = true) {
      super(b, e);
      this.__slots__ = ["is_commutative"];
      this._args = [b, e];
      if (typeof evaluate === "undefined") {
        evaluate = global_parameters.evaluate;
      }
      if (simplify) {
        if (evaluate) {
          if (e === S.ComplexInfinity) {
            return S.NaN;
          }
          if (e === S.Infinity) {
            if (b.is_positive()) {
              return S.Infinity;
            } else if (b.is_zero()) {
              return S.Zero;
            } else {
              if (b.is_finite()) {
                return S.ComplexInfinity;
              } else {
                return S.NaN;
              }
            }
          }
          if (e === S.Zero) {
            return S.One;
          } else if (e === S.One) {
            return b;
          } else if (e === S.NegativeOne && !b) {
            return S.ComplexInfinity;
          } else if ((e.is_Symbol() && e.is_integer() || e.is_Integer() && (b.is_Number() && b.is_Mul() || b.is_Number())) && e.is_extended_negative === true) {
            if (e.is_even() || e.is_even()) {
              b = b.__mul__(S.NegativeOne);
            } else {
              return new _Pow(b.__mul__(S.NegativeOne), e).__mul__(S.NegativeOne);
            }
          }
          0;
          if (b === S.NaN || e === S.NaN) {
            return S.NaN;
          } else if (b === S.One) {
            if (e.is_infinite()) {
              return S.NaN;
            }
            return S.One;
          } else if (e.is_Number() && b.is_Number()) {
            const obj = b._eval_power(e);
            if (typeof obj !== "undefined") {
              obj.is_commutative = () => b.is_commutative() && e.is_commutative();
              return obj;
            }
          }
        }
      }
      this.is_commutative = () => b.is_commutative() && e.is_commutative();
    }
    as_base_exp() {
      const b = this._args[0];
      const e = this._args[1];
      if (b.is_Rational && b.p === 1 && b.q !== 1) {
        const p1 = _Number_.new(b.q);
        const p2 = e.__mul__(S.NegativeOne);
        return [p1, p2];
      }
      return [b, e];
    }
    static _new(b, e) {
      return new _Pow(b, e);
    }
    toString() {
      const b = this._args[0].toString();
      const e = this._args[1].toString();
      return b + "^" + e;
    }
  };
  var Pow = _Pow;
  Pow.is_Pow = true;
  ManagedProperties.register(Pow);
  Global.register("Pow", Pow._new);

  // ts-port/core/mul.ts
  var NC_Marker = class {
    constructor() {
      this.is_Order = false;
      this.is_Mul = false;
      this.is_Number = false;
      this.is_Poly = false;
      this.is_commutative = false;
    }
  };
  function _mulsort(args) {
    args.sort((a, b) => Basic.cmp(a, b));
  }
  var _Mul = class extends mix(base).with(Expr, AssocOp) {
    constructor(evaluate, simplify, ...args) {
      super(_Mul, evaluate, simplify, ...args);
      this.__slots__ = [];
      this._args_type = Expr;
    }
    flatten(seq) {
      let rv = void 0;
      if (seq.length === 2) {
        let [a, b] = seq;
        if (b.is_Rational()) {
          [a, b] = [b, a];
          seq = [a, b];
        }
        if (!(a.is_zero() && a.is_Rational())) {
          let r;
          [r, b] = b.as_coeff_Mul();
          if (b.is_Add()) {
            if (r !== S.One) {
              let arb;
              const ar = a.__mul__(r);
              if (ar === S.One) {
                arb = b;
              } else {
                arb = this.constructor(false, true, a.__mul__(r), b);
              }
              rv = [[arb], [], void 0];
            } else if (global_parameters.distribute && b.is_commutative()) {
              const arg = [];
              for (const bi of b._args) {
                arg.push(this._keep_coeff(a, bi));
              }
              const newb = new Add(true, true, ...arg);
              rv = [[newb], [], void 0];
            }
          }
        }
        if (rv) {
          return rv;
        }
      }
      let c_part = [];
      const nc_seq = [];
      let nc_part = [];
      let coeff = S.One;
      let c_powers = [];
      let neg1e = S.Zero;
      let num_exp = [];
      const pnum_rat = new HashDict();
      const order_symbols = [];
      for (let o of seq) {
        if (o.is_Mul()) {
          if (o.is_commutative()) {
            seq.push(...o._args);
          } else {
            for (const q of o._args) {
              if (q.is_commutative()) {
                seq.push(q);
              } else {
                nc_seq.push(q);
              }
            }
          }
          continue;
        } else if (o.is_Number()) {
          if (o === S.NaN || coeff === S.ComplexInfinity && o.is_zero()) {
            return [[S.NaN], [], void 0];
          } else if (coeff.is_Number()) {
            coeff = coeff.__mul__(o);
            if (coeff === S.NaN) {
              return [[S.NaN], [], void 0];
            }
          }
          continue;
        } else if (o === S.ComplexInfinity) {
          if (!coeff) {
            return [[S.NaN], [], void 0];
          }
          coeff = S.ComplexInfinity;
          continue;
        } else if (o.is_commutative()) {
          let e;
          let b;
          [b, e] = o.as_base_exp();
          if (o.is_Pow()) {
            if (b.is_Number()) {
              if (e.is_Rational()) {
                if (e.is_Integer()) {
                  coeff = coeff.__mul__(new Pow(b, e));
                  continue;
                } else if (e.is_negative()) {
                  seq.push(new Pow(b, e));
                  continue;
                } else if (b.is_negative()) {
                  neg1e = neg1e.__add__(e);
                  b = b.__mul__(S.NegativeOne);
                }
                if (b !== S.One) {
                  pnum_rat.setdefault(b, []).push(e);
                }
                continue;
              } else if (b.is_positive() || b.is_integer()) {
                num_exp.push([b, e]);
                continue;
              }
            }
          }
          c_powers.push([b, e]);
        } else {
          if (o !== NC_Marker) {
            nc_seq.push(o);
          }
          while (nc_seq) {
            o = nc_seq.splice(0, 1);
            if (!nc_part) {
              nc_part.push(o);
              continue;
            }
            const o1 = nc_part.pop();
            const [b1, e1] = o1.as_base_exp();
            const [b2, e2] = o.as_base_exp();
            const new_exp = e1.__add__(e2);
            if (b1.eq(b2) && !new_exp.is_Add()) {
              const o12 = b1._eval_power(new_exp);
              if (o12.is_commutative()) {
                seq.push(o12);
                continue;
              } else {
                nc_seq.splice(0, 0, o12);
              }
            } else {
              nc_part.push(o1);
              nc_part.push(o);
            }
          }
        }
      }
      function _gather(c_powers2) {
        const common_b = new HashDict();
        for (const [b, e] of c_powers2) {
          const co = e.as_coeff_Mul();
          common_b.setdefault(b, new HashDict()).setdefault(co[1], []).push(co[0]);
        }
        for (const [b, d] of common_b.entries()) {
          for (const [di, li] of d.entries()) {
            d.add(di, new Add(true, true, ...li));
          }
        }
        const new_c_powers = [];
        for (const [b, e] of common_b.entries()) {
          for (const [t, c] of e.entries()) {
            new_c_powers.push([b, c.__mul__(t)]);
          }
        }
        return new_c_powers;
      }
      c_powers = _gather(c_powers);
      num_exp = _gather(num_exp);
      for (let i2 = 0; i2 < 2; i2++) {
        const new_c_powers = [];
        let changed = false;
        for (let [b, e] of c_powers) {
          let p;
          if (e.is_zero() === true) {
            if (b.is_Add() || b.is_Mul() && b._args.includes(S.ComplexInfinity, S.Infinity, S.NefativeInfinity)) {
              return [[S.NaN], [], void 0];
            }
            continue;
          }
          if (e === S.One) {
            if (b.is_Number()) {
              coeff = coeff.__mul__(b);
              continue;
            }
            p = b;
          }
          if (e !== S.One) {
            p = new Pow(b, e);
            if (p.is_Pow() && !b.is_Pow()) {
              const bi = b;
              [b, e] = p.as_base_exp();
              if (b !== bi) {
                changed = true;
              }
            }
          }
          c_part.push(p);
          new_c_powers.push([b, e]);
        }
        const argset = new HashSet();
        for (const [b, e] of new_c_powers) {
          argset.add(b);
        }
        if (changed && argset.size !== new_c_powers.length) {
          c_part = [];
          c_powers = _gather(new_c_powers);
        } else {
          break;
        }
      }
      const inv_exp_dict = new HashDict();
      for (const [b, e] of num_exp) {
        inv_exp_dict.setdefault(e, []).push(b);
      }
      for (const [e, b] of inv_exp_dict.entries()) {
        inv_exp_dict.add(e, new _Mul(true, true, ...b));
      }
      const c_part_arg = [];
      for (const [e, b] of inv_exp_dict.entries()) {
        if (e) {
          c_part_arg.push(new Pow(b, e));
        }
      }
      c_part.push(...c_part_arg);
      const comb_e = new HashDict();
      for (const [b, e] of pnum_rat.entries()) {
        comb_e.setdefault(new Add(true, true, ...e), []).push(b);
      }
      const num_rat = [];
      for (let [e, b] of comb_e.entries()) {
        b = new _Mul(true, true, ...b);
        if (e.q === 1) {
          coeff = coeff.__mul__(new Pow(b, e));
          continue;
        }
        if (e.p > e.q) {
          const [e_i, ep] = divmod(e.p, e.q);
          coeff = coeff.__mul__(new Pow(b, e_i));
          e = new Rational(ep, e.q);
        }
        num_rat.push([b, e]);
      }
      const pnew = new ArrDefaultDict();
      let i = 0;
      while (i < num_rat.length) {
        let [bi, ei] = num_rat[i];
        const grow = [];
        for (let j = i + 1; j < num_rat.length; j++) {
          const [bj, ej] = num_rat[j];
          const g = bi.gcd(bj);
          if (g !== S.One) {
            let e = ei.__add__(ej);
            if (e.q === 1) {
              coeff = coeff.__mul__(new Pow(g, e));
            } else {
              if (e.p > e.q) {
                const [e_i, ep] = divmod(e.p, e.q);
                coeff = coeff.__mul__(new Pow(g, e_i));
                e = new Rational(ep, e.q);
              }
              grow.push([g, e]);
            }
            num_rat[j] = [bj / g, ej];
            bi = bi / g;
            if (bi === S.One) {
              break;
            }
          }
        }
        if (bi !== S.One) {
          const obj = new Pow(bi, ei);
          if (obj.is_Number()) {
            coeff = coeff.__mul__(obj);
          } else {
            for (const item of this.make_args(_Mul, obj)) {
              if (item.is_Number()) {
                coeff = coeff.__mul__(obj);
              } else {
                [bi, ei] = item._args;
                pnew.add(ei, pnew.get(ei).concat(bi));
              }
            }
          }
        }
        num_rat.push(...grow);
        i++;
      }
      if (neg1e !== S.Zero) {
        let n2;
        let q;
        let p;
        [p, q] = neg1e._as_numer_denom();
        [n2, p] = divmod(p.p, q.p);
        if (n2 % 2 !== 0) {
          coeff = coeff.__mul__(S.NegativeOne);
        }
        if (q === 2) {
          throw new Error("imaginary numbers not yet supported");
        } else if (p) {
          neg1e = new Rational(p, q);
          let enterelse = true;
          for (const [e, b] of pnew.entries()) {
            if (e === neg1e && b.is_positive()) {
              pnew.add(e, pnew.get(e) - b);
              enterelse = false;
              break;
            }
          }
          if (enterelse) {
            c_part.push(new Pow(S.NegativeOne, neg1e, false));
          }
        }
      }
      const c_part_argv2 = [];
      for (let [e, b] of pnew.entries()) {
        if (Array.isArray(b)) {
          b = b[0];
        }
        c_part_argv2.push(new Pow(b, e));
      }
      c_part.push(...c_part_argv2);
      if (coeff === S.Infinity || coeff === S.NegativeInfinity) {
        let _handle_for_oo = function(c_part2, coeff_sign2) {
          const new_c_part = [];
          for (const t of c_part2) {
            if (t.is_extended_positive()) {
              continue;
            }
            if (t.is_extended_negative()) {
              coeff_sign2 *= -1;
              continue;
            }
            new_c_part.push(t);
          }
          return [new_c_part, coeff_sign2];
        };
        let coeff_sign;
        [c_part, coeff_sign] = _handle_for_oo(c_part, 1);
        [nc_part, coeff_sign] = _handle_for_oo(nc_part, coeff_sign);
        coeff = coeff.__mul__(new Integer(coeff_sign));
      }
      if (coeff === S.ComplexInfinity) {
        const ctemp = [];
        for (const c of c_part) {
          if (!(fuzzy_not(c.is_zero()) && c.is_extended_real() !== "undefined")) {
            ctemp.push(c);
          }
        }
        c_part = ctemp;
        const nctemp = [];
        for (const c of nc_part) {
          if (!(fuzzy_not(c.is_zero()) && c.is_extended_real() !== "undefined")) {
            nctemp.push(c);
          }
        }
        nc_part = nctemp;
      } else if (coeff.is_zero()) {
        for (const c of c_part) {
          if (c.is_finite() === false) {
            return [[S.NaN], [], order_symbols];
          }
        }
      }
      const _new = [];
      for (const i2 of c_part) {
        if (i2.is_Number()) {
          coeff = coeff.__mul__(i2);
        } else {
          _new.push(i2);
        }
      }
      c_part = _new;
      _mulsort(c_part);
      if (coeff !== S.One) {
        c_part.splice(0, 0, coeff);
      }
      if (global_parameters.distribute && !nc_part && c_part.length === 2 && c_part[0].is_Number() && c_part[0].is_finite() && c_part[1].is_Add()) {
        coeff = c_part[0];
        const addarg = [];
        for (const f of c_part[1]._args) {
          addarg.push(coeff.__mul__(f));
        }
        c_part = new Add(true, true, ...addarg);
      }
      return [c_part, nc_part, order_symbols];
    }
    as_coeff_Mul(rational = false) {
      const coeff = this._args.slice(0, 1)[0];
      const args = this._args.slice(1);
      if (coeff.is_Number()) {
        if (!rational || coeff.is_Rational()) {
          if (args.length === 1) {
            return [coeff, args[0]];
          } else {
            return [coeff, this._new_rawargs(true, ...args)];
          }
        } else if (coeff.is_extended_negative()) {
          return [S.NegativeOne, this._new_rawargs(true, ...[-coeff].concat(args))];
        }
      }
      return [S.One, this];
    }
    _eval_power(e) {
      const [cargs, nc] = this.args_cnc(false, true, false);
      if (e.is_Integer()) {
        const mulargs = [];
        for (const b of cargs) {
          mulargs.push(new Pow(b, e, false));
        }
        return new _Mul(true, true, ...mulargs).__mul__(
          new Pow(this._from_args(_Mul, void 0, ...nc), e, false)
        );
      }
      const p = new Pow(this, e, false);
      if (e.is_Rational() || e.is_Float()) {
        return p._eval_expand_power_base();
      }
      return p;
    }
    _keep_coeff(coeff, factors, clear = true, sign2 = false) {
      if (!coeff.is_Number()) {
        if (factors.is_Number()) {
          [factors, coeff] = [coeff, factors];
        } else {
          return coeff.__mul__(factors);
        }
      }
      if (factors === S.One) {
        return coeff;
      }
      if (coeff === S.One) {
        return factors;
      } else if (coeff === S.NegativeOne && !sign2) {
        return factors.__mul__(S.NegativeOne);
      } else if (factors.is_Add()) {
        if (!clear && coeff.is_Rational() && coeff.q !== 1) {
          let args = [];
          for (const i of factors._args) {
            args.push(i.as_coeff_Mul());
          }
          const temp = [];
          for (const [c, m] of args) {
            temp.push([this._keep_coeff(c, coeff), m]);
          }
          args = temp;
          for (const [c] of args) {
            if (c.is_Integer()) {
              const temparg = [];
              for (const i of args) {
                if (i[0] === 1) {
                  temparg.push(i.slice(0, 1));
                } else {
                  i;
                }
              }
              return this._from_args(
                Add,
                void 0,
                ...this._from_args(_Mul, void 0, ...temparg)
              );
              break;
            }
          }
        }
        return new _Mul(false, true, coeff, factors);
      } else if (factors.is_Mul()) {
        const margs = factors._args;
        if (margs[0].is_Number()) {
          margs[0] = margs[0].__mul__(coeff);
          if (margs[0] === 1) {
            margs.splice(2, 1);
          }
        } else {
          margs.splice(0, 0, coeff);
        }
        return this._from_args(_Mul, void 0, ...margs);
      } else {
        let m = coeff.__mul__(factors);
        if (m.is_Number() && !factors.is_Number()) {
          m = this._from_args(_Mul, void 0, coeff, factors);
        }
        return m;
      }
    }
    static _new(evaluate, simplify, ...args) {
      return new _Mul(evaluate, simplify, ...args);
    }
    _eval_is_commutative() {
      const allargs = [];
      for (const a of this._args) {
        allargs.push(a.is_commutative());
      }
      return _fuzzy_group(allargs);
    }
    toString() {
      let result = "";
      const num_args = this._args.length;
      for (let i = 0; i < num_args; i++) {
        const arg = this._args[i];
        let temp;
        if (i != num_args - 1) {
          temp = arg.toString() + "*";
        } else {
          temp = arg.toString();
        }
        result = result.concat(temp);
      }
      return result;
    }
  };
  var Mul = _Mul;
  Mul.is_Mul = true;
  Mul.identity = S.One;
  ManagedProperties.register(Mul);
  Global.register("Mul", Mul._new);

  // ts-port/core/add.ts
  function _addsort(args) {
    args.sort((a, b) => Basic.cmp(a, b));
  }
  var _Add = class extends mix(base).with(Expr, AssocOp) {
    constructor(evaluate, simplify, ...args) {
      super(_Add, evaluate, simplify, ...args);
      this.__slots__ = [];
    }
    flatten(seq) {
      let rv = void 0;
      if (seq.length === 2) {
        let [a, b] = seq;
        if (b.is_Rational()) {
          [a, b] = [b, a];
        }
        if (a.is_Rational()) {
          if (b.is_Mul()) {
            rv = [[a, b], [], void 0];
          }
        }
        if (rv) {
          let allc = true;
          for (const s of rv[0]) {
            if (s.is_commutative() === false) {
              allc = false;
            }
          }
          if (allc) {
            return rv;
          } else {
            return [[], rv[0], void 0];
          }
        }
      }
      const terms = new HashDict();
      let coeff = S.Zero;
      const extra = [];
      for (const o of seq) {
        let c;
        let s;
        if (o.is_Number()) {
          if (o === S.NaN || coeff === S.ComplexInfinity && o.is_finite() === false) {
            return [[S.NaN], [], void 0];
          }
          if (coeff.is_Number()) {
            coeff = coeff.__add__(o);
            if (coeff === S.NaN || !extra) {
              return [[S.NaN], [], void 0];
            }
          }
          continue;
        } else if (o === S.ComplexInfinity) {
          if (coeff.is_finite() === false) {
            return [[S.NaN], [], void 0];
          }
          coeff = S.ComplexInfinity;
          continue;
        } else if (o.is_Add()) {
          seq.push(...o._args);
          continue;
        } else if (o.is_Mul()) {
          [c, s] = o.as_coeff_Mul();
        } else if (o.is_Pow()) {
          const pair = o.as_base_exp();
          const b = pair[0];
          const e = pair[1];
          if (b.is_Number() && (e.is_Integer() || e.is_Rational() && e.is_negative())) {
            seq.push(b._eval_power(e));
            continue;
          }
          [c, s] = [S.One, o];
        } else {
          c = S.One;
          s = o;
        }
        if (terms.has(s)) {
          terms.add(s, terms.get(s).__add__(c));
          if (terms.get(s) === S.NaN) {
            return [[S.NaN], [], void 0];
          }
        } else {
          terms.add(s, c);
        }
      }
      let newseq = [];
      let noncommutative = false;
      for (const item of terms.entries()) {
        const s = item[0];
        const c = item[1];
        if (c.is_zero()) {
          continue;
        } else if (c === S.One) {
          newseq.push(s);
        } else {
          if (s.is_Mul()) {
            const cs = s._new_rawargs(true, ...[c].concat(s._args));
            newseq.push(cs);
          } else if (s.is_Add()) {
            newseq.push(new Mul(false, true, c, s));
          } else {
            newseq.push(new Mul(true, true, c, s));
          }
        }
        noncommutative = noncommutative || !s.is_commutative();
      }
      const temp = [];
      if (coeff === S.Infinity) {
        for (const f of newseq) {
          if (!f.is_extended_nonnegative()) {
            temp.push(f);
          }
        }
        newseq = temp;
      } else if (coeff === S.NegativeInfinity) {
        for (const f of newseq) {
          if (!f.is_extended_nonpositive()) {
            temp.push(f);
          }
        }
        newseq = temp;
      }
      const temp2 = [];
      if (coeff === S.ComplexInfinity) {
        for (const c of newseq) {
          if (!(c.is_finite() === true || typeof c.is_extended_real() !== "undefined")) {
            temp2.push(c);
          }
        }
        newseq = temp2;
      }
      _addsort(newseq);
      if (coeff !== S.Zero) {
        newseq.splice(0, 0, coeff);
      }
      if (noncommutative) {
        return [[], newseq, void 0];
      } else {
        return [newseq, [], void 0];
      }
    }
    _eval_is_commutative() {
      const fuzzyarg = [];
      for (const a of this._args) {
        fuzzyarg.push(a.is_commutative());
      }
      return _fuzzy_group(fuzzyarg);
    }
    as_coeff_Add() {
      const [coeff, args] = [this.args[0], this.args.slice(1)];
      if (coeff.is_Number() && coeff.is_Rational()) {
        return [coeff, this._new_rawargs(true, ...args)];
      }
      return [S.Zero, this];
    }
    static _new(evaluate, simplify, ...args) {
      return new _Add(evaluate, simplify, ...args);
    }
    toString() {
      let result = "";
      const num_args = this._args.length;
      for (let i = 0; i < num_args; i++) {
        const arg = this._args[i];
        let temp;
        if (i != num_args - 1) {
          temp = arg.toString() + " + ";
        } else {
          temp = arg.toString();
        }
        result = result.concat(temp);
      }
      return result;
    }
  };
  var Add = _Add;
  Add.is_Add = true;
  Add._args_type = Expr(Object);
  Add.identity = S.Zero;
  ManagedProperties.register(Add);
  Global.register("Add", Add._new);

  // node_modules/decimal.js/decimal.mjs
  var EXP_LIMIT = 9e15;
  var MAX_DIGITS = 1e9;
  var NUMERALS = "0123456789abcdef";
  var LN10 = "2.3025850929940456840179914546843642076011014886287729760333279009675726096773524802359972050895982983419677840422862486334095254650828067566662873690987816894829072083255546808437998948262331985283935053089653777326288461633662222876982198867465436674744042432743651550489343149393914796194044002221051017141748003688084012647080685567743216228355220114804663715659121373450747856947683463616792101806445070648000277502684916746550586856935673420670581136429224554405758925724208241314695689016758940256776311356919292033376587141660230105703089634572075440370847469940168269282808481184289314848524948644871927809676271275775397027668605952496716674183485704422507197965004714951050492214776567636938662976979522110718264549734772662425709429322582798502585509785265383207606726317164309505995087807523710333101197857547331541421808427543863591778117054309827482385045648019095610299291824318237525357709750539565187697510374970888692180205189339507238539205144634197265287286965110862571492198849978748873771345686209167058";
  var PI = "3.1415926535897932384626433832795028841971693993751058209749445923078164062862089986280348253421170679821480865132823066470938446095505822317253594081284811174502841027019385211055596446229489549303819644288109756659334461284756482337867831652712019091456485669234603486104543266482133936072602491412737245870066063155881748815209209628292540917153643678925903600113305305488204665213841469519415116094330572703657595919530921861173819326117931051185480744623799627495673518857527248912279381830119491298336733624406566430860213949463952247371907021798609437027705392171762931767523846748184676694051320005681271452635608277857713427577896091736371787214684409012249534301465495853710507922796892589235420199561121290219608640344181598136297747713099605187072113499999983729780499510597317328160963185950244594553469083026425223082533446850352619311881710100031378387528865875332083814206171776691473035982534904287554687311595628638823537875937519577818577805321712268066130019278766111959092164201989380952572010654858632789";
  var DEFAULTS = {
    precision: 20,
    rounding: 4,
    modulo: 1,
    toExpNeg: -7,
    toExpPos: 21,
    minE: -EXP_LIMIT,
    maxE: EXP_LIMIT,
    crypto: false
  };
  var inexact;
  var quadrant;
  var external = true;
  var decimalError = "[DecimalError] ";
  var invalidArgument = decimalError + "Invalid argument: ";
  var precisionLimitExceeded = decimalError + "Precision limit exceeded";
  var cryptoUnavailable = decimalError + "crypto unavailable";
  var tag = "[object Decimal]";
  var mathfloor = Math.floor;
  var mathpow = Math.pow;
  var isBinary = /^0b([01]+(\.[01]*)?|\.[01]+)(p[+-]?\d+)?$/i;
  var isHex = /^0x([0-9a-f]+(\.[0-9a-f]*)?|\.[0-9a-f]+)(p[+-]?\d+)?$/i;
  var isOctal = /^0o([0-7]+(\.[0-7]*)?|\.[0-7]+)(p[+-]?\d+)?$/i;
  var isDecimal = /^(\d+(\.\d*)?|\.\d+)(e[+-]?\d+)?$/i;
  var BASE = 1e7;
  var LOG_BASE = 7;
  var MAX_SAFE_INTEGER = 9007199254740991;
  var LN10_PRECISION = LN10.length - 1;
  var PI_PRECISION = PI.length - 1;
  var P = { toStringTag: tag };
  P.absoluteValue = P.abs = function() {
    var x2 = new this.constructor(this);
    if (x2.s < 0)
      x2.s = 1;
    return finalise(x2);
  };
  P.ceil = function() {
    return finalise(new this.constructor(this), this.e + 1, 2);
  };
  P.clampedTo = P.clamp = function(min2, max2) {
    var k, x2 = this, Ctor = x2.constructor;
    min2 = new Ctor(min2);
    max2 = new Ctor(max2);
    if (!min2.s || !max2.s)
      return new Ctor(NaN);
    if (min2.gt(max2))
      throw Error(invalidArgument + max2);
    k = x2.cmp(min2);
    return k < 0 ? min2 : x2.cmp(max2) > 0 ? max2 : new Ctor(x2);
  };
  P.comparedTo = P.cmp = function(y) {
    var i, j, xdL, ydL, x2 = this, xd = x2.d, yd = (y = new x2.constructor(y)).d, xs = x2.s, ys = y.s;
    if (!xd || !yd) {
      return !xs || !ys ? NaN : xs !== ys ? xs : xd === yd ? 0 : !xd ^ xs < 0 ? 1 : -1;
    }
    if (!xd[0] || !yd[0])
      return xd[0] ? xs : yd[0] ? -ys : 0;
    if (xs !== ys)
      return xs;
    if (x2.e !== y.e)
      return x2.e > y.e ^ xs < 0 ? 1 : -1;
    xdL = xd.length;
    ydL = yd.length;
    for (i = 0, j = xdL < ydL ? xdL : ydL; i < j; ++i) {
      if (xd[i] !== yd[i])
        return xd[i] > yd[i] ^ xs < 0 ? 1 : -1;
    }
    return xdL === ydL ? 0 : xdL > ydL ^ xs < 0 ? 1 : -1;
  };
  P.cosine = P.cos = function() {
    var pr, rm, x2 = this, Ctor = x2.constructor;
    if (!x2.d)
      return new Ctor(NaN);
    if (!x2.d[0])
      return new Ctor(1);
    pr = Ctor.precision;
    rm = Ctor.rounding;
    Ctor.precision = pr + Math.max(x2.e, x2.sd()) + LOG_BASE;
    Ctor.rounding = 1;
    x2 = cosine(Ctor, toLessThanHalfPi(Ctor, x2));
    Ctor.precision = pr;
    Ctor.rounding = rm;
    return finalise(quadrant == 2 || quadrant == 3 ? x2.neg() : x2, pr, rm, true);
  };
  P.cubeRoot = P.cbrt = function() {
    var e, m, n2, r, rep, s, sd, t, t3, t3plusx, x2 = this, Ctor = x2.constructor;
    if (!x2.isFinite() || x2.isZero())
      return new Ctor(x2);
    external = false;
    s = x2.s * mathpow(x2.s * x2, 1 / 3);
    if (!s || Math.abs(s) == 1 / 0) {
      n2 = digitsToString(x2.d);
      e = x2.e;
      if (s = (e - n2.length + 1) % 3)
        n2 += s == 1 || s == -2 ? "0" : "00";
      s = mathpow(n2, 1 / 3);
      e = mathfloor((e + 1) / 3) - (e % 3 == (e < 0 ? -1 : 2));
      if (s == 1 / 0) {
        n2 = "5e" + e;
      } else {
        n2 = s.toExponential();
        n2 = n2.slice(0, n2.indexOf("e") + 1) + e;
      }
      r = new Ctor(n2);
      r.s = x2.s;
    } else {
      r = new Ctor(s.toString());
    }
    sd = (e = Ctor.precision) + 3;
    for (; ; ) {
      t = r;
      t3 = t.times(t).times(t);
      t3plusx = t3.plus(x2);
      r = divide(t3plusx.plus(x2).times(t), t3plusx.plus(t3), sd + 2, 1);
      if (digitsToString(t.d).slice(0, sd) === (n2 = digitsToString(r.d)).slice(0, sd)) {
        n2 = n2.slice(sd - 3, sd + 1);
        if (n2 == "9999" || !rep && n2 == "4999") {
          if (!rep) {
            finalise(t, e + 1, 0);
            if (t.times(t).times(t).eq(x2)) {
              r = t;
              break;
            }
          }
          sd += 4;
          rep = 1;
        } else {
          if (!+n2 || !+n2.slice(1) && n2.charAt(0) == "5") {
            finalise(r, e + 1, 1);
            m = !r.times(r).times(r).eq(x2);
          }
          break;
        }
      }
    }
    external = true;
    return finalise(r, e, Ctor.rounding, m);
  };
  P.decimalPlaces = P.dp = function() {
    var w, d = this.d, n2 = NaN;
    if (d) {
      w = d.length - 1;
      n2 = (w - mathfloor(this.e / LOG_BASE)) * LOG_BASE;
      w = d[w];
      if (w)
        for (; w % 10 == 0; w /= 10)
          n2--;
      if (n2 < 0)
        n2 = 0;
    }
    return n2;
  };
  P.dividedBy = P.div = function(y) {
    return divide(this, new this.constructor(y));
  };
  P.dividedToIntegerBy = P.divToInt = function(y) {
    var x2 = this, Ctor = x2.constructor;
    return finalise(divide(x2, new Ctor(y), 0, 1, 1), Ctor.precision, Ctor.rounding);
  };
  P.equals = P.eq = function(y) {
    return this.cmp(y) === 0;
  };
  P.floor = function() {
    return finalise(new this.constructor(this), this.e + 1, 3);
  };
  P.greaterThan = P.gt = function(y) {
    return this.cmp(y) > 0;
  };
  P.greaterThanOrEqualTo = P.gte = function(y) {
    var k = this.cmp(y);
    return k == 1 || k === 0;
  };
  P.hyperbolicCosine = P.cosh = function() {
    var k, n2, pr, rm, len, x2 = this, Ctor = x2.constructor, one = new Ctor(1);
    if (!x2.isFinite())
      return new Ctor(x2.s ? 1 / 0 : NaN);
    if (x2.isZero())
      return one;
    pr = Ctor.precision;
    rm = Ctor.rounding;
    Ctor.precision = pr + Math.max(x2.e, x2.sd()) + 4;
    Ctor.rounding = 1;
    len = x2.d.length;
    if (len < 32) {
      k = Math.ceil(len / 3);
      n2 = (1 / tinyPow(4, k)).toString();
    } else {
      k = 16;
      n2 = "2.3283064365386962890625e-10";
    }
    x2 = taylorSeries(Ctor, 1, x2.times(n2), new Ctor(1), true);
    var cosh2_x, i = k, d8 = new Ctor(8);
    for (; i--; ) {
      cosh2_x = x2.times(x2);
      x2 = one.minus(cosh2_x.times(d8.minus(cosh2_x.times(d8))));
    }
    return finalise(x2, Ctor.precision = pr, Ctor.rounding = rm, true);
  };
  P.hyperbolicSine = P.sinh = function() {
    var k, pr, rm, len, x2 = this, Ctor = x2.constructor;
    if (!x2.isFinite() || x2.isZero())
      return new Ctor(x2);
    pr = Ctor.precision;
    rm = Ctor.rounding;
    Ctor.precision = pr + Math.max(x2.e, x2.sd()) + 4;
    Ctor.rounding = 1;
    len = x2.d.length;
    if (len < 3) {
      x2 = taylorSeries(Ctor, 2, x2, x2, true);
    } else {
      k = 1.4 * Math.sqrt(len);
      k = k > 16 ? 16 : k | 0;
      x2 = x2.times(1 / tinyPow(5, k));
      x2 = taylorSeries(Ctor, 2, x2, x2, true);
      var sinh2_x, d5 = new Ctor(5), d16 = new Ctor(16), d20 = new Ctor(20);
      for (; k--; ) {
        sinh2_x = x2.times(x2);
        x2 = x2.times(d5.plus(sinh2_x.times(d16.times(sinh2_x).plus(d20))));
      }
    }
    Ctor.precision = pr;
    Ctor.rounding = rm;
    return finalise(x2, pr, rm, true);
  };
  P.hyperbolicTangent = P.tanh = function() {
    var pr, rm, x2 = this, Ctor = x2.constructor;
    if (!x2.isFinite())
      return new Ctor(x2.s);
    if (x2.isZero())
      return new Ctor(x2);
    pr = Ctor.precision;
    rm = Ctor.rounding;
    Ctor.precision = pr + 7;
    Ctor.rounding = 1;
    return divide(x2.sinh(), x2.cosh(), Ctor.precision = pr, Ctor.rounding = rm);
  };
  P.inverseCosine = P.acos = function() {
    var halfPi, x2 = this, Ctor = x2.constructor, k = x2.abs().cmp(1), pr = Ctor.precision, rm = Ctor.rounding;
    if (k !== -1) {
      return k === 0 ? x2.isNeg() ? getPi(Ctor, pr, rm) : new Ctor(0) : new Ctor(NaN);
    }
    if (x2.isZero())
      return getPi(Ctor, pr + 4, rm).times(0.5);
    Ctor.precision = pr + 6;
    Ctor.rounding = 1;
    x2 = x2.asin();
    halfPi = getPi(Ctor, pr + 4, rm).times(0.5);
    Ctor.precision = pr;
    Ctor.rounding = rm;
    return halfPi.minus(x2);
  };
  P.inverseHyperbolicCosine = P.acosh = function() {
    var pr, rm, x2 = this, Ctor = x2.constructor;
    if (x2.lte(1))
      return new Ctor(x2.eq(1) ? 0 : NaN);
    if (!x2.isFinite())
      return new Ctor(x2);
    pr = Ctor.precision;
    rm = Ctor.rounding;
    Ctor.precision = pr + Math.max(Math.abs(x2.e), x2.sd()) + 4;
    Ctor.rounding = 1;
    external = false;
    x2 = x2.times(x2).minus(1).sqrt().plus(x2);
    external = true;
    Ctor.precision = pr;
    Ctor.rounding = rm;
    return x2.ln();
  };
  P.inverseHyperbolicSine = P.asinh = function() {
    var pr, rm, x2 = this, Ctor = x2.constructor;
    if (!x2.isFinite() || x2.isZero())
      return new Ctor(x2);
    pr = Ctor.precision;
    rm = Ctor.rounding;
    Ctor.precision = pr + 2 * Math.max(Math.abs(x2.e), x2.sd()) + 6;
    Ctor.rounding = 1;
    external = false;
    x2 = x2.times(x2).plus(1).sqrt().plus(x2);
    external = true;
    Ctor.precision = pr;
    Ctor.rounding = rm;
    return x2.ln();
  };
  P.inverseHyperbolicTangent = P.atanh = function() {
    var pr, rm, wpr, xsd, x2 = this, Ctor = x2.constructor;
    if (!x2.isFinite())
      return new Ctor(NaN);
    if (x2.e >= 0)
      return new Ctor(x2.abs().eq(1) ? x2.s / 0 : x2.isZero() ? x2 : NaN);
    pr = Ctor.precision;
    rm = Ctor.rounding;
    xsd = x2.sd();
    if (Math.max(xsd, pr) < 2 * -x2.e - 1)
      return finalise(new Ctor(x2), pr, rm, true);
    Ctor.precision = wpr = xsd - x2.e;
    x2 = divide(x2.plus(1), new Ctor(1).minus(x2), wpr + pr, 1);
    Ctor.precision = pr + 4;
    Ctor.rounding = 1;
    x2 = x2.ln();
    Ctor.precision = pr;
    Ctor.rounding = rm;
    return x2.times(0.5);
  };
  P.inverseSine = P.asin = function() {
    var halfPi, k, pr, rm, x2 = this, Ctor = x2.constructor;
    if (x2.isZero())
      return new Ctor(x2);
    k = x2.abs().cmp(1);
    pr = Ctor.precision;
    rm = Ctor.rounding;
    if (k !== -1) {
      if (k === 0) {
        halfPi = getPi(Ctor, pr + 4, rm).times(0.5);
        halfPi.s = x2.s;
        return halfPi;
      }
      return new Ctor(NaN);
    }
    Ctor.precision = pr + 6;
    Ctor.rounding = 1;
    x2 = x2.div(new Ctor(1).minus(x2.times(x2)).sqrt().plus(1)).atan();
    Ctor.precision = pr;
    Ctor.rounding = rm;
    return x2.times(2);
  };
  P.inverseTangent = P.atan = function() {
    var i, j, k, n2, px, t, r, wpr, x2, x3 = this, Ctor = x3.constructor, pr = Ctor.precision, rm = Ctor.rounding;
    if (!x3.isFinite()) {
      if (!x3.s)
        return new Ctor(NaN);
      if (pr + 4 <= PI_PRECISION) {
        r = getPi(Ctor, pr + 4, rm).times(0.5);
        r.s = x3.s;
        return r;
      }
    } else if (x3.isZero()) {
      return new Ctor(x3);
    } else if (x3.abs().eq(1) && pr + 4 <= PI_PRECISION) {
      r = getPi(Ctor, pr + 4, rm).times(0.25);
      r.s = x3.s;
      return r;
    }
    Ctor.precision = wpr = pr + 10;
    Ctor.rounding = 1;
    k = Math.min(28, wpr / LOG_BASE + 2 | 0);
    for (i = k; i; --i)
      x3 = x3.div(x3.times(x3).plus(1).sqrt().plus(1));
    external = false;
    j = Math.ceil(wpr / LOG_BASE);
    n2 = 1;
    x2 = x3.times(x3);
    r = new Ctor(x3);
    px = x3;
    for (; i !== -1; ) {
      px = px.times(x2);
      t = r.minus(px.div(n2 += 2));
      px = px.times(x2);
      r = t.plus(px.div(n2 += 2));
      if (r.d[j] !== void 0)
        for (i = j; r.d[i] === t.d[i] && i--; )
          ;
    }
    if (k)
      r = r.times(2 << k - 1);
    external = true;
    return finalise(r, Ctor.precision = pr, Ctor.rounding = rm, true);
  };
  P.isFinite = function() {
    return !!this.d;
  };
  P.isInteger = P.isInt = function() {
    return !!this.d && mathfloor(this.e / LOG_BASE) > this.d.length - 2;
  };
  P.isNaN = function() {
    return !this.s;
  };
  P.isNegative = P.isNeg = function() {
    return this.s < 0;
  };
  P.isPositive = P.isPos = function() {
    return this.s > 0;
  };
  P.isZero = function() {
    return !!this.d && this.d[0] === 0;
  };
  P.lessThan = P.lt = function(y) {
    return this.cmp(y) < 0;
  };
  P.lessThanOrEqualTo = P.lte = function(y) {
    return this.cmp(y) < 1;
  };
  P.logarithm = P.log = function(base2) {
    var isBase10, d, denominator, k, inf, num, sd, r, arg = this, Ctor = arg.constructor, pr = Ctor.precision, rm = Ctor.rounding, guard = 5;
    if (base2 == null) {
      base2 = new Ctor(10);
      isBase10 = true;
    } else {
      base2 = new Ctor(base2);
      d = base2.d;
      if (base2.s < 0 || !d || !d[0] || base2.eq(1))
        return new Ctor(NaN);
      isBase10 = base2.eq(10);
    }
    d = arg.d;
    if (arg.s < 0 || !d || !d[0] || arg.eq(1)) {
      return new Ctor(d && !d[0] ? -1 / 0 : arg.s != 1 ? NaN : d ? 0 : 1 / 0);
    }
    if (isBase10) {
      if (d.length > 1) {
        inf = true;
      } else {
        for (k = d[0]; k % 10 === 0; )
          k /= 10;
        inf = k !== 1;
      }
    }
    external = false;
    sd = pr + guard;
    num = naturalLogarithm(arg, sd);
    denominator = isBase10 ? getLn10(Ctor, sd + 10) : naturalLogarithm(base2, sd);
    r = divide(num, denominator, sd, 1);
    if (checkRoundingDigits(r.d, k = pr, rm)) {
      do {
        sd += 10;
        num = naturalLogarithm(arg, sd);
        denominator = isBase10 ? getLn10(Ctor, sd + 10) : naturalLogarithm(base2, sd);
        r = divide(num, denominator, sd, 1);
        if (!inf) {
          if (+digitsToString(r.d).slice(k + 1, k + 15) + 1 == 1e14) {
            r = finalise(r, pr + 1, 0);
          }
          break;
        }
      } while (checkRoundingDigits(r.d, k += 10, rm));
    }
    external = true;
    return finalise(r, pr, rm);
  };
  P.minus = P.sub = function(y) {
    var d, e, i, j, k, len, pr, rm, xd, xe, xLTy, yd, x2 = this, Ctor = x2.constructor;
    y = new Ctor(y);
    if (!x2.d || !y.d) {
      if (!x2.s || !y.s)
        y = new Ctor(NaN);
      else if (x2.d)
        y.s = -y.s;
      else
        y = new Ctor(y.d || x2.s !== y.s ? x2 : NaN);
      return y;
    }
    if (x2.s != y.s) {
      y.s = -y.s;
      return x2.plus(y);
    }
    xd = x2.d;
    yd = y.d;
    pr = Ctor.precision;
    rm = Ctor.rounding;
    if (!xd[0] || !yd[0]) {
      if (yd[0])
        y.s = -y.s;
      else if (xd[0])
        y = new Ctor(x2);
      else
        return new Ctor(rm === 3 ? -0 : 0);
      return external ? finalise(y, pr, rm) : y;
    }
    e = mathfloor(y.e / LOG_BASE);
    xe = mathfloor(x2.e / LOG_BASE);
    xd = xd.slice();
    k = xe - e;
    if (k) {
      xLTy = k < 0;
      if (xLTy) {
        d = xd;
        k = -k;
        len = yd.length;
      } else {
        d = yd;
        e = xe;
        len = xd.length;
      }
      i = Math.max(Math.ceil(pr / LOG_BASE), len) + 2;
      if (k > i) {
        k = i;
        d.length = 1;
      }
      d.reverse();
      for (i = k; i--; )
        d.push(0);
      d.reverse();
    } else {
      i = xd.length;
      len = yd.length;
      xLTy = i < len;
      if (xLTy)
        len = i;
      for (i = 0; i < len; i++) {
        if (xd[i] != yd[i]) {
          xLTy = xd[i] < yd[i];
          break;
        }
      }
      k = 0;
    }
    if (xLTy) {
      d = xd;
      xd = yd;
      yd = d;
      y.s = -y.s;
    }
    len = xd.length;
    for (i = yd.length - len; i > 0; --i)
      xd[len++] = 0;
    for (i = yd.length; i > k; ) {
      if (xd[--i] < yd[i]) {
        for (j = i; j && xd[--j] === 0; )
          xd[j] = BASE - 1;
        --xd[j];
        xd[i] += BASE;
      }
      xd[i] -= yd[i];
    }
    for (; xd[--len] === 0; )
      xd.pop();
    for (; xd[0] === 0; xd.shift())
      --e;
    if (!xd[0])
      return new Ctor(rm === 3 ? -0 : 0);
    y.d = xd;
    y.e = getBase10Exponent(xd, e);
    return external ? finalise(y, pr, rm) : y;
  };
  P.modulo = P.mod = function(y) {
    var q, x2 = this, Ctor = x2.constructor;
    y = new Ctor(y);
    if (!x2.d || !y.s || y.d && !y.d[0])
      return new Ctor(NaN);
    if (!y.d || x2.d && !x2.d[0]) {
      return finalise(new Ctor(x2), Ctor.precision, Ctor.rounding);
    }
    external = false;
    if (Ctor.modulo == 9) {
      q = divide(x2, y.abs(), 0, 3, 1);
      q.s *= y.s;
    } else {
      q = divide(x2, y, 0, Ctor.modulo, 1);
    }
    q = q.times(y);
    external = true;
    return x2.minus(q);
  };
  P.naturalExponential = P.exp = function() {
    return naturalExponential(this);
  };
  P.naturalLogarithm = P.ln = function() {
    return naturalLogarithm(this);
  };
  P.negated = P.neg = function() {
    var x2 = new this.constructor(this);
    x2.s = -x2.s;
    return finalise(x2);
  };
  P.plus = P.add = function(y) {
    var carry, d, e, i, k, len, pr, rm, xd, yd, x2 = this, Ctor = x2.constructor;
    y = new Ctor(y);
    if (!x2.d || !y.d) {
      if (!x2.s || !y.s)
        y = new Ctor(NaN);
      else if (!x2.d)
        y = new Ctor(y.d || x2.s === y.s ? x2 : NaN);
      return y;
    }
    if (x2.s != y.s) {
      y.s = -y.s;
      return x2.minus(y);
    }
    xd = x2.d;
    yd = y.d;
    pr = Ctor.precision;
    rm = Ctor.rounding;
    if (!xd[0] || !yd[0]) {
      if (!yd[0])
        y = new Ctor(x2);
      return external ? finalise(y, pr, rm) : y;
    }
    k = mathfloor(x2.e / LOG_BASE);
    e = mathfloor(y.e / LOG_BASE);
    xd = xd.slice();
    i = k - e;
    if (i) {
      if (i < 0) {
        d = xd;
        i = -i;
        len = yd.length;
      } else {
        d = yd;
        e = k;
        len = xd.length;
      }
      k = Math.ceil(pr / LOG_BASE);
      len = k > len ? k + 1 : len + 1;
      if (i > len) {
        i = len;
        d.length = 1;
      }
      d.reverse();
      for (; i--; )
        d.push(0);
      d.reverse();
    }
    len = xd.length;
    i = yd.length;
    if (len - i < 0) {
      i = len;
      d = yd;
      yd = xd;
      xd = d;
    }
    for (carry = 0; i; ) {
      carry = (xd[--i] = xd[i] + yd[i] + carry) / BASE | 0;
      xd[i] %= BASE;
    }
    if (carry) {
      xd.unshift(carry);
      ++e;
    }
    for (len = xd.length; xd[--len] == 0; )
      xd.pop();
    y.d = xd;
    y.e = getBase10Exponent(xd, e);
    return external ? finalise(y, pr, rm) : y;
  };
  P.precision = P.sd = function(z) {
    var k, x2 = this;
    if (z !== void 0 && z !== !!z && z !== 1 && z !== 0)
      throw Error(invalidArgument + z);
    if (x2.d) {
      k = getPrecision(x2.d);
      if (z && x2.e + 1 > k)
        k = x2.e + 1;
    } else {
      k = NaN;
    }
    return k;
  };
  P.round = function() {
    var x2 = this, Ctor = x2.constructor;
    return finalise(new Ctor(x2), x2.e + 1, Ctor.rounding);
  };
  P.sine = P.sin = function() {
    var pr, rm, x2 = this, Ctor = x2.constructor;
    if (!x2.isFinite())
      return new Ctor(NaN);
    if (x2.isZero())
      return new Ctor(x2);
    pr = Ctor.precision;
    rm = Ctor.rounding;
    Ctor.precision = pr + Math.max(x2.e, x2.sd()) + LOG_BASE;
    Ctor.rounding = 1;
    x2 = sine(Ctor, toLessThanHalfPi(Ctor, x2));
    Ctor.precision = pr;
    Ctor.rounding = rm;
    return finalise(quadrant > 2 ? x2.neg() : x2, pr, rm, true);
  };
  P.squareRoot = P.sqrt = function() {
    var m, n2, sd, r, rep, t, x2 = this, d = x2.d, e = x2.e, s = x2.s, Ctor = x2.constructor;
    if (s !== 1 || !d || !d[0]) {
      return new Ctor(!s || s < 0 && (!d || d[0]) ? NaN : d ? x2 : 1 / 0);
    }
    external = false;
    s = Math.sqrt(+x2);
    if (s == 0 || s == 1 / 0) {
      n2 = digitsToString(d);
      if ((n2.length + e) % 2 == 0)
        n2 += "0";
      s = Math.sqrt(n2);
      e = mathfloor((e + 1) / 2) - (e < 0 || e % 2);
      if (s == 1 / 0) {
        n2 = "5e" + e;
      } else {
        n2 = s.toExponential();
        n2 = n2.slice(0, n2.indexOf("e") + 1) + e;
      }
      r = new Ctor(n2);
    } else {
      r = new Ctor(s.toString());
    }
    sd = (e = Ctor.precision) + 3;
    for (; ; ) {
      t = r;
      r = t.plus(divide(x2, t, sd + 2, 1)).times(0.5);
      if (digitsToString(t.d).slice(0, sd) === (n2 = digitsToString(r.d)).slice(0, sd)) {
        n2 = n2.slice(sd - 3, sd + 1);
        if (n2 == "9999" || !rep && n2 == "4999") {
          if (!rep) {
            finalise(t, e + 1, 0);
            if (t.times(t).eq(x2)) {
              r = t;
              break;
            }
          }
          sd += 4;
          rep = 1;
        } else {
          if (!+n2 || !+n2.slice(1) && n2.charAt(0) == "5") {
            finalise(r, e + 1, 1);
            m = !r.times(r).eq(x2);
          }
          break;
        }
      }
    }
    external = true;
    return finalise(r, e, Ctor.rounding, m);
  };
  P.tangent = P.tan = function() {
    var pr, rm, x2 = this, Ctor = x2.constructor;
    if (!x2.isFinite())
      return new Ctor(NaN);
    if (x2.isZero())
      return new Ctor(x2);
    pr = Ctor.precision;
    rm = Ctor.rounding;
    Ctor.precision = pr + 10;
    Ctor.rounding = 1;
    x2 = x2.sin();
    x2.s = 1;
    x2 = divide(x2, new Ctor(1).minus(x2.times(x2)).sqrt(), pr + 10, 0);
    Ctor.precision = pr;
    Ctor.rounding = rm;
    return finalise(quadrant == 2 || quadrant == 4 ? x2.neg() : x2, pr, rm, true);
  };
  P.times = P.mul = function(y) {
    var carry, e, i, k, r, rL, t, xdL, ydL, x2 = this, Ctor = x2.constructor, xd = x2.d, yd = (y = new Ctor(y)).d;
    y.s *= x2.s;
    if (!xd || !xd[0] || !yd || !yd[0]) {
      return new Ctor(!y.s || xd && !xd[0] && !yd || yd && !yd[0] && !xd ? NaN : !xd || !yd ? y.s / 0 : y.s * 0);
    }
    e = mathfloor(x2.e / LOG_BASE) + mathfloor(y.e / LOG_BASE);
    xdL = xd.length;
    ydL = yd.length;
    if (xdL < ydL) {
      r = xd;
      xd = yd;
      yd = r;
      rL = xdL;
      xdL = ydL;
      ydL = rL;
    }
    r = [];
    rL = xdL + ydL;
    for (i = rL; i--; )
      r.push(0);
    for (i = ydL; --i >= 0; ) {
      carry = 0;
      for (k = xdL + i; k > i; ) {
        t = r[k] + yd[i] * xd[k - i - 1] + carry;
        r[k--] = t % BASE | 0;
        carry = t / BASE | 0;
      }
      r[k] = (r[k] + carry) % BASE | 0;
    }
    for (; !r[--rL]; )
      r.pop();
    if (carry)
      ++e;
    else
      r.shift();
    y.d = r;
    y.e = getBase10Exponent(r, e);
    return external ? finalise(y, Ctor.precision, Ctor.rounding) : y;
  };
  P.toBinary = function(sd, rm) {
    return toStringBinary(this, 2, sd, rm);
  };
  P.toDecimalPlaces = P.toDP = function(dp, rm) {
    var x2 = this, Ctor = x2.constructor;
    x2 = new Ctor(x2);
    if (dp === void 0)
      return x2;
    checkInt32(dp, 0, MAX_DIGITS);
    if (rm === void 0)
      rm = Ctor.rounding;
    else
      checkInt32(rm, 0, 8);
    return finalise(x2, dp + x2.e + 1, rm);
  };
  P.toExponential = function(dp, rm) {
    var str, x2 = this, Ctor = x2.constructor;
    if (dp === void 0) {
      str = finiteToString(x2, true);
    } else {
      checkInt32(dp, 0, MAX_DIGITS);
      if (rm === void 0)
        rm = Ctor.rounding;
      else
        checkInt32(rm, 0, 8);
      x2 = finalise(new Ctor(x2), dp + 1, rm);
      str = finiteToString(x2, true, dp + 1);
    }
    return x2.isNeg() && !x2.isZero() ? "-" + str : str;
  };
  P.toFixed = function(dp, rm) {
    var str, y, x2 = this, Ctor = x2.constructor;
    if (dp === void 0) {
      str = finiteToString(x2);
    } else {
      checkInt32(dp, 0, MAX_DIGITS);
      if (rm === void 0)
        rm = Ctor.rounding;
      else
        checkInt32(rm, 0, 8);
      y = finalise(new Ctor(x2), dp + x2.e + 1, rm);
      str = finiteToString(y, false, dp + y.e + 1);
    }
    return x2.isNeg() && !x2.isZero() ? "-" + str : str;
  };
  P.toFraction = function(maxD) {
    var d, d0, d1, d2, e, k, n2, n0, n1, pr, q, r, x2 = this, xd = x2.d, Ctor = x2.constructor;
    if (!xd)
      return new Ctor(x2);
    n1 = d0 = new Ctor(1);
    d1 = n0 = new Ctor(0);
    d = new Ctor(d1);
    e = d.e = getPrecision(xd) - x2.e - 1;
    k = e % LOG_BASE;
    d.d[0] = mathpow(10, k < 0 ? LOG_BASE + k : k);
    if (maxD == null) {
      maxD = e > 0 ? d : n1;
    } else {
      n2 = new Ctor(maxD);
      if (!n2.isInt() || n2.lt(n1))
        throw Error(invalidArgument + n2);
      maxD = n2.gt(d) ? e > 0 ? d : n1 : n2;
    }
    external = false;
    n2 = new Ctor(digitsToString(xd));
    pr = Ctor.precision;
    Ctor.precision = e = xd.length * LOG_BASE * 2;
    for (; ; ) {
      q = divide(n2, d, 0, 1, 1);
      d2 = d0.plus(q.times(d1));
      if (d2.cmp(maxD) == 1)
        break;
      d0 = d1;
      d1 = d2;
      d2 = n1;
      n1 = n0.plus(q.times(d2));
      n0 = d2;
      d2 = d;
      d = n2.minus(q.times(d2));
      n2 = d2;
    }
    d2 = divide(maxD.minus(d0), d1, 0, 1, 1);
    n0 = n0.plus(d2.times(n1));
    d0 = d0.plus(d2.times(d1));
    n0.s = n1.s = x2.s;
    r = divide(n1, d1, e, 1).minus(x2).abs().cmp(divide(n0, d0, e, 1).minus(x2).abs()) < 1 ? [n1, d1] : [n0, d0];
    Ctor.precision = pr;
    external = true;
    return r;
  };
  P.toHexadecimal = P.toHex = function(sd, rm) {
    return toStringBinary(this, 16, sd, rm);
  };
  P.toNearest = function(y, rm) {
    var x2 = this, Ctor = x2.constructor;
    x2 = new Ctor(x2);
    if (y == null) {
      if (!x2.d)
        return x2;
      y = new Ctor(1);
      rm = Ctor.rounding;
    } else {
      y = new Ctor(y);
      if (rm === void 0) {
        rm = Ctor.rounding;
      } else {
        checkInt32(rm, 0, 8);
      }
      if (!x2.d)
        return y.s ? x2 : y;
      if (!y.d) {
        if (y.s)
          y.s = x2.s;
        return y;
      }
    }
    if (y.d[0]) {
      external = false;
      x2 = divide(x2, y, 0, rm, 1).times(y);
      external = true;
      finalise(x2);
    } else {
      y.s = x2.s;
      x2 = y;
    }
    return x2;
  };
  P.toNumber = function() {
    return +this;
  };
  P.toOctal = function(sd, rm) {
    return toStringBinary(this, 8, sd, rm);
  };
  P.toPower = P.pow = function(y) {
    var e, k, pr, r, rm, s, x2 = this, Ctor = x2.constructor, yn = +(y = new Ctor(y));
    if (!x2.d || !y.d || !x2.d[0] || !y.d[0])
      return new Ctor(mathpow(+x2, yn));
    x2 = new Ctor(x2);
    if (x2.eq(1))
      return x2;
    pr = Ctor.precision;
    rm = Ctor.rounding;
    if (y.eq(1))
      return finalise(x2, pr, rm);
    e = mathfloor(y.e / LOG_BASE);
    if (e >= y.d.length - 1 && (k = yn < 0 ? -yn : yn) <= MAX_SAFE_INTEGER) {
      r = intPow(Ctor, x2, k, pr);
      return y.s < 0 ? new Ctor(1).div(r) : finalise(r, pr, rm);
    }
    s = x2.s;
    if (s < 0) {
      if (e < y.d.length - 1)
        return new Ctor(NaN);
      if ((y.d[e] & 1) == 0)
        s = 1;
      if (x2.e == 0 && x2.d[0] == 1 && x2.d.length == 1) {
        x2.s = s;
        return x2;
      }
    }
    k = mathpow(+x2, yn);
    e = k == 0 || !isFinite(k) ? mathfloor(yn * (Math.log("0." + digitsToString(x2.d)) / Math.LN10 + x2.e + 1)) : new Ctor(k + "").e;
    if (e > Ctor.maxE + 1 || e < Ctor.minE - 1)
      return new Ctor(e > 0 ? s / 0 : 0);
    external = false;
    Ctor.rounding = x2.s = 1;
    k = Math.min(12, (e + "").length);
    r = naturalExponential(y.times(naturalLogarithm(x2, pr + k)), pr);
    if (r.d) {
      r = finalise(r, pr + 5, 1);
      if (checkRoundingDigits(r.d, pr, rm)) {
        e = pr + 10;
        r = finalise(naturalExponential(y.times(naturalLogarithm(x2, e + k)), e), e + 5, 1);
        if (+digitsToString(r.d).slice(pr + 1, pr + 15) + 1 == 1e14) {
          r = finalise(r, pr + 1, 0);
        }
      }
    }
    r.s = s;
    external = true;
    Ctor.rounding = rm;
    return finalise(r, pr, rm);
  };
  P.toPrecision = function(sd, rm) {
    var str, x2 = this, Ctor = x2.constructor;
    if (sd === void 0) {
      str = finiteToString(x2, x2.e <= Ctor.toExpNeg || x2.e >= Ctor.toExpPos);
    } else {
      checkInt32(sd, 1, MAX_DIGITS);
      if (rm === void 0)
        rm = Ctor.rounding;
      else
        checkInt32(rm, 0, 8);
      x2 = finalise(new Ctor(x2), sd, rm);
      str = finiteToString(x2, sd <= x2.e || x2.e <= Ctor.toExpNeg, sd);
    }
    return x2.isNeg() && !x2.isZero() ? "-" + str : str;
  };
  P.toSignificantDigits = P.toSD = function(sd, rm) {
    var x2 = this, Ctor = x2.constructor;
    if (sd === void 0) {
      sd = Ctor.precision;
      rm = Ctor.rounding;
    } else {
      checkInt32(sd, 1, MAX_DIGITS);
      if (rm === void 0)
        rm = Ctor.rounding;
      else
        checkInt32(rm, 0, 8);
    }
    return finalise(new Ctor(x2), sd, rm);
  };
  P.toString = function() {
    var x2 = this, Ctor = x2.constructor, str = finiteToString(x2, x2.e <= Ctor.toExpNeg || x2.e >= Ctor.toExpPos);
    return x2.isNeg() && !x2.isZero() ? "-" + str : str;
  };
  P.truncated = P.trunc = function() {
    return finalise(new this.constructor(this), this.e + 1, 1);
  };
  P.valueOf = P.toJSON = function() {
    var x2 = this, Ctor = x2.constructor, str = finiteToString(x2, x2.e <= Ctor.toExpNeg || x2.e >= Ctor.toExpPos);
    return x2.isNeg() ? "-" + str : str;
  };
  function digitsToString(d) {
    var i, k, ws, indexOfLastWord = d.length - 1, str = "", w = d[0];
    if (indexOfLastWord > 0) {
      str += w;
      for (i = 1; i < indexOfLastWord; i++) {
        ws = d[i] + "";
        k = LOG_BASE - ws.length;
        if (k)
          str += getZeroString(k);
        str += ws;
      }
      w = d[i];
      ws = w + "";
      k = LOG_BASE - ws.length;
      if (k)
        str += getZeroString(k);
    } else if (w === 0) {
      return "0";
    }
    for (; w % 10 === 0; )
      w /= 10;
    return str + w;
  }
  function checkInt32(i, min2, max2) {
    if (i !== ~~i || i < min2 || i > max2) {
      throw Error(invalidArgument + i);
    }
  }
  function checkRoundingDigits(d, i, rm, repeating) {
    var di, k, r, rd;
    for (k = d[0]; k >= 10; k /= 10)
      --i;
    if (--i < 0) {
      i += LOG_BASE;
      di = 0;
    } else {
      di = Math.ceil((i + 1) / LOG_BASE);
      i %= LOG_BASE;
    }
    k = mathpow(10, LOG_BASE - i);
    rd = d[di] % k | 0;
    if (repeating == null) {
      if (i < 3) {
        if (i == 0)
          rd = rd / 100 | 0;
        else if (i == 1)
          rd = rd / 10 | 0;
        r = rm < 4 && rd == 99999 || rm > 3 && rd == 49999 || rd == 5e4 || rd == 0;
      } else {
        r = (rm < 4 && rd + 1 == k || rm > 3 && rd + 1 == k / 2) && (d[di + 1] / k / 100 | 0) == mathpow(10, i - 2) - 1 || (rd == k / 2 || rd == 0) && (d[di + 1] / k / 100 | 0) == 0;
      }
    } else {
      if (i < 4) {
        if (i == 0)
          rd = rd / 1e3 | 0;
        else if (i == 1)
          rd = rd / 100 | 0;
        else if (i == 2)
          rd = rd / 10 | 0;
        r = (repeating || rm < 4) && rd == 9999 || !repeating && rm > 3 && rd == 4999;
      } else {
        r = ((repeating || rm < 4) && rd + 1 == k || !repeating && rm > 3 && rd + 1 == k / 2) && (d[di + 1] / k / 1e3 | 0) == mathpow(10, i - 3) - 1;
      }
    }
    return r;
  }
  function convertBase(str, baseIn, baseOut) {
    var j, arr = [0], arrL, i = 0, strL = str.length;
    for (; i < strL; ) {
      for (arrL = arr.length; arrL--; )
        arr[arrL] *= baseIn;
      arr[0] += NUMERALS.indexOf(str.charAt(i++));
      for (j = 0; j < arr.length; j++) {
        if (arr[j] > baseOut - 1) {
          if (arr[j + 1] === void 0)
            arr[j + 1] = 0;
          arr[j + 1] += arr[j] / baseOut | 0;
          arr[j] %= baseOut;
        }
      }
    }
    return arr.reverse();
  }
  function cosine(Ctor, x2) {
    var k, len, y;
    if (x2.isZero())
      return x2;
    len = x2.d.length;
    if (len < 32) {
      k = Math.ceil(len / 3);
      y = (1 / tinyPow(4, k)).toString();
    } else {
      k = 16;
      y = "2.3283064365386962890625e-10";
    }
    Ctor.precision += k;
    x2 = taylorSeries(Ctor, 1, x2.times(y), new Ctor(1));
    for (var i = k; i--; ) {
      var cos2x = x2.times(x2);
      x2 = cos2x.times(cos2x).minus(cos2x).times(8).plus(1);
    }
    Ctor.precision -= k;
    return x2;
  }
  var divide = function() {
    function multiplyInteger(x2, k, base2) {
      var temp, carry = 0, i = x2.length;
      for (x2 = x2.slice(); i--; ) {
        temp = x2[i] * k + carry;
        x2[i] = temp % base2 | 0;
        carry = temp / base2 | 0;
      }
      if (carry)
        x2.unshift(carry);
      return x2;
    }
    function compare(a, b, aL, bL) {
      var i, r;
      if (aL != bL) {
        r = aL > bL ? 1 : -1;
      } else {
        for (i = r = 0; i < aL; i++) {
          if (a[i] != b[i]) {
            r = a[i] > b[i] ? 1 : -1;
            break;
          }
        }
      }
      return r;
    }
    function subtract(a, b, aL, base2) {
      var i = 0;
      for (; aL--; ) {
        a[aL] -= i;
        i = a[aL] < b[aL] ? 1 : 0;
        a[aL] = i * base2 + a[aL] - b[aL];
      }
      for (; !a[0] && a.length > 1; )
        a.shift();
    }
    return function(x2, y, pr, rm, dp, base2) {
      var cmp, e, i, k, logBase, more, prod, prodL, q, qd, rem, remL, rem0, sd, t, xi, xL, yd0, yL, yz, Ctor = x2.constructor, sign2 = x2.s == y.s ? 1 : -1, xd = x2.d, yd = y.d;
      if (!xd || !xd[0] || !yd || !yd[0]) {
        return new Ctor(
          !x2.s || !y.s || (xd ? yd && xd[0] == yd[0] : !yd) ? NaN : xd && xd[0] == 0 || !yd ? sign2 * 0 : sign2 / 0
        );
      }
      if (base2) {
        logBase = 1;
        e = x2.e - y.e;
      } else {
        base2 = BASE;
        logBase = LOG_BASE;
        e = mathfloor(x2.e / logBase) - mathfloor(y.e / logBase);
      }
      yL = yd.length;
      xL = xd.length;
      q = new Ctor(sign2);
      qd = q.d = [];
      for (i = 0; yd[i] == (xd[i] || 0); i++)
        ;
      if (yd[i] > (xd[i] || 0))
        e--;
      if (pr == null) {
        sd = pr = Ctor.precision;
        rm = Ctor.rounding;
      } else if (dp) {
        sd = pr + (x2.e - y.e) + 1;
      } else {
        sd = pr;
      }
      if (sd < 0) {
        qd.push(1);
        more = true;
      } else {
        sd = sd / logBase + 2 | 0;
        i = 0;
        if (yL == 1) {
          k = 0;
          yd = yd[0];
          sd++;
          for (; (i < xL || k) && sd--; i++) {
            t = k * base2 + (xd[i] || 0);
            qd[i] = t / yd | 0;
            k = t % yd | 0;
          }
          more = k || i < xL;
        } else {
          k = base2 / (yd[0] + 1) | 0;
          if (k > 1) {
            yd = multiplyInteger(yd, k, base2);
            xd = multiplyInteger(xd, k, base2);
            yL = yd.length;
            xL = xd.length;
          }
          xi = yL;
          rem = xd.slice(0, yL);
          remL = rem.length;
          for (; remL < yL; )
            rem[remL++] = 0;
          yz = yd.slice();
          yz.unshift(0);
          yd0 = yd[0];
          if (yd[1] >= base2 / 2)
            ++yd0;
          do {
            k = 0;
            cmp = compare(yd, rem, yL, remL);
            if (cmp < 0) {
              rem0 = rem[0];
              if (yL != remL)
                rem0 = rem0 * base2 + (rem[1] || 0);
              k = rem0 / yd0 | 0;
              if (k > 1) {
                if (k >= base2)
                  k = base2 - 1;
                prod = multiplyInteger(yd, k, base2);
                prodL = prod.length;
                remL = rem.length;
                cmp = compare(prod, rem, prodL, remL);
                if (cmp == 1) {
                  k--;
                  subtract(prod, yL < prodL ? yz : yd, prodL, base2);
                }
              } else {
                if (k == 0)
                  cmp = k = 1;
                prod = yd.slice();
              }
              prodL = prod.length;
              if (prodL < remL)
                prod.unshift(0);
              subtract(rem, prod, remL, base2);
              if (cmp == -1) {
                remL = rem.length;
                cmp = compare(yd, rem, yL, remL);
                if (cmp < 1) {
                  k++;
                  subtract(rem, yL < remL ? yz : yd, remL, base2);
                }
              }
              remL = rem.length;
            } else if (cmp === 0) {
              k++;
              rem = [0];
            }
            qd[i++] = k;
            if (cmp && rem[0]) {
              rem[remL++] = xd[xi] || 0;
            } else {
              rem = [xd[xi]];
              remL = 1;
            }
          } while ((xi++ < xL || rem[0] !== void 0) && sd--);
          more = rem[0] !== void 0;
        }
        if (!qd[0])
          qd.shift();
      }
      if (logBase == 1) {
        q.e = e;
        inexact = more;
      } else {
        for (i = 1, k = qd[0]; k >= 10; k /= 10)
          i++;
        q.e = i + e * logBase - 1;
        finalise(q, dp ? pr + q.e + 1 : pr, rm, more);
      }
      return q;
    };
  }();
  function finalise(x2, sd, rm, isTruncated) {
    var digits, i, j, k, rd, roundUp, w, xd, xdi, Ctor = x2.constructor;
    out:
      if (sd != null) {
        xd = x2.d;
        if (!xd)
          return x2;
        for (digits = 1, k = xd[0]; k >= 10; k /= 10)
          digits++;
        i = sd - digits;
        if (i < 0) {
          i += LOG_BASE;
          j = sd;
          w = xd[xdi = 0];
          rd = w / mathpow(10, digits - j - 1) % 10 | 0;
        } else {
          xdi = Math.ceil((i + 1) / LOG_BASE);
          k = xd.length;
          if (xdi >= k) {
            if (isTruncated) {
              for (; k++ <= xdi; )
                xd.push(0);
              w = rd = 0;
              digits = 1;
              i %= LOG_BASE;
              j = i - LOG_BASE + 1;
            } else {
              break out;
            }
          } else {
            w = k = xd[xdi];
            for (digits = 1; k >= 10; k /= 10)
              digits++;
            i %= LOG_BASE;
            j = i - LOG_BASE + digits;
            rd = j < 0 ? 0 : w / mathpow(10, digits - j - 1) % 10 | 0;
          }
        }
        isTruncated = isTruncated || sd < 0 || xd[xdi + 1] !== void 0 || (j < 0 ? w : w % mathpow(10, digits - j - 1));
        roundUp = rm < 4 ? (rd || isTruncated) && (rm == 0 || rm == (x2.s < 0 ? 3 : 2)) : rd > 5 || rd == 5 && (rm == 4 || isTruncated || rm == 6 && (i > 0 ? j > 0 ? w / mathpow(10, digits - j) : 0 : xd[xdi - 1]) % 10 & 1 || rm == (x2.s < 0 ? 8 : 7));
        if (sd < 1 || !xd[0]) {
          xd.length = 0;
          if (roundUp) {
            sd -= x2.e + 1;
            xd[0] = mathpow(10, (LOG_BASE - sd % LOG_BASE) % LOG_BASE);
            x2.e = -sd || 0;
          } else {
            xd[0] = x2.e = 0;
          }
          return x2;
        }
        if (i == 0) {
          xd.length = xdi;
          k = 1;
          xdi--;
        } else {
          xd.length = xdi + 1;
          k = mathpow(10, LOG_BASE - i);
          xd[xdi] = j > 0 ? (w / mathpow(10, digits - j) % mathpow(10, j) | 0) * k : 0;
        }
        if (roundUp) {
          for (; ; ) {
            if (xdi == 0) {
              for (i = 1, j = xd[0]; j >= 10; j /= 10)
                i++;
              j = xd[0] += k;
              for (k = 1; j >= 10; j /= 10)
                k++;
              if (i != k) {
                x2.e++;
                if (xd[0] == BASE)
                  xd[0] = 1;
              }
              break;
            } else {
              xd[xdi] += k;
              if (xd[xdi] != BASE)
                break;
              xd[xdi--] = 0;
              k = 1;
            }
          }
        }
        for (i = xd.length; xd[--i] === 0; )
          xd.pop();
      }
    if (external) {
      if (x2.e > Ctor.maxE) {
        x2.d = null;
        x2.e = NaN;
      } else if (x2.e < Ctor.minE) {
        x2.e = 0;
        x2.d = [0];
      }
    }
    return x2;
  }
  function finiteToString(x2, isExp, sd) {
    if (!x2.isFinite())
      return nonFiniteToString(x2);
    var k, e = x2.e, str = digitsToString(x2.d), len = str.length;
    if (isExp) {
      if (sd && (k = sd - len) > 0) {
        str = str.charAt(0) + "." + str.slice(1) + getZeroString(k);
      } else if (len > 1) {
        str = str.charAt(0) + "." + str.slice(1);
      }
      str = str + (x2.e < 0 ? "e" : "e+") + x2.e;
    } else if (e < 0) {
      str = "0." + getZeroString(-e - 1) + str;
      if (sd && (k = sd - len) > 0)
        str += getZeroString(k);
    } else if (e >= len) {
      str += getZeroString(e + 1 - len);
      if (sd && (k = sd - e - 1) > 0)
        str = str + "." + getZeroString(k);
    } else {
      if ((k = e + 1) < len)
        str = str.slice(0, k) + "." + str.slice(k);
      if (sd && (k = sd - len) > 0) {
        if (e + 1 === len)
          str += ".";
        str += getZeroString(k);
      }
    }
    return str;
  }
  function getBase10Exponent(digits, e) {
    var w = digits[0];
    for (e *= LOG_BASE; w >= 10; w /= 10)
      e++;
    return e;
  }
  function getLn10(Ctor, sd, pr) {
    if (sd > LN10_PRECISION) {
      external = true;
      if (pr)
        Ctor.precision = pr;
      throw Error(precisionLimitExceeded);
    }
    return finalise(new Ctor(LN10), sd, 1, true);
  }
  function getPi(Ctor, sd, rm) {
    if (sd > PI_PRECISION)
      throw Error(precisionLimitExceeded);
    return finalise(new Ctor(PI), sd, rm, true);
  }
  function getPrecision(digits) {
    var w = digits.length - 1, len = w * LOG_BASE + 1;
    w = digits[w];
    if (w) {
      for (; w % 10 == 0; w /= 10)
        len--;
      for (w = digits[0]; w >= 10; w /= 10)
        len++;
    }
    return len;
  }
  function getZeroString(k) {
    var zs = "";
    for (; k--; )
      zs += "0";
    return zs;
  }
  function intPow(Ctor, x2, n2, pr) {
    var isTruncated, r = new Ctor(1), k = Math.ceil(pr / LOG_BASE + 4);
    external = false;
    for (; ; ) {
      if (n2 % 2) {
        r = r.times(x2);
        if (truncate(r.d, k))
          isTruncated = true;
      }
      n2 = mathfloor(n2 / 2);
      if (n2 === 0) {
        n2 = r.d.length - 1;
        if (isTruncated && r.d[n2] === 0)
          ++r.d[n2];
        break;
      }
      x2 = x2.times(x2);
      truncate(x2.d, k);
    }
    external = true;
    return r;
  }
  function isOdd(n2) {
    return n2.d[n2.d.length - 1] & 1;
  }
  function maxOrMin(Ctor, args, ltgt) {
    var y, x2 = new Ctor(args[0]), i = 0;
    for (; ++i < args.length; ) {
      y = new Ctor(args[i]);
      if (!y.s) {
        x2 = y;
        break;
      } else if (x2[ltgt](y)) {
        x2 = y;
      }
    }
    return x2;
  }
  function naturalExponential(x2, sd) {
    var denominator, guard, j, pow2, sum2, t, wpr, rep = 0, i = 0, k = 0, Ctor = x2.constructor, rm = Ctor.rounding, pr = Ctor.precision;
    if (!x2.d || !x2.d[0] || x2.e > 17) {
      return new Ctor(x2.d ? !x2.d[0] ? 1 : x2.s < 0 ? 0 : 1 / 0 : x2.s ? x2.s < 0 ? 0 : x2 : 0 / 0);
    }
    if (sd == null) {
      external = false;
      wpr = pr;
    } else {
      wpr = sd;
    }
    t = new Ctor(0.03125);
    while (x2.e > -2) {
      x2 = x2.times(t);
      k += 5;
    }
    guard = Math.log(mathpow(2, k)) / Math.LN10 * 2 + 5 | 0;
    wpr += guard;
    denominator = pow2 = sum2 = new Ctor(1);
    Ctor.precision = wpr;
    for (; ; ) {
      pow2 = finalise(pow2.times(x2), wpr, 1);
      denominator = denominator.times(++i);
      t = sum2.plus(divide(pow2, denominator, wpr, 1));
      if (digitsToString(t.d).slice(0, wpr) === digitsToString(sum2.d).slice(0, wpr)) {
        j = k;
        while (j--)
          sum2 = finalise(sum2.times(sum2), wpr, 1);
        if (sd == null) {
          if (rep < 3 && checkRoundingDigits(sum2.d, wpr - guard, rm, rep)) {
            Ctor.precision = wpr += 10;
            denominator = pow2 = t = new Ctor(1);
            i = 0;
            rep++;
          } else {
            return finalise(sum2, Ctor.precision = pr, rm, external = true);
          }
        } else {
          Ctor.precision = pr;
          return sum2;
        }
      }
      sum2 = t;
    }
  }
  function naturalLogarithm(y, sd) {
    var c, c0, denominator, e, numerator, rep, sum2, t, wpr, x1, x2, n2 = 1, guard = 10, x3 = y, xd = x3.d, Ctor = x3.constructor, rm = Ctor.rounding, pr = Ctor.precision;
    if (x3.s < 0 || !xd || !xd[0] || !x3.e && xd[0] == 1 && xd.length == 1) {
      return new Ctor(xd && !xd[0] ? -1 / 0 : x3.s != 1 ? NaN : xd ? 0 : x3);
    }
    if (sd == null) {
      external = false;
      wpr = pr;
    } else {
      wpr = sd;
    }
    Ctor.precision = wpr += guard;
    c = digitsToString(xd);
    c0 = c.charAt(0);
    if (Math.abs(e = x3.e) < 15e14) {
      while (c0 < 7 && c0 != 1 || c0 == 1 && c.charAt(1) > 3) {
        x3 = x3.times(y);
        c = digitsToString(x3.d);
        c0 = c.charAt(0);
        n2++;
      }
      e = x3.e;
      if (c0 > 1) {
        x3 = new Ctor("0." + c);
        e++;
      } else {
        x3 = new Ctor(c0 + "." + c.slice(1));
      }
    } else {
      t = getLn10(Ctor, wpr + 2, pr).times(e + "");
      x3 = naturalLogarithm(new Ctor(c0 + "." + c.slice(1)), wpr - guard).plus(t);
      Ctor.precision = pr;
      return sd == null ? finalise(x3, pr, rm, external = true) : x3;
    }
    x1 = x3;
    sum2 = numerator = x3 = divide(x3.minus(1), x3.plus(1), wpr, 1);
    x2 = finalise(x3.times(x3), wpr, 1);
    denominator = 3;
    for (; ; ) {
      numerator = finalise(numerator.times(x2), wpr, 1);
      t = sum2.plus(divide(numerator, new Ctor(denominator), wpr, 1));
      if (digitsToString(t.d).slice(0, wpr) === digitsToString(sum2.d).slice(0, wpr)) {
        sum2 = sum2.times(2);
        if (e !== 0)
          sum2 = sum2.plus(getLn10(Ctor, wpr + 2, pr).times(e + ""));
        sum2 = divide(sum2, new Ctor(n2), wpr, 1);
        if (sd == null) {
          if (checkRoundingDigits(sum2.d, wpr - guard, rm, rep)) {
            Ctor.precision = wpr += guard;
            t = numerator = x3 = divide(x1.minus(1), x1.plus(1), wpr, 1);
            x2 = finalise(x3.times(x3), wpr, 1);
            denominator = rep = 1;
          } else {
            return finalise(sum2, Ctor.precision = pr, rm, external = true);
          }
        } else {
          Ctor.precision = pr;
          return sum2;
        }
      }
      sum2 = t;
      denominator += 2;
    }
  }
  function nonFiniteToString(x2) {
    return String(x2.s * x2.s / 0);
  }
  function parseDecimal(x2, str) {
    var e, i, len;
    if ((e = str.indexOf(".")) > -1)
      str = str.replace(".", "");
    if ((i = str.search(/e/i)) > 0) {
      if (e < 0)
        e = i;
      e += +str.slice(i + 1);
      str = str.substring(0, i);
    } else if (e < 0) {
      e = str.length;
    }
    for (i = 0; str.charCodeAt(i) === 48; i++)
      ;
    for (len = str.length; str.charCodeAt(len - 1) === 48; --len)
      ;
    str = str.slice(i, len);
    if (str) {
      len -= i;
      x2.e = e = e - i - 1;
      x2.d = [];
      i = (e + 1) % LOG_BASE;
      if (e < 0)
        i += LOG_BASE;
      if (i < len) {
        if (i)
          x2.d.push(+str.slice(0, i));
        for (len -= LOG_BASE; i < len; )
          x2.d.push(+str.slice(i, i += LOG_BASE));
        str = str.slice(i);
        i = LOG_BASE - str.length;
      } else {
        i -= len;
      }
      for (; i--; )
        str += "0";
      x2.d.push(+str);
      if (external) {
        if (x2.e > x2.constructor.maxE) {
          x2.d = null;
          x2.e = NaN;
        } else if (x2.e < x2.constructor.minE) {
          x2.e = 0;
          x2.d = [0];
        }
      }
    } else {
      x2.e = 0;
      x2.d = [0];
    }
    return x2;
  }
  function parseOther(x2, str) {
    var base2, Ctor, divisor, i, isFloat, len, p, xd, xe;
    if (str.indexOf("_") > -1) {
      str = str.replace(/(\d)_(?=\d)/g, "$1");
      if (isDecimal.test(str))
        return parseDecimal(x2, str);
    } else if (str === "Infinity" || str === "NaN") {
      if (!+str)
        x2.s = NaN;
      x2.e = NaN;
      x2.d = null;
      return x2;
    }
    if (isHex.test(str)) {
      base2 = 16;
      str = str.toLowerCase();
    } else if (isBinary.test(str)) {
      base2 = 2;
    } else if (isOctal.test(str)) {
      base2 = 8;
    } else {
      throw Error(invalidArgument + str);
    }
    i = str.search(/p/i);
    if (i > 0) {
      p = +str.slice(i + 1);
      str = str.substring(2, i);
    } else {
      str = str.slice(2);
    }
    i = str.indexOf(".");
    isFloat = i >= 0;
    Ctor = x2.constructor;
    if (isFloat) {
      str = str.replace(".", "");
      len = str.length;
      i = len - i;
      divisor = intPow(Ctor, new Ctor(base2), i, i * 2);
    }
    xd = convertBase(str, base2, BASE);
    xe = xd.length - 1;
    for (i = xe; xd[i] === 0; --i)
      xd.pop();
    if (i < 0)
      return new Ctor(x2.s * 0);
    x2.e = getBase10Exponent(xd, xe);
    x2.d = xd;
    external = false;
    if (isFloat)
      x2 = divide(x2, divisor, len * 4);
    if (p)
      x2 = x2.times(Math.abs(p) < 54 ? mathpow(2, p) : Decimal.pow(2, p));
    external = true;
    return x2;
  }
  function sine(Ctor, x2) {
    var k, len = x2.d.length;
    if (len < 3) {
      return x2.isZero() ? x2 : taylorSeries(Ctor, 2, x2, x2);
    }
    k = 1.4 * Math.sqrt(len);
    k = k > 16 ? 16 : k | 0;
    x2 = x2.times(1 / tinyPow(5, k));
    x2 = taylorSeries(Ctor, 2, x2, x2);
    var sin2_x, d5 = new Ctor(5), d16 = new Ctor(16), d20 = new Ctor(20);
    for (; k--; ) {
      sin2_x = x2.times(x2);
      x2 = x2.times(d5.plus(sin2_x.times(d16.times(sin2_x).minus(d20))));
    }
    return x2;
  }
  function taylorSeries(Ctor, n2, x2, y, isHyperbolic) {
    var j, t, u, x22, i = 1, pr = Ctor.precision, k = Math.ceil(pr / LOG_BASE);
    external = false;
    x22 = x2.times(x2);
    u = new Ctor(y);
    for (; ; ) {
      t = divide(u.times(x22), new Ctor(n2++ * n2++), pr, 1);
      u = isHyperbolic ? y.plus(t) : y.minus(t);
      y = divide(t.times(x22), new Ctor(n2++ * n2++), pr, 1);
      t = u.plus(y);
      if (t.d[k] !== void 0) {
        for (j = k; t.d[j] === u.d[j] && j--; )
          ;
        if (j == -1)
          break;
      }
      j = u;
      u = y;
      y = t;
      t = j;
      i++;
    }
    external = true;
    t.d.length = k + 1;
    return t;
  }
  function tinyPow(b, e) {
    var n2 = b;
    while (--e)
      n2 *= b;
    return n2;
  }
  function toLessThanHalfPi(Ctor, x2) {
    var t, isNeg = x2.s < 0, pi = getPi(Ctor, Ctor.precision, 1), halfPi = pi.times(0.5);
    x2 = x2.abs();
    if (x2.lte(halfPi)) {
      quadrant = isNeg ? 4 : 1;
      return x2;
    }
    t = x2.divToInt(pi);
    if (t.isZero()) {
      quadrant = isNeg ? 3 : 2;
    } else {
      x2 = x2.minus(t.times(pi));
      if (x2.lte(halfPi)) {
        quadrant = isOdd(t) ? isNeg ? 2 : 3 : isNeg ? 4 : 1;
        return x2;
      }
      quadrant = isOdd(t) ? isNeg ? 1 : 4 : isNeg ? 3 : 2;
    }
    return x2.minus(pi).abs();
  }
  function toStringBinary(x2, baseOut, sd, rm) {
    var base2, e, i, k, len, roundUp, str, xd, y, Ctor = x2.constructor, isExp = sd !== void 0;
    if (isExp) {
      checkInt32(sd, 1, MAX_DIGITS);
      if (rm === void 0)
        rm = Ctor.rounding;
      else
        checkInt32(rm, 0, 8);
    } else {
      sd = Ctor.precision;
      rm = Ctor.rounding;
    }
    if (!x2.isFinite()) {
      str = nonFiniteToString(x2);
    } else {
      str = finiteToString(x2);
      i = str.indexOf(".");
      if (isExp) {
        base2 = 2;
        if (baseOut == 16) {
          sd = sd * 4 - 3;
        } else if (baseOut == 8) {
          sd = sd * 3 - 2;
        }
      } else {
        base2 = baseOut;
      }
      if (i >= 0) {
        str = str.replace(".", "");
        y = new Ctor(1);
        y.e = str.length - i;
        y.d = convertBase(finiteToString(y), 10, base2);
        y.e = y.d.length;
      }
      xd = convertBase(str, 10, base2);
      e = len = xd.length;
      for (; xd[--len] == 0; )
        xd.pop();
      if (!xd[0]) {
        str = isExp ? "0p+0" : "0";
      } else {
        if (i < 0) {
          e--;
        } else {
          x2 = new Ctor(x2);
          x2.d = xd;
          x2.e = e;
          x2 = divide(x2, y, sd, rm, 0, base2);
          xd = x2.d;
          e = x2.e;
          roundUp = inexact;
        }
        i = xd[sd];
        k = base2 / 2;
        roundUp = roundUp || xd[sd + 1] !== void 0;
        roundUp = rm < 4 ? (i !== void 0 || roundUp) && (rm === 0 || rm === (x2.s < 0 ? 3 : 2)) : i > k || i === k && (rm === 4 || roundUp || rm === 6 && xd[sd - 1] & 1 || rm === (x2.s < 0 ? 8 : 7));
        xd.length = sd;
        if (roundUp) {
          for (; ++xd[--sd] > base2 - 1; ) {
            xd[sd] = 0;
            if (!sd) {
              ++e;
              xd.unshift(1);
            }
          }
        }
        for (len = xd.length; !xd[len - 1]; --len)
          ;
        for (i = 0, str = ""; i < len; i++)
          str += NUMERALS.charAt(xd[i]);
        if (isExp) {
          if (len > 1) {
            if (baseOut == 16 || baseOut == 8) {
              i = baseOut == 16 ? 4 : 3;
              for (--len; len % i; len++)
                str += "0";
              xd = convertBase(str, base2, baseOut);
              for (len = xd.length; !xd[len - 1]; --len)
                ;
              for (i = 1, str = "1."; i < len; i++)
                str += NUMERALS.charAt(xd[i]);
            } else {
              str = str.charAt(0) + "." + str.slice(1);
            }
          }
          str = str + (e < 0 ? "p" : "p+") + e;
        } else if (e < 0) {
          for (; ++e; )
            str = "0" + str;
          str = "0." + str;
        } else {
          if (++e > len)
            for (e -= len; e--; )
              str += "0";
          else if (e < len)
            str = str.slice(0, e) + "." + str.slice(e);
        }
      }
      str = (baseOut == 16 ? "0x" : baseOut == 2 ? "0b" : baseOut == 8 ? "0o" : "") + str;
    }
    return x2.s < 0 ? "-" + str : str;
  }
  function truncate(arr, len) {
    if (arr.length > len) {
      arr.length = len;
      return true;
    }
  }
  function abs(x2) {
    return new this(x2).abs();
  }
  function acos(x2) {
    return new this(x2).acos();
  }
  function acosh(x2) {
    return new this(x2).acosh();
  }
  function add(x2, y) {
    return new this(x2).plus(y);
  }
  function asin(x2) {
    return new this(x2).asin();
  }
  function asinh(x2) {
    return new this(x2).asinh();
  }
  function atan(x2) {
    return new this(x2).atan();
  }
  function atanh(x2) {
    return new this(x2).atanh();
  }
  function atan2(y, x2) {
    y = new this(y);
    x2 = new this(x2);
    var r, pr = this.precision, rm = this.rounding, wpr = pr + 4;
    if (!y.s || !x2.s) {
      r = new this(NaN);
    } else if (!y.d && !x2.d) {
      r = getPi(this, wpr, 1).times(x2.s > 0 ? 0.25 : 0.75);
      r.s = y.s;
    } else if (!x2.d || y.isZero()) {
      r = x2.s < 0 ? getPi(this, pr, rm) : new this(0);
      r.s = y.s;
    } else if (!y.d || x2.isZero()) {
      r = getPi(this, wpr, 1).times(0.5);
      r.s = y.s;
    } else if (x2.s < 0) {
      this.precision = wpr;
      this.rounding = 1;
      r = this.atan(divide(y, x2, wpr, 1));
      x2 = getPi(this, wpr, 1);
      this.precision = pr;
      this.rounding = rm;
      r = y.s < 0 ? r.minus(x2) : r.plus(x2);
    } else {
      r = this.atan(divide(y, x2, wpr, 1));
    }
    return r;
  }
  function cbrt(x2) {
    return new this(x2).cbrt();
  }
  function ceil(x2) {
    return finalise(x2 = new this(x2), x2.e + 1, 2);
  }
  function clamp(x2, min2, max2) {
    return new this(x2).clamp(min2, max2);
  }
  function config(obj) {
    if (!obj || typeof obj !== "object")
      throw Error(decimalError + "Object expected");
    var i, p, v, useDefaults = obj.defaults === true, ps = [
      "precision",
      1,
      MAX_DIGITS,
      "rounding",
      0,
      8,
      "toExpNeg",
      -EXP_LIMIT,
      0,
      "toExpPos",
      0,
      EXP_LIMIT,
      "maxE",
      0,
      EXP_LIMIT,
      "minE",
      -EXP_LIMIT,
      0,
      "modulo",
      0,
      9
    ];
    for (i = 0; i < ps.length; i += 3) {
      if (p = ps[i], useDefaults)
        this[p] = DEFAULTS[p];
      if ((v = obj[p]) !== void 0) {
        if (mathfloor(v) === v && v >= ps[i + 1] && v <= ps[i + 2])
          this[p] = v;
        else
          throw Error(invalidArgument + p + ": " + v);
      }
    }
    if (p = "crypto", useDefaults)
      this[p] = DEFAULTS[p];
    if ((v = obj[p]) !== void 0) {
      if (v === true || v === false || v === 0 || v === 1) {
        if (v) {
          if (typeof crypto != "undefined" && crypto && (crypto.getRandomValues || crypto.randomBytes)) {
            this[p] = true;
          } else {
            throw Error(cryptoUnavailable);
          }
        } else {
          this[p] = false;
        }
      } else {
        throw Error(invalidArgument + p + ": " + v);
      }
    }
    return this;
  }
  function cos(x2) {
    return new this(x2).cos();
  }
  function cosh(x2) {
    return new this(x2).cosh();
  }
  function clone(obj) {
    var i, p, ps;
    function Decimal2(v) {
      var e, i2, t, x2 = this;
      if (!(x2 instanceof Decimal2))
        return new Decimal2(v);
      x2.constructor = Decimal2;
      if (isDecimalInstance(v)) {
        x2.s = v.s;
        if (external) {
          if (!v.d || v.e > Decimal2.maxE) {
            x2.e = NaN;
            x2.d = null;
          } else if (v.e < Decimal2.minE) {
            x2.e = 0;
            x2.d = [0];
          } else {
            x2.e = v.e;
            x2.d = v.d.slice();
          }
        } else {
          x2.e = v.e;
          x2.d = v.d ? v.d.slice() : v.d;
        }
        return;
      }
      t = typeof v;
      if (t === "number") {
        if (v === 0) {
          x2.s = 1 / v < 0 ? -1 : 1;
          x2.e = 0;
          x2.d = [0];
          return;
        }
        if (v < 0) {
          v = -v;
          x2.s = -1;
        } else {
          x2.s = 1;
        }
        if (v === ~~v && v < 1e7) {
          for (e = 0, i2 = v; i2 >= 10; i2 /= 10)
            e++;
          if (external) {
            if (e > Decimal2.maxE) {
              x2.e = NaN;
              x2.d = null;
            } else if (e < Decimal2.minE) {
              x2.e = 0;
              x2.d = [0];
            } else {
              x2.e = e;
              x2.d = [v];
            }
          } else {
            x2.e = e;
            x2.d = [v];
          }
          return;
        } else if (v * 0 !== 0) {
          if (!v)
            x2.s = NaN;
          x2.e = NaN;
          x2.d = null;
          return;
        }
        return parseDecimal(x2, v.toString());
      } else if (t !== "string") {
        throw Error(invalidArgument + v);
      }
      if ((i2 = v.charCodeAt(0)) === 45) {
        v = v.slice(1);
        x2.s = -1;
      } else {
        if (i2 === 43)
          v = v.slice(1);
        x2.s = 1;
      }
      return isDecimal.test(v) ? parseDecimal(x2, v) : parseOther(x2, v);
    }
    Decimal2.prototype = P;
    Decimal2.ROUND_UP = 0;
    Decimal2.ROUND_DOWN = 1;
    Decimal2.ROUND_CEIL = 2;
    Decimal2.ROUND_FLOOR = 3;
    Decimal2.ROUND_HALF_UP = 4;
    Decimal2.ROUND_HALF_DOWN = 5;
    Decimal2.ROUND_HALF_EVEN = 6;
    Decimal2.ROUND_HALF_CEIL = 7;
    Decimal2.ROUND_HALF_FLOOR = 8;
    Decimal2.EUCLID = 9;
    Decimal2.config = Decimal2.set = config;
    Decimal2.clone = clone;
    Decimal2.isDecimal = isDecimalInstance;
    Decimal2.abs = abs;
    Decimal2.acos = acos;
    Decimal2.acosh = acosh;
    Decimal2.add = add;
    Decimal2.asin = asin;
    Decimal2.asinh = asinh;
    Decimal2.atan = atan;
    Decimal2.atanh = atanh;
    Decimal2.atan2 = atan2;
    Decimal2.cbrt = cbrt;
    Decimal2.ceil = ceil;
    Decimal2.clamp = clamp;
    Decimal2.cos = cos;
    Decimal2.cosh = cosh;
    Decimal2.div = div;
    Decimal2.exp = exp;
    Decimal2.floor = floor;
    Decimal2.hypot = hypot;
    Decimal2.ln = ln;
    Decimal2.log = log;
    Decimal2.log10 = log10;
    Decimal2.log2 = log2;
    Decimal2.max = max;
    Decimal2.min = min;
    Decimal2.mod = mod;
    Decimal2.mul = mul;
    Decimal2.pow = pow;
    Decimal2.random = random;
    Decimal2.round = round;
    Decimal2.sign = sign;
    Decimal2.sin = sin;
    Decimal2.sinh = sinh;
    Decimal2.sqrt = sqrt;
    Decimal2.sub = sub;
    Decimal2.sum = sum;
    Decimal2.tan = tan;
    Decimal2.tanh = tanh;
    Decimal2.trunc = trunc;
    if (obj === void 0)
      obj = {};
    if (obj) {
      if (obj.defaults !== true) {
        ps = ["precision", "rounding", "toExpNeg", "toExpPos", "maxE", "minE", "modulo", "crypto"];
        for (i = 0; i < ps.length; )
          if (!obj.hasOwnProperty(p = ps[i++]))
            obj[p] = this[p];
      }
    }
    Decimal2.config(obj);
    return Decimal2;
  }
  function div(x2, y) {
    return new this(x2).div(y);
  }
  function exp(x2) {
    return new this(x2).exp();
  }
  function floor(x2) {
    return finalise(x2 = new this(x2), x2.e + 1, 3);
  }
  function hypot() {
    var i, n2, t = new this(0);
    external = false;
    for (i = 0; i < arguments.length; ) {
      n2 = new this(arguments[i++]);
      if (!n2.d) {
        if (n2.s) {
          external = true;
          return new this(1 / 0);
        }
        t = n2;
      } else if (t.d) {
        t = t.plus(n2.times(n2));
      }
    }
    external = true;
    return t.sqrt();
  }
  function isDecimalInstance(obj) {
    return obj instanceof Decimal || obj && obj.toStringTag === tag || false;
  }
  function ln(x2) {
    return new this(x2).ln();
  }
  function log(x2, y) {
    return new this(x2).log(y);
  }
  function log2(x2) {
    return new this(x2).log(2);
  }
  function log10(x2) {
    return new this(x2).log(10);
  }
  function max() {
    return maxOrMin(this, arguments, "lt");
  }
  function min() {
    return maxOrMin(this, arguments, "gt");
  }
  function mod(x2, y) {
    return new this(x2).mod(y);
  }
  function mul(x2, y) {
    return new this(x2).mul(y);
  }
  function pow(x2, y) {
    return new this(x2).pow(y);
  }
  function random(sd) {
    var d, e, k, n2, i = 0, r = new this(1), rd = [];
    if (sd === void 0)
      sd = this.precision;
    else
      checkInt32(sd, 1, MAX_DIGITS);
    k = Math.ceil(sd / LOG_BASE);
    if (!this.crypto) {
      for (; i < k; )
        rd[i++] = Math.random() * 1e7 | 0;
    } else if (crypto.getRandomValues) {
      d = crypto.getRandomValues(new Uint32Array(k));
      for (; i < k; ) {
        n2 = d[i];
        if (n2 >= 429e7) {
          d[i] = crypto.getRandomValues(new Uint32Array(1))[0];
        } else {
          rd[i++] = n2 % 1e7;
        }
      }
    } else if (crypto.randomBytes) {
      d = crypto.randomBytes(k *= 4);
      for (; i < k; ) {
        n2 = d[i] + (d[i + 1] << 8) + (d[i + 2] << 16) + ((d[i + 3] & 127) << 24);
        if (n2 >= 214e7) {
          crypto.randomBytes(4).copy(d, i);
        } else {
          rd.push(n2 % 1e7);
          i += 4;
        }
      }
      i = k / 4;
    } else {
      throw Error(cryptoUnavailable);
    }
    k = rd[--i];
    sd %= LOG_BASE;
    if (k && sd) {
      n2 = mathpow(10, LOG_BASE - sd);
      rd[i] = (k / n2 | 0) * n2;
    }
    for (; rd[i] === 0; i--)
      rd.pop();
    if (i < 0) {
      e = 0;
      rd = [0];
    } else {
      e = -1;
      for (; rd[0] === 0; e -= LOG_BASE)
        rd.shift();
      for (k = 1, n2 = rd[0]; n2 >= 10; n2 /= 10)
        k++;
      if (k < LOG_BASE)
        e -= LOG_BASE - k;
    }
    r.e = e;
    r.d = rd;
    return r;
  }
  function round(x2) {
    return finalise(x2 = new this(x2), x2.e + 1, this.rounding);
  }
  function sign(x2) {
    x2 = new this(x2);
    return x2.d ? x2.d[0] ? x2.s : 0 * x2.s : x2.s || NaN;
  }
  function sin(x2) {
    return new this(x2).sin();
  }
  function sinh(x2) {
    return new this(x2).sinh();
  }
  function sqrt(x2) {
    return new this(x2).sqrt();
  }
  function sub(x2, y) {
    return new this(x2).sub(y);
  }
  function sum() {
    var i = 0, args = arguments, x2 = new this(args[i]);
    external = false;
    for (; x2.s && ++i < args.length; )
      x2 = x2.plus(args[i]);
    external = true;
    return finalise(x2, this.precision, this.rounding);
  }
  function tan(x2) {
    return new this(x2).tan();
  }
  function tanh(x2) {
    return new this(x2).tanh();
  }
  function trunc(x2) {
    return finalise(x2 = new this(x2), x2.e + 1, 1);
  }
  P[Symbol.for("nodejs.util.inspect.custom")] = P.toString;
  P[Symbol.toStringTag] = "Decimal";
  var Decimal = P.constructor = clone(DEFAULTS);
  LN10 = new Decimal(LN10);
  PI = new Decimal(PI);
  var decimal_default = Decimal;

  // ts-port/core/numbers.ts
  function igcd(x2, y) {
    while (y) {
      const t = y;
      y = x2 % y;
      x2 = t;
    }
    return x2;
  }
  function int_nthroot(y, n2) {
    const x2 = Math.floor(y ** (1 / n2));
    const isexact = x2 ** n2 === y;
    return [x2, isexact];
  }
  function toRatio(n2, eps) {
    const gcde = (e, x2, y) => {
      const _gcd = (a, b) => b < e ? a : _gcd(b, a % b);
      return _gcd(Math.abs(x2), Math.abs(y));
    };
    const c = gcde(Boolean(eps) ? eps : 1 / 1e4, 1, n2);
    return [Math.floor(n2 / c), Math.floor(1 / c)];
  }
  function igcdex(a = void 0, b = void 0) {
    if (typeof a === "undefined" && typeof b === "undefined") {
      return [0, 1, 0];
    }
    if (typeof a === "undefined") {
      return [0, Math.floor(b / Math.abs(b)), Math.abs(b)];
    }
    if (typeof b === "undefined") {
      return [Math.floor(a / Math.abs(a)), 0, Math.abs(a)];
    }
    let x_sign;
    let y_sign;
    if (a < 0) {
      a = -1;
      x_sign = -1;
    } else {
      x_sign = 1;
    }
    if (b < 0) {
      b = -b;
      y_sign = -1;
    } else {
      y_sign = 1;
    }
    let [x2, y, r, s] = [1, 0, 0, 1];
    let c;
    let q;
    while (b) {
      [c, q] = [a % b, Math.floor(a / b)];
      [a, b, r, s, x2, y] = [b, c, x2 - q * r, y - q * s, r, s];
    }
    return [x2 * x_sign, y * y_sign, a];
  }
  function mod_inverse(a, m) {
    let c = void 0;
    [a, m] = [as_int(a), as_int(m)];
    if (m !== 1 && m !== -1) {
      const [x2, b, g] = igcdex(a, m);
      if (g === 1) {
        c = x2 & m;
      }
    }
    return c;
  }
  Global.registerfunc("mod_inverse", mod_inverse);
  var __Number_ = class extends _AtomicExpr2 {
    static new(...obj) {
      if (obj.length === 1) {
        obj = obj[0];
      }
      if (obj instanceof __Number_) {
        return obj;
      } else if (typeof obj === "number" && !Number.isInteger(obj) || obj instanceof decimal_default || typeof obj === "string") {
        return new Float(obj);
      } else if (Number.isInteger(obj)) {
        return new Integer(obj);
      } else if (obj.length === 2) {
        return new Rational(obj[0], obj[1]);
      } else if (typeof obj === "string") {
        const _obj = obj.toLowerCase();
        if (_obj === "nan") {
          return S.NaN;
        } else if (_obj === "inf") {
          return S.Infinity;
        } else if (_obj === "+inf") {
          return S.Infinity;
        } else if (_obj === "-inf") {
          return S.NegativeInfinity;
        } else {
          throw new Error("argument for number is invalid");
        }
      }
      throw new Error("argument for number is invalid");
    }
    as_coeff_Mul(rational = false) {
      if (rational && !this.is_Rational) {
        return [S.One, this];
      }
      if (this) {
        return [this, S.One];
      } else {
        return [S.One, this];
      }
    }
    as_coeff_Add() {
      return [this, S.Zero];
    }
    __add__(other) {
      if (other instanceof __Number_ && global_parameters.evaluate) {
        if (other === S.NaN) {
          return S.NaN;
        } else if (other === S.Infinity) {
          return S.Infinity;
        } else if (other === S.NegativeInfinity) {
          return S.NegativeInfinity;
        }
      }
      return super.__add__(other);
    }
    __sub__(other) {
      if (other instanceof __Number_ && global_parameters.evaluate) {
        if (other === S.NaN) {
          return S.NaN;
        } else if (other === S.Infinity) {
          return S.NegativeInfinity;
        } else if (other === S.NegativeInfinity) {
          return S.Infinity;
        }
      }
      return super.__sub__(other);
    }
    __mul__(other) {
      if (other instanceof __Number_ && global_parameters.evaluate) {
        if (other === S.Nan) {
          return S.Nan;
        } else if (other === S.Infinity) {
          if (this.is_zero()) {
            return S.NaN;
          } else if (this.is_positive()) {
            return S.Infinity;
          } else {
            return S.NegativeInfinity;
          }
        } else if (other === S.NegativeInfinity) {
          if (this.is_zero()) {
            return S.NaN;
          } else if (this.is_positive()) {
            return S.NegativeInfinity;
          } else {
            return S.Infinity;
          }
        }
      }
      return super.__mul__(other);
    }
    __truediv__(other) {
      if (other instanceof __Number_ && global_parameters.evaluate) {
        if (other === S.NaN) {
          return S.NaN;
        } else if (other === S.Infinity || other === S.NegativeInfinity) {
          return S.Zero;
        }
      }
      return super.__truediv__(other);
    }
    eval_evalf(prec) {
      return new Float(this._float_val(prec), prec);
    }
    _float_val(prec) {
      return void 0;
    }
  };
  var _Number_ = __Number_;
  _Number_.is_commutative = true;
  _Number_.is_number = true;
  _Number_.is_Number = true;
  _Number_.kind = NumberKind;
  ManagedProperties.register(_Number_);
  Global.register("_Number_", _Number_.new);
  var _Float = class extends _Number_ {
    constructor(num, prec = 15) {
      super();
      this.__slots__ = ["_mpf_", "_prec"];
      this.prec = prec;
      if (typeof num !== "undefined") {
        if (num instanceof _Float) {
          this.decimal = num.decimal;
        } else if (num instanceof decimal_default) {
          this.decimal = num;
        } else {
          this.decimal = new decimal_default(num);
        }
      }
    }
    __add__(other) {
      if (global_parameters.evaluate && other instanceof _Number_) {
        const val = other._float_val(this.prec);
        return new _Float(decimal_default.set({ precision: this.prec }).add(this.decimal, val.decimal), this.prec);
      }
      return super.__add__(other);
    }
    __sub__(other) {
      if (global_parameters.evaluate && other instanceof _Number_) {
        const val = other._float_val(this.prec);
        return new _Float(decimal_default.set({ precision: this.prec }).sub(this.decimal, val.decimal), this.prec);
      }
      return super.__sub__(other);
    }
    __mul__(other) {
      if (global_parameters.evaluate && other instanceof _Number_) {
        const val = other._float_val(this.prec);
        return new _Float(decimal_default.set({ precision: this.prec }).mul(this.decimal, val.decimal), this.prec);
      }
      return super.__mul__(other);
    }
    __truediv__(other) {
      if (global_parameters.evaluate && other instanceof _Number_) {
        const val = other._float_val(this.prec);
        return new _Float(decimal_default.set({ precision: this.prec }).div(this.decimal, val.decimal), this.prec);
      }
      return super.__div__(other);
    }
    _eval_is_negative() {
      return this.decimal.lessThan(0);
    }
    _eval_is_positive() {
      return this.decimal.greaterThan(0);
    }
    _eval_power(expt) {
      if (this === S.Zero) {
        if (expt.is_extended_positive) {
          return this;
        }
        if (expt.is_extended_negative) {
          return S.ComplexInfinity;
        }
      }
      if (expt instanceof _Number_) {
        if (expt instanceof Integer) {
          const prec = this.prec;
          return new _Float(decimal_default.set({ precision: this.prec }).pow(this.decimal, expt.p), prec);
        } else if (expt instanceof Rational && expt.p === 1 && expt.q % 2 !== 0 && this.is_negative()) {
          const negpart = this.__mul__(S.NegativeOne)._eval_power(expt);
          return new Mul(true, true, negpart, new Pow(S.NegativeOne, expt, false));
        }
        const val = expt._float_val(this.prec).decimal;
        const res = decimal_default.set({ precision: this.prec }).pow(this.decimal, val);
        if (res.isNaN()) {
          throw new Error("complex and imaginary numbers not yet implemented");
        }
        return new _Float(res);
      }
    }
    _float_val(prec) {
      return this;
    }
    inverse() {
      return new _Float(1 / this.decimal);
    }
    _eval_is_finite() {
      return this.decimal.isFinite();
    }
    toString() {
      return this.decimal.toString();
    }
  };
  var Float = _Float;
  Float.is_rational = void 0;
  Float.is_irrational = void 0;
  Float.is_number = true;
  Float.is_real = true;
  Float.is_extended_real = true;
  Float.is_Float = true;
  ManagedProperties.register(Float);
  var _Rational = class extends _Number_ {
    constructor(p, q = void 0, gcd = void 0, simplify = true) {
      super();
      this.__slots__ = ["p", "q"];
      if (typeof q === "undefined") {
        if (p instanceof _Rational) {
          return p;
        } else {
          if (typeof p === "number" && p % 1 !== 0) {
            return new _Rational(toRatio(p, 1e-4));
          } else {
          }
        }
        q = 1;
        gcd = 1;
      }
      if (!Number.isInteger(p)) {
        p = new _Rational(p);
        q *= p.q;
        p = p.p;
      }
      if (!Number.isInteger(q)) {
        q = new _Rational(q);
        p *= q.q;
        q = q.p;
      }
      if (q === 0) {
        if (p === 0) {
          return S.Nan;
        }
        return S.ComplexInfinity;
      }
      if (q < 0) {
        q = -q;
        p = -p;
      }
      if (typeof gcd === "undefined") {
        gcd = igcd(Math.abs(p), q);
      }
      if (gcd > 1) {
        p = p / gcd;
        q = q / gcd;
      }
      if (q === 1 && simplify) {
        return new Integer(p);
      }
      this.p = p;
      this.q = q;
    }
    hashKey() {
      return this.constructor.name + this.p + this.q;
    }
    __add__(other) {
      if (global_parameters.evaluate) {
        if (other instanceof Integer) {
          return new _Rational(this.p + this.q * other.p, this.q, 1);
        } else if (other instanceof _Rational) {
          return new _Rational(this.p * other.q + this.q * other.p, this.q * other.q);
        } else if (other instanceof Float) {
          return other.__add__(this);
        } else {
          return super.__add__(other);
        }
      }
      return super.__add__(other);
    }
    __radd__(other) {
      return this.__add__(other);
    }
    __sub__(other) {
      if (global_parameters.evaluate) {
        if (other instanceof Integer) {
          return new _Rational(this.q * other.p - this.p, this.q, 1);
        } else if (other instanceof _Rational) {
          return new _Rational(this.p * other.q - this.q * other.p, this.q * other.q);
        } else if (other instanceof Float) {
          return this.__mul__(S.NegativeOne).__add__(other);
        } else {
          return super.__sub__(other);
        }
      }
      return super.__sub__(other);
    }
    __rsub__(other) {
      if (global_parameters.evaluate) {
        if (other instanceof Integer) {
          return new _Rational(this.p - this.q * other.p, this.q, 1);
        } else if (other instanceof _Rational) {
          return new _Rational(this.q * other.p - this.p * other.q, this.q * other.q);
        } else if (other instanceof Float) {
          return other.__mul__(S.NegativeOne).__add__(this);
        } else {
          return super.__rsub__(other);
        }
      }
      return super.__rsub__(other);
    }
    __mul__(other) {
      if (global_parameters.evaluate) {
        if (other instanceof Integer) {
          return new _Rational(this.p * other.p, this.q, igcd(other.p, this.q));
        } else if (other instanceof _Rational) {
          return new _Rational(this.p * other.p, this.q * other.q, igcd(this.p, other.q) * igcd(this.q, other.p));
        } else if (other instanceof Float) {
          return other.__mul__(this);
        } else {
          return super.__mul__(other);
        }
      }
      return super.__mul__(other);
    }
    __rmul__(other) {
      return this.__mul__(other);
    }
    __truediv__(other) {
      if (global_parameters.evaluate) {
        if (other instanceof Integer) {
          return new _Rational(this.p, this.q * other.p, igcd(this.p, other.p));
        } else if (other instanceof _Rational) {
          return new _Rational(this.p * other.q, this.q * other.p, igcd(this.p, other.p) * igcd(this.q, other.q));
        } else if (other instanceof Float) {
          return this.__mul__(other.inverse());
        } else {
          return super.__truediv__(other);
        }
      }
      return super.__truediv__(other);
    }
    __rtruediv__(other) {
      if (global_parameters.evaluate) {
        if (other instanceof Integer) {
          return new _Rational(other.p * this.q, this.p, igcd(this.p, other.p));
        } else if (other instanceof _Rational) {
          return new _Rational(other.p * this.q, other.q * this.p, igcd(this.p, other.p) * igcd(this.q, other.q));
        } else if (other instanceof Float) {
          return other.__mul__(S.One.__truediv__(this));
        } else {
          return super.__rtruediv__(other);
        }
      }
      return super.__rtruediv__(other);
    }
    _eval_power(expt) {
      if (expt instanceof _Number_) {
        if (expt instanceof Float) {
          return this.eval_evalf(expt.prec)._eval_power(expt);
        } else if (expt instanceof Integer) {
          return new _Rational(this.p ** expt.p, this.q ** expt.p, 1);
        } else if (expt instanceof _Rational) {
          let intpart = Math.floor(expt.p / expt.q);
          if (intpart) {
            intpart++;
            const remfracpart = intpart * expt.q - expt.p;
            const ratfracpart = new _Rational(remfracpart, expt.q);
            if (this.p !== 1) {
              return new Integer(this.p)._eval_power(expt).__mul__(new Integer(this.q))._eval_power(ratfracpart).__mul__(new _Rational(1, this.q ** intpart, 1));
            }
            return new Integer(this.q)._eval_power(ratfracpart).__mul__(new _Rational(1, this.q ** intpart, 1));
          } else {
            const remfracpart = expt.q - expt.p;
            const ratfracpart = new _Rational(remfracpart, expt.q);
            if (this.p !== 1) {
              const p1 = new Integer(this.p)._eval_power(expt);
              const p2 = new Integer(this.q)._eval_power(ratfracpart);
              return p1.__mul__(p2).__mul__(new _Rational(1, this.q, 1));
            }
            return new Integer(this.q)._eval_power(ratfracpart).__mul__(new _Rational(1, this.q, 1));
          }
        }
      }
    }
    as_coeff_Add() {
      return [this, S.Zero];
    }
    _float_val(prec) {
      const a = new decimal_default(this.p);
      const b = new decimal_default(this.q);
      return new Float(decimal_default.set({ precision: prec }).div(a, b));
    }
    _as_numer_denom() {
      return [new Integer(this.p), new Integer(this.q)];
    }
    factors(limit = void 0) {
      return factorrat(this, limit);
    }
    _eval_is_negative() {
      if (this.p < 0 && this.q > 0) {
        return true;
      } else {
        return false;
      }
    }
    _eval_is_positive() {
      return !this._eval_is_negative();
    }
    _eval_is_odd() {
      return this.p % 2 !== 0;
    }
    _eval_is_even() {
      return this.p % 2 === 0;
    }
    _eval_is_finite() {
      return !(this.p === S.Infinity || this.p === S.NegativeInfinity);
    }
    eq(other) {
      return this.p === other.p && this.q === other.q;
    }
    toString() {
      return String(this.p) + "/" + String(this.q);
    }
  };
  var Rational = _Rational;
  Rational.is_real = true;
  Rational.is_integer = false;
  Rational.is_rational = true;
  Rational.is_number = true;
  Rational.is_Rational = true;
  ManagedProperties.register(Rational);
  var _Integer = class extends Rational {
    constructor(p) {
      super(p, void 0, void 0, false);
      this.__slots__ = [];
      this.p = p;
      if (p === 1) {
        return S.One;
      } else if (p === 0) {
        return S.Zero;
      } else if (p === -1) {
        return S.NegativeOne;
      }
    }
    factors(limit = void 0) {
      return factorint(this.p, limit);
    }
    __add__(other) {
      if (global_parameters.evaluate) {
        if (Number.isInteger(other)) {
          return new _Integer(this.p + other);
        } else if (other instanceof _Integer) {
          return new _Integer(this.p + other.p);
        } else if (other instanceof Rational) {
          return new Rational(this.p * other.q + other.p, other.q, 1);
        } else {
          return super.__add__(other);
        }
      } else {
        return new Add(true, true, this, other);
      }
    }
    __radd__(other) {
      if (global_parameters.evaluate) {
        if (Number.isInteger(other)) {
          return new _Integer(other + this.p);
        } else if (other instanceof Rational) {
          return new Rational(other.p + this.p * other.q, other.q, 1);
        } else {
          return super.__radd__(other);
        }
      } else {
        return super.__radd__(other);
      }
    }
    __sub__(other) {
      if (global_parameters.evaluate) {
        if (Number.isInteger(other)) {
          return new _Integer(this.p - other);
        } else if (other instanceof _Integer) {
          return new _Integer(this.p - other.p);
        } else if (other instanceof Rational) {
          return new Rational(this.p * other.q - other.p, other.q, 1);
        } else {
          return super.__sub__(other);
        }
      } else {
        return super.__sub__(other);
      }
    }
    __rsub__(other) {
      if (global_parameters.evaluate) {
        if (Number.isInteger(other)) {
          return new _Integer(this.p - other);
        } else if (other instanceof Rational) {
          return new Rational(other.p - this.p * other.q, other.q, 1);
        } else {
          return super.__rsub__(other);
        }
      } else {
        return super.__rsub__(other);
      }
    }
    __mul__(other) {
      if (global_parameters.evaluate) {
        if (Number.isInteger(other)) {
          return new _Integer(this.p * other);
        } else if (other instanceof _Integer) {
          return new _Integer(this.p * other.p);
        } else if (other instanceof Rational) {
          return new Rational(this.p * other.p, other.q, igcd(this.p, other.q));
        } else {
          return super.__mul__(other);
        }
      } else {
        return super.__mul__(other);
      }
    }
    __rmul__(other) {
      if (global_parameters.evaluate) {
        if (Number.isInteger(other)) {
          return new _Integer(other * this.p);
        } else if (other instanceof Rational) {
          return new Rational(other.p * this.p, other.q, igcd(this.p, other.q));
        } else {
          return super.__rmul__(other);
        }
      } else {
        return super.__rmul__(other);
      }
    }
    _eval_is_negative() {
      return this.p < 0;
    }
    _eval_is_positive() {
      return this.p > 0;
    }
    _eval_is_odd() {
      return this.p % 2 === 1;
    }
    _eval_power(expt) {
      if (expt === S.Infinity) {
        if (this.p > 1) {
          return S.Infinity;
        }
      }
      if (expt === S.NegativeInfinity) {
        return new Rational(1, this, 1)._eval_power(S.Infinity);
      }
      if (!(expt instanceof _Number_)) {
        if (this.is_negative && expt.is_even) {
          return this.__mul__(S.NegativeOne)._eval_power(expt);
        }
      }
      if (expt instanceof Float) {
        return super._eval_power(expt);
      }
      if (!(expt instanceof Rational)) {
        return void 0;
      }
      if (expt.is_negative()) {
        const ne = expt.__mul__(S.NegativeOne);
        if (this.is_negative()) {
          return S.NegativeOne._eval_power(expt).__mul__(new Rational(1, this.__mul__(S.NegativeOne), 1))._eval_power(ne);
        } else {
          return new Rational(1, this.p, 1)._eval_power(ne);
        }
      }
      const [x2, xexact] = int_nthroot(Math.abs(this.p), expt.q);
      if (xexact) {
        let result2 = new _Integer(x2 ** Math.abs(expt.p));
        if (this.is_negative()) {
          result2 = result2.__mul__(S.NegativeOne._eval_power(expt));
        }
        return result2;
      }
      const b_pos = Math.abs(this.p);
      const p = perfect_power(b_pos);
      let dict = new HashDict();
      if (p !== false) {
        dict.add(p[0], p[1]);
      } else {
        dict = new _Integer(b_pos).factors(2 ** 15);
      }
      let out_int = 1;
      let out_rad = S.One;
      let sqr_int = 1;
      let sqr_gcd = 0;
      const sqr_dict = new HashDict();
      let prime;
      let exponent;
      for ([prime, exponent] of dict.entries()) {
        exponent *= expt.p;
        const [div_e, div_m] = divmod(exponent, expt.q);
        if (div_e > 0) {
          out_int *= prime ** div_e;
        }
        if (div_m > 0) {
          const g = igcd(div_m, expt.q);
          if (g !== 1) {
            out_rad = out_rad.__mul__(new Pow(prime, new Rational(Math.floor(div_m / g), Math.floor(expt.q / g), 1)));
          } else {
            sqr_dict.add(prime, div_m);
          }
        }
      }
      for (const [, ex] of sqr_dict.entries()) {
        if (sqr_gcd === 0) {
          sqr_gcd = ex;
        } else {
          sqr_gcd = igcd(sqr_gcd, ex);
          if (sqr_gcd === 1) {
            break;
          }
        }
      }
      for (const [k, v] of sqr_dict.entries()) {
        sqr_int *= k ** Math.floor(v / sqr_gcd);
      }
      let result;
      if (sqr_int === b_pos && out_int === 1 && out_rad === S.One) {
        result = void 0;
      } else {
        const p1 = out_rad.__mul__(new _Integer(out_int));
        const p2 = new Pow(new _Integer(sqr_int), new Rational(sqr_gcd, expt.q));
        result = new Mul(true, true, p1, p2);
        if (this.is_negative()) {
          result = result.__mul__(new Pow(S.NegativeOne, expt));
        }
      }
      return result;
    }
    toString() {
      return String(this.p);
    }
  };
  var Integer = _Integer;
  Integer.is_integer = true;
  Integer.is_Integer = true;
  ManagedProperties.register(Integer);
  var IntegerConstant = class extends Integer {
    constructor() {
      super(...arguments);
      this.__slots__ = [];
    }
  };
  ManagedProperties.register(IntegerConstant);
  var Zero = class extends IntegerConstant {
    constructor() {
      super(0);
      this.__slots__ = [];
    }
  };
  Zero.is_positive = false;
  Zero.static = false;
  Zero.is_zero = true;
  Zero.is_number = true;
  Zero.is_comparable = true;
  ManagedProperties.register(Zero);
  var One = class extends IntegerConstant {
    constructor() {
      super(1);
      this.__slots__ = [];
    }
  };
  One.is_number = true;
  One.is_positive = true;
  One.is_zero = false;
  ManagedProperties.register(One);
  var NegativeOne = class extends IntegerConstant {
    constructor() {
      super(-1);
      this.__slots__ = [];
    }
    _eval_power(expt) {
      if (expt.is_odd) {
        return S.NegativeOne;
      } else if (expt.is_even) {
        return S.One;
      }
      if (expt instanceof _Number_) {
        if (expt instanceof Float) {
          return new Float(-1)._eval_power(expt);
        }
        if (expt === S.NaN) {
          return S.NaN;
        }
        if (expt === S.Infinity || expt === S.NegativeInfinity) {
          return S.NaN;
        }
      }
      return;
    }
  };
  NegativeOne.is_number = true;
  ManagedProperties.register(NegativeOne);
  var NaN2 = class extends _Number_ {
    constructor() {
      super(...arguments);
      this.__slots__ = [];
    }
    toString() {
      return "NAN";
    }
  };
  NaN2.is_commutative = true;
  NaN2.is_extended_real = void 0;
  NaN2.is_real = void 0;
  NaN2.is_rational = void 0;
  NaN2.is_algebraic = void 0;
  NaN2.is_transcendental = void 0;
  NaN2.is_integer = void 0;
  NaN2.is_comparable = false;
  NaN2.is_finite = void 0;
  NaN2.is_zero = void 0;
  NaN2.is_prime = void 0;
  NaN2.is_positive = void 0;
  NaN2.is_negative = void 0;
  NaN2.is_number = true;
  ManagedProperties.register(NaN2);
  var ComplexInfinity = class extends _AtomicExpr2 {
    constructor() {
      super();
      this.kind = NumberKind;
      this.__slots__ = [];
    }
    toString() {
      return "ComplexInfinity";
    }
  };
  ComplexInfinity.is_commutative = true;
  ComplexInfinity.is_infinite = true;
  ComplexInfinity.is_number = true;
  ComplexInfinity.is_prime = false;
  ComplexInfinity.is_complex = false;
  ComplexInfinity.is_extended_real = false;
  ManagedProperties.register(ComplexInfinity);
  var Infinity = class extends _Number_ {
    constructor() {
      super();
      this.__slots__ = [];
    }
    __add__(other) {
      if (other instanceof _Number_ && global_parameters.evaluate) {
        if (other === S.NegativeInfinity || other === S.NaN) {
          return S.NaN;
        }
        return this;
      }
      return super.__add__(other);
    }
    __mul__(other) {
      if (other instanceof _Number_ && global_parameters.evaluate) {
        if (other === S.Zero || other === S.NaN) {
          return S.NaN;
        } else if (other.is_extended_positive()) {
          return this;
        }
        return S.NegativeInfinity;
      }
      return super.__mul__(other);
    }
    toString() {
      return "Infinity";
    }
  };
  Infinity.is_commutative = true;
  Infinity.is_number = true;
  Infinity.is_complex = false;
  Infinity.is_extended_real = true;
  Infinity.is_infinite = true;
  Infinity.is_comparable = true;
  Infinity.is_extended_positive = true;
  Infinity.is_prime = false;
  var NegativeInfinity = class extends _Number_ {
    constructor() {
      super();
      this.__slots__ = [];
    }
    __add__(other) {
      if (other instanceof _Number_ && global_parameters.evaluate) {
        if (other === S.NegativeInfinity || other === S.NaN) {
          return S.NaN;
        }
        return this;
      }
      return super.__add__(other);
    }
    __mul__(other) {
      if (other instanceof _Number_ && global_parameters.evaluate) {
        if (other === S.Zero || other === S.NaN) {
          return S.NaN;
        } else if (other.is_extended_positive()) {
          return this;
        }
        return S.Infinity;
      }
      return super.__mul__(other);
    }
    toString() {
      return "NegInfinity";
    }
  };
  NegativeInfinity.is_extended_real = true;
  NegativeInfinity.is_complex = false;
  NegativeInfinity.is_commutative = true;
  NegativeInfinity.is_infinite = true;
  NegativeInfinity.is_comparable = true;
  NegativeInfinity.is_extended_negative = true;
  NegativeInfinity.is_number = true;
  NegativeInfinity.is_prime = false;
  Singleton.register("Zero", Zero);
  S.Zero = Singleton.registry["Zero"];
  Singleton.register("One", One);
  S.One = Singleton.registry["One"];
  Singleton.register("NegativeOne", NegativeOne);
  S.NegativeOne = Singleton.registry["NegativeOne"];
  Singleton.register("NaN", NaN2);
  S.NaN = Singleton.registry["NaN"];
  Singleton.register("ComplexInfinity", ComplexInfinity);
  S.ComplexInfinity = Singleton.registry["ComplexInfinity"];
  Singleton.register("Infinity", Infinity);
  S.Infinity = Singleton.registry["Infinity"];
  Singleton.register("NegativeInfinity", NegativeInfinity);
  S.NegativeInfinity = Singleton.registry["NegativeInfinity"];

  // ts-port/ntheory/factor_.ts
  var small_trailing = new Array(256).fill(0);
  for (let j = 1; j < 8; j++) {
    Util.assignElements(small_trailing, new Array(1 << 7 - j).fill(j), 1 << j, 1 << j + 1);
  }
  function bitcount(n2) {
    let bits = 0;
    while (n2 !== 0) {
      bits += bitCount32(n2 | 0);
      n2 /= 4294967296;
    }
    return bits;
  }
  function bitCount32(n2) {
    n2 = n2 - (n2 >> 1 & 1431655765);
    n2 = (n2 & 858993459) + (n2 >> 2 & 858993459);
    return (n2 + (n2 >> 4) & 252645135) * 16843009 >> 24;
  }
  function trailing(n2) {
    n2 = Math.floor(Math.abs(n2));
    const low_byte = n2 & 255;
    if (low_byte) {
      return small_trailing[low_byte];
    }
    const z = bitcount(n2) - 1;
    if (Number.isInteger(z)) {
      if (n2 === 1 << z) {
        return z;
      }
    }
    if (z < 300) {
      let t2 = 8;
      n2 >>= 8;
      while (!(n2 & 255)) {
        n2 >>= 8;
        t2 += 8;
      }
      return t2 + small_trailing[n2 & 255];
    }
    let t = 0;
    let p = 8;
    while (!(n2 & 1)) {
      while (!(n2 & (1 << p) - 1)) {
        n2 >>= p;
        t += p;
        p *= 2;
      }
      p = Math.floor(p / 2);
    }
    return t;
  }
  function isprime(num) {
    for (let i = 2, s = Math.sqrt(num); i <= s; i++) {
      if (num % i === 0) {
        return false;
      }
    }
    return num > 1;
  }
  function* primerange(a, b = void 0) {
    if (typeof b === "undefined") {
      [a, b] = [2, a];
    }
    if (a >= b) {
      return;
    }
    a = Math.ceil(a) - 1;
    b = Math.floor(b);
    while (1) {
      a = nextprime(a);
      if (a < b) {
        yield a;
      } else {
        return;
      }
    }
  }
  function nextprime(n2, ith = 1) {
    n2 = Math.floor(n2);
    const i = as_int(ith);
    if (i > 1) {
      let pr = n2;
      let j = 1;
      while (1) {
        pr = nextprime(pr);
        j++;
        if (j > 1) {
          break;
        }
      }
      return pr;
    }
    if (n2 < 2) {
      return 2;
    }
    if (n2 < 7) {
      return { 2: 3, 3: 5, 4: 5, 5: 7, 6: 7 }[n2];
    }
    const nn = 6 * Math.floor(n2 / 6);
    if (nn === n2) {
      n2++;
      if (isprime(n2)) {
        return n2;
      }
      n2 += 4;
    } else if (n2 - nn === 5) {
      n2 += 2;
      if (isprime(n2)) {
        return n2;
      }
      n2 += 4;
    } else {
      n2 = nn + 5;
    }
    while (1) {
      if (isprime(n2)) {
        return n2;
      }
      n2 += 2;
      if (isprime(n2)) {
        return n2;
      }
      n2 += 4;
    }
  }
  var divmod = (a, b) => [Math.floor(a / b), a % b];
  function multiplicity(p, n2) {
    try {
      [p, n2] = [as_int(p), as_int(n2)];
    } catch (Error2) {
      if (Number.isInteger(p) || p instanceof Rational && Number.isInteger(n2) || n2 instanceof Rational) {
        p = new Rational(p);
        n2 = new Rational(n2);
        if (p.q === 1) {
          if (n2.p === 1) {
            return -multiplicity(p.p, n2.q);
          }
          return multiplicity(p.p, n2.p) - multiplicity(p.p, n2.q);
        } else if (p.p === 1) {
          return multiplicity(p.q, n2.q);
        } else {
          const like = Math.min(multiplicity(p.p, n2.p), multiplicity(p.q, n2.q));
          const cross = Math.min(multiplicity(p.q, n2.p), multiplicity(p.p, n2.q));
          return like - cross;
        }
      }
    }
    if (n2 === 0) {
      throw new Error("no int exists");
    }
    if (p === 2) {
      return trailing(n2);
    }
    if (p < 2) {
      throw new Error("p must be int");
    }
    if (p === n2) {
      return 1;
    }
    let m = 0;
    n2 = Math.floor(n2 / p);
    let rem = n2 % p;
    while (!rem) {
      m++;
      if (m > 5) {
        let e = 2;
        while (1) {
          const ppow = p ** e;
          if (ppow < n2) {
            const nnew = Math.floor(n2 / ppow);
            rem = n2 % ppow;
            if (!rem) {
              m += e;
              e *= 2;
              n2 = nnew;
              continue;
            }
          }
          return m + multiplicity(p, n2);
        }
      }
      [n2, rem] = divmod(n2, p);
    }
    return m;
  }
  function divisors(n2, generator = false, proper = false) {
    n2 = as_int(Math.abs(n2));
    if (isprime(n2)) {
      if (proper) {
        return [1];
      }
      return [1, n2];
    }
    if (n2 === 1) {
      if (proper) {
        return [];
      }
      return [1];
    }
    if (n2 === 0) {
      return [];
    }
    const rv = _divisors(n2, proper);
    if (!generator) {
      const temp = [];
      for (const i of rv) {
        temp.push(i);
      }
      temp.sort();
      return temp;
    }
    return rv;
  }
  function* _divisors(n2, generator = false, proper = false) {
    const factordict = factorint(n2);
    const ps = factordict.keys().sort();
    function* rec_gen(n3 = 0) {
      if (n3 === ps.length) {
        yield 1;
      } else {
        const pows = [1];
        for (let j = 0; j < factordict.get(ps[n3]); j++) {
          pows.push(pows[pows.length - 1] * ps[n3]);
        }
        for (const q of rec_gen(n3 + 1)) {
          for (const p of pows) {
            yield p * q;
          }
        }
      }
    }
    if (proper) {
      for (const p of rec_gen()) {
        if (p != n2) {
          yield p;
        }
      }
    } else {
      for (const p of rec_gen()) {
        yield p;
      }
    }
  }
  function _check_termination(factors, n2, limitp1) {
    const p = perfect_power(n2, void 0, true, false);
    if (p !== false) {
      const [base2, exp2] = p;
      let limit;
      if (limitp1) {
        limit = limitp1 = 1;
      } else {
        limit = limitp1;
      }
      const facs = factorint(base2, limit);
      for (const [b, e] of facs.entries()) {
        factors[b] = exp2 * e;
        throw new Error();
      }
    }
    if (isprime(n2)) {
      factors.add(n2, 1);
      throw new Error();
    }
    if (n2 === 1) {
      throw new Error();
    }
  }
  function _trial(factors, n2, candidates) {
    const nfactors = factors.length;
    for (const d of candidates) {
      if (n2 % d === 0) {
        const m = multiplicity(d, n2);
        n2 = Math.floor(n2 / d ** m);
        factors[d] = m;
      }
    }
    return [n2, factors.length !== nfactors];
  }
  function _factorint_small(factors, n2, limit, fail_max) {
    function done(n3, d2) {
      if (d2 * d2 <= n3) {
        return [n3, d2];
      }
      return [n3, 0];
    }
    let d = 2;
    let m = trailing(n2);
    if (m) {
      factors.add(d, m);
      n2 >>= m;
    }
    d = 3;
    if (limit < d) {
      if (n2 > 1) {
        factors.add(n2, 1);
      }
      return done(n2, d);
    }
    m = 0;
    while (n2 % d === 0) {
      n2 = Math.floor(n2 / d);
      m++;
      if (m === 20) {
        const mm = multiplicity(d, n2);
        m += mm;
        n2 = Math.floor(n2 / d ** mm);
        break;
      }
    }
    if (m) {
      factors.add(d, m);
    }
    let maxx;
    if (limit * limit > n2) {
      maxx = 0;
    } else {
      maxx = limit * limit;
    }
    let dd = maxx || n2;
    d = 5;
    let fails = 0;
    while (fails < fail_max) {
      if (d * d > dd) {
        break;
      }
      m = 0;
      while (n2 % d === 0) {
        n2 = Math.floor(n2 / d);
        m++;
        if (m === 20) {
          const mm = multiplicity(d, n2);
          m += mm;
          n2 = Math.floor(n2 / d ** mm);
          break;
        }
      }
      if (m) {
        factors.add(d, m);
        dd = maxx || n2;
        fails = 0;
      } else {
        fails++;
      }
      d += 2;
      if (d * d > dd) {
        break;
      }
      m = 0;
      while (n2 % d === 0) {
        n2 = Math.floor(n2 / d);
        m++;
        if (m === 20) {
          const mm = multiplicity(d, n2);
          m += mm;
          n2 = Math.floor(n2 / d ** mm);
          break;
        }
      }
      if (m) {
        factors.add(d, m);
        dd = maxx || n2;
        fails = 0;
      } else {
        fails++;
      }
      d += 4;
    }
    return done(n2, d);
  }
  function factorint(n2, limit = void 0) {
    if (n2 instanceof Integer) {
      n2 = n2.p;
    }
    n2 = as_int(n2);
    if (limit) {
      limit = limit;
    }
    if (n2 < 0) {
      const factors2 = factorint(-n2, limit);
      factors2.add(factors2.size - 1, 1);
      return factors2;
    }
    if (limit && limit < 2) {
      if (n2 === 1) {
        return new HashDict();
      }
      return new HashDict({ n: 1 });
    } else if (n2 < 10) {
      return new HashDict([
        { 0: 1 },
        {},
        { 2: 1 },
        { 3: 1 },
        { 2: 2 },
        { 5: 1 },
        { 2: 1, 3: 1 },
        { 7: 1 },
        { 2: 3 },
        { 3: 2 }
      ][n2]);
    }
    const factors = new HashDict();
    let small = 2 ** 15;
    const fail_max = 600;
    small = Math.min(small, limit || small);
    let next_p;
    [n2, next_p] = _factorint_small(factors, n2, small, fail_max);
    let sqrt_n;
    try {
      if (limit && next_p > limit) {
        _check_termination(factors, n2, limit);
        if (n2 > 1) {
          factors.add(n2, 1);
        }
        return factors;
      } else {
        sqrt_n = int_nthroot(n2, 2)[0];
        let a = sqrt_n + 1;
        const a2 = a ** 2;
        let b2 = a2 - n2;
        let b;
        let fermat;
        for (let i = 0; i < 3; i++) {
          [b, fermat] = int_nthroot(b2, 2);
          if (fermat) {
            break;
          }
          b2 += 2 * a + 1;
          a++;
        }
        if (fermat) {
          if (limit) {
            limit -= 1;
          }
          for (const r of [a - b, a + b]) {
            const facs = factorint(r, limit);
            for (const [k, v] of facs.entries()) {
              factors.add(k, factors.get(k, 0) + v);
            }
          }
          throw new Error();
        }
        _check_termination(factors, n2, limit);
      }
    } catch (Error2) {
      return factors;
    }
    let [low, high] = [next_p, 2 * next_p];
    limit = limit || sqrt_n;
    limit++;
    while (1) {
      try {
        let high_ = high;
        if (limit < high_) {
          high_ = limit;
        }
        const ps = primerange(low, high_);
        let found_trial;
        [n2, found_trial] = _trial(factors, n2, ps);
        if (found_trial) {
          _check_termination(factors, n2, limit);
        }
        if (high > limit) {
          if (n2 > 1) {
            factors.add(n2, 1);
          }
          throw new Error();
        }
        if (!found_trial) {
          throw new Error("advanced factoring methods are not yet implemented");
        }
      } catch (Error2) {
        return factors;
      }
      [low, high] = [high, high * 2];
    }
    let B1 = 1e4;
    let B2 = 100 * B1;
    let num_curves = 50;
    while (1) {
      while (1) {
        try {
          throw new Error("ecm one factor not yet implemented");
        } catch (Error2) {
          return factors;
        }
      }
      B1 *= 5;
      B2 = 100 * B1;
      num_curves *= 4;
    }
  }
  function perfect_power(n2, candidates = void 0, big = true, factor = true, num_iterations = 15) {
    let pp;
    if (n2 instanceof Rational && !n2.is_integer) {
      const [p, q] = n2._as_numer_denom();
      if (p === S.One) {
        pp = perfect_power(q);
        if (pp) {
          pp = [n2.constructor(1, pp[0]), pp[1]];
        }
      } else {
        pp = perfect_power(p);
        if (pp) {
          const [num, e] = pp;
          const pq = perfect_power(q, [e]);
          if (pq) {
            const [den, blank] = pq;
            pp = [n2.constructor(num, den), e];
          }
        }
      }
      return pp;
    }
    n2 = as_int(n2);
    if (n2 < 0) {
      pp = perfect_power(-n2);
      if (pp) {
        const [b, e] = pp;
        if (e % 2 !== 0) {
          return [-b, e];
        }
      }
      return false;
    }
    if (n2 <= 3) {
      return false;
    }
    const logn = Math.log2(n2);
    const max_possible = Math.floor(logn) + 2;
    const not_square = [2, 3, 7, 8].includes(n2 % 10);
    const min_possible = 2 + not_square;
    if (typeof candidates === "undefined") {
      candidates = primerange(min_possible, max_possible);
    } else {
      const temp = [];
      candidates.sort();
      for (const i of candidates) {
        if (min_possible <= i && i <= max_possible) {
          temp.push(i);
        }
      }
      candidates = temp;
      if (n2 % 2 === 0) {
        const e = trailing(n2);
        const temp2 = [];
        for (const i of candidates) {
          if (e % i === 0) {
            temp2.push(i);
          }
        }
        candidates = temp2;
      }
      if (big) {
        candidates.reverse();
      }
      for (const e of candidates) {
        const [r, ok] = int_nthroot(n2, e);
        if (ok) {
          return [r, e];
        }
      }
      return false;
    }
    function* _factors(length) {
      let rv = 2 + n2 % 2;
      for (let i = 0; i < length; i++) {
        yield rv;
        rv = nextprime(rv);
      }
    }
    const _candidates = [];
    for (const i of candidates) {
      _candidates.push(i);
    }
    const _factors_ = [];
    for (const i of _factors(_candidates.length)) {
      _factors_.push(i);
    }
    for (const item of Util.zip(_factors_, _candidates)) {
      const fac = item[0];
      let e = item[1];
      let r;
      let exact;
      if (factor && n2 % fac === 0) {
        if (fac === 2) {
          e = trailing(n2);
        } else {
          e = multiplicity(fac, n2);
        }
        if (e === 1) {
          return false;
        }
        [r, exact] = int_nthroot(n2, e);
        if (!exact) {
          const m = Math.floor(n2 / fac) ** e;
          const rE = perfect_power(m, divisors(e, true));
          if (!rE) {
            return false;
          } else {
            let [r2, E] = rE;
            [r2, e] = [fac ** (Math.floor(e / E) * r2), E];
          }
        }
        return [r, e];
      }
      if (logn / e < 40) {
        const b = 2 ** (logn / e);
        if (Math.abs(Math.floor(b + 0.5) - b) > 0.01) {
          continue;
        }
      }
      [r, exact] = int_nthroot(n2, e);
      if (exact) {
        const m = perfect_power(r, void 0, big, factor);
        if (m) {
          [r, e] = [m[0], e * m[1]];
        }
        return [Math.floor(r), e];
      }
    }
    return false;
  }
  function factorrat(rat, limit = void 0) {
    const f = factorint(rat.p, limit);
    for (const item of factorint(rat.q, limit).entries()) {
      const p = item[0];
      const e = item[1];
      f.add(p, f.get(p, 0) - e);
    }
    if (f.size > 1 && f.has(1)) {
      f.remove(1);
    }
    return f;
  }

  // ts-port/core/boolalg.ts
  var Boolean2 = (superclass) => {
    var _a;
    return _a = class extends mix(base).with(_Basic) {
      constructor() {
        super(...arguments);
        this.__slots__ = [];
      }
    }, _a.kind = BooleanKind, _a;
  };
  ManagedProperties.register(Boolean2(Object));

  // ts-port/core/symbol.ts
  var _Symbol = class extends mix(base).with(Boolean2, AtomicExpr) {
    constructor(name, properties = void 0) {
      super();
      this.__slots__ = ["name"];
      this.name = name;
      const assumptions = new HashDict(properties);
      _Symbol._sanitize(assumptions);
      const tmp_asm_copy = assumptions.copy();
      const is_commutative = fuzzy_bool(assumptions.get("commutative", true));
      assumptions.add("is_commutative", is_commutative);
      this._assumptions = new StdFactKB(assumptions);
      this._assumptions._generator = tmp_asm_copy;
    }
    kind() {
      if (this.constructor.is_commutative) {
        return NumberKind;
      }
      return UndefinedKind;
    }
    _diff_wrt() {
      return true;
    }
    hashKey() {
      return this.name + this.args;
    }
    equals(other) {
      if (this.name = other.name) {
        if (this._assumptions.isSame(other._assumptions)) {
          return true;
        }
      }
      return false;
    }
    static _sanitize(assumptions = new HashDict()) {
      const is_commutative = fuzzy_bool(assumptions.get("commutative", true));
      if (typeof is_commutative === "undefined") {
        throw new Error("commutativity must be true or false");
      }
      for (const key of assumptions.keys()) {
        const v = assumptions.get(key);
        if (typeof v === "undefined") {
          assumptions.delete(key);
          continue;
        }
        assumptions.add(key, v);
      }
    }
    toString() {
      return this.name;
    }
  };
  var Symbol2 = _Symbol;
  Symbol2.is_comparable = false;
  Symbol2.is_Symbol = true;
  Symbol2.is_symbol = true;
  Symbol2.is_commutative = true;
  ManagedProperties.register(Symbol2);

  // ts-port/symtype.ts
  var n = _Number_.new(4);
  var x = new Symbol2("x");
  x = new Add(true, true, n, n, x);
  x = new Mul(true, true, n, n, x);
  x = new Pow(n, n);
  var bigint = _Number_.new(285);
  x = factorint(bigint);
  var bigrat = _Number_.new(271, 932);
  x = factorrat(bigrat);
  x = new Pow(n, S.NaN);
})();
/*!
 *  decimal.js v10.4.3
 *  An arbitrary-precision Decimal type for JavaScript.
 *  https://github.com/MikeMcl/decimal.js
 *  Copyright (c) 2022 Michael Mclaughlin <M8ch88l@gmail.com>
 *  MIT Licence
 */
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsiLi4vY29yZS91dGlsaXR5LnRzIiwgIi4uL2NvcmUvbG9naWMudHMiLCAiLi4vY29yZS9mYWN0cy50cyIsICIuLi9jb3JlL2NvcmUudHMiLCAiLi4vY29yZS9hc3N1bXB0aW9ucy50cyIsICIuLi9jb3JlL2tpbmQudHMiLCAiLi4vY29yZS90cmF2ZXJzYWwudHMiLCAiLi4vY29yZS9iYXNpYy50cyIsICIuLi9jb3JlL3NpbmdsZXRvbi50cyIsICIuLi9jb3JlL2dsb2JhbC50cyIsICIuLi91dGlsaXRpZXMvbWlzYy50cyIsICIuLi9jb3JlL2V4cHIudHMiLCAiLi4vY29yZS9wYXJhbWV0ZXJzLnRzIiwgIi4uL2NvcmUvb3BlcmF0aW9ucy50cyIsICIuLi9jb3JlL3Bvd2VyLnRzIiwgIi4uL2NvcmUvbXVsLnRzIiwgIi4uL2NvcmUvYWRkLnRzIiwgIi4uLy4uL25vZGVfbW9kdWxlcy9kZWNpbWFsLmpzL2RlY2ltYWwubWpzIiwgIi4uL2NvcmUvbnVtYmVycy50cyIsICIuLi9udGhlb3J5L2ZhY3Rvcl8udHMiLCAiLi4vY29yZS9ib29sYWxnLnRzIiwgIi4uL2NvcmUvc3ltYm9sLnRzIiwgIi4uL3N5bXR5cGUudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbIi8qXG5BIGZpbGUgd2l0aCB1dGlsaXR5IGNsYXNzZXMgYW5kIGZ1bmN0aW9ucyB0byBoZWxwIHdpdGggcG9ydGluZ1xuRGV2ZWxvcGQgYnkgV0IgYW5kIEdNXG4qL1xuXG4vLyBnZW5lcmFsIHV0aWwgZnVuY3Rpb25zXG5jbGFzcyBVdGlsIHtcbiAgICAvLyBoYXNoa2V5IGZ1bmN0aW9uXG4gICAgLy8gc2hvdWxkIGJlIGFibGUgdG8gaGFuZGxlIG11bHRpcGxlIHR5cGVzIG9mIGlucHV0c1xuICAgIHN0YXRpYyBoYXNoS2V5KHg6IGFueSk6IHN0cmluZyB7XG4gICAgICAgIGlmICh0eXBlb2YgeCA9PT0gXCJ1bmRlZmluZWRcIikge1xuICAgICAgICAgICAgcmV0dXJuIFwidW5kZWZpbmVkXCI7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHguaGFzaEtleSkge1xuICAgICAgICAgICAgcmV0dXJuIHguaGFzaEtleSgpO1xuICAgICAgICB9XG4gICAgICAgIGlmIChBcnJheS5pc0FycmF5KHgpKSB7XG4gICAgICAgICAgICByZXR1cm4geC5tYXAoKGUpID0+IFV0aWwuaGFzaEtleShlKSkuam9pbihcIixcIik7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHggPT09IG51bGwpIHtcbiAgICAgICAgICAgIHJldHVybiBcIm51bGxcIjtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4geC50b1N0cmluZygpO1xuICAgIH1cblxuICAgIC8vIGNoZWNrIGlmIGFycjEgaXMgYSBzdWJzZXQgb2YgYXJyMlxuICAgIHN0YXRpYyBpc1N1YnNldChhcnIxOiBhbnlbXSwgYXJyMjogYW55W10pOiBib29sZWFuIHtcbiAgICAgICAgY29uc3QgdGVtcGFyciA9IGFycjIubWFwKChpOiBhbnkpID0+IFV0aWwuaGFzaEtleShpKSlcbiAgICAgICAgZm9yIChjb25zdCBlIG9mIGFycjEpIHtcbiAgICAgICAgICAgIGlmICghdGVtcGFyci5pbmNsdWRlcyhVdGlsLmhhc2hLZXkoZSkpKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cblxuICAgIC8vIGNvbnZlcnQgYW4gaW50ZWdlciB0byBiaW5hcnlcbiAgICAvLyBmdW5jdGlvbmFsIGZvciBuZWdhdGl2ZSBudW1iZXJzXG4gICAgc3RhdGljIGJpbihudW06IG51bWJlcikge1xuICAgICAgICByZXR1cm4gKG51bSA+Pj4gMCkudG9TdHJpbmcoMik7XG4gICAgfVxuXG4gICAgc3RhdGljKiBwcm9kdWN0KHJlcGVhdDogbnVtYmVyID0gMSwgLi4uYXJnczogYW55W10pIHtcbiAgICAgICAgY29uc3QgdG9BZGQ6IGFueVtdID0gW107XG4gICAgICAgIGZvciAoY29uc3QgYSBvZiBhcmdzKSB7XG4gICAgICAgICAgICB0b0FkZC5wdXNoKFthXSk7XG4gICAgICAgIH1cbiAgICAgICAgY29uc3QgcG9vbHM6IGFueVtdID0gW107XG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgcmVwZWF0OyBpKyspIHtcbiAgICAgICAgICAgIHRvQWRkLmZvckVhY2goKGU6IGFueSkgPT4gcG9vbHMucHVzaChlWzBdKSk7XG4gICAgICAgIH1cbiAgICAgICAgbGV0IHJlczogYW55W11bXSA9IFtbXV07XG4gICAgICAgIGZvciAoY29uc3QgcG9vbCBvZiBwb29scykge1xuICAgICAgICAgICAgY29uc3QgcmVzX3RlbXA6IGFueVtdID0gW107XG4gICAgICAgICAgICBmb3IgKGNvbnN0IHggb2YgcmVzKSB7XG4gICAgICAgICAgICAgICAgZm9yIChjb25zdCB5IG9mIHBvb2wpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHR5cGVvZiB4WzBdID09PSBcInVuZGVmaW5lZFwiKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXNfdGVtcC5wdXNoKFt5XSk7XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXNfdGVtcC5wdXNoKHguY29uY2F0KHkpKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJlcyA9IHJlc190ZW1wO1xuICAgICAgICB9XG4gICAgICAgIGZvciAoY29uc3QgcHJvZCBvZiByZXMpIHtcbiAgICAgICAgICAgIHlpZWxkIHByb2Q7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBzdGF0aWMqIHBlcm11dGF0aW9ucyhpdGVyYWJsZTogYW55LCByOiBhbnkgPSB1bmRlZmluZWQpIHtcbiAgICAgICAgY29uc3QgbiA9IGl0ZXJhYmxlLmxlbmd0aDtcbiAgICAgICAgaWYgKHR5cGVvZiByID09PSBcInVuZGVmaW5lZFwiKSB7XG4gICAgICAgICAgICByID0gbjtcbiAgICAgICAgfVxuICAgICAgICBjb25zdCByYW5nZSA9IHRoaXMucmFuZ2Uobik7XG4gICAgICAgIGZvciAoY29uc3QgaW5kaWNlcyBvZiBVdGlsLnByb2R1Y3QociwgcmFuZ2UpKSB7XG4gICAgICAgICAgICBpZiAoaW5kaWNlcy5sZW5ndGggPT09IHIpIHtcbiAgICAgICAgICAgICAgICBjb25zdCB5OiBhbnlbXSA9IFtdO1xuICAgICAgICAgICAgICAgIGZvciAoY29uc3QgaSBvZiBpbmRpY2VzKSB7XG4gICAgICAgICAgICAgICAgICAgIHkucHVzaChpdGVyYWJsZVtpXSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHlpZWxkIHk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBzdGF0aWMqIGZyb21faXRlcmFibGUoaXRlcmFibGVzOiBhbnkpIHtcbiAgICAgICAgZm9yIChjb25zdCBpdCBvZiBpdGVyYWJsZXMpIHtcbiAgICAgICAgICAgIGZvciAoY29uc3QgZWxlbWVudCBvZiBpdCkge1xuICAgICAgICAgICAgICAgIHlpZWxkIGVsZW1lbnQ7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBzdGF0aWMgYXJyRXEoYXJyMTogYW55W10sIGFycjI6IGFueSkge1xuICAgICAgICBpZiAoYXJyMS5sZW5ndGggIT09IGFycjIubGVuZ3RoKSB7XG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH1cbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBhcnIxLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBpZiAoIShhcnIxW2ldID09PSBhcnIyW2ldKSkge1xuICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG5cbiAgICBzdGF0aWMqIGNvbWJpbmF0aW9ucyhpdGVyYWJsZTogYW55LCByOiBhbnkpIHtcbiAgICAgICAgY29uc3QgbiA9IGl0ZXJhYmxlLmxlbmd0aDtcbiAgICAgICAgY29uc3QgcmFuZ2UgPSB0aGlzLnJhbmdlKG4pO1xuICAgICAgICBmb3IgKGNvbnN0IGluZGljZXMgb2YgVXRpbC5wZXJtdXRhdGlvbnMocmFuZ2UsIHIpKSB7XG4gICAgICAgICAgICBpZiAoVXRpbC5hcnJFcShpbmRpY2VzLnNvcnQoZnVuY3Rpb24oYSwgYikge1xuICAgICAgICAgICAgICAgIHJldHVybiBhIC0gYjtcbiAgICAgICAgICAgIH0pLCBpbmRpY2VzKSkge1xuICAgICAgICAgICAgICAgIGNvbnN0IHJlczogYW55W10gPSBbXTtcbiAgICAgICAgICAgICAgICBmb3IgKGNvbnN0IGkgb2YgaW5kaWNlcykge1xuICAgICAgICAgICAgICAgICAgICByZXMucHVzaChpdGVyYWJsZVtpXSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHlpZWxkIHJlcztcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgIHN0YXRpYyogY29tYmluYXRpb25zX3dpdGhfcmVwbGFjZW1lbnQoaXRlcmFibGU6IGFueSwgcjogYW55KSB7XG4gICAgICAgIGNvbnN0IG4gPSBpdGVyYWJsZS5sZW5ndGg7XG4gICAgICAgIGNvbnN0IHJhbmdlID0gdGhpcy5yYW5nZShuKTtcbiAgICAgICAgZm9yIChjb25zdCBpbmRpY2VzIG9mIFV0aWwucHJvZHVjdChyLCByYW5nZSkpIHtcbiAgICAgICAgICAgIGlmIChVdGlsLmFyckVxKGluZGljZXMuc29ydChmdW5jdGlvbihhLCBiKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGEgLSBiO1xuICAgICAgICAgICAgfSksIGluZGljZXMpKSB7XG4gICAgICAgICAgICAgICAgY29uc3QgcmVzOiBhbnlbXSA9IFtdO1xuICAgICAgICAgICAgICAgIGZvciAoY29uc3QgaSBvZiBpbmRpY2VzKSB7XG4gICAgICAgICAgICAgICAgICAgIHJlcy5wdXNoKGl0ZXJhYmxlW2ldKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgeWllbGQgcmVzO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgc3RhdGljIHppcChhcnIxOiBhbnlbXSwgYXJyMjogYW55W10sIGZpbGx2YWx1ZTogc3RyaW5nID0gXCItXCIpIHtcbiAgICAgICAgY29uc3QgcmVzID0gYXJyMS5tYXAoZnVuY3Rpb24oZSwgaSkge1xuICAgICAgICAgICAgcmV0dXJuIFtlLCBhcnIyW2ldXTtcbiAgICAgICAgfSk7XG4gICAgICAgIHJlcy5mb3JFYWNoKCh6aXA6IGFueSkgPT4ge1xuICAgICAgICAgICAgaWYgKHppcC5pbmNsdWRlcyh1bmRlZmluZWQpKSB7XG4gICAgICAgICAgICAgICAgemlwLnNwbGljZSgxLCAxLCBmaWxsdmFsdWUpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgICAgcmV0dXJuIHJlcztcbiAgICB9XG5cbiAgICBzdGF0aWMgcmFuZ2UobjogbnVtYmVyKSB7XG4gICAgICAgIHJldHVybiBuZXcgQXJyYXkobikuZmlsbCgwKS5tYXAoKF8sIGlkeCkgPT4gaWR4KTtcbiAgICB9XG5cbiAgICBzdGF0aWMgZ2V0QXJySW5kZXgoYXJyMmQ6IGFueVtdW10sIGFycjogYW55W10pIHtcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBhcnIyZC5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgaWYgKFV0aWwuYXJyRXEoYXJyMmRbaV0sIGFycikpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gaTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdW5kZWZpbmVkO1xuICAgIH1cblxuICAgIHN0YXRpYyBnZXRTdXBlcnMoY2xzOiBhbnkpOiBhbnlbXSB7XG4gICAgICAgIGNvbnN0IHNwcnMgPSBbXTtcbiAgICAgICAgY29uc3Qgc3VwZXJjbHMgPSBPYmplY3QuZ2V0UHJvdG90eXBlT2YoY2xzKTtcbiAgICAgIFxuICAgICAgICBpZiAoIHN1cGVyY2xzICE9PSBPYmplY3QucHJvdG90eXBlICYmIHN1cGVyY2xzICE9PSBudWxsKSB7XG4gICAgICAgICAgICBzcHJzLnB1c2goc3VwZXJjbHMpO1xuICAgICAgICAgICAgY29uc3QgcGFyZW50cyA9IFV0aWwuZ2V0U3VwZXJzKHN1cGVyY2xzKTtcbiAgICAgICAgICAgIHNwcnMucHVzaCguLi5wYXJlbnRzKTtcbiAgICAgICAgfVxuICAgICAgXG4gICAgICAgIHJldHVybiBzcHJzO1xuICAgIH1cblxuICAgIHN0YXRpYyBzaHVmZmxlQXJyYXkoYXJyOiBhbnlbXSkge1xuICAgICAgICBmb3IgKGxldCBpID0gYXJyLmxlbmd0aCAtIDE7IGkgPiAwOyBpLS0pIHtcbiAgICAgICAgICAgIGNvbnN0IGogPSBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiAoaSArIDEpKTtcbiAgICAgICAgICAgIGNvbnN0IHRlbXAgPSBhcnJbaV07XG4gICAgICAgICAgICBhcnJbaV0gPSBhcnJbal07XG4gICAgICAgICAgICBhcnJbal0gPSB0ZW1wO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgc3RhdGljIGFyck11bChhcnI6IGFueVtdLCBuOiBudW1iZXIpIHtcbiAgICAgICAgY29uc3QgcmVzID0gW107XG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgbjsgaSsrKSB7XG4gICAgICAgICAgICByZXMucHVzaChhcnIpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiByZXM7XG4gICAgfVxuXG4gICAgc3RhdGljIGFzc2lnbkVsZW1lbnRzKGFycjogYW55W10sIG5ld3ZhbHM6IGFueVtdLCBzdGFydDogbnVtYmVyLCBzdGVwOiBudW1iZXIpIHtcbiAgICAgICAgbGV0IGNvdW50ID0gMDtcbiAgICAgICAgZm9yIChsZXQgaSA9IHN0YXJ0OyBpIDwgYXJyLmxlbmd0aDsgaSs9c3RlcCkge1xuICAgICAgICAgICAgYXJyW2ldID0gbmV3dmFsc1tjb3VudF07XG4gICAgICAgICAgICBjb3VudCsrO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgc3RhdGljIHNwbGl0TG9naWNTdHIoczpzdHJpbmcpOiBhbnlbXSB7XG4gICAgICAgIGNvbnN0IG1hdGNoID0gcy5tYXRjaCgvXiguKz8pXFxzKyguKz8pXFxzKyguKikvKTtcbiAgICAgICAgcmV0dXJuIG1hdGNoPy5zbGljZSgxKTtcbiAgICB9XG59XG5cbi8vIGN1c3RvbSB2ZXJzaW9uIG9mIHRoZSBTZXQgY2xhc3Ncbi8vIG5lZWRlZCBzaW5jZSBzeW1weSByZWxpZXMgb24gaXRlbSB0dXBsZXMgd2l0aCBlcXVhbCBjb250ZW50cyBiZWluZyBtYXBwZWRcbi8vIHRvIHRoZSBzYW1lIGVudHJ5XG5jbGFzcyBIYXNoU2V0IHtcbiAgICBkaWN0OiBSZWNvcmQ8c3RyaW5nLCBhbnk+O1xuICAgIHNpemU6IG51bWJlcjtcbiAgICBzb3J0ZWRBcnI6IGFueVtdO1xuXG4gICAgY29uc3RydWN0b3IoYXJyPzogYW55W10pIHtcbiAgICAgICAgdGhpcy5zaXplID0gMDtcbiAgICAgICAgdGhpcy5kaWN0ID0ge307XG4gICAgICAgIGlmIChhcnIpIHtcbiAgICAgICAgICAgIEFycmF5LmZyb20oYXJyKS5mb3JFYWNoKChlbGVtZW50KSA9PiB7XG4gICAgICAgICAgICAgICAgdGhpcy5hZGQoZWxlbWVudCk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGNsb25lKCk6IEhhc2hTZXQge1xuICAgICAgICBjb25zdCBuZXdzZXQ6IEhhc2hTZXQgPSBuZXcgSGFzaFNldCgpO1xuICAgICAgICBmb3IgKGNvbnN0IGl0ZW0gb2YgT2JqZWN0LnZhbHVlcyh0aGlzLmRpY3QpKSB7XG4gICAgICAgICAgICBuZXdzZXQuYWRkKGl0ZW0pO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBuZXdzZXQ7XG4gICAgfVxuXG4gICAgZW5jb2RlKGl0ZW06IGFueSk6IHN0cmluZyB7XG4gICAgICAgIHJldHVybiBVdGlsLmhhc2hLZXkoaXRlbSk7XG4gICAgfVxuXG4gICAgYWRkKGl0ZW06IGFueSkge1xuICAgICAgICBjb25zdCBrZXkgPSB0aGlzLmVuY29kZShpdGVtKTtcbiAgICAgICAgaWYgKCEoa2V5IGluIHRoaXMuZGljdCkpIHtcbiAgICAgICAgICAgIHRoaXMuc2l6ZSsrO1xuICAgICAgICB9O1xuICAgICAgICB0aGlzLmRpY3Rba2V5XSA9IGl0ZW07XG4gICAgfVxuXG4gICAgYWRkQXJyKGFycjogYW55W10pIHtcbiAgICAgICAgZm9yIChjb25zdCBlIG9mIGFycikge1xuICAgICAgICAgICAgdGhpcy5hZGQoZSk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBoYXMoaXRlbTogYW55KSB7XG4gICAgICAgIHJldHVybiB0aGlzLmVuY29kZShpdGVtKSBpbiB0aGlzLmRpY3Q7XG4gICAgfVxuXG4gICAgdG9BcnJheSgpIHtcbiAgICAgICAgcmV0dXJuIE9iamVjdC52YWx1ZXModGhpcy5kaWN0KTtcbiAgICB9XG5cbiAgICAvLyBnZXQgdGhlIGhhc2hrZXkgZm9yIHRoaXMgc2V0IChlLmcuLCBpbiBhIGRpY3Rpb25hcnkpXG4gICAgaGFzaEtleSgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMudG9BcnJheSgpXG4gICAgICAgICAgICAubWFwKChlKSA9PiBVdGlsLmhhc2hLZXkoZSkpXG4gICAgICAgICAgICAuc29ydCgpXG4gICAgICAgICAgICAuam9pbihcIixcIik7XG4gICAgfVxuXG4gICAgaXNFbXB0eSgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuc2l6ZSA9PT0gMDtcbiAgICB9XG5cbiAgICByZW1vdmUoaXRlbTogYW55KSB7XG4gICAgICAgIHRoaXMuc2l6ZS0tO1xuICAgICAgICBkZWxldGUgdGhpcy5kaWN0W3RoaXMuZW5jb2RlKGl0ZW0pXTtcbiAgICB9XG5cbiAgICBnZXQoa2V5OiBhbnkpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuZGljdFtVdGlsLmhhc2hLZXkoa2V5KV07XG4gICAgfVxuXG4gICAgc2V0KGtleTogYW55LCB2YWw6IGFueSkge1xuICAgICAgICB0aGlzLmRpY3RbVXRpbC5oYXNoS2V5KGtleSldID0gdmFsO1xuICAgIH1cblxuICAgIHNvcnQoa2V5ZnVuYzogYW55ID0gKChhOiBhbnksIGI6IGFueSkgPT4gYSAtIGIpLCByZXZlcnNlOiBib29sZWFuID0gdHJ1ZSkge1xuICAgICAgICB0aGlzLnNvcnRlZEFyciA9IHRoaXMudG9BcnJheSgpO1xuICAgICAgICB0aGlzLnNvcnRlZEFyci5zb3J0KGtleWZ1bmMpO1xuICAgICAgICBpZiAocmV2ZXJzZSkge1xuICAgICAgICAgICAgdGhpcy5zb3J0ZWRBcnIucmV2ZXJzZSgpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcG9wKCkge1xuICAgICAgICB0aGlzLnNvcnQoKTsgLy8gISEhIHNsb3cgYnV0IEkgZG9uJ3Qgc2VlIGEgd29yayBhcm91bmRcbiAgICAgICAgaWYgKHRoaXMuc29ydGVkQXJyLmxlbmd0aCA+PSAxKSB7XG4gICAgICAgICAgICBjb25zdCB0ZW1wID0gdGhpcy5zb3J0ZWRBcnJbdGhpcy5zb3J0ZWRBcnIubGVuZ3RoIC0gMV07XG4gICAgICAgICAgICB0aGlzLnJlbW92ZSh0ZW1wKTtcbiAgICAgICAgICAgIHJldHVybiB0ZW1wO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGRpZmZlcmVuY2Uob3RoZXI6IEhhc2hTZXQpIHtcbiAgICAgICAgY29uc3QgcmVzID0gbmV3IEhhc2hTZXQoKTtcbiAgICAgICAgZm9yIChjb25zdCBpIG9mIHRoaXMudG9BcnJheSgpKSB7XG4gICAgICAgICAgICBpZiAoIShvdGhlci5oYXMoaSkpKSB7XG4gICAgICAgICAgICAgICAgcmVzLmFkZChpKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gcmVzO1xuICAgIH1cblxuICAgIGludGVyc2VjdHMob3RoZXI6IEhhc2hTZXQpIHtcbiAgICAgICAgZm9yIChjb25zdCBpIG9mIHRoaXMudG9BcnJheSgpKSB7XG4gICAgICAgICAgICBpZiAob3RoZXIuaGFzKGkpKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbn1cblxuLy8gYSBoYXNoZGljdCBjbGFzcyByZXBsYWNpbmcgdGhlIGRpY3QgY2xhc3MgaW4gcHl0aG9uXG5jbGFzcyBIYXNoRGljdCB7XG4gICAgc2l6ZTogbnVtYmVyO1xuICAgIGRpY3Q6IFJlY29yZDxhbnksIGFueT47XG5cbiAgICBjb25zdHJ1Y3RvcihkOiBSZWNvcmQ8YW55LCBhbnk+ID0ge30pIHtcbiAgICAgICAgdGhpcy5zaXplID0gMDtcbiAgICAgICAgdGhpcy5kaWN0ID0ge307XG4gICAgICAgIGZvciAoY29uc3QgaXRlbSBvZiBPYmplY3QuZW50cmllcyhkKSkge1xuICAgICAgICAgICAgdGhpcy5kaWN0W1V0aWwuaGFzaEtleShpdGVtWzBdKV0gPSBbaXRlbVswXSwgaXRlbVsxXV07XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBjbG9uZSgpIHtcbiAgICAgICAgcmV0dXJuIG5ldyBIYXNoRGljdCh0aGlzLmRpY3QpO1xuICAgIH1cblxuICAgIHJlbW92ZShpdGVtOiBhbnkpIHtcbiAgICAgICAgdGhpcy5zaXplLS07XG4gICAgICAgIGRlbGV0ZSB0aGlzLmRpY3RbVXRpbC5oYXNoS2V5KGl0ZW0pXTtcbiAgICB9XG5cbiAgICBzZXRkZWZhdWx0KGtleTogYW55LCB2YWx1ZTogYW55KSB7XG4gICAgICAgIGlmICh0aGlzLmhhcyhrZXkpKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5nZXQoa2V5KTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMuYWRkKGtleSwgdmFsdWUpO1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuZ2V0KGtleSk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBnZXQoa2V5OiBhbnksIGRlZjogYW55ID0gdW5kZWZpbmVkKTogYW55IHtcbiAgICAgICAgY29uc3QgaGFzaCA9IFV0aWwuaGFzaEtleShrZXkpO1xuICAgICAgICBpZiAoaGFzaCBpbiB0aGlzLmRpY3QpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmRpY3RbaGFzaF1bMV07XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGRlZjtcbiAgICB9XG5cbiAgICBoYXMoa2V5OiBhbnkpOiBib29sZWFuIHtcbiAgICAgICAgY29uc3QgaGFzaEtleSA9IFV0aWwuaGFzaEtleShrZXkpO1xuICAgICAgICByZXR1cm4gaGFzaEtleSBpbiB0aGlzLmRpY3Q7XG4gICAgfVxuXG4gICAgYWRkKGtleTogYW55LCB2YWx1ZTogYW55KSB7XG4gICAgICAgIGNvbnN0IGtleUhhc2ggPSBVdGlsLmhhc2hLZXkoa2V5KTtcbiAgICAgICAgaWYgKCEoa2V5SGFzaCBpbiBPYmplY3Qua2V5cyh0aGlzLmRpY3QpKSkge1xuICAgICAgICAgICAgdGhpcy5zaXplKys7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5kaWN0W2tleUhhc2hdID0gW2tleSwgdmFsdWVdO1xuICAgIH1cblxuICAgIGtleXMoKSB7XG4gICAgICAgIGNvbnN0IHZhbHMgPSBPYmplY3QudmFsdWVzKHRoaXMuZGljdCk7XG4gICAgICAgIHJldHVybiB2YWxzLm1hcCgoZSkgPT4gZVswXSk7XG4gICAgfVxuXG4gICAgdmFsdWVzKCkge1xuICAgICAgICBjb25zdCB2YWxzID0gT2JqZWN0LnZhbHVlcyh0aGlzLmRpY3QpO1xuICAgICAgICByZXR1cm4gdmFscy5tYXAoKGUpID0+IGVbMV0pO1xuICAgIH1cblxuICAgIGVudHJpZXMoKSB7XG4gICAgICAgIHJldHVybiBPYmplY3QudmFsdWVzKHRoaXMuZGljdCk7XG4gICAgfVxuXG4gICAgYWRkQXJyKGFycjogYW55W10pIHtcbiAgICAgICAgY29uc3Qga2V5SGFzaCA9IFV0aWwuaGFzaEtleShhcnJbMF0pO1xuICAgICAgICB0aGlzLmRpY3Rba2V5SGFzaF0gPSBhcnI7XG4gICAgfVxuXG4gICAgZGVsZXRlKGtleTogYW55KSB7XG4gICAgICAgIGNvbnN0IGtleWhhc2ggPSBVdGlsLmhhc2hLZXkoa2V5KTtcbiAgICAgICAgaWYgKGtleWhhc2ggaW4gdGhpcy5kaWN0KSB7XG4gICAgICAgICAgICB0aGlzLnNpemUtLTtcbiAgICAgICAgICAgIGRlbGV0ZSB0aGlzLmRpY3Rba2V5aGFzaF07XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBtZXJnZShvdGhlcjogSGFzaERpY3QpIHtcbiAgICAgICAgZm9yIChjb25zdCBpdGVtIG9mIG90aGVyLmVudHJpZXMoKSkge1xuICAgICAgICAgICAgdGhpcy5hZGQoaXRlbVswXSwgaXRlbVsxXSk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBjb3B5KCkge1xuICAgICAgICBjb25zdCByZXM6IEhhc2hEaWN0ID0gbmV3IEhhc2hEaWN0KCk7XG4gICAgICAgIGZvciAoY29uc3QgaXRlbSBvZiB0aGlzLmVudHJpZXMoKSkge1xuICAgICAgICAgICAgcmVzLmFkZChpdGVtWzBdLCBpdGVtWzFdKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gcmVzO1xuICAgIH1cblxuICAgIGlzU2FtZShvdGhlcjogSGFzaERpY3QpIHtcbiAgICAgICAgY29uc3QgYXJyMSA9IHRoaXMuZW50cmllcygpLnNvcnQoKTtcbiAgICAgICAgY29uc3QgYXJyMiA9IG90aGVyLmVudHJpZXMoKS5zb3J0KCk7XG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgYXJyMS5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgaWYgKCEoVXRpbC5hcnJFcShhcnIxW2ldLCBhcnIyW2ldKSkpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuXG4gICAgZmFjdG9yc1RvU3RyaW5nKCkge1xuICAgICAgICBsZXQgbnVtZXJhdG9yID0gXCJcIjtcbiAgICAgICAgbGV0IGRlbm9taW5hdG9yID0gXCJcIjtcbiAgICAgICAgZm9yIChjb25zdCBbZmFjdG9yLCBleHBdIG9mIHRoaXMuZW50cmllcygpKSB7XG4gICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IE1hdGguYWJzKGV4cCk7IGkrKykge1xuICAgICAgICAgICAgICAgIGlmIChleHAgPCAwKSB7XG4gICAgICAgICAgICAgICAgICAgIGRlbm9taW5hdG9yICs9IChmYWN0b3IudG9TdHJpbmcoKSArIFwiKlwiKVxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIG51bWVyYXRvciArPSAoZmFjdG9yLnRvU3RyaW5nKCkgKyBcIipcIilcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGRlbm9taW5hdG9yLmxlbmd0aCA9PSAwKSB7XG4gICAgICAgICAgICByZXR1cm4gbnVtZXJhdG9yLnNsaWNlKDAsIC0xKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiBudW1lcmF0b3Iuc2xpY2UoMCwgLTEpICsgXCIvXCIgKyBkZW5vbWluYXRvci5zbGljZSgwLCAtMSk7XG4gICAgICAgIH1cbiAgICB9XG59XG5cblxuLy8gc3ltcHkgb2Z0ZW4gdXNlcyBkZWZhdWx0ZGljdChzZXQpIHdoaWNoIGlzIG5vdCBhdmFpbGFibGUgaW4gdHNcbi8vIHdlIGNyZWF0ZSBhIHJlcGxhY2VtZW50IGRpY3Rpb25hcnkgY2xhc3Mgd2hpY2ggcmV0dXJucyBhbiBlbXB0eSBzZXRcbi8vIGlmIHRoZSBrZXkgdXNlZCBpcyBub3QgaW4gdGhlIGRpY3Rpb25hcnlcbmNsYXNzIFNldERlZmF1bHREaWN0IGV4dGVuZHMgSGFzaERpY3Qge1xuICAgIGNvbnN0cnVjdG9yKCkge1xuICAgICAgICBzdXBlcigpO1xuICAgIH1cblxuICAgIGdldChrZXk6IGFueSkge1xuICAgICAgICBjb25zdCBrZXlIYXNoID0gVXRpbC5oYXNoS2V5KGtleSk7XG4gICAgICAgIGlmIChrZXlIYXNoIGluIHRoaXMuZGljdCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuZGljdFtrZXlIYXNoXVsxXTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gbmV3IEhhc2hTZXQoKTtcbiAgICB9XG59XG5cbmNsYXNzIEludERlZmF1bHREaWN0IGV4dGVuZHMgSGFzaERpY3Qge1xuICAgIGNvbnN0cnVjdG9yKCkge1xuICAgICAgICBzdXBlcigpO1xuICAgIH1cblxuICAgIGluY3JlbWVudChrZXk6IGFueSwgdmFsOiBhbnkpIHtcbiAgICAgICAgY29uc3Qga2V5SGFzaCA9IFV0aWwuaGFzaEtleShrZXkpO1xuICAgICAgICBpZiAoa2V5SGFzaCBpbiB0aGlzLmRpY3QpIHtcbiAgICAgICAgICAgIHRoaXMuZGljdFtrZXlIYXNoXSArPSB2YWw7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aGlzLmRpY3Rba2V5SGFzaF0gPSAwO1xuICAgICAgICAgICAgdGhpcy5kaWN0W2tleUhhc2hdICs9IHZhbDtcbiAgICAgICAgfVxuICAgIH1cbn1cblxuY2xhc3MgQXJyRGVmYXVsdERpY3QgZXh0ZW5kcyBIYXNoRGljdCB7XG4gICAgY29uc3RydWN0b3IoKSB7XG4gICAgICAgIHN1cGVyKCk7XG4gICAgfVxuXG4gICAgZ2V0KGtleTogYW55KSB7XG4gICAgICAgIGNvbnN0IGtleUhhc2ggPSBVdGlsLmhhc2hLZXkoa2V5KTtcbiAgICAgICAgaWYgKGtleUhhc2ggaW4gdGhpcy5kaWN0KSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5kaWN0W2tleUhhc2hdWzFdO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBbXTtcbiAgICB9XG59XG5cblxuLy8gYW4gaW1wbGljYXRpb24gY2xhc3MgdXNlZCBhcyBhbiBhbHRlcm5hdGl2ZSB0byB0dXBsZXMgaW4gc3ltcHlcbmNsYXNzIEltcGxpY2F0aW9uIHtcbiAgICBwO1xuICAgIHE7XG5cbiAgICBjb25zdHJ1Y3RvcihwOiBhbnksIHE6IGFueSkge1xuICAgICAgICB0aGlzLnAgPSBwO1xuICAgICAgICB0aGlzLnEgPSBxO1xuICAgIH1cblxuICAgIGhhc2hLZXkoKSB7XG4gICAgICAgIHJldHVybiAodGhpcy5wIGFzIHN0cmluZykgKyAodGhpcy5xIGFzIHN0cmluZyk7XG4gICAgfVxufVxuXG5cbi8vIGFuIExSVSBjYWNoZSBpbXBsZW1lbnRhdGlvbiB1c2VkIGZvciBjYWNoZS50c1xuXG5pbnRlcmZhY2UgTm9kZSB7XG4gICAga2V5OiBhbnk7XG4gICAgdmFsdWU6IGFueTtcbiAgICBwcmV2OiBhbnk7XG4gICAgbmV4dDogYW55O1xufVxuXG5jbGFzcyBMUlVDYWNoZSB7XG4gICAgY2FwYWNpdHk6IG51bWJlcjtcbiAgICBtYXA6IEhhc2hEaWN0O1xuICAgIGhlYWQ6IGFueTtcbiAgICB0YWlsOiBhbnk7XG5cbiAgICBjb25zdHJ1Y3RvcihjYXBhY2l0eTogbnVtYmVyKSB7XG4gICAgICAgIHRoaXMuY2FwYWNpdHkgPSBjYXBhY2l0eTtcbiAgICAgICAgdGhpcy5tYXAgPSBuZXcgSGFzaERpY3QoKTtcblxuICAgICAgICAvLyB0aGVzZSBhcmUgYm91bmRhcmllcyBmb3IgdGhlIGRvdWJsZSBsaW5rZWQgbGlzdFxuICAgICAgICB0aGlzLmhlYWQgPSB7fTtcbiAgICAgICAgdGhpcy50YWlsID0ge307XG5cbiAgICAgICAgdGhpcy5oZWFkLm5leHQgPSB0aGlzLmhlYWQ7XG4gICAgICAgIHRoaXMudGFpbC5wcmV2ID0gdGhpcy5oZWFkO1xuICAgIH1cblxuICAgIGdldChrZXk6IGFueSkge1xuICAgICAgICBpZiAodGhpcy5tYXAuaGFzKGtleSkpIHtcbiAgICAgICAgICAgIC8vIHJlbW92ZSBlbGVtZW50IGZyb20gdGhlIGN1cnJlbnQgcG9zaXRpb25cbiAgICAgICAgICAgIGNvbnN0IGMgPSB0aGlzLm1hcC5nZXQoa2V5KTtcbiAgICAgICAgICAgIGMucHJldi5uZXh0ID0gYy5uZXh0O1xuICAgICAgICAgICAgYy5uZXh0LnByZXYgPSBjLnByZXY7XG5cbiAgICAgICAgICAgIHRoaXMudGFpbC5wcmV2Lm5leHQgPSBjOyAvLyBpbnNlcnQgYWZ0ZXIgbGFzdCBlbGVtZW50XG4gICAgICAgICAgICBjLnByZXYgPSB0aGlzLnRhaWwucHJldjtcbiAgICAgICAgICAgIGMubmV4dCA9IHRoaXMudGFpbDtcbiAgICAgICAgICAgIHRoaXMudGFpbC5wcmV2ID0gYztcblxuICAgICAgICAgICAgcmV0dXJuIGMudmFsdWU7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gdW5kZWZpbmVkOyAvLyBpbnZhbGlkIGtleVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgcHV0KGtleTogYW55LCB2YWx1ZTogYW55KSB7XG4gICAgICAgIGlmICh0eXBlb2YgdGhpcy5nZXQoa2V5KSAhPT0gXCJ1bmRlZmluZWRcIikgeyAvLyB0aGUga2V5IGlzIGludmFsaWRcbiAgICAgICAgICAgIHRoaXMudGFpbC5wcmV2LnZhbHVlID0gdmFsdWU7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAvLyBjaGVjayBmb3IgY2FwYWNpdHlcbiAgICAgICAgICAgIGlmICh0aGlzLm1hcC5zaXplID09PSB0aGlzLmNhcGFjaXR5KSB7XG4gICAgICAgICAgICAgICAgdGhpcy5tYXAuZGVsZXRlKHRoaXMuaGVhZC5uZXh0LmtleSk7IC8vIGRlbGV0ZSBmaXJzdCBlbGVtZW50XG4gICAgICAgICAgICAgICAgdGhpcy5oZWFkLm5leHQgPSB0aGlzLmhlYWQubmV4dC5uZXh0OyAvLyByZXBsYWNlIHdpdGggbmV4dFxuICAgICAgICAgICAgICAgIHRoaXMuaGVhZC5uZXh0LnByZXYgPSB0aGlzLmhlYWQ7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgY29uc3QgbmV3Tm9kZTogTm9kZSA9IHtcbiAgICAgICAgICAgIHZhbHVlLFxuICAgICAgICAgICAga2V5LFxuICAgICAgICAgICAgcHJldjogbnVsbCxcbiAgICAgICAgICAgIG5leHQ6IG51bGwsXG4gICAgICAgIH07IC8vIGVhY2ggbm9kZSBpcyBhIGhhc2ggZW50cnlcblxuICAgICAgICAvLyB3aGVuIGFkZGluZyBhIG5ldyBub2RlLCB3ZSBuZWVkIHRvIHVwZGF0ZSBib3RoIG1hcCBhbmQgRExMXG4gICAgICAgIHRoaXMubWFwLmFkZChrZXksIG5ld05vZGUpOyAvLyBhZGQgdGhlIGN1cnJlbnQgbm9kZVxuICAgICAgICB0aGlzLnRhaWwucHJldi5uZXh0ID0gbmV3Tm9kZTsgLy8gYWRkIG5vZGUgdG8gdGhlIGVuZFxuICAgICAgICBuZXdOb2RlLnByZXYgPSB0aGlzLnRhaWwucHJldjtcbiAgICAgICAgbmV3Tm9kZS5uZXh0ID0gdGhpcy50YWlsO1xuICAgICAgICB0aGlzLnRhaWwucHJldiA9IG5ld05vZGU7XG4gICAgfVxufVxuXG5jbGFzcyBJdGVyYXRvciB7XG4gICAgYXJyOiBhbnlbXTtcbiAgICBjb3VudGVyO1xuXG4gICAgY29uc3RydWN0b3IoYXJyOiBhbnlbXSkge1xuICAgICAgICB0aGlzLmFyciA9IGFycjtcbiAgICAgICAgdGhpcy5jb3VudGVyID0gMDtcbiAgICB9XG5cbiAgICBuZXh0KCkge1xuICAgICAgICBpZiAodGhpcy5jb3VudGVyID49IHRoaXMuYXJyLmxlbmd0aCkge1xuICAgICAgICAgICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLmNvdW50ZXIrKztcbiAgICAgICAgcmV0dXJuIHRoaXMuYXJyW3RoaXMuY291bnRlci0xXTtcbiAgICB9XG59XG5cbi8vIG1peGluIGNsYXNzIHVzZWQgdG8gcmVwbGljYXRlIG11bHRpcGxlIGluaGVyaXRhbmNlXG5cbmNsYXNzIE1peGluQnVpbGRlciB7XG4gICAgc3VwZXJjbGFzcztcbiAgICBjb25zdHJ1Y3RvcihzdXBlcmNsYXNzOiBhbnkpIHtcbiAgICAgICAgdGhpcy5zdXBlcmNsYXNzID0gc3VwZXJjbGFzcztcbiAgICB9XG4gICAgd2l0aCguLi5taXhpbnM6IGFueVtdKSB7XG4gICAgICAgIHJldHVybiBtaXhpbnMucmVkdWNlKChjLCBtaXhpbikgPT4gbWl4aW4oYyksIHRoaXMuc3VwZXJjbGFzcyk7XG4gICAgfVxufVxuXG5jbGFzcyBiYXNlIHt9XG5cbmNvbnN0IG1peCA9IChzdXBlcmNsYXNzOiBhbnkpID0+IG5ldyBNaXhpbkJ1aWxkZXIoc3VwZXJjbGFzcyk7XG5cblxuZXhwb3J0IHtVdGlsLCBIYXNoU2V0LCBTZXREZWZhdWx0RGljdCwgSGFzaERpY3QsIEltcGxpY2F0aW9uLCBMUlVDYWNoZSwgSXRlcmF0b3IsIEludERlZmF1bHREaWN0LCBBcnJEZWZhdWx0RGljdCwgbWl4LCBiYXNlfTtcblxuIiwgIi8qIGVzbGludC1kaXNhYmxlIG5ldy1jYXAgKi9cbi8qIGVzbGludC1kaXNhYmxlIG5vLXVudXNlZC12YXJzICovXG4vKlxuXG5Ob3RhYmxlIGNobmFnZXMgbWFkZSAoV0IgJiBHTSk6XG4tIFVuZGVmaW5lZCBpcyBiZWluZyB1c2VkIGFzIGEgdGhpcmQgYm9vbGVhbiB2YWx1ZSBpbnN0ZWFkIG9mICdub25lJ1xuLSBBcnJheXMgYXJlIGJlaW5nIHVzZWQgaW5zdGVhZCBvZiB0dXBsZXNcbi0gVGhlIG1ldGhvZHMgaGFzaEtleSgpIGFuZCB0b1N0cmluZygpIGFyZSBhZGRlZCB0byBMb2dpYyBmb3IgaGFzaGluZy4gVGhlXG4gIHN0YXRpYyBtZXRob2QgaGFzaEtleSgpIGlzIGFsc28gYWRkZWQgdG8gTG9naWMgYW5kIGhhc2hlcyBkZXBlbmRpbmcgb24gdGhlIGlucHV0LlxuLSBBIGNvbnN0cnVjdG9yIGlzIGFkZGVkIHRvIHRoZSBsb2dpYyBjbGFzcywgd2hpY2ggaXMgdXNlZCBieSBMb2dpYyBhbmQgaXRzXG4gIHN1YmNsYXNzZXMgKEFuZE9yX0Jhc2UsIEFuZCwgT3IsIE5vdClcbi0gSW4gdGhlIGZsYXR0ZW4gbWV0aG9kIG9mIEFuZE9yX0Jhc2Ugd2UgcmVtb3ZlZCB0aGUgdHJ5IGNhdGNoIGFuZCBjaGFuZ2VkIHRoZVxuICB3aGlsZSBsb29wIHRvIGRlcGVuZCBvbiB0aGUgbGVnbnRoIG9mIHRoZSBhcmdzIGFycmF5XG4tIEFkZGVkIGV4cGFuZCgpIGFuZCBldmFsX3Byb3BhZ2F0ZV9ub3QgYXMgYWJzdHJhY3QgbWV0aG9kcyB0byB0aGUgTG9naWMgY2xhc3Ncbi0gQWRkZWQgc3RhdGljIE5ldyBtZXRob2RzIHRvIE5vdCwgQW5kLCBhbmQgT3Igd2hpY2ggZnVuY3Rpb24gYXMgY29uc3RydWN0b3JzXG4qL1xuXG5pbXBvcnQge1V0aWwsIEhhc2hTZXR9IGZyb20gXCIuL3V0aWxpdHlcIjtcblxuXG5mdW5jdGlvbiBfdG9yZihhcmdzOiBhbnlbXSk6IGJvb2xlYW4gfCB1bmRlZmluZWQge1xuICAgIC8qIFJldHVybiBUcnVlIGlmIGFsbCBhcmdzIGFyZSBUcnVlLCBGYWxzZSBpZiB0aGV5XG4gICAgYXJlIGFsbCBGYWxzZSwgZWxzZSBOb25lXG4gICAgPj4+IGZyb20gc3ltcHkuY29yZS5sb2dpYyBpbXBvcnQgX3RvcmZcbiAgICA+Pj4gX3RvcmYoKFRydWUsIFRydWUpKVxuICAgIFRydWVcbiAgICA+Pj4gX3RvcmYoKEZhbHNlLCBGYWxzZSkpXG4gICAgRmFsc2VcbiAgICA+Pj4gX3RvcmYoKFRydWUsIEZhbHNlKSlcbiAgICAqL1xuICAgIGxldCBzYXdUID0gZmFsc2U7XG4gICAgbGV0IHNhd0YgPSBmYWxzZTtcbiAgICBmb3IgKGNvbnN0IGEgb2YgYXJncykge1xuICAgICAgICBpZiAoYSkge1xuICAgICAgICAgICAgaWYgKHNhd0YpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdW5kZWZpbmVkO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgc2F3VCA9IHRydWU7XG4gICAgICAgIH0gZWxzZSBpZiAoIWEpIHtcbiAgICAgICAgICAgIGlmIChzYXdUKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHNhd0YgPSB0cnVlO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gc2F3VDtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIF9mdXp6eV9ncm91cChhcmdzOiBhbnlbXSwgcXVpY2tfZXhpdCA9IGZhbHNlKTogYm9vbGVhbiB8IHVuZGVmaW5lZCB7XG4gICAgLyogUmV0dXJuIFRydWUgaWYgYWxsIGFyZ3MgYXJlIFRydWUsIE5vbmUgaWYgdGhlcmUgaXMgYW55IE5vbmUgZWxzZSBGYWxzZVxuICAgIHVubGVzcyBgYHF1aWNrX2V4aXRgYCBpcyBUcnVlICh0aGVuIHJldHVybiBOb25lIGFzIHNvb24gYXMgYSBzZWNvbmQgRmFsc2VcbiAgICBpcyBzZWVuLlxuICAgICBgYF9mdXp6eV9ncm91cGBgIGlzIGxpa2UgYGBmdXp6eV9hbmRgYCBleGNlcHQgdGhhdCBpdCBpcyBtb3JlXG4gICAgY29uc2VydmF0aXZlIGluIHJldHVybmluZyBhIEZhbHNlLCB3YWl0aW5nIHRvIG1ha2Ugc3VyZSB0aGF0IGFsbFxuICAgIGFyZ3VtZW50cyBhcmUgVHJ1ZSBvciBGYWxzZSBhbmQgcmV0dXJuaW5nIE5vbmUgaWYgYW55IGFyZ3VtZW50cyBhcmVcbiAgICBOb25lLiBJdCBhbHNvIGhhcyB0aGUgY2FwYWJpbGl0eSBvZiBwZXJtaXRpbmcgb25seSBhIHNpbmdsZSBGYWxzZSBhbmRcbiAgICByZXR1cm5pbmcgTm9uZSBpZiBtb3JlIHRoYW4gb25lIGlzIHNlZW4uIEZvciBleGFtcGxlLCB0aGUgcHJlc2VuY2Ugb2YgYVxuICAgIHNpbmdsZSB0cmFuc2NlbmRlbnRhbCBhbW9uZ3N0IHJhdGlvbmFscyB3b3VsZCBpbmRpY2F0ZSB0aGF0IHRoZSBncm91cCBpc1xuICAgIG5vIGxvbmdlciByYXRpb25hbDsgYnV0IGEgc2Vjb25kIHRyYW5zY2VuZGVudGFsIGluIHRoZSBncm91cCB3b3VsZCBtYWtlIHRoZVxuICAgIGRldGVybWluYXRpb24gaW1wb3NzaWJsZS5cbiAgICBFeGFtcGxlc1xuICAgID09PT09PT09XG4gICAgPj4+IGZyb20gc3ltcHkuY29yZS5sb2dpYyBpbXBvcnQgX2Z1enp5X2dyb3VwXG4gICAgQnkgZGVmYXVsdCwgbXVsdGlwbGUgRmFsc2VzIG1lYW4gdGhlIGdyb3VwIGlzIGJyb2tlbjpcbiAgICA+Pj4gX2Z1enp5X2dyb3VwKFtGYWxzZSwgRmFsc2UsIFRydWVdKVxuICAgIEZhbHNlXG4gICAgSWYgbXVsdGlwbGUgRmFsc2VzIG1lYW4gdGhlIGdyb3VwIHN0YXR1cyBpcyB1bmtub3duIHRoZW4gc2V0XG4gICAgYHF1aWNrX2V4aXRgIHRvIFRydWUgc28gTm9uZSBjYW4gYmUgcmV0dXJuZWQgd2hlbiB0aGUgMm5kIEZhbHNlIGlzIHNlZW46XG4gICAgPj4+IF9mdXp6eV9ncm91cChbRmFsc2UsIEZhbHNlLCBUcnVlXSwgcXVpY2tfZXhpdD1UcnVlKVxuICAgIEJ1dCBpZiBvbmx5IGEgc2luZ2xlIEZhbHNlIGlzIHNlZW4gdGhlbiB0aGUgZ3JvdXAgaXMga25vd24gdG9cbiAgICBiZSBicm9rZW46XG4gICAgPj4+IF9mdXp6eV9ncm91cChbRmFsc2UsIFRydWUsIFRydWVdLCBxdWlja19leGl0PVRydWUpXG4gICAgRmFsc2VcbiAgICAqL1xuICAgIGxldCBzYXdfb3RoZXIgPSBmYWxzZTtcbiAgICBmb3IgKGNvbnN0IGEgb2YgYXJncykge1xuICAgICAgICBpZiAoYSkge1xuICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgIH0gaWYgKHR5cGVvZiBhID09PSBcInVuZGVmaW5lZFwiKSB7XG4gICAgICAgICAgICByZXR1cm4gdW5kZWZpbmVkO1xuICAgICAgICB9IGlmIChxdWlja19leGl0ICYmIHNhd19vdGhlcikge1xuICAgICAgICAgICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgICAgICAgfVxuICAgICAgICBzYXdfb3RoZXIgPSB0cnVlO1xuICAgIH1cbiAgICBpZiAoc2F3X290aGVyKSB7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gICAgcmV0dXJuIHRydWU7XG59XG5cbmZ1bmN0aW9uIGZ1enp5X2Jvb2woeDogTG9naWMpOiBib29sZWFuIHwgdW5kZWZpbmVkIHtcbiAgICAvKiBSZXR1cm4gVHJ1ZSwgRmFsc2Ugb3IgTm9uZSBhY2NvcmRpbmcgdG8geC5cbiAgICBXaGVyZWFzIGJvb2woeCkgcmV0dXJucyBUcnVlIG9yIEZhbHNlLCBmdXp6eV9ib29sIGFsbG93c1xuICAgIGZvciB0aGUgTm9uZSB2YWx1ZSBhbmQgbm9uIC0gZmFsc2UgdmFsdWVzKHdoaWNoIGJlY29tZSBOb25lKSwgdG9vLlxuICAgIEV4YW1wbGVzXG4gICAgPT09PT09PT1cbiAgICA+Pj4gZnJvbSBzeW1weS5jb3JlLmxvZ2ljIGltcG9ydCBmdXp6eV9ib29sXG4gICAgPj4+IGZyb20gc3ltcHkuYWJjIGltcG9ydCB4XG4gICAgPj4+IGZ1enp5X2Jvb2woeCksIGZ1enp5X2Jvb2woTm9uZSlcbiAgICAoTm9uZSwgTm9uZSlcbiAgICA+Pj4gYm9vbCh4KSwgYm9vbChOb25lKVxuICAgICAgICAoVHJ1ZSwgRmFsc2UpXG4gICAgKi9cbiAgICBpZiAodHlwZW9mIHggPT09IFwidW5kZWZpbmVkXCIpIHtcbiAgICAgICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgICB9XG4gICAgaWYgKHgpIHtcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuICAgIGlmICgheCkge1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxufVxuXG5mdW5jdGlvbiBmdXp6eV9hbmQoYXJnczogYW55W10pOiBib29sZWFuIHwgdW5kZWZpbmVkIHtcbiAgICAvKiBSZXR1cm4gVHJ1ZSAoYWxsIFRydWUpLCBGYWxzZSAoYW55IEZhbHNlKSBvciBOb25lLlxuICAgIEV4YW1wbGVzXG4gICAgPT09PT09PT1cbiAgICA+Pj4gZnJvbSBzeW1weS5jb3JlLmxvZ2ljIGltcG9ydCBmdXp6eV9hbmRcbiAgICA+Pj4gZnJvbSBzeW1weSBpbXBvcnQgRHVtbXlcbiAgICBJZiB5b3UgaGFkIGEgbGlzdCBvZiBvYmplY3RzIHRvIHRlc3QgdGhlIGNvbW11dGl2aXR5IG9mXG4gICAgYW5kIHlvdSB3YW50IHRoZSBmdXp6eV9hbmQgbG9naWMgYXBwbGllZCwgcGFzc2luZyBhblxuICAgIGl0ZXJhdG9yIHdpbGwgYWxsb3cgdGhlIGNvbW11dGF0aXZpdHkgdG8gb25seSBiZSBjb21wdXRlZFxuICAgIGFzIG1hbnkgdGltZXMgYXMgbmVjZXNzYXJ5LldpdGggdGhpcyBsaXN0LCBGYWxzZSBjYW4gYmVcbiAgICByZXR1cm5lZCBhZnRlciBhbmFseXppbmcgdGhlIGZpcnN0IHN5bWJvbDpcbiAgICA+Pj4gc3ltcyA9W0R1bW15KGNvbW11dGF0aXZlID0gRmFsc2UpLCBEdW1teSgpXVxuICAgID4+PiBmdXp6eV9hbmQocy5pc19jb21tdXRhdGl2ZSBmb3IgcyBpbiBzeW1zKVxuICAgIEZhbHNlXG4gICAgVGhhdCBGYWxzZSB3b3VsZCByZXF1aXJlIGxlc3Mgd29yayB0aGFuIGlmIGEgbGlzdCBvZiBwcmUgLSBjb21wdXRlZFxuICAgIGl0ZW1zIHdhcyBzZW50OlxuICAgID4+PiBmdXp6eV9hbmQoW3MuaXNfY29tbXV0YXRpdmUgZm9yIHMgaW4gc3ltc10pXG4gICAgRmFsc2VcbiAgICAqL1xuXG4gICAgbGV0IHJ2ID0gdHJ1ZTtcbiAgICBmb3IgKGxldCBhaSBvZiBhcmdzKSB7XG4gICAgICAgIGFpID0gZnV6enlfYm9vbChhaSk7XG4gICAgICAgIGlmICghYWkpIHtcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfSBpZiAocnYpIHsgLy8gdGhpcyB3aWxsIHN0b3AgdXBkYXRpbmcgaWYgYSBOb25lIGlzIGV2ZXIgdHJhcHBlZFxuICAgICAgICAgICAgcnYgPSBhaTtcbiAgICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gcnY7XG59XG5cbmZ1bmN0aW9uIGZ1enp5X25vdCh2OiBhbnkpOiBib29sZWFuIHwgdW5kZWZpbmVkIHtcbiAgICAvKlxuICAgIE5vdCBpbiBmdXp6eSBsb2dpY1xuICAgICAgICBSZXR1cm4gTm9uZSBpZiBgdmAgaXMgTm9uZSBlbHNlIGBub3QgdmAuXG4gICAgICAgIEV4YW1wbGVzXG4gICAgICAgID09PT09PT09XG4gICAgICAgID4+PiBmcm9tIHN5bXB5LmNvcmUubG9naWMgaW1wb3J0IGZ1enp5X25vdFxuICAgICAgICA+Pj4gZnV6enlfbm90KFRydWUpXG4gICAgRmFsc2VcbiAgICAgICAgPj4+IGZ1enp5X25vdChOb25lKVxuICAgICAgICA+Pj4gZnV6enlfbm90KEZhbHNlKVxuICAgIFRydWVcbiAgICAqL1xuICAgIGlmICh0eXBlb2YgdiA9PT0gXCJ1bmRlZmluZWRcIikge1xuICAgICAgICByZXR1cm4gdjtcbiAgICB9IGVsc2UgaWYgKHYpIHtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgICByZXR1cm4gdHJ1ZTtcbn1cblxuZnVuY3Rpb24gZnV6enlfb3IoYXJnczogYW55W10pOiBib29sZWFuIHwgdW5kZWZpbmVkIHtcbiAgICAvKlxuICAgIE9yIGluIGZ1enp5IGxvZ2ljLlJldHVybnMgVHJ1ZShhbnkgVHJ1ZSksIEZhbHNlKGFsbCBGYWxzZSksIG9yIE5vbmVcbiAgICAgICAgU2VlIHRoZSBkb2NzdHJpbmdzIG9mIGZ1enp5X2FuZCBhbmQgZnV6enlfbm90IGZvciBtb3JlIGluZm8uZnV6enlfb3IgaXNcbiAgICAgICAgcmVsYXRlZCB0byB0aGUgdHdvIGJ5IHRoZSBzdGFuZGFyZCBEZSBNb3JnYW4ncyBsYXcuXG4gICAgICAgID4+PiBmcm9tIHN5bXB5LmNvcmUubG9naWMgaW1wb3J0IGZ1enp5X29yXG4gICAgICAgID4+PiBmdXp6eV9vcihbVHJ1ZSwgRmFsc2VdKVxuICAgIFRydWVcbiAgICAgICAgPj4+IGZ1enp5X29yKFtUcnVlLCBOb25lXSlcbiAgICBUcnVlXG4gICAgICAgID4+PiBmdXp6eV9vcihbRmFsc2UsIEZhbHNlXSlcbiAgICBGYWxzZVxuICAgICAgICA+Pj4gcHJpbnQoZnV6enlfb3IoW0ZhbHNlLCBOb25lXSkpXG4gICAgTm9uZVxuICAgICovXG4gICAgbGV0IHJ2ID0gZmFsc2U7XG5cbiAgICBmb3IgKGxldCBhaSBvZiBhcmdzKSB7XG4gICAgICAgIGFpID0gZnV6enlfYm9vbChhaSk7XG4gICAgICAgIGlmIChhaSkge1xuICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKCFydikgeyAvLyB0aGlzIHdpbGwgc3RvcCB1cGRhdGluZyBpZiBhIE5vbmUgaXMgZXZlciB0cmFwcGVkXG4gICAgICAgICAgICBydiA9IGFpO1xuICAgICAgICB9XG4gICAgfVxuICAgIHJldHVybiBydjtcbn1cblxuZnVuY3Rpb24gZnV6enlfeG9yKGFyZ3M6IGFueVtdKTogYm9vbGVhbiB8IHVuZGVmaW5lZCB7XG4gICAgLyogUmV0dXJuIE5vbmUgaWYgYW55IGVsZW1lbnQgb2YgYXJncyBpcyBub3QgVHJ1ZSBvciBGYWxzZSwgZWxzZVxuICAgIFRydWUoaWYgdGhlcmUgYXJlIGFuIG9kZCBudW1iZXIgb2YgVHJ1ZSBlbGVtZW50cyksIGVsc2UgRmFsc2UuICovXG4gICAgbGV0IHQgPSAwO1xuICAgIGxldCBmID0gMDtcbiAgICBmb3IgKGNvbnN0IGEgb2YgYXJncykge1xuICAgICAgICBjb25zdCBhaSA9IGZ1enp5X2Jvb2woYSk7XG4gICAgICAgIGlmIChhaSkge1xuICAgICAgICAgICAgdCArPSAxO1xuICAgICAgICB9IGVsc2UgaWYgKCFhaSkge1xuICAgICAgICAgICAgZiArPSAxO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgICAgICAgfVxuICAgIH1cbiAgICBpZiAodCAlIDIgPT0gMSkge1xuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG4gICAgcmV0dXJuIGZhbHNlO1xufVxuXG5mdW5jdGlvbiBmdXp6eV9uYW5kKGFyZ3M6IGFueVtdKTogYm9vbGVhbiB8IHVuZGVmaW5lZCB7XG4gICAgLyogUmV0dXJuIEZhbHNlIGlmIGFsbCBhcmdzIGFyZSBUcnVlLCBUcnVlIGlmIHRoZXkgYXJlIGFsbCBGYWxzZSxcbiAgICBlbHNlIE5vbmUuICovXG4gICAgcmV0dXJuIGZ1enp5X25vdChmdXp6eV9hbmQoYXJncykpO1xufVxuXG5cbmNsYXNzIExvZ2ljIHtcbiAgICBzdGF0aWMgVHJ1ZTogTG9naWM7XG4gICAgc3RhdGljIEZhbHNlOiBMb2dpYztcblxuICAgIHN0YXRpYyBvcF8yY2xhc3M6IFJlY29yZDxzdHJpbmcsICguLi5hcmdzOiBhbnlbXSkgPT4gTG9naWM+ID0ge1xuICAgICAgICBcIiZcIjogKC4uLmFyZ3MpID0+IHtcbiAgICAgICAgICAgIHJldHVybiBBbmQuTmV3KC4uLmFyZ3MpO1xuICAgICAgICB9LFxuICAgICAgICBcInxcIjogKC4uLmFyZ3MpID0+IHtcbiAgICAgICAgICAgIHJldHVybiBPci5OZXcoLi4uYXJncyk7XG4gICAgICAgIH0sXG4gICAgICAgIFwiIVwiOiAoYXJnKSA9PiB7XG4gICAgICAgICAgICByZXR1cm4gTm90Lk5ldyhhcmcpO1xuICAgICAgICB9LFxuICAgIH07XG5cbiAgICBhcmdzOiBhbnlbXTtcblxuICAgIGNvbnN0cnVjdG9yKC4uLmFyZ3M6IGFueVtdKSB7XG4gICAgICAgIHRoaXMuYXJncyA9IGFyZ3MuZmxhdCgpO1xuICAgIH1cblxuICAgIF9ldmFsX3Byb3BhZ2F0ZV9ub3QoKTogYW55IHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiRXZhbCBwcm9wYWdhdGUgbm90IGlzIGFic3RyYWN0IGluIExvZ2ljXCIpO1xuICAgIH1cblxuICAgIGV4cGFuZCgpOiBhbnkge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJFeHBhbmQgaXMgYWJzdHJhY3QgaW4gTG9naWNcIik7XG4gICAgfVxuXG4gICAgc3RhdGljIF9fbmV3X18oY2xzOiBhbnksIC4uLmFyZ3M6IGFueVtdKTogYW55IHtcbiAgICAgICAgaWYgKGNscyA9PT0gTm90KSB7XG4gICAgICAgICAgICByZXR1cm4gbmV3IE5vdChhcmdzWzBdKTtcbiAgICAgICAgfSBlbHNlIGlmIChjbHMgPT09IEFuZCkge1xuICAgICAgICAgICAgcmV0dXJuIG5ldyBBbmQoYXJncyk7XG4gICAgICAgIH0gZWxzZSBpZiAoY2xzID09PSBPcikge1xuICAgICAgICAgICAgcmV0dXJuIG5ldyBPcihhcmdzKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGdldF9vcF94X25vdHgoKTogYW55IHtcbiAgICAgICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgICB9XG5cbiAgICBoYXNoS2V5KCk6IHN0cmluZyB7XG4gICAgICAgIHJldHVybiB0aGlzLnRvU3RyaW5nKCk7XG4gICAgfVxuXG4gICAgdG9TdHJpbmcoKSB7XG4gICAgICAgIHJldHVybiBcIkxvZ2ljIFwiICsgdGhpcy5hcmdzLnRvU3RyaW5nKCk7XG4gICAgfVxuXG4gICAgZ2V0TmV3QXJncygpOiBhbnlbXSB7XG4gICAgICAgIHJldHVybiB0aGlzLmFyZ3M7XG4gICAgfVxuXG4gICAgc3RhdGljIGVxdWFscyhhOiBhbnksIGI6IGFueSk6IGJvb2xlYW4ge1xuICAgICAgICBpZiAoIShiIGluc3RhbmNlb2YgYS5jb25zdHJ1Y3RvcikpIHtcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGlmIChhLmFyZ3MgPT0gYi5hcmdzKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBzdGF0aWMgbm90RXF1YWxzKGE6IGFueSwgYjogYW55KTogYm9vbGVhbiB7XG4gICAgICAgIGlmICghKGIgaW5zdGFuY2VvZiBhLmNvbnN0cnVjdG9yKSkge1xuICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBpZiAoYS5hcmdzID09IGIuYXJncykge1xuICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgbGVzc1RoYW4ob3RoZXI6IE9iamVjdCk6IGJvb2xlYW4ge1xuICAgICAgICBpZiAodGhpcy5jb21wYXJlKG90aGVyKSA9PSAtMSkge1xuICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cblxuICAgIGNvbXBhcmUob3RoZXI6IGFueSk6IG51bWJlciB7XG4gICAgICAgIGxldCBhOyBsZXQgYjtcbiAgICAgICAgaWYgKHR5cGVvZiB0aGlzICE9IHR5cGVvZiBvdGhlcikge1xuICAgICAgICAgICAgY29uc3QgdW5rU2VsZjogdW5rbm93biA9IDx1bmtub3duPiB0aGlzLmNvbnN0cnVjdG9yO1xuICAgICAgICAgICAgY29uc3QgdW5rT3RoZXI6IHVua25vd24gPSA8dW5rbm93bj4gb3RoZXIuY29uc3RydWN0b3I7XG4gICAgICAgICAgICBhID0gPHN0cmluZz4gdW5rU2VsZjtcbiAgICAgICAgICAgIGIgPSA8c3RyaW5nPiB1bmtPdGhlcjtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGEgPSB0aGlzLmFyZ3M7XG4gICAgICAgICAgICBiID0gb3RoZXIuYXJncztcbiAgICAgICAgfVxuICAgICAgICBpZiAoYSA+IGIpIHtcbiAgICAgICAgICAgIHJldHVybiAxO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuIDA7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBzdGF0aWMgZnJvbXN0cmluZyh0ZXh0OiBzdHJpbmcpIHtcbiAgICAgICAgLyogTG9naWMgZnJvbSBzdHJpbmcgd2l0aCBzcGFjZSBhcm91bmQgJiBhbmQgfCBidXQgbm9uZSBhZnRlciAhLlxuICAgICAgICAgICBlLmcuXG4gICAgICAgICAgICFhICYgYiB8IGNcbiAgICAgICAgKi9cbiAgICAgICAgbGV0IGxleHByID0gbnVsbDsgLy8gY3VycmVudCBsb2dpY2FsIGV4cHJlc3Npb25cbiAgICAgICAgbGV0IHNjaGVkb3AgPSBudWxsOyAvLyBzY2hlZHVsZWQgb3BlcmF0aW9uXG4gICAgICAgIGZvciAoY29uc3QgdGVybSBvZiB0ZXh0LnNwbGl0KFwiIFwiKSkge1xuICAgICAgICAgICAgbGV0IGZsZXhUZXJtOiBzdHJpbmcgfCBMb2dpYyA9IHRlcm07XG4gICAgICAgICAgICAvLyBvcGVyYXRpb24gc3ltYm9sXG4gICAgICAgICAgICBpZiAoXCImfFwiLmluY2x1ZGVzKGZsZXhUZXJtKSkge1xuICAgICAgICAgICAgICAgIGlmIChzY2hlZG9wICE9IG51bGwpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiZG91YmxlIG9wIGZvcmJpZGRlbiBcIiArIGZsZXhUZXJtICsgXCIgXCIgKyBzY2hlZG9wKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgaWYgKGxleHByID09IG51bGwpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKGZsZXhUZXJtICsgXCIgY2Fubm90IGJlIGluIHRoZSBiZWdpbm5pbmcgb2YgZXhwcmVzc2lvblwiKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgc2NoZWRvcCA9IGZsZXhUZXJtO1xuICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKGZsZXhUZXJtLmluY2x1ZGVzKFwifFwiKSB8fCBmbGV4VGVybS5pbmNsdWRlcyhcIiZcIikpIHtcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCImIGFuZCB8IG11c3QgaGF2ZSBzcGFjZSBhcm91bmQgdGhlbVwiKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChmbGV4VGVybVswXSA9PSBcIiFcIikge1xuICAgICAgICAgICAgICAgIGlmIChmbGV4VGVybS5sZW5ndGggPT0gMSkge1xuICAgICAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJkbyBub3QgaW5jbHVkZSBzcGFjZSBhZnRlciAhXCIpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBmbGV4VGVybSA9IE5vdC5OZXcoZmxleFRlcm0uc3Vic3RyaW5nKDEpKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIC8vIGFscmVhZHkgc2NoZWR1bGVkIG9wZXJhdGlvbiwgZS5nLiAnJidcbiAgICAgICAgICAgIGlmIChzY2hlZG9wKSB7XG4gICAgICAgICAgICAgICAgY29uc3Qgb3AgPSBMb2dpYy5vcF8yY2xhc3Nbc2NoZWRvcF07XG4gICAgICAgICAgICAgICAgbGV4cHIgPSBvcChsZXhwciwgZmxleFRlcm0pO1xuICAgICAgICAgICAgICAgIHNjaGVkb3AgPSBudWxsO1xuICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgLy8gdGhpcyBzaG91bGQgYmUgYXRvbVxuICAgICAgICAgICAgaWYgKGxleHByICE9IG51bGwpIHtcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJtaXNzaW5nIG9wIGJldHdlZW4gXCIgKyBsZXhwciArIFwiIGFuZCBcIiArIGZsZXhUZXJtICk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBsZXhwciA9IGZsZXhUZXJtO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gbGV0J3MgY2hlY2sgdGhhdCB3ZSBlbmRlZCB1cCBpbiBjb3JyZWN0IHN0YXRlXG4gICAgICAgIGlmIChzY2hlZG9wICE9IG51bGwpIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcInByZW1hdHVyZSBlbmQtb2YtZXhwcmVzc2lvbiBpbiBcIiArIHRleHQpO1xuICAgICAgICB9XG4gICAgICAgIGlmIChsZXhwciA9PSBudWxsKSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IodGV4dCArIFwiIGlzIGVtcHR5XCIpO1xuICAgICAgICB9XG4gICAgICAgIC8vIGV2ZXJ5dGhpbmcgbG9va3MgZ29vZCBub3dcbiAgICAgICAgcmV0dXJuIGxleHByO1xuICAgIH1cbn1cblxuY2xhc3MgQW5kT3JfQmFzZSBleHRlbmRzIExvZ2ljIHtcbiAgICBzdGF0aWMgX19uZXdfXyhjbHM6IGFueSwgb3BfeF9ub3R4OiBhbnksIC4uLmFyZ3M6IGFueVtdKSB7XG4gICAgICAgIGNvbnN0IGJhcmdzOiBhbnlbXSA9IFtdO1xuICAgICAgICBmb3IgKGNvbnN0IGEgb2YgYXJncykge1xuICAgICAgICAgICAgaWYgKGEgPT09IG9wX3hfbm90eCkge1xuICAgICAgICAgICAgICAgIHJldHVybiBhO1xuICAgICAgICAgICAgfSBlbHNlIGlmIChhID09PSAhb3BfeF9ub3R4KSB7XG4gICAgICAgICAgICAgICAgY29udGludWU7IC8vIHNraXAgdGhpcyBhcmd1bWVudFxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgYmFyZ3MucHVzaChhKTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIHByZXYgdmVyc2lvbjogYXJncyA9IHNvcnRlZChzZXQodGhpcy5mbGF0dGVuKGJhcmdzKSksIGtleT1oYXNoKVxuICAgICAgICAvLyB3ZSB0aGluayB3ZSBkb24ndCBuZWVkIHRoZSBzb3J0IGFuZCBzZXRcbiAgICAgICAgYXJncyA9IG5ldyBIYXNoU2V0KEFuZE9yX0Jhc2UuZmxhdHRlbihiYXJncykpLnRvQXJyYXkoKS5zb3J0KFxuICAgICAgICAgICAgKGEsIGIpID0+IFV0aWwuaGFzaEtleShhKS5sb2NhbGVDb21wYXJlKFV0aWwuaGFzaEtleShiKSlcbiAgICAgICAgKTtcblxuICAgICAgICAvLyBjcmVhdGluZyBhIHNldCB3aXRoIGhhc2gga2V5cyBmb3IgYXJnc1xuICAgICAgICBjb25zdCBhcmdzX3NldCA9IG5ldyBIYXNoU2V0KGFyZ3MpO1xuXG4gICAgICAgIGZvciAoY29uc3QgYSBvZiBhcmdzKSB7XG4gICAgICAgICAgICBpZiAoYXJnc19zZXQuaGFzKE5vdC5OZXcoYSkpKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIG9wX3hfbm90eDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChhcmdzLmxlbmd0aCA9PSAxKSB7XG4gICAgICAgICAgICByZXR1cm4gYXJncy5wb3AoKTtcbiAgICAgICAgfSBlbHNlIGlmIChhcmdzLmxlbmd0aCA9PSAwKSB7XG4gICAgICAgICAgICBpZiAob3BfeF9ub3R4KSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gc3VwZXIuX19uZXdfXyhjbHMsIC4uLmFyZ3MpO1xuICAgIH1cblxuICAgIHN0YXRpYyBmbGF0dGVuKGFyZ3M6IGFueVtdKTogYW55W10ge1xuICAgICAgICAvLyBxdWljay1uLWRpcnR5IGZsYXR0ZW5pbmcgZm9yIEFuZCBhbmQgT3JcbiAgICAgICAgY29uc3QgYXJnc19xdWV1ZTogYW55W10gPSBhcmdzO1xuICAgICAgICBjb25zdCByZXMgPSBbXTtcbiAgICAgICAgd2hpbGUgKGFyZ3NfcXVldWUubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgY29uc3QgYXJnOiBhbnkgPSBhcmdzX3F1ZXVlLnBvcCgpO1xuICAgICAgICAgICAgaWYgKGFyZyBpbnN0YW5jZW9mIExvZ2ljKSB7XG4gICAgICAgICAgICAgICAgaWYgKGFyZyBpbnN0YW5jZW9mIHRoaXMpIHtcbiAgICAgICAgICAgICAgICAgICAgYXJnc19xdWV1ZS5wdXNoKC4uLmFyZy5hcmdzKTtcbiAgICAgICAgICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmVzLnB1c2goYXJnKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gcmVzO1xuICAgIH1cbn1cblxuY2xhc3MgQW5kIGV4dGVuZHMgQW5kT3JfQmFzZSB7XG4gICAgc3RhdGljIE5ldyguLi5hcmdzOiBhbnlbXSkge1xuICAgICAgICByZXR1cm4gc3VwZXIuX19uZXdfXyhBbmQsIGZhbHNlLCAuLi5hcmdzKTtcbiAgICB9XG5cblxuICAgIF9ldmFsX3Byb3BhZ2F0ZV9ub3QoKTogT3Ige1xuICAgICAgICAvLyAhIChhJmImYyAuLi4pID09ICFhIHwgIWIgfCAhYyAuLi5cbiAgICAgICAgY29uc3QgcGFyYW06IGFueVtdID0gW107XG4gICAgICAgIGZvciAoY29uc3QgYSBvZiBwYXJhbSkge1xuICAgICAgICAgICAgcGFyYW0ucHVzaChOb3QuTmV3KGEpKTsgLy8gPz9cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gT3IuTmV3KC4uLnBhcmFtKTsgLy8gPz8/XG4gICAgfVxuXG4gICAgLy8gKGF8YnwuLi4pICYgYyA9PSAoYSZjKSB8IChiJmMpIHwgLi4uXG4gICAgZXhwYW5kKCk6IGFueSB7XG4gICAgICAgIC8vIGZpcnN0IGxvY2F0ZSBPclxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMuYXJncy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgY29uc3QgYXJnID0gdGhpcy5hcmdzW2ldO1xuICAgICAgICAgICAgaWYgKGFyZyBpbnN0YW5jZW9mIE9yKSB7XG4gICAgICAgICAgICAgICAgLy8gY29weSBvZiB0aGlzLmFyZ3Mgd2l0aCBhcmcgYXQgcG9zaXRpb24gaSByZW1vdmVkXG5cbiAgICAgICAgICAgICAgICBjb25zdCBhcmVzdCA9IFsuLi50aGlzLmFyZ3NdLnNwbGljZShpLCAxKTtcblxuICAgICAgICAgICAgICAgIC8vIHN0ZXAgYnkgc3RlcCB2ZXJzaW9uIG9mIHRoZSBtYXAgYmVsb3dcbiAgICAgICAgICAgICAgICAvKlxuICAgICAgICAgICAgICAgIGxldCBvcnRlcm1zID0gW107XG4gICAgICAgICAgICAgICAgZm9yIChsZXQgYSBvZiBhcmcuYXJncykge1xuICAgICAgICAgICAgICAgICAgICBvcnRlcm1zLnB1c2gobmV3IEFuZCguLi5hcmVzdC5jb25jYXQoW2FdKSkpXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICovXG5cbiAgICAgICAgICAgICAgICBjb25zdCBvcnRlcm1zID0gYXJnLmFyZ3MubWFwKChlKSA9PiBBbmQuTmV3KC4uLmFyZXN0LmNvbmNhdChbZV0pKSk7XG5cblxuICAgICAgICAgICAgICAgIGZvciAobGV0IGogPSAwOyBqIDwgb3J0ZXJtcy5sZW5ndGg7IGorKykge1xuICAgICAgICAgICAgICAgICAgICBpZiAob3J0ZXJtc1tqXSBpbnN0YW5jZW9mIExvZ2ljKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBvcnRlcm1zW2pdID0gb3J0ZXJtc1tqXS5leHBhbmQoKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBjb25zdCByZXMgPSBPci5OZXcoLi4ub3J0ZXJtcyk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHJlcztcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9XG59XG5cbmNsYXNzIE9yIGV4dGVuZHMgQW5kT3JfQmFzZSB7XG4gICAgc3RhdGljIE5ldyguLi5hcmdzOiBhbnlbXSkge1xuICAgICAgICByZXR1cm4gc3VwZXIuX19uZXdfXyhPciwgdHJ1ZSwgLi4uYXJncyk7XG4gICAgfVxuXG4gICAgX2V2YWxfcHJvcGFnYXRlX25vdCgpOiBBbmQge1xuICAgICAgICAvLyAhIChhJmImYyAuLi4pID09ICFhIHwgIWIgfCAhYyAuLi5cbiAgICAgICAgY29uc3QgcGFyYW06IGFueVtdID0gW107XG4gICAgICAgIGZvciAoY29uc3QgYSBvZiBwYXJhbSkge1xuICAgICAgICAgICAgcGFyYW0ucHVzaChOb3QuTmV3KGEpKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gQW5kLk5ldyguLi5wYXJhbSk7XG4gICAgfVxufVxuXG5jbGFzcyBOb3QgZXh0ZW5kcyBMb2dpYyB7XG4gICAgc3RhdGljIE5ldyhhcmdzOiBhbnkpIHtcbiAgICAgICAgcmV0dXJuIE5vdC5fX25ld19fKE5vdCwgYXJncyk7XG4gICAgfVxuXG4gICAgc3RhdGljIF9fbmV3X18oY2xzOiBhbnksIGFyZzogYW55KSB7XG4gICAgICAgIGlmICh0eXBlb2YgYXJnID09PSBcInN0cmluZ1wiKSB7XG4gICAgICAgICAgICByZXR1cm4gc3VwZXIuX19uZXdfXyhjbHMsIGFyZyk7XG4gICAgICAgIH0gZWxzZSBpZiAoYXJnID09PSB0cnVlKSB7XG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH0gZWxzZSBpZiAoYXJnID09PSBmYWxzZSkge1xuICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgIH0gZWxzZSBpZiAoYXJnIGluc3RhbmNlb2YgTm90KSB7XG4gICAgICAgICAgICByZXR1cm4gYXJnLmFyZ3NbMF07XG4gICAgICAgIH0gZWxzZSBpZiAoYXJnIGluc3RhbmNlb2YgTG9naWMpIHtcbiAgICAgICAgICAgIC8vIFhYWCB0aGlzIGlzIGEgaGFjayB0byBleHBhbmQgcmlnaHQgZnJvbSB0aGUgYmVnaW5uaW5nXG4gICAgICAgICAgICBhcmcgPSBhcmcuX2V2YWxfcHJvcGFnYXRlX25vdCgpO1xuICAgICAgICAgICAgcmV0dXJuIGFyZztcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcIk5vdDogdW5rbm93biBhcmd1bWVudCBcIiArIGFyZyk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBhcmcoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmFyZ3NbMF07XG4gICAgfVxufVxuXG5leHBvcnQge0xvZ2ljLCBBbmQsIE9yLCBOb3QsIGZ1enp5X2FuZCwgZnV6enlfYm9vbCwgZnV6enlfbm90fTtcblxuXG4iLCAiLyogZXNsaW50LWRpc2FibGUgbmV3LWNhcCAqL1xuLyogVGhpcyBpcyBydWxlLWJhc2VkIGRlZHVjdGlvbiBzeXN0ZW0gZm9yIFN5bVB5XG5UaGUgd2hvbGUgdGhpbmcgaXMgc3BsaXQgaW50byB0d28gcGFydHNcbiAtIHJ1bGVzIGNvbXBpbGF0aW9uIGFuZCBwcmVwYXJhdGlvbiBvZiB0YWJsZXNcbiAtIHJ1bnRpbWUgaW5mZXJlbmNlXG5Gb3IgcnVsZS1iYXNlZCBpbmZlcmVuY2UgZW5naW5lcywgdGhlIGNsYXNzaWNhbCB3b3JrIGlzIFJFVEUgYWxnb3JpdGhtIFsxXSxcblsyXSBBbHRob3VnaCB3ZSBhcmUgbm90IGltcGxlbWVudGluZyBpdCBpbiBmdWxsIChvciBldmVuIHNpZ25pZmljYW50bHkpXG5pdCdzIHN0aWxsIHdvcnRoIGEgcmVhZCB0byB1bmRlcnN0YW5kIHRoZSB1bmRlcmx5aW5nIGlkZWFzLlxuSW4gc2hvcnQsIGV2ZXJ5IHJ1bGUgaW4gYSBzeXN0ZW0gb2YgcnVsZXMgaXMgb25lIG9mIHR3byBmb3JtczpcbiAtIGF0b20gICAgICAgICAgICAgICAgICAgICAtPiAuLi4gICAgICAoYWxwaGEgcnVsZSlcbiAtIEFuZChhdG9tMSwgYXRvbTIsIC4uLikgICAtPiAuLi4gICAgICAoYmV0YSBydWxlKVxuVGhlIG1ham9yIGNvbXBsZXhpdHkgaXMgaW4gZWZmaWNpZW50IGJldGEtcnVsZXMgcHJvY2Vzc2luZyBhbmQgdXN1YWxseSBmb3IgYW5cbmV4cGVydCBzeXN0ZW0gYSBsb3Qgb2YgZWZmb3J0IGdvZXMgaW50byBjb2RlIHRoYXQgb3BlcmF0ZXMgb24gYmV0YS1ydWxlcy5cbkhlcmUgd2UgdGFrZSBtaW5pbWFsaXN0aWMgYXBwcm9hY2ggdG8gZ2V0IHNvbWV0aGluZyB1c2FibGUgZmlyc3QuXG4gLSAocHJlcGFyYXRpb24pICAgIG9mIGFscGhhLSBhbmQgYmV0YS0gbmV0d29ya3MsIGV2ZXJ5dGhpbmcgZXhjZXB0XG4gLSAocnVudGltZSkgICAgICAgIEZhY3RSdWxlcy5kZWR1Y2VfYWxsX2ZhY3RzXG4gICAgICAgICAgICAgX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX1xuICAgICAgICAgICAgKCBLaXJyOiBJJ3ZlIG5ldmVyIHRob3VnaHQgdGhhdCBkb2luZyApXG4gICAgICAgICAgICAoIGxvZ2ljIHN0dWZmIGlzIHRoYXQgZGlmZmljdWx0Li4uICAgIClcbiAgICAgICAgICAgICAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgICAgICAgICAgICAgICAgIG8gICBeX19eXG4gICAgICAgICAgICAgICAgICAgICBvICAob28pXFxfX19fX19fXG4gICAgICAgICAgICAgICAgICAgICAgICAoX18pXFwgICAgICAgKVxcL1xcXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfHwtLS0tdyB8XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfHwgICAgIHx8XG5Tb21lIHJlZmVyZW5jZXMgb24gdGhlIHRvcGljXG4tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5bMV0gaHR0cHM6Ly9lbi53aWtpcGVkaWEub3JnL3dpa2kvUmV0ZV9hbGdvcml0aG1cblsyXSBodHRwOi8vcmVwb3J0cy1hcmNoaXZlLmFkbS5jcy5jbXUuZWR1L2Fub24vMTk5NS9DTVUtQ1MtOTUtMTEzLnBkZlxuaHR0cHM6Ly9lbi53aWtpcGVkaWEub3JnL3dpa2kvUHJvcG9zaXRpb25hbF9mb3JtdWxhXG5odHRwczovL2VuLndpa2lwZWRpYS5vcmcvd2lraS9JbmZlcmVuY2VfcnVsZVxuaHR0cHM6Ly9lbi53aWtpcGVkaWEub3JnL3dpa2kvTGlzdF9vZl9ydWxlc19vZl9pbmZlcmVuY2VcbiovXG5cbi8qXG5cblNpZ25pZmljYW50IGNoYW5nZXMgbWFkZSAoV0IgYW5kIEdNKTpcbi0gQ3JlYXRlZCB0aGUgSW1wbGljYXRpb24gY2xhc3MsIHVzZSB0byByZXByZXNlbnQgdGhlIGltcGxpY2F0aW9uIHAgLT4gcSB3aGljaFxuICBpcyBzdG9yZWQgYXMgYSB0dXBsZSBpbiBzeW1weVxuLSBDcmVhdGVkIHRoZSBTZXREZWZhdWx0RGljdCwgSGFzaERpY3QgYW5kIEhhc2hTZXQgY2xhc3Nlcy4gU2V0RGVmYXVsdERpY3QgYWN0c1xuICBhcyBhIHJlcGxjYWNlbWVudCBkZWZhdWx0ZGljdChzZXQpLCBhbmQgSGFzaERpY3QgYW5kIEhhc2hTZXQgcmVwbGFjZSB0aGVcbiAgZGljdCBhbmQgc2V0IGNsYXNzZXMuXG4qL1xuXG5cbmltcG9ydCB7U3RkRmFjdEtCfSBmcm9tIFwiLi9hc3N1bXB0aW9uc1wiO1xuaW1wb3J0IHtMb2dpYywgQW5kLCBPciwgTm90fSBmcm9tIFwiLi9sb2dpY1wiO1xuXG5pbXBvcnQge1V0aWwsIEhhc2hTZXQsIFNldERlZmF1bHREaWN0LCBBcnJEZWZhdWx0RGljdCwgSGFzaERpY3QsIEltcGxpY2F0aW9ufSBmcm9tIFwiLi91dGlsaXR5XCI7XG5cblxuZnVuY3Rpb24gX2Jhc2VfZmFjdChhdG9tOiBhbnkpIHtcbiAgICAvKiAgUmV0dXJuIHRoZSBsaXRlcmFsIGZhY3Qgb2YgYW4gYXRvbS5cbiAgICBFZmZlY3RpdmVseSwgdGhpcyBtZXJlbHkgc3RyaXBzIHRoZSBOb3QgYXJvdW5kIGEgZmFjdC5cbiAgICAqL1xuICAgIGlmIChhdG9tIGluc3RhbmNlb2YgTm90KSB7XG4gICAgICAgIHJldHVybiBhdG9tLmFyZygpO1xuICAgIH0gZWxzZSB7XG4gICAgICAgIHJldHVybiBhdG9tO1xuICAgIH1cbn1cblxuXG5mdW5jdGlvbiBfYXNfcGFpcihhdG9tOiBhbnkpIHtcbiAgICAvKiAgUmV0dXJuIHRoZSBsaXRlcmFsIGZhY3Qgb2YgYW4gYXRvbS5cbiAgICBFZmZlY3RpdmVseSwgdGhpcyBtZXJlbHkgc3RyaXBzIHRoZSBOb3QgYXJvdW5kIGEgZmFjdC5cbiAgICAqL1xuICAgIGlmIChhdG9tIGluc3RhbmNlb2YgTm90KSB7XG4gICAgICAgIHJldHVybiBuZXcgSW1wbGljYXRpb24oYXRvbS5hcmcoKSwgZmFsc2UpO1xuICAgIH0gZWxzZSB7XG4gICAgICAgIHJldHVybiBuZXcgSW1wbGljYXRpb24oYXRvbSwgdHJ1ZSk7XG4gICAgfVxufVxuXG4vLyBYWFggdGhpcyBwcmVwYXJlcyBmb3J3YXJkLWNoYWluaW5nIHJ1bGVzIGZvciBhbHBoYS1uZXR3b3JrXG5cbmZ1bmN0aW9uIHRyYW5zaXRpdmVfY2xvc3VyZShpbXBsaWNhdGlvbnM6IEltcGxpY2F0aW9uW10pIHtcbiAgICAvKlxuICAgIENvbXB1dGVzIHRoZSB0cmFuc2l0aXZlIGNsb3N1cmUgb2YgYSBsaXN0IG9mIGltcGxpY2F0aW9uc1xuICAgIFVzZXMgV2Fyc2hhbGwncyBhbGdvcml0aG0sIGFzIGRlc2NyaWJlZCBhdFxuICAgIGh0dHA6Ly93d3cuY3MuaG9wZS5lZHUvfmN1c2Fjay9Ob3Rlcy9Ob3Rlcy9EaXNjcmV0ZU1hdGgvV2Fyc2hhbGwucGRmLlxuICAgICovXG4gICAgbGV0IHRlbXAgPSBuZXcgQXJyYXkoKTtcbiAgICBmb3IgKGNvbnN0IGltcGwgb2YgaW1wbGljYXRpb25zKSB7XG4gICAgICAgIHRlbXAucHVzaChpbXBsLnApO1xuICAgICAgICB0ZW1wLnB1c2goaW1wbC5xKTtcbiAgICB9XG4gICAgdGVtcCA9IHRlbXAuZmxhdCgpO1xuICAgIGNvbnN0IGZ1bGxfaW1wbGljYXRpb25zID0gbmV3IEhhc2hTZXQoaW1wbGljYXRpb25zKTtcbiAgICBjb25zdCBsaXRlcmFscyA9IG5ldyBIYXNoU2V0KHRlbXApO1xuICAgIFxuICAgIGZvciAoY29uc3QgayBvZiBsaXRlcmFscy50b0FycmF5KCkpIHtcbiAgICAgICAgZm9yIChjb25zdCBpIG9mIGxpdGVyYWxzLnRvQXJyYXkoKSkge1xuICAgICAgICAgICAgaWYgKGZ1bGxfaW1wbGljYXRpb25zLmhhcyhuZXcgSW1wbGljYXRpb24oaSwgaykpKSB7XG4gICAgICAgICAgICAgICAgZm9yIChjb25zdCBqIG9mIGxpdGVyYWxzLnRvQXJyYXkoKSkge1xuICAgICAgICAgICAgICAgICAgICBpZiAoZnVsbF9pbXBsaWNhdGlvbnMuaGFzKG5ldyBJbXBsaWNhdGlvbihrLCBqKSkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGZ1bGxfaW1wbGljYXRpb25zLmFkZChuZXcgSW1wbGljYXRpb24oaSwgaikpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuICAgIHJldHVybiBmdWxsX2ltcGxpY2F0aW9ucztcbn1cblxuXG5mdW5jdGlvbiBkZWR1Y2VfYWxwaGFfaW1wbGljYXRpb25zKGltcGxpY2F0aW9uczogSW1wbGljYXRpb25bXSkge1xuICAgIC8qIGRlZHVjZSBhbGwgaW1wbGljYXRpb25zXG4gICAgICAgRGVzY3JpcHRpb24gYnkgZXhhbXBsZVxuICAgICAgIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAgICBnaXZlbiBzZXQgb2YgbG9naWMgcnVsZXM6XG4gICAgICAgICBhIC0+IGJcbiAgICAgICAgIGIgLT4gY1xuICAgICAgIHdlIGRlZHVjZSBhbGwgcG9zc2libGUgcnVsZXM6XG4gICAgICAgICBhIC0+IGIsIGNcbiAgICAgICAgIGIgLT4gY1xuICAgICAgIGltcGxpY2F0aW9uczogW10gb2YgKGEsYilcbiAgICAgICByZXR1cm46ICAgICAgIHt9IG9mIGEgLT4gc2V0KFtiLCBjLCAuLi5dKVxuICAgICAgICovXG4gICAgY29uc3QgbmV3X2FycjogYW55W10gPSBbXTtcbiAgICBmb3IgKGNvbnN0IGltcGwgb2YgaW1wbGljYXRpb25zKSB7XG4gICAgICAgIG5ld19hcnIucHVzaChuZXcgSW1wbGljYXRpb24oTm90Lk5ldyhpbXBsLnEpLCBOb3QuTmV3KGltcGwucCkpKTtcbiAgICB9XG4gICAgaW1wbGljYXRpb25zID0gaW1wbGljYXRpb25zLmNvbmNhdChuZXdfYXJyKTtcbiAgICBjb25zdCByZXMgPSBuZXcgU2V0RGVmYXVsdERpY3QoKTtcbiAgICBjb25zdCBmdWxsX2ltcGxpY2F0aW9ucyA9IHRyYW5zaXRpdmVfY2xvc3VyZShpbXBsaWNhdGlvbnMpO1xuICAgIGZvciAoY29uc3QgaW1wbCBvZiBmdWxsX2ltcGxpY2F0aW9ucy50b0FycmF5KCkpIHtcbiAgICAgICAgaWYgKGltcGwucCA9PT0gaW1wbC5xKSB7XG4gICAgICAgICAgICBjb250aW51ZTsgLy8gc2tpcCBhLT5hIGN5Y2xpYyBpbnB1dFxuICAgICAgICB9XG4gICAgICAgIGNvbnN0IGN1cnJTZXQgPSByZXMuZ2V0KGltcGwucCk7XG4gICAgICAgIGN1cnJTZXQuYWRkKGltcGwucSk7XG4gICAgICAgIHJlcy5hZGQoaW1wbC5wLCBjdXJyU2V0KTtcbiAgICB9XG4gICAgLy8gQ2xlYW4gdXAgdGF1dG9sb2dpZXMgYW5kIGNoZWNrIGNvbnNpc3RlbmN5XG4gICAgLy8gaW1wbCBpcyB0aGUgc2V0XG4gICAgZm9yIChjb25zdCBpdGVtIG9mIHJlcy5lbnRyaWVzKCkpIHtcbiAgICAgICAgY29uc3QgYSA9IGl0ZW1bMF07XG4gICAgICAgIGNvbnN0IGltcGw6IEhhc2hTZXQgPSBpdGVtWzFdO1xuICAgICAgICBpbXBsLnJlbW92ZShhKTtcbiAgICAgICAgY29uc3QgbmEgPSBOb3QuTmV3KGEpO1xuICAgICAgICBpZiAoaW1wbC5oYXMobmEpKSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJpbXBsaWNhdGlvbnMgYXJlIGluY29uc2lzdGVudDogXCIgKyBhICsgXCIgLT4gXCIgKyBuYSArIFwiIFwiICsgaW1wbCk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIHJlcztcbn1cblxuZnVuY3Rpb24gYXBwbHlfYmV0YV90b19hbHBoYV9yb3V0ZShhbHBoYV9pbXBsaWNhdGlvbnM6IEhhc2hEaWN0LCBiZXRhX3J1bGVzOiBhbnlbXSkge1xuICAgIC8qIGFwcGx5IGFkZGl0aW9uYWwgYmV0YS1ydWxlcyAoQW5kIGNvbmRpdGlvbnMpIHRvIGFscmVhZHktYnVpbHRcbiAgICBhbHBoYSBpbXBsaWNhdGlvbiB0YWJsZXNcbiAgICAgICBUT0RPOiB3cml0ZSBhYm91dFxuICAgICAgIC0gc3RhdGljIGV4dGVuc2lvbiBvZiBhbHBoYS1jaGFpbnNcbiAgICAgICAtIGF0dGFjaGluZyByZWZzIHRvIGJldGEtbm9kZXMgdG8gYWxwaGEgY2hhaW5zXG4gICAgICAgZS5nLlxuICAgICAgIGFscGhhX2ltcGxpY2F0aW9uczpcbiAgICAgICBhICAtPiAgW2IsICFjLCBkXVxuICAgICAgIGIgIC0+ICBbZF1cbiAgICAgICAuLi5cbiAgICAgICBiZXRhX3J1bGVzOlxuICAgICAgICYoYixkKSAtPiBlXG4gICAgICAgdGhlbiB3ZSdsbCBleHRlbmQgYSdzIHJ1bGUgdG8gdGhlIGZvbGxvd2luZ1xuICAgICAgIGEgIC0+ICBbYiwgIWMsIGQsIGVdXG4gICAgKi9cblxuICAgIC8vIGlzIGJldGFfcnVsZXMgYW4gYXJyYXkgb3IgYSBkaWN0aW9uYXJ5P1xuXG4gICAgY29uc3QgeF9pbXBsOiBIYXNoRGljdCA9IG5ldyBIYXNoRGljdCgpO1xuICAgIGZvciAoY29uc3QgeCBvZiBhbHBoYV9pbXBsaWNhdGlvbnMua2V5cygpKSB7XG4gICAgICAgIGNvbnN0IG5ld3NldCA9IG5ldyBIYXNoU2V0KCk7XG4gICAgICAgIG5ld3NldC5hZGRBcnIoYWxwaGFfaW1wbGljYXRpb25zLmdldCh4KS50b0FycmF5KCkpO1xuICAgICAgICBjb25zdCBpbXAgPSBuZXcgSW1wbGljYXRpb24obmV3c2V0LCBbXSk7XG4gICAgICAgIHhfaW1wbC5hZGQoeCwgaW1wKTtcbiAgICB9XG4gICAgZm9yIChjb25zdCBpdGVtIG9mIGJldGFfcnVsZXMpIHtcbiAgICAgICAgY29uc3QgYmNvbmQgPSBpdGVtLnA7XG4gICAgICAgIGZvciAoY29uc3QgYmsgb2YgYmNvbmQuYXJncykge1xuICAgICAgICAgICAgaWYgKHhfaW1wbC5oYXMoYmspKSB7XG4gICAgICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBjb25zdCBpbXAgPSBuZXcgSW1wbGljYXRpb24obmV3IEhhc2hTZXQoKSwgW10pO1xuICAgICAgICAgICAgeF9pbXBsLmFkZChiaywgaW1wKTtcbiAgICAgICAgfVxuICAgIH1cbiAgICAvLyBzdGF0aWMgZXh0ZW5zaW9ucyB0byBhbHBoYSBydWxlczpcbiAgICAvLyBBOiB4IC0+IGEsYiAgIEI6ICYoYSxiKSAtPiBjICA9PT4gIEE6IHggLT4gYSxiLGNcblxuICAgIGxldCBzZWVuX3N0YXRpY19leHRlbnNpb24gPSB0cnVlO1xuICAgIHdoaWxlIChzZWVuX3N0YXRpY19leHRlbnNpb24pIHtcbiAgICAgICAgc2Vlbl9zdGF0aWNfZXh0ZW5zaW9uID0gZmFsc2U7XG5cbiAgICAgICAgZm9yIChjb25zdCBpbXBsIG9mIGJldGFfcnVsZXMpIHtcbiAgICAgICAgICAgIGNvbnN0IGJjb25kID0gaW1wbC5wO1xuICAgICAgICAgICAgY29uc3QgYmltcGwgPSBpbXBsLnE7XG4gICAgICAgICAgICBpZiAoIShiY29uZCBpbnN0YW5jZW9mIEFuZCkpIHtcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJDb25kIGlzIG5vdCBBbmRcIik7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBjb25zdCBiYXJncyA9IG5ldyBIYXNoU2V0KGJjb25kLmFyZ3MpO1xuICAgICAgICAgICAgZm9yIChjb25zdCBpdGVtIG9mIHhfaW1wbC5lbnRyaWVzKCkpIHtcbiAgICAgICAgICAgICAgICBjb25zdCB4ID0gaXRlbVswXTtcbiAgICAgICAgICAgICAgICBjb25zdCBpbXBsID0gaXRlbVsxXTtcbiAgICAgICAgICAgICAgICBsZXQgeGltcGxzID0gaW1wbC5wO1xuICAgICAgICAgICAgICAgIGNvbnN0IHhfYWxsID0geGltcGxzLmNsb25lKClcbiAgICAgICAgICAgICAgICB4X2FsbC5hZGQoeCk7XG4gICAgICAgICAgICAgICAgLy8gQTogLi4uIC0+IGEgICBCOiAmKC4uLikgLT4gYSAgaXMgbm9uLWluZm9ybWF0aXZlXG4gICAgICAgICAgICAgICAgaWYgKCF4X2FsbC5oYXMoYmltcGwpICYmIFV0aWwuaXNTdWJzZXQoYmFyZ3MudG9BcnJheSgpLCB4X2FsbC50b0FycmF5KCkpKSB7XG4gICAgICAgICAgICAgICAgICAgIHhpbXBscy5hZGQoYmltcGwpO1xuXG4gICAgICAgICAgICAgICAgICAgIC8vIHdlIGludHJvZHVjZWQgbmV3IGltcGxpY2F0aW9uIC0gbm93IHdlIGhhdmUgdG8gcmVzdG9yZVxuICAgICAgICAgICAgICAgICAgICAvLyBjb21wbGV0ZW5lc3Mgb2YgdGhlIHdob2xlIHNldC5cblxuICAgICAgICAgICAgICAgICAgICBjb25zdCBiaW1wbF9pbXBsID0geF9pbXBsLmdldChiaW1wbCk7XG4gICAgICAgICAgICAgICAgICAgIGlmIChiaW1wbF9pbXBsICE9IG51bGwpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHhpbXBscyB8PSBiaW1wbF9pbXBsWzBdO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIHNlZW5fc3RhdGljX2V4dGVuc2lvbiA9IHRydWU7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuICAgIC8vIGF0dGFjaCBiZXRhLW5vZGVzIHdoaWNoIGNhbiBiZSBwb3NzaWJseSB0cmlnZ2VyZWQgYnkgYW4gYWxwaGEtY2hhaW5cbiAgICBmb3IgKGxldCBiaWR4ID0gMDsgYmlkeCA8IGJldGFfcnVsZXMubGVuZ3RoOyBiaWR4KyspIHtcbiAgICAgICAgY29uc3QgaW1wbCA9IGJldGFfcnVsZXNbYmlkeF07XG4gICAgICAgIGNvbnN0IGJjb25kID0gaW1wbC5wO1xuICAgICAgICBjb25zdCBiaW1wbCA9IGltcGwucTtcbiAgICAgICAgY29uc3QgYmFyZ3MgPSBuZXcgSGFzaFNldChiY29uZC5hcmdzKTtcbiAgICAgICAgZm9yIChjb25zdCBpdGVtIG9mIHhfaW1wbC5lbnRyaWVzKCkpIHtcbiAgICAgICAgICAgIGNvbnN0IHggPSBpdGVtWzBdO1xuICAgICAgICAgICAgY29uc3QgdmFsdWU6IEltcGxpY2F0aW9uID0gaXRlbVsxXTtcbiAgICAgICAgICAgIGNvbnN0IHhpbXBscyA9IHZhbHVlLnA7XG4gICAgICAgICAgICBjb25zdCBiYiA9IHZhbHVlLnE7XG4gICAgICAgICAgICBjb25zdCB4X2FsbCA9IHhpbXBscy5jbG9uZSgpXG4gICAgICAgICAgICB4X2FsbC5hZGQoeCk7XG4gICAgICAgICAgICBpZiAoeF9hbGwuaGFzKGJpbXBsKSkge1xuICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKHhfYWxsLnRvQXJyYXkoKS5zb21lKChlOiBhbnkpID0+IChiYXJncy5oYXMoTm90Lk5ldyhlKSkgfHwgVXRpbC5oYXNoS2V5KE5vdC5OZXcoZSkpID09PSBVdGlsLmhhc2hLZXkoYmltcGwpKSkpIHtcbiAgICAgICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChiYXJncy5pbnRlcnNlY3RzKHhfYWxsKSkge1xuICAgICAgICAgICAgICAgIGJiLnB1c2goYmlkeCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIHhfaW1wbDtcbn1cblxuXG5mdW5jdGlvbiBydWxlc18ycHJlcmVxKHJ1bGVzOiBTZXREZWZhdWx0RGljdCkge1xuICAgIC8qIGJ1aWxkIHByZXJlcXVpc2l0ZXMgdGFibGUgZnJvbSBydWxlc1xuICAgICAgIERlc2NyaXB0aW9uIGJ5IGV4YW1wbGVcbiAgICAgICAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgICAgZ2l2ZW4gc2V0IG9mIGxvZ2ljIHJ1bGVzOlxuICAgICAgICAgYSAtPiBiLCBjXG4gICAgICAgICBiIC0+IGNcbiAgICAgICB3ZSBidWlsZCBwcmVyZXF1aXNpdGVzIChmcm9tIHdoYXQgcG9pbnRzIHNvbWV0aGluZyBjYW4gYmUgZGVkdWNlZCk6XG4gICAgICAgICBiIDwtIGFcbiAgICAgICAgIGMgPC0gYSwgYlxuICAgICAgIHJ1bGVzOiAgIHt9IG9mIGEgLT4gW2IsIGMsIC4uLl1cbiAgICAgICByZXR1cm46ICB7fSBvZiBjIDwtIFthLCBiLCAuLi5dXG4gICAgICAgTm90ZSBob3dldmVyLCB0aGF0IHRoaXMgcHJlcmVxdWlzaXRlcyBtYXkgYmUgKm5vdCogZW5vdWdoIHRvIHByb3ZlIGFcbiAgICAgICBmYWN0LiBBbiBleGFtcGxlIGlzICdhIC0+IGInIHJ1bGUsIHdoZXJlIHByZXJlcShhKSBpcyBiLCBhbmQgcHJlcmVxKGIpXG4gICAgICAgaXMgYS4gVGhhdCdzIGJlY2F1c2UgYT1UIC0+IGI9VCwgYW5kIGI9RiAtPiBhPUYsIGJ1dCBhPUYgLT4gYj0/XG4gICAgKi9cblxuICAgIGNvbnN0IHByZXJlcSA9IG5ldyBTZXREZWZhdWx0RGljdCgpO1xuICAgIGZvciAoY29uc3QgaXRlbSBvZiBydWxlcy5lbnRyaWVzKCkpIHtcbiAgICAgICAgbGV0IGEgPSBpdGVtWzBdLnA7XG4gICAgICAgIGNvbnN0IGltcGwgPSBpdGVtWzFdO1xuICAgICAgICBpZiAoYSBpbnN0YW5jZW9mIE5vdCkge1xuICAgICAgICAgICAgYSA9IGEuYXJnc1swXTtcbiAgICAgICAgfVxuICAgICAgICBmb3IgKGNvbnN0IGl0ZW0gb2YgaW1wbC50b0FycmF5KCkpIHtcbiAgICAgICAgICAgIGxldCBpID0gaXRlbS5wO1xuICAgICAgICAgICAgaWYgKGkgaW5zdGFuY2VvZiBOb3QpIHtcbiAgICAgICAgICAgICAgICBpID0gaS5hcmdzWzBdO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgY29uc3QgdG9BZGQgPSBwcmVyZXEuZ2V0KGkpO1xuICAgICAgICAgICAgdG9BZGQuYWRkKGEpO1xuICAgICAgICAgICAgcHJlcmVxLmFkZChpLCB0b0FkZCk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIHByZXJlcTtcbn1cblxuXG4vLyAvLy8vLy8vLy8vLy8vLy8vXG4vLyBSVUxFUyBQUk9WRVIgLy9cbi8vIC8vLy8vLy8vLy8vLy8vLy9cblxuY2xhc3MgVGF1dG9sb2d5RGV0ZWN0ZWQgZXh0ZW5kcyBFcnJvciB7XG4gICAgYXJncztcblxuICAgIGNvbnN0cnVjdG9yKC4uLmFyZ3M6IGFueVtdKSB7XG4gICAgICAgIHN1cGVyKCk7XG4gICAgICAgIHRoaXMuYXJncyA9IGFyZ3M7XG4gICAgfVxuICAgIC8vIChpbnRlcm5hbCkgUHJvdmVyIHVzZXMgaXQgZm9yIHJlcG9ydGluZyBkZXRlY3RlZCB0YXV0b2xvZ3lcbn1cblxuY2xhc3MgUHJvdmVyIHtcbiAgICAvKiBhaSAtIHByb3ZlciBvZiBsb2dpYyBydWxlc1xuICAgICAgIGdpdmVuIGEgc2V0IG9mIGluaXRpYWwgcnVsZXMsIFByb3ZlciB0cmllcyB0byBwcm92ZSBhbGwgcG9zc2libGUgcnVsZXNcbiAgICAgICB3aGljaCBmb2xsb3cgZnJvbSBnaXZlbiBwcmVtaXNlcy5cbiAgICAgICBBcyBhIHJlc3VsdCBwcm92ZWRfcnVsZXMgYXJlIGFsd2F5cyBlaXRoZXIgaW4gb25lIG9mIHR3byBmb3JtczogYWxwaGEgb3JcbiAgICAgICBiZXRhOlxuICAgICAgIEFscGhhIHJ1bGVzXG4gICAgICAgLS0tLS0tLS0tLS1cbiAgICAgICBUaGlzIGFyZSBydWxlcyBvZiB0aGUgZm9ybTo6XG4gICAgICAgICBhIC0+IGIgJiBjICYgZCAmIC4uLlxuICAgICAgIEJldGEgcnVsZXNcbiAgICAgICAtLS0tLS0tLS0tXG4gICAgICAgVGhpcyBhcmUgcnVsZXMgb2YgdGhlIGZvcm06OlxuICAgICAgICAgJihhLGIsLi4uKSAtPiBjICYgZCAmIC4uLlxuICAgICAgIGkuZS4gYmV0YSBydWxlcyBhcmUgam9pbiBjb25kaXRpb25zIHRoYXQgc2F5IHRoYXQgc29tZXRoaW5nIGZvbGxvd3Mgd2hlblxuICAgICAgICpzZXZlcmFsKiBmYWN0cyBhcmUgdHJ1ZSBhdCB0aGUgc2FtZSB0aW1lLlxuICAgICovXG5cbiAgICBwcm92ZWRfcnVsZXM6IGFueVtdO1xuICAgIF9ydWxlc19zZWVuO1xuXG4gICAgY29uc3RydWN0b3IoKSB7XG4gICAgICAgIHRoaXMucHJvdmVkX3J1bGVzID0gW107XG4gICAgICAgIHRoaXMuX3J1bGVzX3NlZW4gPSBuZXcgSGFzaFNldCgpO1xuICAgIH1cblxuICAgIHNwbGl0X2FscGhhX2JldGEoKSB7XG4gICAgICAgIC8vIHNwbGl0IHByb3ZlZCBydWxlcyBpbnRvIGFscGhhIGFuZCBiZXRhIGNoYWluc1xuICAgICAgICBjb25zdCBydWxlc19hbHBoYSA9IFtdOyAvLyBhICAgICAgLT4gYlxuICAgICAgICBjb25zdCBydWxlc19iZXRhID0gW107IC8vICYoLi4uKSAtPiBiXG4gICAgICAgIGZvciAoY29uc3QgaW1wbCBvZiB0aGlzLnByb3ZlZF9ydWxlcykge1xuICAgICAgICAgICAgY29uc3QgYSA9IGltcGwucDtcbiAgICAgICAgICAgIGNvbnN0IGIgPSBpbXBsLnE7XG4gICAgICAgICAgICBpZiAoYSBpbnN0YW5jZW9mIEFuZCkge1xuICAgICAgICAgICAgICAgIHJ1bGVzX2JldGEucHVzaChuZXcgSW1wbGljYXRpb24oYSwgYikpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBydWxlc19hbHBoYS5wdXNoKG5ldyBJbXBsaWNhdGlvbihhLCBiKSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIFtydWxlc19hbHBoYSwgcnVsZXNfYmV0YV07XG4gICAgfVxuXG4gICAgcnVsZXNfYWxwaGEoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLnNwbGl0X2FscGhhX2JldGEoKVswXTtcbiAgICB9XG5cbiAgICBydWxlc19iZXRhKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5zcGxpdF9hbHBoYV9iZXRhKClbMV07XG4gICAgfVxuXG4gICAgcHJvY2Vzc19ydWxlKGE6IGFueSwgYjogYW55KSB7XG4gICAgICAgIC8vIHByb2Nlc3MgYSAtPiBiIHJ1bGUgIC0+ICBUT0RPIHdyaXRlIG1vcmU/XG4gICAgICAgIGlmICghYSB8fCAodHlwZW9mIGIgPT09IFwiYm9vbGVhblwiKSkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIGlmICh0eXBlb2YgYSA9PT0gXCJib29sZWFuXCIpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICBpZiAodGhpcy5fcnVsZXNfc2Vlbi5oYXMobmV3IEltcGxpY2F0aW9uKGEsIGIpKSkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5fcnVsZXNfc2Vlbi5hZGQobmV3IEltcGxpY2F0aW9uKGEsIGIpKTtcbiAgICAgICAgfVxuICAgICAgICAvLyB0aGlzIGlzIHRoZSBjb3JlIG9mIHRoZSBwcm9jZXNzaW5nXG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICB0aGlzLl9wcm9jZXNzX3J1bGUoYSwgYik7XG4gICAgICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICAgICAgICBpZiAoIShlcnJvciBpbnN0YW5jZW9mIFRhdXRvbG9neURldGVjdGVkKSkge1xuICAgICAgICAgICAgICAgIHRocm93IEVycm9yO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgX3Byb2Nlc3NfcnVsZShhOiBhbnksIGI6IGFueSkge1xuICAgICAgICAvLyByaWdodCBwYXJ0IGZpcnN0XG5cbiAgICAgICAgLy8gYSAtPiBiICYgYyAgIC0tPiAgICBhLT4gYiAgOyAgYSAtPiBjXG5cbiAgICAgICAgLy8gICg/KSBGSVhNRSB0aGlzIGlzIG9ubHkgY29ycmVjdCB3aGVuIGIgJiBjICE9IG51bGwgIVxuXG4gICAgICAgIGlmIChiIGluc3RhbmNlb2YgQW5kKSB7XG4gICAgICAgICAgICBmb3IgKGNvbnN0IGJhcmcgb2YgYi5hcmdzKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5wcm9jZXNzX3J1bGUoYSwgYmFyZyk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSBpZiAoYiBpbnN0YW5jZW9mIE9yKSB7XG4gICAgICAgICAgICAvLyBkZXRlY3QgdGF1dG9sb2d5IGZpcnN0XG4gICAgICAgICAgICBpZiAoIShhIGluc3RhbmNlb2YgTG9naWMpKSB7IC8vIGF0b21cbiAgICAgICAgICAgICAgICAvLyB0YXV0b2xvZ3k6ICBhIC0+IGF8Y3wuLi5cbiAgICAgICAgICAgICAgICBpZiAoYi5hcmdzLmluY2x1ZGVzKGEpKSB7XG4gICAgICAgICAgICAgICAgICAgIHRocm93IG5ldyBUYXV0b2xvZ3lEZXRlY3RlZChhLCBiLCBcImEgLT4gYXxjfC4uLlwiKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBjb25zdCBub3RfYmFyZ3M6IGFueVtdID0gW107XG4gICAgICAgICAgICBmb3IgKGNvbnN0IGJhcmcgb2YgYi5hcmdzKSB7XG4gICAgICAgICAgICAgICAgbm90X2JhcmdzLnB1c2goTm90Lk5ldyhiYXJnKSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB0aGlzLnByb2Nlc3NfcnVsZShBbmQuTmV3KC4uLm5vdF9iYXJncyksIE5vdC5OZXcoYSkpO1xuXG4gICAgICAgICAgICBmb3IgKGxldCBiaWR4ID0gMDsgYmlkeCA8IGIuYXJncy5sZW5ndGg7IGJpZHgrKykge1xuICAgICAgICAgICAgICAgIGNvbnN0IGJhcmcgPSBiLmFyZ3NbYmlkeF07XG4gICAgICAgICAgICAgICAgY29uc3QgYnJlc3QgPSBbLi4uYi5hcmdzXTtcbiAgICAgICAgICAgICAgICBicmVzdC5zcGxpY2UoYmlkeCwgMSk7XG4gICAgICAgICAgICAgICAgdGhpcy5wcm9jZXNzX3J1bGUoQW5kLk5ldyhhLCBOb3QuTmV3KGJhcmcpKSwgT3IuTmV3KC4uLmJyZXN0KSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSBpZiAoYSBpbnN0YW5jZW9mIEFuZCkge1xuICAgICAgICAgICAgaWYgKGEuYXJncy5pbmNsdWRlcyhiKSkge1xuICAgICAgICAgICAgICAgIHRocm93IG5ldyBUYXV0b2xvZ3lEZXRlY3RlZChhLCBiLCBcImEgJiBiIC0+IGFcIik7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB0aGlzLnByb3ZlZF9ydWxlcy5wdXNoKG5ldyBJbXBsaWNhdGlvbihhLCBiKSk7XG4gICAgICAgICAgICAvLyBYWFggTk9URSBhdCBwcmVzZW50IHdlIGlnbm9yZSAgIWMgLT4gIWEgfCAhYlxuICAgICAgICB9IGVsc2UgaWYgKGEgaW5zdGFuY2VvZiBPcikge1xuICAgICAgICAgICAgaWYgKGEuYXJncy5pbmNsdWRlcyhiKSkge1xuICAgICAgICAgICAgICAgIHRocm93IG5ldyBUYXV0b2xvZ3lEZXRlY3RlZChhLCBiLCBcImEgJiBiIC0+IGFcIik7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBmb3IgKGNvbnN0IGFhcmcgb2YgYS5hcmdzKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5wcm9jZXNzX3J1bGUoYWFyZywgYik7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAvLyBib3RoICdhJyBhbmQgJ2InIGFyZSBhdG9tc1xuICAgICAgICAgICAgdGhpcy5wcm92ZWRfcnVsZXMucHVzaChuZXcgSW1wbGljYXRpb24oYSwgYikpOyAvLyBhIC0+IGJcbiAgICAgICAgICAgIHRoaXMucHJvdmVkX3J1bGVzLnB1c2gobmV3IEltcGxpY2F0aW9uKE5vdC5OZXcoYiksIE5vdC5OZXcoYSkpKTtcbiAgICAgICAgfVxuICAgIH1cbn1cblxuLy8gLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cblxuZXhwb3J0IGNsYXNzIEZhY3RSdWxlcyB7XG4gICAgLyogUnVsZXMgdGhhdCBkZXNjcmliZSBob3cgdG8gZGVkdWNlIGZhY3RzIGluIGxvZ2ljIHNwYWNlXG4gICAgV2hlbiBkZWZpbmVkLCB0aGVzZSBydWxlcyBhbGxvdyBpbXBsaWNhdGlvbnMgdG8gcXVpY2tseSBiZSBkZXRlcm1pbmVkXG4gICAgZm9yIGEgc2V0IG9mIGZhY3RzLiBGb3IgdGhpcyBwcmVjb21wdXRlZCBkZWR1Y3Rpb24gdGFibGVzIGFyZSB1c2VkLlxuICAgIHNlZSBgZGVkdWNlX2FsbF9mYWN0c2AgICAoZm9yd2FyZC1jaGFpbmluZylcbiAgICBBbHNvIGl0IGlzIHBvc3NpYmxlIHRvIGdhdGhlciBwcmVyZXF1aXNpdGVzIGZvciBhIGZhY3QsIHdoaWNoIGlzIHRyaWVkXG4gICAgdG8gYmUgcHJvdmVuLiAgICAoYmFja3dhcmQtY2hhaW5pbmcpXG4gICAgRGVmaW5pdGlvbiBTeW50YXhcbiAgICAtLS0tLS0tLS0tLS0tLS0tLVxuICAgIGEgLT4gYiAgICAgICAtLSBhPVQgLT4gYj1UICAoYW5kIGF1dG9tYXRpY2FsbHkgYj1GIC0+IGE9RilcbiAgICBhIC0+ICFiICAgICAgLS0gYT1UIC0+IGI9RlxuICAgIGEgPT0gYiAgICAgICAtLSBhIC0+IGIgJiBiIC0+IGFcbiAgICBhIC0+IGIgJiBjICAgLS0gYT1UIC0+IGI9VCAmIGM9VFxuICAgICMgVE9ETyBiIHwgY1xuICAgIEludGVybmFsc1xuICAgIC0tLS0tLS0tLVxuICAgIC5mdWxsX2ltcGxpY2F0aW9uc1trLCB2XTogYWxsIHRoZSBpbXBsaWNhdGlvbnMgb2YgZmFjdCBrPXZcbiAgICAuYmV0YV90cmlnZ2Vyc1trLCB2XTogYmV0YSBydWxlcyB0aGF0IG1pZ2h0IGJlIHRyaWdnZXJlZCB3aGVuIGs9dlxuICAgIC5wcmVyZXEgIC0tIHt9IGsgPC0gW10gb2YgaydzIHByZXJlcXVpc2l0ZXNcbiAgICAuZGVmaW5lZF9mYWN0cyAtLSBzZXQgb2YgZGVmaW5lZCBmYWN0IG5hbWVzXG4gICAgKi9cblxuICAgIGJldGFfcnVsZXM6IGFueVtdO1xuICAgIGRlZmluZWRfZmFjdHM7XG4gICAgZnVsbF9pbXBsaWNhdGlvbnM7XG4gICAgYmV0YV90cmlnZ2VycztcbiAgICBwcmVyZXE7XG5cbiAgICBjb25zdHJ1Y3RvcihydWxlczogYW55W10gfCBzdHJpbmcpIHtcbiAgICAgICAgLy8gQ29tcGlsZSBydWxlcyBpbnRvIGludGVybmFsIGxvb2t1cCB0YWJsZXNcbiAgICAgICAgaWYgKHR5cGVvZiBydWxlcyA9PT0gXCJzdHJpbmdcIikge1xuICAgICAgICAgICAgcnVsZXMgPSBydWxlcy5zcGxpdChcIlxcblwiKTtcbiAgICAgICAgfVxuICAgICAgICAvLyAtLS0gcGFyc2UgYW5kIHByb2Nlc3MgcnVsZXMgLS0tXG4gICAgICAgIGNvbnN0IFA6IFByb3ZlciA9IG5ldyBQcm92ZXI7XG5cbiAgICAgICAgZm9yIChjb25zdCBydWxlIG9mIHJ1bGVzKSB7XG4gICAgICAgICAgICAvLyBYWFggYGFgIGlzIGhhcmRjb2RlZCB0byBiZSBhbHdheXMgYXRvbVxuICAgICAgICAgICAgbGV0IFthLCBvcCwgYl0gPSBVdGlsLnNwbGl0TG9naWNTdHIocnVsZSk7IFxuICAgICAgICAgICAgYSA9IExvZ2ljLmZyb21zdHJpbmcoYSk7XG4gICAgICAgICAgICBiID0gTG9naWMuZnJvbXN0cmluZyhiKTtcbiAgICAgICAgICAgIGlmIChvcCA9PT0gXCItPlwiKSB7XG4gICAgICAgICAgICAgICAgUC5wcm9jZXNzX3J1bGUoYSwgYik7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKG9wID09PSBcIj09XCIpIHtcbiAgICAgICAgICAgICAgICBQLnByb2Nlc3NfcnVsZShhLCBiKTtcbiAgICAgICAgICAgICAgICBQLnByb2Nlc3NfcnVsZShiLCBhKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwidW5rbm93biBvcCBcIiArIG9wKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIC8vIC0tLSBidWlsZCBkZWR1Y3Rpb24gbmV0d29ya3MgLS0tXG5cbiAgICAgICAgdGhpcy5iZXRhX3J1bGVzID0gW107XG4gICAgICAgIGZvciAoY29uc3QgaXRlbSBvZiBQLnJ1bGVzX2JldGEoKSkge1xuICAgICAgICAgICAgY29uc3QgYmNvbmQgPSBpdGVtLnA7XG4gICAgICAgICAgICBjb25zdCBiaW1wbCA9IGl0ZW0ucTtcbiAgICAgICAgICAgIGNvbnN0IHBhaXJzOiBIYXNoU2V0ID0gbmV3IEhhc2hTZXQoKTtcbiAgICAgICAgICAgIGJjb25kLmFyZ3MuZm9yRWFjaCgoYTogYW55KSA9PiBwYWlycy5hZGQoX2FzX3BhaXIoYSkpKTtcbiAgICAgICAgICAgIHRoaXMuYmV0YV9ydWxlcy5wdXNoKG5ldyBJbXBsaWNhdGlvbihwYWlycywgX2FzX3BhaXIoYmltcGwpKSk7XG4gICAgICAgIH1cblxuICAgICAgICAvLyBkZWR1Y2UgYWxwaGEgaW1wbGljYXRpb25zXG4gICAgICAgIGNvbnN0IGltcGxfYSA9IGRlZHVjZV9hbHBoYV9pbXBsaWNhdGlvbnMoUC5ydWxlc19hbHBoYSgpKTtcblxuICAgICAgICAvLyBub3c6XG4gICAgICAgIC8vIC0gYXBwbHkgYmV0YSBydWxlcyB0byBhbHBoYSBjaGFpbnMgIChzdGF0aWMgZXh0ZW5zaW9uKSwgYW5kXG4gICAgICAgIC8vIC0gZnVydGhlciBhc3NvY2lhdGUgYmV0YSBydWxlcyB0byBhbHBoYSBjaGFpbiAoZm9yIGluZmVyZW5jZVxuICAgICAgICAvLyBhdCBydW50aW1lKVxuXG4gICAgICAgIGNvbnN0IGltcGxfYWIgPSBhcHBseV9iZXRhX3RvX2FscGhhX3JvdXRlKGltcGxfYSwgUC5ydWxlc19iZXRhKCkpO1xuXG4gICAgICAgIC8vIGV4dHJhY3QgZGVmaW5lZCBmYWN0IG5hbWVzXG4gICAgICAgIHRoaXMuZGVmaW5lZF9mYWN0cyA9IG5ldyBIYXNoU2V0KCk7XG5cblxuICAgICAgICBmb3IgKGNvbnN0IGsgb2YgaW1wbF9hYi5rZXlzKCkpIHtcbiAgICAgICAgICAgIHRoaXMuZGVmaW5lZF9mYWN0cy5hZGQoX2Jhc2VfZmFjdChrKSk7XG4gICAgICAgIH1cblxuICAgICAgICAvLyBidWlsZCByZWxzIChmb3J3YXJkIGNoYWlucylcblxuICAgICAgICBjb25zdCBmdWxsX2ltcGxpY2F0aW9ucyA9IG5ldyBTZXREZWZhdWx0RGljdCgpO1xuICAgICAgICBjb25zdCBiZXRhX3RyaWdnZXJzID0gbmV3IEFyckRlZmF1bHREaWN0KCk7XG4gICAgICAgIGZvciAoY29uc3QgaXRlbSBvZiBpbXBsX2FiLmVudHJpZXMoKSkge1xuICAgICAgICAgICAgY29uc3QgayA9aXRlbVswXTtcbiAgICAgICAgICAgIGNvbnN0IHZhbCA9IGl0ZW1bMV07XG4gICAgICAgICAgICBjb25zdCBpbXBsOiBIYXNoU2V0ID0gdmFsLnA7XG4gICAgICAgICAgICBjb25zdCBiZXRhaWR4cyA9IHZhbC5xO1xuICAgICAgICAgICAgY29uc3Qgc2V0VG9BZGQgPSBuZXcgSGFzaFNldCgpO1xuICAgICAgICAgICAgaW1wbC50b0FycmF5KCkuZm9yRWFjaCgoZTogYW55KSA9PiBzZXRUb0FkZC5hZGQoX2FzX3BhaXIoZSkpKTtcbiAgICAgICAgICAgIGZ1bGxfaW1wbGljYXRpb25zLmFkZChfYXNfcGFpcihrKSwgc2V0VG9BZGQpO1xuICAgICAgICAgICAgYmV0YV90cmlnZ2Vycy5hZGQoX2FzX3BhaXIoayksIGJldGFpZHhzKTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLmZ1bGxfaW1wbGljYXRpb25zID0gZnVsbF9pbXBsaWNhdGlvbnM7XG5cbiAgICAgICAgdGhpcy5iZXRhX3RyaWdnZXJzID0gYmV0YV90cmlnZ2VycztcblxuICAgICAgICAvLyBidWlsZCBwcmVyZXEgKGJhY2t3YXJkIGNoYWlucylcbiAgICAgICAgY29uc3QgcHJlcmVxID0gbmV3IFNldERlZmF1bHREaWN0KCk7XG4gICAgICAgIGNvbnN0IHJlbF9wcmVyZXEgPSBydWxlc18ycHJlcmVxKGZ1bGxfaW1wbGljYXRpb25zKTtcbiAgICAgICAgZm9yIChjb25zdCBpdGVtIG9mIHJlbF9wcmVyZXEuZW50cmllcygpKSB7XG4gICAgICAgICAgICBjb25zdCBrID0gaXRlbVswXTtcbiAgICAgICAgICAgIGNvbnN0IHBpdGVtcyA9IGl0ZW1bMV07XG4gICAgICAgICAgICBjb25zdCB0b0FkZCA9IHByZXJlcS5nZXQoayk7XG4gICAgICAgICAgICB0b0FkZC5hZGRBcnIocGl0ZW1zLnRvQXJyYXkoKSk7XG4gICAgICAgICAgICBwcmVyZXEuYWRkKGssIHRvQWRkKTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLnByZXJlcSA9IHByZXJlcTtcbiAgICB9XG59XG5cblxuY2xhc3MgSW5jb25zaXN0ZW50QXNzdW1wdGlvbnMgZXh0ZW5kcyBFcnJvciB7XG4gICAgYXJncztcblxuICAgIGNvbnN0cnVjdG9yKC4uLmFyZ3M6IGFueVtdKSB7XG4gICAgICAgIHN1cGVyKCk7XG4gICAgICAgIHRoaXMuYXJncyA9IGFyZ3M7XG4gICAgfVxuXG4gICAgc3RhdGljIF9fc3RyX18oLi4uYXJnczogYW55W10pIHtcbiAgICAgICAgY29uc3QgW2tiLCBmYWN0LCB2YWx1ZV0gPSBhcmdzO1xuICAgICAgICByZXR1cm4ga2IgKyBcIiwgXCIgKyBmYWN0ICsgXCI9XCIgKyB2YWx1ZTtcbiAgICB9XG59XG5cbmV4cG9ydCBjbGFzcyBGYWN0S0IgZXh0ZW5kcyBIYXNoRGljdCB7XG4gICAgLypcbiAgICBBIHNpbXBsZSBwcm9wb3NpdGlvbmFsIGtub3dsZWRnZSBiYXNlIHJlbHlpbmcgb24gY29tcGlsZWQgaW5mZXJlbmNlIHJ1bGVzLlxuICAgICovXG5cbiAgICBydWxlcztcblxuICAgIGNvbnN0cnVjdG9yKHJ1bGVzOiBhbnkpIHtcbiAgICAgICAgc3VwZXIoKTtcbiAgICAgICAgdGhpcy5ydWxlcyA9IHJ1bGVzO1xuICAgIH1cblxuICAgIF90ZWxsKGs6IGFueSwgdjogYW55KSB7XG4gICAgICAgIC8qIEFkZCBmYWN0IGs9diB0byB0aGUga25vd2xlZGdlIGJhc2UuXG4gICAgICAgIFJldHVybnMgVHJ1ZSBpZiB0aGUgS0IgaGFzIGFjdHVhbGx5IGJlZW4gdXBkYXRlZCwgRmFsc2Ugb3RoZXJ3aXNlLlxuICAgICAgICAqL1xuICAgICAgICBpZiAoayBpbiB0aGlzLmRpY3QgJiYgdHlwZW9mIHRoaXMuZ2V0KGspICE9PSBcInVuZGVmaW5lZFwiKSB7XG4gICAgICAgICAgICBpZiAodGhpcy5nZXQoaykgPT09IHYpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHRocm93IG5ldyBJbmNvbnNpc3RlbnRBc3N1bXB0aW9ucyh0aGlzLCBrLCB2KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMuYWRkKGssIHYpO1xuICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvLyAvLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXG4gICAgLy8qIFRoaXMgaXMgdGhlIHdvcmtob3JzZSwgc28ga2VlcCBpdCAqZmFzdCouIC8vXG4gICAgLy8gLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xuXG4gICAgZGVkdWNlX2FsbF9mYWN0cyhmYWN0czogYW55KSB7XG4gICAgICAgIC8qXG4gICAgICAgIFVwZGF0ZSB0aGUgS0Igd2l0aCBhbGwgdGhlIGltcGxpY2F0aW9ucyBvZiBhIGxpc3Qgb2YgZmFjdHMuXG4gICAgICAgIEZhY3RzIG11c3QgYmUgYW4gYXJyYXkgb2YgaW1wbGljYXRpb25zIChmYWN0LCBmYWN0X3ZhbHVlKVxuICAgICAgICAqL1xuICAgICAgICAvLyBrZWVwIGZyZXF1ZW50bHkgdXNlZCBhdHRyaWJ1dGVzIGxvY2FsbHksIHNvIHdlJ2xsIGF2b2lkIGV4dHJhXG4gICAgICAgIC8vIGF0dHJpYnV0ZSBhY2Nlc3Mgb3ZlcmhlYWRcblxuICAgICAgICBjb25zdCBmdWxsX2ltcGxpY2F0aW9uczogU2V0RGVmYXVsdERpY3QgPSB0aGlzLnJ1bGVzLmZ1bGxfaW1wbGljYXRpb25zO1xuICAgICAgICBjb25zdCBiZXRhX3RyaWdnZXJzOiBBcnJEZWZhdWx0RGljdCA9IHRoaXMucnVsZXMuYmV0YV90cmlnZ2VycztcbiAgICAgICAgY29uc3QgYmV0YV9ydWxlczogYW55W10gPSB0aGlzLnJ1bGVzLmJldGFfcnVsZXM7XG5cbiAgICAgICAgaWYgKGZhY3RzIGluc3RhbmNlb2YgSGFzaERpY3QgfHwgZmFjdHMgaW5zdGFuY2VvZiBTdGRGYWN0S0IpIHtcbiAgICAgICAgICAgIGZhY3RzID0gZmFjdHMuZW50cmllcygpO1xuICAgICAgICB9XG5cbiAgICAgICAgd2hpbGUgKGZhY3RzLmxlbmd0aCAhPSAwKSB7XG4gICAgICAgICAgICBjb25zdCBiZXRhX21heXRyaWdnZXIgPSBuZXcgSGFzaFNldCgpO1xuXG4gICAgICAgICAgICAvLyAtLS0gYWxwaGEgY2hhaW5zIC0tLVxuICAgICAgICAgICAgZm9yIChjb25zdCBpdGVtIG9mIGZhY3RzKSB7XG4gICAgICAgICAgICAgICAgY29uc3QgayA9IGl0ZW1bMF07XG4gICAgICAgICAgICAgICAgY29uc3QgdiA9IGl0ZW1bMV07XG5cbiAgICAgICAgICAgICAgICBpZiAoIXRoaXMuX3RlbGwoaywgdikgfHwgKHR5cGVvZiB2ID09PSBcInVuZGVmaW5lZFwiKSkge1xuICAgICAgICAgICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAvLyBsb29rdXAgcm91dGluZyB0YWJsZXNcbiAgICAgICAgICAgICAgICBjb25zdCBhcnIgPSBmdWxsX2ltcGxpY2F0aW9ucy5nZXQobmV3IEltcGxpY2F0aW9uKGssIHYpKS50b0FycmF5KCk7XG4gICAgICAgICAgICAgICAgZm9yIChjb25zdCBpdGVtIG9mIGFycikge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLl90ZWxsKGl0ZW0ucCwgaXRlbS5xKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgY29uc3QgY3VycmltcCA9IGJldGFfdHJpZ2dlcnMuZ2V0KG5ldyBJbXBsaWNhdGlvbihrLCB2KSk7XG4gICAgICAgICAgICAgICAgaWYgKCEoY3VycmltcC5sZW5ndGggPT0gMCkpIHtcbiAgICAgICAgICAgICAgICAgICAgYmV0YV9tYXl0cmlnZ2VyLmFkZEFycihjdXJyaW1wKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICAvLyAtLS0gYmV0YSBjaGFpbnMgLS0tXG4gICAgICAgICAgICBmYWN0cyA9IFtdO1xuICAgICAgICAgICAgZm9yIChjb25zdCBiaWR4IG9mIGJldGFfbWF5dHJpZ2dlci50b0FycmF5KCkpIHtcbiAgICAgICAgICAgICAgICBjb25zdCB7cDogYmNvbmQsIHE6IGJpbXBsfSA9IGJldGFfcnVsZXNbYmlkeF07XG4gICAgICAgICAgICAgICAgaWYgKGJjb25kLnRvQXJyYXkoKS5ldmVyeSgoaW1wOiBhbnkpID0+IHRoaXMuZ2V0KGltcC5wKSA9PSBpbXAucSkpIHtcbiAgICAgICAgICAgICAgICAgICAgZmFjdHMucHVzaChbYmltcGwucCwgYmltcGwucV0pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cbn1cbiIsICIvKiBUaGUgY29yZSdzIGNvcmUuICovXG5cbi8qXG5Ob3RhYmxlIGNoYW5nZXMgbWFkZSAoV0IgYW5kIEdNKVxuLSBSZXBsYWNlZCBhcnJheSBvZiBjbGFzc2VzIHdpdGggZGljdGlvbmFyeSBmb3IgcXVpY2tlciBpbmRleCByZXRyaWV2YWxzXG4tIEltcGxlbWVudGVkIGEgY29uc3RydWN0b3Igc3lzdGVtIGZvciBiYXNpY21ldGEgcmF0aGVyIHRoYW4gX19uZXdfX1xuKi9cblxuXG5pbXBvcnQge0hhc2hTZXR9IGZyb20gXCIuL3V0aWxpdHlcIjtcblxuLy8gdXNlZCBmb3IgY2Fub25pY2FsIG9yZGVyaW5nIG9mIHN5bWJvbGljIHNlcXVlbmNlc1xuLy8gdmlhIF9fY21wX18gbWV0aG9kOlxuLy8gRklYTUUgdGhpcyBpcyAqc28qIGlycmVsZXZhbnQgYW5kIG91dGRhdGVkIVxuXG5jb25zdCBvcmRlcmluZ19vZl9jbGFzc2VzOiBSZWNvcmQ8YW55LCBhbnk+ID0ge1xuICAgIC8vIHNpbmdsZXRvbiBudW1iZXJzXG4gICAgWmVybzogMCwgT25lOiAxLCBIYWxmOiAyLCBJbmZpbml0eTogMywgTmFOOiA0LCBOZWdhdGl2ZU9uZTogNSwgTmVnYXRpdmVJbmZpbml0eTogNixcbiAgICAvLyBudW1iZXJzXG4gICAgSW50ZWdlcjogNywgUmF0aW9uYWw6IDgsIEZsb2F0OiA5LFxuICAgIC8vIHNpbmdsZXRvbiBudW1iZXJzXG4gICAgRXhwMTogMTAsIFBpOiAxMSwgSW1hZ2luYXJ5VW5pdDogMTIsXG4gICAgLy8gc3ltYm9sc1xuICAgIFN5bWJvbDogMTMsIFdpbGQ6IDE0LCBUZW1wb3Jhcnk6IDE1LFxuICAgIC8vIGFyaXRobWV0aWMgb3BlcmF0aW9uc1xuICAgIFBvdzogMTYsIE11bDogMTcsIEFkZDogMTgsXG4gICAgLy8gZnVuY3Rpb24gdmFsdWVzXG4gICAgRGVyaXZhdGl2ZTogMTksIEludGVncmFsOiAyMCxcbiAgICAvLyBkZWZpbmVkIHNpbmdsZXRvbiBmdW5jdGlvbnNcbiAgICBBYnM6IDIxLCBTaWduOiAyMiwgU3FydDogMjMsIEZsb29yOiAyNCwgQ2VpbGluZzogMjUsIFJlOiAyNiwgSW06IDI3LFxuICAgIEFyZzogMjgsIENvbmp1Z2F0ZTogMjksIEV4cDogMzAsIExvZzogMzEsIFNpbjogMzIsIENvczogMzMsIFRhbjogMzQsXG4gICAgQ290OiAzNSwgQVNpbjogMzYsIEFDb3M6IDM3LCBBVGFuOiAzOCwgQUNvdDogMzksIFNpbmg6IDQwLCBDb3NoOiA0MSxcbiAgICBUYW5oOiA0MiwgQVNpbmg6IDQzLCBBQ29zaDogNDQsIEFUYW5oOiA0NSwgQUNvdGg6IDQ2LFxuICAgIFJpc2luZ0ZhY3RvcmlhbDogNDcsIEZhbGxpbmdGYWN0b3JpYWw6IDQ4LCBmYWN0b3JpYWw6IDQ5LCBiaW5vbWlhbDogNTAsXG4gICAgR2FtbWE6IDUxLCBMb3dlckdhbW1hOiA1MiwgVXBwZXJHYW1hOiA1MywgUG9seUdhbW1hOiA1NCwgRXJmOiA1NSxcbiAgICAvLyBzcGVjaWFsIHBvbHlub21pYWxzXG4gICAgQ2hlYnlzaGV2OiA1NiwgQ2hlYnlzaGV2MjogNTcsXG4gICAgLy8gdW5kZWZpbmVkIGZ1bmN0aW9uc1xuICAgIEZ1bmN0aW9uOiA1OCwgV2lsZEZ1bmN0aW9uOiA1OSxcbiAgICAvLyBhbm9ueW1vdXMgZnVuY3Rpb25zXG4gICAgTGFtYmRhOiA2MCxcbiAgICAvLyBMYW5kYXUgTyBzeW1ib2xcbiAgICBPcmRlcjogNjEsXG4gICAgLy8gcmVsYXRpb25hbCBvcGVyYXRpb25zXG4gICAgRXF1YWxsaXR5OiA2MiwgVW5lcXVhbGl0eTogNjMsIFN0cmljdEdyZWF0ZXJUaGFuOiA2NCwgU3RyaWN0TGVzc1RoYW46IDY1LFxuICAgIEdyZWF0ZXJUaGFuOiA2NiwgTGVzc1RoYW46IDY2LFxufTtcblxuXG5jbGFzcyBSZWdpc3RyeSB7XG4gICAgLypcbiAgICBCYXNlIGNsYXNzIGZvciByZWdpc3RyeSBvYmplY3RzLlxuXG4gICAgUmVnaXN0cmllcyBtYXAgYSBuYW1lIHRvIGFuIG9iamVjdCB1c2luZyBhdHRyaWJ1dGUgbm90YXRpb24uIFJlZ2lzdHJ5XG4gICAgY2xhc3NlcyBiZWhhdmUgc2luZ2xldG9uaWNhbGx5OiBhbGwgdGhlaXIgaW5zdGFuY2VzIHNoYXJlIHRoZSBzYW1lIHN0YXRlLFxuICAgIHdoaWNoIGlzIHN0b3JlZCBpbiB0aGUgY2xhc3Mgb2JqZWN0LlxuXG4gICAgQWxsIHN1YmNsYXNzZXMgc2hvdWxkIHNldCBgX19zbG90c19fID0gKClgLlxuICAgICovXG5cbiAgICBzdGF0aWMgZGljdDogUmVjb3JkPGFueSwgYW55PjtcblxuICAgIGFkZEF0dHIobmFtZTogYW55LCBvYmo6IGFueSkge1xuICAgICAgICBSZWdpc3RyeS5kaWN0W25hbWVdID0gb2JqO1xuICAgIH1cblxuICAgIGRlbEF0dHIobmFtZTogYW55KSB7XG4gICAgICAgIGRlbGV0ZSBSZWdpc3RyeS5kaWN0W25hbWVdO1xuICAgIH1cbn1cblxuLy8gQSBzZXQgY29udGFpbmluZyBhbGwgU3ltUHkgY2xhc3Mgb2JqZWN0c1xuY29uc3QgYWxsX2NsYXNzZXMgPSBuZXcgSGFzaFNldCgpO1xuXG5jbGFzcyBCYXNpY01ldGEge1xuICAgIF9fc3ltcHlfXzogYW55O1xuXG4gICAgc3RhdGljIHJlZ2lzdGVyKGNsczogYW55KSB7XG4gICAgICAgIGFsbF9jbGFzc2VzLmFkZChjbHMpO1xuICAgICAgICBjbHMuX19zeW1weV9fID0gdHJ1ZTtcbiAgICB9XG5cbiAgICBzdGF0aWMgY29tcGFyZShzZWxmOiBhbnksIG90aGVyOiBhbnkpIHtcbiAgICAgICAgLy8gSWYgdGhlIG90aGVyIG9iamVjdCBpcyBub3QgYSBCYXNpYyBzdWJjbGFzcywgdGhlbiB3ZSBhcmUgbm90IGVxdWFsIHRvXG4gICAgICAgIC8vIGl0LlxuICAgICAgICBpZiAoIShvdGhlciBpbnN0YW5jZW9mIEJhc2ljTWV0YSkpIHtcbiAgICAgICAgICAgIHJldHVybiAtMTtcbiAgICAgICAgfVxuICAgICAgICBjb25zdCBuMSA9IHNlbGYuY29uc3RydWN0b3IubmFtZTtcbiAgICAgICAgY29uc3QgbjIgPSBvdGhlci5jb25zdHJ1Y3Rvci5uYW1lO1xuICAgICAgICAvLyBjaGVjayBpZiBib3RoIGFyZSBpbiB0aGUgY2xhc3NlcyBkaWN0aW9uYXJ5XG4gICAgICAgIGlmIChvcmRlcmluZ19vZl9jbGFzc2VzLmhhcyhuMSkgJiYgb3JkZXJpbmdfb2ZfY2xhc3Nlcy5oYXMobjIpKSB7XG4gICAgICAgICAgICBjb25zdCBpZHgxID0gb3JkZXJpbmdfb2ZfY2xhc3Nlc1tuMV07XG4gICAgICAgICAgICBjb25zdCBpZHgyID0gb3JkZXJpbmdfb2ZfY2xhc3Nlc1tuMl07XG4gICAgICAgICAgICAvLyB0aGUgY2xhc3Mgd2l0aCB0aGUgbGFyZ2VyIGluZGV4IGlzIGdyZWF0ZXJcbiAgICAgICAgICAgIHJldHVybiBNYXRoLnNpZ24oaWR4MSAtIGlkeDIpO1xuICAgICAgICB9XG4gICAgICAgIGlmIChuMSA+IG4yKSB7XG4gICAgICAgICAgICByZXR1cm4gMTtcbiAgICAgICAgfSBlbHNlIGlmIChuMSA9PT0gbjIpIHtcbiAgICAgICAgICAgIHJldHVybiAwO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiAtMTtcbiAgICB9XG5cbiAgICBsZXNzVGhhbihvdGhlcjogYW55KSB7XG4gICAgICAgIGlmIChCYXNpY01ldGEuY29tcGFyZShzZWxmLCBvdGhlcikgPT09IC0xKSB7XG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuXG4gICAgZ3JlYXRlclRoYW4ob3RoZXI6IGFueSkge1xuICAgICAgICBpZiAoQmFzaWNNZXRhLmNvbXBhcmUoc2VsZiwgb3RoZXIpID09PSAxKSB7XG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxufVxuXG5cbmV4cG9ydCB7QmFzaWNNZXRhLCBSZWdpc3RyeX07XG5cbiIsICIvKlxuTm90YWJsZSBjaGFuZ2VzIG1hZGUgKGFuZCBub3Rlcyk6XG4tIE1hbmFnZWRQcm9wZXJ0aWVzIHJld29ya2VkIGFzIG5vcm1hbCBjbGFzcyAtIGVhY2ggY2xhc3MgaXMgcmVnaXN0ZXJlZCBkaXJlY3RseVxuICBhZnRlciBkZWZpbmVkXG4tIE1hbmFnZWRQcm9wZXJ0aWVzIGxvb3BzIHRocm91Z2ggc3VwZXJjbGFzc2VzIHRvIGFzc2lnbiBzdGF0aWMgcHJvcGVydGllcyB0aGF0XG4gIGFyZW4ndCBpbmhlcml0ZWQgKHRoYW5rcyBUeXBlU2NyaXB0KVxuLSBHZXRpdCBhY3RzIGFzIGEgbGFtYmRhLCBzbyBwcm9wZXJ0aWVzIGFyZSBub3cgYWNjZXNzZWQgd2l0aCBmdW5jdGlvbiBub3RhdGlvblxuICBpLmUuLCBteW9iamVjdC5pc19wcm9wZXJ0eSgpXG4qL1xuXG5pbXBvcnQge0ZhY3RLQiwgRmFjdFJ1bGVzfSBmcm9tIFwiLi9mYWN0c1wiO1xuaW1wb3J0IHtCYXNpY01ldGF9IGZyb20gXCIuL2NvcmVcIjtcbmltcG9ydCB7SGFzaERpY3QsIEhhc2hTZXQsIEltcGxpY2F0aW9uLCBVdGlsfSBmcm9tIFwiLi91dGlsaXR5XCI7XG5cblxuY29uc3QgX2Fzc3VtZV9ydWxlcyA9IG5ldyBGYWN0UnVsZXMoW1xuICAgIFwiaW50ZWdlciAtPiByYXRpb25hbFwiLFxuICAgIFwicmF0aW9uYWwgLT4gcmVhbFwiLFxuICAgIFwicmF0aW9uYWwgLT4gYWxnZWJyYWljXCIsXG4gICAgXCJhbGdlYnJhaWMgLT4gY29tcGxleFwiLFxuICAgIFwidHJhbnNjZW5kZW50YWwgPT0gY29tcGxleCAmICFhbGdlYnJhaWNcIixcbiAgICBcInJlYWwgLT4gaGVybWl0aWFuXCIsXG4gICAgXCJpbWFnaW5hcnkgLT4gY29tcGxleFwiLFxuICAgIFwiaW1hZ2luYXJ5IC0+IGFudGloZXJtaXRpYW5cIixcbiAgICBcImV4dGVuZGVkX3JlYWwgLT4gY29tbXV0YXRpdmVcIixcbiAgICBcImNvbXBsZXggLT4gY29tbXV0YXRpdmVcIixcbiAgICBcImNvbXBsZXggLT4gZmluaXRlXCIsXG5cbiAgICBcIm9kZCA9PSBpbnRlZ2VyICYgIWV2ZW5cIixcbiAgICBcImV2ZW4gPT0gaW50ZWdlciAmICFvZGRcIixcblxuICAgIFwicmVhbCAtPiBjb21wbGV4XCIsXG4gICAgXCJleHRlbmRlZF9yZWFsIC0+IHJlYWwgfCBpbmZpbml0ZVwiLFxuICAgIFwicmVhbCA9PSBleHRlbmRlZF9yZWFsICYgZmluaXRlXCIsXG5cbiAgICBcImV4dGVuZGVkX3JlYWwgPT0gZXh0ZW5kZWRfbmVnYXRpdmUgfCB6ZXJvIHwgZXh0ZW5kZWRfcG9zaXRpdmVcIixcbiAgICBcImV4dGVuZGVkX25lZ2F0aXZlID09IGV4dGVuZGVkX25vbnBvc2l0aXZlICYgZXh0ZW5kZWRfbm9uemVyb1wiLFxuICAgIFwiZXh0ZW5kZWRfcG9zaXRpdmUgPT0gZXh0ZW5kZWRfbm9ubmVnYXRpdmUgJiBleHRlbmRlZF9ub256ZXJvXCIsXG5cbiAgICBcImV4dGVuZGVkX25vbnBvc2l0aXZlID09IGV4dGVuZGVkX3JlYWwgJiAhZXh0ZW5kZWRfcG9zaXRpdmVcIixcbiAgICBcImV4dGVuZGVkX25vbm5lZ2F0aXZlID09IGV4dGVuZGVkX3JlYWwgJiAhZXh0ZW5kZWRfbmVnYXRpdmVcIixcblxuICAgIFwicmVhbCA9PSBuZWdhdGl2ZSB8IHplcm8gfCBwb3NpdGl2ZVwiLFxuICAgIFwibmVnYXRpdmUgPT0gbm9ucG9zaXRpdmUgJiBub256ZXJvXCIsXG4gICAgXCJwb3NpdGl2ZSA9PSBub25uZWdhdGl2ZSAmIG5vbnplcm9cIixcblxuICAgIFwibm9ucG9zaXRpdmUgPT0gcmVhbCAmICFwb3NpdGl2ZVwiLFxuICAgIFwibm9ubmVnYXRpdmUgPT0gcmVhbCAmICFuZWdhdGl2ZVwiLFxuXG4gICAgXCJwb3NpdGl2ZSA9PSBleHRlbmRlZF9wb3NpdGl2ZSAmIGZpbml0ZVwiLFxuICAgIFwibmVnYXRpdmUgPT0gZXh0ZW5kZWRfbmVnYXRpdmUgJiBmaW5pdGVcIixcbiAgICBcIm5vbnBvc2l0aXZlID09IGV4dGVuZGVkX25vbnBvc2l0aXZlICYgZmluaXRlXCIsXG4gICAgXCJub25uZWdhdGl2ZSA9PSBleHRlbmRlZF9ub25uZWdhdGl2ZSAmIGZpbml0ZVwiLFxuICAgIFwibm9uemVybyA9PSBleHRlbmRlZF9ub256ZXJvICYgZmluaXRlXCIsXG5cbiAgICBcInplcm8gLT4gZXZlbiAmIGZpbml0ZVwiLFxuICAgIFwiemVybyA9PSBleHRlbmRlZF9ub25uZWdhdGl2ZSAmIGV4dGVuZGVkX25vbnBvc2l0aXZlXCIsXG4gICAgXCJ6ZXJvID09IG5vbm5lZ2F0aXZlICYgbm9ucG9zaXRpdmVcIixcbiAgICBcIm5vbnplcm8gLT4gcmVhbFwiLFxuXG4gICAgXCJwcmltZSAtPiBpbnRlZ2VyICYgcG9zaXRpdmVcIixcbiAgICBcImNvbXBvc2l0ZSAtPiBpbnRlZ2VyICYgcG9zaXRpdmUgJiAhcHJpbWVcIixcbiAgICBcIiFjb21wb3NpdGUgLT4gIXBvc2l0aXZlIHwgIWV2ZW4gfCBwcmltZVwiLFxuXG4gICAgXCJpcnJhdGlvbmFsID09IHJlYWwgJiAhcmF0aW9uYWxcIixcblxuICAgIFwiaW1hZ2luYXJ5IC0+ICFleHRlbmRlZF9yZWFsXCIsXG5cbiAgICBcImluZmluaXRlID09ICFmaW5pdGVcIixcbiAgICBcIm5vbmludGVnZXIgPT0gZXh0ZW5kZWRfcmVhbCAmICFpbnRlZ2VyXCIsXG4gICAgXCJleHRlbmRlZF9ub256ZXJvID09IGV4dGVuZGVkX3JlYWwgJiAhemVyb1wiLFxuXSk7XG5cblxuZXhwb3J0IGNvbnN0IF9hc3N1bWVfZGVmaW5lZCA9IF9hc3N1bWVfcnVsZXMuZGVmaW5lZF9mYWN0cy5jbG9uZSgpO1xuXG5jbGFzcyBTdGRGYWN0S0IgZXh0ZW5kcyBGYWN0S0Ige1xuICAgIC8qIEEgRmFjdEtCIHNwZWNpYWxpemVkIGZvciB0aGUgYnVpbHQtaW4gcnVsZXNcbiAgICBUaGlzIGlzIHRoZSBvbmx5IGtpbmQgb2YgRmFjdEtCIHRoYXQgQmFzaWMgb2JqZWN0cyBzaG91bGQgdXNlLlxuICAgICovXG5cbiAgICBfZ2VuZXJhdG9yO1xuXG4gICAgY29uc3RydWN0b3IoZmFjdHM6IGFueSA9IHVuZGVmaW5lZCkge1xuICAgICAgICBzdXBlcihfYXNzdW1lX3J1bGVzKTtcbiAgICAgICAgLy8gc2F2ZSBhIGNvcHkgb2YgZmFjdHMgZGljdFxuICAgICAgICBpZiAodHlwZW9mIGZhY3RzID09PSBcInVuZGVmaW5lZFwiKSB7XG4gICAgICAgICAgICB0aGlzLl9nZW5lcmF0b3IgPSB7fTtcbiAgICAgICAgfSBlbHNlIGlmICghKGZhY3RzIGluc3RhbmNlb2YgRmFjdEtCKSkge1xuICAgICAgICAgICAgdGhpcy5fZ2VuZXJhdG9yID0gZmFjdHMuY29weSgpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5fZ2VuZXJhdG9yID0gKGZhY3RzIGFzIGFueSkuZ2VuZXJhdG9yOyAvLyAhISFcbiAgICAgICAgfVxuICAgICAgICBpZiAoZmFjdHMpIHtcbiAgICAgICAgICAgIHRoaXMuZGVkdWNlX2FsbF9mYWN0cyhmYWN0cyk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBzdGRjbG9uZSgpIHtcbiAgICAgICAgcmV0dXJuIG5ldyBTdGRGYWN0S0IodGhpcyk7XG4gICAgfVxuXG4gICAgZ2VuZXJhdG9yKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5fZ2VuZXJhdG9yLmNvcHkoKTtcbiAgICB9XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBhc19wcm9wZXJ0eShmYWN0OiBhbnkpIHtcbiAgICByZXR1cm4gXCJpc19cIiArIGZhY3Q7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBtYWtlX3Byb3BlcnR5KG9iajogYW55LCBmYWN0OiBhbnkpIHtcbiAgICAvLyBjaG9vc2luZyB0byBydW4gZ2V0aXQoKSBvbiBtYWtlX3Byb3BlcnR5IHRvIGFkZCBjb25zaXN0ZW5jeSBpbiBhY2Nlc3NpbmdcbiAgICAvLyBwcm9wb2VydGllcyBvZiBzeW10eXBlIG9iamVjdHMuIHRoaXMgbWF5IHNsb3cgZG93biBzeW10eXBlIHNsaWdodGx5XG4gICAgb2JqW2FzX3Byb3BlcnR5KGZhY3QpXSA9IGdldGl0XG4gICAgZnVuY3Rpb24gZ2V0aXQoKSB7XG4gICAgICAgIGlmICh0eXBlb2Ygb2JqLl9hc3N1bXB0aW9uc1tmYWN0XSAhPT0gXCJ1bmRlZmluZWRcIikge1xuICAgICAgICAgICAgcmV0dXJuIG9iai5fYXNzdW1wdGlvbnMuZ2V0KGZhY3QpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuIF9hc2soZmFjdCwgb2JqKTtcbiAgICAgICAgfVxuICAgIH1cbn1cblxuXG4vLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tdW51c2VkLXZhcnNcbmZ1bmN0aW9uIF9hc2soZmFjdDogYW55LCBvYmo6IGFueSkge1xuICAgIC8qXG4gICAgRmluZCB0aGUgdHJ1dGggdmFsdWUgZm9yIGEgcHJvcGVydHkgb2YgYW4gb2JqZWN0LlxuICAgIFRoaXMgZnVuY3Rpb24gaXMgY2FsbGVkIHdoZW4gYSByZXF1ZXN0IGlzIG1hZGUgdG8gc2VlIHdoYXQgYSBmYWN0XG4gICAgdmFsdWUgaXMuXG4gICAgRm9yIHRoaXMgd2UgdXNlIHNldmVyYWwgdGVjaG5pcXVlczpcbiAgICBGaXJzdCwgdGhlIGZhY3QtZXZhbHVhdGlvbiBmdW5jdGlvbiBpcyB0cmllZCwgaWYgaXQgZXhpc3RzIChmb3JcbiAgICBleGFtcGxlIF9ldmFsX2lzX2ludGVnZXIpLiBUaGVuIHdlIHRyeSByZWxhdGVkIGZhY3RzLiBGb3IgZXhhbXBsZVxuICAgICAgICByYXRpb25hbCAgIC0tPiAgIGludGVnZXJcbiAgICBhbm90aGVyIGV4YW1wbGUgaXMgam9pbmVkIHJ1bGU6XG4gICAgICAgIGludGVnZXIgJiAhb2RkICAtLT4gZXZlblxuICAgIHNvIGluIHRoZSBsYXR0ZXIgY2FzZSBpZiB3ZSBhcmUgbG9va2luZyBhdCB3aGF0ICdldmVuJyB2YWx1ZSBpcyxcbiAgICAnaW50ZWdlcicgYW5kICdvZGQnIGZhY3RzIHdpbGwgYmUgYXNrZWQuXG4gICAgSW4gYWxsIGNhc2VzLCB3aGVuIHdlIHNldHRsZSBvbiBzb21lIGZhY3QgdmFsdWUsIGl0cyBpbXBsaWNhdGlvbnMgYXJlXG4gICAgZGVkdWNlZCwgYW5kIHRoZSByZXN1bHQgaXMgY2FjaGVkIGluIC5fYXNzdW1wdGlvbnMuXG4gICAgKi9cblxuICAgIC8vIEZhY3RLQiB3aGljaCBpcyBkaWN0LWxpa2UgYW5kIG1hcHMgZmFjdHMgdG8gdGhlaXIga25vd24gdmFsdWVzOlxuICAgIGNvbnN0IGFzc3VtcHRpb25zOiBTdGRGYWN0S0IgPSBvYmouX2Fzc3VtcHRpb25zO1xuXG4gICAgLy8gQSBkaWN0IHRoYXQgbWFwcyBmYWN0cyB0byB0aGVpciBoYW5kbGVyczpcbiAgICBjb25zdCBoYW5kbGVyX21hcDogSGFzaERpY3QgPSBvYmouX3Byb3BfaGFuZGxlcjtcblxuICAgIC8vIFRoaXMgaXMgb3VyIHF1ZXVlIG9mIGZhY3RzIHRvIGNoZWNrOlxuICAgIGxldCBmYWN0c190b19jaGVjayA9IG5ldyBBcnJheShmYWN0KTtcbiAgICBjb25zdCBmYWN0c19xdWV1ZWQgPSBuZXcgSGFzaFNldChbZmFjdF0pO1xuXG4gICAgY29uc3QgY2xzID0gb2JqLmNvbnN0cnVjdG9yO1xuXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBmYWN0c190b19jaGVjay5sZW5ndGg7IGkrKykge1xuICAgICAgICBjb25zdCBmYWN0X2kgPSBmYWN0c190b19jaGVja1tpXTtcbiAgICAgICAgaWYgKHR5cGVvZiBhc3N1bXB0aW9ucy5nZXQoZmFjdF9pKSAhPT0gXCJ1bmRlZmluZWRcIikge1xuICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgIH0gZWxzZSBpZiAoY2xzW2FzX3Byb3BlcnR5KGZhY3QpXSkge1xuICAgICAgICAgICAgcmV0dXJuIChjbHNbYXNfcHJvcGVydHkoZmFjdCldKTtcbiAgICAgICAgfVxuICAgICAgICBsZXQgZmFjdF9pX3ZhbHVlID0gdW5kZWZpbmVkO1xuICAgICAgICBsZXQgaGFuZGxlcl9pID0gaGFuZGxlcl9tYXAuZ2V0KGZhY3RfaSk7XG4gICAgICAgIGlmICh0eXBlb2YgaGFuZGxlcl9pICE9PSBcInVuZGVmaW5lZFwiKSB7XG4gICAgICAgICAgICBmYWN0X2lfdmFsdWUgPSBvYmpbaGFuZGxlcl9pLm5hbWVdKCk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAodHlwZW9mIGZhY3RfaV92YWx1ZSAhPT0gXCJ1bmRlZmluZWRcIikge1xuICAgICAgICAgICAgYXNzdW1wdGlvbnMuZGVkdWNlX2FsbF9mYWN0cyhbW2ZhY3RfaSwgZmFjdF9pX3ZhbHVlXV0pO1xuICAgICAgICB9XG5cbiAgICAgICAgY29uc3QgZmFjdF92YWx1ZSA9IGFzc3VtcHRpb25zLmdldChmYWN0KTtcbiAgICAgICAgaWYgKHR5cGVvZiBmYWN0X3ZhbHVlICE9PSBcInVuZGVmaW5lZFwiKSB7XG4gICAgICAgICAgICByZXR1cm4gZmFjdF92YWx1ZTtcbiAgICAgICAgfVxuICAgICAgICBjb25zdCBmYWN0c2V0ID0gX2Fzc3VtZV9ydWxlcy5wcmVyZXEuZ2V0KGZhY3RfaSkuZGlmZmVyZW5jZShmYWN0c19xdWV1ZWQpLnRvQXJyYXkoKTtcbiAgICAgICAgaWYgKGZhY3RzZXQuc2l6ZSAhPT0gMCkge1xuICAgICAgICAgICAgVXRpbC5zaHVmZmxlQXJyYXkoZmFjdHNldCk7XG4gICAgICAgICAgICBmYWN0c190b19jaGVjayA9IGZhY3RzX3RvX2NoZWNrLmNvbmNhdChmYWN0c2V0KS5mbGF0KCk7XG4gICAgICAgICAgICBmYWN0c19xdWV1ZWQuYWRkQXJyKGZhY3RzX3RvX2NoZWNrKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgaWYgKGFzc3VtcHRpb25zLmhhcyhmYWN0KSkge1xuICAgICAgICByZXR1cm4gYXNzdW1wdGlvbnMuZ2V0KGZhY3QpO1xuICAgIH1cblxuICAgIGFzc3VtcHRpb25zLl90ZWxsKGZhY3QsIHVuZGVmaW5lZCk7XG4gICAgcmV0dXJuIHVuZGVmaW5lZDtcbn1cblxuXG5jbGFzcyBNYW5hZ2VkUHJvcGVydGllcyB7XG4gICAgc3RhdGljIGFsbF9leHBsaWNpdF9hc3N1bXB0aW9uczogSGFzaERpY3QgPSBuZXcgSGFzaERpY3QoKTtcbiAgICBzdGF0aWMgYWxsX2RlZmF1bHRfYXNzdW1wdGlvbnM6IEhhc2hTZXQgPSBuZXcgSGFzaFNldCgpO1xuXG5cbiAgICBzdGF0aWMgcmVnaXN0ZXIoY2xzOiBhbnkpIHtcbiAgICAgICAgLy8gcmVnaXN0ZXIgd2l0aCBCYXNpY01ldGEgKHJlY29yZCBjbGFzcyBuYW1lKVxuICAgICAgICBCYXNpY01ldGEucmVnaXN0ZXIoY2xzKTtcblxuICAgICAgICAvLyBGb3IgYWxsIHByb3BlcnRpZXMgd2Ugd2FudCB0byBkZWZpbmUsIGRldGVybWluZSBpZiB0aGV5IGFyZSBkZWZpbmVkXG4gICAgICAgIC8vIGJ5IHRoZSBjbGFzcyBvciBpZiB3ZSBzZXQgdGhlbSBhcyB1bmRlZmluZWQuXG4gICAgICAgIC8vIEFkZCB0aGVzZSBwcm9wZXJ0aWVzIHRvIGEgZGljdCBjYWxsZWQgbG9jYWxfZGVmc1xuICAgICAgICBjb25zdCBsb2NhbF9kZWZzID0gbmV3IEhhc2hEaWN0KCk7XG4gICAgICAgIGNvbnN0IGNsc19wcm9wcyA9IE9iamVjdC5nZXRPd25Qcm9wZXJ0eU5hbWVzKGNscyk7XG4gICAgICAgIGZvciAoY29uc3QgayBvZiBfYXNzdW1lX2RlZmluZWQudG9BcnJheSgpKSB7XG4gICAgICAgICAgICBjb25zdCBhdHRybmFtZSA9IGFzX3Byb3BlcnR5KGspO1xuICAgICAgICAgICAgaWYgKGNsc19wcm9wcy5pbmNsdWRlcyhhdHRybmFtZSkpIHtcbiAgICAgICAgICAgICAgICBsZXQgdiA9IGNsc1thdHRybmFtZV07XG4gICAgICAgICAgICAgICAgaWYgKCh0eXBlb2YgdiA9PT0gXCJudW1iZXJcIiAmJiBOdW1iZXIuaXNJbnRlZ2VyKHYpKSB8fCB0eXBlb2YgdiA9PT0gXCJib29sZWFuXCIgfHwgdHlwZW9mIHYgPT09IFwidW5kZWZpbmVkXCIpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHR5cGVvZiB2ICE9PSBcInVuZGVmaW5lZFwiKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB2ID0gISF2O1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGxvY2FsX2RlZnMuYWRkKGssIHYpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IGFsbF9kZWZzID0gbmV3IEhhc2hEaWN0KClcbiAgICAgICAgY29uc3Qgc3VwZXJzID0gVXRpbC5nZXRTdXBlcnMoY2xzKTtcbiAgICAgICAgZm9yIChsZXQgaSA9IHN1cGVycy5sZW5ndGggLSAxOyBpID49IDA7IGktLSkge1xuICAgICAgICAgICAgY29uc3QgYmFzZSA9IHN1cGVyc1tpXTtcbiAgICAgICAgICAgIGNvbnN0IGFzc3VtcHRpb25zID0gYmFzZS5fZXhwbGljaXRfY2xhc3NfYXNzdW1wdGlvbnM7XG4gICAgICAgICAgICBpZiAodHlwZW9mIGFzc3VtcHRpb25zICE9PSBcInVuZGVmaW5lZFwiKSB7XG4gICAgICAgICAgICAgICAgYWxsX2RlZnMubWVyZ2UoYXNzdW1wdGlvbnMpXG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBhbGxfZGVmcy5tZXJnZShsb2NhbF9kZWZzKTtcblxuICAgICAgICAvLyBTZXQgY2xhc3MgcHJvcGVydGllcyBmb3IgYXNzdW1lX2RlZmluZWRcbiAgICAgICAgY2xzLl9leHBsaWNpdF9jbGFzc19hc3N1bXB0aW9ucyA9IGFsbF9kZWZzXG4gICAgICAgIGNscy5kZWZhdWx0X2Fzc3VtcHRpb25zID0gbmV3IFN0ZEZhY3RLQihhbGxfZGVmcyk7XG5cbiAgICAgICAgLy8gQWRkIGRlZmF1bHQgYXNzdW1wdGlvbnMgYXMgY2xhc3MgcHJvcGVydGllc1xuICAgICAgICBmb3IgKGNvbnN0IGl0ZW0gb2YgY2xzLmRlZmF1bHRfYXNzdW1wdGlvbnMuZW50cmllcygpKSB7XG4gICAgICAgICAgICBjbHNbYXNfcHJvcGVydHkoaXRlbVswXSldID0gaXRlbVsxXTtcbiAgICAgICAgfVxuICAgICAgICAvLyBnZXQgdGhlIG1pc2MuIHByb3BlcnRpZXMgb2YgdGhlIHN1cGVyY2xhc3NlcyBhbmQgYXNzaWduIHRvIGNsYXNzXG4gICAgICAgIGZvciAoY29uc3Qgc3VwZXJjbHMgb2YgVXRpbC5nZXRTdXBlcnMoY2xzKSkge1xuICAgICAgICAgICAgY29uc3Qgc3RhdGljRGVmcyA9IG5ldyBIYXNoU2V0KE9iamVjdC5nZXRPd25Qcm9wZXJ0eU5hbWVzKGNscykuZmlsdGVyKFxuICAgICAgICAgICAgICAgIHByb3AgPT4gcHJvcC5pbmNsdWRlcyhcImlzX1wiKSAmJiAhX2Fzc3VtZV9kZWZpbmVkLmhhcyhwcm9wLnJlcGxhY2UoXCJpc19cIiwgXCJcIikpKSk7XG5cbiAgICAgICAgICAgIGNvbnN0IG90aGVyUHJvcHMgPSBuZXcgSGFzaFNldChPYmplY3QuZ2V0T3duUHJvcGVydHlOYW1lcyhzdXBlcmNscykuZmlsdGVyKFxuICAgICAgICAgICAgICAgIHByb3AgPT4gcHJvcC5pbmNsdWRlcyhcImlzX1wiKSAmJiAhX2Fzc3VtZV9kZWZpbmVkLmhhcyhwcm9wLnJlcGxhY2UoXCJpc19cIiwgXCJcIikpKSk7XG5cbiAgICAgICAgICAgIGNvbnN0IHVuaXF1ZVByb3BzID0gb3RoZXJQcm9wcy5kaWZmZXJlbmNlKHN0YXRpY0RlZnMpO1xuICAgICAgICAgICAgZm9yIChjb25zdCBmYWN0IG9mIHVuaXF1ZVByb3BzLnRvQXJyYXkoKSkge1xuICAgICAgICAgICAgICAgIGNsc1tmYWN0XSA9IHN1cGVyY2xzW2ZhY3RdXG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG59XG5cbmV4cG9ydCB7U3RkRmFjdEtCLCBNYW5hZ2VkUHJvcGVydGllc307XG4iLCAiLypcbk5vdGFibGUgY2hhbmdlcyBtYWRlIChhbmQgbm90ZXMpOlxuLSBWZXJ5IGJhcmVib25lcyB2ZXJzaW9ucyBvZiBjbGFzc2VzIGltcGxlbWVudGVkIHNvIGZhclxuLSBTYW1lIHJlZ2lzdHJ5IHN5c3RlbSBhcyBTaW5nbGV0b24gLSB1c2luZyBzdGF0aWMgZGljdGlvbmFyeVxuKi9cblxuLyogZXNsaW50LWRpc2FibGUgbmV3LWNhcCAqL1xuY2xhc3MgS2luZFJlZ2lzdHJ5IHtcbiAgICBzdGF0aWMgcmVnaXN0cnk6IFJlY29yZDxhbnksIGFueT4gPSB7fTtcblxuICAgIHN0YXRpYyByZWdpc3RlcihuYW1lOiBzdHJpbmcsIGNsczogYW55KSB7XG4gICAgICAgIEtpbmRSZWdpc3RyeS5yZWdpc3RyeVtuYW1lXSA9IG5ldyBjbHMoKTtcbiAgICB9XG59XG5cbmNsYXNzIEtpbmQgeyAvLyAhISEgbWV0YWNsYXNzIHNpdHVhdGlvblxuICAgIC8qXG4gICAgQmFzZSBjbGFzcyBmb3Iga2luZHMuXG4gICAgS2luZCBvZiB0aGUgb2JqZWN0IHJlcHJlc2VudHMgdGhlIG1hdGhlbWF0aWNhbCBjbGFzc2lmaWNhdGlvbiB0aGF0XG4gICAgdGhlIGVudGl0eSBmYWxscyBpbnRvLiBJdCBpcyBleHBlY3RlZCB0aGF0IGZ1bmN0aW9ucyBhbmQgY2xhc3Nlc1xuICAgIHJlY29nbml6ZSBhbmQgZmlsdGVyIHRoZSBhcmd1bWVudCBieSBpdHMga2luZC5cbiAgICBLaW5kIG9mIGV2ZXJ5IG9iamVjdCBtdXN0IGJlIGNhcmVmdWxseSBzZWxlY3RlZCBzbyB0aGF0IGl0IHNob3dzIHRoZVxuICAgIGludGVudGlvbiBvZiBkZXNpZ24uIEV4cHJlc3Npb25zIG1heSBoYXZlIGRpZmZlcmVudCBraW5kIGFjY29yZGluZ1xuICAgIHRvIHRoZSBraW5kIG9mIGl0cyBhcmd1ZW1lbnRzLiBGb3IgZXhhbXBsZSwgYXJndWVtZW50cyBvZiBgYEFkZGBgXG4gICAgbXVzdCBoYXZlIGNvbW1vbiBraW5kIHNpbmNlIGFkZGl0aW9uIGlzIGdyb3VwIG9wZXJhdG9yLCBhbmQgdGhlXG4gICAgcmVzdWx0aW5nIGBgQWRkKClgYCBoYXMgdGhlIHNhbWUga2luZC5cbiAgICBGb3IgdGhlIHBlcmZvcm1hbmNlLCBlYWNoIGtpbmQgaXMgYXMgYnJvYWQgYXMgcG9zc2libGUgYW5kIGlzIG5vdFxuICAgIGJhc2VkIG9uIHNldCB0aGVvcnkuIEZvciBleGFtcGxlLCBgYE51bWJlcktpbmRgYCBpbmNsdWRlcyBub3Qgb25seVxuICAgIGNvbXBsZXggbnVtYmVyIGJ1dCBleHByZXNzaW9uIGNvbnRhaW5pbmcgYGBTLkluZmluaXR5YGAgb3IgYGBTLk5hTmBgXG4gICAgd2hpY2ggYXJlIG5vdCBzdHJpY3RseSBudW1iZXIuXG4gICAgS2luZCBtYXkgaGF2ZSBhcmd1bWVudHMgYXMgcGFyYW1ldGVyLiBGb3IgZXhhbXBsZSwgYGBNYXRyaXhLaW5kKClgYFxuICAgIG1heSBiZSBjb25zdHJ1Y3RlZCB3aXRoIG9uZSBlbGVtZW50IHdoaWNoIHJlcHJlc2VudHMgdGhlIGtpbmQgb2YgaXRzXG4gICAgZWxlbWVudHMuXG4gICAgYGBLaW5kYGAgYmVoYXZlcyBpbiBzaW5nbGV0b24tbGlrZSBmYXNoaW9uLiBTYW1lIHNpZ25hdHVyZSB3aWxsXG4gICAgcmV0dXJuIHRoZSBzYW1lIG9iamVjdC5cbiAgICAqL1xuXG4gICAgc3RhdGljIG5ldyhjbHM6IGFueSwgLi4uYXJnczogYW55KSB7XG4gICAgICAgIGxldCBpbnN0O1xuICAgICAgICBpZiAoYXJncyBpbiBLaW5kUmVnaXN0cnkucmVnaXN0cnkpIHtcbiAgICAgICAgICAgIGluc3QgPSBLaW5kUmVnaXN0cnkucmVnaXN0cnlbYXJnc107XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBLaW5kUmVnaXN0cnkucmVnaXN0ZXIoY2xzLm5hbWUsIGNscyk7XG4gICAgICAgICAgICBpbnN0ID0gbmV3IGNscygpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBpbnN0O1xuICAgIH1cbn1cblxuY2xhc3MgX1VuZGVmaW5lZEtpbmQgZXh0ZW5kcyBLaW5kIHtcbiAgICAvKlxuICAgIERlZmF1bHQga2luZCBmb3IgYWxsIFN5bVB5IG9iamVjdC4gSWYgdGhlIGtpbmQgaXMgbm90IGRlZmluZWQgZm9yXG4gICAgdGhlIG9iamVjdCwgb3IgaWYgdGhlIG9iamVjdCBjYW5ub3QgaW5mZXIgdGhlIGtpbmQgZnJvbSBpdHNcbiAgICBhcmd1bWVudHMsIHRoaXMgd2lsbCBiZSByZXR1cm5lZC5cbiAgICBFeGFtcGxlc1xuICAgID09PT09PT09XG4gICAgPj4+IGZyb20gc3ltcHkgaW1wb3J0IEV4cHJcbiAgICA+Pj4gRXhwcigpLmtpbmRcbiAgICBVbmRlZmluZWRLaW5kXG4gICAgKi9cblxuICAgIGNvbnN0cnVjdG9yKCkge1xuICAgICAgICBzdXBlcigpO1xuICAgIH1cblxuICAgIHN0YXRpYyBuZXcoKSB7XG4gICAgICAgIHJldHVybiBLaW5kLm5ldyhfVW5kZWZpbmVkS2luZCk7XG4gICAgfVxuXG4gICAgdG9TdHJpbmcoKSB7XG4gICAgICAgIHJldHVybiBcIlVuZGVmaW5lZEtpbmRcIjtcbiAgICB9XG59XG5cbmNvbnN0IFVuZGVmaW5lZEtpbmQgPSBfVW5kZWZpbmVkS2luZC5uZXcoKTtcblxuY2xhc3MgX051bWJlcktpbmQgZXh0ZW5kcyBLaW5kIHtcbiAgICAvKlxuICAgIEtpbmQgZm9yIGFsbCBudW1lcmljIG9iamVjdC5cbiAgICBUaGlzIGtpbmQgcmVwcmVzZW50cyBldmVyeSBudW1iZXIsIGluY2x1ZGluZyBjb21wbGV4IG51bWJlcnMsXG4gICAgaW5maW5pdHkgYW5kIGBgUy5OYU5gYC4gT3RoZXIgb2JqZWN0cyBzdWNoIGFzIHF1YXRlcm5pb25zIGRvIG5vdFxuICAgIGhhdmUgdGhpcyBraW5kLlxuICAgIE1vc3QgYGBFeHByYGAgYXJlIGluaXRpYWxseSBkZXNpZ25lZCB0byByZXByZXNlbnQgdGhlIG51bWJlciwgc29cbiAgICB0aGlzIHdpbGwgYmUgdGhlIG1vc3QgY29tbW9uIGtpbmQgaW4gU3ltUHkgY29yZS4gRm9yIGV4YW1wbGVcbiAgICBgYFN5bWJvbCgpYGAsIHdoaWNoIHJlcHJlc2VudHMgYSBzY2FsYXIsIGhhcyB0aGlzIGtpbmQgYXMgbG9uZyBhcyBpdFxuICAgIGlzIGNvbW11dGF0aXZlLlxuICAgIE51bWJlcnMgZm9ybSBhIGZpZWxkLiBBbnkgb3BlcmF0aW9uIGJldHdlZW4gbnVtYmVyLWtpbmQgb2JqZWN0cyB3aWxsXG4gICAgcmVzdWx0IHRoaXMga2luZCBhcyB3ZWxsLlxuICAgIEV4YW1wbGVzXG4gICAgPT09PT09PT1cbiAgICA+Pj4gZnJvbSBzeW1weSBpbXBvcnQgUywgb28sIFN5bWJvbFxuICAgID4+PiBTLk9uZS5raW5kXG4gICAgTnVtYmVyS2luZFxuICAgID4+PiAoLW9vKS5raW5kXG4gICAgTnVtYmVyS2luZFxuICAgID4+PiBTLk5hTi5raW5kXG4gICAgTnVtYmVyS2luZFxuICAgIENvbW11dGF0aXZlIHN5bWJvbCBhcmUgdHJlYXRlZCBhcyBudW1iZXIuXG4gICAgPj4+IHggPSBTeW1ib2woJ3gnKVxuICAgID4+PiB4LmtpbmRcbiAgICBOdW1iZXJLaW5kXG4gICAgPj4+IFN5bWJvbCgneScsIGNvbW11dGF0aXZlPUZhbHNlKS5raW5kXG4gICAgVW5kZWZpbmVkS2luZFxuICAgIE9wZXJhdGlvbiBiZXR3ZWVuIG51bWJlcnMgcmVzdWx0cyBudW1iZXIuXG4gICAgPj4+ICh4KzEpLmtpbmRcbiAgICBOdW1iZXJLaW5kXG4gICAgU2VlIEFsc29cbiAgICA9PT09PT09PVxuICAgIHN5bXB5LmNvcmUuZXhwci5FeHByLmlzX051bWJlciA6IGNoZWNrIGlmIHRoZSBvYmplY3QgaXMgc3RyaWN0bHlcbiAgICBzdWJjbGFzcyBvZiBgYE51bWJlcmBgIGNsYXNzLlxuICAgIHN5bXB5LmNvcmUuZXhwci5FeHByLmlzX251bWJlciA6IGNoZWNrIGlmIHRoZSBvYmplY3QgaXMgbnVtYmVyXG4gICAgd2l0aG91dCBhbnkgZnJlZSBzeW1ib2wuXG4gICAgKi9cblxuICAgIGNvbnN0cnVjdG9yKCkge1xuICAgICAgICBzdXBlcigpO1xuICAgIH1cblxuICAgIHN0YXRpYyBuZXcoKSB7XG4gICAgICAgIHJldHVybiBLaW5kLm5ldyhfTnVtYmVyS2luZCk7XG4gICAgfVxuXG4gICAgdG9TdHJpbmcoKSB7XG4gICAgICAgIHJldHVybiBcIk51bWJlcktpbmRcIjtcbiAgICB9XG59XG5cbmNvbnN0IE51bWJlcktpbmQgPSBfTnVtYmVyS2luZC5uZXcoKTtcblxuY2xhc3MgX0Jvb2xlYW5LaW5kIGV4dGVuZHMgS2luZCB7XG4gICAgLypcbiAgICBLaW5kIGZvciBib29sZWFuIG9iamVjdHMuXG4gICAgU3ltUHkncyBgYFMudHJ1ZWBgLCBgYFMuZmFsc2VgYCwgYW5kIGJ1aWx0LWluIGBgVHJ1ZWBgIGFuZCBgYEZhbHNlYGBcbiAgICBoYXZlIHRoaXMga2luZC4gQm9vbGVhbiBudW1iZXIgYGAxYGAgYW5kIGBgMGBgIGFyZSBub3QgcmVsZXZlbnQuXG4gICAgRXhhbXBsZXNcbiAgICA9PT09PT09PVxuICAgID4+PiBmcm9tIHN5bXB5IGltcG9ydCBTLCBRXG4gICAgPj4+IFMudHJ1ZS5raW5kXG4gICAgQm9vbGVhbktpbmRcbiAgICA+Pj4gUS5ldmVuKDMpLmtpbmRcbiAgICBCb29sZWFuS2luZFxuICAgICovXG5cbiAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICAgICAgc3VwZXIoKTtcbiAgICB9XG5cbiAgICBzdGF0aWMgbmV3KCkge1xuICAgICAgICByZXR1cm4gS2luZC5uZXcoX0Jvb2xlYW5LaW5kKTtcbiAgICB9XG5cbiAgICB0b1N0cmluZygpIHtcbiAgICAgICAgcmV0dXJuIFwiQm9vbGVhbktpbmRcIjtcbiAgICB9XG59XG5cbmNvbnN0IEJvb2xlYW5LaW5kID0gX0Jvb2xlYW5LaW5kLm5ldygpO1xuXG5cbmV4cG9ydCB7VW5kZWZpbmVkS2luZCwgTnVtYmVyS2luZCwgQm9vbGVhbktpbmR9O1xuIiwgImNsYXNzIHByZW9yZGVyX3RyYXZlcnNhbCB7XG4gICAgLypcbiAgICBEbyBhIHByZS1vcmRlciB0cmF2ZXJzYWwgb2YgYSB0cmVlLlxuICAgIFRoaXMgaXRlcmF0b3IgcmVjdXJzaXZlbHkgeWllbGRzIG5vZGVzIHRoYXQgaXQgaGFzIHZpc2l0ZWQgaW4gYSBwcmUtb3JkZXJcbiAgICBmYXNoaW9uLiBUaGF0IGlzLCBpdCB5aWVsZHMgdGhlIGN1cnJlbnQgbm9kZSB0aGVuIGRlc2NlbmRzIHRocm91Z2ggdGhlXG4gICAgdHJlZSBicmVhZHRoLWZpcnN0IHRvIHlpZWxkIGFsbCBvZiBhIG5vZGUncyBjaGlsZHJlbidzIHByZS1vcmRlclxuICAgIHRyYXZlcnNhbC5cbiAgICBGb3IgYW4gZXhwcmVzc2lvbiwgdGhlIG9yZGVyIG9mIHRoZSB0cmF2ZXJzYWwgZGVwZW5kcyBvbiB0aGUgb3JkZXIgb2ZcbiAgICAuYXJncywgd2hpY2ggaW4gbWFueSBjYXNlcyBjYW4gYmUgYXJiaXRyYXJ5LlxuICAgIFBhcmFtZXRlcnNcbiAgICA9PT09PT09PT09XG4gICAgbm9kZSA6IFN5bVB5IGV4cHJlc3Npb25cbiAgICAgICAgVGhlIGV4cHJlc3Npb24gdG8gdHJhdmVyc2UuXG4gICAga2V5cyA6IChkZWZhdWx0IE5vbmUpIHNvcnQga2V5KHMpXG4gICAgICAgIFRoZSBrZXkocykgdXNlZCB0byBzb3J0IGFyZ3Mgb2YgQmFzaWMgb2JqZWN0cy4gV2hlbiBOb25lLCBhcmdzIG9mIEJhc2ljXG4gICAgICAgIG9iamVjdHMgYXJlIHByb2Nlc3NlZCBpbiBhcmJpdHJhcnkgb3JkZXIuIElmIGtleSBpcyBkZWZpbmVkLCBpdCB3aWxsXG4gICAgICAgIGJlIHBhc3NlZCBhbG9uZyB0byBvcmRlcmVkKCkgYXMgdGhlIG9ubHkga2V5KHMpIHRvIHVzZSB0byBzb3J0IHRoZVxuICAgICAgICBhcmd1bWVudHM7IGlmIGBga2V5YGAgaXMgc2ltcGx5IFRydWUgdGhlbiB0aGUgZGVmYXVsdCBrZXlzIG9mIG9yZGVyZWRcbiAgICAgICAgd2lsbCBiZSB1c2VkLlxuICAgIFlpZWxkc1xuICAgID09PT09PVxuICAgIHN1YnRyZWUgOiBTeW1QeSBleHByZXNzaW9uXG4gICAgICAgIEFsbCBvZiB0aGUgc3VidHJlZXMgaW4gdGhlIHRyZWUuXG4gICAgRXhhbXBsZXNcbiAgICA9PT09PT09PVxuICAgID4+PiBmcm9tIHN5bXB5IGltcG9ydCBwcmVvcmRlcl90cmF2ZXJzYWwsIHN5bWJvbHNcbiAgICA+Pj4geCwgeSwgeiA9IHN5bWJvbHMoJ3ggeSB6JylcbiAgICBUaGUgbm9kZXMgYXJlIHJldHVybmVkIGluIHRoZSBvcmRlciB0aGF0IHRoZXkgYXJlIGVuY291bnRlcmVkIHVubGVzcyBrZXlcbiAgICBpcyBnaXZlbjsgc2ltcGx5IHBhc3Npbmcga2V5PVRydWUgd2lsbCBndWFyYW50ZWUgdGhhdCB0aGUgdHJhdmVyc2FsIGlzXG4gICAgdW5pcXVlLlxuICAgID4+PiBsaXN0KHByZW9yZGVyX3RyYXZlcnNhbCgoeCArIHkpKnosIGtleXM9Tm9uZSkpICMgZG9jdGVzdDogK1NLSVBcbiAgICBbeiooeCArIHkpLCB6LCB4ICsgeSwgeSwgeF1cbiAgICA+Pj4gbGlzdChwcmVvcmRlcl90cmF2ZXJzYWwoKHggKyB5KSp6LCBrZXlzPVRydWUpKVxuICAgIFt6Kih4ICsgeSksIHosIHggKyB5LCB4LCB5XVxuICAgICovXG5cbiAgICBfc2tpcF9mbGFnOiBhbnk7XG4gICAgX3B0OiBhbnk7XG4gICAgY29uc3RydWN0b3Iobm9kZTogYW55KSB7XG4gICAgICAgIHRoaXMuX3NraXBfZmxhZyA9IGZhbHNlO1xuICAgICAgICB0aGlzLl9wdCA9IHRoaXMuX3ByZW9yZGVyX3RyYXZlcnNhbChub2RlKTtcbiAgICB9XG5cbiAgICAqIF9wcmVvcmRlcl90cmF2ZXJzYWwobm9kZTogYW55KTogYW55IHtcbiAgICAgICAgeWllbGQgbm9kZTtcbiAgICAgICAgaWYgKHRoaXMuX3NraXBfZmxhZykge1xuICAgICAgICAgICAgdGhpcy5fc2tpcF9mbGFnID0gZmFsc2U7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgaWYgKG5vZGUuaW5zdGFuY2VvZkJhc2ljKSB7XG4gICAgICAgICAgICBsZXQgYXJncztcbiAgICAgICAgICAgIGlmIChub2RlLl9hcmdzZXQpIHtcbiAgICAgICAgICAgICAgICBhcmdzID0gbm9kZS5fYXJnc2V0O1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBhcmdzID0gbm9kZS5fYXJncztcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGZvciAoY29uc3QgYXJnIG9mIGFyZ3MpIHtcbiAgICAgICAgICAgICAgICBmb3IgKGNvbnN0IHZhbCBvZiB0aGlzLl9wcmVvcmRlcl90cmF2ZXJzYWwoYXJnKSkge1xuICAgICAgICAgICAgICAgICAgICB5aWVsZCB2YWw7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9IGVsc2UgaWYgKFN5bWJvbC5pdGVyYXRvciBpbiBPYmplY3Qobm9kZSkpIHtcbiAgICAgICAgICAgIGZvciAoY29uc3QgaXRlbSBvZiBub2RlKSB7XG4gICAgICAgICAgICAgICAgZm9yIChjb25zdCB2YWwgb2YgdGhpcy5fcHJlb3JkZXJfdHJhdmVyc2FsKGl0ZW0pKSB7XG4gICAgICAgICAgICAgICAgICAgIHlpZWxkIHZhbDtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBhc0l0ZXIoKSB7XG4gICAgICAgIGNvbnN0IHJlczogYW55W10gPSBbXTtcbiAgICAgICAgZm9yIChjb25zdCBpdGVtIG9mIHRoaXMuX3B0KSB7XG4gICAgICAgICAgICByZXMucHVzaChpdGVtKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gcmVzO1xuICAgIH1cbn1cblxuZXhwb3J0IHtwcmVvcmRlcl90cmF2ZXJzYWx9O1xuIiwgIi8qXG5Ob3RhYmxlIGNoYW5nZXMgbWFkZSAoYW5kIG5vdGVzKTpcbi0gQmFzaWMgcmV3b3JrZWQgd2l0aCBjb25zdHJ1Y3RvciBzeXN0ZW1cbi0gQmFzaWMgaGFuZGxlcyBPQkpFQ1QgcHJvcGVydGllcywgTWFuYWdlZFByb3BlcnRpZXMgaGFuZGxlcyBDTEFTUyBwcm9wZXJ0aWVzXG4tIFNpbmNlIF9ldmFsX2lzX3Byb3BlcnRpZXMgYXJlIG5vdCBzdGF0aWMsIEJhc2ljIGlzIG5vdyBhc3NpZ25lZCB0byBjcmVhdGUgdGhlXG4gIGNsYXNzIHByb3BlcnR5IGhhbmRsZXIgKGFuZCBkb2VzIHNvIG9ubHkgb25jZSBwZXIgb2JqZWN0KVxuLSBTb21lIHByb3BlcnRpZXMgb2YgQmFzaWMgKGFuZCBzdWJjbGFzc2VzKSBhcmUgbm93IHN0YXRpY1xuLSBBc2lkZSBmcm9tIHNldHRpbmcgb2JqZWN0IHByb3BlcnRpZXMgZnJvbSBfYXNzdW1lX2RlZmluZWQsIEJhc2ljIG5vdyBhbHNvXG4gIHNldHMgdGhlIHN0YXRpYyBwcm9wZXJ0aWVzIG9mIHRoZSBjbGFzcyBhcyBwcm9wZXJ0aWVzIGZvciB0aGUgb2JqZWN0XG4qL1xuXG5pbXBvcnQge2FzX3Byb3BlcnR5LCBtYWtlX3Byb3BlcnR5LCBNYW5hZ2VkUHJvcGVydGllcywgX2Fzc3VtZV9kZWZpbmVkLCBTdGRGYWN0S0J9IGZyb20gXCIuL2Fzc3VtcHRpb25zXCI7XG5pbXBvcnQge1V0aWwsIEhhc2hEaWN0LCBtaXgsIGJhc2UsIEhhc2hTZXR9IGZyb20gXCIuL3V0aWxpdHlcIjtcbmltcG9ydCB7VW5kZWZpbmVkS2luZH0gZnJvbSBcIi4va2luZFwiO1xuaW1wb3J0IHtwcmVvcmRlcl90cmF2ZXJzYWx9IGZyb20gXCIuL3RyYXZlcnNhbFwiO1xuXG5cbmNvbnN0IF9CYXNpYyA9IChzdXBlcmNsYXNzOiBhbnkpID0+IGNsYXNzIF9CYXNpYyBleHRlbmRzIHN1cGVyY2xhc3Mge1xuICAgIC8qXG4gICAgQmFzZSBjbGFzcyBmb3IgYWxsIFN5bVB5IG9iamVjdHMuXG4gICAgTm90ZXMgYW5kIGNvbnZlbnRpb25zXG4gICAgPT09PT09PT09PT09PT09PT09PT09XG4gICAgMSkgQWx3YXlzIHVzZSBgYC5hcmdzYGAsIHdoZW4gYWNjZXNzaW5nIHBhcmFtZXRlcnMgb2Ygc29tZSBpbnN0YW5jZTpcbiAgICA+Pj4gZnJvbSBzeW1weSBpbXBvcnQgY290XG4gICAgPj4+IGZyb20gc3ltcHkuYWJjIGltcG9ydCB4LCB5XG4gICAgPj4+IGNvdCh4KS5hcmdzXG4gICAgKHgsKVxuICAgID4+PiBjb3QoeCkuYXJnc1swXVxuICAgIHhcbiAgICA+Pj4gKHgqeSkuYXJnc1xuICAgICh4LCB5KVxuICAgID4+PiAoeCp5KS5hcmdzWzFdXG4gICAgeVxuICAgIDIpIE5ldmVyIHVzZSBpbnRlcm5hbCBtZXRob2RzIG9yIHZhcmlhYmxlcyAodGhlIG9uZXMgcHJlZml4ZWQgd2l0aCBgYF9gYCk6XG4gICAgPj4+IGNvdCh4KS5fYXJncyAgICAjIGRvIG5vdCB1c2UgdGhpcywgdXNlIGNvdCh4KS5hcmdzIGluc3RlYWRcbiAgICAoeCwpXG4gICAgMykgIEJ5IFwiU3ltUHkgb2JqZWN0XCIgd2UgbWVhbiBzb21ldGhpbmcgdGhhdCBjYW4gYmUgcmV0dXJuZWQgYnlcbiAgICAgICAgYGBzeW1waWZ5YGAuICBCdXQgbm90IGFsbCBvYmplY3RzIG9uZSBlbmNvdW50ZXJzIHVzaW5nIFN5bVB5IGFyZVxuICAgICAgICBzdWJjbGFzc2VzIG9mIEJhc2ljLiAgRm9yIGV4YW1wbGUsIG11dGFibGUgb2JqZWN0cyBhcmUgbm90OlxuICAgICAgICA+Pj4gZnJvbSBzeW1weSBpbXBvcnQgQmFzaWMsIE1hdHJpeCwgc3ltcGlmeVxuICAgICAgICA+Pj4gQSA9IE1hdHJpeChbWzEsIDJdLCBbMywgNF1dKS5hc19tdXRhYmxlKClcbiAgICAgICAgPj4+IGlzaW5zdGFuY2UoQSwgQmFzaWMpXG4gICAgICAgIEZhbHNlXG4gICAgICAgID4+PiBCID0gc3ltcGlmeShBKVxuICAgICAgICA+Pj4gaXNpbnN0YW5jZShCLCBCYXNpYylcbiAgICAgICAgVHJ1ZVxuICAgICovXG5cbiAgICBfX3Nsb3RzX18gPSBbXCJfbWhhc2hcIiwgXCJfYXJnc1wiLCBcIl9hc3N1bXB0aW9uc1wiXTtcbiAgICBfYXJnczogYW55W107XG4gICAgX21oYXNoOiBOdW1iZXIgfCB1bmRlZmluZWQ7XG4gICAgX2Fzc3VtcHRpb25zOiBTdGRGYWN0S0I7XG5cbiAgICAvLyBUbyBiZSBvdmVycmlkZGVuIHdpdGggVHJ1ZSBpbiB0aGUgYXBwcm9wcmlhdGUgc3ViY2xhc3Nlc1xuICAgIHN0YXRpYyBpc19udW1iZXIgPSBmYWxzZTtcbiAgICBzdGF0aWMgaXNfQXRvbSA9IGZhbHNlO1xuICAgIHN0YXRpYyBpc19TeW1ib2wgPSBmYWxzZTtcbiAgICBzdGF0aWMgaXNfc3ltYm9sID0gZmFsc2U7XG4gICAgc3RhdGljIGlzX0luZGV4ZWQgPSBmYWxzZTtcbiAgICBzdGF0aWMgaXNfRHVtbXkgPSBmYWxzZTtcbiAgICBzdGF0aWMgaXNfV2lsZCA9IGZhbHNlO1xuICAgIHN0YXRpYyBpc19GdW5jdGlvbiA9IGZhbHNlO1xuICAgIHN0YXRpYyBpc19BZGQgPSBmYWxzZTtcbiAgICBzdGF0aWMgaXNfTXVsID0gZmFsc2U7XG4gICAgc3RhdGljIGlzX1BvdyA9IGZhbHNlO1xuICAgIHN0YXRpYyBpc19OdW1iZXIgPSBmYWxzZTtcbiAgICBzdGF0aWMgaXNfRmxvYXQgPSBmYWxzZTtcbiAgICBzdGF0aWMgaXNfUmF0aW9uYWwgPSBmYWxzZTtcbiAgICBzdGF0aWMgaXNfSW50ZWdlciA9IGZhbHNlO1xuICAgIHN0YXRpYyBpc19OdW1iZXJTeW1ib2wgPSBmYWxzZTtcbiAgICBzdGF0aWMgaXNfT3JkZXIgPSBmYWxzZTtcbiAgICBzdGF0aWMgaXNfRGVyaXZhdGl2ZSA9IGZhbHNlO1xuICAgIHN0YXRpYyBpc19QaWVjZXdpc2UgPSBmYWxzZTtcbiAgICBzdGF0aWMgaXNfUG9seSA9IGZhbHNlO1xuICAgIHN0YXRpYyBpc19BbGdlYnJhaWNOdW1iZXIgPSBmYWxzZTtcbiAgICBzdGF0aWMgaXNfUmVsYXRpb25hbCA9IGZhbHNlO1xuICAgIHN0YXRpYyBpc19FcXVhbGl0eSA9IGZhbHNlO1xuICAgIHN0YXRpYyBpc19Cb29sZWFuID0gZmFsc2U7XG4gICAgc3RhdGljIGlzX05vdCA9IGZhbHNlO1xuICAgIHN0YXRpYyBpc19NYXRyaXggPSBmYWxzZTtcbiAgICBzdGF0aWMgaXNfVmVjdG9yID0gZmFsc2U7XG4gICAgc3RhdGljIGlzX1BvaW50ID0gZmFsc2U7XG4gICAgc3RhdGljIGlzX01hdEFkZCA9IGZhbHNlO1xuICAgIHN0YXRpYyBpc19NYXRNdWwgPSBmYWxzZTtcbiAgICBzdGF0aWMgaXNfbmVnYXRpdmU6IGJvb2xlYW4gfCB1bmRlZmluZWQ7XG4gICAgc3RhdGljIGlzX2NvbW11dGF0aXZlOiBib29sZWFuIHwgdW5kZWZpbmVkO1xuXG4gICAgc3RhdGljIGtpbmQgPSBVbmRlZmluZWRLaW5kO1xuICAgIHN0YXRpYyBhbGxfdW5pcXVlX3Byb3BzOiBIYXNoU2V0ID0gbmV3IEhhc2hTZXQoKTtcblxuICAgIGNvbnN0cnVjdG9yKC4uLmFyZ3M6IGFueSkge1xuICAgICAgICBzdXBlcigpO1xuICAgICAgICBjb25zdCBjbHM6IGFueSA9IHRoaXMuY29uc3RydWN0b3I7XG4gICAgICAgIHRoaXMuX2Fzc3VtcHRpb25zID0gY2xzLmRlZmF1bHRfYXNzdW1wdGlvbnMuc3RkY2xvbmUoKTtcbiAgICAgICAgdGhpcy5fbWhhc2ggPSB1bmRlZmluZWQ7XG4gICAgICAgIHRoaXMuX2FyZ3MgPSBhcmdzO1xuICAgICAgICB0aGlzLmFzc2lnblByb3BzKCk7XG4gICAgfVxuXG4gICAgYXNzaWduUHJvcHMoKSB7XG4gICAgICAgIGNvbnN0IGNsczogYW55ID0gdGhpcy5jb25zdHJ1Y3RvcjtcbiAgICAgICAgLy8gQ3JlYXRlIGEgZGljdGlvbmFyeSB0byBoYW5kbGUgdGhlIGN1cnJlbnQgcHJvcGVydGllcyBvZiB0aGUgY2xhc3NcbiAgICAgICAgLy8gT25seSBldnVhdGVkIG9uY2UgcGVyIGNsYXNzXG4gICAgICAgIGlmICh0eXBlb2YgY2xzLl9wcm9wX2hhbmRsZXIgPT09IFwidW5kZWZpbmVkXCIpIHtcbiAgICAgICAgICAgIGNscy5fcHJvcF9oYW5kbGVyID0gbmV3IEhhc2hEaWN0KCk7XG4gICAgICAgICAgICBmb3IgKGNvbnN0IGsgb2YgX2Fzc3VtZV9kZWZpbmVkLnRvQXJyYXkoKSkge1xuICAgICAgICAgICAgICAgIGNvbnN0IG1ldGgxID0gXCJfZXZhbF9pc19cIiArIGs7XG4gICAgICAgICAgICAgICAgaWYgKHRoaXNbbWV0aDFdKSB7XG4gICAgICAgICAgICAgICAgICAgIGNscy5fcHJvcF9oYW5kbGVyLmFkZChrLCB0aGlzW21ldGgxXSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHRoaXMuX3Byb3BfaGFuZGxlciA9IGNscy5fcHJvcF9oYW5kbGVyLmNvcHkoKTtcbiAgICAgICAgZm9yIChjb25zdCBmYWN0IG9mIF9hc3N1bWVfZGVmaW5lZC50b0FycmF5KCkpIHtcbiAgICAgICAgICAgIG1ha2VfcHJvcGVydHkodGhpcywgZmFjdCk7XG4gICAgICAgIH1cbiAgICAgICAgLy8gQWRkIG1pc2MuIHN0YXRpYyBwcm9wZXJ0aWVzIG9mIGNsYXNzIGFzIG9iamVjdCBwcm9wZXJ0aWVzXG4gICAgICAgIGNvbnN0IG90aGVyUHJvcHMgPSBuZXcgSGFzaFNldChPYmplY3QuZ2V0T3duUHJvcGVydHlOYW1lcyhjbHMpLmZpbHRlcihcbiAgICAgICAgICAgIHByb3AgPT4gcHJvcC5pbmNsdWRlcyhcImlzX1wiKSAmJiAhX2Fzc3VtZV9kZWZpbmVkLmhhcyhwcm9wLnJlcGxhY2UoXCJpc19cIiwgXCJcIikpKSk7XG4gICAgICAgIGZvciAoY29uc3QgbWlzY3Byb3Agb2Ygb3RoZXJQcm9wcy50b0FycmF5KCkpIHtcbiAgICAgICAgICAgIHRoaXNbbWlzY3Byb3BdID0gKCkgPT4gY2xzW21pc2Nwcm9wXTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIF9fZ2V0bmV3YXJnc19fKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5fYXJncztcbiAgICB9XG5cbiAgICBfX2dldHN0YXRlX18oKTogYW55IHtcbiAgICAgICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgICB9XG5cbiAgICBoYXNoKCkge1xuICAgICAgICBpZiAodHlwZW9mIHRoaXMuX21oYXNoID09PSBcInVuZGVmaW5lZFwiKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5jb25zdHJ1Y3Rvci5uYW1lICsgdGhpcy5oYXNoS2V5KCk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRoaXMuX21oYXNoO1xuICAgIH1cblxuICAgIC8vIGJhbmRhaWQgc29sdXRpb24gZm9yIGluc3RhbmNlb2YgaXNzdWUgLSBzdGlsbCBuZWVkIHRvIGZpeFxuICAgIGluc3RhbmNlb2ZCYXNpYygpIHtcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuXG4gICAgYXNzdW1wdGlvbnMwKCkge1xuICAgICAgICAvKlxuICAgICAgICBSZXR1cm4gb2JqZWN0IGB0eXBlYCBhc3N1bXB0aW9ucy5cbiAgICAgICAgRm9yIGV4YW1wbGU6XG4gICAgICAgICAgU3ltYm9sKCd4JywgcmVhbD1UcnVlKVxuICAgICAgICAgIFN5bWJvbCgneCcsIGludGVnZXI9VHJ1ZSlcbiAgICAgICAgYXJlIGRpZmZlcmVudCBvYmplY3RzLiBJbiBvdGhlciB3b3JkcywgYmVzaWRlcyBQeXRob24gdHlwZSAoU3ltYm9sIGluXG4gICAgICAgIHRoaXMgY2FzZSksIHRoZSBpbml0aWFsIGFzc3VtcHRpb25zIGFyZSBhbHNvIGZvcm1pbmcgdGhlaXIgdHlwZWluZm8uXG4gICAgICAgIEV4YW1wbGVzXG4gICAgICAgID09PT09PT09XG4gICAgICAgID4+PiBmcm9tIHN5bXB5IGltcG9ydCBTeW1ib2xcbiAgICAgICAgPj4+IGZyb20gc3ltcHkuYWJjIGltcG9ydCB4XG4gICAgICAgID4+PiB4LmFzc3VtcHRpb25zMFxuICAgICAgICB7J2NvbW11dGF0aXZlJzogVHJ1ZX1cbiAgICAgICAgPj4+IHggPSBTeW1ib2woXCJ4XCIsIHBvc2l0aXZlPVRydWUpXG4gICAgICAgID4+PiB4LmFzc3VtcHRpb25zMFxuICAgICAgICB7J2NvbW11dGF0aXZlJzogVHJ1ZSwgJ2NvbXBsZXgnOiBUcnVlLCAnZXh0ZW5kZWRfbmVnYXRpdmUnOiBGYWxzZSxcbiAgICAgICAgICdleHRlbmRlZF9ub25uZWdhdGl2ZSc6IFRydWUsICdleHRlbmRlZF9ub25wb3NpdGl2ZSc6IEZhbHNlLFxuICAgICAgICAgJ2V4dGVuZGVkX25vbnplcm8nOiBUcnVlLCAnZXh0ZW5kZWRfcG9zaXRpdmUnOiBUcnVlLCAnZXh0ZW5kZWRfcmVhbCc6XG4gICAgICAgICBUcnVlLCAnZmluaXRlJzogVHJ1ZSwgJ2hlcm1pdGlhbic6IFRydWUsICdpbWFnaW5hcnknOiBGYWxzZSxcbiAgICAgICAgICdpbmZpbml0ZSc6IEZhbHNlLCAnbmVnYXRpdmUnOiBGYWxzZSwgJ25vbm5lZ2F0aXZlJzogVHJ1ZSxcbiAgICAgICAgICdub25wb3NpdGl2ZSc6IEZhbHNlLCAnbm9uemVybyc6IFRydWUsICdwb3NpdGl2ZSc6IFRydWUsICdyZWFsJzpcbiAgICAgICAgIFRydWUsICd6ZXJvJzogRmFsc2V9XG4gICAgICAgICovXG4gICAgICAgIHJldHVybiB7fTtcbiAgICB9XG5cbiAgICBoYXNoS2V5KCkge1xuICAgICAgICAvKiBSZXR1cm4gYSB0dXBsZSBvZiBpbmZvcm1hdGlvbiBhYm91dCBzZWxmIHRoYXQgY2FuIGJlIHVzZWQgdG9cbiAgICAgICAgY29tcHV0ZSB0aGUgaGFzaC4gSWYgYSBjbGFzcyBkZWZpbmVzIGFkZGl0aW9uYWwgYXR0cmlidXRlcyxcbiAgICAgICAgbGlrZSBgYG5hbWVgYCBpbiBTeW1ib2wsIHRoZW4gdGhpcyBtZXRob2Qgc2hvdWxkIGJlIHVwZGF0ZWRcbiAgICAgICAgYWNjb3JkaW5nbHkgdG8gcmV0dXJuIHN1Y2ggcmVsZXZhbnQgYXR0cmlidXRlcy5cbiAgICAgICAgRGVmaW5pbmcgbW9yZSB0aGFuIF9oYXNoYWJsZV9jb250ZW50IGlzIG5lY2Vzc2FyeSBpZiBfX2VxX18gaGFzXG4gICAgICAgIGJlZW4gZGVmaW5lZCBieSBhIGNsYXNzLiBTZWUgbm90ZSBhYm91dCB0aGlzIGluIEJhc2ljLl9fZXFfXy4qL1xuXG4gICAgICAgIHJldHVybiB0aGlzLl9hcmdzO1xuICAgIH1cblxuICAgIHN0YXRpYyBjbXAoc2VsZjogYW55LCBvdGhlcjogYW55KTogYW55IHtcbiAgICAgICAgLypcbiAgICAgICAgUmV0dXJuIC0xLCAwLCAxIGlmIHRoZSBvYmplY3QgaXMgc21hbGxlciwgZXF1YWwsIG9yIGdyZWF0ZXIgdGhhbiBvdGhlci5cbiAgICAgICAgTm90IGluIHRoZSBtYXRoZW1hdGljYWwgc2Vuc2UuIElmIHRoZSBvYmplY3QgaXMgb2YgYSBkaWZmZXJlbnQgdHlwZVxuICAgICAgICBmcm9tIHRoZSBcIm90aGVyXCIgdGhlbiB0aGVpciBjbGFzc2VzIGFyZSBvcmRlcmVkIGFjY29yZGluZyB0b1xuICAgICAgICB0aGUgc29ydGVkX2NsYXNzZXMgbGlzdC5cbiAgICAgICAgRXhhbXBsZXNcbiAgICAgICAgPT09PT09PT1cbiAgICAgICAgPj4+IGZyb20gc3ltcHkuYWJjIGltcG9ydCB4LCB5XG4gICAgICAgID4+PiB4LmNvbXBhcmUoeSlcbiAgICAgICAgLTFcbiAgICAgICAgPj4+IHguY29tcGFyZSh4KVxuICAgICAgICAwXG4gICAgICAgID4+PiB5LmNvbXBhcmUoeClcbiAgICAgICAgMVxuICAgICAgICAqL1xuICAgICAgICBpZiAoc2VsZiA9PT0gb3RoZXIpIHtcbiAgICAgICAgICAgIHJldHVybiAwO1xuICAgICAgICB9XG4gICAgICAgIGNvbnN0IG4xID0gc2VsZi5jb25zdHJ1Y3Rvci5uYW1lO1xuICAgICAgICBjb25zdCBuMiA9IG90aGVyLmNvbnN0cnVjdG9yLm5hbWU7XG4gICAgICAgIGlmIChuMSAmJiBuMikge1xuICAgICAgICAgICAgcmV0dXJuIChuMSA+IG4yIGFzIHVua25vd24gYXMgbnVtYmVyKSAtIChuMSA8IG4yIGFzIHVua25vd24gYXMgbnVtYmVyKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IHN0ID0gc2VsZi5faGFzaGFibGVfY29udGVudCgpO1xuICAgICAgICBjb25zdCBvdCA9IG90aGVyLl9oYXNoYWJsZV9jb250ZW50KCk7XG4gICAgICAgIGlmIChzdCAmJiBvdCkge1xuICAgICAgICAgICAgcmV0dXJuIChzdC5sZW5ndGggPiBvdC5sZW5ndGggYXMgdW5rbm93biBhcyBudW1iZXIpIC0gKHN0Lmxlbmd0aCA8IG90Lmxlbmd0aCBhcyB1bmtub3duIGFzIG51bWJlcik7XG4gICAgICAgIH1cbiAgICAgICAgZm9yIChjb25zdCBlbGVtIG9mIFV0aWwuemlwKHN0LCBvdCkpIHtcbiAgICAgICAgICAgIGNvbnN0IGwgPSBlbGVtWzBdO1xuICAgICAgICAgICAgY29uc3QgciA9IGVsZW1bMV07XG4gICAgICAgICAgICAvLyAhISEgc2tpcHBpbmcgZnJvemVuc2V0IHN0dWZmXG4gICAgICAgICAgICBsZXQgYztcbiAgICAgICAgICAgIGlmIChsIGluc3RhbmNlb2YgQmFzaWMpIHtcbiAgICAgICAgICAgICAgICBjID0gbC5jbXAocik7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGMgPSAobCA+IHIgYXMgdW5rbm93biBhcyBudW1iZXIpIC0gKGwgPCByIGFzIHVua25vd24gYXMgbnVtYmVyKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChjKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGM7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIDA7XG4gICAgfVxuXG4gICAgX2NvbnN0cnVjdG9yX3Bvc3Rwcm9jZXNzb3JfbWFwcGluZzogUmVjb3JkPGFueSwgYW55PiA9IHt9O1xuXG4gICAgX2V4ZWNfY29uc3RydWN0b3JfcG9zdHByb2Nlc3NvcnMob2JqOiBhbnkpIHtcbiAgICAgICAgY29uc3QgY2xzbmFtZSA9IHRoaXMuY29uc3RydWN0b3IubmFtZTtcbiAgICAgICAgY29uc3QgcG9zdHByb2Nlc3NvcnMgPSBuZXcgSGFzaERpY3QoKTtcbiAgICAgICAgLy8gISEhIGZvciBsb29wIG5vdCBpbXBsZW1lbnRlZCAtIGNvbXBsaWNhdGVkIHRvIHJlY3JlYXRlXG4gICAgICAgIGZvciAoY29uc3QgZiBvZiBwb3N0cHJvY2Vzc29ycy5nZXQoY2xzbmFtZSwgW10pKSB7XG4gICAgICAgICAgICBvYmogPSBmKG9iaik7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIG9iajtcbiAgICB9XG5cbiAgICBfZXZhbF9zdWJzKG9sZDogYW55LCBfbmV3OiBhbnkpOiBhbnkge1xuICAgICAgICAvLyBkb24ndCBuZWVkIGFueSBvdGhlciB1dGlsaXRpZXMgdW50aWwgd2UgZG8gbW9yZSBjb21wbGljYXRlZCBzdWJzXG4gICAgICAgIHJldHVybiB1bmRlZmluZWQ7XG4gICAgfVxuXG4gICAgX2FyZXNhbWUoYTogYW55LCBiOiBhbnkpIHtcbiAgICAgICAgaWYgKGEuaXNfTnVtYmVyICYmIGIuaXNfTnVtYmVyKSB7XG4gICAgICAgICAgICByZXR1cm4gYSA9PT0gYiAmJiBhLmNvbnN0cnVjdG9yLm5hbWUgPT09IGIuY29uc3RydWN0b3IubmFtZTtcbiAgICAgICAgfVxuICAgICAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbmV3LWNhcFxuICAgICAgICBmb3IgKGNvbnN0IGl0ZW0gb2YgVXRpbC56aXAobmV3IHByZW9yZGVyX3RyYXZlcnNhbChhKS5hc0l0ZXIoKSwgbmV3IHByZW9yZGVyX3RyYXZlcnNhbChiKS5hc0l0ZXIoKSkpIHtcbiAgICAgICAgICAgIGNvbnN0IGkgPSBpdGVtWzBdO1xuICAgICAgICAgICAgY29uc3QgaiA9IGl0ZW1bMV07XG4gICAgICAgICAgICBpZiAoaSAhPT0gaiB8fCB0eXBlb2YgaSAhPT0gdHlwZW9mIGopIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuXG4gICAgc3VicyguLi5hcmdzOiBhbnkpIHtcbiAgICAgICAgbGV0IHNlcXVlbmNlO1xuICAgICAgICBpZiAoYXJncy5sZW5ndGggPT09IDEpIHtcbiAgICAgICAgICAgIHNlcXVlbmNlID0gYXJnc1swXTtcbiAgICAgICAgICAgIGlmIChzZXF1ZW5jZSBpbnN0YW5jZW9mIEhhc2hTZXQpIHtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoc2VxdWVuY2UgaW5zdGFuY2VvZiBIYXNoRGljdCkge1xuICAgICAgICAgICAgICAgIHNlcXVlbmNlID0gc2VxdWVuY2UuZW50cmllcygpO1xuICAgICAgICAgICAgfSBlbHNlIGlmIChTeW1ib2wuaXRlcmF0b3IgaW4gT2JqZWN0KHNlcXVlbmNlKSkge1xuICAgICAgICAgICAgICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBtYXgtbGVuXG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiV2hlbiBhIHNpbmdsZSBhcmd1bWVudCBpcyBwYXNzZWQgdG8gc3VicyBpdCBzaG91bGQgYmUgYSBkaWN0aW9uYXJ5IG9mIG9sZDogbmV3IHBhaXJzIG9yIGFuIGl0ZXJhYmxlIG9mIChvbGQsIG5ldykgdHVwbGVzXCIpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9IGVsc2UgaWYgKGFyZ3MubGVuZ3RoID09PSAyKSB7XG4gICAgICAgICAgICBzZXF1ZW5jZSA9IFthcmdzXTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcInN1YiBhY2NlcHRzIDEgb3IgMiBhcmdzXCIpO1xuICAgICAgICB9XG4gICAgICAgIGxldCBydiA9IHRoaXM7XG4gICAgICAgIGZvciAoY29uc3QgaXRlbSBvZiBzZXF1ZW5jZSkge1xuICAgICAgICAgICAgY29uc3Qgb2xkID0gaXRlbVswXTtcbiAgICAgICAgICAgIGNvbnN0IF9uZXcgPSBpdGVtWzFdO1xuICAgICAgICAgICAgcnYgPSBydi5fc3VicyhvbGQsIF9uZXcpO1xuICAgICAgICAgICAgaWYgKCEocnYgaW5zdGFuY2VvZiBCYXNpYykpIHtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gcnY7XG4gICAgfVxuXG4gICAgX3N1YnMob2xkOiBhbnksIF9uZXc6IGFueSkge1xuICAgICAgICBmdW5jdGlvbiBmYWxsYmFjayhjbHM6IGFueSwgb2xkOiBhbnksIF9uZXc6IGFueSkge1xuICAgICAgICAgICAgbGV0IGhpdCA9IGZhbHNlO1xuICAgICAgICAgICAgY29uc3QgYXJncyA9IGNscy5fYXJncztcbiAgICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgYXJncy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICAgIGxldCBhcmcgPSBhcmdzW2ldO1xuICAgICAgICAgICAgICAgIGlmICghKGFyZy5fZXZhbF9zdWJzKSkge1xuICAgICAgICAgICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgYXJnID0gYXJnLl9zdWJzKG9sZCwgX25ldyk7XG4gICAgICAgICAgICAgICAgaWYgKCEoY2xzLl9hcmVzYW1lKGFyZywgYXJnc1tpXSkpKSB7XG4gICAgICAgICAgICAgICAgICAgIGhpdCA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgIGFyZ3NbaV0gPSBhcmc7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKGhpdCkge1xuICAgICAgICAgICAgICAgIGxldCBydjtcbiAgICAgICAgICAgICAgICBpZiAoY2xzLmNvbnN0cnVjdG9yLm5hbWUgPT09IFwiTXVsXCIgfHwgY2xzLmNvbnN0cnVjdG9yLm5hbWUgPT09IFwiQWRkXCIpIHtcbiAgICAgICAgICAgICAgICAgICAgcnYgPSBuZXcgY2xzLmNvbnN0cnVjdG9yKHRydWUsIHRydWUsIC4uLmFyZ3MpO1xuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoY2xzLmNvbnN0cnVjdG9yLm5hbWUgPT09IFwiUG93XCIpIHtcbiAgICAgICAgICAgICAgICAgICAgcnYgPSBuZXcgY2xzLmNvbnN0cnVjdG9yKC4uLmFyZ3MpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICByZXR1cm4gcnY7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gY2xzO1xuICAgICAgICB9XG4gICAgICAgIGlmICh0aGlzLl9hcmVzYW1lKHRoaXMsIG9sZCkpIHtcbiAgICAgICAgICAgIHJldHVybiBfbmV3O1xuICAgICAgICB9XG5cbiAgICAgICAgbGV0IHJ2ID0gdGhpcy5fZXZhbF9zdWJzKG9sZCwgX25ldyk7XG4gICAgICAgIGlmICh0eXBlb2YgcnYgPT09IFwidW5kZWZpbmVkXCIpIHtcbiAgICAgICAgICAgIHJ2ID0gZmFsbGJhY2sodGhpcywgb2xkLCBfbmV3KTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gcnY7XG4gICAgfVxufTtcblxuLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5ldy1jYXBcbmNvbnN0IEJhc2ljID0gX0Jhc2ljKE9iamVjdCk7XG5NYW5hZ2VkUHJvcGVydGllcy5yZWdpc3RlcihCYXNpYyk7XG5cbmNvbnN0IEF0b20gPSAoc3VwZXJjbGFzczogYW55KSA9PiBjbGFzcyBBdG9tIGV4dGVuZHMgbWl4KGJhc2UpLndpdGgoX0Jhc2ljKSB7XG4gICAgLypcbiAgICBBIHBhcmVudCBjbGFzcyBmb3IgYXRvbWljIHRoaW5ncy4gQW4gYXRvbSBpcyBhbiBleHByZXNzaW9uIHdpdGggbm8gc3ViZXhwcmVzc2lvbnMuXG4gICAgRXhhbXBsZXNcbiAgICA9PT09PT09PVxuICAgIFN5bWJvbCwgTnVtYmVyLCBSYXRpb25hbCwgSW50ZWdlciwgLi4uXG4gICAgQnV0IG5vdDogQWRkLCBNdWwsIFBvdywgLi4uXG4gICAgKi9cblxuICAgIHN0YXRpYyBpc19BdG9tID0gdHJ1ZTtcblxuICAgIF9fc2xvdHNfXzogYW55W10gPSBbXTtcblxuICAgIG1hdGNoZXMoZXhwcjogYW55LCByZXBsX2RpY3Q6IEhhc2hEaWN0ID0gdW5kZWZpbmVkLCBvbGQ6IGFueSA9IGZhbHNlKSB7XG4gICAgICAgIGlmICh0aGlzID09PSBleHByKSB7XG4gICAgICAgICAgICBpZiAodHlwZW9mIHJlcGxfZGljdCA9PT0gXCJ1bmRlZmluZWRcIikge1xuICAgICAgICAgICAgICAgIHJldHVybiBuZXcgSGFzaERpY3QoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiByZXBsX2RpY3QuY29weSgpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgeHJlcGxhY2UocnVsZTogYW55LCBoYWNrMjogYW55ID0gZmFsc2UpIHtcbiAgICAgICAgcmV0dXJuIHJ1bGUuZ2V0KHRoaXMpO1xuICAgIH1cblxuICAgIGRvaXQoLi4uaGludHM6IGFueSkge1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9XG59O1xuXG4vLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbmV3LWNhcFxuY29uc3QgX0F0b21pY0V4cHIgPSBBdG9tKE9iamVjdCk7XG5NYW5hZ2VkUHJvcGVydGllcy5yZWdpc3RlcihfQXRvbWljRXhwcik7XG5cbmV4cG9ydCB7X0Jhc2ljLCBCYXNpYywgQXRvbSwgX0F0b21pY0V4cHJ9O1xuIiwgIi8qXG5Ob3RhYmxlIGNoYW5nZXMgbWFkZSAoYW5kIG5vdGVzKVxuLSBSZXdvcmtlZCBTaW5nbGV0b24gdG8gdXNlIGEgcmVnaXN0cnkgc3lzdGVtIHVzaW5nIGEgc3RhdGljIGRpY3Rpb25hcnlcbi0gUmVnaXN0ZXJzIG51bWJlciBvYmplY3RzIGFzIHRoZXkgYXJlIHVzZWRcbiovXG5cbi8qIGVzbGludC1kaXNhYmxlIG5ldy1jYXAgKi9cbmltcG9ydCB7TWFuYWdlZFByb3BlcnRpZXN9IGZyb20gXCIuL2Fzc3VtcHRpb25zXCI7XG5cbmNsYXNzIFNpbmdsZXRvbiB7XG4gICAgc3RhdGljIHJlZ2lzdHJ5OiBSZWNvcmQ8YW55LCBhbnk+ID0ge307XG5cbiAgICBzdGF0aWMgcmVnaXN0ZXIobmFtZTogc3RyaW5nLCBjbHM6IGFueSkge1xuICAgICAgICBNYW5hZ2VkUHJvcGVydGllcy5yZWdpc3RlcihjbHMpO1xuICAgICAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbmV3LWNhcFxuICAgICAgICBTaW5nbGV0b24ucmVnaXN0cnlbbmFtZV0gPSBuZXcgY2xzKCk7XG4gICAgfVxufVxuXG5jb25zdCBTOiBhbnkgPSBuZXcgU2luZ2xldG9uKCk7XG5cblxuZXhwb3J0IHtTLCBTaW5nbGV0b259O1xuIiwgIi8qXG5OZXcgY2xhc3MgZ2xvYmFsXG5IZWxwcyB0byBhdm9pZCBjeWNsaWNhbCBpbXBvcnRzIGJ5IHN0b3JpbmcgY29uc3RydWN0b3JzIGFuZCBmdW5jdGlvbnMgd2hpY2hcbmNhbiBiZSBhY2Nlc3NlZCBhbnl3aGVyZVxuXG5Ob3RlOiBzdGF0aWMgbmV3IG1ldGhvZHMgYXJlIGNyZWF0ZWQgaW4gdGhlIGNsYXNzZXMgdG8gYmUgcmVnaXN0ZXJlZCwgYW5kIHRob3NlXG5tZXRob2RzIGFyZSBhZGRlZCBoZXJlXG4qL1xuXG5leHBvcnQgY2xhc3MgR2xvYmFsIHtcbiAgICBzdGF0aWMgY29uc3RydWN0b3JzOiBSZWNvcmQ8c3RyaW5nLCBhbnk+ID0ge307XG4gICAgc3RhdGljIGZ1bmN0aW9uczogUmVjb3JkPHN0cmluZywgYW55PiA9IHt9O1xuXG4gICAgc3RhdGljIGNvbnN0cnVjdChjbGFzc25hbWU6IHN0cmluZywgLi4uYXJnczogYW55W10pIHtcbiAgICAgICAgY29uc3QgY29uc3RydWN0b3IgPSBHbG9iYWwuY29uc3RydWN0b3JzW2NsYXNzbmFtZV07XG4gICAgICAgIHJldHVybiBjb25zdHJ1Y3RvciguLi5hcmdzKTtcbiAgICB9XG5cbiAgICBzdGF0aWMgcmVnaXN0ZXIoY2xzOiBzdHJpbmcsIGNvbnN0cnVjdG9yOiBhbnkpIHtcbiAgICAgICAgR2xvYmFsLmNvbnN0cnVjdG9yc1tjbHNdID0gY29uc3RydWN0b3I7XG4gICAgfVxuXG4gICAgc3RhdGljIHJlZ2lzdGVyZnVuYyhuYW1lOiBzdHJpbmcsIGZ1bmM6IGFueSkge1xuICAgICAgICBHbG9iYWwuZnVuY3Rpb25zW25hbWVdID0gZnVuYztcbiAgICB9XG5cbiAgICBzdGF0aWMgZXZhbGZ1bmMobmFtZTogc3RyaW5nLCAuLi5hcmdzOiBhbnlbXSkge1xuICAgICAgICBjb25zdCBmdW5jID0gR2xvYmFsLmZ1bmN0aW9uc1tuYW1lXTtcbiAgICAgICAgcmV0dXJuIGZ1bmMoLi4uYXJncyk7XG4gICAgfVxufVxuIiwgIi8qIGVzbGludC1kaXNhYmxlIG5vLXVudXNlZC12YXJzICovXG4vKiBNaXNjZWxsYW5lb3VzIHN0dWZmIHRoYXQgZG9lcyBub3QgcmVhbGx5IGZpdCBhbnl3aGVyZSBlbHNlICovXG5cbi8qXG5cbk5vdGFibGUgY2hhbmdlcyBtYWRlIChXQiBhbmQgR00pOlxuLSBGaWxsZGVkZW50IGFuZCBhc19pbnQgYXJlIHJld3JpdHRlbiB0byBpbmNsdWRlIHRoZSBzYW1lIGZ1bmN0aW9uYWxpdHkgd2l0aFxuICBkaWZmZXJlbnQgbWV0aG9kb2xvZ3lcbi0gTWFueSBmdW5jdGlvbnMgYXJlIG5vdCB5ZXQgaW1wbGVtZW50ZWQgYW5kIHdpbGwgYmUgY29tcGxldGVkIGFzIHdlIGZpbmQgdGhlbVxuICBuZWNlc3Nhcnlcbn1cblxuKi9cblxuXG5jbGFzcyBVbmRlY2lkYWJsZSBleHRlbmRzIEVycm9yIHtcbiAgICAvLyBhbiBlcnJvciB0byBiZSByYWlzZWQgd2hlbiBhIGRlY2lzaW9uIGNhbm5vdCBiZSBtYWRlIGRlZmluaXRpdmVseVxuICAgIC8vIHdoZXJlIGEgZGVmaW5pdGl2ZSBhbnN3ZXIgaXMgbmVlZGVkXG59XG5cbi8qXG5mdW5jdGlvbiBmaWxsZGVkZW50KHM6IHN0cmluZywgdzogbnVtYmVyID0gNzApOiBzdHJpbmcge1xuXG4gICAgLy8gcmVtb3ZlIGVtcHR5IGJsYW5rIGxpbmVzXG4gICAgbGV0IHN0ciA9IHMucmVwbGFjZSgvXlxccypcXG4vZ20sIFwiXCIpO1xuICAgIC8vIGRlZGVudFxuICAgIHN0ciA9IGRlZGVudChzdHIpO1xuICAgIC8vIHdyYXBcbiAgICBjb25zdCBhcnIgPSBzdHIuc3BsaXQoXCIgXCIpO1xuICAgIGxldCByZXMgPSBcIlwiO1xuICAgIGxldCBsaW5lbGVuZ3RoID0gMDtcbiAgICBmb3IgKGNvbnN0IHdvcmQgb2YgYXJyKSB7XG4gICAgICAgIGlmIChsaW5lbGVuZ3RoIDw9IHcgKyB3b3JkLmxlbmd0aCkge1xuICAgICAgICAgICAgcmVzICs9IHdvcmQ7XG4gICAgICAgICAgICBsaW5lbGVuZ3RoICs9IHdvcmQubGVuZ3RoO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmVzICs9IFwiXFxuXCI7XG4gICAgICAgICAgICBsaW5lbGVuZ3RoID0gMDtcbiAgICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gcmVzO1xufVxuKi9cblxuXG5mdW5jdGlvbiBzdHJsaW5lcyhzOiBzdHJpbmcsIGM6IG51bWJlciA9IDY0LCBzaG9ydD1mYWxzZSkge1xuICAgIHRocm93IG5ldyBFcnJvcihcInN0cmxpbmVzIGlzIG5vdCB5ZXQgaW1wbGVtZW50ZWRcIik7XG59XG5cbmZ1bmN0aW9uIHJhd2xpbmVzKHM6IHN0cmluZykge1xuICAgIHRocm93IG5ldyBFcnJvcihcInJhd2xpbmVzIGlzIG5vdCB5ZXQgaW1wbGVtZW50ZWRcIik7XG59XG5cbmZ1bmN0aW9uIGRlYnVnX2RlY29yYXRvcihmdW5jOiBhbnkpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoXCJkZWJ1Z19kZWNvcmF0b3IgaXMgbm90IHlldCBpbXBsZW1lbnRlZFwiKTtcbn1cblxuZnVuY3Rpb24gZGVidWcoLi4uYXJnczogYW55KSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKFwiZGVidWcgaXMgbm90IHlldCBpbXBsZW1lbnRlZFwiKTtcbn1cblxuZnVuY3Rpb24gZmluZF9leGVjdXRhYmxlKGV4ZWN1dGFibGU6IGFueSwgcGF0aDogYW55PXVuZGVmaW5lZCkge1xuICAgIHRocm93IG5ldyBFcnJvcihcImZpbmRfZXhlY3V0YWJsZSBpcyBub3QgeWV0IGltcGxlbWVudGVkXCIpO1xufVxuXG5mdW5jdGlvbiBmdW5jX25hbWUoeDogYW55LCBzaG9ydDogYW55PWZhbHNlKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKFwiZnVuY19uYW1lIGlzIG5vdCB5ZXQgaW1wbGVtZW50ZWRcIik7XG59XG5cbmZ1bmN0aW9uIF9yZXBsYWNlKHJlcHM6IGFueSkge1xuICAgIHRocm93IG5ldyBFcnJvcihcIl9yZXBsYWNlIGlzIG5vdCB5ZXQgaW1wbGVtZW50ZWRcIik7XG59XG5cbmZ1bmN0aW9uIHJlcGxhY2Uoc3RyOiBzdHJpbmcsIC4uLnJlcHM6IGFueSkge1xuICAgIHRocm93IG5ldyBFcnJvcihcInJlcGxhY2UgaXMgbm90IHlldCBpbXBsZW1lbnRlZFwiKTtcbn1cblxuZnVuY3Rpb24gdHJhbnNsYXRlKHM6IGFueSwgYTogYW55LCBiOiBhbnk9dW5kZWZpbmVkLCBjOiBhbnk9dW5kZWZpbmVkKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKFwidHJhbnNsYXRlIGlzIG5vdCB5ZXQgaW1wbGVtZW50ZWRcIik7XG59XG5cbmZ1bmN0aW9uIG9yZGluYWwobnVtOiBhbnkpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoXCJvcmRpbmFsIGlzIG5vdCB5ZXQgaW1wbGVtZW50ZWRcIik7XG59XG5cbmZ1bmN0aW9uIGFzX2ludChuOiBhbnkpIHtcbiAgICBpZiAoIU51bWJlci5pc0ludGVnZXIobikpIHsgLy8gISEhIC0gbWlnaHQgbmVlZCB0byB1cGRhdGUgdGhpc1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IobiArIFwiIGlzIG5vdCBpbnRcIik7XG4gICAgfVxuICAgIHJldHVybiBuO1xufVxuXG5leHBvcnQge2FzX2ludH07XG4iLCAiLypcbk5vdGFibGUgY2hhbmdlcyBtYWRlIChhbmQgbm90ZXMpOlxuLSBWZXJ5IGJhcmVib25lcyB2ZXJzaW9ucyBvZiBFeHByIGltcGxlbWVudGVkIHNvIGZhciAtIHZlcnkgZmV3IHV0aWwgbWV0aG9kc1xuLSBOb3RlIHRoYXQgZXhwcmVzc2lvbiB1c2VzIGdsb2JhbC50cyB0byBjb25zdHJ1Y3QgYWRkIGFuZCBtdWwgb2JqZWN0cywgd2hpY2hcbiAgYXZvaWRzIGN5Y2xpY2FsIGltcG9ydHNcbiovXG5cbmltcG9ydCB7X0Jhc2ljLCBBdG9tfSBmcm9tIFwiLi9iYXNpY1wiO1xuaW1wb3J0IHtIYXNoU2V0LCBtaXh9IGZyb20gXCIuL3V0aWxpdHlcIjtcbmltcG9ydCB7TWFuYWdlZFByb3BlcnRpZXN9IGZyb20gXCIuL2Fzc3VtcHRpb25zXCI7XG5pbXBvcnQge1N9IGZyb20gXCIuL3NpbmdsZXRvblwiO1xuaW1wb3J0IHtHbG9iYWx9IGZyb20gXCIuL2dsb2JhbFwiO1xuaW1wb3J0IHthc19pbnR9IGZyb20gXCIuLi91dGlsaXRpZXMvbWlzY1wiO1xuXG5cbmNvbnN0IEV4cHIgPSAoc3VwZXJjbGFzczogYW55KSA9PiBjbGFzcyBFeHByIGV4dGVuZHMgbWl4KHN1cGVyY2xhc3MpLndpdGgoX0Jhc2ljKSB7XG4gICAgLypcbiAgICBCYXNlIGNsYXNzIGZvciBhbGdlYnJhaWMgZXhwcmVzc2lvbnMuXG4gICAgRXhwbGFuYXRpb25cbiAgICA9PT09PT09PT09PVxuICAgIEV2ZXJ5dGhpbmcgdGhhdCByZXF1aXJlcyBhcml0aG1ldGljIG9wZXJhdGlvbnMgdG8gYmUgZGVmaW5lZFxuICAgIHNob3VsZCBzdWJjbGFzcyB0aGlzIGNsYXNzLCBpbnN0ZWFkIG9mIEJhc2ljICh3aGljaCBzaG91bGQgYmVcbiAgICB1c2VkIG9ubHkgZm9yIGFyZ3VtZW50IHN0b3JhZ2UgYW5kIGV4cHJlc3Npb24gbWFuaXB1bGF0aW9uLCBpLmUuXG4gICAgcGF0dGVybiBtYXRjaGluZywgc3Vic3RpdHV0aW9ucywgZXRjKS5cbiAgICBJZiB5b3Ugd2FudCB0byBvdmVycmlkZSB0aGUgY29tcGFyaXNvbnMgb2YgZXhwcmVzc2lvbnM6XG4gICAgU2hvdWxkIHVzZSBfZXZhbF9pc19nZSBmb3IgaW5lcXVhbGl0eSwgb3IgX2V2YWxfaXNfZXEsIHdpdGggbXVsdGlwbGUgZGlzcGF0Y2guXG4gICAgX2V2YWxfaXNfZ2UgcmV0dXJuIHRydWUgaWYgeCA+PSB5LCBmYWxzZSBpZiB4IDwgeSwgYW5kIE5vbmUgaWYgdGhlIHR3byB0eXBlc1xuICAgIGFyZSBub3QgY29tcGFyYWJsZSBvciB0aGUgY29tcGFyaXNvbiBpcyBpbmRldGVybWluYXRlXG4gICAgU2VlIEFsc29cbiAgICA9PT09PT09PVxuICAgIHN5bXB5LmNvcmUuYmFzaWMuQmFzaWNcbiAgICAqL1xuXG4gICAgX19zbG90c19fOiBhbnlbXSA9IFtdO1xuICAgIHN0YXRpYyBpc19zY2FsYXIgPSB0cnVlO1xuXG4gICAgY29uc3RydWN0b3IoLi4uYXJnczogYW55KSB7XG4gICAgICAgIHN1cGVyKC4uLmFyZ3MpO1xuICAgIH1cblxuICAgIGFzX2Jhc2VfZXhwKCkge1xuICAgICAgICByZXR1cm4gW3RoaXMsIFMuT25lXTtcbiAgICB9XG5cbiAgICBhc19jb2VmZl9NdWwocmF0aW9uYWw6IGJvb2xlYW4gPSBmYWxzZSkge1xuICAgICAgICByZXR1cm4gW1MuT25lLCB0aGlzXTtcbiAgICB9XG5cbiAgICBhc19jb2VmZl9BZGQoKSB7XG4gICAgICAgIHJldHVybiBbUy5aZXJvLCB0aGlzXTtcbiAgICB9XG5cbiAgICBfX2FkZF9fKG90aGVyOiBhbnkpIHtcbiAgICAgICAgcmV0dXJuIEdsb2JhbC5jb25zdHJ1Y3QoXCJBZGRcIiwgdHJ1ZSwgdHJ1ZSwgdGhpcywgb3RoZXIpO1xuICAgIH1cblxuICAgIF9fcmFkZF9fKG90aGVyOiBhbnkpIHtcbiAgICAgICAgcmV0dXJuIEdsb2JhbC5jb25zdHJ1Y3QoXCJBZGRcIiwgdHJ1ZSwgdHJ1ZSwgb3RoZXIsIHRoaXMpO1xuICAgIH1cblxuICAgIF9fc3ViX18ob3RoZXI6IGFueSkge1xuICAgICAgICByZXR1cm4gR2xvYmFsLmNvbnN0cnVjdChcIkFkZFwiLCB0cnVlLCB0cnVlLCB0aGlzLCBvdGhlci5fX211bF9fKFMuTmVnYXRpdmVPbmUpKTtcbiAgICB9XG5cbiAgICBfX3JzdWJfXyhvdGhlcjogYW55KSB7XG4gICAgICAgIHJldHVybiBHbG9iYWwuY29uc3RydWN0KFwiQWRkXCIsIHRydWUsIHRydWUsIG90aGVyLCB0aGlzLl9fbXVsX18oUy5OZWdhdGl2ZU9uZSkpO1xuICAgIH1cblxuICAgIF9fbXVsX18ob3RoZXI6IGFueSkge1xuICAgICAgICByZXR1cm4gR2xvYmFsLmNvbnN0cnVjdChcIk11bFwiLCB0cnVlLCB0cnVlLCB0aGlzLCBvdGhlcik7XG4gICAgfVxuXG4gICAgX19ybXVsX18ob3RoZXI6IGFueSkge1xuICAgICAgICByZXR1cm4gR2xvYmFsLmNvbnN0cnVjdChcIk11bFwiLCB0cnVlLCB0cnVlLCBvdGhlciwgdGhpcyk7XG4gICAgfVxuXG4gICAgX3BvdyhvdGhlcjogYW55KSB7XG4gICAgICAgIHJldHVybiBHbG9iYWwuY29uc3RydWN0KFwiUG93XCIsIHRoaXMsIG90aGVyKTtcbiAgICB9XG5cbiAgICBfX3Bvd19fKG90aGVyOiBhbnksIG1vZDogYm9vbGVhbiA9IHVuZGVmaW5lZCkge1xuICAgICAgICBpZiAodHlwZW9mIG1vZCA9PT0gXCJ1bmRlZmluZWRcIikge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX3BvdyhvdGhlcik7XG4gICAgICAgIH1cbiAgICAgICAgbGV0IF9zZWxmOyBsZXQgX290aGVyOyBsZXQgX21vZDtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIFtfc2VsZiwgX290aGVyLCBfbW9kXSA9IFthc19pbnQodGhpcyksIGFzX2ludChvdGhlciksIGFzX2ludChtb2QpXTtcbiAgICAgICAgICAgIGlmIChvdGhlciA+PSAwKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIEdsb2JhbC5jb25zdHJ1Y3QoXCJfTnVtYmVyX1wiLCBfc2VsZioqX290aGVyICUgX21vZCk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHJldHVybiBHbG9iYWwuY29uc3RydWN0KFwiX051bWJlcl9cIiwgR2xvYmFsLmV2YWxmdW5jKFwibW9kX2ludmVyc2VcIiwgKF9zZWxmICoqIChfb3RoZXIpICUgKG1vZCBhcyBhbnkpKSwgbW9kKSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0gY2F0Y2ggKEVycm9yKSB7XG4gICAgICAgICAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tdW51c2VkLXZhcnNcbiAgICAgICAgICAgIGNvbnN0IHBvd2VyID0gdGhpcy5fcG93KF9vdGhlcik7XG4gICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgIC8vIHJldHVybiBwb3dlci5fX21vZF9fKG1vZCk7XG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwibW9kIGNsYXNzIG5vdCB5ZXQgaW1wbGVtZW50ZWRcIik7XG4gICAgICAgICAgICB9IGNhdGNoIChFcnJvcikge1xuICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcIm5vdCBpbXBsZW1lbnRlZFwiKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgIF9fcnBvd19fKG90aGVyOiBhbnkpIHtcbiAgICAgICAgcmV0dXJuIEdsb2JhbC5jb25zdHJ1Y3QoXCJQb3dcIiwgb3RoZXIsIHRoaXMpO1xuICAgIH1cblxuICAgIF9fdHJ1ZWRpdl9fKG90aGVyOiBhbnkpIHtcbiAgICAgICAgY29uc3QgZGVub20gPSBHbG9iYWwuY29uc3RydWN0KFwiUG93XCIsIG90aGVyLCBTLk5lZ2F0aXZlT25lKTtcbiAgICAgICAgaWYgKHRoaXMgPT09IFMuT25lKSB7XG4gICAgICAgICAgICByZXR1cm4gZGVub207XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gR2xvYmFsLmNvbnN0cnVjdChcIk11bFwiLCB0cnVlLCB0cnVlLCB0aGlzLCBkZW5vbSk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBfX3J0cnVlZGl2X18ob3RoZXI6IGFueSkge1xuICAgICAgICBjb25zdCBkZW5vbSA9IEdsb2JhbC5jb25zdHJ1Y3QoXCJQb3dcIiwgdGhpcywgUy5OZWdhdGl2ZU9uZSk7XG4gICAgICAgIGlmIChvdGhlciA9PT0gUy5PbmUpIHtcbiAgICAgICAgICAgIHJldHVybiBkZW5vbTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiBHbG9iYWwuY29uc3RydWN0KFwiTXVsXCIsIHRydWUsIHRydWUsIG90aGVyLCBkZW5vbSk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBfZXZhbF9wb3dlcihvdGhlcjogYW55KTogYW55IHtcbiAgICAgICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgICB9XG5cbiAgICBhcmdzX2NuYyhjc2V0OiBib29sZWFuID0gZmFsc2UsIHdhcm46IGJvb2xlYW4gPSB0cnVlLCBzcGxpdF8xOiBib29sZWFuID0gdHJ1ZSkge1xuICAgICAgICBsZXQgYXJncztcbiAgICAgICAgaWYgKCh0aGlzLmNvbnN0cnVjdG9yIGFzIGFueSkuaXNfTXVsKSB7XG4gICAgICAgICAgICBhcmdzID0gdGhpcy5fYXJncztcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGFyZ3MgPSBbdGhpc107XG4gICAgICAgIH1cbiAgICAgICAgbGV0IGM7IGxldCBuYztcbiAgICAgICAgbGV0IGxvb3AyID0gdHJ1ZTtcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBhcmdzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBjb25zdCBtaSA9IGFyZ3NbaV07XG4gICAgICAgICAgICBpZiAoIShtaS5pc19jb21tdXRhdGl2ZSkpIHtcbiAgICAgICAgICAgICAgICBjID0gYXJncy5zbGljZSgwLCBpKTtcbiAgICAgICAgICAgICAgICBuYyA9IGFyZ3Muc2xpY2UoaSk7XG4gICAgICAgICAgICAgICAgbG9vcDIgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSBpZiAobG9vcDIpIHtcbiAgICAgICAgICAgIGMgPSBhcmdzO1xuICAgICAgICAgICAgbmMgPSBbXTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChjICYmIHNwbGl0XzEgJiZcbiAgICAgICAgICAgIGNbMF0uaXNfTnVtYmVyICYmXG4gICAgICAgICAgICBjWzBdLmlzX2V4dGVuZGVkX25lZ2F0aXZlICYmXG4gICAgICAgICAgICBjWzBdICE9PSBTLk5lZ2F0aXZlT25lKSB7XG4gICAgICAgICAgICBjLnNwbGljZSgwLCAxLCBTLk5lZ2F0aXZlT25lLCBjWzBdLl9fbXVsX18oUy5OZWdhdGl2ZU9uZSkpO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGNzZXQpIHtcbiAgICAgICAgICAgIGNvbnN0IGNsZW4gPSBjLmxlbmd0aDtcbiAgICAgICAgICAgIGNvbnN0IGNzZXQgPSBuZXcgSGFzaFNldCgpO1xuICAgICAgICAgICAgY3NldC5hZGRBcnIoYyk7XG4gICAgICAgICAgICBpZiAoY2xlbiAmJiB3YXJuICYmIGNzZXQuc2l6ZSAhPT0gY2xlbikge1xuICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcInJlcGVhdGVkIGNvbW11dGF0aXZlIGFyZ3NcIik7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIFtjLCBuY107XG4gICAgfVxufTtcblxuLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5ldy1jYXBcbmNvbnN0IF9FeHByID0gRXhwcihPYmplY3QpO1xuTWFuYWdlZFByb3BlcnRpZXMucmVnaXN0ZXIoX0V4cHIpO1xuXG5jb25zdCBBdG9taWNFeHByID0gKHN1cGVyY2xhc3M6IGFueSkgPT4gY2xhc3MgQXRvbWljRXhwciBleHRlbmRzIG1peChzdXBlcmNsYXNzKS53aXRoKEF0b20sIEV4cHIpIHtcbiAgICAvKlxuICAgIEEgcGFyZW50IGNsYXNzIGZvciBvYmplY3Qgd2hpY2ggYXJlIGJvdGggYXRvbXMgYW5kIEV4cHJzLlxuICAgIEZvciBleGFtcGxlOiBTeW1ib2wsIE51bWJlciwgUmF0aW9uYWwsIEludGVnZXIsIC4uLlxuICAgIEJ1dCBub3Q6IEFkZCwgTXVsLCBQb3csIC4uLlxuICAgICovXG4gICAgc3RhdGljIGlzX251bWJlciA9IGZhbHNlO1xuICAgIHN0YXRpYyBpc19BdG9tID0gdHJ1ZTtcblxuICAgIF9fc2xvdHNfXzogYW55W10gPSBbXTtcblxuICAgIGNvbnN0cnVjdG9yKC4uLmFyZ3M6IGFueSkge1xuICAgICAgICBzdXBlcihBdG9taWNFeHByLCBhcmdzKTtcbiAgICB9XG5cbiAgICBfZXZhbF9pc19wb2x5bm9taWFsKHN5bXM6IGFueSkge1xuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG5cbiAgICBfZXZhbF9pc19yYXRpb25hbF9mdW5jdGlvbihzeW1zOiBhbnkpIHtcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuXG4gICAgZXZhbF9pc19hbGdlYnJhaWNfZXhwcihzeW1zOiBhbnkpIHtcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuXG4gICAgX2V2YWxfbnNlcmllcyh4OiBhbnksIG46IGFueSwgbG9neDogYW55LCBjZG9yOiBhbnkgPSAwKSB7XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cbn07XG5cbi8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBuZXctY2FwXG5jb25zdCBfQXRvbWljRXhwciA9IEF0b21pY0V4cHIoT2JqZWN0KTtcbk1hbmFnZWRQcm9wZXJ0aWVzLnJlZ2lzdGVyKF9BdG9taWNFeHByKTtcblxuZXhwb3J0IHtBdG9taWNFeHByLCBfQXRvbWljRXhwciwgRXhwciwgX0V4cHJ9O1xuIiwgIi8qXG5Ob3RhYmxlIGNoYW5nZXMgbWFkZTpcbi0gRGljdGlvbmFyeSBzeXN0ZW0gcmV3b3JrZWQgYXMgY2xhc3MgcHJvcGVydGllc1xuKi9cblxuY2xhc3MgX2dsb2JhbF9wYXJhbWV0ZXJzIHtcbiAgICAvKlxuICAgIFRocmVhZC1sb2NhbCBnbG9iYWwgcGFyYW1ldGVycy5cbiAgICBFeHBsYW5hdGlvblxuICAgID09PT09PT09PT09XG4gICAgVGhpcyBjbGFzcyBnZW5lcmF0ZXMgdGhyZWFkLWxvY2FsIGNvbnRhaW5lciBmb3IgU3ltUHkncyBnbG9iYWwgcGFyYW1ldGVycy5cbiAgICBFdmVyeSBnbG9iYWwgcGFyYW1ldGVycyBtdXN0IGJlIHBhc3NlZCBhcyBrZXl3b3JkIGFyZ3VtZW50IHdoZW4gZ2VuZXJhdGluZ1xuICAgIGl0cyBpbnN0YW5jZS5cbiAgICBBIHZhcmlhYmxlLCBgZ2xvYmFsX3BhcmFtZXRlcnNgIGlzIHByb3ZpZGVkIGFzIGRlZmF1bHQgaW5zdGFuY2UgZm9yIHRoaXMgY2xhc3MuXG4gICAgV0FSTklORyEgQWx0aG91Z2ggdGhlIGdsb2JhbCBwYXJhbWV0ZXJzIGFyZSB0aHJlYWQtbG9jYWwsIFN5bVB5J3MgY2FjaGUgaXMgbm90XG4gICAgYnkgbm93LlxuICAgIFRoaXMgbWF5IGxlYWQgdG8gdW5kZXNpcmVkIHJlc3VsdCBpbiBtdWx0aS10aHJlYWRpbmcgb3BlcmF0aW9ucy5cbiAgICBFeGFtcGxlc1xuICAgID09PT09PT09XG4gICAgPj4+IGZyb20gc3ltcHkuYWJjIGltcG9ydCB4XG4gICAgPj4+IGZyb20gc3ltcHkuY29yZS5jYWNoZSBpbXBvcnQgY2xlYXJfY2FjaGVcbiAgICA+Pj4gZnJvbSBzeW1weS5jb3JlLnBhcmFtZXRlcnMgaW1wb3J0IGdsb2JhbF9wYXJhbWV0ZXJzIGFzIGdwXG4gICAgPj4+IGdwLmV2YWx1YXRlXG4gICAgVHJ1ZVxuICAgID4+PiB4K3hcbiAgICAyKnhcbiAgICA+Pj4gbG9nID0gW11cbiAgICA+Pj4gZGVmIGYoKTpcbiAgICAuLi4gICAgIGNsZWFyX2NhY2hlKClcbiAgICAuLi4gICAgIGdwLmV2YWx1YXRlID0gRmFsc2VcbiAgICAuLi4gICAgIGxvZy5hcHBlbmQoeCt4KVxuICAgIC4uLiAgICAgY2xlYXJfY2FjaGUoKVxuICAgID4+PiBpbXBvcnQgdGhyZWFkaW5nXG4gICAgPj4+IHRocmVhZCA9IHRocmVhZGluZy5UaHJlYWQodGFyZ2V0PWYpXG4gICAgPj4+IHRocmVhZC5zdGFydCgpXG4gICAgPj4+IHRocmVhZC5qb2luKClcbiAgICA+Pj4gcHJpbnQobG9nKVxuICAgIFt4ICsgeF1cbiAgICA+Pj4gZ3AuZXZhbHVhdGVcbiAgICBUcnVlXG4gICAgPj4+IHgreFxuICAgIDIqeFxuICAgIFJlZmVyZW5jZXNcbiAgICA9PT09PT09PT09XG4gICAgLi4gWzFdIGh0dHBzOi8vZG9jcy5weXRob24ub3JnLzMvbGlicmFyeS90aHJlYWRpbmcuaHRtbFxuICAgICovXG5cbiAgICBkaWN0OiBSZWNvcmQ8YW55LCBhbnk+ID0ge307XG5cbiAgICBldmFsdWF0ZTtcbiAgICBkaXN0cmlidXRlO1xuICAgIGV4cF9pc19wb3c7XG5cbiAgICBjb25zdHJ1Y3RvcihkaWN0OiBSZWNvcmQ8c3RyaW5nLCBhbnk+KSB7XG4gICAgICAgIHRoaXMuZGljdCA9IGRpY3Q7XG4gICAgICAgIHRoaXMuZXZhbHVhdGUgPSB0aGlzLmRpY3RbXCJldmFsdWF0ZVwiXTtcbiAgICAgICAgdGhpcy5kaXN0cmlidXRlID0gdGhpcy5kaWN0W1wiZGlzdHJpYnV0ZVwiXTtcbiAgICAgICAgdGhpcy5leHBfaXNfcG93ID0gdGhpcy5kaWN0W1wiZXhwX2lzX3Bvd1wiXTtcbiAgICB9XG59XG5cbmNvbnN0IGdsb2JhbF9wYXJhbWV0ZXJzID0gbmV3IF9nbG9iYWxfcGFyYW1ldGVycyh7XCJldmFsdWF0ZVwiOiB0cnVlLCBcImRpc3RyaWJ1dGVcIjogdHJ1ZSwgXCJleHBfaXNfcG93XCI6IGZhbHNlfSk7XG5cbmV4cG9ydCB7Z2xvYmFsX3BhcmFtZXRlcnN9O1xuIiwgIi8qXG5Ob3RhYmxlIGNoYW5nZXMgbWFkZSBhbmQgbm90ZXM6XG4tIE9yZGVyLXN5bWJvbHMgYW5kIHJlbGF0ZWQgY29tcG9uZW50ZWQgbm90IHlldCBpbXBsZW1lbnRlZFxuLSBNb3N0IG1ldGhvZHMgbm90IHlldCBpbXBsZW1lbnRlZCAoYnV0IGVub3VnaCB0byBldmFsdWF0ZSBhZGQgaW4gdGhlb3J5KVxuLSBTaW1wbGlmeSBhcmd1bWVudCBhZGRlZCB0byBjb25zdHJ1Y3RvciB0byBwcmV2ZW50IGluZmluaXRlIHJlY3Vyc2lvblxuKi9cblxuaW1wb3J0IHtfQmFzaWN9IGZyb20gXCIuL2Jhc2ljXCI7XG5pbXBvcnQge21peH0gZnJvbSBcIi4vdXRpbGl0eVwiO1xuaW1wb3J0IHtnbG9iYWxfcGFyYW1ldGVyc30gZnJvbSBcIi4vcGFyYW1ldGVyc1wiO1xuaW1wb3J0IHtmdXp6eV9hbmR9IGZyb20gXCIuL2xvZ2ljXCI7XG5pbXBvcnQge01hbmFnZWRQcm9wZXJ0aWVzfSBmcm9tIFwiLi9hc3N1bXB0aW9uc1wiO1xuaW1wb3J0IHtTfSBmcm9tIFwiLi9zaW5nbGV0b25cIjtcblxuXG5jb25zdCBBc3NvY09wID0gKHN1cGVyY2xhc3M6IGFueSkgPT4gY2xhc3MgQXNzb2NPcCBleHRlbmRzIG1peChzdXBlcmNsYXNzKS53aXRoKF9CYXNpYykge1xuICAgIC8qIEFzc29jaWF0aXZlIG9wZXJhdGlvbnMsIGNhbiBzZXBhcmF0ZSBub25jb21tdXRhdGl2ZSBhbmRcbiAgICBjb21tdXRhdGl2ZSBwYXJ0cy5cbiAgICAoYSBvcCBiKSBvcCBjID09IGEgb3AgKGIgb3AgYykgPT0gYSBvcCBiIG9wIGMuXG4gICAgQmFzZSBjbGFzcyBmb3IgQWRkIGFuZCBNdWwuXG4gICAgVGhpcyBpcyBhbiBhYnN0cmFjdCBiYXNlIGNsYXNzLCBjb25jcmV0ZSBkZXJpdmVkIGNsYXNzZXMgbXVzdCBkZWZpbmVcbiAgICB0aGUgYXR0cmlidXRlIGBpZGVudGl0eWAuXG4gICAgLi4gZGVwcmVjYXRlZDo6IDEuN1xuICAgICAgIFVzaW5nIGFyZ3VtZW50cyB0aGF0IGFyZW4ndCBzdWJjbGFzc2VzIG9mIDpjbGFzczpgfi5FeHByYCBpbiBjb3JlXG4gICAgICAgb3BlcmF0b3JzICg6Y2xhc3M6YH4uTXVsYCwgOmNsYXNzOmB+LkFkZGAsIGFuZCA6Y2xhc3M6YH4uUG93YCkgaXNcbiAgICAgICBkZXByZWNhdGVkLiBTZWUgOnJlZjpgbm9uLWV4cHItYXJncy1kZXByZWNhdGVkYCBmb3IgZGV0YWlscy5cbiAgICBQYXJhbWV0ZXJzXG4gICAgPT09PT09PT09PVxuICAgICphcmdzIDpcdTAxOTJcbiAgICAgICAgQXJndW1lbnRzIHdoaWNoIGFyZSBvcGVyYXRlZFxuICAgIGV2YWx1YXRlIDogYm9vbCwgb3B0aW9uYWxcbiAgICAgICAgRXZhbHVhdGUgdGhlIG9wZXJhdGlvbi4gSWYgbm90IHBhc3NlZCwgcmVmZXIgdG8gYGBnbG9iYWxfcGFyYW1ldGVycy5ldmFsdWF0ZWBgLlxuICAgICovXG5cbiAgICAvLyBmb3IgcGVyZm9ybWFuY2UgcmVhc29uLCB3ZSBkb24ndCBsZXQgaXNfY29tbXV0YXRpdmUgZ28gdG8gYXNzdW1wdGlvbnMsXG4gICAgLy8gYW5kIGtlZXAgaXQgcmlnaHQgaGVyZVxuXG4gICAgX19zbG90c19fOiBhbnlbXSA9IFtcImlzX2NvbW11dGF0aXZlXCJdO1xuICAgIHN0YXRpYyBfYXJnc190eXBlOiBhbnkgPSB1bmRlZmluZWQ7XG5cbiAgICBjb25zdHJ1Y3RvcihjbHM6IGFueSwgZXZhbHVhdGU6IGFueSwgc2ltcGxpZnk6IGJvb2xlYW4sIC4uLmFyZ3M6IGFueSkge1xuICAgICAgICAvLyBpZGVudGl0eSB3YXNuJ3Qgd29ya2luZyBmb3Igc29tZSByZWFzb24sIHNvIGhlcmUgaXMgYSBiYW5kYWlkIGZpeFxuICAgICAgICBpZiAoY2xzLm5hbWUgPT09IFwiTXVsXCIpIHtcbiAgICAgICAgICAgIGNscy5pZGVudGl0eSA9IFMuT25lO1xuICAgICAgICB9IGVsc2UgaWYgKGNscy5uYW1lID09PSBcIkFkZFwiKSB7XG4gICAgICAgICAgICBjbHMuaWRlbnRpdHkgPSBTLlplcm87XG4gICAgICAgIH1cbiAgICAgICAgc3VwZXIoLi4uYXJncyk7XG4gICAgICAgIGlmIChzaW1wbGlmeSkge1xuICAgICAgICAgICAgaWYgKHR5cGVvZiBldmFsdWF0ZSA9PT0gXCJ1bmRlZmluZWRcIikge1xuICAgICAgICAgICAgICAgIGV2YWx1YXRlID0gZ2xvYmFsX3BhcmFtZXRlcnMuZXZhbHVhdGU7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKGV2YWx1YXRlID09PSBmYWxzZSkge1xuICAgICAgICAgICAgICAgIGxldCBvYmogPSB0aGlzLl9mcm9tX2FyZ3MoY2xzLCB1bmRlZmluZWQsIC4uLmFyZ3MpO1xuICAgICAgICAgICAgICAgIG9iaiA9IHRoaXMuX2V4ZWNfY29uc3RydWN0b3JfcG9zdHByb2Nlc3NvcnMob2JqKTtcbiAgICAgICAgICAgICAgICByZXR1cm4gb2JqO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgY29uc3QgYXJnc1RlbXA6IGFueVtdID0gW107XG4gICAgICAgICAgICBmb3IgKGNvbnN0IGEgb2YgYXJncykge1xuICAgICAgICAgICAgICAgIGlmIChhICE9PSBjbHMuaWRlbnRpdHkpIHtcbiAgICAgICAgICAgICAgICAgICAgYXJnc1RlbXAucHVzaChhKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBhcmdzID0gYXJnc1RlbXA7XG4gICAgICAgICAgICBpZiAoYXJncy5sZW5ndGggPT09IDApIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gY2xzLmlkZW50aXR5O1xuICAgICAgICAgICAgfSBlbHNlIGlmIChhcmdzLmxlbmd0aCA9PT0gMSkge1xuICAgICAgICAgICAgICAgIHJldHVybiBhcmdzWzBdO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5vLXVudXNlZC12YXJzXG4gICAgICAgICAgICBjb25zdCBbY19wYXJ0LCBuY19wYXJ0LCBvcmRlcl9zeW1ib2xzXSA9IHRoaXMuZmxhdHRlbihhcmdzKTtcbiAgICAgICAgICAgIGNvbnN0IGlzX2NvbW11dGF0aXZlOiBib29sZWFuID0gbmNfcGFydC5sZW5ndGggPT09IDA7XG4gICAgICAgICAgICBsZXQgb2JqOiBhbnkgPSB0aGlzLl9mcm9tX2FyZ3MoY2xzLCBpc19jb21tdXRhdGl2ZSwgLi4uY19wYXJ0LmNvbmNhdChuY19wYXJ0KSk7XG4gICAgICAgICAgICBvYmogPSB0aGlzLl9leGVjX2NvbnN0cnVjdG9yX3Bvc3Rwcm9jZXNzb3JzKG9iaik7XG4gICAgICAgICAgICAvLyAhISEgb3JkZXIgc3ltYm9scyBub3QgeWV0IGltcGxlbWVudGVkXG4gICAgICAgICAgICByZXR1cm4gb2JqO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgX2Zyb21fYXJncyhjbHM6IGFueSwgaXNfY29tbXV0YXRpdmU6IGFueSwgLi4uYXJnczogYW55KSB7XG4gICAgICAgIC8qIFwiQ3JlYXRlIG5ldyBpbnN0YW5jZSB3aXRoIGFscmVhZHktcHJvY2Vzc2VkIGFyZ3MuXG4gICAgICAgIElmIHRoZSBhcmdzIGFyZSBub3QgaW4gY2Fub25pY2FsIG9yZGVyLCB0aGVuIGEgbm9uLWNhbm9uaWNhbFxuICAgICAgICByZXN1bHQgd2lsbCBiZSByZXR1cm5lZCwgc28gdXNlIHdpdGggY2F1dGlvbi4gVGhlIG9yZGVyIG9mXG4gICAgICAgIGFyZ3MgbWF5IGNoYW5nZSBpZiB0aGUgc2lnbiBvZiB0aGUgYXJncyBpcyBjaGFuZ2VkLiAqL1xuICAgICAgICBpZiAoYXJncy5sZW5ndGggPT09IDApIHtcbiAgICAgICAgICAgIHJldHVybiBjbHMuaWRlbnRpdHk7XG4gICAgICAgIH0gZWxzZSBpZiAoYXJncy5sZW5ndGggPT09IDEpIHtcbiAgICAgICAgICAgIHJldHVybiBhcmdzWzBdO1xuICAgICAgICB9XG4gICAgICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBuZXctY2FwXG4gICAgICAgIGNvbnN0IG9iajogYW55ID0gbmV3IGNscyh0cnVlLCBmYWxzZSwgLi4uYXJncyk7XG4gICAgICAgIGlmICh0eXBlb2YgaXNfY29tbXV0YXRpdmUgPT09IFwidW5kZWZpbmVkXCIpIHtcbiAgICAgICAgICAgIGNvbnN0IGlucHV0OiBhbnlbXSA9IFtdO1xuICAgICAgICAgICAgZm9yIChjb25zdCBhIG9mIGFyZ3MpIHtcbiAgICAgICAgICAgICAgICBpbnB1dC5wdXNoKGEuaXNfY29tbXV0YXRpdmUoKSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpc19jb21tdXRhdGl2ZSA9IGZ1enp5X2FuZChpbnB1dCk7XG4gICAgICAgIH1cbiAgICAgICAgb2JqLmlzX2NvbW11dGF0aXZlID0gKCkgPT4gaXNfY29tbXV0YXRpdmU7XG4gICAgICAgIHJldHVybiBvYmo7XG4gICAgfVxuXG4gICAgX25ld19yYXdhcmdzKHJlZXZhbDogYm9vbGVhbiwgLi4uYXJnczogYW55KSB7XG4gICAgICAgIGxldCBpc19jb21tdXRhdGl2ZTtcbiAgICAgICAgaWYgKHJlZXZhbCAmJiB0aGlzLmlzX2NvbW11dGF0aXZlID09PSBmYWxzZSkge1xuICAgICAgICAgICAgaXNfY29tbXV0YXRpdmUgPSB1bmRlZmluZWQ7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBpc19jb21tdXRhdGl2ZSA9IHRoaXMuaXNfY29tbXV0YXRpdmU7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRoaXMuX2Zyb21fYXJncyh0aGlzLmNvbnN0cnVjdG9yLCBpc19jb21tdXRhdGl2ZSwgLi4uYXJncyk7XG4gICAgfVxuXG4gICAgbWFrZV9hcmdzKGNsczogYW55LCBleHByOiBhbnkpIHtcbiAgICAgICAgaWYgKGV4cHIgaW5zdGFuY2VvZiBjbHMpIHtcbiAgICAgICAgICAgIHJldHVybiBleHByLl9hcmdzO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuIFtleHByXTtcbiAgICAgICAgfVxuICAgIH1cbn07XG5cbi8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBuZXctY2FwXG5NYW5hZ2VkUHJvcGVydGllcy5yZWdpc3RlcihBc3NvY09wKE9iamVjdCkpO1xuXG5leHBvcnQge0Fzc29jT3B9O1xuIiwgIi8qXG5Ob3RhYmxlIGNoYW5nZXMgbWFkZS9ub3Rlczpcbi0gTm8gbWFqb3Igc3RydWN0dXJhbCBjaGFuZ2VzXG4tIE5lZWQgdG8gYWRkIG1vcmUgZnVuY3Rpb25hbGl0eSBoZXJlLCBlc3BlY2lhbGx5IHdpdGggaGFuZGxpbmcgU2luZ2xldG9uc1xuKi9cblxuXG5pbXBvcnQge01hbmFnZWRQcm9wZXJ0aWVzfSBmcm9tIFwiLi9hc3N1bXB0aW9uc1wiO1xuaW1wb3J0IHtfRXhwcn0gZnJvbSBcIi4vZXhwclwiO1xuaW1wb3J0IHtHbG9iYWx9IGZyb20gXCIuL2dsb2JhbFwiO1xuaW1wb3J0IHtfTnVtYmVyX30gZnJvbSBcIi4vbnVtYmVyc1wiO1xuaW1wb3J0IHtnbG9iYWxfcGFyYW1ldGVyc30gZnJvbSBcIi4vcGFyYW1ldGVyc1wiO1xuaW1wb3J0IHtTfSBmcm9tIFwiLi9zaW5nbGV0b25cIjtcblxuZXhwb3J0IGNsYXNzIFBvdyBleHRlbmRzIF9FeHByIHtcbiAgICAvKlxuICAgIERlZmluZXMgdGhlIGV4cHJlc3Npb24geCoqeSBhcyBcInggcmFpc2VkIHRvIGEgcG93ZXIgeVwiXG4gICAgLi4gZGVwcmVjYXRlZDo6IDEuN1xuICAgICAgIFVzaW5nIGFyZ3VtZW50cyB0aGF0IGFyZW4ndCBzdWJjbGFzc2VzIG9mIDpjbGFzczpgfi5FeHByYCBpbiBjb3JlXG4gICAgICAgb3BlcmF0b3JzICg6Y2xhc3M6YH4uTXVsYCwgOmNsYXNzOmB+LkFkZGAsIGFuZCA6Y2xhc3M6YH4uUG93YCkgaXNcbiAgICAgICBkZXByZWNhdGVkLiBTZWUgOnJlZjpgbm9uLWV4cHItYXJncy1kZXByZWNhdGVkYCBmb3IgZGV0YWlscy5cbiAgICBTaW5nbGV0b24gZGVmaW5pdGlvbnMgaW52b2x2aW5nICgwLCAxLCAtMSwgb28sIC1vbywgSSwgLUkpOlxuICAgICstLS0tLS0tLS0tLS0tLSstLS0tLS0tLS0rLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0rXG4gICAgfCBleHByICAgICAgICAgfCB2YWx1ZSAgIHwgcmVhc29uICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHxcbiAgICArPT09PT09PT09PT09PT0rPT09PT09PT09Kz09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09K1xuICAgIHwgeioqMCAgICAgICAgIHwgMSAgICAgICB8IEFsdGhvdWdoIGFyZ3VtZW50cyBvdmVyIDAqKjAgZXhpc3QsIHNlZSBbMl0uICB8XG4gICAgKy0tLS0tLS0tLS0tLS0tKy0tLS0tLS0tLSstLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLStcbiAgICB8IHoqKjEgICAgICAgICB8IHogICAgICAgfCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfFxuICAgICstLS0tLS0tLS0tLS0tLSstLS0tLS0tLS0rLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0rXG4gICAgfCAoLW9vKSoqKC0xKSAgfCAwICAgICAgIHwgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHxcbiAgICArLS0tLS0tLS0tLS0tLS0rLS0tLS0tLS0tKy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tK1xuICAgIHwgKC0xKSoqLTEgICAgIHwgLTEgICAgICB8ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB8XG4gICAgKy0tLS0tLS0tLS0tLS0tKy0tLS0tLS0tLSstLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLStcbiAgICB8IFMuWmVybyoqLTEgICB8IHpvbyAgICAgfCBUaGlzIGlzIG5vdCBzdHJpY3RseSB0cnVlLCBhcyAwKiotMSBtYXkgYmUgICAgfFxuICAgIHwgICAgICAgICAgICAgIHwgICAgICAgICB8IHVuZGVmaW5lZCwgYnV0IGlzIGNvbnZlbmllbnQgaW4gc29tZSBjb250ZXh0cyB8XG4gICAgfCAgICAgICAgICAgICAgfCAgICAgICAgIHwgd2hlcmUgdGhlIGJhc2UgaXMgYXNzdW1lZCB0byBiZSBwb3NpdGl2ZS4gICAgIHxcbiAgICArLS0tLS0tLS0tLS0tLS0rLS0tLS0tLS0tKy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tK1xuICAgIHwgMSoqLTEgICAgICAgIHwgMSAgICAgICB8ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB8XG4gICAgKy0tLS0tLS0tLS0tLS0tKy0tLS0tLS0tLSstLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLStcbiAgICB8IG9vKiotMSAgICAgICB8IDAgICAgICAgfCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfFxuICAgICstLS0tLS0tLS0tLS0tLSstLS0tLS0tLS0rLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0rXG4gICAgfCAwKipvbyAgICAgICAgfCAwICAgICAgIHwgQmVjYXVzZSBmb3IgYWxsIGNvbXBsZXggbnVtYmVycyB6IG5lYXIgICAgICAgIHxcbiAgICB8ICAgICAgICAgICAgICB8ICAgICAgICAgfCAwLCB6KipvbyAtPiAwLiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfFxuICAgICstLS0tLS0tLS0tLS0tLSstLS0tLS0tLS0rLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0rXG4gICAgfCAwKiotb28gICAgICAgfCB6b28gICAgIHwgVGhpcyBpcyBub3Qgc3RyaWN0bHkgdHJ1ZSwgYXMgMCoqb28gbWF5IGJlICAgIHxcbiAgICB8ICAgICAgICAgICAgICB8ICAgICAgICAgfCBvc2NpbGxhdGluZyBiZXR3ZWVuIHBvc2l0aXZlIGFuZCBuZWdhdGl2ZSAgICAgfFxuICAgIHwgICAgICAgICAgICAgIHwgICAgICAgICB8IHZhbHVlcyBvciByb3RhdGluZyBpbiB0aGUgY29tcGxleCBwbGFuZS4gICAgICB8XG4gICAgfCAgICAgICAgICAgICAgfCAgICAgICAgIHwgSXQgaXMgY29udmVuaWVudCwgaG93ZXZlciwgd2hlbiB0aGUgYmFzZSAgICAgIHxcbiAgICB8ICAgICAgICAgICAgICB8ICAgICAgICAgfCBpcyBwb3NpdGl2ZS4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfFxuICAgICstLS0tLS0tLS0tLS0tLSstLS0tLS0tLS0rLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0rXG4gICAgfCAxKipvbyAgICAgICAgfCBuYW4gICAgIHwgQmVjYXVzZSB0aGVyZSBhcmUgdmFyaW91cyBjYXNlcyB3aGVyZSAgICAgICAgIHxcbiAgICB8IDEqKi1vbyAgICAgICB8ICAgICAgICAgfCBsaW0oeCh0KSx0KT0xLCBsaW0oeSh0KSx0KT1vbyAob3IgLW9vKSwgICAgICAgfFxuICAgIHwgICAgICAgICAgICAgIHwgICAgICAgICB8IGJ1dCBsaW0oIHgodCkqKnkodCksIHQpICE9IDEuICBTZWUgWzNdLiAgICAgICB8XG4gICAgKy0tLS0tLS0tLS0tLS0tKy0tLS0tLS0tLSstLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLStcbiAgICB8IGIqKnpvbyAgICAgICB8IG5hbiAgICAgfCBCZWNhdXNlIGIqKnogaGFzIG5vIGxpbWl0IGFzIHogLT4gem9vICAgICAgICAgfFxuICAgICstLS0tLS0tLS0tLS0tLSstLS0tLS0tLS0rLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0rXG4gICAgfCAoLTEpKipvbyAgICAgfCBuYW4gICAgIHwgQmVjYXVzZSBvZiBvc2NpbGxhdGlvbnMgaW4gdGhlIGxpbWl0LiAgICAgICAgIHxcbiAgICB8ICgtMSkqKigtb28pICB8ICAgICAgICAgfCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfFxuICAgICstLS0tLS0tLS0tLS0tLSstLS0tLS0tLS0rLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0rXG4gICAgfCBvbyoqb28gICAgICAgfCBvbyAgICAgIHwgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHxcbiAgICArLS0tLS0tLS0tLS0tLS0rLS0tLS0tLS0tKy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tK1xuICAgIHwgb28qKi1vbyAgICAgIHwgMCAgICAgICB8ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB8XG4gICAgKy0tLS0tLS0tLS0tLS0tKy0tLS0tLS0tLSstLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLStcbiAgICB8ICgtb28pKipvbyAgICB8IG5hbiAgICAgfCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfFxuICAgIHwgKC1vbykqKi1vbyAgIHwgICAgICAgICB8ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB8XG4gICAgKy0tLS0tLS0tLS0tLS0tKy0tLS0tLS0tLSstLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLStcbiAgICB8IG9vKipJICAgICAgICB8IG5hbiAgICAgfCBvbyoqZSBjb3VsZCBwcm9iYWJseSBiZSBiZXN0IHRob3VnaHQgb2YgYXMgICAgfFxuICAgIHwgKC1vbykqKkkgICAgIHwgICAgICAgICB8IHRoZSBsaW1pdCBvZiB4KiplIGZvciByZWFsIHggYXMgeCB0ZW5kcyB0byAgICB8XG4gICAgfCAgICAgICAgICAgICAgfCAgICAgICAgIHwgb28uIElmIGUgaXMgSSwgdGhlbiB0aGUgbGltaXQgZG9lcyBub3QgZXhpc3QgIHxcbiAgICB8ICAgICAgICAgICAgICB8ICAgICAgICAgfCBhbmQgbmFuIGlzIHVzZWQgdG8gaW5kaWNhdGUgdGhhdC4gICAgICAgICAgICAgfFxuICAgICstLS0tLS0tLS0tLS0tLSstLS0tLS0tLS0rLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0rXG4gICAgfCBvbyoqKDErSSkgICAgfCB6b28gICAgIHwgSWYgdGhlIHJlYWwgcGFydCBvZiBlIGlzIHBvc2l0aXZlLCB0aGVuIHRoZSAgIHxcbiAgICB8ICgtb28pKiooMStJKSB8ICAgICAgICAgfCBsaW1pdCBvZiBhYnMoeCoqZSkgaXMgb28uIFNvIHRoZSBsaW1pdCB2YWx1ZSAgfFxuICAgIHwgICAgICAgICAgICAgIHwgICAgICAgICB8IGlzIHpvby4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB8XG4gICAgKy0tLS0tLS0tLS0tLS0tKy0tLS0tLS0tLSstLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLStcbiAgICB8IG9vKiooLTErSSkgICB8IDAgICAgICAgfCBJZiB0aGUgcmVhbCBwYXJ0IG9mIGUgaXMgbmVnYXRpdmUsIHRoZW4gdGhlICAgfFxuICAgIHwgLW9vKiooLTErSSkgIHwgICAgICAgICB8IGxpbWl0IGlzIDAuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB8XG4gICAgKy0tLS0tLS0tLS0tLS0tKy0tLS0tLS0tLSstLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLStcbiAgICBCZWNhdXNlIHN5bWJvbGljIGNvbXB1dGF0aW9ucyBhcmUgbW9yZSBmbGV4aWJsZSB0aGFuIGZsb2F0aW5nIHBvaW50XG4gICAgY2FsY3VsYXRpb25zIGFuZCB3ZSBwcmVmZXIgdG8gbmV2ZXIgcmV0dXJuIGFuIGluY29ycmVjdCBhbnN3ZXIsXG4gICAgd2UgY2hvb3NlIG5vdCB0byBjb25mb3JtIHRvIGFsbCBJRUVFIDc1NCBjb252ZW50aW9ucy4gIFRoaXMgaGVscHNcbiAgICB1cyBhdm9pZCBleHRyYSB0ZXN0LWNhc2UgY29kZSBpbiB0aGUgY2FsY3VsYXRpb24gb2YgbGltaXRzLlxuICAgIFNlZSBBbHNvXG4gICAgPT09PT09PT1cbiAgICBzeW1weS5jb3JlLm51bWJlcnMuSW5maW5pdHlcbiAgICBzeW1weS5jb3JlLm51bWJlcnMuTmVnYXRpdmVJbmZpbml0eVxuICAgIHN5bXB5LmNvcmUubnVtYmVycy5OYU5cbiAgICBSZWZlcmVuY2VzXG4gICAgPT09PT09PT09PVxuICAgIC4uIFsxXSBodHRwczovL2VuLndpa2lwZWRpYS5vcmcvd2lraS9FeHBvbmVudGlhdGlvblxuICAgIC4uIFsyXSBodHRwczovL2VuLndpa2lwZWRpYS5vcmcvd2lraS9FeHBvbmVudGlhdGlvbiNaZXJvX3RvX3RoZV9wb3dlcl9vZl96ZXJvXG4gICAgLi4gWzNdIGh0dHBzOi8vZW4ud2lraXBlZGlhLm9yZy93aWtpL0luZGV0ZXJtaW5hdGVfZm9ybXNcbiAgICAqL1xuICAgIHN0YXRpYyBpc19Qb3cgPSB0cnVlO1xuICAgIF9fc2xvdHNfXyA9IFtcImlzX2NvbW11dGF0aXZlXCJdO1xuXG4gICAgLy8gdG8tZG86IG5lZWRzIHN1cHBvcnQgZm9yIGVeeFxuICAgIGNvbnN0cnVjdG9yKGI6IGFueSwgZTogYW55LCBldmFsdWF0ZTogYm9vbGVhbiA9IHVuZGVmaW5lZCwgc2ltcGxpZnk6IGJvb2xlYW4gPSB0cnVlKSB7XG4gICAgICAgIHN1cGVyKGIsIGUpO1xuICAgICAgICB0aGlzLl9hcmdzID0gW2IsIGVdO1xuICAgICAgICBpZiAodHlwZW9mIGV2YWx1YXRlID09PSBcInVuZGVmaW5lZFwiKSB7XG4gICAgICAgICAgICBldmFsdWF0ZSA9IGdsb2JhbF9wYXJhbWV0ZXJzLmV2YWx1YXRlO1xuICAgICAgICB9XG4gICAgICAgIGlmIChzaW1wbGlmeSkge1xuICAgICAgICAgICAgaWYgKGV2YWx1YXRlKSB7XG4gICAgICAgICAgICAgICAgaWYgKGUgPT09IFMuQ29tcGxleEluZmluaXR5KSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBTLk5hTjtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgaWYgKGUgPT09IFMuSW5maW5pdHkpIHtcbiAgICAgICAgICAgICAgICAgICAgLy8gdGhpcyBwYXJ0IGlzIG5vdCBmdWxseSBkb25lXG4gICAgICAgICAgICAgICAgICAgIC8vIHNob3VsZCBiZSB1cGRhdGVkIHRvIHVzZSByZWxhdGlvbmFsXG4gICAgICAgICAgICAgICAgICAgIGlmIChiLmlzX3Bvc2l0aXZlKCkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBTLkluZmluaXR5O1xuICAgICAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKGIuaXNfemVybygpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gUy5aZXJvO1xuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGIuaXNfZmluaXRlKCkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gUy5Db21wbGV4SW5maW5pdHk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBTLk5hTjtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBpZiAoZSA9PT0gUy5aZXJvKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBTLk9uZTtcbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKGUgPT09IFMuT25lKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBiO1xuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoZSA9PT0gUy5OZWdhdGl2ZU9uZSAmJiAhYikge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gUy5Db21wbGV4SW5maW5pdHk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmICgoZS5pc19TeW1ib2woKSAmJiBlLmlzX2ludGVnZXIoKSB8fFxuICAgICAgICAgICAgICAgICAgICBlLmlzX0ludGVnZXIoKSAmJiAoYi5pc19OdW1iZXIoKSAmJlxuICAgICAgICAgICAgICAgICAgICBiLmlzX011bCgpIHx8IGIuaXNfTnVtYmVyKCkpKSAmJiAoZS5pc19leHRlbmRlZF9uZWdhdGl2ZSA9PT0gdHJ1ZSkpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGUuaXNfZXZlbigpIHx8IGUuaXNfZXZlbigpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBiID0gYi5fX211bF9fKFMuTmVnYXRpdmVPbmUpO1xuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIG5ldyBQb3coYi5fX211bF9fKFMuTmVnYXRpdmVPbmUpLCBlKS5fX211bF9fKFMuTmVnYXRpdmVPbmUpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIDAuXG4gICAgICAgICAgICAgICAgaWYgKGIgPT09IFMuTmFOIHx8IGUgPT09IFMuTmFOKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBTLk5hTjtcbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKGIgPT09IFMuT25lKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChlLmlzX2luZmluaXRlKCkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBTLk5hTjtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gUy5PbmU7XG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmIChlLmlzX051bWJlcigpICYmIGIuaXNfTnVtYmVyKCkpIHtcbiAgICAgICAgICAgICAgICAgICAgLy8gYmFzZSBFIHN0dWZmIG5vdCB5ZXQgaW1wbGVtZW50ZWRcbiAgICAgICAgICAgICAgICAgICAgY29uc3Qgb2JqID0gYi5fZXZhbF9wb3dlcihlKTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHR5cGVvZiBvYmogIT09IFwidW5kZWZpbmVkXCIpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIG9iai5pc19jb21tdXRhdGl2ZSA9ICgpID0+IChiLmlzX2NvbW11dGF0aXZlKCkgJiYgZS5pc19jb21tdXRhdGl2ZSgpKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBvYmo7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5pc19jb21tdXRhdGl2ZSA9ICgpID0+IChiLmlzX2NvbW11dGF0aXZlKCkgJiYgZS5pc19jb21tdXRhdGl2ZSgpKTtcbiAgICB9XG5cbiAgICBhc19iYXNlX2V4cCgpIHtcbiAgICAgICAgY29uc3QgYiA9IHRoaXMuX2FyZ3NbMF07XG4gICAgICAgIGNvbnN0IGUgPSB0aGlzLl9hcmdzWzFdO1xuICAgICAgICBpZiAoYi5pc19SYXRpb25hbCAmJiBiLnAgPT09IDEgJiYgYi5xICE9PSAxKSB7XG4gICAgICAgICAgICBjb25zdCBwMSA9IF9OdW1iZXJfLm5ldyhiLnEpO1xuICAgICAgICAgICAgY29uc3QgcDIgPSBlLl9fbXVsX18oUy5OZWdhdGl2ZU9uZSk7XG4gICAgICAgICAgICByZXR1cm4gW3AxLCBwMl07XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIFtiLCBlXTtcbiAgICB9XG5cbiAgICBzdGF0aWMgX25ldyhiOiBhbnksIGU6IGFueSkge1xuICAgICAgICByZXR1cm4gbmV3IFBvdyhiLCBlKTtcbiAgICB9XG5cbiAgICAvLyBXQiBhZGRpdGlvbiBmb3IgamFzbWluZSB0ZXN0c1xuICAgIHRvU3RyaW5nKCkge1xuICAgICAgICBjb25zdCBiID0gdGhpcy5fYXJnc1swXS50b1N0cmluZygpO1xuICAgICAgICBjb25zdCBlID0gdGhpcy5fYXJnc1sxXS50b1N0cmluZygpO1xuICAgICAgICByZXR1cm4gYiArIFwiXlwiICsgZTtcbiAgICB9XG59XG5cbk1hbmFnZWRQcm9wZXJ0aWVzLnJlZ2lzdGVyKFBvdyk7XG5HbG9iYWwucmVnaXN0ZXIoXCJQb3dcIiwgUG93Ll9uZXcpO1xuXG4vLyBpbXBsZW1lbnRlZCBkaWZmZXJlbnQgdGhhbiBzeW1weSwgYnV0IGhhcyBzYW1lIGZ1bmN0aW9uYWxpdHkgKGZvciBub3cpXG5leHBvcnQgZnVuY3Rpb24gbnJvb3QoeTogbnVtYmVyLCBuOiBudW1iZXIpIHtcbiAgICBjb25zdCB4ID0gTWF0aC5mbG9vcih5ICoqICgxIC8gbikpO1xuICAgIHJldHVybiBbeCwgeCoqbiA9PT0geV07XG59XG4iLCAiaW1wb3J0IHtkaXZtb2R9IGZyb20gXCIuLi9udGhlb3J5L2ZhY3Rvcl9cIjtcbmltcG9ydCB7QWRkfSBmcm9tIFwiLi9hZGRcIjtcbmltcG9ydCB7TWFuYWdlZFByb3BlcnRpZXN9IGZyb20gXCIuL2Fzc3VtcHRpb25zXCI7XG5pbXBvcnQge0Jhc2ljfSBmcm9tIFwiLi9iYXNpY1wiO1xuaW1wb3J0IHtFeHByfSBmcm9tIFwiLi9leHByXCI7XG5pbXBvcnQge0dsb2JhbH0gZnJvbSBcIi4vZ2xvYmFsXCI7XG5pbXBvcnQge2Z1enp5X25vdCwgX2Z1enp5X2dyb3VwfSBmcm9tIFwiLi9sb2dpY1wiO1xuaW1wb3J0IHtJbnRlZ2VyLCBSYXRpb25hbH0gZnJvbSBcIi4vbnVtYmVyc1wiO1xuaW1wb3J0IHtBc3NvY09wfSBmcm9tIFwiLi9vcGVyYXRpb25zXCI7XG5pbXBvcnQge2dsb2JhbF9wYXJhbWV0ZXJzfSBmcm9tIFwiLi9wYXJhbWV0ZXJzXCI7XG5pbXBvcnQge1Bvd30gZnJvbSBcIi4vcG93ZXJcIjtcbmltcG9ydCB7U30gZnJvbSBcIi4vc2luZ2xldG9uXCI7XG5pbXBvcnQge21peCwgYmFzZSwgSGFzaERpY3QsIEhhc2hTZXQsIEFyckRlZmF1bHREaWN0fSBmcm9tIFwiLi91dGlsaXR5XCI7XG5cbi8vICMgaW50ZXJuYWwgbWFya2VyIHRvIGluZGljYXRlOlxuLy8gXCJ0aGVyZSBhcmUgc3RpbGwgbm9uLWNvbW11dGF0aXZlIG9iamVjdHMgLS0gZG9uJ3QgZm9yZ2V0IHRvIHByb2Nlc3MgdGhlbVwiXG5cbi8vIG5vdCBjdXJyZW50bHkgYmVpbmcgdXNlZFxuY2xhc3MgTkNfTWFya2VyIHtcbiAgICBpc19PcmRlciA9IGZhbHNlO1xuICAgIGlzX011bCA9IGZhbHNlO1xuICAgIGlzX051bWJlciA9IGZhbHNlO1xuICAgIGlzX1BvbHkgPSBmYWxzZTtcblxuICAgIGlzX2NvbW11dGF0aXZlID0gZmFsc2U7XG59XG5cbmZ1bmN0aW9uIF9tdWxzb3J0KGFyZ3M6IGFueVtdKSB7XG4gICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5ldy1jYXBcbiAgICBhcmdzLnNvcnQoKGEsIGIpID0+IEJhc2ljLmNtcChhLCBiKSk7XG59XG5cbmV4cG9ydCBjbGFzcyBNdWwgZXh0ZW5kcyBtaXgoYmFzZSkud2l0aChFeHByLCBBc3NvY09wKSB7XG4gICAgLypcbiAgICBFeHByZXNzaW9uIHJlcHJlc2VudGluZyBtdWx0aXBsaWNhdGlvbiBvcGVyYXRpb24gZm9yIGFsZ2VicmFpYyBmaWVsZC5cbiAgICAuLiBkZXByZWNhdGVkOjogMS43XG4gICAgICAgVXNpbmcgYXJndW1lbnRzIHRoYXQgYXJlbid0IHN1YmNsYXNzZXMgb2YgOmNsYXNzOmB+LkV4cHJgIGluIGNvcmVcbiAgICAgICBvcGVyYXRvcnMgKDpjbGFzczpgfi5NdWxgLCA6Y2xhc3M6YH4uQWRkYCwgYW5kIDpjbGFzczpgfi5Qb3dgKSBpc1xuICAgICAgIGRlcHJlY2F0ZWQuIFNlZSA6cmVmOmBub24tZXhwci1hcmdzLWRlcHJlY2F0ZWRgIGZvciBkZXRhaWxzLlxuICAgIEV2ZXJ5IGFyZ3VtZW50IG9mIGBgTXVsKClgYCBtdXN0IGJlIGBgRXhwcmBgLiBJbmZpeCBvcGVyYXRvciBgYCpgYFxuICAgIG9uIG1vc3Qgc2NhbGFyIG9iamVjdHMgaW4gU3ltUHkgY2FsbHMgdGhpcyBjbGFzcy5cbiAgICBBbm90aGVyIHVzZSBvZiBgYE11bCgpYGAgaXMgdG8gcmVwcmVzZW50IHRoZSBzdHJ1Y3R1cmUgb2YgYWJzdHJhY3RcbiAgICBtdWx0aXBsaWNhdGlvbiBzbyB0aGF0IGl0cyBhcmd1bWVudHMgY2FuIGJlIHN1YnN0aXR1dGVkIHRvIHJldHVyblxuICAgIGRpZmZlcmVudCBjbGFzcy4gUmVmZXIgdG8gZXhhbXBsZXMgc2VjdGlvbiBmb3IgdGhpcy5cbiAgICBgYE11bCgpYGAgZXZhbHVhdGVzIHRoZSBhcmd1bWVudCB1bmxlc3MgYGBldmFsdWF0ZT1GYWxzZWBgIGlzIHBhc3NlZC5cbiAgICBUaGUgZXZhbHVhdGlvbiBsb2dpYyBpbmNsdWRlczpcbiAgICAxLiBGbGF0dGVuaW5nXG4gICAgICAgIGBgTXVsKHgsIE11bCh5LCB6KSlgYCAtPiBgYE11bCh4LCB5LCB6KWBgXG4gICAgMi4gSWRlbnRpdHkgcmVtb3ZpbmdcbiAgICAgICAgYGBNdWwoeCwgMSwgeSlgYCAtPiBgYE11bCh4LCB5KWBgXG4gICAgMy4gRXhwb25lbnQgY29sbGVjdGluZyBieSBgYC5hc19iYXNlX2V4cCgpYGBcbiAgICAgICAgYGBNdWwoeCwgeCoqMilgYCAtPiBgYFBvdyh4LCAzKWBgXG4gICAgNC4gVGVybSBzb3J0aW5nXG4gICAgICAgIGBgTXVsKHksIHgsIDIpYGAgLT4gYGBNdWwoMiwgeCwgeSlgYFxuICAgIFNpbmNlIG11bHRpcGxpY2F0aW9uIGNhbiBiZSB2ZWN0b3Igc3BhY2Ugb3BlcmF0aW9uLCBhcmd1bWVudHMgbWF5XG4gICAgaGF2ZSB0aGUgZGlmZmVyZW50IDpvYmo6YHN5bXB5LmNvcmUua2luZC5LaW5kKClgLiBLaW5kIG9mIHRoZVxuICAgIHJlc3VsdGluZyBvYmplY3QgaXMgYXV0b21hdGljYWxseSBpbmZlcnJlZC5cbiAgICBFeGFtcGxlc1xuICAgID09PT09PT09XG4gICAgPj4+IGZyb20gc3ltcHkgaW1wb3J0IE11bFxuICAgID4+PiBmcm9tIHN5bXB5LmFiYyBpbXBvcnQgeCwgeVxuICAgID4+PiBNdWwoeCwgMSlcbiAgICB4XG4gICAgPj4+IE11bCh4LCB4KVxuICAgIHgqKjJcbiAgICBJZiBgYGV2YWx1YXRlPUZhbHNlYGAgaXMgcGFzc2VkLCByZXN1bHQgaXMgbm90IGV2YWx1YXRlZC5cbiAgICA+Pj4gTXVsKDEsIDIsIGV2YWx1YXRlPUZhbHNlKVxuICAgIDEqMlxuICAgID4+PiBNdWwoeCwgeCwgZXZhbHVhdGU9RmFsc2UpXG4gICAgeCp4XG4gICAgYGBNdWwoKWBgIGFsc28gcmVwcmVzZW50cyB0aGUgZ2VuZXJhbCBzdHJ1Y3R1cmUgb2YgbXVsdGlwbGljYXRpb25cbiAgICBvcGVyYXRpb24uXG4gICAgPj4+IGZyb20gc3ltcHkgaW1wb3J0IE1hdHJpeFN5bWJvbFxuICAgID4+PiBBID0gTWF0cml4U3ltYm9sKCdBJywgMiwyKVxuICAgID4+PiBleHByID0gTXVsKHgseSkuc3Vicyh7eTpBfSlcbiAgICA+Pj4gZXhwclxuICAgIHgqQVxuICAgID4+PiB0eXBlKGV4cHIpXG4gICAgPGNsYXNzICdzeW1weS5tYXRyaWNlcy5leHByZXNzaW9ucy5tYXRtdWwuTWF0TXVsJz5cbiAgICBTZWUgQWxzb1xuICAgID09PT09PT09XG4gICAgTWF0TXVsXG4gICAgKi9cbiAgICBfX3Nsb3RzX186IGFueVtdID0gW107XG4gICAgYXJnczogYW55W107XG4gICAgc3RhdGljIGlzX011bCA9IHRydWU7XG4gICAgX2FyZ3NfdHlwZSA9IEV4cHI7XG4gICAgc3RhdGljIGlkZW50aXR5ID0gUy5PbmU7XG5cbiAgICBjb25zdHJ1Y3RvcihldmFsdWF0ZTogYm9vbGVhbiwgc2ltcGxpZnk6IGJvb2xlYW4sIC4uLmFyZ3M6IGFueSkge1xuICAgICAgICBzdXBlcihNdWwsIGV2YWx1YXRlLCBzaW1wbGlmeSwgLi4uYXJncyk7XG4gICAgfVxuXG4gICAgZmxhdHRlbihzZXE6IGFueSkge1xuICAgICAgICAvKiBSZXR1cm4gY29tbXV0YXRpdmUsIG5vbmNvbW11dGF0aXZlIGFuZCBvcmRlciBhcmd1bWVudHMgYnlcbiAgICAgICAgY29tYmluaW5nIHJlbGF0ZWQgdGVybXMuXG4gICAgICAgIE5vdGVzXG4gICAgICAgID09PT09XG4gICAgICAgICAgICAqIEluIGFuIGV4cHJlc3Npb24gbGlrZSBgYGEqYipjYGAsIFB5dGhvbiBwcm9jZXNzIHRoaXMgdGhyb3VnaCBTeW1QeVxuICAgICAgICAgICAgICBhcyBgYE11bChNdWwoYSwgYiksIGMpYGAuIFRoaXMgY2FuIGhhdmUgdW5kZXNpcmFibGUgY29uc2VxdWVuY2VzLlxuICAgICAgICAgICAgICAtICBTb21ldGltZXMgdGVybXMgYXJlIG5vdCBjb21iaW5lZCBhcyBvbmUgd291bGQgbGlrZTpcbiAgICAgICAgICAgICAgICAge2MuZi4gaHR0cHM6Ly9naXRodWIuY29tL3N5bXB5L3N5bXB5L2lzc3Vlcy80NTk2fVxuICAgICAgICAgICAgICAgID4+PiBmcm9tIHN5bXB5IGltcG9ydCBNdWwsIHNxcnRcbiAgICAgICAgICAgICAgICA+Pj4gZnJvbSBzeW1weS5hYmMgaW1wb3J0IHgsIHksIHpcbiAgICAgICAgICAgICAgICA+Pj4gMiooeCArIDEpICMgdGhpcyBpcyB0aGUgMi1hcmcgTXVsIGJlaGF2aW9yXG4gICAgICAgICAgICAgICAgMip4ICsgMlxuICAgICAgICAgICAgICAgID4+PiB5Kih4ICsgMSkqMlxuICAgICAgICAgICAgICAgIDIqeSooeCArIDEpXG4gICAgICAgICAgICAgICAgPj4+IDIqKHggKyAxKSp5ICMgMi1hcmcgcmVzdWx0IHdpbGwgYmUgb2J0YWluZWQgZmlyc3RcbiAgICAgICAgICAgICAgICB5KigyKnggKyAyKVxuICAgICAgICAgICAgICAgID4+PiBNdWwoMiwgeCArIDEsIHkpICMgYWxsIDMgYXJncyBzaW11bHRhbmVvdXNseSBwcm9jZXNzZWRcbiAgICAgICAgICAgICAgICAyKnkqKHggKyAxKVxuICAgICAgICAgICAgICAgID4+PiAyKigoeCArIDEpKnkpICMgcGFyZW50aGVzZXMgY2FuIGNvbnRyb2wgdGhpcyBiZWhhdmlvclxuICAgICAgICAgICAgICAgIDIqeSooeCArIDEpXG4gICAgICAgICAgICAgICAgUG93ZXJzIHdpdGggY29tcG91bmQgYmFzZXMgbWF5IG5vdCBmaW5kIGEgc2luZ2xlIGJhc2UgdG9cbiAgICAgICAgICAgICAgICBjb21iaW5lIHdpdGggdW5sZXNzIGFsbCBhcmd1bWVudHMgYXJlIHByb2Nlc3NlZCBhdCBvbmNlLlxuICAgICAgICAgICAgICAgIFBvc3QtcHJvY2Vzc2luZyBtYXkgYmUgbmVjZXNzYXJ5IGluIHN1Y2ggY2FzZXMuXG4gICAgICAgICAgICAgICAge2MuZi4gaHR0cHM6Ly9naXRodWIuY29tL3N5bXB5L3N5bXB5L2lzc3Vlcy81NzI4fVxuICAgICAgICAgICAgICAgID4+PiBhID0gc3FydCh4KnNxcnQoeSkpXG4gICAgICAgICAgICAgICAgPj4+IGEqKjNcbiAgICAgICAgICAgICAgICAoeCpzcXJ0KHkpKSoqKDMvMilcbiAgICAgICAgICAgICAgICA+Pj4gTXVsKGEsYSxhKVxuICAgICAgICAgICAgICAgICh4KnNxcnQoeSkpKiooMy8yKVxuICAgICAgICAgICAgICAgID4+PiBhKmEqYVxuICAgICAgICAgICAgICAgIHgqc3FydCh5KSpzcXJ0KHgqc3FydCh5KSlcbiAgICAgICAgICAgICAgICA+Pj4gXy5zdWJzKGEuYmFzZSwgeikuc3Vicyh6LCBhLmJhc2UpXG4gICAgICAgICAgICAgICAgKHgqc3FydCh5KSkqKigzLzIpXG4gICAgICAgICAgICAgIC0gIElmIG1vcmUgdGhhbiB0d28gdGVybXMgYXJlIGJlaW5nIG11bHRpcGxpZWQgdGhlbiBhbGwgdGhlXG4gICAgICAgICAgICAgICAgIHByZXZpb3VzIHRlcm1zIHdpbGwgYmUgcmUtcHJvY2Vzc2VkIGZvciBlYWNoIG5ldyBhcmd1bWVudC5cbiAgICAgICAgICAgICAgICAgU28gaWYgZWFjaCBvZiBgYGFgYCwgYGBiYGAgYW5kIGBgY2BgIHdlcmUgOmNsYXNzOmBNdWxgXG4gICAgICAgICAgICAgICAgIGV4cHJlc3Npb24sIHRoZW4gYGBhKmIqY2BgIChvciBidWlsZGluZyB1cCB0aGUgcHJvZHVjdFxuICAgICAgICAgICAgICAgICB3aXRoIGBgKj1gYCkgd2lsbCBwcm9jZXNzIGFsbCB0aGUgYXJndW1lbnRzIG9mIGBgYWBgIGFuZFxuICAgICAgICAgICAgICAgICBgYGJgYCB0d2ljZTogb25jZSB3aGVuIGBgYSpiYGAgaXMgY29tcHV0ZWQgYW5kIGFnYWluIHdoZW5cbiAgICAgICAgICAgICAgICAgYGBjYGAgaXMgbXVsdGlwbGllZC5cbiAgICAgICAgICAgICAgICAgVXNpbmcgYGBNdWwoYSwgYiwgYylgYCB3aWxsIHByb2Nlc3MgYWxsIGFyZ3VtZW50cyBvbmNlLlxuICAgICAgICAgICAgKiBUaGUgcmVzdWx0cyBvZiBNdWwgYXJlIGNhY2hlZCBhY2NvcmRpbmcgdG8gYXJndW1lbnRzLCBzbyBmbGF0dGVuXG4gICAgICAgICAgICAgIHdpbGwgb25seSBiZSBjYWxsZWQgb25jZSBmb3IgYGBNdWwoYSwgYiwgYylgYC4gSWYgeW91IGNhblxuICAgICAgICAgICAgICBzdHJ1Y3R1cmUgYSBjYWxjdWxhdGlvbiBzbyB0aGUgYXJndW1lbnRzIGFyZSBtb3N0IGxpa2VseSB0byBiZVxuICAgICAgICAgICAgICByZXBlYXRzIHRoZW4gdGhpcyBjYW4gc2F2ZSB0aW1lIGluIGNvbXB1dGluZyB0aGUgYW5zd2VyLiBGb3JcbiAgICAgICAgICAgICAgZXhhbXBsZSwgc2F5IHlvdSBoYWQgYSBNdWwsIE0sIHRoYXQgeW91IHdpc2hlZCB0byBkaXZpZGUgYnkgYGBkW2ldYGBcbiAgICAgICAgICAgICAgYW5kIG11bHRpcGx5IGJ5IGBgbltpXWBgIGFuZCB5b3Ugc3VzcGVjdCB0aGVyZSBhcmUgbWFueSByZXBlYXRzXG4gICAgICAgICAgICAgIGluIGBgbmBgLiBJdCB3b3VsZCBiZSBiZXR0ZXIgdG8gY29tcHV0ZSBgYE0qbltpXS9kW2ldYGAgcmF0aGVyXG4gICAgICAgICAgICAgIHRoYW4gYGBNL2RbaV0qbltpXWBgIHNpbmNlIGV2ZXJ5IHRpbWUgbltpXSBpcyBhIHJlcGVhdCwgdGhlXG4gICAgICAgICAgICAgIHByb2R1Y3QsIGBgTSpuW2ldYGAgd2lsbCBiZSByZXR1cm5lZCB3aXRob3V0IGZsYXR0ZW5pbmcgLS0gdGhlXG4gICAgICAgICAgICAgIGNhY2hlZCB2YWx1ZSB3aWxsIGJlIHJldHVybmVkLiBJZiB5b3UgZGl2aWRlIGJ5IHRoZSBgYGRbaV1gYFxuICAgICAgICAgICAgICBmaXJzdCAoYW5kIHRob3NlIGFyZSBtb3JlIHVuaXF1ZSB0aGFuIHRoZSBgYG5baV1gYCkgdGhlbiB0aGF0IHdpbGxcbiAgICAgICAgICAgICAgY3JlYXRlIGEgbmV3IE11bCwgYGBNL2RbaV1gYCB0aGUgYXJncyBvZiB3aGljaCB3aWxsIGJlIHRyYXZlcnNlZFxuICAgICAgICAgICAgICBhZ2FpbiB3aGVuIGl0IGlzIG11bHRpcGxpZWQgYnkgYGBuW2ldYGAuXG4gICAgICAgICAgICAgIHtjLmYuIGh0dHBzOi8vZ2l0aHViLmNvbS9zeW1weS9zeW1weS9pc3N1ZXMvNTcwNn1cbiAgICAgICAgICAgICAgVGhpcyBjb25zaWRlcmF0aW9uIGlzIG1vb3QgaWYgdGhlIGNhY2hlIGlzIHR1cm5lZCBvZmYuXG4gICAgICAgICAgICBOQlxuICAgICAgICAgICAgLS1cbiAgICAgICAgICAgICAgVGhlIHZhbGlkaXR5IG9mIHRoZSBhYm92ZSBub3RlcyBkZXBlbmRzIG9uIHRoZSBpbXBsZW1lbnRhdGlvblxuICAgICAgICAgICAgICBkZXRhaWxzIG9mIE11bCBhbmQgZmxhdHRlbiB3aGljaCBtYXkgY2hhbmdlIGF0IGFueSB0aW1lLiBUaGVyZWZvcmUsXG4gICAgICAgICAgICAgIHlvdSBzaG91bGQgb25seSBjb25zaWRlciB0aGVtIHdoZW4geW91ciBjb2RlIGlzIGhpZ2hseSBwZXJmb3JtYW5jZVxuICAgICAgICAgICAgICBzZW5zaXRpdmUuXG4gICAgICAgICAgICAgIFJlbW92YWwgb2YgMSBmcm9tIHRoZSBzZXF1ZW5jZSBpcyBhbHJlYWR5IGhhbmRsZWQgYnkgQXNzb2NPcC5fX25ld19fLlxuICAgICAgICAqL1xuICAgICAgICBsZXQgcnYgPSB1bmRlZmluZWQ7XG4gICAgICAgIGlmIChzZXEubGVuZ3RoID09PSAyKSB7XG4gICAgICAgICAgICBsZXQgW2EsIGJdID0gc2VxO1xuICAgICAgICAgICAgaWYgKGIuaXNfUmF0aW9uYWwoKSkge1xuICAgICAgICAgICAgICAgIFthLCBiXSA9IFtiLCBhXTtcbiAgICAgICAgICAgICAgICBzZXEgPSBbYSwgYl07XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoIShhLmlzX3plcm8oKSAmJiBhLmlzX1JhdGlvbmFsKCkpKSB7XG4gICAgICAgICAgICAgICAgbGV0IHI7XG4gICAgICAgICAgICAgICAgW3IsIGJdID0gYi5hc19jb2VmZl9NdWwoKTtcbiAgICAgICAgICAgICAgICBpZiAoYi5pc19BZGQoKSkge1xuICAgICAgICAgICAgICAgICAgICBpZiAociAhPT0gUy5PbmUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGxldCBhcmI7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBhciA9IGEuX19tdWxfXyhyKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChhciA9PT0gUy5PbmUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBhcmIgPSBiO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBhcmIgPSB0aGlzLmNvbnN0cnVjdG9yKGZhbHNlLCB0cnVlLCBhLl9fbXVsX18ociksIGIpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgcnYgPSBbW2FyYl0sIFtdLCB1bmRlZmluZWRdO1xuICAgICAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKGdsb2JhbF9wYXJhbWV0ZXJzLmRpc3RyaWJ1dGUgJiYgYi5pc19jb21tdXRhdGl2ZSgpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBhcmc6IGFueSA9IFtdO1xuICAgICAgICAgICAgICAgICAgICAgICAgZm9yIChjb25zdCBiaSBvZiBiLl9hcmdzKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYXJnLnB1c2godGhpcy5fa2VlcF9jb2VmZihhLCBiaSkpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgbmV3YiA9IG5ldyBBZGQodHJ1ZSwgdHJ1ZSwgLi4uYXJnKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJ2ID0gW1tuZXdiXSwgW10sIHVuZGVmaW5lZF07XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAocnYpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gcnY7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBsZXQgY19wYXJ0OiBhbnkgPSBbXTtcbiAgICAgICAgY29uc3QgbmNfc2VxID0gW107XG4gICAgICAgIGxldCBuY19wYXJ0OiBhbnkgPSBbXTtcbiAgICAgICAgbGV0IGNvZWZmID0gUy5PbmU7XG4gICAgICAgIGxldCBjX3Bvd2VycyA9IFtdO1xuICAgICAgICBsZXQgbmVnMWUgPSBTLlplcm87IGxldCBudW1fZXhwID0gW107XG4gICAgICAgIGNvbnN0IHBudW1fcmF0ID0gbmV3IEhhc2hEaWN0KCk7XG4gICAgICAgIGNvbnN0IG9yZGVyX3N5bWJvbHM6IGFueVtdID0gW107XG5cbiAgICAgICAgZm9yIChsZXQgbyBvZiBzZXEpIHtcbiAgICAgICAgICAgIGlmIChvLmlzX011bCgpKSB7XG4gICAgICAgICAgICAgICAgaWYgKG8uaXNfY29tbXV0YXRpdmUoKSkge1xuICAgICAgICAgICAgICAgICAgICBzZXEucHVzaCguLi5vLl9hcmdzKTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBmb3IgKGNvbnN0IHEgb2Ygby5fYXJncykge1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHEuaXNfY29tbXV0YXRpdmUoKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNlcS5wdXNoKHEpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBuY19zZXEucHVzaChxKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoby5pc19OdW1iZXIoKSkge1xuICAgICAgICAgICAgICAgIGlmIChvID09PSBTLk5hTiB8fCBjb2VmZiA9PT0gUy5Db21wbGV4SW5maW5pdHkgJiYgby5pc196ZXJvKCkpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFtbUy5OYU5dLCBbXSwgdW5kZWZpbmVkXTtcbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKGNvZWZmLmlzX051bWJlcigpKSB7XG4gICAgICAgICAgICAgICAgICAgIGNvZWZmID0gY29lZmYuX19tdWxfXyhvKTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGNvZWZmID09PSBTLk5hTikge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFtbUy5OYU5dLCBbXSwgdW5kZWZpbmVkXTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAobyA9PT0gUy5Db21wbGV4SW5maW5pdHkpIHtcbiAgICAgICAgICAgICAgICBpZiAoIShjb2VmZikpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFtbUy5OYU5dLCBbXSwgdW5kZWZpbmVkXTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgY29lZmYgPSBTLkNvbXBsZXhJbmZpbml0eTtcbiAgICAgICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoby5pc19jb21tdXRhdGl2ZSgpKSB7XG4gICAgICAgICAgICAgICAgbGV0IGU7IGxldCBiO1xuICAgICAgICAgICAgICAgIFtiLCBlXSA9IG8uYXNfYmFzZV9leHAoKTtcbiAgICAgICAgICAgICAgICBpZiAoby5pc19Qb3coKSkge1xuICAgICAgICAgICAgICAgICAgICBpZiAoYi5pc19OdW1iZXIoKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGUuaXNfUmF0aW9uYWwoKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChlLmlzX0ludGVnZXIoKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb2VmZiA9IGNvZWZmLl9fbXVsX18obmV3IFBvdyhiLCBlKSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoZS5pc19uZWdhdGl2ZSgpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNlcS5wdXNoKG5ldyBQb3coYiwgZSkpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKGIuaXNfbmVnYXRpdmUoKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBuZWcxZSA9IG5lZzFlLl9fYWRkX18oZSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGIgPSBiLl9fbXVsX18oUy5OZWdhdGl2ZU9uZSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChiICE9PSBTLk9uZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBwbnVtX3JhdC5zZXRkZWZhdWx0KGIsIFtdKS5wdXNoKGUpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoYi5pc19wb3NpdGl2ZSgpIHx8IGIuaXNfaW50ZWdlcigpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbnVtX2V4cC5wdXNoKFtiLCBlXSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgY19wb3dlcnMucHVzaChbYiwgZV0pO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBpZiAobyAhPT0gTkNfTWFya2VyKSB7XG4gICAgICAgICAgICAgICAgICAgIG5jX3NlcS5wdXNoKG8pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB3aGlsZSAobmNfc2VxKSB7XG4gICAgICAgICAgICAgICAgICAgIG8gPSBuY19zZXEuc3BsaWNlKDAsIDEpO1xuICAgICAgICAgICAgICAgICAgICBpZiAoIShuY19wYXJ0KSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgbmNfcGFydC5wdXNoKG8pO1xuICAgICAgICAgICAgICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgY29uc3QgbzEgPSBuY19wYXJ0LnBvcCgpO1xuICAgICAgICAgICAgICAgICAgICBjb25zdCBbYjEsIGUxXSA9IG8xLmFzX2Jhc2VfZXhwKCk7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IFtiMiwgZTJdID0gby5hc19iYXNlX2V4cCgpO1xuICAgICAgICAgICAgICAgICAgICBjb25zdCBuZXdfZXhwID0gZTEuX19hZGRfXyhlMik7XG4gICAgICAgICAgICAgICAgICAgIGlmIChiMS5lcShiMikgJiYgIShuZXdfZXhwLmlzX0FkZCgpKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgbzEyID0gYjEuX2V2YWxfcG93ZXIobmV3X2V4cCk7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAobzEyLmlzX2NvbW11dGF0aXZlKCkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzZXEucHVzaChvMTIpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBuY19zZXEuc3BsaWNlKDAsIDAsIG8xMik7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBuY19wYXJ0LnB1c2gobzEpO1xuICAgICAgICAgICAgICAgICAgICAgICAgbmNfcGFydC5wdXNoKG8pO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgZnVuY3Rpb24gX2dhdGhlcihjX3Bvd2VyczogYW55W10pIHtcbiAgICAgICAgICAgIGNvbnN0IGNvbW1vbl9iID0gbmV3IEhhc2hEaWN0KCk7XG4gICAgICAgICAgICBmb3IgKGNvbnN0IFtiLCBlXSBvZiBjX3Bvd2Vycykge1xuICAgICAgICAgICAgICAgIGNvbnN0IGNvID0gZS5hc19jb2VmZl9NdWwoKTtcbiAgICAgICAgICAgICAgICBjb21tb25fYi5zZXRkZWZhdWx0KGIsIG5ldyBIYXNoRGljdCgpKS5zZXRkZWZhdWx0KGNvWzFdLCBbXSkucHVzaChjb1swXSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tdW51c2VkLXZhcnNcbiAgICAgICAgICAgIGZvciAoY29uc3QgW2IsIGRdIG9mIGNvbW1vbl9iLmVudHJpZXMoKSkge1xuICAgICAgICAgICAgICAgIGZvciAoY29uc3QgW2RpLCBsaV0gb2YgZC5lbnRyaWVzKCkpIHtcbiAgICAgICAgICAgICAgICAgICAgZC5hZGQoZGksIG5ldyBBZGQodHJ1ZSwgdHJ1ZSwgLi4ubGkpKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBjb25zdCBuZXdfY19wb3dlcnMgPSBbXTtcbiAgICAgICAgICAgIGZvciAoY29uc3QgW2IsIGVdIG9mIGNvbW1vbl9iLmVudHJpZXMoKSkge1xuICAgICAgICAgICAgICAgIGZvciAoY29uc3QgW3QsIGNdIG9mIGUuZW50cmllcygpKSB7XG4gICAgICAgICAgICAgICAgICAgIG5ld19jX3Bvd2Vycy5wdXNoKFtiLCBjLl9fbXVsX18odCldKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gbmV3X2NfcG93ZXJzO1xuICAgICAgICB9XG5cbiAgICAgICAgY19wb3dlcnMgPSBfZ2F0aGVyKGNfcG93ZXJzKTtcbiAgICAgICAgbnVtX2V4cCA9IF9nYXRoZXIobnVtX2V4cCk7XG5cbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCAyOyBpKyspIHtcbiAgICAgICAgICAgIGNvbnN0IG5ld19jX3Bvd2VyczogYW55W10gPSBbXTtcbiAgICAgICAgICAgIGxldCBjaGFuZ2VkID0gZmFsc2U7XG4gICAgICAgICAgICBmb3IgKGxldCBbYiwgZV0gb2YgY19wb3dlcnMpIHtcbiAgICAgICAgICAgICAgICBsZXQgcDogYW55O1xuICAgICAgICAgICAgICAgIGlmIChlLmlzX3plcm8oKSA9PT0gdHJ1ZSkge1xuICAgICAgICAgICAgICAgICAgICBpZiAoKGIuaXNfQWRkKCkgfHwgYi5pc19NdWwoKSAmJlxuICAgICAgICAgICAgICAgICAgICAgICAgYi5fYXJncy5pbmNsdWRlcyhTLkNvbXBsZXhJbmZpbml0eSwgUy5JbmZpbml0eSwgUy5OZWZhdGl2ZUluZmluaXR5KSkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBbW1MuTmFOXSwgW10sIHVuZGVmaW5lZF07XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGlmIChlID09PSBTLk9uZSkge1xuICAgICAgICAgICAgICAgICAgICBpZiAoYi5pc19OdW1iZXIoKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgY29lZmYgPSBjb2VmZi5fX211bF9fKGIpO1xuICAgICAgICAgICAgICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgcCA9IGI7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGlmIChlICE9PSBTLk9uZSkge1xuICAgICAgICAgICAgICAgICAgICBwID0gbmV3IFBvdyhiLCBlKTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHAuaXNfUG93KCkgJiYgIWIuaXNfUG93KCkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IGJpID0gYjtcbiAgICAgICAgICAgICAgICAgICAgICAgIFtiLCBlXSA9IHAuYXNfYmFzZV9leHAoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChiICE9PSBiaSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNoYW5nZWQgPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGNfcGFydC5wdXNoKHApO1xuICAgICAgICAgICAgICAgIG5ld19jX3Bvd2Vycy5wdXNoKFtiLCBlXSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBjb25zdCBhcmdzZXQgPSBuZXcgSGFzaFNldCgpO1xuICAgICAgICAgICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5vLXVudXNlZC12YXJzXG4gICAgICAgICAgICBmb3IgKGNvbnN0IFtiLCBlXSBvZiBuZXdfY19wb3dlcnMpIHtcbiAgICAgICAgICAgICAgICBhcmdzZXQuYWRkKGIpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKGNoYW5nZWQgJiYgYXJnc2V0LnNpemUgIT09IG5ld19jX3Bvd2Vycy5sZW5ndGgpIHtcbiAgICAgICAgICAgICAgICBjX3BhcnQgPSBbXTtcbiAgICAgICAgICAgICAgICBjX3Bvd2VycyA9IF9nYXRoZXIobmV3X2NfcG93ZXJzKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgY29uc3QgaW52X2V4cF9kaWN0ID0gbmV3IEhhc2hEaWN0KCk7XG4gICAgICAgIGZvciAoY29uc3QgW2IsIGVdIG9mIG51bV9leHApIHtcbiAgICAgICAgICAgIGludl9leHBfZGljdC5zZXRkZWZhdWx0KGUsIFtdKS5wdXNoKGIpO1xuICAgICAgICB9XG4gICAgICAgIGZvciAoY29uc3QgW2UsIGJdIG9mIGludl9leHBfZGljdC5lbnRyaWVzKCkpIHtcbiAgICAgICAgICAgIGludl9leHBfZGljdC5hZGQoZSwgbmV3IE11bCh0cnVlLCB0cnVlLCAuLi5iKSk7XG4gICAgICAgIH1cbiAgICAgICAgY29uc3QgY19wYXJ0X2FyZyA9IFtdO1xuICAgICAgICBmb3IgKGNvbnN0IFtlLCBiXSBvZiBpbnZfZXhwX2RpY3QuZW50cmllcygpKSB7XG4gICAgICAgICAgICBpZiAoZSkge1xuICAgICAgICAgICAgICAgIGNfcGFydF9hcmcucHVzaChuZXcgUG93KGIsIGUpKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBjX3BhcnQucHVzaCguLi5jX3BhcnRfYXJnKTtcblxuICAgICAgICBjb25zdCBjb21iX2UgPSBuZXcgSGFzaERpY3QoKTtcbiAgICAgICAgZm9yIChjb25zdCBbYiwgZV0gb2YgcG51bV9yYXQuZW50cmllcygpKSB7XG4gICAgICAgICAgICBjb21iX2Uuc2V0ZGVmYXVsdChuZXcgQWRkKHRydWUsIHRydWUsIC4uLmUpLCBbXSkucHVzaChiKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IG51bV9yYXQgPSBbXTtcbiAgICAgICAgZm9yIChsZXQgW2UsIGJdIG9mIGNvbWJfZS5lbnRyaWVzKCkpIHtcbiAgICAgICAgICAgIGIgPSBuZXcgTXVsKHRydWUsIHRydWUsIC4uLmIpO1xuICAgICAgICAgICAgaWYgKGUucSA9PT0gMSkge1xuICAgICAgICAgICAgICAgIGNvZWZmID0gY29lZmYuX19tdWxfXyhuZXcgUG93KGIsIGUpKTtcbiAgICAgICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChlLnAgPiBlLnEpIHtcbiAgICAgICAgICAgICAgICBjb25zdCBbZV9pLCBlcF0gPSBkaXZtb2QoZS5wLCBlLnEpO1xuICAgICAgICAgICAgICAgIGNvZWZmID0gY29lZmYuX19tdWxfXyhuZXcgUG93KGIsIGVfaSkpO1xuICAgICAgICAgICAgICAgIGUgPSBuZXcgUmF0aW9uYWwoZXAsIGUucSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBudW1fcmF0LnB1c2goW2IsIGVdKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IHBuZXcgPSBuZXcgQXJyRGVmYXVsdERpY3QoKTtcbiAgICAgICAgbGV0IGkgPSAwO1xuICAgICAgICB3aGlsZSAoaSA8IG51bV9yYXQubGVuZ3RoKSB7XG4gICAgICAgICAgICBsZXQgW2JpLCBlaV06IGFueSA9IG51bV9yYXRbaV07XG4gICAgICAgICAgICBjb25zdCBncm93ID0gW107XG4gICAgICAgICAgICBmb3IgKGxldCBqID0gaSArIDE7IGogPCBudW1fcmF0Lmxlbmd0aDsgaisrKSB7XG4gICAgICAgICAgICAgICAgY29uc3QgW2JqLCBlal06IGFueSA9IG51bV9yYXRbal07XG4gICAgICAgICAgICAgICAgY29uc3QgZyA9IGJpLmdjZChiaik7XG4gICAgICAgICAgICAgICAgaWYgKGcgIT09IFMuT25lKSB7XG4gICAgICAgICAgICAgICAgICAgIGxldCBlID0gZWkuX19hZGRfXyhlaik7XG4gICAgICAgICAgICAgICAgICAgIGlmIChlLnEgPT09IDEpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvZWZmID0gY29lZmYuX19tdWxfXyhuZXcgUG93KGcsIGUpKTtcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChlLnAgPiBlLnEpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBbZV9pLCBlcF0gPSBkaXZtb2QoZS5wLCBlLnEpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvZWZmID0gY29lZmYuX19tdWxfXyhuZXcgUG93KGcsIGVfaSkpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGUgPSBuZXcgUmF0aW9uYWwoZXAsIGUucSk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICBncm93LnB1c2goW2csIGVdKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBudW1fcmF0W2pdID0gW2JqL2csIGVqXTtcbiAgICAgICAgICAgICAgICAgICAgYmkgPSBiaS9nO1xuICAgICAgICAgICAgICAgICAgICBpZiAoYmkgPT09IFMuT25lKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChiaSAhPT0gUy5PbmUpIHtcbiAgICAgICAgICAgICAgICBjb25zdCBvYmo6IGFueSA9IG5ldyBQb3coYmksIGVpKTtcbiAgICAgICAgICAgICAgICBpZiAob2JqLmlzX051bWJlcigpKSB7XG4gICAgICAgICAgICAgICAgICAgIGNvZWZmID0gY29lZmYuX19tdWxfXyhvYmopO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIGZvciAoY29uc3QgaXRlbSBvZiB0aGlzLm1ha2VfYXJncyhNdWwsIG9iaikpIHsgLy8gISEhISEhXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoaXRlbS5pc19OdW1iZXIoKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvZWZmID0gY29lZmYuX19tdWxfXyhvYmopO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBbYmksIGVpXSA9IGl0ZW0uX2FyZ3M7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcG5ldy5hZGQoZWksIHBuZXcuZ2V0KGVpKS5jb25jYXQoYmkpKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIG51bV9yYXQucHVzaCguLi5ncm93KTtcbiAgICAgICAgICAgIGkrKztcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChuZWcxZSAhPT0gUy5aZXJvKSB7XG4gICAgICAgICAgICBsZXQgbjsgbGV0IHE7IGxldCBwO1xuICAgICAgICAgICAgW3AsIHFdID0gbmVnMWUuX2FzX251bWVyX2Rlbm9tKCk7XG4gICAgICAgICAgICBbbiwgcF0gPSBkaXZtb2QocC5wLCBxLnApO1xuICAgICAgICAgICAgaWYgKG4gJSAyICE9PSAwKSB7XG4gICAgICAgICAgICAgICAgY29lZmYgPSBjb2VmZi5fX211bF9fKFMuTmVnYXRpdmVPbmUpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKHEgPT09IDIpIHtcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJpbWFnaW5hcnkgbnVtYmVycyBub3QgeWV0IHN1cHBvcnRlZFwiKTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAocCkge1xuICAgICAgICAgICAgICAgIG5lZzFlID0gbmV3IFJhdGlvbmFsKHAsIHEpO1xuICAgICAgICAgICAgICAgIGxldCBlbnRlcmVsc2U6IGJvb2xlYW4gPSB0cnVlO1xuICAgICAgICAgICAgICAgIGZvciAoY29uc3QgW2UsIGJdIG9mIHBuZXcuZW50cmllcygpKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChlID09PSBuZWcxZSAmJiBiLmlzX3Bvc2l0aXZlKCkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHBuZXcuYWRkKGUsIHBuZXcuZ2V0KGUpIC0gYik7XG4gICAgICAgICAgICAgICAgICAgICAgICBlbnRlcmVsc2UgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGlmIChlbnRlcmVsc2UpIHtcbiAgICAgICAgICAgICAgICAgICAgY19wYXJ0LnB1c2gobmV3IFBvdyhTLk5lZ2F0aXZlT25lLCBuZWcxZSwgZmFsc2UpKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCBjX3BhcnRfYXJndjIgPSBbXTtcbiAgICAgICAgZm9yIChsZXQgW2UsIGJdIG9mIHBuZXcuZW50cmllcygpKSB7XG4gICAgICAgICAgICBpZiAoQXJyYXkuaXNBcnJheShiKSkge1xuICAgICAgICAgICAgICAgIGIgPSBiWzBdO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgY19wYXJ0X2FyZ3YyLnB1c2gobmV3IFBvdyhiLCBlKSk7XG4gICAgICAgIH1cbiAgICAgICAgY19wYXJ0LnB1c2goLi4uY19wYXJ0X2FyZ3YyKTtcblxuICAgICAgICBpZiAoY29lZmYgPT09IFMuSW5maW5pdHkgfHwgY29lZmYgPT09IFMuTmVnYXRpdmVJbmZpbml0eSkge1xuICAgICAgICAgICAgZnVuY3Rpb24gX2hhbmRsZV9mb3Jfb28oY19wYXJ0OiBhbnlbXSwgY29lZmZfc2lnbjogbnVtYmVyKSB7XG4gICAgICAgICAgICAgICAgY29uc3QgbmV3X2NfcGFydCA9IFtdO1xuICAgICAgICAgICAgICAgIGZvciAoY29uc3QgdCBvZiBjX3BhcnQpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHQuaXNfZXh0ZW5kZWRfcG9zaXRpdmUoKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgaWYgKHQuaXNfZXh0ZW5kZWRfbmVnYXRpdmUoKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgY29lZmZfc2lnbiAqPSAtMTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIG5ld19jX3BhcnQucHVzaCh0KTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgcmV0dXJuIFtuZXdfY19wYXJ0LCBjb2VmZl9zaWduXTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGxldCBjb2VmZl9zaWduOiBhbnk7XG4gICAgICAgICAgICBbY19wYXJ0LCBjb2VmZl9zaWduXSA9IF9oYW5kbGVfZm9yX29vKGNfcGFydCwgMSk7XG4gICAgICAgICAgICBbbmNfcGFydCwgY29lZmZfc2lnbl0gPSBfaGFuZGxlX2Zvcl9vbyhuY19wYXJ0LCBjb2VmZl9zaWduKTtcbiAgICAgICAgICAgIGNvZWZmID0gY29lZmYuX19tdWxfXyhuZXcgSW50ZWdlcihjb2VmZl9zaWduKSk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoY29lZmYgPT09IFMuQ29tcGxleEluZmluaXR5KSB7XG4gICAgICAgICAgICBjb25zdCBjdGVtcCA9IFtdO1xuICAgICAgICAgICAgZm9yIChjb25zdCBjIG9mIGNfcGFydCkge1xuICAgICAgICAgICAgICAgIGlmICghKGZ1enp5X25vdChjLmlzX3plcm8oKSkgJiYgYy5pc19leHRlbmRlZF9yZWFsKCkgIT09IFwidW5kZWZpbmVkXCIpKSB7XG4gICAgICAgICAgICAgICAgICAgIGN0ZW1wLnB1c2goYyk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgY19wYXJ0ID0gY3RlbXA7XG4gICAgICAgICAgICBjb25zdCBuY3RlbXAgPSBbXTtcbiAgICAgICAgICAgIGZvciAoY29uc3QgYyBvZiBuY19wYXJ0KSB7XG4gICAgICAgICAgICAgICAgaWYgKCEoZnV6enlfbm90KGMuaXNfemVybygpKSAmJiBjLmlzX2V4dGVuZGVkX3JlYWwoKSAhPT0gXCJ1bmRlZmluZWRcIikpIHtcbiAgICAgICAgICAgICAgICAgICAgbmN0ZW1wLnB1c2goYyk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgbmNfcGFydCA9IG5jdGVtcDtcbiAgICAgICAgfSBlbHNlIGlmIChjb2VmZi5pc196ZXJvKCkpIHtcbiAgICAgICAgICAgIGZvciAoY29uc3QgYyBvZiBjX3BhcnQpIHtcbiAgICAgICAgICAgICAgICBpZiAoYy5pc19maW5pdGUoKSA9PT0gZmFsc2UpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFtbUy5OYU5dLCBbXSwgb3JkZXJfc3ltYm9sc107XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgY29uc3QgX25ldyA9IFtdO1xuICAgICAgICBmb3IgKGNvbnN0IGkgb2YgY19wYXJ0KSB7XG4gICAgICAgICAgICBpZiAoaS5pc19OdW1iZXIoKSkge1xuICAgICAgICAgICAgICAgIGNvZWZmID0gY29lZmYuX19tdWxfXyhpKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgX25ldy5wdXNoKGkpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGNfcGFydCA9IF9uZXc7XG5cbiAgICAgICAgX211bHNvcnQoY19wYXJ0KTtcblxuICAgICAgICBpZiAoY29lZmYgIT09IFMuT25lKSB7XG4gICAgICAgICAgICBjX3BhcnQuc3BsaWNlKDAsIDAsIGNvZWZmKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChnbG9iYWxfcGFyYW1ldGVycy5kaXN0cmlidXRlICYmICFuY19wYXJ0ICYmIGNfcGFydC5sZW5ndGggPT09IDIgJiZcbiAgICAgICAgICAgIGNfcGFydFswXS5pc19OdW1iZXIoKSAmJiBjX3BhcnRbMF0uaXNfZmluaXRlKCkgJiYgY19wYXJ0WzFdLmlzX0FkZCgpKSB7XG4gICAgICAgICAgICBjb2VmZiA9IGNfcGFydFswXTtcbiAgICAgICAgICAgIGNvbnN0IGFkZGFyZyA9IFtdO1xuICAgICAgICAgICAgZm9yIChjb25zdCBmIG9mIGNfcGFydFsxXS5fYXJncykge1xuICAgICAgICAgICAgICAgIGFkZGFyZy5wdXNoKGNvZWZmLl9fbXVsX18oZikpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgY19wYXJ0ID0gbmV3IEFkZCh0cnVlLCB0cnVlLCAuLi5hZGRhcmcpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBbY19wYXJ0LCBuY19wYXJ0LCBvcmRlcl9zeW1ib2xzXTtcbiAgICB9XG5cbiAgICBhc19jb2VmZl9NdWwocmF0aW9uYWw6IGJvb2xlYW4gPSBmYWxzZSkge1xuICAgICAgICBjb25zdCBjb2VmZjogYW55ID0gdGhpcy5fYXJncy5zbGljZSgwLCAxKVswXTtcbiAgICAgICAgY29uc3QgYXJnczogYW55ID0gdGhpcy5fYXJncy5zbGljZSgxKTtcblxuICAgICAgICBpZiAoY29lZmYuaXNfTnVtYmVyKCkpIHtcbiAgICAgICAgICAgIGlmICghcmF0aW9uYWwgfHwgY29lZmYuaXNfUmF0aW9uYWwoKSkge1xuICAgICAgICAgICAgICAgIGlmIChhcmdzLmxlbmd0aCA9PT0gMSkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gW2NvZWZmLCBhcmdzWzBdXTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gW2NvZWZmLCB0aGlzLl9uZXdfcmF3YXJncyh0cnVlLCAuLi5hcmdzKV07XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSBlbHNlIGlmIChjb2VmZi5pc19leHRlbmRlZF9uZWdhdGl2ZSgpKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIFtTLk5lZ2F0aXZlT25lLCB0aGlzLl9uZXdfcmF3YXJncyh0cnVlLCAuLi5bLWNvZWZmXS5jb25jYXQoYXJncykpXTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gW1MuT25lLCB0aGlzXTtcbiAgICB9XG5cbiAgICBfZXZhbF9wb3dlcihlOiBhbnkpIHtcbiAgICAgICAgY29uc3QgW2NhcmdzLCBuY10gPSB0aGlzLmFyZ3NfY25jKGZhbHNlLCB0cnVlLCBmYWxzZSk7XG4gICAgICAgIGlmIChlLmlzX0ludGVnZXIoKSkge1xuICAgICAgICAgICAgY29uc3QgbXVsYXJncyA9IFtdO1xuICAgICAgICAgICAgZm9yIChjb25zdCBiIG9mIGNhcmdzKSB7XG4gICAgICAgICAgICAgICAgbXVsYXJncy5wdXNoKG5ldyBQb3coYiwgZSwgZmFsc2UpKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiBuZXcgTXVsKHRydWUsIHRydWUsIC4uLm11bGFyZ3MpLl9fbXVsX18oXG4gICAgICAgICAgICAgICAgbmV3IFBvdyh0aGlzLl9mcm9tX2FyZ3MoTXVsLCB1bmRlZmluZWQsIC4uLm5jKSwgZSwgZmFsc2UpKTtcbiAgICAgICAgfVxuICAgICAgICBjb25zdCBwID0gbmV3IFBvdyh0aGlzLCBlLCBmYWxzZSk7XG5cbiAgICAgICAgaWYgKGUuaXNfUmF0aW9uYWwoKSB8fCBlLmlzX0Zsb2F0KCkpIHtcbiAgICAgICAgICAgIHJldHVybiBwLl9ldmFsX2V4cGFuZF9wb3dlcl9iYXNlKCk7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gcDtcbiAgICB9XG5cbiAgICBfa2VlcF9jb2VmZihjb2VmZjogYW55LCBmYWN0b3JzOiBhbnksIGNsZWFyOiBib29sZWFuID0gdHJ1ZSwgc2lnbjogYm9vbGVhbiA9IGZhbHNlKTogYW55IHtcbiAgICAgICAgLyogUmV0dXJuIGBgY29lZmYqZmFjdG9yc2BgIHVuZXZhbHVhdGVkIGlmIG5lY2Vzc2FyeS5cbiAgICAgICAgSWYgYGBjbGVhcmBgIGlzIEZhbHNlLCBkbyBub3Qga2VlcCB0aGUgY29lZmZpY2llbnQgYXMgYSBmYWN0b3JcbiAgICAgICAgaWYgaXQgY2FuIGJlIGRpc3RyaWJ1dGVkIG9uIGEgc2luZ2xlIGZhY3RvciBzdWNoIHRoYXQgb25lIG9yXG4gICAgICAgIG1vcmUgdGVybXMgd2lsbCBzdGlsbCBoYXZlIGludGVnZXIgY29lZmZpY2llbnRzLlxuICAgICAgICBJZiBgYHNpZ25gYCBpcyBUcnVlLCBhbGxvdyBhIGNvZWZmaWNpZW50IG9mIC0xIHRvIHJlbWFpbiBmYWN0b3JlZCBvdXQuXG4gICAgICAgIEV4YW1wbGVzXG4gICAgICAgID09PT09PT09XG4gICAgICAgID4+PiBmcm9tIHN5bXB5LmNvcmUubXVsIGltcG9ydCBfa2VlcF9jb2VmZlxuICAgICAgICA+Pj4gZnJvbSBzeW1weS5hYmMgaW1wb3J0IHgsIHlcbiAgICAgICAgPj4+IGZyb20gc3ltcHkgaW1wb3J0IFNcbiAgICAgICAgPj4+IF9rZWVwX2NvZWZmKFMuSGFsZiwgeCArIDIpXG4gICAgICAgICh4ICsgMikvMlxuICAgICAgICA+Pj4gX2tlZXBfY29lZmYoUy5IYWxmLCB4ICsgMiwgY2xlYXI9RmFsc2UpXG4gICAgICAgIHgvMiArIDFcbiAgICAgICAgPj4+IF9rZWVwX2NvZWZmKFMuSGFsZiwgKHggKyAyKSp5LCBjbGVhcj1GYWxzZSlcbiAgICAgICAgeSooeCArIDIpLzJcbiAgICAgICAgPj4+IF9rZWVwX2NvZWZmKFMoLTEpLCB4ICsgeSlcbiAgICAgICAgLXggLSB5XG4gICAgICAgID4+PiBfa2VlcF9jb2VmZihTKC0xKSwgeCArIHksIHNpZ249VHJ1ZSlcbiAgICAgICAgLSh4ICsgeSlcbiAgICAgICAgKi9cbiAgICAgICAgaWYgKCEoY29lZmYuaXNfTnVtYmVyKCkpKSB7XG4gICAgICAgICAgICBpZiAoZmFjdG9ycy5pc19OdW1iZXIoKSkge1xuICAgICAgICAgICAgICAgIFtmYWN0b3JzLCBjb2VmZl0gPSBbY29lZmYsIGZhY3RvcnNdO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gY29lZmYuX19tdWxfXyhmYWN0b3JzKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBpZiAoZmFjdG9ycyA9PT0gUy5PbmUpIHtcbiAgICAgICAgICAgIHJldHVybiBjb2VmZjtcbiAgICAgICAgfVxuICAgICAgICBpZiAoY29lZmYgPT09IFMuT25lKSB7XG4gICAgICAgICAgICByZXR1cm4gZmFjdG9ycztcbiAgICAgICAgfSBlbHNlIGlmIChjb2VmZiA9PT0gUy5OZWdhdGl2ZU9uZSAmJiAhc2lnbikge1xuICAgICAgICAgICAgcmV0dXJuIGZhY3RvcnMuX19tdWxfXyhTLk5lZ2F0aXZlT25lKTtcbiAgICAgICAgfSBlbHNlIGlmIChmYWN0b3JzLmlzX0FkZCgpKSB7XG4gICAgICAgICAgICBpZiAoIWNsZWFyICYmIGNvZWZmLmlzX1JhdGlvbmFsKCkgJiYgY29lZmYucSAhPT0gMSkge1xuICAgICAgICAgICAgICAgIGxldCBhcmdzID0gW107XG4gICAgICAgICAgICAgICAgZm9yIChjb25zdCBpIG9mIGZhY3RvcnMuX2FyZ3MpIHtcbiAgICAgICAgICAgICAgICAgICAgYXJncy5wdXNoKGkuYXNfY29lZmZfTXVsKCkpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBjb25zdCB0ZW1wID0gW107XG4gICAgICAgICAgICAgICAgZm9yIChjb25zdCBbYywgbV0gb2YgYXJncykge1xuICAgICAgICAgICAgICAgICAgICB0ZW1wLnB1c2goW3RoaXMuX2tlZXBfY29lZmYoYywgY29lZmYpLCBtXSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGFyZ3MgPSB0ZW1wO1xuICAgICAgICAgICAgICAgIGZvciAoY29uc3QgW2NdIG9mIGFyZ3MpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGMuaXNfSW50ZWdlcigpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zdCB0ZW1wYXJnID0gW107XG4gICAgICAgICAgICAgICAgICAgICAgICBmb3IgKGNvbnN0IGkgb2YgYXJncykge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChpWzBdID09PSAxKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRlbXBhcmcucHVzaChpLnNsaWNlKDAsIDEpKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLl9mcm9tX2FyZ3MoQWRkLCB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLi4udGhpcy5fZnJvbV9hcmdzKE11bCwgdW5kZWZpbmVkLCAuLi50ZW1wYXJnKSk7XG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiBuZXcgTXVsKGZhbHNlLCB0cnVlLCBjb2VmZiwgZmFjdG9ycyk7XG4gICAgICAgIH0gZWxzZSBpZiAoZmFjdG9ycy5pc19NdWwoKSkge1xuICAgICAgICAgICAgY29uc3QgbWFyZ3M6IGFueVtdID0gZmFjdG9ycy5fYXJncztcbiAgICAgICAgICAgIGlmIChtYXJnc1swXS5pc19OdW1iZXIoKSkge1xuICAgICAgICAgICAgICAgIG1hcmdzWzBdID0gbWFyZ3NbMF0uX19tdWxfXyhjb2VmZik7XG4gICAgICAgICAgICAgICAgaWYgKG1hcmdzWzBdID09PSAxKSB7XG4gICAgICAgICAgICAgICAgICAgIG1hcmdzLnNwbGljZSgyLCAxKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIG1hcmdzLnNwbGljZSgwLCAwLCBjb2VmZik7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fZnJvbV9hcmdzKE11bCwgdW5kZWZpbmVkLCAuLi5tYXJncyk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBsZXQgbSA9IGNvZWZmLl9fbXVsX18oZmFjdG9ycyk7XG4gICAgICAgICAgICBpZiAobS5pc19OdW1iZXIoKSAmJiAhKGZhY3RvcnMuaXNfTnVtYmVyKCkpKSB7XG4gICAgICAgICAgICAgICAgbSA9IHRoaXMuX2Zyb21fYXJncyhNdWwsIHVuZGVmaW5lZCwgY29lZmYsIGZhY3RvcnMpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIG07XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBzdGF0aWMgX25ldyhldmFsdWF0ZTogYm9vbGVhbiwgc2ltcGxpZnk6IGJvb2xlYW4sIC4uLmFyZ3M6IGFueSkge1xuICAgICAgICByZXR1cm4gbmV3IE11bChldmFsdWF0ZSwgc2ltcGxpZnksIC4uLmFyZ3MpO1xuICAgIH1cblxuXG4gICAgX2V2YWxfaXNfY29tbXV0YXRpdmUoKSB7XG4gICAgICAgIGNvbnN0IGFsbGFyZ3MgPSBbXTtcbiAgICAgICAgZm9yIChjb25zdCBhIG9mIHRoaXMuX2FyZ3MpIHtcbiAgICAgICAgICAgIGFsbGFyZ3MucHVzaChhLmlzX2NvbW11dGF0aXZlKCkpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBfZnV6enlfZ3JvdXAoYWxsYXJncyk7XG4gICAgfVxuXG4gICAgLy8gV0IgYWRkaXRpb24gZm9yIGphc21pbmUgdGVzdHNcbiAgICB0b1N0cmluZygpIHtcbiAgICAgICAgbGV0IHJlc3VsdCA9IFwiXCI7XG4gICAgICAgIGNvbnN0IG51bV9hcmdzID0gdGhpcy5fYXJncy5sZW5ndGhcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBudW1fYXJnczsgaSsrKSB7XG4gICAgICAgICAgICBjb25zdCBhcmcgPSB0aGlzLl9hcmdzW2ldO1xuICAgICAgICAgICAgbGV0IHRlbXA7XG4gICAgICAgICAgICBpZiAoaSAhPSBudW1fYXJncyAtIDEpIHtcbiAgICAgICAgICAgICAgICB0ZW1wID0gYXJnLnRvU3RyaW5nKCkgKyBcIipcIlxuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICB0ZW1wID0gYXJnLnRvU3RyaW5nKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXN1bHQgPSByZXN1bHQuY29uY2F0KHRlbXApXG4gICAgICAgIH1cbiAgICBcbiAgICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICB9XG59XG5cbk1hbmFnZWRQcm9wZXJ0aWVzLnJlZ2lzdGVyKE11bCk7XG5HbG9iYWwucmVnaXN0ZXIoXCJNdWxcIiwgTXVsLl9uZXcpO1xuIiwgIi8qXG5DaGFuZ2VzIG1hZGUgKFdCIGFuZCBHTSk6XG4tIEFkZGVkIGNvbnN0cnVjdG9yIHRvIGV4cGxpY2l0bHkgY2FsbCBBc3NvY09wIHN1cGVyY2xhc3Ncbi0gQWRkZWQgXCJzaW1wbGlmeVwiIGFyZ3VtZW50LCB3aGljaCBwcmV2ZW50cyBpbmZpbml0ZSByZWN1cnNpb24gaW4gQXNzb2NPcFxuLSBOb3RlOiBPcmRlciBvYmplY3RzIGluIEFkZCBhcmUgbm90IHlldCBpbXBsZW1lbnRlZFxuKi9cblxuaW1wb3J0IHtFeHByfSBmcm9tIFwiLi9leHByXCI7XG5pbXBvcnQge0Fzc29jT3B9IGZyb20gXCIuL29wZXJhdGlvbnNcIjtcbmltcG9ydCB7YmFzZSwgbWl4LCBIYXNoRGljdH0gZnJvbSBcIi4vdXRpbGl0eVwiO1xuaW1wb3J0IHtTfSBmcm9tIFwiLi9zaW5nbGV0b25cIjtcbmltcG9ydCB7QmFzaWN9IGZyb20gXCIuL2Jhc2ljXCI7XG5pbXBvcnQge01hbmFnZWRQcm9wZXJ0aWVzfSBmcm9tIFwiLi9hc3N1bXB0aW9uc1wiO1xuaW1wb3J0IHtNdWx9IGZyb20gXCIuL211bFwiO1xuaW1wb3J0IHtHbG9iYWx9IGZyb20gXCIuL2dsb2JhbFwiO1xuaW1wb3J0IHtfZnV6enlfZ3JvdXB9IGZyb20gXCIuL2xvZ2ljXCI7XG5cbmZ1bmN0aW9uIF9hZGRzb3J0KGFyZ3M6IGFueVtdKSB7XG4gICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5ldy1jYXBcbiAgICBhcmdzLnNvcnQoKGEsIGIpID0+IEJhc2ljLmNtcChhLCBiKSk7XG59XG5cbmV4cG9ydCBjbGFzcyBBZGQgZXh0ZW5kcyBtaXgoYmFzZSkud2l0aChFeHByLCBBc3NvY09wKSB7XG4gICAgLypcbiAgICBcIlwiXCJcbiAgICBFeHByZXNzaW9uIHJlcHJlc2VudGluZyBhZGRpdGlvbiBvcGVyYXRpb24gZm9yIGFsZ2VicmFpYyBncm91cC5cbiAgICAuLiBkZXByZWNhdGVkOjogMS43XG4gICAgICAgVXNpbmcgYXJndW1lbnRzIHRoYXQgYXJlbid0IHN1YmNsYXNzZXMgb2YgOmNsYXNzOmB+LkV4cHJgIGluIGNvcmVcbiAgICAgICBvcGVyYXRvcnMgKDpjbGFzczpgfi5NdWxgLCA6Y2xhc3M6YH4uQWRkYCwgYW5kIDpjbGFzczpgfi5Qb3dgKSBpc1xuICAgICAgIGRlcHJlY2F0ZWQuIFNlZSA6cmVmOmBub24tZXhwci1hcmdzLWRlcHJlY2F0ZWRgIGZvciBkZXRhaWxzLlxuICAgIEV2ZXJ5IGFyZ3VtZW50IG9mIGBgQWRkKClgYCBtdXN0IGJlIGBgRXhwcmBgLiBJbmZpeCBvcGVyYXRvciBgYCtgYFxuICAgIG9uIG1vc3Qgc2NhbGFyIG9iamVjdHMgaW4gU3ltUHkgY2FsbHMgdGhpcyBjbGFzcy5cbiAgICBBbm90aGVyIHVzZSBvZiBgYEFkZCgpYGAgaXMgdG8gcmVwcmVzZW50IHRoZSBzdHJ1Y3R1cmUgb2YgYWJzdHJhY3RcbiAgICBhZGRpdGlvbiBzbyB0aGF0IGl0cyBhcmd1bWVudHMgY2FuIGJlIHN1YnN0aXR1dGVkIHRvIHJldHVybiBkaWZmZXJlbnRcbiAgICBjbGFzcy4gUmVmZXIgdG8gZXhhbXBsZXMgc2VjdGlvbiBmb3IgdGhpcy5cbiAgICBgYEFkZCgpYGAgZXZhbHVhdGVzIHRoZSBhcmd1bWVudCB1bmxlc3MgYGBldmFsdWF0ZT1GYWxzZWBgIGlzIHBhc3NlZC5cbiAgICBUaGUgZXZhbHVhdGlvbiBsb2dpYyBpbmNsdWRlczpcbiAgICAxLiBGbGF0dGVuaW5nXG4gICAgICAgIGBgQWRkKHgsIEFkZCh5LCB6KSlgYCAtPiBgYEFkZCh4LCB5LCB6KWBgXG4gICAgMi4gSWRlbnRpdHkgcmVtb3ZpbmdcbiAgICAgICAgYGBBZGQoeCwgMCwgeSlgYCAtPiBgYEFkZCh4LCB5KWBgXG4gICAgMy4gQ29lZmZpY2llbnQgY29sbGVjdGluZyBieSBgYC5hc19jb2VmZl9NdWwoKWBgXG4gICAgICAgIGBgQWRkKHgsIDIqeClgYCAtPiBgYE11bCgzLCB4KWBgXG4gICAgNC4gVGVybSBzb3J0aW5nXG4gICAgICAgIGBgQWRkKHksIHgsIDIpYGAgLT4gYGBBZGQoMiwgeCwgeSlgYFxuICAgIElmIG5vIGFyZ3VtZW50IGlzIHBhc3NlZCwgaWRlbnRpdHkgZWxlbWVudCAwIGlzIHJldHVybmVkLiBJZiBzaW5nbGVcbiAgICBlbGVtZW50IGlzIHBhc3NlZCwgdGhhdCBlbGVtZW50IGlzIHJldHVybmVkLlxuICAgIE5vdGUgdGhhdCBgYEFkZCgqYXJncylgYCBpcyBtb3JlIGVmZmljaWVudCB0aGFuIGBgc3VtKGFyZ3MpYGAgYmVjYXVzZVxuICAgIGl0IGZsYXR0ZW5zIHRoZSBhcmd1bWVudHMuIGBgc3VtKGEsIGIsIGMsIC4uLilgYCByZWN1cnNpdmVseSBhZGRzIHRoZVxuICAgIGFyZ3VtZW50cyBhcyBgYGEgKyAoYiArIChjICsgLi4uKSlgYCwgd2hpY2ggaGFzIHF1YWRyYXRpYyBjb21wbGV4aXR5LlxuICAgIE9uIHRoZSBvdGhlciBoYW5kLCBgYEFkZChhLCBiLCBjLCBkKWBgIGRvZXMgbm90IGFzc3VtZSBuZXN0ZWRcbiAgICBzdHJ1Y3R1cmUsIG1ha2luZyB0aGUgY29tcGxleGl0eSBsaW5lYXIuXG4gICAgU2luY2UgYWRkaXRpb24gaXMgZ3JvdXAgb3BlcmF0aW9uLCBldmVyeSBhcmd1bWVudCBzaG91bGQgaGF2ZSB0aGVcbiAgICBzYW1lIDpvYmo6YHN5bXB5LmNvcmUua2luZC5LaW5kKClgLlxuICAgIEV4YW1wbGVzXG4gICAgPT09PT09PT1cbiAgICA+Pj4gZnJvbSBzeW1weSBpbXBvcnQgQWRkLCBJXG4gICAgPj4+IGZyb20gc3ltcHkuYWJjIGltcG9ydCB4LCB5XG4gICAgPj4+IEFkZCh4LCAxKVxuICAgIHggKyAxXG4gICAgPj4+IEFkZCh4LCB4KVxuICAgIDIqeFxuICAgID4+PiAyKngqKjIgKyAzKnggKyBJKnkgKyAyKnkgKyAyKngvNSArIDEuMCp5ICsgMVxuICAgIDIqeCoqMiArIDE3KngvNSArIDMuMCp5ICsgSSp5ICsgMVxuICAgIElmIGBgZXZhbHVhdGU9RmFsc2VgYCBpcyBwYXNzZWQsIHJlc3VsdCBpcyBub3QgZXZhbHVhdGVkLlxuICAgID4+PiBBZGQoMSwgMiwgZXZhbHVhdGU9RmFsc2UpXG4gICAgMSArIDJcbiAgICA+Pj4gQWRkKHgsIHgsIGV2YWx1YXRlPUZhbHNlKVxuICAgIHggKyB4XG4gICAgYGBBZGQoKWBgIGFsc28gcmVwcmVzZW50cyB0aGUgZ2VuZXJhbCBzdHJ1Y3R1cmUgb2YgYWRkaXRpb24gb3BlcmF0aW9uLlxuICAgID4+PiBmcm9tIHN5bXB5IGltcG9ydCBNYXRyaXhTeW1ib2xcbiAgICA+Pj4gQSxCID0gTWF0cml4U3ltYm9sKCdBJywgMiwyKSwgTWF0cml4U3ltYm9sKCdCJywgMiwyKVxuICAgID4+PiBleHByID0gQWRkKHgseSkuc3Vicyh7eDpBLCB5OkJ9KVxuICAgID4+PiBleHByXG4gICAgQSArIEJcbiAgICA+Pj4gdHlwZShleHByKVxuICAgIDxjbGFzcyAnc3ltcHkubWF0cmljZXMuZXhwcmVzc2lvbnMubWF0YWRkLk1hdEFkZCc+XG4gICAgTm90ZSB0aGF0IHRoZSBwcmludGVycyBkbyBub3QgZGlzcGxheSBpbiBhcmdzIG9yZGVyLlxuICAgID4+PiBBZGQoeCwgMSlcbiAgICB4ICsgMVxuICAgID4+PiBBZGQoeCwgMSkuYXJnc1xuICAgICgxLCB4KVxuICAgIFNlZSBBbHNvXG4gICAgPT09PT09PT1cbiAgICBNYXRBZGRcbiAgICBcIlwiXCJcbiAgICAqL1xuXG4gICAgX19zbG90c19fOiBhbnlbXSA9IFtdO1xuICAgIGFyZ3M6IGFueVtdO1xuICAgIHN0YXRpYyBpc19BZGQ6IGFueSA9IHRydWU7IFxuICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBuZXctY2FwXG4gICAgc3RhdGljIF9hcmdzX3R5cGUgPSBFeHByKE9iamVjdCk7XG4gICAgc3RhdGljIGlkZW50aXR5ID0gUy5aZXJvOyAvLyAhISEgdW5zdXJlIGFidCB0aGlzXG5cbiAgICBjb25zdHJ1Y3RvcihldmFsdWF0ZTogYm9vbGVhbiwgc2ltcGxpZnk6IGJvb2xlYW4sIC4uLmFyZ3M6IGFueSkge1xuICAgICAgICBzdXBlcihBZGQsIGV2YWx1YXRlLCBzaW1wbGlmeSwgLi4uYXJncyk7XG4gICAgfVxuXG4gICAgZmxhdHRlbihzZXE6IGFueVtdKSB7XG4gICAgICAgIC8qXG4gICAgICAgIFRha2VzIHRoZSBzZXF1ZW5jZSBcInNlcVwiIG9mIG5lc3RlZCBBZGRzIGFuZCByZXR1cm5zIGEgZmxhdHRlbiBsaXN0LlxuICAgICAgICBSZXR1cm5zOiAoY29tbXV0YXRpdmVfcGFydCwgbm9uY29tbXV0YXRpdmVfcGFydCwgb3JkZXJfc3ltYm9scylcbiAgICAgICAgQXBwbGllcyBhc3NvY2lhdGl2aXR5LCBhbGwgdGVybXMgYXJlIGNvbW11dGFibGUgd2l0aCByZXNwZWN0IHRvXG4gICAgICAgIGFkZGl0aW9uLlxuICAgICAgICBOQjogdGhlIHJlbW92YWwgb2YgMCBpcyBhbHJlYWR5IGhhbmRsZWQgYnkgQXNzb2NPcC5fX25ld19fXG4gICAgICAgIFNlZSBhbHNvXG4gICAgICAgID09PT09PT09XG4gICAgICAgIHN5bXB5LmNvcmUubXVsLk11bC5mbGF0dGVuXG4gICAgICAgICovXG4gICAgICAgIGxldCBydiA9IHVuZGVmaW5lZDtcbiAgICAgICAgaWYgKHNlcS5sZW5ndGggPT09IDIpIHtcbiAgICAgICAgICAgIGxldCBbYSwgYl0gPSBzZXE7XG4gICAgICAgICAgICBpZiAoYi5pc19SYXRpb25hbCgpKSB7XG4gICAgICAgICAgICAgICAgW2EsIGJdID0gW2IsIGFdO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKGEuaXNfUmF0aW9uYWwoKSkge1xuICAgICAgICAgICAgICAgIGlmIChiLmlzX011bCgpKSB7XG4gICAgICAgICAgICAgICAgICAgIHJ2ID0gW1thLCBiXSwgW10sIHVuZGVmaW5lZF07XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKHJ2KSB7XG4gICAgICAgICAgICAgICAgbGV0IGFsbGMgPSB0cnVlO1xuICAgICAgICAgICAgICAgIGZvciAoY29uc3QgcyBvZiBydlswXSkge1xuICAgICAgICAgICAgICAgICAgICBpZiAocy5pc19jb21tdXRhdGl2ZSgpID09PSBmYWxzZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgYWxsYyA9IGZhbHNlO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGlmIChhbGxjKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBydjtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gW1tdLCBydlswXSwgdW5kZWZpbmVkXTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgY29uc3QgdGVybXM6IEhhc2hEaWN0ID0gbmV3IEhhc2hEaWN0KCk7XG4gICAgICAgIGxldCBjb2VmZiA9IFMuWmVybztcbiAgICAgICAgY29uc3QgZXh0cmE6IGFueVtdID0gW107XG4gICAgICAgIGZvciAoY29uc3QgbyBvZiBzZXEpIHtcbiAgICAgICAgICAgIGxldCBjO1xuICAgICAgICAgICAgbGV0IHM7XG4gICAgICAgICAgICBpZiAoby5pc19OdW1iZXIoKSkge1xuICAgICAgICAgICAgICAgIGlmICgobyA9PT0gUy5OYU4gfHwgKGNvZWZmID09PSBTLkNvbXBsZXhJbmZpbml0eSAmJiBvLmlzX2Zpbml0ZSgpID09PSBmYWxzZSkpKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBbW1MuTmFOXSwgW10sIHVuZGVmaW5lZF07XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGlmIChjb2VmZi5pc19OdW1iZXIoKSkge1xuICAgICAgICAgICAgICAgICAgICBjb2VmZiA9IGNvZWZmLl9fYWRkX18obyk7XG4gICAgICAgICAgICAgICAgICAgIGlmIChjb2VmZiA9PT0gUy5OYU4gfHwgIWV4dHJhKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gW1tTLk5hTl0sIFtdLCB1bmRlZmluZWRdO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgICAgfSBlbHNlIGlmIChvID09PSBTLkNvbXBsZXhJbmZpbml0eSkge1xuICAgICAgICAgICAgICAgIGlmIChjb2VmZi5pc19maW5pdGUoKSA9PT0gZmFsc2UpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFtbUy5OYU5dLCBbXSwgdW5kZWZpbmVkXTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgY29lZmYgPSBTLkNvbXBsZXhJbmZpbml0eTtcbiAgICAgICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoby5pc19BZGQoKSkge1xuICAgICAgICAgICAgICAgIHNlcS5wdXNoKC4uLm8uX2FyZ3MpO1xuICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgICAgfSBlbHNlIGlmIChvLmlzX011bCgpKSB7XG4gICAgICAgICAgICAgICAgW2MsIHNdID0gby5hc19jb2VmZl9NdWwoKTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoby5pc19Qb3coKSkge1xuICAgICAgICAgICAgICAgIGNvbnN0IHBhaXIgPSBvLmFzX2Jhc2VfZXhwKCk7XG4gICAgICAgICAgICAgICAgY29uc3QgYiA9IHBhaXJbMF07XG4gICAgICAgICAgICAgICAgY29uc3QgZSA9IHBhaXJbMV07XG4gICAgICAgICAgICAgICAgaWYgKGIuaXNfTnVtYmVyKCkgJiYgKGUuaXNfSW50ZWdlcigpIHx8IChlLmlzX1JhdGlvbmFsKCkgJiYgZS5pc19uZWdhdGl2ZSgpKSkpIHtcbiAgICAgICAgICAgICAgICAgICAgc2VxLnB1c2goYi5fZXZhbF9wb3dlcihlKSk7XG4gICAgICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBbYywgc10gPSBbUy5PbmUsIG9dO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBjID0gUy5PbmU7XG4gICAgICAgICAgICAgICAgcyA9IG87XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAodGVybXMuaGFzKHMpKSB7XG4gICAgICAgICAgICAgICAgdGVybXMuYWRkKHMsIHRlcm1zLmdldChzKS5fX2FkZF9fKGMpKTtcbiAgICAgICAgICAgICAgICBpZiAodGVybXMuZ2V0KHMpID09PSBTLk5hTikge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gW1tTLk5hTl0sIFtdLCB1bmRlZmluZWRdO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgdGVybXMuYWRkKHMsIGMpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGxldCBuZXdzZXE6IGFueVtdID0gW107XG4gICAgICAgIGxldCBub25jb21tdXRhdGl2ZTogYm9vbGVhbiA9IGZhbHNlO1xuICAgICAgICBmb3IgKGNvbnN0IGl0ZW0gb2YgdGVybXMuZW50cmllcygpKSB7XG4gICAgICAgICAgICBjb25zdCBzOiBhbnkgPSBpdGVtWzBdO1xuICAgICAgICAgICAgY29uc3QgYzogYW55ID0gaXRlbVsxXTtcbiAgICAgICAgICAgIGlmIChjLmlzX3plcm8oKSkge1xuICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgICAgfSBlbHNlIGlmIChjID09PSBTLk9uZSkge1xuICAgICAgICAgICAgICAgIG5ld3NlcS5wdXNoKHMpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBpZiAocy5pc19NdWwoKSkge1xuICAgICAgICAgICAgICAgICAgICBjb25zdCBjcyA9IHMuX25ld19yYXdhcmdzKHRydWUsIC4uLltjXS5jb25jYXQocy5fYXJncykpO1xuICAgICAgICAgICAgICAgICAgICBuZXdzZXEucHVzaChjcyk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmIChzLmlzX0FkZCgpKSB7XG4gICAgICAgICAgICAgICAgICAgIG5ld3NlcS5wdXNoKG5ldyBNdWwoZmFsc2UsIHRydWUsIGMsIHMpKTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBuZXdzZXEucHVzaChuZXcgTXVsKHRydWUsIHRydWUsIGMsIHMpKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBub25jb21tdXRhdGl2ZSA9IG5vbmNvbW11dGF0aXZlIHx8ICEocy5pc19jb21tdXRhdGl2ZSgpKTtcbiAgICAgICAgfVxuICAgICAgICBjb25zdCB0ZW1wID0gW107XG4gICAgICAgIGlmIChjb2VmZiA9PT0gUy5JbmZpbml0eSkge1xuICAgICAgICAgICAgZm9yIChjb25zdCBmIG9mIG5ld3NlcSkge1xuICAgICAgICAgICAgICAgIGlmICghKGYuaXNfZXh0ZW5kZWRfbm9ubmVnYXRpdmUoKSkpIHtcbiAgICAgICAgICAgICAgICAgICAgdGVtcC5wdXNoKGYpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIG5ld3NlcSA9IHRlbXA7XG4gICAgICAgIH0gZWxzZSBpZiAoY29lZmYgPT09IFMuTmVnYXRpdmVJbmZpbml0eSkge1xuICAgICAgICAgICAgZm9yIChjb25zdCBmIG9mIG5ld3NlcSkge1xuICAgICAgICAgICAgICAgIGlmICghKGYuaXNfZXh0ZW5kZWRfbm9ucG9zaXRpdmUoKSkpIHtcbiAgICAgICAgICAgICAgICAgICAgdGVtcC5wdXNoKGYpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIG5ld3NlcSA9IHRlbXA7XG4gICAgICAgIH1cbiAgICAgICAgY29uc3QgdGVtcDIgPSBbXTtcbiAgICAgICAgaWYgKGNvZWZmID09PSBTLkNvbXBsZXhJbmZpbml0eSkge1xuICAgICAgICAgICAgZm9yIChjb25zdCBjIG9mIG5ld3NlcSkge1xuICAgICAgICAgICAgICAgIGlmICghKGMuaXNfZmluaXRlKCkgPT09IHRydWUgfHwgdHlwZW9mIGMuaXNfZXh0ZW5kZWRfcmVhbCgpICE9PSBcInVuZGVmaW5lZFwiKSkge1xuICAgICAgICAgICAgICAgICAgICB0ZW1wMi5wdXNoKGMpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIG5ld3NlcSA9IHRlbXAyO1xuICAgICAgICB9XG4gICAgICAgIF9hZGRzb3J0KG5ld3NlcSk7XG4gICAgICAgIGlmIChjb2VmZiAhPT0gUy5aZXJvKSB7XG4gICAgICAgICAgICBuZXdzZXEuc3BsaWNlKDAsIDAsIGNvZWZmKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAobm9uY29tbXV0YXRpdmUpIHtcbiAgICAgICAgICAgIHJldHVybiBbW10sIG5ld3NlcSwgdW5kZWZpbmVkXTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiBbbmV3c2VxLCBbXSwgdW5kZWZpbmVkXTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIF9ldmFsX2lzX2NvbW11dGF0aXZlKCkge1xuICAgICAgICBjb25zdCBmdXp6eWFyZyA9IFtdO1xuICAgICAgICBmb3IgKGNvbnN0IGEgb2YgdGhpcy5fYXJncykge1xuICAgICAgICAgICAgZnV6enlhcmcucHVzaChhLmlzX2NvbW11dGF0aXZlKCkpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBfZnV6enlfZ3JvdXAoZnV6enlhcmcpO1xuICAgIH1cblxuICAgIGFzX2NvZWZmX0FkZCgpIHtcbiAgICAgICAgY29uc3QgW2NvZWZmLCBhcmdzXSA9IFt0aGlzLmFyZ3NbMF0sIHRoaXMuYXJncy5zbGljZSgxKV07XG4gICAgICAgIGlmIChjb2VmZi5pc19OdW1iZXIoKSAmJiBjb2VmZi5pc19SYXRpb25hbCgpKSB7XG4gICAgICAgICAgICByZXR1cm4gW2NvZWZmLCB0aGlzLl9uZXdfcmF3YXJncyh0cnVlLCAuLi5hcmdzKV07XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIFtTLlplcm8sIHRoaXNdO1xuICAgIH1cblxuICAgIHN0YXRpYyBfbmV3KGV2YWx1YXRlOiBib29sZWFuLCBzaW1wbGlmeTogYm9vbGVhbiwgLi4uYXJnczogYW55KSB7XG4gICAgICAgIHJldHVybiBuZXcgQWRkKGV2YWx1YXRlLCBzaW1wbGlmeSwgLi4uYXJncyk7XG4gICAgfVxuXG4gICAgLy8gV0IgYWRkaXRpb24gZm9yIGphc21pbmUgdGVzdHNcbiAgICB0b1N0cmluZygpIHtcbiAgICAgICAgbGV0IHJlc3VsdCA9IFwiXCI7XG4gICAgICAgIGNvbnN0IG51bV9hcmdzID0gdGhpcy5fYXJncy5sZW5ndGhcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBudW1fYXJnczsgaSsrKSB7XG4gICAgICAgICAgICBjb25zdCBhcmcgPSB0aGlzLl9hcmdzW2ldO1xuICAgICAgICAgICAgbGV0IHRlbXA7XG4gICAgICAgICAgICBpZiAoaSAhPSBudW1fYXJncyAtIDEpIHtcbiAgICAgICAgICAgICAgICB0ZW1wID0gYXJnLnRvU3RyaW5nKCkgKyBcIiArIFwiXG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHRlbXAgPSBhcmcudG9TdHJpbmcoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJlc3VsdCA9IHJlc3VsdC5jb25jYXQodGVtcClcbiAgICAgICAgfVxuIFxuICAgICAgICByZXR1cm4gcmVzdWx0O1xuICAgIH1cbn1cblxuTWFuYWdlZFByb3BlcnRpZXMucmVnaXN0ZXIoQWRkKTtcbkdsb2JhbC5yZWdpc3RlcihcIkFkZFwiLCBBZGQuX25ldyk7XG4iLCAiLyohXHJcbiAqICBkZWNpbWFsLmpzIHYxMC40LjNcclxuICogIEFuIGFyYml0cmFyeS1wcmVjaXNpb24gRGVjaW1hbCB0eXBlIGZvciBKYXZhU2NyaXB0LlxyXG4gKiAgaHR0cHM6Ly9naXRodWIuY29tL01pa2VNY2wvZGVjaW1hbC5qc1xyXG4gKiAgQ29weXJpZ2h0IChjKSAyMDIyIE1pY2hhZWwgTWNsYXVnaGxpbiA8TThjaDg4bEBnbWFpbC5jb20+XHJcbiAqICBNSVQgTGljZW5jZVxyXG4gKi9cclxuXHJcblxyXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSAgRURJVEFCTEUgREVGQVVMVFMgIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSAvL1xyXG5cclxuXHJcbiAgLy8gVGhlIG1heGltdW0gZXhwb25lbnQgbWFnbml0dWRlLlxyXG4gIC8vIFRoZSBsaW1pdCBvbiB0aGUgdmFsdWUgb2YgYHRvRXhwTmVnYCwgYHRvRXhwUG9zYCwgYG1pbkVgIGFuZCBgbWF4RWAuXHJcbnZhciBFWFBfTElNSVQgPSA5ZTE1LCAgICAgICAgICAgICAgICAgICAgICAvLyAwIHRvIDllMTVcclxuXHJcbiAgLy8gVGhlIGxpbWl0IG9uIHRoZSB2YWx1ZSBvZiBgcHJlY2lzaW9uYCwgYW5kIG9uIHRoZSB2YWx1ZSBvZiB0aGUgZmlyc3QgYXJndW1lbnQgdG9cclxuICAvLyBgdG9EZWNpbWFsUGxhY2VzYCwgYHRvRXhwb25lbnRpYWxgLCBgdG9GaXhlZGAsIGB0b1ByZWNpc2lvbmAgYW5kIGB0b1NpZ25pZmljYW50RGlnaXRzYC5cclxuICBNQVhfRElHSVRTID0gMWU5LCAgICAgICAgICAgICAgICAgICAgICAgIC8vIDAgdG8gMWU5XHJcblxyXG4gIC8vIEJhc2UgY29udmVyc2lvbiBhbHBoYWJldC5cclxuICBOVU1FUkFMUyA9ICcwMTIzNDU2Nzg5YWJjZGVmJyxcclxuXHJcbiAgLy8gVGhlIG5hdHVyYWwgbG9nYXJpdGhtIG9mIDEwICgxMDI1IGRpZ2l0cykuXHJcbiAgTE4xMCA9ICcyLjMwMjU4NTA5Mjk5NDA0NTY4NDAxNzk5MTQ1NDY4NDM2NDIwNzYwMTEwMTQ4ODYyODc3Mjk3NjAzMzMyNzkwMDk2NzU3MjYwOTY3NzM1MjQ4MDIzNTk5NzIwNTA4OTU5ODI5ODM0MTk2Nzc4NDA0MjI4NjI0ODYzMzQwOTUyNTQ2NTA4MjgwNjc1NjY2NjI4NzM2OTA5ODc4MTY4OTQ4MjkwNzIwODMyNTU1NDY4MDg0Mzc5OTg5NDgyNjIzMzE5ODUyODM5MzUwNTMwODk2NTM3NzczMjYyODg0NjE2MzM2NjIyMjI4NzY5ODIxOTg4Njc0NjU0MzY2NzQ3NDQwNDI0MzI3NDM2NTE1NTA0ODkzNDMxNDkzOTM5MTQ3OTYxOTQwNDQwMDIyMjEwNTEwMTcxNDE3NDgwMDM2ODgwODQwMTI2NDcwODA2ODU1Njc3NDMyMTYyMjgzNTUyMjAxMTQ4MDQ2NjM3MTU2NTkxMjEzNzM0NTA3NDc4NTY5NDc2ODM0NjM2MTY3OTIxMDE4MDY0NDUwNzA2NDgwMDAyNzc1MDI2ODQ5MTY3NDY1NTA1ODY4NTY5MzU2NzM0MjA2NzA1ODExMzY0MjkyMjQ1NTQ0MDU3NTg5MjU3MjQyMDgyNDEzMTQ2OTU2ODkwMTY3NTg5NDAyNTY3NzYzMTEzNTY5MTkyOTIwMzMzNzY1ODcxNDE2NjAyMzAxMDU3MDMwODk2MzQ1NzIwNzU0NDAzNzA4NDc0Njk5NDAxNjgyNjkyODI4MDg0ODExODQyODkzMTQ4NDg1MjQ5NDg2NDQ4NzE5Mjc4MDk2NzYyNzEyNzU3NzUzOTcwMjc2Njg2MDU5NTI0OTY3MTY2NzQxODM0ODU3MDQ0MjI1MDcxOTc5NjUwMDQ3MTQ5NTEwNTA0OTIyMTQ3NzY1Njc2MzY5Mzg2NjI5NzY5Nzk1MjIxMTA3MTgyNjQ1NDk3MzQ3NzI2NjI0MjU3MDk0MjkzMjI1ODI3OTg1MDI1ODU1MDk3ODUyNjUzODMyMDc2MDY3MjYzMTcxNjQzMDk1MDU5OTUwODc4MDc1MjM3MTAzMzMxMDExOTc4NTc1NDczMzE1NDE0MjE4MDg0Mjc1NDM4NjM1OTE3NzgxMTcwNTQzMDk4Mjc0ODIzODUwNDU2NDgwMTkwOTU2MTAyOTkyOTE4MjQzMTgyMzc1MjUzNTc3MDk3NTA1Mzk1NjUxODc2OTc1MTAzNzQ5NzA4ODg2OTIxODAyMDUxODkzMzk1MDcyMzg1MzkyMDUxNDQ2MzQxOTcyNjUyODcyODY5NjUxMTA4NjI1NzE0OTIxOTg4NDk5Nzg3NDg4NzM3NzEzNDU2ODYyMDkxNjcwNTgnLFxyXG5cclxuICAvLyBQaSAoMTAyNSBkaWdpdHMpLlxyXG4gIFBJID0gJzMuMTQxNTkyNjUzNTg5NzkzMjM4NDYyNjQzMzgzMjc5NTAyODg0MTk3MTY5Mzk5Mzc1MTA1ODIwOTc0OTQ0NTkyMzA3ODE2NDA2Mjg2MjA4OTk4NjI4MDM0ODI1MzQyMTE3MDY3OTgyMTQ4MDg2NTEzMjgyMzA2NjQ3MDkzODQ0NjA5NTUwNTgyMjMxNzI1MzU5NDA4MTI4NDgxMTE3NDUwMjg0MTAyNzAxOTM4NTIxMTA1NTU5NjQ0NjIyOTQ4OTU0OTMwMzgxOTY0NDI4ODEwOTc1NjY1OTMzNDQ2MTI4NDc1NjQ4MjMzNzg2NzgzMTY1MjcxMjAxOTA5MTQ1NjQ4NTY2OTIzNDYwMzQ4NjEwNDU0MzI2NjQ4MjEzMzkzNjA3MjYwMjQ5MTQxMjczNzI0NTg3MDA2NjA2MzE1NTg4MTc0ODgxNTIwOTIwOTYyODI5MjU0MDkxNzE1MzY0MzY3ODkyNTkwMzYwMDExMzMwNTMwNTQ4ODIwNDY2NTIxMzg0MTQ2OTUxOTQxNTExNjA5NDMzMDU3MjcwMzY1NzU5NTkxOTUzMDkyMTg2MTE3MzgxOTMyNjExNzkzMTA1MTE4NTQ4MDc0NDYyMzc5OTYyNzQ5NTY3MzUxODg1NzUyNzI0ODkxMjI3OTM4MTgzMDExOTQ5MTI5ODMzNjczMzYyNDQwNjU2NjQzMDg2MDIxMzk0OTQ2Mzk1MjI0NzM3MTkwNzAyMTc5ODYwOTQzNzAyNzcwNTM5MjE3MTc2MjkzMTc2NzUyMzg0Njc0ODE4NDY3NjY5NDA1MTMyMDAwNTY4MTI3MTQ1MjYzNTYwODI3Nzg1NzcxMzQyNzU3Nzg5NjA5MTczNjM3MTc4NzIxNDY4NDQwOTAxMjI0OTUzNDMwMTQ2NTQ5NTg1MzcxMDUwNzkyMjc5Njg5MjU4OTIzNTQyMDE5OTU2MTEyMTI5MDIxOTYwODY0MDM0NDE4MTU5ODEzNjI5Nzc0NzcxMzA5OTYwNTE4NzA3MjExMzQ5OTk5OTk4MzcyOTc4MDQ5OTUxMDU5NzMxNzMyODE2MDk2MzE4NTk1MDI0NDU5NDU1MzQ2OTA4MzAyNjQyNTIyMzA4MjUzMzQ0Njg1MDM1MjYxOTMxMTg4MTcxMDEwMDAzMTM3ODM4NzUyODg2NTg3NTMzMjA4MzgxNDIwNjE3MTc3NjY5MTQ3MzAzNTk4MjUzNDkwNDI4NzU1NDY4NzMxMTU5NTYyODYzODgyMzUzNzg3NTkzNzUxOTU3NzgxODU3NzgwNTMyMTcxMjI2ODA2NjEzMDAxOTI3ODc2NjExMTk1OTA5MjE2NDIwMTk4OTM4MDk1MjU3MjAxMDY1NDg1ODYzMjc4OScsXHJcblxyXG5cclxuICAvLyBUaGUgaW5pdGlhbCBjb25maWd1cmF0aW9uIHByb3BlcnRpZXMgb2YgdGhlIERlY2ltYWwgY29uc3RydWN0b3IuXHJcbiAgREVGQVVMVFMgPSB7XHJcblxyXG4gICAgLy8gVGhlc2UgdmFsdWVzIG11c3QgYmUgaW50ZWdlcnMgd2l0aGluIHRoZSBzdGF0ZWQgcmFuZ2VzIChpbmNsdXNpdmUpLlxyXG4gICAgLy8gTW9zdCBvZiB0aGVzZSB2YWx1ZXMgY2FuIGJlIGNoYW5nZWQgYXQgcnVuLXRpbWUgdXNpbmcgdGhlIGBEZWNpbWFsLmNvbmZpZ2AgbWV0aG9kLlxyXG5cclxuICAgIC8vIFRoZSBtYXhpbXVtIG51bWJlciBvZiBzaWduaWZpY2FudCBkaWdpdHMgb2YgdGhlIHJlc3VsdCBvZiBhIGNhbGN1bGF0aW9uIG9yIGJhc2UgY29udmVyc2lvbi5cclxuICAgIC8vIEUuZy4gYERlY2ltYWwuY29uZmlnKHsgcHJlY2lzaW9uOiAyMCB9KTtgXHJcbiAgICBwcmVjaXNpb246IDIwLCAgICAgICAgICAgICAgICAgICAgICAgICAvLyAxIHRvIE1BWF9ESUdJVFNcclxuXHJcbiAgICAvLyBUaGUgcm91bmRpbmcgbW9kZSB1c2VkIHdoZW4gcm91bmRpbmcgdG8gYHByZWNpc2lvbmAuXHJcbiAgICAvL1xyXG4gICAgLy8gUk9VTkRfVVAgICAgICAgICAwIEF3YXkgZnJvbSB6ZXJvLlxyXG4gICAgLy8gUk9VTkRfRE9XTiAgICAgICAxIFRvd2FyZHMgemVyby5cclxuICAgIC8vIFJPVU5EX0NFSUwgICAgICAgMiBUb3dhcmRzICtJbmZpbml0eS5cclxuICAgIC8vIFJPVU5EX0ZMT09SICAgICAgMyBUb3dhcmRzIC1JbmZpbml0eS5cclxuICAgIC8vIFJPVU5EX0hBTEZfVVAgICAgNCBUb3dhcmRzIG5lYXJlc3QgbmVpZ2hib3VyLiBJZiBlcXVpZGlzdGFudCwgdXAuXHJcbiAgICAvLyBST1VORF9IQUxGX0RPV04gIDUgVG93YXJkcyBuZWFyZXN0IG5laWdoYm91ci4gSWYgZXF1aWRpc3RhbnQsIGRvd24uXHJcbiAgICAvLyBST1VORF9IQUxGX0VWRU4gIDYgVG93YXJkcyBuZWFyZXN0IG5laWdoYm91ci4gSWYgZXF1aWRpc3RhbnQsIHRvd2FyZHMgZXZlbiBuZWlnaGJvdXIuXHJcbiAgICAvLyBST1VORF9IQUxGX0NFSUwgIDcgVG93YXJkcyBuZWFyZXN0IG5laWdoYm91ci4gSWYgZXF1aWRpc3RhbnQsIHRvd2FyZHMgK0luZmluaXR5LlxyXG4gICAgLy8gUk9VTkRfSEFMRl9GTE9PUiA4IFRvd2FyZHMgbmVhcmVzdCBuZWlnaGJvdXIuIElmIGVxdWlkaXN0YW50LCB0b3dhcmRzIC1JbmZpbml0eS5cclxuICAgIC8vXHJcbiAgICAvLyBFLmcuXHJcbiAgICAvLyBgRGVjaW1hbC5yb3VuZGluZyA9IDQ7YFxyXG4gICAgLy8gYERlY2ltYWwucm91bmRpbmcgPSBEZWNpbWFsLlJPVU5EX0hBTEZfVVA7YFxyXG4gICAgcm91bmRpbmc6IDQsICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gMCB0byA4XHJcblxyXG4gICAgLy8gVGhlIG1vZHVsbyBtb2RlIHVzZWQgd2hlbiBjYWxjdWxhdGluZyB0aGUgbW9kdWx1czogYSBtb2Qgbi5cclxuICAgIC8vIFRoZSBxdW90aWVudCAocSA9IGEgLyBuKSBpcyBjYWxjdWxhdGVkIGFjY29yZGluZyB0byB0aGUgY29ycmVzcG9uZGluZyByb3VuZGluZyBtb2RlLlxyXG4gICAgLy8gVGhlIHJlbWFpbmRlciAocikgaXMgY2FsY3VsYXRlZCBhczogciA9IGEgLSBuICogcS5cclxuICAgIC8vXHJcbiAgICAvLyBVUCAgICAgICAgIDAgVGhlIHJlbWFpbmRlciBpcyBwb3NpdGl2ZSBpZiB0aGUgZGl2aWRlbmQgaXMgbmVnYXRpdmUsIGVsc2UgaXMgbmVnYXRpdmUuXHJcbiAgICAvLyBET1dOICAgICAgIDEgVGhlIHJlbWFpbmRlciBoYXMgdGhlIHNhbWUgc2lnbiBhcyB0aGUgZGl2aWRlbmQgKEphdmFTY3JpcHQgJSkuXHJcbiAgICAvLyBGTE9PUiAgICAgIDMgVGhlIHJlbWFpbmRlciBoYXMgdGhlIHNhbWUgc2lnbiBhcyB0aGUgZGl2aXNvciAoUHl0aG9uICUpLlxyXG4gICAgLy8gSEFMRl9FVkVOICA2IFRoZSBJRUVFIDc1NCByZW1haW5kZXIgZnVuY3Rpb24uXHJcbiAgICAvLyBFVUNMSUQgICAgIDkgRXVjbGlkaWFuIGRpdmlzaW9uLiBxID0gc2lnbihuKSAqIGZsb29yKGEgLyBhYnMobikpLiBBbHdheXMgcG9zaXRpdmUuXHJcbiAgICAvL1xyXG4gICAgLy8gVHJ1bmNhdGVkIGRpdmlzaW9uICgxKSwgZmxvb3JlZCBkaXZpc2lvbiAoMyksIHRoZSBJRUVFIDc1NCByZW1haW5kZXIgKDYpLCBhbmQgRXVjbGlkaWFuXHJcbiAgICAvLyBkaXZpc2lvbiAoOSkgYXJlIGNvbW1vbmx5IHVzZWQgZm9yIHRoZSBtb2R1bHVzIG9wZXJhdGlvbi4gVGhlIG90aGVyIHJvdW5kaW5nIG1vZGVzIGNhbiBhbHNvXHJcbiAgICAvLyBiZSB1c2VkLCBidXQgdGhleSBtYXkgbm90IGdpdmUgdXNlZnVsIHJlc3VsdHMuXHJcbiAgICBtb2R1bG86IDEsICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyAwIHRvIDlcclxuXHJcbiAgICAvLyBUaGUgZXhwb25lbnQgdmFsdWUgYXQgYW5kIGJlbmVhdGggd2hpY2ggYHRvU3RyaW5nYCByZXR1cm5zIGV4cG9uZW50aWFsIG5vdGF0aW9uLlxyXG4gICAgLy8gSmF2YVNjcmlwdCBudW1iZXJzOiAtN1xyXG4gICAgdG9FeHBOZWc6IC03LCAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gMCB0byAtRVhQX0xJTUlUXHJcblxyXG4gICAgLy8gVGhlIGV4cG9uZW50IHZhbHVlIGF0IGFuZCBhYm92ZSB3aGljaCBgdG9TdHJpbmdgIHJldHVybnMgZXhwb25lbnRpYWwgbm90YXRpb24uXHJcbiAgICAvLyBKYXZhU2NyaXB0IG51bWJlcnM6IDIxXHJcbiAgICB0b0V4cFBvczogIDIxLCAgICAgICAgICAgICAgICAgICAgICAgICAvLyAwIHRvIEVYUF9MSU1JVFxyXG5cclxuICAgIC8vIFRoZSBtaW5pbXVtIGV4cG9uZW50IHZhbHVlLCBiZW5lYXRoIHdoaWNoIHVuZGVyZmxvdyB0byB6ZXJvIG9jY3Vycy5cclxuICAgIC8vIEphdmFTY3JpcHQgbnVtYmVyczogLTMyNCAgKDVlLTMyNClcclxuICAgIG1pbkU6IC1FWFBfTElNSVQsICAgICAgICAgICAgICAgICAgICAgIC8vIC0xIHRvIC1FWFBfTElNSVRcclxuXHJcbiAgICAvLyBUaGUgbWF4aW11bSBleHBvbmVudCB2YWx1ZSwgYWJvdmUgd2hpY2ggb3ZlcmZsb3cgdG8gSW5maW5pdHkgb2NjdXJzLlxyXG4gICAgLy8gSmF2YVNjcmlwdCBudW1iZXJzOiAzMDggICgxLjc5NzY5MzEzNDg2MjMxNTdlKzMwOClcclxuICAgIG1heEU6IEVYUF9MSU1JVCwgICAgICAgICAgICAgICAgICAgICAgIC8vIDEgdG8gRVhQX0xJTUlUXHJcblxyXG4gICAgLy8gV2hldGhlciB0byB1c2UgY3J5cHRvZ3JhcGhpY2FsbHktc2VjdXJlIHJhbmRvbSBudW1iZXIgZ2VuZXJhdGlvbiwgaWYgYXZhaWxhYmxlLlxyXG4gICAgY3J5cHRvOiBmYWxzZSAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gdHJ1ZS9mYWxzZVxyXG4gIH0sXHJcblxyXG5cclxuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0gRU5EIE9GIEVESVRBQkxFIERFRkFVTFRTIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0gLy9cclxuXHJcblxyXG4gIGluZXhhY3QsIHF1YWRyYW50LFxyXG4gIGV4dGVybmFsID0gdHJ1ZSxcclxuXHJcbiAgZGVjaW1hbEVycm9yID0gJ1tEZWNpbWFsRXJyb3JdICcsXHJcbiAgaW52YWxpZEFyZ3VtZW50ID0gZGVjaW1hbEVycm9yICsgJ0ludmFsaWQgYXJndW1lbnQ6ICcsXHJcbiAgcHJlY2lzaW9uTGltaXRFeGNlZWRlZCA9IGRlY2ltYWxFcnJvciArICdQcmVjaXNpb24gbGltaXQgZXhjZWVkZWQnLFxyXG4gIGNyeXB0b1VuYXZhaWxhYmxlID0gZGVjaW1hbEVycm9yICsgJ2NyeXB0byB1bmF2YWlsYWJsZScsXHJcbiAgdGFnID0gJ1tvYmplY3QgRGVjaW1hbF0nLFxyXG5cclxuICBtYXRoZmxvb3IgPSBNYXRoLmZsb29yLFxyXG4gIG1hdGhwb3cgPSBNYXRoLnBvdyxcclxuXHJcbiAgaXNCaW5hcnkgPSAvXjBiKFswMV0rKFxcLlswMV0qKT98XFwuWzAxXSspKHBbKy1dP1xcZCspPyQvaSxcclxuICBpc0hleCA9IC9eMHgoWzAtOWEtZl0rKFxcLlswLTlhLWZdKik/fFxcLlswLTlhLWZdKykocFsrLV0/XFxkKyk/JC9pLFxyXG4gIGlzT2N0YWwgPSAvXjBvKFswLTddKyhcXC5bMC03XSopP3xcXC5bMC03XSspKHBbKy1dP1xcZCspPyQvaSxcclxuICBpc0RlY2ltYWwgPSAvXihcXGQrKFxcLlxcZCopP3xcXC5cXGQrKShlWystXT9cXGQrKT8kL2ksXHJcblxyXG4gIEJBU0UgPSAxZTcsXHJcbiAgTE9HX0JBU0UgPSA3LFxyXG4gIE1BWF9TQUZFX0lOVEVHRVIgPSA5MDA3MTk5MjU0NzQwOTkxLFxyXG5cclxuICBMTjEwX1BSRUNJU0lPTiA9IExOMTAubGVuZ3RoIC0gMSxcclxuICBQSV9QUkVDSVNJT04gPSBQSS5sZW5ndGggLSAxLFxyXG5cclxuICAvLyBEZWNpbWFsLnByb3RvdHlwZSBvYmplY3RcclxuICBQID0geyB0b1N0cmluZ1RhZzogdGFnIH07XHJcblxyXG5cclxuLy8gRGVjaW1hbCBwcm90b3R5cGUgbWV0aG9kc1xyXG5cclxuXHJcbi8qXHJcbiAqICBhYnNvbHV0ZVZhbHVlICAgICAgICAgICAgIGFic1xyXG4gKiAgY2VpbFxyXG4gKiAgY2xhbXBlZFRvICAgICAgICAgICAgICAgICBjbGFtcFxyXG4gKiAgY29tcGFyZWRUbyAgICAgICAgICAgICAgICBjbXBcclxuICogIGNvc2luZSAgICAgICAgICAgICAgICAgICAgY29zXHJcbiAqICBjdWJlUm9vdCAgICAgICAgICAgICAgICAgIGNicnRcclxuICogIGRlY2ltYWxQbGFjZXMgICAgICAgICAgICAgZHBcclxuICogIGRpdmlkZWRCeSAgICAgICAgICAgICAgICAgZGl2XHJcbiAqICBkaXZpZGVkVG9JbnRlZ2VyQnkgICAgICAgIGRpdlRvSW50XHJcbiAqICBlcXVhbHMgICAgICAgICAgICAgICAgICAgIGVxXHJcbiAqICBmbG9vclxyXG4gKiAgZ3JlYXRlclRoYW4gICAgICAgICAgICAgICBndFxyXG4gKiAgZ3JlYXRlclRoYW5PckVxdWFsVG8gICAgICBndGVcclxuICogIGh5cGVyYm9saWNDb3NpbmUgICAgICAgICAgY29zaFxyXG4gKiAgaHlwZXJib2xpY1NpbmUgICAgICAgICAgICBzaW5oXHJcbiAqICBoeXBlcmJvbGljVGFuZ2VudCAgICAgICAgIHRhbmhcclxuICogIGludmVyc2VDb3NpbmUgICAgICAgICAgICAgYWNvc1xyXG4gKiAgaW52ZXJzZUh5cGVyYm9saWNDb3NpbmUgICBhY29zaFxyXG4gKiAgaW52ZXJzZUh5cGVyYm9saWNTaW5lICAgICBhc2luaFxyXG4gKiAgaW52ZXJzZUh5cGVyYm9saWNUYW5nZW50ICBhdGFuaFxyXG4gKiAgaW52ZXJzZVNpbmUgICAgICAgICAgICAgICBhc2luXHJcbiAqICBpbnZlcnNlVGFuZ2VudCAgICAgICAgICAgIGF0YW5cclxuICogIGlzRmluaXRlXHJcbiAqICBpc0ludGVnZXIgICAgICAgICAgICAgICAgIGlzSW50XHJcbiAqICBpc05hTlxyXG4gKiAgaXNOZWdhdGl2ZSAgICAgICAgICAgICAgICBpc05lZ1xyXG4gKiAgaXNQb3NpdGl2ZSAgICAgICAgICAgICAgICBpc1Bvc1xyXG4gKiAgaXNaZXJvXHJcbiAqICBsZXNzVGhhbiAgICAgICAgICAgICAgICAgIGx0XHJcbiAqICBsZXNzVGhhbk9yRXF1YWxUbyAgICAgICAgIGx0ZVxyXG4gKiAgbG9nYXJpdGhtICAgICAgICAgICAgICAgICBsb2dcclxuICogIFttYXhpbXVtXSAgICAgICAgICAgICAgICAgW21heF1cclxuICogIFttaW5pbXVtXSAgICAgICAgICAgICAgICAgW21pbl1cclxuICogIG1pbnVzICAgICAgICAgICAgICAgICAgICAgc3ViXHJcbiAqICBtb2R1bG8gICAgICAgICAgICAgICAgICAgIG1vZFxyXG4gKiAgbmF0dXJhbEV4cG9uZW50aWFsICAgICAgICBleHBcclxuICogIG5hdHVyYWxMb2dhcml0aG0gICAgICAgICAgbG5cclxuICogIG5lZ2F0ZWQgICAgICAgICAgICAgICAgICAgbmVnXHJcbiAqICBwbHVzICAgICAgICAgICAgICAgICAgICAgIGFkZFxyXG4gKiAgcHJlY2lzaW9uICAgICAgICAgICAgICAgICBzZFxyXG4gKiAgcm91bmRcclxuICogIHNpbmUgICAgICAgICAgICAgICAgICAgICAgc2luXHJcbiAqICBzcXVhcmVSb290ICAgICAgICAgICAgICAgIHNxcnRcclxuICogIHRhbmdlbnQgICAgICAgICAgICAgICAgICAgdGFuXHJcbiAqICB0aW1lcyAgICAgICAgICAgICAgICAgICAgIG11bFxyXG4gKiAgdG9CaW5hcnlcclxuICogIHRvRGVjaW1hbFBsYWNlcyAgICAgICAgICAgdG9EUFxyXG4gKiAgdG9FeHBvbmVudGlhbFxyXG4gKiAgdG9GaXhlZFxyXG4gKiAgdG9GcmFjdGlvblxyXG4gKiAgdG9IZXhhZGVjaW1hbCAgICAgICAgICAgICB0b0hleFxyXG4gKiAgdG9OZWFyZXN0XHJcbiAqICB0b051bWJlclxyXG4gKiAgdG9PY3RhbFxyXG4gKiAgdG9Qb3dlciAgICAgICAgICAgICAgICAgICBwb3dcclxuICogIHRvUHJlY2lzaW9uXHJcbiAqICB0b1NpZ25pZmljYW50RGlnaXRzICAgICAgIHRvU0RcclxuICogIHRvU3RyaW5nXHJcbiAqICB0cnVuY2F0ZWQgICAgICAgICAgICAgICAgIHRydW5jXHJcbiAqICB2YWx1ZU9mICAgICAgICAgICAgICAgICAgIHRvSlNPTlxyXG4gKi9cclxuXHJcblxyXG4vKlxyXG4gKiBSZXR1cm4gYSBuZXcgRGVjaW1hbCB3aG9zZSB2YWx1ZSBpcyB0aGUgYWJzb2x1dGUgdmFsdWUgb2YgdGhpcyBEZWNpbWFsLlxyXG4gKlxyXG4gKi9cclxuUC5hYnNvbHV0ZVZhbHVlID0gUC5hYnMgPSBmdW5jdGlvbiAoKSB7XHJcbiAgdmFyIHggPSBuZXcgdGhpcy5jb25zdHJ1Y3Rvcih0aGlzKTtcclxuICBpZiAoeC5zIDwgMCkgeC5zID0gMTtcclxuICByZXR1cm4gZmluYWxpc2UoeCk7XHJcbn07XHJcblxyXG5cclxuLypcclxuICogUmV0dXJuIGEgbmV3IERlY2ltYWwgd2hvc2UgdmFsdWUgaXMgdGhlIHZhbHVlIG9mIHRoaXMgRGVjaW1hbCByb3VuZGVkIHRvIGEgd2hvbGUgbnVtYmVyIGluIHRoZVxyXG4gKiBkaXJlY3Rpb24gb2YgcG9zaXRpdmUgSW5maW5pdHkuXHJcbiAqXHJcbiAqL1xyXG5QLmNlaWwgPSBmdW5jdGlvbiAoKSB7XHJcbiAgcmV0dXJuIGZpbmFsaXNlKG5ldyB0aGlzLmNvbnN0cnVjdG9yKHRoaXMpLCB0aGlzLmUgKyAxLCAyKTtcclxufTtcclxuXHJcblxyXG4vKlxyXG4gKiBSZXR1cm4gYSBuZXcgRGVjaW1hbCB3aG9zZSB2YWx1ZSBpcyB0aGUgdmFsdWUgb2YgdGhpcyBEZWNpbWFsIGNsYW1wZWQgdG8gdGhlIHJhbmdlXHJcbiAqIGRlbGluZWF0ZWQgYnkgYG1pbmAgYW5kIGBtYXhgLlxyXG4gKlxyXG4gKiBtaW4ge251bWJlcnxzdHJpbmd8RGVjaW1hbH1cclxuICogbWF4IHtudW1iZXJ8c3RyaW5nfERlY2ltYWx9XHJcbiAqXHJcbiAqL1xyXG5QLmNsYW1wZWRUbyA9IFAuY2xhbXAgPSBmdW5jdGlvbiAobWluLCBtYXgpIHtcclxuICB2YXIgayxcclxuICAgIHggPSB0aGlzLFxyXG4gICAgQ3RvciA9IHguY29uc3RydWN0b3I7XHJcbiAgbWluID0gbmV3IEN0b3IobWluKTtcclxuICBtYXggPSBuZXcgQ3RvcihtYXgpO1xyXG4gIGlmICghbWluLnMgfHwgIW1heC5zKSByZXR1cm4gbmV3IEN0b3IoTmFOKTtcclxuICBpZiAobWluLmd0KG1heCkpIHRocm93IEVycm9yKGludmFsaWRBcmd1bWVudCArIG1heCk7XHJcbiAgayA9IHguY21wKG1pbik7XHJcbiAgcmV0dXJuIGsgPCAwID8gbWluIDogeC5jbXAobWF4KSA+IDAgPyBtYXggOiBuZXcgQ3Rvcih4KTtcclxufTtcclxuXHJcblxyXG4vKlxyXG4gKiBSZXR1cm5cclxuICogICAxICAgIGlmIHRoZSB2YWx1ZSBvZiB0aGlzIERlY2ltYWwgaXMgZ3JlYXRlciB0aGFuIHRoZSB2YWx1ZSBvZiBgeWAsXHJcbiAqICAtMSAgICBpZiB0aGUgdmFsdWUgb2YgdGhpcyBEZWNpbWFsIGlzIGxlc3MgdGhhbiB0aGUgdmFsdWUgb2YgYHlgLFxyXG4gKiAgIDAgICAgaWYgdGhleSBoYXZlIHRoZSBzYW1lIHZhbHVlLFxyXG4gKiAgIE5hTiAgaWYgdGhlIHZhbHVlIG9mIGVpdGhlciBEZWNpbWFsIGlzIE5hTi5cclxuICpcclxuICovXHJcblAuY29tcGFyZWRUbyA9IFAuY21wID0gZnVuY3Rpb24gKHkpIHtcclxuICB2YXIgaSwgaiwgeGRMLCB5ZEwsXHJcbiAgICB4ID0gdGhpcyxcclxuICAgIHhkID0geC5kLFxyXG4gICAgeWQgPSAoeSA9IG5ldyB4LmNvbnN0cnVjdG9yKHkpKS5kLFxyXG4gICAgeHMgPSB4LnMsXHJcbiAgICB5cyA9IHkucztcclxuXHJcbiAgLy8gRWl0aGVyIE5hTiBvciBcdTAwQjFJbmZpbml0eT9cclxuICBpZiAoIXhkIHx8ICF5ZCkge1xyXG4gICAgcmV0dXJuICF4cyB8fCAheXMgPyBOYU4gOiB4cyAhPT0geXMgPyB4cyA6IHhkID09PSB5ZCA/IDAgOiAheGQgXiB4cyA8IDAgPyAxIDogLTE7XHJcbiAgfVxyXG5cclxuICAvLyBFaXRoZXIgemVybz9cclxuICBpZiAoIXhkWzBdIHx8ICF5ZFswXSkgcmV0dXJuIHhkWzBdID8geHMgOiB5ZFswXSA/IC15cyA6IDA7XHJcblxyXG4gIC8vIFNpZ25zIGRpZmZlcj9cclxuICBpZiAoeHMgIT09IHlzKSByZXR1cm4geHM7XHJcblxyXG4gIC8vIENvbXBhcmUgZXhwb25lbnRzLlxyXG4gIGlmICh4LmUgIT09IHkuZSkgcmV0dXJuIHguZSA+IHkuZSBeIHhzIDwgMCA/IDEgOiAtMTtcclxuXHJcbiAgeGRMID0geGQubGVuZ3RoO1xyXG4gIHlkTCA9IHlkLmxlbmd0aDtcclxuXHJcbiAgLy8gQ29tcGFyZSBkaWdpdCBieSBkaWdpdC5cclxuICBmb3IgKGkgPSAwLCBqID0geGRMIDwgeWRMID8geGRMIDogeWRMOyBpIDwgajsgKytpKSB7XHJcbiAgICBpZiAoeGRbaV0gIT09IHlkW2ldKSByZXR1cm4geGRbaV0gPiB5ZFtpXSBeIHhzIDwgMCA/IDEgOiAtMTtcclxuICB9XHJcblxyXG4gIC8vIENvbXBhcmUgbGVuZ3Rocy5cclxuICByZXR1cm4geGRMID09PSB5ZEwgPyAwIDogeGRMID4geWRMIF4geHMgPCAwID8gMSA6IC0xO1xyXG59O1xyXG5cclxuXHJcbi8qXHJcbiAqIFJldHVybiBhIG5ldyBEZWNpbWFsIHdob3NlIHZhbHVlIGlzIHRoZSBjb3NpbmUgb2YgdGhlIHZhbHVlIGluIHJhZGlhbnMgb2YgdGhpcyBEZWNpbWFsLlxyXG4gKlxyXG4gKiBEb21haW46IFstSW5maW5pdHksIEluZmluaXR5XVxyXG4gKiBSYW5nZTogWy0xLCAxXVxyXG4gKlxyXG4gKiBjb3MoMCkgICAgICAgICA9IDFcclxuICogY29zKC0wKSAgICAgICAgPSAxXHJcbiAqIGNvcyhJbmZpbml0eSkgID0gTmFOXHJcbiAqIGNvcygtSW5maW5pdHkpID0gTmFOXHJcbiAqIGNvcyhOYU4pICAgICAgID0gTmFOXHJcbiAqXHJcbiAqL1xyXG5QLmNvc2luZSA9IFAuY29zID0gZnVuY3Rpb24gKCkge1xyXG4gIHZhciBwciwgcm0sXHJcbiAgICB4ID0gdGhpcyxcclxuICAgIEN0b3IgPSB4LmNvbnN0cnVjdG9yO1xyXG5cclxuICBpZiAoIXguZCkgcmV0dXJuIG5ldyBDdG9yKE5hTik7XHJcblxyXG4gIC8vIGNvcygwKSA9IGNvcygtMCkgPSAxXHJcbiAgaWYgKCF4LmRbMF0pIHJldHVybiBuZXcgQ3RvcigxKTtcclxuXHJcbiAgcHIgPSBDdG9yLnByZWNpc2lvbjtcclxuICBybSA9IEN0b3Iucm91bmRpbmc7XHJcbiAgQ3Rvci5wcmVjaXNpb24gPSBwciArIE1hdGgubWF4KHguZSwgeC5zZCgpKSArIExPR19CQVNFO1xyXG4gIEN0b3Iucm91bmRpbmcgPSAxO1xyXG5cclxuICB4ID0gY29zaW5lKEN0b3IsIHRvTGVzc1RoYW5IYWxmUGkoQ3RvciwgeCkpO1xyXG5cclxuICBDdG9yLnByZWNpc2lvbiA9IHByO1xyXG4gIEN0b3Iucm91bmRpbmcgPSBybTtcclxuXHJcbiAgcmV0dXJuIGZpbmFsaXNlKHF1YWRyYW50ID09IDIgfHwgcXVhZHJhbnQgPT0gMyA/IHgubmVnKCkgOiB4LCBwciwgcm0sIHRydWUpO1xyXG59O1xyXG5cclxuXHJcbi8qXHJcbiAqXHJcbiAqIFJldHVybiBhIG5ldyBEZWNpbWFsIHdob3NlIHZhbHVlIGlzIHRoZSBjdWJlIHJvb3Qgb2YgdGhlIHZhbHVlIG9mIHRoaXMgRGVjaW1hbCwgcm91bmRlZCB0b1xyXG4gKiBgcHJlY2lzaW9uYCBzaWduaWZpY2FudCBkaWdpdHMgdXNpbmcgcm91bmRpbmcgbW9kZSBgcm91bmRpbmdgLlxyXG4gKlxyXG4gKiAgY2JydCgwKSAgPSAgMFxyXG4gKiAgY2JydCgtMCkgPSAtMFxyXG4gKiAgY2JydCgxKSAgPSAgMVxyXG4gKiAgY2JydCgtMSkgPSAtMVxyXG4gKiAgY2JydChOKSAgPSAgTlxyXG4gKiAgY2JydCgtSSkgPSAtSVxyXG4gKiAgY2JydChJKSAgPSAgSVxyXG4gKlxyXG4gKiBNYXRoLmNicnQoeCkgPSAoeCA8IDAgPyAtTWF0aC5wb3coLXgsIDEvMykgOiBNYXRoLnBvdyh4LCAxLzMpKVxyXG4gKlxyXG4gKi9cclxuUC5jdWJlUm9vdCA9IFAuY2JydCA9IGZ1bmN0aW9uICgpIHtcclxuICB2YXIgZSwgbSwgbiwgciwgcmVwLCBzLCBzZCwgdCwgdDMsIHQzcGx1c3gsXHJcbiAgICB4ID0gdGhpcyxcclxuICAgIEN0b3IgPSB4LmNvbnN0cnVjdG9yO1xyXG5cclxuICBpZiAoIXguaXNGaW5pdGUoKSB8fCB4LmlzWmVybygpKSByZXR1cm4gbmV3IEN0b3IoeCk7XHJcbiAgZXh0ZXJuYWwgPSBmYWxzZTtcclxuXHJcbiAgLy8gSW5pdGlhbCBlc3RpbWF0ZS5cclxuICBzID0geC5zICogbWF0aHBvdyh4LnMgKiB4LCAxIC8gMyk7XHJcblxyXG4gICAvLyBNYXRoLmNicnQgdW5kZXJmbG93L292ZXJmbG93P1xyXG4gICAvLyBQYXNzIHggdG8gTWF0aC5wb3cgYXMgaW50ZWdlciwgdGhlbiBhZGp1c3QgdGhlIGV4cG9uZW50IG9mIHRoZSByZXN1bHQuXHJcbiAgaWYgKCFzIHx8IE1hdGguYWJzKHMpID09IDEgLyAwKSB7XHJcbiAgICBuID0gZGlnaXRzVG9TdHJpbmcoeC5kKTtcclxuICAgIGUgPSB4LmU7XHJcblxyXG4gICAgLy8gQWRqdXN0IG4gZXhwb25lbnQgc28gaXQgaXMgYSBtdWx0aXBsZSBvZiAzIGF3YXkgZnJvbSB4IGV4cG9uZW50LlxyXG4gICAgaWYgKHMgPSAoZSAtIG4ubGVuZ3RoICsgMSkgJSAzKSBuICs9IChzID09IDEgfHwgcyA9PSAtMiA/ICcwJyA6ICcwMCcpO1xyXG4gICAgcyA9IG1hdGhwb3cobiwgMSAvIDMpO1xyXG5cclxuICAgIC8vIFJhcmVseSwgZSBtYXkgYmUgb25lIGxlc3MgdGhhbiB0aGUgcmVzdWx0IGV4cG9uZW50IHZhbHVlLlxyXG4gICAgZSA9IG1hdGhmbG9vcigoZSArIDEpIC8gMykgLSAoZSAlIDMgPT0gKGUgPCAwID8gLTEgOiAyKSk7XHJcblxyXG4gICAgaWYgKHMgPT0gMSAvIDApIHtcclxuICAgICAgbiA9ICc1ZScgKyBlO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgbiA9IHMudG9FeHBvbmVudGlhbCgpO1xyXG4gICAgICBuID0gbi5zbGljZSgwLCBuLmluZGV4T2YoJ2UnKSArIDEpICsgZTtcclxuICAgIH1cclxuXHJcbiAgICByID0gbmV3IEN0b3Iobik7XHJcbiAgICByLnMgPSB4LnM7XHJcbiAgfSBlbHNlIHtcclxuICAgIHIgPSBuZXcgQ3RvcihzLnRvU3RyaW5nKCkpO1xyXG4gIH1cclxuXHJcbiAgc2QgPSAoZSA9IEN0b3IucHJlY2lzaW9uKSArIDM7XHJcblxyXG4gIC8vIEhhbGxleSdzIG1ldGhvZC5cclxuICAvLyBUT0RPPyBDb21wYXJlIE5ld3RvbidzIG1ldGhvZC5cclxuICBmb3IgKDs7KSB7XHJcbiAgICB0ID0gcjtcclxuICAgIHQzID0gdC50aW1lcyh0KS50aW1lcyh0KTtcclxuICAgIHQzcGx1c3ggPSB0My5wbHVzKHgpO1xyXG4gICAgciA9IGRpdmlkZSh0M3BsdXN4LnBsdXMoeCkudGltZXModCksIHQzcGx1c3gucGx1cyh0MyksIHNkICsgMiwgMSk7XHJcblxyXG4gICAgLy8gVE9ETz8gUmVwbGFjZSB3aXRoIGZvci1sb29wIGFuZCBjaGVja1JvdW5kaW5nRGlnaXRzLlxyXG4gICAgaWYgKGRpZ2l0c1RvU3RyaW5nKHQuZCkuc2xpY2UoMCwgc2QpID09PSAobiA9IGRpZ2l0c1RvU3RyaW5nKHIuZCkpLnNsaWNlKDAsIHNkKSkge1xyXG4gICAgICBuID0gbi5zbGljZShzZCAtIDMsIHNkICsgMSk7XHJcblxyXG4gICAgICAvLyBUaGUgNHRoIHJvdW5kaW5nIGRpZ2l0IG1heSBiZSBpbiBlcnJvciBieSAtMSBzbyBpZiB0aGUgNCByb3VuZGluZyBkaWdpdHMgYXJlIDk5OTkgb3IgNDk5OVxyXG4gICAgICAvLyAsIGkuZS4gYXBwcm9hY2hpbmcgYSByb3VuZGluZyBib3VuZGFyeSwgY29udGludWUgdGhlIGl0ZXJhdGlvbi5cclxuICAgICAgaWYgKG4gPT0gJzk5OTknIHx8ICFyZXAgJiYgbiA9PSAnNDk5OScpIHtcclxuXHJcbiAgICAgICAgLy8gT24gdGhlIGZpcnN0IGl0ZXJhdGlvbiBvbmx5LCBjaGVjayB0byBzZWUgaWYgcm91bmRpbmcgdXAgZ2l2ZXMgdGhlIGV4YWN0IHJlc3VsdCBhcyB0aGVcclxuICAgICAgICAvLyBuaW5lcyBtYXkgaW5maW5pdGVseSByZXBlYXQuXHJcbiAgICAgICAgaWYgKCFyZXApIHtcclxuICAgICAgICAgIGZpbmFsaXNlKHQsIGUgKyAxLCAwKTtcclxuXHJcbiAgICAgICAgICBpZiAodC50aW1lcyh0KS50aW1lcyh0KS5lcSh4KSkge1xyXG4gICAgICAgICAgICByID0gdDtcclxuICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBzZCArPSA0O1xyXG4gICAgICAgIHJlcCA9IDE7XHJcbiAgICAgIH0gZWxzZSB7XHJcblxyXG4gICAgICAgIC8vIElmIHRoZSByb3VuZGluZyBkaWdpdHMgYXJlIG51bGwsIDB7MCw0fSBvciA1MHswLDN9LCBjaGVjayBmb3IgYW4gZXhhY3QgcmVzdWx0LlxyXG4gICAgICAgIC8vIElmIG5vdCwgdGhlbiB0aGVyZSBhcmUgZnVydGhlciBkaWdpdHMgYW5kIG0gd2lsbCBiZSB0cnV0aHkuXHJcbiAgICAgICAgaWYgKCErbiB8fCAhK24uc2xpY2UoMSkgJiYgbi5jaGFyQXQoMCkgPT0gJzUnKSB7XHJcblxyXG4gICAgICAgICAgLy8gVHJ1bmNhdGUgdG8gdGhlIGZpcnN0IHJvdW5kaW5nIGRpZ2l0LlxyXG4gICAgICAgICAgZmluYWxpc2UociwgZSArIDEsIDEpO1xyXG4gICAgICAgICAgbSA9ICFyLnRpbWVzKHIpLnRpbWVzKHIpLmVxKHgpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgYnJlYWs7XHJcbiAgICAgIH1cclxuICAgIH1cclxuICB9XHJcblxyXG4gIGV4dGVybmFsID0gdHJ1ZTtcclxuXHJcbiAgcmV0dXJuIGZpbmFsaXNlKHIsIGUsIEN0b3Iucm91bmRpbmcsIG0pO1xyXG59O1xyXG5cclxuXHJcbi8qXHJcbiAqIFJldHVybiB0aGUgbnVtYmVyIG9mIGRlY2ltYWwgcGxhY2VzIG9mIHRoZSB2YWx1ZSBvZiB0aGlzIERlY2ltYWwuXHJcbiAqXHJcbiAqL1xyXG5QLmRlY2ltYWxQbGFjZXMgPSBQLmRwID0gZnVuY3Rpb24gKCkge1xyXG4gIHZhciB3LFxyXG4gICAgZCA9IHRoaXMuZCxcclxuICAgIG4gPSBOYU47XHJcblxyXG4gIGlmIChkKSB7XHJcbiAgICB3ID0gZC5sZW5ndGggLSAxO1xyXG4gICAgbiA9ICh3IC0gbWF0aGZsb29yKHRoaXMuZSAvIExPR19CQVNFKSkgKiBMT0dfQkFTRTtcclxuXHJcbiAgICAvLyBTdWJ0cmFjdCB0aGUgbnVtYmVyIG9mIHRyYWlsaW5nIHplcm9zIG9mIHRoZSBsYXN0IHdvcmQuXHJcbiAgICB3ID0gZFt3XTtcclxuICAgIGlmICh3KSBmb3IgKDsgdyAlIDEwID09IDA7IHcgLz0gMTApIG4tLTtcclxuICAgIGlmIChuIDwgMCkgbiA9IDA7XHJcbiAgfVxyXG5cclxuICByZXR1cm4gbjtcclxufTtcclxuXHJcblxyXG4vKlxyXG4gKiAgbiAvIDAgPSBJXHJcbiAqICBuIC8gTiA9IE5cclxuICogIG4gLyBJID0gMFxyXG4gKiAgMCAvIG4gPSAwXHJcbiAqICAwIC8gMCA9IE5cclxuICogIDAgLyBOID0gTlxyXG4gKiAgMCAvIEkgPSAwXHJcbiAqICBOIC8gbiA9IE5cclxuICogIE4gLyAwID0gTlxyXG4gKiAgTiAvIE4gPSBOXHJcbiAqICBOIC8gSSA9IE5cclxuICogIEkgLyBuID0gSVxyXG4gKiAgSSAvIDAgPSBJXHJcbiAqICBJIC8gTiA9IE5cclxuICogIEkgLyBJID0gTlxyXG4gKlxyXG4gKiBSZXR1cm4gYSBuZXcgRGVjaW1hbCB3aG9zZSB2YWx1ZSBpcyB0aGUgdmFsdWUgb2YgdGhpcyBEZWNpbWFsIGRpdmlkZWQgYnkgYHlgLCByb3VuZGVkIHRvXHJcbiAqIGBwcmVjaXNpb25gIHNpZ25pZmljYW50IGRpZ2l0cyB1c2luZyByb3VuZGluZyBtb2RlIGByb3VuZGluZ2AuXHJcbiAqXHJcbiAqL1xyXG5QLmRpdmlkZWRCeSA9IFAuZGl2ID0gZnVuY3Rpb24gKHkpIHtcclxuICByZXR1cm4gZGl2aWRlKHRoaXMsIG5ldyB0aGlzLmNvbnN0cnVjdG9yKHkpKTtcclxufTtcclxuXHJcblxyXG4vKlxyXG4gKiBSZXR1cm4gYSBuZXcgRGVjaW1hbCB3aG9zZSB2YWx1ZSBpcyB0aGUgaW50ZWdlciBwYXJ0IG9mIGRpdmlkaW5nIHRoZSB2YWx1ZSBvZiB0aGlzIERlY2ltYWxcclxuICogYnkgdGhlIHZhbHVlIG9mIGB5YCwgcm91bmRlZCB0byBgcHJlY2lzaW9uYCBzaWduaWZpY2FudCBkaWdpdHMgdXNpbmcgcm91bmRpbmcgbW9kZSBgcm91bmRpbmdgLlxyXG4gKlxyXG4gKi9cclxuUC5kaXZpZGVkVG9JbnRlZ2VyQnkgPSBQLmRpdlRvSW50ID0gZnVuY3Rpb24gKHkpIHtcclxuICB2YXIgeCA9IHRoaXMsXHJcbiAgICBDdG9yID0geC5jb25zdHJ1Y3RvcjtcclxuICByZXR1cm4gZmluYWxpc2UoZGl2aWRlKHgsIG5ldyBDdG9yKHkpLCAwLCAxLCAxKSwgQ3Rvci5wcmVjaXNpb24sIEN0b3Iucm91bmRpbmcpO1xyXG59O1xyXG5cclxuXHJcbi8qXHJcbiAqIFJldHVybiB0cnVlIGlmIHRoZSB2YWx1ZSBvZiB0aGlzIERlY2ltYWwgaXMgZXF1YWwgdG8gdGhlIHZhbHVlIG9mIGB5YCwgb3RoZXJ3aXNlIHJldHVybiBmYWxzZS5cclxuICpcclxuICovXHJcblAuZXF1YWxzID0gUC5lcSA9IGZ1bmN0aW9uICh5KSB7XHJcbiAgcmV0dXJuIHRoaXMuY21wKHkpID09PSAwO1xyXG59O1xyXG5cclxuXHJcbi8qXHJcbiAqIFJldHVybiBhIG5ldyBEZWNpbWFsIHdob3NlIHZhbHVlIGlzIHRoZSB2YWx1ZSBvZiB0aGlzIERlY2ltYWwgcm91bmRlZCB0byBhIHdob2xlIG51bWJlciBpbiB0aGVcclxuICogZGlyZWN0aW9uIG9mIG5lZ2F0aXZlIEluZmluaXR5LlxyXG4gKlxyXG4gKi9cclxuUC5mbG9vciA9IGZ1bmN0aW9uICgpIHtcclxuICByZXR1cm4gZmluYWxpc2UobmV3IHRoaXMuY29uc3RydWN0b3IodGhpcyksIHRoaXMuZSArIDEsIDMpO1xyXG59O1xyXG5cclxuXHJcbi8qXHJcbiAqIFJldHVybiB0cnVlIGlmIHRoZSB2YWx1ZSBvZiB0aGlzIERlY2ltYWwgaXMgZ3JlYXRlciB0aGFuIHRoZSB2YWx1ZSBvZiBgeWAsIG90aGVyd2lzZSByZXR1cm5cclxuICogZmFsc2UuXHJcbiAqXHJcbiAqL1xyXG5QLmdyZWF0ZXJUaGFuID0gUC5ndCA9IGZ1bmN0aW9uICh5KSB7XHJcbiAgcmV0dXJuIHRoaXMuY21wKHkpID4gMDtcclxufTtcclxuXHJcblxyXG4vKlxyXG4gKiBSZXR1cm4gdHJ1ZSBpZiB0aGUgdmFsdWUgb2YgdGhpcyBEZWNpbWFsIGlzIGdyZWF0ZXIgdGhhbiBvciBlcXVhbCB0byB0aGUgdmFsdWUgb2YgYHlgLFxyXG4gKiBvdGhlcndpc2UgcmV0dXJuIGZhbHNlLlxyXG4gKlxyXG4gKi9cclxuUC5ncmVhdGVyVGhhbk9yRXF1YWxUbyA9IFAuZ3RlID0gZnVuY3Rpb24gKHkpIHtcclxuICB2YXIgayA9IHRoaXMuY21wKHkpO1xyXG4gIHJldHVybiBrID09IDEgfHwgayA9PT0gMDtcclxufTtcclxuXHJcblxyXG4vKlxyXG4gKiBSZXR1cm4gYSBuZXcgRGVjaW1hbCB3aG9zZSB2YWx1ZSBpcyB0aGUgaHlwZXJib2xpYyBjb3NpbmUgb2YgdGhlIHZhbHVlIGluIHJhZGlhbnMgb2YgdGhpc1xyXG4gKiBEZWNpbWFsLlxyXG4gKlxyXG4gKiBEb21haW46IFstSW5maW5pdHksIEluZmluaXR5XVxyXG4gKiBSYW5nZTogWzEsIEluZmluaXR5XVxyXG4gKlxyXG4gKiBjb3NoKHgpID0gMSArIHheMi8yISArIHheNC80ISArIHheNi82ISArIC4uLlxyXG4gKlxyXG4gKiBjb3NoKDApICAgICAgICAgPSAxXHJcbiAqIGNvc2goLTApICAgICAgICA9IDFcclxuICogY29zaChJbmZpbml0eSkgID0gSW5maW5pdHlcclxuICogY29zaCgtSW5maW5pdHkpID0gSW5maW5pdHlcclxuICogY29zaChOYU4pICAgICAgID0gTmFOXHJcbiAqXHJcbiAqICB4ICAgICAgICB0aW1lIHRha2VuIChtcykgICByZXN1bHRcclxuICogMTAwMCAgICAgIDkgICAgICAgICAgICAgICAgIDkuODUwMzU1NTcwMDg1MjM0OTY5NGUrNDMzXHJcbiAqIDEwMDAwICAgICAyNSAgICAgICAgICAgICAgICA0LjQwMzQwOTExMjgzMTQ2MDc5MzZlKzQzNDJcclxuICogMTAwMDAwICAgIDE3MSAgICAgICAgICAgICAgIDEuNDAzMzMxNjgwMjEzMDYxNTg5N2UrNDM0MjlcclxuICogMTAwMDAwMCAgIDM4MTcgICAgICAgICAgICAgIDEuNTE2NjA3Njk4NDAxMDQzNzcyNWUrNDM0Mjk0XHJcbiAqIDEwMDAwMDAwICBhYmFuZG9uZWQgYWZ0ZXIgMiBtaW51dGUgd2FpdFxyXG4gKlxyXG4gKiBUT0RPPyBDb21wYXJlIHBlcmZvcm1hbmNlIG9mIGNvc2goeCkgPSAwLjUgKiAoZXhwKHgpICsgZXhwKC14KSlcclxuICpcclxuICovXHJcblAuaHlwZXJib2xpY0Nvc2luZSA9IFAuY29zaCA9IGZ1bmN0aW9uICgpIHtcclxuICB2YXIgaywgbiwgcHIsIHJtLCBsZW4sXHJcbiAgICB4ID0gdGhpcyxcclxuICAgIEN0b3IgPSB4LmNvbnN0cnVjdG9yLFxyXG4gICAgb25lID0gbmV3IEN0b3IoMSk7XHJcblxyXG4gIGlmICgheC5pc0Zpbml0ZSgpKSByZXR1cm4gbmV3IEN0b3IoeC5zID8gMSAvIDAgOiBOYU4pO1xyXG4gIGlmICh4LmlzWmVybygpKSByZXR1cm4gb25lO1xyXG5cclxuICBwciA9IEN0b3IucHJlY2lzaW9uO1xyXG4gIHJtID0gQ3Rvci5yb3VuZGluZztcclxuICBDdG9yLnByZWNpc2lvbiA9IHByICsgTWF0aC5tYXgoeC5lLCB4LnNkKCkpICsgNDtcclxuICBDdG9yLnJvdW5kaW5nID0gMTtcclxuICBsZW4gPSB4LmQubGVuZ3RoO1xyXG5cclxuICAvLyBBcmd1bWVudCByZWR1Y3Rpb246IGNvcyg0eCkgPSAxIC0gOGNvc14yKHgpICsgOGNvc140KHgpICsgMVxyXG4gIC8vIGkuZS4gY29zKHgpID0gMSAtIGNvc14yKHgvNCkoOCAtIDhjb3NeMih4LzQpKVxyXG5cclxuICAvLyBFc3RpbWF0ZSB0aGUgb3B0aW11bSBudW1iZXIgb2YgdGltZXMgdG8gdXNlIHRoZSBhcmd1bWVudCByZWR1Y3Rpb24uXHJcbiAgLy8gVE9ETz8gRXN0aW1hdGlvbiByZXVzZWQgZnJvbSBjb3NpbmUoKSBhbmQgbWF5IG5vdCBiZSBvcHRpbWFsIGhlcmUuXHJcbiAgaWYgKGxlbiA8IDMyKSB7XHJcbiAgICBrID0gTWF0aC5jZWlsKGxlbiAvIDMpO1xyXG4gICAgbiA9ICgxIC8gdGlueVBvdyg0LCBrKSkudG9TdHJpbmcoKTtcclxuICB9IGVsc2Uge1xyXG4gICAgayA9IDE2O1xyXG4gICAgbiA9ICcyLjMyODMwNjQzNjUzODY5NjI4OTA2MjVlLTEwJztcclxuICB9XHJcblxyXG4gIHggPSB0YXlsb3JTZXJpZXMoQ3RvciwgMSwgeC50aW1lcyhuKSwgbmV3IEN0b3IoMSksIHRydWUpO1xyXG5cclxuICAvLyBSZXZlcnNlIGFyZ3VtZW50IHJlZHVjdGlvblxyXG4gIHZhciBjb3NoMl94LFxyXG4gICAgaSA9IGssXHJcbiAgICBkOCA9IG5ldyBDdG9yKDgpO1xyXG4gIGZvciAoOyBpLS07KSB7XHJcbiAgICBjb3NoMl94ID0geC50aW1lcyh4KTtcclxuICAgIHggPSBvbmUubWludXMoY29zaDJfeC50aW1lcyhkOC5taW51cyhjb3NoMl94LnRpbWVzKGQ4KSkpKTtcclxuICB9XHJcblxyXG4gIHJldHVybiBmaW5hbGlzZSh4LCBDdG9yLnByZWNpc2lvbiA9IHByLCBDdG9yLnJvdW5kaW5nID0gcm0sIHRydWUpO1xyXG59O1xyXG5cclxuXHJcbi8qXHJcbiAqIFJldHVybiBhIG5ldyBEZWNpbWFsIHdob3NlIHZhbHVlIGlzIHRoZSBoeXBlcmJvbGljIHNpbmUgb2YgdGhlIHZhbHVlIGluIHJhZGlhbnMgb2YgdGhpc1xyXG4gKiBEZWNpbWFsLlxyXG4gKlxyXG4gKiBEb21haW46IFstSW5maW5pdHksIEluZmluaXR5XVxyXG4gKiBSYW5nZTogWy1JbmZpbml0eSwgSW5maW5pdHldXHJcbiAqXHJcbiAqIHNpbmgoeCkgPSB4ICsgeF4zLzMhICsgeF41LzUhICsgeF43LzchICsgLi4uXHJcbiAqXHJcbiAqIHNpbmgoMCkgICAgICAgICA9IDBcclxuICogc2luaCgtMCkgICAgICAgID0gLTBcclxuICogc2luaChJbmZpbml0eSkgID0gSW5maW5pdHlcclxuICogc2luaCgtSW5maW5pdHkpID0gLUluZmluaXR5XHJcbiAqIHNpbmgoTmFOKSAgICAgICA9IE5hTlxyXG4gKlxyXG4gKiB4ICAgICAgICB0aW1lIHRha2VuIChtcylcclxuICogMTAgICAgICAgMiBtc1xyXG4gKiAxMDAgICAgICA1IG1zXHJcbiAqIDEwMDAgICAgIDE0IG1zXHJcbiAqIDEwMDAwICAgIDgyIG1zXHJcbiAqIDEwMDAwMCAgIDg4NiBtcyAgICAgICAgICAgIDEuNDAzMzMxNjgwMjEzMDYxNTg5N2UrNDM0MjlcclxuICogMjAwMDAwICAgMjYxMyBtc1xyXG4gKiAzMDAwMDAgICA1NDA3IG1zXHJcbiAqIDQwMDAwMCAgIDg4MjQgbXNcclxuICogNTAwMDAwICAgMTMwMjYgbXMgICAgICAgICAgOC43MDgwNjQzNjEyNzE4MDg0MTI5ZSsyMTcxNDZcclxuICogMTAwMDAwMCAgNDg1NDMgbXNcclxuICpcclxuICogVE9ETz8gQ29tcGFyZSBwZXJmb3JtYW5jZSBvZiBzaW5oKHgpID0gMC41ICogKGV4cCh4KSAtIGV4cCgteCkpXHJcbiAqXHJcbiAqL1xyXG5QLmh5cGVyYm9saWNTaW5lID0gUC5zaW5oID0gZnVuY3Rpb24gKCkge1xyXG4gIHZhciBrLCBwciwgcm0sIGxlbixcclxuICAgIHggPSB0aGlzLFxyXG4gICAgQ3RvciA9IHguY29uc3RydWN0b3I7XHJcblxyXG4gIGlmICgheC5pc0Zpbml0ZSgpIHx8IHguaXNaZXJvKCkpIHJldHVybiBuZXcgQ3Rvcih4KTtcclxuXHJcbiAgcHIgPSBDdG9yLnByZWNpc2lvbjtcclxuICBybSA9IEN0b3Iucm91bmRpbmc7XHJcbiAgQ3Rvci5wcmVjaXNpb24gPSBwciArIE1hdGgubWF4KHguZSwgeC5zZCgpKSArIDQ7XHJcbiAgQ3Rvci5yb3VuZGluZyA9IDE7XHJcbiAgbGVuID0geC5kLmxlbmd0aDtcclxuXHJcbiAgaWYgKGxlbiA8IDMpIHtcclxuICAgIHggPSB0YXlsb3JTZXJpZXMoQ3RvciwgMiwgeCwgeCwgdHJ1ZSk7XHJcbiAgfSBlbHNlIHtcclxuXHJcbiAgICAvLyBBbHRlcm5hdGl2ZSBhcmd1bWVudCByZWR1Y3Rpb246IHNpbmgoM3gpID0gc2luaCh4KSgzICsgNHNpbmheMih4KSlcclxuICAgIC8vIGkuZS4gc2luaCh4KSA9IHNpbmgoeC8zKSgzICsgNHNpbmheMih4LzMpKVxyXG4gICAgLy8gMyBtdWx0aXBsaWNhdGlvbnMgYW5kIDEgYWRkaXRpb25cclxuXHJcbiAgICAvLyBBcmd1bWVudCByZWR1Y3Rpb246IHNpbmgoNXgpID0gc2luaCh4KSg1ICsgc2luaF4yKHgpKDIwICsgMTZzaW5oXjIoeCkpKVxyXG4gICAgLy8gaS5lLiBzaW5oKHgpID0gc2luaCh4LzUpKDUgKyBzaW5oXjIoeC81KSgyMCArIDE2c2luaF4yKHgvNSkpKVxyXG4gICAgLy8gNCBtdWx0aXBsaWNhdGlvbnMgYW5kIDIgYWRkaXRpb25zXHJcblxyXG4gICAgLy8gRXN0aW1hdGUgdGhlIG9wdGltdW0gbnVtYmVyIG9mIHRpbWVzIHRvIHVzZSB0aGUgYXJndW1lbnQgcmVkdWN0aW9uLlxyXG4gICAgayA9IDEuNCAqIE1hdGguc3FydChsZW4pO1xyXG4gICAgayA9IGsgPiAxNiA/IDE2IDogayB8IDA7XHJcblxyXG4gICAgeCA9IHgudGltZXMoMSAvIHRpbnlQb3coNSwgaykpO1xyXG4gICAgeCA9IHRheWxvclNlcmllcyhDdG9yLCAyLCB4LCB4LCB0cnVlKTtcclxuXHJcbiAgICAvLyBSZXZlcnNlIGFyZ3VtZW50IHJlZHVjdGlvblxyXG4gICAgdmFyIHNpbmgyX3gsXHJcbiAgICAgIGQ1ID0gbmV3IEN0b3IoNSksXHJcbiAgICAgIGQxNiA9IG5ldyBDdG9yKDE2KSxcclxuICAgICAgZDIwID0gbmV3IEN0b3IoMjApO1xyXG4gICAgZm9yICg7IGstLTspIHtcclxuICAgICAgc2luaDJfeCA9IHgudGltZXMoeCk7XHJcbiAgICAgIHggPSB4LnRpbWVzKGQ1LnBsdXMoc2luaDJfeC50aW1lcyhkMTYudGltZXMoc2luaDJfeCkucGx1cyhkMjApKSkpO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgQ3Rvci5wcmVjaXNpb24gPSBwcjtcclxuICBDdG9yLnJvdW5kaW5nID0gcm07XHJcblxyXG4gIHJldHVybiBmaW5hbGlzZSh4LCBwciwgcm0sIHRydWUpO1xyXG59O1xyXG5cclxuXHJcbi8qXHJcbiAqIFJldHVybiBhIG5ldyBEZWNpbWFsIHdob3NlIHZhbHVlIGlzIHRoZSBoeXBlcmJvbGljIHRhbmdlbnQgb2YgdGhlIHZhbHVlIGluIHJhZGlhbnMgb2YgdGhpc1xyXG4gKiBEZWNpbWFsLlxyXG4gKlxyXG4gKiBEb21haW46IFstSW5maW5pdHksIEluZmluaXR5XVxyXG4gKiBSYW5nZTogWy0xLCAxXVxyXG4gKlxyXG4gKiB0YW5oKHgpID0gc2luaCh4KSAvIGNvc2goeClcclxuICpcclxuICogdGFuaCgwKSAgICAgICAgID0gMFxyXG4gKiB0YW5oKC0wKSAgICAgICAgPSAtMFxyXG4gKiB0YW5oKEluZmluaXR5KSAgPSAxXHJcbiAqIHRhbmgoLUluZmluaXR5KSA9IC0xXHJcbiAqIHRhbmgoTmFOKSAgICAgICA9IE5hTlxyXG4gKlxyXG4gKi9cclxuUC5oeXBlcmJvbGljVGFuZ2VudCA9IFAudGFuaCA9IGZ1bmN0aW9uICgpIHtcclxuICB2YXIgcHIsIHJtLFxyXG4gICAgeCA9IHRoaXMsXHJcbiAgICBDdG9yID0geC5jb25zdHJ1Y3RvcjtcclxuXHJcbiAgaWYgKCF4LmlzRmluaXRlKCkpIHJldHVybiBuZXcgQ3Rvcih4LnMpO1xyXG4gIGlmICh4LmlzWmVybygpKSByZXR1cm4gbmV3IEN0b3IoeCk7XHJcblxyXG4gIHByID0gQ3Rvci5wcmVjaXNpb247XHJcbiAgcm0gPSBDdG9yLnJvdW5kaW5nO1xyXG4gIEN0b3IucHJlY2lzaW9uID0gcHIgKyA3O1xyXG4gIEN0b3Iucm91bmRpbmcgPSAxO1xyXG5cclxuICByZXR1cm4gZGl2aWRlKHguc2luaCgpLCB4LmNvc2goKSwgQ3Rvci5wcmVjaXNpb24gPSBwciwgQ3Rvci5yb3VuZGluZyA9IHJtKTtcclxufTtcclxuXHJcblxyXG4vKlxyXG4gKiBSZXR1cm4gYSBuZXcgRGVjaW1hbCB3aG9zZSB2YWx1ZSBpcyB0aGUgYXJjY29zaW5lIChpbnZlcnNlIGNvc2luZSkgaW4gcmFkaWFucyBvZiB0aGUgdmFsdWUgb2ZcclxuICogdGhpcyBEZWNpbWFsLlxyXG4gKlxyXG4gKiBEb21haW46IFstMSwgMV1cclxuICogUmFuZ2U6IFswLCBwaV1cclxuICpcclxuICogYWNvcyh4KSA9IHBpLzIgLSBhc2luKHgpXHJcbiAqXHJcbiAqIGFjb3MoMCkgICAgICAgPSBwaS8yXHJcbiAqIGFjb3MoLTApICAgICAgPSBwaS8yXHJcbiAqIGFjb3MoMSkgICAgICAgPSAwXHJcbiAqIGFjb3MoLTEpICAgICAgPSBwaVxyXG4gKiBhY29zKDEvMikgICAgID0gcGkvM1xyXG4gKiBhY29zKC0xLzIpICAgID0gMipwaS8zXHJcbiAqIGFjb3MofHh8ID4gMSkgPSBOYU5cclxuICogYWNvcyhOYU4pICAgICA9IE5hTlxyXG4gKlxyXG4gKi9cclxuUC5pbnZlcnNlQ29zaW5lID0gUC5hY29zID0gZnVuY3Rpb24gKCkge1xyXG4gIHZhciBoYWxmUGksXHJcbiAgICB4ID0gdGhpcyxcclxuICAgIEN0b3IgPSB4LmNvbnN0cnVjdG9yLFxyXG4gICAgayA9IHguYWJzKCkuY21wKDEpLFxyXG4gICAgcHIgPSBDdG9yLnByZWNpc2lvbixcclxuICAgIHJtID0gQ3Rvci5yb3VuZGluZztcclxuXHJcbiAgaWYgKGsgIT09IC0xKSB7XHJcbiAgICByZXR1cm4gayA9PT0gMFxyXG4gICAgICAvLyB8eHwgaXMgMVxyXG4gICAgICA/IHguaXNOZWcoKSA/IGdldFBpKEN0b3IsIHByLCBybSkgOiBuZXcgQ3RvcigwKVxyXG4gICAgICAvLyB8eHwgPiAxIG9yIHggaXMgTmFOXHJcbiAgICAgIDogbmV3IEN0b3IoTmFOKTtcclxuICB9XHJcblxyXG4gIGlmICh4LmlzWmVybygpKSByZXR1cm4gZ2V0UGkoQ3RvciwgcHIgKyA0LCBybSkudGltZXMoMC41KTtcclxuXHJcbiAgLy8gVE9ETz8gU3BlY2lhbCBjYXNlIGFjb3MoMC41KSA9IHBpLzMgYW5kIGFjb3MoLTAuNSkgPSAyKnBpLzNcclxuXHJcbiAgQ3Rvci5wcmVjaXNpb24gPSBwciArIDY7XHJcbiAgQ3Rvci5yb3VuZGluZyA9IDE7XHJcblxyXG4gIHggPSB4LmFzaW4oKTtcclxuICBoYWxmUGkgPSBnZXRQaShDdG9yLCBwciArIDQsIHJtKS50aW1lcygwLjUpO1xyXG5cclxuICBDdG9yLnByZWNpc2lvbiA9IHByO1xyXG4gIEN0b3Iucm91bmRpbmcgPSBybTtcclxuXHJcbiAgcmV0dXJuIGhhbGZQaS5taW51cyh4KTtcclxufTtcclxuXHJcblxyXG4vKlxyXG4gKiBSZXR1cm4gYSBuZXcgRGVjaW1hbCB3aG9zZSB2YWx1ZSBpcyB0aGUgaW52ZXJzZSBvZiB0aGUgaHlwZXJib2xpYyBjb3NpbmUgaW4gcmFkaWFucyBvZiB0aGVcclxuICogdmFsdWUgb2YgdGhpcyBEZWNpbWFsLlxyXG4gKlxyXG4gKiBEb21haW46IFsxLCBJbmZpbml0eV1cclxuICogUmFuZ2U6IFswLCBJbmZpbml0eV1cclxuICpcclxuICogYWNvc2goeCkgPSBsbih4ICsgc3FydCh4XjIgLSAxKSlcclxuICpcclxuICogYWNvc2goeCA8IDEpICAgICA9IE5hTlxyXG4gKiBhY29zaChOYU4pICAgICAgID0gTmFOXHJcbiAqIGFjb3NoKEluZmluaXR5KSAgPSBJbmZpbml0eVxyXG4gKiBhY29zaCgtSW5maW5pdHkpID0gTmFOXHJcbiAqIGFjb3NoKDApICAgICAgICAgPSBOYU5cclxuICogYWNvc2goLTApICAgICAgICA9IE5hTlxyXG4gKiBhY29zaCgxKSAgICAgICAgID0gMFxyXG4gKiBhY29zaCgtMSkgICAgICAgID0gTmFOXHJcbiAqXHJcbiAqL1xyXG5QLmludmVyc2VIeXBlcmJvbGljQ29zaW5lID0gUC5hY29zaCA9IGZ1bmN0aW9uICgpIHtcclxuICB2YXIgcHIsIHJtLFxyXG4gICAgeCA9IHRoaXMsXHJcbiAgICBDdG9yID0geC5jb25zdHJ1Y3RvcjtcclxuXHJcbiAgaWYgKHgubHRlKDEpKSByZXR1cm4gbmV3IEN0b3IoeC5lcSgxKSA/IDAgOiBOYU4pO1xyXG4gIGlmICgheC5pc0Zpbml0ZSgpKSByZXR1cm4gbmV3IEN0b3IoeCk7XHJcblxyXG4gIHByID0gQ3Rvci5wcmVjaXNpb247XHJcbiAgcm0gPSBDdG9yLnJvdW5kaW5nO1xyXG4gIEN0b3IucHJlY2lzaW9uID0gcHIgKyBNYXRoLm1heChNYXRoLmFicyh4LmUpLCB4LnNkKCkpICsgNDtcclxuICBDdG9yLnJvdW5kaW5nID0gMTtcclxuICBleHRlcm5hbCA9IGZhbHNlO1xyXG5cclxuICB4ID0geC50aW1lcyh4KS5taW51cygxKS5zcXJ0KCkucGx1cyh4KTtcclxuXHJcbiAgZXh0ZXJuYWwgPSB0cnVlO1xyXG4gIEN0b3IucHJlY2lzaW9uID0gcHI7XHJcbiAgQ3Rvci5yb3VuZGluZyA9IHJtO1xyXG5cclxuICByZXR1cm4geC5sbigpO1xyXG59O1xyXG5cclxuXHJcbi8qXHJcbiAqIFJldHVybiBhIG5ldyBEZWNpbWFsIHdob3NlIHZhbHVlIGlzIHRoZSBpbnZlcnNlIG9mIHRoZSBoeXBlcmJvbGljIHNpbmUgaW4gcmFkaWFucyBvZiB0aGUgdmFsdWVcclxuICogb2YgdGhpcyBEZWNpbWFsLlxyXG4gKlxyXG4gKiBEb21haW46IFstSW5maW5pdHksIEluZmluaXR5XVxyXG4gKiBSYW5nZTogWy1JbmZpbml0eSwgSW5maW5pdHldXHJcbiAqXHJcbiAqIGFzaW5oKHgpID0gbG4oeCArIHNxcnQoeF4yICsgMSkpXHJcbiAqXHJcbiAqIGFzaW5oKE5hTikgICAgICAgPSBOYU5cclxuICogYXNpbmgoSW5maW5pdHkpICA9IEluZmluaXR5XHJcbiAqIGFzaW5oKC1JbmZpbml0eSkgPSAtSW5maW5pdHlcclxuICogYXNpbmgoMCkgICAgICAgICA9IDBcclxuICogYXNpbmgoLTApICAgICAgICA9IC0wXHJcbiAqXHJcbiAqL1xyXG5QLmludmVyc2VIeXBlcmJvbGljU2luZSA9IFAuYXNpbmggPSBmdW5jdGlvbiAoKSB7XHJcbiAgdmFyIHByLCBybSxcclxuICAgIHggPSB0aGlzLFxyXG4gICAgQ3RvciA9IHguY29uc3RydWN0b3I7XHJcblxyXG4gIGlmICgheC5pc0Zpbml0ZSgpIHx8IHguaXNaZXJvKCkpIHJldHVybiBuZXcgQ3Rvcih4KTtcclxuXHJcbiAgcHIgPSBDdG9yLnByZWNpc2lvbjtcclxuICBybSA9IEN0b3Iucm91bmRpbmc7XHJcbiAgQ3Rvci5wcmVjaXNpb24gPSBwciArIDIgKiBNYXRoLm1heChNYXRoLmFicyh4LmUpLCB4LnNkKCkpICsgNjtcclxuICBDdG9yLnJvdW5kaW5nID0gMTtcclxuICBleHRlcm5hbCA9IGZhbHNlO1xyXG5cclxuICB4ID0geC50aW1lcyh4KS5wbHVzKDEpLnNxcnQoKS5wbHVzKHgpO1xyXG5cclxuICBleHRlcm5hbCA9IHRydWU7XHJcbiAgQ3Rvci5wcmVjaXNpb24gPSBwcjtcclxuICBDdG9yLnJvdW5kaW5nID0gcm07XHJcblxyXG4gIHJldHVybiB4LmxuKCk7XHJcbn07XHJcblxyXG5cclxuLypcclxuICogUmV0dXJuIGEgbmV3IERlY2ltYWwgd2hvc2UgdmFsdWUgaXMgdGhlIGludmVyc2Ugb2YgdGhlIGh5cGVyYm9saWMgdGFuZ2VudCBpbiByYWRpYW5zIG9mIHRoZVxyXG4gKiB2YWx1ZSBvZiB0aGlzIERlY2ltYWwuXHJcbiAqXHJcbiAqIERvbWFpbjogWy0xLCAxXVxyXG4gKiBSYW5nZTogWy1JbmZpbml0eSwgSW5maW5pdHldXHJcbiAqXHJcbiAqIGF0YW5oKHgpID0gMC41ICogbG4oKDEgKyB4KSAvICgxIC0geCkpXHJcbiAqXHJcbiAqIGF0YW5oKHx4fCA+IDEpICAgPSBOYU5cclxuICogYXRhbmgoTmFOKSAgICAgICA9IE5hTlxyXG4gKiBhdGFuaChJbmZpbml0eSkgID0gTmFOXHJcbiAqIGF0YW5oKC1JbmZpbml0eSkgPSBOYU5cclxuICogYXRhbmgoMCkgICAgICAgICA9IDBcclxuICogYXRhbmgoLTApICAgICAgICA9IC0wXHJcbiAqIGF0YW5oKDEpICAgICAgICAgPSBJbmZpbml0eVxyXG4gKiBhdGFuaCgtMSkgICAgICAgID0gLUluZmluaXR5XHJcbiAqXHJcbiAqL1xyXG5QLmludmVyc2VIeXBlcmJvbGljVGFuZ2VudCA9IFAuYXRhbmggPSBmdW5jdGlvbiAoKSB7XHJcbiAgdmFyIHByLCBybSwgd3ByLCB4c2QsXHJcbiAgICB4ID0gdGhpcyxcclxuICAgIEN0b3IgPSB4LmNvbnN0cnVjdG9yO1xyXG5cclxuICBpZiAoIXguaXNGaW5pdGUoKSkgcmV0dXJuIG5ldyBDdG9yKE5hTik7XHJcbiAgaWYgKHguZSA+PSAwKSByZXR1cm4gbmV3IEN0b3IoeC5hYnMoKS5lcSgxKSA/IHgucyAvIDAgOiB4LmlzWmVybygpID8geCA6IE5hTik7XHJcblxyXG4gIHByID0gQ3Rvci5wcmVjaXNpb247XHJcbiAgcm0gPSBDdG9yLnJvdW5kaW5nO1xyXG4gIHhzZCA9IHguc2QoKTtcclxuXHJcbiAgaWYgKE1hdGgubWF4KHhzZCwgcHIpIDwgMiAqIC14LmUgLSAxKSByZXR1cm4gZmluYWxpc2UobmV3IEN0b3IoeCksIHByLCBybSwgdHJ1ZSk7XHJcblxyXG4gIEN0b3IucHJlY2lzaW9uID0gd3ByID0geHNkIC0geC5lO1xyXG5cclxuICB4ID0gZGl2aWRlKHgucGx1cygxKSwgbmV3IEN0b3IoMSkubWludXMoeCksIHdwciArIHByLCAxKTtcclxuXHJcbiAgQ3Rvci5wcmVjaXNpb24gPSBwciArIDQ7XHJcbiAgQ3Rvci5yb3VuZGluZyA9IDE7XHJcblxyXG4gIHggPSB4LmxuKCk7XHJcblxyXG4gIEN0b3IucHJlY2lzaW9uID0gcHI7XHJcbiAgQ3Rvci5yb3VuZGluZyA9IHJtO1xyXG5cclxuICByZXR1cm4geC50aW1lcygwLjUpO1xyXG59O1xyXG5cclxuXHJcbi8qXHJcbiAqIFJldHVybiBhIG5ldyBEZWNpbWFsIHdob3NlIHZhbHVlIGlzIHRoZSBhcmNzaW5lIChpbnZlcnNlIHNpbmUpIGluIHJhZGlhbnMgb2YgdGhlIHZhbHVlIG9mIHRoaXNcclxuICogRGVjaW1hbC5cclxuICpcclxuICogRG9tYWluOiBbLUluZmluaXR5LCBJbmZpbml0eV1cclxuICogUmFuZ2U6IFstcGkvMiwgcGkvMl1cclxuICpcclxuICogYXNpbih4KSA9IDIqYXRhbih4LygxICsgc3FydCgxIC0geF4yKSkpXHJcbiAqXHJcbiAqIGFzaW4oMCkgICAgICAgPSAwXHJcbiAqIGFzaW4oLTApICAgICAgPSAtMFxyXG4gKiBhc2luKDEvMikgICAgID0gcGkvNlxyXG4gKiBhc2luKC0xLzIpICAgID0gLXBpLzZcclxuICogYXNpbigxKSAgICAgICA9IHBpLzJcclxuICogYXNpbigtMSkgICAgICA9IC1waS8yXHJcbiAqIGFzaW4ofHh8ID4gMSkgPSBOYU5cclxuICogYXNpbihOYU4pICAgICA9IE5hTlxyXG4gKlxyXG4gKiBUT0RPPyBDb21wYXJlIHBlcmZvcm1hbmNlIG9mIFRheWxvciBzZXJpZXMuXHJcbiAqXHJcbiAqL1xyXG5QLmludmVyc2VTaW5lID0gUC5hc2luID0gZnVuY3Rpb24gKCkge1xyXG4gIHZhciBoYWxmUGksIGssXHJcbiAgICBwciwgcm0sXHJcbiAgICB4ID0gdGhpcyxcclxuICAgIEN0b3IgPSB4LmNvbnN0cnVjdG9yO1xyXG5cclxuICBpZiAoeC5pc1plcm8oKSkgcmV0dXJuIG5ldyBDdG9yKHgpO1xyXG5cclxuICBrID0geC5hYnMoKS5jbXAoMSk7XHJcbiAgcHIgPSBDdG9yLnByZWNpc2lvbjtcclxuICBybSA9IEN0b3Iucm91bmRpbmc7XHJcblxyXG4gIGlmIChrICE9PSAtMSkge1xyXG5cclxuICAgIC8vIHx4fCBpcyAxXHJcbiAgICBpZiAoayA9PT0gMCkge1xyXG4gICAgICBoYWxmUGkgPSBnZXRQaShDdG9yLCBwciArIDQsIHJtKS50aW1lcygwLjUpO1xyXG4gICAgICBoYWxmUGkucyA9IHgucztcclxuICAgICAgcmV0dXJuIGhhbGZQaTtcclxuICAgIH1cclxuXHJcbiAgICAvLyB8eHwgPiAxIG9yIHggaXMgTmFOXHJcbiAgICByZXR1cm4gbmV3IEN0b3IoTmFOKTtcclxuICB9XHJcblxyXG4gIC8vIFRPRE8/IFNwZWNpYWwgY2FzZSBhc2luKDEvMikgPSBwaS82IGFuZCBhc2luKC0xLzIpID0gLXBpLzZcclxuXHJcbiAgQ3Rvci5wcmVjaXNpb24gPSBwciArIDY7XHJcbiAgQ3Rvci5yb3VuZGluZyA9IDE7XHJcblxyXG4gIHggPSB4LmRpdihuZXcgQ3RvcigxKS5taW51cyh4LnRpbWVzKHgpKS5zcXJ0KCkucGx1cygxKSkuYXRhbigpO1xyXG5cclxuICBDdG9yLnByZWNpc2lvbiA9IHByO1xyXG4gIEN0b3Iucm91bmRpbmcgPSBybTtcclxuXHJcbiAgcmV0dXJuIHgudGltZXMoMik7XHJcbn07XHJcblxyXG5cclxuLypcclxuICogUmV0dXJuIGEgbmV3IERlY2ltYWwgd2hvc2UgdmFsdWUgaXMgdGhlIGFyY3RhbmdlbnQgKGludmVyc2UgdGFuZ2VudCkgaW4gcmFkaWFucyBvZiB0aGUgdmFsdWVcclxuICogb2YgdGhpcyBEZWNpbWFsLlxyXG4gKlxyXG4gKiBEb21haW46IFstSW5maW5pdHksIEluZmluaXR5XVxyXG4gKiBSYW5nZTogWy1waS8yLCBwaS8yXVxyXG4gKlxyXG4gKiBhdGFuKHgpID0geCAtIHheMy8zICsgeF41LzUgLSB4XjcvNyArIC4uLlxyXG4gKlxyXG4gKiBhdGFuKDApICAgICAgICAgPSAwXHJcbiAqIGF0YW4oLTApICAgICAgICA9IC0wXHJcbiAqIGF0YW4oMSkgICAgICAgICA9IHBpLzRcclxuICogYXRhbigtMSkgICAgICAgID0gLXBpLzRcclxuICogYXRhbihJbmZpbml0eSkgID0gcGkvMlxyXG4gKiBhdGFuKC1JbmZpbml0eSkgPSAtcGkvMlxyXG4gKiBhdGFuKE5hTikgICAgICAgPSBOYU5cclxuICpcclxuICovXHJcblAuaW52ZXJzZVRhbmdlbnQgPSBQLmF0YW4gPSBmdW5jdGlvbiAoKSB7XHJcbiAgdmFyIGksIGosIGssIG4sIHB4LCB0LCByLCB3cHIsIHgyLFxyXG4gICAgeCA9IHRoaXMsXHJcbiAgICBDdG9yID0geC5jb25zdHJ1Y3RvcixcclxuICAgIHByID0gQ3Rvci5wcmVjaXNpb24sXHJcbiAgICBybSA9IEN0b3Iucm91bmRpbmc7XHJcblxyXG4gIGlmICgheC5pc0Zpbml0ZSgpKSB7XHJcbiAgICBpZiAoIXgucykgcmV0dXJuIG5ldyBDdG9yKE5hTik7XHJcbiAgICBpZiAocHIgKyA0IDw9IFBJX1BSRUNJU0lPTikge1xyXG4gICAgICByID0gZ2V0UGkoQ3RvciwgcHIgKyA0LCBybSkudGltZXMoMC41KTtcclxuICAgICAgci5zID0geC5zO1xyXG4gICAgICByZXR1cm4gcjtcclxuICAgIH1cclxuICB9IGVsc2UgaWYgKHguaXNaZXJvKCkpIHtcclxuICAgIHJldHVybiBuZXcgQ3Rvcih4KTtcclxuICB9IGVsc2UgaWYgKHguYWJzKCkuZXEoMSkgJiYgcHIgKyA0IDw9IFBJX1BSRUNJU0lPTikge1xyXG4gICAgciA9IGdldFBpKEN0b3IsIHByICsgNCwgcm0pLnRpbWVzKDAuMjUpO1xyXG4gICAgci5zID0geC5zO1xyXG4gICAgcmV0dXJuIHI7XHJcbiAgfVxyXG5cclxuICBDdG9yLnByZWNpc2lvbiA9IHdwciA9IHByICsgMTA7XHJcbiAgQ3Rvci5yb3VuZGluZyA9IDE7XHJcblxyXG4gIC8vIFRPRE8/IGlmICh4ID49IDEgJiYgcHIgPD0gUElfUFJFQ0lTSU9OKSBhdGFuKHgpID0gaGFsZlBpICogeC5zIC0gYXRhbigxIC8geCk7XHJcblxyXG4gIC8vIEFyZ3VtZW50IHJlZHVjdGlvblxyXG4gIC8vIEVuc3VyZSB8eHwgPCAwLjQyXHJcbiAgLy8gYXRhbih4KSA9IDIgKiBhdGFuKHggLyAoMSArIHNxcnQoMSArIHheMikpKVxyXG5cclxuICBrID0gTWF0aC5taW4oMjgsIHdwciAvIExPR19CQVNFICsgMiB8IDApO1xyXG5cclxuICBmb3IgKGkgPSBrOyBpOyAtLWkpIHggPSB4LmRpdih4LnRpbWVzKHgpLnBsdXMoMSkuc3FydCgpLnBsdXMoMSkpO1xyXG5cclxuICBleHRlcm5hbCA9IGZhbHNlO1xyXG5cclxuICBqID0gTWF0aC5jZWlsKHdwciAvIExPR19CQVNFKTtcclxuICBuID0gMTtcclxuICB4MiA9IHgudGltZXMoeCk7XHJcbiAgciA9IG5ldyBDdG9yKHgpO1xyXG4gIHB4ID0geDtcclxuXHJcbiAgLy8gYXRhbih4KSA9IHggLSB4XjMvMyArIHheNS81IC0geF43LzcgKyAuLi5cclxuICBmb3IgKDsgaSAhPT0gLTE7KSB7XHJcbiAgICBweCA9IHB4LnRpbWVzKHgyKTtcclxuICAgIHQgPSByLm1pbnVzKHB4LmRpdihuICs9IDIpKTtcclxuXHJcbiAgICBweCA9IHB4LnRpbWVzKHgyKTtcclxuICAgIHIgPSB0LnBsdXMocHguZGl2KG4gKz0gMikpO1xyXG5cclxuICAgIGlmIChyLmRbal0gIT09IHZvaWQgMCkgZm9yIChpID0gajsgci5kW2ldID09PSB0LmRbaV0gJiYgaS0tOyk7XHJcbiAgfVxyXG5cclxuICBpZiAoaykgciA9IHIudGltZXMoMiA8PCAoayAtIDEpKTtcclxuXHJcbiAgZXh0ZXJuYWwgPSB0cnVlO1xyXG5cclxuICByZXR1cm4gZmluYWxpc2UociwgQ3Rvci5wcmVjaXNpb24gPSBwciwgQ3Rvci5yb3VuZGluZyA9IHJtLCB0cnVlKTtcclxufTtcclxuXHJcblxyXG4vKlxyXG4gKiBSZXR1cm4gdHJ1ZSBpZiB0aGUgdmFsdWUgb2YgdGhpcyBEZWNpbWFsIGlzIGEgZmluaXRlIG51bWJlciwgb3RoZXJ3aXNlIHJldHVybiBmYWxzZS5cclxuICpcclxuICovXHJcblAuaXNGaW5pdGUgPSBmdW5jdGlvbiAoKSB7XHJcbiAgcmV0dXJuICEhdGhpcy5kO1xyXG59O1xyXG5cclxuXHJcbi8qXHJcbiAqIFJldHVybiB0cnVlIGlmIHRoZSB2YWx1ZSBvZiB0aGlzIERlY2ltYWwgaXMgYW4gaW50ZWdlciwgb3RoZXJ3aXNlIHJldHVybiBmYWxzZS5cclxuICpcclxuICovXHJcblAuaXNJbnRlZ2VyID0gUC5pc0ludCA9IGZ1bmN0aW9uICgpIHtcclxuICByZXR1cm4gISF0aGlzLmQgJiYgbWF0aGZsb29yKHRoaXMuZSAvIExPR19CQVNFKSA+IHRoaXMuZC5sZW5ndGggLSAyO1xyXG59O1xyXG5cclxuXHJcbi8qXHJcbiAqIFJldHVybiB0cnVlIGlmIHRoZSB2YWx1ZSBvZiB0aGlzIERlY2ltYWwgaXMgTmFOLCBvdGhlcndpc2UgcmV0dXJuIGZhbHNlLlxyXG4gKlxyXG4gKi9cclxuUC5pc05hTiA9IGZ1bmN0aW9uICgpIHtcclxuICByZXR1cm4gIXRoaXMucztcclxufTtcclxuXHJcblxyXG4vKlxyXG4gKiBSZXR1cm4gdHJ1ZSBpZiB0aGUgdmFsdWUgb2YgdGhpcyBEZWNpbWFsIGlzIG5lZ2F0aXZlLCBvdGhlcndpc2UgcmV0dXJuIGZhbHNlLlxyXG4gKlxyXG4gKi9cclxuUC5pc05lZ2F0aXZlID0gUC5pc05lZyA9IGZ1bmN0aW9uICgpIHtcclxuICByZXR1cm4gdGhpcy5zIDwgMDtcclxufTtcclxuXHJcblxyXG4vKlxyXG4gKiBSZXR1cm4gdHJ1ZSBpZiB0aGUgdmFsdWUgb2YgdGhpcyBEZWNpbWFsIGlzIHBvc2l0aXZlLCBvdGhlcndpc2UgcmV0dXJuIGZhbHNlLlxyXG4gKlxyXG4gKi9cclxuUC5pc1Bvc2l0aXZlID0gUC5pc1BvcyA9IGZ1bmN0aW9uICgpIHtcclxuICByZXR1cm4gdGhpcy5zID4gMDtcclxufTtcclxuXHJcblxyXG4vKlxyXG4gKiBSZXR1cm4gdHJ1ZSBpZiB0aGUgdmFsdWUgb2YgdGhpcyBEZWNpbWFsIGlzIDAgb3IgLTAsIG90aGVyd2lzZSByZXR1cm4gZmFsc2UuXHJcbiAqXHJcbiAqL1xyXG5QLmlzWmVybyA9IGZ1bmN0aW9uICgpIHtcclxuICByZXR1cm4gISF0aGlzLmQgJiYgdGhpcy5kWzBdID09PSAwO1xyXG59O1xyXG5cclxuXHJcbi8qXHJcbiAqIFJldHVybiB0cnVlIGlmIHRoZSB2YWx1ZSBvZiB0aGlzIERlY2ltYWwgaXMgbGVzcyB0aGFuIGB5YCwgb3RoZXJ3aXNlIHJldHVybiBmYWxzZS5cclxuICpcclxuICovXHJcblAubGVzc1RoYW4gPSBQLmx0ID0gZnVuY3Rpb24gKHkpIHtcclxuICByZXR1cm4gdGhpcy5jbXAoeSkgPCAwO1xyXG59O1xyXG5cclxuXHJcbi8qXHJcbiAqIFJldHVybiB0cnVlIGlmIHRoZSB2YWx1ZSBvZiB0aGlzIERlY2ltYWwgaXMgbGVzcyB0aGFuIG9yIGVxdWFsIHRvIGB5YCwgb3RoZXJ3aXNlIHJldHVybiBmYWxzZS5cclxuICpcclxuICovXHJcblAubGVzc1RoYW5PckVxdWFsVG8gPSBQLmx0ZSA9IGZ1bmN0aW9uICh5KSB7XHJcbiAgcmV0dXJuIHRoaXMuY21wKHkpIDwgMTtcclxufTtcclxuXHJcblxyXG4vKlxyXG4gKiBSZXR1cm4gdGhlIGxvZ2FyaXRobSBvZiB0aGUgdmFsdWUgb2YgdGhpcyBEZWNpbWFsIHRvIHRoZSBzcGVjaWZpZWQgYmFzZSwgcm91bmRlZCB0byBgcHJlY2lzaW9uYFxyXG4gKiBzaWduaWZpY2FudCBkaWdpdHMgdXNpbmcgcm91bmRpbmcgbW9kZSBgcm91bmRpbmdgLlxyXG4gKlxyXG4gKiBJZiBubyBiYXNlIGlzIHNwZWNpZmllZCwgcmV0dXJuIGxvZ1sxMF0oYXJnKS5cclxuICpcclxuICogbG9nW2Jhc2VdKGFyZykgPSBsbihhcmcpIC8gbG4oYmFzZSlcclxuICpcclxuICogVGhlIHJlc3VsdCB3aWxsIGFsd2F5cyBiZSBjb3JyZWN0bHkgcm91bmRlZCBpZiB0aGUgYmFzZSBvZiB0aGUgbG9nIGlzIDEwLCBhbmQgJ2FsbW9zdCBhbHdheXMnXHJcbiAqIG90aGVyd2lzZTpcclxuICpcclxuICogRGVwZW5kaW5nIG9uIHRoZSByb3VuZGluZyBtb2RlLCB0aGUgcmVzdWx0IG1heSBiZSBpbmNvcnJlY3RseSByb3VuZGVkIGlmIHRoZSBmaXJzdCBmaWZ0ZWVuXHJcbiAqIHJvdW5kaW5nIGRpZ2l0cyBhcmUgWzQ5XTk5OTk5OTk5OTk5OTk5IG9yIFs1MF0wMDAwMDAwMDAwMDAwMC4gSW4gdGhhdCBjYXNlLCB0aGUgbWF4aW11bSBlcnJvclxyXG4gKiBiZXR3ZWVuIHRoZSByZXN1bHQgYW5kIHRoZSBjb3JyZWN0bHkgcm91bmRlZCByZXN1bHQgd2lsbCBiZSBvbmUgdWxwICh1bml0IGluIHRoZSBsYXN0IHBsYWNlKS5cclxuICpcclxuICogbG9nWy1iXShhKSAgICAgICA9IE5hTlxyXG4gKiBsb2dbMF0oYSkgICAgICAgID0gTmFOXHJcbiAqIGxvZ1sxXShhKSAgICAgICAgPSBOYU5cclxuICogbG9nW05hTl0oYSkgICAgICA9IE5hTlxyXG4gKiBsb2dbSW5maW5pdHldKGEpID0gTmFOXHJcbiAqIGxvZ1tiXSgwKSAgICAgICAgPSAtSW5maW5pdHlcclxuICogbG9nW2JdKC0wKSAgICAgICA9IC1JbmZpbml0eVxyXG4gKiBsb2dbYl0oLWEpICAgICAgID0gTmFOXHJcbiAqIGxvZ1tiXSgxKSAgICAgICAgPSAwXHJcbiAqIGxvZ1tiXShJbmZpbml0eSkgPSBJbmZpbml0eVxyXG4gKiBsb2dbYl0oTmFOKSAgICAgID0gTmFOXHJcbiAqXHJcbiAqIFtiYXNlXSB7bnVtYmVyfHN0cmluZ3xEZWNpbWFsfSBUaGUgYmFzZSBvZiB0aGUgbG9nYXJpdGhtLlxyXG4gKlxyXG4gKi9cclxuUC5sb2dhcml0aG0gPSBQLmxvZyA9IGZ1bmN0aW9uIChiYXNlKSB7XHJcbiAgdmFyIGlzQmFzZTEwLCBkLCBkZW5vbWluYXRvciwgaywgaW5mLCBudW0sIHNkLCByLFxyXG4gICAgYXJnID0gdGhpcyxcclxuICAgIEN0b3IgPSBhcmcuY29uc3RydWN0b3IsXHJcbiAgICBwciA9IEN0b3IucHJlY2lzaW9uLFxyXG4gICAgcm0gPSBDdG9yLnJvdW5kaW5nLFxyXG4gICAgZ3VhcmQgPSA1O1xyXG5cclxuICAvLyBEZWZhdWx0IGJhc2UgaXMgMTAuXHJcbiAgaWYgKGJhc2UgPT0gbnVsbCkge1xyXG4gICAgYmFzZSA9IG5ldyBDdG9yKDEwKTtcclxuICAgIGlzQmFzZTEwID0gdHJ1ZTtcclxuICB9IGVsc2Uge1xyXG4gICAgYmFzZSA9IG5ldyBDdG9yKGJhc2UpO1xyXG4gICAgZCA9IGJhc2UuZDtcclxuXHJcbiAgICAvLyBSZXR1cm4gTmFOIGlmIGJhc2UgaXMgbmVnYXRpdmUsIG9yIG5vbi1maW5pdGUsIG9yIGlzIDAgb3IgMS5cclxuICAgIGlmIChiYXNlLnMgPCAwIHx8ICFkIHx8ICFkWzBdIHx8IGJhc2UuZXEoMSkpIHJldHVybiBuZXcgQ3RvcihOYU4pO1xyXG5cclxuICAgIGlzQmFzZTEwID0gYmFzZS5lcSgxMCk7XHJcbiAgfVxyXG5cclxuICBkID0gYXJnLmQ7XHJcblxyXG4gIC8vIElzIGFyZyBuZWdhdGl2ZSwgbm9uLWZpbml0ZSwgMCBvciAxP1xyXG4gIGlmIChhcmcucyA8IDAgfHwgIWQgfHwgIWRbMF0gfHwgYXJnLmVxKDEpKSB7XHJcbiAgICByZXR1cm4gbmV3IEN0b3IoZCAmJiAhZFswXSA/IC0xIC8gMCA6IGFyZy5zICE9IDEgPyBOYU4gOiBkID8gMCA6IDEgLyAwKTtcclxuICB9XHJcblxyXG4gIC8vIFRoZSByZXN1bHQgd2lsbCBoYXZlIGEgbm9uLXRlcm1pbmF0aW5nIGRlY2ltYWwgZXhwYW5zaW9uIGlmIGJhc2UgaXMgMTAgYW5kIGFyZyBpcyBub3QgYW5cclxuICAvLyBpbnRlZ2VyIHBvd2VyIG9mIDEwLlxyXG4gIGlmIChpc0Jhc2UxMCkge1xyXG4gICAgaWYgKGQubGVuZ3RoID4gMSkge1xyXG4gICAgICBpbmYgPSB0cnVlO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgZm9yIChrID0gZFswXTsgayAlIDEwID09PSAwOykgayAvPSAxMDtcclxuICAgICAgaW5mID0gayAhPT0gMTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIGV4dGVybmFsID0gZmFsc2U7XHJcbiAgc2QgPSBwciArIGd1YXJkO1xyXG4gIG51bSA9IG5hdHVyYWxMb2dhcml0aG0oYXJnLCBzZCk7XHJcbiAgZGVub21pbmF0b3IgPSBpc0Jhc2UxMCA/IGdldExuMTAoQ3Rvciwgc2QgKyAxMCkgOiBuYXR1cmFsTG9nYXJpdGhtKGJhc2UsIHNkKTtcclxuXHJcbiAgLy8gVGhlIHJlc3VsdCB3aWxsIGhhdmUgNSByb3VuZGluZyBkaWdpdHMuXHJcbiAgciA9IGRpdmlkZShudW0sIGRlbm9taW5hdG9yLCBzZCwgMSk7XHJcblxyXG4gIC8vIElmIGF0IGEgcm91bmRpbmcgYm91bmRhcnksIGkuZS4gdGhlIHJlc3VsdCdzIHJvdW5kaW5nIGRpZ2l0cyBhcmUgWzQ5XTk5OTkgb3IgWzUwXTAwMDAsXHJcbiAgLy8gY2FsY3VsYXRlIDEwIGZ1cnRoZXIgZGlnaXRzLlxyXG4gIC8vXHJcbiAgLy8gSWYgdGhlIHJlc3VsdCBpcyBrbm93biB0byBoYXZlIGFuIGluZmluaXRlIGRlY2ltYWwgZXhwYW5zaW9uLCByZXBlYXQgdGhpcyB1bnRpbCBpdCBpcyBjbGVhclxyXG4gIC8vIHRoYXQgdGhlIHJlc3VsdCBpcyBhYm92ZSBvciBiZWxvdyB0aGUgYm91bmRhcnkuIE90aGVyd2lzZSwgaWYgYWZ0ZXIgY2FsY3VsYXRpbmcgdGhlIDEwXHJcbiAgLy8gZnVydGhlciBkaWdpdHMsIHRoZSBsYXN0IDE0IGFyZSBuaW5lcywgcm91bmQgdXAgYW5kIGFzc3VtZSB0aGUgcmVzdWx0IGlzIGV4YWN0LlxyXG4gIC8vIEFsc28gYXNzdW1lIHRoZSByZXN1bHQgaXMgZXhhY3QgaWYgdGhlIGxhc3QgMTQgYXJlIHplcm8uXHJcbiAgLy9cclxuICAvLyBFeGFtcGxlIG9mIGEgcmVzdWx0IHRoYXQgd2lsbCBiZSBpbmNvcnJlY3RseSByb3VuZGVkOlxyXG4gIC8vIGxvZ1sxMDQ4NTc2XSg0NTAzNTk5NjI3MzcwNTAyKSA9IDIuNjAwMDAwMDAwMDAwMDAwMDk2MTAyNzk1MTE0NDQ3NDYuLi5cclxuICAvLyBUaGUgYWJvdmUgcmVzdWx0IGNvcnJlY3RseSByb3VuZGVkIHVzaW5nIFJPVU5EX0NFSUwgdG8gMSBkZWNpbWFsIHBsYWNlIHNob3VsZCBiZSAyLjcsIGJ1dCBpdFxyXG4gIC8vIHdpbGwgYmUgZ2l2ZW4gYXMgMi42IGFzIHRoZXJlIGFyZSAxNSB6ZXJvcyBpbW1lZGlhdGVseSBhZnRlciB0aGUgcmVxdWVzdGVkIGRlY2ltYWwgcGxhY2UsIHNvXHJcbiAgLy8gdGhlIGV4YWN0IHJlc3VsdCB3b3VsZCBiZSBhc3N1bWVkIHRvIGJlIDIuNiwgd2hpY2ggcm91bmRlZCB1c2luZyBST1VORF9DRUlMIHRvIDEgZGVjaW1hbFxyXG4gIC8vIHBsYWNlIGlzIHN0aWxsIDIuNi5cclxuICBpZiAoY2hlY2tSb3VuZGluZ0RpZ2l0cyhyLmQsIGsgPSBwciwgcm0pKSB7XHJcblxyXG4gICAgZG8ge1xyXG4gICAgICBzZCArPSAxMDtcclxuICAgICAgbnVtID0gbmF0dXJhbExvZ2FyaXRobShhcmcsIHNkKTtcclxuICAgICAgZGVub21pbmF0b3IgPSBpc0Jhc2UxMCA/IGdldExuMTAoQ3Rvciwgc2QgKyAxMCkgOiBuYXR1cmFsTG9nYXJpdGhtKGJhc2UsIHNkKTtcclxuICAgICAgciA9IGRpdmlkZShudW0sIGRlbm9taW5hdG9yLCBzZCwgMSk7XHJcblxyXG4gICAgICBpZiAoIWluZikge1xyXG5cclxuICAgICAgICAvLyBDaGVjayBmb3IgMTQgbmluZXMgZnJvbSB0aGUgMm5kIHJvdW5kaW5nIGRpZ2l0LCBhcyB0aGUgZmlyc3QgbWF5IGJlIDQuXHJcbiAgICAgICAgaWYgKCtkaWdpdHNUb1N0cmluZyhyLmQpLnNsaWNlKGsgKyAxLCBrICsgMTUpICsgMSA9PSAxZTE0KSB7XHJcbiAgICAgICAgICByID0gZmluYWxpc2UociwgcHIgKyAxLCAwKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGJyZWFrO1xyXG4gICAgICB9XHJcbiAgICB9IHdoaWxlIChjaGVja1JvdW5kaW5nRGlnaXRzKHIuZCwgayArPSAxMCwgcm0pKTtcclxuICB9XHJcblxyXG4gIGV4dGVybmFsID0gdHJ1ZTtcclxuXHJcbiAgcmV0dXJuIGZpbmFsaXNlKHIsIHByLCBybSk7XHJcbn07XHJcblxyXG5cclxuLypcclxuICogUmV0dXJuIGEgbmV3IERlY2ltYWwgd2hvc2UgdmFsdWUgaXMgdGhlIG1heGltdW0gb2YgdGhlIGFyZ3VtZW50cyBhbmQgdGhlIHZhbHVlIG9mIHRoaXMgRGVjaW1hbC5cclxuICpcclxuICogYXJndW1lbnRzIHtudW1iZXJ8c3RyaW5nfERlY2ltYWx9XHJcbiAqXHJcblAubWF4ID0gZnVuY3Rpb24gKCkge1xyXG4gIEFycmF5LnByb3RvdHlwZS5wdXNoLmNhbGwoYXJndW1lbnRzLCB0aGlzKTtcclxuICByZXR1cm4gbWF4T3JNaW4odGhpcy5jb25zdHJ1Y3RvciwgYXJndW1lbnRzLCAnbHQnKTtcclxufTtcclxuICovXHJcblxyXG5cclxuLypcclxuICogUmV0dXJuIGEgbmV3IERlY2ltYWwgd2hvc2UgdmFsdWUgaXMgdGhlIG1pbmltdW0gb2YgdGhlIGFyZ3VtZW50cyBhbmQgdGhlIHZhbHVlIG9mIHRoaXMgRGVjaW1hbC5cclxuICpcclxuICogYXJndW1lbnRzIHtudW1iZXJ8c3RyaW5nfERlY2ltYWx9XHJcbiAqXHJcblAubWluID0gZnVuY3Rpb24gKCkge1xyXG4gIEFycmF5LnByb3RvdHlwZS5wdXNoLmNhbGwoYXJndW1lbnRzLCB0aGlzKTtcclxuICByZXR1cm4gbWF4T3JNaW4odGhpcy5jb25zdHJ1Y3RvciwgYXJndW1lbnRzLCAnZ3QnKTtcclxufTtcclxuICovXHJcblxyXG5cclxuLypcclxuICogIG4gLSAwID0gblxyXG4gKiAgbiAtIE4gPSBOXHJcbiAqICBuIC0gSSA9IC1JXHJcbiAqICAwIC0gbiA9IC1uXHJcbiAqICAwIC0gMCA9IDBcclxuICogIDAgLSBOID0gTlxyXG4gKiAgMCAtIEkgPSAtSVxyXG4gKiAgTiAtIG4gPSBOXHJcbiAqICBOIC0gMCA9IE5cclxuICogIE4gLSBOID0gTlxyXG4gKiAgTiAtIEkgPSBOXHJcbiAqICBJIC0gbiA9IElcclxuICogIEkgLSAwID0gSVxyXG4gKiAgSSAtIE4gPSBOXHJcbiAqICBJIC0gSSA9IE5cclxuICpcclxuICogUmV0dXJuIGEgbmV3IERlY2ltYWwgd2hvc2UgdmFsdWUgaXMgdGhlIHZhbHVlIG9mIHRoaXMgRGVjaW1hbCBtaW51cyBgeWAsIHJvdW5kZWQgdG8gYHByZWNpc2lvbmBcclxuICogc2lnbmlmaWNhbnQgZGlnaXRzIHVzaW5nIHJvdW5kaW5nIG1vZGUgYHJvdW5kaW5nYC5cclxuICpcclxuICovXHJcblAubWludXMgPSBQLnN1YiA9IGZ1bmN0aW9uICh5KSB7XHJcbiAgdmFyIGQsIGUsIGksIGosIGssIGxlbiwgcHIsIHJtLCB4ZCwgeGUsIHhMVHksIHlkLFxyXG4gICAgeCA9IHRoaXMsXHJcbiAgICBDdG9yID0geC5jb25zdHJ1Y3RvcjtcclxuXHJcbiAgeSA9IG5ldyBDdG9yKHkpO1xyXG5cclxuICAvLyBJZiBlaXRoZXIgaXMgbm90IGZpbml0ZS4uLlxyXG4gIGlmICgheC5kIHx8ICF5LmQpIHtcclxuXHJcbiAgICAvLyBSZXR1cm4gTmFOIGlmIGVpdGhlciBpcyBOYU4uXHJcbiAgICBpZiAoIXgucyB8fCAheS5zKSB5ID0gbmV3IEN0b3IoTmFOKTtcclxuXHJcbiAgICAvLyBSZXR1cm4geSBuZWdhdGVkIGlmIHggaXMgZmluaXRlIGFuZCB5IGlzIFx1MDBCMUluZmluaXR5LlxyXG4gICAgZWxzZSBpZiAoeC5kKSB5LnMgPSAteS5zO1xyXG5cclxuICAgIC8vIFJldHVybiB4IGlmIHkgaXMgZmluaXRlIGFuZCB4IGlzIFx1MDBCMUluZmluaXR5LlxyXG4gICAgLy8gUmV0dXJuIHggaWYgYm90aCBhcmUgXHUwMEIxSW5maW5pdHkgd2l0aCBkaWZmZXJlbnQgc2lnbnMuXHJcbiAgICAvLyBSZXR1cm4gTmFOIGlmIGJvdGggYXJlIFx1MDBCMUluZmluaXR5IHdpdGggdGhlIHNhbWUgc2lnbi5cclxuICAgIGVsc2UgeSA9IG5ldyBDdG9yKHkuZCB8fCB4LnMgIT09IHkucyA/IHggOiBOYU4pO1xyXG5cclxuICAgIHJldHVybiB5O1xyXG4gIH1cclxuXHJcbiAgLy8gSWYgc2lnbnMgZGlmZmVyLi4uXHJcbiAgaWYgKHgucyAhPSB5LnMpIHtcclxuICAgIHkucyA9IC15LnM7XHJcbiAgICByZXR1cm4geC5wbHVzKHkpO1xyXG4gIH1cclxuXHJcbiAgeGQgPSB4LmQ7XHJcbiAgeWQgPSB5LmQ7XHJcbiAgcHIgPSBDdG9yLnByZWNpc2lvbjtcclxuICBybSA9IEN0b3Iucm91bmRpbmc7XHJcblxyXG4gIC8vIElmIGVpdGhlciBpcyB6ZXJvLi4uXHJcbiAgaWYgKCF4ZFswXSB8fCAheWRbMF0pIHtcclxuXHJcbiAgICAvLyBSZXR1cm4geSBuZWdhdGVkIGlmIHggaXMgemVybyBhbmQgeSBpcyBub24temVyby5cclxuICAgIGlmICh5ZFswXSkgeS5zID0gLXkucztcclxuXHJcbiAgICAvLyBSZXR1cm4geCBpZiB5IGlzIHplcm8gYW5kIHggaXMgbm9uLXplcm8uXHJcbiAgICBlbHNlIGlmICh4ZFswXSkgeSA9IG5ldyBDdG9yKHgpO1xyXG5cclxuICAgIC8vIFJldHVybiB6ZXJvIGlmIGJvdGggYXJlIHplcm8uXHJcbiAgICAvLyBGcm9tIElFRUUgNzU0ICgyMDA4KSA2LjM6IDAgLSAwID0gLTAgLSAtMCA9IC0wIHdoZW4gcm91bmRpbmcgdG8gLUluZmluaXR5LlxyXG4gICAgZWxzZSByZXR1cm4gbmV3IEN0b3Iocm0gPT09IDMgPyAtMCA6IDApO1xyXG5cclxuICAgIHJldHVybiBleHRlcm5hbCA/IGZpbmFsaXNlKHksIHByLCBybSkgOiB5O1xyXG4gIH1cclxuXHJcbiAgLy8geCBhbmQgeSBhcmUgZmluaXRlLCBub24temVybyBudW1iZXJzIHdpdGggdGhlIHNhbWUgc2lnbi5cclxuXHJcbiAgLy8gQ2FsY3VsYXRlIGJhc2UgMWU3IGV4cG9uZW50cy5cclxuICBlID0gbWF0aGZsb29yKHkuZSAvIExPR19CQVNFKTtcclxuICB4ZSA9IG1hdGhmbG9vcih4LmUgLyBMT0dfQkFTRSk7XHJcblxyXG4gIHhkID0geGQuc2xpY2UoKTtcclxuICBrID0geGUgLSBlO1xyXG5cclxuICAvLyBJZiBiYXNlIDFlNyBleHBvbmVudHMgZGlmZmVyLi4uXHJcbiAgaWYgKGspIHtcclxuICAgIHhMVHkgPSBrIDwgMDtcclxuXHJcbiAgICBpZiAoeExUeSkge1xyXG4gICAgICBkID0geGQ7XHJcbiAgICAgIGsgPSAtaztcclxuICAgICAgbGVuID0geWQubGVuZ3RoO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgZCA9IHlkO1xyXG4gICAgICBlID0geGU7XHJcbiAgICAgIGxlbiA9IHhkLmxlbmd0aDtcclxuICAgIH1cclxuXHJcbiAgICAvLyBOdW1iZXJzIHdpdGggbWFzc2l2ZWx5IGRpZmZlcmVudCBleHBvbmVudHMgd291bGQgcmVzdWx0IGluIGEgdmVyeSBoaWdoIG51bWJlciBvZlxyXG4gICAgLy8gemVyb3MgbmVlZGluZyB0byBiZSBwcmVwZW5kZWQsIGJ1dCB0aGlzIGNhbiBiZSBhdm9pZGVkIHdoaWxlIHN0aWxsIGVuc3VyaW5nIGNvcnJlY3RcclxuICAgIC8vIHJvdW5kaW5nIGJ5IGxpbWl0aW5nIHRoZSBudW1iZXIgb2YgemVyb3MgdG8gYE1hdGguY2VpbChwciAvIExPR19CQVNFKSArIDJgLlxyXG4gICAgaSA9IE1hdGgubWF4KE1hdGguY2VpbChwciAvIExPR19CQVNFKSwgbGVuKSArIDI7XHJcblxyXG4gICAgaWYgKGsgPiBpKSB7XHJcbiAgICAgIGsgPSBpO1xyXG4gICAgICBkLmxlbmd0aCA9IDE7XHJcbiAgICB9XHJcblxyXG4gICAgLy8gUHJlcGVuZCB6ZXJvcyB0byBlcXVhbGlzZSBleHBvbmVudHMuXHJcbiAgICBkLnJldmVyc2UoKTtcclxuICAgIGZvciAoaSA9IGs7IGktLTspIGQucHVzaCgwKTtcclxuICAgIGQucmV2ZXJzZSgpO1xyXG5cclxuICAvLyBCYXNlIDFlNyBleHBvbmVudHMgZXF1YWwuXHJcbiAgfSBlbHNlIHtcclxuXHJcbiAgICAvLyBDaGVjayBkaWdpdHMgdG8gZGV0ZXJtaW5lIHdoaWNoIGlzIHRoZSBiaWdnZXIgbnVtYmVyLlxyXG5cclxuICAgIGkgPSB4ZC5sZW5ndGg7XHJcbiAgICBsZW4gPSB5ZC5sZW5ndGg7XHJcbiAgICB4TFR5ID0gaSA8IGxlbjtcclxuICAgIGlmICh4TFR5KSBsZW4gPSBpO1xyXG5cclxuICAgIGZvciAoaSA9IDA7IGkgPCBsZW47IGkrKykge1xyXG4gICAgICBpZiAoeGRbaV0gIT0geWRbaV0pIHtcclxuICAgICAgICB4TFR5ID0geGRbaV0gPCB5ZFtpXTtcclxuICAgICAgICBicmVhaztcclxuICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGsgPSAwO1xyXG4gIH1cclxuXHJcbiAgaWYgKHhMVHkpIHtcclxuICAgIGQgPSB4ZDtcclxuICAgIHhkID0geWQ7XHJcbiAgICB5ZCA9IGQ7XHJcbiAgICB5LnMgPSAteS5zO1xyXG4gIH1cclxuXHJcbiAgbGVuID0geGQubGVuZ3RoO1xyXG5cclxuICAvLyBBcHBlbmQgemVyb3MgdG8gYHhkYCBpZiBzaG9ydGVyLlxyXG4gIC8vIERvbid0IGFkZCB6ZXJvcyB0byBgeWRgIGlmIHNob3J0ZXIgYXMgc3VidHJhY3Rpb24gb25seSBuZWVkcyB0byBzdGFydCBhdCBgeWRgIGxlbmd0aC5cclxuICBmb3IgKGkgPSB5ZC5sZW5ndGggLSBsZW47IGkgPiAwOyAtLWkpIHhkW2xlbisrXSA9IDA7XHJcblxyXG4gIC8vIFN1YnRyYWN0IHlkIGZyb20geGQuXHJcbiAgZm9yIChpID0geWQubGVuZ3RoOyBpID4gazspIHtcclxuXHJcbiAgICBpZiAoeGRbLS1pXSA8IHlkW2ldKSB7XHJcbiAgICAgIGZvciAoaiA9IGk7IGogJiYgeGRbLS1qXSA9PT0gMDspIHhkW2pdID0gQkFTRSAtIDE7XHJcbiAgICAgIC0teGRbal07XHJcbiAgICAgIHhkW2ldICs9IEJBU0U7XHJcbiAgICB9XHJcblxyXG4gICAgeGRbaV0gLT0geWRbaV07XHJcbiAgfVxyXG5cclxuICAvLyBSZW1vdmUgdHJhaWxpbmcgemVyb3MuXHJcbiAgZm9yICg7IHhkWy0tbGVuXSA9PT0gMDspIHhkLnBvcCgpO1xyXG5cclxuICAvLyBSZW1vdmUgbGVhZGluZyB6ZXJvcyBhbmQgYWRqdXN0IGV4cG9uZW50IGFjY29yZGluZ2x5LlxyXG4gIGZvciAoOyB4ZFswXSA9PT0gMDsgeGQuc2hpZnQoKSkgLS1lO1xyXG5cclxuICAvLyBaZXJvP1xyXG4gIGlmICgheGRbMF0pIHJldHVybiBuZXcgQ3RvcihybSA9PT0gMyA/IC0wIDogMCk7XHJcblxyXG4gIHkuZCA9IHhkO1xyXG4gIHkuZSA9IGdldEJhc2UxMEV4cG9uZW50KHhkLCBlKTtcclxuXHJcbiAgcmV0dXJuIGV4dGVybmFsID8gZmluYWxpc2UoeSwgcHIsIHJtKSA6IHk7XHJcbn07XHJcblxyXG5cclxuLypcclxuICogICBuICUgMCA9ICBOXHJcbiAqICAgbiAlIE4gPSAgTlxyXG4gKiAgIG4gJSBJID0gIG5cclxuICogICAwICUgbiA9ICAwXHJcbiAqICAtMCAlIG4gPSAtMFxyXG4gKiAgIDAgJSAwID0gIE5cclxuICogICAwICUgTiA9ICBOXHJcbiAqICAgMCAlIEkgPSAgMFxyXG4gKiAgIE4gJSBuID0gIE5cclxuICogICBOICUgMCA9ICBOXHJcbiAqICAgTiAlIE4gPSAgTlxyXG4gKiAgIE4gJSBJID0gIE5cclxuICogICBJICUgbiA9ICBOXHJcbiAqICAgSSAlIDAgPSAgTlxyXG4gKiAgIEkgJSBOID0gIE5cclxuICogICBJICUgSSA9ICBOXHJcbiAqXHJcbiAqIFJldHVybiBhIG5ldyBEZWNpbWFsIHdob3NlIHZhbHVlIGlzIHRoZSB2YWx1ZSBvZiB0aGlzIERlY2ltYWwgbW9kdWxvIGB5YCwgcm91bmRlZCB0b1xyXG4gKiBgcHJlY2lzaW9uYCBzaWduaWZpY2FudCBkaWdpdHMgdXNpbmcgcm91bmRpbmcgbW9kZSBgcm91bmRpbmdgLlxyXG4gKlxyXG4gKiBUaGUgcmVzdWx0IGRlcGVuZHMgb24gdGhlIG1vZHVsbyBtb2RlLlxyXG4gKlxyXG4gKi9cclxuUC5tb2R1bG8gPSBQLm1vZCA9IGZ1bmN0aW9uICh5KSB7XHJcbiAgdmFyIHEsXHJcbiAgICB4ID0gdGhpcyxcclxuICAgIEN0b3IgPSB4LmNvbnN0cnVjdG9yO1xyXG5cclxuICB5ID0gbmV3IEN0b3IoeSk7XHJcblxyXG4gIC8vIFJldHVybiBOYU4gaWYgeCBpcyBcdTAwQjFJbmZpbml0eSBvciBOYU4sIG9yIHkgaXMgTmFOIG9yIFx1MDBCMTAuXHJcbiAgaWYgKCF4LmQgfHwgIXkucyB8fCB5LmQgJiYgIXkuZFswXSkgcmV0dXJuIG5ldyBDdG9yKE5hTik7XHJcblxyXG4gIC8vIFJldHVybiB4IGlmIHkgaXMgXHUwMEIxSW5maW5pdHkgb3IgeCBpcyBcdTAwQjEwLlxyXG4gIGlmICgheS5kIHx8IHguZCAmJiAheC5kWzBdKSB7XHJcbiAgICByZXR1cm4gZmluYWxpc2UobmV3IEN0b3IoeCksIEN0b3IucHJlY2lzaW9uLCBDdG9yLnJvdW5kaW5nKTtcclxuICB9XHJcblxyXG4gIC8vIFByZXZlbnQgcm91bmRpbmcgb2YgaW50ZXJtZWRpYXRlIGNhbGN1bGF0aW9ucy5cclxuICBleHRlcm5hbCA9IGZhbHNlO1xyXG5cclxuICBpZiAoQ3Rvci5tb2R1bG8gPT0gOSkge1xyXG5cclxuICAgIC8vIEV1Y2xpZGlhbiBkaXZpc2lvbjogcSA9IHNpZ24oeSkgKiBmbG9vcih4IC8gYWJzKHkpKVxyXG4gICAgLy8gcmVzdWx0ID0geCAtIHEgKiB5ICAgIHdoZXJlICAwIDw9IHJlc3VsdCA8IGFicyh5KVxyXG4gICAgcSA9IGRpdmlkZSh4LCB5LmFicygpLCAwLCAzLCAxKTtcclxuICAgIHEucyAqPSB5LnM7XHJcbiAgfSBlbHNlIHtcclxuICAgIHEgPSBkaXZpZGUoeCwgeSwgMCwgQ3Rvci5tb2R1bG8sIDEpO1xyXG4gIH1cclxuXHJcbiAgcSA9IHEudGltZXMoeSk7XHJcblxyXG4gIGV4dGVybmFsID0gdHJ1ZTtcclxuXHJcbiAgcmV0dXJuIHgubWludXMocSk7XHJcbn07XHJcblxyXG5cclxuLypcclxuICogUmV0dXJuIGEgbmV3IERlY2ltYWwgd2hvc2UgdmFsdWUgaXMgdGhlIG5hdHVyYWwgZXhwb25lbnRpYWwgb2YgdGhlIHZhbHVlIG9mIHRoaXMgRGVjaW1hbCxcclxuICogaS5lLiB0aGUgYmFzZSBlIHJhaXNlZCB0byB0aGUgcG93ZXIgdGhlIHZhbHVlIG9mIHRoaXMgRGVjaW1hbCwgcm91bmRlZCB0byBgcHJlY2lzaW9uYFxyXG4gKiBzaWduaWZpY2FudCBkaWdpdHMgdXNpbmcgcm91bmRpbmcgbW9kZSBgcm91bmRpbmdgLlxyXG4gKlxyXG4gKi9cclxuUC5uYXR1cmFsRXhwb25lbnRpYWwgPSBQLmV4cCA9IGZ1bmN0aW9uICgpIHtcclxuICByZXR1cm4gbmF0dXJhbEV4cG9uZW50aWFsKHRoaXMpO1xyXG59O1xyXG5cclxuXHJcbi8qXHJcbiAqIFJldHVybiBhIG5ldyBEZWNpbWFsIHdob3NlIHZhbHVlIGlzIHRoZSBuYXR1cmFsIGxvZ2FyaXRobSBvZiB0aGUgdmFsdWUgb2YgdGhpcyBEZWNpbWFsLFxyXG4gKiByb3VuZGVkIHRvIGBwcmVjaXNpb25gIHNpZ25pZmljYW50IGRpZ2l0cyB1c2luZyByb3VuZGluZyBtb2RlIGByb3VuZGluZ2AuXHJcbiAqXHJcbiAqL1xyXG5QLm5hdHVyYWxMb2dhcml0aG0gPSBQLmxuID0gZnVuY3Rpb24gKCkge1xyXG4gIHJldHVybiBuYXR1cmFsTG9nYXJpdGhtKHRoaXMpO1xyXG59O1xyXG5cclxuXHJcbi8qXHJcbiAqIFJldHVybiBhIG5ldyBEZWNpbWFsIHdob3NlIHZhbHVlIGlzIHRoZSB2YWx1ZSBvZiB0aGlzIERlY2ltYWwgbmVnYXRlZCwgaS5lLiBhcyBpZiBtdWx0aXBsaWVkIGJ5XHJcbiAqIC0xLlxyXG4gKlxyXG4gKi9cclxuUC5uZWdhdGVkID0gUC5uZWcgPSBmdW5jdGlvbiAoKSB7XHJcbiAgdmFyIHggPSBuZXcgdGhpcy5jb25zdHJ1Y3Rvcih0aGlzKTtcclxuICB4LnMgPSAteC5zO1xyXG4gIHJldHVybiBmaW5hbGlzZSh4KTtcclxufTtcclxuXHJcblxyXG4vKlxyXG4gKiAgbiArIDAgPSBuXHJcbiAqICBuICsgTiA9IE5cclxuICogIG4gKyBJID0gSVxyXG4gKiAgMCArIG4gPSBuXHJcbiAqICAwICsgMCA9IDBcclxuICogIDAgKyBOID0gTlxyXG4gKiAgMCArIEkgPSBJXHJcbiAqICBOICsgbiA9IE5cclxuICogIE4gKyAwID0gTlxyXG4gKiAgTiArIE4gPSBOXHJcbiAqICBOICsgSSA9IE5cclxuICogIEkgKyBuID0gSVxyXG4gKiAgSSArIDAgPSBJXHJcbiAqICBJICsgTiA9IE5cclxuICogIEkgKyBJID0gSVxyXG4gKlxyXG4gKiBSZXR1cm4gYSBuZXcgRGVjaW1hbCB3aG9zZSB2YWx1ZSBpcyB0aGUgdmFsdWUgb2YgdGhpcyBEZWNpbWFsIHBsdXMgYHlgLCByb3VuZGVkIHRvIGBwcmVjaXNpb25gXHJcbiAqIHNpZ25pZmljYW50IGRpZ2l0cyB1c2luZyByb3VuZGluZyBtb2RlIGByb3VuZGluZ2AuXHJcbiAqXHJcbiAqL1xyXG5QLnBsdXMgPSBQLmFkZCA9IGZ1bmN0aW9uICh5KSB7XHJcbiAgdmFyIGNhcnJ5LCBkLCBlLCBpLCBrLCBsZW4sIHByLCBybSwgeGQsIHlkLFxyXG4gICAgeCA9IHRoaXMsXHJcbiAgICBDdG9yID0geC5jb25zdHJ1Y3RvcjtcclxuXHJcbiAgeSA9IG5ldyBDdG9yKHkpO1xyXG5cclxuICAvLyBJZiBlaXRoZXIgaXMgbm90IGZpbml0ZS4uLlxyXG4gIGlmICgheC5kIHx8ICF5LmQpIHtcclxuXHJcbiAgICAvLyBSZXR1cm4gTmFOIGlmIGVpdGhlciBpcyBOYU4uXHJcbiAgICBpZiAoIXgucyB8fCAheS5zKSB5ID0gbmV3IEN0b3IoTmFOKTtcclxuXHJcbiAgICAvLyBSZXR1cm4geCBpZiB5IGlzIGZpbml0ZSBhbmQgeCBpcyBcdTAwQjFJbmZpbml0eS5cclxuICAgIC8vIFJldHVybiB4IGlmIGJvdGggYXJlIFx1MDBCMUluZmluaXR5IHdpdGggdGhlIHNhbWUgc2lnbi5cclxuICAgIC8vIFJldHVybiBOYU4gaWYgYm90aCBhcmUgXHUwMEIxSW5maW5pdHkgd2l0aCBkaWZmZXJlbnQgc2lnbnMuXHJcbiAgICAvLyBSZXR1cm4geSBpZiB4IGlzIGZpbml0ZSBhbmQgeSBpcyBcdTAwQjFJbmZpbml0eS5cclxuICAgIGVsc2UgaWYgKCF4LmQpIHkgPSBuZXcgQ3Rvcih5LmQgfHwgeC5zID09PSB5LnMgPyB4IDogTmFOKTtcclxuXHJcbiAgICByZXR1cm4geTtcclxuICB9XHJcblxyXG4gICAvLyBJZiBzaWducyBkaWZmZXIuLi5cclxuICBpZiAoeC5zICE9IHkucykge1xyXG4gICAgeS5zID0gLXkucztcclxuICAgIHJldHVybiB4Lm1pbnVzKHkpO1xyXG4gIH1cclxuXHJcbiAgeGQgPSB4LmQ7XHJcbiAgeWQgPSB5LmQ7XHJcbiAgcHIgPSBDdG9yLnByZWNpc2lvbjtcclxuICBybSA9IEN0b3Iucm91bmRpbmc7XHJcblxyXG4gIC8vIElmIGVpdGhlciBpcyB6ZXJvLi4uXHJcbiAgaWYgKCF4ZFswXSB8fCAheWRbMF0pIHtcclxuXHJcbiAgICAvLyBSZXR1cm4geCBpZiB5IGlzIHplcm8uXHJcbiAgICAvLyBSZXR1cm4geSBpZiB5IGlzIG5vbi16ZXJvLlxyXG4gICAgaWYgKCF5ZFswXSkgeSA9IG5ldyBDdG9yKHgpO1xyXG5cclxuICAgIHJldHVybiBleHRlcm5hbCA/IGZpbmFsaXNlKHksIHByLCBybSkgOiB5O1xyXG4gIH1cclxuXHJcbiAgLy8geCBhbmQgeSBhcmUgZmluaXRlLCBub24temVybyBudW1iZXJzIHdpdGggdGhlIHNhbWUgc2lnbi5cclxuXHJcbiAgLy8gQ2FsY3VsYXRlIGJhc2UgMWU3IGV4cG9uZW50cy5cclxuICBrID0gbWF0aGZsb29yKHguZSAvIExPR19CQVNFKTtcclxuICBlID0gbWF0aGZsb29yKHkuZSAvIExPR19CQVNFKTtcclxuXHJcbiAgeGQgPSB4ZC5zbGljZSgpO1xyXG4gIGkgPSBrIC0gZTtcclxuXHJcbiAgLy8gSWYgYmFzZSAxZTcgZXhwb25lbnRzIGRpZmZlci4uLlxyXG4gIGlmIChpKSB7XHJcblxyXG4gICAgaWYgKGkgPCAwKSB7XHJcbiAgICAgIGQgPSB4ZDtcclxuICAgICAgaSA9IC1pO1xyXG4gICAgICBsZW4gPSB5ZC5sZW5ndGg7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICBkID0geWQ7XHJcbiAgICAgIGUgPSBrO1xyXG4gICAgICBsZW4gPSB4ZC5sZW5ndGg7XHJcbiAgICB9XHJcblxyXG4gICAgLy8gTGltaXQgbnVtYmVyIG9mIHplcm9zIHByZXBlbmRlZCB0byBtYXgoY2VpbChwciAvIExPR19CQVNFKSwgbGVuKSArIDEuXHJcbiAgICBrID0gTWF0aC5jZWlsKHByIC8gTE9HX0JBU0UpO1xyXG4gICAgbGVuID0gayA+IGxlbiA/IGsgKyAxIDogbGVuICsgMTtcclxuXHJcbiAgICBpZiAoaSA+IGxlbikge1xyXG4gICAgICBpID0gbGVuO1xyXG4gICAgICBkLmxlbmd0aCA9IDE7XHJcbiAgICB9XHJcblxyXG4gICAgLy8gUHJlcGVuZCB6ZXJvcyB0byBlcXVhbGlzZSBleHBvbmVudHMuIE5vdGU6IEZhc3RlciB0byB1c2UgcmV2ZXJzZSB0aGVuIGRvIHVuc2hpZnRzLlxyXG4gICAgZC5yZXZlcnNlKCk7XHJcbiAgICBmb3IgKDsgaS0tOykgZC5wdXNoKDApO1xyXG4gICAgZC5yZXZlcnNlKCk7XHJcbiAgfVxyXG5cclxuICBsZW4gPSB4ZC5sZW5ndGg7XHJcbiAgaSA9IHlkLmxlbmd0aDtcclxuXHJcbiAgLy8gSWYgeWQgaXMgbG9uZ2VyIHRoYW4geGQsIHN3YXAgeGQgYW5kIHlkIHNvIHhkIHBvaW50cyB0byB0aGUgbG9uZ2VyIGFycmF5LlxyXG4gIGlmIChsZW4gLSBpIDwgMCkge1xyXG4gICAgaSA9IGxlbjtcclxuICAgIGQgPSB5ZDtcclxuICAgIHlkID0geGQ7XHJcbiAgICB4ZCA9IGQ7XHJcbiAgfVxyXG5cclxuICAvLyBPbmx5IHN0YXJ0IGFkZGluZyBhdCB5ZC5sZW5ndGggLSAxIGFzIHRoZSBmdXJ0aGVyIGRpZ2l0cyBvZiB4ZCBjYW4gYmUgbGVmdCBhcyB0aGV5IGFyZS5cclxuICBmb3IgKGNhcnJ5ID0gMDsgaTspIHtcclxuICAgIGNhcnJ5ID0gKHhkWy0taV0gPSB4ZFtpXSArIHlkW2ldICsgY2FycnkpIC8gQkFTRSB8IDA7XHJcbiAgICB4ZFtpXSAlPSBCQVNFO1xyXG4gIH1cclxuXHJcbiAgaWYgKGNhcnJ5KSB7XHJcbiAgICB4ZC51bnNoaWZ0KGNhcnJ5KTtcclxuICAgICsrZTtcclxuICB9XHJcblxyXG4gIC8vIFJlbW92ZSB0cmFpbGluZyB6ZXJvcy5cclxuICAvLyBObyBuZWVkIHRvIGNoZWNrIGZvciB6ZXJvLCBhcyAreCArICt5ICE9IDAgJiYgLXggKyAteSAhPSAwXHJcbiAgZm9yIChsZW4gPSB4ZC5sZW5ndGg7IHhkWy0tbGVuXSA9PSAwOykgeGQucG9wKCk7XHJcblxyXG4gIHkuZCA9IHhkO1xyXG4gIHkuZSA9IGdldEJhc2UxMEV4cG9uZW50KHhkLCBlKTtcclxuXHJcbiAgcmV0dXJuIGV4dGVybmFsID8gZmluYWxpc2UoeSwgcHIsIHJtKSA6IHk7XHJcbn07XHJcblxyXG5cclxuLypcclxuICogUmV0dXJuIHRoZSBudW1iZXIgb2Ygc2lnbmlmaWNhbnQgZGlnaXRzIG9mIHRoZSB2YWx1ZSBvZiB0aGlzIERlY2ltYWwuXHJcbiAqXHJcbiAqIFt6XSB7Ym9vbGVhbnxudW1iZXJ9IFdoZXRoZXIgdG8gY291bnQgaW50ZWdlci1wYXJ0IHRyYWlsaW5nIHplcm9zOiB0cnVlLCBmYWxzZSwgMSBvciAwLlxyXG4gKlxyXG4gKi9cclxuUC5wcmVjaXNpb24gPSBQLnNkID0gZnVuY3Rpb24gKHopIHtcclxuICB2YXIgayxcclxuICAgIHggPSB0aGlzO1xyXG5cclxuICBpZiAoeiAhPT0gdm9pZCAwICYmIHogIT09ICEheiAmJiB6ICE9PSAxICYmIHogIT09IDApIHRocm93IEVycm9yKGludmFsaWRBcmd1bWVudCArIHopO1xyXG5cclxuICBpZiAoeC5kKSB7XHJcbiAgICBrID0gZ2V0UHJlY2lzaW9uKHguZCk7XHJcbiAgICBpZiAoeiAmJiB4LmUgKyAxID4gaykgayA9IHguZSArIDE7XHJcbiAgfSBlbHNlIHtcclxuICAgIGsgPSBOYU47XHJcbiAgfVxyXG5cclxuICByZXR1cm4gaztcclxufTtcclxuXHJcblxyXG4vKlxyXG4gKiBSZXR1cm4gYSBuZXcgRGVjaW1hbCB3aG9zZSB2YWx1ZSBpcyB0aGUgdmFsdWUgb2YgdGhpcyBEZWNpbWFsIHJvdW5kZWQgdG8gYSB3aG9sZSBudW1iZXIgdXNpbmdcclxuICogcm91bmRpbmcgbW9kZSBgcm91bmRpbmdgLlxyXG4gKlxyXG4gKi9cclxuUC5yb3VuZCA9IGZ1bmN0aW9uICgpIHtcclxuICB2YXIgeCA9IHRoaXMsXHJcbiAgICBDdG9yID0geC5jb25zdHJ1Y3RvcjtcclxuXHJcbiAgcmV0dXJuIGZpbmFsaXNlKG5ldyBDdG9yKHgpLCB4LmUgKyAxLCBDdG9yLnJvdW5kaW5nKTtcclxufTtcclxuXHJcblxyXG4vKlxyXG4gKiBSZXR1cm4gYSBuZXcgRGVjaW1hbCB3aG9zZSB2YWx1ZSBpcyB0aGUgc2luZSBvZiB0aGUgdmFsdWUgaW4gcmFkaWFucyBvZiB0aGlzIERlY2ltYWwuXHJcbiAqXHJcbiAqIERvbWFpbjogWy1JbmZpbml0eSwgSW5maW5pdHldXHJcbiAqIFJhbmdlOiBbLTEsIDFdXHJcbiAqXHJcbiAqIHNpbih4KSA9IHggLSB4XjMvMyEgKyB4XjUvNSEgLSAuLi5cclxuICpcclxuICogc2luKDApICAgICAgICAgPSAwXHJcbiAqIHNpbigtMCkgICAgICAgID0gLTBcclxuICogc2luKEluZmluaXR5KSAgPSBOYU5cclxuICogc2luKC1JbmZpbml0eSkgPSBOYU5cclxuICogc2luKE5hTikgICAgICAgPSBOYU5cclxuICpcclxuICovXHJcblAuc2luZSA9IFAuc2luID0gZnVuY3Rpb24gKCkge1xyXG4gIHZhciBwciwgcm0sXHJcbiAgICB4ID0gdGhpcyxcclxuICAgIEN0b3IgPSB4LmNvbnN0cnVjdG9yO1xyXG5cclxuICBpZiAoIXguaXNGaW5pdGUoKSkgcmV0dXJuIG5ldyBDdG9yKE5hTik7XHJcbiAgaWYgKHguaXNaZXJvKCkpIHJldHVybiBuZXcgQ3Rvcih4KTtcclxuXHJcbiAgcHIgPSBDdG9yLnByZWNpc2lvbjtcclxuICBybSA9IEN0b3Iucm91bmRpbmc7XHJcbiAgQ3Rvci5wcmVjaXNpb24gPSBwciArIE1hdGgubWF4KHguZSwgeC5zZCgpKSArIExPR19CQVNFO1xyXG4gIEN0b3Iucm91bmRpbmcgPSAxO1xyXG5cclxuICB4ID0gc2luZShDdG9yLCB0b0xlc3NUaGFuSGFsZlBpKEN0b3IsIHgpKTtcclxuXHJcbiAgQ3Rvci5wcmVjaXNpb24gPSBwcjtcclxuICBDdG9yLnJvdW5kaW5nID0gcm07XHJcblxyXG4gIHJldHVybiBmaW5hbGlzZShxdWFkcmFudCA+IDIgPyB4Lm5lZygpIDogeCwgcHIsIHJtLCB0cnVlKTtcclxufTtcclxuXHJcblxyXG4vKlxyXG4gKiBSZXR1cm4gYSBuZXcgRGVjaW1hbCB3aG9zZSB2YWx1ZSBpcyB0aGUgc3F1YXJlIHJvb3Qgb2YgdGhpcyBEZWNpbWFsLCByb3VuZGVkIHRvIGBwcmVjaXNpb25gXHJcbiAqIHNpZ25pZmljYW50IGRpZ2l0cyB1c2luZyByb3VuZGluZyBtb2RlIGByb3VuZGluZ2AuXHJcbiAqXHJcbiAqICBzcXJ0KC1uKSA9ICBOXHJcbiAqICBzcXJ0KE4pICA9ICBOXHJcbiAqICBzcXJ0KC1JKSA9ICBOXHJcbiAqICBzcXJ0KEkpICA9ICBJXHJcbiAqICBzcXJ0KDApICA9ICAwXHJcbiAqICBzcXJ0KC0wKSA9IC0wXHJcbiAqXHJcbiAqL1xyXG5QLnNxdWFyZVJvb3QgPSBQLnNxcnQgPSBmdW5jdGlvbiAoKSB7XHJcbiAgdmFyIG0sIG4sIHNkLCByLCByZXAsIHQsXHJcbiAgICB4ID0gdGhpcyxcclxuICAgIGQgPSB4LmQsXHJcbiAgICBlID0geC5lLFxyXG4gICAgcyA9IHgucyxcclxuICAgIEN0b3IgPSB4LmNvbnN0cnVjdG9yO1xyXG5cclxuICAvLyBOZWdhdGl2ZS9OYU4vSW5maW5pdHkvemVybz9cclxuICBpZiAocyAhPT0gMSB8fCAhZCB8fCAhZFswXSkge1xyXG4gICAgcmV0dXJuIG5ldyBDdG9yKCFzIHx8IHMgPCAwICYmICghZCB8fCBkWzBdKSA/IE5hTiA6IGQgPyB4IDogMSAvIDApO1xyXG4gIH1cclxuXHJcbiAgZXh0ZXJuYWwgPSBmYWxzZTtcclxuXHJcbiAgLy8gSW5pdGlhbCBlc3RpbWF0ZS5cclxuICBzID0gTWF0aC5zcXJ0KCt4KTtcclxuXHJcbiAgLy8gTWF0aC5zcXJ0IHVuZGVyZmxvdy9vdmVyZmxvdz9cclxuICAvLyBQYXNzIHggdG8gTWF0aC5zcXJ0IGFzIGludGVnZXIsIHRoZW4gYWRqdXN0IHRoZSBleHBvbmVudCBvZiB0aGUgcmVzdWx0LlxyXG4gIGlmIChzID09IDAgfHwgcyA9PSAxIC8gMCkge1xyXG4gICAgbiA9IGRpZ2l0c1RvU3RyaW5nKGQpO1xyXG5cclxuICAgIGlmICgobi5sZW5ndGggKyBlKSAlIDIgPT0gMCkgbiArPSAnMCc7XHJcbiAgICBzID0gTWF0aC5zcXJ0KG4pO1xyXG4gICAgZSA9IG1hdGhmbG9vcigoZSArIDEpIC8gMikgLSAoZSA8IDAgfHwgZSAlIDIpO1xyXG5cclxuICAgIGlmIChzID09IDEgLyAwKSB7XHJcbiAgICAgIG4gPSAnNWUnICsgZTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIG4gPSBzLnRvRXhwb25lbnRpYWwoKTtcclxuICAgICAgbiA9IG4uc2xpY2UoMCwgbi5pbmRleE9mKCdlJykgKyAxKSArIGU7XHJcbiAgICB9XHJcblxyXG4gICAgciA9IG5ldyBDdG9yKG4pO1xyXG4gIH0gZWxzZSB7XHJcbiAgICByID0gbmV3IEN0b3Iocy50b1N0cmluZygpKTtcclxuICB9XHJcblxyXG4gIHNkID0gKGUgPSBDdG9yLnByZWNpc2lvbikgKyAzO1xyXG5cclxuICAvLyBOZXd0b24tUmFwaHNvbiBpdGVyYXRpb24uXHJcbiAgZm9yICg7Oykge1xyXG4gICAgdCA9IHI7XHJcbiAgICByID0gdC5wbHVzKGRpdmlkZSh4LCB0LCBzZCArIDIsIDEpKS50aW1lcygwLjUpO1xyXG5cclxuICAgIC8vIFRPRE8/IFJlcGxhY2Ugd2l0aCBmb3ItbG9vcCBhbmQgY2hlY2tSb3VuZGluZ0RpZ2l0cy5cclxuICAgIGlmIChkaWdpdHNUb1N0cmluZyh0LmQpLnNsaWNlKDAsIHNkKSA9PT0gKG4gPSBkaWdpdHNUb1N0cmluZyhyLmQpKS5zbGljZSgwLCBzZCkpIHtcclxuICAgICAgbiA9IG4uc2xpY2Uoc2QgLSAzLCBzZCArIDEpO1xyXG5cclxuICAgICAgLy8gVGhlIDR0aCByb3VuZGluZyBkaWdpdCBtYXkgYmUgaW4gZXJyb3IgYnkgLTEgc28gaWYgdGhlIDQgcm91bmRpbmcgZGlnaXRzIGFyZSA5OTk5IG9yXHJcbiAgICAgIC8vIDQ5OTksIGkuZS4gYXBwcm9hY2hpbmcgYSByb3VuZGluZyBib3VuZGFyeSwgY29udGludWUgdGhlIGl0ZXJhdGlvbi5cclxuICAgICAgaWYgKG4gPT0gJzk5OTknIHx8ICFyZXAgJiYgbiA9PSAnNDk5OScpIHtcclxuXHJcbiAgICAgICAgLy8gT24gdGhlIGZpcnN0IGl0ZXJhdGlvbiBvbmx5LCBjaGVjayB0byBzZWUgaWYgcm91bmRpbmcgdXAgZ2l2ZXMgdGhlIGV4YWN0IHJlc3VsdCBhcyB0aGVcclxuICAgICAgICAvLyBuaW5lcyBtYXkgaW5maW5pdGVseSByZXBlYXQuXHJcbiAgICAgICAgaWYgKCFyZXApIHtcclxuICAgICAgICAgIGZpbmFsaXNlKHQsIGUgKyAxLCAwKTtcclxuXHJcbiAgICAgICAgICBpZiAodC50aW1lcyh0KS5lcSh4KSkge1xyXG4gICAgICAgICAgICByID0gdDtcclxuICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBzZCArPSA0O1xyXG4gICAgICAgIHJlcCA9IDE7XHJcbiAgICAgIH0gZWxzZSB7XHJcblxyXG4gICAgICAgIC8vIElmIHRoZSByb3VuZGluZyBkaWdpdHMgYXJlIG51bGwsIDB7MCw0fSBvciA1MHswLDN9LCBjaGVjayBmb3IgYW4gZXhhY3QgcmVzdWx0LlxyXG4gICAgICAgIC8vIElmIG5vdCwgdGhlbiB0aGVyZSBhcmUgZnVydGhlciBkaWdpdHMgYW5kIG0gd2lsbCBiZSB0cnV0aHkuXHJcbiAgICAgICAgaWYgKCErbiB8fCAhK24uc2xpY2UoMSkgJiYgbi5jaGFyQXQoMCkgPT0gJzUnKSB7XHJcblxyXG4gICAgICAgICAgLy8gVHJ1bmNhdGUgdG8gdGhlIGZpcnN0IHJvdW5kaW5nIGRpZ2l0LlxyXG4gICAgICAgICAgZmluYWxpc2UociwgZSArIDEsIDEpO1xyXG4gICAgICAgICAgbSA9ICFyLnRpbWVzKHIpLmVxKHgpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgYnJlYWs7XHJcbiAgICAgIH1cclxuICAgIH1cclxuICB9XHJcblxyXG4gIGV4dGVybmFsID0gdHJ1ZTtcclxuXHJcbiAgcmV0dXJuIGZpbmFsaXNlKHIsIGUsIEN0b3Iucm91bmRpbmcsIG0pO1xyXG59O1xyXG5cclxuXHJcbi8qXHJcbiAqIFJldHVybiBhIG5ldyBEZWNpbWFsIHdob3NlIHZhbHVlIGlzIHRoZSB0YW5nZW50IG9mIHRoZSB2YWx1ZSBpbiByYWRpYW5zIG9mIHRoaXMgRGVjaW1hbC5cclxuICpcclxuICogRG9tYWluOiBbLUluZmluaXR5LCBJbmZpbml0eV1cclxuICogUmFuZ2U6IFstSW5maW5pdHksIEluZmluaXR5XVxyXG4gKlxyXG4gKiB0YW4oMCkgICAgICAgICA9IDBcclxuICogdGFuKC0wKSAgICAgICAgPSAtMFxyXG4gKiB0YW4oSW5maW5pdHkpICA9IE5hTlxyXG4gKiB0YW4oLUluZmluaXR5KSA9IE5hTlxyXG4gKiB0YW4oTmFOKSAgICAgICA9IE5hTlxyXG4gKlxyXG4gKi9cclxuUC50YW5nZW50ID0gUC50YW4gPSBmdW5jdGlvbiAoKSB7XHJcbiAgdmFyIHByLCBybSxcclxuICAgIHggPSB0aGlzLFxyXG4gICAgQ3RvciA9IHguY29uc3RydWN0b3I7XHJcblxyXG4gIGlmICgheC5pc0Zpbml0ZSgpKSByZXR1cm4gbmV3IEN0b3IoTmFOKTtcclxuICBpZiAoeC5pc1plcm8oKSkgcmV0dXJuIG5ldyBDdG9yKHgpO1xyXG5cclxuICBwciA9IEN0b3IucHJlY2lzaW9uO1xyXG4gIHJtID0gQ3Rvci5yb3VuZGluZztcclxuICBDdG9yLnByZWNpc2lvbiA9IHByICsgMTA7XHJcbiAgQ3Rvci5yb3VuZGluZyA9IDE7XHJcblxyXG4gIHggPSB4LnNpbigpO1xyXG4gIHgucyA9IDE7XHJcbiAgeCA9IGRpdmlkZSh4LCBuZXcgQ3RvcigxKS5taW51cyh4LnRpbWVzKHgpKS5zcXJ0KCksIHByICsgMTAsIDApO1xyXG5cclxuICBDdG9yLnByZWNpc2lvbiA9IHByO1xyXG4gIEN0b3Iucm91bmRpbmcgPSBybTtcclxuXHJcbiAgcmV0dXJuIGZpbmFsaXNlKHF1YWRyYW50ID09IDIgfHwgcXVhZHJhbnQgPT0gNCA/IHgubmVnKCkgOiB4LCBwciwgcm0sIHRydWUpO1xyXG59O1xyXG5cclxuXHJcbi8qXHJcbiAqICBuICogMCA9IDBcclxuICogIG4gKiBOID0gTlxyXG4gKiAgbiAqIEkgPSBJXHJcbiAqICAwICogbiA9IDBcclxuICogIDAgKiAwID0gMFxyXG4gKiAgMCAqIE4gPSBOXHJcbiAqICAwICogSSA9IE5cclxuICogIE4gKiBuID0gTlxyXG4gKiAgTiAqIDAgPSBOXHJcbiAqICBOICogTiA9IE5cclxuICogIE4gKiBJID0gTlxyXG4gKiAgSSAqIG4gPSBJXHJcbiAqICBJICogMCA9IE5cclxuICogIEkgKiBOID0gTlxyXG4gKiAgSSAqIEkgPSBJXHJcbiAqXHJcbiAqIFJldHVybiBhIG5ldyBEZWNpbWFsIHdob3NlIHZhbHVlIGlzIHRoaXMgRGVjaW1hbCB0aW1lcyBgeWAsIHJvdW5kZWQgdG8gYHByZWNpc2lvbmAgc2lnbmlmaWNhbnRcclxuICogZGlnaXRzIHVzaW5nIHJvdW5kaW5nIG1vZGUgYHJvdW5kaW5nYC5cclxuICpcclxuICovXHJcblAudGltZXMgPSBQLm11bCA9IGZ1bmN0aW9uICh5KSB7XHJcbiAgdmFyIGNhcnJ5LCBlLCBpLCBrLCByLCByTCwgdCwgeGRMLCB5ZEwsXHJcbiAgICB4ID0gdGhpcyxcclxuICAgIEN0b3IgPSB4LmNvbnN0cnVjdG9yLFxyXG4gICAgeGQgPSB4LmQsXHJcbiAgICB5ZCA9ICh5ID0gbmV3IEN0b3IoeSkpLmQ7XHJcblxyXG4gIHkucyAqPSB4LnM7XHJcblxyXG4gICAvLyBJZiBlaXRoZXIgaXMgTmFOLCBcdTAwQjFJbmZpbml0eSBvciBcdTAwQjEwLi4uXHJcbiAgaWYgKCF4ZCB8fCAheGRbMF0gfHwgIXlkIHx8ICF5ZFswXSkge1xyXG5cclxuICAgIHJldHVybiBuZXcgQ3RvcigheS5zIHx8IHhkICYmICF4ZFswXSAmJiAheWQgfHwgeWQgJiYgIXlkWzBdICYmICF4ZFxyXG5cclxuICAgICAgLy8gUmV0dXJuIE5hTiBpZiBlaXRoZXIgaXMgTmFOLlxyXG4gICAgICAvLyBSZXR1cm4gTmFOIGlmIHggaXMgXHUwMEIxMCBhbmQgeSBpcyBcdTAwQjFJbmZpbml0eSwgb3IgeSBpcyBcdTAwQjEwIGFuZCB4IGlzIFx1MDBCMUluZmluaXR5LlxyXG4gICAgICA/IE5hTlxyXG5cclxuICAgICAgLy8gUmV0dXJuIFx1MDBCMUluZmluaXR5IGlmIGVpdGhlciBpcyBcdTAwQjFJbmZpbml0eS5cclxuICAgICAgLy8gUmV0dXJuIFx1MDBCMTAgaWYgZWl0aGVyIGlzIFx1MDBCMTAuXHJcbiAgICAgIDogIXhkIHx8ICF5ZCA/IHkucyAvIDAgOiB5LnMgKiAwKTtcclxuICB9XHJcblxyXG4gIGUgPSBtYXRoZmxvb3IoeC5lIC8gTE9HX0JBU0UpICsgbWF0aGZsb29yKHkuZSAvIExPR19CQVNFKTtcclxuICB4ZEwgPSB4ZC5sZW5ndGg7XHJcbiAgeWRMID0geWQubGVuZ3RoO1xyXG5cclxuICAvLyBFbnN1cmUgeGQgcG9pbnRzIHRvIHRoZSBsb25nZXIgYXJyYXkuXHJcbiAgaWYgKHhkTCA8IHlkTCkge1xyXG4gICAgciA9IHhkO1xyXG4gICAgeGQgPSB5ZDtcclxuICAgIHlkID0gcjtcclxuICAgIHJMID0geGRMO1xyXG4gICAgeGRMID0geWRMO1xyXG4gICAgeWRMID0gckw7XHJcbiAgfVxyXG5cclxuICAvLyBJbml0aWFsaXNlIHRoZSByZXN1bHQgYXJyYXkgd2l0aCB6ZXJvcy5cclxuICByID0gW107XHJcbiAgckwgPSB4ZEwgKyB5ZEw7XHJcbiAgZm9yIChpID0gckw7IGktLTspIHIucHVzaCgwKTtcclxuXHJcbiAgLy8gTXVsdGlwbHkhXHJcbiAgZm9yIChpID0geWRMOyAtLWkgPj0gMDspIHtcclxuICAgIGNhcnJ5ID0gMDtcclxuICAgIGZvciAoayA9IHhkTCArIGk7IGsgPiBpOykge1xyXG4gICAgICB0ID0gcltrXSArIHlkW2ldICogeGRbayAtIGkgLSAxXSArIGNhcnJ5O1xyXG4gICAgICByW2stLV0gPSB0ICUgQkFTRSB8IDA7XHJcbiAgICAgIGNhcnJ5ID0gdCAvIEJBU0UgfCAwO1xyXG4gICAgfVxyXG5cclxuICAgIHJba10gPSAocltrXSArIGNhcnJ5KSAlIEJBU0UgfCAwO1xyXG4gIH1cclxuXHJcbiAgLy8gUmVtb3ZlIHRyYWlsaW5nIHplcm9zLlxyXG4gIGZvciAoOyAhclstLXJMXTspIHIucG9wKCk7XHJcblxyXG4gIGlmIChjYXJyeSkgKytlO1xyXG4gIGVsc2Ugci5zaGlmdCgpO1xyXG5cclxuICB5LmQgPSByO1xyXG4gIHkuZSA9IGdldEJhc2UxMEV4cG9uZW50KHIsIGUpO1xyXG5cclxuICByZXR1cm4gZXh0ZXJuYWwgPyBmaW5hbGlzZSh5LCBDdG9yLnByZWNpc2lvbiwgQ3Rvci5yb3VuZGluZykgOiB5O1xyXG59O1xyXG5cclxuXHJcbi8qXHJcbiAqIFJldHVybiBhIHN0cmluZyByZXByZXNlbnRpbmcgdGhlIHZhbHVlIG9mIHRoaXMgRGVjaW1hbCBpbiBiYXNlIDIsIHJvdW5kIHRvIGBzZGAgc2lnbmlmaWNhbnRcclxuICogZGlnaXRzIHVzaW5nIHJvdW5kaW5nIG1vZGUgYHJtYC5cclxuICpcclxuICogSWYgdGhlIG9wdGlvbmFsIGBzZGAgYXJndW1lbnQgaXMgcHJlc2VudCB0aGVuIHJldHVybiBiaW5hcnkgZXhwb25lbnRpYWwgbm90YXRpb24uXHJcbiAqXHJcbiAqIFtzZF0ge251bWJlcn0gU2lnbmlmaWNhbnQgZGlnaXRzLiBJbnRlZ2VyLCAxIHRvIE1BWF9ESUdJVFMgaW5jbHVzaXZlLlxyXG4gKiBbcm1dIHtudW1iZXJ9IFJvdW5kaW5nIG1vZGUuIEludGVnZXIsIDAgdG8gOCBpbmNsdXNpdmUuXHJcbiAqXHJcbiAqL1xyXG5QLnRvQmluYXJ5ID0gZnVuY3Rpb24gKHNkLCBybSkge1xyXG4gIHJldHVybiB0b1N0cmluZ0JpbmFyeSh0aGlzLCAyLCBzZCwgcm0pO1xyXG59O1xyXG5cclxuXHJcbi8qXHJcbiAqIFJldHVybiBhIG5ldyBEZWNpbWFsIHdob3NlIHZhbHVlIGlzIHRoZSB2YWx1ZSBvZiB0aGlzIERlY2ltYWwgcm91bmRlZCB0byBhIG1heGltdW0gb2YgYGRwYFxyXG4gKiBkZWNpbWFsIHBsYWNlcyB1c2luZyByb3VuZGluZyBtb2RlIGBybWAgb3IgYHJvdW5kaW5nYCBpZiBgcm1gIGlzIG9taXR0ZWQuXHJcbiAqXHJcbiAqIElmIGBkcGAgaXMgb21pdHRlZCwgcmV0dXJuIGEgbmV3IERlY2ltYWwgd2hvc2UgdmFsdWUgaXMgdGhlIHZhbHVlIG9mIHRoaXMgRGVjaW1hbC5cclxuICpcclxuICogW2RwXSB7bnVtYmVyfSBEZWNpbWFsIHBsYWNlcy4gSW50ZWdlciwgMCB0byBNQVhfRElHSVRTIGluY2x1c2l2ZS5cclxuICogW3JtXSB7bnVtYmVyfSBSb3VuZGluZyBtb2RlLiBJbnRlZ2VyLCAwIHRvIDggaW5jbHVzaXZlLlxyXG4gKlxyXG4gKi9cclxuUC50b0RlY2ltYWxQbGFjZXMgPSBQLnRvRFAgPSBmdW5jdGlvbiAoZHAsIHJtKSB7XHJcbiAgdmFyIHggPSB0aGlzLFxyXG4gICAgQ3RvciA9IHguY29uc3RydWN0b3I7XHJcblxyXG4gIHggPSBuZXcgQ3Rvcih4KTtcclxuICBpZiAoZHAgPT09IHZvaWQgMCkgcmV0dXJuIHg7XHJcblxyXG4gIGNoZWNrSW50MzIoZHAsIDAsIE1BWF9ESUdJVFMpO1xyXG5cclxuICBpZiAocm0gPT09IHZvaWQgMCkgcm0gPSBDdG9yLnJvdW5kaW5nO1xyXG4gIGVsc2UgY2hlY2tJbnQzMihybSwgMCwgOCk7XHJcblxyXG4gIHJldHVybiBmaW5hbGlzZSh4LCBkcCArIHguZSArIDEsIHJtKTtcclxufTtcclxuXHJcblxyXG4vKlxyXG4gKiBSZXR1cm4gYSBzdHJpbmcgcmVwcmVzZW50aW5nIHRoZSB2YWx1ZSBvZiB0aGlzIERlY2ltYWwgaW4gZXhwb25lbnRpYWwgbm90YXRpb24gcm91bmRlZCB0b1xyXG4gKiBgZHBgIGZpeGVkIGRlY2ltYWwgcGxhY2VzIHVzaW5nIHJvdW5kaW5nIG1vZGUgYHJvdW5kaW5nYC5cclxuICpcclxuICogW2RwXSB7bnVtYmVyfSBEZWNpbWFsIHBsYWNlcy4gSW50ZWdlciwgMCB0byBNQVhfRElHSVRTIGluY2x1c2l2ZS5cclxuICogW3JtXSB7bnVtYmVyfSBSb3VuZGluZyBtb2RlLiBJbnRlZ2VyLCAwIHRvIDggaW5jbHVzaXZlLlxyXG4gKlxyXG4gKi9cclxuUC50b0V4cG9uZW50aWFsID0gZnVuY3Rpb24gKGRwLCBybSkge1xyXG4gIHZhciBzdHIsXHJcbiAgICB4ID0gdGhpcyxcclxuICAgIEN0b3IgPSB4LmNvbnN0cnVjdG9yO1xyXG5cclxuICBpZiAoZHAgPT09IHZvaWQgMCkge1xyXG4gICAgc3RyID0gZmluaXRlVG9TdHJpbmcoeCwgdHJ1ZSk7XHJcbiAgfSBlbHNlIHtcclxuICAgIGNoZWNrSW50MzIoZHAsIDAsIE1BWF9ESUdJVFMpO1xyXG5cclxuICAgIGlmIChybSA9PT0gdm9pZCAwKSBybSA9IEN0b3Iucm91bmRpbmc7XHJcbiAgICBlbHNlIGNoZWNrSW50MzIocm0sIDAsIDgpO1xyXG5cclxuICAgIHggPSBmaW5hbGlzZShuZXcgQ3Rvcih4KSwgZHAgKyAxLCBybSk7XHJcbiAgICBzdHIgPSBmaW5pdGVUb1N0cmluZyh4LCB0cnVlLCBkcCArIDEpO1xyXG4gIH1cclxuXHJcbiAgcmV0dXJuIHguaXNOZWcoKSAmJiAheC5pc1plcm8oKSA/ICctJyArIHN0ciA6IHN0cjtcclxufTtcclxuXHJcblxyXG4vKlxyXG4gKiBSZXR1cm4gYSBzdHJpbmcgcmVwcmVzZW50aW5nIHRoZSB2YWx1ZSBvZiB0aGlzIERlY2ltYWwgaW4gbm9ybWFsIChmaXhlZC1wb2ludCkgbm90YXRpb24gdG9cclxuICogYGRwYCBmaXhlZCBkZWNpbWFsIHBsYWNlcyBhbmQgcm91bmRlZCB1c2luZyByb3VuZGluZyBtb2RlIGBybWAgb3IgYHJvdW5kaW5nYCBpZiBgcm1gIGlzXHJcbiAqIG9taXR0ZWQuXHJcbiAqXHJcbiAqIEFzIHdpdGggSmF2YVNjcmlwdCBudW1iZXJzLCAoLTApLnRvRml4ZWQoMCkgaXMgJzAnLCBidXQgZS5nLiAoLTAuMDAwMDEpLnRvRml4ZWQoMCkgaXMgJy0wJy5cclxuICpcclxuICogW2RwXSB7bnVtYmVyfSBEZWNpbWFsIHBsYWNlcy4gSW50ZWdlciwgMCB0byBNQVhfRElHSVRTIGluY2x1c2l2ZS5cclxuICogW3JtXSB7bnVtYmVyfSBSb3VuZGluZyBtb2RlLiBJbnRlZ2VyLCAwIHRvIDggaW5jbHVzaXZlLlxyXG4gKlxyXG4gKiAoLTApLnRvRml4ZWQoMCkgaXMgJzAnLCBidXQgKC0wLjEpLnRvRml4ZWQoMCkgaXMgJy0wJy5cclxuICogKC0wKS50b0ZpeGVkKDEpIGlzICcwLjAnLCBidXQgKC0wLjAxKS50b0ZpeGVkKDEpIGlzICctMC4wJy5cclxuICogKC0wKS50b0ZpeGVkKDMpIGlzICcwLjAwMCcuXHJcbiAqICgtMC41KS50b0ZpeGVkKDApIGlzICctMCcuXHJcbiAqXHJcbiAqL1xyXG5QLnRvRml4ZWQgPSBmdW5jdGlvbiAoZHAsIHJtKSB7XHJcbiAgdmFyIHN0ciwgeSxcclxuICAgIHggPSB0aGlzLFxyXG4gICAgQ3RvciA9IHguY29uc3RydWN0b3I7XHJcblxyXG4gIGlmIChkcCA9PT0gdm9pZCAwKSB7XHJcbiAgICBzdHIgPSBmaW5pdGVUb1N0cmluZyh4KTtcclxuICB9IGVsc2Uge1xyXG4gICAgY2hlY2tJbnQzMihkcCwgMCwgTUFYX0RJR0lUUyk7XHJcblxyXG4gICAgaWYgKHJtID09PSB2b2lkIDApIHJtID0gQ3Rvci5yb3VuZGluZztcclxuICAgIGVsc2UgY2hlY2tJbnQzMihybSwgMCwgOCk7XHJcblxyXG4gICAgeSA9IGZpbmFsaXNlKG5ldyBDdG9yKHgpLCBkcCArIHguZSArIDEsIHJtKTtcclxuICAgIHN0ciA9IGZpbml0ZVRvU3RyaW5nKHksIGZhbHNlLCBkcCArIHkuZSArIDEpO1xyXG4gIH1cclxuXHJcbiAgLy8gVG8gZGV0ZXJtaW5lIHdoZXRoZXIgdG8gYWRkIHRoZSBtaW51cyBzaWduIGxvb2sgYXQgdGhlIHZhbHVlIGJlZm9yZSBpdCB3YXMgcm91bmRlZCxcclxuICAvLyBpLmUuIGxvb2sgYXQgYHhgIHJhdGhlciB0aGFuIGB5YC5cclxuICByZXR1cm4geC5pc05lZygpICYmICF4LmlzWmVybygpID8gJy0nICsgc3RyIDogc3RyO1xyXG59O1xyXG5cclxuXHJcbi8qXHJcbiAqIFJldHVybiBhbiBhcnJheSByZXByZXNlbnRpbmcgdGhlIHZhbHVlIG9mIHRoaXMgRGVjaW1hbCBhcyBhIHNpbXBsZSBmcmFjdGlvbiB3aXRoIGFuIGludGVnZXJcclxuICogbnVtZXJhdG9yIGFuZCBhbiBpbnRlZ2VyIGRlbm9taW5hdG9yLlxyXG4gKlxyXG4gKiBUaGUgZGVub21pbmF0b3Igd2lsbCBiZSBhIHBvc2l0aXZlIG5vbi16ZXJvIHZhbHVlIGxlc3MgdGhhbiBvciBlcXVhbCB0byB0aGUgc3BlY2lmaWVkIG1heGltdW1cclxuICogZGVub21pbmF0b3IuIElmIGEgbWF4aW11bSBkZW5vbWluYXRvciBpcyBub3Qgc3BlY2lmaWVkLCB0aGUgZGVub21pbmF0b3Igd2lsbCBiZSB0aGUgbG93ZXN0XHJcbiAqIHZhbHVlIG5lY2Vzc2FyeSB0byByZXByZXNlbnQgdGhlIG51bWJlciBleGFjdGx5LlxyXG4gKlxyXG4gKiBbbWF4RF0ge251bWJlcnxzdHJpbmd8RGVjaW1hbH0gTWF4aW11bSBkZW5vbWluYXRvci4gSW50ZWdlciA+PSAxIGFuZCA8IEluZmluaXR5LlxyXG4gKlxyXG4gKi9cclxuUC50b0ZyYWN0aW9uID0gZnVuY3Rpb24gKG1heEQpIHtcclxuICB2YXIgZCwgZDAsIGQxLCBkMiwgZSwgaywgbiwgbjAsIG4xLCBwciwgcSwgcixcclxuICAgIHggPSB0aGlzLFxyXG4gICAgeGQgPSB4LmQsXHJcbiAgICBDdG9yID0geC5jb25zdHJ1Y3RvcjtcclxuXHJcbiAgaWYgKCF4ZCkgcmV0dXJuIG5ldyBDdG9yKHgpO1xyXG5cclxuICBuMSA9IGQwID0gbmV3IEN0b3IoMSk7XHJcbiAgZDEgPSBuMCA9IG5ldyBDdG9yKDApO1xyXG5cclxuICBkID0gbmV3IEN0b3IoZDEpO1xyXG4gIGUgPSBkLmUgPSBnZXRQcmVjaXNpb24oeGQpIC0geC5lIC0gMTtcclxuICBrID0gZSAlIExPR19CQVNFO1xyXG4gIGQuZFswXSA9IG1hdGhwb3coMTAsIGsgPCAwID8gTE9HX0JBU0UgKyBrIDogayk7XHJcblxyXG4gIGlmIChtYXhEID09IG51bGwpIHtcclxuXHJcbiAgICAvLyBkIGlzIDEwKiplLCB0aGUgbWluaW11bSBtYXgtZGVub21pbmF0b3IgbmVlZGVkLlxyXG4gICAgbWF4RCA9IGUgPiAwID8gZCA6IG4xO1xyXG4gIH0gZWxzZSB7XHJcbiAgICBuID0gbmV3IEN0b3IobWF4RCk7XHJcbiAgICBpZiAoIW4uaXNJbnQoKSB8fCBuLmx0KG4xKSkgdGhyb3cgRXJyb3IoaW52YWxpZEFyZ3VtZW50ICsgbik7XHJcbiAgICBtYXhEID0gbi5ndChkKSA/IChlID4gMCA/IGQgOiBuMSkgOiBuO1xyXG4gIH1cclxuXHJcbiAgZXh0ZXJuYWwgPSBmYWxzZTtcclxuICBuID0gbmV3IEN0b3IoZGlnaXRzVG9TdHJpbmcoeGQpKTtcclxuICBwciA9IEN0b3IucHJlY2lzaW9uO1xyXG4gIEN0b3IucHJlY2lzaW9uID0gZSA9IHhkLmxlbmd0aCAqIExPR19CQVNFICogMjtcclxuXHJcbiAgZm9yICg7OykgIHtcclxuICAgIHEgPSBkaXZpZGUobiwgZCwgMCwgMSwgMSk7XHJcbiAgICBkMiA9IGQwLnBsdXMocS50aW1lcyhkMSkpO1xyXG4gICAgaWYgKGQyLmNtcChtYXhEKSA9PSAxKSBicmVhaztcclxuICAgIGQwID0gZDE7XHJcbiAgICBkMSA9IGQyO1xyXG4gICAgZDIgPSBuMTtcclxuICAgIG4xID0gbjAucGx1cyhxLnRpbWVzKGQyKSk7XHJcbiAgICBuMCA9IGQyO1xyXG4gICAgZDIgPSBkO1xyXG4gICAgZCA9IG4ubWludXMocS50aW1lcyhkMikpO1xyXG4gICAgbiA9IGQyO1xyXG4gIH1cclxuXHJcbiAgZDIgPSBkaXZpZGUobWF4RC5taW51cyhkMCksIGQxLCAwLCAxLCAxKTtcclxuICBuMCA9IG4wLnBsdXMoZDIudGltZXMobjEpKTtcclxuICBkMCA9IGQwLnBsdXMoZDIudGltZXMoZDEpKTtcclxuICBuMC5zID0gbjEucyA9IHgucztcclxuXHJcbiAgLy8gRGV0ZXJtaW5lIHdoaWNoIGZyYWN0aW9uIGlzIGNsb3NlciB0byB4LCBuMC9kMCBvciBuMS9kMT9cclxuICByID0gZGl2aWRlKG4xLCBkMSwgZSwgMSkubWludXMoeCkuYWJzKCkuY21wKGRpdmlkZShuMCwgZDAsIGUsIDEpLm1pbnVzKHgpLmFicygpKSA8IDFcclxuICAgICAgPyBbbjEsIGQxXSA6IFtuMCwgZDBdO1xyXG5cclxuICBDdG9yLnByZWNpc2lvbiA9IHByO1xyXG4gIGV4dGVybmFsID0gdHJ1ZTtcclxuXHJcbiAgcmV0dXJuIHI7XHJcbn07XHJcblxyXG5cclxuLypcclxuICogUmV0dXJuIGEgc3RyaW5nIHJlcHJlc2VudGluZyB0aGUgdmFsdWUgb2YgdGhpcyBEZWNpbWFsIGluIGJhc2UgMTYsIHJvdW5kIHRvIGBzZGAgc2lnbmlmaWNhbnRcclxuICogZGlnaXRzIHVzaW5nIHJvdW5kaW5nIG1vZGUgYHJtYC5cclxuICpcclxuICogSWYgdGhlIG9wdGlvbmFsIGBzZGAgYXJndW1lbnQgaXMgcHJlc2VudCB0aGVuIHJldHVybiBiaW5hcnkgZXhwb25lbnRpYWwgbm90YXRpb24uXHJcbiAqXHJcbiAqIFtzZF0ge251bWJlcn0gU2lnbmlmaWNhbnQgZGlnaXRzLiBJbnRlZ2VyLCAxIHRvIE1BWF9ESUdJVFMgaW5jbHVzaXZlLlxyXG4gKiBbcm1dIHtudW1iZXJ9IFJvdW5kaW5nIG1vZGUuIEludGVnZXIsIDAgdG8gOCBpbmNsdXNpdmUuXHJcbiAqXHJcbiAqL1xyXG5QLnRvSGV4YWRlY2ltYWwgPSBQLnRvSGV4ID0gZnVuY3Rpb24gKHNkLCBybSkge1xyXG4gIHJldHVybiB0b1N0cmluZ0JpbmFyeSh0aGlzLCAxNiwgc2QsIHJtKTtcclxufTtcclxuXHJcblxyXG4vKlxyXG4gKiBSZXR1cm5zIGEgbmV3IERlY2ltYWwgd2hvc2UgdmFsdWUgaXMgdGhlIG5lYXJlc3QgbXVsdGlwbGUgb2YgYHlgIGluIHRoZSBkaXJlY3Rpb24gb2Ygcm91bmRpbmdcclxuICogbW9kZSBgcm1gLCBvciBgRGVjaW1hbC5yb3VuZGluZ2AgaWYgYHJtYCBpcyBvbWl0dGVkLCB0byB0aGUgdmFsdWUgb2YgdGhpcyBEZWNpbWFsLlxyXG4gKlxyXG4gKiBUaGUgcmV0dXJuIHZhbHVlIHdpbGwgYWx3YXlzIGhhdmUgdGhlIHNhbWUgc2lnbiBhcyB0aGlzIERlY2ltYWwsIHVubGVzcyBlaXRoZXIgdGhpcyBEZWNpbWFsXHJcbiAqIG9yIGB5YCBpcyBOYU4sIGluIHdoaWNoIGNhc2UgdGhlIHJldHVybiB2YWx1ZSB3aWxsIGJlIGFsc28gYmUgTmFOLlxyXG4gKlxyXG4gKiBUaGUgcmV0dXJuIHZhbHVlIGlzIG5vdCBhZmZlY3RlZCBieSB0aGUgdmFsdWUgb2YgYHByZWNpc2lvbmAuXHJcbiAqXHJcbiAqIHkge251bWJlcnxzdHJpbmd8RGVjaW1hbH0gVGhlIG1hZ25pdHVkZSB0byByb3VuZCB0byBhIG11bHRpcGxlIG9mLlxyXG4gKiBbcm1dIHtudW1iZXJ9IFJvdW5kaW5nIG1vZGUuIEludGVnZXIsIDAgdG8gOCBpbmNsdXNpdmUuXHJcbiAqXHJcbiAqICd0b05lYXJlc3QoKSByb3VuZGluZyBtb2RlIG5vdCBhbiBpbnRlZ2VyOiB7cm19J1xyXG4gKiAndG9OZWFyZXN0KCkgcm91bmRpbmcgbW9kZSBvdXQgb2YgcmFuZ2U6IHtybX0nXHJcbiAqXHJcbiAqL1xyXG5QLnRvTmVhcmVzdCA9IGZ1bmN0aW9uICh5LCBybSkge1xyXG4gIHZhciB4ID0gdGhpcyxcclxuICAgIEN0b3IgPSB4LmNvbnN0cnVjdG9yO1xyXG5cclxuICB4ID0gbmV3IEN0b3IoeCk7XHJcblxyXG4gIGlmICh5ID09IG51bGwpIHtcclxuXHJcbiAgICAvLyBJZiB4IGlzIG5vdCBmaW5pdGUsIHJldHVybiB4LlxyXG4gICAgaWYgKCF4LmQpIHJldHVybiB4O1xyXG5cclxuICAgIHkgPSBuZXcgQ3RvcigxKTtcclxuICAgIHJtID0gQ3Rvci5yb3VuZGluZztcclxuICB9IGVsc2Uge1xyXG4gICAgeSA9IG5ldyBDdG9yKHkpO1xyXG4gICAgaWYgKHJtID09PSB2b2lkIDApIHtcclxuICAgICAgcm0gPSBDdG9yLnJvdW5kaW5nO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgY2hlY2tJbnQzMihybSwgMCwgOCk7XHJcbiAgICB9XHJcblxyXG4gICAgLy8gSWYgeCBpcyBub3QgZmluaXRlLCByZXR1cm4geCBpZiB5IGlzIG5vdCBOYU4sIGVsc2UgTmFOLlxyXG4gICAgaWYgKCF4LmQpIHJldHVybiB5LnMgPyB4IDogeTtcclxuXHJcbiAgICAvLyBJZiB5IGlzIG5vdCBmaW5pdGUsIHJldHVybiBJbmZpbml0eSB3aXRoIHRoZSBzaWduIG9mIHggaWYgeSBpcyBJbmZpbml0eSwgZWxzZSBOYU4uXHJcbiAgICBpZiAoIXkuZCkge1xyXG4gICAgICBpZiAoeS5zKSB5LnMgPSB4LnM7XHJcbiAgICAgIHJldHVybiB5O1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgLy8gSWYgeSBpcyBub3QgemVybywgY2FsY3VsYXRlIHRoZSBuZWFyZXN0IG11bHRpcGxlIG9mIHkgdG8geC5cclxuICBpZiAoeS5kWzBdKSB7XHJcbiAgICBleHRlcm5hbCA9IGZhbHNlO1xyXG4gICAgeCA9IGRpdmlkZSh4LCB5LCAwLCBybSwgMSkudGltZXMoeSk7XHJcbiAgICBleHRlcm5hbCA9IHRydWU7XHJcbiAgICBmaW5hbGlzZSh4KTtcclxuXHJcbiAgLy8gSWYgeSBpcyB6ZXJvLCByZXR1cm4gemVybyB3aXRoIHRoZSBzaWduIG9mIHguXHJcbiAgfSBlbHNlIHtcclxuICAgIHkucyA9IHgucztcclxuICAgIHggPSB5O1xyXG4gIH1cclxuXHJcbiAgcmV0dXJuIHg7XHJcbn07XHJcblxyXG5cclxuLypcclxuICogUmV0dXJuIHRoZSB2YWx1ZSBvZiB0aGlzIERlY2ltYWwgY29udmVydGVkIHRvIGEgbnVtYmVyIHByaW1pdGl2ZS5cclxuICogWmVybyBrZWVwcyBpdHMgc2lnbi5cclxuICpcclxuICovXHJcblAudG9OdW1iZXIgPSBmdW5jdGlvbiAoKSB7XHJcbiAgcmV0dXJuICt0aGlzO1xyXG59O1xyXG5cclxuXHJcbi8qXHJcbiAqIFJldHVybiBhIHN0cmluZyByZXByZXNlbnRpbmcgdGhlIHZhbHVlIG9mIHRoaXMgRGVjaW1hbCBpbiBiYXNlIDgsIHJvdW5kIHRvIGBzZGAgc2lnbmlmaWNhbnRcclxuICogZGlnaXRzIHVzaW5nIHJvdW5kaW5nIG1vZGUgYHJtYC5cclxuICpcclxuICogSWYgdGhlIG9wdGlvbmFsIGBzZGAgYXJndW1lbnQgaXMgcHJlc2VudCB0aGVuIHJldHVybiBiaW5hcnkgZXhwb25lbnRpYWwgbm90YXRpb24uXHJcbiAqXHJcbiAqIFtzZF0ge251bWJlcn0gU2lnbmlmaWNhbnQgZGlnaXRzLiBJbnRlZ2VyLCAxIHRvIE1BWF9ESUdJVFMgaW5jbHVzaXZlLlxyXG4gKiBbcm1dIHtudW1iZXJ9IFJvdW5kaW5nIG1vZGUuIEludGVnZXIsIDAgdG8gOCBpbmNsdXNpdmUuXHJcbiAqXHJcbiAqL1xyXG5QLnRvT2N0YWwgPSBmdW5jdGlvbiAoc2QsIHJtKSB7XHJcbiAgcmV0dXJuIHRvU3RyaW5nQmluYXJ5KHRoaXMsIDgsIHNkLCBybSk7XHJcbn07XHJcblxyXG5cclxuLypcclxuICogUmV0dXJuIGEgbmV3IERlY2ltYWwgd2hvc2UgdmFsdWUgaXMgdGhlIHZhbHVlIG9mIHRoaXMgRGVjaW1hbCByYWlzZWQgdG8gdGhlIHBvd2VyIGB5YCwgcm91bmRlZFxyXG4gKiB0byBgcHJlY2lzaW9uYCBzaWduaWZpY2FudCBkaWdpdHMgdXNpbmcgcm91bmRpbmcgbW9kZSBgcm91bmRpbmdgLlxyXG4gKlxyXG4gKiBFQ01BU2NyaXB0IGNvbXBsaWFudC5cclxuICpcclxuICogICBwb3coeCwgTmFOKSAgICAgICAgICAgICAgICAgICAgICAgICAgID0gTmFOXHJcbiAqICAgcG93KHgsIFx1MDBCMTApICAgICAgICAgICAgICAgICAgICAgICAgICAgID0gMVxyXG5cclxuICogICBwb3coTmFOLCBub24temVybykgICAgICAgICAgICAgICAgICAgID0gTmFOXHJcbiAqICAgcG93KGFicyh4KSA+IDEsICtJbmZpbml0eSkgICAgICAgICAgICA9ICtJbmZpbml0eVxyXG4gKiAgIHBvdyhhYnMoeCkgPiAxLCAtSW5maW5pdHkpICAgICAgICAgICAgPSArMFxyXG4gKiAgIHBvdyhhYnMoeCkgPT0gMSwgXHUwMEIxSW5maW5pdHkpICAgICAgICAgICA9IE5hTlxyXG4gKiAgIHBvdyhhYnMoeCkgPCAxLCArSW5maW5pdHkpICAgICAgICAgICAgPSArMFxyXG4gKiAgIHBvdyhhYnMoeCkgPCAxLCAtSW5maW5pdHkpICAgICAgICAgICAgPSArSW5maW5pdHlcclxuICogICBwb3coK0luZmluaXR5LCB5ID4gMCkgICAgICAgICAgICAgICAgID0gK0luZmluaXR5XHJcbiAqICAgcG93KCtJbmZpbml0eSwgeSA8IDApICAgICAgICAgICAgICAgICA9ICswXHJcbiAqICAgcG93KC1JbmZpbml0eSwgb2RkIGludGVnZXIgPiAwKSAgICAgICA9IC1JbmZpbml0eVxyXG4gKiAgIHBvdygtSW5maW5pdHksIGV2ZW4gaW50ZWdlciA+IDApICAgICAgPSArSW5maW5pdHlcclxuICogICBwb3coLUluZmluaXR5LCBvZGQgaW50ZWdlciA8IDApICAgICAgID0gLTBcclxuICogICBwb3coLUluZmluaXR5LCBldmVuIGludGVnZXIgPCAwKSAgICAgID0gKzBcclxuICogICBwb3coKzAsIHkgPiAwKSAgICAgICAgICAgICAgICAgICAgICAgID0gKzBcclxuICogICBwb3coKzAsIHkgPCAwKSAgICAgICAgICAgICAgICAgICAgICAgID0gK0luZmluaXR5XHJcbiAqICAgcG93KC0wLCBvZGQgaW50ZWdlciA+IDApICAgICAgICAgICAgICA9IC0wXHJcbiAqICAgcG93KC0wLCBldmVuIGludGVnZXIgPiAwKSAgICAgICAgICAgICA9ICswXHJcbiAqICAgcG93KC0wLCBvZGQgaW50ZWdlciA8IDApICAgICAgICAgICAgICA9IC1JbmZpbml0eVxyXG4gKiAgIHBvdygtMCwgZXZlbiBpbnRlZ2VyIDwgMCkgICAgICAgICAgICAgPSArSW5maW5pdHlcclxuICogICBwb3coZmluaXRlIHggPCAwLCBmaW5pdGUgbm9uLWludGVnZXIpID0gTmFOXHJcbiAqXHJcbiAqIEZvciBub24taW50ZWdlciBvciB2ZXJ5IGxhcmdlIGV4cG9uZW50cyBwb3coeCwgeSkgaXMgY2FsY3VsYXRlZCB1c2luZ1xyXG4gKlxyXG4gKiAgIHheeSA9IGV4cCh5KmxuKHgpKVxyXG4gKlxyXG4gKiBBc3N1bWluZyB0aGUgZmlyc3QgMTUgcm91bmRpbmcgZGlnaXRzIGFyZSBlYWNoIGVxdWFsbHkgbGlrZWx5IHRvIGJlIGFueSBkaWdpdCAwLTksIHRoZVxyXG4gKiBwcm9iYWJpbGl0eSBvZiBhbiBpbmNvcnJlY3RseSByb3VuZGVkIHJlc3VsdFxyXG4gKiBQKFs0OV05ezE0fSB8IFs1MF0wezE0fSkgPSAyICogMC4yICogMTBeLTE0ID0gNGUtMTUgPSAxLzIuNWUrMTRcclxuICogaS5lLiAxIGluIDI1MCwwMDAsMDAwLDAwMCwwMDBcclxuICpcclxuICogSWYgYSByZXN1bHQgaXMgaW5jb3JyZWN0bHkgcm91bmRlZCB0aGUgbWF4aW11bSBlcnJvciB3aWxsIGJlIDEgdWxwICh1bml0IGluIGxhc3QgcGxhY2UpLlxyXG4gKlxyXG4gKiB5IHtudW1iZXJ8c3RyaW5nfERlY2ltYWx9IFRoZSBwb3dlciB0byB3aGljaCB0byByYWlzZSB0aGlzIERlY2ltYWwuXHJcbiAqXHJcbiAqL1xyXG5QLnRvUG93ZXIgPSBQLnBvdyA9IGZ1bmN0aW9uICh5KSB7XHJcbiAgdmFyIGUsIGssIHByLCByLCBybSwgcyxcclxuICAgIHggPSB0aGlzLFxyXG4gICAgQ3RvciA9IHguY29uc3RydWN0b3IsXHJcbiAgICB5biA9ICsoeSA9IG5ldyBDdG9yKHkpKTtcclxuXHJcbiAgLy8gRWl0aGVyIFx1MDBCMUluZmluaXR5LCBOYU4gb3IgXHUwMEIxMD9cclxuICBpZiAoIXguZCB8fCAheS5kIHx8ICF4LmRbMF0gfHwgIXkuZFswXSkgcmV0dXJuIG5ldyBDdG9yKG1hdGhwb3coK3gsIHluKSk7XHJcblxyXG4gIHggPSBuZXcgQ3Rvcih4KTtcclxuXHJcbiAgaWYgKHguZXEoMSkpIHJldHVybiB4O1xyXG5cclxuICBwciA9IEN0b3IucHJlY2lzaW9uO1xyXG4gIHJtID0gQ3Rvci5yb3VuZGluZztcclxuXHJcbiAgaWYgKHkuZXEoMSkpIHJldHVybiBmaW5hbGlzZSh4LCBwciwgcm0pO1xyXG5cclxuICAvLyB5IGV4cG9uZW50XHJcbiAgZSA9IG1hdGhmbG9vcih5LmUgLyBMT0dfQkFTRSk7XHJcblxyXG4gIC8vIElmIHkgaXMgYSBzbWFsbCBpbnRlZ2VyIHVzZSB0aGUgJ2V4cG9uZW50aWF0aW9uIGJ5IHNxdWFyaW5nJyBhbGdvcml0aG0uXHJcbiAgaWYgKGUgPj0geS5kLmxlbmd0aCAtIDEgJiYgKGsgPSB5biA8IDAgPyAteW4gOiB5bikgPD0gTUFYX1NBRkVfSU5URUdFUikge1xyXG4gICAgciA9IGludFBvdyhDdG9yLCB4LCBrLCBwcik7XHJcbiAgICByZXR1cm4geS5zIDwgMCA/IG5ldyBDdG9yKDEpLmRpdihyKSA6IGZpbmFsaXNlKHIsIHByLCBybSk7XHJcbiAgfVxyXG5cclxuICBzID0geC5zO1xyXG5cclxuICAvLyBpZiB4IGlzIG5lZ2F0aXZlXHJcbiAgaWYgKHMgPCAwKSB7XHJcblxyXG4gICAgLy8gaWYgeSBpcyBub3QgYW4gaW50ZWdlclxyXG4gICAgaWYgKGUgPCB5LmQubGVuZ3RoIC0gMSkgcmV0dXJuIG5ldyBDdG9yKE5hTik7XHJcblxyXG4gICAgLy8gUmVzdWx0IGlzIHBvc2l0aXZlIGlmIHggaXMgbmVnYXRpdmUgYW5kIHRoZSBsYXN0IGRpZ2l0IG9mIGludGVnZXIgeSBpcyBldmVuLlxyXG4gICAgaWYgKCh5LmRbZV0gJiAxKSA9PSAwKSBzID0gMTtcclxuXHJcbiAgICAvLyBpZiB4LmVxKC0xKVxyXG4gICAgaWYgKHguZSA9PSAwICYmIHguZFswXSA9PSAxICYmIHguZC5sZW5ndGggPT0gMSkge1xyXG4gICAgICB4LnMgPSBzO1xyXG4gICAgICByZXR1cm4geDtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIC8vIEVzdGltYXRlIHJlc3VsdCBleHBvbmVudC5cclxuICAvLyB4XnkgPSAxMF5lLCAgd2hlcmUgZSA9IHkgKiBsb2cxMCh4KVxyXG4gIC8vIGxvZzEwKHgpID0gbG9nMTAoeF9zaWduaWZpY2FuZCkgKyB4X2V4cG9uZW50XHJcbiAgLy8gbG9nMTAoeF9zaWduaWZpY2FuZCkgPSBsbih4X3NpZ25pZmljYW5kKSAvIGxuKDEwKVxyXG4gIGsgPSBtYXRocG93KCt4LCB5bik7XHJcbiAgZSA9IGsgPT0gMCB8fCAhaXNGaW5pdGUoaylcclxuICAgID8gbWF0aGZsb29yKHluICogKE1hdGgubG9nKCcwLicgKyBkaWdpdHNUb1N0cmluZyh4LmQpKSAvIE1hdGguTE4xMCArIHguZSArIDEpKVxyXG4gICAgOiBuZXcgQ3RvcihrICsgJycpLmU7XHJcblxyXG4gIC8vIEV4cG9uZW50IGVzdGltYXRlIG1heSBiZSBpbmNvcnJlY3QgZS5nLiB4OiAwLjk5OTk5OTk5OTk5OTk5OTk5OSwgeTogMi4yOSwgZTogMCwgci5lOiAtMS5cclxuXHJcbiAgLy8gT3ZlcmZsb3cvdW5kZXJmbG93P1xyXG4gIGlmIChlID4gQ3Rvci5tYXhFICsgMSB8fCBlIDwgQ3Rvci5taW5FIC0gMSkgcmV0dXJuIG5ldyBDdG9yKGUgPiAwID8gcyAvIDAgOiAwKTtcclxuXHJcbiAgZXh0ZXJuYWwgPSBmYWxzZTtcclxuICBDdG9yLnJvdW5kaW5nID0geC5zID0gMTtcclxuXHJcbiAgLy8gRXN0aW1hdGUgdGhlIGV4dHJhIGd1YXJkIGRpZ2l0cyBuZWVkZWQgdG8gZW5zdXJlIGZpdmUgY29ycmVjdCByb3VuZGluZyBkaWdpdHMgZnJvbVxyXG4gIC8vIG5hdHVyYWxMb2dhcml0aG0oeCkuIEV4YW1wbGUgb2YgZmFpbHVyZSB3aXRob3V0IHRoZXNlIGV4dHJhIGRpZ2l0cyAocHJlY2lzaW9uOiAxMCk6XHJcbiAgLy8gbmV3IERlY2ltYWwoMi4zMjQ1NikucG93KCcyMDg3OTg3NDM2NTM0NTY2LjQ2NDExJylcclxuICAvLyBzaG91bGQgYmUgMS4xNjIzNzc4MjNlKzc2NDkxNDkwNTE3MzgxNSwgYnV0IGlzIDEuMTYyMzU1ODIzZSs3NjQ5MTQ5MDUxNzM4MTVcclxuICBrID0gTWF0aC5taW4oMTIsIChlICsgJycpLmxlbmd0aCk7XHJcblxyXG4gIC8vIHIgPSB4XnkgPSBleHAoeSpsbih4KSlcclxuICByID0gbmF0dXJhbEV4cG9uZW50aWFsKHkudGltZXMobmF0dXJhbExvZ2FyaXRobSh4LCBwciArIGspKSwgcHIpO1xyXG5cclxuICAvLyByIG1heSBiZSBJbmZpbml0eSwgZS5nLiAoMC45OTk5OTk5OTk5OTk5OTk5KS5wb3coLTFlKzQwKVxyXG4gIGlmIChyLmQpIHtcclxuXHJcbiAgICAvLyBUcnVuY2F0ZSB0byB0aGUgcmVxdWlyZWQgcHJlY2lzaW9uIHBsdXMgZml2ZSByb3VuZGluZyBkaWdpdHMuXHJcbiAgICByID0gZmluYWxpc2UociwgcHIgKyA1LCAxKTtcclxuXHJcbiAgICAvLyBJZiB0aGUgcm91bmRpbmcgZGlnaXRzIGFyZSBbNDldOTk5OSBvciBbNTBdMDAwMCBpbmNyZWFzZSB0aGUgcHJlY2lzaW9uIGJ5IDEwIGFuZCByZWNhbGN1bGF0ZVxyXG4gICAgLy8gdGhlIHJlc3VsdC5cclxuICAgIGlmIChjaGVja1JvdW5kaW5nRGlnaXRzKHIuZCwgcHIsIHJtKSkge1xyXG4gICAgICBlID0gcHIgKyAxMDtcclxuXHJcbiAgICAgIC8vIFRydW5jYXRlIHRvIHRoZSBpbmNyZWFzZWQgcHJlY2lzaW9uIHBsdXMgZml2ZSByb3VuZGluZyBkaWdpdHMuXHJcbiAgICAgIHIgPSBmaW5hbGlzZShuYXR1cmFsRXhwb25lbnRpYWwoeS50aW1lcyhuYXR1cmFsTG9nYXJpdGhtKHgsIGUgKyBrKSksIGUpLCBlICsgNSwgMSk7XHJcblxyXG4gICAgICAvLyBDaGVjayBmb3IgMTQgbmluZXMgZnJvbSB0aGUgMm5kIHJvdW5kaW5nIGRpZ2l0ICh0aGUgZmlyc3Qgcm91bmRpbmcgZGlnaXQgbWF5IGJlIDQgb3IgOSkuXHJcbiAgICAgIGlmICgrZGlnaXRzVG9TdHJpbmcoci5kKS5zbGljZShwciArIDEsIHByICsgMTUpICsgMSA9PSAxZTE0KSB7XHJcbiAgICAgICAgciA9IGZpbmFsaXNlKHIsIHByICsgMSwgMCk7XHJcbiAgICAgIH1cclxuICAgIH1cclxuICB9XHJcblxyXG4gIHIucyA9IHM7XHJcbiAgZXh0ZXJuYWwgPSB0cnVlO1xyXG4gIEN0b3Iucm91bmRpbmcgPSBybTtcclxuXHJcbiAgcmV0dXJuIGZpbmFsaXNlKHIsIHByLCBybSk7XHJcbn07XHJcblxyXG5cclxuLypcclxuICogUmV0dXJuIGEgc3RyaW5nIHJlcHJlc2VudGluZyB0aGUgdmFsdWUgb2YgdGhpcyBEZWNpbWFsIHJvdW5kZWQgdG8gYHNkYCBzaWduaWZpY2FudCBkaWdpdHNcclxuICogdXNpbmcgcm91bmRpbmcgbW9kZSBgcm91bmRpbmdgLlxyXG4gKlxyXG4gKiBSZXR1cm4gZXhwb25lbnRpYWwgbm90YXRpb24gaWYgYHNkYCBpcyBsZXNzIHRoYW4gdGhlIG51bWJlciBvZiBkaWdpdHMgbmVjZXNzYXJ5IHRvIHJlcHJlc2VudFxyXG4gKiB0aGUgaW50ZWdlciBwYXJ0IG9mIHRoZSB2YWx1ZSBpbiBub3JtYWwgbm90YXRpb24uXHJcbiAqXHJcbiAqIFtzZF0ge251bWJlcn0gU2lnbmlmaWNhbnQgZGlnaXRzLiBJbnRlZ2VyLCAxIHRvIE1BWF9ESUdJVFMgaW5jbHVzaXZlLlxyXG4gKiBbcm1dIHtudW1iZXJ9IFJvdW5kaW5nIG1vZGUuIEludGVnZXIsIDAgdG8gOCBpbmNsdXNpdmUuXHJcbiAqXHJcbiAqL1xyXG5QLnRvUHJlY2lzaW9uID0gZnVuY3Rpb24gKHNkLCBybSkge1xyXG4gIHZhciBzdHIsXHJcbiAgICB4ID0gdGhpcyxcclxuICAgIEN0b3IgPSB4LmNvbnN0cnVjdG9yO1xyXG5cclxuICBpZiAoc2QgPT09IHZvaWQgMCkge1xyXG4gICAgc3RyID0gZmluaXRlVG9TdHJpbmcoeCwgeC5lIDw9IEN0b3IudG9FeHBOZWcgfHwgeC5lID49IEN0b3IudG9FeHBQb3MpO1xyXG4gIH0gZWxzZSB7XHJcbiAgICBjaGVja0ludDMyKHNkLCAxLCBNQVhfRElHSVRTKTtcclxuXHJcbiAgICBpZiAocm0gPT09IHZvaWQgMCkgcm0gPSBDdG9yLnJvdW5kaW5nO1xyXG4gICAgZWxzZSBjaGVja0ludDMyKHJtLCAwLCA4KTtcclxuXHJcbiAgICB4ID0gZmluYWxpc2UobmV3IEN0b3IoeCksIHNkLCBybSk7XHJcbiAgICBzdHIgPSBmaW5pdGVUb1N0cmluZyh4LCBzZCA8PSB4LmUgfHwgeC5lIDw9IEN0b3IudG9FeHBOZWcsIHNkKTtcclxuICB9XHJcblxyXG4gIHJldHVybiB4LmlzTmVnKCkgJiYgIXguaXNaZXJvKCkgPyAnLScgKyBzdHIgOiBzdHI7XHJcbn07XHJcblxyXG5cclxuLypcclxuICogUmV0dXJuIGEgbmV3IERlY2ltYWwgd2hvc2UgdmFsdWUgaXMgdGhlIHZhbHVlIG9mIHRoaXMgRGVjaW1hbCByb3VuZGVkIHRvIGEgbWF4aW11bSBvZiBgc2RgXHJcbiAqIHNpZ25pZmljYW50IGRpZ2l0cyB1c2luZyByb3VuZGluZyBtb2RlIGBybWAsIG9yIHRvIGBwcmVjaXNpb25gIGFuZCBgcm91bmRpbmdgIHJlc3BlY3RpdmVseSBpZlxyXG4gKiBvbWl0dGVkLlxyXG4gKlxyXG4gKiBbc2RdIHtudW1iZXJ9IFNpZ25pZmljYW50IGRpZ2l0cy4gSW50ZWdlciwgMSB0byBNQVhfRElHSVRTIGluY2x1c2l2ZS5cclxuICogW3JtXSB7bnVtYmVyfSBSb3VuZGluZyBtb2RlLiBJbnRlZ2VyLCAwIHRvIDggaW5jbHVzaXZlLlxyXG4gKlxyXG4gKiAndG9TRCgpIGRpZ2l0cyBvdXQgb2YgcmFuZ2U6IHtzZH0nXHJcbiAqICd0b1NEKCkgZGlnaXRzIG5vdCBhbiBpbnRlZ2VyOiB7c2R9J1xyXG4gKiAndG9TRCgpIHJvdW5kaW5nIG1vZGUgbm90IGFuIGludGVnZXI6IHtybX0nXHJcbiAqICd0b1NEKCkgcm91bmRpbmcgbW9kZSBvdXQgb2YgcmFuZ2U6IHtybX0nXHJcbiAqXHJcbiAqL1xyXG5QLnRvU2lnbmlmaWNhbnREaWdpdHMgPSBQLnRvU0QgPSBmdW5jdGlvbiAoc2QsIHJtKSB7XHJcbiAgdmFyIHggPSB0aGlzLFxyXG4gICAgQ3RvciA9IHguY29uc3RydWN0b3I7XHJcblxyXG4gIGlmIChzZCA9PT0gdm9pZCAwKSB7XHJcbiAgICBzZCA9IEN0b3IucHJlY2lzaW9uO1xyXG4gICAgcm0gPSBDdG9yLnJvdW5kaW5nO1xyXG4gIH0gZWxzZSB7XHJcbiAgICBjaGVja0ludDMyKHNkLCAxLCBNQVhfRElHSVRTKTtcclxuXHJcbiAgICBpZiAocm0gPT09IHZvaWQgMCkgcm0gPSBDdG9yLnJvdW5kaW5nO1xyXG4gICAgZWxzZSBjaGVja0ludDMyKHJtLCAwLCA4KTtcclxuICB9XHJcblxyXG4gIHJldHVybiBmaW5hbGlzZShuZXcgQ3Rvcih4KSwgc2QsIHJtKTtcclxufTtcclxuXHJcblxyXG4vKlxyXG4gKiBSZXR1cm4gYSBzdHJpbmcgcmVwcmVzZW50aW5nIHRoZSB2YWx1ZSBvZiB0aGlzIERlY2ltYWwuXHJcbiAqXHJcbiAqIFJldHVybiBleHBvbmVudGlhbCBub3RhdGlvbiBpZiB0aGlzIERlY2ltYWwgaGFzIGEgcG9zaXRpdmUgZXhwb25lbnQgZXF1YWwgdG8gb3IgZ3JlYXRlciB0aGFuXHJcbiAqIGB0b0V4cFBvc2AsIG9yIGEgbmVnYXRpdmUgZXhwb25lbnQgZXF1YWwgdG8gb3IgbGVzcyB0aGFuIGB0b0V4cE5lZ2AuXHJcbiAqXHJcbiAqL1xyXG5QLnRvU3RyaW5nID0gZnVuY3Rpb24gKCkge1xyXG4gIHZhciB4ID0gdGhpcyxcclxuICAgIEN0b3IgPSB4LmNvbnN0cnVjdG9yLFxyXG4gICAgc3RyID0gZmluaXRlVG9TdHJpbmcoeCwgeC5lIDw9IEN0b3IudG9FeHBOZWcgfHwgeC5lID49IEN0b3IudG9FeHBQb3MpO1xyXG5cclxuICByZXR1cm4geC5pc05lZygpICYmICF4LmlzWmVybygpID8gJy0nICsgc3RyIDogc3RyO1xyXG59O1xyXG5cclxuXHJcbi8qXHJcbiAqIFJldHVybiBhIG5ldyBEZWNpbWFsIHdob3NlIHZhbHVlIGlzIHRoZSB2YWx1ZSBvZiB0aGlzIERlY2ltYWwgdHJ1bmNhdGVkIHRvIGEgd2hvbGUgbnVtYmVyLlxyXG4gKlxyXG4gKi9cclxuUC50cnVuY2F0ZWQgPSBQLnRydW5jID0gZnVuY3Rpb24gKCkge1xyXG4gIHJldHVybiBmaW5hbGlzZShuZXcgdGhpcy5jb25zdHJ1Y3Rvcih0aGlzKSwgdGhpcy5lICsgMSwgMSk7XHJcbn07XHJcblxyXG5cclxuLypcclxuICogUmV0dXJuIGEgc3RyaW5nIHJlcHJlc2VudGluZyB0aGUgdmFsdWUgb2YgdGhpcyBEZWNpbWFsLlxyXG4gKiBVbmxpa2UgYHRvU3RyaW5nYCwgbmVnYXRpdmUgemVybyB3aWxsIGluY2x1ZGUgdGhlIG1pbnVzIHNpZ24uXHJcbiAqXHJcbiAqL1xyXG5QLnZhbHVlT2YgPSBQLnRvSlNPTiA9IGZ1bmN0aW9uICgpIHtcclxuICB2YXIgeCA9IHRoaXMsXHJcbiAgICBDdG9yID0geC5jb25zdHJ1Y3RvcixcclxuICAgIHN0ciA9IGZpbml0ZVRvU3RyaW5nKHgsIHguZSA8PSBDdG9yLnRvRXhwTmVnIHx8IHguZSA+PSBDdG9yLnRvRXhwUG9zKTtcclxuXHJcbiAgcmV0dXJuIHguaXNOZWcoKSA/ICctJyArIHN0ciA6IHN0cjtcclxufTtcclxuXHJcblxyXG4vLyBIZWxwZXIgZnVuY3Rpb25zIGZvciBEZWNpbWFsLnByb3RvdHlwZSAoUCkgYW5kL29yIERlY2ltYWwgbWV0aG9kcywgYW5kIHRoZWlyIGNhbGxlcnMuXHJcblxyXG5cclxuLypcclxuICogIGRpZ2l0c1RvU3RyaW5nICAgICAgICAgICBQLmN1YmVSb290LCBQLmxvZ2FyaXRobSwgUC5zcXVhcmVSb290LCBQLnRvRnJhY3Rpb24sIFAudG9Qb3dlcixcclxuICogICAgICAgICAgICAgICAgICAgICAgICAgICBmaW5pdGVUb1N0cmluZywgbmF0dXJhbEV4cG9uZW50aWFsLCBuYXR1cmFsTG9nYXJpdGhtXHJcbiAqICBjaGVja0ludDMyICAgICAgICAgICAgICAgUC50b0RlY2ltYWxQbGFjZXMsIFAudG9FeHBvbmVudGlhbCwgUC50b0ZpeGVkLCBQLnRvTmVhcmVzdCxcclxuICogICAgICAgICAgICAgICAgICAgICAgICAgICBQLnRvUHJlY2lzaW9uLCBQLnRvU2lnbmlmaWNhbnREaWdpdHMsIHRvU3RyaW5nQmluYXJ5LCByYW5kb21cclxuICogIGNoZWNrUm91bmRpbmdEaWdpdHMgICAgICBQLmxvZ2FyaXRobSwgUC50b1Bvd2VyLCBuYXR1cmFsRXhwb25lbnRpYWwsIG5hdHVyYWxMb2dhcml0aG1cclxuICogIGNvbnZlcnRCYXNlICAgICAgICAgICAgICB0b1N0cmluZ0JpbmFyeSwgcGFyc2VPdGhlclxyXG4gKiAgY29zICAgICAgICAgICAgICAgICAgICAgIFAuY29zXHJcbiAqICBkaXZpZGUgICAgICAgICAgICAgICAgICAgUC5hdGFuaCwgUC5jdWJlUm9vdCwgUC5kaXZpZGVkQnksIFAuZGl2aWRlZFRvSW50ZWdlckJ5LFxyXG4gKiAgICAgICAgICAgICAgICAgICAgICAgICAgIFAubG9nYXJpdGhtLCBQLm1vZHVsbywgUC5zcXVhcmVSb290LCBQLnRhbiwgUC50YW5oLCBQLnRvRnJhY3Rpb24sXHJcbiAqICAgICAgICAgICAgICAgICAgICAgICAgICAgUC50b05lYXJlc3QsIHRvU3RyaW5nQmluYXJ5LCBuYXR1cmFsRXhwb25lbnRpYWwsIG5hdHVyYWxMb2dhcml0aG0sXHJcbiAqICAgICAgICAgICAgICAgICAgICAgICAgICAgdGF5bG9yU2VyaWVzLCBhdGFuMiwgcGFyc2VPdGhlclxyXG4gKiAgZmluYWxpc2UgICAgICAgICAgICAgICAgIFAuYWJzb2x1dGVWYWx1ZSwgUC5hdGFuLCBQLmF0YW5oLCBQLmNlaWwsIFAuY29zLCBQLmNvc2gsXHJcbiAqICAgICAgICAgICAgICAgICAgICAgICAgICAgUC5jdWJlUm9vdCwgUC5kaXZpZGVkVG9JbnRlZ2VyQnksIFAuZmxvb3IsIFAubG9nYXJpdGhtLCBQLm1pbnVzLFxyXG4gKiAgICAgICAgICAgICAgICAgICAgICAgICAgIFAubW9kdWxvLCBQLm5lZ2F0ZWQsIFAucGx1cywgUC5yb3VuZCwgUC5zaW4sIFAuc2luaCwgUC5zcXVhcmVSb290LFxyXG4gKiAgICAgICAgICAgICAgICAgICAgICAgICAgIFAudGFuLCBQLnRpbWVzLCBQLnRvRGVjaW1hbFBsYWNlcywgUC50b0V4cG9uZW50aWFsLCBQLnRvRml4ZWQsXHJcbiAqICAgICAgICAgICAgICAgICAgICAgICAgICAgUC50b05lYXJlc3QsIFAudG9Qb3dlciwgUC50b1ByZWNpc2lvbiwgUC50b1NpZ25pZmljYW50RGlnaXRzLFxyXG4gKiAgICAgICAgICAgICAgICAgICAgICAgICAgIFAudHJ1bmNhdGVkLCBkaXZpZGUsIGdldExuMTAsIGdldFBpLCBuYXR1cmFsRXhwb25lbnRpYWwsXHJcbiAqICAgICAgICAgICAgICAgICAgICAgICAgICAgbmF0dXJhbExvZ2FyaXRobSwgY2VpbCwgZmxvb3IsIHJvdW5kLCB0cnVuY1xyXG4gKiAgZmluaXRlVG9TdHJpbmcgICAgICAgICAgIFAudG9FeHBvbmVudGlhbCwgUC50b0ZpeGVkLCBQLnRvUHJlY2lzaW9uLCBQLnRvU3RyaW5nLCBQLnZhbHVlT2YsXHJcbiAqICAgICAgICAgICAgICAgICAgICAgICAgICAgdG9TdHJpbmdCaW5hcnlcclxuICogIGdldEJhc2UxMEV4cG9uZW50ICAgICAgICBQLm1pbnVzLCBQLnBsdXMsIFAudGltZXMsIHBhcnNlT3RoZXJcclxuICogIGdldExuMTAgICAgICAgICAgICAgICAgICBQLmxvZ2FyaXRobSwgbmF0dXJhbExvZ2FyaXRobVxyXG4gKiAgZ2V0UGkgICAgICAgICAgICAgICAgICAgIFAuYWNvcywgUC5hc2luLCBQLmF0YW4sIHRvTGVzc1RoYW5IYWxmUGksIGF0YW4yXHJcbiAqICBnZXRQcmVjaXNpb24gICAgICAgICAgICAgUC5wcmVjaXNpb24sIFAudG9GcmFjdGlvblxyXG4gKiAgZ2V0WmVyb1N0cmluZyAgICAgICAgICAgIGRpZ2l0c1RvU3RyaW5nLCBmaW5pdGVUb1N0cmluZ1xyXG4gKiAgaW50UG93ICAgICAgICAgICAgICAgICAgIFAudG9Qb3dlciwgcGFyc2VPdGhlclxyXG4gKiAgaXNPZGQgICAgICAgICAgICAgICAgICAgIHRvTGVzc1RoYW5IYWxmUGlcclxuICogIG1heE9yTWluICAgICAgICAgICAgICAgICBtYXgsIG1pblxyXG4gKiAgbmF0dXJhbEV4cG9uZW50aWFsICAgICAgIFAubmF0dXJhbEV4cG9uZW50aWFsLCBQLnRvUG93ZXJcclxuICogIG5hdHVyYWxMb2dhcml0aG0gICAgICAgICBQLmFjb3NoLCBQLmFzaW5oLCBQLmF0YW5oLCBQLmxvZ2FyaXRobSwgUC5uYXR1cmFsTG9nYXJpdGhtLFxyXG4gKiAgICAgICAgICAgICAgICAgICAgICAgICAgIFAudG9Qb3dlciwgbmF0dXJhbEV4cG9uZW50aWFsXHJcbiAqICBub25GaW5pdGVUb1N0cmluZyAgICAgICAgZmluaXRlVG9TdHJpbmcsIHRvU3RyaW5nQmluYXJ5XHJcbiAqICBwYXJzZURlY2ltYWwgICAgICAgICAgICAgRGVjaW1hbFxyXG4gKiAgcGFyc2VPdGhlciAgICAgICAgICAgICAgIERlY2ltYWxcclxuICogIHNpbiAgICAgICAgICAgICAgICAgICAgICBQLnNpblxyXG4gKiAgdGF5bG9yU2VyaWVzICAgICAgICAgICAgIFAuY29zaCwgUC5zaW5oLCBjb3MsIHNpblxyXG4gKiAgdG9MZXNzVGhhbkhhbGZQaSAgICAgICAgIFAuY29zLCBQLnNpblxyXG4gKiAgdG9TdHJpbmdCaW5hcnkgICAgICAgICAgIFAudG9CaW5hcnksIFAudG9IZXhhZGVjaW1hbCwgUC50b09jdGFsXHJcbiAqICB0cnVuY2F0ZSAgICAgICAgICAgICAgICAgaW50UG93XHJcbiAqXHJcbiAqICBUaHJvd3M6ICAgICAgICAgICAgICAgICAgUC5sb2dhcml0aG0sIFAucHJlY2lzaW9uLCBQLnRvRnJhY3Rpb24sIGNoZWNrSW50MzIsIGdldExuMTAsIGdldFBpLFxyXG4gKiAgICAgICAgICAgICAgICAgICAgICAgICAgIG5hdHVyYWxMb2dhcml0aG0sIGNvbmZpZywgcGFyc2VPdGhlciwgcmFuZG9tLCBEZWNpbWFsXHJcbiAqL1xyXG5cclxuXHJcbmZ1bmN0aW9uIGRpZ2l0c1RvU3RyaW5nKGQpIHtcclxuICB2YXIgaSwgaywgd3MsXHJcbiAgICBpbmRleE9mTGFzdFdvcmQgPSBkLmxlbmd0aCAtIDEsXHJcbiAgICBzdHIgPSAnJyxcclxuICAgIHcgPSBkWzBdO1xyXG5cclxuICBpZiAoaW5kZXhPZkxhc3RXb3JkID4gMCkge1xyXG4gICAgc3RyICs9IHc7XHJcbiAgICBmb3IgKGkgPSAxOyBpIDwgaW5kZXhPZkxhc3RXb3JkOyBpKyspIHtcclxuICAgICAgd3MgPSBkW2ldICsgJyc7XHJcbiAgICAgIGsgPSBMT0dfQkFTRSAtIHdzLmxlbmd0aDtcclxuICAgICAgaWYgKGspIHN0ciArPSBnZXRaZXJvU3RyaW5nKGspO1xyXG4gICAgICBzdHIgKz0gd3M7XHJcbiAgICB9XHJcblxyXG4gICAgdyA9IGRbaV07XHJcbiAgICB3cyA9IHcgKyAnJztcclxuICAgIGsgPSBMT0dfQkFTRSAtIHdzLmxlbmd0aDtcclxuICAgIGlmIChrKSBzdHIgKz0gZ2V0WmVyb1N0cmluZyhrKTtcclxuICB9IGVsc2UgaWYgKHcgPT09IDApIHtcclxuICAgIHJldHVybiAnMCc7XHJcbiAgfVxyXG5cclxuICAvLyBSZW1vdmUgdHJhaWxpbmcgemVyb3Mgb2YgbGFzdCB3LlxyXG4gIGZvciAoOyB3ICUgMTAgPT09IDA7KSB3IC89IDEwO1xyXG5cclxuICByZXR1cm4gc3RyICsgdztcclxufVxyXG5cclxuXHJcbmZ1bmN0aW9uIGNoZWNrSW50MzIoaSwgbWluLCBtYXgpIHtcclxuICBpZiAoaSAhPT0gfn5pIHx8IGkgPCBtaW4gfHwgaSA+IG1heCkge1xyXG4gICAgdGhyb3cgRXJyb3IoaW52YWxpZEFyZ3VtZW50ICsgaSk7XHJcbiAgfVxyXG59XHJcblxyXG5cclxuLypcclxuICogQ2hlY2sgNSByb3VuZGluZyBkaWdpdHMgaWYgYHJlcGVhdGluZ2AgaXMgbnVsbCwgNCBvdGhlcndpc2UuXHJcbiAqIGByZXBlYXRpbmcgPT0gbnVsbGAgaWYgY2FsbGVyIGlzIGBsb2dgIG9yIGBwb3dgLFxyXG4gKiBgcmVwZWF0aW5nICE9IG51bGxgIGlmIGNhbGxlciBpcyBgbmF0dXJhbExvZ2FyaXRobWAgb3IgYG5hdHVyYWxFeHBvbmVudGlhbGAuXHJcbiAqL1xyXG5mdW5jdGlvbiBjaGVja1JvdW5kaW5nRGlnaXRzKGQsIGksIHJtLCByZXBlYXRpbmcpIHtcclxuICB2YXIgZGksIGssIHIsIHJkO1xyXG5cclxuICAvLyBHZXQgdGhlIGxlbmd0aCBvZiB0aGUgZmlyc3Qgd29yZCBvZiB0aGUgYXJyYXkgZC5cclxuICBmb3IgKGsgPSBkWzBdOyBrID49IDEwOyBrIC89IDEwKSAtLWk7XHJcblxyXG4gIC8vIElzIHRoZSByb3VuZGluZyBkaWdpdCBpbiB0aGUgZmlyc3Qgd29yZCBvZiBkP1xyXG4gIGlmICgtLWkgPCAwKSB7XHJcbiAgICBpICs9IExPR19CQVNFO1xyXG4gICAgZGkgPSAwO1xyXG4gIH0gZWxzZSB7XHJcbiAgICBkaSA9IE1hdGguY2VpbCgoaSArIDEpIC8gTE9HX0JBU0UpO1xyXG4gICAgaSAlPSBMT0dfQkFTRTtcclxuICB9XHJcblxyXG4gIC8vIGkgaXMgdGhlIGluZGV4ICgwIC0gNikgb2YgdGhlIHJvdW5kaW5nIGRpZ2l0LlxyXG4gIC8vIEUuZy4gaWYgd2l0aGluIHRoZSB3b3JkIDM0ODc1NjMgdGhlIGZpcnN0IHJvdW5kaW5nIGRpZ2l0IGlzIDUsXHJcbiAgLy8gdGhlbiBpID0gNCwgayA9IDEwMDAsIHJkID0gMzQ4NzU2MyAlIDEwMDAgPSA1NjNcclxuICBrID0gbWF0aHBvdygxMCwgTE9HX0JBU0UgLSBpKTtcclxuICByZCA9IGRbZGldICUgayB8IDA7XHJcblxyXG4gIGlmIChyZXBlYXRpbmcgPT0gbnVsbCkge1xyXG4gICAgaWYgKGkgPCAzKSB7XHJcbiAgICAgIGlmIChpID09IDApIHJkID0gcmQgLyAxMDAgfCAwO1xyXG4gICAgICBlbHNlIGlmIChpID09IDEpIHJkID0gcmQgLyAxMCB8IDA7XHJcbiAgICAgIHIgPSBybSA8IDQgJiYgcmQgPT0gOTk5OTkgfHwgcm0gPiAzICYmIHJkID09IDQ5OTk5IHx8IHJkID09IDUwMDAwIHx8IHJkID09IDA7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICByID0gKHJtIDwgNCAmJiByZCArIDEgPT0gayB8fCBybSA+IDMgJiYgcmQgKyAxID09IGsgLyAyKSAmJlxyXG4gICAgICAgIChkW2RpICsgMV0gLyBrIC8gMTAwIHwgMCkgPT0gbWF0aHBvdygxMCwgaSAtIDIpIC0gMSB8fFxyXG4gICAgICAgICAgKHJkID09IGsgLyAyIHx8IHJkID09IDApICYmIChkW2RpICsgMV0gLyBrIC8gMTAwIHwgMCkgPT0gMDtcclxuICAgIH1cclxuICB9IGVsc2Uge1xyXG4gICAgaWYgKGkgPCA0KSB7XHJcbiAgICAgIGlmIChpID09IDApIHJkID0gcmQgLyAxMDAwIHwgMDtcclxuICAgICAgZWxzZSBpZiAoaSA9PSAxKSByZCA9IHJkIC8gMTAwIHwgMDtcclxuICAgICAgZWxzZSBpZiAoaSA9PSAyKSByZCA9IHJkIC8gMTAgfCAwO1xyXG4gICAgICByID0gKHJlcGVhdGluZyB8fCBybSA8IDQpICYmIHJkID09IDk5OTkgfHwgIXJlcGVhdGluZyAmJiBybSA+IDMgJiYgcmQgPT0gNDk5OTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIHIgPSAoKHJlcGVhdGluZyB8fCBybSA8IDQpICYmIHJkICsgMSA9PSBrIHx8XHJcbiAgICAgICghcmVwZWF0aW5nICYmIHJtID4gMykgJiYgcmQgKyAxID09IGsgLyAyKSAmJlxyXG4gICAgICAgIChkW2RpICsgMV0gLyBrIC8gMTAwMCB8IDApID09IG1hdGhwb3coMTAsIGkgLSAzKSAtIDE7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICByZXR1cm4gcjtcclxufVxyXG5cclxuXHJcbi8vIENvbnZlcnQgc3RyaW5nIG9mIGBiYXNlSW5gIHRvIGFuIGFycmF5IG9mIG51bWJlcnMgb2YgYGJhc2VPdXRgLlxyXG4vLyBFZy4gY29udmVydEJhc2UoJzI1NScsIDEwLCAxNikgcmV0dXJucyBbMTUsIDE1XS5cclxuLy8gRWcuIGNvbnZlcnRCYXNlKCdmZicsIDE2LCAxMCkgcmV0dXJucyBbMiwgNSwgNV0uXHJcbmZ1bmN0aW9uIGNvbnZlcnRCYXNlKHN0ciwgYmFzZUluLCBiYXNlT3V0KSB7XHJcbiAgdmFyIGosXHJcbiAgICBhcnIgPSBbMF0sXHJcbiAgICBhcnJMLFxyXG4gICAgaSA9IDAsXHJcbiAgICBzdHJMID0gc3RyLmxlbmd0aDtcclxuXHJcbiAgZm9yICg7IGkgPCBzdHJMOykge1xyXG4gICAgZm9yIChhcnJMID0gYXJyLmxlbmd0aDsgYXJyTC0tOykgYXJyW2FyckxdICo9IGJhc2VJbjtcclxuICAgIGFyclswXSArPSBOVU1FUkFMUy5pbmRleE9mKHN0ci5jaGFyQXQoaSsrKSk7XHJcbiAgICBmb3IgKGogPSAwOyBqIDwgYXJyLmxlbmd0aDsgaisrKSB7XHJcbiAgICAgIGlmIChhcnJbal0gPiBiYXNlT3V0IC0gMSkge1xyXG4gICAgICAgIGlmIChhcnJbaiArIDFdID09PSB2b2lkIDApIGFycltqICsgMV0gPSAwO1xyXG4gICAgICAgIGFycltqICsgMV0gKz0gYXJyW2pdIC8gYmFzZU91dCB8IDA7XHJcbiAgICAgICAgYXJyW2pdICU9IGJhc2VPdXQ7XHJcbiAgICAgIH1cclxuICAgIH1cclxuICB9XHJcblxyXG4gIHJldHVybiBhcnIucmV2ZXJzZSgpO1xyXG59XHJcblxyXG5cclxuLypcclxuICogY29zKHgpID0gMSAtIHheMi8yISArIHheNC80ISAtIC4uLlxyXG4gKiB8eHwgPCBwaS8yXHJcbiAqXHJcbiAqL1xyXG5mdW5jdGlvbiBjb3NpbmUoQ3RvciwgeCkge1xyXG4gIHZhciBrLCBsZW4sIHk7XHJcblxyXG4gIGlmICh4LmlzWmVybygpKSByZXR1cm4geDtcclxuXHJcbiAgLy8gQXJndW1lbnQgcmVkdWN0aW9uOiBjb3MoNHgpID0gOCooY29zXjQoeCkgLSBjb3NeMih4KSkgKyAxXHJcbiAgLy8gaS5lLiBjb3MoeCkgPSA4Kihjb3NeNCh4LzQpIC0gY29zXjIoeC80KSkgKyAxXHJcblxyXG4gIC8vIEVzdGltYXRlIHRoZSBvcHRpbXVtIG51bWJlciBvZiB0aW1lcyB0byB1c2UgdGhlIGFyZ3VtZW50IHJlZHVjdGlvbi5cclxuICBsZW4gPSB4LmQubGVuZ3RoO1xyXG4gIGlmIChsZW4gPCAzMikge1xyXG4gICAgayA9IE1hdGguY2VpbChsZW4gLyAzKTtcclxuICAgIHkgPSAoMSAvIHRpbnlQb3coNCwgaykpLnRvU3RyaW5nKCk7XHJcbiAgfSBlbHNlIHtcclxuICAgIGsgPSAxNjtcclxuICAgIHkgPSAnMi4zMjgzMDY0MzY1Mzg2OTYyODkwNjI1ZS0xMCc7XHJcbiAgfVxyXG5cclxuICBDdG9yLnByZWNpc2lvbiArPSBrO1xyXG5cclxuICB4ID0gdGF5bG9yU2VyaWVzKEN0b3IsIDEsIHgudGltZXMoeSksIG5ldyBDdG9yKDEpKTtcclxuXHJcbiAgLy8gUmV2ZXJzZSBhcmd1bWVudCByZWR1Y3Rpb25cclxuICBmb3IgKHZhciBpID0gazsgaS0tOykge1xyXG4gICAgdmFyIGNvczJ4ID0geC50aW1lcyh4KTtcclxuICAgIHggPSBjb3MyeC50aW1lcyhjb3MyeCkubWludXMoY29zMngpLnRpbWVzKDgpLnBsdXMoMSk7XHJcbiAgfVxyXG5cclxuICBDdG9yLnByZWNpc2lvbiAtPSBrO1xyXG5cclxuICByZXR1cm4geDtcclxufVxyXG5cclxuXHJcbi8qXHJcbiAqIFBlcmZvcm0gZGl2aXNpb24gaW4gdGhlIHNwZWNpZmllZCBiYXNlLlxyXG4gKi9cclxudmFyIGRpdmlkZSA9IChmdW5jdGlvbiAoKSB7XHJcblxyXG4gIC8vIEFzc3VtZXMgbm9uLXplcm8geCBhbmQgaywgYW5kIGhlbmNlIG5vbi16ZXJvIHJlc3VsdC5cclxuICBmdW5jdGlvbiBtdWx0aXBseUludGVnZXIoeCwgaywgYmFzZSkge1xyXG4gICAgdmFyIHRlbXAsXHJcbiAgICAgIGNhcnJ5ID0gMCxcclxuICAgICAgaSA9IHgubGVuZ3RoO1xyXG5cclxuICAgIGZvciAoeCA9IHguc2xpY2UoKTsgaS0tOykge1xyXG4gICAgICB0ZW1wID0geFtpXSAqIGsgKyBjYXJyeTtcclxuICAgICAgeFtpXSA9IHRlbXAgJSBiYXNlIHwgMDtcclxuICAgICAgY2FycnkgPSB0ZW1wIC8gYmFzZSB8IDA7XHJcbiAgICB9XHJcblxyXG4gICAgaWYgKGNhcnJ5KSB4LnVuc2hpZnQoY2FycnkpO1xyXG5cclxuICAgIHJldHVybiB4O1xyXG4gIH1cclxuXHJcbiAgZnVuY3Rpb24gY29tcGFyZShhLCBiLCBhTCwgYkwpIHtcclxuICAgIHZhciBpLCByO1xyXG5cclxuICAgIGlmIChhTCAhPSBiTCkge1xyXG4gICAgICByID0gYUwgPiBiTCA/IDEgOiAtMTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIGZvciAoaSA9IHIgPSAwOyBpIDwgYUw7IGkrKykge1xyXG4gICAgICAgIGlmIChhW2ldICE9IGJbaV0pIHtcclxuICAgICAgICAgIHIgPSBhW2ldID4gYltpXSA/IDEgOiAtMTtcclxuICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiByO1xyXG4gIH1cclxuXHJcbiAgZnVuY3Rpb24gc3VidHJhY3QoYSwgYiwgYUwsIGJhc2UpIHtcclxuICAgIHZhciBpID0gMDtcclxuXHJcbiAgICAvLyBTdWJ0cmFjdCBiIGZyb20gYS5cclxuICAgIGZvciAoOyBhTC0tOykge1xyXG4gICAgICBhW2FMXSAtPSBpO1xyXG4gICAgICBpID0gYVthTF0gPCBiW2FMXSA/IDEgOiAwO1xyXG4gICAgICBhW2FMXSA9IGkgKiBiYXNlICsgYVthTF0gLSBiW2FMXTtcclxuICAgIH1cclxuXHJcbiAgICAvLyBSZW1vdmUgbGVhZGluZyB6ZXJvcy5cclxuICAgIGZvciAoOyAhYVswXSAmJiBhLmxlbmd0aCA+IDE7KSBhLnNoaWZ0KCk7XHJcbiAgfVxyXG5cclxuICByZXR1cm4gZnVuY3Rpb24gKHgsIHksIHByLCBybSwgZHAsIGJhc2UpIHtcclxuICAgIHZhciBjbXAsIGUsIGksIGssIGxvZ0Jhc2UsIG1vcmUsIHByb2QsIHByb2RMLCBxLCBxZCwgcmVtLCByZW1MLCByZW0wLCBzZCwgdCwgeGksIHhMLCB5ZDAsXHJcbiAgICAgIHlMLCB5eixcclxuICAgICAgQ3RvciA9IHguY29uc3RydWN0b3IsXHJcbiAgICAgIHNpZ24gPSB4LnMgPT0geS5zID8gMSA6IC0xLFxyXG4gICAgICB4ZCA9IHguZCxcclxuICAgICAgeWQgPSB5LmQ7XHJcblxyXG4gICAgLy8gRWl0aGVyIE5hTiwgSW5maW5pdHkgb3IgMD9cclxuICAgIGlmICgheGQgfHwgIXhkWzBdIHx8ICF5ZCB8fCAheWRbMF0pIHtcclxuXHJcbiAgICAgIHJldHVybiBuZXcgQ3RvcigvLyBSZXR1cm4gTmFOIGlmIGVpdGhlciBOYU4sIG9yIGJvdGggSW5maW5pdHkgb3IgMC5cclxuICAgICAgICAheC5zIHx8ICF5LnMgfHwgKHhkID8geWQgJiYgeGRbMF0gPT0geWRbMF0gOiAheWQpID8gTmFOIDpcclxuXHJcbiAgICAgICAgLy8gUmV0dXJuIFx1MDBCMTAgaWYgeCBpcyAwIG9yIHkgaXMgXHUwMEIxSW5maW5pdHksIG9yIHJldHVybiBcdTAwQjFJbmZpbml0eSBhcyB5IGlzIDAuXHJcbiAgICAgICAgeGQgJiYgeGRbMF0gPT0gMCB8fCAheWQgPyBzaWduICogMCA6IHNpZ24gLyAwKTtcclxuICAgIH1cclxuXHJcbiAgICBpZiAoYmFzZSkge1xyXG4gICAgICBsb2dCYXNlID0gMTtcclxuICAgICAgZSA9IHguZSAtIHkuZTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIGJhc2UgPSBCQVNFO1xyXG4gICAgICBsb2dCYXNlID0gTE9HX0JBU0U7XHJcbiAgICAgIGUgPSBtYXRoZmxvb3IoeC5lIC8gbG9nQmFzZSkgLSBtYXRoZmxvb3IoeS5lIC8gbG9nQmFzZSk7XHJcbiAgICB9XHJcblxyXG4gICAgeUwgPSB5ZC5sZW5ndGg7XHJcbiAgICB4TCA9IHhkLmxlbmd0aDtcclxuICAgIHEgPSBuZXcgQ3RvcihzaWduKTtcclxuICAgIHFkID0gcS5kID0gW107XHJcblxyXG4gICAgLy8gUmVzdWx0IGV4cG9uZW50IG1heSBiZSBvbmUgbGVzcyB0aGFuIGUuXHJcbiAgICAvLyBUaGUgZGlnaXQgYXJyYXkgb2YgYSBEZWNpbWFsIGZyb20gdG9TdHJpbmdCaW5hcnkgbWF5IGhhdmUgdHJhaWxpbmcgemVyb3MuXHJcbiAgICBmb3IgKGkgPSAwOyB5ZFtpXSA9PSAoeGRbaV0gfHwgMCk7IGkrKyk7XHJcblxyXG4gICAgaWYgKHlkW2ldID4gKHhkW2ldIHx8IDApKSBlLS07XHJcblxyXG4gICAgaWYgKHByID09IG51bGwpIHtcclxuICAgICAgc2QgPSBwciA9IEN0b3IucHJlY2lzaW9uO1xyXG4gICAgICBybSA9IEN0b3Iucm91bmRpbmc7XHJcbiAgICB9IGVsc2UgaWYgKGRwKSB7XHJcbiAgICAgIHNkID0gcHIgKyAoeC5lIC0geS5lKSArIDE7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICBzZCA9IHByO1xyXG4gICAgfVxyXG5cclxuICAgIGlmIChzZCA8IDApIHtcclxuICAgICAgcWQucHVzaCgxKTtcclxuICAgICAgbW9yZSA9IHRydWU7XHJcbiAgICB9IGVsc2Uge1xyXG5cclxuICAgICAgLy8gQ29udmVydCBwcmVjaXNpb24gaW4gbnVtYmVyIG9mIGJhc2UgMTAgZGlnaXRzIHRvIGJhc2UgMWU3IGRpZ2l0cy5cclxuICAgICAgc2QgPSBzZCAvIGxvZ0Jhc2UgKyAyIHwgMDtcclxuICAgICAgaSA9IDA7XHJcblxyXG4gICAgICAvLyBkaXZpc29yIDwgMWU3XHJcbiAgICAgIGlmICh5TCA9PSAxKSB7XHJcbiAgICAgICAgayA9IDA7XHJcbiAgICAgICAgeWQgPSB5ZFswXTtcclxuICAgICAgICBzZCsrO1xyXG5cclxuICAgICAgICAvLyBrIGlzIHRoZSBjYXJyeS5cclxuICAgICAgICBmb3IgKDsgKGkgPCB4TCB8fCBrKSAmJiBzZC0tOyBpKyspIHtcclxuICAgICAgICAgIHQgPSBrICogYmFzZSArICh4ZFtpXSB8fCAwKTtcclxuICAgICAgICAgIHFkW2ldID0gdCAvIHlkIHwgMDtcclxuICAgICAgICAgIGsgPSB0ICUgeWQgfCAwO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgbW9yZSA9IGsgfHwgaSA8IHhMO1xyXG5cclxuICAgICAgLy8gZGl2aXNvciA+PSAxZTdcclxuICAgICAgfSBlbHNlIHtcclxuXHJcbiAgICAgICAgLy8gTm9ybWFsaXNlIHhkIGFuZCB5ZCBzbyBoaWdoZXN0IG9yZGVyIGRpZ2l0IG9mIHlkIGlzID49IGJhc2UvMlxyXG4gICAgICAgIGsgPSBiYXNlIC8gKHlkWzBdICsgMSkgfCAwO1xyXG5cclxuICAgICAgICBpZiAoayA+IDEpIHtcclxuICAgICAgICAgIHlkID0gbXVsdGlwbHlJbnRlZ2VyKHlkLCBrLCBiYXNlKTtcclxuICAgICAgICAgIHhkID0gbXVsdGlwbHlJbnRlZ2VyKHhkLCBrLCBiYXNlKTtcclxuICAgICAgICAgIHlMID0geWQubGVuZ3RoO1xyXG4gICAgICAgICAgeEwgPSB4ZC5sZW5ndGg7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB4aSA9IHlMO1xyXG4gICAgICAgIHJlbSA9IHhkLnNsaWNlKDAsIHlMKTtcclxuICAgICAgICByZW1MID0gcmVtLmxlbmd0aDtcclxuXHJcbiAgICAgICAgLy8gQWRkIHplcm9zIHRvIG1ha2UgcmVtYWluZGVyIGFzIGxvbmcgYXMgZGl2aXNvci5cclxuICAgICAgICBmb3IgKDsgcmVtTCA8IHlMOykgcmVtW3JlbUwrK10gPSAwO1xyXG5cclxuICAgICAgICB5eiA9IHlkLnNsaWNlKCk7XHJcbiAgICAgICAgeXoudW5zaGlmdCgwKTtcclxuICAgICAgICB5ZDAgPSB5ZFswXTtcclxuXHJcbiAgICAgICAgaWYgKHlkWzFdID49IGJhc2UgLyAyKSArK3lkMDtcclxuXHJcbiAgICAgICAgZG8ge1xyXG4gICAgICAgICAgayA9IDA7XHJcblxyXG4gICAgICAgICAgLy8gQ29tcGFyZSBkaXZpc29yIGFuZCByZW1haW5kZXIuXHJcbiAgICAgICAgICBjbXAgPSBjb21wYXJlKHlkLCByZW0sIHlMLCByZW1MKTtcclxuXHJcbiAgICAgICAgICAvLyBJZiBkaXZpc29yIDwgcmVtYWluZGVyLlxyXG4gICAgICAgICAgaWYgKGNtcCA8IDApIHtcclxuXHJcbiAgICAgICAgICAgIC8vIENhbGN1bGF0ZSB0cmlhbCBkaWdpdCwgay5cclxuICAgICAgICAgICAgcmVtMCA9IHJlbVswXTtcclxuICAgICAgICAgICAgaWYgKHlMICE9IHJlbUwpIHJlbTAgPSByZW0wICogYmFzZSArIChyZW1bMV0gfHwgMCk7XHJcblxyXG4gICAgICAgICAgICAvLyBrIHdpbGwgYmUgaG93IG1hbnkgdGltZXMgdGhlIGRpdmlzb3IgZ29lcyBpbnRvIHRoZSBjdXJyZW50IHJlbWFpbmRlci5cclxuICAgICAgICAgICAgayA9IHJlbTAgLyB5ZDAgfCAwO1xyXG5cclxuICAgICAgICAgICAgLy8gIEFsZ29yaXRobTpcclxuICAgICAgICAgICAgLy8gIDEuIHByb2R1Y3QgPSBkaXZpc29yICogdHJpYWwgZGlnaXQgKGspXHJcbiAgICAgICAgICAgIC8vICAyLiBpZiBwcm9kdWN0ID4gcmVtYWluZGVyOiBwcm9kdWN0IC09IGRpdmlzb3IsIGstLVxyXG4gICAgICAgICAgICAvLyAgMy4gcmVtYWluZGVyIC09IHByb2R1Y3RcclxuICAgICAgICAgICAgLy8gIDQuIGlmIHByb2R1Y3Qgd2FzIDwgcmVtYWluZGVyIGF0IDI6XHJcbiAgICAgICAgICAgIC8vICAgIDUuIGNvbXBhcmUgbmV3IHJlbWFpbmRlciBhbmQgZGl2aXNvclxyXG4gICAgICAgICAgICAvLyAgICA2LiBJZiByZW1haW5kZXIgPiBkaXZpc29yOiByZW1haW5kZXIgLT0gZGl2aXNvciwgaysrXHJcblxyXG4gICAgICAgICAgICBpZiAoayA+IDEpIHtcclxuICAgICAgICAgICAgICBpZiAoayA+PSBiYXNlKSBrID0gYmFzZSAtIDE7XHJcblxyXG4gICAgICAgICAgICAgIC8vIHByb2R1Y3QgPSBkaXZpc29yICogdHJpYWwgZGlnaXQuXHJcbiAgICAgICAgICAgICAgcHJvZCA9IG11bHRpcGx5SW50ZWdlcih5ZCwgaywgYmFzZSk7XHJcbiAgICAgICAgICAgICAgcHJvZEwgPSBwcm9kLmxlbmd0aDtcclxuICAgICAgICAgICAgICByZW1MID0gcmVtLmxlbmd0aDtcclxuXHJcbiAgICAgICAgICAgICAgLy8gQ29tcGFyZSBwcm9kdWN0IGFuZCByZW1haW5kZXIuXHJcbiAgICAgICAgICAgICAgY21wID0gY29tcGFyZShwcm9kLCByZW0sIHByb2RMLCByZW1MKTtcclxuXHJcbiAgICAgICAgICAgICAgLy8gcHJvZHVjdCA+IHJlbWFpbmRlci5cclxuICAgICAgICAgICAgICBpZiAoY21wID09IDEpIHtcclxuICAgICAgICAgICAgICAgIGstLTtcclxuXHJcbiAgICAgICAgICAgICAgICAvLyBTdWJ0cmFjdCBkaXZpc29yIGZyb20gcHJvZHVjdC5cclxuICAgICAgICAgICAgICAgIHN1YnRyYWN0KHByb2QsIHlMIDwgcHJvZEwgPyB5eiA6IHlkLCBwcm9kTCwgYmFzZSk7XHJcbiAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG5cclxuICAgICAgICAgICAgICAvLyBjbXAgaXMgLTEuXHJcbiAgICAgICAgICAgICAgLy8gSWYgayBpcyAwLCB0aGVyZSBpcyBubyBuZWVkIHRvIGNvbXBhcmUgeWQgYW5kIHJlbSBhZ2FpbiBiZWxvdywgc28gY2hhbmdlIGNtcCB0byAxXHJcbiAgICAgICAgICAgICAgLy8gdG8gYXZvaWQgaXQuIElmIGsgaXMgMSB0aGVyZSBpcyBhIG5lZWQgdG8gY29tcGFyZSB5ZCBhbmQgcmVtIGFnYWluIGJlbG93LlxyXG4gICAgICAgICAgICAgIGlmIChrID09IDApIGNtcCA9IGsgPSAxO1xyXG4gICAgICAgICAgICAgIHByb2QgPSB5ZC5zbGljZSgpO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBwcm9kTCA9IHByb2QubGVuZ3RoO1xyXG4gICAgICAgICAgICBpZiAocHJvZEwgPCByZW1MKSBwcm9kLnVuc2hpZnQoMCk7XHJcblxyXG4gICAgICAgICAgICAvLyBTdWJ0cmFjdCBwcm9kdWN0IGZyb20gcmVtYWluZGVyLlxyXG4gICAgICAgICAgICBzdWJ0cmFjdChyZW0sIHByb2QsIHJlbUwsIGJhc2UpO1xyXG5cclxuICAgICAgICAgICAgLy8gSWYgcHJvZHVjdCB3YXMgPCBwcmV2aW91cyByZW1haW5kZXIuXHJcbiAgICAgICAgICAgIGlmIChjbXAgPT0gLTEpIHtcclxuICAgICAgICAgICAgICByZW1MID0gcmVtLmxlbmd0aDtcclxuXHJcbiAgICAgICAgICAgICAgLy8gQ29tcGFyZSBkaXZpc29yIGFuZCBuZXcgcmVtYWluZGVyLlxyXG4gICAgICAgICAgICAgIGNtcCA9IGNvbXBhcmUoeWQsIHJlbSwgeUwsIHJlbUwpO1xyXG5cclxuICAgICAgICAgICAgICAvLyBJZiBkaXZpc29yIDwgbmV3IHJlbWFpbmRlciwgc3VidHJhY3QgZGl2aXNvciBmcm9tIHJlbWFpbmRlci5cclxuICAgICAgICAgICAgICBpZiAoY21wIDwgMSkge1xyXG4gICAgICAgICAgICAgICAgaysrO1xyXG5cclxuICAgICAgICAgICAgICAgIC8vIFN1YnRyYWN0IGRpdmlzb3IgZnJvbSByZW1haW5kZXIuXHJcbiAgICAgICAgICAgICAgICBzdWJ0cmFjdChyZW0sIHlMIDwgcmVtTCA/IHl6IDogeWQsIHJlbUwsIGJhc2UpO1xyXG4gICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgcmVtTCA9IHJlbS5sZW5ndGg7XHJcbiAgICAgICAgICB9IGVsc2UgaWYgKGNtcCA9PT0gMCkge1xyXG4gICAgICAgICAgICBrKys7XHJcbiAgICAgICAgICAgIHJlbSA9IFswXTtcclxuICAgICAgICAgIH0gICAgLy8gaWYgY21wID09PSAxLCBrIHdpbGwgYmUgMFxyXG5cclxuICAgICAgICAgIC8vIEFkZCB0aGUgbmV4dCBkaWdpdCwgaywgdG8gdGhlIHJlc3VsdCBhcnJheS5cclxuICAgICAgICAgIHFkW2krK10gPSBrO1xyXG5cclxuICAgICAgICAgIC8vIFVwZGF0ZSB0aGUgcmVtYWluZGVyLlxyXG4gICAgICAgICAgaWYgKGNtcCAmJiByZW1bMF0pIHtcclxuICAgICAgICAgICAgcmVtW3JlbUwrK10gPSB4ZFt4aV0gfHwgMDtcclxuICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHJlbSA9IFt4ZFt4aV1dO1xyXG4gICAgICAgICAgICByZW1MID0gMTtcclxuICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgfSB3aGlsZSAoKHhpKysgPCB4TCB8fCByZW1bMF0gIT09IHZvaWQgMCkgJiYgc2QtLSk7XHJcblxyXG4gICAgICAgIG1vcmUgPSByZW1bMF0gIT09IHZvaWQgMDtcclxuICAgICAgfVxyXG5cclxuICAgICAgLy8gTGVhZGluZyB6ZXJvP1xyXG4gICAgICBpZiAoIXFkWzBdKSBxZC5zaGlmdCgpO1xyXG4gICAgfVxyXG5cclxuICAgIC8vIGxvZ0Jhc2UgaXMgMSB3aGVuIGRpdmlkZSBpcyBiZWluZyB1c2VkIGZvciBiYXNlIGNvbnZlcnNpb24uXHJcbiAgICBpZiAobG9nQmFzZSA9PSAxKSB7XHJcbiAgICAgIHEuZSA9IGU7XHJcbiAgICAgIGluZXhhY3QgPSBtb3JlO1xyXG4gICAgfSBlbHNlIHtcclxuXHJcbiAgICAgIC8vIFRvIGNhbGN1bGF0ZSBxLmUsIGZpcnN0IGdldCB0aGUgbnVtYmVyIG9mIGRpZ2l0cyBvZiBxZFswXS5cclxuICAgICAgZm9yIChpID0gMSwgayA9IHFkWzBdOyBrID49IDEwOyBrIC89IDEwKSBpKys7XHJcbiAgICAgIHEuZSA9IGkgKyBlICogbG9nQmFzZSAtIDE7XHJcblxyXG4gICAgICBmaW5hbGlzZShxLCBkcCA/IHByICsgcS5lICsgMSA6IHByLCBybSwgbW9yZSk7XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIHE7XHJcbiAgfTtcclxufSkoKTtcclxuXHJcblxyXG4vKlxyXG4gKiBSb3VuZCBgeGAgdG8gYHNkYCBzaWduaWZpY2FudCBkaWdpdHMgdXNpbmcgcm91bmRpbmcgbW9kZSBgcm1gLlxyXG4gKiBDaGVjayBmb3Igb3Zlci91bmRlci1mbG93LlxyXG4gKi9cclxuIGZ1bmN0aW9uIGZpbmFsaXNlKHgsIHNkLCBybSwgaXNUcnVuY2F0ZWQpIHtcclxuICB2YXIgZGlnaXRzLCBpLCBqLCBrLCByZCwgcm91bmRVcCwgdywgeGQsIHhkaSxcclxuICAgIEN0b3IgPSB4LmNvbnN0cnVjdG9yO1xyXG5cclxuICAvLyBEb24ndCByb3VuZCBpZiBzZCBpcyBudWxsIG9yIHVuZGVmaW5lZC5cclxuICBvdXQ6IGlmIChzZCAhPSBudWxsKSB7XHJcbiAgICB4ZCA9IHguZDtcclxuXHJcbiAgICAvLyBJbmZpbml0eS9OYU4uXHJcbiAgICBpZiAoIXhkKSByZXR1cm4geDtcclxuXHJcbiAgICAvLyByZDogdGhlIHJvdW5kaW5nIGRpZ2l0LCBpLmUuIHRoZSBkaWdpdCBhZnRlciB0aGUgZGlnaXQgdGhhdCBtYXkgYmUgcm91bmRlZCB1cC5cclxuICAgIC8vIHc6IHRoZSB3b3JkIG9mIHhkIGNvbnRhaW5pbmcgcmQsIGEgYmFzZSAxZTcgbnVtYmVyLlxyXG4gICAgLy8geGRpOiB0aGUgaW5kZXggb2YgdyB3aXRoaW4geGQuXHJcbiAgICAvLyBkaWdpdHM6IHRoZSBudW1iZXIgb2YgZGlnaXRzIG9mIHcuXHJcbiAgICAvLyBpOiB3aGF0IHdvdWxkIGJlIHRoZSBpbmRleCBvZiByZCB3aXRoaW4gdyBpZiBhbGwgdGhlIG51bWJlcnMgd2VyZSA3IGRpZ2l0cyBsb25nIChpLmUuIGlmXHJcbiAgICAvLyB0aGV5IGhhZCBsZWFkaW5nIHplcm9zKVxyXG4gICAgLy8gajogaWYgPiAwLCB0aGUgYWN0dWFsIGluZGV4IG9mIHJkIHdpdGhpbiB3IChpZiA8IDAsIHJkIGlzIGEgbGVhZGluZyB6ZXJvKS5cclxuXHJcbiAgICAvLyBHZXQgdGhlIGxlbmd0aCBvZiB0aGUgZmlyc3Qgd29yZCBvZiB0aGUgZGlnaXRzIGFycmF5IHhkLlxyXG4gICAgZm9yIChkaWdpdHMgPSAxLCBrID0geGRbMF07IGsgPj0gMTA7IGsgLz0gMTApIGRpZ2l0cysrO1xyXG4gICAgaSA9IHNkIC0gZGlnaXRzO1xyXG5cclxuICAgIC8vIElzIHRoZSByb3VuZGluZyBkaWdpdCBpbiB0aGUgZmlyc3Qgd29yZCBvZiB4ZD9cclxuICAgIGlmIChpIDwgMCkge1xyXG4gICAgICBpICs9IExPR19CQVNFO1xyXG4gICAgICBqID0gc2Q7XHJcbiAgICAgIHcgPSB4ZFt4ZGkgPSAwXTtcclxuXHJcbiAgICAgIC8vIEdldCB0aGUgcm91bmRpbmcgZGlnaXQgYXQgaW5kZXggaiBvZiB3LlxyXG4gICAgICByZCA9IHcgLyBtYXRocG93KDEwLCBkaWdpdHMgLSBqIC0gMSkgJSAxMCB8IDA7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICB4ZGkgPSBNYXRoLmNlaWwoKGkgKyAxKSAvIExPR19CQVNFKTtcclxuICAgICAgayA9IHhkLmxlbmd0aDtcclxuICAgICAgaWYgKHhkaSA+PSBrKSB7XHJcbiAgICAgICAgaWYgKGlzVHJ1bmNhdGVkKSB7XHJcblxyXG4gICAgICAgICAgLy8gTmVlZGVkIGJ5IGBuYXR1cmFsRXhwb25lbnRpYWxgLCBgbmF0dXJhbExvZ2FyaXRobWAgYW5kIGBzcXVhcmVSb290YC5cclxuICAgICAgICAgIGZvciAoOyBrKysgPD0geGRpOykgeGQucHVzaCgwKTtcclxuICAgICAgICAgIHcgPSByZCA9IDA7XHJcbiAgICAgICAgICBkaWdpdHMgPSAxO1xyXG4gICAgICAgICAgaSAlPSBMT0dfQkFTRTtcclxuICAgICAgICAgIGogPSBpIC0gTE9HX0JBU0UgKyAxO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICBicmVhayBvdXQ7XHJcbiAgICAgICAgfVxyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIHcgPSBrID0geGRbeGRpXTtcclxuXHJcbiAgICAgICAgLy8gR2V0IHRoZSBudW1iZXIgb2YgZGlnaXRzIG9mIHcuXHJcbiAgICAgICAgZm9yIChkaWdpdHMgPSAxOyBrID49IDEwOyBrIC89IDEwKSBkaWdpdHMrKztcclxuXHJcbiAgICAgICAgLy8gR2V0IHRoZSBpbmRleCBvZiByZCB3aXRoaW4gdy5cclxuICAgICAgICBpICU9IExPR19CQVNFO1xyXG5cclxuICAgICAgICAvLyBHZXQgdGhlIGluZGV4IG9mIHJkIHdpdGhpbiB3LCBhZGp1c3RlZCBmb3IgbGVhZGluZyB6ZXJvcy5cclxuICAgICAgICAvLyBUaGUgbnVtYmVyIG9mIGxlYWRpbmcgemVyb3Mgb2YgdyBpcyBnaXZlbiBieSBMT0dfQkFTRSAtIGRpZ2l0cy5cclxuICAgICAgICBqID0gaSAtIExPR19CQVNFICsgZGlnaXRzO1xyXG5cclxuICAgICAgICAvLyBHZXQgdGhlIHJvdW5kaW5nIGRpZ2l0IGF0IGluZGV4IGogb2Ygdy5cclxuICAgICAgICByZCA9IGogPCAwID8gMCA6IHcgLyBtYXRocG93KDEwLCBkaWdpdHMgLSBqIC0gMSkgJSAxMCB8IDA7XHJcbiAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICAvLyBBcmUgdGhlcmUgYW55IG5vbi16ZXJvIGRpZ2l0cyBhZnRlciB0aGUgcm91bmRpbmcgZGlnaXQ/XHJcbiAgICBpc1RydW5jYXRlZCA9IGlzVHJ1bmNhdGVkIHx8IHNkIDwgMCB8fFxyXG4gICAgICB4ZFt4ZGkgKyAxXSAhPT0gdm9pZCAwIHx8IChqIDwgMCA/IHcgOiB3ICUgbWF0aHBvdygxMCwgZGlnaXRzIC0gaiAtIDEpKTtcclxuXHJcbiAgICAvLyBUaGUgZXhwcmVzc2lvbiBgdyAlIG1hdGhwb3coMTAsIGRpZ2l0cyAtIGogLSAxKWAgcmV0dXJucyBhbGwgdGhlIGRpZ2l0cyBvZiB3IHRvIHRoZSByaWdodFxyXG4gICAgLy8gb2YgdGhlIGRpZ2l0IGF0IChsZWZ0LXRvLXJpZ2h0KSBpbmRleCBqLCBlLmcuIGlmIHcgaXMgOTA4NzE0IGFuZCBqIGlzIDIsIHRoZSBleHByZXNzaW9uXHJcbiAgICAvLyB3aWxsIGdpdmUgNzE0LlxyXG5cclxuICAgIHJvdW5kVXAgPSBybSA8IDRcclxuICAgICAgPyAocmQgfHwgaXNUcnVuY2F0ZWQpICYmIChybSA9PSAwIHx8IHJtID09ICh4LnMgPCAwID8gMyA6IDIpKVxyXG4gICAgICA6IHJkID4gNSB8fCByZCA9PSA1ICYmIChybSA9PSA0IHx8IGlzVHJ1bmNhdGVkIHx8IHJtID09IDYgJiZcclxuXHJcbiAgICAgICAgLy8gQ2hlY2sgd2hldGhlciB0aGUgZGlnaXQgdG8gdGhlIGxlZnQgb2YgdGhlIHJvdW5kaW5nIGRpZ2l0IGlzIG9kZC5cclxuICAgICAgICAoKGkgPiAwID8gaiA+IDAgPyB3IC8gbWF0aHBvdygxMCwgZGlnaXRzIC0gaikgOiAwIDogeGRbeGRpIC0gMV0pICUgMTApICYgMSB8fFxyXG4gICAgICAgICAgcm0gPT0gKHgucyA8IDAgPyA4IDogNykpO1xyXG5cclxuICAgIGlmIChzZCA8IDEgfHwgIXhkWzBdKSB7XHJcbiAgICAgIHhkLmxlbmd0aCA9IDA7XHJcbiAgICAgIGlmIChyb3VuZFVwKSB7XHJcblxyXG4gICAgICAgIC8vIENvbnZlcnQgc2QgdG8gZGVjaW1hbCBwbGFjZXMuXHJcbiAgICAgICAgc2QgLT0geC5lICsgMTtcclxuXHJcbiAgICAgICAgLy8gMSwgMC4xLCAwLjAxLCAwLjAwMSwgMC4wMDAxIGV0Yy5cclxuICAgICAgICB4ZFswXSA9IG1hdGhwb3coMTAsIChMT0dfQkFTRSAtIHNkICUgTE9HX0JBU0UpICUgTE9HX0JBU0UpO1xyXG4gICAgICAgIHguZSA9IC1zZCB8fCAwO1xyXG4gICAgICB9IGVsc2Uge1xyXG5cclxuICAgICAgICAvLyBaZXJvLlxyXG4gICAgICAgIHhkWzBdID0geC5lID0gMDtcclxuICAgICAgfVxyXG5cclxuICAgICAgcmV0dXJuIHg7XHJcbiAgICB9XHJcblxyXG4gICAgLy8gUmVtb3ZlIGV4Y2VzcyBkaWdpdHMuXHJcbiAgICBpZiAoaSA9PSAwKSB7XHJcbiAgICAgIHhkLmxlbmd0aCA9IHhkaTtcclxuICAgICAgayA9IDE7XHJcbiAgICAgIHhkaS0tO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgeGQubGVuZ3RoID0geGRpICsgMTtcclxuICAgICAgayA9IG1hdGhwb3coMTAsIExPR19CQVNFIC0gaSk7XHJcblxyXG4gICAgICAvLyBFLmcuIDU2NzAwIGJlY29tZXMgNTYwMDAgaWYgNyBpcyB0aGUgcm91bmRpbmcgZGlnaXQuXHJcbiAgICAgIC8vIGogPiAwIG1lYW5zIGkgPiBudW1iZXIgb2YgbGVhZGluZyB6ZXJvcyBvZiB3LlxyXG4gICAgICB4ZFt4ZGldID0gaiA+IDAgPyAodyAvIG1hdGhwb3coMTAsIGRpZ2l0cyAtIGopICUgbWF0aHBvdygxMCwgaikgfCAwKSAqIGsgOiAwO1xyXG4gICAgfVxyXG5cclxuICAgIGlmIChyb3VuZFVwKSB7XHJcbiAgICAgIGZvciAoOzspIHtcclxuXHJcbiAgICAgICAgLy8gSXMgdGhlIGRpZ2l0IHRvIGJlIHJvdW5kZWQgdXAgaW4gdGhlIGZpcnN0IHdvcmQgb2YgeGQ/XHJcbiAgICAgICAgaWYgKHhkaSA9PSAwKSB7XHJcblxyXG4gICAgICAgICAgLy8gaSB3aWxsIGJlIHRoZSBsZW5ndGggb2YgeGRbMF0gYmVmb3JlIGsgaXMgYWRkZWQuXHJcbiAgICAgICAgICBmb3IgKGkgPSAxLCBqID0geGRbMF07IGogPj0gMTA7IGogLz0gMTApIGkrKztcclxuICAgICAgICAgIGogPSB4ZFswXSArPSBrO1xyXG4gICAgICAgICAgZm9yIChrID0gMTsgaiA+PSAxMDsgaiAvPSAxMCkgaysrO1xyXG5cclxuICAgICAgICAgIC8vIGlmIGkgIT0gayB0aGUgbGVuZ3RoIGhhcyBpbmNyZWFzZWQuXHJcbiAgICAgICAgICBpZiAoaSAhPSBrKSB7XHJcbiAgICAgICAgICAgIHguZSsrO1xyXG4gICAgICAgICAgICBpZiAoeGRbMF0gPT0gQkFTRSkgeGRbMF0gPSAxO1xyXG4gICAgICAgICAgfVxyXG5cclxuICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICB4ZFt4ZGldICs9IGs7XHJcbiAgICAgICAgICBpZiAoeGRbeGRpXSAhPSBCQVNFKSBicmVhaztcclxuICAgICAgICAgIHhkW3hkaS0tXSA9IDA7XHJcbiAgICAgICAgICBrID0gMTtcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICAvLyBSZW1vdmUgdHJhaWxpbmcgemVyb3MuXHJcbiAgICBmb3IgKGkgPSB4ZC5sZW5ndGg7IHhkWy0taV0gPT09IDA7KSB4ZC5wb3AoKTtcclxuICB9XHJcblxyXG4gIGlmIChleHRlcm5hbCkge1xyXG5cclxuICAgIC8vIE92ZXJmbG93P1xyXG4gICAgaWYgKHguZSA+IEN0b3IubWF4RSkge1xyXG5cclxuICAgICAgLy8gSW5maW5pdHkuXHJcbiAgICAgIHguZCA9IG51bGw7XHJcbiAgICAgIHguZSA9IE5hTjtcclxuXHJcbiAgICAvLyBVbmRlcmZsb3c/XHJcbiAgICB9IGVsc2UgaWYgKHguZSA8IEN0b3IubWluRSkge1xyXG5cclxuICAgICAgLy8gWmVyby5cclxuICAgICAgeC5lID0gMDtcclxuICAgICAgeC5kID0gWzBdO1xyXG4gICAgICAvLyBDdG9yLnVuZGVyZmxvdyA9IHRydWU7XHJcbiAgICB9IC8vIGVsc2UgQ3Rvci51bmRlcmZsb3cgPSBmYWxzZTtcclxuICB9XHJcblxyXG4gIHJldHVybiB4O1xyXG59XHJcblxyXG5cclxuZnVuY3Rpb24gZmluaXRlVG9TdHJpbmcoeCwgaXNFeHAsIHNkKSB7XHJcbiAgaWYgKCF4LmlzRmluaXRlKCkpIHJldHVybiBub25GaW5pdGVUb1N0cmluZyh4KTtcclxuICB2YXIgayxcclxuICAgIGUgPSB4LmUsXHJcbiAgICBzdHIgPSBkaWdpdHNUb1N0cmluZyh4LmQpLFxyXG4gICAgbGVuID0gc3RyLmxlbmd0aDtcclxuXHJcbiAgaWYgKGlzRXhwKSB7XHJcbiAgICBpZiAoc2QgJiYgKGsgPSBzZCAtIGxlbikgPiAwKSB7XHJcbiAgICAgIHN0ciA9IHN0ci5jaGFyQXQoMCkgKyAnLicgKyBzdHIuc2xpY2UoMSkgKyBnZXRaZXJvU3RyaW5nKGspO1xyXG4gICAgfSBlbHNlIGlmIChsZW4gPiAxKSB7XHJcbiAgICAgIHN0ciA9IHN0ci5jaGFyQXQoMCkgKyAnLicgKyBzdHIuc2xpY2UoMSk7XHJcbiAgICB9XHJcblxyXG4gICAgc3RyID0gc3RyICsgKHguZSA8IDAgPyAnZScgOiAnZSsnKSArIHguZTtcclxuICB9IGVsc2UgaWYgKGUgPCAwKSB7XHJcbiAgICBzdHIgPSAnMC4nICsgZ2V0WmVyb1N0cmluZygtZSAtIDEpICsgc3RyO1xyXG4gICAgaWYgKHNkICYmIChrID0gc2QgLSBsZW4pID4gMCkgc3RyICs9IGdldFplcm9TdHJpbmcoayk7XHJcbiAgfSBlbHNlIGlmIChlID49IGxlbikge1xyXG4gICAgc3RyICs9IGdldFplcm9TdHJpbmcoZSArIDEgLSBsZW4pO1xyXG4gICAgaWYgKHNkICYmIChrID0gc2QgLSBlIC0gMSkgPiAwKSBzdHIgPSBzdHIgKyAnLicgKyBnZXRaZXJvU3RyaW5nKGspO1xyXG4gIH0gZWxzZSB7XHJcbiAgICBpZiAoKGsgPSBlICsgMSkgPCBsZW4pIHN0ciA9IHN0ci5zbGljZSgwLCBrKSArICcuJyArIHN0ci5zbGljZShrKTtcclxuICAgIGlmIChzZCAmJiAoayA9IHNkIC0gbGVuKSA+IDApIHtcclxuICAgICAgaWYgKGUgKyAxID09PSBsZW4pIHN0ciArPSAnLic7XHJcbiAgICAgIHN0ciArPSBnZXRaZXJvU3RyaW5nKGspO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgcmV0dXJuIHN0cjtcclxufVxyXG5cclxuXHJcbi8vIENhbGN1bGF0ZSB0aGUgYmFzZSAxMCBleHBvbmVudCBmcm9tIHRoZSBiYXNlIDFlNyBleHBvbmVudC5cclxuZnVuY3Rpb24gZ2V0QmFzZTEwRXhwb25lbnQoZGlnaXRzLCBlKSB7XHJcbiAgdmFyIHcgPSBkaWdpdHNbMF07XHJcblxyXG4gIC8vIEFkZCB0aGUgbnVtYmVyIG9mIGRpZ2l0cyBvZiB0aGUgZmlyc3Qgd29yZCBvZiB0aGUgZGlnaXRzIGFycmF5LlxyXG4gIGZvciAoIGUgKj0gTE9HX0JBU0U7IHcgPj0gMTA7IHcgLz0gMTApIGUrKztcclxuICByZXR1cm4gZTtcclxufVxyXG5cclxuXHJcbmZ1bmN0aW9uIGdldExuMTAoQ3Rvciwgc2QsIHByKSB7XHJcbiAgaWYgKHNkID4gTE4xMF9QUkVDSVNJT04pIHtcclxuXHJcbiAgICAvLyBSZXNldCBnbG9iYWwgc3RhdGUgaW4gY2FzZSB0aGUgZXhjZXB0aW9uIGlzIGNhdWdodC5cclxuICAgIGV4dGVybmFsID0gdHJ1ZTtcclxuICAgIGlmIChwcikgQ3Rvci5wcmVjaXNpb24gPSBwcjtcclxuICAgIHRocm93IEVycm9yKHByZWNpc2lvbkxpbWl0RXhjZWVkZWQpO1xyXG4gIH1cclxuICByZXR1cm4gZmluYWxpc2UobmV3IEN0b3IoTE4xMCksIHNkLCAxLCB0cnVlKTtcclxufVxyXG5cclxuXHJcbmZ1bmN0aW9uIGdldFBpKEN0b3IsIHNkLCBybSkge1xyXG4gIGlmIChzZCA+IFBJX1BSRUNJU0lPTikgdGhyb3cgRXJyb3IocHJlY2lzaW9uTGltaXRFeGNlZWRlZCk7XHJcbiAgcmV0dXJuIGZpbmFsaXNlKG5ldyBDdG9yKFBJKSwgc2QsIHJtLCB0cnVlKTtcclxufVxyXG5cclxuXHJcbmZ1bmN0aW9uIGdldFByZWNpc2lvbihkaWdpdHMpIHtcclxuICB2YXIgdyA9IGRpZ2l0cy5sZW5ndGggLSAxLFxyXG4gICAgbGVuID0gdyAqIExPR19CQVNFICsgMTtcclxuXHJcbiAgdyA9IGRpZ2l0c1t3XTtcclxuXHJcbiAgLy8gSWYgbm9uLXplcm8uLi5cclxuICBpZiAodykge1xyXG5cclxuICAgIC8vIFN1YnRyYWN0IHRoZSBudW1iZXIgb2YgdHJhaWxpbmcgemVyb3Mgb2YgdGhlIGxhc3Qgd29yZC5cclxuICAgIGZvciAoOyB3ICUgMTAgPT0gMDsgdyAvPSAxMCkgbGVuLS07XHJcblxyXG4gICAgLy8gQWRkIHRoZSBudW1iZXIgb2YgZGlnaXRzIG9mIHRoZSBmaXJzdCB3b3JkLlxyXG4gICAgZm9yICh3ID0gZGlnaXRzWzBdOyB3ID49IDEwOyB3IC89IDEwKSBsZW4rKztcclxuICB9XHJcblxyXG4gIHJldHVybiBsZW47XHJcbn1cclxuXHJcblxyXG5mdW5jdGlvbiBnZXRaZXJvU3RyaW5nKGspIHtcclxuICB2YXIgenMgPSAnJztcclxuICBmb3IgKDsgay0tOykgenMgKz0gJzAnO1xyXG4gIHJldHVybiB6cztcclxufVxyXG5cclxuXHJcbi8qXHJcbiAqIFJldHVybiBhIG5ldyBEZWNpbWFsIHdob3NlIHZhbHVlIGlzIHRoZSB2YWx1ZSBvZiBEZWNpbWFsIGB4YCB0byB0aGUgcG93ZXIgYG5gLCB3aGVyZSBgbmAgaXMgYW5cclxuICogaW50ZWdlciBvZiB0eXBlIG51bWJlci5cclxuICpcclxuICogSW1wbGVtZW50cyAnZXhwb25lbnRpYXRpb24gYnkgc3F1YXJpbmcnLiBDYWxsZWQgYnkgYHBvd2AgYW5kIGBwYXJzZU90aGVyYC5cclxuICpcclxuICovXHJcbmZ1bmN0aW9uIGludFBvdyhDdG9yLCB4LCBuLCBwcikge1xyXG4gIHZhciBpc1RydW5jYXRlZCxcclxuICAgIHIgPSBuZXcgQ3RvcigxKSxcclxuXHJcbiAgICAvLyBNYXggbiBvZiA5MDA3MTk5MjU0NzQwOTkxIHRha2VzIDUzIGxvb3AgaXRlcmF0aW9ucy5cclxuICAgIC8vIE1heGltdW0gZGlnaXRzIGFycmF5IGxlbmd0aDsgbGVhdmVzIFsyOCwgMzRdIGd1YXJkIGRpZ2l0cy5cclxuICAgIGsgPSBNYXRoLmNlaWwocHIgLyBMT0dfQkFTRSArIDQpO1xyXG5cclxuICBleHRlcm5hbCA9IGZhbHNlO1xyXG5cclxuICBmb3IgKDs7KSB7XHJcbiAgICBpZiAobiAlIDIpIHtcclxuICAgICAgciA9IHIudGltZXMoeCk7XHJcbiAgICAgIGlmICh0cnVuY2F0ZShyLmQsIGspKSBpc1RydW5jYXRlZCA9IHRydWU7XHJcbiAgICB9XHJcblxyXG4gICAgbiA9IG1hdGhmbG9vcihuIC8gMik7XHJcbiAgICBpZiAobiA9PT0gMCkge1xyXG5cclxuICAgICAgLy8gVG8gZW5zdXJlIGNvcnJlY3Qgcm91bmRpbmcgd2hlbiByLmQgaXMgdHJ1bmNhdGVkLCBpbmNyZW1lbnQgdGhlIGxhc3Qgd29yZCBpZiBpdCBpcyB6ZXJvLlxyXG4gICAgICBuID0gci5kLmxlbmd0aCAtIDE7XHJcbiAgICAgIGlmIChpc1RydW5jYXRlZCAmJiByLmRbbl0gPT09IDApICsrci5kW25dO1xyXG4gICAgICBicmVhaztcclxuICAgIH1cclxuXHJcbiAgICB4ID0geC50aW1lcyh4KTtcclxuICAgIHRydW5jYXRlKHguZCwgayk7XHJcbiAgfVxyXG5cclxuICBleHRlcm5hbCA9IHRydWU7XHJcblxyXG4gIHJldHVybiByO1xyXG59XHJcblxyXG5cclxuZnVuY3Rpb24gaXNPZGQobikge1xyXG4gIHJldHVybiBuLmRbbi5kLmxlbmd0aCAtIDFdICYgMTtcclxufVxyXG5cclxuXHJcbi8qXHJcbiAqIEhhbmRsZSBgbWF4YCBhbmQgYG1pbmAuIGBsdGd0YCBpcyAnbHQnIG9yICdndCcuXHJcbiAqL1xyXG5mdW5jdGlvbiBtYXhPck1pbihDdG9yLCBhcmdzLCBsdGd0KSB7XHJcbiAgdmFyIHksXHJcbiAgICB4ID0gbmV3IEN0b3IoYXJnc1swXSksXHJcbiAgICBpID0gMDtcclxuXHJcbiAgZm9yICg7ICsraSA8IGFyZ3MubGVuZ3RoOykge1xyXG4gICAgeSA9IG5ldyBDdG9yKGFyZ3NbaV0pO1xyXG4gICAgaWYgKCF5LnMpIHtcclxuICAgICAgeCA9IHk7XHJcbiAgICAgIGJyZWFrO1xyXG4gICAgfSBlbHNlIGlmICh4W2x0Z3RdKHkpKSB7XHJcbiAgICAgIHggPSB5O1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgcmV0dXJuIHg7XHJcbn1cclxuXHJcblxyXG4vKlxyXG4gKiBSZXR1cm4gYSBuZXcgRGVjaW1hbCB3aG9zZSB2YWx1ZSBpcyB0aGUgbmF0dXJhbCBleHBvbmVudGlhbCBvZiBgeGAgcm91bmRlZCB0byBgc2RgIHNpZ25pZmljYW50XHJcbiAqIGRpZ2l0cy5cclxuICpcclxuICogVGF5bG9yL01hY2xhdXJpbiBzZXJpZXMuXHJcbiAqXHJcbiAqIGV4cCh4KSA9IHheMC8wISArIHheMS8xISArIHheMi8yISArIHheMy8zISArIC4uLlxyXG4gKlxyXG4gKiBBcmd1bWVudCByZWR1Y3Rpb246XHJcbiAqICAgUmVwZWF0IHggPSB4IC8gMzIsIGsgKz0gNSwgdW50aWwgfHh8IDwgMC4xXHJcbiAqICAgZXhwKHgpID0gZXhwKHggLyAyXmspXigyXmspXHJcbiAqXHJcbiAqIFByZXZpb3VzbHksIHRoZSBhcmd1bWVudCB3YXMgaW5pdGlhbGx5IHJlZHVjZWQgYnlcclxuICogZXhwKHgpID0gZXhwKHIpICogMTBeayAgd2hlcmUgciA9IHggLSBrICogbG4xMCwgayA9IGZsb29yKHggLyBsbjEwKVxyXG4gKiB0byBmaXJzdCBwdXQgciBpbiB0aGUgcmFuZ2UgWzAsIGxuMTBdLCBiZWZvcmUgZGl2aWRpbmcgYnkgMzIgdW50aWwgfHh8IDwgMC4xLCBidXQgdGhpcyB3YXNcclxuICogZm91bmQgdG8gYmUgc2xvd2VyIHRoYW4ganVzdCBkaXZpZGluZyByZXBlYXRlZGx5IGJ5IDMyIGFzIGFib3ZlLlxyXG4gKlxyXG4gKiBNYXggaW50ZWdlciBhcmd1bWVudDogZXhwKCcyMDcyMzI2NTgzNjk0NjQxMycpID0gNi4zZSs5MDAwMDAwMDAwMDAwMDAwXHJcbiAqIE1pbiBpbnRlZ2VyIGFyZ3VtZW50OiBleHAoJy0yMDcyMzI2NTgzNjk0NjQxMScpID0gMS4yZS05MDAwMDAwMDAwMDAwMDAwXHJcbiAqIChNYXRoIG9iamVjdCBpbnRlZ2VyIG1pbi9tYXg6IE1hdGguZXhwKDcwOSkgPSA4LjJlKzMwNywgTWF0aC5leHAoLTc0NSkgPSA1ZS0zMjQpXHJcbiAqXHJcbiAqICBleHAoSW5maW5pdHkpICA9IEluZmluaXR5XHJcbiAqICBleHAoLUluZmluaXR5KSA9IDBcclxuICogIGV4cChOYU4pICAgICAgID0gTmFOXHJcbiAqICBleHAoXHUwMEIxMCkgICAgICAgID0gMVxyXG4gKlxyXG4gKiAgZXhwKHgpIGlzIG5vbi10ZXJtaW5hdGluZyBmb3IgYW55IGZpbml0ZSwgbm9uLXplcm8geC5cclxuICpcclxuICogIFRoZSByZXN1bHQgd2lsbCBhbHdheXMgYmUgY29ycmVjdGx5IHJvdW5kZWQuXHJcbiAqXHJcbiAqL1xyXG5mdW5jdGlvbiBuYXR1cmFsRXhwb25lbnRpYWwoeCwgc2QpIHtcclxuICB2YXIgZGVub21pbmF0b3IsIGd1YXJkLCBqLCBwb3csIHN1bSwgdCwgd3ByLFxyXG4gICAgcmVwID0gMCxcclxuICAgIGkgPSAwLFxyXG4gICAgayA9IDAsXHJcbiAgICBDdG9yID0geC5jb25zdHJ1Y3RvcixcclxuICAgIHJtID0gQ3Rvci5yb3VuZGluZyxcclxuICAgIHByID0gQ3Rvci5wcmVjaXNpb247XHJcblxyXG4gIC8vIDAvTmFOL0luZmluaXR5P1xyXG4gIGlmICgheC5kIHx8ICF4LmRbMF0gfHwgeC5lID4gMTcpIHtcclxuXHJcbiAgICByZXR1cm4gbmV3IEN0b3IoeC5kXHJcbiAgICAgID8gIXguZFswXSA/IDEgOiB4LnMgPCAwID8gMCA6IDEgLyAwXHJcbiAgICAgIDogeC5zID8geC5zIDwgMCA/IDAgOiB4IDogMCAvIDApO1xyXG4gIH1cclxuXHJcbiAgaWYgKHNkID09IG51bGwpIHtcclxuICAgIGV4dGVybmFsID0gZmFsc2U7XHJcbiAgICB3cHIgPSBwcjtcclxuICB9IGVsc2Uge1xyXG4gICAgd3ByID0gc2Q7XHJcbiAgfVxyXG5cclxuICB0ID0gbmV3IEN0b3IoMC4wMzEyNSk7XHJcblxyXG4gIC8vIHdoaWxlIGFicyh4KSA+PSAwLjFcclxuICB3aGlsZSAoeC5lID4gLTIpIHtcclxuXHJcbiAgICAvLyB4ID0geCAvIDJeNVxyXG4gICAgeCA9IHgudGltZXModCk7XHJcbiAgICBrICs9IDU7XHJcbiAgfVxyXG5cclxuICAvLyBVc2UgMiAqIGxvZzEwKDJeaykgKyA1IChlbXBpcmljYWxseSBkZXJpdmVkKSB0byBlc3RpbWF0ZSB0aGUgaW5jcmVhc2UgaW4gcHJlY2lzaW9uXHJcbiAgLy8gbmVjZXNzYXJ5IHRvIGVuc3VyZSB0aGUgZmlyc3QgNCByb3VuZGluZyBkaWdpdHMgYXJlIGNvcnJlY3QuXHJcbiAgZ3VhcmQgPSBNYXRoLmxvZyhtYXRocG93KDIsIGspKSAvIE1hdGguTE4xMCAqIDIgKyA1IHwgMDtcclxuICB3cHIgKz0gZ3VhcmQ7XHJcbiAgZGVub21pbmF0b3IgPSBwb3cgPSBzdW0gPSBuZXcgQ3RvcigxKTtcclxuICBDdG9yLnByZWNpc2lvbiA9IHdwcjtcclxuXHJcbiAgZm9yICg7Oykge1xyXG4gICAgcG93ID0gZmluYWxpc2UocG93LnRpbWVzKHgpLCB3cHIsIDEpO1xyXG4gICAgZGVub21pbmF0b3IgPSBkZW5vbWluYXRvci50aW1lcygrK2kpO1xyXG4gICAgdCA9IHN1bS5wbHVzKGRpdmlkZShwb3csIGRlbm9taW5hdG9yLCB3cHIsIDEpKTtcclxuXHJcbiAgICBpZiAoZGlnaXRzVG9TdHJpbmcodC5kKS5zbGljZSgwLCB3cHIpID09PSBkaWdpdHNUb1N0cmluZyhzdW0uZCkuc2xpY2UoMCwgd3ByKSkge1xyXG4gICAgICBqID0gaztcclxuICAgICAgd2hpbGUgKGotLSkgc3VtID0gZmluYWxpc2Uoc3VtLnRpbWVzKHN1bSksIHdwciwgMSk7XHJcblxyXG4gICAgICAvLyBDaGVjayB0byBzZWUgaWYgdGhlIGZpcnN0IDQgcm91bmRpbmcgZGlnaXRzIGFyZSBbNDldOTk5LlxyXG4gICAgICAvLyBJZiBzbywgcmVwZWF0IHRoZSBzdW1tYXRpb24gd2l0aCBhIGhpZ2hlciBwcmVjaXNpb24sIG90aGVyd2lzZVxyXG4gICAgICAvLyBlLmcuIHdpdGggcHJlY2lzaW9uOiAxOCwgcm91bmRpbmc6IDFcclxuICAgICAgLy8gZXhwKDE4LjQwNDI3MjQ2MjU5NTAzNDA4MzU2Nzc5MzkxOTg0Mzc2MSkgPSA5ODM3MjU2MC4xMjI5OTk5OTk5IChzaG91bGQgYmUgOTgzNzI1NjAuMTIzKVxyXG4gICAgICAvLyBgd3ByIC0gZ3VhcmRgIGlzIHRoZSBpbmRleCBvZiBmaXJzdCByb3VuZGluZyBkaWdpdC5cclxuICAgICAgaWYgKHNkID09IG51bGwpIHtcclxuXHJcbiAgICAgICAgaWYgKHJlcCA8IDMgJiYgY2hlY2tSb3VuZGluZ0RpZ2l0cyhzdW0uZCwgd3ByIC0gZ3VhcmQsIHJtLCByZXApKSB7XHJcbiAgICAgICAgICBDdG9yLnByZWNpc2lvbiA9IHdwciArPSAxMDtcclxuICAgICAgICAgIGRlbm9taW5hdG9yID0gcG93ID0gdCA9IG5ldyBDdG9yKDEpO1xyXG4gICAgICAgICAgaSA9IDA7XHJcbiAgICAgICAgICByZXArKztcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgcmV0dXJuIGZpbmFsaXNlKHN1bSwgQ3Rvci5wcmVjaXNpb24gPSBwciwgcm0sIGV4dGVybmFsID0gdHJ1ZSk7XHJcbiAgICAgICAgfVxyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIEN0b3IucHJlY2lzaW9uID0gcHI7XHJcbiAgICAgICAgcmV0dXJuIHN1bTtcclxuICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHN1bSA9IHQ7XHJcbiAgfVxyXG59XHJcblxyXG5cclxuLypcclxuICogUmV0dXJuIGEgbmV3IERlY2ltYWwgd2hvc2UgdmFsdWUgaXMgdGhlIG5hdHVyYWwgbG9nYXJpdGhtIG9mIGB4YCByb3VuZGVkIHRvIGBzZGAgc2lnbmlmaWNhbnRcclxuICogZGlnaXRzLlxyXG4gKlxyXG4gKiAgbG4oLW4pICAgICAgICA9IE5hTlxyXG4gKiAgbG4oMCkgICAgICAgICA9IC1JbmZpbml0eVxyXG4gKiAgbG4oLTApICAgICAgICA9IC1JbmZpbml0eVxyXG4gKiAgbG4oMSkgICAgICAgICA9IDBcclxuICogIGxuKEluZmluaXR5KSAgPSBJbmZpbml0eVxyXG4gKiAgbG4oLUluZmluaXR5KSA9IE5hTlxyXG4gKiAgbG4oTmFOKSAgICAgICA9IE5hTlxyXG4gKlxyXG4gKiAgbG4obikgKG4gIT0gMSkgaXMgbm9uLXRlcm1pbmF0aW5nLlxyXG4gKlxyXG4gKi9cclxuZnVuY3Rpb24gbmF0dXJhbExvZ2FyaXRobSh5LCBzZCkge1xyXG4gIHZhciBjLCBjMCwgZGVub21pbmF0b3IsIGUsIG51bWVyYXRvciwgcmVwLCBzdW0sIHQsIHdwciwgeDEsIHgyLFxyXG4gICAgbiA9IDEsXHJcbiAgICBndWFyZCA9IDEwLFxyXG4gICAgeCA9IHksXHJcbiAgICB4ZCA9IHguZCxcclxuICAgIEN0b3IgPSB4LmNvbnN0cnVjdG9yLFxyXG4gICAgcm0gPSBDdG9yLnJvdW5kaW5nLFxyXG4gICAgcHIgPSBDdG9yLnByZWNpc2lvbjtcclxuXHJcbiAgLy8gSXMgeCBuZWdhdGl2ZSBvciBJbmZpbml0eSwgTmFOLCAwIG9yIDE/XHJcbiAgaWYgKHgucyA8IDAgfHwgIXhkIHx8ICF4ZFswXSB8fCAheC5lICYmIHhkWzBdID09IDEgJiYgeGQubGVuZ3RoID09IDEpIHtcclxuICAgIHJldHVybiBuZXcgQ3Rvcih4ZCAmJiAheGRbMF0gPyAtMSAvIDAgOiB4LnMgIT0gMSA/IE5hTiA6IHhkID8gMCA6IHgpO1xyXG4gIH1cclxuXHJcbiAgaWYgKHNkID09IG51bGwpIHtcclxuICAgIGV4dGVybmFsID0gZmFsc2U7XHJcbiAgICB3cHIgPSBwcjtcclxuICB9IGVsc2Uge1xyXG4gICAgd3ByID0gc2Q7XHJcbiAgfVxyXG5cclxuICBDdG9yLnByZWNpc2lvbiA9IHdwciArPSBndWFyZDtcclxuICBjID0gZGlnaXRzVG9TdHJpbmcoeGQpO1xyXG4gIGMwID0gYy5jaGFyQXQoMCk7XHJcblxyXG4gIGlmIChNYXRoLmFicyhlID0geC5lKSA8IDEuNWUxNSkge1xyXG5cclxuICAgIC8vIEFyZ3VtZW50IHJlZHVjdGlvbi5cclxuICAgIC8vIFRoZSBzZXJpZXMgY29udmVyZ2VzIGZhc3RlciB0aGUgY2xvc2VyIHRoZSBhcmd1bWVudCBpcyB0byAxLCBzbyB1c2luZ1xyXG4gICAgLy8gbG4oYV5iKSA9IGIgKiBsbihhKSwgICBsbihhKSA9IGxuKGFeYikgLyBiXHJcbiAgICAvLyBtdWx0aXBseSB0aGUgYXJndW1lbnQgYnkgaXRzZWxmIHVudGlsIHRoZSBsZWFkaW5nIGRpZ2l0cyBvZiB0aGUgc2lnbmlmaWNhbmQgYXJlIDcsIDgsIDksXHJcbiAgICAvLyAxMCwgMTEsIDEyIG9yIDEzLCByZWNvcmRpbmcgdGhlIG51bWJlciBvZiBtdWx0aXBsaWNhdGlvbnMgc28gdGhlIHN1bSBvZiB0aGUgc2VyaWVzIGNhblxyXG4gICAgLy8gbGF0ZXIgYmUgZGl2aWRlZCBieSB0aGlzIG51bWJlciwgdGhlbiBzZXBhcmF0ZSBvdXQgdGhlIHBvd2VyIG9mIDEwIHVzaW5nXHJcbiAgICAvLyBsbihhKjEwXmIpID0gbG4oYSkgKyBiKmxuKDEwKS5cclxuXHJcbiAgICAvLyBtYXggbiBpcyAyMSAoZ2l2ZXMgMC45LCAxLjAgb3IgMS4xKSAoOWUxNSAvIDIxID0gNC4yZTE0KS5cclxuICAgIC8vd2hpbGUgKGMwIDwgOSAmJiBjMCAhPSAxIHx8IGMwID09IDEgJiYgYy5jaGFyQXQoMSkgPiAxKSB7XHJcbiAgICAvLyBtYXggbiBpcyA2IChnaXZlcyAwLjcgLSAxLjMpXHJcbiAgICB3aGlsZSAoYzAgPCA3ICYmIGMwICE9IDEgfHwgYzAgPT0gMSAmJiBjLmNoYXJBdCgxKSA+IDMpIHtcclxuICAgICAgeCA9IHgudGltZXMoeSk7XHJcbiAgICAgIGMgPSBkaWdpdHNUb1N0cmluZyh4LmQpO1xyXG4gICAgICBjMCA9IGMuY2hhckF0KDApO1xyXG4gICAgICBuKys7XHJcbiAgICB9XHJcblxyXG4gICAgZSA9IHguZTtcclxuXHJcbiAgICBpZiAoYzAgPiAxKSB7XHJcbiAgICAgIHggPSBuZXcgQ3RvcignMC4nICsgYyk7XHJcbiAgICAgIGUrKztcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIHggPSBuZXcgQ3RvcihjMCArICcuJyArIGMuc2xpY2UoMSkpO1xyXG4gICAgfVxyXG4gIH0gZWxzZSB7XHJcblxyXG4gICAgLy8gVGhlIGFyZ3VtZW50IHJlZHVjdGlvbiBtZXRob2QgYWJvdmUgbWF5IHJlc3VsdCBpbiBvdmVyZmxvdyBpZiB0aGUgYXJndW1lbnQgeSBpcyBhIG1hc3NpdmVcclxuICAgIC8vIG51bWJlciB3aXRoIGV4cG9uZW50ID49IDE1MDAwMDAwMDAwMDAwMDAgKDllMTUgLyA2ID0gMS41ZTE1KSwgc28gaW5zdGVhZCByZWNhbGwgdGhpc1xyXG4gICAgLy8gZnVuY3Rpb24gdXNpbmcgbG4oeCoxMF5lKSA9IGxuKHgpICsgZSpsbigxMCkuXHJcbiAgICB0ID0gZ2V0TG4xMChDdG9yLCB3cHIgKyAyLCBwcikudGltZXMoZSArICcnKTtcclxuICAgIHggPSBuYXR1cmFsTG9nYXJpdGhtKG5ldyBDdG9yKGMwICsgJy4nICsgYy5zbGljZSgxKSksIHdwciAtIGd1YXJkKS5wbHVzKHQpO1xyXG4gICAgQ3Rvci5wcmVjaXNpb24gPSBwcjtcclxuXHJcbiAgICByZXR1cm4gc2QgPT0gbnVsbCA/IGZpbmFsaXNlKHgsIHByLCBybSwgZXh0ZXJuYWwgPSB0cnVlKSA6IHg7XHJcbiAgfVxyXG5cclxuICAvLyB4MSBpcyB4IHJlZHVjZWQgdG8gYSB2YWx1ZSBuZWFyIDEuXHJcbiAgeDEgPSB4O1xyXG5cclxuICAvLyBUYXlsb3Igc2VyaWVzLlxyXG4gIC8vIGxuKHkpID0gbG4oKDEgKyB4KS8oMSAtIHgpKSA9IDIoeCArIHheMy8zICsgeF41LzUgKyB4XjcvNyArIC4uLilcclxuICAvLyB3aGVyZSB4ID0gKHkgLSAxKS8oeSArIDEpICAgICh8eHwgPCAxKVxyXG4gIHN1bSA9IG51bWVyYXRvciA9IHggPSBkaXZpZGUoeC5taW51cygxKSwgeC5wbHVzKDEpLCB3cHIsIDEpO1xyXG4gIHgyID0gZmluYWxpc2UoeC50aW1lcyh4KSwgd3ByLCAxKTtcclxuICBkZW5vbWluYXRvciA9IDM7XHJcblxyXG4gIGZvciAoOzspIHtcclxuICAgIG51bWVyYXRvciA9IGZpbmFsaXNlKG51bWVyYXRvci50aW1lcyh4MiksIHdwciwgMSk7XHJcbiAgICB0ID0gc3VtLnBsdXMoZGl2aWRlKG51bWVyYXRvciwgbmV3IEN0b3IoZGVub21pbmF0b3IpLCB3cHIsIDEpKTtcclxuXHJcbiAgICBpZiAoZGlnaXRzVG9TdHJpbmcodC5kKS5zbGljZSgwLCB3cHIpID09PSBkaWdpdHNUb1N0cmluZyhzdW0uZCkuc2xpY2UoMCwgd3ByKSkge1xyXG4gICAgICBzdW0gPSBzdW0udGltZXMoMik7XHJcblxyXG4gICAgICAvLyBSZXZlcnNlIHRoZSBhcmd1bWVudCByZWR1Y3Rpb24uIENoZWNrIHRoYXQgZSBpcyBub3QgMCBiZWNhdXNlLCBiZXNpZGVzIHByZXZlbnRpbmcgYW5cclxuICAgICAgLy8gdW5uZWNlc3NhcnkgY2FsY3VsYXRpb24sIC0wICsgMCA9ICswIGFuZCB0byBlbnN1cmUgY29ycmVjdCByb3VuZGluZyAtMCBuZWVkcyB0byBzdGF5IC0wLlxyXG4gICAgICBpZiAoZSAhPT0gMCkgc3VtID0gc3VtLnBsdXMoZ2V0TG4xMChDdG9yLCB3cHIgKyAyLCBwcikudGltZXMoZSArICcnKSk7XHJcbiAgICAgIHN1bSA9IGRpdmlkZShzdW0sIG5ldyBDdG9yKG4pLCB3cHIsIDEpO1xyXG5cclxuICAgICAgLy8gSXMgcm0gPiAzIGFuZCB0aGUgZmlyc3QgNCByb3VuZGluZyBkaWdpdHMgNDk5OSwgb3Igcm0gPCA0IChvciB0aGUgc3VtbWF0aW9uIGhhc1xyXG4gICAgICAvLyBiZWVuIHJlcGVhdGVkIHByZXZpb3VzbHkpIGFuZCB0aGUgZmlyc3QgNCByb3VuZGluZyBkaWdpdHMgOTk5OT9cclxuICAgICAgLy8gSWYgc28sIHJlc3RhcnQgdGhlIHN1bW1hdGlvbiB3aXRoIGEgaGlnaGVyIHByZWNpc2lvbiwgb3RoZXJ3aXNlXHJcbiAgICAgIC8vIGUuZy4gd2l0aCBwcmVjaXNpb246IDEyLCByb3VuZGluZzogMVxyXG4gICAgICAvLyBsbigxMzU1MjAwMjguNjEyNjA5MTcxNDI2NTM4MTUzMykgPSAxOC43MjQ2Mjk5OTk5IHdoZW4gaXQgc2hvdWxkIGJlIDE4LjcyNDYzLlxyXG4gICAgICAvLyBgd3ByIC0gZ3VhcmRgIGlzIHRoZSBpbmRleCBvZiBmaXJzdCByb3VuZGluZyBkaWdpdC5cclxuICAgICAgaWYgKHNkID09IG51bGwpIHtcclxuICAgICAgICBpZiAoY2hlY2tSb3VuZGluZ0RpZ2l0cyhzdW0uZCwgd3ByIC0gZ3VhcmQsIHJtLCByZXApKSB7XHJcbiAgICAgICAgICBDdG9yLnByZWNpc2lvbiA9IHdwciArPSBndWFyZDtcclxuICAgICAgICAgIHQgPSBudW1lcmF0b3IgPSB4ID0gZGl2aWRlKHgxLm1pbnVzKDEpLCB4MS5wbHVzKDEpLCB3cHIsIDEpO1xyXG4gICAgICAgICAgeDIgPSBmaW5hbGlzZSh4LnRpbWVzKHgpLCB3cHIsIDEpO1xyXG4gICAgICAgICAgZGVub21pbmF0b3IgPSByZXAgPSAxO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICByZXR1cm4gZmluYWxpc2Uoc3VtLCBDdG9yLnByZWNpc2lvbiA9IHByLCBybSwgZXh0ZXJuYWwgPSB0cnVlKTtcclxuICAgICAgICB9XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgQ3Rvci5wcmVjaXNpb24gPSBwcjtcclxuICAgICAgICByZXR1cm4gc3VtO1xyXG4gICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgc3VtID0gdDtcclxuICAgIGRlbm9taW5hdG9yICs9IDI7XHJcbiAgfVxyXG59XHJcblxyXG5cclxuLy8gXHUwMEIxSW5maW5pdHksIE5hTi5cclxuZnVuY3Rpb24gbm9uRmluaXRlVG9TdHJpbmcoeCkge1xyXG4gIC8vIFVuc2lnbmVkLlxyXG4gIHJldHVybiBTdHJpbmcoeC5zICogeC5zIC8gMCk7XHJcbn1cclxuXHJcblxyXG4vKlxyXG4gKiBQYXJzZSB0aGUgdmFsdWUgb2YgYSBuZXcgRGVjaW1hbCBgeGAgZnJvbSBzdHJpbmcgYHN0cmAuXHJcbiAqL1xyXG5mdW5jdGlvbiBwYXJzZURlY2ltYWwoeCwgc3RyKSB7XHJcbiAgdmFyIGUsIGksIGxlbjtcclxuXHJcbiAgLy8gRGVjaW1hbCBwb2ludD9cclxuICBpZiAoKGUgPSBzdHIuaW5kZXhPZignLicpKSA+IC0xKSBzdHIgPSBzdHIucmVwbGFjZSgnLicsICcnKTtcclxuXHJcbiAgLy8gRXhwb25lbnRpYWwgZm9ybT9cclxuICBpZiAoKGkgPSBzdHIuc2VhcmNoKC9lL2kpKSA+IDApIHtcclxuXHJcbiAgICAvLyBEZXRlcm1pbmUgZXhwb25lbnQuXHJcbiAgICBpZiAoZSA8IDApIGUgPSBpO1xyXG4gICAgZSArPSArc3RyLnNsaWNlKGkgKyAxKTtcclxuICAgIHN0ciA9IHN0ci5zdWJzdHJpbmcoMCwgaSk7XHJcbiAgfSBlbHNlIGlmIChlIDwgMCkge1xyXG5cclxuICAgIC8vIEludGVnZXIuXHJcbiAgICBlID0gc3RyLmxlbmd0aDtcclxuICB9XHJcblxyXG4gIC8vIERldGVybWluZSBsZWFkaW5nIHplcm9zLlxyXG4gIGZvciAoaSA9IDA7IHN0ci5jaGFyQ29kZUF0KGkpID09PSA0ODsgaSsrKTtcclxuXHJcbiAgLy8gRGV0ZXJtaW5lIHRyYWlsaW5nIHplcm9zLlxyXG4gIGZvciAobGVuID0gc3RyLmxlbmd0aDsgc3RyLmNoYXJDb2RlQXQobGVuIC0gMSkgPT09IDQ4OyAtLWxlbik7XHJcbiAgc3RyID0gc3RyLnNsaWNlKGksIGxlbik7XHJcblxyXG4gIGlmIChzdHIpIHtcclxuICAgIGxlbiAtPSBpO1xyXG4gICAgeC5lID0gZSA9IGUgLSBpIC0gMTtcclxuICAgIHguZCA9IFtdO1xyXG5cclxuICAgIC8vIFRyYW5zZm9ybSBiYXNlXHJcblxyXG4gICAgLy8gZSBpcyB0aGUgYmFzZSAxMCBleHBvbmVudC5cclxuICAgIC8vIGkgaXMgd2hlcmUgdG8gc2xpY2Ugc3RyIHRvIGdldCB0aGUgZmlyc3Qgd29yZCBvZiB0aGUgZGlnaXRzIGFycmF5LlxyXG4gICAgaSA9IChlICsgMSkgJSBMT0dfQkFTRTtcclxuICAgIGlmIChlIDwgMCkgaSArPSBMT0dfQkFTRTtcclxuXHJcbiAgICBpZiAoaSA8IGxlbikge1xyXG4gICAgICBpZiAoaSkgeC5kLnB1c2goK3N0ci5zbGljZSgwLCBpKSk7XHJcbiAgICAgIGZvciAobGVuIC09IExPR19CQVNFOyBpIDwgbGVuOykgeC5kLnB1c2goK3N0ci5zbGljZShpLCBpICs9IExPR19CQVNFKSk7XHJcbiAgICAgIHN0ciA9IHN0ci5zbGljZShpKTtcclxuICAgICAgaSA9IExPR19CQVNFIC0gc3RyLmxlbmd0aDtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIGkgLT0gbGVuO1xyXG4gICAgfVxyXG5cclxuICAgIGZvciAoOyBpLS07KSBzdHIgKz0gJzAnO1xyXG4gICAgeC5kLnB1c2goK3N0cik7XHJcblxyXG4gICAgaWYgKGV4dGVybmFsKSB7XHJcblxyXG4gICAgICAvLyBPdmVyZmxvdz9cclxuICAgICAgaWYgKHguZSA+IHguY29uc3RydWN0b3IubWF4RSkge1xyXG5cclxuICAgICAgICAvLyBJbmZpbml0eS5cclxuICAgICAgICB4LmQgPSBudWxsO1xyXG4gICAgICAgIHguZSA9IE5hTjtcclxuXHJcbiAgICAgIC8vIFVuZGVyZmxvdz9cclxuICAgICAgfSBlbHNlIGlmICh4LmUgPCB4LmNvbnN0cnVjdG9yLm1pbkUpIHtcclxuXHJcbiAgICAgICAgLy8gWmVyby5cclxuICAgICAgICB4LmUgPSAwO1xyXG4gICAgICAgIHguZCA9IFswXTtcclxuICAgICAgICAvLyB4LmNvbnN0cnVjdG9yLnVuZGVyZmxvdyA9IHRydWU7XHJcbiAgICAgIH0gLy8gZWxzZSB4LmNvbnN0cnVjdG9yLnVuZGVyZmxvdyA9IGZhbHNlO1xyXG4gICAgfVxyXG4gIH0gZWxzZSB7XHJcblxyXG4gICAgLy8gWmVyby5cclxuICAgIHguZSA9IDA7XHJcbiAgICB4LmQgPSBbMF07XHJcbiAgfVxyXG5cclxuICByZXR1cm4geDtcclxufVxyXG5cclxuXHJcbi8qXHJcbiAqIFBhcnNlIHRoZSB2YWx1ZSBvZiBhIG5ldyBEZWNpbWFsIGB4YCBmcm9tIGEgc3RyaW5nIGBzdHJgLCB3aGljaCBpcyBub3QgYSBkZWNpbWFsIHZhbHVlLlxyXG4gKi9cclxuZnVuY3Rpb24gcGFyc2VPdGhlcih4LCBzdHIpIHtcclxuICB2YXIgYmFzZSwgQ3RvciwgZGl2aXNvciwgaSwgaXNGbG9hdCwgbGVuLCBwLCB4ZCwgeGU7XHJcblxyXG4gIGlmIChzdHIuaW5kZXhPZignXycpID4gLTEpIHtcclxuICAgIHN0ciA9IHN0ci5yZXBsYWNlKC8oXFxkKV8oPz1cXGQpL2csICckMScpO1xyXG4gICAgaWYgKGlzRGVjaW1hbC50ZXN0KHN0cikpIHJldHVybiBwYXJzZURlY2ltYWwoeCwgc3RyKTtcclxuICB9IGVsc2UgaWYgKHN0ciA9PT0gJ0luZmluaXR5JyB8fCBzdHIgPT09ICdOYU4nKSB7XHJcbiAgICBpZiAoIStzdHIpIHgucyA9IE5hTjtcclxuICAgIHguZSA9IE5hTjtcclxuICAgIHguZCA9IG51bGw7XHJcbiAgICByZXR1cm4geDtcclxuICB9XHJcblxyXG4gIGlmIChpc0hleC50ZXN0KHN0cikpICB7XHJcbiAgICBiYXNlID0gMTY7XHJcbiAgICBzdHIgPSBzdHIudG9Mb3dlckNhc2UoKTtcclxuICB9IGVsc2UgaWYgKGlzQmluYXJ5LnRlc3Qoc3RyKSkgIHtcclxuICAgIGJhc2UgPSAyO1xyXG4gIH0gZWxzZSBpZiAoaXNPY3RhbC50ZXN0KHN0cikpICB7XHJcbiAgICBiYXNlID0gODtcclxuICB9IGVsc2Uge1xyXG4gICAgdGhyb3cgRXJyb3IoaW52YWxpZEFyZ3VtZW50ICsgc3RyKTtcclxuICB9XHJcblxyXG4gIC8vIElzIHRoZXJlIGEgYmluYXJ5IGV4cG9uZW50IHBhcnQ/XHJcbiAgaSA9IHN0ci5zZWFyY2goL3AvaSk7XHJcblxyXG4gIGlmIChpID4gMCkge1xyXG4gICAgcCA9ICtzdHIuc2xpY2UoaSArIDEpO1xyXG4gICAgc3RyID0gc3RyLnN1YnN0cmluZygyLCBpKTtcclxuICB9IGVsc2Uge1xyXG4gICAgc3RyID0gc3RyLnNsaWNlKDIpO1xyXG4gIH1cclxuXHJcbiAgLy8gQ29udmVydCBgc3RyYCBhcyBhbiBpbnRlZ2VyIHRoZW4gZGl2aWRlIHRoZSByZXN1bHQgYnkgYGJhc2VgIHJhaXNlZCB0byBhIHBvd2VyIHN1Y2ggdGhhdCB0aGVcclxuICAvLyBmcmFjdGlvbiBwYXJ0IHdpbGwgYmUgcmVzdG9yZWQuXHJcbiAgaSA9IHN0ci5pbmRleE9mKCcuJyk7XHJcbiAgaXNGbG9hdCA9IGkgPj0gMDtcclxuICBDdG9yID0geC5jb25zdHJ1Y3RvcjtcclxuXHJcbiAgaWYgKGlzRmxvYXQpIHtcclxuICAgIHN0ciA9IHN0ci5yZXBsYWNlKCcuJywgJycpO1xyXG4gICAgbGVuID0gc3RyLmxlbmd0aDtcclxuICAgIGkgPSBsZW4gLSBpO1xyXG5cclxuICAgIC8vIGxvZ1sxMF0oMTYpID0gMS4yMDQxLi4uICwgbG9nWzEwXSg4OCkgPSAxLjk0NDQuLi4uXHJcbiAgICBkaXZpc29yID0gaW50UG93KEN0b3IsIG5ldyBDdG9yKGJhc2UpLCBpLCBpICogMik7XHJcbiAgfVxyXG5cclxuICB4ZCA9IGNvbnZlcnRCYXNlKHN0ciwgYmFzZSwgQkFTRSk7XHJcbiAgeGUgPSB4ZC5sZW5ndGggLSAxO1xyXG5cclxuICAvLyBSZW1vdmUgdHJhaWxpbmcgemVyb3MuXHJcbiAgZm9yIChpID0geGU7IHhkW2ldID09PSAwOyAtLWkpIHhkLnBvcCgpO1xyXG4gIGlmIChpIDwgMCkgcmV0dXJuIG5ldyBDdG9yKHgucyAqIDApO1xyXG4gIHguZSA9IGdldEJhc2UxMEV4cG9uZW50KHhkLCB4ZSk7XHJcbiAgeC5kID0geGQ7XHJcbiAgZXh0ZXJuYWwgPSBmYWxzZTtcclxuXHJcbiAgLy8gQXQgd2hhdCBwcmVjaXNpb24gdG8gcGVyZm9ybSB0aGUgZGl2aXNpb24gdG8gZW5zdXJlIGV4YWN0IGNvbnZlcnNpb24/XHJcbiAgLy8gbWF4RGVjaW1hbEludGVnZXJQYXJ0RGlnaXRDb3VudCA9IGNlaWwobG9nWzEwXShiKSAqIG90aGVyQmFzZUludGVnZXJQYXJ0RGlnaXRDb3VudClcclxuICAvLyBsb2dbMTBdKDIpID0gMC4zMDEwMywgbG9nWzEwXSg4KSA9IDAuOTAzMDksIGxvZ1sxMF0oMTYpID0gMS4yMDQxMlxyXG4gIC8vIEUuZy4gY2VpbCgxLjIgKiAzKSA9IDQsIHNvIHVwIHRvIDQgZGVjaW1hbCBkaWdpdHMgYXJlIG5lZWRlZCB0byByZXByZXNlbnQgMyBoZXggaW50IGRpZ2l0cy5cclxuICAvLyBtYXhEZWNpbWFsRnJhY3Rpb25QYXJ0RGlnaXRDb3VudCA9IHtIZXg6NHxPY3Q6M3xCaW46MX0gKiBvdGhlckJhc2VGcmFjdGlvblBhcnREaWdpdENvdW50XHJcbiAgLy8gVGhlcmVmb3JlIHVzaW5nIDQgKiB0aGUgbnVtYmVyIG9mIGRpZ2l0cyBvZiBzdHIgd2lsbCBhbHdheXMgYmUgZW5vdWdoLlxyXG4gIGlmIChpc0Zsb2F0KSB4ID0gZGl2aWRlKHgsIGRpdmlzb3IsIGxlbiAqIDQpO1xyXG5cclxuICAvLyBNdWx0aXBseSBieSB0aGUgYmluYXJ5IGV4cG9uZW50IHBhcnQgaWYgcHJlc2VudC5cclxuICBpZiAocCkgeCA9IHgudGltZXMoTWF0aC5hYnMocCkgPCA1NCA/IG1hdGhwb3coMiwgcCkgOiBEZWNpbWFsLnBvdygyLCBwKSk7XHJcbiAgZXh0ZXJuYWwgPSB0cnVlO1xyXG5cclxuICByZXR1cm4geDtcclxufVxyXG5cclxuXHJcbi8qXHJcbiAqIHNpbih4KSA9IHggLSB4XjMvMyEgKyB4XjUvNSEgLSAuLi5cclxuICogfHh8IDwgcGkvMlxyXG4gKlxyXG4gKi9cclxuZnVuY3Rpb24gc2luZShDdG9yLCB4KSB7XHJcbiAgdmFyIGssXHJcbiAgICBsZW4gPSB4LmQubGVuZ3RoO1xyXG5cclxuICBpZiAobGVuIDwgMykge1xyXG4gICAgcmV0dXJuIHguaXNaZXJvKCkgPyB4IDogdGF5bG9yU2VyaWVzKEN0b3IsIDIsIHgsIHgpO1xyXG4gIH1cclxuXHJcbiAgLy8gQXJndW1lbnQgcmVkdWN0aW9uOiBzaW4oNXgpID0gMTYqc2luXjUoeCkgLSAyMCpzaW5eMyh4KSArIDUqc2luKHgpXHJcbiAgLy8gaS5lLiBzaW4oeCkgPSAxNipzaW5eNSh4LzUpIC0gMjAqc2luXjMoeC81KSArIDUqc2luKHgvNSlcclxuICAvLyBhbmQgIHNpbih4KSA9IHNpbih4LzUpKDUgKyBzaW5eMih4LzUpKDE2c2luXjIoeC81KSAtIDIwKSlcclxuXHJcbiAgLy8gRXN0aW1hdGUgdGhlIG9wdGltdW0gbnVtYmVyIG9mIHRpbWVzIHRvIHVzZSB0aGUgYXJndW1lbnQgcmVkdWN0aW9uLlxyXG4gIGsgPSAxLjQgKiBNYXRoLnNxcnQobGVuKTtcclxuICBrID0gayA+IDE2ID8gMTYgOiBrIHwgMDtcclxuXHJcbiAgeCA9IHgudGltZXMoMSAvIHRpbnlQb3coNSwgaykpO1xyXG4gIHggPSB0YXlsb3JTZXJpZXMoQ3RvciwgMiwgeCwgeCk7XHJcblxyXG4gIC8vIFJldmVyc2UgYXJndW1lbnQgcmVkdWN0aW9uXHJcbiAgdmFyIHNpbjJfeCxcclxuICAgIGQ1ID0gbmV3IEN0b3IoNSksXHJcbiAgICBkMTYgPSBuZXcgQ3RvcigxNiksXHJcbiAgICBkMjAgPSBuZXcgQ3RvcigyMCk7XHJcbiAgZm9yICg7IGstLTspIHtcclxuICAgIHNpbjJfeCA9IHgudGltZXMoeCk7XHJcbiAgICB4ID0geC50aW1lcyhkNS5wbHVzKHNpbjJfeC50aW1lcyhkMTYudGltZXMoc2luMl94KS5taW51cyhkMjApKSkpO1xyXG4gIH1cclxuXHJcbiAgcmV0dXJuIHg7XHJcbn1cclxuXHJcblxyXG4vLyBDYWxjdWxhdGUgVGF5bG9yIHNlcmllcyBmb3IgYGNvc2AsIGBjb3NoYCwgYHNpbmAgYW5kIGBzaW5oYC5cclxuZnVuY3Rpb24gdGF5bG9yU2VyaWVzKEN0b3IsIG4sIHgsIHksIGlzSHlwZXJib2xpYykge1xyXG4gIHZhciBqLCB0LCB1LCB4MixcclxuICAgIGkgPSAxLFxyXG4gICAgcHIgPSBDdG9yLnByZWNpc2lvbixcclxuICAgIGsgPSBNYXRoLmNlaWwocHIgLyBMT0dfQkFTRSk7XHJcblxyXG4gIGV4dGVybmFsID0gZmFsc2U7XHJcbiAgeDIgPSB4LnRpbWVzKHgpO1xyXG4gIHUgPSBuZXcgQ3Rvcih5KTtcclxuXHJcbiAgZm9yICg7Oykge1xyXG4gICAgdCA9IGRpdmlkZSh1LnRpbWVzKHgyKSwgbmV3IEN0b3IobisrICogbisrKSwgcHIsIDEpO1xyXG4gICAgdSA9IGlzSHlwZXJib2xpYyA/IHkucGx1cyh0KSA6IHkubWludXModCk7XHJcbiAgICB5ID0gZGl2aWRlKHQudGltZXMoeDIpLCBuZXcgQ3RvcihuKysgKiBuKyspLCBwciwgMSk7XHJcbiAgICB0ID0gdS5wbHVzKHkpO1xyXG5cclxuICAgIGlmICh0LmRba10gIT09IHZvaWQgMCkge1xyXG4gICAgICBmb3IgKGogPSBrOyB0LmRbal0gPT09IHUuZFtqXSAmJiBqLS07KTtcclxuICAgICAgaWYgKGogPT0gLTEpIGJyZWFrO1xyXG4gICAgfVxyXG5cclxuICAgIGogPSB1O1xyXG4gICAgdSA9IHk7XHJcbiAgICB5ID0gdDtcclxuICAgIHQgPSBqO1xyXG4gICAgaSsrO1xyXG4gIH1cclxuXHJcbiAgZXh0ZXJuYWwgPSB0cnVlO1xyXG4gIHQuZC5sZW5ndGggPSBrICsgMTtcclxuXHJcbiAgcmV0dXJuIHQ7XHJcbn1cclxuXHJcblxyXG4vLyBFeHBvbmVudCBlIG11c3QgYmUgcG9zaXRpdmUgYW5kIG5vbi16ZXJvLlxyXG5mdW5jdGlvbiB0aW55UG93KGIsIGUpIHtcclxuICB2YXIgbiA9IGI7XHJcbiAgd2hpbGUgKC0tZSkgbiAqPSBiO1xyXG4gIHJldHVybiBuO1xyXG59XHJcblxyXG5cclxuLy8gUmV0dXJuIHRoZSBhYnNvbHV0ZSB2YWx1ZSBvZiBgeGAgcmVkdWNlZCB0byBsZXNzIHRoYW4gb3IgZXF1YWwgdG8gaGFsZiBwaS5cclxuZnVuY3Rpb24gdG9MZXNzVGhhbkhhbGZQaShDdG9yLCB4KSB7XHJcbiAgdmFyIHQsXHJcbiAgICBpc05lZyA9IHgucyA8IDAsXHJcbiAgICBwaSA9IGdldFBpKEN0b3IsIEN0b3IucHJlY2lzaW9uLCAxKSxcclxuICAgIGhhbGZQaSA9IHBpLnRpbWVzKDAuNSk7XHJcblxyXG4gIHggPSB4LmFicygpO1xyXG5cclxuICBpZiAoeC5sdGUoaGFsZlBpKSkge1xyXG4gICAgcXVhZHJhbnQgPSBpc05lZyA/IDQgOiAxO1xyXG4gICAgcmV0dXJuIHg7XHJcbiAgfVxyXG5cclxuICB0ID0geC5kaXZUb0ludChwaSk7XHJcblxyXG4gIGlmICh0LmlzWmVybygpKSB7XHJcbiAgICBxdWFkcmFudCA9IGlzTmVnID8gMyA6IDI7XHJcbiAgfSBlbHNlIHtcclxuICAgIHggPSB4Lm1pbnVzKHQudGltZXMocGkpKTtcclxuXHJcbiAgICAvLyAwIDw9IHggPCBwaVxyXG4gICAgaWYgKHgubHRlKGhhbGZQaSkpIHtcclxuICAgICAgcXVhZHJhbnQgPSBpc09kZCh0KSA/IChpc05lZyA/IDIgOiAzKSA6IChpc05lZyA/IDQgOiAxKTtcclxuICAgICAgcmV0dXJuIHg7XHJcbiAgICB9XHJcblxyXG4gICAgcXVhZHJhbnQgPSBpc09kZCh0KSA/IChpc05lZyA/IDEgOiA0KSA6IChpc05lZyA/IDMgOiAyKTtcclxuICB9XHJcblxyXG4gIHJldHVybiB4Lm1pbnVzKHBpKS5hYnMoKTtcclxufVxyXG5cclxuXHJcbi8qXHJcbiAqIFJldHVybiB0aGUgdmFsdWUgb2YgRGVjaW1hbCBgeGAgYXMgYSBzdHJpbmcgaW4gYmFzZSBgYmFzZU91dGAuXHJcbiAqXHJcbiAqIElmIHRoZSBvcHRpb25hbCBgc2RgIGFyZ3VtZW50IGlzIHByZXNlbnQgaW5jbHVkZSBhIGJpbmFyeSBleHBvbmVudCBzdWZmaXguXHJcbiAqL1xyXG5mdW5jdGlvbiB0b1N0cmluZ0JpbmFyeSh4LCBiYXNlT3V0LCBzZCwgcm0pIHtcclxuICB2YXIgYmFzZSwgZSwgaSwgaywgbGVuLCByb3VuZFVwLCBzdHIsIHhkLCB5LFxyXG4gICAgQ3RvciA9IHguY29uc3RydWN0b3IsXHJcbiAgICBpc0V4cCA9IHNkICE9PSB2b2lkIDA7XHJcblxyXG4gIGlmIChpc0V4cCkge1xyXG4gICAgY2hlY2tJbnQzMihzZCwgMSwgTUFYX0RJR0lUUyk7XHJcbiAgICBpZiAocm0gPT09IHZvaWQgMCkgcm0gPSBDdG9yLnJvdW5kaW5nO1xyXG4gICAgZWxzZSBjaGVja0ludDMyKHJtLCAwLCA4KTtcclxuICB9IGVsc2Uge1xyXG4gICAgc2QgPSBDdG9yLnByZWNpc2lvbjtcclxuICAgIHJtID0gQ3Rvci5yb3VuZGluZztcclxuICB9XHJcblxyXG4gIGlmICgheC5pc0Zpbml0ZSgpKSB7XHJcbiAgICBzdHIgPSBub25GaW5pdGVUb1N0cmluZyh4KTtcclxuICB9IGVsc2Uge1xyXG4gICAgc3RyID0gZmluaXRlVG9TdHJpbmcoeCk7XHJcbiAgICBpID0gc3RyLmluZGV4T2YoJy4nKTtcclxuXHJcbiAgICAvLyBVc2UgZXhwb25lbnRpYWwgbm90YXRpb24gYWNjb3JkaW5nIHRvIGB0b0V4cFBvc2AgYW5kIGB0b0V4cE5lZ2A/IE5vLCBidXQgaWYgcmVxdWlyZWQ6XHJcbiAgICAvLyBtYXhCaW5hcnlFeHBvbmVudCA9IGZsb29yKChkZWNpbWFsRXhwb25lbnQgKyAxKSAqIGxvZ1syXSgxMCkpXHJcbiAgICAvLyBtaW5CaW5hcnlFeHBvbmVudCA9IGZsb29yKGRlY2ltYWxFeHBvbmVudCAqIGxvZ1syXSgxMCkpXHJcbiAgICAvLyBsb2dbMl0oMTApID0gMy4zMjE5MjgwOTQ4ODczNjIzNDc4NzAzMTk0Mjk0ODkzOTAxNzU4NjRcclxuXHJcbiAgICBpZiAoaXNFeHApIHtcclxuICAgICAgYmFzZSA9IDI7XHJcbiAgICAgIGlmIChiYXNlT3V0ID09IDE2KSB7XHJcbiAgICAgICAgc2QgPSBzZCAqIDQgLSAzO1xyXG4gICAgICB9IGVsc2UgaWYgKGJhc2VPdXQgPT0gOCkge1xyXG4gICAgICAgIHNkID0gc2QgKiAzIC0gMjtcclxuICAgICAgfVxyXG4gICAgfSBlbHNlIHtcclxuICAgICAgYmFzZSA9IGJhc2VPdXQ7XHJcbiAgICB9XHJcblxyXG4gICAgLy8gQ29udmVydCB0aGUgbnVtYmVyIGFzIGFuIGludGVnZXIgdGhlbiBkaXZpZGUgdGhlIHJlc3VsdCBieSBpdHMgYmFzZSByYWlzZWQgdG8gYSBwb3dlciBzdWNoXHJcbiAgICAvLyB0aGF0IHRoZSBmcmFjdGlvbiBwYXJ0IHdpbGwgYmUgcmVzdG9yZWQuXHJcblxyXG4gICAgLy8gTm9uLWludGVnZXIuXHJcbiAgICBpZiAoaSA+PSAwKSB7XHJcbiAgICAgIHN0ciA9IHN0ci5yZXBsYWNlKCcuJywgJycpO1xyXG4gICAgICB5ID0gbmV3IEN0b3IoMSk7XHJcbiAgICAgIHkuZSA9IHN0ci5sZW5ndGggLSBpO1xyXG4gICAgICB5LmQgPSBjb252ZXJ0QmFzZShmaW5pdGVUb1N0cmluZyh5KSwgMTAsIGJhc2UpO1xyXG4gICAgICB5LmUgPSB5LmQubGVuZ3RoO1xyXG4gICAgfVxyXG5cclxuICAgIHhkID0gY29udmVydEJhc2Uoc3RyLCAxMCwgYmFzZSk7XHJcbiAgICBlID0gbGVuID0geGQubGVuZ3RoO1xyXG5cclxuICAgIC8vIFJlbW92ZSB0cmFpbGluZyB6ZXJvcy5cclxuICAgIGZvciAoOyB4ZFstLWxlbl0gPT0gMDspIHhkLnBvcCgpO1xyXG5cclxuICAgIGlmICgheGRbMF0pIHtcclxuICAgICAgc3RyID0gaXNFeHAgPyAnMHArMCcgOiAnMCc7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICBpZiAoaSA8IDApIHtcclxuICAgICAgICBlLS07XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgeCA9IG5ldyBDdG9yKHgpO1xyXG4gICAgICAgIHguZCA9IHhkO1xyXG4gICAgICAgIHguZSA9IGU7XHJcbiAgICAgICAgeCA9IGRpdmlkZSh4LCB5LCBzZCwgcm0sIDAsIGJhc2UpO1xyXG4gICAgICAgIHhkID0geC5kO1xyXG4gICAgICAgIGUgPSB4LmU7XHJcbiAgICAgICAgcm91bmRVcCA9IGluZXhhY3Q7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIC8vIFRoZSByb3VuZGluZyBkaWdpdCwgaS5lLiB0aGUgZGlnaXQgYWZ0ZXIgdGhlIGRpZ2l0IHRoYXQgbWF5IGJlIHJvdW5kZWQgdXAuXHJcbiAgICAgIGkgPSB4ZFtzZF07XHJcbiAgICAgIGsgPSBiYXNlIC8gMjtcclxuICAgICAgcm91bmRVcCA9IHJvdW5kVXAgfHwgeGRbc2QgKyAxXSAhPT0gdm9pZCAwO1xyXG5cclxuICAgICAgcm91bmRVcCA9IHJtIDwgNFxyXG4gICAgICAgID8gKGkgIT09IHZvaWQgMCB8fCByb3VuZFVwKSAmJiAocm0gPT09IDAgfHwgcm0gPT09ICh4LnMgPCAwID8gMyA6IDIpKVxyXG4gICAgICAgIDogaSA+IGsgfHwgaSA9PT0gayAmJiAocm0gPT09IDQgfHwgcm91bmRVcCB8fCBybSA9PT0gNiAmJiB4ZFtzZCAtIDFdICYgMSB8fFxyXG4gICAgICAgICAgcm0gPT09ICh4LnMgPCAwID8gOCA6IDcpKTtcclxuXHJcbiAgICAgIHhkLmxlbmd0aCA9IHNkO1xyXG5cclxuICAgICAgaWYgKHJvdW5kVXApIHtcclxuXHJcbiAgICAgICAgLy8gUm91bmRpbmcgdXAgbWF5IG1lYW4gdGhlIHByZXZpb3VzIGRpZ2l0IGhhcyB0byBiZSByb3VuZGVkIHVwIGFuZCBzbyBvbi5cclxuICAgICAgICBmb3IgKDsgKyt4ZFstLXNkXSA+IGJhc2UgLSAxOykge1xyXG4gICAgICAgICAgeGRbc2RdID0gMDtcclxuICAgICAgICAgIGlmICghc2QpIHtcclxuICAgICAgICAgICAgKytlO1xyXG4gICAgICAgICAgICB4ZC51bnNoaWZ0KDEpO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG5cclxuICAgICAgLy8gRGV0ZXJtaW5lIHRyYWlsaW5nIHplcm9zLlxyXG4gICAgICBmb3IgKGxlbiA9IHhkLmxlbmd0aDsgIXhkW2xlbiAtIDFdOyAtLWxlbik7XHJcblxyXG4gICAgICAvLyBFLmcuIFs0LCAxMSwgMTVdIGJlY29tZXMgNGJmLlxyXG4gICAgICBmb3IgKGkgPSAwLCBzdHIgPSAnJzsgaSA8IGxlbjsgaSsrKSBzdHIgKz0gTlVNRVJBTFMuY2hhckF0KHhkW2ldKTtcclxuXHJcbiAgICAgIC8vIEFkZCBiaW5hcnkgZXhwb25lbnQgc3VmZml4P1xyXG4gICAgICBpZiAoaXNFeHApIHtcclxuICAgICAgICBpZiAobGVuID4gMSkge1xyXG4gICAgICAgICAgaWYgKGJhc2VPdXQgPT0gMTYgfHwgYmFzZU91dCA9PSA4KSB7XHJcbiAgICAgICAgICAgIGkgPSBiYXNlT3V0ID09IDE2ID8gNCA6IDM7XHJcbiAgICAgICAgICAgIGZvciAoLS1sZW47IGxlbiAlIGk7IGxlbisrKSBzdHIgKz0gJzAnO1xyXG4gICAgICAgICAgICB4ZCA9IGNvbnZlcnRCYXNlKHN0ciwgYmFzZSwgYmFzZU91dCk7XHJcbiAgICAgICAgICAgIGZvciAobGVuID0geGQubGVuZ3RoOyAheGRbbGVuIC0gMV07IC0tbGVuKTtcclxuXHJcbiAgICAgICAgICAgIC8vIHhkWzBdIHdpbGwgYWx3YXlzIGJlIGJlIDFcclxuICAgICAgICAgICAgZm9yIChpID0gMSwgc3RyID0gJzEuJzsgaSA8IGxlbjsgaSsrKSBzdHIgKz0gTlVNRVJBTFMuY2hhckF0KHhkW2ldKTtcclxuICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHN0ciA9IHN0ci5jaGFyQXQoMCkgKyAnLicgKyBzdHIuc2xpY2UoMSk7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBzdHIgPSAgc3RyICsgKGUgPCAwID8gJ3AnIDogJ3ArJykgKyBlO1xyXG4gICAgICB9IGVsc2UgaWYgKGUgPCAwKSB7XHJcbiAgICAgICAgZm9yICg7ICsrZTspIHN0ciA9ICcwJyArIHN0cjtcclxuICAgICAgICBzdHIgPSAnMC4nICsgc3RyO1xyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIGlmICgrK2UgPiBsZW4pIGZvciAoZSAtPSBsZW47IGUtLSA7KSBzdHIgKz0gJzAnO1xyXG4gICAgICAgIGVsc2UgaWYgKGUgPCBsZW4pIHN0ciA9IHN0ci5zbGljZSgwLCBlKSArICcuJyArIHN0ci5zbGljZShlKTtcclxuICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHN0ciA9IChiYXNlT3V0ID09IDE2ID8gJzB4JyA6IGJhc2VPdXQgPT0gMiA/ICcwYicgOiBiYXNlT3V0ID09IDggPyAnMG8nIDogJycpICsgc3RyO1xyXG4gIH1cclxuXHJcbiAgcmV0dXJuIHgucyA8IDAgPyAnLScgKyBzdHIgOiBzdHI7XHJcbn1cclxuXHJcblxyXG4vLyBEb2VzIG5vdCBzdHJpcCB0cmFpbGluZyB6ZXJvcy5cclxuZnVuY3Rpb24gdHJ1bmNhdGUoYXJyLCBsZW4pIHtcclxuICBpZiAoYXJyLmxlbmd0aCA+IGxlbikge1xyXG4gICAgYXJyLmxlbmd0aCA9IGxlbjtcclxuICAgIHJldHVybiB0cnVlO1xyXG4gIH1cclxufVxyXG5cclxuXHJcbi8vIERlY2ltYWwgbWV0aG9kc1xyXG5cclxuXHJcbi8qXHJcbiAqICBhYnNcclxuICogIGFjb3NcclxuICogIGFjb3NoXHJcbiAqICBhZGRcclxuICogIGFzaW5cclxuICogIGFzaW5oXHJcbiAqICBhdGFuXHJcbiAqICBhdGFuaFxyXG4gKiAgYXRhbjJcclxuICogIGNicnRcclxuICogIGNlaWxcclxuICogIGNsYW1wXHJcbiAqICBjbG9uZVxyXG4gKiAgY29uZmlnXHJcbiAqICBjb3NcclxuICogIGNvc2hcclxuICogIGRpdlxyXG4gKiAgZXhwXHJcbiAqICBmbG9vclxyXG4gKiAgaHlwb3RcclxuICogIGxuXHJcbiAqICBsb2dcclxuICogIGxvZzJcclxuICogIGxvZzEwXHJcbiAqICBtYXhcclxuICogIG1pblxyXG4gKiAgbW9kXHJcbiAqICBtdWxcclxuICogIHBvd1xyXG4gKiAgcmFuZG9tXHJcbiAqICByb3VuZFxyXG4gKiAgc2V0XHJcbiAqICBzaWduXHJcbiAqICBzaW5cclxuICogIHNpbmhcclxuICogIHNxcnRcclxuICogIHN1YlxyXG4gKiAgc3VtXHJcbiAqICB0YW5cclxuICogIHRhbmhcclxuICogIHRydW5jXHJcbiAqL1xyXG5cclxuXHJcbi8qXHJcbiAqIFJldHVybiBhIG5ldyBEZWNpbWFsIHdob3NlIHZhbHVlIGlzIHRoZSBhYnNvbHV0ZSB2YWx1ZSBvZiBgeGAuXHJcbiAqXHJcbiAqIHgge251bWJlcnxzdHJpbmd8RGVjaW1hbH1cclxuICpcclxuICovXHJcbmZ1bmN0aW9uIGFicyh4KSB7XHJcbiAgcmV0dXJuIG5ldyB0aGlzKHgpLmFicygpO1xyXG59XHJcblxyXG5cclxuLypcclxuICogUmV0dXJuIGEgbmV3IERlY2ltYWwgd2hvc2UgdmFsdWUgaXMgdGhlIGFyY2Nvc2luZSBpbiByYWRpYW5zIG9mIGB4YC5cclxuICpcclxuICogeCB7bnVtYmVyfHN0cmluZ3xEZWNpbWFsfVxyXG4gKlxyXG4gKi9cclxuZnVuY3Rpb24gYWNvcyh4KSB7XHJcbiAgcmV0dXJuIG5ldyB0aGlzKHgpLmFjb3MoKTtcclxufVxyXG5cclxuXHJcbi8qXHJcbiAqIFJldHVybiBhIG5ldyBEZWNpbWFsIHdob3NlIHZhbHVlIGlzIHRoZSBpbnZlcnNlIG9mIHRoZSBoeXBlcmJvbGljIGNvc2luZSBvZiBgeGAsIHJvdW5kZWQgdG9cclxuICogYHByZWNpc2lvbmAgc2lnbmlmaWNhbnQgZGlnaXRzIHVzaW5nIHJvdW5kaW5nIG1vZGUgYHJvdW5kaW5nYC5cclxuICpcclxuICogeCB7bnVtYmVyfHN0cmluZ3xEZWNpbWFsfSBBIHZhbHVlIGluIHJhZGlhbnMuXHJcbiAqXHJcbiAqL1xyXG5mdW5jdGlvbiBhY29zaCh4KSB7XHJcbiAgcmV0dXJuIG5ldyB0aGlzKHgpLmFjb3NoKCk7XHJcbn1cclxuXHJcblxyXG4vKlxyXG4gKiBSZXR1cm4gYSBuZXcgRGVjaW1hbCB3aG9zZSB2YWx1ZSBpcyB0aGUgc3VtIG9mIGB4YCBhbmQgYHlgLCByb3VuZGVkIHRvIGBwcmVjaXNpb25gIHNpZ25pZmljYW50XHJcbiAqIGRpZ2l0cyB1c2luZyByb3VuZGluZyBtb2RlIGByb3VuZGluZ2AuXHJcbiAqXHJcbiAqIHgge251bWJlcnxzdHJpbmd8RGVjaW1hbH1cclxuICogeSB7bnVtYmVyfHN0cmluZ3xEZWNpbWFsfVxyXG4gKlxyXG4gKi9cclxuZnVuY3Rpb24gYWRkKHgsIHkpIHtcclxuICByZXR1cm4gbmV3IHRoaXMoeCkucGx1cyh5KTtcclxufVxyXG5cclxuXHJcbi8qXHJcbiAqIFJldHVybiBhIG5ldyBEZWNpbWFsIHdob3NlIHZhbHVlIGlzIHRoZSBhcmNzaW5lIGluIHJhZGlhbnMgb2YgYHhgLCByb3VuZGVkIHRvIGBwcmVjaXNpb25gXHJcbiAqIHNpZ25pZmljYW50IGRpZ2l0cyB1c2luZyByb3VuZGluZyBtb2RlIGByb3VuZGluZ2AuXHJcbiAqXHJcbiAqIHgge251bWJlcnxzdHJpbmd8RGVjaW1hbH1cclxuICpcclxuICovXHJcbmZ1bmN0aW9uIGFzaW4oeCkge1xyXG4gIHJldHVybiBuZXcgdGhpcyh4KS5hc2luKCk7XHJcbn1cclxuXHJcblxyXG4vKlxyXG4gKiBSZXR1cm4gYSBuZXcgRGVjaW1hbCB3aG9zZSB2YWx1ZSBpcyB0aGUgaW52ZXJzZSBvZiB0aGUgaHlwZXJib2xpYyBzaW5lIG9mIGB4YCwgcm91bmRlZCB0b1xyXG4gKiBgcHJlY2lzaW9uYCBzaWduaWZpY2FudCBkaWdpdHMgdXNpbmcgcm91bmRpbmcgbW9kZSBgcm91bmRpbmdgLlxyXG4gKlxyXG4gKiB4IHtudW1iZXJ8c3RyaW5nfERlY2ltYWx9IEEgdmFsdWUgaW4gcmFkaWFucy5cclxuICpcclxuICovXHJcbmZ1bmN0aW9uIGFzaW5oKHgpIHtcclxuICByZXR1cm4gbmV3IHRoaXMoeCkuYXNpbmgoKTtcclxufVxyXG5cclxuXHJcbi8qXHJcbiAqIFJldHVybiBhIG5ldyBEZWNpbWFsIHdob3NlIHZhbHVlIGlzIHRoZSBhcmN0YW5nZW50IGluIHJhZGlhbnMgb2YgYHhgLCByb3VuZGVkIHRvIGBwcmVjaXNpb25gXHJcbiAqIHNpZ25pZmljYW50IGRpZ2l0cyB1c2luZyByb3VuZGluZyBtb2RlIGByb3VuZGluZ2AuXHJcbiAqXHJcbiAqIHgge251bWJlcnxzdHJpbmd8RGVjaW1hbH1cclxuICpcclxuICovXHJcbmZ1bmN0aW9uIGF0YW4oeCkge1xyXG4gIHJldHVybiBuZXcgdGhpcyh4KS5hdGFuKCk7XHJcbn1cclxuXHJcblxyXG4vKlxyXG4gKiBSZXR1cm4gYSBuZXcgRGVjaW1hbCB3aG9zZSB2YWx1ZSBpcyB0aGUgaW52ZXJzZSBvZiB0aGUgaHlwZXJib2xpYyB0YW5nZW50IG9mIGB4YCwgcm91bmRlZCB0b1xyXG4gKiBgcHJlY2lzaW9uYCBzaWduaWZpY2FudCBkaWdpdHMgdXNpbmcgcm91bmRpbmcgbW9kZSBgcm91bmRpbmdgLlxyXG4gKlxyXG4gKiB4IHtudW1iZXJ8c3RyaW5nfERlY2ltYWx9IEEgdmFsdWUgaW4gcmFkaWFucy5cclxuICpcclxuICovXHJcbmZ1bmN0aW9uIGF0YW5oKHgpIHtcclxuICByZXR1cm4gbmV3IHRoaXMoeCkuYXRhbmgoKTtcclxufVxyXG5cclxuXHJcbi8qXHJcbiAqIFJldHVybiBhIG5ldyBEZWNpbWFsIHdob3NlIHZhbHVlIGlzIHRoZSBhcmN0YW5nZW50IGluIHJhZGlhbnMgb2YgYHkveGAgaW4gdGhlIHJhbmdlIC1waSB0byBwaVxyXG4gKiAoaW5jbHVzaXZlKSwgcm91bmRlZCB0byBgcHJlY2lzaW9uYCBzaWduaWZpY2FudCBkaWdpdHMgdXNpbmcgcm91bmRpbmcgbW9kZSBgcm91bmRpbmdgLlxyXG4gKlxyXG4gKiBEb21haW46IFstSW5maW5pdHksIEluZmluaXR5XVxyXG4gKiBSYW5nZTogWy1waSwgcGldXHJcbiAqXHJcbiAqIHkge251bWJlcnxzdHJpbmd8RGVjaW1hbH0gVGhlIHktY29vcmRpbmF0ZS5cclxuICogeCB7bnVtYmVyfHN0cmluZ3xEZWNpbWFsfSBUaGUgeC1jb29yZGluYXRlLlxyXG4gKlxyXG4gKiBhdGFuMihcdTAwQjEwLCAtMCkgICAgICAgICAgICAgICA9IFx1MDBCMXBpXHJcbiAqIGF0YW4yKFx1MDBCMTAsICswKSAgICAgICAgICAgICAgID0gXHUwMEIxMFxyXG4gKiBhdGFuMihcdTAwQjEwLCAteCkgICAgICAgICAgICAgICA9IFx1MDBCMXBpIGZvciB4ID4gMFxyXG4gKiBhdGFuMihcdTAwQjEwLCB4KSAgICAgICAgICAgICAgICA9IFx1MDBCMTAgZm9yIHggPiAwXHJcbiAqIGF0YW4yKC15LCBcdTAwQjEwKSAgICAgICAgICAgICAgID0gLXBpLzIgZm9yIHkgPiAwXHJcbiAqIGF0YW4yKHksIFx1MDBCMTApICAgICAgICAgICAgICAgID0gcGkvMiBmb3IgeSA+IDBcclxuICogYXRhbjIoXHUwMEIxeSwgLUluZmluaXR5KSAgICAgICAgPSBcdTAwQjFwaSBmb3IgZmluaXRlIHkgPiAwXHJcbiAqIGF0YW4yKFx1MDBCMXksICtJbmZpbml0eSkgICAgICAgID0gXHUwMEIxMCBmb3IgZmluaXRlIHkgPiAwXHJcbiAqIGF0YW4yKFx1MDBCMUluZmluaXR5LCB4KSAgICAgICAgID0gXHUwMEIxcGkvMiBmb3IgZmluaXRlIHhcclxuICogYXRhbjIoXHUwMEIxSW5maW5pdHksIC1JbmZpbml0eSkgPSBcdTAwQjEzKnBpLzRcclxuICogYXRhbjIoXHUwMEIxSW5maW5pdHksICtJbmZpbml0eSkgPSBcdTAwQjFwaS80XHJcbiAqIGF0YW4yKE5hTiwgeCkgPSBOYU5cclxuICogYXRhbjIoeSwgTmFOKSA9IE5hTlxyXG4gKlxyXG4gKi9cclxuZnVuY3Rpb24gYXRhbjIoeSwgeCkge1xyXG4gIHkgPSBuZXcgdGhpcyh5KTtcclxuICB4ID0gbmV3IHRoaXMoeCk7XHJcbiAgdmFyIHIsXHJcbiAgICBwciA9IHRoaXMucHJlY2lzaW9uLFxyXG4gICAgcm0gPSB0aGlzLnJvdW5kaW5nLFxyXG4gICAgd3ByID0gcHIgKyA0O1xyXG5cclxuICAvLyBFaXRoZXIgTmFOXHJcbiAgaWYgKCF5LnMgfHwgIXgucykge1xyXG4gICAgciA9IG5ldyB0aGlzKE5hTik7XHJcblxyXG4gIC8vIEJvdGggXHUwMEIxSW5maW5pdHlcclxuICB9IGVsc2UgaWYgKCF5LmQgJiYgIXguZCkge1xyXG4gICAgciA9IGdldFBpKHRoaXMsIHdwciwgMSkudGltZXMoeC5zID4gMCA/IDAuMjUgOiAwLjc1KTtcclxuICAgIHIucyA9IHkucztcclxuXHJcbiAgLy8geCBpcyBcdTAwQjFJbmZpbml0eSBvciB5IGlzIFx1MDBCMTBcclxuICB9IGVsc2UgaWYgKCF4LmQgfHwgeS5pc1plcm8oKSkge1xyXG4gICAgciA9IHgucyA8IDAgPyBnZXRQaSh0aGlzLCBwciwgcm0pIDogbmV3IHRoaXMoMCk7XHJcbiAgICByLnMgPSB5LnM7XHJcblxyXG4gIC8vIHkgaXMgXHUwMEIxSW5maW5pdHkgb3IgeCBpcyBcdTAwQjEwXHJcbiAgfSBlbHNlIGlmICgheS5kIHx8IHguaXNaZXJvKCkpIHtcclxuICAgIHIgPSBnZXRQaSh0aGlzLCB3cHIsIDEpLnRpbWVzKDAuNSk7XHJcbiAgICByLnMgPSB5LnM7XHJcblxyXG4gIC8vIEJvdGggbm9uLXplcm8gYW5kIGZpbml0ZVxyXG4gIH0gZWxzZSBpZiAoeC5zIDwgMCkge1xyXG4gICAgdGhpcy5wcmVjaXNpb24gPSB3cHI7XHJcbiAgICB0aGlzLnJvdW5kaW5nID0gMTtcclxuICAgIHIgPSB0aGlzLmF0YW4oZGl2aWRlKHksIHgsIHdwciwgMSkpO1xyXG4gICAgeCA9IGdldFBpKHRoaXMsIHdwciwgMSk7XHJcbiAgICB0aGlzLnByZWNpc2lvbiA9IHByO1xyXG4gICAgdGhpcy5yb3VuZGluZyA9IHJtO1xyXG4gICAgciA9IHkucyA8IDAgPyByLm1pbnVzKHgpIDogci5wbHVzKHgpO1xyXG4gIH0gZWxzZSB7XHJcbiAgICByID0gdGhpcy5hdGFuKGRpdmlkZSh5LCB4LCB3cHIsIDEpKTtcclxuICB9XHJcblxyXG4gIHJldHVybiByO1xyXG59XHJcblxyXG5cclxuLypcclxuICogUmV0dXJuIGEgbmV3IERlY2ltYWwgd2hvc2UgdmFsdWUgaXMgdGhlIGN1YmUgcm9vdCBvZiBgeGAsIHJvdW5kZWQgdG8gYHByZWNpc2lvbmAgc2lnbmlmaWNhbnRcclxuICogZGlnaXRzIHVzaW5nIHJvdW5kaW5nIG1vZGUgYHJvdW5kaW5nYC5cclxuICpcclxuICogeCB7bnVtYmVyfHN0cmluZ3xEZWNpbWFsfVxyXG4gKlxyXG4gKi9cclxuZnVuY3Rpb24gY2JydCh4KSB7XHJcbiAgcmV0dXJuIG5ldyB0aGlzKHgpLmNicnQoKTtcclxufVxyXG5cclxuXHJcbi8qXHJcbiAqIFJldHVybiBhIG5ldyBEZWNpbWFsIHdob3NlIHZhbHVlIGlzIGB4YCByb3VuZGVkIHRvIGFuIGludGVnZXIgdXNpbmcgYFJPVU5EX0NFSUxgLlxyXG4gKlxyXG4gKiB4IHtudW1iZXJ8c3RyaW5nfERlY2ltYWx9XHJcbiAqXHJcbiAqL1xyXG5mdW5jdGlvbiBjZWlsKHgpIHtcclxuICByZXR1cm4gZmluYWxpc2UoeCA9IG5ldyB0aGlzKHgpLCB4LmUgKyAxLCAyKTtcclxufVxyXG5cclxuXHJcbi8qXHJcbiAqIFJldHVybiBhIG5ldyBEZWNpbWFsIHdob3NlIHZhbHVlIGlzIGB4YCBjbGFtcGVkIHRvIHRoZSByYW5nZSBkZWxpbmVhdGVkIGJ5IGBtaW5gIGFuZCBgbWF4YC5cclxuICpcclxuICogeCB7bnVtYmVyfHN0cmluZ3xEZWNpbWFsfVxyXG4gKiBtaW4ge251bWJlcnxzdHJpbmd8RGVjaW1hbH1cclxuICogbWF4IHtudW1iZXJ8c3RyaW5nfERlY2ltYWx9XHJcbiAqXHJcbiAqL1xyXG5mdW5jdGlvbiBjbGFtcCh4LCBtaW4sIG1heCkge1xyXG4gIHJldHVybiBuZXcgdGhpcyh4KS5jbGFtcChtaW4sIG1heCk7XHJcbn1cclxuXHJcblxyXG4vKlxyXG4gKiBDb25maWd1cmUgZ2xvYmFsIHNldHRpbmdzIGZvciBhIERlY2ltYWwgY29uc3RydWN0b3IuXHJcbiAqXHJcbiAqIGBvYmpgIGlzIGFuIG9iamVjdCB3aXRoIG9uZSBvciBtb3JlIG9mIHRoZSBmb2xsb3dpbmcgcHJvcGVydGllcyxcclxuICpcclxuICogICBwcmVjaXNpb24gIHtudW1iZXJ9XHJcbiAqICAgcm91bmRpbmcgICB7bnVtYmVyfVxyXG4gKiAgIHRvRXhwTmVnICAge251bWJlcn1cclxuICogICB0b0V4cFBvcyAgIHtudW1iZXJ9XHJcbiAqICAgbWF4RSAgICAgICB7bnVtYmVyfVxyXG4gKiAgIG1pbkUgICAgICAge251bWJlcn1cclxuICogICBtb2R1bG8gICAgIHtudW1iZXJ9XHJcbiAqICAgY3J5cHRvICAgICB7Ym9vbGVhbnxudW1iZXJ9XHJcbiAqICAgZGVmYXVsdHMgICB7dHJ1ZX1cclxuICpcclxuICogRS5nLiBEZWNpbWFsLmNvbmZpZyh7IHByZWNpc2lvbjogMjAsIHJvdW5kaW5nOiA0IH0pXHJcbiAqXHJcbiAqL1xyXG5mdW5jdGlvbiBjb25maWcob2JqKSB7XHJcbiAgaWYgKCFvYmogfHwgdHlwZW9mIG9iaiAhPT0gJ29iamVjdCcpIHRocm93IEVycm9yKGRlY2ltYWxFcnJvciArICdPYmplY3QgZXhwZWN0ZWQnKTtcclxuICB2YXIgaSwgcCwgdixcclxuICAgIHVzZURlZmF1bHRzID0gb2JqLmRlZmF1bHRzID09PSB0cnVlLFxyXG4gICAgcHMgPSBbXHJcbiAgICAgICdwcmVjaXNpb24nLCAxLCBNQVhfRElHSVRTLFxyXG4gICAgICAncm91bmRpbmcnLCAwLCA4LFxyXG4gICAgICAndG9FeHBOZWcnLCAtRVhQX0xJTUlULCAwLFxyXG4gICAgICAndG9FeHBQb3MnLCAwLCBFWFBfTElNSVQsXHJcbiAgICAgICdtYXhFJywgMCwgRVhQX0xJTUlULFxyXG4gICAgICAnbWluRScsIC1FWFBfTElNSVQsIDAsXHJcbiAgICAgICdtb2R1bG8nLCAwLCA5XHJcbiAgICBdO1xyXG5cclxuICBmb3IgKGkgPSAwOyBpIDwgcHMubGVuZ3RoOyBpICs9IDMpIHtcclxuICAgIGlmIChwID0gcHNbaV0sIHVzZURlZmF1bHRzKSB0aGlzW3BdID0gREVGQVVMVFNbcF07XHJcbiAgICBpZiAoKHYgPSBvYmpbcF0pICE9PSB2b2lkIDApIHtcclxuICAgICAgaWYgKG1hdGhmbG9vcih2KSA9PT0gdiAmJiB2ID49IHBzW2kgKyAxXSAmJiB2IDw9IHBzW2kgKyAyXSkgdGhpc1twXSA9IHY7XHJcbiAgICAgIGVsc2UgdGhyb3cgRXJyb3IoaW52YWxpZEFyZ3VtZW50ICsgcCArICc6ICcgKyB2KTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIGlmIChwID0gJ2NyeXB0bycsIHVzZURlZmF1bHRzKSB0aGlzW3BdID0gREVGQVVMVFNbcF07XHJcbiAgaWYgKCh2ID0gb2JqW3BdKSAhPT0gdm9pZCAwKSB7XHJcbiAgICBpZiAodiA9PT0gdHJ1ZSB8fCB2ID09PSBmYWxzZSB8fCB2ID09PSAwIHx8IHYgPT09IDEpIHtcclxuICAgICAgaWYgKHYpIHtcclxuICAgICAgICBpZiAodHlwZW9mIGNyeXB0byAhPSAndW5kZWZpbmVkJyAmJiBjcnlwdG8gJiZcclxuICAgICAgICAgIChjcnlwdG8uZ2V0UmFuZG9tVmFsdWVzIHx8IGNyeXB0by5yYW5kb21CeXRlcykpIHtcclxuICAgICAgICAgIHRoaXNbcF0gPSB0cnVlO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICB0aHJvdyBFcnJvcihjcnlwdG9VbmF2YWlsYWJsZSk7XHJcbiAgICAgICAgfVxyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIHRoaXNbcF0gPSBmYWxzZTtcclxuICAgICAgfVxyXG4gICAgfSBlbHNlIHtcclxuICAgICAgdGhyb3cgRXJyb3IoaW52YWxpZEFyZ3VtZW50ICsgcCArICc6ICcgKyB2KTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIHJldHVybiB0aGlzO1xyXG59XHJcblxyXG5cclxuLypcclxuICogUmV0dXJuIGEgbmV3IERlY2ltYWwgd2hvc2UgdmFsdWUgaXMgdGhlIGNvc2luZSBvZiBgeGAsIHJvdW5kZWQgdG8gYHByZWNpc2lvbmAgc2lnbmlmaWNhbnRcclxuICogZGlnaXRzIHVzaW5nIHJvdW5kaW5nIG1vZGUgYHJvdW5kaW5nYC5cclxuICpcclxuICogeCB7bnVtYmVyfHN0cmluZ3xEZWNpbWFsfSBBIHZhbHVlIGluIHJhZGlhbnMuXHJcbiAqXHJcbiAqL1xyXG5mdW5jdGlvbiBjb3MoeCkge1xyXG4gIHJldHVybiBuZXcgdGhpcyh4KS5jb3MoKTtcclxufVxyXG5cclxuXHJcbi8qXHJcbiAqIFJldHVybiBhIG5ldyBEZWNpbWFsIHdob3NlIHZhbHVlIGlzIHRoZSBoeXBlcmJvbGljIGNvc2luZSBvZiBgeGAsIHJvdW5kZWQgdG8gcHJlY2lzaW9uXHJcbiAqIHNpZ25pZmljYW50IGRpZ2l0cyB1c2luZyByb3VuZGluZyBtb2RlIGByb3VuZGluZ2AuXHJcbiAqXHJcbiAqIHgge251bWJlcnxzdHJpbmd8RGVjaW1hbH0gQSB2YWx1ZSBpbiByYWRpYW5zLlxyXG4gKlxyXG4gKi9cclxuZnVuY3Rpb24gY29zaCh4KSB7XHJcbiAgcmV0dXJuIG5ldyB0aGlzKHgpLmNvc2goKTtcclxufVxyXG5cclxuXHJcbi8qXHJcbiAqIENyZWF0ZSBhbmQgcmV0dXJuIGEgRGVjaW1hbCBjb25zdHJ1Y3RvciB3aXRoIHRoZSBzYW1lIGNvbmZpZ3VyYXRpb24gcHJvcGVydGllcyBhcyB0aGlzIERlY2ltYWxcclxuICogY29uc3RydWN0b3IuXHJcbiAqXHJcbiAqL1xyXG5mdW5jdGlvbiBjbG9uZShvYmopIHtcclxuICB2YXIgaSwgcCwgcHM7XHJcblxyXG4gIC8qXHJcbiAgICogVGhlIERlY2ltYWwgY29uc3RydWN0b3IgYW5kIGV4cG9ydGVkIGZ1bmN0aW9uLlxyXG4gICAqIFJldHVybiBhIG5ldyBEZWNpbWFsIGluc3RhbmNlLlxyXG4gICAqXHJcbiAgICogdiB7bnVtYmVyfHN0cmluZ3xEZWNpbWFsfSBBIG51bWVyaWMgdmFsdWUuXHJcbiAgICpcclxuICAgKi9cclxuICBmdW5jdGlvbiBEZWNpbWFsKHYpIHtcclxuICAgIHZhciBlLCBpLCB0LFxyXG4gICAgICB4ID0gdGhpcztcclxuXHJcbiAgICAvLyBEZWNpbWFsIGNhbGxlZCB3aXRob3V0IG5ldy5cclxuICAgIGlmICghKHggaW5zdGFuY2VvZiBEZWNpbWFsKSkgcmV0dXJuIG5ldyBEZWNpbWFsKHYpO1xyXG5cclxuICAgIC8vIFJldGFpbiBhIHJlZmVyZW5jZSB0byB0aGlzIERlY2ltYWwgY29uc3RydWN0b3IsIGFuZCBzaGFkb3cgRGVjaW1hbC5wcm90b3R5cGUuY29uc3RydWN0b3JcclxuICAgIC8vIHdoaWNoIHBvaW50cyB0byBPYmplY3QuXHJcbiAgICB4LmNvbnN0cnVjdG9yID0gRGVjaW1hbDtcclxuXHJcbiAgICAvLyBEdXBsaWNhdGUuXHJcbiAgICBpZiAoaXNEZWNpbWFsSW5zdGFuY2UodikpIHtcclxuICAgICAgeC5zID0gdi5zO1xyXG5cclxuICAgICAgaWYgKGV4dGVybmFsKSB7XHJcbiAgICAgICAgaWYgKCF2LmQgfHwgdi5lID4gRGVjaW1hbC5tYXhFKSB7XHJcblxyXG4gICAgICAgICAgLy8gSW5maW5pdHkuXHJcbiAgICAgICAgICB4LmUgPSBOYU47XHJcbiAgICAgICAgICB4LmQgPSBudWxsO1xyXG4gICAgICAgIH0gZWxzZSBpZiAodi5lIDwgRGVjaW1hbC5taW5FKSB7XHJcblxyXG4gICAgICAgICAgLy8gWmVyby5cclxuICAgICAgICAgIHguZSA9IDA7XHJcbiAgICAgICAgICB4LmQgPSBbMF07XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgIHguZSA9IHYuZTtcclxuICAgICAgICAgIHguZCA9IHYuZC5zbGljZSgpO1xyXG4gICAgICAgIH1cclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICB4LmUgPSB2LmU7XHJcbiAgICAgICAgeC5kID0gdi5kID8gdi5kLnNsaWNlKCkgOiB2LmQ7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIHJldHVybjtcclxuICAgIH1cclxuXHJcbiAgICB0ID0gdHlwZW9mIHY7XHJcblxyXG4gICAgaWYgKHQgPT09ICdudW1iZXInKSB7XHJcbiAgICAgIGlmICh2ID09PSAwKSB7XHJcbiAgICAgICAgeC5zID0gMSAvIHYgPCAwID8gLTEgOiAxO1xyXG4gICAgICAgIHguZSA9IDA7XHJcbiAgICAgICAgeC5kID0gWzBdO1xyXG4gICAgICAgIHJldHVybjtcclxuICAgICAgfVxyXG5cclxuICAgICAgaWYgKHYgPCAwKSB7XHJcbiAgICAgICAgdiA9IC12O1xyXG4gICAgICAgIHgucyA9IC0xO1xyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIHgucyA9IDE7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIC8vIEZhc3QgcGF0aCBmb3Igc21hbGwgaW50ZWdlcnMuXHJcbiAgICAgIGlmICh2ID09PSB+fnYgJiYgdiA8IDFlNykge1xyXG4gICAgICAgIGZvciAoZSA9IDAsIGkgPSB2OyBpID49IDEwOyBpIC89IDEwKSBlKys7XHJcblxyXG4gICAgICAgIGlmIChleHRlcm5hbCkge1xyXG4gICAgICAgICAgaWYgKGUgPiBEZWNpbWFsLm1heEUpIHtcclxuICAgICAgICAgICAgeC5lID0gTmFOO1xyXG4gICAgICAgICAgICB4LmQgPSBudWxsO1xyXG4gICAgICAgICAgfSBlbHNlIGlmIChlIDwgRGVjaW1hbC5taW5FKSB7XHJcbiAgICAgICAgICAgIHguZSA9IDA7XHJcbiAgICAgICAgICAgIHguZCA9IFswXTtcclxuICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHguZSA9IGU7XHJcbiAgICAgICAgICAgIHguZCA9IFt2XTtcclxuICAgICAgICAgIH1cclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgeC5lID0gZTtcclxuICAgICAgICAgIHguZCA9IFt2XTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybjtcclxuXHJcbiAgICAgIC8vIEluZmluaXR5LCBOYU4uXHJcbiAgICAgIH0gZWxzZSBpZiAodiAqIDAgIT09IDApIHtcclxuICAgICAgICBpZiAoIXYpIHgucyA9IE5hTjtcclxuICAgICAgICB4LmUgPSBOYU47XHJcbiAgICAgICAgeC5kID0gbnVsbDtcclxuICAgICAgICByZXR1cm47XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIHJldHVybiBwYXJzZURlY2ltYWwoeCwgdi50b1N0cmluZygpKTtcclxuXHJcbiAgICB9IGVsc2UgaWYgKHQgIT09ICdzdHJpbmcnKSB7XHJcbiAgICAgIHRocm93IEVycm9yKGludmFsaWRBcmd1bWVudCArIHYpO1xyXG4gICAgfVxyXG5cclxuICAgIC8vIE1pbnVzIHNpZ24/XHJcbiAgICBpZiAoKGkgPSB2LmNoYXJDb2RlQXQoMCkpID09PSA0NSkge1xyXG4gICAgICB2ID0gdi5zbGljZSgxKTtcclxuICAgICAgeC5zID0gLTE7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICAvLyBQbHVzIHNpZ24/XHJcbiAgICAgIGlmIChpID09PSA0MykgdiA9IHYuc2xpY2UoMSk7XHJcbiAgICAgIHgucyA9IDE7XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIGlzRGVjaW1hbC50ZXN0KHYpID8gcGFyc2VEZWNpbWFsKHgsIHYpIDogcGFyc2VPdGhlcih4LCB2KTtcclxuICB9XHJcblxyXG4gIERlY2ltYWwucHJvdG90eXBlID0gUDtcclxuXHJcbiAgRGVjaW1hbC5ST1VORF9VUCA9IDA7XHJcbiAgRGVjaW1hbC5ST1VORF9ET1dOID0gMTtcclxuICBEZWNpbWFsLlJPVU5EX0NFSUwgPSAyO1xyXG4gIERlY2ltYWwuUk9VTkRfRkxPT1IgPSAzO1xyXG4gIERlY2ltYWwuUk9VTkRfSEFMRl9VUCA9IDQ7XHJcbiAgRGVjaW1hbC5ST1VORF9IQUxGX0RPV04gPSA1O1xyXG4gIERlY2ltYWwuUk9VTkRfSEFMRl9FVkVOID0gNjtcclxuICBEZWNpbWFsLlJPVU5EX0hBTEZfQ0VJTCA9IDc7XHJcbiAgRGVjaW1hbC5ST1VORF9IQUxGX0ZMT09SID0gODtcclxuICBEZWNpbWFsLkVVQ0xJRCA9IDk7XHJcblxyXG4gIERlY2ltYWwuY29uZmlnID0gRGVjaW1hbC5zZXQgPSBjb25maWc7XHJcbiAgRGVjaW1hbC5jbG9uZSA9IGNsb25lO1xyXG4gIERlY2ltYWwuaXNEZWNpbWFsID0gaXNEZWNpbWFsSW5zdGFuY2U7XHJcblxyXG4gIERlY2ltYWwuYWJzID0gYWJzO1xyXG4gIERlY2ltYWwuYWNvcyA9IGFjb3M7XHJcbiAgRGVjaW1hbC5hY29zaCA9IGFjb3NoOyAgICAgICAgLy8gRVM2XHJcbiAgRGVjaW1hbC5hZGQgPSBhZGQ7XHJcbiAgRGVjaW1hbC5hc2luID0gYXNpbjtcclxuICBEZWNpbWFsLmFzaW5oID0gYXNpbmg7ICAgICAgICAvLyBFUzZcclxuICBEZWNpbWFsLmF0YW4gPSBhdGFuO1xyXG4gIERlY2ltYWwuYXRhbmggPSBhdGFuaDsgICAgICAgIC8vIEVTNlxyXG4gIERlY2ltYWwuYXRhbjIgPSBhdGFuMjtcclxuICBEZWNpbWFsLmNicnQgPSBjYnJ0OyAgICAgICAgICAvLyBFUzZcclxuICBEZWNpbWFsLmNlaWwgPSBjZWlsO1xyXG4gIERlY2ltYWwuY2xhbXAgPSBjbGFtcDtcclxuICBEZWNpbWFsLmNvcyA9IGNvcztcclxuICBEZWNpbWFsLmNvc2ggPSBjb3NoOyAgICAgICAgICAvLyBFUzZcclxuICBEZWNpbWFsLmRpdiA9IGRpdjtcclxuICBEZWNpbWFsLmV4cCA9IGV4cDtcclxuICBEZWNpbWFsLmZsb29yID0gZmxvb3I7XHJcbiAgRGVjaW1hbC5oeXBvdCA9IGh5cG90OyAgICAgICAgLy8gRVM2XHJcbiAgRGVjaW1hbC5sbiA9IGxuO1xyXG4gIERlY2ltYWwubG9nID0gbG9nO1xyXG4gIERlY2ltYWwubG9nMTAgPSBsb2cxMDsgICAgICAgIC8vIEVTNlxyXG4gIERlY2ltYWwubG9nMiA9IGxvZzI7ICAgICAgICAgIC8vIEVTNlxyXG4gIERlY2ltYWwubWF4ID0gbWF4O1xyXG4gIERlY2ltYWwubWluID0gbWluO1xyXG4gIERlY2ltYWwubW9kID0gbW9kO1xyXG4gIERlY2ltYWwubXVsID0gbXVsO1xyXG4gIERlY2ltYWwucG93ID0gcG93O1xyXG4gIERlY2ltYWwucmFuZG9tID0gcmFuZG9tO1xyXG4gIERlY2ltYWwucm91bmQgPSByb3VuZDtcclxuICBEZWNpbWFsLnNpZ24gPSBzaWduOyAgICAgICAgICAvLyBFUzZcclxuICBEZWNpbWFsLnNpbiA9IHNpbjtcclxuICBEZWNpbWFsLnNpbmggPSBzaW5oOyAgICAgICAgICAvLyBFUzZcclxuICBEZWNpbWFsLnNxcnQgPSBzcXJ0O1xyXG4gIERlY2ltYWwuc3ViID0gc3ViO1xyXG4gIERlY2ltYWwuc3VtID0gc3VtO1xyXG4gIERlY2ltYWwudGFuID0gdGFuO1xyXG4gIERlY2ltYWwudGFuaCA9IHRhbmg7ICAgICAgICAgIC8vIEVTNlxyXG4gIERlY2ltYWwudHJ1bmMgPSB0cnVuYzsgICAgICAgIC8vIEVTNlxyXG5cclxuICBpZiAob2JqID09PSB2b2lkIDApIG9iaiA9IHt9O1xyXG4gIGlmIChvYmopIHtcclxuICAgIGlmIChvYmouZGVmYXVsdHMgIT09IHRydWUpIHtcclxuICAgICAgcHMgPSBbJ3ByZWNpc2lvbicsICdyb3VuZGluZycsICd0b0V4cE5lZycsICd0b0V4cFBvcycsICdtYXhFJywgJ21pbkUnLCAnbW9kdWxvJywgJ2NyeXB0byddO1xyXG4gICAgICBmb3IgKGkgPSAwOyBpIDwgcHMubGVuZ3RoOykgaWYgKCFvYmouaGFzT3duUHJvcGVydHkocCA9IHBzW2krK10pKSBvYmpbcF0gPSB0aGlzW3BdO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgRGVjaW1hbC5jb25maWcob2JqKTtcclxuXHJcbiAgcmV0dXJuIERlY2ltYWw7XHJcbn1cclxuXHJcblxyXG4vKlxyXG4gKiBSZXR1cm4gYSBuZXcgRGVjaW1hbCB3aG9zZSB2YWx1ZSBpcyBgeGAgZGl2aWRlZCBieSBgeWAsIHJvdW5kZWQgdG8gYHByZWNpc2lvbmAgc2lnbmlmaWNhbnRcclxuICogZGlnaXRzIHVzaW5nIHJvdW5kaW5nIG1vZGUgYHJvdW5kaW5nYC5cclxuICpcclxuICogeCB7bnVtYmVyfHN0cmluZ3xEZWNpbWFsfVxyXG4gKiB5IHtudW1iZXJ8c3RyaW5nfERlY2ltYWx9XHJcbiAqXHJcbiAqL1xyXG5mdW5jdGlvbiBkaXYoeCwgeSkge1xyXG4gIHJldHVybiBuZXcgdGhpcyh4KS5kaXYoeSk7XHJcbn1cclxuXHJcblxyXG4vKlxyXG4gKiBSZXR1cm4gYSBuZXcgRGVjaW1hbCB3aG9zZSB2YWx1ZSBpcyB0aGUgbmF0dXJhbCBleHBvbmVudGlhbCBvZiBgeGAsIHJvdW5kZWQgdG8gYHByZWNpc2lvbmBcclxuICogc2lnbmlmaWNhbnQgZGlnaXRzIHVzaW5nIHJvdW5kaW5nIG1vZGUgYHJvdW5kaW5nYC5cclxuICpcclxuICogeCB7bnVtYmVyfHN0cmluZ3xEZWNpbWFsfSBUaGUgcG93ZXIgdG8gd2hpY2ggdG8gcmFpc2UgdGhlIGJhc2Ugb2YgdGhlIG5hdHVyYWwgbG9nLlxyXG4gKlxyXG4gKi9cclxuZnVuY3Rpb24gZXhwKHgpIHtcclxuICByZXR1cm4gbmV3IHRoaXMoeCkuZXhwKCk7XHJcbn1cclxuXHJcblxyXG4vKlxyXG4gKiBSZXR1cm4gYSBuZXcgRGVjaW1hbCB3aG9zZSB2YWx1ZSBpcyBgeGAgcm91bmQgdG8gYW4gaW50ZWdlciB1c2luZyBgUk9VTkRfRkxPT1JgLlxyXG4gKlxyXG4gKiB4IHtudW1iZXJ8c3RyaW5nfERlY2ltYWx9XHJcbiAqXHJcbiAqL1xyXG5mdW5jdGlvbiBmbG9vcih4KSB7XHJcbiAgcmV0dXJuIGZpbmFsaXNlKHggPSBuZXcgdGhpcyh4KSwgeC5lICsgMSwgMyk7XHJcbn1cclxuXHJcblxyXG4vKlxyXG4gKiBSZXR1cm4gYSBuZXcgRGVjaW1hbCB3aG9zZSB2YWx1ZSBpcyB0aGUgc3F1YXJlIHJvb3Qgb2YgdGhlIHN1bSBvZiB0aGUgc3F1YXJlcyBvZiB0aGUgYXJndW1lbnRzLFxyXG4gKiByb3VuZGVkIHRvIGBwcmVjaXNpb25gIHNpZ25pZmljYW50IGRpZ2l0cyB1c2luZyByb3VuZGluZyBtb2RlIGByb3VuZGluZ2AuXHJcbiAqXHJcbiAqIGh5cG90KGEsIGIsIC4uLikgPSBzcXJ0KGFeMiArIGJeMiArIC4uLilcclxuICpcclxuICogYXJndW1lbnRzIHtudW1iZXJ8c3RyaW5nfERlY2ltYWx9XHJcbiAqXHJcbiAqL1xyXG5mdW5jdGlvbiBoeXBvdCgpIHtcclxuICB2YXIgaSwgbixcclxuICAgIHQgPSBuZXcgdGhpcygwKTtcclxuXHJcbiAgZXh0ZXJuYWwgPSBmYWxzZTtcclxuXHJcbiAgZm9yIChpID0gMDsgaSA8IGFyZ3VtZW50cy5sZW5ndGg7KSB7XHJcbiAgICBuID0gbmV3IHRoaXMoYXJndW1lbnRzW2krK10pO1xyXG4gICAgaWYgKCFuLmQpIHtcclxuICAgICAgaWYgKG4ucykge1xyXG4gICAgICAgIGV4dGVybmFsID0gdHJ1ZTtcclxuICAgICAgICByZXR1cm4gbmV3IHRoaXMoMSAvIDApO1xyXG4gICAgICB9XHJcbiAgICAgIHQgPSBuO1xyXG4gICAgfSBlbHNlIGlmICh0LmQpIHtcclxuICAgICAgdCA9IHQucGx1cyhuLnRpbWVzKG4pKTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIGV4dGVybmFsID0gdHJ1ZTtcclxuXHJcbiAgcmV0dXJuIHQuc3FydCgpO1xyXG59XHJcblxyXG5cclxuLypcclxuICogUmV0dXJuIHRydWUgaWYgb2JqZWN0IGlzIGEgRGVjaW1hbCBpbnN0YW5jZSAod2hlcmUgRGVjaW1hbCBpcyBhbnkgRGVjaW1hbCBjb25zdHJ1Y3RvciksXHJcbiAqIG90aGVyd2lzZSByZXR1cm4gZmFsc2UuXHJcbiAqXHJcbiAqL1xyXG5mdW5jdGlvbiBpc0RlY2ltYWxJbnN0YW5jZShvYmopIHtcclxuICByZXR1cm4gb2JqIGluc3RhbmNlb2YgRGVjaW1hbCB8fCBvYmogJiYgb2JqLnRvU3RyaW5nVGFnID09PSB0YWcgfHwgZmFsc2U7XHJcbn1cclxuXHJcblxyXG4vKlxyXG4gKiBSZXR1cm4gYSBuZXcgRGVjaW1hbCB3aG9zZSB2YWx1ZSBpcyB0aGUgbmF0dXJhbCBsb2dhcml0aG0gb2YgYHhgLCByb3VuZGVkIHRvIGBwcmVjaXNpb25gXHJcbiAqIHNpZ25pZmljYW50IGRpZ2l0cyB1c2luZyByb3VuZGluZyBtb2RlIGByb3VuZGluZ2AuXHJcbiAqXHJcbiAqIHgge251bWJlcnxzdHJpbmd8RGVjaW1hbH1cclxuICpcclxuICovXHJcbmZ1bmN0aW9uIGxuKHgpIHtcclxuICByZXR1cm4gbmV3IHRoaXMoeCkubG4oKTtcclxufVxyXG5cclxuXHJcbi8qXHJcbiAqIFJldHVybiBhIG5ldyBEZWNpbWFsIHdob3NlIHZhbHVlIGlzIHRoZSBsb2cgb2YgYHhgIHRvIHRoZSBiYXNlIGB5YCwgb3IgdG8gYmFzZSAxMCBpZiBubyBiYXNlXHJcbiAqIGlzIHNwZWNpZmllZCwgcm91bmRlZCB0byBgcHJlY2lzaW9uYCBzaWduaWZpY2FudCBkaWdpdHMgdXNpbmcgcm91bmRpbmcgbW9kZSBgcm91bmRpbmdgLlxyXG4gKlxyXG4gKiBsb2dbeV0oeClcclxuICpcclxuICogeCB7bnVtYmVyfHN0cmluZ3xEZWNpbWFsfSBUaGUgYXJndW1lbnQgb2YgdGhlIGxvZ2FyaXRobS5cclxuICogeSB7bnVtYmVyfHN0cmluZ3xEZWNpbWFsfSBUaGUgYmFzZSBvZiB0aGUgbG9nYXJpdGhtLlxyXG4gKlxyXG4gKi9cclxuZnVuY3Rpb24gbG9nKHgsIHkpIHtcclxuICByZXR1cm4gbmV3IHRoaXMoeCkubG9nKHkpO1xyXG59XHJcblxyXG5cclxuLypcclxuICogUmV0dXJuIGEgbmV3IERlY2ltYWwgd2hvc2UgdmFsdWUgaXMgdGhlIGJhc2UgMiBsb2dhcml0aG0gb2YgYHhgLCByb3VuZGVkIHRvIGBwcmVjaXNpb25gXHJcbiAqIHNpZ25pZmljYW50IGRpZ2l0cyB1c2luZyByb3VuZGluZyBtb2RlIGByb3VuZGluZ2AuXHJcbiAqXHJcbiAqIHgge251bWJlcnxzdHJpbmd8RGVjaW1hbH1cclxuICpcclxuICovXHJcbmZ1bmN0aW9uIGxvZzIoeCkge1xyXG4gIHJldHVybiBuZXcgdGhpcyh4KS5sb2coMik7XHJcbn1cclxuXHJcblxyXG4vKlxyXG4gKiBSZXR1cm4gYSBuZXcgRGVjaW1hbCB3aG9zZSB2YWx1ZSBpcyB0aGUgYmFzZSAxMCBsb2dhcml0aG0gb2YgYHhgLCByb3VuZGVkIHRvIGBwcmVjaXNpb25gXHJcbiAqIHNpZ25pZmljYW50IGRpZ2l0cyB1c2luZyByb3VuZGluZyBtb2RlIGByb3VuZGluZ2AuXHJcbiAqXHJcbiAqIHgge251bWJlcnxzdHJpbmd8RGVjaW1hbH1cclxuICpcclxuICovXHJcbmZ1bmN0aW9uIGxvZzEwKHgpIHtcclxuICByZXR1cm4gbmV3IHRoaXMoeCkubG9nKDEwKTtcclxufVxyXG5cclxuXHJcbi8qXHJcbiAqIFJldHVybiBhIG5ldyBEZWNpbWFsIHdob3NlIHZhbHVlIGlzIHRoZSBtYXhpbXVtIG9mIHRoZSBhcmd1bWVudHMuXHJcbiAqXHJcbiAqIGFyZ3VtZW50cyB7bnVtYmVyfHN0cmluZ3xEZWNpbWFsfVxyXG4gKlxyXG4gKi9cclxuZnVuY3Rpb24gbWF4KCkge1xyXG4gIHJldHVybiBtYXhPck1pbih0aGlzLCBhcmd1bWVudHMsICdsdCcpO1xyXG59XHJcblxyXG5cclxuLypcclxuICogUmV0dXJuIGEgbmV3IERlY2ltYWwgd2hvc2UgdmFsdWUgaXMgdGhlIG1pbmltdW0gb2YgdGhlIGFyZ3VtZW50cy5cclxuICpcclxuICogYXJndW1lbnRzIHtudW1iZXJ8c3RyaW5nfERlY2ltYWx9XHJcbiAqXHJcbiAqL1xyXG5mdW5jdGlvbiBtaW4oKSB7XHJcbiAgcmV0dXJuIG1heE9yTWluKHRoaXMsIGFyZ3VtZW50cywgJ2d0Jyk7XHJcbn1cclxuXHJcblxyXG4vKlxyXG4gKiBSZXR1cm4gYSBuZXcgRGVjaW1hbCB3aG9zZSB2YWx1ZSBpcyBgeGAgbW9kdWxvIGB5YCwgcm91bmRlZCB0byBgcHJlY2lzaW9uYCBzaWduaWZpY2FudCBkaWdpdHNcclxuICogdXNpbmcgcm91bmRpbmcgbW9kZSBgcm91bmRpbmdgLlxyXG4gKlxyXG4gKiB4IHtudW1iZXJ8c3RyaW5nfERlY2ltYWx9XHJcbiAqIHkge251bWJlcnxzdHJpbmd8RGVjaW1hbH1cclxuICpcclxuICovXHJcbmZ1bmN0aW9uIG1vZCh4LCB5KSB7XHJcbiAgcmV0dXJuIG5ldyB0aGlzKHgpLm1vZCh5KTtcclxufVxyXG5cclxuXHJcbi8qXHJcbiAqIFJldHVybiBhIG5ldyBEZWNpbWFsIHdob3NlIHZhbHVlIGlzIGB4YCBtdWx0aXBsaWVkIGJ5IGB5YCwgcm91bmRlZCB0byBgcHJlY2lzaW9uYCBzaWduaWZpY2FudFxyXG4gKiBkaWdpdHMgdXNpbmcgcm91bmRpbmcgbW9kZSBgcm91bmRpbmdgLlxyXG4gKlxyXG4gKiB4IHtudW1iZXJ8c3RyaW5nfERlY2ltYWx9XHJcbiAqIHkge251bWJlcnxzdHJpbmd8RGVjaW1hbH1cclxuICpcclxuICovXHJcbmZ1bmN0aW9uIG11bCh4LCB5KSB7XHJcbiAgcmV0dXJuIG5ldyB0aGlzKHgpLm11bCh5KTtcclxufVxyXG5cclxuXHJcbi8qXHJcbiAqIFJldHVybiBhIG5ldyBEZWNpbWFsIHdob3NlIHZhbHVlIGlzIGB4YCByYWlzZWQgdG8gdGhlIHBvd2VyIGB5YCwgcm91bmRlZCB0byBwcmVjaXNpb25cclxuICogc2lnbmlmaWNhbnQgZGlnaXRzIHVzaW5nIHJvdW5kaW5nIG1vZGUgYHJvdW5kaW5nYC5cclxuICpcclxuICogeCB7bnVtYmVyfHN0cmluZ3xEZWNpbWFsfSBUaGUgYmFzZS5cclxuICogeSB7bnVtYmVyfHN0cmluZ3xEZWNpbWFsfSBUaGUgZXhwb25lbnQuXHJcbiAqXHJcbiAqL1xyXG5mdW5jdGlvbiBwb3coeCwgeSkge1xyXG4gIHJldHVybiBuZXcgdGhpcyh4KS5wb3coeSk7XHJcbn1cclxuXHJcblxyXG4vKlxyXG4gKiBSZXR1cm5zIGEgbmV3IERlY2ltYWwgd2l0aCBhIHJhbmRvbSB2YWx1ZSBlcXVhbCB0byBvciBncmVhdGVyIHRoYW4gMCBhbmQgbGVzcyB0aGFuIDEsIGFuZCB3aXRoXHJcbiAqIGBzZGAsIG9yIGBEZWNpbWFsLnByZWNpc2lvbmAgaWYgYHNkYCBpcyBvbWl0dGVkLCBzaWduaWZpY2FudCBkaWdpdHMgKG9yIGxlc3MgaWYgdHJhaWxpbmcgemVyb3NcclxuICogYXJlIHByb2R1Y2VkKS5cclxuICpcclxuICogW3NkXSB7bnVtYmVyfSBTaWduaWZpY2FudCBkaWdpdHMuIEludGVnZXIsIDAgdG8gTUFYX0RJR0lUUyBpbmNsdXNpdmUuXHJcbiAqXHJcbiAqL1xyXG5mdW5jdGlvbiByYW5kb20oc2QpIHtcclxuICB2YXIgZCwgZSwgaywgbixcclxuICAgIGkgPSAwLFxyXG4gICAgciA9IG5ldyB0aGlzKDEpLFxyXG4gICAgcmQgPSBbXTtcclxuXHJcbiAgaWYgKHNkID09PSB2b2lkIDApIHNkID0gdGhpcy5wcmVjaXNpb247XHJcbiAgZWxzZSBjaGVja0ludDMyKHNkLCAxLCBNQVhfRElHSVRTKTtcclxuXHJcbiAgayA9IE1hdGguY2VpbChzZCAvIExPR19CQVNFKTtcclxuXHJcbiAgaWYgKCF0aGlzLmNyeXB0bykge1xyXG4gICAgZm9yICg7IGkgPCBrOykgcmRbaSsrXSA9IE1hdGgucmFuZG9tKCkgKiAxZTcgfCAwO1xyXG5cclxuICAvLyBCcm93c2VycyBzdXBwb3J0aW5nIGNyeXB0by5nZXRSYW5kb21WYWx1ZXMuXHJcbiAgfSBlbHNlIGlmIChjcnlwdG8uZ2V0UmFuZG9tVmFsdWVzKSB7XHJcbiAgICBkID0gY3J5cHRvLmdldFJhbmRvbVZhbHVlcyhuZXcgVWludDMyQXJyYXkoaykpO1xyXG5cclxuICAgIGZvciAoOyBpIDwgazspIHtcclxuICAgICAgbiA9IGRbaV07XHJcblxyXG4gICAgICAvLyAwIDw9IG4gPCA0Mjk0OTY3Mjk2XHJcbiAgICAgIC8vIFByb2JhYmlsaXR5IG4gPj0gNC4yOWU5LCBpcyA0OTY3Mjk2IC8gNDI5NDk2NzI5NiA9IDAuMDAxMTYgKDEgaW4gODY1KS5cclxuICAgICAgaWYgKG4gPj0gNC4yOWU5KSB7XHJcbiAgICAgICAgZFtpXSA9IGNyeXB0by5nZXRSYW5kb21WYWx1ZXMobmV3IFVpbnQzMkFycmF5KDEpKVswXTtcclxuICAgICAgfSBlbHNlIHtcclxuXHJcbiAgICAgICAgLy8gMCA8PSBuIDw9IDQyODk5OTk5OTlcclxuICAgICAgICAvLyAwIDw9IChuICUgMWU3KSA8PSA5OTk5OTk5XHJcbiAgICAgICAgcmRbaSsrXSA9IG4gJSAxZTc7XHJcbiAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgLy8gTm9kZS5qcyBzdXBwb3J0aW5nIGNyeXB0by5yYW5kb21CeXRlcy5cclxuICB9IGVsc2UgaWYgKGNyeXB0by5yYW5kb21CeXRlcykge1xyXG5cclxuICAgIC8vIGJ1ZmZlclxyXG4gICAgZCA9IGNyeXB0by5yYW5kb21CeXRlcyhrICo9IDQpO1xyXG5cclxuICAgIGZvciAoOyBpIDwgazspIHtcclxuXHJcbiAgICAgIC8vIDAgPD0gbiA8IDIxNDc0ODM2NDhcclxuICAgICAgbiA9IGRbaV0gKyAoZFtpICsgMV0gPDwgOCkgKyAoZFtpICsgMl0gPDwgMTYpICsgKChkW2kgKyAzXSAmIDB4N2YpIDw8IDI0KTtcclxuXHJcbiAgICAgIC8vIFByb2JhYmlsaXR5IG4gPj0gMi4xNGU5LCBpcyA3NDgzNjQ4IC8gMjE0NzQ4MzY0OCA9IDAuMDAzNSAoMSBpbiAyODYpLlxyXG4gICAgICBpZiAobiA+PSAyLjE0ZTkpIHtcclxuICAgICAgICBjcnlwdG8ucmFuZG9tQnl0ZXMoNCkuY29weShkLCBpKTtcclxuICAgICAgfSBlbHNlIHtcclxuXHJcbiAgICAgICAgLy8gMCA8PSBuIDw9IDIxMzk5OTk5OTlcclxuICAgICAgICAvLyAwIDw9IChuICUgMWU3KSA8PSA5OTk5OTk5XHJcbiAgICAgICAgcmQucHVzaChuICUgMWU3KTtcclxuICAgICAgICBpICs9IDQ7XHJcbiAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBpID0gayAvIDQ7XHJcbiAgfSBlbHNlIHtcclxuICAgIHRocm93IEVycm9yKGNyeXB0b1VuYXZhaWxhYmxlKTtcclxuICB9XHJcblxyXG4gIGsgPSByZFstLWldO1xyXG4gIHNkICU9IExPR19CQVNFO1xyXG5cclxuICAvLyBDb252ZXJ0IHRyYWlsaW5nIGRpZ2l0cyB0byB6ZXJvcyBhY2NvcmRpbmcgdG8gc2QuXHJcbiAgaWYgKGsgJiYgc2QpIHtcclxuICAgIG4gPSBtYXRocG93KDEwLCBMT0dfQkFTRSAtIHNkKTtcclxuICAgIHJkW2ldID0gKGsgLyBuIHwgMCkgKiBuO1xyXG4gIH1cclxuXHJcbiAgLy8gUmVtb3ZlIHRyYWlsaW5nIHdvcmRzIHdoaWNoIGFyZSB6ZXJvLlxyXG4gIGZvciAoOyByZFtpXSA9PT0gMDsgaS0tKSByZC5wb3AoKTtcclxuXHJcbiAgLy8gWmVybz9cclxuICBpZiAoaSA8IDApIHtcclxuICAgIGUgPSAwO1xyXG4gICAgcmQgPSBbMF07XHJcbiAgfSBlbHNlIHtcclxuICAgIGUgPSAtMTtcclxuXHJcbiAgICAvLyBSZW1vdmUgbGVhZGluZyB3b3JkcyB3aGljaCBhcmUgemVybyBhbmQgYWRqdXN0IGV4cG9uZW50IGFjY29yZGluZ2x5LlxyXG4gICAgZm9yICg7IHJkWzBdID09PSAwOyBlIC09IExPR19CQVNFKSByZC5zaGlmdCgpO1xyXG5cclxuICAgIC8vIENvdW50IHRoZSBkaWdpdHMgb2YgdGhlIGZpcnN0IHdvcmQgb2YgcmQgdG8gZGV0ZXJtaW5lIGxlYWRpbmcgemVyb3MuXHJcbiAgICBmb3IgKGsgPSAxLCBuID0gcmRbMF07IG4gPj0gMTA7IG4gLz0gMTApIGsrKztcclxuXHJcbiAgICAvLyBBZGp1c3QgdGhlIGV4cG9uZW50IGZvciBsZWFkaW5nIHplcm9zIG9mIHRoZSBmaXJzdCB3b3JkIG9mIHJkLlxyXG4gICAgaWYgKGsgPCBMT0dfQkFTRSkgZSAtPSBMT0dfQkFTRSAtIGs7XHJcbiAgfVxyXG5cclxuICByLmUgPSBlO1xyXG4gIHIuZCA9IHJkO1xyXG5cclxuICByZXR1cm4gcjtcclxufVxyXG5cclxuXHJcbi8qXHJcbiAqIFJldHVybiBhIG5ldyBEZWNpbWFsIHdob3NlIHZhbHVlIGlzIGB4YCByb3VuZGVkIHRvIGFuIGludGVnZXIgdXNpbmcgcm91bmRpbmcgbW9kZSBgcm91bmRpbmdgLlxyXG4gKlxyXG4gKiBUbyBlbXVsYXRlIGBNYXRoLnJvdW5kYCwgc2V0IHJvdW5kaW5nIHRvIDcgKFJPVU5EX0hBTEZfQ0VJTCkuXHJcbiAqXHJcbiAqIHgge251bWJlcnxzdHJpbmd8RGVjaW1hbH1cclxuICpcclxuICovXHJcbmZ1bmN0aW9uIHJvdW5kKHgpIHtcclxuICByZXR1cm4gZmluYWxpc2UoeCA9IG5ldyB0aGlzKHgpLCB4LmUgKyAxLCB0aGlzLnJvdW5kaW5nKTtcclxufVxyXG5cclxuXHJcbi8qXHJcbiAqIFJldHVyblxyXG4gKiAgIDEgICAgaWYgeCA+IDAsXHJcbiAqICAtMSAgICBpZiB4IDwgMCxcclxuICogICAwICAgIGlmIHggaXMgMCxcclxuICogIC0wICAgIGlmIHggaXMgLTAsXHJcbiAqICAgTmFOICBvdGhlcndpc2VcclxuICpcclxuICogeCB7bnVtYmVyfHN0cmluZ3xEZWNpbWFsfVxyXG4gKlxyXG4gKi9cclxuZnVuY3Rpb24gc2lnbih4KSB7XHJcbiAgeCA9IG5ldyB0aGlzKHgpO1xyXG4gIHJldHVybiB4LmQgPyAoeC5kWzBdID8geC5zIDogMCAqIHgucykgOiB4LnMgfHwgTmFOO1xyXG59XHJcblxyXG5cclxuLypcclxuICogUmV0dXJuIGEgbmV3IERlY2ltYWwgd2hvc2UgdmFsdWUgaXMgdGhlIHNpbmUgb2YgYHhgLCByb3VuZGVkIHRvIGBwcmVjaXNpb25gIHNpZ25pZmljYW50IGRpZ2l0c1xyXG4gKiB1c2luZyByb3VuZGluZyBtb2RlIGByb3VuZGluZ2AuXHJcbiAqXHJcbiAqIHgge251bWJlcnxzdHJpbmd8RGVjaW1hbH0gQSB2YWx1ZSBpbiByYWRpYW5zLlxyXG4gKlxyXG4gKi9cclxuZnVuY3Rpb24gc2luKHgpIHtcclxuICByZXR1cm4gbmV3IHRoaXMoeCkuc2luKCk7XHJcbn1cclxuXHJcblxyXG4vKlxyXG4gKiBSZXR1cm4gYSBuZXcgRGVjaW1hbCB3aG9zZSB2YWx1ZSBpcyB0aGUgaHlwZXJib2xpYyBzaW5lIG9mIGB4YCwgcm91bmRlZCB0byBgcHJlY2lzaW9uYFxyXG4gKiBzaWduaWZpY2FudCBkaWdpdHMgdXNpbmcgcm91bmRpbmcgbW9kZSBgcm91bmRpbmdgLlxyXG4gKlxyXG4gKiB4IHtudW1iZXJ8c3RyaW5nfERlY2ltYWx9IEEgdmFsdWUgaW4gcmFkaWFucy5cclxuICpcclxuICovXHJcbmZ1bmN0aW9uIHNpbmgoeCkge1xyXG4gIHJldHVybiBuZXcgdGhpcyh4KS5zaW5oKCk7XHJcbn1cclxuXHJcblxyXG4vKlxyXG4gKiBSZXR1cm4gYSBuZXcgRGVjaW1hbCB3aG9zZSB2YWx1ZSBpcyB0aGUgc3F1YXJlIHJvb3Qgb2YgYHhgLCByb3VuZGVkIHRvIGBwcmVjaXNpb25gIHNpZ25pZmljYW50XHJcbiAqIGRpZ2l0cyB1c2luZyByb3VuZGluZyBtb2RlIGByb3VuZGluZ2AuXHJcbiAqXHJcbiAqIHgge251bWJlcnxzdHJpbmd8RGVjaW1hbH1cclxuICpcclxuICovXHJcbmZ1bmN0aW9uIHNxcnQoeCkge1xyXG4gIHJldHVybiBuZXcgdGhpcyh4KS5zcXJ0KCk7XHJcbn1cclxuXHJcblxyXG4vKlxyXG4gKiBSZXR1cm4gYSBuZXcgRGVjaW1hbCB3aG9zZSB2YWx1ZSBpcyBgeGAgbWludXMgYHlgLCByb3VuZGVkIHRvIGBwcmVjaXNpb25gIHNpZ25pZmljYW50IGRpZ2l0c1xyXG4gKiB1c2luZyByb3VuZGluZyBtb2RlIGByb3VuZGluZ2AuXHJcbiAqXHJcbiAqIHgge251bWJlcnxzdHJpbmd8RGVjaW1hbH1cclxuICogeSB7bnVtYmVyfHN0cmluZ3xEZWNpbWFsfVxyXG4gKlxyXG4gKi9cclxuZnVuY3Rpb24gc3ViKHgsIHkpIHtcclxuICByZXR1cm4gbmV3IHRoaXMoeCkuc3ViKHkpO1xyXG59XHJcblxyXG5cclxuLypcclxuICogUmV0dXJuIGEgbmV3IERlY2ltYWwgd2hvc2UgdmFsdWUgaXMgdGhlIHN1bSBvZiB0aGUgYXJndW1lbnRzLCByb3VuZGVkIHRvIGBwcmVjaXNpb25gXHJcbiAqIHNpZ25pZmljYW50IGRpZ2l0cyB1c2luZyByb3VuZGluZyBtb2RlIGByb3VuZGluZ2AuXHJcbiAqXHJcbiAqIE9ubHkgdGhlIHJlc3VsdCBpcyByb3VuZGVkLCBub3QgdGhlIGludGVybWVkaWF0ZSBjYWxjdWxhdGlvbnMuXHJcbiAqXHJcbiAqIGFyZ3VtZW50cyB7bnVtYmVyfHN0cmluZ3xEZWNpbWFsfVxyXG4gKlxyXG4gKi9cclxuZnVuY3Rpb24gc3VtKCkge1xyXG4gIHZhciBpID0gMCxcclxuICAgIGFyZ3MgPSBhcmd1bWVudHMsXHJcbiAgICB4ID0gbmV3IHRoaXMoYXJnc1tpXSk7XHJcblxyXG4gIGV4dGVybmFsID0gZmFsc2U7XHJcbiAgZm9yICg7IHgucyAmJiArK2kgPCBhcmdzLmxlbmd0aDspIHggPSB4LnBsdXMoYXJnc1tpXSk7XHJcbiAgZXh0ZXJuYWwgPSB0cnVlO1xyXG5cclxuICByZXR1cm4gZmluYWxpc2UoeCwgdGhpcy5wcmVjaXNpb24sIHRoaXMucm91bmRpbmcpO1xyXG59XHJcblxyXG5cclxuLypcclxuICogUmV0dXJuIGEgbmV3IERlY2ltYWwgd2hvc2UgdmFsdWUgaXMgdGhlIHRhbmdlbnQgb2YgYHhgLCByb3VuZGVkIHRvIGBwcmVjaXNpb25gIHNpZ25pZmljYW50XHJcbiAqIGRpZ2l0cyB1c2luZyByb3VuZGluZyBtb2RlIGByb3VuZGluZ2AuXHJcbiAqXHJcbiAqIHgge251bWJlcnxzdHJpbmd8RGVjaW1hbH0gQSB2YWx1ZSBpbiByYWRpYW5zLlxyXG4gKlxyXG4gKi9cclxuZnVuY3Rpb24gdGFuKHgpIHtcclxuICByZXR1cm4gbmV3IHRoaXMoeCkudGFuKCk7XHJcbn1cclxuXHJcblxyXG4vKlxyXG4gKiBSZXR1cm4gYSBuZXcgRGVjaW1hbCB3aG9zZSB2YWx1ZSBpcyB0aGUgaHlwZXJib2xpYyB0YW5nZW50IG9mIGB4YCwgcm91bmRlZCB0byBgcHJlY2lzaW9uYFxyXG4gKiBzaWduaWZpY2FudCBkaWdpdHMgdXNpbmcgcm91bmRpbmcgbW9kZSBgcm91bmRpbmdgLlxyXG4gKlxyXG4gKiB4IHtudW1iZXJ8c3RyaW5nfERlY2ltYWx9IEEgdmFsdWUgaW4gcmFkaWFucy5cclxuICpcclxuICovXHJcbmZ1bmN0aW9uIHRhbmgoeCkge1xyXG4gIHJldHVybiBuZXcgdGhpcyh4KS50YW5oKCk7XHJcbn1cclxuXHJcblxyXG4vKlxyXG4gKiBSZXR1cm4gYSBuZXcgRGVjaW1hbCB3aG9zZSB2YWx1ZSBpcyBgeGAgdHJ1bmNhdGVkIHRvIGFuIGludGVnZXIuXHJcbiAqXHJcbiAqIHgge251bWJlcnxzdHJpbmd8RGVjaW1hbH1cclxuICpcclxuICovXHJcbmZ1bmN0aW9uIHRydW5jKHgpIHtcclxuICByZXR1cm4gZmluYWxpc2UoeCA9IG5ldyB0aGlzKHgpLCB4LmUgKyAxLCAxKTtcclxufVxyXG5cclxuXHJcblBbU3ltYm9sLmZvcignbm9kZWpzLnV0aWwuaW5zcGVjdC5jdXN0b20nKV0gPSBQLnRvU3RyaW5nO1xyXG5QW1N5bWJvbC50b1N0cmluZ1RhZ10gPSAnRGVjaW1hbCc7XHJcblxyXG4vLyBDcmVhdGUgYW5kIGNvbmZpZ3VyZSBpbml0aWFsIERlY2ltYWwgY29uc3RydWN0b3IuXHJcbmV4cG9ydCB2YXIgRGVjaW1hbCA9IFAuY29uc3RydWN0b3IgPSBjbG9uZShERUZBVUxUUyk7XHJcblxyXG4vLyBDcmVhdGUgdGhlIGludGVybmFsIGNvbnN0YW50cyBmcm9tIHRoZWlyIHN0cmluZyB2YWx1ZXMuXHJcbkxOMTAgPSBuZXcgRGVjaW1hbChMTjEwKTtcclxuUEkgPSBuZXcgRGVjaW1hbChQSSk7XHJcblxyXG5leHBvcnQgZGVmYXVsdCBEZWNpbWFsO1xyXG4iLCAiLypcbk5vdGFibGUgY2hhbmdlcyBtYWRlIChhbmQgbm90ZXMpOlxuLSBOdW1iZXIgY2xhc3NlcyByZWdpc3RlcmVkIGFmdGVyIHRoZXkgYXJlIGRlZmluZWRcbi0gRmxvYXQgaXMgaGFuZGVsZWQgZW50aXJlbHkgYnkgZGVjaW1hbC5qcywgYW5kIG5vdyBvbmx5IHRha2VzIHByZWNpc2lvbiBpblxuICAjIG9mIGRlY2ltYWwgcG9pbnRzXG4tIE5vdGU6IG9ubHkgbWV0aG9kcyBuZWNlc3NhcnkgZm9yIGFkZCwgbXVsLCBhbmQgcG93IGhhdmUgYmVlbiBpbXBsZW1lbnRlZFxuLSBUT0RPOiBuZWVkcyBtb3JlIF9ldmFsX2lzIHByb3BlcnRpZXMgYW5kIG5lZWQgdG8gZGVidWcgcmF0aW9uYWwgZXZhbCBwb3dlclxuKi9cblxuLy8gYmFzaWMgaW1wbGVtZW50YXRpb25zIG9ubHkgLSBubyB1dGlsaXR5IGFkZGVkIHlldFxuaW1wb3J0IHtfQXRvbWljRXhwcn0gZnJvbSBcIi4vZXhwclwiO1xuaW1wb3J0IHtOdW1iZXJLaW5kfSBmcm9tIFwiLi9raW5kXCI7XG5pbXBvcnQge01hbmFnZWRQcm9wZXJ0aWVzfSBmcm9tIFwiLi9hc3N1bXB0aW9uc1wiO1xuaW1wb3J0IHtnbG9iYWxfcGFyYW1ldGVyc30gZnJvbSBcIi4vcGFyYW1ldGVyc1wiO1xuaW1wb3J0IHtBZGR9IGZyb20gXCIuL2FkZFwiO1xuaW1wb3J0IHtTLCBTaW5nbGV0b259IGZyb20gXCIuL3NpbmdsZXRvblwiO1xuaW1wb3J0IERlY2ltYWwgZnJvbSBcImRlY2ltYWwuanNcIjtcbmltcG9ydCB7YXNfaW50fSBmcm9tIFwiLi4vdXRpbGl0aWVzL21pc2NcIjtcbmltcG9ydCB7UG93fSBmcm9tIFwiLi9wb3dlclwiO1xuaW1wb3J0IHtHbG9iYWx9IGZyb20gXCIuL2dsb2JhbFwiO1xuaW1wb3J0IHtkaXZtb2QsIGZhY3RvcmludCwgZmFjdG9ycmF0LCBwZXJmZWN0X3Bvd2VyfSBmcm9tIFwiLi4vbnRoZW9yeS9mYWN0b3JfXCI7XG5pbXBvcnQge0hhc2hEaWN0fSBmcm9tIFwiLi91dGlsaXR5XCI7XG5pbXBvcnQge011bH0gZnJvbSBcIi4vbXVsXCI7XG5cbi8qXG51dGlsaXR5IGZ1bmN0aW9uc1xuXG5UaGVzZSBhcmUgc29tZXdoYXQgd3JpdHRlbiBkaWZmZXJlbnRseSB0aGFuIGluIHN5bXB5ICh3aGljaCBkZXBlbmRzIG9uIG1wbWF0aClcbmJ1dCB0aGV5IHByb3ZpZGUgdGhlIHNhbWUgZnVuY3Rpb25hbGl0eVxuKi9cblxuZnVuY3Rpb24gaWdjZCh4OiBudW1iZXIsIHk6IG51bWJlcikge1xuICAgIHdoaWxlICh5KSB7XG4gICAgICAgIGNvbnN0IHQgPSB5O1xuICAgICAgICB5ID0geCAlIHk7XG4gICAgICAgIHggPSB0O1xuICAgIH1cbiAgICByZXR1cm4geDtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGludF9udGhyb290KHk6IG51bWJlciwgbjogbnVtYmVyKSB7XG4gICAgY29uc3QgeCA9IE1hdGguZmxvb3IoeSoqKDEvbikpO1xuICAgIGNvbnN0IGlzZXhhY3QgPSB4KipuID09PSB5O1xuICAgIHJldHVybiBbeCwgaXNleGFjdF07XG59XG5cbi8vIHR1cm4gYSBmbG9hdCB0byBhIHJhdGlvbmFsIC0+IHJlcGxpYWNhdGVzIG1wbWF0aCBmdW5jdGlvbmFsaXR5IGJ1dCB3ZSBzaG91bGRcbi8vIHByb2JhYmx5IGZpbmQgYSBsaWJyYXJ5IHRvIGRvIHRoaXMgZXZlbnR1YWxseVxuZnVuY3Rpb24gdG9SYXRpbyhuOiBhbnksIGVwczogbnVtYmVyKSB7XG4gICAgY29uc3QgZ2NkZSA9IChlOiBudW1iZXIsIHg6IG51bWJlciwgeTogbnVtYmVyKSA9PiB7XG4gICAgICAgIGNvbnN0IF9nY2Q6IGFueSA9IChhOiBudW1iZXIsIGI6IG51bWJlcikgPT4gKGIgPCBlID8gYSA6IF9nY2QoYiwgYSAlIGIpKTtcbiAgICAgICAgcmV0dXJuIF9nY2QoTWF0aC5hYnMoeCksIE1hdGguYWJzKHkpKTtcbiAgICB9O1xuICAgIGNvbnN0IGMgPSBnY2RlKEJvb2xlYW4oZXBzKSA/IGVwcyA6ICgxIC8gMTAwMDApLCAxLCBuKTtcbiAgICByZXR1cm4gW01hdGguZmxvb3IobiAvIGMpLCBNYXRoLmZsb29yKDEgLyBjKV07XG59XG5cbmZ1bmN0aW9uIGlnY2RleChhOiBudW1iZXIgPSB1bmRlZmluZWQsIGI6IG51bWJlciA9IHVuZGVmaW5lZCkge1xuICAgIGlmICh0eXBlb2YgYSA9PT0gXCJ1bmRlZmluZWRcIiAmJiB0eXBlb2YgYiA9PT0gXCJ1bmRlZmluZWRcIikge1xuICAgICAgICByZXR1cm4gWzAsIDEsIDBdO1xuICAgIH1cblxuICAgIGlmICh0eXBlb2YgYSA9PT0gXCJ1bmRlZmluZWRcIikge1xuICAgICAgICByZXR1cm4gWzAsIE1hdGguZmxvb3IoYiAvIE1hdGguYWJzKGIpKSwgTWF0aC5hYnMoYildO1xuICAgIH1cblxuICAgIGlmICh0eXBlb2YgYiA9PT0gXCJ1bmRlZmluZWRcIikge1xuICAgICAgICByZXR1cm4gW01hdGguZmxvb3IoYSAvIE1hdGguYWJzKGEpKSwgMCwgTWF0aC5hYnMoYSldO1xuICAgIH1cbiAgICBsZXQgeF9zaWduO1xuICAgIGxldCB5X3NpZ247XG4gICAgaWYgKGEgPCAwKSB7XG4gICAgICAgIGEgPSAtMTtcbiAgICAgICAgeF9zaWduID0gLTE7XG4gICAgfSBlbHNlIHtcbiAgICAgICAgeF9zaWduID0gMTtcbiAgICB9XG4gICAgaWYgKGIgPCAwKSB7XG4gICAgICAgIGIgPSAtYjtcbiAgICAgICAgeV9zaWduID0gLTE7XG4gICAgfSBlbHNlIHtcbiAgICAgICAgeV9zaWduID0gMTtcbiAgICB9XG5cbiAgICBsZXQgW3gsIHksIHIsIHNdID0gWzEsIDAsIDAsIDFdO1xuICAgIGxldCBjOyBsZXQgcTtcbiAgICB3aGlsZSAoYikge1xuICAgICAgICBbYywgcV0gPSBbYSAlIGIsIE1hdGguZmxvb3IoYSAvIGIpXTtcbiAgICAgICAgW2EsIGIsIHIsIHMsIHgsIHldID0gW2IsIGMsIHggLSBxICogciwgeSAtIHEgKiBzLCByLCBzXTtcbiAgICB9XG4gICAgcmV0dXJuIFt4ICogeF9zaWduLCB5ICogeV9zaWduLCBhXTtcbn1cblxuZnVuY3Rpb24gbW9kX2ludmVyc2UoYTogYW55LCBtOiBhbnkpIHtcbiAgICBsZXQgYyA9IHVuZGVmaW5lZDtcbiAgICBbYSwgbV0gPSBbYXNfaW50KGEpLCBhc19pbnQobSldO1xuICAgIGlmIChtICE9PSAxICYmIG0gIT09IC0xKSB7XG4gICAgICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBuby11bnVzZWQtdmFyc1xuICAgICAgICBjb25zdCBbeCwgYiwgZ10gPSBpZ2NkZXgoYSwgbSk7XG4gICAgICAgIGlmIChnID09PSAxKSB7XG4gICAgICAgICAgICBjID0geCAmIG07XG4gICAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIGM7XG59XG5cbkdsb2JhbC5yZWdpc3RlcmZ1bmMoXCJtb2RfaW52ZXJzZVwiLCBtb2RfaW52ZXJzZSk7XG5cbmNsYXNzIF9OdW1iZXJfIGV4dGVuZHMgX0F0b21pY0V4cHIge1xuICAgIC8qXG4gICAgUmVwcmVzZW50cyBhdG9taWMgbnVtYmVycyBpbiBTeW1QeS5cbiAgICBFeHBsYW5hdGlvblxuICAgID09PT09PT09PT09XG4gICAgRmxvYXRpbmcgcG9pbnQgbnVtYmVycyBhcmUgcmVwcmVzZW50ZWQgYnkgdGhlIEZsb2F0IGNsYXNzLlxuICAgIFJhdGlvbmFsIG51bWJlcnMgKG9mIGFueSBzaXplKSBhcmUgcmVwcmVzZW50ZWQgYnkgdGhlIFJhdGlvbmFsIGNsYXNzLlxuICAgIEludGVnZXIgbnVtYmVycyAob2YgYW55IHNpemUpIGFyZSByZXByZXNlbnRlZCBieSB0aGUgSW50ZWdlciBjbGFzcy5cbiAgICBGbG9hdCBhbmQgUmF0aW9uYWwgYXJlIHN1YmNsYXNzZXMgb2YgTnVtYmVyOyBJbnRlZ2VyIGlzIGEgc3ViY2xhc3NcbiAgICBvZiBSYXRpb25hbC5cbiAgICBGb3IgZXhhbXBsZSwgYGAyLzNgYCBpcyByZXByZXNlbnRlZCBhcyBgYFJhdGlvbmFsKDIsIDMpYGAgd2hpY2ggaXNcbiAgICBhIGRpZmZlcmVudCBvYmplY3QgZnJvbSB0aGUgZmxvYXRpbmcgcG9pbnQgbnVtYmVyIG9idGFpbmVkIHdpdGhcbiAgICBQeXRob24gZGl2aXNpb24gYGAyLzNgYC4gRXZlbiBmb3IgbnVtYmVycyB0aGF0IGFyZSBleGFjdGx5XG4gICAgcmVwcmVzZW50ZWQgaW4gYmluYXJ5LCB0aGVyZSBpcyBhIGRpZmZlcmVuY2UgYmV0d2VlbiBob3cgdHdvIGZvcm1zLFxuICAgIHN1Y2ggYXMgYGBSYXRpb25hbCgxLCAyKWBgIGFuZCBgYEZsb2F0KDAuNSlgYCwgYXJlIHVzZWQgaW4gU3ltUHkuXG4gICAgVGhlIHJhdGlvbmFsIGZvcm0gaXMgdG8gYmUgcHJlZmVycmVkIGluIHN5bWJvbGljIGNvbXB1dGF0aW9ucy5cbiAgICBPdGhlciBraW5kcyBvZiBudW1iZXJzLCBzdWNoIGFzIGFsZ2VicmFpYyBudW1iZXJzIGBgc3FydCgyKWBgIG9yXG4gICAgY29tcGxleCBudW1iZXJzIGBgMyArIDQqSWBgLCBhcmUgbm90IGluc3RhbmNlcyBvZiBOdW1iZXIgY2xhc3MgYXNcbiAgICB0aGV5IGFyZSBub3QgYXRvbWljLlxuICAgIFNlZSBBbHNvXG4gICAgPT09PT09PT1cbiAgICBGbG9hdCwgSW50ZWdlciwgUmF0aW9uYWxcbiAgICAqL1xuICAgIHN0YXRpYyBpc19jb21tdXRhdGl2ZSA9IHRydWU7XG4gICAgc3RhdGljIGlzX251bWJlciA9IHRydWU7XG4gICAgc3RhdGljIGlzX051bWJlciA9IHRydWU7XG4gICAgc3RhdGljIGtpbmQgPSBOdW1iZXJLaW5kO1xuXG4gICAgc3RhdGljIG5ldyguLi5vYmo6IGFueSkge1xuICAgICAgICBpZiAob2JqLmxlbmd0aCA9PT0gMSkge1xuICAgICAgICAgICAgb2JqID0gb2JqWzBdO1xuICAgICAgICB9XG4gICAgICAgIGlmIChvYmogaW5zdGFuY2VvZiBfTnVtYmVyXykge1xuICAgICAgICAgICAgcmV0dXJuIG9iajtcbiAgICAgICAgfSBlbHNlIGlmICh0eXBlb2Ygb2JqID09PSBcIm51bWJlclwiICYmICFOdW1iZXIuaXNJbnRlZ2VyKG9iaikgfHwgb2JqIGluc3RhbmNlb2YgRGVjaW1hbCB8fCB0eXBlb2Ygb2JqID09PSBcInN0cmluZ1wiKSB7XG4gICAgICAgICAgICByZXR1cm4gbmV3IEZsb2F0KG9iaik7XG4gICAgICAgIH0gZWxzZSBpZiAoTnVtYmVyLmlzSW50ZWdlcihvYmopKSB7XG4gICAgICAgICAgICByZXR1cm4gbmV3IEludGVnZXIob2JqKTtcbiAgICAgICAgfSBlbHNlIGlmIChvYmoubGVuZ3RoID09PSAyKSB7XG4gICAgICAgICAgICByZXR1cm4gbmV3IFJhdGlvbmFsKG9ialswXSwgb2JqWzFdKTtcbiAgICAgICAgfSBlbHNlIGlmICh0eXBlb2Ygb2JqID09PSBcInN0cmluZ1wiKSB7XG4gICAgICAgICAgICBjb25zdCBfb2JqID0gb2JqLnRvTG93ZXJDYXNlKCk7XG4gICAgICAgICAgICBpZiAoX29iaiA9PT0gXCJuYW5cIikge1xuICAgICAgICAgICAgICAgIHJldHVybiBTLk5hTjtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoX29iaiA9PT0gXCJpbmZcIikge1xuICAgICAgICAgICAgICAgIHJldHVybiBTLkluZmluaXR5O1xuICAgICAgICAgICAgfSBlbHNlIGlmIChfb2JqID09PSBcIitpbmZcIikge1xuICAgICAgICAgICAgICAgIHJldHVybiBTLkluZmluaXR5O1xuICAgICAgICAgICAgfSBlbHNlIGlmIChfb2JqID09PSBcIi1pbmZcIikge1xuICAgICAgICAgICAgICAgIHJldHVybiBTLk5lZ2F0aXZlSW5maW5pdHk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcImFyZ3VtZW50IGZvciBudW1iZXIgaXMgaW52YWxpZFwiKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJhcmd1bWVudCBmb3IgbnVtYmVyIGlzIGludmFsaWRcIik7XG4gICAgfVxuXG4gICAgYXNfY29lZmZfTXVsKHJhdGlvbmFsOiBib29sZWFuID0gZmFsc2UpIHtcbiAgICAgICAgaWYgKHJhdGlvbmFsICYmICF0aGlzLmlzX1JhdGlvbmFsKSB7XG4gICAgICAgICAgICByZXR1cm4gW1MuT25lLCB0aGlzXTtcbiAgICAgICAgfVxuICAgICAgICBpZiAodGhpcykge1xuICAgICAgICAgICAgcmV0dXJuIFt0aGlzLCBTLk9uZV07XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gW1MuT25lLCB0aGlzXTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGFzX2NvZWZmX0FkZCgpIHtcbiAgICAgICAgcmV0dXJuIFt0aGlzLCBTLlplcm9dO1xuICAgIH1cblxuICAgIC8vIE5PVEU6IFRIRVNFIE1FVEhPRFMgQVJFIE5PVCBZRVQgSU1QTEVNRU5URUQgSU4gVEhFIFNVUEVSQ0xBU1NcblxuICAgIF9fYWRkX18ob3RoZXI6IGFueSkge1xuICAgICAgICBpZiAob3RoZXIgaW5zdGFuY2VvZiBfTnVtYmVyXyAmJiBnbG9iYWxfcGFyYW1ldGVycy5ldmFsdWF0ZSkge1xuICAgICAgICAgICAgaWYgKG90aGVyID09PSBTLk5hTikge1xuICAgICAgICAgICAgICAgIHJldHVybiBTLk5hTjtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAob3RoZXIgPT09IFMuSW5maW5pdHkpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gUy5JbmZpbml0eTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAob3RoZXIgPT09IFMuTmVnYXRpdmVJbmZpbml0eSkge1xuICAgICAgICAgICAgICAgIHJldHVybiBTLk5lZ2F0aXZlSW5maW5pdHk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHN1cGVyLl9fYWRkX18ob3RoZXIpO1xuICAgIH1cblxuICAgIF9fc3ViX18ob3RoZXI6IGFueSkge1xuICAgICAgICBpZiAob3RoZXIgaW5zdGFuY2VvZiBfTnVtYmVyXyAmJiBnbG9iYWxfcGFyYW1ldGVycy5ldmFsdWF0ZSkge1xuICAgICAgICAgICAgaWYgKG90aGVyID09PSBTLk5hTikge1xuICAgICAgICAgICAgICAgIHJldHVybiBTLk5hTjtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAob3RoZXIgPT09IFMuSW5maW5pdHkpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gUy5OZWdhdGl2ZUluZmluaXR5O1xuICAgICAgICAgICAgfSBlbHNlIGlmIChvdGhlciA9PT0gUy5OZWdhdGl2ZUluZmluaXR5KSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIFMuSW5maW5pdHk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHN1cGVyLl9fc3ViX18ob3RoZXIpO1xuICAgIH1cblxuICAgIF9fbXVsX18ob3RoZXI6IGFueSkge1xuICAgICAgICBpZiAob3RoZXIgaW5zdGFuY2VvZiBfTnVtYmVyXyAmJiBnbG9iYWxfcGFyYW1ldGVycy5ldmFsdWF0ZSkge1xuICAgICAgICAgICAgaWYgKG90aGVyID09PSBTLk5hbikge1xuICAgICAgICAgICAgICAgIHJldHVybiBTLk5hbjtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAob3RoZXIgPT09IFMuSW5maW5pdHkpIHtcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5pc196ZXJvKCkpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFMuTmFOO1xuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAodGhpcy5pc19wb3NpdGl2ZSgpKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBTLkluZmluaXR5O1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBTLk5lZ2F0aXZlSW5maW5pdHk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSBlbHNlIGlmIChvdGhlciA9PT0gUy5OZWdhdGl2ZUluZmluaXR5KSB7XG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuaXNfemVybygpKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBTLk5hTjtcbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKHRoaXMuaXNfcG9zaXRpdmUoKSkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gUy5OZWdhdGl2ZUluZmluaXR5O1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBTLkluZmluaXR5O1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gc3VwZXIuX19tdWxfXyhvdGhlcik7XG4gICAgfVxuICAgIF9fdHJ1ZWRpdl9fKG90aGVyOiBhbnkpIHtcbiAgICAgICAgaWYgKG90aGVyIGluc3RhbmNlb2YgX051bWJlcl8gJiYgZ2xvYmFsX3BhcmFtZXRlcnMuZXZhbHVhdGUpIHtcbiAgICAgICAgICAgIGlmIChvdGhlciA9PT0gUy5OYU4pIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gUy5OYU47XG4gICAgICAgICAgICB9IGVsc2UgaWYgKG90aGVyID09PSBTLkluZmluaXR5IHx8IG90aGVyID09PSBTLk5lZ2F0aXZlSW5maW5pdHkpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gUy5aZXJvO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBzdXBlci5fX3RydWVkaXZfXyhvdGhlcik7XG4gICAgfVxuXG4gICAgZXZhbF9ldmFsZihwcmVjOiBudW1iZXIpIHtcbiAgICAgICAgcmV0dXJuIG5ldyBGbG9hdCh0aGlzLl9mbG9hdF92YWwocHJlYyksIHByZWMpO1xuICAgIH1cblxuICAgIF9mbG9hdF92YWwocHJlYzogbnVtYmVyKTogYW55IHtcbiAgICAgICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgICB9XG59O1xuXG4vLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbmV3LWNhcFxuTWFuYWdlZFByb3BlcnRpZXMucmVnaXN0ZXIoX051bWJlcl8pO1xuR2xvYmFsLnJlZ2lzdGVyKFwiX051bWJlcl9cIiwgX051bWJlcl8ubmV3KTtcblxuY2xhc3MgRmxvYXQgZXh0ZW5kcyBfTnVtYmVyXyB7XG4gICAgLypcbiAgICAobm90IGNvcHlpbmcgc3ltcHkgY29tbWVudCBiZWNhdXNlIHRoaXMgaW1wbGVtZW50YXRpb24gaXMgdmVyeSBkaWZmZXJlbnQpXG4gICAgc2VlIGhlYWRlciBjb21tZW50IGZvciBjaGFuZ2VzXG4gICAgKi9cbiAgICBfX3Nsb3RzX186IGFueVtdID0gW1wiX21wZl9cIiwgXCJfcHJlY1wiXTtcbiAgICBfbXBmXzogW251bWJlciwgbnVtYmVyLCBudW1iZXIsIG51bWJlcl07XG4gICAgc3RhdGljIGlzX3JhdGlvbmFsOiBhbnkgPSB1bmRlZmluZWQ7XG4gICAgc3RhdGljIGlzX2lycmF0aW9uYWw6IGFueSA9IHVuZGVmaW5lZDtcbiAgICBzdGF0aWMgaXNfbnVtYmVyID0gdHJ1ZTtcbiAgICBzdGF0aWMgaXNfcmVhbCA9IHRydWU7XG4gICAgc3RhdGljIGlzX2V4dGVuZGVkX3JlYWwgPSB0cnVlO1xuICAgIHN0YXRpYyBpc19GbG9hdCA9IHRydWU7XG4gICAgZGVjaW1hbDogRGVjaW1hbDtcbiAgICBwcmVjOiBudW1iZXI7XG5cbiAgICBjb25zdHJ1Y3RvcihudW06IGFueSwgcHJlYzogYW55ID0gMTUpIHtcbiAgICAgICAgc3VwZXIoKTtcbiAgICAgICAgdGhpcy5wcmVjID0gcHJlYztcbiAgICAgICAgaWYgKHR5cGVvZiBudW0gIT09IFwidW5kZWZpbmVkXCIpIHtcbiAgICAgICAgICAgIGlmIChudW0gaW5zdGFuY2VvZiBGbG9hdCkge1xuICAgICAgICAgICAgICAgIHRoaXMuZGVjaW1hbCA9IG51bS5kZWNpbWFsO1xuICAgICAgICAgICAgfSBlbHNlIGlmIChudW0gaW5zdGFuY2VvZiBEZWNpbWFsKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5kZWNpbWFsID0gbnVtO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICB0aGlzLmRlY2ltYWwgPSBuZXcgRGVjaW1hbChudW0pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgX19hZGRfXyhvdGhlcjogYW55KSB7XG4gICAgICAgIGlmIChnbG9iYWxfcGFyYW1ldGVycy5ldmFsdWF0ZSAmJiBvdGhlciBpbnN0YW5jZW9mIF9OdW1iZXJfKSB7XG4gICAgICAgICAgICBjb25zdCB2YWwgPSBvdGhlci5fZmxvYXRfdmFsKHRoaXMucHJlYyk7XG4gICAgICAgICAgICByZXR1cm4gbmV3IEZsb2F0KERlY2ltYWwuc2V0KHtwcmVjaXNpb246IHRoaXMucHJlY30pLmFkZCh0aGlzLmRlY2ltYWwsIHZhbC5kZWNpbWFsKSwgdGhpcy5wcmVjKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gc3VwZXIuX19hZGRfXyhvdGhlcik7XG4gICAgfVxuXG4gICAgX19zdWJfXyhvdGhlcjogYW55KSB7XG4gICAgICAgIGlmIChnbG9iYWxfcGFyYW1ldGVycy5ldmFsdWF0ZSAmJiBvdGhlciBpbnN0YW5jZW9mIF9OdW1iZXJfKSB7XG4gICAgICAgICAgICBjb25zdCB2YWwgPSBvdGhlci5fZmxvYXRfdmFsKHRoaXMucHJlYyk7XG4gICAgICAgICAgICByZXR1cm4gbmV3IEZsb2F0KERlY2ltYWwuc2V0KHtwcmVjaXNpb246IHRoaXMucHJlY30pLnN1Yih0aGlzLmRlY2ltYWwsIHZhbC5kZWNpbWFsKSwgdGhpcy5wcmVjKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gc3VwZXIuX19zdWJfXyhvdGhlcik7XG4gICAgfVxuXG4gICAgX19tdWxfXyhvdGhlcjogYW55KSB7XG4gICAgICAgIGlmIChnbG9iYWxfcGFyYW1ldGVycy5ldmFsdWF0ZSAmJiBvdGhlciBpbnN0YW5jZW9mIF9OdW1iZXJfKSB7XG4gICAgICAgICAgICBjb25zdCB2YWwgPSBvdGhlci5fZmxvYXRfdmFsKHRoaXMucHJlYyk7XG4gICAgICAgICAgICByZXR1cm4gbmV3IEZsb2F0KERlY2ltYWwuc2V0KHtwcmVjaXNpb246IHRoaXMucHJlY30pLm11bCh0aGlzLmRlY2ltYWwsIHZhbC5kZWNpbWFsKSwgdGhpcy5wcmVjKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gc3VwZXIuX19tdWxfXyhvdGhlcik7XG4gICAgfVxuXG4gICAgX190cnVlZGl2X18ob3RoZXI6IGFueSkge1xuICAgICAgICBpZiAoZ2xvYmFsX3BhcmFtZXRlcnMuZXZhbHVhdGUgJiYgb3RoZXIgaW5zdGFuY2VvZiBfTnVtYmVyXykge1xuICAgICAgICAgICAgY29uc3QgdmFsID0gb3RoZXIuX2Zsb2F0X3ZhbCh0aGlzLnByZWMpO1xuICAgICAgICAgICAgcmV0dXJuIG5ldyBGbG9hdChEZWNpbWFsLnNldCh7cHJlY2lzaW9uOiB0aGlzLnByZWN9KS5kaXYodGhpcy5kZWNpbWFsLCB2YWwuZGVjaW1hbCksIHRoaXMucHJlYyk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHN1cGVyLl9fZGl2X18ob3RoZXIpO1xuICAgIH1cblxuICAgIF9ldmFsX2lzX25lZ2F0aXZlKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5kZWNpbWFsLmxlc3NUaGFuKDApO1xuICAgIH1cblxuICAgIF9ldmFsX2lzX3Bvc2l0aXZlKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5kZWNpbWFsLmdyZWF0ZXJUaGFuKDApO1xuICAgIH1cblxuICAgIC8vIHJldHVybiBuZXcgRmxvYXQoRGVjaW1hbC5zZXQoe3ByZWNpc2lvbjogdGhpcy5wcmVjfSkucG93KHRoaXMuZGVjaW1hbCwgb3RoZXIuZXZhbF9ldmFsZih0aGlzLnByZWMpLmRlY2ltYWwpLCB0aGlzLnByZWMpO1xuXG4gICAgX2V2YWxfcG93ZXIoZXhwdDogYW55KSB7XG4gICAgICAgIGlmICh0aGlzID09PSBTLlplcm8pIHtcbiAgICAgICAgICAgIGlmIChleHB0LmlzX2V4dGVuZGVkX3Bvc2l0aXZlKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICAgICAgICB9IGlmIChleHB0LmlzX2V4dGVuZGVkX25lZ2F0aXZlKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIFMuQ29tcGxleEluZmluaXR5O1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGlmIChleHB0IGluc3RhbmNlb2YgX051bWJlcl8pIHtcbiAgICAgICAgICAgIGlmIChleHB0IGluc3RhbmNlb2YgSW50ZWdlcikge1xuICAgICAgICAgICAgICAgIGNvbnN0IHByZWMgPSB0aGlzLnByZWM7XG4gICAgICAgICAgICAgICAgcmV0dXJuIG5ldyBGbG9hdChEZWNpbWFsLnNldCh7cHJlY2lzaW9uOiB0aGlzLnByZWN9KS5wb3codGhpcy5kZWNpbWFsLCBleHB0LnApLCBwcmVjKTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoZXhwdCBpbnN0YW5jZW9mIFJhdGlvbmFsICYmXG4gICAgICAgICAgICAgICAgZXhwdC5wID09PSAxICYmIGV4cHQucSAlIDIgIT09IDAgJiYgdGhpcy5pc19uZWdhdGl2ZSgpKSB7XG4gICAgICAgICAgICAgICAgY29uc3QgbmVncGFydCA9ICh0aGlzLl9fbXVsX18oUy5OZWdhdGl2ZU9uZSkpLl9ldmFsX3Bvd2VyKGV4cHQpO1xuICAgICAgICAgICAgICAgIHJldHVybiBuZXcgTXVsKHRydWUsIHRydWUsIG5lZ3BhcnQsIG5ldyBQb3coUy5OZWdhdGl2ZU9uZSwgZXhwdCwgZmFsc2UpKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGNvbnN0IHZhbCA9IGV4cHQuX2Zsb2F0X3ZhbCh0aGlzLnByZWMpLmRlY2ltYWw7XG4gICAgICAgICAgICBjb25zdCByZXMgPSBEZWNpbWFsLnNldCh7cHJlY2lzaW9uOiB0aGlzLnByZWN9KS5wb3codGhpcy5kZWNpbWFsLCB2YWwpO1xuICAgICAgICAgICAgaWYgKHJlcy5pc05hTigpKSB7XG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiY29tcGxleCBhbmQgaW1hZ2luYXJ5IG51bWJlcnMgbm90IHlldCBpbXBsZW1lbnRlZFwiKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiBuZXcgRmxvYXQocmVzKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIF9mbG9hdF92YWwocHJlYzogbnVtYmVyKTogYW55IHtcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuXG4gICAgaW52ZXJzZSgpIHtcbiAgICAgICAgcmV0dXJuIG5ldyBGbG9hdCgxLyh0aGlzLmRlY2ltYWwgYXMgYW55KSk7XG4gICAgfVxuXG4gICAgX2V2YWxfaXNfZmluaXRlKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5kZWNpbWFsLmlzRmluaXRlKCk7XG4gICAgfVxuXG4gICAgdG9TdHJpbmcoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmRlY2ltYWwudG9TdHJpbmcoKVxuICAgIH1cbn1cblxuTWFuYWdlZFByb3BlcnRpZXMucmVnaXN0ZXIoRmxvYXQpO1xuXG5cbmNsYXNzIFJhdGlvbmFsIGV4dGVuZHMgX051bWJlcl8ge1xuICAgIHN0YXRpYyBpc19yZWFsID0gdHJ1ZTtcbiAgICBzdGF0aWMgaXNfaW50ZWdlciA9IGZhbHNlO1xuICAgIHN0YXRpYyBpc19yYXRpb25hbCA9IHRydWU7XG4gICAgc3RhdGljIGlzX251bWJlciA9IHRydWU7XG4gICAgcDogbnVtYmVyO1xuICAgIHE6IG51bWJlcjtcbiAgICBfX3Nsb3RzX186IGFueVtdID0gW1wicFwiLCBcInFcIl07XG5cbiAgICBzdGF0aWMgaXNfUmF0aW9uYWwgPSB0cnVlO1xuXG5cbiAgICBjb25zdHJ1Y3RvcihwOiBhbnksIHE6IGFueSA9IHVuZGVmaW5lZCwgZ2NkOiBudW1iZXIgPSB1bmRlZmluZWQsIHNpbXBsaWZ5OiBib29sZWFuID0gdHJ1ZSkge1xuICAgICAgICBzdXBlcigpO1xuICAgICAgICBpZiAodHlwZW9mIHEgPT09IFwidW5kZWZpbmVkXCIpIHtcbiAgICAgICAgICAgIGlmIChwIGluc3RhbmNlb2YgUmF0aW9uYWwpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gcDtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgaWYgKHR5cGVvZiBwID09PSBcIm51bWJlclwiICYmIHAgJSAxICE9PSAwKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBuZXcgUmF0aW9uYWwodG9SYXRpbyhwLCAwLjAwMDEpKTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge31cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHEgPSAxO1xuICAgICAgICAgICAgZ2NkID0gMTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoIU51bWJlci5pc0ludGVnZXIocCkpIHtcbiAgICAgICAgICAgIHAgPSBuZXcgUmF0aW9uYWwocCk7XG4gICAgICAgICAgICBxICo9IHAucTtcbiAgICAgICAgICAgIHAgPSBwLnA7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKCFOdW1iZXIuaXNJbnRlZ2VyKHEpKSB7XG4gICAgICAgICAgICBxID0gbmV3IFJhdGlvbmFsKHEpO1xuICAgICAgICAgICAgcCAqPSBxLnE7XG4gICAgICAgICAgICBxID0gcS5wO1xuICAgICAgICB9XG4gICAgICAgIGlmIChxID09PSAwKSB7XG4gICAgICAgICAgICBpZiAocCA9PT0gMCkge1xuICAgICAgICAgICAgICAgIHJldHVybiBTLk5hbjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiBTLkNvbXBsZXhJbmZpbml0eTtcbiAgICAgICAgfVxuICAgICAgICBpZiAocSA8IDApIHtcbiAgICAgICAgICAgIHEgPSAtcTtcbiAgICAgICAgICAgIHAgPSAtcDtcbiAgICAgICAgfVxuICAgICAgICBpZiAodHlwZW9mIGdjZCA9PT0gXCJ1bmRlZmluZWRcIikge1xuICAgICAgICAgICAgZ2NkID0gaWdjZChNYXRoLmFicyhwKSwgcSk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGdjZCA+IDEpIHtcbiAgICAgICAgICAgIHAgPSBwL2djZDtcbiAgICAgICAgICAgIHEgPSBxL2djZDtcbiAgICAgICAgfVxuICAgICAgICBpZiAocSA9PT0gMSAmJiBzaW1wbGlmeSkge1xuICAgICAgICAgICAgcmV0dXJuIG5ldyBJbnRlZ2VyKHApO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMucCA9IHA7XG4gICAgICAgIHRoaXMucSA9IHE7XG4gICAgfVxuXG4gICAgaGFzaEtleSgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuY29uc3RydWN0b3IubmFtZSArIHRoaXMucCArIHRoaXMucTtcbiAgICB9XG5cbiAgICBfX2FkZF9fKG90aGVyOiBhbnkpIHtcbiAgICAgICAgaWYgKGdsb2JhbF9wYXJhbWV0ZXJzLmV2YWx1YXRlKSB7XG4gICAgICAgICAgICBpZiAob3RoZXIgaW5zdGFuY2VvZiBJbnRlZ2VyKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIG5ldyBSYXRpb25hbCh0aGlzLnAgKyB0aGlzLnEgKiBvdGhlci5wLCB0aGlzLnEsIDEpO1xuICAgICAgICAgICAgfSBlbHNlIGlmIChvdGhlciBpbnN0YW5jZW9mIFJhdGlvbmFsKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIG5ldyBSYXRpb25hbCh0aGlzLnAgKiBvdGhlci5xICsgdGhpcy5xICogb3RoZXIucCwgdGhpcy5xICogb3RoZXIucSk7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKG90aGVyIGluc3RhbmNlb2YgRmxvYXQpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gb3RoZXIuX19hZGRfXyh0aGlzKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHN1cGVyLl9fYWRkX18ob3RoZXIpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBzdXBlci5fX2FkZF9fKG90aGVyKTtcbiAgICB9XG5cbiAgICBfX3JhZGRfXyhvdGhlcjogYW55KSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9fYWRkX18ob3RoZXIpO1xuICAgIH1cblxuICAgIF9fc3ViX18ob3RoZXI6IGFueSkge1xuICAgICAgICBpZiAoZ2xvYmFsX3BhcmFtZXRlcnMuZXZhbHVhdGUpIHtcbiAgICAgICAgICAgIGlmIChvdGhlciBpbnN0YW5jZW9mIEludGVnZXIpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gbmV3IFJhdGlvbmFsKHRoaXMucSAqIG90aGVyLnAgLSB0aGlzLnAsIHRoaXMucSwgMSk7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKG90aGVyIGluc3RhbmNlb2YgUmF0aW9uYWwpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gbmV3IFJhdGlvbmFsKHRoaXMucCAqIG90aGVyLnEgLSB0aGlzLnEgKiBvdGhlci5wLCB0aGlzLnEgKiBvdGhlci5xKTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAob3RoZXIgaW5zdGFuY2VvZiBGbG9hdCkge1xuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLl9fbXVsX18oUy5OZWdhdGl2ZU9uZSkuX19hZGRfXyhvdGhlcik7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHJldHVybiBzdXBlci5fX3N1Yl9fKG90aGVyKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gc3VwZXIuX19zdWJfXyhvdGhlcik7XG4gICAgfVxuXG4gICAgX19yc3ViX18ob3RoZXI6IGFueSkge1xuICAgICAgICBpZiAoZ2xvYmFsX3BhcmFtZXRlcnMuZXZhbHVhdGUpIHtcbiAgICAgICAgICAgIGlmIChvdGhlciBpbnN0YW5jZW9mIEludGVnZXIpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gbmV3IFJhdGlvbmFsKHRoaXMucCAtIHRoaXMucSAqIG90aGVyLnAsIHRoaXMucSwgMSk7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKG90aGVyIGluc3RhbmNlb2YgUmF0aW9uYWwpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gbmV3IFJhdGlvbmFsKHRoaXMucSAqIG90aGVyLnAgLSB0aGlzLnAgKiBvdGhlci5xLCB0aGlzLnEgKiBvdGhlci5xKTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAob3RoZXIgaW5zdGFuY2VvZiBGbG9hdCkge1xuICAgICAgICAgICAgICAgIHJldHVybiBvdGhlci5fX211bF9fKFMuTmVnYXRpdmVPbmUpLl9fYWRkX18odGhpcyk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHJldHVybiBzdXBlci5fX3JzdWJfXyhvdGhlcik7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHN1cGVyLl9fcnN1Yl9fKG90aGVyKTtcbiAgICB9XG5cbiAgICBfX211bF9fKG90aGVyOiBhbnkpIHtcbiAgICAgICAgaWYgKGdsb2JhbF9wYXJhbWV0ZXJzLmV2YWx1YXRlKSB7XG4gICAgICAgICAgICBpZiAob3RoZXIgaW5zdGFuY2VvZiBJbnRlZ2VyKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIG5ldyBSYXRpb25hbCh0aGlzLnAgKiBvdGhlci5wLCB0aGlzLnEsIGlnY2Qob3RoZXIucCwgdGhpcy5xKSk7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKG90aGVyIGluc3RhbmNlb2YgUmF0aW9uYWwpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gbmV3IFJhdGlvbmFsKHRoaXMucCAqIG90aGVyLnAsIHRoaXMucSAqIG90aGVyLnEsIGlnY2QodGhpcy5wLCBvdGhlci5xKSAqIGlnY2QodGhpcy5xLCBvdGhlci5wKSk7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKG90aGVyIGluc3RhbmNlb2YgRmxvYXQpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gb3RoZXIuX19tdWxfXyh0aGlzKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHN1cGVyLl9fbXVsX18ob3RoZXIpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBzdXBlci5fX211bF9fKG90aGVyKTtcbiAgICB9XG5cbiAgICBfX3JtdWxfXyhvdGhlcjogYW55KSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9fbXVsX18ob3RoZXIpO1xuICAgIH1cblxuICAgIF9fdHJ1ZWRpdl9fKG90aGVyOiBhbnkpIHtcbiAgICAgICAgaWYgKGdsb2JhbF9wYXJhbWV0ZXJzLmV2YWx1YXRlKSB7XG4gICAgICAgICAgICBpZiAob3RoZXIgaW5zdGFuY2VvZiBJbnRlZ2VyKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIG5ldyBSYXRpb25hbCh0aGlzLnAsIHRoaXMucSAqIG90aGVyLnAsIGlnY2QodGhpcy5wLCBvdGhlci5wKSk7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKG90aGVyIGluc3RhbmNlb2YgUmF0aW9uYWwpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gbmV3IFJhdGlvbmFsKHRoaXMucCAqIG90aGVyLnEsIHRoaXMucSAqIG90aGVyLnAsIGlnY2QodGhpcy5wLCBvdGhlci5wKSAqIGlnY2QodGhpcy5xLCBvdGhlci5xKSk7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKG90aGVyIGluc3RhbmNlb2YgRmxvYXQpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5fX211bF9fKG90aGVyLmludmVyc2UoKSk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHJldHVybiBzdXBlci5fX3RydWVkaXZfXyhvdGhlcik7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHN1cGVyLl9fdHJ1ZWRpdl9fKG90aGVyKTtcbiAgICB9XG5cbiAgICBfX3J0cnVlZGl2X18ob3RoZXI6IGFueSkge1xuICAgICAgICBpZiAoZ2xvYmFsX3BhcmFtZXRlcnMuZXZhbHVhdGUpIHtcbiAgICAgICAgICAgIGlmIChvdGhlciBpbnN0YW5jZW9mIEludGVnZXIpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gbmV3IFJhdGlvbmFsKG90aGVyLnAgKiB0aGlzLnEsIHRoaXMucCwgaWdjZCh0aGlzLnAsIG90aGVyLnApKTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAob3RoZXIgaW5zdGFuY2VvZiBSYXRpb25hbCkge1xuICAgICAgICAgICAgICAgIHJldHVybiBuZXcgUmF0aW9uYWwob3RoZXIucCAqIHRoaXMucSwgb3RoZXIucSAqIHRoaXMucCwgaWdjZCh0aGlzLnAsIG90aGVyLnApICogaWdjZCh0aGlzLnEsIG90aGVyLnEpKTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAob3RoZXIgaW5zdGFuY2VvZiBGbG9hdCkge1xuICAgICAgICAgICAgICAgIHJldHVybiBvdGhlci5fX211bF9fKFMuT25lLl9fdHJ1ZWRpdl9fKHRoaXMpKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHN1cGVyLl9fcnRydWVkaXZfXyhvdGhlcik7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHN1cGVyLl9fcnRydWVkaXZfXyhvdGhlcik7XG4gICAgfVxuXG5cbiAgICBfZXZhbF9wb3dlcihleHB0OiBhbnkpIHtcbiAgICAgICAgaWYgKGV4cHQgaW5zdGFuY2VvZiBfTnVtYmVyXykge1xuICAgICAgICAgICAgaWYgKGV4cHQgaW5zdGFuY2VvZiBGbG9hdCkge1xuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLmV2YWxfZXZhbGYoZXhwdC5wcmVjKS5fZXZhbF9wb3dlcihleHB0KTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoZXhwdCBpbnN0YW5jZW9mIEludGVnZXIpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gbmV3IFJhdGlvbmFsKHRoaXMucCAqKiBleHB0LnAsIHRoaXMucSAqKiBleHB0LnAsIDEpO1xuICAgICAgICAgICAgfSBlbHNlIGlmIChleHB0IGluc3RhbmNlb2YgUmF0aW9uYWwpIHtcbiAgICAgICAgICAgICAgICBsZXQgaW50cGFydCA9IE1hdGguZmxvb3IoZXhwdC5wIC8gZXhwdC5xKTtcbiAgICAgICAgICAgICAgICBpZiAoaW50cGFydCkge1xuICAgICAgICAgICAgICAgICAgICBpbnRwYXJ0Kys7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHJlbWZyYWNwYXJ0ID0gaW50cGFydCAqIGV4cHQucSAtIGV4cHQucDtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgcmF0ZnJhY3BhcnQgPSBuZXcgUmF0aW9uYWwocmVtZnJhY3BhcnQsIGV4cHQucSk7XG4gICAgICAgICAgICAgICAgICAgIGlmICh0aGlzLnAgIT09IDEpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBtYXgtbGVuXG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gbmV3IEludGVnZXIodGhpcy5wKS5fZXZhbF9wb3dlcihleHB0KS5fX211bF9fKG5ldyBJbnRlZ2VyKHRoaXMucSkpLl9ldmFsX3Bvd2VyKHJhdGZyYWNwYXJ0KS5fX211bF9fKG5ldyBSYXRpb25hbCgxLCB0aGlzLnEgKiogaW50cGFydCwgMSkpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBuZXcgSW50ZWdlcih0aGlzLnEpLl9ldmFsX3Bvd2VyKHJhdGZyYWNwYXJ0KS5fX211bF9fKG5ldyBSYXRpb25hbCgxLCB0aGlzLnEgKiogaW50cGFydCwgMSkpO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHJlbWZyYWNwYXJ0ID0gZXhwdC5xIC0gZXhwdC5wO1xuICAgICAgICAgICAgICAgICAgICBjb25zdCByYXRmcmFjcGFydCA9IG5ldyBSYXRpb25hbChyZW1mcmFjcGFydCwgZXhwdC5xKTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXMucCAhPT0gMSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG1heC1sZW5cbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IHAxID0gbmV3IEludGVnZXIodGhpcy5wKS5fZXZhbF9wb3dlcihleHB0KTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IHAyID0gbmV3IEludGVnZXIodGhpcy5xKS5fZXZhbF9wb3dlcihyYXRmcmFjcGFydCk7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gcDEuX19tdWxfXyhwMikuX19tdWxfXyhuZXcgUmF0aW9uYWwoMSwgdGhpcy5xLCAxKSk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIG5ldyBJbnRlZ2VyKHRoaXMucSkuX2V2YWxfcG93ZXIocmF0ZnJhY3BhcnQpLl9fbXVsX18obmV3IFJhdGlvbmFsKDEsIHRoaXMucSwgMSkpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgIGFzX2NvZWZmX0FkZCgpIHtcbiAgICAgICAgcmV0dXJuIFt0aGlzLCBTLlplcm9dO1xuICAgIH1cblxuICAgIF9mbG9hdF92YWwocHJlYzogbnVtYmVyKTogYW55IHtcbiAgICAgICAgY29uc3QgYSA9IG5ldyBEZWNpbWFsKHRoaXMucCk7XG4gICAgICAgIGNvbnN0IGIgPSBuZXcgRGVjaW1hbCh0aGlzLnEpO1xuICAgICAgICByZXR1cm4gbmV3IEZsb2F0KERlY2ltYWwuc2V0KHtwcmVjaXNpb246IHByZWN9KS5kaXYoYSwgYikpO1xuICAgIH1cbiAgICBfYXNfbnVtZXJfZGVub20oKSB7XG4gICAgICAgIHJldHVybiBbbmV3IEludGVnZXIodGhpcy5wKSwgbmV3IEludGVnZXIodGhpcy5xKV07XG4gICAgfVxuXG4gICAgZmFjdG9ycyhsaW1pdDogYW55ID0gdW5kZWZpbmVkKSB7XG4gICAgICAgIHJldHVybiBmYWN0b3JyYXQodGhpcywgbGltaXQpO1xuICAgIH1cblxuICAgIF9ldmFsX2lzX25lZ2F0aXZlKCkge1xuICAgICAgICBpZiAodGhpcy5wIDwgMCAmJiB0aGlzLnEgPiAwKSB7XG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIF9ldmFsX2lzX3Bvc2l0aXZlKCkge1xuICAgICAgICByZXR1cm4gIXRoaXMuX2V2YWxfaXNfbmVnYXRpdmUoKTtcbiAgICB9XG5cbiAgICBfZXZhbF9pc19vZGQoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLnAgJSAyICE9PSAwO1xuICAgIH1cblxuICAgIF9ldmFsX2lzX2V2ZW4oKSB7XG4gICAgICAgIHJldHVybiB0aGlzLnAgJSAyID09PSAwO1xuICAgIH1cblxuICAgIF9ldmFsX2lzX2Zpbml0ZSgpIHtcbiAgICAgICAgcmV0dXJuICEodGhpcy5wID09PSBTLkluZmluaXR5IHx8IHRoaXMucCA9PT0gUy5OZWdhdGl2ZUluZmluaXR5KTtcbiAgICB9XG5cbiAgICBlcShvdGhlcjogUmF0aW9uYWwpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMucCA9PT0gb3RoZXIucCAmJiB0aGlzLnEgPT09IG90aGVyLnE7XG4gICAgfVxuXG4gICAgdG9TdHJpbmcoKSB7XG4gICAgICAgIHJldHVybiBTdHJpbmcodGhpcy5wKSArIFwiL1wiICsgU3RyaW5nKHRoaXMucSlcbiAgICB9XG59O1xuXG4vLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbmV3LWNhcFxuTWFuYWdlZFByb3BlcnRpZXMucmVnaXN0ZXIoUmF0aW9uYWwpO1xuXG5jbGFzcyBJbnRlZ2VyIGV4dGVuZHMgUmF0aW9uYWwge1xuICAgIC8qXG4gICAgUmVwcmVzZW50cyBpbnRlZ2VyIG51bWJlcnMgb2YgYW55IHNpemUuXG4gICAgRXhhbXBsZXNcbiAgICA9PT09PT09PVxuICAgID4+PiBmcm9tIHN5bXB5IGltcG9ydCBJbnRlZ2VyXG4gICAgPj4+IEludGVnZXIoMylcbiAgICAzXG4gICAgSWYgYSBmbG9hdCBvciBhIHJhdGlvbmFsIGlzIHBhc3NlZCB0byBJbnRlZ2VyLCB0aGUgZnJhY3Rpb25hbCBwYXJ0XG4gICAgd2lsbCBiZSBkaXNjYXJkZWQ7IHRoZSBlZmZlY3QgaXMgb2Ygcm91bmRpbmcgdG93YXJkIHplcm8uXG4gICAgPj4+IEludGVnZXIoMy44KVxuICAgIDNcbiAgICA+Pj4gSW50ZWdlcigtMy44KVxuICAgIC0zXG4gICAgQSBzdHJpbmcgaXMgYWNjZXB0YWJsZSBpbnB1dCBpZiBpdCBjYW4gYmUgcGFyc2VkIGFzIGFuIGludGVnZXI6XG4gICAgPj4+IEludGVnZXIoXCI5XCIgKiAyMClcbiAgICA5OTk5OTk5OTk5OTk5OTk5OTk5OVxuICAgIEl0IGlzIHJhcmVseSBuZWVkZWQgdG8gZXhwbGljaXRseSBpbnN0YW50aWF0ZSBhbiBJbnRlZ2VyLCBiZWNhdXNlXG4gICAgUHl0aG9uIGludGVnZXJzIGFyZSBhdXRvbWF0aWNhbGx5IGNvbnZlcnRlZCB0byBJbnRlZ2VyIHdoZW4gdGhleVxuICAgIGFyZSB1c2VkIGluIFN5bVB5IGV4cHJlc3Npb25zLlxuICAgIFwiXCJcIlxuICAgICovXG4gICAgc3RhdGljIGlzX2ludGVnZXIgPSB0cnVlO1xuICAgIHN0YXRpYyBpc19JbnRlZ2VyID0gdHJ1ZTtcbiAgICBfX3Nsb3RzX186IGFueVtdID0gW107XG4gICAgY29uc3RydWN0b3IocDogbnVtYmVyKSB7XG4gICAgICAgIHN1cGVyKHAsIHVuZGVmaW5lZCwgdW5kZWZpbmVkLCBmYWxzZSk7XG4gICAgICAgIHRoaXMucCA9IHA7XG4gICAgICAgIGlmIChwID09PSAxKSB7XG4gICAgICAgICAgICByZXR1cm4gUy5PbmU7XG4gICAgICAgIH0gZWxzZSBpZiAocCA9PT0gMCkge1xuICAgICAgICAgICAgcmV0dXJuIFMuWmVybztcbiAgICAgICAgfSBlbHNlIGlmIChwID09PSAtMSkge1xuICAgICAgICAgICAgcmV0dXJuIFMuTmVnYXRpdmVPbmU7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBmYWN0b3JzKGxpbWl0OiBhbnkgPSB1bmRlZmluZWQpIHtcbiAgICAgICAgcmV0dXJuIGZhY3RvcmludCh0aGlzLnAsIGxpbWl0KTtcbiAgICB9XG5cbiAgICBfX2FkZF9fKG90aGVyOiBhbnkpOiBhbnkge1xuICAgICAgICBpZiAoZ2xvYmFsX3BhcmFtZXRlcnMuZXZhbHVhdGUpIHtcbiAgICAgICAgICAgIGlmIChOdW1iZXIuaXNJbnRlZ2VyKG90aGVyKSkge1xuICAgICAgICAgICAgICAgIHJldHVybiBuZXcgSW50ZWdlcih0aGlzLnAgKyBvdGhlcik7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKG90aGVyIGluc3RhbmNlb2YgSW50ZWdlcikge1xuICAgICAgICAgICAgICAgIHJldHVybiBuZXcgSW50ZWdlcih0aGlzLnAgKyBvdGhlci5wKTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAob3RoZXIgaW5zdGFuY2VvZiBSYXRpb25hbCkge1xuICAgICAgICAgICAgICAgIHJldHVybiBuZXcgUmF0aW9uYWwodGhpcy5wICogb3RoZXIucSArIG90aGVyLnAsIG90aGVyLnEsIDEpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gc3VwZXIuX19hZGRfXyhvdGhlcik7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gbmV3IEFkZCh0cnVlLCB0cnVlLCB0aGlzLCBvdGhlcik7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBfX3JhZGRfXyhvdGhlcjogYW55KTogYW55IHtcbiAgICAgICAgaWYgKGdsb2JhbF9wYXJhbWV0ZXJzLmV2YWx1YXRlKSB7XG4gICAgICAgICAgICBpZiAoTnVtYmVyLmlzSW50ZWdlcihvdGhlcikpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gbmV3IEludGVnZXIob3RoZXIgKyB0aGlzLnApO1xuICAgICAgICAgICAgfSBlbHNlIGlmIChvdGhlciBpbnN0YW5jZW9mIFJhdGlvbmFsKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIG5ldyBSYXRpb25hbChvdGhlci5wICsgdGhpcy5wICogb3RoZXIucSwgb3RoZXIucSwgMSk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHJldHVybiBzdXBlci5fX3JhZGRfXyhvdGhlcik7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gc3VwZXIuX19yYWRkX18ob3RoZXIpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgX19zdWJfXyhvdGhlcjogYW55KTogYW55IHtcbiAgICAgICAgaWYgKGdsb2JhbF9wYXJhbWV0ZXJzLmV2YWx1YXRlKSB7XG4gICAgICAgICAgICBpZiAoTnVtYmVyLmlzSW50ZWdlcihvdGhlcikpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gbmV3IEludGVnZXIodGhpcy5wIC0gb3RoZXIpO1xuICAgICAgICAgICAgfSBlbHNlIGlmIChvdGhlciBpbnN0YW5jZW9mIEludGVnZXIpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gbmV3IEludGVnZXIodGhpcy5wIC0gb3RoZXIucCk7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKG90aGVyIGluc3RhbmNlb2YgUmF0aW9uYWwpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gbmV3IFJhdGlvbmFsKHRoaXMucCAqIG90aGVyLnEgLSBvdGhlci5wLCBvdGhlci5xLCAxKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHN1cGVyLl9fc3ViX18ob3RoZXIpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuIHN1cGVyLl9fc3ViX18ob3RoZXIpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgX19yc3ViX18ob3RoZXI6IGFueSk6IGFueSB7XG4gICAgICAgIGlmIChnbG9iYWxfcGFyYW1ldGVycy5ldmFsdWF0ZSkge1xuICAgICAgICAgICAgaWYgKE51bWJlci5pc0ludGVnZXIob3RoZXIpKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIG5ldyBJbnRlZ2VyKHRoaXMucCAtIG90aGVyKTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAob3RoZXIgaW5zdGFuY2VvZiBSYXRpb25hbCkge1xuICAgICAgICAgICAgICAgIHJldHVybiBuZXcgUmF0aW9uYWwob3RoZXIucCAtIHRoaXMucCAqIG90aGVyLnEsIG90aGVyLnEsIDEpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gc3VwZXIuX19yc3ViX18ob3RoZXIpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuIHN1cGVyLl9fcnN1Yl9fKG90aGVyKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIF9fbXVsX18ob3RoZXI6IGFueSk6IGFueSB7XG4gICAgICAgIGlmIChnbG9iYWxfcGFyYW1ldGVycy5ldmFsdWF0ZSkge1xuICAgICAgICAgICAgaWYgKE51bWJlci5pc0ludGVnZXIob3RoZXIpICkge1xuICAgICAgICAgICAgICAgIHJldHVybiBuZXcgSW50ZWdlcih0aGlzLnAgKiBvdGhlcik7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKG90aGVyIGluc3RhbmNlb2YgSW50ZWdlcikge1xuICAgICAgICAgICAgICAgIHJldHVybiBuZXcgSW50ZWdlcih0aGlzLnAgKiBvdGhlci5wKTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAob3RoZXIgaW5zdGFuY2VvZiBSYXRpb25hbCkge1xuICAgICAgICAgICAgICAgIHJldHVybiBuZXcgUmF0aW9uYWwodGhpcy5wICogb3RoZXIucCwgb3RoZXIucSwgaWdjZCh0aGlzLnAsIG90aGVyLnEpKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHN1cGVyLl9fbXVsX18ob3RoZXIpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuIHN1cGVyLl9fbXVsX18ob3RoZXIpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgX19ybXVsX18ob3RoZXI6IGFueSk6IGFueSB7XG4gICAgICAgIGlmIChnbG9iYWxfcGFyYW1ldGVycy5ldmFsdWF0ZSkge1xuICAgICAgICAgICAgaWYgKE51bWJlci5pc0ludGVnZXIob3RoZXIpICkge1xuICAgICAgICAgICAgICAgIHJldHVybiBuZXcgSW50ZWdlcihvdGhlciAqIHRoaXMucCk7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKG90aGVyIGluc3RhbmNlb2YgUmF0aW9uYWwpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gbmV3IFJhdGlvbmFsKG90aGVyLnAgKiB0aGlzLnAsIG90aGVyLnEsIGlnY2QodGhpcy5wLCBvdGhlci5xKSk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHJldHVybiBzdXBlci5fX3JtdWxfXyhvdGhlcik7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gc3VwZXIuX19ybXVsX18ob3RoZXIpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgX2V2YWxfaXNfbmVnYXRpdmUoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLnAgPCAwO1xuICAgIH1cblxuICAgIF9ldmFsX2lzX3Bvc2l0aXZlKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5wID4gMDtcbiAgICB9XG5cbiAgICBfZXZhbF9pc19vZGQoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLnAgJSAyID09PSAxO1xuICAgIH1cblxuICAgIF9ldmFsX3Bvd2VyKGV4cHQ6IGFueSk6IGFueSB7XG4gICAgICAgIGlmIChleHB0ID09PSBTLkluZmluaXR5KSB7XG4gICAgICAgICAgICBpZiAodGhpcy5wID4gMSkge1xuICAgICAgICAgICAgICAgIHJldHVybiBTLkluZmluaXR5O1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGlmIChleHB0ID09PSBTLk5lZ2F0aXZlSW5maW5pdHkpIHtcbiAgICAgICAgICAgIHJldHVybiBuZXcgUmF0aW9uYWwoMSwgdGhpcywgMSkuX2V2YWxfcG93ZXIoUy5JbmZpbml0eSk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKCEoZXhwdCBpbnN0YW5jZW9mIF9OdW1iZXJfKSkge1xuICAgICAgICAgICAgaWYgKHRoaXMuaXNfbmVnYXRpdmUgJiYgZXhwdC5pc19ldmVuKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuX19tdWxfXyhTLk5lZ2F0aXZlT25lKS5fZXZhbF9wb3dlcihleHB0KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBpZiAoZXhwdCBpbnN0YW5jZW9mIEZsb2F0KSB7XG4gICAgICAgICAgICByZXR1cm4gc3VwZXIuX2V2YWxfcG93ZXIoZXhwdCk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKCEoZXhwdCBpbnN0YW5jZW9mIFJhdGlvbmFsKSkge1xuICAgICAgICAgICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgICAgICAgfVxuICAgICAgICBpZiAoZXhwdC5pc19uZWdhdGl2ZSgpKSB7XG4gICAgICAgICAgICBjb25zdCBuZSA9IGV4cHQuX19tdWxfXyhTLk5lZ2F0aXZlT25lKTtcbiAgICAgICAgICAgIGlmICh0aGlzLmlzX25lZ2F0aXZlKCkpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gUy5OZWdhdGl2ZU9uZS5fZXZhbF9wb3dlcihleHB0KS5fX211bF9fKG5ldyBSYXRpb25hbCgxLCB0aGlzLl9fbXVsX18oUy5OZWdhdGl2ZU9uZSksIDEpKS5fZXZhbF9wb3dlcihuZSk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHJldHVybiBuZXcgUmF0aW9uYWwoMSwgdGhpcy5wLCAxKS5fZXZhbF9wb3dlcihuZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgY29uc3QgW3gsIHhleGFjdF0gPSBpbnRfbnRocm9vdChNYXRoLmFicyh0aGlzLnApLCBleHB0LnEpO1xuICAgICAgICBpZiAoeGV4YWN0KSB7XG4gICAgICAgICAgICBsZXQgcmVzdWx0ID0gbmV3IEludGVnZXIoKHggYXMgbnVtYmVyKSoqTWF0aC5hYnMoZXhwdC5wKSk7XG4gICAgICAgICAgICBpZiAodGhpcy5pc19uZWdhdGl2ZSgpKSB7XG4gICAgICAgICAgICAgICAgcmVzdWx0ID0gcmVzdWx0Ll9fbXVsX18oUy5OZWdhdGl2ZU9uZS5fZXZhbF9wb3dlcihleHB0KSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gcmVzdWx0O1xuICAgICAgICB9XG4gICAgICAgIGNvbnN0IGJfcG9zID0gTWF0aC5hYnModGhpcy5wKTtcbiAgICAgICAgY29uc3QgcCA9IHBlcmZlY3RfcG93ZXIoYl9wb3MpO1xuICAgICAgICBsZXQgZGljdCA9IG5ldyBIYXNoRGljdCgpO1xuICAgICAgICBpZiAocCAhPT0gZmFsc2UpIHtcbiAgICAgICAgICAgIGRpY3QuYWRkKHBbMF0sIHBbMV0pO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgZGljdCA9IG5ldyBJbnRlZ2VyKGJfcG9zKS5mYWN0b3JzKDIqKjE1KTtcbiAgICAgICAgfVxuXG4gICAgICAgIGxldCBvdXRfaW50ID0gMTtcbiAgICAgICAgbGV0IG91dF9yYWQ6IEludGVnZXIgPSBTLk9uZTtcbiAgICAgICAgbGV0IHNxcl9pbnQgPSAxO1xuICAgICAgICBsZXQgc3FyX2djZCA9IDA7XG4gICAgICAgIGNvbnN0IHNxcl9kaWN0ID0gbmV3IEhhc2hEaWN0KCk7XG4gICAgICAgIGxldCBwcmltZTsgbGV0IGV4cG9uZW50O1xuICAgICAgICBmb3IgKFtwcmltZSwgZXhwb25lbnRdIG9mIGRpY3QuZW50cmllcygpKSB7XG4gICAgICAgICAgICBleHBvbmVudCAqPSBleHB0LnA7XG4gICAgICAgICAgICBjb25zdCBbZGl2X2UsIGRpdl9tXSA9IGRpdm1vZChleHBvbmVudCwgZXhwdC5xKTtcbiAgICAgICAgICAgIGlmIChkaXZfZSA+IDApIHtcbiAgICAgICAgICAgICAgICBvdXRfaW50ICo9IHByaW1lKipkaXZfZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChkaXZfbSA+IDApIHtcbiAgICAgICAgICAgICAgICBjb25zdCBnID0gaWdjZChkaXZfbSwgZXhwdC5xKTtcbiAgICAgICAgICAgICAgICBpZiAoZyAhPT0gMSkge1xuICAgICAgICAgICAgICAgICAgICBvdXRfcmFkID0gb3V0X3JhZC5fX211bF9fKG5ldyBQb3cocHJpbWUsIG5ldyBSYXRpb25hbChNYXRoLmZsb29yKGRpdl9tL2cpLCBNYXRoLmZsb29yKGV4cHQucS9nKSwgMSkpKTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBzcXJfZGljdC5hZGQocHJpbWUsIGRpdl9tKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgZm9yIChjb25zdCBbLCBleF0gb2Ygc3FyX2RpY3QuZW50cmllcygpKSB7XG4gICAgICAgICAgICBpZiAoc3FyX2djZCA9PT0gMCkge1xuICAgICAgICAgICAgICAgIHNxcl9nY2QgPSBleDtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgc3FyX2djZCA9IGlnY2Qoc3FyX2djZCwgZXgpO1xuICAgICAgICAgICAgICAgIGlmIChzcXJfZ2NkID09PSAxKSB7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBmb3IgKGNvbnN0IFtrLCB2XSBvZiBzcXJfZGljdC5lbnRyaWVzKCkpIHtcbiAgICAgICAgICAgIHNxcl9pbnQgKj0gayoqKE1hdGguZmxvb3Iodi9zcXJfZ2NkKSk7XG4gICAgICAgIH1cbiAgICAgICAgbGV0IHJlc3VsdDogYW55O1xuICAgICAgICBpZiAoc3FyX2ludCA9PT0gYl9wb3MgJiYgb3V0X2ludCA9PT0gMSAmJiBvdXRfcmFkID09PSBTLk9uZSkge1xuICAgICAgICAgICAgcmVzdWx0ID0gdW5kZWZpbmVkO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgY29uc3QgcDEgPSBvdXRfcmFkLl9fbXVsX18obmV3IEludGVnZXIob3V0X2ludCkpO1xuICAgICAgICAgICAgY29uc3QgcDIgPSBuZXcgUG93KG5ldyBJbnRlZ2VyKHNxcl9pbnQpLCBuZXcgUmF0aW9uYWwoc3FyX2djZCwgZXhwdC5xKSk7XG4gICAgICAgICAgICByZXN1bHQgPSBuZXcgTXVsKHRydWUsIHRydWUsIHAxLCBwMik7XG4gICAgICAgICAgICBpZiAodGhpcy5pc19uZWdhdGl2ZSgpKSB7XG4gICAgICAgICAgICAgICAgcmVzdWx0ID0gcmVzdWx0Ll9fbXVsX18obmV3IFBvdyhTLk5lZ2F0aXZlT25lLCBleHB0KSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICB9XG5cbiAgICB0b1N0cmluZygpIHtcbiAgICAgICAgcmV0dXJuIFN0cmluZyh0aGlzLnApO1xuICAgIH1cbn07XG5cbk1hbmFnZWRQcm9wZXJ0aWVzLnJlZ2lzdGVyKEludGVnZXIpO1xuXG5cbmNsYXNzIEludGVnZXJDb25zdGFudCBleHRlbmRzIEludGVnZXIge1xuICAgIF9fc2xvdHNfXzogYW55W10gPSBbXTtcbn07XG5cbk1hbmFnZWRQcm9wZXJ0aWVzLnJlZ2lzdGVyKEludGVnZXJDb25zdGFudCk7XG5cbmNsYXNzIFplcm8gZXh0ZW5kcyBJbnRlZ2VyQ29uc3RhbnQge1xuICAgIC8qXG4gICAgVGhlIG51bWJlciB6ZXJvLlxuICAgIFplcm8gaXMgYSBzaW5nbGV0b24sIGFuZCBjYW4gYmUgYWNjZXNzZWQgYnkgYGBTLlplcm9gYFxuICAgIEV4YW1wbGVzXG4gICAgPT09PT09PT1cbiAgICA+Pj4gZnJvbSBzeW1weSBpbXBvcnQgUywgSW50ZWdlclxuICAgID4+PiBJbnRlZ2VyKDApIGlzIFMuWmVyb1xuICAgIFRydWVcbiAgICA+Pj4gMS9TLlplcm9cbiAgICB6b29cbiAgICBSZWZlcmVuY2VzXG4gICAgPT09PT09PT09PVxuICAgIC4uIFsxXSBodHRwczovL2VuLndpa2lwZWRpYS5vcmcvd2lraS9aZXJvXG4gICAgKi9cbiAgICBfX3Nsb3RzX186IGFueVtdID0gW107XG4gICAgc3RhdGljIGlzX3Bvc2l0aXZlID0gZmFsc2U7XG4gICAgc3RhdGljIHN0YXRpYyA9IGZhbHNlO1xuICAgIHN0YXRpYyBpc196ZXJvID0gdHJ1ZTtcbiAgICBzdGF0aWMgaXNfbnVtYmVyID0gdHJ1ZTtcbiAgICBzdGF0aWMgaXNfY29tcGFyYWJsZSA9IHRydWU7XG4gICAgY29uc3RydWN0b3IoKSB7XG4gICAgICAgIHN1cGVyKDApO1xuICAgIH1cbn07XG5cbk1hbmFnZWRQcm9wZXJ0aWVzLnJlZ2lzdGVyKFplcm8pO1xuXG5cbmNsYXNzIE9uZSBleHRlbmRzIEludGVnZXJDb25zdGFudCB7XG4gICAgLypcbiAgICBUaGUgbnVtYmVyIG9uZS5cbiAgICBPbmUgaXMgYSBzaW5nbGV0b24sIGFuZCBjYW4gYmUgYWNjZXNzZWQgYnkgYGBTLk9uZWBgLlxuICAgIEV4YW1wbGVzXG4gICAgPT09PT09PT1cbiAgICA+Pj4gZnJvbSBzeW1weSBpbXBvcnQgUywgSW50ZWdlclxuICAgID4+PiBJbnRlZ2VyKDEpIGlzIFMuT25lXG4gICAgVHJ1ZVxuICAgIFJlZmVyZW5jZXNcbiAgICA9PT09PT09PT09XG4gICAgLi4gWzFdIGh0dHBzOi8vZW4ud2lraXBlZGlhLm9yZy93aWtpLzFfJTI4bnVtYmVyJTI5XG4gICAgKi9cbiAgICBzdGF0aWMgaXNfbnVtYmVyID0gdHJ1ZTtcbiAgICBzdGF0aWMgaXNfcG9zaXRpdmUgPSB0cnVlO1xuICAgIHN0YXRpYyBpc196ZXJvID0gZmFsc2U7XG4gICAgX19zbG90c19fOiBhbnlbXSA9IFtdO1xuICAgIGNvbnN0cnVjdG9yKCkge1xuICAgICAgICBzdXBlcigxKTtcbiAgICB9XG59O1xuXG5NYW5hZ2VkUHJvcGVydGllcy5yZWdpc3RlcihPbmUpO1xuXG5cbmNsYXNzIE5lZ2F0aXZlT25lIGV4dGVuZHMgSW50ZWdlckNvbnN0YW50IHtcbiAgICAvKlxuICAgIFRoZSBudW1iZXIgbmVnYXRpdmUgb25lLlxuICAgIE5lZ2F0aXZlT25lIGlzIGEgc2luZ2xldG9uLCBhbmQgY2FuIGJlIGFjY2Vzc2VkIGJ5IGBgUy5OZWdhdGl2ZU9uZWBgLlxuICAgIEV4YW1wbGVzXG4gICAgPT09PT09PT1cbiAgICA+Pj4gZnJvbSBzeW1weSBpbXBvcnQgUywgSW50ZWdlclxuICAgID4+PiBJbnRlZ2VyKC0xKSBpcyBTLk5lZ2F0aXZlT25lXG4gICAgVHJ1ZVxuICAgIFNlZSBBbHNvXG4gICAgPT09PT09PT1cbiAgICBPbmVcbiAgICBSZWZlcmVuY2VzXG4gICAgPT09PT09PT09PVxuICAgIC4uIFsxXSBodHRwczovL2VuLndpa2lwZWRpYS5vcmcvd2lraS8lRTIlODglOTIxXyUyOG51bWJlciUyOVxuICAgICovXG4gICAgc3RhdGljIGlzX251bWJlciA9IHRydWU7XG4gICAgX19zbG90c19fOiBhbnlbXSA9IFtdO1xuICAgIGNvbnN0cnVjdG9yKCkge1xuICAgICAgICBzdXBlcigtMSk7XG4gICAgfVxuXG4gICAgX2V2YWxfcG93ZXIoZXhwdDogYW55KSB7XG4gICAgICAgIGlmIChleHB0LmlzX29kZCkge1xuICAgICAgICAgICAgcmV0dXJuIFMuTmVnYXRpdmVPbmU7XG4gICAgICAgIH0gZWxzZSBpZiAoZXhwdC5pc19ldmVuKSB7XG4gICAgICAgICAgICByZXR1cm4gUy5PbmU7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGV4cHQgaW5zdGFuY2VvZiBfTnVtYmVyXykge1xuICAgICAgICAgICAgaWYgKGV4cHQgaW5zdGFuY2VvZiBGbG9hdCkge1xuICAgICAgICAgICAgICAgIHJldHVybiBuZXcgRmxvYXQoLTEuMCkuX2V2YWxfcG93ZXIoZXhwdCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoZXhwdCA9PT0gUy5OYU4pIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gUy5OYU47XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoZXhwdCA9PT0gUy5JbmZpbml0eSB8fCBleHB0ID09PSBTLk5lZ2F0aXZlSW5maW5pdHkpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gUy5OYU47XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuO1xuICAgIH1cbn07XG5cbk1hbmFnZWRQcm9wZXJ0aWVzLnJlZ2lzdGVyKE5lZ2F0aXZlT25lKTtcblxuY2xhc3MgTmFOIGV4dGVuZHMgX051bWJlcl8ge1xuICAgIC8qXG4gICAgTm90IGEgTnVtYmVyLlxuICAgIEV4cGxhbmF0aW9uXG4gICAgPT09PT09PT09PT1cbiAgICBUaGlzIHNlcnZlcyBhcyBhIHBsYWNlIGhvbGRlciBmb3IgbnVtZXJpYyB2YWx1ZXMgdGhhdCBhcmUgaW5kZXRlcm1pbmF0ZS5cbiAgICBNb3N0IG9wZXJhdGlvbnMgb24gTmFOLCBwcm9kdWNlIGFub3RoZXIgTmFOLiAgTW9zdCBpbmRldGVybWluYXRlIGZvcm1zLFxuICAgIHN1Y2ggYXMgYGAwLzBgYCBvciBgYG9vIC0gb29gIHByb2R1Y2UgTmFOLiAgVHdvIGV4Y2VwdGlvbnMgYXJlIGBgMCoqMGBgXG4gICAgYW5kIGBgb28qKjBgYCwgd2hpY2ggYWxsIHByb2R1Y2UgYGAxYGAgKHRoaXMgaXMgY29uc2lzdGVudCB3aXRoIFB5dGhvbidzXG4gICAgZmxvYXQpLlxuICAgIE5hTiBpcyBsb29zZWx5IHJlbGF0ZWQgdG8gZmxvYXRpbmcgcG9pbnQgbmFuLCB3aGljaCBpcyBkZWZpbmVkIGluIHRoZVxuICAgIElFRUUgNzU0IGZsb2F0aW5nIHBvaW50IHN0YW5kYXJkLCBhbmQgY29ycmVzcG9uZHMgdG8gdGhlIFB5dGhvblxuICAgIGBgZmxvYXQoJ25hbicpYGAuICBEaWZmZXJlbmNlcyBhcmUgbm90ZWQgYmVsb3cuXG4gICAgTmFOIGlzIG1hdGhlbWF0aWNhbGx5IG5vdCBlcXVhbCB0byBhbnl0aGluZyBlbHNlLCBldmVuIE5hTiBpdHNlbGYuICBUaGlzXG4gICAgZXhwbGFpbnMgdGhlIGluaXRpYWxseSBjb3VudGVyLWludHVpdGl2ZSByZXN1bHRzIHdpdGggYGBFcWBgIGFuZCBgYD09YGAgaW5cbiAgICB0aGUgZXhhbXBsZXMgYmVsb3cuXG4gICAgTmFOIGlzIG5vdCBjb21wYXJhYmxlIHNvIGluZXF1YWxpdGllcyByYWlzZSBhIFR5cGVFcnJvci4gIFRoaXMgaXMgaW5cbiAgICBjb250cmFzdCB3aXRoIGZsb2F0aW5nIHBvaW50IG5hbiB3aGVyZSBhbGwgaW5lcXVhbGl0aWVzIGFyZSBmYWxzZS5cbiAgICBOYU4gaXMgYSBzaW5nbGV0b24sIGFuZCBjYW4gYmUgYWNjZXNzZWQgYnkgYGBTLk5hTmBgLCBvciBjYW4gYmUgaW1wb3J0ZWRcbiAgICBhcyBgYG5hbmBgLlxuICAgIEV4YW1wbGVzXG4gICAgPT09PT09PT1cbiAgICA+Pj4gZnJvbSBzeW1weSBpbXBvcnQgbmFuLCBTLCBvbywgRXFcbiAgICA+Pj4gbmFuIGlzIFMuTmFOXG4gICAgVHJ1ZVxuICAgID4+PiBvbyAtIG9vXG4gICAgbmFuXG4gICAgPj4+IG5hbiArIDFcbiAgICBuYW5cbiAgICA+Pj4gRXEobmFuLCBuYW4pICAgIyBtYXRoZW1hdGljYWwgZXF1YWxpdHlcbiAgICBGYWxzZVxuICAgID4+PiBuYW4gPT0gbmFuICAgICAjIHN0cnVjdHVyYWwgZXF1YWxpdHlcbiAgICBUcnVlXG4gICAgUmVmZXJlbmNlc1xuICAgID09PT09PT09PT1cbiAgICAuLiBbMV0gaHR0cHM6Ly9lbi53aWtpcGVkaWEub3JnL3dpa2kvTmFOXG4gICAgKi9cbiAgICBzdGF0aWMgaXNfY29tbXV0YXRpdmUgPSB0cnVlO1xuICAgIHN0YXRpYyBpc19leHRlbmRlZF9yZWFsOiBhbnkgPSB1bmRlZmluZWQ7XG4gICAgc3RhdGljIGlzX3JlYWw6IGFueSA9IHVuZGVmaW5lZDtcbiAgICBzdGF0aWMgaXNfcmF0aW9uYWw6IGFueSA9IHVuZGVmaW5lZDtcbiAgICBzdGF0aWMgaXNfYWxnZWJyYWljOiBhbnkgPSB1bmRlZmluZWQ7XG4gICAgc3RhdGljIGlzX3RyYW5zY2VuZGVudGFsOiBhbnkgPSB1bmRlZmluZWQ7XG4gICAgc3RhdGljIGlzX2ludGVnZXI6IGFueSA9IHVuZGVmaW5lZDtcbiAgICBzdGF0aWMgaXNfY29tcGFyYWJsZSA9IGZhbHNlO1xuICAgIHN0YXRpYyBpc19maW5pdGU6IGFueSA9IHVuZGVmaW5lZDtcbiAgICBzdGF0aWMgaXNfemVybzogYW55ID0gdW5kZWZpbmVkO1xuICAgIHN0YXRpYyBpc19wcmltZTogYW55ID0gdW5kZWZpbmVkO1xuICAgIHN0YXRpYyBpc19wb3NpdGl2ZTogYW55ID0gdW5kZWZpbmVkO1xuICAgIHN0YXRpYyBpc19uZWdhdGl2ZTogYW55ID0gdW5kZWZpbmVkO1xuICAgIHN0YXRpYyBpc19udW1iZXIgPSB0cnVlO1xuICAgIF9fc2xvdHNfXzogYW55ID0gW107XG4gICAgdG9TdHJpbmcoKSB7XG4gICAgICAgIHJldHVybiBcIk5BTlwiO1xuICAgIH1cbn1cblxuTWFuYWdlZFByb3BlcnRpZXMucmVnaXN0ZXIoTmFOKTtcblxuLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5ldy1jYXBcbmNsYXNzIENvbXBsZXhJbmZpbml0eSBleHRlbmRzIF9BdG9taWNFeHByIHtcbiAgICAvKlxuICAgIENvbXBsZXggaW5maW5pdHkuXG4gICAgRXhwbGFuYXRpb25cbiAgICA9PT09PT09PT09PVxuICAgIEluIGNvbXBsZXggYW5hbHlzaXMgdGhlIHN5bWJvbCBgXFx0aWxkZVxcaW5mdHlgLCBjYWxsZWQgXCJjb21wbGV4XG4gICAgaW5maW5pdHlcIiwgcmVwcmVzZW50cyBhIHF1YW50aXR5IHdpdGggaW5maW5pdGUgbWFnbml0dWRlLCBidXRcbiAgICB1bmRldGVybWluZWQgY29tcGxleCBwaGFzZS5cbiAgICBDb21wbGV4SW5maW5pdHkgaXMgYSBzaW5nbGV0b24sIGFuZCBjYW4gYmUgYWNjZXNzZWQgYnlcbiAgICBgYFMuQ29tcGxleEluZmluaXR5YGAsIG9yIGNhbiBiZSBpbXBvcnRlZCBhcyBgYHpvb2BgLlxuICAgIEV4YW1wbGVzXG4gICAgPT09PT09PT1cbiAgICA+Pj4gZnJvbSBzeW1weSBpbXBvcnQgem9vXG4gICAgPj4+IHpvbyArIDQyXG4gICAgem9vXG4gICAgPj4+IDQyL3pvb1xuICAgIDBcbiAgICA+Pj4gem9vICsgem9vXG4gICAgbmFuXG4gICAgPj4+IHpvbyp6b29cbiAgICB6b29cbiAgICBTZWUgQWxzb1xuICAgID09PT09PT09XG4gICAgSW5maW5pdHlcbiAgICAqL1xuICAgIHN0YXRpYyBpc19jb21tdXRhdGl2ZSA9IHRydWU7XG4gICAgc3RhdGljIGlzX2luZmluaXRlID0gdHJ1ZTtcbiAgICBzdGF0aWMgaXNfbnVtYmVyID0gdHJ1ZTtcbiAgICBzdGF0aWMgaXNfcHJpbWUgPSBmYWxzZTtcbiAgICBzdGF0aWMgaXNfY29tcGxleCA9IGZhbHNlO1xuICAgIHN0YXRpYyBpc19leHRlbmRlZF9yZWFsID0gZmFsc2U7XG4gICAga2luZCA9IE51bWJlcktpbmQ7XG4gICAgX19zbG90c19fOiBhbnkgPSBbXTtcblxuICAgIGNvbnN0cnVjdG9yKCkge1xuICAgICAgICBzdXBlcigpO1xuICAgIH1cblxuICAgIHRvU3RyaW5nKCkge1xuICAgICAgICByZXR1cm4gXCJDb21wbGV4SW5maW5pdHlcIjtcbiAgICB9XG59XG5cbk1hbmFnZWRQcm9wZXJ0aWVzLnJlZ2lzdGVyKENvbXBsZXhJbmZpbml0eSk7XG5cbmNsYXNzIEluZmluaXR5IGV4dGVuZHMgX051bWJlcl8ge1xuICAgIC8qXG4gICAgUG9zaXRpdmUgaW5maW5pdGUgcXVhbnRpdHkuXG4gICAgRXhwbGFuYXRpb25cbiAgICA9PT09PT09PT09PVxuICAgIEluIHJlYWwgYW5hbHlzaXMgdGhlIHN5bWJvbCBgXFxpbmZ0eWAgZGVub3RlcyBhbiB1bmJvdW5kZWRcbiAgICBsaW1pdDogYHhcXHRvXFxpbmZ0eWAgbWVhbnMgdGhhdCBgeGAgZ3Jvd3Mgd2l0aG91dCBib3VuZC5cbiAgICBJbmZpbml0eSBpcyBvZnRlbiB1c2VkIG5vdCBvbmx5IHRvIGRlZmluZSBhIGxpbWl0IGJ1dCBhcyBhIHZhbHVlXG4gICAgaW4gdGhlIGFmZmluZWx5IGV4dGVuZGVkIHJlYWwgbnVtYmVyIHN5c3RlbS4gIFBvaW50cyBsYWJlbGVkIGArXFxpbmZ0eWBcbiAgICBhbmQgYC1cXGluZnR5YCBjYW4gYmUgYWRkZWQgdG8gdGhlIHRvcG9sb2dpY2FsIHNwYWNlIG9mIHRoZSByZWFsIG51bWJlcnMsXG4gICAgcHJvZHVjaW5nIHRoZSB0d28tcG9pbnQgY29tcGFjdGlmaWNhdGlvbiBvZiB0aGUgcmVhbCBudW1iZXJzLiAgQWRkaW5nXG4gICAgYWxnZWJyYWljIHByb3BlcnRpZXMgdG8gdGhpcyBnaXZlcyB1cyB0aGUgZXh0ZW5kZWQgcmVhbCBudW1iZXJzLlxuICAgIEluZmluaXR5IGlzIGEgc2luZ2xldG9uLCBhbmQgY2FuIGJlIGFjY2Vzc2VkIGJ5IGBgUy5JbmZpbml0eWBgLFxuICAgIG9yIGNhbiBiZSBpbXBvcnRlZCBhcyBgYG9vYGAuXG4gICAgRXhhbXBsZXNcbiAgICA9PT09PT09PVxuICAgID4+PiBmcm9tIHN5bXB5IGltcG9ydCBvbywgZXhwLCBsaW1pdCwgU3ltYm9sXG4gICAgPj4+IDEgKyBvb1xuICAgIG9vXG4gICAgPj4+IDQyL29vXG4gICAgMFxuICAgID4+PiB4ID0gU3ltYm9sKCd4JylcbiAgICA+Pj4gbGltaXQoZXhwKHgpLCB4LCBvbylcbiAgICBvb1xuICAgIFNlZSBBbHNvXG4gICAgPT09PT09PT1cbiAgICBOZWdhdGl2ZUluZmluaXR5LCBOYU5cbiAgICBSZWZlcmVuY2VzXG4gICAgPT09PT09PT09PVxuICAgIC4uIFsxXSBodHRwczovL2VuLndpa2lwZWRpYS5vcmcvd2lraS9JbmZpbml0eVxuICAgICovXG4gICAgc3RhdGljIGlzX2NvbW11dGF0aXZlID0gdHJ1ZTtcbiAgICBzdGF0aWMgaXNfbnVtYmVyID0gdHJ1ZTtcbiAgICBzdGF0aWMgaXNfY29tcGxleCA9IGZhbHNlO1xuICAgIHN0YXRpYyBpc19leHRlbmRlZF9yZWFsID0gdHJ1ZTtcbiAgICBzdGF0aWMgaXNfaW5maW5pdGUgPSB0cnVlO1xuICAgIHN0YXRpYyBpc19jb21wYXJhYmxlID0gdHJ1ZTtcbiAgICBzdGF0aWMgaXNfZXh0ZW5kZWRfcG9zaXRpdmUgPSB0cnVlO1xuICAgIHN0YXRpYyBpc19wcmltZSA9IGZhbHNlO1xuICAgIF9fc2xvdHNfXzogYW55ID0gW107XG5cbiAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICAgICAgc3VwZXIoKTtcbiAgICB9XG5cbiAgICAvLyBOT1RFOiBtb3JlIGFyaXRobWV0aWMgbWV0aG9kcyBzaG91bGQgYmUgaW1wbGVtZW50ZWQgYnV0IEkgaGF2ZSBvbmx5XG4gICAgLy8gZG9uZSBlbm91Z2ggc3VjaCB0aGF0IGFkZCBhbmQgbXVsIGNhbiBoYW5kbGUgaW5maW5pdHkgYXMgYW4gYXJndW1lbnRcbiAgICBfX2FkZF9fKG90aGVyOiBhbnkpIHtcbiAgICAgICAgaWYgKG90aGVyIGluc3RhbmNlb2YgX051bWJlcl8gJiYgZ2xvYmFsX3BhcmFtZXRlcnMuZXZhbHVhdGUpIHtcbiAgICAgICAgICAgIGlmIChvdGhlciA9PT0gUy5OZWdhdGl2ZUluZmluaXR5IHx8IG90aGVyID09PSBTLk5hTikge1xuICAgICAgICAgICAgICAgIHJldHVybiBTLk5hTjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBzdXBlci5fX2FkZF9fKG90aGVyKTtcbiAgICB9XG5cbiAgICBfX211bF9fKG90aGVyOiBhbnkpIHtcbiAgICAgICAgaWYgKG90aGVyIGluc3RhbmNlb2YgX051bWJlcl8gJiYgZ2xvYmFsX3BhcmFtZXRlcnMuZXZhbHVhdGUpIHtcbiAgICAgICAgICAgIGlmIChvdGhlciA9PT0gUy5aZXJvIHx8IG90aGVyID09PSBTLk5hTikge1xuICAgICAgICAgICAgICAgIHJldHVybiBTLk5hTjtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAob3RoZXIuaXNfZXh0ZW5kZWRfcG9zaXRpdmUoKSkge1xuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIFMuTmVnYXRpdmVJbmZpbml0eTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gc3VwZXIuX19tdWxfXyhvdGhlcik7XG4gICAgfVxuXG4gICAgdG9TdHJpbmcoKSB7XG4gICAgICAgIHJldHVybiBcIkluZmluaXR5XCI7XG4gICAgfVxufVxuXG5jbGFzcyBOZWdhdGl2ZUluZmluaXR5IGV4dGVuZHMgX051bWJlcl8ge1xuICAgIC8qXG4gICAgXCJOZWdhdGl2ZSBpbmZpbml0ZSBxdWFudGl0eS5cbiAgICBOZWdhdGl2ZUluZmluaXR5IGlzIGEgc2luZ2xldG9uLCBhbmQgY2FuIGJlIGFjY2Vzc2VkXG4gICAgYnkgYGBTLk5lZ2F0aXZlSW5maW5pdHlgYC5cbiAgICBTZWUgQWxzb1xuICAgID09PT09PT09XG4gICAgSW5maW5pdHlcbiAgICAqL1xuICAgIHN0YXRpYyBpc19leHRlbmRlZF9yZWFsID0gdHJ1ZTtcbiAgICBzdGF0aWMgaXNfY29tcGxleCA9IGZhbHNlO1xuICAgIHN0YXRpYyBpc19jb21tdXRhdGl2ZSA9IHRydWU7XG4gICAgc3RhdGljIGlzX2luZmluaXRlID0gdHJ1ZTtcbiAgICBzdGF0aWMgaXNfY29tcGFyYWJsZSA9IHRydWU7XG4gICAgc3RhdGljIGlzX2V4dGVuZGVkX25lZ2F0aXZlID0gdHJ1ZTtcbiAgICBzdGF0aWMgaXNfbnVtYmVyID0gdHJ1ZTtcbiAgICBzdGF0aWMgaXNfcHJpbWUgPSBmYWxzZTtcbiAgICBfX3Nsb3RzX186IGFueSA9IFtdO1xuXG4gICAgY29uc3RydWN0b3IoKSB7XG4gICAgICAgIHN1cGVyKCk7XG4gICAgfVxuXG4gICAgLy8gTk9URTogbW9yZSBhcml0aG1ldGljIG1ldGhvZHMgc2hvdWxkIGJlIGltcGxlbWVudGVkIGJ1dCBJIGhhdmUgb25seVxuICAgIC8vIGRvbmUgZW5vdWdoIHN1Y2ggdGhhdCBhZGQgYW5kIG11bCBjYW4gaGFuZGxlIG5lZ2F0aXZlaW5maW5pdHkgYXMgYW4gYXJndW1lbnRcbiAgICBfX2FkZF9fKG90aGVyOiBhbnkpIHtcbiAgICAgICAgaWYgKG90aGVyIGluc3RhbmNlb2YgX051bWJlcl8gJiYgZ2xvYmFsX3BhcmFtZXRlcnMuZXZhbHVhdGUpIHtcbiAgICAgICAgICAgIGlmIChvdGhlciA9PT0gUy5OZWdhdGl2ZUluZmluaXR5IHx8IG90aGVyID09PSBTLk5hTikge1xuICAgICAgICAgICAgICAgIHJldHVybiBTLk5hTjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBzdXBlci5fX2FkZF9fKG90aGVyKTtcbiAgICB9XG5cbiAgICBfX211bF9fKG90aGVyOiBhbnkpIHtcbiAgICAgICAgaWYgKG90aGVyIGluc3RhbmNlb2YgX051bWJlcl8gJiYgZ2xvYmFsX3BhcmFtZXRlcnMuZXZhbHVhdGUpIHtcbiAgICAgICAgICAgIGlmIChvdGhlciA9PT0gUy5aZXJvIHx8IG90aGVyID09PSBTLk5hTikge1xuICAgICAgICAgICAgICAgIHJldHVybiBTLk5hTjtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAob3RoZXIuaXNfZXh0ZW5kZWRfcG9zaXRpdmUoKSkge1xuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIFMuSW5maW5pdHk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHN1cGVyLl9fbXVsX18ob3RoZXIpO1xuICAgIH1cblxuICAgIHRvU3RyaW5nKCkge1xuICAgICAgICByZXR1cm4gXCJOZWdJbmZpbml0eVwiO1xuICAgIH1cbn1cblxuLy8gUmVnaXN0ZXJpbmcgc2luZ2xldG9ucyAoc2VlIHNpbmdsZXRvbiBjbGFzcylcblNpbmdsZXRvbi5yZWdpc3RlcihcIlplcm9cIiwgWmVybyk7XG5TLlplcm8gPSBTaW5nbGV0b24ucmVnaXN0cnlbXCJaZXJvXCJdO1xuXG5TaW5nbGV0b24ucmVnaXN0ZXIoXCJPbmVcIiwgT25lKTtcblMuT25lID0gU2luZ2xldG9uLnJlZ2lzdHJ5W1wiT25lXCJdO1xuXG5TaW5nbGV0b24ucmVnaXN0ZXIoXCJOZWdhdGl2ZU9uZVwiLCBOZWdhdGl2ZU9uZSk7XG5TLk5lZ2F0aXZlT25lID0gU2luZ2xldG9uLnJlZ2lzdHJ5W1wiTmVnYXRpdmVPbmVcIl07XG5cblNpbmdsZXRvbi5yZWdpc3RlcihcIk5hTlwiLCBOYU4pO1xuUy5OYU4gPSBTaW5nbGV0b24ucmVnaXN0cnlbXCJOYU5cIl07XG5cblNpbmdsZXRvbi5yZWdpc3RlcihcIkNvbXBsZXhJbmZpbml0eVwiLCBDb21wbGV4SW5maW5pdHkpO1xuUy5Db21wbGV4SW5maW5pdHkgPSBTaW5nbGV0b24ucmVnaXN0cnlbXCJDb21wbGV4SW5maW5pdHlcIl07XG5cblNpbmdsZXRvbi5yZWdpc3RlcihcIkluZmluaXR5XCIsIEluZmluaXR5KTtcblMuSW5maW5pdHkgPSBTaW5nbGV0b24ucmVnaXN0cnlbXCJJbmZpbml0eVwiXTtcblxuU2luZ2xldG9uLnJlZ2lzdGVyKFwiTmVnYXRpdmVJbmZpbml0eVwiLCBOZWdhdGl2ZUluZmluaXR5KTtcblMuTmVnYXRpdmVJbmZpbml0eSA9IFNpbmdsZXRvbi5yZWdpc3RyeVtcIk5lZ2F0aXZlSW5maW5pdHlcIl07XG5cbmV4cG9ydCB7UmF0aW9uYWwsIF9OdW1iZXJfLCBGbG9hdCwgSW50ZWdlciwgWmVybywgT25lfTtcbiIsICIvKlxuSW50ZWdlciBhbmQgcmF0aW9uYWwgZmFjdG9yaXphdGlvblxuXG5Ob3RhYmxlIGNoYW5nZXMgbWFkZVxuLSBBIGZldyBmdW5jdGlvbnMgaW4gLmdlbmVyYXRvciBhbmQgLmV2YWxmIGhhdmUgYmVlbiBtb3ZlZCBoZXJlIGZvciBzaW1wbGljaXR5XG4tIE5vdGU6IG1vc3QgcGFyYW1ldGVycyBmb3IgZmFjdG9yaW50IGFuZCBmYWN0b3JyYXQgaGF2ZSBub3QgYmVlbiBpbXBsZW1lbnRlZFxuLSBTZWUgbm90ZXMgd2l0aGluIHBlcmZlY3RfcG93ZXIgZm9yIHNwZWNpZmljIGNoYW5nZXNcbi0gQWxsIGZhY3RvciBmdW5jdGlvbnMgcmV0dXJuIGhhc2hkaWN0aW9uYXJpZXNcbi0gQWR2YW5jZWQgZmFjdG9yaW5nIGFsZ29yaXRobXMgZm9yIGZhY3RvcmludCBhcmUgbm90IHlldCBpbXBsZW1lbnRlZFxuKi9cblxuaW1wb3J0IHtSYXRpb25hbCwgaW50X250aHJvb3QsIEludGVnZXJ9IGZyb20gXCIuLi9jb3JlL251bWJlcnNcIjtcbmltcG9ydCB7U30gZnJvbSBcIi4uL2NvcmUvc2luZ2xldG9uXCI7XG5pbXBvcnQge0hhc2hEaWN0LCBVdGlsfSBmcm9tIFwiLi4vY29yZS91dGlsaXR5XCI7XG5pbXBvcnQge2FzX2ludH0gZnJvbSBcIi4uL3V0aWxpdGllcy9taXNjXCI7XG5cbmNvbnN0IHNtYWxsX3RyYWlsaW5nID0gbmV3IEFycmF5KDI1NikuZmlsbCgwKTtcbmZvciAobGV0IGogPSAxOyBqIDwgODsgaisrKSB7XG4gICAgVXRpbC5hc3NpZ25FbGVtZW50cyhzbWFsbF90cmFpbGluZywgbmV3IEFycmF5KCgxPDwoNy1qKSkpLmZpbGwoaiksIDE8PGosIDE8PChqKzEpKTtcbn1cblxuZnVuY3Rpb24gYml0Y291bnQobjogbnVtYmVyKSB7XG4gICAgLy8gUmV0dXJuIHNtYWxsZXN0IGludGVnZXIsIGIsIHN1Y2ggdGhhdCB8bnwvMioqYiA8IDFcbiAgICBsZXQgYml0cyA9IDA7XG4gICAgd2hpbGUgKG4gIT09IDApIHtcbiAgICAgICAgYml0cyArPSBiaXRDb3VudDMyKG4gfCAwKTtcbiAgICAgICAgbiAvPSAweDEwMDAwMDAwMDtcbiAgICB9XG4gICAgcmV0dXJuIGJpdHM7XG59XG5cbi8vIHNtYWxsIGJpdGNvdW50IHVzZWQgdG8gZmFjaWxpYXRlIGxhcmdlciBvbmVcbmZ1bmN0aW9uIGJpdENvdW50MzIobjogbnVtYmVyKSB7XG4gICAgbiA9IG4gLSAoKG4gPj4gMSkgJiAweDU1NTU1NTU1KTtcbiAgICBuID0gKG4gJiAweDMzMzMzMzMzKSArICgobiA+PiAyKSAmIDB4MzMzMzMzMzMpO1xuICAgIHJldHVybiAoKG4gKyAobiA+PiA0KSAmIDB4RjBGMEYwRikgKiAweDEwMTAxMDEpID4+IDI0O1xufVxuXG5mdW5jdGlvbiB0cmFpbGluZyhuOiBudW1iZXIpIHtcbiAgICAvKlxuICAgIENvdW50IHRoZSBudW1iZXIgb2YgdHJhaWxpbmcgemVybyBkaWdpdHMgaW4gdGhlIGJpbmFyeVxuICAgIHJlcHJlc2VudGF0aW9uIG9mIG4sIGkuZS4gZGV0ZXJtaW5lIHRoZSBsYXJnZXN0IHBvd2VyIG9mIDJcbiAgICB0aGF0IGRpdmlkZXMgbi5cbiAgICBFeGFtcGxlc1xuICAgID09PT09PT09XG4gICAgPj4+IGZyb20gc3ltcHkgaW1wb3J0IHRyYWlsaW5nXG4gICAgPj4+IHRyYWlsaW5nKDEyOClcbiAgICA3XG4gICAgPj4+IHRyYWlsaW5nKDYzKVxuICAgIDBcbiAgICAqL1xuICAgIG4gPSBNYXRoLmZsb29yKE1hdGguYWJzKG4pKTtcbiAgICBjb25zdCBsb3dfYnl0ZSA9IG4gJiAweGZmO1xuICAgIGlmIChsb3dfYnl0ZSkge1xuICAgICAgICByZXR1cm4gc21hbGxfdHJhaWxpbmdbbG93X2J5dGVdO1xuICAgIH1cbiAgICBjb25zdCB6ID0gYml0Y291bnQobikgLSAxO1xuICAgIGlmIChOdW1iZXIuaXNJbnRlZ2VyKHopKSB7XG4gICAgICAgIGlmIChuID09PSAxIDw8IHopIHtcbiAgICAgICAgICAgIHJldHVybiB6O1xuICAgICAgICB9XG4gICAgfVxuICAgIGlmICh6IDwgMzAwKSB7XG4gICAgICAgIGxldCB0ID0gODtcbiAgICAgICAgbiA+Pj0gODtcbiAgICAgICAgd2hpbGUgKCEobiAmIDB4ZmYpKSB7XG4gICAgICAgICAgICBuID4+PSA4O1xuICAgICAgICAgICAgdCArPSA4O1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0ICsgc21hbGxfdHJhaWxpbmdbbiAmIDB4ZmZdO1xuICAgIH1cbiAgICBsZXQgdCA9IDA7XG4gICAgbGV0IHAgPSA4O1xuICAgIHdoaWxlICghKG4gJiAxKSkge1xuICAgICAgICB3aGlsZSAoIShuICYgKCgxIDw8IHApIC0gMSkpKSB7XG4gICAgICAgICAgICBuID4+PSBwO1xuICAgICAgICAgICAgdCArPSBwO1xuICAgICAgICAgICAgcCAqPSAyO1xuICAgICAgICB9XG4gICAgICAgIHAgPSBNYXRoLmZsb29yKHAvMik7XG4gICAgfVxuICAgIHJldHVybiB0O1xufVxuXG4vLyBub3RlOiB0aGlzIGlzIGRpZmZlcmVudCB0aGFuIHRoZSBvcmlnaW5hbCBzeW1weSB2ZXJzaW9uIC0gaW1wbGVtZW50IGxhdGVyXG5mdW5jdGlvbiBpc3ByaW1lKG51bTogbnVtYmVyKSB7XG4gICAgZm9yIChsZXQgaSA9IDIsIHMgPSBNYXRoLnNxcnQobnVtKTsgaSA8PSBzOyBpKyspIHtcbiAgICAgICAgaWYgKG51bSAlIGkgPT09IDApIHtcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gKG51bSA+IDEpO1xufVxuXG5mdW5jdGlvbiogcHJpbWVyYW5nZShhOiBudW1iZXIsIGI6IG51bWJlciA9IHVuZGVmaW5lZCkge1xuICAgIC8qXG4gICAgR2VuZXJhdGUgYWxsIHByaW1lIG51bWJlcnMgaW4gdGhlIHJhbmdlIFsyLCBhKSBvciBbYSwgYikuXG4gICAgRXhhbXBsZXNcbiAgICA9PT09PT09PVxuICAgID4+PiBmcm9tIHN5bXB5IGltcG9ydCBzaWV2ZSwgcHJpbWVcbiAgICBBbGwgcHJpbWVzIGxlc3MgdGhhbiAxOTpcbiAgICA+Pj4gcHJpbnQoW2kgZm9yIGkgaW4gc2lldmUucHJpbWVyYW5nZSgxOSldKVxuICAgIFsyLCAzLCA1LCA3LCAxMSwgMTMsIDE3XVxuICAgIEFsbCBwcmltZXMgZ3JlYXRlciB0aGFuIG9yIGVxdWFsIHRvIDcgYW5kIGxlc3MgdGhhbiAxOTpcbiAgICA+Pj4gcHJpbnQoW2kgZm9yIGkgaW4gc2lldmUucHJpbWVyYW5nZSg3LCAxOSldKVxuICAgIFs3LCAxMSwgMTMsIDE3XVxuICAgIEFsbCBwcmltZXMgdGhyb3VnaCB0aGUgMTB0aCBwcmltZVxuICAgID4+PiBsaXN0KHNpZXZlLnByaW1lcmFuZ2UocHJpbWUoMTApICsgMSkpXG4gICAgWzIsIDMsIDUsIDcsIDExLCAxMywgMTcsIDE5LCAyMywgMjldXG4gICAgKi9cbiAgICBpZiAodHlwZW9mIGIgPT09IFwidW5kZWZpbmVkXCIpIHtcbiAgICAgICAgW2EsIGJdID0gWzIsIGFdO1xuICAgIH1cbiAgICBpZiAoYSA+PSBiKSB7XG4gICAgICAgIHJldHVybjtcbiAgICB9XG4gICAgYSA9IE1hdGguY2VpbChhKSAtIDE7XG4gICAgYiA9IE1hdGguZmxvb3IoYik7XG5cbiAgICB3aGlsZSAoMSkge1xuICAgICAgICBhID0gbmV4dHByaW1lKGEpO1xuICAgICAgICBpZiAoYSA8IGIpIHtcbiAgICAgICAgICAgIHlpZWxkIGE7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICB9XG59XG5cbmZ1bmN0aW9uIG5leHRwcmltZShuOiBudW1iZXIsIGl0aDogbnVtYmVyID0gMSkge1xuICAgIC8qXG4gICAgUmV0dXJuIHRoZSBpdGggcHJpbWUgZ3JlYXRlciB0aGFuIG4uXG4gICAgaSBtdXN0IGJlIGFuIGludGVnZXIuXG4gICAgTm90ZXNcbiAgICA9PT09PVxuICAgIFBvdGVudGlhbCBwcmltZXMgYXJlIGxvY2F0ZWQgYXQgNipqICsvLSAxLiBUaGlzXG4gICAgcHJvcGVydHkgaXMgdXNlZCBkdXJpbmcgc2VhcmNoaW5nLlxuICAgID4+PiBmcm9tIHN5bXB5IGltcG9ydCBuZXh0cHJpbWVcbiAgICA+Pj4gWyhpLCBuZXh0cHJpbWUoaSkpIGZvciBpIGluIHJhbmdlKDEwLCAxNSldXG4gICAgWygxMCwgMTEpLCAoMTEsIDEzKSwgKDEyLCAxMyksICgxMywgMTcpLCAoMTQsIDE3KV1cbiAgICA+Pj4gbmV4dHByaW1lKDIsIGl0aD0yKSAjIHRoZSAybmQgcHJpbWUgYWZ0ZXIgMlxuICAgIDVcbiAgICBTZWUgQWxzb1xuICAgID09PT09PT09XG4gICAgcHJldnByaW1lIDogUmV0dXJuIHRoZSBsYXJnZXN0IHByaW1lIHNtYWxsZXIgdGhhbiBuXG4gICAgcHJpbWVyYW5nZSA6IEdlbmVyYXRlIGFsbCBwcmltZXMgaW4gYSBnaXZlbiByYW5nZVxuICAgICovXG4gICAgbiA9IE1hdGguZmxvb3Iobik7XG4gICAgY29uc3QgaSA9IGFzX2ludChpdGgpO1xuICAgIGlmIChpID4gMSkge1xuICAgICAgICBsZXQgcHIgPSBuO1xuICAgICAgICBsZXQgaiA9IDE7XG4gICAgICAgIHdoaWxlICgxKSB7XG4gICAgICAgICAgICBwciA9IG5leHRwcmltZShwcik7XG4gICAgICAgICAgICBqKys7XG4gICAgICAgICAgICBpZiAoaiA+IDEpIHtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gcHI7XG4gICAgfVxuICAgIGlmIChuIDwgMikge1xuICAgICAgICByZXR1cm4gMjtcbiAgICB9XG4gICAgaWYgKG4gPCA3KSB7XG4gICAgICAgIHJldHVybiB7MjogMywgMzogNSwgNDogNSwgNTogNywgNjogN31bbl07XG4gICAgfVxuICAgIGNvbnN0IG5uID0gNiAqIE1hdGguZmxvb3Iobi82KTtcbiAgICBpZiAobm4gPT09IG4pIHtcbiAgICAgICAgbisrO1xuICAgICAgICBpZiAoaXNwcmltZShuKSkge1xuICAgICAgICAgICAgcmV0dXJuIG47XG4gICAgICAgIH1cbiAgICAgICAgbiArPSA0O1xuICAgIH0gZWxzZSBpZiAobiAtIG5uID09PSA1KSB7XG4gICAgICAgIG4gKz0gMjtcbiAgICAgICAgaWYgKGlzcHJpbWUobikpIHtcbiAgICAgICAgICAgIHJldHVybiBuO1xuICAgICAgICB9XG4gICAgICAgIG4gKz0gNDtcbiAgICB9IGVsc2Uge1xuICAgICAgICBuID0gbm4gKyA1O1xuICAgIH1cbiAgICB3aGlsZSAoMSkge1xuICAgICAgICBpZiAoaXNwcmltZShuKSkge1xuICAgICAgICAgICAgcmV0dXJuIG47XG4gICAgICAgIH1cbiAgICAgICAgbiArPSAyO1xuICAgICAgICBpZiAoaXNwcmltZShuKSkge1xuICAgICAgICAgICAgcmV0dXJuIG47XG4gICAgICAgIH1cbiAgICAgICAgbiArPSA0O1xuICAgIH1cbn1cblxuZXhwb3J0IGNvbnN0IGRpdm1vZCA9IChhOiBudW1iZXIsIGI6IG51bWJlcikgPT4gW01hdGguZmxvb3IoYS9iKSwgYSViXTtcblxuZnVuY3Rpb24gbXVsdGlwbGljaXR5KHA6IGFueSwgbjogYW55KTogYW55IHtcbiAgICAvKlxuICAgIEZpbmQgdGhlIGdyZWF0ZXN0IGludGVnZXIgbSBzdWNoIHRoYXQgcCoqbSBkaXZpZGVzIG4uXG4gICAgRXhhbXBsZXNcbiAgICA9PT09PT09PVxuICAgID4+PiBmcm9tIHN5bXB5IGltcG9ydCBtdWx0aXBsaWNpdHksIFJhdGlvbmFsXG4gICAgPj4+IFttdWx0aXBsaWNpdHkoNSwgbikgZm9yIG4gaW4gWzgsIDUsIDI1LCAxMjUsIDI1MF1dXG4gICAgWzAsIDEsIDIsIDMsIDNdXG4gICAgPj4+IG11bHRpcGxpY2l0eSgzLCBSYXRpb25hbCgxLCA5KSlcbiAgICAtMlxuICAgIE5vdGU6IHdoZW4gY2hlY2tpbmcgZm9yIHRoZSBtdWx0aXBsaWNpdHkgb2YgYSBudW1iZXIgaW4gYVxuICAgIGxhcmdlIGZhY3RvcmlhbCBpdCBpcyBtb3N0IGVmZmljaWVudCB0byBzZW5kIGl0IGFzIGFuIHVuZXZhbHVhdGVkXG4gICAgZmFjdG9yaWFsIG9yIHRvIGNhbGwgYGBtdWx0aXBsaWNpdHlfaW5fZmFjdG9yaWFsYGAgZGlyZWN0bHk6XG4gICAgPj4+IGZyb20gc3ltcHkubnRoZW9yeSBpbXBvcnQgbXVsdGlwbGljaXR5X2luX2ZhY3RvcmlhbFxuICAgID4+PiBmcm9tIHN5bXB5IGltcG9ydCBmYWN0b3JpYWxcbiAgICA+Pj4gcCA9IGZhY3RvcmlhbCgyNSlcbiAgICA+Pj4gbiA9IDIqKjEwMFxuICAgID4+PiBuZmFjID0gZmFjdG9yaWFsKG4sIGV2YWx1YXRlPUZhbHNlKVxuICAgID4+PiBtdWx0aXBsaWNpdHkocCwgbmZhYylcbiAgICA1MjgxODc3NTAwOTUwOTU1ODM5NTY5NTk2Njg4N1xuICAgID4+PiBfID09IG11bHRpcGxpY2l0eV9pbl9mYWN0b3JpYWwocCwgbilcbiAgICBUcnVlXG4gICAgKi9cbiAgICB0cnkge1xuICAgICAgICBbcCwgbl0gPSBbYXNfaW50KHApLCBhc19pbnQobildO1xuICAgIH0gY2F0Y2ggKEVycm9yKSB7XG4gICAgICAgIGlmIChOdW1iZXIuaXNJbnRlZ2VyKHApIHx8IHAgaW5zdGFuY2VvZiBSYXRpb25hbCAmJiBOdW1iZXIuaXNJbnRlZ2VyKG4pIHx8IG4gaW5zdGFuY2VvZiBSYXRpb25hbCkge1xuICAgICAgICAgICAgcCA9IG5ldyBSYXRpb25hbChwKTtcbiAgICAgICAgICAgIG4gPSBuZXcgUmF0aW9uYWwobik7XG4gICAgICAgICAgICBpZiAocC5xID09PSAxKSB7XG4gICAgICAgICAgICAgICAgaWYgKG4ucCA9PT0gMSkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gLW11bHRpcGxpY2l0eShwLnAsIG4ucSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHJldHVybiBtdWx0aXBsaWNpdHkocC5wLCBuLnApIC0gbXVsdGlwbGljaXR5KHAucCwgbi5xKTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAocC5wID09PSAxKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIG11bHRpcGxpY2l0eShwLnEsIG4ucSk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGNvbnN0IGxpa2UgPSBNYXRoLm1pbihtdWx0aXBsaWNpdHkocC5wLCBuLnApLCBtdWx0aXBsaWNpdHkocC5xLCBuLnEpKTtcbiAgICAgICAgICAgICAgICBjb25zdCBjcm9zcyA9IE1hdGgubWluKG11bHRpcGxpY2l0eShwLnEsIG4ucCksIG11bHRpcGxpY2l0eShwLnAsIG4ucSkpO1xuICAgICAgICAgICAgICAgIHJldHVybiBsaWtlIC0gY3Jvc3M7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG4gICAgaWYgKG4gPT09IDApIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwibm8gaW50IGV4aXN0c1wiKTtcbiAgICB9XG4gICAgaWYgKHAgPT09IDIpIHtcbiAgICAgICAgcmV0dXJuIHRyYWlsaW5nKG4pO1xuICAgIH1cbiAgICBpZiAocCA8IDIpIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwicCBtdXN0IGJlIGludFwiKTtcbiAgICB9XG4gICAgaWYgKHAgPT09IG4pIHtcbiAgICAgICAgcmV0dXJuIDE7XG4gICAgfVxuXG4gICAgbGV0IG0gPSAwO1xuICAgIG4gPSBNYXRoLmZsb29yKG4vcCk7XG4gICAgbGV0IHJlbSA9IG4gJSBwO1xuICAgIHdoaWxlICghcmVtKSB7XG4gICAgICAgIG0rKztcbiAgICAgICAgaWYgKG0gPiA1KSB7XG4gICAgICAgICAgICBsZXQgZSA9IDI7XG4gICAgICAgICAgICB3aGlsZSAoMSkge1xuICAgICAgICAgICAgICAgIGNvbnN0IHBwb3cgPSBwKiplO1xuICAgICAgICAgICAgICAgIGlmIChwcG93IDwgbikge1xuICAgICAgICAgICAgICAgICAgICBjb25zdCBubmV3ID0gTWF0aC5mbG9vcihuL3Bwb3cpO1xuICAgICAgICAgICAgICAgICAgICByZW0gPSBuICUgcHBvdztcbiAgICAgICAgICAgICAgICAgICAgaWYgKCEocmVtKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgbSArPSBlO1xuICAgICAgICAgICAgICAgICAgICAgICAgZSAqPSAyO1xuICAgICAgICAgICAgICAgICAgICAgICAgbiA9IG5uZXc7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICByZXR1cm4gbSArIG11bHRpcGxpY2l0eShwLCBuKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBbbiwgcmVtXSA9IGRpdm1vZChuLCBwKTtcbiAgICB9XG4gICAgcmV0dXJuIG07XG59XG5cbmZ1bmN0aW9uIGRpdmlzb3JzKG46IG51bWJlciwgZ2VuZXJhdG9yOiBib29sZWFuID0gZmFsc2UsIHByb3BlcjogYm9vbGVhbiA9IGZhbHNlKSB7XG4gICAgLypcbiAgICBSZXR1cm4gYWxsIGRpdmlzb3JzIG9mIG4gc29ydGVkIGZyb20gMS4ubiBieSBkZWZhdWx0LlxuICAgIElmIGdlbmVyYXRvciBpcyBgYFRydWVgYCBhbiB1bm9yZGVyZWQgZ2VuZXJhdG9yIGlzIHJldHVybmVkLlxuICAgIFRoZSBudW1iZXIgb2YgZGl2aXNvcnMgb2YgbiBjYW4gYmUgcXVpdGUgbGFyZ2UgaWYgdGhlcmUgYXJlIG1hbnlcbiAgICBwcmltZSBmYWN0b3JzIChjb3VudGluZyByZXBlYXRlZCBmYWN0b3JzKS4gSWYgb25seSB0aGUgbnVtYmVyIG9mXG4gICAgZmFjdG9ycyBpcyBkZXNpcmVkIHVzZSBkaXZpc29yX2NvdW50KG4pLlxuICAgIEV4YW1wbGVzXG4gICAgPT09PT09PT1cbiAgICA+Pj4gZnJvbSBzeW1weSBpbXBvcnQgZGl2aXNvcnMsIGRpdmlzb3JfY291bnRcbiAgICA+Pj4gZGl2aXNvcnMoMjQpXG4gICAgWzEsIDIsIDMsIDQsIDYsIDgsIDEyLCAyNF1cbiAgICA+Pj4gZGl2aXNvcl9jb3VudCgyNClcbiAgICA4XG4gICAgPj4+IGxpc3QoZGl2aXNvcnMoMTIwLCBnZW5lcmF0b3I9VHJ1ZSkpXG4gICAgWzEsIDIsIDQsIDgsIDMsIDYsIDEyLCAyNCwgNSwgMTAsIDIwLCA0MCwgMTUsIDMwLCA2MCwgMTIwXVxuICAgIE5vdGVzXG4gICAgPT09PT1cbiAgICBUaGlzIGlzIGEgc2xpZ2h0bHkgbW9kaWZpZWQgdmVyc2lvbiBvZiBUaW0gUGV0ZXJzIHJlZmVyZW5jZWQgYXQ6XG4gICAgaHR0cHM6Ly9zdGFja292ZXJmbG93LmNvbS9xdWVzdGlvbnMvMTAxMDM4MS9weXRob24tZmFjdG9yaXphdGlvblxuICAgIFNlZSBBbHNvXG4gICAgPT09PT09PT1cbiAgICBwcmltZWZhY3RvcnMsIGZhY3RvcmludCwgZGl2aXNvcl9jb3VudFxuICAgICovXG4gICAgbiA9IGFzX2ludChNYXRoLmFicyhuKSk7XG4gICAgaWYgKGlzcHJpbWUobikpIHtcbiAgICAgICAgaWYgKHByb3Blcikge1xuICAgICAgICAgICAgcmV0dXJuIFsxXTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gWzEsIG5dO1xuICAgIH1cbiAgICBpZiAobiA9PT0gMSkge1xuICAgICAgICBpZiAocHJvcGVyKSB7XG4gICAgICAgICAgICByZXR1cm4gW107XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIFsxXTtcbiAgICB9XG4gICAgaWYgKG4gPT09IDApIHtcbiAgICAgICAgcmV0dXJuIFtdO1xuICAgIH1cbiAgICBjb25zdCBydiA9IF9kaXZpc29ycyhuLCBwcm9wZXIpO1xuICAgIGlmICghZ2VuZXJhdG9yKSB7XG4gICAgICAgIGNvbnN0IHRlbXAgPSBbXTtcbiAgICAgICAgZm9yIChjb25zdCBpIG9mIHJ2KSB7XG4gICAgICAgICAgICB0ZW1wLnB1c2goaSk7XG4gICAgICAgIH1cbiAgICAgICAgdGVtcC5zb3J0KCk7XG4gICAgICAgIHJldHVybiB0ZW1wO1xuICAgIH1cbiAgICByZXR1cm4gcnY7XG59XG5cbmZ1bmN0aW9uKiBfZGl2aXNvcnMobjogbnVtYmVyLCBnZW5lcmF0b3I6IGJvb2xlYW4gPSBmYWxzZSwgcHJvcGVyOiBib29sZWFuID0gZmFsc2UpIHtcbiAgICAvLyBIZWxwZXIgZnVuY3Rpb24gZm9yIGRpdmlzb3JzIHdoaWNoIGdlbmVyYXRlcyB0aGUgZGl2aXNvcnMuXG4gICAgY29uc3QgZmFjdG9yZGljdCA9IGZhY3RvcmludChuKTtcbiAgICBjb25zdCBwcyA9IGZhY3RvcmRpY3Qua2V5cygpLnNvcnQoKTtcblxuICAgIGZ1bmN0aW9uKiByZWNfZ2VuKG46IG51bWJlciA9IDApOiBhbnkge1xuICAgICAgICBpZiAobiA9PT0gcHMubGVuZ3RoKSB7XG4gICAgICAgICAgICB5aWVsZCAxO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgY29uc3QgcG93cyA9IFsxXTtcbiAgICAgICAgICAgIGZvciAobGV0IGogPSAwOyBqIDwgZmFjdG9yZGljdC5nZXQocHNbbl0pOyBqKyspIHtcbiAgICAgICAgICAgICAgICBwb3dzLnB1c2gocG93c1twb3dzLmxlbmd0aCAtIDFdICogcHNbbl0pO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZm9yIChjb25zdCBxIG9mIHJlY19nZW4obiArIDEpKSB7XG4gICAgICAgICAgICAgICAgZm9yIChjb25zdCBwIG9mIHBvd3MpIHtcbiAgICAgICAgICAgICAgICAgICAgeWllbGQgcCAqIHE7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuICAgIGlmIChwcm9wZXIpIHtcbiAgICAgICAgZm9yIChjb25zdCBwIG9mIHJlY19nZW4oKSkge1xuICAgICAgICAgICAgaWYgKHAgIT0gbikge1xuICAgICAgICAgICAgICAgIHlpZWxkIHA7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgICBmb3IgKGNvbnN0IHAgb2YgcmVjX2dlbigpKSB7XG4gICAgICAgICAgICB5aWVsZCBwO1xuICAgICAgICB9XG4gICAgfVxufVxuXG5cbmZ1bmN0aW9uIF9jaGVja190ZXJtaW5hdGlvbihmYWN0b3JzOiBhbnksIG46IG51bWJlciwgbGltaXRwMTogYW55KSB7XG4gICAgLypcbiAgICBIZWxwZXIgZnVuY3Rpb24gZm9yIGludGVnZXIgZmFjdG9yaXphdGlvbi4gQ2hlY2tzIGlmIGBgbmBgXG4gICAgaXMgYSBwcmltZSBvciBhIHBlcmZlY3QgcG93ZXIsIGFuZCBpbiB0aG9zZSBjYXNlcyB1cGRhdGVzXG4gICAgdGhlIGZhY3Rvcml6YXRpb24gYW5kIHJhaXNlcyBgYFN0b3BJdGVyYXRpb25gYC5cbiAgICAqL1xuICAgIGNvbnN0IHAgPSBwZXJmZWN0X3Bvd2VyKG4sIHVuZGVmaW5lZCwgdHJ1ZSwgZmFsc2UpO1xuICAgIGlmIChwICE9PSBmYWxzZSkge1xuICAgICAgICBjb25zdCBbYmFzZSwgZXhwXSA9IHA7XG4gICAgICAgIGxldCBsaW1pdDtcbiAgICAgICAgaWYgKGxpbWl0cDEpIHtcbiAgICAgICAgICAgIGxpbWl0ID0gbGltaXRwMSA9IDE7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBsaW1pdCA9IGxpbWl0cDE7XG4gICAgICAgIH1cbiAgICAgICAgY29uc3QgZmFjcyA9IGZhY3RvcmludChiYXNlLCBsaW1pdCk7XG4gICAgICAgIGZvciAoY29uc3QgW2IsIGVdIG9mIGZhY3MuZW50cmllcygpKSB7XG4gICAgICAgICAgICBmYWN0b3JzW2JdID0gZXhwKmU7XG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoKTtcbiAgICAgICAgfVxuICAgIH1cbiAgICBpZiAoaXNwcmltZShuKSkge1xuICAgICAgICBmYWN0b3JzLmFkZChuLCAxKTtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKCk7XG4gICAgfVxuICAgIGlmIChuID09PSAxKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcigpO1xuICAgIH1cbn1cblxuZnVuY3Rpb24gX3RyaWFsKGZhY3RvcnM6IGFueSwgbjogbnVtYmVyLCBjYW5kaWRhdGVzOiBhbnkpIHtcbiAgICAvKlxuICAgIEhlbHBlciBmdW5jdGlvbiBmb3IgaW50ZWdlciBmYWN0b3JpemF0aW9uLiBUcmlhbCBmYWN0b3JzIGBgbmBcbiAgICBhZ2FpbnN0IGFsbCBpbnRlZ2VycyBnaXZlbiBpbiB0aGUgc2VxdWVuY2UgYGBjYW5kaWRhdGVzYGBcbiAgICBhbmQgdXBkYXRlcyB0aGUgZGljdCBgYGZhY3RvcnNgYCBpbi1wbGFjZS4gUmV0dXJucyB0aGUgcmVkdWNlZFxuICAgIHZhbHVlIG9mIGBgbmBgIGFuZCBhIGZsYWcgaW5kaWNhdGluZyB3aGV0aGVyIGFueSBmYWN0b3JzIHdlcmUgZm91bmQuXG4gICAgKi9cbiAgICBjb25zdCBuZmFjdG9ycyA9IGZhY3RvcnMubGVuZ3RoO1xuICAgIGZvciAoY29uc3QgZCBvZiBjYW5kaWRhdGVzKSB7XG4gICAgICAgIGlmIChuICUgZCA9PT0gMCkge1xuICAgICAgICAgICAgY29uc3QgbSA9IG11bHRpcGxpY2l0eShkLCBuKTtcbiAgICAgICAgICAgIG4gPSBNYXRoLmZsb29yKG4vKGQqKm0pKTtcbiAgICAgICAgICAgIGZhY3RvcnNbZF0gPSBtO1xuICAgICAgICB9XG4gICAgfVxuICAgIHJldHVybiBbbiwgZmFjdG9ycy5sZW5ndGggIT09IG5mYWN0b3JzXTtcbn1cblxuZnVuY3Rpb24gX2ZhY3RvcmludF9zbWFsbChmYWN0b3JzOiBIYXNoRGljdCwgbjogYW55LCBsaW1pdDogYW55LCBmYWlsX21heDogYW55KSB7XG4gICAgLypcbiAgICBSZXR1cm4gdGhlIHZhbHVlIG9mIG4gYW5kIGVpdGhlciBhIDAgKGluZGljYXRpbmcgdGhhdCBmYWN0b3JpemF0aW9uIHVwXG4gICAgdG8gdGhlIGxpbWl0IHdhcyBjb21wbGV0ZSkgb3IgZWxzZSB0aGUgbmV4dCBuZWFyLXByaW1lIHRoYXQgd291bGQgaGF2ZVxuICAgIGJlZW4gdGVzdGVkLlxuICAgIEZhY3RvcmluZyBzdG9wcyBpZiB0aGVyZSBhcmUgZmFpbF9tYXggdW5zdWNjZXNzZnVsIHRlc3RzIGluIGEgcm93LlxuICAgIElmIGZhY3RvcnMgb2YgbiB3ZXJlIGZvdW5kIHRoZXkgd2lsbCBiZSBpbiB0aGUgZmFjdG9ycyBkaWN0aW9uYXJ5IGFzXG4gICAge2ZhY3RvcjogbXVsdGlwbGljaXR5fSBhbmQgdGhlIHJldHVybmVkIHZhbHVlIG9mIG4gd2lsbCBoYXZlIGhhZCB0aG9zZVxuICAgIGZhY3RvcnMgcmVtb3ZlZC4gVGhlIGZhY3RvcnMgZGljdGlvbmFyeSBpcyBtb2RpZmllZCBpbi1wbGFjZS5cbiAgICAqL1xuICAgIGZ1bmN0aW9uIGRvbmUobjogbnVtYmVyLCBkOiBudW1iZXIpIHtcbiAgICAgICAgLypcbiAgICAgICAgcmV0dXJuIG4sIGQgaWYgdGhlIHNxcnQobikgd2FzIG5vdCByZWFjaGVkIHlldCwgZWxzZVxuICAgICAgICBuLCAwIGluZGljYXRpbmcgdGhhdCBmYWN0b3JpbmcgaXMgZG9uZS5cbiAgICAgICAgKi9cbiAgICAgICAgaWYgKGQqZCA8PSBuKSB7XG4gICAgICAgICAgICByZXR1cm4gW24sIGRdO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBbbiwgMF07XG4gICAgfVxuICAgIGxldCBkID0gMjtcbiAgICBsZXQgbSA9IHRyYWlsaW5nKG4pO1xuICAgIGlmIChtKSB7XG4gICAgICAgIGZhY3RvcnMuYWRkKGQsIG0pO1xuICAgICAgICBuID4+PSBtO1xuICAgIH1cbiAgICBkID0gMztcbiAgICBpZiAobGltaXQgPCBkKSB7XG4gICAgICAgIGlmIChuID4gMSkge1xuICAgICAgICAgICAgZmFjdG9ycy5hZGQobiwgMSk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGRvbmUobiwgZCk7XG4gICAgfVxuICAgIG0gPSAwO1xuICAgIHdoaWxlIChuICUgZCA9PT0gMCkge1xuICAgICAgICBuID0gTWF0aC5mbG9vcihuL2QpO1xuICAgICAgICBtKys7XG4gICAgICAgIGlmIChtID09PSAyMCkge1xuICAgICAgICAgICAgY29uc3QgbW0gPSBtdWx0aXBsaWNpdHkoZCwgbik7XG4gICAgICAgICAgICBtICs9IG1tO1xuICAgICAgICAgICAgbiA9IE1hdGguZmxvb3Iobi8oZCoqbW0pKTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG4gICAgfVxuICAgIGlmIChtKSB7XG4gICAgICAgIGZhY3RvcnMuYWRkKGQsIG0pO1xuICAgIH1cbiAgICBsZXQgbWF4eDtcbiAgICBpZiAobGltaXQgKiBsaW1pdCA+IG4pIHtcbiAgICAgICAgbWF4eCA9IDA7XG4gICAgfSBlbHNlIHtcbiAgICAgICAgbWF4eCA9IGxpbWl0KmxpbWl0O1xuICAgIH1cbiAgICBsZXQgZGQgPSBtYXh4IHx8IG47XG4gICAgZCA9IDU7XG4gICAgbGV0IGZhaWxzID0gMDtcbiAgICB3aGlsZSAoZmFpbHMgPCBmYWlsX21heCkge1xuICAgICAgICBpZiAoZCpkID4gZGQpIHtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG4gICAgICAgIG0gPSAwO1xuICAgICAgICB3aGlsZSAobiAlIGQgPT09IDApIHtcbiAgICAgICAgICAgIG4gPSBNYXRoLmZsb29yKG4vZCk7XG4gICAgICAgICAgICBtKys7XG4gICAgICAgICAgICBpZiAobSA9PT0gMjApIHtcbiAgICAgICAgICAgICAgICBjb25zdCBtbSA9IG11bHRpcGxpY2l0eShkLCBuKTtcbiAgICAgICAgICAgICAgICBtICs9IG1tO1xuICAgICAgICAgICAgICAgIG4gPSBNYXRoLmZsb29yKG4gLyAoZCoqbW0pKTtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBpZiAobSkge1xuICAgICAgICAgICAgZmFjdG9ycy5hZGQoZCwgbSk7XG4gICAgICAgICAgICBkZCA9IG1heHggfHwgbjtcbiAgICAgICAgICAgIGZhaWxzID0gMDtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGZhaWxzKys7XG4gICAgICAgIH1cbiAgICAgICAgZCArPSAyO1xuICAgICAgICBpZiAoZCpkPiBkZCkge1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cbiAgICAgICAgbSA9IDA7XG4gICAgICAgIHdoaWxlIChuICUgZCA9PT0gMCkge1xuICAgICAgICAgICAgbiA9IE1hdGguZmxvb3IobiAvIGQpO1xuICAgICAgICAgICAgbSsrO1xuICAgICAgICAgICAgaWYgKG0gPT09IDIwKSB7XG4gICAgICAgICAgICAgICAgY29uc3QgbW0gPSBtdWx0aXBsaWNpdHkoZCwgbik7XG4gICAgICAgICAgICAgICAgbSArPSBtbTtcbiAgICAgICAgICAgICAgICBuID0gTWF0aC5mbG9vcihuLyhkKiptbSkpO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGlmIChtKSB7XG4gICAgICAgICAgICBmYWN0b3JzLmFkZChkLCBtKTtcbiAgICAgICAgICAgIGRkID0gbWF4eCB8fCBuO1xuICAgICAgICAgICAgZmFpbHMgPSAwO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgZmFpbHMrKztcbiAgICAgICAgfVxuICAgICAgICBkICs9NDtcbiAgICB9XG4gICAgcmV0dXJuIGRvbmUobiwgZCk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBmYWN0b3JpbnQobjogYW55LCBsaW1pdDogYW55ID0gdW5kZWZpbmVkKTogSGFzaERpY3Qge1xuICAgIC8qXG4gICAgR2l2ZW4gYSBwb3NpdGl2ZSBpbnRlZ2VyIGBgbmBgLCBgYGZhY3RvcmludChuKWBgIHJldHVybnMgYSBkaWN0IGNvbnRhaW5pbmdcbiAgICB0aGUgcHJpbWUgZmFjdG9ycyBvZiBgYG5gYCBhcyBrZXlzIGFuZCB0aGVpciByZXNwZWN0aXZlIG11bHRpcGxpY2l0aWVzXG4gICAgYXMgdmFsdWVzLiBGb3IgZXhhbXBsZTpcbiAgICA+Pj4gZnJvbSBzeW1weS5udGhlb3J5IGltcG9ydCBmYWN0b3JpbnRcbiAgICA+Pj4gZmFjdG9yaW50KDIwMDApICAgICMgMjAwMCA9ICgyKio0KSAqICg1KiozKVxuICAgIHsyOiA0LCA1OiAzfVxuICAgID4+PiBmYWN0b3JpbnQoNjU1MzcpICAgIyBUaGlzIG51bWJlciBpcyBwcmltZVxuICAgIHs2NTUzNzogMX1cbiAgICBGb3IgaW5wdXQgbGVzcyB0aGFuIDIsIGZhY3RvcmludCBiZWhhdmVzIGFzIGZvbGxvd3M6XG4gICAgICAgIC0gYGBmYWN0b3JpbnQoMSlgYCByZXR1cm5zIHRoZSBlbXB0eSBmYWN0b3JpemF0aW9uLCBgYHt9YGBcbiAgICAgICAgLSBgYGZhY3RvcmludCgwKWBgIHJldHVybnMgYGB7MDoxfWBgXG4gICAgICAgIC0gYGBmYWN0b3JpbnQoLW4pYGAgYWRkcyBgYC0xOjFgYCB0byB0aGUgZmFjdG9ycyBhbmQgdGhlbiBmYWN0b3JzIGBgbmBgXG4gICAgUGFydGlhbCBGYWN0b3JpemF0aW9uOlxuICAgIElmIGBgbGltaXRgYCAoPiAzKSBpcyBzcGVjaWZpZWQsIHRoZSBzZWFyY2ggaXMgc3RvcHBlZCBhZnRlciBwZXJmb3JtaW5nXG4gICAgdHJpYWwgZGl2aXNpb24gdXAgdG8gKGFuZCBpbmNsdWRpbmcpIHRoZSBsaW1pdCAob3IgdGFraW5nIGFcbiAgICBjb3JyZXNwb25kaW5nIG51bWJlciBvZiByaG8vcC0xIHN0ZXBzKS4gVGhpcyBpcyB1c2VmdWwgaWYgb25lIGhhc1xuICAgIGEgbGFyZ2UgbnVtYmVyIGFuZCBvbmx5IGlzIGludGVyZXN0ZWQgaW4gZmluZGluZyBzbWFsbCBmYWN0b3JzIChpZlxuICAgIGFueSkuIE5vdGUgdGhhdCBzZXR0aW5nIGEgbGltaXQgZG9lcyBub3QgcHJldmVudCBsYXJnZXIgZmFjdG9yc1xuICAgIGZyb20gYmVpbmcgZm91bmQgZWFybHk7IGl0IHNpbXBseSBtZWFucyB0aGF0IHRoZSBsYXJnZXN0IGZhY3RvciBtYXlcbiAgICBiZSBjb21wb3NpdGUuIFNpbmNlIGNoZWNraW5nIGZvciBwZXJmZWN0IHBvd2VyIGlzIHJlbGF0aXZlbHkgY2hlYXAsIGl0IGlzXG4gICAgZG9uZSByZWdhcmRsZXNzIG9mIHRoZSBsaW1pdCBzZXR0aW5nLlxuICAgIFRoaXMgbnVtYmVyLCBmb3IgZXhhbXBsZSwgaGFzIHR3byBzbWFsbCBmYWN0b3JzIGFuZCBhIGh1Z2VcbiAgICBzZW1pLXByaW1lIGZhY3RvciB0aGF0IGNhbm5vdCBiZSByZWR1Y2VkIGVhc2lseTpcbiAgICA+Pj4gZnJvbSBzeW1weS5udGhlb3J5IGltcG9ydCBpc3ByaW1lXG4gICAgPj4+IGEgPSAxNDA3NjMzNzE3MjYyMzM4OTU3NDMwNjk3OTIxNDQ2ODgzXG4gICAgPj4+IGYgPSBmYWN0b3JpbnQoYSwgbGltaXQ9MTAwMDApXG4gICAgPj4+IGYgPT0gezk5MTogMSwgaW50KDIwMjkxNjc4MjA3NjE2MjQ1NjAyMjg3NzAyNDg1OSk6IDEsIDc6IDF9XG4gICAgVHJ1ZVxuICAgID4+PiBpc3ByaW1lKG1heChmKSlcbiAgICBGYWxzZVxuICAgIFRoaXMgbnVtYmVyIGhhcyBhIHNtYWxsIGZhY3RvciBhbmQgYSByZXNpZHVhbCBwZXJmZWN0IHBvd2VyIHdob3NlXG4gICAgYmFzZSBpcyBncmVhdGVyIHRoYW4gdGhlIGxpbWl0OlxuICAgID4+PiBmYWN0b3JpbnQoMyoxMDEqKjcsIGxpbWl0PTUpXG4gICAgezM6IDEsIDEwMTogN31cbiAgICBMaXN0IG9mIEZhY3RvcnM6XG4gICAgSWYgYGBtdWx0aXBsZWBgIGlzIHNldCB0byBgYFRydWVgYCB0aGVuIGEgbGlzdCBjb250YWluaW5nIHRoZVxuICAgIHByaW1lIGZhY3RvcnMgaW5jbHVkaW5nIG11bHRpcGxpY2l0aWVzIGlzIHJldHVybmVkLlxuICAgID4+PiBmYWN0b3JpbnQoMjQsIG11bHRpcGxlPVRydWUpXG4gICAgWzIsIDIsIDIsIDNdXG4gICAgVmlzdWFsIEZhY3Rvcml6YXRpb246XG4gICAgSWYgYGB2aXN1YWxgYCBpcyBzZXQgdG8gYGBUcnVlYGAsIHRoZW4gaXQgd2lsbCByZXR1cm4gYSB2aXN1YWxcbiAgICBmYWN0b3JpemF0aW9uIG9mIHRoZSBpbnRlZ2VyLiAgRm9yIGV4YW1wbGU6XG4gICAgPj4+IGZyb20gc3ltcHkgaW1wb3J0IHBwcmludFxuICAgID4+PiBwcHJpbnQoZmFjdG9yaW50KDQyMDAsIHZpc3VhbD1UcnVlKSlcbiAgICAgMyAgMSAgMiAgMVxuICAgIDIgKjMgKjUgKjdcbiAgICBOb3RlIHRoYXQgdGhpcyBpcyBhY2hpZXZlZCBieSB1c2luZyB0aGUgZXZhbHVhdGU9RmFsc2UgZmxhZyBpbiBNdWxcbiAgICBhbmQgUG93LiBJZiB5b3UgZG8gb3RoZXIgbWFuaXB1bGF0aW9ucyB3aXRoIGFuIGV4cHJlc3Npb24gd2hlcmVcbiAgICBldmFsdWF0ZT1GYWxzZSwgaXQgbWF5IGV2YWx1YXRlLiAgVGhlcmVmb3JlLCB5b3Ugc2hvdWxkIHVzZSB0aGVcbiAgICB2aXN1YWwgb3B0aW9uIG9ubHkgZm9yIHZpc3VhbGl6YXRpb24sIGFuZCB1c2UgdGhlIG5vcm1hbCBkaWN0aW9uYXJ5XG4gICAgcmV0dXJuZWQgYnkgdmlzdWFsPUZhbHNlIGlmIHlvdSB3YW50IHRvIHBlcmZvcm0gb3BlcmF0aW9ucyBvbiB0aGVcbiAgICBmYWN0b3JzLlxuICAgIFlvdSBjYW4gZWFzaWx5IHN3aXRjaCBiZXR3ZWVuIHRoZSB0d28gZm9ybXMgYnkgc2VuZGluZyB0aGVtIGJhY2sgdG9cbiAgICBmYWN0b3JpbnQ6XG4gICAgPj4+IGZyb20gc3ltcHkgaW1wb3J0IE11bFxuICAgID4+PiByZWd1bGFyID0gZmFjdG9yaW50KDE3NjQpOyByZWd1bGFyXG4gICAgezI6IDIsIDM6IDIsIDc6IDJ9XG4gICAgPj4+IHBwcmludChmYWN0b3JpbnQocmVndWxhcikpXG4gICAgIDIgIDIgIDJcbiAgICAyICozICo3XG4gICAgPj4+IHZpc3VhbCA9IGZhY3RvcmludCgxNzY0LCB2aXN1YWw9VHJ1ZSk7IHBwcmludCh2aXN1YWwpXG4gICAgIDIgIDIgIDJcbiAgICAyICozICo3XG4gICAgPj4+IHByaW50KGZhY3RvcmludCh2aXN1YWwpKVxuICAgIHsyOiAyLCAzOiAyLCA3OiAyfVxuICAgIElmIHlvdSB3YW50IHRvIHNlbmQgYSBudW1iZXIgdG8gYmUgZmFjdG9yZWQgaW4gYSBwYXJ0aWFsbHkgZmFjdG9yZWQgZm9ybVxuICAgIHlvdSBjYW4gZG8gc28gd2l0aCBhIGRpY3Rpb25hcnkgb3IgdW5ldmFsdWF0ZWQgZXhwcmVzc2lvbjpcbiAgICA+Pj4gZmFjdG9yaW50KGZhY3RvcmludCh7NDogMiwgMTI6IDN9KSkgIyB0d2ljZSB0byB0b2dnbGUgdG8gZGljdCBmb3JtXG4gICAgezI6IDEwLCAzOiAzfVxuICAgID4+PiBmYWN0b3JpbnQoTXVsKDQsIDEyLCBldmFsdWF0ZT1GYWxzZSkpXG4gICAgezI6IDQsIDM6IDF9XG4gICAgVGhlIHRhYmxlIG9mIHRoZSBvdXRwdXQgbG9naWMgaXM6XG4gICAgICAgID09PT09PSA9PT09PT0gPT09PT09PSA9PT09PT09XG4gICAgICAgICAgICAgICAgICAgICAgIFZpc3VhbFxuICAgICAgICAtLS0tLS0gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgICAgICBJbnB1dCAgVHJ1ZSAgIEZhbHNlICAgb3RoZXJcbiAgICAgICAgPT09PT09ID09PT09PSA9PT09PT09ID09PT09PT1cbiAgICAgICAgZGljdCAgICBtdWwgICAgZGljdCAgICBtdWxcbiAgICAgICAgbiAgICAgICBtdWwgICAgZGljdCAgICBkaWN0XG4gICAgICAgIG11bCAgICAgbXVsICAgIGRpY3QgICAgZGljdFxuICAgICAgICA9PT09PT0gPT09PT09ID09PT09PT0gPT09PT09PVxuICAgIE5vdGVzXG4gICAgPT09PT1cbiAgICBBbGdvcml0aG06XG4gICAgVGhlIGZ1bmN0aW9uIHN3aXRjaGVzIGJldHdlZW4gbXVsdGlwbGUgYWxnb3JpdGhtcy4gVHJpYWwgZGl2aXNpb25cbiAgICBxdWlja2x5IGZpbmRzIHNtYWxsIGZhY3RvcnMgKG9mIHRoZSBvcmRlciAxLTUgZGlnaXRzKSwgYW5kIGZpbmRzXG4gICAgYWxsIGxhcmdlIGZhY3RvcnMgaWYgZ2l2ZW4gZW5vdWdoIHRpbWUuIFRoZSBQb2xsYXJkIHJobyBhbmQgcC0xXG4gICAgYWxnb3JpdGhtcyBhcmUgdXNlZCB0byBmaW5kIGxhcmdlIGZhY3RvcnMgYWhlYWQgb2YgdGltZTsgdGhleVxuICAgIHdpbGwgb2Z0ZW4gZmluZCBmYWN0b3JzIG9mIHRoZSBvcmRlciBvZiAxMCBkaWdpdHMgd2l0aGluIGEgZmV3XG4gICAgc2Vjb25kczpcbiAgICA+Pj4gZmFjdG9ycyA9IGZhY3RvcmludCgxMjM0NTY3ODkxMDExMTIxMzE0MTUxNilcbiAgICA+Pj4gZm9yIGJhc2UsIGV4cCBpbiBzb3J0ZWQoZmFjdG9ycy5pdGVtcygpKTpcbiAgICAuLi4gICAgIHByaW50KCclcyAlcycgJSAoYmFzZSwgZXhwKSlcbiAgICAuLi5cbiAgICAyIDJcbiAgICAyNTA3MTkxNjkxIDFcbiAgICAxMjMxMDI2NjI1NzY5IDFcbiAgICBBbnkgb2YgdGhlc2UgbWV0aG9kcyBjYW4gb3B0aW9uYWxseSBiZSBkaXNhYmxlZCB3aXRoIHRoZSBmb2xsb3dpbmdcbiAgICBib29sZWFuIHBhcmFtZXRlcnM6XG4gICAgICAgIC0gYGB1c2VfdHJpYWxgYDogVG9nZ2xlIHVzZSBvZiB0cmlhbCBkaXZpc2lvblxuICAgICAgICAtIGBgdXNlX3Job2BgOiBUb2dnbGUgdXNlIG9mIFBvbGxhcmQncyByaG8gbWV0aG9kXG4gICAgICAgIC0gYGB1c2VfcG0xYGA6IFRvZ2dsZSB1c2Ugb2YgUG9sbGFyZCdzIHAtMSBtZXRob2RcbiAgICBgYGZhY3RvcmludGBgIGFsc28gcGVyaW9kaWNhbGx5IGNoZWNrcyBpZiB0aGUgcmVtYWluaW5nIHBhcnQgaXNcbiAgICBhIHByaW1lIG51bWJlciBvciBhIHBlcmZlY3QgcG93ZXIsIGFuZCBpbiB0aG9zZSBjYXNlcyBzdG9wcy5cbiAgICBGb3IgdW5ldmFsdWF0ZWQgZmFjdG9yaWFsLCBpdCB1c2VzIExlZ2VuZHJlJ3MgZm9ybXVsYSh0aGVvcmVtKS5cbiAgICBJZiBgYHZlcmJvc2VgYCBpcyBzZXQgdG8gYGBUcnVlYGAsIGRldGFpbGVkIHByb2dyZXNzIGlzIHByaW50ZWQuXG4gICAgU2VlIEFsc29cbiAgICA9PT09PT09PVxuICAgIHNtb290aG5lc3MsIHNtb290aG5lc3NfcCwgZGl2aXNvcnNcbiAgICAqL1xuICAgIGlmIChuIGluc3RhbmNlb2YgSW50ZWdlcikge1xuICAgICAgICBuID0gbi5wO1xuICAgIH1cbiAgICBuID0gYXNfaW50KG4pO1xuICAgIGlmIChsaW1pdCkge1xuICAgICAgICBsaW1pdCA9IGxpbWl0IGFzIG51bWJlcjtcbiAgICB9XG4gICAgaWYgKG4gPCAwKSB7XG4gICAgICAgIGNvbnN0IGZhY3RvcnMgPSBmYWN0b3JpbnQoLW4sIGxpbWl0KTtcbiAgICAgICAgZmFjdG9ycy5hZGQoZmFjdG9ycy5zaXplIC0gMSwgMSk7XG4gICAgICAgIHJldHVybiBmYWN0b3JzO1xuICAgIH1cbiAgICBpZiAobGltaXQgJiYgbGltaXQgPCAyKSB7XG4gICAgICAgIGlmIChuID09PSAxKSB7XG4gICAgICAgICAgICByZXR1cm4gbmV3IEhhc2hEaWN0KCk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIG5ldyBIYXNoRGljdCh7bjogMX0pO1xuICAgIH0gZWxzZSBpZiAobiA8IDEwKSB7XG4gICAgICAgIHJldHVybiBuZXcgSGFzaERpY3QoW3swOiAxfSwge30sIHsyOiAxfSwgezM6IDF9LCB7MjogMn0sIHs1OiAxfSxcbiAgICAgICAgICAgIHsyOiAxLCAzOiAxfSwgezc6IDF9LCB7MjogM30sIHszOiAyfV1bbl0pO1xuICAgIH1cblxuICAgIGNvbnN0IGZhY3RvcnMgPSBuZXcgSGFzaERpY3QoKTtcbiAgICBsZXQgc21hbGwgPSAyKioxNTtcbiAgICBjb25zdCBmYWlsX21heCA9IDYwMDtcbiAgICBzbWFsbCA9IE1hdGgubWluKHNtYWxsLCBsaW1pdCB8fCBzbWFsbCk7XG4gICAgbGV0IG5leHRfcDtcbiAgICBbbiwgbmV4dF9wXSA9IF9mYWN0b3JpbnRfc21hbGwoZmFjdG9ycywgbiwgc21hbGwsIGZhaWxfbWF4KTtcbiAgICBsZXQgc3FydF9uOiBhbnk7XG4gICAgdHJ5IHtcbiAgICAgICAgaWYgKGxpbWl0ICYmIG5leHRfcCA+IGxpbWl0KSB7XG4gICAgICAgICAgICBfY2hlY2tfdGVybWluYXRpb24oZmFjdG9ycywgbiwgbGltaXQpO1xuICAgICAgICAgICAgaWYgKG4gPiAxKSB7XG4gICAgICAgICAgICAgICAgZmFjdG9ycy5hZGQobiwgMSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gZmFjdG9ycztcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHNxcnRfbiA9IGludF9udGhyb290KG4sIDIpWzBdO1xuICAgICAgICAgICAgbGV0IGEgPSBzcXJ0X24gKyAxO1xuICAgICAgICAgICAgY29uc3QgYTIgPSBhKioyO1xuICAgICAgICAgICAgbGV0IGIyID0gYTIgLSBuO1xuICAgICAgICAgICAgbGV0IGI6IGFueTsgbGV0IGZlcm1hdDogYW55O1xuICAgICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCAzOyBpKyspIHtcbiAgICAgICAgICAgICAgICBbYiwgZmVybWF0XSA9IGludF9udGhyb290KGIyLCAyKTtcbiAgICAgICAgICAgICAgICBpZiAoZmVybWF0KSB7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBiMiArPSAyKmEgKyAxO1xuICAgICAgICAgICAgICAgIGErKztcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChmZXJtYXQpIHtcbiAgICAgICAgICAgICAgICBpZiAobGltaXQpIHtcbiAgICAgICAgICAgICAgICAgICAgbGltaXQgLT0gMTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZm9yIChjb25zdCByIG9mIFthIC0gYiwgYSArIGJdKSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGZhY3MgPSBmYWN0b3JpbnQociwgbGltaXQpO1xuICAgICAgICAgICAgICAgICAgICBmb3IgKGNvbnN0IFtrLCB2XSBvZiBmYWNzLmVudHJpZXMoKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgZmFjdG9ycy5hZGQoaywgZmFjdG9ycy5nZXQoaywgMCkgKyB2KTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIF9jaGVja190ZXJtaW5hdGlvbihmYWN0b3JzLCBuLCBsaW1pdCk7XG4gICAgICAgIH1cbiAgICB9IGNhdGNoIChFcnJvcikge1xuICAgICAgICByZXR1cm4gZmFjdG9ycztcbiAgICB9XG5cbiAgICBsZXQgW2xvdywgaGlnaF0gPSBbbmV4dF9wLCAyICogbmV4dF9wXTtcbiAgICBsaW1pdCA9IChsaW1pdCB8fCBzcXJ0X24pIGFzIG51bWJlcjtcbiAgICBsaW1pdCsrO1xuICAgIHdoaWxlICgxKSB7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICBsZXQgaGlnaF8gPSBoaWdoO1xuICAgICAgICAgICAgaWYgKGxpbWl0IDwgaGlnaF8pIHtcbiAgICAgICAgICAgICAgICBoaWdoXyA9IGxpbWl0O1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgY29uc3QgcHMgPSBwcmltZXJhbmdlKGxvdywgaGlnaF8pO1xuICAgICAgICAgICAgbGV0IGZvdW5kX3RyaWFsO1xuICAgICAgICAgICAgW24sIGZvdW5kX3RyaWFsXSA9IF90cmlhbChmYWN0b3JzLCBuLCBwcyk7XG4gICAgICAgICAgICBpZiAoZm91bmRfdHJpYWwpIHtcbiAgICAgICAgICAgICAgICBfY2hlY2tfdGVybWluYXRpb24oZmFjdG9ycywgbiwgbGltaXQpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKGhpZ2ggPiBsaW1pdCkge1xuICAgICAgICAgICAgICAgIGlmIChuID4gMSkge1xuICAgICAgICAgICAgICAgICAgICBmYWN0b3JzLmFkZChuLCAxKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoIWZvdW5kX3RyaWFsKSB7XG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiYWR2YW5jZWQgZmFjdG9yaW5nIG1ldGhvZHMgYXJlIG5vdCB5ZXQgaW1wbGVtZW50ZWRcIik7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0gY2F0Y2ggKEVycm9yKSB7XG4gICAgICAgICAgICByZXR1cm4gZmFjdG9ycztcbiAgICAgICAgfVxuICAgICAgICBbbG93LCBoaWdoXSA9IFtoaWdoLCBoaWdoKjJdO1xuICAgIH1cbiAgICBsZXQgQjEgPSAxMDAwMDtcbiAgICBsZXQgQjIgPSAxMDAqQjE7XG4gICAgbGV0IG51bV9jdXJ2ZXMgPSA1MDtcbiAgICB3aGlsZSAoMSkge1xuICAgICAgICB3aGlsZSAoMSkge1xuICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJlY20gb25lIGZhY3RvciBub3QgeWV0IGltcGxlbWVudGVkXCIpO1xuICAgICAgICAgICAgICAgIC8vIF9jaGVja190ZXJtaW5hdGlvbihmYWN0b3JzLCBuLCBsaW1pdCk7XG4gICAgICAgICAgICB9IGNhdGNoIChFcnJvcikge1xuICAgICAgICAgICAgICAgIHJldHVybiBmYWN0b3JzO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIEIxICo9IDU7XG4gICAgICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBuby11bnVzZWQtdmFyc1xuICAgICAgICBCMiA9IDEwMCpCMTtcbiAgICAgICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5vLXVudXNlZC12YXJzXG4gICAgICAgIG51bV9jdXJ2ZXMgKj0gNDtcbiAgICB9XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBwZXJmZWN0X3Bvd2VyKG46IGFueSwgY2FuZGlkYXRlczogYW55ID0gdW5kZWZpbmVkLCBiaWc6IGJvb2xlYW4gPSB0cnVlLFxuICAgIGZhY3RvcjogYm9vbGVhbiA9IHRydWUsIG51bV9pdGVyYXRpb25zOiBudW1iZXIgPSAxNSk6IGFueSB7XG4gICAgLypcbiAgICBSZXR1cm4gYGAoYiwgZSlgYCBzdWNoIHRoYXQgYGBuYGAgPT0gYGBiKiplYGAgaWYgYGBuYGAgaXMgYSB1bmlxdWVcbiAgICBwZXJmZWN0IHBvd2VyIHdpdGggYGBlID4gMWBgLCBlbHNlIGBgRmFsc2VgYCAoZS5nLiAxIGlzIG5vdCBhXG4gICAgcGVyZmVjdCBwb3dlcikuIEEgVmFsdWVFcnJvciBpcyByYWlzZWQgaWYgYGBuYGAgaXMgbm90IFJhdGlvbmFsLlxuICAgIEJ5IGRlZmF1bHQsIHRoZSBiYXNlIGlzIHJlY3Vyc2l2ZWx5IGRlY29tcG9zZWQgYW5kIHRoZSBleHBvbmVudHNcbiAgICBjb2xsZWN0ZWQgc28gdGhlIGxhcmdlc3QgcG9zc2libGUgYGBlYGAgaXMgc291Z2h0LiBJZiBgYGJpZz1GYWxzZWBgXG4gICAgdGhlbiB0aGUgc21hbGxlc3QgcG9zc2libGUgYGBlYGAgKHRodXMgcHJpbWUpIHdpbGwgYmUgY2hvc2VuLlxuICAgIElmIGBgZmFjdG9yPVRydWVgYCB0aGVuIHNpbXVsdGFuZW91cyBmYWN0b3JpemF0aW9uIG9mIGBgbmBgIGlzXG4gICAgYXR0ZW1wdGVkIHNpbmNlIGZpbmRpbmcgYSBmYWN0b3IgaW5kaWNhdGVzIHRoZSBvbmx5IHBvc3NpYmxlIHJvb3RcbiAgICBmb3IgYGBuYGAuIFRoaXMgaXMgVHJ1ZSBieSBkZWZhdWx0IHNpbmNlIG9ubHkgYSBmZXcgc21hbGwgZmFjdG9ycyB3aWxsXG4gICAgYmUgdGVzdGVkIGluIHRoZSBjb3Vyc2Ugb2Ygc2VhcmNoaW5nIGZvciB0aGUgcGVyZmVjdCBwb3dlci5cbiAgICBUaGUgdXNlIG9mIGBgY2FuZGlkYXRlc2BgIGlzIHByaW1hcmlseSBmb3IgaW50ZXJuYWwgdXNlOyBpZiBwcm92aWRlZCxcbiAgICBGYWxzZSB3aWxsIGJlIHJldHVybmVkIGlmIGBgbmBgIGNhbm5vdCBiZSB3cml0dGVuIGFzIGEgcG93ZXIgd2l0aCBvbmVcbiAgICBvZiB0aGUgY2FuZGlkYXRlcyBhcyBhbiBleHBvbmVudCBhbmQgZmFjdG9yaW5nIChiZXlvbmQgdGVzdGluZyBmb3JcbiAgICBhIGZhY3RvciBvZiAyKSB3aWxsIG5vdCBiZSBhdHRlbXB0ZWQuXG4gICAgRXhhbXBsZXNcbiAgICA9PT09PT09PVxuICAgID4+PiBmcm9tIHN5bXB5IGltcG9ydCBwZXJmZWN0X3Bvd2VyLCBSYXRpb25hbFxuICAgID4+PiBwZXJmZWN0X3Bvd2VyKDE2KVxuICAgICgyLCA0KVxuICAgID4+PiBwZXJmZWN0X3Bvd2VyKDE2LCBiaWc9RmFsc2UpXG4gICAgKDQsIDIpXG4gICAgTmVnYXRpdmUgbnVtYmVycyBjYW4gb25seSBoYXZlIG9kZCBwZXJmZWN0IHBvd2VyczpcbiAgICA+Pj4gcGVyZmVjdF9wb3dlcigtNClcbiAgICBGYWxzZVxuICAgID4+PiBwZXJmZWN0X3Bvd2VyKC04KVxuICAgICgtMiwgMylcbiAgICBSYXRpb25hbHMgYXJlIGFsc28gcmVjb2duaXplZDpcbiAgICA+Pj4gcGVyZmVjdF9wb3dlcihSYXRpb25hbCgxLCAyKSoqMylcbiAgICAoMS8yLCAzKVxuICAgID4+PiBwZXJmZWN0X3Bvd2VyKFJhdGlvbmFsKC0zLCAyKSoqMylcbiAgICAoLTMvMiwgMylcbiAgICBOb3Rlc1xuICAgID09PT09XG4gICAgVG8ga25vdyB3aGV0aGVyIGFuIGludGVnZXIgaXMgYSBwZXJmZWN0IHBvd2VyIG9mIDIgdXNlXG4gICAgICAgID4+PiBpczJwb3cgPSBsYW1iZGEgbjogYm9vbChuIGFuZCBub3QgbiAmIChuIC0gMSkpXG4gICAgICAgID4+PiBbKGksIGlzMnBvdyhpKSkgZm9yIGkgaW4gcmFuZ2UoNSldXG4gICAgICAgIFsoMCwgRmFsc2UpLCAoMSwgVHJ1ZSksICgyLCBUcnVlKSwgKDMsIEZhbHNlKSwgKDQsIFRydWUpXVxuICAgIEl0IGlzIG5vdCBuZWNlc3NhcnkgdG8gcHJvdmlkZSBgYGNhbmRpZGF0ZXNgYC4gV2hlbiBwcm92aWRlZFxuICAgIGl0IHdpbGwgYmUgYXNzdW1lZCB0aGF0IHRoZXkgYXJlIGludHMuIFRoZSBmaXJzdCBvbmUgdGhhdCBpc1xuICAgIGxhcmdlciB0aGFuIHRoZSBjb21wdXRlZCBtYXhpbXVtIHBvc3NpYmxlIGV4cG9uZW50IHdpbGwgc2lnbmFsXG4gICAgZmFpbHVyZSBmb3IgdGhlIHJvdXRpbmUuXG4gICAgICAgID4+PiBwZXJmZWN0X3Bvd2VyKDMqKjgsIFs5XSlcbiAgICAgICAgRmFsc2VcbiAgICAgICAgPj4+IHBlcmZlY3RfcG93ZXIoMyoqOCwgWzIsIDQsIDhdKVxuICAgICAgICAoMywgOClcbiAgICAgICAgPj4+IHBlcmZlY3RfcG93ZXIoMyoqOCwgWzQsIDhdLCBiaWc9RmFsc2UpXG4gICAgICAgICg5LCA0KVxuICAgIFNlZSBBbHNvXG4gICAgPT09PT09PT1cbiAgICBzeW1weS5jb3JlLnBvd2VyLmludGVnZXJfbnRocm9vdFxuICAgIHN5bXB5Lm50aGVvcnkucHJpbWV0ZXN0LmlzX3NxdWFyZVxuICAgICovXG4gICAgbGV0IHBwO1xuICAgIGlmIChuIGluc3RhbmNlb2YgUmF0aW9uYWwgJiYgIShuLmlzX2ludGVnZXIpKSB7XG4gICAgICAgIGNvbnN0IFtwLCBxXSA9IG4uX2FzX251bWVyX2Rlbm9tKCk7XG4gICAgICAgIGlmIChwID09PSBTLk9uZSkge1xuICAgICAgICAgICAgcHAgPSBwZXJmZWN0X3Bvd2VyKHEpO1xuICAgICAgICAgICAgaWYgKHBwKSB7XG4gICAgICAgICAgICAgICAgcHAgPSBbbi5jb25zdHJ1Y3RvcigxLCBwcFswXSksIHBwWzFdXTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHBwID0gcGVyZmVjdF9wb3dlcihwKTtcbiAgICAgICAgICAgIGlmIChwcCkge1xuICAgICAgICAgICAgICAgIGNvbnN0IFtudW0sIGVdID0gcHA7XG4gICAgICAgICAgICAgICAgY29uc3QgcHEgPSBwZXJmZWN0X3Bvd2VyKHEsIFtlXSk7XG4gICAgICAgICAgICAgICAgaWYgKHBxKSB7XG4gICAgICAgICAgICAgICAgICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBuby11bnVzZWQtdmFyc1xuICAgICAgICAgICAgICAgICAgICBjb25zdCBbZGVuLCBibGFua10gPSBwcTtcbiAgICAgICAgICAgICAgICAgICAgcHAgPSBbbi5jb25zdHJ1Y3RvcihudW0sIGRlbiksIGVdO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gcHA7XG4gICAgfVxuXG4gICAgbiA9IGFzX2ludChuKTtcbiAgICBpZiAobiA8IDApIHtcbiAgICAgICAgcHAgPSBwZXJmZWN0X3Bvd2VyKC1uKTtcbiAgICAgICAgaWYgKHBwKSB7XG4gICAgICAgICAgICBjb25zdCBbYiwgZV0gPSBwcDtcbiAgICAgICAgICAgIGlmIChlICUgMiAhPT0gMCkge1xuICAgICAgICAgICAgICAgIHJldHVybiBbLWIsIGVdO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG5cbiAgICBpZiAobiA8PSAzKSB7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG5cbiAgICBjb25zdCBsb2duID0gTWF0aC5sb2cyKG4pO1xuICAgIGNvbnN0IG1heF9wb3NzaWJsZSA9IE1hdGguZmxvb3IobG9nbikgKyAyO1xuICAgIGNvbnN0IG5vdF9zcXVhcmUgPSBbMiwgMywgNywgOF0uaW5jbHVkZXMobiAlIDEwKTtcbiAgICBjb25zdCBtaW5fcG9zc2libGUgPSAyICsgKG5vdF9zcXVhcmUgYXMgYW55IGFzIG51bWJlcik7XG4gICAgaWYgKHR5cGVvZiBjYW5kaWRhdGVzID09PSBcInVuZGVmaW5lZFwiKSB7XG4gICAgICAgIGNhbmRpZGF0ZXMgPSBwcmltZXJhbmdlKG1pbl9wb3NzaWJsZSwgbWF4X3Bvc3NpYmxlKTtcbiAgICB9IGVsc2Uge1xuICAgICAgICBjb25zdCB0ZW1wID0gW107XG4gICAgICAgIGNhbmRpZGF0ZXMuc29ydCgpO1xuICAgICAgICBmb3IgKGNvbnN0IGkgb2YgY2FuZGlkYXRlcykge1xuICAgICAgICAgICAgaWYgKG1pbl9wb3NzaWJsZSA8PSBpICYmIGkgPD0gbWF4X3Bvc3NpYmxlKSB7XG4gICAgICAgICAgICAgICAgdGVtcC5wdXNoKGkpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGNhbmRpZGF0ZXMgPSB0ZW1wO1xuICAgICAgICBpZiAobiAlIDIgPT09IDApIHtcbiAgICAgICAgICAgIGNvbnN0IGUgPSB0cmFpbGluZyhuKTtcbiAgICAgICAgICAgIGNvbnN0IHRlbXAyID0gW107XG4gICAgICAgICAgICBmb3IgKGNvbnN0IGkgb2YgY2FuZGlkYXRlcykge1xuICAgICAgICAgICAgICAgIGlmIChlICUgaSA9PT0gMCkge1xuICAgICAgICAgICAgICAgICAgICB0ZW1wMi5wdXNoKGkpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGNhbmRpZGF0ZXMgPSB0ZW1wMjtcbiAgICAgICAgfVxuICAgICAgICBpZiAoYmlnKSB7XG4gICAgICAgICAgICBjYW5kaWRhdGVzLnJldmVyc2UoKTtcbiAgICAgICAgfVxuICAgICAgICBmb3IgKGNvbnN0IGUgb2YgY2FuZGlkYXRlcykge1xuICAgICAgICAgICAgY29uc3QgW3IsIG9rXSA9IGludF9udGhyb290KG4sIGUpO1xuICAgICAgICAgICAgaWYgKG9rKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIFtyLCBlXTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICAgIGZ1bmN0aW9uKiBfZmFjdG9ycyhsZW5ndGg6IG51bWJlcikge1xuICAgICAgICBsZXQgcnYgPSAyICsgbiAlIDI7XG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgbGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIHlpZWxkIHJ2O1xuICAgICAgICAgICAgcnYgPSBuZXh0cHJpbWUocnYpO1xuICAgICAgICB9XG4gICAgfVxuICAgIC8vIG9yaWdpbmFsIGFsZ29yaXRobSBnZW5lcmF0ZXMgaW5maW5pdGUgc2VxdWVuY2VzIG9mIHRoZSBmb2xsb3dpbmdcbiAgICAvLyBmb3Igbm93IHdlIHdpbGwgZ2VuZXJhdGUgbGltaXRlZCBzaXplZCBhcnJheXMgYW5kIHVzZSB0aG9zZVxuICAgIGNvbnN0IF9jYW5kaWRhdGVzID0gW107XG4gICAgZm9yIChjb25zdCBpIG9mIGNhbmRpZGF0ZXMpIHtcbiAgICAgICAgX2NhbmRpZGF0ZXMucHVzaChpKTtcbiAgICB9XG4gICAgY29uc3QgX2ZhY3RvcnNfID0gW107XG4gICAgZm9yIChjb25zdCBpIG9mIF9mYWN0b3JzKF9jYW5kaWRhdGVzLmxlbmd0aCkpIHtcbiAgICAgICAgX2ZhY3RvcnNfLnB1c2goaSk7XG4gICAgfVxuICAgIGZvciAoY29uc3QgaXRlbSBvZiBVdGlsLnppcChfZmFjdG9yc18sIF9jYW5kaWRhdGVzKSkge1xuICAgICAgICBjb25zdCBmYWMgPSBpdGVtWzBdO1xuICAgICAgICBsZXQgZSA9IGl0ZW1bMV07XG4gICAgICAgIGxldCByO1xuICAgICAgICBsZXQgZXhhY3Q7XG4gICAgICAgIGlmIChmYWN0b3IgJiYgbiAlIGZhYyA9PT0gMCkge1xuICAgICAgICAgICAgaWYgKGZhYyA9PT0gMikge1xuICAgICAgICAgICAgICAgIGUgPSB0cmFpbGluZyhuKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgZSA9IG11bHRpcGxpY2l0eShmYWMsIG4pO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKGUgPT09IDEpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIFtyLCBleGFjdF0gPSBpbnRfbnRocm9vdChuLCBlKTtcbiAgICAgICAgICAgIGlmICghKGV4YWN0KSkge1xuICAgICAgICAgICAgICAgIGNvbnN0IG0gPSBNYXRoLmZsb29yKG4gLyBmYWMpICoqIGU7XG4gICAgICAgICAgICAgICAgY29uc3QgckUgPSBwZXJmZWN0X3Bvd2VyKG0sIGRpdmlzb3JzKGUsIHRydWUpKTtcbiAgICAgICAgICAgICAgICBpZiAoIShyRSkpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIGxldCBbciwgRV0gPSByRTtcbiAgICAgICAgICAgICAgICAgICAgW3IsIGVdID0gW2ZhYyoqKE1hdGguZmxvb3IoZS9FKSpyKSwgRV07XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIFtyLCBlXTtcbiAgICAgICAgfVxuICAgICAgICBpZiAobG9nbi9lIDwgNDApIHtcbiAgICAgICAgICAgIGNvbnN0IGIgPSAyLjAqKihsb2duL2UpO1xuICAgICAgICAgICAgaWYgKE1hdGguYWJzKE1hdGguZmxvb3IoYiArIDAuNSkgLSBiKSA+IDAuMDEpIHtcbiAgICAgICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBbciwgZXhhY3RdID0gaW50X250aHJvb3QobiwgZSk7XG4gICAgICAgIGlmIChleGFjdCkge1xuICAgICAgICAgICAgY29uc3QgbSA9IHBlcmZlY3RfcG93ZXIociwgdW5kZWZpbmVkLCBiaWcsIGZhY3Rvcik7XG4gICAgICAgICAgICBpZiAobSkge1xuICAgICAgICAgICAgICAgIFtyLCBlXSA9IFttWzBdLCBlICogbVsxXV07XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gW01hdGguZmxvb3IociksIGVdO1xuICAgICAgICB9XG4gICAgfVxuICAgIHJldHVybiBmYWxzZTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGZhY3RvcnJhdChyYXQ6IGFueSwgbGltaXQ6IG51bWJlciA9IHVuZGVmaW5lZCkge1xuICAgIC8qXG4gICAgR2l2ZW4gYSBSYXRpb25hbCBgYHJgYCwgYGBmYWN0b3JyYXQocilgYCByZXR1cm5zIGEgZGljdCBjb250YWluaW5nXG4gICAgdGhlIHByaW1lIGZhY3RvcnMgb2YgYGByYGAgYXMga2V5cyBhbmQgdGhlaXIgcmVzcGVjdGl2ZSBtdWx0aXBsaWNpdGllc1xuICAgIGFzIHZhbHVlcy4gRm9yIGV4YW1wbGU6XG4gICAgPj4+IGZyb20gc3ltcHkgaW1wb3J0IGZhY3RvcnJhdCwgU1xuICAgID4+PiBmYWN0b3JyYXQoUyg4KS85KSAgICAjIDgvOSA9ICgyKiozKSAqICgzKiotMilcbiAgICB7MjogMywgMzogLTJ9XG4gICAgPj4+IGZhY3RvcnJhdChTKC0xKS85ODcpICAgICMgLTEvNzg5ID0gLTEgKiAoMyoqLTEpICogKDcqKi0xKSAqICg0NyoqLTEpXG4gICAgey0xOiAxLCAzOiAtMSwgNzogLTEsIDQ3OiAtMX1cbiAgICBQbGVhc2Ugc2VlIHRoZSBkb2NzdHJpbmcgZm9yIGBgZmFjdG9yaW50YGAgZm9yIGRldGFpbGVkIGV4cGxhbmF0aW9uc1xuICAgIGFuZCBleGFtcGxlcyBvZiB0aGUgZm9sbG93aW5nIGtleXdvcmRzOlxuICAgICAgICAtIGBgbGltaXRgYDogSW50ZWdlciBsaW1pdCB1cCB0byB3aGljaCB0cmlhbCBkaXZpc2lvbiBpcyBkb25lXG4gICAgICAgIC0gYGB1c2VfdHJpYWxgYDogVG9nZ2xlIHVzZSBvZiB0cmlhbCBkaXZpc2lvblxuICAgICAgICAtIGBgdXNlX3Job2BgOiBUb2dnbGUgdXNlIG9mIFBvbGxhcmQncyByaG8gbWV0aG9kXG4gICAgICAgIC0gYGB1c2VfcG0xYGA6IFRvZ2dsZSB1c2Ugb2YgUG9sbGFyZCdzIHAtMSBtZXRob2RcbiAgICAgICAgLSBgYHZlcmJvc2VgYDogVG9nZ2xlIGRldGFpbGVkIHByaW50aW5nIG9mIHByb2dyZXNzXG4gICAgICAgIC0gYGBtdWx0aXBsZWBgOiBUb2dnbGUgcmV0dXJuaW5nIGEgbGlzdCBvZiBmYWN0b3JzIG9yIGRpY3RcbiAgICAgICAgLSBgYHZpc3VhbGBgOiBUb2dnbGUgcHJvZHVjdCBmb3JtIG9mIG91dHB1dFxuICAgICovXG4gICAgY29uc3QgZiA9IGZhY3RvcmludChyYXQucCwgbGltaXQpO1xuICAgIGZvciAoY29uc3QgaXRlbSBvZiBmYWN0b3JpbnQocmF0LnEsIGxpbWl0KS5lbnRyaWVzKCkpIHtcbiAgICAgICAgY29uc3QgcCA9IGl0ZW1bMF07XG4gICAgICAgIGNvbnN0IGUgPSBpdGVtWzFdO1xuICAgICAgICBmLmFkZChwLCBmLmdldChwLCAwKSAtIGUpO1xuICAgIH1cbiAgICBpZiAoZi5zaXplID4gMSAmJiBmLmhhcygxKSkge1xuICAgICAgICBmLnJlbW92ZSgxKTtcbiAgICB9XG4gICAgcmV0dXJuIGY7XG59XG4iLCAiLypcbk5vdGFibGUgY2hhbmdlcyBtYWRlIChhbmQgbm90ZXMpOlxuLSBCYXJlYm9uZXMgaW1wbGVtZW50YXRpb24gLSBvbmx5IGVub3VnaCBhcyBuZWVkZWQgZm9yIHN5bWJvbFxuKi9cblxuaW1wb3J0IHtfQmFzaWN9IGZyb20gXCIuL2Jhc2ljXCI7XG5pbXBvcnQge0Jvb2xlYW5LaW5kfSBmcm9tIFwiLi9raW5kXCI7XG5pbXBvcnQge2Jhc2UsIG1peH0gZnJvbSBcIi4vdXRpbGl0eVwiO1xuaW1wb3J0IHtNYW5hZ2VkUHJvcGVydGllc30gZnJvbSBcIi4vYXNzdW1wdGlvbnNcIjtcblxuY29uc3QgQm9vbGVhbiA9IChzdXBlcmNsYXNzOiBhbnkpID0+IGNsYXNzIEJvb2xlYW4gZXh0ZW5kcyBtaXgoYmFzZSkud2l0aChfQmFzaWMpIHtcbiAgICBfX3Nsb3RzX186IGFueVtdID0gW107XG5cbiAgICBzdGF0aWMga2luZCA9IEJvb2xlYW5LaW5kO1xufTtcblxuTWFuYWdlZFByb3BlcnRpZXMucmVnaXN0ZXIoQm9vbGVhbihPYmplY3QpKTtcblxuZXhwb3J0IHtCb29sZWFufTtcbiIsICIvKlxuTm90YWJsZSBjaGFuZ2VzXG4tIFN0aWxsIGEgd29yayBpbiBwcm9ncmVzcyAobm90IGFsbCBtZXRob2RzIGltcGxlbWVudGVkKVxuLSBDbGFzcyBzdHJ1Y3R1cmUgcmV3b3JrZWQgYmFzZWQgb24gYSBjb25zdHJ1Y3RvciBzeXN0ZW0gKHZpZXcgc291cmNlKVxuKi9cblxuaW1wb3J0IHttaXgsIGJhc2UsIEhhc2hEaWN0fSBmcm9tIFwiLi91dGlsaXR5XCI7XG5pbXBvcnQge0F0b21pY0V4cHJ9IGZyb20gXCIuL2V4cHJcIjtcbmltcG9ydCB7Qm9vbGVhbn0gZnJvbSBcIi4vYm9vbGFsZ1wiO1xuaW1wb3J0IHtOdW1iZXJLaW5kLCBVbmRlZmluZWRLaW5kfSBmcm9tIFwiLi9raW5kXCI7XG5pbXBvcnQge2Z1enp5X2Jvb2x9IGZyb20gXCIuL2xvZ2ljXCI7XG5pbXBvcnQge1N0ZEZhY3RLQn0gZnJvbSBcIi4vYXNzdW1wdGlvbnNcIjtcbmltcG9ydCB7TWFuYWdlZFByb3BlcnRpZXN9IGZyb20gXCIuL2Fzc3VtcHRpb25zXCI7XG5cblxuY2xhc3MgU3ltYm9sIGV4dGVuZHMgbWl4KGJhc2UpLndpdGgoQm9vbGVhbiwgQXRvbWljRXhwcikge1xuICAgIC8qXG4gICAgQXNzdW1wdGlvbnM6XG4gICAgICAgY29tbXV0YXRpdmUgPSBUcnVlXG4gICAgWW91IGNhbiBvdmVycmlkZSB0aGUgZGVmYXVsdCBhc3N1bXB0aW9ucyBpbiB0aGUgY29uc3RydWN0b3IuXG4gICAgRXhhbXBsZXNcbiAgICA9PT09PT09PVxuICAgID4+PiBmcm9tIHN5bXB5IGltcG9ydCBzeW1ib2xzXG4gICAgPj4+IEEsQiA9IHN5bWJvbHMoJ0EsQicsIGNvbW11dGF0aXZlID0gRmFsc2UpXG4gICAgPj4+IGJvb2woQSpCICE9IEIqQSlcbiAgICBUcnVlXG4gICAgPj4+IGJvb2woQSpCKjIgPT0gMipBKkIpID09IFRydWUgIyBtdWx0aXBsaWNhdGlvbiBieSBzY2FsYXJzIGlzIGNvbW11dGF0aXZlXG4gICAgVHJ1ZVxuICAgICovXG5cbiAgICBzdGF0aWMgaXNfY29tcGFyYWJsZSA9IGZhbHNlO1xuXG4gICAgX19zbG90c19fID0gW1wibmFtZVwiXTtcblxuICAgIG5hbWU6IHN0cmluZztcblxuICAgIHN0YXRpYyBpc19TeW1ib2wgPSB0cnVlO1xuXG4gICAgc3RhdGljIGlzX3N5bWJvbCA9IHRydWU7XG5cbiAgICBzdGF0aWMgaXNfY29tbXV0YXRpdmUgPSB0cnVlO1xuXG4gICAgYXJnczogYW55W107XG5cbiAgICBraW5kKCkge1xuICAgICAgICBpZiAoKHRoaXMuY29uc3RydWN0b3IgYXMgYW55KS5pc19jb21tdXRhdGl2ZSkge1xuICAgICAgICAgICAgcmV0dXJuIE51bWJlcktpbmQ7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIFVuZGVmaW5lZEtpbmQ7XG4gICAgfVxuXG4gICAgX2RpZmZfd3J0KCkge1xuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG5cbiAgICBoYXNoS2V5KCkge1xuICAgICAgICByZXR1cm4gdGhpcy5uYW1lICsgdGhpcy5hcmdzO1xuICAgIH1cblxuICAgIGNvbnN0cnVjdG9yKG5hbWU6IGFueSwgcHJvcGVydGllczogUmVjb3JkPGFueSwgYW55PiA9IHVuZGVmaW5lZCkge1xuICAgICAgICBzdXBlcigpO1xuICAgICAgICB0aGlzLm5hbWUgPSBuYW1lO1xuXG4gICAgICAgIC8vIGFkZCB1c2VyIGFzc3VtcHRpb25zXG4gICAgICAgIGNvbnN0IGFzc3VtcHRpb25zOiBIYXNoRGljdCA9IG5ldyBIYXNoRGljdChwcm9wZXJ0aWVzKTtcbiAgICAgICAgU3ltYm9sLl9zYW5pdGl6ZShhc3N1bXB0aW9ucyk7XG4gICAgICAgIGNvbnN0IHRtcF9hc21fY29weSA9IGFzc3VtcHRpb25zLmNvcHkoKTtcblxuICAgICAgICAvLyBzdHJpY3QgY29tbXV0YXRpdml0eVxuICAgICAgICBjb25zdCBpc19jb21tdXRhdGl2ZSA9IGZ1enp5X2Jvb2woYXNzdW1wdGlvbnMuZ2V0KFwiY29tbXV0YXRpdmVcIiwgdHJ1ZSkpO1xuICAgICAgICBhc3N1bXB0aW9ucy5hZGQoXCJpc19jb21tdXRhdGl2ZVwiLCBpc19jb21tdXRhdGl2ZSk7XG5cbiAgICAgICAgLy8gTWVyZ2Ugd2l0aCBvYmplY3QgYXNzdW1wdGlvbnMgYW5kIHJlYXNzaWduIG9iamVjdCBwcm9wZXJ0aWVzXG4gICAgICAgIHRoaXMuX2Fzc3VtcHRpb25zID0gbmV3IFN0ZEZhY3RLQihhc3N1bXB0aW9ucylcbiAgICAgICAgdGhpcy5fYXNzdW1wdGlvbnMuX2dlbmVyYXRvciA9IHRtcF9hc21fY29weTtcbiAgICB9XG5cbiAgICBlcXVhbHMob3RoZXI6IFN5bWJvbCkge1xuICAgICAgICBpZiAodGhpcy5uYW1lID0gb3RoZXIubmFtZSkge1xuICAgICAgICAgICAgaWYgKHRoaXMuX2Fzc3VtcHRpb25zLmlzU2FtZShvdGhlci5fYXNzdW1wdGlvbnMpKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cblxuICAgIHN0YXRpYyBfc2FuaXRpemUoYXNzdW1wdGlvbnM6IEhhc2hEaWN0ID0gbmV3IEhhc2hEaWN0KCkpIHtcbiAgICAgICAgLy8gcmVtb3ZlIG5vbmUsIGNvbnZlcnQgdmFsdWVzIHRvIGJvb2wsIGNoZWNrIGNvbW11dGF0aXZpdHkgKmluIHBsYWNlKlxuXG4gICAgICAgIC8vIGJlIHN0cmljdCBhYm91dCBjb21tdXRhdGl2aXR5OiBjYW5ub3QgYmUgdW5kZWZpbmVkXG4gICAgICAgIGNvbnN0IGlzX2NvbW11dGF0aXZlID0gZnV6enlfYm9vbChhc3N1bXB0aW9ucy5nZXQoXCJjb21tdXRhdGl2ZVwiLCB0cnVlKSk7XG4gICAgICAgIGlmICh0eXBlb2YgaXNfY29tbXV0YXRpdmUgPT09IFwidW5kZWZpbmVkXCIpIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcImNvbW11dGF0aXZpdHkgbXVzdCBiZSB0cnVlIG9yIGZhbHNlXCIpO1xuICAgICAgICB9XG4gICAgICAgIGZvciAoY29uc3Qga2V5IG9mIGFzc3VtcHRpb25zLmtleXMoKSkge1xuICAgICAgICAgICAgY29uc3QgdiA9IGFzc3VtcHRpb25zLmdldChrZXkpO1xuICAgICAgICAgICAgaWYgKHR5cGVvZiB2ID09PSBcInVuZGVmaW5lZFwiKSB7XG4gICAgICAgICAgICAgICAgYXNzdW1wdGlvbnMuZGVsZXRlKGtleSk7XG4gICAgICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBhc3N1bXB0aW9ucy5hZGQoa2V5LCB2IGFzIGJvb2xlYW4pO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgdG9TdHJpbmcoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLm5hbWU7XG4gICAgfVxufVxuXG4vLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbmV3LWNhcFxuTWFuYWdlZFByb3BlcnRpZXMucmVnaXN0ZXIoU3ltYm9sKTtcblxuZXhwb3J0IHtTeW1ib2x9O1xuIiwgImltcG9ydCB7ZmFjdG9yaW50LCBmYWN0b3JyYXR9IGZyb20gXCIuL250aGVvcnkvZmFjdG9yXy5qc1wiO1xuaW1wb3J0IHtBZGR9IGZyb20gXCIuL2NvcmUvYWRkLmpzXCI7XG5pbXBvcnQge011bH0gZnJvbSBcIi4vY29yZS9tdWwuanNcIjtcbmltcG9ydCB7X051bWJlcl99IGZyb20gXCIuL2NvcmUvbnVtYmVycy5qc1wiO1xuaW1wb3J0IHtQb3d9IGZyb20gXCIuL2NvcmUvcG93ZXIuanNcIjtcbmltcG9ydCB7U30gZnJvbSBcIi4vY29yZS9zaW5nbGV0b24uanNcIjtcbmltcG9ydCB7U3ltYm9sfSBmcm9tIFwiLi9jb3JlL3N5bWJvbC5qc1wiO1xuXG4vLyBEZWZpbmUgaW50ZWdlcnMsIHJhdGlvbmFscywgZmxvYXRzLCBhbmQgc3ltYm9sc1xubGV0IG4gPSBfTnVtYmVyXy5uZXcoNCk7XG5sZXQgeDphbnkgPSBuZXcgU3ltYm9sKFwieFwiKTtcbnggPSBuZXcgQWRkKHRydWUsIHRydWUsIG4sIG4sIHgpO1xueCA9IG5ldyBNdWwodHJ1ZSwgdHJ1ZSwgbiwgbiwgeCk7XG54ID0gbmV3IFBvdyhuLCBuKTtcbmNvbnN0IGJpZ2ludCA9IF9OdW1iZXJfLm5ldygyODUpO1xueCA9IGZhY3RvcmludChiaWdpbnQpO1xuY29uc3QgYmlncmF0ID0gX051bWJlcl8ubmV3KDI3MSwgOTMyKTtcbnggPSBmYWN0b3JyYXQoYmlncmF0KTtcblxueCA9IG5ldyBQb3cobiwgUy5OYU4pO1xuXG4iXSwKICAibWFwcGluZ3MiOiAiOztBQU1BLE1BQU0sT0FBTixNQUFXO0FBQUEsSUFHUCxPQUFPLFFBQVFBLElBQWdCO0FBQzNCLFVBQUksT0FBT0EsT0FBTSxhQUFhO0FBQzFCLGVBQU87QUFBQSxNQUNYO0FB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QUksSUFBSSxHQUFHLENBQUM7QUFDaEIsTUFBTSxTQUFTLFNBQVMsSUFBSSxHQUFHO0FBQy9CLE1BQUksVUFBVSxNQUFNO0FBQ3BCLE1BQU0sU0FBUyxTQUFTLElBQUksS0FBSyxHQUFHO0FBQ3BDLE1BQUksVUFBVSxNQUFNO0FBRXBCLE1BQUksSUFBSSxJQUFJLEdBQUcsRUFBRSxHQUFHOyIsCiAgIm5hbWVzIjogWyJ4IiwgIm4iLCAiZXhwIiwgIngiLCAieCIsICJpbXBsIiwgIml0ZW0iLCAiUCIsICJzZWxmIiwgImJhc2UiLCAic2VsZiIsICJvbGQiLCAiX25ldyIsICJydiIsICJuIiwgIm1vZCIsICJFcnJvciIsICJjc2V0IiwgIngiLCAibiIsICJfQXRvbWljRXhwciIsICJvYmoiLCAiY19wb3dlcnMiLCAiaSIsICJuIiwgImNfcGFydCIsICJjb2VmZl9zaWduIiwgInNpZ24iLCAieCIsICJtaW4iLCAibWF4IiwgIm4iLCAiYmFzZSIsICJzaWduIiwgInBvdyIsICJzdW0iLCAieDIiLCAiRGVjaW1hbCIsICJpIiwgIngiLCAibiIsICJfQXRvbWljRXhwciIsICJ4IiwgInJlc3VsdCIsICJOYU4iLCAiX0F0b21pY0V4cHIiLCAibiIsICJ0IiwgIkVycm9yIiwgImJhc2UiLCAiZXhwIiwgImQiLCAiZmFjdG9ycyIsICJyIiwgIkJvb2xlYW4iLCAiQm9vbGVhbiIsICJTeW1ib2wiLCAiU3ltYm9sIl0KfQo=
