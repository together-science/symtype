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
  function make_property(obj, fact) {
    if (!fact.includes("is_")) {
      obj[as_property(fact)] = getit;
    } else {
      obj[fact] = getit;
    }
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
    const facts_to_check = new Array(fact);
    const facts_queued = new HashSet([fact]);
    const cls = obj.constructor;
    for (const fact_i of facts_to_check) {
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
      const factset = _assume_rules.prereq.get(fact_i).difference(facts_queued);
      if (factset.size !== 0) {
        const new_facts_to_check = new Array(_assume_rules.prereq.get(fact_i).difference(facts_queued));
        Util.shuffleArray(new_facts_to_check);
        facts_to_check.push(new_facts_to_check);
        facts_to_check.flat();
        facts_queued.addArr(new_facts_to_check);
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
      for (const base2 of Util.getSupers(cls).reverse()) {
        const assumptions = base2._explicit_class_assumptions;
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
        for (const fact of this._assumptions.keys()) {
          make_property(this, fact);
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
            } else {
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
              coeff_sign2 = -1;
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
          if (!(c.is_finite() || c.is_extended_real() !== "undefined")) {
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
        const cls = this.constructor;
        if (other === S.Nan) {
          return S.Nan;
        } else if (other === S.Infinity) {
          if (cls.is_zero) {
            return S.NaN;
          } else if (cls.is_positive) {
            return S.Infinity;
          } else {
            return S.NegativeInfinity;
          }
        } else if (other === S.NegativeInfinity) {
          if (cls.is_zero) {
            return S.NaN;
          } else if (cls.is_positive) {
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
        if (this.is_negative() == true) {
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
        } else if (other.is_extended_positive) {
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
        } else if (other.is_extended_positive) {
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
  console.log("assinging S.Infinity");
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
      const is_commutative = fuzzy_bool_v2(assumptions.get("commutative", true));
      assumptions.add("is_commutative", is_commutative);
      this._assumptions.merge(assumptions);
      this._assumptions._generator = tmp_asm_copy;
      super.assignProps();
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
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsiLi4vY29yZS91dGlsaXR5LnRzIiwgIi4uL2NvcmUvbG9naWMudHMiLCAiLi4vY29yZS9mYWN0cy50cyIsICIuLi9jb3JlL2NvcmUudHMiLCAiLi4vY29yZS9hc3N1bXB0aW9ucy50cyIsICIuLi9jb3JlL2tpbmQudHMiLCAiLi4vY29yZS90cmF2ZXJzYWwudHMiLCAiLi4vY29yZS9iYXNpYy50cyIsICIuLi9jb3JlL3NpbmdsZXRvbi50cyIsICIuLi9jb3JlL2dsb2JhbC50cyIsICIuLi91dGlsaXRpZXMvbWlzYy50cyIsICIuLi9jb3JlL2V4cHIudHMiLCAiLi4vY29yZS9wYXJhbWV0ZXJzLnRzIiwgIi4uL2NvcmUvb3BlcmF0aW9ucy50cyIsICIuLi9jb3JlL3Bvd2VyLnRzIiwgIi4uL2NvcmUvbXVsLnRzIiwgIi4uL2NvcmUvYWRkLnRzIiwgIi4uLy4uL25vZGVfbW9kdWxlcy9kZWNpbWFsLmpzL2RlY2ltYWwubWpzIiwgIi4uL2NvcmUvbnVtYmVycy50cyIsICIuLi9udGhlb3J5L2ZhY3Rvcl8udHMiLCAiLi4vY29yZS9ib29sYWxnLnRzIiwgIi4uL2NvcmUvc3ltYm9sLnRzIiwgIi4uL3N5bXR5cGUudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbIi8qXG5BIGZpbGUgd2l0aCB1dGlsaXR5IGNsYXNzZXMgYW5kIGZ1bmN0aW9ucyB0byBoZWxwIHdpdGggcG9ydGluZ1xuRGV2ZWxvcGQgYnkgV0IgYW5kIEdNXG4qL1xuXG4vLyBnZW5lcmFsIHV0aWwgZnVuY3Rpb25zXG5jbGFzcyBVdGlsIHtcbiAgICAvLyBoYXNoa2V5IGZ1bmN0aW9uXG4gICAgLy8gc2hvdWxkIGJlIGFibGUgdG8gaGFuZGxlIG11bHRpcGxlIHR5cGVzIG9mIGlucHV0c1xuICAgIHN0YXRpYyBoYXNoS2V5KHg6IGFueSk6IHN0cmluZyB7XG4gICAgICAgIGlmICh0eXBlb2YgeCA9PT0gXCJ1bmRlZmluZWRcIikge1xuICAgICAgICAgICAgcmV0dXJuIFwidW5kZWZpbmVkXCI7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHguaGFzaEtleSkge1xuICAgICAgICAgICAgcmV0dXJuIHguaGFzaEtleSgpO1xuICAgICAgICB9XG4gICAgICAgIGlmIChBcnJheS5pc0FycmF5KHgpKSB7XG4gICAgICAgICAgICByZXR1cm4geC5tYXAoKGUpID0+IFV0aWwuaGFzaEtleShlKSkuam9pbihcIixcIik7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHggPT09IG51bGwpIHtcbiAgICAgICAgICAgIHJldHVybiBcIm51bGxcIjtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4geC50b1N0cmluZygpO1xuICAgIH1cblxuICAgIC8vIGNoZWNrIGlmIGFycjEgaXMgYSBzdWJzZXQgb2YgYXJyMlxuICAgIHN0YXRpYyBpc1N1YnNldChhcnIxOiBhbnlbXSwgYXJyMjogYW55W10pOiBib29sZWFuIHtcbiAgICAgICAgY29uc3QgdGVtcGFyciA9IGFycjIubWFwKChpOiBhbnkpID0+IFV0aWwuaGFzaEtleShpKSlcbiAgICAgICAgZm9yIChjb25zdCBlIG9mIGFycjEpIHtcbiAgICAgICAgICAgIGlmICghdGVtcGFyci5pbmNsdWRlcyhVdGlsLmhhc2hLZXkoZSkpKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cblxuICAgIC8vIGNvbnZlcnQgYW4gaW50ZWdlciB0byBiaW5hcnlcbiAgICAvLyBmdW5jdGlvbmFsIGZvciBuZWdhdGl2ZSBudW1iZXJzXG4gICAgc3RhdGljIGJpbihudW06IG51bWJlcikge1xuICAgICAgICByZXR1cm4gKG51bSA+Pj4gMCkudG9TdHJpbmcoMik7XG4gICAgfVxuXG4gICAgc3RhdGljKiBwcm9kdWN0KHJlcGVhdDogbnVtYmVyID0gMSwgLi4uYXJnczogYW55W10pIHtcbiAgICAgICAgY29uc3QgdG9BZGQ6IGFueVtdID0gW107XG4gICAgICAgIGZvciAoY29uc3QgYSBvZiBhcmdzKSB7XG4gICAgICAgICAgICB0b0FkZC5wdXNoKFthXSk7XG4gICAgICAgIH1cbiAgICAgICAgY29uc3QgcG9vbHM6IGFueVtdID0gW107XG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgcmVwZWF0OyBpKyspIHtcbiAgICAgICAgICAgIHRvQWRkLmZvckVhY2goKGU6IGFueSkgPT4gcG9vbHMucHVzaChlWzBdKSk7XG4gICAgICAgIH1cbiAgICAgICAgbGV0IHJlczogYW55W11bXSA9IFtbXV07XG4gICAgICAgIGZvciAoY29uc3QgcG9vbCBvZiBwb29scykge1xuICAgICAgICAgICAgY29uc3QgcmVzX3RlbXA6IGFueVtdID0gW107XG4gICAgICAgICAgICBmb3IgKGNvbnN0IHggb2YgcmVzKSB7XG4gICAgICAgICAgICAgICAgZm9yIChjb25zdCB5IG9mIHBvb2wpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHR5cGVvZiB4WzBdID09PSBcInVuZGVmaW5lZFwiKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXNfdGVtcC5wdXNoKFt5XSk7XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXNfdGVtcC5wdXNoKHguY29uY2F0KHkpKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJlcyA9IHJlc190ZW1wO1xuICAgICAgICB9XG4gICAgICAgIGZvciAoY29uc3QgcHJvZCBvZiByZXMpIHtcbiAgICAgICAgICAgIHlpZWxkIHByb2Q7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBzdGF0aWMqIHBlcm11dGF0aW9ucyhpdGVyYWJsZTogYW55LCByOiBhbnkgPSB1bmRlZmluZWQpIHtcbiAgICAgICAgY29uc3QgbiA9IGl0ZXJhYmxlLmxlbmd0aDtcbiAgICAgICAgaWYgKHR5cGVvZiByID09PSBcInVuZGVmaW5lZFwiKSB7XG4gICAgICAgICAgICByID0gbjtcbiAgICAgICAgfVxuICAgICAgICBjb25zdCByYW5nZSA9IHRoaXMucmFuZ2Uobik7XG4gICAgICAgIGZvciAoY29uc3QgaW5kaWNlcyBvZiBVdGlsLnByb2R1Y3QociwgcmFuZ2UpKSB7XG4gICAgICAgICAgICBpZiAoaW5kaWNlcy5sZW5ndGggPT09IHIpIHtcbiAgICAgICAgICAgICAgICBjb25zdCB5OiBhbnlbXSA9IFtdO1xuICAgICAgICAgICAgICAgIGZvciAoY29uc3QgaSBvZiBpbmRpY2VzKSB7XG4gICAgICAgICAgICAgICAgICAgIHkucHVzaChpdGVyYWJsZVtpXSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHlpZWxkIHk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBzdGF0aWMqIGZyb21faXRlcmFibGUoaXRlcmFibGVzOiBhbnkpIHtcbiAgICAgICAgZm9yIChjb25zdCBpdCBvZiBpdGVyYWJsZXMpIHtcbiAgICAgICAgICAgIGZvciAoY29uc3QgZWxlbWVudCBvZiBpdCkge1xuICAgICAgICAgICAgICAgIHlpZWxkIGVsZW1lbnQ7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBzdGF0aWMgYXJyRXEoYXJyMTogYW55W10sIGFycjI6IGFueSkge1xuICAgICAgICBpZiAoYXJyMS5sZW5ndGggIT09IGFycjIubGVuZ3RoKSB7XG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH1cbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBhcnIxLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBpZiAoIShhcnIxW2ldID09PSBhcnIyW2ldKSkge1xuICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG5cbiAgICBzdGF0aWMqIGNvbWJpbmF0aW9ucyhpdGVyYWJsZTogYW55LCByOiBhbnkpIHtcbiAgICAgICAgY29uc3QgbiA9IGl0ZXJhYmxlLmxlbmd0aDtcbiAgICAgICAgY29uc3QgcmFuZ2UgPSB0aGlzLnJhbmdlKG4pO1xuICAgICAgICBmb3IgKGNvbnN0IGluZGljZXMgb2YgVXRpbC5wZXJtdXRhdGlvbnMocmFuZ2UsIHIpKSB7XG4gICAgICAgICAgICBpZiAoVXRpbC5hcnJFcShpbmRpY2VzLnNvcnQoZnVuY3Rpb24oYSwgYikge1xuICAgICAgICAgICAgICAgIHJldHVybiBhIC0gYjtcbiAgICAgICAgICAgIH0pLCBpbmRpY2VzKSkge1xuICAgICAgICAgICAgICAgIGNvbnN0IHJlczogYW55W10gPSBbXTtcbiAgICAgICAgICAgICAgICBmb3IgKGNvbnN0IGkgb2YgaW5kaWNlcykge1xuICAgICAgICAgICAgICAgICAgICByZXMucHVzaChpdGVyYWJsZVtpXSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHlpZWxkIHJlcztcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgIHN0YXRpYyogY29tYmluYXRpb25zX3dpdGhfcmVwbGFjZW1lbnQoaXRlcmFibGU6IGFueSwgcjogYW55KSB7XG4gICAgICAgIGNvbnN0IG4gPSBpdGVyYWJsZS5sZW5ndGg7XG4gICAgICAgIGNvbnN0IHJhbmdlID0gdGhpcy5yYW5nZShuKTtcbiAgICAgICAgZm9yIChjb25zdCBpbmRpY2VzIG9mIFV0aWwucHJvZHVjdChyLCByYW5nZSkpIHtcbiAgICAgICAgICAgIGlmIChVdGlsLmFyckVxKGluZGljZXMuc29ydChmdW5jdGlvbihhLCBiKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGEgLSBiO1xuICAgICAgICAgICAgfSksIGluZGljZXMpKSB7XG4gICAgICAgICAgICAgICAgY29uc3QgcmVzOiBhbnlbXSA9IFtdO1xuICAgICAgICAgICAgICAgIGZvciAoY29uc3QgaSBvZiBpbmRpY2VzKSB7XG4gICAgICAgICAgICAgICAgICAgIHJlcy5wdXNoKGl0ZXJhYmxlW2ldKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgeWllbGQgcmVzO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgc3RhdGljIHppcChhcnIxOiBhbnlbXSwgYXJyMjogYW55W10sIGZpbGx2YWx1ZTogc3RyaW5nID0gXCItXCIpIHtcbiAgICAgICAgY29uc3QgcmVzID0gYXJyMS5tYXAoZnVuY3Rpb24oZSwgaSkge1xuICAgICAgICAgICAgcmV0dXJuIFtlLCBhcnIyW2ldXTtcbiAgICAgICAgfSk7XG4gICAgICAgIHJlcy5mb3JFYWNoKCh6aXA6IGFueSkgPT4ge1xuICAgICAgICAgICAgaWYgKHppcC5pbmNsdWRlcyh1bmRlZmluZWQpKSB7XG4gICAgICAgICAgICAgICAgemlwLnNwbGljZSgxLCAxLCBmaWxsdmFsdWUpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgICAgcmV0dXJuIHJlcztcbiAgICB9XG5cbiAgICBzdGF0aWMgcmFuZ2UobjogbnVtYmVyKSB7XG4gICAgICAgIHJldHVybiBuZXcgQXJyYXkobikuZmlsbCgwKS5tYXAoKF8sIGlkeCkgPT4gaWR4KTtcbiAgICB9XG5cbiAgICBzdGF0aWMgZ2V0QXJySW5kZXgoYXJyMmQ6IGFueVtdW10sIGFycjogYW55W10pIHtcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBhcnIyZC5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgaWYgKFV0aWwuYXJyRXEoYXJyMmRbaV0sIGFycikpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gaTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdW5kZWZpbmVkO1xuICAgIH1cblxuICAgIHN0YXRpYyBnZXRTdXBlcnMoY2xzOiBhbnkpOiBhbnlbXSB7XG4gICAgICAgIGNvbnN0IHN1cGVyY2xhc3NlcyA9IFtdO1xuICAgICAgICBjb25zdCBzdXBlcmNsYXNzID0gT2JqZWN0LmdldFByb3RvdHlwZU9mKGNscyk7XG4gICAgICBcbiAgICAgICAgaWYgKHN1cGVyY2xhc3MgIT09IG51bGwgJiYgc3VwZXJjbGFzcyAhPT0gT2JqZWN0LnByb3RvdHlwZSkge1xuICAgICAgICAgICAgc3VwZXJjbGFzc2VzLnB1c2goc3VwZXJjbGFzcyk7XG4gICAgICAgICAgICBjb25zdCBwYXJlbnRTdXBlcmNsYXNzZXMgPSBVdGlsLmdldFN1cGVycyhzdXBlcmNsYXNzKTtcbiAgICAgICAgICAgIHN1cGVyY2xhc3Nlcy5wdXNoKC4uLnBhcmVudFN1cGVyY2xhc3Nlcyk7XG4gICAgICAgIH1cbiAgICAgIFxuICAgICAgICByZXR1cm4gc3VwZXJjbGFzc2VzO1xuICAgIH1cblxuICAgIHN0YXRpYyBzaHVmZmxlQXJyYXkoYXJyOiBhbnlbXSkge1xuICAgICAgICBmb3IgKGxldCBpID0gYXJyLmxlbmd0aCAtIDE7IGkgPiAwOyBpLS0pIHtcbiAgICAgICAgICAgIGNvbnN0IGogPSBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiAoaSArIDEpKTtcbiAgICAgICAgICAgIGNvbnN0IHRlbXAgPSBhcnJbaV07XG4gICAgICAgICAgICBhcnJbaV0gPSBhcnJbal07XG4gICAgICAgICAgICBhcnJbal0gPSB0ZW1wO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgc3RhdGljIGFyck11bChhcnI6IGFueVtdLCBuOiBudW1iZXIpIHtcbiAgICAgICAgY29uc3QgcmVzID0gW107XG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgbjsgaSsrKSB7XG4gICAgICAgICAgICByZXMucHVzaChhcnIpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiByZXM7XG4gICAgfVxuXG4gICAgc3RhdGljIGFzc2lnbkVsZW1lbnRzKGFycjogYW55W10sIG5ld3ZhbHM6IGFueVtdLCBzdGFydDogbnVtYmVyLCBzdGVwOiBudW1iZXIpIHtcbiAgICAgICAgbGV0IGNvdW50ID0gMDtcbiAgICAgICAgZm9yIChsZXQgaSA9IHN0YXJ0OyBpIDwgYXJyLmxlbmd0aDsgaSs9c3RlcCkge1xuICAgICAgICAgICAgYXJyW2ldID0gbmV3dmFsc1tjb3VudF07XG4gICAgICAgICAgICBjb3VudCsrO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgc3RhdGljIHNwbGl0TG9naWNTdHIoc3RyOiBzdHJpbmcpOiBhbnlbXSB7XG4gICAgICAgIGNvbnN0IHNlcCA9IFwiIFwiO1xuICAgICAgICBjb25zdCBtYXhfc3BsaXRzID0gMztcbiAgICAgICAgXG4gICAgICAgIGNvbnN0IG9yaWdfc3BsaXQgPSBzdHIuc3BsaXQoXCIgXCIsIDEwKVxuICAgICAgICBpZiAob3JpZ19zcGxpdC5sZW5ndGggPT0gMykge1xuICAgICAgICAgICAgcmV0dXJuIG9yaWdfc3BsaXQ7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBsZXQgbmV3X2l0ZW06IHN0cmluZyA9IFwiXCI7XG4gICAgICAgICAgICBmb3IgKGxldCBpID0gMjsgaSA8IG9yaWdfc3BsaXQubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgICBuZXdfaXRlbSArPSBvcmlnX3NwbGl0W2ldICsgXCIgXCI7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gW29yaWdfc3BsaXRbMF0sIG9yaWdfc3BsaXRbMV0sIG5ld19pdGVtLnNsaWNlKDAsIC0xKV07XG4gICAgICAgIH1cbiAgICB9XG59XG5cbi8vIGN1c3RvbSB2ZXJzaW9uIG9mIHRoZSBTZXQgY2xhc3Ncbi8vIG5lZWRlZCBzaW5jZSBzeW1weSByZWxpZXMgb24gaXRlbSB0dXBsZXMgd2l0aCBlcXVhbCBjb250ZW50cyBiZWluZyBtYXBwZWRcbi8vIHRvIHRoZSBzYW1lIGVudHJ5XG5jbGFzcyBIYXNoU2V0IHtcbiAgICBkaWN0OiBSZWNvcmQ8c3RyaW5nLCBhbnk+O1xuICAgIHNpemU6IG51bWJlcjtcbiAgICBzb3J0ZWRBcnI6IGFueVtdO1xuXG4gICAgY29uc3RydWN0b3IoYXJyPzogYW55W10pIHtcbiAgICAgICAgdGhpcy5zaXplID0gMDtcbiAgICAgICAgdGhpcy5kaWN0ID0ge307XG4gICAgICAgIGlmIChhcnIpIHtcbiAgICAgICAgICAgIEFycmF5LmZyb20oYXJyKS5mb3JFYWNoKChlbGVtZW50KSA9PiB7XG4gICAgICAgICAgICAgICAgdGhpcy5hZGQoZWxlbWVudCk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGNsb25lKCk6IEhhc2hTZXQge1xuICAgICAgICBjb25zdCBuZXdzZXQ6IEhhc2hTZXQgPSBuZXcgSGFzaFNldCgpO1xuICAgICAgICBmb3IgKGNvbnN0IGl0ZW0gb2YgT2JqZWN0LnZhbHVlcyh0aGlzLmRpY3QpKSB7XG4gICAgICAgICAgICBuZXdzZXQuYWRkKGl0ZW0pO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBuZXdzZXQ7XG4gICAgfVxuXG4gICAgZW5jb2RlKGl0ZW06IGFueSk6IHN0cmluZyB7XG4gICAgICAgIHJldHVybiBVdGlsLmhhc2hLZXkoaXRlbSk7XG4gICAgfVxuXG4gICAgYWRkKGl0ZW06IGFueSkge1xuICAgICAgICBjb25zdCBrZXkgPSB0aGlzLmVuY29kZShpdGVtKTtcbiAgICAgICAgaWYgKCEoa2V5IGluIHRoaXMuZGljdCkpIHtcbiAgICAgICAgICAgIHRoaXMuc2l6ZSsrO1xuICAgICAgICB9O1xuICAgICAgICB0aGlzLmRpY3Rba2V5XSA9IGl0ZW07XG4gICAgfVxuXG4gICAgYWRkQXJyKGFycjogYW55W10pIHtcbiAgICAgICAgZm9yIChjb25zdCBlIG9mIGFycikge1xuICAgICAgICAgICAgdGhpcy5hZGQoZSk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBoYXMoaXRlbTogYW55KSB7XG4gICAgICAgIHJldHVybiB0aGlzLmVuY29kZShpdGVtKSBpbiB0aGlzLmRpY3Q7XG4gICAgfVxuXG4gICAgdG9BcnJheSgpIHtcbiAgICAgICAgcmV0dXJuIE9iamVjdC52YWx1ZXModGhpcy5kaWN0KTtcbiAgICB9XG5cbiAgICAvLyBnZXQgdGhlIGhhc2hrZXkgZm9yIHRoaXMgc2V0IChlLmcuLCBpbiBhIGRpY3Rpb25hcnkpXG4gICAgaGFzaEtleSgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMudG9BcnJheSgpXG4gICAgICAgICAgICAubWFwKChlKSA9PiBVdGlsLmhhc2hLZXkoZSkpXG4gICAgICAgICAgICAuc29ydCgpXG4gICAgICAgICAgICAuam9pbihcIixcIik7XG4gICAgfVxuXG4gICAgaXNFbXB0eSgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuc2l6ZSA9PT0gMDtcbiAgICB9XG5cbiAgICByZW1vdmUoaXRlbTogYW55KSB7XG4gICAgICAgIHRoaXMuc2l6ZS0tO1xuICAgICAgICBkZWxldGUgdGhpcy5kaWN0W3RoaXMuZW5jb2RlKGl0ZW0pXTtcbiAgICB9XG5cbiAgICBnZXQoa2V5OiBhbnkpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuZGljdFtVdGlsLmhhc2hLZXkoa2V5KV07XG4gICAgfVxuXG4gICAgc2V0KGtleTogYW55LCB2YWw6IGFueSkge1xuICAgICAgICB0aGlzLmRpY3RbVXRpbC5oYXNoS2V5KGtleSldID0gdmFsO1xuICAgIH1cblxuICAgIHNvcnQoa2V5ZnVuYzogYW55ID0gKChhOiBhbnksIGI6IGFueSkgPT4gYSAtIGIpLCByZXZlcnNlOiBib29sZWFuID0gdHJ1ZSkge1xuICAgICAgICB0aGlzLnNvcnRlZEFyciA9IHRoaXMudG9BcnJheSgpO1xuICAgICAgICB0aGlzLnNvcnRlZEFyci5zb3J0KGtleWZ1bmMpO1xuICAgICAgICBpZiAocmV2ZXJzZSkge1xuICAgICAgICAgICAgdGhpcy5zb3J0ZWRBcnIucmV2ZXJzZSgpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcG9wKCkge1xuICAgICAgICB0aGlzLnNvcnQoKTsgLy8gISEhIHNsb3cgYnV0IEkgZG9uJ3Qgc2VlIGEgd29yayBhcm91bmRcbiAgICAgICAgaWYgKHRoaXMuc29ydGVkQXJyLmxlbmd0aCA+PSAxKSB7XG4gICAgICAgICAgICBjb25zdCB0ZW1wID0gdGhpcy5zb3J0ZWRBcnJbdGhpcy5zb3J0ZWRBcnIubGVuZ3RoIC0gMV07XG4gICAgICAgICAgICB0aGlzLnJlbW92ZSh0ZW1wKTtcbiAgICAgICAgICAgIHJldHVybiB0ZW1wO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGRpZmZlcmVuY2Uob3RoZXI6IEhhc2hTZXQpIHtcbiAgICAgICAgY29uc3QgcmVzID0gbmV3IEhhc2hTZXQoKTtcbiAgICAgICAgZm9yIChjb25zdCBpIG9mIHRoaXMudG9BcnJheSgpKSB7XG4gICAgICAgICAgICBpZiAoIShvdGhlci5oYXMoaSkpKSB7XG4gICAgICAgICAgICAgICAgcmVzLmFkZChpKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gcmVzO1xuICAgIH1cblxuICAgIGludGVyc2VjdHMob3RoZXI6IEhhc2hTZXQpIHtcbiAgICAgICAgZm9yIChjb25zdCBpIG9mIHRoaXMudG9BcnJheSgpKSB7XG4gICAgICAgICAgICBpZiAob3RoZXIuaGFzKGkpKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbn1cblxuLy8gYSBoYXNoZGljdCBjbGFzcyByZXBsYWNpbmcgdGhlIGRpY3QgY2xhc3MgaW4gcHl0aG9uXG5jbGFzcyBIYXNoRGljdCB7XG4gICAgc2l6ZTogbnVtYmVyO1xuICAgIGRpY3Q6IFJlY29yZDxhbnksIGFueT47XG5cbiAgICBjb25zdHJ1Y3RvcihkOiBSZWNvcmQ8YW55LCBhbnk+ID0ge30pIHtcbiAgICAgICAgdGhpcy5zaXplID0gMDtcbiAgICAgICAgdGhpcy5kaWN0ID0ge307XG4gICAgICAgIGZvciAoY29uc3QgaXRlbSBvZiBPYmplY3QuZW50cmllcyhkKSkge1xuICAgICAgICAgICAgdGhpcy5kaWN0W1V0aWwuaGFzaEtleShpdGVtWzBdKV0gPSBbaXRlbVswXSwgaXRlbVsxXV07XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBjbG9uZSgpIHtcbiAgICAgICAgcmV0dXJuIG5ldyBIYXNoRGljdCh0aGlzLmRpY3QpO1xuICAgIH1cblxuICAgIHJlbW92ZShpdGVtOiBhbnkpIHtcbiAgICAgICAgdGhpcy5zaXplLS07XG4gICAgICAgIGRlbGV0ZSB0aGlzLmRpY3RbVXRpbC5oYXNoS2V5KGl0ZW0pXTtcbiAgICB9XG5cbiAgICBzZXRkZWZhdWx0KGtleTogYW55LCB2YWx1ZTogYW55KSB7XG4gICAgICAgIGlmICh0aGlzLmhhcyhrZXkpKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5nZXQoa2V5KTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMuYWRkKGtleSwgdmFsdWUpO1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuZ2V0KGtleSk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBnZXQoa2V5OiBhbnksIGRlZjogYW55ID0gdW5kZWZpbmVkKTogYW55IHtcbiAgICAgICAgY29uc3QgaGFzaCA9IFV0aWwuaGFzaEtleShrZXkpO1xuICAgICAgICBpZiAoaGFzaCBpbiB0aGlzLmRpY3QpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmRpY3RbaGFzaF1bMV07XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGRlZjtcbiAgICB9XG5cbiAgICBoYXMoa2V5OiBhbnkpOiBib29sZWFuIHtcbiAgICAgICAgY29uc3QgaGFzaEtleSA9IFV0aWwuaGFzaEtleShrZXkpO1xuICAgICAgICByZXR1cm4gaGFzaEtleSBpbiB0aGlzLmRpY3Q7XG4gICAgfVxuXG4gICAgYWRkKGtleTogYW55LCB2YWx1ZTogYW55KSB7XG4gICAgICAgIGNvbnN0IGtleUhhc2ggPSBVdGlsLmhhc2hLZXkoa2V5KTtcbiAgICAgICAgaWYgKCEoa2V5SGFzaCBpbiBPYmplY3Qua2V5cyh0aGlzLmRpY3QpKSkge1xuICAgICAgICAgICAgdGhpcy5zaXplKys7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5kaWN0W2tleUhhc2hdID0gW2tleSwgdmFsdWVdO1xuICAgIH1cblxuICAgIGtleXMoKSB7XG4gICAgICAgIGNvbnN0IHZhbHMgPSBPYmplY3QudmFsdWVzKHRoaXMuZGljdCk7XG4gICAgICAgIHJldHVybiB2YWxzLm1hcCgoZSkgPT4gZVswXSk7XG4gICAgfVxuXG4gICAgdmFsdWVzKCkge1xuICAgICAgICBjb25zdCB2YWxzID0gT2JqZWN0LnZhbHVlcyh0aGlzLmRpY3QpO1xuICAgICAgICByZXR1cm4gdmFscy5tYXAoKGUpID0+IGVbMV0pO1xuICAgIH1cblxuICAgIGVudHJpZXMoKSB7XG4gICAgICAgIHJldHVybiBPYmplY3QudmFsdWVzKHRoaXMuZGljdCk7XG4gICAgfVxuXG4gICAgYWRkQXJyKGFycjogYW55W10pIHtcbiAgICAgICAgY29uc3Qga2V5SGFzaCA9IFV0aWwuaGFzaEtleShhcnJbMF0pO1xuICAgICAgICB0aGlzLmRpY3Rba2V5SGFzaF0gPSBhcnI7XG4gICAgfVxuXG4gICAgZGVsZXRlKGtleTogYW55KSB7XG4gICAgICAgIGNvbnN0IGtleWhhc2ggPSBVdGlsLmhhc2hLZXkoa2V5KTtcbiAgICAgICAgaWYgKGtleWhhc2ggaW4gdGhpcy5kaWN0KSB7XG4gICAgICAgICAgICB0aGlzLnNpemUtLTtcbiAgICAgICAgICAgIGRlbGV0ZSB0aGlzLmRpY3Rba2V5aGFzaF07XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBtZXJnZShvdGhlcjogSGFzaERpY3QpIHtcbiAgICAgICAgZm9yIChjb25zdCBpdGVtIG9mIG90aGVyLmVudHJpZXMoKSkge1xuICAgICAgICAgICAgdGhpcy5hZGQoaXRlbVswXSwgaXRlbVsxXSk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBjb3B5KCkge1xuICAgICAgICBjb25zdCByZXM6IEhhc2hEaWN0ID0gbmV3IEhhc2hEaWN0KCk7XG4gICAgICAgIGZvciAoY29uc3QgaXRlbSBvZiB0aGlzLmVudHJpZXMoKSkge1xuICAgICAgICAgICAgcmVzLmFkZChpdGVtWzBdLCBpdGVtWzFdKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gcmVzO1xuICAgIH1cblxuICAgIGlzU2FtZShvdGhlcjogSGFzaERpY3QpIHtcbiAgICAgICAgY29uc3QgYXJyMSA9IHRoaXMuZW50cmllcygpLnNvcnQoKTtcbiAgICAgICAgY29uc3QgYXJyMiA9IG90aGVyLmVudHJpZXMoKS5zb3J0KCk7XG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgYXJyMS5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgaWYgKCEoVXRpbC5hcnJFcShhcnIxW2ldLCBhcnIyW2ldKSkpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuXG4gICAgZmFjdG9yc1RvU3RyaW5nKCkge1xuICAgICAgICBsZXQgbnVtZXJhdG9yID0gXCJcIjtcbiAgICAgICAgbGV0IGRlbm9taW5hdG9yID0gXCJcIjtcbiAgICAgICAgZm9yIChjb25zdCBbZmFjdG9yLCBleHBdIG9mIHRoaXMuZW50cmllcygpKSB7XG4gICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IE1hdGguYWJzKGV4cCk7IGkrKykge1xuICAgICAgICAgICAgICAgIGlmIChleHAgPCAwKSB7XG4gICAgICAgICAgICAgICAgICAgIGRlbm9taW5hdG9yICs9IChmYWN0b3IudG9TdHJpbmcoKSArIFwiKlwiKVxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIG51bWVyYXRvciArPSAoZmFjdG9yLnRvU3RyaW5nKCkgKyBcIipcIilcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGRlbm9taW5hdG9yLmxlbmd0aCA9PSAwKSB7XG4gICAgICAgICAgICByZXR1cm4gbnVtZXJhdG9yLnNsaWNlKDAsIC0xKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiBudW1lcmF0b3Iuc2xpY2UoMCwgLTEpICsgXCIvXCIgKyBkZW5vbWluYXRvci5zbGljZSgwLCAtMSk7XG4gICAgICAgIH1cbiAgICB9XG59XG5cblxuLy8gc3ltcHkgb2Z0ZW4gdXNlcyBkZWZhdWx0ZGljdChzZXQpIHdoaWNoIGlzIG5vdCBhdmFpbGFibGUgaW4gdHNcbi8vIHdlIGNyZWF0ZSBhIHJlcGxhY2VtZW50IGRpY3Rpb25hcnkgY2xhc3Mgd2hpY2ggcmV0dXJucyBhbiBlbXB0eSBzZXRcbi8vIGlmIHRoZSBrZXkgdXNlZCBpcyBub3QgaW4gdGhlIGRpY3Rpb25hcnlcbmNsYXNzIFNldERlZmF1bHREaWN0IGV4dGVuZHMgSGFzaERpY3Qge1xuICAgIGNvbnN0cnVjdG9yKCkge1xuICAgICAgICBzdXBlcigpO1xuICAgIH1cblxuICAgIGdldChrZXk6IGFueSkge1xuICAgICAgICBjb25zdCBrZXlIYXNoID0gVXRpbC5oYXNoS2V5KGtleSk7XG4gICAgICAgIGlmIChrZXlIYXNoIGluIHRoaXMuZGljdCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuZGljdFtrZXlIYXNoXVsxXTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gbmV3IEhhc2hTZXQoKTtcbiAgICB9XG59XG5cbmNsYXNzIEludERlZmF1bHREaWN0IGV4dGVuZHMgSGFzaERpY3Qge1xuICAgIGNvbnN0cnVjdG9yKCkge1xuICAgICAgICBzdXBlcigpO1xuICAgIH1cblxuICAgIGluY3JlbWVudChrZXk6IGFueSwgdmFsOiBhbnkpIHtcbiAgICAgICAgY29uc3Qga2V5SGFzaCA9IFV0aWwuaGFzaEtleShrZXkpO1xuICAgICAgICBpZiAoa2V5SGFzaCBpbiB0aGlzLmRpY3QpIHtcbiAgICAgICAgICAgIHRoaXMuZGljdFtrZXlIYXNoXSArPSB2YWw7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aGlzLmRpY3Rba2V5SGFzaF0gPSAwO1xuICAgICAgICAgICAgdGhpcy5kaWN0W2tleUhhc2hdICs9IHZhbDtcbiAgICAgICAgfVxuICAgIH1cbn1cblxuY2xhc3MgQXJyRGVmYXVsdERpY3QgZXh0ZW5kcyBIYXNoRGljdCB7XG4gICAgY29uc3RydWN0b3IoKSB7XG4gICAgICAgIHN1cGVyKCk7XG4gICAgfVxuXG4gICAgZ2V0KGtleTogYW55KSB7XG4gICAgICAgIGNvbnN0IGtleUhhc2ggPSBVdGlsLmhhc2hLZXkoa2V5KTtcbiAgICAgICAgaWYgKGtleUhhc2ggaW4gdGhpcy5kaWN0KSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5kaWN0W2tleUhhc2hdWzFdO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBbXTtcbiAgICB9XG59XG5cblxuLy8gYW4gaW1wbGljYXRpb24gY2xhc3MgdXNlZCBhcyBhbiBhbHRlcm5hdGl2ZSB0byB0dXBsZXMgaW4gc3ltcHlcbmNsYXNzIEltcGxpY2F0aW9uIHtcbiAgICBwO1xuICAgIHE7XG5cbiAgICBjb25zdHJ1Y3RvcihwOiBhbnksIHE6IGFueSkge1xuICAgICAgICB0aGlzLnAgPSBwO1xuICAgICAgICB0aGlzLnEgPSBxO1xuICAgIH1cblxuICAgIGhhc2hLZXkoKSB7XG4gICAgICAgIHJldHVybiAodGhpcy5wIGFzIHN0cmluZykgKyAodGhpcy5xIGFzIHN0cmluZyk7XG4gICAgfVxufVxuXG5cbi8vIGFuIExSVSBjYWNoZSBpbXBsZW1lbnRhdGlvbiB1c2VkIGZvciBjYWNoZS50c1xuXG5pbnRlcmZhY2UgTm9kZSB7XG4gICAga2V5OiBhbnk7XG4gICAgdmFsdWU6IGFueTtcbiAgICBwcmV2OiBhbnk7XG4gICAgbmV4dDogYW55O1xufVxuXG5jbGFzcyBMUlVDYWNoZSB7XG4gICAgY2FwYWNpdHk6IG51bWJlcjtcbiAgICBtYXA6IEhhc2hEaWN0O1xuICAgIGhlYWQ6IGFueTtcbiAgICB0YWlsOiBhbnk7XG5cbiAgICBjb25zdHJ1Y3RvcihjYXBhY2l0eTogbnVtYmVyKSB7XG4gICAgICAgIHRoaXMuY2FwYWNpdHkgPSBjYXBhY2l0eTtcbiAgICAgICAgdGhpcy5tYXAgPSBuZXcgSGFzaERpY3QoKTtcblxuICAgICAgICAvLyB0aGVzZSBhcmUgYm91bmRhcmllcyBmb3IgdGhlIGRvdWJsZSBsaW5rZWQgbGlzdFxuICAgICAgICB0aGlzLmhlYWQgPSB7fTtcbiAgICAgICAgdGhpcy50YWlsID0ge307XG5cbiAgICAgICAgdGhpcy5oZWFkLm5leHQgPSB0aGlzLmhlYWQ7XG4gICAgICAgIHRoaXMudGFpbC5wcmV2ID0gdGhpcy5oZWFkO1xuICAgIH1cblxuICAgIGdldChrZXk6IGFueSkge1xuICAgICAgICBpZiAodGhpcy5tYXAuaGFzKGtleSkpIHtcbiAgICAgICAgICAgIC8vIHJlbW92ZSBlbGVtZW50IGZyb20gdGhlIGN1cnJlbnQgcG9zaXRpb25cbiAgICAgICAgICAgIGNvbnN0IGMgPSB0aGlzLm1hcC5nZXQoa2V5KTtcbiAgICAgICAgICAgIGMucHJldi5uZXh0ID0gYy5uZXh0O1xuICAgICAgICAgICAgYy5uZXh0LnByZXYgPSBjLnByZXY7XG5cbiAgICAgICAgICAgIHRoaXMudGFpbC5wcmV2Lm5leHQgPSBjOyAvLyBpbnNlcnQgYWZ0ZXIgbGFzdCBlbGVtZW50XG4gICAgICAgICAgICBjLnByZXYgPSB0aGlzLnRhaWwucHJldjtcbiAgICAgICAgICAgIGMubmV4dCA9IHRoaXMudGFpbDtcbiAgICAgICAgICAgIHRoaXMudGFpbC5wcmV2ID0gYztcblxuICAgICAgICAgICAgcmV0dXJuIGMudmFsdWU7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gdW5kZWZpbmVkOyAvLyBpbnZhbGlkIGtleVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgcHV0KGtleTogYW55LCB2YWx1ZTogYW55KSB7XG4gICAgICAgIGlmICh0eXBlb2YgdGhpcy5nZXQoa2V5KSAhPT0gXCJ1bmRlZmluZWRcIikgeyAvLyB0aGUga2V5IGlzIGludmFsaWRcbiAgICAgICAgICAgIHRoaXMudGFpbC5wcmV2LnZhbHVlID0gdmFsdWU7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAvLyBjaGVjayBmb3IgY2FwYWNpdHlcbiAgICAgICAgICAgIGlmICh0aGlzLm1hcC5zaXplID09PSB0aGlzLmNhcGFjaXR5KSB7XG4gICAgICAgICAgICAgICAgdGhpcy5tYXAuZGVsZXRlKHRoaXMuaGVhZC5uZXh0LmtleSk7IC8vIGRlbGV0ZSBmaXJzdCBlbGVtZW50XG4gICAgICAgICAgICAgICAgdGhpcy5oZWFkLm5leHQgPSB0aGlzLmhlYWQubmV4dC5uZXh0OyAvLyByZXBsYWNlIHdpdGggbmV4dFxuICAgICAgICAgICAgICAgIHRoaXMuaGVhZC5uZXh0LnByZXYgPSB0aGlzLmhlYWQ7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgY29uc3QgbmV3Tm9kZTogTm9kZSA9IHtcbiAgICAgICAgICAgIHZhbHVlLFxuICAgICAgICAgICAga2V5LFxuICAgICAgICAgICAgcHJldjogbnVsbCxcbiAgICAgICAgICAgIG5leHQ6IG51bGwsXG4gICAgICAgIH07IC8vIGVhY2ggbm9kZSBpcyBhIGhhc2ggZW50cnlcblxuICAgICAgICAvLyB3aGVuIGFkZGluZyBhIG5ldyBub2RlLCB3ZSBuZWVkIHRvIHVwZGF0ZSBib3RoIG1hcCBhbmQgRExMXG4gICAgICAgIHRoaXMubWFwLmFkZChrZXksIG5ld05vZGUpOyAvLyBhZGQgdGhlIGN1cnJlbnQgbm9kZVxuICAgICAgICB0aGlzLnRhaWwucHJldi5uZXh0ID0gbmV3Tm9kZTsgLy8gYWRkIG5vZGUgdG8gdGhlIGVuZFxuICAgICAgICBuZXdOb2RlLnByZXYgPSB0aGlzLnRhaWwucHJldjtcbiAgICAgICAgbmV3Tm9kZS5uZXh0ID0gdGhpcy50YWlsO1xuICAgICAgICB0aGlzLnRhaWwucHJldiA9IG5ld05vZGU7XG4gICAgfVxufVxuXG5jbGFzcyBJdGVyYXRvciB7XG4gICAgYXJyOiBhbnlbXTtcbiAgICBjb3VudGVyO1xuXG4gICAgY29uc3RydWN0b3IoYXJyOiBhbnlbXSkge1xuICAgICAgICB0aGlzLmFyciA9IGFycjtcbiAgICAgICAgdGhpcy5jb3VudGVyID0gMDtcbiAgICB9XG5cbiAgICBuZXh0KCkge1xuICAgICAgICBpZiAodGhpcy5jb3VudGVyID49IHRoaXMuYXJyLmxlbmd0aCkge1xuICAgICAgICAgICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLmNvdW50ZXIrKztcbiAgICAgICAgcmV0dXJuIHRoaXMuYXJyW3RoaXMuY291bnRlci0xXTtcbiAgICB9XG59XG5cbi8vIG1peGluIGNsYXNzIHVzZWQgdG8gcmVwbGljYXRlIG11bHRpcGxlIGluaGVyaXRhbmNlXG5cbmNsYXNzIE1peGluQnVpbGRlciB7XG4gICAgc3VwZXJjbGFzcztcbiAgICBjb25zdHJ1Y3RvcihzdXBlcmNsYXNzOiBhbnkpIHtcbiAgICAgICAgdGhpcy5zdXBlcmNsYXNzID0gc3VwZXJjbGFzcztcbiAgICB9XG4gICAgd2l0aCguLi5taXhpbnM6IGFueVtdKSB7XG4gICAgICAgIHJldHVybiBtaXhpbnMucmVkdWNlKChjLCBtaXhpbikgPT4gbWl4aW4oYyksIHRoaXMuc3VwZXJjbGFzcyk7XG4gICAgfVxufVxuXG5jbGFzcyBiYXNlIHt9XG5cbmNvbnN0IG1peCA9IChzdXBlcmNsYXNzOiBhbnkpID0+IG5ldyBNaXhpbkJ1aWxkZXIoc3VwZXJjbGFzcyk7XG5cblxuZXhwb3J0IHtVdGlsLCBIYXNoU2V0LCBTZXREZWZhdWx0RGljdCwgSGFzaERpY3QsIEltcGxpY2F0aW9uLCBMUlVDYWNoZSwgSXRlcmF0b3IsIEludERlZmF1bHREaWN0LCBBcnJEZWZhdWx0RGljdCwgbWl4LCBiYXNlfTtcblxuIiwgIi8qIGVzbGludC1kaXNhYmxlIG5ldy1jYXAgKi9cbi8qIGVzbGludC1kaXNhYmxlIG5vLXVudXNlZC12YXJzICovXG4vKlxuXG5Ob3RhYmxlIGNobmFnZXMgbWFkZSAoV0IgJiBHTSk6XG4tIE51bGwgaXMgYmVpbmcgdXNlZCBhcyBhIHRoaXJkIGJvb2xlYW4gdmFsdWUgaW5zdGVhZCBvZiAnbm9uZSdcbi0gQXJyYXlzIGFyZSBiZWluZyB1c2VkIGluc3RlYWQgb2YgdHVwbGVzXG4tIFRoZSBtZXRob2RzIGhhc2hLZXkoKSBhbmQgdG9TdHJpbmcoKSBhcmUgYWRkZWQgdG8gTG9naWMgZm9yIGhhc2hpbmcuIFRoZVxuICBzdGF0aWMgbWV0aG9kIGhhc2hLZXkoKSBpcyBhbHNvIGFkZGVkIHRvIExvZ2ljIGFuZCBoYXNoZXMgZGVwZW5kaW5nIG9uIHRoZSBpbnB1dC5cbi0gVGhlIGFycmF5IGFyZ3MgaW4gdGhlIEFuZE9yX0Jhc2UgY29uc3RydWN0b3IgaXMgbm90IHNvcnRlZCBvciBwdXQgaW4gYSBzZXRcbiAgc2luY2Ugd2UgZGlkJ3Qgc2VlIHdoeSB0aGlzIHdvdWxkIGJlIG5lY2VzYXJ5XG4tIEEgY29uc3RydWN0b3IgaXMgYWRkZWQgdG8gdGhlIGxvZ2ljIGNsYXNzLCB3aGljaCBpcyB1c2VkIGJ5IExvZ2ljIGFuZCBpdHNcbiAgc3ViY2xhc3NlcyAoQW5kT3JfQmFzZSwgQW5kLCBPciwgTm90KVxuLSBJbiB0aGUgZmxhdHRlbiBtZXRob2Qgb2YgQW5kT3JfQmFzZSB3ZSByZW1vdmVkIHRoZSB0cnkgY2F0Y2ggYW5kIGNoYW5nZWQgdGhlXG4gIHdoaWxlIGxvb3AgdG8gZGVwZW5kIG9uIHRoZSBsZWdudGggb2YgdGhlIGFyZ3MgYXJyYXlcbi0gQWRkZWQgZXhwYW5kKCkgYW5kIGV2YWxfcHJvcGFnYXRlX25vdCBhcyBhYnN0cmFjdCBtZXRob2RzIHRvIHRoZSBMb2dpYyBjbGFzc1xuLSBBZGRlZCBzdGF0aWMgTmV3IG1ldGhvZHMgdG8gTm90LCBBbmQsIGFuZCBPciB3aGljaCBmdW5jdGlvbiBhcyBjb25zdHJ1Y3RvcnNcbi0gUmVwbGFjZW1kIG5vcm1hbCBib29sZWFucyB3aXRoIExvZ2ljLlRydWUgYW5kIExvZ2ljLkZhbHNlIHNpbmNlIGl0IGlzIHNvbWV0aW1lc1xubmVjZXNhcnkgdG8gZmluZCBpZiBhIGdpdmVuIGFyZ3VtZW5ldCBpcyBhIGJvb2xlYW5cbi0gQWRkZWQgc29tZSB2MiBtZXRob2RzIHdoaWNoIHJldHVybiB0cnVlLCBmYWxzZSwgYW5kIHVuZGVmaW5lZCwgd2hpY2ggd29ya3NcbiAgd2l0aCB0aGUgcmVzdCBvZiB0aGUgY29kZVxuXG4qL1xuXG5pbXBvcnQge1V0aWwsIEhhc2hTZXR9IGZyb20gXCIuL3V0aWxpdHlcIjtcblxuXG5mdW5jdGlvbiBfdG9yZihhcmdzOiBhbnlbXSk6IExvZ2ljIHwgbnVsbCB7XG4gICAgLyogUmV0dXJuIFRydWUgaWYgYWxsIGFyZ3MgYXJlIFRydWUsIEZhbHNlIGlmIHRoZXlcbiAgICBhcmUgYWxsIEZhbHNlLCBlbHNlIE5vbmVcbiAgICA+Pj4gZnJvbSBzeW1weS5jb3JlLmxvZ2ljIGltcG9ydCBfdG9yZlxuICAgID4+PiBfdG9yZigoVHJ1ZSwgVHJ1ZSkpXG4gICAgVHJ1ZVxuICAgID4+PiBfdG9yZigoRmFsc2UsIEZhbHNlKSlcbiAgICBGYWxzZVxuICAgID4+PiBfdG9yZigoVHJ1ZSwgRmFsc2UpKVxuICAgICovXG4gICAgbGV0IHNhd1QgPSBMb2dpYy5GYWxzZTtcbiAgICBsZXQgc2F3RiA9IExvZ2ljLkZhbHNlO1xuICAgIGZvciAoY29uc3QgYSBvZiBhcmdzKSB7XG4gICAgICAgIGlmIChhID09PSBMb2dpYy5UcnVlKSB7XG4gICAgICAgICAgICBpZiAoc2F3RiBpbnN0YW5jZW9mIFRydWUpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHNhd1QgPSBMb2dpYy5UcnVlO1xuICAgICAgICB9IGVsc2UgaWYgKGEgPT09IExvZ2ljLkZhbHNlKSB7XG4gICAgICAgICAgICBpZiAoc2F3VCBpbnN0YW5jZW9mIFRydWUpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHNhd0YgPSBMb2dpYy5UcnVlO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIHNhd1Q7XG59XG5cbmZ1bmN0aW9uIF9mdXp6eV9ncm91cChhcmdzOiBhbnlbXSwgcXVpY2tfZXhpdCA9IExvZ2ljLkZhbHNlKTogTG9naWMgfCBudWxsIHtcbiAgICAvKiBSZXR1cm4gVHJ1ZSBpZiBhbGwgYXJncyBhcmUgVHJ1ZSwgTm9uZSBpZiB0aGVyZSBpcyBhbnkgTm9uZSBlbHNlIEZhbHNlXG4gICAgdW5sZXNzIGBgcXVpY2tfZXhpdGBgIGlzIFRydWUgKHRoZW4gcmV0dXJuIE5vbmUgYXMgc29vbiBhcyBhIHNlY29uZCBGYWxzZVxuICAgIGlzIHNlZW4uXG4gICAgIGBgX2Z1enp5X2dyb3VwYGAgaXMgbGlrZSBgYGZ1enp5X2FuZGBgIGV4Y2VwdCB0aGF0IGl0IGlzIG1vcmVcbiAgICBjb25zZXJ2YXRpdmUgaW4gcmV0dXJuaW5nIGEgRmFsc2UsIHdhaXRpbmcgdG8gbWFrZSBzdXJlIHRoYXQgYWxsXG4gICAgYXJndW1lbnRzIGFyZSBUcnVlIG9yIEZhbHNlIGFuZCByZXR1cm5pbmcgTm9uZSBpZiBhbnkgYXJndW1lbnRzIGFyZVxuICAgIE5vbmUuIEl0IGFsc28gaGFzIHRoZSBjYXBhYmlsaXR5IG9mIHBlcm1pdGluZyBvbmx5IGEgc2luZ2xlIEZhbHNlIGFuZFxuICAgIHJldHVybmluZyBOb25lIGlmIG1vcmUgdGhhbiBvbmUgaXMgc2Vlbi4gRm9yIGV4YW1wbGUsIHRoZSBwcmVzZW5jZSBvZiBhXG4gICAgc2luZ2xlIHRyYW5zY2VuZGVudGFsIGFtb25nc3QgcmF0aW9uYWxzIHdvdWxkIGluZGljYXRlIHRoYXQgdGhlIGdyb3VwIGlzXG4gICAgbm8gbG9uZ2VyIHJhdGlvbmFsOyBidXQgYSBzZWNvbmQgdHJhbnNjZW5kZW50YWwgaW4gdGhlIGdyb3VwIHdvdWxkIG1ha2UgdGhlXG4gICAgZGV0ZXJtaW5hdGlvbiBpbXBvc3NpYmxlLlxuICAgIEV4YW1wbGVzXG4gICAgPT09PT09PT1cbiAgICA+Pj4gZnJvbSBzeW1weS5jb3JlLmxvZ2ljIGltcG9ydCBfZnV6enlfZ3JvdXBcbiAgICBCeSBkZWZhdWx0LCBtdWx0aXBsZSBGYWxzZXMgbWVhbiB0aGUgZ3JvdXAgaXMgYnJva2VuOlxuICAgID4+PiBfZnV6enlfZ3JvdXAoW0ZhbHNlLCBGYWxzZSwgVHJ1ZV0pXG4gICAgRmFsc2VcbiAgICBJZiBtdWx0aXBsZSBGYWxzZXMgbWVhbiB0aGUgZ3JvdXAgc3RhdHVzIGlzIHVua25vd24gdGhlbiBzZXRcbiAgICBgcXVpY2tfZXhpdGAgdG8gVHJ1ZSBzbyBOb25lIGNhbiBiZSByZXR1cm5lZCB3aGVuIHRoZSAybmQgRmFsc2UgaXMgc2VlbjpcbiAgICA+Pj4gX2Z1enp5X2dyb3VwKFtGYWxzZSwgRmFsc2UsIFRydWVdLCBxdWlja19leGl0PVRydWUpXG4gICAgQnV0IGlmIG9ubHkgYSBzaW5nbGUgRmFsc2UgaXMgc2VlbiB0aGVuIHRoZSBncm91cCBpcyBrbm93biB0b1xuICAgIGJlIGJyb2tlbjpcbiAgICA+Pj4gX2Z1enp5X2dyb3VwKFtGYWxzZSwgVHJ1ZSwgVHJ1ZV0sIHF1aWNrX2V4aXQ9VHJ1ZSlcbiAgICBGYWxzZVxuICAgICovXG4gICAgbGV0IHNhd19vdGhlciA9IExvZ2ljLkZhbHNlO1xuICAgIGZvciAoY29uc3QgYSBvZiBhcmdzKSB7XG4gICAgICAgIGlmIChhID09PSBMb2dpYy5UcnVlKSB7XG4gICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgfSBpZiAoYSA9PSBudWxsKSB7XG4gICAgICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgICAgfSBpZiAocXVpY2tfZXhpdCBpbnN0YW5jZW9mIFRydWUgJiYgc2F3X290aGVyIGluc3RhbmNlb2YgVHJ1ZSkge1xuICAgICAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICAgIH1cbiAgICAgICAgc2F3X290aGVyID0gTG9naWMuVHJ1ZTtcbiAgICB9XG4gICAgaWYgKHNhd19vdGhlciBpbnN0YW5jZW9mIFRydWUpIHtcbiAgICAgICAgcmV0dXJuIExvZ2ljLkZhbHNlO1xuICAgIH1cbiAgICByZXR1cm4gTG9naWMuVHJ1ZTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIF9mdXp6eV9ncm91cHYyKGFyZ3M6IGFueVtdKSB7XG4gICAgY29uc3QgcmVzID0gX2Z1enp5X2dyb3VwKGFyZ3MpO1xuICAgIGlmIChyZXMgPT09IExvZ2ljLlRydWUpIHtcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgfSBlbHNlIGlmIChyZXMgPT09IExvZ2ljLkZhbHNlKSB7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gICAgcmV0dXJuIHVuZGVmaW5lZDtcbn1cblxuXG5mdW5jdGlvbiBmdXp6eV9ib29sKHg6IExvZ2ljKTogTG9naWMgfCBudWxsIHtcbiAgICAvKiBSZXR1cm4gVHJ1ZSwgRmFsc2Ugb3IgTm9uZSBhY2NvcmRpbmcgdG8geC5cbiAgICBXaGVyZWFzIGJvb2woeCkgcmV0dXJucyBUcnVlIG9yIEZhbHNlLCBmdXp6eV9ib29sIGFsbG93c1xuICAgIGZvciB0aGUgTm9uZSB2YWx1ZSBhbmQgbm9uIC0gZmFsc2UgdmFsdWVzKHdoaWNoIGJlY29tZSBOb25lKSwgdG9vLlxuICAgIEV4YW1wbGVzXG4gICAgPT09PT09PT1cbiAgICA+Pj4gZnJvbSBzeW1weS5jb3JlLmxvZ2ljIGltcG9ydCBmdXp6eV9ib29sXG4gICAgPj4+IGZyb20gc3ltcHkuYWJjIGltcG9ydCB4XG4gICAgPj4+IGZ1enp5X2Jvb2woeCksIGZ1enp5X2Jvb2woTm9uZSlcbiAgICAoTm9uZSwgTm9uZSlcbiAgICA+Pj4gYm9vbCh4KSwgYm9vbChOb25lKVxuICAgICAgICAoVHJ1ZSwgRmFsc2UpXG4gICAgKi9cbiAgICBpZiAoeCA9PSBudWxsKSB7XG4gICAgICAgIHJldHVybiBudWxsO1xuICAgIH1cbiAgICBpZiAoeCBpbnN0YW5jZW9mIFRydWUpIHtcbiAgICAgICAgcmV0dXJuIExvZ2ljLlRydWU7XG4gICAgfVxuICAgIGlmICh4IGluc3RhbmNlb2YgRmFsc2UpIHtcbiAgICAgICAgcmV0dXJuIExvZ2ljLkZhbHNlO1xuICAgIH1cbn1cblxuZnVuY3Rpb24gZnV6enlfYm9vbF92Mih4OiBib29sZWFuKSB7XG4gICAgLyogUmV0dXJuIFRydWUsIEZhbHNlIG9yIE5vbmUgYWNjb3JkaW5nIHRvIHguXG4gICAgV2hlcmVhcyBib29sKHgpIHJldHVybnMgVHJ1ZSBvciBGYWxzZSwgZnV6enlfYm9vbCBhbGxvd3NcbiAgICBmb3IgdGhlIE5vbmUgdmFsdWUgYW5kIG5vbiAtIGZhbHNlIHZhbHVlcyh3aGljaCBiZWNvbWUgTm9uZSksIHRvby5cbiAgICBFeGFtcGxlc1xuICAgID09PT09PT09XG4gICAgPj4+IGZyb20gc3ltcHkuY29yZS5sb2dpYyBpbXBvcnQgZnV6enlfYm9vbFxuICAgID4+PiBmcm9tIHN5bXB5LmFiYyBpbXBvcnQgeFxuICAgID4+PiBmdXp6eV9ib29sKHgpLCBmdXp6eV9ib29sKE5vbmUpXG4gICAgKE5vbmUsIE5vbmUpXG4gICAgPj4+IGJvb2woeCksIGJvb2woTm9uZSlcbiAgICAgICAgKFRydWUsIEZhbHNlKVxuICAgICovXG4gICAgaWYgKHR5cGVvZiB4ID09PSBcInVuZGVmaW5lZFwiKSB7XG4gICAgICAgIHJldHVybiBudWxsO1xuICAgIH1cbiAgICBpZiAoeCA9PT0gdHJ1ZSkge1xuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG4gICAgaWYgKHggPT09IGZhbHNlKSB7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG59XG5cbmZ1bmN0aW9uIGZ1enp5X2FuZChhcmdzOiBhbnlbXSk6IExvZ2ljIHwgbnVsbCB7XG4gICAgLyogUmV0dXJuIFRydWUgKGFsbCBUcnVlKSwgRmFsc2UgKGFueSBGYWxzZSkgb3IgTm9uZS5cbiAgICBFeGFtcGxlc1xuICAgID09PT09PT09XG4gICAgPj4+IGZyb20gc3ltcHkuY29yZS5sb2dpYyBpbXBvcnQgZnV6enlfYW5kXG4gICAgPj4+IGZyb20gc3ltcHkgaW1wb3J0IER1bW15XG4gICAgSWYgeW91IGhhZCBhIGxpc3Qgb2Ygb2JqZWN0cyB0byB0ZXN0IHRoZSBjb21tdXRpdml0eSBvZlxuICAgIGFuZCB5b3Ugd2FudCB0aGUgZnV6enlfYW5kIGxvZ2ljIGFwcGxpZWQsIHBhc3NpbmcgYW5cbiAgICBpdGVyYXRvciB3aWxsIGFsbG93IHRoZSBjb21tdXRhdGl2aXR5IHRvIG9ubHkgYmUgY29tcHV0ZWRcbiAgICBhcyBtYW55IHRpbWVzIGFzIG5lY2Vzc2FyeS5XaXRoIHRoaXMgbGlzdCwgRmFsc2UgY2FuIGJlXG4gICAgcmV0dXJuZWQgYWZ0ZXIgYW5hbHl6aW5nIHRoZSBmaXJzdCBzeW1ib2w6XG4gICAgPj4+IHN5bXMgPVtEdW1teShjb21tdXRhdGl2ZSA9IEZhbHNlKSwgRHVtbXkoKV1cbiAgICA+Pj4gZnV6enlfYW5kKHMuaXNfY29tbXV0YXRpdmUgZm9yIHMgaW4gc3ltcylcbiAgICBGYWxzZVxuICAgIFRoYXQgRmFsc2Ugd291bGQgcmVxdWlyZSBsZXNzIHdvcmsgdGhhbiBpZiBhIGxpc3Qgb2YgcHJlIC0gY29tcHV0ZWRcbiAgICBpdGVtcyB3YXMgc2VudDpcbiAgICA+Pj4gZnV6enlfYW5kKFtzLmlzX2NvbW11dGF0aXZlIGZvciBzIGluIHN5bXNdKVxuICAgIEZhbHNlXG4gICAgKi9cblxuICAgIGxldCBydiA9IExvZ2ljLlRydWU7XG4gICAgZm9yIChsZXQgYWkgb2YgYXJncykge1xuICAgICAgICBhaSA9IGZ1enp5X2Jvb2woYWkpO1xuICAgICAgICBpZiAoYWkgaW5zdGFuY2VvZiBGYWxzZSkge1xuICAgICAgICAgICAgcmV0dXJuIExvZ2ljLkZhbHNlO1xuICAgICAgICB9IGlmIChydiBpbnN0YW5jZW9mIFRydWUpIHsgLy8gdGhpcyB3aWxsIHN0b3AgdXBkYXRpbmcgaWYgYSBOb25lIGlzIGV2ZXIgdHJhcHBlZFxuICAgICAgICAgICAgcnYgPSBhaTtcbiAgICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gcnY7XG59XG5cbmZ1bmN0aW9uIGZ1enp5X2FuZF92MihhcmdzOiBhbnlbXSkge1xuICAgIGxldCBydiA9IHRydWU7XG4gICAgZm9yIChsZXQgYWkgb2YgYXJncykge1xuICAgICAgICBhaSA9IGZ1enp5X2Jvb2xfdjIoYWkpO1xuICAgICAgICBpZiAoYWkgPT09IGZhbHNlKSB7XG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH0gaWYgKHJ2ID09PSB0cnVlKSB7XG4gICAgICAgICAgICBydiA9IGFpO1xuICAgICAgICB9XG4gICAgfVxuICAgIHJldHVybiBydjtcbn1cblxuZnVuY3Rpb24gZnV6enlfbm90KHY6IGFueSk6IExvZ2ljIHwgbnVsbCB7XG4gICAgLypcbiAgICBOb3QgaW4gZnV6enkgbG9naWNcbiAgICAgICAgUmV0dXJuIE5vbmUgaWYgYHZgIGlzIE5vbmUgZWxzZSBgbm90IHZgLlxuICAgICAgICBFeGFtcGxlc1xuICAgICAgICA9PT09PT09PVxuICAgICAgICA+Pj4gZnJvbSBzeW1weS5jb3JlLmxvZ2ljIGltcG9ydCBmdXp6eV9ub3RcbiAgICAgICAgPj4+IGZ1enp5X25vdChUcnVlKVxuICAgIEZhbHNlXG4gICAgICAgID4+PiBmdXp6eV9ub3QoTm9uZSlcbiAgICAgICAgPj4+IGZ1enp5X25vdChGYWxzZSlcbiAgICBUcnVlXG4gICAgKi9cbiAgICBpZiAodiA9PSBudWxsKSB7XG4gICAgICAgIHJldHVybiB2O1xuICAgIH0gZWxzZSBpZiAodiBpbnN0YW5jZW9mIFRydWUpIHtcbiAgICAgICAgcmV0dXJuIExvZ2ljLkZhbHNlO1xuICAgIH1cbiAgICByZXR1cm4gTG9naWMuVHJ1ZTtcbn1cblxuXG5leHBvcnQgZnVuY3Rpb24gZnV6enlfbm90djIodjogYW55KSB7XG4gICAgLypcbiAgICBOb3QgaW4gZnV6enkgbG9naWNcbiAgICAgICAgUmV0dXJuIE5vbmUgaWYgYHZgIGlzIE5vbmUgZWxzZSBgbm90IHZgLlxuICAgICAgICBFeGFtcGxlc1xuICAgICAgICA9PT09PT09PVxuICAgICAgICA+Pj4gZnJvbSBzeW1weS5jb3JlLmxvZ2ljIGltcG9ydCBmdXp6eV9ub3RcbiAgICAgICAgPj4+IGZ1enp5X25vdChUcnVlKVxuICAgIEZhbHNlXG4gICAgICAgID4+PiBmdXp6eV9ub3QoTm9uZSlcbiAgICAgICAgPj4+IGZ1enp5X25vdChGYWxzZSlcbiAgICBUcnVlXG4gICAgKi9cbiAgICBpZiAodiA9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgICB9IGVsc2UgaWYgKHYgPT09IHRydWUpIHtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgICByZXR1cm4gdHJ1ZTtcbn1cblxuXG5mdW5jdGlvbiBmdXp6eV9vcihhcmdzOiBhbnlbXSk6IExvZ2ljIHtcbiAgICAvKlxuICAgIE9yIGluIGZ1enp5IGxvZ2ljLlJldHVybnMgVHJ1ZShhbnkgVHJ1ZSksIEZhbHNlKGFsbCBGYWxzZSksIG9yIE5vbmVcbiAgICAgICAgU2VlIHRoZSBkb2NzdHJpbmdzIG9mIGZ1enp5X2FuZCBhbmQgZnV6enlfbm90IGZvciBtb3JlIGluZm8uZnV6enlfb3IgaXNcbiAgICAgICAgcmVsYXRlZCB0byB0aGUgdHdvIGJ5IHRoZSBzdGFuZGFyZCBEZSBNb3JnYW4ncyBsYXcuXG4gICAgICAgID4+PiBmcm9tIHN5bXB5LmNvcmUubG9naWMgaW1wb3J0IGZ1enp5X29yXG4gICAgICAgID4+PiBmdXp6eV9vcihbVHJ1ZSwgRmFsc2VdKVxuICAgIFRydWVcbiAgICAgICAgPj4+IGZ1enp5X29yKFtUcnVlLCBOb25lXSlcbiAgICBUcnVlXG4gICAgICAgID4+PiBmdXp6eV9vcihbRmFsc2UsIEZhbHNlXSlcbiAgICBGYWxzZVxuICAgICAgICA+Pj4gcHJpbnQoZnV6enlfb3IoW0ZhbHNlLCBOb25lXSkpXG4gICAgTm9uZVxuICAgICovXG4gICAgbGV0IHJ2ID0gTG9naWMuRmFsc2U7XG5cbiAgICBmb3IgKGxldCBhaSBvZiBhcmdzKSB7XG4gICAgICAgIGFpID0gZnV6enlfYm9vbChhaSk7XG4gICAgICAgIGlmIChhaSBpbnN0YW5jZW9mIFRydWUpIHtcbiAgICAgICAgICAgIHJldHVybiBMb2dpYy5UcnVlO1xuICAgICAgICB9XG4gICAgICAgIGlmIChydiBpbnN0YW5jZW9mIEZhbHNlKSB7IC8vIHRoaXMgd2lsbCBzdG9wIHVwZGF0aW5nIGlmIGEgTm9uZSBpcyBldmVyIHRyYXBwZWRcbiAgICAgICAgICAgIHJ2ID0gYWk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIHJ2O1xufVxuXG5mdW5jdGlvbiBmdXp6eV94b3IoYXJnczogYW55W10pOiBMb2dpYyB8IG51bGwge1xuICAgIC8qIFJldHVybiBOb25lIGlmIGFueSBlbGVtZW50IG9mIGFyZ3MgaXMgbm90IFRydWUgb3IgRmFsc2UsIGVsc2VcbiAgICBUcnVlKGlmIHRoZXJlIGFyZSBhbiBvZGQgbnVtYmVyIG9mIFRydWUgZWxlbWVudHMpLCBlbHNlIEZhbHNlLiAqL1xuICAgIGxldCB0ID0gMDtcbiAgICBsZXQgZiA9IDA7XG4gICAgZm9yIChjb25zdCBhIG9mIGFyZ3MpIHtcbiAgICAgICAgY29uc3QgYWkgPSBmdXp6eV9ib29sKGEpO1xuICAgICAgICBpZiAoYWkgaW5zdGFuY2VvZiBUcnVlKSB7XG4gICAgICAgICAgICB0ICs9IDE7XG4gICAgICAgIH0gZWxzZSBpZiAoYWkgaW5zdGFuY2VvZiBGYWxzZSkge1xuICAgICAgICAgICAgZiArPSAxO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICAgIH1cbiAgICB9XG4gICAgaWYgKHQgJSAyID09IDEpIHtcbiAgICAgICAgcmV0dXJuIExvZ2ljLlRydWU7XG4gICAgfVxuICAgIHJldHVybiBMb2dpYy5GYWxzZTtcbn1cblxuZnVuY3Rpb24gZnV6enlfbmFuZChhcmdzOiBhbnlbXSk6IExvZ2ljIHwgbnVsbCB7XG4gICAgLyogUmV0dXJuIEZhbHNlIGlmIGFsbCBhcmdzIGFyZSBUcnVlLCBUcnVlIGlmIHRoZXkgYXJlIGFsbCBGYWxzZSxcbiAgICBlbHNlIE5vbmUuICovXG4gICAgcmV0dXJuIGZ1enp5X25vdChmdXp6eV9hbmQoYXJncykpO1xufVxuXG5cbmNsYXNzIExvZ2ljIHtcbiAgICBzdGF0aWMgVHJ1ZTogTG9naWM7XG4gICAgc3RhdGljIEZhbHNlOiBMb2dpYztcblxuICAgIHN0YXRpYyBvcF8yY2xhc3M6IFJlY29yZDxzdHJpbmcsICguLi5hcmdzOiBhbnlbXSkgPT4gTG9naWM+ID0ge1xuICAgICAgICBcIiZcIjogKC4uLmFyZ3MpID0+IHtcbiAgICAgICAgICAgIHJldHVybiBBbmQuTmV3KC4uLmFyZ3MpO1xuICAgICAgICB9LFxuICAgICAgICBcInxcIjogKC4uLmFyZ3MpID0+IHtcbiAgICAgICAgICAgIHJldHVybiBPci5OZXcoLi4uYXJncyk7XG4gICAgICAgIH0sXG4gICAgICAgIFwiIVwiOiAoYXJnKSA9PiB7XG4gICAgICAgICAgICByZXR1cm4gTm90Lk5ldyhhcmcpO1xuICAgICAgICB9LFxuICAgIH07XG5cbiAgICBhcmdzOiBhbnlbXTtcblxuICAgIGNvbnN0cnVjdG9yKC4uLmFyZ3M6IGFueVtdKSB7XG4gICAgICAgIHRoaXMuYXJncyA9IFsuLi5hcmdzXS5mbGF0KClcbiAgICB9XG5cbiAgICBfZXZhbF9wcm9wYWdhdGVfbm90KCk6IGFueSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcihcIkV2YWwgcHJvcGFnYXRlIG5vdCBpcyBhYnN0cmFjdCBpbiBMb2dpY1wiKTtcbiAgICB9XG5cbiAgICBleHBhbmQoKTogYW55IHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiRXhwYW5kIGlzIGFic3RyYWN0IGluIExvZ2ljXCIpO1xuICAgIH1cblxuICAgIHN0YXRpYyBfX25ld19fKGNsczogYW55LCAuLi5hcmdzOiBhbnlbXSk6IGFueSB7XG4gICAgICAgIGlmIChjbHMgPT09IE5vdCkge1xuICAgICAgICAgICAgcmV0dXJuIG5ldyBOb3QoYXJnc1swXSk7XG4gICAgICAgIH0gZWxzZSBpZiAoY2xzID09PSBBbmQpIHtcbiAgICAgICAgICAgIHJldHVybiBuZXcgQW5kKGFyZ3MpO1xuICAgICAgICB9IGVsc2UgaWYgKGNscyA9PT0gT3IpIHtcbiAgICAgICAgICAgIHJldHVybiBuZXcgT3IoYXJncyk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBnZXRfb3BfeF9ub3R4KCk6IGFueSB7XG4gICAgICAgIHJldHVybiBudWxsO1xuICAgIH1cblxuICAgIGhhc2hLZXkoKTogc3RyaW5nIHtcbiAgICAgICAgcmV0dXJuIHRoaXMudG9TdHJpbmcoKTtcbiAgICB9XG5cbiAgICB0b1N0cmluZygpIHtcbiAgICAgICAgcmV0dXJuIFwiTG9naWMgXCIgKyB0aGlzLmFyZ3MudG9TdHJpbmcoKTtcbiAgICB9XG5cbiAgICBnZXROZXdBcmdzKCk6IGFueVtdIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuYXJncztcbiAgICB9XG5cbiAgICBzdGF0aWMgZXF1YWxzKGE6IGFueSwgYjogYW55KTogTG9naWMge1xuICAgICAgICBpZiAoIShiIGluc3RhbmNlb2YgYS5jb25zdHJ1Y3RvcikpIHtcbiAgICAgICAgICAgIHJldHVybiBMb2dpYy5GYWxzZTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGlmIChhLmFyZ3MgPT0gYi5hcmdzKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIExvZ2ljLlRydWU7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gTG9naWMuRmFsc2U7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBzdGF0aWMgbm90RXF1YWxzKGE6IGFueSwgYjogYW55KTogTG9naWMge1xuICAgICAgICBpZiAoIShiIGluc3RhbmNlb2YgYS5jb25zdHJ1Y3RvcikpIHtcbiAgICAgICAgICAgIHJldHVybiBMb2dpYy5UcnVlO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgaWYgKGEuYXJncyA9PSBiLmFyZ3MpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gTG9naWMuRmFsc2U7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gTG9naWMuVHJ1ZTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGxlc3NUaGFuKG90aGVyOiBPYmplY3QpOiBMb2dpYyB7XG4gICAgICAgIGlmICh0aGlzLmNvbXBhcmUob3RoZXIpID09IC0xKSB7XG4gICAgICAgICAgICByZXR1cm4gTG9naWMuVHJ1ZTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gTG9naWMuRmFsc2U7XG4gICAgfVxuXG4gICAgY29tcGFyZShvdGhlcjogYW55KTogbnVtYmVyIHtcbiAgICAgICAgbGV0IGE7IGxldCBiO1xuICAgICAgICBpZiAodHlwZW9mIHRoaXMgIT0gdHlwZW9mIG90aGVyKSB7XG4gICAgICAgICAgICBjb25zdCB1bmtTZWxmOiB1bmtub3duID0gPHVua25vd24+IHRoaXMuY29uc3RydWN0b3I7XG4gICAgICAgICAgICBjb25zdCB1bmtPdGhlcjogdW5rbm93biA9IDx1bmtub3duPiBvdGhlci5jb25zdHJ1Y3RvcjtcbiAgICAgICAgICAgIGEgPSA8c3RyaW5nPiB1bmtTZWxmO1xuICAgICAgICAgICAgYiA9IDxzdHJpbmc+IHVua090aGVyO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgYSA9IHRoaXMuYXJncztcbiAgICAgICAgICAgIGIgPSBvdGhlci5hcmdzO1xuICAgICAgICB9XG4gICAgICAgIGlmIChhID4gYikge1xuICAgICAgICAgICAgcmV0dXJuIDE7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gMDtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHN0YXRpYyBmcm9tc3RyaW5nKHRleHQ6IHN0cmluZykge1xuICAgICAgICAvKiBMb2dpYyBmcm9tIHN0cmluZyB3aXRoIHNwYWNlIGFyb3VuZCAmIGFuZCB8IGJ1dCBub25lIGFmdGVyICEuXG4gICAgICAgICAgIGUuZy5cbiAgICAgICAgICAgIWEgJiBiIHwgY1xuICAgICAgICAqL1xuICAgICAgICBsZXQgbGV4cHIgPSBudWxsOyAvLyBjdXJyZW50IGxvZ2ljYWwgZXhwcmVzc2lvblxuICAgICAgICBsZXQgc2NoZWRvcCA9IG51bGw7IC8vIHNjaGVkdWxlZCBvcGVyYXRpb25cbiAgICAgICAgZm9yIChjb25zdCB0ZXJtIG9mIHRleHQuc3BsaXQoXCIgXCIpKSB7XG4gICAgICAgICAgICBsZXQgZmxleFRlcm06IHN0cmluZyB8IExvZ2ljID0gdGVybTtcbiAgICAgICAgICAgIC8vIG9wZXJhdGlvbiBzeW1ib2xcbiAgICAgICAgICAgIGlmIChcIiZ8XCIuaW5jbHVkZXMoZmxleFRlcm0pKSB7XG4gICAgICAgICAgICAgICAgaWYgKHNjaGVkb3AgIT0gbnVsbCkge1xuICAgICAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJkb3VibGUgb3AgZm9yYmlkZGVuIFwiICsgZmxleFRlcm0gKyBcIiBcIiArIHNjaGVkb3ApO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBpZiAobGV4cHIgPT0gbnVsbCkge1xuICAgICAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoZmxleFRlcm0gKyBcIiBjYW5ub3QgYmUgaW4gdGhlIGJlZ2lubmluZyBvZiBleHByZXNzaW9uXCIpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBzY2hlZG9wID0gZmxleFRlcm07XG4gICAgICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoZmxleFRlcm0uaW5jbHVkZXMoXCJ8XCIpIHx8IGZsZXhUZXJtLmluY2x1ZGVzKFwiJlwiKSkge1xuICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcIiYgYW5kIHwgbXVzdCBoYXZlIHNwYWNlIGFyb3VuZCB0aGVtXCIpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKGZsZXhUZXJtWzBdID09IFwiIVwiKSB7XG4gICAgICAgICAgICAgICAgaWYgKGZsZXhUZXJtLmxlbmd0aCA9PSAxKSB7XG4gICAgICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcImRvIG5vdCBpbmNsdWRlIHNwYWNlIGFmdGVyICFcIik7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGZsZXhUZXJtID0gTm90Lk5ldyhmbGV4VGVybS5zdWJzdHJpbmcoMSkpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgLy8gYWxyZWFkeSBzY2hlZHVsZWQgb3BlcmF0aW9uLCBlLmcuICcmJ1xuICAgICAgICAgICAgaWYgKHNjaGVkb3ApIHtcbiAgICAgICAgICAgICAgICBjb25zdCBvcCA9IExvZ2ljLm9wXzJjbGFzc1tzY2hlZG9wXTtcbiAgICAgICAgICAgICAgICBsZXhwciA9IG9wKGxleHByLCBmbGV4VGVybSk7XG4gICAgICAgICAgICAgICAgc2NoZWRvcCA9IG51bGw7XG4gICAgICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICAvLyB0aGlzIHNob3VsZCBiZSBhdG9tXG4gICAgICAgICAgICBpZiAobGV4cHIgIT0gbnVsbCkge1xuICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcIm1pc3Npbmcgb3AgYmV0d2VlbiBcIiArIGxleHByICsgXCIgYW5kIFwiICsgZmxleFRlcm0gKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGxleHByID0gZmxleFRlcm07XG4gICAgICAgIH1cblxuICAgICAgICAvLyBsZXQncyBjaGVjayB0aGF0IHdlIGVuZGVkIHVwIGluIGNvcnJlY3Qgc3RhdGVcbiAgICAgICAgaWYgKHNjaGVkb3AgIT0gbnVsbCkge1xuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwicHJlbWF0dXJlIGVuZC1vZi1leHByZXNzaW9uIGluIFwiICsgdGV4dCk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGxleHByID09IG51bGwpIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcih0ZXh0ICsgXCIgaXMgZW1wdHlcIik7XG4gICAgICAgIH1cbiAgICAgICAgLy8gZXZlcnl0aGluZyBsb29rcyBnb29kIG5vd1xuICAgICAgICByZXR1cm4gbGV4cHI7XG4gICAgfVxufVxuXG5jbGFzcyBUcnVlIGV4dGVuZHMgTG9naWMge1xuICAgIF9ldmFsX3Byb3BhZ2F0ZV9ub3QoKTogYW55IHtcbiAgICAgICAgcmV0dXJuIEZhbHNlLkZhbHNlO1xuICAgIH1cblxuICAgIGV4cGFuZCgpOiBhbnkge1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9XG59XG5cbmNsYXNzIEZhbHNlIGV4dGVuZHMgTG9naWMge1xuICAgIF9ldmFsX3Byb3BhZ2F0ZV9ub3QoKTogYW55IHtcbiAgICAgICAgcmV0dXJuIFRydWUuVHJ1ZTtcbiAgICB9XG5cbiAgICBleHBhbmQoKTogYW55IHtcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxufVxuXG5cbmNsYXNzIEFuZE9yX0Jhc2UgZXh0ZW5kcyBMb2dpYyB7XG4gICAgc3RhdGljIF9fbmV3X18oY2xzOiBhbnksIG9wX3hfbm90eDogYW55LCAuLi5hcmdzOiBhbnlbXSkge1xuICAgICAgICBjb25zdCBiYXJnczogYW55W10gPSBbXTtcbiAgICAgICAgZm9yIChjb25zdCBhIG9mIGFyZ3MpIHtcbiAgICAgICAgICAgIGlmIChhID09IG9wX3hfbm90eCkge1xuICAgICAgICAgICAgICAgIHJldHVybiBhO1xuICAgICAgICAgICAgfSBlbHNlIGlmIChhID09IG9wX3hfbm90eC5vcHBvc2l0ZSkge1xuICAgICAgICAgICAgICAgIGNvbnRpbnVlOyAvLyBza2lwIHRoaXMgYXJndW1lbnRcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGJhcmdzLnB1c2goYSk7XG4gICAgICAgIH1cblxuICAgICAgICAvLyBwcmV2IHZlcnNpb246IGFyZ3MgPSBzb3J0ZWQoc2V0KHRoaXMuZmxhdHRlbihiYXJncykpLCBrZXk9aGFzaClcbiAgICAgICAgLy8gd2UgdGhpbmsgd2UgZG9uJ3QgbmVlZCB0aGUgc29ydCBhbmQgc2V0XG4gICAgICAgIGFyZ3MgPSBuZXcgSGFzaFNldChBbmRPcl9CYXNlLmZsYXR0ZW4oYmFyZ3MpKS50b0FycmF5KCkuc29ydChcbiAgICAgICAgICAgIChhLCBiKSA9PiBVdGlsLmhhc2hLZXkoYSkubG9jYWxlQ29tcGFyZShVdGlsLmhhc2hLZXkoYikpXG4gICAgICAgICk7XG5cbiAgICAgICAgLy8gY3JlYXRpbmcgYSBzZXQgd2l0aCBoYXNoIGtleXMgZm9yIGFyZ3NcbiAgICAgICAgY29uc3QgYXJnc19zZXQgPSBuZXcgSGFzaFNldChhcmdzKTtcblxuICAgICAgICBmb3IgKGNvbnN0IGEgb2YgYXJncykge1xuICAgICAgICAgICAgaWYgKGFyZ3Nfc2V0LmhhcyhOb3QuTmV3KGEpKSkge1xuICAgICAgICAgICAgICAgIHJldHVybiBvcF94X25vdHg7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoYXJncy5sZW5ndGggPT0gMSkge1xuICAgICAgICAgICAgcmV0dXJuIGFyZ3MucG9wKCk7XG4gICAgICAgIH0gZWxzZSBpZiAoYXJncy5sZW5ndGggPT0gMCkge1xuICAgICAgICAgICAgaWYgKG9wX3hfbm90eCBpbnN0YW5jZW9mIFRydWUpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gTG9naWMuRmFsc2U7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gTG9naWMuVHJ1ZTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBzdXBlci5fX25ld19fKGNscywgLi4uYXJncyk7XG4gICAgfVxuXG4gICAgc3RhdGljIGZsYXR0ZW4oYXJnczogYW55W10pOiBhbnlbXSB7XG4gICAgICAgIC8vIHF1aWNrLW4tZGlydHkgZmxhdHRlbmluZyBmb3IgQW5kIGFuZCBPclxuICAgICAgICBjb25zdCBhcmdzX3F1ZXVlOiBhbnlbXSA9IFsuLi5hcmdzXTtcbiAgICAgICAgY29uc3QgcmVzID0gW107XG4gICAgICAgIHdoaWxlIChhcmdzX3F1ZXVlLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgIGNvbnN0IGFyZzogYW55ID0gYXJnc19xdWV1ZS5wb3AoKTtcbiAgICAgICAgICAgIGlmIChhcmcgaW5zdGFuY2VvZiBMb2dpYykge1xuICAgICAgICAgICAgICAgIGlmIChhcmcgaW5zdGFuY2VvZiB0aGlzKSB7XG4gICAgICAgICAgICAgICAgICAgIGFyZ3NfcXVldWUucHVzaChhcmcuYXJncyk7XG4gICAgICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJlcy5wdXNoKGFyZyk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHJlcy5mbGF0KCk7XG4gICAgfVxufVxuXG5jbGFzcyBBbmQgZXh0ZW5kcyBBbmRPcl9CYXNlIHtcbiAgICBzdGF0aWMgTmV3KC4uLmFyZ3M6IGFueVtdKSB7XG4gICAgICAgIHJldHVybiBzdXBlci5fX25ld19fKEFuZCwgTG9naWMuRmFsc2UsIC4uLmFyZ3MpO1xuICAgIH1cblxuXG4gICAgX2V2YWxfcHJvcGFnYXRlX25vdCgpOiBPciB7XG4gICAgICAgIC8vICEgKGEmYiZjIC4uLikgPT0gIWEgfCAhYiB8ICFjIC4uLlxuICAgICAgICBjb25zdCBwYXJhbTogYW55W10gPSBbXTtcbiAgICAgICAgZm9yIChjb25zdCBhIG9mIHBhcmFtKSB7XG4gICAgICAgICAgICBwYXJhbS5wdXNoKE5vdC5OZXcoYSkpOyAvLyA/P1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBPci5OZXcoLi4ucGFyYW0pOyAvLyA/Pz9cbiAgICB9XG5cbiAgICAvLyAoYXxifC4uLikgJiBjID09IChhJmMpIHwgKGImYykgfCAuLi5cbiAgICBleHBhbmQoKTogYW55IHtcbiAgICAgICAgLy8gZmlyc3QgbG9jYXRlIE9yXG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5hcmdzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBjb25zdCBhcmcgPSB0aGlzLmFyZ3NbaV07XG4gICAgICAgICAgICBpZiAoYXJnIGluc3RhbmNlb2YgT3IpIHtcbiAgICAgICAgICAgICAgICAvLyBjb3B5IG9mIHRoaXMuYXJncyB3aXRoIGFyZyBhdCBwb3NpdGlvbiBpIHJlbW92ZWRcblxuICAgICAgICAgICAgICAgIGNvbnN0IGFyZXN0ID0gWy4uLnRoaXMuYXJnc10uc3BsaWNlKGksIDEpO1xuXG4gICAgICAgICAgICAgICAgLy8gc3RlcCBieSBzdGVwIHZlcnNpb24gb2YgdGhlIG1hcCBiZWxvd1xuICAgICAgICAgICAgICAgIC8qXG4gICAgICAgICAgICAgICAgbGV0IG9ydGVybXMgPSBbXTtcbiAgICAgICAgICAgICAgICBmb3IgKGxldCBhIG9mIGFyZy5hcmdzKSB7XG4gICAgICAgICAgICAgICAgICAgIG9ydGVybXMucHVzaChuZXcgQW5kKC4uLmFyZXN0LmNvbmNhdChbYV0pKSlcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgKi9cblxuICAgICAgICAgICAgICAgIGNvbnN0IG9ydGVybXMgPSBhcmcuYXJncy5tYXAoKGUpID0+IEFuZC5OZXcoLi4uYXJlc3QuY29uY2F0KFtlXSkpKTtcblxuXG4gICAgICAgICAgICAgICAgZm9yIChsZXQgaiA9IDA7IGogPCBvcnRlcm1zLmxlbmd0aDsgaisrKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChvcnRlcm1zW2pdIGluc3RhbmNlb2YgTG9naWMpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIG9ydGVybXNbal0gPSBvcnRlcm1zW2pdLmV4cGFuZCgpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGNvbnN0IHJlcyA9IE9yLk5ldyguLi5vcnRlcm1zKTtcbiAgICAgICAgICAgICAgICByZXR1cm4gcmVzO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cbn1cblxuY2xhc3MgT3IgZXh0ZW5kcyBBbmRPcl9CYXNlIHtcbiAgICBzdGF0aWMgTmV3KC4uLmFyZ3M6IGFueVtdKSB7XG4gICAgICAgIHJldHVybiBzdXBlci5fX25ld19fKE9yLCBMb2dpYy5UcnVlLCAuLi5hcmdzKTtcbiAgICB9XG5cbiAgICBfZXZhbF9wcm9wYWdhdGVfbm90KCk6IEFuZCB7XG4gICAgICAgIC8vICEgKGEmYiZjIC4uLikgPT0gIWEgfCAhYiB8ICFjIC4uLlxuICAgICAgICBjb25zdCBwYXJhbTogYW55W10gPSBbXTtcbiAgICAgICAgZm9yIChjb25zdCBhIG9mIHBhcmFtKSB7XG4gICAgICAgICAgICBwYXJhbS5wdXNoKE5vdC5OZXcoYSkpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBBbmQuTmV3KC4uLnBhcmFtKTtcbiAgICB9XG59XG5cbmNsYXNzIE5vdCBleHRlbmRzIExvZ2ljIHtcbiAgICBzdGF0aWMgTmV3KGFyZ3M6IGFueSkge1xuICAgICAgICByZXR1cm4gTm90Ll9fbmV3X18oTm90LCBhcmdzKTtcbiAgICB9XG5cbiAgICBzdGF0aWMgX19uZXdfXyhjbHM6IGFueSwgYXJnOiBhbnkpIHtcbiAgICAgICAgaWYgKHR5cGVvZiBhcmcgPT09IFwic3RyaW5nXCIpIHtcbiAgICAgICAgICAgIHJldHVybiBzdXBlci5fX25ld19fKGNscywgYXJnKTtcbiAgICAgICAgfSBlbHNlIGlmIChhcmcgaW5zdGFuY2VvZiBUcnVlKSB7XG4gICAgICAgICAgICByZXR1cm4gTG9naWMuRmFsc2U7XG4gICAgICAgIH0gZWxzZSBpZiAoYXJnIGluc3RhbmNlb2YgRmFsc2UpIHtcbiAgICAgICAgICAgIHJldHVybiBMb2dpYy5UcnVlO1xuICAgICAgICB9IGVsc2UgaWYgKGFyZyBpbnN0YW5jZW9mIE5vdCkge1xuICAgICAgICAgICAgcmV0dXJuIGFyZy5hcmdzWzBdO1xuICAgICAgICB9IGVsc2UgaWYgKGFyZyBpbnN0YW5jZW9mIExvZ2ljKSB7XG4gICAgICAgICAgICAvLyBYWFggdGhpcyBpcyBhIGhhY2sgdG8gZXhwYW5kIHJpZ2h0IGZyb20gdGhlIGJlZ2lubmluZ1xuICAgICAgICAgICAgYXJnID0gYXJnLl9ldmFsX3Byb3BhZ2F0ZV9ub3QoKTtcbiAgICAgICAgICAgIHJldHVybiBhcmc7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJOb3Q6IHVua25vd24gYXJndW1lbnQgXCIgKyBhcmcpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgYXJnKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5hcmdzWzBdO1xuICAgIH1cbn1cblxuTG9naWMuVHJ1ZSA9IG5ldyBUcnVlKCk7XG5Mb2dpYy5GYWxzZSA9IG5ldyBGYWxzZSgpO1xuXG5leHBvcnQge0xvZ2ljLCBUcnVlLCBGYWxzZSwgQW5kLCBPciwgTm90LCBmdXp6eV9ib29sLCBmdXp6eV9hbmQsIGZ1enp5X2Jvb2xfdjIsIGZ1enp5X2FuZF92Mn07XG5cblxuIiwgIi8qIGVzbGludC1kaXNhYmxlIG5ldy1jYXAgKi9cbi8qIFRoaXMgaXMgcnVsZS1iYXNlZCBkZWR1Y3Rpb24gc3lzdGVtIGZvciBTeW1QeVxuVGhlIHdob2xlIHRoaW5nIGlzIHNwbGl0IGludG8gdHdvIHBhcnRzXG4gLSBydWxlcyBjb21waWxhdGlvbiBhbmQgcHJlcGFyYXRpb24gb2YgdGFibGVzXG4gLSBydW50aW1lIGluZmVyZW5jZVxuRm9yIHJ1bGUtYmFzZWQgaW5mZXJlbmNlIGVuZ2luZXMsIHRoZSBjbGFzc2ljYWwgd29yayBpcyBSRVRFIGFsZ29yaXRobSBbMV0sXG5bMl0gQWx0aG91Z2ggd2UgYXJlIG5vdCBpbXBsZW1lbnRpbmcgaXQgaW4gZnVsbCAob3IgZXZlbiBzaWduaWZpY2FudGx5KVxuaXQncyBzdGlsbCB3b3J0aCBhIHJlYWQgdG8gdW5kZXJzdGFuZCB0aGUgdW5kZXJseWluZyBpZGVhcy5cbkluIHNob3J0LCBldmVyeSBydWxlIGluIGEgc3lzdGVtIG9mIHJ1bGVzIGlzIG9uZSBvZiB0d28gZm9ybXM6XG4gLSBhdG9tICAgICAgICAgICAgICAgICAgICAgLT4gLi4uICAgICAgKGFscGhhIHJ1bGUpXG4gLSBBbmQoYXRvbTEsIGF0b20yLCAuLi4pICAgLT4gLi4uICAgICAgKGJldGEgcnVsZSlcblRoZSBtYWpvciBjb21wbGV4aXR5IGlzIGluIGVmZmljaWVudCBiZXRhLXJ1bGVzIHByb2Nlc3NpbmcgYW5kIHVzdWFsbHkgZm9yIGFuXG5leHBlcnQgc3lzdGVtIGEgbG90IG9mIGVmZm9ydCBnb2VzIGludG8gY29kZSB0aGF0IG9wZXJhdGVzIG9uIGJldGEtcnVsZXMuXG5IZXJlIHdlIHRha2UgbWluaW1hbGlzdGljIGFwcHJvYWNoIHRvIGdldCBzb21ldGhpbmcgdXNhYmxlIGZpcnN0LlxuIC0gKHByZXBhcmF0aW9uKSAgICBvZiBhbHBoYS0gYW5kIGJldGEtIG5ldHdvcmtzLCBldmVyeXRoaW5nIGV4Y2VwdFxuIC0gKHJ1bnRpbWUpICAgICAgICBGYWN0UnVsZXMuZGVkdWNlX2FsbF9mYWN0c1xuICAgICAgICAgICAgIF9fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19cbiAgICAgICAgICAgICggS2lycjogSSd2ZSBuZXZlciB0aG91Z2h0IHRoYXQgZG9pbmcgKVxuICAgICAgICAgICAgKCBsb2dpYyBzdHVmZiBpcyB0aGF0IGRpZmZpY3VsdC4uLiAgICApXG4gICAgICAgICAgICAgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgICAgICAgICAgICAgICAgICBvICAgXl9fXlxuICAgICAgICAgICAgICAgICAgICAgbyAgKG9vKVxcX19fX19fX1xuICAgICAgICAgICAgICAgICAgICAgICAgKF9fKVxcICAgICAgIClcXC9cXFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHx8LS0tLXcgfFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHx8ICAgICB8fFxuU29tZSByZWZlcmVuY2VzIG9uIHRoZSB0b3BpY1xuLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuWzFdIGh0dHBzOi8vZW4ud2lraXBlZGlhLm9yZy93aWtpL1JldGVfYWxnb3JpdGhtXG5bMl0gaHR0cDovL3JlcG9ydHMtYXJjaGl2ZS5hZG0uY3MuY211LmVkdS9hbm9uLzE5OTUvQ01VLUNTLTk1LTExMy5wZGZcbmh0dHBzOi8vZW4ud2lraXBlZGlhLm9yZy93aWtpL1Byb3Bvc2l0aW9uYWxfZm9ybXVsYVxuaHR0cHM6Ly9lbi53aWtpcGVkaWEub3JnL3dpa2kvSW5mZXJlbmNlX3J1bGVcbmh0dHBzOi8vZW4ud2lraXBlZGlhLm9yZy93aWtpL0xpc3Rfb2ZfcnVsZXNfb2ZfaW5mZXJlbmNlXG4qL1xuXG4vKlxuXG5TaWduaWZpY2FudCBjaGFuZ2VzIG1hZGUgKFdCIGFuZCBHTSk6XG4tIENyZWF0ZWQgdGhlIEltcGxpY2F0aW9uIGNsYXNzLCB1c2UgdG8gcmVwcmVzZW50IHRoZSBpbXBsaWNhdGlvbiBwIC0+IHEgd2hpY2hcbiAgaXMgc3RvcmVkIGFzIGEgdHVwbGUgaW4gc3ltcHlcbi0gQ3JlYXRlZCB0aGUgU2V0RGVmYXVsdERpY3QsIEhhc2hEaWN0IGFuZCBIYXNoU2V0IGNsYXNzZXMuIFNldERlZmF1bHREaWN0IGFjdHNcbiAgYXMgYSByZXBsY2FjZW1lbnQgZGVmYXVsdGRpY3Qoc2V0KSwgYW5kIEhhc2hEaWN0IGFuZCBIYXNoU2V0IHJlcGxhY2UgdGhlXG4gIGRpY3QgYW5kIHNldCBjbGFzc2VzLlxuLSBBZGRlZCBpc1N1YnNldCgpIHRvIHRoZSB1dGlsaXR5IGNsYXNzIHRvIGhlbHAgd2l0aCB0aGlzIHByb2dyYW1cblxuKi9cblxuXG5pbXBvcnQge1N0ZEZhY3RLQn0gZnJvbSBcIi4vYXNzdW1wdGlvbnNcIjtcbmltcG9ydCB7TG9naWMsIFRydWUsIEZhbHNlLCBBbmQsIE9yLCBOb3R9IGZyb20gXCIuL2xvZ2ljXCI7XG5cbmltcG9ydCB7VXRpbCwgSGFzaFNldCwgU2V0RGVmYXVsdERpY3QsIEFyckRlZmF1bHREaWN0LCBIYXNoRGljdCwgSW1wbGljYXRpb259IGZyb20gXCIuL3V0aWxpdHlcIjtcblxuXG5mdW5jdGlvbiBfYmFzZV9mYWN0KGF0b206IGFueSkge1xuICAgIC8qICBSZXR1cm4gdGhlIGxpdGVyYWwgZmFjdCBvZiBhbiBhdG9tLlxuICAgIEVmZmVjdGl2ZWx5LCB0aGlzIG1lcmVseSBzdHJpcHMgdGhlIE5vdCBhcm91bmQgYSBmYWN0LlxuICAgICovXG4gICAgaWYgKGF0b20gaW5zdGFuY2VvZiBOb3QpIHtcbiAgICAgICAgcmV0dXJuIGF0b20uYXJnKCk7XG4gICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuIGF0b207XG4gICAgfVxufVxuXG5cbmZ1bmN0aW9uIF9hc19wYWlyKGF0b206IGFueSkge1xuICAgIC8qICBSZXR1cm4gdGhlIGxpdGVyYWwgZmFjdCBvZiBhbiBhdG9tLlxuICAgIEVmZmVjdGl2ZWx5LCB0aGlzIG1lcmVseSBzdHJpcHMgdGhlIE5vdCBhcm91bmQgYSBmYWN0LlxuICAgICovXG4gICAgaWYgKGF0b20gaW5zdGFuY2VvZiBOb3QpIHtcbiAgICAgICAgcmV0dXJuIG5ldyBJbXBsaWNhdGlvbihhdG9tLmFyZygpLCBMb2dpYy5GYWxzZSk7XG4gICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuIG5ldyBJbXBsaWNhdGlvbihhdG9tLCBMb2dpYy5UcnVlKTtcbiAgICB9XG59XG5cblxuZnVuY3Rpb24gX2FzX3BhaXJ2MihhdG9tOiBhbnkpIHtcbiAgICAvKiAgUmV0dXJuIHRoZSBsaXRlcmFsIGZhY3Qgb2YgYW4gYXRvbS5cbiAgICBFZmZlY3RpdmVseSwgdGhpcyBtZXJlbHkgc3RyaXBzIHRoZSBOb3QgYXJvdW5kIGEgZmFjdC5cbiAgICAqL1xuICAgIGlmIChhdG9tIGluc3RhbmNlb2YgTm90KSB7XG4gICAgICAgIHJldHVybiBuZXcgSW1wbGljYXRpb24oYXRvbS5hcmcoKSwgZmFsc2UpO1xuICAgIH0gZWxzZSB7XG4gICAgICAgIHJldHVybiBuZXcgSW1wbGljYXRpb24oYXRvbSwgdHJ1ZSk7XG4gICAgfVxufVxuXG4vLyBYWFggdGhpcyBwcmVwYXJlcyBmb3J3YXJkLWNoYWluaW5nIHJ1bGVzIGZvciBhbHBoYS1uZXR3b3JrXG5cbmZ1bmN0aW9uIHRyYW5zaXRpdmVfY2xvc3VyZShpbXBsaWNhdGlvbnM6IEltcGxpY2F0aW9uW10pIHtcbiAgICAvKlxuICAgIENvbXB1dGVzIHRoZSB0cmFuc2l0aXZlIGNsb3N1cmUgb2YgYSBsaXN0IG9mIGltcGxpY2F0aW9uc1xuICAgIFVzZXMgV2Fyc2hhbGwncyBhbGdvcml0aG0sIGFzIGRlc2NyaWJlZCBhdFxuICAgIGh0dHA6Ly93d3cuY3MuaG9wZS5lZHUvfmN1c2Fjay9Ob3Rlcy9Ob3Rlcy9EaXNjcmV0ZU1hdGgvV2Fyc2hhbGwucGRmLlxuICAgICovXG4gICAgbGV0IHRlbXAgPSBuZXcgQXJyYXkoKTtcbiAgICBmb3IgKGNvbnN0IGltcGwgb2YgaW1wbGljYXRpb25zKSB7XG4gICAgICAgIHRlbXAucHVzaChpbXBsLnApO1xuICAgICAgICB0ZW1wLnB1c2goaW1wbC5xKTtcbiAgICB9XG4gICAgdGVtcCA9IHRlbXAuZmxhdCgpO1xuICAgIGNvbnN0IGZ1bGxfaW1wbGljYXRpb25zID0gbmV3IEhhc2hTZXQoaW1wbGljYXRpb25zKTtcbiAgICBjb25zdCBsaXRlcmFscyA9IG5ldyBIYXNoU2V0KHRlbXApO1xuICAgIFxuICAgIGZvciAoY29uc3QgayBvZiBsaXRlcmFscy50b0FycmF5KCkpIHtcbiAgICAgICAgZm9yIChjb25zdCBpIG9mIGxpdGVyYWxzLnRvQXJyYXkoKSkge1xuICAgICAgICAgICAgaWYgKGZ1bGxfaW1wbGljYXRpb25zLmhhcyhuZXcgSW1wbGljYXRpb24oaSwgaykpKSB7XG4gICAgICAgICAgICAgICAgZm9yIChjb25zdCBqIG9mIGxpdGVyYWxzLnRvQXJyYXkoKSkge1xuICAgICAgICAgICAgICAgICAgICBpZiAoZnVsbF9pbXBsaWNhdGlvbnMuaGFzKG5ldyBJbXBsaWNhdGlvbihrLCBqKSkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGZ1bGxfaW1wbGljYXRpb25zLmFkZChuZXcgSW1wbGljYXRpb24oaSwgaikpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuICAgIHJldHVybiBmdWxsX2ltcGxpY2F0aW9ucztcbn1cblxuXG5mdW5jdGlvbiBkZWR1Y2VfYWxwaGFfaW1wbGljYXRpb25zKGltcGxpY2F0aW9uczogSW1wbGljYXRpb25bXSkge1xuICAgIC8qIGRlZHVjZSBhbGwgaW1wbGljYXRpb25zXG4gICAgICAgRGVzY3JpcHRpb24gYnkgZXhhbXBsZVxuICAgICAgIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAgICBnaXZlbiBzZXQgb2YgbG9naWMgcnVsZXM6XG4gICAgICAgICBhIC0+IGJcbiAgICAgICAgIGIgLT4gY1xuICAgICAgIHdlIGRlZHVjZSBhbGwgcG9zc2libGUgcnVsZXM6XG4gICAgICAgICBhIC0+IGIsIGNcbiAgICAgICAgIGIgLT4gY1xuICAgICAgIGltcGxpY2F0aW9uczogW10gb2YgKGEsYilcbiAgICAgICByZXR1cm46ICAgICAgIHt9IG9mIGEgLT4gc2V0KFtiLCBjLCAuLi5dKVxuICAgICAgICovXG4gICAgY29uc3QgbmV3X2FycjogYW55W10gPSBbXTtcbiAgICBmb3IgKGNvbnN0IGltcGwgb2YgaW1wbGljYXRpb25zKSB7XG4gICAgICAgIG5ld19hcnIucHVzaChuZXcgSW1wbGljYXRpb24oTm90Lk5ldyhpbXBsLnEpLCBOb3QuTmV3KGltcGwucCkpKTtcbiAgICB9XG4gICAgaW1wbGljYXRpb25zID0gaW1wbGljYXRpb25zLmNvbmNhdChuZXdfYXJyKTtcbiAgICBjb25zdCByZXMgPSBuZXcgU2V0RGVmYXVsdERpY3QoKTtcbiAgICBjb25zdCBmdWxsX2ltcGxpY2F0aW9ucyA9IHRyYW5zaXRpdmVfY2xvc3VyZShpbXBsaWNhdGlvbnMpO1xuICAgIGZvciAoY29uc3QgaW1wbCBvZiBmdWxsX2ltcGxpY2F0aW9ucy50b0FycmF5KCkpIHtcbiAgICAgICAgaWYgKGltcGwucCA9PT0gaW1wbC5xKSB7XG4gICAgICAgICAgICBjb250aW51ZTsgLy8gc2tpcCBhLT5hIGN5Y2xpYyBpbnB1dFxuICAgICAgICB9XG4gICAgICAgIGNvbnN0IGN1cnJTZXQgPSByZXMuZ2V0KGltcGwucCk7XG4gICAgICAgIGN1cnJTZXQuYWRkKGltcGwucSk7XG4gICAgICAgIHJlcy5hZGQoaW1wbC5wLCBjdXJyU2V0KTtcbiAgICB9XG4gICAgLy8gQ2xlYW4gdXAgdGF1dG9sb2dpZXMgYW5kIGNoZWNrIGNvbnNpc3RlbmN5XG4gICAgLy8gaW1wbCBpcyB0aGUgc2V0XG4gICAgZm9yIChjb25zdCBpdGVtIG9mIHJlcy5lbnRyaWVzKCkpIHtcbiAgICAgICAgY29uc3QgYSA9IGl0ZW1bMF07XG4gICAgICAgIGNvbnN0IGltcGw6IEhhc2hTZXQgPSBpdGVtWzFdO1xuICAgICAgICBpbXBsLnJlbW92ZShhKTtcbiAgICAgICAgY29uc3QgbmEgPSBOb3QuTmV3KGEpO1xuICAgICAgICBpZiAoaW1wbC5oYXMobmEpKSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJpbXBsaWNhdGlvbnMgYXJlIGluY29uc2lzdGVudDogXCIgKyBhICsgXCIgLT4gXCIgKyBuYSArIFwiIFwiICsgaW1wbCk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIHJlcztcbn1cblxuZnVuY3Rpb24gYXBwbHlfYmV0YV90b19hbHBoYV9yb3V0ZShhbHBoYV9pbXBsaWNhdGlvbnM6IEhhc2hEaWN0LCBiZXRhX3J1bGVzOiBhbnlbXSkge1xuICAgIC8qIGFwcGx5IGFkZGl0aW9uYWwgYmV0YS1ydWxlcyAoQW5kIGNvbmRpdGlvbnMpIHRvIGFscmVhZHktYnVpbHRcbiAgICBhbHBoYSBpbXBsaWNhdGlvbiB0YWJsZXNcbiAgICAgICBUT0RPOiB3cml0ZSBhYm91dFxuICAgICAgIC0gc3RhdGljIGV4dGVuc2lvbiBvZiBhbHBoYS1jaGFpbnNcbiAgICAgICAtIGF0dGFjaGluZyByZWZzIHRvIGJldGEtbm9kZXMgdG8gYWxwaGEgY2hhaW5zXG4gICAgICAgZS5nLlxuICAgICAgIGFscGhhX2ltcGxpY2F0aW9uczpcbiAgICAgICBhICAtPiAgW2IsICFjLCBkXVxuICAgICAgIGIgIC0+ICBbZF1cbiAgICAgICAuLi5cbiAgICAgICBiZXRhX3J1bGVzOlxuICAgICAgICYoYixkKSAtPiBlXG4gICAgICAgdGhlbiB3ZSdsbCBleHRlbmQgYSdzIHJ1bGUgdG8gdGhlIGZvbGxvd2luZ1xuICAgICAgIGEgIC0+ICBbYiwgIWMsIGQsIGVdXG4gICAgKi9cblxuICAgIC8vIGlzIGJldGFfcnVsZXMgYW4gYXJyYXkgb3IgYSBkaWN0aW9uYXJ5P1xuXG4gICAgY29uc3QgeF9pbXBsOiBIYXNoRGljdCA9IG5ldyBIYXNoRGljdCgpO1xuICAgIGZvciAoY29uc3QgeCBvZiBhbHBoYV9pbXBsaWNhdGlvbnMua2V5cygpKSB7XG4gICAgICAgIGNvbnN0IG5ld3NldCA9IG5ldyBIYXNoU2V0KCk7XG4gICAgICAgIG5ld3NldC5hZGRBcnIoYWxwaGFfaW1wbGljYXRpb25zLmdldCh4KS50b0FycmF5KCkpO1xuICAgICAgICBjb25zdCBpbXAgPSBuZXcgSW1wbGljYXRpb24obmV3c2V0LCBbXSk7XG4gICAgICAgIHhfaW1wbC5hZGQoeCwgaW1wKTtcbiAgICB9XG4gICAgZm9yIChjb25zdCBpdGVtIG9mIGJldGFfcnVsZXMpIHtcbiAgICAgICAgY29uc3QgYmNvbmQgPSBpdGVtLnA7XG4gICAgICAgIGZvciAoY29uc3QgYmsgb2YgYmNvbmQuYXJncykge1xuICAgICAgICAgICAgaWYgKHhfaW1wbC5oYXMoYmspKSB7XG4gICAgICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBjb25zdCBpbXAgPSBuZXcgSW1wbGljYXRpb24obmV3IEhhc2hTZXQoKSwgW10pO1xuICAgICAgICAgICAgeF9pbXBsLmFkZChiaywgaW1wKTtcbiAgICAgICAgfVxuICAgIH1cbiAgICAvLyBzdGF0aWMgZXh0ZW5zaW9ucyB0byBhbHBoYSBydWxlczpcbiAgICAvLyBBOiB4IC0+IGEsYiAgIEI6ICYoYSxiKSAtPiBjICA9PT4gIEE6IHggLT4gYSxiLGNcblxuICAgIGxldCBzZWVuX3N0YXRpY19leHRlbnNpb246IExvZ2ljID0gTG9naWMuVHJ1ZTtcbiAgICB3aGlsZSAoc2Vlbl9zdGF0aWNfZXh0ZW5zaW9uIGluc3RhbmNlb2YgVHJ1ZSkge1xuICAgICAgICBzZWVuX3N0YXRpY19leHRlbnNpb24gPSBMb2dpYy5GYWxzZTtcblxuICAgICAgICBmb3IgKGNvbnN0IGltcGwgb2YgYmV0YV9ydWxlcykge1xuICAgICAgICAgICAgY29uc3QgYmNvbmQgPSBpbXBsLnA7XG4gICAgICAgICAgICBjb25zdCBiaW1wbCA9IGltcGwucTtcbiAgICAgICAgICAgIGlmICghKGJjb25kIGluc3RhbmNlb2YgQW5kKSkge1xuICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcIkNvbmQgaXMgbm90IEFuZFwiKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGNvbnN0IGJhcmdzID0gbmV3IEhhc2hTZXQoYmNvbmQuYXJncyk7XG4gICAgICAgICAgICBmb3IgKGNvbnN0IGl0ZW0gb2YgeF9pbXBsLmVudHJpZXMoKSkge1xuICAgICAgICAgICAgICAgIGNvbnN0IHggPSBpdGVtWzBdO1xuICAgICAgICAgICAgICAgIGNvbnN0IGltcGwgPSBpdGVtWzFdO1xuICAgICAgICAgICAgICAgIGxldCB4aW1wbHMgPSBpbXBsLnA7XG4gICAgICAgICAgICAgICAgY29uc3QgeF9hbGwgPSB4aW1wbHMuY2xvbmUoKVxuICAgICAgICAgICAgICAgIHhfYWxsLmFkZCh4KTtcbiAgICAgICAgICAgICAgICAvLyBBOiAuLi4gLT4gYSAgIEI6ICYoLi4uKSAtPiBhICBpcyBub24taW5mb3JtYXRpdmVcbiAgICAgICAgICAgICAgICBpZiAoIXhfYWxsLmhhcyhiaW1wbCkgJiYgVXRpbC5pc1N1YnNldChiYXJncy50b0FycmF5KCksIHhfYWxsLnRvQXJyYXkoKSkpIHtcbiAgICAgICAgICAgICAgICAgICAgeGltcGxzLmFkZChiaW1wbCk7XG5cbiAgICAgICAgICAgICAgICAgICAgLy8gd2UgaW50cm9kdWNlZCBuZXcgaW1wbGljYXRpb24gLSBub3cgd2UgaGF2ZSB0byByZXN0b3JlXG4gICAgICAgICAgICAgICAgICAgIC8vIGNvbXBsZXRlbmVzcyBvZiB0aGUgd2hvbGUgc2V0LlxuXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGJpbXBsX2ltcGwgPSB4X2ltcGwuZ2V0KGJpbXBsKTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGJpbXBsX2ltcGwgIT0gbnVsbCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgeGltcGxzIHw9IGJpbXBsX2ltcGxbMF07XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgc2Vlbl9zdGF0aWNfZXh0ZW5zaW9uID0gTG9naWMuVHJ1ZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG4gICAgLy8gYXR0YWNoIGJldGEtbm9kZXMgd2hpY2ggY2FuIGJlIHBvc3NpYmx5IHRyaWdnZXJlZCBieSBhbiBhbHBoYS1jaGFpblxuICAgIGZvciAobGV0IGJpZHggPSAwOyBiaWR4IDwgYmV0YV9ydWxlcy5sZW5ndGg7IGJpZHgrKykge1xuICAgICAgICBjb25zdCBpbXBsID0gYmV0YV9ydWxlc1tiaWR4XTtcbiAgICAgICAgY29uc3QgYmNvbmQgPSBpbXBsLnA7XG4gICAgICAgIGNvbnN0IGJpbXBsID0gaW1wbC5xO1xuICAgICAgICBjb25zdCBiYXJncyA9IG5ldyBIYXNoU2V0KGJjb25kLmFyZ3MpO1xuICAgICAgICBmb3IgKGNvbnN0IGl0ZW0gb2YgeF9pbXBsLmVudHJpZXMoKSkge1xuICAgICAgICAgICAgY29uc3QgeCA9IGl0ZW1bMF07XG4gICAgICAgICAgICBjb25zdCB2YWx1ZTogSW1wbGljYXRpb24gPSBpdGVtWzFdO1xuICAgICAgICAgICAgY29uc3QgeGltcGxzID0gdmFsdWUucDtcbiAgICAgICAgICAgIGNvbnN0IGJiID0gdmFsdWUucTtcbiAgICAgICAgICAgIGNvbnN0IHhfYWxsID0geGltcGxzLmNsb25lKClcbiAgICAgICAgICAgIHhfYWxsLmFkZCh4KTtcbiAgICAgICAgICAgIGlmICh4X2FsbC5oYXMoYmltcGwpKSB7XG4gICAgICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoeF9hbGwudG9BcnJheSgpLnNvbWUoKGU6IGFueSkgPT4gKGJhcmdzLmhhcyhOb3QuTmV3KGUpKSB8fCBVdGlsLmhhc2hLZXkoTm90Lk5ldyhlKSkgPT09IFV0aWwuaGFzaEtleShiaW1wbCkpKSkge1xuICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKGJhcmdzLmludGVyc2VjdHMoeF9hbGwpKSB7XG4gICAgICAgICAgICAgICAgYmIucHVzaChiaWR4KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4geF9pbXBsO1xufVxuXG5cbmZ1bmN0aW9uIHJ1bGVzXzJwcmVyZXEocnVsZXM6IFNldERlZmF1bHREaWN0KSB7XG4gICAgLyogYnVpbGQgcHJlcmVxdWlzaXRlcyB0YWJsZSBmcm9tIHJ1bGVzXG4gICAgICAgRGVzY3JpcHRpb24gYnkgZXhhbXBsZVxuICAgICAgIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAgICBnaXZlbiBzZXQgb2YgbG9naWMgcnVsZXM6XG4gICAgICAgICBhIC0+IGIsIGNcbiAgICAgICAgIGIgLT4gY1xuICAgICAgIHdlIGJ1aWxkIHByZXJlcXVpc2l0ZXMgKGZyb20gd2hhdCBwb2ludHMgc29tZXRoaW5nIGNhbiBiZSBkZWR1Y2VkKTpcbiAgICAgICAgIGIgPC0gYVxuICAgICAgICAgYyA8LSBhLCBiXG4gICAgICAgcnVsZXM6ICAge30gb2YgYSAtPiBbYiwgYywgLi4uXVxuICAgICAgIHJldHVybjogIHt9IG9mIGMgPC0gW2EsIGIsIC4uLl1cbiAgICAgICBOb3RlIGhvd2V2ZXIsIHRoYXQgdGhpcyBwcmVyZXF1aXNpdGVzIG1heSBiZSAqbm90KiBlbm91Z2ggdG8gcHJvdmUgYVxuICAgICAgIGZhY3QuIEFuIGV4YW1wbGUgaXMgJ2EgLT4gYicgcnVsZSwgd2hlcmUgcHJlcmVxKGEpIGlzIGIsIGFuZCBwcmVyZXEoYilcbiAgICAgICBpcyBhLiBUaGF0J3MgYmVjYXVzZSBhPVQgLT4gYj1ULCBhbmQgYj1GIC0+IGE9RiwgYnV0IGE9RiAtPiBiPT9cbiAgICAqL1xuXG4gICAgY29uc3QgcHJlcmVxID0gbmV3IFNldERlZmF1bHREaWN0KCk7XG4gICAgZm9yIChjb25zdCBpdGVtIG9mIHJ1bGVzLmVudHJpZXMoKSkge1xuICAgICAgICBsZXQgYSA9IGl0ZW1bMF0ucDtcbiAgICAgICAgY29uc3QgaW1wbCA9IGl0ZW1bMV07XG4gICAgICAgIGlmIChhIGluc3RhbmNlb2YgTm90KSB7XG4gICAgICAgICAgICBhID0gYS5hcmdzWzBdO1xuICAgICAgICB9XG4gICAgICAgIGZvciAoY29uc3QgaXRlbSBvZiBpbXBsLnRvQXJyYXkoKSkge1xuICAgICAgICAgICAgbGV0IGkgPSBpdGVtLnA7XG4gICAgICAgICAgICBpZiAoaSBpbnN0YW5jZW9mIE5vdCkge1xuICAgICAgICAgICAgICAgIGkgPSBpLmFyZ3NbMF07XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBjb25zdCB0b0FkZCA9IHByZXJlcS5nZXQoaSk7XG4gICAgICAgICAgICB0b0FkZC5hZGQoYSk7XG4gICAgICAgICAgICBwcmVyZXEuYWRkKGksIHRvQWRkKTtcbiAgICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gcHJlcmVxO1xufVxuXG5cbi8vIC8vLy8vLy8vLy8vLy8vLy9cbi8vIFJVTEVTIFBST1ZFUiAvL1xuLy8gLy8vLy8vLy8vLy8vLy8vL1xuXG5jbGFzcyBUYXV0b2xvZ3lEZXRlY3RlZCBleHRlbmRzIEVycm9yIHtcbiAgICBhcmdzO1xuXG4gICAgY29uc3RydWN0b3IoLi4uYXJnczogYW55W10pIHtcbiAgICAgICAgc3VwZXIoKTtcbiAgICAgICAgdGhpcy5hcmdzID0gYXJncztcbiAgICB9XG4gICAgLy8gKGludGVybmFsKSBQcm92ZXIgdXNlcyBpdCBmb3IgcmVwb3J0aW5nIGRldGVjdGVkIHRhdXRvbG9neVxufVxuXG5jbGFzcyBQcm92ZXIge1xuICAgIC8qIGFpIC0gcHJvdmVyIG9mIGxvZ2ljIHJ1bGVzXG4gICAgICAgZ2l2ZW4gYSBzZXQgb2YgaW5pdGlhbCBydWxlcywgUHJvdmVyIHRyaWVzIHRvIHByb3ZlIGFsbCBwb3NzaWJsZSBydWxlc1xuICAgICAgIHdoaWNoIGZvbGxvdyBmcm9tIGdpdmVuIHByZW1pc2VzLlxuICAgICAgIEFzIGEgcmVzdWx0IHByb3ZlZF9ydWxlcyBhcmUgYWx3YXlzIGVpdGhlciBpbiBvbmUgb2YgdHdvIGZvcm1zOiBhbHBoYSBvclxuICAgICAgIGJldGE6XG4gICAgICAgQWxwaGEgcnVsZXNcbiAgICAgICAtLS0tLS0tLS0tLVxuICAgICAgIFRoaXMgYXJlIHJ1bGVzIG9mIHRoZSBmb3JtOjpcbiAgICAgICAgIGEgLT4gYiAmIGMgJiBkICYgLi4uXG4gICAgICAgQmV0YSBydWxlc1xuICAgICAgIC0tLS0tLS0tLS1cbiAgICAgICBUaGlzIGFyZSBydWxlcyBvZiB0aGUgZm9ybTo6XG4gICAgICAgICAmKGEsYiwuLi4pIC0+IGMgJiBkICYgLi4uXG4gICAgICAgaS5lLiBiZXRhIHJ1bGVzIGFyZSBqb2luIGNvbmRpdGlvbnMgdGhhdCBzYXkgdGhhdCBzb21ldGhpbmcgZm9sbG93cyB3aGVuXG4gICAgICAgKnNldmVyYWwqIGZhY3RzIGFyZSB0cnVlIGF0IHRoZSBzYW1lIHRpbWUuXG4gICAgKi9cblxuICAgIHByb3ZlZF9ydWxlczogYW55W107XG4gICAgX3J1bGVzX3NlZW47XG5cbiAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICAgICAgdGhpcy5wcm92ZWRfcnVsZXMgPSBbXTtcbiAgICAgICAgdGhpcy5fcnVsZXNfc2VlbiA9IG5ldyBIYXNoU2V0KCk7XG4gICAgfVxuXG4gICAgc3BsaXRfYWxwaGFfYmV0YSgpIHtcbiAgICAgICAgLy8gc3BsaXQgcHJvdmVkIHJ1bGVzIGludG8gYWxwaGEgYW5kIGJldGEgY2hhaW5zXG4gICAgICAgIGNvbnN0IHJ1bGVzX2FscGhhID0gW107IC8vIGEgICAgICAtPiBiXG4gICAgICAgIGNvbnN0IHJ1bGVzX2JldGEgPSBbXTsgLy8gJiguLi4pIC0+IGJcbiAgICAgICAgZm9yIChjb25zdCBpbXBsIG9mIHRoaXMucHJvdmVkX3J1bGVzKSB7XG4gICAgICAgICAgICBjb25zdCBhID0gaW1wbC5wO1xuICAgICAgICAgICAgY29uc3QgYiA9IGltcGwucTtcbiAgICAgICAgICAgIGlmIChhIGluc3RhbmNlb2YgQW5kKSB7XG4gICAgICAgICAgICAgICAgcnVsZXNfYmV0YS5wdXNoKG5ldyBJbXBsaWNhdGlvbihhLCBiKSk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHJ1bGVzX2FscGhhLnB1c2gobmV3IEltcGxpY2F0aW9uKGEsIGIpKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gW3J1bGVzX2FscGhhLCBydWxlc19iZXRhXTtcbiAgICB9XG5cbiAgICBydWxlc19hbHBoYSgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuc3BsaXRfYWxwaGFfYmV0YSgpWzBdO1xuICAgIH1cblxuICAgIHJ1bGVzX2JldGEoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLnNwbGl0X2FscGhhX2JldGEoKVsxXTtcbiAgICB9XG5cbiAgICBwcm9jZXNzX3J1bGUoYTogYW55LCBiOiBhbnkpIHtcbiAgICAgICAgLy8gcHJvY2VzcyBhIC0+IGIgcnVsZSAgLT4gIFRPRE8gd3JpdGUgbW9yZT9cbiAgICAgICAgaWYgKCFhIHx8IChiIGluc3RhbmNlb2YgVHJ1ZSB8fCBiIGluc3RhbmNlb2YgRmFsc2UpKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGEgaW5zdGFuY2VvZiBUcnVlIHx8IGEgaW5zdGFuY2VvZiBGYWxzZSkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIGlmICh0aGlzLl9ydWxlc19zZWVuLmhhcyhuZXcgSW1wbGljYXRpb24oYSwgYikpKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aGlzLl9ydWxlc19zZWVuLmFkZChuZXcgSW1wbGljYXRpb24oYSwgYikpO1xuICAgICAgICB9XG4gICAgICAgIC8vIHRoaXMgaXMgdGhlIGNvcmUgb2YgdGhlIHByb2Nlc3NpbmdcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIHRoaXMuX3Byb2Nlc3NfcnVsZShhLCBiKTtcbiAgICAgICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgICAgICAgIGlmICghKGVycm9yIGluc3RhbmNlb2YgVGF1dG9sb2d5RGV0ZWN0ZWQpKSB7XG4gICAgICAgICAgICAgICAgdGhyb3cgRXJyb3I7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBfcHJvY2Vzc19ydWxlKGE6IGFueSwgYjogYW55KSB7XG4gICAgICAgIC8vIHJpZ2h0IHBhcnQgZmlyc3RcblxuICAgICAgICAvLyBhIC0+IGIgJiBjICAgLS0+ICAgIGEtPiBiICA7ICBhIC0+IGNcblxuICAgICAgICAvLyAgKD8pIEZJWE1FIHRoaXMgaXMgb25seSBjb3JyZWN0IHdoZW4gYiAmIGMgIT0gbnVsbCAhXG5cbiAgICAgICAgaWYgKGIgaW5zdGFuY2VvZiBBbmQpIHtcbiAgICAgICAgICAgIGZvciAoY29uc3QgYmFyZyBvZiBiLmFyZ3MpIHtcbiAgICAgICAgICAgICAgICB0aGlzLnByb2Nlc3NfcnVsZShhLCBiYXJnKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIGlmIChiIGluc3RhbmNlb2YgT3IpIHtcbiAgICAgICAgICAgIC8vIGRldGVjdCB0YXV0b2xvZ3kgZmlyc3RcbiAgICAgICAgICAgIGlmICghKGEgaW5zdGFuY2VvZiBMb2dpYykpIHsgLy8gYXRvbVxuICAgICAgICAgICAgICAgIC8vIHRhdXRvbG9neTogIGEgLT4gYXxjfC4uLlxuICAgICAgICAgICAgICAgIGlmIChiLmFyZ3MuaW5jbHVkZXMoYSkpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhyb3cgbmV3IFRhdXRvbG9neURldGVjdGVkKGEsIGIsIFwiYSAtPiBhfGN8Li4uXCIpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGNvbnN0IG5vdF9iYXJnczogYW55W10gPSBbXTtcbiAgICAgICAgICAgIGZvciAoY29uc3QgYmFyZyBvZiBiLmFyZ3MpIHtcbiAgICAgICAgICAgICAgICBub3RfYmFyZ3MucHVzaChOb3QuTmV3KGJhcmcpKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHRoaXMucHJvY2Vzc19ydWxlKEFuZC5OZXcoLi4ubm90X2JhcmdzKSwgTm90Lk5ldyhhKSk7XG5cbiAgICAgICAgICAgIGZvciAobGV0IGJpZHggPSAwOyBiaWR4IDwgYi5hcmdzLmxlbmd0aDsgYmlkeCsrKSB7XG4gICAgICAgICAgICAgICAgY29uc3QgYmFyZyA9IGIuYXJnc1tiaWR4XTtcbiAgICAgICAgICAgICAgICBjb25zdCBicmVzdCA9IGIuYXJncy5zbGljZSgwLCBiaWR4KS5jb25jYXQoYi5hcmdzLnNsaWNlKGJpZHggKyAxKSk7XG4gICAgICAgICAgICAgICAgLy8gY29uc3QgYnJlc3QgPSBbLi4uYi5hcmdzXS5zcGxpY2UoYmlkeCwgMSk7XG4gICAgICAgICAgICAgICAgdGhpcy5wcm9jZXNzX3J1bGUoQW5kLk5ldyhhLCBOb3QuTmV3KGJhcmcpKSwgT3IuTmV3KC4uLmJyZXN0KSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSBpZiAoYSBpbnN0YW5jZW9mIEFuZCkge1xuICAgICAgICAgICAgaWYgKGEuYXJncy5pbmNsdWRlcyhiKSkge1xuICAgICAgICAgICAgICAgIHRocm93IG5ldyBUYXV0b2xvZ3lEZXRlY3RlZChhLCBiLCBcImEgJiBiIC0+IGFcIik7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB0aGlzLnByb3ZlZF9ydWxlcy5wdXNoKG5ldyBJbXBsaWNhdGlvbihhLCBiKSk7XG4gICAgICAgICAgICAvLyBYWFggTk9URSBhdCBwcmVzZW50IHdlIGlnbm9yZSAgIWMgLT4gIWEgfCAhYlxuICAgICAgICB9IGVsc2UgaWYgKGEgaW5zdGFuY2VvZiBPcikge1xuICAgICAgICAgICAgaWYgKGEuYXJncy5pbmNsdWRlcyhiKSkge1xuICAgICAgICAgICAgICAgIHRocm93IG5ldyBUYXV0b2xvZ3lEZXRlY3RlZChhLCBiLCBcImEgJiBiIC0+IGFcIik7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBmb3IgKGNvbnN0IGFhcmcgb2YgYS5hcmdzKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5wcm9jZXNzX3J1bGUoYWFyZywgYik7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAvLyBib3RoICdhJyBhbmQgJ2InIGFyZSBhdG9tc1xuICAgICAgICAgICAgdGhpcy5wcm92ZWRfcnVsZXMucHVzaChuZXcgSW1wbGljYXRpb24oYSwgYikpOyAvLyBhIC0+IGJcbiAgICAgICAgICAgIHRoaXMucHJvdmVkX3J1bGVzLnB1c2gobmV3IEltcGxpY2F0aW9uKE5vdC5OZXcoYiksIE5vdC5OZXcoYSkpKTtcbiAgICAgICAgfVxuICAgIH1cbn1cblxuLy8gLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cblxuZXhwb3J0IGNsYXNzIEZhY3RSdWxlcyB7XG4gICAgLyogUnVsZXMgdGhhdCBkZXNjcmliZSBob3cgdG8gZGVkdWNlIGZhY3RzIGluIGxvZ2ljIHNwYWNlXG4gICAgV2hlbiBkZWZpbmVkLCB0aGVzZSBydWxlcyBhbGxvdyBpbXBsaWNhdGlvbnMgdG8gcXVpY2tseSBiZSBkZXRlcm1pbmVkXG4gICAgZm9yIGEgc2V0IG9mIGZhY3RzLiBGb3IgdGhpcyBwcmVjb21wdXRlZCBkZWR1Y3Rpb24gdGFibGVzIGFyZSB1c2VkLlxuICAgIHNlZSBgZGVkdWNlX2FsbF9mYWN0c2AgICAoZm9yd2FyZC1jaGFpbmluZylcbiAgICBBbHNvIGl0IGlzIHBvc3NpYmxlIHRvIGdhdGhlciBwcmVyZXF1aXNpdGVzIGZvciBhIGZhY3QsIHdoaWNoIGlzIHRyaWVkXG4gICAgdG8gYmUgcHJvdmVuLiAgICAoYmFja3dhcmQtY2hhaW5pbmcpXG4gICAgRGVmaW5pdGlvbiBTeW50YXhcbiAgICAtLS0tLS0tLS0tLS0tLS0tLVxuICAgIGEgLT4gYiAgICAgICAtLSBhPVQgLT4gYj1UICAoYW5kIGF1dG9tYXRpY2FsbHkgYj1GIC0+IGE9RilcbiAgICBhIC0+ICFiICAgICAgLS0gYT1UIC0+IGI9RlxuICAgIGEgPT0gYiAgICAgICAtLSBhIC0+IGIgJiBiIC0+IGFcbiAgICBhIC0+IGIgJiBjICAgLS0gYT1UIC0+IGI9VCAmIGM9VFxuICAgICMgVE9ETyBiIHwgY1xuICAgIEludGVybmFsc1xuICAgIC0tLS0tLS0tLVxuICAgIC5mdWxsX2ltcGxpY2F0aW9uc1trLCB2XTogYWxsIHRoZSBpbXBsaWNhdGlvbnMgb2YgZmFjdCBrPXZcbiAgICAuYmV0YV90cmlnZ2Vyc1trLCB2XTogYmV0YSBydWxlcyB0aGF0IG1pZ2h0IGJlIHRyaWdnZXJlZCB3aGVuIGs9dlxuICAgIC5wcmVyZXEgIC0tIHt9IGsgPC0gW10gb2YgaydzIHByZXJlcXVpc2l0ZXNcbiAgICAuZGVmaW5lZF9mYWN0cyAtLSBzZXQgb2YgZGVmaW5lZCBmYWN0IG5hbWVzXG4gICAgKi9cblxuICAgIGJldGFfcnVsZXM6IGFueVtdO1xuICAgIGRlZmluZWRfZmFjdHM7XG4gICAgZnVsbF9pbXBsaWNhdGlvbnM7XG4gICAgYmV0YV90cmlnZ2VycztcbiAgICBwcmVyZXE7XG5cbiAgICBjb25zdHJ1Y3RvcihydWxlczogYW55W10gfCBzdHJpbmcpIHtcbiAgICAgICAgLy8gQ29tcGlsZSBydWxlcyBpbnRvIGludGVybmFsIGxvb2t1cCB0YWJsZXNcbiAgICAgICAgaWYgKHR5cGVvZiBydWxlcyA9PT0gXCJzdHJpbmdcIikge1xuICAgICAgICAgICAgcnVsZXMgPSBydWxlcy5zcGxpdChcIlxcblwiKTtcbiAgICAgICAgfVxuICAgICAgICAvLyAtLS0gcGFyc2UgYW5kIHByb2Nlc3MgcnVsZXMgLS0tXG4gICAgICAgIGNvbnN0IFA6IFByb3ZlciA9IG5ldyBQcm92ZXI7XG5cbiAgICAgICAgZm9yIChjb25zdCBydWxlIG9mIHJ1bGVzKSB7XG4gICAgICAgICAgICAvLyBYWFggYGFgIGlzIGhhcmRjb2RlZCB0byBiZSBhbHdheXMgYXRvbVxuICAgICAgICAgICAgbGV0IFthLCBvcCwgYl0gPSBVdGlsLnNwbGl0TG9naWNTdHIocnVsZSk7IFxuICAgICAgICAgICAgYSA9IExvZ2ljLmZyb21zdHJpbmcoYSk7XG4gICAgICAgICAgICBiID0gTG9naWMuZnJvbXN0cmluZyhiKTtcbiAgICAgICAgICAgIGlmIChvcCA9PT0gXCItPlwiKSB7XG4gICAgICAgICAgICAgICAgUC5wcm9jZXNzX3J1bGUoYSwgYik7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKG9wID09PSBcIj09XCIpIHtcbiAgICAgICAgICAgICAgICBQLnByb2Nlc3NfcnVsZShhLCBiKTtcbiAgICAgICAgICAgICAgICBQLnByb2Nlc3NfcnVsZShiLCBhKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwidW5rbm93biBvcCBcIiArIG9wKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIC8vIC0tLSBidWlsZCBkZWR1Y3Rpb24gbmV0d29ya3MgLS0tXG5cbiAgICAgICAgdGhpcy5iZXRhX3J1bGVzID0gW107XG4gICAgICAgIGZvciAoY29uc3QgaXRlbSBvZiBQLnJ1bGVzX2JldGEoKSkge1xuICAgICAgICAgICAgY29uc3QgYmNvbmQgPSBpdGVtLnA7XG4gICAgICAgICAgICBjb25zdCBiaW1wbCA9IGl0ZW0ucTtcbiAgICAgICAgICAgIGNvbnN0IHBhaXJzOiBIYXNoU2V0ID0gbmV3IEhhc2hTZXQoKTtcbiAgICAgICAgICAgIGJjb25kLmFyZ3MuZm9yRWFjaCgoYTogYW55KSA9PiBwYWlycy5hZGQoX2FzX3BhaXJ2MihhKSkpO1xuICAgICAgICAgICAgdGhpcy5iZXRhX3J1bGVzLnB1c2gobmV3IEltcGxpY2F0aW9uKHBhaXJzLCBfYXNfcGFpcnYyKGJpbXBsKSkpO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gZGVkdWNlIGFscGhhIGltcGxpY2F0aW9uc1xuICAgICAgICBjb25zdCBpbXBsX2EgPSBkZWR1Y2VfYWxwaGFfaW1wbGljYXRpb25zKFAucnVsZXNfYWxwaGEoKSk7XG5cbiAgICAgICAgLy8gbm93OlxuICAgICAgICAvLyAtIGFwcGx5IGJldGEgcnVsZXMgdG8gYWxwaGEgY2hhaW5zICAoc3RhdGljIGV4dGVuc2lvbiksIGFuZFxuICAgICAgICAvLyAtIGZ1cnRoZXIgYXNzb2NpYXRlIGJldGEgcnVsZXMgdG8gYWxwaGEgY2hhaW4gKGZvciBpbmZlcmVuY2VcbiAgICAgICAgLy8gYXQgcnVudGltZSlcblxuICAgICAgICBjb25zdCBpbXBsX2FiID0gYXBwbHlfYmV0YV90b19hbHBoYV9yb3V0ZShpbXBsX2EsIFAucnVsZXNfYmV0YSgpKTtcblxuICAgICAgICAvLyBleHRyYWN0IGRlZmluZWQgZmFjdCBuYW1lc1xuICAgICAgICB0aGlzLmRlZmluZWRfZmFjdHMgPSBuZXcgSGFzaFNldCgpO1xuXG5cbiAgICAgICAgZm9yIChjb25zdCBrIG9mIGltcGxfYWIua2V5cygpKSB7XG4gICAgICAgICAgICB0aGlzLmRlZmluZWRfZmFjdHMuYWRkKF9iYXNlX2ZhY3QoaykpO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gYnVpbGQgcmVscyAoZm9yd2FyZCBjaGFpbnMpXG5cbiAgICAgICAgY29uc3QgZnVsbF9pbXBsaWNhdGlvbnMgPSBuZXcgU2V0RGVmYXVsdERpY3QoKTtcbiAgICAgICAgY29uc3QgYmV0YV90cmlnZ2VycyA9IG5ldyBBcnJEZWZhdWx0RGljdCgpO1xuICAgICAgICBmb3IgKGNvbnN0IGl0ZW0gb2YgaW1wbF9hYi5lbnRyaWVzKCkpIHtcbiAgICAgICAgICAgIGNvbnN0IGsgPWl0ZW1bMF07XG4gICAgICAgICAgICBjb25zdCB2YWwgPSBpdGVtWzFdO1xuICAgICAgICAgICAgY29uc3QgaW1wbDogSGFzaFNldCA9IHZhbC5wO1xuICAgICAgICAgICAgY29uc3QgYmV0YWlkeHMgPSB2YWwucTtcbiAgICAgICAgICAgIGNvbnN0IHNldFRvQWRkID0gbmV3IEhhc2hTZXQoKTtcbiAgICAgICAgICAgIGltcGwudG9BcnJheSgpLmZvckVhY2goKGU6IGFueSkgPT4gc2V0VG9BZGQuYWRkKF9hc19wYWlydjIoZSkpKTtcbiAgICAgICAgICAgIGZ1bGxfaW1wbGljYXRpb25zLmFkZChfYXNfcGFpcnYyKGspLCBzZXRUb0FkZCk7XG4gICAgICAgICAgICBiZXRhX3RyaWdnZXJzLmFkZChfYXNfcGFpcnYyKGspLCBiZXRhaWR4cyk7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5mdWxsX2ltcGxpY2F0aW9ucyA9IGZ1bGxfaW1wbGljYXRpb25zO1xuXG4gICAgICAgIHRoaXMuYmV0YV90cmlnZ2VycyA9IGJldGFfdHJpZ2dlcnM7XG5cbiAgICAgICAgLy8gYnVpbGQgcHJlcmVxIChiYWNrd2FyZCBjaGFpbnMpXG4gICAgICAgIGNvbnN0IHByZXJlcSA9IG5ldyBTZXREZWZhdWx0RGljdCgpO1xuICAgICAgICBjb25zdCByZWxfcHJlcmVxID0gcnVsZXNfMnByZXJlcShmdWxsX2ltcGxpY2F0aW9ucyk7XG4gICAgICAgIGZvciAoY29uc3QgaXRlbSBvZiByZWxfcHJlcmVxLmVudHJpZXMoKSkge1xuICAgICAgICAgICAgY29uc3QgayA9IGl0ZW1bMF07XG4gICAgICAgICAgICBjb25zdCBwaXRlbXMgPSBpdGVtWzFdO1xuICAgICAgICAgICAgY29uc3QgdG9BZGQgPSBwcmVyZXEuZ2V0KGspO1xuICAgICAgICAgICAgdG9BZGQuYWRkKHBpdGVtcyk7XG4gICAgICAgICAgICBwcmVyZXEuYWRkKGssIHRvQWRkKTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLnByZXJlcSA9IHByZXJlcTtcbiAgICB9XG59XG5cblxuY2xhc3MgSW5jb25zaXN0ZW50QXNzdW1wdGlvbnMgZXh0ZW5kcyBFcnJvciB7XG4gICAgYXJncztcblxuICAgIGNvbnN0cnVjdG9yKC4uLmFyZ3M6IGFueVtdKSB7XG4gICAgICAgIHN1cGVyKCk7XG4gICAgICAgIHRoaXMuYXJncyA9IGFyZ3M7XG4gICAgfVxuXG4gICAgc3RhdGljIF9fc3RyX18oLi4uYXJnczogYW55W10pIHtcbiAgICAgICAgY29uc3QgW2tiLCBmYWN0LCB2YWx1ZV0gPSBhcmdzO1xuICAgICAgICByZXR1cm4ga2IgKyBcIiwgXCIgKyBmYWN0ICsgXCI9XCIgKyB2YWx1ZTtcbiAgICB9XG59XG5cbmV4cG9ydCBjbGFzcyBGYWN0S0IgZXh0ZW5kcyBIYXNoRGljdCB7XG4gICAgLypcbiAgICBBIHNpbXBsZSBwcm9wb3NpdGlvbmFsIGtub3dsZWRnZSBiYXNlIHJlbHlpbmcgb24gY29tcGlsZWQgaW5mZXJlbmNlIHJ1bGVzLlxuICAgICovXG5cbiAgICBydWxlcztcblxuICAgIGNvbnN0cnVjdG9yKHJ1bGVzOiBhbnkpIHtcbiAgICAgICAgc3VwZXIoKTtcbiAgICAgICAgdGhpcy5ydWxlcyA9IHJ1bGVzO1xuICAgIH1cblxuICAgIF90ZWxsKGs6IGFueSwgdjogYW55KSB7XG4gICAgICAgIC8qIEFkZCBmYWN0IGs9diB0byB0aGUga25vd2xlZGdlIGJhc2UuXG4gICAgICAgIFJldHVybnMgVHJ1ZSBpZiB0aGUgS0IgaGFzIGFjdHVhbGx5IGJlZW4gdXBkYXRlZCwgRmFsc2Ugb3RoZXJ3aXNlLlxuICAgICAgICAqL1xuICAgICAgICBpZiAoayBpbiB0aGlzLmRpY3QgJiYgdHlwZW9mIHRoaXMuZ2V0KGspICE9PSBcInVuZGVmaW5lZFwiKSB7XG4gICAgICAgICAgICBpZiAodGhpcy5nZXQoaykgPT09IHYpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gTG9naWMuRmFsc2U7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHRocm93IG5ldyBJbmNvbnNpc3RlbnRBc3N1bXB0aW9ucyh0aGlzLCBrLCB2KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMuYWRkKGssIHYpO1xuICAgICAgICAgICAgcmV0dXJuIExvZ2ljLlRydWU7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvLyAvLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXG4gICAgLy8qIFRoaXMgaXMgdGhlIHdvcmtob3JzZSwgc28ga2VlcCBpdCAqZmFzdCouIC8vXG4gICAgLy8gLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xuXG4gICAgZGVkdWNlX2FsbF9mYWN0cyhmYWN0czogYW55KSB7XG4gICAgICAgIC8qXG4gICAgICAgIFVwZGF0ZSB0aGUgS0Igd2l0aCBhbGwgdGhlIGltcGxpY2F0aW9ucyBvZiBhIGxpc3Qgb2YgZmFjdHMuXG4gICAgICAgIEZhY3RzIGNhbiBiZSBzcGVjaWZpZWQgYXMgYSBkaWN0aW9uYXJ5IG9yIGFzIGEgbGlzdCBvZiAoa2V5LCB2YWx1ZSlcbiAgICAgICAgcGFpcnMuXG4gICAgICAgICovXG4gICAgICAgIC8vIGtlZXAgZnJlcXVlbnRseSB1c2VkIGF0dHJpYnV0ZXMgbG9jYWxseSwgc28gd2UnbGwgYXZvaWQgZXh0cmFcbiAgICAgICAgLy8gYXR0cmlidXRlIGFjY2VzcyBvdmVyaGVhZFxuXG4gICAgICAgIGNvbnN0IGZ1bGxfaW1wbGljYXRpb25zOiBTZXREZWZhdWx0RGljdCA9IHRoaXMucnVsZXMuZnVsbF9pbXBsaWNhdGlvbnM7XG4gICAgICAgIGNvbnN0IGJldGFfdHJpZ2dlcnM6IEFyckRlZmF1bHREaWN0ID0gdGhpcy5ydWxlcy5iZXRhX3RyaWdnZXJzO1xuICAgICAgICBjb25zdCBiZXRhX3J1bGVzOiBhbnlbXSA9IHRoaXMucnVsZXMuYmV0YV9ydWxlcztcblxuICAgICAgICBpZiAoZmFjdHMgaW5zdGFuY2VvZiBIYXNoRGljdCB8fCBmYWN0cyBpbnN0YW5jZW9mIFN0ZEZhY3RLQikge1xuICAgICAgICAgICAgZmFjdHMgPSBmYWN0cy5lbnRyaWVzKCk7XG4gICAgICAgIH1cblxuICAgICAgICB3aGlsZSAoZmFjdHMubGVuZ3RoICE9IDApIHtcbiAgICAgICAgICAgIGNvbnN0IGJldGFfbWF5dHJpZ2dlciA9IG5ldyBIYXNoU2V0KCk7XG5cbiAgICAgICAgICAgIC8vIC0tLSBhbHBoYSBjaGFpbnMgLS0tXG4gICAgICAgICAgICBmb3IgKGNvbnN0IGl0ZW0gb2YgZmFjdHMpIHtcbiAgICAgICAgICAgICAgICBsZXQgaywgdjtcbiAgICAgICAgICAgICAgICBpZiAoaXRlbSBpbnN0YW5jZW9mIEltcGxpY2F0aW9uKSB7XG4gICAgICAgICAgICAgICAgICAgIGsgPSBpdGVtLnA7XG4gICAgICAgICAgICAgICAgICAgIHYgPSBpdGVtLnFcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBrID0gaXRlbVswXTtcbiAgICAgICAgICAgICAgICAgICAgdiA9IGl0ZW1bMV07XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGlmICh0aGlzLl90ZWxsKGssIHYpIGluc3RhbmNlb2YgRmFsc2UgfHwgKHR5cGVvZiB2ID09PSBcInVuZGVmaW5lZFwiKSkge1xuICAgICAgICAgICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAvLyBsb29rdXAgcm91dGluZyB0YWJsZXNcbiAgICAgICAgICAgICAgICBjb25zdCBhcnIgPSBmdWxsX2ltcGxpY2F0aW9ucy5nZXQobmV3IEltcGxpY2F0aW9uKGssIHYpKS50b0FycmF5KCk7XG4gICAgICAgICAgICAgICAgZm9yIChjb25zdCBpdGVtIG9mIGFycikge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLl90ZWxsKGl0ZW0ucCwgaXRlbS5xKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgY29uc3QgY3VycmltcCA9IGJldGFfdHJpZ2dlcnMuZ2V0KG5ldyBJbXBsaWNhdGlvbihrLCB2KSk7XG4gICAgICAgICAgICAgICAgaWYgKCEoY3VycmltcC5sZW5ndGggPT0gMCkpIHtcbiAgICAgICAgICAgICAgICAgICAgYmV0YV9tYXl0cmlnZ2VyLmFkZEFycihjdXJyaW1wKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICAvLyAtLS0gYmV0YSBjaGFpbnMgLS0tXG4gICAgICAgICAgICBmYWN0cyA9IFtdO1xuICAgICAgICAgICAgZm9yIChjb25zdCBiaWR4IG9mIGJldGFfbWF5dHJpZ2dlci50b0FycmF5KCkpIHtcbiAgICAgICAgICAgICAgICBjb25zdCBiZXRhX3J1bGUgPSBiZXRhX3J1bGVzW2JpZHhdO1xuICAgICAgICAgICAgICAgIGNvbnN0IGJjb25kID0gYmV0YV9ydWxlLnA7XG4gICAgICAgICAgICAgICAgY29uc3QgYmltcGwgPSBiZXRhX3J1bGUucTtcbiAgICAgICAgICAgICAgICBpZiAoYmNvbmQudG9BcnJheSgpLmV2ZXJ5KChpbXA6IGFueSkgPT4gdGhpcy5nZXQoaW1wLnApID09IGltcC5xKSkge1xuICAgICAgICAgICAgICAgICAgICBmYWN0cy5wdXNoKGJpbXBsKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG59XG4iLCAiLyogVGhlIGNvcmUncyBjb3JlLiAqL1xuXG4vKlxuTm90YWJsZSBjaGFuZ2VzIG1hZGUgKFdCIGFuZCBHTSlcbi0gUmVwbGFjZWQgYXJyYXkgb2YgY2xhc3NlcyB3aXRoIGRpY3Rpb25hcnkgZm9yIHF1aWNrZXIgaW5kZXggcmV0cmlldmFsc1xuLSBJbXBsZW1lbnRlZCBhIGNvbnN0cnVjdG9yIHN5c3RlbSBmb3IgYmFzaWNtZXRhIHJhdGhlciB0aGFuIF9fbmV3X19cbiovXG5cblxuaW1wb3J0IHtIYXNoU2V0fSBmcm9tIFwiLi91dGlsaXR5XCI7XG5cbi8vIHVzZWQgZm9yIGNhbm9uaWNhbCBvcmRlcmluZyBvZiBzeW1ib2xpYyBzZXF1ZW5jZXNcbi8vIHZpYSBfX2NtcF9fIG1ldGhvZDpcbi8vIEZJWE1FIHRoaXMgaXMgKnNvKiBpcnJlbGV2YW50IGFuZCBvdXRkYXRlZCFcblxuY29uc3Qgb3JkZXJpbmdfb2ZfY2xhc3NlczogUmVjb3JkPGFueSwgYW55PiA9IHtcbiAgICAvLyBzaW5nbGV0b24gbnVtYmVyc1xuICAgIFplcm86IDAsIE9uZTogMSwgSGFsZjogMiwgSW5maW5pdHk6IDMsIE5hTjogNCwgTmVnYXRpdmVPbmU6IDUsIE5lZ2F0aXZlSW5maW5pdHk6IDYsXG4gICAgLy8gbnVtYmVyc1xuICAgIEludGVnZXI6IDcsIFJhdGlvbmFsOiA4LCBGbG9hdDogOSxcbiAgICAvLyBzaW5nbGV0b24gbnVtYmVyc1xuICAgIEV4cDE6IDEwLCBQaTogMTEsIEltYWdpbmFyeVVuaXQ6IDEyLFxuICAgIC8vIHN5bWJvbHNcbiAgICBTeW1ib2w6IDEzLCBXaWxkOiAxNCwgVGVtcG9yYXJ5OiAxNSxcbiAgICAvLyBhcml0aG1ldGljIG9wZXJhdGlvbnNcbiAgICBQb3c6IDE2LCBNdWw6IDE3LCBBZGQ6IDE4LFxuICAgIC8vIGZ1bmN0aW9uIHZhbHVlc1xuICAgIERlcml2YXRpdmU6IDE5LCBJbnRlZ3JhbDogMjAsXG4gICAgLy8gZGVmaW5lZCBzaW5nbGV0b24gZnVuY3Rpb25zXG4gICAgQWJzOiAyMSwgU2lnbjogMjIsIFNxcnQ6IDIzLCBGbG9vcjogMjQsIENlaWxpbmc6IDI1LCBSZTogMjYsIEltOiAyNyxcbiAgICBBcmc6IDI4LCBDb25qdWdhdGU6IDI5LCBFeHA6IDMwLCBMb2c6IDMxLCBTaW46IDMyLCBDb3M6IDMzLCBUYW46IDM0LFxuICAgIENvdDogMzUsIEFTaW46IDM2LCBBQ29zOiAzNywgQVRhbjogMzgsIEFDb3Q6IDM5LCBTaW5oOiA0MCwgQ29zaDogNDEsXG4gICAgVGFuaDogNDIsIEFTaW5oOiA0MywgQUNvc2g6IDQ0LCBBVGFuaDogNDUsIEFDb3RoOiA0NixcbiAgICBSaXNpbmdGYWN0b3JpYWw6IDQ3LCBGYWxsaW5nRmFjdG9yaWFsOiA0OCwgZmFjdG9yaWFsOiA0OSwgYmlub21pYWw6IDUwLFxuICAgIEdhbW1hOiA1MSwgTG93ZXJHYW1tYTogNTIsIFVwcGVyR2FtYTogNTMsIFBvbHlHYW1tYTogNTQsIEVyZjogNTUsXG4gICAgLy8gc3BlY2lhbCBwb2x5bm9taWFsc1xuICAgIENoZWJ5c2hldjogNTYsIENoZWJ5c2hldjI6IDU3LFxuICAgIC8vIHVuZGVmaW5lZCBmdW5jdGlvbnNcbiAgICBGdW5jdGlvbjogNTgsIFdpbGRGdW5jdGlvbjogNTksXG4gICAgLy8gYW5vbnltb3VzIGZ1bmN0aW9uc1xuICAgIExhbWJkYTogNjAsXG4gICAgLy8gTGFuZGF1IE8gc3ltYm9sXG4gICAgT3JkZXI6IDYxLFxuICAgIC8vIHJlbGF0aW9uYWwgb3BlcmF0aW9uc1xuICAgIEVxdWFsbGl0eTogNjIsIFVuZXF1YWxpdHk6IDYzLCBTdHJpY3RHcmVhdGVyVGhhbjogNjQsIFN0cmljdExlc3NUaGFuOiA2NSxcbiAgICBHcmVhdGVyVGhhbjogNjYsIExlc3NUaGFuOiA2Nixcbn07XG5cblxuY2xhc3MgUmVnaXN0cnkge1xuICAgIC8qXG4gICAgQmFzZSBjbGFzcyBmb3IgcmVnaXN0cnkgb2JqZWN0cy5cblxuICAgIFJlZ2lzdHJpZXMgbWFwIGEgbmFtZSB0byBhbiBvYmplY3QgdXNpbmcgYXR0cmlidXRlIG5vdGF0aW9uLiBSZWdpc3RyeVxuICAgIGNsYXNzZXMgYmVoYXZlIHNpbmdsZXRvbmljYWxseTogYWxsIHRoZWlyIGluc3RhbmNlcyBzaGFyZSB0aGUgc2FtZSBzdGF0ZSxcbiAgICB3aGljaCBpcyBzdG9yZWQgaW4gdGhlIGNsYXNzIG9iamVjdC5cblxuICAgIEFsbCBzdWJjbGFzc2VzIHNob3VsZCBzZXQgYF9fc2xvdHNfXyA9ICgpYC5cbiAgICAqL1xuXG4gICAgc3RhdGljIGRpY3Q6IFJlY29yZDxhbnksIGFueT47XG5cbiAgICBhZGRBdHRyKG5hbWU6IGFueSwgb2JqOiBhbnkpIHtcbiAgICAgICAgUmVnaXN0cnkuZGljdFtuYW1lXSA9IG9iajtcbiAgICB9XG5cbiAgICBkZWxBdHRyKG5hbWU6IGFueSkge1xuICAgICAgICBkZWxldGUgUmVnaXN0cnkuZGljdFtuYW1lXTtcbiAgICB9XG59XG5cbi8vIEEgc2V0IGNvbnRhaW5pbmcgYWxsIFN5bVB5IGNsYXNzIG9iamVjdHNcbmNvbnN0IGFsbF9jbGFzc2VzID0gbmV3IEhhc2hTZXQoKTtcblxuY2xhc3MgQmFzaWNNZXRhIHtcbiAgICBfX3N5bXB5X186IGFueTtcblxuICAgIHN0YXRpYyByZWdpc3RlcihjbHM6IGFueSkge1xuICAgICAgICBhbGxfY2xhc3Nlcy5hZGQoY2xzKTtcbiAgICAgICAgY2xzLl9fc3ltcHlfXyA9IHRydWU7XG4gICAgfVxuXG4gICAgc3RhdGljIGNvbXBhcmUoc2VsZjogYW55LCBvdGhlcjogYW55KSB7XG4gICAgICAgIC8vIElmIHRoZSBvdGhlciBvYmplY3QgaXMgbm90IGEgQmFzaWMgc3ViY2xhc3MsIHRoZW4gd2UgYXJlIG5vdCBlcXVhbCB0b1xuICAgICAgICAvLyBpdC5cbiAgICAgICAgaWYgKCEob3RoZXIgaW5zdGFuY2VvZiBCYXNpY01ldGEpKSB7XG4gICAgICAgICAgICByZXR1cm4gLTE7XG4gICAgICAgIH1cbiAgICAgICAgY29uc3QgbjEgPSBzZWxmLmNvbnN0cnVjdG9yLm5hbWU7XG4gICAgICAgIGNvbnN0IG4yID0gb3RoZXIuY29uc3RydWN0b3IubmFtZTtcbiAgICAgICAgLy8gY2hlY2sgaWYgYm90aCBhcmUgaW4gdGhlIGNsYXNzZXMgZGljdGlvbmFyeVxuICAgICAgICBpZiAob3JkZXJpbmdfb2ZfY2xhc3Nlcy5oYXMobjEpICYmIG9yZGVyaW5nX29mX2NsYXNzZXMuaGFzKG4yKSkge1xuICAgICAgICAgICAgY29uc3QgaWR4MSA9IG9yZGVyaW5nX29mX2NsYXNzZXNbbjFdO1xuICAgICAgICAgICAgY29uc3QgaWR4MiA9IG9yZGVyaW5nX29mX2NsYXNzZXNbbjJdO1xuICAgICAgICAgICAgLy8gdGhlIGNsYXNzIHdpdGggdGhlIGxhcmdlciBpbmRleCBpcyBncmVhdGVyXG4gICAgICAgICAgICByZXR1cm4gTWF0aC5zaWduKGlkeDEgLSBpZHgyKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAobjEgPiBuMikge1xuICAgICAgICAgICAgcmV0dXJuIDE7XG4gICAgICAgIH0gZWxzZSBpZiAobjEgPT09IG4yKSB7XG4gICAgICAgICAgICByZXR1cm4gMDtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gLTE7XG4gICAgfVxuXG4gICAgbGVzc1RoYW4ob3RoZXI6IGFueSkge1xuICAgICAgICBpZiAoQmFzaWNNZXRhLmNvbXBhcmUoc2VsZiwgb3RoZXIpID09PSAtMSkge1xuICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cblxuICAgIGdyZWF0ZXJUaGFuKG90aGVyOiBhbnkpIHtcbiAgICAgICAgaWYgKEJhc2ljTWV0YS5jb21wYXJlKHNlbGYsIG90aGVyKSA9PT0gMSkge1xuICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbn1cblxuXG5leHBvcnQge0Jhc2ljTWV0YSwgUmVnaXN0cnl9O1xuXG4iLCAiLypcbk5vdGFibGUgY2hhbmdlcyBtYWRlIChhbmQgbm90ZXMpOlxuLSBNYW5hZ2VkUHJvcGVydGllcyByZXdvcmtlZCBhcyBub3JtYWwgY2xhc3MgLSBlYWNoIGNsYXNzIGlzIHJlZ2lzdGVyZWQgZGlyZWN0bHlcbiAgYWZ0ZXIgZGVmaW5lZFxuLSBNYW5hZ2VkUHJvcGVydGllcyB0cmFja3MgcHJvcGVydGllcyBvZiBiYXNlIGNsYXNzZXMgYnkgdHJhY2tpbmcgYWxsIHByb3BlcnRpZXNcbiAgKHNlZSBjb21tZW50cyB3aXRoaW4gY2xhc3MpXG4tIENsYXNzIHByb3BlcnRpZXMgZnJvbSBfZXZhbF9pcyBtZXRob2RzIGFyZSBhc3NpZ25lZCB0byBlYWNoIG9iamVjdCBpdHNlbGYgaW5cbiAgdGhlIEJhc2ljIGNvbnN0cnVjdG9yXG4tIENob29zaW5nIHRvIHJ1biBnZXRpdCgpIG9uIG1ha2VfcHJvcGVydHkgdG8gYWRkIGNvbnNpc3RlbmN5IGluIGFjY2Vzc2luZ1xuLSBUby1kbzogbWFrZSBhY2Nlc3NpbmcgcHJvcGVydGllcyBtb3JlIGNvbnNpc3RlbnQgKGkuZS4sIHNhbWUgc3ludGF4IGZvclxuICBhY2Vzc2luZyBzdGF0aWMgYW5kIG5vbi1zdGF0aWMgcHJvcGVydGllcylcbiovXG5cbmltcG9ydCB7RmFjdEtCLCBGYWN0UnVsZXN9IGZyb20gXCIuL2ZhY3RzXCI7XG5pbXBvcnQge0Jhc2ljTWV0YX0gZnJvbSBcIi4vY29yZVwiO1xuaW1wb3J0IHtIYXNoRGljdCwgSGFzaFNldCwgVXRpbH0gZnJvbSBcIi4vdXRpbGl0eVwiO1xuXG5cbmNvbnN0IF9hc3N1bWVfcnVsZXMgPSBuZXcgRmFjdFJ1bGVzKFtcbiAgICBcImludGVnZXIgLT4gcmF0aW9uYWxcIixcbiAgICBcInJhdGlvbmFsIC0+IHJlYWxcIixcbiAgICBcInJhdGlvbmFsIC0+IGFsZ2VicmFpY1wiLFxuICAgIFwiYWxnZWJyYWljIC0+IGNvbXBsZXhcIixcbiAgICBcInRyYW5zY2VuZGVudGFsID09IGNvbXBsZXggJiAhYWxnZWJyYWljXCIsXG4gICAgXCJyZWFsIC0+IGhlcm1pdGlhblwiLFxuICAgIFwiaW1hZ2luYXJ5IC0+IGNvbXBsZXhcIixcbiAgICBcImltYWdpbmFyeSAtPiBhbnRpaGVybWl0aWFuXCIsXG4gICAgXCJleHRlbmRlZF9yZWFsIC0+IGNvbW11dGF0aXZlXCIsXG4gICAgXCJjb21wbGV4IC0+IGNvbW11dGF0aXZlXCIsXG4gICAgXCJjb21wbGV4IC0+IGZpbml0ZVwiLFxuXG4gICAgXCJvZGQgPT0gaW50ZWdlciAmICFldmVuXCIsXG4gICAgXCJldmVuID09IGludGVnZXIgJiAhb2RkXCIsXG5cbiAgICBcInJlYWwgLT4gY29tcGxleFwiLFxuICAgIFwiZXh0ZW5kZWRfcmVhbCAtPiByZWFsIHwgaW5maW5pdGVcIixcbiAgICBcInJlYWwgPT0gZXh0ZW5kZWRfcmVhbCAmIGZpbml0ZVwiLFxuXG4gICAgXCJleHRlbmRlZF9yZWFsID09IGV4dGVuZGVkX25lZ2F0aXZlIHwgemVybyB8IGV4dGVuZGVkX3Bvc2l0aXZlXCIsXG4gICAgXCJleHRlbmRlZF9uZWdhdGl2ZSA9PSBleHRlbmRlZF9ub25wb3NpdGl2ZSAmIGV4dGVuZGVkX25vbnplcm9cIixcbiAgICBcImV4dGVuZGVkX3Bvc2l0aXZlID09IGV4dGVuZGVkX25vbm5lZ2F0aXZlICYgZXh0ZW5kZWRfbm9uemVyb1wiLFxuXG4gICAgXCJleHRlbmRlZF9ub25wb3NpdGl2ZSA9PSBleHRlbmRlZF9yZWFsICYgIWV4dGVuZGVkX3Bvc2l0aXZlXCIsXG4gICAgXCJleHRlbmRlZF9ub25uZWdhdGl2ZSA9PSBleHRlbmRlZF9yZWFsICYgIWV4dGVuZGVkX25lZ2F0aXZlXCIsXG5cbiAgICBcInJlYWwgPT0gbmVnYXRpdmUgfCB6ZXJvIHwgcG9zaXRpdmVcIixcbiAgICBcIm5lZ2F0aXZlID09IG5vbnBvc2l0aXZlICYgbm9uemVyb1wiLFxuICAgIFwicG9zaXRpdmUgPT0gbm9ubmVnYXRpdmUgJiBub256ZXJvXCIsXG5cbiAgICBcIm5vbnBvc2l0aXZlID09IHJlYWwgJiAhcG9zaXRpdmVcIixcbiAgICBcIm5vbm5lZ2F0aXZlID09IHJlYWwgJiAhbmVnYXRpdmVcIixcblxuICAgIFwicG9zaXRpdmUgPT0gZXh0ZW5kZWRfcG9zaXRpdmUgJiBmaW5pdGVcIixcbiAgICBcIm5lZ2F0aXZlID09IGV4dGVuZGVkX25lZ2F0aXZlICYgZmluaXRlXCIsXG4gICAgXCJub25wb3NpdGl2ZSA9PSBleHRlbmRlZF9ub25wb3NpdGl2ZSAmIGZpbml0ZVwiLFxuICAgIFwibm9ubmVnYXRpdmUgPT0gZXh0ZW5kZWRfbm9ubmVnYXRpdmUgJiBmaW5pdGVcIixcbiAgICBcIm5vbnplcm8gPT0gZXh0ZW5kZWRfbm9uemVybyAmIGZpbml0ZVwiLFxuXG4gICAgXCJ6ZXJvIC0+IGV2ZW4gJiBmaW5pdGVcIixcbiAgICBcInplcm8gPT0gZXh0ZW5kZWRfbm9ubmVnYXRpdmUgJiBleHRlbmRlZF9ub25wb3NpdGl2ZVwiLFxuICAgIFwiemVybyA9PSBub25uZWdhdGl2ZSAmIG5vbnBvc2l0aXZlXCIsXG4gICAgXCJub256ZXJvIC0+IHJlYWxcIixcblxuICAgIFwicHJpbWUgLT4gaW50ZWdlciAmIHBvc2l0aXZlXCIsXG4gICAgXCJjb21wb3NpdGUgLT4gaW50ZWdlciAmIHBvc2l0aXZlICYgIXByaW1lXCIsXG4gICAgXCIhY29tcG9zaXRlIC0+ICFwb3NpdGl2ZSB8ICFldmVuIHwgcHJpbWVcIixcblxuICAgIFwiaXJyYXRpb25hbCA9PSByZWFsICYgIXJhdGlvbmFsXCIsXG5cbiAgICBcImltYWdpbmFyeSAtPiAhZXh0ZW5kZWRfcmVhbFwiLFxuXG4gICAgXCJpbmZpbml0ZSA9PSAhZmluaXRlXCIsXG4gICAgXCJub25pbnRlZ2VyID09IGV4dGVuZGVkX3JlYWwgJiAhaW50ZWdlclwiLFxuICAgIFwiZXh0ZW5kZWRfbm9uemVybyA9PSBleHRlbmRlZF9yZWFsICYgIXplcm9cIixcbl0pO1xuXG5cbmV4cG9ydCBjb25zdCBfYXNzdW1lX2RlZmluZWQgPSBfYXNzdW1lX3J1bGVzLmRlZmluZWRfZmFjdHMuY2xvbmUoKTtcblxuY2xhc3MgU3RkRmFjdEtCIGV4dGVuZHMgRmFjdEtCIHtcbiAgICAvKiBBIEZhY3RLQiBzcGVjaWFsaXplZCBmb3IgdGhlIGJ1aWx0LWluIHJ1bGVzXG4gICAgVGhpcyBpcyB0aGUgb25seSBraW5kIG9mIEZhY3RLQiB0aGF0IEJhc2ljIG9iamVjdHMgc2hvdWxkIHVzZS5cbiAgICAqL1xuXG4gICAgX2dlbmVyYXRvcjtcblxuICAgIGNvbnN0cnVjdG9yKGZhY3RzOiBhbnkgPSB1bmRlZmluZWQpIHtcbiAgICAgICAgc3VwZXIoX2Fzc3VtZV9ydWxlcyk7XG4gICAgICAgIC8vIHNhdmUgYSBjb3B5IG9mIGZhY3RzIGRpY3RcbiAgICAgICAgaWYgKHR5cGVvZiBmYWN0cyA9PT0gXCJ1bmRlZmluZWRcIikge1xuICAgICAgICAgICAgdGhpcy5fZ2VuZXJhdG9yID0ge307XG4gICAgICAgIH0gZWxzZSBpZiAoIShmYWN0cyBpbnN0YW5jZW9mIEZhY3RLQikpIHtcbiAgICAgICAgICAgIHRoaXMuX2dlbmVyYXRvciA9IGZhY3RzLmNvcHkoKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMuX2dlbmVyYXRvciA9IChmYWN0cyBhcyBhbnkpLmdlbmVyYXRvcjsgLy8gISEhXG4gICAgICAgIH1cbiAgICAgICAgaWYgKGZhY3RzKSB7XG4gICAgICAgICAgICB0aGlzLmRlZHVjZV9hbGxfZmFjdHMoZmFjdHMpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgc3RkY2xvbmUoKSB7XG4gICAgICAgIHJldHVybiBuZXcgU3RkRmFjdEtCKHRoaXMpO1xuICAgIH1cblxuICAgIGdlbmVyYXRvcigpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX2dlbmVyYXRvci5jb3B5KCk7XG4gICAgfVxufVxuXG5leHBvcnQgZnVuY3Rpb24gYXNfcHJvcGVydHkoZmFjdDogYW55KSB7XG4gICAgcmV0dXJuIFwiaXNfXCIgKyBmYWN0O1xufVxuXG5leHBvcnQgZnVuY3Rpb24gbWFrZV9wcm9wZXJ0eShvYmo6IGFueSwgZmFjdDogYW55KSB7XG4gICAgLy8gY2hvb3NpbmcgdG8gcnVuIGdldGl0KCkgb24gbWFrZV9wcm9wZXJ0eSB0byBhZGQgY29uc2lzdGVuY3kgaW4gYWNjZXNzaW5nXG4gICAgLy8gcHJvcG9lcnRpZXMgb2Ygc3ltdHlwZSBvYmplY3RzLiB0aGlzIG1heSBzbG93IGRvd24gc3ltdHlwZSBzbGlnaHRseVxuICAgIGlmICghZmFjdC5pbmNsdWRlcyhcImlzX1wiKSkge1xuICAgICAgICBvYmpbYXNfcHJvcGVydHkoZmFjdCldID0gZ2V0aXRcbiAgICB9IGVsc2Uge1xuICAgICAgICBvYmpbZmFjdF0gPSBnZXRpdDtcbiAgICB9XG4gICAgZnVuY3Rpb24gZ2V0aXQoKSB7XG4gICAgICAgIGlmICh0eXBlb2Ygb2JqLl9hc3N1bXB0aW9uc1tmYWN0XSAhPT0gXCJ1bmRlZmluZWRcIikge1xuICAgICAgICAgICAgcmV0dXJuIG9iai5fYXNzdW1wdGlvbnMuZ2V0KGZhY3QpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuIF9hc2soZmFjdCwgb2JqKTtcbiAgICAgICAgfVxuICAgIH1cbn1cblxuXG4vLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tdW51c2VkLXZhcnNcbmZ1bmN0aW9uIF9hc2soZmFjdDogYW55LCBvYmo6IGFueSkge1xuICAgIC8qXG4gICAgRmluZCB0aGUgdHJ1dGggdmFsdWUgZm9yIGEgcHJvcGVydHkgb2YgYW4gb2JqZWN0LlxuICAgIFRoaXMgZnVuY3Rpb24gaXMgY2FsbGVkIHdoZW4gYSByZXF1ZXN0IGlzIG1hZGUgdG8gc2VlIHdoYXQgYSBmYWN0XG4gICAgdmFsdWUgaXMuXG4gICAgRm9yIHRoaXMgd2UgdXNlIHNldmVyYWwgdGVjaG5pcXVlczpcbiAgICBGaXJzdCwgdGhlIGZhY3QtZXZhbHVhdGlvbiBmdW5jdGlvbiBpcyB0cmllZCwgaWYgaXQgZXhpc3RzIChmb3JcbiAgICBleGFtcGxlIF9ldmFsX2lzX2ludGVnZXIpLiBUaGVuIHdlIHRyeSByZWxhdGVkIGZhY3RzLiBGb3IgZXhhbXBsZVxuICAgICAgICByYXRpb25hbCAgIC0tPiAgIGludGVnZXJcbiAgICBhbm90aGVyIGV4YW1wbGUgaXMgam9pbmVkIHJ1bGU6XG4gICAgICAgIGludGVnZXIgJiAhb2RkICAtLT4gZXZlblxuICAgIHNvIGluIHRoZSBsYXR0ZXIgY2FzZSBpZiB3ZSBhcmUgbG9va2luZyBhdCB3aGF0ICdldmVuJyB2YWx1ZSBpcyxcbiAgICAnaW50ZWdlcicgYW5kICdvZGQnIGZhY3RzIHdpbGwgYmUgYXNrZWQuXG4gICAgSW4gYWxsIGNhc2VzLCB3aGVuIHdlIHNldHRsZSBvbiBzb21lIGZhY3QgdmFsdWUsIGl0cyBpbXBsaWNhdGlvbnMgYXJlXG4gICAgZGVkdWNlZCwgYW5kIHRoZSByZXN1bHQgaXMgY2FjaGVkIGluIC5fYXNzdW1wdGlvbnMuXG4gICAgKi9cblxuICAgIC8vIEZhY3RLQiB3aGljaCBpcyBkaWN0LWxpa2UgYW5kIG1hcHMgZmFjdHMgdG8gdGhlaXIga25vd24gdmFsdWVzOlxuICAgIGNvbnN0IGFzc3VtcHRpb25zOiBTdGRGYWN0S0IgPSBvYmouX2Fzc3VtcHRpb25zO1xuXG4gICAgLy8gQSBkaWN0IHRoYXQgbWFwcyBmYWN0cyB0byB0aGVpciBoYW5kbGVyczpcbiAgICBjb25zdCBoYW5kbGVyX21hcDogSGFzaERpY3QgPSBvYmouX3Byb3BfaGFuZGxlcjtcblxuICAgIC8vIFRoaXMgaXMgb3VyIHF1ZXVlIG9mIGZhY3RzIHRvIGNoZWNrOlxuICAgIGNvbnN0IGZhY3RzX3RvX2NoZWNrID0gbmV3IEFycmF5KGZhY3QpO1xuICAgIGNvbnN0IGZhY3RzX3F1ZXVlZCA9IG5ldyBIYXNoU2V0KFtmYWN0XSk7XG5cbiAgICBjb25zdCBjbHMgPSBvYmouY29uc3RydWN0b3I7XG5cbiAgICBmb3IgKGNvbnN0IGZhY3RfaSBvZiBmYWN0c190b19jaGVjaykge1xuICAgICAgICBpZiAodHlwZW9mIGFzc3VtcHRpb25zLmdldChmYWN0X2kpICE9PSBcInVuZGVmaW5lZFwiKSB7XG4gICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgfSBlbHNlIGlmIChjbHNbYXNfcHJvcGVydHkoZmFjdCldKSB7XG4gICAgICAgICAgICByZXR1cm4gKGNsc1thc19wcm9wZXJ0eShmYWN0KV0pO1xuICAgICAgICB9XG4gICAgICAgIGxldCBmYWN0X2lfdmFsdWUgPSB1bmRlZmluZWQ7XG4gICAgICAgIGxldCBoYW5kbGVyX2kgPSBoYW5kbGVyX21hcC5nZXQoZmFjdF9pKTtcbiAgICAgICAgaWYgKHR5cGVvZiBoYW5kbGVyX2kgIT09IFwidW5kZWZpbmVkXCIpIHtcbiAgICAgICAgICAgIGZhY3RfaV92YWx1ZSA9IG9ialtoYW5kbGVyX2kubmFtZV0oKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICh0eXBlb2YgZmFjdF9pX3ZhbHVlICE9PSBcInVuZGVmaW5lZFwiKSB7XG4gICAgICAgICAgICBhc3N1bXB0aW9ucy5kZWR1Y2VfYWxsX2ZhY3RzKFtbZmFjdF9pLCBmYWN0X2lfdmFsdWVdXSk7XG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCBmYWN0X3ZhbHVlID0gYXNzdW1wdGlvbnMuZ2V0KGZhY3QpO1xuICAgICAgICBpZiAodHlwZW9mIGZhY3RfdmFsdWUgIT09IFwidW5kZWZpbmVkXCIpIHtcbiAgICAgICAgICAgIHJldHVybiBmYWN0X3ZhbHVlO1xuICAgICAgICB9XG4gICAgICAgIGNvbnN0IGZhY3RzZXQgPSBfYXNzdW1lX3J1bGVzLnByZXJlcS5nZXQoZmFjdF9pKS5kaWZmZXJlbmNlKGZhY3RzX3F1ZXVlZCk7XG4gICAgICAgIGlmIChmYWN0c2V0LnNpemUgIT09IDApIHtcbiAgICAgICAgICAgIGNvbnN0IG5ld19mYWN0c190b19jaGVjayA9IG5ldyBBcnJheShfYXNzdW1lX3J1bGVzLnByZXJlcS5nZXQoZmFjdF9pKS5kaWZmZXJlbmNlKGZhY3RzX3F1ZXVlZCkpO1xuICAgICAgICAgICAgVXRpbC5zaHVmZmxlQXJyYXkobmV3X2ZhY3RzX3RvX2NoZWNrKTtcbiAgICAgICAgICAgIGZhY3RzX3RvX2NoZWNrLnB1c2gobmV3X2ZhY3RzX3RvX2NoZWNrKTtcbiAgICAgICAgICAgIGZhY3RzX3RvX2NoZWNrLmZsYXQoKTtcbiAgICAgICAgICAgIGZhY3RzX3F1ZXVlZC5hZGRBcnIobmV3X2ZhY3RzX3RvX2NoZWNrKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgaWYgKGFzc3VtcHRpb25zLmhhcyhmYWN0KSkge1xuICAgICAgICByZXR1cm4gYXNzdW1wdGlvbnMuZ2V0KGZhY3QpO1xuICAgIH1cblxuICAgIGFzc3VtcHRpb25zLl90ZWxsKGZhY3QsIHVuZGVmaW5lZCk7XG4gICAgcmV0dXJuIHVuZGVmaW5lZDtcbn1cblxuXG5jbGFzcyBNYW5hZ2VkUHJvcGVydGllcyB7XG4gICAgc3RhdGljIGFsbF9leHBsaWNpdF9hc3N1bXB0aW9uczogSGFzaERpY3QgPSBuZXcgSGFzaERpY3QoKTtcbiAgICBzdGF0aWMgYWxsX2RlZmF1bHRfYXNzdW1wdGlvbnM6IEhhc2hTZXQgPSBuZXcgSGFzaFNldCgpO1xuXG5cbiAgICBzdGF0aWMgcmVnaXN0ZXIoY2xzOiBhbnkpIHtcbiAgICAgICAgLy8gcmVnaXN0ZXIgd2l0aCBCYXNpY01ldGEgKHJlY29yZCBjbGFzcyBuYW1lKVxuICAgICAgICBCYXNpY01ldGEucmVnaXN0ZXIoY2xzKTtcblxuICAgICAgICAvLyBGb3IgYWxsIHByb3BlcnRpZXMgd2Ugd2FudCB0byBkZWZpbmUsIGRldGVybWluZSBpZiB0aGV5IGFyZSBkZWZpbmVkXG4gICAgICAgIC8vIGJ5IHRoZSBjbGFzcyBvciBpZiB3ZSBzZXQgdGhlbSBhcyB1bmRlZmluZWQuXG4gICAgICAgIC8vIEFkZCB0aGVzZSBwcm9wZXJ0aWVzIHRvIGEgZGljdCBjYWxsZWQgbG9jYWxfZGVmc1xuICAgICAgICBjb25zdCBsb2NhbF9kZWZzID0gbmV3IEhhc2hEaWN0KCk7XG4gICAgICAgIGNvbnN0IGNsc19wcm9wcyA9IE9iamVjdC5nZXRPd25Qcm9wZXJ0eU5hbWVzKGNscyk7XG4gICAgICAgIGZvciAoY29uc3QgayBvZiBfYXNzdW1lX2RlZmluZWQudG9BcnJheSgpKSB7XG4gICAgICAgICAgICBjb25zdCBhdHRybmFtZSA9IGFzX3Byb3BlcnR5KGspO1xuICAgICAgICAgICAgaWYgKGNsc19wcm9wcy5pbmNsdWRlcyhhdHRybmFtZSkpIHtcbiAgICAgICAgICAgICAgICBsZXQgdiA9IGNsc1thdHRybmFtZV07XG4gICAgICAgICAgICAgICAgaWYgKCh0eXBlb2YgdiA9PT0gXCJudW1iZXJcIiAmJiBOdW1iZXIuaXNJbnRlZ2VyKHYpKSB8fCB0eXBlb2YgdiA9PT0gXCJib29sZWFuXCIgfHwgdHlwZW9mIHYgPT09IFwidW5kZWZpbmVkXCIpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHR5cGVvZiB2ICE9PSBcInVuZGVmaW5lZFwiKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB2ID0gISF2O1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGxvY2FsX2RlZnMuYWRkKGssIHYpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IGFsbF9kZWZzID0gbmV3IEhhc2hEaWN0KClcbiAgICAgICAgZm9yIChjb25zdCBiYXNlIG9mIFV0aWwuZ2V0U3VwZXJzKGNscykucmV2ZXJzZSgpKSB7XG4gICAgICAgICAgICBjb25zdCBhc3N1bXB0aW9ucyA9IGJhc2UuX2V4cGxpY2l0X2NsYXNzX2Fzc3VtcHRpb25zO1xuICAgICAgICAgICAgaWYgKHR5cGVvZiBhc3N1bXB0aW9ucyAhPT0gXCJ1bmRlZmluZWRcIikge1xuICAgICAgICAgICAgICAgIGFsbF9kZWZzLm1lcmdlKGFzc3VtcHRpb25zKVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgYWxsX2RlZnMubWVyZ2UobG9jYWxfZGVmcyk7XG5cbiAgICAgICAgLy8gU2V0IGNsYXNzIHByb3BlcnRpZXNcbiAgICAgICAgY2xzLl9leHBsaWNpdF9jbGFzc19hc3N1bXB0aW9ucyA9IGFsbF9kZWZzXG4gICAgICAgIGNscy5kZWZhdWx0X2Fzc3VtcHRpb25zID0gbmV3IFN0ZEZhY3RLQihhbGxfZGVmcyk7XG5cbiAgICAgICAgLy8gQWRkIGRlZmF1bHQgYXNzdW1wdGlvbnMgYXMgY2xhc3MgcHJvcGVydGllc1xuICAgICAgICBmb3IgKGNvbnN0IGl0ZW0gb2YgY2xzLmRlZmF1bHRfYXNzdW1wdGlvbnMuZW50cmllcygpKSB7XG4gICAgICAgICAgICBpZiAoaXRlbVswXS5pbmNsdWRlcyhcImlzXCIpKSB7XG4gICAgICAgICAgICAgICAgY2xzW2l0ZW1bMF1dID0gaXRlbVsxXTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgY2xzW2FzX3Byb3BlcnR5KGl0ZW1bMF0pXSA9IGl0ZW1bMV07XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICAvLyBhZGQgcmVtYWluaW5nIGNsYXNzIHByb3BlcnRpZXMgdG8gZGVmYXVsdGEgYXNzdW1wdGlvbnNcbiAgICAgICAgY29uc3QgcHJvcHNfZmlsdGVyZWQgPSBPYmplY3QuZ2V0T3duUHJvcGVydHlOYW1lcyhjbHMpLmZpbHRlcihcbiAgICAgICAgICAgIHByb3AgPT4gcHJvcC5pbmNsdWRlcyhcImlzX1wiKSkubWFwKChzdHIpID0+IHtcbiAgICAgICAgICAgIHJldHVybiBzdHIucmVwbGFjZShcImlzX1wiLCBcIlwiKTtcbiAgICAgICAgfSk7XG4gICAgICAgIGNvbnN0IGFsbGRlZnMgPSBuZXcgSGFzaFNldChwcm9wc19maWx0ZXJlZCk7XG4gICAgICAgIGZvciAoY29uc3QgZmFjdCBvZiBhbGxkZWZzLmRpZmZlcmVuY2UoY2xzLmRlZmF1bHRfYXNzdW1wdGlvbnMpLnRvQXJyYXkoKSkge1xuICAgICAgICAgICAgY2xzLmRlZmF1bHRfYXNzdW1wdGlvbnMuYWRkKGZhY3QsIGNsc1tmYWN0XSk7XG4gICAgICAgIH1cblxuICAgICAgICAvLyBnZXQgdGhlIHN0YXRpYyB2YXJpYWJsZXMgb2YgYWxsIHN1cGVyY2xhc3NlcyBhbmQgYXNzaWduIHRvIGNsYXNzXG4gICAgICAgIC8vIG5vdGUgdGhhdCB3ZSBvbmx5IGFzc2lnbiB0aGUgcHJvcGVydGllcyBpZiB0aGV5IGFyZSB1bmRlZmluZWQgXG4gICAgICAgIGNvbnN0IHN1cGVyczogYW55W10gPSBVdGlsLmdldFN1cGVycyhjbHMpO1xuICAgICAgICBmb3IgKGNvbnN0IHN1cGVyY2xzIG9mIHN1cGVycykge1xuICAgICAgICAgICAgY29uc3QgYWxsUHJvcHMgPSBuZXcgSGFzaFNldChPYmplY3QuZ2V0T3duUHJvcGVydHlOYW1lcyhzdXBlcmNscykuZmlsdGVyKHByb3AgPT4gcHJvcC5pbmNsdWRlcyhcImlzX1wiKSkpO1xuICAgICAgICAgICAgY29uc3QgdW5pcXVlUHJvcHMgPSBhbGxQcm9wcy5kaWZmZXJlbmNlKGNscy5kZWZhdWx0X2Fzc3VtcHRpb25zKS50b0FycmF5KClcbiAgICAgICAgICAgIGZvciAoY29uc3QgZmFjdCBvZiB1bmlxdWVQcm9wcykge1xuICAgICAgICAgICAgICAgIGNscy5kZWZhdWx0X2Fzc3VtcHRpb25zLmFkZChmYWN0LCBzdXBlcmNsc1tmYWN0XSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG59XG5cbmV4cG9ydCB7U3RkRmFjdEtCLCBNYW5hZ2VkUHJvcGVydGllc307XG4iLCAiLypcbk5vdGFibGUgY2hhbmdlcyBtYWRlIChhbmQgbm90ZXMpOlxuLSBWZXJ5IGJhcmVib25lcyB2ZXJzaW9ucyBvZiBjbGFzc2VzIGltcGxlbWVudGVkIHNvIGZhclxuLSBTYW1lIHJlZ2lzdHJ5IHN5c3RlbSBhcyBTaW5nbGV0b24gLSB1c2luZyBzdGF0aWMgZGljdGlvbmFyeVxuKi9cblxuLyogZXNsaW50LWRpc2FibGUgbmV3LWNhcCAqL1xuY2xhc3MgS2luZFJlZ2lzdHJ5IHtcbiAgICBzdGF0aWMgcmVnaXN0cnk6IFJlY29yZDxhbnksIGFueT4gPSB7fTtcblxuICAgIHN0YXRpYyByZWdpc3RlcihuYW1lOiBzdHJpbmcsIGNsczogYW55KSB7XG4gICAgICAgIEtpbmRSZWdpc3RyeS5yZWdpc3RyeVtuYW1lXSA9IG5ldyBjbHMoKTtcbiAgICB9XG59XG5cbmNsYXNzIEtpbmQgeyAvLyAhISEgbWV0YWNsYXNzIHNpdHVhdGlvblxuICAgIC8qXG4gICAgQmFzZSBjbGFzcyBmb3Iga2luZHMuXG4gICAgS2luZCBvZiB0aGUgb2JqZWN0IHJlcHJlc2VudHMgdGhlIG1hdGhlbWF0aWNhbCBjbGFzc2lmaWNhdGlvbiB0aGF0XG4gICAgdGhlIGVudGl0eSBmYWxscyBpbnRvLiBJdCBpcyBleHBlY3RlZCB0aGF0IGZ1bmN0aW9ucyBhbmQgY2xhc3Nlc1xuICAgIHJlY29nbml6ZSBhbmQgZmlsdGVyIHRoZSBhcmd1bWVudCBieSBpdHMga2luZC5cbiAgICBLaW5kIG9mIGV2ZXJ5IG9iamVjdCBtdXN0IGJlIGNhcmVmdWxseSBzZWxlY3RlZCBzbyB0aGF0IGl0IHNob3dzIHRoZVxuICAgIGludGVudGlvbiBvZiBkZXNpZ24uIEV4cHJlc3Npb25zIG1heSBoYXZlIGRpZmZlcmVudCBraW5kIGFjY29yZGluZ1xuICAgIHRvIHRoZSBraW5kIG9mIGl0cyBhcmd1ZW1lbnRzLiBGb3IgZXhhbXBsZSwgYXJndWVtZW50cyBvZiBgYEFkZGBgXG4gICAgbXVzdCBoYXZlIGNvbW1vbiBraW5kIHNpbmNlIGFkZGl0aW9uIGlzIGdyb3VwIG9wZXJhdG9yLCBhbmQgdGhlXG4gICAgcmVzdWx0aW5nIGBgQWRkKClgYCBoYXMgdGhlIHNhbWUga2luZC5cbiAgICBGb3IgdGhlIHBlcmZvcm1hbmNlLCBlYWNoIGtpbmQgaXMgYXMgYnJvYWQgYXMgcG9zc2libGUgYW5kIGlzIG5vdFxuICAgIGJhc2VkIG9uIHNldCB0aGVvcnkuIEZvciBleGFtcGxlLCBgYE51bWJlcktpbmRgYCBpbmNsdWRlcyBub3Qgb25seVxuICAgIGNvbXBsZXggbnVtYmVyIGJ1dCBleHByZXNzaW9uIGNvbnRhaW5pbmcgYGBTLkluZmluaXR5YGAgb3IgYGBTLk5hTmBgXG4gICAgd2hpY2ggYXJlIG5vdCBzdHJpY3RseSBudW1iZXIuXG4gICAgS2luZCBtYXkgaGF2ZSBhcmd1bWVudHMgYXMgcGFyYW1ldGVyLiBGb3IgZXhhbXBsZSwgYGBNYXRyaXhLaW5kKClgYFxuICAgIG1heSBiZSBjb25zdHJ1Y3RlZCB3aXRoIG9uZSBlbGVtZW50IHdoaWNoIHJlcHJlc2VudHMgdGhlIGtpbmQgb2YgaXRzXG4gICAgZWxlbWVudHMuXG4gICAgYGBLaW5kYGAgYmVoYXZlcyBpbiBzaW5nbGV0b24tbGlrZSBmYXNoaW9uLiBTYW1lIHNpZ25hdHVyZSB3aWxsXG4gICAgcmV0dXJuIHRoZSBzYW1lIG9iamVjdC5cbiAgICAqL1xuXG4gICAgc3RhdGljIG5ldyhjbHM6IGFueSwgLi4uYXJnczogYW55KSB7XG4gICAgICAgIGxldCBpbnN0O1xuICAgICAgICBpZiAoYXJncyBpbiBLaW5kUmVnaXN0cnkucmVnaXN0cnkpIHtcbiAgICAgICAgICAgIGluc3QgPSBLaW5kUmVnaXN0cnkucmVnaXN0cnlbYXJnc107XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBLaW5kUmVnaXN0cnkucmVnaXN0ZXIoY2xzLm5hbWUsIGNscyk7XG4gICAgICAgICAgICBpbnN0ID0gbmV3IGNscygpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBpbnN0O1xuICAgIH1cbn1cblxuY2xhc3MgX1VuZGVmaW5lZEtpbmQgZXh0ZW5kcyBLaW5kIHtcbiAgICAvKlxuICAgIERlZmF1bHQga2luZCBmb3IgYWxsIFN5bVB5IG9iamVjdC4gSWYgdGhlIGtpbmQgaXMgbm90IGRlZmluZWQgZm9yXG4gICAgdGhlIG9iamVjdCwgb3IgaWYgdGhlIG9iamVjdCBjYW5ub3QgaW5mZXIgdGhlIGtpbmQgZnJvbSBpdHNcbiAgICBhcmd1bWVudHMsIHRoaXMgd2lsbCBiZSByZXR1cm5lZC5cbiAgICBFeGFtcGxlc1xuICAgID09PT09PT09XG4gICAgPj4+IGZyb20gc3ltcHkgaW1wb3J0IEV4cHJcbiAgICA+Pj4gRXhwcigpLmtpbmRcbiAgICBVbmRlZmluZWRLaW5kXG4gICAgKi9cblxuICAgIGNvbnN0cnVjdG9yKCkge1xuICAgICAgICBzdXBlcigpO1xuICAgIH1cblxuICAgIHN0YXRpYyBuZXcoKSB7XG4gICAgICAgIHJldHVybiBLaW5kLm5ldyhfVW5kZWZpbmVkS2luZCk7XG4gICAgfVxuXG4gICAgdG9TdHJpbmcoKSB7XG4gICAgICAgIHJldHVybiBcIlVuZGVmaW5lZEtpbmRcIjtcbiAgICB9XG59XG5cbmNvbnN0IFVuZGVmaW5lZEtpbmQgPSBfVW5kZWZpbmVkS2luZC5uZXcoKTtcblxuY2xhc3MgX051bWJlcktpbmQgZXh0ZW5kcyBLaW5kIHtcbiAgICAvKlxuICAgIEtpbmQgZm9yIGFsbCBudW1lcmljIG9iamVjdC5cbiAgICBUaGlzIGtpbmQgcmVwcmVzZW50cyBldmVyeSBudW1iZXIsIGluY2x1ZGluZyBjb21wbGV4IG51bWJlcnMsXG4gICAgaW5maW5pdHkgYW5kIGBgUy5OYU5gYC4gT3RoZXIgb2JqZWN0cyBzdWNoIGFzIHF1YXRlcm5pb25zIGRvIG5vdFxuICAgIGhhdmUgdGhpcyBraW5kLlxuICAgIE1vc3QgYGBFeHByYGAgYXJlIGluaXRpYWxseSBkZXNpZ25lZCB0byByZXByZXNlbnQgdGhlIG51bWJlciwgc29cbiAgICB0aGlzIHdpbGwgYmUgdGhlIG1vc3QgY29tbW9uIGtpbmQgaW4gU3ltUHkgY29yZS4gRm9yIGV4YW1wbGVcbiAgICBgYFN5bWJvbCgpYGAsIHdoaWNoIHJlcHJlc2VudHMgYSBzY2FsYXIsIGhhcyB0aGlzIGtpbmQgYXMgbG9uZyBhcyBpdFxuICAgIGlzIGNvbW11dGF0aXZlLlxuICAgIE51bWJlcnMgZm9ybSBhIGZpZWxkLiBBbnkgb3BlcmF0aW9uIGJldHdlZW4gbnVtYmVyLWtpbmQgb2JqZWN0cyB3aWxsXG4gICAgcmVzdWx0IHRoaXMga2luZCBhcyB3ZWxsLlxuICAgIEV4YW1wbGVzXG4gICAgPT09PT09PT1cbiAgICA+Pj4gZnJvbSBzeW1weSBpbXBvcnQgUywgb28sIFN5bWJvbFxuICAgID4+PiBTLk9uZS5raW5kXG4gICAgTnVtYmVyS2luZFxuICAgID4+PiAoLW9vKS5raW5kXG4gICAgTnVtYmVyS2luZFxuICAgID4+PiBTLk5hTi5raW5kXG4gICAgTnVtYmVyS2luZFxuICAgIENvbW11dGF0aXZlIHN5bWJvbCBhcmUgdHJlYXRlZCBhcyBudW1iZXIuXG4gICAgPj4+IHggPSBTeW1ib2woJ3gnKVxuICAgID4+PiB4LmtpbmRcbiAgICBOdW1iZXJLaW5kXG4gICAgPj4+IFN5bWJvbCgneScsIGNvbW11dGF0aXZlPUZhbHNlKS5raW5kXG4gICAgVW5kZWZpbmVkS2luZFxuICAgIE9wZXJhdGlvbiBiZXR3ZWVuIG51bWJlcnMgcmVzdWx0cyBudW1iZXIuXG4gICAgPj4+ICh4KzEpLmtpbmRcbiAgICBOdW1iZXJLaW5kXG4gICAgU2VlIEFsc29cbiAgICA9PT09PT09PVxuICAgIHN5bXB5LmNvcmUuZXhwci5FeHByLmlzX051bWJlciA6IGNoZWNrIGlmIHRoZSBvYmplY3QgaXMgc3RyaWN0bHlcbiAgICBzdWJjbGFzcyBvZiBgYE51bWJlcmBgIGNsYXNzLlxuICAgIHN5bXB5LmNvcmUuZXhwci5FeHByLmlzX251bWJlciA6IGNoZWNrIGlmIHRoZSBvYmplY3QgaXMgbnVtYmVyXG4gICAgd2l0aG91dCBhbnkgZnJlZSBzeW1ib2wuXG4gICAgKi9cblxuICAgIGNvbnN0cnVjdG9yKCkge1xuICAgICAgICBzdXBlcigpO1xuICAgIH1cblxuICAgIHN0YXRpYyBuZXcoKSB7XG4gICAgICAgIHJldHVybiBLaW5kLm5ldyhfTnVtYmVyS2luZCk7XG4gICAgfVxuXG4gICAgdG9TdHJpbmcoKSB7XG4gICAgICAgIHJldHVybiBcIk51bWJlcktpbmRcIjtcbiAgICB9XG59XG5cbmNvbnN0IE51bWJlcktpbmQgPSBfTnVtYmVyS2luZC5uZXcoKTtcblxuY2xhc3MgX0Jvb2xlYW5LaW5kIGV4dGVuZHMgS2luZCB7XG4gICAgLypcbiAgICBLaW5kIGZvciBib29sZWFuIG9iamVjdHMuXG4gICAgU3ltUHkncyBgYFMudHJ1ZWBgLCBgYFMuZmFsc2VgYCwgYW5kIGJ1aWx0LWluIGBgVHJ1ZWBgIGFuZCBgYEZhbHNlYGBcbiAgICBoYXZlIHRoaXMga2luZC4gQm9vbGVhbiBudW1iZXIgYGAxYGAgYW5kIGBgMGBgIGFyZSBub3QgcmVsZXZlbnQuXG4gICAgRXhhbXBsZXNcbiAgICA9PT09PT09PVxuICAgID4+PiBmcm9tIHN5bXB5IGltcG9ydCBTLCBRXG4gICAgPj4+IFMudHJ1ZS5raW5kXG4gICAgQm9vbGVhbktpbmRcbiAgICA+Pj4gUS5ldmVuKDMpLmtpbmRcbiAgICBCb29sZWFuS2luZFxuICAgICovXG5cbiAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICAgICAgc3VwZXIoKTtcbiAgICB9XG5cbiAgICBzdGF0aWMgbmV3KCkge1xuICAgICAgICByZXR1cm4gS2luZC5uZXcoX0Jvb2xlYW5LaW5kKTtcbiAgICB9XG5cbiAgICB0b1N0cmluZygpIHtcbiAgICAgICAgcmV0dXJuIFwiQm9vbGVhbktpbmRcIjtcbiAgICB9XG59XG5cbmNvbnN0IEJvb2xlYW5LaW5kID0gX0Jvb2xlYW5LaW5kLm5ldygpO1xuXG5cbmV4cG9ydCB7VW5kZWZpbmVkS2luZCwgTnVtYmVyS2luZCwgQm9vbGVhbktpbmR9O1xuIiwgImNsYXNzIHByZW9yZGVyX3RyYXZlcnNhbCB7XG4gICAgLypcbiAgICBEbyBhIHByZS1vcmRlciB0cmF2ZXJzYWwgb2YgYSB0cmVlLlxuICAgIFRoaXMgaXRlcmF0b3IgcmVjdXJzaXZlbHkgeWllbGRzIG5vZGVzIHRoYXQgaXQgaGFzIHZpc2l0ZWQgaW4gYSBwcmUtb3JkZXJcbiAgICBmYXNoaW9uLiBUaGF0IGlzLCBpdCB5aWVsZHMgdGhlIGN1cnJlbnQgbm9kZSB0aGVuIGRlc2NlbmRzIHRocm91Z2ggdGhlXG4gICAgdHJlZSBicmVhZHRoLWZpcnN0IHRvIHlpZWxkIGFsbCBvZiBhIG5vZGUncyBjaGlsZHJlbidzIHByZS1vcmRlclxuICAgIHRyYXZlcnNhbC5cbiAgICBGb3IgYW4gZXhwcmVzc2lvbiwgdGhlIG9yZGVyIG9mIHRoZSB0cmF2ZXJzYWwgZGVwZW5kcyBvbiB0aGUgb3JkZXIgb2ZcbiAgICAuYXJncywgd2hpY2ggaW4gbWFueSBjYXNlcyBjYW4gYmUgYXJiaXRyYXJ5LlxuICAgIFBhcmFtZXRlcnNcbiAgICA9PT09PT09PT09XG4gICAgbm9kZSA6IFN5bVB5IGV4cHJlc3Npb25cbiAgICAgICAgVGhlIGV4cHJlc3Npb24gdG8gdHJhdmVyc2UuXG4gICAga2V5cyA6IChkZWZhdWx0IE5vbmUpIHNvcnQga2V5KHMpXG4gICAgICAgIFRoZSBrZXkocykgdXNlZCB0byBzb3J0IGFyZ3Mgb2YgQmFzaWMgb2JqZWN0cy4gV2hlbiBOb25lLCBhcmdzIG9mIEJhc2ljXG4gICAgICAgIG9iamVjdHMgYXJlIHByb2Nlc3NlZCBpbiBhcmJpdHJhcnkgb3JkZXIuIElmIGtleSBpcyBkZWZpbmVkLCBpdCB3aWxsXG4gICAgICAgIGJlIHBhc3NlZCBhbG9uZyB0byBvcmRlcmVkKCkgYXMgdGhlIG9ubHkga2V5KHMpIHRvIHVzZSB0byBzb3J0IHRoZVxuICAgICAgICBhcmd1bWVudHM7IGlmIGBga2V5YGAgaXMgc2ltcGx5IFRydWUgdGhlbiB0aGUgZGVmYXVsdCBrZXlzIG9mIG9yZGVyZWRcbiAgICAgICAgd2lsbCBiZSB1c2VkLlxuICAgIFlpZWxkc1xuICAgID09PT09PVxuICAgIHN1YnRyZWUgOiBTeW1QeSBleHByZXNzaW9uXG4gICAgICAgIEFsbCBvZiB0aGUgc3VidHJlZXMgaW4gdGhlIHRyZWUuXG4gICAgRXhhbXBsZXNcbiAgICA9PT09PT09PVxuICAgID4+PiBmcm9tIHN5bXB5IGltcG9ydCBwcmVvcmRlcl90cmF2ZXJzYWwsIHN5bWJvbHNcbiAgICA+Pj4geCwgeSwgeiA9IHN5bWJvbHMoJ3ggeSB6JylcbiAgICBUaGUgbm9kZXMgYXJlIHJldHVybmVkIGluIHRoZSBvcmRlciB0aGF0IHRoZXkgYXJlIGVuY291bnRlcmVkIHVubGVzcyBrZXlcbiAgICBpcyBnaXZlbjsgc2ltcGx5IHBhc3Npbmcga2V5PVRydWUgd2lsbCBndWFyYW50ZWUgdGhhdCB0aGUgdHJhdmVyc2FsIGlzXG4gICAgdW5pcXVlLlxuICAgID4+PiBsaXN0KHByZW9yZGVyX3RyYXZlcnNhbCgoeCArIHkpKnosIGtleXM9Tm9uZSkpICMgZG9jdGVzdDogK1NLSVBcbiAgICBbeiooeCArIHkpLCB6LCB4ICsgeSwgeSwgeF1cbiAgICA+Pj4gbGlzdChwcmVvcmRlcl90cmF2ZXJzYWwoKHggKyB5KSp6LCBrZXlzPVRydWUpKVxuICAgIFt6Kih4ICsgeSksIHosIHggKyB5LCB4LCB5XVxuICAgICovXG5cbiAgICBfc2tpcF9mbGFnOiBhbnk7XG4gICAgX3B0OiBhbnk7XG4gICAgY29uc3RydWN0b3Iobm9kZTogYW55KSB7XG4gICAgICAgIHRoaXMuX3NraXBfZmxhZyA9IGZhbHNlO1xuICAgICAgICB0aGlzLl9wdCA9IHRoaXMuX3ByZW9yZGVyX3RyYXZlcnNhbChub2RlKTtcbiAgICB9XG5cbiAgICAqIF9wcmVvcmRlcl90cmF2ZXJzYWwobm9kZTogYW55KTogYW55IHtcbiAgICAgICAgeWllbGQgbm9kZTtcbiAgICAgICAgaWYgKHRoaXMuX3NraXBfZmxhZykge1xuICAgICAgICAgICAgdGhpcy5fc2tpcF9mbGFnID0gZmFsc2U7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgaWYgKG5vZGUuaW5zdGFuY2VvZkJhc2ljKSB7XG4gICAgICAgICAgICBsZXQgYXJncztcbiAgICAgICAgICAgIGlmIChub2RlLl9hcmdzZXQpIHtcbiAgICAgICAgICAgICAgICBhcmdzID0gbm9kZS5fYXJnc2V0O1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBhcmdzID0gbm9kZS5fYXJncztcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGZvciAoY29uc3QgYXJnIG9mIGFyZ3MpIHtcbiAgICAgICAgICAgICAgICBmb3IgKGNvbnN0IHZhbCBvZiB0aGlzLl9wcmVvcmRlcl90cmF2ZXJzYWwoYXJnKSkge1xuICAgICAgICAgICAgICAgICAgICB5aWVsZCB2YWw7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9IGVsc2UgaWYgKFN5bWJvbC5pdGVyYXRvciBpbiBPYmplY3Qobm9kZSkpIHtcbiAgICAgICAgICAgIGZvciAoY29uc3QgaXRlbSBvZiBub2RlKSB7XG4gICAgICAgICAgICAgICAgZm9yIChjb25zdCB2YWwgb2YgdGhpcy5fcHJlb3JkZXJfdHJhdmVyc2FsKGl0ZW0pKSB7XG4gICAgICAgICAgICAgICAgICAgIHlpZWxkIHZhbDtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBhc0l0ZXIoKSB7XG4gICAgICAgIGNvbnN0IHJlczogYW55W10gPSBbXTtcbiAgICAgICAgZm9yIChjb25zdCBpdGVtIG9mIHRoaXMuX3B0KSB7XG4gICAgICAgICAgICByZXMucHVzaChpdGVtKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gcmVzO1xuICAgIH1cbn1cblxuZXhwb3J0IHtwcmVvcmRlcl90cmF2ZXJzYWx9O1xuIiwgIi8qXG5Ob3RhYmxlIGNoYW5nZXMgbWFkZSAoYW5kIG5vdGVzKTpcbi0gQmFzaWMgcmV3b3JrZWQgd2l0aCBjb25zdHJ1Y3RvciBzeXN0ZW1cbi0gQmFzaWMgaGFuZGxlcyBPQkpFQ1QgcHJvcGVydGllcywgTWFuYWdlZFByb3BlcnRpZXMgaGFuZGxlcyBDTEFTUyBwcm9wZXJ0aWVzXG4tIF9ldmFsX2lzIHByb3BlcnRpZXMgKGRlcGVuZGVudCBvbiBvYmplY3QpIGFyZSBub3cgYXNzaWduZWQgaW4gQmFzaWNcbi0gU29tZSBwcm9wZXJ0aWVzIG9mIEJhc2ljIChhbmQgc3ViY2xhc3NlcykgYXJlIHN0YXRpY1xuKi9cblxuaW1wb3J0IHthc19wcm9wZXJ0eSwgbWFrZV9wcm9wZXJ0eSwgTWFuYWdlZFByb3BlcnRpZXMsIF9hc3N1bWVfZGVmaW5lZCwgU3RkRmFjdEtCfSBmcm9tIFwiLi9hc3N1bXB0aW9uc1wiO1xuaW1wb3J0IHtVdGlsLCBIYXNoRGljdCwgbWl4LCBiYXNlLCBIYXNoU2V0fSBmcm9tIFwiLi91dGlsaXR5XCI7XG5pbXBvcnQge1VuZGVmaW5lZEtpbmR9IGZyb20gXCIuL2tpbmRcIjtcbmltcG9ydCB7cHJlb3JkZXJfdHJhdmVyc2FsfSBmcm9tIFwiLi90cmF2ZXJzYWxcIjtcblxuXG5jb25zdCBfQmFzaWMgPSAoc3VwZXJjbGFzczogYW55KSA9PiBjbGFzcyBfQmFzaWMgZXh0ZW5kcyBzdXBlcmNsYXNzIHtcbiAgICAvKlxuICAgIEJhc2UgY2xhc3MgZm9yIGFsbCBTeW1QeSBvYmplY3RzLlxuICAgIE5vdGVzIGFuZCBjb252ZW50aW9uc1xuICAgID09PT09PT09PT09PT09PT09PT09PVxuICAgIDEpIEFsd2F5cyB1c2UgYGAuYXJnc2BgLCB3aGVuIGFjY2Vzc2luZyBwYXJhbWV0ZXJzIG9mIHNvbWUgaW5zdGFuY2U6XG4gICAgPj4+IGZyb20gc3ltcHkgaW1wb3J0IGNvdFxuICAgID4+PiBmcm9tIHN5bXB5LmFiYyBpbXBvcnQgeCwgeVxuICAgID4+PiBjb3QoeCkuYXJnc1xuICAgICh4LClcbiAgICA+Pj4gY290KHgpLmFyZ3NbMF1cbiAgICB4XG4gICAgPj4+ICh4KnkpLmFyZ3NcbiAgICAoeCwgeSlcbiAgICA+Pj4gKHgqeSkuYXJnc1sxXVxuICAgIHlcbiAgICAyKSBOZXZlciB1c2UgaW50ZXJuYWwgbWV0aG9kcyBvciB2YXJpYWJsZXMgKHRoZSBvbmVzIHByZWZpeGVkIHdpdGggYGBfYGApOlxuICAgID4+PiBjb3QoeCkuX2FyZ3MgICAgIyBkbyBub3QgdXNlIHRoaXMsIHVzZSBjb3QoeCkuYXJncyBpbnN0ZWFkXG4gICAgKHgsKVxuICAgIDMpICBCeSBcIlN5bVB5IG9iamVjdFwiIHdlIG1lYW4gc29tZXRoaW5nIHRoYXQgY2FuIGJlIHJldHVybmVkIGJ5XG4gICAgICAgIGBgc3ltcGlmeWBgLiAgQnV0IG5vdCBhbGwgb2JqZWN0cyBvbmUgZW5jb3VudGVycyB1c2luZyBTeW1QeSBhcmVcbiAgICAgICAgc3ViY2xhc3NlcyBvZiBCYXNpYy4gIEZvciBleGFtcGxlLCBtdXRhYmxlIG9iamVjdHMgYXJlIG5vdDpcbiAgICAgICAgPj4+IGZyb20gc3ltcHkgaW1wb3J0IEJhc2ljLCBNYXRyaXgsIHN5bXBpZnlcbiAgICAgICAgPj4+IEEgPSBNYXRyaXgoW1sxLCAyXSwgWzMsIDRdXSkuYXNfbXV0YWJsZSgpXG4gICAgICAgID4+PiBpc2luc3RhbmNlKEEsIEJhc2ljKVxuICAgICAgICBGYWxzZVxuICAgICAgICA+Pj4gQiA9IHN5bXBpZnkoQSlcbiAgICAgICAgPj4+IGlzaW5zdGFuY2UoQiwgQmFzaWMpXG4gICAgICAgIFRydWVcbiAgICAqL1xuXG4gICAgX19zbG90c19fID0gW1wiX21oYXNoXCIsIFwiX2FyZ3NcIiwgXCJfYXNzdW1wdGlvbnNcIl07XG4gICAgX2FyZ3M6IGFueVtdO1xuICAgIF9taGFzaDogTnVtYmVyIHwgdW5kZWZpbmVkO1xuICAgIF9hc3N1bXB0aW9uczogU3RkRmFjdEtCO1xuXG4gICAgLy8gVG8gYmUgb3ZlcnJpZGRlbiB3aXRoIFRydWUgaW4gdGhlIGFwcHJvcHJpYXRlIHN1YmNsYXNzZXNcbiAgICBzdGF0aWMgaXNfbnVtYmVyID0gZmFsc2U7XG4gICAgc3RhdGljIGlzX0F0b20gPSBmYWxzZTtcbiAgICBzdGF0aWMgaXNfU3ltYm9sID0gZmFsc2U7XG4gICAgc3RhdGljIGlzX3N5bWJvbCA9IGZhbHNlO1xuICAgIHN0YXRpYyBpc19JbmRleGVkID0gZmFsc2U7XG4gICAgc3RhdGljIGlzX0R1bW15ID0gZmFsc2U7XG4gICAgc3RhdGljIGlzX1dpbGQgPSBmYWxzZTtcbiAgICBzdGF0aWMgaXNfRnVuY3Rpb24gPSBmYWxzZTtcbiAgICBzdGF0aWMgaXNfQWRkID0gZmFsc2U7XG4gICAgc3RhdGljIGlzX011bCA9IGZhbHNlO1xuICAgIHN0YXRpYyBpc19Qb3cgPSBmYWxzZTtcbiAgICBzdGF0aWMgaXNfTnVtYmVyID0gZmFsc2U7XG4gICAgc3RhdGljIGlzX0Zsb2F0ID0gZmFsc2U7XG4gICAgc3RhdGljIGlzX1JhdGlvbmFsID0gZmFsc2U7XG4gICAgc3RhdGljIGlzX0ludGVnZXIgPSBmYWxzZTtcbiAgICBzdGF0aWMgaXNfTnVtYmVyU3ltYm9sID0gZmFsc2U7XG4gICAgc3RhdGljIGlzX09yZGVyID0gZmFsc2U7XG4gICAgc3RhdGljIGlzX0Rlcml2YXRpdmUgPSBmYWxzZTtcbiAgICBzdGF0aWMgaXNfUGllY2V3aXNlID0gZmFsc2U7XG4gICAgc3RhdGljIGlzX1BvbHkgPSBmYWxzZTtcbiAgICBzdGF0aWMgaXNfQWxnZWJyYWljTnVtYmVyID0gZmFsc2U7XG4gICAgc3RhdGljIGlzX1JlbGF0aW9uYWwgPSBmYWxzZTtcbiAgICBzdGF0aWMgaXNfRXF1YWxpdHkgPSBmYWxzZTtcbiAgICBzdGF0aWMgaXNfQm9vbGVhbiA9IGZhbHNlO1xuICAgIHN0YXRpYyBpc19Ob3QgPSBmYWxzZTtcbiAgICBzdGF0aWMgaXNfTWF0cml4ID0gZmFsc2U7XG4gICAgc3RhdGljIGlzX1ZlY3RvciA9IGZhbHNlO1xuICAgIHN0YXRpYyBpc19Qb2ludCA9IGZhbHNlO1xuICAgIHN0YXRpYyBpc19NYXRBZGQgPSBmYWxzZTtcbiAgICBzdGF0aWMgaXNfTWF0TXVsID0gZmFsc2U7XG4gICAgc3RhdGljIGlzX25lZ2F0aXZlOiBib29sZWFuIHwgdW5kZWZpbmVkO1xuICAgIHN0YXRpYyBpc19jb21tdXRhdGl2ZTogYm9vbGVhbiB8IHVuZGVmaW5lZDtcblxuICAgIHN0YXRpYyBraW5kID0gVW5kZWZpbmVkS2luZDtcbiAgICBzdGF0aWMgYWxsX3VuaXF1ZV9wcm9wczogSGFzaFNldCA9IG5ldyBIYXNoU2V0KCk7XG5cbiAgICBjb25zdHJ1Y3RvciguLi5hcmdzOiBhbnkpIHtcbiAgICAgICAgc3VwZXIoKTtcbiAgICAgICAgY29uc3QgY2xzOiBhbnkgPSB0aGlzLmNvbnN0cnVjdG9yO1xuICAgICAgICB0aGlzLl9hc3N1bXB0aW9ucyA9IGNscy5kZWZhdWx0X2Fzc3VtcHRpb25zLnN0ZGNsb25lKCk7XG4gICAgICAgIHRoaXMuX21oYXNoID0gdW5kZWZpbmVkO1xuICAgICAgICB0aGlzLl9hcmdzID0gYXJncztcbiAgICAgICAgdGhpcy5hc3NpZ25Qcm9wcygpO1xuICAgIH1cblxuICAgIGFzc2lnblByb3BzKCkge1xuICAgICAgICBjb25zdCBjbHM6IGFueSA9IHRoaXMuY29uc3RydWN0b3I7XG4gICAgICAgIC8vIENyZWF0ZSBhIGRpY3Rpb25hcnkgdG8gaGFuZGxlIHRoZSBjdXJyZW50IHByb3BlcnRpZXMgb2YgdGhlIGNsYXNzXG4gICAgICAgIC8vIE9ubHkgZXZ1YXRlZCBvbmNlIHBlciBjbGFzc1xuICAgICAgICBpZiAodHlwZW9mIGNscy5fcHJvcF9oYW5kbGVyID09PSBcInVuZGVmaW5lZFwiKSB7XG4gICAgICAgICAgICBjbHMuX3Byb3BfaGFuZGxlciA9IG5ldyBIYXNoRGljdCgpO1xuICAgICAgICAgICAgZm9yIChjb25zdCBrIG9mIF9hc3N1bWVfZGVmaW5lZC50b0FycmF5KCkpIHtcbiAgICAgICAgICAgICAgICBjb25zdCBtZXRoMSA9IFwiX2V2YWxfaXNfXCIgKyBrO1xuICAgICAgICAgICAgICAgIGlmICh0aGlzW21ldGgxXSkge1xuICAgICAgICAgICAgICAgICAgICBjbHMuX3Byb3BfaGFuZGxlci5hZGQoaywgdGhpc1ttZXRoMV0pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICAvLyBBZGQgYWxsIGRlZmluZWQgcHJvcGVydGllcyBmcm9tIGFzc3VtZSBkZWZpbmVkXG4gICAgICAgIHRoaXMuX3Byb3BfaGFuZGxlciA9IGNscy5fcHJvcF9oYW5kbGVyLmNvcHkoKTtcbiAgICAgICAgZm9yIChjb25zdCBmYWN0IG9mIF9hc3N1bWVfZGVmaW5lZC50b0FycmF5KCkpIHtcbiAgICAgICAgICAgIG1ha2VfcHJvcGVydHkodGhpcywgZmFjdCk7XG4gICAgICAgIH1cbiAgICAgICAgLy8gQWRkIHJlbWFpbmluZyBwcm9wZXJ0aWVzIGZyb20gZGVmYXVsdCBhc3N1bXB0aW9uc1xuICAgICAgICBmb3IgKGNvbnN0IGZhY3Qgb2YgdGhpcy5fYXNzdW1wdGlvbnMua2V5cygpKSB7XG4gICAgICAgICAgICBtYWtlX3Byb3BlcnR5KHRoaXMsIGZhY3QpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgX19nZXRuZXdhcmdzX18oKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9hcmdzO1xuICAgIH1cblxuICAgIF9fZ2V0c3RhdGVfXygpOiBhbnkge1xuICAgICAgICByZXR1cm4gdW5kZWZpbmVkO1xuICAgIH1cblxuICAgIGhhc2goKSB7XG4gICAgICAgIGlmICh0eXBlb2YgdGhpcy5fbWhhc2ggPT09IFwidW5kZWZpbmVkXCIpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmNvbnN0cnVjdG9yLm5hbWUgKyB0aGlzLmhhc2hLZXkoKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdGhpcy5fbWhhc2g7XG4gICAgfVxuXG4gICAgLy8gYmFuZGFpZCBzb2x1dGlvbiBmb3IgaW5zdGFuY2VvZiBpc3N1ZSAtIHN0aWxsIG5lZWQgdG8gZml4XG4gICAgaW5zdGFuY2VvZkJhc2ljKCkge1xuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG5cbiAgICBhc3N1bXB0aW9uczAoKSB7XG4gICAgICAgIC8qXG4gICAgICAgIFJldHVybiBvYmplY3QgYHR5cGVgIGFzc3VtcHRpb25zLlxuICAgICAgICBGb3IgZXhhbXBsZTpcbiAgICAgICAgICBTeW1ib2woJ3gnLCByZWFsPVRydWUpXG4gICAgICAgICAgU3ltYm9sKCd4JywgaW50ZWdlcj1UcnVlKVxuICAgICAgICBhcmUgZGlmZmVyZW50IG9iamVjdHMuIEluIG90aGVyIHdvcmRzLCBiZXNpZGVzIFB5dGhvbiB0eXBlIChTeW1ib2wgaW5cbiAgICAgICAgdGhpcyBjYXNlKSwgdGhlIGluaXRpYWwgYXNzdW1wdGlvbnMgYXJlIGFsc28gZm9ybWluZyB0aGVpciB0eXBlaW5mby5cbiAgICAgICAgRXhhbXBsZXNcbiAgICAgICAgPT09PT09PT1cbiAgICAgICAgPj4+IGZyb20gc3ltcHkgaW1wb3J0IFN5bWJvbFxuICAgICAgICA+Pj4gZnJvbSBzeW1weS5hYmMgaW1wb3J0IHhcbiAgICAgICAgPj4+IHguYXNzdW1wdGlvbnMwXG4gICAgICAgIHsnY29tbXV0YXRpdmUnOiBUcnVlfVxuICAgICAgICA+Pj4geCA9IFN5bWJvbChcInhcIiwgcG9zaXRpdmU9VHJ1ZSlcbiAgICAgICAgPj4+IHguYXNzdW1wdGlvbnMwXG4gICAgICAgIHsnY29tbXV0YXRpdmUnOiBUcnVlLCAnY29tcGxleCc6IFRydWUsICdleHRlbmRlZF9uZWdhdGl2ZSc6IEZhbHNlLFxuICAgICAgICAgJ2V4dGVuZGVkX25vbm5lZ2F0aXZlJzogVHJ1ZSwgJ2V4dGVuZGVkX25vbnBvc2l0aXZlJzogRmFsc2UsXG4gICAgICAgICAnZXh0ZW5kZWRfbm9uemVybyc6IFRydWUsICdleHRlbmRlZF9wb3NpdGl2ZSc6IFRydWUsICdleHRlbmRlZF9yZWFsJzpcbiAgICAgICAgIFRydWUsICdmaW5pdGUnOiBUcnVlLCAnaGVybWl0aWFuJzogVHJ1ZSwgJ2ltYWdpbmFyeSc6IEZhbHNlLFxuICAgICAgICAgJ2luZmluaXRlJzogRmFsc2UsICduZWdhdGl2ZSc6IEZhbHNlLCAnbm9ubmVnYXRpdmUnOiBUcnVlLFxuICAgICAgICAgJ25vbnBvc2l0aXZlJzogRmFsc2UsICdub256ZXJvJzogVHJ1ZSwgJ3Bvc2l0aXZlJzogVHJ1ZSwgJ3JlYWwnOlxuICAgICAgICAgVHJ1ZSwgJ3plcm8nOiBGYWxzZX1cbiAgICAgICAgKi9cbiAgICAgICAgcmV0dXJuIHt9O1xuICAgIH1cblxuICAgIGhhc2hLZXkoKSB7XG4gICAgICAgIC8qIFJldHVybiBhIHR1cGxlIG9mIGluZm9ybWF0aW9uIGFib3V0IHNlbGYgdGhhdCBjYW4gYmUgdXNlZCB0b1xuICAgICAgICBjb21wdXRlIHRoZSBoYXNoLiBJZiBhIGNsYXNzIGRlZmluZXMgYWRkaXRpb25hbCBhdHRyaWJ1dGVzLFxuICAgICAgICBsaWtlIGBgbmFtZWBgIGluIFN5bWJvbCwgdGhlbiB0aGlzIG1ldGhvZCBzaG91bGQgYmUgdXBkYXRlZFxuICAgICAgICBhY2NvcmRpbmdseSB0byByZXR1cm4gc3VjaCByZWxldmFudCBhdHRyaWJ1dGVzLlxuICAgICAgICBEZWZpbmluZyBtb3JlIHRoYW4gX2hhc2hhYmxlX2NvbnRlbnQgaXMgbmVjZXNzYXJ5IGlmIF9fZXFfXyBoYXNcbiAgICAgICAgYmVlbiBkZWZpbmVkIGJ5IGEgY2xhc3MuIFNlZSBub3RlIGFib3V0IHRoaXMgaW4gQmFzaWMuX19lcV9fLiovXG5cbiAgICAgICAgcmV0dXJuIHRoaXMuX2FyZ3M7XG4gICAgfVxuXG4gICAgc3RhdGljIGNtcChzZWxmOiBhbnksIG90aGVyOiBhbnkpOiBhbnkge1xuICAgICAgICAvKlxuICAgICAgICBSZXR1cm4gLTEsIDAsIDEgaWYgdGhlIG9iamVjdCBpcyBzbWFsbGVyLCBlcXVhbCwgb3IgZ3JlYXRlciB0aGFuIG90aGVyLlxuICAgICAgICBOb3QgaW4gdGhlIG1hdGhlbWF0aWNhbCBzZW5zZS4gSWYgdGhlIG9iamVjdCBpcyBvZiBhIGRpZmZlcmVudCB0eXBlXG4gICAgICAgIGZyb20gdGhlIFwib3RoZXJcIiB0aGVuIHRoZWlyIGNsYXNzZXMgYXJlIG9yZGVyZWQgYWNjb3JkaW5nIHRvXG4gICAgICAgIHRoZSBzb3J0ZWRfY2xhc3NlcyBsaXN0LlxuICAgICAgICBFeGFtcGxlc1xuICAgICAgICA9PT09PT09PVxuICAgICAgICA+Pj4gZnJvbSBzeW1weS5hYmMgaW1wb3J0IHgsIHlcbiAgICAgICAgPj4+IHguY29tcGFyZSh5KVxuICAgICAgICAtMVxuICAgICAgICA+Pj4geC5jb21wYXJlKHgpXG4gICAgICAgIDBcbiAgICAgICAgPj4+IHkuY29tcGFyZSh4KVxuICAgICAgICAxXG4gICAgICAgICovXG4gICAgICAgIGlmIChzZWxmID09PSBvdGhlcikge1xuICAgICAgICAgICAgcmV0dXJuIDA7XG4gICAgICAgIH1cbiAgICAgICAgY29uc3QgbjEgPSBzZWxmLmNvbnN0cnVjdG9yLm5hbWU7XG4gICAgICAgIGNvbnN0IG4yID0gb3RoZXIuY29uc3RydWN0b3IubmFtZTtcbiAgICAgICAgaWYgKG4xICYmIG4yKSB7XG4gICAgICAgICAgICByZXR1cm4gKG4xID4gbjIgYXMgdW5rbm93biBhcyBudW1iZXIpIC0gKG4xIDwgbjIgYXMgdW5rbm93biBhcyBudW1iZXIpO1xuICAgICAgICB9XG5cbiAgICAgICAgY29uc3Qgc3QgPSBzZWxmLl9oYXNoYWJsZV9jb250ZW50KCk7XG4gICAgICAgIGNvbnN0IG90ID0gb3RoZXIuX2hhc2hhYmxlX2NvbnRlbnQoKTtcbiAgICAgICAgaWYgKHN0ICYmIG90KSB7XG4gICAgICAgICAgICByZXR1cm4gKHN0Lmxlbmd0aCA+IG90Lmxlbmd0aCBhcyB1bmtub3duIGFzIG51bWJlcikgLSAoc3QubGVuZ3RoIDwgb3QubGVuZ3RoIGFzIHVua25vd24gYXMgbnVtYmVyKTtcbiAgICAgICAgfVxuICAgICAgICBmb3IgKGNvbnN0IGVsZW0gb2YgVXRpbC56aXAoc3QsIG90KSkge1xuICAgICAgICAgICAgY29uc3QgbCA9IGVsZW1bMF07XG4gICAgICAgICAgICBjb25zdCByID0gZWxlbVsxXTtcbiAgICAgICAgICAgIC8vICEhISBza2lwcGluZyBmcm96ZW5zZXQgc3R1ZmZcbiAgICAgICAgICAgIGxldCBjO1xuICAgICAgICAgICAgaWYgKGwgaW5zdGFuY2VvZiBCYXNpYykge1xuICAgICAgICAgICAgICAgIGMgPSBsLmNtcChyKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgYyA9IChsID4gciBhcyB1bmtub3duIGFzIG51bWJlcikgLSAobCA8IHIgYXMgdW5rbm93biBhcyBudW1iZXIpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKGMpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gYztcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gMDtcbiAgICB9XG5cbiAgICBfY29uc3RydWN0b3JfcG9zdHByb2Nlc3Nvcl9tYXBwaW5nOiBSZWNvcmQ8YW55LCBhbnk+ID0ge307XG5cbiAgICBfZXhlY19jb25zdHJ1Y3Rvcl9wb3N0cHJvY2Vzc29ycyhvYmo6IGFueSkge1xuICAgICAgICBjb25zdCBjbHNuYW1lID0gdGhpcy5jb25zdHJ1Y3Rvci5uYW1lO1xuICAgICAgICBjb25zdCBwb3N0cHJvY2Vzc29ycyA9IG5ldyBIYXNoRGljdCgpO1xuICAgICAgICAvLyAhISEgZm9yIGxvb3Agbm90IGltcGxlbWVudGVkIC0gY29tcGxpY2F0ZWQgdG8gcmVjcmVhdGVcbiAgICAgICAgZm9yIChjb25zdCBmIG9mIHBvc3Rwcm9jZXNzb3JzLmdldChjbHNuYW1lLCBbXSkpIHtcbiAgICAgICAgICAgIG9iaiA9IGYob2JqKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gb2JqO1xuICAgIH1cblxuICAgIF9ldmFsX3N1YnMob2xkOiBhbnksIF9uZXc6IGFueSk6IGFueSB7XG4gICAgICAgIC8vIGRvbid0IG5lZWQgYW55IG90aGVyIHV0aWxpdGllcyB1bnRpbCB3ZSBkbyBtb3JlIGNvbXBsaWNhdGVkIHN1YnNcbiAgICAgICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgICB9XG5cbiAgICBfYXJlc2FtZShhOiBhbnksIGI6IGFueSkge1xuICAgICAgICBpZiAoYS5pc19OdW1iZXIgJiYgYi5pc19OdW1iZXIpIHtcbiAgICAgICAgICAgIHJldHVybiBhID09PSBiICYmIGEuY29uc3RydWN0b3IubmFtZSA9PT0gYi5jb25zdHJ1Y3Rvci5uYW1lO1xuICAgICAgICB9XG4gICAgICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBuZXctY2FwXG4gICAgICAgIGZvciAoY29uc3QgaXRlbSBvZiBVdGlsLnppcChuZXcgcHJlb3JkZXJfdHJhdmVyc2FsKGEpLmFzSXRlcigpLCBuZXcgcHJlb3JkZXJfdHJhdmVyc2FsKGIpLmFzSXRlcigpKSkge1xuICAgICAgICAgICAgY29uc3QgaSA9IGl0ZW1bMF07XG4gICAgICAgICAgICBjb25zdCBqID0gaXRlbVsxXTtcbiAgICAgICAgICAgIGlmIChpICE9PSBqIHx8IHR5cGVvZiBpICE9PSB0eXBlb2Ygaikge1xuICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG5cbiAgICBzdWJzKC4uLmFyZ3M6IGFueSkge1xuICAgICAgICBsZXQgc2VxdWVuY2U7XG4gICAgICAgIGlmIChhcmdzLmxlbmd0aCA9PT0gMSkge1xuICAgICAgICAgICAgc2VxdWVuY2UgPSBhcmdzWzBdO1xuICAgICAgICAgICAgaWYgKHNlcXVlbmNlIGluc3RhbmNlb2YgSGFzaFNldCkge1xuICAgICAgICAgICAgfSBlbHNlIGlmIChzZXF1ZW5jZSBpbnN0YW5jZW9mIEhhc2hEaWN0KSB7XG4gICAgICAgICAgICAgICAgc2VxdWVuY2UgPSBzZXF1ZW5jZS5lbnRyaWVzKCk7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKFN5bWJvbC5pdGVyYXRvciBpbiBPYmplY3Qoc2VxdWVuY2UpKSB7XG4gICAgICAgICAgICAgICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG1heC1sZW5cbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJXaGVuIGEgc2luZ2xlIGFyZ3VtZW50IGlzIHBhc3NlZCB0byBzdWJzIGl0IHNob3VsZCBiZSBhIGRpY3Rpb25hcnkgb2Ygb2xkOiBuZXcgcGFpcnMgb3IgYW4gaXRlcmFibGUgb2YgKG9sZCwgbmV3KSB0dXBsZXNcIik7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSBpZiAoYXJncy5sZW5ndGggPT09IDIpIHtcbiAgICAgICAgICAgIHNlcXVlbmNlID0gW2FyZ3NdO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwic3ViIGFjY2VwdHMgMSBvciAyIGFyZ3NcIik7XG4gICAgICAgIH1cbiAgICAgICAgbGV0IHJ2ID0gdGhpcztcbiAgICAgICAgZm9yIChjb25zdCBpdGVtIG9mIHNlcXVlbmNlKSB7XG4gICAgICAgICAgICBjb25zdCBvbGQgPSBpdGVtWzBdO1xuICAgICAgICAgICAgY29uc3QgX25ldyA9IGl0ZW1bMV07XG4gICAgICAgICAgICBydiA9IHJ2Ll9zdWJzKG9sZCwgX25ldyk7XG4gICAgICAgICAgICBpZiAoIShydiBpbnN0YW5jZW9mIEJhc2ljKSkge1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBydjtcbiAgICB9XG5cbiAgICBfc3VicyhvbGQ6IGFueSwgX25ldzogYW55KSB7XG4gICAgICAgIGZ1bmN0aW9uIGZhbGxiYWNrKGNsczogYW55LCBvbGQ6IGFueSwgX25ldzogYW55KSB7XG4gICAgICAgICAgICBsZXQgaGl0ID0gZmFsc2U7XG4gICAgICAgICAgICBjb25zdCBhcmdzID0gY2xzLl9hcmdzO1xuICAgICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBhcmdzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgbGV0IGFyZyA9IGFyZ3NbaV07XG4gICAgICAgICAgICAgICAgaWYgKCEoYXJnLl9ldmFsX3N1YnMpKSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBhcmcgPSBhcmcuX3N1YnMob2xkLCBfbmV3KTtcbiAgICAgICAgICAgICAgICBpZiAoIShjbHMuX2FyZXNhbWUoYXJnLCBhcmdzW2ldKSkpIHtcbiAgICAgICAgICAgICAgICAgICAgaGl0ID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgYXJnc1tpXSA9IGFyZztcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoaGl0KSB7XG4gICAgICAgICAgICAgICAgbGV0IHJ2O1xuICAgICAgICAgICAgICAgIGlmIChjbHMuY29uc3RydWN0b3IubmFtZSA9PT0gXCJNdWxcIiB8fCBjbHMuY29uc3RydWN0b3IubmFtZSA9PT0gXCJBZGRcIikge1xuICAgICAgICAgICAgICAgICAgICBydiA9IG5ldyBjbHMuY29uc3RydWN0b3IodHJ1ZSwgdHJ1ZSwgLi4uYXJncyk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgcnYgPSBuZXcgY2xzLmNvbnN0cnVjdG9yKC4uLmFyZ3MpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICByZXR1cm4gcnY7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gY2xzO1xuICAgICAgICB9XG4gICAgICAgIGlmICh0aGlzLl9hcmVzYW1lKHRoaXMsIG9sZCkpIHtcbiAgICAgICAgICAgIHJldHVybiBfbmV3O1xuICAgICAgICB9XG5cbiAgICAgICAgbGV0IHJ2ID0gdGhpcy5fZXZhbF9zdWJzKG9sZCwgX25ldyk7XG4gICAgICAgIGlmICh0eXBlb2YgcnYgPT09IFwidW5kZWZpbmVkXCIpIHtcbiAgICAgICAgICAgIHJ2ID0gZmFsbGJhY2sodGhpcywgb2xkLCBfbmV3KTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gcnY7XG4gICAgfVxufTtcblxuLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5ldy1jYXBcbmNvbnN0IEJhc2ljID0gX0Jhc2ljKE9iamVjdCk7XG5NYW5hZ2VkUHJvcGVydGllcy5yZWdpc3RlcihCYXNpYyk7XG5cbmNvbnN0IEF0b20gPSAoc3VwZXJjbGFzczogYW55KSA9PiBjbGFzcyBBdG9tIGV4dGVuZHMgbWl4KGJhc2UpLndpdGgoX0Jhc2ljKSB7XG4gICAgLypcbiAgICBBIHBhcmVudCBjbGFzcyBmb3IgYXRvbWljIHRoaW5ncy4gQW4gYXRvbSBpcyBhbiBleHByZXNzaW9uIHdpdGggbm8gc3ViZXhwcmVzc2lvbnMuXG4gICAgRXhhbXBsZXNcbiAgICA9PT09PT09PVxuICAgIFN5bWJvbCwgTnVtYmVyLCBSYXRpb25hbCwgSW50ZWdlciwgLi4uXG4gICAgQnV0IG5vdDogQWRkLCBNdWwsIFBvdywgLi4uXG4gICAgKi9cblxuICAgIHN0YXRpYyBpc19BdG9tID0gdHJ1ZTtcblxuICAgIF9fc2xvdHNfXzogYW55W10gPSBbXTtcblxuICAgIG1hdGNoZXMoZXhwcjogYW55LCByZXBsX2RpY3Q6IEhhc2hEaWN0ID0gdW5kZWZpbmVkLCBvbGQ6IGFueSA9IGZhbHNlKSB7XG4gICAgICAgIGlmICh0aGlzID09PSBleHByKSB7XG4gICAgICAgICAgICBpZiAodHlwZW9mIHJlcGxfZGljdCA9PT0gXCJ1bmRlZmluZWRcIikge1xuICAgICAgICAgICAgICAgIHJldHVybiBuZXcgSGFzaERpY3QoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiByZXBsX2RpY3QuY29weSgpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgeHJlcGxhY2UocnVsZTogYW55LCBoYWNrMjogYW55ID0gZmFsc2UpIHtcbiAgICAgICAgcmV0dXJuIHJ1bGUuZ2V0KHRoaXMpO1xuICAgIH1cblxuICAgIGRvaXQoLi4uaGludHM6IGFueSkge1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9XG59O1xuXG4vLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbmV3LWNhcFxuY29uc3QgX0F0b21pY0V4cHIgPSBBdG9tKE9iamVjdCk7XG5NYW5hZ2VkUHJvcGVydGllcy5yZWdpc3RlcihfQXRvbWljRXhwcik7XG5cbmV4cG9ydCB7X0Jhc2ljLCBCYXNpYywgQXRvbSwgX0F0b21pY0V4cHJ9O1xuIiwgIi8qXG5Ob3RhYmxlIGNoYW5nZXMgbWFkZSAoYW5kIG5vdGVzKVxuLSBSZXdvcmtlZCBTaW5nbGV0b24gdG8gdXNlIGEgcmVnaXN0cnkgc3lzdGVtIHVzaW5nIGEgc3RhdGljIGRpY3Rpb25hcnlcbi0gUmVnaXN0ZXJzIG51bWJlciBvYmplY3RzIGFzIHRoZXkgYXJlIHVzZWRcbiovXG5cbi8qIGVzbGludC1kaXNhYmxlIG5ldy1jYXAgKi9cbmltcG9ydCB7TWFuYWdlZFByb3BlcnRpZXN9IGZyb20gXCIuL2Fzc3VtcHRpb25zXCI7XG5cbmNsYXNzIFNpbmdsZXRvbiB7XG4gICAgc3RhdGljIHJlZ2lzdHJ5OiBSZWNvcmQ8YW55LCBhbnk+ID0ge307XG5cbiAgICBzdGF0aWMgcmVnaXN0ZXIobmFtZTogc3RyaW5nLCBjbHM6IGFueSkge1xuICAgICAgICBNYW5hZ2VkUHJvcGVydGllcy5yZWdpc3RlcihjbHMpO1xuICAgICAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbmV3LWNhcFxuICAgICAgICBTaW5nbGV0b24ucmVnaXN0cnlbbmFtZV0gPSBuZXcgY2xzKCk7XG4gICAgfVxufVxuXG5jb25zdCBTOiBhbnkgPSBuZXcgU2luZ2xldG9uKCk7XG5cblxuZXhwb3J0IHtTLCBTaW5nbGV0b259O1xuIiwgIi8qXG5OZXcgY2xhc3MgZ2xvYmFsXG5IZWxwcyB0byBhdm9pZCBjeWNsaWNhbCBpbXBvcnRzIGJ5IHN0b3JpbmcgY29uc3RydWN0b3JzIGFuZCBmdW5jdGlvbnMgd2hpY2hcbmNhbiBiZSBhY2Nlc3NlZCBhbnl3aGVyZVxuXG5Ob3RlOiBzdGF0aWMgbmV3IG1ldGhvZHMgYXJlIGNyZWF0ZWQgaW4gdGhlIGNsYXNzZXMgdG8gYmUgcmVnaXN0ZXJlZCwgYW5kIHRob3NlXG5tZXRob2RzIGFyZSBhZGRlZCBoZXJlXG4qL1xuXG5leHBvcnQgY2xhc3MgR2xvYmFsIHtcbiAgICBzdGF0aWMgY29uc3RydWN0b3JzOiBSZWNvcmQ8c3RyaW5nLCBhbnk+ID0ge307XG4gICAgc3RhdGljIGZ1bmN0aW9uczogUmVjb3JkPHN0cmluZywgYW55PiA9IHt9O1xuXG4gICAgc3RhdGljIGNvbnN0cnVjdChjbGFzc25hbWU6IHN0cmluZywgLi4uYXJnczogYW55W10pIHtcbiAgICAgICAgY29uc3QgY29uc3RydWN0b3IgPSBHbG9iYWwuY29uc3RydWN0b3JzW2NsYXNzbmFtZV07XG4gICAgICAgIHJldHVybiBjb25zdHJ1Y3RvciguLi5hcmdzKTtcbiAgICB9XG5cbiAgICBzdGF0aWMgcmVnaXN0ZXIoY2xzOiBzdHJpbmcsIGNvbnN0cnVjdG9yOiBhbnkpIHtcbiAgICAgICAgR2xvYmFsLmNvbnN0cnVjdG9yc1tjbHNdID0gY29uc3RydWN0b3I7XG4gICAgfVxuXG4gICAgc3RhdGljIHJlZ2lzdGVyZnVuYyhuYW1lOiBzdHJpbmcsIGZ1bmM6IGFueSkge1xuICAgICAgICBHbG9iYWwuZnVuY3Rpb25zW25hbWVdID0gZnVuYztcbiAgICB9XG5cbiAgICBzdGF0aWMgZXZhbGZ1bmMobmFtZTogc3RyaW5nLCAuLi5hcmdzOiBhbnlbXSkge1xuICAgICAgICBjb25zdCBmdW5jID0gR2xvYmFsLmZ1bmN0aW9uc1tuYW1lXTtcbiAgICAgICAgcmV0dXJuIGZ1bmMoLi4uYXJncyk7XG4gICAgfVxufVxuIiwgIi8qIGVzbGludC1kaXNhYmxlIG5vLXVudXNlZC12YXJzICovXG4vKiBNaXNjZWxsYW5lb3VzIHN0dWZmIHRoYXQgZG9lcyBub3QgcmVhbGx5IGZpdCBhbnl3aGVyZSBlbHNlICovXG5cbi8qXG5cbk5vdGFibGUgY2hhbmdlcyBtYWRlIChXQiBhbmQgR00pOlxuLSBGaWxsZGVkZW50IGFuZCBhc19pbnQgYXJlIHJld3JpdHRlbiB0byBpbmNsdWRlIHRoZSBzYW1lIGZ1bmN0aW9uYWxpdHkgd2l0aFxuICBkaWZmZXJlbnQgbWV0aG9kb2xvZ3lcbi0gTWFueSBmdW5jdGlvbnMgYXJlIG5vdCB5ZXQgaW1wbGVtZW50ZWQgYW5kIHdpbGwgYmUgY29tcGxldGVkIGFzIHdlIGZpbmQgdGhlbVxuICBuZWNlc3Nhcnlcbn1cblxuKi9cblxuXG5jbGFzcyBVbmRlY2lkYWJsZSBleHRlbmRzIEVycm9yIHtcbiAgICAvLyBhbiBlcnJvciB0byBiZSByYWlzZWQgd2hlbiBhIGRlY2lzaW9uIGNhbm5vdCBiZSBtYWRlIGRlZmluaXRpdmVseVxuICAgIC8vIHdoZXJlIGEgZGVmaW5pdGl2ZSBhbnN3ZXIgaXMgbmVlZGVkXG59XG5cbi8qXG5mdW5jdGlvbiBmaWxsZGVkZW50KHM6IHN0cmluZywgdzogbnVtYmVyID0gNzApOiBzdHJpbmcge1xuXG4gICAgLy8gcmVtb3ZlIGVtcHR5IGJsYW5rIGxpbmVzXG4gICAgbGV0IHN0ciA9IHMucmVwbGFjZSgvXlxccypcXG4vZ20sIFwiXCIpO1xuICAgIC8vIGRlZGVudFxuICAgIHN0ciA9IGRlZGVudChzdHIpO1xuICAgIC8vIHdyYXBcbiAgICBjb25zdCBhcnIgPSBzdHIuc3BsaXQoXCIgXCIpO1xuICAgIGxldCByZXMgPSBcIlwiO1xuICAgIGxldCBsaW5lbGVuZ3RoID0gMDtcbiAgICBmb3IgKGNvbnN0IHdvcmQgb2YgYXJyKSB7XG4gICAgICAgIGlmIChsaW5lbGVuZ3RoIDw9IHcgKyB3b3JkLmxlbmd0aCkge1xuICAgICAgICAgICAgcmVzICs9IHdvcmQ7XG4gICAgICAgICAgICBsaW5lbGVuZ3RoICs9IHdvcmQubGVuZ3RoO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmVzICs9IFwiXFxuXCI7XG4gICAgICAgICAgICBsaW5lbGVuZ3RoID0gMDtcbiAgICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gcmVzO1xufVxuKi9cblxuXG5mdW5jdGlvbiBzdHJsaW5lcyhzOiBzdHJpbmcsIGM6IG51bWJlciA9IDY0LCBzaG9ydD1mYWxzZSkge1xuICAgIHRocm93IG5ldyBFcnJvcihcInN0cmxpbmVzIGlzIG5vdCB5ZXQgaW1wbGVtZW50ZWRcIik7XG59XG5cbmZ1bmN0aW9uIHJhd2xpbmVzKHM6IHN0cmluZykge1xuICAgIHRocm93IG5ldyBFcnJvcihcInJhd2xpbmVzIGlzIG5vdCB5ZXQgaW1wbGVtZW50ZWRcIik7XG59XG5cbmZ1bmN0aW9uIGRlYnVnX2RlY29yYXRvcihmdW5jOiBhbnkpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoXCJkZWJ1Z19kZWNvcmF0b3IgaXMgbm90IHlldCBpbXBsZW1lbnRlZFwiKTtcbn1cblxuZnVuY3Rpb24gZGVidWcoLi4uYXJnczogYW55KSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKFwiZGVidWcgaXMgbm90IHlldCBpbXBsZW1lbnRlZFwiKTtcbn1cblxuZnVuY3Rpb24gZmluZF9leGVjdXRhYmxlKGV4ZWN1dGFibGU6IGFueSwgcGF0aDogYW55PXVuZGVmaW5lZCkge1xuICAgIHRocm93IG5ldyBFcnJvcihcImZpbmRfZXhlY3V0YWJsZSBpcyBub3QgeWV0IGltcGxlbWVudGVkXCIpO1xufVxuXG5mdW5jdGlvbiBmdW5jX25hbWUoeDogYW55LCBzaG9ydDogYW55PWZhbHNlKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKFwiZnVuY19uYW1lIGlzIG5vdCB5ZXQgaW1wbGVtZW50ZWRcIik7XG59XG5cbmZ1bmN0aW9uIF9yZXBsYWNlKHJlcHM6IGFueSkge1xuICAgIHRocm93IG5ldyBFcnJvcihcIl9yZXBsYWNlIGlzIG5vdCB5ZXQgaW1wbGVtZW50ZWRcIik7XG59XG5cbmZ1bmN0aW9uIHJlcGxhY2Uoc3RyOiBzdHJpbmcsIC4uLnJlcHM6IGFueSkge1xuICAgIHRocm93IG5ldyBFcnJvcihcInJlcGxhY2UgaXMgbm90IHlldCBpbXBsZW1lbnRlZFwiKTtcbn1cblxuZnVuY3Rpb24gdHJhbnNsYXRlKHM6IGFueSwgYTogYW55LCBiOiBhbnk9dW5kZWZpbmVkLCBjOiBhbnk9dW5kZWZpbmVkKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKFwidHJhbnNsYXRlIGlzIG5vdCB5ZXQgaW1wbGVtZW50ZWRcIik7XG59XG5cbmZ1bmN0aW9uIG9yZGluYWwobnVtOiBhbnkpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoXCJvcmRpbmFsIGlzIG5vdCB5ZXQgaW1wbGVtZW50ZWRcIik7XG59XG5cbmZ1bmN0aW9uIGFzX2ludChuOiBhbnkpIHtcbiAgICBpZiAoIU51bWJlci5pc0ludGVnZXIobikpIHsgLy8gISEhIC0gbWlnaHQgbmVlZCB0byB1cGRhdGUgdGhpc1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IobiArIFwiIGlzIG5vdCBpbnRcIik7XG4gICAgfVxuICAgIHJldHVybiBuO1xufVxuXG5leHBvcnQge2FzX2ludH07XG4iLCAiLypcbk5vdGFibGUgY2hhbmdlcyBtYWRlIChhbmQgbm90ZXMpOlxuLSBWZXJ5IGJhcmVib25lcyB2ZXJzaW9ucyBvZiBFeHByIGltcGxlbWVudGVkIHNvIGZhciAtIHZlcnkgZmV3IHV0aWwgbWV0aG9kc1xuLSBOb3RlIHRoYXQgZXhwcmVzc2lvbiB1c2VzIGdsb2JhbC50cyB0byBjb25zdHJ1Y3QgYWRkIGFuZCBtdWwgb2JqZWN0cywgd2hpY2hcbiAgYXZvaWRzIGN5Y2xpY2FsIGltcG9ydHNcbiovXG5cbmltcG9ydCB7X0Jhc2ljLCBBdG9tfSBmcm9tIFwiLi9iYXNpY1wiO1xuaW1wb3J0IHtIYXNoU2V0LCBtaXh9IGZyb20gXCIuL3V0aWxpdHlcIjtcbmltcG9ydCB7TWFuYWdlZFByb3BlcnRpZXN9IGZyb20gXCIuL2Fzc3VtcHRpb25zXCI7XG5pbXBvcnQge1N9IGZyb20gXCIuL3NpbmdsZXRvblwiO1xuaW1wb3J0IHtHbG9iYWx9IGZyb20gXCIuL2dsb2JhbFwiO1xuaW1wb3J0IHthc19pbnR9IGZyb20gXCIuLi91dGlsaXRpZXMvbWlzY1wiO1xuXG5cbmNvbnN0IEV4cHIgPSAoc3VwZXJjbGFzczogYW55KSA9PiBjbGFzcyBFeHByIGV4dGVuZHMgbWl4KHN1cGVyY2xhc3MpLndpdGgoX0Jhc2ljKSB7XG4gICAgLypcbiAgICBCYXNlIGNsYXNzIGZvciBhbGdlYnJhaWMgZXhwcmVzc2lvbnMuXG4gICAgRXhwbGFuYXRpb25cbiAgICA9PT09PT09PT09PVxuICAgIEV2ZXJ5dGhpbmcgdGhhdCByZXF1aXJlcyBhcml0aG1ldGljIG9wZXJhdGlvbnMgdG8gYmUgZGVmaW5lZFxuICAgIHNob3VsZCBzdWJjbGFzcyB0aGlzIGNsYXNzLCBpbnN0ZWFkIG9mIEJhc2ljICh3aGljaCBzaG91bGQgYmVcbiAgICB1c2VkIG9ubHkgZm9yIGFyZ3VtZW50IHN0b3JhZ2UgYW5kIGV4cHJlc3Npb24gbWFuaXB1bGF0aW9uLCBpLmUuXG4gICAgcGF0dGVybiBtYXRjaGluZywgc3Vic3RpdHV0aW9ucywgZXRjKS5cbiAgICBJZiB5b3Ugd2FudCB0byBvdmVycmlkZSB0aGUgY29tcGFyaXNvbnMgb2YgZXhwcmVzc2lvbnM6XG4gICAgU2hvdWxkIHVzZSBfZXZhbF9pc19nZSBmb3IgaW5lcXVhbGl0eSwgb3IgX2V2YWxfaXNfZXEsIHdpdGggbXVsdGlwbGUgZGlzcGF0Y2guXG4gICAgX2V2YWxfaXNfZ2UgcmV0dXJuIHRydWUgaWYgeCA+PSB5LCBmYWxzZSBpZiB4IDwgeSwgYW5kIE5vbmUgaWYgdGhlIHR3byB0eXBlc1xuICAgIGFyZSBub3QgY29tcGFyYWJsZSBvciB0aGUgY29tcGFyaXNvbiBpcyBpbmRldGVybWluYXRlXG4gICAgU2VlIEFsc29cbiAgICA9PT09PT09PVxuICAgIHN5bXB5LmNvcmUuYmFzaWMuQmFzaWNcbiAgICAqL1xuXG4gICAgX19zbG90c19fOiBhbnlbXSA9IFtdO1xuICAgIHN0YXRpYyBpc19zY2FsYXIgPSB0cnVlO1xuXG4gICAgY29uc3RydWN0b3IoLi4uYXJnczogYW55KSB7XG4gICAgICAgIHN1cGVyKC4uLmFyZ3MpO1xuICAgIH1cblxuICAgIGFzX2Jhc2VfZXhwKCkge1xuICAgICAgICByZXR1cm4gW3RoaXMsIFMuT25lXTtcbiAgICB9XG5cbiAgICBhc19jb2VmZl9NdWwocmF0aW9uYWw6IGJvb2xlYW4gPSBmYWxzZSkge1xuICAgICAgICByZXR1cm4gW1MuT25lLCB0aGlzXTtcbiAgICB9XG5cbiAgICBhc19jb2VmZl9BZGQoKSB7XG4gICAgICAgIHJldHVybiBbUy5aZXJvLCB0aGlzXTtcbiAgICB9XG5cbiAgICBfX2FkZF9fKG90aGVyOiBhbnkpIHtcbiAgICAgICAgcmV0dXJuIEdsb2JhbC5jb25zdHJ1Y3QoXCJBZGRcIiwgdHJ1ZSwgdHJ1ZSwgdGhpcywgb3RoZXIpO1xuICAgIH1cblxuICAgIF9fcmFkZF9fKG90aGVyOiBhbnkpIHtcbiAgICAgICAgcmV0dXJuIEdsb2JhbC5jb25zdHJ1Y3QoXCJBZGRcIiwgdHJ1ZSwgdHJ1ZSwgb3RoZXIsIHRoaXMpO1xuICAgIH1cblxuICAgIF9fc3ViX18ob3RoZXI6IGFueSkge1xuICAgICAgICByZXR1cm4gR2xvYmFsLmNvbnN0cnVjdChcIkFkZFwiLCB0cnVlLCB0cnVlLCB0aGlzLCBvdGhlci5fX211bF9fKFMuTmVnYXRpdmVPbmUpKTtcbiAgICB9XG5cbiAgICBfX3JzdWJfXyhvdGhlcjogYW55KSB7XG4gICAgICAgIHJldHVybiBHbG9iYWwuY29uc3RydWN0KFwiQWRkXCIsIHRydWUsIHRydWUsIG90aGVyLCB0aGlzLl9fbXVsX18oUy5OZWdhdGl2ZU9uZSkpO1xuICAgIH1cblxuICAgIF9fbXVsX18ob3RoZXI6IGFueSkge1xuICAgICAgICByZXR1cm4gR2xvYmFsLmNvbnN0cnVjdChcIk11bFwiLCB0cnVlLCB0cnVlLCB0aGlzLCBvdGhlcik7XG4gICAgfVxuXG4gICAgX19ybXVsX18ob3RoZXI6IGFueSkge1xuICAgICAgICByZXR1cm4gR2xvYmFsLmNvbnN0cnVjdChcIk11bFwiLCB0cnVlLCB0cnVlLCBvdGhlciwgdGhpcyk7XG4gICAgfVxuXG4gICAgX3BvdyhvdGhlcjogYW55KSB7XG4gICAgICAgIHJldHVybiBHbG9iYWwuY29uc3RydWN0KFwiUG93XCIsIHRoaXMsIG90aGVyKTtcbiAgICB9XG5cbiAgICBfX3Bvd19fKG90aGVyOiBhbnksIG1vZDogYm9vbGVhbiA9IHVuZGVmaW5lZCkge1xuICAgICAgICBpZiAodHlwZW9mIG1vZCA9PT0gXCJ1bmRlZmluZWRcIikge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX3BvdyhvdGhlcik7XG4gICAgICAgIH1cbiAgICAgICAgbGV0IF9zZWxmOyBsZXQgX290aGVyOyBsZXQgX21vZDtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIFtfc2VsZiwgX290aGVyLCBfbW9kXSA9IFthc19pbnQodGhpcyksIGFzX2ludChvdGhlciksIGFzX2ludChtb2QpXTtcbiAgICAgICAgICAgIGlmIChvdGhlciA+PSAwKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIEdsb2JhbC5jb25zdHJ1Y3QoXCJfTnVtYmVyX1wiLCBfc2VsZioqX290aGVyICUgX21vZCk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHJldHVybiBHbG9iYWwuY29uc3RydWN0KFwiX051bWJlcl9cIiwgR2xvYmFsLmV2YWxmdW5jKFwibW9kX2ludmVyc2VcIiwgKF9zZWxmICoqIChfb3RoZXIpICUgKG1vZCBhcyBhbnkpKSwgbW9kKSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0gY2F0Y2ggKEVycm9yKSB7XG4gICAgICAgICAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tdW51c2VkLXZhcnNcbiAgICAgICAgICAgIGNvbnN0IHBvd2VyID0gdGhpcy5fcG93KF9vdGhlcik7XG4gICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgIC8vIHJldHVybiBwb3dlci5fX21vZF9fKG1vZCk7XG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwibW9kIGNsYXNzIG5vdCB5ZXQgaW1wbGVtZW50ZWRcIik7XG4gICAgICAgICAgICB9IGNhdGNoIChFcnJvcikge1xuICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcIm5vdCBpbXBsZW1lbnRlZFwiKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgIF9fcnBvd19fKG90aGVyOiBhbnkpIHtcbiAgICAgICAgcmV0dXJuIEdsb2JhbC5jb25zdHJ1Y3QoXCJQb3dcIiwgb3RoZXIsIHRoaXMpO1xuICAgIH1cblxuICAgIF9fdHJ1ZWRpdl9fKG90aGVyOiBhbnkpIHtcbiAgICAgICAgY29uc3QgZGVub20gPSBHbG9iYWwuY29uc3RydWN0KFwiUG93XCIsIG90aGVyLCBTLk5lZ2F0aXZlT25lKTtcbiAgICAgICAgaWYgKHRoaXMgPT09IFMuT25lKSB7XG4gICAgICAgICAgICByZXR1cm4gZGVub207XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gR2xvYmFsLmNvbnN0cnVjdChcIk11bFwiLCB0cnVlLCB0cnVlLCB0aGlzLCBkZW5vbSk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBfX3J0cnVlZGl2X18ob3RoZXI6IGFueSkge1xuICAgICAgICBjb25zdCBkZW5vbSA9IEdsb2JhbC5jb25zdHJ1Y3QoXCJQb3dcIiwgdGhpcywgUy5OZWdhdGl2ZU9uZSk7XG4gICAgICAgIGlmIChvdGhlciA9PT0gUy5PbmUpIHtcbiAgICAgICAgICAgIHJldHVybiBkZW5vbTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiBHbG9iYWwuY29uc3RydWN0KFwiTXVsXCIsIHRydWUsIHRydWUsIG90aGVyLCBkZW5vbSk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBfZXZhbF9wb3dlcihvdGhlcjogYW55KTogYW55IHtcbiAgICAgICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgICB9XG5cbiAgICBhcmdzX2NuYyhjc2V0OiBib29sZWFuID0gZmFsc2UsIHdhcm46IGJvb2xlYW4gPSB0cnVlLCBzcGxpdF8xOiBib29sZWFuID0gdHJ1ZSkge1xuICAgICAgICBsZXQgYXJncztcbiAgICAgICAgaWYgKCh0aGlzLmNvbnN0cnVjdG9yIGFzIGFueSkuaXNfTXVsKSB7XG4gICAgICAgICAgICBhcmdzID0gdGhpcy5fYXJncztcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGFyZ3MgPSBbdGhpc107XG4gICAgICAgIH1cbiAgICAgICAgbGV0IGM7IGxldCBuYztcbiAgICAgICAgbGV0IGxvb3AyID0gdHJ1ZTtcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBhcmdzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBjb25zdCBtaSA9IGFyZ3NbaV07XG4gICAgICAgICAgICBpZiAoIShtaS5pc19jb21tdXRhdGl2ZSkpIHtcbiAgICAgICAgICAgICAgICBjID0gYXJncy5zbGljZSgwLCBpKTtcbiAgICAgICAgICAgICAgICBuYyA9IGFyZ3Muc2xpY2UoaSk7XG4gICAgICAgICAgICAgICAgbG9vcDIgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSBpZiAobG9vcDIpIHtcbiAgICAgICAgICAgIGMgPSBhcmdzO1xuICAgICAgICAgICAgbmMgPSBbXTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChjICYmIHNwbGl0XzEgJiZcbiAgICAgICAgICAgIGNbMF0uaXNfTnVtYmVyICYmXG4gICAgICAgICAgICBjWzBdLmlzX2V4dGVuZGVkX25lZ2F0aXZlICYmXG4gICAgICAgICAgICBjWzBdICE9PSBTLk5lZ2F0aXZlT25lKSB7XG4gICAgICAgICAgICBjLnNwbGljZSgwLCAxLCBTLk5lZ2F0aXZlT25lLCBjWzBdLl9fbXVsX18oUy5OZWdhdGl2ZU9uZSkpO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGNzZXQpIHtcbiAgICAgICAgICAgIGNvbnN0IGNsZW4gPSBjLmxlbmd0aDtcbiAgICAgICAgICAgIGNvbnN0IGNzZXQgPSBuZXcgSGFzaFNldCgpO1xuICAgICAgICAgICAgY3NldC5hZGRBcnIoYyk7XG4gICAgICAgICAgICBpZiAoY2xlbiAmJiB3YXJuICYmIGNzZXQuc2l6ZSAhPT0gY2xlbikge1xuICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcInJlcGVhdGVkIGNvbW11dGF0aXZlIGFyZ3NcIik7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIFtjLCBuY107XG4gICAgfVxufTtcblxuLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5ldy1jYXBcbmNvbnN0IF9FeHByID0gRXhwcihPYmplY3QpO1xuTWFuYWdlZFByb3BlcnRpZXMucmVnaXN0ZXIoX0V4cHIpO1xuXG5jb25zdCBBdG9taWNFeHByID0gKHN1cGVyY2xhc3M6IGFueSkgPT4gY2xhc3MgQXRvbWljRXhwciBleHRlbmRzIG1peChzdXBlcmNsYXNzKS53aXRoKEF0b20sIEV4cHIpIHtcbiAgICAvKlxuICAgIEEgcGFyZW50IGNsYXNzIGZvciBvYmplY3Qgd2hpY2ggYXJlIGJvdGggYXRvbXMgYW5kIEV4cHJzLlxuICAgIEZvciBleGFtcGxlOiBTeW1ib2wsIE51bWJlciwgUmF0aW9uYWwsIEludGVnZXIsIC4uLlxuICAgIEJ1dCBub3Q6IEFkZCwgTXVsLCBQb3csIC4uLlxuICAgICovXG4gICAgc3RhdGljIGlzX251bWJlciA9IGZhbHNlO1xuICAgIHN0YXRpYyBpc19BdG9tID0gdHJ1ZTtcblxuICAgIF9fc2xvdHNfXzogYW55W10gPSBbXTtcblxuICAgIGNvbnN0cnVjdG9yKC4uLmFyZ3M6IGFueSkge1xuICAgICAgICBzdXBlcihBdG9taWNFeHByLCBhcmdzKTtcbiAgICB9XG5cbiAgICBfZXZhbF9pc19wb2x5bm9taWFsKHN5bXM6IGFueSkge1xuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG5cbiAgICBfZXZhbF9pc19yYXRpb25hbF9mdW5jdGlvbihzeW1zOiBhbnkpIHtcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuXG4gICAgZXZhbF9pc19hbGdlYnJhaWNfZXhwcihzeW1zOiBhbnkpIHtcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuXG4gICAgX2V2YWxfbnNlcmllcyh4OiBhbnksIG46IGFueSwgbG9neDogYW55LCBjZG9yOiBhbnkgPSAwKSB7XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cbn07XG5cbi8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBuZXctY2FwXG5jb25zdCBfQXRvbWljRXhwciA9IEF0b21pY0V4cHIoT2JqZWN0KTtcbk1hbmFnZWRQcm9wZXJ0aWVzLnJlZ2lzdGVyKF9BdG9taWNFeHByKTtcblxuZXhwb3J0IHtBdG9taWNFeHByLCBfQXRvbWljRXhwciwgRXhwciwgX0V4cHJ9O1xuIiwgIi8qXG5Ob3RhYmxlIGNoYW5nZXMgbWFkZTpcbi0gRGljdGlvbmFyeSBzeXN0ZW0gcmV3b3JrZWQgYXMgY2xhc3MgcHJvcGVydGllc1xuKi9cblxuY2xhc3MgX2dsb2JhbF9wYXJhbWV0ZXJzIHtcbiAgICAvKlxuICAgIFRocmVhZC1sb2NhbCBnbG9iYWwgcGFyYW1ldGVycy5cbiAgICBFeHBsYW5hdGlvblxuICAgID09PT09PT09PT09XG4gICAgVGhpcyBjbGFzcyBnZW5lcmF0ZXMgdGhyZWFkLWxvY2FsIGNvbnRhaW5lciBmb3IgU3ltUHkncyBnbG9iYWwgcGFyYW1ldGVycy5cbiAgICBFdmVyeSBnbG9iYWwgcGFyYW1ldGVycyBtdXN0IGJlIHBhc3NlZCBhcyBrZXl3b3JkIGFyZ3VtZW50IHdoZW4gZ2VuZXJhdGluZ1xuICAgIGl0cyBpbnN0YW5jZS5cbiAgICBBIHZhcmlhYmxlLCBgZ2xvYmFsX3BhcmFtZXRlcnNgIGlzIHByb3ZpZGVkIGFzIGRlZmF1bHQgaW5zdGFuY2UgZm9yIHRoaXMgY2xhc3MuXG4gICAgV0FSTklORyEgQWx0aG91Z2ggdGhlIGdsb2JhbCBwYXJhbWV0ZXJzIGFyZSB0aHJlYWQtbG9jYWwsIFN5bVB5J3MgY2FjaGUgaXMgbm90XG4gICAgYnkgbm93LlxuICAgIFRoaXMgbWF5IGxlYWQgdG8gdW5kZXNpcmVkIHJlc3VsdCBpbiBtdWx0aS10aHJlYWRpbmcgb3BlcmF0aW9ucy5cbiAgICBFeGFtcGxlc1xuICAgID09PT09PT09XG4gICAgPj4+IGZyb20gc3ltcHkuYWJjIGltcG9ydCB4XG4gICAgPj4+IGZyb20gc3ltcHkuY29yZS5jYWNoZSBpbXBvcnQgY2xlYXJfY2FjaGVcbiAgICA+Pj4gZnJvbSBzeW1weS5jb3JlLnBhcmFtZXRlcnMgaW1wb3J0IGdsb2JhbF9wYXJhbWV0ZXJzIGFzIGdwXG4gICAgPj4+IGdwLmV2YWx1YXRlXG4gICAgVHJ1ZVxuICAgID4+PiB4K3hcbiAgICAyKnhcbiAgICA+Pj4gbG9nID0gW11cbiAgICA+Pj4gZGVmIGYoKTpcbiAgICAuLi4gICAgIGNsZWFyX2NhY2hlKClcbiAgICAuLi4gICAgIGdwLmV2YWx1YXRlID0gRmFsc2VcbiAgICAuLi4gICAgIGxvZy5hcHBlbmQoeCt4KVxuICAgIC4uLiAgICAgY2xlYXJfY2FjaGUoKVxuICAgID4+PiBpbXBvcnQgdGhyZWFkaW5nXG4gICAgPj4+IHRocmVhZCA9IHRocmVhZGluZy5UaHJlYWQodGFyZ2V0PWYpXG4gICAgPj4+IHRocmVhZC5zdGFydCgpXG4gICAgPj4+IHRocmVhZC5qb2luKClcbiAgICA+Pj4gcHJpbnQobG9nKVxuICAgIFt4ICsgeF1cbiAgICA+Pj4gZ3AuZXZhbHVhdGVcbiAgICBUcnVlXG4gICAgPj4+IHgreFxuICAgIDIqeFxuICAgIFJlZmVyZW5jZXNcbiAgICA9PT09PT09PT09XG4gICAgLi4gWzFdIGh0dHBzOi8vZG9jcy5weXRob24ub3JnLzMvbGlicmFyeS90aHJlYWRpbmcuaHRtbFxuICAgICovXG5cbiAgICBkaWN0OiBSZWNvcmQ8YW55LCBhbnk+ID0ge307XG5cbiAgICBldmFsdWF0ZTtcbiAgICBkaXN0cmlidXRlO1xuICAgIGV4cF9pc19wb3c7XG5cbiAgICBjb25zdHJ1Y3RvcihkaWN0OiBSZWNvcmQ8c3RyaW5nLCBhbnk+KSB7XG4gICAgICAgIHRoaXMuZGljdCA9IGRpY3Q7XG4gICAgICAgIHRoaXMuZXZhbHVhdGUgPSB0aGlzLmRpY3RbXCJldmFsdWF0ZVwiXTtcbiAgICAgICAgdGhpcy5kaXN0cmlidXRlID0gdGhpcy5kaWN0W1wiZGlzdHJpYnV0ZVwiXTtcbiAgICAgICAgdGhpcy5leHBfaXNfcG93ID0gdGhpcy5kaWN0W1wiZXhwX2lzX3Bvd1wiXTtcbiAgICB9XG59XG5cbmNvbnN0IGdsb2JhbF9wYXJhbWV0ZXJzID0gbmV3IF9nbG9iYWxfcGFyYW1ldGVycyh7XCJldmFsdWF0ZVwiOiB0cnVlLCBcImRpc3RyaWJ1dGVcIjogdHJ1ZSwgXCJleHBfaXNfcG93XCI6IGZhbHNlfSk7XG5cbmV4cG9ydCB7Z2xvYmFsX3BhcmFtZXRlcnN9O1xuIiwgIi8qXG5Ob3RhYmxlIGNoYW5nZXMgbWFkZSBhbmQgbm90ZXM6XG4tIE9yZGVyLXN5bWJvbHMgYW5kIHJlbGF0ZWQgY29tcG9uZW50ZWQgbm90IHlldCBpbXBsZW1lbnRlZFxuLSBNb3N0IG1ldGhvZHMgbm90IHlldCBpbXBsZW1lbnRlZCAoYnV0IGVub3VnaCB0byBldmFsdWF0ZSBhZGQgaW4gdGhlb3J5KVxuLSBTaW1wbGlmeSBhcmd1bWVudCBhZGRlZCB0byBjb25zdHJ1Y3RvciB0byBwcmV2ZW50IGluZmluaXRlIHJlY3Vyc2lvblxuKi9cblxuaW1wb3J0IHtfQmFzaWN9IGZyb20gXCIuL2Jhc2ljXCI7XG5pbXBvcnQge21peH0gZnJvbSBcIi4vdXRpbGl0eVwiO1xuaW1wb3J0IHtnbG9iYWxfcGFyYW1ldGVyc30gZnJvbSBcIi4vcGFyYW1ldGVyc1wiO1xuaW1wb3J0IHtmdXp6eV9hbmRfdjJ9IGZyb20gXCIuL2xvZ2ljXCI7XG5pbXBvcnQge01hbmFnZWRQcm9wZXJ0aWVzfSBmcm9tIFwiLi9hc3N1bXB0aW9uc1wiO1xuaW1wb3J0IHtTfSBmcm9tIFwiLi9zaW5nbGV0b25cIjtcblxuXG5jb25zdCBBc3NvY09wID0gKHN1cGVyY2xhc3M6IGFueSkgPT4gY2xhc3MgQXNzb2NPcCBleHRlbmRzIG1peChzdXBlcmNsYXNzKS53aXRoKF9CYXNpYykge1xuICAgIC8qIEFzc29jaWF0aXZlIG9wZXJhdGlvbnMsIGNhbiBzZXBhcmF0ZSBub25jb21tdXRhdGl2ZSBhbmRcbiAgICBjb21tdXRhdGl2ZSBwYXJ0cy5cbiAgICAoYSBvcCBiKSBvcCBjID09IGEgb3AgKGIgb3AgYykgPT0gYSBvcCBiIG9wIGMuXG4gICAgQmFzZSBjbGFzcyBmb3IgQWRkIGFuZCBNdWwuXG4gICAgVGhpcyBpcyBhbiBhYnN0cmFjdCBiYXNlIGNsYXNzLCBjb25jcmV0ZSBkZXJpdmVkIGNsYXNzZXMgbXVzdCBkZWZpbmVcbiAgICB0aGUgYXR0cmlidXRlIGBpZGVudGl0eWAuXG4gICAgLi4gZGVwcmVjYXRlZDo6IDEuN1xuICAgICAgIFVzaW5nIGFyZ3VtZW50cyB0aGF0IGFyZW4ndCBzdWJjbGFzc2VzIG9mIDpjbGFzczpgfi5FeHByYCBpbiBjb3JlXG4gICAgICAgb3BlcmF0b3JzICg6Y2xhc3M6YH4uTXVsYCwgOmNsYXNzOmB+LkFkZGAsIGFuZCA6Y2xhc3M6YH4uUG93YCkgaXNcbiAgICAgICBkZXByZWNhdGVkLiBTZWUgOnJlZjpgbm9uLWV4cHItYXJncy1kZXByZWNhdGVkYCBmb3IgZGV0YWlscy5cbiAgICBQYXJhbWV0ZXJzXG4gICAgPT09PT09PT09PVxuICAgICphcmdzIDpcdTAxOTJcbiAgICAgICAgQXJndW1lbnRzIHdoaWNoIGFyZSBvcGVyYXRlZFxuICAgIGV2YWx1YXRlIDogYm9vbCwgb3B0aW9uYWxcbiAgICAgICAgRXZhbHVhdGUgdGhlIG9wZXJhdGlvbi4gSWYgbm90IHBhc3NlZCwgcmVmZXIgdG8gYGBnbG9iYWxfcGFyYW1ldGVycy5ldmFsdWF0ZWBgLlxuICAgICovXG5cbiAgICAvLyBmb3IgcGVyZm9ybWFuY2UgcmVhc29uLCB3ZSBkb24ndCBsZXQgaXNfY29tbXV0YXRpdmUgZ28gdG8gYXNzdW1wdGlvbnMsXG4gICAgLy8gYW5kIGtlZXAgaXQgcmlnaHQgaGVyZVxuXG4gICAgX19zbG90c19fOiBhbnlbXSA9IFtcImlzX2NvbW11dGF0aXZlXCJdO1xuICAgIHN0YXRpYyBfYXJnc190eXBlOiBhbnkgPSB1bmRlZmluZWQ7XG5cbiAgICBjb25zdHJ1Y3RvcihjbHM6IGFueSwgZXZhbHVhdGU6IGFueSwgc2ltcGxpZnk6IGJvb2xlYW4sIC4uLmFyZ3M6IGFueSkge1xuICAgICAgICAvLyBpZGVudGl0eSB3YXNuJ3Qgd29ya2luZyBmb3Igc29tZSByZWFzb24sIHNvIGhlcmUgaXMgYSBiYW5kYWlkIGZpeFxuICAgICAgICBpZiAoY2xzLm5hbWUgPT09IFwiTXVsXCIpIHtcbiAgICAgICAgICAgIGNscy5pZGVudGl0eSA9IFMuT25lO1xuICAgICAgICB9IGVsc2UgaWYgKGNscy5uYW1lID09PSBcIkFkZFwiKSB7XG4gICAgICAgICAgICBjbHMuaWRlbnRpdHkgPSBTLlplcm87XG4gICAgICAgIH1cbiAgICAgICAgc3VwZXIoLi4uYXJncyk7XG4gICAgICAgIGlmIChzaW1wbGlmeSkge1xuICAgICAgICAgICAgaWYgKHR5cGVvZiBldmFsdWF0ZSA9PT0gXCJ1bmRlZmluZWRcIikge1xuICAgICAgICAgICAgICAgIGV2YWx1YXRlID0gZ2xvYmFsX3BhcmFtZXRlcnMuZXZhbHVhdGU7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKGV2YWx1YXRlID09PSBmYWxzZSkge1xuICAgICAgICAgICAgICAgIGxldCBvYmogPSB0aGlzLl9mcm9tX2FyZ3MoY2xzLCB1bmRlZmluZWQsIC4uLmFyZ3MpO1xuICAgICAgICAgICAgICAgIG9iaiA9IHRoaXMuX2V4ZWNfY29uc3RydWN0b3JfcG9zdHByb2Nlc3NvcnMob2JqKTtcbiAgICAgICAgICAgICAgICByZXR1cm4gb2JqO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgY29uc3QgYXJnc1RlbXA6IGFueVtdID0gW107XG4gICAgICAgICAgICBmb3IgKGNvbnN0IGEgb2YgYXJncykge1xuICAgICAgICAgICAgICAgIGlmIChhICE9PSBjbHMuaWRlbnRpdHkpIHtcbiAgICAgICAgICAgICAgICAgICAgYXJnc1RlbXAucHVzaChhKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBhcmdzID0gYXJnc1RlbXA7XG4gICAgICAgICAgICBpZiAoYXJncy5sZW5ndGggPT09IDApIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gY2xzLmlkZW50aXR5O1xuICAgICAgICAgICAgfSBlbHNlIGlmIChhcmdzLmxlbmd0aCA9PT0gMSkge1xuICAgICAgICAgICAgICAgIHJldHVybiBhcmdzWzBdO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5vLXVudXNlZC12YXJzXG4gICAgICAgICAgICBjb25zdCBbY19wYXJ0LCBuY19wYXJ0LCBvcmRlcl9zeW1ib2xzXSA9IHRoaXMuZmxhdHRlbihhcmdzKTtcbiAgICAgICAgICAgIGNvbnN0IGlzX2NvbW11dGF0aXZlOiBib29sZWFuID0gbmNfcGFydC5sZW5ndGggPT09IDA7XG4gICAgICAgICAgICBsZXQgb2JqOiBhbnkgPSB0aGlzLl9mcm9tX2FyZ3MoY2xzLCBpc19jb21tdXRhdGl2ZSwgLi4uY19wYXJ0LmNvbmNhdChuY19wYXJ0KSk7XG4gICAgICAgICAgICBvYmogPSB0aGlzLl9leGVjX2NvbnN0cnVjdG9yX3Bvc3Rwcm9jZXNzb3JzKG9iaik7XG4gICAgICAgICAgICAvLyAhISEgb3JkZXIgc3ltYm9scyBub3QgeWV0IGltcGxlbWVudGVkXG4gICAgICAgICAgICByZXR1cm4gb2JqO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgX2Zyb21fYXJncyhjbHM6IGFueSwgaXNfY29tbXV0YXRpdmU6IGFueSwgLi4uYXJnczogYW55KSB7XG4gICAgICAgIC8qIFwiQ3JlYXRlIG5ldyBpbnN0YW5jZSB3aXRoIGFscmVhZHktcHJvY2Vzc2VkIGFyZ3MuXG4gICAgICAgIElmIHRoZSBhcmdzIGFyZSBub3QgaW4gY2Fub25pY2FsIG9yZGVyLCB0aGVuIGEgbm9uLWNhbm9uaWNhbFxuICAgICAgICByZXN1bHQgd2lsbCBiZSByZXR1cm5lZCwgc28gdXNlIHdpdGggY2F1dGlvbi4gVGhlIG9yZGVyIG9mXG4gICAgICAgIGFyZ3MgbWF5IGNoYW5nZSBpZiB0aGUgc2lnbiBvZiB0aGUgYXJncyBpcyBjaGFuZ2VkLiAqL1xuICAgICAgICBpZiAoYXJncy5sZW5ndGggPT09IDApIHtcbiAgICAgICAgICAgIHJldHVybiBjbHMuaWRlbnRpdHk7XG4gICAgICAgIH0gZWxzZSBpZiAoYXJncy5sZW5ndGggPT09IDEpIHtcbiAgICAgICAgICAgIHJldHVybiBhcmdzWzBdO1xuICAgICAgICB9XG4gICAgICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBuZXctY2FwXG4gICAgICAgIGNvbnN0IG9iajogYW55ID0gbmV3IGNscyh0cnVlLCBmYWxzZSwgLi4uYXJncyk7XG4gICAgICAgIGlmICh0eXBlb2YgaXNfY29tbXV0YXRpdmUgPT09IFwidW5kZWZpbmVkXCIpIHtcbiAgICAgICAgICAgIGNvbnN0IGlucHV0OiBhbnlbXSA9IFtdO1xuICAgICAgICAgICAgZm9yIChjb25zdCBhIG9mIGFyZ3MpIHtcbiAgICAgICAgICAgICAgICBpbnB1dC5wdXNoKGEuaXNfY29tbXV0YXRpdmUoKSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpc19jb21tdXRhdGl2ZSA9IGZ1enp5X2FuZF92MihpbnB1dCk7XG4gICAgICAgIH1cbiAgICAgICAgb2JqLmlzX2NvbW11dGF0aXZlID0gKCkgPT4gaXNfY29tbXV0YXRpdmU7XG4gICAgICAgIHJldHVybiBvYmo7XG4gICAgfVxuXG4gICAgX25ld19yYXdhcmdzKHJlZXZhbDogYm9vbGVhbiwgLi4uYXJnczogYW55KSB7XG4gICAgICAgIGxldCBpc19jb21tdXRhdGl2ZTtcbiAgICAgICAgaWYgKHJlZXZhbCAmJiB0aGlzLmlzX2NvbW11dGF0aXZlID09PSBmYWxzZSkge1xuICAgICAgICAgICAgaXNfY29tbXV0YXRpdmUgPSB1bmRlZmluZWQ7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBpc19jb21tdXRhdGl2ZSA9IHRoaXMuaXNfY29tbXV0YXRpdmU7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRoaXMuX2Zyb21fYXJncyh0aGlzLmNvbnN0cnVjdG9yLCBpc19jb21tdXRhdGl2ZSwgLi4uYXJncyk7XG4gICAgfVxuXG4gICAgbWFrZV9hcmdzKGNsczogYW55LCBleHByOiBhbnkpIHtcbiAgICAgICAgaWYgKGV4cHIgaW5zdGFuY2VvZiBjbHMpIHtcbiAgICAgICAgICAgIHJldHVybiBleHByLl9hcmdzO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuIFtleHByXTtcbiAgICAgICAgfVxuICAgIH1cbn07XG5cbi8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBuZXctY2FwXG5NYW5hZ2VkUHJvcGVydGllcy5yZWdpc3RlcihBc3NvY09wKE9iamVjdCkpO1xuXG5leHBvcnQge0Fzc29jT3B9O1xuIiwgIlxuaW1wb3J0IHtNYW5hZ2VkUHJvcGVydGllc30gZnJvbSBcIi4vYXNzdW1wdGlvbnNcIjtcbmltcG9ydCB7X0V4cHJ9IGZyb20gXCIuL2V4cHJcIjtcbmltcG9ydCB7R2xvYmFsfSBmcm9tIFwiLi9nbG9iYWxcIjtcbmltcG9ydCB7X051bWJlcl99IGZyb20gXCIuL251bWJlcnNcIjtcbmltcG9ydCB7Z2xvYmFsX3BhcmFtZXRlcnN9IGZyb20gXCIuL3BhcmFtZXRlcnNcIjtcbmltcG9ydCB7U30gZnJvbSBcIi4vc2luZ2xldG9uXCI7XG5cbmV4cG9ydCBjbGFzcyBQb3cgZXh0ZW5kcyBfRXhwciB7XG4gICAgLypcbiAgICBEZWZpbmVzIHRoZSBleHByZXNzaW9uIHgqKnkgYXMgXCJ4IHJhaXNlZCB0byBhIHBvd2VyIHlcIlxuICAgIC4uIGRlcHJlY2F0ZWQ6OiAxLjdcbiAgICAgICBVc2luZyBhcmd1bWVudHMgdGhhdCBhcmVuJ3Qgc3ViY2xhc3NlcyBvZiA6Y2xhc3M6YH4uRXhwcmAgaW4gY29yZVxuICAgICAgIG9wZXJhdG9ycyAoOmNsYXNzOmB+Lk11bGAsIDpjbGFzczpgfi5BZGRgLCBhbmQgOmNsYXNzOmB+LlBvd2ApIGlzXG4gICAgICAgZGVwcmVjYXRlZC4gU2VlIDpyZWY6YG5vbi1leHByLWFyZ3MtZGVwcmVjYXRlZGAgZm9yIGRldGFpbHMuXG4gICAgU2luZ2xldG9uIGRlZmluaXRpb25zIGludm9sdmluZyAoMCwgMSwgLTEsIG9vLCAtb28sIEksIC1JKTpcbiAgICArLS0tLS0tLS0tLS0tLS0rLS0tLS0tLS0tKy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tK1xuICAgIHwgZXhwciAgICAgICAgIHwgdmFsdWUgICB8IHJlYXNvbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB8XG4gICAgKz09PT09PT09PT09PT09Kz09PT09PT09PSs9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PStcbiAgICB8IHoqKjAgICAgICAgICB8IDEgICAgICAgfCBBbHRob3VnaCBhcmd1bWVudHMgb3ZlciAwKiowIGV4aXN0LCBzZWUgWzJdLiAgfFxuICAgICstLS0tLS0tLS0tLS0tLSstLS0tLS0tLS0rLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0rXG4gICAgfCB6KioxICAgICAgICAgfCB6ICAgICAgIHwgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHxcbiAgICArLS0tLS0tLS0tLS0tLS0rLS0tLS0tLS0tKy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tK1xuICAgIHwgKC1vbykqKigtMSkgIHwgMCAgICAgICB8ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB8XG4gICAgKy0tLS0tLS0tLS0tLS0tKy0tLS0tLS0tLSstLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLStcbiAgICB8ICgtMSkqKi0xICAgICB8IC0xICAgICAgfCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfFxuICAgICstLS0tLS0tLS0tLS0tLSstLS0tLS0tLS0rLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0rXG4gICAgfCBTLlplcm8qKi0xICAgfCB6b28gICAgIHwgVGhpcyBpcyBub3Qgc3RyaWN0bHkgdHJ1ZSwgYXMgMCoqLTEgbWF5IGJlICAgIHxcbiAgICB8ICAgICAgICAgICAgICB8ICAgICAgICAgfCB1bmRlZmluZWQsIGJ1dCBpcyBjb252ZW5pZW50IGluIHNvbWUgY29udGV4dHMgfFxuICAgIHwgICAgICAgICAgICAgIHwgICAgICAgICB8IHdoZXJlIHRoZSBiYXNlIGlzIGFzc3VtZWQgdG8gYmUgcG9zaXRpdmUuICAgICB8XG4gICAgKy0tLS0tLS0tLS0tLS0tKy0tLS0tLS0tLSstLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLStcbiAgICB8IDEqKi0xICAgICAgICB8IDEgICAgICAgfCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfFxuICAgICstLS0tLS0tLS0tLS0tLSstLS0tLS0tLS0rLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0rXG4gICAgfCBvbyoqLTEgICAgICAgfCAwICAgICAgIHwgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHxcbiAgICArLS0tLS0tLS0tLS0tLS0rLS0tLS0tLS0tKy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tK1xuICAgIHwgMCoqb28gICAgICAgIHwgMCAgICAgICB8IEJlY2F1c2UgZm9yIGFsbCBjb21wbGV4IG51bWJlcnMgeiBuZWFyICAgICAgICB8XG4gICAgfCAgICAgICAgICAgICAgfCAgICAgICAgIHwgMCwgeioqb28gLT4gMC4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHxcbiAgICArLS0tLS0tLS0tLS0tLS0rLS0tLS0tLS0tKy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tK1xuICAgIHwgMCoqLW9vICAgICAgIHwgem9vICAgICB8IFRoaXMgaXMgbm90IHN0cmljdGx5IHRydWUsIGFzIDAqKm9vIG1heSBiZSAgICB8XG4gICAgfCAgICAgICAgICAgICAgfCAgICAgICAgIHwgb3NjaWxsYXRpbmcgYmV0d2VlbiBwb3NpdGl2ZSBhbmQgbmVnYXRpdmUgICAgIHxcbiAgICB8ICAgICAgICAgICAgICB8ICAgICAgICAgfCB2YWx1ZXMgb3Igcm90YXRpbmcgaW4gdGhlIGNvbXBsZXggcGxhbmUuICAgICAgfFxuICAgIHwgICAgICAgICAgICAgIHwgICAgICAgICB8IEl0IGlzIGNvbnZlbmllbnQsIGhvd2V2ZXIsIHdoZW4gdGhlIGJhc2UgICAgICB8XG4gICAgfCAgICAgICAgICAgICAgfCAgICAgICAgIHwgaXMgcG9zaXRpdmUuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHxcbiAgICArLS0tLS0tLS0tLS0tLS0rLS0tLS0tLS0tKy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tK1xuICAgIHwgMSoqb28gICAgICAgIHwgbmFuICAgICB8IEJlY2F1c2UgdGhlcmUgYXJlIHZhcmlvdXMgY2FzZXMgd2hlcmUgICAgICAgICB8XG4gICAgfCAxKiotb28gICAgICAgfCAgICAgICAgIHwgbGltKHgodCksdCk9MSwgbGltKHkodCksdCk9b28gKG9yIC1vbyksICAgICAgIHxcbiAgICB8ICAgICAgICAgICAgICB8ICAgICAgICAgfCBidXQgbGltKCB4KHQpKip5KHQpLCB0KSAhPSAxLiAgU2VlIFszXS4gICAgICAgfFxuICAgICstLS0tLS0tLS0tLS0tLSstLS0tLS0tLS0rLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0rXG4gICAgfCBiKip6b28gICAgICAgfCBuYW4gICAgIHwgQmVjYXVzZSBiKip6IGhhcyBubyBsaW1pdCBhcyB6IC0+IHpvbyAgICAgICAgIHxcbiAgICArLS0tLS0tLS0tLS0tLS0rLS0tLS0tLS0tKy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tK1xuICAgIHwgKC0xKSoqb28gICAgIHwgbmFuICAgICB8IEJlY2F1c2Ugb2Ygb3NjaWxsYXRpb25zIGluIHRoZSBsaW1pdC4gICAgICAgICB8XG4gICAgfCAoLTEpKiooLW9vKSAgfCAgICAgICAgIHwgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHxcbiAgICArLS0tLS0tLS0tLS0tLS0rLS0tLS0tLS0tKy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tK1xuICAgIHwgb28qKm9vICAgICAgIHwgb28gICAgICB8ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB8XG4gICAgKy0tLS0tLS0tLS0tLS0tKy0tLS0tLS0tLSstLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLStcbiAgICB8IG9vKiotb28gICAgICB8IDAgICAgICAgfCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfFxuICAgICstLS0tLS0tLS0tLS0tLSstLS0tLS0tLS0rLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0rXG4gICAgfCAoLW9vKSoqb28gICAgfCBuYW4gICAgIHwgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHxcbiAgICB8ICgtb28pKiotb28gICB8ICAgICAgICAgfCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfFxuICAgICstLS0tLS0tLS0tLS0tLSstLS0tLS0tLS0rLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0rXG4gICAgfCBvbyoqSSAgICAgICAgfCBuYW4gICAgIHwgb28qKmUgY291bGQgcHJvYmFibHkgYmUgYmVzdCB0aG91Z2h0IG9mIGFzICAgIHxcbiAgICB8ICgtb28pKipJICAgICB8ICAgICAgICAgfCB0aGUgbGltaXQgb2YgeCoqZSBmb3IgcmVhbCB4IGFzIHggdGVuZHMgdG8gICAgfFxuICAgIHwgICAgICAgICAgICAgIHwgICAgICAgICB8IG9vLiBJZiBlIGlzIEksIHRoZW4gdGhlIGxpbWl0IGRvZXMgbm90IGV4aXN0ICB8XG4gICAgfCAgICAgICAgICAgICAgfCAgICAgICAgIHwgYW5kIG5hbiBpcyB1c2VkIHRvIGluZGljYXRlIHRoYXQuICAgICAgICAgICAgIHxcbiAgICArLS0tLS0tLS0tLS0tLS0rLS0tLS0tLS0tKy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tK1xuICAgIHwgb28qKigxK0kpICAgIHwgem9vICAgICB8IElmIHRoZSByZWFsIHBhcnQgb2YgZSBpcyBwb3NpdGl2ZSwgdGhlbiB0aGUgICB8XG4gICAgfCAoLW9vKSoqKDErSSkgfCAgICAgICAgIHwgbGltaXQgb2YgYWJzKHgqKmUpIGlzIG9vLiBTbyB0aGUgbGltaXQgdmFsdWUgIHxcbiAgICB8ICAgICAgICAgICAgICB8ICAgICAgICAgfCBpcyB6b28uICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfFxuICAgICstLS0tLS0tLS0tLS0tLSstLS0tLS0tLS0rLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0rXG4gICAgfCBvbyoqKC0xK0kpICAgfCAwICAgICAgIHwgSWYgdGhlIHJlYWwgcGFydCBvZiBlIGlzIG5lZ2F0aXZlLCB0aGVuIHRoZSAgIHxcbiAgICB8IC1vbyoqKC0xK0kpICB8ICAgICAgICAgfCBsaW1pdCBpcyAwLiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfFxuICAgICstLS0tLS0tLS0tLS0tLSstLS0tLS0tLS0rLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0rXG4gICAgQmVjYXVzZSBzeW1ib2xpYyBjb21wdXRhdGlvbnMgYXJlIG1vcmUgZmxleGlibGUgdGhhbiBmbG9hdGluZyBwb2ludFxuICAgIGNhbGN1bGF0aW9ucyBhbmQgd2UgcHJlZmVyIHRvIG5ldmVyIHJldHVybiBhbiBpbmNvcnJlY3QgYW5zd2VyLFxuICAgIHdlIGNob29zZSBub3QgdG8gY29uZm9ybSB0byBhbGwgSUVFRSA3NTQgY29udmVudGlvbnMuICBUaGlzIGhlbHBzXG4gICAgdXMgYXZvaWQgZXh0cmEgdGVzdC1jYXNlIGNvZGUgaW4gdGhlIGNhbGN1bGF0aW9uIG9mIGxpbWl0cy5cbiAgICBTZWUgQWxzb1xuICAgID09PT09PT09XG4gICAgc3ltcHkuY29yZS5udW1iZXJzLkluZmluaXR5XG4gICAgc3ltcHkuY29yZS5udW1iZXJzLk5lZ2F0aXZlSW5maW5pdHlcbiAgICBzeW1weS5jb3JlLm51bWJlcnMuTmFOXG4gICAgUmVmZXJlbmNlc1xuICAgID09PT09PT09PT1cbiAgICAuLiBbMV0gaHR0cHM6Ly9lbi53aWtpcGVkaWEub3JnL3dpa2kvRXhwb25lbnRpYXRpb25cbiAgICAuLiBbMl0gaHR0cHM6Ly9lbi53aWtpcGVkaWEub3JnL3dpa2kvRXhwb25lbnRpYXRpb24jWmVyb190b190aGVfcG93ZXJfb2ZfemVyb1xuICAgIC4uIFszXSBodHRwczovL2VuLndpa2lwZWRpYS5vcmcvd2lraS9JbmRldGVybWluYXRlX2Zvcm1zXG4gICAgKi9cbiAgICBzdGF0aWMgaXNfUG93ID0gdHJ1ZTtcbiAgICBfX3Nsb3RzX18gPSBbXCJpc19jb21tdXRhdGl2ZVwiXTtcblxuICAgIC8vIHRvLWRvOiBuZWVkcyBzdXBwb3J0IGZvciBlXnhcbiAgICBjb25zdHJ1Y3RvcihiOiBhbnksIGU6IGFueSwgZXZhbHVhdGU6IGJvb2xlYW4gPSB1bmRlZmluZWQsIHNpbXBsaWZ5OiBib29sZWFuID0gdHJ1ZSkge1xuICAgICAgICBzdXBlcihiLCBlKTtcbiAgICAgICAgdGhpcy5fYXJncyA9IFtiLCBlXTtcbiAgICAgICAgaWYgKHR5cGVvZiBldmFsdWF0ZSA9PT0gXCJ1bmRlZmluZWRcIikge1xuICAgICAgICAgICAgZXZhbHVhdGUgPSBnbG9iYWxfcGFyYW1ldGVycy5ldmFsdWF0ZTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoc2ltcGxpZnkpIHtcbiAgICAgICAgICAgIGlmIChldmFsdWF0ZSkge1xuICAgICAgICAgICAgICAgIGlmIChlID09PSBTLkNvbXBsZXhJbmZpbml0eSkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gUy5OYU47XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGlmIChlID09PSBTLkluZmluaXR5KSB7XG4gICAgICAgICAgICAgICAgICAgIC8vIHRoaXMgcGFydCBpcyBub3QgZnVsbHkgZG9uZVxuICAgICAgICAgICAgICAgICAgICAvLyBzaG91bGQgYmUgdXBkYXRlZCB0byB1c2UgcmVsYXRpb25hbFxuICAgICAgICAgICAgICAgICAgICBpZiAoYi5pc19wb3NpdGl2ZSgpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gUy5JbmZpbml0eTtcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIGlmIChiLmlzX3plcm8oKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFMuWmVybztcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChiLmlzX2Zpbml0ZSgpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFMuQ29tcGxleEluZmluaXR5O1xuICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gUy5OYU47XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgaWYgKGUgPT09IFMuWmVybykge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gUy5PbmU7XG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmIChlID09PSBTLk9uZSkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gYjtcbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKGUgPT09IFMuTmVnYXRpdmVPbmUgJiYgIWIpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFMuQ29tcGxleEluZmluaXR5O1xuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoKGUuaXNfU3ltYm9sKCkgJiYgZS5pc19pbnRlZ2VyKCkgfHxcbiAgICAgICAgICAgICAgICAgICAgZS5pc19JbnRlZ2VyKCkgJiYgKGIuaXNfTnVtYmVyKCkgJiZcbiAgICAgICAgICAgICAgICAgICAgYi5pc19NdWwoKSB8fCBiLmlzX051bWJlcigpKSkgJiYgKGUuaXNfZXh0ZW5kZWRfbmVnYXRpdmUgPT09IHRydWUpKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChlLmlzX2V2ZW4oKSB8fCBlLmlzX2V2ZW4oKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgYiA9IGIuX19tdWxfXyhTLk5lZ2F0aXZlT25lKTtcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBuZXcgUG93KGIuX19tdWxfXyhTLk5lZ2F0aXZlT25lKSwgZSkuX19tdWxfXyhTLk5lZ2F0aXZlT25lKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAwLlxuICAgICAgICAgICAgICAgIGlmIChiID09PSBTLk5hTiB8fCBlID09PSBTLk5hTikge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gUy5OYU47XG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmIChiID09PSBTLk9uZSkge1xuICAgICAgICAgICAgICAgICAgICBpZiAoZS5pc19pbmZpbml0ZSgpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gUy5OYU47XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFMuT25lO1xuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoZS5pc19OdW1iZXIoKSAmJiBiLmlzX051bWJlcigpKSB7XG4gICAgICAgICAgICAgICAgICAgIC8vIGJhc2UgRSBzdHVmZiBub3QgeWV0IGltcGxlbWVudGVkXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IG9iaiA9IGIuX2V2YWxfcG93ZXIoZSk7XG4gICAgICAgICAgICAgICAgICAgIGlmICh0eXBlb2Ygb2JqICE9PSBcInVuZGVmaW5lZFwiKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBvYmouaXNfY29tbXV0YXRpdmUgPSAoKSA9PiAoYi5pc19jb21tdXRhdGl2ZSgpICYmIGUuaXNfY29tbXV0YXRpdmUoKSk7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gb2JqO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHRoaXMuaXNfY29tbXV0YXRpdmUgPSAoKSA9PiAoYi5pc19jb21tdXRhdGl2ZSgpICYmIGUuaXNfY29tbXV0YXRpdmUoKSk7XG4gICAgfVxuXG4gICAgYXNfYmFzZV9leHAoKSB7XG4gICAgICAgIGNvbnN0IGIgPSB0aGlzLl9hcmdzWzBdO1xuICAgICAgICBjb25zdCBlID0gdGhpcy5fYXJnc1sxXTtcbiAgICAgICAgaWYgKGIuaXNfUmF0aW9uYWwgJiYgYi5wID09PSAxICYmIGIucSAhPT0gMSkge1xuICAgICAgICAgICAgY29uc3QgcDEgPSBfTnVtYmVyXy5uZXcoYi5xKTtcbiAgICAgICAgICAgIGNvbnN0IHAyID0gZS5fX211bF9fKFMuTmVnYXRpdmVPbmUpO1xuICAgICAgICAgICAgcmV0dXJuIFtwMSwgcDJdO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBbYiwgZV07XG4gICAgfVxuXG4gICAgc3RhdGljIF9uZXcoYjogYW55LCBlOiBhbnkpIHtcbiAgICAgICAgcmV0dXJuIG5ldyBQb3coYiwgZSk7XG4gICAgfVxuXG4gICAgLy8gV0IgYWRkaXRpb24gZm9yIGphc21pbmUgdGVzdHNcbiAgICB0b1N0cmluZygpIHtcbiAgICAgICAgY29uc3QgYiA9IHRoaXMuX2FyZ3NbMF0udG9TdHJpbmcoKTtcbiAgICAgICAgY29uc3QgZSA9IHRoaXMuX2FyZ3NbMV0udG9TdHJpbmcoKTtcbiAgICAgICAgcmV0dXJuIGIgKyBcIl5cIiArIGU7XG4gICAgfVxufVxuXG5NYW5hZ2VkUHJvcGVydGllcy5yZWdpc3RlcihQb3cpO1xuR2xvYmFsLnJlZ2lzdGVyKFwiUG93XCIsIFBvdy5fbmV3KTtcblxuLy8gaW1wbGVtZW50ZWQgZGlmZmVyZW50IHRoYW4gc3ltcHksIGJ1dCBoYXMgc2FtZSBmdW5jdGlvbmFsaXR5IChmb3Igbm93KVxuZXhwb3J0IGZ1bmN0aW9uIG5yb290KHk6IG51bWJlciwgbjogbnVtYmVyKSB7XG4gICAgY29uc3QgeCA9IE1hdGguZmxvb3IoeSAqKiAoMSAvIG4pKTtcbiAgICByZXR1cm4gW3gsIHgqKm4gPT09IHldO1xufVxuIiwgImltcG9ydCB7ZGl2bW9kfSBmcm9tIFwiLi4vbnRoZW9yeS9mYWN0b3JfXCI7XG5pbXBvcnQge0FkZH0gZnJvbSBcIi4vYWRkXCI7XG5pbXBvcnQge01hbmFnZWRQcm9wZXJ0aWVzfSBmcm9tIFwiLi9hc3N1bXB0aW9uc1wiO1xuaW1wb3J0IHtCYXNpY30gZnJvbSBcIi4vYmFzaWNcIjtcbmltcG9ydCB7RXhwcn0gZnJvbSBcIi4vZXhwclwiO1xuaW1wb3J0IHtHbG9iYWx9IGZyb20gXCIuL2dsb2JhbFwiO1xuaW1wb3J0IHtmdXp6eV9ub3R2MiwgX2Z1enp5X2dyb3VwdjJ9IGZyb20gXCIuL2xvZ2ljXCI7XG5pbXBvcnQge0ludGVnZXIsIFJhdGlvbmFsfSBmcm9tIFwiLi9udW1iZXJzXCI7XG5pbXBvcnQge0Fzc29jT3B9IGZyb20gXCIuL29wZXJhdGlvbnNcIjtcbmltcG9ydCB7Z2xvYmFsX3BhcmFtZXRlcnN9IGZyb20gXCIuL3BhcmFtZXRlcnNcIjtcbmltcG9ydCB7UG93fSBmcm9tIFwiLi9wb3dlclwiO1xuaW1wb3J0IHtTfSBmcm9tIFwiLi9zaW5nbGV0b25cIjtcbmltcG9ydCB7bWl4LCBiYXNlLCBIYXNoRGljdCwgSGFzaFNldCwgQXJyRGVmYXVsdERpY3R9IGZyb20gXCIuL3V0aWxpdHlcIjtcblxuLy8gIyBpbnRlcm5hbCBtYXJrZXIgdG8gaW5kaWNhdGU6XG4vLyBcInRoZXJlIGFyZSBzdGlsbCBub24tY29tbXV0YXRpdmUgb2JqZWN0cyAtLSBkb24ndCBmb3JnZXQgdG8gcHJvY2VzcyB0aGVtXCJcblxuLy8gbm90IGN1cnJlbnRseSBiZWluZyB1c2VkXG5jbGFzcyBOQ19NYXJrZXIge1xuICAgIGlzX09yZGVyID0gZmFsc2U7XG4gICAgaXNfTXVsID0gZmFsc2U7XG4gICAgaXNfTnVtYmVyID0gZmFsc2U7XG4gICAgaXNfUG9seSA9IGZhbHNlO1xuXG4gICAgaXNfY29tbXV0YXRpdmUgPSBmYWxzZTtcbn1cblxuZnVuY3Rpb24gX211bHNvcnQoYXJnczogYW55W10pIHtcbiAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbmV3LWNhcFxuICAgIGFyZ3Muc29ydCgoYSwgYikgPT4gQmFzaWMuY21wKGEsIGIpKTtcbn1cblxuZXhwb3J0IGNsYXNzIE11bCBleHRlbmRzIG1peChiYXNlKS53aXRoKEV4cHIsIEFzc29jT3ApIHtcbiAgICAvKlxuICAgIEV4cHJlc3Npb24gcmVwcmVzZW50aW5nIG11bHRpcGxpY2F0aW9uIG9wZXJhdGlvbiBmb3IgYWxnZWJyYWljIGZpZWxkLlxuICAgIC4uIGRlcHJlY2F0ZWQ6OiAxLjdcbiAgICAgICBVc2luZyBhcmd1bWVudHMgdGhhdCBhcmVuJ3Qgc3ViY2xhc3NlcyBvZiA6Y2xhc3M6YH4uRXhwcmAgaW4gY29yZVxuICAgICAgIG9wZXJhdG9ycyAoOmNsYXNzOmB+Lk11bGAsIDpjbGFzczpgfi5BZGRgLCBhbmQgOmNsYXNzOmB+LlBvd2ApIGlzXG4gICAgICAgZGVwcmVjYXRlZC4gU2VlIDpyZWY6YG5vbi1leHByLWFyZ3MtZGVwcmVjYXRlZGAgZm9yIGRldGFpbHMuXG4gICAgRXZlcnkgYXJndW1lbnQgb2YgYGBNdWwoKWBgIG11c3QgYmUgYGBFeHByYGAuIEluZml4IG9wZXJhdG9yIGBgKmBgXG4gICAgb24gbW9zdCBzY2FsYXIgb2JqZWN0cyBpbiBTeW1QeSBjYWxscyB0aGlzIGNsYXNzLlxuICAgIEFub3RoZXIgdXNlIG9mIGBgTXVsKClgYCBpcyB0byByZXByZXNlbnQgdGhlIHN0cnVjdHVyZSBvZiBhYnN0cmFjdFxuICAgIG11bHRpcGxpY2F0aW9uIHNvIHRoYXQgaXRzIGFyZ3VtZW50cyBjYW4gYmUgc3Vic3RpdHV0ZWQgdG8gcmV0dXJuXG4gICAgZGlmZmVyZW50IGNsYXNzLiBSZWZlciB0byBleGFtcGxlcyBzZWN0aW9uIGZvciB0aGlzLlxuICAgIGBgTXVsKClgYCBldmFsdWF0ZXMgdGhlIGFyZ3VtZW50IHVubGVzcyBgYGV2YWx1YXRlPUZhbHNlYGAgaXMgcGFzc2VkLlxuICAgIFRoZSBldmFsdWF0aW9uIGxvZ2ljIGluY2x1ZGVzOlxuICAgIDEuIEZsYXR0ZW5pbmdcbiAgICAgICAgYGBNdWwoeCwgTXVsKHksIHopKWBgIC0+IGBgTXVsKHgsIHksIHopYGBcbiAgICAyLiBJZGVudGl0eSByZW1vdmluZ1xuICAgICAgICBgYE11bCh4LCAxLCB5KWBgIC0+IGBgTXVsKHgsIHkpYGBcbiAgICAzLiBFeHBvbmVudCBjb2xsZWN0aW5nIGJ5IGBgLmFzX2Jhc2VfZXhwKClgYFxuICAgICAgICBgYE11bCh4LCB4KioyKWBgIC0+IGBgUG93KHgsIDMpYGBcbiAgICA0LiBUZXJtIHNvcnRpbmdcbiAgICAgICAgYGBNdWwoeSwgeCwgMilgYCAtPiBgYE11bCgyLCB4LCB5KWBgXG4gICAgU2luY2UgbXVsdGlwbGljYXRpb24gY2FuIGJlIHZlY3RvciBzcGFjZSBvcGVyYXRpb24sIGFyZ3VtZW50cyBtYXlcbiAgICBoYXZlIHRoZSBkaWZmZXJlbnQgOm9iajpgc3ltcHkuY29yZS5raW5kLktpbmQoKWAuIEtpbmQgb2YgdGhlXG4gICAgcmVzdWx0aW5nIG9iamVjdCBpcyBhdXRvbWF0aWNhbGx5IGluZmVycmVkLlxuICAgIEV4YW1wbGVzXG4gICAgPT09PT09PT1cbiAgICA+Pj4gZnJvbSBzeW1weSBpbXBvcnQgTXVsXG4gICAgPj4+IGZyb20gc3ltcHkuYWJjIGltcG9ydCB4LCB5XG4gICAgPj4+IE11bCh4LCAxKVxuICAgIHhcbiAgICA+Pj4gTXVsKHgsIHgpXG4gICAgeCoqMlxuICAgIElmIGBgZXZhbHVhdGU9RmFsc2VgYCBpcyBwYXNzZWQsIHJlc3VsdCBpcyBub3QgZXZhbHVhdGVkLlxuICAgID4+PiBNdWwoMSwgMiwgZXZhbHVhdGU9RmFsc2UpXG4gICAgMSoyXG4gICAgPj4+IE11bCh4LCB4LCBldmFsdWF0ZT1GYWxzZSlcbiAgICB4KnhcbiAgICBgYE11bCgpYGAgYWxzbyByZXByZXNlbnRzIHRoZSBnZW5lcmFsIHN0cnVjdHVyZSBvZiBtdWx0aXBsaWNhdGlvblxuICAgIG9wZXJhdGlvbi5cbiAgICA+Pj4gZnJvbSBzeW1weSBpbXBvcnQgTWF0cml4U3ltYm9sXG4gICAgPj4+IEEgPSBNYXRyaXhTeW1ib2woJ0EnLCAyLDIpXG4gICAgPj4+IGV4cHIgPSBNdWwoeCx5KS5zdWJzKHt5OkF9KVxuICAgID4+PiBleHByXG4gICAgeCpBXG4gICAgPj4+IHR5cGUoZXhwcilcbiAgICA8Y2xhc3MgJ3N5bXB5Lm1hdHJpY2VzLmV4cHJlc3Npb25zLm1hdG11bC5NYXRNdWwnPlxuICAgIFNlZSBBbHNvXG4gICAgPT09PT09PT1cbiAgICBNYXRNdWxcbiAgICAqL1xuICAgIF9fc2xvdHNfXzogYW55W10gPSBbXTtcbiAgICBhcmdzOiBhbnlbXTtcbiAgICBzdGF0aWMgaXNfTXVsID0gdHJ1ZTtcbiAgICBfYXJnc190eXBlID0gRXhwcjtcbiAgICBzdGF0aWMgaWRlbnRpdHkgPSBTLk9uZTtcblxuICAgIGNvbnN0cnVjdG9yKGV2YWx1YXRlOiBib29sZWFuLCBzaW1wbGlmeTogYm9vbGVhbiwgLi4uYXJnczogYW55KSB7XG4gICAgICAgIHN1cGVyKE11bCwgZXZhbHVhdGUsIHNpbXBsaWZ5LCAuLi5hcmdzKTtcbiAgICB9XG5cbiAgICBmbGF0dGVuKHNlcTogYW55KSB7XG4gICAgICAgIC8qIFJldHVybiBjb21tdXRhdGl2ZSwgbm9uY29tbXV0YXRpdmUgYW5kIG9yZGVyIGFyZ3VtZW50cyBieVxuICAgICAgICBjb21iaW5pbmcgcmVsYXRlZCB0ZXJtcy5cbiAgICAgICAgTm90ZXNcbiAgICAgICAgPT09PT1cbiAgICAgICAgICAgICogSW4gYW4gZXhwcmVzc2lvbiBsaWtlIGBgYSpiKmNgYCwgUHl0aG9uIHByb2Nlc3MgdGhpcyB0aHJvdWdoIFN5bVB5XG4gICAgICAgICAgICAgIGFzIGBgTXVsKE11bChhLCBiKSwgYylgYC4gVGhpcyBjYW4gaGF2ZSB1bmRlc2lyYWJsZSBjb25zZXF1ZW5jZXMuXG4gICAgICAgICAgICAgIC0gIFNvbWV0aW1lcyB0ZXJtcyBhcmUgbm90IGNvbWJpbmVkIGFzIG9uZSB3b3VsZCBsaWtlOlxuICAgICAgICAgICAgICAgICB7Yy5mLiBodHRwczovL2dpdGh1Yi5jb20vc3ltcHkvc3ltcHkvaXNzdWVzLzQ1OTZ9XG4gICAgICAgICAgICAgICAgPj4+IGZyb20gc3ltcHkgaW1wb3J0IE11bCwgc3FydFxuICAgICAgICAgICAgICAgID4+PiBmcm9tIHN5bXB5LmFiYyBpbXBvcnQgeCwgeSwgelxuICAgICAgICAgICAgICAgID4+PiAyKih4ICsgMSkgIyB0aGlzIGlzIHRoZSAyLWFyZyBNdWwgYmVoYXZpb3JcbiAgICAgICAgICAgICAgICAyKnggKyAyXG4gICAgICAgICAgICAgICAgPj4+IHkqKHggKyAxKSoyXG4gICAgICAgICAgICAgICAgMip5Kih4ICsgMSlcbiAgICAgICAgICAgICAgICA+Pj4gMiooeCArIDEpKnkgIyAyLWFyZyByZXN1bHQgd2lsbCBiZSBvYnRhaW5lZCBmaXJzdFxuICAgICAgICAgICAgICAgIHkqKDIqeCArIDIpXG4gICAgICAgICAgICAgICAgPj4+IE11bCgyLCB4ICsgMSwgeSkgIyBhbGwgMyBhcmdzIHNpbXVsdGFuZW91c2x5IHByb2Nlc3NlZFxuICAgICAgICAgICAgICAgIDIqeSooeCArIDEpXG4gICAgICAgICAgICAgICAgPj4+IDIqKCh4ICsgMSkqeSkgIyBwYXJlbnRoZXNlcyBjYW4gY29udHJvbCB0aGlzIGJlaGF2aW9yXG4gICAgICAgICAgICAgICAgMip5Kih4ICsgMSlcbiAgICAgICAgICAgICAgICBQb3dlcnMgd2l0aCBjb21wb3VuZCBiYXNlcyBtYXkgbm90IGZpbmQgYSBzaW5nbGUgYmFzZSB0b1xuICAgICAgICAgICAgICAgIGNvbWJpbmUgd2l0aCB1bmxlc3MgYWxsIGFyZ3VtZW50cyBhcmUgcHJvY2Vzc2VkIGF0IG9uY2UuXG4gICAgICAgICAgICAgICAgUG9zdC1wcm9jZXNzaW5nIG1heSBiZSBuZWNlc3NhcnkgaW4gc3VjaCBjYXNlcy5cbiAgICAgICAgICAgICAgICB7Yy5mLiBodHRwczovL2dpdGh1Yi5jb20vc3ltcHkvc3ltcHkvaXNzdWVzLzU3Mjh9XG4gICAgICAgICAgICAgICAgPj4+IGEgPSBzcXJ0KHgqc3FydCh5KSlcbiAgICAgICAgICAgICAgICA+Pj4gYSoqM1xuICAgICAgICAgICAgICAgICh4KnNxcnQoeSkpKiooMy8yKVxuICAgICAgICAgICAgICAgID4+PiBNdWwoYSxhLGEpXG4gICAgICAgICAgICAgICAgKHgqc3FydCh5KSkqKigzLzIpXG4gICAgICAgICAgICAgICAgPj4+IGEqYSphXG4gICAgICAgICAgICAgICAgeCpzcXJ0KHkpKnNxcnQoeCpzcXJ0KHkpKVxuICAgICAgICAgICAgICAgID4+PiBfLnN1YnMoYS5iYXNlLCB6KS5zdWJzKHosIGEuYmFzZSlcbiAgICAgICAgICAgICAgICAoeCpzcXJ0KHkpKSoqKDMvMilcbiAgICAgICAgICAgICAgLSAgSWYgbW9yZSB0aGFuIHR3byB0ZXJtcyBhcmUgYmVpbmcgbXVsdGlwbGllZCB0aGVuIGFsbCB0aGVcbiAgICAgICAgICAgICAgICAgcHJldmlvdXMgdGVybXMgd2lsbCBiZSByZS1wcm9jZXNzZWQgZm9yIGVhY2ggbmV3IGFyZ3VtZW50LlxuICAgICAgICAgICAgICAgICBTbyBpZiBlYWNoIG9mIGBgYWBgLCBgYGJgYCBhbmQgYGBjYGAgd2VyZSA6Y2xhc3M6YE11bGBcbiAgICAgICAgICAgICAgICAgZXhwcmVzc2lvbiwgdGhlbiBgYGEqYipjYGAgKG9yIGJ1aWxkaW5nIHVwIHRoZSBwcm9kdWN0XG4gICAgICAgICAgICAgICAgIHdpdGggYGAqPWBgKSB3aWxsIHByb2Nlc3MgYWxsIHRoZSBhcmd1bWVudHMgb2YgYGBhYGAgYW5kXG4gICAgICAgICAgICAgICAgIGBgYmBgIHR3aWNlOiBvbmNlIHdoZW4gYGBhKmJgYCBpcyBjb21wdXRlZCBhbmQgYWdhaW4gd2hlblxuICAgICAgICAgICAgICAgICBgYGNgYCBpcyBtdWx0aXBsaWVkLlxuICAgICAgICAgICAgICAgICBVc2luZyBgYE11bChhLCBiLCBjKWBgIHdpbGwgcHJvY2VzcyBhbGwgYXJndW1lbnRzIG9uY2UuXG4gICAgICAgICAgICAqIFRoZSByZXN1bHRzIG9mIE11bCBhcmUgY2FjaGVkIGFjY29yZGluZyB0byBhcmd1bWVudHMsIHNvIGZsYXR0ZW5cbiAgICAgICAgICAgICAgd2lsbCBvbmx5IGJlIGNhbGxlZCBvbmNlIGZvciBgYE11bChhLCBiLCBjKWBgLiBJZiB5b3UgY2FuXG4gICAgICAgICAgICAgIHN0cnVjdHVyZSBhIGNhbGN1bGF0aW9uIHNvIHRoZSBhcmd1bWVudHMgYXJlIG1vc3QgbGlrZWx5IHRvIGJlXG4gICAgICAgICAgICAgIHJlcGVhdHMgdGhlbiB0aGlzIGNhbiBzYXZlIHRpbWUgaW4gY29tcHV0aW5nIHRoZSBhbnN3ZXIuIEZvclxuICAgICAgICAgICAgICBleGFtcGxlLCBzYXkgeW91IGhhZCBhIE11bCwgTSwgdGhhdCB5b3Ugd2lzaGVkIHRvIGRpdmlkZSBieSBgYGRbaV1gYFxuICAgICAgICAgICAgICBhbmQgbXVsdGlwbHkgYnkgYGBuW2ldYGAgYW5kIHlvdSBzdXNwZWN0IHRoZXJlIGFyZSBtYW55IHJlcGVhdHNcbiAgICAgICAgICAgICAgaW4gYGBuYGAuIEl0IHdvdWxkIGJlIGJldHRlciB0byBjb21wdXRlIGBgTSpuW2ldL2RbaV1gYCByYXRoZXJcbiAgICAgICAgICAgICAgdGhhbiBgYE0vZFtpXSpuW2ldYGAgc2luY2UgZXZlcnkgdGltZSBuW2ldIGlzIGEgcmVwZWF0LCB0aGVcbiAgICAgICAgICAgICAgcHJvZHVjdCwgYGBNKm5baV1gYCB3aWxsIGJlIHJldHVybmVkIHdpdGhvdXQgZmxhdHRlbmluZyAtLSB0aGVcbiAgICAgICAgICAgICAgY2FjaGVkIHZhbHVlIHdpbGwgYmUgcmV0dXJuZWQuIElmIHlvdSBkaXZpZGUgYnkgdGhlIGBgZFtpXWBgXG4gICAgICAgICAgICAgIGZpcnN0IChhbmQgdGhvc2UgYXJlIG1vcmUgdW5pcXVlIHRoYW4gdGhlIGBgbltpXWBgKSB0aGVuIHRoYXQgd2lsbFxuICAgICAgICAgICAgICBjcmVhdGUgYSBuZXcgTXVsLCBgYE0vZFtpXWBgIHRoZSBhcmdzIG9mIHdoaWNoIHdpbGwgYmUgdHJhdmVyc2VkXG4gICAgICAgICAgICAgIGFnYWluIHdoZW4gaXQgaXMgbXVsdGlwbGllZCBieSBgYG5baV1gYC5cbiAgICAgICAgICAgICAge2MuZi4gaHR0cHM6Ly9naXRodWIuY29tL3N5bXB5L3N5bXB5L2lzc3Vlcy81NzA2fVxuICAgICAgICAgICAgICBUaGlzIGNvbnNpZGVyYXRpb24gaXMgbW9vdCBpZiB0aGUgY2FjaGUgaXMgdHVybmVkIG9mZi5cbiAgICAgICAgICAgIE5CXG4gICAgICAgICAgICAtLVxuICAgICAgICAgICAgICBUaGUgdmFsaWRpdHkgb2YgdGhlIGFib3ZlIG5vdGVzIGRlcGVuZHMgb24gdGhlIGltcGxlbWVudGF0aW9uXG4gICAgICAgICAgICAgIGRldGFpbHMgb2YgTXVsIGFuZCBmbGF0dGVuIHdoaWNoIG1heSBjaGFuZ2UgYXQgYW55IHRpbWUuIFRoZXJlZm9yZSxcbiAgICAgICAgICAgICAgeW91IHNob3VsZCBvbmx5IGNvbnNpZGVyIHRoZW0gd2hlbiB5b3VyIGNvZGUgaXMgaGlnaGx5IHBlcmZvcm1hbmNlXG4gICAgICAgICAgICAgIHNlbnNpdGl2ZS5cbiAgICAgICAgICAgICAgUmVtb3ZhbCBvZiAxIGZyb20gdGhlIHNlcXVlbmNlIGlzIGFscmVhZHkgaGFuZGxlZCBieSBBc3NvY09wLl9fbmV3X18uXG4gICAgICAgICovXG4gICAgICAgIGxldCBydiA9IHVuZGVmaW5lZDtcbiAgICAgICAgaWYgKHNlcS5sZW5ndGggPT09IDIpIHtcbiAgICAgICAgICAgIGxldCBbYSwgYl0gPSBzZXE7XG4gICAgICAgICAgICBpZiAoYi5pc19SYXRpb25hbCgpKSB7XG4gICAgICAgICAgICAgICAgW2EsIGJdID0gW2IsIGFdO1xuICAgICAgICAgICAgICAgIHNlcSA9IFthLCBiXTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmICghKGEuaXNfemVybygpICYmIGEuaXNfUmF0aW9uYWwoKSkpIHtcbiAgICAgICAgICAgICAgICBsZXQgcjtcbiAgICAgICAgICAgICAgICBbciwgYl0gPSBiLmFzX2NvZWZmX011bCgpO1xuICAgICAgICAgICAgICAgIGlmIChiLmlzX0FkZCgpKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChyICE9PSBTLk9uZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgbGV0IGFyYjtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IGFyID0gYS5fX211bF9fKHIpO1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGFyID09PSBTLk9uZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGFyYiA9IGI7XG4gICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGFyYiA9IHRoaXMuY29uc3RydWN0b3IoZmFsc2UsIHRydWUsIGEuX19tdWxfXyhyKSwgYik7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICBydiA9IFtbYXJiXSwgW10sIHVuZGVmaW5lZF07XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoZ2xvYmFsX3BhcmFtZXRlcnMuZGlzdHJpYnV0ZSAmJiBiLmlzX2NvbW11dGF0aXZlKCkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IGFyZzogYW55ID0gW107XG4gICAgICAgICAgICAgICAgICAgICAgICBmb3IgKGNvbnN0IGJpIG9mIGIuX2FyZ3MpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBhcmcucHVzaCh0aGlzLl9rZWVwX2NvZWZmKGEsIGJpKSk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBuZXdiID0gbmV3IEFkZCh0cnVlLCB0cnVlLCAuLi5hcmcpO1xuICAgICAgICAgICAgICAgICAgICAgICAgcnYgPSBbW25ld2JdLCBbXSwgdW5kZWZpbmVkXTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChydikge1xuICAgICAgICAgICAgICAgIHJldHVybiBydjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGxldCBjX3BhcnQ6IGFueSA9IFtdO1xuICAgICAgICBjb25zdCBuY19zZXEgPSBbXTtcbiAgICAgICAgbGV0IG5jX3BhcnQ6IGFueSA9IFtdO1xuICAgICAgICBsZXQgY29lZmYgPSBTLk9uZTtcbiAgICAgICAgbGV0IGNfcG93ZXJzID0gW107XG4gICAgICAgIGxldCBuZWcxZSA9IFMuWmVybzsgbGV0IG51bV9leHAgPSBbXTtcbiAgICAgICAgY29uc3QgcG51bV9yYXQgPSBuZXcgSGFzaERpY3QoKTtcbiAgICAgICAgY29uc3Qgb3JkZXJfc3ltYm9sczogYW55W10gPSBbXTtcblxuICAgICAgICBmb3IgKGxldCBvIG9mIHNlcSkge1xuICAgICAgICAgICAgaWYgKG8uaXNfTXVsKCkpIHtcbiAgICAgICAgICAgICAgICBpZiAoby5pc19jb21tdXRhdGl2ZSgpKSB7XG4gICAgICAgICAgICAgICAgICAgIHNlcS5wdXNoKC4uLm8uX2FyZ3MpO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIGZvciAoY29uc3QgcSBvZiBvLl9hcmdzKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAocS5pc19jb21tdXRhdGl2ZSgpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc2VxLnB1c2gocSk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5jX3NlcS5wdXNoKHEpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgICAgfSBlbHNlIGlmIChvLmlzX051bWJlcigpKSB7XG4gICAgICAgICAgICAgICAgaWYgKG8gPT09IFMuTmFOIHx8IGNvZWZmID09PSBTLkNvbXBsZXhJbmZpbml0eSAmJiBvLmlzX3plcm8oKSkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gW1tTLk5hTl0sIFtdLCB1bmRlZmluZWRdO1xuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoY29lZmYuaXNfTnVtYmVyKCkpIHtcbiAgICAgICAgICAgICAgICAgICAgY29lZmYgPSBjb2VmZi5fX211bF9fKG8pO1xuICAgICAgICAgICAgICAgICAgICBpZiAoY29lZmYgPT09IFMuTmFOKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gW1tTLk5hTl0sIFtdLCB1bmRlZmluZWRdO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgICAgfSBlbHNlIGlmIChvID09PSBTLkNvbXBsZXhJbmZpbml0eSkge1xuICAgICAgICAgICAgICAgIGlmICghKGNvZWZmKSkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gW1tTLk5hTl0sIFtdLCB1bmRlZmluZWRdO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBjb2VmZiA9IFMuQ29tcGxleEluZmluaXR5O1xuICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgICAgfSBlbHNlIGlmIChvLmlzX2NvbW11dGF0aXZlKCkpIHtcbiAgICAgICAgICAgICAgICBsZXQgZTsgbGV0IGI7XG4gICAgICAgICAgICAgICAgW2IsIGVdID0gby5hc19iYXNlX2V4cCgpO1xuICAgICAgICAgICAgICAgIGlmIChvLmlzX1BvdygpKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChiLmlzX051bWJlcigpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoZS5pc19SYXRpb25hbCgpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGUuaXNfSW50ZWdlcigpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvZWZmID0gY29lZmYuX19tdWxfXyhuZXcgUG93KGIsIGUpKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIGlmIChlLmlzX25lZ2F0aXZlKCkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc2VxLnB1c2gobmV3IFBvdyhiLCBlKSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoYi5pc19uZWdhdGl2ZSgpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5lZzFlID0gbmVnMWUuX19hZGRfXyhlKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYiA9IGIuX19tdWxfXyhTLk5lZ2F0aXZlT25lKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGIgIT09IFMuT25lKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBudW1fcmF0LnNldGRlZmF1bHQoYiwgW10pLnB1c2goZSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIGlmIChiLmlzX3Bvc2l0aXZlKCkgfHwgYi5pc19pbnRlZ2VyKCkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBudW1fZXhwLnB1c2goW2IsIGVdKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBjX3Bvd2Vycy5wdXNoKFtiLCBlXSk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGlmIChvICE9PSBOQ19NYXJrZXIpIHtcbiAgICAgICAgICAgICAgICAgICAgbmNfc2VxLnB1c2gobyk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHdoaWxlIChuY19zZXEpIHtcbiAgICAgICAgICAgICAgICAgICAgbyA9IG5jX3NlcS5zcGxpY2UoMCwgMSk7XG4gICAgICAgICAgICAgICAgICAgIGlmICghKG5jX3BhcnQpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBuY19wYXJ0LnB1c2gobyk7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBjb25zdCBvMSA9IG5jX3BhcnQucG9wKCk7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IFtiMSwgZTFdID0gbzEuYXNfYmFzZV9leHAoKTtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgW2IyLCBlMl0gPSBvLmFzX2Jhc2VfZXhwKCk7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IG5ld19leHAgPSBlMS5fX2FkZF9fKGUyKTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGIxLmVxKGIyKSAmJiAhKG5ld19leHAuaXNfQWRkKCkpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBvMTIgPSBiMS5fZXZhbF9wb3dlcihuZXdfZXhwKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChvMTIuaXNfY29tbXV0YXRpdmUoKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNlcS5wdXNoKG8xMik7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5jX3NlcS5zcGxpY2UoMCwgMCwgbzEyKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIG5jX3BhcnQucHVzaChvMSk7XG4gICAgICAgICAgICAgICAgICAgICAgICBuY19wYXJ0LnB1c2gobyk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBmdW5jdGlvbiBfZ2F0aGVyKGNfcG93ZXJzOiBhbnlbXSkge1xuICAgICAgICAgICAgY29uc3QgY29tbW9uX2IgPSBuZXcgSGFzaERpY3QoKTtcbiAgICAgICAgICAgIGZvciAoY29uc3QgW2IsIGVdIG9mIGNfcG93ZXJzKSB7XG4gICAgICAgICAgICAgICAgY29uc3QgY28gPSBlLmFzX2NvZWZmX011bCgpO1xuICAgICAgICAgICAgICAgIGNvbW1vbl9iLnNldGRlZmF1bHQoYiwgbmV3IEhhc2hEaWN0KCkpLnNldGRlZmF1bHQoY29bMV0sIFtdKS5wdXNoKGNvWzBdKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBuby11bnVzZWQtdmFyc1xuICAgICAgICAgICAgZm9yIChjb25zdCBbYiwgZF0gb2YgY29tbW9uX2IuZW50cmllcygpKSB7XG4gICAgICAgICAgICAgICAgZm9yIChjb25zdCBbZGksIGxpXSBvZiBkLmVudHJpZXMoKSkge1xuICAgICAgICAgICAgICAgICAgICBkLmFkZChkaSwgbmV3IEFkZCh0cnVlLCB0cnVlLCAuLi5saSkpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGNvbnN0IG5ld19jX3Bvd2VycyA9IFtdO1xuICAgICAgICAgICAgZm9yIChjb25zdCBbYiwgZV0gb2YgY29tbW9uX2IuZW50cmllcygpKSB7XG4gICAgICAgICAgICAgICAgZm9yIChjb25zdCBbdCwgY10gb2YgZS5lbnRyaWVzKCkpIHtcbiAgICAgICAgICAgICAgICAgICAgbmV3X2NfcG93ZXJzLnB1c2goW2IsIGMuX19tdWxfXyh0KV0pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiBuZXdfY19wb3dlcnM7XG4gICAgICAgIH1cblxuICAgICAgICBjX3Bvd2VycyA9IF9nYXRoZXIoY19wb3dlcnMpO1xuICAgICAgICBudW1fZXhwID0gX2dhdGhlcihudW1fZXhwKTtcblxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IDI7IGkrKykge1xuICAgICAgICAgICAgY29uc3QgbmV3X2NfcG93ZXJzOiBhbnlbXSA9IFtdO1xuICAgICAgICAgICAgbGV0IGNoYW5nZWQgPSBmYWxzZTtcbiAgICAgICAgICAgIGZvciAobGV0IFtiLCBlXSBvZiBjX3Bvd2Vycykge1xuICAgICAgICAgICAgICAgIGxldCBwOiBhbnk7XG4gICAgICAgICAgICAgICAgaWYgKGUuaXNfemVybygpID09PSB0cnVlKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmICgoYi5pc19BZGQoKSB8fCBiLmlzX011bCgpICYmXG4gICAgICAgICAgICAgICAgICAgICAgICBiLl9hcmdzLmluY2x1ZGVzKFMuQ29tcGxleEluZmluaXR5LCBTLkluZmluaXR5LCBTLk5lZmF0aXZlSW5maW5pdHkpKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFtbUy5OYU5dLCBbXSwgdW5kZWZpbmVkXTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgaWYgKGUgPT09IFMuT25lKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChiLmlzX051bWJlcigpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb2VmZiA9IGNvZWZmLl9fbXVsX18oYik7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBwID0gYjtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgaWYgKGUgIT09IFMuT25lKSB7XG4gICAgICAgICAgICAgICAgICAgIHAgPSBuZXcgUG93KGIsIGUpO1xuICAgICAgICAgICAgICAgICAgICBpZiAocC5pc19Qb3coKSAmJiAhYi5pc19Qb3coKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgYmkgPSBiO1xuICAgICAgICAgICAgICAgICAgICAgICAgW2IsIGVdID0gcC5hc19iYXNlX2V4cCgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGIgIT09IGJpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY2hhbmdlZCA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgY19wYXJ0LnB1c2gocCk7XG4gICAgICAgICAgICAgICAgbmV3X2NfcG93ZXJzLnB1c2goW2IsIGVdKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGNvbnN0IGFyZ3NldCA9IG5ldyBIYXNoU2V0KCk7XG4gICAgICAgICAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tdW51c2VkLXZhcnNcbiAgICAgICAgICAgIGZvciAoY29uc3QgW2IsIGVdIG9mIG5ld19jX3Bvd2Vycykge1xuICAgICAgICAgICAgICAgIGFyZ3NldC5hZGQoYik7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoY2hhbmdlZCAmJiBhcmdzZXQuc2l6ZSAhPT0gbmV3X2NfcG93ZXJzLmxlbmd0aCkge1xuICAgICAgICAgICAgICAgIGNfcGFydCA9IFtdO1xuICAgICAgICAgICAgICAgIGNfcG93ZXJzID0gX2dhdGhlcihuZXdfY19wb3dlcnMpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBjb25zdCBpbnZfZXhwX2RpY3QgPSBuZXcgSGFzaERpY3QoKTtcbiAgICAgICAgZm9yIChjb25zdCBbYiwgZV0gb2YgbnVtX2V4cCkge1xuICAgICAgICAgICAgaW52X2V4cF9kaWN0LnNldGRlZmF1bHQoZSwgW10pLnB1c2goYik7XG4gICAgICAgIH1cbiAgICAgICAgZm9yIChjb25zdCBbZSwgYl0gb2YgaW52X2V4cF9kaWN0LmVudHJpZXMoKSkge1xuICAgICAgICAgICAgaW52X2V4cF9kaWN0LmFkZChlLCBuZXcgTXVsKHRydWUsIHRydWUsIC4uLmIpKTtcbiAgICAgICAgfVxuICAgICAgICBjb25zdCBjX3BhcnRfYXJnID0gW107XG4gICAgICAgIGZvciAoY29uc3QgW2UsIGJdIG9mIGludl9leHBfZGljdC5lbnRyaWVzKCkpIHtcbiAgICAgICAgICAgIGlmIChlKSB7XG4gICAgICAgICAgICAgICAgY19wYXJ0X2FyZy5wdXNoKG5ldyBQb3coYiwgZSkpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGNfcGFydC5wdXNoKC4uLmNfcGFydF9hcmcpO1xuXG4gICAgICAgIGNvbnN0IGNvbWJfZSA9IG5ldyBIYXNoRGljdCgpO1xuICAgICAgICBmb3IgKGNvbnN0IFtiLCBlXSBvZiBwbnVtX3JhdC5lbnRyaWVzKCkpIHtcbiAgICAgICAgICAgIGNvbWJfZS5zZXRkZWZhdWx0KG5ldyBBZGQodHJ1ZSwgdHJ1ZSwgLi4uZSksIFtdKS5wdXNoKGIpO1xuICAgICAgICB9XG5cbiAgICAgICAgY29uc3QgbnVtX3JhdCA9IFtdO1xuICAgICAgICBmb3IgKGxldCBbZSwgYl0gb2YgY29tYl9lLmVudHJpZXMoKSkge1xuICAgICAgICAgICAgYiA9IG5ldyBNdWwodHJ1ZSwgdHJ1ZSwgLi4uYik7XG4gICAgICAgICAgICBpZiAoZS5xID09PSAxKSB7XG4gICAgICAgICAgICAgICAgY29lZmYgPSBjb2VmZi5fX211bF9fKG5ldyBQb3coYiwgZSkpO1xuICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKGUucCA+IGUucSkge1xuICAgICAgICAgICAgICAgIGNvbnN0IFtlX2ksIGVwXSA9IGRpdm1vZChlLnAsIGUucSk7XG4gICAgICAgICAgICAgICAgY29lZmYgPSBjb2VmZi5fX211bF9fKG5ldyBQb3coYiwgZV9pKSk7XG4gICAgICAgICAgICAgICAgZSA9IG5ldyBSYXRpb25hbChlcCwgZS5xKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIG51bV9yYXQucHVzaChbYiwgZV0pO1xuICAgICAgICB9XG5cbiAgICAgICAgY29uc3QgcG5ldyA9IG5ldyBBcnJEZWZhdWx0RGljdCgpO1xuICAgICAgICBsZXQgaSA9IDA7XG4gICAgICAgIHdoaWxlIChpIDwgbnVtX3JhdC5sZW5ndGgpIHtcbiAgICAgICAgICAgIGxldCBbYmksIGVpXTogYW55ID0gbnVtX3JhdFtpXTtcbiAgICAgICAgICAgIGNvbnN0IGdyb3cgPSBbXTtcbiAgICAgICAgICAgIGZvciAobGV0IGogPSBpICsgMTsgaiA8IG51bV9yYXQubGVuZ3RoOyBqKyspIHtcbiAgICAgICAgICAgICAgICBjb25zdCBbYmosIGVqXTogYW55ID0gbnVtX3JhdFtqXTtcbiAgICAgICAgICAgICAgICBjb25zdCBnID0gYmkuZ2NkKGJqKTtcbiAgICAgICAgICAgICAgICBpZiAoZyAhPT0gUy5PbmUpIHtcbiAgICAgICAgICAgICAgICAgICAgbGV0IGUgPSBlaS5fX2FkZF9fKGVqKTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGUucSA9PT0gMSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgY29lZmYgPSBjb2VmZi5fX211bF9fKG5ldyBQb3coZywgZSkpO1xuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGUucCA+IGUucSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IFtlX2ksIGVwXSA9IGRpdm1vZChlLnAsIGUucSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29lZmYgPSBjb2VmZi5fX211bF9fKG5ldyBQb3coZywgZV9pKSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZSA9IG5ldyBSYXRpb25hbChlcCwgZS5xKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIGdyb3cucHVzaChbZywgZV0pO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIG51bV9yYXRbal0gPSBbYmovZywgZWpdO1xuICAgICAgICAgICAgICAgICAgICBiaSA9IGJpL2c7XG4gICAgICAgICAgICAgICAgICAgIGlmIChiaSA9PT0gUy5PbmUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKGJpICE9PSBTLk9uZSkge1xuICAgICAgICAgICAgICAgIGNvbnN0IG9iajogYW55ID0gbmV3IFBvdyhiaSwgZWkpO1xuICAgICAgICAgICAgICAgIGlmIChvYmouaXNfTnVtYmVyKCkpIHtcbiAgICAgICAgICAgICAgICAgICAgY29lZmYgPSBjb2VmZi5fX211bF9fKG9iaik7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgZm9yIChjb25zdCBpdGVtIG9mIHRoaXMubWFrZV9hcmdzKE11bCwgb2JqKSkgeyAvLyAhISEhISFcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChpdGVtLmlzX051bWJlcigpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29lZmYgPSBjb2VmZi5fX211bF9fKG9iaik7XG4gICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFtiaSwgZWldID0gaXRlbS5fYXJncztcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBwbmV3LmFkZChlaSwgcG5ldy5nZXQoZWkpLmNvbmNhdChiaSkpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgbnVtX3JhdC5wdXNoKC4uLmdyb3cpO1xuICAgICAgICAgICAgaSsrO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKG5lZzFlICE9PSBTLlplcm8pIHtcbiAgICAgICAgICAgIGxldCBuOyBsZXQgcTsgbGV0IHA7XG4gICAgICAgICAgICBbcCwgcV0gPSBuZWcxZS5fYXNfbnVtZXJfZGVub20oKTtcbiAgICAgICAgICAgIFtuLCBwXSA9IGRpdm1vZChwLnAsIHEucCk7XG4gICAgICAgICAgICBpZiAobiAlIDIgIT09IDApIHtcbiAgICAgICAgICAgICAgICBjb2VmZiA9IGNvZWZmLl9fbXVsX18oUy5OZWdhdGl2ZU9uZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAocSA9PT0gMikge1xuICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcImltYWdpbmFyeSBudW1iZXJzIG5vdCB5ZXQgc3VwcG9ydGVkXCIpO1xuICAgICAgICAgICAgfSBlbHNlIGlmIChwKSB7XG4gICAgICAgICAgICAgICAgbmVnMWUgPSBuZXcgUmF0aW9uYWwocCwgcSk7XG4gICAgICAgICAgICAgICAgbGV0IGVudGVyZWxzZTogYm9vbGVhbiA9IHRydWU7XG4gICAgICAgICAgICAgICAgZm9yIChjb25zdCBbZSwgYl0gb2YgcG5ldy5lbnRyaWVzKCkpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGUgPT09IG5lZzFlICYmIGIuaXNfcG9zaXRpdmUoKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgcG5ldy5hZGQoZSwgcG5ldy5nZXQoZSkgLSBiKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGVudGVyZWxzZSA9IGZhbHNlO1xuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgaWYgKGVudGVyZWxzZSkge1xuICAgICAgICAgICAgICAgICAgICBjX3BhcnQucHVzaChuZXcgUG93KFMuTmVnYXRpdmVPbmUsIG5lZzFlLCBmYWxzZSkpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IGNfcGFydF9hcmd2MiA9IFtdO1xuICAgICAgICBmb3IgKGxldCBbZSwgYl0gb2YgcG5ldy5lbnRyaWVzKCkpIHtcbiAgICAgICAgICAgIGlmIChBcnJheS5pc0FycmF5KGIpKSB7XG4gICAgICAgICAgICAgICAgYiA9IGJbMF07XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBjX3BhcnRfYXJndjIucHVzaChuZXcgUG93KGIsIGUpKTtcbiAgICAgICAgfVxuICAgICAgICBjX3BhcnQucHVzaCguLi5jX3BhcnRfYXJndjIpO1xuXG4gICAgICAgIGlmIChjb2VmZiA9PT0gUy5JbmZpbml0eSB8fCBjb2VmZiA9PT0gUy5OZWdhdGl2ZUluZmluaXR5KSB7XG4gICAgICAgICAgICBmdW5jdGlvbiBfaGFuZGxlX2Zvcl9vbyhjX3BhcnQ6IGFueVtdLCBjb2VmZl9zaWduOiBudW1iZXIpIHtcbiAgICAgICAgICAgICAgICBjb25zdCBuZXdfY19wYXJ0ID0gW107XG4gICAgICAgICAgICAgICAgZm9yIChjb25zdCB0IG9mIGNfcGFydCkge1xuICAgICAgICAgICAgICAgICAgICBpZiAodC5pc19leHRlbmRlZF9wb3NpdGl2ZSgpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBpZiAodC5pc19leHRlbmRlZF9uZWdhdGl2ZSgpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb2VmZl9zaWduID0gLTE7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBuZXdfY19wYXJ0LnB1c2godCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHJldHVybiBbbmV3X2NfcGFydCwgY29lZmZfc2lnbl07XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBsZXQgY29lZmZfc2lnbjogYW55O1xuICAgICAgICAgICAgW2NfcGFydCwgY29lZmZfc2lnbl0gPSBfaGFuZGxlX2Zvcl9vbyhjX3BhcnQsIDEpO1xuICAgICAgICAgICAgW25jX3BhcnQsIGNvZWZmX3NpZ25dID0gX2hhbmRsZV9mb3Jfb28obmNfcGFydCwgY29lZmZfc2lnbik7XG4gICAgICAgICAgICBjb2VmZiA9IGNvZWZmLl9fbXVsX18obmV3IEludGVnZXIoY29lZmZfc2lnbikpO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGNvZWZmID09PSBTLkNvbXBsZXhJbmZpbml0eSkge1xuICAgICAgICAgICAgY29uc3QgY3RlbXAgPSBbXTtcbiAgICAgICAgICAgIGZvciAoY29uc3QgYyBvZiBjX3BhcnQpIHtcbiAgICAgICAgICAgICAgICBpZiAoIShmdXp6eV9ub3R2MihjLmlzX3plcm8oKSkgJiYgYy5pc19leHRlbmRlZF9yZWFsKCkgIT09IFwidW5kZWZpbmVkXCIpKSB7XG4gICAgICAgICAgICAgICAgICAgIGN0ZW1wLnB1c2goYyk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgY19wYXJ0ID0gY3RlbXA7XG4gICAgICAgICAgICBjb25zdCBuY3RlbXAgPSBbXTtcbiAgICAgICAgICAgIGZvciAoY29uc3QgYyBvZiBuY19wYXJ0KSB7XG4gICAgICAgICAgICAgICAgaWYgKCEoZnV6enlfbm90djIoYy5pc196ZXJvKCkpICYmIGMuaXNfZXh0ZW5kZWRfcmVhbCgpICE9PSBcInVuZGVmaW5lZFwiKSkge1xuICAgICAgICAgICAgICAgICAgICBuY3RlbXAucHVzaChjKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBuY19wYXJ0ID0gbmN0ZW1wO1xuICAgICAgICB9IGVsc2UgaWYgKGNvZWZmLmlzX3plcm8oKSkge1xuICAgICAgICAgICAgZm9yIChjb25zdCBjIG9mIGNfcGFydCkge1xuICAgICAgICAgICAgICAgIGlmIChjLmlzX2Zpbml0ZSgpID09PSBmYWxzZSkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gW1tTLk5hTl0sIFtdLCBvcmRlcl9zeW1ib2xzXTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCBfbmV3ID0gW107XG4gICAgICAgIGZvciAoY29uc3QgaSBvZiBjX3BhcnQpIHtcbiAgICAgICAgICAgIGlmIChpLmlzX051bWJlcigpKSB7XG4gICAgICAgICAgICAgICAgY29lZmYgPSBjb2VmZi5fX211bF9fKGkpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBfbmV3LnB1c2goaSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgY19wYXJ0ID0gX25ldztcblxuICAgICAgICBfbXVsc29ydChjX3BhcnQpO1xuXG4gICAgICAgIGlmIChjb2VmZiAhPT0gUy5PbmUpIHtcbiAgICAgICAgICAgIGNfcGFydC5zcGxpY2UoMCwgMCwgY29lZmYpO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGdsb2JhbF9wYXJhbWV0ZXJzLmRpc3RyaWJ1dGUgJiYgIW5jX3BhcnQgJiYgY19wYXJ0Lmxlbmd0aCA9PT0gMiAmJlxuICAgICAgICAgICAgY19wYXJ0WzBdLmlzX051bWJlcigpICYmIGNfcGFydFswXS5pc19maW5pdGUoKSAmJiBjX3BhcnRbMV0uaXNfQWRkKCkpIHtcbiAgICAgICAgICAgIGNvZWZmID0gY19wYXJ0WzBdO1xuICAgICAgICAgICAgY29uc3QgYWRkYXJnID0gW107XG4gICAgICAgICAgICBmb3IgKGNvbnN0IGYgb2YgY19wYXJ0WzFdLl9hcmdzKSB7XG4gICAgICAgICAgICAgICAgYWRkYXJnLnB1c2goY29lZmYuX19tdWxfXyhmKSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBjX3BhcnQgPSBuZXcgQWRkKHRydWUsIHRydWUsIC4uLmFkZGFyZyk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIFtjX3BhcnQsIG5jX3BhcnQsIG9yZGVyX3N5bWJvbHNdO1xuICAgIH1cblxuICAgIGFzX2NvZWZmX011bChyYXRpb25hbDogYm9vbGVhbiA9IGZhbHNlKSB7XG4gICAgICAgIGNvbnN0IGNvZWZmOiBhbnkgPSB0aGlzLl9hcmdzLnNsaWNlKDAsIDEpWzBdO1xuICAgICAgICBjb25zdCBhcmdzOiBhbnkgPSB0aGlzLl9hcmdzLnNsaWNlKDEpO1xuXG4gICAgICAgIGlmIChjb2VmZi5pc19OdW1iZXIoKSkge1xuICAgICAgICAgICAgaWYgKCFyYXRpb25hbCB8fCBjb2VmZi5pc19SYXRpb25hbCgpKSB7XG4gICAgICAgICAgICAgICAgaWYgKGFyZ3MubGVuZ3RoID09PSAxKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBbY29lZmYsIGFyZ3NbMF1dO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBbY29lZmYsIHRoaXMuX25ld19yYXdhcmdzKHRydWUsIC4uLmFyZ3MpXTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9IGVsc2UgaWYgKGNvZWZmLmlzX2V4dGVuZGVkX25lZ2F0aXZlKCkpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gW1MuTmVnYXRpdmVPbmUsIHRoaXMuX25ld19yYXdhcmdzKHRydWUsIC4uLlstY29lZmZdLmNvbmNhdChhcmdzKSldO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBbUy5PbmUsIHRoaXNdO1xuICAgIH1cblxuICAgIF9ldmFsX3Bvd2VyKGU6IGFueSkge1xuICAgICAgICBjb25zdCBbY2FyZ3MsIG5jXSA9IHRoaXMuYXJnc19jbmMoZmFsc2UsIHRydWUsIGZhbHNlKTtcbiAgICAgICAgaWYgKGUuaXNfSW50ZWdlcigpKSB7XG4gICAgICAgICAgICBjb25zdCBtdWxhcmdzID0gW107XG4gICAgICAgICAgICBmb3IgKGNvbnN0IGIgb2YgY2FyZ3MpIHtcbiAgICAgICAgICAgICAgICBtdWxhcmdzLnB1c2gobmV3IFBvdyhiLCBlLCBmYWxzZSkpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIG5ldyBNdWwodHJ1ZSwgdHJ1ZSwgLi4ubXVsYXJncykuX19tdWxfXyhcbiAgICAgICAgICAgICAgICBuZXcgUG93KHRoaXMuX2Zyb21fYXJncyhNdWwsIHVuZGVmaW5lZCwgLi4ubmMpLCBlLCBmYWxzZSkpO1xuICAgICAgICB9XG4gICAgICAgIGNvbnN0IHAgPSBuZXcgUG93KHRoaXMsIGUsIGZhbHNlKTtcblxuICAgICAgICBpZiAoZS5pc19SYXRpb25hbCgpIHx8IGUuaXNfRmxvYXQoKSkge1xuICAgICAgICAgICAgcmV0dXJuIHAuX2V2YWxfZXhwYW5kX3Bvd2VyX2Jhc2UoKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBwO1xuICAgIH1cblxuICAgIF9rZWVwX2NvZWZmKGNvZWZmOiBhbnksIGZhY3RvcnM6IGFueSwgY2xlYXI6IGJvb2xlYW4gPSB0cnVlLCBzaWduOiBib29sZWFuID0gZmFsc2UpOiBhbnkge1xuICAgICAgICAvKiBSZXR1cm4gYGBjb2VmZipmYWN0b3JzYGAgdW5ldmFsdWF0ZWQgaWYgbmVjZXNzYXJ5LlxuICAgICAgICBJZiBgYGNsZWFyYGAgaXMgRmFsc2UsIGRvIG5vdCBrZWVwIHRoZSBjb2VmZmljaWVudCBhcyBhIGZhY3RvclxuICAgICAgICBpZiBpdCBjYW4gYmUgZGlzdHJpYnV0ZWQgb24gYSBzaW5nbGUgZmFjdG9yIHN1Y2ggdGhhdCBvbmUgb3JcbiAgICAgICAgbW9yZSB0ZXJtcyB3aWxsIHN0aWxsIGhhdmUgaW50ZWdlciBjb2VmZmljaWVudHMuXG4gICAgICAgIElmIGBgc2lnbmBgIGlzIFRydWUsIGFsbG93IGEgY29lZmZpY2llbnQgb2YgLTEgdG8gcmVtYWluIGZhY3RvcmVkIG91dC5cbiAgICAgICAgRXhhbXBsZXNcbiAgICAgICAgPT09PT09PT1cbiAgICAgICAgPj4+IGZyb20gc3ltcHkuY29yZS5tdWwgaW1wb3J0IF9rZWVwX2NvZWZmXG4gICAgICAgID4+PiBmcm9tIHN5bXB5LmFiYyBpbXBvcnQgeCwgeVxuICAgICAgICA+Pj4gZnJvbSBzeW1weSBpbXBvcnQgU1xuICAgICAgICA+Pj4gX2tlZXBfY29lZmYoUy5IYWxmLCB4ICsgMilcbiAgICAgICAgKHggKyAyKS8yXG4gICAgICAgID4+PiBfa2VlcF9jb2VmZihTLkhhbGYsIHggKyAyLCBjbGVhcj1GYWxzZSlcbiAgICAgICAgeC8yICsgMVxuICAgICAgICA+Pj4gX2tlZXBfY29lZmYoUy5IYWxmLCAoeCArIDIpKnksIGNsZWFyPUZhbHNlKVxuICAgICAgICB5Kih4ICsgMikvMlxuICAgICAgICA+Pj4gX2tlZXBfY29lZmYoUygtMSksIHggKyB5KVxuICAgICAgICAteCAtIHlcbiAgICAgICAgPj4+IF9rZWVwX2NvZWZmKFMoLTEpLCB4ICsgeSwgc2lnbj1UcnVlKVxuICAgICAgICAtKHggKyB5KVxuICAgICAgICAqL1xuICAgICAgICBpZiAoIShjb2VmZi5pc19OdW1iZXIoKSkpIHtcbiAgICAgICAgICAgIGlmIChmYWN0b3JzLmlzX051bWJlcigpKSB7XG4gICAgICAgICAgICAgICAgW2ZhY3RvcnMsIGNvZWZmXSA9IFtjb2VmZiwgZmFjdG9yc107XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHJldHVybiBjb2VmZi5fX211bF9fKGZhY3RvcnMpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGlmIChmYWN0b3JzID09PSBTLk9uZSkge1xuICAgICAgICAgICAgcmV0dXJuIGNvZWZmO1xuICAgICAgICB9XG4gICAgICAgIGlmIChjb2VmZiA9PT0gUy5PbmUpIHtcbiAgICAgICAgICAgIHJldHVybiBmYWN0b3JzO1xuICAgICAgICB9IGVsc2UgaWYgKGNvZWZmID09PSBTLk5lZ2F0aXZlT25lICYmICFzaWduKSB7XG4gICAgICAgICAgICByZXR1cm4gZmFjdG9ycy5fX211bF9fKFMuTmVnYXRpdmVPbmUpO1xuICAgICAgICB9IGVsc2UgaWYgKGZhY3RvcnMuaXNfQWRkKCkpIHtcbiAgICAgICAgICAgIGlmICghY2xlYXIgJiYgY29lZmYuaXNfUmF0aW9uYWwoKSAmJiBjb2VmZi5xICE9PSAxKSB7XG4gICAgICAgICAgICAgICAgbGV0IGFyZ3MgPSBbXTtcbiAgICAgICAgICAgICAgICBmb3IgKGNvbnN0IGkgb2YgZmFjdG9ycy5fYXJncykge1xuICAgICAgICAgICAgICAgICAgICBhcmdzLnB1c2goaS5hc19jb2VmZl9NdWwoKSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGNvbnN0IHRlbXAgPSBbXTtcbiAgICAgICAgICAgICAgICBmb3IgKGNvbnN0IFtjLCBtXSBvZiBhcmdzKSB7XG4gICAgICAgICAgICAgICAgICAgIHRlbXAucHVzaChbdGhpcy5fa2VlcF9jb2VmZihjLCBjb2VmZiksIG1dKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgYXJncyA9IHRlbXA7XG4gICAgICAgICAgICAgICAgZm9yIChjb25zdCBbY10gb2YgYXJncykge1xuICAgICAgICAgICAgICAgICAgICBpZiAoYy5pc19JbnRlZ2VyKCkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IHRlbXBhcmcgPSBbXTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGZvciAoY29uc3QgaSBvZiBhcmdzKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGlbMF0gPT09IDEpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGVtcGFyZy5wdXNoKGkuc2xpY2UoMCwgMSkpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuX2Zyb21fYXJncyhBZGQsIHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAuLi50aGlzLl9mcm9tX2FyZ3MoTXVsLCB1bmRlZmluZWQsIC4uLnRlbXBhcmcpKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIG5ldyBNdWwoZmFsc2UsIHRydWUsIGNvZWZmLCBmYWN0b3JzKTtcbiAgICAgICAgfSBlbHNlIGlmIChmYWN0b3JzLmlzX011bCgpKSB7XG4gICAgICAgICAgICBjb25zdCBtYXJnczogYW55W10gPSBmYWN0b3JzLl9hcmdzO1xuICAgICAgICAgICAgaWYgKG1hcmdzWzBdLmlzX051bWJlcigpKSB7XG4gICAgICAgICAgICAgICAgbWFyZ3NbMF0gPSBtYXJnc1swXS5fX211bF9fKGNvZWZmKTtcbiAgICAgICAgICAgICAgICBpZiAobWFyZ3NbMF0gPT09IDEpIHtcbiAgICAgICAgICAgICAgICAgICAgbWFyZ3Muc3BsaWNlKDIsIDEpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgbWFyZ3Muc3BsaWNlKDAsIDAsIGNvZWZmKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9mcm9tX2FyZ3MoTXVsLCB1bmRlZmluZWQsIC4uLm1hcmdzKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGxldCBtID0gY29lZmYuX19tdWxfXyhmYWN0b3JzKTtcbiAgICAgICAgICAgIGlmIChtLmlzX051bWJlcigpICYmICEoZmFjdG9ycy5pc19OdW1iZXIoKSkpIHtcbiAgICAgICAgICAgICAgICBtID0gdGhpcy5fZnJvbV9hcmdzKE11bCwgdW5kZWZpbmVkLCBjb2VmZiwgZmFjdG9ycyk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gbTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHN0YXRpYyBfbmV3KGV2YWx1YXRlOiBib29sZWFuLCBzaW1wbGlmeTogYm9vbGVhbiwgLi4uYXJnczogYW55KSB7XG4gICAgICAgIHJldHVybiBuZXcgTXVsKGV2YWx1YXRlLCBzaW1wbGlmeSwgLi4uYXJncyk7XG4gICAgfVxuXG5cbiAgICBfZXZhbF9pc19jb21tdXRhdGl2ZSgpIHtcbiAgICAgICAgY29uc3QgYWxsYXJncyA9IFtdO1xuICAgICAgICBmb3IgKGNvbnN0IGEgb2YgdGhpcy5fYXJncykge1xuICAgICAgICAgICAgYWxsYXJncy5wdXNoKGEuaXNfY29tbXV0YXRpdmUoKSk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIF9mdXp6eV9ncm91cHYyKGFsbGFyZ3MpO1xuICAgIH1cblxuICAgIC8vIFdCIGFkZGl0aW9uIGZvciBqYXNtaW5lIHRlc3RzXG4gICAgdG9TdHJpbmcoKSB7XG4gICAgICAgIGxldCByZXN1bHQgPSBcIlwiO1xuICAgICAgICBjb25zdCBudW1fYXJncyA9IHRoaXMuX2FyZ3MubGVuZ3RoXG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgbnVtX2FyZ3M7IGkrKykge1xuICAgICAgICAgICAgY29uc3QgYXJnID0gdGhpcy5fYXJnc1tpXTtcbiAgICAgICAgICAgIGxldCB0ZW1wO1xuICAgICAgICAgICAgaWYgKGkgIT0gbnVtX2FyZ3MgLSAxKSB7XG4gICAgICAgICAgICAgICAgdGVtcCA9IGFyZy50b1N0cmluZygpICsgXCIqXCJcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgdGVtcCA9IGFyZy50b1N0cmluZygpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmVzdWx0ID0gcmVzdWx0LmNvbmNhdCh0ZW1wKVxuICAgICAgICB9XG4gICAgXG4gICAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgfVxufVxuXG5NYW5hZ2VkUHJvcGVydGllcy5yZWdpc3RlcihNdWwpO1xuR2xvYmFsLnJlZ2lzdGVyKFwiTXVsXCIsIE11bC5fbmV3KTtcbiIsICIvKlxuQ2hhbmdlcyBtYWRlIChXQiBhbmQgR00pOlxuLSBBZGRlZCBjb25zdHJ1Y3RvciB0byBleHBsaWNpdGx5IGNhbGwgQXNzb2NPcCBzdXBlcmNsYXNzXG4tIEFkZGVkIFwic2ltcGxpZnlcIiBhcmd1bWVudCwgd2hpY2ggcHJldmVudHMgaW5maW5pdGUgcmVjdXJzaW9uIGluIEFzc29jT3Bcbi0gTm90ZTogT3JkZXIgb2JqZWN0cyBpbiBBZGQgYXJlIG5vdCB5ZXQgaW1wbGVtZW50ZWRcbiovXG5cbmltcG9ydCB7RXhwcn0gZnJvbSBcIi4vZXhwclwiO1xuaW1wb3J0IHtBc3NvY09wfSBmcm9tIFwiLi9vcGVyYXRpb25zXCI7XG5pbXBvcnQge2Jhc2UsIG1peCwgSGFzaERpY3R9IGZyb20gXCIuL3V0aWxpdHlcIjtcbmltcG9ydCB7U30gZnJvbSBcIi4vc2luZ2xldG9uXCI7XG5pbXBvcnQge0Jhc2ljfSBmcm9tIFwiLi9iYXNpY1wiO1xuaW1wb3J0IHtNYW5hZ2VkUHJvcGVydGllc30gZnJvbSBcIi4vYXNzdW1wdGlvbnNcIjtcbmltcG9ydCB7TXVsfSBmcm9tIFwiLi9tdWxcIjtcbmltcG9ydCB7R2xvYmFsfSBmcm9tIFwiLi9nbG9iYWxcIjtcbmltcG9ydCB7X2Z1enp5X2dyb3VwdjJ9IGZyb20gXCIuL2xvZ2ljXCI7XG5cbmZ1bmN0aW9uIF9hZGRzb3J0KGFyZ3M6IGFueVtdKSB7XG4gICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5ldy1jYXBcbiAgICBhcmdzLnNvcnQoKGEsIGIpID0+IEJhc2ljLmNtcChhLCBiKSk7XG59XG5cbmV4cG9ydCBjbGFzcyBBZGQgZXh0ZW5kcyBtaXgoYmFzZSkud2l0aChFeHByLCBBc3NvY09wKSB7XG4gICAgLypcbiAgICBcIlwiXCJcbiAgICBFeHByZXNzaW9uIHJlcHJlc2VudGluZyBhZGRpdGlvbiBvcGVyYXRpb24gZm9yIGFsZ2VicmFpYyBncm91cC5cbiAgICAuLiBkZXByZWNhdGVkOjogMS43XG4gICAgICAgVXNpbmcgYXJndW1lbnRzIHRoYXQgYXJlbid0IHN1YmNsYXNzZXMgb2YgOmNsYXNzOmB+LkV4cHJgIGluIGNvcmVcbiAgICAgICBvcGVyYXRvcnMgKDpjbGFzczpgfi5NdWxgLCA6Y2xhc3M6YH4uQWRkYCwgYW5kIDpjbGFzczpgfi5Qb3dgKSBpc1xuICAgICAgIGRlcHJlY2F0ZWQuIFNlZSA6cmVmOmBub24tZXhwci1hcmdzLWRlcHJlY2F0ZWRgIGZvciBkZXRhaWxzLlxuICAgIEV2ZXJ5IGFyZ3VtZW50IG9mIGBgQWRkKClgYCBtdXN0IGJlIGBgRXhwcmBgLiBJbmZpeCBvcGVyYXRvciBgYCtgYFxuICAgIG9uIG1vc3Qgc2NhbGFyIG9iamVjdHMgaW4gU3ltUHkgY2FsbHMgdGhpcyBjbGFzcy5cbiAgICBBbm90aGVyIHVzZSBvZiBgYEFkZCgpYGAgaXMgdG8gcmVwcmVzZW50IHRoZSBzdHJ1Y3R1cmUgb2YgYWJzdHJhY3RcbiAgICBhZGRpdGlvbiBzbyB0aGF0IGl0cyBhcmd1bWVudHMgY2FuIGJlIHN1YnN0aXR1dGVkIHRvIHJldHVybiBkaWZmZXJlbnRcbiAgICBjbGFzcy4gUmVmZXIgdG8gZXhhbXBsZXMgc2VjdGlvbiBmb3IgdGhpcy5cbiAgICBgYEFkZCgpYGAgZXZhbHVhdGVzIHRoZSBhcmd1bWVudCB1bmxlc3MgYGBldmFsdWF0ZT1GYWxzZWBgIGlzIHBhc3NlZC5cbiAgICBUaGUgZXZhbHVhdGlvbiBsb2dpYyBpbmNsdWRlczpcbiAgICAxLiBGbGF0dGVuaW5nXG4gICAgICAgIGBgQWRkKHgsIEFkZCh5LCB6KSlgYCAtPiBgYEFkZCh4LCB5LCB6KWBgXG4gICAgMi4gSWRlbnRpdHkgcmVtb3ZpbmdcbiAgICAgICAgYGBBZGQoeCwgMCwgeSlgYCAtPiBgYEFkZCh4LCB5KWBgXG4gICAgMy4gQ29lZmZpY2llbnQgY29sbGVjdGluZyBieSBgYC5hc19jb2VmZl9NdWwoKWBgXG4gICAgICAgIGBgQWRkKHgsIDIqeClgYCAtPiBgYE11bCgzLCB4KWBgXG4gICAgNC4gVGVybSBzb3J0aW5nXG4gICAgICAgIGBgQWRkKHksIHgsIDIpYGAgLT4gYGBBZGQoMiwgeCwgeSlgYFxuICAgIElmIG5vIGFyZ3VtZW50IGlzIHBhc3NlZCwgaWRlbnRpdHkgZWxlbWVudCAwIGlzIHJldHVybmVkLiBJZiBzaW5nbGVcbiAgICBlbGVtZW50IGlzIHBhc3NlZCwgdGhhdCBlbGVtZW50IGlzIHJldHVybmVkLlxuICAgIE5vdGUgdGhhdCBgYEFkZCgqYXJncylgYCBpcyBtb3JlIGVmZmljaWVudCB0aGFuIGBgc3VtKGFyZ3MpYGAgYmVjYXVzZVxuICAgIGl0IGZsYXR0ZW5zIHRoZSBhcmd1bWVudHMuIGBgc3VtKGEsIGIsIGMsIC4uLilgYCByZWN1cnNpdmVseSBhZGRzIHRoZVxuICAgIGFyZ3VtZW50cyBhcyBgYGEgKyAoYiArIChjICsgLi4uKSlgYCwgd2hpY2ggaGFzIHF1YWRyYXRpYyBjb21wbGV4aXR5LlxuICAgIE9uIHRoZSBvdGhlciBoYW5kLCBgYEFkZChhLCBiLCBjLCBkKWBgIGRvZXMgbm90IGFzc3VtZSBuZXN0ZWRcbiAgICBzdHJ1Y3R1cmUsIG1ha2luZyB0aGUgY29tcGxleGl0eSBsaW5lYXIuXG4gICAgU2luY2UgYWRkaXRpb24gaXMgZ3JvdXAgb3BlcmF0aW9uLCBldmVyeSBhcmd1bWVudCBzaG91bGQgaGF2ZSB0aGVcbiAgICBzYW1lIDpvYmo6YHN5bXB5LmNvcmUua2luZC5LaW5kKClgLlxuICAgIEV4YW1wbGVzXG4gICAgPT09PT09PT1cbiAgICA+Pj4gZnJvbSBzeW1weSBpbXBvcnQgQWRkLCBJXG4gICAgPj4+IGZyb20gc3ltcHkuYWJjIGltcG9ydCB4LCB5XG4gICAgPj4+IEFkZCh4LCAxKVxuICAgIHggKyAxXG4gICAgPj4+IEFkZCh4LCB4KVxuICAgIDIqeFxuICAgID4+PiAyKngqKjIgKyAzKnggKyBJKnkgKyAyKnkgKyAyKngvNSArIDEuMCp5ICsgMVxuICAgIDIqeCoqMiArIDE3KngvNSArIDMuMCp5ICsgSSp5ICsgMVxuICAgIElmIGBgZXZhbHVhdGU9RmFsc2VgYCBpcyBwYXNzZWQsIHJlc3VsdCBpcyBub3QgZXZhbHVhdGVkLlxuICAgID4+PiBBZGQoMSwgMiwgZXZhbHVhdGU9RmFsc2UpXG4gICAgMSArIDJcbiAgICA+Pj4gQWRkKHgsIHgsIGV2YWx1YXRlPUZhbHNlKVxuICAgIHggKyB4XG4gICAgYGBBZGQoKWBgIGFsc28gcmVwcmVzZW50cyB0aGUgZ2VuZXJhbCBzdHJ1Y3R1cmUgb2YgYWRkaXRpb24gb3BlcmF0aW9uLlxuICAgID4+PiBmcm9tIHN5bXB5IGltcG9ydCBNYXRyaXhTeW1ib2xcbiAgICA+Pj4gQSxCID0gTWF0cml4U3ltYm9sKCdBJywgMiwyKSwgTWF0cml4U3ltYm9sKCdCJywgMiwyKVxuICAgID4+PiBleHByID0gQWRkKHgseSkuc3Vicyh7eDpBLCB5OkJ9KVxuICAgID4+PiBleHByXG4gICAgQSArIEJcbiAgICA+Pj4gdHlwZShleHByKVxuICAgIDxjbGFzcyAnc3ltcHkubWF0cmljZXMuZXhwcmVzc2lvbnMubWF0YWRkLk1hdEFkZCc+XG4gICAgTm90ZSB0aGF0IHRoZSBwcmludGVycyBkbyBub3QgZGlzcGxheSBpbiBhcmdzIG9yZGVyLlxuICAgID4+PiBBZGQoeCwgMSlcbiAgICB4ICsgMVxuICAgID4+PiBBZGQoeCwgMSkuYXJnc1xuICAgICgxLCB4KVxuICAgIFNlZSBBbHNvXG4gICAgPT09PT09PT1cbiAgICBNYXRBZGRcbiAgICBcIlwiXCJcbiAgICAqL1xuXG4gICAgX19zbG90c19fOiBhbnlbXSA9IFtdO1xuICAgIGFyZ3M6IGFueVtdO1xuICAgIHN0YXRpYyBpc19BZGQ6IGFueSA9IHRydWU7IFxuICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBuZXctY2FwXG4gICAgc3RhdGljIF9hcmdzX3R5cGUgPSBFeHByKE9iamVjdCk7XG4gICAgc3RhdGljIGlkZW50aXR5ID0gUy5aZXJvOyAvLyAhISEgdW5zdXJlIGFidCB0aGlzXG5cbiAgICBjb25zdHJ1Y3RvcihldmFsdWF0ZTogYm9vbGVhbiwgc2ltcGxpZnk6IGJvb2xlYW4sIC4uLmFyZ3M6IGFueSkge1xuICAgICAgICBzdXBlcihBZGQsIGV2YWx1YXRlLCBzaW1wbGlmeSwgLi4uYXJncyk7XG4gICAgfVxuXG4gICAgZmxhdHRlbihzZXE6IGFueVtdKSB7XG4gICAgICAgIC8qXG4gICAgICAgIFRha2VzIHRoZSBzZXF1ZW5jZSBcInNlcVwiIG9mIG5lc3RlZCBBZGRzIGFuZCByZXR1cm5zIGEgZmxhdHRlbiBsaXN0LlxuICAgICAgICBSZXR1cm5zOiAoY29tbXV0YXRpdmVfcGFydCwgbm9uY29tbXV0YXRpdmVfcGFydCwgb3JkZXJfc3ltYm9scylcbiAgICAgICAgQXBwbGllcyBhc3NvY2lhdGl2aXR5LCBhbGwgdGVybXMgYXJlIGNvbW11dGFibGUgd2l0aCByZXNwZWN0IHRvXG4gICAgICAgIGFkZGl0aW9uLlxuICAgICAgICBOQjogdGhlIHJlbW92YWwgb2YgMCBpcyBhbHJlYWR5IGhhbmRsZWQgYnkgQXNzb2NPcC5fX25ld19fXG4gICAgICAgIFNlZSBhbHNvXG4gICAgICAgID09PT09PT09XG4gICAgICAgIHN5bXB5LmNvcmUubXVsLk11bC5mbGF0dGVuXG4gICAgICAgICovXG4gICAgICAgIGxldCBydiA9IHVuZGVmaW5lZDtcbiAgICAgICAgaWYgKHNlcS5sZW5ndGggPT09IDIpIHtcbiAgICAgICAgICAgIGxldCBbYSwgYl0gPSBzZXE7XG4gICAgICAgICAgICBpZiAoYi5pc19SYXRpb25hbCgpKSB7XG4gICAgICAgICAgICAgICAgW2EsIGJdID0gW2IsIGFdO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKGEuaXNfUmF0aW9uYWwoKSkge1xuICAgICAgICAgICAgICAgIGlmIChiLmlzX011bCgpKSB7XG4gICAgICAgICAgICAgICAgICAgIHJ2ID0gW1thLCBiXSwgW10sIHVuZGVmaW5lZF07XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKHJ2KSB7XG4gICAgICAgICAgICAgICAgbGV0IGFsbGMgPSB0cnVlO1xuICAgICAgICAgICAgICAgIGZvciAoY29uc3QgcyBvZiBydlswXSkge1xuICAgICAgICAgICAgICAgICAgICBpZiAocy5pc19jb21tdXRhdGl2ZSgpID09PSBmYWxzZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgYWxsYyA9IGZhbHNlO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGlmIChhbGxjKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBydjtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gW1tdLCBydlswXSwgdW5kZWZpbmVkXTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgY29uc3QgdGVybXM6IEhhc2hEaWN0ID0gbmV3IEhhc2hEaWN0KCk7XG4gICAgICAgIGxldCBjb2VmZiA9IFMuWmVybztcbiAgICAgICAgY29uc3QgZXh0cmE6IGFueVtdID0gW107XG4gICAgICAgIGZvciAoY29uc3QgbyBvZiBzZXEpIHtcbiAgICAgICAgICAgIGxldCBjO1xuICAgICAgICAgICAgbGV0IHM7XG4gICAgICAgICAgICBpZiAoby5pc19OdW1iZXIoKSkge1xuICAgICAgICAgICAgICAgIGlmICgobyA9PT0gUy5OYU4gfHwgKGNvZWZmID09PSBTLkNvbXBsZXhJbmZpbml0eSAmJiBvLmlzX2Zpbml0ZSgpID09PSBmYWxzZSkpKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBbW1MuTmFOXSwgW10sIHVuZGVmaW5lZF07XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGlmIChjb2VmZi5pc19OdW1iZXIoKSkge1xuICAgICAgICAgICAgICAgICAgICBjb2VmZiA9IGNvZWZmLl9fYWRkX18obyk7XG4gICAgICAgICAgICAgICAgICAgIGlmIChjb2VmZiA9PT0gUy5OYU4gfHwgIWV4dHJhKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gW1tTLk5hTl0sIFtdLCB1bmRlZmluZWRdO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgICAgfSBlbHNlIGlmIChvID09PSBTLkNvbXBsZXhJbmZpbml0eSkge1xuICAgICAgICAgICAgICAgIGlmIChjb2VmZi5pc19maW5pdGUoKSA9PT0gZmFsc2UpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFtbUy5OYU5dLCBbXSwgdW5kZWZpbmVkXTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgY29lZmYgPSBTLkNvbXBsZXhJbmZpbml0eTtcbiAgICAgICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoby5pc19BZGQoKSkge1xuICAgICAgICAgICAgICAgIHNlcS5wdXNoKC4uLm8uX2FyZ3MpO1xuICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgICAgfSBlbHNlIGlmIChvLmlzX011bCgpKSB7XG4gICAgICAgICAgICAgICAgW2MsIHNdID0gby5hc19jb2VmZl9NdWwoKTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoby5pc19Qb3coKSkge1xuICAgICAgICAgICAgICAgIGNvbnN0IHBhaXIgPSBvLmFzX2Jhc2VfZXhwKCk7XG4gICAgICAgICAgICAgICAgY29uc3QgYiA9IHBhaXJbMF07XG4gICAgICAgICAgICAgICAgY29uc3QgZSA9IHBhaXJbMV07XG4gICAgICAgICAgICAgICAgaWYgKGIuaXNfTnVtYmVyKCkgJiYgKGUuaXNfSW50ZWdlcigpIHx8IChlLmlzX1JhdGlvbmFsKCkgJiYgZS5pc19uZWdhdGl2ZSgpKSkpIHtcbiAgICAgICAgICAgICAgICAgICAgc2VxLnB1c2goYi5fZXZhbF9wb3dlcihlKSk7XG4gICAgICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBbYywgc10gPSBbUy5PbmUsIG9dO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBjID0gUy5PbmU7XG4gICAgICAgICAgICAgICAgcyA9IG87XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAodGVybXMuaGFzKHMpKSB7XG4gICAgICAgICAgICAgICAgdGVybXMuYWRkKHMsIHRlcm1zLmdldChzKS5fX2FkZF9fKGMpKTtcbiAgICAgICAgICAgICAgICBpZiAodGVybXMuZ2V0KHMpID09PSBTLk5hTikge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gW1tTLk5hTl0sIFtdLCB1bmRlZmluZWRdO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgdGVybXMuYWRkKHMsIGMpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGxldCBuZXdzZXE6IGFueVtdID0gW107XG4gICAgICAgIGxldCBub25jb21tdXRhdGl2ZTogYm9vbGVhbiA9IGZhbHNlO1xuICAgICAgICBmb3IgKGNvbnN0IGl0ZW0gb2YgdGVybXMuZW50cmllcygpKSB7XG4gICAgICAgICAgICBjb25zdCBzOiBhbnkgPSBpdGVtWzBdO1xuICAgICAgICAgICAgY29uc3QgYzogYW55ID0gaXRlbVsxXTtcbiAgICAgICAgICAgIGlmIChjLmlzX3plcm8oKSkge1xuICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgICAgfSBlbHNlIGlmIChjID09PSBTLk9uZSkge1xuICAgICAgICAgICAgICAgIG5ld3NlcS5wdXNoKHMpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBpZiAocy5pc19NdWwoKSkge1xuICAgICAgICAgICAgICAgICAgICBjb25zdCBjcyA9IHMuX25ld19yYXdhcmdzKHRydWUsIC4uLltjXS5jb25jYXQocy5fYXJncykpO1xuICAgICAgICAgICAgICAgICAgICBuZXdzZXEucHVzaChjcyk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmIChzLmlzX0FkZCgpKSB7XG4gICAgICAgICAgICAgICAgICAgIG5ld3NlcS5wdXNoKG5ldyBNdWwoZmFsc2UsIHRydWUsIGMsIHMpKTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBuZXdzZXEucHVzaChuZXcgTXVsKHRydWUsIHRydWUsIGMsIHMpKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBub25jb21tdXRhdGl2ZSA9IG5vbmNvbW11dGF0aXZlIHx8ICEocy5pc19jb21tdXRhdGl2ZSgpKTtcbiAgICAgICAgfVxuICAgICAgICBjb25zdCB0ZW1wID0gW107XG4gICAgICAgIGlmIChjb2VmZiA9PT0gUy5JbmZpbml0eSkge1xuICAgICAgICAgICAgZm9yIChjb25zdCBmIG9mIG5ld3NlcSkge1xuICAgICAgICAgICAgICAgIGlmICghKGYuaXNfZXh0ZW5kZWRfbm9ubmVnYXRpdmUoKSkpIHtcbiAgICAgICAgICAgICAgICAgICAgdGVtcC5wdXNoKGYpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIG5ld3NlcSA9IHRlbXA7XG4gICAgICAgIH0gZWxzZSBpZiAoY29lZmYgPT09IFMuTmVnYXRpdmVJbmZpbml0eSkge1xuICAgICAgICAgICAgZm9yIChjb25zdCBmIG9mIG5ld3NlcSkge1xuICAgICAgICAgICAgICAgIGlmICghKGYuaXNfZXh0ZW5kZWRfbm9ucG9zaXRpdmUoKSkpIHtcbiAgICAgICAgICAgICAgICAgICAgdGVtcC5wdXNoKGYpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIG5ld3NlcSA9IHRlbXA7XG4gICAgICAgIH1cbiAgICAgICAgY29uc3QgdGVtcDIgPSBbXTtcbiAgICAgICAgaWYgKGNvZWZmID09PSBTLkNvbXBsZXhJbmZpbml0eSkge1xuICAgICAgICAgICAgZm9yIChjb25zdCBjIG9mIG5ld3NlcSkge1xuICAgICAgICAgICAgICAgIGlmICghKGMuaXNfZmluaXRlKCkgfHwgYy5pc19leHRlbmRlZF9yZWFsKCkgIT09IFwidW5kZWZpbmVkXCIpKSB7XG4gICAgICAgICAgICAgICAgICAgIHRlbXAyLnB1c2goYyk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgbmV3c2VxID0gdGVtcDI7XG4gICAgICAgIH1cbiAgICAgICAgX2FkZHNvcnQobmV3c2VxKTtcbiAgICAgICAgaWYgKGNvZWZmICE9PSBTLlplcm8pIHtcbiAgICAgICAgICAgIG5ld3NlcS5zcGxpY2UoMCwgMCwgY29lZmYpO1xuICAgICAgICB9XG4gICAgICAgIGlmIChub25jb21tdXRhdGl2ZSkge1xuICAgICAgICAgICAgcmV0dXJuIFtbXSwgbmV3c2VxLCB1bmRlZmluZWRdO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuIFtuZXdzZXEsIFtdLCB1bmRlZmluZWRdO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgX2V2YWxfaXNfY29tbXV0YXRpdmUoKSB7XG4gICAgICAgIGNvbnN0IGZ1enp5YXJnID0gW107XG4gICAgICAgIGZvciAoY29uc3QgYSBvZiB0aGlzLl9hcmdzKSB7XG4gICAgICAgICAgICBmdXp6eWFyZy5wdXNoKGEuaXNfY29tbXV0YXRpdmUoKSk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIF9mdXp6eV9ncm91cHYyKGZ1enp5YXJnKTtcbiAgICB9XG5cbiAgICBhc19jb2VmZl9BZGQoKSB7XG4gICAgICAgIGNvbnN0IFtjb2VmZiwgYXJnc10gPSBbdGhpcy5hcmdzWzBdLCB0aGlzLmFyZ3Muc2xpY2UoMSldO1xuICAgICAgICBpZiAoY29lZmYuaXNfTnVtYmVyKCkgJiYgY29lZmYuaXNfUmF0aW9uYWwoKSkge1xuICAgICAgICAgICAgcmV0dXJuIFtjb2VmZiwgdGhpcy5fbmV3X3Jhd2FyZ3ModHJ1ZSwgLi4uYXJncyldO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBbUy5aZXJvLCB0aGlzXTtcbiAgICB9XG5cbiAgICBzdGF0aWMgX25ldyhldmFsdWF0ZTogYm9vbGVhbiwgc2ltcGxpZnk6IGJvb2xlYW4sIC4uLmFyZ3M6IGFueSkge1xuICAgICAgICByZXR1cm4gbmV3IEFkZChldmFsdWF0ZSwgc2ltcGxpZnksIC4uLmFyZ3MpO1xuICAgIH1cblxuICAgIC8vIFdCIGFkZGl0aW9uIGZvciBqYXNtaW5lIHRlc3RzXG4gICAgdG9TdHJpbmcoKSB7XG4gICAgICAgIGxldCByZXN1bHQgPSBcIlwiO1xuICAgICAgICBjb25zdCBudW1fYXJncyA9IHRoaXMuX2FyZ3MubGVuZ3RoXG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgbnVtX2FyZ3M7IGkrKykge1xuICAgICAgICAgICAgY29uc3QgYXJnID0gdGhpcy5fYXJnc1tpXTtcbiAgICAgICAgICAgIGxldCB0ZW1wO1xuICAgICAgICAgICAgaWYgKGkgIT0gbnVtX2FyZ3MgLSAxKSB7XG4gICAgICAgICAgICAgICAgdGVtcCA9IGFyZy50b1N0cmluZygpICsgXCIgKyBcIlxuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICB0ZW1wID0gYXJnLnRvU3RyaW5nKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXN1bHQgPSByZXN1bHQuY29uY2F0KHRlbXApXG4gICAgICAgIH1cbiBcbiAgICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICB9XG59XG5cbk1hbmFnZWRQcm9wZXJ0aWVzLnJlZ2lzdGVyKEFkZCk7XG5HbG9iYWwucmVnaXN0ZXIoXCJBZGRcIiwgQWRkLl9uZXcpO1xuIiwgIi8qIVxyXG4gKiAgZGVjaW1hbC5qcyB2MTAuNC4zXHJcbiAqICBBbiBhcmJpdHJhcnktcHJlY2lzaW9uIERlY2ltYWwgdHlwZSBmb3IgSmF2YVNjcmlwdC5cclxuICogIGh0dHBzOi8vZ2l0aHViLmNvbS9NaWtlTWNsL2RlY2ltYWwuanNcclxuICogIENvcHlyaWdodCAoYykgMjAyMiBNaWNoYWVsIE1jbGF1Z2hsaW4gPE04Y2g4OGxAZ21haWwuY29tPlxyXG4gKiAgTUlUIExpY2VuY2VcclxuICovXHJcblxyXG5cclxuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0gIEVESVRBQkxFIERFRkFVTFRTICAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0gLy9cclxuXHJcblxyXG4gIC8vIFRoZSBtYXhpbXVtIGV4cG9uZW50IG1hZ25pdHVkZS5cclxuICAvLyBUaGUgbGltaXQgb24gdGhlIHZhbHVlIG9mIGB0b0V4cE5lZ2AsIGB0b0V4cFBvc2AsIGBtaW5FYCBhbmQgYG1heEVgLlxyXG52YXIgRVhQX0xJTUlUID0gOWUxNSwgICAgICAgICAgICAgICAgICAgICAgLy8gMCB0byA5ZTE1XHJcblxyXG4gIC8vIFRoZSBsaW1pdCBvbiB0aGUgdmFsdWUgb2YgYHByZWNpc2lvbmAsIGFuZCBvbiB0aGUgdmFsdWUgb2YgdGhlIGZpcnN0IGFyZ3VtZW50IHRvXHJcbiAgLy8gYHRvRGVjaW1hbFBsYWNlc2AsIGB0b0V4cG9uZW50aWFsYCwgYHRvRml4ZWRgLCBgdG9QcmVjaXNpb25gIGFuZCBgdG9TaWduaWZpY2FudERpZ2l0c2AuXHJcbiAgTUFYX0RJR0lUUyA9IDFlOSwgICAgICAgICAgICAgICAgICAgICAgICAvLyAwIHRvIDFlOVxyXG5cclxuICAvLyBCYXNlIGNvbnZlcnNpb24gYWxwaGFiZXQuXHJcbiAgTlVNRVJBTFMgPSAnMDEyMzQ1Njc4OWFiY2RlZicsXHJcblxyXG4gIC8vIFRoZSBuYXR1cmFsIGxvZ2FyaXRobSBvZiAxMCAoMTAyNSBkaWdpdHMpLlxyXG4gIExOMTAgPSAnMi4zMDI1ODUwOTI5OTQwNDU2ODQwMTc5OTE0NTQ2ODQzNjQyMDc2MDExMDE0ODg2Mjg3NzI5NzYwMzMzMjc5MDA5Njc1NzI2MDk2NzczNTI0ODAyMzU5OTcyMDUwODk1OTgyOTgzNDE5Njc3ODQwNDIyODYyNDg2MzM0MDk1MjU0NjUwODI4MDY3NTY2NjYyODczNjkwOTg3ODE2ODk0ODI5MDcyMDgzMjU1NTQ2ODA4NDM3OTk4OTQ4MjYyMzMxOTg1MjgzOTM1MDUzMDg5NjUzNzc3MzI2Mjg4NDYxNjMzNjYyMjIyODc2OTgyMTk4ODY3NDY1NDM2Njc0NzQ0MDQyNDMyNzQzNjUxNTUwNDg5MzQzMTQ5MzkzOTE0Nzk2MTk0MDQ0MDAyMjIxMDUxMDE3MTQxNzQ4MDAzNjg4MDg0MDEyNjQ3MDgwNjg1NTY3NzQzMjE2MjI4MzU1MjIwMTE0ODA0NjYzNzE1NjU5MTIxMzczNDUwNzQ3ODU2OTQ3NjgzNDYzNjE2NzkyMTAxODA2NDQ1MDcwNjQ4MDAwMjc3NTAyNjg0OTE2NzQ2NTUwNTg2ODU2OTM1NjczNDIwNjcwNTgxMTM2NDI5MjI0NTU0NDA1NzU4OTI1NzI0MjA4MjQxMzE0Njk1Njg5MDE2NzU4OTQwMjU2Nzc2MzExMzU2OTE5MjkyMDMzMzc2NTg3MTQxNjYwMjMwMTA1NzAzMDg5NjM0NTcyMDc1NDQwMzcwODQ3NDY5OTQwMTY4MjY5MjgyODA4NDgxMTg0Mjg5MzE0ODQ4NTI0OTQ4NjQ0ODcxOTI3ODA5Njc2MjcxMjc1Nzc1Mzk3MDI3NjY4NjA1OTUyNDk2NzE2Njc0MTgzNDg1NzA0NDIyNTA3MTk3OTY1MDA0NzE0OTUxMDUwNDkyMjE0Nzc2NTY3NjM2OTM4NjYyOTc2OTc5NTIyMTEwNzE4MjY0NTQ5NzM0NzcyNjYyNDI1NzA5NDI5MzIyNTgyNzk4NTAyNTg1NTA5Nzg1MjY1MzgzMjA3NjA2NzI2MzE3MTY0MzA5NTA1OTk1MDg3ODA3NTIzNzEwMzMzMTAxMTk3ODU3NTQ3MzMxNTQxNDIxODA4NDI3NTQzODYzNTkxNzc4MTE3MDU0MzA5ODI3NDgyMzg1MDQ1NjQ4MDE5MDk1NjEwMjk5MjkxODI0MzE4MjM3NTI1MzU3NzA5NzUwNTM5NTY1MTg3Njk3NTEwMzc0OTcwODg4NjkyMTgwMjA1MTg5MzM5NTA3MjM4NTM5MjA1MTQ0NjM0MTk3MjY1Mjg3Mjg2OTY1MTEwODYyNTcxNDkyMTk4ODQ5OTc4NzQ4ODczNzcxMzQ1Njg2MjA5MTY3MDU4JyxcclxuXHJcbiAgLy8gUGkgKDEwMjUgZGlnaXRzKS5cclxuICBQSSA9ICczLjE0MTU5MjY1MzU4OTc5MzIzODQ2MjY0MzM4MzI3OTUwMjg4NDE5NzE2OTM5OTM3NTEwNTgyMDk3NDk0NDU5MjMwNzgxNjQwNjI4NjIwODk5ODYyODAzNDgyNTM0MjExNzA2Nzk4MjE0ODA4NjUxMzI4MjMwNjY0NzA5Mzg0NDYwOTU1MDU4MjIzMTcyNTM1OTQwODEyODQ4MTExNzQ1MDI4NDEwMjcwMTkzODUyMTEwNTU1OTY0NDYyMjk0ODk1NDkzMDM4MTk2NDQyODgxMDk3NTY2NTkzMzQ0NjEyODQ3NTY0ODIzMzc4Njc4MzE2NTI3MTIwMTkwOTE0NTY0ODU2NjkyMzQ2MDM0ODYxMDQ1NDMyNjY0ODIxMzM5MzYwNzI2MDI0OTE0MTI3MzcyNDU4NzAwNjYwNjMxNTU4ODE3NDg4MTUyMDkyMDk2MjgyOTI1NDA5MTcxNTM2NDM2Nzg5MjU5MDM2MDAxMTMzMDUzMDU0ODgyMDQ2NjUyMTM4NDE0Njk1MTk0MTUxMTYwOTQzMzA1NzI3MDM2NTc1OTU5MTk1MzA5MjE4NjExNzM4MTkzMjYxMTc5MzEwNTExODU0ODA3NDQ2MjM3OTk2Mjc0OTU2NzM1MTg4NTc1MjcyNDg5MTIyNzkzODE4MzAxMTk0OTEyOTgzMzY3MzM2MjQ0MDY1NjY0MzA4NjAyMTM5NDk0NjM5NTIyNDczNzE5MDcwMjE3OTg2MDk0MzcwMjc3MDUzOTIxNzE3NjI5MzE3Njc1MjM4NDY3NDgxODQ2NzY2OTQwNTEzMjAwMDU2ODEyNzE0NTI2MzU2MDgyNzc4NTc3MTM0Mjc1Nzc4OTYwOTE3MzYzNzE3ODcyMTQ2ODQ0MDkwMTIyNDk1MzQzMDE0NjU0OTU4NTM3MTA1MDc5MjI3OTY4OTI1ODkyMzU0MjAxOTk1NjExMjEyOTAyMTk2MDg2NDAzNDQxODE1OTgxMzYyOTc3NDc3MTMwOTk2MDUxODcwNzIxMTM0OTk5OTk5ODM3Mjk3ODA0OTk1MTA1OTczMTczMjgxNjA5NjMxODU5NTAyNDQ1OTQ1NTM0NjkwODMwMjY0MjUyMjMwODI1MzM0NDY4NTAzNTI2MTkzMTE4ODE3MTAxMDAwMzEzNzgzODc1Mjg4NjU4NzUzMzIwODM4MTQyMDYxNzE3NzY2OTE0NzMwMzU5ODI1MzQ5MDQyODc1NTQ2ODczMTE1OTU2Mjg2Mzg4MjM1Mzc4NzU5Mzc1MTk1Nzc4MTg1Nzc4MDUzMjE3MTIyNjgwNjYxMzAwMTkyNzg3NjYxMTE5NTkwOTIxNjQyMDE5ODkzODA5NTI1NzIwMTA2NTQ4NTg2MzI3ODknLFxyXG5cclxuXHJcbiAgLy8gVGhlIGluaXRpYWwgY29uZmlndXJhdGlvbiBwcm9wZXJ0aWVzIG9mIHRoZSBEZWNpbWFsIGNvbnN0cnVjdG9yLlxyXG4gIERFRkFVTFRTID0ge1xyXG5cclxuICAgIC8vIFRoZXNlIHZhbHVlcyBtdXN0IGJlIGludGVnZXJzIHdpdGhpbiB0aGUgc3RhdGVkIHJhbmdlcyAoaW5jbHVzaXZlKS5cclxuICAgIC8vIE1vc3Qgb2YgdGhlc2UgdmFsdWVzIGNhbiBiZSBjaGFuZ2VkIGF0IHJ1bi10aW1lIHVzaW5nIHRoZSBgRGVjaW1hbC5jb25maWdgIG1ldGhvZC5cclxuXHJcbiAgICAvLyBUaGUgbWF4aW11bSBudW1iZXIgb2Ygc2lnbmlmaWNhbnQgZGlnaXRzIG9mIHRoZSByZXN1bHQgb2YgYSBjYWxjdWxhdGlvbiBvciBiYXNlIGNvbnZlcnNpb24uXHJcbiAgICAvLyBFLmcuIGBEZWNpbWFsLmNvbmZpZyh7IHByZWNpc2lvbjogMjAgfSk7YFxyXG4gICAgcHJlY2lzaW9uOiAyMCwgICAgICAgICAgICAgICAgICAgICAgICAgLy8gMSB0byBNQVhfRElHSVRTXHJcblxyXG4gICAgLy8gVGhlIHJvdW5kaW5nIG1vZGUgdXNlZCB3aGVuIHJvdW5kaW5nIHRvIGBwcmVjaXNpb25gLlxyXG4gICAgLy9cclxuICAgIC8vIFJPVU5EX1VQICAgICAgICAgMCBBd2F5IGZyb20gemVyby5cclxuICAgIC8vIFJPVU5EX0RPV04gICAgICAgMSBUb3dhcmRzIHplcm8uXHJcbiAgICAvLyBST1VORF9DRUlMICAgICAgIDIgVG93YXJkcyArSW5maW5pdHkuXHJcbiAgICAvLyBST1VORF9GTE9PUiAgICAgIDMgVG93YXJkcyAtSW5maW5pdHkuXHJcbiAgICAvLyBST1VORF9IQUxGX1VQICAgIDQgVG93YXJkcyBuZWFyZXN0IG5laWdoYm91ci4gSWYgZXF1aWRpc3RhbnQsIHVwLlxyXG4gICAgLy8gUk9VTkRfSEFMRl9ET1dOICA1IFRvd2FyZHMgbmVhcmVzdCBuZWlnaGJvdXIuIElmIGVxdWlkaXN0YW50LCBkb3duLlxyXG4gICAgLy8gUk9VTkRfSEFMRl9FVkVOICA2IFRvd2FyZHMgbmVhcmVzdCBuZWlnaGJvdXIuIElmIGVxdWlkaXN0YW50LCB0b3dhcmRzIGV2ZW4gbmVpZ2hib3VyLlxyXG4gICAgLy8gUk9VTkRfSEFMRl9DRUlMICA3IFRvd2FyZHMgbmVhcmVzdCBuZWlnaGJvdXIuIElmIGVxdWlkaXN0YW50LCB0b3dhcmRzICtJbmZpbml0eS5cclxuICAgIC8vIFJPVU5EX0hBTEZfRkxPT1IgOCBUb3dhcmRzIG5lYXJlc3QgbmVpZ2hib3VyLiBJZiBlcXVpZGlzdGFudCwgdG93YXJkcyAtSW5maW5pdHkuXHJcbiAgICAvL1xyXG4gICAgLy8gRS5nLlxyXG4gICAgLy8gYERlY2ltYWwucm91bmRpbmcgPSA0O2BcclxuICAgIC8vIGBEZWNpbWFsLnJvdW5kaW5nID0gRGVjaW1hbC5ST1VORF9IQUxGX1VQO2BcclxuICAgIHJvdW5kaW5nOiA0LCAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIDAgdG8gOFxyXG5cclxuICAgIC8vIFRoZSBtb2R1bG8gbW9kZSB1c2VkIHdoZW4gY2FsY3VsYXRpbmcgdGhlIG1vZHVsdXM6IGEgbW9kIG4uXHJcbiAgICAvLyBUaGUgcXVvdGllbnQgKHEgPSBhIC8gbikgaXMgY2FsY3VsYXRlZCBhY2NvcmRpbmcgdG8gdGhlIGNvcnJlc3BvbmRpbmcgcm91bmRpbmcgbW9kZS5cclxuICAgIC8vIFRoZSByZW1haW5kZXIgKHIpIGlzIGNhbGN1bGF0ZWQgYXM6IHIgPSBhIC0gbiAqIHEuXHJcbiAgICAvL1xyXG4gICAgLy8gVVAgICAgICAgICAwIFRoZSByZW1haW5kZXIgaXMgcG9zaXRpdmUgaWYgdGhlIGRpdmlkZW5kIGlzIG5lZ2F0aXZlLCBlbHNlIGlzIG5lZ2F0aXZlLlxyXG4gICAgLy8gRE9XTiAgICAgICAxIFRoZSByZW1haW5kZXIgaGFzIHRoZSBzYW1lIHNpZ24gYXMgdGhlIGRpdmlkZW5kIChKYXZhU2NyaXB0ICUpLlxyXG4gICAgLy8gRkxPT1IgICAgICAzIFRoZSByZW1haW5kZXIgaGFzIHRoZSBzYW1lIHNpZ24gYXMgdGhlIGRpdmlzb3IgKFB5dGhvbiAlKS5cclxuICAgIC8vIEhBTEZfRVZFTiAgNiBUaGUgSUVFRSA3NTQgcmVtYWluZGVyIGZ1bmN0aW9uLlxyXG4gICAgLy8gRVVDTElEICAgICA5IEV1Y2xpZGlhbiBkaXZpc2lvbi4gcSA9IHNpZ24obikgKiBmbG9vcihhIC8gYWJzKG4pKS4gQWx3YXlzIHBvc2l0aXZlLlxyXG4gICAgLy9cclxuICAgIC8vIFRydW5jYXRlZCBkaXZpc2lvbiAoMSksIGZsb29yZWQgZGl2aXNpb24gKDMpLCB0aGUgSUVFRSA3NTQgcmVtYWluZGVyICg2KSwgYW5kIEV1Y2xpZGlhblxyXG4gICAgLy8gZGl2aXNpb24gKDkpIGFyZSBjb21tb25seSB1c2VkIGZvciB0aGUgbW9kdWx1cyBvcGVyYXRpb24uIFRoZSBvdGhlciByb3VuZGluZyBtb2RlcyBjYW4gYWxzb1xyXG4gICAgLy8gYmUgdXNlZCwgYnV0IHRoZXkgbWF5IG5vdCBnaXZlIHVzZWZ1bCByZXN1bHRzLlxyXG4gICAgbW9kdWxvOiAxLCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gMCB0byA5XHJcblxyXG4gICAgLy8gVGhlIGV4cG9uZW50IHZhbHVlIGF0IGFuZCBiZW5lYXRoIHdoaWNoIGB0b1N0cmluZ2AgcmV0dXJucyBleHBvbmVudGlhbCBub3RhdGlvbi5cclxuICAgIC8vIEphdmFTY3JpcHQgbnVtYmVyczogLTdcclxuICAgIHRvRXhwTmVnOiAtNywgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIDAgdG8gLUVYUF9MSU1JVFxyXG5cclxuICAgIC8vIFRoZSBleHBvbmVudCB2YWx1ZSBhdCBhbmQgYWJvdmUgd2hpY2ggYHRvU3RyaW5nYCByZXR1cm5zIGV4cG9uZW50aWFsIG5vdGF0aW9uLlxyXG4gICAgLy8gSmF2YVNjcmlwdCBudW1iZXJzOiAyMVxyXG4gICAgdG9FeHBQb3M6ICAyMSwgICAgICAgICAgICAgICAgICAgICAgICAgLy8gMCB0byBFWFBfTElNSVRcclxuXHJcbiAgICAvLyBUaGUgbWluaW11bSBleHBvbmVudCB2YWx1ZSwgYmVuZWF0aCB3aGljaCB1bmRlcmZsb3cgdG8gemVybyBvY2N1cnMuXHJcbiAgICAvLyBKYXZhU2NyaXB0IG51bWJlcnM6IC0zMjQgICg1ZS0zMjQpXHJcbiAgICBtaW5FOiAtRVhQX0xJTUlULCAgICAgICAgICAgICAgICAgICAgICAvLyAtMSB0byAtRVhQX0xJTUlUXHJcblxyXG4gICAgLy8gVGhlIG1heGltdW0gZXhwb25lbnQgdmFsdWUsIGFib3ZlIHdoaWNoIG92ZXJmbG93IHRvIEluZmluaXR5IG9jY3Vycy5cclxuICAgIC8vIEphdmFTY3JpcHQgbnVtYmVyczogMzA4ICAoMS43OTc2OTMxMzQ4NjIzMTU3ZSszMDgpXHJcbiAgICBtYXhFOiBFWFBfTElNSVQsICAgICAgICAgICAgICAgICAgICAgICAvLyAxIHRvIEVYUF9MSU1JVFxyXG5cclxuICAgIC8vIFdoZXRoZXIgdG8gdXNlIGNyeXB0b2dyYXBoaWNhbGx5LXNlY3VyZSByYW5kb20gbnVtYmVyIGdlbmVyYXRpb24sIGlmIGF2YWlsYWJsZS5cclxuICAgIGNyeXB0bzogZmFsc2UgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIHRydWUvZmFsc2VcclxuICB9LFxyXG5cclxuXHJcbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tIEVORCBPRiBFRElUQUJMRSBERUZBVUxUUyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tIC8vXHJcblxyXG5cclxuICBpbmV4YWN0LCBxdWFkcmFudCxcclxuICBleHRlcm5hbCA9IHRydWUsXHJcblxyXG4gIGRlY2ltYWxFcnJvciA9ICdbRGVjaW1hbEVycm9yXSAnLFxyXG4gIGludmFsaWRBcmd1bWVudCA9IGRlY2ltYWxFcnJvciArICdJbnZhbGlkIGFyZ3VtZW50OiAnLFxyXG4gIHByZWNpc2lvbkxpbWl0RXhjZWVkZWQgPSBkZWNpbWFsRXJyb3IgKyAnUHJlY2lzaW9uIGxpbWl0IGV4Y2VlZGVkJyxcclxuICBjcnlwdG9VbmF2YWlsYWJsZSA9IGRlY2ltYWxFcnJvciArICdjcnlwdG8gdW5hdmFpbGFibGUnLFxyXG4gIHRhZyA9ICdbb2JqZWN0IERlY2ltYWxdJyxcclxuXHJcbiAgbWF0aGZsb29yID0gTWF0aC5mbG9vcixcclxuICBtYXRocG93ID0gTWF0aC5wb3csXHJcblxyXG4gIGlzQmluYXJ5ID0gL14wYihbMDFdKyhcXC5bMDFdKik/fFxcLlswMV0rKShwWystXT9cXGQrKT8kL2ksXHJcbiAgaXNIZXggPSAvXjB4KFswLTlhLWZdKyhcXC5bMC05YS1mXSopP3xcXC5bMC05YS1mXSspKHBbKy1dP1xcZCspPyQvaSxcclxuICBpc09jdGFsID0gL14wbyhbMC03XSsoXFwuWzAtN10qKT98XFwuWzAtN10rKShwWystXT9cXGQrKT8kL2ksXHJcbiAgaXNEZWNpbWFsID0gL14oXFxkKyhcXC5cXGQqKT98XFwuXFxkKykoZVsrLV0/XFxkKyk/JC9pLFxyXG5cclxuICBCQVNFID0gMWU3LFxyXG4gIExPR19CQVNFID0gNyxcclxuICBNQVhfU0FGRV9JTlRFR0VSID0gOTAwNzE5OTI1NDc0MDk5MSxcclxuXHJcbiAgTE4xMF9QUkVDSVNJT04gPSBMTjEwLmxlbmd0aCAtIDEsXHJcbiAgUElfUFJFQ0lTSU9OID0gUEkubGVuZ3RoIC0gMSxcclxuXHJcbiAgLy8gRGVjaW1hbC5wcm90b3R5cGUgb2JqZWN0XHJcbiAgUCA9IHsgdG9TdHJpbmdUYWc6IHRhZyB9O1xyXG5cclxuXHJcbi8vIERlY2ltYWwgcHJvdG90eXBlIG1ldGhvZHNcclxuXHJcblxyXG4vKlxyXG4gKiAgYWJzb2x1dGVWYWx1ZSAgICAgICAgICAgICBhYnNcclxuICogIGNlaWxcclxuICogIGNsYW1wZWRUbyAgICAgICAgICAgICAgICAgY2xhbXBcclxuICogIGNvbXBhcmVkVG8gICAgICAgICAgICAgICAgY21wXHJcbiAqICBjb3NpbmUgICAgICAgICAgICAgICAgICAgIGNvc1xyXG4gKiAgY3ViZVJvb3QgICAgICAgICAgICAgICAgICBjYnJ0XHJcbiAqICBkZWNpbWFsUGxhY2VzICAgICAgICAgICAgIGRwXHJcbiAqICBkaXZpZGVkQnkgICAgICAgICAgICAgICAgIGRpdlxyXG4gKiAgZGl2aWRlZFRvSW50ZWdlckJ5ICAgICAgICBkaXZUb0ludFxyXG4gKiAgZXF1YWxzICAgICAgICAgICAgICAgICAgICBlcVxyXG4gKiAgZmxvb3JcclxuICogIGdyZWF0ZXJUaGFuICAgICAgICAgICAgICAgZ3RcclxuICogIGdyZWF0ZXJUaGFuT3JFcXVhbFRvICAgICAgZ3RlXHJcbiAqICBoeXBlcmJvbGljQ29zaW5lICAgICAgICAgIGNvc2hcclxuICogIGh5cGVyYm9saWNTaW5lICAgICAgICAgICAgc2luaFxyXG4gKiAgaHlwZXJib2xpY1RhbmdlbnQgICAgICAgICB0YW5oXHJcbiAqICBpbnZlcnNlQ29zaW5lICAgICAgICAgICAgIGFjb3NcclxuICogIGludmVyc2VIeXBlcmJvbGljQ29zaW5lICAgYWNvc2hcclxuICogIGludmVyc2VIeXBlcmJvbGljU2luZSAgICAgYXNpbmhcclxuICogIGludmVyc2VIeXBlcmJvbGljVGFuZ2VudCAgYXRhbmhcclxuICogIGludmVyc2VTaW5lICAgICAgICAgICAgICAgYXNpblxyXG4gKiAgaW52ZXJzZVRhbmdlbnQgICAgICAgICAgICBhdGFuXHJcbiAqICBpc0Zpbml0ZVxyXG4gKiAgaXNJbnRlZ2VyICAgICAgICAgICAgICAgICBpc0ludFxyXG4gKiAgaXNOYU5cclxuICogIGlzTmVnYXRpdmUgICAgICAgICAgICAgICAgaXNOZWdcclxuICogIGlzUG9zaXRpdmUgICAgICAgICAgICAgICAgaXNQb3NcclxuICogIGlzWmVyb1xyXG4gKiAgbGVzc1RoYW4gICAgICAgICAgICAgICAgICBsdFxyXG4gKiAgbGVzc1RoYW5PckVxdWFsVG8gICAgICAgICBsdGVcclxuICogIGxvZ2FyaXRobSAgICAgICAgICAgICAgICAgbG9nXHJcbiAqICBbbWF4aW11bV0gICAgICAgICAgICAgICAgIFttYXhdXHJcbiAqICBbbWluaW11bV0gICAgICAgICAgICAgICAgIFttaW5dXHJcbiAqICBtaW51cyAgICAgICAgICAgICAgICAgICAgIHN1YlxyXG4gKiAgbW9kdWxvICAgICAgICAgICAgICAgICAgICBtb2RcclxuICogIG5hdHVyYWxFeHBvbmVudGlhbCAgICAgICAgZXhwXHJcbiAqICBuYXR1cmFsTG9nYXJpdGhtICAgICAgICAgIGxuXHJcbiAqICBuZWdhdGVkICAgICAgICAgICAgICAgICAgIG5lZ1xyXG4gKiAgcGx1cyAgICAgICAgICAgICAgICAgICAgICBhZGRcclxuICogIHByZWNpc2lvbiAgICAgICAgICAgICAgICAgc2RcclxuICogIHJvdW5kXHJcbiAqICBzaW5lICAgICAgICAgICAgICAgICAgICAgIHNpblxyXG4gKiAgc3F1YXJlUm9vdCAgICAgICAgICAgICAgICBzcXJ0XHJcbiAqICB0YW5nZW50ICAgICAgICAgICAgICAgICAgIHRhblxyXG4gKiAgdGltZXMgICAgICAgICAgICAgICAgICAgICBtdWxcclxuICogIHRvQmluYXJ5XHJcbiAqICB0b0RlY2ltYWxQbGFjZXMgICAgICAgICAgIHRvRFBcclxuICogIHRvRXhwb25lbnRpYWxcclxuICogIHRvRml4ZWRcclxuICogIHRvRnJhY3Rpb25cclxuICogIHRvSGV4YWRlY2ltYWwgICAgICAgICAgICAgdG9IZXhcclxuICogIHRvTmVhcmVzdFxyXG4gKiAgdG9OdW1iZXJcclxuICogIHRvT2N0YWxcclxuICogIHRvUG93ZXIgICAgICAgICAgICAgICAgICAgcG93XHJcbiAqICB0b1ByZWNpc2lvblxyXG4gKiAgdG9TaWduaWZpY2FudERpZ2l0cyAgICAgICB0b1NEXHJcbiAqICB0b1N0cmluZ1xyXG4gKiAgdHJ1bmNhdGVkICAgICAgICAgICAgICAgICB0cnVuY1xyXG4gKiAgdmFsdWVPZiAgICAgICAgICAgICAgICAgICB0b0pTT05cclxuICovXHJcblxyXG5cclxuLypcclxuICogUmV0dXJuIGEgbmV3IERlY2ltYWwgd2hvc2UgdmFsdWUgaXMgdGhlIGFic29sdXRlIHZhbHVlIG9mIHRoaXMgRGVjaW1hbC5cclxuICpcclxuICovXHJcblAuYWJzb2x1dGVWYWx1ZSA9IFAuYWJzID0gZnVuY3Rpb24gKCkge1xyXG4gIHZhciB4ID0gbmV3IHRoaXMuY29uc3RydWN0b3IodGhpcyk7XHJcbiAgaWYgKHgucyA8IDApIHgucyA9IDE7XHJcbiAgcmV0dXJuIGZpbmFsaXNlKHgpO1xyXG59O1xyXG5cclxuXHJcbi8qXHJcbiAqIFJldHVybiBhIG5ldyBEZWNpbWFsIHdob3NlIHZhbHVlIGlzIHRoZSB2YWx1ZSBvZiB0aGlzIERlY2ltYWwgcm91bmRlZCB0byBhIHdob2xlIG51bWJlciBpbiB0aGVcclxuICogZGlyZWN0aW9uIG9mIHBvc2l0aXZlIEluZmluaXR5LlxyXG4gKlxyXG4gKi9cclxuUC5jZWlsID0gZnVuY3Rpb24gKCkge1xyXG4gIHJldHVybiBmaW5hbGlzZShuZXcgdGhpcy5jb25zdHJ1Y3Rvcih0aGlzKSwgdGhpcy5lICsgMSwgMik7XHJcbn07XHJcblxyXG5cclxuLypcclxuICogUmV0dXJuIGEgbmV3IERlY2ltYWwgd2hvc2UgdmFsdWUgaXMgdGhlIHZhbHVlIG9mIHRoaXMgRGVjaW1hbCBjbGFtcGVkIHRvIHRoZSByYW5nZVxyXG4gKiBkZWxpbmVhdGVkIGJ5IGBtaW5gIGFuZCBgbWF4YC5cclxuICpcclxuICogbWluIHtudW1iZXJ8c3RyaW5nfERlY2ltYWx9XHJcbiAqIG1heCB7bnVtYmVyfHN0cmluZ3xEZWNpbWFsfVxyXG4gKlxyXG4gKi9cclxuUC5jbGFtcGVkVG8gPSBQLmNsYW1wID0gZnVuY3Rpb24gKG1pbiwgbWF4KSB7XHJcbiAgdmFyIGssXHJcbiAgICB4ID0gdGhpcyxcclxuICAgIEN0b3IgPSB4LmNvbnN0cnVjdG9yO1xyXG4gIG1pbiA9IG5ldyBDdG9yKG1pbik7XHJcbiAgbWF4ID0gbmV3IEN0b3IobWF4KTtcclxuICBpZiAoIW1pbi5zIHx8ICFtYXgucykgcmV0dXJuIG5ldyBDdG9yKE5hTik7XHJcbiAgaWYgKG1pbi5ndChtYXgpKSB0aHJvdyBFcnJvcihpbnZhbGlkQXJndW1lbnQgKyBtYXgpO1xyXG4gIGsgPSB4LmNtcChtaW4pO1xyXG4gIHJldHVybiBrIDwgMCA/IG1pbiA6IHguY21wKG1heCkgPiAwID8gbWF4IDogbmV3IEN0b3IoeCk7XHJcbn07XHJcblxyXG5cclxuLypcclxuICogUmV0dXJuXHJcbiAqICAgMSAgICBpZiB0aGUgdmFsdWUgb2YgdGhpcyBEZWNpbWFsIGlzIGdyZWF0ZXIgdGhhbiB0aGUgdmFsdWUgb2YgYHlgLFxyXG4gKiAgLTEgICAgaWYgdGhlIHZhbHVlIG9mIHRoaXMgRGVjaW1hbCBpcyBsZXNzIHRoYW4gdGhlIHZhbHVlIG9mIGB5YCxcclxuICogICAwICAgIGlmIHRoZXkgaGF2ZSB0aGUgc2FtZSB2YWx1ZSxcclxuICogICBOYU4gIGlmIHRoZSB2YWx1ZSBvZiBlaXRoZXIgRGVjaW1hbCBpcyBOYU4uXHJcbiAqXHJcbiAqL1xyXG5QLmNvbXBhcmVkVG8gPSBQLmNtcCA9IGZ1bmN0aW9uICh5KSB7XHJcbiAgdmFyIGksIGosIHhkTCwgeWRMLFxyXG4gICAgeCA9IHRoaXMsXHJcbiAgICB4ZCA9IHguZCxcclxuICAgIHlkID0gKHkgPSBuZXcgeC5jb25zdHJ1Y3Rvcih5KSkuZCxcclxuICAgIHhzID0geC5zLFxyXG4gICAgeXMgPSB5LnM7XHJcblxyXG4gIC8vIEVpdGhlciBOYU4gb3IgXHUwMEIxSW5maW5pdHk/XHJcbiAgaWYgKCF4ZCB8fCAheWQpIHtcclxuICAgIHJldHVybiAheHMgfHwgIXlzID8gTmFOIDogeHMgIT09IHlzID8geHMgOiB4ZCA9PT0geWQgPyAwIDogIXhkIF4geHMgPCAwID8gMSA6IC0xO1xyXG4gIH1cclxuXHJcbiAgLy8gRWl0aGVyIHplcm8/XHJcbiAgaWYgKCF4ZFswXSB8fCAheWRbMF0pIHJldHVybiB4ZFswXSA/IHhzIDogeWRbMF0gPyAteXMgOiAwO1xyXG5cclxuICAvLyBTaWducyBkaWZmZXI/XHJcbiAgaWYgKHhzICE9PSB5cykgcmV0dXJuIHhzO1xyXG5cclxuICAvLyBDb21wYXJlIGV4cG9uZW50cy5cclxuICBpZiAoeC5lICE9PSB5LmUpIHJldHVybiB4LmUgPiB5LmUgXiB4cyA8IDAgPyAxIDogLTE7XHJcblxyXG4gIHhkTCA9IHhkLmxlbmd0aDtcclxuICB5ZEwgPSB5ZC5sZW5ndGg7XHJcblxyXG4gIC8vIENvbXBhcmUgZGlnaXQgYnkgZGlnaXQuXHJcbiAgZm9yIChpID0gMCwgaiA9IHhkTCA8IHlkTCA/IHhkTCA6IHlkTDsgaSA8IGo7ICsraSkge1xyXG4gICAgaWYgKHhkW2ldICE9PSB5ZFtpXSkgcmV0dXJuIHhkW2ldID4geWRbaV0gXiB4cyA8IDAgPyAxIDogLTE7XHJcbiAgfVxyXG5cclxuICAvLyBDb21wYXJlIGxlbmd0aHMuXHJcbiAgcmV0dXJuIHhkTCA9PT0geWRMID8gMCA6IHhkTCA+IHlkTCBeIHhzIDwgMCA/IDEgOiAtMTtcclxufTtcclxuXHJcblxyXG4vKlxyXG4gKiBSZXR1cm4gYSBuZXcgRGVjaW1hbCB3aG9zZSB2YWx1ZSBpcyB0aGUgY29zaW5lIG9mIHRoZSB2YWx1ZSBpbiByYWRpYW5zIG9mIHRoaXMgRGVjaW1hbC5cclxuICpcclxuICogRG9tYWluOiBbLUluZmluaXR5LCBJbmZpbml0eV1cclxuICogUmFuZ2U6IFstMSwgMV1cclxuICpcclxuICogY29zKDApICAgICAgICAgPSAxXHJcbiAqIGNvcygtMCkgICAgICAgID0gMVxyXG4gKiBjb3MoSW5maW5pdHkpICA9IE5hTlxyXG4gKiBjb3MoLUluZmluaXR5KSA9IE5hTlxyXG4gKiBjb3MoTmFOKSAgICAgICA9IE5hTlxyXG4gKlxyXG4gKi9cclxuUC5jb3NpbmUgPSBQLmNvcyA9IGZ1bmN0aW9uICgpIHtcclxuICB2YXIgcHIsIHJtLFxyXG4gICAgeCA9IHRoaXMsXHJcbiAgICBDdG9yID0geC5jb25zdHJ1Y3RvcjtcclxuXHJcbiAgaWYgKCF4LmQpIHJldHVybiBuZXcgQ3RvcihOYU4pO1xyXG5cclxuICAvLyBjb3MoMCkgPSBjb3MoLTApID0gMVxyXG4gIGlmICgheC5kWzBdKSByZXR1cm4gbmV3IEN0b3IoMSk7XHJcblxyXG4gIHByID0gQ3Rvci5wcmVjaXNpb247XHJcbiAgcm0gPSBDdG9yLnJvdW5kaW5nO1xyXG4gIEN0b3IucHJlY2lzaW9uID0gcHIgKyBNYXRoLm1heCh4LmUsIHguc2QoKSkgKyBMT0dfQkFTRTtcclxuICBDdG9yLnJvdW5kaW5nID0gMTtcclxuXHJcbiAgeCA9IGNvc2luZShDdG9yLCB0b0xlc3NUaGFuSGFsZlBpKEN0b3IsIHgpKTtcclxuXHJcbiAgQ3Rvci5wcmVjaXNpb24gPSBwcjtcclxuICBDdG9yLnJvdW5kaW5nID0gcm07XHJcblxyXG4gIHJldHVybiBmaW5hbGlzZShxdWFkcmFudCA9PSAyIHx8IHF1YWRyYW50ID09IDMgPyB4Lm5lZygpIDogeCwgcHIsIHJtLCB0cnVlKTtcclxufTtcclxuXHJcblxyXG4vKlxyXG4gKlxyXG4gKiBSZXR1cm4gYSBuZXcgRGVjaW1hbCB3aG9zZSB2YWx1ZSBpcyB0aGUgY3ViZSByb290IG9mIHRoZSB2YWx1ZSBvZiB0aGlzIERlY2ltYWwsIHJvdW5kZWQgdG9cclxuICogYHByZWNpc2lvbmAgc2lnbmlmaWNhbnQgZGlnaXRzIHVzaW5nIHJvdW5kaW5nIG1vZGUgYHJvdW5kaW5nYC5cclxuICpcclxuICogIGNicnQoMCkgID0gIDBcclxuICogIGNicnQoLTApID0gLTBcclxuICogIGNicnQoMSkgID0gIDFcclxuICogIGNicnQoLTEpID0gLTFcclxuICogIGNicnQoTikgID0gIE5cclxuICogIGNicnQoLUkpID0gLUlcclxuICogIGNicnQoSSkgID0gIElcclxuICpcclxuICogTWF0aC5jYnJ0KHgpID0gKHggPCAwID8gLU1hdGgucG93KC14LCAxLzMpIDogTWF0aC5wb3coeCwgMS8zKSlcclxuICpcclxuICovXHJcblAuY3ViZVJvb3QgPSBQLmNicnQgPSBmdW5jdGlvbiAoKSB7XHJcbiAgdmFyIGUsIG0sIG4sIHIsIHJlcCwgcywgc2QsIHQsIHQzLCB0M3BsdXN4LFxyXG4gICAgeCA9IHRoaXMsXHJcbiAgICBDdG9yID0geC5jb25zdHJ1Y3RvcjtcclxuXHJcbiAgaWYgKCF4LmlzRmluaXRlKCkgfHwgeC5pc1plcm8oKSkgcmV0dXJuIG5ldyBDdG9yKHgpO1xyXG4gIGV4dGVybmFsID0gZmFsc2U7XHJcblxyXG4gIC8vIEluaXRpYWwgZXN0aW1hdGUuXHJcbiAgcyA9IHgucyAqIG1hdGhwb3coeC5zICogeCwgMSAvIDMpO1xyXG5cclxuICAgLy8gTWF0aC5jYnJ0IHVuZGVyZmxvdy9vdmVyZmxvdz9cclxuICAgLy8gUGFzcyB4IHRvIE1hdGgucG93IGFzIGludGVnZXIsIHRoZW4gYWRqdXN0IHRoZSBleHBvbmVudCBvZiB0aGUgcmVzdWx0LlxyXG4gIGlmICghcyB8fCBNYXRoLmFicyhzKSA9PSAxIC8gMCkge1xyXG4gICAgbiA9IGRpZ2l0c1RvU3RyaW5nKHguZCk7XHJcbiAgICBlID0geC5lO1xyXG5cclxuICAgIC8vIEFkanVzdCBuIGV4cG9uZW50IHNvIGl0IGlzIGEgbXVsdGlwbGUgb2YgMyBhd2F5IGZyb20geCBleHBvbmVudC5cclxuICAgIGlmIChzID0gKGUgLSBuLmxlbmd0aCArIDEpICUgMykgbiArPSAocyA9PSAxIHx8IHMgPT0gLTIgPyAnMCcgOiAnMDAnKTtcclxuICAgIHMgPSBtYXRocG93KG4sIDEgLyAzKTtcclxuXHJcbiAgICAvLyBSYXJlbHksIGUgbWF5IGJlIG9uZSBsZXNzIHRoYW4gdGhlIHJlc3VsdCBleHBvbmVudCB2YWx1ZS5cclxuICAgIGUgPSBtYXRoZmxvb3IoKGUgKyAxKSAvIDMpIC0gKGUgJSAzID09IChlIDwgMCA/IC0xIDogMikpO1xyXG5cclxuICAgIGlmIChzID09IDEgLyAwKSB7XHJcbiAgICAgIG4gPSAnNWUnICsgZTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIG4gPSBzLnRvRXhwb25lbnRpYWwoKTtcclxuICAgICAgbiA9IG4uc2xpY2UoMCwgbi5pbmRleE9mKCdlJykgKyAxKSArIGU7XHJcbiAgICB9XHJcblxyXG4gICAgciA9IG5ldyBDdG9yKG4pO1xyXG4gICAgci5zID0geC5zO1xyXG4gIH0gZWxzZSB7XHJcbiAgICByID0gbmV3IEN0b3Iocy50b1N0cmluZygpKTtcclxuICB9XHJcblxyXG4gIHNkID0gKGUgPSBDdG9yLnByZWNpc2lvbikgKyAzO1xyXG5cclxuICAvLyBIYWxsZXkncyBtZXRob2QuXHJcbiAgLy8gVE9ETz8gQ29tcGFyZSBOZXd0b24ncyBtZXRob2QuXHJcbiAgZm9yICg7Oykge1xyXG4gICAgdCA9IHI7XHJcbiAgICB0MyA9IHQudGltZXModCkudGltZXModCk7XHJcbiAgICB0M3BsdXN4ID0gdDMucGx1cyh4KTtcclxuICAgIHIgPSBkaXZpZGUodDNwbHVzeC5wbHVzKHgpLnRpbWVzKHQpLCB0M3BsdXN4LnBsdXModDMpLCBzZCArIDIsIDEpO1xyXG5cclxuICAgIC8vIFRPRE8/IFJlcGxhY2Ugd2l0aCBmb3ItbG9vcCBhbmQgY2hlY2tSb3VuZGluZ0RpZ2l0cy5cclxuICAgIGlmIChkaWdpdHNUb1N0cmluZyh0LmQpLnNsaWNlKDAsIHNkKSA9PT0gKG4gPSBkaWdpdHNUb1N0cmluZyhyLmQpKS5zbGljZSgwLCBzZCkpIHtcclxuICAgICAgbiA9IG4uc2xpY2Uoc2QgLSAzLCBzZCArIDEpO1xyXG5cclxuICAgICAgLy8gVGhlIDR0aCByb3VuZGluZyBkaWdpdCBtYXkgYmUgaW4gZXJyb3IgYnkgLTEgc28gaWYgdGhlIDQgcm91bmRpbmcgZGlnaXRzIGFyZSA5OTk5IG9yIDQ5OTlcclxuICAgICAgLy8gLCBpLmUuIGFwcHJvYWNoaW5nIGEgcm91bmRpbmcgYm91bmRhcnksIGNvbnRpbnVlIHRoZSBpdGVyYXRpb24uXHJcbiAgICAgIGlmIChuID09ICc5OTk5JyB8fCAhcmVwICYmIG4gPT0gJzQ5OTknKSB7XHJcblxyXG4gICAgICAgIC8vIE9uIHRoZSBmaXJzdCBpdGVyYXRpb24gb25seSwgY2hlY2sgdG8gc2VlIGlmIHJvdW5kaW5nIHVwIGdpdmVzIHRoZSBleGFjdCByZXN1bHQgYXMgdGhlXHJcbiAgICAgICAgLy8gbmluZXMgbWF5IGluZmluaXRlbHkgcmVwZWF0LlxyXG4gICAgICAgIGlmICghcmVwKSB7XHJcbiAgICAgICAgICBmaW5hbGlzZSh0LCBlICsgMSwgMCk7XHJcblxyXG4gICAgICAgICAgaWYgKHQudGltZXModCkudGltZXModCkuZXEoeCkpIHtcclxuICAgICAgICAgICAgciA9IHQ7XHJcbiAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgc2QgKz0gNDtcclxuICAgICAgICByZXAgPSAxO1xyXG4gICAgICB9IGVsc2Uge1xyXG5cclxuICAgICAgICAvLyBJZiB0aGUgcm91bmRpbmcgZGlnaXRzIGFyZSBudWxsLCAwezAsNH0gb3IgNTB7MCwzfSwgY2hlY2sgZm9yIGFuIGV4YWN0IHJlc3VsdC5cclxuICAgICAgICAvLyBJZiBub3QsIHRoZW4gdGhlcmUgYXJlIGZ1cnRoZXIgZGlnaXRzIGFuZCBtIHdpbGwgYmUgdHJ1dGh5LlxyXG4gICAgICAgIGlmICghK24gfHwgIStuLnNsaWNlKDEpICYmIG4uY2hhckF0KDApID09ICc1Jykge1xyXG5cclxuICAgICAgICAgIC8vIFRydW5jYXRlIHRvIHRoZSBmaXJzdCByb3VuZGluZyBkaWdpdC5cclxuICAgICAgICAgIGZpbmFsaXNlKHIsIGUgKyAxLCAxKTtcclxuICAgICAgICAgIG0gPSAhci50aW1lcyhyKS50aW1lcyhyKS5lcSh4KTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGJyZWFrO1xyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBleHRlcm5hbCA9IHRydWU7XHJcblxyXG4gIHJldHVybiBmaW5hbGlzZShyLCBlLCBDdG9yLnJvdW5kaW5nLCBtKTtcclxufTtcclxuXHJcblxyXG4vKlxyXG4gKiBSZXR1cm4gdGhlIG51bWJlciBvZiBkZWNpbWFsIHBsYWNlcyBvZiB0aGUgdmFsdWUgb2YgdGhpcyBEZWNpbWFsLlxyXG4gKlxyXG4gKi9cclxuUC5kZWNpbWFsUGxhY2VzID0gUC5kcCA9IGZ1bmN0aW9uICgpIHtcclxuICB2YXIgdyxcclxuICAgIGQgPSB0aGlzLmQsXHJcbiAgICBuID0gTmFOO1xyXG5cclxuICBpZiAoZCkge1xyXG4gICAgdyA9IGQubGVuZ3RoIC0gMTtcclxuICAgIG4gPSAodyAtIG1hdGhmbG9vcih0aGlzLmUgLyBMT0dfQkFTRSkpICogTE9HX0JBU0U7XHJcblxyXG4gICAgLy8gU3VidHJhY3QgdGhlIG51bWJlciBvZiB0cmFpbGluZyB6ZXJvcyBvZiB0aGUgbGFzdCB3b3JkLlxyXG4gICAgdyA9IGRbd107XHJcbiAgICBpZiAodykgZm9yICg7IHcgJSAxMCA9PSAwOyB3IC89IDEwKSBuLS07XHJcbiAgICBpZiAobiA8IDApIG4gPSAwO1xyXG4gIH1cclxuXHJcbiAgcmV0dXJuIG47XHJcbn07XHJcblxyXG5cclxuLypcclxuICogIG4gLyAwID0gSVxyXG4gKiAgbiAvIE4gPSBOXHJcbiAqICBuIC8gSSA9IDBcclxuICogIDAgLyBuID0gMFxyXG4gKiAgMCAvIDAgPSBOXHJcbiAqICAwIC8gTiA9IE5cclxuICogIDAgLyBJID0gMFxyXG4gKiAgTiAvIG4gPSBOXHJcbiAqICBOIC8gMCA9IE5cclxuICogIE4gLyBOID0gTlxyXG4gKiAgTiAvIEkgPSBOXHJcbiAqICBJIC8gbiA9IElcclxuICogIEkgLyAwID0gSVxyXG4gKiAgSSAvIE4gPSBOXHJcbiAqICBJIC8gSSA9IE5cclxuICpcclxuICogUmV0dXJuIGEgbmV3IERlY2ltYWwgd2hvc2UgdmFsdWUgaXMgdGhlIHZhbHVlIG9mIHRoaXMgRGVjaW1hbCBkaXZpZGVkIGJ5IGB5YCwgcm91bmRlZCB0b1xyXG4gKiBgcHJlY2lzaW9uYCBzaWduaWZpY2FudCBkaWdpdHMgdXNpbmcgcm91bmRpbmcgbW9kZSBgcm91bmRpbmdgLlxyXG4gKlxyXG4gKi9cclxuUC5kaXZpZGVkQnkgPSBQLmRpdiA9IGZ1bmN0aW9uICh5KSB7XHJcbiAgcmV0dXJuIGRpdmlkZSh0aGlzLCBuZXcgdGhpcy5jb25zdHJ1Y3Rvcih5KSk7XHJcbn07XHJcblxyXG5cclxuLypcclxuICogUmV0dXJuIGEgbmV3IERlY2ltYWwgd2hvc2UgdmFsdWUgaXMgdGhlIGludGVnZXIgcGFydCBvZiBkaXZpZGluZyB0aGUgdmFsdWUgb2YgdGhpcyBEZWNpbWFsXHJcbiAqIGJ5IHRoZSB2YWx1ZSBvZiBgeWAsIHJvdW5kZWQgdG8gYHByZWNpc2lvbmAgc2lnbmlmaWNhbnQgZGlnaXRzIHVzaW5nIHJvdW5kaW5nIG1vZGUgYHJvdW5kaW5nYC5cclxuICpcclxuICovXHJcblAuZGl2aWRlZFRvSW50ZWdlckJ5ID0gUC5kaXZUb0ludCA9IGZ1bmN0aW9uICh5KSB7XHJcbiAgdmFyIHggPSB0aGlzLFxyXG4gICAgQ3RvciA9IHguY29uc3RydWN0b3I7XHJcbiAgcmV0dXJuIGZpbmFsaXNlKGRpdmlkZSh4LCBuZXcgQ3Rvcih5KSwgMCwgMSwgMSksIEN0b3IucHJlY2lzaW9uLCBDdG9yLnJvdW5kaW5nKTtcclxufTtcclxuXHJcblxyXG4vKlxyXG4gKiBSZXR1cm4gdHJ1ZSBpZiB0aGUgdmFsdWUgb2YgdGhpcyBEZWNpbWFsIGlzIGVxdWFsIHRvIHRoZSB2YWx1ZSBvZiBgeWAsIG90aGVyd2lzZSByZXR1cm4gZmFsc2UuXHJcbiAqXHJcbiAqL1xyXG5QLmVxdWFscyA9IFAuZXEgPSBmdW5jdGlvbiAoeSkge1xyXG4gIHJldHVybiB0aGlzLmNtcCh5KSA9PT0gMDtcclxufTtcclxuXHJcblxyXG4vKlxyXG4gKiBSZXR1cm4gYSBuZXcgRGVjaW1hbCB3aG9zZSB2YWx1ZSBpcyB0aGUgdmFsdWUgb2YgdGhpcyBEZWNpbWFsIHJvdW5kZWQgdG8gYSB3aG9sZSBudW1iZXIgaW4gdGhlXHJcbiAqIGRpcmVjdGlvbiBvZiBuZWdhdGl2ZSBJbmZpbml0eS5cclxuICpcclxuICovXHJcblAuZmxvb3IgPSBmdW5jdGlvbiAoKSB7XHJcbiAgcmV0dXJuIGZpbmFsaXNlKG5ldyB0aGlzLmNvbnN0cnVjdG9yKHRoaXMpLCB0aGlzLmUgKyAxLCAzKTtcclxufTtcclxuXHJcblxyXG4vKlxyXG4gKiBSZXR1cm4gdHJ1ZSBpZiB0aGUgdmFsdWUgb2YgdGhpcyBEZWNpbWFsIGlzIGdyZWF0ZXIgdGhhbiB0aGUgdmFsdWUgb2YgYHlgLCBvdGhlcndpc2UgcmV0dXJuXHJcbiAqIGZhbHNlLlxyXG4gKlxyXG4gKi9cclxuUC5ncmVhdGVyVGhhbiA9IFAuZ3QgPSBmdW5jdGlvbiAoeSkge1xyXG4gIHJldHVybiB0aGlzLmNtcCh5KSA+IDA7XHJcbn07XHJcblxyXG5cclxuLypcclxuICogUmV0dXJuIHRydWUgaWYgdGhlIHZhbHVlIG9mIHRoaXMgRGVjaW1hbCBpcyBncmVhdGVyIHRoYW4gb3IgZXF1YWwgdG8gdGhlIHZhbHVlIG9mIGB5YCxcclxuICogb3RoZXJ3aXNlIHJldHVybiBmYWxzZS5cclxuICpcclxuICovXHJcblAuZ3JlYXRlclRoYW5PckVxdWFsVG8gPSBQLmd0ZSA9IGZ1bmN0aW9uICh5KSB7XHJcbiAgdmFyIGsgPSB0aGlzLmNtcCh5KTtcclxuICByZXR1cm4gayA9PSAxIHx8IGsgPT09IDA7XHJcbn07XHJcblxyXG5cclxuLypcclxuICogUmV0dXJuIGEgbmV3IERlY2ltYWwgd2hvc2UgdmFsdWUgaXMgdGhlIGh5cGVyYm9saWMgY29zaW5lIG9mIHRoZSB2YWx1ZSBpbiByYWRpYW5zIG9mIHRoaXNcclxuICogRGVjaW1hbC5cclxuICpcclxuICogRG9tYWluOiBbLUluZmluaXR5LCBJbmZpbml0eV1cclxuICogUmFuZ2U6IFsxLCBJbmZpbml0eV1cclxuICpcclxuICogY29zaCh4KSA9IDEgKyB4XjIvMiEgKyB4XjQvNCEgKyB4XjYvNiEgKyAuLi5cclxuICpcclxuICogY29zaCgwKSAgICAgICAgID0gMVxyXG4gKiBjb3NoKC0wKSAgICAgICAgPSAxXHJcbiAqIGNvc2goSW5maW5pdHkpICA9IEluZmluaXR5XHJcbiAqIGNvc2goLUluZmluaXR5KSA9IEluZmluaXR5XHJcbiAqIGNvc2goTmFOKSAgICAgICA9IE5hTlxyXG4gKlxyXG4gKiAgeCAgICAgICAgdGltZSB0YWtlbiAobXMpICAgcmVzdWx0XHJcbiAqIDEwMDAgICAgICA5ICAgICAgICAgICAgICAgICA5Ljg1MDM1NTU3MDA4NTIzNDk2OTRlKzQzM1xyXG4gKiAxMDAwMCAgICAgMjUgICAgICAgICAgICAgICAgNC40MDM0MDkxMTI4MzE0NjA3OTM2ZSs0MzQyXHJcbiAqIDEwMDAwMCAgICAxNzEgICAgICAgICAgICAgICAxLjQwMzMzMTY4MDIxMzA2MTU4OTdlKzQzNDI5XHJcbiAqIDEwMDAwMDAgICAzODE3ICAgICAgICAgICAgICAxLjUxNjYwNzY5ODQwMTA0Mzc3MjVlKzQzNDI5NFxyXG4gKiAxMDAwMDAwMCAgYWJhbmRvbmVkIGFmdGVyIDIgbWludXRlIHdhaXRcclxuICpcclxuICogVE9ETz8gQ29tcGFyZSBwZXJmb3JtYW5jZSBvZiBjb3NoKHgpID0gMC41ICogKGV4cCh4KSArIGV4cCgteCkpXHJcbiAqXHJcbiAqL1xyXG5QLmh5cGVyYm9saWNDb3NpbmUgPSBQLmNvc2ggPSBmdW5jdGlvbiAoKSB7XHJcbiAgdmFyIGssIG4sIHByLCBybSwgbGVuLFxyXG4gICAgeCA9IHRoaXMsXHJcbiAgICBDdG9yID0geC5jb25zdHJ1Y3RvcixcclxuICAgIG9uZSA9IG5ldyBDdG9yKDEpO1xyXG5cclxuICBpZiAoIXguaXNGaW5pdGUoKSkgcmV0dXJuIG5ldyBDdG9yKHgucyA/IDEgLyAwIDogTmFOKTtcclxuICBpZiAoeC5pc1plcm8oKSkgcmV0dXJuIG9uZTtcclxuXHJcbiAgcHIgPSBDdG9yLnByZWNpc2lvbjtcclxuICBybSA9IEN0b3Iucm91bmRpbmc7XHJcbiAgQ3Rvci5wcmVjaXNpb24gPSBwciArIE1hdGgubWF4KHguZSwgeC5zZCgpKSArIDQ7XHJcbiAgQ3Rvci5yb3VuZGluZyA9IDE7XHJcbiAgbGVuID0geC5kLmxlbmd0aDtcclxuXHJcbiAgLy8gQXJndW1lbnQgcmVkdWN0aW9uOiBjb3MoNHgpID0gMSAtIDhjb3NeMih4KSArIDhjb3NeNCh4KSArIDFcclxuICAvLyBpLmUuIGNvcyh4KSA9IDEgLSBjb3NeMih4LzQpKDggLSA4Y29zXjIoeC80KSlcclxuXHJcbiAgLy8gRXN0aW1hdGUgdGhlIG9wdGltdW0gbnVtYmVyIG9mIHRpbWVzIHRvIHVzZSB0aGUgYXJndW1lbnQgcmVkdWN0aW9uLlxyXG4gIC8vIFRPRE8/IEVzdGltYXRpb24gcmV1c2VkIGZyb20gY29zaW5lKCkgYW5kIG1heSBub3QgYmUgb3B0aW1hbCBoZXJlLlxyXG4gIGlmIChsZW4gPCAzMikge1xyXG4gICAgayA9IE1hdGguY2VpbChsZW4gLyAzKTtcclxuICAgIG4gPSAoMSAvIHRpbnlQb3coNCwgaykpLnRvU3RyaW5nKCk7XHJcbiAgfSBlbHNlIHtcclxuICAgIGsgPSAxNjtcclxuICAgIG4gPSAnMi4zMjgzMDY0MzY1Mzg2OTYyODkwNjI1ZS0xMCc7XHJcbiAgfVxyXG5cclxuICB4ID0gdGF5bG9yU2VyaWVzKEN0b3IsIDEsIHgudGltZXMobiksIG5ldyBDdG9yKDEpLCB0cnVlKTtcclxuXHJcbiAgLy8gUmV2ZXJzZSBhcmd1bWVudCByZWR1Y3Rpb25cclxuICB2YXIgY29zaDJfeCxcclxuICAgIGkgPSBrLFxyXG4gICAgZDggPSBuZXcgQ3Rvcig4KTtcclxuICBmb3IgKDsgaS0tOykge1xyXG4gICAgY29zaDJfeCA9IHgudGltZXMoeCk7XHJcbiAgICB4ID0gb25lLm1pbnVzKGNvc2gyX3gudGltZXMoZDgubWludXMoY29zaDJfeC50aW1lcyhkOCkpKSk7XHJcbiAgfVxyXG5cclxuICByZXR1cm4gZmluYWxpc2UoeCwgQ3Rvci5wcmVjaXNpb24gPSBwciwgQ3Rvci5yb3VuZGluZyA9IHJtLCB0cnVlKTtcclxufTtcclxuXHJcblxyXG4vKlxyXG4gKiBSZXR1cm4gYSBuZXcgRGVjaW1hbCB3aG9zZSB2YWx1ZSBpcyB0aGUgaHlwZXJib2xpYyBzaW5lIG9mIHRoZSB2YWx1ZSBpbiByYWRpYW5zIG9mIHRoaXNcclxuICogRGVjaW1hbC5cclxuICpcclxuICogRG9tYWluOiBbLUluZmluaXR5LCBJbmZpbml0eV1cclxuICogUmFuZ2U6IFstSW5maW5pdHksIEluZmluaXR5XVxyXG4gKlxyXG4gKiBzaW5oKHgpID0geCArIHheMy8zISArIHheNS81ISArIHheNy83ISArIC4uLlxyXG4gKlxyXG4gKiBzaW5oKDApICAgICAgICAgPSAwXHJcbiAqIHNpbmgoLTApICAgICAgICA9IC0wXHJcbiAqIHNpbmgoSW5maW5pdHkpICA9IEluZmluaXR5XHJcbiAqIHNpbmgoLUluZmluaXR5KSA9IC1JbmZpbml0eVxyXG4gKiBzaW5oKE5hTikgICAgICAgPSBOYU5cclxuICpcclxuICogeCAgICAgICAgdGltZSB0YWtlbiAobXMpXHJcbiAqIDEwICAgICAgIDIgbXNcclxuICogMTAwICAgICAgNSBtc1xyXG4gKiAxMDAwICAgICAxNCBtc1xyXG4gKiAxMDAwMCAgICA4MiBtc1xyXG4gKiAxMDAwMDAgICA4ODYgbXMgICAgICAgICAgICAxLjQwMzMzMTY4MDIxMzA2MTU4OTdlKzQzNDI5XHJcbiAqIDIwMDAwMCAgIDI2MTMgbXNcclxuICogMzAwMDAwICAgNTQwNyBtc1xyXG4gKiA0MDAwMDAgICA4ODI0IG1zXHJcbiAqIDUwMDAwMCAgIDEzMDI2IG1zICAgICAgICAgIDguNzA4MDY0MzYxMjcxODA4NDEyOWUrMjE3MTQ2XHJcbiAqIDEwMDAwMDAgIDQ4NTQzIG1zXHJcbiAqXHJcbiAqIFRPRE8/IENvbXBhcmUgcGVyZm9ybWFuY2Ugb2Ygc2luaCh4KSA9IDAuNSAqIChleHAoeCkgLSBleHAoLXgpKVxyXG4gKlxyXG4gKi9cclxuUC5oeXBlcmJvbGljU2luZSA9IFAuc2luaCA9IGZ1bmN0aW9uICgpIHtcclxuICB2YXIgaywgcHIsIHJtLCBsZW4sXHJcbiAgICB4ID0gdGhpcyxcclxuICAgIEN0b3IgPSB4LmNvbnN0cnVjdG9yO1xyXG5cclxuICBpZiAoIXguaXNGaW5pdGUoKSB8fCB4LmlzWmVybygpKSByZXR1cm4gbmV3IEN0b3IoeCk7XHJcblxyXG4gIHByID0gQ3Rvci5wcmVjaXNpb247XHJcbiAgcm0gPSBDdG9yLnJvdW5kaW5nO1xyXG4gIEN0b3IucHJlY2lzaW9uID0gcHIgKyBNYXRoLm1heCh4LmUsIHguc2QoKSkgKyA0O1xyXG4gIEN0b3Iucm91bmRpbmcgPSAxO1xyXG4gIGxlbiA9IHguZC5sZW5ndGg7XHJcblxyXG4gIGlmIChsZW4gPCAzKSB7XHJcbiAgICB4ID0gdGF5bG9yU2VyaWVzKEN0b3IsIDIsIHgsIHgsIHRydWUpO1xyXG4gIH0gZWxzZSB7XHJcblxyXG4gICAgLy8gQWx0ZXJuYXRpdmUgYXJndW1lbnQgcmVkdWN0aW9uOiBzaW5oKDN4KSA9IHNpbmgoeCkoMyArIDRzaW5oXjIoeCkpXHJcbiAgICAvLyBpLmUuIHNpbmgoeCkgPSBzaW5oKHgvMykoMyArIDRzaW5oXjIoeC8zKSlcclxuICAgIC8vIDMgbXVsdGlwbGljYXRpb25zIGFuZCAxIGFkZGl0aW9uXHJcblxyXG4gICAgLy8gQXJndW1lbnQgcmVkdWN0aW9uOiBzaW5oKDV4KSA9IHNpbmgoeCkoNSArIHNpbmheMih4KSgyMCArIDE2c2luaF4yKHgpKSlcclxuICAgIC8vIGkuZS4gc2luaCh4KSA9IHNpbmgoeC81KSg1ICsgc2luaF4yKHgvNSkoMjAgKyAxNnNpbmheMih4LzUpKSlcclxuICAgIC8vIDQgbXVsdGlwbGljYXRpb25zIGFuZCAyIGFkZGl0aW9uc1xyXG5cclxuICAgIC8vIEVzdGltYXRlIHRoZSBvcHRpbXVtIG51bWJlciBvZiB0aW1lcyB0byB1c2UgdGhlIGFyZ3VtZW50IHJlZHVjdGlvbi5cclxuICAgIGsgPSAxLjQgKiBNYXRoLnNxcnQobGVuKTtcclxuICAgIGsgPSBrID4gMTYgPyAxNiA6IGsgfCAwO1xyXG5cclxuICAgIHggPSB4LnRpbWVzKDEgLyB0aW55UG93KDUsIGspKTtcclxuICAgIHggPSB0YXlsb3JTZXJpZXMoQ3RvciwgMiwgeCwgeCwgdHJ1ZSk7XHJcblxyXG4gICAgLy8gUmV2ZXJzZSBhcmd1bWVudCByZWR1Y3Rpb25cclxuICAgIHZhciBzaW5oMl94LFxyXG4gICAgICBkNSA9IG5ldyBDdG9yKDUpLFxyXG4gICAgICBkMTYgPSBuZXcgQ3RvcigxNiksXHJcbiAgICAgIGQyMCA9IG5ldyBDdG9yKDIwKTtcclxuICAgIGZvciAoOyBrLS07KSB7XHJcbiAgICAgIHNpbmgyX3ggPSB4LnRpbWVzKHgpO1xyXG4gICAgICB4ID0geC50aW1lcyhkNS5wbHVzKHNpbmgyX3gudGltZXMoZDE2LnRpbWVzKHNpbmgyX3gpLnBsdXMoZDIwKSkpKTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIEN0b3IucHJlY2lzaW9uID0gcHI7XHJcbiAgQ3Rvci5yb3VuZGluZyA9IHJtO1xyXG5cclxuICByZXR1cm4gZmluYWxpc2UoeCwgcHIsIHJtLCB0cnVlKTtcclxufTtcclxuXHJcblxyXG4vKlxyXG4gKiBSZXR1cm4gYSBuZXcgRGVjaW1hbCB3aG9zZSB2YWx1ZSBpcyB0aGUgaHlwZXJib2xpYyB0YW5nZW50IG9mIHRoZSB2YWx1ZSBpbiByYWRpYW5zIG9mIHRoaXNcclxuICogRGVjaW1hbC5cclxuICpcclxuICogRG9tYWluOiBbLUluZmluaXR5LCBJbmZpbml0eV1cclxuICogUmFuZ2U6IFstMSwgMV1cclxuICpcclxuICogdGFuaCh4KSA9IHNpbmgoeCkgLyBjb3NoKHgpXHJcbiAqXHJcbiAqIHRhbmgoMCkgICAgICAgICA9IDBcclxuICogdGFuaCgtMCkgICAgICAgID0gLTBcclxuICogdGFuaChJbmZpbml0eSkgID0gMVxyXG4gKiB0YW5oKC1JbmZpbml0eSkgPSAtMVxyXG4gKiB0YW5oKE5hTikgICAgICAgPSBOYU5cclxuICpcclxuICovXHJcblAuaHlwZXJib2xpY1RhbmdlbnQgPSBQLnRhbmggPSBmdW5jdGlvbiAoKSB7XHJcbiAgdmFyIHByLCBybSxcclxuICAgIHggPSB0aGlzLFxyXG4gICAgQ3RvciA9IHguY29uc3RydWN0b3I7XHJcblxyXG4gIGlmICgheC5pc0Zpbml0ZSgpKSByZXR1cm4gbmV3IEN0b3IoeC5zKTtcclxuICBpZiAoeC5pc1plcm8oKSkgcmV0dXJuIG5ldyBDdG9yKHgpO1xyXG5cclxuICBwciA9IEN0b3IucHJlY2lzaW9uO1xyXG4gIHJtID0gQ3Rvci5yb3VuZGluZztcclxuICBDdG9yLnByZWNpc2lvbiA9IHByICsgNztcclxuICBDdG9yLnJvdW5kaW5nID0gMTtcclxuXHJcbiAgcmV0dXJuIGRpdmlkZSh4LnNpbmgoKSwgeC5jb3NoKCksIEN0b3IucHJlY2lzaW9uID0gcHIsIEN0b3Iucm91bmRpbmcgPSBybSk7XHJcbn07XHJcblxyXG5cclxuLypcclxuICogUmV0dXJuIGEgbmV3IERlY2ltYWwgd2hvc2UgdmFsdWUgaXMgdGhlIGFyY2Nvc2luZSAoaW52ZXJzZSBjb3NpbmUpIGluIHJhZGlhbnMgb2YgdGhlIHZhbHVlIG9mXHJcbiAqIHRoaXMgRGVjaW1hbC5cclxuICpcclxuICogRG9tYWluOiBbLTEsIDFdXHJcbiAqIFJhbmdlOiBbMCwgcGldXHJcbiAqXHJcbiAqIGFjb3MoeCkgPSBwaS8yIC0gYXNpbih4KVxyXG4gKlxyXG4gKiBhY29zKDApICAgICAgID0gcGkvMlxyXG4gKiBhY29zKC0wKSAgICAgID0gcGkvMlxyXG4gKiBhY29zKDEpICAgICAgID0gMFxyXG4gKiBhY29zKC0xKSAgICAgID0gcGlcclxuICogYWNvcygxLzIpICAgICA9IHBpLzNcclxuICogYWNvcygtMS8yKSAgICA9IDIqcGkvM1xyXG4gKiBhY29zKHx4fCA+IDEpID0gTmFOXHJcbiAqIGFjb3MoTmFOKSAgICAgPSBOYU5cclxuICpcclxuICovXHJcblAuaW52ZXJzZUNvc2luZSA9IFAuYWNvcyA9IGZ1bmN0aW9uICgpIHtcclxuICB2YXIgaGFsZlBpLFxyXG4gICAgeCA9IHRoaXMsXHJcbiAgICBDdG9yID0geC5jb25zdHJ1Y3RvcixcclxuICAgIGsgPSB4LmFicygpLmNtcCgxKSxcclxuICAgIHByID0gQ3Rvci5wcmVjaXNpb24sXHJcbiAgICBybSA9IEN0b3Iucm91bmRpbmc7XHJcblxyXG4gIGlmIChrICE9PSAtMSkge1xyXG4gICAgcmV0dXJuIGsgPT09IDBcclxuICAgICAgLy8gfHh8IGlzIDFcclxuICAgICAgPyB4LmlzTmVnKCkgPyBnZXRQaShDdG9yLCBwciwgcm0pIDogbmV3IEN0b3IoMClcclxuICAgICAgLy8gfHh8ID4gMSBvciB4IGlzIE5hTlxyXG4gICAgICA6IG5ldyBDdG9yKE5hTik7XHJcbiAgfVxyXG5cclxuICBpZiAoeC5pc1plcm8oKSkgcmV0dXJuIGdldFBpKEN0b3IsIHByICsgNCwgcm0pLnRpbWVzKDAuNSk7XHJcblxyXG4gIC8vIFRPRE8/IFNwZWNpYWwgY2FzZSBhY29zKDAuNSkgPSBwaS8zIGFuZCBhY29zKC0wLjUpID0gMipwaS8zXHJcblxyXG4gIEN0b3IucHJlY2lzaW9uID0gcHIgKyA2O1xyXG4gIEN0b3Iucm91bmRpbmcgPSAxO1xyXG5cclxuICB4ID0geC5hc2luKCk7XHJcbiAgaGFsZlBpID0gZ2V0UGkoQ3RvciwgcHIgKyA0LCBybSkudGltZXMoMC41KTtcclxuXHJcbiAgQ3Rvci5wcmVjaXNpb24gPSBwcjtcclxuICBDdG9yLnJvdW5kaW5nID0gcm07XHJcblxyXG4gIHJldHVybiBoYWxmUGkubWludXMoeCk7XHJcbn07XHJcblxyXG5cclxuLypcclxuICogUmV0dXJuIGEgbmV3IERlY2ltYWwgd2hvc2UgdmFsdWUgaXMgdGhlIGludmVyc2Ugb2YgdGhlIGh5cGVyYm9saWMgY29zaW5lIGluIHJhZGlhbnMgb2YgdGhlXHJcbiAqIHZhbHVlIG9mIHRoaXMgRGVjaW1hbC5cclxuICpcclxuICogRG9tYWluOiBbMSwgSW5maW5pdHldXHJcbiAqIFJhbmdlOiBbMCwgSW5maW5pdHldXHJcbiAqXHJcbiAqIGFjb3NoKHgpID0gbG4oeCArIHNxcnQoeF4yIC0gMSkpXHJcbiAqXHJcbiAqIGFjb3NoKHggPCAxKSAgICAgPSBOYU5cclxuICogYWNvc2goTmFOKSAgICAgICA9IE5hTlxyXG4gKiBhY29zaChJbmZpbml0eSkgID0gSW5maW5pdHlcclxuICogYWNvc2goLUluZmluaXR5KSA9IE5hTlxyXG4gKiBhY29zaCgwKSAgICAgICAgID0gTmFOXHJcbiAqIGFjb3NoKC0wKSAgICAgICAgPSBOYU5cclxuICogYWNvc2goMSkgICAgICAgICA9IDBcclxuICogYWNvc2goLTEpICAgICAgICA9IE5hTlxyXG4gKlxyXG4gKi9cclxuUC5pbnZlcnNlSHlwZXJib2xpY0Nvc2luZSA9IFAuYWNvc2ggPSBmdW5jdGlvbiAoKSB7XHJcbiAgdmFyIHByLCBybSxcclxuICAgIHggPSB0aGlzLFxyXG4gICAgQ3RvciA9IHguY29uc3RydWN0b3I7XHJcblxyXG4gIGlmICh4Lmx0ZSgxKSkgcmV0dXJuIG5ldyBDdG9yKHguZXEoMSkgPyAwIDogTmFOKTtcclxuICBpZiAoIXguaXNGaW5pdGUoKSkgcmV0dXJuIG5ldyBDdG9yKHgpO1xyXG5cclxuICBwciA9IEN0b3IucHJlY2lzaW9uO1xyXG4gIHJtID0gQ3Rvci5yb3VuZGluZztcclxuICBDdG9yLnByZWNpc2lvbiA9IHByICsgTWF0aC5tYXgoTWF0aC5hYnMoeC5lKSwgeC5zZCgpKSArIDQ7XHJcbiAgQ3Rvci5yb3VuZGluZyA9IDE7XHJcbiAgZXh0ZXJuYWwgPSBmYWxzZTtcclxuXHJcbiAgeCA9IHgudGltZXMoeCkubWludXMoMSkuc3FydCgpLnBsdXMoeCk7XHJcblxyXG4gIGV4dGVybmFsID0gdHJ1ZTtcclxuICBDdG9yLnByZWNpc2lvbiA9IHByO1xyXG4gIEN0b3Iucm91bmRpbmcgPSBybTtcclxuXHJcbiAgcmV0dXJuIHgubG4oKTtcclxufTtcclxuXHJcblxyXG4vKlxyXG4gKiBSZXR1cm4gYSBuZXcgRGVjaW1hbCB3aG9zZSB2YWx1ZSBpcyB0aGUgaW52ZXJzZSBvZiB0aGUgaHlwZXJib2xpYyBzaW5lIGluIHJhZGlhbnMgb2YgdGhlIHZhbHVlXHJcbiAqIG9mIHRoaXMgRGVjaW1hbC5cclxuICpcclxuICogRG9tYWluOiBbLUluZmluaXR5LCBJbmZpbml0eV1cclxuICogUmFuZ2U6IFstSW5maW5pdHksIEluZmluaXR5XVxyXG4gKlxyXG4gKiBhc2luaCh4KSA9IGxuKHggKyBzcXJ0KHheMiArIDEpKVxyXG4gKlxyXG4gKiBhc2luaChOYU4pICAgICAgID0gTmFOXHJcbiAqIGFzaW5oKEluZmluaXR5KSAgPSBJbmZpbml0eVxyXG4gKiBhc2luaCgtSW5maW5pdHkpID0gLUluZmluaXR5XHJcbiAqIGFzaW5oKDApICAgICAgICAgPSAwXHJcbiAqIGFzaW5oKC0wKSAgICAgICAgPSAtMFxyXG4gKlxyXG4gKi9cclxuUC5pbnZlcnNlSHlwZXJib2xpY1NpbmUgPSBQLmFzaW5oID0gZnVuY3Rpb24gKCkge1xyXG4gIHZhciBwciwgcm0sXHJcbiAgICB4ID0gdGhpcyxcclxuICAgIEN0b3IgPSB4LmNvbnN0cnVjdG9yO1xyXG5cclxuICBpZiAoIXguaXNGaW5pdGUoKSB8fCB4LmlzWmVybygpKSByZXR1cm4gbmV3IEN0b3IoeCk7XHJcblxyXG4gIHByID0gQ3Rvci5wcmVjaXNpb247XHJcbiAgcm0gPSBDdG9yLnJvdW5kaW5nO1xyXG4gIEN0b3IucHJlY2lzaW9uID0gcHIgKyAyICogTWF0aC5tYXgoTWF0aC5hYnMoeC5lKSwgeC5zZCgpKSArIDY7XHJcbiAgQ3Rvci5yb3VuZGluZyA9IDE7XHJcbiAgZXh0ZXJuYWwgPSBmYWxzZTtcclxuXHJcbiAgeCA9IHgudGltZXMoeCkucGx1cygxKS5zcXJ0KCkucGx1cyh4KTtcclxuXHJcbiAgZXh0ZXJuYWwgPSB0cnVlO1xyXG4gIEN0b3IucHJlY2lzaW9uID0gcHI7XHJcbiAgQ3Rvci5yb3VuZGluZyA9IHJtO1xyXG5cclxuICByZXR1cm4geC5sbigpO1xyXG59O1xyXG5cclxuXHJcbi8qXHJcbiAqIFJldHVybiBhIG5ldyBEZWNpbWFsIHdob3NlIHZhbHVlIGlzIHRoZSBpbnZlcnNlIG9mIHRoZSBoeXBlcmJvbGljIHRhbmdlbnQgaW4gcmFkaWFucyBvZiB0aGVcclxuICogdmFsdWUgb2YgdGhpcyBEZWNpbWFsLlxyXG4gKlxyXG4gKiBEb21haW46IFstMSwgMV1cclxuICogUmFuZ2U6IFstSW5maW5pdHksIEluZmluaXR5XVxyXG4gKlxyXG4gKiBhdGFuaCh4KSA9IDAuNSAqIGxuKCgxICsgeCkgLyAoMSAtIHgpKVxyXG4gKlxyXG4gKiBhdGFuaCh8eHwgPiAxKSAgID0gTmFOXHJcbiAqIGF0YW5oKE5hTikgICAgICAgPSBOYU5cclxuICogYXRhbmgoSW5maW5pdHkpICA9IE5hTlxyXG4gKiBhdGFuaCgtSW5maW5pdHkpID0gTmFOXHJcbiAqIGF0YW5oKDApICAgICAgICAgPSAwXHJcbiAqIGF0YW5oKC0wKSAgICAgICAgPSAtMFxyXG4gKiBhdGFuaCgxKSAgICAgICAgID0gSW5maW5pdHlcclxuICogYXRhbmgoLTEpICAgICAgICA9IC1JbmZpbml0eVxyXG4gKlxyXG4gKi9cclxuUC5pbnZlcnNlSHlwZXJib2xpY1RhbmdlbnQgPSBQLmF0YW5oID0gZnVuY3Rpb24gKCkge1xyXG4gIHZhciBwciwgcm0sIHdwciwgeHNkLFxyXG4gICAgeCA9IHRoaXMsXHJcbiAgICBDdG9yID0geC5jb25zdHJ1Y3RvcjtcclxuXHJcbiAgaWYgKCF4LmlzRmluaXRlKCkpIHJldHVybiBuZXcgQ3RvcihOYU4pO1xyXG4gIGlmICh4LmUgPj0gMCkgcmV0dXJuIG5ldyBDdG9yKHguYWJzKCkuZXEoMSkgPyB4LnMgLyAwIDogeC5pc1plcm8oKSA/IHggOiBOYU4pO1xyXG5cclxuICBwciA9IEN0b3IucHJlY2lzaW9uO1xyXG4gIHJtID0gQ3Rvci5yb3VuZGluZztcclxuICB4c2QgPSB4LnNkKCk7XHJcblxyXG4gIGlmIChNYXRoLm1heCh4c2QsIHByKSA8IDIgKiAteC5lIC0gMSkgcmV0dXJuIGZpbmFsaXNlKG5ldyBDdG9yKHgpLCBwciwgcm0sIHRydWUpO1xyXG5cclxuICBDdG9yLnByZWNpc2lvbiA9IHdwciA9IHhzZCAtIHguZTtcclxuXHJcbiAgeCA9IGRpdmlkZSh4LnBsdXMoMSksIG5ldyBDdG9yKDEpLm1pbnVzKHgpLCB3cHIgKyBwciwgMSk7XHJcblxyXG4gIEN0b3IucHJlY2lzaW9uID0gcHIgKyA0O1xyXG4gIEN0b3Iucm91bmRpbmcgPSAxO1xyXG5cclxuICB4ID0geC5sbigpO1xyXG5cclxuICBDdG9yLnByZWNpc2lvbiA9IHByO1xyXG4gIEN0b3Iucm91bmRpbmcgPSBybTtcclxuXHJcbiAgcmV0dXJuIHgudGltZXMoMC41KTtcclxufTtcclxuXHJcblxyXG4vKlxyXG4gKiBSZXR1cm4gYSBuZXcgRGVjaW1hbCB3aG9zZSB2YWx1ZSBpcyB0aGUgYXJjc2luZSAoaW52ZXJzZSBzaW5lKSBpbiByYWRpYW5zIG9mIHRoZSB2YWx1ZSBvZiB0aGlzXHJcbiAqIERlY2ltYWwuXHJcbiAqXHJcbiAqIERvbWFpbjogWy1JbmZpbml0eSwgSW5maW5pdHldXHJcbiAqIFJhbmdlOiBbLXBpLzIsIHBpLzJdXHJcbiAqXHJcbiAqIGFzaW4oeCkgPSAyKmF0YW4oeC8oMSArIHNxcnQoMSAtIHheMikpKVxyXG4gKlxyXG4gKiBhc2luKDApICAgICAgID0gMFxyXG4gKiBhc2luKC0wKSAgICAgID0gLTBcclxuICogYXNpbigxLzIpICAgICA9IHBpLzZcclxuICogYXNpbigtMS8yKSAgICA9IC1waS82XHJcbiAqIGFzaW4oMSkgICAgICAgPSBwaS8yXHJcbiAqIGFzaW4oLTEpICAgICAgPSAtcGkvMlxyXG4gKiBhc2luKHx4fCA+IDEpID0gTmFOXHJcbiAqIGFzaW4oTmFOKSAgICAgPSBOYU5cclxuICpcclxuICogVE9ETz8gQ29tcGFyZSBwZXJmb3JtYW5jZSBvZiBUYXlsb3Igc2VyaWVzLlxyXG4gKlxyXG4gKi9cclxuUC5pbnZlcnNlU2luZSA9IFAuYXNpbiA9IGZ1bmN0aW9uICgpIHtcclxuICB2YXIgaGFsZlBpLCBrLFxyXG4gICAgcHIsIHJtLFxyXG4gICAgeCA9IHRoaXMsXHJcbiAgICBDdG9yID0geC5jb25zdHJ1Y3RvcjtcclxuXHJcbiAgaWYgKHguaXNaZXJvKCkpIHJldHVybiBuZXcgQ3Rvcih4KTtcclxuXHJcbiAgayA9IHguYWJzKCkuY21wKDEpO1xyXG4gIHByID0gQ3Rvci5wcmVjaXNpb247XHJcbiAgcm0gPSBDdG9yLnJvdW5kaW5nO1xyXG5cclxuICBpZiAoayAhPT0gLTEpIHtcclxuXHJcbiAgICAvLyB8eHwgaXMgMVxyXG4gICAgaWYgKGsgPT09IDApIHtcclxuICAgICAgaGFsZlBpID0gZ2V0UGkoQ3RvciwgcHIgKyA0LCBybSkudGltZXMoMC41KTtcclxuICAgICAgaGFsZlBpLnMgPSB4LnM7XHJcbiAgICAgIHJldHVybiBoYWxmUGk7XHJcbiAgICB9XHJcblxyXG4gICAgLy8gfHh8ID4gMSBvciB4IGlzIE5hTlxyXG4gICAgcmV0dXJuIG5ldyBDdG9yKE5hTik7XHJcbiAgfVxyXG5cclxuICAvLyBUT0RPPyBTcGVjaWFsIGNhc2UgYXNpbigxLzIpID0gcGkvNiBhbmQgYXNpbigtMS8yKSA9IC1waS82XHJcblxyXG4gIEN0b3IucHJlY2lzaW9uID0gcHIgKyA2O1xyXG4gIEN0b3Iucm91bmRpbmcgPSAxO1xyXG5cclxuICB4ID0geC5kaXYobmV3IEN0b3IoMSkubWludXMoeC50aW1lcyh4KSkuc3FydCgpLnBsdXMoMSkpLmF0YW4oKTtcclxuXHJcbiAgQ3Rvci5wcmVjaXNpb24gPSBwcjtcclxuICBDdG9yLnJvdW5kaW5nID0gcm07XHJcblxyXG4gIHJldHVybiB4LnRpbWVzKDIpO1xyXG59O1xyXG5cclxuXHJcbi8qXHJcbiAqIFJldHVybiBhIG5ldyBEZWNpbWFsIHdob3NlIHZhbHVlIGlzIHRoZSBhcmN0YW5nZW50IChpbnZlcnNlIHRhbmdlbnQpIGluIHJhZGlhbnMgb2YgdGhlIHZhbHVlXHJcbiAqIG9mIHRoaXMgRGVjaW1hbC5cclxuICpcclxuICogRG9tYWluOiBbLUluZmluaXR5LCBJbmZpbml0eV1cclxuICogUmFuZ2U6IFstcGkvMiwgcGkvMl1cclxuICpcclxuICogYXRhbih4KSA9IHggLSB4XjMvMyArIHheNS81IC0geF43LzcgKyAuLi5cclxuICpcclxuICogYXRhbigwKSAgICAgICAgID0gMFxyXG4gKiBhdGFuKC0wKSAgICAgICAgPSAtMFxyXG4gKiBhdGFuKDEpICAgICAgICAgPSBwaS80XHJcbiAqIGF0YW4oLTEpICAgICAgICA9IC1waS80XHJcbiAqIGF0YW4oSW5maW5pdHkpICA9IHBpLzJcclxuICogYXRhbigtSW5maW5pdHkpID0gLXBpLzJcclxuICogYXRhbihOYU4pICAgICAgID0gTmFOXHJcbiAqXHJcbiAqL1xyXG5QLmludmVyc2VUYW5nZW50ID0gUC5hdGFuID0gZnVuY3Rpb24gKCkge1xyXG4gIHZhciBpLCBqLCBrLCBuLCBweCwgdCwgciwgd3ByLCB4MixcclxuICAgIHggPSB0aGlzLFxyXG4gICAgQ3RvciA9IHguY29uc3RydWN0b3IsXHJcbiAgICBwciA9IEN0b3IucHJlY2lzaW9uLFxyXG4gICAgcm0gPSBDdG9yLnJvdW5kaW5nO1xyXG5cclxuICBpZiAoIXguaXNGaW5pdGUoKSkge1xyXG4gICAgaWYgKCF4LnMpIHJldHVybiBuZXcgQ3RvcihOYU4pO1xyXG4gICAgaWYgKHByICsgNCA8PSBQSV9QUkVDSVNJT04pIHtcclxuICAgICAgciA9IGdldFBpKEN0b3IsIHByICsgNCwgcm0pLnRpbWVzKDAuNSk7XHJcbiAgICAgIHIucyA9IHgucztcclxuICAgICAgcmV0dXJuIHI7XHJcbiAgICB9XHJcbiAgfSBlbHNlIGlmICh4LmlzWmVybygpKSB7XHJcbiAgICByZXR1cm4gbmV3IEN0b3IoeCk7XHJcbiAgfSBlbHNlIGlmICh4LmFicygpLmVxKDEpICYmIHByICsgNCA8PSBQSV9QUkVDSVNJT04pIHtcclxuICAgIHIgPSBnZXRQaShDdG9yLCBwciArIDQsIHJtKS50aW1lcygwLjI1KTtcclxuICAgIHIucyA9IHgucztcclxuICAgIHJldHVybiByO1xyXG4gIH1cclxuXHJcbiAgQ3Rvci5wcmVjaXNpb24gPSB3cHIgPSBwciArIDEwO1xyXG4gIEN0b3Iucm91bmRpbmcgPSAxO1xyXG5cclxuICAvLyBUT0RPPyBpZiAoeCA+PSAxICYmIHByIDw9IFBJX1BSRUNJU0lPTikgYXRhbih4KSA9IGhhbGZQaSAqIHgucyAtIGF0YW4oMSAvIHgpO1xyXG5cclxuICAvLyBBcmd1bWVudCByZWR1Y3Rpb25cclxuICAvLyBFbnN1cmUgfHh8IDwgMC40MlxyXG4gIC8vIGF0YW4oeCkgPSAyICogYXRhbih4IC8gKDEgKyBzcXJ0KDEgKyB4XjIpKSlcclxuXHJcbiAgayA9IE1hdGgubWluKDI4LCB3cHIgLyBMT0dfQkFTRSArIDIgfCAwKTtcclxuXHJcbiAgZm9yIChpID0gazsgaTsgLS1pKSB4ID0geC5kaXYoeC50aW1lcyh4KS5wbHVzKDEpLnNxcnQoKS5wbHVzKDEpKTtcclxuXHJcbiAgZXh0ZXJuYWwgPSBmYWxzZTtcclxuXHJcbiAgaiA9IE1hdGguY2VpbCh3cHIgLyBMT0dfQkFTRSk7XHJcbiAgbiA9IDE7XHJcbiAgeDIgPSB4LnRpbWVzKHgpO1xyXG4gIHIgPSBuZXcgQ3Rvcih4KTtcclxuICBweCA9IHg7XHJcblxyXG4gIC8vIGF0YW4oeCkgPSB4IC0geF4zLzMgKyB4XjUvNSAtIHheNy83ICsgLi4uXHJcbiAgZm9yICg7IGkgIT09IC0xOykge1xyXG4gICAgcHggPSBweC50aW1lcyh4Mik7XHJcbiAgICB0ID0gci5taW51cyhweC5kaXYobiArPSAyKSk7XHJcblxyXG4gICAgcHggPSBweC50aW1lcyh4Mik7XHJcbiAgICByID0gdC5wbHVzKHB4LmRpdihuICs9IDIpKTtcclxuXHJcbiAgICBpZiAoci5kW2pdICE9PSB2b2lkIDApIGZvciAoaSA9IGo7IHIuZFtpXSA9PT0gdC5kW2ldICYmIGktLTspO1xyXG4gIH1cclxuXHJcbiAgaWYgKGspIHIgPSByLnRpbWVzKDIgPDwgKGsgLSAxKSk7XHJcblxyXG4gIGV4dGVybmFsID0gdHJ1ZTtcclxuXHJcbiAgcmV0dXJuIGZpbmFsaXNlKHIsIEN0b3IucHJlY2lzaW9uID0gcHIsIEN0b3Iucm91bmRpbmcgPSBybSwgdHJ1ZSk7XHJcbn07XHJcblxyXG5cclxuLypcclxuICogUmV0dXJuIHRydWUgaWYgdGhlIHZhbHVlIG9mIHRoaXMgRGVjaW1hbCBpcyBhIGZpbml0ZSBudW1iZXIsIG90aGVyd2lzZSByZXR1cm4gZmFsc2UuXHJcbiAqXHJcbiAqL1xyXG5QLmlzRmluaXRlID0gZnVuY3Rpb24gKCkge1xyXG4gIHJldHVybiAhIXRoaXMuZDtcclxufTtcclxuXHJcblxyXG4vKlxyXG4gKiBSZXR1cm4gdHJ1ZSBpZiB0aGUgdmFsdWUgb2YgdGhpcyBEZWNpbWFsIGlzIGFuIGludGVnZXIsIG90aGVyd2lzZSByZXR1cm4gZmFsc2UuXHJcbiAqXHJcbiAqL1xyXG5QLmlzSW50ZWdlciA9IFAuaXNJbnQgPSBmdW5jdGlvbiAoKSB7XHJcbiAgcmV0dXJuICEhdGhpcy5kICYmIG1hdGhmbG9vcih0aGlzLmUgLyBMT0dfQkFTRSkgPiB0aGlzLmQubGVuZ3RoIC0gMjtcclxufTtcclxuXHJcblxyXG4vKlxyXG4gKiBSZXR1cm4gdHJ1ZSBpZiB0aGUgdmFsdWUgb2YgdGhpcyBEZWNpbWFsIGlzIE5hTiwgb3RoZXJ3aXNlIHJldHVybiBmYWxzZS5cclxuICpcclxuICovXHJcblAuaXNOYU4gPSBmdW5jdGlvbiAoKSB7XHJcbiAgcmV0dXJuICF0aGlzLnM7XHJcbn07XHJcblxyXG5cclxuLypcclxuICogUmV0dXJuIHRydWUgaWYgdGhlIHZhbHVlIG9mIHRoaXMgRGVjaW1hbCBpcyBuZWdhdGl2ZSwgb3RoZXJ3aXNlIHJldHVybiBmYWxzZS5cclxuICpcclxuICovXHJcblAuaXNOZWdhdGl2ZSA9IFAuaXNOZWcgPSBmdW5jdGlvbiAoKSB7XHJcbiAgcmV0dXJuIHRoaXMucyA8IDA7XHJcbn07XHJcblxyXG5cclxuLypcclxuICogUmV0dXJuIHRydWUgaWYgdGhlIHZhbHVlIG9mIHRoaXMgRGVjaW1hbCBpcyBwb3NpdGl2ZSwgb3RoZXJ3aXNlIHJldHVybiBmYWxzZS5cclxuICpcclxuICovXHJcblAuaXNQb3NpdGl2ZSA9IFAuaXNQb3MgPSBmdW5jdGlvbiAoKSB7XHJcbiAgcmV0dXJuIHRoaXMucyA+IDA7XHJcbn07XHJcblxyXG5cclxuLypcclxuICogUmV0dXJuIHRydWUgaWYgdGhlIHZhbHVlIG9mIHRoaXMgRGVjaW1hbCBpcyAwIG9yIC0wLCBvdGhlcndpc2UgcmV0dXJuIGZhbHNlLlxyXG4gKlxyXG4gKi9cclxuUC5pc1plcm8gPSBmdW5jdGlvbiAoKSB7XHJcbiAgcmV0dXJuICEhdGhpcy5kICYmIHRoaXMuZFswXSA9PT0gMDtcclxufTtcclxuXHJcblxyXG4vKlxyXG4gKiBSZXR1cm4gdHJ1ZSBpZiB0aGUgdmFsdWUgb2YgdGhpcyBEZWNpbWFsIGlzIGxlc3MgdGhhbiBgeWAsIG90aGVyd2lzZSByZXR1cm4gZmFsc2UuXHJcbiAqXHJcbiAqL1xyXG5QLmxlc3NUaGFuID0gUC5sdCA9IGZ1bmN0aW9uICh5KSB7XHJcbiAgcmV0dXJuIHRoaXMuY21wKHkpIDwgMDtcclxufTtcclxuXHJcblxyXG4vKlxyXG4gKiBSZXR1cm4gdHJ1ZSBpZiB0aGUgdmFsdWUgb2YgdGhpcyBEZWNpbWFsIGlzIGxlc3MgdGhhbiBvciBlcXVhbCB0byBgeWAsIG90aGVyd2lzZSByZXR1cm4gZmFsc2UuXHJcbiAqXHJcbiAqL1xyXG5QLmxlc3NUaGFuT3JFcXVhbFRvID0gUC5sdGUgPSBmdW5jdGlvbiAoeSkge1xyXG4gIHJldHVybiB0aGlzLmNtcCh5KSA8IDE7XHJcbn07XHJcblxyXG5cclxuLypcclxuICogUmV0dXJuIHRoZSBsb2dhcml0aG0gb2YgdGhlIHZhbHVlIG9mIHRoaXMgRGVjaW1hbCB0byB0aGUgc3BlY2lmaWVkIGJhc2UsIHJvdW5kZWQgdG8gYHByZWNpc2lvbmBcclxuICogc2lnbmlmaWNhbnQgZGlnaXRzIHVzaW5nIHJvdW5kaW5nIG1vZGUgYHJvdW5kaW5nYC5cclxuICpcclxuICogSWYgbm8gYmFzZSBpcyBzcGVjaWZpZWQsIHJldHVybiBsb2dbMTBdKGFyZykuXHJcbiAqXHJcbiAqIGxvZ1tiYXNlXShhcmcpID0gbG4oYXJnKSAvIGxuKGJhc2UpXHJcbiAqXHJcbiAqIFRoZSByZXN1bHQgd2lsbCBhbHdheXMgYmUgY29ycmVjdGx5IHJvdW5kZWQgaWYgdGhlIGJhc2Ugb2YgdGhlIGxvZyBpcyAxMCwgYW5kICdhbG1vc3QgYWx3YXlzJ1xyXG4gKiBvdGhlcndpc2U6XHJcbiAqXHJcbiAqIERlcGVuZGluZyBvbiB0aGUgcm91bmRpbmcgbW9kZSwgdGhlIHJlc3VsdCBtYXkgYmUgaW5jb3JyZWN0bHkgcm91bmRlZCBpZiB0aGUgZmlyc3QgZmlmdGVlblxyXG4gKiByb3VuZGluZyBkaWdpdHMgYXJlIFs0OV05OTk5OTk5OTk5OTk5OSBvciBbNTBdMDAwMDAwMDAwMDAwMDAuIEluIHRoYXQgY2FzZSwgdGhlIG1heGltdW0gZXJyb3JcclxuICogYmV0d2VlbiB0aGUgcmVzdWx0IGFuZCB0aGUgY29ycmVjdGx5IHJvdW5kZWQgcmVzdWx0IHdpbGwgYmUgb25lIHVscCAodW5pdCBpbiB0aGUgbGFzdCBwbGFjZSkuXHJcbiAqXHJcbiAqIGxvZ1stYl0oYSkgICAgICAgPSBOYU5cclxuICogbG9nWzBdKGEpICAgICAgICA9IE5hTlxyXG4gKiBsb2dbMV0oYSkgICAgICAgID0gTmFOXHJcbiAqIGxvZ1tOYU5dKGEpICAgICAgPSBOYU5cclxuICogbG9nW0luZmluaXR5XShhKSA9IE5hTlxyXG4gKiBsb2dbYl0oMCkgICAgICAgID0gLUluZmluaXR5XHJcbiAqIGxvZ1tiXSgtMCkgICAgICAgPSAtSW5maW5pdHlcclxuICogbG9nW2JdKC1hKSAgICAgICA9IE5hTlxyXG4gKiBsb2dbYl0oMSkgICAgICAgID0gMFxyXG4gKiBsb2dbYl0oSW5maW5pdHkpID0gSW5maW5pdHlcclxuICogbG9nW2JdKE5hTikgICAgICA9IE5hTlxyXG4gKlxyXG4gKiBbYmFzZV0ge251bWJlcnxzdHJpbmd8RGVjaW1hbH0gVGhlIGJhc2Ugb2YgdGhlIGxvZ2FyaXRobS5cclxuICpcclxuICovXHJcblAubG9nYXJpdGhtID0gUC5sb2cgPSBmdW5jdGlvbiAoYmFzZSkge1xyXG4gIHZhciBpc0Jhc2UxMCwgZCwgZGVub21pbmF0b3IsIGssIGluZiwgbnVtLCBzZCwgcixcclxuICAgIGFyZyA9IHRoaXMsXHJcbiAgICBDdG9yID0gYXJnLmNvbnN0cnVjdG9yLFxyXG4gICAgcHIgPSBDdG9yLnByZWNpc2lvbixcclxuICAgIHJtID0gQ3Rvci5yb3VuZGluZyxcclxuICAgIGd1YXJkID0gNTtcclxuXHJcbiAgLy8gRGVmYXVsdCBiYXNlIGlzIDEwLlxyXG4gIGlmIChiYXNlID09IG51bGwpIHtcclxuICAgIGJhc2UgPSBuZXcgQ3RvcigxMCk7XHJcbiAgICBpc0Jhc2UxMCA9IHRydWU7XHJcbiAgfSBlbHNlIHtcclxuICAgIGJhc2UgPSBuZXcgQ3RvcihiYXNlKTtcclxuICAgIGQgPSBiYXNlLmQ7XHJcblxyXG4gICAgLy8gUmV0dXJuIE5hTiBpZiBiYXNlIGlzIG5lZ2F0aXZlLCBvciBub24tZmluaXRlLCBvciBpcyAwIG9yIDEuXHJcbiAgICBpZiAoYmFzZS5zIDwgMCB8fCAhZCB8fCAhZFswXSB8fCBiYXNlLmVxKDEpKSByZXR1cm4gbmV3IEN0b3IoTmFOKTtcclxuXHJcbiAgICBpc0Jhc2UxMCA9IGJhc2UuZXEoMTApO1xyXG4gIH1cclxuXHJcbiAgZCA9IGFyZy5kO1xyXG5cclxuICAvLyBJcyBhcmcgbmVnYXRpdmUsIG5vbi1maW5pdGUsIDAgb3IgMT9cclxuICBpZiAoYXJnLnMgPCAwIHx8ICFkIHx8ICFkWzBdIHx8IGFyZy5lcSgxKSkge1xyXG4gICAgcmV0dXJuIG5ldyBDdG9yKGQgJiYgIWRbMF0gPyAtMSAvIDAgOiBhcmcucyAhPSAxID8gTmFOIDogZCA/IDAgOiAxIC8gMCk7XHJcbiAgfVxyXG5cclxuICAvLyBUaGUgcmVzdWx0IHdpbGwgaGF2ZSBhIG5vbi10ZXJtaW5hdGluZyBkZWNpbWFsIGV4cGFuc2lvbiBpZiBiYXNlIGlzIDEwIGFuZCBhcmcgaXMgbm90IGFuXHJcbiAgLy8gaW50ZWdlciBwb3dlciBvZiAxMC5cclxuICBpZiAoaXNCYXNlMTApIHtcclxuICAgIGlmIChkLmxlbmd0aCA+IDEpIHtcclxuICAgICAgaW5mID0gdHJ1ZTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIGZvciAoayA9IGRbMF07IGsgJSAxMCA9PT0gMDspIGsgLz0gMTA7XHJcbiAgICAgIGluZiA9IGsgIT09IDE7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBleHRlcm5hbCA9IGZhbHNlO1xyXG4gIHNkID0gcHIgKyBndWFyZDtcclxuICBudW0gPSBuYXR1cmFsTG9nYXJpdGhtKGFyZywgc2QpO1xyXG4gIGRlbm9taW5hdG9yID0gaXNCYXNlMTAgPyBnZXRMbjEwKEN0b3IsIHNkICsgMTApIDogbmF0dXJhbExvZ2FyaXRobShiYXNlLCBzZCk7XHJcblxyXG4gIC8vIFRoZSByZXN1bHQgd2lsbCBoYXZlIDUgcm91bmRpbmcgZGlnaXRzLlxyXG4gIHIgPSBkaXZpZGUobnVtLCBkZW5vbWluYXRvciwgc2QsIDEpO1xyXG5cclxuICAvLyBJZiBhdCBhIHJvdW5kaW5nIGJvdW5kYXJ5LCBpLmUuIHRoZSByZXN1bHQncyByb3VuZGluZyBkaWdpdHMgYXJlIFs0OV05OTk5IG9yIFs1MF0wMDAwLFxyXG4gIC8vIGNhbGN1bGF0ZSAxMCBmdXJ0aGVyIGRpZ2l0cy5cclxuICAvL1xyXG4gIC8vIElmIHRoZSByZXN1bHQgaXMga25vd24gdG8gaGF2ZSBhbiBpbmZpbml0ZSBkZWNpbWFsIGV4cGFuc2lvbiwgcmVwZWF0IHRoaXMgdW50aWwgaXQgaXMgY2xlYXJcclxuICAvLyB0aGF0IHRoZSByZXN1bHQgaXMgYWJvdmUgb3IgYmVsb3cgdGhlIGJvdW5kYXJ5LiBPdGhlcndpc2UsIGlmIGFmdGVyIGNhbGN1bGF0aW5nIHRoZSAxMFxyXG4gIC8vIGZ1cnRoZXIgZGlnaXRzLCB0aGUgbGFzdCAxNCBhcmUgbmluZXMsIHJvdW5kIHVwIGFuZCBhc3N1bWUgdGhlIHJlc3VsdCBpcyBleGFjdC5cclxuICAvLyBBbHNvIGFzc3VtZSB0aGUgcmVzdWx0IGlzIGV4YWN0IGlmIHRoZSBsYXN0IDE0IGFyZSB6ZXJvLlxyXG4gIC8vXHJcbiAgLy8gRXhhbXBsZSBvZiBhIHJlc3VsdCB0aGF0IHdpbGwgYmUgaW5jb3JyZWN0bHkgcm91bmRlZDpcclxuICAvLyBsb2dbMTA0ODU3Nl0oNDUwMzU5OTYyNzM3MDUwMikgPSAyLjYwMDAwMDAwMDAwMDAwMDA5NjEwMjc5NTExNDQ0NzQ2Li4uXHJcbiAgLy8gVGhlIGFib3ZlIHJlc3VsdCBjb3JyZWN0bHkgcm91bmRlZCB1c2luZyBST1VORF9DRUlMIHRvIDEgZGVjaW1hbCBwbGFjZSBzaG91bGQgYmUgMi43LCBidXQgaXRcclxuICAvLyB3aWxsIGJlIGdpdmVuIGFzIDIuNiBhcyB0aGVyZSBhcmUgMTUgemVyb3MgaW1tZWRpYXRlbHkgYWZ0ZXIgdGhlIHJlcXVlc3RlZCBkZWNpbWFsIHBsYWNlLCBzb1xyXG4gIC8vIHRoZSBleGFjdCByZXN1bHQgd291bGQgYmUgYXNzdW1lZCB0byBiZSAyLjYsIHdoaWNoIHJvdW5kZWQgdXNpbmcgUk9VTkRfQ0VJTCB0byAxIGRlY2ltYWxcclxuICAvLyBwbGFjZSBpcyBzdGlsbCAyLjYuXHJcbiAgaWYgKGNoZWNrUm91bmRpbmdEaWdpdHMoci5kLCBrID0gcHIsIHJtKSkge1xyXG5cclxuICAgIGRvIHtcclxuICAgICAgc2QgKz0gMTA7XHJcbiAgICAgIG51bSA9IG5hdHVyYWxMb2dhcml0aG0oYXJnLCBzZCk7XHJcbiAgICAgIGRlbm9taW5hdG9yID0gaXNCYXNlMTAgPyBnZXRMbjEwKEN0b3IsIHNkICsgMTApIDogbmF0dXJhbExvZ2FyaXRobShiYXNlLCBzZCk7XHJcbiAgICAgIHIgPSBkaXZpZGUobnVtLCBkZW5vbWluYXRvciwgc2QsIDEpO1xyXG5cclxuICAgICAgaWYgKCFpbmYpIHtcclxuXHJcbiAgICAgICAgLy8gQ2hlY2sgZm9yIDE0IG5pbmVzIGZyb20gdGhlIDJuZCByb3VuZGluZyBkaWdpdCwgYXMgdGhlIGZpcnN0IG1heSBiZSA0LlxyXG4gICAgICAgIGlmICgrZGlnaXRzVG9TdHJpbmcoci5kKS5zbGljZShrICsgMSwgayArIDE1KSArIDEgPT0gMWUxNCkge1xyXG4gICAgICAgICAgciA9IGZpbmFsaXNlKHIsIHByICsgMSwgMCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBicmVhaztcclxuICAgICAgfVxyXG4gICAgfSB3aGlsZSAoY2hlY2tSb3VuZGluZ0RpZ2l0cyhyLmQsIGsgKz0gMTAsIHJtKSk7XHJcbiAgfVxyXG5cclxuICBleHRlcm5hbCA9IHRydWU7XHJcblxyXG4gIHJldHVybiBmaW5hbGlzZShyLCBwciwgcm0pO1xyXG59O1xyXG5cclxuXHJcbi8qXHJcbiAqIFJldHVybiBhIG5ldyBEZWNpbWFsIHdob3NlIHZhbHVlIGlzIHRoZSBtYXhpbXVtIG9mIHRoZSBhcmd1bWVudHMgYW5kIHRoZSB2YWx1ZSBvZiB0aGlzIERlY2ltYWwuXHJcbiAqXHJcbiAqIGFyZ3VtZW50cyB7bnVtYmVyfHN0cmluZ3xEZWNpbWFsfVxyXG4gKlxyXG5QLm1heCA9IGZ1bmN0aW9uICgpIHtcclxuICBBcnJheS5wcm90b3R5cGUucHVzaC5jYWxsKGFyZ3VtZW50cywgdGhpcyk7XHJcbiAgcmV0dXJuIG1heE9yTWluKHRoaXMuY29uc3RydWN0b3IsIGFyZ3VtZW50cywgJ2x0Jyk7XHJcbn07XHJcbiAqL1xyXG5cclxuXHJcbi8qXHJcbiAqIFJldHVybiBhIG5ldyBEZWNpbWFsIHdob3NlIHZhbHVlIGlzIHRoZSBtaW5pbXVtIG9mIHRoZSBhcmd1bWVudHMgYW5kIHRoZSB2YWx1ZSBvZiB0aGlzIERlY2ltYWwuXHJcbiAqXHJcbiAqIGFyZ3VtZW50cyB7bnVtYmVyfHN0cmluZ3xEZWNpbWFsfVxyXG4gKlxyXG5QLm1pbiA9IGZ1bmN0aW9uICgpIHtcclxuICBBcnJheS5wcm90b3R5cGUucHVzaC5jYWxsKGFyZ3VtZW50cywgdGhpcyk7XHJcbiAgcmV0dXJuIG1heE9yTWluKHRoaXMuY29uc3RydWN0b3IsIGFyZ3VtZW50cywgJ2d0Jyk7XHJcbn07XHJcbiAqL1xyXG5cclxuXHJcbi8qXHJcbiAqICBuIC0gMCA9IG5cclxuICogIG4gLSBOID0gTlxyXG4gKiAgbiAtIEkgPSAtSVxyXG4gKiAgMCAtIG4gPSAtblxyXG4gKiAgMCAtIDAgPSAwXHJcbiAqICAwIC0gTiA9IE5cclxuICogIDAgLSBJID0gLUlcclxuICogIE4gLSBuID0gTlxyXG4gKiAgTiAtIDAgPSBOXHJcbiAqICBOIC0gTiA9IE5cclxuICogIE4gLSBJID0gTlxyXG4gKiAgSSAtIG4gPSBJXHJcbiAqICBJIC0gMCA9IElcclxuICogIEkgLSBOID0gTlxyXG4gKiAgSSAtIEkgPSBOXHJcbiAqXHJcbiAqIFJldHVybiBhIG5ldyBEZWNpbWFsIHdob3NlIHZhbHVlIGlzIHRoZSB2YWx1ZSBvZiB0aGlzIERlY2ltYWwgbWludXMgYHlgLCByb3VuZGVkIHRvIGBwcmVjaXNpb25gXHJcbiAqIHNpZ25pZmljYW50IGRpZ2l0cyB1c2luZyByb3VuZGluZyBtb2RlIGByb3VuZGluZ2AuXHJcbiAqXHJcbiAqL1xyXG5QLm1pbnVzID0gUC5zdWIgPSBmdW5jdGlvbiAoeSkge1xyXG4gIHZhciBkLCBlLCBpLCBqLCBrLCBsZW4sIHByLCBybSwgeGQsIHhlLCB4TFR5LCB5ZCxcclxuICAgIHggPSB0aGlzLFxyXG4gICAgQ3RvciA9IHguY29uc3RydWN0b3I7XHJcblxyXG4gIHkgPSBuZXcgQ3Rvcih5KTtcclxuXHJcbiAgLy8gSWYgZWl0aGVyIGlzIG5vdCBmaW5pdGUuLi5cclxuICBpZiAoIXguZCB8fCAheS5kKSB7XHJcblxyXG4gICAgLy8gUmV0dXJuIE5hTiBpZiBlaXRoZXIgaXMgTmFOLlxyXG4gICAgaWYgKCF4LnMgfHwgIXkucykgeSA9IG5ldyBDdG9yKE5hTik7XHJcblxyXG4gICAgLy8gUmV0dXJuIHkgbmVnYXRlZCBpZiB4IGlzIGZpbml0ZSBhbmQgeSBpcyBcdTAwQjFJbmZpbml0eS5cclxuICAgIGVsc2UgaWYgKHguZCkgeS5zID0gLXkucztcclxuXHJcbiAgICAvLyBSZXR1cm4geCBpZiB5IGlzIGZpbml0ZSBhbmQgeCBpcyBcdTAwQjFJbmZpbml0eS5cclxuICAgIC8vIFJldHVybiB4IGlmIGJvdGggYXJlIFx1MDBCMUluZmluaXR5IHdpdGggZGlmZmVyZW50IHNpZ25zLlxyXG4gICAgLy8gUmV0dXJuIE5hTiBpZiBib3RoIGFyZSBcdTAwQjFJbmZpbml0eSB3aXRoIHRoZSBzYW1lIHNpZ24uXHJcbiAgICBlbHNlIHkgPSBuZXcgQ3Rvcih5LmQgfHwgeC5zICE9PSB5LnMgPyB4IDogTmFOKTtcclxuXHJcbiAgICByZXR1cm4geTtcclxuICB9XHJcblxyXG4gIC8vIElmIHNpZ25zIGRpZmZlci4uLlxyXG4gIGlmICh4LnMgIT0geS5zKSB7XHJcbiAgICB5LnMgPSAteS5zO1xyXG4gICAgcmV0dXJuIHgucGx1cyh5KTtcclxuICB9XHJcblxyXG4gIHhkID0geC5kO1xyXG4gIHlkID0geS5kO1xyXG4gIHByID0gQ3Rvci5wcmVjaXNpb247XHJcbiAgcm0gPSBDdG9yLnJvdW5kaW5nO1xyXG5cclxuICAvLyBJZiBlaXRoZXIgaXMgemVyby4uLlxyXG4gIGlmICgheGRbMF0gfHwgIXlkWzBdKSB7XHJcblxyXG4gICAgLy8gUmV0dXJuIHkgbmVnYXRlZCBpZiB4IGlzIHplcm8gYW5kIHkgaXMgbm9uLXplcm8uXHJcbiAgICBpZiAoeWRbMF0pIHkucyA9IC15LnM7XHJcblxyXG4gICAgLy8gUmV0dXJuIHggaWYgeSBpcyB6ZXJvIGFuZCB4IGlzIG5vbi16ZXJvLlxyXG4gICAgZWxzZSBpZiAoeGRbMF0pIHkgPSBuZXcgQ3Rvcih4KTtcclxuXHJcbiAgICAvLyBSZXR1cm4gemVybyBpZiBib3RoIGFyZSB6ZXJvLlxyXG4gICAgLy8gRnJvbSBJRUVFIDc1NCAoMjAwOCkgNi4zOiAwIC0gMCA9IC0wIC0gLTAgPSAtMCB3aGVuIHJvdW5kaW5nIHRvIC1JbmZpbml0eS5cclxuICAgIGVsc2UgcmV0dXJuIG5ldyBDdG9yKHJtID09PSAzID8gLTAgOiAwKTtcclxuXHJcbiAgICByZXR1cm4gZXh0ZXJuYWwgPyBmaW5hbGlzZSh5LCBwciwgcm0pIDogeTtcclxuICB9XHJcblxyXG4gIC8vIHggYW5kIHkgYXJlIGZpbml0ZSwgbm9uLXplcm8gbnVtYmVycyB3aXRoIHRoZSBzYW1lIHNpZ24uXHJcblxyXG4gIC8vIENhbGN1bGF0ZSBiYXNlIDFlNyBleHBvbmVudHMuXHJcbiAgZSA9IG1hdGhmbG9vcih5LmUgLyBMT0dfQkFTRSk7XHJcbiAgeGUgPSBtYXRoZmxvb3IoeC5lIC8gTE9HX0JBU0UpO1xyXG5cclxuICB4ZCA9IHhkLnNsaWNlKCk7XHJcbiAgayA9IHhlIC0gZTtcclxuXHJcbiAgLy8gSWYgYmFzZSAxZTcgZXhwb25lbnRzIGRpZmZlci4uLlxyXG4gIGlmIChrKSB7XHJcbiAgICB4TFR5ID0gayA8IDA7XHJcblxyXG4gICAgaWYgKHhMVHkpIHtcclxuICAgICAgZCA9IHhkO1xyXG4gICAgICBrID0gLWs7XHJcbiAgICAgIGxlbiA9IHlkLmxlbmd0aDtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIGQgPSB5ZDtcclxuICAgICAgZSA9IHhlO1xyXG4gICAgICBsZW4gPSB4ZC5sZW5ndGg7XHJcbiAgICB9XHJcblxyXG4gICAgLy8gTnVtYmVycyB3aXRoIG1hc3NpdmVseSBkaWZmZXJlbnQgZXhwb25lbnRzIHdvdWxkIHJlc3VsdCBpbiBhIHZlcnkgaGlnaCBudW1iZXIgb2ZcclxuICAgIC8vIHplcm9zIG5lZWRpbmcgdG8gYmUgcHJlcGVuZGVkLCBidXQgdGhpcyBjYW4gYmUgYXZvaWRlZCB3aGlsZSBzdGlsbCBlbnN1cmluZyBjb3JyZWN0XHJcbiAgICAvLyByb3VuZGluZyBieSBsaW1pdGluZyB0aGUgbnVtYmVyIG9mIHplcm9zIHRvIGBNYXRoLmNlaWwocHIgLyBMT0dfQkFTRSkgKyAyYC5cclxuICAgIGkgPSBNYXRoLm1heChNYXRoLmNlaWwocHIgLyBMT0dfQkFTRSksIGxlbikgKyAyO1xyXG5cclxuICAgIGlmIChrID4gaSkge1xyXG4gICAgICBrID0gaTtcclxuICAgICAgZC5sZW5ndGggPSAxO1xyXG4gICAgfVxyXG5cclxuICAgIC8vIFByZXBlbmQgemVyb3MgdG8gZXF1YWxpc2UgZXhwb25lbnRzLlxyXG4gICAgZC5yZXZlcnNlKCk7XHJcbiAgICBmb3IgKGkgPSBrOyBpLS07KSBkLnB1c2goMCk7XHJcbiAgICBkLnJldmVyc2UoKTtcclxuXHJcbiAgLy8gQmFzZSAxZTcgZXhwb25lbnRzIGVxdWFsLlxyXG4gIH0gZWxzZSB7XHJcblxyXG4gICAgLy8gQ2hlY2sgZGlnaXRzIHRvIGRldGVybWluZSB3aGljaCBpcyB0aGUgYmlnZ2VyIG51bWJlci5cclxuXHJcbiAgICBpID0geGQubGVuZ3RoO1xyXG4gICAgbGVuID0geWQubGVuZ3RoO1xyXG4gICAgeExUeSA9IGkgPCBsZW47XHJcbiAgICBpZiAoeExUeSkgbGVuID0gaTtcclxuXHJcbiAgICBmb3IgKGkgPSAwOyBpIDwgbGVuOyBpKyspIHtcclxuICAgICAgaWYgKHhkW2ldICE9IHlkW2ldKSB7XHJcbiAgICAgICAgeExUeSA9IHhkW2ldIDwgeWRbaV07XHJcbiAgICAgICAgYnJlYWs7XHJcbiAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBrID0gMDtcclxuICB9XHJcblxyXG4gIGlmICh4TFR5KSB7XHJcbiAgICBkID0geGQ7XHJcbiAgICB4ZCA9IHlkO1xyXG4gICAgeWQgPSBkO1xyXG4gICAgeS5zID0gLXkucztcclxuICB9XHJcblxyXG4gIGxlbiA9IHhkLmxlbmd0aDtcclxuXHJcbiAgLy8gQXBwZW5kIHplcm9zIHRvIGB4ZGAgaWYgc2hvcnRlci5cclxuICAvLyBEb24ndCBhZGQgemVyb3MgdG8gYHlkYCBpZiBzaG9ydGVyIGFzIHN1YnRyYWN0aW9uIG9ubHkgbmVlZHMgdG8gc3RhcnQgYXQgYHlkYCBsZW5ndGguXHJcbiAgZm9yIChpID0geWQubGVuZ3RoIC0gbGVuOyBpID4gMDsgLS1pKSB4ZFtsZW4rK10gPSAwO1xyXG5cclxuICAvLyBTdWJ0cmFjdCB5ZCBmcm9tIHhkLlxyXG4gIGZvciAoaSA9IHlkLmxlbmd0aDsgaSA+IGs7KSB7XHJcblxyXG4gICAgaWYgKHhkWy0taV0gPCB5ZFtpXSkge1xyXG4gICAgICBmb3IgKGogPSBpOyBqICYmIHhkWy0tal0gPT09IDA7KSB4ZFtqXSA9IEJBU0UgLSAxO1xyXG4gICAgICAtLXhkW2pdO1xyXG4gICAgICB4ZFtpXSArPSBCQVNFO1xyXG4gICAgfVxyXG5cclxuICAgIHhkW2ldIC09IHlkW2ldO1xyXG4gIH1cclxuXHJcbiAgLy8gUmVtb3ZlIHRyYWlsaW5nIHplcm9zLlxyXG4gIGZvciAoOyB4ZFstLWxlbl0gPT09IDA7KSB4ZC5wb3AoKTtcclxuXHJcbiAgLy8gUmVtb3ZlIGxlYWRpbmcgemVyb3MgYW5kIGFkanVzdCBleHBvbmVudCBhY2NvcmRpbmdseS5cclxuICBmb3IgKDsgeGRbMF0gPT09IDA7IHhkLnNoaWZ0KCkpIC0tZTtcclxuXHJcbiAgLy8gWmVybz9cclxuICBpZiAoIXhkWzBdKSByZXR1cm4gbmV3IEN0b3Iocm0gPT09IDMgPyAtMCA6IDApO1xyXG5cclxuICB5LmQgPSB4ZDtcclxuICB5LmUgPSBnZXRCYXNlMTBFeHBvbmVudCh4ZCwgZSk7XHJcblxyXG4gIHJldHVybiBleHRlcm5hbCA/IGZpbmFsaXNlKHksIHByLCBybSkgOiB5O1xyXG59O1xyXG5cclxuXHJcbi8qXHJcbiAqICAgbiAlIDAgPSAgTlxyXG4gKiAgIG4gJSBOID0gIE5cclxuICogICBuICUgSSA9ICBuXHJcbiAqICAgMCAlIG4gPSAgMFxyXG4gKiAgLTAgJSBuID0gLTBcclxuICogICAwICUgMCA9ICBOXHJcbiAqICAgMCAlIE4gPSAgTlxyXG4gKiAgIDAgJSBJID0gIDBcclxuICogICBOICUgbiA9ICBOXHJcbiAqICAgTiAlIDAgPSAgTlxyXG4gKiAgIE4gJSBOID0gIE5cclxuICogICBOICUgSSA9ICBOXHJcbiAqICAgSSAlIG4gPSAgTlxyXG4gKiAgIEkgJSAwID0gIE5cclxuICogICBJICUgTiA9ICBOXHJcbiAqICAgSSAlIEkgPSAgTlxyXG4gKlxyXG4gKiBSZXR1cm4gYSBuZXcgRGVjaW1hbCB3aG9zZSB2YWx1ZSBpcyB0aGUgdmFsdWUgb2YgdGhpcyBEZWNpbWFsIG1vZHVsbyBgeWAsIHJvdW5kZWQgdG9cclxuICogYHByZWNpc2lvbmAgc2lnbmlmaWNhbnQgZGlnaXRzIHVzaW5nIHJvdW5kaW5nIG1vZGUgYHJvdW5kaW5nYC5cclxuICpcclxuICogVGhlIHJlc3VsdCBkZXBlbmRzIG9uIHRoZSBtb2R1bG8gbW9kZS5cclxuICpcclxuICovXHJcblAubW9kdWxvID0gUC5tb2QgPSBmdW5jdGlvbiAoeSkge1xyXG4gIHZhciBxLFxyXG4gICAgeCA9IHRoaXMsXHJcbiAgICBDdG9yID0geC5jb25zdHJ1Y3RvcjtcclxuXHJcbiAgeSA9IG5ldyBDdG9yKHkpO1xyXG5cclxuICAvLyBSZXR1cm4gTmFOIGlmIHggaXMgXHUwMEIxSW5maW5pdHkgb3IgTmFOLCBvciB5IGlzIE5hTiBvciBcdTAwQjEwLlxyXG4gIGlmICgheC5kIHx8ICF5LnMgfHwgeS5kICYmICF5LmRbMF0pIHJldHVybiBuZXcgQ3RvcihOYU4pO1xyXG5cclxuICAvLyBSZXR1cm4geCBpZiB5IGlzIFx1MDBCMUluZmluaXR5IG9yIHggaXMgXHUwMEIxMC5cclxuICBpZiAoIXkuZCB8fCB4LmQgJiYgIXguZFswXSkge1xyXG4gICAgcmV0dXJuIGZpbmFsaXNlKG5ldyBDdG9yKHgpLCBDdG9yLnByZWNpc2lvbiwgQ3Rvci5yb3VuZGluZyk7XHJcbiAgfVxyXG5cclxuICAvLyBQcmV2ZW50IHJvdW5kaW5nIG9mIGludGVybWVkaWF0ZSBjYWxjdWxhdGlvbnMuXHJcbiAgZXh0ZXJuYWwgPSBmYWxzZTtcclxuXHJcbiAgaWYgKEN0b3IubW9kdWxvID09IDkpIHtcclxuXHJcbiAgICAvLyBFdWNsaWRpYW4gZGl2aXNpb246IHEgPSBzaWduKHkpICogZmxvb3IoeCAvIGFicyh5KSlcclxuICAgIC8vIHJlc3VsdCA9IHggLSBxICogeSAgICB3aGVyZSAgMCA8PSByZXN1bHQgPCBhYnMoeSlcclxuICAgIHEgPSBkaXZpZGUoeCwgeS5hYnMoKSwgMCwgMywgMSk7XHJcbiAgICBxLnMgKj0geS5zO1xyXG4gIH0gZWxzZSB7XHJcbiAgICBxID0gZGl2aWRlKHgsIHksIDAsIEN0b3IubW9kdWxvLCAxKTtcclxuICB9XHJcblxyXG4gIHEgPSBxLnRpbWVzKHkpO1xyXG5cclxuICBleHRlcm5hbCA9IHRydWU7XHJcblxyXG4gIHJldHVybiB4Lm1pbnVzKHEpO1xyXG59O1xyXG5cclxuXHJcbi8qXHJcbiAqIFJldHVybiBhIG5ldyBEZWNpbWFsIHdob3NlIHZhbHVlIGlzIHRoZSBuYXR1cmFsIGV4cG9uZW50aWFsIG9mIHRoZSB2YWx1ZSBvZiB0aGlzIERlY2ltYWwsXHJcbiAqIGkuZS4gdGhlIGJhc2UgZSByYWlzZWQgdG8gdGhlIHBvd2VyIHRoZSB2YWx1ZSBvZiB0aGlzIERlY2ltYWwsIHJvdW5kZWQgdG8gYHByZWNpc2lvbmBcclxuICogc2lnbmlmaWNhbnQgZGlnaXRzIHVzaW5nIHJvdW5kaW5nIG1vZGUgYHJvdW5kaW5nYC5cclxuICpcclxuICovXHJcblAubmF0dXJhbEV4cG9uZW50aWFsID0gUC5leHAgPSBmdW5jdGlvbiAoKSB7XHJcbiAgcmV0dXJuIG5hdHVyYWxFeHBvbmVudGlhbCh0aGlzKTtcclxufTtcclxuXHJcblxyXG4vKlxyXG4gKiBSZXR1cm4gYSBuZXcgRGVjaW1hbCB3aG9zZSB2YWx1ZSBpcyB0aGUgbmF0dXJhbCBsb2dhcml0aG0gb2YgdGhlIHZhbHVlIG9mIHRoaXMgRGVjaW1hbCxcclxuICogcm91bmRlZCB0byBgcHJlY2lzaW9uYCBzaWduaWZpY2FudCBkaWdpdHMgdXNpbmcgcm91bmRpbmcgbW9kZSBgcm91bmRpbmdgLlxyXG4gKlxyXG4gKi9cclxuUC5uYXR1cmFsTG9nYXJpdGhtID0gUC5sbiA9IGZ1bmN0aW9uICgpIHtcclxuICByZXR1cm4gbmF0dXJhbExvZ2FyaXRobSh0aGlzKTtcclxufTtcclxuXHJcblxyXG4vKlxyXG4gKiBSZXR1cm4gYSBuZXcgRGVjaW1hbCB3aG9zZSB2YWx1ZSBpcyB0aGUgdmFsdWUgb2YgdGhpcyBEZWNpbWFsIG5lZ2F0ZWQsIGkuZS4gYXMgaWYgbXVsdGlwbGllZCBieVxyXG4gKiAtMS5cclxuICpcclxuICovXHJcblAubmVnYXRlZCA9IFAubmVnID0gZnVuY3Rpb24gKCkge1xyXG4gIHZhciB4ID0gbmV3IHRoaXMuY29uc3RydWN0b3IodGhpcyk7XHJcbiAgeC5zID0gLXgucztcclxuICByZXR1cm4gZmluYWxpc2UoeCk7XHJcbn07XHJcblxyXG5cclxuLypcclxuICogIG4gKyAwID0gblxyXG4gKiAgbiArIE4gPSBOXHJcbiAqICBuICsgSSA9IElcclxuICogIDAgKyBuID0gblxyXG4gKiAgMCArIDAgPSAwXHJcbiAqICAwICsgTiA9IE5cclxuICogIDAgKyBJID0gSVxyXG4gKiAgTiArIG4gPSBOXHJcbiAqICBOICsgMCA9IE5cclxuICogIE4gKyBOID0gTlxyXG4gKiAgTiArIEkgPSBOXHJcbiAqICBJICsgbiA9IElcclxuICogIEkgKyAwID0gSVxyXG4gKiAgSSArIE4gPSBOXHJcbiAqICBJICsgSSA9IElcclxuICpcclxuICogUmV0dXJuIGEgbmV3IERlY2ltYWwgd2hvc2UgdmFsdWUgaXMgdGhlIHZhbHVlIG9mIHRoaXMgRGVjaW1hbCBwbHVzIGB5YCwgcm91bmRlZCB0byBgcHJlY2lzaW9uYFxyXG4gKiBzaWduaWZpY2FudCBkaWdpdHMgdXNpbmcgcm91bmRpbmcgbW9kZSBgcm91bmRpbmdgLlxyXG4gKlxyXG4gKi9cclxuUC5wbHVzID0gUC5hZGQgPSBmdW5jdGlvbiAoeSkge1xyXG4gIHZhciBjYXJyeSwgZCwgZSwgaSwgaywgbGVuLCBwciwgcm0sIHhkLCB5ZCxcclxuICAgIHggPSB0aGlzLFxyXG4gICAgQ3RvciA9IHguY29uc3RydWN0b3I7XHJcblxyXG4gIHkgPSBuZXcgQ3Rvcih5KTtcclxuXHJcbiAgLy8gSWYgZWl0aGVyIGlzIG5vdCBmaW5pdGUuLi5cclxuICBpZiAoIXguZCB8fCAheS5kKSB7XHJcblxyXG4gICAgLy8gUmV0dXJuIE5hTiBpZiBlaXRoZXIgaXMgTmFOLlxyXG4gICAgaWYgKCF4LnMgfHwgIXkucykgeSA9IG5ldyBDdG9yKE5hTik7XHJcblxyXG4gICAgLy8gUmV0dXJuIHggaWYgeSBpcyBmaW5pdGUgYW5kIHggaXMgXHUwMEIxSW5maW5pdHkuXHJcbiAgICAvLyBSZXR1cm4geCBpZiBib3RoIGFyZSBcdTAwQjFJbmZpbml0eSB3aXRoIHRoZSBzYW1lIHNpZ24uXHJcbiAgICAvLyBSZXR1cm4gTmFOIGlmIGJvdGggYXJlIFx1MDBCMUluZmluaXR5IHdpdGggZGlmZmVyZW50IHNpZ25zLlxyXG4gICAgLy8gUmV0dXJuIHkgaWYgeCBpcyBmaW5pdGUgYW5kIHkgaXMgXHUwMEIxSW5maW5pdHkuXHJcbiAgICBlbHNlIGlmICgheC5kKSB5ID0gbmV3IEN0b3IoeS5kIHx8IHgucyA9PT0geS5zID8geCA6IE5hTik7XHJcblxyXG4gICAgcmV0dXJuIHk7XHJcbiAgfVxyXG5cclxuICAgLy8gSWYgc2lnbnMgZGlmZmVyLi4uXHJcbiAgaWYgKHgucyAhPSB5LnMpIHtcclxuICAgIHkucyA9IC15LnM7XHJcbiAgICByZXR1cm4geC5taW51cyh5KTtcclxuICB9XHJcblxyXG4gIHhkID0geC5kO1xyXG4gIHlkID0geS5kO1xyXG4gIHByID0gQ3Rvci5wcmVjaXNpb247XHJcbiAgcm0gPSBDdG9yLnJvdW5kaW5nO1xyXG5cclxuICAvLyBJZiBlaXRoZXIgaXMgemVyby4uLlxyXG4gIGlmICgheGRbMF0gfHwgIXlkWzBdKSB7XHJcblxyXG4gICAgLy8gUmV0dXJuIHggaWYgeSBpcyB6ZXJvLlxyXG4gICAgLy8gUmV0dXJuIHkgaWYgeSBpcyBub24temVyby5cclxuICAgIGlmICgheWRbMF0pIHkgPSBuZXcgQ3Rvcih4KTtcclxuXHJcbiAgICByZXR1cm4gZXh0ZXJuYWwgPyBmaW5hbGlzZSh5LCBwciwgcm0pIDogeTtcclxuICB9XHJcblxyXG4gIC8vIHggYW5kIHkgYXJlIGZpbml0ZSwgbm9uLXplcm8gbnVtYmVycyB3aXRoIHRoZSBzYW1lIHNpZ24uXHJcblxyXG4gIC8vIENhbGN1bGF0ZSBiYXNlIDFlNyBleHBvbmVudHMuXHJcbiAgayA9IG1hdGhmbG9vcih4LmUgLyBMT0dfQkFTRSk7XHJcbiAgZSA9IG1hdGhmbG9vcih5LmUgLyBMT0dfQkFTRSk7XHJcblxyXG4gIHhkID0geGQuc2xpY2UoKTtcclxuICBpID0gayAtIGU7XHJcblxyXG4gIC8vIElmIGJhc2UgMWU3IGV4cG9uZW50cyBkaWZmZXIuLi5cclxuICBpZiAoaSkge1xyXG5cclxuICAgIGlmIChpIDwgMCkge1xyXG4gICAgICBkID0geGQ7XHJcbiAgICAgIGkgPSAtaTtcclxuICAgICAgbGVuID0geWQubGVuZ3RoO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgZCA9IHlkO1xyXG4gICAgICBlID0gaztcclxuICAgICAgbGVuID0geGQubGVuZ3RoO1xyXG4gICAgfVxyXG5cclxuICAgIC8vIExpbWl0IG51bWJlciBvZiB6ZXJvcyBwcmVwZW5kZWQgdG8gbWF4KGNlaWwocHIgLyBMT0dfQkFTRSksIGxlbikgKyAxLlxyXG4gICAgayA9IE1hdGguY2VpbChwciAvIExPR19CQVNFKTtcclxuICAgIGxlbiA9IGsgPiBsZW4gPyBrICsgMSA6IGxlbiArIDE7XHJcblxyXG4gICAgaWYgKGkgPiBsZW4pIHtcclxuICAgICAgaSA9IGxlbjtcclxuICAgICAgZC5sZW5ndGggPSAxO1xyXG4gICAgfVxyXG5cclxuICAgIC8vIFByZXBlbmQgemVyb3MgdG8gZXF1YWxpc2UgZXhwb25lbnRzLiBOb3RlOiBGYXN0ZXIgdG8gdXNlIHJldmVyc2UgdGhlbiBkbyB1bnNoaWZ0cy5cclxuICAgIGQucmV2ZXJzZSgpO1xyXG4gICAgZm9yICg7IGktLTspIGQucHVzaCgwKTtcclxuICAgIGQucmV2ZXJzZSgpO1xyXG4gIH1cclxuXHJcbiAgbGVuID0geGQubGVuZ3RoO1xyXG4gIGkgPSB5ZC5sZW5ndGg7XHJcblxyXG4gIC8vIElmIHlkIGlzIGxvbmdlciB0aGFuIHhkLCBzd2FwIHhkIGFuZCB5ZCBzbyB4ZCBwb2ludHMgdG8gdGhlIGxvbmdlciBhcnJheS5cclxuICBpZiAobGVuIC0gaSA8IDApIHtcclxuICAgIGkgPSBsZW47XHJcbiAgICBkID0geWQ7XHJcbiAgICB5ZCA9IHhkO1xyXG4gICAgeGQgPSBkO1xyXG4gIH1cclxuXHJcbiAgLy8gT25seSBzdGFydCBhZGRpbmcgYXQgeWQubGVuZ3RoIC0gMSBhcyB0aGUgZnVydGhlciBkaWdpdHMgb2YgeGQgY2FuIGJlIGxlZnQgYXMgdGhleSBhcmUuXHJcbiAgZm9yIChjYXJyeSA9IDA7IGk7KSB7XHJcbiAgICBjYXJyeSA9ICh4ZFstLWldID0geGRbaV0gKyB5ZFtpXSArIGNhcnJ5KSAvIEJBU0UgfCAwO1xyXG4gICAgeGRbaV0gJT0gQkFTRTtcclxuICB9XHJcblxyXG4gIGlmIChjYXJyeSkge1xyXG4gICAgeGQudW5zaGlmdChjYXJyeSk7XHJcbiAgICArK2U7XHJcbiAgfVxyXG5cclxuICAvLyBSZW1vdmUgdHJhaWxpbmcgemVyb3MuXHJcbiAgLy8gTm8gbmVlZCB0byBjaGVjayBmb3IgemVybywgYXMgK3ggKyAreSAhPSAwICYmIC14ICsgLXkgIT0gMFxyXG4gIGZvciAobGVuID0geGQubGVuZ3RoOyB4ZFstLWxlbl0gPT0gMDspIHhkLnBvcCgpO1xyXG5cclxuICB5LmQgPSB4ZDtcclxuICB5LmUgPSBnZXRCYXNlMTBFeHBvbmVudCh4ZCwgZSk7XHJcblxyXG4gIHJldHVybiBleHRlcm5hbCA/IGZpbmFsaXNlKHksIHByLCBybSkgOiB5O1xyXG59O1xyXG5cclxuXHJcbi8qXHJcbiAqIFJldHVybiB0aGUgbnVtYmVyIG9mIHNpZ25pZmljYW50IGRpZ2l0cyBvZiB0aGUgdmFsdWUgb2YgdGhpcyBEZWNpbWFsLlxyXG4gKlxyXG4gKiBbel0ge2Jvb2xlYW58bnVtYmVyfSBXaGV0aGVyIHRvIGNvdW50IGludGVnZXItcGFydCB0cmFpbGluZyB6ZXJvczogdHJ1ZSwgZmFsc2UsIDEgb3IgMC5cclxuICpcclxuICovXHJcblAucHJlY2lzaW9uID0gUC5zZCA9IGZ1bmN0aW9uICh6KSB7XHJcbiAgdmFyIGssXHJcbiAgICB4ID0gdGhpcztcclxuXHJcbiAgaWYgKHogIT09IHZvaWQgMCAmJiB6ICE9PSAhIXogJiYgeiAhPT0gMSAmJiB6ICE9PSAwKSB0aHJvdyBFcnJvcihpbnZhbGlkQXJndW1lbnQgKyB6KTtcclxuXHJcbiAgaWYgKHguZCkge1xyXG4gICAgayA9IGdldFByZWNpc2lvbih4LmQpO1xyXG4gICAgaWYgKHogJiYgeC5lICsgMSA+IGspIGsgPSB4LmUgKyAxO1xyXG4gIH0gZWxzZSB7XHJcbiAgICBrID0gTmFOO1xyXG4gIH1cclxuXHJcbiAgcmV0dXJuIGs7XHJcbn07XHJcblxyXG5cclxuLypcclxuICogUmV0dXJuIGEgbmV3IERlY2ltYWwgd2hvc2UgdmFsdWUgaXMgdGhlIHZhbHVlIG9mIHRoaXMgRGVjaW1hbCByb3VuZGVkIHRvIGEgd2hvbGUgbnVtYmVyIHVzaW5nXHJcbiAqIHJvdW5kaW5nIG1vZGUgYHJvdW5kaW5nYC5cclxuICpcclxuICovXHJcblAucm91bmQgPSBmdW5jdGlvbiAoKSB7XHJcbiAgdmFyIHggPSB0aGlzLFxyXG4gICAgQ3RvciA9IHguY29uc3RydWN0b3I7XHJcblxyXG4gIHJldHVybiBmaW5hbGlzZShuZXcgQ3Rvcih4KSwgeC5lICsgMSwgQ3Rvci5yb3VuZGluZyk7XHJcbn07XHJcblxyXG5cclxuLypcclxuICogUmV0dXJuIGEgbmV3IERlY2ltYWwgd2hvc2UgdmFsdWUgaXMgdGhlIHNpbmUgb2YgdGhlIHZhbHVlIGluIHJhZGlhbnMgb2YgdGhpcyBEZWNpbWFsLlxyXG4gKlxyXG4gKiBEb21haW46IFstSW5maW5pdHksIEluZmluaXR5XVxyXG4gKiBSYW5nZTogWy0xLCAxXVxyXG4gKlxyXG4gKiBzaW4oeCkgPSB4IC0geF4zLzMhICsgeF41LzUhIC0gLi4uXHJcbiAqXHJcbiAqIHNpbigwKSAgICAgICAgID0gMFxyXG4gKiBzaW4oLTApICAgICAgICA9IC0wXHJcbiAqIHNpbihJbmZpbml0eSkgID0gTmFOXHJcbiAqIHNpbigtSW5maW5pdHkpID0gTmFOXHJcbiAqIHNpbihOYU4pICAgICAgID0gTmFOXHJcbiAqXHJcbiAqL1xyXG5QLnNpbmUgPSBQLnNpbiA9IGZ1bmN0aW9uICgpIHtcclxuICB2YXIgcHIsIHJtLFxyXG4gICAgeCA9IHRoaXMsXHJcbiAgICBDdG9yID0geC5jb25zdHJ1Y3RvcjtcclxuXHJcbiAgaWYgKCF4LmlzRmluaXRlKCkpIHJldHVybiBuZXcgQ3RvcihOYU4pO1xyXG4gIGlmICh4LmlzWmVybygpKSByZXR1cm4gbmV3IEN0b3IoeCk7XHJcblxyXG4gIHByID0gQ3Rvci5wcmVjaXNpb247XHJcbiAgcm0gPSBDdG9yLnJvdW5kaW5nO1xyXG4gIEN0b3IucHJlY2lzaW9uID0gcHIgKyBNYXRoLm1heCh4LmUsIHguc2QoKSkgKyBMT0dfQkFTRTtcclxuICBDdG9yLnJvdW5kaW5nID0gMTtcclxuXHJcbiAgeCA9IHNpbmUoQ3RvciwgdG9MZXNzVGhhbkhhbGZQaShDdG9yLCB4KSk7XHJcblxyXG4gIEN0b3IucHJlY2lzaW9uID0gcHI7XHJcbiAgQ3Rvci5yb3VuZGluZyA9IHJtO1xyXG5cclxuICByZXR1cm4gZmluYWxpc2UocXVhZHJhbnQgPiAyID8geC5uZWcoKSA6IHgsIHByLCBybSwgdHJ1ZSk7XHJcbn07XHJcblxyXG5cclxuLypcclxuICogUmV0dXJuIGEgbmV3IERlY2ltYWwgd2hvc2UgdmFsdWUgaXMgdGhlIHNxdWFyZSByb290IG9mIHRoaXMgRGVjaW1hbCwgcm91bmRlZCB0byBgcHJlY2lzaW9uYFxyXG4gKiBzaWduaWZpY2FudCBkaWdpdHMgdXNpbmcgcm91bmRpbmcgbW9kZSBgcm91bmRpbmdgLlxyXG4gKlxyXG4gKiAgc3FydCgtbikgPSAgTlxyXG4gKiAgc3FydChOKSAgPSAgTlxyXG4gKiAgc3FydCgtSSkgPSAgTlxyXG4gKiAgc3FydChJKSAgPSAgSVxyXG4gKiAgc3FydCgwKSAgPSAgMFxyXG4gKiAgc3FydCgtMCkgPSAtMFxyXG4gKlxyXG4gKi9cclxuUC5zcXVhcmVSb290ID0gUC5zcXJ0ID0gZnVuY3Rpb24gKCkge1xyXG4gIHZhciBtLCBuLCBzZCwgciwgcmVwLCB0LFxyXG4gICAgeCA9IHRoaXMsXHJcbiAgICBkID0geC5kLFxyXG4gICAgZSA9IHguZSxcclxuICAgIHMgPSB4LnMsXHJcbiAgICBDdG9yID0geC5jb25zdHJ1Y3RvcjtcclxuXHJcbiAgLy8gTmVnYXRpdmUvTmFOL0luZmluaXR5L3plcm8/XHJcbiAgaWYgKHMgIT09IDEgfHwgIWQgfHwgIWRbMF0pIHtcclxuICAgIHJldHVybiBuZXcgQ3RvcighcyB8fCBzIDwgMCAmJiAoIWQgfHwgZFswXSkgPyBOYU4gOiBkID8geCA6IDEgLyAwKTtcclxuICB9XHJcblxyXG4gIGV4dGVybmFsID0gZmFsc2U7XHJcblxyXG4gIC8vIEluaXRpYWwgZXN0aW1hdGUuXHJcbiAgcyA9IE1hdGguc3FydCgreCk7XHJcblxyXG4gIC8vIE1hdGguc3FydCB1bmRlcmZsb3cvb3ZlcmZsb3c/XHJcbiAgLy8gUGFzcyB4IHRvIE1hdGguc3FydCBhcyBpbnRlZ2VyLCB0aGVuIGFkanVzdCB0aGUgZXhwb25lbnQgb2YgdGhlIHJlc3VsdC5cclxuICBpZiAocyA9PSAwIHx8IHMgPT0gMSAvIDApIHtcclxuICAgIG4gPSBkaWdpdHNUb1N0cmluZyhkKTtcclxuXHJcbiAgICBpZiAoKG4ubGVuZ3RoICsgZSkgJSAyID09IDApIG4gKz0gJzAnO1xyXG4gICAgcyA9IE1hdGguc3FydChuKTtcclxuICAgIGUgPSBtYXRoZmxvb3IoKGUgKyAxKSAvIDIpIC0gKGUgPCAwIHx8IGUgJSAyKTtcclxuXHJcbiAgICBpZiAocyA9PSAxIC8gMCkge1xyXG4gICAgICBuID0gJzVlJyArIGU7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICBuID0gcy50b0V4cG9uZW50aWFsKCk7XHJcbiAgICAgIG4gPSBuLnNsaWNlKDAsIG4uaW5kZXhPZignZScpICsgMSkgKyBlO1xyXG4gICAgfVxyXG5cclxuICAgIHIgPSBuZXcgQ3RvcihuKTtcclxuICB9IGVsc2Uge1xyXG4gICAgciA9IG5ldyBDdG9yKHMudG9TdHJpbmcoKSk7XHJcbiAgfVxyXG5cclxuICBzZCA9IChlID0gQ3Rvci5wcmVjaXNpb24pICsgMztcclxuXHJcbiAgLy8gTmV3dG9uLVJhcGhzb24gaXRlcmF0aW9uLlxyXG4gIGZvciAoOzspIHtcclxuICAgIHQgPSByO1xyXG4gICAgciA9IHQucGx1cyhkaXZpZGUoeCwgdCwgc2QgKyAyLCAxKSkudGltZXMoMC41KTtcclxuXHJcbiAgICAvLyBUT0RPPyBSZXBsYWNlIHdpdGggZm9yLWxvb3AgYW5kIGNoZWNrUm91bmRpbmdEaWdpdHMuXHJcbiAgICBpZiAoZGlnaXRzVG9TdHJpbmcodC5kKS5zbGljZSgwLCBzZCkgPT09IChuID0gZGlnaXRzVG9TdHJpbmcoci5kKSkuc2xpY2UoMCwgc2QpKSB7XHJcbiAgICAgIG4gPSBuLnNsaWNlKHNkIC0gMywgc2QgKyAxKTtcclxuXHJcbiAgICAgIC8vIFRoZSA0dGggcm91bmRpbmcgZGlnaXQgbWF5IGJlIGluIGVycm9yIGJ5IC0xIHNvIGlmIHRoZSA0IHJvdW5kaW5nIGRpZ2l0cyBhcmUgOTk5OSBvclxyXG4gICAgICAvLyA0OTk5LCBpLmUuIGFwcHJvYWNoaW5nIGEgcm91bmRpbmcgYm91bmRhcnksIGNvbnRpbnVlIHRoZSBpdGVyYXRpb24uXHJcbiAgICAgIGlmIChuID09ICc5OTk5JyB8fCAhcmVwICYmIG4gPT0gJzQ5OTknKSB7XHJcblxyXG4gICAgICAgIC8vIE9uIHRoZSBmaXJzdCBpdGVyYXRpb24gb25seSwgY2hlY2sgdG8gc2VlIGlmIHJvdW5kaW5nIHVwIGdpdmVzIHRoZSBleGFjdCByZXN1bHQgYXMgdGhlXHJcbiAgICAgICAgLy8gbmluZXMgbWF5IGluZmluaXRlbHkgcmVwZWF0LlxyXG4gICAgICAgIGlmICghcmVwKSB7XHJcbiAgICAgICAgICBmaW5hbGlzZSh0LCBlICsgMSwgMCk7XHJcblxyXG4gICAgICAgICAgaWYgKHQudGltZXModCkuZXEoeCkpIHtcclxuICAgICAgICAgICAgciA9IHQ7XHJcbiAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgc2QgKz0gNDtcclxuICAgICAgICByZXAgPSAxO1xyXG4gICAgICB9IGVsc2Uge1xyXG5cclxuICAgICAgICAvLyBJZiB0aGUgcm91bmRpbmcgZGlnaXRzIGFyZSBudWxsLCAwezAsNH0gb3IgNTB7MCwzfSwgY2hlY2sgZm9yIGFuIGV4YWN0IHJlc3VsdC5cclxuICAgICAgICAvLyBJZiBub3QsIHRoZW4gdGhlcmUgYXJlIGZ1cnRoZXIgZGlnaXRzIGFuZCBtIHdpbGwgYmUgdHJ1dGh5LlxyXG4gICAgICAgIGlmICghK24gfHwgIStuLnNsaWNlKDEpICYmIG4uY2hhckF0KDApID09ICc1Jykge1xyXG5cclxuICAgICAgICAgIC8vIFRydW5jYXRlIHRvIHRoZSBmaXJzdCByb3VuZGluZyBkaWdpdC5cclxuICAgICAgICAgIGZpbmFsaXNlKHIsIGUgKyAxLCAxKTtcclxuICAgICAgICAgIG0gPSAhci50aW1lcyhyKS5lcSh4KTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGJyZWFrO1xyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBleHRlcm5hbCA9IHRydWU7XHJcblxyXG4gIHJldHVybiBmaW5hbGlzZShyLCBlLCBDdG9yLnJvdW5kaW5nLCBtKTtcclxufTtcclxuXHJcblxyXG4vKlxyXG4gKiBSZXR1cm4gYSBuZXcgRGVjaW1hbCB3aG9zZSB2YWx1ZSBpcyB0aGUgdGFuZ2VudCBvZiB0aGUgdmFsdWUgaW4gcmFkaWFucyBvZiB0aGlzIERlY2ltYWwuXHJcbiAqXHJcbiAqIERvbWFpbjogWy1JbmZpbml0eSwgSW5maW5pdHldXHJcbiAqIFJhbmdlOiBbLUluZmluaXR5LCBJbmZpbml0eV1cclxuICpcclxuICogdGFuKDApICAgICAgICAgPSAwXHJcbiAqIHRhbigtMCkgICAgICAgID0gLTBcclxuICogdGFuKEluZmluaXR5KSAgPSBOYU5cclxuICogdGFuKC1JbmZpbml0eSkgPSBOYU5cclxuICogdGFuKE5hTikgICAgICAgPSBOYU5cclxuICpcclxuICovXHJcblAudGFuZ2VudCA9IFAudGFuID0gZnVuY3Rpb24gKCkge1xyXG4gIHZhciBwciwgcm0sXHJcbiAgICB4ID0gdGhpcyxcclxuICAgIEN0b3IgPSB4LmNvbnN0cnVjdG9yO1xyXG5cclxuICBpZiAoIXguaXNGaW5pdGUoKSkgcmV0dXJuIG5ldyBDdG9yKE5hTik7XHJcbiAgaWYgKHguaXNaZXJvKCkpIHJldHVybiBuZXcgQ3Rvcih4KTtcclxuXHJcbiAgcHIgPSBDdG9yLnByZWNpc2lvbjtcclxuICBybSA9IEN0b3Iucm91bmRpbmc7XHJcbiAgQ3Rvci5wcmVjaXNpb24gPSBwciArIDEwO1xyXG4gIEN0b3Iucm91bmRpbmcgPSAxO1xyXG5cclxuICB4ID0geC5zaW4oKTtcclxuICB4LnMgPSAxO1xyXG4gIHggPSBkaXZpZGUoeCwgbmV3IEN0b3IoMSkubWludXMoeC50aW1lcyh4KSkuc3FydCgpLCBwciArIDEwLCAwKTtcclxuXHJcbiAgQ3Rvci5wcmVjaXNpb24gPSBwcjtcclxuICBDdG9yLnJvdW5kaW5nID0gcm07XHJcblxyXG4gIHJldHVybiBmaW5hbGlzZShxdWFkcmFudCA9PSAyIHx8IHF1YWRyYW50ID09IDQgPyB4Lm5lZygpIDogeCwgcHIsIHJtLCB0cnVlKTtcclxufTtcclxuXHJcblxyXG4vKlxyXG4gKiAgbiAqIDAgPSAwXHJcbiAqICBuICogTiA9IE5cclxuICogIG4gKiBJID0gSVxyXG4gKiAgMCAqIG4gPSAwXHJcbiAqICAwICogMCA9IDBcclxuICogIDAgKiBOID0gTlxyXG4gKiAgMCAqIEkgPSBOXHJcbiAqICBOICogbiA9IE5cclxuICogIE4gKiAwID0gTlxyXG4gKiAgTiAqIE4gPSBOXHJcbiAqICBOICogSSA9IE5cclxuICogIEkgKiBuID0gSVxyXG4gKiAgSSAqIDAgPSBOXHJcbiAqICBJICogTiA9IE5cclxuICogIEkgKiBJID0gSVxyXG4gKlxyXG4gKiBSZXR1cm4gYSBuZXcgRGVjaW1hbCB3aG9zZSB2YWx1ZSBpcyB0aGlzIERlY2ltYWwgdGltZXMgYHlgLCByb3VuZGVkIHRvIGBwcmVjaXNpb25gIHNpZ25pZmljYW50XHJcbiAqIGRpZ2l0cyB1c2luZyByb3VuZGluZyBtb2RlIGByb3VuZGluZ2AuXHJcbiAqXHJcbiAqL1xyXG5QLnRpbWVzID0gUC5tdWwgPSBmdW5jdGlvbiAoeSkge1xyXG4gIHZhciBjYXJyeSwgZSwgaSwgaywgciwgckwsIHQsIHhkTCwgeWRMLFxyXG4gICAgeCA9IHRoaXMsXHJcbiAgICBDdG9yID0geC5jb25zdHJ1Y3RvcixcclxuICAgIHhkID0geC5kLFxyXG4gICAgeWQgPSAoeSA9IG5ldyBDdG9yKHkpKS5kO1xyXG5cclxuICB5LnMgKj0geC5zO1xyXG5cclxuICAgLy8gSWYgZWl0aGVyIGlzIE5hTiwgXHUwMEIxSW5maW5pdHkgb3IgXHUwMEIxMC4uLlxyXG4gIGlmICgheGQgfHwgIXhkWzBdIHx8ICF5ZCB8fCAheWRbMF0pIHtcclxuXHJcbiAgICByZXR1cm4gbmV3IEN0b3IoIXkucyB8fCB4ZCAmJiAheGRbMF0gJiYgIXlkIHx8IHlkICYmICF5ZFswXSAmJiAheGRcclxuXHJcbiAgICAgIC8vIFJldHVybiBOYU4gaWYgZWl0aGVyIGlzIE5hTi5cclxuICAgICAgLy8gUmV0dXJuIE5hTiBpZiB4IGlzIFx1MDBCMTAgYW5kIHkgaXMgXHUwMEIxSW5maW5pdHksIG9yIHkgaXMgXHUwMEIxMCBhbmQgeCBpcyBcdTAwQjFJbmZpbml0eS5cclxuICAgICAgPyBOYU5cclxuXHJcbiAgICAgIC8vIFJldHVybiBcdTAwQjFJbmZpbml0eSBpZiBlaXRoZXIgaXMgXHUwMEIxSW5maW5pdHkuXHJcbiAgICAgIC8vIFJldHVybiBcdTAwQjEwIGlmIGVpdGhlciBpcyBcdTAwQjEwLlxyXG4gICAgICA6ICF4ZCB8fCAheWQgPyB5LnMgLyAwIDogeS5zICogMCk7XHJcbiAgfVxyXG5cclxuICBlID0gbWF0aGZsb29yKHguZSAvIExPR19CQVNFKSArIG1hdGhmbG9vcih5LmUgLyBMT0dfQkFTRSk7XHJcbiAgeGRMID0geGQubGVuZ3RoO1xyXG4gIHlkTCA9IHlkLmxlbmd0aDtcclxuXHJcbiAgLy8gRW5zdXJlIHhkIHBvaW50cyB0byB0aGUgbG9uZ2VyIGFycmF5LlxyXG4gIGlmICh4ZEwgPCB5ZEwpIHtcclxuICAgIHIgPSB4ZDtcclxuICAgIHhkID0geWQ7XHJcbiAgICB5ZCA9IHI7XHJcbiAgICByTCA9IHhkTDtcclxuICAgIHhkTCA9IHlkTDtcclxuICAgIHlkTCA9IHJMO1xyXG4gIH1cclxuXHJcbiAgLy8gSW5pdGlhbGlzZSB0aGUgcmVzdWx0IGFycmF5IHdpdGggemVyb3MuXHJcbiAgciA9IFtdO1xyXG4gIHJMID0geGRMICsgeWRMO1xyXG4gIGZvciAoaSA9IHJMOyBpLS07KSByLnB1c2goMCk7XHJcblxyXG4gIC8vIE11bHRpcGx5IVxyXG4gIGZvciAoaSA9IHlkTDsgLS1pID49IDA7KSB7XHJcbiAgICBjYXJyeSA9IDA7XHJcbiAgICBmb3IgKGsgPSB4ZEwgKyBpOyBrID4gaTspIHtcclxuICAgICAgdCA9IHJba10gKyB5ZFtpXSAqIHhkW2sgLSBpIC0gMV0gKyBjYXJyeTtcclxuICAgICAgcltrLS1dID0gdCAlIEJBU0UgfCAwO1xyXG4gICAgICBjYXJyeSA9IHQgLyBCQVNFIHwgMDtcclxuICAgIH1cclxuXHJcbiAgICByW2tdID0gKHJba10gKyBjYXJyeSkgJSBCQVNFIHwgMDtcclxuICB9XHJcblxyXG4gIC8vIFJlbW92ZSB0cmFpbGluZyB6ZXJvcy5cclxuICBmb3IgKDsgIXJbLS1yTF07KSByLnBvcCgpO1xyXG5cclxuICBpZiAoY2FycnkpICsrZTtcclxuICBlbHNlIHIuc2hpZnQoKTtcclxuXHJcbiAgeS5kID0gcjtcclxuICB5LmUgPSBnZXRCYXNlMTBFeHBvbmVudChyLCBlKTtcclxuXHJcbiAgcmV0dXJuIGV4dGVybmFsID8gZmluYWxpc2UoeSwgQ3Rvci5wcmVjaXNpb24sIEN0b3Iucm91bmRpbmcpIDogeTtcclxufTtcclxuXHJcblxyXG4vKlxyXG4gKiBSZXR1cm4gYSBzdHJpbmcgcmVwcmVzZW50aW5nIHRoZSB2YWx1ZSBvZiB0aGlzIERlY2ltYWwgaW4gYmFzZSAyLCByb3VuZCB0byBgc2RgIHNpZ25pZmljYW50XHJcbiAqIGRpZ2l0cyB1c2luZyByb3VuZGluZyBtb2RlIGBybWAuXHJcbiAqXHJcbiAqIElmIHRoZSBvcHRpb25hbCBgc2RgIGFyZ3VtZW50IGlzIHByZXNlbnQgdGhlbiByZXR1cm4gYmluYXJ5IGV4cG9uZW50aWFsIG5vdGF0aW9uLlxyXG4gKlxyXG4gKiBbc2RdIHtudW1iZXJ9IFNpZ25pZmljYW50IGRpZ2l0cy4gSW50ZWdlciwgMSB0byBNQVhfRElHSVRTIGluY2x1c2l2ZS5cclxuICogW3JtXSB7bnVtYmVyfSBSb3VuZGluZyBtb2RlLiBJbnRlZ2VyLCAwIHRvIDggaW5jbHVzaXZlLlxyXG4gKlxyXG4gKi9cclxuUC50b0JpbmFyeSA9IGZ1bmN0aW9uIChzZCwgcm0pIHtcclxuICByZXR1cm4gdG9TdHJpbmdCaW5hcnkodGhpcywgMiwgc2QsIHJtKTtcclxufTtcclxuXHJcblxyXG4vKlxyXG4gKiBSZXR1cm4gYSBuZXcgRGVjaW1hbCB3aG9zZSB2YWx1ZSBpcyB0aGUgdmFsdWUgb2YgdGhpcyBEZWNpbWFsIHJvdW5kZWQgdG8gYSBtYXhpbXVtIG9mIGBkcGBcclxuICogZGVjaW1hbCBwbGFjZXMgdXNpbmcgcm91bmRpbmcgbW9kZSBgcm1gIG9yIGByb3VuZGluZ2AgaWYgYHJtYCBpcyBvbWl0dGVkLlxyXG4gKlxyXG4gKiBJZiBgZHBgIGlzIG9taXR0ZWQsIHJldHVybiBhIG5ldyBEZWNpbWFsIHdob3NlIHZhbHVlIGlzIHRoZSB2YWx1ZSBvZiB0aGlzIERlY2ltYWwuXHJcbiAqXHJcbiAqIFtkcF0ge251bWJlcn0gRGVjaW1hbCBwbGFjZXMuIEludGVnZXIsIDAgdG8gTUFYX0RJR0lUUyBpbmNsdXNpdmUuXHJcbiAqIFtybV0ge251bWJlcn0gUm91bmRpbmcgbW9kZS4gSW50ZWdlciwgMCB0byA4IGluY2x1c2l2ZS5cclxuICpcclxuICovXHJcblAudG9EZWNpbWFsUGxhY2VzID0gUC50b0RQID0gZnVuY3Rpb24gKGRwLCBybSkge1xyXG4gIHZhciB4ID0gdGhpcyxcclxuICAgIEN0b3IgPSB4LmNvbnN0cnVjdG9yO1xyXG5cclxuICB4ID0gbmV3IEN0b3IoeCk7XHJcbiAgaWYgKGRwID09PSB2b2lkIDApIHJldHVybiB4O1xyXG5cclxuICBjaGVja0ludDMyKGRwLCAwLCBNQVhfRElHSVRTKTtcclxuXHJcbiAgaWYgKHJtID09PSB2b2lkIDApIHJtID0gQ3Rvci5yb3VuZGluZztcclxuICBlbHNlIGNoZWNrSW50MzIocm0sIDAsIDgpO1xyXG5cclxuICByZXR1cm4gZmluYWxpc2UoeCwgZHAgKyB4LmUgKyAxLCBybSk7XHJcbn07XHJcblxyXG5cclxuLypcclxuICogUmV0dXJuIGEgc3RyaW5nIHJlcHJlc2VudGluZyB0aGUgdmFsdWUgb2YgdGhpcyBEZWNpbWFsIGluIGV4cG9uZW50aWFsIG5vdGF0aW9uIHJvdW5kZWQgdG9cclxuICogYGRwYCBmaXhlZCBkZWNpbWFsIHBsYWNlcyB1c2luZyByb3VuZGluZyBtb2RlIGByb3VuZGluZ2AuXHJcbiAqXHJcbiAqIFtkcF0ge251bWJlcn0gRGVjaW1hbCBwbGFjZXMuIEludGVnZXIsIDAgdG8gTUFYX0RJR0lUUyBpbmNsdXNpdmUuXHJcbiAqIFtybV0ge251bWJlcn0gUm91bmRpbmcgbW9kZS4gSW50ZWdlciwgMCB0byA4IGluY2x1c2l2ZS5cclxuICpcclxuICovXHJcblAudG9FeHBvbmVudGlhbCA9IGZ1bmN0aW9uIChkcCwgcm0pIHtcclxuICB2YXIgc3RyLFxyXG4gICAgeCA9IHRoaXMsXHJcbiAgICBDdG9yID0geC5jb25zdHJ1Y3RvcjtcclxuXHJcbiAgaWYgKGRwID09PSB2b2lkIDApIHtcclxuICAgIHN0ciA9IGZpbml0ZVRvU3RyaW5nKHgsIHRydWUpO1xyXG4gIH0gZWxzZSB7XHJcbiAgICBjaGVja0ludDMyKGRwLCAwLCBNQVhfRElHSVRTKTtcclxuXHJcbiAgICBpZiAocm0gPT09IHZvaWQgMCkgcm0gPSBDdG9yLnJvdW5kaW5nO1xyXG4gICAgZWxzZSBjaGVja0ludDMyKHJtLCAwLCA4KTtcclxuXHJcbiAgICB4ID0gZmluYWxpc2UobmV3IEN0b3IoeCksIGRwICsgMSwgcm0pO1xyXG4gICAgc3RyID0gZmluaXRlVG9TdHJpbmcoeCwgdHJ1ZSwgZHAgKyAxKTtcclxuICB9XHJcblxyXG4gIHJldHVybiB4LmlzTmVnKCkgJiYgIXguaXNaZXJvKCkgPyAnLScgKyBzdHIgOiBzdHI7XHJcbn07XHJcblxyXG5cclxuLypcclxuICogUmV0dXJuIGEgc3RyaW5nIHJlcHJlc2VudGluZyB0aGUgdmFsdWUgb2YgdGhpcyBEZWNpbWFsIGluIG5vcm1hbCAoZml4ZWQtcG9pbnQpIG5vdGF0aW9uIHRvXHJcbiAqIGBkcGAgZml4ZWQgZGVjaW1hbCBwbGFjZXMgYW5kIHJvdW5kZWQgdXNpbmcgcm91bmRpbmcgbW9kZSBgcm1gIG9yIGByb3VuZGluZ2AgaWYgYHJtYCBpc1xyXG4gKiBvbWl0dGVkLlxyXG4gKlxyXG4gKiBBcyB3aXRoIEphdmFTY3JpcHQgbnVtYmVycywgKC0wKS50b0ZpeGVkKDApIGlzICcwJywgYnV0IGUuZy4gKC0wLjAwMDAxKS50b0ZpeGVkKDApIGlzICctMCcuXHJcbiAqXHJcbiAqIFtkcF0ge251bWJlcn0gRGVjaW1hbCBwbGFjZXMuIEludGVnZXIsIDAgdG8gTUFYX0RJR0lUUyBpbmNsdXNpdmUuXHJcbiAqIFtybV0ge251bWJlcn0gUm91bmRpbmcgbW9kZS4gSW50ZWdlciwgMCB0byA4IGluY2x1c2l2ZS5cclxuICpcclxuICogKC0wKS50b0ZpeGVkKDApIGlzICcwJywgYnV0ICgtMC4xKS50b0ZpeGVkKDApIGlzICctMCcuXHJcbiAqICgtMCkudG9GaXhlZCgxKSBpcyAnMC4wJywgYnV0ICgtMC4wMSkudG9GaXhlZCgxKSBpcyAnLTAuMCcuXHJcbiAqICgtMCkudG9GaXhlZCgzKSBpcyAnMC4wMDAnLlxyXG4gKiAoLTAuNSkudG9GaXhlZCgwKSBpcyAnLTAnLlxyXG4gKlxyXG4gKi9cclxuUC50b0ZpeGVkID0gZnVuY3Rpb24gKGRwLCBybSkge1xyXG4gIHZhciBzdHIsIHksXHJcbiAgICB4ID0gdGhpcyxcclxuICAgIEN0b3IgPSB4LmNvbnN0cnVjdG9yO1xyXG5cclxuICBpZiAoZHAgPT09IHZvaWQgMCkge1xyXG4gICAgc3RyID0gZmluaXRlVG9TdHJpbmcoeCk7XHJcbiAgfSBlbHNlIHtcclxuICAgIGNoZWNrSW50MzIoZHAsIDAsIE1BWF9ESUdJVFMpO1xyXG5cclxuICAgIGlmIChybSA9PT0gdm9pZCAwKSBybSA9IEN0b3Iucm91bmRpbmc7XHJcbiAgICBlbHNlIGNoZWNrSW50MzIocm0sIDAsIDgpO1xyXG5cclxuICAgIHkgPSBmaW5hbGlzZShuZXcgQ3Rvcih4KSwgZHAgKyB4LmUgKyAxLCBybSk7XHJcbiAgICBzdHIgPSBmaW5pdGVUb1N0cmluZyh5LCBmYWxzZSwgZHAgKyB5LmUgKyAxKTtcclxuICB9XHJcblxyXG4gIC8vIFRvIGRldGVybWluZSB3aGV0aGVyIHRvIGFkZCB0aGUgbWludXMgc2lnbiBsb29rIGF0IHRoZSB2YWx1ZSBiZWZvcmUgaXQgd2FzIHJvdW5kZWQsXHJcbiAgLy8gaS5lLiBsb29rIGF0IGB4YCByYXRoZXIgdGhhbiBgeWAuXHJcbiAgcmV0dXJuIHguaXNOZWcoKSAmJiAheC5pc1plcm8oKSA/ICctJyArIHN0ciA6IHN0cjtcclxufTtcclxuXHJcblxyXG4vKlxyXG4gKiBSZXR1cm4gYW4gYXJyYXkgcmVwcmVzZW50aW5nIHRoZSB2YWx1ZSBvZiB0aGlzIERlY2ltYWwgYXMgYSBzaW1wbGUgZnJhY3Rpb24gd2l0aCBhbiBpbnRlZ2VyXHJcbiAqIG51bWVyYXRvciBhbmQgYW4gaW50ZWdlciBkZW5vbWluYXRvci5cclxuICpcclxuICogVGhlIGRlbm9taW5hdG9yIHdpbGwgYmUgYSBwb3NpdGl2ZSBub24temVybyB2YWx1ZSBsZXNzIHRoYW4gb3IgZXF1YWwgdG8gdGhlIHNwZWNpZmllZCBtYXhpbXVtXHJcbiAqIGRlbm9taW5hdG9yLiBJZiBhIG1heGltdW0gZGVub21pbmF0b3IgaXMgbm90IHNwZWNpZmllZCwgdGhlIGRlbm9taW5hdG9yIHdpbGwgYmUgdGhlIGxvd2VzdFxyXG4gKiB2YWx1ZSBuZWNlc3NhcnkgdG8gcmVwcmVzZW50IHRoZSBudW1iZXIgZXhhY3RseS5cclxuICpcclxuICogW21heERdIHtudW1iZXJ8c3RyaW5nfERlY2ltYWx9IE1heGltdW0gZGVub21pbmF0b3IuIEludGVnZXIgPj0gMSBhbmQgPCBJbmZpbml0eS5cclxuICpcclxuICovXHJcblAudG9GcmFjdGlvbiA9IGZ1bmN0aW9uIChtYXhEKSB7XHJcbiAgdmFyIGQsIGQwLCBkMSwgZDIsIGUsIGssIG4sIG4wLCBuMSwgcHIsIHEsIHIsXHJcbiAgICB4ID0gdGhpcyxcclxuICAgIHhkID0geC5kLFxyXG4gICAgQ3RvciA9IHguY29uc3RydWN0b3I7XHJcblxyXG4gIGlmICgheGQpIHJldHVybiBuZXcgQ3Rvcih4KTtcclxuXHJcbiAgbjEgPSBkMCA9IG5ldyBDdG9yKDEpO1xyXG4gIGQxID0gbjAgPSBuZXcgQ3RvcigwKTtcclxuXHJcbiAgZCA9IG5ldyBDdG9yKGQxKTtcclxuICBlID0gZC5lID0gZ2V0UHJlY2lzaW9uKHhkKSAtIHguZSAtIDE7XHJcbiAgayA9IGUgJSBMT0dfQkFTRTtcclxuICBkLmRbMF0gPSBtYXRocG93KDEwLCBrIDwgMCA/IExPR19CQVNFICsgayA6IGspO1xyXG5cclxuICBpZiAobWF4RCA9PSBudWxsKSB7XHJcblxyXG4gICAgLy8gZCBpcyAxMCoqZSwgdGhlIG1pbmltdW0gbWF4LWRlbm9taW5hdG9yIG5lZWRlZC5cclxuICAgIG1heEQgPSBlID4gMCA/IGQgOiBuMTtcclxuICB9IGVsc2Uge1xyXG4gICAgbiA9IG5ldyBDdG9yKG1heEQpO1xyXG4gICAgaWYgKCFuLmlzSW50KCkgfHwgbi5sdChuMSkpIHRocm93IEVycm9yKGludmFsaWRBcmd1bWVudCArIG4pO1xyXG4gICAgbWF4RCA9IG4uZ3QoZCkgPyAoZSA+IDAgPyBkIDogbjEpIDogbjtcclxuICB9XHJcblxyXG4gIGV4dGVybmFsID0gZmFsc2U7XHJcbiAgbiA9IG5ldyBDdG9yKGRpZ2l0c1RvU3RyaW5nKHhkKSk7XHJcbiAgcHIgPSBDdG9yLnByZWNpc2lvbjtcclxuICBDdG9yLnByZWNpc2lvbiA9IGUgPSB4ZC5sZW5ndGggKiBMT0dfQkFTRSAqIDI7XHJcblxyXG4gIGZvciAoOzspICB7XHJcbiAgICBxID0gZGl2aWRlKG4sIGQsIDAsIDEsIDEpO1xyXG4gICAgZDIgPSBkMC5wbHVzKHEudGltZXMoZDEpKTtcclxuICAgIGlmIChkMi5jbXAobWF4RCkgPT0gMSkgYnJlYWs7XHJcbiAgICBkMCA9IGQxO1xyXG4gICAgZDEgPSBkMjtcclxuICAgIGQyID0gbjE7XHJcbiAgICBuMSA9IG4wLnBsdXMocS50aW1lcyhkMikpO1xyXG4gICAgbjAgPSBkMjtcclxuICAgIGQyID0gZDtcclxuICAgIGQgPSBuLm1pbnVzKHEudGltZXMoZDIpKTtcclxuICAgIG4gPSBkMjtcclxuICB9XHJcblxyXG4gIGQyID0gZGl2aWRlKG1heEQubWludXMoZDApLCBkMSwgMCwgMSwgMSk7XHJcbiAgbjAgPSBuMC5wbHVzKGQyLnRpbWVzKG4xKSk7XHJcbiAgZDAgPSBkMC5wbHVzKGQyLnRpbWVzKGQxKSk7XHJcbiAgbjAucyA9IG4xLnMgPSB4LnM7XHJcblxyXG4gIC8vIERldGVybWluZSB3aGljaCBmcmFjdGlvbiBpcyBjbG9zZXIgdG8geCwgbjAvZDAgb3IgbjEvZDE/XHJcbiAgciA9IGRpdmlkZShuMSwgZDEsIGUsIDEpLm1pbnVzKHgpLmFicygpLmNtcChkaXZpZGUobjAsIGQwLCBlLCAxKS5taW51cyh4KS5hYnMoKSkgPCAxXHJcbiAgICAgID8gW24xLCBkMV0gOiBbbjAsIGQwXTtcclxuXHJcbiAgQ3Rvci5wcmVjaXNpb24gPSBwcjtcclxuICBleHRlcm5hbCA9IHRydWU7XHJcblxyXG4gIHJldHVybiByO1xyXG59O1xyXG5cclxuXHJcbi8qXHJcbiAqIFJldHVybiBhIHN0cmluZyByZXByZXNlbnRpbmcgdGhlIHZhbHVlIG9mIHRoaXMgRGVjaW1hbCBpbiBiYXNlIDE2LCByb3VuZCB0byBgc2RgIHNpZ25pZmljYW50XHJcbiAqIGRpZ2l0cyB1c2luZyByb3VuZGluZyBtb2RlIGBybWAuXHJcbiAqXHJcbiAqIElmIHRoZSBvcHRpb25hbCBgc2RgIGFyZ3VtZW50IGlzIHByZXNlbnQgdGhlbiByZXR1cm4gYmluYXJ5IGV4cG9uZW50aWFsIG5vdGF0aW9uLlxyXG4gKlxyXG4gKiBbc2RdIHtudW1iZXJ9IFNpZ25pZmljYW50IGRpZ2l0cy4gSW50ZWdlciwgMSB0byBNQVhfRElHSVRTIGluY2x1c2l2ZS5cclxuICogW3JtXSB7bnVtYmVyfSBSb3VuZGluZyBtb2RlLiBJbnRlZ2VyLCAwIHRvIDggaW5jbHVzaXZlLlxyXG4gKlxyXG4gKi9cclxuUC50b0hleGFkZWNpbWFsID0gUC50b0hleCA9IGZ1bmN0aW9uIChzZCwgcm0pIHtcclxuICByZXR1cm4gdG9TdHJpbmdCaW5hcnkodGhpcywgMTYsIHNkLCBybSk7XHJcbn07XHJcblxyXG5cclxuLypcclxuICogUmV0dXJucyBhIG5ldyBEZWNpbWFsIHdob3NlIHZhbHVlIGlzIHRoZSBuZWFyZXN0IG11bHRpcGxlIG9mIGB5YCBpbiB0aGUgZGlyZWN0aW9uIG9mIHJvdW5kaW5nXHJcbiAqIG1vZGUgYHJtYCwgb3IgYERlY2ltYWwucm91bmRpbmdgIGlmIGBybWAgaXMgb21pdHRlZCwgdG8gdGhlIHZhbHVlIG9mIHRoaXMgRGVjaW1hbC5cclxuICpcclxuICogVGhlIHJldHVybiB2YWx1ZSB3aWxsIGFsd2F5cyBoYXZlIHRoZSBzYW1lIHNpZ24gYXMgdGhpcyBEZWNpbWFsLCB1bmxlc3MgZWl0aGVyIHRoaXMgRGVjaW1hbFxyXG4gKiBvciBgeWAgaXMgTmFOLCBpbiB3aGljaCBjYXNlIHRoZSByZXR1cm4gdmFsdWUgd2lsbCBiZSBhbHNvIGJlIE5hTi5cclxuICpcclxuICogVGhlIHJldHVybiB2YWx1ZSBpcyBub3QgYWZmZWN0ZWQgYnkgdGhlIHZhbHVlIG9mIGBwcmVjaXNpb25gLlxyXG4gKlxyXG4gKiB5IHtudW1iZXJ8c3RyaW5nfERlY2ltYWx9IFRoZSBtYWduaXR1ZGUgdG8gcm91bmQgdG8gYSBtdWx0aXBsZSBvZi5cclxuICogW3JtXSB7bnVtYmVyfSBSb3VuZGluZyBtb2RlLiBJbnRlZ2VyLCAwIHRvIDggaW5jbHVzaXZlLlxyXG4gKlxyXG4gKiAndG9OZWFyZXN0KCkgcm91bmRpbmcgbW9kZSBub3QgYW4gaW50ZWdlcjoge3JtfSdcclxuICogJ3RvTmVhcmVzdCgpIHJvdW5kaW5nIG1vZGUgb3V0IG9mIHJhbmdlOiB7cm19J1xyXG4gKlxyXG4gKi9cclxuUC50b05lYXJlc3QgPSBmdW5jdGlvbiAoeSwgcm0pIHtcclxuICB2YXIgeCA9IHRoaXMsXHJcbiAgICBDdG9yID0geC5jb25zdHJ1Y3RvcjtcclxuXHJcbiAgeCA9IG5ldyBDdG9yKHgpO1xyXG5cclxuICBpZiAoeSA9PSBudWxsKSB7XHJcblxyXG4gICAgLy8gSWYgeCBpcyBub3QgZmluaXRlLCByZXR1cm4geC5cclxuICAgIGlmICgheC5kKSByZXR1cm4geDtcclxuXHJcbiAgICB5ID0gbmV3IEN0b3IoMSk7XHJcbiAgICBybSA9IEN0b3Iucm91bmRpbmc7XHJcbiAgfSBlbHNlIHtcclxuICAgIHkgPSBuZXcgQ3Rvcih5KTtcclxuICAgIGlmIChybSA9PT0gdm9pZCAwKSB7XHJcbiAgICAgIHJtID0gQ3Rvci5yb3VuZGluZztcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIGNoZWNrSW50MzIocm0sIDAsIDgpO1xyXG4gICAgfVxyXG5cclxuICAgIC8vIElmIHggaXMgbm90IGZpbml0ZSwgcmV0dXJuIHggaWYgeSBpcyBub3QgTmFOLCBlbHNlIE5hTi5cclxuICAgIGlmICgheC5kKSByZXR1cm4geS5zID8geCA6IHk7XHJcblxyXG4gICAgLy8gSWYgeSBpcyBub3QgZmluaXRlLCByZXR1cm4gSW5maW5pdHkgd2l0aCB0aGUgc2lnbiBvZiB4IGlmIHkgaXMgSW5maW5pdHksIGVsc2UgTmFOLlxyXG4gICAgaWYgKCF5LmQpIHtcclxuICAgICAgaWYgKHkucykgeS5zID0geC5zO1xyXG4gICAgICByZXR1cm4geTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIC8vIElmIHkgaXMgbm90IHplcm8sIGNhbGN1bGF0ZSB0aGUgbmVhcmVzdCBtdWx0aXBsZSBvZiB5IHRvIHguXHJcbiAgaWYgKHkuZFswXSkge1xyXG4gICAgZXh0ZXJuYWwgPSBmYWxzZTtcclxuICAgIHggPSBkaXZpZGUoeCwgeSwgMCwgcm0sIDEpLnRpbWVzKHkpO1xyXG4gICAgZXh0ZXJuYWwgPSB0cnVlO1xyXG4gICAgZmluYWxpc2UoeCk7XHJcblxyXG4gIC8vIElmIHkgaXMgemVybywgcmV0dXJuIHplcm8gd2l0aCB0aGUgc2lnbiBvZiB4LlxyXG4gIH0gZWxzZSB7XHJcbiAgICB5LnMgPSB4LnM7XHJcbiAgICB4ID0geTtcclxuICB9XHJcblxyXG4gIHJldHVybiB4O1xyXG59O1xyXG5cclxuXHJcbi8qXHJcbiAqIFJldHVybiB0aGUgdmFsdWUgb2YgdGhpcyBEZWNpbWFsIGNvbnZlcnRlZCB0byBhIG51bWJlciBwcmltaXRpdmUuXHJcbiAqIFplcm8ga2VlcHMgaXRzIHNpZ24uXHJcbiAqXHJcbiAqL1xyXG5QLnRvTnVtYmVyID0gZnVuY3Rpb24gKCkge1xyXG4gIHJldHVybiArdGhpcztcclxufTtcclxuXHJcblxyXG4vKlxyXG4gKiBSZXR1cm4gYSBzdHJpbmcgcmVwcmVzZW50aW5nIHRoZSB2YWx1ZSBvZiB0aGlzIERlY2ltYWwgaW4gYmFzZSA4LCByb3VuZCB0byBgc2RgIHNpZ25pZmljYW50XHJcbiAqIGRpZ2l0cyB1c2luZyByb3VuZGluZyBtb2RlIGBybWAuXHJcbiAqXHJcbiAqIElmIHRoZSBvcHRpb25hbCBgc2RgIGFyZ3VtZW50IGlzIHByZXNlbnQgdGhlbiByZXR1cm4gYmluYXJ5IGV4cG9uZW50aWFsIG5vdGF0aW9uLlxyXG4gKlxyXG4gKiBbc2RdIHtudW1iZXJ9IFNpZ25pZmljYW50IGRpZ2l0cy4gSW50ZWdlciwgMSB0byBNQVhfRElHSVRTIGluY2x1c2l2ZS5cclxuICogW3JtXSB7bnVtYmVyfSBSb3VuZGluZyBtb2RlLiBJbnRlZ2VyLCAwIHRvIDggaW5jbHVzaXZlLlxyXG4gKlxyXG4gKi9cclxuUC50b09jdGFsID0gZnVuY3Rpb24gKHNkLCBybSkge1xyXG4gIHJldHVybiB0b1N0cmluZ0JpbmFyeSh0aGlzLCA4LCBzZCwgcm0pO1xyXG59O1xyXG5cclxuXHJcbi8qXHJcbiAqIFJldHVybiBhIG5ldyBEZWNpbWFsIHdob3NlIHZhbHVlIGlzIHRoZSB2YWx1ZSBvZiB0aGlzIERlY2ltYWwgcmFpc2VkIHRvIHRoZSBwb3dlciBgeWAsIHJvdW5kZWRcclxuICogdG8gYHByZWNpc2lvbmAgc2lnbmlmaWNhbnQgZGlnaXRzIHVzaW5nIHJvdW5kaW5nIG1vZGUgYHJvdW5kaW5nYC5cclxuICpcclxuICogRUNNQVNjcmlwdCBjb21wbGlhbnQuXHJcbiAqXHJcbiAqICAgcG93KHgsIE5hTikgICAgICAgICAgICAgICAgICAgICAgICAgICA9IE5hTlxyXG4gKiAgIHBvdyh4LCBcdTAwQjEwKSAgICAgICAgICAgICAgICAgICAgICAgICAgICA9IDFcclxuXHJcbiAqICAgcG93KE5hTiwgbm9uLXplcm8pICAgICAgICAgICAgICAgICAgICA9IE5hTlxyXG4gKiAgIHBvdyhhYnMoeCkgPiAxLCArSW5maW5pdHkpICAgICAgICAgICAgPSArSW5maW5pdHlcclxuICogICBwb3coYWJzKHgpID4gMSwgLUluZmluaXR5KSAgICAgICAgICAgID0gKzBcclxuICogICBwb3coYWJzKHgpID09IDEsIFx1MDBCMUluZmluaXR5KSAgICAgICAgICAgPSBOYU5cclxuICogICBwb3coYWJzKHgpIDwgMSwgK0luZmluaXR5KSAgICAgICAgICAgID0gKzBcclxuICogICBwb3coYWJzKHgpIDwgMSwgLUluZmluaXR5KSAgICAgICAgICAgID0gK0luZmluaXR5XHJcbiAqICAgcG93KCtJbmZpbml0eSwgeSA+IDApICAgICAgICAgICAgICAgICA9ICtJbmZpbml0eVxyXG4gKiAgIHBvdygrSW5maW5pdHksIHkgPCAwKSAgICAgICAgICAgICAgICAgPSArMFxyXG4gKiAgIHBvdygtSW5maW5pdHksIG9kZCBpbnRlZ2VyID4gMCkgICAgICAgPSAtSW5maW5pdHlcclxuICogICBwb3coLUluZmluaXR5LCBldmVuIGludGVnZXIgPiAwKSAgICAgID0gK0luZmluaXR5XHJcbiAqICAgcG93KC1JbmZpbml0eSwgb2RkIGludGVnZXIgPCAwKSAgICAgICA9IC0wXHJcbiAqICAgcG93KC1JbmZpbml0eSwgZXZlbiBpbnRlZ2VyIDwgMCkgICAgICA9ICswXHJcbiAqICAgcG93KCswLCB5ID4gMCkgICAgICAgICAgICAgICAgICAgICAgICA9ICswXHJcbiAqICAgcG93KCswLCB5IDwgMCkgICAgICAgICAgICAgICAgICAgICAgICA9ICtJbmZpbml0eVxyXG4gKiAgIHBvdygtMCwgb2RkIGludGVnZXIgPiAwKSAgICAgICAgICAgICAgPSAtMFxyXG4gKiAgIHBvdygtMCwgZXZlbiBpbnRlZ2VyID4gMCkgICAgICAgICAgICAgPSArMFxyXG4gKiAgIHBvdygtMCwgb2RkIGludGVnZXIgPCAwKSAgICAgICAgICAgICAgPSAtSW5maW5pdHlcclxuICogICBwb3coLTAsIGV2ZW4gaW50ZWdlciA8IDApICAgICAgICAgICAgID0gK0luZmluaXR5XHJcbiAqICAgcG93KGZpbml0ZSB4IDwgMCwgZmluaXRlIG5vbi1pbnRlZ2VyKSA9IE5hTlxyXG4gKlxyXG4gKiBGb3Igbm9uLWludGVnZXIgb3IgdmVyeSBsYXJnZSBleHBvbmVudHMgcG93KHgsIHkpIGlzIGNhbGN1bGF0ZWQgdXNpbmdcclxuICpcclxuICogICB4XnkgPSBleHAoeSpsbih4KSlcclxuICpcclxuICogQXNzdW1pbmcgdGhlIGZpcnN0IDE1IHJvdW5kaW5nIGRpZ2l0cyBhcmUgZWFjaCBlcXVhbGx5IGxpa2VseSB0byBiZSBhbnkgZGlnaXQgMC05LCB0aGVcclxuICogcHJvYmFiaWxpdHkgb2YgYW4gaW5jb3JyZWN0bHkgcm91bmRlZCByZXN1bHRcclxuICogUChbNDldOXsxNH0gfCBbNTBdMHsxNH0pID0gMiAqIDAuMiAqIDEwXi0xNCA9IDRlLTE1ID0gMS8yLjVlKzE0XHJcbiAqIGkuZS4gMSBpbiAyNTAsMDAwLDAwMCwwMDAsMDAwXHJcbiAqXHJcbiAqIElmIGEgcmVzdWx0IGlzIGluY29ycmVjdGx5IHJvdW5kZWQgdGhlIG1heGltdW0gZXJyb3Igd2lsbCBiZSAxIHVscCAodW5pdCBpbiBsYXN0IHBsYWNlKS5cclxuICpcclxuICogeSB7bnVtYmVyfHN0cmluZ3xEZWNpbWFsfSBUaGUgcG93ZXIgdG8gd2hpY2ggdG8gcmFpc2UgdGhpcyBEZWNpbWFsLlxyXG4gKlxyXG4gKi9cclxuUC50b1Bvd2VyID0gUC5wb3cgPSBmdW5jdGlvbiAoeSkge1xyXG4gIHZhciBlLCBrLCBwciwgciwgcm0sIHMsXHJcbiAgICB4ID0gdGhpcyxcclxuICAgIEN0b3IgPSB4LmNvbnN0cnVjdG9yLFxyXG4gICAgeW4gPSArKHkgPSBuZXcgQ3Rvcih5KSk7XHJcblxyXG4gIC8vIEVpdGhlciBcdTAwQjFJbmZpbml0eSwgTmFOIG9yIFx1MDBCMTA/XHJcbiAgaWYgKCF4LmQgfHwgIXkuZCB8fCAheC5kWzBdIHx8ICF5LmRbMF0pIHJldHVybiBuZXcgQ3RvcihtYXRocG93KCt4LCB5bikpO1xyXG5cclxuICB4ID0gbmV3IEN0b3IoeCk7XHJcblxyXG4gIGlmICh4LmVxKDEpKSByZXR1cm4geDtcclxuXHJcbiAgcHIgPSBDdG9yLnByZWNpc2lvbjtcclxuICBybSA9IEN0b3Iucm91bmRpbmc7XHJcblxyXG4gIGlmICh5LmVxKDEpKSByZXR1cm4gZmluYWxpc2UoeCwgcHIsIHJtKTtcclxuXHJcbiAgLy8geSBleHBvbmVudFxyXG4gIGUgPSBtYXRoZmxvb3IoeS5lIC8gTE9HX0JBU0UpO1xyXG5cclxuICAvLyBJZiB5IGlzIGEgc21hbGwgaW50ZWdlciB1c2UgdGhlICdleHBvbmVudGlhdGlvbiBieSBzcXVhcmluZycgYWxnb3JpdGhtLlxyXG4gIGlmIChlID49IHkuZC5sZW5ndGggLSAxICYmIChrID0geW4gPCAwID8gLXluIDogeW4pIDw9IE1BWF9TQUZFX0lOVEVHRVIpIHtcclxuICAgIHIgPSBpbnRQb3coQ3RvciwgeCwgaywgcHIpO1xyXG4gICAgcmV0dXJuIHkucyA8IDAgPyBuZXcgQ3RvcigxKS5kaXYocikgOiBmaW5hbGlzZShyLCBwciwgcm0pO1xyXG4gIH1cclxuXHJcbiAgcyA9IHgucztcclxuXHJcbiAgLy8gaWYgeCBpcyBuZWdhdGl2ZVxyXG4gIGlmIChzIDwgMCkge1xyXG5cclxuICAgIC8vIGlmIHkgaXMgbm90IGFuIGludGVnZXJcclxuICAgIGlmIChlIDwgeS5kLmxlbmd0aCAtIDEpIHJldHVybiBuZXcgQ3RvcihOYU4pO1xyXG5cclxuICAgIC8vIFJlc3VsdCBpcyBwb3NpdGl2ZSBpZiB4IGlzIG5lZ2F0aXZlIGFuZCB0aGUgbGFzdCBkaWdpdCBvZiBpbnRlZ2VyIHkgaXMgZXZlbi5cclxuICAgIGlmICgoeS5kW2VdICYgMSkgPT0gMCkgcyA9IDE7XHJcblxyXG4gICAgLy8gaWYgeC5lcSgtMSlcclxuICAgIGlmICh4LmUgPT0gMCAmJiB4LmRbMF0gPT0gMSAmJiB4LmQubGVuZ3RoID09IDEpIHtcclxuICAgICAgeC5zID0gcztcclxuICAgICAgcmV0dXJuIHg7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICAvLyBFc3RpbWF0ZSByZXN1bHQgZXhwb25lbnQuXHJcbiAgLy8geF55ID0gMTBeZSwgIHdoZXJlIGUgPSB5ICogbG9nMTAoeClcclxuICAvLyBsb2cxMCh4KSA9IGxvZzEwKHhfc2lnbmlmaWNhbmQpICsgeF9leHBvbmVudFxyXG4gIC8vIGxvZzEwKHhfc2lnbmlmaWNhbmQpID0gbG4oeF9zaWduaWZpY2FuZCkgLyBsbigxMClcclxuICBrID0gbWF0aHBvdygreCwgeW4pO1xyXG4gIGUgPSBrID09IDAgfHwgIWlzRmluaXRlKGspXHJcbiAgICA/IG1hdGhmbG9vcih5biAqIChNYXRoLmxvZygnMC4nICsgZGlnaXRzVG9TdHJpbmcoeC5kKSkgLyBNYXRoLkxOMTAgKyB4LmUgKyAxKSlcclxuICAgIDogbmV3IEN0b3IoayArICcnKS5lO1xyXG5cclxuICAvLyBFeHBvbmVudCBlc3RpbWF0ZSBtYXkgYmUgaW5jb3JyZWN0IGUuZy4geDogMC45OTk5OTk5OTk5OTk5OTk5OTksIHk6IDIuMjksIGU6IDAsIHIuZTogLTEuXHJcblxyXG4gIC8vIE92ZXJmbG93L3VuZGVyZmxvdz9cclxuICBpZiAoZSA+IEN0b3IubWF4RSArIDEgfHwgZSA8IEN0b3IubWluRSAtIDEpIHJldHVybiBuZXcgQ3RvcihlID4gMCA/IHMgLyAwIDogMCk7XHJcblxyXG4gIGV4dGVybmFsID0gZmFsc2U7XHJcbiAgQ3Rvci5yb3VuZGluZyA9IHgucyA9IDE7XHJcblxyXG4gIC8vIEVzdGltYXRlIHRoZSBleHRyYSBndWFyZCBkaWdpdHMgbmVlZGVkIHRvIGVuc3VyZSBmaXZlIGNvcnJlY3Qgcm91bmRpbmcgZGlnaXRzIGZyb21cclxuICAvLyBuYXR1cmFsTG9nYXJpdGhtKHgpLiBFeGFtcGxlIG9mIGZhaWx1cmUgd2l0aG91dCB0aGVzZSBleHRyYSBkaWdpdHMgKHByZWNpc2lvbjogMTApOlxyXG4gIC8vIG5ldyBEZWNpbWFsKDIuMzI0NTYpLnBvdygnMjA4Nzk4NzQzNjUzNDU2Ni40NjQxMScpXHJcbiAgLy8gc2hvdWxkIGJlIDEuMTYyMzc3ODIzZSs3NjQ5MTQ5MDUxNzM4MTUsIGJ1dCBpcyAxLjE2MjM1NTgyM2UrNzY0OTE0OTA1MTczODE1XHJcbiAgayA9IE1hdGgubWluKDEyLCAoZSArICcnKS5sZW5ndGgpO1xyXG5cclxuICAvLyByID0geF55ID0gZXhwKHkqbG4oeCkpXHJcbiAgciA9IG5hdHVyYWxFeHBvbmVudGlhbCh5LnRpbWVzKG5hdHVyYWxMb2dhcml0aG0oeCwgcHIgKyBrKSksIHByKTtcclxuXHJcbiAgLy8gciBtYXkgYmUgSW5maW5pdHksIGUuZy4gKDAuOTk5OTk5OTk5OTk5OTk5OSkucG93KC0xZSs0MClcclxuICBpZiAoci5kKSB7XHJcblxyXG4gICAgLy8gVHJ1bmNhdGUgdG8gdGhlIHJlcXVpcmVkIHByZWNpc2lvbiBwbHVzIGZpdmUgcm91bmRpbmcgZGlnaXRzLlxyXG4gICAgciA9IGZpbmFsaXNlKHIsIHByICsgNSwgMSk7XHJcblxyXG4gICAgLy8gSWYgdGhlIHJvdW5kaW5nIGRpZ2l0cyBhcmUgWzQ5XTk5OTkgb3IgWzUwXTAwMDAgaW5jcmVhc2UgdGhlIHByZWNpc2lvbiBieSAxMCBhbmQgcmVjYWxjdWxhdGVcclxuICAgIC8vIHRoZSByZXN1bHQuXHJcbiAgICBpZiAoY2hlY2tSb3VuZGluZ0RpZ2l0cyhyLmQsIHByLCBybSkpIHtcclxuICAgICAgZSA9IHByICsgMTA7XHJcblxyXG4gICAgICAvLyBUcnVuY2F0ZSB0byB0aGUgaW5jcmVhc2VkIHByZWNpc2lvbiBwbHVzIGZpdmUgcm91bmRpbmcgZGlnaXRzLlxyXG4gICAgICByID0gZmluYWxpc2UobmF0dXJhbEV4cG9uZW50aWFsKHkudGltZXMobmF0dXJhbExvZ2FyaXRobSh4LCBlICsgaykpLCBlKSwgZSArIDUsIDEpO1xyXG5cclxuICAgICAgLy8gQ2hlY2sgZm9yIDE0IG5pbmVzIGZyb20gdGhlIDJuZCByb3VuZGluZyBkaWdpdCAodGhlIGZpcnN0IHJvdW5kaW5nIGRpZ2l0IG1heSBiZSA0IG9yIDkpLlxyXG4gICAgICBpZiAoK2RpZ2l0c1RvU3RyaW5nKHIuZCkuc2xpY2UocHIgKyAxLCBwciArIDE1KSArIDEgPT0gMWUxNCkge1xyXG4gICAgICAgIHIgPSBmaW5hbGlzZShyLCBwciArIDEsIDApO1xyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICByLnMgPSBzO1xyXG4gIGV4dGVybmFsID0gdHJ1ZTtcclxuICBDdG9yLnJvdW5kaW5nID0gcm07XHJcblxyXG4gIHJldHVybiBmaW5hbGlzZShyLCBwciwgcm0pO1xyXG59O1xyXG5cclxuXHJcbi8qXHJcbiAqIFJldHVybiBhIHN0cmluZyByZXByZXNlbnRpbmcgdGhlIHZhbHVlIG9mIHRoaXMgRGVjaW1hbCByb3VuZGVkIHRvIGBzZGAgc2lnbmlmaWNhbnQgZGlnaXRzXHJcbiAqIHVzaW5nIHJvdW5kaW5nIG1vZGUgYHJvdW5kaW5nYC5cclxuICpcclxuICogUmV0dXJuIGV4cG9uZW50aWFsIG5vdGF0aW9uIGlmIGBzZGAgaXMgbGVzcyB0aGFuIHRoZSBudW1iZXIgb2YgZGlnaXRzIG5lY2Vzc2FyeSB0byByZXByZXNlbnRcclxuICogdGhlIGludGVnZXIgcGFydCBvZiB0aGUgdmFsdWUgaW4gbm9ybWFsIG5vdGF0aW9uLlxyXG4gKlxyXG4gKiBbc2RdIHtudW1iZXJ9IFNpZ25pZmljYW50IGRpZ2l0cy4gSW50ZWdlciwgMSB0byBNQVhfRElHSVRTIGluY2x1c2l2ZS5cclxuICogW3JtXSB7bnVtYmVyfSBSb3VuZGluZyBtb2RlLiBJbnRlZ2VyLCAwIHRvIDggaW5jbHVzaXZlLlxyXG4gKlxyXG4gKi9cclxuUC50b1ByZWNpc2lvbiA9IGZ1bmN0aW9uIChzZCwgcm0pIHtcclxuICB2YXIgc3RyLFxyXG4gICAgeCA9IHRoaXMsXHJcbiAgICBDdG9yID0geC5jb25zdHJ1Y3RvcjtcclxuXHJcbiAgaWYgKHNkID09PSB2b2lkIDApIHtcclxuICAgIHN0ciA9IGZpbml0ZVRvU3RyaW5nKHgsIHguZSA8PSBDdG9yLnRvRXhwTmVnIHx8IHguZSA+PSBDdG9yLnRvRXhwUG9zKTtcclxuICB9IGVsc2Uge1xyXG4gICAgY2hlY2tJbnQzMihzZCwgMSwgTUFYX0RJR0lUUyk7XHJcblxyXG4gICAgaWYgKHJtID09PSB2b2lkIDApIHJtID0gQ3Rvci5yb3VuZGluZztcclxuICAgIGVsc2UgY2hlY2tJbnQzMihybSwgMCwgOCk7XHJcblxyXG4gICAgeCA9IGZpbmFsaXNlKG5ldyBDdG9yKHgpLCBzZCwgcm0pO1xyXG4gICAgc3RyID0gZmluaXRlVG9TdHJpbmcoeCwgc2QgPD0geC5lIHx8IHguZSA8PSBDdG9yLnRvRXhwTmVnLCBzZCk7XHJcbiAgfVxyXG5cclxuICByZXR1cm4geC5pc05lZygpICYmICF4LmlzWmVybygpID8gJy0nICsgc3RyIDogc3RyO1xyXG59O1xyXG5cclxuXHJcbi8qXHJcbiAqIFJldHVybiBhIG5ldyBEZWNpbWFsIHdob3NlIHZhbHVlIGlzIHRoZSB2YWx1ZSBvZiB0aGlzIERlY2ltYWwgcm91bmRlZCB0byBhIG1heGltdW0gb2YgYHNkYFxyXG4gKiBzaWduaWZpY2FudCBkaWdpdHMgdXNpbmcgcm91bmRpbmcgbW9kZSBgcm1gLCBvciB0byBgcHJlY2lzaW9uYCBhbmQgYHJvdW5kaW5nYCByZXNwZWN0aXZlbHkgaWZcclxuICogb21pdHRlZC5cclxuICpcclxuICogW3NkXSB7bnVtYmVyfSBTaWduaWZpY2FudCBkaWdpdHMuIEludGVnZXIsIDEgdG8gTUFYX0RJR0lUUyBpbmNsdXNpdmUuXHJcbiAqIFtybV0ge251bWJlcn0gUm91bmRpbmcgbW9kZS4gSW50ZWdlciwgMCB0byA4IGluY2x1c2l2ZS5cclxuICpcclxuICogJ3RvU0QoKSBkaWdpdHMgb3V0IG9mIHJhbmdlOiB7c2R9J1xyXG4gKiAndG9TRCgpIGRpZ2l0cyBub3QgYW4gaW50ZWdlcjoge3NkfSdcclxuICogJ3RvU0QoKSByb3VuZGluZyBtb2RlIG5vdCBhbiBpbnRlZ2VyOiB7cm19J1xyXG4gKiAndG9TRCgpIHJvdW5kaW5nIG1vZGUgb3V0IG9mIHJhbmdlOiB7cm19J1xyXG4gKlxyXG4gKi9cclxuUC50b1NpZ25pZmljYW50RGlnaXRzID0gUC50b1NEID0gZnVuY3Rpb24gKHNkLCBybSkge1xyXG4gIHZhciB4ID0gdGhpcyxcclxuICAgIEN0b3IgPSB4LmNvbnN0cnVjdG9yO1xyXG5cclxuICBpZiAoc2QgPT09IHZvaWQgMCkge1xyXG4gICAgc2QgPSBDdG9yLnByZWNpc2lvbjtcclxuICAgIHJtID0gQ3Rvci5yb3VuZGluZztcclxuICB9IGVsc2Uge1xyXG4gICAgY2hlY2tJbnQzMihzZCwgMSwgTUFYX0RJR0lUUyk7XHJcblxyXG4gICAgaWYgKHJtID09PSB2b2lkIDApIHJtID0gQ3Rvci5yb3VuZGluZztcclxuICAgIGVsc2UgY2hlY2tJbnQzMihybSwgMCwgOCk7XHJcbiAgfVxyXG5cclxuICByZXR1cm4gZmluYWxpc2UobmV3IEN0b3IoeCksIHNkLCBybSk7XHJcbn07XHJcblxyXG5cclxuLypcclxuICogUmV0dXJuIGEgc3RyaW5nIHJlcHJlc2VudGluZyB0aGUgdmFsdWUgb2YgdGhpcyBEZWNpbWFsLlxyXG4gKlxyXG4gKiBSZXR1cm4gZXhwb25lbnRpYWwgbm90YXRpb24gaWYgdGhpcyBEZWNpbWFsIGhhcyBhIHBvc2l0aXZlIGV4cG9uZW50IGVxdWFsIHRvIG9yIGdyZWF0ZXIgdGhhblxyXG4gKiBgdG9FeHBQb3NgLCBvciBhIG5lZ2F0aXZlIGV4cG9uZW50IGVxdWFsIHRvIG9yIGxlc3MgdGhhbiBgdG9FeHBOZWdgLlxyXG4gKlxyXG4gKi9cclxuUC50b1N0cmluZyA9IGZ1bmN0aW9uICgpIHtcclxuICB2YXIgeCA9IHRoaXMsXHJcbiAgICBDdG9yID0geC5jb25zdHJ1Y3RvcixcclxuICAgIHN0ciA9IGZpbml0ZVRvU3RyaW5nKHgsIHguZSA8PSBDdG9yLnRvRXhwTmVnIHx8IHguZSA+PSBDdG9yLnRvRXhwUG9zKTtcclxuXHJcbiAgcmV0dXJuIHguaXNOZWcoKSAmJiAheC5pc1plcm8oKSA/ICctJyArIHN0ciA6IHN0cjtcclxufTtcclxuXHJcblxyXG4vKlxyXG4gKiBSZXR1cm4gYSBuZXcgRGVjaW1hbCB3aG9zZSB2YWx1ZSBpcyB0aGUgdmFsdWUgb2YgdGhpcyBEZWNpbWFsIHRydW5jYXRlZCB0byBhIHdob2xlIG51bWJlci5cclxuICpcclxuICovXHJcblAudHJ1bmNhdGVkID0gUC50cnVuYyA9IGZ1bmN0aW9uICgpIHtcclxuICByZXR1cm4gZmluYWxpc2UobmV3IHRoaXMuY29uc3RydWN0b3IodGhpcyksIHRoaXMuZSArIDEsIDEpO1xyXG59O1xyXG5cclxuXHJcbi8qXHJcbiAqIFJldHVybiBhIHN0cmluZyByZXByZXNlbnRpbmcgdGhlIHZhbHVlIG9mIHRoaXMgRGVjaW1hbC5cclxuICogVW5saWtlIGB0b1N0cmluZ2AsIG5lZ2F0aXZlIHplcm8gd2lsbCBpbmNsdWRlIHRoZSBtaW51cyBzaWduLlxyXG4gKlxyXG4gKi9cclxuUC52YWx1ZU9mID0gUC50b0pTT04gPSBmdW5jdGlvbiAoKSB7XHJcbiAgdmFyIHggPSB0aGlzLFxyXG4gICAgQ3RvciA9IHguY29uc3RydWN0b3IsXHJcbiAgICBzdHIgPSBmaW5pdGVUb1N0cmluZyh4LCB4LmUgPD0gQ3Rvci50b0V4cE5lZyB8fCB4LmUgPj0gQ3Rvci50b0V4cFBvcyk7XHJcblxyXG4gIHJldHVybiB4LmlzTmVnKCkgPyAnLScgKyBzdHIgOiBzdHI7XHJcbn07XHJcblxyXG5cclxuLy8gSGVscGVyIGZ1bmN0aW9ucyBmb3IgRGVjaW1hbC5wcm90b3R5cGUgKFApIGFuZC9vciBEZWNpbWFsIG1ldGhvZHMsIGFuZCB0aGVpciBjYWxsZXJzLlxyXG5cclxuXHJcbi8qXHJcbiAqICBkaWdpdHNUb1N0cmluZyAgICAgICAgICAgUC5jdWJlUm9vdCwgUC5sb2dhcml0aG0sIFAuc3F1YXJlUm9vdCwgUC50b0ZyYWN0aW9uLCBQLnRvUG93ZXIsXHJcbiAqICAgICAgICAgICAgICAgICAgICAgICAgICAgZmluaXRlVG9TdHJpbmcsIG5hdHVyYWxFeHBvbmVudGlhbCwgbmF0dXJhbExvZ2FyaXRobVxyXG4gKiAgY2hlY2tJbnQzMiAgICAgICAgICAgICAgIFAudG9EZWNpbWFsUGxhY2VzLCBQLnRvRXhwb25lbnRpYWwsIFAudG9GaXhlZCwgUC50b05lYXJlc3QsXHJcbiAqICAgICAgICAgICAgICAgICAgICAgICAgICAgUC50b1ByZWNpc2lvbiwgUC50b1NpZ25pZmljYW50RGlnaXRzLCB0b1N0cmluZ0JpbmFyeSwgcmFuZG9tXHJcbiAqICBjaGVja1JvdW5kaW5nRGlnaXRzICAgICAgUC5sb2dhcml0aG0sIFAudG9Qb3dlciwgbmF0dXJhbEV4cG9uZW50aWFsLCBuYXR1cmFsTG9nYXJpdGhtXHJcbiAqICBjb252ZXJ0QmFzZSAgICAgICAgICAgICAgdG9TdHJpbmdCaW5hcnksIHBhcnNlT3RoZXJcclxuICogIGNvcyAgICAgICAgICAgICAgICAgICAgICBQLmNvc1xyXG4gKiAgZGl2aWRlICAgICAgICAgICAgICAgICAgIFAuYXRhbmgsIFAuY3ViZVJvb3QsIFAuZGl2aWRlZEJ5LCBQLmRpdmlkZWRUb0ludGVnZXJCeSxcclxuICogICAgICAgICAgICAgICAgICAgICAgICAgICBQLmxvZ2FyaXRobSwgUC5tb2R1bG8sIFAuc3F1YXJlUm9vdCwgUC50YW4sIFAudGFuaCwgUC50b0ZyYWN0aW9uLFxyXG4gKiAgICAgICAgICAgICAgICAgICAgICAgICAgIFAudG9OZWFyZXN0LCB0b1N0cmluZ0JpbmFyeSwgbmF0dXJhbEV4cG9uZW50aWFsLCBuYXR1cmFsTG9nYXJpdGhtLFxyXG4gKiAgICAgICAgICAgICAgICAgICAgICAgICAgIHRheWxvclNlcmllcywgYXRhbjIsIHBhcnNlT3RoZXJcclxuICogIGZpbmFsaXNlICAgICAgICAgICAgICAgICBQLmFic29sdXRlVmFsdWUsIFAuYXRhbiwgUC5hdGFuaCwgUC5jZWlsLCBQLmNvcywgUC5jb3NoLFxyXG4gKiAgICAgICAgICAgICAgICAgICAgICAgICAgIFAuY3ViZVJvb3QsIFAuZGl2aWRlZFRvSW50ZWdlckJ5LCBQLmZsb29yLCBQLmxvZ2FyaXRobSwgUC5taW51cyxcclxuICogICAgICAgICAgICAgICAgICAgICAgICAgICBQLm1vZHVsbywgUC5uZWdhdGVkLCBQLnBsdXMsIFAucm91bmQsIFAuc2luLCBQLnNpbmgsIFAuc3F1YXJlUm9vdCxcclxuICogICAgICAgICAgICAgICAgICAgICAgICAgICBQLnRhbiwgUC50aW1lcywgUC50b0RlY2ltYWxQbGFjZXMsIFAudG9FeHBvbmVudGlhbCwgUC50b0ZpeGVkLFxyXG4gKiAgICAgICAgICAgICAgICAgICAgICAgICAgIFAudG9OZWFyZXN0LCBQLnRvUG93ZXIsIFAudG9QcmVjaXNpb24sIFAudG9TaWduaWZpY2FudERpZ2l0cyxcclxuICogICAgICAgICAgICAgICAgICAgICAgICAgICBQLnRydW5jYXRlZCwgZGl2aWRlLCBnZXRMbjEwLCBnZXRQaSwgbmF0dXJhbEV4cG9uZW50aWFsLFxyXG4gKiAgICAgICAgICAgICAgICAgICAgICAgICAgIG5hdHVyYWxMb2dhcml0aG0sIGNlaWwsIGZsb29yLCByb3VuZCwgdHJ1bmNcclxuICogIGZpbml0ZVRvU3RyaW5nICAgICAgICAgICBQLnRvRXhwb25lbnRpYWwsIFAudG9GaXhlZCwgUC50b1ByZWNpc2lvbiwgUC50b1N0cmluZywgUC52YWx1ZU9mLFxyXG4gKiAgICAgICAgICAgICAgICAgICAgICAgICAgIHRvU3RyaW5nQmluYXJ5XHJcbiAqICBnZXRCYXNlMTBFeHBvbmVudCAgICAgICAgUC5taW51cywgUC5wbHVzLCBQLnRpbWVzLCBwYXJzZU90aGVyXHJcbiAqICBnZXRMbjEwICAgICAgICAgICAgICAgICAgUC5sb2dhcml0aG0sIG5hdHVyYWxMb2dhcml0aG1cclxuICogIGdldFBpICAgICAgICAgICAgICAgICAgICBQLmFjb3MsIFAuYXNpbiwgUC5hdGFuLCB0b0xlc3NUaGFuSGFsZlBpLCBhdGFuMlxyXG4gKiAgZ2V0UHJlY2lzaW9uICAgICAgICAgICAgIFAucHJlY2lzaW9uLCBQLnRvRnJhY3Rpb25cclxuICogIGdldFplcm9TdHJpbmcgICAgICAgICAgICBkaWdpdHNUb1N0cmluZywgZmluaXRlVG9TdHJpbmdcclxuICogIGludFBvdyAgICAgICAgICAgICAgICAgICBQLnRvUG93ZXIsIHBhcnNlT3RoZXJcclxuICogIGlzT2RkICAgICAgICAgICAgICAgICAgICB0b0xlc3NUaGFuSGFsZlBpXHJcbiAqICBtYXhPck1pbiAgICAgICAgICAgICAgICAgbWF4LCBtaW5cclxuICogIG5hdHVyYWxFeHBvbmVudGlhbCAgICAgICBQLm5hdHVyYWxFeHBvbmVudGlhbCwgUC50b1Bvd2VyXHJcbiAqICBuYXR1cmFsTG9nYXJpdGhtICAgICAgICAgUC5hY29zaCwgUC5hc2luaCwgUC5hdGFuaCwgUC5sb2dhcml0aG0sIFAubmF0dXJhbExvZ2FyaXRobSxcclxuICogICAgICAgICAgICAgICAgICAgICAgICAgICBQLnRvUG93ZXIsIG5hdHVyYWxFeHBvbmVudGlhbFxyXG4gKiAgbm9uRmluaXRlVG9TdHJpbmcgICAgICAgIGZpbml0ZVRvU3RyaW5nLCB0b1N0cmluZ0JpbmFyeVxyXG4gKiAgcGFyc2VEZWNpbWFsICAgICAgICAgICAgIERlY2ltYWxcclxuICogIHBhcnNlT3RoZXIgICAgICAgICAgICAgICBEZWNpbWFsXHJcbiAqICBzaW4gICAgICAgICAgICAgICAgICAgICAgUC5zaW5cclxuICogIHRheWxvclNlcmllcyAgICAgICAgICAgICBQLmNvc2gsIFAuc2luaCwgY29zLCBzaW5cclxuICogIHRvTGVzc1RoYW5IYWxmUGkgICAgICAgICBQLmNvcywgUC5zaW5cclxuICogIHRvU3RyaW5nQmluYXJ5ICAgICAgICAgICBQLnRvQmluYXJ5LCBQLnRvSGV4YWRlY2ltYWwsIFAudG9PY3RhbFxyXG4gKiAgdHJ1bmNhdGUgICAgICAgICAgICAgICAgIGludFBvd1xyXG4gKlxyXG4gKiAgVGhyb3dzOiAgICAgICAgICAgICAgICAgIFAubG9nYXJpdGhtLCBQLnByZWNpc2lvbiwgUC50b0ZyYWN0aW9uLCBjaGVja0ludDMyLCBnZXRMbjEwLCBnZXRQaSxcclxuICogICAgICAgICAgICAgICAgICAgICAgICAgICBuYXR1cmFsTG9nYXJpdGhtLCBjb25maWcsIHBhcnNlT3RoZXIsIHJhbmRvbSwgRGVjaW1hbFxyXG4gKi9cclxuXHJcblxyXG5mdW5jdGlvbiBkaWdpdHNUb1N0cmluZyhkKSB7XHJcbiAgdmFyIGksIGssIHdzLFxyXG4gICAgaW5kZXhPZkxhc3RXb3JkID0gZC5sZW5ndGggLSAxLFxyXG4gICAgc3RyID0gJycsXHJcbiAgICB3ID0gZFswXTtcclxuXHJcbiAgaWYgKGluZGV4T2ZMYXN0V29yZCA+IDApIHtcclxuICAgIHN0ciArPSB3O1xyXG4gICAgZm9yIChpID0gMTsgaSA8IGluZGV4T2ZMYXN0V29yZDsgaSsrKSB7XHJcbiAgICAgIHdzID0gZFtpXSArICcnO1xyXG4gICAgICBrID0gTE9HX0JBU0UgLSB3cy5sZW5ndGg7XHJcbiAgICAgIGlmIChrKSBzdHIgKz0gZ2V0WmVyb1N0cmluZyhrKTtcclxuICAgICAgc3RyICs9IHdzO1xyXG4gICAgfVxyXG5cclxuICAgIHcgPSBkW2ldO1xyXG4gICAgd3MgPSB3ICsgJyc7XHJcbiAgICBrID0gTE9HX0JBU0UgLSB3cy5sZW5ndGg7XHJcbiAgICBpZiAoaykgc3RyICs9IGdldFplcm9TdHJpbmcoayk7XHJcbiAgfSBlbHNlIGlmICh3ID09PSAwKSB7XHJcbiAgICByZXR1cm4gJzAnO1xyXG4gIH1cclxuXHJcbiAgLy8gUmVtb3ZlIHRyYWlsaW5nIHplcm9zIG9mIGxhc3Qgdy5cclxuICBmb3IgKDsgdyAlIDEwID09PSAwOykgdyAvPSAxMDtcclxuXHJcbiAgcmV0dXJuIHN0ciArIHc7XHJcbn1cclxuXHJcblxyXG5mdW5jdGlvbiBjaGVja0ludDMyKGksIG1pbiwgbWF4KSB7XHJcbiAgaWYgKGkgIT09IH5+aSB8fCBpIDwgbWluIHx8IGkgPiBtYXgpIHtcclxuICAgIHRocm93IEVycm9yKGludmFsaWRBcmd1bWVudCArIGkpO1xyXG4gIH1cclxufVxyXG5cclxuXHJcbi8qXHJcbiAqIENoZWNrIDUgcm91bmRpbmcgZGlnaXRzIGlmIGByZXBlYXRpbmdgIGlzIG51bGwsIDQgb3RoZXJ3aXNlLlxyXG4gKiBgcmVwZWF0aW5nID09IG51bGxgIGlmIGNhbGxlciBpcyBgbG9nYCBvciBgcG93YCxcclxuICogYHJlcGVhdGluZyAhPSBudWxsYCBpZiBjYWxsZXIgaXMgYG5hdHVyYWxMb2dhcml0aG1gIG9yIGBuYXR1cmFsRXhwb25lbnRpYWxgLlxyXG4gKi9cclxuZnVuY3Rpb24gY2hlY2tSb3VuZGluZ0RpZ2l0cyhkLCBpLCBybSwgcmVwZWF0aW5nKSB7XHJcbiAgdmFyIGRpLCBrLCByLCByZDtcclxuXHJcbiAgLy8gR2V0IHRoZSBsZW5ndGggb2YgdGhlIGZpcnN0IHdvcmQgb2YgdGhlIGFycmF5IGQuXHJcbiAgZm9yIChrID0gZFswXTsgayA+PSAxMDsgayAvPSAxMCkgLS1pO1xyXG5cclxuICAvLyBJcyB0aGUgcm91bmRpbmcgZGlnaXQgaW4gdGhlIGZpcnN0IHdvcmQgb2YgZD9cclxuICBpZiAoLS1pIDwgMCkge1xyXG4gICAgaSArPSBMT0dfQkFTRTtcclxuICAgIGRpID0gMDtcclxuICB9IGVsc2Uge1xyXG4gICAgZGkgPSBNYXRoLmNlaWwoKGkgKyAxKSAvIExPR19CQVNFKTtcclxuICAgIGkgJT0gTE9HX0JBU0U7XHJcbiAgfVxyXG5cclxuICAvLyBpIGlzIHRoZSBpbmRleCAoMCAtIDYpIG9mIHRoZSByb3VuZGluZyBkaWdpdC5cclxuICAvLyBFLmcuIGlmIHdpdGhpbiB0aGUgd29yZCAzNDg3NTYzIHRoZSBmaXJzdCByb3VuZGluZyBkaWdpdCBpcyA1LFxyXG4gIC8vIHRoZW4gaSA9IDQsIGsgPSAxMDAwLCByZCA9IDM0ODc1NjMgJSAxMDAwID0gNTYzXHJcbiAgayA9IG1hdGhwb3coMTAsIExPR19CQVNFIC0gaSk7XHJcbiAgcmQgPSBkW2RpXSAlIGsgfCAwO1xyXG5cclxuICBpZiAocmVwZWF0aW5nID09IG51bGwpIHtcclxuICAgIGlmIChpIDwgMykge1xyXG4gICAgICBpZiAoaSA9PSAwKSByZCA9IHJkIC8gMTAwIHwgMDtcclxuICAgICAgZWxzZSBpZiAoaSA9PSAxKSByZCA9IHJkIC8gMTAgfCAwO1xyXG4gICAgICByID0gcm0gPCA0ICYmIHJkID09IDk5OTk5IHx8IHJtID4gMyAmJiByZCA9PSA0OTk5OSB8fCByZCA9PSA1MDAwMCB8fCByZCA9PSAwO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgciA9IChybSA8IDQgJiYgcmQgKyAxID09IGsgfHwgcm0gPiAzICYmIHJkICsgMSA9PSBrIC8gMikgJiZcclxuICAgICAgICAoZFtkaSArIDFdIC8gayAvIDEwMCB8IDApID09IG1hdGhwb3coMTAsIGkgLSAyKSAtIDEgfHxcclxuICAgICAgICAgIChyZCA9PSBrIC8gMiB8fCByZCA9PSAwKSAmJiAoZFtkaSArIDFdIC8gayAvIDEwMCB8IDApID09IDA7XHJcbiAgICB9XHJcbiAgfSBlbHNlIHtcclxuICAgIGlmIChpIDwgNCkge1xyXG4gICAgICBpZiAoaSA9PSAwKSByZCA9IHJkIC8gMTAwMCB8IDA7XHJcbiAgICAgIGVsc2UgaWYgKGkgPT0gMSkgcmQgPSByZCAvIDEwMCB8IDA7XHJcbiAgICAgIGVsc2UgaWYgKGkgPT0gMikgcmQgPSByZCAvIDEwIHwgMDtcclxuICAgICAgciA9IChyZXBlYXRpbmcgfHwgcm0gPCA0KSAmJiByZCA9PSA5OTk5IHx8ICFyZXBlYXRpbmcgJiYgcm0gPiAzICYmIHJkID09IDQ5OTk7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICByID0gKChyZXBlYXRpbmcgfHwgcm0gPCA0KSAmJiByZCArIDEgPT0gayB8fFxyXG4gICAgICAoIXJlcGVhdGluZyAmJiBybSA+IDMpICYmIHJkICsgMSA9PSBrIC8gMikgJiZcclxuICAgICAgICAoZFtkaSArIDFdIC8gayAvIDEwMDAgfCAwKSA9PSBtYXRocG93KDEwLCBpIC0gMykgLSAxO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgcmV0dXJuIHI7XHJcbn1cclxuXHJcblxyXG4vLyBDb252ZXJ0IHN0cmluZyBvZiBgYmFzZUluYCB0byBhbiBhcnJheSBvZiBudW1iZXJzIG9mIGBiYXNlT3V0YC5cclxuLy8gRWcuIGNvbnZlcnRCYXNlKCcyNTUnLCAxMCwgMTYpIHJldHVybnMgWzE1LCAxNV0uXHJcbi8vIEVnLiBjb252ZXJ0QmFzZSgnZmYnLCAxNiwgMTApIHJldHVybnMgWzIsIDUsIDVdLlxyXG5mdW5jdGlvbiBjb252ZXJ0QmFzZShzdHIsIGJhc2VJbiwgYmFzZU91dCkge1xyXG4gIHZhciBqLFxyXG4gICAgYXJyID0gWzBdLFxyXG4gICAgYXJyTCxcclxuICAgIGkgPSAwLFxyXG4gICAgc3RyTCA9IHN0ci5sZW5ndGg7XHJcblxyXG4gIGZvciAoOyBpIDwgc3RyTDspIHtcclxuICAgIGZvciAoYXJyTCA9IGFyci5sZW5ndGg7IGFyckwtLTspIGFyclthcnJMXSAqPSBiYXNlSW47XHJcbiAgICBhcnJbMF0gKz0gTlVNRVJBTFMuaW5kZXhPZihzdHIuY2hhckF0KGkrKykpO1xyXG4gICAgZm9yIChqID0gMDsgaiA8IGFyci5sZW5ndGg7IGorKykge1xyXG4gICAgICBpZiAoYXJyW2pdID4gYmFzZU91dCAtIDEpIHtcclxuICAgICAgICBpZiAoYXJyW2ogKyAxXSA9PT0gdm9pZCAwKSBhcnJbaiArIDFdID0gMDtcclxuICAgICAgICBhcnJbaiArIDFdICs9IGFycltqXSAvIGJhc2VPdXQgfCAwO1xyXG4gICAgICAgIGFycltqXSAlPSBiYXNlT3V0O1xyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICByZXR1cm4gYXJyLnJldmVyc2UoKTtcclxufVxyXG5cclxuXHJcbi8qXHJcbiAqIGNvcyh4KSA9IDEgLSB4XjIvMiEgKyB4XjQvNCEgLSAuLi5cclxuICogfHh8IDwgcGkvMlxyXG4gKlxyXG4gKi9cclxuZnVuY3Rpb24gY29zaW5lKEN0b3IsIHgpIHtcclxuICB2YXIgaywgbGVuLCB5O1xyXG5cclxuICBpZiAoeC5pc1plcm8oKSkgcmV0dXJuIHg7XHJcblxyXG4gIC8vIEFyZ3VtZW50IHJlZHVjdGlvbjogY29zKDR4KSA9IDgqKGNvc140KHgpIC0gY29zXjIoeCkpICsgMVxyXG4gIC8vIGkuZS4gY29zKHgpID0gOCooY29zXjQoeC80KSAtIGNvc14yKHgvNCkpICsgMVxyXG5cclxuICAvLyBFc3RpbWF0ZSB0aGUgb3B0aW11bSBudW1iZXIgb2YgdGltZXMgdG8gdXNlIHRoZSBhcmd1bWVudCByZWR1Y3Rpb24uXHJcbiAgbGVuID0geC5kLmxlbmd0aDtcclxuICBpZiAobGVuIDwgMzIpIHtcclxuICAgIGsgPSBNYXRoLmNlaWwobGVuIC8gMyk7XHJcbiAgICB5ID0gKDEgLyB0aW55UG93KDQsIGspKS50b1N0cmluZygpO1xyXG4gIH0gZWxzZSB7XHJcbiAgICBrID0gMTY7XHJcbiAgICB5ID0gJzIuMzI4MzA2NDM2NTM4Njk2Mjg5MDYyNWUtMTAnO1xyXG4gIH1cclxuXHJcbiAgQ3Rvci5wcmVjaXNpb24gKz0gaztcclxuXHJcbiAgeCA9IHRheWxvclNlcmllcyhDdG9yLCAxLCB4LnRpbWVzKHkpLCBuZXcgQ3RvcigxKSk7XHJcblxyXG4gIC8vIFJldmVyc2UgYXJndW1lbnQgcmVkdWN0aW9uXHJcbiAgZm9yICh2YXIgaSA9IGs7IGktLTspIHtcclxuICAgIHZhciBjb3MyeCA9IHgudGltZXMoeCk7XHJcbiAgICB4ID0gY29zMngudGltZXMoY29zMngpLm1pbnVzKGNvczJ4KS50aW1lcyg4KS5wbHVzKDEpO1xyXG4gIH1cclxuXHJcbiAgQ3Rvci5wcmVjaXNpb24gLT0gaztcclxuXHJcbiAgcmV0dXJuIHg7XHJcbn1cclxuXHJcblxyXG4vKlxyXG4gKiBQZXJmb3JtIGRpdmlzaW9uIGluIHRoZSBzcGVjaWZpZWQgYmFzZS5cclxuICovXHJcbnZhciBkaXZpZGUgPSAoZnVuY3Rpb24gKCkge1xyXG5cclxuICAvLyBBc3N1bWVzIG5vbi16ZXJvIHggYW5kIGssIGFuZCBoZW5jZSBub24temVybyByZXN1bHQuXHJcbiAgZnVuY3Rpb24gbXVsdGlwbHlJbnRlZ2VyKHgsIGssIGJhc2UpIHtcclxuICAgIHZhciB0ZW1wLFxyXG4gICAgICBjYXJyeSA9IDAsXHJcbiAgICAgIGkgPSB4Lmxlbmd0aDtcclxuXHJcbiAgICBmb3IgKHggPSB4LnNsaWNlKCk7IGktLTspIHtcclxuICAgICAgdGVtcCA9IHhbaV0gKiBrICsgY2Fycnk7XHJcbiAgICAgIHhbaV0gPSB0ZW1wICUgYmFzZSB8IDA7XHJcbiAgICAgIGNhcnJ5ID0gdGVtcCAvIGJhc2UgfCAwO1xyXG4gICAgfVxyXG5cclxuICAgIGlmIChjYXJyeSkgeC51bnNoaWZ0KGNhcnJ5KTtcclxuXHJcbiAgICByZXR1cm4geDtcclxuICB9XHJcblxyXG4gIGZ1bmN0aW9uIGNvbXBhcmUoYSwgYiwgYUwsIGJMKSB7XHJcbiAgICB2YXIgaSwgcjtcclxuXHJcbiAgICBpZiAoYUwgIT0gYkwpIHtcclxuICAgICAgciA9IGFMID4gYkwgPyAxIDogLTE7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICBmb3IgKGkgPSByID0gMDsgaSA8IGFMOyBpKyspIHtcclxuICAgICAgICBpZiAoYVtpXSAhPSBiW2ldKSB7XHJcbiAgICAgICAgICByID0gYVtpXSA+IGJbaV0gPyAxIDogLTE7XHJcbiAgICAgICAgICBicmVhaztcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4gcjtcclxuICB9XHJcblxyXG4gIGZ1bmN0aW9uIHN1YnRyYWN0KGEsIGIsIGFMLCBiYXNlKSB7XHJcbiAgICB2YXIgaSA9IDA7XHJcblxyXG4gICAgLy8gU3VidHJhY3QgYiBmcm9tIGEuXHJcbiAgICBmb3IgKDsgYUwtLTspIHtcclxuICAgICAgYVthTF0gLT0gaTtcclxuICAgICAgaSA9IGFbYUxdIDwgYlthTF0gPyAxIDogMDtcclxuICAgICAgYVthTF0gPSBpICogYmFzZSArIGFbYUxdIC0gYlthTF07XHJcbiAgICB9XHJcblxyXG4gICAgLy8gUmVtb3ZlIGxlYWRpbmcgemVyb3MuXHJcbiAgICBmb3IgKDsgIWFbMF0gJiYgYS5sZW5ndGggPiAxOykgYS5zaGlmdCgpO1xyXG4gIH1cclxuXHJcbiAgcmV0dXJuIGZ1bmN0aW9uICh4LCB5LCBwciwgcm0sIGRwLCBiYXNlKSB7XHJcbiAgICB2YXIgY21wLCBlLCBpLCBrLCBsb2dCYXNlLCBtb3JlLCBwcm9kLCBwcm9kTCwgcSwgcWQsIHJlbSwgcmVtTCwgcmVtMCwgc2QsIHQsIHhpLCB4TCwgeWQwLFxyXG4gICAgICB5TCwgeXosXHJcbiAgICAgIEN0b3IgPSB4LmNvbnN0cnVjdG9yLFxyXG4gICAgICBzaWduID0geC5zID09IHkucyA/IDEgOiAtMSxcclxuICAgICAgeGQgPSB4LmQsXHJcbiAgICAgIHlkID0geS5kO1xyXG5cclxuICAgIC8vIEVpdGhlciBOYU4sIEluZmluaXR5IG9yIDA/XHJcbiAgICBpZiAoIXhkIHx8ICF4ZFswXSB8fCAheWQgfHwgIXlkWzBdKSB7XHJcblxyXG4gICAgICByZXR1cm4gbmV3IEN0b3IoLy8gUmV0dXJuIE5hTiBpZiBlaXRoZXIgTmFOLCBvciBib3RoIEluZmluaXR5IG9yIDAuXHJcbiAgICAgICAgIXgucyB8fCAheS5zIHx8ICh4ZCA/IHlkICYmIHhkWzBdID09IHlkWzBdIDogIXlkKSA/IE5hTiA6XHJcblxyXG4gICAgICAgIC8vIFJldHVybiBcdTAwQjEwIGlmIHggaXMgMCBvciB5IGlzIFx1MDBCMUluZmluaXR5LCBvciByZXR1cm4gXHUwMEIxSW5maW5pdHkgYXMgeSBpcyAwLlxyXG4gICAgICAgIHhkICYmIHhkWzBdID09IDAgfHwgIXlkID8gc2lnbiAqIDAgOiBzaWduIC8gMCk7XHJcbiAgICB9XHJcblxyXG4gICAgaWYgKGJhc2UpIHtcclxuICAgICAgbG9nQmFzZSA9IDE7XHJcbiAgICAgIGUgPSB4LmUgLSB5LmU7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICBiYXNlID0gQkFTRTtcclxuICAgICAgbG9nQmFzZSA9IExPR19CQVNFO1xyXG4gICAgICBlID0gbWF0aGZsb29yKHguZSAvIGxvZ0Jhc2UpIC0gbWF0aGZsb29yKHkuZSAvIGxvZ0Jhc2UpO1xyXG4gICAgfVxyXG5cclxuICAgIHlMID0geWQubGVuZ3RoO1xyXG4gICAgeEwgPSB4ZC5sZW5ndGg7XHJcbiAgICBxID0gbmV3IEN0b3Ioc2lnbik7XHJcbiAgICBxZCA9IHEuZCA9IFtdO1xyXG5cclxuICAgIC8vIFJlc3VsdCBleHBvbmVudCBtYXkgYmUgb25lIGxlc3MgdGhhbiBlLlxyXG4gICAgLy8gVGhlIGRpZ2l0IGFycmF5IG9mIGEgRGVjaW1hbCBmcm9tIHRvU3RyaW5nQmluYXJ5IG1heSBoYXZlIHRyYWlsaW5nIHplcm9zLlxyXG4gICAgZm9yIChpID0gMDsgeWRbaV0gPT0gKHhkW2ldIHx8IDApOyBpKyspO1xyXG5cclxuICAgIGlmICh5ZFtpXSA+ICh4ZFtpXSB8fCAwKSkgZS0tO1xyXG5cclxuICAgIGlmIChwciA9PSBudWxsKSB7XHJcbiAgICAgIHNkID0gcHIgPSBDdG9yLnByZWNpc2lvbjtcclxuICAgICAgcm0gPSBDdG9yLnJvdW5kaW5nO1xyXG4gICAgfSBlbHNlIGlmIChkcCkge1xyXG4gICAgICBzZCA9IHByICsgKHguZSAtIHkuZSkgKyAxO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgc2QgPSBwcjtcclxuICAgIH1cclxuXHJcbiAgICBpZiAoc2QgPCAwKSB7XHJcbiAgICAgIHFkLnB1c2goMSk7XHJcbiAgICAgIG1vcmUgPSB0cnVlO1xyXG4gICAgfSBlbHNlIHtcclxuXHJcbiAgICAgIC8vIENvbnZlcnQgcHJlY2lzaW9uIGluIG51bWJlciBvZiBiYXNlIDEwIGRpZ2l0cyB0byBiYXNlIDFlNyBkaWdpdHMuXHJcbiAgICAgIHNkID0gc2QgLyBsb2dCYXNlICsgMiB8IDA7XHJcbiAgICAgIGkgPSAwO1xyXG5cclxuICAgICAgLy8gZGl2aXNvciA8IDFlN1xyXG4gICAgICBpZiAoeUwgPT0gMSkge1xyXG4gICAgICAgIGsgPSAwO1xyXG4gICAgICAgIHlkID0geWRbMF07XHJcbiAgICAgICAgc2QrKztcclxuXHJcbiAgICAgICAgLy8gayBpcyB0aGUgY2FycnkuXHJcbiAgICAgICAgZm9yICg7IChpIDwgeEwgfHwgaykgJiYgc2QtLTsgaSsrKSB7XHJcbiAgICAgICAgICB0ID0gayAqIGJhc2UgKyAoeGRbaV0gfHwgMCk7XHJcbiAgICAgICAgICBxZFtpXSA9IHQgLyB5ZCB8IDA7XHJcbiAgICAgICAgICBrID0gdCAlIHlkIHwgMDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIG1vcmUgPSBrIHx8IGkgPCB4TDtcclxuXHJcbiAgICAgIC8vIGRpdmlzb3IgPj0gMWU3XHJcbiAgICAgIH0gZWxzZSB7XHJcblxyXG4gICAgICAgIC8vIE5vcm1hbGlzZSB4ZCBhbmQgeWQgc28gaGlnaGVzdCBvcmRlciBkaWdpdCBvZiB5ZCBpcyA+PSBiYXNlLzJcclxuICAgICAgICBrID0gYmFzZSAvICh5ZFswXSArIDEpIHwgMDtcclxuXHJcbiAgICAgICAgaWYgKGsgPiAxKSB7XHJcbiAgICAgICAgICB5ZCA9IG11bHRpcGx5SW50ZWdlcih5ZCwgaywgYmFzZSk7XHJcbiAgICAgICAgICB4ZCA9IG11bHRpcGx5SW50ZWdlcih4ZCwgaywgYmFzZSk7XHJcbiAgICAgICAgICB5TCA9IHlkLmxlbmd0aDtcclxuICAgICAgICAgIHhMID0geGQubGVuZ3RoO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgeGkgPSB5TDtcclxuICAgICAgICByZW0gPSB4ZC5zbGljZSgwLCB5TCk7XHJcbiAgICAgICAgcmVtTCA9IHJlbS5sZW5ndGg7XHJcblxyXG4gICAgICAgIC8vIEFkZCB6ZXJvcyB0byBtYWtlIHJlbWFpbmRlciBhcyBsb25nIGFzIGRpdmlzb3IuXHJcbiAgICAgICAgZm9yICg7IHJlbUwgPCB5TDspIHJlbVtyZW1MKytdID0gMDtcclxuXHJcbiAgICAgICAgeXogPSB5ZC5zbGljZSgpO1xyXG4gICAgICAgIHl6LnVuc2hpZnQoMCk7XHJcbiAgICAgICAgeWQwID0geWRbMF07XHJcblxyXG4gICAgICAgIGlmICh5ZFsxXSA+PSBiYXNlIC8gMikgKyt5ZDA7XHJcblxyXG4gICAgICAgIGRvIHtcclxuICAgICAgICAgIGsgPSAwO1xyXG5cclxuICAgICAgICAgIC8vIENvbXBhcmUgZGl2aXNvciBhbmQgcmVtYWluZGVyLlxyXG4gICAgICAgICAgY21wID0gY29tcGFyZSh5ZCwgcmVtLCB5TCwgcmVtTCk7XHJcblxyXG4gICAgICAgICAgLy8gSWYgZGl2aXNvciA8IHJlbWFpbmRlci5cclxuICAgICAgICAgIGlmIChjbXAgPCAwKSB7XHJcblxyXG4gICAgICAgICAgICAvLyBDYWxjdWxhdGUgdHJpYWwgZGlnaXQsIGsuXHJcbiAgICAgICAgICAgIHJlbTAgPSByZW1bMF07XHJcbiAgICAgICAgICAgIGlmICh5TCAhPSByZW1MKSByZW0wID0gcmVtMCAqIGJhc2UgKyAocmVtWzFdIHx8IDApO1xyXG5cclxuICAgICAgICAgICAgLy8gayB3aWxsIGJlIGhvdyBtYW55IHRpbWVzIHRoZSBkaXZpc29yIGdvZXMgaW50byB0aGUgY3VycmVudCByZW1haW5kZXIuXHJcbiAgICAgICAgICAgIGsgPSByZW0wIC8geWQwIHwgMDtcclxuXHJcbiAgICAgICAgICAgIC8vICBBbGdvcml0aG06XHJcbiAgICAgICAgICAgIC8vICAxLiBwcm9kdWN0ID0gZGl2aXNvciAqIHRyaWFsIGRpZ2l0IChrKVxyXG4gICAgICAgICAgICAvLyAgMi4gaWYgcHJvZHVjdCA+IHJlbWFpbmRlcjogcHJvZHVjdCAtPSBkaXZpc29yLCBrLS1cclxuICAgICAgICAgICAgLy8gIDMuIHJlbWFpbmRlciAtPSBwcm9kdWN0XHJcbiAgICAgICAgICAgIC8vICA0LiBpZiBwcm9kdWN0IHdhcyA8IHJlbWFpbmRlciBhdCAyOlxyXG4gICAgICAgICAgICAvLyAgICA1LiBjb21wYXJlIG5ldyByZW1haW5kZXIgYW5kIGRpdmlzb3JcclxuICAgICAgICAgICAgLy8gICAgNi4gSWYgcmVtYWluZGVyID4gZGl2aXNvcjogcmVtYWluZGVyIC09IGRpdmlzb3IsIGsrK1xyXG5cclxuICAgICAgICAgICAgaWYgKGsgPiAxKSB7XHJcbiAgICAgICAgICAgICAgaWYgKGsgPj0gYmFzZSkgayA9IGJhc2UgLSAxO1xyXG5cclxuICAgICAgICAgICAgICAvLyBwcm9kdWN0ID0gZGl2aXNvciAqIHRyaWFsIGRpZ2l0LlxyXG4gICAgICAgICAgICAgIHByb2QgPSBtdWx0aXBseUludGVnZXIoeWQsIGssIGJhc2UpO1xyXG4gICAgICAgICAgICAgIHByb2RMID0gcHJvZC5sZW5ndGg7XHJcbiAgICAgICAgICAgICAgcmVtTCA9IHJlbS5sZW5ndGg7XHJcblxyXG4gICAgICAgICAgICAgIC8vIENvbXBhcmUgcHJvZHVjdCBhbmQgcmVtYWluZGVyLlxyXG4gICAgICAgICAgICAgIGNtcCA9IGNvbXBhcmUocHJvZCwgcmVtLCBwcm9kTCwgcmVtTCk7XHJcblxyXG4gICAgICAgICAgICAgIC8vIHByb2R1Y3QgPiByZW1haW5kZXIuXHJcbiAgICAgICAgICAgICAgaWYgKGNtcCA9PSAxKSB7XHJcbiAgICAgICAgICAgICAgICBrLS07XHJcblxyXG4gICAgICAgICAgICAgICAgLy8gU3VidHJhY3QgZGl2aXNvciBmcm9tIHByb2R1Y3QuXHJcbiAgICAgICAgICAgICAgICBzdWJ0cmFjdChwcm9kLCB5TCA8IHByb2RMID8geXogOiB5ZCwgcHJvZEwsIGJhc2UpO1xyXG4gICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuXHJcbiAgICAgICAgICAgICAgLy8gY21wIGlzIC0xLlxyXG4gICAgICAgICAgICAgIC8vIElmIGsgaXMgMCwgdGhlcmUgaXMgbm8gbmVlZCB0byBjb21wYXJlIHlkIGFuZCByZW0gYWdhaW4gYmVsb3csIHNvIGNoYW5nZSBjbXAgdG8gMVxyXG4gICAgICAgICAgICAgIC8vIHRvIGF2b2lkIGl0LiBJZiBrIGlzIDEgdGhlcmUgaXMgYSBuZWVkIHRvIGNvbXBhcmUgeWQgYW5kIHJlbSBhZ2FpbiBiZWxvdy5cclxuICAgICAgICAgICAgICBpZiAoayA9PSAwKSBjbXAgPSBrID0gMTtcclxuICAgICAgICAgICAgICBwcm9kID0geWQuc2xpY2UoKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgcHJvZEwgPSBwcm9kLmxlbmd0aDtcclxuICAgICAgICAgICAgaWYgKHByb2RMIDwgcmVtTCkgcHJvZC51bnNoaWZ0KDApO1xyXG5cclxuICAgICAgICAgICAgLy8gU3VidHJhY3QgcHJvZHVjdCBmcm9tIHJlbWFpbmRlci5cclxuICAgICAgICAgICAgc3VidHJhY3QocmVtLCBwcm9kLCByZW1MLCBiYXNlKTtcclxuXHJcbiAgICAgICAgICAgIC8vIElmIHByb2R1Y3Qgd2FzIDwgcHJldmlvdXMgcmVtYWluZGVyLlxyXG4gICAgICAgICAgICBpZiAoY21wID09IC0xKSB7XHJcbiAgICAgICAgICAgICAgcmVtTCA9IHJlbS5sZW5ndGg7XHJcblxyXG4gICAgICAgICAgICAgIC8vIENvbXBhcmUgZGl2aXNvciBhbmQgbmV3IHJlbWFpbmRlci5cclxuICAgICAgICAgICAgICBjbXAgPSBjb21wYXJlKHlkLCByZW0sIHlMLCByZW1MKTtcclxuXHJcbiAgICAgICAgICAgICAgLy8gSWYgZGl2aXNvciA8IG5ldyByZW1haW5kZXIsIHN1YnRyYWN0IGRpdmlzb3IgZnJvbSByZW1haW5kZXIuXHJcbiAgICAgICAgICAgICAgaWYgKGNtcCA8IDEpIHtcclxuICAgICAgICAgICAgICAgIGsrKztcclxuXHJcbiAgICAgICAgICAgICAgICAvLyBTdWJ0cmFjdCBkaXZpc29yIGZyb20gcmVtYWluZGVyLlxyXG4gICAgICAgICAgICAgICAgc3VidHJhY3QocmVtLCB5TCA8IHJlbUwgPyB5eiA6IHlkLCByZW1MLCBiYXNlKTtcclxuICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIHJlbUwgPSByZW0ubGVuZ3RoO1xyXG4gICAgICAgICAgfSBlbHNlIGlmIChjbXAgPT09IDApIHtcclxuICAgICAgICAgICAgaysrO1xyXG4gICAgICAgICAgICByZW0gPSBbMF07XHJcbiAgICAgICAgICB9ICAgIC8vIGlmIGNtcCA9PT0gMSwgayB3aWxsIGJlIDBcclxuXHJcbiAgICAgICAgICAvLyBBZGQgdGhlIG5leHQgZGlnaXQsIGssIHRvIHRoZSByZXN1bHQgYXJyYXkuXHJcbiAgICAgICAgICBxZFtpKytdID0gaztcclxuXHJcbiAgICAgICAgICAvLyBVcGRhdGUgdGhlIHJlbWFpbmRlci5cclxuICAgICAgICAgIGlmIChjbXAgJiYgcmVtWzBdKSB7XHJcbiAgICAgICAgICAgIHJlbVtyZW1MKytdID0geGRbeGldIHx8IDA7XHJcbiAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICByZW0gPSBbeGRbeGldXTtcclxuICAgICAgICAgICAgcmVtTCA9IDE7XHJcbiAgICAgICAgICB9XHJcblxyXG4gICAgICAgIH0gd2hpbGUgKCh4aSsrIDwgeEwgfHwgcmVtWzBdICE9PSB2b2lkIDApICYmIHNkLS0pO1xyXG5cclxuICAgICAgICBtb3JlID0gcmVtWzBdICE9PSB2b2lkIDA7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIC8vIExlYWRpbmcgemVybz9cclxuICAgICAgaWYgKCFxZFswXSkgcWQuc2hpZnQoKTtcclxuICAgIH1cclxuXHJcbiAgICAvLyBsb2dCYXNlIGlzIDEgd2hlbiBkaXZpZGUgaXMgYmVpbmcgdXNlZCBmb3IgYmFzZSBjb252ZXJzaW9uLlxyXG4gICAgaWYgKGxvZ0Jhc2UgPT0gMSkge1xyXG4gICAgICBxLmUgPSBlO1xyXG4gICAgICBpbmV4YWN0ID0gbW9yZTtcclxuICAgIH0gZWxzZSB7XHJcblxyXG4gICAgICAvLyBUbyBjYWxjdWxhdGUgcS5lLCBmaXJzdCBnZXQgdGhlIG51bWJlciBvZiBkaWdpdHMgb2YgcWRbMF0uXHJcbiAgICAgIGZvciAoaSA9IDEsIGsgPSBxZFswXTsgayA+PSAxMDsgayAvPSAxMCkgaSsrO1xyXG4gICAgICBxLmUgPSBpICsgZSAqIGxvZ0Jhc2UgLSAxO1xyXG5cclxuICAgICAgZmluYWxpc2UocSwgZHAgPyBwciArIHEuZSArIDEgOiBwciwgcm0sIG1vcmUpO1xyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiBxO1xyXG4gIH07XHJcbn0pKCk7XHJcblxyXG5cclxuLypcclxuICogUm91bmQgYHhgIHRvIGBzZGAgc2lnbmlmaWNhbnQgZGlnaXRzIHVzaW5nIHJvdW5kaW5nIG1vZGUgYHJtYC5cclxuICogQ2hlY2sgZm9yIG92ZXIvdW5kZXItZmxvdy5cclxuICovXHJcbiBmdW5jdGlvbiBmaW5hbGlzZSh4LCBzZCwgcm0sIGlzVHJ1bmNhdGVkKSB7XHJcbiAgdmFyIGRpZ2l0cywgaSwgaiwgaywgcmQsIHJvdW5kVXAsIHcsIHhkLCB4ZGksXHJcbiAgICBDdG9yID0geC5jb25zdHJ1Y3RvcjtcclxuXHJcbiAgLy8gRG9uJ3Qgcm91bmQgaWYgc2QgaXMgbnVsbCBvciB1bmRlZmluZWQuXHJcbiAgb3V0OiBpZiAoc2QgIT0gbnVsbCkge1xyXG4gICAgeGQgPSB4LmQ7XHJcblxyXG4gICAgLy8gSW5maW5pdHkvTmFOLlxyXG4gICAgaWYgKCF4ZCkgcmV0dXJuIHg7XHJcblxyXG4gICAgLy8gcmQ6IHRoZSByb3VuZGluZyBkaWdpdCwgaS5lLiB0aGUgZGlnaXQgYWZ0ZXIgdGhlIGRpZ2l0IHRoYXQgbWF5IGJlIHJvdW5kZWQgdXAuXHJcbiAgICAvLyB3OiB0aGUgd29yZCBvZiB4ZCBjb250YWluaW5nIHJkLCBhIGJhc2UgMWU3IG51bWJlci5cclxuICAgIC8vIHhkaTogdGhlIGluZGV4IG9mIHcgd2l0aGluIHhkLlxyXG4gICAgLy8gZGlnaXRzOiB0aGUgbnVtYmVyIG9mIGRpZ2l0cyBvZiB3LlxyXG4gICAgLy8gaTogd2hhdCB3b3VsZCBiZSB0aGUgaW5kZXggb2YgcmQgd2l0aGluIHcgaWYgYWxsIHRoZSBudW1iZXJzIHdlcmUgNyBkaWdpdHMgbG9uZyAoaS5lLiBpZlxyXG4gICAgLy8gdGhleSBoYWQgbGVhZGluZyB6ZXJvcylcclxuICAgIC8vIGo6IGlmID4gMCwgdGhlIGFjdHVhbCBpbmRleCBvZiByZCB3aXRoaW4gdyAoaWYgPCAwLCByZCBpcyBhIGxlYWRpbmcgemVybykuXHJcblxyXG4gICAgLy8gR2V0IHRoZSBsZW5ndGggb2YgdGhlIGZpcnN0IHdvcmQgb2YgdGhlIGRpZ2l0cyBhcnJheSB4ZC5cclxuICAgIGZvciAoZGlnaXRzID0gMSwgayA9IHhkWzBdOyBrID49IDEwOyBrIC89IDEwKSBkaWdpdHMrKztcclxuICAgIGkgPSBzZCAtIGRpZ2l0cztcclxuXHJcbiAgICAvLyBJcyB0aGUgcm91bmRpbmcgZGlnaXQgaW4gdGhlIGZpcnN0IHdvcmQgb2YgeGQ/XHJcbiAgICBpZiAoaSA8IDApIHtcclxuICAgICAgaSArPSBMT0dfQkFTRTtcclxuICAgICAgaiA9IHNkO1xyXG4gICAgICB3ID0geGRbeGRpID0gMF07XHJcblxyXG4gICAgICAvLyBHZXQgdGhlIHJvdW5kaW5nIGRpZ2l0IGF0IGluZGV4IGogb2Ygdy5cclxuICAgICAgcmQgPSB3IC8gbWF0aHBvdygxMCwgZGlnaXRzIC0gaiAtIDEpICUgMTAgfCAwO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgeGRpID0gTWF0aC5jZWlsKChpICsgMSkgLyBMT0dfQkFTRSk7XHJcbiAgICAgIGsgPSB4ZC5sZW5ndGg7XHJcbiAgICAgIGlmICh4ZGkgPj0gaykge1xyXG4gICAgICAgIGlmIChpc1RydW5jYXRlZCkge1xyXG5cclxuICAgICAgICAgIC8vIE5lZWRlZCBieSBgbmF0dXJhbEV4cG9uZW50aWFsYCwgYG5hdHVyYWxMb2dhcml0aG1gIGFuZCBgc3F1YXJlUm9vdGAuXHJcbiAgICAgICAgICBmb3IgKDsgaysrIDw9IHhkaTspIHhkLnB1c2goMCk7XHJcbiAgICAgICAgICB3ID0gcmQgPSAwO1xyXG4gICAgICAgICAgZGlnaXRzID0gMTtcclxuICAgICAgICAgIGkgJT0gTE9HX0JBU0U7XHJcbiAgICAgICAgICBqID0gaSAtIExPR19CQVNFICsgMTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgYnJlYWsgb3V0O1xyXG4gICAgICAgIH1cclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICB3ID0gayA9IHhkW3hkaV07XHJcblxyXG4gICAgICAgIC8vIEdldCB0aGUgbnVtYmVyIG9mIGRpZ2l0cyBvZiB3LlxyXG4gICAgICAgIGZvciAoZGlnaXRzID0gMTsgayA+PSAxMDsgayAvPSAxMCkgZGlnaXRzKys7XHJcblxyXG4gICAgICAgIC8vIEdldCB0aGUgaW5kZXggb2YgcmQgd2l0aGluIHcuXHJcbiAgICAgICAgaSAlPSBMT0dfQkFTRTtcclxuXHJcbiAgICAgICAgLy8gR2V0IHRoZSBpbmRleCBvZiByZCB3aXRoaW4gdywgYWRqdXN0ZWQgZm9yIGxlYWRpbmcgemVyb3MuXHJcbiAgICAgICAgLy8gVGhlIG51bWJlciBvZiBsZWFkaW5nIHplcm9zIG9mIHcgaXMgZ2l2ZW4gYnkgTE9HX0JBU0UgLSBkaWdpdHMuXHJcbiAgICAgICAgaiA9IGkgLSBMT0dfQkFTRSArIGRpZ2l0cztcclxuXHJcbiAgICAgICAgLy8gR2V0IHRoZSByb3VuZGluZyBkaWdpdCBhdCBpbmRleCBqIG9mIHcuXHJcbiAgICAgICAgcmQgPSBqIDwgMCA/IDAgOiB3IC8gbWF0aHBvdygxMCwgZGlnaXRzIC0gaiAtIDEpICUgMTAgfCAwO1xyXG4gICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgLy8gQXJlIHRoZXJlIGFueSBub24temVybyBkaWdpdHMgYWZ0ZXIgdGhlIHJvdW5kaW5nIGRpZ2l0P1xyXG4gICAgaXNUcnVuY2F0ZWQgPSBpc1RydW5jYXRlZCB8fCBzZCA8IDAgfHxcclxuICAgICAgeGRbeGRpICsgMV0gIT09IHZvaWQgMCB8fCAoaiA8IDAgPyB3IDogdyAlIG1hdGhwb3coMTAsIGRpZ2l0cyAtIGogLSAxKSk7XHJcblxyXG4gICAgLy8gVGhlIGV4cHJlc3Npb24gYHcgJSBtYXRocG93KDEwLCBkaWdpdHMgLSBqIC0gMSlgIHJldHVybnMgYWxsIHRoZSBkaWdpdHMgb2YgdyB0byB0aGUgcmlnaHRcclxuICAgIC8vIG9mIHRoZSBkaWdpdCBhdCAobGVmdC10by1yaWdodCkgaW5kZXggaiwgZS5nLiBpZiB3IGlzIDkwODcxNCBhbmQgaiBpcyAyLCB0aGUgZXhwcmVzc2lvblxyXG4gICAgLy8gd2lsbCBnaXZlIDcxNC5cclxuXHJcbiAgICByb3VuZFVwID0gcm0gPCA0XHJcbiAgICAgID8gKHJkIHx8IGlzVHJ1bmNhdGVkKSAmJiAocm0gPT0gMCB8fCBybSA9PSAoeC5zIDwgMCA/IDMgOiAyKSlcclxuICAgICAgOiByZCA+IDUgfHwgcmQgPT0gNSAmJiAocm0gPT0gNCB8fCBpc1RydW5jYXRlZCB8fCBybSA9PSA2ICYmXHJcblxyXG4gICAgICAgIC8vIENoZWNrIHdoZXRoZXIgdGhlIGRpZ2l0IHRvIHRoZSBsZWZ0IG9mIHRoZSByb3VuZGluZyBkaWdpdCBpcyBvZGQuXHJcbiAgICAgICAgKChpID4gMCA/IGogPiAwID8gdyAvIG1hdGhwb3coMTAsIGRpZ2l0cyAtIGopIDogMCA6IHhkW3hkaSAtIDFdKSAlIDEwKSAmIDEgfHxcclxuICAgICAgICAgIHJtID09ICh4LnMgPCAwID8gOCA6IDcpKTtcclxuXHJcbiAgICBpZiAoc2QgPCAxIHx8ICF4ZFswXSkge1xyXG4gICAgICB4ZC5sZW5ndGggPSAwO1xyXG4gICAgICBpZiAocm91bmRVcCkge1xyXG5cclxuICAgICAgICAvLyBDb252ZXJ0IHNkIHRvIGRlY2ltYWwgcGxhY2VzLlxyXG4gICAgICAgIHNkIC09IHguZSArIDE7XHJcblxyXG4gICAgICAgIC8vIDEsIDAuMSwgMC4wMSwgMC4wMDEsIDAuMDAwMSBldGMuXHJcbiAgICAgICAgeGRbMF0gPSBtYXRocG93KDEwLCAoTE9HX0JBU0UgLSBzZCAlIExPR19CQVNFKSAlIExPR19CQVNFKTtcclxuICAgICAgICB4LmUgPSAtc2QgfHwgMDtcclxuICAgICAgfSBlbHNlIHtcclxuXHJcbiAgICAgICAgLy8gWmVyby5cclxuICAgICAgICB4ZFswXSA9IHguZSA9IDA7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIHJldHVybiB4O1xyXG4gICAgfVxyXG5cclxuICAgIC8vIFJlbW92ZSBleGNlc3MgZGlnaXRzLlxyXG4gICAgaWYgKGkgPT0gMCkge1xyXG4gICAgICB4ZC5sZW5ndGggPSB4ZGk7XHJcbiAgICAgIGsgPSAxO1xyXG4gICAgICB4ZGktLTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIHhkLmxlbmd0aCA9IHhkaSArIDE7XHJcbiAgICAgIGsgPSBtYXRocG93KDEwLCBMT0dfQkFTRSAtIGkpO1xyXG5cclxuICAgICAgLy8gRS5nLiA1NjcwMCBiZWNvbWVzIDU2MDAwIGlmIDcgaXMgdGhlIHJvdW5kaW5nIGRpZ2l0LlxyXG4gICAgICAvLyBqID4gMCBtZWFucyBpID4gbnVtYmVyIG9mIGxlYWRpbmcgemVyb3Mgb2Ygdy5cclxuICAgICAgeGRbeGRpXSA9IGogPiAwID8gKHcgLyBtYXRocG93KDEwLCBkaWdpdHMgLSBqKSAlIG1hdGhwb3coMTAsIGopIHwgMCkgKiBrIDogMDtcclxuICAgIH1cclxuXHJcbiAgICBpZiAocm91bmRVcCkge1xyXG4gICAgICBmb3IgKDs7KSB7XHJcblxyXG4gICAgICAgIC8vIElzIHRoZSBkaWdpdCB0byBiZSByb3VuZGVkIHVwIGluIHRoZSBmaXJzdCB3b3JkIG9mIHhkP1xyXG4gICAgICAgIGlmICh4ZGkgPT0gMCkge1xyXG5cclxuICAgICAgICAgIC8vIGkgd2lsbCBiZSB0aGUgbGVuZ3RoIG9mIHhkWzBdIGJlZm9yZSBrIGlzIGFkZGVkLlxyXG4gICAgICAgICAgZm9yIChpID0gMSwgaiA9IHhkWzBdOyBqID49IDEwOyBqIC89IDEwKSBpKys7XHJcbiAgICAgICAgICBqID0geGRbMF0gKz0gaztcclxuICAgICAgICAgIGZvciAoayA9IDE7IGogPj0gMTA7IGogLz0gMTApIGsrKztcclxuXHJcbiAgICAgICAgICAvLyBpZiBpICE9IGsgdGhlIGxlbmd0aCBoYXMgaW5jcmVhc2VkLlxyXG4gICAgICAgICAgaWYgKGkgIT0gaykge1xyXG4gICAgICAgICAgICB4LmUrKztcclxuICAgICAgICAgICAgaWYgKHhkWzBdID09IEJBU0UpIHhkWzBdID0gMTtcclxuICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICBicmVhaztcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgeGRbeGRpXSArPSBrO1xyXG4gICAgICAgICAgaWYgKHhkW3hkaV0gIT0gQkFTRSkgYnJlYWs7XHJcbiAgICAgICAgICB4ZFt4ZGktLV0gPSAwO1xyXG4gICAgICAgICAgayA9IDE7XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgLy8gUmVtb3ZlIHRyYWlsaW5nIHplcm9zLlxyXG4gICAgZm9yIChpID0geGQubGVuZ3RoOyB4ZFstLWldID09PSAwOykgeGQucG9wKCk7XHJcbiAgfVxyXG5cclxuICBpZiAoZXh0ZXJuYWwpIHtcclxuXHJcbiAgICAvLyBPdmVyZmxvdz9cclxuICAgIGlmICh4LmUgPiBDdG9yLm1heEUpIHtcclxuXHJcbiAgICAgIC8vIEluZmluaXR5LlxyXG4gICAgICB4LmQgPSBudWxsO1xyXG4gICAgICB4LmUgPSBOYU47XHJcblxyXG4gICAgLy8gVW5kZXJmbG93P1xyXG4gICAgfSBlbHNlIGlmICh4LmUgPCBDdG9yLm1pbkUpIHtcclxuXHJcbiAgICAgIC8vIFplcm8uXHJcbiAgICAgIHguZSA9IDA7XHJcbiAgICAgIHguZCA9IFswXTtcclxuICAgICAgLy8gQ3Rvci51bmRlcmZsb3cgPSB0cnVlO1xyXG4gICAgfSAvLyBlbHNlIEN0b3IudW5kZXJmbG93ID0gZmFsc2U7XHJcbiAgfVxyXG5cclxuICByZXR1cm4geDtcclxufVxyXG5cclxuXHJcbmZ1bmN0aW9uIGZpbml0ZVRvU3RyaW5nKHgsIGlzRXhwLCBzZCkge1xyXG4gIGlmICgheC5pc0Zpbml0ZSgpKSByZXR1cm4gbm9uRmluaXRlVG9TdHJpbmcoeCk7XHJcbiAgdmFyIGssXHJcbiAgICBlID0geC5lLFxyXG4gICAgc3RyID0gZGlnaXRzVG9TdHJpbmcoeC5kKSxcclxuICAgIGxlbiA9IHN0ci5sZW5ndGg7XHJcblxyXG4gIGlmIChpc0V4cCkge1xyXG4gICAgaWYgKHNkICYmIChrID0gc2QgLSBsZW4pID4gMCkge1xyXG4gICAgICBzdHIgPSBzdHIuY2hhckF0KDApICsgJy4nICsgc3RyLnNsaWNlKDEpICsgZ2V0WmVyb1N0cmluZyhrKTtcclxuICAgIH0gZWxzZSBpZiAobGVuID4gMSkge1xyXG4gICAgICBzdHIgPSBzdHIuY2hhckF0KDApICsgJy4nICsgc3RyLnNsaWNlKDEpO1xyXG4gICAgfVxyXG5cclxuICAgIHN0ciA9IHN0ciArICh4LmUgPCAwID8gJ2UnIDogJ2UrJykgKyB4LmU7XHJcbiAgfSBlbHNlIGlmIChlIDwgMCkge1xyXG4gICAgc3RyID0gJzAuJyArIGdldFplcm9TdHJpbmcoLWUgLSAxKSArIHN0cjtcclxuICAgIGlmIChzZCAmJiAoayA9IHNkIC0gbGVuKSA+IDApIHN0ciArPSBnZXRaZXJvU3RyaW5nKGspO1xyXG4gIH0gZWxzZSBpZiAoZSA+PSBsZW4pIHtcclxuICAgIHN0ciArPSBnZXRaZXJvU3RyaW5nKGUgKyAxIC0gbGVuKTtcclxuICAgIGlmIChzZCAmJiAoayA9IHNkIC0gZSAtIDEpID4gMCkgc3RyID0gc3RyICsgJy4nICsgZ2V0WmVyb1N0cmluZyhrKTtcclxuICB9IGVsc2Uge1xyXG4gICAgaWYgKChrID0gZSArIDEpIDwgbGVuKSBzdHIgPSBzdHIuc2xpY2UoMCwgaykgKyAnLicgKyBzdHIuc2xpY2Uoayk7XHJcbiAgICBpZiAoc2QgJiYgKGsgPSBzZCAtIGxlbikgPiAwKSB7XHJcbiAgICAgIGlmIChlICsgMSA9PT0gbGVuKSBzdHIgKz0gJy4nO1xyXG4gICAgICBzdHIgKz0gZ2V0WmVyb1N0cmluZyhrKTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIHJldHVybiBzdHI7XHJcbn1cclxuXHJcblxyXG4vLyBDYWxjdWxhdGUgdGhlIGJhc2UgMTAgZXhwb25lbnQgZnJvbSB0aGUgYmFzZSAxZTcgZXhwb25lbnQuXHJcbmZ1bmN0aW9uIGdldEJhc2UxMEV4cG9uZW50KGRpZ2l0cywgZSkge1xyXG4gIHZhciB3ID0gZGlnaXRzWzBdO1xyXG5cclxuICAvLyBBZGQgdGhlIG51bWJlciBvZiBkaWdpdHMgb2YgdGhlIGZpcnN0IHdvcmQgb2YgdGhlIGRpZ2l0cyBhcnJheS5cclxuICBmb3IgKCBlICo9IExPR19CQVNFOyB3ID49IDEwOyB3IC89IDEwKSBlKys7XHJcbiAgcmV0dXJuIGU7XHJcbn1cclxuXHJcblxyXG5mdW5jdGlvbiBnZXRMbjEwKEN0b3IsIHNkLCBwcikge1xyXG4gIGlmIChzZCA+IExOMTBfUFJFQ0lTSU9OKSB7XHJcblxyXG4gICAgLy8gUmVzZXQgZ2xvYmFsIHN0YXRlIGluIGNhc2UgdGhlIGV4Y2VwdGlvbiBpcyBjYXVnaHQuXHJcbiAgICBleHRlcm5hbCA9IHRydWU7XHJcbiAgICBpZiAocHIpIEN0b3IucHJlY2lzaW9uID0gcHI7XHJcbiAgICB0aHJvdyBFcnJvcihwcmVjaXNpb25MaW1pdEV4Y2VlZGVkKTtcclxuICB9XHJcbiAgcmV0dXJuIGZpbmFsaXNlKG5ldyBDdG9yKExOMTApLCBzZCwgMSwgdHJ1ZSk7XHJcbn1cclxuXHJcblxyXG5mdW5jdGlvbiBnZXRQaShDdG9yLCBzZCwgcm0pIHtcclxuICBpZiAoc2QgPiBQSV9QUkVDSVNJT04pIHRocm93IEVycm9yKHByZWNpc2lvbkxpbWl0RXhjZWVkZWQpO1xyXG4gIHJldHVybiBmaW5hbGlzZShuZXcgQ3RvcihQSSksIHNkLCBybSwgdHJ1ZSk7XHJcbn1cclxuXHJcblxyXG5mdW5jdGlvbiBnZXRQcmVjaXNpb24oZGlnaXRzKSB7XHJcbiAgdmFyIHcgPSBkaWdpdHMubGVuZ3RoIC0gMSxcclxuICAgIGxlbiA9IHcgKiBMT0dfQkFTRSArIDE7XHJcblxyXG4gIHcgPSBkaWdpdHNbd107XHJcblxyXG4gIC8vIElmIG5vbi16ZXJvLi4uXHJcbiAgaWYgKHcpIHtcclxuXHJcbiAgICAvLyBTdWJ0cmFjdCB0aGUgbnVtYmVyIG9mIHRyYWlsaW5nIHplcm9zIG9mIHRoZSBsYXN0IHdvcmQuXHJcbiAgICBmb3IgKDsgdyAlIDEwID09IDA7IHcgLz0gMTApIGxlbi0tO1xyXG5cclxuICAgIC8vIEFkZCB0aGUgbnVtYmVyIG9mIGRpZ2l0cyBvZiB0aGUgZmlyc3Qgd29yZC5cclxuICAgIGZvciAodyA9IGRpZ2l0c1swXTsgdyA+PSAxMDsgdyAvPSAxMCkgbGVuKys7XHJcbiAgfVxyXG5cclxuICByZXR1cm4gbGVuO1xyXG59XHJcblxyXG5cclxuZnVuY3Rpb24gZ2V0WmVyb1N0cmluZyhrKSB7XHJcbiAgdmFyIHpzID0gJyc7XHJcbiAgZm9yICg7IGstLTspIHpzICs9ICcwJztcclxuICByZXR1cm4genM7XHJcbn1cclxuXHJcblxyXG4vKlxyXG4gKiBSZXR1cm4gYSBuZXcgRGVjaW1hbCB3aG9zZSB2YWx1ZSBpcyB0aGUgdmFsdWUgb2YgRGVjaW1hbCBgeGAgdG8gdGhlIHBvd2VyIGBuYCwgd2hlcmUgYG5gIGlzIGFuXHJcbiAqIGludGVnZXIgb2YgdHlwZSBudW1iZXIuXHJcbiAqXHJcbiAqIEltcGxlbWVudHMgJ2V4cG9uZW50aWF0aW9uIGJ5IHNxdWFyaW5nJy4gQ2FsbGVkIGJ5IGBwb3dgIGFuZCBgcGFyc2VPdGhlcmAuXHJcbiAqXHJcbiAqL1xyXG5mdW5jdGlvbiBpbnRQb3coQ3RvciwgeCwgbiwgcHIpIHtcclxuICB2YXIgaXNUcnVuY2F0ZWQsXHJcbiAgICByID0gbmV3IEN0b3IoMSksXHJcblxyXG4gICAgLy8gTWF4IG4gb2YgOTAwNzE5OTI1NDc0MDk5MSB0YWtlcyA1MyBsb29wIGl0ZXJhdGlvbnMuXHJcbiAgICAvLyBNYXhpbXVtIGRpZ2l0cyBhcnJheSBsZW5ndGg7IGxlYXZlcyBbMjgsIDM0XSBndWFyZCBkaWdpdHMuXHJcbiAgICBrID0gTWF0aC5jZWlsKHByIC8gTE9HX0JBU0UgKyA0KTtcclxuXHJcbiAgZXh0ZXJuYWwgPSBmYWxzZTtcclxuXHJcbiAgZm9yICg7Oykge1xyXG4gICAgaWYgKG4gJSAyKSB7XHJcbiAgICAgIHIgPSByLnRpbWVzKHgpO1xyXG4gICAgICBpZiAodHJ1bmNhdGUoci5kLCBrKSkgaXNUcnVuY2F0ZWQgPSB0cnVlO1xyXG4gICAgfVxyXG5cclxuICAgIG4gPSBtYXRoZmxvb3IobiAvIDIpO1xyXG4gICAgaWYgKG4gPT09IDApIHtcclxuXHJcbiAgICAgIC8vIFRvIGVuc3VyZSBjb3JyZWN0IHJvdW5kaW5nIHdoZW4gci5kIGlzIHRydW5jYXRlZCwgaW5jcmVtZW50IHRoZSBsYXN0IHdvcmQgaWYgaXQgaXMgemVyby5cclxuICAgICAgbiA9IHIuZC5sZW5ndGggLSAxO1xyXG4gICAgICBpZiAoaXNUcnVuY2F0ZWQgJiYgci5kW25dID09PSAwKSArK3IuZFtuXTtcclxuICAgICAgYnJlYWs7XHJcbiAgICB9XHJcblxyXG4gICAgeCA9IHgudGltZXMoeCk7XHJcbiAgICB0cnVuY2F0ZSh4LmQsIGspO1xyXG4gIH1cclxuXHJcbiAgZXh0ZXJuYWwgPSB0cnVlO1xyXG5cclxuICByZXR1cm4gcjtcclxufVxyXG5cclxuXHJcbmZ1bmN0aW9uIGlzT2RkKG4pIHtcclxuICByZXR1cm4gbi5kW24uZC5sZW5ndGggLSAxXSAmIDE7XHJcbn1cclxuXHJcblxyXG4vKlxyXG4gKiBIYW5kbGUgYG1heGAgYW5kIGBtaW5gLiBgbHRndGAgaXMgJ2x0JyBvciAnZ3QnLlxyXG4gKi9cclxuZnVuY3Rpb24gbWF4T3JNaW4oQ3RvciwgYXJncywgbHRndCkge1xyXG4gIHZhciB5LFxyXG4gICAgeCA9IG5ldyBDdG9yKGFyZ3NbMF0pLFxyXG4gICAgaSA9IDA7XHJcblxyXG4gIGZvciAoOyArK2kgPCBhcmdzLmxlbmd0aDspIHtcclxuICAgIHkgPSBuZXcgQ3RvcihhcmdzW2ldKTtcclxuICAgIGlmICgheS5zKSB7XHJcbiAgICAgIHggPSB5O1xyXG4gICAgICBicmVhaztcclxuICAgIH0gZWxzZSBpZiAoeFtsdGd0XSh5KSkge1xyXG4gICAgICB4ID0geTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIHJldHVybiB4O1xyXG59XHJcblxyXG5cclxuLypcclxuICogUmV0dXJuIGEgbmV3IERlY2ltYWwgd2hvc2UgdmFsdWUgaXMgdGhlIG5hdHVyYWwgZXhwb25lbnRpYWwgb2YgYHhgIHJvdW5kZWQgdG8gYHNkYCBzaWduaWZpY2FudFxyXG4gKiBkaWdpdHMuXHJcbiAqXHJcbiAqIFRheWxvci9NYWNsYXVyaW4gc2VyaWVzLlxyXG4gKlxyXG4gKiBleHAoeCkgPSB4XjAvMCEgKyB4XjEvMSEgKyB4XjIvMiEgKyB4XjMvMyEgKyAuLi5cclxuICpcclxuICogQXJndW1lbnQgcmVkdWN0aW9uOlxyXG4gKiAgIFJlcGVhdCB4ID0geCAvIDMyLCBrICs9IDUsIHVudGlsIHx4fCA8IDAuMVxyXG4gKiAgIGV4cCh4KSA9IGV4cCh4IC8gMl5rKV4oMl5rKVxyXG4gKlxyXG4gKiBQcmV2aW91c2x5LCB0aGUgYXJndW1lbnQgd2FzIGluaXRpYWxseSByZWR1Y2VkIGJ5XHJcbiAqIGV4cCh4KSA9IGV4cChyKSAqIDEwXmsgIHdoZXJlIHIgPSB4IC0gayAqIGxuMTAsIGsgPSBmbG9vcih4IC8gbG4xMClcclxuICogdG8gZmlyc3QgcHV0IHIgaW4gdGhlIHJhbmdlIFswLCBsbjEwXSwgYmVmb3JlIGRpdmlkaW5nIGJ5IDMyIHVudGlsIHx4fCA8IDAuMSwgYnV0IHRoaXMgd2FzXHJcbiAqIGZvdW5kIHRvIGJlIHNsb3dlciB0aGFuIGp1c3QgZGl2aWRpbmcgcmVwZWF0ZWRseSBieSAzMiBhcyBhYm92ZS5cclxuICpcclxuICogTWF4IGludGVnZXIgYXJndW1lbnQ6IGV4cCgnMjA3MjMyNjU4MzY5NDY0MTMnKSA9IDYuM2UrOTAwMDAwMDAwMDAwMDAwMFxyXG4gKiBNaW4gaW50ZWdlciBhcmd1bWVudDogZXhwKCctMjA3MjMyNjU4MzY5NDY0MTEnKSA9IDEuMmUtOTAwMDAwMDAwMDAwMDAwMFxyXG4gKiAoTWF0aCBvYmplY3QgaW50ZWdlciBtaW4vbWF4OiBNYXRoLmV4cCg3MDkpID0gOC4yZSszMDcsIE1hdGguZXhwKC03NDUpID0gNWUtMzI0KVxyXG4gKlxyXG4gKiAgZXhwKEluZmluaXR5KSAgPSBJbmZpbml0eVxyXG4gKiAgZXhwKC1JbmZpbml0eSkgPSAwXHJcbiAqICBleHAoTmFOKSAgICAgICA9IE5hTlxyXG4gKiAgZXhwKFx1MDBCMTApICAgICAgICA9IDFcclxuICpcclxuICogIGV4cCh4KSBpcyBub24tdGVybWluYXRpbmcgZm9yIGFueSBmaW5pdGUsIG5vbi16ZXJvIHguXHJcbiAqXHJcbiAqICBUaGUgcmVzdWx0IHdpbGwgYWx3YXlzIGJlIGNvcnJlY3RseSByb3VuZGVkLlxyXG4gKlxyXG4gKi9cclxuZnVuY3Rpb24gbmF0dXJhbEV4cG9uZW50aWFsKHgsIHNkKSB7XHJcbiAgdmFyIGRlbm9taW5hdG9yLCBndWFyZCwgaiwgcG93LCBzdW0sIHQsIHdwcixcclxuICAgIHJlcCA9IDAsXHJcbiAgICBpID0gMCxcclxuICAgIGsgPSAwLFxyXG4gICAgQ3RvciA9IHguY29uc3RydWN0b3IsXHJcbiAgICBybSA9IEN0b3Iucm91bmRpbmcsXHJcbiAgICBwciA9IEN0b3IucHJlY2lzaW9uO1xyXG5cclxuICAvLyAwL05hTi9JbmZpbml0eT9cclxuICBpZiAoIXguZCB8fCAheC5kWzBdIHx8IHguZSA+IDE3KSB7XHJcblxyXG4gICAgcmV0dXJuIG5ldyBDdG9yKHguZFxyXG4gICAgICA/ICF4LmRbMF0gPyAxIDogeC5zIDwgMCA/IDAgOiAxIC8gMFxyXG4gICAgICA6IHgucyA/IHgucyA8IDAgPyAwIDogeCA6IDAgLyAwKTtcclxuICB9XHJcblxyXG4gIGlmIChzZCA9PSBudWxsKSB7XHJcbiAgICBleHRlcm5hbCA9IGZhbHNlO1xyXG4gICAgd3ByID0gcHI7XHJcbiAgfSBlbHNlIHtcclxuICAgIHdwciA9IHNkO1xyXG4gIH1cclxuXHJcbiAgdCA9IG5ldyBDdG9yKDAuMDMxMjUpO1xyXG5cclxuICAvLyB3aGlsZSBhYnMoeCkgPj0gMC4xXHJcbiAgd2hpbGUgKHguZSA+IC0yKSB7XHJcblxyXG4gICAgLy8geCA9IHggLyAyXjVcclxuICAgIHggPSB4LnRpbWVzKHQpO1xyXG4gICAgayArPSA1O1xyXG4gIH1cclxuXHJcbiAgLy8gVXNlIDIgKiBsb2cxMCgyXmspICsgNSAoZW1waXJpY2FsbHkgZGVyaXZlZCkgdG8gZXN0aW1hdGUgdGhlIGluY3JlYXNlIGluIHByZWNpc2lvblxyXG4gIC8vIG5lY2Vzc2FyeSB0byBlbnN1cmUgdGhlIGZpcnN0IDQgcm91bmRpbmcgZGlnaXRzIGFyZSBjb3JyZWN0LlxyXG4gIGd1YXJkID0gTWF0aC5sb2cobWF0aHBvdygyLCBrKSkgLyBNYXRoLkxOMTAgKiAyICsgNSB8IDA7XHJcbiAgd3ByICs9IGd1YXJkO1xyXG4gIGRlbm9taW5hdG9yID0gcG93ID0gc3VtID0gbmV3IEN0b3IoMSk7XHJcbiAgQ3Rvci5wcmVjaXNpb24gPSB3cHI7XHJcblxyXG4gIGZvciAoOzspIHtcclxuICAgIHBvdyA9IGZpbmFsaXNlKHBvdy50aW1lcyh4KSwgd3ByLCAxKTtcclxuICAgIGRlbm9taW5hdG9yID0gZGVub21pbmF0b3IudGltZXMoKytpKTtcclxuICAgIHQgPSBzdW0ucGx1cyhkaXZpZGUocG93LCBkZW5vbWluYXRvciwgd3ByLCAxKSk7XHJcblxyXG4gICAgaWYgKGRpZ2l0c1RvU3RyaW5nKHQuZCkuc2xpY2UoMCwgd3ByKSA9PT0gZGlnaXRzVG9TdHJpbmcoc3VtLmQpLnNsaWNlKDAsIHdwcikpIHtcclxuICAgICAgaiA9IGs7XHJcbiAgICAgIHdoaWxlIChqLS0pIHN1bSA9IGZpbmFsaXNlKHN1bS50aW1lcyhzdW0pLCB3cHIsIDEpO1xyXG5cclxuICAgICAgLy8gQ2hlY2sgdG8gc2VlIGlmIHRoZSBmaXJzdCA0IHJvdW5kaW5nIGRpZ2l0cyBhcmUgWzQ5XTk5OS5cclxuICAgICAgLy8gSWYgc28sIHJlcGVhdCB0aGUgc3VtbWF0aW9uIHdpdGggYSBoaWdoZXIgcHJlY2lzaW9uLCBvdGhlcndpc2VcclxuICAgICAgLy8gZS5nLiB3aXRoIHByZWNpc2lvbjogMTgsIHJvdW5kaW5nOiAxXHJcbiAgICAgIC8vIGV4cCgxOC40MDQyNzI0NjI1OTUwMzQwODM1Njc3OTM5MTk4NDM3NjEpID0gOTgzNzI1NjAuMTIyOTk5OTk5OSAoc2hvdWxkIGJlIDk4MzcyNTYwLjEyMylcclxuICAgICAgLy8gYHdwciAtIGd1YXJkYCBpcyB0aGUgaW5kZXggb2YgZmlyc3Qgcm91bmRpbmcgZGlnaXQuXHJcbiAgICAgIGlmIChzZCA9PSBudWxsKSB7XHJcblxyXG4gICAgICAgIGlmIChyZXAgPCAzICYmIGNoZWNrUm91bmRpbmdEaWdpdHMoc3VtLmQsIHdwciAtIGd1YXJkLCBybSwgcmVwKSkge1xyXG4gICAgICAgICAgQ3Rvci5wcmVjaXNpb24gPSB3cHIgKz0gMTA7XHJcbiAgICAgICAgICBkZW5vbWluYXRvciA9IHBvdyA9IHQgPSBuZXcgQ3RvcigxKTtcclxuICAgICAgICAgIGkgPSAwO1xyXG4gICAgICAgICAgcmVwKys7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgIHJldHVybiBmaW5hbGlzZShzdW0sIEN0b3IucHJlY2lzaW9uID0gcHIsIHJtLCBleHRlcm5hbCA9IHRydWUpO1xyXG4gICAgICAgIH1cclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICBDdG9yLnByZWNpc2lvbiA9IHByO1xyXG4gICAgICAgIHJldHVybiBzdW07XHJcbiAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBzdW0gPSB0O1xyXG4gIH1cclxufVxyXG5cclxuXHJcbi8qXHJcbiAqIFJldHVybiBhIG5ldyBEZWNpbWFsIHdob3NlIHZhbHVlIGlzIHRoZSBuYXR1cmFsIGxvZ2FyaXRobSBvZiBgeGAgcm91bmRlZCB0byBgc2RgIHNpZ25pZmljYW50XHJcbiAqIGRpZ2l0cy5cclxuICpcclxuICogIGxuKC1uKSAgICAgICAgPSBOYU5cclxuICogIGxuKDApICAgICAgICAgPSAtSW5maW5pdHlcclxuICogIGxuKC0wKSAgICAgICAgPSAtSW5maW5pdHlcclxuICogIGxuKDEpICAgICAgICAgPSAwXHJcbiAqICBsbihJbmZpbml0eSkgID0gSW5maW5pdHlcclxuICogIGxuKC1JbmZpbml0eSkgPSBOYU5cclxuICogIGxuKE5hTikgICAgICAgPSBOYU5cclxuICpcclxuICogIGxuKG4pIChuICE9IDEpIGlzIG5vbi10ZXJtaW5hdGluZy5cclxuICpcclxuICovXHJcbmZ1bmN0aW9uIG5hdHVyYWxMb2dhcml0aG0oeSwgc2QpIHtcclxuICB2YXIgYywgYzAsIGRlbm9taW5hdG9yLCBlLCBudW1lcmF0b3IsIHJlcCwgc3VtLCB0LCB3cHIsIHgxLCB4MixcclxuICAgIG4gPSAxLFxyXG4gICAgZ3VhcmQgPSAxMCxcclxuICAgIHggPSB5LFxyXG4gICAgeGQgPSB4LmQsXHJcbiAgICBDdG9yID0geC5jb25zdHJ1Y3RvcixcclxuICAgIHJtID0gQ3Rvci5yb3VuZGluZyxcclxuICAgIHByID0gQ3Rvci5wcmVjaXNpb247XHJcblxyXG4gIC8vIElzIHggbmVnYXRpdmUgb3IgSW5maW5pdHksIE5hTiwgMCBvciAxP1xyXG4gIGlmICh4LnMgPCAwIHx8ICF4ZCB8fCAheGRbMF0gfHwgIXguZSAmJiB4ZFswXSA9PSAxICYmIHhkLmxlbmd0aCA9PSAxKSB7XHJcbiAgICByZXR1cm4gbmV3IEN0b3IoeGQgJiYgIXhkWzBdID8gLTEgLyAwIDogeC5zICE9IDEgPyBOYU4gOiB4ZCA/IDAgOiB4KTtcclxuICB9XHJcblxyXG4gIGlmIChzZCA9PSBudWxsKSB7XHJcbiAgICBleHRlcm5hbCA9IGZhbHNlO1xyXG4gICAgd3ByID0gcHI7XHJcbiAgfSBlbHNlIHtcclxuICAgIHdwciA9IHNkO1xyXG4gIH1cclxuXHJcbiAgQ3Rvci5wcmVjaXNpb24gPSB3cHIgKz0gZ3VhcmQ7XHJcbiAgYyA9IGRpZ2l0c1RvU3RyaW5nKHhkKTtcclxuICBjMCA9IGMuY2hhckF0KDApO1xyXG5cclxuICBpZiAoTWF0aC5hYnMoZSA9IHguZSkgPCAxLjVlMTUpIHtcclxuXHJcbiAgICAvLyBBcmd1bWVudCByZWR1Y3Rpb24uXHJcbiAgICAvLyBUaGUgc2VyaWVzIGNvbnZlcmdlcyBmYXN0ZXIgdGhlIGNsb3NlciB0aGUgYXJndW1lbnQgaXMgdG8gMSwgc28gdXNpbmdcclxuICAgIC8vIGxuKGFeYikgPSBiICogbG4oYSksICAgbG4oYSkgPSBsbihhXmIpIC8gYlxyXG4gICAgLy8gbXVsdGlwbHkgdGhlIGFyZ3VtZW50IGJ5IGl0c2VsZiB1bnRpbCB0aGUgbGVhZGluZyBkaWdpdHMgb2YgdGhlIHNpZ25pZmljYW5kIGFyZSA3LCA4LCA5LFxyXG4gICAgLy8gMTAsIDExLCAxMiBvciAxMywgcmVjb3JkaW5nIHRoZSBudW1iZXIgb2YgbXVsdGlwbGljYXRpb25zIHNvIHRoZSBzdW0gb2YgdGhlIHNlcmllcyBjYW5cclxuICAgIC8vIGxhdGVyIGJlIGRpdmlkZWQgYnkgdGhpcyBudW1iZXIsIHRoZW4gc2VwYXJhdGUgb3V0IHRoZSBwb3dlciBvZiAxMCB1c2luZ1xyXG4gICAgLy8gbG4oYSoxMF5iKSA9IGxuKGEpICsgYipsbigxMCkuXHJcblxyXG4gICAgLy8gbWF4IG4gaXMgMjEgKGdpdmVzIDAuOSwgMS4wIG9yIDEuMSkgKDllMTUgLyAyMSA9IDQuMmUxNCkuXHJcbiAgICAvL3doaWxlIChjMCA8IDkgJiYgYzAgIT0gMSB8fCBjMCA9PSAxICYmIGMuY2hhckF0KDEpID4gMSkge1xyXG4gICAgLy8gbWF4IG4gaXMgNiAoZ2l2ZXMgMC43IC0gMS4zKVxyXG4gICAgd2hpbGUgKGMwIDwgNyAmJiBjMCAhPSAxIHx8IGMwID09IDEgJiYgYy5jaGFyQXQoMSkgPiAzKSB7XHJcbiAgICAgIHggPSB4LnRpbWVzKHkpO1xyXG4gICAgICBjID0gZGlnaXRzVG9TdHJpbmcoeC5kKTtcclxuICAgICAgYzAgPSBjLmNoYXJBdCgwKTtcclxuICAgICAgbisrO1xyXG4gICAgfVxyXG5cclxuICAgIGUgPSB4LmU7XHJcblxyXG4gICAgaWYgKGMwID4gMSkge1xyXG4gICAgICB4ID0gbmV3IEN0b3IoJzAuJyArIGMpO1xyXG4gICAgICBlKys7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICB4ID0gbmV3IEN0b3IoYzAgKyAnLicgKyBjLnNsaWNlKDEpKTtcclxuICAgIH1cclxuICB9IGVsc2Uge1xyXG5cclxuICAgIC8vIFRoZSBhcmd1bWVudCByZWR1Y3Rpb24gbWV0aG9kIGFib3ZlIG1heSByZXN1bHQgaW4gb3ZlcmZsb3cgaWYgdGhlIGFyZ3VtZW50IHkgaXMgYSBtYXNzaXZlXHJcbiAgICAvLyBudW1iZXIgd2l0aCBleHBvbmVudCA+PSAxNTAwMDAwMDAwMDAwMDAwICg5ZTE1IC8gNiA9IDEuNWUxNSksIHNvIGluc3RlYWQgcmVjYWxsIHRoaXNcclxuICAgIC8vIGZ1bmN0aW9uIHVzaW5nIGxuKHgqMTBeZSkgPSBsbih4KSArIGUqbG4oMTApLlxyXG4gICAgdCA9IGdldExuMTAoQ3Rvciwgd3ByICsgMiwgcHIpLnRpbWVzKGUgKyAnJyk7XHJcbiAgICB4ID0gbmF0dXJhbExvZ2FyaXRobShuZXcgQ3RvcihjMCArICcuJyArIGMuc2xpY2UoMSkpLCB3cHIgLSBndWFyZCkucGx1cyh0KTtcclxuICAgIEN0b3IucHJlY2lzaW9uID0gcHI7XHJcblxyXG4gICAgcmV0dXJuIHNkID09IG51bGwgPyBmaW5hbGlzZSh4LCBwciwgcm0sIGV4dGVybmFsID0gdHJ1ZSkgOiB4O1xyXG4gIH1cclxuXHJcbiAgLy8geDEgaXMgeCByZWR1Y2VkIHRvIGEgdmFsdWUgbmVhciAxLlxyXG4gIHgxID0geDtcclxuXHJcbiAgLy8gVGF5bG9yIHNlcmllcy5cclxuICAvLyBsbih5KSA9IGxuKCgxICsgeCkvKDEgLSB4KSkgPSAyKHggKyB4XjMvMyArIHheNS81ICsgeF43LzcgKyAuLi4pXHJcbiAgLy8gd2hlcmUgeCA9ICh5IC0gMSkvKHkgKyAxKSAgICAofHh8IDwgMSlcclxuICBzdW0gPSBudW1lcmF0b3IgPSB4ID0gZGl2aWRlKHgubWludXMoMSksIHgucGx1cygxKSwgd3ByLCAxKTtcclxuICB4MiA9IGZpbmFsaXNlKHgudGltZXMoeCksIHdwciwgMSk7XHJcbiAgZGVub21pbmF0b3IgPSAzO1xyXG5cclxuICBmb3IgKDs7KSB7XHJcbiAgICBudW1lcmF0b3IgPSBmaW5hbGlzZShudW1lcmF0b3IudGltZXMoeDIpLCB3cHIsIDEpO1xyXG4gICAgdCA9IHN1bS5wbHVzKGRpdmlkZShudW1lcmF0b3IsIG5ldyBDdG9yKGRlbm9taW5hdG9yKSwgd3ByLCAxKSk7XHJcblxyXG4gICAgaWYgKGRpZ2l0c1RvU3RyaW5nKHQuZCkuc2xpY2UoMCwgd3ByKSA9PT0gZGlnaXRzVG9TdHJpbmcoc3VtLmQpLnNsaWNlKDAsIHdwcikpIHtcclxuICAgICAgc3VtID0gc3VtLnRpbWVzKDIpO1xyXG5cclxuICAgICAgLy8gUmV2ZXJzZSB0aGUgYXJndW1lbnQgcmVkdWN0aW9uLiBDaGVjayB0aGF0IGUgaXMgbm90IDAgYmVjYXVzZSwgYmVzaWRlcyBwcmV2ZW50aW5nIGFuXHJcbiAgICAgIC8vIHVubmVjZXNzYXJ5IGNhbGN1bGF0aW9uLCAtMCArIDAgPSArMCBhbmQgdG8gZW5zdXJlIGNvcnJlY3Qgcm91bmRpbmcgLTAgbmVlZHMgdG8gc3RheSAtMC5cclxuICAgICAgaWYgKGUgIT09IDApIHN1bSA9IHN1bS5wbHVzKGdldExuMTAoQ3Rvciwgd3ByICsgMiwgcHIpLnRpbWVzKGUgKyAnJykpO1xyXG4gICAgICBzdW0gPSBkaXZpZGUoc3VtLCBuZXcgQ3RvcihuKSwgd3ByLCAxKTtcclxuXHJcbiAgICAgIC8vIElzIHJtID4gMyBhbmQgdGhlIGZpcnN0IDQgcm91bmRpbmcgZGlnaXRzIDQ5OTksIG9yIHJtIDwgNCAob3IgdGhlIHN1bW1hdGlvbiBoYXNcclxuICAgICAgLy8gYmVlbiByZXBlYXRlZCBwcmV2aW91c2x5KSBhbmQgdGhlIGZpcnN0IDQgcm91bmRpbmcgZGlnaXRzIDk5OTk/XHJcbiAgICAgIC8vIElmIHNvLCByZXN0YXJ0IHRoZSBzdW1tYXRpb24gd2l0aCBhIGhpZ2hlciBwcmVjaXNpb24sIG90aGVyd2lzZVxyXG4gICAgICAvLyBlLmcuIHdpdGggcHJlY2lzaW9uOiAxMiwgcm91bmRpbmc6IDFcclxuICAgICAgLy8gbG4oMTM1NTIwMDI4LjYxMjYwOTE3MTQyNjUzODE1MzMpID0gMTguNzI0NjI5OTk5OSB3aGVuIGl0IHNob3VsZCBiZSAxOC43MjQ2My5cclxuICAgICAgLy8gYHdwciAtIGd1YXJkYCBpcyB0aGUgaW5kZXggb2YgZmlyc3Qgcm91bmRpbmcgZGlnaXQuXHJcbiAgICAgIGlmIChzZCA9PSBudWxsKSB7XHJcbiAgICAgICAgaWYgKGNoZWNrUm91bmRpbmdEaWdpdHMoc3VtLmQsIHdwciAtIGd1YXJkLCBybSwgcmVwKSkge1xyXG4gICAgICAgICAgQ3Rvci5wcmVjaXNpb24gPSB3cHIgKz0gZ3VhcmQ7XHJcbiAgICAgICAgICB0ID0gbnVtZXJhdG9yID0geCA9IGRpdmlkZSh4MS5taW51cygxKSwgeDEucGx1cygxKSwgd3ByLCAxKTtcclxuICAgICAgICAgIHgyID0gZmluYWxpc2UoeC50aW1lcyh4KSwgd3ByLCAxKTtcclxuICAgICAgICAgIGRlbm9taW5hdG9yID0gcmVwID0gMTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgcmV0dXJuIGZpbmFsaXNlKHN1bSwgQ3Rvci5wcmVjaXNpb24gPSBwciwgcm0sIGV4dGVybmFsID0gdHJ1ZSk7XHJcbiAgICAgICAgfVxyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIEN0b3IucHJlY2lzaW9uID0gcHI7XHJcbiAgICAgICAgcmV0dXJuIHN1bTtcclxuICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHN1bSA9IHQ7XHJcbiAgICBkZW5vbWluYXRvciArPSAyO1xyXG4gIH1cclxufVxyXG5cclxuXHJcbi8vIFx1MDBCMUluZmluaXR5LCBOYU4uXHJcbmZ1bmN0aW9uIG5vbkZpbml0ZVRvU3RyaW5nKHgpIHtcclxuICAvLyBVbnNpZ25lZC5cclxuICByZXR1cm4gU3RyaW5nKHgucyAqIHgucyAvIDApO1xyXG59XHJcblxyXG5cclxuLypcclxuICogUGFyc2UgdGhlIHZhbHVlIG9mIGEgbmV3IERlY2ltYWwgYHhgIGZyb20gc3RyaW5nIGBzdHJgLlxyXG4gKi9cclxuZnVuY3Rpb24gcGFyc2VEZWNpbWFsKHgsIHN0cikge1xyXG4gIHZhciBlLCBpLCBsZW47XHJcblxyXG4gIC8vIERlY2ltYWwgcG9pbnQ/XHJcbiAgaWYgKChlID0gc3RyLmluZGV4T2YoJy4nKSkgPiAtMSkgc3RyID0gc3RyLnJlcGxhY2UoJy4nLCAnJyk7XHJcblxyXG4gIC8vIEV4cG9uZW50aWFsIGZvcm0/XHJcbiAgaWYgKChpID0gc3RyLnNlYXJjaCgvZS9pKSkgPiAwKSB7XHJcblxyXG4gICAgLy8gRGV0ZXJtaW5lIGV4cG9uZW50LlxyXG4gICAgaWYgKGUgPCAwKSBlID0gaTtcclxuICAgIGUgKz0gK3N0ci5zbGljZShpICsgMSk7XHJcbiAgICBzdHIgPSBzdHIuc3Vic3RyaW5nKDAsIGkpO1xyXG4gIH0gZWxzZSBpZiAoZSA8IDApIHtcclxuXHJcbiAgICAvLyBJbnRlZ2VyLlxyXG4gICAgZSA9IHN0ci5sZW5ndGg7XHJcbiAgfVxyXG5cclxuICAvLyBEZXRlcm1pbmUgbGVhZGluZyB6ZXJvcy5cclxuICBmb3IgKGkgPSAwOyBzdHIuY2hhckNvZGVBdChpKSA9PT0gNDg7IGkrKyk7XHJcblxyXG4gIC8vIERldGVybWluZSB0cmFpbGluZyB6ZXJvcy5cclxuICBmb3IgKGxlbiA9IHN0ci5sZW5ndGg7IHN0ci5jaGFyQ29kZUF0KGxlbiAtIDEpID09PSA0ODsgLS1sZW4pO1xyXG4gIHN0ciA9IHN0ci5zbGljZShpLCBsZW4pO1xyXG5cclxuICBpZiAoc3RyKSB7XHJcbiAgICBsZW4gLT0gaTtcclxuICAgIHguZSA9IGUgPSBlIC0gaSAtIDE7XHJcbiAgICB4LmQgPSBbXTtcclxuXHJcbiAgICAvLyBUcmFuc2Zvcm0gYmFzZVxyXG5cclxuICAgIC8vIGUgaXMgdGhlIGJhc2UgMTAgZXhwb25lbnQuXHJcbiAgICAvLyBpIGlzIHdoZXJlIHRvIHNsaWNlIHN0ciB0byBnZXQgdGhlIGZpcnN0IHdvcmQgb2YgdGhlIGRpZ2l0cyBhcnJheS5cclxuICAgIGkgPSAoZSArIDEpICUgTE9HX0JBU0U7XHJcbiAgICBpZiAoZSA8IDApIGkgKz0gTE9HX0JBU0U7XHJcblxyXG4gICAgaWYgKGkgPCBsZW4pIHtcclxuICAgICAgaWYgKGkpIHguZC5wdXNoKCtzdHIuc2xpY2UoMCwgaSkpO1xyXG4gICAgICBmb3IgKGxlbiAtPSBMT0dfQkFTRTsgaSA8IGxlbjspIHguZC5wdXNoKCtzdHIuc2xpY2UoaSwgaSArPSBMT0dfQkFTRSkpO1xyXG4gICAgICBzdHIgPSBzdHIuc2xpY2UoaSk7XHJcbiAgICAgIGkgPSBMT0dfQkFTRSAtIHN0ci5sZW5ndGg7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICBpIC09IGxlbjtcclxuICAgIH1cclxuXHJcbiAgICBmb3IgKDsgaS0tOykgc3RyICs9ICcwJztcclxuICAgIHguZC5wdXNoKCtzdHIpO1xyXG5cclxuICAgIGlmIChleHRlcm5hbCkge1xyXG5cclxuICAgICAgLy8gT3ZlcmZsb3c/XHJcbiAgICAgIGlmICh4LmUgPiB4LmNvbnN0cnVjdG9yLm1heEUpIHtcclxuXHJcbiAgICAgICAgLy8gSW5maW5pdHkuXHJcbiAgICAgICAgeC5kID0gbnVsbDtcclxuICAgICAgICB4LmUgPSBOYU47XHJcblxyXG4gICAgICAvLyBVbmRlcmZsb3c/XHJcbiAgICAgIH0gZWxzZSBpZiAoeC5lIDwgeC5jb25zdHJ1Y3Rvci5taW5FKSB7XHJcblxyXG4gICAgICAgIC8vIFplcm8uXHJcbiAgICAgICAgeC5lID0gMDtcclxuICAgICAgICB4LmQgPSBbMF07XHJcbiAgICAgICAgLy8geC5jb25zdHJ1Y3Rvci51bmRlcmZsb3cgPSB0cnVlO1xyXG4gICAgICB9IC8vIGVsc2UgeC5jb25zdHJ1Y3Rvci51bmRlcmZsb3cgPSBmYWxzZTtcclxuICAgIH1cclxuICB9IGVsc2Uge1xyXG5cclxuICAgIC8vIFplcm8uXHJcbiAgICB4LmUgPSAwO1xyXG4gICAgeC5kID0gWzBdO1xyXG4gIH1cclxuXHJcbiAgcmV0dXJuIHg7XHJcbn1cclxuXHJcblxyXG4vKlxyXG4gKiBQYXJzZSB0aGUgdmFsdWUgb2YgYSBuZXcgRGVjaW1hbCBgeGAgZnJvbSBhIHN0cmluZyBgc3RyYCwgd2hpY2ggaXMgbm90IGEgZGVjaW1hbCB2YWx1ZS5cclxuICovXHJcbmZ1bmN0aW9uIHBhcnNlT3RoZXIoeCwgc3RyKSB7XHJcbiAgdmFyIGJhc2UsIEN0b3IsIGRpdmlzb3IsIGksIGlzRmxvYXQsIGxlbiwgcCwgeGQsIHhlO1xyXG5cclxuICBpZiAoc3RyLmluZGV4T2YoJ18nKSA+IC0xKSB7XHJcbiAgICBzdHIgPSBzdHIucmVwbGFjZSgvKFxcZClfKD89XFxkKS9nLCAnJDEnKTtcclxuICAgIGlmIChpc0RlY2ltYWwudGVzdChzdHIpKSByZXR1cm4gcGFyc2VEZWNpbWFsKHgsIHN0cik7XHJcbiAgfSBlbHNlIGlmIChzdHIgPT09ICdJbmZpbml0eScgfHwgc3RyID09PSAnTmFOJykge1xyXG4gICAgaWYgKCErc3RyKSB4LnMgPSBOYU47XHJcbiAgICB4LmUgPSBOYU47XHJcbiAgICB4LmQgPSBudWxsO1xyXG4gICAgcmV0dXJuIHg7XHJcbiAgfVxyXG5cclxuICBpZiAoaXNIZXgudGVzdChzdHIpKSAge1xyXG4gICAgYmFzZSA9IDE2O1xyXG4gICAgc3RyID0gc3RyLnRvTG93ZXJDYXNlKCk7XHJcbiAgfSBlbHNlIGlmIChpc0JpbmFyeS50ZXN0KHN0cikpICB7XHJcbiAgICBiYXNlID0gMjtcclxuICB9IGVsc2UgaWYgKGlzT2N0YWwudGVzdChzdHIpKSAge1xyXG4gICAgYmFzZSA9IDg7XHJcbiAgfSBlbHNlIHtcclxuICAgIHRocm93IEVycm9yKGludmFsaWRBcmd1bWVudCArIHN0cik7XHJcbiAgfVxyXG5cclxuICAvLyBJcyB0aGVyZSBhIGJpbmFyeSBleHBvbmVudCBwYXJ0P1xyXG4gIGkgPSBzdHIuc2VhcmNoKC9wL2kpO1xyXG5cclxuICBpZiAoaSA+IDApIHtcclxuICAgIHAgPSArc3RyLnNsaWNlKGkgKyAxKTtcclxuICAgIHN0ciA9IHN0ci5zdWJzdHJpbmcoMiwgaSk7XHJcbiAgfSBlbHNlIHtcclxuICAgIHN0ciA9IHN0ci5zbGljZSgyKTtcclxuICB9XHJcblxyXG4gIC8vIENvbnZlcnQgYHN0cmAgYXMgYW4gaW50ZWdlciB0aGVuIGRpdmlkZSB0aGUgcmVzdWx0IGJ5IGBiYXNlYCByYWlzZWQgdG8gYSBwb3dlciBzdWNoIHRoYXQgdGhlXHJcbiAgLy8gZnJhY3Rpb24gcGFydCB3aWxsIGJlIHJlc3RvcmVkLlxyXG4gIGkgPSBzdHIuaW5kZXhPZignLicpO1xyXG4gIGlzRmxvYXQgPSBpID49IDA7XHJcbiAgQ3RvciA9IHguY29uc3RydWN0b3I7XHJcblxyXG4gIGlmIChpc0Zsb2F0KSB7XHJcbiAgICBzdHIgPSBzdHIucmVwbGFjZSgnLicsICcnKTtcclxuICAgIGxlbiA9IHN0ci5sZW5ndGg7XHJcbiAgICBpID0gbGVuIC0gaTtcclxuXHJcbiAgICAvLyBsb2dbMTBdKDE2KSA9IDEuMjA0MS4uLiAsIGxvZ1sxMF0oODgpID0gMS45NDQ0Li4uLlxyXG4gICAgZGl2aXNvciA9IGludFBvdyhDdG9yLCBuZXcgQ3RvcihiYXNlKSwgaSwgaSAqIDIpO1xyXG4gIH1cclxuXHJcbiAgeGQgPSBjb252ZXJ0QmFzZShzdHIsIGJhc2UsIEJBU0UpO1xyXG4gIHhlID0geGQubGVuZ3RoIC0gMTtcclxuXHJcbiAgLy8gUmVtb3ZlIHRyYWlsaW5nIHplcm9zLlxyXG4gIGZvciAoaSA9IHhlOyB4ZFtpXSA9PT0gMDsgLS1pKSB4ZC5wb3AoKTtcclxuICBpZiAoaSA8IDApIHJldHVybiBuZXcgQ3Rvcih4LnMgKiAwKTtcclxuICB4LmUgPSBnZXRCYXNlMTBFeHBvbmVudCh4ZCwgeGUpO1xyXG4gIHguZCA9IHhkO1xyXG4gIGV4dGVybmFsID0gZmFsc2U7XHJcblxyXG4gIC8vIEF0IHdoYXQgcHJlY2lzaW9uIHRvIHBlcmZvcm0gdGhlIGRpdmlzaW9uIHRvIGVuc3VyZSBleGFjdCBjb252ZXJzaW9uP1xyXG4gIC8vIG1heERlY2ltYWxJbnRlZ2VyUGFydERpZ2l0Q291bnQgPSBjZWlsKGxvZ1sxMF0oYikgKiBvdGhlckJhc2VJbnRlZ2VyUGFydERpZ2l0Q291bnQpXHJcbiAgLy8gbG9nWzEwXSgyKSA9IDAuMzAxMDMsIGxvZ1sxMF0oOCkgPSAwLjkwMzA5LCBsb2dbMTBdKDE2KSA9IDEuMjA0MTJcclxuICAvLyBFLmcuIGNlaWwoMS4yICogMykgPSA0LCBzbyB1cCB0byA0IGRlY2ltYWwgZGlnaXRzIGFyZSBuZWVkZWQgdG8gcmVwcmVzZW50IDMgaGV4IGludCBkaWdpdHMuXHJcbiAgLy8gbWF4RGVjaW1hbEZyYWN0aW9uUGFydERpZ2l0Q291bnQgPSB7SGV4OjR8T2N0OjN8QmluOjF9ICogb3RoZXJCYXNlRnJhY3Rpb25QYXJ0RGlnaXRDb3VudFxyXG4gIC8vIFRoZXJlZm9yZSB1c2luZyA0ICogdGhlIG51bWJlciBvZiBkaWdpdHMgb2Ygc3RyIHdpbGwgYWx3YXlzIGJlIGVub3VnaC5cclxuICBpZiAoaXNGbG9hdCkgeCA9IGRpdmlkZSh4LCBkaXZpc29yLCBsZW4gKiA0KTtcclxuXHJcbiAgLy8gTXVsdGlwbHkgYnkgdGhlIGJpbmFyeSBleHBvbmVudCBwYXJ0IGlmIHByZXNlbnQuXHJcbiAgaWYgKHApIHggPSB4LnRpbWVzKE1hdGguYWJzKHApIDwgNTQgPyBtYXRocG93KDIsIHApIDogRGVjaW1hbC5wb3coMiwgcCkpO1xyXG4gIGV4dGVybmFsID0gdHJ1ZTtcclxuXHJcbiAgcmV0dXJuIHg7XHJcbn1cclxuXHJcblxyXG4vKlxyXG4gKiBzaW4oeCkgPSB4IC0geF4zLzMhICsgeF41LzUhIC0gLi4uXHJcbiAqIHx4fCA8IHBpLzJcclxuICpcclxuICovXHJcbmZ1bmN0aW9uIHNpbmUoQ3RvciwgeCkge1xyXG4gIHZhciBrLFxyXG4gICAgbGVuID0geC5kLmxlbmd0aDtcclxuXHJcbiAgaWYgKGxlbiA8IDMpIHtcclxuICAgIHJldHVybiB4LmlzWmVybygpID8geCA6IHRheWxvclNlcmllcyhDdG9yLCAyLCB4LCB4KTtcclxuICB9XHJcblxyXG4gIC8vIEFyZ3VtZW50IHJlZHVjdGlvbjogc2luKDV4KSA9IDE2KnNpbl41KHgpIC0gMjAqc2luXjMoeCkgKyA1KnNpbih4KVxyXG4gIC8vIGkuZS4gc2luKHgpID0gMTYqc2luXjUoeC81KSAtIDIwKnNpbl4zKHgvNSkgKyA1KnNpbih4LzUpXHJcbiAgLy8gYW5kICBzaW4oeCkgPSBzaW4oeC81KSg1ICsgc2luXjIoeC81KSgxNnNpbl4yKHgvNSkgLSAyMCkpXHJcblxyXG4gIC8vIEVzdGltYXRlIHRoZSBvcHRpbXVtIG51bWJlciBvZiB0aW1lcyB0byB1c2UgdGhlIGFyZ3VtZW50IHJlZHVjdGlvbi5cclxuICBrID0gMS40ICogTWF0aC5zcXJ0KGxlbik7XHJcbiAgayA9IGsgPiAxNiA/IDE2IDogayB8IDA7XHJcblxyXG4gIHggPSB4LnRpbWVzKDEgLyB0aW55UG93KDUsIGspKTtcclxuICB4ID0gdGF5bG9yU2VyaWVzKEN0b3IsIDIsIHgsIHgpO1xyXG5cclxuICAvLyBSZXZlcnNlIGFyZ3VtZW50IHJlZHVjdGlvblxyXG4gIHZhciBzaW4yX3gsXHJcbiAgICBkNSA9IG5ldyBDdG9yKDUpLFxyXG4gICAgZDE2ID0gbmV3IEN0b3IoMTYpLFxyXG4gICAgZDIwID0gbmV3IEN0b3IoMjApO1xyXG4gIGZvciAoOyBrLS07KSB7XHJcbiAgICBzaW4yX3ggPSB4LnRpbWVzKHgpO1xyXG4gICAgeCA9IHgudGltZXMoZDUucGx1cyhzaW4yX3gudGltZXMoZDE2LnRpbWVzKHNpbjJfeCkubWludXMoZDIwKSkpKTtcclxuICB9XHJcblxyXG4gIHJldHVybiB4O1xyXG59XHJcblxyXG5cclxuLy8gQ2FsY3VsYXRlIFRheWxvciBzZXJpZXMgZm9yIGBjb3NgLCBgY29zaGAsIGBzaW5gIGFuZCBgc2luaGAuXHJcbmZ1bmN0aW9uIHRheWxvclNlcmllcyhDdG9yLCBuLCB4LCB5LCBpc0h5cGVyYm9saWMpIHtcclxuICB2YXIgaiwgdCwgdSwgeDIsXHJcbiAgICBpID0gMSxcclxuICAgIHByID0gQ3Rvci5wcmVjaXNpb24sXHJcbiAgICBrID0gTWF0aC5jZWlsKHByIC8gTE9HX0JBU0UpO1xyXG5cclxuICBleHRlcm5hbCA9IGZhbHNlO1xyXG4gIHgyID0geC50aW1lcyh4KTtcclxuICB1ID0gbmV3IEN0b3IoeSk7XHJcblxyXG4gIGZvciAoOzspIHtcclxuICAgIHQgPSBkaXZpZGUodS50aW1lcyh4MiksIG5ldyBDdG9yKG4rKyAqIG4rKyksIHByLCAxKTtcclxuICAgIHUgPSBpc0h5cGVyYm9saWMgPyB5LnBsdXModCkgOiB5Lm1pbnVzKHQpO1xyXG4gICAgeSA9IGRpdmlkZSh0LnRpbWVzKHgyKSwgbmV3IEN0b3IobisrICogbisrKSwgcHIsIDEpO1xyXG4gICAgdCA9IHUucGx1cyh5KTtcclxuXHJcbiAgICBpZiAodC5kW2tdICE9PSB2b2lkIDApIHtcclxuICAgICAgZm9yIChqID0gazsgdC5kW2pdID09PSB1LmRbal0gJiYgai0tOyk7XHJcbiAgICAgIGlmIChqID09IC0xKSBicmVhaztcclxuICAgIH1cclxuXHJcbiAgICBqID0gdTtcclxuICAgIHUgPSB5O1xyXG4gICAgeSA9IHQ7XHJcbiAgICB0ID0gajtcclxuICAgIGkrKztcclxuICB9XHJcblxyXG4gIGV4dGVybmFsID0gdHJ1ZTtcclxuICB0LmQubGVuZ3RoID0gayArIDE7XHJcblxyXG4gIHJldHVybiB0O1xyXG59XHJcblxyXG5cclxuLy8gRXhwb25lbnQgZSBtdXN0IGJlIHBvc2l0aXZlIGFuZCBub24temVyby5cclxuZnVuY3Rpb24gdGlueVBvdyhiLCBlKSB7XHJcbiAgdmFyIG4gPSBiO1xyXG4gIHdoaWxlICgtLWUpIG4gKj0gYjtcclxuICByZXR1cm4gbjtcclxufVxyXG5cclxuXHJcbi8vIFJldHVybiB0aGUgYWJzb2x1dGUgdmFsdWUgb2YgYHhgIHJlZHVjZWQgdG8gbGVzcyB0aGFuIG9yIGVxdWFsIHRvIGhhbGYgcGkuXHJcbmZ1bmN0aW9uIHRvTGVzc1RoYW5IYWxmUGkoQ3RvciwgeCkge1xyXG4gIHZhciB0LFxyXG4gICAgaXNOZWcgPSB4LnMgPCAwLFxyXG4gICAgcGkgPSBnZXRQaShDdG9yLCBDdG9yLnByZWNpc2lvbiwgMSksXHJcbiAgICBoYWxmUGkgPSBwaS50aW1lcygwLjUpO1xyXG5cclxuICB4ID0geC5hYnMoKTtcclxuXHJcbiAgaWYgKHgubHRlKGhhbGZQaSkpIHtcclxuICAgIHF1YWRyYW50ID0gaXNOZWcgPyA0IDogMTtcclxuICAgIHJldHVybiB4O1xyXG4gIH1cclxuXHJcbiAgdCA9IHguZGl2VG9JbnQocGkpO1xyXG5cclxuICBpZiAodC5pc1plcm8oKSkge1xyXG4gICAgcXVhZHJhbnQgPSBpc05lZyA/IDMgOiAyO1xyXG4gIH0gZWxzZSB7XHJcbiAgICB4ID0geC5taW51cyh0LnRpbWVzKHBpKSk7XHJcblxyXG4gICAgLy8gMCA8PSB4IDwgcGlcclxuICAgIGlmICh4Lmx0ZShoYWxmUGkpKSB7XHJcbiAgICAgIHF1YWRyYW50ID0gaXNPZGQodCkgPyAoaXNOZWcgPyAyIDogMykgOiAoaXNOZWcgPyA0IDogMSk7XHJcbiAgICAgIHJldHVybiB4O1xyXG4gICAgfVxyXG5cclxuICAgIHF1YWRyYW50ID0gaXNPZGQodCkgPyAoaXNOZWcgPyAxIDogNCkgOiAoaXNOZWcgPyAzIDogMik7XHJcbiAgfVxyXG5cclxuICByZXR1cm4geC5taW51cyhwaSkuYWJzKCk7XHJcbn1cclxuXHJcblxyXG4vKlxyXG4gKiBSZXR1cm4gdGhlIHZhbHVlIG9mIERlY2ltYWwgYHhgIGFzIGEgc3RyaW5nIGluIGJhc2UgYGJhc2VPdXRgLlxyXG4gKlxyXG4gKiBJZiB0aGUgb3B0aW9uYWwgYHNkYCBhcmd1bWVudCBpcyBwcmVzZW50IGluY2x1ZGUgYSBiaW5hcnkgZXhwb25lbnQgc3VmZml4LlxyXG4gKi9cclxuZnVuY3Rpb24gdG9TdHJpbmdCaW5hcnkoeCwgYmFzZU91dCwgc2QsIHJtKSB7XHJcbiAgdmFyIGJhc2UsIGUsIGksIGssIGxlbiwgcm91bmRVcCwgc3RyLCB4ZCwgeSxcclxuICAgIEN0b3IgPSB4LmNvbnN0cnVjdG9yLFxyXG4gICAgaXNFeHAgPSBzZCAhPT0gdm9pZCAwO1xyXG5cclxuICBpZiAoaXNFeHApIHtcclxuICAgIGNoZWNrSW50MzIoc2QsIDEsIE1BWF9ESUdJVFMpO1xyXG4gICAgaWYgKHJtID09PSB2b2lkIDApIHJtID0gQ3Rvci5yb3VuZGluZztcclxuICAgIGVsc2UgY2hlY2tJbnQzMihybSwgMCwgOCk7XHJcbiAgfSBlbHNlIHtcclxuICAgIHNkID0gQ3Rvci5wcmVjaXNpb247XHJcbiAgICBybSA9IEN0b3Iucm91bmRpbmc7XHJcbiAgfVxyXG5cclxuICBpZiAoIXguaXNGaW5pdGUoKSkge1xyXG4gICAgc3RyID0gbm9uRmluaXRlVG9TdHJpbmcoeCk7XHJcbiAgfSBlbHNlIHtcclxuICAgIHN0ciA9IGZpbml0ZVRvU3RyaW5nKHgpO1xyXG4gICAgaSA9IHN0ci5pbmRleE9mKCcuJyk7XHJcblxyXG4gICAgLy8gVXNlIGV4cG9uZW50aWFsIG5vdGF0aW9uIGFjY29yZGluZyB0byBgdG9FeHBQb3NgIGFuZCBgdG9FeHBOZWdgPyBObywgYnV0IGlmIHJlcXVpcmVkOlxyXG4gICAgLy8gbWF4QmluYXJ5RXhwb25lbnQgPSBmbG9vcigoZGVjaW1hbEV4cG9uZW50ICsgMSkgKiBsb2dbMl0oMTApKVxyXG4gICAgLy8gbWluQmluYXJ5RXhwb25lbnQgPSBmbG9vcihkZWNpbWFsRXhwb25lbnQgKiBsb2dbMl0oMTApKVxyXG4gICAgLy8gbG9nWzJdKDEwKSA9IDMuMzIxOTI4MDk0ODg3MzYyMzQ3ODcwMzE5NDI5NDg5MzkwMTc1ODY0XHJcblxyXG4gICAgaWYgKGlzRXhwKSB7XHJcbiAgICAgIGJhc2UgPSAyO1xyXG4gICAgICBpZiAoYmFzZU91dCA9PSAxNikge1xyXG4gICAgICAgIHNkID0gc2QgKiA0IC0gMztcclxuICAgICAgfSBlbHNlIGlmIChiYXNlT3V0ID09IDgpIHtcclxuICAgICAgICBzZCA9IHNkICogMyAtIDI7XHJcbiAgICAgIH1cclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIGJhc2UgPSBiYXNlT3V0O1xyXG4gICAgfVxyXG5cclxuICAgIC8vIENvbnZlcnQgdGhlIG51bWJlciBhcyBhbiBpbnRlZ2VyIHRoZW4gZGl2aWRlIHRoZSByZXN1bHQgYnkgaXRzIGJhc2UgcmFpc2VkIHRvIGEgcG93ZXIgc3VjaFxyXG4gICAgLy8gdGhhdCB0aGUgZnJhY3Rpb24gcGFydCB3aWxsIGJlIHJlc3RvcmVkLlxyXG5cclxuICAgIC8vIE5vbi1pbnRlZ2VyLlxyXG4gICAgaWYgKGkgPj0gMCkge1xyXG4gICAgICBzdHIgPSBzdHIucmVwbGFjZSgnLicsICcnKTtcclxuICAgICAgeSA9IG5ldyBDdG9yKDEpO1xyXG4gICAgICB5LmUgPSBzdHIubGVuZ3RoIC0gaTtcclxuICAgICAgeS5kID0gY29udmVydEJhc2UoZmluaXRlVG9TdHJpbmcoeSksIDEwLCBiYXNlKTtcclxuICAgICAgeS5lID0geS5kLmxlbmd0aDtcclxuICAgIH1cclxuXHJcbiAgICB4ZCA9IGNvbnZlcnRCYXNlKHN0ciwgMTAsIGJhc2UpO1xyXG4gICAgZSA9IGxlbiA9IHhkLmxlbmd0aDtcclxuXHJcbiAgICAvLyBSZW1vdmUgdHJhaWxpbmcgemVyb3MuXHJcbiAgICBmb3IgKDsgeGRbLS1sZW5dID09IDA7KSB4ZC5wb3AoKTtcclxuXHJcbiAgICBpZiAoIXhkWzBdKSB7XHJcbiAgICAgIHN0ciA9IGlzRXhwID8gJzBwKzAnIDogJzAnO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgaWYgKGkgPCAwKSB7XHJcbiAgICAgICAgZS0tO1xyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIHggPSBuZXcgQ3Rvcih4KTtcclxuICAgICAgICB4LmQgPSB4ZDtcclxuICAgICAgICB4LmUgPSBlO1xyXG4gICAgICAgIHggPSBkaXZpZGUoeCwgeSwgc2QsIHJtLCAwLCBiYXNlKTtcclxuICAgICAgICB4ZCA9IHguZDtcclxuICAgICAgICBlID0geC5lO1xyXG4gICAgICAgIHJvdW5kVXAgPSBpbmV4YWN0O1xyXG4gICAgICB9XHJcblxyXG4gICAgICAvLyBUaGUgcm91bmRpbmcgZGlnaXQsIGkuZS4gdGhlIGRpZ2l0IGFmdGVyIHRoZSBkaWdpdCB0aGF0IG1heSBiZSByb3VuZGVkIHVwLlxyXG4gICAgICBpID0geGRbc2RdO1xyXG4gICAgICBrID0gYmFzZSAvIDI7XHJcbiAgICAgIHJvdW5kVXAgPSByb3VuZFVwIHx8IHhkW3NkICsgMV0gIT09IHZvaWQgMDtcclxuXHJcbiAgICAgIHJvdW5kVXAgPSBybSA8IDRcclxuICAgICAgICA/IChpICE9PSB2b2lkIDAgfHwgcm91bmRVcCkgJiYgKHJtID09PSAwIHx8IHJtID09PSAoeC5zIDwgMCA/IDMgOiAyKSlcclxuICAgICAgICA6IGkgPiBrIHx8IGkgPT09IGsgJiYgKHJtID09PSA0IHx8IHJvdW5kVXAgfHwgcm0gPT09IDYgJiYgeGRbc2QgLSAxXSAmIDEgfHxcclxuICAgICAgICAgIHJtID09PSAoeC5zIDwgMCA/IDggOiA3KSk7XHJcblxyXG4gICAgICB4ZC5sZW5ndGggPSBzZDtcclxuXHJcbiAgICAgIGlmIChyb3VuZFVwKSB7XHJcblxyXG4gICAgICAgIC8vIFJvdW5kaW5nIHVwIG1heSBtZWFuIHRoZSBwcmV2aW91cyBkaWdpdCBoYXMgdG8gYmUgcm91bmRlZCB1cCBhbmQgc28gb24uXHJcbiAgICAgICAgZm9yICg7ICsreGRbLS1zZF0gPiBiYXNlIC0gMTspIHtcclxuICAgICAgICAgIHhkW3NkXSA9IDA7XHJcbiAgICAgICAgICBpZiAoIXNkKSB7XHJcbiAgICAgICAgICAgICsrZTtcclxuICAgICAgICAgICAgeGQudW5zaGlmdCgxKTtcclxuICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIC8vIERldGVybWluZSB0cmFpbGluZyB6ZXJvcy5cclxuICAgICAgZm9yIChsZW4gPSB4ZC5sZW5ndGg7ICF4ZFtsZW4gLSAxXTsgLS1sZW4pO1xyXG5cclxuICAgICAgLy8gRS5nLiBbNCwgMTEsIDE1XSBiZWNvbWVzIDRiZi5cclxuICAgICAgZm9yIChpID0gMCwgc3RyID0gJyc7IGkgPCBsZW47IGkrKykgc3RyICs9IE5VTUVSQUxTLmNoYXJBdCh4ZFtpXSk7XHJcblxyXG4gICAgICAvLyBBZGQgYmluYXJ5IGV4cG9uZW50IHN1ZmZpeD9cclxuICAgICAgaWYgKGlzRXhwKSB7XHJcbiAgICAgICAgaWYgKGxlbiA+IDEpIHtcclxuICAgICAgICAgIGlmIChiYXNlT3V0ID09IDE2IHx8IGJhc2VPdXQgPT0gOCkge1xyXG4gICAgICAgICAgICBpID0gYmFzZU91dCA9PSAxNiA/IDQgOiAzO1xyXG4gICAgICAgICAgICBmb3IgKC0tbGVuOyBsZW4gJSBpOyBsZW4rKykgc3RyICs9ICcwJztcclxuICAgICAgICAgICAgeGQgPSBjb252ZXJ0QmFzZShzdHIsIGJhc2UsIGJhc2VPdXQpO1xyXG4gICAgICAgICAgICBmb3IgKGxlbiA9IHhkLmxlbmd0aDsgIXhkW2xlbiAtIDFdOyAtLWxlbik7XHJcblxyXG4gICAgICAgICAgICAvLyB4ZFswXSB3aWxsIGFsd2F5cyBiZSBiZSAxXHJcbiAgICAgICAgICAgIGZvciAoaSA9IDEsIHN0ciA9ICcxLic7IGkgPCBsZW47IGkrKykgc3RyICs9IE5VTUVSQUxTLmNoYXJBdCh4ZFtpXSk7XHJcbiAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICBzdHIgPSBzdHIuY2hhckF0KDApICsgJy4nICsgc3RyLnNsaWNlKDEpO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgc3RyID0gIHN0ciArIChlIDwgMCA/ICdwJyA6ICdwKycpICsgZTtcclxuICAgICAgfSBlbHNlIGlmIChlIDwgMCkge1xyXG4gICAgICAgIGZvciAoOyArK2U7KSBzdHIgPSAnMCcgKyBzdHI7XHJcbiAgICAgICAgc3RyID0gJzAuJyArIHN0cjtcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICBpZiAoKytlID4gbGVuKSBmb3IgKGUgLT0gbGVuOyBlLS0gOykgc3RyICs9ICcwJztcclxuICAgICAgICBlbHNlIGlmIChlIDwgbGVuKSBzdHIgPSBzdHIuc2xpY2UoMCwgZSkgKyAnLicgKyBzdHIuc2xpY2UoZSk7XHJcbiAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBzdHIgPSAoYmFzZU91dCA9PSAxNiA/ICcweCcgOiBiYXNlT3V0ID09IDIgPyAnMGInIDogYmFzZU91dCA9PSA4ID8gJzBvJyA6ICcnKSArIHN0cjtcclxuICB9XHJcblxyXG4gIHJldHVybiB4LnMgPCAwID8gJy0nICsgc3RyIDogc3RyO1xyXG59XHJcblxyXG5cclxuLy8gRG9lcyBub3Qgc3RyaXAgdHJhaWxpbmcgemVyb3MuXHJcbmZ1bmN0aW9uIHRydW5jYXRlKGFyciwgbGVuKSB7XHJcbiAgaWYgKGFyci5sZW5ndGggPiBsZW4pIHtcclxuICAgIGFyci5sZW5ndGggPSBsZW47XHJcbiAgICByZXR1cm4gdHJ1ZTtcclxuICB9XHJcbn1cclxuXHJcblxyXG4vLyBEZWNpbWFsIG1ldGhvZHNcclxuXHJcblxyXG4vKlxyXG4gKiAgYWJzXHJcbiAqICBhY29zXHJcbiAqICBhY29zaFxyXG4gKiAgYWRkXHJcbiAqICBhc2luXHJcbiAqICBhc2luaFxyXG4gKiAgYXRhblxyXG4gKiAgYXRhbmhcclxuICogIGF0YW4yXHJcbiAqICBjYnJ0XHJcbiAqICBjZWlsXHJcbiAqICBjbGFtcFxyXG4gKiAgY2xvbmVcclxuICogIGNvbmZpZ1xyXG4gKiAgY29zXHJcbiAqICBjb3NoXHJcbiAqICBkaXZcclxuICogIGV4cFxyXG4gKiAgZmxvb3JcclxuICogIGh5cG90XHJcbiAqICBsblxyXG4gKiAgbG9nXHJcbiAqICBsb2cyXHJcbiAqICBsb2cxMFxyXG4gKiAgbWF4XHJcbiAqICBtaW5cclxuICogIG1vZFxyXG4gKiAgbXVsXHJcbiAqICBwb3dcclxuICogIHJhbmRvbVxyXG4gKiAgcm91bmRcclxuICogIHNldFxyXG4gKiAgc2lnblxyXG4gKiAgc2luXHJcbiAqICBzaW5oXHJcbiAqICBzcXJ0XHJcbiAqICBzdWJcclxuICogIHN1bVxyXG4gKiAgdGFuXHJcbiAqICB0YW5oXHJcbiAqICB0cnVuY1xyXG4gKi9cclxuXHJcblxyXG4vKlxyXG4gKiBSZXR1cm4gYSBuZXcgRGVjaW1hbCB3aG9zZSB2YWx1ZSBpcyB0aGUgYWJzb2x1dGUgdmFsdWUgb2YgYHhgLlxyXG4gKlxyXG4gKiB4IHtudW1iZXJ8c3RyaW5nfERlY2ltYWx9XHJcbiAqXHJcbiAqL1xyXG5mdW5jdGlvbiBhYnMoeCkge1xyXG4gIHJldHVybiBuZXcgdGhpcyh4KS5hYnMoKTtcclxufVxyXG5cclxuXHJcbi8qXHJcbiAqIFJldHVybiBhIG5ldyBEZWNpbWFsIHdob3NlIHZhbHVlIGlzIHRoZSBhcmNjb3NpbmUgaW4gcmFkaWFucyBvZiBgeGAuXHJcbiAqXHJcbiAqIHgge251bWJlcnxzdHJpbmd8RGVjaW1hbH1cclxuICpcclxuICovXHJcbmZ1bmN0aW9uIGFjb3MoeCkge1xyXG4gIHJldHVybiBuZXcgdGhpcyh4KS5hY29zKCk7XHJcbn1cclxuXHJcblxyXG4vKlxyXG4gKiBSZXR1cm4gYSBuZXcgRGVjaW1hbCB3aG9zZSB2YWx1ZSBpcyB0aGUgaW52ZXJzZSBvZiB0aGUgaHlwZXJib2xpYyBjb3NpbmUgb2YgYHhgLCByb3VuZGVkIHRvXHJcbiAqIGBwcmVjaXNpb25gIHNpZ25pZmljYW50IGRpZ2l0cyB1c2luZyByb3VuZGluZyBtb2RlIGByb3VuZGluZ2AuXHJcbiAqXHJcbiAqIHgge251bWJlcnxzdHJpbmd8RGVjaW1hbH0gQSB2YWx1ZSBpbiByYWRpYW5zLlxyXG4gKlxyXG4gKi9cclxuZnVuY3Rpb24gYWNvc2goeCkge1xyXG4gIHJldHVybiBuZXcgdGhpcyh4KS5hY29zaCgpO1xyXG59XHJcblxyXG5cclxuLypcclxuICogUmV0dXJuIGEgbmV3IERlY2ltYWwgd2hvc2UgdmFsdWUgaXMgdGhlIHN1bSBvZiBgeGAgYW5kIGB5YCwgcm91bmRlZCB0byBgcHJlY2lzaW9uYCBzaWduaWZpY2FudFxyXG4gKiBkaWdpdHMgdXNpbmcgcm91bmRpbmcgbW9kZSBgcm91bmRpbmdgLlxyXG4gKlxyXG4gKiB4IHtudW1iZXJ8c3RyaW5nfERlY2ltYWx9XHJcbiAqIHkge251bWJlcnxzdHJpbmd8RGVjaW1hbH1cclxuICpcclxuICovXHJcbmZ1bmN0aW9uIGFkZCh4LCB5KSB7XHJcbiAgcmV0dXJuIG5ldyB0aGlzKHgpLnBsdXMoeSk7XHJcbn1cclxuXHJcblxyXG4vKlxyXG4gKiBSZXR1cm4gYSBuZXcgRGVjaW1hbCB3aG9zZSB2YWx1ZSBpcyB0aGUgYXJjc2luZSBpbiByYWRpYW5zIG9mIGB4YCwgcm91bmRlZCB0byBgcHJlY2lzaW9uYFxyXG4gKiBzaWduaWZpY2FudCBkaWdpdHMgdXNpbmcgcm91bmRpbmcgbW9kZSBgcm91bmRpbmdgLlxyXG4gKlxyXG4gKiB4IHtudW1iZXJ8c3RyaW5nfERlY2ltYWx9XHJcbiAqXHJcbiAqL1xyXG5mdW5jdGlvbiBhc2luKHgpIHtcclxuICByZXR1cm4gbmV3IHRoaXMoeCkuYXNpbigpO1xyXG59XHJcblxyXG5cclxuLypcclxuICogUmV0dXJuIGEgbmV3IERlY2ltYWwgd2hvc2UgdmFsdWUgaXMgdGhlIGludmVyc2Ugb2YgdGhlIGh5cGVyYm9saWMgc2luZSBvZiBgeGAsIHJvdW5kZWQgdG9cclxuICogYHByZWNpc2lvbmAgc2lnbmlmaWNhbnQgZGlnaXRzIHVzaW5nIHJvdW5kaW5nIG1vZGUgYHJvdW5kaW5nYC5cclxuICpcclxuICogeCB7bnVtYmVyfHN0cmluZ3xEZWNpbWFsfSBBIHZhbHVlIGluIHJhZGlhbnMuXHJcbiAqXHJcbiAqL1xyXG5mdW5jdGlvbiBhc2luaCh4KSB7XHJcbiAgcmV0dXJuIG5ldyB0aGlzKHgpLmFzaW5oKCk7XHJcbn1cclxuXHJcblxyXG4vKlxyXG4gKiBSZXR1cm4gYSBuZXcgRGVjaW1hbCB3aG9zZSB2YWx1ZSBpcyB0aGUgYXJjdGFuZ2VudCBpbiByYWRpYW5zIG9mIGB4YCwgcm91bmRlZCB0byBgcHJlY2lzaW9uYFxyXG4gKiBzaWduaWZpY2FudCBkaWdpdHMgdXNpbmcgcm91bmRpbmcgbW9kZSBgcm91bmRpbmdgLlxyXG4gKlxyXG4gKiB4IHtudW1iZXJ8c3RyaW5nfERlY2ltYWx9XHJcbiAqXHJcbiAqL1xyXG5mdW5jdGlvbiBhdGFuKHgpIHtcclxuICByZXR1cm4gbmV3IHRoaXMoeCkuYXRhbigpO1xyXG59XHJcblxyXG5cclxuLypcclxuICogUmV0dXJuIGEgbmV3IERlY2ltYWwgd2hvc2UgdmFsdWUgaXMgdGhlIGludmVyc2Ugb2YgdGhlIGh5cGVyYm9saWMgdGFuZ2VudCBvZiBgeGAsIHJvdW5kZWQgdG9cclxuICogYHByZWNpc2lvbmAgc2lnbmlmaWNhbnQgZGlnaXRzIHVzaW5nIHJvdW5kaW5nIG1vZGUgYHJvdW5kaW5nYC5cclxuICpcclxuICogeCB7bnVtYmVyfHN0cmluZ3xEZWNpbWFsfSBBIHZhbHVlIGluIHJhZGlhbnMuXHJcbiAqXHJcbiAqL1xyXG5mdW5jdGlvbiBhdGFuaCh4KSB7XHJcbiAgcmV0dXJuIG5ldyB0aGlzKHgpLmF0YW5oKCk7XHJcbn1cclxuXHJcblxyXG4vKlxyXG4gKiBSZXR1cm4gYSBuZXcgRGVjaW1hbCB3aG9zZSB2YWx1ZSBpcyB0aGUgYXJjdGFuZ2VudCBpbiByYWRpYW5zIG9mIGB5L3hgIGluIHRoZSByYW5nZSAtcGkgdG8gcGlcclxuICogKGluY2x1c2l2ZSksIHJvdW5kZWQgdG8gYHByZWNpc2lvbmAgc2lnbmlmaWNhbnQgZGlnaXRzIHVzaW5nIHJvdW5kaW5nIG1vZGUgYHJvdW5kaW5nYC5cclxuICpcclxuICogRG9tYWluOiBbLUluZmluaXR5LCBJbmZpbml0eV1cclxuICogUmFuZ2U6IFstcGksIHBpXVxyXG4gKlxyXG4gKiB5IHtudW1iZXJ8c3RyaW5nfERlY2ltYWx9IFRoZSB5LWNvb3JkaW5hdGUuXHJcbiAqIHgge251bWJlcnxzdHJpbmd8RGVjaW1hbH0gVGhlIHgtY29vcmRpbmF0ZS5cclxuICpcclxuICogYXRhbjIoXHUwMEIxMCwgLTApICAgICAgICAgICAgICAgPSBcdTAwQjFwaVxyXG4gKiBhdGFuMihcdTAwQjEwLCArMCkgICAgICAgICAgICAgICA9IFx1MDBCMTBcclxuICogYXRhbjIoXHUwMEIxMCwgLXgpICAgICAgICAgICAgICAgPSBcdTAwQjFwaSBmb3IgeCA+IDBcclxuICogYXRhbjIoXHUwMEIxMCwgeCkgICAgICAgICAgICAgICAgPSBcdTAwQjEwIGZvciB4ID4gMFxyXG4gKiBhdGFuMigteSwgXHUwMEIxMCkgICAgICAgICAgICAgICA9IC1waS8yIGZvciB5ID4gMFxyXG4gKiBhdGFuMih5LCBcdTAwQjEwKSAgICAgICAgICAgICAgICA9IHBpLzIgZm9yIHkgPiAwXHJcbiAqIGF0YW4yKFx1MDBCMXksIC1JbmZpbml0eSkgICAgICAgID0gXHUwMEIxcGkgZm9yIGZpbml0ZSB5ID4gMFxyXG4gKiBhdGFuMihcdTAwQjF5LCArSW5maW5pdHkpICAgICAgICA9IFx1MDBCMTAgZm9yIGZpbml0ZSB5ID4gMFxyXG4gKiBhdGFuMihcdTAwQjFJbmZpbml0eSwgeCkgICAgICAgICA9IFx1MDBCMXBpLzIgZm9yIGZpbml0ZSB4XHJcbiAqIGF0YW4yKFx1MDBCMUluZmluaXR5LCAtSW5maW5pdHkpID0gXHUwMEIxMypwaS80XHJcbiAqIGF0YW4yKFx1MDBCMUluZmluaXR5LCArSW5maW5pdHkpID0gXHUwMEIxcGkvNFxyXG4gKiBhdGFuMihOYU4sIHgpID0gTmFOXHJcbiAqIGF0YW4yKHksIE5hTikgPSBOYU5cclxuICpcclxuICovXHJcbmZ1bmN0aW9uIGF0YW4yKHksIHgpIHtcclxuICB5ID0gbmV3IHRoaXMoeSk7XHJcbiAgeCA9IG5ldyB0aGlzKHgpO1xyXG4gIHZhciByLFxyXG4gICAgcHIgPSB0aGlzLnByZWNpc2lvbixcclxuICAgIHJtID0gdGhpcy5yb3VuZGluZyxcclxuICAgIHdwciA9IHByICsgNDtcclxuXHJcbiAgLy8gRWl0aGVyIE5hTlxyXG4gIGlmICgheS5zIHx8ICF4LnMpIHtcclxuICAgIHIgPSBuZXcgdGhpcyhOYU4pO1xyXG5cclxuICAvLyBCb3RoIFx1MDBCMUluZmluaXR5XHJcbiAgfSBlbHNlIGlmICgheS5kICYmICF4LmQpIHtcclxuICAgIHIgPSBnZXRQaSh0aGlzLCB3cHIsIDEpLnRpbWVzKHgucyA+IDAgPyAwLjI1IDogMC43NSk7XHJcbiAgICByLnMgPSB5LnM7XHJcblxyXG4gIC8vIHggaXMgXHUwMEIxSW5maW5pdHkgb3IgeSBpcyBcdTAwQjEwXHJcbiAgfSBlbHNlIGlmICgheC5kIHx8IHkuaXNaZXJvKCkpIHtcclxuICAgIHIgPSB4LnMgPCAwID8gZ2V0UGkodGhpcywgcHIsIHJtKSA6IG5ldyB0aGlzKDApO1xyXG4gICAgci5zID0geS5zO1xyXG5cclxuICAvLyB5IGlzIFx1MDBCMUluZmluaXR5IG9yIHggaXMgXHUwMEIxMFxyXG4gIH0gZWxzZSBpZiAoIXkuZCB8fCB4LmlzWmVybygpKSB7XHJcbiAgICByID0gZ2V0UGkodGhpcywgd3ByLCAxKS50aW1lcygwLjUpO1xyXG4gICAgci5zID0geS5zO1xyXG5cclxuICAvLyBCb3RoIG5vbi16ZXJvIGFuZCBmaW5pdGVcclxuICB9IGVsc2UgaWYgKHgucyA8IDApIHtcclxuICAgIHRoaXMucHJlY2lzaW9uID0gd3ByO1xyXG4gICAgdGhpcy5yb3VuZGluZyA9IDE7XHJcbiAgICByID0gdGhpcy5hdGFuKGRpdmlkZSh5LCB4LCB3cHIsIDEpKTtcclxuICAgIHggPSBnZXRQaSh0aGlzLCB3cHIsIDEpO1xyXG4gICAgdGhpcy5wcmVjaXNpb24gPSBwcjtcclxuICAgIHRoaXMucm91bmRpbmcgPSBybTtcclxuICAgIHIgPSB5LnMgPCAwID8gci5taW51cyh4KSA6IHIucGx1cyh4KTtcclxuICB9IGVsc2Uge1xyXG4gICAgciA9IHRoaXMuYXRhbihkaXZpZGUoeSwgeCwgd3ByLCAxKSk7XHJcbiAgfVxyXG5cclxuICByZXR1cm4gcjtcclxufVxyXG5cclxuXHJcbi8qXHJcbiAqIFJldHVybiBhIG5ldyBEZWNpbWFsIHdob3NlIHZhbHVlIGlzIHRoZSBjdWJlIHJvb3Qgb2YgYHhgLCByb3VuZGVkIHRvIGBwcmVjaXNpb25gIHNpZ25pZmljYW50XHJcbiAqIGRpZ2l0cyB1c2luZyByb3VuZGluZyBtb2RlIGByb3VuZGluZ2AuXHJcbiAqXHJcbiAqIHgge251bWJlcnxzdHJpbmd8RGVjaW1hbH1cclxuICpcclxuICovXHJcbmZ1bmN0aW9uIGNicnQoeCkge1xyXG4gIHJldHVybiBuZXcgdGhpcyh4KS5jYnJ0KCk7XHJcbn1cclxuXHJcblxyXG4vKlxyXG4gKiBSZXR1cm4gYSBuZXcgRGVjaW1hbCB3aG9zZSB2YWx1ZSBpcyBgeGAgcm91bmRlZCB0byBhbiBpbnRlZ2VyIHVzaW5nIGBST1VORF9DRUlMYC5cclxuICpcclxuICogeCB7bnVtYmVyfHN0cmluZ3xEZWNpbWFsfVxyXG4gKlxyXG4gKi9cclxuZnVuY3Rpb24gY2VpbCh4KSB7XHJcbiAgcmV0dXJuIGZpbmFsaXNlKHggPSBuZXcgdGhpcyh4KSwgeC5lICsgMSwgMik7XHJcbn1cclxuXHJcblxyXG4vKlxyXG4gKiBSZXR1cm4gYSBuZXcgRGVjaW1hbCB3aG9zZSB2YWx1ZSBpcyBgeGAgY2xhbXBlZCB0byB0aGUgcmFuZ2UgZGVsaW5lYXRlZCBieSBgbWluYCBhbmQgYG1heGAuXHJcbiAqXHJcbiAqIHgge251bWJlcnxzdHJpbmd8RGVjaW1hbH1cclxuICogbWluIHtudW1iZXJ8c3RyaW5nfERlY2ltYWx9XHJcbiAqIG1heCB7bnVtYmVyfHN0cmluZ3xEZWNpbWFsfVxyXG4gKlxyXG4gKi9cclxuZnVuY3Rpb24gY2xhbXAoeCwgbWluLCBtYXgpIHtcclxuICByZXR1cm4gbmV3IHRoaXMoeCkuY2xhbXAobWluLCBtYXgpO1xyXG59XHJcblxyXG5cclxuLypcclxuICogQ29uZmlndXJlIGdsb2JhbCBzZXR0aW5ncyBmb3IgYSBEZWNpbWFsIGNvbnN0cnVjdG9yLlxyXG4gKlxyXG4gKiBgb2JqYCBpcyBhbiBvYmplY3Qgd2l0aCBvbmUgb3IgbW9yZSBvZiB0aGUgZm9sbG93aW5nIHByb3BlcnRpZXMsXHJcbiAqXHJcbiAqICAgcHJlY2lzaW9uICB7bnVtYmVyfVxyXG4gKiAgIHJvdW5kaW5nICAge251bWJlcn1cclxuICogICB0b0V4cE5lZyAgIHtudW1iZXJ9XHJcbiAqICAgdG9FeHBQb3MgICB7bnVtYmVyfVxyXG4gKiAgIG1heEUgICAgICAge251bWJlcn1cclxuICogICBtaW5FICAgICAgIHtudW1iZXJ9XHJcbiAqICAgbW9kdWxvICAgICB7bnVtYmVyfVxyXG4gKiAgIGNyeXB0byAgICAge2Jvb2xlYW58bnVtYmVyfVxyXG4gKiAgIGRlZmF1bHRzICAge3RydWV9XHJcbiAqXHJcbiAqIEUuZy4gRGVjaW1hbC5jb25maWcoeyBwcmVjaXNpb246IDIwLCByb3VuZGluZzogNCB9KVxyXG4gKlxyXG4gKi9cclxuZnVuY3Rpb24gY29uZmlnKG9iaikge1xyXG4gIGlmICghb2JqIHx8IHR5cGVvZiBvYmogIT09ICdvYmplY3QnKSB0aHJvdyBFcnJvcihkZWNpbWFsRXJyb3IgKyAnT2JqZWN0IGV4cGVjdGVkJyk7XHJcbiAgdmFyIGksIHAsIHYsXHJcbiAgICB1c2VEZWZhdWx0cyA9IG9iai5kZWZhdWx0cyA9PT0gdHJ1ZSxcclxuICAgIHBzID0gW1xyXG4gICAgICAncHJlY2lzaW9uJywgMSwgTUFYX0RJR0lUUyxcclxuICAgICAgJ3JvdW5kaW5nJywgMCwgOCxcclxuICAgICAgJ3RvRXhwTmVnJywgLUVYUF9MSU1JVCwgMCxcclxuICAgICAgJ3RvRXhwUG9zJywgMCwgRVhQX0xJTUlULFxyXG4gICAgICAnbWF4RScsIDAsIEVYUF9MSU1JVCxcclxuICAgICAgJ21pbkUnLCAtRVhQX0xJTUlULCAwLFxyXG4gICAgICAnbW9kdWxvJywgMCwgOVxyXG4gICAgXTtcclxuXHJcbiAgZm9yIChpID0gMDsgaSA8IHBzLmxlbmd0aDsgaSArPSAzKSB7XHJcbiAgICBpZiAocCA9IHBzW2ldLCB1c2VEZWZhdWx0cykgdGhpc1twXSA9IERFRkFVTFRTW3BdO1xyXG4gICAgaWYgKCh2ID0gb2JqW3BdKSAhPT0gdm9pZCAwKSB7XHJcbiAgICAgIGlmIChtYXRoZmxvb3IodikgPT09IHYgJiYgdiA+PSBwc1tpICsgMV0gJiYgdiA8PSBwc1tpICsgMl0pIHRoaXNbcF0gPSB2O1xyXG4gICAgICBlbHNlIHRocm93IEVycm9yKGludmFsaWRBcmd1bWVudCArIHAgKyAnOiAnICsgdik7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBpZiAocCA9ICdjcnlwdG8nLCB1c2VEZWZhdWx0cykgdGhpc1twXSA9IERFRkFVTFRTW3BdO1xyXG4gIGlmICgodiA9IG9ialtwXSkgIT09IHZvaWQgMCkge1xyXG4gICAgaWYgKHYgPT09IHRydWUgfHwgdiA9PT0gZmFsc2UgfHwgdiA9PT0gMCB8fCB2ID09PSAxKSB7XHJcbiAgICAgIGlmICh2KSB7XHJcbiAgICAgICAgaWYgKHR5cGVvZiBjcnlwdG8gIT0gJ3VuZGVmaW5lZCcgJiYgY3J5cHRvICYmXHJcbiAgICAgICAgICAoY3J5cHRvLmdldFJhbmRvbVZhbHVlcyB8fCBjcnlwdG8ucmFuZG9tQnl0ZXMpKSB7XHJcbiAgICAgICAgICB0aGlzW3BdID0gdHJ1ZTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgdGhyb3cgRXJyb3IoY3J5cHRvVW5hdmFpbGFibGUpO1xyXG4gICAgICAgIH1cclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICB0aGlzW3BdID0gZmFsc2U7XHJcbiAgICAgIH1cclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIHRocm93IEVycm9yKGludmFsaWRBcmd1bWVudCArIHAgKyAnOiAnICsgdik7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICByZXR1cm4gdGhpcztcclxufVxyXG5cclxuXHJcbi8qXHJcbiAqIFJldHVybiBhIG5ldyBEZWNpbWFsIHdob3NlIHZhbHVlIGlzIHRoZSBjb3NpbmUgb2YgYHhgLCByb3VuZGVkIHRvIGBwcmVjaXNpb25gIHNpZ25pZmljYW50XHJcbiAqIGRpZ2l0cyB1c2luZyByb3VuZGluZyBtb2RlIGByb3VuZGluZ2AuXHJcbiAqXHJcbiAqIHgge251bWJlcnxzdHJpbmd8RGVjaW1hbH0gQSB2YWx1ZSBpbiByYWRpYW5zLlxyXG4gKlxyXG4gKi9cclxuZnVuY3Rpb24gY29zKHgpIHtcclxuICByZXR1cm4gbmV3IHRoaXMoeCkuY29zKCk7XHJcbn1cclxuXHJcblxyXG4vKlxyXG4gKiBSZXR1cm4gYSBuZXcgRGVjaW1hbCB3aG9zZSB2YWx1ZSBpcyB0aGUgaHlwZXJib2xpYyBjb3NpbmUgb2YgYHhgLCByb3VuZGVkIHRvIHByZWNpc2lvblxyXG4gKiBzaWduaWZpY2FudCBkaWdpdHMgdXNpbmcgcm91bmRpbmcgbW9kZSBgcm91bmRpbmdgLlxyXG4gKlxyXG4gKiB4IHtudW1iZXJ8c3RyaW5nfERlY2ltYWx9IEEgdmFsdWUgaW4gcmFkaWFucy5cclxuICpcclxuICovXHJcbmZ1bmN0aW9uIGNvc2goeCkge1xyXG4gIHJldHVybiBuZXcgdGhpcyh4KS5jb3NoKCk7XHJcbn1cclxuXHJcblxyXG4vKlxyXG4gKiBDcmVhdGUgYW5kIHJldHVybiBhIERlY2ltYWwgY29uc3RydWN0b3Igd2l0aCB0aGUgc2FtZSBjb25maWd1cmF0aW9uIHByb3BlcnRpZXMgYXMgdGhpcyBEZWNpbWFsXHJcbiAqIGNvbnN0cnVjdG9yLlxyXG4gKlxyXG4gKi9cclxuZnVuY3Rpb24gY2xvbmUob2JqKSB7XHJcbiAgdmFyIGksIHAsIHBzO1xyXG5cclxuICAvKlxyXG4gICAqIFRoZSBEZWNpbWFsIGNvbnN0cnVjdG9yIGFuZCBleHBvcnRlZCBmdW5jdGlvbi5cclxuICAgKiBSZXR1cm4gYSBuZXcgRGVjaW1hbCBpbnN0YW5jZS5cclxuICAgKlxyXG4gICAqIHYge251bWJlcnxzdHJpbmd8RGVjaW1hbH0gQSBudW1lcmljIHZhbHVlLlxyXG4gICAqXHJcbiAgICovXHJcbiAgZnVuY3Rpb24gRGVjaW1hbCh2KSB7XHJcbiAgICB2YXIgZSwgaSwgdCxcclxuICAgICAgeCA9IHRoaXM7XHJcblxyXG4gICAgLy8gRGVjaW1hbCBjYWxsZWQgd2l0aG91dCBuZXcuXHJcbiAgICBpZiAoISh4IGluc3RhbmNlb2YgRGVjaW1hbCkpIHJldHVybiBuZXcgRGVjaW1hbCh2KTtcclxuXHJcbiAgICAvLyBSZXRhaW4gYSByZWZlcmVuY2UgdG8gdGhpcyBEZWNpbWFsIGNvbnN0cnVjdG9yLCBhbmQgc2hhZG93IERlY2ltYWwucHJvdG90eXBlLmNvbnN0cnVjdG9yXHJcbiAgICAvLyB3aGljaCBwb2ludHMgdG8gT2JqZWN0LlxyXG4gICAgeC5jb25zdHJ1Y3RvciA9IERlY2ltYWw7XHJcblxyXG4gICAgLy8gRHVwbGljYXRlLlxyXG4gICAgaWYgKGlzRGVjaW1hbEluc3RhbmNlKHYpKSB7XHJcbiAgICAgIHgucyA9IHYucztcclxuXHJcbiAgICAgIGlmIChleHRlcm5hbCkge1xyXG4gICAgICAgIGlmICghdi5kIHx8IHYuZSA+IERlY2ltYWwubWF4RSkge1xyXG5cclxuICAgICAgICAgIC8vIEluZmluaXR5LlxyXG4gICAgICAgICAgeC5lID0gTmFOO1xyXG4gICAgICAgICAgeC5kID0gbnVsbDtcclxuICAgICAgICB9IGVsc2UgaWYgKHYuZSA8IERlY2ltYWwubWluRSkge1xyXG5cclxuICAgICAgICAgIC8vIFplcm8uXHJcbiAgICAgICAgICB4LmUgPSAwO1xyXG4gICAgICAgICAgeC5kID0gWzBdO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICB4LmUgPSB2LmU7XHJcbiAgICAgICAgICB4LmQgPSB2LmQuc2xpY2UoKTtcclxuICAgICAgICB9XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgeC5lID0gdi5lO1xyXG4gICAgICAgIHguZCA9IHYuZCA/IHYuZC5zbGljZSgpIDogdi5kO1xyXG4gICAgICB9XHJcblxyXG4gICAgICByZXR1cm47XHJcbiAgICB9XHJcblxyXG4gICAgdCA9IHR5cGVvZiB2O1xyXG5cclxuICAgIGlmICh0ID09PSAnbnVtYmVyJykge1xyXG4gICAgICBpZiAodiA9PT0gMCkge1xyXG4gICAgICAgIHgucyA9IDEgLyB2IDwgMCA/IC0xIDogMTtcclxuICAgICAgICB4LmUgPSAwO1xyXG4gICAgICAgIHguZCA9IFswXTtcclxuICAgICAgICByZXR1cm47XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGlmICh2IDwgMCkge1xyXG4gICAgICAgIHYgPSAtdjtcclxuICAgICAgICB4LnMgPSAtMTtcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICB4LnMgPSAxO1xyXG4gICAgICB9XHJcblxyXG4gICAgICAvLyBGYXN0IHBhdGggZm9yIHNtYWxsIGludGVnZXJzLlxyXG4gICAgICBpZiAodiA9PT0gfn52ICYmIHYgPCAxZTcpIHtcclxuICAgICAgICBmb3IgKGUgPSAwLCBpID0gdjsgaSA+PSAxMDsgaSAvPSAxMCkgZSsrO1xyXG5cclxuICAgICAgICBpZiAoZXh0ZXJuYWwpIHtcclxuICAgICAgICAgIGlmIChlID4gRGVjaW1hbC5tYXhFKSB7XHJcbiAgICAgICAgICAgIHguZSA9IE5hTjtcclxuICAgICAgICAgICAgeC5kID0gbnVsbDtcclxuICAgICAgICAgIH0gZWxzZSBpZiAoZSA8IERlY2ltYWwubWluRSkge1xyXG4gICAgICAgICAgICB4LmUgPSAwO1xyXG4gICAgICAgICAgICB4LmQgPSBbMF07XHJcbiAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICB4LmUgPSBlO1xyXG4gICAgICAgICAgICB4LmQgPSBbdl07XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgIHguZSA9IGU7XHJcbiAgICAgICAgICB4LmQgPSBbdl07XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm47XHJcblxyXG4gICAgICAvLyBJbmZpbml0eSwgTmFOLlxyXG4gICAgICB9IGVsc2UgaWYgKHYgKiAwICE9PSAwKSB7XHJcbiAgICAgICAgaWYgKCF2KSB4LnMgPSBOYU47XHJcbiAgICAgICAgeC5lID0gTmFOO1xyXG4gICAgICAgIHguZCA9IG51bGw7XHJcbiAgICAgICAgcmV0dXJuO1xyXG4gICAgICB9XHJcblxyXG4gICAgICByZXR1cm4gcGFyc2VEZWNpbWFsKHgsIHYudG9TdHJpbmcoKSk7XHJcblxyXG4gICAgfSBlbHNlIGlmICh0ICE9PSAnc3RyaW5nJykge1xyXG4gICAgICB0aHJvdyBFcnJvcihpbnZhbGlkQXJndW1lbnQgKyB2KTtcclxuICAgIH1cclxuXHJcbiAgICAvLyBNaW51cyBzaWduP1xyXG4gICAgaWYgKChpID0gdi5jaGFyQ29kZUF0KDApKSA9PT0gNDUpIHtcclxuICAgICAgdiA9IHYuc2xpY2UoMSk7XHJcbiAgICAgIHgucyA9IC0xO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgLy8gUGx1cyBzaWduP1xyXG4gICAgICBpZiAoaSA9PT0gNDMpIHYgPSB2LnNsaWNlKDEpO1xyXG4gICAgICB4LnMgPSAxO1xyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiBpc0RlY2ltYWwudGVzdCh2KSA/IHBhcnNlRGVjaW1hbCh4LCB2KSA6IHBhcnNlT3RoZXIoeCwgdik7XHJcbiAgfVxyXG5cclxuICBEZWNpbWFsLnByb3RvdHlwZSA9IFA7XHJcblxyXG4gIERlY2ltYWwuUk9VTkRfVVAgPSAwO1xyXG4gIERlY2ltYWwuUk9VTkRfRE9XTiA9IDE7XHJcbiAgRGVjaW1hbC5ST1VORF9DRUlMID0gMjtcclxuICBEZWNpbWFsLlJPVU5EX0ZMT09SID0gMztcclxuICBEZWNpbWFsLlJPVU5EX0hBTEZfVVAgPSA0O1xyXG4gIERlY2ltYWwuUk9VTkRfSEFMRl9ET1dOID0gNTtcclxuICBEZWNpbWFsLlJPVU5EX0hBTEZfRVZFTiA9IDY7XHJcbiAgRGVjaW1hbC5ST1VORF9IQUxGX0NFSUwgPSA3O1xyXG4gIERlY2ltYWwuUk9VTkRfSEFMRl9GTE9PUiA9IDg7XHJcbiAgRGVjaW1hbC5FVUNMSUQgPSA5O1xyXG5cclxuICBEZWNpbWFsLmNvbmZpZyA9IERlY2ltYWwuc2V0ID0gY29uZmlnO1xyXG4gIERlY2ltYWwuY2xvbmUgPSBjbG9uZTtcclxuICBEZWNpbWFsLmlzRGVjaW1hbCA9IGlzRGVjaW1hbEluc3RhbmNlO1xyXG5cclxuICBEZWNpbWFsLmFicyA9IGFicztcclxuICBEZWNpbWFsLmFjb3MgPSBhY29zO1xyXG4gIERlY2ltYWwuYWNvc2ggPSBhY29zaDsgICAgICAgIC8vIEVTNlxyXG4gIERlY2ltYWwuYWRkID0gYWRkO1xyXG4gIERlY2ltYWwuYXNpbiA9IGFzaW47XHJcbiAgRGVjaW1hbC5hc2luaCA9IGFzaW5oOyAgICAgICAgLy8gRVM2XHJcbiAgRGVjaW1hbC5hdGFuID0gYXRhbjtcclxuICBEZWNpbWFsLmF0YW5oID0gYXRhbmg7ICAgICAgICAvLyBFUzZcclxuICBEZWNpbWFsLmF0YW4yID0gYXRhbjI7XHJcbiAgRGVjaW1hbC5jYnJ0ID0gY2JydDsgICAgICAgICAgLy8gRVM2XHJcbiAgRGVjaW1hbC5jZWlsID0gY2VpbDtcclxuICBEZWNpbWFsLmNsYW1wID0gY2xhbXA7XHJcbiAgRGVjaW1hbC5jb3MgPSBjb3M7XHJcbiAgRGVjaW1hbC5jb3NoID0gY29zaDsgICAgICAgICAgLy8gRVM2XHJcbiAgRGVjaW1hbC5kaXYgPSBkaXY7XHJcbiAgRGVjaW1hbC5leHAgPSBleHA7XHJcbiAgRGVjaW1hbC5mbG9vciA9IGZsb29yO1xyXG4gIERlY2ltYWwuaHlwb3QgPSBoeXBvdDsgICAgICAgIC8vIEVTNlxyXG4gIERlY2ltYWwubG4gPSBsbjtcclxuICBEZWNpbWFsLmxvZyA9IGxvZztcclxuICBEZWNpbWFsLmxvZzEwID0gbG9nMTA7ICAgICAgICAvLyBFUzZcclxuICBEZWNpbWFsLmxvZzIgPSBsb2cyOyAgICAgICAgICAvLyBFUzZcclxuICBEZWNpbWFsLm1heCA9IG1heDtcclxuICBEZWNpbWFsLm1pbiA9IG1pbjtcclxuICBEZWNpbWFsLm1vZCA9IG1vZDtcclxuICBEZWNpbWFsLm11bCA9IG11bDtcclxuICBEZWNpbWFsLnBvdyA9IHBvdztcclxuICBEZWNpbWFsLnJhbmRvbSA9IHJhbmRvbTtcclxuICBEZWNpbWFsLnJvdW5kID0gcm91bmQ7XHJcbiAgRGVjaW1hbC5zaWduID0gc2lnbjsgICAgICAgICAgLy8gRVM2XHJcbiAgRGVjaW1hbC5zaW4gPSBzaW47XHJcbiAgRGVjaW1hbC5zaW5oID0gc2luaDsgICAgICAgICAgLy8gRVM2XHJcbiAgRGVjaW1hbC5zcXJ0ID0gc3FydDtcclxuICBEZWNpbWFsLnN1YiA9IHN1YjtcclxuICBEZWNpbWFsLnN1bSA9IHN1bTtcclxuICBEZWNpbWFsLnRhbiA9IHRhbjtcclxuICBEZWNpbWFsLnRhbmggPSB0YW5oOyAgICAgICAgICAvLyBFUzZcclxuICBEZWNpbWFsLnRydW5jID0gdHJ1bmM7ICAgICAgICAvLyBFUzZcclxuXHJcbiAgaWYgKG9iaiA9PT0gdm9pZCAwKSBvYmogPSB7fTtcclxuICBpZiAob2JqKSB7XHJcbiAgICBpZiAob2JqLmRlZmF1bHRzICE9PSB0cnVlKSB7XHJcbiAgICAgIHBzID0gWydwcmVjaXNpb24nLCAncm91bmRpbmcnLCAndG9FeHBOZWcnLCAndG9FeHBQb3MnLCAnbWF4RScsICdtaW5FJywgJ21vZHVsbycsICdjcnlwdG8nXTtcclxuICAgICAgZm9yIChpID0gMDsgaSA8IHBzLmxlbmd0aDspIGlmICghb2JqLmhhc093blByb3BlcnR5KHAgPSBwc1tpKytdKSkgb2JqW3BdID0gdGhpc1twXTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIERlY2ltYWwuY29uZmlnKG9iaik7XHJcblxyXG4gIHJldHVybiBEZWNpbWFsO1xyXG59XHJcblxyXG5cclxuLypcclxuICogUmV0dXJuIGEgbmV3IERlY2ltYWwgd2hvc2UgdmFsdWUgaXMgYHhgIGRpdmlkZWQgYnkgYHlgLCByb3VuZGVkIHRvIGBwcmVjaXNpb25gIHNpZ25pZmljYW50XHJcbiAqIGRpZ2l0cyB1c2luZyByb3VuZGluZyBtb2RlIGByb3VuZGluZ2AuXHJcbiAqXHJcbiAqIHgge251bWJlcnxzdHJpbmd8RGVjaW1hbH1cclxuICogeSB7bnVtYmVyfHN0cmluZ3xEZWNpbWFsfVxyXG4gKlxyXG4gKi9cclxuZnVuY3Rpb24gZGl2KHgsIHkpIHtcclxuICByZXR1cm4gbmV3IHRoaXMoeCkuZGl2KHkpO1xyXG59XHJcblxyXG5cclxuLypcclxuICogUmV0dXJuIGEgbmV3IERlY2ltYWwgd2hvc2UgdmFsdWUgaXMgdGhlIG5hdHVyYWwgZXhwb25lbnRpYWwgb2YgYHhgLCByb3VuZGVkIHRvIGBwcmVjaXNpb25gXHJcbiAqIHNpZ25pZmljYW50IGRpZ2l0cyB1c2luZyByb3VuZGluZyBtb2RlIGByb3VuZGluZ2AuXHJcbiAqXHJcbiAqIHgge251bWJlcnxzdHJpbmd8RGVjaW1hbH0gVGhlIHBvd2VyIHRvIHdoaWNoIHRvIHJhaXNlIHRoZSBiYXNlIG9mIHRoZSBuYXR1cmFsIGxvZy5cclxuICpcclxuICovXHJcbmZ1bmN0aW9uIGV4cCh4KSB7XHJcbiAgcmV0dXJuIG5ldyB0aGlzKHgpLmV4cCgpO1xyXG59XHJcblxyXG5cclxuLypcclxuICogUmV0dXJuIGEgbmV3IERlY2ltYWwgd2hvc2UgdmFsdWUgaXMgYHhgIHJvdW5kIHRvIGFuIGludGVnZXIgdXNpbmcgYFJPVU5EX0ZMT09SYC5cclxuICpcclxuICogeCB7bnVtYmVyfHN0cmluZ3xEZWNpbWFsfVxyXG4gKlxyXG4gKi9cclxuZnVuY3Rpb24gZmxvb3IoeCkge1xyXG4gIHJldHVybiBmaW5hbGlzZSh4ID0gbmV3IHRoaXMoeCksIHguZSArIDEsIDMpO1xyXG59XHJcblxyXG5cclxuLypcclxuICogUmV0dXJuIGEgbmV3IERlY2ltYWwgd2hvc2UgdmFsdWUgaXMgdGhlIHNxdWFyZSByb290IG9mIHRoZSBzdW0gb2YgdGhlIHNxdWFyZXMgb2YgdGhlIGFyZ3VtZW50cyxcclxuICogcm91bmRlZCB0byBgcHJlY2lzaW9uYCBzaWduaWZpY2FudCBkaWdpdHMgdXNpbmcgcm91bmRpbmcgbW9kZSBgcm91bmRpbmdgLlxyXG4gKlxyXG4gKiBoeXBvdChhLCBiLCAuLi4pID0gc3FydChhXjIgKyBiXjIgKyAuLi4pXHJcbiAqXHJcbiAqIGFyZ3VtZW50cyB7bnVtYmVyfHN0cmluZ3xEZWNpbWFsfVxyXG4gKlxyXG4gKi9cclxuZnVuY3Rpb24gaHlwb3QoKSB7XHJcbiAgdmFyIGksIG4sXHJcbiAgICB0ID0gbmV3IHRoaXMoMCk7XHJcblxyXG4gIGV4dGVybmFsID0gZmFsc2U7XHJcblxyXG4gIGZvciAoaSA9IDA7IGkgPCBhcmd1bWVudHMubGVuZ3RoOykge1xyXG4gICAgbiA9IG5ldyB0aGlzKGFyZ3VtZW50c1tpKytdKTtcclxuICAgIGlmICghbi5kKSB7XHJcbiAgICAgIGlmIChuLnMpIHtcclxuICAgICAgICBleHRlcm5hbCA9IHRydWU7XHJcbiAgICAgICAgcmV0dXJuIG5ldyB0aGlzKDEgLyAwKTtcclxuICAgICAgfVxyXG4gICAgICB0ID0gbjtcclxuICAgIH0gZWxzZSBpZiAodC5kKSB7XHJcbiAgICAgIHQgPSB0LnBsdXMobi50aW1lcyhuKSk7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBleHRlcm5hbCA9IHRydWU7XHJcblxyXG4gIHJldHVybiB0LnNxcnQoKTtcclxufVxyXG5cclxuXHJcbi8qXHJcbiAqIFJldHVybiB0cnVlIGlmIG9iamVjdCBpcyBhIERlY2ltYWwgaW5zdGFuY2UgKHdoZXJlIERlY2ltYWwgaXMgYW55IERlY2ltYWwgY29uc3RydWN0b3IpLFxyXG4gKiBvdGhlcndpc2UgcmV0dXJuIGZhbHNlLlxyXG4gKlxyXG4gKi9cclxuZnVuY3Rpb24gaXNEZWNpbWFsSW5zdGFuY2Uob2JqKSB7XHJcbiAgcmV0dXJuIG9iaiBpbnN0YW5jZW9mIERlY2ltYWwgfHwgb2JqICYmIG9iai50b1N0cmluZ1RhZyA9PT0gdGFnIHx8IGZhbHNlO1xyXG59XHJcblxyXG5cclxuLypcclxuICogUmV0dXJuIGEgbmV3IERlY2ltYWwgd2hvc2UgdmFsdWUgaXMgdGhlIG5hdHVyYWwgbG9nYXJpdGhtIG9mIGB4YCwgcm91bmRlZCB0byBgcHJlY2lzaW9uYFxyXG4gKiBzaWduaWZpY2FudCBkaWdpdHMgdXNpbmcgcm91bmRpbmcgbW9kZSBgcm91bmRpbmdgLlxyXG4gKlxyXG4gKiB4IHtudW1iZXJ8c3RyaW5nfERlY2ltYWx9XHJcbiAqXHJcbiAqL1xyXG5mdW5jdGlvbiBsbih4KSB7XHJcbiAgcmV0dXJuIG5ldyB0aGlzKHgpLmxuKCk7XHJcbn1cclxuXHJcblxyXG4vKlxyXG4gKiBSZXR1cm4gYSBuZXcgRGVjaW1hbCB3aG9zZSB2YWx1ZSBpcyB0aGUgbG9nIG9mIGB4YCB0byB0aGUgYmFzZSBgeWAsIG9yIHRvIGJhc2UgMTAgaWYgbm8gYmFzZVxyXG4gKiBpcyBzcGVjaWZpZWQsIHJvdW5kZWQgdG8gYHByZWNpc2lvbmAgc2lnbmlmaWNhbnQgZGlnaXRzIHVzaW5nIHJvdW5kaW5nIG1vZGUgYHJvdW5kaW5nYC5cclxuICpcclxuICogbG9nW3ldKHgpXHJcbiAqXHJcbiAqIHgge251bWJlcnxzdHJpbmd8RGVjaW1hbH0gVGhlIGFyZ3VtZW50IG9mIHRoZSBsb2dhcml0aG0uXHJcbiAqIHkge251bWJlcnxzdHJpbmd8RGVjaW1hbH0gVGhlIGJhc2Ugb2YgdGhlIGxvZ2FyaXRobS5cclxuICpcclxuICovXHJcbmZ1bmN0aW9uIGxvZyh4LCB5KSB7XHJcbiAgcmV0dXJuIG5ldyB0aGlzKHgpLmxvZyh5KTtcclxufVxyXG5cclxuXHJcbi8qXHJcbiAqIFJldHVybiBhIG5ldyBEZWNpbWFsIHdob3NlIHZhbHVlIGlzIHRoZSBiYXNlIDIgbG9nYXJpdGhtIG9mIGB4YCwgcm91bmRlZCB0byBgcHJlY2lzaW9uYFxyXG4gKiBzaWduaWZpY2FudCBkaWdpdHMgdXNpbmcgcm91bmRpbmcgbW9kZSBgcm91bmRpbmdgLlxyXG4gKlxyXG4gKiB4IHtudW1iZXJ8c3RyaW5nfERlY2ltYWx9XHJcbiAqXHJcbiAqL1xyXG5mdW5jdGlvbiBsb2cyKHgpIHtcclxuICByZXR1cm4gbmV3IHRoaXMoeCkubG9nKDIpO1xyXG59XHJcblxyXG5cclxuLypcclxuICogUmV0dXJuIGEgbmV3IERlY2ltYWwgd2hvc2UgdmFsdWUgaXMgdGhlIGJhc2UgMTAgbG9nYXJpdGhtIG9mIGB4YCwgcm91bmRlZCB0byBgcHJlY2lzaW9uYFxyXG4gKiBzaWduaWZpY2FudCBkaWdpdHMgdXNpbmcgcm91bmRpbmcgbW9kZSBgcm91bmRpbmdgLlxyXG4gKlxyXG4gKiB4IHtudW1iZXJ8c3RyaW5nfERlY2ltYWx9XHJcbiAqXHJcbiAqL1xyXG5mdW5jdGlvbiBsb2cxMCh4KSB7XHJcbiAgcmV0dXJuIG5ldyB0aGlzKHgpLmxvZygxMCk7XHJcbn1cclxuXHJcblxyXG4vKlxyXG4gKiBSZXR1cm4gYSBuZXcgRGVjaW1hbCB3aG9zZSB2YWx1ZSBpcyB0aGUgbWF4aW11bSBvZiB0aGUgYXJndW1lbnRzLlxyXG4gKlxyXG4gKiBhcmd1bWVudHMge251bWJlcnxzdHJpbmd8RGVjaW1hbH1cclxuICpcclxuICovXHJcbmZ1bmN0aW9uIG1heCgpIHtcclxuICByZXR1cm4gbWF4T3JNaW4odGhpcywgYXJndW1lbnRzLCAnbHQnKTtcclxufVxyXG5cclxuXHJcbi8qXHJcbiAqIFJldHVybiBhIG5ldyBEZWNpbWFsIHdob3NlIHZhbHVlIGlzIHRoZSBtaW5pbXVtIG9mIHRoZSBhcmd1bWVudHMuXHJcbiAqXHJcbiAqIGFyZ3VtZW50cyB7bnVtYmVyfHN0cmluZ3xEZWNpbWFsfVxyXG4gKlxyXG4gKi9cclxuZnVuY3Rpb24gbWluKCkge1xyXG4gIHJldHVybiBtYXhPck1pbih0aGlzLCBhcmd1bWVudHMsICdndCcpO1xyXG59XHJcblxyXG5cclxuLypcclxuICogUmV0dXJuIGEgbmV3IERlY2ltYWwgd2hvc2UgdmFsdWUgaXMgYHhgIG1vZHVsbyBgeWAsIHJvdW5kZWQgdG8gYHByZWNpc2lvbmAgc2lnbmlmaWNhbnQgZGlnaXRzXHJcbiAqIHVzaW5nIHJvdW5kaW5nIG1vZGUgYHJvdW5kaW5nYC5cclxuICpcclxuICogeCB7bnVtYmVyfHN0cmluZ3xEZWNpbWFsfVxyXG4gKiB5IHtudW1iZXJ8c3RyaW5nfERlY2ltYWx9XHJcbiAqXHJcbiAqL1xyXG5mdW5jdGlvbiBtb2QoeCwgeSkge1xyXG4gIHJldHVybiBuZXcgdGhpcyh4KS5tb2QoeSk7XHJcbn1cclxuXHJcblxyXG4vKlxyXG4gKiBSZXR1cm4gYSBuZXcgRGVjaW1hbCB3aG9zZSB2YWx1ZSBpcyBgeGAgbXVsdGlwbGllZCBieSBgeWAsIHJvdW5kZWQgdG8gYHByZWNpc2lvbmAgc2lnbmlmaWNhbnRcclxuICogZGlnaXRzIHVzaW5nIHJvdW5kaW5nIG1vZGUgYHJvdW5kaW5nYC5cclxuICpcclxuICogeCB7bnVtYmVyfHN0cmluZ3xEZWNpbWFsfVxyXG4gKiB5IHtudW1iZXJ8c3RyaW5nfERlY2ltYWx9XHJcbiAqXHJcbiAqL1xyXG5mdW5jdGlvbiBtdWwoeCwgeSkge1xyXG4gIHJldHVybiBuZXcgdGhpcyh4KS5tdWwoeSk7XHJcbn1cclxuXHJcblxyXG4vKlxyXG4gKiBSZXR1cm4gYSBuZXcgRGVjaW1hbCB3aG9zZSB2YWx1ZSBpcyBgeGAgcmFpc2VkIHRvIHRoZSBwb3dlciBgeWAsIHJvdW5kZWQgdG8gcHJlY2lzaW9uXHJcbiAqIHNpZ25pZmljYW50IGRpZ2l0cyB1c2luZyByb3VuZGluZyBtb2RlIGByb3VuZGluZ2AuXHJcbiAqXHJcbiAqIHgge251bWJlcnxzdHJpbmd8RGVjaW1hbH0gVGhlIGJhc2UuXHJcbiAqIHkge251bWJlcnxzdHJpbmd8RGVjaW1hbH0gVGhlIGV4cG9uZW50LlxyXG4gKlxyXG4gKi9cclxuZnVuY3Rpb24gcG93KHgsIHkpIHtcclxuICByZXR1cm4gbmV3IHRoaXMoeCkucG93KHkpO1xyXG59XHJcblxyXG5cclxuLypcclxuICogUmV0dXJucyBhIG5ldyBEZWNpbWFsIHdpdGggYSByYW5kb20gdmFsdWUgZXF1YWwgdG8gb3IgZ3JlYXRlciB0aGFuIDAgYW5kIGxlc3MgdGhhbiAxLCBhbmQgd2l0aFxyXG4gKiBgc2RgLCBvciBgRGVjaW1hbC5wcmVjaXNpb25gIGlmIGBzZGAgaXMgb21pdHRlZCwgc2lnbmlmaWNhbnQgZGlnaXRzIChvciBsZXNzIGlmIHRyYWlsaW5nIHplcm9zXHJcbiAqIGFyZSBwcm9kdWNlZCkuXHJcbiAqXHJcbiAqIFtzZF0ge251bWJlcn0gU2lnbmlmaWNhbnQgZGlnaXRzLiBJbnRlZ2VyLCAwIHRvIE1BWF9ESUdJVFMgaW5jbHVzaXZlLlxyXG4gKlxyXG4gKi9cclxuZnVuY3Rpb24gcmFuZG9tKHNkKSB7XHJcbiAgdmFyIGQsIGUsIGssIG4sXHJcbiAgICBpID0gMCxcclxuICAgIHIgPSBuZXcgdGhpcygxKSxcclxuICAgIHJkID0gW107XHJcblxyXG4gIGlmIChzZCA9PT0gdm9pZCAwKSBzZCA9IHRoaXMucHJlY2lzaW9uO1xyXG4gIGVsc2UgY2hlY2tJbnQzMihzZCwgMSwgTUFYX0RJR0lUUyk7XHJcblxyXG4gIGsgPSBNYXRoLmNlaWwoc2QgLyBMT0dfQkFTRSk7XHJcblxyXG4gIGlmICghdGhpcy5jcnlwdG8pIHtcclxuICAgIGZvciAoOyBpIDwgazspIHJkW2krK10gPSBNYXRoLnJhbmRvbSgpICogMWU3IHwgMDtcclxuXHJcbiAgLy8gQnJvd3NlcnMgc3VwcG9ydGluZyBjcnlwdG8uZ2V0UmFuZG9tVmFsdWVzLlxyXG4gIH0gZWxzZSBpZiAoY3J5cHRvLmdldFJhbmRvbVZhbHVlcykge1xyXG4gICAgZCA9IGNyeXB0by5nZXRSYW5kb21WYWx1ZXMobmV3IFVpbnQzMkFycmF5KGspKTtcclxuXHJcbiAgICBmb3IgKDsgaSA8IGs7KSB7XHJcbiAgICAgIG4gPSBkW2ldO1xyXG5cclxuICAgICAgLy8gMCA8PSBuIDwgNDI5NDk2NzI5NlxyXG4gICAgICAvLyBQcm9iYWJpbGl0eSBuID49IDQuMjllOSwgaXMgNDk2NzI5NiAvIDQyOTQ5NjcyOTYgPSAwLjAwMTE2ICgxIGluIDg2NSkuXHJcbiAgICAgIGlmIChuID49IDQuMjllOSkge1xyXG4gICAgICAgIGRbaV0gPSBjcnlwdG8uZ2V0UmFuZG9tVmFsdWVzKG5ldyBVaW50MzJBcnJheSgxKSlbMF07XHJcbiAgICAgIH0gZWxzZSB7XHJcblxyXG4gICAgICAgIC8vIDAgPD0gbiA8PSA0Mjg5OTk5OTk5XHJcbiAgICAgICAgLy8gMCA8PSAobiAlIDFlNykgPD0gOTk5OTk5OVxyXG4gICAgICAgIHJkW2krK10gPSBuICUgMWU3O1xyXG4gICAgICB9XHJcbiAgICB9XHJcblxyXG4gIC8vIE5vZGUuanMgc3VwcG9ydGluZyBjcnlwdG8ucmFuZG9tQnl0ZXMuXHJcbiAgfSBlbHNlIGlmIChjcnlwdG8ucmFuZG9tQnl0ZXMpIHtcclxuXHJcbiAgICAvLyBidWZmZXJcclxuICAgIGQgPSBjcnlwdG8ucmFuZG9tQnl0ZXMoayAqPSA0KTtcclxuXHJcbiAgICBmb3IgKDsgaSA8IGs7KSB7XHJcblxyXG4gICAgICAvLyAwIDw9IG4gPCAyMTQ3NDgzNjQ4XHJcbiAgICAgIG4gPSBkW2ldICsgKGRbaSArIDFdIDw8IDgpICsgKGRbaSArIDJdIDw8IDE2KSArICgoZFtpICsgM10gJiAweDdmKSA8PCAyNCk7XHJcblxyXG4gICAgICAvLyBQcm9iYWJpbGl0eSBuID49IDIuMTRlOSwgaXMgNzQ4MzY0OCAvIDIxNDc0ODM2NDggPSAwLjAwMzUgKDEgaW4gMjg2KS5cclxuICAgICAgaWYgKG4gPj0gMi4xNGU5KSB7XHJcbiAgICAgICAgY3J5cHRvLnJhbmRvbUJ5dGVzKDQpLmNvcHkoZCwgaSk7XHJcbiAgICAgIH0gZWxzZSB7XHJcblxyXG4gICAgICAgIC8vIDAgPD0gbiA8PSAyMTM5OTk5OTk5XHJcbiAgICAgICAgLy8gMCA8PSAobiAlIDFlNykgPD0gOTk5OTk5OVxyXG4gICAgICAgIHJkLnB1c2gobiAlIDFlNyk7XHJcbiAgICAgICAgaSArPSA0O1xyXG4gICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgaSA9IGsgLyA0O1xyXG4gIH0gZWxzZSB7XHJcbiAgICB0aHJvdyBFcnJvcihjcnlwdG9VbmF2YWlsYWJsZSk7XHJcbiAgfVxyXG5cclxuICBrID0gcmRbLS1pXTtcclxuICBzZCAlPSBMT0dfQkFTRTtcclxuXHJcbiAgLy8gQ29udmVydCB0cmFpbGluZyBkaWdpdHMgdG8gemVyb3MgYWNjb3JkaW5nIHRvIHNkLlxyXG4gIGlmIChrICYmIHNkKSB7XHJcbiAgICBuID0gbWF0aHBvdygxMCwgTE9HX0JBU0UgLSBzZCk7XHJcbiAgICByZFtpXSA9IChrIC8gbiB8IDApICogbjtcclxuICB9XHJcblxyXG4gIC8vIFJlbW92ZSB0cmFpbGluZyB3b3JkcyB3aGljaCBhcmUgemVyby5cclxuICBmb3IgKDsgcmRbaV0gPT09IDA7IGktLSkgcmQucG9wKCk7XHJcblxyXG4gIC8vIFplcm8/XHJcbiAgaWYgKGkgPCAwKSB7XHJcbiAgICBlID0gMDtcclxuICAgIHJkID0gWzBdO1xyXG4gIH0gZWxzZSB7XHJcbiAgICBlID0gLTE7XHJcblxyXG4gICAgLy8gUmVtb3ZlIGxlYWRpbmcgd29yZHMgd2hpY2ggYXJlIHplcm8gYW5kIGFkanVzdCBleHBvbmVudCBhY2NvcmRpbmdseS5cclxuICAgIGZvciAoOyByZFswXSA9PT0gMDsgZSAtPSBMT0dfQkFTRSkgcmQuc2hpZnQoKTtcclxuXHJcbiAgICAvLyBDb3VudCB0aGUgZGlnaXRzIG9mIHRoZSBmaXJzdCB3b3JkIG9mIHJkIHRvIGRldGVybWluZSBsZWFkaW5nIHplcm9zLlxyXG4gICAgZm9yIChrID0gMSwgbiA9IHJkWzBdOyBuID49IDEwOyBuIC89IDEwKSBrKys7XHJcblxyXG4gICAgLy8gQWRqdXN0IHRoZSBleHBvbmVudCBmb3IgbGVhZGluZyB6ZXJvcyBvZiB0aGUgZmlyc3Qgd29yZCBvZiByZC5cclxuICAgIGlmIChrIDwgTE9HX0JBU0UpIGUgLT0gTE9HX0JBU0UgLSBrO1xyXG4gIH1cclxuXHJcbiAgci5lID0gZTtcclxuICByLmQgPSByZDtcclxuXHJcbiAgcmV0dXJuIHI7XHJcbn1cclxuXHJcblxyXG4vKlxyXG4gKiBSZXR1cm4gYSBuZXcgRGVjaW1hbCB3aG9zZSB2YWx1ZSBpcyBgeGAgcm91bmRlZCB0byBhbiBpbnRlZ2VyIHVzaW5nIHJvdW5kaW5nIG1vZGUgYHJvdW5kaW5nYC5cclxuICpcclxuICogVG8gZW11bGF0ZSBgTWF0aC5yb3VuZGAsIHNldCByb3VuZGluZyB0byA3IChST1VORF9IQUxGX0NFSUwpLlxyXG4gKlxyXG4gKiB4IHtudW1iZXJ8c3RyaW5nfERlY2ltYWx9XHJcbiAqXHJcbiAqL1xyXG5mdW5jdGlvbiByb3VuZCh4KSB7XHJcbiAgcmV0dXJuIGZpbmFsaXNlKHggPSBuZXcgdGhpcyh4KSwgeC5lICsgMSwgdGhpcy5yb3VuZGluZyk7XHJcbn1cclxuXHJcblxyXG4vKlxyXG4gKiBSZXR1cm5cclxuICogICAxICAgIGlmIHggPiAwLFxyXG4gKiAgLTEgICAgaWYgeCA8IDAsXHJcbiAqICAgMCAgICBpZiB4IGlzIDAsXHJcbiAqICAtMCAgICBpZiB4IGlzIC0wLFxyXG4gKiAgIE5hTiAgb3RoZXJ3aXNlXHJcbiAqXHJcbiAqIHgge251bWJlcnxzdHJpbmd8RGVjaW1hbH1cclxuICpcclxuICovXHJcbmZ1bmN0aW9uIHNpZ24oeCkge1xyXG4gIHggPSBuZXcgdGhpcyh4KTtcclxuICByZXR1cm4geC5kID8gKHguZFswXSA/IHgucyA6IDAgKiB4LnMpIDogeC5zIHx8IE5hTjtcclxufVxyXG5cclxuXHJcbi8qXHJcbiAqIFJldHVybiBhIG5ldyBEZWNpbWFsIHdob3NlIHZhbHVlIGlzIHRoZSBzaW5lIG9mIGB4YCwgcm91bmRlZCB0byBgcHJlY2lzaW9uYCBzaWduaWZpY2FudCBkaWdpdHNcclxuICogdXNpbmcgcm91bmRpbmcgbW9kZSBgcm91bmRpbmdgLlxyXG4gKlxyXG4gKiB4IHtudW1iZXJ8c3RyaW5nfERlY2ltYWx9IEEgdmFsdWUgaW4gcmFkaWFucy5cclxuICpcclxuICovXHJcbmZ1bmN0aW9uIHNpbih4KSB7XHJcbiAgcmV0dXJuIG5ldyB0aGlzKHgpLnNpbigpO1xyXG59XHJcblxyXG5cclxuLypcclxuICogUmV0dXJuIGEgbmV3IERlY2ltYWwgd2hvc2UgdmFsdWUgaXMgdGhlIGh5cGVyYm9saWMgc2luZSBvZiBgeGAsIHJvdW5kZWQgdG8gYHByZWNpc2lvbmBcclxuICogc2lnbmlmaWNhbnQgZGlnaXRzIHVzaW5nIHJvdW5kaW5nIG1vZGUgYHJvdW5kaW5nYC5cclxuICpcclxuICogeCB7bnVtYmVyfHN0cmluZ3xEZWNpbWFsfSBBIHZhbHVlIGluIHJhZGlhbnMuXHJcbiAqXHJcbiAqL1xyXG5mdW5jdGlvbiBzaW5oKHgpIHtcclxuICByZXR1cm4gbmV3IHRoaXMoeCkuc2luaCgpO1xyXG59XHJcblxyXG5cclxuLypcclxuICogUmV0dXJuIGEgbmV3IERlY2ltYWwgd2hvc2UgdmFsdWUgaXMgdGhlIHNxdWFyZSByb290IG9mIGB4YCwgcm91bmRlZCB0byBgcHJlY2lzaW9uYCBzaWduaWZpY2FudFxyXG4gKiBkaWdpdHMgdXNpbmcgcm91bmRpbmcgbW9kZSBgcm91bmRpbmdgLlxyXG4gKlxyXG4gKiB4IHtudW1iZXJ8c3RyaW5nfERlY2ltYWx9XHJcbiAqXHJcbiAqL1xyXG5mdW5jdGlvbiBzcXJ0KHgpIHtcclxuICByZXR1cm4gbmV3IHRoaXMoeCkuc3FydCgpO1xyXG59XHJcblxyXG5cclxuLypcclxuICogUmV0dXJuIGEgbmV3IERlY2ltYWwgd2hvc2UgdmFsdWUgaXMgYHhgIG1pbnVzIGB5YCwgcm91bmRlZCB0byBgcHJlY2lzaW9uYCBzaWduaWZpY2FudCBkaWdpdHNcclxuICogdXNpbmcgcm91bmRpbmcgbW9kZSBgcm91bmRpbmdgLlxyXG4gKlxyXG4gKiB4IHtudW1iZXJ8c3RyaW5nfERlY2ltYWx9XHJcbiAqIHkge251bWJlcnxzdHJpbmd8RGVjaW1hbH1cclxuICpcclxuICovXHJcbmZ1bmN0aW9uIHN1Yih4LCB5KSB7XHJcbiAgcmV0dXJuIG5ldyB0aGlzKHgpLnN1Yih5KTtcclxufVxyXG5cclxuXHJcbi8qXHJcbiAqIFJldHVybiBhIG5ldyBEZWNpbWFsIHdob3NlIHZhbHVlIGlzIHRoZSBzdW0gb2YgdGhlIGFyZ3VtZW50cywgcm91bmRlZCB0byBgcHJlY2lzaW9uYFxyXG4gKiBzaWduaWZpY2FudCBkaWdpdHMgdXNpbmcgcm91bmRpbmcgbW9kZSBgcm91bmRpbmdgLlxyXG4gKlxyXG4gKiBPbmx5IHRoZSByZXN1bHQgaXMgcm91bmRlZCwgbm90IHRoZSBpbnRlcm1lZGlhdGUgY2FsY3VsYXRpb25zLlxyXG4gKlxyXG4gKiBhcmd1bWVudHMge251bWJlcnxzdHJpbmd8RGVjaW1hbH1cclxuICpcclxuICovXHJcbmZ1bmN0aW9uIHN1bSgpIHtcclxuICB2YXIgaSA9IDAsXHJcbiAgICBhcmdzID0gYXJndW1lbnRzLFxyXG4gICAgeCA9IG5ldyB0aGlzKGFyZ3NbaV0pO1xyXG5cclxuICBleHRlcm5hbCA9IGZhbHNlO1xyXG4gIGZvciAoOyB4LnMgJiYgKytpIDwgYXJncy5sZW5ndGg7KSB4ID0geC5wbHVzKGFyZ3NbaV0pO1xyXG4gIGV4dGVybmFsID0gdHJ1ZTtcclxuXHJcbiAgcmV0dXJuIGZpbmFsaXNlKHgsIHRoaXMucHJlY2lzaW9uLCB0aGlzLnJvdW5kaW5nKTtcclxufVxyXG5cclxuXHJcbi8qXHJcbiAqIFJldHVybiBhIG5ldyBEZWNpbWFsIHdob3NlIHZhbHVlIGlzIHRoZSB0YW5nZW50IG9mIGB4YCwgcm91bmRlZCB0byBgcHJlY2lzaW9uYCBzaWduaWZpY2FudFxyXG4gKiBkaWdpdHMgdXNpbmcgcm91bmRpbmcgbW9kZSBgcm91bmRpbmdgLlxyXG4gKlxyXG4gKiB4IHtudW1iZXJ8c3RyaW5nfERlY2ltYWx9IEEgdmFsdWUgaW4gcmFkaWFucy5cclxuICpcclxuICovXHJcbmZ1bmN0aW9uIHRhbih4KSB7XHJcbiAgcmV0dXJuIG5ldyB0aGlzKHgpLnRhbigpO1xyXG59XHJcblxyXG5cclxuLypcclxuICogUmV0dXJuIGEgbmV3IERlY2ltYWwgd2hvc2UgdmFsdWUgaXMgdGhlIGh5cGVyYm9saWMgdGFuZ2VudCBvZiBgeGAsIHJvdW5kZWQgdG8gYHByZWNpc2lvbmBcclxuICogc2lnbmlmaWNhbnQgZGlnaXRzIHVzaW5nIHJvdW5kaW5nIG1vZGUgYHJvdW5kaW5nYC5cclxuICpcclxuICogeCB7bnVtYmVyfHN0cmluZ3xEZWNpbWFsfSBBIHZhbHVlIGluIHJhZGlhbnMuXHJcbiAqXHJcbiAqL1xyXG5mdW5jdGlvbiB0YW5oKHgpIHtcclxuICByZXR1cm4gbmV3IHRoaXMoeCkudGFuaCgpO1xyXG59XHJcblxyXG5cclxuLypcclxuICogUmV0dXJuIGEgbmV3IERlY2ltYWwgd2hvc2UgdmFsdWUgaXMgYHhgIHRydW5jYXRlZCB0byBhbiBpbnRlZ2VyLlxyXG4gKlxyXG4gKiB4IHtudW1iZXJ8c3RyaW5nfERlY2ltYWx9XHJcbiAqXHJcbiAqL1xyXG5mdW5jdGlvbiB0cnVuYyh4KSB7XHJcbiAgcmV0dXJuIGZpbmFsaXNlKHggPSBuZXcgdGhpcyh4KSwgeC5lICsgMSwgMSk7XHJcbn1cclxuXHJcblxyXG5QW1N5bWJvbC5mb3IoJ25vZGVqcy51dGlsLmluc3BlY3QuY3VzdG9tJyldID0gUC50b1N0cmluZztcclxuUFtTeW1ib2wudG9TdHJpbmdUYWddID0gJ0RlY2ltYWwnO1xyXG5cclxuLy8gQ3JlYXRlIGFuZCBjb25maWd1cmUgaW5pdGlhbCBEZWNpbWFsIGNvbnN0cnVjdG9yLlxyXG5leHBvcnQgdmFyIERlY2ltYWwgPSBQLmNvbnN0cnVjdG9yID0gY2xvbmUoREVGQVVMVFMpO1xyXG5cclxuLy8gQ3JlYXRlIHRoZSBpbnRlcm5hbCBjb25zdGFudHMgZnJvbSB0aGVpciBzdHJpbmcgdmFsdWVzLlxyXG5MTjEwID0gbmV3IERlY2ltYWwoTE4xMCk7XHJcblBJID0gbmV3IERlY2ltYWwoUEkpO1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgRGVjaW1hbDtcclxuIiwgIi8qXG5Ob3RhYmxlIGNoYW5nZXMgbWFkZSAoYW5kIG5vdGVzKTpcbi0gTnVtYmVyIGNsYXNzZXMgcmVnaXN0ZXJlZCBhZnRlciB0aGV5IGFyZSBkZWZpbmVkXG4tIEZsb2F0IGlzIGhhbmRlbGVkIGVudGlyZWx5IGJ5IGRlY2ltYWwuanMsIGFuZCBub3cgb25seSB0YWtlcyBwcmVjaXNpb24gaW5cbiAgIyBvZiBkZWNpbWFsIHBvaW50c1xuLSBOb3RlOiBvbmx5IG1ldGhvZHMgbmVjZXNzYXJ5IGZvciBhZGQsIG11bCwgYW5kIHBvdyBoYXZlIGJlZW4gaW1wbGVtZW50ZWRcbiovXG5cbi8vIGJhc2ljIGltcGxlbWVudGF0aW9ucyBvbmx5IC0gbm8gdXRpbGl0eSBhZGRlZCB5ZXRcbmltcG9ydCB7X0F0b21pY0V4cHJ9IGZyb20gXCIuL2V4cHJcIjtcbmltcG9ydCB7TnVtYmVyS2luZH0gZnJvbSBcIi4va2luZFwiO1xuaW1wb3J0IHtNYW5hZ2VkUHJvcGVydGllc30gZnJvbSBcIi4vYXNzdW1wdGlvbnNcIjtcbmltcG9ydCB7Z2xvYmFsX3BhcmFtZXRlcnN9IGZyb20gXCIuL3BhcmFtZXRlcnNcIjtcbmltcG9ydCB7QWRkfSBmcm9tIFwiLi9hZGRcIjtcbmltcG9ydCB7UywgU2luZ2xldG9ufSBmcm9tIFwiLi9zaW5nbGV0b25cIjtcbmltcG9ydCBEZWNpbWFsIGZyb20gXCJkZWNpbWFsLmpzXCI7XG5pbXBvcnQge2FzX2ludH0gZnJvbSBcIi4uL3V0aWxpdGllcy9taXNjXCI7XG5pbXBvcnQge1Bvd30gZnJvbSBcIi4vcG93ZXJcIjtcbmltcG9ydCB7R2xvYmFsfSBmcm9tIFwiLi9nbG9iYWxcIjtcbmltcG9ydCB7ZGl2bW9kLCBmYWN0b3JpbnQsIGZhY3RvcnJhdCwgcGVyZmVjdF9wb3dlcn0gZnJvbSBcIi4uL250aGVvcnkvZmFjdG9yX1wiO1xuaW1wb3J0IHtIYXNoRGljdH0gZnJvbSBcIi4vdXRpbGl0eVwiO1xuaW1wb3J0IHtNdWx9IGZyb20gXCIuL211bFwiO1xuXG4vKlxudXRpbGl0eSBmdW5jdGlvbnNcblxuVGhlc2UgYXJlIHNvbWV3aGF0IHdyaXR0ZW4gZGlmZmVyZW50bHkgdGhhbiBpbiBzeW1weSAod2hpY2ggZGVwZW5kcyBvbiBtcG1hdGgpXG5idXQgdGhleSBwcm92aWRlIHRoZSBzYW1lIGZ1bmN0aW9uYWxpdHlcbiovXG5cbmZ1bmN0aW9uIGlnY2QoeDogbnVtYmVyLCB5OiBudW1iZXIpIHtcbiAgICB3aGlsZSAoeSkge1xuICAgICAgICBjb25zdCB0ID0geTtcbiAgICAgICAgeSA9IHggJSB5O1xuICAgICAgICB4ID0gdDtcbiAgICB9XG4gICAgcmV0dXJuIHg7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBpbnRfbnRocm9vdCh5OiBudW1iZXIsIG46IG51bWJlcikge1xuICAgIGNvbnN0IHggPSBNYXRoLmZsb29yKHkqKigxL24pKTtcbiAgICBjb25zdCBpc2V4YWN0ID0geCoqbiA9PT0geTtcbiAgICByZXR1cm4gW3gsIGlzZXhhY3RdO1xufVxuXG4vLyB0dXJuIGEgZmxvYXQgdG8gYSByYXRpb25hbCAtPiByZXBsaWFjYXRlcyBtcG1hdGggZnVuY3Rpb25hbGl0eSBidXQgd2Ugc2hvdWxkXG4vLyBwcm9iYWJseSBmaW5kIGEgbGlicmFyeSB0byBkbyB0aGlzIGV2ZW50dWFsbHlcbmZ1bmN0aW9uIHRvUmF0aW8objogYW55LCBlcHM6IG51bWJlcikge1xuICAgIGNvbnN0IGdjZGUgPSAoZTogbnVtYmVyLCB4OiBudW1iZXIsIHk6IG51bWJlcikgPT4ge1xuICAgICAgICBjb25zdCBfZ2NkOiBhbnkgPSAoYTogbnVtYmVyLCBiOiBudW1iZXIpID0+IChiIDwgZSA/IGEgOiBfZ2NkKGIsIGEgJSBiKSk7XG4gICAgICAgIHJldHVybiBfZ2NkKE1hdGguYWJzKHgpLCBNYXRoLmFicyh5KSk7XG4gICAgfTtcbiAgICBjb25zdCBjID0gZ2NkZShCb29sZWFuKGVwcykgPyBlcHMgOiAoMSAvIDEwMDAwKSwgMSwgbik7XG4gICAgcmV0dXJuIFtNYXRoLmZsb29yKG4gLyBjKSwgTWF0aC5mbG9vcigxIC8gYyldO1xufVxuXG5mdW5jdGlvbiBpZ2NkZXgoYTogbnVtYmVyID0gdW5kZWZpbmVkLCBiOiBudW1iZXIgPSB1bmRlZmluZWQpIHtcbiAgICBpZiAodHlwZW9mIGEgPT09IFwidW5kZWZpbmVkXCIgJiYgdHlwZW9mIGIgPT09IFwidW5kZWZpbmVkXCIpIHtcbiAgICAgICAgcmV0dXJuIFswLCAxLCAwXTtcbiAgICB9XG5cbiAgICBpZiAodHlwZW9mIGEgPT09IFwidW5kZWZpbmVkXCIpIHtcbiAgICAgICAgcmV0dXJuIFswLCBNYXRoLmZsb29yKGIgLyBNYXRoLmFicyhiKSksIE1hdGguYWJzKGIpXTtcbiAgICB9XG5cbiAgICBpZiAodHlwZW9mIGIgPT09IFwidW5kZWZpbmVkXCIpIHtcbiAgICAgICAgcmV0dXJuIFtNYXRoLmZsb29yKGEgLyBNYXRoLmFicyhhKSksIDAsIE1hdGguYWJzKGEpXTtcbiAgICB9XG4gICAgbGV0IHhfc2lnbjtcbiAgICBsZXQgeV9zaWduO1xuICAgIGlmIChhIDwgMCkge1xuICAgICAgICBhID0gLTE7XG4gICAgICAgIHhfc2lnbiA9IC0xO1xuICAgIH0gZWxzZSB7XG4gICAgICAgIHhfc2lnbiA9IDE7XG4gICAgfVxuICAgIGlmIChiIDwgMCkge1xuICAgICAgICBiID0gLWI7XG4gICAgICAgIHlfc2lnbiA9IC0xO1xuICAgIH0gZWxzZSB7XG4gICAgICAgIHlfc2lnbiA9IDE7XG4gICAgfVxuXG4gICAgbGV0IFt4LCB5LCByLCBzXSA9IFsxLCAwLCAwLCAxXTtcbiAgICBsZXQgYzsgbGV0IHE7XG4gICAgd2hpbGUgKGIpIHtcbiAgICAgICAgW2MsIHFdID0gW2EgJSBiLCBNYXRoLmZsb29yKGEgLyBiKV07XG4gICAgICAgIFthLCBiLCByLCBzLCB4LCB5XSA9IFtiLCBjLCB4IC0gcSAqIHIsIHkgLSBxICogcywgciwgc107XG4gICAgfVxuICAgIHJldHVybiBbeCAqIHhfc2lnbiwgeSAqIHlfc2lnbiwgYV07XG59XG5cbmZ1bmN0aW9uIG1vZF9pbnZlcnNlKGE6IGFueSwgbTogYW55KSB7XG4gICAgbGV0IGMgPSB1bmRlZmluZWQ7XG4gICAgW2EsIG1dID0gW2FzX2ludChhKSwgYXNfaW50KG0pXTtcbiAgICBpZiAobSAhPT0gMSAmJiBtICE9PSAtMSkge1xuICAgICAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tdW51c2VkLXZhcnNcbiAgICAgICAgY29uc3QgW3gsIGIsIGddID0gaWdjZGV4KGEsIG0pO1xuICAgICAgICBpZiAoZyA9PT0gMSkge1xuICAgICAgICAgICAgYyA9IHggJiBtO1xuICAgICAgICB9XG4gICAgfVxuICAgIHJldHVybiBjO1xufVxuXG5HbG9iYWwucmVnaXN0ZXJmdW5jKFwibW9kX2ludmVyc2VcIiwgbW9kX2ludmVyc2UpO1xuXG5jbGFzcyBfTnVtYmVyXyBleHRlbmRzIF9BdG9taWNFeHByIHtcbiAgICAvKlxuICAgIFJlcHJlc2VudHMgYXRvbWljIG51bWJlcnMgaW4gU3ltUHkuXG4gICAgRXhwbGFuYXRpb25cbiAgICA9PT09PT09PT09PVxuICAgIEZsb2F0aW5nIHBvaW50IG51bWJlcnMgYXJlIHJlcHJlc2VudGVkIGJ5IHRoZSBGbG9hdCBjbGFzcy5cbiAgICBSYXRpb25hbCBudW1iZXJzIChvZiBhbnkgc2l6ZSkgYXJlIHJlcHJlc2VudGVkIGJ5IHRoZSBSYXRpb25hbCBjbGFzcy5cbiAgICBJbnRlZ2VyIG51bWJlcnMgKG9mIGFueSBzaXplKSBhcmUgcmVwcmVzZW50ZWQgYnkgdGhlIEludGVnZXIgY2xhc3MuXG4gICAgRmxvYXQgYW5kIFJhdGlvbmFsIGFyZSBzdWJjbGFzc2VzIG9mIE51bWJlcjsgSW50ZWdlciBpcyBhIHN1YmNsYXNzXG4gICAgb2YgUmF0aW9uYWwuXG4gICAgRm9yIGV4YW1wbGUsIGBgMi8zYGAgaXMgcmVwcmVzZW50ZWQgYXMgYGBSYXRpb25hbCgyLCAzKWBgIHdoaWNoIGlzXG4gICAgYSBkaWZmZXJlbnQgb2JqZWN0IGZyb20gdGhlIGZsb2F0aW5nIHBvaW50IG51bWJlciBvYnRhaW5lZCB3aXRoXG4gICAgUHl0aG9uIGRpdmlzaW9uIGBgMi8zYGAuIEV2ZW4gZm9yIG51bWJlcnMgdGhhdCBhcmUgZXhhY3RseVxuICAgIHJlcHJlc2VudGVkIGluIGJpbmFyeSwgdGhlcmUgaXMgYSBkaWZmZXJlbmNlIGJldHdlZW4gaG93IHR3byBmb3JtcyxcbiAgICBzdWNoIGFzIGBgUmF0aW9uYWwoMSwgMilgYCBhbmQgYGBGbG9hdCgwLjUpYGAsIGFyZSB1c2VkIGluIFN5bVB5LlxuICAgIFRoZSByYXRpb25hbCBmb3JtIGlzIHRvIGJlIHByZWZlcnJlZCBpbiBzeW1ib2xpYyBjb21wdXRhdGlvbnMuXG4gICAgT3RoZXIga2luZHMgb2YgbnVtYmVycywgc3VjaCBhcyBhbGdlYnJhaWMgbnVtYmVycyBgYHNxcnQoMilgYCBvclxuICAgIGNvbXBsZXggbnVtYmVycyBgYDMgKyA0KklgYCwgYXJlIG5vdCBpbnN0YW5jZXMgb2YgTnVtYmVyIGNsYXNzIGFzXG4gICAgdGhleSBhcmUgbm90IGF0b21pYy5cbiAgICBTZWUgQWxzb1xuICAgID09PT09PT09XG4gICAgRmxvYXQsIEludGVnZXIsIFJhdGlvbmFsXG4gICAgKi9cbiAgICBzdGF0aWMgaXNfY29tbXV0YXRpdmUgPSB0cnVlO1xuICAgIHN0YXRpYyBpc19udW1iZXIgPSB0cnVlO1xuICAgIHN0YXRpYyBpc19OdW1iZXIgPSB0cnVlO1xuICAgIHN0YXRpYyBraW5kID0gTnVtYmVyS2luZDtcblxuICAgIHN0YXRpYyBuZXcoLi4ub2JqOiBhbnkpIHtcbiAgICAgICAgaWYgKG9iai5sZW5ndGggPT09IDEpIHtcbiAgICAgICAgICAgIG9iaiA9IG9ialswXTtcbiAgICAgICAgfVxuICAgICAgICBpZiAob2JqIGluc3RhbmNlb2YgX051bWJlcl8pIHtcbiAgICAgICAgICAgIHJldHVybiBvYmo7XG4gICAgICAgIH0gZWxzZSBpZiAodHlwZW9mIG9iaiA9PT0gXCJudW1iZXJcIiAmJiAhTnVtYmVyLmlzSW50ZWdlcihvYmopIHx8IG9iaiBpbnN0YW5jZW9mIERlY2ltYWwgfHwgdHlwZW9mIG9iaiA9PT0gXCJzdHJpbmdcIikge1xuICAgICAgICAgICAgcmV0dXJuIG5ldyBGbG9hdChvYmopO1xuICAgICAgICB9IGVsc2UgaWYgKE51bWJlci5pc0ludGVnZXIob2JqKSkge1xuICAgICAgICAgICAgcmV0dXJuIG5ldyBJbnRlZ2VyKG9iaik7XG4gICAgICAgIH0gZWxzZSBpZiAob2JqLmxlbmd0aCA9PT0gMikge1xuICAgICAgICAgICAgcmV0dXJuIG5ldyBSYXRpb25hbChvYmpbMF0sIG9ialsxXSk7XG4gICAgICAgIH0gZWxzZSBpZiAodHlwZW9mIG9iaiA9PT0gXCJzdHJpbmdcIikge1xuICAgICAgICAgICAgY29uc3QgX29iaiA9IG9iai50b0xvd2VyQ2FzZSgpO1xuICAgICAgICAgICAgaWYgKF9vYmogPT09IFwibmFuXCIpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gUy5OYU47XG4gICAgICAgICAgICB9IGVsc2UgaWYgKF9vYmogPT09IFwiaW5mXCIpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gUy5JbmZpbml0eTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoX29iaiA9PT0gXCIraW5mXCIpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gUy5JbmZpbml0eTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoX29iaiA9PT0gXCItaW5mXCIpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gUy5OZWdhdGl2ZUluZmluaXR5O1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJhcmd1bWVudCBmb3IgbnVtYmVyIGlzIGludmFsaWRcIik7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiYXJndW1lbnQgZm9yIG51bWJlciBpcyBpbnZhbGlkXCIpO1xuICAgIH1cblxuICAgIGFzX2NvZWZmX011bChyYXRpb25hbDogYm9vbGVhbiA9IGZhbHNlKSB7XG4gICAgICAgIGlmIChyYXRpb25hbCAmJiAhdGhpcy5pc19SYXRpb25hbCkge1xuICAgICAgICAgICAgcmV0dXJuIFtTLk9uZSwgdGhpc107XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHRoaXMpIHtcbiAgICAgICAgICAgIHJldHVybiBbdGhpcywgUy5PbmVdO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuIFtTLk9uZSwgdGhpc107XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBhc19jb2VmZl9BZGQoKSB7XG4gICAgICAgIHJldHVybiBbdGhpcywgUy5aZXJvXTtcbiAgICB9XG5cbiAgICAvLyBOT1RFOiBUSEVTRSBNRVRIT0RTIEFSRSBOT1QgWUVUIElNUExFTUVOVEVEIElOIFRIRSBTVVBFUkNMQVNTXG5cbiAgICBfX2FkZF9fKG90aGVyOiBhbnkpIHtcbiAgICAgICAgaWYgKG90aGVyIGluc3RhbmNlb2YgX051bWJlcl8gJiYgZ2xvYmFsX3BhcmFtZXRlcnMuZXZhbHVhdGUpIHtcbiAgICAgICAgICAgIGlmIChvdGhlciA9PT0gUy5OYU4pIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gUy5OYU47XG4gICAgICAgICAgICB9IGVsc2UgaWYgKG90aGVyID09PSBTLkluZmluaXR5KSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIFMuSW5maW5pdHk7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKG90aGVyID09PSBTLk5lZ2F0aXZlSW5maW5pdHkpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gUy5OZWdhdGl2ZUluZmluaXR5O1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBzdXBlci5fX2FkZF9fKG90aGVyKTtcbiAgICB9XG5cbiAgICBfX3N1Yl9fKG90aGVyOiBhbnkpIHtcbiAgICAgICAgaWYgKG90aGVyIGluc3RhbmNlb2YgX051bWJlcl8gJiYgZ2xvYmFsX3BhcmFtZXRlcnMuZXZhbHVhdGUpIHtcbiAgICAgICAgICAgIGlmIChvdGhlciA9PT0gUy5OYU4pIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gUy5OYU47XG4gICAgICAgICAgICB9IGVsc2UgaWYgKG90aGVyID09PSBTLkluZmluaXR5KSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIFMuTmVnYXRpdmVJbmZpbml0eTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAob3RoZXIgPT09IFMuTmVnYXRpdmVJbmZpbml0eSkge1xuICAgICAgICAgICAgICAgIHJldHVybiBTLkluZmluaXR5O1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBzdXBlci5fX3N1Yl9fKG90aGVyKTtcbiAgICB9XG5cbiAgICBfX211bF9fKG90aGVyOiBhbnkpIHtcbiAgICAgICAgaWYgKG90aGVyIGluc3RhbmNlb2YgX051bWJlcl8gJiYgZ2xvYmFsX3BhcmFtZXRlcnMuZXZhbHVhdGUpIHtcbiAgICAgICAgICAgIGNvbnN0IGNsczogYW55ID0gdGhpcy5jb25zdHJ1Y3RvcjtcbiAgICAgICAgICAgIGlmIChvdGhlciA9PT0gUy5OYW4pIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gUy5OYW47XG4gICAgICAgICAgICB9IGVsc2UgaWYgKG90aGVyID09PSBTLkluZmluaXR5KSB7XG4gICAgICAgICAgICAgICAgaWYgKGNscy5pc196ZXJvKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBTLk5hTjtcbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKGNscy5pc19wb3NpdGl2ZSkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gUy5JbmZpbml0eTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gUy5OZWdhdGl2ZUluZmluaXR5O1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0gZWxzZSBpZiAob3RoZXIgPT09IFMuTmVnYXRpdmVJbmZpbml0eSkge1xuICAgICAgICAgICAgICAgIGlmIChjbHMuaXNfemVybykge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gUy5OYU47XG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmIChjbHMuaXNfcG9zaXRpdmUpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFMuTmVnYXRpdmVJbmZpbml0eTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gUy5JbmZpbml0eTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHN1cGVyLl9fbXVsX18ob3RoZXIpO1xuICAgIH1cbiAgICBfX3RydWVkaXZfXyhvdGhlcjogYW55KSB7XG4gICAgICAgIGlmIChvdGhlciBpbnN0YW5jZW9mIF9OdW1iZXJfICYmIGdsb2JhbF9wYXJhbWV0ZXJzLmV2YWx1YXRlKSB7XG4gICAgICAgICAgICBpZiAob3RoZXIgPT09IFMuTmFOKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIFMuTmFOO1xuICAgICAgICAgICAgfSBlbHNlIGlmIChvdGhlciA9PT0gUy5JbmZpbml0eSB8fCBvdGhlciA9PT0gUy5OZWdhdGl2ZUluZmluaXR5KSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIFMuWmVybztcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gc3VwZXIuX190cnVlZGl2X18ob3RoZXIpO1xuICAgIH1cblxuICAgIGV2YWxfZXZhbGYocHJlYzogbnVtYmVyKSB7XG4gICAgICAgIHJldHVybiBuZXcgRmxvYXQodGhpcy5fZmxvYXRfdmFsKHByZWMpLCBwcmVjKTtcbiAgICB9XG5cbiAgICBfZmxvYXRfdmFsKHByZWM6IG51bWJlcik6IGFueSB7XG4gICAgICAgIHJldHVybiB1bmRlZmluZWQ7XG4gICAgfVxufTtcblxuLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5ldy1jYXBcbk1hbmFnZWRQcm9wZXJ0aWVzLnJlZ2lzdGVyKF9OdW1iZXJfKTtcbkdsb2JhbC5yZWdpc3RlcihcIl9OdW1iZXJfXCIsIF9OdW1iZXJfLm5ldyk7XG5cbmNsYXNzIEZsb2F0IGV4dGVuZHMgX051bWJlcl8ge1xuICAgIC8qXG4gICAgKG5vdCBjb3B5aW5nIHN5bXB5IGNvbW1lbnQgYmVjYXVzZSB0aGlzIGltcGxlbWVudGF0aW9uIGlzIHZlcnkgZGlmZmVyZW50KVxuICAgIHNlZSBoZWFkZXIgY29tbWVudCBmb3IgY2hhbmdlc1xuICAgICovXG4gICAgX19zbG90c19fOiBhbnlbXSA9IFtcIl9tcGZfXCIsIFwiX3ByZWNcIl07XG4gICAgX21wZl86IFtudW1iZXIsIG51bWJlciwgbnVtYmVyLCBudW1iZXJdO1xuICAgIHN0YXRpYyBpc19yYXRpb25hbDogYW55ID0gdW5kZWZpbmVkO1xuICAgIHN0YXRpYyBpc19pcnJhdGlvbmFsOiBhbnkgPSB1bmRlZmluZWQ7XG4gICAgc3RhdGljIGlzX251bWJlciA9IHRydWU7XG4gICAgc3RhdGljIGlzX3JlYWwgPSB0cnVlO1xuICAgIHN0YXRpYyBpc19leHRlbmRlZF9yZWFsID0gdHJ1ZTtcbiAgICBzdGF0aWMgaXNfRmxvYXQgPSB0cnVlO1xuICAgIGRlY2ltYWw6IERlY2ltYWw7XG4gICAgcHJlYzogbnVtYmVyO1xuXG4gICAgY29uc3RydWN0b3IobnVtOiBhbnksIHByZWM6IGFueSA9IDE1KSB7XG4gICAgICAgIHN1cGVyKCk7XG4gICAgICAgIHRoaXMucHJlYyA9IHByZWM7XG4gICAgICAgIGlmICh0eXBlb2YgbnVtICE9PSBcInVuZGVmaW5lZFwiKSB7XG4gICAgICAgICAgICBpZiAobnVtIGluc3RhbmNlb2YgRmxvYXQpIHtcbiAgICAgICAgICAgICAgICB0aGlzLmRlY2ltYWwgPSBudW0uZGVjaW1hbDtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAobnVtIGluc3RhbmNlb2YgRGVjaW1hbCkge1xuICAgICAgICAgICAgICAgIHRoaXMuZGVjaW1hbCA9IG51bTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgdGhpcy5kZWNpbWFsID0gbmV3IERlY2ltYWwobnVtKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgIF9fYWRkX18ob3RoZXI6IGFueSkge1xuICAgICAgICBpZiAoZ2xvYmFsX3BhcmFtZXRlcnMuZXZhbHVhdGUgJiYgb3RoZXIgaW5zdGFuY2VvZiBfTnVtYmVyXykge1xuICAgICAgICAgICAgY29uc3QgdmFsID0gb3RoZXIuX2Zsb2F0X3ZhbCh0aGlzLnByZWMpO1xuICAgICAgICAgICAgcmV0dXJuIG5ldyBGbG9hdChEZWNpbWFsLnNldCh7cHJlY2lzaW9uOiB0aGlzLnByZWN9KS5hZGQodGhpcy5kZWNpbWFsLCB2YWwuZGVjaW1hbCksIHRoaXMucHJlYyk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHN1cGVyLl9fYWRkX18ob3RoZXIpO1xuICAgIH1cblxuICAgIF9fc3ViX18ob3RoZXI6IGFueSkge1xuICAgICAgICBpZiAoZ2xvYmFsX3BhcmFtZXRlcnMuZXZhbHVhdGUgJiYgb3RoZXIgaW5zdGFuY2VvZiBfTnVtYmVyXykge1xuICAgICAgICAgICAgY29uc3QgdmFsID0gb3RoZXIuX2Zsb2F0X3ZhbCh0aGlzLnByZWMpO1xuICAgICAgICAgICAgcmV0dXJuIG5ldyBGbG9hdChEZWNpbWFsLnNldCh7cHJlY2lzaW9uOiB0aGlzLnByZWN9KS5zdWIodGhpcy5kZWNpbWFsLCB2YWwuZGVjaW1hbCksIHRoaXMucHJlYyk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHN1cGVyLl9fc3ViX18ob3RoZXIpO1xuICAgIH1cblxuICAgIF9fbXVsX18ob3RoZXI6IGFueSkge1xuICAgICAgICBpZiAoZ2xvYmFsX3BhcmFtZXRlcnMuZXZhbHVhdGUgJiYgb3RoZXIgaW5zdGFuY2VvZiBfTnVtYmVyXykge1xuICAgICAgICAgICAgY29uc3QgdmFsID0gb3RoZXIuX2Zsb2F0X3ZhbCh0aGlzLnByZWMpO1xuICAgICAgICAgICAgcmV0dXJuIG5ldyBGbG9hdChEZWNpbWFsLnNldCh7cHJlY2lzaW9uOiB0aGlzLnByZWN9KS5tdWwodGhpcy5kZWNpbWFsLCB2YWwuZGVjaW1hbCksIHRoaXMucHJlYyk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHN1cGVyLl9fbXVsX18ob3RoZXIpO1xuICAgIH1cblxuICAgIF9fdHJ1ZWRpdl9fKG90aGVyOiBhbnkpIHtcbiAgICAgICAgaWYgKGdsb2JhbF9wYXJhbWV0ZXJzLmV2YWx1YXRlICYmIG90aGVyIGluc3RhbmNlb2YgX051bWJlcl8pIHtcbiAgICAgICAgICAgIGNvbnN0IHZhbCA9IG90aGVyLl9mbG9hdF92YWwodGhpcy5wcmVjKTtcbiAgICAgICAgICAgIHJldHVybiBuZXcgRmxvYXQoRGVjaW1hbC5zZXQoe3ByZWNpc2lvbjogdGhpcy5wcmVjfSkuZGl2KHRoaXMuZGVjaW1hbCwgdmFsLmRlY2ltYWwpLCB0aGlzLnByZWMpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBzdXBlci5fX2Rpdl9fKG90aGVyKTtcbiAgICB9XG5cbiAgICBfZXZhbF9pc19uZWdhdGl2ZSgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuZGVjaW1hbC5sZXNzVGhhbigwKTtcbiAgICB9XG5cbiAgICBfZXZhbF9pc19wb3NpdGl2ZSgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuZGVjaW1hbC5ncmVhdGVyVGhhbigwKTtcbiAgICB9XG5cbiAgICAvLyByZXR1cm4gbmV3IEZsb2F0KERlY2ltYWwuc2V0KHtwcmVjaXNpb246IHRoaXMucHJlY30pLnBvdyh0aGlzLmRlY2ltYWwsIG90aGVyLmV2YWxfZXZhbGYodGhpcy5wcmVjKS5kZWNpbWFsKSwgdGhpcy5wcmVjKTtcblxuICAgIF9ldmFsX3Bvd2VyKGV4cHQ6IGFueSkge1xuICAgICAgICBpZiAodGhpcyA9PT0gUy5aZXJvKSB7XG4gICAgICAgICAgICBpZiAoZXhwdC5pc19leHRlbmRlZF9wb3NpdGl2ZSkge1xuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgICAgICAgfSBpZiAoZXhwdC5pc19leHRlbmRlZF9uZWdhdGl2ZSkge1xuICAgICAgICAgICAgICAgIHJldHVybiBTLkNvbXBsZXhJbmZpbml0eTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBpZiAoZXhwdCBpbnN0YW5jZW9mIF9OdW1iZXJfKSB7XG4gICAgICAgICAgICBpZiAoZXhwdCBpbnN0YW5jZW9mIEludGVnZXIpIHtcbiAgICAgICAgICAgICAgICBjb25zdCBwcmVjID0gdGhpcy5wcmVjO1xuICAgICAgICAgICAgICAgIHJldHVybiBuZXcgRmxvYXQoRGVjaW1hbC5zZXQoe3ByZWNpc2lvbjogdGhpcy5wcmVjfSkucG93KHRoaXMuZGVjaW1hbCwgZXhwdC5wKSwgcHJlYyk7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKGV4cHQgaW5zdGFuY2VvZiBSYXRpb25hbCAmJlxuICAgICAgICAgICAgICAgIGV4cHQucCA9PT0gMSAmJiBleHB0LnEgJSAyICE9PSAwICYmIHRoaXMuaXNfbmVnYXRpdmUoKSkge1xuICAgICAgICAgICAgICAgIGNvbnN0IG5lZ3BhcnQgPSAodGhpcy5fX211bF9fKFMuTmVnYXRpdmVPbmUpKS5fZXZhbF9wb3dlcihleHB0KTtcbiAgICAgICAgICAgICAgICByZXR1cm4gbmV3IE11bCh0cnVlLCB0cnVlLCBuZWdwYXJ0LCBuZXcgUG93KFMuTmVnYXRpdmVPbmUsIGV4cHQsIGZhbHNlKSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBjb25zdCB2YWwgPSBleHB0Ll9mbG9hdF92YWwodGhpcy5wcmVjKS5kZWNpbWFsO1xuICAgICAgICAgICAgY29uc3QgcmVzID0gRGVjaW1hbC5zZXQoe3ByZWNpc2lvbjogdGhpcy5wcmVjfSkucG93KHRoaXMuZGVjaW1hbCwgdmFsKTtcbiAgICAgICAgICAgIGlmIChyZXMuaXNOYU4oKSkge1xuICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcImNvbXBsZXggYW5kIGltYWdpbmFyeSBudW1iZXJzIG5vdCB5ZXQgaW1wbGVtZW50ZWRcIik7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gbmV3IEZsb2F0KHJlcyk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBfZmxvYXRfdmFsKHByZWM6IG51bWJlcik6IGFueSB7XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cblxuICAgIGludmVyc2UoKSB7XG4gICAgICAgIHJldHVybiBuZXcgRmxvYXQoMS8odGhpcy5kZWNpbWFsIGFzIGFueSkpO1xuICAgIH1cblxuICAgIF9ldmFsX2lzX2Zpbml0ZSgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuZGVjaW1hbC5pc0Zpbml0ZSgpO1xuICAgIH1cblxuICAgIHRvU3RyaW5nKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5kZWNpbWFsLnRvU3RyaW5nKClcbiAgICB9XG59XG5cbk1hbmFnZWRQcm9wZXJ0aWVzLnJlZ2lzdGVyKEZsb2F0KTtcblxuXG5jbGFzcyBSYXRpb25hbCBleHRlbmRzIF9OdW1iZXJfIHtcbiAgICBzdGF0aWMgaXNfcmVhbCA9IHRydWU7XG4gICAgc3RhdGljIGlzX2ludGVnZXIgPSBmYWxzZTtcbiAgICBzdGF0aWMgaXNfcmF0aW9uYWwgPSB0cnVlO1xuICAgIHN0YXRpYyBpc19udW1iZXIgPSB0cnVlO1xuICAgIHA6IG51bWJlcjtcbiAgICBxOiBudW1iZXI7XG4gICAgX19zbG90c19fOiBhbnlbXSA9IFtcInBcIiwgXCJxXCJdO1xuXG4gICAgc3RhdGljIGlzX1JhdGlvbmFsID0gdHJ1ZTtcblxuXG4gICAgY29uc3RydWN0b3IocDogYW55LCBxOiBhbnkgPSB1bmRlZmluZWQsIGdjZDogbnVtYmVyID0gdW5kZWZpbmVkLCBzaW1wbGlmeTogYm9vbGVhbiA9IHRydWUpIHtcbiAgICAgICAgc3VwZXIoKTtcbiAgICAgICAgaWYgKHR5cGVvZiBxID09PSBcInVuZGVmaW5lZFwiKSB7XG4gICAgICAgICAgICBpZiAocCBpbnN0YW5jZW9mIFJhdGlvbmFsKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHA7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGlmICh0eXBlb2YgcCA9PT0gXCJudW1iZXJcIiAmJiBwICUgMSAhPT0gMCkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gbmV3IFJhdGlvbmFsKHRvUmF0aW8ocCwgMC4wMDAxKSk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHt9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBxID0gMTtcbiAgICAgICAgICAgIGdjZCA9IDE7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKCFOdW1iZXIuaXNJbnRlZ2VyKHApKSB7XG4gICAgICAgICAgICBwID0gbmV3IFJhdGlvbmFsKHApO1xuICAgICAgICAgICAgcSAqPSBwLnE7XG4gICAgICAgICAgICBwID0gcC5wO1xuICAgICAgICB9XG4gICAgICAgIGlmICghTnVtYmVyLmlzSW50ZWdlcihxKSkge1xuICAgICAgICAgICAgcSA9IG5ldyBSYXRpb25hbChxKTtcbiAgICAgICAgICAgIHAgKj0gcS5xO1xuICAgICAgICAgICAgcSA9IHEucDtcbiAgICAgICAgfVxuICAgICAgICBpZiAocSA9PT0gMCkge1xuICAgICAgICAgICAgaWYgKHAgPT09IDApIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gUy5OYW47XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gUy5Db21wbGV4SW5maW5pdHk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHEgPCAwKSB7XG4gICAgICAgICAgICBxID0gLXE7XG4gICAgICAgICAgICBwID0gLXA7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHR5cGVvZiBnY2QgPT09IFwidW5kZWZpbmVkXCIpIHtcbiAgICAgICAgICAgIGdjZCA9IGlnY2QoTWF0aC5hYnMocCksIHEpO1xuICAgICAgICB9XG4gICAgICAgIGlmIChnY2QgPiAxKSB7XG4gICAgICAgICAgICBwID0gcC9nY2Q7XG4gICAgICAgICAgICBxID0gcS9nY2Q7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHEgPT09IDEgJiYgc2ltcGxpZnkpIHtcbiAgICAgICAgICAgIHJldHVybiBuZXcgSW50ZWdlcihwKTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLnAgPSBwO1xuICAgICAgICB0aGlzLnEgPSBxO1xuICAgIH1cblxuICAgIGhhc2hLZXkoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmNvbnN0cnVjdG9yLm5hbWUgKyB0aGlzLnAgKyB0aGlzLnE7XG4gICAgfVxuXG4gICAgX19hZGRfXyhvdGhlcjogYW55KSB7XG4gICAgICAgIGlmIChnbG9iYWxfcGFyYW1ldGVycy5ldmFsdWF0ZSkge1xuICAgICAgICAgICAgaWYgKG90aGVyIGluc3RhbmNlb2YgSW50ZWdlcikge1xuICAgICAgICAgICAgICAgIHJldHVybiBuZXcgUmF0aW9uYWwodGhpcy5wICsgdGhpcy5xICogb3RoZXIucCwgdGhpcy5xLCAxKTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAob3RoZXIgaW5zdGFuY2VvZiBSYXRpb25hbCkge1xuICAgICAgICAgICAgICAgIHJldHVybiBuZXcgUmF0aW9uYWwodGhpcy5wICogb3RoZXIucSArIHRoaXMucSAqIG90aGVyLnAsIHRoaXMucSAqIG90aGVyLnEpO1xuICAgICAgICAgICAgfSBlbHNlIGlmIChvdGhlciBpbnN0YW5jZW9mIEZsb2F0KSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIG90aGVyLl9fYWRkX18odGhpcyk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHJldHVybiBzdXBlci5fX2FkZF9fKG90aGVyKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gc3VwZXIuX19hZGRfXyhvdGhlcik7XG4gICAgfVxuXG4gICAgX19yYWRkX18ob3RoZXI6IGFueSkge1xuICAgICAgICByZXR1cm4gdGhpcy5fX2FkZF9fKG90aGVyKTtcbiAgICB9XG5cbiAgICBfX3N1Yl9fKG90aGVyOiBhbnkpIHtcbiAgICAgICAgaWYgKGdsb2JhbF9wYXJhbWV0ZXJzLmV2YWx1YXRlKSB7XG4gICAgICAgICAgICBpZiAob3RoZXIgaW5zdGFuY2VvZiBJbnRlZ2VyKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIG5ldyBSYXRpb25hbCh0aGlzLnEgKiBvdGhlci5wIC0gdGhpcy5wLCB0aGlzLnEsIDEpO1xuICAgICAgICAgICAgfSBlbHNlIGlmIChvdGhlciBpbnN0YW5jZW9mIFJhdGlvbmFsKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIG5ldyBSYXRpb25hbCh0aGlzLnAgKiBvdGhlci5xIC0gdGhpcy5xICogb3RoZXIucCwgdGhpcy5xICogb3RoZXIucSk7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKG90aGVyIGluc3RhbmNlb2YgRmxvYXQpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5fX211bF9fKFMuTmVnYXRpdmVPbmUpLl9fYWRkX18ob3RoZXIpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gc3VwZXIuX19zdWJfXyhvdGhlcik7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHN1cGVyLl9fc3ViX18ob3RoZXIpO1xuICAgIH1cblxuICAgIF9fcnN1Yl9fKG90aGVyOiBhbnkpIHtcbiAgICAgICAgaWYgKGdsb2JhbF9wYXJhbWV0ZXJzLmV2YWx1YXRlKSB7XG4gICAgICAgICAgICBpZiAob3RoZXIgaW5zdGFuY2VvZiBJbnRlZ2VyKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIG5ldyBSYXRpb25hbCh0aGlzLnAgLSB0aGlzLnEgKiBvdGhlci5wLCB0aGlzLnEsIDEpO1xuICAgICAgICAgICAgfSBlbHNlIGlmIChvdGhlciBpbnN0YW5jZW9mIFJhdGlvbmFsKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIG5ldyBSYXRpb25hbCh0aGlzLnEgKiBvdGhlci5wIC0gdGhpcy5wICogb3RoZXIucSwgdGhpcy5xICogb3RoZXIucSk7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKG90aGVyIGluc3RhbmNlb2YgRmxvYXQpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gb3RoZXIuX19tdWxfXyhTLk5lZ2F0aXZlT25lKS5fX2FkZF9fKHRoaXMpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gc3VwZXIuX19yc3ViX18ob3RoZXIpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBzdXBlci5fX3JzdWJfXyhvdGhlcik7XG4gICAgfVxuXG4gICAgX19tdWxfXyhvdGhlcjogYW55KSB7XG4gICAgICAgIGlmIChnbG9iYWxfcGFyYW1ldGVycy5ldmFsdWF0ZSkge1xuICAgICAgICAgICAgaWYgKG90aGVyIGluc3RhbmNlb2YgSW50ZWdlcikge1xuICAgICAgICAgICAgICAgIHJldHVybiBuZXcgUmF0aW9uYWwodGhpcy5wICogb3RoZXIucCwgdGhpcy5xLCBpZ2NkKG90aGVyLnAsIHRoaXMucSkpO1xuICAgICAgICAgICAgfSBlbHNlIGlmIChvdGhlciBpbnN0YW5jZW9mIFJhdGlvbmFsKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIG5ldyBSYXRpb25hbCh0aGlzLnAgKiBvdGhlci5wLCB0aGlzLnEgKiBvdGhlci5xLCBpZ2NkKHRoaXMucCwgb3RoZXIucSkgKiBpZ2NkKHRoaXMucSwgb3RoZXIucCkpO1xuICAgICAgICAgICAgfSBlbHNlIGlmIChvdGhlciBpbnN0YW5jZW9mIEZsb2F0KSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIG90aGVyLl9fbXVsX18odGhpcyk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHJldHVybiBzdXBlci5fX211bF9fKG90aGVyKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gc3VwZXIuX19tdWxfXyhvdGhlcik7XG4gICAgfVxuXG4gICAgX19ybXVsX18ob3RoZXI6IGFueSkge1xuICAgICAgICByZXR1cm4gdGhpcy5fX211bF9fKG90aGVyKTtcbiAgICB9XG5cbiAgICBfX3RydWVkaXZfXyhvdGhlcjogYW55KSB7XG4gICAgICAgIGlmIChnbG9iYWxfcGFyYW1ldGVycy5ldmFsdWF0ZSkge1xuICAgICAgICAgICAgaWYgKG90aGVyIGluc3RhbmNlb2YgSW50ZWdlcikge1xuICAgICAgICAgICAgICAgIHJldHVybiBuZXcgUmF0aW9uYWwodGhpcy5wLCB0aGlzLnEgKiBvdGhlci5wLCBpZ2NkKHRoaXMucCwgb3RoZXIucCkpO1xuICAgICAgICAgICAgfSBlbHNlIGlmIChvdGhlciBpbnN0YW5jZW9mIFJhdGlvbmFsKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIG5ldyBSYXRpb25hbCh0aGlzLnAgKiBvdGhlci5xLCB0aGlzLnEgKiBvdGhlci5wLCBpZ2NkKHRoaXMucCwgb3RoZXIucCkgKiBpZ2NkKHRoaXMucSwgb3RoZXIucSkpO1xuICAgICAgICAgICAgfSBlbHNlIGlmIChvdGhlciBpbnN0YW5jZW9mIEZsb2F0KSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuX19tdWxfXyhvdGhlci5pbnZlcnNlKCkpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gc3VwZXIuX190cnVlZGl2X18ob3RoZXIpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBzdXBlci5fX3RydWVkaXZfXyhvdGhlcik7XG4gICAgfVxuXG4gICAgX19ydHJ1ZWRpdl9fKG90aGVyOiBhbnkpIHtcbiAgICAgICAgaWYgKGdsb2JhbF9wYXJhbWV0ZXJzLmV2YWx1YXRlKSB7XG4gICAgICAgICAgICBpZiAob3RoZXIgaW5zdGFuY2VvZiBJbnRlZ2VyKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIG5ldyBSYXRpb25hbChvdGhlci5wICogdGhpcy5xLCB0aGlzLnAsIGlnY2QodGhpcy5wLCBvdGhlci5wKSk7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKG90aGVyIGluc3RhbmNlb2YgUmF0aW9uYWwpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gbmV3IFJhdGlvbmFsKG90aGVyLnAgKiB0aGlzLnEsIG90aGVyLnEgKiB0aGlzLnAsIGlnY2QodGhpcy5wLCBvdGhlci5wKSAqIGlnY2QodGhpcy5xLCBvdGhlci5xKSk7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKG90aGVyIGluc3RhbmNlb2YgRmxvYXQpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gb3RoZXIuX19tdWxfXyhTLk9uZS5fX3RydWVkaXZfXyh0aGlzKSk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHJldHVybiBzdXBlci5fX3J0cnVlZGl2X18ob3RoZXIpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBzdXBlci5fX3J0cnVlZGl2X18ob3RoZXIpO1xuICAgIH1cblxuXG4gICAgX2V2YWxfcG93ZXIoZXhwdDogYW55KSB7XG4gICAgICAgIGlmIChleHB0IGluc3RhbmNlb2YgX051bWJlcl8pIHtcbiAgICAgICAgICAgIGlmIChleHB0IGluc3RhbmNlb2YgRmxvYXQpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5ldmFsX2V2YWxmKGV4cHQucHJlYykuX2V2YWxfcG93ZXIoZXhwdCk7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKGV4cHQgaW5zdGFuY2VvZiBJbnRlZ2VyKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIG5ldyBSYXRpb25hbCh0aGlzLnAgKiogZXhwdC5wLCB0aGlzLnEgKiogZXhwdC5wLCAxKTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoZXhwdCBpbnN0YW5jZW9mIFJhdGlvbmFsKSB7XG4gICAgICAgICAgICAgICAgbGV0IGludHBhcnQgPSBNYXRoLmZsb29yKGV4cHQucCAvIGV4cHQucSk7XG4gICAgICAgICAgICAgICAgaWYgKGludHBhcnQpIHtcbiAgICAgICAgICAgICAgICAgICAgaW50cGFydCsrO1xuICAgICAgICAgICAgICAgICAgICBjb25zdCByZW1mcmFjcGFydCA9IGludHBhcnQgKiBleHB0LnEgLSBleHB0LnA7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHJhdGZyYWNwYXJ0ID0gbmV3IFJhdGlvbmFsKHJlbWZyYWNwYXJ0LCBleHB0LnEpO1xuICAgICAgICAgICAgICAgICAgICBpZiAodGhpcy5wICE9PSAxKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbWF4LWxlblxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIG5ldyBJbnRlZ2VyKHRoaXMucCkuX2V2YWxfcG93ZXIoZXhwdCkuX19tdWxfXyhuZXcgSW50ZWdlcih0aGlzLnEpKS5fZXZhbF9wb3dlcihyYXRmcmFjcGFydCkuX19tdWxfXyhuZXcgUmF0aW9uYWwoMSwgdGhpcy5xICoqIGludHBhcnQsIDEpKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gbmV3IEludGVnZXIodGhpcy5xKS5fZXZhbF9wb3dlcihyYXRmcmFjcGFydCkuX19tdWxfXyhuZXcgUmF0aW9uYWwoMSwgdGhpcy5xICoqIGludHBhcnQsIDEpKTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBjb25zdCByZW1mcmFjcGFydCA9IGV4cHQucSAtIGV4cHQucDtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgcmF0ZnJhY3BhcnQgPSBuZXcgUmF0aW9uYWwocmVtZnJhY3BhcnQsIGV4cHQucSk7XG4gICAgICAgICAgICAgICAgICAgIGlmICh0aGlzLnAgIT09IDEpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBtYXgtbGVuXG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBwMSA9IG5ldyBJbnRlZ2VyKHRoaXMucCkuX2V2YWxfcG93ZXIoZXhwdCk7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBwMiA9IG5ldyBJbnRlZ2VyKHRoaXMucSkuX2V2YWxfcG93ZXIocmF0ZnJhY3BhcnQpO1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHAxLl9fbXVsX18ocDIpLl9fbXVsX18obmV3IFJhdGlvbmFsKDEsIHRoaXMucSwgMSkpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBuZXcgSW50ZWdlcih0aGlzLnEpLl9ldmFsX3Bvd2VyKHJhdGZyYWNwYXJ0KS5fX211bF9fKG5ldyBSYXRpb25hbCgxLCB0aGlzLnEsIDEpKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBhc19jb2VmZl9BZGQoKSB7XG4gICAgICAgIHJldHVybiBbdGhpcywgUy5aZXJvXTtcbiAgICB9XG5cbiAgICBfZmxvYXRfdmFsKHByZWM6IG51bWJlcik6IGFueSB7XG4gICAgICAgIGNvbnN0IGEgPSBuZXcgRGVjaW1hbCh0aGlzLnApO1xuICAgICAgICBjb25zdCBiID0gbmV3IERlY2ltYWwodGhpcy5xKTtcbiAgICAgICAgcmV0dXJuIG5ldyBGbG9hdChEZWNpbWFsLnNldCh7cHJlY2lzaW9uOiBwcmVjfSkuZGl2KGEsIGIpKTtcbiAgICB9XG4gICAgX2FzX251bWVyX2Rlbm9tKCkge1xuICAgICAgICByZXR1cm4gW25ldyBJbnRlZ2VyKHRoaXMucCksIG5ldyBJbnRlZ2VyKHRoaXMucSldO1xuICAgIH1cblxuICAgIGZhY3RvcnMobGltaXQ6IGFueSA9IHVuZGVmaW5lZCkge1xuICAgICAgICByZXR1cm4gZmFjdG9ycmF0KHRoaXMsIGxpbWl0KTtcbiAgICB9XG5cbiAgICBfZXZhbF9pc19uZWdhdGl2ZSgpIHtcbiAgICAgICAgaWYgKHRoaXMucCA8IDAgJiYgdGhpcy5xID4gMCkge1xuICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBfZXZhbF9pc19wb3NpdGl2ZSgpIHtcbiAgICAgICAgcmV0dXJuICF0aGlzLl9ldmFsX2lzX25lZ2F0aXZlKCk7XG4gICAgfVxuXG4gICAgX2V2YWxfaXNfb2RkKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5wICUgMiAhPT0gMDtcbiAgICB9XG5cbiAgICBfZXZhbF9pc19ldmVuKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5wICUgMiA9PT0gMDtcbiAgICB9XG5cbiAgICBfZXZhbF9pc19maW5pdGUoKSB7XG4gICAgICAgIHJldHVybiAhKHRoaXMucCA9PT0gUy5JbmZpbml0eSB8fCB0aGlzLnAgPT09IFMuTmVnYXRpdmVJbmZpbml0eSk7XG4gICAgfVxuXG4gICAgZXEob3RoZXI6IFJhdGlvbmFsKSB7XG4gICAgICAgIHJldHVybiB0aGlzLnAgPT09IG90aGVyLnAgJiYgdGhpcy5xID09PSBvdGhlci5xO1xuICAgIH1cblxuICAgIHRvU3RyaW5nKCkge1xuICAgICAgICByZXR1cm4gU3RyaW5nKHRoaXMucCkgKyBcIi9cIiArIFN0cmluZyh0aGlzLnEpXG4gICAgfVxufTtcblxuLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5ldy1jYXBcbk1hbmFnZWRQcm9wZXJ0aWVzLnJlZ2lzdGVyKFJhdGlvbmFsKTtcblxuY2xhc3MgSW50ZWdlciBleHRlbmRzIFJhdGlvbmFsIHtcbiAgICAvKlxuICAgIFJlcHJlc2VudHMgaW50ZWdlciBudW1iZXJzIG9mIGFueSBzaXplLlxuICAgIEV4YW1wbGVzXG4gICAgPT09PT09PT1cbiAgICA+Pj4gZnJvbSBzeW1weSBpbXBvcnQgSW50ZWdlclxuICAgID4+PiBJbnRlZ2VyKDMpXG4gICAgM1xuICAgIElmIGEgZmxvYXQgb3IgYSByYXRpb25hbCBpcyBwYXNzZWQgdG8gSW50ZWdlciwgdGhlIGZyYWN0aW9uYWwgcGFydFxuICAgIHdpbGwgYmUgZGlzY2FyZGVkOyB0aGUgZWZmZWN0IGlzIG9mIHJvdW5kaW5nIHRvd2FyZCB6ZXJvLlxuICAgID4+PiBJbnRlZ2VyKDMuOClcbiAgICAzXG4gICAgPj4+IEludGVnZXIoLTMuOClcbiAgICAtM1xuICAgIEEgc3RyaW5nIGlzIGFjY2VwdGFibGUgaW5wdXQgaWYgaXQgY2FuIGJlIHBhcnNlZCBhcyBhbiBpbnRlZ2VyOlxuICAgID4+PiBJbnRlZ2VyKFwiOVwiICogMjApXG4gICAgOTk5OTk5OTk5OTk5OTk5OTk5OTlcbiAgICBJdCBpcyByYXJlbHkgbmVlZGVkIHRvIGV4cGxpY2l0bHkgaW5zdGFudGlhdGUgYW4gSW50ZWdlciwgYmVjYXVzZVxuICAgIFB5dGhvbiBpbnRlZ2VycyBhcmUgYXV0b21hdGljYWxseSBjb252ZXJ0ZWQgdG8gSW50ZWdlciB3aGVuIHRoZXlcbiAgICBhcmUgdXNlZCBpbiBTeW1QeSBleHByZXNzaW9ucy5cbiAgICBcIlwiXCJcbiAgICAqL1xuICAgIHN0YXRpYyBpc19pbnRlZ2VyID0gdHJ1ZTtcbiAgICBzdGF0aWMgaXNfSW50ZWdlciA9IHRydWU7XG4gICAgX19zbG90c19fOiBhbnlbXSA9IFtdO1xuICAgIGNvbnN0cnVjdG9yKHA6IG51bWJlcikge1xuICAgICAgICBzdXBlcihwLCB1bmRlZmluZWQsIHVuZGVmaW5lZCwgZmFsc2UpO1xuICAgICAgICB0aGlzLnAgPSBwO1xuICAgICAgICBpZiAocCA9PT0gMSkge1xuICAgICAgICAgICAgcmV0dXJuIFMuT25lO1xuICAgICAgICB9IGVsc2UgaWYgKHAgPT09IDApIHtcbiAgICAgICAgICAgIHJldHVybiBTLlplcm87XG4gICAgICAgIH0gZWxzZSBpZiAocCA9PT0gLTEpIHtcbiAgICAgICAgICAgIHJldHVybiBTLk5lZ2F0aXZlT25lO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgZmFjdG9ycyhsaW1pdDogYW55ID0gdW5kZWZpbmVkKSB7XG4gICAgICAgIHJldHVybiBmYWN0b3JpbnQodGhpcy5wLCBsaW1pdCk7XG4gICAgfVxuXG4gICAgX19hZGRfXyhvdGhlcjogYW55KTogYW55IHtcbiAgICAgICAgaWYgKGdsb2JhbF9wYXJhbWV0ZXJzLmV2YWx1YXRlKSB7XG4gICAgICAgICAgICBpZiAoTnVtYmVyLmlzSW50ZWdlcihvdGhlcikpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gbmV3IEludGVnZXIodGhpcy5wICsgb3RoZXIpO1xuICAgICAgICAgICAgfSBlbHNlIGlmIChvdGhlciBpbnN0YW5jZW9mIEludGVnZXIpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gbmV3IEludGVnZXIodGhpcy5wICsgb3RoZXIucCk7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKG90aGVyIGluc3RhbmNlb2YgUmF0aW9uYWwpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gbmV3IFJhdGlvbmFsKHRoaXMucCAqIG90aGVyLnEgKyBvdGhlci5wLCBvdGhlci5xLCAxKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHN1cGVyLl9fYWRkX18ob3RoZXIpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuIG5ldyBBZGQodHJ1ZSwgdHJ1ZSwgdGhpcywgb3RoZXIpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgX19yYWRkX18ob3RoZXI6IGFueSk6IGFueSB7XG4gICAgICAgIGlmIChnbG9iYWxfcGFyYW1ldGVycy5ldmFsdWF0ZSkge1xuICAgICAgICAgICAgaWYgKE51bWJlci5pc0ludGVnZXIob3RoZXIpKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIG5ldyBJbnRlZ2VyKG90aGVyICsgdGhpcy5wKTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAob3RoZXIgaW5zdGFuY2VvZiBSYXRpb25hbCkge1xuICAgICAgICAgICAgICAgIHJldHVybiBuZXcgUmF0aW9uYWwob3RoZXIucCArIHRoaXMucCAqIG90aGVyLnEsIG90aGVyLnEsIDEpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gc3VwZXIuX19yYWRkX18ob3RoZXIpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuIHN1cGVyLl9fcmFkZF9fKG90aGVyKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIF9fc3ViX18ob3RoZXI6IGFueSk6IGFueSB7XG4gICAgICAgIGlmIChnbG9iYWxfcGFyYW1ldGVycy5ldmFsdWF0ZSkge1xuICAgICAgICAgICAgaWYgKE51bWJlci5pc0ludGVnZXIob3RoZXIpKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIG5ldyBJbnRlZ2VyKHRoaXMucCAtIG90aGVyKTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAob3RoZXIgaW5zdGFuY2VvZiBJbnRlZ2VyKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIG5ldyBJbnRlZ2VyKHRoaXMucCAtIG90aGVyLnApO1xuICAgICAgICAgICAgfSBlbHNlIGlmIChvdGhlciBpbnN0YW5jZW9mIFJhdGlvbmFsKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIG5ldyBSYXRpb25hbCh0aGlzLnAgKiBvdGhlci5xIC0gb3RoZXIucCwgb3RoZXIucSwgMSk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHJldHVybiBzdXBlci5fX3N1Yl9fKG90aGVyKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiBzdXBlci5fX3N1Yl9fKG90aGVyKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIF9fcnN1Yl9fKG90aGVyOiBhbnkpOiBhbnkge1xuICAgICAgICBpZiAoZ2xvYmFsX3BhcmFtZXRlcnMuZXZhbHVhdGUpIHtcbiAgICAgICAgICAgIGlmIChOdW1iZXIuaXNJbnRlZ2VyKG90aGVyKSkge1xuICAgICAgICAgICAgICAgIHJldHVybiBuZXcgSW50ZWdlcih0aGlzLnAgLSBvdGhlcik7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKG90aGVyIGluc3RhbmNlb2YgUmF0aW9uYWwpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gbmV3IFJhdGlvbmFsKG90aGVyLnAgLSB0aGlzLnAgKiBvdGhlci5xLCBvdGhlci5xLCAxKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHN1cGVyLl9fcnN1Yl9fKG90aGVyKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiBzdXBlci5fX3JzdWJfXyhvdGhlcik7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBfX211bF9fKG90aGVyOiBhbnkpOiBhbnkge1xuICAgICAgICBpZiAoZ2xvYmFsX3BhcmFtZXRlcnMuZXZhbHVhdGUpIHtcbiAgICAgICAgICAgIGlmIChOdW1iZXIuaXNJbnRlZ2VyKG90aGVyKSApIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gbmV3IEludGVnZXIodGhpcy5wICogb3RoZXIpO1xuICAgICAgICAgICAgfSBlbHNlIGlmIChvdGhlciBpbnN0YW5jZW9mIEludGVnZXIpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gbmV3IEludGVnZXIodGhpcy5wICogb3RoZXIucCk7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKG90aGVyIGluc3RhbmNlb2YgUmF0aW9uYWwpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gbmV3IFJhdGlvbmFsKHRoaXMucCAqIG90aGVyLnAsIG90aGVyLnEsIGlnY2QodGhpcy5wLCBvdGhlci5xKSk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHJldHVybiBzdXBlci5fX211bF9fKG90aGVyKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiBzdXBlci5fX211bF9fKG90aGVyKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIF9fcm11bF9fKG90aGVyOiBhbnkpOiBhbnkge1xuICAgICAgICBpZiAoZ2xvYmFsX3BhcmFtZXRlcnMuZXZhbHVhdGUpIHtcbiAgICAgICAgICAgIGlmIChOdW1iZXIuaXNJbnRlZ2VyKG90aGVyKSApIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gbmV3IEludGVnZXIob3RoZXIgKiB0aGlzLnApO1xuICAgICAgICAgICAgfSBlbHNlIGlmIChvdGhlciBpbnN0YW5jZW9mIFJhdGlvbmFsKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIG5ldyBSYXRpb25hbChvdGhlci5wICogdGhpcy5wLCBvdGhlci5xLCBpZ2NkKHRoaXMucCwgb3RoZXIucSkpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gc3VwZXIuX19ybXVsX18ob3RoZXIpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuIHN1cGVyLl9fcm11bF9fKG90aGVyKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIF9ldmFsX2lzX25lZ2F0aXZlKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5wIDwgMDtcbiAgICB9XG5cbiAgICBfZXZhbF9pc19wb3NpdGl2ZSgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMucCA+IDA7XG4gICAgfVxuXG4gICAgX2V2YWxfaXNfb2RkKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5wICUgMiA9PT0gMTtcbiAgICB9XG5cbiAgICBfZXZhbF9wb3dlcihleHB0OiBhbnkpOiBhbnkge1xuICAgICAgICBpZiAoZXhwdCA9PT0gUy5JbmZpbml0eSkge1xuICAgICAgICAgICAgaWYgKHRoaXMucCA+IDEpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gUy5JbmZpbml0eTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBpZiAoZXhwdCA9PT0gUy5OZWdhdGl2ZUluZmluaXR5KSB7XG4gICAgICAgICAgICByZXR1cm4gbmV3IFJhdGlvbmFsKDEsIHRoaXMsIDEpLl9ldmFsX3Bvd2VyKFMuSW5maW5pdHkpO1xuICAgICAgICB9XG4gICAgICAgIGlmICghKGV4cHQgaW5zdGFuY2VvZiBfTnVtYmVyXykpIHtcbiAgICAgICAgICAgIGlmICh0aGlzLmlzX25lZ2F0aXZlICYmIGV4cHQuaXNfZXZlbikge1xuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLl9fbXVsX18oUy5OZWdhdGl2ZU9uZSkuX2V2YWxfcG93ZXIoZXhwdCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGV4cHQgaW5zdGFuY2VvZiBGbG9hdCkge1xuICAgICAgICAgICAgcmV0dXJuIHN1cGVyLl9ldmFsX3Bvd2VyKGV4cHQpO1xuICAgICAgICB9XG4gICAgICAgIGlmICghKGV4cHQgaW5zdGFuY2VvZiBSYXRpb25hbCkpIHtcbiAgICAgICAgICAgIHJldHVybiB1bmRlZmluZWQ7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGV4cHQuaXNfbmVnYXRpdmUoKSkge1xuICAgICAgICAgICAgY29uc3QgbmUgPSBleHB0Ll9fbXVsX18oUy5OZWdhdGl2ZU9uZSk7XG4gICAgICAgICAgICBpZiAodGhpcy5pc19uZWdhdGl2ZSgpKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIFMuTmVnYXRpdmVPbmUuX2V2YWxfcG93ZXIoZXhwdCkuX19tdWxfXyhuZXcgUmF0aW9uYWwoMSwgdGhpcy5fX211bF9fKFMuTmVnYXRpdmVPbmUpLCAxKSkuX2V2YWxfcG93ZXIobmUpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gbmV3IFJhdGlvbmFsKDEsIHRoaXMucCwgMSkuX2V2YWxfcG93ZXIobmUpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGNvbnN0IFt4LCB4ZXhhY3RdID0gaW50X250aHJvb3QoTWF0aC5hYnModGhpcy5wKSwgZXhwdC5xKTtcbiAgICAgICAgaWYgKHhleGFjdCkge1xuICAgICAgICAgICAgbGV0IHJlc3VsdCA9IG5ldyBJbnRlZ2VyKCh4IGFzIG51bWJlcikqKk1hdGguYWJzKGV4cHQucCkpO1xuICAgICAgICAgICAgaWYgKHRoaXMuaXNfbmVnYXRpdmUoKSA9PSB0cnVlKSB7XG4gICAgICAgICAgICAgICAgcmVzdWx0ID0gcmVzdWx0Ll9fbXVsX18oUy5OZWdhdGl2ZU9uZS5fZXZhbF9wb3dlcihleHB0KSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gcmVzdWx0O1xuICAgICAgICB9XG4gICAgICAgIGNvbnN0IGJfcG9zID0gTWF0aC5hYnModGhpcy5wKTtcbiAgICAgICAgY29uc3QgcCA9IHBlcmZlY3RfcG93ZXIoYl9wb3MpO1xuICAgICAgICBsZXQgZGljdCA9IG5ldyBIYXNoRGljdCgpO1xuICAgICAgICBpZiAocCAhPT0gZmFsc2UpIHtcbiAgICAgICAgICAgIGRpY3QuYWRkKHBbMF0sIHBbMV0pO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgZGljdCA9IG5ldyBJbnRlZ2VyKGJfcG9zKS5mYWN0b3JzKDIqKjE1KTtcbiAgICAgICAgfVxuXG4gICAgICAgIGxldCBvdXRfaW50ID0gMTtcbiAgICAgICAgbGV0IG91dF9yYWQ6IEludGVnZXIgPSBTLk9uZTtcbiAgICAgICAgbGV0IHNxcl9pbnQgPSAxO1xuICAgICAgICBsZXQgc3FyX2djZCA9IDA7XG4gICAgICAgIGNvbnN0IHNxcl9kaWN0ID0gbmV3IEhhc2hEaWN0KCk7XG4gICAgICAgIGxldCBwcmltZTsgbGV0IGV4cG9uZW50O1xuICAgICAgICBmb3IgKFtwcmltZSwgZXhwb25lbnRdIG9mIGRpY3QuZW50cmllcygpKSB7XG4gICAgICAgICAgICBleHBvbmVudCAqPSBleHB0LnA7XG4gICAgICAgICAgICBjb25zdCBbZGl2X2UsIGRpdl9tXSA9IGRpdm1vZChleHBvbmVudCwgZXhwdC5xKTtcbiAgICAgICAgICAgIGlmIChkaXZfZSA+IDApIHtcbiAgICAgICAgICAgICAgICBvdXRfaW50ICo9IHByaW1lKipkaXZfZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChkaXZfbSA+IDApIHtcbiAgICAgICAgICAgICAgICBjb25zdCBnID0gaWdjZChkaXZfbSwgZXhwdC5xKTtcbiAgICAgICAgICAgICAgICBpZiAoZyAhPT0gMSkge1xuICAgICAgICAgICAgICAgICAgICBvdXRfcmFkID0gb3V0X3JhZC5fX211bF9fKG5ldyBQb3cocHJpbWUsIG5ldyBSYXRpb25hbChNYXRoLmZsb29yKGRpdl9tL2cpLCBNYXRoLmZsb29yKGV4cHQucS9nKSwgMSkpKTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBzcXJfZGljdC5hZGQocHJpbWUsIGRpdl9tKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgZm9yIChjb25zdCBbLCBleF0gb2Ygc3FyX2RpY3QuZW50cmllcygpKSB7XG4gICAgICAgICAgICBpZiAoc3FyX2djZCA9PT0gMCkge1xuICAgICAgICAgICAgICAgIHNxcl9nY2QgPSBleDtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgc3FyX2djZCA9IGlnY2Qoc3FyX2djZCwgZXgpO1xuICAgICAgICAgICAgICAgIGlmIChzcXJfZ2NkID09PSAxKSB7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBmb3IgKGNvbnN0IFtrLCB2XSBvZiBzcXJfZGljdC5lbnRyaWVzKCkpIHtcbiAgICAgICAgICAgIHNxcl9pbnQgKj0gayoqKE1hdGguZmxvb3Iodi9zcXJfZ2NkKSk7XG4gICAgICAgIH1cbiAgICAgICAgbGV0IHJlc3VsdDogYW55O1xuICAgICAgICBpZiAoc3FyX2ludCA9PT0gYl9wb3MgJiYgb3V0X2ludCA9PT0gMSAmJiBvdXRfcmFkID09PSBTLk9uZSkge1xuICAgICAgICAgICAgcmVzdWx0ID0gdW5kZWZpbmVkO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgY29uc3QgcDEgPSBvdXRfcmFkLl9fbXVsX18obmV3IEludGVnZXIob3V0X2ludCkpO1xuICAgICAgICAgICAgY29uc3QgcDIgPSBuZXcgUG93KG5ldyBJbnRlZ2VyKHNxcl9pbnQpLCBuZXcgUmF0aW9uYWwoc3FyX2djZCwgZXhwdC5xKSk7XG4gICAgICAgICAgICByZXN1bHQgPSBuZXcgTXVsKHRydWUsIHRydWUsIHAxLCBwMik7XG4gICAgICAgICAgICBpZiAodGhpcy5pc19uZWdhdGl2ZSgpKSB7XG4gICAgICAgICAgICAgICAgcmVzdWx0ID0gcmVzdWx0Ll9fbXVsX18obmV3IFBvdyhTLk5lZ2F0aXZlT25lLCBleHB0KSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICB9XG5cbiAgICB0b1N0cmluZygpIHtcbiAgICAgICAgcmV0dXJuIFN0cmluZyh0aGlzLnApO1xuICAgIH1cbn07XG5cbk1hbmFnZWRQcm9wZXJ0aWVzLnJlZ2lzdGVyKEludGVnZXIpO1xuXG5cbmNsYXNzIEludGVnZXJDb25zdGFudCBleHRlbmRzIEludGVnZXIge1xuICAgIF9fc2xvdHNfXzogYW55W10gPSBbXTtcbn07XG5cbk1hbmFnZWRQcm9wZXJ0aWVzLnJlZ2lzdGVyKEludGVnZXJDb25zdGFudCk7XG5cbmNsYXNzIFplcm8gZXh0ZW5kcyBJbnRlZ2VyQ29uc3RhbnQge1xuICAgIC8qXG4gICAgVGhlIG51bWJlciB6ZXJvLlxuICAgIFplcm8gaXMgYSBzaW5nbGV0b24sIGFuZCBjYW4gYmUgYWNjZXNzZWQgYnkgYGBTLlplcm9gYFxuICAgIEV4YW1wbGVzXG4gICAgPT09PT09PT1cbiAgICA+Pj4gZnJvbSBzeW1weSBpbXBvcnQgUywgSW50ZWdlclxuICAgID4+PiBJbnRlZ2VyKDApIGlzIFMuWmVyb1xuICAgIFRydWVcbiAgICA+Pj4gMS9TLlplcm9cbiAgICB6b29cbiAgICBSZWZlcmVuY2VzXG4gICAgPT09PT09PT09PVxuICAgIC4uIFsxXSBodHRwczovL2VuLndpa2lwZWRpYS5vcmcvd2lraS9aZXJvXG4gICAgKi9cbiAgICBfX3Nsb3RzX186IGFueVtdID0gW107XG4gICAgc3RhdGljIGlzX3Bvc2l0aXZlID0gZmFsc2U7XG4gICAgc3RhdGljIHN0YXRpYyA9IGZhbHNlO1xuICAgIHN0YXRpYyBpc196ZXJvID0gdHJ1ZTtcbiAgICBzdGF0aWMgaXNfbnVtYmVyID0gdHJ1ZTtcbiAgICBzdGF0aWMgaXNfY29tcGFyYWJsZSA9IHRydWU7XG4gICAgY29uc3RydWN0b3IoKSB7XG4gICAgICAgIHN1cGVyKDApO1xuICAgIH1cbn07XG5cbk1hbmFnZWRQcm9wZXJ0aWVzLnJlZ2lzdGVyKFplcm8pO1xuXG5cbmNsYXNzIE9uZSBleHRlbmRzIEludGVnZXJDb25zdGFudCB7XG4gICAgLypcbiAgICBUaGUgbnVtYmVyIG9uZS5cbiAgICBPbmUgaXMgYSBzaW5nbGV0b24sIGFuZCBjYW4gYmUgYWNjZXNzZWQgYnkgYGBTLk9uZWBgLlxuICAgIEV4YW1wbGVzXG4gICAgPT09PT09PT1cbiAgICA+Pj4gZnJvbSBzeW1weSBpbXBvcnQgUywgSW50ZWdlclxuICAgID4+PiBJbnRlZ2VyKDEpIGlzIFMuT25lXG4gICAgVHJ1ZVxuICAgIFJlZmVyZW5jZXNcbiAgICA9PT09PT09PT09XG4gICAgLi4gWzFdIGh0dHBzOi8vZW4ud2lraXBlZGlhLm9yZy93aWtpLzFfJTI4bnVtYmVyJTI5XG4gICAgKi9cbiAgICBzdGF0aWMgaXNfbnVtYmVyID0gdHJ1ZTtcbiAgICBzdGF0aWMgaXNfcG9zaXRpdmUgPSB0cnVlO1xuICAgIHN0YXRpYyBpc196ZXJvID0gZmFsc2U7XG4gICAgX19zbG90c19fOiBhbnlbXSA9IFtdO1xuICAgIGNvbnN0cnVjdG9yKCkge1xuICAgICAgICBzdXBlcigxKTtcbiAgICB9XG59O1xuXG5NYW5hZ2VkUHJvcGVydGllcy5yZWdpc3RlcihPbmUpO1xuXG5cbmNsYXNzIE5lZ2F0aXZlT25lIGV4dGVuZHMgSW50ZWdlckNvbnN0YW50IHtcbiAgICAvKlxuICAgIFRoZSBudW1iZXIgbmVnYXRpdmUgb25lLlxuICAgIE5lZ2F0aXZlT25lIGlzIGEgc2luZ2xldG9uLCBhbmQgY2FuIGJlIGFjY2Vzc2VkIGJ5IGBgUy5OZWdhdGl2ZU9uZWBgLlxuICAgIEV4YW1wbGVzXG4gICAgPT09PT09PT1cbiAgICA+Pj4gZnJvbSBzeW1weSBpbXBvcnQgUywgSW50ZWdlclxuICAgID4+PiBJbnRlZ2VyKC0xKSBpcyBTLk5lZ2F0aXZlT25lXG4gICAgVHJ1ZVxuICAgIFNlZSBBbHNvXG4gICAgPT09PT09PT1cbiAgICBPbmVcbiAgICBSZWZlcmVuY2VzXG4gICAgPT09PT09PT09PVxuICAgIC4uIFsxXSBodHRwczovL2VuLndpa2lwZWRpYS5vcmcvd2lraS8lRTIlODglOTIxXyUyOG51bWJlciUyOVxuICAgICovXG4gICAgc3RhdGljIGlzX251bWJlciA9IHRydWU7XG4gICAgX19zbG90c19fOiBhbnlbXSA9IFtdO1xuICAgIGNvbnN0cnVjdG9yKCkge1xuICAgICAgICBzdXBlcigtMSk7XG4gICAgfVxuXG4gICAgX2V2YWxfcG93ZXIoZXhwdDogYW55KSB7XG4gICAgICAgIGlmIChleHB0LmlzX29kZCkge1xuICAgICAgICAgICAgcmV0dXJuIFMuTmVnYXRpdmVPbmU7XG4gICAgICAgIH0gZWxzZSBpZiAoZXhwdC5pc19ldmVuKSB7XG4gICAgICAgICAgICByZXR1cm4gUy5PbmU7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGV4cHQgaW5zdGFuY2VvZiBfTnVtYmVyXykge1xuICAgICAgICAgICAgaWYgKGV4cHQgaW5zdGFuY2VvZiBGbG9hdCkge1xuICAgICAgICAgICAgICAgIHJldHVybiBuZXcgRmxvYXQoLTEuMCkuX2V2YWxfcG93ZXIoZXhwdCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoZXhwdCA9PT0gUy5OYU4pIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gUy5OYU47XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoZXhwdCA9PT0gUy5JbmZpbml0eSB8fCBleHB0ID09PSBTLk5lZ2F0aXZlSW5maW5pdHkpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gUy5OYU47XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuO1xuICAgIH1cbn07XG5cbk1hbmFnZWRQcm9wZXJ0aWVzLnJlZ2lzdGVyKE5lZ2F0aXZlT25lKTtcblxuY2xhc3MgTmFOIGV4dGVuZHMgX051bWJlcl8ge1xuICAgIC8qXG4gICAgTm90IGEgTnVtYmVyLlxuICAgIEV4cGxhbmF0aW9uXG4gICAgPT09PT09PT09PT1cbiAgICBUaGlzIHNlcnZlcyBhcyBhIHBsYWNlIGhvbGRlciBmb3IgbnVtZXJpYyB2YWx1ZXMgdGhhdCBhcmUgaW5kZXRlcm1pbmF0ZS5cbiAgICBNb3N0IG9wZXJhdGlvbnMgb24gTmFOLCBwcm9kdWNlIGFub3RoZXIgTmFOLiAgTW9zdCBpbmRldGVybWluYXRlIGZvcm1zLFxuICAgIHN1Y2ggYXMgYGAwLzBgYCBvciBgYG9vIC0gb29gIHByb2R1Y2UgTmFOLiAgVHdvIGV4Y2VwdGlvbnMgYXJlIGBgMCoqMGBgXG4gICAgYW5kIGBgb28qKjBgYCwgd2hpY2ggYWxsIHByb2R1Y2UgYGAxYGAgKHRoaXMgaXMgY29uc2lzdGVudCB3aXRoIFB5dGhvbidzXG4gICAgZmxvYXQpLlxuICAgIE5hTiBpcyBsb29zZWx5IHJlbGF0ZWQgdG8gZmxvYXRpbmcgcG9pbnQgbmFuLCB3aGljaCBpcyBkZWZpbmVkIGluIHRoZVxuICAgIElFRUUgNzU0IGZsb2F0aW5nIHBvaW50IHN0YW5kYXJkLCBhbmQgY29ycmVzcG9uZHMgdG8gdGhlIFB5dGhvblxuICAgIGBgZmxvYXQoJ25hbicpYGAuICBEaWZmZXJlbmNlcyBhcmUgbm90ZWQgYmVsb3cuXG4gICAgTmFOIGlzIG1hdGhlbWF0aWNhbGx5IG5vdCBlcXVhbCB0byBhbnl0aGluZyBlbHNlLCBldmVuIE5hTiBpdHNlbGYuICBUaGlzXG4gICAgZXhwbGFpbnMgdGhlIGluaXRpYWxseSBjb3VudGVyLWludHVpdGl2ZSByZXN1bHRzIHdpdGggYGBFcWBgIGFuZCBgYD09YGAgaW5cbiAgICB0aGUgZXhhbXBsZXMgYmVsb3cuXG4gICAgTmFOIGlzIG5vdCBjb21wYXJhYmxlIHNvIGluZXF1YWxpdGllcyByYWlzZSBhIFR5cGVFcnJvci4gIFRoaXMgaXMgaW5cbiAgICBjb250cmFzdCB3aXRoIGZsb2F0aW5nIHBvaW50IG5hbiB3aGVyZSBhbGwgaW5lcXVhbGl0aWVzIGFyZSBmYWxzZS5cbiAgICBOYU4gaXMgYSBzaW5nbGV0b24sIGFuZCBjYW4gYmUgYWNjZXNzZWQgYnkgYGBTLk5hTmBgLCBvciBjYW4gYmUgaW1wb3J0ZWRcbiAgICBhcyBgYG5hbmBgLlxuICAgIEV4YW1wbGVzXG4gICAgPT09PT09PT1cbiAgICA+Pj4gZnJvbSBzeW1weSBpbXBvcnQgbmFuLCBTLCBvbywgRXFcbiAgICA+Pj4gbmFuIGlzIFMuTmFOXG4gICAgVHJ1ZVxuICAgID4+PiBvbyAtIG9vXG4gICAgbmFuXG4gICAgPj4+IG5hbiArIDFcbiAgICBuYW5cbiAgICA+Pj4gRXEobmFuLCBuYW4pICAgIyBtYXRoZW1hdGljYWwgZXF1YWxpdHlcbiAgICBGYWxzZVxuICAgID4+PiBuYW4gPT0gbmFuICAgICAjIHN0cnVjdHVyYWwgZXF1YWxpdHlcbiAgICBUcnVlXG4gICAgUmVmZXJlbmNlc1xuICAgID09PT09PT09PT1cbiAgICAuLiBbMV0gaHR0cHM6Ly9lbi53aWtpcGVkaWEub3JnL3dpa2kvTmFOXG4gICAgKi9cbiAgICBzdGF0aWMgaXNfY29tbXV0YXRpdmUgPSB0cnVlO1xuICAgIHN0YXRpYyBpc19leHRlbmRlZF9yZWFsOiBhbnkgPSB1bmRlZmluZWQ7XG4gICAgc3RhdGljIGlzX3JlYWw6IGFueSA9IHVuZGVmaW5lZDtcbiAgICBzdGF0aWMgaXNfcmF0aW9uYWw6IGFueSA9IHVuZGVmaW5lZDtcbiAgICBzdGF0aWMgaXNfYWxnZWJyYWljOiBhbnkgPSB1bmRlZmluZWQ7XG4gICAgc3RhdGljIGlzX3RyYW5zY2VuZGVudGFsOiBhbnkgPSB1bmRlZmluZWQ7XG4gICAgc3RhdGljIGlzX2ludGVnZXI6IGFueSA9IHVuZGVmaW5lZDtcbiAgICBzdGF0aWMgaXNfY29tcGFyYWJsZSA9IGZhbHNlO1xuICAgIHN0YXRpYyBpc19maW5pdGU6IGFueSA9IHVuZGVmaW5lZDtcbiAgICBzdGF0aWMgaXNfemVybzogYW55ID0gdW5kZWZpbmVkO1xuICAgIHN0YXRpYyBpc19wcmltZTogYW55ID0gdW5kZWZpbmVkO1xuICAgIHN0YXRpYyBpc19wb3NpdGl2ZTogYW55ID0gdW5kZWZpbmVkO1xuICAgIHN0YXRpYyBpc19uZWdhdGl2ZTogYW55ID0gdW5kZWZpbmVkO1xuICAgIHN0YXRpYyBpc19udW1iZXIgPSB0cnVlO1xuICAgIF9fc2xvdHNfXzogYW55ID0gW107XG4gICAgdG9TdHJpbmcoKSB7XG4gICAgICAgIHJldHVybiBcIk5BTlwiO1xuICAgIH1cbn1cblxuTWFuYWdlZFByb3BlcnRpZXMucmVnaXN0ZXIoTmFOKTtcblxuLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5ldy1jYXBcbmNsYXNzIENvbXBsZXhJbmZpbml0eSBleHRlbmRzIF9BdG9taWNFeHByIHtcbiAgICAvKlxuICAgIENvbXBsZXggaW5maW5pdHkuXG4gICAgRXhwbGFuYXRpb25cbiAgICA9PT09PT09PT09PVxuICAgIEluIGNvbXBsZXggYW5hbHlzaXMgdGhlIHN5bWJvbCBgXFx0aWxkZVxcaW5mdHlgLCBjYWxsZWQgXCJjb21wbGV4XG4gICAgaW5maW5pdHlcIiwgcmVwcmVzZW50cyBhIHF1YW50aXR5IHdpdGggaW5maW5pdGUgbWFnbml0dWRlLCBidXRcbiAgICB1bmRldGVybWluZWQgY29tcGxleCBwaGFzZS5cbiAgICBDb21wbGV4SW5maW5pdHkgaXMgYSBzaW5nbGV0b24sIGFuZCBjYW4gYmUgYWNjZXNzZWQgYnlcbiAgICBgYFMuQ29tcGxleEluZmluaXR5YGAsIG9yIGNhbiBiZSBpbXBvcnRlZCBhcyBgYHpvb2BgLlxuICAgIEV4YW1wbGVzXG4gICAgPT09PT09PT1cbiAgICA+Pj4gZnJvbSBzeW1weSBpbXBvcnQgem9vXG4gICAgPj4+IHpvbyArIDQyXG4gICAgem9vXG4gICAgPj4+IDQyL3pvb1xuICAgIDBcbiAgICA+Pj4gem9vICsgem9vXG4gICAgbmFuXG4gICAgPj4+IHpvbyp6b29cbiAgICB6b29cbiAgICBTZWUgQWxzb1xuICAgID09PT09PT09XG4gICAgSW5maW5pdHlcbiAgICAqL1xuICAgIHN0YXRpYyBpc19jb21tdXRhdGl2ZSA9IHRydWU7XG4gICAgc3RhdGljIGlzX2luZmluaXRlID0gdHJ1ZTtcbiAgICBzdGF0aWMgaXNfbnVtYmVyID0gdHJ1ZTtcbiAgICBzdGF0aWMgaXNfcHJpbWUgPSBmYWxzZTtcbiAgICBzdGF0aWMgaXNfY29tcGxleCA9IGZhbHNlO1xuICAgIHN0YXRpYyBpc19leHRlbmRlZF9yZWFsID0gZmFsc2U7XG4gICAga2luZCA9IE51bWJlcktpbmQ7XG4gICAgX19zbG90c19fOiBhbnkgPSBbXTtcblxuICAgIGNvbnN0cnVjdG9yKCkge1xuICAgICAgICBzdXBlcigpO1xuICAgIH1cblxuICAgIHRvU3RyaW5nKCkge1xuICAgICAgICByZXR1cm4gXCJDb21wbGV4SW5maW5pdHlcIjtcbiAgICB9XG59XG5cbk1hbmFnZWRQcm9wZXJ0aWVzLnJlZ2lzdGVyKENvbXBsZXhJbmZpbml0eSk7XG5cbmNsYXNzIEluZmluaXR5IGV4dGVuZHMgX051bWJlcl8ge1xuICAgIC8qXG4gICAgUG9zaXRpdmUgaW5maW5pdGUgcXVhbnRpdHkuXG4gICAgRXhwbGFuYXRpb25cbiAgICA9PT09PT09PT09PVxuICAgIEluIHJlYWwgYW5hbHlzaXMgdGhlIHN5bWJvbCBgXFxpbmZ0eWAgZGVub3RlcyBhbiB1bmJvdW5kZWRcbiAgICBsaW1pdDogYHhcXHRvXFxpbmZ0eWAgbWVhbnMgdGhhdCBgeGAgZ3Jvd3Mgd2l0aG91dCBib3VuZC5cbiAgICBJbmZpbml0eSBpcyBvZnRlbiB1c2VkIG5vdCBvbmx5IHRvIGRlZmluZSBhIGxpbWl0IGJ1dCBhcyBhIHZhbHVlXG4gICAgaW4gdGhlIGFmZmluZWx5IGV4dGVuZGVkIHJlYWwgbnVtYmVyIHN5c3RlbS4gIFBvaW50cyBsYWJlbGVkIGArXFxpbmZ0eWBcbiAgICBhbmQgYC1cXGluZnR5YCBjYW4gYmUgYWRkZWQgdG8gdGhlIHRvcG9sb2dpY2FsIHNwYWNlIG9mIHRoZSByZWFsIG51bWJlcnMsXG4gICAgcHJvZHVjaW5nIHRoZSB0d28tcG9pbnQgY29tcGFjdGlmaWNhdGlvbiBvZiB0aGUgcmVhbCBudW1iZXJzLiAgQWRkaW5nXG4gICAgYWxnZWJyYWljIHByb3BlcnRpZXMgdG8gdGhpcyBnaXZlcyB1cyB0aGUgZXh0ZW5kZWQgcmVhbCBudW1iZXJzLlxuICAgIEluZmluaXR5IGlzIGEgc2luZ2xldG9uLCBhbmQgY2FuIGJlIGFjY2Vzc2VkIGJ5IGBgUy5JbmZpbml0eWBgLFxuICAgIG9yIGNhbiBiZSBpbXBvcnRlZCBhcyBgYG9vYGAuXG4gICAgRXhhbXBsZXNcbiAgICA9PT09PT09PVxuICAgID4+PiBmcm9tIHN5bXB5IGltcG9ydCBvbywgZXhwLCBsaW1pdCwgU3ltYm9sXG4gICAgPj4+IDEgKyBvb1xuICAgIG9vXG4gICAgPj4+IDQyL29vXG4gICAgMFxuICAgID4+PiB4ID0gU3ltYm9sKCd4JylcbiAgICA+Pj4gbGltaXQoZXhwKHgpLCB4LCBvbylcbiAgICBvb1xuICAgIFNlZSBBbHNvXG4gICAgPT09PT09PT1cbiAgICBOZWdhdGl2ZUluZmluaXR5LCBOYU5cbiAgICBSZWZlcmVuY2VzXG4gICAgPT09PT09PT09PVxuICAgIC4uIFsxXSBodHRwczovL2VuLndpa2lwZWRpYS5vcmcvd2lraS9JbmZpbml0eVxuICAgICovXG4gICAgc3RhdGljIGlzX2NvbW11dGF0aXZlID0gdHJ1ZTtcbiAgICBzdGF0aWMgaXNfbnVtYmVyID0gdHJ1ZTtcbiAgICBzdGF0aWMgaXNfY29tcGxleCA9IGZhbHNlO1xuICAgIHN0YXRpYyBpc19leHRlbmRlZF9yZWFsID0gdHJ1ZTtcbiAgICBzdGF0aWMgaXNfaW5maW5pdGUgPSB0cnVlO1xuICAgIHN0YXRpYyBpc19jb21wYXJhYmxlID0gdHJ1ZTtcbiAgICBzdGF0aWMgaXNfZXh0ZW5kZWRfcG9zaXRpdmUgPSB0cnVlO1xuICAgIHN0YXRpYyBpc19wcmltZSA9IGZhbHNlO1xuICAgIF9fc2xvdHNfXzogYW55ID0gW107XG5cbiAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICAgICAgc3VwZXIoKTtcbiAgICB9XG5cbiAgICAvLyBOT1RFOiBtb3JlIGFyaXRobWV0aWMgbWV0aG9kcyBzaG91bGQgYmUgaW1wbGVtZW50ZWQgYnV0IEkgaGF2ZSBvbmx5XG4gICAgLy8gZG9uZSBlbm91Z2ggc3VjaCB0aGF0IGFkZCBhbmQgbXVsIGNhbiBoYW5kbGUgaW5maW5pdHkgYXMgYW4gYXJndW1lbnRcbiAgICBfX2FkZF9fKG90aGVyOiBhbnkpIHtcbiAgICAgICAgaWYgKG90aGVyIGluc3RhbmNlb2YgX051bWJlcl8gJiYgZ2xvYmFsX3BhcmFtZXRlcnMuZXZhbHVhdGUpIHtcbiAgICAgICAgICAgIGlmIChvdGhlciA9PT0gUy5OZWdhdGl2ZUluZmluaXR5IHx8IG90aGVyID09PSBTLk5hTikge1xuICAgICAgICAgICAgICAgIHJldHVybiBTLk5hTjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBzdXBlci5fX2FkZF9fKG90aGVyKTtcbiAgICB9XG5cbiAgICBfX211bF9fKG90aGVyOiBhbnkpIHtcbiAgICAgICAgaWYgKG90aGVyIGluc3RhbmNlb2YgX051bWJlcl8gJiYgZ2xvYmFsX3BhcmFtZXRlcnMuZXZhbHVhdGUpIHtcbiAgICAgICAgICAgIGlmIChvdGhlciA9PT0gUy5aZXJvIHx8IG90aGVyID09PSBTLk5hTikge1xuICAgICAgICAgICAgICAgIHJldHVybiBTLk5hTjtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAob3RoZXIuaXNfZXh0ZW5kZWRfcG9zaXRpdmUpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiBTLk5lZ2F0aXZlSW5maW5pdHk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHN1cGVyLl9fbXVsX18ob3RoZXIpO1xuICAgIH1cblxuICAgIHRvU3RyaW5nKCkge1xuICAgICAgICByZXR1cm4gXCJJbmZpbml0eVwiO1xuICAgIH1cbn1cblxuY2xhc3MgTmVnYXRpdmVJbmZpbml0eSBleHRlbmRzIF9OdW1iZXJfIHtcbiAgICAvKlxuICAgIFwiTmVnYXRpdmUgaW5maW5pdGUgcXVhbnRpdHkuXG4gICAgTmVnYXRpdmVJbmZpbml0eSBpcyBhIHNpbmdsZXRvbiwgYW5kIGNhbiBiZSBhY2Nlc3NlZFxuICAgIGJ5IGBgUy5OZWdhdGl2ZUluZmluaXR5YGAuXG4gICAgU2VlIEFsc29cbiAgICA9PT09PT09PVxuICAgIEluZmluaXR5XG4gICAgKi9cbiAgICBzdGF0aWMgaXNfZXh0ZW5kZWRfcmVhbCA9IHRydWU7XG4gICAgc3RhdGljIGlzX2NvbXBsZXggPSBmYWxzZTtcbiAgICBzdGF0aWMgaXNfY29tbXV0YXRpdmUgPSB0cnVlO1xuICAgIHN0YXRpYyBpc19pbmZpbml0ZSA9IHRydWU7XG4gICAgc3RhdGljIGlzX2NvbXBhcmFibGUgPSB0cnVlO1xuICAgIHN0YXRpYyBpc19leHRlbmRlZF9uZWdhdGl2ZSA9IHRydWU7XG4gICAgc3RhdGljIGlzX251bWJlciA9IHRydWU7XG4gICAgc3RhdGljIGlzX3ByaW1lID0gZmFsc2U7XG4gICAgX19zbG90c19fOiBhbnkgPSBbXTtcblxuICAgIGNvbnN0cnVjdG9yKCkge1xuICAgICAgICBzdXBlcigpO1xuICAgIH1cblxuICAgIC8vIE5PVEU6IG1vcmUgYXJpdGhtZXRpYyBtZXRob2RzIHNob3VsZCBiZSBpbXBsZW1lbnRlZCBidXQgSSBoYXZlIG9ubHlcbiAgICAvLyBkb25lIGVub3VnaCBzdWNoIHRoYXQgYWRkIGFuZCBtdWwgY2FuIGhhbmRsZSBuZWdhdGl2ZWluZmluaXR5IGFzIGFuIGFyZ3VtZW50XG4gICAgX19hZGRfXyhvdGhlcjogYW55KSB7XG4gICAgICAgIGlmIChvdGhlciBpbnN0YW5jZW9mIF9OdW1iZXJfICYmIGdsb2JhbF9wYXJhbWV0ZXJzLmV2YWx1YXRlKSB7XG4gICAgICAgICAgICBpZiAob3RoZXIgPT09IFMuTmVnYXRpdmVJbmZpbml0eSB8fCBvdGhlciA9PT0gUy5OYU4pIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gUy5OYU47XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gc3VwZXIuX19hZGRfXyhvdGhlcik7XG4gICAgfVxuXG4gICAgX19tdWxfXyhvdGhlcjogYW55KSB7XG4gICAgICAgIGlmIChvdGhlciBpbnN0YW5jZW9mIF9OdW1iZXJfICYmIGdsb2JhbF9wYXJhbWV0ZXJzLmV2YWx1YXRlKSB7XG4gICAgICAgICAgICBpZiAob3RoZXIgPT09IFMuWmVybyB8fCBvdGhlciA9PT0gUy5OYU4pIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gUy5OYU47XG4gICAgICAgICAgICB9IGVsc2UgaWYgKG90aGVyLmlzX2V4dGVuZGVkX3Bvc2l0aXZlKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gUy5JbmZpbml0eTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gc3VwZXIuX19tdWxfXyhvdGhlcik7XG4gICAgfVxuXG4gICAgdG9TdHJpbmcoKSB7XG4gICAgICAgIHJldHVybiBcIk5lZ0luZmluaXR5XCI7XG4gICAgfVxufVxuXG4vLyBSZWdpc3RlcmluZyBzaW5nbGV0b25zIChzZWUgc2luZ2xldG9uIGNsYXNzKVxuU2luZ2xldG9uLnJlZ2lzdGVyKFwiWmVyb1wiLCBaZXJvKTtcblMuWmVybyA9IFNpbmdsZXRvbi5yZWdpc3RyeVtcIlplcm9cIl07XG5cblNpbmdsZXRvbi5yZWdpc3RlcihcIk9uZVwiLCBPbmUpO1xuUy5PbmUgPSBTaW5nbGV0b24ucmVnaXN0cnlbXCJPbmVcIl07XG5cblNpbmdsZXRvbi5yZWdpc3RlcihcIk5lZ2F0aXZlT25lXCIsIE5lZ2F0aXZlT25lKTtcblMuTmVnYXRpdmVPbmUgPSBTaW5nbGV0b24ucmVnaXN0cnlbXCJOZWdhdGl2ZU9uZVwiXTtcblxuU2luZ2xldG9uLnJlZ2lzdGVyKFwiTmFOXCIsIE5hTik7XG5TLk5hTiA9IFNpbmdsZXRvbi5yZWdpc3RyeVtcIk5hTlwiXTtcblxuU2luZ2xldG9uLnJlZ2lzdGVyKFwiQ29tcGxleEluZmluaXR5XCIsIENvbXBsZXhJbmZpbml0eSk7XG5TLkNvbXBsZXhJbmZpbml0eSA9IFNpbmdsZXRvbi5yZWdpc3RyeVtcIkNvbXBsZXhJbmZpbml0eVwiXTtcblxuU2luZ2xldG9uLnJlZ2lzdGVyKFwiSW5maW5pdHlcIiwgSW5maW5pdHkpO1xuUy5JbmZpbml0eSA9IFNpbmdsZXRvbi5yZWdpc3RyeVtcIkluZmluaXR5XCJdO1xuY29uc29sZS5sb2coXCJhc3NpbmdpbmcgUy5JbmZpbml0eVwiKVxuXG5TaW5nbGV0b24ucmVnaXN0ZXIoXCJOZWdhdGl2ZUluZmluaXR5XCIsIE5lZ2F0aXZlSW5maW5pdHkpO1xuUy5OZWdhdGl2ZUluZmluaXR5ID0gU2luZ2xldG9uLnJlZ2lzdHJ5W1wiTmVnYXRpdmVJbmZpbml0eVwiXTtcblxuZXhwb3J0IHtSYXRpb25hbCwgX051bWJlcl8sIEZsb2F0LCBJbnRlZ2VyLCBaZXJvLCBPbmV9O1xuIiwgIi8qXG5JbnRlZ2VyIGFuZCByYXRpb25hbCBmYWN0b3JpemF0aW9uXG5cbk5vdGFibGUgY2hhbmdlcyBtYWRlXG4tIEEgZmV3IGZ1bmN0aW9ucyBpbiAuZ2VuZXJhdG9yIGFuZCAuZXZhbGYgaGF2ZSBiZWVuIG1vdmVkIGhlcmUgZm9yIHNpbXBsaWNpdHlcbi0gTm90ZTogbW9zdCBwYXJhbWV0ZXJzIGZvciBmYWN0b3JpbnQgYW5kIGZhY3RvcnJhdCBoYXZlIG5vdCBiZWVuIGltcGxlbWVudGVkXG4tIFNlZSBub3RlcyB3aXRoaW4gcGVyZmVjdF9wb3dlciBmb3Igc3BlY2lmaWMgY2hhbmdlc1xuLSBBbGwgZmFjdG9yIGZ1bmN0aW9ucyByZXR1cm4gaGFzaGRpY3Rpb25hcmllc1xuLSBBZHZhbmNlZCBmYWN0b3JpbmcgYWxnb3JpdGhtcyBmb3IgZmFjdG9yaW50IGFyZSBub3QgeWV0IGltcGxlbWVudGVkXG4qL1xuXG5pbXBvcnQge1JhdGlvbmFsLCBpbnRfbnRocm9vdCwgSW50ZWdlcn0gZnJvbSBcIi4uL2NvcmUvbnVtYmVyc1wiO1xuaW1wb3J0IHtTfSBmcm9tIFwiLi4vY29yZS9zaW5nbGV0b25cIjtcbmltcG9ydCB7SGFzaERpY3QsIFV0aWx9IGZyb20gXCIuLi9jb3JlL3V0aWxpdHlcIjtcbmltcG9ydCB7YXNfaW50fSBmcm9tIFwiLi4vdXRpbGl0aWVzL21pc2NcIjtcblxuY29uc3Qgc21hbGxfdHJhaWxpbmcgPSBuZXcgQXJyYXkoMjU2KS5maWxsKDApO1xuZm9yIChsZXQgaiA9IDE7IGogPCA4OyBqKyspIHtcbiAgICBVdGlsLmFzc2lnbkVsZW1lbnRzKHNtYWxsX3RyYWlsaW5nLCBuZXcgQXJyYXkoKDE8PCg3LWopKSkuZmlsbChqKSwgMTw8aiwgMTw8KGorMSkpO1xufVxuXG5mdW5jdGlvbiBiaXRjb3VudChuOiBudW1iZXIpIHtcbiAgICAvLyBSZXR1cm4gc21hbGxlc3QgaW50ZWdlciwgYiwgc3VjaCB0aGF0IHxufC8yKipiIDwgMVxuICAgIGxldCBiaXRzID0gMDtcbiAgICB3aGlsZSAobiAhPT0gMCkge1xuICAgICAgICBiaXRzICs9IGJpdENvdW50MzIobiB8IDApO1xuICAgICAgICBuIC89IDB4MTAwMDAwMDAwO1xuICAgIH1cbiAgICByZXR1cm4gYml0cztcbn1cblxuLy8gc21hbGwgYml0Y291bnQgdXNlZCB0byBmYWNpbGlhdGUgbGFyZ2VyIG9uZVxuZnVuY3Rpb24gYml0Q291bnQzMihuOiBudW1iZXIpIHtcbiAgICBuID0gbiAtICgobiA+PiAxKSAmIDB4NTU1NTU1NTUpO1xuICAgIG4gPSAobiAmIDB4MzMzMzMzMzMpICsgKChuID4+IDIpICYgMHgzMzMzMzMzMyk7XG4gICAgcmV0dXJuICgobiArIChuID4+IDQpICYgMHhGMEYwRjBGKSAqIDB4MTAxMDEwMSkgPj4gMjQ7XG59XG5cbmZ1bmN0aW9uIHRyYWlsaW5nKG46IG51bWJlcikge1xuICAgIC8qXG4gICAgQ291bnQgdGhlIG51bWJlciBvZiB0cmFpbGluZyB6ZXJvIGRpZ2l0cyBpbiB0aGUgYmluYXJ5XG4gICAgcmVwcmVzZW50YXRpb24gb2YgbiwgaS5lLiBkZXRlcm1pbmUgdGhlIGxhcmdlc3QgcG93ZXIgb2YgMlxuICAgIHRoYXQgZGl2aWRlcyBuLlxuICAgIEV4YW1wbGVzXG4gICAgPT09PT09PT1cbiAgICA+Pj4gZnJvbSBzeW1weSBpbXBvcnQgdHJhaWxpbmdcbiAgICA+Pj4gdHJhaWxpbmcoMTI4KVxuICAgIDdcbiAgICA+Pj4gdHJhaWxpbmcoNjMpXG4gICAgMFxuICAgICovXG4gICAgbiA9IE1hdGguZmxvb3IoTWF0aC5hYnMobikpO1xuICAgIGNvbnN0IGxvd19ieXRlID0gbiAmIDB4ZmY7XG4gICAgaWYgKGxvd19ieXRlKSB7XG4gICAgICAgIHJldHVybiBzbWFsbF90cmFpbGluZ1tsb3dfYnl0ZV07XG4gICAgfVxuICAgIGNvbnN0IHogPSBiaXRjb3VudChuKSAtIDE7XG4gICAgaWYgKE51bWJlci5pc0ludGVnZXIoeikpIHtcbiAgICAgICAgaWYgKG4gPT09IDEgPDwgeikge1xuICAgICAgICAgICAgcmV0dXJuIHo7XG4gICAgICAgIH1cbiAgICB9XG4gICAgaWYgKHogPCAzMDApIHtcbiAgICAgICAgbGV0IHQgPSA4O1xuICAgICAgICBuID4+PSA4O1xuICAgICAgICB3aGlsZSAoIShuICYgMHhmZikpIHtcbiAgICAgICAgICAgIG4gPj49IDg7XG4gICAgICAgICAgICB0ICs9IDg7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHQgKyBzbWFsbF90cmFpbGluZ1tuICYgMHhmZl07XG4gICAgfVxuICAgIGxldCB0ID0gMDtcbiAgICBsZXQgcCA9IDg7XG4gICAgd2hpbGUgKCEobiAmIDEpKSB7XG4gICAgICAgIHdoaWxlICghKG4gJiAoKDEgPDwgcCkgLSAxKSkpIHtcbiAgICAgICAgICAgIG4gPj49IHA7XG4gICAgICAgICAgICB0ICs9IHA7XG4gICAgICAgICAgICBwICo9IDI7XG4gICAgICAgIH1cbiAgICAgICAgcCA9IE1hdGguZmxvb3IocC8yKTtcbiAgICB9XG4gICAgcmV0dXJuIHQ7XG59XG5cbi8vIG5vdGU6IHRoaXMgaXMgZGlmZmVyZW50IHRoYW4gdGhlIG9yaWdpbmFsIHN5bXB5IHZlcnNpb24gLSBpbXBsZW1lbnQgbGF0ZXJcbmZ1bmN0aW9uIGlzcHJpbWUobnVtOiBudW1iZXIpIHtcbiAgICBmb3IgKGxldCBpID0gMiwgcyA9IE1hdGguc3FydChudW0pOyBpIDw9IHM7IGkrKykge1xuICAgICAgICBpZiAobnVtICUgaSA9PT0gMCkge1xuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9XG4gICAgfVxuICAgIHJldHVybiAobnVtID4gMSk7XG59XG5cbmZ1bmN0aW9uKiBwcmltZXJhbmdlKGE6IG51bWJlciwgYjogbnVtYmVyID0gdW5kZWZpbmVkKSB7XG4gICAgLypcbiAgICBHZW5lcmF0ZSBhbGwgcHJpbWUgbnVtYmVycyBpbiB0aGUgcmFuZ2UgWzIsIGEpIG9yIFthLCBiKS5cbiAgICBFeGFtcGxlc1xuICAgID09PT09PT09XG4gICAgPj4+IGZyb20gc3ltcHkgaW1wb3J0IHNpZXZlLCBwcmltZVxuICAgIEFsbCBwcmltZXMgbGVzcyB0aGFuIDE5OlxuICAgID4+PiBwcmludChbaSBmb3IgaSBpbiBzaWV2ZS5wcmltZXJhbmdlKDE5KV0pXG4gICAgWzIsIDMsIDUsIDcsIDExLCAxMywgMTddXG4gICAgQWxsIHByaW1lcyBncmVhdGVyIHRoYW4gb3IgZXF1YWwgdG8gNyBhbmQgbGVzcyB0aGFuIDE5OlxuICAgID4+PiBwcmludChbaSBmb3IgaSBpbiBzaWV2ZS5wcmltZXJhbmdlKDcsIDE5KV0pXG4gICAgWzcsIDExLCAxMywgMTddXG4gICAgQWxsIHByaW1lcyB0aHJvdWdoIHRoZSAxMHRoIHByaW1lXG4gICAgPj4+IGxpc3Qoc2lldmUucHJpbWVyYW5nZShwcmltZSgxMCkgKyAxKSlcbiAgICBbMiwgMywgNSwgNywgMTEsIDEzLCAxNywgMTksIDIzLCAyOV1cbiAgICAqL1xuICAgIGlmICh0eXBlb2YgYiA9PT0gXCJ1bmRlZmluZWRcIikge1xuICAgICAgICBbYSwgYl0gPSBbMiwgYV07XG4gICAgfVxuICAgIGlmIChhID49IGIpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBhID0gTWF0aC5jZWlsKGEpIC0gMTtcbiAgICBiID0gTWF0aC5mbG9vcihiKTtcblxuICAgIHdoaWxlICgxKSB7XG4gICAgICAgIGEgPSBuZXh0cHJpbWUoYSk7XG4gICAgICAgIGlmIChhIDwgYikge1xuICAgICAgICAgICAgeWllbGQgYTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgIH1cbn1cblxuZnVuY3Rpb24gbmV4dHByaW1lKG46IG51bWJlciwgaXRoOiBudW1iZXIgPSAxKSB7XG4gICAgLypcbiAgICBSZXR1cm4gdGhlIGl0aCBwcmltZSBncmVhdGVyIHRoYW4gbi5cbiAgICBpIG11c3QgYmUgYW4gaW50ZWdlci5cbiAgICBOb3Rlc1xuICAgID09PT09XG4gICAgUG90ZW50aWFsIHByaW1lcyBhcmUgbG9jYXRlZCBhdCA2KmogKy8tIDEuIFRoaXNcbiAgICBwcm9wZXJ0eSBpcyB1c2VkIGR1cmluZyBzZWFyY2hpbmcuXG4gICAgPj4+IGZyb20gc3ltcHkgaW1wb3J0IG5leHRwcmltZVxuICAgID4+PiBbKGksIG5leHRwcmltZShpKSkgZm9yIGkgaW4gcmFuZ2UoMTAsIDE1KV1cbiAgICBbKDEwLCAxMSksICgxMSwgMTMpLCAoMTIsIDEzKSwgKDEzLCAxNyksICgxNCwgMTcpXVxuICAgID4+PiBuZXh0cHJpbWUoMiwgaXRoPTIpICMgdGhlIDJuZCBwcmltZSBhZnRlciAyXG4gICAgNVxuICAgIFNlZSBBbHNvXG4gICAgPT09PT09PT1cbiAgICBwcmV2cHJpbWUgOiBSZXR1cm4gdGhlIGxhcmdlc3QgcHJpbWUgc21hbGxlciB0aGFuIG5cbiAgICBwcmltZXJhbmdlIDogR2VuZXJhdGUgYWxsIHByaW1lcyBpbiBhIGdpdmVuIHJhbmdlXG4gICAgKi9cbiAgICBuID0gTWF0aC5mbG9vcihuKTtcbiAgICBjb25zdCBpID0gYXNfaW50KGl0aCk7XG4gICAgaWYgKGkgPiAxKSB7XG4gICAgICAgIGxldCBwciA9IG47XG4gICAgICAgIGxldCBqID0gMTtcbiAgICAgICAgd2hpbGUgKDEpIHtcbiAgICAgICAgICAgIHByID0gbmV4dHByaW1lKHByKTtcbiAgICAgICAgICAgIGorKztcbiAgICAgICAgICAgIGlmIChqID4gMSkge1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBwcjtcbiAgICB9XG4gICAgaWYgKG4gPCAyKSB7XG4gICAgICAgIHJldHVybiAyO1xuICAgIH1cbiAgICBpZiAobiA8IDcpIHtcbiAgICAgICAgcmV0dXJuIHsyOiAzLCAzOiA1LCA0OiA1LCA1OiA3LCA2OiA3fVtuXTtcbiAgICB9XG4gICAgY29uc3Qgbm4gPSA2ICogTWF0aC5mbG9vcihuLzYpO1xuICAgIGlmIChubiA9PT0gbikge1xuICAgICAgICBuKys7XG4gICAgICAgIGlmIChpc3ByaW1lKG4pKSB7XG4gICAgICAgICAgICByZXR1cm4gbjtcbiAgICAgICAgfVxuICAgICAgICBuICs9IDQ7XG4gICAgfSBlbHNlIGlmIChuIC0gbm4gPT09IDUpIHtcbiAgICAgICAgbiArPSAyO1xuICAgICAgICBpZiAoaXNwcmltZShuKSkge1xuICAgICAgICAgICAgcmV0dXJuIG47XG4gICAgICAgIH1cbiAgICAgICAgbiArPSA0O1xuICAgIH0gZWxzZSB7XG4gICAgICAgIG4gPSBubiArIDU7XG4gICAgfVxuICAgIHdoaWxlICgxKSB7XG4gICAgICAgIGlmIChpc3ByaW1lKG4pKSB7XG4gICAgICAgICAgICByZXR1cm4gbjtcbiAgICAgICAgfVxuICAgICAgICBuICs9IDI7XG4gICAgICAgIGlmIChpc3ByaW1lKG4pKSB7XG4gICAgICAgICAgICByZXR1cm4gbjtcbiAgICAgICAgfVxuICAgICAgICBuICs9IDQ7XG4gICAgfVxufVxuXG5leHBvcnQgY29uc3QgZGl2bW9kID0gKGE6IG51bWJlciwgYjogbnVtYmVyKSA9PiBbTWF0aC5mbG9vcihhL2IpLCBhJWJdO1xuXG5mdW5jdGlvbiBtdWx0aXBsaWNpdHkocDogYW55LCBuOiBhbnkpOiBhbnkge1xuICAgIC8qXG4gICAgRmluZCB0aGUgZ3JlYXRlc3QgaW50ZWdlciBtIHN1Y2ggdGhhdCBwKiptIGRpdmlkZXMgbi5cbiAgICBFeGFtcGxlc1xuICAgID09PT09PT09XG4gICAgPj4+IGZyb20gc3ltcHkgaW1wb3J0IG11bHRpcGxpY2l0eSwgUmF0aW9uYWxcbiAgICA+Pj4gW211bHRpcGxpY2l0eSg1LCBuKSBmb3IgbiBpbiBbOCwgNSwgMjUsIDEyNSwgMjUwXV1cbiAgICBbMCwgMSwgMiwgMywgM11cbiAgICA+Pj4gbXVsdGlwbGljaXR5KDMsIFJhdGlvbmFsKDEsIDkpKVxuICAgIC0yXG4gICAgTm90ZTogd2hlbiBjaGVja2luZyBmb3IgdGhlIG11bHRpcGxpY2l0eSBvZiBhIG51bWJlciBpbiBhXG4gICAgbGFyZ2UgZmFjdG9yaWFsIGl0IGlzIG1vc3QgZWZmaWNpZW50IHRvIHNlbmQgaXQgYXMgYW4gdW5ldmFsdWF0ZWRcbiAgICBmYWN0b3JpYWwgb3IgdG8gY2FsbCBgYG11bHRpcGxpY2l0eV9pbl9mYWN0b3JpYWxgYCBkaXJlY3RseTpcbiAgICA+Pj4gZnJvbSBzeW1weS5udGhlb3J5IGltcG9ydCBtdWx0aXBsaWNpdHlfaW5fZmFjdG9yaWFsXG4gICAgPj4+IGZyb20gc3ltcHkgaW1wb3J0IGZhY3RvcmlhbFxuICAgID4+PiBwID0gZmFjdG9yaWFsKDI1KVxuICAgID4+PiBuID0gMioqMTAwXG4gICAgPj4+IG5mYWMgPSBmYWN0b3JpYWwobiwgZXZhbHVhdGU9RmFsc2UpXG4gICAgPj4+IG11bHRpcGxpY2l0eShwLCBuZmFjKVxuICAgIDUyODE4Nzc1MDA5NTA5NTU4Mzk1Njk1OTY2ODg3XG4gICAgPj4+IF8gPT0gbXVsdGlwbGljaXR5X2luX2ZhY3RvcmlhbChwLCBuKVxuICAgIFRydWVcbiAgICAqL1xuICAgIHRyeSB7XG4gICAgICAgIFtwLCBuXSA9IFthc19pbnQocCksIGFzX2ludChuKV07XG4gICAgfSBjYXRjaCAoRXJyb3IpIHtcbiAgICAgICAgaWYgKE51bWJlci5pc0ludGVnZXIocCkgfHwgcCBpbnN0YW5jZW9mIFJhdGlvbmFsICYmIE51bWJlci5pc0ludGVnZXIobikgfHwgbiBpbnN0YW5jZW9mIFJhdGlvbmFsKSB7XG4gICAgICAgICAgICBwID0gbmV3IFJhdGlvbmFsKHApO1xuICAgICAgICAgICAgbiA9IG5ldyBSYXRpb25hbChuKTtcbiAgICAgICAgICAgIGlmIChwLnEgPT09IDEpIHtcbiAgICAgICAgICAgICAgICBpZiAobi5wID09PSAxKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiAtbXVsdGlwbGljaXR5KHAucCwgbi5xKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgcmV0dXJuIG11bHRpcGxpY2l0eShwLnAsIG4ucCkgLSBtdWx0aXBsaWNpdHkocC5wLCBuLnEpO1xuICAgICAgICAgICAgfSBlbHNlIGlmIChwLnAgPT09IDEpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gbXVsdGlwbGljaXR5KHAucSwgbi5xKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgY29uc3QgbGlrZSA9IE1hdGgubWluKG11bHRpcGxpY2l0eShwLnAsIG4ucCksIG11bHRpcGxpY2l0eShwLnEsIG4ucSkpO1xuICAgICAgICAgICAgICAgIGNvbnN0IGNyb3NzID0gTWF0aC5taW4obXVsdGlwbGljaXR5KHAucSwgbi5wKSwgbXVsdGlwbGljaXR5KHAucCwgbi5xKSk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGxpa2UgLSBjcm9zcztcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cbiAgICBpZiAobiA9PT0gMCkge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJubyBpbnQgZXhpc3RzXCIpO1xuICAgIH1cbiAgICBpZiAocCA9PT0gMikge1xuICAgICAgICByZXR1cm4gdHJhaWxpbmcobik7XG4gICAgfVxuICAgIGlmIChwIDwgMikge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJwIG11c3QgYmUgaW50XCIpO1xuICAgIH1cbiAgICBpZiAocCA9PT0gbikge1xuICAgICAgICByZXR1cm4gMTtcbiAgICB9XG5cbiAgICBsZXQgbSA9IDA7XG4gICAgbiA9IE1hdGguZmxvb3Iobi9wKTtcbiAgICBsZXQgcmVtID0gbiAlIHA7XG4gICAgd2hpbGUgKCFyZW0pIHtcbiAgICAgICAgbSsrO1xuICAgICAgICBpZiAobSA+IDUpIHtcbiAgICAgICAgICAgIGxldCBlID0gMjtcbiAgICAgICAgICAgIHdoaWxlICgxKSB7XG4gICAgICAgICAgICAgICAgY29uc3QgcHBvdyA9IHAqKmU7XG4gICAgICAgICAgICAgICAgaWYgKHBwb3cgPCBuKSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IG5uZXcgPSBNYXRoLmZsb29yKG4vcHBvdyk7XG4gICAgICAgICAgICAgICAgICAgIHJlbSA9IG4gJSBwcG93O1xuICAgICAgICAgICAgICAgICAgICBpZiAoIShyZW0pKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBtICs9IGU7XG4gICAgICAgICAgICAgICAgICAgICAgICBlICo9IDI7XG4gICAgICAgICAgICAgICAgICAgICAgICBuID0gbm5ldztcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHJldHVybiBtICsgbXVsdGlwbGljaXR5KHAsIG4pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIFtuLCByZW1dID0gZGl2bW9kKG4sIHApO1xuICAgIH1cbiAgICByZXR1cm4gbTtcbn1cblxuZnVuY3Rpb24gZGl2aXNvcnMobjogbnVtYmVyLCBnZW5lcmF0b3I6IGJvb2xlYW4gPSBmYWxzZSwgcHJvcGVyOiBib29sZWFuID0gZmFsc2UpIHtcbiAgICAvKlxuICAgIFJldHVybiBhbGwgZGl2aXNvcnMgb2YgbiBzb3J0ZWQgZnJvbSAxLi5uIGJ5IGRlZmF1bHQuXG4gICAgSWYgZ2VuZXJhdG9yIGlzIGBgVHJ1ZWBgIGFuIHVub3JkZXJlZCBnZW5lcmF0b3IgaXMgcmV0dXJuZWQuXG4gICAgVGhlIG51bWJlciBvZiBkaXZpc29ycyBvZiBuIGNhbiBiZSBxdWl0ZSBsYXJnZSBpZiB0aGVyZSBhcmUgbWFueVxuICAgIHByaW1lIGZhY3RvcnMgKGNvdW50aW5nIHJlcGVhdGVkIGZhY3RvcnMpLiBJZiBvbmx5IHRoZSBudW1iZXIgb2ZcbiAgICBmYWN0b3JzIGlzIGRlc2lyZWQgdXNlIGRpdmlzb3JfY291bnQobikuXG4gICAgRXhhbXBsZXNcbiAgICA9PT09PT09PVxuICAgID4+PiBmcm9tIHN5bXB5IGltcG9ydCBkaXZpc29ycywgZGl2aXNvcl9jb3VudFxuICAgID4+PiBkaXZpc29ycygyNClcbiAgICBbMSwgMiwgMywgNCwgNiwgOCwgMTIsIDI0XVxuICAgID4+PiBkaXZpc29yX2NvdW50KDI0KVxuICAgIDhcbiAgICA+Pj4gbGlzdChkaXZpc29ycygxMjAsIGdlbmVyYXRvcj1UcnVlKSlcbiAgICBbMSwgMiwgNCwgOCwgMywgNiwgMTIsIDI0LCA1LCAxMCwgMjAsIDQwLCAxNSwgMzAsIDYwLCAxMjBdXG4gICAgTm90ZXNcbiAgICA9PT09PVxuICAgIFRoaXMgaXMgYSBzbGlnaHRseSBtb2RpZmllZCB2ZXJzaW9uIG9mIFRpbSBQZXRlcnMgcmVmZXJlbmNlZCBhdDpcbiAgICBodHRwczovL3N0YWNrb3ZlcmZsb3cuY29tL3F1ZXN0aW9ucy8xMDEwMzgxL3B5dGhvbi1mYWN0b3JpemF0aW9uXG4gICAgU2VlIEFsc29cbiAgICA9PT09PT09PVxuICAgIHByaW1lZmFjdG9ycywgZmFjdG9yaW50LCBkaXZpc29yX2NvdW50XG4gICAgKi9cbiAgICBuID0gYXNfaW50KE1hdGguYWJzKG4pKTtcbiAgICBpZiAoaXNwcmltZShuKSkge1xuICAgICAgICBpZiAocHJvcGVyKSB7XG4gICAgICAgICAgICByZXR1cm4gWzFdO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBbMSwgbl07XG4gICAgfVxuICAgIGlmIChuID09PSAxKSB7XG4gICAgICAgIGlmIChwcm9wZXIpIHtcbiAgICAgICAgICAgIHJldHVybiBbXTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gWzFdO1xuICAgIH1cbiAgICBpZiAobiA9PT0gMCkge1xuICAgICAgICByZXR1cm4gW107XG4gICAgfVxuICAgIGNvbnN0IHJ2ID0gX2Rpdmlzb3JzKG4sIHByb3Blcik7XG4gICAgaWYgKCFnZW5lcmF0b3IpIHtcbiAgICAgICAgY29uc3QgdGVtcCA9IFtdO1xuICAgICAgICBmb3IgKGNvbnN0IGkgb2YgcnYpIHtcbiAgICAgICAgICAgIHRlbXAucHVzaChpKTtcbiAgICAgICAgfVxuICAgICAgICB0ZW1wLnNvcnQoKTtcbiAgICAgICAgcmV0dXJuIHRlbXA7XG4gICAgfVxuICAgIHJldHVybiBydjtcbn1cblxuZnVuY3Rpb24qIF9kaXZpc29ycyhuOiBudW1iZXIsIGdlbmVyYXRvcjogYm9vbGVhbiA9IGZhbHNlLCBwcm9wZXI6IGJvb2xlYW4gPSBmYWxzZSkge1xuICAgIC8vIEhlbHBlciBmdW5jdGlvbiBmb3IgZGl2aXNvcnMgd2hpY2ggZ2VuZXJhdGVzIHRoZSBkaXZpc29ycy5cbiAgICBjb25zdCBmYWN0b3JkaWN0ID0gZmFjdG9yaW50KG4pO1xuICAgIGNvbnN0IHBzID0gZmFjdG9yZGljdC5rZXlzKCkuc29ydCgpO1xuXG4gICAgZnVuY3Rpb24qIHJlY19nZW4objogbnVtYmVyID0gMCk6IGFueSB7XG4gICAgICAgIGlmIChuID09PSBwcy5sZW5ndGgpIHtcbiAgICAgICAgICAgIHlpZWxkIDE7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBjb25zdCBwb3dzID0gWzFdO1xuICAgICAgICAgICAgZm9yIChsZXQgaiA9IDA7IGogPCBmYWN0b3JkaWN0LmdldChwc1tuXSk7IGorKykge1xuICAgICAgICAgICAgICAgIHBvd3MucHVzaChwb3dzW3Bvd3MubGVuZ3RoIC0gMV0gKiBwc1tuXSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBmb3IgKGNvbnN0IHEgb2YgcmVjX2dlbihuICsgMSkpIHtcbiAgICAgICAgICAgICAgICBmb3IgKGNvbnN0IHAgb2YgcG93cykge1xuICAgICAgICAgICAgICAgICAgICB5aWVsZCBwICogcTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG4gICAgaWYgKHByb3Blcikge1xuICAgICAgICBmb3IgKGNvbnN0IHAgb2YgcmVjX2dlbigpKSB7XG4gICAgICAgICAgICBpZiAocCAhPSBuKSB7XG4gICAgICAgICAgICAgICAgeWllbGQgcDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICAgIGZvciAoY29uc3QgcCBvZiByZWNfZ2VuKCkpIHtcbiAgICAgICAgICAgIHlpZWxkIHA7XG4gICAgICAgIH1cbiAgICB9XG59XG5cblxuZnVuY3Rpb24gX2NoZWNrX3Rlcm1pbmF0aW9uKGZhY3RvcnM6IGFueSwgbjogbnVtYmVyLCBsaW1pdHAxOiBhbnkpIHtcbiAgICAvKlxuICAgIEhlbHBlciBmdW5jdGlvbiBmb3IgaW50ZWdlciBmYWN0b3JpemF0aW9uLiBDaGVja3MgaWYgYGBuYGBcbiAgICBpcyBhIHByaW1lIG9yIGEgcGVyZmVjdCBwb3dlciwgYW5kIGluIHRob3NlIGNhc2VzIHVwZGF0ZXNcbiAgICB0aGUgZmFjdG9yaXphdGlvbiBhbmQgcmFpc2VzIGBgU3RvcEl0ZXJhdGlvbmBgLlxuICAgICovXG4gICAgY29uc3QgcCA9IHBlcmZlY3RfcG93ZXIobiwgdW5kZWZpbmVkLCB0cnVlLCBmYWxzZSk7XG4gICAgaWYgKHAgIT09IGZhbHNlKSB7XG4gICAgICAgIGNvbnN0IFtiYXNlLCBleHBdID0gcDtcbiAgICAgICAgbGV0IGxpbWl0O1xuICAgICAgICBpZiAobGltaXRwMSkge1xuICAgICAgICAgICAgbGltaXQgPSBsaW1pdHAxID0gMTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGxpbWl0ID0gbGltaXRwMTtcbiAgICAgICAgfVxuICAgICAgICBjb25zdCBmYWNzID0gZmFjdG9yaW50KGJhc2UsIGxpbWl0KTtcbiAgICAgICAgZm9yIChjb25zdCBbYiwgZV0gb2YgZmFjcy5lbnRyaWVzKCkpIHtcbiAgICAgICAgICAgIGZhY3RvcnNbYl0gPSBleHAqZTtcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcigpO1xuICAgICAgICB9XG4gICAgfVxuICAgIGlmIChpc3ByaW1lKG4pKSB7XG4gICAgICAgIGZhY3RvcnMuYWRkKG4sIDEpO1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoKTtcbiAgICB9XG4gICAgaWYgKG4gPT09IDEpIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKCk7XG4gICAgfVxufVxuXG5mdW5jdGlvbiBfdHJpYWwoZmFjdG9yczogYW55LCBuOiBudW1iZXIsIGNhbmRpZGF0ZXM6IGFueSkge1xuICAgIC8qXG4gICAgSGVscGVyIGZ1bmN0aW9uIGZvciBpbnRlZ2VyIGZhY3Rvcml6YXRpb24uIFRyaWFsIGZhY3RvcnMgYGBuYFxuICAgIGFnYWluc3QgYWxsIGludGVnZXJzIGdpdmVuIGluIHRoZSBzZXF1ZW5jZSBgYGNhbmRpZGF0ZXNgYFxuICAgIGFuZCB1cGRhdGVzIHRoZSBkaWN0IGBgZmFjdG9yc2BgIGluLXBsYWNlLiBSZXR1cm5zIHRoZSByZWR1Y2VkXG4gICAgdmFsdWUgb2YgYGBuYGAgYW5kIGEgZmxhZyBpbmRpY2F0aW5nIHdoZXRoZXIgYW55IGZhY3RvcnMgd2VyZSBmb3VuZC5cbiAgICAqL1xuICAgIGNvbnN0IG5mYWN0b3JzID0gZmFjdG9ycy5sZW5ndGg7XG4gICAgZm9yIChjb25zdCBkIG9mIGNhbmRpZGF0ZXMpIHtcbiAgICAgICAgaWYgKG4gJSBkID09PSAwKSB7XG4gICAgICAgICAgICBjb25zdCBtID0gbXVsdGlwbGljaXR5KGQsIG4pO1xuICAgICAgICAgICAgbiA9IE1hdGguZmxvb3Iobi8oZCoqbSkpO1xuICAgICAgICAgICAgZmFjdG9yc1tkXSA9IG07XG4gICAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIFtuLCBmYWN0b3JzLmxlbmd0aCAhPT0gbmZhY3RvcnNdO1xufVxuXG5mdW5jdGlvbiBfZmFjdG9yaW50X3NtYWxsKGZhY3RvcnM6IEhhc2hEaWN0LCBuOiBhbnksIGxpbWl0OiBhbnksIGZhaWxfbWF4OiBhbnkpIHtcbiAgICAvKlxuICAgIFJldHVybiB0aGUgdmFsdWUgb2YgbiBhbmQgZWl0aGVyIGEgMCAoaW5kaWNhdGluZyB0aGF0IGZhY3Rvcml6YXRpb24gdXBcbiAgICB0byB0aGUgbGltaXQgd2FzIGNvbXBsZXRlKSBvciBlbHNlIHRoZSBuZXh0IG5lYXItcHJpbWUgdGhhdCB3b3VsZCBoYXZlXG4gICAgYmVlbiB0ZXN0ZWQuXG4gICAgRmFjdG9yaW5nIHN0b3BzIGlmIHRoZXJlIGFyZSBmYWlsX21heCB1bnN1Y2Nlc3NmdWwgdGVzdHMgaW4gYSByb3cuXG4gICAgSWYgZmFjdG9ycyBvZiBuIHdlcmUgZm91bmQgdGhleSB3aWxsIGJlIGluIHRoZSBmYWN0b3JzIGRpY3Rpb25hcnkgYXNcbiAgICB7ZmFjdG9yOiBtdWx0aXBsaWNpdHl9IGFuZCB0aGUgcmV0dXJuZWQgdmFsdWUgb2YgbiB3aWxsIGhhdmUgaGFkIHRob3NlXG4gICAgZmFjdG9ycyByZW1vdmVkLiBUaGUgZmFjdG9ycyBkaWN0aW9uYXJ5IGlzIG1vZGlmaWVkIGluLXBsYWNlLlxuICAgICovXG4gICAgZnVuY3Rpb24gZG9uZShuOiBudW1iZXIsIGQ6IG51bWJlcikge1xuICAgICAgICAvKlxuICAgICAgICByZXR1cm4gbiwgZCBpZiB0aGUgc3FydChuKSB3YXMgbm90IHJlYWNoZWQgeWV0LCBlbHNlXG4gICAgICAgIG4sIDAgaW5kaWNhdGluZyB0aGF0IGZhY3RvcmluZyBpcyBkb25lLlxuICAgICAgICAqL1xuICAgICAgICBpZiAoZCpkIDw9IG4pIHtcbiAgICAgICAgICAgIHJldHVybiBbbiwgZF07XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIFtuLCAwXTtcbiAgICB9XG4gICAgbGV0IGQgPSAyO1xuICAgIGxldCBtID0gdHJhaWxpbmcobik7XG4gICAgaWYgKG0pIHtcbiAgICAgICAgZmFjdG9ycy5hZGQoZCwgbSk7XG4gICAgICAgIG4gPj49IG07XG4gICAgfVxuICAgIGQgPSAzO1xuICAgIGlmIChsaW1pdCA8IGQpIHtcbiAgICAgICAgaWYgKG4gPiAxKSB7XG4gICAgICAgICAgICBmYWN0b3JzLmFkZChuLCAxKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gZG9uZShuLCBkKTtcbiAgICB9XG4gICAgbSA9IDA7XG4gICAgd2hpbGUgKG4gJSBkID09PSAwKSB7XG4gICAgICAgIG4gPSBNYXRoLmZsb29yKG4vZCk7XG4gICAgICAgIG0rKztcbiAgICAgICAgaWYgKG0gPT09IDIwKSB7XG4gICAgICAgICAgICBjb25zdCBtbSA9IG11bHRpcGxpY2l0eShkLCBuKTtcbiAgICAgICAgICAgIG0gKz0gbW07XG4gICAgICAgICAgICBuID0gTWF0aC5mbG9vcihuLyhkKiptbSkpO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cbiAgICB9XG4gICAgaWYgKG0pIHtcbiAgICAgICAgZmFjdG9ycy5hZGQoZCwgbSk7XG4gICAgfVxuICAgIGxldCBtYXh4O1xuICAgIGlmIChsaW1pdCAqIGxpbWl0ID4gbikge1xuICAgICAgICBtYXh4ID0gMDtcbiAgICB9IGVsc2Uge1xuICAgICAgICBtYXh4ID0gbGltaXQqbGltaXQ7XG4gICAgfVxuICAgIGxldCBkZCA9IG1heHggfHwgbjtcbiAgICBkID0gNTtcbiAgICBsZXQgZmFpbHMgPSAwO1xuICAgIHdoaWxlIChmYWlscyA8IGZhaWxfbWF4KSB7XG4gICAgICAgIGlmIChkKmQgPiBkZCkge1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cbiAgICAgICAgbSA9IDA7XG4gICAgICAgIHdoaWxlIChuICUgZCA9PT0gMCkge1xuICAgICAgICAgICAgbiA9IE1hdGguZmxvb3Iobi9kKTtcbiAgICAgICAgICAgIG0rKztcbiAgICAgICAgICAgIGlmIChtID09PSAyMCkge1xuICAgICAgICAgICAgICAgIGNvbnN0IG1tID0gbXVsdGlwbGljaXR5KGQsIG4pO1xuICAgICAgICAgICAgICAgIG0gKz0gbW07XG4gICAgICAgICAgICAgICAgbiA9IE1hdGguZmxvb3IobiAvIChkKiptbSkpO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGlmIChtKSB7XG4gICAgICAgICAgICBmYWN0b3JzLmFkZChkLCBtKTtcbiAgICAgICAgICAgIGRkID0gbWF4eCB8fCBuO1xuICAgICAgICAgICAgZmFpbHMgPSAwO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgZmFpbHMrKztcbiAgICAgICAgfVxuICAgICAgICBkICs9IDI7XG4gICAgICAgIGlmIChkKmQ+IGRkKSB7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuICAgICAgICBtID0gMDtcbiAgICAgICAgd2hpbGUgKG4gJSBkID09PSAwKSB7XG4gICAgICAgICAgICBuID0gTWF0aC5mbG9vcihuIC8gZCk7XG4gICAgICAgICAgICBtKys7XG4gICAgICAgICAgICBpZiAobSA9PT0gMjApIHtcbiAgICAgICAgICAgICAgICBjb25zdCBtbSA9IG11bHRpcGxpY2l0eShkLCBuKTtcbiAgICAgICAgICAgICAgICBtICs9IG1tO1xuICAgICAgICAgICAgICAgIG4gPSBNYXRoLmZsb29yKG4vKGQqKm1tKSk7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgaWYgKG0pIHtcbiAgICAgICAgICAgIGZhY3RvcnMuYWRkKGQsIG0pO1xuICAgICAgICAgICAgZGQgPSBtYXh4IHx8IG47XG4gICAgICAgICAgICBmYWlscyA9IDA7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBmYWlscysrO1xuICAgICAgICB9XG4gICAgICAgIGQgKz00O1xuICAgIH1cbiAgICByZXR1cm4gZG9uZShuLCBkKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGZhY3RvcmludChuOiBhbnksIGxpbWl0OiBhbnkgPSB1bmRlZmluZWQpOiBIYXNoRGljdCB7XG4gICAgLypcbiAgICBHaXZlbiBhIHBvc2l0aXZlIGludGVnZXIgYGBuYGAsIGBgZmFjdG9yaW50KG4pYGAgcmV0dXJucyBhIGRpY3QgY29udGFpbmluZ1xuICAgIHRoZSBwcmltZSBmYWN0b3JzIG9mIGBgbmBgIGFzIGtleXMgYW5kIHRoZWlyIHJlc3BlY3RpdmUgbXVsdGlwbGljaXRpZXNcbiAgICBhcyB2YWx1ZXMuIEZvciBleGFtcGxlOlxuICAgID4+PiBmcm9tIHN5bXB5Lm50aGVvcnkgaW1wb3J0IGZhY3RvcmludFxuICAgID4+PiBmYWN0b3JpbnQoMjAwMCkgICAgIyAyMDAwID0gKDIqKjQpICogKDUqKjMpXG4gICAgezI6IDQsIDU6IDN9XG4gICAgPj4+IGZhY3RvcmludCg2NTUzNykgICAjIFRoaXMgbnVtYmVyIGlzIHByaW1lXG4gICAgezY1NTM3OiAxfVxuICAgIEZvciBpbnB1dCBsZXNzIHRoYW4gMiwgZmFjdG9yaW50IGJlaGF2ZXMgYXMgZm9sbG93czpcbiAgICAgICAgLSBgYGZhY3RvcmludCgxKWBgIHJldHVybnMgdGhlIGVtcHR5IGZhY3Rvcml6YXRpb24sIGBge31gYFxuICAgICAgICAtIGBgZmFjdG9yaW50KDApYGAgcmV0dXJucyBgYHswOjF9YGBcbiAgICAgICAgLSBgYGZhY3RvcmludCgtbilgYCBhZGRzIGBgLTE6MWBgIHRvIHRoZSBmYWN0b3JzIGFuZCB0aGVuIGZhY3RvcnMgYGBuYGBcbiAgICBQYXJ0aWFsIEZhY3Rvcml6YXRpb246XG4gICAgSWYgYGBsaW1pdGBgICg+IDMpIGlzIHNwZWNpZmllZCwgdGhlIHNlYXJjaCBpcyBzdG9wcGVkIGFmdGVyIHBlcmZvcm1pbmdcbiAgICB0cmlhbCBkaXZpc2lvbiB1cCB0byAoYW5kIGluY2x1ZGluZykgdGhlIGxpbWl0IChvciB0YWtpbmcgYVxuICAgIGNvcnJlc3BvbmRpbmcgbnVtYmVyIG9mIHJoby9wLTEgc3RlcHMpLiBUaGlzIGlzIHVzZWZ1bCBpZiBvbmUgaGFzXG4gICAgYSBsYXJnZSBudW1iZXIgYW5kIG9ubHkgaXMgaW50ZXJlc3RlZCBpbiBmaW5kaW5nIHNtYWxsIGZhY3RvcnMgKGlmXG4gICAgYW55KS4gTm90ZSB0aGF0IHNldHRpbmcgYSBsaW1pdCBkb2VzIG5vdCBwcmV2ZW50IGxhcmdlciBmYWN0b3JzXG4gICAgZnJvbSBiZWluZyBmb3VuZCBlYXJseTsgaXQgc2ltcGx5IG1lYW5zIHRoYXQgdGhlIGxhcmdlc3QgZmFjdG9yIG1heVxuICAgIGJlIGNvbXBvc2l0ZS4gU2luY2UgY2hlY2tpbmcgZm9yIHBlcmZlY3QgcG93ZXIgaXMgcmVsYXRpdmVseSBjaGVhcCwgaXQgaXNcbiAgICBkb25lIHJlZ2FyZGxlc3Mgb2YgdGhlIGxpbWl0IHNldHRpbmcuXG4gICAgVGhpcyBudW1iZXIsIGZvciBleGFtcGxlLCBoYXMgdHdvIHNtYWxsIGZhY3RvcnMgYW5kIGEgaHVnZVxuICAgIHNlbWktcHJpbWUgZmFjdG9yIHRoYXQgY2Fubm90IGJlIHJlZHVjZWQgZWFzaWx5OlxuICAgID4+PiBmcm9tIHN5bXB5Lm50aGVvcnkgaW1wb3J0IGlzcHJpbWVcbiAgICA+Pj4gYSA9IDE0MDc2MzM3MTcyNjIzMzg5NTc0MzA2OTc5MjE0NDY4ODNcbiAgICA+Pj4gZiA9IGZhY3RvcmludChhLCBsaW1pdD0xMDAwMClcbiAgICA+Pj4gZiA9PSB7OTkxOiAxLCBpbnQoMjAyOTE2NzgyMDc2MTYyNDU2MDIyODc3MDI0ODU5KTogMSwgNzogMX1cbiAgICBUcnVlXG4gICAgPj4+IGlzcHJpbWUobWF4KGYpKVxuICAgIEZhbHNlXG4gICAgVGhpcyBudW1iZXIgaGFzIGEgc21hbGwgZmFjdG9yIGFuZCBhIHJlc2lkdWFsIHBlcmZlY3QgcG93ZXIgd2hvc2VcbiAgICBiYXNlIGlzIGdyZWF0ZXIgdGhhbiB0aGUgbGltaXQ6XG4gICAgPj4+IGZhY3RvcmludCgzKjEwMSoqNywgbGltaXQ9NSlcbiAgICB7MzogMSwgMTAxOiA3fVxuICAgIExpc3Qgb2YgRmFjdG9yczpcbiAgICBJZiBgYG11bHRpcGxlYGAgaXMgc2V0IHRvIGBgVHJ1ZWBgIHRoZW4gYSBsaXN0IGNvbnRhaW5pbmcgdGhlXG4gICAgcHJpbWUgZmFjdG9ycyBpbmNsdWRpbmcgbXVsdGlwbGljaXRpZXMgaXMgcmV0dXJuZWQuXG4gICAgPj4+IGZhY3RvcmludCgyNCwgbXVsdGlwbGU9VHJ1ZSlcbiAgICBbMiwgMiwgMiwgM11cbiAgICBWaXN1YWwgRmFjdG9yaXphdGlvbjpcbiAgICBJZiBgYHZpc3VhbGBgIGlzIHNldCB0byBgYFRydWVgYCwgdGhlbiBpdCB3aWxsIHJldHVybiBhIHZpc3VhbFxuICAgIGZhY3Rvcml6YXRpb24gb2YgdGhlIGludGVnZXIuICBGb3IgZXhhbXBsZTpcbiAgICA+Pj4gZnJvbSBzeW1weSBpbXBvcnQgcHByaW50XG4gICAgPj4+IHBwcmludChmYWN0b3JpbnQoNDIwMCwgdmlzdWFsPVRydWUpKVxuICAgICAzICAxICAyICAxXG4gICAgMiAqMyAqNSAqN1xuICAgIE5vdGUgdGhhdCB0aGlzIGlzIGFjaGlldmVkIGJ5IHVzaW5nIHRoZSBldmFsdWF0ZT1GYWxzZSBmbGFnIGluIE11bFxuICAgIGFuZCBQb3cuIElmIHlvdSBkbyBvdGhlciBtYW5pcHVsYXRpb25zIHdpdGggYW4gZXhwcmVzc2lvbiB3aGVyZVxuICAgIGV2YWx1YXRlPUZhbHNlLCBpdCBtYXkgZXZhbHVhdGUuICBUaGVyZWZvcmUsIHlvdSBzaG91bGQgdXNlIHRoZVxuICAgIHZpc3VhbCBvcHRpb24gb25seSBmb3IgdmlzdWFsaXphdGlvbiwgYW5kIHVzZSB0aGUgbm9ybWFsIGRpY3Rpb25hcnlcbiAgICByZXR1cm5lZCBieSB2aXN1YWw9RmFsc2UgaWYgeW91IHdhbnQgdG8gcGVyZm9ybSBvcGVyYXRpb25zIG9uIHRoZVxuICAgIGZhY3RvcnMuXG4gICAgWW91IGNhbiBlYXNpbHkgc3dpdGNoIGJldHdlZW4gdGhlIHR3byBmb3JtcyBieSBzZW5kaW5nIHRoZW0gYmFjayB0b1xuICAgIGZhY3RvcmludDpcbiAgICA+Pj4gZnJvbSBzeW1weSBpbXBvcnQgTXVsXG4gICAgPj4+IHJlZ3VsYXIgPSBmYWN0b3JpbnQoMTc2NCk7IHJlZ3VsYXJcbiAgICB7MjogMiwgMzogMiwgNzogMn1cbiAgICA+Pj4gcHByaW50KGZhY3RvcmludChyZWd1bGFyKSlcbiAgICAgMiAgMiAgMlxuICAgIDIgKjMgKjdcbiAgICA+Pj4gdmlzdWFsID0gZmFjdG9yaW50KDE3NjQsIHZpc3VhbD1UcnVlKTsgcHByaW50KHZpc3VhbClcbiAgICAgMiAgMiAgMlxuICAgIDIgKjMgKjdcbiAgICA+Pj4gcHJpbnQoZmFjdG9yaW50KHZpc3VhbCkpXG4gICAgezI6IDIsIDM6IDIsIDc6IDJ9XG4gICAgSWYgeW91IHdhbnQgdG8gc2VuZCBhIG51bWJlciB0byBiZSBmYWN0b3JlZCBpbiBhIHBhcnRpYWxseSBmYWN0b3JlZCBmb3JtXG4gICAgeW91IGNhbiBkbyBzbyB3aXRoIGEgZGljdGlvbmFyeSBvciB1bmV2YWx1YXRlZCBleHByZXNzaW9uOlxuICAgID4+PiBmYWN0b3JpbnQoZmFjdG9yaW50KHs0OiAyLCAxMjogM30pKSAjIHR3aWNlIHRvIHRvZ2dsZSB0byBkaWN0IGZvcm1cbiAgICB7MjogMTAsIDM6IDN9XG4gICAgPj4+IGZhY3RvcmludChNdWwoNCwgMTIsIGV2YWx1YXRlPUZhbHNlKSlcbiAgICB7MjogNCwgMzogMX1cbiAgICBUaGUgdGFibGUgb2YgdGhlIG91dHB1dCBsb2dpYyBpczpcbiAgICAgICAgPT09PT09ID09PT09PSA9PT09PT09ID09PT09PT1cbiAgICAgICAgICAgICAgICAgICAgICAgVmlzdWFsXG4gICAgICAgIC0tLS0tLSAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgICAgIElucHV0ICBUcnVlICAgRmFsc2UgICBvdGhlclxuICAgICAgICA9PT09PT0gPT09PT09ID09PT09PT0gPT09PT09PVxuICAgICAgICBkaWN0ICAgIG11bCAgICBkaWN0ICAgIG11bFxuICAgICAgICBuICAgICAgIG11bCAgICBkaWN0ICAgIGRpY3RcbiAgICAgICAgbXVsICAgICBtdWwgICAgZGljdCAgICBkaWN0XG4gICAgICAgID09PT09PSA9PT09PT0gPT09PT09PSA9PT09PT09XG4gICAgTm90ZXNcbiAgICA9PT09PVxuICAgIEFsZ29yaXRobTpcbiAgICBUaGUgZnVuY3Rpb24gc3dpdGNoZXMgYmV0d2VlbiBtdWx0aXBsZSBhbGdvcml0aG1zLiBUcmlhbCBkaXZpc2lvblxuICAgIHF1aWNrbHkgZmluZHMgc21hbGwgZmFjdG9ycyAob2YgdGhlIG9yZGVyIDEtNSBkaWdpdHMpLCBhbmQgZmluZHNcbiAgICBhbGwgbGFyZ2UgZmFjdG9ycyBpZiBnaXZlbiBlbm91Z2ggdGltZS4gVGhlIFBvbGxhcmQgcmhvIGFuZCBwLTFcbiAgICBhbGdvcml0aG1zIGFyZSB1c2VkIHRvIGZpbmQgbGFyZ2UgZmFjdG9ycyBhaGVhZCBvZiB0aW1lOyB0aGV5XG4gICAgd2lsbCBvZnRlbiBmaW5kIGZhY3RvcnMgb2YgdGhlIG9yZGVyIG9mIDEwIGRpZ2l0cyB3aXRoaW4gYSBmZXdcbiAgICBzZWNvbmRzOlxuICAgID4+PiBmYWN0b3JzID0gZmFjdG9yaW50KDEyMzQ1Njc4OTEwMTExMjEzMTQxNTE2KVxuICAgID4+PiBmb3IgYmFzZSwgZXhwIGluIHNvcnRlZChmYWN0b3JzLml0ZW1zKCkpOlxuICAgIC4uLiAgICAgcHJpbnQoJyVzICVzJyAlIChiYXNlLCBleHApKVxuICAgIC4uLlxuICAgIDIgMlxuICAgIDI1MDcxOTE2OTEgMVxuICAgIDEyMzEwMjY2MjU3NjkgMVxuICAgIEFueSBvZiB0aGVzZSBtZXRob2RzIGNhbiBvcHRpb25hbGx5IGJlIGRpc2FibGVkIHdpdGggdGhlIGZvbGxvd2luZ1xuICAgIGJvb2xlYW4gcGFyYW1ldGVyczpcbiAgICAgICAgLSBgYHVzZV90cmlhbGBgOiBUb2dnbGUgdXNlIG9mIHRyaWFsIGRpdmlzaW9uXG4gICAgICAgIC0gYGB1c2VfcmhvYGA6IFRvZ2dsZSB1c2Ugb2YgUG9sbGFyZCdzIHJobyBtZXRob2RcbiAgICAgICAgLSBgYHVzZV9wbTFgYDogVG9nZ2xlIHVzZSBvZiBQb2xsYXJkJ3MgcC0xIG1ldGhvZFxuICAgIGBgZmFjdG9yaW50YGAgYWxzbyBwZXJpb2RpY2FsbHkgY2hlY2tzIGlmIHRoZSByZW1haW5pbmcgcGFydCBpc1xuICAgIGEgcHJpbWUgbnVtYmVyIG9yIGEgcGVyZmVjdCBwb3dlciwgYW5kIGluIHRob3NlIGNhc2VzIHN0b3BzLlxuICAgIEZvciB1bmV2YWx1YXRlZCBmYWN0b3JpYWwsIGl0IHVzZXMgTGVnZW5kcmUncyBmb3JtdWxhKHRoZW9yZW0pLlxuICAgIElmIGBgdmVyYm9zZWBgIGlzIHNldCB0byBgYFRydWVgYCwgZGV0YWlsZWQgcHJvZ3Jlc3MgaXMgcHJpbnRlZC5cbiAgICBTZWUgQWxzb1xuICAgID09PT09PT09XG4gICAgc21vb3RobmVzcywgc21vb3RobmVzc19wLCBkaXZpc29yc1xuICAgICovXG4gICAgaWYgKG4gaW5zdGFuY2VvZiBJbnRlZ2VyKSB7XG4gICAgICAgIG4gPSBuLnA7XG4gICAgfVxuICAgIG4gPSBhc19pbnQobik7XG4gICAgaWYgKGxpbWl0KSB7XG4gICAgICAgIGxpbWl0ID0gbGltaXQgYXMgbnVtYmVyO1xuICAgIH1cbiAgICBpZiAobiA8IDApIHtcbiAgICAgICAgY29uc3QgZmFjdG9ycyA9IGZhY3RvcmludCgtbiwgbGltaXQpO1xuICAgICAgICBmYWN0b3JzLmFkZChmYWN0b3JzLnNpemUgLSAxLCAxKTtcbiAgICAgICAgcmV0dXJuIGZhY3RvcnM7XG4gICAgfVxuICAgIGlmIChsaW1pdCAmJiBsaW1pdCA8IDIpIHtcbiAgICAgICAgaWYgKG4gPT09IDEpIHtcbiAgICAgICAgICAgIHJldHVybiBuZXcgSGFzaERpY3QoKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gbmV3IEhhc2hEaWN0KHtuOiAxfSk7XG4gICAgfSBlbHNlIGlmIChuIDwgMTApIHtcbiAgICAgICAgcmV0dXJuIG5ldyBIYXNoRGljdChbezA6IDF9LCB7fSwgezI6IDF9LCB7MzogMX0sIHsyOiAyfSwgezU6IDF9LFxuICAgICAgICAgICAgezI6IDEsIDM6IDF9LCB7NzogMX0sIHsyOiAzfSwgezM6IDJ9XVtuXSk7XG4gICAgfVxuXG4gICAgY29uc3QgZmFjdG9ycyA9IG5ldyBIYXNoRGljdCgpO1xuICAgIGxldCBzbWFsbCA9IDIqKjE1O1xuICAgIGNvbnN0IGZhaWxfbWF4ID0gNjAwO1xuICAgIHNtYWxsID0gTWF0aC5taW4oc21hbGwsIGxpbWl0IHx8IHNtYWxsKTtcbiAgICBsZXQgbmV4dF9wO1xuICAgIFtuLCBuZXh0X3BdID0gX2ZhY3RvcmludF9zbWFsbChmYWN0b3JzLCBuLCBzbWFsbCwgZmFpbF9tYXgpO1xuICAgIGxldCBzcXJ0X246IGFueTtcbiAgICB0cnkge1xuICAgICAgICBpZiAobGltaXQgJiYgbmV4dF9wID4gbGltaXQpIHtcbiAgICAgICAgICAgIF9jaGVja190ZXJtaW5hdGlvbihmYWN0b3JzLCBuLCBsaW1pdCk7XG4gICAgICAgICAgICBpZiAobiA+IDEpIHtcbiAgICAgICAgICAgICAgICBmYWN0b3JzLmFkZChuLCAxKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiBmYWN0b3JzO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgc3FydF9uID0gaW50X250aHJvb3QobiwgMilbMF07XG4gICAgICAgICAgICBsZXQgYSA9IHNxcnRfbiArIDE7XG4gICAgICAgICAgICBjb25zdCBhMiA9IGEqKjI7XG4gICAgICAgICAgICBsZXQgYjIgPSBhMiAtIG47XG4gICAgICAgICAgICBsZXQgYjogYW55OyBsZXQgZmVybWF0OiBhbnk7XG4gICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IDM7IGkrKykge1xuICAgICAgICAgICAgICAgIFtiLCBmZXJtYXRdID0gaW50X250aHJvb3QoYjIsIDIpO1xuICAgICAgICAgICAgICAgIGlmIChmZXJtYXQpIHtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGIyICs9IDIqYSArIDE7XG4gICAgICAgICAgICAgICAgYSsrO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKGZlcm1hdCkge1xuICAgICAgICAgICAgICAgIGlmIChsaW1pdCkge1xuICAgICAgICAgICAgICAgICAgICBsaW1pdCAtPSAxO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBmb3IgKGNvbnN0IHIgb2YgW2EgLSBiLCBhICsgYl0pIHtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgZmFjcyA9IGZhY3RvcmludChyLCBsaW1pdCk7XG4gICAgICAgICAgICAgICAgICAgIGZvciAoY29uc3QgW2ssIHZdIG9mIGZhY3MuZW50cmllcygpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBmYWN0b3JzLmFkZChrLCBmYWN0b3JzLmdldChrLCAwKSArIHYpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcigpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgX2NoZWNrX3Rlcm1pbmF0aW9uKGZhY3RvcnMsIG4sIGxpbWl0KTtcbiAgICAgICAgfVxuICAgIH0gY2F0Y2ggKEVycm9yKSB7XG4gICAgICAgIHJldHVybiBmYWN0b3JzO1xuICAgIH1cblxuICAgIGxldCBbbG93LCBoaWdoXSA9IFtuZXh0X3AsIDIgKiBuZXh0X3BdO1xuICAgIGxpbWl0ID0gKGxpbWl0IHx8IHNxcnRfbikgYXMgbnVtYmVyO1xuICAgIGxpbWl0Kys7XG4gICAgd2hpbGUgKDEpIHtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIGxldCBoaWdoXyA9IGhpZ2g7XG4gICAgICAgICAgICBpZiAobGltaXQgPCBoaWdoXykge1xuICAgICAgICAgICAgICAgIGhpZ2hfID0gbGltaXQ7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBjb25zdCBwcyA9IHByaW1lcmFuZ2UobG93LCBoaWdoXyk7XG4gICAgICAgICAgICBsZXQgZm91bmRfdHJpYWw7XG4gICAgICAgICAgICBbbiwgZm91bmRfdHJpYWxdID0gX3RyaWFsKGZhY3RvcnMsIG4sIHBzKTtcbiAgICAgICAgICAgIGlmIChmb3VuZF90cmlhbCkge1xuICAgICAgICAgICAgICAgIF9jaGVja190ZXJtaW5hdGlvbihmYWN0b3JzLCBuLCBsaW1pdCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoaGlnaCA+IGxpbWl0KSB7XG4gICAgICAgICAgICAgICAgaWYgKG4gPiAxKSB7XG4gICAgICAgICAgICAgICAgICAgIGZhY3RvcnMuYWRkKG4sIDEpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmICghZm91bmRfdHJpYWwpIHtcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJhZHZhbmNlZCBmYWN0b3JpbmcgbWV0aG9kcyBhcmUgbm90IHlldCBpbXBsZW1lbnRlZFwiKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSBjYXRjaCAoRXJyb3IpIHtcbiAgICAgICAgICAgIHJldHVybiBmYWN0b3JzO1xuICAgICAgICB9XG4gICAgICAgIFtsb3csIGhpZ2hdID0gW2hpZ2gsIGhpZ2gqMl07XG4gICAgfVxuICAgIGxldCBCMSA9IDEwMDAwO1xuICAgIGxldCBCMiA9IDEwMCpCMTtcbiAgICBsZXQgbnVtX2N1cnZlcyA9IDUwO1xuICAgIHdoaWxlICgxKSB7XG4gICAgICAgIHdoaWxlICgxKSB7XG4gICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcImVjbSBvbmUgZmFjdG9yIG5vdCB5ZXQgaW1wbGVtZW50ZWRcIik7XG4gICAgICAgICAgICAgICAgLy8gX2NoZWNrX3Rlcm1pbmF0aW9uKGZhY3RvcnMsIG4sIGxpbWl0KTtcbiAgICAgICAgICAgIH0gY2F0Y2ggKEVycm9yKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGZhY3RvcnM7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgQjEgKj0gNTtcbiAgICAgICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5vLXVudXNlZC12YXJzXG4gICAgICAgIEIyID0gMTAwKkIxO1xuICAgICAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tdW51c2VkLXZhcnNcbiAgICAgICAgbnVtX2N1cnZlcyAqPSA0O1xuICAgIH1cbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHBlcmZlY3RfcG93ZXIobjogYW55LCBjYW5kaWRhdGVzOiBhbnkgPSB1bmRlZmluZWQsIGJpZzogYm9vbGVhbiA9IHRydWUsXG4gICAgZmFjdG9yOiBib29sZWFuID0gdHJ1ZSwgbnVtX2l0ZXJhdGlvbnM6IG51bWJlciA9IDE1KTogYW55IHtcbiAgICAvKlxuICAgIFJldHVybiBgYChiLCBlKWBgIHN1Y2ggdGhhdCBgYG5gYCA9PSBgYGIqKmVgYCBpZiBgYG5gYCBpcyBhIHVuaXF1ZVxuICAgIHBlcmZlY3QgcG93ZXIgd2l0aCBgYGUgPiAxYGAsIGVsc2UgYGBGYWxzZWBgIChlLmcuIDEgaXMgbm90IGFcbiAgICBwZXJmZWN0IHBvd2VyKS4gQSBWYWx1ZUVycm9yIGlzIHJhaXNlZCBpZiBgYG5gYCBpcyBub3QgUmF0aW9uYWwuXG4gICAgQnkgZGVmYXVsdCwgdGhlIGJhc2UgaXMgcmVjdXJzaXZlbHkgZGVjb21wb3NlZCBhbmQgdGhlIGV4cG9uZW50c1xuICAgIGNvbGxlY3RlZCBzbyB0aGUgbGFyZ2VzdCBwb3NzaWJsZSBgYGVgYCBpcyBzb3VnaHQuIElmIGBgYmlnPUZhbHNlYGBcbiAgICB0aGVuIHRoZSBzbWFsbGVzdCBwb3NzaWJsZSBgYGVgYCAodGh1cyBwcmltZSkgd2lsbCBiZSBjaG9zZW4uXG4gICAgSWYgYGBmYWN0b3I9VHJ1ZWBgIHRoZW4gc2ltdWx0YW5lb3VzIGZhY3Rvcml6YXRpb24gb2YgYGBuYGAgaXNcbiAgICBhdHRlbXB0ZWQgc2luY2UgZmluZGluZyBhIGZhY3RvciBpbmRpY2F0ZXMgdGhlIG9ubHkgcG9zc2libGUgcm9vdFxuICAgIGZvciBgYG5gYC4gVGhpcyBpcyBUcnVlIGJ5IGRlZmF1bHQgc2luY2Ugb25seSBhIGZldyBzbWFsbCBmYWN0b3JzIHdpbGxcbiAgICBiZSB0ZXN0ZWQgaW4gdGhlIGNvdXJzZSBvZiBzZWFyY2hpbmcgZm9yIHRoZSBwZXJmZWN0IHBvd2VyLlxuICAgIFRoZSB1c2Ugb2YgYGBjYW5kaWRhdGVzYGAgaXMgcHJpbWFyaWx5IGZvciBpbnRlcm5hbCB1c2U7IGlmIHByb3ZpZGVkLFxuICAgIEZhbHNlIHdpbGwgYmUgcmV0dXJuZWQgaWYgYGBuYGAgY2Fubm90IGJlIHdyaXR0ZW4gYXMgYSBwb3dlciB3aXRoIG9uZVxuICAgIG9mIHRoZSBjYW5kaWRhdGVzIGFzIGFuIGV4cG9uZW50IGFuZCBmYWN0b3JpbmcgKGJleW9uZCB0ZXN0aW5nIGZvclxuICAgIGEgZmFjdG9yIG9mIDIpIHdpbGwgbm90IGJlIGF0dGVtcHRlZC5cbiAgICBFeGFtcGxlc1xuICAgID09PT09PT09XG4gICAgPj4+IGZyb20gc3ltcHkgaW1wb3J0IHBlcmZlY3RfcG93ZXIsIFJhdGlvbmFsXG4gICAgPj4+IHBlcmZlY3RfcG93ZXIoMTYpXG4gICAgKDIsIDQpXG4gICAgPj4+IHBlcmZlY3RfcG93ZXIoMTYsIGJpZz1GYWxzZSlcbiAgICAoNCwgMilcbiAgICBOZWdhdGl2ZSBudW1iZXJzIGNhbiBvbmx5IGhhdmUgb2RkIHBlcmZlY3QgcG93ZXJzOlxuICAgID4+PiBwZXJmZWN0X3Bvd2VyKC00KVxuICAgIEZhbHNlXG4gICAgPj4+IHBlcmZlY3RfcG93ZXIoLTgpXG4gICAgKC0yLCAzKVxuICAgIFJhdGlvbmFscyBhcmUgYWxzbyByZWNvZ25pemVkOlxuICAgID4+PiBwZXJmZWN0X3Bvd2VyKFJhdGlvbmFsKDEsIDIpKiozKVxuICAgICgxLzIsIDMpXG4gICAgPj4+IHBlcmZlY3RfcG93ZXIoUmF0aW9uYWwoLTMsIDIpKiozKVxuICAgICgtMy8yLCAzKVxuICAgIE5vdGVzXG4gICAgPT09PT1cbiAgICBUbyBrbm93IHdoZXRoZXIgYW4gaW50ZWdlciBpcyBhIHBlcmZlY3QgcG93ZXIgb2YgMiB1c2VcbiAgICAgICAgPj4+IGlzMnBvdyA9IGxhbWJkYSBuOiBib29sKG4gYW5kIG5vdCBuICYgKG4gLSAxKSlcbiAgICAgICAgPj4+IFsoaSwgaXMycG93KGkpKSBmb3IgaSBpbiByYW5nZSg1KV1cbiAgICAgICAgWygwLCBGYWxzZSksICgxLCBUcnVlKSwgKDIsIFRydWUpLCAoMywgRmFsc2UpLCAoNCwgVHJ1ZSldXG4gICAgSXQgaXMgbm90IG5lY2Vzc2FyeSB0byBwcm92aWRlIGBgY2FuZGlkYXRlc2BgLiBXaGVuIHByb3ZpZGVkXG4gICAgaXQgd2lsbCBiZSBhc3N1bWVkIHRoYXQgdGhleSBhcmUgaW50cy4gVGhlIGZpcnN0IG9uZSB0aGF0IGlzXG4gICAgbGFyZ2VyIHRoYW4gdGhlIGNvbXB1dGVkIG1heGltdW0gcG9zc2libGUgZXhwb25lbnQgd2lsbCBzaWduYWxcbiAgICBmYWlsdXJlIGZvciB0aGUgcm91dGluZS5cbiAgICAgICAgPj4+IHBlcmZlY3RfcG93ZXIoMyoqOCwgWzldKVxuICAgICAgICBGYWxzZVxuICAgICAgICA+Pj4gcGVyZmVjdF9wb3dlcigzKio4LCBbMiwgNCwgOF0pXG4gICAgICAgICgzLCA4KVxuICAgICAgICA+Pj4gcGVyZmVjdF9wb3dlcigzKio4LCBbNCwgOF0sIGJpZz1GYWxzZSlcbiAgICAgICAgKDksIDQpXG4gICAgU2VlIEFsc29cbiAgICA9PT09PT09PVxuICAgIHN5bXB5LmNvcmUucG93ZXIuaW50ZWdlcl9udGhyb290XG4gICAgc3ltcHkubnRoZW9yeS5wcmltZXRlc3QuaXNfc3F1YXJlXG4gICAgKi9cbiAgICBsZXQgcHA7XG4gICAgaWYgKG4gaW5zdGFuY2VvZiBSYXRpb25hbCAmJiAhKG4uaXNfaW50ZWdlcikpIHtcbiAgICAgICAgY29uc3QgW3AsIHFdID0gbi5fYXNfbnVtZXJfZGVub20oKTtcbiAgICAgICAgaWYgKHAgPT09IFMuT25lKSB7XG4gICAgICAgICAgICBwcCA9IHBlcmZlY3RfcG93ZXIocSk7XG4gICAgICAgICAgICBpZiAocHApIHtcbiAgICAgICAgICAgICAgICBwcCA9IFtuLmNvbnN0cnVjdG9yKDEsIHBwWzBdKSwgcHBbMV1dO1xuICAgICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcHAgPSBwZXJmZWN0X3Bvd2VyKHApO1xuICAgICAgICAgICAgaWYgKHBwKSB7XG4gICAgICAgICAgICAgICAgY29uc3QgW251bSwgZV0gPSBwcDtcbiAgICAgICAgICAgICAgICBjb25zdCBwcSA9IHBlcmZlY3RfcG93ZXIocSwgW2VdKTtcbiAgICAgICAgICAgICAgICBpZiAocHEpIHtcbiAgICAgICAgICAgICAgICAgICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5vLXVudXNlZC12YXJzXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IFtkZW4sIGJsYW5rXSA9IHBxO1xuICAgICAgICAgICAgICAgICAgICBwcCA9IFtuLmNvbnN0cnVjdG9yKG51bSwgZGVuKSwgZV07XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBwcDtcbiAgICB9XG5cbiAgICBuID0gYXNfaW50KG4pO1xuICAgIGlmIChuIDwgMCkge1xuICAgICAgICBwcCA9IHBlcmZlY3RfcG93ZXIoLW4pO1xuICAgICAgICBpZiAocHApIHtcbiAgICAgICAgICAgIGNvbnN0IFtiLCBlXSA9IHBwO1xuICAgICAgICAgICAgaWYgKGUgJSAyICE9PSAwKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIFstYiwgZV07XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cblxuICAgIGlmIChuIDw9IDMpIHtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cblxuICAgIGNvbnN0IGxvZ24gPSBNYXRoLmxvZzIobik7XG4gICAgY29uc3QgbWF4X3Bvc3NpYmxlID0gTWF0aC5mbG9vcihsb2duKSArIDI7XG4gICAgY29uc3Qgbm90X3NxdWFyZSA9IFsyLCAzLCA3LCA4XS5pbmNsdWRlcyhuICUgMTApO1xuICAgIGNvbnN0IG1pbl9wb3NzaWJsZSA9IDIgKyAobm90X3NxdWFyZSBhcyBhbnkgYXMgbnVtYmVyKTtcbiAgICBpZiAodHlwZW9mIGNhbmRpZGF0ZXMgPT09IFwidW5kZWZpbmVkXCIpIHtcbiAgICAgICAgY2FuZGlkYXRlcyA9IHByaW1lcmFuZ2UobWluX3Bvc3NpYmxlLCBtYXhfcG9zc2libGUpO1xuICAgIH0gZWxzZSB7XG4gICAgICAgIGNvbnN0IHRlbXAgPSBbXTtcbiAgICAgICAgY2FuZGlkYXRlcy5zb3J0KCk7XG4gICAgICAgIGZvciAoY29uc3QgaSBvZiBjYW5kaWRhdGVzKSB7XG4gICAgICAgICAgICBpZiAobWluX3Bvc3NpYmxlIDw9IGkgJiYgaSA8PSBtYXhfcG9zc2libGUpIHtcbiAgICAgICAgICAgICAgICB0ZW1wLnB1c2goaSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgY2FuZGlkYXRlcyA9IHRlbXA7XG4gICAgICAgIGlmIChuICUgMiA9PT0gMCkge1xuICAgICAgICAgICAgY29uc3QgZSA9IHRyYWlsaW5nKG4pO1xuICAgICAgICAgICAgY29uc3QgdGVtcDIgPSBbXTtcbiAgICAgICAgICAgIGZvciAoY29uc3QgaSBvZiBjYW5kaWRhdGVzKSB7XG4gICAgICAgICAgICAgICAgaWYgKGUgJSBpID09PSAwKSB7XG4gICAgICAgICAgICAgICAgICAgIHRlbXAyLnB1c2goaSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgY2FuZGlkYXRlcyA9IHRlbXAyO1xuICAgICAgICB9XG4gICAgICAgIGlmIChiaWcpIHtcbiAgICAgICAgICAgIGNhbmRpZGF0ZXMucmV2ZXJzZSgpO1xuICAgICAgICB9XG4gICAgICAgIGZvciAoY29uc3QgZSBvZiBjYW5kaWRhdGVzKSB7XG4gICAgICAgICAgICBjb25zdCBbciwgb2tdID0gaW50X250aHJvb3QobiwgZSk7XG4gICAgICAgICAgICBpZiAob2spIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gW3IsIGVdO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gICAgZnVuY3Rpb24qIF9mYWN0b3JzKGxlbmd0aDogbnVtYmVyKSB7XG4gICAgICAgIGxldCBydiA9IDIgKyBuICUgMjtcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBsZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgeWllbGQgcnY7XG4gICAgICAgICAgICBydiA9IG5leHRwcmltZShydik7XG4gICAgICAgIH1cbiAgICB9XG4gICAgLy8gb3JpZ2luYWwgYWxnb3JpdGhtIGdlbmVyYXRlcyBpbmZpbml0ZSBzZXF1ZW5jZXMgb2YgdGhlIGZvbGxvd2luZ1xuICAgIC8vIGZvciBub3cgd2Ugd2lsbCBnZW5lcmF0ZSBsaW1pdGVkIHNpemVkIGFycmF5cyBhbmQgdXNlIHRob3NlXG4gICAgY29uc3QgX2NhbmRpZGF0ZXMgPSBbXTtcbiAgICBmb3IgKGNvbnN0IGkgb2YgY2FuZGlkYXRlcykge1xuICAgICAgICBfY2FuZGlkYXRlcy5wdXNoKGkpO1xuICAgIH1cbiAgICBjb25zdCBfZmFjdG9yc18gPSBbXTtcbiAgICBmb3IgKGNvbnN0IGkgb2YgX2ZhY3RvcnMoX2NhbmRpZGF0ZXMubGVuZ3RoKSkge1xuICAgICAgICBfZmFjdG9yc18ucHVzaChpKTtcbiAgICB9XG4gICAgZm9yIChjb25zdCBpdGVtIG9mIFV0aWwuemlwKF9mYWN0b3JzXywgX2NhbmRpZGF0ZXMpKSB7XG4gICAgICAgIGNvbnN0IGZhYyA9IGl0ZW1bMF07XG4gICAgICAgIGxldCBlID0gaXRlbVsxXTtcbiAgICAgICAgbGV0IHI7XG4gICAgICAgIGxldCBleGFjdDtcbiAgICAgICAgaWYgKGZhY3RvciAmJiBuICUgZmFjID09PSAwKSB7XG4gICAgICAgICAgICBpZiAoZmFjID09PSAyKSB7XG4gICAgICAgICAgICAgICAgZSA9IHRyYWlsaW5nKG4pO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBlID0gbXVsdGlwbGljaXR5KGZhYywgbik7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoZSA9PT0gMSkge1xuICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgW3IsIGV4YWN0XSA9IGludF9udGhyb290KG4sIGUpO1xuICAgICAgICAgICAgaWYgKCEoZXhhY3QpKSB7XG4gICAgICAgICAgICAgICAgY29uc3QgbSA9IE1hdGguZmxvb3IobiAvIGZhYykgKiogZTtcbiAgICAgICAgICAgICAgICBjb25zdCByRSA9IHBlcmZlY3RfcG93ZXIobSwgZGl2aXNvcnMoZSwgdHJ1ZSkpO1xuICAgICAgICAgICAgICAgIGlmICghKHJFKSkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgbGV0IFtyLCBFXSA9IHJFO1xuICAgICAgICAgICAgICAgICAgICBbciwgZV0gPSBbZmFjKiooTWF0aC5mbG9vcihlL0UpKnIpLCBFXTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gW3IsIGVdO1xuICAgICAgICB9XG4gICAgICAgIGlmIChsb2duL2UgPCA0MCkge1xuICAgICAgICAgICAgY29uc3QgYiA9IDIuMCoqKGxvZ24vZSk7XG4gICAgICAgICAgICBpZiAoTWF0aC5hYnMoTWF0aC5mbG9vcihiICsgMC41KSAtIGIpID4gMC4wMSkge1xuICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIFtyLCBleGFjdF0gPSBpbnRfbnRocm9vdChuLCBlKTtcbiAgICAgICAgaWYgKGV4YWN0KSB7XG4gICAgICAgICAgICBjb25zdCBtID0gcGVyZmVjdF9wb3dlcihyLCB1bmRlZmluZWQsIGJpZywgZmFjdG9yKTtcbiAgICAgICAgICAgIGlmIChtKSB7XG4gICAgICAgICAgICAgICAgW3IsIGVdID0gW21bMF0sIGUgKiBtWzFdXTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiBbTWF0aC5mbG9vcihyKSwgZV07XG4gICAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIGZhbHNlO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gZmFjdG9ycmF0KHJhdDogYW55LCBsaW1pdDogbnVtYmVyID0gdW5kZWZpbmVkKSB7XG4gICAgLypcbiAgICBHaXZlbiBhIFJhdGlvbmFsIGBgcmBgLCBgYGZhY3RvcnJhdChyKWBgIHJldHVybnMgYSBkaWN0IGNvbnRhaW5pbmdcbiAgICB0aGUgcHJpbWUgZmFjdG9ycyBvZiBgYHJgYCBhcyBrZXlzIGFuZCB0aGVpciByZXNwZWN0aXZlIG11bHRpcGxpY2l0aWVzXG4gICAgYXMgdmFsdWVzLiBGb3IgZXhhbXBsZTpcbiAgICA+Pj4gZnJvbSBzeW1weSBpbXBvcnQgZmFjdG9ycmF0LCBTXG4gICAgPj4+IGZhY3RvcnJhdChTKDgpLzkpICAgICMgOC85ID0gKDIqKjMpICogKDMqKi0yKVxuICAgIHsyOiAzLCAzOiAtMn1cbiAgICA+Pj4gZmFjdG9ycmF0KFMoLTEpLzk4NykgICAgIyAtMS83ODkgPSAtMSAqICgzKiotMSkgKiAoNyoqLTEpICogKDQ3KiotMSlcbiAgICB7LTE6IDEsIDM6IC0xLCA3OiAtMSwgNDc6IC0xfVxuICAgIFBsZWFzZSBzZWUgdGhlIGRvY3N0cmluZyBmb3IgYGBmYWN0b3JpbnRgYCBmb3IgZGV0YWlsZWQgZXhwbGFuYXRpb25zXG4gICAgYW5kIGV4YW1wbGVzIG9mIHRoZSBmb2xsb3dpbmcga2V5d29yZHM6XG4gICAgICAgIC0gYGBsaW1pdGBgOiBJbnRlZ2VyIGxpbWl0IHVwIHRvIHdoaWNoIHRyaWFsIGRpdmlzaW9uIGlzIGRvbmVcbiAgICAgICAgLSBgYHVzZV90cmlhbGBgOiBUb2dnbGUgdXNlIG9mIHRyaWFsIGRpdmlzaW9uXG4gICAgICAgIC0gYGB1c2VfcmhvYGA6IFRvZ2dsZSB1c2Ugb2YgUG9sbGFyZCdzIHJobyBtZXRob2RcbiAgICAgICAgLSBgYHVzZV9wbTFgYDogVG9nZ2xlIHVzZSBvZiBQb2xsYXJkJ3MgcC0xIG1ldGhvZFxuICAgICAgICAtIGBgdmVyYm9zZWBgOiBUb2dnbGUgZGV0YWlsZWQgcHJpbnRpbmcgb2YgcHJvZ3Jlc3NcbiAgICAgICAgLSBgYG11bHRpcGxlYGA6IFRvZ2dsZSByZXR1cm5pbmcgYSBsaXN0IG9mIGZhY3RvcnMgb3IgZGljdFxuICAgICAgICAtIGBgdmlzdWFsYGA6IFRvZ2dsZSBwcm9kdWN0IGZvcm0gb2Ygb3V0cHV0XG4gICAgKi9cbiAgICBjb25zdCBmID0gZmFjdG9yaW50KHJhdC5wLCBsaW1pdCk7XG4gICAgZm9yIChjb25zdCBpdGVtIG9mIGZhY3RvcmludChyYXQucSwgbGltaXQpLmVudHJpZXMoKSkge1xuICAgICAgICBjb25zdCBwID0gaXRlbVswXTtcbiAgICAgICAgY29uc3QgZSA9IGl0ZW1bMV07XG4gICAgICAgIGYuYWRkKHAsIGYuZ2V0KHAsIDApIC0gZSk7XG4gICAgfVxuICAgIGlmIChmLnNpemUgPiAxICYmIGYuaGFzKDEpKSB7XG4gICAgICAgIGYucmVtb3ZlKDEpO1xuICAgIH1cbiAgICByZXR1cm4gZjtcbn1cbiIsICIvKlxuTm90YWJsZSBjaGFuZ2VzIG1hZGUgKGFuZCBub3Rlcyk6XG4tIEJhcmVib25lcyBpbXBsZW1lbnRhdGlvbiAtIG9ubHkgZW5vdWdoIGFzIG5lZWRlZCBmb3Igc3ltYm9sXG4qL1xuXG5pbXBvcnQge19CYXNpY30gZnJvbSBcIi4vYmFzaWNcIjtcbmltcG9ydCB7Qm9vbGVhbktpbmR9IGZyb20gXCIuL2tpbmRcIjtcbmltcG9ydCB7YmFzZSwgbWl4fSBmcm9tIFwiLi91dGlsaXR5XCI7XG5pbXBvcnQge01hbmFnZWRQcm9wZXJ0aWVzfSBmcm9tIFwiLi9hc3N1bXB0aW9uc1wiO1xuXG5jb25zdCBCb29sZWFuID0gKHN1cGVyY2xhc3M6IGFueSkgPT4gY2xhc3MgQm9vbGVhbiBleHRlbmRzIG1peChiYXNlKS53aXRoKF9CYXNpYykge1xuICAgIF9fc2xvdHNfXzogYW55W10gPSBbXTtcblxuICAgIHN0YXRpYyBraW5kID0gQm9vbGVhbktpbmQ7XG59O1xuXG5NYW5hZ2VkUHJvcGVydGllcy5yZWdpc3RlcihCb29sZWFuKE9iamVjdCkpO1xuXG5leHBvcnQge0Jvb2xlYW59O1xuIiwgIi8qXG5Ob3RhYmxlIGNoYW5nZXNcbi0gU3RpbGwgYSB3b3JrIGluIHByb2dyZXNzIChub3QgYWxsIG1ldGhvZHMgaW1wbGVtZW50ZWQpXG4tIENsYXNzIHN0cnVjdHVyZSByZXdvcmtlZCBiYXNlZCBvbiBhIGNvbnN0cnVjdG9yIHN5c3RlbSAodmlldyBzb3VyY2UpXG4qL1xuXG5pbXBvcnQge21peCwgYmFzZSwgSGFzaERpY3R9IGZyb20gXCIuL3V0aWxpdHlcIjtcbmltcG9ydCB7QXRvbWljRXhwcn0gZnJvbSBcIi4vZXhwclwiO1xuaW1wb3J0IHtCb29sZWFufSBmcm9tIFwiLi9ib29sYWxnXCI7XG5pbXBvcnQge051bWJlcktpbmQsIFVuZGVmaW5lZEtpbmR9IGZyb20gXCIuL2tpbmRcIjtcbmltcG9ydCB7ZnV6enlfYm9vbF92Mn0gZnJvbSBcIi4vbG9naWNcIjtcbmltcG9ydCB7U3RkRmFjdEtCfSBmcm9tIFwiLi9hc3N1bXB0aW9uc1wiO1xuaW1wb3J0IHtNYW5hZ2VkUHJvcGVydGllc30gZnJvbSBcIi4vYXNzdW1wdGlvbnNcIjtcblxuXG5jbGFzcyBTeW1ib2wgZXh0ZW5kcyBtaXgoYmFzZSkud2l0aChCb29sZWFuLCBBdG9taWNFeHByKSB7XG4gICAgLypcbiAgICBBc3N1bXB0aW9uczpcbiAgICAgICBjb21tdXRhdGl2ZSA9IFRydWVcbiAgICBZb3UgY2FuIG92ZXJyaWRlIHRoZSBkZWZhdWx0IGFzc3VtcHRpb25zIGluIHRoZSBjb25zdHJ1Y3Rvci5cbiAgICBFeGFtcGxlc1xuICAgID09PT09PT09XG4gICAgPj4+IGZyb20gc3ltcHkgaW1wb3J0IHN5bWJvbHNcbiAgICA+Pj4gQSxCID0gc3ltYm9scygnQSxCJywgY29tbXV0YXRpdmUgPSBGYWxzZSlcbiAgICA+Pj4gYm9vbChBKkIgIT0gQipBKVxuICAgIFRydWVcbiAgICA+Pj4gYm9vbChBKkIqMiA9PSAyKkEqQikgPT0gVHJ1ZSAjIG11bHRpcGxpY2F0aW9uIGJ5IHNjYWxhcnMgaXMgY29tbXV0YXRpdmVcbiAgICBUcnVlXG4gICAgKi9cblxuICAgIHN0YXRpYyBpc19jb21wYXJhYmxlID0gZmFsc2U7XG5cbiAgICBfX3Nsb3RzX18gPSBbXCJuYW1lXCJdO1xuXG4gICAgbmFtZTogc3RyaW5nO1xuXG4gICAgc3RhdGljIGlzX1N5bWJvbCA9IHRydWU7XG5cbiAgICBzdGF0aWMgaXNfc3ltYm9sID0gdHJ1ZTtcblxuICAgIHN0YXRpYyBpc19jb21tdXRhdGl2ZSA9IHRydWU7XG5cbiAgICBhcmdzOiBhbnlbXTtcblxuICAgIGtpbmQoKSB7XG4gICAgICAgIGlmICgodGhpcy5jb25zdHJ1Y3RvciBhcyBhbnkpLmlzX2NvbW11dGF0aXZlKSB7XG4gICAgICAgICAgICByZXR1cm4gTnVtYmVyS2luZDtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gVW5kZWZpbmVkS2luZDtcbiAgICB9XG5cbiAgICBfZGlmZl93cnQoKSB7XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cblxuICAgIGhhc2hLZXkoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLm5hbWUgKyB0aGlzLmFyZ3M7XG4gICAgfVxuXG4gICAgY29uc3RydWN0b3IobmFtZTogYW55LCBwcm9wZXJ0aWVzOiBSZWNvcmQ8YW55LCBhbnk+ID0gdW5kZWZpbmVkKSB7XG4gICAgICAgIHN1cGVyKCk7XG4gICAgICAgIHRoaXMubmFtZSA9IG5hbWU7XG5cbiAgICAgICAgLy8gYWRkIHVzZXIgYXNzdW1wdGlvbnNcbiAgICAgICAgY29uc3QgYXNzdW1wdGlvbnM6IEhhc2hEaWN0ID0gbmV3IEhhc2hEaWN0KHByb3BlcnRpZXMpO1xuICAgICAgICBTeW1ib2wuX3Nhbml0aXplKGFzc3VtcHRpb25zKTtcbiAgICAgICAgY29uc3QgdG1wX2FzbV9jb3B5ID0gYXNzdW1wdGlvbnMuY29weSgpO1xuXG4gICAgICAgIC8vIHN0cmljdCBjb21tdXRhdGl2aXR5XG4gICAgICAgIGNvbnN0IGlzX2NvbW11dGF0aXZlID0gZnV6enlfYm9vbF92Mihhc3N1bXB0aW9ucy5nZXQoXCJjb21tdXRhdGl2ZVwiLCB0cnVlKSk7XG4gICAgICAgIGFzc3VtcHRpb25zLmFkZChcImlzX2NvbW11dGF0aXZlXCIsIGlzX2NvbW11dGF0aXZlKTtcblxuICAgICAgICAvLyBNZXJnZSB3aXRoIG9iamVjdCBhc3N1bXB0aW9ucyBhbmQgcmVhc3NpZ24gb2JqZWN0IHByb3BlcnRpZXNcbiAgICAgICAgdGhpcy5fYXNzdW1wdGlvbnMubWVyZ2UoYXNzdW1wdGlvbnMpO1xuICAgICAgICB0aGlzLl9hc3N1bXB0aW9ucy5fZ2VuZXJhdG9yID0gdG1wX2FzbV9jb3B5O1xuICAgICAgICBzdXBlci5hc3NpZ25Qcm9wcygpO1xuICAgIH1cblxuICAgIGVxdWFscyhvdGhlcjogU3ltYm9sKSB7XG4gICAgICAgIGlmICh0aGlzLm5hbWUgPSBvdGhlci5uYW1lKSB7XG4gICAgICAgICAgICBpZiAodGhpcy5fYXNzdW1wdGlvbnMuaXNTYW1lKG90aGVyLl9hc3N1bXB0aW9ucykpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuXG4gICAgc3RhdGljIF9zYW5pdGl6ZShhc3N1bXB0aW9uczogSGFzaERpY3QgPSBuZXcgSGFzaERpY3QoKSkge1xuICAgICAgICAvLyByZW1vdmUgbm9uZSwgY29udmVydCB2YWx1ZXMgdG8gYm9vbCwgY2hlY2sgY29tbXV0YXRpdml0eSAqaW4gcGxhY2UqXG5cbiAgICAgICAgLy8gYmUgc3RyaWN0IGFib3V0IGNvbW11dGF0aXZpdHk6IGNhbm5vdCBiZSB1bmRlZmluZWRcbiAgICAgICAgY29uc3QgaXNfY29tbXV0YXRpdmUgPSBmdXp6eV9ib29sX3YyKGFzc3VtcHRpb25zLmdldChcImNvbW11dGF0aXZlXCIsIHRydWUpKTtcbiAgICAgICAgaWYgKHR5cGVvZiBpc19jb21tdXRhdGl2ZSA9PT0gXCJ1bmRlZmluZWRcIikge1xuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiY29tbXV0YXRpdml0eSBtdXN0IGJlIHRydWUgb3IgZmFsc2VcIik7XG4gICAgICAgIH1cbiAgICAgICAgZm9yIChjb25zdCBrZXkgb2YgYXNzdW1wdGlvbnMua2V5cygpKSB7XG4gICAgICAgICAgICBjb25zdCB2ID0gYXNzdW1wdGlvbnMuZ2V0KGtleSk7XG4gICAgICAgICAgICBpZiAodHlwZW9mIHYgPT09IFwidW5kZWZpbmVkXCIpIHtcbiAgICAgICAgICAgICAgICBhc3N1bXB0aW9ucy5kZWxldGUoa2V5KTtcbiAgICAgICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGFzc3VtcHRpb25zLmFkZChrZXksIHYgYXMgYm9vbGVhbik7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICB0b1N0cmluZygpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMubmFtZTtcbiAgICB9XG59XG5cbi8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBuZXctY2FwXG5NYW5hZ2VkUHJvcGVydGllcy5yZWdpc3RlcihTeW1ib2wpO1xuXG5leHBvcnQge1N5bWJvbH07XG4iLCAiaW1wb3J0IHtmYWN0b3JpbnQsIGZhY3RvcnJhdH0gZnJvbSBcIi4vbnRoZW9yeS9mYWN0b3JfLmpzXCI7XG5pbXBvcnQge0FkZH0gZnJvbSBcIi4vY29yZS9hZGQuanNcIjtcbmltcG9ydCB7TXVsfSBmcm9tIFwiLi9jb3JlL211bC5qc1wiO1xuaW1wb3J0IHtfTnVtYmVyX30gZnJvbSBcIi4vY29yZS9udW1iZXJzLmpzXCI7XG5pbXBvcnQge1Bvd30gZnJvbSBcIi4vY29yZS9wb3dlci5qc1wiO1xuaW1wb3J0IHtTfSBmcm9tIFwiLi9jb3JlL3NpbmdsZXRvbi5qc1wiO1xuaW1wb3J0IHtTeW1ib2x9IGZyb20gXCIuL2NvcmUvc3ltYm9sLmpzXCI7XG5cbi8vIERlZmluZSBpbnRlZ2VycywgcmF0aW9uYWxzLCBmbG9hdHMsIGFuZCBzeW1ib2xzXG5sZXQgbiA9IF9OdW1iZXJfLm5ldyg0KTtcbmxldCB4OmFueSA9IG5ldyBTeW1ib2woXCJ4XCIpO1xueCA9IG5ldyBBZGQodHJ1ZSwgdHJ1ZSwgbiwgbiwgeCk7XG54ID0gbmV3IE11bCh0cnVlLCB0cnVlLCBuLCBuLCB4KTtcbnggPSBuZXcgUG93KG4sIG4pO1xuY29uc3QgYmlnaW50ID0gX051bWJlcl8ubmV3KDI4NSk7XG54ID0gZmFjdG9yaW50KGJpZ2ludCk7XG5jb25zdCBiaWdyYXQgPSBfTnVtYmVyXy5uZXcoMjcxLCA5MzIpO1xueCA9IGZhY3RvcnJhdChiaWdyYXQpO1xuXG54ID0gbmV3IFBvdyhuLCBTLk5hTik7XG5cbiJdLAogICJtYXBwaW5ncyI6ICI7O0FBTUEsTUFBTSxPQUFOLE1BQVc7QUFBQSxJQUdQLE9BQU8sUUFBUUEsSUFBZ0I7QUFDM0IsVUFBSSxPQUFPQSxPQUFNLGFBQWE7QUFDMUIsZUFBTztBQUFBLE1BQ1g7QUFDQSxVQUFJQSxHQUFFLFNBQVM7QUFDWCxlQUFPQSxHQUFFLFFBQVE7QUFBQSxNQUNyQjtBQUNBLFVBQUksTUFBTSxRQUFRQSxFQUFDLEdBQUc7QUFDbEIsZUFBT0EsR0FBRSxJQUFJLENBQUMsTUFBTSxLQUFLLFFBQVEsQ0FBQyxDQUFDLEVBQUUsS0FBSyxHQUFHO0FBQUEsTUFDakQ7QUFDQSxVQUFJQSxPQUFNLE1BQU07QUFDWixlQUFPO0FBQUEsTUFDWDtBQUNBLGFBQU9BLEdBQUUsU0FBUztBQUFBLElBQ3RCO0FBQUEsSUFHQSxPQUFPLFNBQVMsTUFBYSxNQUFzQjtBQUMvQyxZQUFNLFVBQVUsS0FBSyxJQUFJLENBQUMsTUFBVyxLQUFLLFFB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QUc7QUFDcEMsTUFBSSxVQUFVLE1BQU07QUFFcEIsTUFBSSxJQUFJLElBQUksR0FBRyxFQUFFLEdBQUc7IiwKICAibmFtZXMiOiBbIngiLCAibiIsICJleHAiLCAieCIsICJ4IiwgImltcGwiLCAiaXRlbSIsICJQIiwgInNlbGYiLCAiYmFzZSIsICJzZWxmIiwgIm9sZCIsICJfbmV3IiwgInJ2IiwgIm4iLCAibW9kIiwgIkVycm9yIiwgImNzZXQiLCAieCIsICJuIiwgIl9BdG9taWNFeHByIiwgIm9iaiIsICJjX3Bvd2VycyIsICJpIiwgIm4iLCAiY19wYXJ0IiwgImNvZWZmX3NpZ24iLCAic2lnbiIsICJ4IiwgIm1pbiIsICJtYXgiLCAibiIsICJiYXNlIiwgInNpZ24iLCAicG93IiwgInN1bSIsICJ4MiIsICJEZWNpbWFsIiwgImkiLCAieCIsICJuIiwgIl9BdG9taWNFeHByIiwgIngiLCAicmVzdWx0IiwgIk5hTiIsICJfQXRvbWljRXhwciIsICJuIiwgInQiLCAiRXJyb3IiLCAiYmFzZSIsICJleHAiLCAiZCIsICJmYWN0b3JzIiwgInIiLCAiQm9vbGVhbiIsICJCb29sZWFuIiwgIlN5bWJvbCIsICJTeW1ib2wiXQp9Cg==
