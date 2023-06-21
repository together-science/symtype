(() => {
  // ts-port/core/utility.ts
  var Util = class {
    static hashKey(x) {
      if (typeof x === "undefined") {
        return "undefined";
      }
      if (x.hashKey) {
        return x.hashKey();
      }
      if (Array.isArray(x)) {
        return x.map((e) => Util.hashKey(e)).join(",");
      }
      if (x === null) {
        return "null";
      }
      return x.toString();
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
        for (const x of res) {
          for (const y of pool) {
            if (typeof x[0] === "undefined") {
              res_temp.push([y]);
            } else {
              res_temp.push(x.concat(y));
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
      const n = iterable.length;
      if (typeof r === "undefined") {
        r = n;
      }
      const range = this.range(n);
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
      const n = iterable.length;
      const range = this.range(n);
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
      const n = iterable.length;
      const range = this.range(n);
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
    static range(n) {
      return new Array(n).fill(0).map((_, idx) => idx);
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
      const superclasses = [];
      const superclass = Object.getPrototypeOf(cls);
      if (superclass !== null && superclass !== Object.prototype) {
        superclasses.push(superclass);
        const parentSuperclasses = Util.getSupers(superclass);
        superclasses.push(...parentSuperclasses);
      }
      return superclasses;
    }
    static shuffleArray(arr) {
      for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        const temp = arr[i];
        arr[i] = arr[j];
        arr[j] = temp;
      }
    }
    static arrMul(arr, n) {
      const res = [];
      for (let i = 0; i < n; i++) {
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
    static splitLogicStr(str) {
      const sep = " ";
      const max_splits = 3;
      const orig_split = str.split(" ", 10);
      if (orig_split.length == 3) {
        return orig_split;
      } else {
        let new_item = "";
        for (let i = 2; i < orig_split.length; i++) {
          new_item += orig_split[i] + " ";
        }
        return [orig_split[0], orig_split[1], new_item.slice(0, -1)];
      }
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
      for (const [factor, exp] of this.entries()) {
        for (let i = 0; i < Math.abs(exp); i++) {
          if (exp < 0) {
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

  // ts-port/core/logic.ts
  var _Logic = class {
    constructor(...args) {
      this.args = [...args].flat();
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
      return null;
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
        return _Logic.False;
      } else {
        if (a.args == b.args) {
          return _Logic.True;
        }
        return _Logic.False;
      }
    }
    static notEquals(a, b) {
      if (!(b instanceof a.constructor)) {
        return _Logic.True;
      } else {
        if (a.args == b.args) {
          return _Logic.False;
        }
        return _Logic.True;
      }
    }
    lessThan(other) {
      if (this.compare(other) == -1) {
        return _Logic.True;
      }
      return _Logic.False;
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
  var True = class extends Logic {
    _eval_propagate_not() {
      return False.False;
    }
    expand() {
      return this;
    }
  };
  var False = class extends Logic {
    _eval_propagate_not() {
      return True.True;
    }
    expand() {
      return this;
    }
  };
  var AndOr_Base = class extends Logic {
    static __new__(cls, op_x_notx, ...args) {
      const bargs = [];
      for (const a of args) {
        if (a == op_x_notx) {
          return a;
        } else if (a == op_x_notx.opposite) {
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
        if (op_x_notx instanceof True) {
          return Logic.False;
        }
        return Logic.True;
      }
      return super.__new__(cls, ...args);
    }
    static flatten(args) {
      const args_queue = [...args];
      const res = [];
      while (args_queue.length > 0) {
        const arg = args_queue.pop();
        if (arg instanceof Logic) {
          if (arg instanceof this) {
            args_queue.push(arg.args);
            continue;
          }
        }
        res.push(arg);
      }
      return res.flat();
    }
  };
  var And = class extends AndOr_Base {
    static New(...args) {
      return super.__new__(And, Logic.False, ...args);
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
      return super.__new__(Or, Logic.True, ...args);
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
      } else if (arg instanceof True) {
        return Logic.False;
      } else if (arg instanceof False) {
        return Logic.True;
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
  Logic.True = new True();
  Logic.False = new False();

  // ts-port/core/facts.ts
  function _base_fact(atom) {
    if (atom instanceof Not) {
      return atom.arg();
    } else {
      return atom;
    }
  }
  function _as_pairv2(atom) {
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
    for (const x of alpha_implications.keys()) {
      const newset = new HashSet();
      newset.addArr(alpha_implications.get(x).toArray());
      const imp = new Implication(newset, []);
      x_impl.add(x, imp);
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
    let seen_static_extension = Logic.True;
    while (seen_static_extension instanceof True) {
      seen_static_extension = Logic.False;
      for (const impl of beta_rules) {
        const bcond = impl.p;
        const bimpl = impl.q;
        if (!(bcond instanceof And)) {
          throw new Error("Cond is not And");
        }
        const bargs = new HashSet(bcond.args);
        for (const item of x_impl.entries()) {
          const x = item[0];
          const impl2 = item[1];
          let ximpls = impl2.p;
          const x_all = ximpls.clone();
          x_all.add(x);
          if (!x_all.has(bimpl) && Util.isSubset(bargs.toArray(), x_all.toArray())) {
            ximpls.add(bimpl);
            const bimpl_impl = x_impl.get(bimpl);
            if (bimpl_impl != null) {
              ximpls |= bimpl_impl[0];
            }
            seen_static_extension = Logic.True;
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
        const x = item[0];
        const value = item[1];
        const ximpls = value.p;
        const bb = value.q;
        const x_all = ximpls.clone();
        x_all.add(x);
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
      if (!a || (b instanceof True || b instanceof False)) {
        return;
      }
      if (a instanceof True || a instanceof False) {
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
          const brest = b.args.slice(0, bidx).concat(b.args.slice(bidx + 1));
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
      const P = new Prover();
      for (const rule of rules) {
        let [a, op, b] = Util.splitLogicStr(rule);
        a = Logic.fromstring(a);
        b = Logic.fromstring(b);
        if (op === "->") {
          P.process_rule(a, b);
        } else if (op === "==") {
          P.process_rule(a, b);
          P.process_rule(b, a);
        } else {
          throw new Error("unknown op " + op);
        }
      }
      this.beta_rules = [];
      for (const item of P.rules_beta()) {
        const bcond = item.p;
        const bimpl = item.q;
        const pairs = new HashSet();
        bcond.args.forEach((a) => pairs.add(_as_pairv2(a)));
        this.beta_rules.push(new Implication(pairs, _as_pairv2(bimpl)));
      }
      const impl_a = deduce_alpha_implications(P.rules_alpha());
      const impl_ab = apply_beta_to_alpha_route(impl_a, P.rules_beta());
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
        impl.toArray().forEach((e) => setToAdd.add(_as_pairv2(e)));
        full_implications.add(_as_pairv2(k), setToAdd);
        beta_triggers.add(_as_pairv2(k), betaidxs);
      }
      this.full_implications = full_implications;
      this.beta_triggers = beta_triggers;
      const prereq = new SetDefaultDict();
      const rel_prereq = rules_2prereq(full_implications);
      for (const item of rel_prereq.entries()) {
        const k = item[0];
        const pitems = item[1];
        const toAdd = prereq.get(k);
        toAdd.add(pitems);
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
          return Logic.False;
        } else {
          throw new InconsistentAssumptions(this, k, v);
        }
      } else {
        this.add(k, v);
        return Logic.True;
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
          let k, v;
          if (item instanceof Implication) {
            k = item.p;
            v = item.q;
          } else {
            k = item[0];
            v = item[1];
          }
          if (this._tell(k, v) instanceof False || typeof v === "undefined") {
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
          const beta_rule = beta_rules[bidx];
          const bcond = beta_rule.p;
          const bimpl = beta_rule.q;
          if (bcond.toArray().every((imp) => this.get(imp.p) == imp.q)) {
            facts.push(bimpl);
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
      for (const base of Util.getSupers(cls).reverse()) {
        const assumptions = base._explicit_class_assumptions;
        if (typeof assumptions !== "undefined") {
          all_defs.merge(assumptions);
        }
      }
      all_defs.merge(local_defs);
      cls._explicit_class_assumptions = all_defs;
      cls.default_assumptions = new StdFactKB(all_defs);
      for (const item of cls.default_assumptions.entries()) {
        if (item[0].includes("is")) {
          cls[item[0]] = item[1];
        } else {
          cls[as_property(item[0])] = item[1];
        }
      }
      const props_filtered = Object.getOwnPropertyNames(cls).filter(
        (prop) => prop.includes("is_")
      ).map((str) => {
        return str.replace("is_", "");
      });
      const alldefs = new HashSet(props_filtered);
      for (const fact of alldefs.difference(cls.default_assumptions).toArray()) {
        cls.default_assumptions.add(fact, cls[fact]);
      }
      const supers = Util.getSupers(cls);
      for (const supercls of supers) {
        const allProps = new HashSet(Object.getOwnPropertyNames(supercls).filter((prop) => prop.includes("is_")));
        const uniqueProps = allProps.difference(cls.default_assumptions).toArray();
        for (const fact of uniqueProps) {
          cls.default_assumptions.add(fact, supercls[fact]);
        }
      }
    }
  };
  ManagedProperties.all_explicit_assumptions = new HashDict();
  ManagedProperties.all_default_assumptions = new HashSet();

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

  // ts-port/testing.ts
  console.log(S.Infinity);
})();
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsiLi4vY29yZS91dGlsaXR5LnRzIiwgIi4uL2NvcmUvbG9naWMudHMiLCAiLi4vY29yZS9mYWN0cy50cyIsICIuLi9jb3JlL2NvcmUudHMiLCAiLi4vY29yZS9hc3N1bXB0aW9ucy50cyIsICIuLi9jb3JlL3NpbmdsZXRvbi50cyIsICIuLi90ZXN0aW5nLnRzIl0sCiAgInNvdXJjZXNDb250ZW50IjogWyIvKlxuQSBmaWxlIHdpdGggdXRpbGl0eSBjbGFzc2VzIGFuZCBmdW5jdGlvbnMgdG8gaGVscCB3aXRoIHBvcnRpbmdcbkRldmVsb3BkIGJ5IFdCIGFuZCBHTVxuKi9cblxuLy8gZ2VuZXJhbCB1dGlsIGZ1bmN0aW9uc1xuY2xhc3MgVXRpbCB7XG4gICAgLy8gaGFzaGtleSBmdW5jdGlvblxuICAgIC8vIHNob3VsZCBiZSBhYmxlIHRvIGhhbmRsZSBtdWx0aXBsZSB0eXBlcyBvZiBpbnB1dHNcbiAgICBzdGF0aWMgaGFzaEtleSh4OiBhbnkpOiBzdHJpbmcge1xuICAgICAgICBpZiAodHlwZW9mIHggPT09IFwidW5kZWZpbmVkXCIpIHtcbiAgICAgICAgICAgIHJldHVybiBcInVuZGVmaW5lZFwiO1xuICAgICAgICB9XG4gICAgICAgIGlmICh4Lmhhc2hLZXkpIHtcbiAgICAgICAgICAgIHJldHVybiB4Lmhhc2hLZXkoKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoQXJyYXkuaXNBcnJheSh4KSkge1xuICAgICAgICAgICAgcmV0dXJuIHgubWFwKChlKSA9PiBVdGlsLmhhc2hLZXkoZSkpLmpvaW4oXCIsXCIpO1xuICAgICAgICB9XG4gICAgICAgIGlmICh4ID09PSBudWxsKSB7XG4gICAgICAgICAgICByZXR1cm4gXCJudWxsXCI7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHgudG9TdHJpbmcoKTtcbiAgICB9XG5cbiAgICAvLyBjaGVjayBpZiBhcnIxIGlzIGEgc3Vic2V0IG9mIGFycjJcbiAgICBzdGF0aWMgaXNTdWJzZXQoYXJyMTogYW55W10sIGFycjI6IGFueVtdKTogYm9vbGVhbiB7XG4gICAgICAgIGNvbnN0IHRlbXBhcnIgPSBhcnIyLm1hcCgoaTogYW55KSA9PiBVdGlsLmhhc2hLZXkoaSkpXG4gICAgICAgIGZvciAoY29uc3QgZSBvZiBhcnIxKSB7XG4gICAgICAgICAgICBpZiAoIXRlbXBhcnIuaW5jbHVkZXMoVXRpbC5oYXNoS2V5KGUpKSkge1xuICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG5cbiAgICAvLyBjb252ZXJ0IGFuIGludGVnZXIgdG8gYmluYXJ5XG4gICAgLy8gZnVuY3Rpb25hbCBmb3IgbmVnYXRpdmUgbnVtYmVyc1xuICAgIHN0YXRpYyBiaW4obnVtOiBudW1iZXIpIHtcbiAgICAgICAgcmV0dXJuIChudW0gPj4+IDApLnRvU3RyaW5nKDIpO1xuICAgIH1cblxuICAgIHN0YXRpYyogcHJvZHVjdChyZXBlYXQ6IG51bWJlciA9IDEsIC4uLmFyZ3M6IGFueVtdKSB7XG4gICAgICAgIGNvbnN0IHRvQWRkOiBhbnlbXSA9IFtdO1xuICAgICAgICBmb3IgKGNvbnN0IGEgb2YgYXJncykge1xuICAgICAgICAgICAgdG9BZGQucHVzaChbYV0pO1xuICAgICAgICB9XG4gICAgICAgIGNvbnN0IHBvb2xzOiBhbnlbXSA9IFtdO1xuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHJlcGVhdDsgaSsrKSB7XG4gICAgICAgICAgICB0b0FkZC5mb3JFYWNoKChlOiBhbnkpID0+IHBvb2xzLnB1c2goZVswXSkpO1xuICAgICAgICB9XG4gICAgICAgIGxldCByZXM6IGFueVtdW10gPSBbW11dO1xuICAgICAgICBmb3IgKGNvbnN0IHBvb2wgb2YgcG9vbHMpIHtcbiAgICAgICAgICAgIGNvbnN0IHJlc190ZW1wOiBhbnlbXSA9IFtdO1xuICAgICAgICAgICAgZm9yIChjb25zdCB4IG9mIHJlcykge1xuICAgICAgICAgICAgICAgIGZvciAoY29uc3QgeSBvZiBwb29sKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmICh0eXBlb2YgeFswXSA9PT0gXCJ1bmRlZmluZWRcIikge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmVzX3RlbXAucHVzaChbeV0pO1xuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmVzX3RlbXAucHVzaCh4LmNvbmNhdCh5KSk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXMgPSByZXNfdGVtcDtcbiAgICAgICAgfVxuICAgICAgICBmb3IgKGNvbnN0IHByb2Qgb2YgcmVzKSB7XG4gICAgICAgICAgICB5aWVsZCBwcm9kO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgc3RhdGljKiBwZXJtdXRhdGlvbnMoaXRlcmFibGU6IGFueSwgcjogYW55ID0gdW5kZWZpbmVkKSB7XG4gICAgICAgIGNvbnN0IG4gPSBpdGVyYWJsZS5sZW5ndGg7XG4gICAgICAgIGlmICh0eXBlb2YgciA9PT0gXCJ1bmRlZmluZWRcIikge1xuICAgICAgICAgICAgciA9IG47XG4gICAgICAgIH1cbiAgICAgICAgY29uc3QgcmFuZ2UgPSB0aGlzLnJhbmdlKG4pO1xuICAgICAgICBmb3IgKGNvbnN0IGluZGljZXMgb2YgVXRpbC5wcm9kdWN0KHIsIHJhbmdlKSkge1xuICAgICAgICAgICAgaWYgKGluZGljZXMubGVuZ3RoID09PSByKSB7XG4gICAgICAgICAgICAgICAgY29uc3QgeTogYW55W10gPSBbXTtcbiAgICAgICAgICAgICAgICBmb3IgKGNvbnN0IGkgb2YgaW5kaWNlcykge1xuICAgICAgICAgICAgICAgICAgICB5LnB1c2goaXRlcmFibGVbaV0pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB5aWVsZCB5O1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgc3RhdGljKiBmcm9tX2l0ZXJhYmxlKGl0ZXJhYmxlczogYW55KSB7XG4gICAgICAgIGZvciAoY29uc3QgaXQgb2YgaXRlcmFibGVzKSB7XG4gICAgICAgICAgICBmb3IgKGNvbnN0IGVsZW1lbnQgb2YgaXQpIHtcbiAgICAgICAgICAgICAgICB5aWVsZCBlbGVtZW50O1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgc3RhdGljIGFyckVxKGFycjE6IGFueVtdLCBhcnIyOiBhbnkpIHtcbiAgICAgICAgaWYgKGFycjEubGVuZ3RoICE9PSBhcnIyLmxlbmd0aCkge1xuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9XG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgYXJyMS5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgaWYgKCEoYXJyMVtpXSA9PT0gYXJyMltpXSkpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuXG4gICAgc3RhdGljKiBjb21iaW5hdGlvbnMoaXRlcmFibGU6IGFueSwgcjogYW55KSB7XG4gICAgICAgIGNvbnN0IG4gPSBpdGVyYWJsZS5sZW5ndGg7XG4gICAgICAgIGNvbnN0IHJhbmdlID0gdGhpcy5yYW5nZShuKTtcbiAgICAgICAgZm9yIChjb25zdCBpbmRpY2VzIG9mIFV0aWwucGVybXV0YXRpb25zKHJhbmdlLCByKSkge1xuICAgICAgICAgICAgaWYgKFV0aWwuYXJyRXEoaW5kaWNlcy5zb3J0KGZ1bmN0aW9uKGEsIGIpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gYSAtIGI7XG4gICAgICAgICAgICB9KSwgaW5kaWNlcykpIHtcbiAgICAgICAgICAgICAgICBjb25zdCByZXM6IGFueVtdID0gW107XG4gICAgICAgICAgICAgICAgZm9yIChjb25zdCBpIG9mIGluZGljZXMpIHtcbiAgICAgICAgICAgICAgICAgICAgcmVzLnB1c2goaXRlcmFibGVbaV0pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB5aWVsZCByZXM7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBzdGF0aWMqIGNvbWJpbmF0aW9uc193aXRoX3JlcGxhY2VtZW50KGl0ZXJhYmxlOiBhbnksIHI6IGFueSkge1xuICAgICAgICBjb25zdCBuID0gaXRlcmFibGUubGVuZ3RoO1xuICAgICAgICBjb25zdCByYW5nZSA9IHRoaXMucmFuZ2Uobik7XG4gICAgICAgIGZvciAoY29uc3QgaW5kaWNlcyBvZiBVdGlsLnByb2R1Y3QociwgcmFuZ2UpKSB7XG4gICAgICAgICAgICBpZiAoVXRpbC5hcnJFcShpbmRpY2VzLnNvcnQoZnVuY3Rpb24oYSwgYikge1xuICAgICAgICAgICAgICAgIHJldHVybiBhIC0gYjtcbiAgICAgICAgICAgIH0pLCBpbmRpY2VzKSkge1xuICAgICAgICAgICAgICAgIGNvbnN0IHJlczogYW55W10gPSBbXTtcbiAgICAgICAgICAgICAgICBmb3IgKGNvbnN0IGkgb2YgaW5kaWNlcykge1xuICAgICAgICAgICAgICAgICAgICByZXMucHVzaChpdGVyYWJsZVtpXSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHlpZWxkIHJlcztcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgIHN0YXRpYyB6aXAoYXJyMTogYW55W10sIGFycjI6IGFueVtdLCBmaWxsdmFsdWU6IHN0cmluZyA9IFwiLVwiKSB7XG4gICAgICAgIGNvbnN0IHJlcyA9IGFycjEubWFwKGZ1bmN0aW9uKGUsIGkpIHtcbiAgICAgICAgICAgIHJldHVybiBbZSwgYXJyMltpXV07XG4gICAgICAgIH0pO1xuICAgICAgICByZXMuZm9yRWFjaCgoemlwOiBhbnkpID0+IHtcbiAgICAgICAgICAgIGlmICh6aXAuaW5jbHVkZXModW5kZWZpbmVkKSkge1xuICAgICAgICAgICAgICAgIHppcC5zcGxpY2UoMSwgMSwgZmlsbHZhbHVlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICAgIHJldHVybiByZXM7XG4gICAgfVxuXG4gICAgc3RhdGljIHJhbmdlKG46IG51bWJlcikge1xuICAgICAgICByZXR1cm4gbmV3IEFycmF5KG4pLmZpbGwoMCkubWFwKChfLCBpZHgpID0+IGlkeCk7XG4gICAgfVxuXG4gICAgc3RhdGljIGdldEFyckluZGV4KGFycjJkOiBhbnlbXVtdLCBhcnI6IGFueVtdKSB7XG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgYXJyMmQubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIGlmIChVdGlsLmFyckVxKGFycjJkW2ldLCBhcnIpKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgICB9XG5cbiAgICBzdGF0aWMgZ2V0U3VwZXJzKGNsczogYW55KTogYW55W10ge1xuICAgICAgICBjb25zdCBzdXBlcmNsYXNzZXMgPSBbXTtcbiAgICAgICAgY29uc3Qgc3VwZXJjbGFzcyA9IE9iamVjdC5nZXRQcm90b3R5cGVPZihjbHMpO1xuICAgICAgXG4gICAgICAgIGlmIChzdXBlcmNsYXNzICE9PSBudWxsICYmIHN1cGVyY2xhc3MgIT09IE9iamVjdC5wcm90b3R5cGUpIHtcbiAgICAgICAgICAgIHN1cGVyY2xhc3Nlcy5wdXNoKHN1cGVyY2xhc3MpO1xuICAgICAgICAgICAgY29uc3QgcGFyZW50U3VwZXJjbGFzc2VzID0gVXRpbC5nZXRTdXBlcnMoc3VwZXJjbGFzcyk7XG4gICAgICAgICAgICBzdXBlcmNsYXNzZXMucHVzaCguLi5wYXJlbnRTdXBlcmNsYXNzZXMpO1xuICAgICAgICB9XG4gICAgICBcbiAgICAgICAgcmV0dXJuIHN1cGVyY2xhc3NlcztcbiAgICB9XG5cbiAgICBzdGF0aWMgc2h1ZmZsZUFycmF5KGFycjogYW55W10pIHtcbiAgICAgICAgZm9yIChsZXQgaSA9IGFyci5sZW5ndGggLSAxOyBpID4gMDsgaS0tKSB7XG4gICAgICAgICAgICBjb25zdCBqID0gTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogKGkgKyAxKSk7XG4gICAgICAgICAgICBjb25zdCB0ZW1wID0gYXJyW2ldO1xuICAgICAgICAgICAgYXJyW2ldID0gYXJyW2pdO1xuICAgICAgICAgICAgYXJyW2pdID0gdGVtcDtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHN0YXRpYyBhcnJNdWwoYXJyOiBhbnlbXSwgbjogbnVtYmVyKSB7XG4gICAgICAgIGNvbnN0IHJlcyA9IFtdO1xuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IG47IGkrKykge1xuICAgICAgICAgICAgcmVzLnB1c2goYXJyKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gcmVzO1xuICAgIH1cblxuICAgIHN0YXRpYyBhc3NpZ25FbGVtZW50cyhhcnI6IGFueVtdLCBuZXd2YWxzOiBhbnlbXSwgc3RhcnQ6IG51bWJlciwgc3RlcDogbnVtYmVyKSB7XG4gICAgICAgIGxldCBjb3VudCA9IDA7XG4gICAgICAgIGZvciAobGV0IGkgPSBzdGFydDsgaSA8IGFyci5sZW5ndGg7IGkrPXN0ZXApIHtcbiAgICAgICAgICAgIGFycltpXSA9IG5ld3ZhbHNbY291bnRdO1xuICAgICAgICAgICAgY291bnQrKztcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHN0YXRpYyBzcGxpdExvZ2ljU3RyKHN0cjogc3RyaW5nKTogYW55W10ge1xuICAgICAgICBjb25zdCBzZXAgPSBcIiBcIjtcbiAgICAgICAgY29uc3QgbWF4X3NwbGl0cyA9IDM7XG4gICAgICAgIFxuICAgICAgICBjb25zdCBvcmlnX3NwbGl0ID0gc3RyLnNwbGl0KFwiIFwiLCAxMClcbiAgICAgICAgaWYgKG9yaWdfc3BsaXQubGVuZ3RoID09IDMpIHtcbiAgICAgICAgICAgIHJldHVybiBvcmlnX3NwbGl0O1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgbGV0IG5ld19pdGVtOiBzdHJpbmcgPSBcIlwiO1xuICAgICAgICAgICAgZm9yIChsZXQgaSA9IDI7IGkgPCBvcmlnX3NwbGl0Lmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgbmV3X2l0ZW0gKz0gb3JpZ19zcGxpdFtpXSArIFwiIFwiO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIFtvcmlnX3NwbGl0WzBdLCBvcmlnX3NwbGl0WzFdLCBuZXdfaXRlbS5zbGljZSgwLCAtMSldO1xuICAgICAgICB9XG4gICAgfVxufVxuXG4vLyBjdXN0b20gdmVyc2lvbiBvZiB0aGUgU2V0IGNsYXNzXG4vLyBuZWVkZWQgc2luY2Ugc3ltcHkgcmVsaWVzIG9uIGl0ZW0gdHVwbGVzIHdpdGggZXF1YWwgY29udGVudHMgYmVpbmcgbWFwcGVkXG4vLyB0byB0aGUgc2FtZSBlbnRyeVxuY2xhc3MgSGFzaFNldCB7XG4gICAgZGljdDogUmVjb3JkPHN0cmluZywgYW55PjtcbiAgICBzaXplOiBudW1iZXI7XG4gICAgc29ydGVkQXJyOiBhbnlbXTtcblxuICAgIGNvbnN0cnVjdG9yKGFycj86IGFueVtdKSB7XG4gICAgICAgIHRoaXMuc2l6ZSA9IDA7XG4gICAgICAgIHRoaXMuZGljdCA9IHt9O1xuICAgICAgICBpZiAoYXJyKSB7XG4gICAgICAgICAgICBBcnJheS5mcm9tKGFycikuZm9yRWFjaCgoZWxlbWVudCkgPT4ge1xuICAgICAgICAgICAgICAgIHRoaXMuYWRkKGVsZW1lbnQpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBjbG9uZSgpOiBIYXNoU2V0IHtcbiAgICAgICAgY29uc3QgbmV3c2V0OiBIYXNoU2V0ID0gbmV3IEhhc2hTZXQoKTtcbiAgICAgICAgZm9yIChjb25zdCBpdGVtIG9mIE9iamVjdC52YWx1ZXModGhpcy5kaWN0KSkge1xuICAgICAgICAgICAgbmV3c2V0LmFkZChpdGVtKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gbmV3c2V0O1xuICAgIH1cblxuICAgIGVuY29kZShpdGVtOiBhbnkpOiBzdHJpbmcge1xuICAgICAgICByZXR1cm4gVXRpbC5oYXNoS2V5KGl0ZW0pO1xuICAgIH1cblxuICAgIGFkZChpdGVtOiBhbnkpIHtcbiAgICAgICAgY29uc3Qga2V5ID0gdGhpcy5lbmNvZGUoaXRlbSk7XG4gICAgICAgIGlmICghKGtleSBpbiB0aGlzLmRpY3QpKSB7XG4gICAgICAgICAgICB0aGlzLnNpemUrKztcbiAgICAgICAgfTtcbiAgICAgICAgdGhpcy5kaWN0W2tleV0gPSBpdGVtO1xuICAgIH1cblxuICAgIGFkZEFycihhcnI6IGFueVtdKSB7XG4gICAgICAgIGZvciAoY29uc3QgZSBvZiBhcnIpIHtcbiAgICAgICAgICAgIHRoaXMuYWRkKGUpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgaGFzKGl0ZW06IGFueSkge1xuICAgICAgICByZXR1cm4gdGhpcy5lbmNvZGUoaXRlbSkgaW4gdGhpcy5kaWN0O1xuICAgIH1cblxuICAgIHRvQXJyYXkoKSB7XG4gICAgICAgIHJldHVybiBPYmplY3QudmFsdWVzKHRoaXMuZGljdCk7XG4gICAgfVxuXG4gICAgLy8gZ2V0IHRoZSBoYXNoa2V5IGZvciB0aGlzIHNldCAoZS5nLiwgaW4gYSBkaWN0aW9uYXJ5KVxuICAgIGhhc2hLZXkoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLnRvQXJyYXkoKVxuICAgICAgICAgICAgLm1hcCgoZSkgPT4gVXRpbC5oYXNoS2V5KGUpKVxuICAgICAgICAgICAgLnNvcnQoKVxuICAgICAgICAgICAgLmpvaW4oXCIsXCIpO1xuICAgIH1cblxuICAgIGlzRW1wdHkoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLnNpemUgPT09IDA7XG4gICAgfVxuXG4gICAgcmVtb3ZlKGl0ZW06IGFueSkge1xuICAgICAgICB0aGlzLnNpemUtLTtcbiAgICAgICAgZGVsZXRlIHRoaXMuZGljdFt0aGlzLmVuY29kZShpdGVtKV07XG4gICAgfVxuXG4gICAgZ2V0KGtleTogYW55KSB7XG4gICAgICAgIHJldHVybiB0aGlzLmRpY3RbVXRpbC5oYXNoS2V5KGtleSldO1xuICAgIH1cblxuICAgIHNldChrZXk6IGFueSwgdmFsOiBhbnkpIHtcbiAgICAgICAgdGhpcy5kaWN0W1V0aWwuaGFzaEtleShrZXkpXSA9IHZhbDtcbiAgICB9XG5cbiAgICBzb3J0KGtleWZ1bmM6IGFueSA9ICgoYTogYW55LCBiOiBhbnkpID0+IGEgLSBiKSwgcmV2ZXJzZTogYm9vbGVhbiA9IHRydWUpIHtcbiAgICAgICAgdGhpcy5zb3J0ZWRBcnIgPSB0aGlzLnRvQXJyYXkoKTtcbiAgICAgICAgdGhpcy5zb3J0ZWRBcnIuc29ydChrZXlmdW5jKTtcbiAgICAgICAgaWYgKHJldmVyc2UpIHtcbiAgICAgICAgICAgIHRoaXMuc29ydGVkQXJyLnJldmVyc2UoKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHBvcCgpIHtcbiAgICAgICAgdGhpcy5zb3J0KCk7IC8vICEhISBzbG93IGJ1dCBJIGRvbid0IHNlZSBhIHdvcmsgYXJvdW5kXG4gICAgICAgIGlmICh0aGlzLnNvcnRlZEFyci5sZW5ndGggPj0gMSkge1xuICAgICAgICAgICAgY29uc3QgdGVtcCA9IHRoaXMuc29ydGVkQXJyW3RoaXMuc29ydGVkQXJyLmxlbmd0aCAtIDFdO1xuICAgICAgICAgICAgdGhpcy5yZW1vdmUodGVtcCk7XG4gICAgICAgICAgICByZXR1cm4gdGVtcDtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiB1bmRlZmluZWQ7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBkaWZmZXJlbmNlKG90aGVyOiBIYXNoU2V0KSB7XG4gICAgICAgIGNvbnN0IHJlcyA9IG5ldyBIYXNoU2V0KCk7XG4gICAgICAgIGZvciAoY29uc3QgaSBvZiB0aGlzLnRvQXJyYXkoKSkge1xuICAgICAgICAgICAgaWYgKCEob3RoZXIuaGFzKGkpKSkge1xuICAgICAgICAgICAgICAgIHJlcy5hZGQoaSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHJlcztcbiAgICB9XG5cbiAgICBpbnRlcnNlY3RzKG90aGVyOiBIYXNoU2V0KSB7XG4gICAgICAgIGZvciAoY29uc3QgaSBvZiB0aGlzLnRvQXJyYXkoKSkge1xuICAgICAgICAgICAgaWYgKG90aGVyLmhhcyhpKSkge1xuICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG59XG5cbi8vIGEgaGFzaGRpY3QgY2xhc3MgcmVwbGFjaW5nIHRoZSBkaWN0IGNsYXNzIGluIHB5dGhvblxuY2xhc3MgSGFzaERpY3Qge1xuICAgIHNpemU6IG51bWJlcjtcbiAgICBkaWN0OiBSZWNvcmQ8YW55LCBhbnk+O1xuXG4gICAgY29uc3RydWN0b3IoZDogUmVjb3JkPGFueSwgYW55PiA9IHt9KSB7XG4gICAgICAgIHRoaXMuc2l6ZSA9IDA7XG4gICAgICAgIHRoaXMuZGljdCA9IHt9O1xuICAgICAgICBmb3IgKGNvbnN0IGl0ZW0gb2YgT2JqZWN0LmVudHJpZXMoZCkpIHtcbiAgICAgICAgICAgIHRoaXMuZGljdFtVdGlsLmhhc2hLZXkoaXRlbVswXSldID0gW2l0ZW1bMF0sIGl0ZW1bMV1dO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgY2xvbmUoKSB7XG4gICAgICAgIHJldHVybiBuZXcgSGFzaERpY3QodGhpcy5kaWN0KTtcbiAgICB9XG5cbiAgICByZW1vdmUoaXRlbTogYW55KSB7XG4gICAgICAgIHRoaXMuc2l6ZS0tO1xuICAgICAgICBkZWxldGUgdGhpcy5kaWN0W1V0aWwuaGFzaEtleShpdGVtKV07XG4gICAgfVxuXG4gICAgc2V0ZGVmYXVsdChrZXk6IGFueSwgdmFsdWU6IGFueSkge1xuICAgICAgICBpZiAodGhpcy5oYXMoa2V5KSkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuZ2V0KGtleSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aGlzLmFkZChrZXksIHZhbHVlKTtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmdldChrZXkpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgZ2V0KGtleTogYW55LCBkZWY6IGFueSA9IHVuZGVmaW5lZCk6IGFueSB7XG4gICAgICAgIGNvbnN0IGhhc2ggPSBVdGlsLmhhc2hLZXkoa2V5KTtcbiAgICAgICAgaWYgKGhhc2ggaW4gdGhpcy5kaWN0KSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5kaWN0W2hhc2hdWzFdO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBkZWY7XG4gICAgfVxuXG4gICAgaGFzKGtleTogYW55KTogYm9vbGVhbiB7XG4gICAgICAgIGNvbnN0IGhhc2hLZXkgPSBVdGlsLmhhc2hLZXkoa2V5KTtcbiAgICAgICAgcmV0dXJuIGhhc2hLZXkgaW4gdGhpcy5kaWN0O1xuICAgIH1cblxuICAgIGFkZChrZXk6IGFueSwgdmFsdWU6IGFueSkge1xuICAgICAgICBjb25zdCBrZXlIYXNoID0gVXRpbC5oYXNoS2V5KGtleSk7XG4gICAgICAgIGlmICghKGtleUhhc2ggaW4gT2JqZWN0LmtleXModGhpcy5kaWN0KSkpIHtcbiAgICAgICAgICAgIHRoaXMuc2l6ZSsrO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuZGljdFtrZXlIYXNoXSA9IFtrZXksIHZhbHVlXTtcbiAgICB9XG5cbiAgICBrZXlzKCkge1xuICAgICAgICBjb25zdCB2YWxzID0gT2JqZWN0LnZhbHVlcyh0aGlzLmRpY3QpO1xuICAgICAgICByZXR1cm4gdmFscy5tYXAoKGUpID0+IGVbMF0pO1xuICAgIH1cblxuICAgIHZhbHVlcygpIHtcbiAgICAgICAgY29uc3QgdmFscyA9IE9iamVjdC52YWx1ZXModGhpcy5kaWN0KTtcbiAgICAgICAgcmV0dXJuIHZhbHMubWFwKChlKSA9PiBlWzFdKTtcbiAgICB9XG5cbiAgICBlbnRyaWVzKCkge1xuICAgICAgICByZXR1cm4gT2JqZWN0LnZhbHVlcyh0aGlzLmRpY3QpO1xuICAgIH1cblxuICAgIGFkZEFycihhcnI6IGFueVtdKSB7XG4gICAgICAgIGNvbnN0IGtleUhhc2ggPSBVdGlsLmhhc2hLZXkoYXJyWzBdKTtcbiAgICAgICAgdGhpcy5kaWN0W2tleUhhc2hdID0gYXJyO1xuICAgIH1cblxuICAgIGRlbGV0ZShrZXk6IGFueSkge1xuICAgICAgICBjb25zdCBrZXloYXNoID0gVXRpbC5oYXNoS2V5KGtleSk7XG4gICAgICAgIGlmIChrZXloYXNoIGluIHRoaXMuZGljdCkge1xuICAgICAgICAgICAgdGhpcy5zaXplLS07XG4gICAgICAgICAgICBkZWxldGUgdGhpcy5kaWN0W2tleWhhc2hdO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgbWVyZ2Uob3RoZXI6IEhhc2hEaWN0KSB7XG4gICAgICAgIGZvciAoY29uc3QgaXRlbSBvZiBvdGhlci5lbnRyaWVzKCkpIHtcbiAgICAgICAgICAgIHRoaXMuYWRkKGl0ZW1bMF0sIGl0ZW1bMV0pO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgY29weSgpIHtcbiAgICAgICAgY29uc3QgcmVzOiBIYXNoRGljdCA9IG5ldyBIYXNoRGljdCgpO1xuICAgICAgICBmb3IgKGNvbnN0IGl0ZW0gb2YgdGhpcy5lbnRyaWVzKCkpIHtcbiAgICAgICAgICAgIHJlcy5hZGQoaXRlbVswXSwgaXRlbVsxXSk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHJlcztcbiAgICB9XG5cbiAgICBpc1NhbWUob3RoZXI6IEhhc2hEaWN0KSB7XG4gICAgICAgIGNvbnN0IGFycjEgPSB0aGlzLmVudHJpZXMoKS5zb3J0KCk7XG4gICAgICAgIGNvbnN0IGFycjIgPSBvdGhlci5lbnRyaWVzKCkuc29ydCgpO1xuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGFycjEubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIGlmICghKFV0aWwuYXJyRXEoYXJyMVtpXSwgYXJyMltpXSkpKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cblxuICAgIGZhY3RvcnNUb1N0cmluZygpIHtcbiAgICAgICAgbGV0IG51bWVyYXRvciA9IFwiXCI7XG4gICAgICAgIGxldCBkZW5vbWluYXRvciA9IFwiXCI7XG4gICAgICAgIGZvciAoY29uc3QgW2ZhY3RvciwgZXhwXSBvZiB0aGlzLmVudHJpZXMoKSkge1xuICAgICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBNYXRoLmFicyhleHApOyBpKyspIHtcbiAgICAgICAgICAgICAgICBpZiAoZXhwIDwgMCkge1xuICAgICAgICAgICAgICAgICAgICBkZW5vbWluYXRvciArPSAoZmFjdG9yLnRvU3RyaW5nKCkgKyBcIipcIilcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBudW1lcmF0b3IgKz0gKGZhY3Rvci50b1N0cmluZygpICsgXCIqXCIpXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGlmIChkZW5vbWluYXRvci5sZW5ndGggPT0gMCkge1xuICAgICAgICAgICAgcmV0dXJuIG51bWVyYXRvci5zbGljZSgwLCAtMSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gbnVtZXJhdG9yLnNsaWNlKDAsIC0xKSArIFwiL1wiICsgZGVub21pbmF0b3Iuc2xpY2UoMCwgLTEpO1xuICAgICAgICB9XG4gICAgfVxufVxuXG5cbi8vIHN5bXB5IG9mdGVuIHVzZXMgZGVmYXVsdGRpY3Qoc2V0KSB3aGljaCBpcyBub3QgYXZhaWxhYmxlIGluIHRzXG4vLyB3ZSBjcmVhdGUgYSByZXBsYWNlbWVudCBkaWN0aW9uYXJ5IGNsYXNzIHdoaWNoIHJldHVybnMgYW4gZW1wdHkgc2V0XG4vLyBpZiB0aGUga2V5IHVzZWQgaXMgbm90IGluIHRoZSBkaWN0aW9uYXJ5XG5jbGFzcyBTZXREZWZhdWx0RGljdCBleHRlbmRzIEhhc2hEaWN0IHtcbiAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICAgICAgc3VwZXIoKTtcbiAgICB9XG5cbiAgICBnZXQoa2V5OiBhbnkpIHtcbiAgICAgICAgY29uc3Qga2V5SGFzaCA9IFV0aWwuaGFzaEtleShrZXkpO1xuICAgICAgICBpZiAoa2V5SGFzaCBpbiB0aGlzLmRpY3QpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmRpY3Rba2V5SGFzaF1bMV07XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIG5ldyBIYXNoU2V0KCk7XG4gICAgfVxufVxuXG5jbGFzcyBJbnREZWZhdWx0RGljdCBleHRlbmRzIEhhc2hEaWN0IHtcbiAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICAgICAgc3VwZXIoKTtcbiAgICB9XG5cbiAgICBpbmNyZW1lbnQoa2V5OiBhbnksIHZhbDogYW55KSB7XG4gICAgICAgIGNvbnN0IGtleUhhc2ggPSBVdGlsLmhhc2hLZXkoa2V5KTtcbiAgICAgICAgaWYgKGtleUhhc2ggaW4gdGhpcy5kaWN0KSB7XG4gICAgICAgICAgICB0aGlzLmRpY3Rba2V5SGFzaF0gKz0gdmFsO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5kaWN0W2tleUhhc2hdID0gMDtcbiAgICAgICAgICAgIHRoaXMuZGljdFtrZXlIYXNoXSArPSB2YWw7XG4gICAgICAgIH1cbiAgICB9XG59XG5cbmNsYXNzIEFyckRlZmF1bHREaWN0IGV4dGVuZHMgSGFzaERpY3Qge1xuICAgIGNvbnN0cnVjdG9yKCkge1xuICAgICAgICBzdXBlcigpO1xuICAgIH1cblxuICAgIGdldChrZXk6IGFueSkge1xuICAgICAgICBjb25zdCBrZXlIYXNoID0gVXRpbC5oYXNoS2V5KGtleSk7XG4gICAgICAgIGlmIChrZXlIYXNoIGluIHRoaXMuZGljdCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuZGljdFtrZXlIYXNoXVsxXTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gW107XG4gICAgfVxufVxuXG5cbi8vIGFuIGltcGxpY2F0aW9uIGNsYXNzIHVzZWQgYXMgYW4gYWx0ZXJuYXRpdmUgdG8gdHVwbGVzIGluIHN5bXB5XG5jbGFzcyBJbXBsaWNhdGlvbiB7XG4gICAgcDtcbiAgICBxO1xuXG4gICAgY29uc3RydWN0b3IocDogYW55LCBxOiBhbnkpIHtcbiAgICAgICAgdGhpcy5wID0gcDtcbiAgICAgICAgdGhpcy5xID0gcTtcbiAgICB9XG5cbiAgICBoYXNoS2V5KCkge1xuICAgICAgICByZXR1cm4gKHRoaXMucCBhcyBzdHJpbmcpICsgKHRoaXMucSBhcyBzdHJpbmcpO1xuICAgIH1cbn1cblxuXG4vLyBhbiBMUlUgY2FjaGUgaW1wbGVtZW50YXRpb24gdXNlZCBmb3IgY2FjaGUudHNcblxuaW50ZXJmYWNlIE5vZGUge1xuICAgIGtleTogYW55O1xuICAgIHZhbHVlOiBhbnk7XG4gICAgcHJldjogYW55O1xuICAgIG5leHQ6IGFueTtcbn1cblxuY2xhc3MgTFJVQ2FjaGUge1xuICAgIGNhcGFjaXR5OiBudW1iZXI7XG4gICAgbWFwOiBIYXNoRGljdDtcbiAgICBoZWFkOiBhbnk7XG4gICAgdGFpbDogYW55O1xuXG4gICAgY29uc3RydWN0b3IoY2FwYWNpdHk6IG51bWJlcikge1xuICAgICAgICB0aGlzLmNhcGFjaXR5ID0gY2FwYWNpdHk7XG4gICAgICAgIHRoaXMubWFwID0gbmV3IEhhc2hEaWN0KCk7XG5cbiAgICAgICAgLy8gdGhlc2UgYXJlIGJvdW5kYXJpZXMgZm9yIHRoZSBkb3VibGUgbGlua2VkIGxpc3RcbiAgICAgICAgdGhpcy5oZWFkID0ge307XG4gICAgICAgIHRoaXMudGFpbCA9IHt9O1xuXG4gICAgICAgIHRoaXMuaGVhZC5uZXh0ID0gdGhpcy5oZWFkO1xuICAgICAgICB0aGlzLnRhaWwucHJldiA9IHRoaXMuaGVhZDtcbiAgICB9XG5cbiAgICBnZXQoa2V5OiBhbnkpIHtcbiAgICAgICAgaWYgKHRoaXMubWFwLmhhcyhrZXkpKSB7XG4gICAgICAgICAgICAvLyByZW1vdmUgZWxlbWVudCBmcm9tIHRoZSBjdXJyZW50IHBvc2l0aW9uXG4gICAgICAgICAgICBjb25zdCBjID0gdGhpcy5tYXAuZ2V0KGtleSk7XG4gICAgICAgICAgICBjLnByZXYubmV4dCA9IGMubmV4dDtcbiAgICAgICAgICAgIGMubmV4dC5wcmV2ID0gYy5wcmV2O1xuXG4gICAgICAgICAgICB0aGlzLnRhaWwucHJldi5uZXh0ID0gYzsgLy8gaW5zZXJ0IGFmdGVyIGxhc3QgZWxlbWVudFxuICAgICAgICAgICAgYy5wcmV2ID0gdGhpcy50YWlsLnByZXY7XG4gICAgICAgICAgICBjLm5leHQgPSB0aGlzLnRhaWw7XG4gICAgICAgICAgICB0aGlzLnRhaWwucHJldiA9IGM7XG5cbiAgICAgICAgICAgIHJldHVybiBjLnZhbHVlO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuIHVuZGVmaW5lZDsgLy8gaW52YWxpZCBrZXlcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHB1dChrZXk6IGFueSwgdmFsdWU6IGFueSkge1xuICAgICAgICBpZiAodHlwZW9mIHRoaXMuZ2V0KGtleSkgIT09IFwidW5kZWZpbmVkXCIpIHsgLy8gdGhlIGtleSBpcyBpbnZhbGlkXG4gICAgICAgICAgICB0aGlzLnRhaWwucHJldi52YWx1ZSA9IHZhbHVlO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgLy8gY2hlY2sgZm9yIGNhcGFjaXR5XG4gICAgICAgICAgICBpZiAodGhpcy5tYXAuc2l6ZSA9PT0gdGhpcy5jYXBhY2l0eSkge1xuICAgICAgICAgICAgICAgIHRoaXMubWFwLmRlbGV0ZSh0aGlzLmhlYWQubmV4dC5rZXkpOyAvLyBkZWxldGUgZmlyc3QgZWxlbWVudFxuICAgICAgICAgICAgICAgIHRoaXMuaGVhZC5uZXh0ID0gdGhpcy5oZWFkLm5leHQubmV4dDsgLy8gcmVwbGFjZSB3aXRoIG5leHRcbiAgICAgICAgICAgICAgICB0aGlzLmhlYWQubmV4dC5wcmV2ID0gdGhpcy5oZWFkO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGNvbnN0IG5ld05vZGU6IE5vZGUgPSB7XG4gICAgICAgICAgICB2YWx1ZSxcbiAgICAgICAgICAgIGtleSxcbiAgICAgICAgICAgIHByZXY6IG51bGwsXG4gICAgICAgICAgICBuZXh0OiBudWxsLFxuICAgICAgICB9OyAvLyBlYWNoIG5vZGUgaXMgYSBoYXNoIGVudHJ5XG5cbiAgICAgICAgLy8gd2hlbiBhZGRpbmcgYSBuZXcgbm9kZSwgd2UgbmVlZCB0byB1cGRhdGUgYm90aCBtYXAgYW5kIERMTFxuICAgICAgICB0aGlzLm1hcC5hZGQoa2V5LCBuZXdOb2RlKTsgLy8gYWRkIHRoZSBjdXJyZW50IG5vZGVcbiAgICAgICAgdGhpcy50YWlsLnByZXYubmV4dCA9IG5ld05vZGU7IC8vIGFkZCBub2RlIHRvIHRoZSBlbmRcbiAgICAgICAgbmV3Tm9kZS5wcmV2ID0gdGhpcy50YWlsLnByZXY7XG4gICAgICAgIG5ld05vZGUubmV4dCA9IHRoaXMudGFpbDtcbiAgICAgICAgdGhpcy50YWlsLnByZXYgPSBuZXdOb2RlO1xuICAgIH1cbn1cblxuY2xhc3MgSXRlcmF0b3Ige1xuICAgIGFycjogYW55W107XG4gICAgY291bnRlcjtcblxuICAgIGNvbnN0cnVjdG9yKGFycjogYW55W10pIHtcbiAgICAgICAgdGhpcy5hcnIgPSBhcnI7XG4gICAgICAgIHRoaXMuY291bnRlciA9IDA7XG4gICAgfVxuXG4gICAgbmV4dCgpIHtcbiAgICAgICAgaWYgKHRoaXMuY291bnRlciA+PSB0aGlzLmFyci5sZW5ndGgpIHtcbiAgICAgICAgICAgIHJldHVybiB1bmRlZmluZWQ7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5jb3VudGVyKys7XG4gICAgICAgIHJldHVybiB0aGlzLmFyclt0aGlzLmNvdW50ZXItMV07XG4gICAgfVxufVxuXG4vLyBtaXhpbiBjbGFzcyB1c2VkIHRvIHJlcGxpY2F0ZSBtdWx0aXBsZSBpbmhlcml0YW5jZVxuXG5jbGFzcyBNaXhpbkJ1aWxkZXIge1xuICAgIHN1cGVyY2xhc3M7XG4gICAgY29uc3RydWN0b3Ioc3VwZXJjbGFzczogYW55KSB7XG4gICAgICAgIHRoaXMuc3VwZXJjbGFzcyA9IHN1cGVyY2xhc3M7XG4gICAgfVxuICAgIHdpdGgoLi4ubWl4aW5zOiBhbnlbXSkge1xuICAgICAgICByZXR1cm4gbWl4aW5zLnJlZHVjZSgoYywgbWl4aW4pID0+IG1peGluKGMpLCB0aGlzLnN1cGVyY2xhc3MpO1xuICAgIH1cbn1cblxuY2xhc3MgYmFzZSB7fVxuXG5jb25zdCBtaXggPSAoc3VwZXJjbGFzczogYW55KSA9PiBuZXcgTWl4aW5CdWlsZGVyKHN1cGVyY2xhc3MpO1xuXG5cbmV4cG9ydCB7VXRpbCwgSGFzaFNldCwgU2V0RGVmYXVsdERpY3QsIEhhc2hEaWN0LCBJbXBsaWNhdGlvbiwgTFJVQ2FjaGUsIEl0ZXJhdG9yLCBJbnREZWZhdWx0RGljdCwgQXJyRGVmYXVsdERpY3QsIG1peCwgYmFzZX07XG5cbiIsICIvKiBlc2xpbnQtZGlzYWJsZSBuZXctY2FwICovXG4vKiBlc2xpbnQtZGlzYWJsZSBuby11bnVzZWQtdmFycyAqL1xuLypcblxuTm90YWJsZSBjaG5hZ2VzIG1hZGUgKFdCICYgR00pOlxuLSBOdWxsIGlzIGJlaW5nIHVzZWQgYXMgYSB0aGlyZCBib29sZWFuIHZhbHVlIGluc3RlYWQgb2YgJ25vbmUnXG4tIEFycmF5cyBhcmUgYmVpbmcgdXNlZCBpbnN0ZWFkIG9mIHR1cGxlc1xuLSBUaGUgbWV0aG9kcyBoYXNoS2V5KCkgYW5kIHRvU3RyaW5nKCkgYXJlIGFkZGVkIHRvIExvZ2ljIGZvciBoYXNoaW5nLiBUaGVcbiAgc3RhdGljIG1ldGhvZCBoYXNoS2V5KCkgaXMgYWxzbyBhZGRlZCB0byBMb2dpYyBhbmQgaGFzaGVzIGRlcGVuZGluZyBvbiB0aGUgaW5wdXQuXG4tIFRoZSBhcnJheSBhcmdzIGluIHRoZSBBbmRPcl9CYXNlIGNvbnN0cnVjdG9yIGlzIG5vdCBzb3J0ZWQgb3IgcHV0IGluIGEgc2V0XG4gIHNpbmNlIHdlIGRpZCd0IHNlZSB3aHkgdGhpcyB3b3VsZCBiZSBuZWNlc2FyeVxuLSBBIGNvbnN0cnVjdG9yIGlzIGFkZGVkIHRvIHRoZSBsb2dpYyBjbGFzcywgd2hpY2ggaXMgdXNlZCBieSBMb2dpYyBhbmQgaXRzXG4gIHN1YmNsYXNzZXMgKEFuZE9yX0Jhc2UsIEFuZCwgT3IsIE5vdClcbi0gSW4gdGhlIGZsYXR0ZW4gbWV0aG9kIG9mIEFuZE9yX0Jhc2Ugd2UgcmVtb3ZlZCB0aGUgdHJ5IGNhdGNoIGFuZCBjaGFuZ2VkIHRoZVxuICB3aGlsZSBsb29wIHRvIGRlcGVuZCBvbiB0aGUgbGVnbnRoIG9mIHRoZSBhcmdzIGFycmF5XG4tIEFkZGVkIGV4cGFuZCgpIGFuZCBldmFsX3Byb3BhZ2F0ZV9ub3QgYXMgYWJzdHJhY3QgbWV0aG9kcyB0byB0aGUgTG9naWMgY2xhc3Ncbi0gQWRkZWQgc3RhdGljIE5ldyBtZXRob2RzIHRvIE5vdCwgQW5kLCBhbmQgT3Igd2hpY2ggZnVuY3Rpb24gYXMgY29uc3RydWN0b3JzXG4tIFJlcGxhY2VtZCBub3JtYWwgYm9vbGVhbnMgd2l0aCBMb2dpYy5UcnVlIGFuZCBMb2dpYy5GYWxzZSBzaW5jZSBpdCBpcyBzb21ldGltZXNcbm5lY2VzYXJ5IHRvIGZpbmQgaWYgYSBnaXZlbiBhcmd1bWVuZXQgaXMgYSBib29sZWFuXG4tIEFkZGVkIHNvbWUgdjIgbWV0aG9kcyB3aGljaCByZXR1cm4gdHJ1ZSwgZmFsc2UsIGFuZCB1bmRlZmluZWQsIHdoaWNoIHdvcmtzXG4gIHdpdGggdGhlIHJlc3Qgb2YgdGhlIGNvZGVcblxuKi9cblxuaW1wb3J0IHtVdGlsLCBIYXNoU2V0fSBmcm9tIFwiLi91dGlsaXR5XCI7XG5cblxuZnVuY3Rpb24gX3RvcmYoYXJnczogYW55W10pOiBMb2dpYyB8IG51bGwge1xuICAgIC8qIFJldHVybiBUcnVlIGlmIGFsbCBhcmdzIGFyZSBUcnVlLCBGYWxzZSBpZiB0aGV5XG4gICAgYXJlIGFsbCBGYWxzZSwgZWxzZSBOb25lXG4gICAgPj4+IGZyb20gc3ltcHkuY29yZS5sb2dpYyBpbXBvcnQgX3RvcmZcbiAgICA+Pj4gX3RvcmYoKFRydWUsIFRydWUpKVxuICAgIFRydWVcbiAgICA+Pj4gX3RvcmYoKEZhbHNlLCBGYWxzZSkpXG4gICAgRmFsc2VcbiAgICA+Pj4gX3RvcmYoKFRydWUsIEZhbHNlKSlcbiAgICAqL1xuICAgIGxldCBzYXdUID0gTG9naWMuRmFsc2U7XG4gICAgbGV0IHNhd0YgPSBMb2dpYy5GYWxzZTtcbiAgICBmb3IgKGNvbnN0IGEgb2YgYXJncykge1xuICAgICAgICBpZiAoYSA9PT0gTG9naWMuVHJ1ZSkge1xuICAgICAgICAgICAgaWYgKHNhd0YgaW5zdGFuY2VvZiBUcnVlKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBzYXdUID0gTG9naWMuVHJ1ZTtcbiAgICAgICAgfSBlbHNlIGlmIChhID09PSBMb2dpYy5GYWxzZSkge1xuICAgICAgICAgICAgaWYgKHNhd1QgaW5zdGFuY2VvZiBUcnVlKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBzYXdGID0gTG9naWMuVHJ1ZTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiBudWxsO1xuICAgICAgICB9XG4gICAgfVxuICAgIHJldHVybiBzYXdUO1xufVxuXG5mdW5jdGlvbiBfZnV6enlfZ3JvdXAoYXJnczogYW55W10sIHF1aWNrX2V4aXQgPSBMb2dpYy5GYWxzZSk6IExvZ2ljIHwgbnVsbCB7XG4gICAgLyogUmV0dXJuIFRydWUgaWYgYWxsIGFyZ3MgYXJlIFRydWUsIE5vbmUgaWYgdGhlcmUgaXMgYW55IE5vbmUgZWxzZSBGYWxzZVxuICAgIHVubGVzcyBgYHF1aWNrX2V4aXRgYCBpcyBUcnVlICh0aGVuIHJldHVybiBOb25lIGFzIHNvb24gYXMgYSBzZWNvbmQgRmFsc2VcbiAgICBpcyBzZWVuLlxuICAgICBgYF9mdXp6eV9ncm91cGBgIGlzIGxpa2UgYGBmdXp6eV9hbmRgYCBleGNlcHQgdGhhdCBpdCBpcyBtb3JlXG4gICAgY29uc2VydmF0aXZlIGluIHJldHVybmluZyBhIEZhbHNlLCB3YWl0aW5nIHRvIG1ha2Ugc3VyZSB0aGF0IGFsbFxuICAgIGFyZ3VtZW50cyBhcmUgVHJ1ZSBvciBGYWxzZSBhbmQgcmV0dXJuaW5nIE5vbmUgaWYgYW55IGFyZ3VtZW50cyBhcmVcbiAgICBOb25lLiBJdCBhbHNvIGhhcyB0aGUgY2FwYWJpbGl0eSBvZiBwZXJtaXRpbmcgb25seSBhIHNpbmdsZSBGYWxzZSBhbmRcbiAgICByZXR1cm5pbmcgTm9uZSBpZiBtb3JlIHRoYW4gb25lIGlzIHNlZW4uIEZvciBleGFtcGxlLCB0aGUgcHJlc2VuY2Ugb2YgYVxuICAgIHNpbmdsZSB0cmFuc2NlbmRlbnRhbCBhbW9uZ3N0IHJhdGlvbmFscyB3b3VsZCBpbmRpY2F0ZSB0aGF0IHRoZSBncm91cCBpc1xuICAgIG5vIGxvbmdlciByYXRpb25hbDsgYnV0IGEgc2Vjb25kIHRyYW5zY2VuZGVudGFsIGluIHRoZSBncm91cCB3b3VsZCBtYWtlIHRoZVxuICAgIGRldGVybWluYXRpb24gaW1wb3NzaWJsZS5cbiAgICBFeGFtcGxlc1xuICAgID09PT09PT09XG4gICAgPj4+IGZyb20gc3ltcHkuY29yZS5sb2dpYyBpbXBvcnQgX2Z1enp5X2dyb3VwXG4gICAgQnkgZGVmYXVsdCwgbXVsdGlwbGUgRmFsc2VzIG1lYW4gdGhlIGdyb3VwIGlzIGJyb2tlbjpcbiAgICA+Pj4gX2Z1enp5X2dyb3VwKFtGYWxzZSwgRmFsc2UsIFRydWVdKVxuICAgIEZhbHNlXG4gICAgSWYgbXVsdGlwbGUgRmFsc2VzIG1lYW4gdGhlIGdyb3VwIHN0YXR1cyBpcyB1bmtub3duIHRoZW4gc2V0XG4gICAgYHF1aWNrX2V4aXRgIHRvIFRydWUgc28gTm9uZSBjYW4gYmUgcmV0dXJuZWQgd2hlbiB0aGUgMm5kIEZhbHNlIGlzIHNlZW46XG4gICAgPj4+IF9mdXp6eV9ncm91cChbRmFsc2UsIEZhbHNlLCBUcnVlXSwgcXVpY2tfZXhpdD1UcnVlKVxuICAgIEJ1dCBpZiBvbmx5IGEgc2luZ2xlIEZhbHNlIGlzIHNlZW4gdGhlbiB0aGUgZ3JvdXAgaXMga25vd24gdG9cbiAgICBiZSBicm9rZW46XG4gICAgPj4+IF9mdXp6eV9ncm91cChbRmFsc2UsIFRydWUsIFRydWVdLCBxdWlja19leGl0PVRydWUpXG4gICAgRmFsc2VcbiAgICAqL1xuICAgIGxldCBzYXdfb3RoZXIgPSBMb2dpYy5GYWxzZTtcbiAgICBmb3IgKGNvbnN0IGEgb2YgYXJncykge1xuICAgICAgICBpZiAoYSA9PT0gTG9naWMuVHJ1ZSkge1xuICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgIH0gaWYgKGEgPT0gbnVsbCkge1xuICAgICAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICAgIH0gaWYgKHF1aWNrX2V4aXQgaW5zdGFuY2VvZiBUcnVlICYmIHNhd19vdGhlciBpbnN0YW5jZW9mIFRydWUpIHtcbiAgICAgICAgICAgIHJldHVybiBudWxsO1xuICAgICAgICB9XG4gICAgICAgIHNhd19vdGhlciA9IExvZ2ljLlRydWU7XG4gICAgfVxuICAgIGlmIChzYXdfb3RoZXIgaW5zdGFuY2VvZiBUcnVlKSB7XG4gICAgICAgIHJldHVybiBMb2dpYy5GYWxzZTtcbiAgICB9XG4gICAgcmV0dXJuIExvZ2ljLlRydWU7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBfZnV6enlfZ3JvdXB2MihhcmdzOiBhbnlbXSkge1xuICAgIGNvbnN0IHJlcyA9IF9mdXp6eV9ncm91cChhcmdzKTtcbiAgICBpZiAocmVzID09PSBMb2dpYy5UcnVlKSB7XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgIH0gZWxzZSBpZiAocmVzID09PSBMb2dpYy5GYWxzZSkge1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICAgIHJldHVybiB1bmRlZmluZWQ7XG59XG5cblxuZnVuY3Rpb24gZnV6enlfYm9vbCh4OiBMb2dpYyk6IExvZ2ljIHwgbnVsbCB7XG4gICAgLyogUmV0dXJuIFRydWUsIEZhbHNlIG9yIE5vbmUgYWNjb3JkaW5nIHRvIHguXG4gICAgV2hlcmVhcyBib29sKHgpIHJldHVybnMgVHJ1ZSBvciBGYWxzZSwgZnV6enlfYm9vbCBhbGxvd3NcbiAgICBmb3IgdGhlIE5vbmUgdmFsdWUgYW5kIG5vbiAtIGZhbHNlIHZhbHVlcyh3aGljaCBiZWNvbWUgTm9uZSksIHRvby5cbiAgICBFeGFtcGxlc1xuICAgID09PT09PT09XG4gICAgPj4+IGZyb20gc3ltcHkuY29yZS5sb2dpYyBpbXBvcnQgZnV6enlfYm9vbFxuICAgID4+PiBmcm9tIHN5bXB5LmFiYyBpbXBvcnQgeFxuICAgID4+PiBmdXp6eV9ib29sKHgpLCBmdXp6eV9ib29sKE5vbmUpXG4gICAgKE5vbmUsIE5vbmUpXG4gICAgPj4+IGJvb2woeCksIGJvb2woTm9uZSlcbiAgICAgICAgKFRydWUsIEZhbHNlKVxuICAgICovXG4gICAgaWYgKHggPT0gbnVsbCkge1xuICAgICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG4gICAgaWYgKHggaW5zdGFuY2VvZiBUcnVlKSB7XG4gICAgICAgIHJldHVybiBMb2dpYy5UcnVlO1xuICAgIH1cbiAgICBpZiAoeCBpbnN0YW5jZW9mIEZhbHNlKSB7XG4gICAgICAgIHJldHVybiBMb2dpYy5GYWxzZTtcbiAgICB9XG59XG5cbmZ1bmN0aW9uIGZ1enp5X2Jvb2xfdjIoeDogYm9vbGVhbikge1xuICAgIC8qIFJldHVybiBUcnVlLCBGYWxzZSBvciBOb25lIGFjY29yZGluZyB0byB4LlxuICAgIFdoZXJlYXMgYm9vbCh4KSByZXR1cm5zIFRydWUgb3IgRmFsc2UsIGZ1enp5X2Jvb2wgYWxsb3dzXG4gICAgZm9yIHRoZSBOb25lIHZhbHVlIGFuZCBub24gLSBmYWxzZSB2YWx1ZXMod2hpY2ggYmVjb21lIE5vbmUpLCB0b28uXG4gICAgRXhhbXBsZXNcbiAgICA9PT09PT09PVxuICAgID4+PiBmcm9tIHN5bXB5LmNvcmUubG9naWMgaW1wb3J0IGZ1enp5X2Jvb2xcbiAgICA+Pj4gZnJvbSBzeW1weS5hYmMgaW1wb3J0IHhcbiAgICA+Pj4gZnV6enlfYm9vbCh4KSwgZnV6enlfYm9vbChOb25lKVxuICAgIChOb25lLCBOb25lKVxuICAgID4+PiBib29sKHgpLCBib29sKE5vbmUpXG4gICAgICAgIChUcnVlLCBGYWxzZSlcbiAgICAqL1xuICAgIGlmICh0eXBlb2YgeCA9PT0gXCJ1bmRlZmluZWRcIikge1xuICAgICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG4gICAgaWYgKHggPT09IHRydWUpIHtcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuICAgIGlmICh4ID09PSBmYWxzZSkge1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxufVxuXG5mdW5jdGlvbiBmdXp6eV9hbmQoYXJnczogYW55W10pOiBMb2dpYyB8IG51bGwge1xuICAgIC8qIFJldHVybiBUcnVlIChhbGwgVHJ1ZSksIEZhbHNlIChhbnkgRmFsc2UpIG9yIE5vbmUuXG4gICAgRXhhbXBsZXNcbiAgICA9PT09PT09PVxuICAgID4+PiBmcm9tIHN5bXB5LmNvcmUubG9naWMgaW1wb3J0IGZ1enp5X2FuZFxuICAgID4+PiBmcm9tIHN5bXB5IGltcG9ydCBEdW1teVxuICAgIElmIHlvdSBoYWQgYSBsaXN0IG9mIG9iamVjdHMgdG8gdGVzdCB0aGUgY29tbXV0aXZpdHkgb2ZcbiAgICBhbmQgeW91IHdhbnQgdGhlIGZ1enp5X2FuZCBsb2dpYyBhcHBsaWVkLCBwYXNzaW5nIGFuXG4gICAgaXRlcmF0b3Igd2lsbCBhbGxvdyB0aGUgY29tbXV0YXRpdml0eSB0byBvbmx5IGJlIGNvbXB1dGVkXG4gICAgYXMgbWFueSB0aW1lcyBhcyBuZWNlc3NhcnkuV2l0aCB0aGlzIGxpc3QsIEZhbHNlIGNhbiBiZVxuICAgIHJldHVybmVkIGFmdGVyIGFuYWx5emluZyB0aGUgZmlyc3Qgc3ltYm9sOlxuICAgID4+PiBzeW1zID1bRHVtbXkoY29tbXV0YXRpdmUgPSBGYWxzZSksIER1bW15KCldXG4gICAgPj4+IGZ1enp5X2FuZChzLmlzX2NvbW11dGF0aXZlIGZvciBzIGluIHN5bXMpXG4gICAgRmFsc2VcbiAgICBUaGF0IEZhbHNlIHdvdWxkIHJlcXVpcmUgbGVzcyB3b3JrIHRoYW4gaWYgYSBsaXN0IG9mIHByZSAtIGNvbXB1dGVkXG4gICAgaXRlbXMgd2FzIHNlbnQ6XG4gICAgPj4+IGZ1enp5X2FuZChbcy5pc19jb21tdXRhdGl2ZSBmb3IgcyBpbiBzeW1zXSlcbiAgICBGYWxzZVxuICAgICovXG5cbiAgICBsZXQgcnYgPSBMb2dpYy5UcnVlO1xuICAgIGZvciAobGV0IGFpIG9mIGFyZ3MpIHtcbiAgICAgICAgYWkgPSBmdXp6eV9ib29sKGFpKTtcbiAgICAgICAgaWYgKGFpIGluc3RhbmNlb2YgRmFsc2UpIHtcbiAgICAgICAgICAgIHJldHVybiBMb2dpYy5GYWxzZTtcbiAgICAgICAgfSBpZiAocnYgaW5zdGFuY2VvZiBUcnVlKSB7IC8vIHRoaXMgd2lsbCBzdG9wIHVwZGF0aW5nIGlmIGEgTm9uZSBpcyBldmVyIHRyYXBwZWRcbiAgICAgICAgICAgIHJ2ID0gYWk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIHJ2O1xufVxuXG5mdW5jdGlvbiBmdXp6eV9hbmRfdjIoYXJnczogYW55W10pIHtcbiAgICBsZXQgcnYgPSB0cnVlO1xuICAgIGZvciAobGV0IGFpIG9mIGFyZ3MpIHtcbiAgICAgICAgYWkgPSBmdXp6eV9ib29sX3YyKGFpKTtcbiAgICAgICAgaWYgKGFpID09PSBmYWxzZSkge1xuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9IGlmIChydiA9PT0gdHJ1ZSkge1xuICAgICAgICAgICAgcnYgPSBhaTtcbiAgICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gcnY7XG59XG5cbmZ1bmN0aW9uIGZ1enp5X25vdCh2OiBhbnkpOiBMb2dpYyB8IG51bGwge1xuICAgIC8qXG4gICAgTm90IGluIGZ1enp5IGxvZ2ljXG4gICAgICAgIFJldHVybiBOb25lIGlmIGB2YCBpcyBOb25lIGVsc2UgYG5vdCB2YC5cbiAgICAgICAgRXhhbXBsZXNcbiAgICAgICAgPT09PT09PT1cbiAgICAgICAgPj4+IGZyb20gc3ltcHkuY29yZS5sb2dpYyBpbXBvcnQgZnV6enlfbm90XG4gICAgICAgID4+PiBmdXp6eV9ub3QoVHJ1ZSlcbiAgICBGYWxzZVxuICAgICAgICA+Pj4gZnV6enlfbm90KE5vbmUpXG4gICAgICAgID4+PiBmdXp6eV9ub3QoRmFsc2UpXG4gICAgVHJ1ZVxuICAgICovXG4gICAgaWYgKHYgPT0gbnVsbCkge1xuICAgICAgICByZXR1cm4gdjtcbiAgICB9IGVsc2UgaWYgKHYgaW5zdGFuY2VvZiBUcnVlKSB7XG4gICAgICAgIHJldHVybiBMb2dpYy5GYWxzZTtcbiAgICB9XG4gICAgcmV0dXJuIExvZ2ljLlRydWU7XG59XG5cblxuZXhwb3J0IGZ1bmN0aW9uIGZ1enp5X25vdHYyKHY6IGFueSkge1xuICAgIC8qXG4gICAgTm90IGluIGZ1enp5IGxvZ2ljXG4gICAgICAgIFJldHVybiBOb25lIGlmIGB2YCBpcyBOb25lIGVsc2UgYG5vdCB2YC5cbiAgICAgICAgRXhhbXBsZXNcbiAgICAgICAgPT09PT09PT1cbiAgICAgICAgPj4+IGZyb20gc3ltcHkuY29yZS5sb2dpYyBpbXBvcnQgZnV6enlfbm90XG4gICAgICAgID4+PiBmdXp6eV9ub3QoVHJ1ZSlcbiAgICBGYWxzZVxuICAgICAgICA+Pj4gZnV6enlfbm90KE5vbmUpXG4gICAgICAgID4+PiBmdXp6eV9ub3QoRmFsc2UpXG4gICAgVHJ1ZVxuICAgICovXG4gICAgaWYgKHYgPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgIHJldHVybiB1bmRlZmluZWQ7XG4gICAgfSBlbHNlIGlmICh2ID09PSB0cnVlKSB7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gICAgcmV0dXJuIHRydWU7XG59XG5cblxuZnVuY3Rpb24gZnV6enlfb3IoYXJnczogYW55W10pOiBMb2dpYyB7XG4gICAgLypcbiAgICBPciBpbiBmdXp6eSBsb2dpYy5SZXR1cm5zIFRydWUoYW55IFRydWUpLCBGYWxzZShhbGwgRmFsc2UpLCBvciBOb25lXG4gICAgICAgIFNlZSB0aGUgZG9jc3RyaW5ncyBvZiBmdXp6eV9hbmQgYW5kIGZ1enp5X25vdCBmb3IgbW9yZSBpbmZvLmZ1enp5X29yIGlzXG4gICAgICAgIHJlbGF0ZWQgdG8gdGhlIHR3byBieSB0aGUgc3RhbmRhcmQgRGUgTW9yZ2FuJ3MgbGF3LlxuICAgICAgICA+Pj4gZnJvbSBzeW1weS5jb3JlLmxvZ2ljIGltcG9ydCBmdXp6eV9vclxuICAgICAgICA+Pj4gZnV6enlfb3IoW1RydWUsIEZhbHNlXSlcbiAgICBUcnVlXG4gICAgICAgID4+PiBmdXp6eV9vcihbVHJ1ZSwgTm9uZV0pXG4gICAgVHJ1ZVxuICAgICAgICA+Pj4gZnV6enlfb3IoW0ZhbHNlLCBGYWxzZV0pXG4gICAgRmFsc2VcbiAgICAgICAgPj4+IHByaW50KGZ1enp5X29yKFtGYWxzZSwgTm9uZV0pKVxuICAgIE5vbmVcbiAgICAqL1xuICAgIGxldCBydiA9IExvZ2ljLkZhbHNlO1xuXG4gICAgZm9yIChsZXQgYWkgb2YgYXJncykge1xuICAgICAgICBhaSA9IGZ1enp5X2Jvb2woYWkpO1xuICAgICAgICBpZiAoYWkgaW5zdGFuY2VvZiBUcnVlKSB7XG4gICAgICAgICAgICByZXR1cm4gTG9naWMuVHJ1ZTtcbiAgICAgICAgfVxuICAgICAgICBpZiAocnYgaW5zdGFuY2VvZiBGYWxzZSkgeyAvLyB0aGlzIHdpbGwgc3RvcCB1cGRhdGluZyBpZiBhIE5vbmUgaXMgZXZlciB0cmFwcGVkXG4gICAgICAgICAgICBydiA9IGFpO1xuICAgICAgICB9XG4gICAgfVxuICAgIHJldHVybiBydjtcbn1cblxuZnVuY3Rpb24gZnV6enlfeG9yKGFyZ3M6IGFueVtdKTogTG9naWMgfCBudWxsIHtcbiAgICAvKiBSZXR1cm4gTm9uZSBpZiBhbnkgZWxlbWVudCBvZiBhcmdzIGlzIG5vdCBUcnVlIG9yIEZhbHNlLCBlbHNlXG4gICAgVHJ1ZShpZiB0aGVyZSBhcmUgYW4gb2RkIG51bWJlciBvZiBUcnVlIGVsZW1lbnRzKSwgZWxzZSBGYWxzZS4gKi9cbiAgICBsZXQgdCA9IDA7XG4gICAgbGV0IGYgPSAwO1xuICAgIGZvciAoY29uc3QgYSBvZiBhcmdzKSB7XG4gICAgICAgIGNvbnN0IGFpID0gZnV6enlfYm9vbChhKTtcbiAgICAgICAgaWYgKGFpIGluc3RhbmNlb2YgVHJ1ZSkge1xuICAgICAgICAgICAgdCArPSAxO1xuICAgICAgICB9IGVsc2UgaWYgKGFpIGluc3RhbmNlb2YgRmFsc2UpIHtcbiAgICAgICAgICAgIGYgKz0gMTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiBudWxsO1xuICAgICAgICB9XG4gICAgfVxuICAgIGlmICh0ICUgMiA9PSAxKSB7XG4gICAgICAgIHJldHVybiBMb2dpYy5UcnVlO1xuICAgIH1cbiAgICByZXR1cm4gTG9naWMuRmFsc2U7XG59XG5cbmZ1bmN0aW9uIGZ1enp5X25hbmQoYXJnczogYW55W10pOiBMb2dpYyB8IG51bGwge1xuICAgIC8qIFJldHVybiBGYWxzZSBpZiBhbGwgYXJncyBhcmUgVHJ1ZSwgVHJ1ZSBpZiB0aGV5IGFyZSBhbGwgRmFsc2UsXG4gICAgZWxzZSBOb25lLiAqL1xuICAgIHJldHVybiBmdXp6eV9ub3QoZnV6enlfYW5kKGFyZ3MpKTtcbn1cblxuXG5jbGFzcyBMb2dpYyB7XG4gICAgc3RhdGljIFRydWU6IExvZ2ljO1xuICAgIHN0YXRpYyBGYWxzZTogTG9naWM7XG5cbiAgICBzdGF0aWMgb3BfMmNsYXNzOiBSZWNvcmQ8c3RyaW5nLCAoLi4uYXJnczogYW55W10pID0+IExvZ2ljPiA9IHtcbiAgICAgICAgXCImXCI6ICguLi5hcmdzKSA9PiB7XG4gICAgICAgICAgICByZXR1cm4gQW5kLk5ldyguLi5hcmdzKTtcbiAgICAgICAgfSxcbiAgICAgICAgXCJ8XCI6ICguLi5hcmdzKSA9PiB7XG4gICAgICAgICAgICByZXR1cm4gT3IuTmV3KC4uLmFyZ3MpO1xuICAgICAgICB9LFxuICAgICAgICBcIiFcIjogKGFyZykgPT4ge1xuICAgICAgICAgICAgcmV0dXJuIE5vdC5OZXcoYXJnKTtcbiAgICAgICAgfSxcbiAgICB9O1xuXG4gICAgYXJnczogYW55W107XG5cbiAgICBjb25zdHJ1Y3RvciguLi5hcmdzOiBhbnlbXSkge1xuICAgICAgICB0aGlzLmFyZ3MgPSBbLi4uYXJnc10uZmxhdCgpXG4gICAgfVxuXG4gICAgX2V2YWxfcHJvcGFnYXRlX25vdCgpOiBhbnkge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJFdmFsIHByb3BhZ2F0ZSBub3QgaXMgYWJzdHJhY3QgaW4gTG9naWNcIik7XG4gICAgfVxuXG4gICAgZXhwYW5kKCk6IGFueSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcihcIkV4cGFuZCBpcyBhYnN0cmFjdCBpbiBMb2dpY1wiKTtcbiAgICB9XG5cbiAgICBzdGF0aWMgX19uZXdfXyhjbHM6IGFueSwgLi4uYXJnczogYW55W10pOiBhbnkge1xuICAgICAgICBpZiAoY2xzID09PSBOb3QpIHtcbiAgICAgICAgICAgIHJldHVybiBuZXcgTm90KGFyZ3NbMF0pO1xuICAgICAgICB9IGVsc2UgaWYgKGNscyA9PT0gQW5kKSB7XG4gICAgICAgICAgICByZXR1cm4gbmV3IEFuZChhcmdzKTtcbiAgICAgICAgfSBlbHNlIGlmIChjbHMgPT09IE9yKSB7XG4gICAgICAgICAgICByZXR1cm4gbmV3IE9yKGFyZ3MpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgZ2V0X29wX3hfbm90eCgpOiBhbnkge1xuICAgICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG5cbiAgICBoYXNoS2V5KCk6IHN0cmluZyB7XG4gICAgICAgIHJldHVybiB0aGlzLnRvU3RyaW5nKCk7XG4gICAgfVxuXG4gICAgdG9TdHJpbmcoKSB7XG4gICAgICAgIHJldHVybiBcIkxvZ2ljIFwiICsgdGhpcy5hcmdzLnRvU3RyaW5nKCk7XG4gICAgfVxuXG4gICAgZ2V0TmV3QXJncygpOiBhbnlbXSB7XG4gICAgICAgIHJldHVybiB0aGlzLmFyZ3M7XG4gICAgfVxuXG4gICAgc3RhdGljIGVxdWFscyhhOiBhbnksIGI6IGFueSk6IExvZ2ljIHtcbiAgICAgICAgaWYgKCEoYiBpbnN0YW5jZW9mIGEuY29uc3RydWN0b3IpKSB7XG4gICAgICAgICAgICByZXR1cm4gTG9naWMuRmFsc2U7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBpZiAoYS5hcmdzID09IGIuYXJncykge1xuICAgICAgICAgICAgICAgIHJldHVybiBMb2dpYy5UcnVlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIExvZ2ljLkZhbHNlO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgc3RhdGljIG5vdEVxdWFscyhhOiBhbnksIGI6IGFueSk6IExvZ2ljIHtcbiAgICAgICAgaWYgKCEoYiBpbnN0YW5jZW9mIGEuY29uc3RydWN0b3IpKSB7XG4gICAgICAgICAgICByZXR1cm4gTG9naWMuVHJ1ZTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGlmIChhLmFyZ3MgPT0gYi5hcmdzKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIExvZ2ljLkZhbHNlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIExvZ2ljLlRydWU7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBsZXNzVGhhbihvdGhlcjogT2JqZWN0KTogTG9naWMge1xuICAgICAgICBpZiAodGhpcy5jb21wYXJlKG90aGVyKSA9PSAtMSkge1xuICAgICAgICAgICAgcmV0dXJuIExvZ2ljLlRydWU7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIExvZ2ljLkZhbHNlO1xuICAgIH1cblxuICAgIGNvbXBhcmUob3RoZXI6IGFueSk6IG51bWJlciB7XG4gICAgICAgIGxldCBhOyBsZXQgYjtcbiAgICAgICAgaWYgKHR5cGVvZiB0aGlzICE9IHR5cGVvZiBvdGhlcikge1xuICAgICAgICAgICAgY29uc3QgdW5rU2VsZjogdW5rbm93biA9IDx1bmtub3duPiB0aGlzLmNvbnN0cnVjdG9yO1xuICAgICAgICAgICAgY29uc3QgdW5rT3RoZXI6IHVua25vd24gPSA8dW5rbm93bj4gb3RoZXIuY29uc3RydWN0b3I7XG4gICAgICAgICAgICBhID0gPHN0cmluZz4gdW5rU2VsZjtcbiAgICAgICAgICAgIGIgPSA8c3RyaW5nPiB1bmtPdGhlcjtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGEgPSB0aGlzLmFyZ3M7XG4gICAgICAgICAgICBiID0gb3RoZXIuYXJncztcbiAgICAgICAgfVxuICAgICAgICBpZiAoYSA+IGIpIHtcbiAgICAgICAgICAgIHJldHVybiAxO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuIDA7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBzdGF0aWMgZnJvbXN0cmluZyh0ZXh0OiBzdHJpbmcpIHtcbiAgICAgICAgLyogTG9naWMgZnJvbSBzdHJpbmcgd2l0aCBzcGFjZSBhcm91bmQgJiBhbmQgfCBidXQgbm9uZSBhZnRlciAhLlxuICAgICAgICAgICBlLmcuXG4gICAgICAgICAgICFhICYgYiB8IGNcbiAgICAgICAgKi9cbiAgICAgICAgbGV0IGxleHByID0gbnVsbDsgLy8gY3VycmVudCBsb2dpY2FsIGV4cHJlc3Npb25cbiAgICAgICAgbGV0IHNjaGVkb3AgPSBudWxsOyAvLyBzY2hlZHVsZWQgb3BlcmF0aW9uXG4gICAgICAgIGZvciAoY29uc3QgdGVybSBvZiB0ZXh0LnNwbGl0KFwiIFwiKSkge1xuICAgICAgICAgICAgbGV0IGZsZXhUZXJtOiBzdHJpbmcgfCBMb2dpYyA9IHRlcm07XG4gICAgICAgICAgICAvLyBvcGVyYXRpb24gc3ltYm9sXG4gICAgICAgICAgICBpZiAoXCImfFwiLmluY2x1ZGVzKGZsZXhUZXJtKSkge1xuICAgICAgICAgICAgICAgIGlmIChzY2hlZG9wICE9IG51bGwpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiZG91YmxlIG9wIGZvcmJpZGRlbiBcIiArIGZsZXhUZXJtICsgXCIgXCIgKyBzY2hlZG9wKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgaWYgKGxleHByID09IG51bGwpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKGZsZXhUZXJtICsgXCIgY2Fubm90IGJlIGluIHRoZSBiZWdpbm5pbmcgb2YgZXhwcmVzc2lvblwiKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgc2NoZWRvcCA9IGZsZXhUZXJtO1xuICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKGZsZXhUZXJtLmluY2x1ZGVzKFwifFwiKSB8fCBmbGV4VGVybS5pbmNsdWRlcyhcIiZcIikpIHtcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCImIGFuZCB8IG11c3QgaGF2ZSBzcGFjZSBhcm91bmQgdGhlbVwiKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChmbGV4VGVybVswXSA9PSBcIiFcIikge1xuICAgICAgICAgICAgICAgIGlmIChmbGV4VGVybS5sZW5ndGggPT0gMSkge1xuICAgICAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJkbyBub3QgaW5jbHVkZSBzcGFjZSBhZnRlciAhXCIpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBmbGV4VGVybSA9IE5vdC5OZXcoZmxleFRlcm0uc3Vic3RyaW5nKDEpKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIC8vIGFscmVhZHkgc2NoZWR1bGVkIG9wZXJhdGlvbiwgZS5nLiAnJidcbiAgICAgICAgICAgIGlmIChzY2hlZG9wKSB7XG4gICAgICAgICAgICAgICAgY29uc3Qgb3AgPSBMb2dpYy5vcF8yY2xhc3Nbc2NoZWRvcF07XG4gICAgICAgICAgICAgICAgbGV4cHIgPSBvcChsZXhwciwgZmxleFRlcm0pO1xuICAgICAgICAgICAgICAgIHNjaGVkb3AgPSBudWxsO1xuICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgLy8gdGhpcyBzaG91bGQgYmUgYXRvbVxuICAgICAgICAgICAgaWYgKGxleHByICE9IG51bGwpIHtcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJtaXNzaW5nIG9wIGJldHdlZW4gXCIgKyBsZXhwciArIFwiIGFuZCBcIiArIGZsZXhUZXJtICk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBsZXhwciA9IGZsZXhUZXJtO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gbGV0J3MgY2hlY2sgdGhhdCB3ZSBlbmRlZCB1cCBpbiBjb3JyZWN0IHN0YXRlXG4gICAgICAgIGlmIChzY2hlZG9wICE9IG51bGwpIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcInByZW1hdHVyZSBlbmQtb2YtZXhwcmVzc2lvbiBpbiBcIiArIHRleHQpO1xuICAgICAgICB9XG4gICAgICAgIGlmIChsZXhwciA9PSBudWxsKSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IodGV4dCArIFwiIGlzIGVtcHR5XCIpO1xuICAgICAgICB9XG4gICAgICAgIC8vIGV2ZXJ5dGhpbmcgbG9va3MgZ29vZCBub3dcbiAgICAgICAgcmV0dXJuIGxleHByO1xuICAgIH1cbn1cblxuY2xhc3MgVHJ1ZSBleHRlbmRzIExvZ2ljIHtcbiAgICBfZXZhbF9wcm9wYWdhdGVfbm90KCk6IGFueSB7XG4gICAgICAgIHJldHVybiBGYWxzZS5GYWxzZTtcbiAgICB9XG5cbiAgICBleHBhbmQoKTogYW55IHtcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxufVxuXG5jbGFzcyBGYWxzZSBleHRlbmRzIExvZ2ljIHtcbiAgICBfZXZhbF9wcm9wYWdhdGVfbm90KCk6IGFueSB7XG4gICAgICAgIHJldHVybiBUcnVlLlRydWU7XG4gICAgfVxuXG4gICAgZXhwYW5kKCk6IGFueSB7XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cbn1cblxuXG5jbGFzcyBBbmRPcl9CYXNlIGV4dGVuZHMgTG9naWMge1xuICAgIHN0YXRpYyBfX25ld19fKGNsczogYW55LCBvcF94X25vdHg6IGFueSwgLi4uYXJnczogYW55W10pIHtcbiAgICAgICAgY29uc3QgYmFyZ3M6IGFueVtdID0gW107XG4gICAgICAgIGZvciAoY29uc3QgYSBvZiBhcmdzKSB7XG4gICAgICAgICAgICBpZiAoYSA9PSBvcF94X25vdHgpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gYTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoYSA9PSBvcF94X25vdHgub3Bwb3NpdGUpIHtcbiAgICAgICAgICAgICAgICBjb250aW51ZTsgLy8gc2tpcCB0aGlzIGFyZ3VtZW50XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBiYXJncy5wdXNoKGEpO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gcHJldiB2ZXJzaW9uOiBhcmdzID0gc29ydGVkKHNldCh0aGlzLmZsYXR0ZW4oYmFyZ3MpKSwga2V5PWhhc2gpXG4gICAgICAgIC8vIHdlIHRoaW5rIHdlIGRvbid0IG5lZWQgdGhlIHNvcnQgYW5kIHNldFxuICAgICAgICBhcmdzID0gbmV3IEhhc2hTZXQoQW5kT3JfQmFzZS5mbGF0dGVuKGJhcmdzKSkudG9BcnJheSgpLnNvcnQoXG4gICAgICAgICAgICAoYSwgYikgPT4gVXRpbC5oYXNoS2V5KGEpLmxvY2FsZUNvbXBhcmUoVXRpbC5oYXNoS2V5KGIpKVxuICAgICAgICApO1xuXG4gICAgICAgIC8vIGNyZWF0aW5nIGEgc2V0IHdpdGggaGFzaCBrZXlzIGZvciBhcmdzXG4gICAgICAgIGNvbnN0IGFyZ3Nfc2V0ID0gbmV3IEhhc2hTZXQoYXJncyk7XG5cbiAgICAgICAgZm9yIChjb25zdCBhIG9mIGFyZ3MpIHtcbiAgICAgICAgICAgIGlmIChhcmdzX3NldC5oYXMoTm90Lk5ldyhhKSkpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gb3BfeF9ub3R4O1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGFyZ3MubGVuZ3RoID09IDEpIHtcbiAgICAgICAgICAgIHJldHVybiBhcmdzLnBvcCgpO1xuICAgICAgICB9IGVsc2UgaWYgKGFyZ3MubGVuZ3RoID09IDApIHtcbiAgICAgICAgICAgIGlmIChvcF94X25vdHggaW5zdGFuY2VvZiBUcnVlKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIExvZ2ljLkZhbHNlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIExvZ2ljLlRydWU7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gc3VwZXIuX19uZXdfXyhjbHMsIC4uLmFyZ3MpO1xuICAgIH1cblxuICAgIHN0YXRpYyBmbGF0dGVuKGFyZ3M6IGFueVtdKTogYW55W10ge1xuICAgICAgICAvLyBxdWljay1uLWRpcnR5IGZsYXR0ZW5pbmcgZm9yIEFuZCBhbmQgT3JcbiAgICAgICAgY29uc3QgYXJnc19xdWV1ZTogYW55W10gPSBbLi4uYXJnc107XG4gICAgICAgIGNvbnN0IHJlcyA9IFtdO1xuICAgICAgICB3aGlsZSAoYXJnc19xdWV1ZS5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICBjb25zdCBhcmc6IGFueSA9IGFyZ3NfcXVldWUucG9wKCk7XG4gICAgICAgICAgICBpZiAoYXJnIGluc3RhbmNlb2YgTG9naWMpIHtcbiAgICAgICAgICAgICAgICBpZiAoYXJnIGluc3RhbmNlb2YgdGhpcykge1xuICAgICAgICAgICAgICAgICAgICBhcmdzX3F1ZXVlLnB1c2goYXJnLmFyZ3MpO1xuICAgICAgICAgICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXMucHVzaChhcmcpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiByZXMuZmxhdCgpO1xuICAgIH1cbn1cblxuY2xhc3MgQW5kIGV4dGVuZHMgQW5kT3JfQmFzZSB7XG4gICAgc3RhdGljIE5ldyguLi5hcmdzOiBhbnlbXSkge1xuICAgICAgICByZXR1cm4gc3VwZXIuX19uZXdfXyhBbmQsIExvZ2ljLkZhbHNlLCAuLi5hcmdzKTtcbiAgICB9XG5cblxuICAgIF9ldmFsX3Byb3BhZ2F0ZV9ub3QoKTogT3Ige1xuICAgICAgICAvLyAhIChhJmImYyAuLi4pID09ICFhIHwgIWIgfCAhYyAuLi5cbiAgICAgICAgY29uc3QgcGFyYW06IGFueVtdID0gW107XG4gICAgICAgIGZvciAoY29uc3QgYSBvZiBwYXJhbSkge1xuICAgICAgICAgICAgcGFyYW0ucHVzaChOb3QuTmV3KGEpKTsgLy8gPz9cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gT3IuTmV3KC4uLnBhcmFtKTsgLy8gPz8/XG4gICAgfVxuXG4gICAgLy8gKGF8YnwuLi4pICYgYyA9PSAoYSZjKSB8IChiJmMpIHwgLi4uXG4gICAgZXhwYW5kKCk6IGFueSB7XG4gICAgICAgIC8vIGZpcnN0IGxvY2F0ZSBPclxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMuYXJncy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgY29uc3QgYXJnID0gdGhpcy5hcmdzW2ldO1xuICAgICAgICAgICAgaWYgKGFyZyBpbnN0YW5jZW9mIE9yKSB7XG4gICAgICAgICAgICAgICAgLy8gY29weSBvZiB0aGlzLmFyZ3Mgd2l0aCBhcmcgYXQgcG9zaXRpb24gaSByZW1vdmVkXG5cbiAgICAgICAgICAgICAgICBjb25zdCBhcmVzdCA9IFsuLi50aGlzLmFyZ3NdLnNwbGljZShpLCAxKTtcblxuICAgICAgICAgICAgICAgIC8vIHN0ZXAgYnkgc3RlcCB2ZXJzaW9uIG9mIHRoZSBtYXAgYmVsb3dcbiAgICAgICAgICAgICAgICAvKlxuICAgICAgICAgICAgICAgIGxldCBvcnRlcm1zID0gW107XG4gICAgICAgICAgICAgICAgZm9yIChsZXQgYSBvZiBhcmcuYXJncykge1xuICAgICAgICAgICAgICAgICAgICBvcnRlcm1zLnB1c2gobmV3IEFuZCguLi5hcmVzdC5jb25jYXQoW2FdKSkpXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICovXG5cbiAgICAgICAgICAgICAgICBjb25zdCBvcnRlcm1zID0gYXJnLmFyZ3MubWFwKChlKSA9PiBBbmQuTmV3KC4uLmFyZXN0LmNvbmNhdChbZV0pKSk7XG5cblxuICAgICAgICAgICAgICAgIGZvciAobGV0IGogPSAwOyBqIDwgb3J0ZXJtcy5sZW5ndGg7IGorKykge1xuICAgICAgICAgICAgICAgICAgICBpZiAob3J0ZXJtc1tqXSBpbnN0YW5jZW9mIExvZ2ljKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBvcnRlcm1zW2pdID0gb3J0ZXJtc1tqXS5leHBhbmQoKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBjb25zdCByZXMgPSBPci5OZXcoLi4ub3J0ZXJtcyk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHJlcztcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9XG59XG5cbmNsYXNzIE9yIGV4dGVuZHMgQW5kT3JfQmFzZSB7XG4gICAgc3RhdGljIE5ldyguLi5hcmdzOiBhbnlbXSkge1xuICAgICAgICByZXR1cm4gc3VwZXIuX19uZXdfXyhPciwgTG9naWMuVHJ1ZSwgLi4uYXJncyk7XG4gICAgfVxuXG4gICAgX2V2YWxfcHJvcGFnYXRlX25vdCgpOiBBbmQge1xuICAgICAgICAvLyAhIChhJmImYyAuLi4pID09ICFhIHwgIWIgfCAhYyAuLi5cbiAgICAgICAgY29uc3QgcGFyYW06IGFueVtdID0gW107XG4gICAgICAgIGZvciAoY29uc3QgYSBvZiBwYXJhbSkge1xuICAgICAgICAgICAgcGFyYW0ucHVzaChOb3QuTmV3KGEpKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gQW5kLk5ldyguLi5wYXJhbSk7XG4gICAgfVxufVxuXG5jbGFzcyBOb3QgZXh0ZW5kcyBMb2dpYyB7XG4gICAgc3RhdGljIE5ldyhhcmdzOiBhbnkpIHtcbiAgICAgICAgcmV0dXJuIE5vdC5fX25ld19fKE5vdCwgYXJncyk7XG4gICAgfVxuXG4gICAgc3RhdGljIF9fbmV3X18oY2xzOiBhbnksIGFyZzogYW55KSB7XG4gICAgICAgIGlmICh0eXBlb2YgYXJnID09PSBcInN0cmluZ1wiKSB7XG4gICAgICAgICAgICByZXR1cm4gc3VwZXIuX19uZXdfXyhjbHMsIGFyZyk7XG4gICAgICAgIH0gZWxzZSBpZiAoYXJnIGluc3RhbmNlb2YgVHJ1ZSkge1xuICAgICAgICAgICAgcmV0dXJuIExvZ2ljLkZhbHNlO1xuICAgICAgICB9IGVsc2UgaWYgKGFyZyBpbnN0YW5jZW9mIEZhbHNlKSB7XG4gICAgICAgICAgICByZXR1cm4gTG9naWMuVHJ1ZTtcbiAgICAgICAgfSBlbHNlIGlmIChhcmcgaW5zdGFuY2VvZiBOb3QpIHtcbiAgICAgICAgICAgIHJldHVybiBhcmcuYXJnc1swXTtcbiAgICAgICAgfSBlbHNlIGlmIChhcmcgaW5zdGFuY2VvZiBMb2dpYykge1xuICAgICAgICAgICAgLy8gWFhYIHRoaXMgaXMgYSBoYWNrIHRvIGV4cGFuZCByaWdodCBmcm9tIHRoZSBiZWdpbm5pbmdcbiAgICAgICAgICAgIGFyZyA9IGFyZy5fZXZhbF9wcm9wYWdhdGVfbm90KCk7XG4gICAgICAgICAgICByZXR1cm4gYXJnO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiTm90OiB1bmtub3duIGFyZ3VtZW50IFwiICsgYXJnKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGFyZygpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuYXJnc1swXTtcbiAgICB9XG59XG5cbkxvZ2ljLlRydWUgPSBuZXcgVHJ1ZSgpO1xuTG9naWMuRmFsc2UgPSBuZXcgRmFsc2UoKTtcblxuZXhwb3J0IHtMb2dpYywgVHJ1ZSwgRmFsc2UsIEFuZCwgT3IsIE5vdCwgZnV6enlfYm9vbCwgZnV6enlfYW5kLCBmdXp6eV9ib29sX3YyLCBmdXp6eV9hbmRfdjJ9O1xuXG5cbiIsICIvKiBlc2xpbnQtZGlzYWJsZSBuZXctY2FwICovXG4vKiBUaGlzIGlzIHJ1bGUtYmFzZWQgZGVkdWN0aW9uIHN5c3RlbSBmb3IgU3ltUHlcblRoZSB3aG9sZSB0aGluZyBpcyBzcGxpdCBpbnRvIHR3byBwYXJ0c1xuIC0gcnVsZXMgY29tcGlsYXRpb24gYW5kIHByZXBhcmF0aW9uIG9mIHRhYmxlc1xuIC0gcnVudGltZSBpbmZlcmVuY2VcbkZvciBydWxlLWJhc2VkIGluZmVyZW5jZSBlbmdpbmVzLCB0aGUgY2xhc3NpY2FsIHdvcmsgaXMgUkVURSBhbGdvcml0aG0gWzFdLFxuWzJdIEFsdGhvdWdoIHdlIGFyZSBub3QgaW1wbGVtZW50aW5nIGl0IGluIGZ1bGwgKG9yIGV2ZW4gc2lnbmlmaWNhbnRseSlcbml0J3Mgc3RpbGwgd29ydGggYSByZWFkIHRvIHVuZGVyc3RhbmQgdGhlIHVuZGVybHlpbmcgaWRlYXMuXG5JbiBzaG9ydCwgZXZlcnkgcnVsZSBpbiBhIHN5c3RlbSBvZiBydWxlcyBpcyBvbmUgb2YgdHdvIGZvcm1zOlxuIC0gYXRvbSAgICAgICAgICAgICAgICAgICAgIC0+IC4uLiAgICAgIChhbHBoYSBydWxlKVxuIC0gQW5kKGF0b20xLCBhdG9tMiwgLi4uKSAgIC0+IC4uLiAgICAgIChiZXRhIHJ1bGUpXG5UaGUgbWFqb3IgY29tcGxleGl0eSBpcyBpbiBlZmZpY2llbnQgYmV0YS1ydWxlcyBwcm9jZXNzaW5nIGFuZCB1c3VhbGx5IGZvciBhblxuZXhwZXJ0IHN5c3RlbSBhIGxvdCBvZiBlZmZvcnQgZ29lcyBpbnRvIGNvZGUgdGhhdCBvcGVyYXRlcyBvbiBiZXRhLXJ1bGVzLlxuSGVyZSB3ZSB0YWtlIG1pbmltYWxpc3RpYyBhcHByb2FjaCB0byBnZXQgc29tZXRoaW5nIHVzYWJsZSBmaXJzdC5cbiAtIChwcmVwYXJhdGlvbikgICAgb2YgYWxwaGEtIGFuZCBiZXRhLSBuZXR3b3JrcywgZXZlcnl0aGluZyBleGNlcHRcbiAtIChydW50aW1lKSAgICAgICAgRmFjdFJ1bGVzLmRlZHVjZV9hbGxfZmFjdHNcbiAgICAgICAgICAgICBfX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fXG4gICAgICAgICAgICAoIEtpcnI6IEkndmUgbmV2ZXIgdGhvdWdodCB0aGF0IGRvaW5nIClcbiAgICAgICAgICAgICggbG9naWMgc3R1ZmYgaXMgdGhhdCBkaWZmaWN1bHQuLi4gICAgKVxuICAgICAgICAgICAgIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAgICAgICAgICAgICAgICAgbyAgIF5fX15cbiAgICAgICAgICAgICAgICAgICAgIG8gIChvbylcXF9fX19fX19cbiAgICAgICAgICAgICAgICAgICAgICAgIChfXylcXCAgICAgICApXFwvXFxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB8fC0tLS13IHxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB8fCAgICAgfHxcblNvbWUgcmVmZXJlbmNlcyBvbiB0aGUgdG9waWNcbi0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblsxXSBodHRwczovL2VuLndpa2lwZWRpYS5vcmcvd2lraS9SZXRlX2FsZ29yaXRobVxuWzJdIGh0dHA6Ly9yZXBvcnRzLWFyY2hpdmUuYWRtLmNzLmNtdS5lZHUvYW5vbi8xOTk1L0NNVS1DUy05NS0xMTMucGRmXG5odHRwczovL2VuLndpa2lwZWRpYS5vcmcvd2lraS9Qcm9wb3NpdGlvbmFsX2Zvcm11bGFcbmh0dHBzOi8vZW4ud2lraXBlZGlhLm9yZy93aWtpL0luZmVyZW5jZV9ydWxlXG5odHRwczovL2VuLndpa2lwZWRpYS5vcmcvd2lraS9MaXN0X29mX3J1bGVzX29mX2luZmVyZW5jZVxuKi9cblxuLypcblxuU2lnbmlmaWNhbnQgY2hhbmdlcyBtYWRlIChXQiBhbmQgR00pOlxuLSBDcmVhdGVkIHRoZSBJbXBsaWNhdGlvbiBjbGFzcywgdXNlIHRvIHJlcHJlc2VudCB0aGUgaW1wbGljYXRpb24gcCAtPiBxIHdoaWNoXG4gIGlzIHN0b3JlZCBhcyBhIHR1cGxlIGluIHN5bXB5XG4tIENyZWF0ZWQgdGhlIFNldERlZmF1bHREaWN0LCBIYXNoRGljdCBhbmQgSGFzaFNldCBjbGFzc2VzLiBTZXREZWZhdWx0RGljdCBhY3RzXG4gIGFzIGEgcmVwbGNhY2VtZW50IGRlZmF1bHRkaWN0KHNldCksIGFuZCBIYXNoRGljdCBhbmQgSGFzaFNldCByZXBsYWNlIHRoZVxuICBkaWN0IGFuZCBzZXQgY2xhc3Nlcy5cbi0gQWRkZWQgaXNTdWJzZXQoKSB0byB0aGUgdXRpbGl0eSBjbGFzcyB0byBoZWxwIHdpdGggdGhpcyBwcm9ncmFtXG5cbiovXG5cblxuaW1wb3J0IHtTdGRGYWN0S0J9IGZyb20gXCIuL2Fzc3VtcHRpb25zXCI7XG5pbXBvcnQge0xvZ2ljLCBUcnVlLCBGYWxzZSwgQW5kLCBPciwgTm90fSBmcm9tIFwiLi9sb2dpY1wiO1xuXG5pbXBvcnQge1V0aWwsIEhhc2hTZXQsIFNldERlZmF1bHREaWN0LCBBcnJEZWZhdWx0RGljdCwgSGFzaERpY3QsIEltcGxpY2F0aW9ufSBmcm9tIFwiLi91dGlsaXR5XCI7XG5cblxuZnVuY3Rpb24gX2Jhc2VfZmFjdChhdG9tOiBhbnkpIHtcbiAgICAvKiAgUmV0dXJuIHRoZSBsaXRlcmFsIGZhY3Qgb2YgYW4gYXRvbS5cbiAgICBFZmZlY3RpdmVseSwgdGhpcyBtZXJlbHkgc3RyaXBzIHRoZSBOb3QgYXJvdW5kIGEgZmFjdC5cbiAgICAqL1xuICAgIGlmIChhdG9tIGluc3RhbmNlb2YgTm90KSB7XG4gICAgICAgIHJldHVybiBhdG9tLmFyZygpO1xuICAgIH0gZWxzZSB7XG4gICAgICAgIHJldHVybiBhdG9tO1xuICAgIH1cbn1cblxuXG5mdW5jdGlvbiBfYXNfcGFpcihhdG9tOiBhbnkpIHtcbiAgICAvKiAgUmV0dXJuIHRoZSBsaXRlcmFsIGZhY3Qgb2YgYW4gYXRvbS5cbiAgICBFZmZlY3RpdmVseSwgdGhpcyBtZXJlbHkgc3RyaXBzIHRoZSBOb3QgYXJvdW5kIGEgZmFjdC5cbiAgICAqL1xuICAgIGlmIChhdG9tIGluc3RhbmNlb2YgTm90KSB7XG4gICAgICAgIHJldHVybiBuZXcgSW1wbGljYXRpb24oYXRvbS5hcmcoKSwgTG9naWMuRmFsc2UpO1xuICAgIH0gZWxzZSB7XG4gICAgICAgIHJldHVybiBuZXcgSW1wbGljYXRpb24oYXRvbSwgTG9naWMuVHJ1ZSk7XG4gICAgfVxufVxuXG5cbmZ1bmN0aW9uIF9hc19wYWlydjIoYXRvbTogYW55KSB7XG4gICAgLyogIFJldHVybiB0aGUgbGl0ZXJhbCBmYWN0IG9mIGFuIGF0b20uXG4gICAgRWZmZWN0aXZlbHksIHRoaXMgbWVyZWx5IHN0cmlwcyB0aGUgTm90IGFyb3VuZCBhIGZhY3QuXG4gICAgKi9cbiAgICBpZiAoYXRvbSBpbnN0YW5jZW9mIE5vdCkge1xuICAgICAgICByZXR1cm4gbmV3IEltcGxpY2F0aW9uKGF0b20uYXJnKCksIGZhbHNlKTtcbiAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4gbmV3IEltcGxpY2F0aW9uKGF0b20sIHRydWUpO1xuICAgIH1cbn1cblxuLy8gWFhYIHRoaXMgcHJlcGFyZXMgZm9yd2FyZC1jaGFpbmluZyBydWxlcyBmb3IgYWxwaGEtbmV0d29ya1xuXG5mdW5jdGlvbiB0cmFuc2l0aXZlX2Nsb3N1cmUoaW1wbGljYXRpb25zOiBJbXBsaWNhdGlvbltdKSB7XG4gICAgLypcbiAgICBDb21wdXRlcyB0aGUgdHJhbnNpdGl2ZSBjbG9zdXJlIG9mIGEgbGlzdCBvZiBpbXBsaWNhdGlvbnNcbiAgICBVc2VzIFdhcnNoYWxsJ3MgYWxnb3JpdGhtLCBhcyBkZXNjcmliZWQgYXRcbiAgICBodHRwOi8vd3d3LmNzLmhvcGUuZWR1L35jdXNhY2svTm90ZXMvTm90ZXMvRGlzY3JldGVNYXRoL1dhcnNoYWxsLnBkZi5cbiAgICAqL1xuICAgIGxldCB0ZW1wID0gbmV3IEFycmF5KCk7XG4gICAgZm9yIChjb25zdCBpbXBsIG9mIGltcGxpY2F0aW9ucykge1xuICAgICAgICB0ZW1wLnB1c2goaW1wbC5wKTtcbiAgICAgICAgdGVtcC5wdXNoKGltcGwucSk7XG4gICAgfVxuICAgIHRlbXAgPSB0ZW1wLmZsYXQoKTtcbiAgICBjb25zdCBmdWxsX2ltcGxpY2F0aW9ucyA9IG5ldyBIYXNoU2V0KGltcGxpY2F0aW9ucyk7XG4gICAgY29uc3QgbGl0ZXJhbHMgPSBuZXcgSGFzaFNldCh0ZW1wKTtcbiAgICBcbiAgICBmb3IgKGNvbnN0IGsgb2YgbGl0ZXJhbHMudG9BcnJheSgpKSB7XG4gICAgICAgIGZvciAoY29uc3QgaSBvZiBsaXRlcmFscy50b0FycmF5KCkpIHtcbiAgICAgICAgICAgIGlmIChmdWxsX2ltcGxpY2F0aW9ucy5oYXMobmV3IEltcGxpY2F0aW9uKGksIGspKSkge1xuICAgICAgICAgICAgICAgIGZvciAoY29uc3QgaiBvZiBsaXRlcmFscy50b0FycmF5KCkpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGZ1bGxfaW1wbGljYXRpb25zLmhhcyhuZXcgSW1wbGljYXRpb24oaywgaikpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBmdWxsX2ltcGxpY2F0aW9ucy5hZGQobmV3IEltcGxpY2F0aW9uKGksIGopKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gZnVsbF9pbXBsaWNhdGlvbnM7XG59XG5cblxuZnVuY3Rpb24gZGVkdWNlX2FscGhhX2ltcGxpY2F0aW9ucyhpbXBsaWNhdGlvbnM6IEltcGxpY2F0aW9uW10pIHtcbiAgICAvKiBkZWR1Y2UgYWxsIGltcGxpY2F0aW9uc1xuICAgICAgIERlc2NyaXB0aW9uIGJ5IGV4YW1wbGVcbiAgICAgICAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgICAgZ2l2ZW4gc2V0IG9mIGxvZ2ljIHJ1bGVzOlxuICAgICAgICAgYSAtPiBiXG4gICAgICAgICBiIC0+IGNcbiAgICAgICB3ZSBkZWR1Y2UgYWxsIHBvc3NpYmxlIHJ1bGVzOlxuICAgICAgICAgYSAtPiBiLCBjXG4gICAgICAgICBiIC0+IGNcbiAgICAgICBpbXBsaWNhdGlvbnM6IFtdIG9mIChhLGIpXG4gICAgICAgcmV0dXJuOiAgICAgICB7fSBvZiBhIC0+IHNldChbYiwgYywgLi4uXSlcbiAgICAgICAqL1xuICAgIGNvbnN0IG5ld19hcnI6IGFueVtdID0gW107XG4gICAgZm9yIChjb25zdCBpbXBsIG9mIGltcGxpY2F0aW9ucykge1xuICAgICAgICBuZXdfYXJyLnB1c2gobmV3IEltcGxpY2F0aW9uKE5vdC5OZXcoaW1wbC5xKSwgTm90Lk5ldyhpbXBsLnApKSk7XG4gICAgfVxuICAgIGltcGxpY2F0aW9ucyA9IGltcGxpY2F0aW9ucy5jb25jYXQobmV3X2Fycik7XG4gICAgY29uc3QgcmVzID0gbmV3IFNldERlZmF1bHREaWN0KCk7XG4gICAgY29uc3QgZnVsbF9pbXBsaWNhdGlvbnMgPSB0cmFuc2l0aXZlX2Nsb3N1cmUoaW1wbGljYXRpb25zKTtcbiAgICBmb3IgKGNvbnN0IGltcGwgb2YgZnVsbF9pbXBsaWNhdGlvbnMudG9BcnJheSgpKSB7XG4gICAgICAgIGlmIChpbXBsLnAgPT09IGltcGwucSkge1xuICAgICAgICAgICAgY29udGludWU7IC8vIHNraXAgYS0+YSBjeWNsaWMgaW5wdXRcbiAgICAgICAgfVxuICAgICAgICBjb25zdCBjdXJyU2V0ID0gcmVzLmdldChpbXBsLnApO1xuICAgICAgICBjdXJyU2V0LmFkZChpbXBsLnEpO1xuICAgICAgICByZXMuYWRkKGltcGwucCwgY3VyclNldCk7XG4gICAgfVxuICAgIC8vIENsZWFuIHVwIHRhdXRvbG9naWVzIGFuZCBjaGVjayBjb25zaXN0ZW5jeVxuICAgIC8vIGltcGwgaXMgdGhlIHNldFxuICAgIGZvciAoY29uc3QgaXRlbSBvZiByZXMuZW50cmllcygpKSB7XG4gICAgICAgIGNvbnN0IGEgPSBpdGVtWzBdO1xuICAgICAgICBjb25zdCBpbXBsOiBIYXNoU2V0ID0gaXRlbVsxXTtcbiAgICAgICAgaW1wbC5yZW1vdmUoYSk7XG4gICAgICAgIGNvbnN0IG5hID0gTm90Lk5ldyhhKTtcbiAgICAgICAgaWYgKGltcGwuaGFzKG5hKSkge1xuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiaW1wbGljYXRpb25zIGFyZSBpbmNvbnNpc3RlbnQ6IFwiICsgYSArIFwiIC0+IFwiICsgbmEgKyBcIiBcIiArIGltcGwpO1xuICAgICAgICB9XG4gICAgfVxuICAgIHJldHVybiByZXM7XG59XG5cbmZ1bmN0aW9uIGFwcGx5X2JldGFfdG9fYWxwaGFfcm91dGUoYWxwaGFfaW1wbGljYXRpb25zOiBIYXNoRGljdCwgYmV0YV9ydWxlczogYW55W10pIHtcbiAgICAvKiBhcHBseSBhZGRpdGlvbmFsIGJldGEtcnVsZXMgKEFuZCBjb25kaXRpb25zKSB0byBhbHJlYWR5LWJ1aWx0XG4gICAgYWxwaGEgaW1wbGljYXRpb24gdGFibGVzXG4gICAgICAgVE9ETzogd3JpdGUgYWJvdXRcbiAgICAgICAtIHN0YXRpYyBleHRlbnNpb24gb2YgYWxwaGEtY2hhaW5zXG4gICAgICAgLSBhdHRhY2hpbmcgcmVmcyB0byBiZXRhLW5vZGVzIHRvIGFscGhhIGNoYWluc1xuICAgICAgIGUuZy5cbiAgICAgICBhbHBoYV9pbXBsaWNhdGlvbnM6XG4gICAgICAgYSAgLT4gIFtiLCAhYywgZF1cbiAgICAgICBiICAtPiAgW2RdXG4gICAgICAgLi4uXG4gICAgICAgYmV0YV9ydWxlczpcbiAgICAgICAmKGIsZCkgLT4gZVxuICAgICAgIHRoZW4gd2UnbGwgZXh0ZW5kIGEncyBydWxlIHRvIHRoZSBmb2xsb3dpbmdcbiAgICAgICBhICAtPiAgW2IsICFjLCBkLCBlXVxuICAgICovXG5cbiAgICAvLyBpcyBiZXRhX3J1bGVzIGFuIGFycmF5IG9yIGEgZGljdGlvbmFyeT9cblxuICAgIGNvbnN0IHhfaW1wbDogSGFzaERpY3QgPSBuZXcgSGFzaERpY3QoKTtcbiAgICBmb3IgKGNvbnN0IHggb2YgYWxwaGFfaW1wbGljYXRpb25zLmtleXMoKSkge1xuICAgICAgICBjb25zdCBuZXdzZXQgPSBuZXcgSGFzaFNldCgpO1xuICAgICAgICBuZXdzZXQuYWRkQXJyKGFscGhhX2ltcGxpY2F0aW9ucy5nZXQoeCkudG9BcnJheSgpKTtcbiAgICAgICAgY29uc3QgaW1wID0gbmV3IEltcGxpY2F0aW9uKG5ld3NldCwgW10pO1xuICAgICAgICB4X2ltcGwuYWRkKHgsIGltcCk7XG4gICAgfVxuICAgIGZvciAoY29uc3QgaXRlbSBvZiBiZXRhX3J1bGVzKSB7XG4gICAgICAgIGNvbnN0IGJjb25kID0gaXRlbS5wO1xuICAgICAgICBmb3IgKGNvbnN0IGJrIG9mIGJjb25kLmFyZ3MpIHtcbiAgICAgICAgICAgIGlmICh4X2ltcGwuaGFzKGJrKSkge1xuICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgY29uc3QgaW1wID0gbmV3IEltcGxpY2F0aW9uKG5ldyBIYXNoU2V0KCksIFtdKTtcbiAgICAgICAgICAgIHhfaW1wbC5hZGQoYmssIGltcCk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgLy8gc3RhdGljIGV4dGVuc2lvbnMgdG8gYWxwaGEgcnVsZXM6XG4gICAgLy8gQTogeCAtPiBhLGIgICBCOiAmKGEsYikgLT4gYyAgPT0+ICBBOiB4IC0+IGEsYixjXG5cbiAgICBsZXQgc2Vlbl9zdGF0aWNfZXh0ZW5zaW9uOiBMb2dpYyA9IExvZ2ljLlRydWU7XG4gICAgd2hpbGUgKHNlZW5fc3RhdGljX2V4dGVuc2lvbiBpbnN0YW5jZW9mIFRydWUpIHtcbiAgICAgICAgc2Vlbl9zdGF0aWNfZXh0ZW5zaW9uID0gTG9naWMuRmFsc2U7XG5cbiAgICAgICAgZm9yIChjb25zdCBpbXBsIG9mIGJldGFfcnVsZXMpIHtcbiAgICAgICAgICAgIGNvbnN0IGJjb25kID0gaW1wbC5wO1xuICAgICAgICAgICAgY29uc3QgYmltcGwgPSBpbXBsLnE7XG4gICAgICAgICAgICBpZiAoIShiY29uZCBpbnN0YW5jZW9mIEFuZCkpIHtcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJDb25kIGlzIG5vdCBBbmRcIik7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBjb25zdCBiYXJncyA9IG5ldyBIYXNoU2V0KGJjb25kLmFyZ3MpO1xuICAgICAgICAgICAgZm9yIChjb25zdCBpdGVtIG9mIHhfaW1wbC5lbnRyaWVzKCkpIHtcbiAgICAgICAgICAgICAgICBjb25zdCB4ID0gaXRlbVswXTtcbiAgICAgICAgICAgICAgICBjb25zdCBpbXBsID0gaXRlbVsxXTtcbiAgICAgICAgICAgICAgICBsZXQgeGltcGxzID0gaW1wbC5wO1xuICAgICAgICAgICAgICAgIGNvbnN0IHhfYWxsID0geGltcGxzLmNsb25lKClcbiAgICAgICAgICAgICAgICB4X2FsbC5hZGQoeCk7XG4gICAgICAgICAgICAgICAgLy8gQTogLi4uIC0+IGEgICBCOiAmKC4uLikgLT4gYSAgaXMgbm9uLWluZm9ybWF0aXZlXG4gICAgICAgICAgICAgICAgaWYgKCF4X2FsbC5oYXMoYmltcGwpICYmIFV0aWwuaXNTdWJzZXQoYmFyZ3MudG9BcnJheSgpLCB4X2FsbC50b0FycmF5KCkpKSB7XG4gICAgICAgICAgICAgICAgICAgIHhpbXBscy5hZGQoYmltcGwpO1xuXG4gICAgICAgICAgICAgICAgICAgIC8vIHdlIGludHJvZHVjZWQgbmV3IGltcGxpY2F0aW9uIC0gbm93IHdlIGhhdmUgdG8gcmVzdG9yZVxuICAgICAgICAgICAgICAgICAgICAvLyBjb21wbGV0ZW5lc3Mgb2YgdGhlIHdob2xlIHNldC5cblxuICAgICAgICAgICAgICAgICAgICBjb25zdCBiaW1wbF9pbXBsID0geF9pbXBsLmdldChiaW1wbCk7XG4gICAgICAgICAgICAgICAgICAgIGlmIChiaW1wbF9pbXBsICE9IG51bGwpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHhpbXBscyB8PSBiaW1wbF9pbXBsWzBdO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIHNlZW5fc3RhdGljX2V4dGVuc2lvbiA9IExvZ2ljLlRydWU7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuICAgIC8vIGF0dGFjaCBiZXRhLW5vZGVzIHdoaWNoIGNhbiBiZSBwb3NzaWJseSB0cmlnZ2VyZWQgYnkgYW4gYWxwaGEtY2hhaW5cbiAgICBmb3IgKGxldCBiaWR4ID0gMDsgYmlkeCA8IGJldGFfcnVsZXMubGVuZ3RoOyBiaWR4KyspIHtcbiAgICAgICAgY29uc3QgaW1wbCA9IGJldGFfcnVsZXNbYmlkeF07XG4gICAgICAgIGNvbnN0IGJjb25kID0gaW1wbC5wO1xuICAgICAgICBjb25zdCBiaW1wbCA9IGltcGwucTtcbiAgICAgICAgY29uc3QgYmFyZ3MgPSBuZXcgSGFzaFNldChiY29uZC5hcmdzKTtcbiAgICAgICAgZm9yIChjb25zdCBpdGVtIG9mIHhfaW1wbC5lbnRyaWVzKCkpIHtcbiAgICAgICAgICAgIGNvbnN0IHggPSBpdGVtWzBdO1xuICAgICAgICAgICAgY29uc3QgdmFsdWU6IEltcGxpY2F0aW9uID0gaXRlbVsxXTtcbiAgICAgICAgICAgIGNvbnN0IHhpbXBscyA9IHZhbHVlLnA7XG4gICAgICAgICAgICBjb25zdCBiYiA9IHZhbHVlLnE7XG4gICAgICAgICAgICBjb25zdCB4X2FsbCA9IHhpbXBscy5jbG9uZSgpXG4gICAgICAgICAgICB4X2FsbC5hZGQoeCk7XG4gICAgICAgICAgICBpZiAoeF9hbGwuaGFzKGJpbXBsKSkge1xuICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKHhfYWxsLnRvQXJyYXkoKS5zb21lKChlOiBhbnkpID0+IChiYXJncy5oYXMoTm90Lk5ldyhlKSkgfHwgVXRpbC5oYXNoS2V5KE5vdC5OZXcoZSkpID09PSBVdGlsLmhhc2hLZXkoYmltcGwpKSkpIHtcbiAgICAgICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChiYXJncy5pbnRlcnNlY3RzKHhfYWxsKSkge1xuICAgICAgICAgICAgICAgIGJiLnB1c2goYmlkeCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIHhfaW1wbDtcbn1cblxuXG5mdW5jdGlvbiBydWxlc18ycHJlcmVxKHJ1bGVzOiBTZXREZWZhdWx0RGljdCkge1xuICAgIC8qIGJ1aWxkIHByZXJlcXVpc2l0ZXMgdGFibGUgZnJvbSBydWxlc1xuICAgICAgIERlc2NyaXB0aW9uIGJ5IGV4YW1wbGVcbiAgICAgICAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgICAgZ2l2ZW4gc2V0IG9mIGxvZ2ljIHJ1bGVzOlxuICAgICAgICAgYSAtPiBiLCBjXG4gICAgICAgICBiIC0+IGNcbiAgICAgICB3ZSBidWlsZCBwcmVyZXF1aXNpdGVzIChmcm9tIHdoYXQgcG9pbnRzIHNvbWV0aGluZyBjYW4gYmUgZGVkdWNlZCk6XG4gICAgICAgICBiIDwtIGFcbiAgICAgICAgIGMgPC0gYSwgYlxuICAgICAgIHJ1bGVzOiAgIHt9IG9mIGEgLT4gW2IsIGMsIC4uLl1cbiAgICAgICByZXR1cm46ICB7fSBvZiBjIDwtIFthLCBiLCAuLi5dXG4gICAgICAgTm90ZSBob3dldmVyLCB0aGF0IHRoaXMgcHJlcmVxdWlzaXRlcyBtYXkgYmUgKm5vdCogZW5vdWdoIHRvIHByb3ZlIGFcbiAgICAgICBmYWN0LiBBbiBleGFtcGxlIGlzICdhIC0+IGInIHJ1bGUsIHdoZXJlIHByZXJlcShhKSBpcyBiLCBhbmQgcHJlcmVxKGIpXG4gICAgICAgaXMgYS4gVGhhdCdzIGJlY2F1c2UgYT1UIC0+IGI9VCwgYW5kIGI9RiAtPiBhPUYsIGJ1dCBhPUYgLT4gYj0/XG4gICAgKi9cblxuICAgIGNvbnN0IHByZXJlcSA9IG5ldyBTZXREZWZhdWx0RGljdCgpO1xuICAgIGZvciAoY29uc3QgaXRlbSBvZiBydWxlcy5lbnRyaWVzKCkpIHtcbiAgICAgICAgbGV0IGEgPSBpdGVtWzBdLnA7XG4gICAgICAgIGNvbnN0IGltcGwgPSBpdGVtWzFdO1xuICAgICAgICBpZiAoYSBpbnN0YW5jZW9mIE5vdCkge1xuICAgICAgICAgICAgYSA9IGEuYXJnc1swXTtcbiAgICAgICAgfVxuICAgICAgICBmb3IgKGNvbnN0IGl0ZW0gb2YgaW1wbC50b0FycmF5KCkpIHtcbiAgICAgICAgICAgIGxldCBpID0gaXRlbS5wO1xuICAgICAgICAgICAgaWYgKGkgaW5zdGFuY2VvZiBOb3QpIHtcbiAgICAgICAgICAgICAgICBpID0gaS5hcmdzWzBdO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgY29uc3QgdG9BZGQgPSBwcmVyZXEuZ2V0KGkpO1xuICAgICAgICAgICAgdG9BZGQuYWRkKGEpO1xuICAgICAgICAgICAgcHJlcmVxLmFkZChpLCB0b0FkZCk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIHByZXJlcTtcbn1cblxuXG4vLyAvLy8vLy8vLy8vLy8vLy8vXG4vLyBSVUxFUyBQUk9WRVIgLy9cbi8vIC8vLy8vLy8vLy8vLy8vLy9cblxuY2xhc3MgVGF1dG9sb2d5RGV0ZWN0ZWQgZXh0ZW5kcyBFcnJvciB7XG4gICAgYXJncztcblxuICAgIGNvbnN0cnVjdG9yKC4uLmFyZ3M6IGFueVtdKSB7XG4gICAgICAgIHN1cGVyKCk7XG4gICAgICAgIHRoaXMuYXJncyA9IGFyZ3M7XG4gICAgfVxuICAgIC8vIChpbnRlcm5hbCkgUHJvdmVyIHVzZXMgaXQgZm9yIHJlcG9ydGluZyBkZXRlY3RlZCB0YXV0b2xvZ3lcbn1cblxuY2xhc3MgUHJvdmVyIHtcbiAgICAvKiBhaSAtIHByb3ZlciBvZiBsb2dpYyBydWxlc1xuICAgICAgIGdpdmVuIGEgc2V0IG9mIGluaXRpYWwgcnVsZXMsIFByb3ZlciB0cmllcyB0byBwcm92ZSBhbGwgcG9zc2libGUgcnVsZXNcbiAgICAgICB3aGljaCBmb2xsb3cgZnJvbSBnaXZlbiBwcmVtaXNlcy5cbiAgICAgICBBcyBhIHJlc3VsdCBwcm92ZWRfcnVsZXMgYXJlIGFsd2F5cyBlaXRoZXIgaW4gb25lIG9mIHR3byBmb3JtczogYWxwaGEgb3JcbiAgICAgICBiZXRhOlxuICAgICAgIEFscGhhIHJ1bGVzXG4gICAgICAgLS0tLS0tLS0tLS1cbiAgICAgICBUaGlzIGFyZSBydWxlcyBvZiB0aGUgZm9ybTo6XG4gICAgICAgICBhIC0+IGIgJiBjICYgZCAmIC4uLlxuICAgICAgIEJldGEgcnVsZXNcbiAgICAgICAtLS0tLS0tLS0tXG4gICAgICAgVGhpcyBhcmUgcnVsZXMgb2YgdGhlIGZvcm06OlxuICAgICAgICAgJihhLGIsLi4uKSAtPiBjICYgZCAmIC4uLlxuICAgICAgIGkuZS4gYmV0YSBydWxlcyBhcmUgam9pbiBjb25kaXRpb25zIHRoYXQgc2F5IHRoYXQgc29tZXRoaW5nIGZvbGxvd3Mgd2hlblxuICAgICAgICpzZXZlcmFsKiBmYWN0cyBhcmUgdHJ1ZSBhdCB0aGUgc2FtZSB0aW1lLlxuICAgICovXG5cbiAgICBwcm92ZWRfcnVsZXM6IGFueVtdO1xuICAgIF9ydWxlc19zZWVuO1xuXG4gICAgY29uc3RydWN0b3IoKSB7XG4gICAgICAgIHRoaXMucHJvdmVkX3J1bGVzID0gW107XG4gICAgICAgIHRoaXMuX3J1bGVzX3NlZW4gPSBuZXcgSGFzaFNldCgpO1xuICAgIH1cblxuICAgIHNwbGl0X2FscGhhX2JldGEoKSB7XG4gICAgICAgIC8vIHNwbGl0IHByb3ZlZCBydWxlcyBpbnRvIGFscGhhIGFuZCBiZXRhIGNoYWluc1xuICAgICAgICBjb25zdCBydWxlc19hbHBoYSA9IFtdOyAvLyBhICAgICAgLT4gYlxuICAgICAgICBjb25zdCBydWxlc19iZXRhID0gW107IC8vICYoLi4uKSAtPiBiXG4gICAgICAgIGZvciAoY29uc3QgaW1wbCBvZiB0aGlzLnByb3ZlZF9ydWxlcykge1xuICAgICAgICAgICAgY29uc3QgYSA9IGltcGwucDtcbiAgICAgICAgICAgIGNvbnN0IGIgPSBpbXBsLnE7XG4gICAgICAgICAgICBpZiAoYSBpbnN0YW5jZW9mIEFuZCkge1xuICAgICAgICAgICAgICAgIHJ1bGVzX2JldGEucHVzaChuZXcgSW1wbGljYXRpb24oYSwgYikpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBydWxlc19hbHBoYS5wdXNoKG5ldyBJbXBsaWNhdGlvbihhLCBiKSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIFtydWxlc19hbHBoYSwgcnVsZXNfYmV0YV07XG4gICAgfVxuXG4gICAgcnVsZXNfYWxwaGEoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLnNwbGl0X2FscGhhX2JldGEoKVswXTtcbiAgICB9XG5cbiAgICBydWxlc19iZXRhKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5zcGxpdF9hbHBoYV9iZXRhKClbMV07XG4gICAgfVxuXG4gICAgcHJvY2Vzc19ydWxlKGE6IGFueSwgYjogYW55KSB7XG4gICAgICAgIC8vIHByb2Nlc3MgYSAtPiBiIHJ1bGUgIC0+ICBUT0RPIHdyaXRlIG1vcmU/XG4gICAgICAgIGlmICghYSB8fCAoYiBpbnN0YW5jZW9mIFRydWUgfHwgYiBpbnN0YW5jZW9mIEZhbHNlKSkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIGlmIChhIGluc3RhbmNlb2YgVHJ1ZSB8fCBhIGluc3RhbmNlb2YgRmFsc2UpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICBpZiAodGhpcy5fcnVsZXNfc2Vlbi5oYXMobmV3IEltcGxpY2F0aW9uKGEsIGIpKSkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5fcnVsZXNfc2Vlbi5hZGQobmV3IEltcGxpY2F0aW9uKGEsIGIpKTtcbiAgICAgICAgfVxuICAgICAgICAvLyB0aGlzIGlzIHRoZSBjb3JlIG9mIHRoZSBwcm9jZXNzaW5nXG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICB0aGlzLl9wcm9jZXNzX3J1bGUoYSwgYik7XG4gICAgICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICAgICAgICBpZiAoIShlcnJvciBpbnN0YW5jZW9mIFRhdXRvbG9neURldGVjdGVkKSkge1xuICAgICAgICAgICAgICAgIHRocm93IEVycm9yO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgX3Byb2Nlc3NfcnVsZShhOiBhbnksIGI6IGFueSkge1xuICAgICAgICAvLyByaWdodCBwYXJ0IGZpcnN0XG5cbiAgICAgICAgLy8gYSAtPiBiICYgYyAgIC0tPiAgICBhLT4gYiAgOyAgYSAtPiBjXG5cbiAgICAgICAgLy8gICg/KSBGSVhNRSB0aGlzIGlzIG9ubHkgY29ycmVjdCB3aGVuIGIgJiBjICE9IG51bGwgIVxuXG4gICAgICAgIGlmIChiIGluc3RhbmNlb2YgQW5kKSB7XG4gICAgICAgICAgICBmb3IgKGNvbnN0IGJhcmcgb2YgYi5hcmdzKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5wcm9jZXNzX3J1bGUoYSwgYmFyZyk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSBpZiAoYiBpbnN0YW5jZW9mIE9yKSB7XG4gICAgICAgICAgICAvLyBkZXRlY3QgdGF1dG9sb2d5IGZpcnN0XG4gICAgICAgICAgICBpZiAoIShhIGluc3RhbmNlb2YgTG9naWMpKSB7IC8vIGF0b21cbiAgICAgICAgICAgICAgICAvLyB0YXV0b2xvZ3k6ICBhIC0+IGF8Y3wuLi5cbiAgICAgICAgICAgICAgICBpZiAoYi5hcmdzLmluY2x1ZGVzKGEpKSB7XG4gICAgICAgICAgICAgICAgICAgIHRocm93IG5ldyBUYXV0b2xvZ3lEZXRlY3RlZChhLCBiLCBcImEgLT4gYXxjfC4uLlwiKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBjb25zdCBub3RfYmFyZ3M6IGFueVtdID0gW107XG4gICAgICAgICAgICBmb3IgKGNvbnN0IGJhcmcgb2YgYi5hcmdzKSB7XG4gICAgICAgICAgICAgICAgbm90X2JhcmdzLnB1c2goTm90Lk5ldyhiYXJnKSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB0aGlzLnByb2Nlc3NfcnVsZShBbmQuTmV3KC4uLm5vdF9iYXJncyksIE5vdC5OZXcoYSkpO1xuXG4gICAgICAgICAgICBmb3IgKGxldCBiaWR4ID0gMDsgYmlkeCA8IGIuYXJncy5sZW5ndGg7IGJpZHgrKykge1xuICAgICAgICAgICAgICAgIGNvbnN0IGJhcmcgPSBiLmFyZ3NbYmlkeF07XG4gICAgICAgICAgICAgICAgY29uc3QgYnJlc3QgPSBiLmFyZ3Muc2xpY2UoMCwgYmlkeCkuY29uY2F0KGIuYXJncy5zbGljZShiaWR4ICsgMSkpO1xuICAgICAgICAgICAgICAgIC8vIGNvbnN0IGJyZXN0ID0gWy4uLmIuYXJnc10uc3BsaWNlKGJpZHgsIDEpO1xuICAgICAgICAgICAgICAgIHRoaXMucHJvY2Vzc19ydWxlKEFuZC5OZXcoYSwgTm90Lk5ldyhiYXJnKSksIE9yLk5ldyguLi5icmVzdCkpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9IGVsc2UgaWYgKGEgaW5zdGFuY2VvZiBBbmQpIHtcbiAgICAgICAgICAgIGlmIChhLmFyZ3MuaW5jbHVkZXMoYikpIHtcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgVGF1dG9sb2d5RGV0ZWN0ZWQoYSwgYiwgXCJhICYgYiAtPiBhXCIpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdGhpcy5wcm92ZWRfcnVsZXMucHVzaChuZXcgSW1wbGljYXRpb24oYSwgYikpO1xuICAgICAgICAgICAgLy8gWFhYIE5PVEUgYXQgcHJlc2VudCB3ZSBpZ25vcmUgICFjIC0+ICFhIHwgIWJcbiAgICAgICAgfSBlbHNlIGlmIChhIGluc3RhbmNlb2YgT3IpIHtcbiAgICAgICAgICAgIGlmIChhLmFyZ3MuaW5jbHVkZXMoYikpIHtcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgVGF1dG9sb2d5RGV0ZWN0ZWQoYSwgYiwgXCJhICYgYiAtPiBhXCIpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZm9yIChjb25zdCBhYXJnIG9mIGEuYXJncykge1xuICAgICAgICAgICAgICAgIHRoaXMucHJvY2Vzc19ydWxlKGFhcmcsIGIpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgLy8gYm90aCAnYScgYW5kICdiJyBhcmUgYXRvbXNcbiAgICAgICAgICAgIHRoaXMucHJvdmVkX3J1bGVzLnB1c2gobmV3IEltcGxpY2F0aW9uKGEsIGIpKTsgLy8gYSAtPiBiXG4gICAgICAgICAgICB0aGlzLnByb3ZlZF9ydWxlcy5wdXNoKG5ldyBJbXBsaWNhdGlvbihOb3QuTmV3KGIpLCBOb3QuTmV3KGEpKSk7XG4gICAgICAgIH1cbiAgICB9XG59XG5cbi8vIC8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXG5cbmV4cG9ydCBjbGFzcyBGYWN0UnVsZXMge1xuICAgIC8qIFJ1bGVzIHRoYXQgZGVzY3JpYmUgaG93IHRvIGRlZHVjZSBmYWN0cyBpbiBsb2dpYyBzcGFjZVxuICAgIFdoZW4gZGVmaW5lZCwgdGhlc2UgcnVsZXMgYWxsb3cgaW1wbGljYXRpb25zIHRvIHF1aWNrbHkgYmUgZGV0ZXJtaW5lZFxuICAgIGZvciBhIHNldCBvZiBmYWN0cy4gRm9yIHRoaXMgcHJlY29tcHV0ZWQgZGVkdWN0aW9uIHRhYmxlcyBhcmUgdXNlZC5cbiAgICBzZWUgYGRlZHVjZV9hbGxfZmFjdHNgICAgKGZvcndhcmQtY2hhaW5pbmcpXG4gICAgQWxzbyBpdCBpcyBwb3NzaWJsZSB0byBnYXRoZXIgcHJlcmVxdWlzaXRlcyBmb3IgYSBmYWN0LCB3aGljaCBpcyB0cmllZFxuICAgIHRvIGJlIHByb3Zlbi4gICAgKGJhY2t3YXJkLWNoYWluaW5nKVxuICAgIERlZmluaXRpb24gU3ludGF4XG4gICAgLS0tLS0tLS0tLS0tLS0tLS1cbiAgICBhIC0+IGIgICAgICAgLS0gYT1UIC0+IGI9VCAgKGFuZCBhdXRvbWF0aWNhbGx5IGI9RiAtPiBhPUYpXG4gICAgYSAtPiAhYiAgICAgIC0tIGE9VCAtPiBiPUZcbiAgICBhID09IGIgICAgICAgLS0gYSAtPiBiICYgYiAtPiBhXG4gICAgYSAtPiBiICYgYyAgIC0tIGE9VCAtPiBiPVQgJiBjPVRcbiAgICAjIFRPRE8gYiB8IGNcbiAgICBJbnRlcm5hbHNcbiAgICAtLS0tLS0tLS1cbiAgICAuZnVsbF9pbXBsaWNhdGlvbnNbaywgdl06IGFsbCB0aGUgaW1wbGljYXRpb25zIG9mIGZhY3Qgaz12XG4gICAgLmJldGFfdHJpZ2dlcnNbaywgdl06IGJldGEgcnVsZXMgdGhhdCBtaWdodCBiZSB0cmlnZ2VyZWQgd2hlbiBrPXZcbiAgICAucHJlcmVxICAtLSB7fSBrIDwtIFtdIG9mIGsncyBwcmVyZXF1aXNpdGVzXG4gICAgLmRlZmluZWRfZmFjdHMgLS0gc2V0IG9mIGRlZmluZWQgZmFjdCBuYW1lc1xuICAgICovXG5cbiAgICBiZXRhX3J1bGVzOiBhbnlbXTtcbiAgICBkZWZpbmVkX2ZhY3RzO1xuICAgIGZ1bGxfaW1wbGljYXRpb25zO1xuICAgIGJldGFfdHJpZ2dlcnM7XG4gICAgcHJlcmVxO1xuXG4gICAgY29uc3RydWN0b3IocnVsZXM6IGFueVtdIHwgc3RyaW5nKSB7XG4gICAgICAgIC8vIENvbXBpbGUgcnVsZXMgaW50byBpbnRlcm5hbCBsb29rdXAgdGFibGVzXG4gICAgICAgIGlmICh0eXBlb2YgcnVsZXMgPT09IFwic3RyaW5nXCIpIHtcbiAgICAgICAgICAgIHJ1bGVzID0gcnVsZXMuc3BsaXQoXCJcXG5cIik7XG4gICAgICAgIH1cbiAgICAgICAgLy8gLS0tIHBhcnNlIGFuZCBwcm9jZXNzIHJ1bGVzIC0tLVxuICAgICAgICBjb25zdCBQOiBQcm92ZXIgPSBuZXcgUHJvdmVyO1xuXG4gICAgICAgIGZvciAoY29uc3QgcnVsZSBvZiBydWxlcykge1xuICAgICAgICAgICAgLy8gWFhYIGBhYCBpcyBoYXJkY29kZWQgdG8gYmUgYWx3YXlzIGF0b21cbiAgICAgICAgICAgIGxldCBbYSwgb3AsIGJdID0gVXRpbC5zcGxpdExvZ2ljU3RyKHJ1bGUpOyBcbiAgICAgICAgICAgIGEgPSBMb2dpYy5mcm9tc3RyaW5nKGEpO1xuICAgICAgICAgICAgYiA9IExvZ2ljLmZyb21zdHJpbmcoYik7XG4gICAgICAgICAgICBpZiAob3AgPT09IFwiLT5cIikge1xuICAgICAgICAgICAgICAgIFAucHJvY2Vzc19ydWxlKGEsIGIpO1xuICAgICAgICAgICAgfSBlbHNlIGlmIChvcCA9PT0gXCI9PVwiKSB7XG4gICAgICAgICAgICAgICAgUC5wcm9jZXNzX3J1bGUoYSwgYik7XG4gICAgICAgICAgICAgICAgUC5wcm9jZXNzX3J1bGUoYiwgYSk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcInVua25vd24gb3AgXCIgKyBvcCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICAvLyAtLS0gYnVpbGQgZGVkdWN0aW9uIG5ldHdvcmtzIC0tLVxuXG4gICAgICAgIHRoaXMuYmV0YV9ydWxlcyA9IFtdO1xuICAgICAgICBmb3IgKGNvbnN0IGl0ZW0gb2YgUC5ydWxlc19iZXRhKCkpIHtcbiAgICAgICAgICAgIGNvbnN0IGJjb25kID0gaXRlbS5wO1xuICAgICAgICAgICAgY29uc3QgYmltcGwgPSBpdGVtLnE7XG4gICAgICAgICAgICBjb25zdCBwYWlyczogSGFzaFNldCA9IG5ldyBIYXNoU2V0KCk7XG4gICAgICAgICAgICBiY29uZC5hcmdzLmZvckVhY2goKGE6IGFueSkgPT4gcGFpcnMuYWRkKF9hc19wYWlydjIoYSkpKTtcbiAgICAgICAgICAgIHRoaXMuYmV0YV9ydWxlcy5wdXNoKG5ldyBJbXBsaWNhdGlvbihwYWlycywgX2FzX3BhaXJ2MihiaW1wbCkpKTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIGRlZHVjZSBhbHBoYSBpbXBsaWNhdGlvbnNcbiAgICAgICAgY29uc3QgaW1wbF9hID0gZGVkdWNlX2FscGhhX2ltcGxpY2F0aW9ucyhQLnJ1bGVzX2FscGhhKCkpO1xuXG4gICAgICAgIC8vIG5vdzpcbiAgICAgICAgLy8gLSBhcHBseSBiZXRhIHJ1bGVzIHRvIGFscGhhIGNoYWlucyAgKHN0YXRpYyBleHRlbnNpb24pLCBhbmRcbiAgICAgICAgLy8gLSBmdXJ0aGVyIGFzc29jaWF0ZSBiZXRhIHJ1bGVzIHRvIGFscGhhIGNoYWluIChmb3IgaW5mZXJlbmNlXG4gICAgICAgIC8vIGF0IHJ1bnRpbWUpXG5cbiAgICAgICAgY29uc3QgaW1wbF9hYiA9IGFwcGx5X2JldGFfdG9fYWxwaGFfcm91dGUoaW1wbF9hLCBQLnJ1bGVzX2JldGEoKSk7XG5cbiAgICAgICAgLy8gZXh0cmFjdCBkZWZpbmVkIGZhY3QgbmFtZXNcbiAgICAgICAgdGhpcy5kZWZpbmVkX2ZhY3RzID0gbmV3IEhhc2hTZXQoKTtcblxuXG4gICAgICAgIGZvciAoY29uc3QgayBvZiBpbXBsX2FiLmtleXMoKSkge1xuICAgICAgICAgICAgdGhpcy5kZWZpbmVkX2ZhY3RzLmFkZChfYmFzZV9mYWN0KGspKTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIGJ1aWxkIHJlbHMgKGZvcndhcmQgY2hhaW5zKVxuXG4gICAgICAgIGNvbnN0IGZ1bGxfaW1wbGljYXRpb25zID0gbmV3IFNldERlZmF1bHREaWN0KCk7XG4gICAgICAgIGNvbnN0IGJldGFfdHJpZ2dlcnMgPSBuZXcgQXJyRGVmYXVsdERpY3QoKTtcbiAgICAgICAgZm9yIChjb25zdCBpdGVtIG9mIGltcGxfYWIuZW50cmllcygpKSB7XG4gICAgICAgICAgICBjb25zdCBrID1pdGVtWzBdO1xuICAgICAgICAgICAgY29uc3QgdmFsID0gaXRlbVsxXTtcbiAgICAgICAgICAgIGNvbnN0IGltcGw6IEhhc2hTZXQgPSB2YWwucDtcbiAgICAgICAgICAgIGNvbnN0IGJldGFpZHhzID0gdmFsLnE7XG4gICAgICAgICAgICBjb25zdCBzZXRUb0FkZCA9IG5ldyBIYXNoU2V0KCk7XG4gICAgICAgICAgICBpbXBsLnRvQXJyYXkoKS5mb3JFYWNoKChlOiBhbnkpID0+IHNldFRvQWRkLmFkZChfYXNfcGFpcnYyKGUpKSk7XG4gICAgICAgICAgICBmdWxsX2ltcGxpY2F0aW9ucy5hZGQoX2FzX3BhaXJ2MihrKSwgc2V0VG9BZGQpO1xuICAgICAgICAgICAgYmV0YV90cmlnZ2Vycy5hZGQoX2FzX3BhaXJ2MihrKSwgYmV0YWlkeHMpO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuZnVsbF9pbXBsaWNhdGlvbnMgPSBmdWxsX2ltcGxpY2F0aW9ucztcblxuICAgICAgICB0aGlzLmJldGFfdHJpZ2dlcnMgPSBiZXRhX3RyaWdnZXJzO1xuXG4gICAgICAgIC8vIGJ1aWxkIHByZXJlcSAoYmFja3dhcmQgY2hhaW5zKVxuICAgICAgICBjb25zdCBwcmVyZXEgPSBuZXcgU2V0RGVmYXVsdERpY3QoKTtcbiAgICAgICAgY29uc3QgcmVsX3ByZXJlcSA9IHJ1bGVzXzJwcmVyZXEoZnVsbF9pbXBsaWNhdGlvbnMpO1xuICAgICAgICBmb3IgKGNvbnN0IGl0ZW0gb2YgcmVsX3ByZXJlcS5lbnRyaWVzKCkpIHtcbiAgICAgICAgICAgIGNvbnN0IGsgPSBpdGVtWzBdO1xuICAgICAgICAgICAgY29uc3QgcGl0ZW1zID0gaXRlbVsxXTtcbiAgICAgICAgICAgIGNvbnN0IHRvQWRkID0gcHJlcmVxLmdldChrKTtcbiAgICAgICAgICAgIHRvQWRkLmFkZChwaXRlbXMpO1xuICAgICAgICAgICAgcHJlcmVxLmFkZChrLCB0b0FkZCk7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5wcmVyZXEgPSBwcmVyZXE7XG4gICAgfVxufVxuXG5cbmNsYXNzIEluY29uc2lzdGVudEFzc3VtcHRpb25zIGV4dGVuZHMgRXJyb3Ige1xuICAgIGFyZ3M7XG5cbiAgICBjb25zdHJ1Y3RvciguLi5hcmdzOiBhbnlbXSkge1xuICAgICAgICBzdXBlcigpO1xuICAgICAgICB0aGlzLmFyZ3MgPSBhcmdzO1xuICAgIH1cblxuICAgIHN0YXRpYyBfX3N0cl9fKC4uLmFyZ3M6IGFueVtdKSB7XG4gICAgICAgIGNvbnN0IFtrYiwgZmFjdCwgdmFsdWVdID0gYXJncztcbiAgICAgICAgcmV0dXJuIGtiICsgXCIsIFwiICsgZmFjdCArIFwiPVwiICsgdmFsdWU7XG4gICAgfVxufVxuXG5leHBvcnQgY2xhc3MgRmFjdEtCIGV4dGVuZHMgSGFzaERpY3Qge1xuICAgIC8qXG4gICAgQSBzaW1wbGUgcHJvcG9zaXRpb25hbCBrbm93bGVkZ2UgYmFzZSByZWx5aW5nIG9uIGNvbXBpbGVkIGluZmVyZW5jZSBydWxlcy5cbiAgICAqL1xuXG4gICAgcnVsZXM7XG5cbiAgICBjb25zdHJ1Y3RvcihydWxlczogYW55KSB7XG4gICAgICAgIHN1cGVyKCk7XG4gICAgICAgIHRoaXMucnVsZXMgPSBydWxlcztcbiAgICB9XG5cbiAgICBfdGVsbChrOiBhbnksIHY6IGFueSkge1xuICAgICAgICAvKiBBZGQgZmFjdCBrPXYgdG8gdGhlIGtub3dsZWRnZSBiYXNlLlxuICAgICAgICBSZXR1cm5zIFRydWUgaWYgdGhlIEtCIGhhcyBhY3R1YWxseSBiZWVuIHVwZGF0ZWQsIEZhbHNlIG90aGVyd2lzZS5cbiAgICAgICAgKi9cbiAgICAgICAgaWYgKGsgaW4gdGhpcy5kaWN0ICYmIHR5cGVvZiB0aGlzLmdldChrKSAhPT0gXCJ1bmRlZmluZWRcIikge1xuICAgICAgICAgICAgaWYgKHRoaXMuZ2V0KGspID09PSB2KSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIExvZ2ljLkZhbHNlO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgSW5jb25zaXN0ZW50QXNzdW1wdGlvbnModGhpcywgaywgdik7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aGlzLmFkZChrLCB2KTtcbiAgICAgICAgICAgIHJldHVybiBMb2dpYy5UcnVlO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgLy8gLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xuICAgIC8vKiBUaGlzIGlzIHRoZSB3b3JraG9yc2UsIHNvIGtlZXAgaXQgKmZhc3QqLiAvL1xuICAgIC8vIC8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cblxuICAgIGRlZHVjZV9hbGxfZmFjdHMoZmFjdHM6IGFueSkge1xuICAgICAgICAvKlxuICAgICAgICBVcGRhdGUgdGhlIEtCIHdpdGggYWxsIHRoZSBpbXBsaWNhdGlvbnMgb2YgYSBsaXN0IG9mIGZhY3RzLlxuICAgICAgICBGYWN0cyBjYW4gYmUgc3BlY2lmaWVkIGFzIGEgZGljdGlvbmFyeSBvciBhcyBhIGxpc3Qgb2YgKGtleSwgdmFsdWUpXG4gICAgICAgIHBhaXJzLlxuICAgICAgICAqL1xuICAgICAgICAvLyBrZWVwIGZyZXF1ZW50bHkgdXNlZCBhdHRyaWJ1dGVzIGxvY2FsbHksIHNvIHdlJ2xsIGF2b2lkIGV4dHJhXG4gICAgICAgIC8vIGF0dHJpYnV0ZSBhY2Nlc3Mgb3ZlcmhlYWRcblxuICAgICAgICBjb25zdCBmdWxsX2ltcGxpY2F0aW9uczogU2V0RGVmYXVsdERpY3QgPSB0aGlzLnJ1bGVzLmZ1bGxfaW1wbGljYXRpb25zO1xuICAgICAgICBjb25zdCBiZXRhX3RyaWdnZXJzOiBBcnJEZWZhdWx0RGljdCA9IHRoaXMucnVsZXMuYmV0YV90cmlnZ2VycztcbiAgICAgICAgY29uc3QgYmV0YV9ydWxlczogYW55W10gPSB0aGlzLnJ1bGVzLmJldGFfcnVsZXM7XG5cbiAgICAgICAgaWYgKGZhY3RzIGluc3RhbmNlb2YgSGFzaERpY3QgfHwgZmFjdHMgaW5zdGFuY2VvZiBTdGRGYWN0S0IpIHtcbiAgICAgICAgICAgIGZhY3RzID0gZmFjdHMuZW50cmllcygpO1xuICAgICAgICB9XG5cbiAgICAgICAgd2hpbGUgKGZhY3RzLmxlbmd0aCAhPSAwKSB7XG4gICAgICAgICAgICBjb25zdCBiZXRhX21heXRyaWdnZXIgPSBuZXcgSGFzaFNldCgpO1xuXG4gICAgICAgICAgICAvLyAtLS0gYWxwaGEgY2hhaW5zIC0tLVxuICAgICAgICAgICAgZm9yIChjb25zdCBpdGVtIG9mIGZhY3RzKSB7XG4gICAgICAgICAgICAgICAgbGV0IGssIHY7XG4gICAgICAgICAgICAgICAgaWYgKGl0ZW0gaW5zdGFuY2VvZiBJbXBsaWNhdGlvbikge1xuICAgICAgICAgICAgICAgICAgICBrID0gaXRlbS5wO1xuICAgICAgICAgICAgICAgICAgICB2ID0gaXRlbS5xXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgayA9IGl0ZW1bMF07XG4gICAgICAgICAgICAgICAgICAgIHYgPSBpdGVtWzFdO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBpZiAodGhpcy5fdGVsbChrLCB2KSBpbnN0YW5jZW9mIEZhbHNlIHx8ICh0eXBlb2YgdiA9PT0gXCJ1bmRlZmluZWRcIikpIHtcbiAgICAgICAgICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgLy8gbG9va3VwIHJvdXRpbmcgdGFibGVzXG4gICAgICAgICAgICAgICAgY29uc3QgYXJyID0gZnVsbF9pbXBsaWNhdGlvbnMuZ2V0KG5ldyBJbXBsaWNhdGlvbihrLCB2KSkudG9BcnJheSgpO1xuICAgICAgICAgICAgICAgIGZvciAoY29uc3QgaXRlbSBvZiBhcnIpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fdGVsbChpdGVtLnAsIGl0ZW0ucSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGNvbnN0IGN1cnJpbXAgPSBiZXRhX3RyaWdnZXJzLmdldChuZXcgSW1wbGljYXRpb24oaywgdikpO1xuICAgICAgICAgICAgICAgIGlmICghKGN1cnJpbXAubGVuZ3RoID09IDApKSB7XG4gICAgICAgICAgICAgICAgICAgIGJldGFfbWF5dHJpZ2dlci5hZGRBcnIoY3VycmltcCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgLy8gLS0tIGJldGEgY2hhaW5zIC0tLVxuICAgICAgICAgICAgZmFjdHMgPSBbXTtcbiAgICAgICAgICAgIGZvciAoY29uc3QgYmlkeCBvZiBiZXRhX21heXRyaWdnZXIudG9BcnJheSgpKSB7XG4gICAgICAgICAgICAgICAgY29uc3QgYmV0YV9ydWxlID0gYmV0YV9ydWxlc1tiaWR4XTtcbiAgICAgICAgICAgICAgICBjb25zdCBiY29uZCA9IGJldGFfcnVsZS5wO1xuICAgICAgICAgICAgICAgIGNvbnN0IGJpbXBsID0gYmV0YV9ydWxlLnE7XG4gICAgICAgICAgICAgICAgaWYgKGJjb25kLnRvQXJyYXkoKS5ldmVyeSgoaW1wOiBhbnkpID0+IHRoaXMuZ2V0KGltcC5wKSA9PSBpbXAucSkpIHtcbiAgICAgICAgICAgICAgICAgICAgZmFjdHMucHVzaChiaW1wbCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxufVxuIiwgIi8qIFRoZSBjb3JlJ3MgY29yZS4gKi9cblxuLypcbk5vdGFibGUgY2hhbmdlcyBtYWRlIChXQiBhbmQgR00pXG4tIFJlcGxhY2VkIGFycmF5IG9mIGNsYXNzZXMgd2l0aCBkaWN0aW9uYXJ5IGZvciBxdWlja2VyIGluZGV4IHJldHJpZXZhbHNcbi0gSW1wbGVtZW50ZWQgYSBjb25zdHJ1Y3RvciBzeXN0ZW0gZm9yIGJhc2ljbWV0YSByYXRoZXIgdGhhbiBfX25ld19fXG4qL1xuXG5cbmltcG9ydCB7SGFzaFNldH0gZnJvbSBcIi4vdXRpbGl0eVwiO1xuXG4vLyB1c2VkIGZvciBjYW5vbmljYWwgb3JkZXJpbmcgb2Ygc3ltYm9saWMgc2VxdWVuY2VzXG4vLyB2aWEgX19jbXBfXyBtZXRob2Q6XG4vLyBGSVhNRSB0aGlzIGlzICpzbyogaXJyZWxldmFudCBhbmQgb3V0ZGF0ZWQhXG5cbmNvbnN0IG9yZGVyaW5nX29mX2NsYXNzZXM6IFJlY29yZDxhbnksIGFueT4gPSB7XG4gICAgLy8gc2luZ2xldG9uIG51bWJlcnNcbiAgICBaZXJvOiAwLCBPbmU6IDEsIEhhbGY6IDIsIEluZmluaXR5OiAzLCBOYU46IDQsIE5lZ2F0aXZlT25lOiA1LCBOZWdhdGl2ZUluZmluaXR5OiA2LFxuICAgIC8vIG51bWJlcnNcbiAgICBJbnRlZ2VyOiA3LCBSYXRpb25hbDogOCwgRmxvYXQ6IDksXG4gICAgLy8gc2luZ2xldG9uIG51bWJlcnNcbiAgICBFeHAxOiAxMCwgUGk6IDExLCBJbWFnaW5hcnlVbml0OiAxMixcbiAgICAvLyBzeW1ib2xzXG4gICAgU3ltYm9sOiAxMywgV2lsZDogMTQsIFRlbXBvcmFyeTogMTUsXG4gICAgLy8gYXJpdGhtZXRpYyBvcGVyYXRpb25zXG4gICAgUG93OiAxNiwgTXVsOiAxNywgQWRkOiAxOCxcbiAgICAvLyBmdW5jdGlvbiB2YWx1ZXNcbiAgICBEZXJpdmF0aXZlOiAxOSwgSW50ZWdyYWw6IDIwLFxuICAgIC8vIGRlZmluZWQgc2luZ2xldG9uIGZ1bmN0aW9uc1xuICAgIEFiczogMjEsIFNpZ246IDIyLCBTcXJ0OiAyMywgRmxvb3I6IDI0LCBDZWlsaW5nOiAyNSwgUmU6IDI2LCBJbTogMjcsXG4gICAgQXJnOiAyOCwgQ29uanVnYXRlOiAyOSwgRXhwOiAzMCwgTG9nOiAzMSwgU2luOiAzMiwgQ29zOiAzMywgVGFuOiAzNCxcbiAgICBDb3Q6IDM1LCBBU2luOiAzNiwgQUNvczogMzcsIEFUYW46IDM4LCBBQ290OiAzOSwgU2luaDogNDAsIENvc2g6IDQxLFxuICAgIFRhbmg6IDQyLCBBU2luaDogNDMsIEFDb3NoOiA0NCwgQVRhbmg6IDQ1LCBBQ290aDogNDYsXG4gICAgUmlzaW5nRmFjdG9yaWFsOiA0NywgRmFsbGluZ0ZhY3RvcmlhbDogNDgsIGZhY3RvcmlhbDogNDksIGJpbm9taWFsOiA1MCxcbiAgICBHYW1tYTogNTEsIExvd2VyR2FtbWE6IDUyLCBVcHBlckdhbWE6IDUzLCBQb2x5R2FtbWE6IDU0LCBFcmY6IDU1LFxuICAgIC8vIHNwZWNpYWwgcG9seW5vbWlhbHNcbiAgICBDaGVieXNoZXY6IDU2LCBDaGVieXNoZXYyOiA1NyxcbiAgICAvLyB1bmRlZmluZWQgZnVuY3Rpb25zXG4gICAgRnVuY3Rpb246IDU4LCBXaWxkRnVuY3Rpb246IDU5LFxuICAgIC8vIGFub255bW91cyBmdW5jdGlvbnNcbiAgICBMYW1iZGE6IDYwLFxuICAgIC8vIExhbmRhdSBPIHN5bWJvbFxuICAgIE9yZGVyOiA2MSxcbiAgICAvLyByZWxhdGlvbmFsIG9wZXJhdGlvbnNcbiAgICBFcXVhbGxpdHk6IDYyLCBVbmVxdWFsaXR5OiA2MywgU3RyaWN0R3JlYXRlclRoYW46IDY0LCBTdHJpY3RMZXNzVGhhbjogNjUsXG4gICAgR3JlYXRlclRoYW46IDY2LCBMZXNzVGhhbjogNjYsXG59O1xuXG5cbmNsYXNzIFJlZ2lzdHJ5IHtcbiAgICAvKlxuICAgIEJhc2UgY2xhc3MgZm9yIHJlZ2lzdHJ5IG9iamVjdHMuXG5cbiAgICBSZWdpc3RyaWVzIG1hcCBhIG5hbWUgdG8gYW4gb2JqZWN0IHVzaW5nIGF0dHJpYnV0ZSBub3RhdGlvbi4gUmVnaXN0cnlcbiAgICBjbGFzc2VzIGJlaGF2ZSBzaW5nbGV0b25pY2FsbHk6IGFsbCB0aGVpciBpbnN0YW5jZXMgc2hhcmUgdGhlIHNhbWUgc3RhdGUsXG4gICAgd2hpY2ggaXMgc3RvcmVkIGluIHRoZSBjbGFzcyBvYmplY3QuXG5cbiAgICBBbGwgc3ViY2xhc3NlcyBzaG91bGQgc2V0IGBfX3Nsb3RzX18gPSAoKWAuXG4gICAgKi9cblxuICAgIHN0YXRpYyBkaWN0OiBSZWNvcmQ8YW55LCBhbnk+O1xuXG4gICAgYWRkQXR0cihuYW1lOiBhbnksIG9iajogYW55KSB7XG4gICAgICAgIFJlZ2lzdHJ5LmRpY3RbbmFtZV0gPSBvYmo7XG4gICAgfVxuXG4gICAgZGVsQXR0cihuYW1lOiBhbnkpIHtcbiAgICAgICAgZGVsZXRlIFJlZ2lzdHJ5LmRpY3RbbmFtZV07XG4gICAgfVxufVxuXG4vLyBBIHNldCBjb250YWluaW5nIGFsbCBTeW1QeSBjbGFzcyBvYmplY3RzXG5jb25zdCBhbGxfY2xhc3NlcyA9IG5ldyBIYXNoU2V0KCk7XG5cbmNsYXNzIEJhc2ljTWV0YSB7XG4gICAgX19zeW1weV9fOiBhbnk7XG5cbiAgICBzdGF0aWMgcmVnaXN0ZXIoY2xzOiBhbnkpIHtcbiAgICAgICAgYWxsX2NsYXNzZXMuYWRkKGNscyk7XG4gICAgICAgIGNscy5fX3N5bXB5X18gPSB0cnVlO1xuICAgIH1cblxuICAgIHN0YXRpYyBjb21wYXJlKHNlbGY6IGFueSwgb3RoZXI6IGFueSkge1xuICAgICAgICAvLyBJZiB0aGUgb3RoZXIgb2JqZWN0IGlzIG5vdCBhIEJhc2ljIHN1YmNsYXNzLCB0aGVuIHdlIGFyZSBub3QgZXF1YWwgdG9cbiAgICAgICAgLy8gaXQuXG4gICAgICAgIGlmICghKG90aGVyIGluc3RhbmNlb2YgQmFzaWNNZXRhKSkge1xuICAgICAgICAgICAgcmV0dXJuIC0xO1xuICAgICAgICB9XG4gICAgICAgIGNvbnN0IG4xID0gc2VsZi5jb25zdHJ1Y3Rvci5uYW1lO1xuICAgICAgICBjb25zdCBuMiA9IG90aGVyLmNvbnN0cnVjdG9yLm5hbWU7XG4gICAgICAgIC8vIGNoZWNrIGlmIGJvdGggYXJlIGluIHRoZSBjbGFzc2VzIGRpY3Rpb25hcnlcbiAgICAgICAgaWYgKG9yZGVyaW5nX29mX2NsYXNzZXMuaGFzKG4xKSAmJiBvcmRlcmluZ19vZl9jbGFzc2VzLmhhcyhuMikpIHtcbiAgICAgICAgICAgIGNvbnN0IGlkeDEgPSBvcmRlcmluZ19vZl9jbGFzc2VzW24xXTtcbiAgICAgICAgICAgIGNvbnN0IGlkeDIgPSBvcmRlcmluZ19vZl9jbGFzc2VzW24yXTtcbiAgICAgICAgICAgIC8vIHRoZSBjbGFzcyB3aXRoIHRoZSBsYXJnZXIgaW5kZXggaXMgZ3JlYXRlclxuICAgICAgICAgICAgcmV0dXJuIE1hdGguc2lnbihpZHgxIC0gaWR4Mik7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKG4xID4gbjIpIHtcbiAgICAgICAgICAgIHJldHVybiAxO1xuICAgICAgICB9IGVsc2UgaWYgKG4xID09PSBuMikge1xuICAgICAgICAgICAgcmV0dXJuIDA7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIC0xO1xuICAgIH1cblxuICAgIGxlc3NUaGFuKG90aGVyOiBhbnkpIHtcbiAgICAgICAgaWYgKEJhc2ljTWV0YS5jb21wYXJlKHNlbGYsIG90aGVyKSA9PT0gLTEpIHtcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG5cbiAgICBncmVhdGVyVGhhbihvdGhlcjogYW55KSB7XG4gICAgICAgIGlmIChCYXNpY01ldGEuY29tcGFyZShzZWxmLCBvdGhlcikgPT09IDEpIHtcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG59XG5cblxuZXhwb3J0IHtCYXNpY01ldGEsIFJlZ2lzdHJ5fTtcblxuIiwgIi8qXG5Ob3RhYmxlIGNoYW5nZXMgbWFkZSAoYW5kIG5vdGVzKTpcbi0gTWFuYWdlZFByb3BlcnRpZXMgcmV3b3JrZWQgYXMgbm9ybWFsIGNsYXNzIC0gZWFjaCBjbGFzcyBpcyByZWdpc3RlcmVkIGRpcmVjdGx5XG4gIGFmdGVyIGRlZmluZWRcbi0gTWFuYWdlZFByb3BlcnRpZXMgdHJhY2tzIHByb3BlcnRpZXMgb2YgYmFzZSBjbGFzc2VzIGJ5IHRyYWNraW5nIGFsbCBwcm9wZXJ0aWVzXG4gIChzZWUgY29tbWVudHMgd2l0aGluIGNsYXNzKVxuLSBDbGFzcyBwcm9wZXJ0aWVzIGZyb20gX2V2YWxfaXMgbWV0aG9kcyBhcmUgYXNzaWduZWQgdG8gZWFjaCBvYmplY3QgaXRzZWxmIGluXG4gIHRoZSBCYXNpYyBjb25zdHJ1Y3RvclxuLSBDaG9vc2luZyB0byBydW4gZ2V0aXQoKSBvbiBtYWtlX3Byb3BlcnR5IHRvIGFkZCBjb25zaXN0ZW5jeSBpbiBhY2Nlc3Npbmdcbi0gVG8tZG86IG1ha2UgYWNjZXNzaW5nIHByb3BlcnRpZXMgbW9yZSBjb25zaXN0ZW50IChpLmUuLCBzYW1lIHN5bnRheCBmb3JcbiAgYWNlc3Npbmcgc3RhdGljIGFuZCBub24tc3RhdGljIHByb3BlcnRpZXMpXG4qL1xuXG5pbXBvcnQge0ZhY3RLQiwgRmFjdFJ1bGVzfSBmcm9tIFwiLi9mYWN0c1wiO1xuaW1wb3J0IHtCYXNpY01ldGF9IGZyb20gXCIuL2NvcmVcIjtcbmltcG9ydCB7SGFzaERpY3QsIEhhc2hTZXQsIFV0aWx9IGZyb20gXCIuL3V0aWxpdHlcIjtcblxuXG5jb25zdCBfYXNzdW1lX3J1bGVzID0gbmV3IEZhY3RSdWxlcyhbXG4gICAgXCJpbnRlZ2VyIC0+IHJhdGlvbmFsXCIsXG4gICAgXCJyYXRpb25hbCAtPiByZWFsXCIsXG4gICAgXCJyYXRpb25hbCAtPiBhbGdlYnJhaWNcIixcbiAgICBcImFsZ2VicmFpYyAtPiBjb21wbGV4XCIsXG4gICAgXCJ0cmFuc2NlbmRlbnRhbCA9PSBjb21wbGV4ICYgIWFsZ2VicmFpY1wiLFxuICAgIFwicmVhbCAtPiBoZXJtaXRpYW5cIixcbiAgICBcImltYWdpbmFyeSAtPiBjb21wbGV4XCIsXG4gICAgXCJpbWFnaW5hcnkgLT4gYW50aWhlcm1pdGlhblwiLFxuICAgIFwiZXh0ZW5kZWRfcmVhbCAtPiBjb21tdXRhdGl2ZVwiLFxuICAgIFwiY29tcGxleCAtPiBjb21tdXRhdGl2ZVwiLFxuICAgIFwiY29tcGxleCAtPiBmaW5pdGVcIixcblxuICAgIFwib2RkID09IGludGVnZXIgJiAhZXZlblwiLFxuICAgIFwiZXZlbiA9PSBpbnRlZ2VyICYgIW9kZFwiLFxuXG4gICAgXCJyZWFsIC0+IGNvbXBsZXhcIixcbiAgICBcImV4dGVuZGVkX3JlYWwgLT4gcmVhbCB8IGluZmluaXRlXCIsXG4gICAgXCJyZWFsID09IGV4dGVuZGVkX3JlYWwgJiBmaW5pdGVcIixcblxuICAgIFwiZXh0ZW5kZWRfcmVhbCA9PSBleHRlbmRlZF9uZWdhdGl2ZSB8IHplcm8gfCBleHRlbmRlZF9wb3NpdGl2ZVwiLFxuICAgIFwiZXh0ZW5kZWRfbmVnYXRpdmUgPT0gZXh0ZW5kZWRfbm9ucG9zaXRpdmUgJiBleHRlbmRlZF9ub256ZXJvXCIsXG4gICAgXCJleHRlbmRlZF9wb3NpdGl2ZSA9PSBleHRlbmRlZF9ub25uZWdhdGl2ZSAmIGV4dGVuZGVkX25vbnplcm9cIixcblxuICAgIFwiZXh0ZW5kZWRfbm9ucG9zaXRpdmUgPT0gZXh0ZW5kZWRfcmVhbCAmICFleHRlbmRlZF9wb3NpdGl2ZVwiLFxuICAgIFwiZXh0ZW5kZWRfbm9ubmVnYXRpdmUgPT0gZXh0ZW5kZWRfcmVhbCAmICFleHRlbmRlZF9uZWdhdGl2ZVwiLFxuXG4gICAgXCJyZWFsID09IG5lZ2F0aXZlIHwgemVybyB8IHBvc2l0aXZlXCIsXG4gICAgXCJuZWdhdGl2ZSA9PSBub25wb3NpdGl2ZSAmIG5vbnplcm9cIixcbiAgICBcInBvc2l0aXZlID09IG5vbm5lZ2F0aXZlICYgbm9uemVyb1wiLFxuXG4gICAgXCJub25wb3NpdGl2ZSA9PSByZWFsICYgIXBvc2l0aXZlXCIsXG4gICAgXCJub25uZWdhdGl2ZSA9PSByZWFsICYgIW5lZ2F0aXZlXCIsXG5cbiAgICBcInBvc2l0aXZlID09IGV4dGVuZGVkX3Bvc2l0aXZlICYgZmluaXRlXCIsXG4gICAgXCJuZWdhdGl2ZSA9PSBleHRlbmRlZF9uZWdhdGl2ZSAmIGZpbml0ZVwiLFxuICAgIFwibm9ucG9zaXRpdmUgPT0gZXh0ZW5kZWRfbm9ucG9zaXRpdmUgJiBmaW5pdGVcIixcbiAgICBcIm5vbm5lZ2F0aXZlID09IGV4dGVuZGVkX25vbm5lZ2F0aXZlICYgZmluaXRlXCIsXG4gICAgXCJub256ZXJvID09IGV4dGVuZGVkX25vbnplcm8gJiBmaW5pdGVcIixcblxuICAgIFwiemVybyAtPiBldmVuICYgZmluaXRlXCIsXG4gICAgXCJ6ZXJvID09IGV4dGVuZGVkX25vbm5lZ2F0aXZlICYgZXh0ZW5kZWRfbm9ucG9zaXRpdmVcIixcbiAgICBcInplcm8gPT0gbm9ubmVnYXRpdmUgJiBub25wb3NpdGl2ZVwiLFxuICAgIFwibm9uemVybyAtPiByZWFsXCIsXG5cbiAgICBcInByaW1lIC0+IGludGVnZXIgJiBwb3NpdGl2ZVwiLFxuICAgIFwiY29tcG9zaXRlIC0+IGludGVnZXIgJiBwb3NpdGl2ZSAmICFwcmltZVwiLFxuICAgIFwiIWNvbXBvc2l0ZSAtPiAhcG9zaXRpdmUgfCAhZXZlbiB8IHByaW1lXCIsXG5cbiAgICBcImlycmF0aW9uYWwgPT0gcmVhbCAmICFyYXRpb25hbFwiLFxuXG4gICAgXCJpbWFnaW5hcnkgLT4gIWV4dGVuZGVkX3JlYWxcIixcblxuICAgIFwiaW5maW5pdGUgPT0gIWZpbml0ZVwiLFxuICAgIFwibm9uaW50ZWdlciA9PSBleHRlbmRlZF9yZWFsICYgIWludGVnZXJcIixcbiAgICBcImV4dGVuZGVkX25vbnplcm8gPT0gZXh0ZW5kZWRfcmVhbCAmICF6ZXJvXCIsXG5dKTtcblxuXG5leHBvcnQgY29uc3QgX2Fzc3VtZV9kZWZpbmVkID0gX2Fzc3VtZV9ydWxlcy5kZWZpbmVkX2ZhY3RzLmNsb25lKCk7XG5cbmNsYXNzIFN0ZEZhY3RLQiBleHRlbmRzIEZhY3RLQiB7XG4gICAgLyogQSBGYWN0S0Igc3BlY2lhbGl6ZWQgZm9yIHRoZSBidWlsdC1pbiBydWxlc1xuICAgIFRoaXMgaXMgdGhlIG9ubHkga2luZCBvZiBGYWN0S0IgdGhhdCBCYXNpYyBvYmplY3RzIHNob3VsZCB1c2UuXG4gICAgKi9cblxuICAgIF9nZW5lcmF0b3I7XG5cbiAgICBjb25zdHJ1Y3RvcihmYWN0czogYW55ID0gdW5kZWZpbmVkKSB7XG4gICAgICAgIHN1cGVyKF9hc3N1bWVfcnVsZXMpO1xuICAgICAgICAvLyBzYXZlIGEgY29weSBvZiBmYWN0cyBkaWN0XG4gICAgICAgIGlmICh0eXBlb2YgZmFjdHMgPT09IFwidW5kZWZpbmVkXCIpIHtcbiAgICAgICAgICAgIHRoaXMuX2dlbmVyYXRvciA9IHt9O1xuICAgICAgICB9IGVsc2UgaWYgKCEoZmFjdHMgaW5zdGFuY2VvZiBGYWN0S0IpKSB7XG4gICAgICAgICAgICB0aGlzLl9nZW5lcmF0b3IgPSBmYWN0cy5jb3B5KCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aGlzLl9nZW5lcmF0b3IgPSAoZmFjdHMgYXMgYW55KS5nZW5lcmF0b3I7IC8vICEhIVxuICAgICAgICB9XG4gICAgICAgIGlmIChmYWN0cykge1xuICAgICAgICAgICAgdGhpcy5kZWR1Y2VfYWxsX2ZhY3RzKGZhY3RzKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHN0ZGNsb25lKCkge1xuICAgICAgICByZXR1cm4gbmV3IFN0ZEZhY3RLQih0aGlzKTtcbiAgICB9XG5cbiAgICBnZW5lcmF0b3IoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9nZW5lcmF0b3IuY29weSgpO1xuICAgIH1cbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGFzX3Byb3BlcnR5KGZhY3Q6IGFueSkge1xuICAgIHJldHVybiBcImlzX1wiICsgZmFjdDtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIG1ha2VfcHJvcGVydHkob2JqOiBhbnksIGZhY3Q6IGFueSkge1xuICAgIC8vIGNob29zaW5nIHRvIHJ1biBnZXRpdCgpIG9uIG1ha2VfcHJvcGVydHkgdG8gYWRkIGNvbnNpc3RlbmN5IGluIGFjY2Vzc2luZ1xuICAgIC8vIHByb3BvZXJ0aWVzIG9mIHN5bXR5cGUgb2JqZWN0cy4gdGhpcyBtYXkgc2xvdyBkb3duIHN5bXR5cGUgc2xpZ2h0bHlcbiAgICBpZiAoIWZhY3QuaW5jbHVkZXMoXCJpc19cIikpIHtcbiAgICAgICAgb2JqW2FzX3Byb3BlcnR5KGZhY3QpXSA9IGdldGl0XG4gICAgfSBlbHNlIHtcbiAgICAgICAgb2JqW2ZhY3RdID0gZ2V0aXQ7XG4gICAgfVxuICAgIGZ1bmN0aW9uIGdldGl0KCkge1xuICAgICAgICBpZiAodHlwZW9mIG9iai5fYXNzdW1wdGlvbnNbZmFjdF0gIT09IFwidW5kZWZpbmVkXCIpIHtcbiAgICAgICAgICAgIHJldHVybiBvYmouX2Fzc3VtcHRpb25zLmdldChmYWN0KTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiBfYXNrKGZhY3QsIG9iaik7XG4gICAgICAgIH1cbiAgICB9XG59XG5cblxuLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5vLXVudXNlZC12YXJzXG5mdW5jdGlvbiBfYXNrKGZhY3Q6IGFueSwgb2JqOiBhbnkpIHtcbiAgICAvKlxuICAgIEZpbmQgdGhlIHRydXRoIHZhbHVlIGZvciBhIHByb3BlcnR5IG9mIGFuIG9iamVjdC5cbiAgICBUaGlzIGZ1bmN0aW9uIGlzIGNhbGxlZCB3aGVuIGEgcmVxdWVzdCBpcyBtYWRlIHRvIHNlZSB3aGF0IGEgZmFjdFxuICAgIHZhbHVlIGlzLlxuICAgIEZvciB0aGlzIHdlIHVzZSBzZXZlcmFsIHRlY2huaXF1ZXM6XG4gICAgRmlyc3QsIHRoZSBmYWN0LWV2YWx1YXRpb24gZnVuY3Rpb24gaXMgdHJpZWQsIGlmIGl0IGV4aXN0cyAoZm9yXG4gICAgZXhhbXBsZSBfZXZhbF9pc19pbnRlZ2VyKS4gVGhlbiB3ZSB0cnkgcmVsYXRlZCBmYWN0cy4gRm9yIGV4YW1wbGVcbiAgICAgICAgcmF0aW9uYWwgICAtLT4gICBpbnRlZ2VyXG4gICAgYW5vdGhlciBleGFtcGxlIGlzIGpvaW5lZCBydWxlOlxuICAgICAgICBpbnRlZ2VyICYgIW9kZCAgLS0+IGV2ZW5cbiAgICBzbyBpbiB0aGUgbGF0dGVyIGNhc2UgaWYgd2UgYXJlIGxvb2tpbmcgYXQgd2hhdCAnZXZlbicgdmFsdWUgaXMsXG4gICAgJ2ludGVnZXInIGFuZCAnb2RkJyBmYWN0cyB3aWxsIGJlIGFza2VkLlxuICAgIEluIGFsbCBjYXNlcywgd2hlbiB3ZSBzZXR0bGUgb24gc29tZSBmYWN0IHZhbHVlLCBpdHMgaW1wbGljYXRpb25zIGFyZVxuICAgIGRlZHVjZWQsIGFuZCB0aGUgcmVzdWx0IGlzIGNhY2hlZCBpbiAuX2Fzc3VtcHRpb25zLlxuICAgICovXG5cbiAgICAvLyBGYWN0S0Igd2hpY2ggaXMgZGljdC1saWtlIGFuZCBtYXBzIGZhY3RzIHRvIHRoZWlyIGtub3duIHZhbHVlczpcbiAgICBjb25zdCBhc3N1bXB0aW9uczogU3RkRmFjdEtCID0gb2JqLl9hc3N1bXB0aW9ucztcblxuICAgIC8vIEEgZGljdCB0aGF0IG1hcHMgZmFjdHMgdG8gdGhlaXIgaGFuZGxlcnM6XG4gICAgY29uc3QgaGFuZGxlcl9tYXA6IEhhc2hEaWN0ID0gb2JqLl9wcm9wX2hhbmRsZXI7XG5cbiAgICAvLyBUaGlzIGlzIG91ciBxdWV1ZSBvZiBmYWN0cyB0byBjaGVjazpcbiAgICBjb25zdCBmYWN0c190b19jaGVjayA9IG5ldyBBcnJheShmYWN0KTtcbiAgICBjb25zdCBmYWN0c19xdWV1ZWQgPSBuZXcgSGFzaFNldChbZmFjdF0pO1xuXG4gICAgY29uc3QgY2xzID0gb2JqLmNvbnN0cnVjdG9yO1xuXG4gICAgZm9yIChjb25zdCBmYWN0X2kgb2YgZmFjdHNfdG9fY2hlY2spIHtcbiAgICAgICAgaWYgKHR5cGVvZiBhc3N1bXB0aW9ucy5nZXQoZmFjdF9pKSAhPT0gXCJ1bmRlZmluZWRcIikge1xuICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgIH0gZWxzZSBpZiAoY2xzW2FzX3Byb3BlcnR5KGZhY3QpXSkge1xuICAgICAgICAgICAgcmV0dXJuIChjbHNbYXNfcHJvcGVydHkoZmFjdCldKTtcbiAgICAgICAgfVxuICAgICAgICBsZXQgZmFjdF9pX3ZhbHVlID0gdW5kZWZpbmVkO1xuICAgICAgICBsZXQgaGFuZGxlcl9pID0gaGFuZGxlcl9tYXAuZ2V0KGZhY3RfaSk7XG4gICAgICAgIGlmICh0eXBlb2YgaGFuZGxlcl9pICE9PSBcInVuZGVmaW5lZFwiKSB7XG4gICAgICAgICAgICBmYWN0X2lfdmFsdWUgPSBvYmpbaGFuZGxlcl9pLm5hbWVdKCk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAodHlwZW9mIGZhY3RfaV92YWx1ZSAhPT0gXCJ1bmRlZmluZWRcIikge1xuICAgICAgICAgICAgYXNzdW1wdGlvbnMuZGVkdWNlX2FsbF9mYWN0cyhbW2ZhY3RfaSwgZmFjdF9pX3ZhbHVlXV0pO1xuICAgICAgICB9XG5cbiAgICAgICAgY29uc3QgZmFjdF92YWx1ZSA9IGFzc3VtcHRpb25zLmdldChmYWN0KTtcbiAgICAgICAgaWYgKHR5cGVvZiBmYWN0X3ZhbHVlICE9PSBcInVuZGVmaW5lZFwiKSB7XG4gICAgICAgICAgICByZXR1cm4gZmFjdF92YWx1ZTtcbiAgICAgICAgfVxuICAgICAgICBjb25zdCBmYWN0c2V0ID0gX2Fzc3VtZV9ydWxlcy5wcmVyZXEuZ2V0KGZhY3RfaSkuZGlmZmVyZW5jZShmYWN0c19xdWV1ZWQpO1xuICAgICAgICBpZiAoZmFjdHNldC5zaXplICE9PSAwKSB7XG4gICAgICAgICAgICBjb25zdCBuZXdfZmFjdHNfdG9fY2hlY2sgPSBuZXcgQXJyYXkoX2Fzc3VtZV9ydWxlcy5wcmVyZXEuZ2V0KGZhY3RfaSkuZGlmZmVyZW5jZShmYWN0c19xdWV1ZWQpKTtcbiAgICAgICAgICAgIFV0aWwuc2h1ZmZsZUFycmF5KG5ld19mYWN0c190b19jaGVjayk7XG4gICAgICAgICAgICBmYWN0c190b19jaGVjay5wdXNoKG5ld19mYWN0c190b19jaGVjayk7XG4gICAgICAgICAgICBmYWN0c190b19jaGVjay5mbGF0KCk7XG4gICAgICAgICAgICBmYWN0c19xdWV1ZWQuYWRkQXJyKG5ld19mYWN0c190b19jaGVjayk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGlmIChhc3N1bXB0aW9ucy5oYXMoZmFjdCkpIHtcbiAgICAgICAgcmV0dXJuIGFzc3VtcHRpb25zLmdldChmYWN0KTtcbiAgICB9XG5cbiAgICBhc3N1bXB0aW9ucy5fdGVsbChmYWN0LCB1bmRlZmluZWQpO1xuICAgIHJldHVybiB1bmRlZmluZWQ7XG59XG5cblxuY2xhc3MgTWFuYWdlZFByb3BlcnRpZXMge1xuICAgIHN0YXRpYyBhbGxfZXhwbGljaXRfYXNzdW1wdGlvbnM6IEhhc2hEaWN0ID0gbmV3IEhhc2hEaWN0KCk7XG4gICAgc3RhdGljIGFsbF9kZWZhdWx0X2Fzc3VtcHRpb25zOiBIYXNoU2V0ID0gbmV3IEhhc2hTZXQoKTtcblxuXG4gICAgc3RhdGljIHJlZ2lzdGVyKGNsczogYW55KSB7XG4gICAgICAgIC8vIHJlZ2lzdGVyIHdpdGggQmFzaWNNZXRhIChyZWNvcmQgY2xhc3MgbmFtZSlcbiAgICAgICAgQmFzaWNNZXRhLnJlZ2lzdGVyKGNscyk7XG5cbiAgICAgICAgLy8gRm9yIGFsbCBwcm9wZXJ0aWVzIHdlIHdhbnQgdG8gZGVmaW5lLCBkZXRlcm1pbmUgaWYgdGhleSBhcmUgZGVmaW5lZFxuICAgICAgICAvLyBieSB0aGUgY2xhc3Mgb3IgaWYgd2Ugc2V0IHRoZW0gYXMgdW5kZWZpbmVkLlxuICAgICAgICAvLyBBZGQgdGhlc2UgcHJvcGVydGllcyB0byBhIGRpY3QgY2FsbGVkIGxvY2FsX2RlZnNcbiAgICAgICAgY29uc3QgbG9jYWxfZGVmcyA9IG5ldyBIYXNoRGljdCgpO1xuICAgICAgICBjb25zdCBjbHNfcHJvcHMgPSBPYmplY3QuZ2V0T3duUHJvcGVydHlOYW1lcyhjbHMpO1xuICAgICAgICBmb3IgKGNvbnN0IGsgb2YgX2Fzc3VtZV9kZWZpbmVkLnRvQXJyYXkoKSkge1xuICAgICAgICAgICAgY29uc3QgYXR0cm5hbWUgPSBhc19wcm9wZXJ0eShrKTtcbiAgICAgICAgICAgIGlmIChjbHNfcHJvcHMuaW5jbHVkZXMoYXR0cm5hbWUpKSB7XG4gICAgICAgICAgICAgICAgbGV0IHYgPSBjbHNbYXR0cm5hbWVdO1xuICAgICAgICAgICAgICAgIGlmICgodHlwZW9mIHYgPT09IFwibnVtYmVyXCIgJiYgTnVtYmVyLmlzSW50ZWdlcih2KSkgfHwgdHlwZW9mIHYgPT09IFwiYm9vbGVhblwiIHx8IHR5cGVvZiB2ID09PSBcInVuZGVmaW5lZFwiKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmICh0eXBlb2YgdiAhPT0gXCJ1bmRlZmluZWRcIikge1xuICAgICAgICAgICAgICAgICAgICAgICAgdiA9ICEhdjtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBsb2NhbF9kZWZzLmFkZChrLCB2KTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCBhbGxfZGVmcyA9IG5ldyBIYXNoRGljdCgpXG4gICAgICAgIGZvciAoY29uc3QgYmFzZSBvZiBVdGlsLmdldFN1cGVycyhjbHMpLnJldmVyc2UoKSkge1xuICAgICAgICAgICAgY29uc3QgYXNzdW1wdGlvbnMgPSBiYXNlLl9leHBsaWNpdF9jbGFzc19hc3N1bXB0aW9ucztcbiAgICAgICAgICAgIGlmICh0eXBlb2YgYXNzdW1wdGlvbnMgIT09IFwidW5kZWZpbmVkXCIpIHtcbiAgICAgICAgICAgICAgICBhbGxfZGVmcy5tZXJnZShhc3N1bXB0aW9ucylcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGFsbF9kZWZzLm1lcmdlKGxvY2FsX2RlZnMpO1xuXG4gICAgICAgIC8vIFNldCBjbGFzcyBwcm9wZXJ0aWVzXG4gICAgICAgIGNscy5fZXhwbGljaXRfY2xhc3NfYXNzdW1wdGlvbnMgPSBhbGxfZGVmc1xuICAgICAgICBjbHMuZGVmYXVsdF9hc3N1bXB0aW9ucyA9IG5ldyBTdGRGYWN0S0IoYWxsX2RlZnMpO1xuXG4gICAgICAgIC8vIEFkZCBkZWZhdWx0IGFzc3VtcHRpb25zIGFzIGNsYXNzIHByb3BlcnRpZXNcbiAgICAgICAgZm9yIChjb25zdCBpdGVtIG9mIGNscy5kZWZhdWx0X2Fzc3VtcHRpb25zLmVudHJpZXMoKSkge1xuICAgICAgICAgICAgaWYgKGl0ZW1bMF0uaW5jbHVkZXMoXCJpc1wiKSkge1xuICAgICAgICAgICAgICAgIGNsc1tpdGVtWzBdXSA9IGl0ZW1bMV07XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGNsc1thc19wcm9wZXJ0eShpdGVtWzBdKV0gPSBpdGVtWzFdO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgLy8gYWRkIHJlbWFpbmluZyBjbGFzcyBwcm9wZXJ0aWVzIHRvIGRlZmF1bHRhIGFzc3VtcHRpb25zXG4gICAgICAgIGNvbnN0IHByb3BzX2ZpbHRlcmVkID0gT2JqZWN0LmdldE93blByb3BlcnR5TmFtZXMoY2xzKS5maWx0ZXIoXG4gICAgICAgICAgICBwcm9wID0+IHByb3AuaW5jbHVkZXMoXCJpc19cIikpLm1hcCgoc3RyKSA9PiB7XG4gICAgICAgICAgICByZXR1cm4gc3RyLnJlcGxhY2UoXCJpc19cIiwgXCJcIik7XG4gICAgICAgIH0pO1xuICAgICAgICBjb25zdCBhbGxkZWZzID0gbmV3IEhhc2hTZXQocHJvcHNfZmlsdGVyZWQpO1xuICAgICAgICBmb3IgKGNvbnN0IGZhY3Qgb2YgYWxsZGVmcy5kaWZmZXJlbmNlKGNscy5kZWZhdWx0X2Fzc3VtcHRpb25zKS50b0FycmF5KCkpIHtcbiAgICAgICAgICAgIGNscy5kZWZhdWx0X2Fzc3VtcHRpb25zLmFkZChmYWN0LCBjbHNbZmFjdF0pO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gZ2V0IHRoZSBzdGF0aWMgdmFyaWFibGVzIG9mIGFsbCBzdXBlcmNsYXNzZXMgYW5kIGFzc2lnbiB0byBjbGFzc1xuICAgICAgICAvLyBub3RlIHRoYXQgd2Ugb25seSBhc3NpZ24gdGhlIHByb3BlcnRpZXMgaWYgdGhleSBhcmUgdW5kZWZpbmVkIFxuICAgICAgICBjb25zdCBzdXBlcnM6IGFueVtdID0gVXRpbC5nZXRTdXBlcnMoY2xzKTtcbiAgICAgICAgZm9yIChjb25zdCBzdXBlcmNscyBvZiBzdXBlcnMpIHtcbiAgICAgICAgICAgIGNvbnN0IGFsbFByb3BzID0gbmV3IEhhc2hTZXQoT2JqZWN0LmdldE93blByb3BlcnR5TmFtZXMoc3VwZXJjbHMpLmZpbHRlcihwcm9wID0+IHByb3AuaW5jbHVkZXMoXCJpc19cIikpKTtcbiAgICAgICAgICAgIGNvbnN0IHVuaXF1ZVByb3BzID0gYWxsUHJvcHMuZGlmZmVyZW5jZShjbHMuZGVmYXVsdF9hc3N1bXB0aW9ucykudG9BcnJheSgpXG4gICAgICAgICAgICBmb3IgKGNvbnN0IGZhY3Qgb2YgdW5pcXVlUHJvcHMpIHtcbiAgICAgICAgICAgICAgICBjbHMuZGVmYXVsdF9hc3N1bXB0aW9ucy5hZGQoZmFjdCwgc3VwZXJjbHNbZmFjdF0pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxufVxuXG5leHBvcnQge1N0ZEZhY3RLQiwgTWFuYWdlZFByb3BlcnRpZXN9O1xuIiwgIi8qXG5Ob3RhYmxlIGNoYW5nZXMgbWFkZSAoYW5kIG5vdGVzKVxuLSBSZXdvcmtlZCBTaW5nbGV0b24gdG8gdXNlIGEgcmVnaXN0cnkgc3lzdGVtIHVzaW5nIGEgc3RhdGljIGRpY3Rpb25hcnlcbi0gUmVnaXN0ZXJzIG51bWJlciBvYmplY3RzIGFzIHRoZXkgYXJlIHVzZWRcbiovXG5cbi8qIGVzbGludC1kaXNhYmxlIG5ldy1jYXAgKi9cbmltcG9ydCB7TWFuYWdlZFByb3BlcnRpZXN9IGZyb20gXCIuL2Fzc3VtcHRpb25zXCI7XG5cbmNsYXNzIFNpbmdsZXRvbiB7XG4gICAgc3RhdGljIHJlZ2lzdHJ5OiBSZWNvcmQ8YW55LCBhbnk+ID0ge307XG5cbiAgICBzdGF0aWMgcmVnaXN0ZXIobmFtZTogc3RyaW5nLCBjbHM6IGFueSkge1xuICAgICAgICBNYW5hZ2VkUHJvcGVydGllcy5yZWdpc3RlcihjbHMpO1xuICAgICAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbmV3LWNhcFxuICAgICAgICBTaW5nbGV0b24ucmVnaXN0cnlbbmFtZV0gPSBuZXcgY2xzKCk7XG4gICAgfVxufVxuXG5jb25zdCBTOiBhbnkgPSBuZXcgU2luZ2xldG9uKCk7XG5cblxuZXhwb3J0IHtTLCBTaW5nbGV0b259O1xuIiwgImltcG9ydCB7U30gZnJvbSBcIi4vY29yZS9zaW5nbGV0b24uanNcIjtcbmltcG9ydCB7X051bWJlcl8sIEludGVnZXJ9IGZyb20gXCIuL2NvcmUvbnVtYmVycy5qc1wiO1xuY29uc29sZS5sb2coUy5JbmZpbml0eSkiXSwKICAibWFwcGluZ3MiOiAiOztBQU1BLE1BQU0sT0FBTixNQUFXO0FBQUEsSUFHUCxPQUFPLFFBQVEsR0FBZ0I7QUFDM0IsVUFBSSxPQUFPLE1BQU0sYUFBYTtBQUMxQixlQUFPO0FBQUEsTUFDWDtBQUNBLFVBQUksRUFBRSxTQUFTO0FBQ1gsZUFBTyxFQUFFLFFBQVE7QUFBQSxNQUNyQjtBQUNBLFVBQUksTUFBTSxRQUFRLENBQUMsR0FBRztBQUNsQixlQUFPLEVBQUUsSUFBSSxDQUFDLE1BQU0sS0FBSyxRQUFRLENBQUMsQ0FBQyxFQUFFLEtBQUssR0FBRztBQUFBLE1BQ2pEO0FBQ0EsVUFBSSxNQUFNLE1BQU07QUFDWixlQUFPO0FBQUEsTUFDWDtBQUNBLGFBQU8sRUFBRSxTQUFTO0FBQUEsSUFDdEI7QUFBQSxJQUdBLE9BQU8sU0FBUyxNQUFhLE1BQXNCO0FBQy9DLFlBQU0sVUFBVSxLQUFLLElBQUksQ0FBQyxNQUFXLEtBQUssUUFBUSxDQUFDLENBQUM7QUFDcEQsaUJBQVcsS0FBSyxNQUFNO0FBQ2xCLFlBQUksQ0FBQyxRQUFRLFNBQVMsS0FBSyxRQUFRLENBQUMsQ0FBQyxHQUFHO0FBQ3BDLGlCQUFPO0FBQUEsUUFDWDtBQUFBLE1BQ0o7QUFDQSxhQUFPO0FBQUEsSUFDWDtBQUFBLElBSUEsT0FBTyxJQUFJLEtBQWE7QUFDcEIsY0FBUSxRQUFRLEdBQUcsU0FBUyxDQUFDO0FBQUEsSUFDakM7QUFBQSxJQUVBLFFBQVEsUUFBUSxTQUFpQixNQUFNLE1BQWE7QUFDaEQsWUFBTSxRQUFlLENBQUM7QUFDdEIsaUJBQVcsS0FBSyxNQUFNO0FBQ2xCLGNBQU0sS0FBSyxDQUFDLENBQUMsQ0FBQztBQUFBLE1BQ2xCO0FBQ0EsWUFBTSxRQUFlLENBQUM7QUFDdEIsZUFBUyxJQUFJLEdBQUcsSUFB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Z0JBQWdCLGFBQWE7QUFDcEMsbUJBQVMsTUFBTSxXQUFXO0FBQUEsUUFDOUI7QUFBQSxNQUNKO0FBRUEsZUFBUyxNQUFNLFVBQVU7QUFHekIsVUFBSSw4QkFBOEI7QUFDbEMsVUFBSSxzQkFBc0IsSUFBSSxVQUFVLFFBQVE7QUFHaEQsaUJBQVcsUUFBUSxJQUFJLG9CQUFvQixRQUFRLEdBQUc7QUFDbEQsWUFBSSxLQUFLLEdBQUcsU0FBUyxJQUFJLEdBQUc7QUFDeEIsY0FBSSxLQUFLLE1BQU0sS0FBSztBQUFBLFFBQ3hCLE9BQU87QUFDSCxjQUFJLFlBQVksS0FBSyxFQUFFLEtBQUssS0FBSztBQUFBLFFBQ3JDO0FBQUEsTUFDSjtBQUdBLFlBQU0saUJBQWlCLE9BQU8sb0JBQW9CLEdBQUcsRUFBRTtBQUFBLFFBQ25ELFVBQVEsS0FBSyxTQUFTLEtBQUs7QUFBQSxNQUFDLEVBQUUsSUFBSSxDQUFDLFFBQVE7QUFDM0MsZUFBTyxJQUFJLFFBQVEsT0FBTyxFQUFFO0FBQUEsTUFDaEMsQ0FBQztBQUNELFlBQU0sVUFBVSxJQUFJLFFBQVEsY0FBYztBQUMxQyxpQkFBVyxRQUFRLFFBQVEsV0FBVyxJQUFJLG1CQUFtQixFQUFFLFFBQVEsR0FBRztBQUN0RSxZQUFJLG9CQUFvQixJQUFJLE1BQU0sSUFBSSxLQUFLO0FBQUEsTUFDL0M7QUFJQSxZQUFNLFNBQWdCLEtBQUssVUFBVSxHQUFHO0FBQ3hDLGlCQUFXLFlBQVksUUFBUTtBQUMzQixjQUFNLFdBQVcsSUFBSSxRQUFRLE9BQU8sb0JBQW9CLFFBQVEsRUFBRSxPQUFPLFVBQVEsS0FBSyxTQUFTLEtBQUssQ0FBQyxDQUFDO0FBQ3RHLGNBQU0sY0FBYyxTQUFTLFdBQVcsSUFBSSxtQkFBbUIsRUFBRSxRQUFRO0FBQ3pFLG1CQUFXLFFBQVEsYUFBYTtBQUM1QixjQUFJLG9CQUFvQixJQUFJLE1BQU0sU0FBUyxLQUFLO0FBQUEsUUFDcEQ7QUFBQSxNQUNKO0FBQUEsSUFDSjtBQUFBLEVBQ0o7QUF0RUksRUFERSxrQkFDSywyQkFBcUMsSUFBSSxTQUFTO0FBQ3pELEVBRkUsa0JBRUssMEJBQW1DLElBQUksUUFBUTs7O0FDcE0xRCxNQUFNLGFBQU4sTUFBZ0I7QUFBQSxJQUdaLE9BQU8sU0FBUyxNQUFjLEtBQVU7QUFDcEMsd0JBQWtCLFNBQVMsR0FBRztBQUU5QixpQkFBVSxTQUFTLFFBQVEsSUFBSSxJQUFJO0FBQUEsSUFDdkM7QUFBQSxFQUNKO0FBUkEsTUFBTSxZQUFOO0FBQ0ksRUFERSxVQUNLLFdBQTZCLENBQUM7QUFTekMsTUFBTSxJQUFTLElBQUksVUFBVTs7O0FDakI3QixVQUFRLElBQUksRUFBRSxRQUFROyIsCiAgIm5hbWVzIjogWyJpbXBsIiwgIml0ZW0iLCAic2VsZiJdCn0K
