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
  function _fuzzy_group(args, quick_exit = Logic.False) {
    let saw_other = Logic.False;
    for (const a of args) {
      if (a === Logic.True) {
        continue;
      }
      if (a == null) {
        return null;
      }
      if (quick_exit instanceof True && saw_other instanceof True) {
        return null;
      }
      saw_other = Logic.True;
    }
    if (saw_other instanceof True) {
      return Logic.False;
    }
    return Logic.True;
  }
  function _fuzzy_groupv2(args) {
    const res = _fuzzy_group(args);
    if (res === Logic.True) {
      return true;
    } else if (res === Logic.False) {
      return false;
    }
    return void 0;
  }
  function fuzzy_bool_v2(x2) {
    if (typeof x2 === "undefined") {
      return null;
    }
    if (x2 === true) {
      return true;
    }
    if (x2 === false) {
      return false;
    }
  }
  function fuzzy_and_v2(args) {
    let rv = true;
    for (let ai of args) {
      ai = fuzzy_bool_v2(ai);
      if (ai === false) {
        return false;
      }
      if (rv === true) {
        rv = ai;
      }
    }
    return rv;
  }
  function fuzzy_notv2(v) {
    if (v == void 0) {
      return void 0;
    } else if (v === true) {
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
        bcond.args.forEach((a) => pairs.add(_as_pairv2(a)));
        this.beta_rules.push(new Implication(pairs, _as_pairv2(bimpl)));
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
          const k = item[0];
          const v = item[1];
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
          is_commutative = fuzzy_and_v2(input);
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
          if (!(fuzzy_notv2(c.is_zero()) && c.is_extended_real() !== "undefined")) {
            ctemp.push(c);
          }
        }
        c_part = ctemp;
        const nctemp = [];
        for (const c of nc_part) {
          if (!(fuzzy_notv2(c.is_zero()) && c.is_extended_real() !== "undefined")) {
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
      return _fuzzy_groupv2(allargs);
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
      return _fuzzy_groupv2(fuzzyarg);
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
      const is_commutative = fuzzy_bool_v2(assumptions.get("commutative", true));
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
      const is_commutative = fuzzy_bool_v2(assumptions.get("commutative", true));
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

  // ts-port/testing.ts
  var n = _Number_.new(2);
  var x = new Symbol2("x");
  console.log("\n ADD \n");
  console.log(new Add(true, true, n, x, S.ComplexInfinity).toString());
  console.log(new Add(true, true, n, x, S.Infinity).toString());
  console.log(new Add(true, true, n, x, S.NegativeInfinity).toString());
  console.log(new Add(true, true, n, x, S.Infinity, S.NegativeInfinity).toString());
  console.log(new Add(true, true, n, x, S.ComplexInfinity, S.Infinity).toString());
  console.log(new Add(true, true, n, x, S.NaN, S.Infinity).toString());
  console.log("\n MUL \n");
  console.log(new Mul(true, true, n, x, S.ComplexInfinity).toString());
  console.log(new Mul(true, true, n, x, S.Infinity).toString());
  console.log(new Mul(true, true, n, x, S.NegativeInfinity).toString());
  console.log(new Mul(true, true, n, x, S.Infinity, S.NegativeInfinity).toString());
  console.log(new Mul(true, true, n, x, S.ComplexInfinity, S.Infinity).toString());
  console.log(new Mul(true, true, n, x, S.NaN, S.Infinity).toString());
  console.log("\n POW \n");
  console.log(new Pow(n, S.ComplexInfinity).toString());
  console.log(new Pow(n, S.Infinity).toString());
  console.log(new Pow(n, S.NaN).toString());
  console.log(new Pow(n, S.ComplexInfinity, S.Infinity).toString());
  console.log(new Pow(n, S.NaN, S.Infinity).toString());
})();
/*!
 *  decimal.js v10.4.3
 *  An arbitrary-precision Decimal type for JavaScript.
 *  https://github.com/MikeMcl/decimal.js
 *  Copyright (c) 2022 Michael Mclaughlin <M8ch88l@gmail.com>
 *  MIT Licence
 */
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsiLi4vY29yZS91dGlsaXR5LnRzIiwgIi4uL2NvcmUvbG9naWMudHMiLCAiLi4vY29yZS9mYWN0cy50cyIsICIuLi9jb3JlL2NvcmUudHMiLCAiLi4vY29yZS9hc3N1bXB0aW9ucy50cyIsICIuLi9jb3JlL2tpbmQudHMiLCAiLi4vY29yZS90cmF2ZXJzYWwudHMiLCAiLi4vY29yZS9iYXNpYy50cyIsICIuLi9jb3JlL3NpbmdsZXRvbi50cyIsICIuLi9jb3JlL2dsb2JhbC50cyIsICIuLi91dGlsaXRpZXMvbWlzYy50cyIsICIuLi9jb3JlL2V4cHIudHMiLCAiLi4vY29yZS9wYXJhbWV0ZXJzLnRzIiwgIi4uL2NvcmUvb3BlcmF0aW9ucy50cyIsICIuLi8uLi9ub2RlX21vZHVsZXMvZGVjaW1hbC5qcy9kZWNpbWFsLm1qcyIsICIuLi9jb3JlL3Bvd2VyLnRzIiwgIi4uL2NvcmUvbnVtYmVycy50cyIsICIuLi9udGhlb3J5L2ZhY3Rvcl8udHMiLCAiLi4vY29yZS9tdWwudHMiLCAiLi4vY29yZS9hZGQudHMiLCAiLi4vY29yZS9ib29sYWxnLnRzIiwgIi4uL2NvcmUvc3ltYm9sLnRzIiwgIi4uL3Rlc3RpbmcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbIi8qXG5BIGZpbGUgd2l0aCB1dGlsaXR5IGNsYXNzZXMgYW5kIGZ1bmN0aW9ucyB0byBoZWxwIHdpdGggcG9ydGluZ1xuRGV2ZWxvcGQgYnkgV0IgYW5kIEdNXG4qL1xuXG4vLyBnZW5lcmFsIHV0aWwgZnVuY3Rpb25zXG5jbGFzcyBVdGlsIHtcbiAgICAvLyBoYXNoa2V5IGZ1bmN0aW9uXG4gICAgLy8gc2hvdWxkIGJlIGFibGUgdG8gaGFuZGxlIG11bHRpcGxlIHR5cGVzIG9mIGlucHV0c1xuICAgIHN0YXRpYyBoYXNoS2V5KHg6IGFueSk6IHN0cmluZyB7XG4gICAgICAgIGlmICh0eXBlb2YgeCA9PT0gXCJ1bmRlZmluZWRcIikge1xuICAgICAgICAgICAgcmV0dXJuIFwidW5kZWZpbmVkXCI7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHguaGFzaEtleSkge1xuICAgICAgICAgICAgcmV0dXJuIHguaGFzaEtleSgpO1xuICAgICAgICB9XG4gICAgICAgIGlmIChBcnJheS5pc0FycmF5KHgpKSB7XG4gICAgICAgICAgICByZXR1cm4geC5tYXAoKGUpID0+IFV0aWwuaGFzaEtleShlKSkuam9pbihcIixcIik7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHggPT09IG51bGwpIHtcbiAgICAgICAgICAgIHJldHVybiBcIm51bGxcIjtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4geC50b1N0cmluZygpO1xuICAgIH1cblxuICAgIC8vIGNoZWNrIGlmIGFycjEgaXMgYSBzdWJzZXQgb2YgYXJyMlxuICAgIHN0YXRpYyBpc1N1YnNldChhcnIxOiBhbnlbXSwgYXJyMjogYW55W10pOiBib29sZWFuIHtcbiAgICAgICAgY29uc3QgdGVtcGFyciA9IGFycjIubWFwKChpOiBhbnkpID0+IFV0aWwuaGFzaEtleShpKSlcbiAgICAgICAgZm9yIChjb25zdCBlIG9mIGFycjEpIHtcbiAgICAgICAgICAgIGlmICghdGVtcGFyci5pbmNsdWRlcyhVdGlsLmhhc2hLZXkoZSkpKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cblxuICAgIC8vIGNvbnZlcnQgYW4gaW50ZWdlciB0byBiaW5hcnlcbiAgICAvLyBmdW5jdGlvbmFsIGZvciBuZWdhdGl2ZSBudW1iZXJzXG4gICAgc3RhdGljIGJpbihudW06IG51bWJlcikge1xuICAgICAgICByZXR1cm4gKG51bSA+Pj4gMCkudG9TdHJpbmcoMik7XG4gICAgfVxuXG4gICAgc3RhdGljKiBwcm9kdWN0KHJlcGVhdDogbnVtYmVyID0gMSwgLi4uYXJnczogYW55W10pIHtcbiAgICAgICAgY29uc3QgdG9BZGQ6IGFueVtdID0gW107XG4gICAgICAgIGZvciAoY29uc3QgYSBvZiBhcmdzKSB7XG4gICAgICAgICAgICB0b0FkZC5wdXNoKFthXSk7XG4gICAgICAgIH1cbiAgICAgICAgY29uc3QgcG9vbHM6IGFueVtdID0gW107XG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgcmVwZWF0OyBpKyspIHtcbiAgICAgICAgICAgIHRvQWRkLmZvckVhY2goKGU6IGFueSkgPT4gcG9vbHMucHVzaChlWzBdKSk7XG4gICAgICAgIH1cbiAgICAgICAgbGV0IHJlczogYW55W11bXSA9IFtbXV07XG4gICAgICAgIGZvciAoY29uc3QgcG9vbCBvZiBwb29scykge1xuICAgICAgICAgICAgY29uc3QgcmVzX3RlbXA6IGFueVtdID0gW107XG4gICAgICAgICAgICBmb3IgKGNvbnN0IHggb2YgcmVzKSB7XG4gICAgICAgICAgICAgICAgZm9yIChjb25zdCB5IG9mIHBvb2wpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHR5cGVvZiB4WzBdID09PSBcInVuZGVmaW5lZFwiKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXNfdGVtcC5wdXNoKFt5XSk7XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXNfdGVtcC5wdXNoKHguY29uY2F0KHkpKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJlcyA9IHJlc190ZW1wO1xuICAgICAgICB9XG4gICAgICAgIGZvciAoY29uc3QgcHJvZCBvZiByZXMpIHtcbiAgICAgICAgICAgIHlpZWxkIHByb2Q7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBzdGF0aWMqIHBlcm11dGF0aW9ucyhpdGVyYWJsZTogYW55LCByOiBhbnkgPSB1bmRlZmluZWQpIHtcbiAgICAgICAgY29uc3QgbiA9IGl0ZXJhYmxlLmxlbmd0aDtcbiAgICAgICAgaWYgKHR5cGVvZiByID09PSBcInVuZGVmaW5lZFwiKSB7XG4gICAgICAgICAgICByID0gbjtcbiAgICAgICAgfVxuICAgICAgICBjb25zdCByYW5nZSA9IHRoaXMucmFuZ2Uobik7XG4gICAgICAgIGZvciAoY29uc3QgaW5kaWNlcyBvZiBVdGlsLnByb2R1Y3QociwgcmFuZ2UpKSB7XG4gICAgICAgICAgICBpZiAoaW5kaWNlcy5sZW5ndGggPT09IHIpIHtcbiAgICAgICAgICAgICAgICBjb25zdCB5OiBhbnlbXSA9IFtdO1xuICAgICAgICAgICAgICAgIGZvciAoY29uc3QgaSBvZiBpbmRpY2VzKSB7XG4gICAgICAgICAgICAgICAgICAgIHkucHVzaChpdGVyYWJsZVtpXSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHlpZWxkIHk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBzdGF0aWMqIGZyb21faXRlcmFibGUoaXRlcmFibGVzOiBhbnkpIHtcbiAgICAgICAgZm9yIChjb25zdCBpdCBvZiBpdGVyYWJsZXMpIHtcbiAgICAgICAgICAgIGZvciAoY29uc3QgZWxlbWVudCBvZiBpdCkge1xuICAgICAgICAgICAgICAgIHlpZWxkIGVsZW1lbnQ7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBzdGF0aWMgYXJyRXEoYXJyMTogYW55W10sIGFycjI6IGFueSkge1xuICAgICAgICBpZiAoYXJyMS5sZW5ndGggIT09IGFycjIubGVuZ3RoKSB7XG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH1cbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBhcnIxLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBpZiAoIShhcnIxW2ldID09PSBhcnIyW2ldKSkge1xuICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG5cbiAgICBzdGF0aWMqIGNvbWJpbmF0aW9ucyhpdGVyYWJsZTogYW55LCByOiBhbnkpIHtcbiAgICAgICAgY29uc3QgbiA9IGl0ZXJhYmxlLmxlbmd0aDtcbiAgICAgICAgY29uc3QgcmFuZ2UgPSB0aGlzLnJhbmdlKG4pO1xuICAgICAgICBmb3IgKGNvbnN0IGluZGljZXMgb2YgVXRpbC5wZXJtdXRhdGlvbnMocmFuZ2UsIHIpKSB7XG4gICAgICAgICAgICBpZiAoVXRpbC5hcnJFcShpbmRpY2VzLnNvcnQoZnVuY3Rpb24oYSwgYikge1xuICAgICAgICAgICAgICAgIHJldHVybiBhIC0gYjtcbiAgICAgICAgICAgIH0pLCBpbmRpY2VzKSkge1xuICAgICAgICAgICAgICAgIGNvbnN0IHJlczogYW55W10gPSBbXTtcbiAgICAgICAgICAgICAgICBmb3IgKGNvbnN0IGkgb2YgaW5kaWNlcykge1xuICAgICAgICAgICAgICAgICAgICByZXMucHVzaChpdGVyYWJsZVtpXSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHlpZWxkIHJlcztcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgIHN0YXRpYyogY29tYmluYXRpb25zX3dpdGhfcmVwbGFjZW1lbnQoaXRlcmFibGU6IGFueSwgcjogYW55KSB7XG4gICAgICAgIGNvbnN0IG4gPSBpdGVyYWJsZS5sZW5ndGg7XG4gICAgICAgIGNvbnN0IHJhbmdlID0gdGhpcy5yYW5nZShuKTtcbiAgICAgICAgZm9yIChjb25zdCBpbmRpY2VzIG9mIFV0aWwucHJvZHVjdChyLCByYW5nZSkpIHtcbiAgICAgICAgICAgIGlmIChVdGlsLmFyckVxKGluZGljZXMuc29ydChmdW5jdGlvbihhLCBiKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGEgLSBiO1xuICAgICAgICAgICAgfSksIGluZGljZXMpKSB7XG4gICAgICAgICAgICAgICAgY29uc3QgcmVzOiBhbnlbXSA9IFtdO1xuICAgICAgICAgICAgICAgIGZvciAoY29uc3QgaSBvZiBpbmRpY2VzKSB7XG4gICAgICAgICAgICAgICAgICAgIHJlcy5wdXNoKGl0ZXJhYmxlW2ldKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgeWllbGQgcmVzO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgc3RhdGljIHppcChhcnIxOiBhbnlbXSwgYXJyMjogYW55W10sIGZpbGx2YWx1ZTogc3RyaW5nID0gXCItXCIpIHtcbiAgICAgICAgY29uc3QgcmVzID0gYXJyMS5tYXAoZnVuY3Rpb24oZSwgaSkge1xuICAgICAgICAgICAgcmV0dXJuIFtlLCBhcnIyW2ldXTtcbiAgICAgICAgfSk7XG4gICAgICAgIHJlcy5mb3JFYWNoKCh6aXA6IGFueSkgPT4ge1xuICAgICAgICAgICAgaWYgKHppcC5pbmNsdWRlcyh1bmRlZmluZWQpKSB7XG4gICAgICAgICAgICAgICAgemlwLnNwbGljZSgxLCAxLCBmaWxsdmFsdWUpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgICAgcmV0dXJuIHJlcztcbiAgICB9XG5cbiAgICBzdGF0aWMgcmFuZ2UobjogbnVtYmVyKSB7XG4gICAgICAgIHJldHVybiBuZXcgQXJyYXkobikuZmlsbCgwKS5tYXAoKF8sIGlkeCkgPT4gaWR4KTtcbiAgICB9XG5cbiAgICBzdGF0aWMgZ2V0QXJySW5kZXgoYXJyMmQ6IGFueVtdW10sIGFycjogYW55W10pIHtcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBhcnIyZC5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgaWYgKFV0aWwuYXJyRXEoYXJyMmRbaV0sIGFycikpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gaTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdW5kZWZpbmVkO1xuICAgIH1cblxuICAgIHN0YXRpYyBnZXRTdXBlcnMoY2xzOiBhbnkpOiBhbnlbXSB7XG4gICAgICAgIGNvbnN0IHNwcnMgPSBbXTtcbiAgICAgICAgY29uc3Qgc3VwZXJjbHMgPSBPYmplY3QuZ2V0UHJvdG90eXBlT2YoY2xzKTtcbiAgICAgIFxuICAgICAgICBpZiAoIHN1cGVyY2xzICE9PSBPYmplY3QucHJvdG90eXBlICYmIHN1cGVyY2xzICE9PSBudWxsKSB7XG4gICAgICAgICAgICBzcHJzLnB1c2goc3VwZXJjbHMpO1xuICAgICAgICAgICAgY29uc3QgcGFyZW50cyA9IFV0aWwuZ2V0U3VwZXJzKHN1cGVyY2xzKTtcbiAgICAgICAgICAgIHNwcnMucHVzaCguLi5wYXJlbnRzKTtcbiAgICAgICAgfVxuICAgICAgXG4gICAgICAgIHJldHVybiBzcHJzO1xuICAgIH1cblxuICAgIHN0YXRpYyBzaHVmZmxlQXJyYXkoYXJyOiBhbnlbXSkge1xuICAgICAgICBmb3IgKGxldCBpID0gYXJyLmxlbmd0aCAtIDE7IGkgPiAwOyBpLS0pIHtcbiAgICAgICAgICAgIGNvbnN0IGogPSBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiAoaSArIDEpKTtcbiAgICAgICAgICAgIGNvbnN0IHRlbXAgPSBhcnJbaV07XG4gICAgICAgICAgICBhcnJbaV0gPSBhcnJbal07XG4gICAgICAgICAgICBhcnJbal0gPSB0ZW1wO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgc3RhdGljIGFyck11bChhcnI6IGFueVtdLCBuOiBudW1iZXIpIHtcbiAgICAgICAgY29uc3QgcmVzID0gW107XG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgbjsgaSsrKSB7XG4gICAgICAgICAgICByZXMucHVzaChhcnIpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiByZXM7XG4gICAgfVxuXG4gICAgc3RhdGljIGFzc2lnbkVsZW1lbnRzKGFycjogYW55W10sIG5ld3ZhbHM6IGFueVtdLCBzdGFydDogbnVtYmVyLCBzdGVwOiBudW1iZXIpIHtcbiAgICAgICAgbGV0IGNvdW50ID0gMDtcbiAgICAgICAgZm9yIChsZXQgaSA9IHN0YXJ0OyBpIDwgYXJyLmxlbmd0aDsgaSs9c3RlcCkge1xuICAgICAgICAgICAgYXJyW2ldID0gbmV3dmFsc1tjb3VudF07XG4gICAgICAgICAgICBjb3VudCsrO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgc3RhdGljIHNwbGl0TG9naWNTdHIoczpzdHJpbmcpOiBhbnlbXSB7XG4gICAgICAgIGNvbnN0IG1hdGNoID0gcy5tYXRjaCgvXiguKz8pXFxzKyguKz8pXFxzKyguKikvKTtcbiAgICAgICAgcmV0dXJuIG1hdGNoPy5zbGljZSgxKTtcbiAgICB9XG59XG5cbi8vIGN1c3RvbSB2ZXJzaW9uIG9mIHRoZSBTZXQgY2xhc3Ncbi8vIG5lZWRlZCBzaW5jZSBzeW1weSByZWxpZXMgb24gaXRlbSB0dXBsZXMgd2l0aCBlcXVhbCBjb250ZW50cyBiZWluZyBtYXBwZWRcbi8vIHRvIHRoZSBzYW1lIGVudHJ5XG5jbGFzcyBIYXNoU2V0IHtcbiAgICBkaWN0OiBSZWNvcmQ8c3RyaW5nLCBhbnk+O1xuICAgIHNpemU6IG51bWJlcjtcbiAgICBzb3J0ZWRBcnI6IGFueVtdO1xuXG4gICAgY29uc3RydWN0b3IoYXJyPzogYW55W10pIHtcbiAgICAgICAgdGhpcy5zaXplID0gMDtcbiAgICAgICAgdGhpcy5kaWN0ID0ge307XG4gICAgICAgIGlmIChhcnIpIHtcbiAgICAgICAgICAgIEFycmF5LmZyb20oYXJyKS5mb3JFYWNoKChlbGVtZW50KSA9PiB7XG4gICAgICAgICAgICAgICAgdGhpcy5hZGQoZWxlbWVudCk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGNsb25lKCk6IEhhc2hTZXQge1xuICAgICAgICBjb25zdCBuZXdzZXQ6IEhhc2hTZXQgPSBuZXcgSGFzaFNldCgpO1xuICAgICAgICBmb3IgKGNvbnN0IGl0ZW0gb2YgT2JqZWN0LnZhbHVlcyh0aGlzLmRpY3QpKSB7XG4gICAgICAgICAgICBuZXdzZXQuYWRkKGl0ZW0pO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBuZXdzZXQ7XG4gICAgfVxuXG4gICAgZW5jb2RlKGl0ZW06IGFueSk6IHN0cmluZyB7XG4gICAgICAgIHJldHVybiBVdGlsLmhhc2hLZXkoaXRlbSk7XG4gICAgfVxuXG4gICAgYWRkKGl0ZW06IGFueSkge1xuICAgICAgICBjb25zdCBrZXkgPSB0aGlzLmVuY29kZShpdGVtKTtcbiAgICAgICAgaWYgKCEoa2V5IGluIHRoaXMuZGljdCkpIHtcbiAgICAgICAgICAgIHRoaXMuc2l6ZSsrO1xuICAgICAgICB9O1xuICAgICAgICB0aGlzLmRpY3Rba2V5XSA9IGl0ZW07XG4gICAgfVxuXG4gICAgYWRkQXJyKGFycjogYW55W10pIHtcbiAgICAgICAgZm9yIChjb25zdCBlIG9mIGFycikge1xuICAgICAgICAgICAgdGhpcy5hZGQoZSk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBoYXMoaXRlbTogYW55KSB7XG4gICAgICAgIHJldHVybiB0aGlzLmVuY29kZShpdGVtKSBpbiB0aGlzLmRpY3Q7XG4gICAgfVxuXG4gICAgdG9BcnJheSgpIHtcbiAgICAgICAgcmV0dXJuIE9iamVjdC52YWx1ZXModGhpcy5kaWN0KTtcbiAgICB9XG5cbiAgICAvLyBnZXQgdGhlIGhhc2hrZXkgZm9yIHRoaXMgc2V0IChlLmcuLCBpbiBhIGRpY3Rpb25hcnkpXG4gICAgaGFzaEtleSgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMudG9BcnJheSgpXG4gICAgICAgICAgICAubWFwKChlKSA9PiBVdGlsLmhhc2hLZXkoZSkpXG4gICAgICAgICAgICAuc29ydCgpXG4gICAgICAgICAgICAuam9pbihcIixcIik7XG4gICAgfVxuXG4gICAgaXNFbXB0eSgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuc2l6ZSA9PT0gMDtcbiAgICB9XG5cbiAgICByZW1vdmUoaXRlbTogYW55KSB7XG4gICAgICAgIHRoaXMuc2l6ZS0tO1xuICAgICAgICBkZWxldGUgdGhpcy5kaWN0W3RoaXMuZW5jb2RlKGl0ZW0pXTtcbiAgICB9XG5cbiAgICBnZXQoa2V5OiBhbnkpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuZGljdFtVdGlsLmhhc2hLZXkoa2V5KV07XG4gICAgfVxuXG4gICAgc2V0KGtleTogYW55LCB2YWw6IGFueSkge1xuICAgICAgICB0aGlzLmRpY3RbVXRpbC5oYXNoS2V5KGtleSldID0gdmFsO1xuICAgIH1cblxuICAgIHNvcnQoa2V5ZnVuYzogYW55ID0gKChhOiBhbnksIGI6IGFueSkgPT4gYSAtIGIpLCByZXZlcnNlOiBib29sZWFuID0gdHJ1ZSkge1xuICAgICAgICB0aGlzLnNvcnRlZEFyciA9IHRoaXMudG9BcnJheSgpO1xuICAgICAgICB0aGlzLnNvcnRlZEFyci5zb3J0KGtleWZ1bmMpO1xuICAgICAgICBpZiAocmV2ZXJzZSkge1xuICAgICAgICAgICAgdGhpcy5zb3J0ZWRBcnIucmV2ZXJzZSgpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcG9wKCkge1xuICAgICAgICB0aGlzLnNvcnQoKTsgLy8gISEhIHNsb3cgYnV0IEkgZG9uJ3Qgc2VlIGEgd29yayBhcm91bmRcbiAgICAgICAgaWYgKHRoaXMuc29ydGVkQXJyLmxlbmd0aCA+PSAxKSB7XG4gICAgICAgICAgICBjb25zdCB0ZW1wID0gdGhpcy5zb3J0ZWRBcnJbdGhpcy5zb3J0ZWRBcnIubGVuZ3RoIC0gMV07XG4gICAgICAgICAgICB0aGlzLnJlbW92ZSh0ZW1wKTtcbiAgICAgICAgICAgIHJldHVybiB0ZW1wO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGRpZmZlcmVuY2Uob3RoZXI6IEhhc2hTZXQpIHtcbiAgICAgICAgY29uc3QgcmVzID0gbmV3IEhhc2hTZXQoKTtcbiAgICAgICAgZm9yIChjb25zdCBpIG9mIHRoaXMudG9BcnJheSgpKSB7XG4gICAgICAgICAgICBpZiAoIShvdGhlci5oYXMoaSkpKSB7XG4gICAgICAgICAgICAgICAgcmVzLmFkZChpKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gcmVzO1xuICAgIH1cblxuICAgIGludGVyc2VjdHMob3RoZXI6IEhhc2hTZXQpIHtcbiAgICAgICAgZm9yIChjb25zdCBpIG9mIHRoaXMudG9BcnJheSgpKSB7XG4gICAgICAgICAgICBpZiAob3RoZXIuaGFzKGkpKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbn1cblxuLy8gYSBoYXNoZGljdCBjbGFzcyByZXBsYWNpbmcgdGhlIGRpY3QgY2xhc3MgaW4gcHl0aG9uXG5jbGFzcyBIYXNoRGljdCB7XG4gICAgc2l6ZTogbnVtYmVyO1xuICAgIGRpY3Q6IFJlY29yZDxhbnksIGFueT47XG5cbiAgICBjb25zdHJ1Y3RvcihkOiBSZWNvcmQ8YW55LCBhbnk+ID0ge30pIHtcbiAgICAgICAgdGhpcy5zaXplID0gMDtcbiAgICAgICAgdGhpcy5kaWN0ID0ge307XG4gICAgICAgIGZvciAoY29uc3QgaXRlbSBvZiBPYmplY3QuZW50cmllcyhkKSkge1xuICAgICAgICAgICAgdGhpcy5kaWN0W1V0aWwuaGFzaEtleShpdGVtWzBdKV0gPSBbaXRlbVswXSwgaXRlbVsxXV07XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBjbG9uZSgpIHtcbiAgICAgICAgcmV0dXJuIG5ldyBIYXNoRGljdCh0aGlzLmRpY3QpO1xuICAgIH1cblxuICAgIHJlbW92ZShpdGVtOiBhbnkpIHtcbiAgICAgICAgdGhpcy5zaXplLS07XG4gICAgICAgIGRlbGV0ZSB0aGlzLmRpY3RbVXRpbC5oYXNoS2V5KGl0ZW0pXTtcbiAgICB9XG5cbiAgICBzZXRkZWZhdWx0KGtleTogYW55LCB2YWx1ZTogYW55KSB7XG4gICAgICAgIGlmICh0aGlzLmhhcyhrZXkpKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5nZXQoa2V5KTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMuYWRkKGtleSwgdmFsdWUpO1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuZ2V0KGtleSk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBnZXQoa2V5OiBhbnksIGRlZjogYW55ID0gdW5kZWZpbmVkKTogYW55IHtcbiAgICAgICAgY29uc3QgaGFzaCA9IFV0aWwuaGFzaEtleShrZXkpO1xuICAgICAgICBpZiAoaGFzaCBpbiB0aGlzLmRpY3QpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmRpY3RbaGFzaF1bMV07XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGRlZjtcbiAgICB9XG5cbiAgICBoYXMoa2V5OiBhbnkpOiBib29sZWFuIHtcbiAgICAgICAgY29uc3QgaGFzaEtleSA9IFV0aWwuaGFzaEtleShrZXkpO1xuICAgICAgICByZXR1cm4gaGFzaEtleSBpbiB0aGlzLmRpY3Q7XG4gICAgfVxuXG4gICAgYWRkKGtleTogYW55LCB2YWx1ZTogYW55KSB7XG4gICAgICAgIGNvbnN0IGtleUhhc2ggPSBVdGlsLmhhc2hLZXkoa2V5KTtcbiAgICAgICAgaWYgKCEoa2V5SGFzaCBpbiBPYmplY3Qua2V5cyh0aGlzLmRpY3QpKSkge1xuICAgICAgICAgICAgdGhpcy5zaXplKys7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5kaWN0W2tleUhhc2hdID0gW2tleSwgdmFsdWVdO1xuICAgIH1cblxuICAgIGtleXMoKSB7XG4gICAgICAgIGNvbnN0IHZhbHMgPSBPYmplY3QudmFsdWVzKHRoaXMuZGljdCk7XG4gICAgICAgIHJldHVybiB2YWxzLm1hcCgoZSkgPT4gZVswXSk7XG4gICAgfVxuXG4gICAgdmFsdWVzKCkge1xuICAgICAgICBjb25zdCB2YWxzID0gT2JqZWN0LnZhbHVlcyh0aGlzLmRpY3QpO1xuICAgICAgICByZXR1cm4gdmFscy5tYXAoKGUpID0+IGVbMV0pO1xuICAgIH1cblxuICAgIGVudHJpZXMoKSB7XG4gICAgICAgIHJldHVybiBPYmplY3QudmFsdWVzKHRoaXMuZGljdCk7XG4gICAgfVxuXG4gICAgYWRkQXJyKGFycjogYW55W10pIHtcbiAgICAgICAgY29uc3Qga2V5SGFzaCA9IFV0aWwuaGFzaEtleShhcnJbMF0pO1xuICAgICAgICB0aGlzLmRpY3Rba2V5SGFzaF0gPSBhcnI7XG4gICAgfVxuXG4gICAgZGVsZXRlKGtleTogYW55KSB7XG4gICAgICAgIGNvbnN0IGtleWhhc2ggPSBVdGlsLmhhc2hLZXkoa2V5KTtcbiAgICAgICAgaWYgKGtleWhhc2ggaW4gdGhpcy5kaWN0KSB7XG4gICAgICAgICAgICB0aGlzLnNpemUtLTtcbiAgICAgICAgICAgIGRlbGV0ZSB0aGlzLmRpY3Rba2V5aGFzaF07XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBtZXJnZShvdGhlcjogSGFzaERpY3QpIHtcbiAgICAgICAgZm9yIChjb25zdCBpdGVtIG9mIG90aGVyLmVudHJpZXMoKSkge1xuICAgICAgICAgICAgdGhpcy5hZGQoaXRlbVswXSwgaXRlbVsxXSk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBjb3B5KCkge1xuICAgICAgICBjb25zdCByZXM6IEhhc2hEaWN0ID0gbmV3IEhhc2hEaWN0KCk7XG4gICAgICAgIGZvciAoY29uc3QgaXRlbSBvZiB0aGlzLmVudHJpZXMoKSkge1xuICAgICAgICAgICAgcmVzLmFkZChpdGVtWzBdLCBpdGVtWzFdKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gcmVzO1xuICAgIH1cblxuICAgIGlzU2FtZShvdGhlcjogSGFzaERpY3QpIHtcbiAgICAgICAgY29uc3QgYXJyMSA9IHRoaXMuZW50cmllcygpLnNvcnQoKTtcbiAgICAgICAgY29uc3QgYXJyMiA9IG90aGVyLmVudHJpZXMoKS5zb3J0KCk7XG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgYXJyMS5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgaWYgKCEoVXRpbC5hcnJFcShhcnIxW2ldLCBhcnIyW2ldKSkpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuXG4gICAgZmFjdG9yc1RvU3RyaW5nKCkge1xuICAgICAgICBsZXQgbnVtZXJhdG9yID0gXCJcIjtcbiAgICAgICAgbGV0IGRlbm9taW5hdG9yID0gXCJcIjtcbiAgICAgICAgZm9yIChjb25zdCBbZmFjdG9yLCBleHBdIG9mIHRoaXMuZW50cmllcygpKSB7XG4gICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IE1hdGguYWJzKGV4cCk7IGkrKykge1xuICAgICAgICAgICAgICAgIGlmIChleHAgPCAwKSB7XG4gICAgICAgICAgICAgICAgICAgIGRlbm9taW5hdG9yICs9IChmYWN0b3IudG9TdHJpbmcoKSArIFwiKlwiKVxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIG51bWVyYXRvciArPSAoZmFjdG9yLnRvU3RyaW5nKCkgKyBcIipcIilcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGRlbm9taW5hdG9yLmxlbmd0aCA9PSAwKSB7XG4gICAgICAgICAgICByZXR1cm4gbnVtZXJhdG9yLnNsaWNlKDAsIC0xKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiBudW1lcmF0b3Iuc2xpY2UoMCwgLTEpICsgXCIvXCIgKyBkZW5vbWluYXRvci5zbGljZSgwLCAtMSk7XG4gICAgICAgIH1cbiAgICB9XG59XG5cblxuLy8gc3ltcHkgb2Z0ZW4gdXNlcyBkZWZhdWx0ZGljdChzZXQpIHdoaWNoIGlzIG5vdCBhdmFpbGFibGUgaW4gdHNcbi8vIHdlIGNyZWF0ZSBhIHJlcGxhY2VtZW50IGRpY3Rpb25hcnkgY2xhc3Mgd2hpY2ggcmV0dXJucyBhbiBlbXB0eSBzZXRcbi8vIGlmIHRoZSBrZXkgdXNlZCBpcyBub3QgaW4gdGhlIGRpY3Rpb25hcnlcbmNsYXNzIFNldERlZmF1bHREaWN0IGV4dGVuZHMgSGFzaERpY3Qge1xuICAgIGNvbnN0cnVjdG9yKCkge1xuICAgICAgICBzdXBlcigpO1xuICAgIH1cblxuICAgIGdldChrZXk6IGFueSkge1xuICAgICAgICBjb25zdCBrZXlIYXNoID0gVXRpbC5oYXNoS2V5KGtleSk7XG4gICAgICAgIGlmIChrZXlIYXNoIGluIHRoaXMuZGljdCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuZGljdFtrZXlIYXNoXVsxXTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gbmV3IEhhc2hTZXQoKTtcbiAgICB9XG59XG5cbmNsYXNzIEludERlZmF1bHREaWN0IGV4dGVuZHMgSGFzaERpY3Qge1xuICAgIGNvbnN0cnVjdG9yKCkge1xuICAgICAgICBzdXBlcigpO1xuICAgIH1cblxuICAgIGluY3JlbWVudChrZXk6IGFueSwgdmFsOiBhbnkpIHtcbiAgICAgICAgY29uc3Qga2V5SGFzaCA9IFV0aWwuaGFzaEtleShrZXkpO1xuICAgICAgICBpZiAoa2V5SGFzaCBpbiB0aGlzLmRpY3QpIHtcbiAgICAgICAgICAgIHRoaXMuZGljdFtrZXlIYXNoXSArPSB2YWw7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aGlzLmRpY3Rba2V5SGFzaF0gPSAwO1xuICAgICAgICAgICAgdGhpcy5kaWN0W2tleUhhc2hdICs9IHZhbDtcbiAgICAgICAgfVxuICAgIH1cbn1cblxuY2xhc3MgQXJyRGVmYXVsdERpY3QgZXh0ZW5kcyBIYXNoRGljdCB7XG4gICAgY29uc3RydWN0b3IoKSB7XG4gICAgICAgIHN1cGVyKCk7XG4gICAgfVxuXG4gICAgZ2V0KGtleTogYW55KSB7XG4gICAgICAgIGNvbnN0IGtleUhhc2ggPSBVdGlsLmhhc2hLZXkoa2V5KTtcbiAgICAgICAgaWYgKGtleUhhc2ggaW4gdGhpcy5kaWN0KSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5kaWN0W2tleUhhc2hdWzFdO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBbXTtcbiAgICB9XG59XG5cblxuLy8gYW4gaW1wbGljYXRpb24gY2xhc3MgdXNlZCBhcyBhbiBhbHRlcm5hdGl2ZSB0byB0dXBsZXMgaW4gc3ltcHlcbmNsYXNzIEltcGxpY2F0aW9uIHtcbiAgICBwO1xuICAgIHE7XG5cbiAgICBjb25zdHJ1Y3RvcihwOiBhbnksIHE6IGFueSkge1xuICAgICAgICB0aGlzLnAgPSBwO1xuICAgICAgICB0aGlzLnEgPSBxO1xuICAgIH1cblxuICAgIGhhc2hLZXkoKSB7XG4gICAgICAgIHJldHVybiAodGhpcy5wIGFzIHN0cmluZykgKyAodGhpcy5xIGFzIHN0cmluZyk7XG4gICAgfVxufVxuXG5cbi8vIGFuIExSVSBjYWNoZSBpbXBsZW1lbnRhdGlvbiB1c2VkIGZvciBjYWNoZS50c1xuXG5pbnRlcmZhY2UgTm9kZSB7XG4gICAga2V5OiBhbnk7XG4gICAgdmFsdWU6IGFueTtcbiAgICBwcmV2OiBhbnk7XG4gICAgbmV4dDogYW55O1xufVxuXG5jbGFzcyBMUlVDYWNoZSB7XG4gICAgY2FwYWNpdHk6IG51bWJlcjtcbiAgICBtYXA6IEhhc2hEaWN0O1xuICAgIGhlYWQ6IGFueTtcbiAgICB0YWlsOiBhbnk7XG5cbiAgICBjb25zdHJ1Y3RvcihjYXBhY2l0eTogbnVtYmVyKSB7XG4gICAgICAgIHRoaXMuY2FwYWNpdHkgPSBjYXBhY2l0eTtcbiAgICAgICAgdGhpcy5tYXAgPSBuZXcgSGFzaERpY3QoKTtcblxuICAgICAgICAvLyB0aGVzZSBhcmUgYm91bmRhcmllcyBmb3IgdGhlIGRvdWJsZSBsaW5rZWQgbGlzdFxuICAgICAgICB0aGlzLmhlYWQgPSB7fTtcbiAgICAgICAgdGhpcy50YWlsID0ge307XG5cbiAgICAgICAgdGhpcy5oZWFkLm5leHQgPSB0aGlzLmhlYWQ7XG4gICAgICAgIHRoaXMudGFpbC5wcmV2ID0gdGhpcy5oZWFkO1xuICAgIH1cblxuICAgIGdldChrZXk6IGFueSkge1xuICAgICAgICBpZiAodGhpcy5tYXAuaGFzKGtleSkpIHtcbiAgICAgICAgICAgIC8vIHJlbW92ZSBlbGVtZW50IGZyb20gdGhlIGN1cnJlbnQgcG9zaXRpb25cbiAgICAgICAgICAgIGNvbnN0IGMgPSB0aGlzLm1hcC5nZXQoa2V5KTtcbiAgICAgICAgICAgIGMucHJldi5uZXh0ID0gYy5uZXh0O1xuICAgICAgICAgICAgYy5uZXh0LnByZXYgPSBjLnByZXY7XG5cbiAgICAgICAgICAgIHRoaXMudGFpbC5wcmV2Lm5leHQgPSBjOyAvLyBpbnNlcnQgYWZ0ZXIgbGFzdCBlbGVtZW50XG4gICAgICAgICAgICBjLnByZXYgPSB0aGlzLnRhaWwucHJldjtcbiAgICAgICAgICAgIGMubmV4dCA9IHRoaXMudGFpbDtcbiAgICAgICAgICAgIHRoaXMudGFpbC5wcmV2ID0gYztcblxuICAgICAgICAgICAgcmV0dXJuIGMudmFsdWU7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gdW5kZWZpbmVkOyAvLyBpbnZhbGlkIGtleVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgcHV0KGtleTogYW55LCB2YWx1ZTogYW55KSB7XG4gICAgICAgIGlmICh0eXBlb2YgdGhpcy5nZXQoa2V5KSAhPT0gXCJ1bmRlZmluZWRcIikgeyAvLyB0aGUga2V5IGlzIGludmFsaWRcbiAgICAgICAgICAgIHRoaXMudGFpbC5wcmV2LnZhbHVlID0gdmFsdWU7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAvLyBjaGVjayBmb3IgY2FwYWNpdHlcbiAgICAgICAgICAgIGlmICh0aGlzLm1hcC5zaXplID09PSB0aGlzLmNhcGFjaXR5KSB7XG4gICAgICAgICAgICAgICAgdGhpcy5tYXAuZGVsZXRlKHRoaXMuaGVhZC5uZXh0LmtleSk7IC8vIGRlbGV0ZSBmaXJzdCBlbGVtZW50XG4gICAgICAgICAgICAgICAgdGhpcy5oZWFkLm5leHQgPSB0aGlzLmhlYWQubmV4dC5uZXh0OyAvLyByZXBsYWNlIHdpdGggbmV4dFxuICAgICAgICAgICAgICAgIHRoaXMuaGVhZC5uZXh0LnByZXYgPSB0aGlzLmhlYWQ7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgY29uc3QgbmV3Tm9kZTogTm9kZSA9IHtcbiAgICAgICAgICAgIHZhbHVlLFxuICAgICAgICAgICAga2V5LFxuICAgICAgICAgICAgcHJldjogbnVsbCxcbiAgICAgICAgICAgIG5leHQ6IG51bGwsXG4gICAgICAgIH07IC8vIGVhY2ggbm9kZSBpcyBhIGhhc2ggZW50cnlcblxuICAgICAgICAvLyB3aGVuIGFkZGluZyBhIG5ldyBub2RlLCB3ZSBuZWVkIHRvIHVwZGF0ZSBib3RoIG1hcCBhbmQgRExMXG4gICAgICAgIHRoaXMubWFwLmFkZChrZXksIG5ld05vZGUpOyAvLyBhZGQgdGhlIGN1cnJlbnQgbm9kZVxuICAgICAgICB0aGlzLnRhaWwucHJldi5uZXh0ID0gbmV3Tm9kZTsgLy8gYWRkIG5vZGUgdG8gdGhlIGVuZFxuICAgICAgICBuZXdOb2RlLnByZXYgPSB0aGlzLnRhaWwucHJldjtcbiAgICAgICAgbmV3Tm9kZS5uZXh0ID0gdGhpcy50YWlsO1xuICAgICAgICB0aGlzLnRhaWwucHJldiA9IG5ld05vZGU7XG4gICAgfVxufVxuXG5jbGFzcyBJdGVyYXRvciB7XG4gICAgYXJyOiBhbnlbXTtcbiAgICBjb3VudGVyO1xuXG4gICAgY29uc3RydWN0b3IoYXJyOiBhbnlbXSkge1xuICAgICAgICB0aGlzLmFyciA9IGFycjtcbiAgICAgICAgdGhpcy5jb3VudGVyID0gMDtcbiAgICB9XG5cbiAgICBuZXh0KCkge1xuICAgICAgICBpZiAodGhpcy5jb3VudGVyID49IHRoaXMuYXJyLmxlbmd0aCkge1xuICAgICAgICAgICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLmNvdW50ZXIrKztcbiAgICAgICAgcmV0dXJuIHRoaXMuYXJyW3RoaXMuY291bnRlci0xXTtcbiAgICB9XG59XG5cbi8vIG1peGluIGNsYXNzIHVzZWQgdG8gcmVwbGljYXRlIG11bHRpcGxlIGluaGVyaXRhbmNlXG5cbmNsYXNzIE1peGluQnVpbGRlciB7XG4gICAgc3VwZXJjbGFzcztcbiAgICBjb25zdHJ1Y3RvcihzdXBlcmNsYXNzOiBhbnkpIHtcbiAgICAgICAgdGhpcy5zdXBlcmNsYXNzID0gc3VwZXJjbGFzcztcbiAgICB9XG4gICAgd2l0aCguLi5taXhpbnM6IGFueVtdKSB7XG4gICAgICAgIHJldHVybiBtaXhpbnMucmVkdWNlKChjLCBtaXhpbikgPT4gbWl4aW4oYyksIHRoaXMuc3VwZXJjbGFzcyk7XG4gICAgfVxufVxuXG5jbGFzcyBiYXNlIHt9XG5cbmNvbnN0IG1peCA9IChzdXBlcmNsYXNzOiBhbnkpID0+IG5ldyBNaXhpbkJ1aWxkZXIoc3VwZXJjbGFzcyk7XG5cblxuZXhwb3J0IHtVdGlsLCBIYXNoU2V0LCBTZXREZWZhdWx0RGljdCwgSGFzaERpY3QsIEltcGxpY2F0aW9uLCBMUlVDYWNoZSwgSXRlcmF0b3IsIEludERlZmF1bHREaWN0LCBBcnJEZWZhdWx0RGljdCwgbWl4LCBiYXNlfTtcblxuIiwgIi8qIGVzbGludC1kaXNhYmxlIG5ldy1jYXAgKi9cbi8qIGVzbGludC1kaXNhYmxlIG5vLXVudXNlZC12YXJzICovXG4vKlxuXG5Ob3RhYmxlIGNobmFnZXMgbWFkZSAoV0IgJiBHTSk6XG4tIE51bGwgaXMgYmVpbmcgdXNlZCBhcyBhIHRoaXJkIGJvb2xlYW4gdmFsdWUgaW5zdGVhZCBvZiAnbm9uZSdcbi0gQXJyYXlzIGFyZSBiZWluZyB1c2VkIGluc3RlYWQgb2YgdHVwbGVzXG4tIFRoZSBtZXRob2RzIGhhc2hLZXkoKSBhbmQgdG9TdHJpbmcoKSBhcmUgYWRkZWQgdG8gTG9naWMgZm9yIGhhc2hpbmcuIFRoZVxuICBzdGF0aWMgbWV0aG9kIGhhc2hLZXkoKSBpcyBhbHNvIGFkZGVkIHRvIExvZ2ljIGFuZCBoYXNoZXMgZGVwZW5kaW5nIG9uIHRoZSBpbnB1dC5cbi0gQSBjb25zdHJ1Y3RvciBpcyBhZGRlZCB0byB0aGUgbG9naWMgY2xhc3MsIHdoaWNoIGlzIHVzZWQgYnkgTG9naWMgYW5kIGl0c1xuICBzdWJjbGFzc2VzIChBbmRPcl9CYXNlLCBBbmQsIE9yLCBOb3QpXG4tIEluIHRoZSBmbGF0dGVuIG1ldGhvZCBvZiBBbmRPcl9CYXNlIHdlIHJlbW92ZWQgdGhlIHRyeSBjYXRjaCBhbmQgY2hhbmdlZCB0aGVcbiAgd2hpbGUgbG9vcCB0byBkZXBlbmQgb24gdGhlIGxlZ250aCBvZiB0aGUgYXJncyBhcnJheVxuLSBBZGRlZCBleHBhbmQoKSBhbmQgZXZhbF9wcm9wYWdhdGVfbm90IGFzIGFic3RyYWN0IG1ldGhvZHMgdG8gdGhlIExvZ2ljIGNsYXNzXG4tIEFkZGVkIHN0YXRpYyBOZXcgbWV0aG9kcyB0byBOb3QsIEFuZCwgYW5kIE9yIHdoaWNoIGZ1bmN0aW9uIGFzIGNvbnN0cnVjdG9yc1xuLSBSZXBsYWNlZCBub3JtYWwgYm9vbGVhbnMgd2l0aCBMb2dpYy5UcnVlIGFuZCBMb2dpYy5GYWxzZSBzaW5jZSBpdCBpcyBzb21ldGltZXNcbiAgbmVjZXNhcnkgdG8gZmluZCBpZiBhIGdpdmVuIGFyZ3VtZW5ldCBpcyBhIGJvb2xlYW5cbi0gQWRkZWQgc29tZSB2MiBtZXRob2RzIHdoaWNoIHJldHVybiB0cnVlLCBmYWxzZSwgYW5kIHVuZGVmaW5lZCwgd2hpY2ggd29ya3NcbiAgd2l0aCB0aGUgcmVzdCBvZiB0aGUgY29kZVxuLSBUT0RPOiB0aGUgYm9vbGVhbiBsb2dpYyBoZXJlIG5lZWRzIHRvIGJlIGNvbnNpc3RlbnQgd2l0aCB0aGUgcmVzdCBvZiB0aGUgY29kZVxuICAgIC0gTG9naWMuVHJ1ZSBhbmQgTG9naWMuRmFsc2UgYXJlIG5vdCB1c2VkIGVsc2V3aGVyZVxuICAgIC0gVW5kZWZpZWQgaXMgdXN1YWxseSB1c2VkIGFzIHRoZSB0aGlyZCBib29sZWFuLCBhbmQgbm90IG51bGxcblxuKi9cblxuaW1wb3J0IHtVdGlsLCBIYXNoU2V0fSBmcm9tIFwiLi91dGlsaXR5XCI7XG5cblxuZnVuY3Rpb24gX3RvcmYoYXJnczogYW55W10pOiBMb2dpYyB8IG51bGwge1xuICAgIC8qIFJldHVybiBUcnVlIGlmIGFsbCBhcmdzIGFyZSBUcnVlLCBGYWxzZSBpZiB0aGV5XG4gICAgYXJlIGFsbCBGYWxzZSwgZWxzZSBOb25lXG4gICAgPj4+IGZyb20gc3ltcHkuY29yZS5sb2dpYyBpbXBvcnQgX3RvcmZcbiAgICA+Pj4gX3RvcmYoKFRydWUsIFRydWUpKVxuICAgIFRydWVcbiAgICA+Pj4gX3RvcmYoKEZhbHNlLCBGYWxzZSkpXG4gICAgRmFsc2VcbiAgICA+Pj4gX3RvcmYoKFRydWUsIEZhbHNlKSlcbiAgICAqL1xuICAgIGxldCBzYXdUID0gTG9naWMuRmFsc2U7XG4gICAgbGV0IHNhd0YgPSBMb2dpYy5GYWxzZTtcbiAgICBmb3IgKGNvbnN0IGEgb2YgYXJncykge1xuICAgICAgICBpZiAoYSA9PT0gTG9naWMuVHJ1ZSkge1xuICAgICAgICAgICAgaWYgKHNhd0YgaW5zdGFuY2VvZiBUcnVlKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBzYXdUID0gTG9naWMuVHJ1ZTtcbiAgICAgICAgfSBlbHNlIGlmIChhID09PSBMb2dpYy5GYWxzZSkge1xuICAgICAgICAgICAgaWYgKHNhd1QgaW5zdGFuY2VvZiBUcnVlKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBzYXdGID0gTG9naWMuVHJ1ZTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiBudWxsO1xuICAgICAgICB9XG4gICAgfVxuICAgIHJldHVybiBzYXdUO1xufVxuXG5mdW5jdGlvbiBfZnV6enlfZ3JvdXAoYXJnczogYW55W10sIHF1aWNrX2V4aXQgPSBMb2dpYy5GYWxzZSk6IExvZ2ljIHwgbnVsbCB7XG4gICAgLyogUmV0dXJuIFRydWUgaWYgYWxsIGFyZ3MgYXJlIFRydWUsIE5vbmUgaWYgdGhlcmUgaXMgYW55IE5vbmUgZWxzZSBGYWxzZVxuICAgIHVubGVzcyBgYHF1aWNrX2V4aXRgYCBpcyBUcnVlICh0aGVuIHJldHVybiBOb25lIGFzIHNvb24gYXMgYSBzZWNvbmQgRmFsc2VcbiAgICBpcyBzZWVuLlxuICAgICBgYF9mdXp6eV9ncm91cGBgIGlzIGxpa2UgYGBmdXp6eV9hbmRgYCBleGNlcHQgdGhhdCBpdCBpcyBtb3JlXG4gICAgY29uc2VydmF0aXZlIGluIHJldHVybmluZyBhIEZhbHNlLCB3YWl0aW5nIHRvIG1ha2Ugc3VyZSB0aGF0IGFsbFxuICAgIGFyZ3VtZW50cyBhcmUgVHJ1ZSBvciBGYWxzZSBhbmQgcmV0dXJuaW5nIE5vbmUgaWYgYW55IGFyZ3VtZW50cyBhcmVcbiAgICBOb25lLiBJdCBhbHNvIGhhcyB0aGUgY2FwYWJpbGl0eSBvZiBwZXJtaXRpbmcgb25seSBhIHNpbmdsZSBGYWxzZSBhbmRcbiAgICByZXR1cm5pbmcgTm9uZSBpZiBtb3JlIHRoYW4gb25lIGlzIHNlZW4uIEZvciBleGFtcGxlLCB0aGUgcHJlc2VuY2Ugb2YgYVxuICAgIHNpbmdsZSB0cmFuc2NlbmRlbnRhbCBhbW9uZ3N0IHJhdGlvbmFscyB3b3VsZCBpbmRpY2F0ZSB0aGF0IHRoZSBncm91cCBpc1xuICAgIG5vIGxvbmdlciByYXRpb25hbDsgYnV0IGEgc2Vjb25kIHRyYW5zY2VuZGVudGFsIGluIHRoZSBncm91cCB3b3VsZCBtYWtlIHRoZVxuICAgIGRldGVybWluYXRpb24gaW1wb3NzaWJsZS5cbiAgICBFeGFtcGxlc1xuICAgID09PT09PT09XG4gICAgPj4+IGZyb20gc3ltcHkuY29yZS5sb2dpYyBpbXBvcnQgX2Z1enp5X2dyb3VwXG4gICAgQnkgZGVmYXVsdCwgbXVsdGlwbGUgRmFsc2VzIG1lYW4gdGhlIGdyb3VwIGlzIGJyb2tlbjpcbiAgICA+Pj4gX2Z1enp5X2dyb3VwKFtGYWxzZSwgRmFsc2UsIFRydWVdKVxuICAgIEZhbHNlXG4gICAgSWYgbXVsdGlwbGUgRmFsc2VzIG1lYW4gdGhlIGdyb3VwIHN0YXR1cyBpcyB1bmtub3duIHRoZW4gc2V0XG4gICAgYHF1aWNrX2V4aXRgIHRvIFRydWUgc28gTm9uZSBjYW4gYmUgcmV0dXJuZWQgd2hlbiB0aGUgMm5kIEZhbHNlIGlzIHNlZW46XG4gICAgPj4+IF9mdXp6eV9ncm91cChbRmFsc2UsIEZhbHNlLCBUcnVlXSwgcXVpY2tfZXhpdD1UcnVlKVxuICAgIEJ1dCBpZiBvbmx5IGEgc2luZ2xlIEZhbHNlIGlzIHNlZW4gdGhlbiB0aGUgZ3JvdXAgaXMga25vd24gdG9cbiAgICBiZSBicm9rZW46XG4gICAgPj4+IF9mdXp6eV9ncm91cChbRmFsc2UsIFRydWUsIFRydWVdLCBxdWlja19leGl0PVRydWUpXG4gICAgRmFsc2VcbiAgICAqL1xuICAgIGxldCBzYXdfb3RoZXIgPSBMb2dpYy5GYWxzZTtcbiAgICBmb3IgKGNvbnN0IGEgb2YgYXJncykge1xuICAgICAgICBpZiAoYSA9PT0gTG9naWMuVHJ1ZSkge1xuICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgIH0gaWYgKGEgPT0gbnVsbCkge1xuICAgICAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICAgIH0gaWYgKHF1aWNrX2V4aXQgaW5zdGFuY2VvZiBUcnVlICYmIHNhd19vdGhlciBpbnN0YW5jZW9mIFRydWUpIHtcbiAgICAgICAgICAgIHJldHVybiBudWxsO1xuICAgICAgICB9XG4gICAgICAgIHNhd19vdGhlciA9IExvZ2ljLlRydWU7XG4gICAgfVxuICAgIGlmIChzYXdfb3RoZXIgaW5zdGFuY2VvZiBUcnVlKSB7XG4gICAgICAgIHJldHVybiBMb2dpYy5GYWxzZTtcbiAgICB9XG4gICAgcmV0dXJuIExvZ2ljLlRydWU7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBfZnV6enlfZ3JvdXB2MihhcmdzOiBhbnlbXSkge1xuICAgIGNvbnN0IHJlcyA9IF9mdXp6eV9ncm91cChhcmdzKTtcbiAgICBpZiAocmVzID09PSBMb2dpYy5UcnVlKSB7XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgIH0gZWxzZSBpZiAocmVzID09PSBMb2dpYy5GYWxzZSkge1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICAgIHJldHVybiB1bmRlZmluZWQ7XG59XG5cblxuZnVuY3Rpb24gZnV6enlfYm9vbCh4OiBMb2dpYyk6IExvZ2ljIHwgbnVsbCB7XG4gICAgLyogUmV0dXJuIFRydWUsIEZhbHNlIG9yIE5vbmUgYWNjb3JkaW5nIHRvIHguXG4gICAgV2hlcmVhcyBib29sKHgpIHJldHVybnMgVHJ1ZSBvciBGYWxzZSwgZnV6enlfYm9vbCBhbGxvd3NcbiAgICBmb3IgdGhlIE5vbmUgdmFsdWUgYW5kIG5vbiAtIGZhbHNlIHZhbHVlcyh3aGljaCBiZWNvbWUgTm9uZSksIHRvby5cbiAgICBFeGFtcGxlc1xuICAgID09PT09PT09XG4gICAgPj4+IGZyb20gc3ltcHkuY29yZS5sb2dpYyBpbXBvcnQgZnV6enlfYm9vbFxuICAgID4+PiBmcm9tIHN5bXB5LmFiYyBpbXBvcnQgeFxuICAgID4+PiBmdXp6eV9ib29sKHgpLCBmdXp6eV9ib29sKE5vbmUpXG4gICAgKE5vbmUsIE5vbmUpXG4gICAgPj4+IGJvb2woeCksIGJvb2woTm9uZSlcbiAgICAgICAgKFRydWUsIEZhbHNlKVxuICAgICovXG4gICAgaWYgKHggPT0gbnVsbCkge1xuICAgICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG4gICAgaWYgKHggaW5zdGFuY2VvZiBUcnVlKSB7XG4gICAgICAgIHJldHVybiBMb2dpYy5UcnVlO1xuICAgIH1cbiAgICBpZiAoeCBpbnN0YW5jZW9mIEZhbHNlKSB7XG4gICAgICAgIHJldHVybiBMb2dpYy5GYWxzZTtcbiAgICB9XG59XG5cbmZ1bmN0aW9uIGZ1enp5X2Jvb2xfdjIoeDogYm9vbGVhbikge1xuICAgIC8qIFJldHVybiBUcnVlLCBGYWxzZSBvciBOb25lIGFjY29yZGluZyB0byB4LlxuICAgIFdoZXJlYXMgYm9vbCh4KSByZXR1cm5zIFRydWUgb3IgRmFsc2UsIGZ1enp5X2Jvb2wgYWxsb3dzXG4gICAgZm9yIHRoZSBOb25lIHZhbHVlIGFuZCBub24gLSBmYWxzZSB2YWx1ZXMod2hpY2ggYmVjb21lIE5vbmUpLCB0b28uXG4gICAgRXhhbXBsZXNcbiAgICA9PT09PT09PVxuICAgID4+PiBmcm9tIHN5bXB5LmNvcmUubG9naWMgaW1wb3J0IGZ1enp5X2Jvb2xcbiAgICA+Pj4gZnJvbSBzeW1weS5hYmMgaW1wb3J0IHhcbiAgICA+Pj4gZnV6enlfYm9vbCh4KSwgZnV6enlfYm9vbChOb25lKVxuICAgIChOb25lLCBOb25lKVxuICAgID4+PiBib29sKHgpLCBib29sKE5vbmUpXG4gICAgICAgIChUcnVlLCBGYWxzZSlcbiAgICAqL1xuICAgIGlmICh0eXBlb2YgeCA9PT0gXCJ1bmRlZmluZWRcIikge1xuICAgICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG4gICAgaWYgKHggPT09IHRydWUpIHtcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuICAgIGlmICh4ID09PSBmYWxzZSkge1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxufVxuXG5mdW5jdGlvbiBmdXp6eV9hbmQoYXJnczogYW55W10pOiBMb2dpYyB8IG51bGwge1xuICAgIC8qIFJldHVybiBUcnVlIChhbGwgVHJ1ZSksIEZhbHNlIChhbnkgRmFsc2UpIG9yIE5vbmUuXG4gICAgRXhhbXBsZXNcbiAgICA9PT09PT09PVxuICAgID4+PiBmcm9tIHN5bXB5LmNvcmUubG9naWMgaW1wb3J0IGZ1enp5X2FuZFxuICAgID4+PiBmcm9tIHN5bXB5IGltcG9ydCBEdW1teVxuICAgIElmIHlvdSBoYWQgYSBsaXN0IG9mIG9iamVjdHMgdG8gdGVzdCB0aGUgY29tbXV0aXZpdHkgb2ZcbiAgICBhbmQgeW91IHdhbnQgdGhlIGZ1enp5X2FuZCBsb2dpYyBhcHBsaWVkLCBwYXNzaW5nIGFuXG4gICAgaXRlcmF0b3Igd2lsbCBhbGxvdyB0aGUgY29tbXV0YXRpdml0eSB0byBvbmx5IGJlIGNvbXB1dGVkXG4gICAgYXMgbWFueSB0aW1lcyBhcyBuZWNlc3NhcnkuV2l0aCB0aGlzIGxpc3QsIEZhbHNlIGNhbiBiZVxuICAgIHJldHVybmVkIGFmdGVyIGFuYWx5emluZyB0aGUgZmlyc3Qgc3ltYm9sOlxuICAgID4+PiBzeW1zID1bRHVtbXkoY29tbXV0YXRpdmUgPSBGYWxzZSksIER1bW15KCldXG4gICAgPj4+IGZ1enp5X2FuZChzLmlzX2NvbW11dGF0aXZlIGZvciBzIGluIHN5bXMpXG4gICAgRmFsc2VcbiAgICBUaGF0IEZhbHNlIHdvdWxkIHJlcXVpcmUgbGVzcyB3b3JrIHRoYW4gaWYgYSBsaXN0IG9mIHByZSAtIGNvbXB1dGVkXG4gICAgaXRlbXMgd2FzIHNlbnQ6XG4gICAgPj4+IGZ1enp5X2FuZChbcy5pc19jb21tdXRhdGl2ZSBmb3IgcyBpbiBzeW1zXSlcbiAgICBGYWxzZVxuICAgICovXG5cbiAgICBsZXQgcnYgPSBMb2dpYy5UcnVlO1xuICAgIGZvciAobGV0IGFpIG9mIGFyZ3MpIHtcbiAgICAgICAgYWkgPSBmdXp6eV9ib29sKGFpKTtcbiAgICAgICAgaWYgKGFpIGluc3RhbmNlb2YgRmFsc2UpIHtcbiAgICAgICAgICAgIHJldHVybiBMb2dpYy5GYWxzZTtcbiAgICAgICAgfSBpZiAocnYgaW5zdGFuY2VvZiBUcnVlKSB7IC8vIHRoaXMgd2lsbCBzdG9wIHVwZGF0aW5nIGlmIGEgTm9uZSBpcyBldmVyIHRyYXBwZWRcbiAgICAgICAgICAgIHJ2ID0gYWk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIHJ2O1xufVxuXG5mdW5jdGlvbiBmdXp6eV9hbmRfdjIoYXJnczogYW55W10pIHtcbiAgICBsZXQgcnYgPSB0cnVlO1xuICAgIGZvciAobGV0IGFpIG9mIGFyZ3MpIHtcbiAgICAgICAgYWkgPSBmdXp6eV9ib29sX3YyKGFpKTtcbiAgICAgICAgaWYgKGFpID09PSBmYWxzZSkge1xuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9IGlmIChydiA9PT0gdHJ1ZSkge1xuICAgICAgICAgICAgcnYgPSBhaTtcbiAgICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gcnY7XG59XG5cbmZ1bmN0aW9uIGZ1enp5X25vdCh2OiBhbnkpOiBMb2dpYyB8IG51bGwge1xuICAgIC8qXG4gICAgTm90IGluIGZ1enp5IGxvZ2ljXG4gICAgICAgIFJldHVybiBOb25lIGlmIGB2YCBpcyBOb25lIGVsc2UgYG5vdCB2YC5cbiAgICAgICAgRXhhbXBsZXNcbiAgICAgICAgPT09PT09PT1cbiAgICAgICAgPj4+IGZyb20gc3ltcHkuY29yZS5sb2dpYyBpbXBvcnQgZnV6enlfbm90XG4gICAgICAgID4+PiBmdXp6eV9ub3QoVHJ1ZSlcbiAgICBGYWxzZVxuICAgICAgICA+Pj4gZnV6enlfbm90KE5vbmUpXG4gICAgICAgID4+PiBmdXp6eV9ub3QoRmFsc2UpXG4gICAgVHJ1ZVxuICAgICovXG4gICAgaWYgKHYgPT0gbnVsbCkge1xuICAgICAgICByZXR1cm4gdjtcbiAgICB9IGVsc2UgaWYgKHYgaW5zdGFuY2VvZiBUcnVlKSB7XG4gICAgICAgIHJldHVybiBMb2dpYy5GYWxzZTtcbiAgICB9XG4gICAgcmV0dXJuIExvZ2ljLlRydWU7XG59XG5cblxuZXhwb3J0IGZ1bmN0aW9uIGZ1enp5X25vdHYyKHY6IGFueSkge1xuICAgIC8qXG4gICAgTm90IGluIGZ1enp5IGxvZ2ljXG4gICAgICAgIFJldHVybiBOb25lIGlmIGB2YCBpcyBOb25lIGVsc2UgYG5vdCB2YC5cbiAgICAgICAgRXhhbXBsZXNcbiAgICAgICAgPT09PT09PT1cbiAgICAgICAgPj4+IGZyb20gc3ltcHkuY29yZS5sb2dpYyBpbXBvcnQgZnV6enlfbm90XG4gICAgICAgID4+PiBmdXp6eV9ub3QoVHJ1ZSlcbiAgICBGYWxzZVxuICAgICAgICA+Pj4gZnV6enlfbm90KE5vbmUpXG4gICAgICAgID4+PiBmdXp6eV9ub3QoRmFsc2UpXG4gICAgVHJ1ZVxuICAgICovXG4gICAgaWYgKHYgPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgIHJldHVybiB1bmRlZmluZWQ7XG4gICAgfSBlbHNlIGlmICh2ID09PSB0cnVlKSB7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gICAgcmV0dXJuIHRydWU7XG59XG5cblxuZnVuY3Rpb24gZnV6enlfb3IoYXJnczogYW55W10pOiBMb2dpYyB7XG4gICAgLypcbiAgICBPciBpbiBmdXp6eSBsb2dpYy5SZXR1cm5zIFRydWUoYW55IFRydWUpLCBGYWxzZShhbGwgRmFsc2UpLCBvciBOb25lXG4gICAgICAgIFNlZSB0aGUgZG9jc3RyaW5ncyBvZiBmdXp6eV9hbmQgYW5kIGZ1enp5X25vdCBmb3IgbW9yZSBpbmZvLmZ1enp5X29yIGlzXG4gICAgICAgIHJlbGF0ZWQgdG8gdGhlIHR3byBieSB0aGUgc3RhbmRhcmQgRGUgTW9yZ2FuJ3MgbGF3LlxuICAgICAgICA+Pj4gZnJvbSBzeW1weS5jb3JlLmxvZ2ljIGltcG9ydCBmdXp6eV9vclxuICAgICAgICA+Pj4gZnV6enlfb3IoW1RydWUsIEZhbHNlXSlcbiAgICBUcnVlXG4gICAgICAgID4+PiBmdXp6eV9vcihbVHJ1ZSwgTm9uZV0pXG4gICAgVHJ1ZVxuICAgICAgICA+Pj4gZnV6enlfb3IoW0ZhbHNlLCBGYWxzZV0pXG4gICAgRmFsc2VcbiAgICAgICAgPj4+IHByaW50KGZ1enp5X29yKFtGYWxzZSwgTm9uZV0pKVxuICAgIE5vbmVcbiAgICAqL1xuICAgIGxldCBydiA9IExvZ2ljLkZhbHNlO1xuXG4gICAgZm9yIChsZXQgYWkgb2YgYXJncykge1xuICAgICAgICBhaSA9IGZ1enp5X2Jvb2woYWkpO1xuICAgICAgICBpZiAoYWkgaW5zdGFuY2VvZiBUcnVlKSB7XG4gICAgICAgICAgICByZXR1cm4gTG9naWMuVHJ1ZTtcbiAgICAgICAgfVxuICAgICAgICBpZiAocnYgaW5zdGFuY2VvZiBGYWxzZSkgeyAvLyB0aGlzIHdpbGwgc3RvcCB1cGRhdGluZyBpZiBhIE5vbmUgaXMgZXZlciB0cmFwcGVkXG4gICAgICAgICAgICBydiA9IGFpO1xuICAgICAgICB9XG4gICAgfVxuICAgIHJldHVybiBydjtcbn1cblxuZnVuY3Rpb24gZnV6enlfeG9yKGFyZ3M6IGFueVtdKTogTG9naWMgfCBudWxsIHtcbiAgICAvKiBSZXR1cm4gTm9uZSBpZiBhbnkgZWxlbWVudCBvZiBhcmdzIGlzIG5vdCBUcnVlIG9yIEZhbHNlLCBlbHNlXG4gICAgVHJ1ZShpZiB0aGVyZSBhcmUgYW4gb2RkIG51bWJlciBvZiBUcnVlIGVsZW1lbnRzKSwgZWxzZSBGYWxzZS4gKi9cbiAgICBsZXQgdCA9IDA7XG4gICAgbGV0IGYgPSAwO1xuICAgIGZvciAoY29uc3QgYSBvZiBhcmdzKSB7XG4gICAgICAgIGNvbnN0IGFpID0gZnV6enlfYm9vbChhKTtcbiAgICAgICAgaWYgKGFpIGluc3RhbmNlb2YgVHJ1ZSkge1xuICAgICAgICAgICAgdCArPSAxO1xuICAgICAgICB9IGVsc2UgaWYgKGFpIGluc3RhbmNlb2YgRmFsc2UpIHtcbiAgICAgICAgICAgIGYgKz0gMTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiBudWxsO1xuICAgICAgICB9XG4gICAgfVxuICAgIGlmICh0ICUgMiA9PSAxKSB7XG4gICAgICAgIHJldHVybiBMb2dpYy5UcnVlO1xuICAgIH1cbiAgICByZXR1cm4gTG9naWMuRmFsc2U7XG59XG5cbmZ1bmN0aW9uIGZ1enp5X25hbmQoYXJnczogYW55W10pOiBMb2dpYyB8IG51bGwge1xuICAgIC8qIFJldHVybiBGYWxzZSBpZiBhbGwgYXJncyBhcmUgVHJ1ZSwgVHJ1ZSBpZiB0aGV5IGFyZSBhbGwgRmFsc2UsXG4gICAgZWxzZSBOb25lLiAqL1xuICAgIHJldHVybiBmdXp6eV9ub3QoZnV6enlfYW5kKGFyZ3MpKTtcbn1cblxuXG5jbGFzcyBMb2dpYyB7XG4gICAgc3RhdGljIFRydWU6IExvZ2ljO1xuICAgIHN0YXRpYyBGYWxzZTogTG9naWM7XG5cbiAgICBzdGF0aWMgb3BfMmNsYXNzOiBSZWNvcmQ8c3RyaW5nLCAoLi4uYXJnczogYW55W10pID0+IExvZ2ljPiA9IHtcbiAgICAgICAgXCImXCI6ICguLi5hcmdzKSA9PiB7XG4gICAgICAgICAgICByZXR1cm4gQW5kLk5ldyguLi5hcmdzKTtcbiAgICAgICAgfSxcbiAgICAgICAgXCJ8XCI6ICguLi5hcmdzKSA9PiB7XG4gICAgICAgICAgICByZXR1cm4gT3IuTmV3KC4uLmFyZ3MpO1xuICAgICAgICB9LFxuICAgICAgICBcIiFcIjogKGFyZykgPT4ge1xuICAgICAgICAgICAgcmV0dXJuIE5vdC5OZXcoYXJnKTtcbiAgICAgICAgfSxcbiAgICB9O1xuXG4gICAgYXJnczogYW55W107XG5cbiAgICBjb25zdHJ1Y3RvciguLi5hcmdzOiBhbnlbXSkge1xuICAgICAgICB0aGlzLmFyZ3MgPSBhcmdzLmZsYXQoKTtcbiAgICB9XG5cbiAgICBfZXZhbF9wcm9wYWdhdGVfbm90KCk6IGFueSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcihcIkV2YWwgcHJvcGFnYXRlIG5vdCBpcyBhYnN0cmFjdCBpbiBMb2dpY1wiKTtcbiAgICB9XG5cbiAgICBleHBhbmQoKTogYW55IHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiRXhwYW5kIGlzIGFic3RyYWN0IGluIExvZ2ljXCIpO1xuICAgIH1cblxuICAgIHN0YXRpYyBfX25ld19fKGNsczogYW55LCAuLi5hcmdzOiBhbnlbXSk6IGFueSB7XG4gICAgICAgIGlmIChjbHMgPT09IE5vdCkge1xuICAgICAgICAgICAgcmV0dXJuIG5ldyBOb3QoYXJnc1swXSk7XG4gICAgICAgIH0gZWxzZSBpZiAoY2xzID09PSBBbmQpIHtcbiAgICAgICAgICAgIHJldHVybiBuZXcgQW5kKGFyZ3MpO1xuICAgICAgICB9IGVsc2UgaWYgKGNscyA9PT0gT3IpIHtcbiAgICAgICAgICAgIHJldHVybiBuZXcgT3IoYXJncyk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBnZXRfb3BfeF9ub3R4KCk6IGFueSB7XG4gICAgICAgIHJldHVybiBudWxsO1xuICAgIH1cblxuICAgIGhhc2hLZXkoKTogc3RyaW5nIHtcbiAgICAgICAgcmV0dXJuIHRoaXMudG9TdHJpbmcoKTtcbiAgICB9XG5cbiAgICB0b1N0cmluZygpIHtcbiAgICAgICAgcmV0dXJuIFwiTG9naWMgXCIgKyB0aGlzLmFyZ3MudG9TdHJpbmcoKTtcbiAgICB9XG5cbiAgICBnZXROZXdBcmdzKCk6IGFueVtdIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuYXJncztcbiAgICB9XG5cbiAgICBzdGF0aWMgZXF1YWxzKGE6IGFueSwgYjogYW55KTogTG9naWMge1xuICAgICAgICBpZiAoIShiIGluc3RhbmNlb2YgYS5jb25zdHJ1Y3RvcikpIHtcbiAgICAgICAgICAgIHJldHVybiBMb2dpYy5GYWxzZTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGlmIChhLmFyZ3MgPT0gYi5hcmdzKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIExvZ2ljLlRydWU7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gTG9naWMuRmFsc2U7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBzdGF0aWMgbm90RXF1YWxzKGE6IGFueSwgYjogYW55KTogTG9naWMge1xuICAgICAgICBpZiAoIShiIGluc3RhbmNlb2YgYS5jb25zdHJ1Y3RvcikpIHtcbiAgICAgICAgICAgIHJldHVybiBMb2dpYy5UcnVlO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgaWYgKGEuYXJncyA9PSBiLmFyZ3MpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gTG9naWMuRmFsc2U7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gTG9naWMuVHJ1ZTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGxlc3NUaGFuKG90aGVyOiBPYmplY3QpOiBMb2dpYyB7XG4gICAgICAgIGlmICh0aGlzLmNvbXBhcmUob3RoZXIpID09IC0xKSB7XG4gICAgICAgICAgICByZXR1cm4gTG9naWMuVHJ1ZTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gTG9naWMuRmFsc2U7XG4gICAgfVxuXG4gICAgY29tcGFyZShvdGhlcjogYW55KTogbnVtYmVyIHtcbiAgICAgICAgbGV0IGE7IGxldCBiO1xuICAgICAgICBpZiAodHlwZW9mIHRoaXMgIT0gdHlwZW9mIG90aGVyKSB7XG4gICAgICAgICAgICBjb25zdCB1bmtTZWxmOiB1bmtub3duID0gPHVua25vd24+IHRoaXMuY29uc3RydWN0b3I7XG4gICAgICAgICAgICBjb25zdCB1bmtPdGhlcjogdW5rbm93biA9IDx1bmtub3duPiBvdGhlci5jb25zdHJ1Y3RvcjtcbiAgICAgICAgICAgIGEgPSA8c3RyaW5nPiB1bmtTZWxmO1xuICAgICAgICAgICAgYiA9IDxzdHJpbmc+IHVua090aGVyO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgYSA9IHRoaXMuYXJncztcbiAgICAgICAgICAgIGIgPSBvdGhlci5hcmdzO1xuICAgICAgICB9XG4gICAgICAgIGlmIChhID4gYikge1xuICAgICAgICAgICAgcmV0dXJuIDE7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gMDtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHN0YXRpYyBmcm9tc3RyaW5nKHRleHQ6IHN0cmluZykge1xuICAgICAgICAvKiBMb2dpYyBmcm9tIHN0cmluZyB3aXRoIHNwYWNlIGFyb3VuZCAmIGFuZCB8IGJ1dCBub25lIGFmdGVyICEuXG4gICAgICAgICAgIGUuZy5cbiAgICAgICAgICAgIWEgJiBiIHwgY1xuICAgICAgICAqL1xuICAgICAgICBsZXQgbGV4cHIgPSBudWxsOyAvLyBjdXJyZW50IGxvZ2ljYWwgZXhwcmVzc2lvblxuICAgICAgICBsZXQgc2NoZWRvcCA9IG51bGw7IC8vIHNjaGVkdWxlZCBvcGVyYXRpb25cbiAgICAgICAgZm9yIChjb25zdCB0ZXJtIG9mIHRleHQuc3BsaXQoXCIgXCIpKSB7XG4gICAgICAgICAgICBsZXQgZmxleFRlcm06IHN0cmluZyB8IExvZ2ljID0gdGVybTtcbiAgICAgICAgICAgIC8vIG9wZXJhdGlvbiBzeW1ib2xcbiAgICAgICAgICAgIGlmIChcIiZ8XCIuaW5jbHVkZXMoZmxleFRlcm0pKSB7XG4gICAgICAgICAgICAgICAgaWYgKHNjaGVkb3AgIT0gbnVsbCkge1xuICAgICAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJkb3VibGUgb3AgZm9yYmlkZGVuIFwiICsgZmxleFRlcm0gKyBcIiBcIiArIHNjaGVkb3ApO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBpZiAobGV4cHIgPT0gbnVsbCkge1xuICAgICAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoZmxleFRlcm0gKyBcIiBjYW5ub3QgYmUgaW4gdGhlIGJlZ2lubmluZyBvZiBleHByZXNzaW9uXCIpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBzY2hlZG9wID0gZmxleFRlcm07XG4gICAgICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoZmxleFRlcm0uaW5jbHVkZXMoXCJ8XCIpIHx8IGZsZXhUZXJtLmluY2x1ZGVzKFwiJlwiKSkge1xuICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcIiYgYW5kIHwgbXVzdCBoYXZlIHNwYWNlIGFyb3VuZCB0aGVtXCIpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKGZsZXhUZXJtWzBdID09IFwiIVwiKSB7XG4gICAgICAgICAgICAgICAgaWYgKGZsZXhUZXJtLmxlbmd0aCA9PSAxKSB7XG4gICAgICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcImRvIG5vdCBpbmNsdWRlIHNwYWNlIGFmdGVyICFcIik7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGZsZXhUZXJtID0gTm90Lk5ldyhmbGV4VGVybS5zdWJzdHJpbmcoMSkpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgLy8gYWxyZWFkeSBzY2hlZHVsZWQgb3BlcmF0aW9uLCBlLmcuICcmJ1xuICAgICAgICAgICAgaWYgKHNjaGVkb3ApIHtcbiAgICAgICAgICAgICAgICBjb25zdCBvcCA9IExvZ2ljLm9wXzJjbGFzc1tzY2hlZG9wXTtcbiAgICAgICAgICAgICAgICBsZXhwciA9IG9wKGxleHByLCBmbGV4VGVybSk7XG4gICAgICAgICAgICAgICAgc2NoZWRvcCA9IG51bGw7XG4gICAgICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICAvLyB0aGlzIHNob3VsZCBiZSBhdG9tXG4gICAgICAgICAgICBpZiAobGV4cHIgIT0gbnVsbCkge1xuICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcIm1pc3Npbmcgb3AgYmV0d2VlbiBcIiArIGxleHByICsgXCIgYW5kIFwiICsgZmxleFRlcm0gKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGxleHByID0gZmxleFRlcm07XG4gICAgICAgIH1cblxuICAgICAgICAvLyBsZXQncyBjaGVjayB0aGF0IHdlIGVuZGVkIHVwIGluIGNvcnJlY3Qgc3RhdGVcbiAgICAgICAgaWYgKHNjaGVkb3AgIT0gbnVsbCkge1xuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwicHJlbWF0dXJlIGVuZC1vZi1leHByZXNzaW9uIGluIFwiICsgdGV4dCk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGxleHByID09IG51bGwpIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcih0ZXh0ICsgXCIgaXMgZW1wdHlcIik7XG4gICAgICAgIH1cbiAgICAgICAgLy8gZXZlcnl0aGluZyBsb29rcyBnb29kIG5vd1xuICAgICAgICByZXR1cm4gbGV4cHI7XG4gICAgfVxufVxuXG5jbGFzcyBUcnVlIGV4dGVuZHMgTG9naWMge1xuICAgIF9ldmFsX3Byb3BhZ2F0ZV9ub3QoKTogYW55IHtcbiAgICAgICAgcmV0dXJuIEZhbHNlLkZhbHNlO1xuICAgIH1cblxuICAgIGV4cGFuZCgpOiBhbnkge1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9XG59XG5cbmNsYXNzIEZhbHNlIGV4dGVuZHMgTG9naWMge1xuICAgIF9ldmFsX3Byb3BhZ2F0ZV9ub3QoKTogYW55IHtcbiAgICAgICAgcmV0dXJuIFRydWUuVHJ1ZTtcbiAgICB9XG5cbiAgICBleHBhbmQoKTogYW55IHtcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxufVxuXG5cbmNsYXNzIEFuZE9yX0Jhc2UgZXh0ZW5kcyBMb2dpYyB7XG4gICAgc3RhdGljIF9fbmV3X18oY2xzOiBhbnksIG9wX3hfbm90eDogYW55LCAuLi5hcmdzOiBhbnlbXSkge1xuICAgICAgICBjb25zdCBiYXJnczogYW55W10gPSBbXTtcbiAgICAgICAgZm9yIChjb25zdCBhIG9mIGFyZ3MpIHtcbiAgICAgICAgICAgIGlmIChhID09IG9wX3hfbm90eCkge1xuICAgICAgICAgICAgICAgIHJldHVybiBhO1xuICAgICAgICAgICAgfSBlbHNlIGlmIChhID09IG9wX3hfbm90eC5vcHBvc2l0ZSkge1xuICAgICAgICAgICAgICAgIGNvbnRpbnVlOyAvLyBza2lwIHRoaXMgYXJndW1lbnRcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGJhcmdzLnB1c2goYSk7XG4gICAgICAgIH1cblxuICAgICAgICAvLyBwcmV2IHZlcnNpb246IGFyZ3MgPSBzb3J0ZWQoc2V0KHRoaXMuZmxhdHRlbihiYXJncykpLCBrZXk9aGFzaClcbiAgICAgICAgLy8gd2UgdGhpbmsgd2UgZG9uJ3QgbmVlZCB0aGUgc29ydCBhbmQgc2V0XG4gICAgICAgIGFyZ3MgPSBuZXcgSGFzaFNldChBbmRPcl9CYXNlLmZsYXR0ZW4oYmFyZ3MpKS50b0FycmF5KCkuc29ydChcbiAgICAgICAgICAgIChhLCBiKSA9PiBVdGlsLmhhc2hLZXkoYSkubG9jYWxlQ29tcGFyZShVdGlsLmhhc2hLZXkoYikpXG4gICAgICAgICk7XG5cbiAgICAgICAgLy8gY3JlYXRpbmcgYSBzZXQgd2l0aCBoYXNoIGtleXMgZm9yIGFyZ3NcbiAgICAgICAgY29uc3QgYXJnc19zZXQgPSBuZXcgSGFzaFNldChhcmdzKTtcblxuICAgICAgICBmb3IgKGNvbnN0IGEgb2YgYXJncykge1xuICAgICAgICAgICAgaWYgKGFyZ3Nfc2V0LmhhcyhOb3QuTmV3KGEpKSkge1xuICAgICAgICAgICAgICAgIHJldHVybiBvcF94X25vdHg7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoYXJncy5sZW5ndGggPT0gMSkge1xuICAgICAgICAgICAgcmV0dXJuIGFyZ3MucG9wKCk7XG4gICAgICAgIH0gZWxzZSBpZiAoYXJncy5sZW5ndGggPT0gMCkge1xuICAgICAgICAgICAgaWYgKG9wX3hfbm90eCBpbnN0YW5jZW9mIFRydWUpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gTG9naWMuRmFsc2U7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gTG9naWMuVHJ1ZTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBzdXBlci5fX25ld19fKGNscywgLi4uYXJncyk7XG4gICAgfVxuXG4gICAgc3RhdGljIGZsYXR0ZW4oYXJnczogYW55W10pOiBhbnlbXSB7XG4gICAgICAgIC8vIHF1aWNrLW4tZGlydHkgZmxhdHRlbmluZyBmb3IgQW5kIGFuZCBPclxuICAgICAgICBjb25zdCBhcmdzX3F1ZXVlOiBhbnlbXSA9IGFyZ3M7XG4gICAgICAgIGNvbnN0IHJlcyA9IFtdO1xuICAgICAgICB3aGlsZSAoYXJnc19xdWV1ZS5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICBjb25zdCBhcmc6IGFueSA9IGFyZ3NfcXVldWUucG9wKCk7XG4gICAgICAgICAgICBpZiAoYXJnIGluc3RhbmNlb2YgTG9naWMpIHtcbiAgICAgICAgICAgICAgICBpZiAoYXJnIGluc3RhbmNlb2YgdGhpcykge1xuICAgICAgICAgICAgICAgICAgICBhcmdzX3F1ZXVlLnB1c2goLi4uYXJnLmFyZ3MpO1xuICAgICAgICAgICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXMucHVzaChhcmcpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiByZXM7XG4gICAgfVxufVxuXG5jbGFzcyBBbmQgZXh0ZW5kcyBBbmRPcl9CYXNlIHtcbiAgICBzdGF0aWMgTmV3KC4uLmFyZ3M6IGFueVtdKSB7XG4gICAgICAgIHJldHVybiBzdXBlci5fX25ld19fKEFuZCwgTG9naWMuRmFsc2UsIC4uLmFyZ3MpO1xuICAgIH1cblxuXG4gICAgX2V2YWxfcHJvcGFnYXRlX25vdCgpOiBPciB7XG4gICAgICAgIC8vICEgKGEmYiZjIC4uLikgPT0gIWEgfCAhYiB8ICFjIC4uLlxuICAgICAgICBjb25zdCBwYXJhbTogYW55W10gPSBbXTtcbiAgICAgICAgZm9yIChjb25zdCBhIG9mIHBhcmFtKSB7XG4gICAgICAgICAgICBwYXJhbS5wdXNoKE5vdC5OZXcoYSkpOyAvLyA/P1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBPci5OZXcoLi4ucGFyYW0pOyAvLyA/Pz9cbiAgICB9XG5cbiAgICAvLyAoYXxifC4uLikgJiBjID09IChhJmMpIHwgKGImYykgfCAuLi5cbiAgICBleHBhbmQoKTogYW55IHtcbiAgICAgICAgLy8gZmlyc3QgbG9jYXRlIE9yXG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5hcmdzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBjb25zdCBhcmcgPSB0aGlzLmFyZ3NbaV07XG4gICAgICAgICAgICBpZiAoYXJnIGluc3RhbmNlb2YgT3IpIHtcbiAgICAgICAgICAgICAgICAvLyBjb3B5IG9mIHRoaXMuYXJncyB3aXRoIGFyZyBhdCBwb3NpdGlvbiBpIHJlbW92ZWRcblxuICAgICAgICAgICAgICAgIGNvbnN0IGFyZXN0ID0gWy4uLnRoaXMuYXJnc10uc3BsaWNlKGksIDEpO1xuXG4gICAgICAgICAgICAgICAgLy8gc3RlcCBieSBzdGVwIHZlcnNpb24gb2YgdGhlIG1hcCBiZWxvd1xuICAgICAgICAgICAgICAgIC8qXG4gICAgICAgICAgICAgICAgbGV0IG9ydGVybXMgPSBbXTtcbiAgICAgICAgICAgICAgICBmb3IgKGxldCBhIG9mIGFyZy5hcmdzKSB7XG4gICAgICAgICAgICAgICAgICAgIG9ydGVybXMucHVzaChuZXcgQW5kKC4uLmFyZXN0LmNvbmNhdChbYV0pKSlcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgKi9cblxuICAgICAgICAgICAgICAgIGNvbnN0IG9ydGVybXMgPSBhcmcuYXJncy5tYXAoKGUpID0+IEFuZC5OZXcoLi4uYXJlc3QuY29uY2F0KFtlXSkpKTtcblxuXG4gICAgICAgICAgICAgICAgZm9yIChsZXQgaiA9IDA7IGogPCBvcnRlcm1zLmxlbmd0aDsgaisrKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChvcnRlcm1zW2pdIGluc3RhbmNlb2YgTG9naWMpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIG9ydGVybXNbal0gPSBvcnRlcm1zW2pdLmV4cGFuZCgpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGNvbnN0IHJlcyA9IE9yLk5ldyguLi5vcnRlcm1zKTtcbiAgICAgICAgICAgICAgICByZXR1cm4gcmVzO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cbn1cblxuY2xhc3MgT3IgZXh0ZW5kcyBBbmRPcl9CYXNlIHtcbiAgICBzdGF0aWMgTmV3KC4uLmFyZ3M6IGFueVtdKSB7XG4gICAgICAgIHJldHVybiBzdXBlci5fX25ld19fKE9yLCBMb2dpYy5UcnVlLCAuLi5hcmdzKTtcbiAgICB9XG5cbiAgICBfZXZhbF9wcm9wYWdhdGVfbm90KCk6IEFuZCB7XG4gICAgICAgIC8vICEgKGEmYiZjIC4uLikgPT0gIWEgfCAhYiB8ICFjIC4uLlxuICAgICAgICBjb25zdCBwYXJhbTogYW55W10gPSBbXTtcbiAgICAgICAgZm9yIChjb25zdCBhIG9mIHBhcmFtKSB7XG4gICAgICAgICAgICBwYXJhbS5wdXNoKE5vdC5OZXcoYSkpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBBbmQuTmV3KC4uLnBhcmFtKTtcbiAgICB9XG59XG5cbmNsYXNzIE5vdCBleHRlbmRzIExvZ2ljIHtcbiAgICBzdGF0aWMgTmV3KGFyZ3M6IGFueSkge1xuICAgICAgICByZXR1cm4gTm90Ll9fbmV3X18oTm90LCBhcmdzKTtcbiAgICB9XG5cbiAgICBzdGF0aWMgX19uZXdfXyhjbHM6IGFueSwgYXJnOiBhbnkpIHtcbiAgICAgICAgaWYgKHR5cGVvZiBhcmcgPT09IFwic3RyaW5nXCIpIHtcbiAgICAgICAgICAgIHJldHVybiBzdXBlci5fX25ld19fKGNscywgYXJnKTtcbiAgICAgICAgfSBlbHNlIGlmIChhcmcgaW5zdGFuY2VvZiBUcnVlKSB7XG4gICAgICAgICAgICByZXR1cm4gTG9naWMuRmFsc2U7XG4gICAgICAgIH0gZWxzZSBpZiAoYXJnIGluc3RhbmNlb2YgRmFsc2UpIHtcbiAgICAgICAgICAgIHJldHVybiBMb2dpYy5UcnVlO1xuICAgICAgICB9IGVsc2UgaWYgKGFyZyBpbnN0YW5jZW9mIE5vdCkge1xuICAgICAgICAgICAgcmV0dXJuIGFyZy5hcmdzWzBdO1xuICAgICAgICB9IGVsc2UgaWYgKGFyZyBpbnN0YW5jZW9mIExvZ2ljKSB7XG4gICAgICAgICAgICAvLyBYWFggdGhpcyBpcyBhIGhhY2sgdG8gZXhwYW5kIHJpZ2h0IGZyb20gdGhlIGJlZ2lubmluZ1xuICAgICAgICAgICAgYXJnID0gYXJnLl9ldmFsX3Byb3BhZ2F0ZV9ub3QoKTtcbiAgICAgICAgICAgIHJldHVybiBhcmc7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJOb3Q6IHVua25vd24gYXJndW1lbnQgXCIgKyBhcmcpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgYXJnKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5hcmdzWzBdO1xuICAgIH1cbn1cblxuTG9naWMuVHJ1ZSA9IG5ldyBUcnVlKCk7XG5Mb2dpYy5GYWxzZSA9IG5ldyBGYWxzZSgpO1xuXG5leHBvcnQge0xvZ2ljLCBUcnVlLCBGYWxzZSwgQW5kLCBPciwgTm90LCBmdXp6eV9ib29sLCBmdXp6eV9hbmQsIGZ1enp5X2Jvb2xfdjIsIGZ1enp5X2FuZF92Mn07XG5cblxuIiwgIi8qIGVzbGludC1kaXNhYmxlIG5ldy1jYXAgKi9cbi8qIFRoaXMgaXMgcnVsZS1iYXNlZCBkZWR1Y3Rpb24gc3lzdGVtIGZvciBTeW1QeVxuVGhlIHdob2xlIHRoaW5nIGlzIHNwbGl0IGludG8gdHdvIHBhcnRzXG4gLSBydWxlcyBjb21waWxhdGlvbiBhbmQgcHJlcGFyYXRpb24gb2YgdGFibGVzXG4gLSBydW50aW1lIGluZmVyZW5jZVxuRm9yIHJ1bGUtYmFzZWQgaW5mZXJlbmNlIGVuZ2luZXMsIHRoZSBjbGFzc2ljYWwgd29yayBpcyBSRVRFIGFsZ29yaXRobSBbMV0sXG5bMl0gQWx0aG91Z2ggd2UgYXJlIG5vdCBpbXBsZW1lbnRpbmcgaXQgaW4gZnVsbCAob3IgZXZlbiBzaWduaWZpY2FudGx5KVxuaXQncyBzdGlsbCB3b3J0aCBhIHJlYWQgdG8gdW5kZXJzdGFuZCB0aGUgdW5kZXJseWluZyBpZGVhcy5cbkluIHNob3J0LCBldmVyeSBydWxlIGluIGEgc3lzdGVtIG9mIHJ1bGVzIGlzIG9uZSBvZiB0d28gZm9ybXM6XG4gLSBhdG9tICAgICAgICAgICAgICAgICAgICAgLT4gLi4uICAgICAgKGFscGhhIHJ1bGUpXG4gLSBBbmQoYXRvbTEsIGF0b20yLCAuLi4pICAgLT4gLi4uICAgICAgKGJldGEgcnVsZSlcblRoZSBtYWpvciBjb21wbGV4aXR5IGlzIGluIGVmZmljaWVudCBiZXRhLXJ1bGVzIHByb2Nlc3NpbmcgYW5kIHVzdWFsbHkgZm9yIGFuXG5leHBlcnQgc3lzdGVtIGEgbG90IG9mIGVmZm9ydCBnb2VzIGludG8gY29kZSB0aGF0IG9wZXJhdGVzIG9uIGJldGEtcnVsZXMuXG5IZXJlIHdlIHRha2UgbWluaW1hbGlzdGljIGFwcHJvYWNoIHRvIGdldCBzb21ldGhpbmcgdXNhYmxlIGZpcnN0LlxuIC0gKHByZXBhcmF0aW9uKSAgICBvZiBhbHBoYS0gYW5kIGJldGEtIG5ldHdvcmtzLCBldmVyeXRoaW5nIGV4Y2VwdFxuIC0gKHJ1bnRpbWUpICAgICAgICBGYWN0UnVsZXMuZGVkdWNlX2FsbF9mYWN0c1xuICAgICAgICAgICAgIF9fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19cbiAgICAgICAgICAgICggS2lycjogSSd2ZSBuZXZlciB0aG91Z2h0IHRoYXQgZG9pbmcgKVxuICAgICAgICAgICAgKCBsb2dpYyBzdHVmZiBpcyB0aGF0IGRpZmZpY3VsdC4uLiAgICApXG4gICAgICAgICAgICAgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgICAgICAgICAgICAgICAgICBvICAgXl9fXlxuICAgICAgICAgICAgICAgICAgICAgbyAgKG9vKVxcX19fX19fX1xuICAgICAgICAgICAgICAgICAgICAgICAgKF9fKVxcICAgICAgIClcXC9cXFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHx8LS0tLXcgfFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHx8ICAgICB8fFxuU29tZSByZWZlcmVuY2VzIG9uIHRoZSB0b3BpY1xuLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuWzFdIGh0dHBzOi8vZW4ud2lraXBlZGlhLm9yZy93aWtpL1JldGVfYWxnb3JpdGhtXG5bMl0gaHR0cDovL3JlcG9ydHMtYXJjaGl2ZS5hZG0uY3MuY211LmVkdS9hbm9uLzE5OTUvQ01VLUNTLTk1LTExMy5wZGZcbmh0dHBzOi8vZW4ud2lraXBlZGlhLm9yZy93aWtpL1Byb3Bvc2l0aW9uYWxfZm9ybXVsYVxuaHR0cHM6Ly9lbi53aWtpcGVkaWEub3JnL3dpa2kvSW5mZXJlbmNlX3J1bGVcbmh0dHBzOi8vZW4ud2lraXBlZGlhLm9yZy93aWtpL0xpc3Rfb2ZfcnVsZXNfb2ZfaW5mZXJlbmNlXG4qL1xuXG4vKlxuXG5TaWduaWZpY2FudCBjaGFuZ2VzIG1hZGUgKFdCIGFuZCBHTSk6XG4tIENyZWF0ZWQgdGhlIEltcGxpY2F0aW9uIGNsYXNzLCB1c2UgdG8gcmVwcmVzZW50IHRoZSBpbXBsaWNhdGlvbiBwIC0+IHEgd2hpY2hcbiAgaXMgc3RvcmVkIGFzIGEgdHVwbGUgaW4gc3ltcHlcbi0gQ3JlYXRlZCB0aGUgU2V0RGVmYXVsdERpY3QsIEhhc2hEaWN0IGFuZCBIYXNoU2V0IGNsYXNzZXMuIFNldERlZmF1bHREaWN0IGFjdHNcbiAgYXMgYSByZXBsY2FjZW1lbnQgZGVmYXVsdGRpY3Qoc2V0KSwgYW5kIEhhc2hEaWN0IGFuZCBIYXNoU2V0IHJlcGxhY2UgdGhlXG4gIGRpY3QgYW5kIHNldCBjbGFzc2VzLlxuKi9cblxuXG5pbXBvcnQge1N0ZEZhY3RLQn0gZnJvbSBcIi4vYXNzdW1wdGlvbnNcIjtcbmltcG9ydCB7TG9naWMsIFRydWUsIEZhbHNlLCBBbmQsIE9yLCBOb3R9IGZyb20gXCIuL2xvZ2ljXCI7XG5cbmltcG9ydCB7VXRpbCwgSGFzaFNldCwgU2V0RGVmYXVsdERpY3QsIEFyckRlZmF1bHREaWN0LCBIYXNoRGljdCwgSW1wbGljYXRpb259IGZyb20gXCIuL3V0aWxpdHlcIjtcblxuXG5mdW5jdGlvbiBfYmFzZV9mYWN0KGF0b206IGFueSkge1xuICAgIC8qICBSZXR1cm4gdGhlIGxpdGVyYWwgZmFjdCBvZiBhbiBhdG9tLlxuICAgIEVmZmVjdGl2ZWx5LCB0aGlzIG1lcmVseSBzdHJpcHMgdGhlIE5vdCBhcm91bmQgYSBmYWN0LlxuICAgICovXG4gICAgaWYgKGF0b20gaW5zdGFuY2VvZiBOb3QpIHtcbiAgICAgICAgcmV0dXJuIGF0b20uYXJnKCk7XG4gICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuIGF0b207XG4gICAgfVxufVxuXG5cbmZ1bmN0aW9uIF9hc19wYWlyKGF0b206IGFueSkge1xuICAgIC8qICBSZXR1cm4gdGhlIGxpdGVyYWwgZmFjdCBvZiBhbiBhdG9tLlxuICAgIEVmZmVjdGl2ZWx5LCB0aGlzIG1lcmVseSBzdHJpcHMgdGhlIE5vdCBhcm91bmQgYSBmYWN0LlxuICAgICovXG4gICAgaWYgKGF0b20gaW5zdGFuY2VvZiBOb3QpIHtcbiAgICAgICAgcmV0dXJuIG5ldyBJbXBsaWNhdGlvbihhdG9tLmFyZygpLCBMb2dpYy5GYWxzZSk7XG4gICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuIG5ldyBJbXBsaWNhdGlvbihhdG9tLCBMb2dpYy5UcnVlKTtcbiAgICB9XG59XG5cblxuZnVuY3Rpb24gX2FzX3BhaXJ2MihhdG9tOiBhbnkpIHtcbiAgICAvKiAgUmV0dXJuIHRoZSBsaXRlcmFsIGZhY3Qgb2YgYW4gYXRvbS5cbiAgICBFZmZlY3RpdmVseSwgdGhpcyBtZXJlbHkgc3RyaXBzIHRoZSBOb3QgYXJvdW5kIGEgZmFjdC5cbiAgICAqL1xuICAgIGlmIChhdG9tIGluc3RhbmNlb2YgTm90KSB7XG4gICAgICAgIHJldHVybiBuZXcgSW1wbGljYXRpb24oYXRvbS5hcmcoKSwgZmFsc2UpO1xuICAgIH0gZWxzZSB7XG4gICAgICAgIHJldHVybiBuZXcgSW1wbGljYXRpb24oYXRvbSwgdHJ1ZSk7XG4gICAgfVxufVxuXG4vLyBYWFggdGhpcyBwcmVwYXJlcyBmb3J3YXJkLWNoYWluaW5nIHJ1bGVzIGZvciBhbHBoYS1uZXR3b3JrXG5cbmZ1bmN0aW9uIHRyYW5zaXRpdmVfY2xvc3VyZShpbXBsaWNhdGlvbnM6IEltcGxpY2F0aW9uW10pIHtcbiAgICAvKlxuICAgIENvbXB1dGVzIHRoZSB0cmFuc2l0aXZlIGNsb3N1cmUgb2YgYSBsaXN0IG9mIGltcGxpY2F0aW9uc1xuICAgIFVzZXMgV2Fyc2hhbGwncyBhbGdvcml0aG0sIGFzIGRlc2NyaWJlZCBhdFxuICAgIGh0dHA6Ly93d3cuY3MuaG9wZS5lZHUvfmN1c2Fjay9Ob3Rlcy9Ob3Rlcy9EaXNjcmV0ZU1hdGgvV2Fyc2hhbGwucGRmLlxuICAgICovXG4gICAgbGV0IHRlbXAgPSBuZXcgQXJyYXkoKTtcbiAgICBmb3IgKGNvbnN0IGltcGwgb2YgaW1wbGljYXRpb25zKSB7XG4gICAgICAgIHRlbXAucHVzaChpbXBsLnApO1xuICAgICAgICB0ZW1wLnB1c2goaW1wbC5xKTtcbiAgICB9XG4gICAgdGVtcCA9IHRlbXAuZmxhdCgpO1xuICAgIGNvbnN0IGZ1bGxfaW1wbGljYXRpb25zID0gbmV3IEhhc2hTZXQoaW1wbGljYXRpb25zKTtcbiAgICBjb25zdCBsaXRlcmFscyA9IG5ldyBIYXNoU2V0KHRlbXApO1xuICAgIFxuICAgIGZvciAoY29uc3QgayBvZiBsaXRlcmFscy50b0FycmF5KCkpIHtcbiAgICAgICAgZm9yIChjb25zdCBpIG9mIGxpdGVyYWxzLnRvQXJyYXkoKSkge1xuICAgICAgICAgICAgaWYgKGZ1bGxfaW1wbGljYXRpb25zLmhhcyhuZXcgSW1wbGljYXRpb24oaSwgaykpKSB7XG4gICAgICAgICAgICAgICAgZm9yIChjb25zdCBqIG9mIGxpdGVyYWxzLnRvQXJyYXkoKSkge1xuICAgICAgICAgICAgICAgICAgICBpZiAoZnVsbF9pbXBsaWNhdGlvbnMuaGFzKG5ldyBJbXBsaWNhdGlvbihrLCBqKSkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGZ1bGxfaW1wbGljYXRpb25zLmFkZChuZXcgSW1wbGljYXRpb24oaSwgaikpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuICAgIHJldHVybiBmdWxsX2ltcGxpY2F0aW9ucztcbn1cblxuXG5mdW5jdGlvbiBkZWR1Y2VfYWxwaGFfaW1wbGljYXRpb25zKGltcGxpY2F0aW9uczogSW1wbGljYXRpb25bXSkge1xuICAgIC8qIGRlZHVjZSBhbGwgaW1wbGljYXRpb25zXG4gICAgICAgRGVzY3JpcHRpb24gYnkgZXhhbXBsZVxuICAgICAgIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAgICBnaXZlbiBzZXQgb2YgbG9naWMgcnVsZXM6XG4gICAgICAgICBhIC0+IGJcbiAgICAgICAgIGIgLT4gY1xuICAgICAgIHdlIGRlZHVjZSBhbGwgcG9zc2libGUgcnVsZXM6XG4gICAgICAgICBhIC0+IGIsIGNcbiAgICAgICAgIGIgLT4gY1xuICAgICAgIGltcGxpY2F0aW9uczogW10gb2YgKGEsYilcbiAgICAgICByZXR1cm46ICAgICAgIHt9IG9mIGEgLT4gc2V0KFtiLCBjLCAuLi5dKVxuICAgICAgICovXG4gICAgY29uc3QgbmV3X2FycjogYW55W10gPSBbXTtcbiAgICBmb3IgKGNvbnN0IGltcGwgb2YgaW1wbGljYXRpb25zKSB7XG4gICAgICAgIG5ld19hcnIucHVzaChuZXcgSW1wbGljYXRpb24oTm90Lk5ldyhpbXBsLnEpLCBOb3QuTmV3KGltcGwucCkpKTtcbiAgICB9XG4gICAgaW1wbGljYXRpb25zID0gaW1wbGljYXRpb25zLmNvbmNhdChuZXdfYXJyKTtcbiAgICBjb25zdCByZXMgPSBuZXcgU2V0RGVmYXVsdERpY3QoKTtcbiAgICBjb25zdCBmdWxsX2ltcGxpY2F0aW9ucyA9IHRyYW5zaXRpdmVfY2xvc3VyZShpbXBsaWNhdGlvbnMpO1xuICAgIGZvciAoY29uc3QgaW1wbCBvZiBmdWxsX2ltcGxpY2F0aW9ucy50b0FycmF5KCkpIHtcbiAgICAgICAgaWYgKGltcGwucCA9PT0gaW1wbC5xKSB7XG4gICAgICAgICAgICBjb250aW51ZTsgLy8gc2tpcCBhLT5hIGN5Y2xpYyBpbnB1dFxuICAgICAgICB9XG4gICAgICAgIGNvbnN0IGN1cnJTZXQgPSByZXMuZ2V0KGltcGwucCk7XG4gICAgICAgIGN1cnJTZXQuYWRkKGltcGwucSk7XG4gICAgICAgIHJlcy5hZGQoaW1wbC5wLCBjdXJyU2V0KTtcbiAgICB9XG4gICAgLy8gQ2xlYW4gdXAgdGF1dG9sb2dpZXMgYW5kIGNoZWNrIGNvbnNpc3RlbmN5XG4gICAgLy8gaW1wbCBpcyB0aGUgc2V0XG4gICAgZm9yIChjb25zdCBpdGVtIG9mIHJlcy5lbnRyaWVzKCkpIHtcbiAgICAgICAgY29uc3QgYSA9IGl0ZW1bMF07XG4gICAgICAgIGNvbnN0IGltcGw6IEhhc2hTZXQgPSBpdGVtWzFdO1xuICAgICAgICBpbXBsLnJlbW92ZShhKTtcbiAgICAgICAgY29uc3QgbmEgPSBOb3QuTmV3KGEpO1xuICAgICAgICBpZiAoaW1wbC5oYXMobmEpKSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJpbXBsaWNhdGlvbnMgYXJlIGluY29uc2lzdGVudDogXCIgKyBhICsgXCIgLT4gXCIgKyBuYSArIFwiIFwiICsgaW1wbCk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIHJlcztcbn1cblxuZnVuY3Rpb24gYXBwbHlfYmV0YV90b19hbHBoYV9yb3V0ZShhbHBoYV9pbXBsaWNhdGlvbnM6IEhhc2hEaWN0LCBiZXRhX3J1bGVzOiBhbnlbXSkge1xuICAgIC8qIGFwcGx5IGFkZGl0aW9uYWwgYmV0YS1ydWxlcyAoQW5kIGNvbmRpdGlvbnMpIHRvIGFscmVhZHktYnVpbHRcbiAgICBhbHBoYSBpbXBsaWNhdGlvbiB0YWJsZXNcbiAgICAgICBUT0RPOiB3cml0ZSBhYm91dFxuICAgICAgIC0gc3RhdGljIGV4dGVuc2lvbiBvZiBhbHBoYS1jaGFpbnNcbiAgICAgICAtIGF0dGFjaGluZyByZWZzIHRvIGJldGEtbm9kZXMgdG8gYWxwaGEgY2hhaW5zXG4gICAgICAgZS5nLlxuICAgICAgIGFscGhhX2ltcGxpY2F0aW9uczpcbiAgICAgICBhICAtPiAgW2IsICFjLCBkXVxuICAgICAgIGIgIC0+ICBbZF1cbiAgICAgICAuLi5cbiAgICAgICBiZXRhX3J1bGVzOlxuICAgICAgICYoYixkKSAtPiBlXG4gICAgICAgdGhlbiB3ZSdsbCBleHRlbmQgYSdzIHJ1bGUgdG8gdGhlIGZvbGxvd2luZ1xuICAgICAgIGEgIC0+ICBbYiwgIWMsIGQsIGVdXG4gICAgKi9cblxuICAgIC8vIGlzIGJldGFfcnVsZXMgYW4gYXJyYXkgb3IgYSBkaWN0aW9uYXJ5P1xuXG4gICAgY29uc3QgeF9pbXBsOiBIYXNoRGljdCA9IG5ldyBIYXNoRGljdCgpO1xuICAgIGZvciAoY29uc3QgeCBvZiBhbHBoYV9pbXBsaWNhdGlvbnMua2V5cygpKSB7XG4gICAgICAgIGNvbnN0IG5ld3NldCA9IG5ldyBIYXNoU2V0KCk7XG4gICAgICAgIG5ld3NldC5hZGRBcnIoYWxwaGFfaW1wbGljYXRpb25zLmdldCh4KS50b0FycmF5KCkpO1xuICAgICAgICBjb25zdCBpbXAgPSBuZXcgSW1wbGljYXRpb24obmV3c2V0LCBbXSk7XG4gICAgICAgIHhfaW1wbC5hZGQoeCwgaW1wKTtcbiAgICB9XG4gICAgZm9yIChjb25zdCBpdGVtIG9mIGJldGFfcnVsZXMpIHtcbiAgICAgICAgY29uc3QgYmNvbmQgPSBpdGVtLnA7XG4gICAgICAgIGZvciAoY29uc3QgYmsgb2YgYmNvbmQuYXJncykge1xuICAgICAgICAgICAgaWYgKHhfaW1wbC5oYXMoYmspKSB7XG4gICAgICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBjb25zdCBpbXAgPSBuZXcgSW1wbGljYXRpb24obmV3IEhhc2hTZXQoKSwgW10pO1xuICAgICAgICAgICAgeF9pbXBsLmFkZChiaywgaW1wKTtcbiAgICAgICAgfVxuICAgIH1cbiAgICAvLyBzdGF0aWMgZXh0ZW5zaW9ucyB0byBhbHBoYSBydWxlczpcbiAgICAvLyBBOiB4IC0+IGEsYiAgIEI6ICYoYSxiKSAtPiBjICA9PT4gIEE6IHggLT4gYSxiLGNcblxuICAgIGxldCBzZWVuX3N0YXRpY19leHRlbnNpb246IExvZ2ljID0gTG9naWMuVHJ1ZTtcbiAgICB3aGlsZSAoc2Vlbl9zdGF0aWNfZXh0ZW5zaW9uIGluc3RhbmNlb2YgVHJ1ZSkge1xuICAgICAgICBzZWVuX3N0YXRpY19leHRlbnNpb24gPSBMb2dpYy5GYWxzZTtcblxuICAgICAgICBmb3IgKGNvbnN0IGltcGwgb2YgYmV0YV9ydWxlcykge1xuICAgICAgICAgICAgY29uc3QgYmNvbmQgPSBpbXBsLnA7XG4gICAgICAgICAgICBjb25zdCBiaW1wbCA9IGltcGwucTtcbiAgICAgICAgICAgIGlmICghKGJjb25kIGluc3RhbmNlb2YgQW5kKSkge1xuICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcIkNvbmQgaXMgbm90IEFuZFwiKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGNvbnN0IGJhcmdzID0gbmV3IEhhc2hTZXQoYmNvbmQuYXJncyk7XG4gICAgICAgICAgICBmb3IgKGNvbnN0IGl0ZW0gb2YgeF9pbXBsLmVudHJpZXMoKSkge1xuICAgICAgICAgICAgICAgIGNvbnN0IHggPSBpdGVtWzBdO1xuICAgICAgICAgICAgICAgIGNvbnN0IGltcGwgPSBpdGVtWzFdO1xuICAgICAgICAgICAgICAgIGxldCB4aW1wbHMgPSBpbXBsLnA7XG4gICAgICAgICAgICAgICAgY29uc3QgeF9hbGwgPSB4aW1wbHMuY2xvbmUoKVxuICAgICAgICAgICAgICAgIHhfYWxsLmFkZCh4KTtcbiAgICAgICAgICAgICAgICAvLyBBOiAuLi4gLT4gYSAgIEI6ICYoLi4uKSAtPiBhICBpcyBub24taW5mb3JtYXRpdmVcbiAgICAgICAgICAgICAgICBpZiAoIXhfYWxsLmhhcyhiaW1wbCkgJiYgVXRpbC5pc1N1YnNldChiYXJncy50b0FycmF5KCksIHhfYWxsLnRvQXJyYXkoKSkpIHtcbiAgICAgICAgICAgICAgICAgICAgeGltcGxzLmFkZChiaW1wbCk7XG5cbiAgICAgICAgICAgICAgICAgICAgLy8gd2UgaW50cm9kdWNlZCBuZXcgaW1wbGljYXRpb24gLSBub3cgd2UgaGF2ZSB0byByZXN0b3JlXG4gICAgICAgICAgICAgICAgICAgIC8vIGNvbXBsZXRlbmVzcyBvZiB0aGUgd2hvbGUgc2V0LlxuXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGJpbXBsX2ltcGwgPSB4X2ltcGwuZ2V0KGJpbXBsKTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGJpbXBsX2ltcGwgIT0gbnVsbCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgeGltcGxzIHw9IGJpbXBsX2ltcGxbMF07XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgc2Vlbl9zdGF0aWNfZXh0ZW5zaW9uID0gTG9naWMuVHJ1ZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG4gICAgLy8gYXR0YWNoIGJldGEtbm9kZXMgd2hpY2ggY2FuIGJlIHBvc3NpYmx5IHRyaWdnZXJlZCBieSBhbiBhbHBoYS1jaGFpblxuICAgIGZvciAobGV0IGJpZHggPSAwOyBiaWR4IDwgYmV0YV9ydWxlcy5sZW5ndGg7IGJpZHgrKykge1xuICAgICAgICBjb25zdCBpbXBsID0gYmV0YV9ydWxlc1tiaWR4XTtcbiAgICAgICAgY29uc3QgYmNvbmQgPSBpbXBsLnA7XG4gICAgICAgIGNvbnN0IGJpbXBsID0gaW1wbC5xO1xuICAgICAgICBjb25zdCBiYXJncyA9IG5ldyBIYXNoU2V0KGJjb25kLmFyZ3MpO1xuICAgICAgICBmb3IgKGNvbnN0IGl0ZW0gb2YgeF9pbXBsLmVudHJpZXMoKSkge1xuICAgICAgICAgICAgY29uc3QgeCA9IGl0ZW1bMF07XG4gICAgICAgICAgICBjb25zdCB2YWx1ZTogSW1wbGljYXRpb24gPSBpdGVtWzFdO1xuICAgICAgICAgICAgY29uc3QgeGltcGxzID0gdmFsdWUucDtcbiAgICAgICAgICAgIGNvbnN0IGJiID0gdmFsdWUucTtcbiAgICAgICAgICAgIGNvbnN0IHhfYWxsID0geGltcGxzLmNsb25lKClcbiAgICAgICAgICAgIHhfYWxsLmFkZCh4KTtcbiAgICAgICAgICAgIGlmICh4X2FsbC5oYXMoYmltcGwpKSB7XG4gICAgICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoeF9hbGwudG9BcnJheSgpLnNvbWUoKGU6IGFueSkgPT4gKGJhcmdzLmhhcyhOb3QuTmV3KGUpKSB8fCBVdGlsLmhhc2hLZXkoTm90Lk5ldyhlKSkgPT09IFV0aWwuaGFzaEtleShiaW1wbCkpKSkge1xuICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKGJhcmdzLmludGVyc2VjdHMoeF9hbGwpKSB7XG4gICAgICAgICAgICAgICAgYmIucHVzaChiaWR4KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4geF9pbXBsO1xufVxuXG5cbmZ1bmN0aW9uIHJ1bGVzXzJwcmVyZXEocnVsZXM6IFNldERlZmF1bHREaWN0KSB7XG4gICAgLyogYnVpbGQgcHJlcmVxdWlzaXRlcyB0YWJsZSBmcm9tIHJ1bGVzXG4gICAgICAgRGVzY3JpcHRpb24gYnkgZXhhbXBsZVxuICAgICAgIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAgICBnaXZlbiBzZXQgb2YgbG9naWMgcnVsZXM6XG4gICAgICAgICBhIC0+IGIsIGNcbiAgICAgICAgIGIgLT4gY1xuICAgICAgIHdlIGJ1aWxkIHByZXJlcXVpc2l0ZXMgKGZyb20gd2hhdCBwb2ludHMgc29tZXRoaW5nIGNhbiBiZSBkZWR1Y2VkKTpcbiAgICAgICAgIGIgPC0gYVxuICAgICAgICAgYyA8LSBhLCBiXG4gICAgICAgcnVsZXM6ICAge30gb2YgYSAtPiBbYiwgYywgLi4uXVxuICAgICAgIHJldHVybjogIHt9IG9mIGMgPC0gW2EsIGIsIC4uLl1cbiAgICAgICBOb3RlIGhvd2V2ZXIsIHRoYXQgdGhpcyBwcmVyZXF1aXNpdGVzIG1heSBiZSAqbm90KiBlbm91Z2ggdG8gcHJvdmUgYVxuICAgICAgIGZhY3QuIEFuIGV4YW1wbGUgaXMgJ2EgLT4gYicgcnVsZSwgd2hlcmUgcHJlcmVxKGEpIGlzIGIsIGFuZCBwcmVyZXEoYilcbiAgICAgICBpcyBhLiBUaGF0J3MgYmVjYXVzZSBhPVQgLT4gYj1ULCBhbmQgYj1GIC0+IGE9RiwgYnV0IGE9RiAtPiBiPT9cbiAgICAqL1xuXG4gICAgY29uc3QgcHJlcmVxID0gbmV3IFNldERlZmF1bHREaWN0KCk7XG4gICAgZm9yIChjb25zdCBpdGVtIG9mIHJ1bGVzLmVudHJpZXMoKSkge1xuICAgICAgICBsZXQgYSA9IGl0ZW1bMF0ucDtcbiAgICAgICAgY29uc3QgaW1wbCA9IGl0ZW1bMV07XG4gICAgICAgIGlmIChhIGluc3RhbmNlb2YgTm90KSB7XG4gICAgICAgICAgICBhID0gYS5hcmdzWzBdO1xuICAgICAgICB9XG4gICAgICAgIGZvciAoY29uc3QgaXRlbSBvZiBpbXBsLnRvQXJyYXkoKSkge1xuICAgICAgICAgICAgbGV0IGkgPSBpdGVtLnA7XG4gICAgICAgICAgICBpZiAoaSBpbnN0YW5jZW9mIE5vdCkge1xuICAgICAgICAgICAgICAgIGkgPSBpLmFyZ3NbMF07XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBjb25zdCB0b0FkZCA9IHByZXJlcS5nZXQoaSk7XG4gICAgICAgICAgICB0b0FkZC5hZGQoYSk7XG4gICAgICAgICAgICBwcmVyZXEuYWRkKGksIHRvQWRkKTtcbiAgICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gcHJlcmVxO1xufVxuXG5cbi8vIC8vLy8vLy8vLy8vLy8vLy9cbi8vIFJVTEVTIFBST1ZFUiAvL1xuLy8gLy8vLy8vLy8vLy8vLy8vL1xuXG5jbGFzcyBUYXV0b2xvZ3lEZXRlY3RlZCBleHRlbmRzIEVycm9yIHtcbiAgICBhcmdzO1xuXG4gICAgY29uc3RydWN0b3IoLi4uYXJnczogYW55W10pIHtcbiAgICAgICAgc3VwZXIoKTtcbiAgICAgICAgdGhpcy5hcmdzID0gYXJncztcbiAgICB9XG4gICAgLy8gKGludGVybmFsKSBQcm92ZXIgdXNlcyBpdCBmb3IgcmVwb3J0aW5nIGRldGVjdGVkIHRhdXRvbG9neVxufVxuXG5jbGFzcyBQcm92ZXIge1xuICAgIC8qIGFpIC0gcHJvdmVyIG9mIGxvZ2ljIHJ1bGVzXG4gICAgICAgZ2l2ZW4gYSBzZXQgb2YgaW5pdGlhbCBydWxlcywgUHJvdmVyIHRyaWVzIHRvIHByb3ZlIGFsbCBwb3NzaWJsZSBydWxlc1xuICAgICAgIHdoaWNoIGZvbGxvdyBmcm9tIGdpdmVuIHByZW1pc2VzLlxuICAgICAgIEFzIGEgcmVzdWx0IHByb3ZlZF9ydWxlcyBhcmUgYWx3YXlzIGVpdGhlciBpbiBvbmUgb2YgdHdvIGZvcm1zOiBhbHBoYSBvclxuICAgICAgIGJldGE6XG4gICAgICAgQWxwaGEgcnVsZXNcbiAgICAgICAtLS0tLS0tLS0tLVxuICAgICAgIFRoaXMgYXJlIHJ1bGVzIG9mIHRoZSBmb3JtOjpcbiAgICAgICAgIGEgLT4gYiAmIGMgJiBkICYgLi4uXG4gICAgICAgQmV0YSBydWxlc1xuICAgICAgIC0tLS0tLS0tLS1cbiAgICAgICBUaGlzIGFyZSBydWxlcyBvZiB0aGUgZm9ybTo6XG4gICAgICAgICAmKGEsYiwuLi4pIC0+IGMgJiBkICYgLi4uXG4gICAgICAgaS5lLiBiZXRhIHJ1bGVzIGFyZSBqb2luIGNvbmRpdGlvbnMgdGhhdCBzYXkgdGhhdCBzb21ldGhpbmcgZm9sbG93cyB3aGVuXG4gICAgICAgKnNldmVyYWwqIGZhY3RzIGFyZSB0cnVlIGF0IHRoZSBzYW1lIHRpbWUuXG4gICAgKi9cblxuICAgIHByb3ZlZF9ydWxlczogYW55W107XG4gICAgX3J1bGVzX3NlZW47XG5cbiAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICAgICAgdGhpcy5wcm92ZWRfcnVsZXMgPSBbXTtcbiAgICAgICAgdGhpcy5fcnVsZXNfc2VlbiA9IG5ldyBIYXNoU2V0KCk7XG4gICAgfVxuXG4gICAgc3BsaXRfYWxwaGFfYmV0YSgpIHtcbiAgICAgICAgLy8gc3BsaXQgcHJvdmVkIHJ1bGVzIGludG8gYWxwaGEgYW5kIGJldGEgY2hhaW5zXG4gICAgICAgIGNvbnN0IHJ1bGVzX2FscGhhID0gW107IC8vIGEgICAgICAtPiBiXG4gICAgICAgIGNvbnN0IHJ1bGVzX2JldGEgPSBbXTsgLy8gJiguLi4pIC0+IGJcbiAgICAgICAgZm9yIChjb25zdCBpbXBsIG9mIHRoaXMucHJvdmVkX3J1bGVzKSB7XG4gICAgICAgICAgICBjb25zdCBhID0gaW1wbC5wO1xuICAgICAgICAgICAgY29uc3QgYiA9IGltcGwucTtcbiAgICAgICAgICAgIGlmIChhIGluc3RhbmNlb2YgQW5kKSB7XG4gICAgICAgICAgICAgICAgcnVsZXNfYmV0YS5wdXNoKG5ldyBJbXBsaWNhdGlvbihhLCBiKSk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHJ1bGVzX2FscGhhLnB1c2gobmV3IEltcGxpY2F0aW9uKGEsIGIpKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gW3J1bGVzX2FscGhhLCBydWxlc19iZXRhXTtcbiAgICB9XG5cbiAgICBydWxlc19hbHBoYSgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuc3BsaXRfYWxwaGFfYmV0YSgpWzBdO1xuICAgIH1cblxuICAgIHJ1bGVzX2JldGEoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLnNwbGl0X2FscGhhX2JldGEoKVsxXTtcbiAgICB9XG5cbiAgICBwcm9jZXNzX3J1bGUoYTogYW55LCBiOiBhbnkpIHtcbiAgICAgICAgLy8gcHJvY2VzcyBhIC0+IGIgcnVsZSAgLT4gIFRPRE8gd3JpdGUgbW9yZT9cbiAgICAgICAgaWYgKCFhIHx8IChiIGluc3RhbmNlb2YgVHJ1ZSB8fCBiIGluc3RhbmNlb2YgRmFsc2UpKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGEgaW5zdGFuY2VvZiBUcnVlIHx8IGEgaW5zdGFuY2VvZiBGYWxzZSkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIGlmICh0aGlzLl9ydWxlc19zZWVuLmhhcyhuZXcgSW1wbGljYXRpb24oYSwgYikpKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aGlzLl9ydWxlc19zZWVuLmFkZChuZXcgSW1wbGljYXRpb24oYSwgYikpO1xuICAgICAgICB9XG4gICAgICAgIC8vIHRoaXMgaXMgdGhlIGNvcmUgb2YgdGhlIHByb2Nlc3NpbmdcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIHRoaXMuX3Byb2Nlc3NfcnVsZShhLCBiKTtcbiAgICAgICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgICAgICAgIGlmICghKGVycm9yIGluc3RhbmNlb2YgVGF1dG9sb2d5RGV0ZWN0ZWQpKSB7XG4gICAgICAgICAgICAgICAgdGhyb3cgRXJyb3I7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBfcHJvY2Vzc19ydWxlKGE6IGFueSwgYjogYW55KSB7XG4gICAgICAgIC8vIHJpZ2h0IHBhcnQgZmlyc3RcblxuICAgICAgICAvLyBhIC0+IGIgJiBjICAgLS0+ICAgIGEtPiBiICA7ICBhIC0+IGNcblxuICAgICAgICAvLyAgKD8pIEZJWE1FIHRoaXMgaXMgb25seSBjb3JyZWN0IHdoZW4gYiAmIGMgIT0gbnVsbCAhXG5cbiAgICAgICAgaWYgKGIgaW5zdGFuY2VvZiBBbmQpIHtcbiAgICAgICAgICAgIGZvciAoY29uc3QgYmFyZyBvZiBiLmFyZ3MpIHtcbiAgICAgICAgICAgICAgICB0aGlzLnByb2Nlc3NfcnVsZShhLCBiYXJnKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIGlmIChiIGluc3RhbmNlb2YgT3IpIHtcbiAgICAgICAgICAgIC8vIGRldGVjdCB0YXV0b2xvZ3kgZmlyc3RcbiAgICAgICAgICAgIGlmICghKGEgaW5zdGFuY2VvZiBMb2dpYykpIHsgLy8gYXRvbVxuICAgICAgICAgICAgICAgIC8vIHRhdXRvbG9neTogIGEgLT4gYXxjfC4uLlxuICAgICAgICAgICAgICAgIGlmIChiLmFyZ3MuaW5jbHVkZXMoYSkpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhyb3cgbmV3IFRhdXRvbG9neURldGVjdGVkKGEsIGIsIFwiYSAtPiBhfGN8Li4uXCIpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGNvbnN0IG5vdF9iYXJnczogYW55W10gPSBbXTtcbiAgICAgICAgICAgIGZvciAoY29uc3QgYmFyZyBvZiBiLmFyZ3MpIHtcbiAgICAgICAgICAgICAgICBub3RfYmFyZ3MucHVzaChOb3QuTmV3KGJhcmcpKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHRoaXMucHJvY2Vzc19ydWxlKEFuZC5OZXcoLi4ubm90X2JhcmdzKSwgTm90Lk5ldyhhKSk7XG5cbiAgICAgICAgICAgIGZvciAobGV0IGJpZHggPSAwOyBiaWR4IDwgYi5hcmdzLmxlbmd0aDsgYmlkeCsrKSB7XG4gICAgICAgICAgICAgICAgY29uc3QgYmFyZyA9IGIuYXJnc1tiaWR4XTtcbiAgICAgICAgICAgICAgICBjb25zdCBicmVzdCA9IFsuLi5iLmFyZ3NdO1xuICAgICAgICAgICAgICAgIGJyZXN0LnNwbGljZShiaWR4LCAxKTtcbiAgICAgICAgICAgICAgICB0aGlzLnByb2Nlc3NfcnVsZShBbmQuTmV3KGEsIE5vdC5OZXcoYmFyZykpLCBPci5OZXcoLi4uYnJlc3QpKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIGlmIChhIGluc3RhbmNlb2YgQW5kKSB7XG4gICAgICAgICAgICBpZiAoYS5hcmdzLmluY2x1ZGVzKGIpKSB7XG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IFRhdXRvbG9neURldGVjdGVkKGEsIGIsIFwiYSAmIGIgLT4gYVwiKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHRoaXMucHJvdmVkX3J1bGVzLnB1c2gobmV3IEltcGxpY2F0aW9uKGEsIGIpKTtcbiAgICAgICAgICAgIC8vIFhYWCBOT1RFIGF0IHByZXNlbnQgd2UgaWdub3JlICAhYyAtPiAhYSB8ICFiXG4gICAgICAgIH0gZWxzZSBpZiAoYSBpbnN0YW5jZW9mIE9yKSB7XG4gICAgICAgICAgICBpZiAoYS5hcmdzLmluY2x1ZGVzKGIpKSB7XG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IFRhdXRvbG9neURldGVjdGVkKGEsIGIsIFwiYSAmIGIgLT4gYVwiKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGZvciAoY29uc3QgYWFyZyBvZiBhLmFyZ3MpIHtcbiAgICAgICAgICAgICAgICB0aGlzLnByb2Nlc3NfcnVsZShhYXJnLCBiKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIC8vIGJvdGggJ2EnIGFuZCAnYicgYXJlIGF0b21zXG4gICAgICAgICAgICB0aGlzLnByb3ZlZF9ydWxlcy5wdXNoKG5ldyBJbXBsaWNhdGlvbihhLCBiKSk7IC8vIGEgLT4gYlxuICAgICAgICAgICAgdGhpcy5wcm92ZWRfcnVsZXMucHVzaChuZXcgSW1wbGljYXRpb24oTm90Lk5ldyhiKSwgTm90Lk5ldyhhKSkpO1xuICAgICAgICB9XG4gICAgfVxufVxuXG4vLyAvLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xuXG5leHBvcnQgY2xhc3MgRmFjdFJ1bGVzIHtcbiAgICAvKiBSdWxlcyB0aGF0IGRlc2NyaWJlIGhvdyB0byBkZWR1Y2UgZmFjdHMgaW4gbG9naWMgc3BhY2VcbiAgICBXaGVuIGRlZmluZWQsIHRoZXNlIHJ1bGVzIGFsbG93IGltcGxpY2F0aW9ucyB0byBxdWlja2x5IGJlIGRldGVybWluZWRcbiAgICBmb3IgYSBzZXQgb2YgZmFjdHMuIEZvciB0aGlzIHByZWNvbXB1dGVkIGRlZHVjdGlvbiB0YWJsZXMgYXJlIHVzZWQuXG4gICAgc2VlIGBkZWR1Y2VfYWxsX2ZhY3RzYCAgIChmb3J3YXJkLWNoYWluaW5nKVxuICAgIEFsc28gaXQgaXMgcG9zc2libGUgdG8gZ2F0aGVyIHByZXJlcXVpc2l0ZXMgZm9yIGEgZmFjdCwgd2hpY2ggaXMgdHJpZWRcbiAgICB0byBiZSBwcm92ZW4uICAgIChiYWNrd2FyZC1jaGFpbmluZylcbiAgICBEZWZpbml0aW9uIFN5bnRheFxuICAgIC0tLS0tLS0tLS0tLS0tLS0tXG4gICAgYSAtPiBiICAgICAgIC0tIGE9VCAtPiBiPVQgIChhbmQgYXV0b21hdGljYWxseSBiPUYgLT4gYT1GKVxuICAgIGEgLT4gIWIgICAgICAtLSBhPVQgLT4gYj1GXG4gICAgYSA9PSBiICAgICAgIC0tIGEgLT4gYiAmIGIgLT4gYVxuICAgIGEgLT4gYiAmIGMgICAtLSBhPVQgLT4gYj1UICYgYz1UXG4gICAgIyBUT0RPIGIgfCBjXG4gICAgSW50ZXJuYWxzXG4gICAgLS0tLS0tLS0tXG4gICAgLmZ1bGxfaW1wbGljYXRpb25zW2ssIHZdOiBhbGwgdGhlIGltcGxpY2F0aW9ucyBvZiBmYWN0IGs9dlxuICAgIC5iZXRhX3RyaWdnZXJzW2ssIHZdOiBiZXRhIHJ1bGVzIHRoYXQgbWlnaHQgYmUgdHJpZ2dlcmVkIHdoZW4gaz12XG4gICAgLnByZXJlcSAgLS0ge30gayA8LSBbXSBvZiBrJ3MgcHJlcmVxdWlzaXRlc1xuICAgIC5kZWZpbmVkX2ZhY3RzIC0tIHNldCBvZiBkZWZpbmVkIGZhY3QgbmFtZXNcbiAgICAqL1xuXG4gICAgYmV0YV9ydWxlczogYW55W107XG4gICAgZGVmaW5lZF9mYWN0cztcbiAgICBmdWxsX2ltcGxpY2F0aW9ucztcbiAgICBiZXRhX3RyaWdnZXJzO1xuICAgIHByZXJlcTtcblxuICAgIGNvbnN0cnVjdG9yKHJ1bGVzOiBhbnlbXSB8IHN0cmluZykge1xuICAgICAgICAvLyBDb21waWxlIHJ1bGVzIGludG8gaW50ZXJuYWwgbG9va3VwIHRhYmxlc1xuICAgICAgICBpZiAodHlwZW9mIHJ1bGVzID09PSBcInN0cmluZ1wiKSB7XG4gICAgICAgICAgICBydWxlcyA9IHJ1bGVzLnNwbGl0KFwiXFxuXCIpO1xuICAgICAgICB9XG4gICAgICAgIC8vIC0tLSBwYXJzZSBhbmQgcHJvY2VzcyBydWxlcyAtLS1cbiAgICAgICAgY29uc3QgUDogUHJvdmVyID0gbmV3IFByb3ZlcjtcblxuICAgICAgICBmb3IgKGNvbnN0IHJ1bGUgb2YgcnVsZXMpIHtcbiAgICAgICAgICAgIC8vIFhYWCBgYWAgaXMgaGFyZGNvZGVkIHRvIGJlIGFsd2F5cyBhdG9tXG4gICAgICAgICAgICBsZXQgW2EsIG9wLCBiXSA9IFV0aWwuc3BsaXRMb2dpY1N0cihydWxlKTsgXG4gICAgICAgICAgICBhID0gTG9naWMuZnJvbXN0cmluZyhhKTtcbiAgICAgICAgICAgIGIgPSBMb2dpYy5mcm9tc3RyaW5nKGIpO1xuICAgICAgICAgICAgaWYgKG9wID09PSBcIi0+XCIpIHtcbiAgICAgICAgICAgICAgICBQLnByb2Nlc3NfcnVsZShhLCBiKTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAob3AgPT09IFwiPT1cIikge1xuICAgICAgICAgICAgICAgIFAucHJvY2Vzc19ydWxlKGEsIGIpO1xuICAgICAgICAgICAgICAgIFAucHJvY2Vzc19ydWxlKGIsIGEpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJ1bmtub3duIG9wIFwiICsgb3ApO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgLy8gLS0tIGJ1aWxkIGRlZHVjdGlvbiBuZXR3b3JrcyAtLS1cblxuICAgICAgICB0aGlzLmJldGFfcnVsZXMgPSBbXTtcbiAgICAgICAgZm9yIChjb25zdCBpdGVtIG9mIFAucnVsZXNfYmV0YSgpKSB7XG4gICAgICAgICAgICBjb25zdCBiY29uZCA9IGl0ZW0ucDtcbiAgICAgICAgICAgIGNvbnN0IGJpbXBsID0gaXRlbS5xO1xuICAgICAgICAgICAgY29uc3QgcGFpcnM6IEhhc2hTZXQgPSBuZXcgSGFzaFNldCgpO1xuICAgICAgICAgICAgYmNvbmQuYXJncy5mb3JFYWNoKChhOiBhbnkpID0+IHBhaXJzLmFkZChfYXNfcGFpcnYyKGEpKSk7XG4gICAgICAgICAgICB0aGlzLmJldGFfcnVsZXMucHVzaChuZXcgSW1wbGljYXRpb24ocGFpcnMsIF9hc19wYWlydjIoYmltcGwpKSk7XG4gICAgICAgIH1cblxuICAgICAgICAvLyBkZWR1Y2UgYWxwaGEgaW1wbGljYXRpb25zXG4gICAgICAgIGNvbnN0IGltcGxfYSA9IGRlZHVjZV9hbHBoYV9pbXBsaWNhdGlvbnMoUC5ydWxlc19hbHBoYSgpKTtcblxuICAgICAgICAvLyBub3c6XG4gICAgICAgIC8vIC0gYXBwbHkgYmV0YSBydWxlcyB0byBhbHBoYSBjaGFpbnMgIChzdGF0aWMgZXh0ZW5zaW9uKSwgYW5kXG4gICAgICAgIC8vIC0gZnVydGhlciBhc3NvY2lhdGUgYmV0YSBydWxlcyB0byBhbHBoYSBjaGFpbiAoZm9yIGluZmVyZW5jZVxuICAgICAgICAvLyBhdCBydW50aW1lKVxuXG4gICAgICAgIGNvbnN0IGltcGxfYWIgPSBhcHBseV9iZXRhX3RvX2FscGhhX3JvdXRlKGltcGxfYSwgUC5ydWxlc19iZXRhKCkpO1xuXG4gICAgICAgIC8vIGV4dHJhY3QgZGVmaW5lZCBmYWN0IG5hbWVzXG4gICAgICAgIHRoaXMuZGVmaW5lZF9mYWN0cyA9IG5ldyBIYXNoU2V0KCk7XG5cblxuICAgICAgICBmb3IgKGNvbnN0IGsgb2YgaW1wbF9hYi5rZXlzKCkpIHtcbiAgICAgICAgICAgIHRoaXMuZGVmaW5lZF9mYWN0cy5hZGQoX2Jhc2VfZmFjdChrKSk7XG4gICAgICAgIH1cblxuICAgICAgICAvLyBidWlsZCByZWxzIChmb3J3YXJkIGNoYWlucylcblxuICAgICAgICBjb25zdCBmdWxsX2ltcGxpY2F0aW9ucyA9IG5ldyBTZXREZWZhdWx0RGljdCgpO1xuICAgICAgICBjb25zdCBiZXRhX3RyaWdnZXJzID0gbmV3IEFyckRlZmF1bHREaWN0KCk7XG4gICAgICAgIGZvciAoY29uc3QgaXRlbSBvZiBpbXBsX2FiLmVudHJpZXMoKSkge1xuICAgICAgICAgICAgY29uc3QgayA9aXRlbVswXTtcbiAgICAgICAgICAgIGNvbnN0IHZhbCA9IGl0ZW1bMV07XG4gICAgICAgICAgICBjb25zdCBpbXBsOiBIYXNoU2V0ID0gdmFsLnA7XG4gICAgICAgICAgICBjb25zdCBiZXRhaWR4cyA9IHZhbC5xO1xuICAgICAgICAgICAgY29uc3Qgc2V0VG9BZGQgPSBuZXcgSGFzaFNldCgpO1xuICAgICAgICAgICAgaW1wbC50b0FycmF5KCkuZm9yRWFjaCgoZTogYW55KSA9PiBzZXRUb0FkZC5hZGQoX2FzX3BhaXJ2MihlKSkpO1xuICAgICAgICAgICAgZnVsbF9pbXBsaWNhdGlvbnMuYWRkKF9hc19wYWlydjIoayksIHNldFRvQWRkKTtcbiAgICAgICAgICAgIGJldGFfdHJpZ2dlcnMuYWRkKF9hc19wYWlydjIoayksIGJldGFpZHhzKTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLmZ1bGxfaW1wbGljYXRpb25zID0gZnVsbF9pbXBsaWNhdGlvbnM7XG5cbiAgICAgICAgdGhpcy5iZXRhX3RyaWdnZXJzID0gYmV0YV90cmlnZ2VycztcblxuICAgICAgICAvLyBidWlsZCBwcmVyZXEgKGJhY2t3YXJkIGNoYWlucylcbiAgICAgICAgY29uc3QgcHJlcmVxID0gbmV3IFNldERlZmF1bHREaWN0KCk7XG4gICAgICAgIGNvbnN0IHJlbF9wcmVyZXEgPSBydWxlc18ycHJlcmVxKGZ1bGxfaW1wbGljYXRpb25zKTtcbiAgICAgICAgZm9yIChjb25zdCBpdGVtIG9mIHJlbF9wcmVyZXEuZW50cmllcygpKSB7XG4gICAgICAgICAgICBjb25zdCBrID0gaXRlbVswXTtcbiAgICAgICAgICAgIGNvbnN0IHBpdGVtcyA9IGl0ZW1bMV07XG4gICAgICAgICAgICBjb25zdCB0b0FkZCA9IHByZXJlcS5nZXQoayk7XG4gICAgICAgICAgICB0b0FkZC5hZGRBcnIocGl0ZW1zLnRvQXJyYXkoKSk7XG4gICAgICAgICAgICBwcmVyZXEuYWRkKGssIHRvQWRkKTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLnByZXJlcSA9IHByZXJlcTtcbiAgICB9XG59XG5cblxuY2xhc3MgSW5jb25zaXN0ZW50QXNzdW1wdGlvbnMgZXh0ZW5kcyBFcnJvciB7XG4gICAgYXJncztcblxuICAgIGNvbnN0cnVjdG9yKC4uLmFyZ3M6IGFueVtdKSB7XG4gICAgICAgIHN1cGVyKCk7XG4gICAgICAgIHRoaXMuYXJncyA9IGFyZ3M7XG4gICAgfVxuXG4gICAgc3RhdGljIF9fc3RyX18oLi4uYXJnczogYW55W10pIHtcbiAgICAgICAgY29uc3QgW2tiLCBmYWN0LCB2YWx1ZV0gPSBhcmdzO1xuICAgICAgICByZXR1cm4ga2IgKyBcIiwgXCIgKyBmYWN0ICsgXCI9XCIgKyB2YWx1ZTtcbiAgICB9XG59XG5cbmV4cG9ydCBjbGFzcyBGYWN0S0IgZXh0ZW5kcyBIYXNoRGljdCB7XG4gICAgLypcbiAgICBBIHNpbXBsZSBwcm9wb3NpdGlvbmFsIGtub3dsZWRnZSBiYXNlIHJlbHlpbmcgb24gY29tcGlsZWQgaW5mZXJlbmNlIHJ1bGVzLlxuICAgICovXG5cbiAgICBydWxlcztcblxuICAgIGNvbnN0cnVjdG9yKHJ1bGVzOiBhbnkpIHtcbiAgICAgICAgc3VwZXIoKTtcbiAgICAgICAgdGhpcy5ydWxlcyA9IHJ1bGVzO1xuICAgIH1cblxuICAgIF90ZWxsKGs6IGFueSwgdjogYW55KSB7XG4gICAgICAgIC8qIEFkZCBmYWN0IGs9diB0byB0aGUga25vd2xlZGdlIGJhc2UuXG4gICAgICAgIFJldHVybnMgVHJ1ZSBpZiB0aGUgS0IgaGFzIGFjdHVhbGx5IGJlZW4gdXBkYXRlZCwgRmFsc2Ugb3RoZXJ3aXNlLlxuICAgICAgICAqL1xuICAgICAgICBpZiAoayBpbiB0aGlzLmRpY3QgJiYgdHlwZW9mIHRoaXMuZ2V0KGspICE9PSBcInVuZGVmaW5lZFwiKSB7XG4gICAgICAgICAgICBpZiAodGhpcy5nZXQoaykgPT09IHYpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gTG9naWMuRmFsc2U7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHRocm93IG5ldyBJbmNvbnNpc3RlbnRBc3N1bXB0aW9ucyh0aGlzLCBrLCB2KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMuYWRkKGssIHYpO1xuICAgICAgICAgICAgcmV0dXJuIExvZ2ljLlRydWU7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvLyAvLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXG4gICAgLy8qIFRoaXMgaXMgdGhlIHdvcmtob3JzZSwgc28ga2VlcCBpdCAqZmFzdCouIC8vXG4gICAgLy8gLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xuXG4gICAgZGVkdWNlX2FsbF9mYWN0cyhmYWN0czogYW55KSB7XG4gICAgICAgIC8qXG4gICAgICAgIFVwZGF0ZSB0aGUgS0Igd2l0aCBhbGwgdGhlIGltcGxpY2F0aW9ucyBvZiBhIGxpc3Qgb2YgZmFjdHMuXG4gICAgICAgIEZhY3RzIG11c3QgYmUgYW4gYXJyYXkgb2YgaW1wbGljYXRpb25zIChmYWN0LCBmYWN0X3ZhbHVlKVxuICAgICAgICAqL1xuICAgICAgICAvLyBrZWVwIGZyZXF1ZW50bHkgdXNlZCBhdHRyaWJ1dGVzIGxvY2FsbHksIHNvIHdlJ2xsIGF2b2lkIGV4dHJhXG4gICAgICAgIC8vIGF0dHJpYnV0ZSBhY2Nlc3Mgb3ZlcmhlYWRcblxuICAgICAgICBjb25zdCBmdWxsX2ltcGxpY2F0aW9uczogU2V0RGVmYXVsdERpY3QgPSB0aGlzLnJ1bGVzLmZ1bGxfaW1wbGljYXRpb25zO1xuICAgICAgICBjb25zdCBiZXRhX3RyaWdnZXJzOiBBcnJEZWZhdWx0RGljdCA9IHRoaXMucnVsZXMuYmV0YV90cmlnZ2VycztcbiAgICAgICAgY29uc3QgYmV0YV9ydWxlczogYW55W10gPSB0aGlzLnJ1bGVzLmJldGFfcnVsZXM7XG5cbiAgICAgICAgaWYgKGZhY3RzIGluc3RhbmNlb2YgSGFzaERpY3QgfHwgZmFjdHMgaW5zdGFuY2VvZiBTdGRGYWN0S0IpIHtcbiAgICAgICAgICAgIGZhY3RzID0gZmFjdHMuZW50cmllcygpO1xuICAgICAgICB9XG5cbiAgICAgICAgd2hpbGUgKGZhY3RzLmxlbmd0aCAhPSAwKSB7XG4gICAgICAgICAgICBjb25zdCBiZXRhX21heXRyaWdnZXIgPSBuZXcgSGFzaFNldCgpO1xuXG4gICAgICAgICAgICAvLyAtLS0gYWxwaGEgY2hhaW5zIC0tLVxuICAgICAgICAgICAgZm9yIChjb25zdCBpdGVtIG9mIGZhY3RzKSB7XG4gICAgICAgICAgICAgICAgY29uc3QgayA9IGl0ZW1bMF07XG4gICAgICAgICAgICAgICAgY29uc3QgdiA9IGl0ZW1bMV07XG5cbiAgICAgICAgICAgICAgICBpZiAodGhpcy5fdGVsbChrLCB2KSBpbnN0YW5jZW9mIEZhbHNlIHx8ICh0eXBlb2YgdiA9PT0gXCJ1bmRlZmluZWRcIikpIHtcbiAgICAgICAgICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgLy8gbG9va3VwIHJvdXRpbmcgdGFibGVzXG4gICAgICAgICAgICAgICAgY29uc3QgYXJyID0gZnVsbF9pbXBsaWNhdGlvbnMuZ2V0KG5ldyBJbXBsaWNhdGlvbihrLCB2KSkudG9BcnJheSgpO1xuICAgICAgICAgICAgICAgIGZvciAoY29uc3QgaXRlbSBvZiBhcnIpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fdGVsbChpdGVtLnAsIGl0ZW0ucSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGNvbnN0IGN1cnJpbXAgPSBiZXRhX3RyaWdnZXJzLmdldChuZXcgSW1wbGljYXRpb24oaywgdikpO1xuICAgICAgICAgICAgICAgIGlmICghKGN1cnJpbXAubGVuZ3RoID09IDApKSB7XG4gICAgICAgICAgICAgICAgICAgIGJldGFfbWF5dHJpZ2dlci5hZGRBcnIoY3VycmltcCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgLy8gLS0tIGJldGEgY2hhaW5zIC0tLVxuICAgICAgICAgICAgZmFjdHMgPSBbXTtcbiAgICAgICAgICAgIGZvciAoY29uc3QgYmlkeCBvZiBiZXRhX21heXRyaWdnZXIudG9BcnJheSgpKSB7XG4gICAgICAgICAgICAgICAgY29uc3Qge3A6IGJjb25kLCBxOiBiaW1wbH0gPSBiZXRhX3J1bGVzW2JpZHhdO1xuICAgICAgICAgICAgICAgIGlmIChiY29uZC50b0FycmF5KCkuZXZlcnkoKGltcDogYW55KSA9PiB0aGlzLmdldChpbXAucCkgPT0gaW1wLnEpKSB7XG4gICAgICAgICAgICAgICAgICAgIGZhY3RzLnB1c2goW2JpbXBsLnAsIGJpbXBsLnFdKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG59XG4iLCAiLyogVGhlIGNvcmUncyBjb3JlLiAqL1xuXG4vKlxuTm90YWJsZSBjaGFuZ2VzIG1hZGUgKFdCIGFuZCBHTSlcbi0gUmVwbGFjZWQgYXJyYXkgb2YgY2xhc3NlcyB3aXRoIGRpY3Rpb25hcnkgZm9yIHF1aWNrZXIgaW5kZXggcmV0cmlldmFsc1xuLSBJbXBsZW1lbnRlZCBhIGNvbnN0cnVjdG9yIHN5c3RlbSBmb3IgYmFzaWNtZXRhIHJhdGhlciB0aGFuIF9fbmV3X19cbiovXG5cblxuaW1wb3J0IHtIYXNoU2V0fSBmcm9tIFwiLi91dGlsaXR5XCI7XG5cbi8vIHVzZWQgZm9yIGNhbm9uaWNhbCBvcmRlcmluZyBvZiBzeW1ib2xpYyBzZXF1ZW5jZXNcbi8vIHZpYSBfX2NtcF9fIG1ldGhvZDpcbi8vIEZJWE1FIHRoaXMgaXMgKnNvKiBpcnJlbGV2YW50IGFuZCBvdXRkYXRlZCFcblxuY29uc3Qgb3JkZXJpbmdfb2ZfY2xhc3NlczogUmVjb3JkPGFueSwgYW55PiA9IHtcbiAgICAvLyBzaW5nbGV0b24gbnVtYmVyc1xuICAgIFplcm86IDAsIE9uZTogMSwgSGFsZjogMiwgSW5maW5pdHk6IDMsIE5hTjogNCwgTmVnYXRpdmVPbmU6IDUsIE5lZ2F0aXZlSW5maW5pdHk6IDYsXG4gICAgLy8gbnVtYmVyc1xuICAgIEludGVnZXI6IDcsIFJhdGlvbmFsOiA4LCBGbG9hdDogOSxcbiAgICAvLyBzaW5nbGV0b24gbnVtYmVyc1xuICAgIEV4cDE6IDEwLCBQaTogMTEsIEltYWdpbmFyeVVuaXQ6IDEyLFxuICAgIC8vIHN5bWJvbHNcbiAgICBTeW1ib2w6IDEzLCBXaWxkOiAxNCwgVGVtcG9yYXJ5OiAxNSxcbiAgICAvLyBhcml0aG1ldGljIG9wZXJhdGlvbnNcbiAgICBQb3c6IDE2LCBNdWw6IDE3LCBBZGQ6IDE4LFxuICAgIC8vIGZ1bmN0aW9uIHZhbHVlc1xuICAgIERlcml2YXRpdmU6IDE5LCBJbnRlZ3JhbDogMjAsXG4gICAgLy8gZGVmaW5lZCBzaW5nbGV0b24gZnVuY3Rpb25zXG4gICAgQWJzOiAyMSwgU2lnbjogMjIsIFNxcnQ6IDIzLCBGbG9vcjogMjQsIENlaWxpbmc6IDI1LCBSZTogMjYsIEltOiAyNyxcbiAgICBBcmc6IDI4LCBDb25qdWdhdGU6IDI5LCBFeHA6IDMwLCBMb2c6IDMxLCBTaW46IDMyLCBDb3M6IDMzLCBUYW46IDM0LFxuICAgIENvdDogMzUsIEFTaW46IDM2LCBBQ29zOiAzNywgQVRhbjogMzgsIEFDb3Q6IDM5LCBTaW5oOiA0MCwgQ29zaDogNDEsXG4gICAgVGFuaDogNDIsIEFTaW5oOiA0MywgQUNvc2g6IDQ0LCBBVGFuaDogNDUsIEFDb3RoOiA0NixcbiAgICBSaXNpbmdGYWN0b3JpYWw6IDQ3LCBGYWxsaW5nRmFjdG9yaWFsOiA0OCwgZmFjdG9yaWFsOiA0OSwgYmlub21pYWw6IDUwLFxuICAgIEdhbW1hOiA1MSwgTG93ZXJHYW1tYTogNTIsIFVwcGVyR2FtYTogNTMsIFBvbHlHYW1tYTogNTQsIEVyZjogNTUsXG4gICAgLy8gc3BlY2lhbCBwb2x5bm9taWFsc1xuICAgIENoZWJ5c2hldjogNTYsIENoZWJ5c2hldjI6IDU3LFxuICAgIC8vIHVuZGVmaW5lZCBmdW5jdGlvbnNcbiAgICBGdW5jdGlvbjogNTgsIFdpbGRGdW5jdGlvbjogNTksXG4gICAgLy8gYW5vbnltb3VzIGZ1bmN0aW9uc1xuICAgIExhbWJkYTogNjAsXG4gICAgLy8gTGFuZGF1IE8gc3ltYm9sXG4gICAgT3JkZXI6IDYxLFxuICAgIC8vIHJlbGF0aW9uYWwgb3BlcmF0aW9uc1xuICAgIEVxdWFsbGl0eTogNjIsIFVuZXF1YWxpdHk6IDYzLCBTdHJpY3RHcmVhdGVyVGhhbjogNjQsIFN0cmljdExlc3NUaGFuOiA2NSxcbiAgICBHcmVhdGVyVGhhbjogNjYsIExlc3NUaGFuOiA2Nixcbn07XG5cblxuY2xhc3MgUmVnaXN0cnkge1xuICAgIC8qXG4gICAgQmFzZSBjbGFzcyBmb3IgcmVnaXN0cnkgb2JqZWN0cy5cblxuICAgIFJlZ2lzdHJpZXMgbWFwIGEgbmFtZSB0byBhbiBvYmplY3QgdXNpbmcgYXR0cmlidXRlIG5vdGF0aW9uLiBSZWdpc3RyeVxuICAgIGNsYXNzZXMgYmVoYXZlIHNpbmdsZXRvbmljYWxseTogYWxsIHRoZWlyIGluc3RhbmNlcyBzaGFyZSB0aGUgc2FtZSBzdGF0ZSxcbiAgICB3aGljaCBpcyBzdG9yZWQgaW4gdGhlIGNsYXNzIG9iamVjdC5cblxuICAgIEFsbCBzdWJjbGFzc2VzIHNob3VsZCBzZXQgYF9fc2xvdHNfXyA9ICgpYC5cbiAgICAqL1xuXG4gICAgc3RhdGljIGRpY3Q6IFJlY29yZDxhbnksIGFueT47XG5cbiAgICBhZGRBdHRyKG5hbWU6IGFueSwgb2JqOiBhbnkpIHtcbiAgICAgICAgUmVnaXN0cnkuZGljdFtuYW1lXSA9IG9iajtcbiAgICB9XG5cbiAgICBkZWxBdHRyKG5hbWU6IGFueSkge1xuICAgICAgICBkZWxldGUgUmVnaXN0cnkuZGljdFtuYW1lXTtcbiAgICB9XG59XG5cbi8vIEEgc2V0IGNvbnRhaW5pbmcgYWxsIFN5bVB5IGNsYXNzIG9iamVjdHNcbmNvbnN0IGFsbF9jbGFzc2VzID0gbmV3IEhhc2hTZXQoKTtcblxuY2xhc3MgQmFzaWNNZXRhIHtcbiAgICBfX3N5bXB5X186IGFueTtcblxuICAgIHN0YXRpYyByZWdpc3RlcihjbHM6IGFueSkge1xuICAgICAgICBhbGxfY2xhc3Nlcy5hZGQoY2xzKTtcbiAgICAgICAgY2xzLl9fc3ltcHlfXyA9IHRydWU7XG4gICAgfVxuXG4gICAgc3RhdGljIGNvbXBhcmUoc2VsZjogYW55LCBvdGhlcjogYW55KSB7XG4gICAgICAgIC8vIElmIHRoZSBvdGhlciBvYmplY3QgaXMgbm90IGEgQmFzaWMgc3ViY2xhc3MsIHRoZW4gd2UgYXJlIG5vdCBlcXVhbCB0b1xuICAgICAgICAvLyBpdC5cbiAgICAgICAgaWYgKCEob3RoZXIgaW5zdGFuY2VvZiBCYXNpY01ldGEpKSB7XG4gICAgICAgICAgICByZXR1cm4gLTE7XG4gICAgICAgIH1cbiAgICAgICAgY29uc3QgbjEgPSBzZWxmLmNvbnN0cnVjdG9yLm5hbWU7XG4gICAgICAgIGNvbnN0IG4yID0gb3RoZXIuY29uc3RydWN0b3IubmFtZTtcbiAgICAgICAgLy8gY2hlY2sgaWYgYm90aCBhcmUgaW4gdGhlIGNsYXNzZXMgZGljdGlvbmFyeVxuICAgICAgICBpZiAob3JkZXJpbmdfb2ZfY2xhc3Nlcy5oYXMobjEpICYmIG9yZGVyaW5nX29mX2NsYXNzZXMuaGFzKG4yKSkge1xuICAgICAgICAgICAgY29uc3QgaWR4MSA9IG9yZGVyaW5nX29mX2NsYXNzZXNbbjFdO1xuICAgICAgICAgICAgY29uc3QgaWR4MiA9IG9yZGVyaW5nX29mX2NsYXNzZXNbbjJdO1xuICAgICAgICAgICAgLy8gdGhlIGNsYXNzIHdpdGggdGhlIGxhcmdlciBpbmRleCBpcyBncmVhdGVyXG4gICAgICAgICAgICByZXR1cm4gTWF0aC5zaWduKGlkeDEgLSBpZHgyKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAobjEgPiBuMikge1xuICAgICAgICAgICAgcmV0dXJuIDE7XG4gICAgICAgIH0gZWxzZSBpZiAobjEgPT09IG4yKSB7XG4gICAgICAgICAgICByZXR1cm4gMDtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gLTE7XG4gICAgfVxuXG4gICAgbGVzc1RoYW4ob3RoZXI6IGFueSkge1xuICAgICAgICBpZiAoQmFzaWNNZXRhLmNvbXBhcmUoc2VsZiwgb3RoZXIpID09PSAtMSkge1xuICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cblxuICAgIGdyZWF0ZXJUaGFuKG90aGVyOiBhbnkpIHtcbiAgICAgICAgaWYgKEJhc2ljTWV0YS5jb21wYXJlKHNlbGYsIG90aGVyKSA9PT0gMSkge1xuICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbn1cblxuXG5leHBvcnQge0Jhc2ljTWV0YSwgUmVnaXN0cnl9O1xuXG4iLCAiLypcbk5vdGFibGUgY2hhbmdlcyBtYWRlIChhbmQgbm90ZXMpOlxuLSBNYW5hZ2VkUHJvcGVydGllcyByZXdvcmtlZCBhcyBub3JtYWwgY2xhc3MgLSBlYWNoIGNsYXNzIGlzIHJlZ2lzdGVyZWQgZGlyZWN0bHlcbiAgYWZ0ZXIgZGVmaW5lZFxuLSBNYW5hZ2VkUHJvcGVydGllcyBsb29wcyB0aHJvdWdoIHN1cGVyY2xhc3NlcyB0byBhc3NpZ24gc3RhdGljIHByb3BlcnRpZXMgdGhhdFxuICBhcmVuJ3QgaW5oZXJpdGVkICh0aGFua3MgVHlwZVNjcmlwdClcbi0gR2V0aXQgYWN0cyBhcyBhIGxhbWJkYSwgc28gcHJvcGVydGllcyBhcmUgbm93IGFjY2Vzc2VkIHdpdGggZnVuY3Rpb24gbm90YXRpb25cbiAgaS5lLiwgbXlvYmplY3QuaXNfcHJvcGVydHkoKVxuKi9cblxuaW1wb3J0IHtGYWN0S0IsIEZhY3RSdWxlc30gZnJvbSBcIi4vZmFjdHNcIjtcbmltcG9ydCB7QmFzaWNNZXRhfSBmcm9tIFwiLi9jb3JlXCI7XG5pbXBvcnQge0hhc2hEaWN0LCBIYXNoU2V0LCBJbXBsaWNhdGlvbiwgVXRpbH0gZnJvbSBcIi4vdXRpbGl0eVwiO1xuXG5cbmNvbnN0IF9hc3N1bWVfcnVsZXMgPSBuZXcgRmFjdFJ1bGVzKFtcbiAgICBcImludGVnZXIgLT4gcmF0aW9uYWxcIixcbiAgICBcInJhdGlvbmFsIC0+IHJlYWxcIixcbiAgICBcInJhdGlvbmFsIC0+IGFsZ2VicmFpY1wiLFxuICAgIFwiYWxnZWJyYWljIC0+IGNvbXBsZXhcIixcbiAgICBcInRyYW5zY2VuZGVudGFsID09IGNvbXBsZXggJiAhYWxnZWJyYWljXCIsXG4gICAgXCJyZWFsIC0+IGhlcm1pdGlhblwiLFxuICAgIFwiaW1hZ2luYXJ5IC0+IGNvbXBsZXhcIixcbiAgICBcImltYWdpbmFyeSAtPiBhbnRpaGVybWl0aWFuXCIsXG4gICAgXCJleHRlbmRlZF9yZWFsIC0+IGNvbW11dGF0aXZlXCIsXG4gICAgXCJjb21wbGV4IC0+IGNvbW11dGF0aXZlXCIsXG4gICAgXCJjb21wbGV4IC0+IGZpbml0ZVwiLFxuXG4gICAgXCJvZGQgPT0gaW50ZWdlciAmICFldmVuXCIsXG4gICAgXCJldmVuID09IGludGVnZXIgJiAhb2RkXCIsXG5cbiAgICBcInJlYWwgLT4gY29tcGxleFwiLFxuICAgIFwiZXh0ZW5kZWRfcmVhbCAtPiByZWFsIHwgaW5maW5pdGVcIixcbiAgICBcInJlYWwgPT0gZXh0ZW5kZWRfcmVhbCAmIGZpbml0ZVwiLFxuXG4gICAgXCJleHRlbmRlZF9yZWFsID09IGV4dGVuZGVkX25lZ2F0aXZlIHwgemVybyB8IGV4dGVuZGVkX3Bvc2l0aXZlXCIsXG4gICAgXCJleHRlbmRlZF9uZWdhdGl2ZSA9PSBleHRlbmRlZF9ub25wb3NpdGl2ZSAmIGV4dGVuZGVkX25vbnplcm9cIixcbiAgICBcImV4dGVuZGVkX3Bvc2l0aXZlID09IGV4dGVuZGVkX25vbm5lZ2F0aXZlICYgZXh0ZW5kZWRfbm9uemVyb1wiLFxuXG4gICAgXCJleHRlbmRlZF9ub25wb3NpdGl2ZSA9PSBleHRlbmRlZF9yZWFsICYgIWV4dGVuZGVkX3Bvc2l0aXZlXCIsXG4gICAgXCJleHRlbmRlZF9ub25uZWdhdGl2ZSA9PSBleHRlbmRlZF9yZWFsICYgIWV4dGVuZGVkX25lZ2F0aXZlXCIsXG5cbiAgICBcInJlYWwgPT0gbmVnYXRpdmUgfCB6ZXJvIHwgcG9zaXRpdmVcIixcbiAgICBcIm5lZ2F0aXZlID09IG5vbnBvc2l0aXZlICYgbm9uemVyb1wiLFxuICAgIFwicG9zaXRpdmUgPT0gbm9ubmVnYXRpdmUgJiBub256ZXJvXCIsXG5cbiAgICBcIm5vbnBvc2l0aXZlID09IHJlYWwgJiAhcG9zaXRpdmVcIixcbiAgICBcIm5vbm5lZ2F0aXZlID09IHJlYWwgJiAhbmVnYXRpdmVcIixcblxuICAgIFwicG9zaXRpdmUgPT0gZXh0ZW5kZWRfcG9zaXRpdmUgJiBmaW5pdGVcIixcbiAgICBcIm5lZ2F0aXZlID09IGV4dGVuZGVkX25lZ2F0aXZlICYgZmluaXRlXCIsXG4gICAgXCJub25wb3NpdGl2ZSA9PSBleHRlbmRlZF9ub25wb3NpdGl2ZSAmIGZpbml0ZVwiLFxuICAgIFwibm9ubmVnYXRpdmUgPT0gZXh0ZW5kZWRfbm9ubmVnYXRpdmUgJiBmaW5pdGVcIixcbiAgICBcIm5vbnplcm8gPT0gZXh0ZW5kZWRfbm9uemVybyAmIGZpbml0ZVwiLFxuXG4gICAgXCJ6ZXJvIC0+IGV2ZW4gJiBmaW5pdGVcIixcbiAgICBcInplcm8gPT0gZXh0ZW5kZWRfbm9ubmVnYXRpdmUgJiBleHRlbmRlZF9ub25wb3NpdGl2ZVwiLFxuICAgIFwiemVybyA9PSBub25uZWdhdGl2ZSAmIG5vbnBvc2l0aXZlXCIsXG4gICAgXCJub256ZXJvIC0+IHJlYWxcIixcblxuICAgIFwicHJpbWUgLT4gaW50ZWdlciAmIHBvc2l0aXZlXCIsXG4gICAgXCJjb21wb3NpdGUgLT4gaW50ZWdlciAmIHBvc2l0aXZlICYgIXByaW1lXCIsXG4gICAgXCIhY29tcG9zaXRlIC0+ICFwb3NpdGl2ZSB8ICFldmVuIHwgcHJpbWVcIixcblxuICAgIFwiaXJyYXRpb25hbCA9PSByZWFsICYgIXJhdGlvbmFsXCIsXG5cbiAgICBcImltYWdpbmFyeSAtPiAhZXh0ZW5kZWRfcmVhbFwiLFxuXG4gICAgXCJpbmZpbml0ZSA9PSAhZmluaXRlXCIsXG4gICAgXCJub25pbnRlZ2VyID09IGV4dGVuZGVkX3JlYWwgJiAhaW50ZWdlclwiLFxuICAgIFwiZXh0ZW5kZWRfbm9uemVybyA9PSBleHRlbmRlZF9yZWFsICYgIXplcm9cIixcbl0pO1xuXG5cbmV4cG9ydCBjb25zdCBfYXNzdW1lX2RlZmluZWQgPSBfYXNzdW1lX3J1bGVzLmRlZmluZWRfZmFjdHMuY2xvbmUoKTtcblxuY2xhc3MgU3RkRmFjdEtCIGV4dGVuZHMgRmFjdEtCIHtcbiAgICAvKiBBIEZhY3RLQiBzcGVjaWFsaXplZCBmb3IgdGhlIGJ1aWx0LWluIHJ1bGVzXG4gICAgVGhpcyBpcyB0aGUgb25seSBraW5kIG9mIEZhY3RLQiB0aGF0IEJhc2ljIG9iamVjdHMgc2hvdWxkIHVzZS5cbiAgICAqL1xuXG4gICAgX2dlbmVyYXRvcjtcblxuICAgIGNvbnN0cnVjdG9yKGZhY3RzOiBhbnkgPSB1bmRlZmluZWQpIHtcbiAgICAgICAgc3VwZXIoX2Fzc3VtZV9ydWxlcyk7XG4gICAgICAgIC8vIHNhdmUgYSBjb3B5IG9mIGZhY3RzIGRpY3RcbiAgICAgICAgaWYgKHR5cGVvZiBmYWN0cyA9PT0gXCJ1bmRlZmluZWRcIikge1xuICAgICAgICAgICAgdGhpcy5fZ2VuZXJhdG9yID0ge307XG4gICAgICAgIH0gZWxzZSBpZiAoIShmYWN0cyBpbnN0YW5jZW9mIEZhY3RLQikpIHtcbiAgICAgICAgICAgIHRoaXMuX2dlbmVyYXRvciA9IGZhY3RzLmNvcHkoKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMuX2dlbmVyYXRvciA9IChmYWN0cyBhcyBhbnkpLmdlbmVyYXRvcjsgLy8gISEhXG4gICAgICAgIH1cbiAgICAgICAgaWYgKGZhY3RzKSB7XG4gICAgICAgICAgICB0aGlzLmRlZHVjZV9hbGxfZmFjdHMoZmFjdHMpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgc3RkY2xvbmUoKSB7XG4gICAgICAgIHJldHVybiBuZXcgU3RkRmFjdEtCKHRoaXMpO1xuICAgIH1cblxuICAgIGdlbmVyYXRvcigpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX2dlbmVyYXRvci5jb3B5KCk7XG4gICAgfVxufVxuXG5leHBvcnQgZnVuY3Rpb24gYXNfcHJvcGVydHkoZmFjdDogYW55KSB7XG4gICAgcmV0dXJuIFwiaXNfXCIgKyBmYWN0O1xufVxuXG5leHBvcnQgZnVuY3Rpb24gbWFrZV9wcm9wZXJ0eShvYmo6IGFueSwgZmFjdDogYW55KSB7XG4gICAgLy8gY2hvb3NpbmcgdG8gcnVuIGdldGl0KCkgb24gbWFrZV9wcm9wZXJ0eSB0byBhZGQgY29uc2lzdGVuY3kgaW4gYWNjZXNzaW5nXG4gICAgLy8gcHJvcG9lcnRpZXMgb2Ygc3ltdHlwZSBvYmplY3RzLiB0aGlzIG1heSBzbG93IGRvd24gc3ltdHlwZSBzbGlnaHRseVxuICAgIG9ialthc19wcm9wZXJ0eShmYWN0KV0gPSBnZXRpdFxuICAgIGZ1bmN0aW9uIGdldGl0KCkge1xuICAgICAgICBpZiAodHlwZW9mIG9iai5fYXNzdW1wdGlvbnNbZmFjdF0gIT09IFwidW5kZWZpbmVkXCIpIHtcbiAgICAgICAgICAgIHJldHVybiBvYmouX2Fzc3VtcHRpb25zLmdldChmYWN0KTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiBfYXNrKGZhY3QsIG9iaik7XG4gICAgICAgIH1cbiAgICB9XG59XG5cblxuLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5vLXVudXNlZC12YXJzXG5mdW5jdGlvbiBfYXNrKGZhY3Q6IGFueSwgb2JqOiBhbnkpIHtcbiAgICAvKlxuICAgIEZpbmQgdGhlIHRydXRoIHZhbHVlIGZvciBhIHByb3BlcnR5IG9mIGFuIG9iamVjdC5cbiAgICBUaGlzIGZ1bmN0aW9uIGlzIGNhbGxlZCB3aGVuIGEgcmVxdWVzdCBpcyBtYWRlIHRvIHNlZSB3aGF0IGEgZmFjdFxuICAgIHZhbHVlIGlzLlxuICAgIEZvciB0aGlzIHdlIHVzZSBzZXZlcmFsIHRlY2huaXF1ZXM6XG4gICAgRmlyc3QsIHRoZSBmYWN0LWV2YWx1YXRpb24gZnVuY3Rpb24gaXMgdHJpZWQsIGlmIGl0IGV4aXN0cyAoZm9yXG4gICAgZXhhbXBsZSBfZXZhbF9pc19pbnRlZ2VyKS4gVGhlbiB3ZSB0cnkgcmVsYXRlZCBmYWN0cy4gRm9yIGV4YW1wbGVcbiAgICAgICAgcmF0aW9uYWwgICAtLT4gICBpbnRlZ2VyXG4gICAgYW5vdGhlciBleGFtcGxlIGlzIGpvaW5lZCBydWxlOlxuICAgICAgICBpbnRlZ2VyICYgIW9kZCAgLS0+IGV2ZW5cbiAgICBzbyBpbiB0aGUgbGF0dGVyIGNhc2UgaWYgd2UgYXJlIGxvb2tpbmcgYXQgd2hhdCAnZXZlbicgdmFsdWUgaXMsXG4gICAgJ2ludGVnZXInIGFuZCAnb2RkJyBmYWN0cyB3aWxsIGJlIGFza2VkLlxuICAgIEluIGFsbCBjYXNlcywgd2hlbiB3ZSBzZXR0bGUgb24gc29tZSBmYWN0IHZhbHVlLCBpdHMgaW1wbGljYXRpb25zIGFyZVxuICAgIGRlZHVjZWQsIGFuZCB0aGUgcmVzdWx0IGlzIGNhY2hlZCBpbiAuX2Fzc3VtcHRpb25zLlxuICAgICovXG5cbiAgICAvLyBGYWN0S0Igd2hpY2ggaXMgZGljdC1saWtlIGFuZCBtYXBzIGZhY3RzIHRvIHRoZWlyIGtub3duIHZhbHVlczpcbiAgICBjb25zdCBhc3N1bXB0aW9uczogU3RkRmFjdEtCID0gb2JqLl9hc3N1bXB0aW9ucztcblxuICAgIC8vIEEgZGljdCB0aGF0IG1hcHMgZmFjdHMgdG8gdGhlaXIgaGFuZGxlcnM6XG4gICAgY29uc3QgaGFuZGxlcl9tYXA6IEhhc2hEaWN0ID0gb2JqLl9wcm9wX2hhbmRsZXI7XG5cbiAgICAvLyBUaGlzIGlzIG91ciBxdWV1ZSBvZiBmYWN0cyB0byBjaGVjazpcbiAgICBsZXQgZmFjdHNfdG9fY2hlY2sgPSBuZXcgQXJyYXkoZmFjdCk7XG4gICAgY29uc3QgZmFjdHNfcXVldWVkID0gbmV3IEhhc2hTZXQoW2ZhY3RdKTtcblxuICAgIGNvbnN0IGNscyA9IG9iai5jb25zdHJ1Y3RvcjtcblxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgZmFjdHNfdG9fY2hlY2subGVuZ3RoOyBpKyspIHtcbiAgICAgICAgY29uc3QgZmFjdF9pID0gZmFjdHNfdG9fY2hlY2tbaV07XG4gICAgICAgIGlmICh0eXBlb2YgYXNzdW1wdGlvbnMuZ2V0KGZhY3RfaSkgIT09IFwidW5kZWZpbmVkXCIpIHtcbiAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICB9IGVsc2UgaWYgKGNsc1thc19wcm9wZXJ0eShmYWN0KV0pIHtcbiAgICAgICAgICAgIHJldHVybiAoY2xzW2FzX3Byb3BlcnR5KGZhY3QpXSk7XG4gICAgICAgIH1cbiAgICAgICAgbGV0IGZhY3RfaV92YWx1ZSA9IHVuZGVmaW5lZDtcbiAgICAgICAgbGV0IGhhbmRsZXJfaSA9IGhhbmRsZXJfbWFwLmdldChmYWN0X2kpO1xuICAgICAgICBpZiAodHlwZW9mIGhhbmRsZXJfaSAhPT0gXCJ1bmRlZmluZWRcIikge1xuICAgICAgICAgICAgZmFjdF9pX3ZhbHVlID0gb2JqW2hhbmRsZXJfaS5uYW1lXSgpO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHR5cGVvZiBmYWN0X2lfdmFsdWUgIT09IFwidW5kZWZpbmVkXCIpIHtcbiAgICAgICAgICAgIGFzc3VtcHRpb25zLmRlZHVjZV9hbGxfZmFjdHMoW1tmYWN0X2ksIGZhY3RfaV92YWx1ZV1dKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IGZhY3RfdmFsdWUgPSBhc3N1bXB0aW9ucy5nZXQoZmFjdCk7XG4gICAgICAgIGlmICh0eXBlb2YgZmFjdF92YWx1ZSAhPT0gXCJ1bmRlZmluZWRcIikge1xuICAgICAgICAgICAgcmV0dXJuIGZhY3RfdmFsdWU7XG4gICAgICAgIH1cbiAgICAgICAgY29uc3QgZmFjdHNldCA9IF9hc3N1bWVfcnVsZXMucHJlcmVxLmdldChmYWN0X2kpLmRpZmZlcmVuY2UoZmFjdHNfcXVldWVkKS50b0FycmF5KCk7XG4gICAgICAgIGlmIChmYWN0c2V0LnNpemUgIT09IDApIHtcbiAgICAgICAgICAgIFV0aWwuc2h1ZmZsZUFycmF5KGZhY3RzZXQpO1xuICAgICAgICAgICAgZmFjdHNfdG9fY2hlY2sgPSBmYWN0c190b19jaGVjay5jb25jYXQoZmFjdHNldCkuZmxhdCgpO1xuICAgICAgICAgICAgZmFjdHNfcXVldWVkLmFkZEFycihmYWN0c190b19jaGVjayk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGlmIChhc3N1bXB0aW9ucy5oYXMoZmFjdCkpIHtcbiAgICAgICAgcmV0dXJuIGFzc3VtcHRpb25zLmdldChmYWN0KTtcbiAgICB9XG5cbiAgICBhc3N1bXB0aW9ucy5fdGVsbChmYWN0LCB1bmRlZmluZWQpO1xuICAgIHJldHVybiB1bmRlZmluZWQ7XG59XG5cblxuY2xhc3MgTWFuYWdlZFByb3BlcnRpZXMge1xuICAgIHN0YXRpYyBhbGxfZXhwbGljaXRfYXNzdW1wdGlvbnM6IEhhc2hEaWN0ID0gbmV3IEhhc2hEaWN0KCk7XG4gICAgc3RhdGljIGFsbF9kZWZhdWx0X2Fzc3VtcHRpb25zOiBIYXNoU2V0ID0gbmV3IEhhc2hTZXQoKTtcblxuXG4gICAgc3RhdGljIHJlZ2lzdGVyKGNsczogYW55KSB7XG4gICAgICAgIC8vIHJlZ2lzdGVyIHdpdGggQmFzaWNNZXRhIChyZWNvcmQgY2xhc3MgbmFtZSlcbiAgICAgICAgQmFzaWNNZXRhLnJlZ2lzdGVyKGNscyk7XG5cbiAgICAgICAgLy8gRm9yIGFsbCBwcm9wZXJ0aWVzIHdlIHdhbnQgdG8gZGVmaW5lLCBkZXRlcm1pbmUgaWYgdGhleSBhcmUgZGVmaW5lZFxuICAgICAgICAvLyBieSB0aGUgY2xhc3Mgb3IgaWYgd2Ugc2V0IHRoZW0gYXMgdW5kZWZpbmVkLlxuICAgICAgICAvLyBBZGQgdGhlc2UgcHJvcGVydGllcyB0byBhIGRpY3QgY2FsbGVkIGxvY2FsX2RlZnNcbiAgICAgICAgY29uc3QgbG9jYWxfZGVmcyA9IG5ldyBIYXNoRGljdCgpO1xuICAgICAgICBjb25zdCBjbHNfcHJvcHMgPSBPYmplY3QuZ2V0T3duUHJvcGVydHlOYW1lcyhjbHMpO1xuICAgICAgICBmb3IgKGNvbnN0IGsgb2YgX2Fzc3VtZV9kZWZpbmVkLnRvQXJyYXkoKSkge1xuICAgICAgICAgICAgY29uc3QgYXR0cm5hbWUgPSBhc19wcm9wZXJ0eShrKTtcbiAgICAgICAgICAgIGlmIChjbHNfcHJvcHMuaW5jbHVkZXMoYXR0cm5hbWUpKSB7XG4gICAgICAgICAgICAgICAgbGV0IHYgPSBjbHNbYXR0cm5hbWVdO1xuICAgICAgICAgICAgICAgIGlmICgodHlwZW9mIHYgPT09IFwibnVtYmVyXCIgJiYgTnVtYmVyLmlzSW50ZWdlcih2KSkgfHwgdHlwZW9mIHYgPT09IFwiYm9vbGVhblwiIHx8IHR5cGVvZiB2ID09PSBcInVuZGVmaW5lZFwiKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmICh0eXBlb2YgdiAhPT0gXCJ1bmRlZmluZWRcIikge1xuICAgICAgICAgICAgICAgICAgICAgICAgdiA9ICEhdjtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBsb2NhbF9kZWZzLmFkZChrLCB2KTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCBhbGxfZGVmcyA9IG5ldyBIYXNoRGljdCgpXG4gICAgICAgIGNvbnN0IHN1cGVycyA9IFV0aWwuZ2V0U3VwZXJzKGNscyk7XG4gICAgICAgIGZvciAobGV0IGkgPSBzdXBlcnMubGVuZ3RoIC0gMTsgaSA+PSAwOyBpLS0pIHtcbiAgICAgICAgICAgIGNvbnN0IGJhc2UgPSBzdXBlcnNbaV07XG4gICAgICAgICAgICBjb25zdCBhc3N1bXB0aW9ucyA9IGJhc2UuX2V4cGxpY2l0X2NsYXNzX2Fzc3VtcHRpb25zO1xuICAgICAgICAgICAgaWYgKHR5cGVvZiBhc3N1bXB0aW9ucyAhPT0gXCJ1bmRlZmluZWRcIikge1xuICAgICAgICAgICAgICAgIGFsbF9kZWZzLm1lcmdlKGFzc3VtcHRpb25zKVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgYWxsX2RlZnMubWVyZ2UobG9jYWxfZGVmcyk7XG5cbiAgICAgICAgLy8gU2V0IGNsYXNzIHByb3BlcnRpZXMgZm9yIGFzc3VtZV9kZWZpbmVkXG4gICAgICAgIGNscy5fZXhwbGljaXRfY2xhc3NfYXNzdW1wdGlvbnMgPSBhbGxfZGVmc1xuICAgICAgICBjbHMuZGVmYXVsdF9hc3N1bXB0aW9ucyA9IG5ldyBTdGRGYWN0S0IoYWxsX2RlZnMpO1xuXG4gICAgICAgIC8vIEFkZCBkZWZhdWx0IGFzc3VtcHRpb25zIGFzIGNsYXNzIHByb3BlcnRpZXNcbiAgICAgICAgZm9yIChjb25zdCBpdGVtIG9mIGNscy5kZWZhdWx0X2Fzc3VtcHRpb25zLmVudHJpZXMoKSkge1xuICAgICAgICAgICAgY2xzW2FzX3Byb3BlcnR5KGl0ZW1bMF0pXSA9IGl0ZW1bMV07XG4gICAgICAgIH1cbiAgICAgICAgLy8gZ2V0IHRoZSBtaXNjLiBwcm9wZXJ0aWVzIG9mIHRoZSBzdXBlcmNsYXNzZXMgYW5kIGFzc2lnbiB0byBjbGFzc1xuICAgICAgICBmb3IgKGNvbnN0IHN1cGVyY2xzIG9mIFV0aWwuZ2V0U3VwZXJzKGNscykpIHtcbiAgICAgICAgICAgIGNvbnN0IHN0YXRpY0RlZnMgPSBuZXcgSGFzaFNldChPYmplY3QuZ2V0T3duUHJvcGVydHlOYW1lcyhjbHMpLmZpbHRlcihcbiAgICAgICAgICAgICAgICBwcm9wID0+IHByb3AuaW5jbHVkZXMoXCJpc19cIikgJiYgIV9hc3N1bWVfZGVmaW5lZC5oYXMocHJvcC5yZXBsYWNlKFwiaXNfXCIsIFwiXCIpKSkpO1xuXG4gICAgICAgICAgICBjb25zdCBvdGhlclByb3BzID0gbmV3IEhhc2hTZXQoT2JqZWN0LmdldE93blByb3BlcnR5TmFtZXMoc3VwZXJjbHMpLmZpbHRlcihcbiAgICAgICAgICAgICAgICBwcm9wID0+IHByb3AuaW5jbHVkZXMoXCJpc19cIikgJiYgIV9hc3N1bWVfZGVmaW5lZC5oYXMocHJvcC5yZXBsYWNlKFwiaXNfXCIsIFwiXCIpKSkpO1xuXG4gICAgICAgICAgICBjb25zdCB1bmlxdWVQcm9wcyA9IG90aGVyUHJvcHMuZGlmZmVyZW5jZShzdGF0aWNEZWZzKTtcbiAgICAgICAgICAgIGZvciAoY29uc3QgZmFjdCBvZiB1bmlxdWVQcm9wcy50b0FycmF5KCkpIHtcbiAgICAgICAgICAgICAgICBjbHNbZmFjdF0gPSBzdXBlcmNsc1tmYWN0XVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxufVxuXG5leHBvcnQge1N0ZEZhY3RLQiwgTWFuYWdlZFByb3BlcnRpZXN9O1xuIiwgIi8qXG5Ob3RhYmxlIGNoYW5nZXMgbWFkZSAoYW5kIG5vdGVzKTpcbi0gVmVyeSBiYXJlYm9uZXMgdmVyc2lvbnMgb2YgY2xhc3NlcyBpbXBsZW1lbnRlZCBzbyBmYXJcbi0gU2FtZSByZWdpc3RyeSBzeXN0ZW0gYXMgU2luZ2xldG9uIC0gdXNpbmcgc3RhdGljIGRpY3Rpb25hcnlcbiovXG5cbi8qIGVzbGludC1kaXNhYmxlIG5ldy1jYXAgKi9cbmNsYXNzIEtpbmRSZWdpc3RyeSB7XG4gICAgc3RhdGljIHJlZ2lzdHJ5OiBSZWNvcmQ8YW55LCBhbnk+ID0ge307XG5cbiAgICBzdGF0aWMgcmVnaXN0ZXIobmFtZTogc3RyaW5nLCBjbHM6IGFueSkge1xuICAgICAgICBLaW5kUmVnaXN0cnkucmVnaXN0cnlbbmFtZV0gPSBuZXcgY2xzKCk7XG4gICAgfVxufVxuXG5jbGFzcyBLaW5kIHsgLy8gISEhIG1ldGFjbGFzcyBzaXR1YXRpb25cbiAgICAvKlxuICAgIEJhc2UgY2xhc3MgZm9yIGtpbmRzLlxuICAgIEtpbmQgb2YgdGhlIG9iamVjdCByZXByZXNlbnRzIHRoZSBtYXRoZW1hdGljYWwgY2xhc3NpZmljYXRpb24gdGhhdFxuICAgIHRoZSBlbnRpdHkgZmFsbHMgaW50by4gSXQgaXMgZXhwZWN0ZWQgdGhhdCBmdW5jdGlvbnMgYW5kIGNsYXNzZXNcbiAgICByZWNvZ25pemUgYW5kIGZpbHRlciB0aGUgYXJndW1lbnQgYnkgaXRzIGtpbmQuXG4gICAgS2luZCBvZiBldmVyeSBvYmplY3QgbXVzdCBiZSBjYXJlZnVsbHkgc2VsZWN0ZWQgc28gdGhhdCBpdCBzaG93cyB0aGVcbiAgICBpbnRlbnRpb24gb2YgZGVzaWduLiBFeHByZXNzaW9ucyBtYXkgaGF2ZSBkaWZmZXJlbnQga2luZCBhY2NvcmRpbmdcbiAgICB0byB0aGUga2luZCBvZiBpdHMgYXJndWVtZW50cy4gRm9yIGV4YW1wbGUsIGFyZ3VlbWVudHMgb2YgYGBBZGRgYFxuICAgIG11c3QgaGF2ZSBjb21tb24ga2luZCBzaW5jZSBhZGRpdGlvbiBpcyBncm91cCBvcGVyYXRvciwgYW5kIHRoZVxuICAgIHJlc3VsdGluZyBgYEFkZCgpYGAgaGFzIHRoZSBzYW1lIGtpbmQuXG4gICAgRm9yIHRoZSBwZXJmb3JtYW5jZSwgZWFjaCBraW5kIGlzIGFzIGJyb2FkIGFzIHBvc3NpYmxlIGFuZCBpcyBub3RcbiAgICBiYXNlZCBvbiBzZXQgdGhlb3J5LiBGb3IgZXhhbXBsZSwgYGBOdW1iZXJLaW5kYGAgaW5jbHVkZXMgbm90IG9ubHlcbiAgICBjb21wbGV4IG51bWJlciBidXQgZXhwcmVzc2lvbiBjb250YWluaW5nIGBgUy5JbmZpbml0eWBgIG9yIGBgUy5OYU5gYFxuICAgIHdoaWNoIGFyZSBub3Qgc3RyaWN0bHkgbnVtYmVyLlxuICAgIEtpbmQgbWF5IGhhdmUgYXJndW1lbnRzIGFzIHBhcmFtZXRlci4gRm9yIGV4YW1wbGUsIGBgTWF0cml4S2luZCgpYGBcbiAgICBtYXkgYmUgY29uc3RydWN0ZWQgd2l0aCBvbmUgZWxlbWVudCB3aGljaCByZXByZXNlbnRzIHRoZSBraW5kIG9mIGl0c1xuICAgIGVsZW1lbnRzLlxuICAgIGBgS2luZGBgIGJlaGF2ZXMgaW4gc2luZ2xldG9uLWxpa2UgZmFzaGlvbi4gU2FtZSBzaWduYXR1cmUgd2lsbFxuICAgIHJldHVybiB0aGUgc2FtZSBvYmplY3QuXG4gICAgKi9cblxuICAgIHN0YXRpYyBuZXcoY2xzOiBhbnksIC4uLmFyZ3M6IGFueSkge1xuICAgICAgICBsZXQgaW5zdDtcbiAgICAgICAgaWYgKGFyZ3MgaW4gS2luZFJlZ2lzdHJ5LnJlZ2lzdHJ5KSB7XG4gICAgICAgICAgICBpbnN0ID0gS2luZFJlZ2lzdHJ5LnJlZ2lzdHJ5W2FyZ3NdO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgS2luZFJlZ2lzdHJ5LnJlZ2lzdGVyKGNscy5uYW1lLCBjbHMpO1xuICAgICAgICAgICAgaW5zdCA9IG5ldyBjbHMoKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gaW5zdDtcbiAgICB9XG59XG5cbmNsYXNzIF9VbmRlZmluZWRLaW5kIGV4dGVuZHMgS2luZCB7XG4gICAgLypcbiAgICBEZWZhdWx0IGtpbmQgZm9yIGFsbCBTeW1QeSBvYmplY3QuIElmIHRoZSBraW5kIGlzIG5vdCBkZWZpbmVkIGZvclxuICAgIHRoZSBvYmplY3QsIG9yIGlmIHRoZSBvYmplY3QgY2Fubm90IGluZmVyIHRoZSBraW5kIGZyb20gaXRzXG4gICAgYXJndW1lbnRzLCB0aGlzIHdpbGwgYmUgcmV0dXJuZWQuXG4gICAgRXhhbXBsZXNcbiAgICA9PT09PT09PVxuICAgID4+PiBmcm9tIHN5bXB5IGltcG9ydCBFeHByXG4gICAgPj4+IEV4cHIoKS5raW5kXG4gICAgVW5kZWZpbmVkS2luZFxuICAgICovXG5cbiAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICAgICAgc3VwZXIoKTtcbiAgICB9XG5cbiAgICBzdGF0aWMgbmV3KCkge1xuICAgICAgICByZXR1cm4gS2luZC5uZXcoX1VuZGVmaW5lZEtpbmQpO1xuICAgIH1cblxuICAgIHRvU3RyaW5nKCkge1xuICAgICAgICByZXR1cm4gXCJVbmRlZmluZWRLaW5kXCI7XG4gICAgfVxufVxuXG5jb25zdCBVbmRlZmluZWRLaW5kID0gX1VuZGVmaW5lZEtpbmQubmV3KCk7XG5cbmNsYXNzIF9OdW1iZXJLaW5kIGV4dGVuZHMgS2luZCB7XG4gICAgLypcbiAgICBLaW5kIGZvciBhbGwgbnVtZXJpYyBvYmplY3QuXG4gICAgVGhpcyBraW5kIHJlcHJlc2VudHMgZXZlcnkgbnVtYmVyLCBpbmNsdWRpbmcgY29tcGxleCBudW1iZXJzLFxuICAgIGluZmluaXR5IGFuZCBgYFMuTmFOYGAuIE90aGVyIG9iamVjdHMgc3VjaCBhcyBxdWF0ZXJuaW9ucyBkbyBub3RcbiAgICBoYXZlIHRoaXMga2luZC5cbiAgICBNb3N0IGBgRXhwcmBgIGFyZSBpbml0aWFsbHkgZGVzaWduZWQgdG8gcmVwcmVzZW50IHRoZSBudW1iZXIsIHNvXG4gICAgdGhpcyB3aWxsIGJlIHRoZSBtb3N0IGNvbW1vbiBraW5kIGluIFN5bVB5IGNvcmUuIEZvciBleGFtcGxlXG4gICAgYGBTeW1ib2woKWBgLCB3aGljaCByZXByZXNlbnRzIGEgc2NhbGFyLCBoYXMgdGhpcyBraW5kIGFzIGxvbmcgYXMgaXRcbiAgICBpcyBjb21tdXRhdGl2ZS5cbiAgICBOdW1iZXJzIGZvcm0gYSBmaWVsZC4gQW55IG9wZXJhdGlvbiBiZXR3ZWVuIG51bWJlci1raW5kIG9iamVjdHMgd2lsbFxuICAgIHJlc3VsdCB0aGlzIGtpbmQgYXMgd2VsbC5cbiAgICBFeGFtcGxlc1xuICAgID09PT09PT09XG4gICAgPj4+IGZyb20gc3ltcHkgaW1wb3J0IFMsIG9vLCBTeW1ib2xcbiAgICA+Pj4gUy5PbmUua2luZFxuICAgIE51bWJlcktpbmRcbiAgICA+Pj4gKC1vbykua2luZFxuICAgIE51bWJlcktpbmRcbiAgICA+Pj4gUy5OYU4ua2luZFxuICAgIE51bWJlcktpbmRcbiAgICBDb21tdXRhdGl2ZSBzeW1ib2wgYXJlIHRyZWF0ZWQgYXMgbnVtYmVyLlxuICAgID4+PiB4ID0gU3ltYm9sKCd4JylcbiAgICA+Pj4geC5raW5kXG4gICAgTnVtYmVyS2luZFxuICAgID4+PiBTeW1ib2woJ3knLCBjb21tdXRhdGl2ZT1GYWxzZSkua2luZFxuICAgIFVuZGVmaW5lZEtpbmRcbiAgICBPcGVyYXRpb24gYmV0d2VlbiBudW1iZXJzIHJlc3VsdHMgbnVtYmVyLlxuICAgID4+PiAoeCsxKS5raW5kXG4gICAgTnVtYmVyS2luZFxuICAgIFNlZSBBbHNvXG4gICAgPT09PT09PT1cbiAgICBzeW1weS5jb3JlLmV4cHIuRXhwci5pc19OdW1iZXIgOiBjaGVjayBpZiB0aGUgb2JqZWN0IGlzIHN0cmljdGx5XG4gICAgc3ViY2xhc3Mgb2YgYGBOdW1iZXJgYCBjbGFzcy5cbiAgICBzeW1weS5jb3JlLmV4cHIuRXhwci5pc19udW1iZXIgOiBjaGVjayBpZiB0aGUgb2JqZWN0IGlzIG51bWJlclxuICAgIHdpdGhvdXQgYW55IGZyZWUgc3ltYm9sLlxuICAgICovXG5cbiAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICAgICAgc3VwZXIoKTtcbiAgICB9XG5cbiAgICBzdGF0aWMgbmV3KCkge1xuICAgICAgICByZXR1cm4gS2luZC5uZXcoX051bWJlcktpbmQpO1xuICAgIH1cblxuICAgIHRvU3RyaW5nKCkge1xuICAgICAgICByZXR1cm4gXCJOdW1iZXJLaW5kXCI7XG4gICAgfVxufVxuXG5jb25zdCBOdW1iZXJLaW5kID0gX051bWJlcktpbmQubmV3KCk7XG5cbmNsYXNzIF9Cb29sZWFuS2luZCBleHRlbmRzIEtpbmQge1xuICAgIC8qXG4gICAgS2luZCBmb3IgYm9vbGVhbiBvYmplY3RzLlxuICAgIFN5bVB5J3MgYGBTLnRydWVgYCwgYGBTLmZhbHNlYGAsIGFuZCBidWlsdC1pbiBgYFRydWVgYCBhbmQgYGBGYWxzZWBgXG4gICAgaGF2ZSB0aGlzIGtpbmQuIEJvb2xlYW4gbnVtYmVyIGBgMWBgIGFuZCBgYDBgYCBhcmUgbm90IHJlbGV2ZW50LlxuICAgIEV4YW1wbGVzXG4gICAgPT09PT09PT1cbiAgICA+Pj4gZnJvbSBzeW1weSBpbXBvcnQgUywgUVxuICAgID4+PiBTLnRydWUua2luZFxuICAgIEJvb2xlYW5LaW5kXG4gICAgPj4+IFEuZXZlbigzKS5raW5kXG4gICAgQm9vbGVhbktpbmRcbiAgICAqL1xuXG4gICAgY29uc3RydWN0b3IoKSB7XG4gICAgICAgIHN1cGVyKCk7XG4gICAgfVxuXG4gICAgc3RhdGljIG5ldygpIHtcbiAgICAgICAgcmV0dXJuIEtpbmQubmV3KF9Cb29sZWFuS2luZCk7XG4gICAgfVxuXG4gICAgdG9TdHJpbmcoKSB7XG4gICAgICAgIHJldHVybiBcIkJvb2xlYW5LaW5kXCI7XG4gICAgfVxufVxuXG5jb25zdCBCb29sZWFuS2luZCA9IF9Cb29sZWFuS2luZC5uZXcoKTtcblxuXG5leHBvcnQge1VuZGVmaW5lZEtpbmQsIE51bWJlcktpbmQsIEJvb2xlYW5LaW5kfTtcbiIsICJjbGFzcyBwcmVvcmRlcl90cmF2ZXJzYWwge1xuICAgIC8qXG4gICAgRG8gYSBwcmUtb3JkZXIgdHJhdmVyc2FsIG9mIGEgdHJlZS5cbiAgICBUaGlzIGl0ZXJhdG9yIHJlY3Vyc2l2ZWx5IHlpZWxkcyBub2RlcyB0aGF0IGl0IGhhcyB2aXNpdGVkIGluIGEgcHJlLW9yZGVyXG4gICAgZmFzaGlvbi4gVGhhdCBpcywgaXQgeWllbGRzIHRoZSBjdXJyZW50IG5vZGUgdGhlbiBkZXNjZW5kcyB0aHJvdWdoIHRoZVxuICAgIHRyZWUgYnJlYWR0aC1maXJzdCB0byB5aWVsZCBhbGwgb2YgYSBub2RlJ3MgY2hpbGRyZW4ncyBwcmUtb3JkZXJcbiAgICB0cmF2ZXJzYWwuXG4gICAgRm9yIGFuIGV4cHJlc3Npb24sIHRoZSBvcmRlciBvZiB0aGUgdHJhdmVyc2FsIGRlcGVuZHMgb24gdGhlIG9yZGVyIG9mXG4gICAgLmFyZ3MsIHdoaWNoIGluIG1hbnkgY2FzZXMgY2FuIGJlIGFyYml0cmFyeS5cbiAgICBQYXJhbWV0ZXJzXG4gICAgPT09PT09PT09PVxuICAgIG5vZGUgOiBTeW1QeSBleHByZXNzaW9uXG4gICAgICAgIFRoZSBleHByZXNzaW9uIHRvIHRyYXZlcnNlLlxuICAgIGtleXMgOiAoZGVmYXVsdCBOb25lKSBzb3J0IGtleShzKVxuICAgICAgICBUaGUga2V5KHMpIHVzZWQgdG8gc29ydCBhcmdzIG9mIEJhc2ljIG9iamVjdHMuIFdoZW4gTm9uZSwgYXJncyBvZiBCYXNpY1xuICAgICAgICBvYmplY3RzIGFyZSBwcm9jZXNzZWQgaW4gYXJiaXRyYXJ5IG9yZGVyLiBJZiBrZXkgaXMgZGVmaW5lZCwgaXQgd2lsbFxuICAgICAgICBiZSBwYXNzZWQgYWxvbmcgdG8gb3JkZXJlZCgpIGFzIHRoZSBvbmx5IGtleShzKSB0byB1c2UgdG8gc29ydCB0aGVcbiAgICAgICAgYXJndW1lbnRzOyBpZiBgYGtleWBgIGlzIHNpbXBseSBUcnVlIHRoZW4gdGhlIGRlZmF1bHQga2V5cyBvZiBvcmRlcmVkXG4gICAgICAgIHdpbGwgYmUgdXNlZC5cbiAgICBZaWVsZHNcbiAgICA9PT09PT1cbiAgICBzdWJ0cmVlIDogU3ltUHkgZXhwcmVzc2lvblxuICAgICAgICBBbGwgb2YgdGhlIHN1YnRyZWVzIGluIHRoZSB0cmVlLlxuICAgIEV4YW1wbGVzXG4gICAgPT09PT09PT1cbiAgICA+Pj4gZnJvbSBzeW1weSBpbXBvcnQgcHJlb3JkZXJfdHJhdmVyc2FsLCBzeW1ib2xzXG4gICAgPj4+IHgsIHksIHogPSBzeW1ib2xzKCd4IHkgeicpXG4gICAgVGhlIG5vZGVzIGFyZSByZXR1cm5lZCBpbiB0aGUgb3JkZXIgdGhhdCB0aGV5IGFyZSBlbmNvdW50ZXJlZCB1bmxlc3Mga2V5XG4gICAgaXMgZ2l2ZW47IHNpbXBseSBwYXNzaW5nIGtleT1UcnVlIHdpbGwgZ3VhcmFudGVlIHRoYXQgdGhlIHRyYXZlcnNhbCBpc1xuICAgIHVuaXF1ZS5cbiAgICA+Pj4gbGlzdChwcmVvcmRlcl90cmF2ZXJzYWwoKHggKyB5KSp6LCBrZXlzPU5vbmUpKSAjIGRvY3Rlc3Q6ICtTS0lQXG4gICAgW3oqKHggKyB5KSwgeiwgeCArIHksIHksIHhdXG4gICAgPj4+IGxpc3QocHJlb3JkZXJfdHJhdmVyc2FsKCh4ICsgeSkqeiwga2V5cz1UcnVlKSlcbiAgICBbeiooeCArIHkpLCB6LCB4ICsgeSwgeCwgeV1cbiAgICAqL1xuXG4gICAgX3NraXBfZmxhZzogYW55O1xuICAgIF9wdDogYW55O1xuICAgIGNvbnN0cnVjdG9yKG5vZGU6IGFueSkge1xuICAgICAgICB0aGlzLl9za2lwX2ZsYWcgPSBmYWxzZTtcbiAgICAgICAgdGhpcy5fcHQgPSB0aGlzLl9wcmVvcmRlcl90cmF2ZXJzYWwobm9kZSk7XG4gICAgfVxuXG4gICAgKiBfcHJlb3JkZXJfdHJhdmVyc2FsKG5vZGU6IGFueSk6IGFueSB7XG4gICAgICAgIHlpZWxkIG5vZGU7XG4gICAgICAgIGlmICh0aGlzLl9za2lwX2ZsYWcpIHtcbiAgICAgICAgICAgIHRoaXMuX3NraXBfZmxhZyA9IGZhbHNlO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIGlmIChub2RlLmluc3RhbmNlb2ZCYXNpYykge1xuICAgICAgICAgICAgbGV0IGFyZ3M7XG4gICAgICAgICAgICBpZiAobm9kZS5fYXJnc2V0KSB7XG4gICAgICAgICAgICAgICAgYXJncyA9IG5vZGUuX2FyZ3NldDtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgYXJncyA9IG5vZGUuX2FyZ3M7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBmb3IgKGNvbnN0IGFyZyBvZiBhcmdzKSB7XG4gICAgICAgICAgICAgICAgZm9yIChjb25zdCB2YWwgb2YgdGhpcy5fcHJlb3JkZXJfdHJhdmVyc2FsKGFyZykpIHtcbiAgICAgICAgICAgICAgICAgICAgeWllbGQgdmFsO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIGlmIChTeW1ib2wuaXRlcmF0b3IgaW4gT2JqZWN0KG5vZGUpKSB7XG4gICAgICAgICAgICBmb3IgKGNvbnN0IGl0ZW0gb2Ygbm9kZSkge1xuICAgICAgICAgICAgICAgIGZvciAoY29uc3QgdmFsIG9mIHRoaXMuX3ByZW9yZGVyX3RyYXZlcnNhbChpdGVtKSkge1xuICAgICAgICAgICAgICAgICAgICB5aWVsZCB2YWw7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgYXNJdGVyKCkge1xuICAgICAgICBjb25zdCByZXM6IGFueVtdID0gW107XG4gICAgICAgIGZvciAoY29uc3QgaXRlbSBvZiB0aGlzLl9wdCkge1xuICAgICAgICAgICAgcmVzLnB1c2goaXRlbSk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHJlcztcbiAgICB9XG59XG5cbmV4cG9ydCB7cHJlb3JkZXJfdHJhdmVyc2FsfTtcbiIsICIvKlxuTm90YWJsZSBjaGFuZ2VzIG1hZGUgKGFuZCBub3Rlcyk6XG4tIEJhc2ljIHJld29ya2VkIHdpdGggY29uc3RydWN0b3Igc3lzdGVtXG4tIEJhc2ljIGhhbmRsZXMgT0JKRUNUIHByb3BlcnRpZXMsIE1hbmFnZWRQcm9wZXJ0aWVzIGhhbmRsZXMgQ0xBU1MgcHJvcGVydGllc1xuLSBTaW5jZSBfZXZhbF9pc19wcm9wZXJ0aWVzIGFyZSBub3Qgc3RhdGljLCBCYXNpYyBpcyBub3cgYXNzaWduZWQgdG8gY3JlYXRlIHRoZVxuICBjbGFzcyBwcm9wZXJ0eSBoYW5kbGVyIChhbmQgZG9lcyBzbyBvbmx5IG9uY2UgcGVyIG9iamVjdClcbi0gU29tZSBwcm9wZXJ0aWVzIG9mIEJhc2ljIChhbmQgc3ViY2xhc3NlcykgYXJlIG5vdyBzdGF0aWNcbi0gQXNpZGUgZnJvbSBzZXR0aW5nIG9iamVjdCBwcm9wZXJ0aWVzIGZyb20gX2Fzc3VtZV9kZWZpbmVkLCBCYXNpYyBub3cgYWxzb1xuICBzZXRzIHRoZSBzdGF0aWMgcHJvcGVydGllcyBvZiB0aGUgY2xhc3MgYXMgcHJvcGVydGllcyBmb3IgdGhlIG9iamVjdFxuKi9cblxuaW1wb3J0IHthc19wcm9wZXJ0eSwgbWFrZV9wcm9wZXJ0eSwgTWFuYWdlZFByb3BlcnRpZXMsIF9hc3N1bWVfZGVmaW5lZCwgU3RkRmFjdEtCfSBmcm9tIFwiLi9hc3N1bXB0aW9uc1wiO1xuaW1wb3J0IHtVdGlsLCBIYXNoRGljdCwgbWl4LCBiYXNlLCBIYXNoU2V0fSBmcm9tIFwiLi91dGlsaXR5XCI7XG5pbXBvcnQge1VuZGVmaW5lZEtpbmR9IGZyb20gXCIuL2tpbmRcIjtcbmltcG9ydCB7cHJlb3JkZXJfdHJhdmVyc2FsfSBmcm9tIFwiLi90cmF2ZXJzYWxcIjtcblxuXG5jb25zdCBfQmFzaWMgPSAoc3VwZXJjbGFzczogYW55KSA9PiBjbGFzcyBfQmFzaWMgZXh0ZW5kcyBzdXBlcmNsYXNzIHtcbiAgICAvKlxuICAgIEJhc2UgY2xhc3MgZm9yIGFsbCBTeW1QeSBvYmplY3RzLlxuICAgIE5vdGVzIGFuZCBjb252ZW50aW9uc1xuICAgID09PT09PT09PT09PT09PT09PT09PVxuICAgIDEpIEFsd2F5cyB1c2UgYGAuYXJnc2BgLCB3aGVuIGFjY2Vzc2luZyBwYXJhbWV0ZXJzIG9mIHNvbWUgaW5zdGFuY2U6XG4gICAgPj4+IGZyb20gc3ltcHkgaW1wb3J0IGNvdFxuICAgID4+PiBmcm9tIHN5bXB5LmFiYyBpbXBvcnQgeCwgeVxuICAgID4+PiBjb3QoeCkuYXJnc1xuICAgICh4LClcbiAgICA+Pj4gY290KHgpLmFyZ3NbMF1cbiAgICB4XG4gICAgPj4+ICh4KnkpLmFyZ3NcbiAgICAoeCwgeSlcbiAgICA+Pj4gKHgqeSkuYXJnc1sxXVxuICAgIHlcbiAgICAyKSBOZXZlciB1c2UgaW50ZXJuYWwgbWV0aG9kcyBvciB2YXJpYWJsZXMgKHRoZSBvbmVzIHByZWZpeGVkIHdpdGggYGBfYGApOlxuICAgID4+PiBjb3QoeCkuX2FyZ3MgICAgIyBkbyBub3QgdXNlIHRoaXMsIHVzZSBjb3QoeCkuYXJncyBpbnN0ZWFkXG4gICAgKHgsKVxuICAgIDMpICBCeSBcIlN5bVB5IG9iamVjdFwiIHdlIG1lYW4gc29tZXRoaW5nIHRoYXQgY2FuIGJlIHJldHVybmVkIGJ5XG4gICAgICAgIGBgc3ltcGlmeWBgLiAgQnV0IG5vdCBhbGwgb2JqZWN0cyBvbmUgZW5jb3VudGVycyB1c2luZyBTeW1QeSBhcmVcbiAgICAgICAgc3ViY2xhc3NlcyBvZiBCYXNpYy4gIEZvciBleGFtcGxlLCBtdXRhYmxlIG9iamVjdHMgYXJlIG5vdDpcbiAgICAgICAgPj4+IGZyb20gc3ltcHkgaW1wb3J0IEJhc2ljLCBNYXRyaXgsIHN5bXBpZnlcbiAgICAgICAgPj4+IEEgPSBNYXRyaXgoW1sxLCAyXSwgWzMsIDRdXSkuYXNfbXV0YWJsZSgpXG4gICAgICAgID4+PiBpc2luc3RhbmNlKEEsIEJhc2ljKVxuICAgICAgICBGYWxzZVxuICAgICAgICA+Pj4gQiA9IHN5bXBpZnkoQSlcbiAgICAgICAgPj4+IGlzaW5zdGFuY2UoQiwgQmFzaWMpXG4gICAgICAgIFRydWVcbiAgICAqL1xuXG4gICAgX19zbG90c19fID0gW1wiX21oYXNoXCIsIFwiX2FyZ3NcIiwgXCJfYXNzdW1wdGlvbnNcIl07XG4gICAgX2FyZ3M6IGFueVtdO1xuICAgIF9taGFzaDogTnVtYmVyIHwgdW5kZWZpbmVkO1xuICAgIF9hc3N1bXB0aW9uczogU3RkRmFjdEtCO1xuXG4gICAgLy8gVG8gYmUgb3ZlcnJpZGRlbiB3aXRoIFRydWUgaW4gdGhlIGFwcHJvcHJpYXRlIHN1YmNsYXNzZXNcbiAgICBzdGF0aWMgaXNfbnVtYmVyID0gZmFsc2U7XG4gICAgc3RhdGljIGlzX0F0b20gPSBmYWxzZTtcbiAgICBzdGF0aWMgaXNfU3ltYm9sID0gZmFsc2U7XG4gICAgc3RhdGljIGlzX3N5bWJvbCA9IGZhbHNlO1xuICAgIHN0YXRpYyBpc19JbmRleGVkID0gZmFsc2U7XG4gICAgc3RhdGljIGlzX0R1bW15ID0gZmFsc2U7XG4gICAgc3RhdGljIGlzX1dpbGQgPSBmYWxzZTtcbiAgICBzdGF0aWMgaXNfRnVuY3Rpb24gPSBmYWxzZTtcbiAgICBzdGF0aWMgaXNfQWRkID0gZmFsc2U7XG4gICAgc3RhdGljIGlzX011bCA9IGZhbHNlO1xuICAgIHN0YXRpYyBpc19Qb3cgPSBmYWxzZTtcbiAgICBzdGF0aWMgaXNfTnVtYmVyID0gZmFsc2U7XG4gICAgc3RhdGljIGlzX0Zsb2F0ID0gZmFsc2U7XG4gICAgc3RhdGljIGlzX1JhdGlvbmFsID0gZmFsc2U7XG4gICAgc3RhdGljIGlzX0ludGVnZXIgPSBmYWxzZTtcbiAgICBzdGF0aWMgaXNfTnVtYmVyU3ltYm9sID0gZmFsc2U7XG4gICAgc3RhdGljIGlzX09yZGVyID0gZmFsc2U7XG4gICAgc3RhdGljIGlzX0Rlcml2YXRpdmUgPSBmYWxzZTtcbiAgICBzdGF0aWMgaXNfUGllY2V3aXNlID0gZmFsc2U7XG4gICAgc3RhdGljIGlzX1BvbHkgPSBmYWxzZTtcbiAgICBzdGF0aWMgaXNfQWxnZWJyYWljTnVtYmVyID0gZmFsc2U7XG4gICAgc3RhdGljIGlzX1JlbGF0aW9uYWwgPSBmYWxzZTtcbiAgICBzdGF0aWMgaXNfRXF1YWxpdHkgPSBmYWxzZTtcbiAgICBzdGF0aWMgaXNfQm9vbGVhbiA9IGZhbHNlO1xuICAgIHN0YXRpYyBpc19Ob3QgPSBmYWxzZTtcbiAgICBzdGF0aWMgaXNfTWF0cml4ID0gZmFsc2U7XG4gICAgc3RhdGljIGlzX1ZlY3RvciA9IGZhbHNlO1xuICAgIHN0YXRpYyBpc19Qb2ludCA9IGZhbHNlO1xuICAgIHN0YXRpYyBpc19NYXRBZGQgPSBmYWxzZTtcbiAgICBzdGF0aWMgaXNfTWF0TXVsID0gZmFsc2U7XG4gICAgc3RhdGljIGlzX25lZ2F0aXZlOiBib29sZWFuIHwgdW5kZWZpbmVkO1xuICAgIHN0YXRpYyBpc19jb21tdXRhdGl2ZTogYm9vbGVhbiB8IHVuZGVmaW5lZDtcblxuICAgIHN0YXRpYyBraW5kID0gVW5kZWZpbmVkS2luZDtcbiAgICBzdGF0aWMgYWxsX3VuaXF1ZV9wcm9wczogSGFzaFNldCA9IG5ldyBIYXNoU2V0KCk7XG5cbiAgICBjb25zdHJ1Y3RvciguLi5hcmdzOiBhbnkpIHtcbiAgICAgICAgc3VwZXIoKTtcbiAgICAgICAgY29uc3QgY2xzOiBhbnkgPSB0aGlzLmNvbnN0cnVjdG9yO1xuICAgICAgICB0aGlzLl9hc3N1bXB0aW9ucyA9IGNscy5kZWZhdWx0X2Fzc3VtcHRpb25zLnN0ZGNsb25lKCk7XG4gICAgICAgIHRoaXMuX21oYXNoID0gdW5kZWZpbmVkO1xuICAgICAgICB0aGlzLl9hcmdzID0gYXJncztcbiAgICAgICAgdGhpcy5hc3NpZ25Qcm9wcygpO1xuICAgIH1cblxuICAgIGFzc2lnblByb3BzKCkge1xuICAgICAgICBjb25zdCBjbHM6IGFueSA9IHRoaXMuY29uc3RydWN0b3I7XG4gICAgICAgIC8vIENyZWF0ZSBhIGRpY3Rpb25hcnkgdG8gaGFuZGxlIHRoZSBjdXJyZW50IHByb3BlcnRpZXMgb2YgdGhlIGNsYXNzXG4gICAgICAgIC8vIE9ubHkgZXZ1YXRlZCBvbmNlIHBlciBjbGFzc1xuICAgICAgICBpZiAodHlwZW9mIGNscy5fcHJvcF9oYW5kbGVyID09PSBcInVuZGVmaW5lZFwiKSB7XG4gICAgICAgICAgICBjbHMuX3Byb3BfaGFuZGxlciA9IG5ldyBIYXNoRGljdCgpO1xuICAgICAgICAgICAgZm9yIChjb25zdCBrIG9mIF9hc3N1bWVfZGVmaW5lZC50b0FycmF5KCkpIHtcbiAgICAgICAgICAgICAgICBjb25zdCBtZXRoMSA9IFwiX2V2YWxfaXNfXCIgKyBrO1xuICAgICAgICAgICAgICAgIGlmICh0aGlzW21ldGgxXSkge1xuICAgICAgICAgICAgICAgICAgICBjbHMuX3Byb3BfaGFuZGxlci5hZGQoaywgdGhpc1ttZXRoMV0pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICB0aGlzLl9wcm9wX2hhbmRsZXIgPSBjbHMuX3Byb3BfaGFuZGxlci5jb3B5KCk7XG4gICAgICAgIGZvciAoY29uc3QgZmFjdCBvZiBfYXNzdW1lX2RlZmluZWQudG9BcnJheSgpKSB7XG4gICAgICAgICAgICBtYWtlX3Byb3BlcnR5KHRoaXMsIGZhY3QpO1xuICAgICAgICB9XG4gICAgICAgIC8vIEFkZCBtaXNjLiBzdGF0aWMgcHJvcGVydGllcyBvZiBjbGFzcyBhcyBvYmplY3QgcHJvcGVydGllc1xuICAgICAgICBjb25zdCBvdGhlclByb3BzID0gbmV3IEhhc2hTZXQoT2JqZWN0LmdldE93blByb3BlcnR5TmFtZXMoY2xzKS5maWx0ZXIoXG4gICAgICAgICAgICBwcm9wID0+IHByb3AuaW5jbHVkZXMoXCJpc19cIikgJiYgIV9hc3N1bWVfZGVmaW5lZC5oYXMocHJvcC5yZXBsYWNlKFwiaXNfXCIsIFwiXCIpKSkpO1xuICAgICAgICBmb3IgKGNvbnN0IG1pc2Nwcm9wIG9mIG90aGVyUHJvcHMudG9BcnJheSgpKSB7XG4gICAgICAgICAgICB0aGlzW21pc2Nwcm9wXSA9ICgpID0+IGNsc1ttaXNjcHJvcF07XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBfX2dldG5ld2FyZ3NfXygpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX2FyZ3M7XG4gICAgfVxuXG4gICAgX19nZXRzdGF0ZV9fKCk6IGFueSB7XG4gICAgICAgIHJldHVybiB1bmRlZmluZWQ7XG4gICAgfVxuXG4gICAgaGFzaCgpIHtcbiAgICAgICAgaWYgKHR5cGVvZiB0aGlzLl9taGFzaCA9PT0gXCJ1bmRlZmluZWRcIikge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuY29uc3RydWN0b3IubmFtZSArIHRoaXMuaGFzaEtleSgpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0aGlzLl9taGFzaDtcbiAgICB9XG5cbiAgICAvLyBiYW5kYWlkIHNvbHV0aW9uIGZvciBpbnN0YW5jZW9mIGlzc3VlIC0gc3RpbGwgbmVlZCB0byBmaXhcbiAgICBpbnN0YW5jZW9mQmFzaWMoKSB7XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cblxuICAgIGFzc3VtcHRpb25zMCgpIHtcbiAgICAgICAgLypcbiAgICAgICAgUmV0dXJuIG9iamVjdCBgdHlwZWAgYXNzdW1wdGlvbnMuXG4gICAgICAgIEZvciBleGFtcGxlOlxuICAgICAgICAgIFN5bWJvbCgneCcsIHJlYWw9VHJ1ZSlcbiAgICAgICAgICBTeW1ib2woJ3gnLCBpbnRlZ2VyPVRydWUpXG4gICAgICAgIGFyZSBkaWZmZXJlbnQgb2JqZWN0cy4gSW4gb3RoZXIgd29yZHMsIGJlc2lkZXMgUHl0aG9uIHR5cGUgKFN5bWJvbCBpblxuICAgICAgICB0aGlzIGNhc2UpLCB0aGUgaW5pdGlhbCBhc3N1bXB0aW9ucyBhcmUgYWxzbyBmb3JtaW5nIHRoZWlyIHR5cGVpbmZvLlxuICAgICAgICBFeGFtcGxlc1xuICAgICAgICA9PT09PT09PVxuICAgICAgICA+Pj4gZnJvbSBzeW1weSBpbXBvcnQgU3ltYm9sXG4gICAgICAgID4+PiBmcm9tIHN5bXB5LmFiYyBpbXBvcnQgeFxuICAgICAgICA+Pj4geC5hc3N1bXB0aW9uczBcbiAgICAgICAgeydjb21tdXRhdGl2ZSc6IFRydWV9XG4gICAgICAgID4+PiB4ID0gU3ltYm9sKFwieFwiLCBwb3NpdGl2ZT1UcnVlKVxuICAgICAgICA+Pj4geC5hc3N1bXB0aW9uczBcbiAgICAgICAgeydjb21tdXRhdGl2ZSc6IFRydWUsICdjb21wbGV4JzogVHJ1ZSwgJ2V4dGVuZGVkX25lZ2F0aXZlJzogRmFsc2UsXG4gICAgICAgICAnZXh0ZW5kZWRfbm9ubmVnYXRpdmUnOiBUcnVlLCAnZXh0ZW5kZWRfbm9ucG9zaXRpdmUnOiBGYWxzZSxcbiAgICAgICAgICdleHRlbmRlZF9ub256ZXJvJzogVHJ1ZSwgJ2V4dGVuZGVkX3Bvc2l0aXZlJzogVHJ1ZSwgJ2V4dGVuZGVkX3JlYWwnOlxuICAgICAgICAgVHJ1ZSwgJ2Zpbml0ZSc6IFRydWUsICdoZXJtaXRpYW4nOiBUcnVlLCAnaW1hZ2luYXJ5JzogRmFsc2UsXG4gICAgICAgICAnaW5maW5pdGUnOiBGYWxzZSwgJ25lZ2F0aXZlJzogRmFsc2UsICdub25uZWdhdGl2ZSc6IFRydWUsXG4gICAgICAgICAnbm9ucG9zaXRpdmUnOiBGYWxzZSwgJ25vbnplcm8nOiBUcnVlLCAncG9zaXRpdmUnOiBUcnVlLCAncmVhbCc6XG4gICAgICAgICBUcnVlLCAnemVybyc6IEZhbHNlfVxuICAgICAgICAqL1xuICAgICAgICByZXR1cm4ge307XG4gICAgfVxuXG4gICAgaGFzaEtleSgpIHtcbiAgICAgICAgLyogUmV0dXJuIGEgdHVwbGUgb2YgaW5mb3JtYXRpb24gYWJvdXQgc2VsZiB0aGF0IGNhbiBiZSB1c2VkIHRvXG4gICAgICAgIGNvbXB1dGUgdGhlIGhhc2guIElmIGEgY2xhc3MgZGVmaW5lcyBhZGRpdGlvbmFsIGF0dHJpYnV0ZXMsXG4gICAgICAgIGxpa2UgYGBuYW1lYGAgaW4gU3ltYm9sLCB0aGVuIHRoaXMgbWV0aG9kIHNob3VsZCBiZSB1cGRhdGVkXG4gICAgICAgIGFjY29yZGluZ2x5IHRvIHJldHVybiBzdWNoIHJlbGV2YW50IGF0dHJpYnV0ZXMuXG4gICAgICAgIERlZmluaW5nIG1vcmUgdGhhbiBfaGFzaGFibGVfY29udGVudCBpcyBuZWNlc3NhcnkgaWYgX19lcV9fIGhhc1xuICAgICAgICBiZWVuIGRlZmluZWQgYnkgYSBjbGFzcy4gU2VlIG5vdGUgYWJvdXQgdGhpcyBpbiBCYXNpYy5fX2VxX18uKi9cblxuICAgICAgICByZXR1cm4gdGhpcy5fYXJncztcbiAgICB9XG5cbiAgICBzdGF0aWMgY21wKHNlbGY6IGFueSwgb3RoZXI6IGFueSk6IGFueSB7XG4gICAgICAgIC8qXG4gICAgICAgIFJldHVybiAtMSwgMCwgMSBpZiB0aGUgb2JqZWN0IGlzIHNtYWxsZXIsIGVxdWFsLCBvciBncmVhdGVyIHRoYW4gb3RoZXIuXG4gICAgICAgIE5vdCBpbiB0aGUgbWF0aGVtYXRpY2FsIHNlbnNlLiBJZiB0aGUgb2JqZWN0IGlzIG9mIGEgZGlmZmVyZW50IHR5cGVcbiAgICAgICAgZnJvbSB0aGUgXCJvdGhlclwiIHRoZW4gdGhlaXIgY2xhc3NlcyBhcmUgb3JkZXJlZCBhY2NvcmRpbmcgdG9cbiAgICAgICAgdGhlIHNvcnRlZF9jbGFzc2VzIGxpc3QuXG4gICAgICAgIEV4YW1wbGVzXG4gICAgICAgID09PT09PT09XG4gICAgICAgID4+PiBmcm9tIHN5bXB5LmFiYyBpbXBvcnQgeCwgeVxuICAgICAgICA+Pj4geC5jb21wYXJlKHkpXG4gICAgICAgIC0xXG4gICAgICAgID4+PiB4LmNvbXBhcmUoeClcbiAgICAgICAgMFxuICAgICAgICA+Pj4geS5jb21wYXJlKHgpXG4gICAgICAgIDFcbiAgICAgICAgKi9cbiAgICAgICAgaWYgKHNlbGYgPT09IG90aGVyKSB7XG4gICAgICAgICAgICByZXR1cm4gMDtcbiAgICAgICAgfVxuICAgICAgICBjb25zdCBuMSA9IHNlbGYuY29uc3RydWN0b3IubmFtZTtcbiAgICAgICAgY29uc3QgbjIgPSBvdGhlci5jb25zdHJ1Y3Rvci5uYW1lO1xuICAgICAgICBpZiAobjEgJiYgbjIpIHtcbiAgICAgICAgICAgIHJldHVybiAobjEgPiBuMiBhcyB1bmtub3duIGFzIG51bWJlcikgLSAobjEgPCBuMiBhcyB1bmtub3duIGFzIG51bWJlcik7XG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCBzdCA9IHNlbGYuX2hhc2hhYmxlX2NvbnRlbnQoKTtcbiAgICAgICAgY29uc3Qgb3QgPSBvdGhlci5faGFzaGFibGVfY29udGVudCgpO1xuICAgICAgICBpZiAoc3QgJiYgb3QpIHtcbiAgICAgICAgICAgIHJldHVybiAoc3QubGVuZ3RoID4gb3QubGVuZ3RoIGFzIHVua25vd24gYXMgbnVtYmVyKSAtIChzdC5sZW5ndGggPCBvdC5sZW5ndGggYXMgdW5rbm93biBhcyBudW1iZXIpO1xuICAgICAgICB9XG4gICAgICAgIGZvciAoY29uc3QgZWxlbSBvZiBVdGlsLnppcChzdCwgb3QpKSB7XG4gICAgICAgICAgICBjb25zdCBsID0gZWxlbVswXTtcbiAgICAgICAgICAgIGNvbnN0IHIgPSBlbGVtWzFdO1xuICAgICAgICAgICAgLy8gISEhIHNraXBwaW5nIGZyb3plbnNldCBzdHVmZlxuICAgICAgICAgICAgbGV0IGM7XG4gICAgICAgICAgICBpZiAobCBpbnN0YW5jZW9mIEJhc2ljKSB7XG4gICAgICAgICAgICAgICAgYyA9IGwuY21wKHIpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBjID0gKGwgPiByIGFzIHVua25vd24gYXMgbnVtYmVyKSAtIChsIDwgciBhcyB1bmtub3duIGFzIG51bWJlcik7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoYykge1xuICAgICAgICAgICAgICAgIHJldHVybiBjO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiAwO1xuICAgIH1cblxuICAgIF9jb25zdHJ1Y3Rvcl9wb3N0cHJvY2Vzc29yX21hcHBpbmc6IFJlY29yZDxhbnksIGFueT4gPSB7fTtcblxuICAgIF9leGVjX2NvbnN0cnVjdG9yX3Bvc3Rwcm9jZXNzb3JzKG9iajogYW55KSB7XG4gICAgICAgIGNvbnN0IGNsc25hbWUgPSB0aGlzLmNvbnN0cnVjdG9yLm5hbWU7XG4gICAgICAgIGNvbnN0IHBvc3Rwcm9jZXNzb3JzID0gbmV3IEhhc2hEaWN0KCk7XG4gICAgICAgIC8vICEhISBmb3IgbG9vcCBub3QgaW1wbGVtZW50ZWQgLSBjb21wbGljYXRlZCB0byByZWNyZWF0ZVxuICAgICAgICBmb3IgKGNvbnN0IGYgb2YgcG9zdHByb2Nlc3NvcnMuZ2V0KGNsc25hbWUsIFtdKSkge1xuICAgICAgICAgICAgb2JqID0gZihvYmopO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBvYmo7XG4gICAgfVxuXG4gICAgX2V2YWxfc3VicyhvbGQ6IGFueSwgX25ldzogYW55KTogYW55IHtcbiAgICAgICAgLy8gZG9uJ3QgbmVlZCBhbnkgb3RoZXIgdXRpbGl0aWVzIHVudGlsIHdlIGRvIG1vcmUgY29tcGxpY2F0ZWQgc3Vic1xuICAgICAgICByZXR1cm4gdW5kZWZpbmVkO1xuICAgIH1cblxuICAgIF9hcmVzYW1lKGE6IGFueSwgYjogYW55KSB7XG4gICAgICAgIGlmIChhLmlzX051bWJlciAmJiBiLmlzX051bWJlcikge1xuICAgICAgICAgICAgcmV0dXJuIGEgPT09IGIgJiYgYS5jb25zdHJ1Y3Rvci5uYW1lID09PSBiLmNvbnN0cnVjdG9yLm5hbWU7XG4gICAgICAgIH1cbiAgICAgICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5ldy1jYXBcbiAgICAgICAgZm9yIChjb25zdCBpdGVtIG9mIFV0aWwuemlwKG5ldyBwcmVvcmRlcl90cmF2ZXJzYWwoYSkuYXNJdGVyKCksIG5ldyBwcmVvcmRlcl90cmF2ZXJzYWwoYikuYXNJdGVyKCkpKSB7XG4gICAgICAgICAgICBjb25zdCBpID0gaXRlbVswXTtcbiAgICAgICAgICAgIGNvbnN0IGogPSBpdGVtWzFdO1xuICAgICAgICAgICAgaWYgKGkgIT09IGogfHwgdHlwZW9mIGkgIT09IHR5cGVvZiBqKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cblxuICAgIHN1YnMoLi4uYXJnczogYW55KSB7XG4gICAgICAgIGxldCBzZXF1ZW5jZTtcbiAgICAgICAgaWYgKGFyZ3MubGVuZ3RoID09PSAxKSB7XG4gICAgICAgICAgICBzZXF1ZW5jZSA9IGFyZ3NbMF07XG4gICAgICAgICAgICBpZiAoc2VxdWVuY2UgaW5zdGFuY2VvZiBIYXNoU2V0KSB7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKHNlcXVlbmNlIGluc3RhbmNlb2YgSGFzaERpY3QpIHtcbiAgICAgICAgICAgICAgICBzZXF1ZW5jZSA9IHNlcXVlbmNlLmVudHJpZXMoKTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoU3ltYm9sLml0ZXJhdG9yIGluIE9iamVjdChzZXF1ZW5jZSkpIHtcbiAgICAgICAgICAgICAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbWF4LWxlblxuICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcIldoZW4gYSBzaW5nbGUgYXJndW1lbnQgaXMgcGFzc2VkIHRvIHN1YnMgaXQgc2hvdWxkIGJlIGEgZGljdGlvbmFyeSBvZiBvbGQ6IG5ldyBwYWlycyBvciBhbiBpdGVyYWJsZSBvZiAob2xkLCBuZXcpIHR1cGxlc1wiKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIGlmIChhcmdzLmxlbmd0aCA9PT0gMikge1xuICAgICAgICAgICAgc2VxdWVuY2UgPSBbYXJnc107XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJzdWIgYWNjZXB0cyAxIG9yIDIgYXJnc1wiKTtcbiAgICAgICAgfVxuICAgICAgICBsZXQgcnYgPSB0aGlzO1xuICAgICAgICBmb3IgKGNvbnN0IGl0ZW0gb2Ygc2VxdWVuY2UpIHtcbiAgICAgICAgICAgIGNvbnN0IG9sZCA9IGl0ZW1bMF07XG4gICAgICAgICAgICBjb25zdCBfbmV3ID0gaXRlbVsxXTtcbiAgICAgICAgICAgIHJ2ID0gcnYuX3N1YnMob2xkLCBfbmV3KTtcbiAgICAgICAgICAgIGlmICghKHJ2IGluc3RhbmNlb2YgQmFzaWMpKSB7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHJ2O1xuICAgIH1cblxuICAgIF9zdWJzKG9sZDogYW55LCBfbmV3OiBhbnkpIHtcbiAgICAgICAgZnVuY3Rpb24gZmFsbGJhY2soY2xzOiBhbnksIG9sZDogYW55LCBfbmV3OiBhbnkpIHtcbiAgICAgICAgICAgIGxldCBoaXQgPSBmYWxzZTtcbiAgICAgICAgICAgIGNvbnN0IGFyZ3MgPSBjbHMuX2FyZ3M7XG4gICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGFyZ3MubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgICBsZXQgYXJnID0gYXJnc1tpXTtcbiAgICAgICAgICAgICAgICBpZiAoIShhcmcuX2V2YWxfc3VicykpIHtcbiAgICAgICAgICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGFyZyA9IGFyZy5fc3VicyhvbGQsIF9uZXcpO1xuICAgICAgICAgICAgICAgIGlmICghKGNscy5fYXJlc2FtZShhcmcsIGFyZ3NbaV0pKSkge1xuICAgICAgICAgICAgICAgICAgICBoaXQgPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICBhcmdzW2ldID0gYXJnO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChoaXQpIHtcbiAgICAgICAgICAgICAgICBsZXQgcnY7XG4gICAgICAgICAgICAgICAgaWYgKGNscy5jb25zdHJ1Y3Rvci5uYW1lID09PSBcIk11bFwiIHx8IGNscy5jb25zdHJ1Y3Rvci5uYW1lID09PSBcIkFkZFwiKSB7XG4gICAgICAgICAgICAgICAgICAgIHJ2ID0gbmV3IGNscy5jb25zdHJ1Y3Rvcih0cnVlLCB0cnVlLCAuLi5hcmdzKTtcbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKGNscy5jb25zdHJ1Y3Rvci5uYW1lID09PSBcIlBvd1wiKSB7XG4gICAgICAgICAgICAgICAgICAgIHJ2ID0gbmV3IGNscy5jb25zdHJ1Y3RvciguLi5hcmdzKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgcmV0dXJuIHJ2O1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIGNscztcbiAgICAgICAgfVxuICAgICAgICBpZiAodGhpcy5fYXJlc2FtZSh0aGlzLCBvbGQpKSB7XG4gICAgICAgICAgICByZXR1cm4gX25ldztcbiAgICAgICAgfVxuXG4gICAgICAgIGxldCBydiA9IHRoaXMuX2V2YWxfc3VicyhvbGQsIF9uZXcpO1xuICAgICAgICBpZiAodHlwZW9mIHJ2ID09PSBcInVuZGVmaW5lZFwiKSB7XG4gICAgICAgICAgICBydiA9IGZhbGxiYWNrKHRoaXMsIG9sZCwgX25ldyk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHJ2O1xuICAgIH1cbn07XG5cbi8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBuZXctY2FwXG5jb25zdCBCYXNpYyA9IF9CYXNpYyhPYmplY3QpO1xuTWFuYWdlZFByb3BlcnRpZXMucmVnaXN0ZXIoQmFzaWMpO1xuXG5jb25zdCBBdG9tID0gKHN1cGVyY2xhc3M6IGFueSkgPT4gY2xhc3MgQXRvbSBleHRlbmRzIG1peChiYXNlKS53aXRoKF9CYXNpYykge1xuICAgIC8qXG4gICAgQSBwYXJlbnQgY2xhc3MgZm9yIGF0b21pYyB0aGluZ3MuIEFuIGF0b20gaXMgYW4gZXhwcmVzc2lvbiB3aXRoIG5vIHN1YmV4cHJlc3Npb25zLlxuICAgIEV4YW1wbGVzXG4gICAgPT09PT09PT1cbiAgICBTeW1ib2wsIE51bWJlciwgUmF0aW9uYWwsIEludGVnZXIsIC4uLlxuICAgIEJ1dCBub3Q6IEFkZCwgTXVsLCBQb3csIC4uLlxuICAgICovXG5cbiAgICBzdGF0aWMgaXNfQXRvbSA9IHRydWU7XG5cbiAgICBfX3Nsb3RzX186IGFueVtdID0gW107XG5cbiAgICBtYXRjaGVzKGV4cHI6IGFueSwgcmVwbF9kaWN0OiBIYXNoRGljdCA9IHVuZGVmaW5lZCwgb2xkOiBhbnkgPSBmYWxzZSkge1xuICAgICAgICBpZiAodGhpcyA9PT0gZXhwcikge1xuICAgICAgICAgICAgaWYgKHR5cGVvZiByZXBsX2RpY3QgPT09IFwidW5kZWZpbmVkXCIpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gbmV3IEhhc2hEaWN0KCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gcmVwbF9kaWN0LmNvcHkoKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHhyZXBsYWNlKHJ1bGU6IGFueSwgaGFjazI6IGFueSA9IGZhbHNlKSB7XG4gICAgICAgIHJldHVybiBydWxlLmdldCh0aGlzKTtcbiAgICB9XG5cbiAgICBkb2l0KC4uLmhpbnRzOiBhbnkpIHtcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxufTtcblxuLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5ldy1jYXBcbmNvbnN0IF9BdG9taWNFeHByID0gQXRvbShPYmplY3QpO1xuTWFuYWdlZFByb3BlcnRpZXMucmVnaXN0ZXIoX0F0b21pY0V4cHIpO1xuXG5leHBvcnQge19CYXNpYywgQmFzaWMsIEF0b20sIF9BdG9taWNFeHByfTtcbiIsICIvKlxuTm90YWJsZSBjaGFuZ2VzIG1hZGUgKGFuZCBub3Rlcylcbi0gUmV3b3JrZWQgU2luZ2xldG9uIHRvIHVzZSBhIHJlZ2lzdHJ5IHN5c3RlbSB1c2luZyBhIHN0YXRpYyBkaWN0aW9uYXJ5XG4tIFJlZ2lzdGVycyBudW1iZXIgb2JqZWN0cyBhcyB0aGV5IGFyZSB1c2VkXG4qL1xuXG4vKiBlc2xpbnQtZGlzYWJsZSBuZXctY2FwICovXG5pbXBvcnQge01hbmFnZWRQcm9wZXJ0aWVzfSBmcm9tIFwiLi9hc3N1bXB0aW9uc1wiO1xuXG5jbGFzcyBTaW5nbGV0b24ge1xuICAgIHN0YXRpYyByZWdpc3RyeTogUmVjb3JkPGFueSwgYW55PiA9IHt9O1xuXG4gICAgc3RhdGljIHJlZ2lzdGVyKG5hbWU6IHN0cmluZywgY2xzOiBhbnkpIHtcbiAgICAgICAgTWFuYWdlZFByb3BlcnRpZXMucmVnaXN0ZXIoY2xzKTtcbiAgICAgICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5ldy1jYXBcbiAgICAgICAgU2luZ2xldG9uLnJlZ2lzdHJ5W25hbWVdID0gbmV3IGNscygpO1xuICAgIH1cbn1cblxuY29uc3QgUzogYW55ID0gbmV3IFNpbmdsZXRvbigpO1xuXG5cbmV4cG9ydCB7UywgU2luZ2xldG9ufTtcbiIsICIvKlxuTmV3IGNsYXNzIGdsb2JhbFxuSGVscHMgdG8gYXZvaWQgY3ljbGljYWwgaW1wb3J0cyBieSBzdG9yaW5nIGNvbnN0cnVjdG9ycyBhbmQgZnVuY3Rpb25zIHdoaWNoXG5jYW4gYmUgYWNjZXNzZWQgYW55d2hlcmVcblxuTm90ZTogc3RhdGljIG5ldyBtZXRob2RzIGFyZSBjcmVhdGVkIGluIHRoZSBjbGFzc2VzIHRvIGJlIHJlZ2lzdGVyZWQsIGFuZCB0aG9zZVxubWV0aG9kcyBhcmUgYWRkZWQgaGVyZVxuKi9cblxuZXhwb3J0IGNsYXNzIEdsb2JhbCB7XG4gICAgc3RhdGljIGNvbnN0cnVjdG9yczogUmVjb3JkPHN0cmluZywgYW55PiA9IHt9O1xuICAgIHN0YXRpYyBmdW5jdGlvbnM6IFJlY29yZDxzdHJpbmcsIGFueT4gPSB7fTtcblxuICAgIHN0YXRpYyBjb25zdHJ1Y3QoY2xhc3NuYW1lOiBzdHJpbmcsIC4uLmFyZ3M6IGFueVtdKSB7XG4gICAgICAgIGNvbnN0IGNvbnN0cnVjdG9yID0gR2xvYmFsLmNvbnN0cnVjdG9yc1tjbGFzc25hbWVdO1xuICAgICAgICByZXR1cm4gY29uc3RydWN0b3IoLi4uYXJncyk7XG4gICAgfVxuXG4gICAgc3RhdGljIHJlZ2lzdGVyKGNsczogc3RyaW5nLCBjb25zdHJ1Y3RvcjogYW55KSB7XG4gICAgICAgIEdsb2JhbC5jb25zdHJ1Y3RvcnNbY2xzXSA9IGNvbnN0cnVjdG9yO1xuICAgIH1cblxuICAgIHN0YXRpYyByZWdpc3RlcmZ1bmMobmFtZTogc3RyaW5nLCBmdW5jOiBhbnkpIHtcbiAgICAgICAgR2xvYmFsLmZ1bmN0aW9uc1tuYW1lXSA9IGZ1bmM7XG4gICAgfVxuXG4gICAgc3RhdGljIGV2YWxmdW5jKG5hbWU6IHN0cmluZywgLi4uYXJnczogYW55W10pIHtcbiAgICAgICAgY29uc3QgZnVuYyA9IEdsb2JhbC5mdW5jdGlvbnNbbmFtZV07XG4gICAgICAgIHJldHVybiBmdW5jKC4uLmFyZ3MpO1xuICAgIH1cbn1cbiIsICIvKiBlc2xpbnQtZGlzYWJsZSBuby11bnVzZWQtdmFycyAqL1xuLyogTWlzY2VsbGFuZW91cyBzdHVmZiB0aGF0IGRvZXMgbm90IHJlYWxseSBmaXQgYW55d2hlcmUgZWxzZSAqL1xuXG4vKlxuXG5Ob3RhYmxlIGNoYW5nZXMgbWFkZSAoV0IgYW5kIEdNKTpcbi0gRmlsbGRlZGVudCBhbmQgYXNfaW50IGFyZSByZXdyaXR0ZW4gdG8gaW5jbHVkZSB0aGUgc2FtZSBmdW5jdGlvbmFsaXR5IHdpdGhcbiAgZGlmZmVyZW50IG1ldGhvZG9sb2d5XG4tIE1hbnkgZnVuY3Rpb25zIGFyZSBub3QgeWV0IGltcGxlbWVudGVkIGFuZCB3aWxsIGJlIGNvbXBsZXRlZCBhcyB3ZSBmaW5kIHRoZW1cbiAgbmVjZXNzYXJ5XG59XG5cbiovXG5cblxuY2xhc3MgVW5kZWNpZGFibGUgZXh0ZW5kcyBFcnJvciB7XG4gICAgLy8gYW4gZXJyb3IgdG8gYmUgcmFpc2VkIHdoZW4gYSBkZWNpc2lvbiBjYW5ub3QgYmUgbWFkZSBkZWZpbml0aXZlbHlcbiAgICAvLyB3aGVyZSBhIGRlZmluaXRpdmUgYW5zd2VyIGlzIG5lZWRlZFxufVxuXG4vKlxuZnVuY3Rpb24gZmlsbGRlZGVudChzOiBzdHJpbmcsIHc6IG51bWJlciA9IDcwKTogc3RyaW5nIHtcblxuICAgIC8vIHJlbW92ZSBlbXB0eSBibGFuayBsaW5lc1xuICAgIGxldCBzdHIgPSBzLnJlcGxhY2UoL15cXHMqXFxuL2dtLCBcIlwiKTtcbiAgICAvLyBkZWRlbnRcbiAgICBzdHIgPSBkZWRlbnQoc3RyKTtcbiAgICAvLyB3cmFwXG4gICAgY29uc3QgYXJyID0gc3RyLnNwbGl0KFwiIFwiKTtcbiAgICBsZXQgcmVzID0gXCJcIjtcbiAgICBsZXQgbGluZWxlbmd0aCA9IDA7XG4gICAgZm9yIChjb25zdCB3b3JkIG9mIGFycikge1xuICAgICAgICBpZiAobGluZWxlbmd0aCA8PSB3ICsgd29yZC5sZW5ndGgpIHtcbiAgICAgICAgICAgIHJlcyArPSB3b3JkO1xuICAgICAgICAgICAgbGluZWxlbmd0aCArPSB3b3JkLmxlbmd0aDtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJlcyArPSBcIlxcblwiO1xuICAgICAgICAgICAgbGluZWxlbmd0aCA9IDA7XG4gICAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIHJlcztcbn1cbiovXG5cblxuZnVuY3Rpb24gc3RybGluZXMoczogc3RyaW5nLCBjOiBudW1iZXIgPSA2NCwgc2hvcnQ9ZmFsc2UpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoXCJzdHJsaW5lcyBpcyBub3QgeWV0IGltcGxlbWVudGVkXCIpO1xufVxuXG5mdW5jdGlvbiByYXdsaW5lcyhzOiBzdHJpbmcpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoXCJyYXdsaW5lcyBpcyBub3QgeWV0IGltcGxlbWVudGVkXCIpO1xufVxuXG5mdW5jdGlvbiBkZWJ1Z19kZWNvcmF0b3IoZnVuYzogYW55KSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKFwiZGVidWdfZGVjb3JhdG9yIGlzIG5vdCB5ZXQgaW1wbGVtZW50ZWRcIik7XG59XG5cbmZ1bmN0aW9uIGRlYnVnKC4uLmFyZ3M6IGFueSkge1xuICAgIHRocm93IG5ldyBFcnJvcihcImRlYnVnIGlzIG5vdCB5ZXQgaW1wbGVtZW50ZWRcIik7XG59XG5cbmZ1bmN0aW9uIGZpbmRfZXhlY3V0YWJsZShleGVjdXRhYmxlOiBhbnksIHBhdGg6IGFueT11bmRlZmluZWQpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoXCJmaW5kX2V4ZWN1dGFibGUgaXMgbm90IHlldCBpbXBsZW1lbnRlZFwiKTtcbn1cblxuZnVuY3Rpb24gZnVuY19uYW1lKHg6IGFueSwgc2hvcnQ6IGFueT1mYWxzZSkge1xuICAgIHRocm93IG5ldyBFcnJvcihcImZ1bmNfbmFtZSBpcyBub3QgeWV0IGltcGxlbWVudGVkXCIpO1xufVxuXG5mdW5jdGlvbiBfcmVwbGFjZShyZXBzOiBhbnkpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoXCJfcmVwbGFjZSBpcyBub3QgeWV0IGltcGxlbWVudGVkXCIpO1xufVxuXG5mdW5jdGlvbiByZXBsYWNlKHN0cjogc3RyaW5nLCAuLi5yZXBzOiBhbnkpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoXCJyZXBsYWNlIGlzIG5vdCB5ZXQgaW1wbGVtZW50ZWRcIik7XG59XG5cbmZ1bmN0aW9uIHRyYW5zbGF0ZShzOiBhbnksIGE6IGFueSwgYjogYW55PXVuZGVmaW5lZCwgYzogYW55PXVuZGVmaW5lZCkge1xuICAgIHRocm93IG5ldyBFcnJvcihcInRyYW5zbGF0ZSBpcyBub3QgeWV0IGltcGxlbWVudGVkXCIpO1xufVxuXG5mdW5jdGlvbiBvcmRpbmFsKG51bTogYW55KSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKFwib3JkaW5hbCBpcyBub3QgeWV0IGltcGxlbWVudGVkXCIpO1xufVxuXG5mdW5jdGlvbiBhc19pbnQobjogYW55KSB7XG4gICAgaWYgKCFOdW1iZXIuaXNJbnRlZ2VyKG4pKSB7IC8vICEhISAtIG1pZ2h0IG5lZWQgdG8gdXBkYXRlIHRoaXNcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKG4gKyBcIiBpcyBub3QgaW50XCIpO1xuICAgIH1cbiAgICByZXR1cm4gbjtcbn1cblxuZXhwb3J0IHthc19pbnR9O1xuIiwgIi8qXG5Ob3RhYmxlIGNoYW5nZXMgbWFkZSAoYW5kIG5vdGVzKTpcbi0gVmVyeSBiYXJlYm9uZXMgdmVyc2lvbnMgb2YgRXhwciBpbXBsZW1lbnRlZCBzbyBmYXIgLSB2ZXJ5IGZldyB1dGlsIG1ldGhvZHNcbi0gTm90ZSB0aGF0IGV4cHJlc3Npb24gdXNlcyBnbG9iYWwudHMgdG8gY29uc3RydWN0IGFkZCBhbmQgbXVsIG9iamVjdHMsIHdoaWNoXG4gIGF2b2lkcyBjeWNsaWNhbCBpbXBvcnRzXG4qL1xuXG5pbXBvcnQge19CYXNpYywgQXRvbX0gZnJvbSBcIi4vYmFzaWNcIjtcbmltcG9ydCB7SGFzaFNldCwgbWl4fSBmcm9tIFwiLi91dGlsaXR5XCI7XG5pbXBvcnQge01hbmFnZWRQcm9wZXJ0aWVzfSBmcm9tIFwiLi9hc3N1bXB0aW9uc1wiO1xuaW1wb3J0IHtTfSBmcm9tIFwiLi9zaW5nbGV0b25cIjtcbmltcG9ydCB7R2xvYmFsfSBmcm9tIFwiLi9nbG9iYWxcIjtcbmltcG9ydCB7YXNfaW50fSBmcm9tIFwiLi4vdXRpbGl0aWVzL21pc2NcIjtcblxuXG5jb25zdCBFeHByID0gKHN1cGVyY2xhc3M6IGFueSkgPT4gY2xhc3MgRXhwciBleHRlbmRzIG1peChzdXBlcmNsYXNzKS53aXRoKF9CYXNpYykge1xuICAgIC8qXG4gICAgQmFzZSBjbGFzcyBmb3IgYWxnZWJyYWljIGV4cHJlc3Npb25zLlxuICAgIEV4cGxhbmF0aW9uXG4gICAgPT09PT09PT09PT1cbiAgICBFdmVyeXRoaW5nIHRoYXQgcmVxdWlyZXMgYXJpdGhtZXRpYyBvcGVyYXRpb25zIHRvIGJlIGRlZmluZWRcbiAgICBzaG91bGQgc3ViY2xhc3MgdGhpcyBjbGFzcywgaW5zdGVhZCBvZiBCYXNpYyAod2hpY2ggc2hvdWxkIGJlXG4gICAgdXNlZCBvbmx5IGZvciBhcmd1bWVudCBzdG9yYWdlIGFuZCBleHByZXNzaW9uIG1hbmlwdWxhdGlvbiwgaS5lLlxuICAgIHBhdHRlcm4gbWF0Y2hpbmcsIHN1YnN0aXR1dGlvbnMsIGV0YykuXG4gICAgSWYgeW91IHdhbnQgdG8gb3ZlcnJpZGUgdGhlIGNvbXBhcmlzb25zIG9mIGV4cHJlc3Npb25zOlxuICAgIFNob3VsZCB1c2UgX2V2YWxfaXNfZ2UgZm9yIGluZXF1YWxpdHksIG9yIF9ldmFsX2lzX2VxLCB3aXRoIG11bHRpcGxlIGRpc3BhdGNoLlxuICAgIF9ldmFsX2lzX2dlIHJldHVybiB0cnVlIGlmIHggPj0geSwgZmFsc2UgaWYgeCA8IHksIGFuZCBOb25lIGlmIHRoZSB0d28gdHlwZXNcbiAgICBhcmUgbm90IGNvbXBhcmFibGUgb3IgdGhlIGNvbXBhcmlzb24gaXMgaW5kZXRlcm1pbmF0ZVxuICAgIFNlZSBBbHNvXG4gICAgPT09PT09PT1cbiAgICBzeW1weS5jb3JlLmJhc2ljLkJhc2ljXG4gICAgKi9cblxuICAgIF9fc2xvdHNfXzogYW55W10gPSBbXTtcbiAgICBzdGF0aWMgaXNfc2NhbGFyID0gdHJ1ZTtcblxuICAgIGNvbnN0cnVjdG9yKC4uLmFyZ3M6IGFueSkge1xuICAgICAgICBzdXBlciguLi5hcmdzKTtcbiAgICB9XG5cbiAgICBhc19iYXNlX2V4cCgpIHtcbiAgICAgICAgcmV0dXJuIFt0aGlzLCBTLk9uZV07XG4gICAgfVxuXG4gICAgYXNfY29lZmZfTXVsKHJhdGlvbmFsOiBib29sZWFuID0gZmFsc2UpIHtcbiAgICAgICAgcmV0dXJuIFtTLk9uZSwgdGhpc107XG4gICAgfVxuXG4gICAgYXNfY29lZmZfQWRkKCkge1xuICAgICAgICByZXR1cm4gW1MuWmVybywgdGhpc107XG4gICAgfVxuXG4gICAgX19hZGRfXyhvdGhlcjogYW55KSB7XG4gICAgICAgIHJldHVybiBHbG9iYWwuY29uc3RydWN0KFwiQWRkXCIsIHRydWUsIHRydWUsIHRoaXMsIG90aGVyKTtcbiAgICB9XG5cbiAgICBfX3JhZGRfXyhvdGhlcjogYW55KSB7XG4gICAgICAgIHJldHVybiBHbG9iYWwuY29uc3RydWN0KFwiQWRkXCIsIHRydWUsIHRydWUsIG90aGVyLCB0aGlzKTtcbiAgICB9XG5cbiAgICBfX3N1Yl9fKG90aGVyOiBhbnkpIHtcbiAgICAgICAgcmV0dXJuIEdsb2JhbC5jb25zdHJ1Y3QoXCJBZGRcIiwgdHJ1ZSwgdHJ1ZSwgdGhpcywgb3RoZXIuX19tdWxfXyhTLk5lZ2F0aXZlT25lKSk7XG4gICAgfVxuXG4gICAgX19yc3ViX18ob3RoZXI6IGFueSkge1xuICAgICAgICByZXR1cm4gR2xvYmFsLmNvbnN0cnVjdChcIkFkZFwiLCB0cnVlLCB0cnVlLCBvdGhlciwgdGhpcy5fX211bF9fKFMuTmVnYXRpdmVPbmUpKTtcbiAgICB9XG5cbiAgICBfX211bF9fKG90aGVyOiBhbnkpIHtcbiAgICAgICAgcmV0dXJuIEdsb2JhbC5jb25zdHJ1Y3QoXCJNdWxcIiwgdHJ1ZSwgdHJ1ZSwgdGhpcywgb3RoZXIpO1xuICAgIH1cblxuICAgIF9fcm11bF9fKG90aGVyOiBhbnkpIHtcbiAgICAgICAgcmV0dXJuIEdsb2JhbC5jb25zdHJ1Y3QoXCJNdWxcIiwgdHJ1ZSwgdHJ1ZSwgb3RoZXIsIHRoaXMpO1xuICAgIH1cblxuICAgIF9wb3cob3RoZXI6IGFueSkge1xuICAgICAgICByZXR1cm4gR2xvYmFsLmNvbnN0cnVjdChcIlBvd1wiLCB0aGlzLCBvdGhlcik7XG4gICAgfVxuXG4gICAgX19wb3dfXyhvdGhlcjogYW55LCBtb2Q6IGJvb2xlYW4gPSB1bmRlZmluZWQpIHtcbiAgICAgICAgaWYgKHR5cGVvZiBtb2QgPT09IFwidW5kZWZpbmVkXCIpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9wb3cob3RoZXIpO1xuICAgICAgICB9XG4gICAgICAgIGxldCBfc2VsZjsgbGV0IF9vdGhlcjsgbGV0IF9tb2Q7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICBbX3NlbGYsIF9vdGhlciwgX21vZF0gPSBbYXNfaW50KHRoaXMpLCBhc19pbnQob3RoZXIpLCBhc19pbnQobW9kKV07XG4gICAgICAgICAgICBpZiAob3RoZXIgPj0gMCkge1xuICAgICAgICAgICAgICAgIHJldHVybiBHbG9iYWwuY29uc3RydWN0KFwiX051bWJlcl9cIiwgX3NlbGYqKl9vdGhlciAlIF9tb2QpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gR2xvYmFsLmNvbnN0cnVjdChcIl9OdW1iZXJfXCIsIEdsb2JhbC5ldmFsZnVuYyhcIm1vZF9pbnZlcnNlXCIsIChfc2VsZiAqKiAoX290aGVyKSAlIChtb2QgYXMgYW55KSksIG1vZCkpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9IGNhdGNoIChFcnJvcikge1xuICAgICAgICAgICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5vLXVudXNlZC12YXJzXG4gICAgICAgICAgICBjb25zdCBwb3dlciA9IHRoaXMuX3Bvdyhfb3RoZXIpO1xuICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICAvLyByZXR1cm4gcG93ZXIuX19tb2RfXyhtb2QpO1xuICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcIm1vZCBjbGFzcyBub3QgeWV0IGltcGxlbWVudGVkXCIpO1xuICAgICAgICAgICAgfSBjYXRjaCAoRXJyb3IpIHtcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJub3QgaW1wbGVtZW50ZWRcIik7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBfX3Jwb3dfXyhvdGhlcjogYW55KSB7XG4gICAgICAgIHJldHVybiBHbG9iYWwuY29uc3RydWN0KFwiUG93XCIsIG90aGVyLCB0aGlzKTtcbiAgICB9XG5cbiAgICBfX3RydWVkaXZfXyhvdGhlcjogYW55KSB7XG4gICAgICAgIGNvbnN0IGRlbm9tID0gR2xvYmFsLmNvbnN0cnVjdChcIlBvd1wiLCBvdGhlciwgUy5OZWdhdGl2ZU9uZSk7XG4gICAgICAgIGlmICh0aGlzID09PSBTLk9uZSkge1xuICAgICAgICAgICAgcmV0dXJuIGRlbm9tO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuIEdsb2JhbC5jb25zdHJ1Y3QoXCJNdWxcIiwgdHJ1ZSwgdHJ1ZSwgdGhpcywgZGVub20pO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgX19ydHJ1ZWRpdl9fKG90aGVyOiBhbnkpIHtcbiAgICAgICAgY29uc3QgZGVub20gPSBHbG9iYWwuY29uc3RydWN0KFwiUG93XCIsIHRoaXMsIFMuTmVnYXRpdmVPbmUpO1xuICAgICAgICBpZiAob3RoZXIgPT09IFMuT25lKSB7XG4gICAgICAgICAgICByZXR1cm4gZGVub207XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gR2xvYmFsLmNvbnN0cnVjdChcIk11bFwiLCB0cnVlLCB0cnVlLCBvdGhlciwgZGVub20pO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgX2V2YWxfcG93ZXIob3RoZXI6IGFueSk6IGFueSB7XG4gICAgICAgIHJldHVybiB1bmRlZmluZWQ7XG4gICAgfVxuXG4gICAgYXJnc19jbmMoY3NldDogYm9vbGVhbiA9IGZhbHNlLCB3YXJuOiBib29sZWFuID0gdHJ1ZSwgc3BsaXRfMTogYm9vbGVhbiA9IHRydWUpIHtcbiAgICAgICAgbGV0IGFyZ3M7XG4gICAgICAgIGlmICgodGhpcy5jb25zdHJ1Y3RvciBhcyBhbnkpLmlzX011bCkge1xuICAgICAgICAgICAgYXJncyA9IHRoaXMuX2FyZ3M7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBhcmdzID0gW3RoaXNdO1xuICAgICAgICB9XG4gICAgICAgIGxldCBjOyBsZXQgbmM7XG4gICAgICAgIGxldCBsb29wMiA9IHRydWU7XG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgYXJncy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgY29uc3QgbWkgPSBhcmdzW2ldO1xuICAgICAgICAgICAgaWYgKCEobWkuaXNfY29tbXV0YXRpdmUpKSB7XG4gICAgICAgICAgICAgICAgYyA9IGFyZ3Muc2xpY2UoMCwgaSk7XG4gICAgICAgICAgICAgICAgbmMgPSBhcmdzLnNsaWNlKGkpO1xuICAgICAgICAgICAgICAgIGxvb3AyID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0gaWYgKGxvb3AyKSB7XG4gICAgICAgICAgICBjID0gYXJncztcbiAgICAgICAgICAgIG5jID0gW107XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoYyAmJiBzcGxpdF8xICYmXG4gICAgICAgICAgICBjWzBdLmlzX051bWJlciAmJlxuICAgICAgICAgICAgY1swXS5pc19leHRlbmRlZF9uZWdhdGl2ZSAmJlxuICAgICAgICAgICAgY1swXSAhPT0gUy5OZWdhdGl2ZU9uZSkge1xuICAgICAgICAgICAgYy5zcGxpY2UoMCwgMSwgUy5OZWdhdGl2ZU9uZSwgY1swXS5fX211bF9fKFMuTmVnYXRpdmVPbmUpKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChjc2V0KSB7XG4gICAgICAgICAgICBjb25zdCBjbGVuID0gYy5sZW5ndGg7XG4gICAgICAgICAgICBjb25zdCBjc2V0ID0gbmV3IEhhc2hTZXQoKTtcbiAgICAgICAgICAgIGNzZXQuYWRkQXJyKGMpO1xuICAgICAgICAgICAgaWYgKGNsZW4gJiYgd2FybiAmJiBjc2V0LnNpemUgIT09IGNsZW4pIHtcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJyZXBlYXRlZCBjb21tdXRhdGl2ZSBhcmdzXCIpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBbYywgbmNdO1xuICAgIH1cbn07XG5cbi8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBuZXctY2FwXG5jb25zdCBfRXhwciA9IEV4cHIoT2JqZWN0KTtcbk1hbmFnZWRQcm9wZXJ0aWVzLnJlZ2lzdGVyKF9FeHByKTtcblxuY29uc3QgQXRvbWljRXhwciA9IChzdXBlcmNsYXNzOiBhbnkpID0+IGNsYXNzIEF0b21pY0V4cHIgZXh0ZW5kcyBtaXgoc3VwZXJjbGFzcykud2l0aChBdG9tLCBFeHByKSB7XG4gICAgLypcbiAgICBBIHBhcmVudCBjbGFzcyBmb3Igb2JqZWN0IHdoaWNoIGFyZSBib3RoIGF0b21zIGFuZCBFeHBycy5cbiAgICBGb3IgZXhhbXBsZTogU3ltYm9sLCBOdW1iZXIsIFJhdGlvbmFsLCBJbnRlZ2VyLCAuLi5cbiAgICBCdXQgbm90OiBBZGQsIE11bCwgUG93LCAuLi5cbiAgICAqL1xuICAgIHN0YXRpYyBpc19udW1iZXIgPSBmYWxzZTtcbiAgICBzdGF0aWMgaXNfQXRvbSA9IHRydWU7XG5cbiAgICBfX3Nsb3RzX186IGFueVtdID0gW107XG5cbiAgICBjb25zdHJ1Y3RvciguLi5hcmdzOiBhbnkpIHtcbiAgICAgICAgc3VwZXIoQXRvbWljRXhwciwgYXJncyk7XG4gICAgfVxuXG4gICAgX2V2YWxfaXNfcG9seW5vbWlhbChzeW1zOiBhbnkpIHtcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuXG4gICAgX2V2YWxfaXNfcmF0aW9uYWxfZnVuY3Rpb24oc3ltczogYW55KSB7XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cblxuICAgIGV2YWxfaXNfYWxnZWJyYWljX2V4cHIoc3ltczogYW55KSB7XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cblxuICAgIF9ldmFsX25zZXJpZXMoeDogYW55LCBuOiBhbnksIGxvZ3g6IGFueSwgY2RvcjogYW55ID0gMCkge1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9XG59O1xuXG4vLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbmV3LWNhcFxuY29uc3QgX0F0b21pY0V4cHIgPSBBdG9taWNFeHByKE9iamVjdCk7XG5NYW5hZ2VkUHJvcGVydGllcy5yZWdpc3RlcihfQXRvbWljRXhwcik7XG5cbmV4cG9ydCB7QXRvbWljRXhwciwgX0F0b21pY0V4cHIsIEV4cHIsIF9FeHByfTtcbiIsICIvKlxuTm90YWJsZSBjaGFuZ2VzIG1hZGU6XG4tIERpY3Rpb25hcnkgc3lzdGVtIHJld29ya2VkIGFzIGNsYXNzIHByb3BlcnRpZXNcbiovXG5cbmNsYXNzIF9nbG9iYWxfcGFyYW1ldGVycyB7XG4gICAgLypcbiAgICBUaHJlYWQtbG9jYWwgZ2xvYmFsIHBhcmFtZXRlcnMuXG4gICAgRXhwbGFuYXRpb25cbiAgICA9PT09PT09PT09PVxuICAgIFRoaXMgY2xhc3MgZ2VuZXJhdGVzIHRocmVhZC1sb2NhbCBjb250YWluZXIgZm9yIFN5bVB5J3MgZ2xvYmFsIHBhcmFtZXRlcnMuXG4gICAgRXZlcnkgZ2xvYmFsIHBhcmFtZXRlcnMgbXVzdCBiZSBwYXNzZWQgYXMga2V5d29yZCBhcmd1bWVudCB3aGVuIGdlbmVyYXRpbmdcbiAgICBpdHMgaW5zdGFuY2UuXG4gICAgQSB2YXJpYWJsZSwgYGdsb2JhbF9wYXJhbWV0ZXJzYCBpcyBwcm92aWRlZCBhcyBkZWZhdWx0IGluc3RhbmNlIGZvciB0aGlzIGNsYXNzLlxuICAgIFdBUk5JTkchIEFsdGhvdWdoIHRoZSBnbG9iYWwgcGFyYW1ldGVycyBhcmUgdGhyZWFkLWxvY2FsLCBTeW1QeSdzIGNhY2hlIGlzIG5vdFxuICAgIGJ5IG5vdy5cbiAgICBUaGlzIG1heSBsZWFkIHRvIHVuZGVzaXJlZCByZXN1bHQgaW4gbXVsdGktdGhyZWFkaW5nIG9wZXJhdGlvbnMuXG4gICAgRXhhbXBsZXNcbiAgICA9PT09PT09PVxuICAgID4+PiBmcm9tIHN5bXB5LmFiYyBpbXBvcnQgeFxuICAgID4+PiBmcm9tIHN5bXB5LmNvcmUuY2FjaGUgaW1wb3J0IGNsZWFyX2NhY2hlXG4gICAgPj4+IGZyb20gc3ltcHkuY29yZS5wYXJhbWV0ZXJzIGltcG9ydCBnbG9iYWxfcGFyYW1ldGVycyBhcyBncFxuICAgID4+PiBncC5ldmFsdWF0ZVxuICAgIFRydWVcbiAgICA+Pj4geCt4XG4gICAgMip4XG4gICAgPj4+IGxvZyA9IFtdXG4gICAgPj4+IGRlZiBmKCk6XG4gICAgLi4uICAgICBjbGVhcl9jYWNoZSgpXG4gICAgLi4uICAgICBncC5ldmFsdWF0ZSA9IEZhbHNlXG4gICAgLi4uICAgICBsb2cuYXBwZW5kKHgreClcbiAgICAuLi4gICAgIGNsZWFyX2NhY2hlKClcbiAgICA+Pj4gaW1wb3J0IHRocmVhZGluZ1xuICAgID4+PiB0aHJlYWQgPSB0aHJlYWRpbmcuVGhyZWFkKHRhcmdldD1mKVxuICAgID4+PiB0aHJlYWQuc3RhcnQoKVxuICAgID4+PiB0aHJlYWQuam9pbigpXG4gICAgPj4+IHByaW50KGxvZylcbiAgICBbeCArIHhdXG4gICAgPj4+IGdwLmV2YWx1YXRlXG4gICAgVHJ1ZVxuICAgID4+PiB4K3hcbiAgICAyKnhcbiAgICBSZWZlcmVuY2VzXG4gICAgPT09PT09PT09PVxuICAgIC4uIFsxXSBodHRwczovL2RvY3MucHl0aG9uLm9yZy8zL2xpYnJhcnkvdGhyZWFkaW5nLmh0bWxcbiAgICAqL1xuXG4gICAgZGljdDogUmVjb3JkPGFueSwgYW55PiA9IHt9O1xuXG4gICAgZXZhbHVhdGU7XG4gICAgZGlzdHJpYnV0ZTtcbiAgICBleHBfaXNfcG93O1xuXG4gICAgY29uc3RydWN0b3IoZGljdDogUmVjb3JkPHN0cmluZywgYW55Pikge1xuICAgICAgICB0aGlzLmRpY3QgPSBkaWN0O1xuICAgICAgICB0aGlzLmV2YWx1YXRlID0gdGhpcy5kaWN0W1wiZXZhbHVhdGVcIl07XG4gICAgICAgIHRoaXMuZGlzdHJpYnV0ZSA9IHRoaXMuZGljdFtcImRpc3RyaWJ1dGVcIl07XG4gICAgICAgIHRoaXMuZXhwX2lzX3BvdyA9IHRoaXMuZGljdFtcImV4cF9pc19wb3dcIl07XG4gICAgfVxufVxuXG5jb25zdCBnbG9iYWxfcGFyYW1ldGVycyA9IG5ldyBfZ2xvYmFsX3BhcmFtZXRlcnMoe1wiZXZhbHVhdGVcIjogdHJ1ZSwgXCJkaXN0cmlidXRlXCI6IHRydWUsIFwiZXhwX2lzX3Bvd1wiOiBmYWxzZX0pO1xuXG5leHBvcnQge2dsb2JhbF9wYXJhbWV0ZXJzfTtcbiIsICIvKlxuTm90YWJsZSBjaGFuZ2VzIG1hZGUgYW5kIG5vdGVzOlxuLSBPcmRlci1zeW1ib2xzIGFuZCByZWxhdGVkIGNvbXBvbmVudGVkIG5vdCB5ZXQgaW1wbGVtZW50ZWRcbi0gTW9zdCBtZXRob2RzIG5vdCB5ZXQgaW1wbGVtZW50ZWQgKGJ1dCBlbm91Z2ggdG8gZXZhbHVhdGUgYWRkIGluIHRoZW9yeSlcbi0gU2ltcGxpZnkgYXJndW1lbnQgYWRkZWQgdG8gY29uc3RydWN0b3IgdG8gcHJldmVudCBpbmZpbml0ZSByZWN1cnNpb25cbiovXG5cbmltcG9ydCB7X0Jhc2ljfSBmcm9tIFwiLi9iYXNpY1wiO1xuaW1wb3J0IHttaXh9IGZyb20gXCIuL3V0aWxpdHlcIjtcbmltcG9ydCB7Z2xvYmFsX3BhcmFtZXRlcnN9IGZyb20gXCIuL3BhcmFtZXRlcnNcIjtcbmltcG9ydCB7ZnV6enlfYW5kX3YyfSBmcm9tIFwiLi9sb2dpY1wiO1xuaW1wb3J0IHtNYW5hZ2VkUHJvcGVydGllc30gZnJvbSBcIi4vYXNzdW1wdGlvbnNcIjtcbmltcG9ydCB7U30gZnJvbSBcIi4vc2luZ2xldG9uXCI7XG5cblxuY29uc3QgQXNzb2NPcCA9IChzdXBlcmNsYXNzOiBhbnkpID0+IGNsYXNzIEFzc29jT3AgZXh0ZW5kcyBtaXgoc3VwZXJjbGFzcykud2l0aChfQmFzaWMpIHtcbiAgICAvKiBBc3NvY2lhdGl2ZSBvcGVyYXRpb25zLCBjYW4gc2VwYXJhdGUgbm9uY29tbXV0YXRpdmUgYW5kXG4gICAgY29tbXV0YXRpdmUgcGFydHMuXG4gICAgKGEgb3AgYikgb3AgYyA9PSBhIG9wIChiIG9wIGMpID09IGEgb3AgYiBvcCBjLlxuICAgIEJhc2UgY2xhc3MgZm9yIEFkZCBhbmQgTXVsLlxuICAgIFRoaXMgaXMgYW4gYWJzdHJhY3QgYmFzZSBjbGFzcywgY29uY3JldGUgZGVyaXZlZCBjbGFzc2VzIG11c3QgZGVmaW5lXG4gICAgdGhlIGF0dHJpYnV0ZSBgaWRlbnRpdHlgLlxuICAgIC4uIGRlcHJlY2F0ZWQ6OiAxLjdcbiAgICAgICBVc2luZyBhcmd1bWVudHMgdGhhdCBhcmVuJ3Qgc3ViY2xhc3NlcyBvZiA6Y2xhc3M6YH4uRXhwcmAgaW4gY29yZVxuICAgICAgIG9wZXJhdG9ycyAoOmNsYXNzOmB+Lk11bGAsIDpjbGFzczpgfi5BZGRgLCBhbmQgOmNsYXNzOmB+LlBvd2ApIGlzXG4gICAgICAgZGVwcmVjYXRlZC4gU2VlIDpyZWY6YG5vbi1leHByLWFyZ3MtZGVwcmVjYXRlZGAgZm9yIGRldGFpbHMuXG4gICAgUGFyYW1ldGVyc1xuICAgID09PT09PT09PT1cbiAgICAqYXJncyA6XHUwMTkyXG4gICAgICAgIEFyZ3VtZW50cyB3aGljaCBhcmUgb3BlcmF0ZWRcbiAgICBldmFsdWF0ZSA6IGJvb2wsIG9wdGlvbmFsXG4gICAgICAgIEV2YWx1YXRlIHRoZSBvcGVyYXRpb24uIElmIG5vdCBwYXNzZWQsIHJlZmVyIHRvIGBgZ2xvYmFsX3BhcmFtZXRlcnMuZXZhbHVhdGVgYC5cbiAgICAqL1xuXG4gICAgLy8gZm9yIHBlcmZvcm1hbmNlIHJlYXNvbiwgd2UgZG9uJ3QgbGV0IGlzX2NvbW11dGF0aXZlIGdvIHRvIGFzc3VtcHRpb25zLFxuICAgIC8vIGFuZCBrZWVwIGl0IHJpZ2h0IGhlcmVcblxuICAgIF9fc2xvdHNfXzogYW55W10gPSBbXCJpc19jb21tdXRhdGl2ZVwiXTtcbiAgICBzdGF0aWMgX2FyZ3NfdHlwZTogYW55ID0gdW5kZWZpbmVkO1xuXG4gICAgY29uc3RydWN0b3IoY2xzOiBhbnksIGV2YWx1YXRlOiBhbnksIHNpbXBsaWZ5OiBib29sZWFuLCAuLi5hcmdzOiBhbnkpIHtcbiAgICAgICAgLy8gaWRlbnRpdHkgd2Fzbid0IHdvcmtpbmcgZm9yIHNvbWUgcmVhc29uLCBzbyBoZXJlIGlzIGEgYmFuZGFpZCBmaXhcbiAgICAgICAgaWYgKGNscy5uYW1lID09PSBcIk11bFwiKSB7XG4gICAgICAgICAgICBjbHMuaWRlbnRpdHkgPSBTLk9uZTtcbiAgICAgICAgfSBlbHNlIGlmIChjbHMubmFtZSA9PT0gXCJBZGRcIikge1xuICAgICAgICAgICAgY2xzLmlkZW50aXR5ID0gUy5aZXJvO1xuICAgICAgICB9XG4gICAgICAgIHN1cGVyKC4uLmFyZ3MpO1xuICAgICAgICBpZiAoc2ltcGxpZnkpIHtcbiAgICAgICAgICAgIGlmICh0eXBlb2YgZXZhbHVhdGUgPT09IFwidW5kZWZpbmVkXCIpIHtcbiAgICAgICAgICAgICAgICBldmFsdWF0ZSA9IGdsb2JhbF9wYXJhbWV0ZXJzLmV2YWx1YXRlO1xuICAgICAgICAgICAgfSBlbHNlIGlmIChldmFsdWF0ZSA9PT0gZmFsc2UpIHtcbiAgICAgICAgICAgICAgICBsZXQgb2JqID0gdGhpcy5fZnJvbV9hcmdzKGNscywgdW5kZWZpbmVkLCAuLi5hcmdzKTtcbiAgICAgICAgICAgICAgICBvYmogPSB0aGlzLl9leGVjX2NvbnN0cnVjdG9yX3Bvc3Rwcm9jZXNzb3JzKG9iaik7XG4gICAgICAgICAgICAgICAgcmV0dXJuIG9iajtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGNvbnN0IGFyZ3NUZW1wOiBhbnlbXSA9IFtdO1xuICAgICAgICAgICAgZm9yIChjb25zdCBhIG9mIGFyZ3MpIHtcbiAgICAgICAgICAgICAgICBpZiAoYSAhPT0gY2xzLmlkZW50aXR5KSB7XG4gICAgICAgICAgICAgICAgICAgIGFyZ3NUZW1wLnB1c2goYSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgYXJncyA9IGFyZ3NUZW1wO1xuICAgICAgICAgICAgaWYgKGFyZ3MubGVuZ3RoID09PSAwKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGNscy5pZGVudGl0eTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoYXJncy5sZW5ndGggPT09IDEpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gYXJnc1swXTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBuby11bnVzZWQtdmFyc1xuICAgICAgICAgICAgY29uc3QgW2NfcGFydCwgbmNfcGFydCwgb3JkZXJfc3ltYm9sc10gPSB0aGlzLmZsYXR0ZW4oYXJncyk7XG4gICAgICAgICAgICBjb25zdCBpc19jb21tdXRhdGl2ZTogYm9vbGVhbiA9IG5jX3BhcnQubGVuZ3RoID09PSAwO1xuICAgICAgICAgICAgbGV0IG9iajogYW55ID0gdGhpcy5fZnJvbV9hcmdzKGNscywgaXNfY29tbXV0YXRpdmUsIC4uLmNfcGFydC5jb25jYXQobmNfcGFydCkpO1xuICAgICAgICAgICAgb2JqID0gdGhpcy5fZXhlY19jb25zdHJ1Y3Rvcl9wb3N0cHJvY2Vzc29ycyhvYmopO1xuICAgICAgICAgICAgLy8gISEhIG9yZGVyIHN5bWJvbHMgbm90IHlldCBpbXBsZW1lbnRlZFxuICAgICAgICAgICAgcmV0dXJuIG9iajtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIF9mcm9tX2FyZ3MoY2xzOiBhbnksIGlzX2NvbW11dGF0aXZlOiBhbnksIC4uLmFyZ3M6IGFueSkge1xuICAgICAgICAvKiBcIkNyZWF0ZSBuZXcgaW5zdGFuY2Ugd2l0aCBhbHJlYWR5LXByb2Nlc3NlZCBhcmdzLlxuICAgICAgICBJZiB0aGUgYXJncyBhcmUgbm90IGluIGNhbm9uaWNhbCBvcmRlciwgdGhlbiBhIG5vbi1jYW5vbmljYWxcbiAgICAgICAgcmVzdWx0IHdpbGwgYmUgcmV0dXJuZWQsIHNvIHVzZSB3aXRoIGNhdXRpb24uIFRoZSBvcmRlciBvZlxuICAgICAgICBhcmdzIG1heSBjaGFuZ2UgaWYgdGhlIHNpZ24gb2YgdGhlIGFyZ3MgaXMgY2hhbmdlZC4gKi9cbiAgICAgICAgaWYgKGFyZ3MubGVuZ3RoID09PSAwKSB7XG4gICAgICAgICAgICByZXR1cm4gY2xzLmlkZW50aXR5O1xuICAgICAgICB9IGVsc2UgaWYgKGFyZ3MubGVuZ3RoID09PSAxKSB7XG4gICAgICAgICAgICByZXR1cm4gYXJnc1swXTtcbiAgICAgICAgfVxuICAgICAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbmV3LWNhcFxuICAgICAgICBjb25zdCBvYmo6IGFueSA9IG5ldyBjbHModHJ1ZSwgZmFsc2UsIC4uLmFyZ3MpO1xuICAgICAgICBpZiAodHlwZW9mIGlzX2NvbW11dGF0aXZlID09PSBcInVuZGVmaW5lZFwiKSB7XG4gICAgICAgICAgICBjb25zdCBpbnB1dDogYW55W10gPSBbXTtcbiAgICAgICAgICAgIGZvciAoY29uc3QgYSBvZiBhcmdzKSB7XG4gICAgICAgICAgICAgICAgaW5wdXQucHVzaChhLmlzX2NvbW11dGF0aXZlKCkpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaXNfY29tbXV0YXRpdmUgPSBmdXp6eV9hbmRfdjIoaW5wdXQpO1xuICAgICAgICB9XG4gICAgICAgIG9iai5pc19jb21tdXRhdGl2ZSA9ICgpID0+IGlzX2NvbW11dGF0aXZlO1xuICAgICAgICByZXR1cm4gb2JqO1xuICAgIH1cblxuICAgIF9uZXdfcmF3YXJncyhyZWV2YWw6IGJvb2xlYW4sIC4uLmFyZ3M6IGFueSkge1xuICAgICAgICBsZXQgaXNfY29tbXV0YXRpdmU7XG4gICAgICAgIGlmIChyZWV2YWwgJiYgdGhpcy5pc19jb21tdXRhdGl2ZSA9PT0gZmFsc2UpIHtcbiAgICAgICAgICAgIGlzX2NvbW11dGF0aXZlID0gdW5kZWZpbmVkO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgaXNfY29tbXV0YXRpdmUgPSB0aGlzLmlzX2NvbW11dGF0aXZlO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0aGlzLl9mcm9tX2FyZ3ModGhpcy5jb25zdHJ1Y3RvciwgaXNfY29tbXV0YXRpdmUsIC4uLmFyZ3MpO1xuICAgIH1cblxuICAgIG1ha2VfYXJncyhjbHM6IGFueSwgZXhwcjogYW55KSB7XG4gICAgICAgIGlmIChleHByIGluc3RhbmNlb2YgY2xzKSB7XG4gICAgICAgICAgICByZXR1cm4gZXhwci5fYXJncztcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiBbZXhwcl07XG4gICAgICAgIH1cbiAgICB9XG59O1xuXG4vLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbmV3LWNhcFxuTWFuYWdlZFByb3BlcnRpZXMucmVnaXN0ZXIoQXNzb2NPcChPYmplY3QpKTtcblxuZXhwb3J0IHtBc3NvY09wfTtcbiIsICIvKiFcclxuICogIGRlY2ltYWwuanMgdjEwLjQuM1xyXG4gKiAgQW4gYXJiaXRyYXJ5LXByZWNpc2lvbiBEZWNpbWFsIHR5cGUgZm9yIEphdmFTY3JpcHQuXHJcbiAqICBodHRwczovL2dpdGh1Yi5jb20vTWlrZU1jbC9kZWNpbWFsLmpzXHJcbiAqICBDb3B5cmlnaHQgKGMpIDIwMjIgTWljaGFlbCBNY2xhdWdobGluIDxNOGNoODhsQGdtYWlsLmNvbT5cclxuICogIE1JVCBMaWNlbmNlXHJcbiAqL1xyXG5cclxuXHJcbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tICBFRElUQUJMRSBERUZBVUxUUyAgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tIC8vXHJcblxyXG5cclxuICAvLyBUaGUgbWF4aW11bSBleHBvbmVudCBtYWduaXR1ZGUuXHJcbiAgLy8gVGhlIGxpbWl0IG9uIHRoZSB2YWx1ZSBvZiBgdG9FeHBOZWdgLCBgdG9FeHBQb3NgLCBgbWluRWAgYW5kIGBtYXhFYC5cclxudmFyIEVYUF9MSU1JVCA9IDllMTUsICAgICAgICAgICAgICAgICAgICAgIC8vIDAgdG8gOWUxNVxyXG5cclxuICAvLyBUaGUgbGltaXQgb24gdGhlIHZhbHVlIG9mIGBwcmVjaXNpb25gLCBhbmQgb24gdGhlIHZhbHVlIG9mIHRoZSBmaXJzdCBhcmd1bWVudCB0b1xyXG4gIC8vIGB0b0RlY2ltYWxQbGFjZXNgLCBgdG9FeHBvbmVudGlhbGAsIGB0b0ZpeGVkYCwgYHRvUHJlY2lzaW9uYCBhbmQgYHRvU2lnbmlmaWNhbnREaWdpdHNgLlxyXG4gIE1BWF9ESUdJVFMgPSAxZTksICAgICAgICAgICAgICAgICAgICAgICAgLy8gMCB0byAxZTlcclxuXHJcbiAgLy8gQmFzZSBjb252ZXJzaW9uIGFscGhhYmV0LlxyXG4gIE5VTUVSQUxTID0gJzAxMjM0NTY3ODlhYmNkZWYnLFxyXG5cclxuICAvLyBUaGUgbmF0dXJhbCBsb2dhcml0aG0gb2YgMTAgKDEwMjUgZGlnaXRzKS5cclxuICBMTjEwID0gJzIuMzAyNTg1MDkyOTk0MDQ1Njg0MDE3OTkxNDU0Njg0MzY0MjA3NjAxMTAxNDg4NjI4NzcyOTc2MDMzMzI3OTAwOTY3NTcyNjA5Njc3MzUyNDgwMjM1OTk3MjA1MDg5NTk4Mjk4MzQxOTY3Nzg0MDQyMjg2MjQ4NjMzNDA5NTI1NDY1MDgyODA2NzU2NjY2Mjg3MzY5MDk4NzgxNjg5NDgyOTA3MjA4MzI1NTU0NjgwODQzNzk5ODk0ODI2MjMzMTk4NTI4MzkzNTA1MzA4OTY1Mzc3NzMyNjI4ODQ2MTYzMzY2MjIyMjg3Njk4MjE5ODg2NzQ2NTQzNjY3NDc0NDA0MjQzMjc0MzY1MTU1MDQ4OTM0MzE0OTM5MzkxNDc5NjE5NDA0NDAwMjIyMTA1MTAxNzE0MTc0ODAwMzY4ODA4NDAxMjY0NzA4MDY4NTU2Nzc0MzIxNjIyODM1NTIyMDExNDgwNDY2MzcxNTY1OTEyMTM3MzQ1MDc0Nzg1Njk0NzY4MzQ2MzYxNjc5MjEwMTgwNjQ0NTA3MDY0ODAwMDI3NzUwMjY4NDkxNjc0NjU1MDU4Njg1NjkzNTY3MzQyMDY3MDU4MTEzNjQyOTIyNDU1NDQwNTc1ODkyNTcyNDIwODI0MTMxNDY5NTY4OTAxNjc1ODk0MDI1Njc3NjMxMTM1NjkxOTI5MjAzMzM3NjU4NzE0MTY2MDIzMDEwNTcwMzA4OTYzNDU3MjA3NTQ0MDM3MDg0NzQ2OTk0MDE2ODI2OTI4MjgwODQ4MTE4NDI4OTMxNDg0ODUyNDk0ODY0NDg3MTkyNzgwOTY3NjI3MTI3NTc3NTM5NzAyNzY2ODYwNTk1MjQ5NjcxNjY3NDE4MzQ4NTcwNDQyMjUwNzE5Nzk2NTAwNDcxNDk1MTA1MDQ5MjIxNDc3NjU2NzYzNjkzODY2Mjk3Njk3OTUyMjExMDcxODI2NDU0OTczNDc3MjY2MjQyNTcwOTQyOTMyMjU4Mjc5ODUwMjU4NTUwOTc4NTI2NTM4MzIwNzYwNjcyNjMxNzE2NDMwOTUwNTk5NTA4NzgwNzUyMzcxMDMzMzEwMTE5Nzg1NzU0NzMzMTU0MTQyMTgwODQyNzU0Mzg2MzU5MTc3ODExNzA1NDMwOTgyNzQ4MjM4NTA0NTY0ODAxOTA5NTYxMDI5OTI5MTgyNDMxODIzNzUyNTM1NzcwOTc1MDUzOTU2NTE4NzY5NzUxMDM3NDk3MDg4ODY5MjE4MDIwNTE4OTMzOTUwNzIzODUzOTIwNTE0NDYzNDE5NzI2NTI4NzI4Njk2NTExMDg2MjU3MTQ5MjE5ODg0OTk3ODc0ODg3Mzc3MTM0NTY4NjIwOTE2NzA1OCcsXHJcblxyXG4gIC8vIFBpICgxMDI1IGRpZ2l0cykuXHJcbiAgUEkgPSAnMy4xNDE1OTI2NTM1ODk3OTMyMzg0NjI2NDMzODMyNzk1MDI4ODQxOTcxNjkzOTkzNzUxMDU4MjA5NzQ5NDQ1OTIzMDc4MTY0MDYyODYyMDg5OTg2MjgwMzQ4MjUzNDIxMTcwNjc5ODIxNDgwODY1MTMyODIzMDY2NDcwOTM4NDQ2MDk1NTA1ODIyMzE3MjUzNTk0MDgxMjg0ODExMTc0NTAyODQxMDI3MDE5Mzg1MjExMDU1NTk2NDQ2MjI5NDg5NTQ5MzAzODE5NjQ0Mjg4MTA5NzU2NjU5MzM0NDYxMjg0NzU2NDgyMzM3ODY3ODMxNjUyNzEyMDE5MDkxNDU2NDg1NjY5MjM0NjAzNDg2MTA0NTQzMjY2NDgyMTMzOTM2MDcyNjAyNDkxNDEyNzM3MjQ1ODcwMDY2MDYzMTU1ODgxNzQ4ODE1MjA5MjA5NjI4MjkyNTQwOTE3MTUzNjQzNjc4OTI1OTAzNjAwMTEzMzA1MzA1NDg4MjA0NjY1MjEzODQxNDY5NTE5NDE1MTE2MDk0MzMwNTcyNzAzNjU3NTk1OTE5NTMwOTIxODYxMTczODE5MzI2MTE3OTMxMDUxMTg1NDgwNzQ0NjIzNzk5NjI3NDk1NjczNTE4ODU3NTI3MjQ4OTEyMjc5MzgxODMwMTE5NDkxMjk4MzM2NzMzNjI0NDA2NTY2NDMwODYwMjEzOTQ5NDYzOTUyMjQ3MzcxOTA3MDIxNzk4NjA5NDM3MDI3NzA1MzkyMTcxNzYyOTMxNzY3NTIzODQ2NzQ4MTg0Njc2Njk0MDUxMzIwMDA1NjgxMjcxNDUyNjM1NjA4Mjc3ODU3NzEzNDI3NTc3ODk2MDkxNzM2MzcxNzg3MjE0Njg0NDA5MDEyMjQ5NTM0MzAxNDY1NDk1ODUzNzEwNTA3OTIyNzk2ODkyNTg5MjM1NDIwMTk5NTYxMTIxMjkwMjE5NjA4NjQwMzQ0MTgxNTk4MTM2Mjk3NzQ3NzEzMDk5NjA1MTg3MDcyMTEzNDk5OTk5OTgzNzI5NzgwNDk5NTEwNTk3MzE3MzI4MTYwOTYzMTg1OTUwMjQ0NTk0NTUzNDY5MDgzMDI2NDI1MjIzMDgyNTMzNDQ2ODUwMzUyNjE5MzExODgxNzEwMTAwMDMxMzc4Mzg3NTI4ODY1ODc1MzMyMDgzODE0MjA2MTcxNzc2NjkxNDczMDM1OTgyNTM0OTA0Mjg3NTU0Njg3MzExNTk1NjI4NjM4ODIzNTM3ODc1OTM3NTE5NTc3ODE4NTc3ODA1MzIxNzEyMjY4MDY2MTMwMDE5Mjc4NzY2MTExOTU5MDkyMTY0MjAxOTg5MzgwOTUyNTcyMDEwNjU0ODU4NjMyNzg5JyxcclxuXHJcblxyXG4gIC8vIFRoZSBpbml0aWFsIGNvbmZpZ3VyYXRpb24gcHJvcGVydGllcyBvZiB0aGUgRGVjaW1hbCBjb25zdHJ1Y3Rvci5cclxuICBERUZBVUxUUyA9IHtcclxuXHJcbiAgICAvLyBUaGVzZSB2YWx1ZXMgbXVzdCBiZSBpbnRlZ2VycyB3aXRoaW4gdGhlIHN0YXRlZCByYW5nZXMgKGluY2x1c2l2ZSkuXHJcbiAgICAvLyBNb3N0IG9mIHRoZXNlIHZhbHVlcyBjYW4gYmUgY2hhbmdlZCBhdCBydW4tdGltZSB1c2luZyB0aGUgYERlY2ltYWwuY29uZmlnYCBtZXRob2QuXHJcblxyXG4gICAgLy8gVGhlIG1heGltdW0gbnVtYmVyIG9mIHNpZ25pZmljYW50IGRpZ2l0cyBvZiB0aGUgcmVzdWx0IG9mIGEgY2FsY3VsYXRpb24gb3IgYmFzZSBjb252ZXJzaW9uLlxyXG4gICAgLy8gRS5nLiBgRGVjaW1hbC5jb25maWcoeyBwcmVjaXNpb246IDIwIH0pO2BcclxuICAgIHByZWNpc2lvbjogMjAsICAgICAgICAgICAgICAgICAgICAgICAgIC8vIDEgdG8gTUFYX0RJR0lUU1xyXG5cclxuICAgIC8vIFRoZSByb3VuZGluZyBtb2RlIHVzZWQgd2hlbiByb3VuZGluZyB0byBgcHJlY2lzaW9uYC5cclxuICAgIC8vXHJcbiAgICAvLyBST1VORF9VUCAgICAgICAgIDAgQXdheSBmcm9tIHplcm8uXHJcbiAgICAvLyBST1VORF9ET1dOICAgICAgIDEgVG93YXJkcyB6ZXJvLlxyXG4gICAgLy8gUk9VTkRfQ0VJTCAgICAgICAyIFRvd2FyZHMgK0luZmluaXR5LlxyXG4gICAgLy8gUk9VTkRfRkxPT1IgICAgICAzIFRvd2FyZHMgLUluZmluaXR5LlxyXG4gICAgLy8gUk9VTkRfSEFMRl9VUCAgICA0IFRvd2FyZHMgbmVhcmVzdCBuZWlnaGJvdXIuIElmIGVxdWlkaXN0YW50LCB1cC5cclxuICAgIC8vIFJPVU5EX0hBTEZfRE9XTiAgNSBUb3dhcmRzIG5lYXJlc3QgbmVpZ2hib3VyLiBJZiBlcXVpZGlzdGFudCwgZG93bi5cclxuICAgIC8vIFJPVU5EX0hBTEZfRVZFTiAgNiBUb3dhcmRzIG5lYXJlc3QgbmVpZ2hib3VyLiBJZiBlcXVpZGlzdGFudCwgdG93YXJkcyBldmVuIG5laWdoYm91ci5cclxuICAgIC8vIFJPVU5EX0hBTEZfQ0VJTCAgNyBUb3dhcmRzIG5lYXJlc3QgbmVpZ2hib3VyLiBJZiBlcXVpZGlzdGFudCwgdG93YXJkcyArSW5maW5pdHkuXHJcbiAgICAvLyBST1VORF9IQUxGX0ZMT09SIDggVG93YXJkcyBuZWFyZXN0IG5laWdoYm91ci4gSWYgZXF1aWRpc3RhbnQsIHRvd2FyZHMgLUluZmluaXR5LlxyXG4gICAgLy9cclxuICAgIC8vIEUuZy5cclxuICAgIC8vIGBEZWNpbWFsLnJvdW5kaW5nID0gNDtgXHJcbiAgICAvLyBgRGVjaW1hbC5yb3VuZGluZyA9IERlY2ltYWwuUk9VTkRfSEFMRl9VUDtgXHJcbiAgICByb3VuZGluZzogNCwgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyAwIHRvIDhcclxuXHJcbiAgICAvLyBUaGUgbW9kdWxvIG1vZGUgdXNlZCB3aGVuIGNhbGN1bGF0aW5nIHRoZSBtb2R1bHVzOiBhIG1vZCBuLlxyXG4gICAgLy8gVGhlIHF1b3RpZW50IChxID0gYSAvIG4pIGlzIGNhbGN1bGF0ZWQgYWNjb3JkaW5nIHRvIHRoZSBjb3JyZXNwb25kaW5nIHJvdW5kaW5nIG1vZGUuXHJcbiAgICAvLyBUaGUgcmVtYWluZGVyIChyKSBpcyBjYWxjdWxhdGVkIGFzOiByID0gYSAtIG4gKiBxLlxyXG4gICAgLy9cclxuICAgIC8vIFVQICAgICAgICAgMCBUaGUgcmVtYWluZGVyIGlzIHBvc2l0aXZlIGlmIHRoZSBkaXZpZGVuZCBpcyBuZWdhdGl2ZSwgZWxzZSBpcyBuZWdhdGl2ZS5cclxuICAgIC8vIERPV04gICAgICAgMSBUaGUgcmVtYWluZGVyIGhhcyB0aGUgc2FtZSBzaWduIGFzIHRoZSBkaXZpZGVuZCAoSmF2YVNjcmlwdCAlKS5cclxuICAgIC8vIEZMT09SICAgICAgMyBUaGUgcmVtYWluZGVyIGhhcyB0aGUgc2FtZSBzaWduIGFzIHRoZSBkaXZpc29yIChQeXRob24gJSkuXHJcbiAgICAvLyBIQUxGX0VWRU4gIDYgVGhlIElFRUUgNzU0IHJlbWFpbmRlciBmdW5jdGlvbi5cclxuICAgIC8vIEVVQ0xJRCAgICAgOSBFdWNsaWRpYW4gZGl2aXNpb24uIHEgPSBzaWduKG4pICogZmxvb3IoYSAvIGFicyhuKSkuIEFsd2F5cyBwb3NpdGl2ZS5cclxuICAgIC8vXHJcbiAgICAvLyBUcnVuY2F0ZWQgZGl2aXNpb24gKDEpLCBmbG9vcmVkIGRpdmlzaW9uICgzKSwgdGhlIElFRUUgNzU0IHJlbWFpbmRlciAoNiksIGFuZCBFdWNsaWRpYW5cclxuICAgIC8vIGRpdmlzaW9uICg5KSBhcmUgY29tbW9ubHkgdXNlZCBmb3IgdGhlIG1vZHVsdXMgb3BlcmF0aW9uLiBUaGUgb3RoZXIgcm91bmRpbmcgbW9kZXMgY2FuIGFsc29cclxuICAgIC8vIGJlIHVzZWQsIGJ1dCB0aGV5IG1heSBub3QgZ2l2ZSB1c2VmdWwgcmVzdWx0cy5cclxuICAgIG1vZHVsbzogMSwgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIDAgdG8gOVxyXG5cclxuICAgIC8vIFRoZSBleHBvbmVudCB2YWx1ZSBhdCBhbmQgYmVuZWF0aCB3aGljaCBgdG9TdHJpbmdgIHJldHVybnMgZXhwb25lbnRpYWwgbm90YXRpb24uXHJcbiAgICAvLyBKYXZhU2NyaXB0IG51bWJlcnM6IC03XHJcbiAgICB0b0V4cE5lZzogLTcsICAgICAgICAgICAgICAgICAgICAgICAgICAvLyAwIHRvIC1FWFBfTElNSVRcclxuXHJcbiAgICAvLyBUaGUgZXhwb25lbnQgdmFsdWUgYXQgYW5kIGFib3ZlIHdoaWNoIGB0b1N0cmluZ2AgcmV0dXJucyBleHBvbmVudGlhbCBub3RhdGlvbi5cclxuICAgIC8vIEphdmFTY3JpcHQgbnVtYmVyczogMjFcclxuICAgIHRvRXhwUG9zOiAgMjEsICAgICAgICAgICAgICAgICAgICAgICAgIC8vIDAgdG8gRVhQX0xJTUlUXHJcblxyXG4gICAgLy8gVGhlIG1pbmltdW0gZXhwb25lbnQgdmFsdWUsIGJlbmVhdGggd2hpY2ggdW5kZXJmbG93IHRvIHplcm8gb2NjdXJzLlxyXG4gICAgLy8gSmF2YVNjcmlwdCBudW1iZXJzOiAtMzI0ICAoNWUtMzI0KVxyXG4gICAgbWluRTogLUVYUF9MSU1JVCwgICAgICAgICAgICAgICAgICAgICAgLy8gLTEgdG8gLUVYUF9MSU1JVFxyXG5cclxuICAgIC8vIFRoZSBtYXhpbXVtIGV4cG9uZW50IHZhbHVlLCBhYm92ZSB3aGljaCBvdmVyZmxvdyB0byBJbmZpbml0eSBvY2N1cnMuXHJcbiAgICAvLyBKYXZhU2NyaXB0IG51bWJlcnM6IDMwOCAgKDEuNzk3NjkzMTM0ODYyMzE1N2UrMzA4KVxyXG4gICAgbWF4RTogRVhQX0xJTUlULCAgICAgICAgICAgICAgICAgICAgICAgLy8gMSB0byBFWFBfTElNSVRcclxuXHJcbiAgICAvLyBXaGV0aGVyIHRvIHVzZSBjcnlwdG9ncmFwaGljYWxseS1zZWN1cmUgcmFuZG9tIG51bWJlciBnZW5lcmF0aW9uLCBpZiBhdmFpbGFibGUuXHJcbiAgICBjcnlwdG86IGZhbHNlICAgICAgICAgICAgICAgICAgICAgICAgICAvLyB0cnVlL2ZhbHNlXHJcbiAgfSxcclxuXHJcblxyXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSBFTkQgT0YgRURJVEFCTEUgREVGQVVMVFMgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSAvL1xyXG5cclxuXHJcbiAgaW5leGFjdCwgcXVhZHJhbnQsXHJcbiAgZXh0ZXJuYWwgPSB0cnVlLFxyXG5cclxuICBkZWNpbWFsRXJyb3IgPSAnW0RlY2ltYWxFcnJvcl0gJyxcclxuICBpbnZhbGlkQXJndW1lbnQgPSBkZWNpbWFsRXJyb3IgKyAnSW52YWxpZCBhcmd1bWVudDogJyxcclxuICBwcmVjaXNpb25MaW1pdEV4Y2VlZGVkID0gZGVjaW1hbEVycm9yICsgJ1ByZWNpc2lvbiBsaW1pdCBleGNlZWRlZCcsXHJcbiAgY3J5cHRvVW5hdmFpbGFibGUgPSBkZWNpbWFsRXJyb3IgKyAnY3J5cHRvIHVuYXZhaWxhYmxlJyxcclxuICB0YWcgPSAnW29iamVjdCBEZWNpbWFsXScsXHJcblxyXG4gIG1hdGhmbG9vciA9IE1hdGguZmxvb3IsXHJcbiAgbWF0aHBvdyA9IE1hdGgucG93LFxyXG5cclxuICBpc0JpbmFyeSA9IC9eMGIoWzAxXSsoXFwuWzAxXSopP3xcXC5bMDFdKykocFsrLV0/XFxkKyk/JC9pLFxyXG4gIGlzSGV4ID0gL14weChbMC05YS1mXSsoXFwuWzAtOWEtZl0qKT98XFwuWzAtOWEtZl0rKShwWystXT9cXGQrKT8kL2ksXHJcbiAgaXNPY3RhbCA9IC9eMG8oWzAtN10rKFxcLlswLTddKik/fFxcLlswLTddKykocFsrLV0/XFxkKyk/JC9pLFxyXG4gIGlzRGVjaW1hbCA9IC9eKFxcZCsoXFwuXFxkKik/fFxcLlxcZCspKGVbKy1dP1xcZCspPyQvaSxcclxuXHJcbiAgQkFTRSA9IDFlNyxcclxuICBMT0dfQkFTRSA9IDcsXHJcbiAgTUFYX1NBRkVfSU5URUdFUiA9IDkwMDcxOTkyNTQ3NDA5OTEsXHJcblxyXG4gIExOMTBfUFJFQ0lTSU9OID0gTE4xMC5sZW5ndGggLSAxLFxyXG4gIFBJX1BSRUNJU0lPTiA9IFBJLmxlbmd0aCAtIDEsXHJcblxyXG4gIC8vIERlY2ltYWwucHJvdG90eXBlIG9iamVjdFxyXG4gIFAgPSB7IHRvU3RyaW5nVGFnOiB0YWcgfTtcclxuXHJcblxyXG4vLyBEZWNpbWFsIHByb3RvdHlwZSBtZXRob2RzXHJcblxyXG5cclxuLypcclxuICogIGFic29sdXRlVmFsdWUgICAgICAgICAgICAgYWJzXHJcbiAqICBjZWlsXHJcbiAqICBjbGFtcGVkVG8gICAgICAgICAgICAgICAgIGNsYW1wXHJcbiAqICBjb21wYXJlZFRvICAgICAgICAgICAgICAgIGNtcFxyXG4gKiAgY29zaW5lICAgICAgICAgICAgICAgICAgICBjb3NcclxuICogIGN1YmVSb290ICAgICAgICAgICAgICAgICAgY2JydFxyXG4gKiAgZGVjaW1hbFBsYWNlcyAgICAgICAgICAgICBkcFxyXG4gKiAgZGl2aWRlZEJ5ICAgICAgICAgICAgICAgICBkaXZcclxuICogIGRpdmlkZWRUb0ludGVnZXJCeSAgICAgICAgZGl2VG9JbnRcclxuICogIGVxdWFscyAgICAgICAgICAgICAgICAgICAgZXFcclxuICogIGZsb29yXHJcbiAqICBncmVhdGVyVGhhbiAgICAgICAgICAgICAgIGd0XHJcbiAqICBncmVhdGVyVGhhbk9yRXF1YWxUbyAgICAgIGd0ZVxyXG4gKiAgaHlwZXJib2xpY0Nvc2luZSAgICAgICAgICBjb3NoXHJcbiAqICBoeXBlcmJvbGljU2luZSAgICAgICAgICAgIHNpbmhcclxuICogIGh5cGVyYm9saWNUYW5nZW50ICAgICAgICAgdGFuaFxyXG4gKiAgaW52ZXJzZUNvc2luZSAgICAgICAgICAgICBhY29zXHJcbiAqICBpbnZlcnNlSHlwZXJib2xpY0Nvc2luZSAgIGFjb3NoXHJcbiAqICBpbnZlcnNlSHlwZXJib2xpY1NpbmUgICAgIGFzaW5oXHJcbiAqICBpbnZlcnNlSHlwZXJib2xpY1RhbmdlbnQgIGF0YW5oXHJcbiAqICBpbnZlcnNlU2luZSAgICAgICAgICAgICAgIGFzaW5cclxuICogIGludmVyc2VUYW5nZW50ICAgICAgICAgICAgYXRhblxyXG4gKiAgaXNGaW5pdGVcclxuICogIGlzSW50ZWdlciAgICAgICAgICAgICAgICAgaXNJbnRcclxuICogIGlzTmFOXHJcbiAqICBpc05lZ2F0aXZlICAgICAgICAgICAgICAgIGlzTmVnXHJcbiAqICBpc1Bvc2l0aXZlICAgICAgICAgICAgICAgIGlzUG9zXHJcbiAqICBpc1plcm9cclxuICogIGxlc3NUaGFuICAgICAgICAgICAgICAgICAgbHRcclxuICogIGxlc3NUaGFuT3JFcXVhbFRvICAgICAgICAgbHRlXHJcbiAqICBsb2dhcml0aG0gICAgICAgICAgICAgICAgIGxvZ1xyXG4gKiAgW21heGltdW1dICAgICAgICAgICAgICAgICBbbWF4XVxyXG4gKiAgW21pbmltdW1dICAgICAgICAgICAgICAgICBbbWluXVxyXG4gKiAgbWludXMgICAgICAgICAgICAgICAgICAgICBzdWJcclxuICogIG1vZHVsbyAgICAgICAgICAgICAgICAgICAgbW9kXHJcbiAqICBuYXR1cmFsRXhwb25lbnRpYWwgICAgICAgIGV4cFxyXG4gKiAgbmF0dXJhbExvZ2FyaXRobSAgICAgICAgICBsblxyXG4gKiAgbmVnYXRlZCAgICAgICAgICAgICAgICAgICBuZWdcclxuICogIHBsdXMgICAgICAgICAgICAgICAgICAgICAgYWRkXHJcbiAqICBwcmVjaXNpb24gICAgICAgICAgICAgICAgIHNkXHJcbiAqICByb3VuZFxyXG4gKiAgc2luZSAgICAgICAgICAgICAgICAgICAgICBzaW5cclxuICogIHNxdWFyZVJvb3QgICAgICAgICAgICAgICAgc3FydFxyXG4gKiAgdGFuZ2VudCAgICAgICAgICAgICAgICAgICB0YW5cclxuICogIHRpbWVzICAgICAgICAgICAgICAgICAgICAgbXVsXHJcbiAqICB0b0JpbmFyeVxyXG4gKiAgdG9EZWNpbWFsUGxhY2VzICAgICAgICAgICB0b0RQXHJcbiAqICB0b0V4cG9uZW50aWFsXHJcbiAqICB0b0ZpeGVkXHJcbiAqICB0b0ZyYWN0aW9uXHJcbiAqICB0b0hleGFkZWNpbWFsICAgICAgICAgICAgIHRvSGV4XHJcbiAqICB0b05lYXJlc3RcclxuICogIHRvTnVtYmVyXHJcbiAqICB0b09jdGFsXHJcbiAqICB0b1Bvd2VyICAgICAgICAgICAgICAgICAgIHBvd1xyXG4gKiAgdG9QcmVjaXNpb25cclxuICogIHRvU2lnbmlmaWNhbnREaWdpdHMgICAgICAgdG9TRFxyXG4gKiAgdG9TdHJpbmdcclxuICogIHRydW5jYXRlZCAgICAgICAgICAgICAgICAgdHJ1bmNcclxuICogIHZhbHVlT2YgICAgICAgICAgICAgICAgICAgdG9KU09OXHJcbiAqL1xyXG5cclxuXHJcbi8qXHJcbiAqIFJldHVybiBhIG5ldyBEZWNpbWFsIHdob3NlIHZhbHVlIGlzIHRoZSBhYnNvbHV0ZSB2YWx1ZSBvZiB0aGlzIERlY2ltYWwuXHJcbiAqXHJcbiAqL1xyXG5QLmFic29sdXRlVmFsdWUgPSBQLmFicyA9IGZ1bmN0aW9uICgpIHtcclxuICB2YXIgeCA9IG5ldyB0aGlzLmNvbnN0cnVjdG9yKHRoaXMpO1xyXG4gIGlmICh4LnMgPCAwKSB4LnMgPSAxO1xyXG4gIHJldHVybiBmaW5hbGlzZSh4KTtcclxufTtcclxuXHJcblxyXG4vKlxyXG4gKiBSZXR1cm4gYSBuZXcgRGVjaW1hbCB3aG9zZSB2YWx1ZSBpcyB0aGUgdmFsdWUgb2YgdGhpcyBEZWNpbWFsIHJvdW5kZWQgdG8gYSB3aG9sZSBudW1iZXIgaW4gdGhlXHJcbiAqIGRpcmVjdGlvbiBvZiBwb3NpdGl2ZSBJbmZpbml0eS5cclxuICpcclxuICovXHJcblAuY2VpbCA9IGZ1bmN0aW9uICgpIHtcclxuICByZXR1cm4gZmluYWxpc2UobmV3IHRoaXMuY29uc3RydWN0b3IodGhpcyksIHRoaXMuZSArIDEsIDIpO1xyXG59O1xyXG5cclxuXHJcbi8qXHJcbiAqIFJldHVybiBhIG5ldyBEZWNpbWFsIHdob3NlIHZhbHVlIGlzIHRoZSB2YWx1ZSBvZiB0aGlzIERlY2ltYWwgY2xhbXBlZCB0byB0aGUgcmFuZ2VcclxuICogZGVsaW5lYXRlZCBieSBgbWluYCBhbmQgYG1heGAuXHJcbiAqXHJcbiAqIG1pbiB7bnVtYmVyfHN0cmluZ3xEZWNpbWFsfVxyXG4gKiBtYXgge251bWJlcnxzdHJpbmd8RGVjaW1hbH1cclxuICpcclxuICovXHJcblAuY2xhbXBlZFRvID0gUC5jbGFtcCA9IGZ1bmN0aW9uIChtaW4sIG1heCkge1xyXG4gIHZhciBrLFxyXG4gICAgeCA9IHRoaXMsXHJcbiAgICBDdG9yID0geC5jb25zdHJ1Y3RvcjtcclxuICBtaW4gPSBuZXcgQ3RvcihtaW4pO1xyXG4gIG1heCA9IG5ldyBDdG9yKG1heCk7XHJcbiAgaWYgKCFtaW4ucyB8fCAhbWF4LnMpIHJldHVybiBuZXcgQ3RvcihOYU4pO1xyXG4gIGlmIChtaW4uZ3QobWF4KSkgdGhyb3cgRXJyb3IoaW52YWxpZEFyZ3VtZW50ICsgbWF4KTtcclxuICBrID0geC5jbXAobWluKTtcclxuICByZXR1cm4gayA8IDAgPyBtaW4gOiB4LmNtcChtYXgpID4gMCA/IG1heCA6IG5ldyBDdG9yKHgpO1xyXG59O1xyXG5cclxuXHJcbi8qXHJcbiAqIFJldHVyblxyXG4gKiAgIDEgICAgaWYgdGhlIHZhbHVlIG9mIHRoaXMgRGVjaW1hbCBpcyBncmVhdGVyIHRoYW4gdGhlIHZhbHVlIG9mIGB5YCxcclxuICogIC0xICAgIGlmIHRoZSB2YWx1ZSBvZiB0aGlzIERlY2ltYWwgaXMgbGVzcyB0aGFuIHRoZSB2YWx1ZSBvZiBgeWAsXHJcbiAqICAgMCAgICBpZiB0aGV5IGhhdmUgdGhlIHNhbWUgdmFsdWUsXHJcbiAqICAgTmFOICBpZiB0aGUgdmFsdWUgb2YgZWl0aGVyIERlY2ltYWwgaXMgTmFOLlxyXG4gKlxyXG4gKi9cclxuUC5jb21wYXJlZFRvID0gUC5jbXAgPSBmdW5jdGlvbiAoeSkge1xyXG4gIHZhciBpLCBqLCB4ZEwsIHlkTCxcclxuICAgIHggPSB0aGlzLFxyXG4gICAgeGQgPSB4LmQsXHJcbiAgICB5ZCA9ICh5ID0gbmV3IHguY29uc3RydWN0b3IoeSkpLmQsXHJcbiAgICB4cyA9IHgucyxcclxuICAgIHlzID0geS5zO1xyXG5cclxuICAvLyBFaXRoZXIgTmFOIG9yIFx1MDBCMUluZmluaXR5P1xyXG4gIGlmICgheGQgfHwgIXlkKSB7XHJcbiAgICByZXR1cm4gIXhzIHx8ICF5cyA/IE5hTiA6IHhzICE9PSB5cyA/IHhzIDogeGQgPT09IHlkID8gMCA6ICF4ZCBeIHhzIDwgMCA/IDEgOiAtMTtcclxuICB9XHJcblxyXG4gIC8vIEVpdGhlciB6ZXJvP1xyXG4gIGlmICgheGRbMF0gfHwgIXlkWzBdKSByZXR1cm4geGRbMF0gPyB4cyA6IHlkWzBdID8gLXlzIDogMDtcclxuXHJcbiAgLy8gU2lnbnMgZGlmZmVyP1xyXG4gIGlmICh4cyAhPT0geXMpIHJldHVybiB4cztcclxuXHJcbiAgLy8gQ29tcGFyZSBleHBvbmVudHMuXHJcbiAgaWYgKHguZSAhPT0geS5lKSByZXR1cm4geC5lID4geS5lIF4geHMgPCAwID8gMSA6IC0xO1xyXG5cclxuICB4ZEwgPSB4ZC5sZW5ndGg7XHJcbiAgeWRMID0geWQubGVuZ3RoO1xyXG5cclxuICAvLyBDb21wYXJlIGRpZ2l0IGJ5IGRpZ2l0LlxyXG4gIGZvciAoaSA9IDAsIGogPSB4ZEwgPCB5ZEwgPyB4ZEwgOiB5ZEw7IGkgPCBqOyArK2kpIHtcclxuICAgIGlmICh4ZFtpXSAhPT0geWRbaV0pIHJldHVybiB4ZFtpXSA+IHlkW2ldIF4geHMgPCAwID8gMSA6IC0xO1xyXG4gIH1cclxuXHJcbiAgLy8gQ29tcGFyZSBsZW5ndGhzLlxyXG4gIHJldHVybiB4ZEwgPT09IHlkTCA/IDAgOiB4ZEwgPiB5ZEwgXiB4cyA8IDAgPyAxIDogLTE7XHJcbn07XHJcblxyXG5cclxuLypcclxuICogUmV0dXJuIGEgbmV3IERlY2ltYWwgd2hvc2UgdmFsdWUgaXMgdGhlIGNvc2luZSBvZiB0aGUgdmFsdWUgaW4gcmFkaWFucyBvZiB0aGlzIERlY2ltYWwuXHJcbiAqXHJcbiAqIERvbWFpbjogWy1JbmZpbml0eSwgSW5maW5pdHldXHJcbiAqIFJhbmdlOiBbLTEsIDFdXHJcbiAqXHJcbiAqIGNvcygwKSAgICAgICAgID0gMVxyXG4gKiBjb3MoLTApICAgICAgICA9IDFcclxuICogY29zKEluZmluaXR5KSAgPSBOYU5cclxuICogY29zKC1JbmZpbml0eSkgPSBOYU5cclxuICogY29zKE5hTikgICAgICAgPSBOYU5cclxuICpcclxuICovXHJcblAuY29zaW5lID0gUC5jb3MgPSBmdW5jdGlvbiAoKSB7XHJcbiAgdmFyIHByLCBybSxcclxuICAgIHggPSB0aGlzLFxyXG4gICAgQ3RvciA9IHguY29uc3RydWN0b3I7XHJcblxyXG4gIGlmICgheC5kKSByZXR1cm4gbmV3IEN0b3IoTmFOKTtcclxuXHJcbiAgLy8gY29zKDApID0gY29zKC0wKSA9IDFcclxuICBpZiAoIXguZFswXSkgcmV0dXJuIG5ldyBDdG9yKDEpO1xyXG5cclxuICBwciA9IEN0b3IucHJlY2lzaW9uO1xyXG4gIHJtID0gQ3Rvci5yb3VuZGluZztcclxuICBDdG9yLnByZWNpc2lvbiA9IHByICsgTWF0aC5tYXgoeC5lLCB4LnNkKCkpICsgTE9HX0JBU0U7XHJcbiAgQ3Rvci5yb3VuZGluZyA9IDE7XHJcblxyXG4gIHggPSBjb3NpbmUoQ3RvciwgdG9MZXNzVGhhbkhhbGZQaShDdG9yLCB4KSk7XHJcblxyXG4gIEN0b3IucHJlY2lzaW9uID0gcHI7XHJcbiAgQ3Rvci5yb3VuZGluZyA9IHJtO1xyXG5cclxuICByZXR1cm4gZmluYWxpc2UocXVhZHJhbnQgPT0gMiB8fCBxdWFkcmFudCA9PSAzID8geC5uZWcoKSA6IHgsIHByLCBybSwgdHJ1ZSk7XHJcbn07XHJcblxyXG5cclxuLypcclxuICpcclxuICogUmV0dXJuIGEgbmV3IERlY2ltYWwgd2hvc2UgdmFsdWUgaXMgdGhlIGN1YmUgcm9vdCBvZiB0aGUgdmFsdWUgb2YgdGhpcyBEZWNpbWFsLCByb3VuZGVkIHRvXHJcbiAqIGBwcmVjaXNpb25gIHNpZ25pZmljYW50IGRpZ2l0cyB1c2luZyByb3VuZGluZyBtb2RlIGByb3VuZGluZ2AuXHJcbiAqXHJcbiAqICBjYnJ0KDApICA9ICAwXHJcbiAqICBjYnJ0KC0wKSA9IC0wXHJcbiAqICBjYnJ0KDEpICA9ICAxXHJcbiAqICBjYnJ0KC0xKSA9IC0xXHJcbiAqICBjYnJ0KE4pICA9ICBOXHJcbiAqICBjYnJ0KC1JKSA9IC1JXHJcbiAqICBjYnJ0KEkpICA9ICBJXHJcbiAqXHJcbiAqIE1hdGguY2JydCh4KSA9ICh4IDwgMCA/IC1NYXRoLnBvdygteCwgMS8zKSA6IE1hdGgucG93KHgsIDEvMykpXHJcbiAqXHJcbiAqL1xyXG5QLmN1YmVSb290ID0gUC5jYnJ0ID0gZnVuY3Rpb24gKCkge1xyXG4gIHZhciBlLCBtLCBuLCByLCByZXAsIHMsIHNkLCB0LCB0MywgdDNwbHVzeCxcclxuICAgIHggPSB0aGlzLFxyXG4gICAgQ3RvciA9IHguY29uc3RydWN0b3I7XHJcblxyXG4gIGlmICgheC5pc0Zpbml0ZSgpIHx8IHguaXNaZXJvKCkpIHJldHVybiBuZXcgQ3Rvcih4KTtcclxuICBleHRlcm5hbCA9IGZhbHNlO1xyXG5cclxuICAvLyBJbml0aWFsIGVzdGltYXRlLlxyXG4gIHMgPSB4LnMgKiBtYXRocG93KHgucyAqIHgsIDEgLyAzKTtcclxuXHJcbiAgIC8vIE1hdGguY2JydCB1bmRlcmZsb3cvb3ZlcmZsb3c/XHJcbiAgIC8vIFBhc3MgeCB0byBNYXRoLnBvdyBhcyBpbnRlZ2VyLCB0aGVuIGFkanVzdCB0aGUgZXhwb25lbnQgb2YgdGhlIHJlc3VsdC5cclxuICBpZiAoIXMgfHwgTWF0aC5hYnMocykgPT0gMSAvIDApIHtcclxuICAgIG4gPSBkaWdpdHNUb1N0cmluZyh4LmQpO1xyXG4gICAgZSA9IHguZTtcclxuXHJcbiAgICAvLyBBZGp1c3QgbiBleHBvbmVudCBzbyBpdCBpcyBhIG11bHRpcGxlIG9mIDMgYXdheSBmcm9tIHggZXhwb25lbnQuXHJcbiAgICBpZiAocyA9IChlIC0gbi5sZW5ndGggKyAxKSAlIDMpIG4gKz0gKHMgPT0gMSB8fCBzID09IC0yID8gJzAnIDogJzAwJyk7XHJcbiAgICBzID0gbWF0aHBvdyhuLCAxIC8gMyk7XHJcblxyXG4gICAgLy8gUmFyZWx5LCBlIG1heSBiZSBvbmUgbGVzcyB0aGFuIHRoZSByZXN1bHQgZXhwb25lbnQgdmFsdWUuXHJcbiAgICBlID0gbWF0aGZsb29yKChlICsgMSkgLyAzKSAtIChlICUgMyA9PSAoZSA8IDAgPyAtMSA6IDIpKTtcclxuXHJcbiAgICBpZiAocyA9PSAxIC8gMCkge1xyXG4gICAgICBuID0gJzVlJyArIGU7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICBuID0gcy50b0V4cG9uZW50aWFsKCk7XHJcbiAgICAgIG4gPSBuLnNsaWNlKDAsIG4uaW5kZXhPZignZScpICsgMSkgKyBlO1xyXG4gICAgfVxyXG5cclxuICAgIHIgPSBuZXcgQ3RvcihuKTtcclxuICAgIHIucyA9IHgucztcclxuICB9IGVsc2Uge1xyXG4gICAgciA9IG5ldyBDdG9yKHMudG9TdHJpbmcoKSk7XHJcbiAgfVxyXG5cclxuICBzZCA9IChlID0gQ3Rvci5wcmVjaXNpb24pICsgMztcclxuXHJcbiAgLy8gSGFsbGV5J3MgbWV0aG9kLlxyXG4gIC8vIFRPRE8/IENvbXBhcmUgTmV3dG9uJ3MgbWV0aG9kLlxyXG4gIGZvciAoOzspIHtcclxuICAgIHQgPSByO1xyXG4gICAgdDMgPSB0LnRpbWVzKHQpLnRpbWVzKHQpO1xyXG4gICAgdDNwbHVzeCA9IHQzLnBsdXMoeCk7XHJcbiAgICByID0gZGl2aWRlKHQzcGx1c3gucGx1cyh4KS50aW1lcyh0KSwgdDNwbHVzeC5wbHVzKHQzKSwgc2QgKyAyLCAxKTtcclxuXHJcbiAgICAvLyBUT0RPPyBSZXBsYWNlIHdpdGggZm9yLWxvb3AgYW5kIGNoZWNrUm91bmRpbmdEaWdpdHMuXHJcbiAgICBpZiAoZGlnaXRzVG9TdHJpbmcodC5kKS5zbGljZSgwLCBzZCkgPT09IChuID0gZGlnaXRzVG9TdHJpbmcoci5kKSkuc2xpY2UoMCwgc2QpKSB7XHJcbiAgICAgIG4gPSBuLnNsaWNlKHNkIC0gMywgc2QgKyAxKTtcclxuXHJcbiAgICAgIC8vIFRoZSA0dGggcm91bmRpbmcgZGlnaXQgbWF5IGJlIGluIGVycm9yIGJ5IC0xIHNvIGlmIHRoZSA0IHJvdW5kaW5nIGRpZ2l0cyBhcmUgOTk5OSBvciA0OTk5XHJcbiAgICAgIC8vICwgaS5lLiBhcHByb2FjaGluZyBhIHJvdW5kaW5nIGJvdW5kYXJ5LCBjb250aW51ZSB0aGUgaXRlcmF0aW9uLlxyXG4gICAgICBpZiAobiA9PSAnOTk5OScgfHwgIXJlcCAmJiBuID09ICc0OTk5Jykge1xyXG5cclxuICAgICAgICAvLyBPbiB0aGUgZmlyc3QgaXRlcmF0aW9uIG9ubHksIGNoZWNrIHRvIHNlZSBpZiByb3VuZGluZyB1cCBnaXZlcyB0aGUgZXhhY3QgcmVzdWx0IGFzIHRoZVxyXG4gICAgICAgIC8vIG5pbmVzIG1heSBpbmZpbml0ZWx5IHJlcGVhdC5cclxuICAgICAgICBpZiAoIXJlcCkge1xyXG4gICAgICAgICAgZmluYWxpc2UodCwgZSArIDEsIDApO1xyXG5cclxuICAgICAgICAgIGlmICh0LnRpbWVzKHQpLnRpbWVzKHQpLmVxKHgpKSB7XHJcbiAgICAgICAgICAgIHIgPSB0O1xyXG4gICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHNkICs9IDQ7XHJcbiAgICAgICAgcmVwID0gMTtcclxuICAgICAgfSBlbHNlIHtcclxuXHJcbiAgICAgICAgLy8gSWYgdGhlIHJvdW5kaW5nIGRpZ2l0cyBhcmUgbnVsbCwgMHswLDR9IG9yIDUwezAsM30sIGNoZWNrIGZvciBhbiBleGFjdCByZXN1bHQuXHJcbiAgICAgICAgLy8gSWYgbm90LCB0aGVuIHRoZXJlIGFyZSBmdXJ0aGVyIGRpZ2l0cyBhbmQgbSB3aWxsIGJlIHRydXRoeS5cclxuICAgICAgICBpZiAoIStuIHx8ICErbi5zbGljZSgxKSAmJiBuLmNoYXJBdCgwKSA9PSAnNScpIHtcclxuXHJcbiAgICAgICAgICAvLyBUcnVuY2F0ZSB0byB0aGUgZmlyc3Qgcm91bmRpbmcgZGlnaXQuXHJcbiAgICAgICAgICBmaW5hbGlzZShyLCBlICsgMSwgMSk7XHJcbiAgICAgICAgICBtID0gIXIudGltZXMocikudGltZXMocikuZXEoeCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBicmVhaztcclxuICAgICAgfVxyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgZXh0ZXJuYWwgPSB0cnVlO1xyXG5cclxuICByZXR1cm4gZmluYWxpc2UociwgZSwgQ3Rvci5yb3VuZGluZywgbSk7XHJcbn07XHJcblxyXG5cclxuLypcclxuICogUmV0dXJuIHRoZSBudW1iZXIgb2YgZGVjaW1hbCBwbGFjZXMgb2YgdGhlIHZhbHVlIG9mIHRoaXMgRGVjaW1hbC5cclxuICpcclxuICovXHJcblAuZGVjaW1hbFBsYWNlcyA9IFAuZHAgPSBmdW5jdGlvbiAoKSB7XHJcbiAgdmFyIHcsXHJcbiAgICBkID0gdGhpcy5kLFxyXG4gICAgbiA9IE5hTjtcclxuXHJcbiAgaWYgKGQpIHtcclxuICAgIHcgPSBkLmxlbmd0aCAtIDE7XHJcbiAgICBuID0gKHcgLSBtYXRoZmxvb3IodGhpcy5lIC8gTE9HX0JBU0UpKSAqIExPR19CQVNFO1xyXG5cclxuICAgIC8vIFN1YnRyYWN0IHRoZSBudW1iZXIgb2YgdHJhaWxpbmcgemVyb3Mgb2YgdGhlIGxhc3Qgd29yZC5cclxuICAgIHcgPSBkW3ddO1xyXG4gICAgaWYgKHcpIGZvciAoOyB3ICUgMTAgPT0gMDsgdyAvPSAxMCkgbi0tO1xyXG4gICAgaWYgKG4gPCAwKSBuID0gMDtcclxuICB9XHJcblxyXG4gIHJldHVybiBuO1xyXG59O1xyXG5cclxuXHJcbi8qXHJcbiAqICBuIC8gMCA9IElcclxuICogIG4gLyBOID0gTlxyXG4gKiAgbiAvIEkgPSAwXHJcbiAqICAwIC8gbiA9IDBcclxuICogIDAgLyAwID0gTlxyXG4gKiAgMCAvIE4gPSBOXHJcbiAqICAwIC8gSSA9IDBcclxuICogIE4gLyBuID0gTlxyXG4gKiAgTiAvIDAgPSBOXHJcbiAqICBOIC8gTiA9IE5cclxuICogIE4gLyBJID0gTlxyXG4gKiAgSSAvIG4gPSBJXHJcbiAqICBJIC8gMCA9IElcclxuICogIEkgLyBOID0gTlxyXG4gKiAgSSAvIEkgPSBOXHJcbiAqXHJcbiAqIFJldHVybiBhIG5ldyBEZWNpbWFsIHdob3NlIHZhbHVlIGlzIHRoZSB2YWx1ZSBvZiB0aGlzIERlY2ltYWwgZGl2aWRlZCBieSBgeWAsIHJvdW5kZWQgdG9cclxuICogYHByZWNpc2lvbmAgc2lnbmlmaWNhbnQgZGlnaXRzIHVzaW5nIHJvdW5kaW5nIG1vZGUgYHJvdW5kaW5nYC5cclxuICpcclxuICovXHJcblAuZGl2aWRlZEJ5ID0gUC5kaXYgPSBmdW5jdGlvbiAoeSkge1xyXG4gIHJldHVybiBkaXZpZGUodGhpcywgbmV3IHRoaXMuY29uc3RydWN0b3IoeSkpO1xyXG59O1xyXG5cclxuXHJcbi8qXHJcbiAqIFJldHVybiBhIG5ldyBEZWNpbWFsIHdob3NlIHZhbHVlIGlzIHRoZSBpbnRlZ2VyIHBhcnQgb2YgZGl2aWRpbmcgdGhlIHZhbHVlIG9mIHRoaXMgRGVjaW1hbFxyXG4gKiBieSB0aGUgdmFsdWUgb2YgYHlgLCByb3VuZGVkIHRvIGBwcmVjaXNpb25gIHNpZ25pZmljYW50IGRpZ2l0cyB1c2luZyByb3VuZGluZyBtb2RlIGByb3VuZGluZ2AuXHJcbiAqXHJcbiAqL1xyXG5QLmRpdmlkZWRUb0ludGVnZXJCeSA9IFAuZGl2VG9JbnQgPSBmdW5jdGlvbiAoeSkge1xyXG4gIHZhciB4ID0gdGhpcyxcclxuICAgIEN0b3IgPSB4LmNvbnN0cnVjdG9yO1xyXG4gIHJldHVybiBmaW5hbGlzZShkaXZpZGUoeCwgbmV3IEN0b3IoeSksIDAsIDEsIDEpLCBDdG9yLnByZWNpc2lvbiwgQ3Rvci5yb3VuZGluZyk7XHJcbn07XHJcblxyXG5cclxuLypcclxuICogUmV0dXJuIHRydWUgaWYgdGhlIHZhbHVlIG9mIHRoaXMgRGVjaW1hbCBpcyBlcXVhbCB0byB0aGUgdmFsdWUgb2YgYHlgLCBvdGhlcndpc2UgcmV0dXJuIGZhbHNlLlxyXG4gKlxyXG4gKi9cclxuUC5lcXVhbHMgPSBQLmVxID0gZnVuY3Rpb24gKHkpIHtcclxuICByZXR1cm4gdGhpcy5jbXAoeSkgPT09IDA7XHJcbn07XHJcblxyXG5cclxuLypcclxuICogUmV0dXJuIGEgbmV3IERlY2ltYWwgd2hvc2UgdmFsdWUgaXMgdGhlIHZhbHVlIG9mIHRoaXMgRGVjaW1hbCByb3VuZGVkIHRvIGEgd2hvbGUgbnVtYmVyIGluIHRoZVxyXG4gKiBkaXJlY3Rpb24gb2YgbmVnYXRpdmUgSW5maW5pdHkuXHJcbiAqXHJcbiAqL1xyXG5QLmZsb29yID0gZnVuY3Rpb24gKCkge1xyXG4gIHJldHVybiBmaW5hbGlzZShuZXcgdGhpcy5jb25zdHJ1Y3Rvcih0aGlzKSwgdGhpcy5lICsgMSwgMyk7XHJcbn07XHJcblxyXG5cclxuLypcclxuICogUmV0dXJuIHRydWUgaWYgdGhlIHZhbHVlIG9mIHRoaXMgRGVjaW1hbCBpcyBncmVhdGVyIHRoYW4gdGhlIHZhbHVlIG9mIGB5YCwgb3RoZXJ3aXNlIHJldHVyblxyXG4gKiBmYWxzZS5cclxuICpcclxuICovXHJcblAuZ3JlYXRlclRoYW4gPSBQLmd0ID0gZnVuY3Rpb24gKHkpIHtcclxuICByZXR1cm4gdGhpcy5jbXAoeSkgPiAwO1xyXG59O1xyXG5cclxuXHJcbi8qXHJcbiAqIFJldHVybiB0cnVlIGlmIHRoZSB2YWx1ZSBvZiB0aGlzIERlY2ltYWwgaXMgZ3JlYXRlciB0aGFuIG9yIGVxdWFsIHRvIHRoZSB2YWx1ZSBvZiBgeWAsXHJcbiAqIG90aGVyd2lzZSByZXR1cm4gZmFsc2UuXHJcbiAqXHJcbiAqL1xyXG5QLmdyZWF0ZXJUaGFuT3JFcXVhbFRvID0gUC5ndGUgPSBmdW5jdGlvbiAoeSkge1xyXG4gIHZhciBrID0gdGhpcy5jbXAoeSk7XHJcbiAgcmV0dXJuIGsgPT0gMSB8fCBrID09PSAwO1xyXG59O1xyXG5cclxuXHJcbi8qXHJcbiAqIFJldHVybiBhIG5ldyBEZWNpbWFsIHdob3NlIHZhbHVlIGlzIHRoZSBoeXBlcmJvbGljIGNvc2luZSBvZiB0aGUgdmFsdWUgaW4gcmFkaWFucyBvZiB0aGlzXHJcbiAqIERlY2ltYWwuXHJcbiAqXHJcbiAqIERvbWFpbjogWy1JbmZpbml0eSwgSW5maW5pdHldXHJcbiAqIFJhbmdlOiBbMSwgSW5maW5pdHldXHJcbiAqXHJcbiAqIGNvc2goeCkgPSAxICsgeF4yLzIhICsgeF40LzQhICsgeF42LzYhICsgLi4uXHJcbiAqXHJcbiAqIGNvc2goMCkgICAgICAgICA9IDFcclxuICogY29zaCgtMCkgICAgICAgID0gMVxyXG4gKiBjb3NoKEluZmluaXR5KSAgPSBJbmZpbml0eVxyXG4gKiBjb3NoKC1JbmZpbml0eSkgPSBJbmZpbml0eVxyXG4gKiBjb3NoKE5hTikgICAgICAgPSBOYU5cclxuICpcclxuICogIHggICAgICAgIHRpbWUgdGFrZW4gKG1zKSAgIHJlc3VsdFxyXG4gKiAxMDAwICAgICAgOSAgICAgICAgICAgICAgICAgOS44NTAzNTU1NzAwODUyMzQ5Njk0ZSs0MzNcclxuICogMTAwMDAgICAgIDI1ICAgICAgICAgICAgICAgIDQuNDAzNDA5MTEyODMxNDYwNzkzNmUrNDM0MlxyXG4gKiAxMDAwMDAgICAgMTcxICAgICAgICAgICAgICAgMS40MDMzMzE2ODAyMTMwNjE1ODk3ZSs0MzQyOVxyXG4gKiAxMDAwMDAwICAgMzgxNyAgICAgICAgICAgICAgMS41MTY2MDc2OTg0MDEwNDM3NzI1ZSs0MzQyOTRcclxuICogMTAwMDAwMDAgIGFiYW5kb25lZCBhZnRlciAyIG1pbnV0ZSB3YWl0XHJcbiAqXHJcbiAqIFRPRE8/IENvbXBhcmUgcGVyZm9ybWFuY2Ugb2YgY29zaCh4KSA9IDAuNSAqIChleHAoeCkgKyBleHAoLXgpKVxyXG4gKlxyXG4gKi9cclxuUC5oeXBlcmJvbGljQ29zaW5lID0gUC5jb3NoID0gZnVuY3Rpb24gKCkge1xyXG4gIHZhciBrLCBuLCBwciwgcm0sIGxlbixcclxuICAgIHggPSB0aGlzLFxyXG4gICAgQ3RvciA9IHguY29uc3RydWN0b3IsXHJcbiAgICBvbmUgPSBuZXcgQ3RvcigxKTtcclxuXHJcbiAgaWYgKCF4LmlzRmluaXRlKCkpIHJldHVybiBuZXcgQ3Rvcih4LnMgPyAxIC8gMCA6IE5hTik7XHJcbiAgaWYgKHguaXNaZXJvKCkpIHJldHVybiBvbmU7XHJcblxyXG4gIHByID0gQ3Rvci5wcmVjaXNpb247XHJcbiAgcm0gPSBDdG9yLnJvdW5kaW5nO1xyXG4gIEN0b3IucHJlY2lzaW9uID0gcHIgKyBNYXRoLm1heCh4LmUsIHguc2QoKSkgKyA0O1xyXG4gIEN0b3Iucm91bmRpbmcgPSAxO1xyXG4gIGxlbiA9IHguZC5sZW5ndGg7XHJcblxyXG4gIC8vIEFyZ3VtZW50IHJlZHVjdGlvbjogY29zKDR4KSA9IDEgLSA4Y29zXjIoeCkgKyA4Y29zXjQoeCkgKyAxXHJcbiAgLy8gaS5lLiBjb3MoeCkgPSAxIC0gY29zXjIoeC80KSg4IC0gOGNvc14yKHgvNCkpXHJcblxyXG4gIC8vIEVzdGltYXRlIHRoZSBvcHRpbXVtIG51bWJlciBvZiB0aW1lcyB0byB1c2UgdGhlIGFyZ3VtZW50IHJlZHVjdGlvbi5cclxuICAvLyBUT0RPPyBFc3RpbWF0aW9uIHJldXNlZCBmcm9tIGNvc2luZSgpIGFuZCBtYXkgbm90IGJlIG9wdGltYWwgaGVyZS5cclxuICBpZiAobGVuIDwgMzIpIHtcclxuICAgIGsgPSBNYXRoLmNlaWwobGVuIC8gMyk7XHJcbiAgICBuID0gKDEgLyB0aW55UG93KDQsIGspKS50b1N0cmluZygpO1xyXG4gIH0gZWxzZSB7XHJcbiAgICBrID0gMTY7XHJcbiAgICBuID0gJzIuMzI4MzA2NDM2NTM4Njk2Mjg5MDYyNWUtMTAnO1xyXG4gIH1cclxuXHJcbiAgeCA9IHRheWxvclNlcmllcyhDdG9yLCAxLCB4LnRpbWVzKG4pLCBuZXcgQ3RvcigxKSwgdHJ1ZSk7XHJcblxyXG4gIC8vIFJldmVyc2UgYXJndW1lbnQgcmVkdWN0aW9uXHJcbiAgdmFyIGNvc2gyX3gsXHJcbiAgICBpID0gayxcclxuICAgIGQ4ID0gbmV3IEN0b3IoOCk7XHJcbiAgZm9yICg7IGktLTspIHtcclxuICAgIGNvc2gyX3ggPSB4LnRpbWVzKHgpO1xyXG4gICAgeCA9IG9uZS5taW51cyhjb3NoMl94LnRpbWVzKGQ4Lm1pbnVzKGNvc2gyX3gudGltZXMoZDgpKSkpO1xyXG4gIH1cclxuXHJcbiAgcmV0dXJuIGZpbmFsaXNlKHgsIEN0b3IucHJlY2lzaW9uID0gcHIsIEN0b3Iucm91bmRpbmcgPSBybSwgdHJ1ZSk7XHJcbn07XHJcblxyXG5cclxuLypcclxuICogUmV0dXJuIGEgbmV3IERlY2ltYWwgd2hvc2UgdmFsdWUgaXMgdGhlIGh5cGVyYm9saWMgc2luZSBvZiB0aGUgdmFsdWUgaW4gcmFkaWFucyBvZiB0aGlzXHJcbiAqIERlY2ltYWwuXHJcbiAqXHJcbiAqIERvbWFpbjogWy1JbmZpbml0eSwgSW5maW5pdHldXHJcbiAqIFJhbmdlOiBbLUluZmluaXR5LCBJbmZpbml0eV1cclxuICpcclxuICogc2luaCh4KSA9IHggKyB4XjMvMyEgKyB4XjUvNSEgKyB4XjcvNyEgKyAuLi5cclxuICpcclxuICogc2luaCgwKSAgICAgICAgID0gMFxyXG4gKiBzaW5oKC0wKSAgICAgICAgPSAtMFxyXG4gKiBzaW5oKEluZmluaXR5KSAgPSBJbmZpbml0eVxyXG4gKiBzaW5oKC1JbmZpbml0eSkgPSAtSW5maW5pdHlcclxuICogc2luaChOYU4pICAgICAgID0gTmFOXHJcbiAqXHJcbiAqIHggICAgICAgIHRpbWUgdGFrZW4gKG1zKVxyXG4gKiAxMCAgICAgICAyIG1zXHJcbiAqIDEwMCAgICAgIDUgbXNcclxuICogMTAwMCAgICAgMTQgbXNcclxuICogMTAwMDAgICAgODIgbXNcclxuICogMTAwMDAwICAgODg2IG1zICAgICAgICAgICAgMS40MDMzMzE2ODAyMTMwNjE1ODk3ZSs0MzQyOVxyXG4gKiAyMDAwMDAgICAyNjEzIG1zXHJcbiAqIDMwMDAwMCAgIDU0MDcgbXNcclxuICogNDAwMDAwICAgODgyNCBtc1xyXG4gKiA1MDAwMDAgICAxMzAyNiBtcyAgICAgICAgICA4LjcwODA2NDM2MTI3MTgwODQxMjllKzIxNzE0NlxyXG4gKiAxMDAwMDAwICA0ODU0MyBtc1xyXG4gKlxyXG4gKiBUT0RPPyBDb21wYXJlIHBlcmZvcm1hbmNlIG9mIHNpbmgoeCkgPSAwLjUgKiAoZXhwKHgpIC0gZXhwKC14KSlcclxuICpcclxuICovXHJcblAuaHlwZXJib2xpY1NpbmUgPSBQLnNpbmggPSBmdW5jdGlvbiAoKSB7XHJcbiAgdmFyIGssIHByLCBybSwgbGVuLFxyXG4gICAgeCA9IHRoaXMsXHJcbiAgICBDdG9yID0geC5jb25zdHJ1Y3RvcjtcclxuXHJcbiAgaWYgKCF4LmlzRmluaXRlKCkgfHwgeC5pc1plcm8oKSkgcmV0dXJuIG5ldyBDdG9yKHgpO1xyXG5cclxuICBwciA9IEN0b3IucHJlY2lzaW9uO1xyXG4gIHJtID0gQ3Rvci5yb3VuZGluZztcclxuICBDdG9yLnByZWNpc2lvbiA9IHByICsgTWF0aC5tYXgoeC5lLCB4LnNkKCkpICsgNDtcclxuICBDdG9yLnJvdW5kaW5nID0gMTtcclxuICBsZW4gPSB4LmQubGVuZ3RoO1xyXG5cclxuICBpZiAobGVuIDwgMykge1xyXG4gICAgeCA9IHRheWxvclNlcmllcyhDdG9yLCAyLCB4LCB4LCB0cnVlKTtcclxuICB9IGVsc2Uge1xyXG5cclxuICAgIC8vIEFsdGVybmF0aXZlIGFyZ3VtZW50IHJlZHVjdGlvbjogc2luaCgzeCkgPSBzaW5oKHgpKDMgKyA0c2luaF4yKHgpKVxyXG4gICAgLy8gaS5lLiBzaW5oKHgpID0gc2luaCh4LzMpKDMgKyA0c2luaF4yKHgvMykpXHJcbiAgICAvLyAzIG11bHRpcGxpY2F0aW9ucyBhbmQgMSBhZGRpdGlvblxyXG5cclxuICAgIC8vIEFyZ3VtZW50IHJlZHVjdGlvbjogc2luaCg1eCkgPSBzaW5oKHgpKDUgKyBzaW5oXjIoeCkoMjAgKyAxNnNpbmheMih4KSkpXHJcbiAgICAvLyBpLmUuIHNpbmgoeCkgPSBzaW5oKHgvNSkoNSArIHNpbmheMih4LzUpKDIwICsgMTZzaW5oXjIoeC81KSkpXHJcbiAgICAvLyA0IG11bHRpcGxpY2F0aW9ucyBhbmQgMiBhZGRpdGlvbnNcclxuXHJcbiAgICAvLyBFc3RpbWF0ZSB0aGUgb3B0aW11bSBudW1iZXIgb2YgdGltZXMgdG8gdXNlIHRoZSBhcmd1bWVudCByZWR1Y3Rpb24uXHJcbiAgICBrID0gMS40ICogTWF0aC5zcXJ0KGxlbik7XHJcbiAgICBrID0gayA+IDE2ID8gMTYgOiBrIHwgMDtcclxuXHJcbiAgICB4ID0geC50aW1lcygxIC8gdGlueVBvdyg1LCBrKSk7XHJcbiAgICB4ID0gdGF5bG9yU2VyaWVzKEN0b3IsIDIsIHgsIHgsIHRydWUpO1xyXG5cclxuICAgIC8vIFJldmVyc2UgYXJndW1lbnQgcmVkdWN0aW9uXHJcbiAgICB2YXIgc2luaDJfeCxcclxuICAgICAgZDUgPSBuZXcgQ3Rvcig1KSxcclxuICAgICAgZDE2ID0gbmV3IEN0b3IoMTYpLFxyXG4gICAgICBkMjAgPSBuZXcgQ3RvcigyMCk7XHJcbiAgICBmb3IgKDsgay0tOykge1xyXG4gICAgICBzaW5oMl94ID0geC50aW1lcyh4KTtcclxuICAgICAgeCA9IHgudGltZXMoZDUucGx1cyhzaW5oMl94LnRpbWVzKGQxNi50aW1lcyhzaW5oMl94KS5wbHVzKGQyMCkpKSk7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBDdG9yLnByZWNpc2lvbiA9IHByO1xyXG4gIEN0b3Iucm91bmRpbmcgPSBybTtcclxuXHJcbiAgcmV0dXJuIGZpbmFsaXNlKHgsIHByLCBybSwgdHJ1ZSk7XHJcbn07XHJcblxyXG5cclxuLypcclxuICogUmV0dXJuIGEgbmV3IERlY2ltYWwgd2hvc2UgdmFsdWUgaXMgdGhlIGh5cGVyYm9saWMgdGFuZ2VudCBvZiB0aGUgdmFsdWUgaW4gcmFkaWFucyBvZiB0aGlzXHJcbiAqIERlY2ltYWwuXHJcbiAqXHJcbiAqIERvbWFpbjogWy1JbmZpbml0eSwgSW5maW5pdHldXHJcbiAqIFJhbmdlOiBbLTEsIDFdXHJcbiAqXHJcbiAqIHRhbmgoeCkgPSBzaW5oKHgpIC8gY29zaCh4KVxyXG4gKlxyXG4gKiB0YW5oKDApICAgICAgICAgPSAwXHJcbiAqIHRhbmgoLTApICAgICAgICA9IC0wXHJcbiAqIHRhbmgoSW5maW5pdHkpICA9IDFcclxuICogdGFuaCgtSW5maW5pdHkpID0gLTFcclxuICogdGFuaChOYU4pICAgICAgID0gTmFOXHJcbiAqXHJcbiAqL1xyXG5QLmh5cGVyYm9saWNUYW5nZW50ID0gUC50YW5oID0gZnVuY3Rpb24gKCkge1xyXG4gIHZhciBwciwgcm0sXHJcbiAgICB4ID0gdGhpcyxcclxuICAgIEN0b3IgPSB4LmNvbnN0cnVjdG9yO1xyXG5cclxuICBpZiAoIXguaXNGaW5pdGUoKSkgcmV0dXJuIG5ldyBDdG9yKHgucyk7XHJcbiAgaWYgKHguaXNaZXJvKCkpIHJldHVybiBuZXcgQ3Rvcih4KTtcclxuXHJcbiAgcHIgPSBDdG9yLnByZWNpc2lvbjtcclxuICBybSA9IEN0b3Iucm91bmRpbmc7XHJcbiAgQ3Rvci5wcmVjaXNpb24gPSBwciArIDc7XHJcbiAgQ3Rvci5yb3VuZGluZyA9IDE7XHJcblxyXG4gIHJldHVybiBkaXZpZGUoeC5zaW5oKCksIHguY29zaCgpLCBDdG9yLnByZWNpc2lvbiA9IHByLCBDdG9yLnJvdW5kaW5nID0gcm0pO1xyXG59O1xyXG5cclxuXHJcbi8qXHJcbiAqIFJldHVybiBhIG5ldyBEZWNpbWFsIHdob3NlIHZhbHVlIGlzIHRoZSBhcmNjb3NpbmUgKGludmVyc2UgY29zaW5lKSBpbiByYWRpYW5zIG9mIHRoZSB2YWx1ZSBvZlxyXG4gKiB0aGlzIERlY2ltYWwuXHJcbiAqXHJcbiAqIERvbWFpbjogWy0xLCAxXVxyXG4gKiBSYW5nZTogWzAsIHBpXVxyXG4gKlxyXG4gKiBhY29zKHgpID0gcGkvMiAtIGFzaW4oeClcclxuICpcclxuICogYWNvcygwKSAgICAgICA9IHBpLzJcclxuICogYWNvcygtMCkgICAgICA9IHBpLzJcclxuICogYWNvcygxKSAgICAgICA9IDBcclxuICogYWNvcygtMSkgICAgICA9IHBpXHJcbiAqIGFjb3MoMS8yKSAgICAgPSBwaS8zXHJcbiAqIGFjb3MoLTEvMikgICAgPSAyKnBpLzNcclxuICogYWNvcyh8eHwgPiAxKSA9IE5hTlxyXG4gKiBhY29zKE5hTikgICAgID0gTmFOXHJcbiAqXHJcbiAqL1xyXG5QLmludmVyc2VDb3NpbmUgPSBQLmFjb3MgPSBmdW5jdGlvbiAoKSB7XHJcbiAgdmFyIGhhbGZQaSxcclxuICAgIHggPSB0aGlzLFxyXG4gICAgQ3RvciA9IHguY29uc3RydWN0b3IsXHJcbiAgICBrID0geC5hYnMoKS5jbXAoMSksXHJcbiAgICBwciA9IEN0b3IucHJlY2lzaW9uLFxyXG4gICAgcm0gPSBDdG9yLnJvdW5kaW5nO1xyXG5cclxuICBpZiAoayAhPT0gLTEpIHtcclxuICAgIHJldHVybiBrID09PSAwXHJcbiAgICAgIC8vIHx4fCBpcyAxXHJcbiAgICAgID8geC5pc05lZygpID8gZ2V0UGkoQ3RvciwgcHIsIHJtKSA6IG5ldyBDdG9yKDApXHJcbiAgICAgIC8vIHx4fCA+IDEgb3IgeCBpcyBOYU5cclxuICAgICAgOiBuZXcgQ3RvcihOYU4pO1xyXG4gIH1cclxuXHJcbiAgaWYgKHguaXNaZXJvKCkpIHJldHVybiBnZXRQaShDdG9yLCBwciArIDQsIHJtKS50aW1lcygwLjUpO1xyXG5cclxuICAvLyBUT0RPPyBTcGVjaWFsIGNhc2UgYWNvcygwLjUpID0gcGkvMyBhbmQgYWNvcygtMC41KSA9IDIqcGkvM1xyXG5cclxuICBDdG9yLnByZWNpc2lvbiA9IHByICsgNjtcclxuICBDdG9yLnJvdW5kaW5nID0gMTtcclxuXHJcbiAgeCA9IHguYXNpbigpO1xyXG4gIGhhbGZQaSA9IGdldFBpKEN0b3IsIHByICsgNCwgcm0pLnRpbWVzKDAuNSk7XHJcblxyXG4gIEN0b3IucHJlY2lzaW9uID0gcHI7XHJcbiAgQ3Rvci5yb3VuZGluZyA9IHJtO1xyXG5cclxuICByZXR1cm4gaGFsZlBpLm1pbnVzKHgpO1xyXG59O1xyXG5cclxuXHJcbi8qXHJcbiAqIFJldHVybiBhIG5ldyBEZWNpbWFsIHdob3NlIHZhbHVlIGlzIHRoZSBpbnZlcnNlIG9mIHRoZSBoeXBlcmJvbGljIGNvc2luZSBpbiByYWRpYW5zIG9mIHRoZVxyXG4gKiB2YWx1ZSBvZiB0aGlzIERlY2ltYWwuXHJcbiAqXHJcbiAqIERvbWFpbjogWzEsIEluZmluaXR5XVxyXG4gKiBSYW5nZTogWzAsIEluZmluaXR5XVxyXG4gKlxyXG4gKiBhY29zaCh4KSA9IGxuKHggKyBzcXJ0KHheMiAtIDEpKVxyXG4gKlxyXG4gKiBhY29zaCh4IDwgMSkgICAgID0gTmFOXHJcbiAqIGFjb3NoKE5hTikgICAgICAgPSBOYU5cclxuICogYWNvc2goSW5maW5pdHkpICA9IEluZmluaXR5XHJcbiAqIGFjb3NoKC1JbmZpbml0eSkgPSBOYU5cclxuICogYWNvc2goMCkgICAgICAgICA9IE5hTlxyXG4gKiBhY29zaCgtMCkgICAgICAgID0gTmFOXHJcbiAqIGFjb3NoKDEpICAgICAgICAgPSAwXHJcbiAqIGFjb3NoKC0xKSAgICAgICAgPSBOYU5cclxuICpcclxuICovXHJcblAuaW52ZXJzZUh5cGVyYm9saWNDb3NpbmUgPSBQLmFjb3NoID0gZnVuY3Rpb24gKCkge1xyXG4gIHZhciBwciwgcm0sXHJcbiAgICB4ID0gdGhpcyxcclxuICAgIEN0b3IgPSB4LmNvbnN0cnVjdG9yO1xyXG5cclxuICBpZiAoeC5sdGUoMSkpIHJldHVybiBuZXcgQ3Rvcih4LmVxKDEpID8gMCA6IE5hTik7XHJcbiAgaWYgKCF4LmlzRmluaXRlKCkpIHJldHVybiBuZXcgQ3Rvcih4KTtcclxuXHJcbiAgcHIgPSBDdG9yLnByZWNpc2lvbjtcclxuICBybSA9IEN0b3Iucm91bmRpbmc7XHJcbiAgQ3Rvci5wcmVjaXNpb24gPSBwciArIE1hdGgubWF4KE1hdGguYWJzKHguZSksIHguc2QoKSkgKyA0O1xyXG4gIEN0b3Iucm91bmRpbmcgPSAxO1xyXG4gIGV4dGVybmFsID0gZmFsc2U7XHJcblxyXG4gIHggPSB4LnRpbWVzKHgpLm1pbnVzKDEpLnNxcnQoKS5wbHVzKHgpO1xyXG5cclxuICBleHRlcm5hbCA9IHRydWU7XHJcbiAgQ3Rvci5wcmVjaXNpb24gPSBwcjtcclxuICBDdG9yLnJvdW5kaW5nID0gcm07XHJcblxyXG4gIHJldHVybiB4LmxuKCk7XHJcbn07XHJcblxyXG5cclxuLypcclxuICogUmV0dXJuIGEgbmV3IERlY2ltYWwgd2hvc2UgdmFsdWUgaXMgdGhlIGludmVyc2Ugb2YgdGhlIGh5cGVyYm9saWMgc2luZSBpbiByYWRpYW5zIG9mIHRoZSB2YWx1ZVxyXG4gKiBvZiB0aGlzIERlY2ltYWwuXHJcbiAqXHJcbiAqIERvbWFpbjogWy1JbmZpbml0eSwgSW5maW5pdHldXHJcbiAqIFJhbmdlOiBbLUluZmluaXR5LCBJbmZpbml0eV1cclxuICpcclxuICogYXNpbmgoeCkgPSBsbih4ICsgc3FydCh4XjIgKyAxKSlcclxuICpcclxuICogYXNpbmgoTmFOKSAgICAgICA9IE5hTlxyXG4gKiBhc2luaChJbmZpbml0eSkgID0gSW5maW5pdHlcclxuICogYXNpbmgoLUluZmluaXR5KSA9IC1JbmZpbml0eVxyXG4gKiBhc2luaCgwKSAgICAgICAgID0gMFxyXG4gKiBhc2luaCgtMCkgICAgICAgID0gLTBcclxuICpcclxuICovXHJcblAuaW52ZXJzZUh5cGVyYm9saWNTaW5lID0gUC5hc2luaCA9IGZ1bmN0aW9uICgpIHtcclxuICB2YXIgcHIsIHJtLFxyXG4gICAgeCA9IHRoaXMsXHJcbiAgICBDdG9yID0geC5jb25zdHJ1Y3RvcjtcclxuXHJcbiAgaWYgKCF4LmlzRmluaXRlKCkgfHwgeC5pc1plcm8oKSkgcmV0dXJuIG5ldyBDdG9yKHgpO1xyXG5cclxuICBwciA9IEN0b3IucHJlY2lzaW9uO1xyXG4gIHJtID0gQ3Rvci5yb3VuZGluZztcclxuICBDdG9yLnByZWNpc2lvbiA9IHByICsgMiAqIE1hdGgubWF4KE1hdGguYWJzKHguZSksIHguc2QoKSkgKyA2O1xyXG4gIEN0b3Iucm91bmRpbmcgPSAxO1xyXG4gIGV4dGVybmFsID0gZmFsc2U7XHJcblxyXG4gIHggPSB4LnRpbWVzKHgpLnBsdXMoMSkuc3FydCgpLnBsdXMoeCk7XHJcblxyXG4gIGV4dGVybmFsID0gdHJ1ZTtcclxuICBDdG9yLnByZWNpc2lvbiA9IHByO1xyXG4gIEN0b3Iucm91bmRpbmcgPSBybTtcclxuXHJcbiAgcmV0dXJuIHgubG4oKTtcclxufTtcclxuXHJcblxyXG4vKlxyXG4gKiBSZXR1cm4gYSBuZXcgRGVjaW1hbCB3aG9zZSB2YWx1ZSBpcyB0aGUgaW52ZXJzZSBvZiB0aGUgaHlwZXJib2xpYyB0YW5nZW50IGluIHJhZGlhbnMgb2YgdGhlXHJcbiAqIHZhbHVlIG9mIHRoaXMgRGVjaW1hbC5cclxuICpcclxuICogRG9tYWluOiBbLTEsIDFdXHJcbiAqIFJhbmdlOiBbLUluZmluaXR5LCBJbmZpbml0eV1cclxuICpcclxuICogYXRhbmgoeCkgPSAwLjUgKiBsbigoMSArIHgpIC8gKDEgLSB4KSlcclxuICpcclxuICogYXRhbmgofHh8ID4gMSkgICA9IE5hTlxyXG4gKiBhdGFuaChOYU4pICAgICAgID0gTmFOXHJcbiAqIGF0YW5oKEluZmluaXR5KSAgPSBOYU5cclxuICogYXRhbmgoLUluZmluaXR5KSA9IE5hTlxyXG4gKiBhdGFuaCgwKSAgICAgICAgID0gMFxyXG4gKiBhdGFuaCgtMCkgICAgICAgID0gLTBcclxuICogYXRhbmgoMSkgICAgICAgICA9IEluZmluaXR5XHJcbiAqIGF0YW5oKC0xKSAgICAgICAgPSAtSW5maW5pdHlcclxuICpcclxuICovXHJcblAuaW52ZXJzZUh5cGVyYm9saWNUYW5nZW50ID0gUC5hdGFuaCA9IGZ1bmN0aW9uICgpIHtcclxuICB2YXIgcHIsIHJtLCB3cHIsIHhzZCxcclxuICAgIHggPSB0aGlzLFxyXG4gICAgQ3RvciA9IHguY29uc3RydWN0b3I7XHJcblxyXG4gIGlmICgheC5pc0Zpbml0ZSgpKSByZXR1cm4gbmV3IEN0b3IoTmFOKTtcclxuICBpZiAoeC5lID49IDApIHJldHVybiBuZXcgQ3Rvcih4LmFicygpLmVxKDEpID8geC5zIC8gMCA6IHguaXNaZXJvKCkgPyB4IDogTmFOKTtcclxuXHJcbiAgcHIgPSBDdG9yLnByZWNpc2lvbjtcclxuICBybSA9IEN0b3Iucm91bmRpbmc7XHJcbiAgeHNkID0geC5zZCgpO1xyXG5cclxuICBpZiAoTWF0aC5tYXgoeHNkLCBwcikgPCAyICogLXguZSAtIDEpIHJldHVybiBmaW5hbGlzZShuZXcgQ3Rvcih4KSwgcHIsIHJtLCB0cnVlKTtcclxuXHJcbiAgQ3Rvci5wcmVjaXNpb24gPSB3cHIgPSB4c2QgLSB4LmU7XHJcblxyXG4gIHggPSBkaXZpZGUoeC5wbHVzKDEpLCBuZXcgQ3RvcigxKS5taW51cyh4KSwgd3ByICsgcHIsIDEpO1xyXG5cclxuICBDdG9yLnByZWNpc2lvbiA9IHByICsgNDtcclxuICBDdG9yLnJvdW5kaW5nID0gMTtcclxuXHJcbiAgeCA9IHgubG4oKTtcclxuXHJcbiAgQ3Rvci5wcmVjaXNpb24gPSBwcjtcclxuICBDdG9yLnJvdW5kaW5nID0gcm07XHJcblxyXG4gIHJldHVybiB4LnRpbWVzKDAuNSk7XHJcbn07XHJcblxyXG5cclxuLypcclxuICogUmV0dXJuIGEgbmV3IERlY2ltYWwgd2hvc2UgdmFsdWUgaXMgdGhlIGFyY3NpbmUgKGludmVyc2Ugc2luZSkgaW4gcmFkaWFucyBvZiB0aGUgdmFsdWUgb2YgdGhpc1xyXG4gKiBEZWNpbWFsLlxyXG4gKlxyXG4gKiBEb21haW46IFstSW5maW5pdHksIEluZmluaXR5XVxyXG4gKiBSYW5nZTogWy1waS8yLCBwaS8yXVxyXG4gKlxyXG4gKiBhc2luKHgpID0gMiphdGFuKHgvKDEgKyBzcXJ0KDEgLSB4XjIpKSlcclxuICpcclxuICogYXNpbigwKSAgICAgICA9IDBcclxuICogYXNpbigtMCkgICAgICA9IC0wXHJcbiAqIGFzaW4oMS8yKSAgICAgPSBwaS82XHJcbiAqIGFzaW4oLTEvMikgICAgPSAtcGkvNlxyXG4gKiBhc2luKDEpICAgICAgID0gcGkvMlxyXG4gKiBhc2luKC0xKSAgICAgID0gLXBpLzJcclxuICogYXNpbih8eHwgPiAxKSA9IE5hTlxyXG4gKiBhc2luKE5hTikgICAgID0gTmFOXHJcbiAqXHJcbiAqIFRPRE8/IENvbXBhcmUgcGVyZm9ybWFuY2Ugb2YgVGF5bG9yIHNlcmllcy5cclxuICpcclxuICovXHJcblAuaW52ZXJzZVNpbmUgPSBQLmFzaW4gPSBmdW5jdGlvbiAoKSB7XHJcbiAgdmFyIGhhbGZQaSwgayxcclxuICAgIHByLCBybSxcclxuICAgIHggPSB0aGlzLFxyXG4gICAgQ3RvciA9IHguY29uc3RydWN0b3I7XHJcblxyXG4gIGlmICh4LmlzWmVybygpKSByZXR1cm4gbmV3IEN0b3IoeCk7XHJcblxyXG4gIGsgPSB4LmFicygpLmNtcCgxKTtcclxuICBwciA9IEN0b3IucHJlY2lzaW9uO1xyXG4gIHJtID0gQ3Rvci5yb3VuZGluZztcclxuXHJcbiAgaWYgKGsgIT09IC0xKSB7XHJcblxyXG4gICAgLy8gfHh8IGlzIDFcclxuICAgIGlmIChrID09PSAwKSB7XHJcbiAgICAgIGhhbGZQaSA9IGdldFBpKEN0b3IsIHByICsgNCwgcm0pLnRpbWVzKDAuNSk7XHJcbiAgICAgIGhhbGZQaS5zID0geC5zO1xyXG4gICAgICByZXR1cm4gaGFsZlBpO1xyXG4gICAgfVxyXG5cclxuICAgIC8vIHx4fCA+IDEgb3IgeCBpcyBOYU5cclxuICAgIHJldHVybiBuZXcgQ3RvcihOYU4pO1xyXG4gIH1cclxuXHJcbiAgLy8gVE9ETz8gU3BlY2lhbCBjYXNlIGFzaW4oMS8yKSA9IHBpLzYgYW5kIGFzaW4oLTEvMikgPSAtcGkvNlxyXG5cclxuICBDdG9yLnByZWNpc2lvbiA9IHByICsgNjtcclxuICBDdG9yLnJvdW5kaW5nID0gMTtcclxuXHJcbiAgeCA9IHguZGl2KG5ldyBDdG9yKDEpLm1pbnVzKHgudGltZXMoeCkpLnNxcnQoKS5wbHVzKDEpKS5hdGFuKCk7XHJcblxyXG4gIEN0b3IucHJlY2lzaW9uID0gcHI7XHJcbiAgQ3Rvci5yb3VuZGluZyA9IHJtO1xyXG5cclxuICByZXR1cm4geC50aW1lcygyKTtcclxufTtcclxuXHJcblxyXG4vKlxyXG4gKiBSZXR1cm4gYSBuZXcgRGVjaW1hbCB3aG9zZSB2YWx1ZSBpcyB0aGUgYXJjdGFuZ2VudCAoaW52ZXJzZSB0YW5nZW50KSBpbiByYWRpYW5zIG9mIHRoZSB2YWx1ZVxyXG4gKiBvZiB0aGlzIERlY2ltYWwuXHJcbiAqXHJcbiAqIERvbWFpbjogWy1JbmZpbml0eSwgSW5maW5pdHldXHJcbiAqIFJhbmdlOiBbLXBpLzIsIHBpLzJdXHJcbiAqXHJcbiAqIGF0YW4oeCkgPSB4IC0geF4zLzMgKyB4XjUvNSAtIHheNy83ICsgLi4uXHJcbiAqXHJcbiAqIGF0YW4oMCkgICAgICAgICA9IDBcclxuICogYXRhbigtMCkgICAgICAgID0gLTBcclxuICogYXRhbigxKSAgICAgICAgID0gcGkvNFxyXG4gKiBhdGFuKC0xKSAgICAgICAgPSAtcGkvNFxyXG4gKiBhdGFuKEluZmluaXR5KSAgPSBwaS8yXHJcbiAqIGF0YW4oLUluZmluaXR5KSA9IC1waS8yXHJcbiAqIGF0YW4oTmFOKSAgICAgICA9IE5hTlxyXG4gKlxyXG4gKi9cclxuUC5pbnZlcnNlVGFuZ2VudCA9IFAuYXRhbiA9IGZ1bmN0aW9uICgpIHtcclxuICB2YXIgaSwgaiwgaywgbiwgcHgsIHQsIHIsIHdwciwgeDIsXHJcbiAgICB4ID0gdGhpcyxcclxuICAgIEN0b3IgPSB4LmNvbnN0cnVjdG9yLFxyXG4gICAgcHIgPSBDdG9yLnByZWNpc2lvbixcclxuICAgIHJtID0gQ3Rvci5yb3VuZGluZztcclxuXHJcbiAgaWYgKCF4LmlzRmluaXRlKCkpIHtcclxuICAgIGlmICgheC5zKSByZXR1cm4gbmV3IEN0b3IoTmFOKTtcclxuICAgIGlmIChwciArIDQgPD0gUElfUFJFQ0lTSU9OKSB7XHJcbiAgICAgIHIgPSBnZXRQaShDdG9yLCBwciArIDQsIHJtKS50aW1lcygwLjUpO1xyXG4gICAgICByLnMgPSB4LnM7XHJcbiAgICAgIHJldHVybiByO1xyXG4gICAgfVxyXG4gIH0gZWxzZSBpZiAoeC5pc1plcm8oKSkge1xyXG4gICAgcmV0dXJuIG5ldyBDdG9yKHgpO1xyXG4gIH0gZWxzZSBpZiAoeC5hYnMoKS5lcSgxKSAmJiBwciArIDQgPD0gUElfUFJFQ0lTSU9OKSB7XHJcbiAgICByID0gZ2V0UGkoQ3RvciwgcHIgKyA0LCBybSkudGltZXMoMC4yNSk7XHJcbiAgICByLnMgPSB4LnM7XHJcbiAgICByZXR1cm4gcjtcclxuICB9XHJcblxyXG4gIEN0b3IucHJlY2lzaW9uID0gd3ByID0gcHIgKyAxMDtcclxuICBDdG9yLnJvdW5kaW5nID0gMTtcclxuXHJcbiAgLy8gVE9ETz8gaWYgKHggPj0gMSAmJiBwciA8PSBQSV9QUkVDSVNJT04pIGF0YW4oeCkgPSBoYWxmUGkgKiB4LnMgLSBhdGFuKDEgLyB4KTtcclxuXHJcbiAgLy8gQXJndW1lbnQgcmVkdWN0aW9uXHJcbiAgLy8gRW5zdXJlIHx4fCA8IDAuNDJcclxuICAvLyBhdGFuKHgpID0gMiAqIGF0YW4oeCAvICgxICsgc3FydCgxICsgeF4yKSkpXHJcblxyXG4gIGsgPSBNYXRoLm1pbigyOCwgd3ByIC8gTE9HX0JBU0UgKyAyIHwgMCk7XHJcblxyXG4gIGZvciAoaSA9IGs7IGk7IC0taSkgeCA9IHguZGl2KHgudGltZXMoeCkucGx1cygxKS5zcXJ0KCkucGx1cygxKSk7XHJcblxyXG4gIGV4dGVybmFsID0gZmFsc2U7XHJcblxyXG4gIGogPSBNYXRoLmNlaWwod3ByIC8gTE9HX0JBU0UpO1xyXG4gIG4gPSAxO1xyXG4gIHgyID0geC50aW1lcyh4KTtcclxuICByID0gbmV3IEN0b3IoeCk7XHJcbiAgcHggPSB4O1xyXG5cclxuICAvLyBhdGFuKHgpID0geCAtIHheMy8zICsgeF41LzUgLSB4XjcvNyArIC4uLlxyXG4gIGZvciAoOyBpICE9PSAtMTspIHtcclxuICAgIHB4ID0gcHgudGltZXMoeDIpO1xyXG4gICAgdCA9IHIubWludXMocHguZGl2KG4gKz0gMikpO1xyXG5cclxuICAgIHB4ID0gcHgudGltZXMoeDIpO1xyXG4gICAgciA9IHQucGx1cyhweC5kaXYobiArPSAyKSk7XHJcblxyXG4gICAgaWYgKHIuZFtqXSAhPT0gdm9pZCAwKSBmb3IgKGkgPSBqOyByLmRbaV0gPT09IHQuZFtpXSAmJiBpLS07KTtcclxuICB9XHJcblxyXG4gIGlmIChrKSByID0gci50aW1lcygyIDw8IChrIC0gMSkpO1xyXG5cclxuICBleHRlcm5hbCA9IHRydWU7XHJcblxyXG4gIHJldHVybiBmaW5hbGlzZShyLCBDdG9yLnByZWNpc2lvbiA9IHByLCBDdG9yLnJvdW5kaW5nID0gcm0sIHRydWUpO1xyXG59O1xyXG5cclxuXHJcbi8qXHJcbiAqIFJldHVybiB0cnVlIGlmIHRoZSB2YWx1ZSBvZiB0aGlzIERlY2ltYWwgaXMgYSBmaW5pdGUgbnVtYmVyLCBvdGhlcndpc2UgcmV0dXJuIGZhbHNlLlxyXG4gKlxyXG4gKi9cclxuUC5pc0Zpbml0ZSA9IGZ1bmN0aW9uICgpIHtcclxuICByZXR1cm4gISF0aGlzLmQ7XHJcbn07XHJcblxyXG5cclxuLypcclxuICogUmV0dXJuIHRydWUgaWYgdGhlIHZhbHVlIG9mIHRoaXMgRGVjaW1hbCBpcyBhbiBpbnRlZ2VyLCBvdGhlcndpc2UgcmV0dXJuIGZhbHNlLlxyXG4gKlxyXG4gKi9cclxuUC5pc0ludGVnZXIgPSBQLmlzSW50ID0gZnVuY3Rpb24gKCkge1xyXG4gIHJldHVybiAhIXRoaXMuZCAmJiBtYXRoZmxvb3IodGhpcy5lIC8gTE9HX0JBU0UpID4gdGhpcy5kLmxlbmd0aCAtIDI7XHJcbn07XHJcblxyXG5cclxuLypcclxuICogUmV0dXJuIHRydWUgaWYgdGhlIHZhbHVlIG9mIHRoaXMgRGVjaW1hbCBpcyBOYU4sIG90aGVyd2lzZSByZXR1cm4gZmFsc2UuXHJcbiAqXHJcbiAqL1xyXG5QLmlzTmFOID0gZnVuY3Rpb24gKCkge1xyXG4gIHJldHVybiAhdGhpcy5zO1xyXG59O1xyXG5cclxuXHJcbi8qXHJcbiAqIFJldHVybiB0cnVlIGlmIHRoZSB2YWx1ZSBvZiB0aGlzIERlY2ltYWwgaXMgbmVnYXRpdmUsIG90aGVyd2lzZSByZXR1cm4gZmFsc2UuXHJcbiAqXHJcbiAqL1xyXG5QLmlzTmVnYXRpdmUgPSBQLmlzTmVnID0gZnVuY3Rpb24gKCkge1xyXG4gIHJldHVybiB0aGlzLnMgPCAwO1xyXG59O1xyXG5cclxuXHJcbi8qXHJcbiAqIFJldHVybiB0cnVlIGlmIHRoZSB2YWx1ZSBvZiB0aGlzIERlY2ltYWwgaXMgcG9zaXRpdmUsIG90aGVyd2lzZSByZXR1cm4gZmFsc2UuXHJcbiAqXHJcbiAqL1xyXG5QLmlzUG9zaXRpdmUgPSBQLmlzUG9zID0gZnVuY3Rpb24gKCkge1xyXG4gIHJldHVybiB0aGlzLnMgPiAwO1xyXG59O1xyXG5cclxuXHJcbi8qXHJcbiAqIFJldHVybiB0cnVlIGlmIHRoZSB2YWx1ZSBvZiB0aGlzIERlY2ltYWwgaXMgMCBvciAtMCwgb3RoZXJ3aXNlIHJldHVybiBmYWxzZS5cclxuICpcclxuICovXHJcblAuaXNaZXJvID0gZnVuY3Rpb24gKCkge1xyXG4gIHJldHVybiAhIXRoaXMuZCAmJiB0aGlzLmRbMF0gPT09IDA7XHJcbn07XHJcblxyXG5cclxuLypcclxuICogUmV0dXJuIHRydWUgaWYgdGhlIHZhbHVlIG9mIHRoaXMgRGVjaW1hbCBpcyBsZXNzIHRoYW4gYHlgLCBvdGhlcndpc2UgcmV0dXJuIGZhbHNlLlxyXG4gKlxyXG4gKi9cclxuUC5sZXNzVGhhbiA9IFAubHQgPSBmdW5jdGlvbiAoeSkge1xyXG4gIHJldHVybiB0aGlzLmNtcCh5KSA8IDA7XHJcbn07XHJcblxyXG5cclxuLypcclxuICogUmV0dXJuIHRydWUgaWYgdGhlIHZhbHVlIG9mIHRoaXMgRGVjaW1hbCBpcyBsZXNzIHRoYW4gb3IgZXF1YWwgdG8gYHlgLCBvdGhlcndpc2UgcmV0dXJuIGZhbHNlLlxyXG4gKlxyXG4gKi9cclxuUC5sZXNzVGhhbk9yRXF1YWxUbyA9IFAubHRlID0gZnVuY3Rpb24gKHkpIHtcclxuICByZXR1cm4gdGhpcy5jbXAoeSkgPCAxO1xyXG59O1xyXG5cclxuXHJcbi8qXHJcbiAqIFJldHVybiB0aGUgbG9nYXJpdGhtIG9mIHRoZSB2YWx1ZSBvZiB0aGlzIERlY2ltYWwgdG8gdGhlIHNwZWNpZmllZCBiYXNlLCByb3VuZGVkIHRvIGBwcmVjaXNpb25gXHJcbiAqIHNpZ25pZmljYW50IGRpZ2l0cyB1c2luZyByb3VuZGluZyBtb2RlIGByb3VuZGluZ2AuXHJcbiAqXHJcbiAqIElmIG5vIGJhc2UgaXMgc3BlY2lmaWVkLCByZXR1cm4gbG9nWzEwXShhcmcpLlxyXG4gKlxyXG4gKiBsb2dbYmFzZV0oYXJnKSA9IGxuKGFyZykgLyBsbihiYXNlKVxyXG4gKlxyXG4gKiBUaGUgcmVzdWx0IHdpbGwgYWx3YXlzIGJlIGNvcnJlY3RseSByb3VuZGVkIGlmIHRoZSBiYXNlIG9mIHRoZSBsb2cgaXMgMTAsIGFuZCAnYWxtb3N0IGFsd2F5cydcclxuICogb3RoZXJ3aXNlOlxyXG4gKlxyXG4gKiBEZXBlbmRpbmcgb24gdGhlIHJvdW5kaW5nIG1vZGUsIHRoZSByZXN1bHQgbWF5IGJlIGluY29ycmVjdGx5IHJvdW5kZWQgaWYgdGhlIGZpcnN0IGZpZnRlZW5cclxuICogcm91bmRpbmcgZGlnaXRzIGFyZSBbNDldOTk5OTk5OTk5OTk5OTkgb3IgWzUwXTAwMDAwMDAwMDAwMDAwLiBJbiB0aGF0IGNhc2UsIHRoZSBtYXhpbXVtIGVycm9yXHJcbiAqIGJldHdlZW4gdGhlIHJlc3VsdCBhbmQgdGhlIGNvcnJlY3RseSByb3VuZGVkIHJlc3VsdCB3aWxsIGJlIG9uZSB1bHAgKHVuaXQgaW4gdGhlIGxhc3QgcGxhY2UpLlxyXG4gKlxyXG4gKiBsb2dbLWJdKGEpICAgICAgID0gTmFOXHJcbiAqIGxvZ1swXShhKSAgICAgICAgPSBOYU5cclxuICogbG9nWzFdKGEpICAgICAgICA9IE5hTlxyXG4gKiBsb2dbTmFOXShhKSAgICAgID0gTmFOXHJcbiAqIGxvZ1tJbmZpbml0eV0oYSkgPSBOYU5cclxuICogbG9nW2JdKDApICAgICAgICA9IC1JbmZpbml0eVxyXG4gKiBsb2dbYl0oLTApICAgICAgID0gLUluZmluaXR5XHJcbiAqIGxvZ1tiXSgtYSkgICAgICAgPSBOYU5cclxuICogbG9nW2JdKDEpICAgICAgICA9IDBcclxuICogbG9nW2JdKEluZmluaXR5KSA9IEluZmluaXR5XHJcbiAqIGxvZ1tiXShOYU4pICAgICAgPSBOYU5cclxuICpcclxuICogW2Jhc2VdIHtudW1iZXJ8c3RyaW5nfERlY2ltYWx9IFRoZSBiYXNlIG9mIHRoZSBsb2dhcml0aG0uXHJcbiAqXHJcbiAqL1xyXG5QLmxvZ2FyaXRobSA9IFAubG9nID0gZnVuY3Rpb24gKGJhc2UpIHtcclxuICB2YXIgaXNCYXNlMTAsIGQsIGRlbm9taW5hdG9yLCBrLCBpbmYsIG51bSwgc2QsIHIsXHJcbiAgICBhcmcgPSB0aGlzLFxyXG4gICAgQ3RvciA9IGFyZy5jb25zdHJ1Y3RvcixcclxuICAgIHByID0gQ3Rvci5wcmVjaXNpb24sXHJcbiAgICBybSA9IEN0b3Iucm91bmRpbmcsXHJcbiAgICBndWFyZCA9IDU7XHJcblxyXG4gIC8vIERlZmF1bHQgYmFzZSBpcyAxMC5cclxuICBpZiAoYmFzZSA9PSBudWxsKSB7XHJcbiAgICBiYXNlID0gbmV3IEN0b3IoMTApO1xyXG4gICAgaXNCYXNlMTAgPSB0cnVlO1xyXG4gIH0gZWxzZSB7XHJcbiAgICBiYXNlID0gbmV3IEN0b3IoYmFzZSk7XHJcbiAgICBkID0gYmFzZS5kO1xyXG5cclxuICAgIC8vIFJldHVybiBOYU4gaWYgYmFzZSBpcyBuZWdhdGl2ZSwgb3Igbm9uLWZpbml0ZSwgb3IgaXMgMCBvciAxLlxyXG4gICAgaWYgKGJhc2UucyA8IDAgfHwgIWQgfHwgIWRbMF0gfHwgYmFzZS5lcSgxKSkgcmV0dXJuIG5ldyBDdG9yKE5hTik7XHJcblxyXG4gICAgaXNCYXNlMTAgPSBiYXNlLmVxKDEwKTtcclxuICB9XHJcblxyXG4gIGQgPSBhcmcuZDtcclxuXHJcbiAgLy8gSXMgYXJnIG5lZ2F0aXZlLCBub24tZmluaXRlLCAwIG9yIDE/XHJcbiAgaWYgKGFyZy5zIDwgMCB8fCAhZCB8fCAhZFswXSB8fCBhcmcuZXEoMSkpIHtcclxuICAgIHJldHVybiBuZXcgQ3RvcihkICYmICFkWzBdID8gLTEgLyAwIDogYXJnLnMgIT0gMSA/IE5hTiA6IGQgPyAwIDogMSAvIDApO1xyXG4gIH1cclxuXHJcbiAgLy8gVGhlIHJlc3VsdCB3aWxsIGhhdmUgYSBub24tdGVybWluYXRpbmcgZGVjaW1hbCBleHBhbnNpb24gaWYgYmFzZSBpcyAxMCBhbmQgYXJnIGlzIG5vdCBhblxyXG4gIC8vIGludGVnZXIgcG93ZXIgb2YgMTAuXHJcbiAgaWYgKGlzQmFzZTEwKSB7XHJcbiAgICBpZiAoZC5sZW5ndGggPiAxKSB7XHJcbiAgICAgIGluZiA9IHRydWU7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICBmb3IgKGsgPSBkWzBdOyBrICUgMTAgPT09IDA7KSBrIC89IDEwO1xyXG4gICAgICBpbmYgPSBrICE9PSAxO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgZXh0ZXJuYWwgPSBmYWxzZTtcclxuICBzZCA9IHByICsgZ3VhcmQ7XHJcbiAgbnVtID0gbmF0dXJhbExvZ2FyaXRobShhcmcsIHNkKTtcclxuICBkZW5vbWluYXRvciA9IGlzQmFzZTEwID8gZ2V0TG4xMChDdG9yLCBzZCArIDEwKSA6IG5hdHVyYWxMb2dhcml0aG0oYmFzZSwgc2QpO1xyXG5cclxuICAvLyBUaGUgcmVzdWx0IHdpbGwgaGF2ZSA1IHJvdW5kaW5nIGRpZ2l0cy5cclxuICByID0gZGl2aWRlKG51bSwgZGVub21pbmF0b3IsIHNkLCAxKTtcclxuXHJcbiAgLy8gSWYgYXQgYSByb3VuZGluZyBib3VuZGFyeSwgaS5lLiB0aGUgcmVzdWx0J3Mgcm91bmRpbmcgZGlnaXRzIGFyZSBbNDldOTk5OSBvciBbNTBdMDAwMCxcclxuICAvLyBjYWxjdWxhdGUgMTAgZnVydGhlciBkaWdpdHMuXHJcbiAgLy9cclxuICAvLyBJZiB0aGUgcmVzdWx0IGlzIGtub3duIHRvIGhhdmUgYW4gaW5maW5pdGUgZGVjaW1hbCBleHBhbnNpb24sIHJlcGVhdCB0aGlzIHVudGlsIGl0IGlzIGNsZWFyXHJcbiAgLy8gdGhhdCB0aGUgcmVzdWx0IGlzIGFib3ZlIG9yIGJlbG93IHRoZSBib3VuZGFyeS4gT3RoZXJ3aXNlLCBpZiBhZnRlciBjYWxjdWxhdGluZyB0aGUgMTBcclxuICAvLyBmdXJ0aGVyIGRpZ2l0cywgdGhlIGxhc3QgMTQgYXJlIG5pbmVzLCByb3VuZCB1cCBhbmQgYXNzdW1lIHRoZSByZXN1bHQgaXMgZXhhY3QuXHJcbiAgLy8gQWxzbyBhc3N1bWUgdGhlIHJlc3VsdCBpcyBleGFjdCBpZiB0aGUgbGFzdCAxNCBhcmUgemVyby5cclxuICAvL1xyXG4gIC8vIEV4YW1wbGUgb2YgYSByZXN1bHQgdGhhdCB3aWxsIGJlIGluY29ycmVjdGx5IHJvdW5kZWQ6XHJcbiAgLy8gbG9nWzEwNDg1NzZdKDQ1MDM1OTk2MjczNzA1MDIpID0gMi42MDAwMDAwMDAwMDAwMDAwOTYxMDI3OTUxMTQ0NDc0Ni4uLlxyXG4gIC8vIFRoZSBhYm92ZSByZXN1bHQgY29ycmVjdGx5IHJvdW5kZWQgdXNpbmcgUk9VTkRfQ0VJTCB0byAxIGRlY2ltYWwgcGxhY2Ugc2hvdWxkIGJlIDIuNywgYnV0IGl0XHJcbiAgLy8gd2lsbCBiZSBnaXZlbiBhcyAyLjYgYXMgdGhlcmUgYXJlIDE1IHplcm9zIGltbWVkaWF0ZWx5IGFmdGVyIHRoZSByZXF1ZXN0ZWQgZGVjaW1hbCBwbGFjZSwgc29cclxuICAvLyB0aGUgZXhhY3QgcmVzdWx0IHdvdWxkIGJlIGFzc3VtZWQgdG8gYmUgMi42LCB3aGljaCByb3VuZGVkIHVzaW5nIFJPVU5EX0NFSUwgdG8gMSBkZWNpbWFsXHJcbiAgLy8gcGxhY2UgaXMgc3RpbGwgMi42LlxyXG4gIGlmIChjaGVja1JvdW5kaW5nRGlnaXRzKHIuZCwgayA9IHByLCBybSkpIHtcclxuXHJcbiAgICBkbyB7XHJcbiAgICAgIHNkICs9IDEwO1xyXG4gICAgICBudW0gPSBuYXR1cmFsTG9nYXJpdGhtKGFyZywgc2QpO1xyXG4gICAgICBkZW5vbWluYXRvciA9IGlzQmFzZTEwID8gZ2V0TG4xMChDdG9yLCBzZCArIDEwKSA6IG5hdHVyYWxMb2dhcml0aG0oYmFzZSwgc2QpO1xyXG4gICAgICByID0gZGl2aWRlKG51bSwgZGVub21pbmF0b3IsIHNkLCAxKTtcclxuXHJcbiAgICAgIGlmICghaW5mKSB7XHJcblxyXG4gICAgICAgIC8vIENoZWNrIGZvciAxNCBuaW5lcyBmcm9tIHRoZSAybmQgcm91bmRpbmcgZGlnaXQsIGFzIHRoZSBmaXJzdCBtYXkgYmUgNC5cclxuICAgICAgICBpZiAoK2RpZ2l0c1RvU3RyaW5nKHIuZCkuc2xpY2UoayArIDEsIGsgKyAxNSkgKyAxID09IDFlMTQpIHtcclxuICAgICAgICAgIHIgPSBmaW5hbGlzZShyLCBwciArIDEsIDApO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgYnJlYWs7XHJcbiAgICAgIH1cclxuICAgIH0gd2hpbGUgKGNoZWNrUm91bmRpbmdEaWdpdHMoci5kLCBrICs9IDEwLCBybSkpO1xyXG4gIH1cclxuXHJcbiAgZXh0ZXJuYWwgPSB0cnVlO1xyXG5cclxuICByZXR1cm4gZmluYWxpc2UociwgcHIsIHJtKTtcclxufTtcclxuXHJcblxyXG4vKlxyXG4gKiBSZXR1cm4gYSBuZXcgRGVjaW1hbCB3aG9zZSB2YWx1ZSBpcyB0aGUgbWF4aW11bSBvZiB0aGUgYXJndW1lbnRzIGFuZCB0aGUgdmFsdWUgb2YgdGhpcyBEZWNpbWFsLlxyXG4gKlxyXG4gKiBhcmd1bWVudHMge251bWJlcnxzdHJpbmd8RGVjaW1hbH1cclxuICpcclxuUC5tYXggPSBmdW5jdGlvbiAoKSB7XHJcbiAgQXJyYXkucHJvdG90eXBlLnB1c2guY2FsbChhcmd1bWVudHMsIHRoaXMpO1xyXG4gIHJldHVybiBtYXhPck1pbih0aGlzLmNvbnN0cnVjdG9yLCBhcmd1bWVudHMsICdsdCcpO1xyXG59O1xyXG4gKi9cclxuXHJcblxyXG4vKlxyXG4gKiBSZXR1cm4gYSBuZXcgRGVjaW1hbCB3aG9zZSB2YWx1ZSBpcyB0aGUgbWluaW11bSBvZiB0aGUgYXJndW1lbnRzIGFuZCB0aGUgdmFsdWUgb2YgdGhpcyBEZWNpbWFsLlxyXG4gKlxyXG4gKiBhcmd1bWVudHMge251bWJlcnxzdHJpbmd8RGVjaW1hbH1cclxuICpcclxuUC5taW4gPSBmdW5jdGlvbiAoKSB7XHJcbiAgQXJyYXkucHJvdG90eXBlLnB1c2guY2FsbChhcmd1bWVudHMsIHRoaXMpO1xyXG4gIHJldHVybiBtYXhPck1pbih0aGlzLmNvbnN0cnVjdG9yLCBhcmd1bWVudHMsICdndCcpO1xyXG59O1xyXG4gKi9cclxuXHJcblxyXG4vKlxyXG4gKiAgbiAtIDAgPSBuXHJcbiAqICBuIC0gTiA9IE5cclxuICogIG4gLSBJID0gLUlcclxuICogIDAgLSBuID0gLW5cclxuICogIDAgLSAwID0gMFxyXG4gKiAgMCAtIE4gPSBOXHJcbiAqICAwIC0gSSA9IC1JXHJcbiAqICBOIC0gbiA9IE5cclxuICogIE4gLSAwID0gTlxyXG4gKiAgTiAtIE4gPSBOXHJcbiAqICBOIC0gSSA9IE5cclxuICogIEkgLSBuID0gSVxyXG4gKiAgSSAtIDAgPSBJXHJcbiAqICBJIC0gTiA9IE5cclxuICogIEkgLSBJID0gTlxyXG4gKlxyXG4gKiBSZXR1cm4gYSBuZXcgRGVjaW1hbCB3aG9zZSB2YWx1ZSBpcyB0aGUgdmFsdWUgb2YgdGhpcyBEZWNpbWFsIG1pbnVzIGB5YCwgcm91bmRlZCB0byBgcHJlY2lzaW9uYFxyXG4gKiBzaWduaWZpY2FudCBkaWdpdHMgdXNpbmcgcm91bmRpbmcgbW9kZSBgcm91bmRpbmdgLlxyXG4gKlxyXG4gKi9cclxuUC5taW51cyA9IFAuc3ViID0gZnVuY3Rpb24gKHkpIHtcclxuICB2YXIgZCwgZSwgaSwgaiwgaywgbGVuLCBwciwgcm0sIHhkLCB4ZSwgeExUeSwgeWQsXHJcbiAgICB4ID0gdGhpcyxcclxuICAgIEN0b3IgPSB4LmNvbnN0cnVjdG9yO1xyXG5cclxuICB5ID0gbmV3IEN0b3IoeSk7XHJcblxyXG4gIC8vIElmIGVpdGhlciBpcyBub3QgZmluaXRlLi4uXHJcbiAgaWYgKCF4LmQgfHwgIXkuZCkge1xyXG5cclxuICAgIC8vIFJldHVybiBOYU4gaWYgZWl0aGVyIGlzIE5hTi5cclxuICAgIGlmICgheC5zIHx8ICF5LnMpIHkgPSBuZXcgQ3RvcihOYU4pO1xyXG5cclxuICAgIC8vIFJldHVybiB5IG5lZ2F0ZWQgaWYgeCBpcyBmaW5pdGUgYW5kIHkgaXMgXHUwMEIxSW5maW5pdHkuXHJcbiAgICBlbHNlIGlmICh4LmQpIHkucyA9IC15LnM7XHJcblxyXG4gICAgLy8gUmV0dXJuIHggaWYgeSBpcyBmaW5pdGUgYW5kIHggaXMgXHUwMEIxSW5maW5pdHkuXHJcbiAgICAvLyBSZXR1cm4geCBpZiBib3RoIGFyZSBcdTAwQjFJbmZpbml0eSB3aXRoIGRpZmZlcmVudCBzaWducy5cclxuICAgIC8vIFJldHVybiBOYU4gaWYgYm90aCBhcmUgXHUwMEIxSW5maW5pdHkgd2l0aCB0aGUgc2FtZSBzaWduLlxyXG4gICAgZWxzZSB5ID0gbmV3IEN0b3IoeS5kIHx8IHgucyAhPT0geS5zID8geCA6IE5hTik7XHJcblxyXG4gICAgcmV0dXJuIHk7XHJcbiAgfVxyXG5cclxuICAvLyBJZiBzaWducyBkaWZmZXIuLi5cclxuICBpZiAoeC5zICE9IHkucykge1xyXG4gICAgeS5zID0gLXkucztcclxuICAgIHJldHVybiB4LnBsdXMoeSk7XHJcbiAgfVxyXG5cclxuICB4ZCA9IHguZDtcclxuICB5ZCA9IHkuZDtcclxuICBwciA9IEN0b3IucHJlY2lzaW9uO1xyXG4gIHJtID0gQ3Rvci5yb3VuZGluZztcclxuXHJcbiAgLy8gSWYgZWl0aGVyIGlzIHplcm8uLi5cclxuICBpZiAoIXhkWzBdIHx8ICF5ZFswXSkge1xyXG5cclxuICAgIC8vIFJldHVybiB5IG5lZ2F0ZWQgaWYgeCBpcyB6ZXJvIGFuZCB5IGlzIG5vbi16ZXJvLlxyXG4gICAgaWYgKHlkWzBdKSB5LnMgPSAteS5zO1xyXG5cclxuICAgIC8vIFJldHVybiB4IGlmIHkgaXMgemVybyBhbmQgeCBpcyBub24temVyby5cclxuICAgIGVsc2UgaWYgKHhkWzBdKSB5ID0gbmV3IEN0b3IoeCk7XHJcblxyXG4gICAgLy8gUmV0dXJuIHplcm8gaWYgYm90aCBhcmUgemVyby5cclxuICAgIC8vIEZyb20gSUVFRSA3NTQgKDIwMDgpIDYuMzogMCAtIDAgPSAtMCAtIC0wID0gLTAgd2hlbiByb3VuZGluZyB0byAtSW5maW5pdHkuXHJcbiAgICBlbHNlIHJldHVybiBuZXcgQ3RvcihybSA9PT0gMyA/IC0wIDogMCk7XHJcblxyXG4gICAgcmV0dXJuIGV4dGVybmFsID8gZmluYWxpc2UoeSwgcHIsIHJtKSA6IHk7XHJcbiAgfVxyXG5cclxuICAvLyB4IGFuZCB5IGFyZSBmaW5pdGUsIG5vbi16ZXJvIG51bWJlcnMgd2l0aCB0aGUgc2FtZSBzaWduLlxyXG5cclxuICAvLyBDYWxjdWxhdGUgYmFzZSAxZTcgZXhwb25lbnRzLlxyXG4gIGUgPSBtYXRoZmxvb3IoeS5lIC8gTE9HX0JBU0UpO1xyXG4gIHhlID0gbWF0aGZsb29yKHguZSAvIExPR19CQVNFKTtcclxuXHJcbiAgeGQgPSB4ZC5zbGljZSgpO1xyXG4gIGsgPSB4ZSAtIGU7XHJcblxyXG4gIC8vIElmIGJhc2UgMWU3IGV4cG9uZW50cyBkaWZmZXIuLi5cclxuICBpZiAoaykge1xyXG4gICAgeExUeSA9IGsgPCAwO1xyXG5cclxuICAgIGlmICh4TFR5KSB7XHJcbiAgICAgIGQgPSB4ZDtcclxuICAgICAgayA9IC1rO1xyXG4gICAgICBsZW4gPSB5ZC5sZW5ndGg7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICBkID0geWQ7XHJcbiAgICAgIGUgPSB4ZTtcclxuICAgICAgbGVuID0geGQubGVuZ3RoO1xyXG4gICAgfVxyXG5cclxuICAgIC8vIE51bWJlcnMgd2l0aCBtYXNzaXZlbHkgZGlmZmVyZW50IGV4cG9uZW50cyB3b3VsZCByZXN1bHQgaW4gYSB2ZXJ5IGhpZ2ggbnVtYmVyIG9mXHJcbiAgICAvLyB6ZXJvcyBuZWVkaW5nIHRvIGJlIHByZXBlbmRlZCwgYnV0IHRoaXMgY2FuIGJlIGF2b2lkZWQgd2hpbGUgc3RpbGwgZW5zdXJpbmcgY29ycmVjdFxyXG4gICAgLy8gcm91bmRpbmcgYnkgbGltaXRpbmcgdGhlIG51bWJlciBvZiB6ZXJvcyB0byBgTWF0aC5jZWlsKHByIC8gTE9HX0JBU0UpICsgMmAuXHJcbiAgICBpID0gTWF0aC5tYXgoTWF0aC5jZWlsKHByIC8gTE9HX0JBU0UpLCBsZW4pICsgMjtcclxuXHJcbiAgICBpZiAoayA+IGkpIHtcclxuICAgICAgayA9IGk7XHJcbiAgICAgIGQubGVuZ3RoID0gMTtcclxuICAgIH1cclxuXHJcbiAgICAvLyBQcmVwZW5kIHplcm9zIHRvIGVxdWFsaXNlIGV4cG9uZW50cy5cclxuICAgIGQucmV2ZXJzZSgpO1xyXG4gICAgZm9yIChpID0gazsgaS0tOykgZC5wdXNoKDApO1xyXG4gICAgZC5yZXZlcnNlKCk7XHJcblxyXG4gIC8vIEJhc2UgMWU3IGV4cG9uZW50cyBlcXVhbC5cclxuICB9IGVsc2Uge1xyXG5cclxuICAgIC8vIENoZWNrIGRpZ2l0cyB0byBkZXRlcm1pbmUgd2hpY2ggaXMgdGhlIGJpZ2dlciBudW1iZXIuXHJcblxyXG4gICAgaSA9IHhkLmxlbmd0aDtcclxuICAgIGxlbiA9IHlkLmxlbmd0aDtcclxuICAgIHhMVHkgPSBpIDwgbGVuO1xyXG4gICAgaWYgKHhMVHkpIGxlbiA9IGk7XHJcblxyXG4gICAgZm9yIChpID0gMDsgaSA8IGxlbjsgaSsrKSB7XHJcbiAgICAgIGlmICh4ZFtpXSAhPSB5ZFtpXSkge1xyXG4gICAgICAgIHhMVHkgPSB4ZFtpXSA8IHlkW2ldO1xyXG4gICAgICAgIGJyZWFrO1xyXG4gICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgayA9IDA7XHJcbiAgfVxyXG5cclxuICBpZiAoeExUeSkge1xyXG4gICAgZCA9IHhkO1xyXG4gICAgeGQgPSB5ZDtcclxuICAgIHlkID0gZDtcclxuICAgIHkucyA9IC15LnM7XHJcbiAgfVxyXG5cclxuICBsZW4gPSB4ZC5sZW5ndGg7XHJcblxyXG4gIC8vIEFwcGVuZCB6ZXJvcyB0byBgeGRgIGlmIHNob3J0ZXIuXHJcbiAgLy8gRG9uJ3QgYWRkIHplcm9zIHRvIGB5ZGAgaWYgc2hvcnRlciBhcyBzdWJ0cmFjdGlvbiBvbmx5IG5lZWRzIHRvIHN0YXJ0IGF0IGB5ZGAgbGVuZ3RoLlxyXG4gIGZvciAoaSA9IHlkLmxlbmd0aCAtIGxlbjsgaSA+IDA7IC0taSkgeGRbbGVuKytdID0gMDtcclxuXHJcbiAgLy8gU3VidHJhY3QgeWQgZnJvbSB4ZC5cclxuICBmb3IgKGkgPSB5ZC5sZW5ndGg7IGkgPiBrOykge1xyXG5cclxuICAgIGlmICh4ZFstLWldIDwgeWRbaV0pIHtcclxuICAgICAgZm9yIChqID0gaTsgaiAmJiB4ZFstLWpdID09PSAwOykgeGRbal0gPSBCQVNFIC0gMTtcclxuICAgICAgLS14ZFtqXTtcclxuICAgICAgeGRbaV0gKz0gQkFTRTtcclxuICAgIH1cclxuXHJcbiAgICB4ZFtpXSAtPSB5ZFtpXTtcclxuICB9XHJcblxyXG4gIC8vIFJlbW92ZSB0cmFpbGluZyB6ZXJvcy5cclxuICBmb3IgKDsgeGRbLS1sZW5dID09PSAwOykgeGQucG9wKCk7XHJcblxyXG4gIC8vIFJlbW92ZSBsZWFkaW5nIHplcm9zIGFuZCBhZGp1c3QgZXhwb25lbnQgYWNjb3JkaW5nbHkuXHJcbiAgZm9yICg7IHhkWzBdID09PSAwOyB4ZC5zaGlmdCgpKSAtLWU7XHJcblxyXG4gIC8vIFplcm8/XHJcbiAgaWYgKCF4ZFswXSkgcmV0dXJuIG5ldyBDdG9yKHJtID09PSAzID8gLTAgOiAwKTtcclxuXHJcbiAgeS5kID0geGQ7XHJcbiAgeS5lID0gZ2V0QmFzZTEwRXhwb25lbnQoeGQsIGUpO1xyXG5cclxuICByZXR1cm4gZXh0ZXJuYWwgPyBmaW5hbGlzZSh5LCBwciwgcm0pIDogeTtcclxufTtcclxuXHJcblxyXG4vKlxyXG4gKiAgIG4gJSAwID0gIE5cclxuICogICBuICUgTiA9ICBOXHJcbiAqICAgbiAlIEkgPSAgblxyXG4gKiAgIDAgJSBuID0gIDBcclxuICogIC0wICUgbiA9IC0wXHJcbiAqICAgMCAlIDAgPSAgTlxyXG4gKiAgIDAgJSBOID0gIE5cclxuICogICAwICUgSSA9ICAwXHJcbiAqICAgTiAlIG4gPSAgTlxyXG4gKiAgIE4gJSAwID0gIE5cclxuICogICBOICUgTiA9ICBOXHJcbiAqICAgTiAlIEkgPSAgTlxyXG4gKiAgIEkgJSBuID0gIE5cclxuICogICBJICUgMCA9ICBOXHJcbiAqICAgSSAlIE4gPSAgTlxyXG4gKiAgIEkgJSBJID0gIE5cclxuICpcclxuICogUmV0dXJuIGEgbmV3IERlY2ltYWwgd2hvc2UgdmFsdWUgaXMgdGhlIHZhbHVlIG9mIHRoaXMgRGVjaW1hbCBtb2R1bG8gYHlgLCByb3VuZGVkIHRvXHJcbiAqIGBwcmVjaXNpb25gIHNpZ25pZmljYW50IGRpZ2l0cyB1c2luZyByb3VuZGluZyBtb2RlIGByb3VuZGluZ2AuXHJcbiAqXHJcbiAqIFRoZSByZXN1bHQgZGVwZW5kcyBvbiB0aGUgbW9kdWxvIG1vZGUuXHJcbiAqXHJcbiAqL1xyXG5QLm1vZHVsbyA9IFAubW9kID0gZnVuY3Rpb24gKHkpIHtcclxuICB2YXIgcSxcclxuICAgIHggPSB0aGlzLFxyXG4gICAgQ3RvciA9IHguY29uc3RydWN0b3I7XHJcblxyXG4gIHkgPSBuZXcgQ3Rvcih5KTtcclxuXHJcbiAgLy8gUmV0dXJuIE5hTiBpZiB4IGlzIFx1MDBCMUluZmluaXR5IG9yIE5hTiwgb3IgeSBpcyBOYU4gb3IgXHUwMEIxMC5cclxuICBpZiAoIXguZCB8fCAheS5zIHx8IHkuZCAmJiAheS5kWzBdKSByZXR1cm4gbmV3IEN0b3IoTmFOKTtcclxuXHJcbiAgLy8gUmV0dXJuIHggaWYgeSBpcyBcdTAwQjFJbmZpbml0eSBvciB4IGlzIFx1MDBCMTAuXHJcbiAgaWYgKCF5LmQgfHwgeC5kICYmICF4LmRbMF0pIHtcclxuICAgIHJldHVybiBmaW5hbGlzZShuZXcgQ3Rvcih4KSwgQ3Rvci5wcmVjaXNpb24sIEN0b3Iucm91bmRpbmcpO1xyXG4gIH1cclxuXHJcbiAgLy8gUHJldmVudCByb3VuZGluZyBvZiBpbnRlcm1lZGlhdGUgY2FsY3VsYXRpb25zLlxyXG4gIGV4dGVybmFsID0gZmFsc2U7XHJcblxyXG4gIGlmIChDdG9yLm1vZHVsbyA9PSA5KSB7XHJcblxyXG4gICAgLy8gRXVjbGlkaWFuIGRpdmlzaW9uOiBxID0gc2lnbih5KSAqIGZsb29yKHggLyBhYnMoeSkpXHJcbiAgICAvLyByZXN1bHQgPSB4IC0gcSAqIHkgICAgd2hlcmUgIDAgPD0gcmVzdWx0IDwgYWJzKHkpXHJcbiAgICBxID0gZGl2aWRlKHgsIHkuYWJzKCksIDAsIDMsIDEpO1xyXG4gICAgcS5zICo9IHkucztcclxuICB9IGVsc2Uge1xyXG4gICAgcSA9IGRpdmlkZSh4LCB5LCAwLCBDdG9yLm1vZHVsbywgMSk7XHJcbiAgfVxyXG5cclxuICBxID0gcS50aW1lcyh5KTtcclxuXHJcbiAgZXh0ZXJuYWwgPSB0cnVlO1xyXG5cclxuICByZXR1cm4geC5taW51cyhxKTtcclxufTtcclxuXHJcblxyXG4vKlxyXG4gKiBSZXR1cm4gYSBuZXcgRGVjaW1hbCB3aG9zZSB2YWx1ZSBpcyB0aGUgbmF0dXJhbCBleHBvbmVudGlhbCBvZiB0aGUgdmFsdWUgb2YgdGhpcyBEZWNpbWFsLFxyXG4gKiBpLmUuIHRoZSBiYXNlIGUgcmFpc2VkIHRvIHRoZSBwb3dlciB0aGUgdmFsdWUgb2YgdGhpcyBEZWNpbWFsLCByb3VuZGVkIHRvIGBwcmVjaXNpb25gXHJcbiAqIHNpZ25pZmljYW50IGRpZ2l0cyB1c2luZyByb3VuZGluZyBtb2RlIGByb3VuZGluZ2AuXHJcbiAqXHJcbiAqL1xyXG5QLm5hdHVyYWxFeHBvbmVudGlhbCA9IFAuZXhwID0gZnVuY3Rpb24gKCkge1xyXG4gIHJldHVybiBuYXR1cmFsRXhwb25lbnRpYWwodGhpcyk7XHJcbn07XHJcblxyXG5cclxuLypcclxuICogUmV0dXJuIGEgbmV3IERlY2ltYWwgd2hvc2UgdmFsdWUgaXMgdGhlIG5hdHVyYWwgbG9nYXJpdGhtIG9mIHRoZSB2YWx1ZSBvZiB0aGlzIERlY2ltYWwsXHJcbiAqIHJvdW5kZWQgdG8gYHByZWNpc2lvbmAgc2lnbmlmaWNhbnQgZGlnaXRzIHVzaW5nIHJvdW5kaW5nIG1vZGUgYHJvdW5kaW5nYC5cclxuICpcclxuICovXHJcblAubmF0dXJhbExvZ2FyaXRobSA9IFAubG4gPSBmdW5jdGlvbiAoKSB7XHJcbiAgcmV0dXJuIG5hdHVyYWxMb2dhcml0aG0odGhpcyk7XHJcbn07XHJcblxyXG5cclxuLypcclxuICogUmV0dXJuIGEgbmV3IERlY2ltYWwgd2hvc2UgdmFsdWUgaXMgdGhlIHZhbHVlIG9mIHRoaXMgRGVjaW1hbCBuZWdhdGVkLCBpLmUuIGFzIGlmIG11bHRpcGxpZWQgYnlcclxuICogLTEuXHJcbiAqXHJcbiAqL1xyXG5QLm5lZ2F0ZWQgPSBQLm5lZyA9IGZ1bmN0aW9uICgpIHtcclxuICB2YXIgeCA9IG5ldyB0aGlzLmNvbnN0cnVjdG9yKHRoaXMpO1xyXG4gIHgucyA9IC14LnM7XHJcbiAgcmV0dXJuIGZpbmFsaXNlKHgpO1xyXG59O1xyXG5cclxuXHJcbi8qXHJcbiAqICBuICsgMCA9IG5cclxuICogIG4gKyBOID0gTlxyXG4gKiAgbiArIEkgPSBJXHJcbiAqICAwICsgbiA9IG5cclxuICogIDAgKyAwID0gMFxyXG4gKiAgMCArIE4gPSBOXHJcbiAqICAwICsgSSA9IElcclxuICogIE4gKyBuID0gTlxyXG4gKiAgTiArIDAgPSBOXHJcbiAqICBOICsgTiA9IE5cclxuICogIE4gKyBJID0gTlxyXG4gKiAgSSArIG4gPSBJXHJcbiAqICBJICsgMCA9IElcclxuICogIEkgKyBOID0gTlxyXG4gKiAgSSArIEkgPSBJXHJcbiAqXHJcbiAqIFJldHVybiBhIG5ldyBEZWNpbWFsIHdob3NlIHZhbHVlIGlzIHRoZSB2YWx1ZSBvZiB0aGlzIERlY2ltYWwgcGx1cyBgeWAsIHJvdW5kZWQgdG8gYHByZWNpc2lvbmBcclxuICogc2lnbmlmaWNhbnQgZGlnaXRzIHVzaW5nIHJvdW5kaW5nIG1vZGUgYHJvdW5kaW5nYC5cclxuICpcclxuICovXHJcblAucGx1cyA9IFAuYWRkID0gZnVuY3Rpb24gKHkpIHtcclxuICB2YXIgY2FycnksIGQsIGUsIGksIGssIGxlbiwgcHIsIHJtLCB4ZCwgeWQsXHJcbiAgICB4ID0gdGhpcyxcclxuICAgIEN0b3IgPSB4LmNvbnN0cnVjdG9yO1xyXG5cclxuICB5ID0gbmV3IEN0b3IoeSk7XHJcblxyXG4gIC8vIElmIGVpdGhlciBpcyBub3QgZmluaXRlLi4uXHJcbiAgaWYgKCF4LmQgfHwgIXkuZCkge1xyXG5cclxuICAgIC8vIFJldHVybiBOYU4gaWYgZWl0aGVyIGlzIE5hTi5cclxuICAgIGlmICgheC5zIHx8ICF5LnMpIHkgPSBuZXcgQ3RvcihOYU4pO1xyXG5cclxuICAgIC8vIFJldHVybiB4IGlmIHkgaXMgZmluaXRlIGFuZCB4IGlzIFx1MDBCMUluZmluaXR5LlxyXG4gICAgLy8gUmV0dXJuIHggaWYgYm90aCBhcmUgXHUwMEIxSW5maW5pdHkgd2l0aCB0aGUgc2FtZSBzaWduLlxyXG4gICAgLy8gUmV0dXJuIE5hTiBpZiBib3RoIGFyZSBcdTAwQjFJbmZpbml0eSB3aXRoIGRpZmZlcmVudCBzaWducy5cclxuICAgIC8vIFJldHVybiB5IGlmIHggaXMgZmluaXRlIGFuZCB5IGlzIFx1MDBCMUluZmluaXR5LlxyXG4gICAgZWxzZSBpZiAoIXguZCkgeSA9IG5ldyBDdG9yKHkuZCB8fCB4LnMgPT09IHkucyA/IHggOiBOYU4pO1xyXG5cclxuICAgIHJldHVybiB5O1xyXG4gIH1cclxuXHJcbiAgIC8vIElmIHNpZ25zIGRpZmZlci4uLlxyXG4gIGlmICh4LnMgIT0geS5zKSB7XHJcbiAgICB5LnMgPSAteS5zO1xyXG4gICAgcmV0dXJuIHgubWludXMoeSk7XHJcbiAgfVxyXG5cclxuICB4ZCA9IHguZDtcclxuICB5ZCA9IHkuZDtcclxuICBwciA9IEN0b3IucHJlY2lzaW9uO1xyXG4gIHJtID0gQ3Rvci5yb3VuZGluZztcclxuXHJcbiAgLy8gSWYgZWl0aGVyIGlzIHplcm8uLi5cclxuICBpZiAoIXhkWzBdIHx8ICF5ZFswXSkge1xyXG5cclxuICAgIC8vIFJldHVybiB4IGlmIHkgaXMgemVyby5cclxuICAgIC8vIFJldHVybiB5IGlmIHkgaXMgbm9uLXplcm8uXHJcbiAgICBpZiAoIXlkWzBdKSB5ID0gbmV3IEN0b3IoeCk7XHJcblxyXG4gICAgcmV0dXJuIGV4dGVybmFsID8gZmluYWxpc2UoeSwgcHIsIHJtKSA6IHk7XHJcbiAgfVxyXG5cclxuICAvLyB4IGFuZCB5IGFyZSBmaW5pdGUsIG5vbi16ZXJvIG51bWJlcnMgd2l0aCB0aGUgc2FtZSBzaWduLlxyXG5cclxuICAvLyBDYWxjdWxhdGUgYmFzZSAxZTcgZXhwb25lbnRzLlxyXG4gIGsgPSBtYXRoZmxvb3IoeC5lIC8gTE9HX0JBU0UpO1xyXG4gIGUgPSBtYXRoZmxvb3IoeS5lIC8gTE9HX0JBU0UpO1xyXG5cclxuICB4ZCA9IHhkLnNsaWNlKCk7XHJcbiAgaSA9IGsgLSBlO1xyXG5cclxuICAvLyBJZiBiYXNlIDFlNyBleHBvbmVudHMgZGlmZmVyLi4uXHJcbiAgaWYgKGkpIHtcclxuXHJcbiAgICBpZiAoaSA8IDApIHtcclxuICAgICAgZCA9IHhkO1xyXG4gICAgICBpID0gLWk7XHJcbiAgICAgIGxlbiA9IHlkLmxlbmd0aDtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIGQgPSB5ZDtcclxuICAgICAgZSA9IGs7XHJcbiAgICAgIGxlbiA9IHhkLmxlbmd0aDtcclxuICAgIH1cclxuXHJcbiAgICAvLyBMaW1pdCBudW1iZXIgb2YgemVyb3MgcHJlcGVuZGVkIHRvIG1heChjZWlsKHByIC8gTE9HX0JBU0UpLCBsZW4pICsgMS5cclxuICAgIGsgPSBNYXRoLmNlaWwocHIgLyBMT0dfQkFTRSk7XHJcbiAgICBsZW4gPSBrID4gbGVuID8gayArIDEgOiBsZW4gKyAxO1xyXG5cclxuICAgIGlmIChpID4gbGVuKSB7XHJcbiAgICAgIGkgPSBsZW47XHJcbiAgICAgIGQubGVuZ3RoID0gMTtcclxuICAgIH1cclxuXHJcbiAgICAvLyBQcmVwZW5kIHplcm9zIHRvIGVxdWFsaXNlIGV4cG9uZW50cy4gTm90ZTogRmFzdGVyIHRvIHVzZSByZXZlcnNlIHRoZW4gZG8gdW5zaGlmdHMuXHJcbiAgICBkLnJldmVyc2UoKTtcclxuICAgIGZvciAoOyBpLS07KSBkLnB1c2goMCk7XHJcbiAgICBkLnJldmVyc2UoKTtcclxuICB9XHJcblxyXG4gIGxlbiA9IHhkLmxlbmd0aDtcclxuICBpID0geWQubGVuZ3RoO1xyXG5cclxuICAvLyBJZiB5ZCBpcyBsb25nZXIgdGhhbiB4ZCwgc3dhcCB4ZCBhbmQgeWQgc28geGQgcG9pbnRzIHRvIHRoZSBsb25nZXIgYXJyYXkuXHJcbiAgaWYgKGxlbiAtIGkgPCAwKSB7XHJcbiAgICBpID0gbGVuO1xyXG4gICAgZCA9IHlkO1xyXG4gICAgeWQgPSB4ZDtcclxuICAgIHhkID0gZDtcclxuICB9XHJcblxyXG4gIC8vIE9ubHkgc3RhcnQgYWRkaW5nIGF0IHlkLmxlbmd0aCAtIDEgYXMgdGhlIGZ1cnRoZXIgZGlnaXRzIG9mIHhkIGNhbiBiZSBsZWZ0IGFzIHRoZXkgYXJlLlxyXG4gIGZvciAoY2FycnkgPSAwOyBpOykge1xyXG4gICAgY2FycnkgPSAoeGRbLS1pXSA9IHhkW2ldICsgeWRbaV0gKyBjYXJyeSkgLyBCQVNFIHwgMDtcclxuICAgIHhkW2ldICU9IEJBU0U7XHJcbiAgfVxyXG5cclxuICBpZiAoY2FycnkpIHtcclxuICAgIHhkLnVuc2hpZnQoY2FycnkpO1xyXG4gICAgKytlO1xyXG4gIH1cclxuXHJcbiAgLy8gUmVtb3ZlIHRyYWlsaW5nIHplcm9zLlxyXG4gIC8vIE5vIG5lZWQgdG8gY2hlY2sgZm9yIHplcm8sIGFzICt4ICsgK3kgIT0gMCAmJiAteCArIC15ICE9IDBcclxuICBmb3IgKGxlbiA9IHhkLmxlbmd0aDsgeGRbLS1sZW5dID09IDA7KSB4ZC5wb3AoKTtcclxuXHJcbiAgeS5kID0geGQ7XHJcbiAgeS5lID0gZ2V0QmFzZTEwRXhwb25lbnQoeGQsIGUpO1xyXG5cclxuICByZXR1cm4gZXh0ZXJuYWwgPyBmaW5hbGlzZSh5LCBwciwgcm0pIDogeTtcclxufTtcclxuXHJcblxyXG4vKlxyXG4gKiBSZXR1cm4gdGhlIG51bWJlciBvZiBzaWduaWZpY2FudCBkaWdpdHMgb2YgdGhlIHZhbHVlIG9mIHRoaXMgRGVjaW1hbC5cclxuICpcclxuICogW3pdIHtib29sZWFufG51bWJlcn0gV2hldGhlciB0byBjb3VudCBpbnRlZ2VyLXBhcnQgdHJhaWxpbmcgemVyb3M6IHRydWUsIGZhbHNlLCAxIG9yIDAuXHJcbiAqXHJcbiAqL1xyXG5QLnByZWNpc2lvbiA9IFAuc2QgPSBmdW5jdGlvbiAoeikge1xyXG4gIHZhciBrLFxyXG4gICAgeCA9IHRoaXM7XHJcblxyXG4gIGlmICh6ICE9PSB2b2lkIDAgJiYgeiAhPT0gISF6ICYmIHogIT09IDEgJiYgeiAhPT0gMCkgdGhyb3cgRXJyb3IoaW52YWxpZEFyZ3VtZW50ICsgeik7XHJcblxyXG4gIGlmICh4LmQpIHtcclxuICAgIGsgPSBnZXRQcmVjaXNpb24oeC5kKTtcclxuICAgIGlmICh6ICYmIHguZSArIDEgPiBrKSBrID0geC5lICsgMTtcclxuICB9IGVsc2Uge1xyXG4gICAgayA9IE5hTjtcclxuICB9XHJcblxyXG4gIHJldHVybiBrO1xyXG59O1xyXG5cclxuXHJcbi8qXHJcbiAqIFJldHVybiBhIG5ldyBEZWNpbWFsIHdob3NlIHZhbHVlIGlzIHRoZSB2YWx1ZSBvZiB0aGlzIERlY2ltYWwgcm91bmRlZCB0byBhIHdob2xlIG51bWJlciB1c2luZ1xyXG4gKiByb3VuZGluZyBtb2RlIGByb3VuZGluZ2AuXHJcbiAqXHJcbiAqL1xyXG5QLnJvdW5kID0gZnVuY3Rpb24gKCkge1xyXG4gIHZhciB4ID0gdGhpcyxcclxuICAgIEN0b3IgPSB4LmNvbnN0cnVjdG9yO1xyXG5cclxuICByZXR1cm4gZmluYWxpc2UobmV3IEN0b3IoeCksIHguZSArIDEsIEN0b3Iucm91bmRpbmcpO1xyXG59O1xyXG5cclxuXHJcbi8qXHJcbiAqIFJldHVybiBhIG5ldyBEZWNpbWFsIHdob3NlIHZhbHVlIGlzIHRoZSBzaW5lIG9mIHRoZSB2YWx1ZSBpbiByYWRpYW5zIG9mIHRoaXMgRGVjaW1hbC5cclxuICpcclxuICogRG9tYWluOiBbLUluZmluaXR5LCBJbmZpbml0eV1cclxuICogUmFuZ2U6IFstMSwgMV1cclxuICpcclxuICogc2luKHgpID0geCAtIHheMy8zISArIHheNS81ISAtIC4uLlxyXG4gKlxyXG4gKiBzaW4oMCkgICAgICAgICA9IDBcclxuICogc2luKC0wKSAgICAgICAgPSAtMFxyXG4gKiBzaW4oSW5maW5pdHkpICA9IE5hTlxyXG4gKiBzaW4oLUluZmluaXR5KSA9IE5hTlxyXG4gKiBzaW4oTmFOKSAgICAgICA9IE5hTlxyXG4gKlxyXG4gKi9cclxuUC5zaW5lID0gUC5zaW4gPSBmdW5jdGlvbiAoKSB7XHJcbiAgdmFyIHByLCBybSxcclxuICAgIHggPSB0aGlzLFxyXG4gICAgQ3RvciA9IHguY29uc3RydWN0b3I7XHJcblxyXG4gIGlmICgheC5pc0Zpbml0ZSgpKSByZXR1cm4gbmV3IEN0b3IoTmFOKTtcclxuICBpZiAoeC5pc1plcm8oKSkgcmV0dXJuIG5ldyBDdG9yKHgpO1xyXG5cclxuICBwciA9IEN0b3IucHJlY2lzaW9uO1xyXG4gIHJtID0gQ3Rvci5yb3VuZGluZztcclxuICBDdG9yLnByZWNpc2lvbiA9IHByICsgTWF0aC5tYXgoeC5lLCB4LnNkKCkpICsgTE9HX0JBU0U7XHJcbiAgQ3Rvci5yb3VuZGluZyA9IDE7XHJcblxyXG4gIHggPSBzaW5lKEN0b3IsIHRvTGVzc1RoYW5IYWxmUGkoQ3RvciwgeCkpO1xyXG5cclxuICBDdG9yLnByZWNpc2lvbiA9IHByO1xyXG4gIEN0b3Iucm91bmRpbmcgPSBybTtcclxuXHJcbiAgcmV0dXJuIGZpbmFsaXNlKHF1YWRyYW50ID4gMiA/IHgubmVnKCkgOiB4LCBwciwgcm0sIHRydWUpO1xyXG59O1xyXG5cclxuXHJcbi8qXHJcbiAqIFJldHVybiBhIG5ldyBEZWNpbWFsIHdob3NlIHZhbHVlIGlzIHRoZSBzcXVhcmUgcm9vdCBvZiB0aGlzIERlY2ltYWwsIHJvdW5kZWQgdG8gYHByZWNpc2lvbmBcclxuICogc2lnbmlmaWNhbnQgZGlnaXRzIHVzaW5nIHJvdW5kaW5nIG1vZGUgYHJvdW5kaW5nYC5cclxuICpcclxuICogIHNxcnQoLW4pID0gIE5cclxuICogIHNxcnQoTikgID0gIE5cclxuICogIHNxcnQoLUkpID0gIE5cclxuICogIHNxcnQoSSkgID0gIElcclxuICogIHNxcnQoMCkgID0gIDBcclxuICogIHNxcnQoLTApID0gLTBcclxuICpcclxuICovXHJcblAuc3F1YXJlUm9vdCA9IFAuc3FydCA9IGZ1bmN0aW9uICgpIHtcclxuICB2YXIgbSwgbiwgc2QsIHIsIHJlcCwgdCxcclxuICAgIHggPSB0aGlzLFxyXG4gICAgZCA9IHguZCxcclxuICAgIGUgPSB4LmUsXHJcbiAgICBzID0geC5zLFxyXG4gICAgQ3RvciA9IHguY29uc3RydWN0b3I7XHJcblxyXG4gIC8vIE5lZ2F0aXZlL05hTi9JbmZpbml0eS96ZXJvP1xyXG4gIGlmIChzICE9PSAxIHx8ICFkIHx8ICFkWzBdKSB7XHJcbiAgICByZXR1cm4gbmV3IEN0b3IoIXMgfHwgcyA8IDAgJiYgKCFkIHx8IGRbMF0pID8gTmFOIDogZCA/IHggOiAxIC8gMCk7XHJcbiAgfVxyXG5cclxuICBleHRlcm5hbCA9IGZhbHNlO1xyXG5cclxuICAvLyBJbml0aWFsIGVzdGltYXRlLlxyXG4gIHMgPSBNYXRoLnNxcnQoK3gpO1xyXG5cclxuICAvLyBNYXRoLnNxcnQgdW5kZXJmbG93L292ZXJmbG93P1xyXG4gIC8vIFBhc3MgeCB0byBNYXRoLnNxcnQgYXMgaW50ZWdlciwgdGhlbiBhZGp1c3QgdGhlIGV4cG9uZW50IG9mIHRoZSByZXN1bHQuXHJcbiAgaWYgKHMgPT0gMCB8fCBzID09IDEgLyAwKSB7XHJcbiAgICBuID0gZGlnaXRzVG9TdHJpbmcoZCk7XHJcblxyXG4gICAgaWYgKChuLmxlbmd0aCArIGUpICUgMiA9PSAwKSBuICs9ICcwJztcclxuICAgIHMgPSBNYXRoLnNxcnQobik7XHJcbiAgICBlID0gbWF0aGZsb29yKChlICsgMSkgLyAyKSAtIChlIDwgMCB8fCBlICUgMik7XHJcblxyXG4gICAgaWYgKHMgPT0gMSAvIDApIHtcclxuICAgICAgbiA9ICc1ZScgKyBlO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgbiA9IHMudG9FeHBvbmVudGlhbCgpO1xyXG4gICAgICBuID0gbi5zbGljZSgwLCBuLmluZGV4T2YoJ2UnKSArIDEpICsgZTtcclxuICAgIH1cclxuXHJcbiAgICByID0gbmV3IEN0b3Iobik7XHJcbiAgfSBlbHNlIHtcclxuICAgIHIgPSBuZXcgQ3RvcihzLnRvU3RyaW5nKCkpO1xyXG4gIH1cclxuXHJcbiAgc2QgPSAoZSA9IEN0b3IucHJlY2lzaW9uKSArIDM7XHJcblxyXG4gIC8vIE5ld3Rvbi1SYXBoc29uIGl0ZXJhdGlvbi5cclxuICBmb3IgKDs7KSB7XHJcbiAgICB0ID0gcjtcclxuICAgIHIgPSB0LnBsdXMoZGl2aWRlKHgsIHQsIHNkICsgMiwgMSkpLnRpbWVzKDAuNSk7XHJcblxyXG4gICAgLy8gVE9ETz8gUmVwbGFjZSB3aXRoIGZvci1sb29wIGFuZCBjaGVja1JvdW5kaW5nRGlnaXRzLlxyXG4gICAgaWYgKGRpZ2l0c1RvU3RyaW5nKHQuZCkuc2xpY2UoMCwgc2QpID09PSAobiA9IGRpZ2l0c1RvU3RyaW5nKHIuZCkpLnNsaWNlKDAsIHNkKSkge1xyXG4gICAgICBuID0gbi5zbGljZShzZCAtIDMsIHNkICsgMSk7XHJcblxyXG4gICAgICAvLyBUaGUgNHRoIHJvdW5kaW5nIGRpZ2l0IG1heSBiZSBpbiBlcnJvciBieSAtMSBzbyBpZiB0aGUgNCByb3VuZGluZyBkaWdpdHMgYXJlIDk5OTkgb3JcclxuICAgICAgLy8gNDk5OSwgaS5lLiBhcHByb2FjaGluZyBhIHJvdW5kaW5nIGJvdW5kYXJ5LCBjb250aW51ZSB0aGUgaXRlcmF0aW9uLlxyXG4gICAgICBpZiAobiA9PSAnOTk5OScgfHwgIXJlcCAmJiBuID09ICc0OTk5Jykge1xyXG5cclxuICAgICAgICAvLyBPbiB0aGUgZmlyc3QgaXRlcmF0aW9uIG9ubHksIGNoZWNrIHRvIHNlZSBpZiByb3VuZGluZyB1cCBnaXZlcyB0aGUgZXhhY3QgcmVzdWx0IGFzIHRoZVxyXG4gICAgICAgIC8vIG5pbmVzIG1heSBpbmZpbml0ZWx5IHJlcGVhdC5cclxuICAgICAgICBpZiAoIXJlcCkge1xyXG4gICAgICAgICAgZmluYWxpc2UodCwgZSArIDEsIDApO1xyXG5cclxuICAgICAgICAgIGlmICh0LnRpbWVzKHQpLmVxKHgpKSB7XHJcbiAgICAgICAgICAgIHIgPSB0O1xyXG4gICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHNkICs9IDQ7XHJcbiAgICAgICAgcmVwID0gMTtcclxuICAgICAgfSBlbHNlIHtcclxuXHJcbiAgICAgICAgLy8gSWYgdGhlIHJvdW5kaW5nIGRpZ2l0cyBhcmUgbnVsbCwgMHswLDR9IG9yIDUwezAsM30sIGNoZWNrIGZvciBhbiBleGFjdCByZXN1bHQuXHJcbiAgICAgICAgLy8gSWYgbm90LCB0aGVuIHRoZXJlIGFyZSBmdXJ0aGVyIGRpZ2l0cyBhbmQgbSB3aWxsIGJlIHRydXRoeS5cclxuICAgICAgICBpZiAoIStuIHx8ICErbi5zbGljZSgxKSAmJiBuLmNoYXJBdCgwKSA9PSAnNScpIHtcclxuXHJcbiAgICAgICAgICAvLyBUcnVuY2F0ZSB0byB0aGUgZmlyc3Qgcm91bmRpbmcgZGlnaXQuXHJcbiAgICAgICAgICBmaW5hbGlzZShyLCBlICsgMSwgMSk7XHJcbiAgICAgICAgICBtID0gIXIudGltZXMocikuZXEoeCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBicmVhaztcclxuICAgICAgfVxyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgZXh0ZXJuYWwgPSB0cnVlO1xyXG5cclxuICByZXR1cm4gZmluYWxpc2UociwgZSwgQ3Rvci5yb3VuZGluZywgbSk7XHJcbn07XHJcblxyXG5cclxuLypcclxuICogUmV0dXJuIGEgbmV3IERlY2ltYWwgd2hvc2UgdmFsdWUgaXMgdGhlIHRhbmdlbnQgb2YgdGhlIHZhbHVlIGluIHJhZGlhbnMgb2YgdGhpcyBEZWNpbWFsLlxyXG4gKlxyXG4gKiBEb21haW46IFstSW5maW5pdHksIEluZmluaXR5XVxyXG4gKiBSYW5nZTogWy1JbmZpbml0eSwgSW5maW5pdHldXHJcbiAqXHJcbiAqIHRhbigwKSAgICAgICAgID0gMFxyXG4gKiB0YW4oLTApICAgICAgICA9IC0wXHJcbiAqIHRhbihJbmZpbml0eSkgID0gTmFOXHJcbiAqIHRhbigtSW5maW5pdHkpID0gTmFOXHJcbiAqIHRhbihOYU4pICAgICAgID0gTmFOXHJcbiAqXHJcbiAqL1xyXG5QLnRhbmdlbnQgPSBQLnRhbiA9IGZ1bmN0aW9uICgpIHtcclxuICB2YXIgcHIsIHJtLFxyXG4gICAgeCA9IHRoaXMsXHJcbiAgICBDdG9yID0geC5jb25zdHJ1Y3RvcjtcclxuXHJcbiAgaWYgKCF4LmlzRmluaXRlKCkpIHJldHVybiBuZXcgQ3RvcihOYU4pO1xyXG4gIGlmICh4LmlzWmVybygpKSByZXR1cm4gbmV3IEN0b3IoeCk7XHJcblxyXG4gIHByID0gQ3Rvci5wcmVjaXNpb247XHJcbiAgcm0gPSBDdG9yLnJvdW5kaW5nO1xyXG4gIEN0b3IucHJlY2lzaW9uID0gcHIgKyAxMDtcclxuICBDdG9yLnJvdW5kaW5nID0gMTtcclxuXHJcbiAgeCA9IHguc2luKCk7XHJcbiAgeC5zID0gMTtcclxuICB4ID0gZGl2aWRlKHgsIG5ldyBDdG9yKDEpLm1pbnVzKHgudGltZXMoeCkpLnNxcnQoKSwgcHIgKyAxMCwgMCk7XHJcblxyXG4gIEN0b3IucHJlY2lzaW9uID0gcHI7XHJcbiAgQ3Rvci5yb3VuZGluZyA9IHJtO1xyXG5cclxuICByZXR1cm4gZmluYWxpc2UocXVhZHJhbnQgPT0gMiB8fCBxdWFkcmFudCA9PSA0ID8geC5uZWcoKSA6IHgsIHByLCBybSwgdHJ1ZSk7XHJcbn07XHJcblxyXG5cclxuLypcclxuICogIG4gKiAwID0gMFxyXG4gKiAgbiAqIE4gPSBOXHJcbiAqICBuICogSSA9IElcclxuICogIDAgKiBuID0gMFxyXG4gKiAgMCAqIDAgPSAwXHJcbiAqICAwICogTiA9IE5cclxuICogIDAgKiBJID0gTlxyXG4gKiAgTiAqIG4gPSBOXHJcbiAqICBOICogMCA9IE5cclxuICogIE4gKiBOID0gTlxyXG4gKiAgTiAqIEkgPSBOXHJcbiAqICBJICogbiA9IElcclxuICogIEkgKiAwID0gTlxyXG4gKiAgSSAqIE4gPSBOXHJcbiAqICBJICogSSA9IElcclxuICpcclxuICogUmV0dXJuIGEgbmV3IERlY2ltYWwgd2hvc2UgdmFsdWUgaXMgdGhpcyBEZWNpbWFsIHRpbWVzIGB5YCwgcm91bmRlZCB0byBgcHJlY2lzaW9uYCBzaWduaWZpY2FudFxyXG4gKiBkaWdpdHMgdXNpbmcgcm91bmRpbmcgbW9kZSBgcm91bmRpbmdgLlxyXG4gKlxyXG4gKi9cclxuUC50aW1lcyA9IFAubXVsID0gZnVuY3Rpb24gKHkpIHtcclxuICB2YXIgY2FycnksIGUsIGksIGssIHIsIHJMLCB0LCB4ZEwsIHlkTCxcclxuICAgIHggPSB0aGlzLFxyXG4gICAgQ3RvciA9IHguY29uc3RydWN0b3IsXHJcbiAgICB4ZCA9IHguZCxcclxuICAgIHlkID0gKHkgPSBuZXcgQ3Rvcih5KSkuZDtcclxuXHJcbiAgeS5zICo9IHgucztcclxuXHJcbiAgIC8vIElmIGVpdGhlciBpcyBOYU4sIFx1MDBCMUluZmluaXR5IG9yIFx1MDBCMTAuLi5cclxuICBpZiAoIXhkIHx8ICF4ZFswXSB8fCAheWQgfHwgIXlkWzBdKSB7XHJcblxyXG4gICAgcmV0dXJuIG5ldyBDdG9yKCF5LnMgfHwgeGQgJiYgIXhkWzBdICYmICF5ZCB8fCB5ZCAmJiAheWRbMF0gJiYgIXhkXHJcblxyXG4gICAgICAvLyBSZXR1cm4gTmFOIGlmIGVpdGhlciBpcyBOYU4uXHJcbiAgICAgIC8vIFJldHVybiBOYU4gaWYgeCBpcyBcdTAwQjEwIGFuZCB5IGlzIFx1MDBCMUluZmluaXR5LCBvciB5IGlzIFx1MDBCMTAgYW5kIHggaXMgXHUwMEIxSW5maW5pdHkuXHJcbiAgICAgID8gTmFOXHJcblxyXG4gICAgICAvLyBSZXR1cm4gXHUwMEIxSW5maW5pdHkgaWYgZWl0aGVyIGlzIFx1MDBCMUluZmluaXR5LlxyXG4gICAgICAvLyBSZXR1cm4gXHUwMEIxMCBpZiBlaXRoZXIgaXMgXHUwMEIxMC5cclxuICAgICAgOiAheGQgfHwgIXlkID8geS5zIC8gMCA6IHkucyAqIDApO1xyXG4gIH1cclxuXHJcbiAgZSA9IG1hdGhmbG9vcih4LmUgLyBMT0dfQkFTRSkgKyBtYXRoZmxvb3IoeS5lIC8gTE9HX0JBU0UpO1xyXG4gIHhkTCA9IHhkLmxlbmd0aDtcclxuICB5ZEwgPSB5ZC5sZW5ndGg7XHJcblxyXG4gIC8vIEVuc3VyZSB4ZCBwb2ludHMgdG8gdGhlIGxvbmdlciBhcnJheS5cclxuICBpZiAoeGRMIDwgeWRMKSB7XHJcbiAgICByID0geGQ7XHJcbiAgICB4ZCA9IHlkO1xyXG4gICAgeWQgPSByO1xyXG4gICAgckwgPSB4ZEw7XHJcbiAgICB4ZEwgPSB5ZEw7XHJcbiAgICB5ZEwgPSByTDtcclxuICB9XHJcblxyXG4gIC8vIEluaXRpYWxpc2UgdGhlIHJlc3VsdCBhcnJheSB3aXRoIHplcm9zLlxyXG4gIHIgPSBbXTtcclxuICByTCA9IHhkTCArIHlkTDtcclxuICBmb3IgKGkgPSByTDsgaS0tOykgci5wdXNoKDApO1xyXG5cclxuICAvLyBNdWx0aXBseSFcclxuICBmb3IgKGkgPSB5ZEw7IC0taSA+PSAwOykge1xyXG4gICAgY2FycnkgPSAwO1xyXG4gICAgZm9yIChrID0geGRMICsgaTsgayA+IGk7KSB7XHJcbiAgICAgIHQgPSByW2tdICsgeWRbaV0gKiB4ZFtrIC0gaSAtIDFdICsgY2Fycnk7XHJcbiAgICAgIHJbay0tXSA9IHQgJSBCQVNFIHwgMDtcclxuICAgICAgY2FycnkgPSB0IC8gQkFTRSB8IDA7XHJcbiAgICB9XHJcblxyXG4gICAgcltrXSA9IChyW2tdICsgY2FycnkpICUgQkFTRSB8IDA7XHJcbiAgfVxyXG5cclxuICAvLyBSZW1vdmUgdHJhaWxpbmcgemVyb3MuXHJcbiAgZm9yICg7ICFyWy0tckxdOykgci5wb3AoKTtcclxuXHJcbiAgaWYgKGNhcnJ5KSArK2U7XHJcbiAgZWxzZSByLnNoaWZ0KCk7XHJcblxyXG4gIHkuZCA9IHI7XHJcbiAgeS5lID0gZ2V0QmFzZTEwRXhwb25lbnQociwgZSk7XHJcblxyXG4gIHJldHVybiBleHRlcm5hbCA/IGZpbmFsaXNlKHksIEN0b3IucHJlY2lzaW9uLCBDdG9yLnJvdW5kaW5nKSA6IHk7XHJcbn07XHJcblxyXG5cclxuLypcclxuICogUmV0dXJuIGEgc3RyaW5nIHJlcHJlc2VudGluZyB0aGUgdmFsdWUgb2YgdGhpcyBEZWNpbWFsIGluIGJhc2UgMiwgcm91bmQgdG8gYHNkYCBzaWduaWZpY2FudFxyXG4gKiBkaWdpdHMgdXNpbmcgcm91bmRpbmcgbW9kZSBgcm1gLlxyXG4gKlxyXG4gKiBJZiB0aGUgb3B0aW9uYWwgYHNkYCBhcmd1bWVudCBpcyBwcmVzZW50IHRoZW4gcmV0dXJuIGJpbmFyeSBleHBvbmVudGlhbCBub3RhdGlvbi5cclxuICpcclxuICogW3NkXSB7bnVtYmVyfSBTaWduaWZpY2FudCBkaWdpdHMuIEludGVnZXIsIDEgdG8gTUFYX0RJR0lUUyBpbmNsdXNpdmUuXHJcbiAqIFtybV0ge251bWJlcn0gUm91bmRpbmcgbW9kZS4gSW50ZWdlciwgMCB0byA4IGluY2x1c2l2ZS5cclxuICpcclxuICovXHJcblAudG9CaW5hcnkgPSBmdW5jdGlvbiAoc2QsIHJtKSB7XHJcbiAgcmV0dXJuIHRvU3RyaW5nQmluYXJ5KHRoaXMsIDIsIHNkLCBybSk7XHJcbn07XHJcblxyXG5cclxuLypcclxuICogUmV0dXJuIGEgbmV3IERlY2ltYWwgd2hvc2UgdmFsdWUgaXMgdGhlIHZhbHVlIG9mIHRoaXMgRGVjaW1hbCByb3VuZGVkIHRvIGEgbWF4aW11bSBvZiBgZHBgXHJcbiAqIGRlY2ltYWwgcGxhY2VzIHVzaW5nIHJvdW5kaW5nIG1vZGUgYHJtYCBvciBgcm91bmRpbmdgIGlmIGBybWAgaXMgb21pdHRlZC5cclxuICpcclxuICogSWYgYGRwYCBpcyBvbWl0dGVkLCByZXR1cm4gYSBuZXcgRGVjaW1hbCB3aG9zZSB2YWx1ZSBpcyB0aGUgdmFsdWUgb2YgdGhpcyBEZWNpbWFsLlxyXG4gKlxyXG4gKiBbZHBdIHtudW1iZXJ9IERlY2ltYWwgcGxhY2VzLiBJbnRlZ2VyLCAwIHRvIE1BWF9ESUdJVFMgaW5jbHVzaXZlLlxyXG4gKiBbcm1dIHtudW1iZXJ9IFJvdW5kaW5nIG1vZGUuIEludGVnZXIsIDAgdG8gOCBpbmNsdXNpdmUuXHJcbiAqXHJcbiAqL1xyXG5QLnRvRGVjaW1hbFBsYWNlcyA9IFAudG9EUCA9IGZ1bmN0aW9uIChkcCwgcm0pIHtcclxuICB2YXIgeCA9IHRoaXMsXHJcbiAgICBDdG9yID0geC5jb25zdHJ1Y3RvcjtcclxuXHJcbiAgeCA9IG5ldyBDdG9yKHgpO1xyXG4gIGlmIChkcCA9PT0gdm9pZCAwKSByZXR1cm4geDtcclxuXHJcbiAgY2hlY2tJbnQzMihkcCwgMCwgTUFYX0RJR0lUUyk7XHJcblxyXG4gIGlmIChybSA9PT0gdm9pZCAwKSBybSA9IEN0b3Iucm91bmRpbmc7XHJcbiAgZWxzZSBjaGVja0ludDMyKHJtLCAwLCA4KTtcclxuXHJcbiAgcmV0dXJuIGZpbmFsaXNlKHgsIGRwICsgeC5lICsgMSwgcm0pO1xyXG59O1xyXG5cclxuXHJcbi8qXHJcbiAqIFJldHVybiBhIHN0cmluZyByZXByZXNlbnRpbmcgdGhlIHZhbHVlIG9mIHRoaXMgRGVjaW1hbCBpbiBleHBvbmVudGlhbCBub3RhdGlvbiByb3VuZGVkIHRvXHJcbiAqIGBkcGAgZml4ZWQgZGVjaW1hbCBwbGFjZXMgdXNpbmcgcm91bmRpbmcgbW9kZSBgcm91bmRpbmdgLlxyXG4gKlxyXG4gKiBbZHBdIHtudW1iZXJ9IERlY2ltYWwgcGxhY2VzLiBJbnRlZ2VyLCAwIHRvIE1BWF9ESUdJVFMgaW5jbHVzaXZlLlxyXG4gKiBbcm1dIHtudW1iZXJ9IFJvdW5kaW5nIG1vZGUuIEludGVnZXIsIDAgdG8gOCBpbmNsdXNpdmUuXHJcbiAqXHJcbiAqL1xyXG5QLnRvRXhwb25lbnRpYWwgPSBmdW5jdGlvbiAoZHAsIHJtKSB7XHJcbiAgdmFyIHN0cixcclxuICAgIHggPSB0aGlzLFxyXG4gICAgQ3RvciA9IHguY29uc3RydWN0b3I7XHJcblxyXG4gIGlmIChkcCA9PT0gdm9pZCAwKSB7XHJcbiAgICBzdHIgPSBmaW5pdGVUb1N0cmluZyh4LCB0cnVlKTtcclxuICB9IGVsc2Uge1xyXG4gICAgY2hlY2tJbnQzMihkcCwgMCwgTUFYX0RJR0lUUyk7XHJcblxyXG4gICAgaWYgKHJtID09PSB2b2lkIDApIHJtID0gQ3Rvci5yb3VuZGluZztcclxuICAgIGVsc2UgY2hlY2tJbnQzMihybSwgMCwgOCk7XHJcblxyXG4gICAgeCA9IGZpbmFsaXNlKG5ldyBDdG9yKHgpLCBkcCArIDEsIHJtKTtcclxuICAgIHN0ciA9IGZpbml0ZVRvU3RyaW5nKHgsIHRydWUsIGRwICsgMSk7XHJcbiAgfVxyXG5cclxuICByZXR1cm4geC5pc05lZygpICYmICF4LmlzWmVybygpID8gJy0nICsgc3RyIDogc3RyO1xyXG59O1xyXG5cclxuXHJcbi8qXHJcbiAqIFJldHVybiBhIHN0cmluZyByZXByZXNlbnRpbmcgdGhlIHZhbHVlIG9mIHRoaXMgRGVjaW1hbCBpbiBub3JtYWwgKGZpeGVkLXBvaW50KSBub3RhdGlvbiB0b1xyXG4gKiBgZHBgIGZpeGVkIGRlY2ltYWwgcGxhY2VzIGFuZCByb3VuZGVkIHVzaW5nIHJvdW5kaW5nIG1vZGUgYHJtYCBvciBgcm91bmRpbmdgIGlmIGBybWAgaXNcclxuICogb21pdHRlZC5cclxuICpcclxuICogQXMgd2l0aCBKYXZhU2NyaXB0IG51bWJlcnMsICgtMCkudG9GaXhlZCgwKSBpcyAnMCcsIGJ1dCBlLmcuICgtMC4wMDAwMSkudG9GaXhlZCgwKSBpcyAnLTAnLlxyXG4gKlxyXG4gKiBbZHBdIHtudW1iZXJ9IERlY2ltYWwgcGxhY2VzLiBJbnRlZ2VyLCAwIHRvIE1BWF9ESUdJVFMgaW5jbHVzaXZlLlxyXG4gKiBbcm1dIHtudW1iZXJ9IFJvdW5kaW5nIG1vZGUuIEludGVnZXIsIDAgdG8gOCBpbmNsdXNpdmUuXHJcbiAqXHJcbiAqICgtMCkudG9GaXhlZCgwKSBpcyAnMCcsIGJ1dCAoLTAuMSkudG9GaXhlZCgwKSBpcyAnLTAnLlxyXG4gKiAoLTApLnRvRml4ZWQoMSkgaXMgJzAuMCcsIGJ1dCAoLTAuMDEpLnRvRml4ZWQoMSkgaXMgJy0wLjAnLlxyXG4gKiAoLTApLnRvRml4ZWQoMykgaXMgJzAuMDAwJy5cclxuICogKC0wLjUpLnRvRml4ZWQoMCkgaXMgJy0wJy5cclxuICpcclxuICovXHJcblAudG9GaXhlZCA9IGZ1bmN0aW9uIChkcCwgcm0pIHtcclxuICB2YXIgc3RyLCB5LFxyXG4gICAgeCA9IHRoaXMsXHJcbiAgICBDdG9yID0geC5jb25zdHJ1Y3RvcjtcclxuXHJcbiAgaWYgKGRwID09PSB2b2lkIDApIHtcclxuICAgIHN0ciA9IGZpbml0ZVRvU3RyaW5nKHgpO1xyXG4gIH0gZWxzZSB7XHJcbiAgICBjaGVja0ludDMyKGRwLCAwLCBNQVhfRElHSVRTKTtcclxuXHJcbiAgICBpZiAocm0gPT09IHZvaWQgMCkgcm0gPSBDdG9yLnJvdW5kaW5nO1xyXG4gICAgZWxzZSBjaGVja0ludDMyKHJtLCAwLCA4KTtcclxuXHJcbiAgICB5ID0gZmluYWxpc2UobmV3IEN0b3IoeCksIGRwICsgeC5lICsgMSwgcm0pO1xyXG4gICAgc3RyID0gZmluaXRlVG9TdHJpbmcoeSwgZmFsc2UsIGRwICsgeS5lICsgMSk7XHJcbiAgfVxyXG5cclxuICAvLyBUbyBkZXRlcm1pbmUgd2hldGhlciB0byBhZGQgdGhlIG1pbnVzIHNpZ24gbG9vayBhdCB0aGUgdmFsdWUgYmVmb3JlIGl0IHdhcyByb3VuZGVkLFxyXG4gIC8vIGkuZS4gbG9vayBhdCBgeGAgcmF0aGVyIHRoYW4gYHlgLlxyXG4gIHJldHVybiB4LmlzTmVnKCkgJiYgIXguaXNaZXJvKCkgPyAnLScgKyBzdHIgOiBzdHI7XHJcbn07XHJcblxyXG5cclxuLypcclxuICogUmV0dXJuIGFuIGFycmF5IHJlcHJlc2VudGluZyB0aGUgdmFsdWUgb2YgdGhpcyBEZWNpbWFsIGFzIGEgc2ltcGxlIGZyYWN0aW9uIHdpdGggYW4gaW50ZWdlclxyXG4gKiBudW1lcmF0b3IgYW5kIGFuIGludGVnZXIgZGVub21pbmF0b3IuXHJcbiAqXHJcbiAqIFRoZSBkZW5vbWluYXRvciB3aWxsIGJlIGEgcG9zaXRpdmUgbm9uLXplcm8gdmFsdWUgbGVzcyB0aGFuIG9yIGVxdWFsIHRvIHRoZSBzcGVjaWZpZWQgbWF4aW11bVxyXG4gKiBkZW5vbWluYXRvci4gSWYgYSBtYXhpbXVtIGRlbm9taW5hdG9yIGlzIG5vdCBzcGVjaWZpZWQsIHRoZSBkZW5vbWluYXRvciB3aWxsIGJlIHRoZSBsb3dlc3RcclxuICogdmFsdWUgbmVjZXNzYXJ5IHRvIHJlcHJlc2VudCB0aGUgbnVtYmVyIGV4YWN0bHkuXHJcbiAqXHJcbiAqIFttYXhEXSB7bnVtYmVyfHN0cmluZ3xEZWNpbWFsfSBNYXhpbXVtIGRlbm9taW5hdG9yLiBJbnRlZ2VyID49IDEgYW5kIDwgSW5maW5pdHkuXHJcbiAqXHJcbiAqL1xyXG5QLnRvRnJhY3Rpb24gPSBmdW5jdGlvbiAobWF4RCkge1xyXG4gIHZhciBkLCBkMCwgZDEsIGQyLCBlLCBrLCBuLCBuMCwgbjEsIHByLCBxLCByLFxyXG4gICAgeCA9IHRoaXMsXHJcbiAgICB4ZCA9IHguZCxcclxuICAgIEN0b3IgPSB4LmNvbnN0cnVjdG9yO1xyXG5cclxuICBpZiAoIXhkKSByZXR1cm4gbmV3IEN0b3IoeCk7XHJcblxyXG4gIG4xID0gZDAgPSBuZXcgQ3RvcigxKTtcclxuICBkMSA9IG4wID0gbmV3IEN0b3IoMCk7XHJcblxyXG4gIGQgPSBuZXcgQ3RvcihkMSk7XHJcbiAgZSA9IGQuZSA9IGdldFByZWNpc2lvbih4ZCkgLSB4LmUgLSAxO1xyXG4gIGsgPSBlICUgTE9HX0JBU0U7XHJcbiAgZC5kWzBdID0gbWF0aHBvdygxMCwgayA8IDAgPyBMT0dfQkFTRSArIGsgOiBrKTtcclxuXHJcbiAgaWYgKG1heEQgPT0gbnVsbCkge1xyXG5cclxuICAgIC8vIGQgaXMgMTAqKmUsIHRoZSBtaW5pbXVtIG1heC1kZW5vbWluYXRvciBuZWVkZWQuXHJcbiAgICBtYXhEID0gZSA+IDAgPyBkIDogbjE7XHJcbiAgfSBlbHNlIHtcclxuICAgIG4gPSBuZXcgQ3RvcihtYXhEKTtcclxuICAgIGlmICghbi5pc0ludCgpIHx8IG4ubHQobjEpKSB0aHJvdyBFcnJvcihpbnZhbGlkQXJndW1lbnQgKyBuKTtcclxuICAgIG1heEQgPSBuLmd0KGQpID8gKGUgPiAwID8gZCA6IG4xKSA6IG47XHJcbiAgfVxyXG5cclxuICBleHRlcm5hbCA9IGZhbHNlO1xyXG4gIG4gPSBuZXcgQ3RvcihkaWdpdHNUb1N0cmluZyh4ZCkpO1xyXG4gIHByID0gQ3Rvci5wcmVjaXNpb247XHJcbiAgQ3Rvci5wcmVjaXNpb24gPSBlID0geGQubGVuZ3RoICogTE9HX0JBU0UgKiAyO1xyXG5cclxuICBmb3IgKDs7KSAge1xyXG4gICAgcSA9IGRpdmlkZShuLCBkLCAwLCAxLCAxKTtcclxuICAgIGQyID0gZDAucGx1cyhxLnRpbWVzKGQxKSk7XHJcbiAgICBpZiAoZDIuY21wKG1heEQpID09IDEpIGJyZWFrO1xyXG4gICAgZDAgPSBkMTtcclxuICAgIGQxID0gZDI7XHJcbiAgICBkMiA9IG4xO1xyXG4gICAgbjEgPSBuMC5wbHVzKHEudGltZXMoZDIpKTtcclxuICAgIG4wID0gZDI7XHJcbiAgICBkMiA9IGQ7XHJcbiAgICBkID0gbi5taW51cyhxLnRpbWVzKGQyKSk7XHJcbiAgICBuID0gZDI7XHJcbiAgfVxyXG5cclxuICBkMiA9IGRpdmlkZShtYXhELm1pbnVzKGQwKSwgZDEsIDAsIDEsIDEpO1xyXG4gIG4wID0gbjAucGx1cyhkMi50aW1lcyhuMSkpO1xyXG4gIGQwID0gZDAucGx1cyhkMi50aW1lcyhkMSkpO1xyXG4gIG4wLnMgPSBuMS5zID0geC5zO1xyXG5cclxuICAvLyBEZXRlcm1pbmUgd2hpY2ggZnJhY3Rpb24gaXMgY2xvc2VyIHRvIHgsIG4wL2QwIG9yIG4xL2QxP1xyXG4gIHIgPSBkaXZpZGUobjEsIGQxLCBlLCAxKS5taW51cyh4KS5hYnMoKS5jbXAoZGl2aWRlKG4wLCBkMCwgZSwgMSkubWludXMoeCkuYWJzKCkpIDwgMVxyXG4gICAgICA/IFtuMSwgZDFdIDogW24wLCBkMF07XHJcblxyXG4gIEN0b3IucHJlY2lzaW9uID0gcHI7XHJcbiAgZXh0ZXJuYWwgPSB0cnVlO1xyXG5cclxuICByZXR1cm4gcjtcclxufTtcclxuXHJcblxyXG4vKlxyXG4gKiBSZXR1cm4gYSBzdHJpbmcgcmVwcmVzZW50aW5nIHRoZSB2YWx1ZSBvZiB0aGlzIERlY2ltYWwgaW4gYmFzZSAxNiwgcm91bmQgdG8gYHNkYCBzaWduaWZpY2FudFxyXG4gKiBkaWdpdHMgdXNpbmcgcm91bmRpbmcgbW9kZSBgcm1gLlxyXG4gKlxyXG4gKiBJZiB0aGUgb3B0aW9uYWwgYHNkYCBhcmd1bWVudCBpcyBwcmVzZW50IHRoZW4gcmV0dXJuIGJpbmFyeSBleHBvbmVudGlhbCBub3RhdGlvbi5cclxuICpcclxuICogW3NkXSB7bnVtYmVyfSBTaWduaWZpY2FudCBkaWdpdHMuIEludGVnZXIsIDEgdG8gTUFYX0RJR0lUUyBpbmNsdXNpdmUuXHJcbiAqIFtybV0ge251bWJlcn0gUm91bmRpbmcgbW9kZS4gSW50ZWdlciwgMCB0byA4IGluY2x1c2l2ZS5cclxuICpcclxuICovXHJcblAudG9IZXhhZGVjaW1hbCA9IFAudG9IZXggPSBmdW5jdGlvbiAoc2QsIHJtKSB7XHJcbiAgcmV0dXJuIHRvU3RyaW5nQmluYXJ5KHRoaXMsIDE2LCBzZCwgcm0pO1xyXG59O1xyXG5cclxuXHJcbi8qXHJcbiAqIFJldHVybnMgYSBuZXcgRGVjaW1hbCB3aG9zZSB2YWx1ZSBpcyB0aGUgbmVhcmVzdCBtdWx0aXBsZSBvZiBgeWAgaW4gdGhlIGRpcmVjdGlvbiBvZiByb3VuZGluZ1xyXG4gKiBtb2RlIGBybWAsIG9yIGBEZWNpbWFsLnJvdW5kaW5nYCBpZiBgcm1gIGlzIG9taXR0ZWQsIHRvIHRoZSB2YWx1ZSBvZiB0aGlzIERlY2ltYWwuXHJcbiAqXHJcbiAqIFRoZSByZXR1cm4gdmFsdWUgd2lsbCBhbHdheXMgaGF2ZSB0aGUgc2FtZSBzaWduIGFzIHRoaXMgRGVjaW1hbCwgdW5sZXNzIGVpdGhlciB0aGlzIERlY2ltYWxcclxuICogb3IgYHlgIGlzIE5hTiwgaW4gd2hpY2ggY2FzZSB0aGUgcmV0dXJuIHZhbHVlIHdpbGwgYmUgYWxzbyBiZSBOYU4uXHJcbiAqXHJcbiAqIFRoZSByZXR1cm4gdmFsdWUgaXMgbm90IGFmZmVjdGVkIGJ5IHRoZSB2YWx1ZSBvZiBgcHJlY2lzaW9uYC5cclxuICpcclxuICogeSB7bnVtYmVyfHN0cmluZ3xEZWNpbWFsfSBUaGUgbWFnbml0dWRlIHRvIHJvdW5kIHRvIGEgbXVsdGlwbGUgb2YuXHJcbiAqIFtybV0ge251bWJlcn0gUm91bmRpbmcgbW9kZS4gSW50ZWdlciwgMCB0byA4IGluY2x1c2l2ZS5cclxuICpcclxuICogJ3RvTmVhcmVzdCgpIHJvdW5kaW5nIG1vZGUgbm90IGFuIGludGVnZXI6IHtybX0nXHJcbiAqICd0b05lYXJlc3QoKSByb3VuZGluZyBtb2RlIG91dCBvZiByYW5nZToge3JtfSdcclxuICpcclxuICovXHJcblAudG9OZWFyZXN0ID0gZnVuY3Rpb24gKHksIHJtKSB7XHJcbiAgdmFyIHggPSB0aGlzLFxyXG4gICAgQ3RvciA9IHguY29uc3RydWN0b3I7XHJcblxyXG4gIHggPSBuZXcgQ3Rvcih4KTtcclxuXHJcbiAgaWYgKHkgPT0gbnVsbCkge1xyXG5cclxuICAgIC8vIElmIHggaXMgbm90IGZpbml0ZSwgcmV0dXJuIHguXHJcbiAgICBpZiAoIXguZCkgcmV0dXJuIHg7XHJcblxyXG4gICAgeSA9IG5ldyBDdG9yKDEpO1xyXG4gICAgcm0gPSBDdG9yLnJvdW5kaW5nO1xyXG4gIH0gZWxzZSB7XHJcbiAgICB5ID0gbmV3IEN0b3IoeSk7XHJcbiAgICBpZiAocm0gPT09IHZvaWQgMCkge1xyXG4gICAgICBybSA9IEN0b3Iucm91bmRpbmc7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICBjaGVja0ludDMyKHJtLCAwLCA4KTtcclxuICAgIH1cclxuXHJcbiAgICAvLyBJZiB4IGlzIG5vdCBmaW5pdGUsIHJldHVybiB4IGlmIHkgaXMgbm90IE5hTiwgZWxzZSBOYU4uXHJcbiAgICBpZiAoIXguZCkgcmV0dXJuIHkucyA/IHggOiB5O1xyXG5cclxuICAgIC8vIElmIHkgaXMgbm90IGZpbml0ZSwgcmV0dXJuIEluZmluaXR5IHdpdGggdGhlIHNpZ24gb2YgeCBpZiB5IGlzIEluZmluaXR5LCBlbHNlIE5hTi5cclxuICAgIGlmICgheS5kKSB7XHJcbiAgICAgIGlmICh5LnMpIHkucyA9IHgucztcclxuICAgICAgcmV0dXJuIHk7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICAvLyBJZiB5IGlzIG5vdCB6ZXJvLCBjYWxjdWxhdGUgdGhlIG5lYXJlc3QgbXVsdGlwbGUgb2YgeSB0byB4LlxyXG4gIGlmICh5LmRbMF0pIHtcclxuICAgIGV4dGVybmFsID0gZmFsc2U7XHJcbiAgICB4ID0gZGl2aWRlKHgsIHksIDAsIHJtLCAxKS50aW1lcyh5KTtcclxuICAgIGV4dGVybmFsID0gdHJ1ZTtcclxuICAgIGZpbmFsaXNlKHgpO1xyXG5cclxuICAvLyBJZiB5IGlzIHplcm8sIHJldHVybiB6ZXJvIHdpdGggdGhlIHNpZ24gb2YgeC5cclxuICB9IGVsc2Uge1xyXG4gICAgeS5zID0geC5zO1xyXG4gICAgeCA9IHk7XHJcbiAgfVxyXG5cclxuICByZXR1cm4geDtcclxufTtcclxuXHJcblxyXG4vKlxyXG4gKiBSZXR1cm4gdGhlIHZhbHVlIG9mIHRoaXMgRGVjaW1hbCBjb252ZXJ0ZWQgdG8gYSBudW1iZXIgcHJpbWl0aXZlLlxyXG4gKiBaZXJvIGtlZXBzIGl0cyBzaWduLlxyXG4gKlxyXG4gKi9cclxuUC50b051bWJlciA9IGZ1bmN0aW9uICgpIHtcclxuICByZXR1cm4gK3RoaXM7XHJcbn07XHJcblxyXG5cclxuLypcclxuICogUmV0dXJuIGEgc3RyaW5nIHJlcHJlc2VudGluZyB0aGUgdmFsdWUgb2YgdGhpcyBEZWNpbWFsIGluIGJhc2UgOCwgcm91bmQgdG8gYHNkYCBzaWduaWZpY2FudFxyXG4gKiBkaWdpdHMgdXNpbmcgcm91bmRpbmcgbW9kZSBgcm1gLlxyXG4gKlxyXG4gKiBJZiB0aGUgb3B0aW9uYWwgYHNkYCBhcmd1bWVudCBpcyBwcmVzZW50IHRoZW4gcmV0dXJuIGJpbmFyeSBleHBvbmVudGlhbCBub3RhdGlvbi5cclxuICpcclxuICogW3NkXSB7bnVtYmVyfSBTaWduaWZpY2FudCBkaWdpdHMuIEludGVnZXIsIDEgdG8gTUFYX0RJR0lUUyBpbmNsdXNpdmUuXHJcbiAqIFtybV0ge251bWJlcn0gUm91bmRpbmcgbW9kZS4gSW50ZWdlciwgMCB0byA4IGluY2x1c2l2ZS5cclxuICpcclxuICovXHJcblAudG9PY3RhbCA9IGZ1bmN0aW9uIChzZCwgcm0pIHtcclxuICByZXR1cm4gdG9TdHJpbmdCaW5hcnkodGhpcywgOCwgc2QsIHJtKTtcclxufTtcclxuXHJcblxyXG4vKlxyXG4gKiBSZXR1cm4gYSBuZXcgRGVjaW1hbCB3aG9zZSB2YWx1ZSBpcyB0aGUgdmFsdWUgb2YgdGhpcyBEZWNpbWFsIHJhaXNlZCB0byB0aGUgcG93ZXIgYHlgLCByb3VuZGVkXHJcbiAqIHRvIGBwcmVjaXNpb25gIHNpZ25pZmljYW50IGRpZ2l0cyB1c2luZyByb3VuZGluZyBtb2RlIGByb3VuZGluZ2AuXHJcbiAqXHJcbiAqIEVDTUFTY3JpcHQgY29tcGxpYW50LlxyXG4gKlxyXG4gKiAgIHBvdyh4LCBOYU4pICAgICAgICAgICAgICAgICAgICAgICAgICAgPSBOYU5cclxuICogICBwb3coeCwgXHUwMEIxMCkgICAgICAgICAgICAgICAgICAgICAgICAgICAgPSAxXHJcblxyXG4gKiAgIHBvdyhOYU4sIG5vbi16ZXJvKSAgICAgICAgICAgICAgICAgICAgPSBOYU5cclxuICogICBwb3coYWJzKHgpID4gMSwgK0luZmluaXR5KSAgICAgICAgICAgID0gK0luZmluaXR5XHJcbiAqICAgcG93KGFicyh4KSA+IDEsIC1JbmZpbml0eSkgICAgICAgICAgICA9ICswXHJcbiAqICAgcG93KGFicyh4KSA9PSAxLCBcdTAwQjFJbmZpbml0eSkgICAgICAgICAgID0gTmFOXHJcbiAqICAgcG93KGFicyh4KSA8IDEsICtJbmZpbml0eSkgICAgICAgICAgICA9ICswXHJcbiAqICAgcG93KGFicyh4KSA8IDEsIC1JbmZpbml0eSkgICAgICAgICAgICA9ICtJbmZpbml0eVxyXG4gKiAgIHBvdygrSW5maW5pdHksIHkgPiAwKSAgICAgICAgICAgICAgICAgPSArSW5maW5pdHlcclxuICogICBwb3coK0luZmluaXR5LCB5IDwgMCkgICAgICAgICAgICAgICAgID0gKzBcclxuICogICBwb3coLUluZmluaXR5LCBvZGQgaW50ZWdlciA+IDApICAgICAgID0gLUluZmluaXR5XHJcbiAqICAgcG93KC1JbmZpbml0eSwgZXZlbiBpbnRlZ2VyID4gMCkgICAgICA9ICtJbmZpbml0eVxyXG4gKiAgIHBvdygtSW5maW5pdHksIG9kZCBpbnRlZ2VyIDwgMCkgICAgICAgPSAtMFxyXG4gKiAgIHBvdygtSW5maW5pdHksIGV2ZW4gaW50ZWdlciA8IDApICAgICAgPSArMFxyXG4gKiAgIHBvdygrMCwgeSA+IDApICAgICAgICAgICAgICAgICAgICAgICAgPSArMFxyXG4gKiAgIHBvdygrMCwgeSA8IDApICAgICAgICAgICAgICAgICAgICAgICAgPSArSW5maW5pdHlcclxuICogICBwb3coLTAsIG9kZCBpbnRlZ2VyID4gMCkgICAgICAgICAgICAgID0gLTBcclxuICogICBwb3coLTAsIGV2ZW4gaW50ZWdlciA+IDApICAgICAgICAgICAgID0gKzBcclxuICogICBwb3coLTAsIG9kZCBpbnRlZ2VyIDwgMCkgICAgICAgICAgICAgID0gLUluZmluaXR5XHJcbiAqICAgcG93KC0wLCBldmVuIGludGVnZXIgPCAwKSAgICAgICAgICAgICA9ICtJbmZpbml0eVxyXG4gKiAgIHBvdyhmaW5pdGUgeCA8IDAsIGZpbml0ZSBub24taW50ZWdlcikgPSBOYU5cclxuICpcclxuICogRm9yIG5vbi1pbnRlZ2VyIG9yIHZlcnkgbGFyZ2UgZXhwb25lbnRzIHBvdyh4LCB5KSBpcyBjYWxjdWxhdGVkIHVzaW5nXHJcbiAqXHJcbiAqICAgeF55ID0gZXhwKHkqbG4oeCkpXHJcbiAqXHJcbiAqIEFzc3VtaW5nIHRoZSBmaXJzdCAxNSByb3VuZGluZyBkaWdpdHMgYXJlIGVhY2ggZXF1YWxseSBsaWtlbHkgdG8gYmUgYW55IGRpZ2l0IDAtOSwgdGhlXHJcbiAqIHByb2JhYmlsaXR5IG9mIGFuIGluY29ycmVjdGx5IHJvdW5kZWQgcmVzdWx0XHJcbiAqIFAoWzQ5XTl7MTR9IHwgWzUwXTB7MTR9KSA9IDIgKiAwLjIgKiAxMF4tMTQgPSA0ZS0xNSA9IDEvMi41ZSsxNFxyXG4gKiBpLmUuIDEgaW4gMjUwLDAwMCwwMDAsMDAwLDAwMFxyXG4gKlxyXG4gKiBJZiBhIHJlc3VsdCBpcyBpbmNvcnJlY3RseSByb3VuZGVkIHRoZSBtYXhpbXVtIGVycm9yIHdpbGwgYmUgMSB1bHAgKHVuaXQgaW4gbGFzdCBwbGFjZSkuXHJcbiAqXHJcbiAqIHkge251bWJlcnxzdHJpbmd8RGVjaW1hbH0gVGhlIHBvd2VyIHRvIHdoaWNoIHRvIHJhaXNlIHRoaXMgRGVjaW1hbC5cclxuICpcclxuICovXHJcblAudG9Qb3dlciA9IFAucG93ID0gZnVuY3Rpb24gKHkpIHtcclxuICB2YXIgZSwgaywgcHIsIHIsIHJtLCBzLFxyXG4gICAgeCA9IHRoaXMsXHJcbiAgICBDdG9yID0geC5jb25zdHJ1Y3RvcixcclxuICAgIHluID0gKyh5ID0gbmV3IEN0b3IoeSkpO1xyXG5cclxuICAvLyBFaXRoZXIgXHUwMEIxSW5maW5pdHksIE5hTiBvciBcdTAwQjEwP1xyXG4gIGlmICgheC5kIHx8ICF5LmQgfHwgIXguZFswXSB8fCAheS5kWzBdKSByZXR1cm4gbmV3IEN0b3IobWF0aHBvdygreCwgeW4pKTtcclxuXHJcbiAgeCA9IG5ldyBDdG9yKHgpO1xyXG5cclxuICBpZiAoeC5lcSgxKSkgcmV0dXJuIHg7XHJcblxyXG4gIHByID0gQ3Rvci5wcmVjaXNpb247XHJcbiAgcm0gPSBDdG9yLnJvdW5kaW5nO1xyXG5cclxuICBpZiAoeS5lcSgxKSkgcmV0dXJuIGZpbmFsaXNlKHgsIHByLCBybSk7XHJcblxyXG4gIC8vIHkgZXhwb25lbnRcclxuICBlID0gbWF0aGZsb29yKHkuZSAvIExPR19CQVNFKTtcclxuXHJcbiAgLy8gSWYgeSBpcyBhIHNtYWxsIGludGVnZXIgdXNlIHRoZSAnZXhwb25lbnRpYXRpb24gYnkgc3F1YXJpbmcnIGFsZ29yaXRobS5cclxuICBpZiAoZSA+PSB5LmQubGVuZ3RoIC0gMSAmJiAoayA9IHluIDwgMCA/IC15biA6IHluKSA8PSBNQVhfU0FGRV9JTlRFR0VSKSB7XHJcbiAgICByID0gaW50UG93KEN0b3IsIHgsIGssIHByKTtcclxuICAgIHJldHVybiB5LnMgPCAwID8gbmV3IEN0b3IoMSkuZGl2KHIpIDogZmluYWxpc2UociwgcHIsIHJtKTtcclxuICB9XHJcblxyXG4gIHMgPSB4LnM7XHJcblxyXG4gIC8vIGlmIHggaXMgbmVnYXRpdmVcclxuICBpZiAocyA8IDApIHtcclxuXHJcbiAgICAvLyBpZiB5IGlzIG5vdCBhbiBpbnRlZ2VyXHJcbiAgICBpZiAoZSA8IHkuZC5sZW5ndGggLSAxKSByZXR1cm4gbmV3IEN0b3IoTmFOKTtcclxuXHJcbiAgICAvLyBSZXN1bHQgaXMgcG9zaXRpdmUgaWYgeCBpcyBuZWdhdGl2ZSBhbmQgdGhlIGxhc3QgZGlnaXQgb2YgaW50ZWdlciB5IGlzIGV2ZW4uXHJcbiAgICBpZiAoKHkuZFtlXSAmIDEpID09IDApIHMgPSAxO1xyXG5cclxuICAgIC8vIGlmIHguZXEoLTEpXHJcbiAgICBpZiAoeC5lID09IDAgJiYgeC5kWzBdID09IDEgJiYgeC5kLmxlbmd0aCA9PSAxKSB7XHJcbiAgICAgIHgucyA9IHM7XHJcbiAgICAgIHJldHVybiB4O1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgLy8gRXN0aW1hdGUgcmVzdWx0IGV4cG9uZW50LlxyXG4gIC8vIHheeSA9IDEwXmUsICB3aGVyZSBlID0geSAqIGxvZzEwKHgpXHJcbiAgLy8gbG9nMTAoeCkgPSBsb2cxMCh4X3NpZ25pZmljYW5kKSArIHhfZXhwb25lbnRcclxuICAvLyBsb2cxMCh4X3NpZ25pZmljYW5kKSA9IGxuKHhfc2lnbmlmaWNhbmQpIC8gbG4oMTApXHJcbiAgayA9IG1hdGhwb3coK3gsIHluKTtcclxuICBlID0gayA9PSAwIHx8ICFpc0Zpbml0ZShrKVxyXG4gICAgPyBtYXRoZmxvb3IoeW4gKiAoTWF0aC5sb2coJzAuJyArIGRpZ2l0c1RvU3RyaW5nKHguZCkpIC8gTWF0aC5MTjEwICsgeC5lICsgMSkpXHJcbiAgICA6IG5ldyBDdG9yKGsgKyAnJykuZTtcclxuXHJcbiAgLy8gRXhwb25lbnQgZXN0aW1hdGUgbWF5IGJlIGluY29ycmVjdCBlLmcuIHg6IDAuOTk5OTk5OTk5OTk5OTk5OTk5LCB5OiAyLjI5LCBlOiAwLCByLmU6IC0xLlxyXG5cclxuICAvLyBPdmVyZmxvdy91bmRlcmZsb3c/XHJcbiAgaWYgKGUgPiBDdG9yLm1heEUgKyAxIHx8IGUgPCBDdG9yLm1pbkUgLSAxKSByZXR1cm4gbmV3IEN0b3IoZSA+IDAgPyBzIC8gMCA6IDApO1xyXG5cclxuICBleHRlcm5hbCA9IGZhbHNlO1xyXG4gIEN0b3Iucm91bmRpbmcgPSB4LnMgPSAxO1xyXG5cclxuICAvLyBFc3RpbWF0ZSB0aGUgZXh0cmEgZ3VhcmQgZGlnaXRzIG5lZWRlZCB0byBlbnN1cmUgZml2ZSBjb3JyZWN0IHJvdW5kaW5nIGRpZ2l0cyBmcm9tXHJcbiAgLy8gbmF0dXJhbExvZ2FyaXRobSh4KS4gRXhhbXBsZSBvZiBmYWlsdXJlIHdpdGhvdXQgdGhlc2UgZXh0cmEgZGlnaXRzIChwcmVjaXNpb246IDEwKTpcclxuICAvLyBuZXcgRGVjaW1hbCgyLjMyNDU2KS5wb3coJzIwODc5ODc0MzY1MzQ1NjYuNDY0MTEnKVxyXG4gIC8vIHNob3VsZCBiZSAxLjE2MjM3NzgyM2UrNzY0OTE0OTA1MTczODE1LCBidXQgaXMgMS4xNjIzNTU4MjNlKzc2NDkxNDkwNTE3MzgxNVxyXG4gIGsgPSBNYXRoLm1pbigxMiwgKGUgKyAnJykubGVuZ3RoKTtcclxuXHJcbiAgLy8gciA9IHheeSA9IGV4cCh5KmxuKHgpKVxyXG4gIHIgPSBuYXR1cmFsRXhwb25lbnRpYWwoeS50aW1lcyhuYXR1cmFsTG9nYXJpdGhtKHgsIHByICsgaykpLCBwcik7XHJcblxyXG4gIC8vIHIgbWF5IGJlIEluZmluaXR5LCBlLmcuICgwLjk5OTk5OTk5OTk5OTk5OTkpLnBvdygtMWUrNDApXHJcbiAgaWYgKHIuZCkge1xyXG5cclxuICAgIC8vIFRydW5jYXRlIHRvIHRoZSByZXF1aXJlZCBwcmVjaXNpb24gcGx1cyBmaXZlIHJvdW5kaW5nIGRpZ2l0cy5cclxuICAgIHIgPSBmaW5hbGlzZShyLCBwciArIDUsIDEpO1xyXG5cclxuICAgIC8vIElmIHRoZSByb3VuZGluZyBkaWdpdHMgYXJlIFs0OV05OTk5IG9yIFs1MF0wMDAwIGluY3JlYXNlIHRoZSBwcmVjaXNpb24gYnkgMTAgYW5kIHJlY2FsY3VsYXRlXHJcbiAgICAvLyB0aGUgcmVzdWx0LlxyXG4gICAgaWYgKGNoZWNrUm91bmRpbmdEaWdpdHMoci5kLCBwciwgcm0pKSB7XHJcbiAgICAgIGUgPSBwciArIDEwO1xyXG5cclxuICAgICAgLy8gVHJ1bmNhdGUgdG8gdGhlIGluY3JlYXNlZCBwcmVjaXNpb24gcGx1cyBmaXZlIHJvdW5kaW5nIGRpZ2l0cy5cclxuICAgICAgciA9IGZpbmFsaXNlKG5hdHVyYWxFeHBvbmVudGlhbCh5LnRpbWVzKG5hdHVyYWxMb2dhcml0aG0oeCwgZSArIGspKSwgZSksIGUgKyA1LCAxKTtcclxuXHJcbiAgICAgIC8vIENoZWNrIGZvciAxNCBuaW5lcyBmcm9tIHRoZSAybmQgcm91bmRpbmcgZGlnaXQgKHRoZSBmaXJzdCByb3VuZGluZyBkaWdpdCBtYXkgYmUgNCBvciA5KS5cclxuICAgICAgaWYgKCtkaWdpdHNUb1N0cmluZyhyLmQpLnNsaWNlKHByICsgMSwgcHIgKyAxNSkgKyAxID09IDFlMTQpIHtcclxuICAgICAgICByID0gZmluYWxpc2UociwgcHIgKyAxLCAwKTtcclxuICAgICAgfVxyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgci5zID0gcztcclxuICBleHRlcm5hbCA9IHRydWU7XHJcbiAgQ3Rvci5yb3VuZGluZyA9IHJtO1xyXG5cclxuICByZXR1cm4gZmluYWxpc2UociwgcHIsIHJtKTtcclxufTtcclxuXHJcblxyXG4vKlxyXG4gKiBSZXR1cm4gYSBzdHJpbmcgcmVwcmVzZW50aW5nIHRoZSB2YWx1ZSBvZiB0aGlzIERlY2ltYWwgcm91bmRlZCB0byBgc2RgIHNpZ25pZmljYW50IGRpZ2l0c1xyXG4gKiB1c2luZyByb3VuZGluZyBtb2RlIGByb3VuZGluZ2AuXHJcbiAqXHJcbiAqIFJldHVybiBleHBvbmVudGlhbCBub3RhdGlvbiBpZiBgc2RgIGlzIGxlc3MgdGhhbiB0aGUgbnVtYmVyIG9mIGRpZ2l0cyBuZWNlc3NhcnkgdG8gcmVwcmVzZW50XHJcbiAqIHRoZSBpbnRlZ2VyIHBhcnQgb2YgdGhlIHZhbHVlIGluIG5vcm1hbCBub3RhdGlvbi5cclxuICpcclxuICogW3NkXSB7bnVtYmVyfSBTaWduaWZpY2FudCBkaWdpdHMuIEludGVnZXIsIDEgdG8gTUFYX0RJR0lUUyBpbmNsdXNpdmUuXHJcbiAqIFtybV0ge251bWJlcn0gUm91bmRpbmcgbW9kZS4gSW50ZWdlciwgMCB0byA4IGluY2x1c2l2ZS5cclxuICpcclxuICovXHJcblAudG9QcmVjaXNpb24gPSBmdW5jdGlvbiAoc2QsIHJtKSB7XHJcbiAgdmFyIHN0cixcclxuICAgIHggPSB0aGlzLFxyXG4gICAgQ3RvciA9IHguY29uc3RydWN0b3I7XHJcblxyXG4gIGlmIChzZCA9PT0gdm9pZCAwKSB7XHJcbiAgICBzdHIgPSBmaW5pdGVUb1N0cmluZyh4LCB4LmUgPD0gQ3Rvci50b0V4cE5lZyB8fCB4LmUgPj0gQ3Rvci50b0V4cFBvcyk7XHJcbiAgfSBlbHNlIHtcclxuICAgIGNoZWNrSW50MzIoc2QsIDEsIE1BWF9ESUdJVFMpO1xyXG5cclxuICAgIGlmIChybSA9PT0gdm9pZCAwKSBybSA9IEN0b3Iucm91bmRpbmc7XHJcbiAgICBlbHNlIGNoZWNrSW50MzIocm0sIDAsIDgpO1xyXG5cclxuICAgIHggPSBmaW5hbGlzZShuZXcgQ3Rvcih4KSwgc2QsIHJtKTtcclxuICAgIHN0ciA9IGZpbml0ZVRvU3RyaW5nKHgsIHNkIDw9IHguZSB8fCB4LmUgPD0gQ3Rvci50b0V4cE5lZywgc2QpO1xyXG4gIH1cclxuXHJcbiAgcmV0dXJuIHguaXNOZWcoKSAmJiAheC5pc1plcm8oKSA/ICctJyArIHN0ciA6IHN0cjtcclxufTtcclxuXHJcblxyXG4vKlxyXG4gKiBSZXR1cm4gYSBuZXcgRGVjaW1hbCB3aG9zZSB2YWx1ZSBpcyB0aGUgdmFsdWUgb2YgdGhpcyBEZWNpbWFsIHJvdW5kZWQgdG8gYSBtYXhpbXVtIG9mIGBzZGBcclxuICogc2lnbmlmaWNhbnQgZGlnaXRzIHVzaW5nIHJvdW5kaW5nIG1vZGUgYHJtYCwgb3IgdG8gYHByZWNpc2lvbmAgYW5kIGByb3VuZGluZ2AgcmVzcGVjdGl2ZWx5IGlmXHJcbiAqIG9taXR0ZWQuXHJcbiAqXHJcbiAqIFtzZF0ge251bWJlcn0gU2lnbmlmaWNhbnQgZGlnaXRzLiBJbnRlZ2VyLCAxIHRvIE1BWF9ESUdJVFMgaW5jbHVzaXZlLlxyXG4gKiBbcm1dIHtudW1iZXJ9IFJvdW5kaW5nIG1vZGUuIEludGVnZXIsIDAgdG8gOCBpbmNsdXNpdmUuXHJcbiAqXHJcbiAqICd0b1NEKCkgZGlnaXRzIG91dCBvZiByYW5nZToge3NkfSdcclxuICogJ3RvU0QoKSBkaWdpdHMgbm90IGFuIGludGVnZXI6IHtzZH0nXHJcbiAqICd0b1NEKCkgcm91bmRpbmcgbW9kZSBub3QgYW4gaW50ZWdlcjoge3JtfSdcclxuICogJ3RvU0QoKSByb3VuZGluZyBtb2RlIG91dCBvZiByYW5nZToge3JtfSdcclxuICpcclxuICovXHJcblAudG9TaWduaWZpY2FudERpZ2l0cyA9IFAudG9TRCA9IGZ1bmN0aW9uIChzZCwgcm0pIHtcclxuICB2YXIgeCA9IHRoaXMsXHJcbiAgICBDdG9yID0geC5jb25zdHJ1Y3RvcjtcclxuXHJcbiAgaWYgKHNkID09PSB2b2lkIDApIHtcclxuICAgIHNkID0gQ3Rvci5wcmVjaXNpb247XHJcbiAgICBybSA9IEN0b3Iucm91bmRpbmc7XHJcbiAgfSBlbHNlIHtcclxuICAgIGNoZWNrSW50MzIoc2QsIDEsIE1BWF9ESUdJVFMpO1xyXG5cclxuICAgIGlmIChybSA9PT0gdm9pZCAwKSBybSA9IEN0b3Iucm91bmRpbmc7XHJcbiAgICBlbHNlIGNoZWNrSW50MzIocm0sIDAsIDgpO1xyXG4gIH1cclxuXHJcbiAgcmV0dXJuIGZpbmFsaXNlKG5ldyBDdG9yKHgpLCBzZCwgcm0pO1xyXG59O1xyXG5cclxuXHJcbi8qXHJcbiAqIFJldHVybiBhIHN0cmluZyByZXByZXNlbnRpbmcgdGhlIHZhbHVlIG9mIHRoaXMgRGVjaW1hbC5cclxuICpcclxuICogUmV0dXJuIGV4cG9uZW50aWFsIG5vdGF0aW9uIGlmIHRoaXMgRGVjaW1hbCBoYXMgYSBwb3NpdGl2ZSBleHBvbmVudCBlcXVhbCB0byBvciBncmVhdGVyIHRoYW5cclxuICogYHRvRXhwUG9zYCwgb3IgYSBuZWdhdGl2ZSBleHBvbmVudCBlcXVhbCB0byBvciBsZXNzIHRoYW4gYHRvRXhwTmVnYC5cclxuICpcclxuICovXHJcblAudG9TdHJpbmcgPSBmdW5jdGlvbiAoKSB7XHJcbiAgdmFyIHggPSB0aGlzLFxyXG4gICAgQ3RvciA9IHguY29uc3RydWN0b3IsXHJcbiAgICBzdHIgPSBmaW5pdGVUb1N0cmluZyh4LCB4LmUgPD0gQ3Rvci50b0V4cE5lZyB8fCB4LmUgPj0gQ3Rvci50b0V4cFBvcyk7XHJcblxyXG4gIHJldHVybiB4LmlzTmVnKCkgJiYgIXguaXNaZXJvKCkgPyAnLScgKyBzdHIgOiBzdHI7XHJcbn07XHJcblxyXG5cclxuLypcclxuICogUmV0dXJuIGEgbmV3IERlY2ltYWwgd2hvc2UgdmFsdWUgaXMgdGhlIHZhbHVlIG9mIHRoaXMgRGVjaW1hbCB0cnVuY2F0ZWQgdG8gYSB3aG9sZSBudW1iZXIuXHJcbiAqXHJcbiAqL1xyXG5QLnRydW5jYXRlZCA9IFAudHJ1bmMgPSBmdW5jdGlvbiAoKSB7XHJcbiAgcmV0dXJuIGZpbmFsaXNlKG5ldyB0aGlzLmNvbnN0cnVjdG9yKHRoaXMpLCB0aGlzLmUgKyAxLCAxKTtcclxufTtcclxuXHJcblxyXG4vKlxyXG4gKiBSZXR1cm4gYSBzdHJpbmcgcmVwcmVzZW50aW5nIHRoZSB2YWx1ZSBvZiB0aGlzIERlY2ltYWwuXHJcbiAqIFVubGlrZSBgdG9TdHJpbmdgLCBuZWdhdGl2ZSB6ZXJvIHdpbGwgaW5jbHVkZSB0aGUgbWludXMgc2lnbi5cclxuICpcclxuICovXHJcblAudmFsdWVPZiA9IFAudG9KU09OID0gZnVuY3Rpb24gKCkge1xyXG4gIHZhciB4ID0gdGhpcyxcclxuICAgIEN0b3IgPSB4LmNvbnN0cnVjdG9yLFxyXG4gICAgc3RyID0gZmluaXRlVG9TdHJpbmcoeCwgeC5lIDw9IEN0b3IudG9FeHBOZWcgfHwgeC5lID49IEN0b3IudG9FeHBQb3MpO1xyXG5cclxuICByZXR1cm4geC5pc05lZygpID8gJy0nICsgc3RyIDogc3RyO1xyXG59O1xyXG5cclxuXHJcbi8vIEhlbHBlciBmdW5jdGlvbnMgZm9yIERlY2ltYWwucHJvdG90eXBlIChQKSBhbmQvb3IgRGVjaW1hbCBtZXRob2RzLCBhbmQgdGhlaXIgY2FsbGVycy5cclxuXHJcblxyXG4vKlxyXG4gKiAgZGlnaXRzVG9TdHJpbmcgICAgICAgICAgIFAuY3ViZVJvb3QsIFAubG9nYXJpdGhtLCBQLnNxdWFyZVJvb3QsIFAudG9GcmFjdGlvbiwgUC50b1Bvd2VyLFxyXG4gKiAgICAgICAgICAgICAgICAgICAgICAgICAgIGZpbml0ZVRvU3RyaW5nLCBuYXR1cmFsRXhwb25lbnRpYWwsIG5hdHVyYWxMb2dhcml0aG1cclxuICogIGNoZWNrSW50MzIgICAgICAgICAgICAgICBQLnRvRGVjaW1hbFBsYWNlcywgUC50b0V4cG9uZW50aWFsLCBQLnRvRml4ZWQsIFAudG9OZWFyZXN0LFxyXG4gKiAgICAgICAgICAgICAgICAgICAgICAgICAgIFAudG9QcmVjaXNpb24sIFAudG9TaWduaWZpY2FudERpZ2l0cywgdG9TdHJpbmdCaW5hcnksIHJhbmRvbVxyXG4gKiAgY2hlY2tSb3VuZGluZ0RpZ2l0cyAgICAgIFAubG9nYXJpdGhtLCBQLnRvUG93ZXIsIG5hdHVyYWxFeHBvbmVudGlhbCwgbmF0dXJhbExvZ2FyaXRobVxyXG4gKiAgY29udmVydEJhc2UgICAgICAgICAgICAgIHRvU3RyaW5nQmluYXJ5LCBwYXJzZU90aGVyXHJcbiAqICBjb3MgICAgICAgICAgICAgICAgICAgICAgUC5jb3NcclxuICogIGRpdmlkZSAgICAgICAgICAgICAgICAgICBQLmF0YW5oLCBQLmN1YmVSb290LCBQLmRpdmlkZWRCeSwgUC5kaXZpZGVkVG9JbnRlZ2VyQnksXHJcbiAqICAgICAgICAgICAgICAgICAgICAgICAgICAgUC5sb2dhcml0aG0sIFAubW9kdWxvLCBQLnNxdWFyZVJvb3QsIFAudGFuLCBQLnRhbmgsIFAudG9GcmFjdGlvbixcclxuICogICAgICAgICAgICAgICAgICAgICAgICAgICBQLnRvTmVhcmVzdCwgdG9TdHJpbmdCaW5hcnksIG5hdHVyYWxFeHBvbmVudGlhbCwgbmF0dXJhbExvZ2FyaXRobSxcclxuICogICAgICAgICAgICAgICAgICAgICAgICAgICB0YXlsb3JTZXJpZXMsIGF0YW4yLCBwYXJzZU90aGVyXHJcbiAqICBmaW5hbGlzZSAgICAgICAgICAgICAgICAgUC5hYnNvbHV0ZVZhbHVlLCBQLmF0YW4sIFAuYXRhbmgsIFAuY2VpbCwgUC5jb3MsIFAuY29zaCxcclxuICogICAgICAgICAgICAgICAgICAgICAgICAgICBQLmN1YmVSb290LCBQLmRpdmlkZWRUb0ludGVnZXJCeSwgUC5mbG9vciwgUC5sb2dhcml0aG0sIFAubWludXMsXHJcbiAqICAgICAgICAgICAgICAgICAgICAgICAgICAgUC5tb2R1bG8sIFAubmVnYXRlZCwgUC5wbHVzLCBQLnJvdW5kLCBQLnNpbiwgUC5zaW5oLCBQLnNxdWFyZVJvb3QsXHJcbiAqICAgICAgICAgICAgICAgICAgICAgICAgICAgUC50YW4sIFAudGltZXMsIFAudG9EZWNpbWFsUGxhY2VzLCBQLnRvRXhwb25lbnRpYWwsIFAudG9GaXhlZCxcclxuICogICAgICAgICAgICAgICAgICAgICAgICAgICBQLnRvTmVhcmVzdCwgUC50b1Bvd2VyLCBQLnRvUHJlY2lzaW9uLCBQLnRvU2lnbmlmaWNhbnREaWdpdHMsXHJcbiAqICAgICAgICAgICAgICAgICAgICAgICAgICAgUC50cnVuY2F0ZWQsIGRpdmlkZSwgZ2V0TG4xMCwgZ2V0UGksIG5hdHVyYWxFeHBvbmVudGlhbCxcclxuICogICAgICAgICAgICAgICAgICAgICAgICAgICBuYXR1cmFsTG9nYXJpdGhtLCBjZWlsLCBmbG9vciwgcm91bmQsIHRydW5jXHJcbiAqICBmaW5pdGVUb1N0cmluZyAgICAgICAgICAgUC50b0V4cG9uZW50aWFsLCBQLnRvRml4ZWQsIFAudG9QcmVjaXNpb24sIFAudG9TdHJpbmcsIFAudmFsdWVPZixcclxuICogICAgICAgICAgICAgICAgICAgICAgICAgICB0b1N0cmluZ0JpbmFyeVxyXG4gKiAgZ2V0QmFzZTEwRXhwb25lbnQgICAgICAgIFAubWludXMsIFAucGx1cywgUC50aW1lcywgcGFyc2VPdGhlclxyXG4gKiAgZ2V0TG4xMCAgICAgICAgICAgICAgICAgIFAubG9nYXJpdGhtLCBuYXR1cmFsTG9nYXJpdGhtXHJcbiAqICBnZXRQaSAgICAgICAgICAgICAgICAgICAgUC5hY29zLCBQLmFzaW4sIFAuYXRhbiwgdG9MZXNzVGhhbkhhbGZQaSwgYXRhbjJcclxuICogIGdldFByZWNpc2lvbiAgICAgICAgICAgICBQLnByZWNpc2lvbiwgUC50b0ZyYWN0aW9uXHJcbiAqICBnZXRaZXJvU3RyaW5nICAgICAgICAgICAgZGlnaXRzVG9TdHJpbmcsIGZpbml0ZVRvU3RyaW5nXHJcbiAqICBpbnRQb3cgICAgICAgICAgICAgICAgICAgUC50b1Bvd2VyLCBwYXJzZU90aGVyXHJcbiAqICBpc09kZCAgICAgICAgICAgICAgICAgICAgdG9MZXNzVGhhbkhhbGZQaVxyXG4gKiAgbWF4T3JNaW4gICAgICAgICAgICAgICAgIG1heCwgbWluXHJcbiAqICBuYXR1cmFsRXhwb25lbnRpYWwgICAgICAgUC5uYXR1cmFsRXhwb25lbnRpYWwsIFAudG9Qb3dlclxyXG4gKiAgbmF0dXJhbExvZ2FyaXRobSAgICAgICAgIFAuYWNvc2gsIFAuYXNpbmgsIFAuYXRhbmgsIFAubG9nYXJpdGhtLCBQLm5hdHVyYWxMb2dhcml0aG0sXHJcbiAqICAgICAgICAgICAgICAgICAgICAgICAgICAgUC50b1Bvd2VyLCBuYXR1cmFsRXhwb25lbnRpYWxcclxuICogIG5vbkZpbml0ZVRvU3RyaW5nICAgICAgICBmaW5pdGVUb1N0cmluZywgdG9TdHJpbmdCaW5hcnlcclxuICogIHBhcnNlRGVjaW1hbCAgICAgICAgICAgICBEZWNpbWFsXHJcbiAqICBwYXJzZU90aGVyICAgICAgICAgICAgICAgRGVjaW1hbFxyXG4gKiAgc2luICAgICAgICAgICAgICAgICAgICAgIFAuc2luXHJcbiAqICB0YXlsb3JTZXJpZXMgICAgICAgICAgICAgUC5jb3NoLCBQLnNpbmgsIGNvcywgc2luXHJcbiAqICB0b0xlc3NUaGFuSGFsZlBpICAgICAgICAgUC5jb3MsIFAuc2luXHJcbiAqICB0b1N0cmluZ0JpbmFyeSAgICAgICAgICAgUC50b0JpbmFyeSwgUC50b0hleGFkZWNpbWFsLCBQLnRvT2N0YWxcclxuICogIHRydW5jYXRlICAgICAgICAgICAgICAgICBpbnRQb3dcclxuICpcclxuICogIFRocm93czogICAgICAgICAgICAgICAgICBQLmxvZ2FyaXRobSwgUC5wcmVjaXNpb24sIFAudG9GcmFjdGlvbiwgY2hlY2tJbnQzMiwgZ2V0TG4xMCwgZ2V0UGksXHJcbiAqICAgICAgICAgICAgICAgICAgICAgICAgICAgbmF0dXJhbExvZ2FyaXRobSwgY29uZmlnLCBwYXJzZU90aGVyLCByYW5kb20sIERlY2ltYWxcclxuICovXHJcblxyXG5cclxuZnVuY3Rpb24gZGlnaXRzVG9TdHJpbmcoZCkge1xyXG4gIHZhciBpLCBrLCB3cyxcclxuICAgIGluZGV4T2ZMYXN0V29yZCA9IGQubGVuZ3RoIC0gMSxcclxuICAgIHN0ciA9ICcnLFxyXG4gICAgdyA9IGRbMF07XHJcblxyXG4gIGlmIChpbmRleE9mTGFzdFdvcmQgPiAwKSB7XHJcbiAgICBzdHIgKz0gdztcclxuICAgIGZvciAoaSA9IDE7IGkgPCBpbmRleE9mTGFzdFdvcmQ7IGkrKykge1xyXG4gICAgICB3cyA9IGRbaV0gKyAnJztcclxuICAgICAgayA9IExPR19CQVNFIC0gd3MubGVuZ3RoO1xyXG4gICAgICBpZiAoaykgc3RyICs9IGdldFplcm9TdHJpbmcoayk7XHJcbiAgICAgIHN0ciArPSB3cztcclxuICAgIH1cclxuXHJcbiAgICB3ID0gZFtpXTtcclxuICAgIHdzID0gdyArICcnO1xyXG4gICAgayA9IExPR19CQVNFIC0gd3MubGVuZ3RoO1xyXG4gICAgaWYgKGspIHN0ciArPSBnZXRaZXJvU3RyaW5nKGspO1xyXG4gIH0gZWxzZSBpZiAodyA9PT0gMCkge1xyXG4gICAgcmV0dXJuICcwJztcclxuICB9XHJcblxyXG4gIC8vIFJlbW92ZSB0cmFpbGluZyB6ZXJvcyBvZiBsYXN0IHcuXHJcbiAgZm9yICg7IHcgJSAxMCA9PT0gMDspIHcgLz0gMTA7XHJcblxyXG4gIHJldHVybiBzdHIgKyB3O1xyXG59XHJcblxyXG5cclxuZnVuY3Rpb24gY2hlY2tJbnQzMihpLCBtaW4sIG1heCkge1xyXG4gIGlmIChpICE9PSB+fmkgfHwgaSA8IG1pbiB8fCBpID4gbWF4KSB7XHJcbiAgICB0aHJvdyBFcnJvcihpbnZhbGlkQXJndW1lbnQgKyBpKTtcclxuICB9XHJcbn1cclxuXHJcblxyXG4vKlxyXG4gKiBDaGVjayA1IHJvdW5kaW5nIGRpZ2l0cyBpZiBgcmVwZWF0aW5nYCBpcyBudWxsLCA0IG90aGVyd2lzZS5cclxuICogYHJlcGVhdGluZyA9PSBudWxsYCBpZiBjYWxsZXIgaXMgYGxvZ2Agb3IgYHBvd2AsXHJcbiAqIGByZXBlYXRpbmcgIT0gbnVsbGAgaWYgY2FsbGVyIGlzIGBuYXR1cmFsTG9nYXJpdGhtYCBvciBgbmF0dXJhbEV4cG9uZW50aWFsYC5cclxuICovXHJcbmZ1bmN0aW9uIGNoZWNrUm91bmRpbmdEaWdpdHMoZCwgaSwgcm0sIHJlcGVhdGluZykge1xyXG4gIHZhciBkaSwgaywgciwgcmQ7XHJcblxyXG4gIC8vIEdldCB0aGUgbGVuZ3RoIG9mIHRoZSBmaXJzdCB3b3JkIG9mIHRoZSBhcnJheSBkLlxyXG4gIGZvciAoayA9IGRbMF07IGsgPj0gMTA7IGsgLz0gMTApIC0taTtcclxuXHJcbiAgLy8gSXMgdGhlIHJvdW5kaW5nIGRpZ2l0IGluIHRoZSBmaXJzdCB3b3JkIG9mIGQ/XHJcbiAgaWYgKC0taSA8IDApIHtcclxuICAgIGkgKz0gTE9HX0JBU0U7XHJcbiAgICBkaSA9IDA7XHJcbiAgfSBlbHNlIHtcclxuICAgIGRpID0gTWF0aC5jZWlsKChpICsgMSkgLyBMT0dfQkFTRSk7XHJcbiAgICBpICU9IExPR19CQVNFO1xyXG4gIH1cclxuXHJcbiAgLy8gaSBpcyB0aGUgaW5kZXggKDAgLSA2KSBvZiB0aGUgcm91bmRpbmcgZGlnaXQuXHJcbiAgLy8gRS5nLiBpZiB3aXRoaW4gdGhlIHdvcmQgMzQ4NzU2MyB0aGUgZmlyc3Qgcm91bmRpbmcgZGlnaXQgaXMgNSxcclxuICAvLyB0aGVuIGkgPSA0LCBrID0gMTAwMCwgcmQgPSAzNDg3NTYzICUgMTAwMCA9IDU2M1xyXG4gIGsgPSBtYXRocG93KDEwLCBMT0dfQkFTRSAtIGkpO1xyXG4gIHJkID0gZFtkaV0gJSBrIHwgMDtcclxuXHJcbiAgaWYgKHJlcGVhdGluZyA9PSBudWxsKSB7XHJcbiAgICBpZiAoaSA8IDMpIHtcclxuICAgICAgaWYgKGkgPT0gMCkgcmQgPSByZCAvIDEwMCB8IDA7XHJcbiAgICAgIGVsc2UgaWYgKGkgPT0gMSkgcmQgPSByZCAvIDEwIHwgMDtcclxuICAgICAgciA9IHJtIDwgNCAmJiByZCA9PSA5OTk5OSB8fCBybSA+IDMgJiYgcmQgPT0gNDk5OTkgfHwgcmQgPT0gNTAwMDAgfHwgcmQgPT0gMDtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIHIgPSAocm0gPCA0ICYmIHJkICsgMSA9PSBrIHx8IHJtID4gMyAmJiByZCArIDEgPT0gayAvIDIpICYmXHJcbiAgICAgICAgKGRbZGkgKyAxXSAvIGsgLyAxMDAgfCAwKSA9PSBtYXRocG93KDEwLCBpIC0gMikgLSAxIHx8XHJcbiAgICAgICAgICAocmQgPT0gayAvIDIgfHwgcmQgPT0gMCkgJiYgKGRbZGkgKyAxXSAvIGsgLyAxMDAgfCAwKSA9PSAwO1xyXG4gICAgfVxyXG4gIH0gZWxzZSB7XHJcbiAgICBpZiAoaSA8IDQpIHtcclxuICAgICAgaWYgKGkgPT0gMCkgcmQgPSByZCAvIDEwMDAgfCAwO1xyXG4gICAgICBlbHNlIGlmIChpID09IDEpIHJkID0gcmQgLyAxMDAgfCAwO1xyXG4gICAgICBlbHNlIGlmIChpID09IDIpIHJkID0gcmQgLyAxMCB8IDA7XHJcbiAgICAgIHIgPSAocmVwZWF0aW5nIHx8IHJtIDwgNCkgJiYgcmQgPT0gOTk5OSB8fCAhcmVwZWF0aW5nICYmIHJtID4gMyAmJiByZCA9PSA0OTk5O1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgciA9ICgocmVwZWF0aW5nIHx8IHJtIDwgNCkgJiYgcmQgKyAxID09IGsgfHxcclxuICAgICAgKCFyZXBlYXRpbmcgJiYgcm0gPiAzKSAmJiByZCArIDEgPT0gayAvIDIpICYmXHJcbiAgICAgICAgKGRbZGkgKyAxXSAvIGsgLyAxMDAwIHwgMCkgPT0gbWF0aHBvdygxMCwgaSAtIDMpIC0gMTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIHJldHVybiByO1xyXG59XHJcblxyXG5cclxuLy8gQ29udmVydCBzdHJpbmcgb2YgYGJhc2VJbmAgdG8gYW4gYXJyYXkgb2YgbnVtYmVycyBvZiBgYmFzZU91dGAuXHJcbi8vIEVnLiBjb252ZXJ0QmFzZSgnMjU1JywgMTAsIDE2KSByZXR1cm5zIFsxNSwgMTVdLlxyXG4vLyBFZy4gY29udmVydEJhc2UoJ2ZmJywgMTYsIDEwKSByZXR1cm5zIFsyLCA1LCA1XS5cclxuZnVuY3Rpb24gY29udmVydEJhc2Uoc3RyLCBiYXNlSW4sIGJhc2VPdXQpIHtcclxuICB2YXIgaixcclxuICAgIGFyciA9IFswXSxcclxuICAgIGFyckwsXHJcbiAgICBpID0gMCxcclxuICAgIHN0ckwgPSBzdHIubGVuZ3RoO1xyXG5cclxuICBmb3IgKDsgaSA8IHN0ckw7KSB7XHJcbiAgICBmb3IgKGFyckwgPSBhcnIubGVuZ3RoOyBhcnJMLS07KSBhcnJbYXJyTF0gKj0gYmFzZUluO1xyXG4gICAgYXJyWzBdICs9IE5VTUVSQUxTLmluZGV4T2Yoc3RyLmNoYXJBdChpKyspKTtcclxuICAgIGZvciAoaiA9IDA7IGogPCBhcnIubGVuZ3RoOyBqKyspIHtcclxuICAgICAgaWYgKGFycltqXSA+IGJhc2VPdXQgLSAxKSB7XHJcbiAgICAgICAgaWYgKGFycltqICsgMV0gPT09IHZvaWQgMCkgYXJyW2ogKyAxXSA9IDA7XHJcbiAgICAgICAgYXJyW2ogKyAxXSArPSBhcnJbal0gLyBiYXNlT3V0IHwgMDtcclxuICAgICAgICBhcnJbal0gJT0gYmFzZU91dDtcclxuICAgICAgfVxyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgcmV0dXJuIGFyci5yZXZlcnNlKCk7XHJcbn1cclxuXHJcblxyXG4vKlxyXG4gKiBjb3MoeCkgPSAxIC0geF4yLzIhICsgeF40LzQhIC0gLi4uXHJcbiAqIHx4fCA8IHBpLzJcclxuICpcclxuICovXHJcbmZ1bmN0aW9uIGNvc2luZShDdG9yLCB4KSB7XHJcbiAgdmFyIGssIGxlbiwgeTtcclxuXHJcbiAgaWYgKHguaXNaZXJvKCkpIHJldHVybiB4O1xyXG5cclxuICAvLyBBcmd1bWVudCByZWR1Y3Rpb246IGNvcyg0eCkgPSA4Kihjb3NeNCh4KSAtIGNvc14yKHgpKSArIDFcclxuICAvLyBpLmUuIGNvcyh4KSA9IDgqKGNvc140KHgvNCkgLSBjb3NeMih4LzQpKSArIDFcclxuXHJcbiAgLy8gRXN0aW1hdGUgdGhlIG9wdGltdW0gbnVtYmVyIG9mIHRpbWVzIHRvIHVzZSB0aGUgYXJndW1lbnQgcmVkdWN0aW9uLlxyXG4gIGxlbiA9IHguZC5sZW5ndGg7XHJcbiAgaWYgKGxlbiA8IDMyKSB7XHJcbiAgICBrID0gTWF0aC5jZWlsKGxlbiAvIDMpO1xyXG4gICAgeSA9ICgxIC8gdGlueVBvdyg0LCBrKSkudG9TdHJpbmcoKTtcclxuICB9IGVsc2Uge1xyXG4gICAgayA9IDE2O1xyXG4gICAgeSA9ICcyLjMyODMwNjQzNjUzODY5NjI4OTA2MjVlLTEwJztcclxuICB9XHJcblxyXG4gIEN0b3IucHJlY2lzaW9uICs9IGs7XHJcblxyXG4gIHggPSB0YXlsb3JTZXJpZXMoQ3RvciwgMSwgeC50aW1lcyh5KSwgbmV3IEN0b3IoMSkpO1xyXG5cclxuICAvLyBSZXZlcnNlIGFyZ3VtZW50IHJlZHVjdGlvblxyXG4gIGZvciAodmFyIGkgPSBrOyBpLS07KSB7XHJcbiAgICB2YXIgY29zMnggPSB4LnRpbWVzKHgpO1xyXG4gICAgeCA9IGNvczJ4LnRpbWVzKGNvczJ4KS5taW51cyhjb3MyeCkudGltZXMoOCkucGx1cygxKTtcclxuICB9XHJcblxyXG4gIEN0b3IucHJlY2lzaW9uIC09IGs7XHJcblxyXG4gIHJldHVybiB4O1xyXG59XHJcblxyXG5cclxuLypcclxuICogUGVyZm9ybSBkaXZpc2lvbiBpbiB0aGUgc3BlY2lmaWVkIGJhc2UuXHJcbiAqL1xyXG52YXIgZGl2aWRlID0gKGZ1bmN0aW9uICgpIHtcclxuXHJcbiAgLy8gQXNzdW1lcyBub24temVybyB4IGFuZCBrLCBhbmQgaGVuY2Ugbm9uLXplcm8gcmVzdWx0LlxyXG4gIGZ1bmN0aW9uIG11bHRpcGx5SW50ZWdlcih4LCBrLCBiYXNlKSB7XHJcbiAgICB2YXIgdGVtcCxcclxuICAgICAgY2FycnkgPSAwLFxyXG4gICAgICBpID0geC5sZW5ndGg7XHJcblxyXG4gICAgZm9yICh4ID0geC5zbGljZSgpOyBpLS07KSB7XHJcbiAgICAgIHRlbXAgPSB4W2ldICogayArIGNhcnJ5O1xyXG4gICAgICB4W2ldID0gdGVtcCAlIGJhc2UgfCAwO1xyXG4gICAgICBjYXJyeSA9IHRlbXAgLyBiYXNlIHwgMDtcclxuICAgIH1cclxuXHJcbiAgICBpZiAoY2FycnkpIHgudW5zaGlmdChjYXJyeSk7XHJcblxyXG4gICAgcmV0dXJuIHg7XHJcbiAgfVxyXG5cclxuICBmdW5jdGlvbiBjb21wYXJlKGEsIGIsIGFMLCBiTCkge1xyXG4gICAgdmFyIGksIHI7XHJcblxyXG4gICAgaWYgKGFMICE9IGJMKSB7XHJcbiAgICAgIHIgPSBhTCA+IGJMID8gMSA6IC0xO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgZm9yIChpID0gciA9IDA7IGkgPCBhTDsgaSsrKSB7XHJcbiAgICAgICAgaWYgKGFbaV0gIT0gYltpXSkge1xyXG4gICAgICAgICAgciA9IGFbaV0gPiBiW2ldID8gMSA6IC0xO1xyXG4gICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIHI7XHJcbiAgfVxyXG5cclxuICBmdW5jdGlvbiBzdWJ0cmFjdChhLCBiLCBhTCwgYmFzZSkge1xyXG4gICAgdmFyIGkgPSAwO1xyXG5cclxuICAgIC8vIFN1YnRyYWN0IGIgZnJvbSBhLlxyXG4gICAgZm9yICg7IGFMLS07KSB7XHJcbiAgICAgIGFbYUxdIC09IGk7XHJcbiAgICAgIGkgPSBhW2FMXSA8IGJbYUxdID8gMSA6IDA7XHJcbiAgICAgIGFbYUxdID0gaSAqIGJhc2UgKyBhW2FMXSAtIGJbYUxdO1xyXG4gICAgfVxyXG5cclxuICAgIC8vIFJlbW92ZSBsZWFkaW5nIHplcm9zLlxyXG4gICAgZm9yICg7ICFhWzBdICYmIGEubGVuZ3RoID4gMTspIGEuc2hpZnQoKTtcclxuICB9XHJcblxyXG4gIHJldHVybiBmdW5jdGlvbiAoeCwgeSwgcHIsIHJtLCBkcCwgYmFzZSkge1xyXG4gICAgdmFyIGNtcCwgZSwgaSwgaywgbG9nQmFzZSwgbW9yZSwgcHJvZCwgcHJvZEwsIHEsIHFkLCByZW0sIHJlbUwsIHJlbTAsIHNkLCB0LCB4aSwgeEwsIHlkMCxcclxuICAgICAgeUwsIHl6LFxyXG4gICAgICBDdG9yID0geC5jb25zdHJ1Y3RvcixcclxuICAgICAgc2lnbiA9IHgucyA9PSB5LnMgPyAxIDogLTEsXHJcbiAgICAgIHhkID0geC5kLFxyXG4gICAgICB5ZCA9IHkuZDtcclxuXHJcbiAgICAvLyBFaXRoZXIgTmFOLCBJbmZpbml0eSBvciAwP1xyXG4gICAgaWYgKCF4ZCB8fCAheGRbMF0gfHwgIXlkIHx8ICF5ZFswXSkge1xyXG5cclxuICAgICAgcmV0dXJuIG5ldyBDdG9yKC8vIFJldHVybiBOYU4gaWYgZWl0aGVyIE5hTiwgb3IgYm90aCBJbmZpbml0eSBvciAwLlxyXG4gICAgICAgICF4LnMgfHwgIXkucyB8fCAoeGQgPyB5ZCAmJiB4ZFswXSA9PSB5ZFswXSA6ICF5ZCkgPyBOYU4gOlxyXG5cclxuICAgICAgICAvLyBSZXR1cm4gXHUwMEIxMCBpZiB4IGlzIDAgb3IgeSBpcyBcdTAwQjFJbmZpbml0eSwgb3IgcmV0dXJuIFx1MDBCMUluZmluaXR5IGFzIHkgaXMgMC5cclxuICAgICAgICB4ZCAmJiB4ZFswXSA9PSAwIHx8ICF5ZCA/IHNpZ24gKiAwIDogc2lnbiAvIDApO1xyXG4gICAgfVxyXG5cclxuICAgIGlmIChiYXNlKSB7XHJcbiAgICAgIGxvZ0Jhc2UgPSAxO1xyXG4gICAgICBlID0geC5lIC0geS5lO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgYmFzZSA9IEJBU0U7XHJcbiAgICAgIGxvZ0Jhc2UgPSBMT0dfQkFTRTtcclxuICAgICAgZSA9IG1hdGhmbG9vcih4LmUgLyBsb2dCYXNlKSAtIG1hdGhmbG9vcih5LmUgLyBsb2dCYXNlKTtcclxuICAgIH1cclxuXHJcbiAgICB5TCA9IHlkLmxlbmd0aDtcclxuICAgIHhMID0geGQubGVuZ3RoO1xyXG4gICAgcSA9IG5ldyBDdG9yKHNpZ24pO1xyXG4gICAgcWQgPSBxLmQgPSBbXTtcclxuXHJcbiAgICAvLyBSZXN1bHQgZXhwb25lbnQgbWF5IGJlIG9uZSBsZXNzIHRoYW4gZS5cclxuICAgIC8vIFRoZSBkaWdpdCBhcnJheSBvZiBhIERlY2ltYWwgZnJvbSB0b1N0cmluZ0JpbmFyeSBtYXkgaGF2ZSB0cmFpbGluZyB6ZXJvcy5cclxuICAgIGZvciAoaSA9IDA7IHlkW2ldID09ICh4ZFtpXSB8fCAwKTsgaSsrKTtcclxuXHJcbiAgICBpZiAoeWRbaV0gPiAoeGRbaV0gfHwgMCkpIGUtLTtcclxuXHJcbiAgICBpZiAocHIgPT0gbnVsbCkge1xyXG4gICAgICBzZCA9IHByID0gQ3Rvci5wcmVjaXNpb247XHJcbiAgICAgIHJtID0gQ3Rvci5yb3VuZGluZztcclxuICAgIH0gZWxzZSBpZiAoZHApIHtcclxuICAgICAgc2QgPSBwciArICh4LmUgLSB5LmUpICsgMTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIHNkID0gcHI7XHJcbiAgICB9XHJcblxyXG4gICAgaWYgKHNkIDwgMCkge1xyXG4gICAgICBxZC5wdXNoKDEpO1xyXG4gICAgICBtb3JlID0gdHJ1ZTtcclxuICAgIH0gZWxzZSB7XHJcblxyXG4gICAgICAvLyBDb252ZXJ0IHByZWNpc2lvbiBpbiBudW1iZXIgb2YgYmFzZSAxMCBkaWdpdHMgdG8gYmFzZSAxZTcgZGlnaXRzLlxyXG4gICAgICBzZCA9IHNkIC8gbG9nQmFzZSArIDIgfCAwO1xyXG4gICAgICBpID0gMDtcclxuXHJcbiAgICAgIC8vIGRpdmlzb3IgPCAxZTdcclxuICAgICAgaWYgKHlMID09IDEpIHtcclxuICAgICAgICBrID0gMDtcclxuICAgICAgICB5ZCA9IHlkWzBdO1xyXG4gICAgICAgIHNkKys7XHJcblxyXG4gICAgICAgIC8vIGsgaXMgdGhlIGNhcnJ5LlxyXG4gICAgICAgIGZvciAoOyAoaSA8IHhMIHx8IGspICYmIHNkLS07IGkrKykge1xyXG4gICAgICAgICAgdCA9IGsgKiBiYXNlICsgKHhkW2ldIHx8IDApO1xyXG4gICAgICAgICAgcWRbaV0gPSB0IC8geWQgfCAwO1xyXG4gICAgICAgICAgayA9IHQgJSB5ZCB8IDA7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBtb3JlID0gayB8fCBpIDwgeEw7XHJcblxyXG4gICAgICAvLyBkaXZpc29yID49IDFlN1xyXG4gICAgICB9IGVsc2Uge1xyXG5cclxuICAgICAgICAvLyBOb3JtYWxpc2UgeGQgYW5kIHlkIHNvIGhpZ2hlc3Qgb3JkZXIgZGlnaXQgb2YgeWQgaXMgPj0gYmFzZS8yXHJcbiAgICAgICAgayA9IGJhc2UgLyAoeWRbMF0gKyAxKSB8IDA7XHJcblxyXG4gICAgICAgIGlmIChrID4gMSkge1xyXG4gICAgICAgICAgeWQgPSBtdWx0aXBseUludGVnZXIoeWQsIGssIGJhc2UpO1xyXG4gICAgICAgICAgeGQgPSBtdWx0aXBseUludGVnZXIoeGQsIGssIGJhc2UpO1xyXG4gICAgICAgICAgeUwgPSB5ZC5sZW5ndGg7XHJcbiAgICAgICAgICB4TCA9IHhkLmxlbmd0aDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHhpID0geUw7XHJcbiAgICAgICAgcmVtID0geGQuc2xpY2UoMCwgeUwpO1xyXG4gICAgICAgIHJlbUwgPSByZW0ubGVuZ3RoO1xyXG5cclxuICAgICAgICAvLyBBZGQgemVyb3MgdG8gbWFrZSByZW1haW5kZXIgYXMgbG9uZyBhcyBkaXZpc29yLlxyXG4gICAgICAgIGZvciAoOyByZW1MIDwgeUw7KSByZW1bcmVtTCsrXSA9IDA7XHJcblxyXG4gICAgICAgIHl6ID0geWQuc2xpY2UoKTtcclxuICAgICAgICB5ei51bnNoaWZ0KDApO1xyXG4gICAgICAgIHlkMCA9IHlkWzBdO1xyXG5cclxuICAgICAgICBpZiAoeWRbMV0gPj0gYmFzZSAvIDIpICsreWQwO1xyXG5cclxuICAgICAgICBkbyB7XHJcbiAgICAgICAgICBrID0gMDtcclxuXHJcbiAgICAgICAgICAvLyBDb21wYXJlIGRpdmlzb3IgYW5kIHJlbWFpbmRlci5cclxuICAgICAgICAgIGNtcCA9IGNvbXBhcmUoeWQsIHJlbSwgeUwsIHJlbUwpO1xyXG5cclxuICAgICAgICAgIC8vIElmIGRpdmlzb3IgPCByZW1haW5kZXIuXHJcbiAgICAgICAgICBpZiAoY21wIDwgMCkge1xyXG5cclxuICAgICAgICAgICAgLy8gQ2FsY3VsYXRlIHRyaWFsIGRpZ2l0LCBrLlxyXG4gICAgICAgICAgICByZW0wID0gcmVtWzBdO1xyXG4gICAgICAgICAgICBpZiAoeUwgIT0gcmVtTCkgcmVtMCA9IHJlbTAgKiBiYXNlICsgKHJlbVsxXSB8fCAwKTtcclxuXHJcbiAgICAgICAgICAgIC8vIGsgd2lsbCBiZSBob3cgbWFueSB0aW1lcyB0aGUgZGl2aXNvciBnb2VzIGludG8gdGhlIGN1cnJlbnQgcmVtYWluZGVyLlxyXG4gICAgICAgICAgICBrID0gcmVtMCAvIHlkMCB8IDA7XHJcblxyXG4gICAgICAgICAgICAvLyAgQWxnb3JpdGhtOlxyXG4gICAgICAgICAgICAvLyAgMS4gcHJvZHVjdCA9IGRpdmlzb3IgKiB0cmlhbCBkaWdpdCAoaylcclxuICAgICAgICAgICAgLy8gIDIuIGlmIHByb2R1Y3QgPiByZW1haW5kZXI6IHByb2R1Y3QgLT0gZGl2aXNvciwgay0tXHJcbiAgICAgICAgICAgIC8vICAzLiByZW1haW5kZXIgLT0gcHJvZHVjdFxyXG4gICAgICAgICAgICAvLyAgNC4gaWYgcHJvZHVjdCB3YXMgPCByZW1haW5kZXIgYXQgMjpcclxuICAgICAgICAgICAgLy8gICAgNS4gY29tcGFyZSBuZXcgcmVtYWluZGVyIGFuZCBkaXZpc29yXHJcbiAgICAgICAgICAgIC8vICAgIDYuIElmIHJlbWFpbmRlciA+IGRpdmlzb3I6IHJlbWFpbmRlciAtPSBkaXZpc29yLCBrKytcclxuXHJcbiAgICAgICAgICAgIGlmIChrID4gMSkge1xyXG4gICAgICAgICAgICAgIGlmIChrID49IGJhc2UpIGsgPSBiYXNlIC0gMTtcclxuXHJcbiAgICAgICAgICAgICAgLy8gcHJvZHVjdCA9IGRpdmlzb3IgKiB0cmlhbCBkaWdpdC5cclxuICAgICAgICAgICAgICBwcm9kID0gbXVsdGlwbHlJbnRlZ2VyKHlkLCBrLCBiYXNlKTtcclxuICAgICAgICAgICAgICBwcm9kTCA9IHByb2QubGVuZ3RoO1xyXG4gICAgICAgICAgICAgIHJlbUwgPSByZW0ubGVuZ3RoO1xyXG5cclxuICAgICAgICAgICAgICAvLyBDb21wYXJlIHByb2R1Y3QgYW5kIHJlbWFpbmRlci5cclxuICAgICAgICAgICAgICBjbXAgPSBjb21wYXJlKHByb2QsIHJlbSwgcHJvZEwsIHJlbUwpO1xyXG5cclxuICAgICAgICAgICAgICAvLyBwcm9kdWN0ID4gcmVtYWluZGVyLlxyXG4gICAgICAgICAgICAgIGlmIChjbXAgPT0gMSkge1xyXG4gICAgICAgICAgICAgICAgay0tO1xyXG5cclxuICAgICAgICAgICAgICAgIC8vIFN1YnRyYWN0IGRpdmlzb3IgZnJvbSBwcm9kdWN0LlxyXG4gICAgICAgICAgICAgICAgc3VidHJhY3QocHJvZCwgeUwgPCBwcm9kTCA/IHl6IDogeWQsIHByb2RMLCBiYXNlKTtcclxuICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcblxyXG4gICAgICAgICAgICAgIC8vIGNtcCBpcyAtMS5cclxuICAgICAgICAgICAgICAvLyBJZiBrIGlzIDAsIHRoZXJlIGlzIG5vIG5lZWQgdG8gY29tcGFyZSB5ZCBhbmQgcmVtIGFnYWluIGJlbG93LCBzbyBjaGFuZ2UgY21wIHRvIDFcclxuICAgICAgICAgICAgICAvLyB0byBhdm9pZCBpdC4gSWYgayBpcyAxIHRoZXJlIGlzIGEgbmVlZCB0byBjb21wYXJlIHlkIGFuZCByZW0gYWdhaW4gYmVsb3cuXHJcbiAgICAgICAgICAgICAgaWYgKGsgPT0gMCkgY21wID0gayA9IDE7XHJcbiAgICAgICAgICAgICAgcHJvZCA9IHlkLnNsaWNlKCk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIHByb2RMID0gcHJvZC5sZW5ndGg7XHJcbiAgICAgICAgICAgIGlmIChwcm9kTCA8IHJlbUwpIHByb2QudW5zaGlmdCgwKTtcclxuXHJcbiAgICAgICAgICAgIC8vIFN1YnRyYWN0IHByb2R1Y3QgZnJvbSByZW1haW5kZXIuXHJcbiAgICAgICAgICAgIHN1YnRyYWN0KHJlbSwgcHJvZCwgcmVtTCwgYmFzZSk7XHJcblxyXG4gICAgICAgICAgICAvLyBJZiBwcm9kdWN0IHdhcyA8IHByZXZpb3VzIHJlbWFpbmRlci5cclxuICAgICAgICAgICAgaWYgKGNtcCA9PSAtMSkge1xyXG4gICAgICAgICAgICAgIHJlbUwgPSByZW0ubGVuZ3RoO1xyXG5cclxuICAgICAgICAgICAgICAvLyBDb21wYXJlIGRpdmlzb3IgYW5kIG5ldyByZW1haW5kZXIuXHJcbiAgICAgICAgICAgICAgY21wID0gY29tcGFyZSh5ZCwgcmVtLCB5TCwgcmVtTCk7XHJcblxyXG4gICAgICAgICAgICAgIC8vIElmIGRpdmlzb3IgPCBuZXcgcmVtYWluZGVyLCBzdWJ0cmFjdCBkaXZpc29yIGZyb20gcmVtYWluZGVyLlxyXG4gICAgICAgICAgICAgIGlmIChjbXAgPCAxKSB7XHJcbiAgICAgICAgICAgICAgICBrKys7XHJcblxyXG4gICAgICAgICAgICAgICAgLy8gU3VidHJhY3QgZGl2aXNvciBmcm9tIHJlbWFpbmRlci5cclxuICAgICAgICAgICAgICAgIHN1YnRyYWN0KHJlbSwgeUwgPCByZW1MID8geXogOiB5ZCwgcmVtTCwgYmFzZSk7XHJcbiAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICByZW1MID0gcmVtLmxlbmd0aDtcclxuICAgICAgICAgIH0gZWxzZSBpZiAoY21wID09PSAwKSB7XHJcbiAgICAgICAgICAgIGsrKztcclxuICAgICAgICAgICAgcmVtID0gWzBdO1xyXG4gICAgICAgICAgfSAgICAvLyBpZiBjbXAgPT09IDEsIGsgd2lsbCBiZSAwXHJcblxyXG4gICAgICAgICAgLy8gQWRkIHRoZSBuZXh0IGRpZ2l0LCBrLCB0byB0aGUgcmVzdWx0IGFycmF5LlxyXG4gICAgICAgICAgcWRbaSsrXSA9IGs7XHJcblxyXG4gICAgICAgICAgLy8gVXBkYXRlIHRoZSByZW1haW5kZXIuXHJcbiAgICAgICAgICBpZiAoY21wICYmIHJlbVswXSkge1xyXG4gICAgICAgICAgICByZW1bcmVtTCsrXSA9IHhkW3hpXSB8fCAwO1xyXG4gICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgcmVtID0gW3hkW3hpXV07XHJcbiAgICAgICAgICAgIHJlbUwgPSAxO1xyXG4gICAgICAgICAgfVxyXG5cclxuICAgICAgICB9IHdoaWxlICgoeGkrKyA8IHhMIHx8IHJlbVswXSAhPT0gdm9pZCAwKSAmJiBzZC0tKTtcclxuXHJcbiAgICAgICAgbW9yZSA9IHJlbVswXSAhPT0gdm9pZCAwO1xyXG4gICAgICB9XHJcblxyXG4gICAgICAvLyBMZWFkaW5nIHplcm8/XHJcbiAgICAgIGlmICghcWRbMF0pIHFkLnNoaWZ0KCk7XHJcbiAgICB9XHJcblxyXG4gICAgLy8gbG9nQmFzZSBpcyAxIHdoZW4gZGl2aWRlIGlzIGJlaW5nIHVzZWQgZm9yIGJhc2UgY29udmVyc2lvbi5cclxuICAgIGlmIChsb2dCYXNlID09IDEpIHtcclxuICAgICAgcS5lID0gZTtcclxuICAgICAgaW5leGFjdCA9IG1vcmU7XHJcbiAgICB9IGVsc2Uge1xyXG5cclxuICAgICAgLy8gVG8gY2FsY3VsYXRlIHEuZSwgZmlyc3QgZ2V0IHRoZSBudW1iZXIgb2YgZGlnaXRzIG9mIHFkWzBdLlxyXG4gICAgICBmb3IgKGkgPSAxLCBrID0gcWRbMF07IGsgPj0gMTA7IGsgLz0gMTApIGkrKztcclxuICAgICAgcS5lID0gaSArIGUgKiBsb2dCYXNlIC0gMTtcclxuXHJcbiAgICAgIGZpbmFsaXNlKHEsIGRwID8gcHIgKyBxLmUgKyAxIDogcHIsIHJtLCBtb3JlKTtcclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4gcTtcclxuICB9O1xyXG59KSgpO1xyXG5cclxuXHJcbi8qXHJcbiAqIFJvdW5kIGB4YCB0byBgc2RgIHNpZ25pZmljYW50IGRpZ2l0cyB1c2luZyByb3VuZGluZyBtb2RlIGBybWAuXHJcbiAqIENoZWNrIGZvciBvdmVyL3VuZGVyLWZsb3cuXHJcbiAqL1xyXG4gZnVuY3Rpb24gZmluYWxpc2UoeCwgc2QsIHJtLCBpc1RydW5jYXRlZCkge1xyXG4gIHZhciBkaWdpdHMsIGksIGosIGssIHJkLCByb3VuZFVwLCB3LCB4ZCwgeGRpLFxyXG4gICAgQ3RvciA9IHguY29uc3RydWN0b3I7XHJcblxyXG4gIC8vIERvbid0IHJvdW5kIGlmIHNkIGlzIG51bGwgb3IgdW5kZWZpbmVkLlxyXG4gIG91dDogaWYgKHNkICE9IG51bGwpIHtcclxuICAgIHhkID0geC5kO1xyXG5cclxuICAgIC8vIEluZmluaXR5L05hTi5cclxuICAgIGlmICgheGQpIHJldHVybiB4O1xyXG5cclxuICAgIC8vIHJkOiB0aGUgcm91bmRpbmcgZGlnaXQsIGkuZS4gdGhlIGRpZ2l0IGFmdGVyIHRoZSBkaWdpdCB0aGF0IG1heSBiZSByb3VuZGVkIHVwLlxyXG4gICAgLy8gdzogdGhlIHdvcmQgb2YgeGQgY29udGFpbmluZyByZCwgYSBiYXNlIDFlNyBudW1iZXIuXHJcbiAgICAvLyB4ZGk6IHRoZSBpbmRleCBvZiB3IHdpdGhpbiB4ZC5cclxuICAgIC8vIGRpZ2l0czogdGhlIG51bWJlciBvZiBkaWdpdHMgb2Ygdy5cclxuICAgIC8vIGk6IHdoYXQgd291bGQgYmUgdGhlIGluZGV4IG9mIHJkIHdpdGhpbiB3IGlmIGFsbCB0aGUgbnVtYmVycyB3ZXJlIDcgZGlnaXRzIGxvbmcgKGkuZS4gaWZcclxuICAgIC8vIHRoZXkgaGFkIGxlYWRpbmcgemVyb3MpXHJcbiAgICAvLyBqOiBpZiA+IDAsIHRoZSBhY3R1YWwgaW5kZXggb2YgcmQgd2l0aGluIHcgKGlmIDwgMCwgcmQgaXMgYSBsZWFkaW5nIHplcm8pLlxyXG5cclxuICAgIC8vIEdldCB0aGUgbGVuZ3RoIG9mIHRoZSBmaXJzdCB3b3JkIG9mIHRoZSBkaWdpdHMgYXJyYXkgeGQuXHJcbiAgICBmb3IgKGRpZ2l0cyA9IDEsIGsgPSB4ZFswXTsgayA+PSAxMDsgayAvPSAxMCkgZGlnaXRzKys7XHJcbiAgICBpID0gc2QgLSBkaWdpdHM7XHJcblxyXG4gICAgLy8gSXMgdGhlIHJvdW5kaW5nIGRpZ2l0IGluIHRoZSBmaXJzdCB3b3JkIG9mIHhkP1xyXG4gICAgaWYgKGkgPCAwKSB7XHJcbiAgICAgIGkgKz0gTE9HX0JBU0U7XHJcbiAgICAgIGogPSBzZDtcclxuICAgICAgdyA9IHhkW3hkaSA9IDBdO1xyXG5cclxuICAgICAgLy8gR2V0IHRoZSByb3VuZGluZyBkaWdpdCBhdCBpbmRleCBqIG9mIHcuXHJcbiAgICAgIHJkID0gdyAvIG1hdGhwb3coMTAsIGRpZ2l0cyAtIGogLSAxKSAlIDEwIHwgMDtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIHhkaSA9IE1hdGguY2VpbCgoaSArIDEpIC8gTE9HX0JBU0UpO1xyXG4gICAgICBrID0geGQubGVuZ3RoO1xyXG4gICAgICBpZiAoeGRpID49IGspIHtcclxuICAgICAgICBpZiAoaXNUcnVuY2F0ZWQpIHtcclxuXHJcbiAgICAgICAgICAvLyBOZWVkZWQgYnkgYG5hdHVyYWxFeHBvbmVudGlhbGAsIGBuYXR1cmFsTG9nYXJpdGhtYCBhbmQgYHNxdWFyZVJvb3RgLlxyXG4gICAgICAgICAgZm9yICg7IGsrKyA8PSB4ZGk7KSB4ZC5wdXNoKDApO1xyXG4gICAgICAgICAgdyA9IHJkID0gMDtcclxuICAgICAgICAgIGRpZ2l0cyA9IDE7XHJcbiAgICAgICAgICBpICU9IExPR19CQVNFO1xyXG4gICAgICAgICAgaiA9IGkgLSBMT0dfQkFTRSArIDE7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgIGJyZWFrIG91dDtcclxuICAgICAgICB9XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgdyA9IGsgPSB4ZFt4ZGldO1xyXG5cclxuICAgICAgICAvLyBHZXQgdGhlIG51bWJlciBvZiBkaWdpdHMgb2Ygdy5cclxuICAgICAgICBmb3IgKGRpZ2l0cyA9IDE7IGsgPj0gMTA7IGsgLz0gMTApIGRpZ2l0cysrO1xyXG5cclxuICAgICAgICAvLyBHZXQgdGhlIGluZGV4IG9mIHJkIHdpdGhpbiB3LlxyXG4gICAgICAgIGkgJT0gTE9HX0JBU0U7XHJcblxyXG4gICAgICAgIC8vIEdldCB0aGUgaW5kZXggb2YgcmQgd2l0aGluIHcsIGFkanVzdGVkIGZvciBsZWFkaW5nIHplcm9zLlxyXG4gICAgICAgIC8vIFRoZSBudW1iZXIgb2YgbGVhZGluZyB6ZXJvcyBvZiB3IGlzIGdpdmVuIGJ5IExPR19CQVNFIC0gZGlnaXRzLlxyXG4gICAgICAgIGogPSBpIC0gTE9HX0JBU0UgKyBkaWdpdHM7XHJcblxyXG4gICAgICAgIC8vIEdldCB0aGUgcm91bmRpbmcgZGlnaXQgYXQgaW5kZXggaiBvZiB3LlxyXG4gICAgICAgIHJkID0gaiA8IDAgPyAwIDogdyAvIG1hdGhwb3coMTAsIGRpZ2l0cyAtIGogLSAxKSAlIDEwIHwgMDtcclxuICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIC8vIEFyZSB0aGVyZSBhbnkgbm9uLXplcm8gZGlnaXRzIGFmdGVyIHRoZSByb3VuZGluZyBkaWdpdD9cclxuICAgIGlzVHJ1bmNhdGVkID0gaXNUcnVuY2F0ZWQgfHwgc2QgPCAwIHx8XHJcbiAgICAgIHhkW3hkaSArIDFdICE9PSB2b2lkIDAgfHwgKGogPCAwID8gdyA6IHcgJSBtYXRocG93KDEwLCBkaWdpdHMgLSBqIC0gMSkpO1xyXG5cclxuICAgIC8vIFRoZSBleHByZXNzaW9uIGB3ICUgbWF0aHBvdygxMCwgZGlnaXRzIC0gaiAtIDEpYCByZXR1cm5zIGFsbCB0aGUgZGlnaXRzIG9mIHcgdG8gdGhlIHJpZ2h0XHJcbiAgICAvLyBvZiB0aGUgZGlnaXQgYXQgKGxlZnQtdG8tcmlnaHQpIGluZGV4IGosIGUuZy4gaWYgdyBpcyA5MDg3MTQgYW5kIGogaXMgMiwgdGhlIGV4cHJlc3Npb25cclxuICAgIC8vIHdpbGwgZ2l2ZSA3MTQuXHJcblxyXG4gICAgcm91bmRVcCA9IHJtIDwgNFxyXG4gICAgICA/IChyZCB8fCBpc1RydW5jYXRlZCkgJiYgKHJtID09IDAgfHwgcm0gPT0gKHgucyA8IDAgPyAzIDogMikpXHJcbiAgICAgIDogcmQgPiA1IHx8IHJkID09IDUgJiYgKHJtID09IDQgfHwgaXNUcnVuY2F0ZWQgfHwgcm0gPT0gNiAmJlxyXG5cclxuICAgICAgICAvLyBDaGVjayB3aGV0aGVyIHRoZSBkaWdpdCB0byB0aGUgbGVmdCBvZiB0aGUgcm91bmRpbmcgZGlnaXQgaXMgb2RkLlxyXG4gICAgICAgICgoaSA+IDAgPyBqID4gMCA/IHcgLyBtYXRocG93KDEwLCBkaWdpdHMgLSBqKSA6IDAgOiB4ZFt4ZGkgLSAxXSkgJSAxMCkgJiAxIHx8XHJcbiAgICAgICAgICBybSA9PSAoeC5zIDwgMCA/IDggOiA3KSk7XHJcblxyXG4gICAgaWYgKHNkIDwgMSB8fCAheGRbMF0pIHtcclxuICAgICAgeGQubGVuZ3RoID0gMDtcclxuICAgICAgaWYgKHJvdW5kVXApIHtcclxuXHJcbiAgICAgICAgLy8gQ29udmVydCBzZCB0byBkZWNpbWFsIHBsYWNlcy5cclxuICAgICAgICBzZCAtPSB4LmUgKyAxO1xyXG5cclxuICAgICAgICAvLyAxLCAwLjEsIDAuMDEsIDAuMDAxLCAwLjAwMDEgZXRjLlxyXG4gICAgICAgIHhkWzBdID0gbWF0aHBvdygxMCwgKExPR19CQVNFIC0gc2QgJSBMT0dfQkFTRSkgJSBMT0dfQkFTRSk7XHJcbiAgICAgICAgeC5lID0gLXNkIHx8IDA7XHJcbiAgICAgIH0gZWxzZSB7XHJcblxyXG4gICAgICAgIC8vIFplcm8uXHJcbiAgICAgICAgeGRbMF0gPSB4LmUgPSAwO1xyXG4gICAgICB9XHJcblxyXG4gICAgICByZXR1cm4geDtcclxuICAgIH1cclxuXHJcbiAgICAvLyBSZW1vdmUgZXhjZXNzIGRpZ2l0cy5cclxuICAgIGlmIChpID09IDApIHtcclxuICAgICAgeGQubGVuZ3RoID0geGRpO1xyXG4gICAgICBrID0gMTtcclxuICAgICAgeGRpLS07XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICB4ZC5sZW5ndGggPSB4ZGkgKyAxO1xyXG4gICAgICBrID0gbWF0aHBvdygxMCwgTE9HX0JBU0UgLSBpKTtcclxuXHJcbiAgICAgIC8vIEUuZy4gNTY3MDAgYmVjb21lcyA1NjAwMCBpZiA3IGlzIHRoZSByb3VuZGluZyBkaWdpdC5cclxuICAgICAgLy8gaiA+IDAgbWVhbnMgaSA+IG51bWJlciBvZiBsZWFkaW5nIHplcm9zIG9mIHcuXHJcbiAgICAgIHhkW3hkaV0gPSBqID4gMCA/ICh3IC8gbWF0aHBvdygxMCwgZGlnaXRzIC0gaikgJSBtYXRocG93KDEwLCBqKSB8IDApICogayA6IDA7XHJcbiAgICB9XHJcblxyXG4gICAgaWYgKHJvdW5kVXApIHtcclxuICAgICAgZm9yICg7Oykge1xyXG5cclxuICAgICAgICAvLyBJcyB0aGUgZGlnaXQgdG8gYmUgcm91bmRlZCB1cCBpbiB0aGUgZmlyc3Qgd29yZCBvZiB4ZD9cclxuICAgICAgICBpZiAoeGRpID09IDApIHtcclxuXHJcbiAgICAgICAgICAvLyBpIHdpbGwgYmUgdGhlIGxlbmd0aCBvZiB4ZFswXSBiZWZvcmUgayBpcyBhZGRlZC5cclxuICAgICAgICAgIGZvciAoaSA9IDEsIGogPSB4ZFswXTsgaiA+PSAxMDsgaiAvPSAxMCkgaSsrO1xyXG4gICAgICAgICAgaiA9IHhkWzBdICs9IGs7XHJcbiAgICAgICAgICBmb3IgKGsgPSAxOyBqID49IDEwOyBqIC89IDEwKSBrKys7XHJcblxyXG4gICAgICAgICAgLy8gaWYgaSAhPSBrIHRoZSBsZW5ndGggaGFzIGluY3JlYXNlZC5cclxuICAgICAgICAgIGlmIChpICE9IGspIHtcclxuICAgICAgICAgICAgeC5lKys7XHJcbiAgICAgICAgICAgIGlmICh4ZFswXSA9PSBCQVNFKSB4ZFswXSA9IDE7XHJcbiAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgIHhkW3hkaV0gKz0gaztcclxuICAgICAgICAgIGlmICh4ZFt4ZGldICE9IEJBU0UpIGJyZWFrO1xyXG4gICAgICAgICAgeGRbeGRpLS1dID0gMDtcclxuICAgICAgICAgIGsgPSAxO1xyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIC8vIFJlbW92ZSB0cmFpbGluZyB6ZXJvcy5cclxuICAgIGZvciAoaSA9IHhkLmxlbmd0aDsgeGRbLS1pXSA9PT0gMDspIHhkLnBvcCgpO1xyXG4gIH1cclxuXHJcbiAgaWYgKGV4dGVybmFsKSB7XHJcblxyXG4gICAgLy8gT3ZlcmZsb3c/XHJcbiAgICBpZiAoeC5lID4gQ3Rvci5tYXhFKSB7XHJcblxyXG4gICAgICAvLyBJbmZpbml0eS5cclxuICAgICAgeC5kID0gbnVsbDtcclxuICAgICAgeC5lID0gTmFOO1xyXG5cclxuICAgIC8vIFVuZGVyZmxvdz9cclxuICAgIH0gZWxzZSBpZiAoeC5lIDwgQ3Rvci5taW5FKSB7XHJcblxyXG4gICAgICAvLyBaZXJvLlxyXG4gICAgICB4LmUgPSAwO1xyXG4gICAgICB4LmQgPSBbMF07XHJcbiAgICAgIC8vIEN0b3IudW5kZXJmbG93ID0gdHJ1ZTtcclxuICAgIH0gLy8gZWxzZSBDdG9yLnVuZGVyZmxvdyA9IGZhbHNlO1xyXG4gIH1cclxuXHJcbiAgcmV0dXJuIHg7XHJcbn1cclxuXHJcblxyXG5mdW5jdGlvbiBmaW5pdGVUb1N0cmluZyh4LCBpc0V4cCwgc2QpIHtcclxuICBpZiAoIXguaXNGaW5pdGUoKSkgcmV0dXJuIG5vbkZpbml0ZVRvU3RyaW5nKHgpO1xyXG4gIHZhciBrLFxyXG4gICAgZSA9IHguZSxcclxuICAgIHN0ciA9IGRpZ2l0c1RvU3RyaW5nKHguZCksXHJcbiAgICBsZW4gPSBzdHIubGVuZ3RoO1xyXG5cclxuICBpZiAoaXNFeHApIHtcclxuICAgIGlmIChzZCAmJiAoayA9IHNkIC0gbGVuKSA+IDApIHtcclxuICAgICAgc3RyID0gc3RyLmNoYXJBdCgwKSArICcuJyArIHN0ci5zbGljZSgxKSArIGdldFplcm9TdHJpbmcoayk7XHJcbiAgICB9IGVsc2UgaWYgKGxlbiA+IDEpIHtcclxuICAgICAgc3RyID0gc3RyLmNoYXJBdCgwKSArICcuJyArIHN0ci5zbGljZSgxKTtcclxuICAgIH1cclxuXHJcbiAgICBzdHIgPSBzdHIgKyAoeC5lIDwgMCA/ICdlJyA6ICdlKycpICsgeC5lO1xyXG4gIH0gZWxzZSBpZiAoZSA8IDApIHtcclxuICAgIHN0ciA9ICcwLicgKyBnZXRaZXJvU3RyaW5nKC1lIC0gMSkgKyBzdHI7XHJcbiAgICBpZiAoc2QgJiYgKGsgPSBzZCAtIGxlbikgPiAwKSBzdHIgKz0gZ2V0WmVyb1N0cmluZyhrKTtcclxuICB9IGVsc2UgaWYgKGUgPj0gbGVuKSB7XHJcbiAgICBzdHIgKz0gZ2V0WmVyb1N0cmluZyhlICsgMSAtIGxlbik7XHJcbiAgICBpZiAoc2QgJiYgKGsgPSBzZCAtIGUgLSAxKSA+IDApIHN0ciA9IHN0ciArICcuJyArIGdldFplcm9TdHJpbmcoayk7XHJcbiAgfSBlbHNlIHtcclxuICAgIGlmICgoayA9IGUgKyAxKSA8IGxlbikgc3RyID0gc3RyLnNsaWNlKDAsIGspICsgJy4nICsgc3RyLnNsaWNlKGspO1xyXG4gICAgaWYgKHNkICYmIChrID0gc2QgLSBsZW4pID4gMCkge1xyXG4gICAgICBpZiAoZSArIDEgPT09IGxlbikgc3RyICs9ICcuJztcclxuICAgICAgc3RyICs9IGdldFplcm9TdHJpbmcoayk7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICByZXR1cm4gc3RyO1xyXG59XHJcblxyXG5cclxuLy8gQ2FsY3VsYXRlIHRoZSBiYXNlIDEwIGV4cG9uZW50IGZyb20gdGhlIGJhc2UgMWU3IGV4cG9uZW50LlxyXG5mdW5jdGlvbiBnZXRCYXNlMTBFeHBvbmVudChkaWdpdHMsIGUpIHtcclxuICB2YXIgdyA9IGRpZ2l0c1swXTtcclxuXHJcbiAgLy8gQWRkIHRoZSBudW1iZXIgb2YgZGlnaXRzIG9mIHRoZSBmaXJzdCB3b3JkIG9mIHRoZSBkaWdpdHMgYXJyYXkuXHJcbiAgZm9yICggZSAqPSBMT0dfQkFTRTsgdyA+PSAxMDsgdyAvPSAxMCkgZSsrO1xyXG4gIHJldHVybiBlO1xyXG59XHJcblxyXG5cclxuZnVuY3Rpb24gZ2V0TG4xMChDdG9yLCBzZCwgcHIpIHtcclxuICBpZiAoc2QgPiBMTjEwX1BSRUNJU0lPTikge1xyXG5cclxuICAgIC8vIFJlc2V0IGdsb2JhbCBzdGF0ZSBpbiBjYXNlIHRoZSBleGNlcHRpb24gaXMgY2F1Z2h0LlxyXG4gICAgZXh0ZXJuYWwgPSB0cnVlO1xyXG4gICAgaWYgKHByKSBDdG9yLnByZWNpc2lvbiA9IHByO1xyXG4gICAgdGhyb3cgRXJyb3IocHJlY2lzaW9uTGltaXRFeGNlZWRlZCk7XHJcbiAgfVxyXG4gIHJldHVybiBmaW5hbGlzZShuZXcgQ3RvcihMTjEwKSwgc2QsIDEsIHRydWUpO1xyXG59XHJcblxyXG5cclxuZnVuY3Rpb24gZ2V0UGkoQ3Rvciwgc2QsIHJtKSB7XHJcbiAgaWYgKHNkID4gUElfUFJFQ0lTSU9OKSB0aHJvdyBFcnJvcihwcmVjaXNpb25MaW1pdEV4Y2VlZGVkKTtcclxuICByZXR1cm4gZmluYWxpc2UobmV3IEN0b3IoUEkpLCBzZCwgcm0sIHRydWUpO1xyXG59XHJcblxyXG5cclxuZnVuY3Rpb24gZ2V0UHJlY2lzaW9uKGRpZ2l0cykge1xyXG4gIHZhciB3ID0gZGlnaXRzLmxlbmd0aCAtIDEsXHJcbiAgICBsZW4gPSB3ICogTE9HX0JBU0UgKyAxO1xyXG5cclxuICB3ID0gZGlnaXRzW3ddO1xyXG5cclxuICAvLyBJZiBub24temVyby4uLlxyXG4gIGlmICh3KSB7XHJcblxyXG4gICAgLy8gU3VidHJhY3QgdGhlIG51bWJlciBvZiB0cmFpbGluZyB6ZXJvcyBvZiB0aGUgbGFzdCB3b3JkLlxyXG4gICAgZm9yICg7IHcgJSAxMCA9PSAwOyB3IC89IDEwKSBsZW4tLTtcclxuXHJcbiAgICAvLyBBZGQgdGhlIG51bWJlciBvZiBkaWdpdHMgb2YgdGhlIGZpcnN0IHdvcmQuXHJcbiAgICBmb3IgKHcgPSBkaWdpdHNbMF07IHcgPj0gMTA7IHcgLz0gMTApIGxlbisrO1xyXG4gIH1cclxuXHJcbiAgcmV0dXJuIGxlbjtcclxufVxyXG5cclxuXHJcbmZ1bmN0aW9uIGdldFplcm9TdHJpbmcoaykge1xyXG4gIHZhciB6cyA9ICcnO1xyXG4gIGZvciAoOyBrLS07KSB6cyArPSAnMCc7XHJcbiAgcmV0dXJuIHpzO1xyXG59XHJcblxyXG5cclxuLypcclxuICogUmV0dXJuIGEgbmV3IERlY2ltYWwgd2hvc2UgdmFsdWUgaXMgdGhlIHZhbHVlIG9mIERlY2ltYWwgYHhgIHRvIHRoZSBwb3dlciBgbmAsIHdoZXJlIGBuYCBpcyBhblxyXG4gKiBpbnRlZ2VyIG9mIHR5cGUgbnVtYmVyLlxyXG4gKlxyXG4gKiBJbXBsZW1lbnRzICdleHBvbmVudGlhdGlvbiBieSBzcXVhcmluZycuIENhbGxlZCBieSBgcG93YCBhbmQgYHBhcnNlT3RoZXJgLlxyXG4gKlxyXG4gKi9cclxuZnVuY3Rpb24gaW50UG93KEN0b3IsIHgsIG4sIHByKSB7XHJcbiAgdmFyIGlzVHJ1bmNhdGVkLFxyXG4gICAgciA9IG5ldyBDdG9yKDEpLFxyXG5cclxuICAgIC8vIE1heCBuIG9mIDkwMDcxOTkyNTQ3NDA5OTEgdGFrZXMgNTMgbG9vcCBpdGVyYXRpb25zLlxyXG4gICAgLy8gTWF4aW11bSBkaWdpdHMgYXJyYXkgbGVuZ3RoOyBsZWF2ZXMgWzI4LCAzNF0gZ3VhcmQgZGlnaXRzLlxyXG4gICAgayA9IE1hdGguY2VpbChwciAvIExPR19CQVNFICsgNCk7XHJcblxyXG4gIGV4dGVybmFsID0gZmFsc2U7XHJcblxyXG4gIGZvciAoOzspIHtcclxuICAgIGlmIChuICUgMikge1xyXG4gICAgICByID0gci50aW1lcyh4KTtcclxuICAgICAgaWYgKHRydW5jYXRlKHIuZCwgaykpIGlzVHJ1bmNhdGVkID0gdHJ1ZTtcclxuICAgIH1cclxuXHJcbiAgICBuID0gbWF0aGZsb29yKG4gLyAyKTtcclxuICAgIGlmIChuID09PSAwKSB7XHJcblxyXG4gICAgICAvLyBUbyBlbnN1cmUgY29ycmVjdCByb3VuZGluZyB3aGVuIHIuZCBpcyB0cnVuY2F0ZWQsIGluY3JlbWVudCB0aGUgbGFzdCB3b3JkIGlmIGl0IGlzIHplcm8uXHJcbiAgICAgIG4gPSByLmQubGVuZ3RoIC0gMTtcclxuICAgICAgaWYgKGlzVHJ1bmNhdGVkICYmIHIuZFtuXSA9PT0gMCkgKytyLmRbbl07XHJcbiAgICAgIGJyZWFrO1xyXG4gICAgfVxyXG5cclxuICAgIHggPSB4LnRpbWVzKHgpO1xyXG4gICAgdHJ1bmNhdGUoeC5kLCBrKTtcclxuICB9XHJcblxyXG4gIGV4dGVybmFsID0gdHJ1ZTtcclxuXHJcbiAgcmV0dXJuIHI7XHJcbn1cclxuXHJcblxyXG5mdW5jdGlvbiBpc09kZChuKSB7XHJcbiAgcmV0dXJuIG4uZFtuLmQubGVuZ3RoIC0gMV0gJiAxO1xyXG59XHJcblxyXG5cclxuLypcclxuICogSGFuZGxlIGBtYXhgIGFuZCBgbWluYC4gYGx0Z3RgIGlzICdsdCcgb3IgJ2d0Jy5cclxuICovXHJcbmZ1bmN0aW9uIG1heE9yTWluKEN0b3IsIGFyZ3MsIGx0Z3QpIHtcclxuICB2YXIgeSxcclxuICAgIHggPSBuZXcgQ3RvcihhcmdzWzBdKSxcclxuICAgIGkgPSAwO1xyXG5cclxuICBmb3IgKDsgKytpIDwgYXJncy5sZW5ndGg7KSB7XHJcbiAgICB5ID0gbmV3IEN0b3IoYXJnc1tpXSk7XHJcbiAgICBpZiAoIXkucykge1xyXG4gICAgICB4ID0geTtcclxuICAgICAgYnJlYWs7XHJcbiAgICB9IGVsc2UgaWYgKHhbbHRndF0oeSkpIHtcclxuICAgICAgeCA9IHk7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICByZXR1cm4geDtcclxufVxyXG5cclxuXHJcbi8qXHJcbiAqIFJldHVybiBhIG5ldyBEZWNpbWFsIHdob3NlIHZhbHVlIGlzIHRoZSBuYXR1cmFsIGV4cG9uZW50aWFsIG9mIGB4YCByb3VuZGVkIHRvIGBzZGAgc2lnbmlmaWNhbnRcclxuICogZGlnaXRzLlxyXG4gKlxyXG4gKiBUYXlsb3IvTWFjbGF1cmluIHNlcmllcy5cclxuICpcclxuICogZXhwKHgpID0geF4wLzAhICsgeF4xLzEhICsgeF4yLzIhICsgeF4zLzMhICsgLi4uXHJcbiAqXHJcbiAqIEFyZ3VtZW50IHJlZHVjdGlvbjpcclxuICogICBSZXBlYXQgeCA9IHggLyAzMiwgayArPSA1LCB1bnRpbCB8eHwgPCAwLjFcclxuICogICBleHAoeCkgPSBleHAoeCAvIDJeayleKDJeaylcclxuICpcclxuICogUHJldmlvdXNseSwgdGhlIGFyZ3VtZW50IHdhcyBpbml0aWFsbHkgcmVkdWNlZCBieVxyXG4gKiBleHAoeCkgPSBleHAocikgKiAxMF5rICB3aGVyZSByID0geCAtIGsgKiBsbjEwLCBrID0gZmxvb3IoeCAvIGxuMTApXHJcbiAqIHRvIGZpcnN0IHB1dCByIGluIHRoZSByYW5nZSBbMCwgbG4xMF0sIGJlZm9yZSBkaXZpZGluZyBieSAzMiB1bnRpbCB8eHwgPCAwLjEsIGJ1dCB0aGlzIHdhc1xyXG4gKiBmb3VuZCB0byBiZSBzbG93ZXIgdGhhbiBqdXN0IGRpdmlkaW5nIHJlcGVhdGVkbHkgYnkgMzIgYXMgYWJvdmUuXHJcbiAqXHJcbiAqIE1heCBpbnRlZ2VyIGFyZ3VtZW50OiBleHAoJzIwNzIzMjY1ODM2OTQ2NDEzJykgPSA2LjNlKzkwMDAwMDAwMDAwMDAwMDBcclxuICogTWluIGludGVnZXIgYXJndW1lbnQ6IGV4cCgnLTIwNzIzMjY1ODM2OTQ2NDExJykgPSAxLjJlLTkwMDAwMDAwMDAwMDAwMDBcclxuICogKE1hdGggb2JqZWN0IGludGVnZXIgbWluL21heDogTWF0aC5leHAoNzA5KSA9IDguMmUrMzA3LCBNYXRoLmV4cCgtNzQ1KSA9IDVlLTMyNClcclxuICpcclxuICogIGV4cChJbmZpbml0eSkgID0gSW5maW5pdHlcclxuICogIGV4cCgtSW5maW5pdHkpID0gMFxyXG4gKiAgZXhwKE5hTikgICAgICAgPSBOYU5cclxuICogIGV4cChcdTAwQjEwKSAgICAgICAgPSAxXHJcbiAqXHJcbiAqICBleHAoeCkgaXMgbm9uLXRlcm1pbmF0aW5nIGZvciBhbnkgZmluaXRlLCBub24temVybyB4LlxyXG4gKlxyXG4gKiAgVGhlIHJlc3VsdCB3aWxsIGFsd2F5cyBiZSBjb3JyZWN0bHkgcm91bmRlZC5cclxuICpcclxuICovXHJcbmZ1bmN0aW9uIG5hdHVyYWxFeHBvbmVudGlhbCh4LCBzZCkge1xyXG4gIHZhciBkZW5vbWluYXRvciwgZ3VhcmQsIGosIHBvdywgc3VtLCB0LCB3cHIsXHJcbiAgICByZXAgPSAwLFxyXG4gICAgaSA9IDAsXHJcbiAgICBrID0gMCxcclxuICAgIEN0b3IgPSB4LmNvbnN0cnVjdG9yLFxyXG4gICAgcm0gPSBDdG9yLnJvdW5kaW5nLFxyXG4gICAgcHIgPSBDdG9yLnByZWNpc2lvbjtcclxuXHJcbiAgLy8gMC9OYU4vSW5maW5pdHk/XHJcbiAgaWYgKCF4LmQgfHwgIXguZFswXSB8fCB4LmUgPiAxNykge1xyXG5cclxuICAgIHJldHVybiBuZXcgQ3Rvcih4LmRcclxuICAgICAgPyAheC5kWzBdID8gMSA6IHgucyA8IDAgPyAwIDogMSAvIDBcclxuICAgICAgOiB4LnMgPyB4LnMgPCAwID8gMCA6IHggOiAwIC8gMCk7XHJcbiAgfVxyXG5cclxuICBpZiAoc2QgPT0gbnVsbCkge1xyXG4gICAgZXh0ZXJuYWwgPSBmYWxzZTtcclxuICAgIHdwciA9IHByO1xyXG4gIH0gZWxzZSB7XHJcbiAgICB3cHIgPSBzZDtcclxuICB9XHJcblxyXG4gIHQgPSBuZXcgQ3RvcigwLjAzMTI1KTtcclxuXHJcbiAgLy8gd2hpbGUgYWJzKHgpID49IDAuMVxyXG4gIHdoaWxlICh4LmUgPiAtMikge1xyXG5cclxuICAgIC8vIHggPSB4IC8gMl41XHJcbiAgICB4ID0geC50aW1lcyh0KTtcclxuICAgIGsgKz0gNTtcclxuICB9XHJcblxyXG4gIC8vIFVzZSAyICogbG9nMTAoMl5rKSArIDUgKGVtcGlyaWNhbGx5IGRlcml2ZWQpIHRvIGVzdGltYXRlIHRoZSBpbmNyZWFzZSBpbiBwcmVjaXNpb25cclxuICAvLyBuZWNlc3NhcnkgdG8gZW5zdXJlIHRoZSBmaXJzdCA0IHJvdW5kaW5nIGRpZ2l0cyBhcmUgY29ycmVjdC5cclxuICBndWFyZCA9IE1hdGgubG9nKG1hdGhwb3coMiwgaykpIC8gTWF0aC5MTjEwICogMiArIDUgfCAwO1xyXG4gIHdwciArPSBndWFyZDtcclxuICBkZW5vbWluYXRvciA9IHBvdyA9IHN1bSA9IG5ldyBDdG9yKDEpO1xyXG4gIEN0b3IucHJlY2lzaW9uID0gd3ByO1xyXG5cclxuICBmb3IgKDs7KSB7XHJcbiAgICBwb3cgPSBmaW5hbGlzZShwb3cudGltZXMoeCksIHdwciwgMSk7XHJcbiAgICBkZW5vbWluYXRvciA9IGRlbm9taW5hdG9yLnRpbWVzKCsraSk7XHJcbiAgICB0ID0gc3VtLnBsdXMoZGl2aWRlKHBvdywgZGVub21pbmF0b3IsIHdwciwgMSkpO1xyXG5cclxuICAgIGlmIChkaWdpdHNUb1N0cmluZyh0LmQpLnNsaWNlKDAsIHdwcikgPT09IGRpZ2l0c1RvU3RyaW5nKHN1bS5kKS5zbGljZSgwLCB3cHIpKSB7XHJcbiAgICAgIGogPSBrO1xyXG4gICAgICB3aGlsZSAoai0tKSBzdW0gPSBmaW5hbGlzZShzdW0udGltZXMoc3VtKSwgd3ByLCAxKTtcclxuXHJcbiAgICAgIC8vIENoZWNrIHRvIHNlZSBpZiB0aGUgZmlyc3QgNCByb3VuZGluZyBkaWdpdHMgYXJlIFs0OV05OTkuXHJcbiAgICAgIC8vIElmIHNvLCByZXBlYXQgdGhlIHN1bW1hdGlvbiB3aXRoIGEgaGlnaGVyIHByZWNpc2lvbiwgb3RoZXJ3aXNlXHJcbiAgICAgIC8vIGUuZy4gd2l0aCBwcmVjaXNpb246IDE4LCByb3VuZGluZzogMVxyXG4gICAgICAvLyBleHAoMTguNDA0MjcyNDYyNTk1MDM0MDgzNTY3NzkzOTE5ODQzNzYxKSA9IDk4MzcyNTYwLjEyMjk5OTk5OTkgKHNob3VsZCBiZSA5ODM3MjU2MC4xMjMpXHJcbiAgICAgIC8vIGB3cHIgLSBndWFyZGAgaXMgdGhlIGluZGV4IG9mIGZpcnN0IHJvdW5kaW5nIGRpZ2l0LlxyXG4gICAgICBpZiAoc2QgPT0gbnVsbCkge1xyXG5cclxuICAgICAgICBpZiAocmVwIDwgMyAmJiBjaGVja1JvdW5kaW5nRGlnaXRzKHN1bS5kLCB3cHIgLSBndWFyZCwgcm0sIHJlcCkpIHtcclxuICAgICAgICAgIEN0b3IucHJlY2lzaW9uID0gd3ByICs9IDEwO1xyXG4gICAgICAgICAgZGVub21pbmF0b3IgPSBwb3cgPSB0ID0gbmV3IEN0b3IoMSk7XHJcbiAgICAgICAgICBpID0gMDtcclxuICAgICAgICAgIHJlcCsrO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICByZXR1cm4gZmluYWxpc2Uoc3VtLCBDdG9yLnByZWNpc2lvbiA9IHByLCBybSwgZXh0ZXJuYWwgPSB0cnVlKTtcclxuICAgICAgICB9XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgQ3Rvci5wcmVjaXNpb24gPSBwcjtcclxuICAgICAgICByZXR1cm4gc3VtO1xyXG4gICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgc3VtID0gdDtcclxuICB9XHJcbn1cclxuXHJcblxyXG4vKlxyXG4gKiBSZXR1cm4gYSBuZXcgRGVjaW1hbCB3aG9zZSB2YWx1ZSBpcyB0aGUgbmF0dXJhbCBsb2dhcml0aG0gb2YgYHhgIHJvdW5kZWQgdG8gYHNkYCBzaWduaWZpY2FudFxyXG4gKiBkaWdpdHMuXHJcbiAqXHJcbiAqICBsbigtbikgICAgICAgID0gTmFOXHJcbiAqICBsbigwKSAgICAgICAgID0gLUluZmluaXR5XHJcbiAqICBsbigtMCkgICAgICAgID0gLUluZmluaXR5XHJcbiAqICBsbigxKSAgICAgICAgID0gMFxyXG4gKiAgbG4oSW5maW5pdHkpICA9IEluZmluaXR5XHJcbiAqICBsbigtSW5maW5pdHkpID0gTmFOXHJcbiAqICBsbihOYU4pICAgICAgID0gTmFOXHJcbiAqXHJcbiAqICBsbihuKSAobiAhPSAxKSBpcyBub24tdGVybWluYXRpbmcuXHJcbiAqXHJcbiAqL1xyXG5mdW5jdGlvbiBuYXR1cmFsTG9nYXJpdGhtKHksIHNkKSB7XHJcbiAgdmFyIGMsIGMwLCBkZW5vbWluYXRvciwgZSwgbnVtZXJhdG9yLCByZXAsIHN1bSwgdCwgd3ByLCB4MSwgeDIsXHJcbiAgICBuID0gMSxcclxuICAgIGd1YXJkID0gMTAsXHJcbiAgICB4ID0geSxcclxuICAgIHhkID0geC5kLFxyXG4gICAgQ3RvciA9IHguY29uc3RydWN0b3IsXHJcbiAgICBybSA9IEN0b3Iucm91bmRpbmcsXHJcbiAgICBwciA9IEN0b3IucHJlY2lzaW9uO1xyXG5cclxuICAvLyBJcyB4IG5lZ2F0aXZlIG9yIEluZmluaXR5LCBOYU4sIDAgb3IgMT9cclxuICBpZiAoeC5zIDwgMCB8fCAheGQgfHwgIXhkWzBdIHx8ICF4LmUgJiYgeGRbMF0gPT0gMSAmJiB4ZC5sZW5ndGggPT0gMSkge1xyXG4gICAgcmV0dXJuIG5ldyBDdG9yKHhkICYmICF4ZFswXSA/IC0xIC8gMCA6IHgucyAhPSAxID8gTmFOIDogeGQgPyAwIDogeCk7XHJcbiAgfVxyXG5cclxuICBpZiAoc2QgPT0gbnVsbCkge1xyXG4gICAgZXh0ZXJuYWwgPSBmYWxzZTtcclxuICAgIHdwciA9IHByO1xyXG4gIH0gZWxzZSB7XHJcbiAgICB3cHIgPSBzZDtcclxuICB9XHJcblxyXG4gIEN0b3IucHJlY2lzaW9uID0gd3ByICs9IGd1YXJkO1xyXG4gIGMgPSBkaWdpdHNUb1N0cmluZyh4ZCk7XHJcbiAgYzAgPSBjLmNoYXJBdCgwKTtcclxuXHJcbiAgaWYgKE1hdGguYWJzKGUgPSB4LmUpIDwgMS41ZTE1KSB7XHJcblxyXG4gICAgLy8gQXJndW1lbnQgcmVkdWN0aW9uLlxyXG4gICAgLy8gVGhlIHNlcmllcyBjb252ZXJnZXMgZmFzdGVyIHRoZSBjbG9zZXIgdGhlIGFyZ3VtZW50IGlzIHRvIDEsIHNvIHVzaW5nXHJcbiAgICAvLyBsbihhXmIpID0gYiAqIGxuKGEpLCAgIGxuKGEpID0gbG4oYV5iKSAvIGJcclxuICAgIC8vIG11bHRpcGx5IHRoZSBhcmd1bWVudCBieSBpdHNlbGYgdW50aWwgdGhlIGxlYWRpbmcgZGlnaXRzIG9mIHRoZSBzaWduaWZpY2FuZCBhcmUgNywgOCwgOSxcclxuICAgIC8vIDEwLCAxMSwgMTIgb3IgMTMsIHJlY29yZGluZyB0aGUgbnVtYmVyIG9mIG11bHRpcGxpY2F0aW9ucyBzbyB0aGUgc3VtIG9mIHRoZSBzZXJpZXMgY2FuXHJcbiAgICAvLyBsYXRlciBiZSBkaXZpZGVkIGJ5IHRoaXMgbnVtYmVyLCB0aGVuIHNlcGFyYXRlIG91dCB0aGUgcG93ZXIgb2YgMTAgdXNpbmdcclxuICAgIC8vIGxuKGEqMTBeYikgPSBsbihhKSArIGIqbG4oMTApLlxyXG5cclxuICAgIC8vIG1heCBuIGlzIDIxIChnaXZlcyAwLjksIDEuMCBvciAxLjEpICg5ZTE1IC8gMjEgPSA0LjJlMTQpLlxyXG4gICAgLy93aGlsZSAoYzAgPCA5ICYmIGMwICE9IDEgfHwgYzAgPT0gMSAmJiBjLmNoYXJBdCgxKSA+IDEpIHtcclxuICAgIC8vIG1heCBuIGlzIDYgKGdpdmVzIDAuNyAtIDEuMylcclxuICAgIHdoaWxlIChjMCA8IDcgJiYgYzAgIT0gMSB8fCBjMCA9PSAxICYmIGMuY2hhckF0KDEpID4gMykge1xyXG4gICAgICB4ID0geC50aW1lcyh5KTtcclxuICAgICAgYyA9IGRpZ2l0c1RvU3RyaW5nKHguZCk7XHJcbiAgICAgIGMwID0gYy5jaGFyQXQoMCk7XHJcbiAgICAgIG4rKztcclxuICAgIH1cclxuXHJcbiAgICBlID0geC5lO1xyXG5cclxuICAgIGlmIChjMCA+IDEpIHtcclxuICAgICAgeCA9IG5ldyBDdG9yKCcwLicgKyBjKTtcclxuICAgICAgZSsrO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgeCA9IG5ldyBDdG9yKGMwICsgJy4nICsgYy5zbGljZSgxKSk7XHJcbiAgICB9XHJcbiAgfSBlbHNlIHtcclxuXHJcbiAgICAvLyBUaGUgYXJndW1lbnQgcmVkdWN0aW9uIG1ldGhvZCBhYm92ZSBtYXkgcmVzdWx0IGluIG92ZXJmbG93IGlmIHRoZSBhcmd1bWVudCB5IGlzIGEgbWFzc2l2ZVxyXG4gICAgLy8gbnVtYmVyIHdpdGggZXhwb25lbnQgPj0gMTUwMDAwMDAwMDAwMDAwMCAoOWUxNSAvIDYgPSAxLjVlMTUpLCBzbyBpbnN0ZWFkIHJlY2FsbCB0aGlzXHJcbiAgICAvLyBmdW5jdGlvbiB1c2luZyBsbih4KjEwXmUpID0gbG4oeCkgKyBlKmxuKDEwKS5cclxuICAgIHQgPSBnZXRMbjEwKEN0b3IsIHdwciArIDIsIHByKS50aW1lcyhlICsgJycpO1xyXG4gICAgeCA9IG5hdHVyYWxMb2dhcml0aG0obmV3IEN0b3IoYzAgKyAnLicgKyBjLnNsaWNlKDEpKSwgd3ByIC0gZ3VhcmQpLnBsdXModCk7XHJcbiAgICBDdG9yLnByZWNpc2lvbiA9IHByO1xyXG5cclxuICAgIHJldHVybiBzZCA9PSBudWxsID8gZmluYWxpc2UoeCwgcHIsIHJtLCBleHRlcm5hbCA9IHRydWUpIDogeDtcclxuICB9XHJcblxyXG4gIC8vIHgxIGlzIHggcmVkdWNlZCB0byBhIHZhbHVlIG5lYXIgMS5cclxuICB4MSA9IHg7XHJcblxyXG4gIC8vIFRheWxvciBzZXJpZXMuXHJcbiAgLy8gbG4oeSkgPSBsbigoMSArIHgpLygxIC0geCkpID0gMih4ICsgeF4zLzMgKyB4XjUvNSArIHheNy83ICsgLi4uKVxyXG4gIC8vIHdoZXJlIHggPSAoeSAtIDEpLyh5ICsgMSkgICAgKHx4fCA8IDEpXHJcbiAgc3VtID0gbnVtZXJhdG9yID0geCA9IGRpdmlkZSh4Lm1pbnVzKDEpLCB4LnBsdXMoMSksIHdwciwgMSk7XHJcbiAgeDIgPSBmaW5hbGlzZSh4LnRpbWVzKHgpLCB3cHIsIDEpO1xyXG4gIGRlbm9taW5hdG9yID0gMztcclxuXHJcbiAgZm9yICg7Oykge1xyXG4gICAgbnVtZXJhdG9yID0gZmluYWxpc2UobnVtZXJhdG9yLnRpbWVzKHgyKSwgd3ByLCAxKTtcclxuICAgIHQgPSBzdW0ucGx1cyhkaXZpZGUobnVtZXJhdG9yLCBuZXcgQ3RvcihkZW5vbWluYXRvciksIHdwciwgMSkpO1xyXG5cclxuICAgIGlmIChkaWdpdHNUb1N0cmluZyh0LmQpLnNsaWNlKDAsIHdwcikgPT09IGRpZ2l0c1RvU3RyaW5nKHN1bS5kKS5zbGljZSgwLCB3cHIpKSB7XHJcbiAgICAgIHN1bSA9IHN1bS50aW1lcygyKTtcclxuXHJcbiAgICAgIC8vIFJldmVyc2UgdGhlIGFyZ3VtZW50IHJlZHVjdGlvbi4gQ2hlY2sgdGhhdCBlIGlzIG5vdCAwIGJlY2F1c2UsIGJlc2lkZXMgcHJldmVudGluZyBhblxyXG4gICAgICAvLyB1bm5lY2Vzc2FyeSBjYWxjdWxhdGlvbiwgLTAgKyAwID0gKzAgYW5kIHRvIGVuc3VyZSBjb3JyZWN0IHJvdW5kaW5nIC0wIG5lZWRzIHRvIHN0YXkgLTAuXHJcbiAgICAgIGlmIChlICE9PSAwKSBzdW0gPSBzdW0ucGx1cyhnZXRMbjEwKEN0b3IsIHdwciArIDIsIHByKS50aW1lcyhlICsgJycpKTtcclxuICAgICAgc3VtID0gZGl2aWRlKHN1bSwgbmV3IEN0b3IobiksIHdwciwgMSk7XHJcblxyXG4gICAgICAvLyBJcyBybSA+IDMgYW5kIHRoZSBmaXJzdCA0IHJvdW5kaW5nIGRpZ2l0cyA0OTk5LCBvciBybSA8IDQgKG9yIHRoZSBzdW1tYXRpb24gaGFzXHJcbiAgICAgIC8vIGJlZW4gcmVwZWF0ZWQgcHJldmlvdXNseSkgYW5kIHRoZSBmaXJzdCA0IHJvdW5kaW5nIGRpZ2l0cyA5OTk5P1xyXG4gICAgICAvLyBJZiBzbywgcmVzdGFydCB0aGUgc3VtbWF0aW9uIHdpdGggYSBoaWdoZXIgcHJlY2lzaW9uLCBvdGhlcndpc2VcclxuICAgICAgLy8gZS5nLiB3aXRoIHByZWNpc2lvbjogMTIsIHJvdW5kaW5nOiAxXHJcbiAgICAgIC8vIGxuKDEzNTUyMDAyOC42MTI2MDkxNzE0MjY1MzgxNTMzKSA9IDE4LjcyNDYyOTk5OTkgd2hlbiBpdCBzaG91bGQgYmUgMTguNzI0NjMuXHJcbiAgICAgIC8vIGB3cHIgLSBndWFyZGAgaXMgdGhlIGluZGV4IG9mIGZpcnN0IHJvdW5kaW5nIGRpZ2l0LlxyXG4gICAgICBpZiAoc2QgPT0gbnVsbCkge1xyXG4gICAgICAgIGlmIChjaGVja1JvdW5kaW5nRGlnaXRzKHN1bS5kLCB3cHIgLSBndWFyZCwgcm0sIHJlcCkpIHtcclxuICAgICAgICAgIEN0b3IucHJlY2lzaW9uID0gd3ByICs9IGd1YXJkO1xyXG4gICAgICAgICAgdCA9IG51bWVyYXRvciA9IHggPSBkaXZpZGUoeDEubWludXMoMSksIHgxLnBsdXMoMSksIHdwciwgMSk7XHJcbiAgICAgICAgICB4MiA9IGZpbmFsaXNlKHgudGltZXMoeCksIHdwciwgMSk7XHJcbiAgICAgICAgICBkZW5vbWluYXRvciA9IHJlcCA9IDE7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgIHJldHVybiBmaW5hbGlzZShzdW0sIEN0b3IucHJlY2lzaW9uID0gcHIsIHJtLCBleHRlcm5hbCA9IHRydWUpO1xyXG4gICAgICAgIH1cclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICBDdG9yLnByZWNpc2lvbiA9IHByO1xyXG4gICAgICAgIHJldHVybiBzdW07XHJcbiAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBzdW0gPSB0O1xyXG4gICAgZGVub21pbmF0b3IgKz0gMjtcclxuICB9XHJcbn1cclxuXHJcblxyXG4vLyBcdTAwQjFJbmZpbml0eSwgTmFOLlxyXG5mdW5jdGlvbiBub25GaW5pdGVUb1N0cmluZyh4KSB7XHJcbiAgLy8gVW5zaWduZWQuXHJcbiAgcmV0dXJuIFN0cmluZyh4LnMgKiB4LnMgLyAwKTtcclxufVxyXG5cclxuXHJcbi8qXHJcbiAqIFBhcnNlIHRoZSB2YWx1ZSBvZiBhIG5ldyBEZWNpbWFsIGB4YCBmcm9tIHN0cmluZyBgc3RyYC5cclxuICovXHJcbmZ1bmN0aW9uIHBhcnNlRGVjaW1hbCh4LCBzdHIpIHtcclxuICB2YXIgZSwgaSwgbGVuO1xyXG5cclxuICAvLyBEZWNpbWFsIHBvaW50P1xyXG4gIGlmICgoZSA9IHN0ci5pbmRleE9mKCcuJykpID4gLTEpIHN0ciA9IHN0ci5yZXBsYWNlKCcuJywgJycpO1xyXG5cclxuICAvLyBFeHBvbmVudGlhbCBmb3JtP1xyXG4gIGlmICgoaSA9IHN0ci5zZWFyY2goL2UvaSkpID4gMCkge1xyXG5cclxuICAgIC8vIERldGVybWluZSBleHBvbmVudC5cclxuICAgIGlmIChlIDwgMCkgZSA9IGk7XHJcbiAgICBlICs9ICtzdHIuc2xpY2UoaSArIDEpO1xyXG4gICAgc3RyID0gc3RyLnN1YnN0cmluZygwLCBpKTtcclxuICB9IGVsc2UgaWYgKGUgPCAwKSB7XHJcblxyXG4gICAgLy8gSW50ZWdlci5cclxuICAgIGUgPSBzdHIubGVuZ3RoO1xyXG4gIH1cclxuXHJcbiAgLy8gRGV0ZXJtaW5lIGxlYWRpbmcgemVyb3MuXHJcbiAgZm9yIChpID0gMDsgc3RyLmNoYXJDb2RlQXQoaSkgPT09IDQ4OyBpKyspO1xyXG5cclxuICAvLyBEZXRlcm1pbmUgdHJhaWxpbmcgemVyb3MuXHJcbiAgZm9yIChsZW4gPSBzdHIubGVuZ3RoOyBzdHIuY2hhckNvZGVBdChsZW4gLSAxKSA9PT0gNDg7IC0tbGVuKTtcclxuICBzdHIgPSBzdHIuc2xpY2UoaSwgbGVuKTtcclxuXHJcbiAgaWYgKHN0cikge1xyXG4gICAgbGVuIC09IGk7XHJcbiAgICB4LmUgPSBlID0gZSAtIGkgLSAxO1xyXG4gICAgeC5kID0gW107XHJcblxyXG4gICAgLy8gVHJhbnNmb3JtIGJhc2VcclxuXHJcbiAgICAvLyBlIGlzIHRoZSBiYXNlIDEwIGV4cG9uZW50LlxyXG4gICAgLy8gaSBpcyB3aGVyZSB0byBzbGljZSBzdHIgdG8gZ2V0IHRoZSBmaXJzdCB3b3JkIG9mIHRoZSBkaWdpdHMgYXJyYXkuXHJcbiAgICBpID0gKGUgKyAxKSAlIExPR19CQVNFO1xyXG4gICAgaWYgKGUgPCAwKSBpICs9IExPR19CQVNFO1xyXG5cclxuICAgIGlmIChpIDwgbGVuKSB7XHJcbiAgICAgIGlmIChpKSB4LmQucHVzaCgrc3RyLnNsaWNlKDAsIGkpKTtcclxuICAgICAgZm9yIChsZW4gLT0gTE9HX0JBU0U7IGkgPCBsZW47KSB4LmQucHVzaCgrc3RyLnNsaWNlKGksIGkgKz0gTE9HX0JBU0UpKTtcclxuICAgICAgc3RyID0gc3RyLnNsaWNlKGkpO1xyXG4gICAgICBpID0gTE9HX0JBU0UgLSBzdHIubGVuZ3RoO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgaSAtPSBsZW47XHJcbiAgICB9XHJcblxyXG4gICAgZm9yICg7IGktLTspIHN0ciArPSAnMCc7XHJcbiAgICB4LmQucHVzaCgrc3RyKTtcclxuXHJcbiAgICBpZiAoZXh0ZXJuYWwpIHtcclxuXHJcbiAgICAgIC8vIE92ZXJmbG93P1xyXG4gICAgICBpZiAoeC5lID4geC5jb25zdHJ1Y3Rvci5tYXhFKSB7XHJcblxyXG4gICAgICAgIC8vIEluZmluaXR5LlxyXG4gICAgICAgIHguZCA9IG51bGw7XHJcbiAgICAgICAgeC5lID0gTmFOO1xyXG5cclxuICAgICAgLy8gVW5kZXJmbG93P1xyXG4gICAgICB9IGVsc2UgaWYgKHguZSA8IHguY29uc3RydWN0b3IubWluRSkge1xyXG5cclxuICAgICAgICAvLyBaZXJvLlxyXG4gICAgICAgIHguZSA9IDA7XHJcbiAgICAgICAgeC5kID0gWzBdO1xyXG4gICAgICAgIC8vIHguY29uc3RydWN0b3IudW5kZXJmbG93ID0gdHJ1ZTtcclxuICAgICAgfSAvLyBlbHNlIHguY29uc3RydWN0b3IudW5kZXJmbG93ID0gZmFsc2U7XHJcbiAgICB9XHJcbiAgfSBlbHNlIHtcclxuXHJcbiAgICAvLyBaZXJvLlxyXG4gICAgeC5lID0gMDtcclxuICAgIHguZCA9IFswXTtcclxuICB9XHJcblxyXG4gIHJldHVybiB4O1xyXG59XHJcblxyXG5cclxuLypcclxuICogUGFyc2UgdGhlIHZhbHVlIG9mIGEgbmV3IERlY2ltYWwgYHhgIGZyb20gYSBzdHJpbmcgYHN0cmAsIHdoaWNoIGlzIG5vdCBhIGRlY2ltYWwgdmFsdWUuXHJcbiAqL1xyXG5mdW5jdGlvbiBwYXJzZU90aGVyKHgsIHN0cikge1xyXG4gIHZhciBiYXNlLCBDdG9yLCBkaXZpc29yLCBpLCBpc0Zsb2F0LCBsZW4sIHAsIHhkLCB4ZTtcclxuXHJcbiAgaWYgKHN0ci5pbmRleE9mKCdfJykgPiAtMSkge1xyXG4gICAgc3RyID0gc3RyLnJlcGxhY2UoLyhcXGQpXyg/PVxcZCkvZywgJyQxJyk7XHJcbiAgICBpZiAoaXNEZWNpbWFsLnRlc3Qoc3RyKSkgcmV0dXJuIHBhcnNlRGVjaW1hbCh4LCBzdHIpO1xyXG4gIH0gZWxzZSBpZiAoc3RyID09PSAnSW5maW5pdHknIHx8IHN0ciA9PT0gJ05hTicpIHtcclxuICAgIGlmICghK3N0cikgeC5zID0gTmFOO1xyXG4gICAgeC5lID0gTmFOO1xyXG4gICAgeC5kID0gbnVsbDtcclxuICAgIHJldHVybiB4O1xyXG4gIH1cclxuXHJcbiAgaWYgKGlzSGV4LnRlc3Qoc3RyKSkgIHtcclxuICAgIGJhc2UgPSAxNjtcclxuICAgIHN0ciA9IHN0ci50b0xvd2VyQ2FzZSgpO1xyXG4gIH0gZWxzZSBpZiAoaXNCaW5hcnkudGVzdChzdHIpKSAge1xyXG4gICAgYmFzZSA9IDI7XHJcbiAgfSBlbHNlIGlmIChpc09jdGFsLnRlc3Qoc3RyKSkgIHtcclxuICAgIGJhc2UgPSA4O1xyXG4gIH0gZWxzZSB7XHJcbiAgICB0aHJvdyBFcnJvcihpbnZhbGlkQXJndW1lbnQgKyBzdHIpO1xyXG4gIH1cclxuXHJcbiAgLy8gSXMgdGhlcmUgYSBiaW5hcnkgZXhwb25lbnQgcGFydD9cclxuICBpID0gc3RyLnNlYXJjaCgvcC9pKTtcclxuXHJcbiAgaWYgKGkgPiAwKSB7XHJcbiAgICBwID0gK3N0ci5zbGljZShpICsgMSk7XHJcbiAgICBzdHIgPSBzdHIuc3Vic3RyaW5nKDIsIGkpO1xyXG4gIH0gZWxzZSB7XHJcbiAgICBzdHIgPSBzdHIuc2xpY2UoMik7XHJcbiAgfVxyXG5cclxuICAvLyBDb252ZXJ0IGBzdHJgIGFzIGFuIGludGVnZXIgdGhlbiBkaXZpZGUgdGhlIHJlc3VsdCBieSBgYmFzZWAgcmFpc2VkIHRvIGEgcG93ZXIgc3VjaCB0aGF0IHRoZVxyXG4gIC8vIGZyYWN0aW9uIHBhcnQgd2lsbCBiZSByZXN0b3JlZC5cclxuICBpID0gc3RyLmluZGV4T2YoJy4nKTtcclxuICBpc0Zsb2F0ID0gaSA+PSAwO1xyXG4gIEN0b3IgPSB4LmNvbnN0cnVjdG9yO1xyXG5cclxuICBpZiAoaXNGbG9hdCkge1xyXG4gICAgc3RyID0gc3RyLnJlcGxhY2UoJy4nLCAnJyk7XHJcbiAgICBsZW4gPSBzdHIubGVuZ3RoO1xyXG4gICAgaSA9IGxlbiAtIGk7XHJcblxyXG4gICAgLy8gbG9nWzEwXSgxNikgPSAxLjIwNDEuLi4gLCBsb2dbMTBdKDg4KSA9IDEuOTQ0NC4uLi5cclxuICAgIGRpdmlzb3IgPSBpbnRQb3coQ3RvciwgbmV3IEN0b3IoYmFzZSksIGksIGkgKiAyKTtcclxuICB9XHJcblxyXG4gIHhkID0gY29udmVydEJhc2Uoc3RyLCBiYXNlLCBCQVNFKTtcclxuICB4ZSA9IHhkLmxlbmd0aCAtIDE7XHJcblxyXG4gIC8vIFJlbW92ZSB0cmFpbGluZyB6ZXJvcy5cclxuICBmb3IgKGkgPSB4ZTsgeGRbaV0gPT09IDA7IC0taSkgeGQucG9wKCk7XHJcbiAgaWYgKGkgPCAwKSByZXR1cm4gbmV3IEN0b3IoeC5zICogMCk7XHJcbiAgeC5lID0gZ2V0QmFzZTEwRXhwb25lbnQoeGQsIHhlKTtcclxuICB4LmQgPSB4ZDtcclxuICBleHRlcm5hbCA9IGZhbHNlO1xyXG5cclxuICAvLyBBdCB3aGF0IHByZWNpc2lvbiB0byBwZXJmb3JtIHRoZSBkaXZpc2lvbiB0byBlbnN1cmUgZXhhY3QgY29udmVyc2lvbj9cclxuICAvLyBtYXhEZWNpbWFsSW50ZWdlclBhcnREaWdpdENvdW50ID0gY2VpbChsb2dbMTBdKGIpICogb3RoZXJCYXNlSW50ZWdlclBhcnREaWdpdENvdW50KVxyXG4gIC8vIGxvZ1sxMF0oMikgPSAwLjMwMTAzLCBsb2dbMTBdKDgpID0gMC45MDMwOSwgbG9nWzEwXSgxNikgPSAxLjIwNDEyXHJcbiAgLy8gRS5nLiBjZWlsKDEuMiAqIDMpID0gNCwgc28gdXAgdG8gNCBkZWNpbWFsIGRpZ2l0cyBhcmUgbmVlZGVkIHRvIHJlcHJlc2VudCAzIGhleCBpbnQgZGlnaXRzLlxyXG4gIC8vIG1heERlY2ltYWxGcmFjdGlvblBhcnREaWdpdENvdW50ID0ge0hleDo0fE9jdDozfEJpbjoxfSAqIG90aGVyQmFzZUZyYWN0aW9uUGFydERpZ2l0Q291bnRcclxuICAvLyBUaGVyZWZvcmUgdXNpbmcgNCAqIHRoZSBudW1iZXIgb2YgZGlnaXRzIG9mIHN0ciB3aWxsIGFsd2F5cyBiZSBlbm91Z2guXHJcbiAgaWYgKGlzRmxvYXQpIHggPSBkaXZpZGUoeCwgZGl2aXNvciwgbGVuICogNCk7XHJcblxyXG4gIC8vIE11bHRpcGx5IGJ5IHRoZSBiaW5hcnkgZXhwb25lbnQgcGFydCBpZiBwcmVzZW50LlxyXG4gIGlmIChwKSB4ID0geC50aW1lcyhNYXRoLmFicyhwKSA8IDU0ID8gbWF0aHBvdygyLCBwKSA6IERlY2ltYWwucG93KDIsIHApKTtcclxuICBleHRlcm5hbCA9IHRydWU7XHJcblxyXG4gIHJldHVybiB4O1xyXG59XHJcblxyXG5cclxuLypcclxuICogc2luKHgpID0geCAtIHheMy8zISArIHheNS81ISAtIC4uLlxyXG4gKiB8eHwgPCBwaS8yXHJcbiAqXHJcbiAqL1xyXG5mdW5jdGlvbiBzaW5lKEN0b3IsIHgpIHtcclxuICB2YXIgayxcclxuICAgIGxlbiA9IHguZC5sZW5ndGg7XHJcblxyXG4gIGlmIChsZW4gPCAzKSB7XHJcbiAgICByZXR1cm4geC5pc1plcm8oKSA/IHggOiB0YXlsb3JTZXJpZXMoQ3RvciwgMiwgeCwgeCk7XHJcbiAgfVxyXG5cclxuICAvLyBBcmd1bWVudCByZWR1Y3Rpb246IHNpbig1eCkgPSAxNipzaW5eNSh4KSAtIDIwKnNpbl4zKHgpICsgNSpzaW4oeClcclxuICAvLyBpLmUuIHNpbih4KSA9IDE2KnNpbl41KHgvNSkgLSAyMCpzaW5eMyh4LzUpICsgNSpzaW4oeC81KVxyXG4gIC8vIGFuZCAgc2luKHgpID0gc2luKHgvNSkoNSArIHNpbl4yKHgvNSkoMTZzaW5eMih4LzUpIC0gMjApKVxyXG5cclxuICAvLyBFc3RpbWF0ZSB0aGUgb3B0aW11bSBudW1iZXIgb2YgdGltZXMgdG8gdXNlIHRoZSBhcmd1bWVudCByZWR1Y3Rpb24uXHJcbiAgayA9IDEuNCAqIE1hdGguc3FydChsZW4pO1xyXG4gIGsgPSBrID4gMTYgPyAxNiA6IGsgfCAwO1xyXG5cclxuICB4ID0geC50aW1lcygxIC8gdGlueVBvdyg1LCBrKSk7XHJcbiAgeCA9IHRheWxvclNlcmllcyhDdG9yLCAyLCB4LCB4KTtcclxuXHJcbiAgLy8gUmV2ZXJzZSBhcmd1bWVudCByZWR1Y3Rpb25cclxuICB2YXIgc2luMl94LFxyXG4gICAgZDUgPSBuZXcgQ3Rvcig1KSxcclxuICAgIGQxNiA9IG5ldyBDdG9yKDE2KSxcclxuICAgIGQyMCA9IG5ldyBDdG9yKDIwKTtcclxuICBmb3IgKDsgay0tOykge1xyXG4gICAgc2luMl94ID0geC50aW1lcyh4KTtcclxuICAgIHggPSB4LnRpbWVzKGQ1LnBsdXMoc2luMl94LnRpbWVzKGQxNi50aW1lcyhzaW4yX3gpLm1pbnVzKGQyMCkpKSk7XHJcbiAgfVxyXG5cclxuICByZXR1cm4geDtcclxufVxyXG5cclxuXHJcbi8vIENhbGN1bGF0ZSBUYXlsb3Igc2VyaWVzIGZvciBgY29zYCwgYGNvc2hgLCBgc2luYCBhbmQgYHNpbmhgLlxyXG5mdW5jdGlvbiB0YXlsb3JTZXJpZXMoQ3RvciwgbiwgeCwgeSwgaXNIeXBlcmJvbGljKSB7XHJcbiAgdmFyIGosIHQsIHUsIHgyLFxyXG4gICAgaSA9IDEsXHJcbiAgICBwciA9IEN0b3IucHJlY2lzaW9uLFxyXG4gICAgayA9IE1hdGguY2VpbChwciAvIExPR19CQVNFKTtcclxuXHJcbiAgZXh0ZXJuYWwgPSBmYWxzZTtcclxuICB4MiA9IHgudGltZXMoeCk7XHJcbiAgdSA9IG5ldyBDdG9yKHkpO1xyXG5cclxuICBmb3IgKDs7KSB7XHJcbiAgICB0ID0gZGl2aWRlKHUudGltZXMoeDIpLCBuZXcgQ3RvcihuKysgKiBuKyspLCBwciwgMSk7XHJcbiAgICB1ID0gaXNIeXBlcmJvbGljID8geS5wbHVzKHQpIDogeS5taW51cyh0KTtcclxuICAgIHkgPSBkaXZpZGUodC50aW1lcyh4MiksIG5ldyBDdG9yKG4rKyAqIG4rKyksIHByLCAxKTtcclxuICAgIHQgPSB1LnBsdXMoeSk7XHJcblxyXG4gICAgaWYgKHQuZFtrXSAhPT0gdm9pZCAwKSB7XHJcbiAgICAgIGZvciAoaiA9IGs7IHQuZFtqXSA9PT0gdS5kW2pdICYmIGotLTspO1xyXG4gICAgICBpZiAoaiA9PSAtMSkgYnJlYWs7XHJcbiAgICB9XHJcblxyXG4gICAgaiA9IHU7XHJcbiAgICB1ID0geTtcclxuICAgIHkgPSB0O1xyXG4gICAgdCA9IGo7XHJcbiAgICBpKys7XHJcbiAgfVxyXG5cclxuICBleHRlcm5hbCA9IHRydWU7XHJcbiAgdC5kLmxlbmd0aCA9IGsgKyAxO1xyXG5cclxuICByZXR1cm4gdDtcclxufVxyXG5cclxuXHJcbi8vIEV4cG9uZW50IGUgbXVzdCBiZSBwb3NpdGl2ZSBhbmQgbm9uLXplcm8uXHJcbmZ1bmN0aW9uIHRpbnlQb3coYiwgZSkge1xyXG4gIHZhciBuID0gYjtcclxuICB3aGlsZSAoLS1lKSBuICo9IGI7XHJcbiAgcmV0dXJuIG47XHJcbn1cclxuXHJcblxyXG4vLyBSZXR1cm4gdGhlIGFic29sdXRlIHZhbHVlIG9mIGB4YCByZWR1Y2VkIHRvIGxlc3MgdGhhbiBvciBlcXVhbCB0byBoYWxmIHBpLlxyXG5mdW5jdGlvbiB0b0xlc3NUaGFuSGFsZlBpKEN0b3IsIHgpIHtcclxuICB2YXIgdCxcclxuICAgIGlzTmVnID0geC5zIDwgMCxcclxuICAgIHBpID0gZ2V0UGkoQ3RvciwgQ3Rvci5wcmVjaXNpb24sIDEpLFxyXG4gICAgaGFsZlBpID0gcGkudGltZXMoMC41KTtcclxuXHJcbiAgeCA9IHguYWJzKCk7XHJcblxyXG4gIGlmICh4Lmx0ZShoYWxmUGkpKSB7XHJcbiAgICBxdWFkcmFudCA9IGlzTmVnID8gNCA6IDE7XHJcbiAgICByZXR1cm4geDtcclxuICB9XHJcblxyXG4gIHQgPSB4LmRpdlRvSW50KHBpKTtcclxuXHJcbiAgaWYgKHQuaXNaZXJvKCkpIHtcclxuICAgIHF1YWRyYW50ID0gaXNOZWcgPyAzIDogMjtcclxuICB9IGVsc2Uge1xyXG4gICAgeCA9IHgubWludXModC50aW1lcyhwaSkpO1xyXG5cclxuICAgIC8vIDAgPD0geCA8IHBpXHJcbiAgICBpZiAoeC5sdGUoaGFsZlBpKSkge1xyXG4gICAgICBxdWFkcmFudCA9IGlzT2RkKHQpID8gKGlzTmVnID8gMiA6IDMpIDogKGlzTmVnID8gNCA6IDEpO1xyXG4gICAgICByZXR1cm4geDtcclxuICAgIH1cclxuXHJcbiAgICBxdWFkcmFudCA9IGlzT2RkKHQpID8gKGlzTmVnID8gMSA6IDQpIDogKGlzTmVnID8gMyA6IDIpO1xyXG4gIH1cclxuXHJcbiAgcmV0dXJuIHgubWludXMocGkpLmFicygpO1xyXG59XHJcblxyXG5cclxuLypcclxuICogUmV0dXJuIHRoZSB2YWx1ZSBvZiBEZWNpbWFsIGB4YCBhcyBhIHN0cmluZyBpbiBiYXNlIGBiYXNlT3V0YC5cclxuICpcclxuICogSWYgdGhlIG9wdGlvbmFsIGBzZGAgYXJndW1lbnQgaXMgcHJlc2VudCBpbmNsdWRlIGEgYmluYXJ5IGV4cG9uZW50IHN1ZmZpeC5cclxuICovXHJcbmZ1bmN0aW9uIHRvU3RyaW5nQmluYXJ5KHgsIGJhc2VPdXQsIHNkLCBybSkge1xyXG4gIHZhciBiYXNlLCBlLCBpLCBrLCBsZW4sIHJvdW5kVXAsIHN0ciwgeGQsIHksXHJcbiAgICBDdG9yID0geC5jb25zdHJ1Y3RvcixcclxuICAgIGlzRXhwID0gc2QgIT09IHZvaWQgMDtcclxuXHJcbiAgaWYgKGlzRXhwKSB7XHJcbiAgICBjaGVja0ludDMyKHNkLCAxLCBNQVhfRElHSVRTKTtcclxuICAgIGlmIChybSA9PT0gdm9pZCAwKSBybSA9IEN0b3Iucm91bmRpbmc7XHJcbiAgICBlbHNlIGNoZWNrSW50MzIocm0sIDAsIDgpO1xyXG4gIH0gZWxzZSB7XHJcbiAgICBzZCA9IEN0b3IucHJlY2lzaW9uO1xyXG4gICAgcm0gPSBDdG9yLnJvdW5kaW5nO1xyXG4gIH1cclxuXHJcbiAgaWYgKCF4LmlzRmluaXRlKCkpIHtcclxuICAgIHN0ciA9IG5vbkZpbml0ZVRvU3RyaW5nKHgpO1xyXG4gIH0gZWxzZSB7XHJcbiAgICBzdHIgPSBmaW5pdGVUb1N0cmluZyh4KTtcclxuICAgIGkgPSBzdHIuaW5kZXhPZignLicpO1xyXG5cclxuICAgIC8vIFVzZSBleHBvbmVudGlhbCBub3RhdGlvbiBhY2NvcmRpbmcgdG8gYHRvRXhwUG9zYCBhbmQgYHRvRXhwTmVnYD8gTm8sIGJ1dCBpZiByZXF1aXJlZDpcclxuICAgIC8vIG1heEJpbmFyeUV4cG9uZW50ID0gZmxvb3IoKGRlY2ltYWxFeHBvbmVudCArIDEpICogbG9nWzJdKDEwKSlcclxuICAgIC8vIG1pbkJpbmFyeUV4cG9uZW50ID0gZmxvb3IoZGVjaW1hbEV4cG9uZW50ICogbG9nWzJdKDEwKSlcclxuICAgIC8vIGxvZ1syXSgxMCkgPSAzLjMyMTkyODA5NDg4NzM2MjM0Nzg3MDMxOTQyOTQ4OTM5MDE3NTg2NFxyXG5cclxuICAgIGlmIChpc0V4cCkge1xyXG4gICAgICBiYXNlID0gMjtcclxuICAgICAgaWYgKGJhc2VPdXQgPT0gMTYpIHtcclxuICAgICAgICBzZCA9IHNkICogNCAtIDM7XHJcbiAgICAgIH0gZWxzZSBpZiAoYmFzZU91dCA9PSA4KSB7XHJcbiAgICAgICAgc2QgPSBzZCAqIDMgLSAyO1xyXG4gICAgICB9XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICBiYXNlID0gYmFzZU91dDtcclxuICAgIH1cclxuXHJcbiAgICAvLyBDb252ZXJ0IHRoZSBudW1iZXIgYXMgYW4gaW50ZWdlciB0aGVuIGRpdmlkZSB0aGUgcmVzdWx0IGJ5IGl0cyBiYXNlIHJhaXNlZCB0byBhIHBvd2VyIHN1Y2hcclxuICAgIC8vIHRoYXQgdGhlIGZyYWN0aW9uIHBhcnQgd2lsbCBiZSByZXN0b3JlZC5cclxuXHJcbiAgICAvLyBOb24taW50ZWdlci5cclxuICAgIGlmIChpID49IDApIHtcclxuICAgICAgc3RyID0gc3RyLnJlcGxhY2UoJy4nLCAnJyk7XHJcbiAgICAgIHkgPSBuZXcgQ3RvcigxKTtcclxuICAgICAgeS5lID0gc3RyLmxlbmd0aCAtIGk7XHJcbiAgICAgIHkuZCA9IGNvbnZlcnRCYXNlKGZpbml0ZVRvU3RyaW5nKHkpLCAxMCwgYmFzZSk7XHJcbiAgICAgIHkuZSA9IHkuZC5sZW5ndGg7XHJcbiAgICB9XHJcblxyXG4gICAgeGQgPSBjb252ZXJ0QmFzZShzdHIsIDEwLCBiYXNlKTtcclxuICAgIGUgPSBsZW4gPSB4ZC5sZW5ndGg7XHJcblxyXG4gICAgLy8gUmVtb3ZlIHRyYWlsaW5nIHplcm9zLlxyXG4gICAgZm9yICg7IHhkWy0tbGVuXSA9PSAwOykgeGQucG9wKCk7XHJcblxyXG4gICAgaWYgKCF4ZFswXSkge1xyXG4gICAgICBzdHIgPSBpc0V4cCA/ICcwcCswJyA6ICcwJztcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIGlmIChpIDwgMCkge1xyXG4gICAgICAgIGUtLTtcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICB4ID0gbmV3IEN0b3IoeCk7XHJcbiAgICAgICAgeC5kID0geGQ7XHJcbiAgICAgICAgeC5lID0gZTtcclxuICAgICAgICB4ID0gZGl2aWRlKHgsIHksIHNkLCBybSwgMCwgYmFzZSk7XHJcbiAgICAgICAgeGQgPSB4LmQ7XHJcbiAgICAgICAgZSA9IHguZTtcclxuICAgICAgICByb3VuZFVwID0gaW5leGFjdDtcclxuICAgICAgfVxyXG5cclxuICAgICAgLy8gVGhlIHJvdW5kaW5nIGRpZ2l0LCBpLmUuIHRoZSBkaWdpdCBhZnRlciB0aGUgZGlnaXQgdGhhdCBtYXkgYmUgcm91bmRlZCB1cC5cclxuICAgICAgaSA9IHhkW3NkXTtcclxuICAgICAgayA9IGJhc2UgLyAyO1xyXG4gICAgICByb3VuZFVwID0gcm91bmRVcCB8fCB4ZFtzZCArIDFdICE9PSB2b2lkIDA7XHJcblxyXG4gICAgICByb3VuZFVwID0gcm0gPCA0XHJcbiAgICAgICAgPyAoaSAhPT0gdm9pZCAwIHx8IHJvdW5kVXApICYmIChybSA9PT0gMCB8fCBybSA9PT0gKHgucyA8IDAgPyAzIDogMikpXHJcbiAgICAgICAgOiBpID4gayB8fCBpID09PSBrICYmIChybSA9PT0gNCB8fCByb3VuZFVwIHx8IHJtID09PSA2ICYmIHhkW3NkIC0gMV0gJiAxIHx8XHJcbiAgICAgICAgICBybSA9PT0gKHgucyA8IDAgPyA4IDogNykpO1xyXG5cclxuICAgICAgeGQubGVuZ3RoID0gc2Q7XHJcblxyXG4gICAgICBpZiAocm91bmRVcCkge1xyXG5cclxuICAgICAgICAvLyBSb3VuZGluZyB1cCBtYXkgbWVhbiB0aGUgcHJldmlvdXMgZGlnaXQgaGFzIHRvIGJlIHJvdW5kZWQgdXAgYW5kIHNvIG9uLlxyXG4gICAgICAgIGZvciAoOyArK3hkWy0tc2RdID4gYmFzZSAtIDE7KSB7XHJcbiAgICAgICAgICB4ZFtzZF0gPSAwO1xyXG4gICAgICAgICAgaWYgKCFzZCkge1xyXG4gICAgICAgICAgICArK2U7XHJcbiAgICAgICAgICAgIHhkLnVuc2hpZnQoMSk7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcblxyXG4gICAgICAvLyBEZXRlcm1pbmUgdHJhaWxpbmcgemVyb3MuXHJcbiAgICAgIGZvciAobGVuID0geGQubGVuZ3RoOyAheGRbbGVuIC0gMV07IC0tbGVuKTtcclxuXHJcbiAgICAgIC8vIEUuZy4gWzQsIDExLCAxNV0gYmVjb21lcyA0YmYuXHJcbiAgICAgIGZvciAoaSA9IDAsIHN0ciA9ICcnOyBpIDwgbGVuOyBpKyspIHN0ciArPSBOVU1FUkFMUy5jaGFyQXQoeGRbaV0pO1xyXG5cclxuICAgICAgLy8gQWRkIGJpbmFyeSBleHBvbmVudCBzdWZmaXg/XHJcbiAgICAgIGlmIChpc0V4cCkge1xyXG4gICAgICAgIGlmIChsZW4gPiAxKSB7XHJcbiAgICAgICAgICBpZiAoYmFzZU91dCA9PSAxNiB8fCBiYXNlT3V0ID09IDgpIHtcclxuICAgICAgICAgICAgaSA9IGJhc2VPdXQgPT0gMTYgPyA0IDogMztcclxuICAgICAgICAgICAgZm9yICgtLWxlbjsgbGVuICUgaTsgbGVuKyspIHN0ciArPSAnMCc7XHJcbiAgICAgICAgICAgIHhkID0gY29udmVydEJhc2Uoc3RyLCBiYXNlLCBiYXNlT3V0KTtcclxuICAgICAgICAgICAgZm9yIChsZW4gPSB4ZC5sZW5ndGg7ICF4ZFtsZW4gLSAxXTsgLS1sZW4pO1xyXG5cclxuICAgICAgICAgICAgLy8geGRbMF0gd2lsbCBhbHdheXMgYmUgYmUgMVxyXG4gICAgICAgICAgICBmb3IgKGkgPSAxLCBzdHIgPSAnMS4nOyBpIDwgbGVuOyBpKyspIHN0ciArPSBOVU1FUkFMUy5jaGFyQXQoeGRbaV0pO1xyXG4gICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgc3RyID0gc3RyLmNoYXJBdCgwKSArICcuJyArIHN0ci5zbGljZSgxKTtcclxuICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHN0ciA9ICBzdHIgKyAoZSA8IDAgPyAncCcgOiAncCsnKSArIGU7XHJcbiAgICAgIH0gZWxzZSBpZiAoZSA8IDApIHtcclxuICAgICAgICBmb3IgKDsgKytlOykgc3RyID0gJzAnICsgc3RyO1xyXG4gICAgICAgIHN0ciA9ICcwLicgKyBzdHI7XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgaWYgKCsrZSA+IGxlbikgZm9yIChlIC09IGxlbjsgZS0tIDspIHN0ciArPSAnMCc7XHJcbiAgICAgICAgZWxzZSBpZiAoZSA8IGxlbikgc3RyID0gc3RyLnNsaWNlKDAsIGUpICsgJy4nICsgc3RyLnNsaWNlKGUpO1xyXG4gICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgc3RyID0gKGJhc2VPdXQgPT0gMTYgPyAnMHgnIDogYmFzZU91dCA9PSAyID8gJzBiJyA6IGJhc2VPdXQgPT0gOCA/ICcwbycgOiAnJykgKyBzdHI7XHJcbiAgfVxyXG5cclxuICByZXR1cm4geC5zIDwgMCA/ICctJyArIHN0ciA6IHN0cjtcclxufVxyXG5cclxuXHJcbi8vIERvZXMgbm90IHN0cmlwIHRyYWlsaW5nIHplcm9zLlxyXG5mdW5jdGlvbiB0cnVuY2F0ZShhcnIsIGxlbikge1xyXG4gIGlmIChhcnIubGVuZ3RoID4gbGVuKSB7XHJcbiAgICBhcnIubGVuZ3RoID0gbGVuO1xyXG4gICAgcmV0dXJuIHRydWU7XHJcbiAgfVxyXG59XHJcblxyXG5cclxuLy8gRGVjaW1hbCBtZXRob2RzXHJcblxyXG5cclxuLypcclxuICogIGFic1xyXG4gKiAgYWNvc1xyXG4gKiAgYWNvc2hcclxuICogIGFkZFxyXG4gKiAgYXNpblxyXG4gKiAgYXNpbmhcclxuICogIGF0YW5cclxuICogIGF0YW5oXHJcbiAqICBhdGFuMlxyXG4gKiAgY2JydFxyXG4gKiAgY2VpbFxyXG4gKiAgY2xhbXBcclxuICogIGNsb25lXHJcbiAqICBjb25maWdcclxuICogIGNvc1xyXG4gKiAgY29zaFxyXG4gKiAgZGl2XHJcbiAqICBleHBcclxuICogIGZsb29yXHJcbiAqICBoeXBvdFxyXG4gKiAgbG5cclxuICogIGxvZ1xyXG4gKiAgbG9nMlxyXG4gKiAgbG9nMTBcclxuICogIG1heFxyXG4gKiAgbWluXHJcbiAqICBtb2RcclxuICogIG11bFxyXG4gKiAgcG93XHJcbiAqICByYW5kb21cclxuICogIHJvdW5kXHJcbiAqICBzZXRcclxuICogIHNpZ25cclxuICogIHNpblxyXG4gKiAgc2luaFxyXG4gKiAgc3FydFxyXG4gKiAgc3ViXHJcbiAqICBzdW1cclxuICogIHRhblxyXG4gKiAgdGFuaFxyXG4gKiAgdHJ1bmNcclxuICovXHJcblxyXG5cclxuLypcclxuICogUmV0dXJuIGEgbmV3IERlY2ltYWwgd2hvc2UgdmFsdWUgaXMgdGhlIGFic29sdXRlIHZhbHVlIG9mIGB4YC5cclxuICpcclxuICogeCB7bnVtYmVyfHN0cmluZ3xEZWNpbWFsfVxyXG4gKlxyXG4gKi9cclxuZnVuY3Rpb24gYWJzKHgpIHtcclxuICByZXR1cm4gbmV3IHRoaXMoeCkuYWJzKCk7XHJcbn1cclxuXHJcblxyXG4vKlxyXG4gKiBSZXR1cm4gYSBuZXcgRGVjaW1hbCB3aG9zZSB2YWx1ZSBpcyB0aGUgYXJjY29zaW5lIGluIHJhZGlhbnMgb2YgYHhgLlxyXG4gKlxyXG4gKiB4IHtudW1iZXJ8c3RyaW5nfERlY2ltYWx9XHJcbiAqXHJcbiAqL1xyXG5mdW5jdGlvbiBhY29zKHgpIHtcclxuICByZXR1cm4gbmV3IHRoaXMoeCkuYWNvcygpO1xyXG59XHJcblxyXG5cclxuLypcclxuICogUmV0dXJuIGEgbmV3IERlY2ltYWwgd2hvc2UgdmFsdWUgaXMgdGhlIGludmVyc2Ugb2YgdGhlIGh5cGVyYm9saWMgY29zaW5lIG9mIGB4YCwgcm91bmRlZCB0b1xyXG4gKiBgcHJlY2lzaW9uYCBzaWduaWZpY2FudCBkaWdpdHMgdXNpbmcgcm91bmRpbmcgbW9kZSBgcm91bmRpbmdgLlxyXG4gKlxyXG4gKiB4IHtudW1iZXJ8c3RyaW5nfERlY2ltYWx9IEEgdmFsdWUgaW4gcmFkaWFucy5cclxuICpcclxuICovXHJcbmZ1bmN0aW9uIGFjb3NoKHgpIHtcclxuICByZXR1cm4gbmV3IHRoaXMoeCkuYWNvc2goKTtcclxufVxyXG5cclxuXHJcbi8qXHJcbiAqIFJldHVybiBhIG5ldyBEZWNpbWFsIHdob3NlIHZhbHVlIGlzIHRoZSBzdW0gb2YgYHhgIGFuZCBgeWAsIHJvdW5kZWQgdG8gYHByZWNpc2lvbmAgc2lnbmlmaWNhbnRcclxuICogZGlnaXRzIHVzaW5nIHJvdW5kaW5nIG1vZGUgYHJvdW5kaW5nYC5cclxuICpcclxuICogeCB7bnVtYmVyfHN0cmluZ3xEZWNpbWFsfVxyXG4gKiB5IHtudW1iZXJ8c3RyaW5nfERlY2ltYWx9XHJcbiAqXHJcbiAqL1xyXG5mdW5jdGlvbiBhZGQoeCwgeSkge1xyXG4gIHJldHVybiBuZXcgdGhpcyh4KS5wbHVzKHkpO1xyXG59XHJcblxyXG5cclxuLypcclxuICogUmV0dXJuIGEgbmV3IERlY2ltYWwgd2hvc2UgdmFsdWUgaXMgdGhlIGFyY3NpbmUgaW4gcmFkaWFucyBvZiBgeGAsIHJvdW5kZWQgdG8gYHByZWNpc2lvbmBcclxuICogc2lnbmlmaWNhbnQgZGlnaXRzIHVzaW5nIHJvdW5kaW5nIG1vZGUgYHJvdW5kaW5nYC5cclxuICpcclxuICogeCB7bnVtYmVyfHN0cmluZ3xEZWNpbWFsfVxyXG4gKlxyXG4gKi9cclxuZnVuY3Rpb24gYXNpbih4KSB7XHJcbiAgcmV0dXJuIG5ldyB0aGlzKHgpLmFzaW4oKTtcclxufVxyXG5cclxuXHJcbi8qXHJcbiAqIFJldHVybiBhIG5ldyBEZWNpbWFsIHdob3NlIHZhbHVlIGlzIHRoZSBpbnZlcnNlIG9mIHRoZSBoeXBlcmJvbGljIHNpbmUgb2YgYHhgLCByb3VuZGVkIHRvXHJcbiAqIGBwcmVjaXNpb25gIHNpZ25pZmljYW50IGRpZ2l0cyB1c2luZyByb3VuZGluZyBtb2RlIGByb3VuZGluZ2AuXHJcbiAqXHJcbiAqIHgge251bWJlcnxzdHJpbmd8RGVjaW1hbH0gQSB2YWx1ZSBpbiByYWRpYW5zLlxyXG4gKlxyXG4gKi9cclxuZnVuY3Rpb24gYXNpbmgoeCkge1xyXG4gIHJldHVybiBuZXcgdGhpcyh4KS5hc2luaCgpO1xyXG59XHJcblxyXG5cclxuLypcclxuICogUmV0dXJuIGEgbmV3IERlY2ltYWwgd2hvc2UgdmFsdWUgaXMgdGhlIGFyY3RhbmdlbnQgaW4gcmFkaWFucyBvZiBgeGAsIHJvdW5kZWQgdG8gYHByZWNpc2lvbmBcclxuICogc2lnbmlmaWNhbnQgZGlnaXRzIHVzaW5nIHJvdW5kaW5nIG1vZGUgYHJvdW5kaW5nYC5cclxuICpcclxuICogeCB7bnVtYmVyfHN0cmluZ3xEZWNpbWFsfVxyXG4gKlxyXG4gKi9cclxuZnVuY3Rpb24gYXRhbih4KSB7XHJcbiAgcmV0dXJuIG5ldyB0aGlzKHgpLmF0YW4oKTtcclxufVxyXG5cclxuXHJcbi8qXHJcbiAqIFJldHVybiBhIG5ldyBEZWNpbWFsIHdob3NlIHZhbHVlIGlzIHRoZSBpbnZlcnNlIG9mIHRoZSBoeXBlcmJvbGljIHRhbmdlbnQgb2YgYHhgLCByb3VuZGVkIHRvXHJcbiAqIGBwcmVjaXNpb25gIHNpZ25pZmljYW50IGRpZ2l0cyB1c2luZyByb3VuZGluZyBtb2RlIGByb3VuZGluZ2AuXHJcbiAqXHJcbiAqIHgge251bWJlcnxzdHJpbmd8RGVjaW1hbH0gQSB2YWx1ZSBpbiByYWRpYW5zLlxyXG4gKlxyXG4gKi9cclxuZnVuY3Rpb24gYXRhbmgoeCkge1xyXG4gIHJldHVybiBuZXcgdGhpcyh4KS5hdGFuaCgpO1xyXG59XHJcblxyXG5cclxuLypcclxuICogUmV0dXJuIGEgbmV3IERlY2ltYWwgd2hvc2UgdmFsdWUgaXMgdGhlIGFyY3RhbmdlbnQgaW4gcmFkaWFucyBvZiBgeS94YCBpbiB0aGUgcmFuZ2UgLXBpIHRvIHBpXHJcbiAqIChpbmNsdXNpdmUpLCByb3VuZGVkIHRvIGBwcmVjaXNpb25gIHNpZ25pZmljYW50IGRpZ2l0cyB1c2luZyByb3VuZGluZyBtb2RlIGByb3VuZGluZ2AuXHJcbiAqXHJcbiAqIERvbWFpbjogWy1JbmZpbml0eSwgSW5maW5pdHldXHJcbiAqIFJhbmdlOiBbLXBpLCBwaV1cclxuICpcclxuICogeSB7bnVtYmVyfHN0cmluZ3xEZWNpbWFsfSBUaGUgeS1jb29yZGluYXRlLlxyXG4gKiB4IHtudW1iZXJ8c3RyaW5nfERlY2ltYWx9IFRoZSB4LWNvb3JkaW5hdGUuXHJcbiAqXHJcbiAqIGF0YW4yKFx1MDBCMTAsIC0wKSAgICAgICAgICAgICAgID0gXHUwMEIxcGlcclxuICogYXRhbjIoXHUwMEIxMCwgKzApICAgICAgICAgICAgICAgPSBcdTAwQjEwXHJcbiAqIGF0YW4yKFx1MDBCMTAsIC14KSAgICAgICAgICAgICAgID0gXHUwMEIxcGkgZm9yIHggPiAwXHJcbiAqIGF0YW4yKFx1MDBCMTAsIHgpICAgICAgICAgICAgICAgID0gXHUwMEIxMCBmb3IgeCA+IDBcclxuICogYXRhbjIoLXksIFx1MDBCMTApICAgICAgICAgICAgICAgPSAtcGkvMiBmb3IgeSA+IDBcclxuICogYXRhbjIoeSwgXHUwMEIxMCkgICAgICAgICAgICAgICAgPSBwaS8yIGZvciB5ID4gMFxyXG4gKiBhdGFuMihcdTAwQjF5LCAtSW5maW5pdHkpICAgICAgICA9IFx1MDBCMXBpIGZvciBmaW5pdGUgeSA+IDBcclxuICogYXRhbjIoXHUwMEIxeSwgK0luZmluaXR5KSAgICAgICAgPSBcdTAwQjEwIGZvciBmaW5pdGUgeSA+IDBcclxuICogYXRhbjIoXHUwMEIxSW5maW5pdHksIHgpICAgICAgICAgPSBcdTAwQjFwaS8yIGZvciBmaW5pdGUgeFxyXG4gKiBhdGFuMihcdTAwQjFJbmZpbml0eSwgLUluZmluaXR5KSA9IFx1MDBCMTMqcGkvNFxyXG4gKiBhdGFuMihcdTAwQjFJbmZpbml0eSwgK0luZmluaXR5KSA9IFx1MDBCMXBpLzRcclxuICogYXRhbjIoTmFOLCB4KSA9IE5hTlxyXG4gKiBhdGFuMih5LCBOYU4pID0gTmFOXHJcbiAqXHJcbiAqL1xyXG5mdW5jdGlvbiBhdGFuMih5LCB4KSB7XHJcbiAgeSA9IG5ldyB0aGlzKHkpO1xyXG4gIHggPSBuZXcgdGhpcyh4KTtcclxuICB2YXIgcixcclxuICAgIHByID0gdGhpcy5wcmVjaXNpb24sXHJcbiAgICBybSA9IHRoaXMucm91bmRpbmcsXHJcbiAgICB3cHIgPSBwciArIDQ7XHJcblxyXG4gIC8vIEVpdGhlciBOYU5cclxuICBpZiAoIXkucyB8fCAheC5zKSB7XHJcbiAgICByID0gbmV3IHRoaXMoTmFOKTtcclxuXHJcbiAgLy8gQm90aCBcdTAwQjFJbmZpbml0eVxyXG4gIH0gZWxzZSBpZiAoIXkuZCAmJiAheC5kKSB7XHJcbiAgICByID0gZ2V0UGkodGhpcywgd3ByLCAxKS50aW1lcyh4LnMgPiAwID8gMC4yNSA6IDAuNzUpO1xyXG4gICAgci5zID0geS5zO1xyXG5cclxuICAvLyB4IGlzIFx1MDBCMUluZmluaXR5IG9yIHkgaXMgXHUwMEIxMFxyXG4gIH0gZWxzZSBpZiAoIXguZCB8fCB5LmlzWmVybygpKSB7XHJcbiAgICByID0geC5zIDwgMCA/IGdldFBpKHRoaXMsIHByLCBybSkgOiBuZXcgdGhpcygwKTtcclxuICAgIHIucyA9IHkucztcclxuXHJcbiAgLy8geSBpcyBcdTAwQjFJbmZpbml0eSBvciB4IGlzIFx1MDBCMTBcclxuICB9IGVsc2UgaWYgKCF5LmQgfHwgeC5pc1plcm8oKSkge1xyXG4gICAgciA9IGdldFBpKHRoaXMsIHdwciwgMSkudGltZXMoMC41KTtcclxuICAgIHIucyA9IHkucztcclxuXHJcbiAgLy8gQm90aCBub24temVybyBhbmQgZmluaXRlXHJcbiAgfSBlbHNlIGlmICh4LnMgPCAwKSB7XHJcbiAgICB0aGlzLnByZWNpc2lvbiA9IHdwcjtcclxuICAgIHRoaXMucm91bmRpbmcgPSAxO1xyXG4gICAgciA9IHRoaXMuYXRhbihkaXZpZGUoeSwgeCwgd3ByLCAxKSk7XHJcbiAgICB4ID0gZ2V0UGkodGhpcywgd3ByLCAxKTtcclxuICAgIHRoaXMucHJlY2lzaW9uID0gcHI7XHJcbiAgICB0aGlzLnJvdW5kaW5nID0gcm07XHJcbiAgICByID0geS5zIDwgMCA/IHIubWludXMoeCkgOiByLnBsdXMoeCk7XHJcbiAgfSBlbHNlIHtcclxuICAgIHIgPSB0aGlzLmF0YW4oZGl2aWRlKHksIHgsIHdwciwgMSkpO1xyXG4gIH1cclxuXHJcbiAgcmV0dXJuIHI7XHJcbn1cclxuXHJcblxyXG4vKlxyXG4gKiBSZXR1cm4gYSBuZXcgRGVjaW1hbCB3aG9zZSB2YWx1ZSBpcyB0aGUgY3ViZSByb290IG9mIGB4YCwgcm91bmRlZCB0byBgcHJlY2lzaW9uYCBzaWduaWZpY2FudFxyXG4gKiBkaWdpdHMgdXNpbmcgcm91bmRpbmcgbW9kZSBgcm91bmRpbmdgLlxyXG4gKlxyXG4gKiB4IHtudW1iZXJ8c3RyaW5nfERlY2ltYWx9XHJcbiAqXHJcbiAqL1xyXG5mdW5jdGlvbiBjYnJ0KHgpIHtcclxuICByZXR1cm4gbmV3IHRoaXMoeCkuY2JydCgpO1xyXG59XHJcblxyXG5cclxuLypcclxuICogUmV0dXJuIGEgbmV3IERlY2ltYWwgd2hvc2UgdmFsdWUgaXMgYHhgIHJvdW5kZWQgdG8gYW4gaW50ZWdlciB1c2luZyBgUk9VTkRfQ0VJTGAuXHJcbiAqXHJcbiAqIHgge251bWJlcnxzdHJpbmd8RGVjaW1hbH1cclxuICpcclxuICovXHJcbmZ1bmN0aW9uIGNlaWwoeCkge1xyXG4gIHJldHVybiBmaW5hbGlzZSh4ID0gbmV3IHRoaXMoeCksIHguZSArIDEsIDIpO1xyXG59XHJcblxyXG5cclxuLypcclxuICogUmV0dXJuIGEgbmV3IERlY2ltYWwgd2hvc2UgdmFsdWUgaXMgYHhgIGNsYW1wZWQgdG8gdGhlIHJhbmdlIGRlbGluZWF0ZWQgYnkgYG1pbmAgYW5kIGBtYXhgLlxyXG4gKlxyXG4gKiB4IHtudW1iZXJ8c3RyaW5nfERlY2ltYWx9XHJcbiAqIG1pbiB7bnVtYmVyfHN0cmluZ3xEZWNpbWFsfVxyXG4gKiBtYXgge251bWJlcnxzdHJpbmd8RGVjaW1hbH1cclxuICpcclxuICovXHJcbmZ1bmN0aW9uIGNsYW1wKHgsIG1pbiwgbWF4KSB7XHJcbiAgcmV0dXJuIG5ldyB0aGlzKHgpLmNsYW1wKG1pbiwgbWF4KTtcclxufVxyXG5cclxuXHJcbi8qXHJcbiAqIENvbmZpZ3VyZSBnbG9iYWwgc2V0dGluZ3MgZm9yIGEgRGVjaW1hbCBjb25zdHJ1Y3Rvci5cclxuICpcclxuICogYG9iamAgaXMgYW4gb2JqZWN0IHdpdGggb25lIG9yIG1vcmUgb2YgdGhlIGZvbGxvd2luZyBwcm9wZXJ0aWVzLFxyXG4gKlxyXG4gKiAgIHByZWNpc2lvbiAge251bWJlcn1cclxuICogICByb3VuZGluZyAgIHtudW1iZXJ9XHJcbiAqICAgdG9FeHBOZWcgICB7bnVtYmVyfVxyXG4gKiAgIHRvRXhwUG9zICAge251bWJlcn1cclxuICogICBtYXhFICAgICAgIHtudW1iZXJ9XHJcbiAqICAgbWluRSAgICAgICB7bnVtYmVyfVxyXG4gKiAgIG1vZHVsbyAgICAge251bWJlcn1cclxuICogICBjcnlwdG8gICAgIHtib29sZWFufG51bWJlcn1cclxuICogICBkZWZhdWx0cyAgIHt0cnVlfVxyXG4gKlxyXG4gKiBFLmcuIERlY2ltYWwuY29uZmlnKHsgcHJlY2lzaW9uOiAyMCwgcm91bmRpbmc6IDQgfSlcclxuICpcclxuICovXHJcbmZ1bmN0aW9uIGNvbmZpZyhvYmopIHtcclxuICBpZiAoIW9iaiB8fCB0eXBlb2Ygb2JqICE9PSAnb2JqZWN0JykgdGhyb3cgRXJyb3IoZGVjaW1hbEVycm9yICsgJ09iamVjdCBleHBlY3RlZCcpO1xyXG4gIHZhciBpLCBwLCB2LFxyXG4gICAgdXNlRGVmYXVsdHMgPSBvYmouZGVmYXVsdHMgPT09IHRydWUsXHJcbiAgICBwcyA9IFtcclxuICAgICAgJ3ByZWNpc2lvbicsIDEsIE1BWF9ESUdJVFMsXHJcbiAgICAgICdyb3VuZGluZycsIDAsIDgsXHJcbiAgICAgICd0b0V4cE5lZycsIC1FWFBfTElNSVQsIDAsXHJcbiAgICAgICd0b0V4cFBvcycsIDAsIEVYUF9MSU1JVCxcclxuICAgICAgJ21heEUnLCAwLCBFWFBfTElNSVQsXHJcbiAgICAgICdtaW5FJywgLUVYUF9MSU1JVCwgMCxcclxuICAgICAgJ21vZHVsbycsIDAsIDlcclxuICAgIF07XHJcblxyXG4gIGZvciAoaSA9IDA7IGkgPCBwcy5sZW5ndGg7IGkgKz0gMykge1xyXG4gICAgaWYgKHAgPSBwc1tpXSwgdXNlRGVmYXVsdHMpIHRoaXNbcF0gPSBERUZBVUxUU1twXTtcclxuICAgIGlmICgodiA9IG9ialtwXSkgIT09IHZvaWQgMCkge1xyXG4gICAgICBpZiAobWF0aGZsb29yKHYpID09PSB2ICYmIHYgPj0gcHNbaSArIDFdICYmIHYgPD0gcHNbaSArIDJdKSB0aGlzW3BdID0gdjtcclxuICAgICAgZWxzZSB0aHJvdyBFcnJvcihpbnZhbGlkQXJndW1lbnQgKyBwICsgJzogJyArIHYpO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgaWYgKHAgPSAnY3J5cHRvJywgdXNlRGVmYXVsdHMpIHRoaXNbcF0gPSBERUZBVUxUU1twXTtcclxuICBpZiAoKHYgPSBvYmpbcF0pICE9PSB2b2lkIDApIHtcclxuICAgIGlmICh2ID09PSB0cnVlIHx8IHYgPT09IGZhbHNlIHx8IHYgPT09IDAgfHwgdiA9PT0gMSkge1xyXG4gICAgICBpZiAodikge1xyXG4gICAgICAgIGlmICh0eXBlb2YgY3J5cHRvICE9ICd1bmRlZmluZWQnICYmIGNyeXB0byAmJlxyXG4gICAgICAgICAgKGNyeXB0by5nZXRSYW5kb21WYWx1ZXMgfHwgY3J5cHRvLnJhbmRvbUJ5dGVzKSkge1xyXG4gICAgICAgICAgdGhpc1twXSA9IHRydWU7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgIHRocm93IEVycm9yKGNyeXB0b1VuYXZhaWxhYmxlKTtcclxuICAgICAgICB9XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgdGhpc1twXSA9IGZhbHNlO1xyXG4gICAgICB9XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICB0aHJvdyBFcnJvcihpbnZhbGlkQXJndW1lbnQgKyBwICsgJzogJyArIHYpO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgcmV0dXJuIHRoaXM7XHJcbn1cclxuXHJcblxyXG4vKlxyXG4gKiBSZXR1cm4gYSBuZXcgRGVjaW1hbCB3aG9zZSB2YWx1ZSBpcyB0aGUgY29zaW5lIG9mIGB4YCwgcm91bmRlZCB0byBgcHJlY2lzaW9uYCBzaWduaWZpY2FudFxyXG4gKiBkaWdpdHMgdXNpbmcgcm91bmRpbmcgbW9kZSBgcm91bmRpbmdgLlxyXG4gKlxyXG4gKiB4IHtudW1iZXJ8c3RyaW5nfERlY2ltYWx9IEEgdmFsdWUgaW4gcmFkaWFucy5cclxuICpcclxuICovXHJcbmZ1bmN0aW9uIGNvcyh4KSB7XHJcbiAgcmV0dXJuIG5ldyB0aGlzKHgpLmNvcygpO1xyXG59XHJcblxyXG5cclxuLypcclxuICogUmV0dXJuIGEgbmV3IERlY2ltYWwgd2hvc2UgdmFsdWUgaXMgdGhlIGh5cGVyYm9saWMgY29zaW5lIG9mIGB4YCwgcm91bmRlZCB0byBwcmVjaXNpb25cclxuICogc2lnbmlmaWNhbnQgZGlnaXRzIHVzaW5nIHJvdW5kaW5nIG1vZGUgYHJvdW5kaW5nYC5cclxuICpcclxuICogeCB7bnVtYmVyfHN0cmluZ3xEZWNpbWFsfSBBIHZhbHVlIGluIHJhZGlhbnMuXHJcbiAqXHJcbiAqL1xyXG5mdW5jdGlvbiBjb3NoKHgpIHtcclxuICByZXR1cm4gbmV3IHRoaXMoeCkuY29zaCgpO1xyXG59XHJcblxyXG5cclxuLypcclxuICogQ3JlYXRlIGFuZCByZXR1cm4gYSBEZWNpbWFsIGNvbnN0cnVjdG9yIHdpdGggdGhlIHNhbWUgY29uZmlndXJhdGlvbiBwcm9wZXJ0aWVzIGFzIHRoaXMgRGVjaW1hbFxyXG4gKiBjb25zdHJ1Y3Rvci5cclxuICpcclxuICovXHJcbmZ1bmN0aW9uIGNsb25lKG9iaikge1xyXG4gIHZhciBpLCBwLCBwcztcclxuXHJcbiAgLypcclxuICAgKiBUaGUgRGVjaW1hbCBjb25zdHJ1Y3RvciBhbmQgZXhwb3J0ZWQgZnVuY3Rpb24uXHJcbiAgICogUmV0dXJuIGEgbmV3IERlY2ltYWwgaW5zdGFuY2UuXHJcbiAgICpcclxuICAgKiB2IHtudW1iZXJ8c3RyaW5nfERlY2ltYWx9IEEgbnVtZXJpYyB2YWx1ZS5cclxuICAgKlxyXG4gICAqL1xyXG4gIGZ1bmN0aW9uIERlY2ltYWwodikge1xyXG4gICAgdmFyIGUsIGksIHQsXHJcbiAgICAgIHggPSB0aGlzO1xyXG5cclxuICAgIC8vIERlY2ltYWwgY2FsbGVkIHdpdGhvdXQgbmV3LlxyXG4gICAgaWYgKCEoeCBpbnN0YW5jZW9mIERlY2ltYWwpKSByZXR1cm4gbmV3IERlY2ltYWwodik7XHJcblxyXG4gICAgLy8gUmV0YWluIGEgcmVmZXJlbmNlIHRvIHRoaXMgRGVjaW1hbCBjb25zdHJ1Y3RvciwgYW5kIHNoYWRvdyBEZWNpbWFsLnByb3RvdHlwZS5jb25zdHJ1Y3RvclxyXG4gICAgLy8gd2hpY2ggcG9pbnRzIHRvIE9iamVjdC5cclxuICAgIHguY29uc3RydWN0b3IgPSBEZWNpbWFsO1xyXG5cclxuICAgIC8vIER1cGxpY2F0ZS5cclxuICAgIGlmIChpc0RlY2ltYWxJbnN0YW5jZSh2KSkge1xyXG4gICAgICB4LnMgPSB2LnM7XHJcblxyXG4gICAgICBpZiAoZXh0ZXJuYWwpIHtcclxuICAgICAgICBpZiAoIXYuZCB8fCB2LmUgPiBEZWNpbWFsLm1heEUpIHtcclxuXHJcbiAgICAgICAgICAvLyBJbmZpbml0eS5cclxuICAgICAgICAgIHguZSA9IE5hTjtcclxuICAgICAgICAgIHguZCA9IG51bGw7XHJcbiAgICAgICAgfSBlbHNlIGlmICh2LmUgPCBEZWNpbWFsLm1pbkUpIHtcclxuXHJcbiAgICAgICAgICAvLyBaZXJvLlxyXG4gICAgICAgICAgeC5lID0gMDtcclxuICAgICAgICAgIHguZCA9IFswXTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgeC5lID0gdi5lO1xyXG4gICAgICAgICAgeC5kID0gdi5kLnNsaWNlKCk7XHJcbiAgICAgICAgfVxyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIHguZSA9IHYuZTtcclxuICAgICAgICB4LmQgPSB2LmQgPyB2LmQuc2xpY2UoKSA6IHYuZDtcclxuICAgICAgfVxyXG5cclxuICAgICAgcmV0dXJuO1xyXG4gICAgfVxyXG5cclxuICAgIHQgPSB0eXBlb2YgdjtcclxuXHJcbiAgICBpZiAodCA9PT0gJ251bWJlcicpIHtcclxuICAgICAgaWYgKHYgPT09IDApIHtcclxuICAgICAgICB4LnMgPSAxIC8gdiA8IDAgPyAtMSA6IDE7XHJcbiAgICAgICAgeC5lID0gMDtcclxuICAgICAgICB4LmQgPSBbMF07XHJcbiAgICAgICAgcmV0dXJuO1xyXG4gICAgICB9XHJcblxyXG4gICAgICBpZiAodiA8IDApIHtcclxuICAgICAgICB2ID0gLXY7XHJcbiAgICAgICAgeC5zID0gLTE7XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgeC5zID0gMTtcclxuICAgICAgfVxyXG5cclxuICAgICAgLy8gRmFzdCBwYXRoIGZvciBzbWFsbCBpbnRlZ2Vycy5cclxuICAgICAgaWYgKHYgPT09IH5+diAmJiB2IDwgMWU3KSB7XHJcbiAgICAgICAgZm9yIChlID0gMCwgaSA9IHY7IGkgPj0gMTA7IGkgLz0gMTApIGUrKztcclxuXHJcbiAgICAgICAgaWYgKGV4dGVybmFsKSB7XHJcbiAgICAgICAgICBpZiAoZSA+IERlY2ltYWwubWF4RSkge1xyXG4gICAgICAgICAgICB4LmUgPSBOYU47XHJcbiAgICAgICAgICAgIHguZCA9IG51bGw7XHJcbiAgICAgICAgICB9IGVsc2UgaWYgKGUgPCBEZWNpbWFsLm1pbkUpIHtcclxuICAgICAgICAgICAgeC5lID0gMDtcclxuICAgICAgICAgICAgeC5kID0gWzBdO1xyXG4gICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgeC5lID0gZTtcclxuICAgICAgICAgICAgeC5kID0gW3ZdO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICB4LmUgPSBlO1xyXG4gICAgICAgICAgeC5kID0gW3ZdO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuO1xyXG5cclxuICAgICAgLy8gSW5maW5pdHksIE5hTi5cclxuICAgICAgfSBlbHNlIGlmICh2ICogMCAhPT0gMCkge1xyXG4gICAgICAgIGlmICghdikgeC5zID0gTmFOO1xyXG4gICAgICAgIHguZSA9IE5hTjtcclxuICAgICAgICB4LmQgPSBudWxsO1xyXG4gICAgICAgIHJldHVybjtcclxuICAgICAgfVxyXG5cclxuICAgICAgcmV0dXJuIHBhcnNlRGVjaW1hbCh4LCB2LnRvU3RyaW5nKCkpO1xyXG5cclxuICAgIH0gZWxzZSBpZiAodCAhPT0gJ3N0cmluZycpIHtcclxuICAgICAgdGhyb3cgRXJyb3IoaW52YWxpZEFyZ3VtZW50ICsgdik7XHJcbiAgICB9XHJcblxyXG4gICAgLy8gTWludXMgc2lnbj9cclxuICAgIGlmICgoaSA9IHYuY2hhckNvZGVBdCgwKSkgPT09IDQ1KSB7XHJcbiAgICAgIHYgPSB2LnNsaWNlKDEpO1xyXG4gICAgICB4LnMgPSAtMTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIC8vIFBsdXMgc2lnbj9cclxuICAgICAgaWYgKGkgPT09IDQzKSB2ID0gdi5zbGljZSgxKTtcclxuICAgICAgeC5zID0gMTtcclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4gaXNEZWNpbWFsLnRlc3QodikgPyBwYXJzZURlY2ltYWwoeCwgdikgOiBwYXJzZU90aGVyKHgsIHYpO1xyXG4gIH1cclxuXHJcbiAgRGVjaW1hbC5wcm90b3R5cGUgPSBQO1xyXG5cclxuICBEZWNpbWFsLlJPVU5EX1VQID0gMDtcclxuICBEZWNpbWFsLlJPVU5EX0RPV04gPSAxO1xyXG4gIERlY2ltYWwuUk9VTkRfQ0VJTCA9IDI7XHJcbiAgRGVjaW1hbC5ST1VORF9GTE9PUiA9IDM7XHJcbiAgRGVjaW1hbC5ST1VORF9IQUxGX1VQID0gNDtcclxuICBEZWNpbWFsLlJPVU5EX0hBTEZfRE9XTiA9IDU7XHJcbiAgRGVjaW1hbC5ST1VORF9IQUxGX0VWRU4gPSA2O1xyXG4gIERlY2ltYWwuUk9VTkRfSEFMRl9DRUlMID0gNztcclxuICBEZWNpbWFsLlJPVU5EX0hBTEZfRkxPT1IgPSA4O1xyXG4gIERlY2ltYWwuRVVDTElEID0gOTtcclxuXHJcbiAgRGVjaW1hbC5jb25maWcgPSBEZWNpbWFsLnNldCA9IGNvbmZpZztcclxuICBEZWNpbWFsLmNsb25lID0gY2xvbmU7XHJcbiAgRGVjaW1hbC5pc0RlY2ltYWwgPSBpc0RlY2ltYWxJbnN0YW5jZTtcclxuXHJcbiAgRGVjaW1hbC5hYnMgPSBhYnM7XHJcbiAgRGVjaW1hbC5hY29zID0gYWNvcztcclxuICBEZWNpbWFsLmFjb3NoID0gYWNvc2g7ICAgICAgICAvLyBFUzZcclxuICBEZWNpbWFsLmFkZCA9IGFkZDtcclxuICBEZWNpbWFsLmFzaW4gPSBhc2luO1xyXG4gIERlY2ltYWwuYXNpbmggPSBhc2luaDsgICAgICAgIC8vIEVTNlxyXG4gIERlY2ltYWwuYXRhbiA9IGF0YW47XHJcbiAgRGVjaW1hbC5hdGFuaCA9IGF0YW5oOyAgICAgICAgLy8gRVM2XHJcbiAgRGVjaW1hbC5hdGFuMiA9IGF0YW4yO1xyXG4gIERlY2ltYWwuY2JydCA9IGNicnQ7ICAgICAgICAgIC8vIEVTNlxyXG4gIERlY2ltYWwuY2VpbCA9IGNlaWw7XHJcbiAgRGVjaW1hbC5jbGFtcCA9IGNsYW1wO1xyXG4gIERlY2ltYWwuY29zID0gY29zO1xyXG4gIERlY2ltYWwuY29zaCA9IGNvc2g7ICAgICAgICAgIC8vIEVTNlxyXG4gIERlY2ltYWwuZGl2ID0gZGl2O1xyXG4gIERlY2ltYWwuZXhwID0gZXhwO1xyXG4gIERlY2ltYWwuZmxvb3IgPSBmbG9vcjtcclxuICBEZWNpbWFsLmh5cG90ID0gaHlwb3Q7ICAgICAgICAvLyBFUzZcclxuICBEZWNpbWFsLmxuID0gbG47XHJcbiAgRGVjaW1hbC5sb2cgPSBsb2c7XHJcbiAgRGVjaW1hbC5sb2cxMCA9IGxvZzEwOyAgICAgICAgLy8gRVM2XHJcbiAgRGVjaW1hbC5sb2cyID0gbG9nMjsgICAgICAgICAgLy8gRVM2XHJcbiAgRGVjaW1hbC5tYXggPSBtYXg7XHJcbiAgRGVjaW1hbC5taW4gPSBtaW47XHJcbiAgRGVjaW1hbC5tb2QgPSBtb2Q7XHJcbiAgRGVjaW1hbC5tdWwgPSBtdWw7XHJcbiAgRGVjaW1hbC5wb3cgPSBwb3c7XHJcbiAgRGVjaW1hbC5yYW5kb20gPSByYW5kb207XHJcbiAgRGVjaW1hbC5yb3VuZCA9IHJvdW5kO1xyXG4gIERlY2ltYWwuc2lnbiA9IHNpZ247ICAgICAgICAgIC8vIEVTNlxyXG4gIERlY2ltYWwuc2luID0gc2luO1xyXG4gIERlY2ltYWwuc2luaCA9IHNpbmg7ICAgICAgICAgIC8vIEVTNlxyXG4gIERlY2ltYWwuc3FydCA9IHNxcnQ7XHJcbiAgRGVjaW1hbC5zdWIgPSBzdWI7XHJcbiAgRGVjaW1hbC5zdW0gPSBzdW07XHJcbiAgRGVjaW1hbC50YW4gPSB0YW47XHJcbiAgRGVjaW1hbC50YW5oID0gdGFuaDsgICAgICAgICAgLy8gRVM2XHJcbiAgRGVjaW1hbC50cnVuYyA9IHRydW5jOyAgICAgICAgLy8gRVM2XHJcblxyXG4gIGlmIChvYmogPT09IHZvaWQgMCkgb2JqID0ge307XHJcbiAgaWYgKG9iaikge1xyXG4gICAgaWYgKG9iai5kZWZhdWx0cyAhPT0gdHJ1ZSkge1xyXG4gICAgICBwcyA9IFsncHJlY2lzaW9uJywgJ3JvdW5kaW5nJywgJ3RvRXhwTmVnJywgJ3RvRXhwUG9zJywgJ21heEUnLCAnbWluRScsICdtb2R1bG8nLCAnY3J5cHRvJ107XHJcbiAgICAgIGZvciAoaSA9IDA7IGkgPCBwcy5sZW5ndGg7KSBpZiAoIW9iai5oYXNPd25Qcm9wZXJ0eShwID0gcHNbaSsrXSkpIG9ialtwXSA9IHRoaXNbcF07XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBEZWNpbWFsLmNvbmZpZyhvYmopO1xyXG5cclxuICByZXR1cm4gRGVjaW1hbDtcclxufVxyXG5cclxuXHJcbi8qXHJcbiAqIFJldHVybiBhIG5ldyBEZWNpbWFsIHdob3NlIHZhbHVlIGlzIGB4YCBkaXZpZGVkIGJ5IGB5YCwgcm91bmRlZCB0byBgcHJlY2lzaW9uYCBzaWduaWZpY2FudFxyXG4gKiBkaWdpdHMgdXNpbmcgcm91bmRpbmcgbW9kZSBgcm91bmRpbmdgLlxyXG4gKlxyXG4gKiB4IHtudW1iZXJ8c3RyaW5nfERlY2ltYWx9XHJcbiAqIHkge251bWJlcnxzdHJpbmd8RGVjaW1hbH1cclxuICpcclxuICovXHJcbmZ1bmN0aW9uIGRpdih4LCB5KSB7XHJcbiAgcmV0dXJuIG5ldyB0aGlzKHgpLmRpdih5KTtcclxufVxyXG5cclxuXHJcbi8qXHJcbiAqIFJldHVybiBhIG5ldyBEZWNpbWFsIHdob3NlIHZhbHVlIGlzIHRoZSBuYXR1cmFsIGV4cG9uZW50aWFsIG9mIGB4YCwgcm91bmRlZCB0byBgcHJlY2lzaW9uYFxyXG4gKiBzaWduaWZpY2FudCBkaWdpdHMgdXNpbmcgcm91bmRpbmcgbW9kZSBgcm91bmRpbmdgLlxyXG4gKlxyXG4gKiB4IHtudW1iZXJ8c3RyaW5nfERlY2ltYWx9IFRoZSBwb3dlciB0byB3aGljaCB0byByYWlzZSB0aGUgYmFzZSBvZiB0aGUgbmF0dXJhbCBsb2cuXHJcbiAqXHJcbiAqL1xyXG5mdW5jdGlvbiBleHAoeCkge1xyXG4gIHJldHVybiBuZXcgdGhpcyh4KS5leHAoKTtcclxufVxyXG5cclxuXHJcbi8qXHJcbiAqIFJldHVybiBhIG5ldyBEZWNpbWFsIHdob3NlIHZhbHVlIGlzIGB4YCByb3VuZCB0byBhbiBpbnRlZ2VyIHVzaW5nIGBST1VORF9GTE9PUmAuXHJcbiAqXHJcbiAqIHgge251bWJlcnxzdHJpbmd8RGVjaW1hbH1cclxuICpcclxuICovXHJcbmZ1bmN0aW9uIGZsb29yKHgpIHtcclxuICByZXR1cm4gZmluYWxpc2UoeCA9IG5ldyB0aGlzKHgpLCB4LmUgKyAxLCAzKTtcclxufVxyXG5cclxuXHJcbi8qXHJcbiAqIFJldHVybiBhIG5ldyBEZWNpbWFsIHdob3NlIHZhbHVlIGlzIHRoZSBzcXVhcmUgcm9vdCBvZiB0aGUgc3VtIG9mIHRoZSBzcXVhcmVzIG9mIHRoZSBhcmd1bWVudHMsXHJcbiAqIHJvdW5kZWQgdG8gYHByZWNpc2lvbmAgc2lnbmlmaWNhbnQgZGlnaXRzIHVzaW5nIHJvdW5kaW5nIG1vZGUgYHJvdW5kaW5nYC5cclxuICpcclxuICogaHlwb3QoYSwgYiwgLi4uKSA9IHNxcnQoYV4yICsgYl4yICsgLi4uKVxyXG4gKlxyXG4gKiBhcmd1bWVudHMge251bWJlcnxzdHJpbmd8RGVjaW1hbH1cclxuICpcclxuICovXHJcbmZ1bmN0aW9uIGh5cG90KCkge1xyXG4gIHZhciBpLCBuLFxyXG4gICAgdCA9IG5ldyB0aGlzKDApO1xyXG5cclxuICBleHRlcm5hbCA9IGZhbHNlO1xyXG5cclxuICBmb3IgKGkgPSAwOyBpIDwgYXJndW1lbnRzLmxlbmd0aDspIHtcclxuICAgIG4gPSBuZXcgdGhpcyhhcmd1bWVudHNbaSsrXSk7XHJcbiAgICBpZiAoIW4uZCkge1xyXG4gICAgICBpZiAobi5zKSB7XHJcbiAgICAgICAgZXh0ZXJuYWwgPSB0cnVlO1xyXG4gICAgICAgIHJldHVybiBuZXcgdGhpcygxIC8gMCk7XHJcbiAgICAgIH1cclxuICAgICAgdCA9IG47XHJcbiAgICB9IGVsc2UgaWYgKHQuZCkge1xyXG4gICAgICB0ID0gdC5wbHVzKG4udGltZXMobikpO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgZXh0ZXJuYWwgPSB0cnVlO1xyXG5cclxuICByZXR1cm4gdC5zcXJ0KCk7XHJcbn1cclxuXHJcblxyXG4vKlxyXG4gKiBSZXR1cm4gdHJ1ZSBpZiBvYmplY3QgaXMgYSBEZWNpbWFsIGluc3RhbmNlICh3aGVyZSBEZWNpbWFsIGlzIGFueSBEZWNpbWFsIGNvbnN0cnVjdG9yKSxcclxuICogb3RoZXJ3aXNlIHJldHVybiBmYWxzZS5cclxuICpcclxuICovXHJcbmZ1bmN0aW9uIGlzRGVjaW1hbEluc3RhbmNlKG9iaikge1xyXG4gIHJldHVybiBvYmogaW5zdGFuY2VvZiBEZWNpbWFsIHx8IG9iaiAmJiBvYmoudG9TdHJpbmdUYWcgPT09IHRhZyB8fCBmYWxzZTtcclxufVxyXG5cclxuXHJcbi8qXHJcbiAqIFJldHVybiBhIG5ldyBEZWNpbWFsIHdob3NlIHZhbHVlIGlzIHRoZSBuYXR1cmFsIGxvZ2FyaXRobSBvZiBgeGAsIHJvdW5kZWQgdG8gYHByZWNpc2lvbmBcclxuICogc2lnbmlmaWNhbnQgZGlnaXRzIHVzaW5nIHJvdW5kaW5nIG1vZGUgYHJvdW5kaW5nYC5cclxuICpcclxuICogeCB7bnVtYmVyfHN0cmluZ3xEZWNpbWFsfVxyXG4gKlxyXG4gKi9cclxuZnVuY3Rpb24gbG4oeCkge1xyXG4gIHJldHVybiBuZXcgdGhpcyh4KS5sbigpO1xyXG59XHJcblxyXG5cclxuLypcclxuICogUmV0dXJuIGEgbmV3IERlY2ltYWwgd2hvc2UgdmFsdWUgaXMgdGhlIGxvZyBvZiBgeGAgdG8gdGhlIGJhc2UgYHlgLCBvciB0byBiYXNlIDEwIGlmIG5vIGJhc2VcclxuICogaXMgc3BlY2lmaWVkLCByb3VuZGVkIHRvIGBwcmVjaXNpb25gIHNpZ25pZmljYW50IGRpZ2l0cyB1c2luZyByb3VuZGluZyBtb2RlIGByb3VuZGluZ2AuXHJcbiAqXHJcbiAqIGxvZ1t5XSh4KVxyXG4gKlxyXG4gKiB4IHtudW1iZXJ8c3RyaW5nfERlY2ltYWx9IFRoZSBhcmd1bWVudCBvZiB0aGUgbG9nYXJpdGhtLlxyXG4gKiB5IHtudW1iZXJ8c3RyaW5nfERlY2ltYWx9IFRoZSBiYXNlIG9mIHRoZSBsb2dhcml0aG0uXHJcbiAqXHJcbiAqL1xyXG5mdW5jdGlvbiBsb2coeCwgeSkge1xyXG4gIHJldHVybiBuZXcgdGhpcyh4KS5sb2coeSk7XHJcbn1cclxuXHJcblxyXG4vKlxyXG4gKiBSZXR1cm4gYSBuZXcgRGVjaW1hbCB3aG9zZSB2YWx1ZSBpcyB0aGUgYmFzZSAyIGxvZ2FyaXRobSBvZiBgeGAsIHJvdW5kZWQgdG8gYHByZWNpc2lvbmBcclxuICogc2lnbmlmaWNhbnQgZGlnaXRzIHVzaW5nIHJvdW5kaW5nIG1vZGUgYHJvdW5kaW5nYC5cclxuICpcclxuICogeCB7bnVtYmVyfHN0cmluZ3xEZWNpbWFsfVxyXG4gKlxyXG4gKi9cclxuZnVuY3Rpb24gbG9nMih4KSB7XHJcbiAgcmV0dXJuIG5ldyB0aGlzKHgpLmxvZygyKTtcclxufVxyXG5cclxuXHJcbi8qXHJcbiAqIFJldHVybiBhIG5ldyBEZWNpbWFsIHdob3NlIHZhbHVlIGlzIHRoZSBiYXNlIDEwIGxvZ2FyaXRobSBvZiBgeGAsIHJvdW5kZWQgdG8gYHByZWNpc2lvbmBcclxuICogc2lnbmlmaWNhbnQgZGlnaXRzIHVzaW5nIHJvdW5kaW5nIG1vZGUgYHJvdW5kaW5nYC5cclxuICpcclxuICogeCB7bnVtYmVyfHN0cmluZ3xEZWNpbWFsfVxyXG4gKlxyXG4gKi9cclxuZnVuY3Rpb24gbG9nMTAoeCkge1xyXG4gIHJldHVybiBuZXcgdGhpcyh4KS5sb2coMTApO1xyXG59XHJcblxyXG5cclxuLypcclxuICogUmV0dXJuIGEgbmV3IERlY2ltYWwgd2hvc2UgdmFsdWUgaXMgdGhlIG1heGltdW0gb2YgdGhlIGFyZ3VtZW50cy5cclxuICpcclxuICogYXJndW1lbnRzIHtudW1iZXJ8c3RyaW5nfERlY2ltYWx9XHJcbiAqXHJcbiAqL1xyXG5mdW5jdGlvbiBtYXgoKSB7XHJcbiAgcmV0dXJuIG1heE9yTWluKHRoaXMsIGFyZ3VtZW50cywgJ2x0Jyk7XHJcbn1cclxuXHJcblxyXG4vKlxyXG4gKiBSZXR1cm4gYSBuZXcgRGVjaW1hbCB3aG9zZSB2YWx1ZSBpcyB0aGUgbWluaW11bSBvZiB0aGUgYXJndW1lbnRzLlxyXG4gKlxyXG4gKiBhcmd1bWVudHMge251bWJlcnxzdHJpbmd8RGVjaW1hbH1cclxuICpcclxuICovXHJcbmZ1bmN0aW9uIG1pbigpIHtcclxuICByZXR1cm4gbWF4T3JNaW4odGhpcywgYXJndW1lbnRzLCAnZ3QnKTtcclxufVxyXG5cclxuXHJcbi8qXHJcbiAqIFJldHVybiBhIG5ldyBEZWNpbWFsIHdob3NlIHZhbHVlIGlzIGB4YCBtb2R1bG8gYHlgLCByb3VuZGVkIHRvIGBwcmVjaXNpb25gIHNpZ25pZmljYW50IGRpZ2l0c1xyXG4gKiB1c2luZyByb3VuZGluZyBtb2RlIGByb3VuZGluZ2AuXHJcbiAqXHJcbiAqIHgge251bWJlcnxzdHJpbmd8RGVjaW1hbH1cclxuICogeSB7bnVtYmVyfHN0cmluZ3xEZWNpbWFsfVxyXG4gKlxyXG4gKi9cclxuZnVuY3Rpb24gbW9kKHgsIHkpIHtcclxuICByZXR1cm4gbmV3IHRoaXMoeCkubW9kKHkpO1xyXG59XHJcblxyXG5cclxuLypcclxuICogUmV0dXJuIGEgbmV3IERlY2ltYWwgd2hvc2UgdmFsdWUgaXMgYHhgIG11bHRpcGxpZWQgYnkgYHlgLCByb3VuZGVkIHRvIGBwcmVjaXNpb25gIHNpZ25pZmljYW50XHJcbiAqIGRpZ2l0cyB1c2luZyByb3VuZGluZyBtb2RlIGByb3VuZGluZ2AuXHJcbiAqXHJcbiAqIHgge251bWJlcnxzdHJpbmd8RGVjaW1hbH1cclxuICogeSB7bnVtYmVyfHN0cmluZ3xEZWNpbWFsfVxyXG4gKlxyXG4gKi9cclxuZnVuY3Rpb24gbXVsKHgsIHkpIHtcclxuICByZXR1cm4gbmV3IHRoaXMoeCkubXVsKHkpO1xyXG59XHJcblxyXG5cclxuLypcclxuICogUmV0dXJuIGEgbmV3IERlY2ltYWwgd2hvc2UgdmFsdWUgaXMgYHhgIHJhaXNlZCB0byB0aGUgcG93ZXIgYHlgLCByb3VuZGVkIHRvIHByZWNpc2lvblxyXG4gKiBzaWduaWZpY2FudCBkaWdpdHMgdXNpbmcgcm91bmRpbmcgbW9kZSBgcm91bmRpbmdgLlxyXG4gKlxyXG4gKiB4IHtudW1iZXJ8c3RyaW5nfERlY2ltYWx9IFRoZSBiYXNlLlxyXG4gKiB5IHtudW1iZXJ8c3RyaW5nfERlY2ltYWx9IFRoZSBleHBvbmVudC5cclxuICpcclxuICovXHJcbmZ1bmN0aW9uIHBvdyh4LCB5KSB7XHJcbiAgcmV0dXJuIG5ldyB0aGlzKHgpLnBvdyh5KTtcclxufVxyXG5cclxuXHJcbi8qXHJcbiAqIFJldHVybnMgYSBuZXcgRGVjaW1hbCB3aXRoIGEgcmFuZG9tIHZhbHVlIGVxdWFsIHRvIG9yIGdyZWF0ZXIgdGhhbiAwIGFuZCBsZXNzIHRoYW4gMSwgYW5kIHdpdGhcclxuICogYHNkYCwgb3IgYERlY2ltYWwucHJlY2lzaW9uYCBpZiBgc2RgIGlzIG9taXR0ZWQsIHNpZ25pZmljYW50IGRpZ2l0cyAob3IgbGVzcyBpZiB0cmFpbGluZyB6ZXJvc1xyXG4gKiBhcmUgcHJvZHVjZWQpLlxyXG4gKlxyXG4gKiBbc2RdIHtudW1iZXJ9IFNpZ25pZmljYW50IGRpZ2l0cy4gSW50ZWdlciwgMCB0byBNQVhfRElHSVRTIGluY2x1c2l2ZS5cclxuICpcclxuICovXHJcbmZ1bmN0aW9uIHJhbmRvbShzZCkge1xyXG4gIHZhciBkLCBlLCBrLCBuLFxyXG4gICAgaSA9IDAsXHJcbiAgICByID0gbmV3IHRoaXMoMSksXHJcbiAgICByZCA9IFtdO1xyXG5cclxuICBpZiAoc2QgPT09IHZvaWQgMCkgc2QgPSB0aGlzLnByZWNpc2lvbjtcclxuICBlbHNlIGNoZWNrSW50MzIoc2QsIDEsIE1BWF9ESUdJVFMpO1xyXG5cclxuICBrID0gTWF0aC5jZWlsKHNkIC8gTE9HX0JBU0UpO1xyXG5cclxuICBpZiAoIXRoaXMuY3J5cHRvKSB7XHJcbiAgICBmb3IgKDsgaSA8IGs7KSByZFtpKytdID0gTWF0aC5yYW5kb20oKSAqIDFlNyB8IDA7XHJcblxyXG4gIC8vIEJyb3dzZXJzIHN1cHBvcnRpbmcgY3J5cHRvLmdldFJhbmRvbVZhbHVlcy5cclxuICB9IGVsc2UgaWYgKGNyeXB0by5nZXRSYW5kb21WYWx1ZXMpIHtcclxuICAgIGQgPSBjcnlwdG8uZ2V0UmFuZG9tVmFsdWVzKG5ldyBVaW50MzJBcnJheShrKSk7XHJcblxyXG4gICAgZm9yICg7IGkgPCBrOykge1xyXG4gICAgICBuID0gZFtpXTtcclxuXHJcbiAgICAgIC8vIDAgPD0gbiA8IDQyOTQ5NjcyOTZcclxuICAgICAgLy8gUHJvYmFiaWxpdHkgbiA+PSA0LjI5ZTksIGlzIDQ5NjcyOTYgLyA0Mjk0OTY3Mjk2ID0gMC4wMDExNiAoMSBpbiA4NjUpLlxyXG4gICAgICBpZiAobiA+PSA0LjI5ZTkpIHtcclxuICAgICAgICBkW2ldID0gY3J5cHRvLmdldFJhbmRvbVZhbHVlcyhuZXcgVWludDMyQXJyYXkoMSkpWzBdO1xyXG4gICAgICB9IGVsc2Uge1xyXG5cclxuICAgICAgICAvLyAwIDw9IG4gPD0gNDI4OTk5OTk5OVxyXG4gICAgICAgIC8vIDAgPD0gKG4gJSAxZTcpIDw9IDk5OTk5OTlcclxuICAgICAgICByZFtpKytdID0gbiAlIDFlNztcclxuICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAvLyBOb2RlLmpzIHN1cHBvcnRpbmcgY3J5cHRvLnJhbmRvbUJ5dGVzLlxyXG4gIH0gZWxzZSBpZiAoY3J5cHRvLnJhbmRvbUJ5dGVzKSB7XHJcblxyXG4gICAgLy8gYnVmZmVyXHJcbiAgICBkID0gY3J5cHRvLnJhbmRvbUJ5dGVzKGsgKj0gNCk7XHJcblxyXG4gICAgZm9yICg7IGkgPCBrOykge1xyXG5cclxuICAgICAgLy8gMCA8PSBuIDwgMjE0NzQ4MzY0OFxyXG4gICAgICBuID0gZFtpXSArIChkW2kgKyAxXSA8PCA4KSArIChkW2kgKyAyXSA8PCAxNikgKyAoKGRbaSArIDNdICYgMHg3ZikgPDwgMjQpO1xyXG5cclxuICAgICAgLy8gUHJvYmFiaWxpdHkgbiA+PSAyLjE0ZTksIGlzIDc0ODM2NDggLyAyMTQ3NDgzNjQ4ID0gMC4wMDM1ICgxIGluIDI4NikuXHJcbiAgICAgIGlmIChuID49IDIuMTRlOSkge1xyXG4gICAgICAgIGNyeXB0by5yYW5kb21CeXRlcyg0KS5jb3B5KGQsIGkpO1xyXG4gICAgICB9IGVsc2Uge1xyXG5cclxuICAgICAgICAvLyAwIDw9IG4gPD0gMjEzOTk5OTk5OVxyXG4gICAgICAgIC8vIDAgPD0gKG4gJSAxZTcpIDw9IDk5OTk5OTlcclxuICAgICAgICByZC5wdXNoKG4gJSAxZTcpO1xyXG4gICAgICAgIGkgKz0gNDtcclxuICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGkgPSBrIC8gNDtcclxuICB9IGVsc2Uge1xyXG4gICAgdGhyb3cgRXJyb3IoY3J5cHRvVW5hdmFpbGFibGUpO1xyXG4gIH1cclxuXHJcbiAgayA9IHJkWy0taV07XHJcbiAgc2QgJT0gTE9HX0JBU0U7XHJcblxyXG4gIC8vIENvbnZlcnQgdHJhaWxpbmcgZGlnaXRzIHRvIHplcm9zIGFjY29yZGluZyB0byBzZC5cclxuICBpZiAoayAmJiBzZCkge1xyXG4gICAgbiA9IG1hdGhwb3coMTAsIExPR19CQVNFIC0gc2QpO1xyXG4gICAgcmRbaV0gPSAoayAvIG4gfCAwKSAqIG47XHJcbiAgfVxyXG5cclxuICAvLyBSZW1vdmUgdHJhaWxpbmcgd29yZHMgd2hpY2ggYXJlIHplcm8uXHJcbiAgZm9yICg7IHJkW2ldID09PSAwOyBpLS0pIHJkLnBvcCgpO1xyXG5cclxuICAvLyBaZXJvP1xyXG4gIGlmIChpIDwgMCkge1xyXG4gICAgZSA9IDA7XHJcbiAgICByZCA9IFswXTtcclxuICB9IGVsc2Uge1xyXG4gICAgZSA9IC0xO1xyXG5cclxuICAgIC8vIFJlbW92ZSBsZWFkaW5nIHdvcmRzIHdoaWNoIGFyZSB6ZXJvIGFuZCBhZGp1c3QgZXhwb25lbnQgYWNjb3JkaW5nbHkuXHJcbiAgICBmb3IgKDsgcmRbMF0gPT09IDA7IGUgLT0gTE9HX0JBU0UpIHJkLnNoaWZ0KCk7XHJcblxyXG4gICAgLy8gQ291bnQgdGhlIGRpZ2l0cyBvZiB0aGUgZmlyc3Qgd29yZCBvZiByZCB0byBkZXRlcm1pbmUgbGVhZGluZyB6ZXJvcy5cclxuICAgIGZvciAoayA9IDEsIG4gPSByZFswXTsgbiA+PSAxMDsgbiAvPSAxMCkgaysrO1xyXG5cclxuICAgIC8vIEFkanVzdCB0aGUgZXhwb25lbnQgZm9yIGxlYWRpbmcgemVyb3Mgb2YgdGhlIGZpcnN0IHdvcmQgb2YgcmQuXHJcbiAgICBpZiAoayA8IExPR19CQVNFKSBlIC09IExPR19CQVNFIC0gaztcclxuICB9XHJcblxyXG4gIHIuZSA9IGU7XHJcbiAgci5kID0gcmQ7XHJcblxyXG4gIHJldHVybiByO1xyXG59XHJcblxyXG5cclxuLypcclxuICogUmV0dXJuIGEgbmV3IERlY2ltYWwgd2hvc2UgdmFsdWUgaXMgYHhgIHJvdW5kZWQgdG8gYW4gaW50ZWdlciB1c2luZyByb3VuZGluZyBtb2RlIGByb3VuZGluZ2AuXHJcbiAqXHJcbiAqIFRvIGVtdWxhdGUgYE1hdGgucm91bmRgLCBzZXQgcm91bmRpbmcgdG8gNyAoUk9VTkRfSEFMRl9DRUlMKS5cclxuICpcclxuICogeCB7bnVtYmVyfHN0cmluZ3xEZWNpbWFsfVxyXG4gKlxyXG4gKi9cclxuZnVuY3Rpb24gcm91bmQoeCkge1xyXG4gIHJldHVybiBmaW5hbGlzZSh4ID0gbmV3IHRoaXMoeCksIHguZSArIDEsIHRoaXMucm91bmRpbmcpO1xyXG59XHJcblxyXG5cclxuLypcclxuICogUmV0dXJuXHJcbiAqICAgMSAgICBpZiB4ID4gMCxcclxuICogIC0xICAgIGlmIHggPCAwLFxyXG4gKiAgIDAgICAgaWYgeCBpcyAwLFxyXG4gKiAgLTAgICAgaWYgeCBpcyAtMCxcclxuICogICBOYU4gIG90aGVyd2lzZVxyXG4gKlxyXG4gKiB4IHtudW1iZXJ8c3RyaW5nfERlY2ltYWx9XHJcbiAqXHJcbiAqL1xyXG5mdW5jdGlvbiBzaWduKHgpIHtcclxuICB4ID0gbmV3IHRoaXMoeCk7XHJcbiAgcmV0dXJuIHguZCA/ICh4LmRbMF0gPyB4LnMgOiAwICogeC5zKSA6IHgucyB8fCBOYU47XHJcbn1cclxuXHJcblxyXG4vKlxyXG4gKiBSZXR1cm4gYSBuZXcgRGVjaW1hbCB3aG9zZSB2YWx1ZSBpcyB0aGUgc2luZSBvZiBgeGAsIHJvdW5kZWQgdG8gYHByZWNpc2lvbmAgc2lnbmlmaWNhbnQgZGlnaXRzXHJcbiAqIHVzaW5nIHJvdW5kaW5nIG1vZGUgYHJvdW5kaW5nYC5cclxuICpcclxuICogeCB7bnVtYmVyfHN0cmluZ3xEZWNpbWFsfSBBIHZhbHVlIGluIHJhZGlhbnMuXHJcbiAqXHJcbiAqL1xyXG5mdW5jdGlvbiBzaW4oeCkge1xyXG4gIHJldHVybiBuZXcgdGhpcyh4KS5zaW4oKTtcclxufVxyXG5cclxuXHJcbi8qXHJcbiAqIFJldHVybiBhIG5ldyBEZWNpbWFsIHdob3NlIHZhbHVlIGlzIHRoZSBoeXBlcmJvbGljIHNpbmUgb2YgYHhgLCByb3VuZGVkIHRvIGBwcmVjaXNpb25gXHJcbiAqIHNpZ25pZmljYW50IGRpZ2l0cyB1c2luZyByb3VuZGluZyBtb2RlIGByb3VuZGluZ2AuXHJcbiAqXHJcbiAqIHgge251bWJlcnxzdHJpbmd8RGVjaW1hbH0gQSB2YWx1ZSBpbiByYWRpYW5zLlxyXG4gKlxyXG4gKi9cclxuZnVuY3Rpb24gc2luaCh4KSB7XHJcbiAgcmV0dXJuIG5ldyB0aGlzKHgpLnNpbmgoKTtcclxufVxyXG5cclxuXHJcbi8qXHJcbiAqIFJldHVybiBhIG5ldyBEZWNpbWFsIHdob3NlIHZhbHVlIGlzIHRoZSBzcXVhcmUgcm9vdCBvZiBgeGAsIHJvdW5kZWQgdG8gYHByZWNpc2lvbmAgc2lnbmlmaWNhbnRcclxuICogZGlnaXRzIHVzaW5nIHJvdW5kaW5nIG1vZGUgYHJvdW5kaW5nYC5cclxuICpcclxuICogeCB7bnVtYmVyfHN0cmluZ3xEZWNpbWFsfVxyXG4gKlxyXG4gKi9cclxuZnVuY3Rpb24gc3FydCh4KSB7XHJcbiAgcmV0dXJuIG5ldyB0aGlzKHgpLnNxcnQoKTtcclxufVxyXG5cclxuXHJcbi8qXHJcbiAqIFJldHVybiBhIG5ldyBEZWNpbWFsIHdob3NlIHZhbHVlIGlzIGB4YCBtaW51cyBgeWAsIHJvdW5kZWQgdG8gYHByZWNpc2lvbmAgc2lnbmlmaWNhbnQgZGlnaXRzXHJcbiAqIHVzaW5nIHJvdW5kaW5nIG1vZGUgYHJvdW5kaW5nYC5cclxuICpcclxuICogeCB7bnVtYmVyfHN0cmluZ3xEZWNpbWFsfVxyXG4gKiB5IHtudW1iZXJ8c3RyaW5nfERlY2ltYWx9XHJcbiAqXHJcbiAqL1xyXG5mdW5jdGlvbiBzdWIoeCwgeSkge1xyXG4gIHJldHVybiBuZXcgdGhpcyh4KS5zdWIoeSk7XHJcbn1cclxuXHJcblxyXG4vKlxyXG4gKiBSZXR1cm4gYSBuZXcgRGVjaW1hbCB3aG9zZSB2YWx1ZSBpcyB0aGUgc3VtIG9mIHRoZSBhcmd1bWVudHMsIHJvdW5kZWQgdG8gYHByZWNpc2lvbmBcclxuICogc2lnbmlmaWNhbnQgZGlnaXRzIHVzaW5nIHJvdW5kaW5nIG1vZGUgYHJvdW5kaW5nYC5cclxuICpcclxuICogT25seSB0aGUgcmVzdWx0IGlzIHJvdW5kZWQsIG5vdCB0aGUgaW50ZXJtZWRpYXRlIGNhbGN1bGF0aW9ucy5cclxuICpcclxuICogYXJndW1lbnRzIHtudW1iZXJ8c3RyaW5nfERlY2ltYWx9XHJcbiAqXHJcbiAqL1xyXG5mdW5jdGlvbiBzdW0oKSB7XHJcbiAgdmFyIGkgPSAwLFxyXG4gICAgYXJncyA9IGFyZ3VtZW50cyxcclxuICAgIHggPSBuZXcgdGhpcyhhcmdzW2ldKTtcclxuXHJcbiAgZXh0ZXJuYWwgPSBmYWxzZTtcclxuICBmb3IgKDsgeC5zICYmICsraSA8IGFyZ3MubGVuZ3RoOykgeCA9IHgucGx1cyhhcmdzW2ldKTtcclxuICBleHRlcm5hbCA9IHRydWU7XHJcblxyXG4gIHJldHVybiBmaW5hbGlzZSh4LCB0aGlzLnByZWNpc2lvbiwgdGhpcy5yb3VuZGluZyk7XHJcbn1cclxuXHJcblxyXG4vKlxyXG4gKiBSZXR1cm4gYSBuZXcgRGVjaW1hbCB3aG9zZSB2YWx1ZSBpcyB0aGUgdGFuZ2VudCBvZiBgeGAsIHJvdW5kZWQgdG8gYHByZWNpc2lvbmAgc2lnbmlmaWNhbnRcclxuICogZGlnaXRzIHVzaW5nIHJvdW5kaW5nIG1vZGUgYHJvdW5kaW5nYC5cclxuICpcclxuICogeCB7bnVtYmVyfHN0cmluZ3xEZWNpbWFsfSBBIHZhbHVlIGluIHJhZGlhbnMuXHJcbiAqXHJcbiAqL1xyXG5mdW5jdGlvbiB0YW4oeCkge1xyXG4gIHJldHVybiBuZXcgdGhpcyh4KS50YW4oKTtcclxufVxyXG5cclxuXHJcbi8qXHJcbiAqIFJldHVybiBhIG5ldyBEZWNpbWFsIHdob3NlIHZhbHVlIGlzIHRoZSBoeXBlcmJvbGljIHRhbmdlbnQgb2YgYHhgLCByb3VuZGVkIHRvIGBwcmVjaXNpb25gXHJcbiAqIHNpZ25pZmljYW50IGRpZ2l0cyB1c2luZyByb3VuZGluZyBtb2RlIGByb3VuZGluZ2AuXHJcbiAqXHJcbiAqIHgge251bWJlcnxzdHJpbmd8RGVjaW1hbH0gQSB2YWx1ZSBpbiByYWRpYW5zLlxyXG4gKlxyXG4gKi9cclxuZnVuY3Rpb24gdGFuaCh4KSB7XHJcbiAgcmV0dXJuIG5ldyB0aGlzKHgpLnRhbmgoKTtcclxufVxyXG5cclxuXHJcbi8qXHJcbiAqIFJldHVybiBhIG5ldyBEZWNpbWFsIHdob3NlIHZhbHVlIGlzIGB4YCB0cnVuY2F0ZWQgdG8gYW4gaW50ZWdlci5cclxuICpcclxuICogeCB7bnVtYmVyfHN0cmluZ3xEZWNpbWFsfVxyXG4gKlxyXG4gKi9cclxuZnVuY3Rpb24gdHJ1bmMoeCkge1xyXG4gIHJldHVybiBmaW5hbGlzZSh4ID0gbmV3IHRoaXMoeCksIHguZSArIDEsIDEpO1xyXG59XHJcblxyXG5cclxuUFtTeW1ib2wuZm9yKCdub2RlanMudXRpbC5pbnNwZWN0LmN1c3RvbScpXSA9IFAudG9TdHJpbmc7XHJcblBbU3ltYm9sLnRvU3RyaW5nVGFnXSA9ICdEZWNpbWFsJztcclxuXHJcbi8vIENyZWF0ZSBhbmQgY29uZmlndXJlIGluaXRpYWwgRGVjaW1hbCBjb25zdHJ1Y3Rvci5cclxuZXhwb3J0IHZhciBEZWNpbWFsID0gUC5jb25zdHJ1Y3RvciA9IGNsb25lKERFRkFVTFRTKTtcclxuXHJcbi8vIENyZWF0ZSB0aGUgaW50ZXJuYWwgY29uc3RhbnRzIGZyb20gdGhlaXIgc3RyaW5nIHZhbHVlcy5cclxuTE4xMCA9IG5ldyBEZWNpbWFsKExOMTApO1xyXG5QSSA9IG5ldyBEZWNpbWFsKFBJKTtcclxuXHJcbmV4cG9ydCBkZWZhdWx0IERlY2ltYWw7XHJcbiIsICIvKlxuTm90YWJsZSBjaGFuZ2VzIG1hZGUvbm90ZXM6XG4tIE5vIG1ham9yIHN0cnVjdHVyYWwgY2hhbmdlc1xuLSBOZWVkIHRvIGFkZCBtb3JlIGZ1bmN0aW9uYWxpdHkgaGVyZSwgZXNwZWNpYWxseSB3aXRoIGhhbmRsaW5nIFNpbmdsZXRvbnNcbiovXG5cblxuaW1wb3J0IHtNYW5hZ2VkUHJvcGVydGllc30gZnJvbSBcIi4vYXNzdW1wdGlvbnNcIjtcbmltcG9ydCB7X0V4cHJ9IGZyb20gXCIuL2V4cHJcIjtcbmltcG9ydCB7R2xvYmFsfSBmcm9tIFwiLi9nbG9iYWxcIjtcbmltcG9ydCB7X051bWJlcl99IGZyb20gXCIuL251bWJlcnNcIjtcbmltcG9ydCB7Z2xvYmFsX3BhcmFtZXRlcnN9IGZyb20gXCIuL3BhcmFtZXRlcnNcIjtcbmltcG9ydCB7U30gZnJvbSBcIi4vc2luZ2xldG9uXCI7XG5cbmV4cG9ydCBjbGFzcyBQb3cgZXh0ZW5kcyBfRXhwciB7XG4gICAgLypcbiAgICBEZWZpbmVzIHRoZSBleHByZXNzaW9uIHgqKnkgYXMgXCJ4IHJhaXNlZCB0byBhIHBvd2VyIHlcIlxuICAgIC4uIGRlcHJlY2F0ZWQ6OiAxLjdcbiAgICAgICBVc2luZyBhcmd1bWVudHMgdGhhdCBhcmVuJ3Qgc3ViY2xhc3NlcyBvZiA6Y2xhc3M6YH4uRXhwcmAgaW4gY29yZVxuICAgICAgIG9wZXJhdG9ycyAoOmNsYXNzOmB+Lk11bGAsIDpjbGFzczpgfi5BZGRgLCBhbmQgOmNsYXNzOmB+LlBvd2ApIGlzXG4gICAgICAgZGVwcmVjYXRlZC4gU2VlIDpyZWY6YG5vbi1leHByLWFyZ3MtZGVwcmVjYXRlZGAgZm9yIGRldGFpbHMuXG4gICAgU2luZ2xldG9uIGRlZmluaXRpb25zIGludm9sdmluZyAoMCwgMSwgLTEsIG9vLCAtb28sIEksIC1JKTpcbiAgICArLS0tLS0tLS0tLS0tLS0rLS0tLS0tLS0tKy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tK1xuICAgIHwgZXhwciAgICAgICAgIHwgdmFsdWUgICB8IHJlYXNvbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB8XG4gICAgKz09PT09PT09PT09PT09Kz09PT09PT09PSs9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PStcbiAgICB8IHoqKjAgICAgICAgICB8IDEgICAgICAgfCBBbHRob3VnaCBhcmd1bWVudHMgb3ZlciAwKiowIGV4aXN0LCBzZWUgWzJdLiAgfFxuICAgICstLS0tLS0tLS0tLS0tLSstLS0tLS0tLS0rLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0rXG4gICAgfCB6KioxICAgICAgICAgfCB6ICAgICAgIHwgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHxcbiAgICArLS0tLS0tLS0tLS0tLS0rLS0tLS0tLS0tKy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tK1xuICAgIHwgKC1vbykqKigtMSkgIHwgMCAgICAgICB8ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB8XG4gICAgKy0tLS0tLS0tLS0tLS0tKy0tLS0tLS0tLSstLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLStcbiAgICB8ICgtMSkqKi0xICAgICB8IC0xICAgICAgfCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfFxuICAgICstLS0tLS0tLS0tLS0tLSstLS0tLS0tLS0rLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0rXG4gICAgfCBTLlplcm8qKi0xICAgfCB6b28gICAgIHwgVGhpcyBpcyBub3Qgc3RyaWN0bHkgdHJ1ZSwgYXMgMCoqLTEgbWF5IGJlICAgIHxcbiAgICB8ICAgICAgICAgICAgICB8ICAgICAgICAgfCB1bmRlZmluZWQsIGJ1dCBpcyBjb252ZW5pZW50IGluIHNvbWUgY29udGV4dHMgfFxuICAgIHwgICAgICAgICAgICAgIHwgICAgICAgICB8IHdoZXJlIHRoZSBiYXNlIGlzIGFzc3VtZWQgdG8gYmUgcG9zaXRpdmUuICAgICB8XG4gICAgKy0tLS0tLS0tLS0tLS0tKy0tLS0tLS0tLSstLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLStcbiAgICB8IDEqKi0xICAgICAgICB8IDEgICAgICAgfCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfFxuICAgICstLS0tLS0tLS0tLS0tLSstLS0tLS0tLS0rLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0rXG4gICAgfCBvbyoqLTEgICAgICAgfCAwICAgICAgIHwgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHxcbiAgICArLS0tLS0tLS0tLS0tLS0rLS0tLS0tLS0tKy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tK1xuICAgIHwgMCoqb28gICAgICAgIHwgMCAgICAgICB8IEJlY2F1c2UgZm9yIGFsbCBjb21wbGV4IG51bWJlcnMgeiBuZWFyICAgICAgICB8XG4gICAgfCAgICAgICAgICAgICAgfCAgICAgICAgIHwgMCwgeioqb28gLT4gMC4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHxcbiAgICArLS0tLS0tLS0tLS0tLS0rLS0tLS0tLS0tKy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tK1xuICAgIHwgMCoqLW9vICAgICAgIHwgem9vICAgICB8IFRoaXMgaXMgbm90IHN0cmljdGx5IHRydWUsIGFzIDAqKm9vIG1heSBiZSAgICB8XG4gICAgfCAgICAgICAgICAgICAgfCAgICAgICAgIHwgb3NjaWxsYXRpbmcgYmV0d2VlbiBwb3NpdGl2ZSBhbmQgbmVnYXRpdmUgICAgIHxcbiAgICB8ICAgICAgICAgICAgICB8ICAgICAgICAgfCB2YWx1ZXMgb3Igcm90YXRpbmcgaW4gdGhlIGNvbXBsZXggcGxhbmUuICAgICAgfFxuICAgIHwgICAgICAgICAgICAgIHwgICAgICAgICB8IEl0IGlzIGNvbnZlbmllbnQsIGhvd2V2ZXIsIHdoZW4gdGhlIGJhc2UgICAgICB8XG4gICAgfCAgICAgICAgICAgICAgfCAgICAgICAgIHwgaXMgcG9zaXRpdmUuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHxcbiAgICArLS0tLS0tLS0tLS0tLS0rLS0tLS0tLS0tKy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tK1xuICAgIHwgMSoqb28gICAgICAgIHwgbmFuICAgICB8IEJlY2F1c2UgdGhlcmUgYXJlIHZhcmlvdXMgY2FzZXMgd2hlcmUgICAgICAgICB8XG4gICAgfCAxKiotb28gICAgICAgfCAgICAgICAgIHwgbGltKHgodCksdCk9MSwgbGltKHkodCksdCk9b28gKG9yIC1vbyksICAgICAgIHxcbiAgICB8ICAgICAgICAgICAgICB8ICAgICAgICAgfCBidXQgbGltKCB4KHQpKip5KHQpLCB0KSAhPSAxLiAgU2VlIFszXS4gICAgICAgfFxuICAgICstLS0tLS0tLS0tLS0tLSstLS0tLS0tLS0rLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0rXG4gICAgfCBiKip6b28gICAgICAgfCBuYW4gICAgIHwgQmVjYXVzZSBiKip6IGhhcyBubyBsaW1pdCBhcyB6IC0+IHpvbyAgICAgICAgIHxcbiAgICArLS0tLS0tLS0tLS0tLS0rLS0tLS0tLS0tKy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tK1xuICAgIHwgKC0xKSoqb28gICAgIHwgbmFuICAgICB8IEJlY2F1c2Ugb2Ygb3NjaWxsYXRpb25zIGluIHRoZSBsaW1pdC4gICAgICAgICB8XG4gICAgfCAoLTEpKiooLW9vKSAgfCAgICAgICAgIHwgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHxcbiAgICArLS0tLS0tLS0tLS0tLS0rLS0tLS0tLS0tKy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tK1xuICAgIHwgb28qKm9vICAgICAgIHwgb28gICAgICB8ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB8XG4gICAgKy0tLS0tLS0tLS0tLS0tKy0tLS0tLS0tLSstLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLStcbiAgICB8IG9vKiotb28gICAgICB8IDAgICAgICAgfCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfFxuICAgICstLS0tLS0tLS0tLS0tLSstLS0tLS0tLS0rLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0rXG4gICAgfCAoLW9vKSoqb28gICAgfCBuYW4gICAgIHwgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHxcbiAgICB8ICgtb28pKiotb28gICB8ICAgICAgICAgfCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfFxuICAgICstLS0tLS0tLS0tLS0tLSstLS0tLS0tLS0rLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0rXG4gICAgfCBvbyoqSSAgICAgICAgfCBuYW4gICAgIHwgb28qKmUgY291bGQgcHJvYmFibHkgYmUgYmVzdCB0aG91Z2h0IG9mIGFzICAgIHxcbiAgICB8ICgtb28pKipJICAgICB8ICAgICAgICAgfCB0aGUgbGltaXQgb2YgeCoqZSBmb3IgcmVhbCB4IGFzIHggdGVuZHMgdG8gICAgfFxuICAgIHwgICAgICAgICAgICAgIHwgICAgICAgICB8IG9vLiBJZiBlIGlzIEksIHRoZW4gdGhlIGxpbWl0IGRvZXMgbm90IGV4aXN0ICB8XG4gICAgfCAgICAgICAgICAgICAgfCAgICAgICAgIHwgYW5kIG5hbiBpcyB1c2VkIHRvIGluZGljYXRlIHRoYXQuICAgICAgICAgICAgIHxcbiAgICArLS0tLS0tLS0tLS0tLS0rLS0tLS0tLS0tKy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tK1xuICAgIHwgb28qKigxK0kpICAgIHwgem9vICAgICB8IElmIHRoZSByZWFsIHBhcnQgb2YgZSBpcyBwb3NpdGl2ZSwgdGhlbiB0aGUgICB8XG4gICAgfCAoLW9vKSoqKDErSSkgfCAgICAgICAgIHwgbGltaXQgb2YgYWJzKHgqKmUpIGlzIG9vLiBTbyB0aGUgbGltaXQgdmFsdWUgIHxcbiAgICB8ICAgICAgICAgICAgICB8ICAgICAgICAgfCBpcyB6b28uICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfFxuICAgICstLS0tLS0tLS0tLS0tLSstLS0tLS0tLS0rLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0rXG4gICAgfCBvbyoqKC0xK0kpICAgfCAwICAgICAgIHwgSWYgdGhlIHJlYWwgcGFydCBvZiBlIGlzIG5lZ2F0aXZlLCB0aGVuIHRoZSAgIHxcbiAgICB8IC1vbyoqKC0xK0kpICB8ICAgICAgICAgfCBsaW1pdCBpcyAwLiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfFxuICAgICstLS0tLS0tLS0tLS0tLSstLS0tLS0tLS0rLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0rXG4gICAgQmVjYXVzZSBzeW1ib2xpYyBjb21wdXRhdGlvbnMgYXJlIG1vcmUgZmxleGlibGUgdGhhbiBmbG9hdGluZyBwb2ludFxuICAgIGNhbGN1bGF0aW9ucyBhbmQgd2UgcHJlZmVyIHRvIG5ldmVyIHJldHVybiBhbiBpbmNvcnJlY3QgYW5zd2VyLFxuICAgIHdlIGNob29zZSBub3QgdG8gY29uZm9ybSB0byBhbGwgSUVFRSA3NTQgY29udmVudGlvbnMuICBUaGlzIGhlbHBzXG4gICAgdXMgYXZvaWQgZXh0cmEgdGVzdC1jYXNlIGNvZGUgaW4gdGhlIGNhbGN1bGF0aW9uIG9mIGxpbWl0cy5cbiAgICBTZWUgQWxzb1xuICAgID09PT09PT09XG4gICAgc3ltcHkuY29yZS5udW1iZXJzLkluZmluaXR5XG4gICAgc3ltcHkuY29yZS5udW1iZXJzLk5lZ2F0aXZlSW5maW5pdHlcbiAgICBzeW1weS5jb3JlLm51bWJlcnMuTmFOXG4gICAgUmVmZXJlbmNlc1xuICAgID09PT09PT09PT1cbiAgICAuLiBbMV0gaHR0cHM6Ly9lbi53aWtpcGVkaWEub3JnL3dpa2kvRXhwb25lbnRpYXRpb25cbiAgICAuLiBbMl0gaHR0cHM6Ly9lbi53aWtpcGVkaWEub3JnL3dpa2kvRXhwb25lbnRpYXRpb24jWmVyb190b190aGVfcG93ZXJfb2ZfemVyb1xuICAgIC4uIFszXSBodHRwczovL2VuLndpa2lwZWRpYS5vcmcvd2lraS9JbmRldGVybWluYXRlX2Zvcm1zXG4gICAgKi9cbiAgICBzdGF0aWMgaXNfUG93ID0gdHJ1ZTtcbiAgICBfX3Nsb3RzX18gPSBbXCJpc19jb21tdXRhdGl2ZVwiXTtcblxuICAgIC8vIHRvLWRvOiBuZWVkcyBzdXBwb3J0IGZvciBlXnhcbiAgICBjb25zdHJ1Y3RvcihiOiBhbnksIGU6IGFueSwgZXZhbHVhdGU6IGJvb2xlYW4gPSB1bmRlZmluZWQsIHNpbXBsaWZ5OiBib29sZWFuID0gdHJ1ZSkge1xuICAgICAgICBzdXBlcihiLCBlKTtcbiAgICAgICAgdGhpcy5fYXJncyA9IFtiLCBlXTtcbiAgICAgICAgaWYgKHR5cGVvZiBldmFsdWF0ZSA9PT0gXCJ1bmRlZmluZWRcIikge1xuICAgICAgICAgICAgZXZhbHVhdGUgPSBnbG9iYWxfcGFyYW1ldGVycy5ldmFsdWF0ZTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoc2ltcGxpZnkpIHtcbiAgICAgICAgICAgIGlmIChldmFsdWF0ZSkge1xuICAgICAgICAgICAgICAgIGlmIChlID09PSBTLkNvbXBsZXhJbmZpbml0eSkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gUy5OYU47XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGlmIChlID09PSBTLkluZmluaXR5KSB7XG4gICAgICAgICAgICAgICAgICAgIC8vIHRoaXMgcGFydCBpcyBub3QgZnVsbHkgZG9uZVxuICAgICAgICAgICAgICAgICAgICAvLyBzaG91bGQgYmUgdXBkYXRlZCB0byB1c2UgcmVsYXRpb25hbFxuICAgICAgICAgICAgICAgICAgICBpZiAoYi5pc19wb3NpdGl2ZSgpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gUy5JbmZpbml0eTtcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIGlmIChiLmlzX3plcm8oKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFMuWmVybztcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChiLmlzX2Zpbml0ZSgpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFMuQ29tcGxleEluZmluaXR5O1xuICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gUy5OYU47XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgaWYgKGUgPT09IFMuWmVybykge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gUy5PbmU7XG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmIChlID09PSBTLk9uZSkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gYjtcbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKGUgPT09IFMuTmVnYXRpdmVPbmUgJiYgIWIpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFMuQ29tcGxleEluZmluaXR5O1xuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoKGUuaXNfU3ltYm9sKCkgJiYgZS5pc19pbnRlZ2VyKCkgfHxcbiAgICAgICAgICAgICAgICAgICAgZS5pc19JbnRlZ2VyKCkgJiYgKGIuaXNfTnVtYmVyKCkgJiZcbiAgICAgICAgICAgICAgICAgICAgYi5pc19NdWwoKSB8fCBiLmlzX051bWJlcigpKSkgJiYgKGUuaXNfZXh0ZW5kZWRfbmVnYXRpdmUgPT09IHRydWUpKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChlLmlzX2V2ZW4oKSB8fCBlLmlzX2V2ZW4oKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgYiA9IGIuX19tdWxfXyhTLk5lZ2F0aXZlT25lKTtcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBuZXcgUG93KGIuX19tdWxfXyhTLk5lZ2F0aXZlT25lKSwgZSkuX19tdWxfXyhTLk5lZ2F0aXZlT25lKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAwLlxuICAgICAgICAgICAgICAgIGlmIChiID09PSBTLk5hTiB8fCBlID09PSBTLk5hTikge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gUy5OYU47XG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmIChiID09PSBTLk9uZSkge1xuICAgICAgICAgICAgICAgICAgICBpZiAoZS5pc19pbmZpbml0ZSgpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gUy5OYU47XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFMuT25lO1xuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoZS5pc19OdW1iZXIoKSAmJiBiLmlzX051bWJlcigpKSB7XG4gICAgICAgICAgICAgICAgICAgIC8vIGJhc2UgRSBzdHVmZiBub3QgeWV0IGltcGxlbWVudGVkXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IG9iaiA9IGIuX2V2YWxfcG93ZXIoZSk7XG4gICAgICAgICAgICAgICAgICAgIGlmICh0eXBlb2Ygb2JqICE9PSBcInVuZGVmaW5lZFwiKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBvYmouaXNfY29tbXV0YXRpdmUgPSAoKSA9PiAoYi5pc19jb21tdXRhdGl2ZSgpICYmIGUuaXNfY29tbXV0YXRpdmUoKSk7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gb2JqO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHRoaXMuaXNfY29tbXV0YXRpdmUgPSAoKSA9PiAoYi5pc19jb21tdXRhdGl2ZSgpICYmIGUuaXNfY29tbXV0YXRpdmUoKSk7XG4gICAgfVxuXG4gICAgYXNfYmFzZV9leHAoKSB7XG4gICAgICAgIGNvbnN0IGIgPSB0aGlzLl9hcmdzWzBdO1xuICAgICAgICBjb25zdCBlID0gdGhpcy5fYXJnc1sxXTtcbiAgICAgICAgaWYgKGIuaXNfUmF0aW9uYWwgJiYgYi5wID09PSAxICYmIGIucSAhPT0gMSkge1xuICAgICAgICAgICAgY29uc3QgcDEgPSBfTnVtYmVyXy5uZXcoYi5xKTtcbiAgICAgICAgICAgIGNvbnN0IHAyID0gZS5fX211bF9fKFMuTmVnYXRpdmVPbmUpO1xuICAgICAgICAgICAgcmV0dXJuIFtwMSwgcDJdO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBbYiwgZV07XG4gICAgfVxuXG4gICAgc3RhdGljIF9uZXcoYjogYW55LCBlOiBhbnkpIHtcbiAgICAgICAgcmV0dXJuIG5ldyBQb3coYiwgZSk7XG4gICAgfVxuXG4gICAgLy8gV0IgYWRkaXRpb24gZm9yIGphc21pbmUgdGVzdHNcbiAgICB0b1N0cmluZygpIHtcbiAgICAgICAgY29uc3QgYiA9IHRoaXMuX2FyZ3NbMF0udG9TdHJpbmcoKTtcbiAgICAgICAgY29uc3QgZSA9IHRoaXMuX2FyZ3NbMV0udG9TdHJpbmcoKTtcbiAgICAgICAgcmV0dXJuIGIgKyBcIl5cIiArIGU7XG4gICAgfVxufVxuXG5NYW5hZ2VkUHJvcGVydGllcy5yZWdpc3RlcihQb3cpO1xuR2xvYmFsLnJlZ2lzdGVyKFwiUG93XCIsIFBvdy5fbmV3KTtcblxuLy8gaW1wbGVtZW50ZWQgZGlmZmVyZW50IHRoYW4gc3ltcHksIGJ1dCBoYXMgc2FtZSBmdW5jdGlvbmFsaXR5IChmb3Igbm93KVxuZXhwb3J0IGZ1bmN0aW9uIG5yb290KHk6IG51bWJlciwgbjogbnVtYmVyKSB7XG4gICAgY29uc3QgeCA9IE1hdGguZmxvb3IoeSAqKiAoMSAvIG4pKTtcbiAgICByZXR1cm4gW3gsIHgqKm4gPT09IHldO1xufVxuIiwgIi8qXG5Ob3RhYmxlIGNoYW5nZXMgbWFkZSAoYW5kIG5vdGVzKTpcbi0gTnVtYmVyIGNsYXNzZXMgcmVnaXN0ZXJlZCBhZnRlciB0aGV5IGFyZSBkZWZpbmVkXG4tIEZsb2F0IGlzIGhhbmRlbGVkIGVudGlyZWx5IGJ5IGRlY2ltYWwuanMsIGFuZCBub3cgb25seSB0YWtlcyBwcmVjaXNpb24gaW5cbiAgIyBvZiBkZWNpbWFsIHBvaW50c1xuLSBOb3RlOiBvbmx5IG1ldGhvZHMgbmVjZXNzYXJ5IGZvciBhZGQsIG11bCwgYW5kIHBvdyBoYXZlIGJlZW4gaW1wbGVtZW50ZWRcbi0gVE9ETzogbmVlZHMgbW9yZSBfZXZhbF9pcyBwcm9wZXJ0aWVzIGFuZCBuZWVkIHRvIGRlYnVnIHJhdGlvbmFsIGV2YWwgcG93ZXJcbiovXG5cbi8vIGJhc2ljIGltcGxlbWVudGF0aW9ucyBvbmx5IC0gbm8gdXRpbGl0eSBhZGRlZCB5ZXRcbmltcG9ydCB7X0F0b21pY0V4cHJ9IGZyb20gXCIuL2V4cHJcIjtcbmltcG9ydCB7TnVtYmVyS2luZH0gZnJvbSBcIi4va2luZFwiO1xuaW1wb3J0IHtNYW5hZ2VkUHJvcGVydGllc30gZnJvbSBcIi4vYXNzdW1wdGlvbnNcIjtcbmltcG9ydCB7Z2xvYmFsX3BhcmFtZXRlcnN9IGZyb20gXCIuL3BhcmFtZXRlcnNcIjtcbmltcG9ydCB7QWRkfSBmcm9tIFwiLi9hZGRcIjtcbmltcG9ydCB7UywgU2luZ2xldG9ufSBmcm9tIFwiLi9zaW5nbGV0b25cIjtcbmltcG9ydCBEZWNpbWFsIGZyb20gXCJkZWNpbWFsLmpzXCI7XG5pbXBvcnQge2FzX2ludH0gZnJvbSBcIi4uL3V0aWxpdGllcy9taXNjXCI7XG5pbXBvcnQge1Bvd30gZnJvbSBcIi4vcG93ZXJcIjtcbmltcG9ydCB7R2xvYmFsfSBmcm9tIFwiLi9nbG9iYWxcIjtcbmltcG9ydCB7ZGl2bW9kLCBmYWN0b3JpbnQsIGZhY3RvcnJhdCwgcGVyZmVjdF9wb3dlcn0gZnJvbSBcIi4uL250aGVvcnkvZmFjdG9yX1wiO1xuaW1wb3J0IHtIYXNoRGljdH0gZnJvbSBcIi4vdXRpbGl0eVwiO1xuaW1wb3J0IHtNdWx9IGZyb20gXCIuL211bFwiO1xuXG4vKlxudXRpbGl0eSBmdW5jdGlvbnNcblxuVGhlc2UgYXJlIHNvbWV3aGF0IHdyaXR0ZW4gZGlmZmVyZW50bHkgdGhhbiBpbiBzeW1weSAod2hpY2ggZGVwZW5kcyBvbiBtcG1hdGgpXG5idXQgdGhleSBwcm92aWRlIHRoZSBzYW1lIGZ1bmN0aW9uYWxpdHlcbiovXG5cbmZ1bmN0aW9uIGlnY2QoeDogbnVtYmVyLCB5OiBudW1iZXIpIHtcbiAgICB3aGlsZSAoeSkge1xuICAgICAgICBjb25zdCB0ID0geTtcbiAgICAgICAgeSA9IHggJSB5O1xuICAgICAgICB4ID0gdDtcbiAgICB9XG4gICAgcmV0dXJuIHg7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBpbnRfbnRocm9vdCh5OiBudW1iZXIsIG46IG51bWJlcikge1xuICAgIGNvbnN0IHggPSBNYXRoLmZsb29yKHkqKigxL24pKTtcbiAgICBjb25zdCBpc2V4YWN0ID0geCoqbiA9PT0geTtcbiAgICByZXR1cm4gW3gsIGlzZXhhY3RdO1xufVxuXG4vLyB0dXJuIGEgZmxvYXQgdG8gYSByYXRpb25hbCAtPiByZXBsaWFjYXRlcyBtcG1hdGggZnVuY3Rpb25hbGl0eSBidXQgd2Ugc2hvdWxkXG4vLyBwcm9iYWJseSBmaW5kIGEgbGlicmFyeSB0byBkbyB0aGlzIGV2ZW50dWFsbHlcbmZ1bmN0aW9uIHRvUmF0aW8objogYW55LCBlcHM6IG51bWJlcikge1xuICAgIGNvbnN0IGdjZGUgPSAoZTogbnVtYmVyLCB4OiBudW1iZXIsIHk6IG51bWJlcikgPT4ge1xuICAgICAgICBjb25zdCBfZ2NkOiBhbnkgPSAoYTogbnVtYmVyLCBiOiBudW1iZXIpID0+IChiIDwgZSA/IGEgOiBfZ2NkKGIsIGEgJSBiKSk7XG4gICAgICAgIHJldHVybiBfZ2NkKE1hdGguYWJzKHgpLCBNYXRoLmFicyh5KSk7XG4gICAgfTtcbiAgICBjb25zdCBjID0gZ2NkZShCb29sZWFuKGVwcykgPyBlcHMgOiAoMSAvIDEwMDAwKSwgMSwgbik7XG4gICAgcmV0dXJuIFtNYXRoLmZsb29yKG4gLyBjKSwgTWF0aC5mbG9vcigxIC8gYyldO1xufVxuXG5mdW5jdGlvbiBpZ2NkZXgoYTogbnVtYmVyID0gdW5kZWZpbmVkLCBiOiBudW1iZXIgPSB1bmRlZmluZWQpIHtcbiAgICBpZiAodHlwZW9mIGEgPT09IFwidW5kZWZpbmVkXCIgJiYgdHlwZW9mIGIgPT09IFwidW5kZWZpbmVkXCIpIHtcbiAgICAgICAgcmV0dXJuIFswLCAxLCAwXTtcbiAgICB9XG5cbiAgICBpZiAodHlwZW9mIGEgPT09IFwidW5kZWZpbmVkXCIpIHtcbiAgICAgICAgcmV0dXJuIFswLCBNYXRoLmZsb29yKGIgLyBNYXRoLmFicyhiKSksIE1hdGguYWJzKGIpXTtcbiAgICB9XG5cbiAgICBpZiAodHlwZW9mIGIgPT09IFwidW5kZWZpbmVkXCIpIHtcbiAgICAgICAgcmV0dXJuIFtNYXRoLmZsb29yKGEgLyBNYXRoLmFicyhhKSksIDAsIE1hdGguYWJzKGEpXTtcbiAgICB9XG4gICAgbGV0IHhfc2lnbjtcbiAgICBsZXQgeV9zaWduO1xuICAgIGlmIChhIDwgMCkge1xuICAgICAgICBhID0gLTE7XG4gICAgICAgIHhfc2lnbiA9IC0xO1xuICAgIH0gZWxzZSB7XG4gICAgICAgIHhfc2lnbiA9IDE7XG4gICAgfVxuICAgIGlmIChiIDwgMCkge1xuICAgICAgICBiID0gLWI7XG4gICAgICAgIHlfc2lnbiA9IC0xO1xuICAgIH0gZWxzZSB7XG4gICAgICAgIHlfc2lnbiA9IDE7XG4gICAgfVxuXG4gICAgbGV0IFt4LCB5LCByLCBzXSA9IFsxLCAwLCAwLCAxXTtcbiAgICBsZXQgYzsgbGV0IHE7XG4gICAgd2hpbGUgKGIpIHtcbiAgICAgICAgW2MsIHFdID0gW2EgJSBiLCBNYXRoLmZsb29yKGEgLyBiKV07XG4gICAgICAgIFthLCBiLCByLCBzLCB4LCB5XSA9IFtiLCBjLCB4IC0gcSAqIHIsIHkgLSBxICogcywgciwgc107XG4gICAgfVxuICAgIHJldHVybiBbeCAqIHhfc2lnbiwgeSAqIHlfc2lnbiwgYV07XG59XG5cbmZ1bmN0aW9uIG1vZF9pbnZlcnNlKGE6IGFueSwgbTogYW55KSB7XG4gICAgbGV0IGMgPSB1bmRlZmluZWQ7XG4gICAgW2EsIG1dID0gW2FzX2ludChhKSwgYXNfaW50KG0pXTtcbiAgICBpZiAobSAhPT0gMSAmJiBtICE9PSAtMSkge1xuICAgICAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tdW51c2VkLXZhcnNcbiAgICAgICAgY29uc3QgW3gsIGIsIGddID0gaWdjZGV4KGEsIG0pO1xuICAgICAgICBpZiAoZyA9PT0gMSkge1xuICAgICAgICAgICAgYyA9IHggJiBtO1xuICAgICAgICB9XG4gICAgfVxuICAgIHJldHVybiBjO1xufVxuXG5HbG9iYWwucmVnaXN0ZXJmdW5jKFwibW9kX2ludmVyc2VcIiwgbW9kX2ludmVyc2UpO1xuXG5jbGFzcyBfTnVtYmVyXyBleHRlbmRzIF9BdG9taWNFeHByIHtcbiAgICAvKlxuICAgIFJlcHJlc2VudHMgYXRvbWljIG51bWJlcnMgaW4gU3ltUHkuXG4gICAgRXhwbGFuYXRpb25cbiAgICA9PT09PT09PT09PVxuICAgIEZsb2F0aW5nIHBvaW50IG51bWJlcnMgYXJlIHJlcHJlc2VudGVkIGJ5IHRoZSBGbG9hdCBjbGFzcy5cbiAgICBSYXRpb25hbCBudW1iZXJzIChvZiBhbnkgc2l6ZSkgYXJlIHJlcHJlc2VudGVkIGJ5IHRoZSBSYXRpb25hbCBjbGFzcy5cbiAgICBJbnRlZ2VyIG51bWJlcnMgKG9mIGFueSBzaXplKSBhcmUgcmVwcmVzZW50ZWQgYnkgdGhlIEludGVnZXIgY2xhc3MuXG4gICAgRmxvYXQgYW5kIFJhdGlvbmFsIGFyZSBzdWJjbGFzc2VzIG9mIE51bWJlcjsgSW50ZWdlciBpcyBhIHN1YmNsYXNzXG4gICAgb2YgUmF0aW9uYWwuXG4gICAgRm9yIGV4YW1wbGUsIGBgMi8zYGAgaXMgcmVwcmVzZW50ZWQgYXMgYGBSYXRpb25hbCgyLCAzKWBgIHdoaWNoIGlzXG4gICAgYSBkaWZmZXJlbnQgb2JqZWN0IGZyb20gdGhlIGZsb2F0aW5nIHBvaW50IG51bWJlciBvYnRhaW5lZCB3aXRoXG4gICAgUHl0aG9uIGRpdmlzaW9uIGBgMi8zYGAuIEV2ZW4gZm9yIG51bWJlcnMgdGhhdCBhcmUgZXhhY3RseVxuICAgIHJlcHJlc2VudGVkIGluIGJpbmFyeSwgdGhlcmUgaXMgYSBkaWZmZXJlbmNlIGJldHdlZW4gaG93IHR3byBmb3JtcyxcbiAgICBzdWNoIGFzIGBgUmF0aW9uYWwoMSwgMilgYCBhbmQgYGBGbG9hdCgwLjUpYGAsIGFyZSB1c2VkIGluIFN5bVB5LlxuICAgIFRoZSByYXRpb25hbCBmb3JtIGlzIHRvIGJlIHByZWZlcnJlZCBpbiBzeW1ib2xpYyBjb21wdXRhdGlvbnMuXG4gICAgT3RoZXIga2luZHMgb2YgbnVtYmVycywgc3VjaCBhcyBhbGdlYnJhaWMgbnVtYmVycyBgYHNxcnQoMilgYCBvclxuICAgIGNvbXBsZXggbnVtYmVycyBgYDMgKyA0KklgYCwgYXJlIG5vdCBpbnN0YW5jZXMgb2YgTnVtYmVyIGNsYXNzIGFzXG4gICAgdGhleSBhcmUgbm90IGF0b21pYy5cbiAgICBTZWUgQWxzb1xuICAgID09PT09PT09XG4gICAgRmxvYXQsIEludGVnZXIsIFJhdGlvbmFsXG4gICAgKi9cbiAgICBzdGF0aWMgaXNfY29tbXV0YXRpdmUgPSB0cnVlO1xuICAgIHN0YXRpYyBpc19udW1iZXIgPSB0cnVlO1xuICAgIHN0YXRpYyBpc19OdW1iZXIgPSB0cnVlO1xuICAgIHN0YXRpYyBraW5kID0gTnVtYmVyS2luZDtcblxuICAgIHN0YXRpYyBuZXcoLi4ub2JqOiBhbnkpIHtcbiAgICAgICAgaWYgKG9iai5sZW5ndGggPT09IDEpIHtcbiAgICAgICAgICAgIG9iaiA9IG9ialswXTtcbiAgICAgICAgfVxuICAgICAgICBpZiAob2JqIGluc3RhbmNlb2YgX051bWJlcl8pIHtcbiAgICAgICAgICAgIHJldHVybiBvYmo7XG4gICAgICAgIH0gZWxzZSBpZiAodHlwZW9mIG9iaiA9PT0gXCJudW1iZXJcIiAmJiAhTnVtYmVyLmlzSW50ZWdlcihvYmopIHx8IG9iaiBpbnN0YW5jZW9mIERlY2ltYWwgfHwgdHlwZW9mIG9iaiA9PT0gXCJzdHJpbmdcIikge1xuICAgICAgICAgICAgcmV0dXJuIG5ldyBGbG9hdChvYmopO1xuICAgICAgICB9IGVsc2UgaWYgKE51bWJlci5pc0ludGVnZXIob2JqKSkge1xuICAgICAgICAgICAgcmV0dXJuIG5ldyBJbnRlZ2VyKG9iaik7XG4gICAgICAgIH0gZWxzZSBpZiAob2JqLmxlbmd0aCA9PT0gMikge1xuICAgICAgICAgICAgcmV0dXJuIG5ldyBSYXRpb25hbChvYmpbMF0sIG9ialsxXSk7XG4gICAgICAgIH0gZWxzZSBpZiAodHlwZW9mIG9iaiA9PT0gXCJzdHJpbmdcIikge1xuICAgICAgICAgICAgY29uc3QgX29iaiA9IG9iai50b0xvd2VyQ2FzZSgpO1xuICAgICAgICAgICAgaWYgKF9vYmogPT09IFwibmFuXCIpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gUy5OYU47XG4gICAgICAgICAgICB9IGVsc2UgaWYgKF9vYmogPT09IFwiaW5mXCIpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gUy5JbmZpbml0eTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoX29iaiA9PT0gXCIraW5mXCIpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gUy5JbmZpbml0eTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoX29iaiA9PT0gXCItaW5mXCIpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gUy5OZWdhdGl2ZUluZmluaXR5O1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJhcmd1bWVudCBmb3IgbnVtYmVyIGlzIGludmFsaWRcIik7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiYXJndW1lbnQgZm9yIG51bWJlciBpcyBpbnZhbGlkXCIpO1xuICAgIH1cblxuICAgIGFzX2NvZWZmX011bChyYXRpb25hbDogYm9vbGVhbiA9IGZhbHNlKSB7XG4gICAgICAgIGlmIChyYXRpb25hbCAmJiAhdGhpcy5pc19SYXRpb25hbCkge1xuICAgICAgICAgICAgcmV0dXJuIFtTLk9uZSwgdGhpc107XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHRoaXMpIHtcbiAgICAgICAgICAgIHJldHVybiBbdGhpcywgUy5PbmVdO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuIFtTLk9uZSwgdGhpc107XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBhc19jb2VmZl9BZGQoKSB7XG4gICAgICAgIHJldHVybiBbdGhpcywgUy5aZXJvXTtcbiAgICB9XG5cbiAgICAvLyBOT1RFOiBUSEVTRSBNRVRIT0RTIEFSRSBOT1QgWUVUIElNUExFTUVOVEVEIElOIFRIRSBTVVBFUkNMQVNTXG5cbiAgICBfX2FkZF9fKG90aGVyOiBhbnkpIHtcbiAgICAgICAgaWYgKG90aGVyIGluc3RhbmNlb2YgX051bWJlcl8gJiYgZ2xvYmFsX3BhcmFtZXRlcnMuZXZhbHVhdGUpIHtcbiAgICAgICAgICAgIGlmIChvdGhlciA9PT0gUy5OYU4pIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gUy5OYU47XG4gICAgICAgICAgICB9IGVsc2UgaWYgKG90aGVyID09PSBTLkluZmluaXR5KSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIFMuSW5maW5pdHk7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKG90aGVyID09PSBTLk5lZ2F0aXZlSW5maW5pdHkpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gUy5OZWdhdGl2ZUluZmluaXR5O1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBzdXBlci5fX2FkZF9fKG90aGVyKTtcbiAgICB9XG5cbiAgICBfX3N1Yl9fKG90aGVyOiBhbnkpIHtcbiAgICAgICAgaWYgKG90aGVyIGluc3RhbmNlb2YgX051bWJlcl8gJiYgZ2xvYmFsX3BhcmFtZXRlcnMuZXZhbHVhdGUpIHtcbiAgICAgICAgICAgIGlmIChvdGhlciA9PT0gUy5OYU4pIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gUy5OYU47XG4gICAgICAgICAgICB9IGVsc2UgaWYgKG90aGVyID09PSBTLkluZmluaXR5KSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIFMuTmVnYXRpdmVJbmZpbml0eTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAob3RoZXIgPT09IFMuTmVnYXRpdmVJbmZpbml0eSkge1xuICAgICAgICAgICAgICAgIHJldHVybiBTLkluZmluaXR5O1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBzdXBlci5fX3N1Yl9fKG90aGVyKTtcbiAgICB9XG5cbiAgICBfX211bF9fKG90aGVyOiBhbnkpIHtcbiAgICAgICAgaWYgKG90aGVyIGluc3RhbmNlb2YgX051bWJlcl8gJiYgZ2xvYmFsX3BhcmFtZXRlcnMuZXZhbHVhdGUpIHtcbiAgICAgICAgICAgIGlmIChvdGhlciA9PT0gUy5OYW4pIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gUy5OYW47XG4gICAgICAgICAgICB9IGVsc2UgaWYgKG90aGVyID09PSBTLkluZmluaXR5KSB7XG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuaXNfemVybygpKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBTLk5hTjtcbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKHRoaXMuaXNfcG9zaXRpdmUoKSkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gUy5JbmZpbml0eTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gUy5OZWdhdGl2ZUluZmluaXR5O1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0gZWxzZSBpZiAob3RoZXIgPT09IFMuTmVnYXRpdmVJbmZpbml0eSkge1xuICAgICAgICAgICAgICAgIGlmICh0aGlzLmlzX3plcm8oKSkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gUy5OYU47XG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmICh0aGlzLmlzX3Bvc2l0aXZlKCkpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFMuTmVnYXRpdmVJbmZpbml0eTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gUy5JbmZpbml0eTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHN1cGVyLl9fbXVsX18ob3RoZXIpO1xuICAgIH1cbiAgICBfX3RydWVkaXZfXyhvdGhlcjogYW55KSB7XG4gICAgICAgIGlmIChvdGhlciBpbnN0YW5jZW9mIF9OdW1iZXJfICYmIGdsb2JhbF9wYXJhbWV0ZXJzLmV2YWx1YXRlKSB7XG4gICAgICAgICAgICBpZiAob3RoZXIgPT09IFMuTmFOKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIFMuTmFOO1xuICAgICAgICAgICAgfSBlbHNlIGlmIChvdGhlciA9PT0gUy5JbmZpbml0eSB8fCBvdGhlciA9PT0gUy5OZWdhdGl2ZUluZmluaXR5KSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIFMuWmVybztcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gc3VwZXIuX190cnVlZGl2X18ob3RoZXIpO1xuICAgIH1cblxuICAgIGV2YWxfZXZhbGYocHJlYzogbnVtYmVyKSB7XG4gICAgICAgIHJldHVybiBuZXcgRmxvYXQodGhpcy5fZmxvYXRfdmFsKHByZWMpLCBwcmVjKTtcbiAgICB9XG5cbiAgICBfZmxvYXRfdmFsKHByZWM6IG51bWJlcik6IGFueSB7XG4gICAgICAgIHJldHVybiB1bmRlZmluZWQ7XG4gICAgfVxufTtcblxuLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5ldy1jYXBcbk1hbmFnZWRQcm9wZXJ0aWVzLnJlZ2lzdGVyKF9OdW1iZXJfKTtcbkdsb2JhbC5yZWdpc3RlcihcIl9OdW1iZXJfXCIsIF9OdW1iZXJfLm5ldyk7XG5cbmNsYXNzIEZsb2F0IGV4dGVuZHMgX051bWJlcl8ge1xuICAgIC8qXG4gICAgKG5vdCBjb3B5aW5nIHN5bXB5IGNvbW1lbnQgYmVjYXVzZSB0aGlzIGltcGxlbWVudGF0aW9uIGlzIHZlcnkgZGlmZmVyZW50KVxuICAgIHNlZSBoZWFkZXIgY29tbWVudCBmb3IgY2hhbmdlc1xuICAgICovXG4gICAgX19zbG90c19fOiBhbnlbXSA9IFtcIl9tcGZfXCIsIFwiX3ByZWNcIl07XG4gICAgX21wZl86IFtudW1iZXIsIG51bWJlciwgbnVtYmVyLCBudW1iZXJdO1xuICAgIHN0YXRpYyBpc19yYXRpb25hbDogYW55ID0gdW5kZWZpbmVkO1xuICAgIHN0YXRpYyBpc19pcnJhdGlvbmFsOiBhbnkgPSB1bmRlZmluZWQ7XG4gICAgc3RhdGljIGlzX251bWJlciA9IHRydWU7XG4gICAgc3RhdGljIGlzX3JlYWwgPSB0cnVlO1xuICAgIHN0YXRpYyBpc19leHRlbmRlZF9yZWFsID0gdHJ1ZTtcbiAgICBzdGF0aWMgaXNfRmxvYXQgPSB0cnVlO1xuICAgIGRlY2ltYWw6IERlY2ltYWw7XG4gICAgcHJlYzogbnVtYmVyO1xuXG4gICAgY29uc3RydWN0b3IobnVtOiBhbnksIHByZWM6IGFueSA9IDE1KSB7XG4gICAgICAgIHN1cGVyKCk7XG4gICAgICAgIHRoaXMucHJlYyA9IHByZWM7XG4gICAgICAgIGlmICh0eXBlb2YgbnVtICE9PSBcInVuZGVmaW5lZFwiKSB7XG4gICAgICAgICAgICBpZiAobnVtIGluc3RhbmNlb2YgRmxvYXQpIHtcbiAgICAgICAgICAgICAgICB0aGlzLmRlY2ltYWwgPSBudW0uZGVjaW1hbDtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAobnVtIGluc3RhbmNlb2YgRGVjaW1hbCkge1xuICAgICAgICAgICAgICAgIHRoaXMuZGVjaW1hbCA9IG51bTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgdGhpcy5kZWNpbWFsID0gbmV3IERlY2ltYWwobnVtKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgIF9fYWRkX18ob3RoZXI6IGFueSkge1xuICAgICAgICBpZiAoZ2xvYmFsX3BhcmFtZXRlcnMuZXZhbHVhdGUgJiYgb3RoZXIgaW5zdGFuY2VvZiBfTnVtYmVyXykge1xuICAgICAgICAgICAgY29uc3QgdmFsID0gb3RoZXIuX2Zsb2F0X3ZhbCh0aGlzLnByZWMpO1xuICAgICAgICAgICAgcmV0dXJuIG5ldyBGbG9hdChEZWNpbWFsLnNldCh7cHJlY2lzaW9uOiB0aGlzLnByZWN9KS5hZGQodGhpcy5kZWNpbWFsLCB2YWwuZGVjaW1hbCksIHRoaXMucHJlYyk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHN1cGVyLl9fYWRkX18ob3RoZXIpO1xuICAgIH1cblxuICAgIF9fc3ViX18ob3RoZXI6IGFueSkge1xuICAgICAgICBpZiAoZ2xvYmFsX3BhcmFtZXRlcnMuZXZhbHVhdGUgJiYgb3RoZXIgaW5zdGFuY2VvZiBfTnVtYmVyXykge1xuICAgICAgICAgICAgY29uc3QgdmFsID0gb3RoZXIuX2Zsb2F0X3ZhbCh0aGlzLnByZWMpO1xuICAgICAgICAgICAgcmV0dXJuIG5ldyBGbG9hdChEZWNpbWFsLnNldCh7cHJlY2lzaW9uOiB0aGlzLnByZWN9KS5zdWIodGhpcy5kZWNpbWFsLCB2YWwuZGVjaW1hbCksIHRoaXMucHJlYyk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHN1cGVyLl9fc3ViX18ob3RoZXIpO1xuICAgIH1cblxuICAgIF9fbXVsX18ob3RoZXI6IGFueSkge1xuICAgICAgICBpZiAoZ2xvYmFsX3BhcmFtZXRlcnMuZXZhbHVhdGUgJiYgb3RoZXIgaW5zdGFuY2VvZiBfTnVtYmVyXykge1xuICAgICAgICAgICAgY29uc3QgdmFsID0gb3RoZXIuX2Zsb2F0X3ZhbCh0aGlzLnByZWMpO1xuICAgICAgICAgICAgcmV0dXJuIG5ldyBGbG9hdChEZWNpbWFsLnNldCh7cHJlY2lzaW9uOiB0aGlzLnByZWN9KS5tdWwodGhpcy5kZWNpbWFsLCB2YWwuZGVjaW1hbCksIHRoaXMucHJlYyk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHN1cGVyLl9fbXVsX18ob3RoZXIpO1xuICAgIH1cblxuICAgIF9fdHJ1ZWRpdl9fKG90aGVyOiBhbnkpIHtcbiAgICAgICAgaWYgKGdsb2JhbF9wYXJhbWV0ZXJzLmV2YWx1YXRlICYmIG90aGVyIGluc3RhbmNlb2YgX051bWJlcl8pIHtcbiAgICAgICAgICAgIGNvbnN0IHZhbCA9IG90aGVyLl9mbG9hdF92YWwodGhpcy5wcmVjKTtcbiAgICAgICAgICAgIHJldHVybiBuZXcgRmxvYXQoRGVjaW1hbC5zZXQoe3ByZWNpc2lvbjogdGhpcy5wcmVjfSkuZGl2KHRoaXMuZGVjaW1hbCwgdmFsLmRlY2ltYWwpLCB0aGlzLnByZWMpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBzdXBlci5fX2Rpdl9fKG90aGVyKTtcbiAgICB9XG5cbiAgICBfZXZhbF9pc19uZWdhdGl2ZSgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuZGVjaW1hbC5sZXNzVGhhbigwKTtcbiAgICB9XG5cbiAgICBfZXZhbF9pc19wb3NpdGl2ZSgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuZGVjaW1hbC5ncmVhdGVyVGhhbigwKTtcbiAgICB9XG5cbiAgICAvLyByZXR1cm4gbmV3IEZsb2F0KERlY2ltYWwuc2V0KHtwcmVjaXNpb246IHRoaXMucHJlY30pLnBvdyh0aGlzLmRlY2ltYWwsIG90aGVyLmV2YWxfZXZhbGYodGhpcy5wcmVjKS5kZWNpbWFsKSwgdGhpcy5wcmVjKTtcblxuICAgIF9ldmFsX3Bvd2VyKGV4cHQ6IGFueSkge1xuICAgICAgICBpZiAodGhpcyA9PT0gUy5aZXJvKSB7XG4gICAgICAgICAgICBpZiAoZXhwdC5pc19leHRlbmRlZF9wb3NpdGl2ZSkge1xuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgICAgICAgfSBpZiAoZXhwdC5pc19leHRlbmRlZF9uZWdhdGl2ZSkge1xuICAgICAgICAgICAgICAgIHJldHVybiBTLkNvbXBsZXhJbmZpbml0eTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBpZiAoZXhwdCBpbnN0YW5jZW9mIF9OdW1iZXJfKSB7XG4gICAgICAgICAgICBpZiAoZXhwdCBpbnN0YW5jZW9mIEludGVnZXIpIHtcbiAgICAgICAgICAgICAgICBjb25zdCBwcmVjID0gdGhpcy5wcmVjO1xuICAgICAgICAgICAgICAgIHJldHVybiBuZXcgRmxvYXQoRGVjaW1hbC5zZXQoe3ByZWNpc2lvbjogdGhpcy5wcmVjfSkucG93KHRoaXMuZGVjaW1hbCwgZXhwdC5wKSwgcHJlYyk7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKGV4cHQgaW5zdGFuY2VvZiBSYXRpb25hbCAmJlxuICAgICAgICAgICAgICAgIGV4cHQucCA9PT0gMSAmJiBleHB0LnEgJSAyICE9PSAwICYmIHRoaXMuaXNfbmVnYXRpdmUoKSkge1xuICAgICAgICAgICAgICAgIGNvbnN0IG5lZ3BhcnQgPSAodGhpcy5fX211bF9fKFMuTmVnYXRpdmVPbmUpKS5fZXZhbF9wb3dlcihleHB0KTtcbiAgICAgICAgICAgICAgICByZXR1cm4gbmV3IE11bCh0cnVlLCB0cnVlLCBuZWdwYXJ0LCBuZXcgUG93KFMuTmVnYXRpdmVPbmUsIGV4cHQsIGZhbHNlKSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBjb25zdCB2YWwgPSBleHB0Ll9mbG9hdF92YWwodGhpcy5wcmVjKS5kZWNpbWFsO1xuICAgICAgICAgICAgY29uc3QgcmVzID0gRGVjaW1hbC5zZXQoe3ByZWNpc2lvbjogdGhpcy5wcmVjfSkucG93KHRoaXMuZGVjaW1hbCwgdmFsKTtcbiAgICAgICAgICAgIGlmIChyZXMuaXNOYU4oKSkge1xuICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcImNvbXBsZXggYW5kIGltYWdpbmFyeSBudW1iZXJzIG5vdCB5ZXQgaW1wbGVtZW50ZWRcIik7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gbmV3IEZsb2F0KHJlcyk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBfZmxvYXRfdmFsKHByZWM6IG51bWJlcik6IGFueSB7XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cblxuICAgIGludmVyc2UoKSB7XG4gICAgICAgIHJldHVybiBuZXcgRmxvYXQoMS8odGhpcy5kZWNpbWFsIGFzIGFueSkpO1xuICAgIH1cblxuICAgIF9ldmFsX2lzX2Zpbml0ZSgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuZGVjaW1hbC5pc0Zpbml0ZSgpO1xuICAgIH1cblxuICAgIHRvU3RyaW5nKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5kZWNpbWFsLnRvU3RyaW5nKClcbiAgICB9XG59XG5cbk1hbmFnZWRQcm9wZXJ0aWVzLnJlZ2lzdGVyKEZsb2F0KTtcblxuXG5jbGFzcyBSYXRpb25hbCBleHRlbmRzIF9OdW1iZXJfIHtcbiAgICBzdGF0aWMgaXNfcmVhbCA9IHRydWU7XG4gICAgc3RhdGljIGlzX2ludGVnZXIgPSBmYWxzZTtcbiAgICBzdGF0aWMgaXNfcmF0aW9uYWwgPSB0cnVlO1xuICAgIHN0YXRpYyBpc19udW1iZXIgPSB0cnVlO1xuICAgIHA6IG51bWJlcjtcbiAgICBxOiBudW1iZXI7XG4gICAgX19zbG90c19fOiBhbnlbXSA9IFtcInBcIiwgXCJxXCJdO1xuXG4gICAgc3RhdGljIGlzX1JhdGlvbmFsID0gdHJ1ZTtcblxuXG4gICAgY29uc3RydWN0b3IocDogYW55LCBxOiBhbnkgPSB1bmRlZmluZWQsIGdjZDogbnVtYmVyID0gdW5kZWZpbmVkLCBzaW1wbGlmeTogYm9vbGVhbiA9IHRydWUpIHtcbiAgICAgICAgc3VwZXIoKTtcbiAgICAgICAgaWYgKHR5cGVvZiBxID09PSBcInVuZGVmaW5lZFwiKSB7XG4gICAgICAgICAgICBpZiAocCBpbnN0YW5jZW9mIFJhdGlvbmFsKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHA7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGlmICh0eXBlb2YgcCA9PT0gXCJudW1iZXJcIiAmJiBwICUgMSAhPT0gMCkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gbmV3IFJhdGlvbmFsKHRvUmF0aW8ocCwgMC4wMDAxKSk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHt9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBxID0gMTtcbiAgICAgICAgICAgIGdjZCA9IDE7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKCFOdW1iZXIuaXNJbnRlZ2VyKHApKSB7XG4gICAgICAgICAgICBwID0gbmV3IFJhdGlvbmFsKHApO1xuICAgICAgICAgICAgcSAqPSBwLnE7XG4gICAgICAgICAgICBwID0gcC5wO1xuICAgICAgICB9XG4gICAgICAgIGlmICghTnVtYmVyLmlzSW50ZWdlcihxKSkge1xuICAgICAgICAgICAgcSA9IG5ldyBSYXRpb25hbChxKTtcbiAgICAgICAgICAgIHAgKj0gcS5xO1xuICAgICAgICAgICAgcSA9IHEucDtcbiAgICAgICAgfVxuICAgICAgICBpZiAocSA9PT0gMCkge1xuICAgICAgICAgICAgaWYgKHAgPT09IDApIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gUy5OYW47XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gUy5Db21wbGV4SW5maW5pdHk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHEgPCAwKSB7XG4gICAgICAgICAgICBxID0gLXE7XG4gICAgICAgICAgICBwID0gLXA7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHR5cGVvZiBnY2QgPT09IFwidW5kZWZpbmVkXCIpIHtcbiAgICAgICAgICAgIGdjZCA9IGlnY2QoTWF0aC5hYnMocCksIHEpO1xuICAgICAgICB9XG4gICAgICAgIGlmIChnY2QgPiAxKSB7XG4gICAgICAgICAgICBwID0gcC9nY2Q7XG4gICAgICAgICAgICBxID0gcS9nY2Q7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHEgPT09IDEgJiYgc2ltcGxpZnkpIHtcbiAgICAgICAgICAgIHJldHVybiBuZXcgSW50ZWdlcihwKTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLnAgPSBwO1xuICAgICAgICB0aGlzLnEgPSBxO1xuICAgIH1cblxuICAgIGhhc2hLZXkoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmNvbnN0cnVjdG9yLm5hbWUgKyB0aGlzLnAgKyB0aGlzLnE7XG4gICAgfVxuXG4gICAgX19hZGRfXyhvdGhlcjogYW55KSB7XG4gICAgICAgIGlmIChnbG9iYWxfcGFyYW1ldGVycy5ldmFsdWF0ZSkge1xuICAgICAgICAgICAgaWYgKG90aGVyIGluc3RhbmNlb2YgSW50ZWdlcikge1xuICAgICAgICAgICAgICAgIHJldHVybiBuZXcgUmF0aW9uYWwodGhpcy5wICsgdGhpcy5xICogb3RoZXIucCwgdGhpcy5xLCAxKTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAob3RoZXIgaW5zdGFuY2VvZiBSYXRpb25hbCkge1xuICAgICAgICAgICAgICAgIHJldHVybiBuZXcgUmF0aW9uYWwodGhpcy5wICogb3RoZXIucSArIHRoaXMucSAqIG90aGVyLnAsIHRoaXMucSAqIG90aGVyLnEpO1xuICAgICAgICAgICAgfSBlbHNlIGlmIChvdGhlciBpbnN0YW5jZW9mIEZsb2F0KSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIG90aGVyLl9fYWRkX18odGhpcyk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHJldHVybiBzdXBlci5fX2FkZF9fKG90aGVyKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gc3VwZXIuX19hZGRfXyhvdGhlcik7XG4gICAgfVxuXG4gICAgX19yYWRkX18ob3RoZXI6IGFueSkge1xuICAgICAgICByZXR1cm4gdGhpcy5fX2FkZF9fKG90aGVyKTtcbiAgICB9XG5cbiAgICBfX3N1Yl9fKG90aGVyOiBhbnkpIHtcbiAgICAgICAgaWYgKGdsb2JhbF9wYXJhbWV0ZXJzLmV2YWx1YXRlKSB7XG4gICAgICAgICAgICBpZiAob3RoZXIgaW5zdGFuY2VvZiBJbnRlZ2VyKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIG5ldyBSYXRpb25hbCh0aGlzLnEgKiBvdGhlci5wIC0gdGhpcy5wLCB0aGlzLnEsIDEpO1xuICAgICAgICAgICAgfSBlbHNlIGlmIChvdGhlciBpbnN0YW5jZW9mIFJhdGlvbmFsKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIG5ldyBSYXRpb25hbCh0aGlzLnAgKiBvdGhlci5xIC0gdGhpcy5xICogb3RoZXIucCwgdGhpcy5xICogb3RoZXIucSk7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKG90aGVyIGluc3RhbmNlb2YgRmxvYXQpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5fX211bF9fKFMuTmVnYXRpdmVPbmUpLl9fYWRkX18ob3RoZXIpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gc3VwZXIuX19zdWJfXyhvdGhlcik7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHN1cGVyLl9fc3ViX18ob3RoZXIpO1xuICAgIH1cblxuICAgIF9fcnN1Yl9fKG90aGVyOiBhbnkpIHtcbiAgICAgICAgaWYgKGdsb2JhbF9wYXJhbWV0ZXJzLmV2YWx1YXRlKSB7XG4gICAgICAgICAgICBpZiAob3RoZXIgaW5zdGFuY2VvZiBJbnRlZ2VyKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIG5ldyBSYXRpb25hbCh0aGlzLnAgLSB0aGlzLnEgKiBvdGhlci5wLCB0aGlzLnEsIDEpO1xuICAgICAgICAgICAgfSBlbHNlIGlmIChvdGhlciBpbnN0YW5jZW9mIFJhdGlvbmFsKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIG5ldyBSYXRpb25hbCh0aGlzLnEgKiBvdGhlci5wIC0gdGhpcy5wICogb3RoZXIucSwgdGhpcy5xICogb3RoZXIucSk7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKG90aGVyIGluc3RhbmNlb2YgRmxvYXQpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gb3RoZXIuX19tdWxfXyhTLk5lZ2F0aXZlT25lKS5fX2FkZF9fKHRoaXMpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gc3VwZXIuX19yc3ViX18ob3RoZXIpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBzdXBlci5fX3JzdWJfXyhvdGhlcik7XG4gICAgfVxuXG4gICAgX19tdWxfXyhvdGhlcjogYW55KSB7XG4gICAgICAgIGlmIChnbG9iYWxfcGFyYW1ldGVycy5ldmFsdWF0ZSkge1xuICAgICAgICAgICAgaWYgKG90aGVyIGluc3RhbmNlb2YgSW50ZWdlcikge1xuICAgICAgICAgICAgICAgIHJldHVybiBuZXcgUmF0aW9uYWwodGhpcy5wICogb3RoZXIucCwgdGhpcy5xLCBpZ2NkKG90aGVyLnAsIHRoaXMucSkpO1xuICAgICAgICAgICAgfSBlbHNlIGlmIChvdGhlciBpbnN0YW5jZW9mIFJhdGlvbmFsKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIG5ldyBSYXRpb25hbCh0aGlzLnAgKiBvdGhlci5wLCB0aGlzLnEgKiBvdGhlci5xLCBpZ2NkKHRoaXMucCwgb3RoZXIucSkgKiBpZ2NkKHRoaXMucSwgb3RoZXIucCkpO1xuICAgICAgICAgICAgfSBlbHNlIGlmIChvdGhlciBpbnN0YW5jZW9mIEZsb2F0KSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIG90aGVyLl9fbXVsX18odGhpcyk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHJldHVybiBzdXBlci5fX211bF9fKG90aGVyKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gc3VwZXIuX19tdWxfXyhvdGhlcik7XG4gICAgfVxuXG4gICAgX19ybXVsX18ob3RoZXI6IGFueSkge1xuICAgICAgICByZXR1cm4gdGhpcy5fX211bF9fKG90aGVyKTtcbiAgICB9XG5cbiAgICBfX3RydWVkaXZfXyhvdGhlcjogYW55KSB7XG4gICAgICAgIGlmIChnbG9iYWxfcGFyYW1ldGVycy5ldmFsdWF0ZSkge1xuICAgICAgICAgICAgaWYgKG90aGVyIGluc3RhbmNlb2YgSW50ZWdlcikge1xuICAgICAgICAgICAgICAgIHJldHVybiBuZXcgUmF0aW9uYWwodGhpcy5wLCB0aGlzLnEgKiBvdGhlci5wLCBpZ2NkKHRoaXMucCwgb3RoZXIucCkpO1xuICAgICAgICAgICAgfSBlbHNlIGlmIChvdGhlciBpbnN0YW5jZW9mIFJhdGlvbmFsKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIG5ldyBSYXRpb25hbCh0aGlzLnAgKiBvdGhlci5xLCB0aGlzLnEgKiBvdGhlci5wLCBpZ2NkKHRoaXMucCwgb3RoZXIucCkgKiBpZ2NkKHRoaXMucSwgb3RoZXIucSkpO1xuICAgICAgICAgICAgfSBlbHNlIGlmIChvdGhlciBpbnN0YW5jZW9mIEZsb2F0KSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuX19tdWxfXyhvdGhlci5pbnZlcnNlKCkpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gc3VwZXIuX190cnVlZGl2X18ob3RoZXIpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBzdXBlci5fX3RydWVkaXZfXyhvdGhlcik7XG4gICAgfVxuXG4gICAgX19ydHJ1ZWRpdl9fKG90aGVyOiBhbnkpIHtcbiAgICAgICAgaWYgKGdsb2JhbF9wYXJhbWV0ZXJzLmV2YWx1YXRlKSB7XG4gICAgICAgICAgICBpZiAob3RoZXIgaW5zdGFuY2VvZiBJbnRlZ2VyKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIG5ldyBSYXRpb25hbChvdGhlci5wICogdGhpcy5xLCB0aGlzLnAsIGlnY2QodGhpcy5wLCBvdGhlci5wKSk7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKG90aGVyIGluc3RhbmNlb2YgUmF0aW9uYWwpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gbmV3IFJhdGlvbmFsKG90aGVyLnAgKiB0aGlzLnEsIG90aGVyLnEgKiB0aGlzLnAsIGlnY2QodGhpcy5wLCBvdGhlci5wKSAqIGlnY2QodGhpcy5xLCBvdGhlci5xKSk7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKG90aGVyIGluc3RhbmNlb2YgRmxvYXQpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gb3RoZXIuX19tdWxfXyhTLk9uZS5fX3RydWVkaXZfXyh0aGlzKSk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHJldHVybiBzdXBlci5fX3J0cnVlZGl2X18ob3RoZXIpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBzdXBlci5fX3J0cnVlZGl2X18ob3RoZXIpO1xuICAgIH1cblxuXG4gICAgX2V2YWxfcG93ZXIoZXhwdDogYW55KSB7XG4gICAgICAgIGlmIChleHB0IGluc3RhbmNlb2YgX051bWJlcl8pIHtcbiAgICAgICAgICAgIGlmIChleHB0IGluc3RhbmNlb2YgRmxvYXQpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5ldmFsX2V2YWxmKGV4cHQucHJlYykuX2V2YWxfcG93ZXIoZXhwdCk7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKGV4cHQgaW5zdGFuY2VvZiBJbnRlZ2VyKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIG5ldyBSYXRpb25hbCh0aGlzLnAgKiogZXhwdC5wLCB0aGlzLnEgKiogZXhwdC5wLCAxKTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoZXhwdCBpbnN0YW5jZW9mIFJhdGlvbmFsKSB7XG4gICAgICAgICAgICAgICAgbGV0IGludHBhcnQgPSBNYXRoLmZsb29yKGV4cHQucCAvIGV4cHQucSk7XG4gICAgICAgICAgICAgICAgaWYgKGludHBhcnQpIHtcbiAgICAgICAgICAgICAgICAgICAgaW50cGFydCsrO1xuICAgICAgICAgICAgICAgICAgICBjb25zdCByZW1mcmFjcGFydCA9IGludHBhcnQgKiBleHB0LnEgLSBleHB0LnA7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHJhdGZyYWNwYXJ0ID0gbmV3IFJhdGlvbmFsKHJlbWZyYWNwYXJ0LCBleHB0LnEpO1xuICAgICAgICAgICAgICAgICAgICBpZiAodGhpcy5wICE9PSAxKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbWF4LWxlblxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIG5ldyBJbnRlZ2VyKHRoaXMucCkuX2V2YWxfcG93ZXIoZXhwdCkuX19tdWxfXyhuZXcgSW50ZWdlcih0aGlzLnEpKS5fZXZhbF9wb3dlcihyYXRmcmFjcGFydCkuX19tdWxfXyhuZXcgUmF0aW9uYWwoMSwgdGhpcy5xICoqIGludHBhcnQsIDEpKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gbmV3IEludGVnZXIodGhpcy5xKS5fZXZhbF9wb3dlcihyYXRmcmFjcGFydCkuX19tdWxfXyhuZXcgUmF0aW9uYWwoMSwgdGhpcy5xICoqIGludHBhcnQsIDEpKTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBjb25zdCByZW1mcmFjcGFydCA9IGV4cHQucSAtIGV4cHQucDtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgcmF0ZnJhY3BhcnQgPSBuZXcgUmF0aW9uYWwocmVtZnJhY3BhcnQsIGV4cHQucSk7XG4gICAgICAgICAgICAgICAgICAgIGlmICh0aGlzLnAgIT09IDEpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBtYXgtbGVuXG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBwMSA9IG5ldyBJbnRlZ2VyKHRoaXMucCkuX2V2YWxfcG93ZXIoZXhwdCk7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBwMiA9IG5ldyBJbnRlZ2VyKHRoaXMucSkuX2V2YWxfcG93ZXIocmF0ZnJhY3BhcnQpO1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHAxLl9fbXVsX18ocDIpLl9fbXVsX18obmV3IFJhdGlvbmFsKDEsIHRoaXMucSwgMSkpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBuZXcgSW50ZWdlcih0aGlzLnEpLl9ldmFsX3Bvd2VyKHJhdGZyYWNwYXJ0KS5fX211bF9fKG5ldyBSYXRpb25hbCgxLCB0aGlzLnEsIDEpKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBhc19jb2VmZl9BZGQoKSB7XG4gICAgICAgIHJldHVybiBbdGhpcywgUy5aZXJvXTtcbiAgICB9XG5cbiAgICBfZmxvYXRfdmFsKHByZWM6IG51bWJlcik6IGFueSB7XG4gICAgICAgIGNvbnN0IGEgPSBuZXcgRGVjaW1hbCh0aGlzLnApO1xuICAgICAgICBjb25zdCBiID0gbmV3IERlY2ltYWwodGhpcy5xKTtcbiAgICAgICAgcmV0dXJuIG5ldyBGbG9hdChEZWNpbWFsLnNldCh7cHJlY2lzaW9uOiBwcmVjfSkuZGl2KGEsIGIpKTtcbiAgICB9XG4gICAgX2FzX251bWVyX2Rlbm9tKCkge1xuICAgICAgICByZXR1cm4gW25ldyBJbnRlZ2VyKHRoaXMucCksIG5ldyBJbnRlZ2VyKHRoaXMucSldO1xuICAgIH1cblxuICAgIGZhY3RvcnMobGltaXQ6IGFueSA9IHVuZGVmaW5lZCkge1xuICAgICAgICByZXR1cm4gZmFjdG9ycmF0KHRoaXMsIGxpbWl0KTtcbiAgICB9XG5cbiAgICBfZXZhbF9pc19uZWdhdGl2ZSgpIHtcbiAgICAgICAgaWYgKHRoaXMucCA8IDAgJiYgdGhpcy5xID4gMCkge1xuICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBfZXZhbF9pc19wb3NpdGl2ZSgpIHtcbiAgICAgICAgcmV0dXJuICF0aGlzLl9ldmFsX2lzX25lZ2F0aXZlKCk7XG4gICAgfVxuXG4gICAgX2V2YWxfaXNfb2RkKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5wICUgMiAhPT0gMDtcbiAgICB9XG5cbiAgICBfZXZhbF9pc19ldmVuKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5wICUgMiA9PT0gMDtcbiAgICB9XG5cbiAgICBfZXZhbF9pc19maW5pdGUoKSB7XG4gICAgICAgIHJldHVybiAhKHRoaXMucCA9PT0gUy5JbmZpbml0eSB8fCB0aGlzLnAgPT09IFMuTmVnYXRpdmVJbmZpbml0eSk7XG4gICAgfVxuXG4gICAgZXEob3RoZXI6IFJhdGlvbmFsKSB7XG4gICAgICAgIHJldHVybiB0aGlzLnAgPT09IG90aGVyLnAgJiYgdGhpcy5xID09PSBvdGhlci5xO1xuICAgIH1cblxuICAgIHRvU3RyaW5nKCkge1xuICAgICAgICByZXR1cm4gU3RyaW5nKHRoaXMucCkgKyBcIi9cIiArIFN0cmluZyh0aGlzLnEpXG4gICAgfVxufTtcblxuLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5ldy1jYXBcbk1hbmFnZWRQcm9wZXJ0aWVzLnJlZ2lzdGVyKFJhdGlvbmFsKTtcblxuY2xhc3MgSW50ZWdlciBleHRlbmRzIFJhdGlvbmFsIHtcbiAgICAvKlxuICAgIFJlcHJlc2VudHMgaW50ZWdlciBudW1iZXJzIG9mIGFueSBzaXplLlxuICAgIEV4YW1wbGVzXG4gICAgPT09PT09PT1cbiAgICA+Pj4gZnJvbSBzeW1weSBpbXBvcnQgSW50ZWdlclxuICAgID4+PiBJbnRlZ2VyKDMpXG4gICAgM1xuICAgIElmIGEgZmxvYXQgb3IgYSByYXRpb25hbCBpcyBwYXNzZWQgdG8gSW50ZWdlciwgdGhlIGZyYWN0aW9uYWwgcGFydFxuICAgIHdpbGwgYmUgZGlzY2FyZGVkOyB0aGUgZWZmZWN0IGlzIG9mIHJvdW5kaW5nIHRvd2FyZCB6ZXJvLlxuICAgID4+PiBJbnRlZ2VyKDMuOClcbiAgICAzXG4gICAgPj4+IEludGVnZXIoLTMuOClcbiAgICAtM1xuICAgIEEgc3RyaW5nIGlzIGFjY2VwdGFibGUgaW5wdXQgaWYgaXQgY2FuIGJlIHBhcnNlZCBhcyBhbiBpbnRlZ2VyOlxuICAgID4+PiBJbnRlZ2VyKFwiOVwiICogMjApXG4gICAgOTk5OTk5OTk5OTk5OTk5OTk5OTlcbiAgICBJdCBpcyByYXJlbHkgbmVlZGVkIHRvIGV4cGxpY2l0bHkgaW5zdGFudGlhdGUgYW4gSW50ZWdlciwgYmVjYXVzZVxuICAgIFB5dGhvbiBpbnRlZ2VycyBhcmUgYXV0b21hdGljYWxseSBjb252ZXJ0ZWQgdG8gSW50ZWdlciB3aGVuIHRoZXlcbiAgICBhcmUgdXNlZCBpbiBTeW1QeSBleHByZXNzaW9ucy5cbiAgICBcIlwiXCJcbiAgICAqL1xuICAgIHN0YXRpYyBpc19pbnRlZ2VyID0gdHJ1ZTtcbiAgICBzdGF0aWMgaXNfSW50ZWdlciA9IHRydWU7XG4gICAgX19zbG90c19fOiBhbnlbXSA9IFtdO1xuICAgIGNvbnN0cnVjdG9yKHA6IG51bWJlcikge1xuICAgICAgICBzdXBlcihwLCB1bmRlZmluZWQsIHVuZGVmaW5lZCwgZmFsc2UpO1xuICAgICAgICB0aGlzLnAgPSBwO1xuICAgICAgICBpZiAocCA9PT0gMSkge1xuICAgICAgICAgICAgcmV0dXJuIFMuT25lO1xuICAgICAgICB9IGVsc2UgaWYgKHAgPT09IDApIHtcbiAgICAgICAgICAgIHJldHVybiBTLlplcm87XG4gICAgICAgIH0gZWxzZSBpZiAocCA9PT0gLTEpIHtcbiAgICAgICAgICAgIHJldHVybiBTLk5lZ2F0aXZlT25lO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgZmFjdG9ycyhsaW1pdDogYW55ID0gdW5kZWZpbmVkKSB7XG4gICAgICAgIHJldHVybiBmYWN0b3JpbnQodGhpcy5wLCBsaW1pdCk7XG4gICAgfVxuXG4gICAgX19hZGRfXyhvdGhlcjogYW55KTogYW55IHtcbiAgICAgICAgaWYgKGdsb2JhbF9wYXJhbWV0ZXJzLmV2YWx1YXRlKSB7XG4gICAgICAgICAgICBpZiAoTnVtYmVyLmlzSW50ZWdlcihvdGhlcikpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gbmV3IEludGVnZXIodGhpcy5wICsgb3RoZXIpO1xuICAgICAgICAgICAgfSBlbHNlIGlmIChvdGhlciBpbnN0YW5jZW9mIEludGVnZXIpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gbmV3IEludGVnZXIodGhpcy5wICsgb3RoZXIucCk7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKG90aGVyIGluc3RhbmNlb2YgUmF0aW9uYWwpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gbmV3IFJhdGlvbmFsKHRoaXMucCAqIG90aGVyLnEgKyBvdGhlci5wLCBvdGhlci5xLCAxKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHN1cGVyLl9fYWRkX18ob3RoZXIpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuIG5ldyBBZGQodHJ1ZSwgdHJ1ZSwgdGhpcywgb3RoZXIpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgX19yYWRkX18ob3RoZXI6IGFueSk6IGFueSB7XG4gICAgICAgIGlmIChnbG9iYWxfcGFyYW1ldGVycy5ldmFsdWF0ZSkge1xuICAgICAgICAgICAgaWYgKE51bWJlci5pc0ludGVnZXIob3RoZXIpKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIG5ldyBJbnRlZ2VyKG90aGVyICsgdGhpcy5wKTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAob3RoZXIgaW5zdGFuY2VvZiBSYXRpb25hbCkge1xuICAgICAgICAgICAgICAgIHJldHVybiBuZXcgUmF0aW9uYWwob3RoZXIucCArIHRoaXMucCAqIG90aGVyLnEsIG90aGVyLnEsIDEpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gc3VwZXIuX19yYWRkX18ob3RoZXIpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuIHN1cGVyLl9fcmFkZF9fKG90aGVyKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIF9fc3ViX18ob3RoZXI6IGFueSk6IGFueSB7XG4gICAgICAgIGlmIChnbG9iYWxfcGFyYW1ldGVycy5ldmFsdWF0ZSkge1xuICAgICAgICAgICAgaWYgKE51bWJlci5pc0ludGVnZXIob3RoZXIpKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIG5ldyBJbnRlZ2VyKHRoaXMucCAtIG90aGVyKTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAob3RoZXIgaW5zdGFuY2VvZiBJbnRlZ2VyKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIG5ldyBJbnRlZ2VyKHRoaXMucCAtIG90aGVyLnApO1xuICAgICAgICAgICAgfSBlbHNlIGlmIChvdGhlciBpbnN0YW5jZW9mIFJhdGlvbmFsKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIG5ldyBSYXRpb25hbCh0aGlzLnAgKiBvdGhlci5xIC0gb3RoZXIucCwgb3RoZXIucSwgMSk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHJldHVybiBzdXBlci5fX3N1Yl9fKG90aGVyKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiBzdXBlci5fX3N1Yl9fKG90aGVyKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIF9fcnN1Yl9fKG90aGVyOiBhbnkpOiBhbnkge1xuICAgICAgICBpZiAoZ2xvYmFsX3BhcmFtZXRlcnMuZXZhbHVhdGUpIHtcbiAgICAgICAgICAgIGlmIChOdW1iZXIuaXNJbnRlZ2VyKG90aGVyKSkge1xuICAgICAgICAgICAgICAgIHJldHVybiBuZXcgSW50ZWdlcih0aGlzLnAgLSBvdGhlcik7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKG90aGVyIGluc3RhbmNlb2YgUmF0aW9uYWwpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gbmV3IFJhdGlvbmFsKG90aGVyLnAgLSB0aGlzLnAgKiBvdGhlci5xLCBvdGhlci5xLCAxKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHN1cGVyLl9fcnN1Yl9fKG90aGVyKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiBzdXBlci5fX3JzdWJfXyhvdGhlcik7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBfX211bF9fKG90aGVyOiBhbnkpOiBhbnkge1xuICAgICAgICBpZiAoZ2xvYmFsX3BhcmFtZXRlcnMuZXZhbHVhdGUpIHtcbiAgICAgICAgICAgIGlmIChOdW1iZXIuaXNJbnRlZ2VyKG90aGVyKSApIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gbmV3IEludGVnZXIodGhpcy5wICogb3RoZXIpO1xuICAgICAgICAgICAgfSBlbHNlIGlmIChvdGhlciBpbnN0YW5jZW9mIEludGVnZXIpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gbmV3IEludGVnZXIodGhpcy5wICogb3RoZXIucCk7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKG90aGVyIGluc3RhbmNlb2YgUmF0aW9uYWwpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gbmV3IFJhdGlvbmFsKHRoaXMucCAqIG90aGVyLnAsIG90aGVyLnEsIGlnY2QodGhpcy5wLCBvdGhlci5xKSk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHJldHVybiBzdXBlci5fX211bF9fKG90aGVyKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiBzdXBlci5fX211bF9fKG90aGVyKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIF9fcm11bF9fKG90aGVyOiBhbnkpOiBhbnkge1xuICAgICAgICBpZiAoZ2xvYmFsX3BhcmFtZXRlcnMuZXZhbHVhdGUpIHtcbiAgICAgICAgICAgIGlmIChOdW1iZXIuaXNJbnRlZ2VyKG90aGVyKSApIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gbmV3IEludGVnZXIob3RoZXIgKiB0aGlzLnApO1xuICAgICAgICAgICAgfSBlbHNlIGlmIChvdGhlciBpbnN0YW5jZW9mIFJhdGlvbmFsKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIG5ldyBSYXRpb25hbChvdGhlci5wICogdGhpcy5wLCBvdGhlci5xLCBpZ2NkKHRoaXMucCwgb3RoZXIucSkpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gc3VwZXIuX19ybXVsX18ob3RoZXIpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuIHN1cGVyLl9fcm11bF9fKG90aGVyKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIF9ldmFsX2lzX25lZ2F0aXZlKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5wIDwgMDtcbiAgICB9XG5cbiAgICBfZXZhbF9pc19wb3NpdGl2ZSgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMucCA+IDA7XG4gICAgfVxuXG4gICAgX2V2YWxfaXNfb2RkKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5wICUgMiA9PT0gMTtcbiAgICB9XG5cbiAgICBfZXZhbF9wb3dlcihleHB0OiBhbnkpOiBhbnkge1xuICAgICAgICBpZiAoZXhwdCA9PT0gUy5JbmZpbml0eSkge1xuICAgICAgICAgICAgaWYgKHRoaXMucCA+IDEpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gUy5JbmZpbml0eTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBpZiAoZXhwdCA9PT0gUy5OZWdhdGl2ZUluZmluaXR5KSB7XG4gICAgICAgICAgICByZXR1cm4gbmV3IFJhdGlvbmFsKDEsIHRoaXMsIDEpLl9ldmFsX3Bvd2VyKFMuSW5maW5pdHkpO1xuICAgICAgICB9XG4gICAgICAgIGlmICghKGV4cHQgaW5zdGFuY2VvZiBfTnVtYmVyXykpIHtcbiAgICAgICAgICAgIGlmICh0aGlzLmlzX25lZ2F0aXZlICYmIGV4cHQuaXNfZXZlbikge1xuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLl9fbXVsX18oUy5OZWdhdGl2ZU9uZSkuX2V2YWxfcG93ZXIoZXhwdCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGV4cHQgaW5zdGFuY2VvZiBGbG9hdCkge1xuICAgICAgICAgICAgcmV0dXJuIHN1cGVyLl9ldmFsX3Bvd2VyKGV4cHQpO1xuICAgICAgICB9XG4gICAgICAgIGlmICghKGV4cHQgaW5zdGFuY2VvZiBSYXRpb25hbCkpIHtcbiAgICAgICAgICAgIHJldHVybiB1bmRlZmluZWQ7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGV4cHQuaXNfbmVnYXRpdmUoKSkge1xuICAgICAgICAgICAgY29uc3QgbmUgPSBleHB0Ll9fbXVsX18oUy5OZWdhdGl2ZU9uZSk7XG4gICAgICAgICAgICBpZiAodGhpcy5pc19uZWdhdGl2ZSgpKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIFMuTmVnYXRpdmVPbmUuX2V2YWxfcG93ZXIoZXhwdCkuX19tdWxfXyhuZXcgUmF0aW9uYWwoMSwgdGhpcy5fX211bF9fKFMuTmVnYXRpdmVPbmUpLCAxKSkuX2V2YWxfcG93ZXIobmUpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gbmV3IFJhdGlvbmFsKDEsIHRoaXMucCwgMSkuX2V2YWxfcG93ZXIobmUpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGNvbnN0IFt4LCB4ZXhhY3RdID0gaW50X250aHJvb3QoTWF0aC5hYnModGhpcy5wKSwgZXhwdC5xKTtcbiAgICAgICAgaWYgKHhleGFjdCkge1xuICAgICAgICAgICAgbGV0IHJlc3VsdCA9IG5ldyBJbnRlZ2VyKCh4IGFzIG51bWJlcikqKk1hdGguYWJzKGV4cHQucCkpO1xuICAgICAgICAgICAgaWYgKHRoaXMuaXNfbmVnYXRpdmUoKSkge1xuICAgICAgICAgICAgICAgIHJlc3VsdCA9IHJlc3VsdC5fX211bF9fKFMuTmVnYXRpdmVPbmUuX2V2YWxfcG93ZXIoZXhwdCkpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICAgICAgfVxuICAgICAgICBjb25zdCBiX3BvcyA9IE1hdGguYWJzKHRoaXMucCk7XG4gICAgICAgIGNvbnN0IHAgPSBwZXJmZWN0X3Bvd2VyKGJfcG9zKTtcbiAgICAgICAgbGV0IGRpY3QgPSBuZXcgSGFzaERpY3QoKTtcbiAgICAgICAgaWYgKHAgIT09IGZhbHNlKSB7XG4gICAgICAgICAgICBkaWN0LmFkZChwWzBdLCBwWzFdKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGRpY3QgPSBuZXcgSW50ZWdlcihiX3BvcykuZmFjdG9ycygyKioxNSk7XG4gICAgICAgIH1cblxuICAgICAgICBsZXQgb3V0X2ludCA9IDE7XG4gICAgICAgIGxldCBvdXRfcmFkOiBJbnRlZ2VyID0gUy5PbmU7XG4gICAgICAgIGxldCBzcXJfaW50ID0gMTtcbiAgICAgICAgbGV0IHNxcl9nY2QgPSAwO1xuICAgICAgICBjb25zdCBzcXJfZGljdCA9IG5ldyBIYXNoRGljdCgpO1xuICAgICAgICBsZXQgcHJpbWU7IGxldCBleHBvbmVudDtcbiAgICAgICAgZm9yIChbcHJpbWUsIGV4cG9uZW50XSBvZiBkaWN0LmVudHJpZXMoKSkge1xuICAgICAgICAgICAgZXhwb25lbnQgKj0gZXhwdC5wO1xuICAgICAgICAgICAgY29uc3QgW2Rpdl9lLCBkaXZfbV0gPSBkaXZtb2QoZXhwb25lbnQsIGV4cHQucSk7XG4gICAgICAgICAgICBpZiAoZGl2X2UgPiAwKSB7XG4gICAgICAgICAgICAgICAgb3V0X2ludCAqPSBwcmltZSoqZGl2X2U7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoZGl2X20gPiAwKSB7XG4gICAgICAgICAgICAgICAgY29uc3QgZyA9IGlnY2QoZGl2X20sIGV4cHQucSk7XG4gICAgICAgICAgICAgICAgaWYgKGcgIT09IDEpIHtcbiAgICAgICAgICAgICAgICAgICAgb3V0X3JhZCA9IG91dF9yYWQuX19tdWxfXyhuZXcgUG93KHByaW1lLCBuZXcgUmF0aW9uYWwoTWF0aC5mbG9vcihkaXZfbS9nKSwgTWF0aC5mbG9vcihleHB0LnEvZyksIDEpKSk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgc3FyX2RpY3QuYWRkKHByaW1lLCBkaXZfbSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGZvciAoY29uc3QgWywgZXhdIG9mIHNxcl9kaWN0LmVudHJpZXMoKSkge1xuICAgICAgICAgICAgaWYgKHNxcl9nY2QgPT09IDApIHtcbiAgICAgICAgICAgICAgICBzcXJfZ2NkID0gZXg7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHNxcl9nY2QgPSBpZ2NkKHNxcl9nY2QsIGV4KTtcbiAgICAgICAgICAgICAgICBpZiAoc3FyX2djZCA9PT0gMSkge1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgZm9yIChjb25zdCBbaywgdl0gb2Ygc3FyX2RpY3QuZW50cmllcygpKSB7XG4gICAgICAgICAgICBzcXJfaW50ICo9IGsqKihNYXRoLmZsb29yKHYvc3FyX2djZCkpO1xuICAgICAgICB9XG4gICAgICAgIGxldCByZXN1bHQ6IGFueTtcbiAgICAgICAgaWYgKHNxcl9pbnQgPT09IGJfcG9zICYmIG91dF9pbnQgPT09IDEgJiYgb3V0X3JhZCA9PT0gUy5PbmUpIHtcbiAgICAgICAgICAgIHJlc3VsdCA9IHVuZGVmaW5lZDtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGNvbnN0IHAxID0gb3V0X3JhZC5fX211bF9fKG5ldyBJbnRlZ2VyKG91dF9pbnQpKTtcbiAgICAgICAgICAgIGNvbnN0IHAyID0gbmV3IFBvdyhuZXcgSW50ZWdlcihzcXJfaW50KSwgbmV3IFJhdGlvbmFsKHNxcl9nY2QsIGV4cHQucSkpO1xuICAgICAgICAgICAgcmVzdWx0ID0gbmV3IE11bCh0cnVlLCB0cnVlLCBwMSwgcDIpO1xuICAgICAgICAgICAgaWYgKHRoaXMuaXNfbmVnYXRpdmUoKSkge1xuICAgICAgICAgICAgICAgIHJlc3VsdCA9IHJlc3VsdC5fX211bF9fKG5ldyBQb3coUy5OZWdhdGl2ZU9uZSwgZXhwdCkpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgfVxuXG4gICAgdG9TdHJpbmcoKSB7XG4gICAgICAgIHJldHVybiBTdHJpbmcodGhpcy5wKTtcbiAgICB9XG59O1xuXG5NYW5hZ2VkUHJvcGVydGllcy5yZWdpc3RlcihJbnRlZ2VyKTtcblxuXG5jbGFzcyBJbnRlZ2VyQ29uc3RhbnQgZXh0ZW5kcyBJbnRlZ2VyIHtcbiAgICBfX3Nsb3RzX186IGFueVtdID0gW107XG59O1xuXG5NYW5hZ2VkUHJvcGVydGllcy5yZWdpc3RlcihJbnRlZ2VyQ29uc3RhbnQpO1xuXG5jbGFzcyBaZXJvIGV4dGVuZHMgSW50ZWdlckNvbnN0YW50IHtcbiAgICAvKlxuICAgIFRoZSBudW1iZXIgemVyby5cbiAgICBaZXJvIGlzIGEgc2luZ2xldG9uLCBhbmQgY2FuIGJlIGFjY2Vzc2VkIGJ5IGBgUy5aZXJvYGBcbiAgICBFeGFtcGxlc1xuICAgID09PT09PT09XG4gICAgPj4+IGZyb20gc3ltcHkgaW1wb3J0IFMsIEludGVnZXJcbiAgICA+Pj4gSW50ZWdlcigwKSBpcyBTLlplcm9cbiAgICBUcnVlXG4gICAgPj4+IDEvUy5aZXJvXG4gICAgem9vXG4gICAgUmVmZXJlbmNlc1xuICAgID09PT09PT09PT1cbiAgICAuLiBbMV0gaHR0cHM6Ly9lbi53aWtpcGVkaWEub3JnL3dpa2kvWmVyb1xuICAgICovXG4gICAgX19zbG90c19fOiBhbnlbXSA9IFtdO1xuICAgIHN0YXRpYyBpc19wb3NpdGl2ZSA9IGZhbHNlO1xuICAgIHN0YXRpYyBzdGF0aWMgPSBmYWxzZTtcbiAgICBzdGF0aWMgaXNfemVybyA9IHRydWU7XG4gICAgc3RhdGljIGlzX251bWJlciA9IHRydWU7XG4gICAgc3RhdGljIGlzX2NvbXBhcmFibGUgPSB0cnVlO1xuICAgIGNvbnN0cnVjdG9yKCkge1xuICAgICAgICBzdXBlcigwKTtcbiAgICB9XG59O1xuXG5NYW5hZ2VkUHJvcGVydGllcy5yZWdpc3RlcihaZXJvKTtcblxuXG5jbGFzcyBPbmUgZXh0ZW5kcyBJbnRlZ2VyQ29uc3RhbnQge1xuICAgIC8qXG4gICAgVGhlIG51bWJlciBvbmUuXG4gICAgT25lIGlzIGEgc2luZ2xldG9uLCBhbmQgY2FuIGJlIGFjY2Vzc2VkIGJ5IGBgUy5PbmVgYC5cbiAgICBFeGFtcGxlc1xuICAgID09PT09PT09XG4gICAgPj4+IGZyb20gc3ltcHkgaW1wb3J0IFMsIEludGVnZXJcbiAgICA+Pj4gSW50ZWdlcigxKSBpcyBTLk9uZVxuICAgIFRydWVcbiAgICBSZWZlcmVuY2VzXG4gICAgPT09PT09PT09PVxuICAgIC4uIFsxXSBodHRwczovL2VuLndpa2lwZWRpYS5vcmcvd2lraS8xXyUyOG51bWJlciUyOVxuICAgICovXG4gICAgc3RhdGljIGlzX251bWJlciA9IHRydWU7XG4gICAgc3RhdGljIGlzX3Bvc2l0aXZlID0gdHJ1ZTtcbiAgICBzdGF0aWMgaXNfemVybyA9IGZhbHNlO1xuICAgIF9fc2xvdHNfXzogYW55W10gPSBbXTtcbiAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICAgICAgc3VwZXIoMSk7XG4gICAgfVxufTtcblxuTWFuYWdlZFByb3BlcnRpZXMucmVnaXN0ZXIoT25lKTtcblxuXG5jbGFzcyBOZWdhdGl2ZU9uZSBleHRlbmRzIEludGVnZXJDb25zdGFudCB7XG4gICAgLypcbiAgICBUaGUgbnVtYmVyIG5lZ2F0aXZlIG9uZS5cbiAgICBOZWdhdGl2ZU9uZSBpcyBhIHNpbmdsZXRvbiwgYW5kIGNhbiBiZSBhY2Nlc3NlZCBieSBgYFMuTmVnYXRpdmVPbmVgYC5cbiAgICBFeGFtcGxlc1xuICAgID09PT09PT09XG4gICAgPj4+IGZyb20gc3ltcHkgaW1wb3J0IFMsIEludGVnZXJcbiAgICA+Pj4gSW50ZWdlcigtMSkgaXMgUy5OZWdhdGl2ZU9uZVxuICAgIFRydWVcbiAgICBTZWUgQWxzb1xuICAgID09PT09PT09XG4gICAgT25lXG4gICAgUmVmZXJlbmNlc1xuICAgID09PT09PT09PT1cbiAgICAuLiBbMV0gaHR0cHM6Ly9lbi53aWtpcGVkaWEub3JnL3dpa2kvJUUyJTg4JTkyMV8lMjhudW1iZXIlMjlcbiAgICAqL1xuICAgIHN0YXRpYyBpc19udW1iZXIgPSB0cnVlO1xuICAgIF9fc2xvdHNfXzogYW55W10gPSBbXTtcbiAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICAgICAgc3VwZXIoLTEpO1xuICAgIH1cblxuICAgIF9ldmFsX3Bvd2VyKGV4cHQ6IGFueSkge1xuICAgICAgICBpZiAoZXhwdC5pc19vZGQpIHtcbiAgICAgICAgICAgIHJldHVybiBTLk5lZ2F0aXZlT25lO1xuICAgICAgICB9IGVsc2UgaWYgKGV4cHQuaXNfZXZlbikge1xuICAgICAgICAgICAgcmV0dXJuIFMuT25lO1xuICAgICAgICB9XG4gICAgICAgIGlmIChleHB0IGluc3RhbmNlb2YgX051bWJlcl8pIHtcbiAgICAgICAgICAgIGlmIChleHB0IGluc3RhbmNlb2YgRmxvYXQpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gbmV3IEZsb2F0KC0xLjApLl9ldmFsX3Bvd2VyKGV4cHQpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKGV4cHQgPT09IFMuTmFOKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIFMuTmFOO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKGV4cHQgPT09IFMuSW5maW5pdHkgfHwgZXhwdCA9PT0gUy5OZWdhdGl2ZUluZmluaXR5KSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIFMuTmFOO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybjtcbiAgICB9XG59O1xuXG5NYW5hZ2VkUHJvcGVydGllcy5yZWdpc3RlcihOZWdhdGl2ZU9uZSk7XG5cbmNsYXNzIE5hTiBleHRlbmRzIF9OdW1iZXJfIHtcbiAgICAvKlxuICAgIE5vdCBhIE51bWJlci5cbiAgICBFeHBsYW5hdGlvblxuICAgID09PT09PT09PT09XG4gICAgVGhpcyBzZXJ2ZXMgYXMgYSBwbGFjZSBob2xkZXIgZm9yIG51bWVyaWMgdmFsdWVzIHRoYXQgYXJlIGluZGV0ZXJtaW5hdGUuXG4gICAgTW9zdCBvcGVyYXRpb25zIG9uIE5hTiwgcHJvZHVjZSBhbm90aGVyIE5hTi4gIE1vc3QgaW5kZXRlcm1pbmF0ZSBmb3JtcyxcbiAgICBzdWNoIGFzIGBgMC8wYGAgb3IgYGBvbyAtIG9vYCBwcm9kdWNlIE5hTi4gIFR3byBleGNlcHRpb25zIGFyZSBgYDAqKjBgYFxuICAgIGFuZCBgYG9vKiowYGAsIHdoaWNoIGFsbCBwcm9kdWNlIGBgMWBgICh0aGlzIGlzIGNvbnNpc3RlbnQgd2l0aCBQeXRob24nc1xuICAgIGZsb2F0KS5cbiAgICBOYU4gaXMgbG9vc2VseSByZWxhdGVkIHRvIGZsb2F0aW5nIHBvaW50IG5hbiwgd2hpY2ggaXMgZGVmaW5lZCBpbiB0aGVcbiAgICBJRUVFIDc1NCBmbG9hdGluZyBwb2ludCBzdGFuZGFyZCwgYW5kIGNvcnJlc3BvbmRzIHRvIHRoZSBQeXRob25cbiAgICBgYGZsb2F0KCduYW4nKWBgLiAgRGlmZmVyZW5jZXMgYXJlIG5vdGVkIGJlbG93LlxuICAgIE5hTiBpcyBtYXRoZW1hdGljYWxseSBub3QgZXF1YWwgdG8gYW55dGhpbmcgZWxzZSwgZXZlbiBOYU4gaXRzZWxmLiAgVGhpc1xuICAgIGV4cGxhaW5zIHRoZSBpbml0aWFsbHkgY291bnRlci1pbnR1aXRpdmUgcmVzdWx0cyB3aXRoIGBgRXFgYCBhbmQgYGA9PWBgIGluXG4gICAgdGhlIGV4YW1wbGVzIGJlbG93LlxuICAgIE5hTiBpcyBub3QgY29tcGFyYWJsZSBzbyBpbmVxdWFsaXRpZXMgcmFpc2UgYSBUeXBlRXJyb3IuICBUaGlzIGlzIGluXG4gICAgY29udHJhc3Qgd2l0aCBmbG9hdGluZyBwb2ludCBuYW4gd2hlcmUgYWxsIGluZXF1YWxpdGllcyBhcmUgZmFsc2UuXG4gICAgTmFOIGlzIGEgc2luZ2xldG9uLCBhbmQgY2FuIGJlIGFjY2Vzc2VkIGJ5IGBgUy5OYU5gYCwgb3IgY2FuIGJlIGltcG9ydGVkXG4gICAgYXMgYGBuYW5gYC5cbiAgICBFeGFtcGxlc1xuICAgID09PT09PT09XG4gICAgPj4+IGZyb20gc3ltcHkgaW1wb3J0IG5hbiwgUywgb28sIEVxXG4gICAgPj4+IG5hbiBpcyBTLk5hTlxuICAgIFRydWVcbiAgICA+Pj4gb28gLSBvb1xuICAgIG5hblxuICAgID4+PiBuYW4gKyAxXG4gICAgbmFuXG4gICAgPj4+IEVxKG5hbiwgbmFuKSAgICMgbWF0aGVtYXRpY2FsIGVxdWFsaXR5XG4gICAgRmFsc2VcbiAgICA+Pj4gbmFuID09IG5hbiAgICAgIyBzdHJ1Y3R1cmFsIGVxdWFsaXR5XG4gICAgVHJ1ZVxuICAgIFJlZmVyZW5jZXNcbiAgICA9PT09PT09PT09XG4gICAgLi4gWzFdIGh0dHBzOi8vZW4ud2lraXBlZGlhLm9yZy93aWtpL05hTlxuICAgICovXG4gICAgc3RhdGljIGlzX2NvbW11dGF0aXZlID0gdHJ1ZTtcbiAgICBzdGF0aWMgaXNfZXh0ZW5kZWRfcmVhbDogYW55ID0gdW5kZWZpbmVkO1xuICAgIHN0YXRpYyBpc19yZWFsOiBhbnkgPSB1bmRlZmluZWQ7XG4gICAgc3RhdGljIGlzX3JhdGlvbmFsOiBhbnkgPSB1bmRlZmluZWQ7XG4gICAgc3RhdGljIGlzX2FsZ2VicmFpYzogYW55ID0gdW5kZWZpbmVkO1xuICAgIHN0YXRpYyBpc190cmFuc2NlbmRlbnRhbDogYW55ID0gdW5kZWZpbmVkO1xuICAgIHN0YXRpYyBpc19pbnRlZ2VyOiBhbnkgPSB1bmRlZmluZWQ7XG4gICAgc3RhdGljIGlzX2NvbXBhcmFibGUgPSBmYWxzZTtcbiAgICBzdGF0aWMgaXNfZmluaXRlOiBhbnkgPSB1bmRlZmluZWQ7XG4gICAgc3RhdGljIGlzX3plcm86IGFueSA9IHVuZGVmaW5lZDtcbiAgICBzdGF0aWMgaXNfcHJpbWU6IGFueSA9IHVuZGVmaW5lZDtcbiAgICBzdGF0aWMgaXNfcG9zaXRpdmU6IGFueSA9IHVuZGVmaW5lZDtcbiAgICBzdGF0aWMgaXNfbmVnYXRpdmU6IGFueSA9IHVuZGVmaW5lZDtcbiAgICBzdGF0aWMgaXNfbnVtYmVyID0gdHJ1ZTtcbiAgICBfX3Nsb3RzX186IGFueSA9IFtdO1xuICAgIHRvU3RyaW5nKCkge1xuICAgICAgICByZXR1cm4gXCJOQU5cIjtcbiAgICB9XG59XG5cbk1hbmFnZWRQcm9wZXJ0aWVzLnJlZ2lzdGVyKE5hTik7XG5cbi8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBuZXctY2FwXG5jbGFzcyBDb21wbGV4SW5maW5pdHkgZXh0ZW5kcyBfQXRvbWljRXhwciB7XG4gICAgLypcbiAgICBDb21wbGV4IGluZmluaXR5LlxuICAgIEV4cGxhbmF0aW9uXG4gICAgPT09PT09PT09PT1cbiAgICBJbiBjb21wbGV4IGFuYWx5c2lzIHRoZSBzeW1ib2wgYFxcdGlsZGVcXGluZnR5YCwgY2FsbGVkIFwiY29tcGxleFxuICAgIGluZmluaXR5XCIsIHJlcHJlc2VudHMgYSBxdWFudGl0eSB3aXRoIGluZmluaXRlIG1hZ25pdHVkZSwgYnV0XG4gICAgdW5kZXRlcm1pbmVkIGNvbXBsZXggcGhhc2UuXG4gICAgQ29tcGxleEluZmluaXR5IGlzIGEgc2luZ2xldG9uLCBhbmQgY2FuIGJlIGFjY2Vzc2VkIGJ5XG4gICAgYGBTLkNvbXBsZXhJbmZpbml0eWBgLCBvciBjYW4gYmUgaW1wb3J0ZWQgYXMgYGB6b29gYC5cbiAgICBFeGFtcGxlc1xuICAgID09PT09PT09XG4gICAgPj4+IGZyb20gc3ltcHkgaW1wb3J0IHpvb1xuICAgID4+PiB6b28gKyA0MlxuICAgIHpvb1xuICAgID4+PiA0Mi96b29cbiAgICAwXG4gICAgPj4+IHpvbyArIHpvb1xuICAgIG5hblxuICAgID4+PiB6b28qem9vXG4gICAgem9vXG4gICAgU2VlIEFsc29cbiAgICA9PT09PT09PVxuICAgIEluZmluaXR5XG4gICAgKi9cbiAgICBzdGF0aWMgaXNfY29tbXV0YXRpdmUgPSB0cnVlO1xuICAgIHN0YXRpYyBpc19pbmZpbml0ZSA9IHRydWU7XG4gICAgc3RhdGljIGlzX251bWJlciA9IHRydWU7XG4gICAgc3RhdGljIGlzX3ByaW1lID0gZmFsc2U7XG4gICAgc3RhdGljIGlzX2NvbXBsZXggPSBmYWxzZTtcbiAgICBzdGF0aWMgaXNfZXh0ZW5kZWRfcmVhbCA9IGZhbHNlO1xuICAgIGtpbmQgPSBOdW1iZXJLaW5kO1xuICAgIF9fc2xvdHNfXzogYW55ID0gW107XG5cbiAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICAgICAgc3VwZXIoKTtcbiAgICB9XG5cbiAgICB0b1N0cmluZygpIHtcbiAgICAgICAgcmV0dXJuIFwiQ29tcGxleEluZmluaXR5XCI7XG4gICAgfVxufVxuXG5NYW5hZ2VkUHJvcGVydGllcy5yZWdpc3RlcihDb21wbGV4SW5maW5pdHkpO1xuXG5jbGFzcyBJbmZpbml0eSBleHRlbmRzIF9OdW1iZXJfIHtcbiAgICAvKlxuICAgIFBvc2l0aXZlIGluZmluaXRlIHF1YW50aXR5LlxuICAgIEV4cGxhbmF0aW9uXG4gICAgPT09PT09PT09PT1cbiAgICBJbiByZWFsIGFuYWx5c2lzIHRoZSBzeW1ib2wgYFxcaW5mdHlgIGRlbm90ZXMgYW4gdW5ib3VuZGVkXG4gICAgbGltaXQ6IGB4XFx0b1xcaW5mdHlgIG1lYW5zIHRoYXQgYHhgIGdyb3dzIHdpdGhvdXQgYm91bmQuXG4gICAgSW5maW5pdHkgaXMgb2Z0ZW4gdXNlZCBub3Qgb25seSB0byBkZWZpbmUgYSBsaW1pdCBidXQgYXMgYSB2YWx1ZVxuICAgIGluIHRoZSBhZmZpbmVseSBleHRlbmRlZCByZWFsIG51bWJlciBzeXN0ZW0uICBQb2ludHMgbGFiZWxlZCBgK1xcaW5mdHlgXG4gICAgYW5kIGAtXFxpbmZ0eWAgY2FuIGJlIGFkZGVkIHRvIHRoZSB0b3BvbG9naWNhbCBzcGFjZSBvZiB0aGUgcmVhbCBudW1iZXJzLFxuICAgIHByb2R1Y2luZyB0aGUgdHdvLXBvaW50IGNvbXBhY3RpZmljYXRpb24gb2YgdGhlIHJlYWwgbnVtYmVycy4gIEFkZGluZ1xuICAgIGFsZ2VicmFpYyBwcm9wZXJ0aWVzIHRvIHRoaXMgZ2l2ZXMgdXMgdGhlIGV4dGVuZGVkIHJlYWwgbnVtYmVycy5cbiAgICBJbmZpbml0eSBpcyBhIHNpbmdsZXRvbiwgYW5kIGNhbiBiZSBhY2Nlc3NlZCBieSBgYFMuSW5maW5pdHlgYCxcbiAgICBvciBjYW4gYmUgaW1wb3J0ZWQgYXMgYGBvb2BgLlxuICAgIEV4YW1wbGVzXG4gICAgPT09PT09PT1cbiAgICA+Pj4gZnJvbSBzeW1weSBpbXBvcnQgb28sIGV4cCwgbGltaXQsIFN5bWJvbFxuICAgID4+PiAxICsgb29cbiAgICBvb1xuICAgID4+PiA0Mi9vb1xuICAgIDBcbiAgICA+Pj4geCA9IFN5bWJvbCgneCcpXG4gICAgPj4+IGxpbWl0KGV4cCh4KSwgeCwgb28pXG4gICAgb29cbiAgICBTZWUgQWxzb1xuICAgID09PT09PT09XG4gICAgTmVnYXRpdmVJbmZpbml0eSwgTmFOXG4gICAgUmVmZXJlbmNlc1xuICAgID09PT09PT09PT1cbiAgICAuLiBbMV0gaHR0cHM6Ly9lbi53aWtpcGVkaWEub3JnL3dpa2kvSW5maW5pdHlcbiAgICAqL1xuICAgIHN0YXRpYyBpc19jb21tdXRhdGl2ZSA9IHRydWU7XG4gICAgc3RhdGljIGlzX251bWJlciA9IHRydWU7XG4gICAgc3RhdGljIGlzX2NvbXBsZXggPSBmYWxzZTtcbiAgICBzdGF0aWMgaXNfZXh0ZW5kZWRfcmVhbCA9IHRydWU7XG4gICAgc3RhdGljIGlzX2luZmluaXRlID0gdHJ1ZTtcbiAgICBzdGF0aWMgaXNfY29tcGFyYWJsZSA9IHRydWU7XG4gICAgc3RhdGljIGlzX2V4dGVuZGVkX3Bvc2l0aXZlID0gdHJ1ZTtcbiAgICBzdGF0aWMgaXNfcHJpbWUgPSBmYWxzZTtcbiAgICBfX3Nsb3RzX186IGFueSA9IFtdO1xuXG4gICAgY29uc3RydWN0b3IoKSB7XG4gICAgICAgIHN1cGVyKCk7XG4gICAgfVxuXG4gICAgLy8gTk9URTogbW9yZSBhcml0aG1ldGljIG1ldGhvZHMgc2hvdWxkIGJlIGltcGxlbWVudGVkIGJ1dCBJIGhhdmUgb25seVxuICAgIC8vIGRvbmUgZW5vdWdoIHN1Y2ggdGhhdCBhZGQgYW5kIG11bCBjYW4gaGFuZGxlIGluZmluaXR5IGFzIGFuIGFyZ3VtZW50XG4gICAgX19hZGRfXyhvdGhlcjogYW55KSB7XG4gICAgICAgIGlmIChvdGhlciBpbnN0YW5jZW9mIF9OdW1iZXJfICYmIGdsb2JhbF9wYXJhbWV0ZXJzLmV2YWx1YXRlKSB7XG4gICAgICAgICAgICBpZiAob3RoZXIgPT09IFMuTmVnYXRpdmVJbmZpbml0eSB8fCBvdGhlciA9PT0gUy5OYU4pIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gUy5OYU47XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gc3VwZXIuX19hZGRfXyhvdGhlcik7XG4gICAgfVxuXG4gICAgX19tdWxfXyhvdGhlcjogYW55KSB7XG4gICAgICAgIGlmIChvdGhlciBpbnN0YW5jZW9mIF9OdW1iZXJfICYmIGdsb2JhbF9wYXJhbWV0ZXJzLmV2YWx1YXRlKSB7XG4gICAgICAgICAgICBpZiAob3RoZXIgPT09IFMuWmVybyB8fCBvdGhlciA9PT0gUy5OYU4pIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gUy5OYU47XG4gICAgICAgICAgICB9IGVsc2UgaWYgKG90aGVyLmlzX2V4dGVuZGVkX3Bvc2l0aXZlKCkpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiBTLk5lZ2F0aXZlSW5maW5pdHk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHN1cGVyLl9fbXVsX18ob3RoZXIpO1xuICAgIH1cblxuICAgIHRvU3RyaW5nKCkge1xuICAgICAgICByZXR1cm4gXCJJbmZpbml0eVwiO1xuICAgIH1cbn1cblxuY2xhc3MgTmVnYXRpdmVJbmZpbml0eSBleHRlbmRzIF9OdW1iZXJfIHtcbiAgICAvKlxuICAgIFwiTmVnYXRpdmUgaW5maW5pdGUgcXVhbnRpdHkuXG4gICAgTmVnYXRpdmVJbmZpbml0eSBpcyBhIHNpbmdsZXRvbiwgYW5kIGNhbiBiZSBhY2Nlc3NlZFxuICAgIGJ5IGBgUy5OZWdhdGl2ZUluZmluaXR5YGAuXG4gICAgU2VlIEFsc29cbiAgICA9PT09PT09PVxuICAgIEluZmluaXR5XG4gICAgKi9cbiAgICBzdGF0aWMgaXNfZXh0ZW5kZWRfcmVhbCA9IHRydWU7XG4gICAgc3RhdGljIGlzX2NvbXBsZXggPSBmYWxzZTtcbiAgICBzdGF0aWMgaXNfY29tbXV0YXRpdmUgPSB0cnVlO1xuICAgIHN0YXRpYyBpc19pbmZpbml0ZSA9IHRydWU7XG4gICAgc3RhdGljIGlzX2NvbXBhcmFibGUgPSB0cnVlO1xuICAgIHN0YXRpYyBpc19leHRlbmRlZF9uZWdhdGl2ZSA9IHRydWU7XG4gICAgc3RhdGljIGlzX251bWJlciA9IHRydWU7XG4gICAgc3RhdGljIGlzX3ByaW1lID0gZmFsc2U7XG4gICAgX19zbG90c19fOiBhbnkgPSBbXTtcblxuICAgIGNvbnN0cnVjdG9yKCkge1xuICAgICAgICBzdXBlcigpO1xuICAgIH1cblxuICAgIC8vIE5PVEU6IG1vcmUgYXJpdGhtZXRpYyBtZXRob2RzIHNob3VsZCBiZSBpbXBsZW1lbnRlZCBidXQgSSBoYXZlIG9ubHlcbiAgICAvLyBkb25lIGVub3VnaCBzdWNoIHRoYXQgYWRkIGFuZCBtdWwgY2FuIGhhbmRsZSBuZWdhdGl2ZWluZmluaXR5IGFzIGFuIGFyZ3VtZW50XG4gICAgX19hZGRfXyhvdGhlcjogYW55KSB7XG4gICAgICAgIGlmIChvdGhlciBpbnN0YW5jZW9mIF9OdW1iZXJfICYmIGdsb2JhbF9wYXJhbWV0ZXJzLmV2YWx1YXRlKSB7XG4gICAgICAgICAgICBpZiAob3RoZXIgPT09IFMuTmVnYXRpdmVJbmZpbml0eSB8fCBvdGhlciA9PT0gUy5OYU4pIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gUy5OYU47XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gc3VwZXIuX19hZGRfXyhvdGhlcik7XG4gICAgfVxuXG4gICAgX19tdWxfXyhvdGhlcjogYW55KSB7XG4gICAgICAgIGlmIChvdGhlciBpbnN0YW5jZW9mIF9OdW1iZXJfICYmIGdsb2JhbF9wYXJhbWV0ZXJzLmV2YWx1YXRlKSB7XG4gICAgICAgICAgICBpZiAob3RoZXIgPT09IFMuWmVybyB8fCBvdGhlciA9PT0gUy5OYU4pIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gUy5OYU47XG4gICAgICAgICAgICB9IGVsc2UgaWYgKG90aGVyLmlzX2V4dGVuZGVkX3Bvc2l0aXZlKCkpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiBTLkluZmluaXR5O1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBzdXBlci5fX211bF9fKG90aGVyKTtcbiAgICB9XG5cbiAgICB0b1N0cmluZygpIHtcbiAgICAgICAgcmV0dXJuIFwiTmVnSW5maW5pdHlcIjtcbiAgICB9XG59XG5cbi8vIFJlZ2lzdGVyaW5nIHNpbmdsZXRvbnMgKHNlZSBzaW5nbGV0b24gY2xhc3MpXG5TaW5nbGV0b24ucmVnaXN0ZXIoXCJaZXJvXCIsIFplcm8pO1xuUy5aZXJvID0gU2luZ2xldG9uLnJlZ2lzdHJ5W1wiWmVyb1wiXTtcblxuU2luZ2xldG9uLnJlZ2lzdGVyKFwiT25lXCIsIE9uZSk7XG5TLk9uZSA9IFNpbmdsZXRvbi5yZWdpc3RyeVtcIk9uZVwiXTtcblxuU2luZ2xldG9uLnJlZ2lzdGVyKFwiTmVnYXRpdmVPbmVcIiwgTmVnYXRpdmVPbmUpO1xuUy5OZWdhdGl2ZU9uZSA9IFNpbmdsZXRvbi5yZWdpc3RyeVtcIk5lZ2F0aXZlT25lXCJdO1xuXG5TaW5nbGV0b24ucmVnaXN0ZXIoXCJOYU5cIiwgTmFOKTtcblMuTmFOID0gU2luZ2xldG9uLnJlZ2lzdHJ5W1wiTmFOXCJdO1xuXG5TaW5nbGV0b24ucmVnaXN0ZXIoXCJDb21wbGV4SW5maW5pdHlcIiwgQ29tcGxleEluZmluaXR5KTtcblMuQ29tcGxleEluZmluaXR5ID0gU2luZ2xldG9uLnJlZ2lzdHJ5W1wiQ29tcGxleEluZmluaXR5XCJdO1xuXG5TaW5nbGV0b24ucmVnaXN0ZXIoXCJJbmZpbml0eVwiLCBJbmZpbml0eSk7XG5TLkluZmluaXR5ID0gU2luZ2xldG9uLnJlZ2lzdHJ5W1wiSW5maW5pdHlcIl07XG5cblNpbmdsZXRvbi5yZWdpc3RlcihcIk5lZ2F0aXZlSW5maW5pdHlcIiwgTmVnYXRpdmVJbmZpbml0eSk7XG5TLk5lZ2F0aXZlSW5maW5pdHkgPSBTaW5nbGV0b24ucmVnaXN0cnlbXCJOZWdhdGl2ZUluZmluaXR5XCJdO1xuXG5leHBvcnQge1JhdGlvbmFsLCBfTnVtYmVyXywgRmxvYXQsIEludGVnZXIsIFplcm8sIE9uZX07XG4iLCAiLypcbkludGVnZXIgYW5kIHJhdGlvbmFsIGZhY3Rvcml6YXRpb25cblxuTm90YWJsZSBjaGFuZ2VzIG1hZGVcbi0gQSBmZXcgZnVuY3Rpb25zIGluIC5nZW5lcmF0b3IgYW5kIC5ldmFsZiBoYXZlIGJlZW4gbW92ZWQgaGVyZSBmb3Igc2ltcGxpY2l0eVxuLSBOb3RlOiBtb3N0IHBhcmFtZXRlcnMgZm9yIGZhY3RvcmludCBhbmQgZmFjdG9ycmF0IGhhdmUgbm90IGJlZW4gaW1wbGVtZW50ZWRcbi0gU2VlIG5vdGVzIHdpdGhpbiBwZXJmZWN0X3Bvd2VyIGZvciBzcGVjaWZpYyBjaGFuZ2VzXG4tIEFsbCBmYWN0b3IgZnVuY3Rpb25zIHJldHVybiBoYXNoZGljdGlvbmFyaWVzXG4tIEFkdmFuY2VkIGZhY3RvcmluZyBhbGdvcml0aG1zIGZvciBmYWN0b3JpbnQgYXJlIG5vdCB5ZXQgaW1wbGVtZW50ZWRcbiovXG5cbmltcG9ydCB7UmF0aW9uYWwsIGludF9udGhyb290LCBJbnRlZ2VyfSBmcm9tIFwiLi4vY29yZS9udW1iZXJzXCI7XG5pbXBvcnQge1N9IGZyb20gXCIuLi9jb3JlL3NpbmdsZXRvblwiO1xuaW1wb3J0IHtIYXNoRGljdCwgVXRpbH0gZnJvbSBcIi4uL2NvcmUvdXRpbGl0eVwiO1xuaW1wb3J0IHthc19pbnR9IGZyb20gXCIuLi91dGlsaXRpZXMvbWlzY1wiO1xuXG5jb25zdCBzbWFsbF90cmFpbGluZyA9IG5ldyBBcnJheSgyNTYpLmZpbGwoMCk7XG5mb3IgKGxldCBqID0gMTsgaiA8IDg7IGorKykge1xuICAgIFV0aWwuYXNzaWduRWxlbWVudHMoc21hbGxfdHJhaWxpbmcsIG5ldyBBcnJheSgoMTw8KDctaikpKS5maWxsKGopLCAxPDxqLCAxPDwoaisxKSk7XG59XG5cbmZ1bmN0aW9uIGJpdGNvdW50KG46IG51bWJlcikge1xuICAgIC8vIFJldHVybiBzbWFsbGVzdCBpbnRlZ2VyLCBiLCBzdWNoIHRoYXQgfG58LzIqKmIgPCAxXG4gICAgbGV0IGJpdHMgPSAwO1xuICAgIHdoaWxlIChuICE9PSAwKSB7XG4gICAgICAgIGJpdHMgKz0gYml0Q291bnQzMihuIHwgMCk7XG4gICAgICAgIG4gLz0gMHgxMDAwMDAwMDA7XG4gICAgfVxuICAgIHJldHVybiBiaXRzO1xufVxuXG4vLyBzbWFsbCBiaXRjb3VudCB1c2VkIHRvIGZhY2lsaWF0ZSBsYXJnZXIgb25lXG5mdW5jdGlvbiBiaXRDb3VudDMyKG46IG51bWJlcikge1xuICAgIG4gPSBuIC0gKChuID4+IDEpICYgMHg1NTU1NTU1NSk7XG4gICAgbiA9IChuICYgMHgzMzMzMzMzMykgKyAoKG4gPj4gMikgJiAweDMzMzMzMzMzKTtcbiAgICByZXR1cm4gKChuICsgKG4gPj4gNCkgJiAweEYwRjBGMEYpICogMHgxMDEwMTAxKSA+PiAyNDtcbn1cblxuZnVuY3Rpb24gdHJhaWxpbmcobjogbnVtYmVyKSB7XG4gICAgLypcbiAgICBDb3VudCB0aGUgbnVtYmVyIG9mIHRyYWlsaW5nIHplcm8gZGlnaXRzIGluIHRoZSBiaW5hcnlcbiAgICByZXByZXNlbnRhdGlvbiBvZiBuLCBpLmUuIGRldGVybWluZSB0aGUgbGFyZ2VzdCBwb3dlciBvZiAyXG4gICAgdGhhdCBkaXZpZGVzIG4uXG4gICAgRXhhbXBsZXNcbiAgICA9PT09PT09PVxuICAgID4+PiBmcm9tIHN5bXB5IGltcG9ydCB0cmFpbGluZ1xuICAgID4+PiB0cmFpbGluZygxMjgpXG4gICAgN1xuICAgID4+PiB0cmFpbGluZyg2MylcbiAgICAwXG4gICAgKi9cbiAgICBuID0gTWF0aC5mbG9vcihNYXRoLmFicyhuKSk7XG4gICAgY29uc3QgbG93X2J5dGUgPSBuICYgMHhmZjtcbiAgICBpZiAobG93X2J5dGUpIHtcbiAgICAgICAgcmV0dXJuIHNtYWxsX3RyYWlsaW5nW2xvd19ieXRlXTtcbiAgICB9XG4gICAgY29uc3QgeiA9IGJpdGNvdW50KG4pIC0gMTtcbiAgICBpZiAoTnVtYmVyLmlzSW50ZWdlcih6KSkge1xuICAgICAgICBpZiAobiA9PT0gMSA8PCB6KSB7XG4gICAgICAgICAgICByZXR1cm4gejtcbiAgICAgICAgfVxuICAgIH1cbiAgICBpZiAoeiA8IDMwMCkge1xuICAgICAgICBsZXQgdCA9IDg7XG4gICAgICAgIG4gPj49IDg7XG4gICAgICAgIHdoaWxlICghKG4gJiAweGZmKSkge1xuICAgICAgICAgICAgbiA+Pj0gODtcbiAgICAgICAgICAgIHQgKz0gODtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdCArIHNtYWxsX3RyYWlsaW5nW24gJiAweGZmXTtcbiAgICB9XG4gICAgbGV0IHQgPSAwO1xuICAgIGxldCBwID0gODtcbiAgICB3aGlsZSAoIShuICYgMSkpIHtcbiAgICAgICAgd2hpbGUgKCEobiAmICgoMSA8PCBwKSAtIDEpKSkge1xuICAgICAgICAgICAgbiA+Pj0gcDtcbiAgICAgICAgICAgIHQgKz0gcDtcbiAgICAgICAgICAgIHAgKj0gMjtcbiAgICAgICAgfVxuICAgICAgICBwID0gTWF0aC5mbG9vcihwLzIpO1xuICAgIH1cbiAgICByZXR1cm4gdDtcbn1cblxuLy8gbm90ZTogdGhpcyBpcyBkaWZmZXJlbnQgdGhhbiB0aGUgb3JpZ2luYWwgc3ltcHkgdmVyc2lvbiAtIGltcGxlbWVudCBsYXRlclxuZnVuY3Rpb24gaXNwcmltZShudW06IG51bWJlcikge1xuICAgIGZvciAobGV0IGkgPSAyLCBzID0gTWF0aC5zcXJ0KG51bSk7IGkgPD0gczsgaSsrKSB7XG4gICAgICAgIGlmIChudW0gJSBpID09PSAwKSB7XG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIChudW0gPiAxKTtcbn1cblxuZnVuY3Rpb24qIHByaW1lcmFuZ2UoYTogbnVtYmVyLCBiOiBudW1iZXIgPSB1bmRlZmluZWQpIHtcbiAgICAvKlxuICAgIEdlbmVyYXRlIGFsbCBwcmltZSBudW1iZXJzIGluIHRoZSByYW5nZSBbMiwgYSkgb3IgW2EsIGIpLlxuICAgIEV4YW1wbGVzXG4gICAgPT09PT09PT1cbiAgICA+Pj4gZnJvbSBzeW1weSBpbXBvcnQgc2lldmUsIHByaW1lXG4gICAgQWxsIHByaW1lcyBsZXNzIHRoYW4gMTk6XG4gICAgPj4+IHByaW50KFtpIGZvciBpIGluIHNpZXZlLnByaW1lcmFuZ2UoMTkpXSlcbiAgICBbMiwgMywgNSwgNywgMTEsIDEzLCAxN11cbiAgICBBbGwgcHJpbWVzIGdyZWF0ZXIgdGhhbiBvciBlcXVhbCB0byA3IGFuZCBsZXNzIHRoYW4gMTk6XG4gICAgPj4+IHByaW50KFtpIGZvciBpIGluIHNpZXZlLnByaW1lcmFuZ2UoNywgMTkpXSlcbiAgICBbNywgMTEsIDEzLCAxN11cbiAgICBBbGwgcHJpbWVzIHRocm91Z2ggdGhlIDEwdGggcHJpbWVcbiAgICA+Pj4gbGlzdChzaWV2ZS5wcmltZXJhbmdlKHByaW1lKDEwKSArIDEpKVxuICAgIFsyLCAzLCA1LCA3LCAxMSwgMTMsIDE3LCAxOSwgMjMsIDI5XVxuICAgICovXG4gICAgaWYgKHR5cGVvZiBiID09PSBcInVuZGVmaW5lZFwiKSB7XG4gICAgICAgIFthLCBiXSA9IFsyLCBhXTtcbiAgICB9XG4gICAgaWYgKGEgPj0gYikge1xuICAgICAgICByZXR1cm47XG4gICAgfVxuICAgIGEgPSBNYXRoLmNlaWwoYSkgLSAxO1xuICAgIGIgPSBNYXRoLmZsb29yKGIpO1xuXG4gICAgd2hpbGUgKDEpIHtcbiAgICAgICAgYSA9IG5leHRwcmltZShhKTtcbiAgICAgICAgaWYgKGEgPCBiKSB7XG4gICAgICAgICAgICB5aWVsZCBhO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgfVxufVxuXG5mdW5jdGlvbiBuZXh0cHJpbWUobjogbnVtYmVyLCBpdGg6IG51bWJlciA9IDEpIHtcbiAgICAvKlxuICAgIFJldHVybiB0aGUgaXRoIHByaW1lIGdyZWF0ZXIgdGhhbiBuLlxuICAgIGkgbXVzdCBiZSBhbiBpbnRlZ2VyLlxuICAgIE5vdGVzXG4gICAgPT09PT1cbiAgICBQb3RlbnRpYWwgcHJpbWVzIGFyZSBsb2NhdGVkIGF0IDYqaiArLy0gMS4gVGhpc1xuICAgIHByb3BlcnR5IGlzIHVzZWQgZHVyaW5nIHNlYXJjaGluZy5cbiAgICA+Pj4gZnJvbSBzeW1weSBpbXBvcnQgbmV4dHByaW1lXG4gICAgPj4+IFsoaSwgbmV4dHByaW1lKGkpKSBmb3IgaSBpbiByYW5nZSgxMCwgMTUpXVxuICAgIFsoMTAsIDExKSwgKDExLCAxMyksICgxMiwgMTMpLCAoMTMsIDE3KSwgKDE0LCAxNyldXG4gICAgPj4+IG5leHRwcmltZSgyLCBpdGg9MikgIyB0aGUgMm5kIHByaW1lIGFmdGVyIDJcbiAgICA1XG4gICAgU2VlIEFsc29cbiAgICA9PT09PT09PVxuICAgIHByZXZwcmltZSA6IFJldHVybiB0aGUgbGFyZ2VzdCBwcmltZSBzbWFsbGVyIHRoYW4gblxuICAgIHByaW1lcmFuZ2UgOiBHZW5lcmF0ZSBhbGwgcHJpbWVzIGluIGEgZ2l2ZW4gcmFuZ2VcbiAgICAqL1xuICAgIG4gPSBNYXRoLmZsb29yKG4pO1xuICAgIGNvbnN0IGkgPSBhc19pbnQoaXRoKTtcbiAgICBpZiAoaSA+IDEpIHtcbiAgICAgICAgbGV0IHByID0gbjtcbiAgICAgICAgbGV0IGogPSAxO1xuICAgICAgICB3aGlsZSAoMSkge1xuICAgICAgICAgICAgcHIgPSBuZXh0cHJpbWUocHIpO1xuICAgICAgICAgICAgaisrO1xuICAgICAgICAgICAgaWYgKGogPiAxKSB7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHByO1xuICAgIH1cbiAgICBpZiAobiA8IDIpIHtcbiAgICAgICAgcmV0dXJuIDI7XG4gICAgfVxuICAgIGlmIChuIDwgNykge1xuICAgICAgICByZXR1cm4gezI6IDMsIDM6IDUsIDQ6IDUsIDU6IDcsIDY6IDd9W25dO1xuICAgIH1cbiAgICBjb25zdCBubiA9IDYgKiBNYXRoLmZsb29yKG4vNik7XG4gICAgaWYgKG5uID09PSBuKSB7XG4gICAgICAgIG4rKztcbiAgICAgICAgaWYgKGlzcHJpbWUobikpIHtcbiAgICAgICAgICAgIHJldHVybiBuO1xuICAgICAgICB9XG4gICAgICAgIG4gKz0gNDtcbiAgICB9IGVsc2UgaWYgKG4gLSBubiA9PT0gNSkge1xuICAgICAgICBuICs9IDI7XG4gICAgICAgIGlmIChpc3ByaW1lKG4pKSB7XG4gICAgICAgICAgICByZXR1cm4gbjtcbiAgICAgICAgfVxuICAgICAgICBuICs9IDQ7XG4gICAgfSBlbHNlIHtcbiAgICAgICAgbiA9IG5uICsgNTtcbiAgICB9XG4gICAgd2hpbGUgKDEpIHtcbiAgICAgICAgaWYgKGlzcHJpbWUobikpIHtcbiAgICAgICAgICAgIHJldHVybiBuO1xuICAgICAgICB9XG4gICAgICAgIG4gKz0gMjtcbiAgICAgICAgaWYgKGlzcHJpbWUobikpIHtcbiAgICAgICAgICAgIHJldHVybiBuO1xuICAgICAgICB9XG4gICAgICAgIG4gKz0gNDtcbiAgICB9XG59XG5cbmV4cG9ydCBjb25zdCBkaXZtb2QgPSAoYTogbnVtYmVyLCBiOiBudW1iZXIpID0+IFtNYXRoLmZsb29yKGEvYiksIGElYl07XG5cbmZ1bmN0aW9uIG11bHRpcGxpY2l0eShwOiBhbnksIG46IGFueSk6IGFueSB7XG4gICAgLypcbiAgICBGaW5kIHRoZSBncmVhdGVzdCBpbnRlZ2VyIG0gc3VjaCB0aGF0IHAqKm0gZGl2aWRlcyBuLlxuICAgIEV4YW1wbGVzXG4gICAgPT09PT09PT1cbiAgICA+Pj4gZnJvbSBzeW1weSBpbXBvcnQgbXVsdGlwbGljaXR5LCBSYXRpb25hbFxuICAgID4+PiBbbXVsdGlwbGljaXR5KDUsIG4pIGZvciBuIGluIFs4LCA1LCAyNSwgMTI1LCAyNTBdXVxuICAgIFswLCAxLCAyLCAzLCAzXVxuICAgID4+PiBtdWx0aXBsaWNpdHkoMywgUmF0aW9uYWwoMSwgOSkpXG4gICAgLTJcbiAgICBOb3RlOiB3aGVuIGNoZWNraW5nIGZvciB0aGUgbXVsdGlwbGljaXR5IG9mIGEgbnVtYmVyIGluIGFcbiAgICBsYXJnZSBmYWN0b3JpYWwgaXQgaXMgbW9zdCBlZmZpY2llbnQgdG8gc2VuZCBpdCBhcyBhbiB1bmV2YWx1YXRlZFxuICAgIGZhY3RvcmlhbCBvciB0byBjYWxsIGBgbXVsdGlwbGljaXR5X2luX2ZhY3RvcmlhbGBgIGRpcmVjdGx5OlxuICAgID4+PiBmcm9tIHN5bXB5Lm50aGVvcnkgaW1wb3J0IG11bHRpcGxpY2l0eV9pbl9mYWN0b3JpYWxcbiAgICA+Pj4gZnJvbSBzeW1weSBpbXBvcnQgZmFjdG9yaWFsXG4gICAgPj4+IHAgPSBmYWN0b3JpYWwoMjUpXG4gICAgPj4+IG4gPSAyKioxMDBcbiAgICA+Pj4gbmZhYyA9IGZhY3RvcmlhbChuLCBldmFsdWF0ZT1GYWxzZSlcbiAgICA+Pj4gbXVsdGlwbGljaXR5KHAsIG5mYWMpXG4gICAgNTI4MTg3NzUwMDk1MDk1NTgzOTU2OTU5NjY4ODdcbiAgICA+Pj4gXyA9PSBtdWx0aXBsaWNpdHlfaW5fZmFjdG9yaWFsKHAsIG4pXG4gICAgVHJ1ZVxuICAgICovXG4gICAgdHJ5IHtcbiAgICAgICAgW3AsIG5dID0gW2FzX2ludChwKSwgYXNfaW50KG4pXTtcbiAgICB9IGNhdGNoIChFcnJvcikge1xuICAgICAgICBpZiAoTnVtYmVyLmlzSW50ZWdlcihwKSB8fCBwIGluc3RhbmNlb2YgUmF0aW9uYWwgJiYgTnVtYmVyLmlzSW50ZWdlcihuKSB8fCBuIGluc3RhbmNlb2YgUmF0aW9uYWwpIHtcbiAgICAgICAgICAgIHAgPSBuZXcgUmF0aW9uYWwocCk7XG4gICAgICAgICAgICBuID0gbmV3IFJhdGlvbmFsKG4pO1xuICAgICAgICAgICAgaWYgKHAucSA9PT0gMSkge1xuICAgICAgICAgICAgICAgIGlmIChuLnAgPT09IDEpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIC1tdWx0aXBsaWNpdHkocC5wLCBuLnEpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICByZXR1cm4gbXVsdGlwbGljaXR5KHAucCwgbi5wKSAtIG11bHRpcGxpY2l0eShwLnAsIG4ucSk7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKHAucCA9PT0gMSkge1xuICAgICAgICAgICAgICAgIHJldHVybiBtdWx0aXBsaWNpdHkocC5xLCBuLnEpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBjb25zdCBsaWtlID0gTWF0aC5taW4obXVsdGlwbGljaXR5KHAucCwgbi5wKSwgbXVsdGlwbGljaXR5KHAucSwgbi5xKSk7XG4gICAgICAgICAgICAgICAgY29uc3QgY3Jvc3MgPSBNYXRoLm1pbihtdWx0aXBsaWNpdHkocC5xLCBuLnApLCBtdWx0aXBsaWNpdHkocC5wLCBuLnEpKTtcbiAgICAgICAgICAgICAgICByZXR1cm4gbGlrZSAtIGNyb3NzO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuICAgIGlmIChuID09PSAwKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcihcIm5vIGludCBleGlzdHNcIik7XG4gICAgfVxuICAgIGlmIChwID09PSAyKSB7XG4gICAgICAgIHJldHVybiB0cmFpbGluZyhuKTtcbiAgICB9XG4gICAgaWYgKHAgPCAyKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcihcInAgbXVzdCBiZSBpbnRcIik7XG4gICAgfVxuICAgIGlmIChwID09PSBuKSB7XG4gICAgICAgIHJldHVybiAxO1xuICAgIH1cblxuICAgIGxldCBtID0gMDtcbiAgICBuID0gTWF0aC5mbG9vcihuL3ApO1xuICAgIGxldCByZW0gPSBuICUgcDtcbiAgICB3aGlsZSAoIXJlbSkge1xuICAgICAgICBtKys7XG4gICAgICAgIGlmIChtID4gNSkge1xuICAgICAgICAgICAgbGV0IGUgPSAyO1xuICAgICAgICAgICAgd2hpbGUgKDEpIHtcbiAgICAgICAgICAgICAgICBjb25zdCBwcG93ID0gcCoqZTtcbiAgICAgICAgICAgICAgICBpZiAocHBvdyA8IG4pIHtcbiAgICAgICAgICAgICAgICAgICAgY29uc3Qgbm5ldyA9IE1hdGguZmxvb3Iobi9wcG93KTtcbiAgICAgICAgICAgICAgICAgICAgcmVtID0gbiAlIHBwb3c7XG4gICAgICAgICAgICAgICAgICAgIGlmICghKHJlbSkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIG0gKz0gZTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGUgKj0gMjtcbiAgICAgICAgICAgICAgICAgICAgICAgIG4gPSBubmV3O1xuICAgICAgICAgICAgICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgcmV0dXJuIG0gKyBtdWx0aXBsaWNpdHkocCwgbik7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgW24sIHJlbV0gPSBkaXZtb2QobiwgcCk7XG4gICAgfVxuICAgIHJldHVybiBtO1xufVxuXG5mdW5jdGlvbiBkaXZpc29ycyhuOiBudW1iZXIsIGdlbmVyYXRvcjogYm9vbGVhbiA9IGZhbHNlLCBwcm9wZXI6IGJvb2xlYW4gPSBmYWxzZSkge1xuICAgIC8qXG4gICAgUmV0dXJuIGFsbCBkaXZpc29ycyBvZiBuIHNvcnRlZCBmcm9tIDEuLm4gYnkgZGVmYXVsdC5cbiAgICBJZiBnZW5lcmF0b3IgaXMgYGBUcnVlYGAgYW4gdW5vcmRlcmVkIGdlbmVyYXRvciBpcyByZXR1cm5lZC5cbiAgICBUaGUgbnVtYmVyIG9mIGRpdmlzb3JzIG9mIG4gY2FuIGJlIHF1aXRlIGxhcmdlIGlmIHRoZXJlIGFyZSBtYW55XG4gICAgcHJpbWUgZmFjdG9ycyAoY291bnRpbmcgcmVwZWF0ZWQgZmFjdG9ycykuIElmIG9ubHkgdGhlIG51bWJlciBvZlxuICAgIGZhY3RvcnMgaXMgZGVzaXJlZCB1c2UgZGl2aXNvcl9jb3VudChuKS5cbiAgICBFeGFtcGxlc1xuICAgID09PT09PT09XG4gICAgPj4+IGZyb20gc3ltcHkgaW1wb3J0IGRpdmlzb3JzLCBkaXZpc29yX2NvdW50XG4gICAgPj4+IGRpdmlzb3JzKDI0KVxuICAgIFsxLCAyLCAzLCA0LCA2LCA4LCAxMiwgMjRdXG4gICAgPj4+IGRpdmlzb3JfY291bnQoMjQpXG4gICAgOFxuICAgID4+PiBsaXN0KGRpdmlzb3JzKDEyMCwgZ2VuZXJhdG9yPVRydWUpKVxuICAgIFsxLCAyLCA0LCA4LCAzLCA2LCAxMiwgMjQsIDUsIDEwLCAyMCwgNDAsIDE1LCAzMCwgNjAsIDEyMF1cbiAgICBOb3Rlc1xuICAgID09PT09XG4gICAgVGhpcyBpcyBhIHNsaWdodGx5IG1vZGlmaWVkIHZlcnNpb24gb2YgVGltIFBldGVycyByZWZlcmVuY2VkIGF0OlxuICAgIGh0dHBzOi8vc3RhY2tvdmVyZmxvdy5jb20vcXVlc3Rpb25zLzEwMTAzODEvcHl0aG9uLWZhY3Rvcml6YXRpb25cbiAgICBTZWUgQWxzb1xuICAgID09PT09PT09XG4gICAgcHJpbWVmYWN0b3JzLCBmYWN0b3JpbnQsIGRpdmlzb3JfY291bnRcbiAgICAqL1xuICAgIG4gPSBhc19pbnQoTWF0aC5hYnMobikpO1xuICAgIGlmIChpc3ByaW1lKG4pKSB7XG4gICAgICAgIGlmIChwcm9wZXIpIHtcbiAgICAgICAgICAgIHJldHVybiBbMV07XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIFsxLCBuXTtcbiAgICB9XG4gICAgaWYgKG4gPT09IDEpIHtcbiAgICAgICAgaWYgKHByb3Blcikge1xuICAgICAgICAgICAgcmV0dXJuIFtdO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBbMV07XG4gICAgfVxuICAgIGlmIChuID09PSAwKSB7XG4gICAgICAgIHJldHVybiBbXTtcbiAgICB9XG4gICAgY29uc3QgcnYgPSBfZGl2aXNvcnMobiwgcHJvcGVyKTtcbiAgICBpZiAoIWdlbmVyYXRvcikge1xuICAgICAgICBjb25zdCB0ZW1wID0gW107XG4gICAgICAgIGZvciAoY29uc3QgaSBvZiBydikge1xuICAgICAgICAgICAgdGVtcC5wdXNoKGkpO1xuICAgICAgICB9XG4gICAgICAgIHRlbXAuc29ydCgpO1xuICAgICAgICByZXR1cm4gdGVtcDtcbiAgICB9XG4gICAgcmV0dXJuIHJ2O1xufVxuXG5mdW5jdGlvbiogX2Rpdmlzb3JzKG46IG51bWJlciwgZ2VuZXJhdG9yOiBib29sZWFuID0gZmFsc2UsIHByb3BlcjogYm9vbGVhbiA9IGZhbHNlKSB7XG4gICAgLy8gSGVscGVyIGZ1bmN0aW9uIGZvciBkaXZpc29ycyB3aGljaCBnZW5lcmF0ZXMgdGhlIGRpdmlzb3JzLlxuICAgIGNvbnN0IGZhY3RvcmRpY3QgPSBmYWN0b3JpbnQobik7XG4gICAgY29uc3QgcHMgPSBmYWN0b3JkaWN0LmtleXMoKS5zb3J0KCk7XG5cbiAgICBmdW5jdGlvbiogcmVjX2dlbihuOiBudW1iZXIgPSAwKTogYW55IHtcbiAgICAgICAgaWYgKG4gPT09IHBzLmxlbmd0aCkge1xuICAgICAgICAgICAgeWllbGQgMTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGNvbnN0IHBvd3MgPSBbMV07XG4gICAgICAgICAgICBmb3IgKGxldCBqID0gMDsgaiA8IGZhY3RvcmRpY3QuZ2V0KHBzW25dKTsgaisrKSB7XG4gICAgICAgICAgICAgICAgcG93cy5wdXNoKHBvd3NbcG93cy5sZW5ndGggLSAxXSAqIHBzW25dKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGZvciAoY29uc3QgcSBvZiByZWNfZ2VuKG4gKyAxKSkge1xuICAgICAgICAgICAgICAgIGZvciAoY29uc3QgcCBvZiBwb3dzKSB7XG4gICAgICAgICAgICAgICAgICAgIHlpZWxkIHAgKiBxO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cbiAgICBpZiAocHJvcGVyKSB7XG4gICAgICAgIGZvciAoY29uc3QgcCBvZiByZWNfZ2VuKCkpIHtcbiAgICAgICAgICAgIGlmIChwICE9IG4pIHtcbiAgICAgICAgICAgICAgICB5aWVsZCBwO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgICAgZm9yIChjb25zdCBwIG9mIHJlY19nZW4oKSkge1xuICAgICAgICAgICAgeWllbGQgcDtcbiAgICAgICAgfVxuICAgIH1cbn1cblxuXG5mdW5jdGlvbiBfY2hlY2tfdGVybWluYXRpb24oZmFjdG9yczogYW55LCBuOiBudW1iZXIsIGxpbWl0cDE6IGFueSkge1xuICAgIC8qXG4gICAgSGVscGVyIGZ1bmN0aW9uIGZvciBpbnRlZ2VyIGZhY3Rvcml6YXRpb24uIENoZWNrcyBpZiBgYG5gYFxuICAgIGlzIGEgcHJpbWUgb3IgYSBwZXJmZWN0IHBvd2VyLCBhbmQgaW4gdGhvc2UgY2FzZXMgdXBkYXRlc1xuICAgIHRoZSBmYWN0b3JpemF0aW9uIGFuZCByYWlzZXMgYGBTdG9wSXRlcmF0aW9uYGAuXG4gICAgKi9cbiAgICBjb25zdCBwID0gcGVyZmVjdF9wb3dlcihuLCB1bmRlZmluZWQsIHRydWUsIGZhbHNlKTtcbiAgICBpZiAocCAhPT0gZmFsc2UpIHtcbiAgICAgICAgY29uc3QgW2Jhc2UsIGV4cF0gPSBwO1xuICAgICAgICBsZXQgbGltaXQ7XG4gICAgICAgIGlmIChsaW1pdHAxKSB7XG4gICAgICAgICAgICBsaW1pdCA9IGxpbWl0cDEgPSAxO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgbGltaXQgPSBsaW1pdHAxO1xuICAgICAgICB9XG4gICAgICAgIGNvbnN0IGZhY3MgPSBmYWN0b3JpbnQoYmFzZSwgbGltaXQpO1xuICAgICAgICBmb3IgKGNvbnN0IFtiLCBlXSBvZiBmYWNzLmVudHJpZXMoKSkge1xuICAgICAgICAgICAgZmFjdG9yc1tiXSA9IGV4cCplO1xuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgaWYgKGlzcHJpbWUobikpIHtcbiAgICAgICAgZmFjdG9ycy5hZGQobiwgMSk7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcigpO1xuICAgIH1cbiAgICBpZiAobiA9PT0gMSkge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoKTtcbiAgICB9XG59XG5cbmZ1bmN0aW9uIF90cmlhbChmYWN0b3JzOiBhbnksIG46IG51bWJlciwgY2FuZGlkYXRlczogYW55KSB7XG4gICAgLypcbiAgICBIZWxwZXIgZnVuY3Rpb24gZm9yIGludGVnZXIgZmFjdG9yaXphdGlvbi4gVHJpYWwgZmFjdG9ycyBgYG5gXG4gICAgYWdhaW5zdCBhbGwgaW50ZWdlcnMgZ2l2ZW4gaW4gdGhlIHNlcXVlbmNlIGBgY2FuZGlkYXRlc2BgXG4gICAgYW5kIHVwZGF0ZXMgdGhlIGRpY3QgYGBmYWN0b3JzYGAgaW4tcGxhY2UuIFJldHVybnMgdGhlIHJlZHVjZWRcbiAgICB2YWx1ZSBvZiBgYG5gYCBhbmQgYSBmbGFnIGluZGljYXRpbmcgd2hldGhlciBhbnkgZmFjdG9ycyB3ZXJlIGZvdW5kLlxuICAgICovXG4gICAgY29uc3QgbmZhY3RvcnMgPSBmYWN0b3JzLmxlbmd0aDtcbiAgICBmb3IgKGNvbnN0IGQgb2YgY2FuZGlkYXRlcykge1xuICAgICAgICBpZiAobiAlIGQgPT09IDApIHtcbiAgICAgICAgICAgIGNvbnN0IG0gPSBtdWx0aXBsaWNpdHkoZCwgbik7XG4gICAgICAgICAgICBuID0gTWF0aC5mbG9vcihuLyhkKiptKSk7XG4gICAgICAgICAgICBmYWN0b3JzW2RdID0gbTtcbiAgICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gW24sIGZhY3RvcnMubGVuZ3RoICE9PSBuZmFjdG9yc107XG59XG5cbmZ1bmN0aW9uIF9mYWN0b3JpbnRfc21hbGwoZmFjdG9yczogSGFzaERpY3QsIG46IGFueSwgbGltaXQ6IGFueSwgZmFpbF9tYXg6IGFueSkge1xuICAgIC8qXG4gICAgUmV0dXJuIHRoZSB2YWx1ZSBvZiBuIGFuZCBlaXRoZXIgYSAwIChpbmRpY2F0aW5nIHRoYXQgZmFjdG9yaXphdGlvbiB1cFxuICAgIHRvIHRoZSBsaW1pdCB3YXMgY29tcGxldGUpIG9yIGVsc2UgdGhlIG5leHQgbmVhci1wcmltZSB0aGF0IHdvdWxkIGhhdmVcbiAgICBiZWVuIHRlc3RlZC5cbiAgICBGYWN0b3Jpbmcgc3RvcHMgaWYgdGhlcmUgYXJlIGZhaWxfbWF4IHVuc3VjY2Vzc2Z1bCB0ZXN0cyBpbiBhIHJvdy5cbiAgICBJZiBmYWN0b3JzIG9mIG4gd2VyZSBmb3VuZCB0aGV5IHdpbGwgYmUgaW4gdGhlIGZhY3RvcnMgZGljdGlvbmFyeSBhc1xuICAgIHtmYWN0b3I6IG11bHRpcGxpY2l0eX0gYW5kIHRoZSByZXR1cm5lZCB2YWx1ZSBvZiBuIHdpbGwgaGF2ZSBoYWQgdGhvc2VcbiAgICBmYWN0b3JzIHJlbW92ZWQuIFRoZSBmYWN0b3JzIGRpY3Rpb25hcnkgaXMgbW9kaWZpZWQgaW4tcGxhY2UuXG4gICAgKi9cbiAgICBmdW5jdGlvbiBkb25lKG46IG51bWJlciwgZDogbnVtYmVyKSB7XG4gICAgICAgIC8qXG4gICAgICAgIHJldHVybiBuLCBkIGlmIHRoZSBzcXJ0KG4pIHdhcyBub3QgcmVhY2hlZCB5ZXQsIGVsc2VcbiAgICAgICAgbiwgMCBpbmRpY2F0aW5nIHRoYXQgZmFjdG9yaW5nIGlzIGRvbmUuXG4gICAgICAgICovXG4gICAgICAgIGlmIChkKmQgPD0gbikge1xuICAgICAgICAgICAgcmV0dXJuIFtuLCBkXTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gW24sIDBdO1xuICAgIH1cbiAgICBsZXQgZCA9IDI7XG4gICAgbGV0IG0gPSB0cmFpbGluZyhuKTtcbiAgICBpZiAobSkge1xuICAgICAgICBmYWN0b3JzLmFkZChkLCBtKTtcbiAgICAgICAgbiA+Pj0gbTtcbiAgICB9XG4gICAgZCA9IDM7XG4gICAgaWYgKGxpbWl0IDwgZCkge1xuICAgICAgICBpZiAobiA+IDEpIHtcbiAgICAgICAgICAgIGZhY3RvcnMuYWRkKG4sIDEpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBkb25lKG4sIGQpO1xuICAgIH1cbiAgICBtID0gMDtcbiAgICB3aGlsZSAobiAlIGQgPT09IDApIHtcbiAgICAgICAgbiA9IE1hdGguZmxvb3Iobi9kKTtcbiAgICAgICAgbSsrO1xuICAgICAgICBpZiAobSA9PT0gMjApIHtcbiAgICAgICAgICAgIGNvbnN0IG1tID0gbXVsdGlwbGljaXR5KGQsIG4pO1xuICAgICAgICAgICAgbSArPSBtbTtcbiAgICAgICAgICAgIG4gPSBNYXRoLmZsb29yKG4vKGQqKm1tKSk7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuICAgIH1cbiAgICBpZiAobSkge1xuICAgICAgICBmYWN0b3JzLmFkZChkLCBtKTtcbiAgICB9XG4gICAgbGV0IG1heHg7XG4gICAgaWYgKGxpbWl0ICogbGltaXQgPiBuKSB7XG4gICAgICAgIG1heHggPSAwO1xuICAgIH0gZWxzZSB7XG4gICAgICAgIG1heHggPSBsaW1pdCpsaW1pdDtcbiAgICB9XG4gICAgbGV0IGRkID0gbWF4eCB8fCBuO1xuICAgIGQgPSA1O1xuICAgIGxldCBmYWlscyA9IDA7XG4gICAgd2hpbGUgKGZhaWxzIDwgZmFpbF9tYXgpIHtcbiAgICAgICAgaWYgKGQqZCA+IGRkKSB7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuICAgICAgICBtID0gMDtcbiAgICAgICAgd2hpbGUgKG4gJSBkID09PSAwKSB7XG4gICAgICAgICAgICBuID0gTWF0aC5mbG9vcihuL2QpO1xuICAgICAgICAgICAgbSsrO1xuICAgICAgICAgICAgaWYgKG0gPT09IDIwKSB7XG4gICAgICAgICAgICAgICAgY29uc3QgbW0gPSBtdWx0aXBsaWNpdHkoZCwgbik7XG4gICAgICAgICAgICAgICAgbSArPSBtbTtcbiAgICAgICAgICAgICAgICBuID0gTWF0aC5mbG9vcihuIC8gKGQqKm1tKSk7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgaWYgKG0pIHtcbiAgICAgICAgICAgIGZhY3RvcnMuYWRkKGQsIG0pO1xuICAgICAgICAgICAgZGQgPSBtYXh4IHx8IG47XG4gICAgICAgICAgICBmYWlscyA9IDA7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBmYWlscysrO1xuICAgICAgICB9XG4gICAgICAgIGQgKz0gMjtcbiAgICAgICAgaWYgKGQqZD4gZGQpIHtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG4gICAgICAgIG0gPSAwO1xuICAgICAgICB3aGlsZSAobiAlIGQgPT09IDApIHtcbiAgICAgICAgICAgIG4gPSBNYXRoLmZsb29yKG4gLyBkKTtcbiAgICAgICAgICAgIG0rKztcbiAgICAgICAgICAgIGlmIChtID09PSAyMCkge1xuICAgICAgICAgICAgICAgIGNvbnN0IG1tID0gbXVsdGlwbGljaXR5KGQsIG4pO1xuICAgICAgICAgICAgICAgIG0gKz0gbW07XG4gICAgICAgICAgICAgICAgbiA9IE1hdGguZmxvb3Iobi8oZCoqbW0pKTtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBpZiAobSkge1xuICAgICAgICAgICAgZmFjdG9ycy5hZGQoZCwgbSk7XG4gICAgICAgICAgICBkZCA9IG1heHggfHwgbjtcbiAgICAgICAgICAgIGZhaWxzID0gMDtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGZhaWxzKys7XG4gICAgICAgIH1cbiAgICAgICAgZCArPTQ7XG4gICAgfVxuICAgIHJldHVybiBkb25lKG4sIGQpO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gZmFjdG9yaW50KG46IGFueSwgbGltaXQ6IGFueSA9IHVuZGVmaW5lZCk6IEhhc2hEaWN0IHtcbiAgICAvKlxuICAgIEdpdmVuIGEgcG9zaXRpdmUgaW50ZWdlciBgYG5gYCwgYGBmYWN0b3JpbnQobilgYCByZXR1cm5zIGEgZGljdCBjb250YWluaW5nXG4gICAgdGhlIHByaW1lIGZhY3RvcnMgb2YgYGBuYGAgYXMga2V5cyBhbmQgdGhlaXIgcmVzcGVjdGl2ZSBtdWx0aXBsaWNpdGllc1xuICAgIGFzIHZhbHVlcy4gRm9yIGV4YW1wbGU6XG4gICAgPj4+IGZyb20gc3ltcHkubnRoZW9yeSBpbXBvcnQgZmFjdG9yaW50XG4gICAgPj4+IGZhY3RvcmludCgyMDAwKSAgICAjIDIwMDAgPSAoMioqNCkgKiAoNSoqMylcbiAgICB7MjogNCwgNTogM31cbiAgICA+Pj4gZmFjdG9yaW50KDY1NTM3KSAgICMgVGhpcyBudW1iZXIgaXMgcHJpbWVcbiAgICB7NjU1Mzc6IDF9XG4gICAgRm9yIGlucHV0IGxlc3MgdGhhbiAyLCBmYWN0b3JpbnQgYmVoYXZlcyBhcyBmb2xsb3dzOlxuICAgICAgICAtIGBgZmFjdG9yaW50KDEpYGAgcmV0dXJucyB0aGUgZW1wdHkgZmFjdG9yaXphdGlvbiwgYGB7fWBgXG4gICAgICAgIC0gYGBmYWN0b3JpbnQoMClgYCByZXR1cm5zIGBgezA6MX1gYFxuICAgICAgICAtIGBgZmFjdG9yaW50KC1uKWBgIGFkZHMgYGAtMToxYGAgdG8gdGhlIGZhY3RvcnMgYW5kIHRoZW4gZmFjdG9ycyBgYG5gYFxuICAgIFBhcnRpYWwgRmFjdG9yaXphdGlvbjpcbiAgICBJZiBgYGxpbWl0YGAgKD4gMykgaXMgc3BlY2lmaWVkLCB0aGUgc2VhcmNoIGlzIHN0b3BwZWQgYWZ0ZXIgcGVyZm9ybWluZ1xuICAgIHRyaWFsIGRpdmlzaW9uIHVwIHRvIChhbmQgaW5jbHVkaW5nKSB0aGUgbGltaXQgKG9yIHRha2luZyBhXG4gICAgY29ycmVzcG9uZGluZyBudW1iZXIgb2YgcmhvL3AtMSBzdGVwcykuIFRoaXMgaXMgdXNlZnVsIGlmIG9uZSBoYXNcbiAgICBhIGxhcmdlIG51bWJlciBhbmQgb25seSBpcyBpbnRlcmVzdGVkIGluIGZpbmRpbmcgc21hbGwgZmFjdG9ycyAoaWZcbiAgICBhbnkpLiBOb3RlIHRoYXQgc2V0dGluZyBhIGxpbWl0IGRvZXMgbm90IHByZXZlbnQgbGFyZ2VyIGZhY3RvcnNcbiAgICBmcm9tIGJlaW5nIGZvdW5kIGVhcmx5OyBpdCBzaW1wbHkgbWVhbnMgdGhhdCB0aGUgbGFyZ2VzdCBmYWN0b3IgbWF5XG4gICAgYmUgY29tcG9zaXRlLiBTaW5jZSBjaGVja2luZyBmb3IgcGVyZmVjdCBwb3dlciBpcyByZWxhdGl2ZWx5IGNoZWFwLCBpdCBpc1xuICAgIGRvbmUgcmVnYXJkbGVzcyBvZiB0aGUgbGltaXQgc2V0dGluZy5cbiAgICBUaGlzIG51bWJlciwgZm9yIGV4YW1wbGUsIGhhcyB0d28gc21hbGwgZmFjdG9ycyBhbmQgYSBodWdlXG4gICAgc2VtaS1wcmltZSBmYWN0b3IgdGhhdCBjYW5ub3QgYmUgcmVkdWNlZCBlYXNpbHk6XG4gICAgPj4+IGZyb20gc3ltcHkubnRoZW9yeSBpbXBvcnQgaXNwcmltZVxuICAgID4+PiBhID0gMTQwNzYzMzcxNzI2MjMzODk1NzQzMDY5NzkyMTQ0Njg4M1xuICAgID4+PiBmID0gZmFjdG9yaW50KGEsIGxpbWl0PTEwMDAwKVxuICAgID4+PiBmID09IHs5OTE6IDEsIGludCgyMDI5MTY3ODIwNzYxNjI0NTYwMjI4NzcwMjQ4NTkpOiAxLCA3OiAxfVxuICAgIFRydWVcbiAgICA+Pj4gaXNwcmltZShtYXgoZikpXG4gICAgRmFsc2VcbiAgICBUaGlzIG51bWJlciBoYXMgYSBzbWFsbCBmYWN0b3IgYW5kIGEgcmVzaWR1YWwgcGVyZmVjdCBwb3dlciB3aG9zZVxuICAgIGJhc2UgaXMgZ3JlYXRlciB0aGFuIHRoZSBsaW1pdDpcbiAgICA+Pj4gZmFjdG9yaW50KDMqMTAxKio3LCBsaW1pdD01KVxuICAgIHszOiAxLCAxMDE6IDd9XG4gICAgTGlzdCBvZiBGYWN0b3JzOlxuICAgIElmIGBgbXVsdGlwbGVgYCBpcyBzZXQgdG8gYGBUcnVlYGAgdGhlbiBhIGxpc3QgY29udGFpbmluZyB0aGVcbiAgICBwcmltZSBmYWN0b3JzIGluY2x1ZGluZyBtdWx0aXBsaWNpdGllcyBpcyByZXR1cm5lZC5cbiAgICA+Pj4gZmFjdG9yaW50KDI0LCBtdWx0aXBsZT1UcnVlKVxuICAgIFsyLCAyLCAyLCAzXVxuICAgIFZpc3VhbCBGYWN0b3JpemF0aW9uOlxuICAgIElmIGBgdmlzdWFsYGAgaXMgc2V0IHRvIGBgVHJ1ZWBgLCB0aGVuIGl0IHdpbGwgcmV0dXJuIGEgdmlzdWFsXG4gICAgZmFjdG9yaXphdGlvbiBvZiB0aGUgaW50ZWdlci4gIEZvciBleGFtcGxlOlxuICAgID4+PiBmcm9tIHN5bXB5IGltcG9ydCBwcHJpbnRcbiAgICA+Pj4gcHByaW50KGZhY3RvcmludCg0MjAwLCB2aXN1YWw9VHJ1ZSkpXG4gICAgIDMgIDEgIDIgIDFcbiAgICAyICozICo1ICo3XG4gICAgTm90ZSB0aGF0IHRoaXMgaXMgYWNoaWV2ZWQgYnkgdXNpbmcgdGhlIGV2YWx1YXRlPUZhbHNlIGZsYWcgaW4gTXVsXG4gICAgYW5kIFBvdy4gSWYgeW91IGRvIG90aGVyIG1hbmlwdWxhdGlvbnMgd2l0aCBhbiBleHByZXNzaW9uIHdoZXJlXG4gICAgZXZhbHVhdGU9RmFsc2UsIGl0IG1heSBldmFsdWF0ZS4gIFRoZXJlZm9yZSwgeW91IHNob3VsZCB1c2UgdGhlXG4gICAgdmlzdWFsIG9wdGlvbiBvbmx5IGZvciB2aXN1YWxpemF0aW9uLCBhbmQgdXNlIHRoZSBub3JtYWwgZGljdGlvbmFyeVxuICAgIHJldHVybmVkIGJ5IHZpc3VhbD1GYWxzZSBpZiB5b3Ugd2FudCB0byBwZXJmb3JtIG9wZXJhdGlvbnMgb24gdGhlXG4gICAgZmFjdG9ycy5cbiAgICBZb3UgY2FuIGVhc2lseSBzd2l0Y2ggYmV0d2VlbiB0aGUgdHdvIGZvcm1zIGJ5IHNlbmRpbmcgdGhlbSBiYWNrIHRvXG4gICAgZmFjdG9yaW50OlxuICAgID4+PiBmcm9tIHN5bXB5IGltcG9ydCBNdWxcbiAgICA+Pj4gcmVndWxhciA9IGZhY3RvcmludCgxNzY0KTsgcmVndWxhclxuICAgIHsyOiAyLCAzOiAyLCA3OiAyfVxuICAgID4+PiBwcHJpbnQoZmFjdG9yaW50KHJlZ3VsYXIpKVxuICAgICAyICAyICAyXG4gICAgMiAqMyAqN1xuICAgID4+PiB2aXN1YWwgPSBmYWN0b3JpbnQoMTc2NCwgdmlzdWFsPVRydWUpOyBwcHJpbnQodmlzdWFsKVxuICAgICAyICAyICAyXG4gICAgMiAqMyAqN1xuICAgID4+PiBwcmludChmYWN0b3JpbnQodmlzdWFsKSlcbiAgICB7MjogMiwgMzogMiwgNzogMn1cbiAgICBJZiB5b3Ugd2FudCB0byBzZW5kIGEgbnVtYmVyIHRvIGJlIGZhY3RvcmVkIGluIGEgcGFydGlhbGx5IGZhY3RvcmVkIGZvcm1cbiAgICB5b3UgY2FuIGRvIHNvIHdpdGggYSBkaWN0aW9uYXJ5IG9yIHVuZXZhbHVhdGVkIGV4cHJlc3Npb246XG4gICAgPj4+IGZhY3RvcmludChmYWN0b3JpbnQoezQ6IDIsIDEyOiAzfSkpICMgdHdpY2UgdG8gdG9nZ2xlIHRvIGRpY3QgZm9ybVxuICAgIHsyOiAxMCwgMzogM31cbiAgICA+Pj4gZmFjdG9yaW50KE11bCg0LCAxMiwgZXZhbHVhdGU9RmFsc2UpKVxuICAgIHsyOiA0LCAzOiAxfVxuICAgIFRoZSB0YWJsZSBvZiB0aGUgb3V0cHV0IGxvZ2ljIGlzOlxuICAgICAgICA9PT09PT0gPT09PT09ID09PT09PT0gPT09PT09PVxuICAgICAgICAgICAgICAgICAgICAgICBWaXN1YWxcbiAgICAgICAgLS0tLS0tIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAgICAgSW5wdXQgIFRydWUgICBGYWxzZSAgIG90aGVyXG4gICAgICAgID09PT09PSA9PT09PT0gPT09PT09PSA9PT09PT09XG4gICAgICAgIGRpY3QgICAgbXVsICAgIGRpY3QgICAgbXVsXG4gICAgICAgIG4gICAgICAgbXVsICAgIGRpY3QgICAgZGljdFxuICAgICAgICBtdWwgICAgIG11bCAgICBkaWN0ICAgIGRpY3RcbiAgICAgICAgPT09PT09ID09PT09PSA9PT09PT09ID09PT09PT1cbiAgICBOb3Rlc1xuICAgID09PT09XG4gICAgQWxnb3JpdGhtOlxuICAgIFRoZSBmdW5jdGlvbiBzd2l0Y2hlcyBiZXR3ZWVuIG11bHRpcGxlIGFsZ29yaXRobXMuIFRyaWFsIGRpdmlzaW9uXG4gICAgcXVpY2tseSBmaW5kcyBzbWFsbCBmYWN0b3JzIChvZiB0aGUgb3JkZXIgMS01IGRpZ2l0cyksIGFuZCBmaW5kc1xuICAgIGFsbCBsYXJnZSBmYWN0b3JzIGlmIGdpdmVuIGVub3VnaCB0aW1lLiBUaGUgUG9sbGFyZCByaG8gYW5kIHAtMVxuICAgIGFsZ29yaXRobXMgYXJlIHVzZWQgdG8gZmluZCBsYXJnZSBmYWN0b3JzIGFoZWFkIG9mIHRpbWU7IHRoZXlcbiAgICB3aWxsIG9mdGVuIGZpbmQgZmFjdG9ycyBvZiB0aGUgb3JkZXIgb2YgMTAgZGlnaXRzIHdpdGhpbiBhIGZld1xuICAgIHNlY29uZHM6XG4gICAgPj4+IGZhY3RvcnMgPSBmYWN0b3JpbnQoMTIzNDU2Nzg5MTAxMTEyMTMxNDE1MTYpXG4gICAgPj4+IGZvciBiYXNlLCBleHAgaW4gc29ydGVkKGZhY3RvcnMuaXRlbXMoKSk6XG4gICAgLi4uICAgICBwcmludCgnJXMgJXMnICUgKGJhc2UsIGV4cCkpXG4gICAgLi4uXG4gICAgMiAyXG4gICAgMjUwNzE5MTY5MSAxXG4gICAgMTIzMTAyNjYyNTc2OSAxXG4gICAgQW55IG9mIHRoZXNlIG1ldGhvZHMgY2FuIG9wdGlvbmFsbHkgYmUgZGlzYWJsZWQgd2l0aCB0aGUgZm9sbG93aW5nXG4gICAgYm9vbGVhbiBwYXJhbWV0ZXJzOlxuICAgICAgICAtIGBgdXNlX3RyaWFsYGA6IFRvZ2dsZSB1c2Ugb2YgdHJpYWwgZGl2aXNpb25cbiAgICAgICAgLSBgYHVzZV9yaG9gYDogVG9nZ2xlIHVzZSBvZiBQb2xsYXJkJ3MgcmhvIG1ldGhvZFxuICAgICAgICAtIGBgdXNlX3BtMWBgOiBUb2dnbGUgdXNlIG9mIFBvbGxhcmQncyBwLTEgbWV0aG9kXG4gICAgYGBmYWN0b3JpbnRgYCBhbHNvIHBlcmlvZGljYWxseSBjaGVja3MgaWYgdGhlIHJlbWFpbmluZyBwYXJ0IGlzXG4gICAgYSBwcmltZSBudW1iZXIgb3IgYSBwZXJmZWN0IHBvd2VyLCBhbmQgaW4gdGhvc2UgY2FzZXMgc3RvcHMuXG4gICAgRm9yIHVuZXZhbHVhdGVkIGZhY3RvcmlhbCwgaXQgdXNlcyBMZWdlbmRyZSdzIGZvcm11bGEodGhlb3JlbSkuXG4gICAgSWYgYGB2ZXJib3NlYGAgaXMgc2V0IHRvIGBgVHJ1ZWBgLCBkZXRhaWxlZCBwcm9ncmVzcyBpcyBwcmludGVkLlxuICAgIFNlZSBBbHNvXG4gICAgPT09PT09PT1cbiAgICBzbW9vdGhuZXNzLCBzbW9vdGhuZXNzX3AsIGRpdmlzb3JzXG4gICAgKi9cbiAgICBpZiAobiBpbnN0YW5jZW9mIEludGVnZXIpIHtcbiAgICAgICAgbiA9IG4ucDtcbiAgICB9XG4gICAgbiA9IGFzX2ludChuKTtcbiAgICBpZiAobGltaXQpIHtcbiAgICAgICAgbGltaXQgPSBsaW1pdCBhcyBudW1iZXI7XG4gICAgfVxuICAgIGlmIChuIDwgMCkge1xuICAgICAgICBjb25zdCBmYWN0b3JzID0gZmFjdG9yaW50KC1uLCBsaW1pdCk7XG4gICAgICAgIGZhY3RvcnMuYWRkKGZhY3RvcnMuc2l6ZSAtIDEsIDEpO1xuICAgICAgICByZXR1cm4gZmFjdG9ycztcbiAgICB9XG4gICAgaWYgKGxpbWl0ICYmIGxpbWl0IDwgMikge1xuICAgICAgICBpZiAobiA9PT0gMSkge1xuICAgICAgICAgICAgcmV0dXJuIG5ldyBIYXNoRGljdCgpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBuZXcgSGFzaERpY3Qoe246IDF9KTtcbiAgICB9IGVsc2UgaWYgKG4gPCAxMCkge1xuICAgICAgICByZXR1cm4gbmV3IEhhc2hEaWN0KFt7MDogMX0sIHt9LCB7MjogMX0sIHszOiAxfSwgezI6IDJ9LCB7NTogMX0sXG4gICAgICAgICAgICB7MjogMSwgMzogMX0sIHs3OiAxfSwgezI6IDN9LCB7MzogMn1dW25dKTtcbiAgICB9XG5cbiAgICBjb25zdCBmYWN0b3JzID0gbmV3IEhhc2hEaWN0KCk7XG4gICAgbGV0IHNtYWxsID0gMioqMTU7XG4gICAgY29uc3QgZmFpbF9tYXggPSA2MDA7XG4gICAgc21hbGwgPSBNYXRoLm1pbihzbWFsbCwgbGltaXQgfHwgc21hbGwpO1xuICAgIGxldCBuZXh0X3A7XG4gICAgW24sIG5leHRfcF0gPSBfZmFjdG9yaW50X3NtYWxsKGZhY3RvcnMsIG4sIHNtYWxsLCBmYWlsX21heCk7XG4gICAgbGV0IHNxcnRfbjogYW55O1xuICAgIHRyeSB7XG4gICAgICAgIGlmIChsaW1pdCAmJiBuZXh0X3AgPiBsaW1pdCkge1xuICAgICAgICAgICAgX2NoZWNrX3Rlcm1pbmF0aW9uKGZhY3RvcnMsIG4sIGxpbWl0KTtcbiAgICAgICAgICAgIGlmIChuID4gMSkge1xuICAgICAgICAgICAgICAgIGZhY3RvcnMuYWRkKG4sIDEpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIGZhY3RvcnM7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBzcXJ0X24gPSBpbnRfbnRocm9vdChuLCAyKVswXTtcbiAgICAgICAgICAgIGxldCBhID0gc3FydF9uICsgMTtcbiAgICAgICAgICAgIGNvbnN0IGEyID0gYSoqMjtcbiAgICAgICAgICAgIGxldCBiMiA9IGEyIC0gbjtcbiAgICAgICAgICAgIGxldCBiOiBhbnk7IGxldCBmZXJtYXQ6IGFueTtcbiAgICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgMzsgaSsrKSB7XG4gICAgICAgICAgICAgICAgW2IsIGZlcm1hdF0gPSBpbnRfbnRocm9vdChiMiwgMik7XG4gICAgICAgICAgICAgICAgaWYgKGZlcm1hdCkge1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgYjIgKz0gMiphICsgMTtcbiAgICAgICAgICAgICAgICBhKys7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoZmVybWF0KSB7XG4gICAgICAgICAgICAgICAgaWYgKGxpbWl0KSB7XG4gICAgICAgICAgICAgICAgICAgIGxpbWl0IC09IDE7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGZvciAoY29uc3QgciBvZiBbYSAtIGIsIGEgKyBiXSkge1xuICAgICAgICAgICAgICAgICAgICBjb25zdCBmYWNzID0gZmFjdG9yaW50KHIsIGxpbWl0KTtcbiAgICAgICAgICAgICAgICAgICAgZm9yIChjb25zdCBbaywgdl0gb2YgZmFjcy5lbnRyaWVzKCkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGZhY3RvcnMuYWRkKGssIGZhY3RvcnMuZ2V0KGssIDApICsgdik7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBfY2hlY2tfdGVybWluYXRpb24oZmFjdG9ycywgbiwgbGltaXQpO1xuICAgICAgICB9XG4gICAgfSBjYXRjaCAoRXJyb3IpIHtcbiAgICAgICAgcmV0dXJuIGZhY3RvcnM7XG4gICAgfVxuXG4gICAgbGV0IFtsb3csIGhpZ2hdID0gW25leHRfcCwgMiAqIG5leHRfcF07XG4gICAgbGltaXQgPSAobGltaXQgfHwgc3FydF9uKSBhcyBudW1iZXI7XG4gICAgbGltaXQrKztcbiAgICB3aGlsZSAoMSkge1xuICAgICAgICB0cnkge1xuICAgICAgICAgICAgbGV0IGhpZ2hfID0gaGlnaDtcbiAgICAgICAgICAgIGlmIChsaW1pdCA8IGhpZ2hfKSB7XG4gICAgICAgICAgICAgICAgaGlnaF8gPSBsaW1pdDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGNvbnN0IHBzID0gcHJpbWVyYW5nZShsb3csIGhpZ2hfKTtcbiAgICAgICAgICAgIGxldCBmb3VuZF90cmlhbDtcbiAgICAgICAgICAgIFtuLCBmb3VuZF90cmlhbF0gPSBfdHJpYWwoZmFjdG9ycywgbiwgcHMpO1xuICAgICAgICAgICAgaWYgKGZvdW5kX3RyaWFsKSB7XG4gICAgICAgICAgICAgICAgX2NoZWNrX3Rlcm1pbmF0aW9uKGZhY3RvcnMsIG4sIGxpbWl0KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChoaWdoID4gbGltaXQpIHtcbiAgICAgICAgICAgICAgICBpZiAobiA+IDEpIHtcbiAgICAgICAgICAgICAgICAgICAgZmFjdG9ycy5hZGQobiwgMSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcigpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKCFmb3VuZF90cmlhbCkge1xuICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcImFkdmFuY2VkIGZhY3RvcmluZyBtZXRob2RzIGFyZSBub3QgeWV0IGltcGxlbWVudGVkXCIpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9IGNhdGNoIChFcnJvcikge1xuICAgICAgICAgICAgcmV0dXJuIGZhY3RvcnM7XG4gICAgICAgIH1cbiAgICAgICAgW2xvdywgaGlnaF0gPSBbaGlnaCwgaGlnaCoyXTtcbiAgICB9XG4gICAgbGV0IEIxID0gMTAwMDA7XG4gICAgbGV0IEIyID0gMTAwKkIxO1xuICAgIGxldCBudW1fY3VydmVzID0gNTA7XG4gICAgd2hpbGUgKDEpIHtcbiAgICAgICAgd2hpbGUgKDEpIHtcbiAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiZWNtIG9uZSBmYWN0b3Igbm90IHlldCBpbXBsZW1lbnRlZFwiKTtcbiAgICAgICAgICAgICAgICAvLyBfY2hlY2tfdGVybWluYXRpb24oZmFjdG9ycywgbiwgbGltaXQpO1xuICAgICAgICAgICAgfSBjYXRjaCAoRXJyb3IpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gZmFjdG9ycztcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBCMSAqPSA1O1xuICAgICAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tdW51c2VkLXZhcnNcbiAgICAgICAgQjIgPSAxMDAqQjE7XG4gICAgICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBuby11bnVzZWQtdmFyc1xuICAgICAgICBudW1fY3VydmVzICo9IDQ7XG4gICAgfVxufVxuXG5leHBvcnQgZnVuY3Rpb24gcGVyZmVjdF9wb3dlcihuOiBhbnksIGNhbmRpZGF0ZXM6IGFueSA9IHVuZGVmaW5lZCwgYmlnOiBib29sZWFuID0gdHJ1ZSxcbiAgICBmYWN0b3I6IGJvb2xlYW4gPSB0cnVlLCBudW1faXRlcmF0aW9uczogbnVtYmVyID0gMTUpOiBhbnkge1xuICAgIC8qXG4gICAgUmV0dXJuIGBgKGIsIGUpYGAgc3VjaCB0aGF0IGBgbmBgID09IGBgYioqZWBgIGlmIGBgbmBgIGlzIGEgdW5pcXVlXG4gICAgcGVyZmVjdCBwb3dlciB3aXRoIGBgZSA+IDFgYCwgZWxzZSBgYEZhbHNlYGAgKGUuZy4gMSBpcyBub3QgYVxuICAgIHBlcmZlY3QgcG93ZXIpLiBBIFZhbHVlRXJyb3IgaXMgcmFpc2VkIGlmIGBgbmBgIGlzIG5vdCBSYXRpb25hbC5cbiAgICBCeSBkZWZhdWx0LCB0aGUgYmFzZSBpcyByZWN1cnNpdmVseSBkZWNvbXBvc2VkIGFuZCB0aGUgZXhwb25lbnRzXG4gICAgY29sbGVjdGVkIHNvIHRoZSBsYXJnZXN0IHBvc3NpYmxlIGBgZWBgIGlzIHNvdWdodC4gSWYgYGBiaWc9RmFsc2VgYFxuICAgIHRoZW4gdGhlIHNtYWxsZXN0IHBvc3NpYmxlIGBgZWBgICh0aHVzIHByaW1lKSB3aWxsIGJlIGNob3Nlbi5cbiAgICBJZiBgYGZhY3Rvcj1UcnVlYGAgdGhlbiBzaW11bHRhbmVvdXMgZmFjdG9yaXphdGlvbiBvZiBgYG5gYCBpc1xuICAgIGF0dGVtcHRlZCBzaW5jZSBmaW5kaW5nIGEgZmFjdG9yIGluZGljYXRlcyB0aGUgb25seSBwb3NzaWJsZSByb290XG4gICAgZm9yIGBgbmBgLiBUaGlzIGlzIFRydWUgYnkgZGVmYXVsdCBzaW5jZSBvbmx5IGEgZmV3IHNtYWxsIGZhY3RvcnMgd2lsbFxuICAgIGJlIHRlc3RlZCBpbiB0aGUgY291cnNlIG9mIHNlYXJjaGluZyBmb3IgdGhlIHBlcmZlY3QgcG93ZXIuXG4gICAgVGhlIHVzZSBvZiBgYGNhbmRpZGF0ZXNgYCBpcyBwcmltYXJpbHkgZm9yIGludGVybmFsIHVzZTsgaWYgcHJvdmlkZWQsXG4gICAgRmFsc2Ugd2lsbCBiZSByZXR1cm5lZCBpZiBgYG5gYCBjYW5ub3QgYmUgd3JpdHRlbiBhcyBhIHBvd2VyIHdpdGggb25lXG4gICAgb2YgdGhlIGNhbmRpZGF0ZXMgYXMgYW4gZXhwb25lbnQgYW5kIGZhY3RvcmluZyAoYmV5b25kIHRlc3RpbmcgZm9yXG4gICAgYSBmYWN0b3Igb2YgMikgd2lsbCBub3QgYmUgYXR0ZW1wdGVkLlxuICAgIEV4YW1wbGVzXG4gICAgPT09PT09PT1cbiAgICA+Pj4gZnJvbSBzeW1weSBpbXBvcnQgcGVyZmVjdF9wb3dlciwgUmF0aW9uYWxcbiAgICA+Pj4gcGVyZmVjdF9wb3dlcigxNilcbiAgICAoMiwgNClcbiAgICA+Pj4gcGVyZmVjdF9wb3dlcigxNiwgYmlnPUZhbHNlKVxuICAgICg0LCAyKVxuICAgIE5lZ2F0aXZlIG51bWJlcnMgY2FuIG9ubHkgaGF2ZSBvZGQgcGVyZmVjdCBwb3dlcnM6XG4gICAgPj4+IHBlcmZlY3RfcG93ZXIoLTQpXG4gICAgRmFsc2VcbiAgICA+Pj4gcGVyZmVjdF9wb3dlcigtOClcbiAgICAoLTIsIDMpXG4gICAgUmF0aW9uYWxzIGFyZSBhbHNvIHJlY29nbml6ZWQ6XG4gICAgPj4+IHBlcmZlY3RfcG93ZXIoUmF0aW9uYWwoMSwgMikqKjMpXG4gICAgKDEvMiwgMylcbiAgICA+Pj4gcGVyZmVjdF9wb3dlcihSYXRpb25hbCgtMywgMikqKjMpXG4gICAgKC0zLzIsIDMpXG4gICAgTm90ZXNcbiAgICA9PT09PVxuICAgIFRvIGtub3cgd2hldGhlciBhbiBpbnRlZ2VyIGlzIGEgcGVyZmVjdCBwb3dlciBvZiAyIHVzZVxuICAgICAgICA+Pj4gaXMycG93ID0gbGFtYmRhIG46IGJvb2wobiBhbmQgbm90IG4gJiAobiAtIDEpKVxuICAgICAgICA+Pj4gWyhpLCBpczJwb3coaSkpIGZvciBpIGluIHJhbmdlKDUpXVxuICAgICAgICBbKDAsIEZhbHNlKSwgKDEsIFRydWUpLCAoMiwgVHJ1ZSksICgzLCBGYWxzZSksICg0LCBUcnVlKV1cbiAgICBJdCBpcyBub3QgbmVjZXNzYXJ5IHRvIHByb3ZpZGUgYGBjYW5kaWRhdGVzYGAuIFdoZW4gcHJvdmlkZWRcbiAgICBpdCB3aWxsIGJlIGFzc3VtZWQgdGhhdCB0aGV5IGFyZSBpbnRzLiBUaGUgZmlyc3Qgb25lIHRoYXQgaXNcbiAgICBsYXJnZXIgdGhhbiB0aGUgY29tcHV0ZWQgbWF4aW11bSBwb3NzaWJsZSBleHBvbmVudCB3aWxsIHNpZ25hbFxuICAgIGZhaWx1cmUgZm9yIHRoZSByb3V0aW5lLlxuICAgICAgICA+Pj4gcGVyZmVjdF9wb3dlcigzKio4LCBbOV0pXG4gICAgICAgIEZhbHNlXG4gICAgICAgID4+PiBwZXJmZWN0X3Bvd2VyKDMqKjgsIFsyLCA0LCA4XSlcbiAgICAgICAgKDMsIDgpXG4gICAgICAgID4+PiBwZXJmZWN0X3Bvd2VyKDMqKjgsIFs0LCA4XSwgYmlnPUZhbHNlKVxuICAgICAgICAoOSwgNClcbiAgICBTZWUgQWxzb1xuICAgID09PT09PT09XG4gICAgc3ltcHkuY29yZS5wb3dlci5pbnRlZ2VyX250aHJvb3RcbiAgICBzeW1weS5udGhlb3J5LnByaW1ldGVzdC5pc19zcXVhcmVcbiAgICAqL1xuICAgIGxldCBwcDtcbiAgICBpZiAobiBpbnN0YW5jZW9mIFJhdGlvbmFsICYmICEobi5pc19pbnRlZ2VyKSkge1xuICAgICAgICBjb25zdCBbcCwgcV0gPSBuLl9hc19udW1lcl9kZW5vbSgpO1xuICAgICAgICBpZiAocCA9PT0gUy5PbmUpIHtcbiAgICAgICAgICAgIHBwID0gcGVyZmVjdF9wb3dlcihxKTtcbiAgICAgICAgICAgIGlmIChwcCkge1xuICAgICAgICAgICAgICAgIHBwID0gW24uY29uc3RydWN0b3IoMSwgcHBbMF0pLCBwcFsxXV07XG4gICAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBwcCA9IHBlcmZlY3RfcG93ZXIocCk7XG4gICAgICAgICAgICBpZiAocHApIHtcbiAgICAgICAgICAgICAgICBjb25zdCBbbnVtLCBlXSA9IHBwO1xuICAgICAgICAgICAgICAgIGNvbnN0IHBxID0gcGVyZmVjdF9wb3dlcihxLCBbZV0pO1xuICAgICAgICAgICAgICAgIGlmIChwcSkge1xuICAgICAgICAgICAgICAgICAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tdW51c2VkLXZhcnNcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgW2RlbiwgYmxhbmtdID0gcHE7XG4gICAgICAgICAgICAgICAgICAgIHBwID0gW24uY29uc3RydWN0b3IobnVtLCBkZW4pLCBlXTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHBwO1xuICAgIH1cblxuICAgIG4gPSBhc19pbnQobik7XG4gICAgaWYgKG4gPCAwKSB7XG4gICAgICAgIHBwID0gcGVyZmVjdF9wb3dlcigtbik7XG4gICAgICAgIGlmIChwcCkge1xuICAgICAgICAgICAgY29uc3QgW2IsIGVdID0gcHA7XG4gICAgICAgICAgICBpZiAoZSAlIDIgIT09IDApIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gWy1iLCBlXTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuXG4gICAgaWYgKG4gPD0gMykge1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuXG4gICAgY29uc3QgbG9nbiA9IE1hdGgubG9nMihuKTtcbiAgICBjb25zdCBtYXhfcG9zc2libGUgPSBNYXRoLmZsb29yKGxvZ24pICsgMjtcbiAgICBjb25zdCBub3Rfc3F1YXJlID0gWzIsIDMsIDcsIDhdLmluY2x1ZGVzKG4gJSAxMCk7XG4gICAgY29uc3QgbWluX3Bvc3NpYmxlID0gMiArIChub3Rfc3F1YXJlIGFzIGFueSBhcyBudW1iZXIpO1xuICAgIGlmICh0eXBlb2YgY2FuZGlkYXRlcyA9PT0gXCJ1bmRlZmluZWRcIikge1xuICAgICAgICBjYW5kaWRhdGVzID0gcHJpbWVyYW5nZShtaW5fcG9zc2libGUsIG1heF9wb3NzaWJsZSk7XG4gICAgfSBlbHNlIHtcbiAgICAgICAgY29uc3QgdGVtcCA9IFtdO1xuICAgICAgICBjYW5kaWRhdGVzLnNvcnQoKTtcbiAgICAgICAgZm9yIChjb25zdCBpIG9mIGNhbmRpZGF0ZXMpIHtcbiAgICAgICAgICAgIGlmIChtaW5fcG9zc2libGUgPD0gaSAmJiBpIDw9IG1heF9wb3NzaWJsZSkge1xuICAgICAgICAgICAgICAgIHRlbXAucHVzaChpKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBjYW5kaWRhdGVzID0gdGVtcDtcbiAgICAgICAgaWYgKG4gJSAyID09PSAwKSB7XG4gICAgICAgICAgICBjb25zdCBlID0gdHJhaWxpbmcobik7XG4gICAgICAgICAgICBjb25zdCB0ZW1wMiA9IFtdO1xuICAgICAgICAgICAgZm9yIChjb25zdCBpIG9mIGNhbmRpZGF0ZXMpIHtcbiAgICAgICAgICAgICAgICBpZiAoZSAlIGkgPT09IDApIHtcbiAgICAgICAgICAgICAgICAgICAgdGVtcDIucHVzaChpKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBjYW5kaWRhdGVzID0gdGVtcDI7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGJpZykge1xuICAgICAgICAgICAgY2FuZGlkYXRlcy5yZXZlcnNlKCk7XG4gICAgICAgIH1cbiAgICAgICAgZm9yIChjb25zdCBlIG9mIGNhbmRpZGF0ZXMpIHtcbiAgICAgICAgICAgIGNvbnN0IFtyLCBva10gPSBpbnRfbnRocm9vdChuLCBlKTtcbiAgICAgICAgICAgIGlmIChvaykge1xuICAgICAgICAgICAgICAgIHJldHVybiBbciwgZV07XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgICBmdW5jdGlvbiogX2ZhY3RvcnMobGVuZ3RoOiBudW1iZXIpIHtcbiAgICAgICAgbGV0IHJ2ID0gMiArIG4gJSAyO1xuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICB5aWVsZCBydjtcbiAgICAgICAgICAgIHJ2ID0gbmV4dHByaW1lKHJ2KTtcbiAgICAgICAgfVxuICAgIH1cbiAgICAvLyBvcmlnaW5hbCBhbGdvcml0aG0gZ2VuZXJhdGVzIGluZmluaXRlIHNlcXVlbmNlcyBvZiB0aGUgZm9sbG93aW5nXG4gICAgLy8gZm9yIG5vdyB3ZSB3aWxsIGdlbmVyYXRlIGxpbWl0ZWQgc2l6ZWQgYXJyYXlzIGFuZCB1c2UgdGhvc2VcbiAgICBjb25zdCBfY2FuZGlkYXRlcyA9IFtdO1xuICAgIGZvciAoY29uc3QgaSBvZiBjYW5kaWRhdGVzKSB7XG4gICAgICAgIF9jYW5kaWRhdGVzLnB1c2goaSk7XG4gICAgfVxuICAgIGNvbnN0IF9mYWN0b3JzXyA9IFtdO1xuICAgIGZvciAoY29uc3QgaSBvZiBfZmFjdG9ycyhfY2FuZGlkYXRlcy5sZW5ndGgpKSB7XG4gICAgICAgIF9mYWN0b3JzXy5wdXNoKGkpO1xuICAgIH1cbiAgICBmb3IgKGNvbnN0IGl0ZW0gb2YgVXRpbC56aXAoX2ZhY3RvcnNfLCBfY2FuZGlkYXRlcykpIHtcbiAgICAgICAgY29uc3QgZmFjID0gaXRlbVswXTtcbiAgICAgICAgbGV0IGUgPSBpdGVtWzFdO1xuICAgICAgICBsZXQgcjtcbiAgICAgICAgbGV0IGV4YWN0O1xuICAgICAgICBpZiAoZmFjdG9yICYmIG4gJSBmYWMgPT09IDApIHtcbiAgICAgICAgICAgIGlmIChmYWMgPT09IDIpIHtcbiAgICAgICAgICAgICAgICBlID0gdHJhaWxpbmcobik7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGUgPSBtdWx0aXBsaWNpdHkoZmFjLCBuKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChlID09PSAxKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBbciwgZXhhY3RdID0gaW50X250aHJvb3QobiwgZSk7XG4gICAgICAgICAgICBpZiAoIShleGFjdCkpIHtcbiAgICAgICAgICAgICAgICBjb25zdCBtID0gTWF0aC5mbG9vcihuIC8gZmFjKSAqKiBlO1xuICAgICAgICAgICAgICAgIGNvbnN0IHJFID0gcGVyZmVjdF9wb3dlcihtLCBkaXZpc29ycyhlLCB0cnVlKSk7XG4gICAgICAgICAgICAgICAgaWYgKCEockUpKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBsZXQgW3IsIEVdID0gckU7XG4gICAgICAgICAgICAgICAgICAgIFtyLCBlXSA9IFtmYWMqKihNYXRoLmZsb29yKGUvRSkqciksIEVdO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiBbciwgZV07XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGxvZ24vZSA8IDQwKSB7XG4gICAgICAgICAgICBjb25zdCBiID0gMi4wKioobG9nbi9lKTtcbiAgICAgICAgICAgIGlmIChNYXRoLmFicyhNYXRoLmZsb29yKGIgKyAwLjUpIC0gYikgPiAwLjAxKSB7XG4gICAgICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgW3IsIGV4YWN0XSA9IGludF9udGhyb290KG4sIGUpO1xuICAgICAgICBpZiAoZXhhY3QpIHtcbiAgICAgICAgICAgIGNvbnN0IG0gPSBwZXJmZWN0X3Bvd2VyKHIsIHVuZGVmaW5lZCwgYmlnLCBmYWN0b3IpO1xuICAgICAgICAgICAgaWYgKG0pIHtcbiAgICAgICAgICAgICAgICBbciwgZV0gPSBbbVswXSwgZSAqIG1bMV1dO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIFtNYXRoLmZsb29yKHIpLCBlXTtcbiAgICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gZmFsc2U7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBmYWN0b3JyYXQocmF0OiBhbnksIGxpbWl0OiBudW1iZXIgPSB1bmRlZmluZWQpIHtcbiAgICAvKlxuICAgIEdpdmVuIGEgUmF0aW9uYWwgYGByYGAsIGBgZmFjdG9ycmF0KHIpYGAgcmV0dXJucyBhIGRpY3QgY29udGFpbmluZ1xuICAgIHRoZSBwcmltZSBmYWN0b3JzIG9mIGBgcmBgIGFzIGtleXMgYW5kIHRoZWlyIHJlc3BlY3RpdmUgbXVsdGlwbGljaXRpZXNcbiAgICBhcyB2YWx1ZXMuIEZvciBleGFtcGxlOlxuICAgID4+PiBmcm9tIHN5bXB5IGltcG9ydCBmYWN0b3JyYXQsIFNcbiAgICA+Pj4gZmFjdG9ycmF0KFMoOCkvOSkgICAgIyA4LzkgPSAoMioqMykgKiAoMyoqLTIpXG4gICAgezI6IDMsIDM6IC0yfVxuICAgID4+PiBmYWN0b3JyYXQoUygtMSkvOTg3KSAgICAjIC0xLzc4OSA9IC0xICogKDMqKi0xKSAqICg3KiotMSkgKiAoNDcqKi0xKVxuICAgIHstMTogMSwgMzogLTEsIDc6IC0xLCA0NzogLTF9XG4gICAgUGxlYXNlIHNlZSB0aGUgZG9jc3RyaW5nIGZvciBgYGZhY3RvcmludGBgIGZvciBkZXRhaWxlZCBleHBsYW5hdGlvbnNcbiAgICBhbmQgZXhhbXBsZXMgb2YgdGhlIGZvbGxvd2luZyBrZXl3b3JkczpcbiAgICAgICAgLSBgYGxpbWl0YGA6IEludGVnZXIgbGltaXQgdXAgdG8gd2hpY2ggdHJpYWwgZGl2aXNpb24gaXMgZG9uZVxuICAgICAgICAtIGBgdXNlX3RyaWFsYGA6IFRvZ2dsZSB1c2Ugb2YgdHJpYWwgZGl2aXNpb25cbiAgICAgICAgLSBgYHVzZV9yaG9gYDogVG9nZ2xlIHVzZSBvZiBQb2xsYXJkJ3MgcmhvIG1ldGhvZFxuICAgICAgICAtIGBgdXNlX3BtMWBgOiBUb2dnbGUgdXNlIG9mIFBvbGxhcmQncyBwLTEgbWV0aG9kXG4gICAgICAgIC0gYGB2ZXJib3NlYGA6IFRvZ2dsZSBkZXRhaWxlZCBwcmludGluZyBvZiBwcm9ncmVzc1xuICAgICAgICAtIGBgbXVsdGlwbGVgYDogVG9nZ2xlIHJldHVybmluZyBhIGxpc3Qgb2YgZmFjdG9ycyBvciBkaWN0XG4gICAgICAgIC0gYGB2aXN1YWxgYDogVG9nZ2xlIHByb2R1Y3QgZm9ybSBvZiBvdXRwdXRcbiAgICAqL1xuICAgIGNvbnN0IGYgPSBmYWN0b3JpbnQocmF0LnAsIGxpbWl0KTtcbiAgICBmb3IgKGNvbnN0IGl0ZW0gb2YgZmFjdG9yaW50KHJhdC5xLCBsaW1pdCkuZW50cmllcygpKSB7XG4gICAgICAgIGNvbnN0IHAgPSBpdGVtWzBdO1xuICAgICAgICBjb25zdCBlID0gaXRlbVsxXTtcbiAgICAgICAgZi5hZGQocCwgZi5nZXQocCwgMCkgLSBlKTtcbiAgICB9XG4gICAgaWYgKGYuc2l6ZSA+IDEgJiYgZi5oYXMoMSkpIHtcbiAgICAgICAgZi5yZW1vdmUoMSk7XG4gICAgfVxuICAgIHJldHVybiBmO1xufVxuIiwgImltcG9ydCB7ZGl2bW9kfSBmcm9tIFwiLi4vbnRoZW9yeS9mYWN0b3JfXCI7XG5pbXBvcnQge0FkZH0gZnJvbSBcIi4vYWRkXCI7XG5pbXBvcnQge01hbmFnZWRQcm9wZXJ0aWVzfSBmcm9tIFwiLi9hc3N1bXB0aW9uc1wiO1xuaW1wb3J0IHtCYXNpY30gZnJvbSBcIi4vYmFzaWNcIjtcbmltcG9ydCB7RXhwcn0gZnJvbSBcIi4vZXhwclwiO1xuaW1wb3J0IHtHbG9iYWx9IGZyb20gXCIuL2dsb2JhbFwiO1xuaW1wb3J0IHtmdXp6eV9ub3R2MiwgX2Z1enp5X2dyb3VwdjJ9IGZyb20gXCIuL2xvZ2ljXCI7XG5pbXBvcnQge0ludGVnZXIsIFJhdGlvbmFsfSBmcm9tIFwiLi9udW1iZXJzXCI7XG5pbXBvcnQge0Fzc29jT3B9IGZyb20gXCIuL29wZXJhdGlvbnNcIjtcbmltcG9ydCB7Z2xvYmFsX3BhcmFtZXRlcnN9IGZyb20gXCIuL3BhcmFtZXRlcnNcIjtcbmltcG9ydCB7UG93fSBmcm9tIFwiLi9wb3dlclwiO1xuaW1wb3J0IHtTfSBmcm9tIFwiLi9zaW5nbGV0b25cIjtcbmltcG9ydCB7bWl4LCBiYXNlLCBIYXNoRGljdCwgSGFzaFNldCwgQXJyRGVmYXVsdERpY3R9IGZyb20gXCIuL3V0aWxpdHlcIjtcblxuLy8gIyBpbnRlcm5hbCBtYXJrZXIgdG8gaW5kaWNhdGU6XG4vLyBcInRoZXJlIGFyZSBzdGlsbCBub24tY29tbXV0YXRpdmUgb2JqZWN0cyAtLSBkb24ndCBmb3JnZXQgdG8gcHJvY2VzcyB0aGVtXCJcblxuLy8gbm90IGN1cnJlbnRseSBiZWluZyB1c2VkXG5jbGFzcyBOQ19NYXJrZXIge1xuICAgIGlzX09yZGVyID0gZmFsc2U7XG4gICAgaXNfTXVsID0gZmFsc2U7XG4gICAgaXNfTnVtYmVyID0gZmFsc2U7XG4gICAgaXNfUG9seSA9IGZhbHNlO1xuXG4gICAgaXNfY29tbXV0YXRpdmUgPSBmYWxzZTtcbn1cblxuZnVuY3Rpb24gX211bHNvcnQoYXJnczogYW55W10pIHtcbiAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbmV3LWNhcFxuICAgIGFyZ3Muc29ydCgoYSwgYikgPT4gQmFzaWMuY21wKGEsIGIpKTtcbn1cblxuZXhwb3J0IGNsYXNzIE11bCBleHRlbmRzIG1peChiYXNlKS53aXRoKEV4cHIsIEFzc29jT3ApIHtcbiAgICAvKlxuICAgIEV4cHJlc3Npb24gcmVwcmVzZW50aW5nIG11bHRpcGxpY2F0aW9uIG9wZXJhdGlvbiBmb3IgYWxnZWJyYWljIGZpZWxkLlxuICAgIC4uIGRlcHJlY2F0ZWQ6OiAxLjdcbiAgICAgICBVc2luZyBhcmd1bWVudHMgdGhhdCBhcmVuJ3Qgc3ViY2xhc3NlcyBvZiA6Y2xhc3M6YH4uRXhwcmAgaW4gY29yZVxuICAgICAgIG9wZXJhdG9ycyAoOmNsYXNzOmB+Lk11bGAsIDpjbGFzczpgfi5BZGRgLCBhbmQgOmNsYXNzOmB+LlBvd2ApIGlzXG4gICAgICAgZGVwcmVjYXRlZC4gU2VlIDpyZWY6YG5vbi1leHByLWFyZ3MtZGVwcmVjYXRlZGAgZm9yIGRldGFpbHMuXG4gICAgRXZlcnkgYXJndW1lbnQgb2YgYGBNdWwoKWBgIG11c3QgYmUgYGBFeHByYGAuIEluZml4IG9wZXJhdG9yIGBgKmBgXG4gICAgb24gbW9zdCBzY2FsYXIgb2JqZWN0cyBpbiBTeW1QeSBjYWxscyB0aGlzIGNsYXNzLlxuICAgIEFub3RoZXIgdXNlIG9mIGBgTXVsKClgYCBpcyB0byByZXByZXNlbnQgdGhlIHN0cnVjdHVyZSBvZiBhYnN0cmFjdFxuICAgIG11bHRpcGxpY2F0aW9uIHNvIHRoYXQgaXRzIGFyZ3VtZW50cyBjYW4gYmUgc3Vic3RpdHV0ZWQgdG8gcmV0dXJuXG4gICAgZGlmZmVyZW50IGNsYXNzLiBSZWZlciB0byBleGFtcGxlcyBzZWN0aW9uIGZvciB0aGlzLlxuICAgIGBgTXVsKClgYCBldmFsdWF0ZXMgdGhlIGFyZ3VtZW50IHVubGVzcyBgYGV2YWx1YXRlPUZhbHNlYGAgaXMgcGFzc2VkLlxuICAgIFRoZSBldmFsdWF0aW9uIGxvZ2ljIGluY2x1ZGVzOlxuICAgIDEuIEZsYXR0ZW5pbmdcbiAgICAgICAgYGBNdWwoeCwgTXVsKHksIHopKWBgIC0+IGBgTXVsKHgsIHksIHopYGBcbiAgICAyLiBJZGVudGl0eSByZW1vdmluZ1xuICAgICAgICBgYE11bCh4LCAxLCB5KWBgIC0+IGBgTXVsKHgsIHkpYGBcbiAgICAzLiBFeHBvbmVudCBjb2xsZWN0aW5nIGJ5IGBgLmFzX2Jhc2VfZXhwKClgYFxuICAgICAgICBgYE11bCh4LCB4KioyKWBgIC0+IGBgUG93KHgsIDMpYGBcbiAgICA0LiBUZXJtIHNvcnRpbmdcbiAgICAgICAgYGBNdWwoeSwgeCwgMilgYCAtPiBgYE11bCgyLCB4LCB5KWBgXG4gICAgU2luY2UgbXVsdGlwbGljYXRpb24gY2FuIGJlIHZlY3RvciBzcGFjZSBvcGVyYXRpb24sIGFyZ3VtZW50cyBtYXlcbiAgICBoYXZlIHRoZSBkaWZmZXJlbnQgOm9iajpgc3ltcHkuY29yZS5raW5kLktpbmQoKWAuIEtpbmQgb2YgdGhlXG4gICAgcmVzdWx0aW5nIG9iamVjdCBpcyBhdXRvbWF0aWNhbGx5IGluZmVycmVkLlxuICAgIEV4YW1wbGVzXG4gICAgPT09PT09PT1cbiAgICA+Pj4gZnJvbSBzeW1weSBpbXBvcnQgTXVsXG4gICAgPj4+IGZyb20gc3ltcHkuYWJjIGltcG9ydCB4LCB5XG4gICAgPj4+IE11bCh4LCAxKVxuICAgIHhcbiAgICA+Pj4gTXVsKHgsIHgpXG4gICAgeCoqMlxuICAgIElmIGBgZXZhbHVhdGU9RmFsc2VgYCBpcyBwYXNzZWQsIHJlc3VsdCBpcyBub3QgZXZhbHVhdGVkLlxuICAgID4+PiBNdWwoMSwgMiwgZXZhbHVhdGU9RmFsc2UpXG4gICAgMSoyXG4gICAgPj4+IE11bCh4LCB4LCBldmFsdWF0ZT1GYWxzZSlcbiAgICB4KnhcbiAgICBgYE11bCgpYGAgYWxzbyByZXByZXNlbnRzIHRoZSBnZW5lcmFsIHN0cnVjdHVyZSBvZiBtdWx0aXBsaWNhdGlvblxuICAgIG9wZXJhdGlvbi5cbiAgICA+Pj4gZnJvbSBzeW1weSBpbXBvcnQgTWF0cml4U3ltYm9sXG4gICAgPj4+IEEgPSBNYXRyaXhTeW1ib2woJ0EnLCAyLDIpXG4gICAgPj4+IGV4cHIgPSBNdWwoeCx5KS5zdWJzKHt5OkF9KVxuICAgID4+PiBleHByXG4gICAgeCpBXG4gICAgPj4+IHR5cGUoZXhwcilcbiAgICA8Y2xhc3MgJ3N5bXB5Lm1hdHJpY2VzLmV4cHJlc3Npb25zLm1hdG11bC5NYXRNdWwnPlxuICAgIFNlZSBBbHNvXG4gICAgPT09PT09PT1cbiAgICBNYXRNdWxcbiAgICAqL1xuICAgIF9fc2xvdHNfXzogYW55W10gPSBbXTtcbiAgICBhcmdzOiBhbnlbXTtcbiAgICBzdGF0aWMgaXNfTXVsID0gdHJ1ZTtcbiAgICBfYXJnc190eXBlID0gRXhwcjtcbiAgICBzdGF0aWMgaWRlbnRpdHkgPSBTLk9uZTtcblxuICAgIGNvbnN0cnVjdG9yKGV2YWx1YXRlOiBib29sZWFuLCBzaW1wbGlmeTogYm9vbGVhbiwgLi4uYXJnczogYW55KSB7XG4gICAgICAgIHN1cGVyKE11bCwgZXZhbHVhdGUsIHNpbXBsaWZ5LCAuLi5hcmdzKTtcbiAgICB9XG5cbiAgICBmbGF0dGVuKHNlcTogYW55KSB7XG4gICAgICAgIC8qIFJldHVybiBjb21tdXRhdGl2ZSwgbm9uY29tbXV0YXRpdmUgYW5kIG9yZGVyIGFyZ3VtZW50cyBieVxuICAgICAgICBjb21iaW5pbmcgcmVsYXRlZCB0ZXJtcy5cbiAgICAgICAgTm90ZXNcbiAgICAgICAgPT09PT1cbiAgICAgICAgICAgICogSW4gYW4gZXhwcmVzc2lvbiBsaWtlIGBgYSpiKmNgYCwgUHl0aG9uIHByb2Nlc3MgdGhpcyB0aHJvdWdoIFN5bVB5XG4gICAgICAgICAgICAgIGFzIGBgTXVsKE11bChhLCBiKSwgYylgYC4gVGhpcyBjYW4gaGF2ZSB1bmRlc2lyYWJsZSBjb25zZXF1ZW5jZXMuXG4gICAgICAgICAgICAgIC0gIFNvbWV0aW1lcyB0ZXJtcyBhcmUgbm90IGNvbWJpbmVkIGFzIG9uZSB3b3VsZCBsaWtlOlxuICAgICAgICAgICAgICAgICB7Yy5mLiBodHRwczovL2dpdGh1Yi5jb20vc3ltcHkvc3ltcHkvaXNzdWVzLzQ1OTZ9XG4gICAgICAgICAgICAgICAgPj4+IGZyb20gc3ltcHkgaW1wb3J0IE11bCwgc3FydFxuICAgICAgICAgICAgICAgID4+PiBmcm9tIHN5bXB5LmFiYyBpbXBvcnQgeCwgeSwgelxuICAgICAgICAgICAgICAgID4+PiAyKih4ICsgMSkgIyB0aGlzIGlzIHRoZSAyLWFyZyBNdWwgYmVoYXZpb3JcbiAgICAgICAgICAgICAgICAyKnggKyAyXG4gICAgICAgICAgICAgICAgPj4+IHkqKHggKyAxKSoyXG4gICAgICAgICAgICAgICAgMip5Kih4ICsgMSlcbiAgICAgICAgICAgICAgICA+Pj4gMiooeCArIDEpKnkgIyAyLWFyZyByZXN1bHQgd2lsbCBiZSBvYnRhaW5lZCBmaXJzdFxuICAgICAgICAgICAgICAgIHkqKDIqeCArIDIpXG4gICAgICAgICAgICAgICAgPj4+IE11bCgyLCB4ICsgMSwgeSkgIyBhbGwgMyBhcmdzIHNpbXVsdGFuZW91c2x5IHByb2Nlc3NlZFxuICAgICAgICAgICAgICAgIDIqeSooeCArIDEpXG4gICAgICAgICAgICAgICAgPj4+IDIqKCh4ICsgMSkqeSkgIyBwYXJlbnRoZXNlcyBjYW4gY29udHJvbCB0aGlzIGJlaGF2aW9yXG4gICAgICAgICAgICAgICAgMip5Kih4ICsgMSlcbiAgICAgICAgICAgICAgICBQb3dlcnMgd2l0aCBjb21wb3VuZCBiYXNlcyBtYXkgbm90IGZpbmQgYSBzaW5nbGUgYmFzZSB0b1xuICAgICAgICAgICAgICAgIGNvbWJpbmUgd2l0aCB1bmxlc3MgYWxsIGFyZ3VtZW50cyBhcmUgcHJvY2Vzc2VkIGF0IG9uY2UuXG4gICAgICAgICAgICAgICAgUG9zdC1wcm9jZXNzaW5nIG1heSBiZSBuZWNlc3NhcnkgaW4gc3VjaCBjYXNlcy5cbiAgICAgICAgICAgICAgICB7Yy5mLiBodHRwczovL2dpdGh1Yi5jb20vc3ltcHkvc3ltcHkvaXNzdWVzLzU3Mjh9XG4gICAgICAgICAgICAgICAgPj4+IGEgPSBzcXJ0KHgqc3FydCh5KSlcbiAgICAgICAgICAgICAgICA+Pj4gYSoqM1xuICAgICAgICAgICAgICAgICh4KnNxcnQoeSkpKiooMy8yKVxuICAgICAgICAgICAgICAgID4+PiBNdWwoYSxhLGEpXG4gICAgICAgICAgICAgICAgKHgqc3FydCh5KSkqKigzLzIpXG4gICAgICAgICAgICAgICAgPj4+IGEqYSphXG4gICAgICAgICAgICAgICAgeCpzcXJ0KHkpKnNxcnQoeCpzcXJ0KHkpKVxuICAgICAgICAgICAgICAgID4+PiBfLnN1YnMoYS5iYXNlLCB6KS5zdWJzKHosIGEuYmFzZSlcbiAgICAgICAgICAgICAgICAoeCpzcXJ0KHkpKSoqKDMvMilcbiAgICAgICAgICAgICAgLSAgSWYgbW9yZSB0aGFuIHR3byB0ZXJtcyBhcmUgYmVpbmcgbXVsdGlwbGllZCB0aGVuIGFsbCB0aGVcbiAgICAgICAgICAgICAgICAgcHJldmlvdXMgdGVybXMgd2lsbCBiZSByZS1wcm9jZXNzZWQgZm9yIGVhY2ggbmV3IGFyZ3VtZW50LlxuICAgICAgICAgICAgICAgICBTbyBpZiBlYWNoIG9mIGBgYWBgLCBgYGJgYCBhbmQgYGBjYGAgd2VyZSA6Y2xhc3M6YE11bGBcbiAgICAgICAgICAgICAgICAgZXhwcmVzc2lvbiwgdGhlbiBgYGEqYipjYGAgKG9yIGJ1aWxkaW5nIHVwIHRoZSBwcm9kdWN0XG4gICAgICAgICAgICAgICAgIHdpdGggYGAqPWBgKSB3aWxsIHByb2Nlc3MgYWxsIHRoZSBhcmd1bWVudHMgb2YgYGBhYGAgYW5kXG4gICAgICAgICAgICAgICAgIGBgYmBgIHR3aWNlOiBvbmNlIHdoZW4gYGBhKmJgYCBpcyBjb21wdXRlZCBhbmQgYWdhaW4gd2hlblxuICAgICAgICAgICAgICAgICBgYGNgYCBpcyBtdWx0aXBsaWVkLlxuICAgICAgICAgICAgICAgICBVc2luZyBgYE11bChhLCBiLCBjKWBgIHdpbGwgcHJvY2VzcyBhbGwgYXJndW1lbnRzIG9uY2UuXG4gICAgICAgICAgICAqIFRoZSByZXN1bHRzIG9mIE11bCBhcmUgY2FjaGVkIGFjY29yZGluZyB0byBhcmd1bWVudHMsIHNvIGZsYXR0ZW5cbiAgICAgICAgICAgICAgd2lsbCBvbmx5IGJlIGNhbGxlZCBvbmNlIGZvciBgYE11bChhLCBiLCBjKWBgLiBJZiB5b3UgY2FuXG4gICAgICAgICAgICAgIHN0cnVjdHVyZSBhIGNhbGN1bGF0aW9uIHNvIHRoZSBhcmd1bWVudHMgYXJlIG1vc3QgbGlrZWx5IHRvIGJlXG4gICAgICAgICAgICAgIHJlcGVhdHMgdGhlbiB0aGlzIGNhbiBzYXZlIHRpbWUgaW4gY29tcHV0aW5nIHRoZSBhbnN3ZXIuIEZvclxuICAgICAgICAgICAgICBleGFtcGxlLCBzYXkgeW91IGhhZCBhIE11bCwgTSwgdGhhdCB5b3Ugd2lzaGVkIHRvIGRpdmlkZSBieSBgYGRbaV1gYFxuICAgICAgICAgICAgICBhbmQgbXVsdGlwbHkgYnkgYGBuW2ldYGAgYW5kIHlvdSBzdXNwZWN0IHRoZXJlIGFyZSBtYW55IHJlcGVhdHNcbiAgICAgICAgICAgICAgaW4gYGBuYGAuIEl0IHdvdWxkIGJlIGJldHRlciB0byBjb21wdXRlIGBgTSpuW2ldL2RbaV1gYCByYXRoZXJcbiAgICAgICAgICAgICAgdGhhbiBgYE0vZFtpXSpuW2ldYGAgc2luY2UgZXZlcnkgdGltZSBuW2ldIGlzIGEgcmVwZWF0LCB0aGVcbiAgICAgICAgICAgICAgcHJvZHVjdCwgYGBNKm5baV1gYCB3aWxsIGJlIHJldHVybmVkIHdpdGhvdXQgZmxhdHRlbmluZyAtLSB0aGVcbiAgICAgICAgICAgICAgY2FjaGVkIHZhbHVlIHdpbGwgYmUgcmV0dXJuZWQuIElmIHlvdSBkaXZpZGUgYnkgdGhlIGBgZFtpXWBgXG4gICAgICAgICAgICAgIGZpcnN0IChhbmQgdGhvc2UgYXJlIG1vcmUgdW5pcXVlIHRoYW4gdGhlIGBgbltpXWBgKSB0aGVuIHRoYXQgd2lsbFxuICAgICAgICAgICAgICBjcmVhdGUgYSBuZXcgTXVsLCBgYE0vZFtpXWBgIHRoZSBhcmdzIG9mIHdoaWNoIHdpbGwgYmUgdHJhdmVyc2VkXG4gICAgICAgICAgICAgIGFnYWluIHdoZW4gaXQgaXMgbXVsdGlwbGllZCBieSBgYG5baV1gYC5cbiAgICAgICAgICAgICAge2MuZi4gaHR0cHM6Ly9naXRodWIuY29tL3N5bXB5L3N5bXB5L2lzc3Vlcy81NzA2fVxuICAgICAgICAgICAgICBUaGlzIGNvbnNpZGVyYXRpb24gaXMgbW9vdCBpZiB0aGUgY2FjaGUgaXMgdHVybmVkIG9mZi5cbiAgICAgICAgICAgIE5CXG4gICAgICAgICAgICAtLVxuICAgICAgICAgICAgICBUaGUgdmFsaWRpdHkgb2YgdGhlIGFib3ZlIG5vdGVzIGRlcGVuZHMgb24gdGhlIGltcGxlbWVudGF0aW9uXG4gICAgICAgICAgICAgIGRldGFpbHMgb2YgTXVsIGFuZCBmbGF0dGVuIHdoaWNoIG1heSBjaGFuZ2UgYXQgYW55IHRpbWUuIFRoZXJlZm9yZSxcbiAgICAgICAgICAgICAgeW91IHNob3VsZCBvbmx5IGNvbnNpZGVyIHRoZW0gd2hlbiB5b3VyIGNvZGUgaXMgaGlnaGx5IHBlcmZvcm1hbmNlXG4gICAgICAgICAgICAgIHNlbnNpdGl2ZS5cbiAgICAgICAgICAgICAgUmVtb3ZhbCBvZiAxIGZyb20gdGhlIHNlcXVlbmNlIGlzIGFscmVhZHkgaGFuZGxlZCBieSBBc3NvY09wLl9fbmV3X18uXG4gICAgICAgICovXG4gICAgICAgIGxldCBydiA9IHVuZGVmaW5lZDtcbiAgICAgICAgaWYgKHNlcS5sZW5ndGggPT09IDIpIHtcbiAgICAgICAgICAgIGxldCBbYSwgYl0gPSBzZXE7XG4gICAgICAgICAgICBpZiAoYi5pc19SYXRpb25hbCgpKSB7XG4gICAgICAgICAgICAgICAgW2EsIGJdID0gW2IsIGFdO1xuICAgICAgICAgICAgICAgIHNlcSA9IFthLCBiXTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmICghKGEuaXNfemVybygpICYmIGEuaXNfUmF0aW9uYWwoKSkpIHtcbiAgICAgICAgICAgICAgICBsZXQgcjtcbiAgICAgICAgICAgICAgICBbciwgYl0gPSBiLmFzX2NvZWZmX011bCgpO1xuICAgICAgICAgICAgICAgIGlmIChiLmlzX0FkZCgpKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChyICE9PSBTLk9uZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgbGV0IGFyYjtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IGFyID0gYS5fX211bF9fKHIpO1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGFyID09PSBTLk9uZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGFyYiA9IGI7XG4gICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGFyYiA9IHRoaXMuY29uc3RydWN0b3IoZmFsc2UsIHRydWUsIGEuX19tdWxfXyhyKSwgYik7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICBydiA9IFtbYXJiXSwgW10sIHVuZGVmaW5lZF07XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoZ2xvYmFsX3BhcmFtZXRlcnMuZGlzdHJpYnV0ZSAmJiBiLmlzX2NvbW11dGF0aXZlKCkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IGFyZzogYW55ID0gW107XG4gICAgICAgICAgICAgICAgICAgICAgICBmb3IgKGNvbnN0IGJpIG9mIGIuX2FyZ3MpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBhcmcucHVzaCh0aGlzLl9rZWVwX2NvZWZmKGEsIGJpKSk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBuZXdiID0gbmV3IEFkZCh0cnVlLCB0cnVlLCAuLi5hcmcpO1xuICAgICAgICAgICAgICAgICAgICAgICAgcnYgPSBbW25ld2JdLCBbXSwgdW5kZWZpbmVkXTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChydikge1xuICAgICAgICAgICAgICAgIHJldHVybiBydjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGxldCBjX3BhcnQ6IGFueSA9IFtdO1xuICAgICAgICBjb25zdCBuY19zZXEgPSBbXTtcbiAgICAgICAgbGV0IG5jX3BhcnQ6IGFueSA9IFtdO1xuICAgICAgICBsZXQgY29lZmYgPSBTLk9uZTtcbiAgICAgICAgbGV0IGNfcG93ZXJzID0gW107XG4gICAgICAgIGxldCBuZWcxZSA9IFMuWmVybzsgbGV0IG51bV9leHAgPSBbXTtcbiAgICAgICAgY29uc3QgcG51bV9yYXQgPSBuZXcgSGFzaERpY3QoKTtcbiAgICAgICAgY29uc3Qgb3JkZXJfc3ltYm9sczogYW55W10gPSBbXTtcblxuICAgICAgICBmb3IgKGxldCBvIG9mIHNlcSkge1xuICAgICAgICAgICAgaWYgKG8uaXNfTXVsKCkpIHtcbiAgICAgICAgICAgICAgICBpZiAoby5pc19jb21tdXRhdGl2ZSgpKSB7XG4gICAgICAgICAgICAgICAgICAgIHNlcS5wdXNoKC4uLm8uX2FyZ3MpO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIGZvciAoY29uc3QgcSBvZiBvLl9hcmdzKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAocS5pc19jb21tdXRhdGl2ZSgpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc2VxLnB1c2gocSk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5jX3NlcS5wdXNoKHEpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgICAgfSBlbHNlIGlmIChvLmlzX051bWJlcigpKSB7XG4gICAgICAgICAgICAgICAgaWYgKG8gPT09IFMuTmFOIHx8IGNvZWZmID09PSBTLkNvbXBsZXhJbmZpbml0eSAmJiBvLmlzX3plcm8oKSkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gW1tTLk5hTl0sIFtdLCB1bmRlZmluZWRdO1xuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoY29lZmYuaXNfTnVtYmVyKCkpIHtcbiAgICAgICAgICAgICAgICAgICAgY29lZmYgPSBjb2VmZi5fX211bF9fKG8pO1xuICAgICAgICAgICAgICAgICAgICBpZiAoY29lZmYgPT09IFMuTmFOKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gW1tTLk5hTl0sIFtdLCB1bmRlZmluZWRdO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgICAgfSBlbHNlIGlmIChvID09PSBTLkNvbXBsZXhJbmZpbml0eSkge1xuICAgICAgICAgICAgICAgIGlmICghKGNvZWZmKSkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gW1tTLk5hTl0sIFtdLCB1bmRlZmluZWRdO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBjb2VmZiA9IFMuQ29tcGxleEluZmluaXR5O1xuICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgICAgfSBlbHNlIGlmIChvLmlzX2NvbW11dGF0aXZlKCkpIHtcbiAgICAgICAgICAgICAgICBsZXQgZTsgbGV0IGI7XG4gICAgICAgICAgICAgICAgW2IsIGVdID0gby5hc19iYXNlX2V4cCgpO1xuICAgICAgICAgICAgICAgIGlmIChvLmlzX1BvdygpKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChiLmlzX051bWJlcigpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoZS5pc19SYXRpb25hbCgpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGUuaXNfSW50ZWdlcigpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvZWZmID0gY29lZmYuX19tdWxfXyhuZXcgUG93KGIsIGUpKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIGlmIChlLmlzX25lZ2F0aXZlKCkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc2VxLnB1c2gobmV3IFBvdyhiLCBlKSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoYi5pc19uZWdhdGl2ZSgpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5lZzFlID0gbmVnMWUuX19hZGRfXyhlKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYiA9IGIuX19tdWxfXyhTLk5lZ2F0aXZlT25lKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGIgIT09IFMuT25lKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBudW1fcmF0LnNldGRlZmF1bHQoYiwgW10pLnB1c2goZSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIGlmIChiLmlzX3Bvc2l0aXZlKCkgfHwgYi5pc19pbnRlZ2VyKCkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBudW1fZXhwLnB1c2goW2IsIGVdKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBjX3Bvd2Vycy5wdXNoKFtiLCBlXSk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGlmIChvICE9PSBOQ19NYXJrZXIpIHtcbiAgICAgICAgICAgICAgICAgICAgbmNfc2VxLnB1c2gobyk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHdoaWxlIChuY19zZXEpIHtcbiAgICAgICAgICAgICAgICAgICAgbyA9IG5jX3NlcS5zcGxpY2UoMCwgMSk7XG4gICAgICAgICAgICAgICAgICAgIGlmICghKG5jX3BhcnQpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBuY19wYXJ0LnB1c2gobyk7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBjb25zdCBvMSA9IG5jX3BhcnQucG9wKCk7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IFtiMSwgZTFdID0gbzEuYXNfYmFzZV9leHAoKTtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgW2IyLCBlMl0gPSBvLmFzX2Jhc2VfZXhwKCk7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IG5ld19leHAgPSBlMS5fX2FkZF9fKGUyKTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGIxLmVxKGIyKSAmJiAhKG5ld19leHAuaXNfQWRkKCkpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBvMTIgPSBiMS5fZXZhbF9wb3dlcihuZXdfZXhwKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChvMTIuaXNfY29tbXV0YXRpdmUoKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNlcS5wdXNoKG8xMik7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5jX3NlcS5zcGxpY2UoMCwgMCwgbzEyKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIG5jX3BhcnQucHVzaChvMSk7XG4gICAgICAgICAgICAgICAgICAgICAgICBuY19wYXJ0LnB1c2gobyk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBmdW5jdGlvbiBfZ2F0aGVyKGNfcG93ZXJzOiBhbnlbXSkge1xuICAgICAgICAgICAgY29uc3QgY29tbW9uX2IgPSBuZXcgSGFzaERpY3QoKTtcbiAgICAgICAgICAgIGZvciAoY29uc3QgW2IsIGVdIG9mIGNfcG93ZXJzKSB7XG4gICAgICAgICAgICAgICAgY29uc3QgY28gPSBlLmFzX2NvZWZmX011bCgpO1xuICAgICAgICAgICAgICAgIGNvbW1vbl9iLnNldGRlZmF1bHQoYiwgbmV3IEhhc2hEaWN0KCkpLnNldGRlZmF1bHQoY29bMV0sIFtdKS5wdXNoKGNvWzBdKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBuby11bnVzZWQtdmFyc1xuICAgICAgICAgICAgZm9yIChjb25zdCBbYiwgZF0gb2YgY29tbW9uX2IuZW50cmllcygpKSB7XG4gICAgICAgICAgICAgICAgZm9yIChjb25zdCBbZGksIGxpXSBvZiBkLmVudHJpZXMoKSkge1xuICAgICAgICAgICAgICAgICAgICBkLmFkZChkaSwgbmV3IEFkZCh0cnVlLCB0cnVlLCAuLi5saSkpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGNvbnN0IG5ld19jX3Bvd2VycyA9IFtdO1xuICAgICAgICAgICAgZm9yIChjb25zdCBbYiwgZV0gb2YgY29tbW9uX2IuZW50cmllcygpKSB7XG4gICAgICAgICAgICAgICAgZm9yIChjb25zdCBbdCwgY10gb2YgZS5lbnRyaWVzKCkpIHtcbiAgICAgICAgICAgICAgICAgICAgbmV3X2NfcG93ZXJzLnB1c2goW2IsIGMuX19tdWxfXyh0KV0pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiBuZXdfY19wb3dlcnM7XG4gICAgICAgIH1cblxuICAgICAgICBjX3Bvd2VycyA9IF9nYXRoZXIoY19wb3dlcnMpO1xuICAgICAgICBudW1fZXhwID0gX2dhdGhlcihudW1fZXhwKTtcblxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IDI7IGkrKykge1xuICAgICAgICAgICAgY29uc3QgbmV3X2NfcG93ZXJzOiBhbnlbXSA9IFtdO1xuICAgICAgICAgICAgbGV0IGNoYW5nZWQgPSBmYWxzZTtcbiAgICAgICAgICAgIGZvciAobGV0IFtiLCBlXSBvZiBjX3Bvd2Vycykge1xuICAgICAgICAgICAgICAgIGxldCBwOiBhbnk7XG4gICAgICAgICAgICAgICAgaWYgKGUuaXNfemVybygpID09PSB0cnVlKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmICgoYi5pc19BZGQoKSB8fCBiLmlzX011bCgpICYmXG4gICAgICAgICAgICAgICAgICAgICAgICBiLl9hcmdzLmluY2x1ZGVzKFMuQ29tcGxleEluZmluaXR5LCBTLkluZmluaXR5LCBTLk5lZmF0aXZlSW5maW5pdHkpKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFtbUy5OYU5dLCBbXSwgdW5kZWZpbmVkXTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgaWYgKGUgPT09IFMuT25lKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChiLmlzX051bWJlcigpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb2VmZiA9IGNvZWZmLl9fbXVsX18oYik7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBwID0gYjtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgaWYgKGUgIT09IFMuT25lKSB7XG4gICAgICAgICAgICAgICAgICAgIHAgPSBuZXcgUG93KGIsIGUpO1xuICAgICAgICAgICAgICAgICAgICBpZiAocC5pc19Qb3coKSAmJiAhYi5pc19Qb3coKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgYmkgPSBiO1xuICAgICAgICAgICAgICAgICAgICAgICAgW2IsIGVdID0gcC5hc19iYXNlX2V4cCgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGIgIT09IGJpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY2hhbmdlZCA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgY19wYXJ0LnB1c2gocCk7XG4gICAgICAgICAgICAgICAgbmV3X2NfcG93ZXJzLnB1c2goW2IsIGVdKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGNvbnN0IGFyZ3NldCA9IG5ldyBIYXNoU2V0KCk7XG4gICAgICAgICAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tdW51c2VkLXZhcnNcbiAgICAgICAgICAgIGZvciAoY29uc3QgW2IsIGVdIG9mIG5ld19jX3Bvd2Vycykge1xuICAgICAgICAgICAgICAgIGFyZ3NldC5hZGQoYik7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoY2hhbmdlZCAmJiBhcmdzZXQuc2l6ZSAhPT0gbmV3X2NfcG93ZXJzLmxlbmd0aCkge1xuICAgICAgICAgICAgICAgIGNfcGFydCA9IFtdO1xuICAgICAgICAgICAgICAgIGNfcG93ZXJzID0gX2dhdGhlcihuZXdfY19wb3dlcnMpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBjb25zdCBpbnZfZXhwX2RpY3QgPSBuZXcgSGFzaERpY3QoKTtcbiAgICAgICAgZm9yIChjb25zdCBbYiwgZV0gb2YgbnVtX2V4cCkge1xuICAgICAgICAgICAgaW52X2V4cF9kaWN0LnNldGRlZmF1bHQoZSwgW10pLnB1c2goYik7XG4gICAgICAgIH1cbiAgICAgICAgZm9yIChjb25zdCBbZSwgYl0gb2YgaW52X2V4cF9kaWN0LmVudHJpZXMoKSkge1xuICAgICAgICAgICAgaW52X2V4cF9kaWN0LmFkZChlLCBuZXcgTXVsKHRydWUsIHRydWUsIC4uLmIpKTtcbiAgICAgICAgfVxuICAgICAgICBjb25zdCBjX3BhcnRfYXJnID0gW107XG4gICAgICAgIGZvciAoY29uc3QgW2UsIGJdIG9mIGludl9leHBfZGljdC5lbnRyaWVzKCkpIHtcbiAgICAgICAgICAgIGlmIChlKSB7XG4gICAgICAgICAgICAgICAgY19wYXJ0X2FyZy5wdXNoKG5ldyBQb3coYiwgZSkpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGNfcGFydC5wdXNoKC4uLmNfcGFydF9hcmcpO1xuXG4gICAgICAgIGNvbnN0IGNvbWJfZSA9IG5ldyBIYXNoRGljdCgpO1xuICAgICAgICBmb3IgKGNvbnN0IFtiLCBlXSBvZiBwbnVtX3JhdC5lbnRyaWVzKCkpIHtcbiAgICAgICAgICAgIGNvbWJfZS5zZXRkZWZhdWx0KG5ldyBBZGQodHJ1ZSwgdHJ1ZSwgLi4uZSksIFtdKS5wdXNoKGIpO1xuICAgICAgICB9XG5cbiAgICAgICAgY29uc3QgbnVtX3JhdCA9IFtdO1xuICAgICAgICBmb3IgKGxldCBbZSwgYl0gb2YgY29tYl9lLmVudHJpZXMoKSkge1xuICAgICAgICAgICAgYiA9IG5ldyBNdWwodHJ1ZSwgdHJ1ZSwgLi4uYik7XG4gICAgICAgICAgICBpZiAoZS5xID09PSAxKSB7XG4gICAgICAgICAgICAgICAgY29lZmYgPSBjb2VmZi5fX211bF9fKG5ldyBQb3coYiwgZSkpO1xuICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKGUucCA+IGUucSkge1xuICAgICAgICAgICAgICAgIGNvbnN0IFtlX2ksIGVwXSA9IGRpdm1vZChlLnAsIGUucSk7XG4gICAgICAgICAgICAgICAgY29lZmYgPSBjb2VmZi5fX211bF9fKG5ldyBQb3coYiwgZV9pKSk7XG4gICAgICAgICAgICAgICAgZSA9IG5ldyBSYXRpb25hbChlcCwgZS5xKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIG51bV9yYXQucHVzaChbYiwgZV0pO1xuICAgICAgICB9XG5cbiAgICAgICAgY29uc3QgcG5ldyA9IG5ldyBBcnJEZWZhdWx0RGljdCgpO1xuICAgICAgICBsZXQgaSA9IDA7XG4gICAgICAgIHdoaWxlIChpIDwgbnVtX3JhdC5sZW5ndGgpIHtcbiAgICAgICAgICAgIGxldCBbYmksIGVpXTogYW55ID0gbnVtX3JhdFtpXTtcbiAgICAgICAgICAgIGNvbnN0IGdyb3cgPSBbXTtcbiAgICAgICAgICAgIGZvciAobGV0IGogPSBpICsgMTsgaiA8IG51bV9yYXQubGVuZ3RoOyBqKyspIHtcbiAgICAgICAgICAgICAgICBjb25zdCBbYmosIGVqXTogYW55ID0gbnVtX3JhdFtqXTtcbiAgICAgICAgICAgICAgICBjb25zdCBnID0gYmkuZ2NkKGJqKTtcbiAgICAgICAgICAgICAgICBpZiAoZyAhPT0gUy5PbmUpIHtcbiAgICAgICAgICAgICAgICAgICAgbGV0IGUgPSBlaS5fX2FkZF9fKGVqKTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGUucSA9PT0gMSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgY29lZmYgPSBjb2VmZi5fX211bF9fKG5ldyBQb3coZywgZSkpO1xuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGUucCA+IGUucSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IFtlX2ksIGVwXSA9IGRpdm1vZChlLnAsIGUucSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29lZmYgPSBjb2VmZi5fX211bF9fKG5ldyBQb3coZywgZV9pKSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZSA9IG5ldyBSYXRpb25hbChlcCwgZS5xKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIGdyb3cucHVzaChbZywgZV0pO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIG51bV9yYXRbal0gPSBbYmovZywgZWpdO1xuICAgICAgICAgICAgICAgICAgICBiaSA9IGJpL2c7XG4gICAgICAgICAgICAgICAgICAgIGlmIChiaSA9PT0gUy5PbmUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKGJpICE9PSBTLk9uZSkge1xuICAgICAgICAgICAgICAgIGNvbnN0IG9iajogYW55ID0gbmV3IFBvdyhiaSwgZWkpO1xuICAgICAgICAgICAgICAgIGlmIChvYmouaXNfTnVtYmVyKCkpIHtcbiAgICAgICAgICAgICAgICAgICAgY29lZmYgPSBjb2VmZi5fX211bF9fKG9iaik7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgZm9yIChjb25zdCBpdGVtIG9mIHRoaXMubWFrZV9hcmdzKE11bCwgb2JqKSkgeyAvLyAhISEhISFcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChpdGVtLmlzX051bWJlcigpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29lZmYgPSBjb2VmZi5fX211bF9fKG9iaik7XG4gICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFtiaSwgZWldID0gaXRlbS5fYXJncztcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBwbmV3LmFkZChlaSwgcG5ldy5nZXQoZWkpLmNvbmNhdChiaSkpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgbnVtX3JhdC5wdXNoKC4uLmdyb3cpO1xuICAgICAgICAgICAgaSsrO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKG5lZzFlICE9PSBTLlplcm8pIHtcbiAgICAgICAgICAgIGxldCBuOyBsZXQgcTsgbGV0IHA7XG4gICAgICAgICAgICBbcCwgcV0gPSBuZWcxZS5fYXNfbnVtZXJfZGVub20oKTtcbiAgICAgICAgICAgIFtuLCBwXSA9IGRpdm1vZChwLnAsIHEucCk7XG4gICAgICAgICAgICBpZiAobiAlIDIgIT09IDApIHtcbiAgICAgICAgICAgICAgICBjb2VmZiA9IGNvZWZmLl9fbXVsX18oUy5OZWdhdGl2ZU9uZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAocSA9PT0gMikge1xuICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcImltYWdpbmFyeSBudW1iZXJzIG5vdCB5ZXQgc3VwcG9ydGVkXCIpO1xuICAgICAgICAgICAgfSBlbHNlIGlmIChwKSB7XG4gICAgICAgICAgICAgICAgbmVnMWUgPSBuZXcgUmF0aW9uYWwocCwgcSk7XG4gICAgICAgICAgICAgICAgbGV0IGVudGVyZWxzZTogYm9vbGVhbiA9IHRydWU7XG4gICAgICAgICAgICAgICAgZm9yIChjb25zdCBbZSwgYl0gb2YgcG5ldy5lbnRyaWVzKCkpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGUgPT09IG5lZzFlICYmIGIuaXNfcG9zaXRpdmUoKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgcG5ldy5hZGQoZSwgcG5ldy5nZXQoZSkgLSBiKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGVudGVyZWxzZSA9IGZhbHNlO1xuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgaWYgKGVudGVyZWxzZSkge1xuICAgICAgICAgICAgICAgICAgICBjX3BhcnQucHVzaChuZXcgUG93KFMuTmVnYXRpdmVPbmUsIG5lZzFlLCBmYWxzZSkpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IGNfcGFydF9hcmd2MiA9IFtdO1xuICAgICAgICBmb3IgKGxldCBbZSwgYl0gb2YgcG5ldy5lbnRyaWVzKCkpIHtcbiAgICAgICAgICAgIGlmIChBcnJheS5pc0FycmF5KGIpKSB7XG4gICAgICAgICAgICAgICAgYiA9IGJbMF07XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBjX3BhcnRfYXJndjIucHVzaChuZXcgUG93KGIsIGUpKTtcbiAgICAgICAgfVxuICAgICAgICBjX3BhcnQucHVzaCguLi5jX3BhcnRfYXJndjIpO1xuXG4gICAgICAgIGlmIChjb2VmZiA9PT0gUy5JbmZpbml0eSB8fCBjb2VmZiA9PT0gUy5OZWdhdGl2ZUluZmluaXR5KSB7XG4gICAgICAgICAgICBmdW5jdGlvbiBfaGFuZGxlX2Zvcl9vbyhjX3BhcnQ6IGFueVtdLCBjb2VmZl9zaWduOiBudW1iZXIpIHtcbiAgICAgICAgICAgICAgICBjb25zdCBuZXdfY19wYXJ0ID0gW107XG4gICAgICAgICAgICAgICAgZm9yIChjb25zdCB0IG9mIGNfcGFydCkge1xuICAgICAgICAgICAgICAgICAgICBpZiAodC5pc19leHRlbmRlZF9wb3NpdGl2ZSgpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBpZiAodC5pc19leHRlbmRlZF9uZWdhdGl2ZSgpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb2VmZl9zaWduICo9IC0xO1xuICAgICAgICAgICAgICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgbmV3X2NfcGFydC5wdXNoKHQpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICByZXR1cm4gW25ld19jX3BhcnQsIGNvZWZmX3NpZ25dO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgbGV0IGNvZWZmX3NpZ246IGFueTtcbiAgICAgICAgICAgIFtjX3BhcnQsIGNvZWZmX3NpZ25dID0gX2hhbmRsZV9mb3Jfb28oY19wYXJ0LCAxKTtcbiAgICAgICAgICAgIFtuY19wYXJ0LCBjb2VmZl9zaWduXSA9IF9oYW5kbGVfZm9yX29vKG5jX3BhcnQsIGNvZWZmX3NpZ24pO1xuICAgICAgICAgICAgY29lZmYgPSBjb2VmZi5fX211bF9fKG5ldyBJbnRlZ2VyKGNvZWZmX3NpZ24pKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChjb2VmZiA9PT0gUy5Db21wbGV4SW5maW5pdHkpIHtcbiAgICAgICAgICAgIGNvbnN0IGN0ZW1wID0gW107XG4gICAgICAgICAgICBmb3IgKGNvbnN0IGMgb2YgY19wYXJ0KSB7XG4gICAgICAgICAgICAgICAgaWYgKCEoZnV6enlfbm90djIoYy5pc196ZXJvKCkpICYmIGMuaXNfZXh0ZW5kZWRfcmVhbCgpICE9PSBcInVuZGVmaW5lZFwiKSkge1xuICAgICAgICAgICAgICAgICAgICBjdGVtcC5wdXNoKGMpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGNfcGFydCA9IGN0ZW1wO1xuICAgICAgICAgICAgY29uc3QgbmN0ZW1wID0gW107XG4gICAgICAgICAgICBmb3IgKGNvbnN0IGMgb2YgbmNfcGFydCkge1xuICAgICAgICAgICAgICAgIGlmICghKGZ1enp5X25vdHYyKGMuaXNfemVybygpKSAmJiBjLmlzX2V4dGVuZGVkX3JlYWwoKSAhPT0gXCJ1bmRlZmluZWRcIikpIHtcbiAgICAgICAgICAgICAgICAgICAgbmN0ZW1wLnB1c2goYyk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgbmNfcGFydCA9IG5jdGVtcDtcbiAgICAgICAgfSBlbHNlIGlmIChjb2VmZi5pc196ZXJvKCkpIHtcbiAgICAgICAgICAgIGZvciAoY29uc3QgYyBvZiBjX3BhcnQpIHtcbiAgICAgICAgICAgICAgICBpZiAoYy5pc19maW5pdGUoKSA9PT0gZmFsc2UpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFtbUy5OYU5dLCBbXSwgb3JkZXJfc3ltYm9sc107XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgY29uc3QgX25ldyA9IFtdO1xuICAgICAgICBmb3IgKGNvbnN0IGkgb2YgY19wYXJ0KSB7XG4gICAgICAgICAgICBpZiAoaS5pc19OdW1iZXIoKSkge1xuICAgICAgICAgICAgICAgIGNvZWZmID0gY29lZmYuX19tdWxfXyhpKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgX25ldy5wdXNoKGkpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGNfcGFydCA9IF9uZXc7XG5cbiAgICAgICAgX211bHNvcnQoY19wYXJ0KTtcblxuICAgICAgICBpZiAoY29lZmYgIT09IFMuT25lKSB7XG4gICAgICAgICAgICBjX3BhcnQuc3BsaWNlKDAsIDAsIGNvZWZmKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChnbG9iYWxfcGFyYW1ldGVycy5kaXN0cmlidXRlICYmICFuY19wYXJ0ICYmIGNfcGFydC5sZW5ndGggPT09IDIgJiZcbiAgICAgICAgICAgIGNfcGFydFswXS5pc19OdW1iZXIoKSAmJiBjX3BhcnRbMF0uaXNfZmluaXRlKCkgJiYgY19wYXJ0WzFdLmlzX0FkZCgpKSB7XG4gICAgICAgICAgICBjb2VmZiA9IGNfcGFydFswXTtcbiAgICAgICAgICAgIGNvbnN0IGFkZGFyZyA9IFtdO1xuICAgICAgICAgICAgZm9yIChjb25zdCBmIG9mIGNfcGFydFsxXS5fYXJncykge1xuICAgICAgICAgICAgICAgIGFkZGFyZy5wdXNoKGNvZWZmLl9fbXVsX18oZikpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgY19wYXJ0ID0gbmV3IEFkZCh0cnVlLCB0cnVlLCAuLi5hZGRhcmcpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBbY19wYXJ0LCBuY19wYXJ0LCBvcmRlcl9zeW1ib2xzXTtcbiAgICB9XG5cbiAgICBhc19jb2VmZl9NdWwocmF0aW9uYWw6IGJvb2xlYW4gPSBmYWxzZSkge1xuICAgICAgICBjb25zdCBjb2VmZjogYW55ID0gdGhpcy5fYXJncy5zbGljZSgwLCAxKVswXTtcbiAgICAgICAgY29uc3QgYXJnczogYW55ID0gdGhpcy5fYXJncy5zbGljZSgxKTtcblxuICAgICAgICBpZiAoY29lZmYuaXNfTnVtYmVyKCkpIHtcbiAgICAgICAgICAgIGlmICghcmF0aW9uYWwgfHwgY29lZmYuaXNfUmF0aW9uYWwoKSkge1xuICAgICAgICAgICAgICAgIGlmIChhcmdzLmxlbmd0aCA9PT0gMSkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gW2NvZWZmLCBhcmdzWzBdXTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gW2NvZWZmLCB0aGlzLl9uZXdfcmF3YXJncyh0cnVlLCAuLi5hcmdzKV07XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSBlbHNlIGlmIChjb2VmZi5pc19leHRlbmRlZF9uZWdhdGl2ZSgpKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIFtTLk5lZ2F0aXZlT25lLCB0aGlzLl9uZXdfcmF3YXJncyh0cnVlLCAuLi5bLWNvZWZmXS5jb25jYXQoYXJncykpXTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gW1MuT25lLCB0aGlzXTtcbiAgICB9XG5cbiAgICBfZXZhbF9wb3dlcihlOiBhbnkpIHtcbiAgICAgICAgY29uc3QgW2NhcmdzLCBuY10gPSB0aGlzLmFyZ3NfY25jKGZhbHNlLCB0cnVlLCBmYWxzZSk7XG4gICAgICAgIGlmIChlLmlzX0ludGVnZXIoKSkge1xuICAgICAgICAgICAgY29uc3QgbXVsYXJncyA9IFtdO1xuICAgICAgICAgICAgZm9yIChjb25zdCBiIG9mIGNhcmdzKSB7XG4gICAgICAgICAgICAgICAgbXVsYXJncy5wdXNoKG5ldyBQb3coYiwgZSwgZmFsc2UpKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiBuZXcgTXVsKHRydWUsIHRydWUsIC4uLm11bGFyZ3MpLl9fbXVsX18oXG4gICAgICAgICAgICAgICAgbmV3IFBvdyh0aGlzLl9mcm9tX2FyZ3MoTXVsLCB1bmRlZmluZWQsIC4uLm5jKSwgZSwgZmFsc2UpKTtcbiAgICAgICAgfVxuICAgICAgICBjb25zdCBwID0gbmV3IFBvdyh0aGlzLCBlLCBmYWxzZSk7XG5cbiAgICAgICAgaWYgKGUuaXNfUmF0aW9uYWwoKSB8fCBlLmlzX0Zsb2F0KCkpIHtcbiAgICAgICAgICAgIHJldHVybiBwLl9ldmFsX2V4cGFuZF9wb3dlcl9iYXNlKCk7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gcDtcbiAgICB9XG5cbiAgICBfa2VlcF9jb2VmZihjb2VmZjogYW55LCBmYWN0b3JzOiBhbnksIGNsZWFyOiBib29sZWFuID0gdHJ1ZSwgc2lnbjogYm9vbGVhbiA9IGZhbHNlKTogYW55IHtcbiAgICAgICAgLyogUmV0dXJuIGBgY29lZmYqZmFjdG9yc2BgIHVuZXZhbHVhdGVkIGlmIG5lY2Vzc2FyeS5cbiAgICAgICAgSWYgYGBjbGVhcmBgIGlzIEZhbHNlLCBkbyBub3Qga2VlcCB0aGUgY29lZmZpY2llbnQgYXMgYSBmYWN0b3JcbiAgICAgICAgaWYgaXQgY2FuIGJlIGRpc3RyaWJ1dGVkIG9uIGEgc2luZ2xlIGZhY3RvciBzdWNoIHRoYXQgb25lIG9yXG4gICAgICAgIG1vcmUgdGVybXMgd2lsbCBzdGlsbCBoYXZlIGludGVnZXIgY29lZmZpY2llbnRzLlxuICAgICAgICBJZiBgYHNpZ25gYCBpcyBUcnVlLCBhbGxvdyBhIGNvZWZmaWNpZW50IG9mIC0xIHRvIHJlbWFpbiBmYWN0b3JlZCBvdXQuXG4gICAgICAgIEV4YW1wbGVzXG4gICAgICAgID09PT09PT09XG4gICAgICAgID4+PiBmcm9tIHN5bXB5LmNvcmUubXVsIGltcG9ydCBfa2VlcF9jb2VmZlxuICAgICAgICA+Pj4gZnJvbSBzeW1weS5hYmMgaW1wb3J0IHgsIHlcbiAgICAgICAgPj4+IGZyb20gc3ltcHkgaW1wb3J0IFNcbiAgICAgICAgPj4+IF9rZWVwX2NvZWZmKFMuSGFsZiwgeCArIDIpXG4gICAgICAgICh4ICsgMikvMlxuICAgICAgICA+Pj4gX2tlZXBfY29lZmYoUy5IYWxmLCB4ICsgMiwgY2xlYXI9RmFsc2UpXG4gICAgICAgIHgvMiArIDFcbiAgICAgICAgPj4+IF9rZWVwX2NvZWZmKFMuSGFsZiwgKHggKyAyKSp5LCBjbGVhcj1GYWxzZSlcbiAgICAgICAgeSooeCArIDIpLzJcbiAgICAgICAgPj4+IF9rZWVwX2NvZWZmKFMoLTEpLCB4ICsgeSlcbiAgICAgICAgLXggLSB5XG4gICAgICAgID4+PiBfa2VlcF9jb2VmZihTKC0xKSwgeCArIHksIHNpZ249VHJ1ZSlcbiAgICAgICAgLSh4ICsgeSlcbiAgICAgICAgKi9cbiAgICAgICAgaWYgKCEoY29lZmYuaXNfTnVtYmVyKCkpKSB7XG4gICAgICAgICAgICBpZiAoZmFjdG9ycy5pc19OdW1iZXIoKSkge1xuICAgICAgICAgICAgICAgIFtmYWN0b3JzLCBjb2VmZl0gPSBbY29lZmYsIGZhY3RvcnNdO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gY29lZmYuX19tdWxfXyhmYWN0b3JzKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBpZiAoZmFjdG9ycyA9PT0gUy5PbmUpIHtcbiAgICAgICAgICAgIHJldHVybiBjb2VmZjtcbiAgICAgICAgfVxuICAgICAgICBpZiAoY29lZmYgPT09IFMuT25lKSB7XG4gICAgICAgICAgICByZXR1cm4gZmFjdG9ycztcbiAgICAgICAgfSBlbHNlIGlmIChjb2VmZiA9PT0gUy5OZWdhdGl2ZU9uZSAmJiAhc2lnbikge1xuICAgICAgICAgICAgcmV0dXJuIGZhY3RvcnMuX19tdWxfXyhTLk5lZ2F0aXZlT25lKTtcbiAgICAgICAgfSBlbHNlIGlmIChmYWN0b3JzLmlzX0FkZCgpKSB7XG4gICAgICAgICAgICBpZiAoIWNsZWFyICYmIGNvZWZmLmlzX1JhdGlvbmFsKCkgJiYgY29lZmYucSAhPT0gMSkge1xuICAgICAgICAgICAgICAgIGxldCBhcmdzID0gW107XG4gICAgICAgICAgICAgICAgZm9yIChjb25zdCBpIG9mIGZhY3RvcnMuX2FyZ3MpIHtcbiAgICAgICAgICAgICAgICAgICAgYXJncy5wdXNoKGkuYXNfY29lZmZfTXVsKCkpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBjb25zdCB0ZW1wID0gW107XG4gICAgICAgICAgICAgICAgZm9yIChjb25zdCBbYywgbV0gb2YgYXJncykge1xuICAgICAgICAgICAgICAgICAgICB0ZW1wLnB1c2goW3RoaXMuX2tlZXBfY29lZmYoYywgY29lZmYpLCBtXSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGFyZ3MgPSB0ZW1wO1xuICAgICAgICAgICAgICAgIGZvciAoY29uc3QgW2NdIG9mIGFyZ3MpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGMuaXNfSW50ZWdlcigpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zdCB0ZW1wYXJnID0gW107XG4gICAgICAgICAgICAgICAgICAgICAgICBmb3IgKGNvbnN0IGkgb2YgYXJncykge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChpWzBdID09PSAxKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRlbXBhcmcucHVzaChpLnNsaWNlKDAsIDEpKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLl9mcm9tX2FyZ3MoQWRkLCB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLi4udGhpcy5fZnJvbV9hcmdzKE11bCwgdW5kZWZpbmVkLCAuLi50ZW1wYXJnKSk7XG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiBuZXcgTXVsKGZhbHNlLCB0cnVlLCBjb2VmZiwgZmFjdG9ycyk7XG4gICAgICAgIH0gZWxzZSBpZiAoZmFjdG9ycy5pc19NdWwoKSkge1xuICAgICAgICAgICAgY29uc3QgbWFyZ3M6IGFueVtdID0gZmFjdG9ycy5fYXJncztcbiAgICAgICAgICAgIGlmIChtYXJnc1swXS5pc19OdW1iZXIoKSkge1xuICAgICAgICAgICAgICAgIG1hcmdzWzBdID0gbWFyZ3NbMF0uX19tdWxfXyhjb2VmZik7XG4gICAgICAgICAgICAgICAgaWYgKG1hcmdzWzBdID09PSAxKSB7XG4gICAgICAgICAgICAgICAgICAgIG1hcmdzLnNwbGljZSgyLCAxKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIG1hcmdzLnNwbGljZSgwLCAwLCBjb2VmZik7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fZnJvbV9hcmdzKE11bCwgdW5kZWZpbmVkLCAuLi5tYXJncyk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBsZXQgbSA9IGNvZWZmLl9fbXVsX18oZmFjdG9ycyk7XG4gICAgICAgICAgICBpZiAobS5pc19OdW1iZXIoKSAmJiAhKGZhY3RvcnMuaXNfTnVtYmVyKCkpKSB7XG4gICAgICAgICAgICAgICAgbSA9IHRoaXMuX2Zyb21fYXJncyhNdWwsIHVuZGVmaW5lZCwgY29lZmYsIGZhY3RvcnMpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIG07XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBzdGF0aWMgX25ldyhldmFsdWF0ZTogYm9vbGVhbiwgc2ltcGxpZnk6IGJvb2xlYW4sIC4uLmFyZ3M6IGFueSkge1xuICAgICAgICByZXR1cm4gbmV3IE11bChldmFsdWF0ZSwgc2ltcGxpZnksIC4uLmFyZ3MpO1xuICAgIH1cblxuXG4gICAgX2V2YWxfaXNfY29tbXV0YXRpdmUoKSB7XG4gICAgICAgIGNvbnN0IGFsbGFyZ3MgPSBbXTtcbiAgICAgICAgZm9yIChjb25zdCBhIG9mIHRoaXMuX2FyZ3MpIHtcbiAgICAgICAgICAgIGFsbGFyZ3MucHVzaChhLmlzX2NvbW11dGF0aXZlKCkpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBfZnV6enlfZ3JvdXB2MihhbGxhcmdzKTtcbiAgICB9XG5cbiAgICAvLyBXQiBhZGRpdGlvbiBmb3IgamFzbWluZSB0ZXN0c1xuICAgIHRvU3RyaW5nKCkge1xuICAgICAgICBsZXQgcmVzdWx0ID0gXCJcIjtcbiAgICAgICAgY29uc3QgbnVtX2FyZ3MgPSB0aGlzLl9hcmdzLmxlbmd0aFxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IG51bV9hcmdzOyBpKyspIHtcbiAgICAgICAgICAgIGNvbnN0IGFyZyA9IHRoaXMuX2FyZ3NbaV07XG4gICAgICAgICAgICBsZXQgdGVtcDtcbiAgICAgICAgICAgIGlmIChpICE9IG51bV9hcmdzIC0gMSkge1xuICAgICAgICAgICAgICAgIHRlbXAgPSBhcmcudG9TdHJpbmcoKSArIFwiKlwiXG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHRlbXAgPSBhcmcudG9TdHJpbmcoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJlc3VsdCA9IHJlc3VsdC5jb25jYXQodGVtcClcbiAgICAgICAgfVxuICAgIFxuICAgICAgICByZXR1cm4gcmVzdWx0O1xuICAgIH1cbn1cblxuTWFuYWdlZFByb3BlcnRpZXMucmVnaXN0ZXIoTXVsKTtcbkdsb2JhbC5yZWdpc3RlcihcIk11bFwiLCBNdWwuX25ldyk7XG4iLCAiLypcbkNoYW5nZXMgbWFkZSAoV0IgYW5kIEdNKTpcbi0gQWRkZWQgY29uc3RydWN0b3IgdG8gZXhwbGljaXRseSBjYWxsIEFzc29jT3Agc3VwZXJjbGFzc1xuLSBBZGRlZCBcInNpbXBsaWZ5XCIgYXJndW1lbnQsIHdoaWNoIHByZXZlbnRzIGluZmluaXRlIHJlY3Vyc2lvbiBpbiBBc3NvY09wXG4tIE5vdGU6IE9yZGVyIG9iamVjdHMgaW4gQWRkIGFyZSBub3QgeWV0IGltcGxlbWVudGVkXG4qL1xuXG5pbXBvcnQge0V4cHJ9IGZyb20gXCIuL2V4cHJcIjtcbmltcG9ydCB7QXNzb2NPcH0gZnJvbSBcIi4vb3BlcmF0aW9uc1wiO1xuaW1wb3J0IHtiYXNlLCBtaXgsIEhhc2hEaWN0fSBmcm9tIFwiLi91dGlsaXR5XCI7XG5pbXBvcnQge1N9IGZyb20gXCIuL3NpbmdsZXRvblwiO1xuaW1wb3J0IHtCYXNpY30gZnJvbSBcIi4vYmFzaWNcIjtcbmltcG9ydCB7TWFuYWdlZFByb3BlcnRpZXN9IGZyb20gXCIuL2Fzc3VtcHRpb25zXCI7XG5pbXBvcnQge011bH0gZnJvbSBcIi4vbXVsXCI7XG5pbXBvcnQge0dsb2JhbH0gZnJvbSBcIi4vZ2xvYmFsXCI7XG5pbXBvcnQge19mdXp6eV9ncm91cHYyfSBmcm9tIFwiLi9sb2dpY1wiO1xuXG5mdW5jdGlvbiBfYWRkc29ydChhcmdzOiBhbnlbXSkge1xuICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBuZXctY2FwXG4gICAgYXJncy5zb3J0KChhLCBiKSA9PiBCYXNpYy5jbXAoYSwgYikpO1xufVxuXG5leHBvcnQgY2xhc3MgQWRkIGV4dGVuZHMgbWl4KGJhc2UpLndpdGgoRXhwciwgQXNzb2NPcCkge1xuICAgIC8qXG4gICAgXCJcIlwiXG4gICAgRXhwcmVzc2lvbiByZXByZXNlbnRpbmcgYWRkaXRpb24gb3BlcmF0aW9uIGZvciBhbGdlYnJhaWMgZ3JvdXAuXG4gICAgLi4gZGVwcmVjYXRlZDo6IDEuN1xuICAgICAgIFVzaW5nIGFyZ3VtZW50cyB0aGF0IGFyZW4ndCBzdWJjbGFzc2VzIG9mIDpjbGFzczpgfi5FeHByYCBpbiBjb3JlXG4gICAgICAgb3BlcmF0b3JzICg6Y2xhc3M6YH4uTXVsYCwgOmNsYXNzOmB+LkFkZGAsIGFuZCA6Y2xhc3M6YH4uUG93YCkgaXNcbiAgICAgICBkZXByZWNhdGVkLiBTZWUgOnJlZjpgbm9uLWV4cHItYXJncy1kZXByZWNhdGVkYCBmb3IgZGV0YWlscy5cbiAgICBFdmVyeSBhcmd1bWVudCBvZiBgYEFkZCgpYGAgbXVzdCBiZSBgYEV4cHJgYC4gSW5maXggb3BlcmF0b3IgYGArYGBcbiAgICBvbiBtb3N0IHNjYWxhciBvYmplY3RzIGluIFN5bVB5IGNhbGxzIHRoaXMgY2xhc3MuXG4gICAgQW5vdGhlciB1c2Ugb2YgYGBBZGQoKWBgIGlzIHRvIHJlcHJlc2VudCB0aGUgc3RydWN0dXJlIG9mIGFic3RyYWN0XG4gICAgYWRkaXRpb24gc28gdGhhdCBpdHMgYXJndW1lbnRzIGNhbiBiZSBzdWJzdGl0dXRlZCB0byByZXR1cm4gZGlmZmVyZW50XG4gICAgY2xhc3MuIFJlZmVyIHRvIGV4YW1wbGVzIHNlY3Rpb24gZm9yIHRoaXMuXG4gICAgYGBBZGQoKWBgIGV2YWx1YXRlcyB0aGUgYXJndW1lbnQgdW5sZXNzIGBgZXZhbHVhdGU9RmFsc2VgYCBpcyBwYXNzZWQuXG4gICAgVGhlIGV2YWx1YXRpb24gbG9naWMgaW5jbHVkZXM6XG4gICAgMS4gRmxhdHRlbmluZ1xuICAgICAgICBgYEFkZCh4LCBBZGQoeSwgeikpYGAgLT4gYGBBZGQoeCwgeSwgeilgYFxuICAgIDIuIElkZW50aXR5IHJlbW92aW5nXG4gICAgICAgIGBgQWRkKHgsIDAsIHkpYGAgLT4gYGBBZGQoeCwgeSlgYFxuICAgIDMuIENvZWZmaWNpZW50IGNvbGxlY3RpbmcgYnkgYGAuYXNfY29lZmZfTXVsKClgYFxuICAgICAgICBgYEFkZCh4LCAyKngpYGAgLT4gYGBNdWwoMywgeClgYFxuICAgIDQuIFRlcm0gc29ydGluZ1xuICAgICAgICBgYEFkZCh5LCB4LCAyKWBgIC0+IGBgQWRkKDIsIHgsIHkpYGBcbiAgICBJZiBubyBhcmd1bWVudCBpcyBwYXNzZWQsIGlkZW50aXR5IGVsZW1lbnQgMCBpcyByZXR1cm5lZC4gSWYgc2luZ2xlXG4gICAgZWxlbWVudCBpcyBwYXNzZWQsIHRoYXQgZWxlbWVudCBpcyByZXR1cm5lZC5cbiAgICBOb3RlIHRoYXQgYGBBZGQoKmFyZ3MpYGAgaXMgbW9yZSBlZmZpY2llbnQgdGhhbiBgYHN1bShhcmdzKWBgIGJlY2F1c2VcbiAgICBpdCBmbGF0dGVucyB0aGUgYXJndW1lbnRzLiBgYHN1bShhLCBiLCBjLCAuLi4pYGAgcmVjdXJzaXZlbHkgYWRkcyB0aGVcbiAgICBhcmd1bWVudHMgYXMgYGBhICsgKGIgKyAoYyArIC4uLikpYGAsIHdoaWNoIGhhcyBxdWFkcmF0aWMgY29tcGxleGl0eS5cbiAgICBPbiB0aGUgb3RoZXIgaGFuZCwgYGBBZGQoYSwgYiwgYywgZClgYCBkb2VzIG5vdCBhc3N1bWUgbmVzdGVkXG4gICAgc3RydWN0dXJlLCBtYWtpbmcgdGhlIGNvbXBsZXhpdHkgbGluZWFyLlxuICAgIFNpbmNlIGFkZGl0aW9uIGlzIGdyb3VwIG9wZXJhdGlvbiwgZXZlcnkgYXJndW1lbnQgc2hvdWxkIGhhdmUgdGhlXG4gICAgc2FtZSA6b2JqOmBzeW1weS5jb3JlLmtpbmQuS2luZCgpYC5cbiAgICBFeGFtcGxlc1xuICAgID09PT09PT09XG4gICAgPj4+IGZyb20gc3ltcHkgaW1wb3J0IEFkZCwgSVxuICAgID4+PiBmcm9tIHN5bXB5LmFiYyBpbXBvcnQgeCwgeVxuICAgID4+PiBBZGQoeCwgMSlcbiAgICB4ICsgMVxuICAgID4+PiBBZGQoeCwgeClcbiAgICAyKnhcbiAgICA+Pj4gMip4KioyICsgMyp4ICsgSSp5ICsgMip5ICsgMip4LzUgKyAxLjAqeSArIDFcbiAgICAyKngqKjIgKyAxNyp4LzUgKyAzLjAqeSArIEkqeSArIDFcbiAgICBJZiBgYGV2YWx1YXRlPUZhbHNlYGAgaXMgcGFzc2VkLCByZXN1bHQgaXMgbm90IGV2YWx1YXRlZC5cbiAgICA+Pj4gQWRkKDEsIDIsIGV2YWx1YXRlPUZhbHNlKVxuICAgIDEgKyAyXG4gICAgPj4+IEFkZCh4LCB4LCBldmFsdWF0ZT1GYWxzZSlcbiAgICB4ICsgeFxuICAgIGBgQWRkKClgYCBhbHNvIHJlcHJlc2VudHMgdGhlIGdlbmVyYWwgc3RydWN0dXJlIG9mIGFkZGl0aW9uIG9wZXJhdGlvbi5cbiAgICA+Pj4gZnJvbSBzeW1weSBpbXBvcnQgTWF0cml4U3ltYm9sXG4gICAgPj4+IEEsQiA9IE1hdHJpeFN5bWJvbCgnQScsIDIsMiksIE1hdHJpeFN5bWJvbCgnQicsIDIsMilcbiAgICA+Pj4gZXhwciA9IEFkZCh4LHkpLnN1YnMoe3g6QSwgeTpCfSlcbiAgICA+Pj4gZXhwclxuICAgIEEgKyBCXG4gICAgPj4+IHR5cGUoZXhwcilcbiAgICA8Y2xhc3MgJ3N5bXB5Lm1hdHJpY2VzLmV4cHJlc3Npb25zLm1hdGFkZC5NYXRBZGQnPlxuICAgIE5vdGUgdGhhdCB0aGUgcHJpbnRlcnMgZG8gbm90IGRpc3BsYXkgaW4gYXJncyBvcmRlci5cbiAgICA+Pj4gQWRkKHgsIDEpXG4gICAgeCArIDFcbiAgICA+Pj4gQWRkKHgsIDEpLmFyZ3NcbiAgICAoMSwgeClcbiAgICBTZWUgQWxzb1xuICAgID09PT09PT09XG4gICAgTWF0QWRkXG4gICAgXCJcIlwiXG4gICAgKi9cblxuICAgIF9fc2xvdHNfXzogYW55W10gPSBbXTtcbiAgICBhcmdzOiBhbnlbXTtcbiAgICBzdGF0aWMgaXNfQWRkOiBhbnkgPSB0cnVlOyBcbiAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbmV3LWNhcFxuICAgIHN0YXRpYyBfYXJnc190eXBlID0gRXhwcihPYmplY3QpO1xuICAgIHN0YXRpYyBpZGVudGl0eSA9IFMuWmVybzsgLy8gISEhIHVuc3VyZSBhYnQgdGhpc1xuXG4gICAgY29uc3RydWN0b3IoZXZhbHVhdGU6IGJvb2xlYW4sIHNpbXBsaWZ5OiBib29sZWFuLCAuLi5hcmdzOiBhbnkpIHtcbiAgICAgICAgc3VwZXIoQWRkLCBldmFsdWF0ZSwgc2ltcGxpZnksIC4uLmFyZ3MpO1xuICAgIH1cblxuICAgIGZsYXR0ZW4oc2VxOiBhbnlbXSkge1xuICAgICAgICAvKlxuICAgICAgICBUYWtlcyB0aGUgc2VxdWVuY2UgXCJzZXFcIiBvZiBuZXN0ZWQgQWRkcyBhbmQgcmV0dXJucyBhIGZsYXR0ZW4gbGlzdC5cbiAgICAgICAgUmV0dXJuczogKGNvbW11dGF0aXZlX3BhcnQsIG5vbmNvbW11dGF0aXZlX3BhcnQsIG9yZGVyX3N5bWJvbHMpXG4gICAgICAgIEFwcGxpZXMgYXNzb2NpYXRpdml0eSwgYWxsIHRlcm1zIGFyZSBjb21tdXRhYmxlIHdpdGggcmVzcGVjdCB0b1xuICAgICAgICBhZGRpdGlvbi5cbiAgICAgICAgTkI6IHRoZSByZW1vdmFsIG9mIDAgaXMgYWxyZWFkeSBoYW5kbGVkIGJ5IEFzc29jT3AuX19uZXdfX1xuICAgICAgICBTZWUgYWxzb1xuICAgICAgICA9PT09PT09PVxuICAgICAgICBzeW1weS5jb3JlLm11bC5NdWwuZmxhdHRlblxuICAgICAgICAqL1xuICAgICAgICBsZXQgcnYgPSB1bmRlZmluZWQ7XG4gICAgICAgIGlmIChzZXEubGVuZ3RoID09PSAyKSB7XG4gICAgICAgICAgICBsZXQgW2EsIGJdID0gc2VxO1xuICAgICAgICAgICAgaWYgKGIuaXNfUmF0aW9uYWwoKSkge1xuICAgICAgICAgICAgICAgIFthLCBiXSA9IFtiLCBhXTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChhLmlzX1JhdGlvbmFsKCkpIHtcbiAgICAgICAgICAgICAgICBpZiAoYi5pc19NdWwoKSkge1xuICAgICAgICAgICAgICAgICAgICBydiA9IFtbYSwgYl0sIFtdLCB1bmRlZmluZWRdO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChydikge1xuICAgICAgICAgICAgICAgIGxldCBhbGxjID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICBmb3IgKGNvbnN0IHMgb2YgcnZbMF0pIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHMuaXNfY29tbXV0YXRpdmUoKSA9PT0gZmFsc2UpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGFsbGMgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBpZiAoYWxsYykge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gcnY7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFtbXSwgcnZbMF0sIHVuZGVmaW5lZF07XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGNvbnN0IHRlcm1zOiBIYXNoRGljdCA9IG5ldyBIYXNoRGljdCgpO1xuICAgICAgICBsZXQgY29lZmYgPSBTLlplcm87XG4gICAgICAgIGNvbnN0IGV4dHJhOiBhbnlbXSA9IFtdO1xuICAgICAgICBmb3IgKGNvbnN0IG8gb2Ygc2VxKSB7XG4gICAgICAgICAgICBsZXQgYztcbiAgICAgICAgICAgIGxldCBzO1xuICAgICAgICAgICAgaWYgKG8uaXNfTnVtYmVyKCkpIHtcbiAgICAgICAgICAgICAgICBpZiAoKG8gPT09IFMuTmFOIHx8IChjb2VmZiA9PT0gUy5Db21wbGV4SW5maW5pdHkgJiYgby5pc19maW5pdGUoKSA9PT0gZmFsc2UpKSkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gW1tTLk5hTl0sIFtdLCB1bmRlZmluZWRdO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBpZiAoY29lZmYuaXNfTnVtYmVyKCkpIHtcbiAgICAgICAgICAgICAgICAgICAgY29lZmYgPSBjb2VmZi5fX2FkZF9fKG8pO1xuICAgICAgICAgICAgICAgICAgICBpZiAoY29lZmYgPT09IFMuTmFOIHx8ICFleHRyYSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFtbUy5OYU5dLCBbXSwgdW5kZWZpbmVkXTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAobyA9PT0gUy5Db21wbGV4SW5maW5pdHkpIHtcbiAgICAgICAgICAgICAgICBpZiAoY29lZmYuaXNfZmluaXRlKCkgPT09IGZhbHNlKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBbW1MuTmFOXSwgW10sIHVuZGVmaW5lZF07XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGNvZWZmID0gUy5Db21wbGV4SW5maW5pdHk7XG4gICAgICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKG8uaXNfQWRkKCkpIHtcbiAgICAgICAgICAgICAgICBzZXEucHVzaCguLi5vLl9hcmdzKTtcbiAgICAgICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoby5pc19NdWwoKSkge1xuICAgICAgICAgICAgICAgIFtjLCBzXSA9IG8uYXNfY29lZmZfTXVsKCk7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKG8uaXNfUG93KCkpIHtcbiAgICAgICAgICAgICAgICBjb25zdCBwYWlyID0gby5hc19iYXNlX2V4cCgpO1xuICAgICAgICAgICAgICAgIGNvbnN0IGIgPSBwYWlyWzBdO1xuICAgICAgICAgICAgICAgIGNvbnN0IGUgPSBwYWlyWzFdO1xuICAgICAgICAgICAgICAgIGlmIChiLmlzX051bWJlcigpICYmIChlLmlzX0ludGVnZXIoKSB8fCAoZS5pc19SYXRpb25hbCgpICYmIGUuaXNfbmVnYXRpdmUoKSkpKSB7XG4gICAgICAgICAgICAgICAgICAgIHNlcS5wdXNoKGIuX2V2YWxfcG93ZXIoZSkpO1xuICAgICAgICAgICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgW2MsIHNdID0gW1MuT25lLCBvXTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgYyA9IFMuT25lO1xuICAgICAgICAgICAgICAgIHMgPSBvO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKHRlcm1zLmhhcyhzKSkge1xuICAgICAgICAgICAgICAgIHRlcm1zLmFkZChzLCB0ZXJtcy5nZXQocykuX19hZGRfXyhjKSk7XG4gICAgICAgICAgICAgICAgaWYgKHRlcm1zLmdldChzKSA9PT0gUy5OYU4pIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFtbUy5OYU5dLCBbXSwgdW5kZWZpbmVkXTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHRlcm1zLmFkZChzLCBjKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBsZXQgbmV3c2VxOiBhbnlbXSA9IFtdO1xuICAgICAgICBsZXQgbm9uY29tbXV0YXRpdmU6IGJvb2xlYW4gPSBmYWxzZTtcbiAgICAgICAgZm9yIChjb25zdCBpdGVtIG9mIHRlcm1zLmVudHJpZXMoKSkge1xuICAgICAgICAgICAgY29uc3QgczogYW55ID0gaXRlbVswXTtcbiAgICAgICAgICAgIGNvbnN0IGM6IGFueSA9IGl0ZW1bMV07XG4gICAgICAgICAgICBpZiAoYy5pc196ZXJvKCkpIHtcbiAgICAgICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoYyA9PT0gUy5PbmUpIHtcbiAgICAgICAgICAgICAgICBuZXdzZXEucHVzaChzKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgaWYgKHMuaXNfTXVsKCkpIHtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgY3MgPSBzLl9uZXdfcmF3YXJncyh0cnVlLCAuLi5bY10uY29uY2F0KHMuX2FyZ3MpKTtcbiAgICAgICAgICAgICAgICAgICAgbmV3c2VxLnB1c2goY3MpO1xuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAocy5pc19BZGQoKSkge1xuICAgICAgICAgICAgICAgICAgICBuZXdzZXEucHVzaChuZXcgTXVsKGZhbHNlLCB0cnVlLCBjLCBzKSk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgbmV3c2VxLnB1c2gobmV3IE11bCh0cnVlLCB0cnVlLCBjLCBzKSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgbm9uY29tbXV0YXRpdmUgPSBub25jb21tdXRhdGl2ZSB8fCAhKHMuaXNfY29tbXV0YXRpdmUoKSk7XG4gICAgICAgIH1cbiAgICAgICAgY29uc3QgdGVtcCA9IFtdO1xuICAgICAgICBpZiAoY29lZmYgPT09IFMuSW5maW5pdHkpIHtcbiAgICAgICAgICAgIGZvciAoY29uc3QgZiBvZiBuZXdzZXEpIHtcbiAgICAgICAgICAgICAgICBpZiAoIShmLmlzX2V4dGVuZGVkX25vbm5lZ2F0aXZlKCkpKSB7XG4gICAgICAgICAgICAgICAgICAgIHRlbXAucHVzaChmKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBuZXdzZXEgPSB0ZW1wO1xuICAgICAgICB9IGVsc2UgaWYgKGNvZWZmID09PSBTLk5lZ2F0aXZlSW5maW5pdHkpIHtcbiAgICAgICAgICAgIGZvciAoY29uc3QgZiBvZiBuZXdzZXEpIHtcbiAgICAgICAgICAgICAgICBpZiAoIShmLmlzX2V4dGVuZGVkX25vbnBvc2l0aXZlKCkpKSB7XG4gICAgICAgICAgICAgICAgICAgIHRlbXAucHVzaChmKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBuZXdzZXEgPSB0ZW1wO1xuICAgICAgICB9XG4gICAgICAgIGNvbnN0IHRlbXAyID0gW107XG4gICAgICAgIGlmIChjb2VmZiA9PT0gUy5Db21wbGV4SW5maW5pdHkpIHtcbiAgICAgICAgICAgIGZvciAoY29uc3QgYyBvZiBuZXdzZXEpIHtcbiAgICAgICAgICAgICAgICBpZiAoIShjLmlzX2Zpbml0ZSgpID09PSB0cnVlIHx8IHR5cGVvZiBjLmlzX2V4dGVuZGVkX3JlYWwoKSAhPT0gXCJ1bmRlZmluZWRcIikpIHtcbiAgICAgICAgICAgICAgICAgICAgdGVtcDIucHVzaChjKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBuZXdzZXEgPSB0ZW1wMjtcbiAgICAgICAgfVxuICAgICAgICBfYWRkc29ydChuZXdzZXEpO1xuICAgICAgICBpZiAoY29lZmYgIT09IFMuWmVybykge1xuICAgICAgICAgICAgbmV3c2VxLnNwbGljZSgwLCAwLCBjb2VmZik7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKG5vbmNvbW11dGF0aXZlKSB7XG4gICAgICAgICAgICByZXR1cm4gW1tdLCBuZXdzZXEsIHVuZGVmaW5lZF07XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gW25ld3NlcSwgW10sIHVuZGVmaW5lZF07XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBfZXZhbF9pc19jb21tdXRhdGl2ZSgpIHtcbiAgICAgICAgY29uc3QgZnV6enlhcmcgPSBbXTtcbiAgICAgICAgZm9yIChjb25zdCBhIG9mIHRoaXMuX2FyZ3MpIHtcbiAgICAgICAgICAgIGZ1enp5YXJnLnB1c2goYS5pc19jb21tdXRhdGl2ZSgpKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gX2Z1enp5X2dyb3VwdjIoZnV6enlhcmcpO1xuICAgIH1cblxuICAgIGFzX2NvZWZmX0FkZCgpIHtcbiAgICAgICAgY29uc3QgW2NvZWZmLCBhcmdzXSA9IFt0aGlzLmFyZ3NbMF0sIHRoaXMuYXJncy5zbGljZSgxKV07XG4gICAgICAgIGlmIChjb2VmZi5pc19OdW1iZXIoKSAmJiBjb2VmZi5pc19SYXRpb25hbCgpKSB7XG4gICAgICAgICAgICByZXR1cm4gW2NvZWZmLCB0aGlzLl9uZXdfcmF3YXJncyh0cnVlLCAuLi5hcmdzKV07XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIFtTLlplcm8sIHRoaXNdO1xuICAgIH1cblxuICAgIHN0YXRpYyBfbmV3KGV2YWx1YXRlOiBib29sZWFuLCBzaW1wbGlmeTogYm9vbGVhbiwgLi4uYXJnczogYW55KSB7XG4gICAgICAgIHJldHVybiBuZXcgQWRkKGV2YWx1YXRlLCBzaW1wbGlmeSwgLi4uYXJncyk7XG4gICAgfVxuXG4gICAgLy8gV0IgYWRkaXRpb24gZm9yIGphc21pbmUgdGVzdHNcbiAgICB0b1N0cmluZygpIHtcbiAgICAgICAgbGV0IHJlc3VsdCA9IFwiXCI7XG4gICAgICAgIGNvbnN0IG51bV9hcmdzID0gdGhpcy5fYXJncy5sZW5ndGhcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBudW1fYXJnczsgaSsrKSB7XG4gICAgICAgICAgICBjb25zdCBhcmcgPSB0aGlzLl9hcmdzW2ldO1xuICAgICAgICAgICAgbGV0IHRlbXA7XG4gICAgICAgICAgICBpZiAoaSAhPSBudW1fYXJncyAtIDEpIHtcbiAgICAgICAgICAgICAgICB0ZW1wID0gYXJnLnRvU3RyaW5nKCkgKyBcIiArIFwiXG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHRlbXAgPSBhcmcudG9TdHJpbmcoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJlc3VsdCA9IHJlc3VsdC5jb25jYXQodGVtcClcbiAgICAgICAgfVxuIFxuICAgICAgICByZXR1cm4gcmVzdWx0O1xuICAgIH1cbn1cblxuTWFuYWdlZFByb3BlcnRpZXMucmVnaXN0ZXIoQWRkKTtcbkdsb2JhbC5yZWdpc3RlcihcIkFkZFwiLCBBZGQuX25ldyk7XG4iLCAiLypcbk5vdGFibGUgY2hhbmdlcyBtYWRlIChhbmQgbm90ZXMpOlxuLSBCYXJlYm9uZXMgaW1wbGVtZW50YXRpb24gLSBvbmx5IGVub3VnaCBhcyBuZWVkZWQgZm9yIHN5bWJvbFxuKi9cblxuaW1wb3J0IHtfQmFzaWN9IGZyb20gXCIuL2Jhc2ljXCI7XG5pbXBvcnQge0Jvb2xlYW5LaW5kfSBmcm9tIFwiLi9raW5kXCI7XG5pbXBvcnQge2Jhc2UsIG1peH0gZnJvbSBcIi4vdXRpbGl0eVwiO1xuaW1wb3J0IHtNYW5hZ2VkUHJvcGVydGllc30gZnJvbSBcIi4vYXNzdW1wdGlvbnNcIjtcblxuY29uc3QgQm9vbGVhbiA9IChzdXBlcmNsYXNzOiBhbnkpID0+IGNsYXNzIEJvb2xlYW4gZXh0ZW5kcyBtaXgoYmFzZSkud2l0aChfQmFzaWMpIHtcbiAgICBfX3Nsb3RzX186IGFueVtdID0gW107XG5cbiAgICBzdGF0aWMga2luZCA9IEJvb2xlYW5LaW5kO1xufTtcblxuTWFuYWdlZFByb3BlcnRpZXMucmVnaXN0ZXIoQm9vbGVhbihPYmplY3QpKTtcblxuZXhwb3J0IHtCb29sZWFufTtcbiIsICIvKlxuTm90YWJsZSBjaGFuZ2VzXG4tIFN0aWxsIGEgd29yayBpbiBwcm9ncmVzcyAobm90IGFsbCBtZXRob2RzIGltcGxlbWVudGVkKVxuLSBDbGFzcyBzdHJ1Y3R1cmUgcmV3b3JrZWQgYmFzZWQgb24gYSBjb25zdHJ1Y3RvciBzeXN0ZW0gKHZpZXcgc291cmNlKVxuKi9cblxuaW1wb3J0IHttaXgsIGJhc2UsIEhhc2hEaWN0fSBmcm9tIFwiLi91dGlsaXR5XCI7XG5pbXBvcnQge0F0b21pY0V4cHJ9IGZyb20gXCIuL2V4cHJcIjtcbmltcG9ydCB7Qm9vbGVhbn0gZnJvbSBcIi4vYm9vbGFsZ1wiO1xuaW1wb3J0IHtOdW1iZXJLaW5kLCBVbmRlZmluZWRLaW5kfSBmcm9tIFwiLi9raW5kXCI7XG5pbXBvcnQge2Z1enp5X2Jvb2xfdjJ9IGZyb20gXCIuL2xvZ2ljXCI7XG5pbXBvcnQge1N0ZEZhY3RLQn0gZnJvbSBcIi4vYXNzdW1wdGlvbnNcIjtcbmltcG9ydCB7TWFuYWdlZFByb3BlcnRpZXN9IGZyb20gXCIuL2Fzc3VtcHRpb25zXCI7XG5cblxuY2xhc3MgU3ltYm9sIGV4dGVuZHMgbWl4KGJhc2UpLndpdGgoQm9vbGVhbiwgQXRvbWljRXhwcikge1xuICAgIC8qXG4gICAgQXNzdW1wdGlvbnM6XG4gICAgICAgY29tbXV0YXRpdmUgPSBUcnVlXG4gICAgWW91IGNhbiBvdmVycmlkZSB0aGUgZGVmYXVsdCBhc3N1bXB0aW9ucyBpbiB0aGUgY29uc3RydWN0b3IuXG4gICAgRXhhbXBsZXNcbiAgICA9PT09PT09PVxuICAgID4+PiBmcm9tIHN5bXB5IGltcG9ydCBzeW1ib2xzXG4gICAgPj4+IEEsQiA9IHN5bWJvbHMoJ0EsQicsIGNvbW11dGF0aXZlID0gRmFsc2UpXG4gICAgPj4+IGJvb2woQSpCICE9IEIqQSlcbiAgICBUcnVlXG4gICAgPj4+IGJvb2woQSpCKjIgPT0gMipBKkIpID09IFRydWUgIyBtdWx0aXBsaWNhdGlvbiBieSBzY2FsYXJzIGlzIGNvbW11dGF0aXZlXG4gICAgVHJ1ZVxuICAgICovXG5cbiAgICBzdGF0aWMgaXNfY29tcGFyYWJsZSA9IGZhbHNlO1xuXG4gICAgX19zbG90c19fID0gW1wibmFtZVwiXTtcblxuICAgIG5hbWU6IHN0cmluZztcblxuICAgIHN0YXRpYyBpc19TeW1ib2wgPSB0cnVlO1xuXG4gICAgc3RhdGljIGlzX3N5bWJvbCA9IHRydWU7XG5cbiAgICBzdGF0aWMgaXNfY29tbXV0YXRpdmUgPSB0cnVlO1xuXG4gICAgYXJnczogYW55W107XG5cbiAgICBraW5kKCkge1xuICAgICAgICBpZiAoKHRoaXMuY29uc3RydWN0b3IgYXMgYW55KS5pc19jb21tdXRhdGl2ZSkge1xuICAgICAgICAgICAgcmV0dXJuIE51bWJlcktpbmQ7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIFVuZGVmaW5lZEtpbmQ7XG4gICAgfVxuXG4gICAgX2RpZmZfd3J0KCkge1xuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG5cbiAgICBoYXNoS2V5KCkge1xuICAgICAgICByZXR1cm4gdGhpcy5uYW1lICsgdGhpcy5hcmdzO1xuICAgIH1cblxuICAgIGNvbnN0cnVjdG9yKG5hbWU6IGFueSwgcHJvcGVydGllczogUmVjb3JkPGFueSwgYW55PiA9IHVuZGVmaW5lZCkge1xuICAgICAgICBzdXBlcigpO1xuICAgICAgICB0aGlzLm5hbWUgPSBuYW1lO1xuXG4gICAgICAgIC8vIGFkZCB1c2VyIGFzc3VtcHRpb25zXG4gICAgICAgIGNvbnN0IGFzc3VtcHRpb25zOiBIYXNoRGljdCA9IG5ldyBIYXNoRGljdChwcm9wZXJ0aWVzKTtcbiAgICAgICAgU3ltYm9sLl9zYW5pdGl6ZShhc3N1bXB0aW9ucyk7XG4gICAgICAgIGNvbnN0IHRtcF9hc21fY29weSA9IGFzc3VtcHRpb25zLmNvcHkoKTtcblxuICAgICAgICAvLyBzdHJpY3QgY29tbXV0YXRpdml0eVxuICAgICAgICBjb25zdCBpc19jb21tdXRhdGl2ZSA9IGZ1enp5X2Jvb2xfdjIoYXNzdW1wdGlvbnMuZ2V0KFwiY29tbXV0YXRpdmVcIiwgdHJ1ZSkpO1xuICAgICAgICBhc3N1bXB0aW9ucy5hZGQoXCJpc19jb21tdXRhdGl2ZVwiLCBpc19jb21tdXRhdGl2ZSk7XG5cbiAgICAgICAgLy8gTWVyZ2Ugd2l0aCBvYmplY3QgYXNzdW1wdGlvbnMgYW5kIHJlYXNzaWduIG9iamVjdCBwcm9wZXJ0aWVzXG4gICAgICAgIHRoaXMuX2Fzc3VtcHRpb25zID0gbmV3IFN0ZEZhY3RLQihhc3N1bXB0aW9ucylcbiAgICAgICAgdGhpcy5fYXNzdW1wdGlvbnMuX2dlbmVyYXRvciA9IHRtcF9hc21fY29weTtcbiAgICB9XG5cbiAgICBlcXVhbHMob3RoZXI6IFN5bWJvbCkge1xuICAgICAgICBpZiAodGhpcy5uYW1lID0gb3RoZXIubmFtZSkge1xuICAgICAgICAgICAgaWYgKHRoaXMuX2Fzc3VtcHRpb25zLmlzU2FtZShvdGhlci5fYXNzdW1wdGlvbnMpKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cblxuICAgIHN0YXRpYyBfc2FuaXRpemUoYXNzdW1wdGlvbnM6IEhhc2hEaWN0ID0gbmV3IEhhc2hEaWN0KCkpIHtcbiAgICAgICAgLy8gcmVtb3ZlIG5vbmUsIGNvbnZlcnQgdmFsdWVzIHRvIGJvb2wsIGNoZWNrIGNvbW11dGF0aXZpdHkgKmluIHBsYWNlKlxuXG4gICAgICAgIC8vIGJlIHN0cmljdCBhYm91dCBjb21tdXRhdGl2aXR5OiBjYW5ub3QgYmUgdW5kZWZpbmVkXG4gICAgICAgIGNvbnN0IGlzX2NvbW11dGF0aXZlID0gZnV6enlfYm9vbF92Mihhc3N1bXB0aW9ucy5nZXQoXCJjb21tdXRhdGl2ZVwiLCB0cnVlKSk7XG4gICAgICAgIGlmICh0eXBlb2YgaXNfY29tbXV0YXRpdmUgPT09IFwidW5kZWZpbmVkXCIpIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcImNvbW11dGF0aXZpdHkgbXVzdCBiZSB0cnVlIG9yIGZhbHNlXCIpO1xuICAgICAgICB9XG4gICAgICAgIGZvciAoY29uc3Qga2V5IG9mIGFzc3VtcHRpb25zLmtleXMoKSkge1xuICAgICAgICAgICAgY29uc3QgdiA9IGFzc3VtcHRpb25zLmdldChrZXkpO1xuICAgICAgICAgICAgaWYgKHR5cGVvZiB2ID09PSBcInVuZGVmaW5lZFwiKSB7XG4gICAgICAgICAgICAgICAgYXNzdW1wdGlvbnMuZGVsZXRlKGtleSk7XG4gICAgICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBhc3N1bXB0aW9ucy5hZGQoa2V5LCB2IGFzIGJvb2xlYW4pO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgdG9TdHJpbmcoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLm5hbWU7XG4gICAgfVxufVxuXG4vLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbmV3LWNhcFxuTWFuYWdlZFByb3BlcnRpZXMucmVnaXN0ZXIoU3ltYm9sKTtcblxuZXhwb3J0IHtTeW1ib2x9O1xuIiwgImltcG9ydCB7QWRkfSBmcm9tIFwiLi4vdHMtcG9ydC9jb3JlL2FkZFwiO1xuaW1wb3J0IHtNdWx9IGZyb20gXCIuLi90cy1wb3J0L2NvcmUvbXVsXCI7XG5pbXBvcnQge19OdW1iZXJffSBmcm9tIFwiLi4vdHMtcG9ydC9jb3JlL251bWJlcnNcIjtcbmltcG9ydCB7UG93fSBmcm9tIFwiLi4vdHMtcG9ydC9jb3JlL3Bvd2VyXCI7XG5pbXBvcnQge1N9IGZyb20gXCIuLi90cy1wb3J0L2NvcmUvc2luZ2xldG9uXCI7XG5pbXBvcnQge1N5bWJvbH0gZnJvbSBcIi4uL3RzLXBvcnQvY29yZS9zeW1ib2xcIjtcbmltcG9ydCB7ZmFjdG9yaW50LCBmYWN0b3JyYXR9IGZyb20gXCIuLi90cy1wb3J0L250aGVvcnkvZmFjdG9yX1wiO1xuXG5jb25zdCBuID0gX051bWJlcl8ubmV3KDIpXG5jb25zdCB4ID0gbmV3IFN5bWJvbChcInhcIik7XG5cbmNvbnNvbGUubG9nKFwiXFxuIEFERCBcXG5cIilcblxuLy8gVGVzdGluZyBhZGRcbmNvbnNvbGUubG9nKG5ldyBBZGQodHJ1ZSwgdHJ1ZSwgbiwgeCwgUy5Db21wbGV4SW5maW5pdHkpLnRvU3RyaW5nKCkpXG5jb25zb2xlLmxvZyhuZXcgQWRkKHRydWUsIHRydWUsIG4sIHgsIFMuSW5maW5pdHkpLnRvU3RyaW5nKCkpXG5jb25zb2xlLmxvZyhuZXcgQWRkKHRydWUsIHRydWUsIG4sIHgsIFMuTmVnYXRpdmVJbmZpbml0eSkudG9TdHJpbmcoKSlcbmNvbnNvbGUubG9nKG5ldyBBZGQodHJ1ZSwgdHJ1ZSwgbiwgeCwgUy5JbmZpbml0eSwgUy5OZWdhdGl2ZUluZmluaXR5KS50b1N0cmluZygpKVxuY29uc29sZS5sb2cobmV3IEFkZCh0cnVlLCB0cnVlLCBuLCB4LCBTLkNvbXBsZXhJbmZpbml0eSwgUy5JbmZpbml0eSkudG9TdHJpbmcoKSlcbmNvbnNvbGUubG9nKG5ldyBBZGQodHJ1ZSwgdHJ1ZSwgbiwgeCwgUy5OYU4sIFMuSW5maW5pdHkpLnRvU3RyaW5nKCkpXG5cbmNvbnNvbGUubG9nKFwiXFxuIE1VTCBcXG5cIilcblxuLy8gVGVzdGluZyBtdWxcbmNvbnNvbGUubG9nKG5ldyBNdWwodHJ1ZSwgdHJ1ZSwgbiwgeCwgUy5Db21wbGV4SW5maW5pdHkpLnRvU3RyaW5nKCkpXG5jb25zb2xlLmxvZyhuZXcgTXVsKHRydWUsIHRydWUsIG4sIHgsIFMuSW5maW5pdHkpLnRvU3RyaW5nKCkpXG5jb25zb2xlLmxvZyhuZXcgTXVsKHRydWUsIHRydWUsIG4sIHgsIFMuTmVnYXRpdmVJbmZpbml0eSkudG9TdHJpbmcoKSlcbmNvbnNvbGUubG9nKG5ldyBNdWwodHJ1ZSwgdHJ1ZSwgbiwgeCwgUy5JbmZpbml0eSwgUy5OZWdhdGl2ZUluZmluaXR5KS50b1N0cmluZygpKVxuY29uc29sZS5sb2cobmV3IE11bCh0cnVlLCB0cnVlLCBuLCB4LCBTLkNvbXBsZXhJbmZpbml0eSwgUy5JbmZpbml0eSkudG9TdHJpbmcoKSlcbmNvbnNvbGUubG9nKG5ldyBNdWwodHJ1ZSwgdHJ1ZSwgbiwgeCwgUy5OYU4sIFMuSW5maW5pdHkpLnRvU3RyaW5nKCkpXG5cbmNvbnNvbGUubG9nKFwiXFxuIFBPVyBcXG5cIilcblxuLy8gVGVzdGluZyBQb3dcbmNvbnNvbGUubG9nKG5ldyBQb3cobiwgUy5Db21wbGV4SW5maW5pdHkpLnRvU3RyaW5nKCkpIC8vIGdvb2RcbmNvbnNvbGUubG9nKG5ldyBQb3cobiwgUy5JbmZpbml0eSkudG9TdHJpbmcoKSkgLy8gZ29vZFxuY29uc29sZS5sb2cobmV3IFBvdyhuLCBTLk5hTikudG9TdHJpbmcoKSkgLy8gZ29vZFxuY29uc29sZS5sb2cobmV3IFBvdyhuLCBTLkNvbXBsZXhJbmZpbml0eSwgUy5JbmZpbml0eSkudG9TdHJpbmcoKSkgLy8gZ29vZFxuY29uc29sZS5sb2cobmV3IFBvdyhuLCBTLk5hTiwgUy5JbmZpbml0eSkudG9TdHJpbmcoKSkgLy8gZ29vZFxuIl0sCiAgIm1hcHBpbmdzIjogIjs7QUFNQSxNQUFNLE9BQU4sTUFBVztBQUFBLElBR1AsT0FBTyxRQUFRQSxJQUFnQjtBQUMzQixVQUFJLE9BQU9BLE9BQU0sYUFBYTtBQUMxQixlQUFPO0FBQUEsTUFDWDtBQUNBLFVBQUlBLEdBQUUsU0FBUztBQUNYLGVBQU9BLEdBQUUsUUFBUTtBQUFBLE1BQ3JCO0FBQ0EsVUFBSSxNQUFNLFFBQVFBLEVBQUMsR0FBRztBQUNsQixlQUFPQSxHQUFFLElBQUksQ0FBQyxNQUFNLEtBQUssUUFBUSxDQUFDLENBQUMsRUFBRSxLQUFLLEdBQUc7QUFBQSxNQUNqRDtBQUNBLFVBQUlB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QUcsR0FBRyxFQUFFLGVBQWUsRUFBRSxTQUFTLENBQUM7QUFDbkUsVUFBUSxJQUFJLElBQUksSUFBSSxNQUFNLE1BQU0sR0FBRyxHQUFHLEVBQUUsUUFBUSxFQUFFLFNBQVMsQ0FBQztBQUM1RCxVQUFRLElBQUksSUFBSSxJQUFJLE1BQU0sTUFBTSxHQUFHLEdBQUcsRUFBRSxnQkFBZ0IsRUFBRSxTQUFTLENBQUM7QUFDcEUsVUFBUSxJQUFJLElBQUksSUFBSSxNQUFNLE1BQU0sR0FBRyxHQUFHLEVBQUUsVUFBVSxFQUFFLGdCQUFnQixFQUFFLFNBQVMsQ0FBQztBQUNoRixVQUFRLElBQUksSUFBSSxJQUFJLE1BQU0sTUFBTSxHQUFHLEdBQUcsRUFBRSxpQkFBaUIsRUFBRSxRQUFRLEVBQUUsU0FBUyxDQUFDO0FBQy9FLFVBQVEsSUFBSSxJQUFJLElBQUksTUFBTSxNQUFNLEdBQUcsR0FBRyxFQUFFLEtBQUssRUFBRSxRQUFRLEVBQUUsU0FBUyxDQUFDO0FBRW5FLFVBQVEsSUFBSSxXQUFXO0FBR3ZCLFVBQVEsSUFBSSxJQUFJLElBQUksR0FBRyxFQUFFLGVBQWUsRUFBRSxTQUFTLENBQUM7QUFDcEQsVUFBUSxJQUFJLElBQUksSUFBSSxHQUFHLEVBQUUsUUFBUSxFQUFFLFNBQVMsQ0FBQztBQUM3QyxVQUFRLElBQUksSUFBSSxJQUFJLEdBQUcsRUFBRSxHQUFHLEVBQUUsU0FBUyxDQUFDO0FBQ3hDLFVBQVEsSUFBSSxJQUFJLElBQUksR0FBRyxFQUFFLGlCQUFpQixFQUFFLFFBQVEsRUFBRSxTQUFTLENBQUM7QUFDaEUsVUFBUSxJQUFJLElBQUksSUFBSSxHQUFHLEVBQUUsS0FBSyxFQUFFLFFBQVEsRUFBRSxTQUFTLENBQUM7IiwKICAibmFtZXMiOiBbIngiLCAibiIsICJleHAiLCAieCIsICJ4IiwgImltcGwiLCAiaXRlbSIsICJQIiwgInNlbGYiLCAiYmFzZSIsICJzZWxmIiwgIm9sZCIsICJfbmV3IiwgInJ2IiwgIm4iLCAibW9kIiwgIkVycm9yIiwgImNzZXQiLCAieCIsICJuIiwgIl9BdG9taWNFeHByIiwgIm9iaiIsICJ4IiwgIm1pbiIsICJtYXgiLCAibiIsICJiYXNlIiwgInNpZ24iLCAicG93IiwgInN1bSIsICJ4MiIsICJEZWNpbWFsIiwgImkiLCAieCIsICJuIiwgIl9BdG9taWNFeHByIiwgIngiLCAicmVzdWx0IiwgIk5hTiIsICJfQXRvbWljRXhwciIsICJuIiwgInQiLCAiRXJyb3IiLCAiYmFzZSIsICJleHAiLCAiZCIsICJmYWN0b3JzIiwgInIiLCAiY19wb3dlcnMiLCAiaSIsICJuIiwgImNfcGFydCIsICJjb2VmZl9zaWduIiwgInNpZ24iLCAiQm9vbGVhbiIsICJCb29sZWFuIiwgIlN5bWJvbCIsICJTeW1ib2wiXQp9Cg==
