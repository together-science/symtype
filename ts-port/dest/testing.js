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
      for (const e of arr1) {
        if (!arr2.includes(e)) {
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
      const res = [];
      let s = Object.getPrototypeOf(cls);
      while (s.constructor.name !== "Object") {
        res.push(s.name);
        s = Object.getPrototypeOf(s);
      }
      return res;
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
  function fuzzy_bool_v2(x) {
    if (typeof x === "undefined") {
      return null;
    }
    if (x === true) {
      return true;
    }
    if (x === false) {
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
      this.args = args;
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
          lexpr = _Logic.op_2class[schedop](lexpr, flexTerm);
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
      return And.__new__(And.prototype, ...args);
    },
    "|": (...args) => {
      return Or.__new__(Or.prototype, ...args);
    },
    "!": (arg) => {
      return Not.__new__(Not.prototype, arg);
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
    static __new__(cls, ...args) {
      const bargs = [];
      for (const a of args) {
        if (a == cls.get_op_x_notx()) {
          return a;
        } else if (a == !cls.get_op_x_notx()) {
          continue;
        }
        bargs.push(a);
      }
      args = AndOr_Base.flatten(bargs);
      const args_set = new Set(args.map((e) => Util.hashKey(e)));
      for (const a of args) {
        if (args_set.has(Not.New(a).hashKey())) {
          return cls.get_op_x_notx();
        }
      }
      if (args.length == 1) {
        return args.pop();
      } else if (args.length == 0) {
        if (cls.get_op_x_notx() instanceof True) {
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
      return res;
    }
  };
  var And = class extends AndOr_Base {
    static New(...args) {
      return super.__new__(And, args);
    }
    get_op_x_notx() {
      return Logic.False;
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
      return super.__new__(Or, args);
    }
    get_op_x_notx() {
      return Logic.True;
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
  function _as_pair(atom) {
    if (atom instanceof Not) {
      return new Implication(atom.arg(), Logic.False);
    } else {
      return new Implication(atom, Logic.True);
    }
  }
  function transitive_closure(implications) {
    const full_implications = new HashSet(implications);
    const literals = new Set(implications.flat());
    for (const k of literals) {
      for (const i of literals) {
        if (full_implications.has(new Implication(i, k))) {
          for (const j of literals) {
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
      newset.add(alpha_implications.get(x));
      const imp = new Implication(newset, []);
      x_impl.add(x, imp);
    }
    for (const item of beta_rules) {
      const bcond = item[0];
      for (const bk of bcond.args) {
        if (x_impl.has(bk)) {
          continue;
        }
        const imp = new Implication(new HashSet(), []);
        x_impl.add(imp.p, imp.q);
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
          const x_all = ximpls.clone().add(x);
          if (!x_all.includes(bimpl) && Util.isSubset(bargs.toArray(), x_all)) {
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
        const x_all = ximpls.clone().add(x);
        if (x_all.has(bimpl)) {
          continue;
        }
        if (x_all.some((e) => bargs.has(Not.New(e)) || Not.New(e) === bimpl)) {
          continue;
        }
        if (bargs && x_all) {
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
        prereq.get(i).add(a);
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
      if (b instanceof True || b instanceof False) {
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
          const brest = [...b.args].splice(bidx, 1);
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
        let [a, op, b] = rule.split(" ", 3);
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
      const beta_triggers = new SetDefaultDict();
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
        prereq.get(k).add(pitems);
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
            this._tell(item2[0], item2[1]);
          }
          const currimp = beta_triggers.get(new Implication(k, v));
          if (!currimp.isEmpty()) {
            beta_maytrigger.add(beta_triggers.get(new Implication(k, v)));
          }
        }
        facts = [];
        for (const bidx of beta_maytrigger.toArray()) {
          const [bcond, bimpl] = beta_rules[bidx];
          for (const item of bcond) {
            const k = item[0];
            const v = item[1];
            if (this.get(k) !== v) {
              continue;
            }
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
    obj[as_property(fact)] = getit;
    function getit() {
      if (typeof obj._assumptions[fact] !== "undefined") {
        return obj._assumptions[fact];
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
      for (const k of _assume_defined.toArray()) {
        const attrname = as_property(k);
        if (attrname in cls) {
          let v = cls[attrname];
          if (typeof v === "number" && Number.isInteger(v) || typeof v === "boolean" || typeof v === "undefined") {
            if (typeof v !== "undefined") {
              v = !!v;
            }
            local_defs.add(k, v);
          }
        }
      }
      this.all_explicit_assumptions.merge(local_defs);
      cls._explicit_class_assumptions = this.all_explicit_assumptions;
      cls.default_assumptions = new StdFactKB(this.all_explicit_assumptions);
      for (const item of cls.default_assumptions.entries()) {
        cls[as_property(item[0])] = item[1];
      }
      const s = new HashSet();
      s.addArr(cls.default_assumptions.keys());
      this.all_default_assumptions.addArr(cls.default_assumptions.keys());
      for (const fact of this.all_default_assumptions.difference(s).toArray()) {
        const pname = as_property(fact);
        if (!(pname in cls)) {
          make_property(cls, fact);
        }
      }
      const alldefs = new HashSet(Object.keys(cls));
      for (const fact of alldefs.difference(cls.default_assumptions).toArray()) {
        cls.default_assumptions.add(fact, cls[fact]);
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
          const pname = as_property(fact);
          if (typeof cls[pname] === "undefined") {
            make_property(this, fact);
          }
        }
        function getSupers(cls2) {
          const superclasses = [];
          const superclass2 = Object.getPrototypeOf(cls2);
          if (superclass2 !== null && superclass2 !== Object.prototype) {
            superclasses.push(superclass2);
            const parentSuperclasses = getSupers(superclass2);
            superclasses.push(...parentSuperclasses);
          }
          return superclasses;
        }
        const currentStaticVars = Object.getOwnPropertyNames(cls).filter((prop) => prop.includes("is_"));
        for (const prop of currentStaticVars) {
          this[prop] = () => cls[prop];
        }
        const supers = getSupers(cls);
        for (const supercls of supers) {
          const superclassStaticVars = Object.getOwnPropertyNames(supercls).filter((prop) => prop.includes("is_"));
          for (const prop of superclassStaticVars) {
            if (typeof this[prop] == "undefined") {
              this[prop] = () => cls[prop];
            }
          }
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
      _eval_nseries(x, n2, logx, cdor = 0) {
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
            input.push(a.is_commutative);
          }
          is_commutative = fuzzy_and_v2(input);
        }
        obj.is_commutative = is_commutative;
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
    function* rec_gen(n4 = 0) {
      if (n4 === ps.length) {
        yield 1;
      } else {
        const pows = [1];
        for (let j = 0; j < factordict.get(ps[n4]); j++) {
          pows.push(pows[pows.length - 1] * ps[n4]);
        }
        for (const q of rec_gen(n4 + 1)) {
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
    function done(n4, d2) {
      if (d2 * d2 <= n4) {
        return [n4, d2];
      }
      return [n4, 0];
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
            if (b.constructor.is_positive || b.is_positive()) {
              return S.Infinity;
            } else if (b.constructor.is_zero) {
              return S.Zero;
            } else {
              if (b.is_finite() || b.constructor.is_finite) {
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
          } else if ((e.constructor.is_Symbol && e.constructor.is_integer || e.constructor.is_Integer && (b.constructor.is_Number && b.constructor.is_Mul || b.constructor.is_Number)) && e.is_extended_negative === true) {
            if (e.is_even() || e.constructor.is_even) {
              b = b.__mul__(S.NegativeOne);
            } else {
              return new _Pow(b.__mul__(S.NegativeOne), e).__mul__(S.NegativeOne);
            }
          }
          if (b === S.NaN || e === S.NaN) {
            return S.NaN;
          } else if (b === S.One) {
            if (e.is_infinite()) {
              return S.NaN;
            }
            return S.One;
          } else if (e.constructor.is_Number && b.constructor.is_Number) {
            const obj = b._eval_power(e);
            if (typeof obj !== "undefined") {
              obj.is_commutative = b.constructor.is_commutative && e.constructor.is_commutative;
              return obj;
            }
          }
        }
      }
      this.is_commutative = b.constructor.is_commutative && e.constructor.is_commutative;
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
                pnew.add(ei, pnew.get(ei).push(bi));
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
      for (const [b, e] of pnew.entries()) {
        c_part_argv2.push(new Pow(b, e));
      }
      c_part.push(...c_part_argv2);
      if (coeff === S.Infinity || coeff === S.NegativeInfinity) {
        let _handle_for_oo = function(c_part2, coeff_sign2) {
          const new_c_part = [];
          for (const t of c_part2) {
            if (t.is_extended_negative) {
              continue;
            }
            if (t.is_extended_negative) {
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
      } else if (factors.constructor.isAdd) {
        if (!clear && coeff.constructor.is_Rational && coeff.q !== 1) {
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
            if (c.constructor.is_Integer) {
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
      } else if (factors.constructor.isMul) {
        const margs = factors._args;
        if (margs[0].constructor.is_Number) {
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
        if (m.constructor.is_Number && !factors.constructor.is_Number) {
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
        allargs.push(a.constructor.is_commutative);
      }
      return _fuzzy_groupv2(allargs);
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
        } else if (o.is_Pow) {
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
    var x = new this.constructor(this);
    if (x.s < 0)
      x.s = 1;
    return finalise(x);
  };
  P.ceil = function() {
    return finalise(new this.constructor(this), this.e + 1, 2);
  };
  P.clampedTo = P.clamp = function(min2, max2) {
    var k, x = this, Ctor = x.constructor;
    min2 = new Ctor(min2);
    max2 = new Ctor(max2);
    if (!min2.s || !max2.s)
      return new Ctor(NaN);
    if (min2.gt(max2))
      throw Error(invalidArgument + max2);
    k = x.cmp(min2);
    return k < 0 ? min2 : x.cmp(max2) > 0 ? max2 : new Ctor(x);
  };
  P.comparedTo = P.cmp = function(y) {
    var i, j, xdL, ydL, x = this, xd = x.d, yd = (y = new x.constructor(y)).d, xs = x.s, ys = y.s;
    if (!xd || !yd) {
      return !xs || !ys ? NaN : xs !== ys ? xs : xd === yd ? 0 : !xd ^ xs < 0 ? 1 : -1;
    }
    if (!xd[0] || !yd[0])
      return xd[0] ? xs : yd[0] ? -ys : 0;
    if (xs !== ys)
      return xs;
    if (x.e !== y.e)
      return x.e > y.e ^ xs < 0 ? 1 : -1;
    xdL = xd.length;
    ydL = yd.length;
    for (i = 0, j = xdL < ydL ? xdL : ydL; i < j; ++i) {
      if (xd[i] !== yd[i])
        return xd[i] > yd[i] ^ xs < 0 ? 1 : -1;
    }
    return xdL === ydL ? 0 : xdL > ydL ^ xs < 0 ? 1 : -1;
  };
  P.cosine = P.cos = function() {
    var pr, rm, x = this, Ctor = x.constructor;
    if (!x.d)
      return new Ctor(NaN);
    if (!x.d[0])
      return new Ctor(1);
    pr = Ctor.precision;
    rm = Ctor.rounding;
    Ctor.precision = pr + Math.max(x.e, x.sd()) + LOG_BASE;
    Ctor.rounding = 1;
    x = cosine(Ctor, toLessThanHalfPi(Ctor, x));
    Ctor.precision = pr;
    Ctor.rounding = rm;
    return finalise(quadrant == 2 || quadrant == 3 ? x.neg() : x, pr, rm, true);
  };
  P.cubeRoot = P.cbrt = function() {
    var e, m, n2, r, rep, s, sd, t, t3, t3plusx, x = this, Ctor = x.constructor;
    if (!x.isFinite() || x.isZero())
      return new Ctor(x);
    external = false;
    s = x.s * mathpow(x.s * x, 1 / 3);
    if (!s || Math.abs(s) == 1 / 0) {
      n2 = digitsToString(x.d);
      e = x.e;
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
      r.s = x.s;
    } else {
      r = new Ctor(s.toString());
    }
    sd = (e = Ctor.precision) + 3;
    for (; ; ) {
      t = r;
      t3 = t.times(t).times(t);
      t3plusx = t3.plus(x);
      r = divide(t3plusx.plus(x).times(t), t3plusx.plus(t3), sd + 2, 1);
      if (digitsToString(t.d).slice(0, sd) === (n2 = digitsToString(r.d)).slice(0, sd)) {
        n2 = n2.slice(sd - 3, sd + 1);
        if (n2 == "9999" || !rep && n2 == "4999") {
          if (!rep) {
            finalise(t, e + 1, 0);
            if (t.times(t).times(t).eq(x)) {
              r = t;
              break;
            }
          }
          sd += 4;
          rep = 1;
        } else {
          if (!+n2 || !+n2.slice(1) && n2.charAt(0) == "5") {
            finalise(r, e + 1, 1);
            m = !r.times(r).times(r).eq(x);
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
    var x = this, Ctor = x.constructor;
    return finalise(divide(x, new Ctor(y), 0, 1, 1), Ctor.precision, Ctor.rounding);
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
    var k, n2, pr, rm, len, x = this, Ctor = x.constructor, one = new Ctor(1);
    if (!x.isFinite())
      return new Ctor(x.s ? 1 / 0 : NaN);
    if (x.isZero())
      return one;
    pr = Ctor.precision;
    rm = Ctor.rounding;
    Ctor.precision = pr + Math.max(x.e, x.sd()) + 4;
    Ctor.rounding = 1;
    len = x.d.length;
    if (len < 32) {
      k = Math.ceil(len / 3);
      n2 = (1 / tinyPow(4, k)).toString();
    } else {
      k = 16;
      n2 = "2.3283064365386962890625e-10";
    }
    x = taylorSeries(Ctor, 1, x.times(n2), new Ctor(1), true);
    var cosh2_x, i = k, d8 = new Ctor(8);
    for (; i--; ) {
      cosh2_x = x.times(x);
      x = one.minus(cosh2_x.times(d8.minus(cosh2_x.times(d8))));
    }
    return finalise(x, Ctor.precision = pr, Ctor.rounding = rm, true);
  };
  P.hyperbolicSine = P.sinh = function() {
    var k, pr, rm, len, x = this, Ctor = x.constructor;
    if (!x.isFinite() || x.isZero())
      return new Ctor(x);
    pr = Ctor.precision;
    rm = Ctor.rounding;
    Ctor.precision = pr + Math.max(x.e, x.sd()) + 4;
    Ctor.rounding = 1;
    len = x.d.length;
    if (len < 3) {
      x = taylorSeries(Ctor, 2, x, x, true);
    } else {
      k = 1.4 * Math.sqrt(len);
      k = k > 16 ? 16 : k | 0;
      x = x.times(1 / tinyPow(5, k));
      x = taylorSeries(Ctor, 2, x, x, true);
      var sinh2_x, d5 = new Ctor(5), d16 = new Ctor(16), d20 = new Ctor(20);
      for (; k--; ) {
        sinh2_x = x.times(x);
        x = x.times(d5.plus(sinh2_x.times(d16.times(sinh2_x).plus(d20))));
      }
    }
    Ctor.precision = pr;
    Ctor.rounding = rm;
    return finalise(x, pr, rm, true);
  };
  P.hyperbolicTangent = P.tanh = function() {
    var pr, rm, x = this, Ctor = x.constructor;
    if (!x.isFinite())
      return new Ctor(x.s);
    if (x.isZero())
      return new Ctor(x);
    pr = Ctor.precision;
    rm = Ctor.rounding;
    Ctor.precision = pr + 7;
    Ctor.rounding = 1;
    return divide(x.sinh(), x.cosh(), Ctor.precision = pr, Ctor.rounding = rm);
  };
  P.inverseCosine = P.acos = function() {
    var halfPi, x = this, Ctor = x.constructor, k = x.abs().cmp(1), pr = Ctor.precision, rm = Ctor.rounding;
    if (k !== -1) {
      return k === 0 ? x.isNeg() ? getPi(Ctor, pr, rm) : new Ctor(0) : new Ctor(NaN);
    }
    if (x.isZero())
      return getPi(Ctor, pr + 4, rm).times(0.5);
    Ctor.precision = pr + 6;
    Ctor.rounding = 1;
    x = x.asin();
    halfPi = getPi(Ctor, pr + 4, rm).times(0.5);
    Ctor.precision = pr;
    Ctor.rounding = rm;
    return halfPi.minus(x);
  };
  P.inverseHyperbolicCosine = P.acosh = function() {
    var pr, rm, x = this, Ctor = x.constructor;
    if (x.lte(1))
      return new Ctor(x.eq(1) ? 0 : NaN);
    if (!x.isFinite())
      return new Ctor(x);
    pr = Ctor.precision;
    rm = Ctor.rounding;
    Ctor.precision = pr + Math.max(Math.abs(x.e), x.sd()) + 4;
    Ctor.rounding = 1;
    external = false;
    x = x.times(x).minus(1).sqrt().plus(x);
    external = true;
    Ctor.precision = pr;
    Ctor.rounding = rm;
    return x.ln();
  };
  P.inverseHyperbolicSine = P.asinh = function() {
    var pr, rm, x = this, Ctor = x.constructor;
    if (!x.isFinite() || x.isZero())
      return new Ctor(x);
    pr = Ctor.precision;
    rm = Ctor.rounding;
    Ctor.precision = pr + 2 * Math.max(Math.abs(x.e), x.sd()) + 6;
    Ctor.rounding = 1;
    external = false;
    x = x.times(x).plus(1).sqrt().plus(x);
    external = true;
    Ctor.precision = pr;
    Ctor.rounding = rm;
    return x.ln();
  };
  P.inverseHyperbolicTangent = P.atanh = function() {
    var pr, rm, wpr, xsd, x = this, Ctor = x.constructor;
    if (!x.isFinite())
      return new Ctor(NaN);
    if (x.e >= 0)
      return new Ctor(x.abs().eq(1) ? x.s / 0 : x.isZero() ? x : NaN);
    pr = Ctor.precision;
    rm = Ctor.rounding;
    xsd = x.sd();
    if (Math.max(xsd, pr) < 2 * -x.e - 1)
      return finalise(new Ctor(x), pr, rm, true);
    Ctor.precision = wpr = xsd - x.e;
    x = divide(x.plus(1), new Ctor(1).minus(x), wpr + pr, 1);
    Ctor.precision = pr + 4;
    Ctor.rounding = 1;
    x = x.ln();
    Ctor.precision = pr;
    Ctor.rounding = rm;
    return x.times(0.5);
  };
  P.inverseSine = P.asin = function() {
    var halfPi, k, pr, rm, x = this, Ctor = x.constructor;
    if (x.isZero())
      return new Ctor(x);
    k = x.abs().cmp(1);
    pr = Ctor.precision;
    rm = Ctor.rounding;
    if (k !== -1) {
      if (k === 0) {
        halfPi = getPi(Ctor, pr + 4, rm).times(0.5);
        halfPi.s = x.s;
        return halfPi;
      }
      return new Ctor(NaN);
    }
    Ctor.precision = pr + 6;
    Ctor.rounding = 1;
    x = x.div(new Ctor(1).minus(x.times(x)).sqrt().plus(1)).atan();
    Ctor.precision = pr;
    Ctor.rounding = rm;
    return x.times(2);
  };
  P.inverseTangent = P.atan = function() {
    var i, j, k, n2, px, t, r, wpr, x2, x = this, Ctor = x.constructor, pr = Ctor.precision, rm = Ctor.rounding;
    if (!x.isFinite()) {
      if (!x.s)
        return new Ctor(NaN);
      if (pr + 4 <= PI_PRECISION) {
        r = getPi(Ctor, pr + 4, rm).times(0.5);
        r.s = x.s;
        return r;
      }
    } else if (x.isZero()) {
      return new Ctor(x);
    } else if (x.abs().eq(1) && pr + 4 <= PI_PRECISION) {
      r = getPi(Ctor, pr + 4, rm).times(0.25);
      r.s = x.s;
      return r;
    }
    Ctor.precision = wpr = pr + 10;
    Ctor.rounding = 1;
    k = Math.min(28, wpr / LOG_BASE + 2 | 0);
    for (i = k; i; --i)
      x = x.div(x.times(x).plus(1).sqrt().plus(1));
    external = false;
    j = Math.ceil(wpr / LOG_BASE);
    n2 = 1;
    x2 = x.times(x);
    r = new Ctor(x);
    px = x;
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
    var d, e, i, j, k, len, pr, rm, xd, xe, xLTy, yd, x = this, Ctor = x.constructor;
    y = new Ctor(y);
    if (!x.d || !y.d) {
      if (!x.s || !y.s)
        y = new Ctor(NaN);
      else if (x.d)
        y.s = -y.s;
      else
        y = new Ctor(y.d || x.s !== y.s ? x : NaN);
      return y;
    }
    if (x.s != y.s) {
      y.s = -y.s;
      return x.plus(y);
    }
    xd = x.d;
    yd = y.d;
    pr = Ctor.precision;
    rm = Ctor.rounding;
    if (!xd[0] || !yd[0]) {
      if (yd[0])
        y.s = -y.s;
      else if (xd[0])
        y = new Ctor(x);
      else
        return new Ctor(rm === 3 ? -0 : 0);
      return external ? finalise(y, pr, rm) : y;
    }
    e = mathfloor(y.e / LOG_BASE);
    xe = mathfloor(x.e / LOG_BASE);
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
    var q, x = this, Ctor = x.constructor;
    y = new Ctor(y);
    if (!x.d || !y.s || y.d && !y.d[0])
      return new Ctor(NaN);
    if (!y.d || x.d && !x.d[0]) {
      return finalise(new Ctor(x), Ctor.precision, Ctor.rounding);
    }
    external = false;
    if (Ctor.modulo == 9) {
      q = divide(x, y.abs(), 0, 3, 1);
      q.s *= y.s;
    } else {
      q = divide(x, y, 0, Ctor.modulo, 1);
    }
    q = q.times(y);
    external = true;
    return x.minus(q);
  };
  P.naturalExponential = P.exp = function() {
    return naturalExponential(this);
  };
  P.naturalLogarithm = P.ln = function() {
    return naturalLogarithm(this);
  };
  P.negated = P.neg = function() {
    var x = new this.constructor(this);
    x.s = -x.s;
    return finalise(x);
  };
  P.plus = P.add = function(y) {
    var carry, d, e, i, k, len, pr, rm, xd, yd, x = this, Ctor = x.constructor;
    y = new Ctor(y);
    if (!x.d || !y.d) {
      if (!x.s || !y.s)
        y = new Ctor(NaN);
      else if (!x.d)
        y = new Ctor(y.d || x.s === y.s ? x : NaN);
      return y;
    }
    if (x.s != y.s) {
      y.s = -y.s;
      return x.minus(y);
    }
    xd = x.d;
    yd = y.d;
    pr = Ctor.precision;
    rm = Ctor.rounding;
    if (!xd[0] || !yd[0]) {
      if (!yd[0])
        y = new Ctor(x);
      return external ? finalise(y, pr, rm) : y;
    }
    k = mathfloor(x.e / LOG_BASE);
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
    var k, x = this;
    if (z !== void 0 && z !== !!z && z !== 1 && z !== 0)
      throw Error(invalidArgument + z);
    if (x.d) {
      k = getPrecision(x.d);
      if (z && x.e + 1 > k)
        k = x.e + 1;
    } else {
      k = NaN;
    }
    return k;
  };
  P.round = function() {
    var x = this, Ctor = x.constructor;
    return finalise(new Ctor(x), x.e + 1, Ctor.rounding);
  };
  P.sine = P.sin = function() {
    var pr, rm, x = this, Ctor = x.constructor;
    if (!x.isFinite())
      return new Ctor(NaN);
    if (x.isZero())
      return new Ctor(x);
    pr = Ctor.precision;
    rm = Ctor.rounding;
    Ctor.precision = pr + Math.max(x.e, x.sd()) + LOG_BASE;
    Ctor.rounding = 1;
    x = sine(Ctor, toLessThanHalfPi(Ctor, x));
    Ctor.precision = pr;
    Ctor.rounding = rm;
    return finalise(quadrant > 2 ? x.neg() : x, pr, rm, true);
  };
  P.squareRoot = P.sqrt = function() {
    var m, n2, sd, r, rep, t, x = this, d = x.d, e = x.e, s = x.s, Ctor = x.constructor;
    if (s !== 1 || !d || !d[0]) {
      return new Ctor(!s || s < 0 && (!d || d[0]) ? NaN : d ? x : 1 / 0);
    }
    external = false;
    s = Math.sqrt(+x);
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
      r = t.plus(divide(x, t, sd + 2, 1)).times(0.5);
      if (digitsToString(t.d).slice(0, sd) === (n2 = digitsToString(r.d)).slice(0, sd)) {
        n2 = n2.slice(sd - 3, sd + 1);
        if (n2 == "9999" || !rep && n2 == "4999") {
          if (!rep) {
            finalise(t, e + 1, 0);
            if (t.times(t).eq(x)) {
              r = t;
              break;
            }
          }
          sd += 4;
          rep = 1;
        } else {
          if (!+n2 || !+n2.slice(1) && n2.charAt(0) == "5") {
            finalise(r, e + 1, 1);
            m = !r.times(r).eq(x);
          }
          break;
        }
      }
    }
    external = true;
    return finalise(r, e, Ctor.rounding, m);
  };
  P.tangent = P.tan = function() {
    var pr, rm, x = this, Ctor = x.constructor;
    if (!x.isFinite())
      return new Ctor(NaN);
    if (x.isZero())
      return new Ctor(x);
    pr = Ctor.precision;
    rm = Ctor.rounding;
    Ctor.precision = pr + 10;
    Ctor.rounding = 1;
    x = x.sin();
    x.s = 1;
    x = divide(x, new Ctor(1).minus(x.times(x)).sqrt(), pr + 10, 0);
    Ctor.precision = pr;
    Ctor.rounding = rm;
    return finalise(quadrant == 2 || quadrant == 4 ? x.neg() : x, pr, rm, true);
  };
  P.times = P.mul = function(y) {
    var carry, e, i, k, r, rL, t, xdL, ydL, x = this, Ctor = x.constructor, xd = x.d, yd = (y = new Ctor(y)).d;
    y.s *= x.s;
    if (!xd || !xd[0] || !yd || !yd[0]) {
      return new Ctor(!y.s || xd && !xd[0] && !yd || yd && !yd[0] && !xd ? NaN : !xd || !yd ? y.s / 0 : y.s * 0);
    }
    e = mathfloor(x.e / LOG_BASE) + mathfloor(y.e / LOG_BASE);
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
    var x = this, Ctor = x.constructor;
    x = new Ctor(x);
    if (dp === void 0)
      return x;
    checkInt32(dp, 0, MAX_DIGITS);
    if (rm === void 0)
      rm = Ctor.rounding;
    else
      checkInt32(rm, 0, 8);
    return finalise(x, dp + x.e + 1, rm);
  };
  P.toExponential = function(dp, rm) {
    var str, x = this, Ctor = x.constructor;
    if (dp === void 0) {
      str = finiteToString(x, true);
    } else {
      checkInt32(dp, 0, MAX_DIGITS);
      if (rm === void 0)
        rm = Ctor.rounding;
      else
        checkInt32(rm, 0, 8);
      x = finalise(new Ctor(x), dp + 1, rm);
      str = finiteToString(x, true, dp + 1);
    }
    return x.isNeg() && !x.isZero() ? "-" + str : str;
  };
  P.toFixed = function(dp, rm) {
    var str, y, x = this, Ctor = x.constructor;
    if (dp === void 0) {
      str = finiteToString(x);
    } else {
      checkInt32(dp, 0, MAX_DIGITS);
      if (rm === void 0)
        rm = Ctor.rounding;
      else
        checkInt32(rm, 0, 8);
      y = finalise(new Ctor(x), dp + x.e + 1, rm);
      str = finiteToString(y, false, dp + y.e + 1);
    }
    return x.isNeg() && !x.isZero() ? "-" + str : str;
  };
  P.toFraction = function(maxD) {
    var d, d0, d1, d2, e, k, n2, n0, n1, pr, q, r, x = this, xd = x.d, Ctor = x.constructor;
    if (!xd)
      return new Ctor(x);
    n1 = d0 = new Ctor(1);
    d1 = n0 = new Ctor(0);
    d = new Ctor(d1);
    e = d.e = getPrecision(xd) - x.e - 1;
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
    n0.s = n1.s = x.s;
    r = divide(n1, d1, e, 1).minus(x).abs().cmp(divide(n0, d0, e, 1).minus(x).abs()) < 1 ? [n1, d1] : [n0, d0];
    Ctor.precision = pr;
    external = true;
    return r;
  };
  P.toHexadecimal = P.toHex = function(sd, rm) {
    return toStringBinary(this, 16, sd, rm);
  };
  P.toNearest = function(y, rm) {
    var x = this, Ctor = x.constructor;
    x = new Ctor(x);
    if (y == null) {
      if (!x.d)
        return x;
      y = new Ctor(1);
      rm = Ctor.rounding;
    } else {
      y = new Ctor(y);
      if (rm === void 0) {
        rm = Ctor.rounding;
      } else {
        checkInt32(rm, 0, 8);
      }
      if (!x.d)
        return y.s ? x : y;
      if (!y.d) {
        if (y.s)
          y.s = x.s;
        return y;
      }
    }
    if (y.d[0]) {
      external = false;
      x = divide(x, y, 0, rm, 1).times(y);
      external = true;
      finalise(x);
    } else {
      y.s = x.s;
      x = y;
    }
    return x;
  };
  P.toNumber = function() {
    return +this;
  };
  P.toOctal = function(sd, rm) {
    return toStringBinary(this, 8, sd, rm);
  };
  P.toPower = P.pow = function(y) {
    var e, k, pr, r, rm, s, x = this, Ctor = x.constructor, yn = +(y = new Ctor(y));
    if (!x.d || !y.d || !x.d[0] || !y.d[0])
      return new Ctor(mathpow(+x, yn));
    x = new Ctor(x);
    if (x.eq(1))
      return x;
    pr = Ctor.precision;
    rm = Ctor.rounding;
    if (y.eq(1))
      return finalise(x, pr, rm);
    e = mathfloor(y.e / LOG_BASE);
    if (e >= y.d.length - 1 && (k = yn < 0 ? -yn : yn) <= MAX_SAFE_INTEGER) {
      r = intPow(Ctor, x, k, pr);
      return y.s < 0 ? new Ctor(1).div(r) : finalise(r, pr, rm);
    }
    s = x.s;
    if (s < 0) {
      if (e < y.d.length - 1)
        return new Ctor(NaN);
      if ((y.d[e] & 1) == 0)
        s = 1;
      if (x.e == 0 && x.d[0] == 1 && x.d.length == 1) {
        x.s = s;
        return x;
      }
    }
    k = mathpow(+x, yn);
    e = k == 0 || !isFinite(k) ? mathfloor(yn * (Math.log("0." + digitsToString(x.d)) / Math.LN10 + x.e + 1)) : new Ctor(k + "").e;
    if (e > Ctor.maxE + 1 || e < Ctor.minE - 1)
      return new Ctor(e > 0 ? s / 0 : 0);
    external = false;
    Ctor.rounding = x.s = 1;
    k = Math.min(12, (e + "").length);
    r = naturalExponential(y.times(naturalLogarithm(x, pr + k)), pr);
    if (r.d) {
      r = finalise(r, pr + 5, 1);
      if (checkRoundingDigits(r.d, pr, rm)) {
        e = pr + 10;
        r = finalise(naturalExponential(y.times(naturalLogarithm(x, e + k)), e), e + 5, 1);
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
    var str, x = this, Ctor = x.constructor;
    if (sd === void 0) {
      str = finiteToString(x, x.e <= Ctor.toExpNeg || x.e >= Ctor.toExpPos);
    } else {
      checkInt32(sd, 1, MAX_DIGITS);
      if (rm === void 0)
        rm = Ctor.rounding;
      else
        checkInt32(rm, 0, 8);
      x = finalise(new Ctor(x), sd, rm);
      str = finiteToString(x, sd <= x.e || x.e <= Ctor.toExpNeg, sd);
    }
    return x.isNeg() && !x.isZero() ? "-" + str : str;
  };
  P.toSignificantDigits = P.toSD = function(sd, rm) {
    var x = this, Ctor = x.constructor;
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
    return finalise(new Ctor(x), sd, rm);
  };
  P.toString = function() {
    var x = this, Ctor = x.constructor, str = finiteToString(x, x.e <= Ctor.toExpNeg || x.e >= Ctor.toExpPos);
    return x.isNeg() && !x.isZero() ? "-" + str : str;
  };
  P.truncated = P.trunc = function() {
    return finalise(new this.constructor(this), this.e + 1, 1);
  };
  P.valueOf = P.toJSON = function() {
    var x = this, Ctor = x.constructor, str = finiteToString(x, x.e <= Ctor.toExpNeg || x.e >= Ctor.toExpPos);
    return x.isNeg() ? "-" + str : str;
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
  function cosine(Ctor, x) {
    var k, len, y;
    if (x.isZero())
      return x;
    len = x.d.length;
    if (len < 32) {
      k = Math.ceil(len / 3);
      y = (1 / tinyPow(4, k)).toString();
    } else {
      k = 16;
      y = "2.3283064365386962890625e-10";
    }
    Ctor.precision += k;
    x = taylorSeries(Ctor, 1, x.times(y), new Ctor(1));
    for (var i = k; i--; ) {
      var cos2x = x.times(x);
      x = cos2x.times(cos2x).minus(cos2x).times(8).plus(1);
    }
    Ctor.precision -= k;
    return x;
  }
  var divide = function() {
    function multiplyInteger(x, k, base2) {
      var temp, carry = 0, i = x.length;
      for (x = x.slice(); i--; ) {
        temp = x[i] * k + carry;
        x[i] = temp % base2 | 0;
        carry = temp / base2 | 0;
      }
      if (carry)
        x.unshift(carry);
      return x;
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
    return function(x, y, pr, rm, dp, base2) {
      var cmp, e, i, k, logBase, more, prod, prodL, q, qd, rem, remL, rem0, sd, t, xi, xL, yd0, yL, yz, Ctor = x.constructor, sign2 = x.s == y.s ? 1 : -1, xd = x.d, yd = y.d;
      if (!xd || !xd[0] || !yd || !yd[0]) {
        return new Ctor(
          !x.s || !y.s || (xd ? yd && xd[0] == yd[0] : !yd) ? NaN : xd && xd[0] == 0 || !yd ? sign2 * 0 : sign2 / 0
        );
      }
      if (base2) {
        logBase = 1;
        e = x.e - y.e;
      } else {
        base2 = BASE;
        logBase = LOG_BASE;
        e = mathfloor(x.e / logBase) - mathfloor(y.e / logBase);
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
        sd = pr + (x.e - y.e) + 1;
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
  function finalise(x, sd, rm, isTruncated) {
    var digits, i, j, k, rd, roundUp, w, xd, xdi, Ctor = x.constructor;
    out:
      if (sd != null) {
        xd = x.d;
        if (!xd)
          return x;
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
        roundUp = rm < 4 ? (rd || isTruncated) && (rm == 0 || rm == (x.s < 0 ? 3 : 2)) : rd > 5 || rd == 5 && (rm == 4 || isTruncated || rm == 6 && (i > 0 ? j > 0 ? w / mathpow(10, digits - j) : 0 : xd[xdi - 1]) % 10 & 1 || rm == (x.s < 0 ? 8 : 7));
        if (sd < 1 || !xd[0]) {
          xd.length = 0;
          if (roundUp) {
            sd -= x.e + 1;
            xd[0] = mathpow(10, (LOG_BASE - sd % LOG_BASE) % LOG_BASE);
            x.e = -sd || 0;
          } else {
            xd[0] = x.e = 0;
          }
          return x;
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
                x.e++;
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
      if (x.e > Ctor.maxE) {
        x.d = null;
        x.e = NaN;
      } else if (x.e < Ctor.minE) {
        x.e = 0;
        x.d = [0];
      }
    }
    return x;
  }
  function finiteToString(x, isExp, sd) {
    if (!x.isFinite())
      return nonFiniteToString(x);
    var k, e = x.e, str = digitsToString(x.d), len = str.length;
    if (isExp) {
      if (sd && (k = sd - len) > 0) {
        str = str.charAt(0) + "." + str.slice(1) + getZeroString(k);
      } else if (len > 1) {
        str = str.charAt(0) + "." + str.slice(1);
      }
      str = str + (x.e < 0 ? "e" : "e+") + x.e;
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
  function intPow(Ctor, x, n2, pr) {
    var isTruncated, r = new Ctor(1), k = Math.ceil(pr / LOG_BASE + 4);
    external = false;
    for (; ; ) {
      if (n2 % 2) {
        r = r.times(x);
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
      x = x.times(x);
      truncate(x.d, k);
    }
    external = true;
    return r;
  }
  function isOdd(n2) {
    return n2.d[n2.d.length - 1] & 1;
  }
  function maxOrMin(Ctor, args, ltgt) {
    var y, x = new Ctor(args[0]), i = 0;
    for (; ++i < args.length; ) {
      y = new Ctor(args[i]);
      if (!y.s) {
        x = y;
        break;
      } else if (x[ltgt](y)) {
        x = y;
      }
    }
    return x;
  }
  function naturalExponential(x, sd) {
    var denominator, guard, j, pow2, sum2, t, wpr, rep = 0, i = 0, k = 0, Ctor = x.constructor, rm = Ctor.rounding, pr = Ctor.precision;
    if (!x.d || !x.d[0] || x.e > 17) {
      return new Ctor(x.d ? !x.d[0] ? 1 : x.s < 0 ? 0 : 1 / 0 : x.s ? x.s < 0 ? 0 : x : 0 / 0);
    }
    if (sd == null) {
      external = false;
      wpr = pr;
    } else {
      wpr = sd;
    }
    t = new Ctor(0.03125);
    while (x.e > -2) {
      x = x.times(t);
      k += 5;
    }
    guard = Math.log(mathpow(2, k)) / Math.LN10 * 2 + 5 | 0;
    wpr += guard;
    denominator = pow2 = sum2 = new Ctor(1);
    Ctor.precision = wpr;
    for (; ; ) {
      pow2 = finalise(pow2.times(x), wpr, 1);
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
    var c, c0, denominator, e, numerator, rep, sum2, t, wpr, x1, x2, n2 = 1, guard = 10, x = y, xd = x.d, Ctor = x.constructor, rm = Ctor.rounding, pr = Ctor.precision;
    if (x.s < 0 || !xd || !xd[0] || !x.e && xd[0] == 1 && xd.length == 1) {
      return new Ctor(xd && !xd[0] ? -1 / 0 : x.s != 1 ? NaN : xd ? 0 : x);
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
    if (Math.abs(e = x.e) < 15e14) {
      while (c0 < 7 && c0 != 1 || c0 == 1 && c.charAt(1) > 3) {
        x = x.times(y);
        c = digitsToString(x.d);
        c0 = c.charAt(0);
        n2++;
      }
      e = x.e;
      if (c0 > 1) {
        x = new Ctor("0." + c);
        e++;
      } else {
        x = new Ctor(c0 + "." + c.slice(1));
      }
    } else {
      t = getLn10(Ctor, wpr + 2, pr).times(e + "");
      x = naturalLogarithm(new Ctor(c0 + "." + c.slice(1)), wpr - guard).plus(t);
      Ctor.precision = pr;
      return sd == null ? finalise(x, pr, rm, external = true) : x;
    }
    x1 = x;
    sum2 = numerator = x = divide(x.minus(1), x.plus(1), wpr, 1);
    x2 = finalise(x.times(x), wpr, 1);
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
            t = numerator = x = divide(x1.minus(1), x1.plus(1), wpr, 1);
            x2 = finalise(x.times(x), wpr, 1);
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
  function nonFiniteToString(x) {
    return String(x.s * x.s / 0);
  }
  function parseDecimal(x, str) {
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
      x.e = e = e - i - 1;
      x.d = [];
      i = (e + 1) % LOG_BASE;
      if (e < 0)
        i += LOG_BASE;
      if (i < len) {
        if (i)
          x.d.push(+str.slice(0, i));
        for (len -= LOG_BASE; i < len; )
          x.d.push(+str.slice(i, i += LOG_BASE));
        str = str.slice(i);
        i = LOG_BASE - str.length;
      } else {
        i -= len;
      }
      for (; i--; )
        str += "0";
      x.d.push(+str);
      if (external) {
        if (x.e > x.constructor.maxE) {
          x.d = null;
          x.e = NaN;
        } else if (x.e < x.constructor.minE) {
          x.e = 0;
          x.d = [0];
        }
      }
    } else {
      x.e = 0;
      x.d = [0];
    }
    return x;
  }
  function parseOther(x, str) {
    var base2, Ctor, divisor, i, isFloat, len, p, xd, xe;
    if (str.indexOf("_") > -1) {
      str = str.replace(/(\d)_(?=\d)/g, "$1");
      if (isDecimal.test(str))
        return parseDecimal(x, str);
    } else if (str === "Infinity" || str === "NaN") {
      if (!+str)
        x.s = NaN;
      x.e = NaN;
      x.d = null;
      return x;
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
    Ctor = x.constructor;
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
      return new Ctor(x.s * 0);
    x.e = getBase10Exponent(xd, xe);
    x.d = xd;
    external = false;
    if (isFloat)
      x = divide(x, divisor, len * 4);
    if (p)
      x = x.times(Math.abs(p) < 54 ? mathpow(2, p) : Decimal.pow(2, p));
    external = true;
    return x;
  }
  function sine(Ctor, x) {
    var k, len = x.d.length;
    if (len < 3) {
      return x.isZero() ? x : taylorSeries(Ctor, 2, x, x);
    }
    k = 1.4 * Math.sqrt(len);
    k = k > 16 ? 16 : k | 0;
    x = x.times(1 / tinyPow(5, k));
    x = taylorSeries(Ctor, 2, x, x);
    var sin2_x, d5 = new Ctor(5), d16 = new Ctor(16), d20 = new Ctor(20);
    for (; k--; ) {
      sin2_x = x.times(x);
      x = x.times(d5.plus(sin2_x.times(d16.times(sin2_x).minus(d20))));
    }
    return x;
  }
  function taylorSeries(Ctor, n2, x, y, isHyperbolic) {
    var j, t, u, x2, i = 1, pr = Ctor.precision, k = Math.ceil(pr / LOG_BASE);
    external = false;
    x2 = x.times(x);
    u = new Ctor(y);
    for (; ; ) {
      t = divide(u.times(x2), new Ctor(n2++ * n2++), pr, 1);
      u = isHyperbolic ? y.plus(t) : y.minus(t);
      y = divide(t.times(x2), new Ctor(n2++ * n2++), pr, 1);
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
  function toLessThanHalfPi(Ctor, x) {
    var t, isNeg = x.s < 0, pi = getPi(Ctor, Ctor.precision, 1), halfPi = pi.times(0.5);
    x = x.abs();
    if (x.lte(halfPi)) {
      quadrant = isNeg ? 4 : 1;
      return x;
    }
    t = x.divToInt(pi);
    if (t.isZero()) {
      quadrant = isNeg ? 3 : 2;
    } else {
      x = x.minus(t.times(pi));
      if (x.lte(halfPi)) {
        quadrant = isOdd(t) ? isNeg ? 2 : 3 : isNeg ? 4 : 1;
        return x;
      }
      quadrant = isOdd(t) ? isNeg ? 1 : 4 : isNeg ? 3 : 2;
    }
    return x.minus(pi).abs();
  }
  function toStringBinary(x, baseOut, sd, rm) {
    var base2, e, i, k, len, roundUp, str, xd, y, Ctor = x.constructor, isExp = sd !== void 0;
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
    if (!x.isFinite()) {
      str = nonFiniteToString(x);
    } else {
      str = finiteToString(x);
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
          x = new Ctor(x);
          x.d = xd;
          x.e = e;
          x = divide(x, y, sd, rm, 0, base2);
          xd = x.d;
          e = x.e;
          roundUp = inexact;
        }
        i = xd[sd];
        k = base2 / 2;
        roundUp = roundUp || xd[sd + 1] !== void 0;
        roundUp = rm < 4 ? (i !== void 0 || roundUp) && (rm === 0 || rm === (x.s < 0 ? 3 : 2)) : i > k || i === k && (rm === 4 || roundUp || rm === 6 && xd[sd - 1] & 1 || rm === (x.s < 0 ? 8 : 7));
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
    return x.s < 0 ? "-" + str : str;
  }
  function truncate(arr, len) {
    if (arr.length > len) {
      arr.length = len;
      return true;
    }
  }
  function abs(x) {
    return new this(x).abs();
  }
  function acos(x) {
    return new this(x).acos();
  }
  function acosh(x) {
    return new this(x).acosh();
  }
  function add(x, y) {
    return new this(x).plus(y);
  }
  function asin(x) {
    return new this(x).asin();
  }
  function asinh(x) {
    return new this(x).asinh();
  }
  function atan(x) {
    return new this(x).atan();
  }
  function atanh(x) {
    return new this(x).atanh();
  }
  function atan2(y, x) {
    y = new this(y);
    x = new this(x);
    var r, pr = this.precision, rm = this.rounding, wpr = pr + 4;
    if (!y.s || !x.s) {
      r = new this(NaN);
    } else if (!y.d && !x.d) {
      r = getPi(this, wpr, 1).times(x.s > 0 ? 0.25 : 0.75);
      r.s = y.s;
    } else if (!x.d || y.isZero()) {
      r = x.s < 0 ? getPi(this, pr, rm) : new this(0);
      r.s = y.s;
    } else if (!y.d || x.isZero()) {
      r = getPi(this, wpr, 1).times(0.5);
      r.s = y.s;
    } else if (x.s < 0) {
      this.precision = wpr;
      this.rounding = 1;
      r = this.atan(divide(y, x, wpr, 1));
      x = getPi(this, wpr, 1);
      this.precision = pr;
      this.rounding = rm;
      r = y.s < 0 ? r.minus(x) : r.plus(x);
    } else {
      r = this.atan(divide(y, x, wpr, 1));
    }
    return r;
  }
  function cbrt(x) {
    return new this(x).cbrt();
  }
  function ceil(x) {
    return finalise(x = new this(x), x.e + 1, 2);
  }
  function clamp(x, min2, max2) {
    return new this(x).clamp(min2, max2);
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
  function cos(x) {
    return new this(x).cos();
  }
  function cosh(x) {
    return new this(x).cosh();
  }
  function clone(obj) {
    var i, p, ps;
    function Decimal2(v) {
      var e, i2, t, x = this;
      if (!(x instanceof Decimal2))
        return new Decimal2(v);
      x.constructor = Decimal2;
      if (isDecimalInstance(v)) {
        x.s = v.s;
        if (external) {
          if (!v.d || v.e > Decimal2.maxE) {
            x.e = NaN;
            x.d = null;
          } else if (v.e < Decimal2.minE) {
            x.e = 0;
            x.d = [0];
          } else {
            x.e = v.e;
            x.d = v.d.slice();
          }
        } else {
          x.e = v.e;
          x.d = v.d ? v.d.slice() : v.d;
        }
        return;
      }
      t = typeof v;
      if (t === "number") {
        if (v === 0) {
          x.s = 1 / v < 0 ? -1 : 1;
          x.e = 0;
          x.d = [0];
          return;
        }
        if (v < 0) {
          v = -v;
          x.s = -1;
        } else {
          x.s = 1;
        }
        if (v === ~~v && v < 1e7) {
          for (e = 0, i2 = v; i2 >= 10; i2 /= 10)
            e++;
          if (external) {
            if (e > Decimal2.maxE) {
              x.e = NaN;
              x.d = null;
            } else if (e < Decimal2.minE) {
              x.e = 0;
              x.d = [0];
            } else {
              x.e = e;
              x.d = [v];
            }
          } else {
            x.e = e;
            x.d = [v];
          }
          return;
        } else if (v * 0 !== 0) {
          if (!v)
            x.s = NaN;
          x.e = NaN;
          x.d = null;
          return;
        }
        return parseDecimal(x, v.toString());
      } else if (t !== "string") {
        throw Error(invalidArgument + v);
      }
      if ((i2 = v.charCodeAt(0)) === 45) {
        v = v.slice(1);
        x.s = -1;
      } else {
        if (i2 === 43)
          v = v.slice(1);
        x.s = 1;
      }
      return isDecimal.test(v) ? parseDecimal(x, v) : parseOther(x, v);
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
  function div(x, y) {
    return new this(x).div(y);
  }
  function exp(x) {
    return new this(x).exp();
  }
  function floor(x) {
    return finalise(x = new this(x), x.e + 1, 3);
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
  function ln(x) {
    return new this(x).ln();
  }
  function log(x, y) {
    return new this(x).log(y);
  }
  function log2(x) {
    return new this(x).log(2);
  }
  function log10(x) {
    return new this(x).log(10);
  }
  function max() {
    return maxOrMin(this, arguments, "lt");
  }
  function min() {
    return maxOrMin(this, arguments, "gt");
  }
  function mod(x, y) {
    return new this(x).mod(y);
  }
  function mul(x, y) {
    return new this(x).mul(y);
  }
  function pow(x, y) {
    return new this(x).pow(y);
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
  function round(x) {
    return finalise(x = new this(x), x.e + 1, this.rounding);
  }
  function sign(x) {
    x = new this(x);
    return x.d ? x.d[0] ? x.s : 0 * x.s : x.s || NaN;
  }
  function sin(x) {
    return new this(x).sin();
  }
  function sinh(x) {
    return new this(x).sinh();
  }
  function sqrt(x) {
    return new this(x).sqrt();
  }
  function sub(x, y) {
    return new this(x).sub(y);
  }
  function sum() {
    var i = 0, args = arguments, x = new this(args[i]);
    external = false;
    for (; x.s && ++i < args.length; )
      x = x.plus(args[i]);
    external = true;
    return finalise(x, this.precision, this.rounding);
  }
  function tan(x) {
    return new this(x).tan();
  }
  function tanh(x) {
    return new this(x).tanh();
  }
  function trunc(x) {
    return finalise(x = new this(x), x.e + 1, 1);
  }
  P[Symbol.for("nodejs.util.inspect.custom")] = P.toString;
  P[Symbol.toStringTag] = "Decimal";
  var Decimal = P.constructor = clone(DEFAULTS);
  LN10 = new Decimal(LN10);
  PI = new Decimal(PI);
  var decimal_default = Decimal;

  // ts-port/core/numbers.ts
  function igcd(x, y) {
    while (y) {
      const t = y;
      y = x % y;
      x = t;
    }
    return x;
  }
  function int_nthroot(y, n2) {
    const x = Math.floor(y ** (1 / n2));
    const isexact = x ** n2 === y;
    return [x, isexact];
  }
  function toRatio(n2, eps) {
    const gcde = (e, x, y) => {
      const _gcd = (a, b) => b < e ? a : _gcd(b, a % b);
      return _gcd(Math.abs(x), Math.abs(y));
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
    let [x, y, r, s] = [1, 0, 0, 1];
    let c;
    let q;
    while (b) {
      [c, q] = [a % b, Math.floor(a / b)];
      [a, b, r, s, x, y] = [b, c, x - q * r, y - q * s, r, s];
    }
    return [x * x_sign, y * y_sign, a];
  }
  function mod_inverse(a, m) {
    let c = void 0;
    [a, m] = [as_int(a), as_int(m)];
    if (m !== 1 && m !== -1) {
      const [x, b, g] = igcdex(a, m);
      if (g === 1) {
        c = x & m;
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
      return !this._eval_is_negative;
    }
    _eval_is_odd() {
      console.log("hello");
      console.log(this);
      return this.p % 2 !== 0;
    }
    _eval_is_even() {
      console.log("eval even");
      return this.p % 2 === 0;
    }
    _eval_is_finite() {
      return this.p === S.Infinity || this.p === S.NegativeInfinity;
    }
    eq(other) {
      return this.p === other.p && this.q === other.q;
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
      console.log("eval negative");
      return this.p < 0;
    }
    _eval_is_positive() {
      console.log("eval positive");
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
      const [x, xexact] = int_nthroot(Math.abs(this.p), expt.q);
      if (xexact) {
        let result2 = new _Integer(x ** Math.abs(expt.p));
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
  };
  NaN2.is_commutative = true;
  NaN2.is_extended_real = void 0;
  NaN2.is_real = void 0;
  NaN2.is_rationa = void 0;
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
        if (other === S.Infinity || other === S.NaN) {
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

  // ts-port/testing.ts
  var n = _Number_.new(4);
  console.log(n.is_Rational());
  console.log(n.is_zero());
  console.log(n.is_Add());
  console.log(n.is_complex());
  console.log(n.is_Float());
  var n3 = _Number_.new(-1.5);
  console.log(n3.is_Float());
  console.log(n3.is_Rational());
})();
/*!
 *  decimal.js v10.4.3
 *  An arbitrary-precision Decimal type for JavaScript.
 *  https://github.com/MikeMcl/decimal.js
 *  Copyright (c) 2022 Michael Mclaughlin <M8ch88l@gmail.com>
 *  MIT Licence
 */
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsiLi4vY29yZS91dGlsaXR5LnRzIiwgIi4uL2NvcmUvbG9naWMudHMiLCAiLi4vY29yZS9mYWN0cy50cyIsICIuLi9jb3JlL2NvcmUudHMiLCAiLi4vY29yZS9hc3N1bXB0aW9ucy50cyIsICIuLi9jb3JlL2tpbmQudHMiLCAiLi4vY29yZS90cmF2ZXJzYWwudHMiLCAiLi4vY29yZS9iYXNpYy50cyIsICIuLi9jb3JlL3NpbmdsZXRvbi50cyIsICIuLi9jb3JlL2dsb2JhbC50cyIsICIuLi91dGlsaXRpZXMvbWlzYy50cyIsICIuLi9jb3JlL2V4cHIudHMiLCAiLi4vY29yZS9wYXJhbWV0ZXJzLnRzIiwgIi4uL2NvcmUvb3BlcmF0aW9ucy50cyIsICIuLi9udGhlb3J5L2ZhY3Rvcl8udHMiLCAiLi4vY29yZS9wb3dlci50cyIsICIuLi9jb3JlL211bC50cyIsICIuLi9jb3JlL2FkZC50cyIsICIuLi8uLi9ub2RlX21vZHVsZXMvZGVjaW1hbC5qcy9kZWNpbWFsLm1qcyIsICIuLi9jb3JlL251bWJlcnMudHMiLCAiLi4vdGVzdGluZy50cyJdLAogICJzb3VyY2VzQ29udGVudCI6IFsiLypcbkEgZmlsZSB3aXRoIHV0aWxpdHkgY2xhc3NlcyBhbmQgZnVuY3Rpb25zIHRvIGhlbHAgd2l0aCBwb3J0aW5nXG5EZXZlbG9wZCBieSBXQiBhbmQgR01cbiovXG5cbi8vIGdlbmVyYWwgdXRpbCBmdW5jdGlvbnNcbmNsYXNzIFV0aWwge1xuICAgIC8vIGhhc2hrZXkgZnVuY3Rpb25cbiAgICAvLyBzaG91bGQgYmUgYWJsZSB0byBoYW5kbGUgbXVsdGlwbGUgdHlwZXMgb2YgaW5wdXRzXG4gICAgc3RhdGljIGhhc2hLZXkoeDogYW55KTogc3RyaW5nIHtcbiAgICAgICAgaWYgKHR5cGVvZiB4ID09PSBcInVuZGVmaW5lZFwiKSB7XG4gICAgICAgICAgICByZXR1cm4gXCJ1bmRlZmluZWRcIjtcbiAgICAgICAgfVxuICAgICAgICBpZiAoeC5oYXNoS2V5KSB7XG4gICAgICAgICAgICByZXR1cm4geC5oYXNoS2V5KCk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKEFycmF5LmlzQXJyYXkoeCkpIHtcbiAgICAgICAgICAgIHJldHVybiB4Lm1hcCgoZSkgPT4gVXRpbC5oYXNoS2V5KGUpKS5qb2luKFwiLFwiKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoeCA9PT0gbnVsbCkge1xuICAgICAgICAgICAgcmV0dXJuIFwibnVsbFwiO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB4LnRvU3RyaW5nKCk7XG4gICAgfVxuXG4gICAgLy8gY2hlY2sgaWYgYXJyMSBpcyBhIHN1YnNldCBvZiBhcnIyXG4gICAgc3RhdGljIGlzU3Vic2V0KGFycjE6IGFueVtdLCBhcnIyOiBhbnlbXSk6IGJvb2xlYW4ge1xuICAgICAgICBmb3IgKGNvbnN0IGUgb2YgYXJyMSkge1xuICAgICAgICAgICAgaWYgKCEoYXJyMi5pbmNsdWRlcyhlKSkpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuXG4gICAgLy8gY29udmVydCBhbiBpbnRlZ2VyIHRvIGJpbmFyeVxuICAgIC8vIGZ1bmN0aW9uYWwgZm9yIG5lZ2F0aXZlIG51bWJlcnNcbiAgICBzdGF0aWMgYmluKG51bTogbnVtYmVyKSB7XG4gICAgICAgIHJldHVybiAobnVtID4+PiAwKS50b1N0cmluZygyKTtcbiAgICB9XG5cbiAgICBzdGF0aWMqIHByb2R1Y3QocmVwZWF0OiBudW1iZXIgPSAxLCAuLi5hcmdzOiBhbnlbXSkge1xuICAgICAgICBjb25zdCB0b0FkZDogYW55W10gPSBbXTtcbiAgICAgICAgZm9yIChjb25zdCBhIG9mIGFyZ3MpIHtcbiAgICAgICAgICAgIHRvQWRkLnB1c2goW2FdKTtcbiAgICAgICAgfVxuICAgICAgICBjb25zdCBwb29sczogYW55W10gPSBbXTtcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCByZXBlYXQ7IGkrKykge1xuICAgICAgICAgICAgdG9BZGQuZm9yRWFjaCgoZTogYW55KSA9PiBwb29scy5wdXNoKGVbMF0pKTtcbiAgICAgICAgfVxuICAgICAgICBsZXQgcmVzOiBhbnlbXVtdID0gW1tdXTtcbiAgICAgICAgZm9yIChjb25zdCBwb29sIG9mIHBvb2xzKSB7XG4gICAgICAgICAgICBjb25zdCByZXNfdGVtcDogYW55W10gPSBbXTtcbiAgICAgICAgICAgIGZvciAoY29uc3QgeCBvZiByZXMpIHtcbiAgICAgICAgICAgICAgICBmb3IgKGNvbnN0IHkgb2YgcG9vbCkge1xuICAgICAgICAgICAgICAgICAgICBpZiAodHlwZW9mIHhbMF0gPT09IFwidW5kZWZpbmVkXCIpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlc190ZW1wLnB1c2goW3ldKTtcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlc190ZW1wLnB1c2goeC5jb25jYXQoeSkpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmVzID0gcmVzX3RlbXA7XG4gICAgICAgIH1cbiAgICAgICAgZm9yIChjb25zdCBwcm9kIG9mIHJlcykge1xuICAgICAgICAgICAgeWllbGQgcHJvZDtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHN0YXRpYyogcGVybXV0YXRpb25zKGl0ZXJhYmxlOiBhbnksIHI6IGFueSA9IHVuZGVmaW5lZCkge1xuICAgICAgICBjb25zdCBuID0gaXRlcmFibGUubGVuZ3RoO1xuICAgICAgICBpZiAodHlwZW9mIHIgPT09IFwidW5kZWZpbmVkXCIpIHtcbiAgICAgICAgICAgIHIgPSBuO1xuICAgICAgICB9XG4gICAgICAgIGNvbnN0IHJhbmdlID0gdGhpcy5yYW5nZShuKTtcbiAgICAgICAgZm9yIChjb25zdCBpbmRpY2VzIG9mIFV0aWwucHJvZHVjdChyLCByYW5nZSkpIHtcbiAgICAgICAgICAgIGlmIChpbmRpY2VzLmxlbmd0aCA9PT0gcikge1xuICAgICAgICAgICAgICAgIGNvbnN0IHk6IGFueVtdID0gW107XG4gICAgICAgICAgICAgICAgZm9yIChjb25zdCBpIG9mIGluZGljZXMpIHtcbiAgICAgICAgICAgICAgICAgICAgeS5wdXNoKGl0ZXJhYmxlW2ldKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgeWllbGQgeTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgIHN0YXRpYyogZnJvbV9pdGVyYWJsZShpdGVyYWJsZXM6IGFueSkge1xuICAgICAgICBmb3IgKGNvbnN0IGl0IG9mIGl0ZXJhYmxlcykge1xuICAgICAgICAgICAgZm9yIChjb25zdCBlbGVtZW50IG9mIGl0KSB7XG4gICAgICAgICAgICAgICAgeWllbGQgZWxlbWVudDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgIHN0YXRpYyBhcnJFcShhcnIxOiBhbnlbXSwgYXJyMjogYW55KSB7XG4gICAgICAgIGlmIChhcnIxLmxlbmd0aCAhPT0gYXJyMi5sZW5ndGgpIHtcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGFycjEubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIGlmICghKGFycjFbaV0gPT09IGFycjJbaV0pKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cblxuICAgIHN0YXRpYyogY29tYmluYXRpb25zKGl0ZXJhYmxlOiBhbnksIHI6IGFueSkge1xuICAgICAgICBjb25zdCBuID0gaXRlcmFibGUubGVuZ3RoO1xuICAgICAgICBjb25zdCByYW5nZSA9IHRoaXMucmFuZ2Uobik7XG4gICAgICAgIGZvciAoY29uc3QgaW5kaWNlcyBvZiBVdGlsLnBlcm11dGF0aW9ucyhyYW5nZSwgcikpIHtcbiAgICAgICAgICAgIGlmIChVdGlsLmFyckVxKGluZGljZXMuc29ydChmdW5jdGlvbihhLCBiKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGEgLSBiO1xuICAgICAgICAgICAgfSksIGluZGljZXMpKSB7XG4gICAgICAgICAgICAgICAgY29uc3QgcmVzOiBhbnlbXSA9IFtdO1xuICAgICAgICAgICAgICAgIGZvciAoY29uc3QgaSBvZiBpbmRpY2VzKSB7XG4gICAgICAgICAgICAgICAgICAgIHJlcy5wdXNoKGl0ZXJhYmxlW2ldKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgeWllbGQgcmVzO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgc3RhdGljKiBjb21iaW5hdGlvbnNfd2l0aF9yZXBsYWNlbWVudChpdGVyYWJsZTogYW55LCByOiBhbnkpIHtcbiAgICAgICAgY29uc3QgbiA9IGl0ZXJhYmxlLmxlbmd0aDtcbiAgICAgICAgY29uc3QgcmFuZ2UgPSB0aGlzLnJhbmdlKG4pO1xuICAgICAgICBmb3IgKGNvbnN0IGluZGljZXMgb2YgVXRpbC5wcm9kdWN0KHIsIHJhbmdlKSkge1xuICAgICAgICAgICAgaWYgKFV0aWwuYXJyRXEoaW5kaWNlcy5zb3J0KGZ1bmN0aW9uKGEsIGIpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gYSAtIGI7XG4gICAgICAgICAgICB9KSwgaW5kaWNlcykpIHtcbiAgICAgICAgICAgICAgICBjb25zdCByZXM6IGFueVtdID0gW107XG4gICAgICAgICAgICAgICAgZm9yIChjb25zdCBpIG9mIGluZGljZXMpIHtcbiAgICAgICAgICAgICAgICAgICAgcmVzLnB1c2goaXRlcmFibGVbaV0pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB5aWVsZCByZXM7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBzdGF0aWMgemlwKGFycjE6IGFueVtdLCBhcnIyOiBhbnlbXSwgZmlsbHZhbHVlOiBzdHJpbmcgPSBcIi1cIikge1xuICAgICAgICBjb25zdCByZXMgPSBhcnIxLm1hcChmdW5jdGlvbihlLCBpKSB7XG4gICAgICAgICAgICByZXR1cm4gW2UsIGFycjJbaV1dO1xuICAgICAgICB9KTtcbiAgICAgICAgcmVzLmZvckVhY2goKHppcDogYW55KSA9PiB7XG4gICAgICAgICAgICBpZiAoemlwLmluY2x1ZGVzKHVuZGVmaW5lZCkpIHtcbiAgICAgICAgICAgICAgICB6aXAuc3BsaWNlKDEsIDEsIGZpbGx2YWx1ZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgICByZXR1cm4gcmVzO1xuICAgIH1cblxuICAgIHN0YXRpYyByYW5nZShuOiBudW1iZXIpIHtcbiAgICAgICAgcmV0dXJuIG5ldyBBcnJheShuKS5maWxsKDApLm1hcCgoXywgaWR4KSA9PiBpZHgpO1xuICAgIH1cblxuICAgIHN0YXRpYyBnZXRBcnJJbmRleChhcnIyZDogYW55W11bXSwgYXJyOiBhbnlbXSkge1xuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGFycjJkLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBpZiAoVXRpbC5hcnJFcShhcnIyZFtpXSwgYXJyKSkge1xuICAgICAgICAgICAgICAgIHJldHVybiBpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiB1bmRlZmluZWQ7XG4gICAgfVxuXG4gICAgLy8gc3RhdGljIGdldFN1cGVycyhvYmo6IGFueSkge1xuICAgIC8vICAgICBjb25zdCByZXM6IGFueVtdID0gW107XG4gICAgLy8gICAgIGxldCBzID0gT2JqZWN0LmdldFByb3RvdHlwZU9mKE9iamVjdC5nZXRQcm90b3R5cGVPZihvYmopKTtcbiAgICAvLyAgICAgd2hpbGUgKHMuY29uc3RydWN0b3IubmFtZSAhPT0gXCJPYmplY3RcIikge1xuICAgIC8vICAgICAgICAgcmVzLnB1c2gocy5uYW1lKTtcbiAgICAvLyAgICAgICAgIHMgPSBPYmplY3QuZ2V0UHJvdG90eXBlT2Yocyk7XG4gICAgLy8gICAgIH1cbiAgICAvLyAgICAgcmV0dXJuIHJlcztcbiAgICAvLyB9XG5cbiAgICBzdGF0aWMgZ2V0U3VwZXJzKGNsczogYW55KSB7XG4gICAgICAgIGNvbnN0IHJlczogYW55W10gPSBbXTtcbiAgICAgICAgbGV0IHMgPSBPYmplY3QuZ2V0UHJvdG90eXBlT2YoY2xzKTtcbiAgICAgICAgd2hpbGUgKHMuY29uc3RydWN0b3IubmFtZSAhPT0gXCJPYmplY3RcIikge1xuICAgICAgICAgICAgcmVzLnB1c2gocy5uYW1lKTtcbiAgICAgICAgICAgIHMgPSBPYmplY3QuZ2V0UHJvdG90eXBlT2Yocyk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHJlcztcbiAgICB9XG5cbiAgICBzdGF0aWMgc2h1ZmZsZUFycmF5KGFycjogYW55W10pIHtcbiAgICAgICAgZm9yIChsZXQgaSA9IGFyci5sZW5ndGggLSAxOyBpID4gMDsgaS0tKSB7XG4gICAgICAgICAgICBjb25zdCBqID0gTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogKGkgKyAxKSk7XG4gICAgICAgICAgICBjb25zdCB0ZW1wID0gYXJyW2ldO1xuICAgICAgICAgICAgYXJyW2ldID0gYXJyW2pdO1xuICAgICAgICAgICAgYXJyW2pdID0gdGVtcDtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHN0YXRpYyBhcnJNdWwoYXJyOiBhbnlbXSwgbjogbnVtYmVyKSB7XG4gICAgICAgIGNvbnN0IHJlcyA9IFtdO1xuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IG47IGkrKykge1xuICAgICAgICAgICAgcmVzLnB1c2goYXJyKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gcmVzO1xuICAgIH1cblxuICAgIHN0YXRpYyBhc3NpZ25FbGVtZW50cyhhcnI6IGFueVtdLCBuZXd2YWxzOiBhbnlbXSwgc3RhcnQ6IG51bWJlciwgc3RlcDogbnVtYmVyKSB7XG4gICAgICAgIGxldCBjb3VudCA9IDA7XG4gICAgICAgIGZvciAobGV0IGkgPSBzdGFydDsgaSA8IGFyci5sZW5ndGg7IGkrPXN0ZXApIHtcbiAgICAgICAgICAgIGFycltpXSA9IG5ld3ZhbHNbY291bnRdO1xuICAgICAgICAgICAgY291bnQrKztcbiAgICAgICAgfVxuICAgIH1cbn1cblxuLy8gY3VzdG9tIHZlcnNpb24gb2YgdGhlIFNldCBjbGFzc1xuLy8gbmVlZGVkIHNpbmNlIHN5bXB5IHJlbGllcyBvbiBpdGVtIHR1cGxlcyB3aXRoIGVxdWFsIGNvbnRlbnRzIGJlaW5nIG1hcHBlZFxuLy8gdG8gdGhlIHNhbWUgZW50cnlcbmNsYXNzIEhhc2hTZXQge1xuICAgIGRpY3Q6IFJlY29yZDxzdHJpbmcsIGFueT47XG4gICAgc2l6ZTogbnVtYmVyO1xuICAgIHNvcnRlZEFycjogYW55W107XG5cbiAgICBjb25zdHJ1Y3RvcihhcnI/OiBhbnlbXSkge1xuICAgICAgICB0aGlzLnNpemUgPSAwO1xuICAgICAgICB0aGlzLmRpY3QgPSB7fTtcbiAgICAgICAgaWYgKGFycikge1xuICAgICAgICAgICAgQXJyYXkuZnJvbShhcnIpLmZvckVhY2goKGVsZW1lbnQpID0+IHtcbiAgICAgICAgICAgICAgICB0aGlzLmFkZChlbGVtZW50KTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgY2xvbmUoKTogSGFzaFNldCB7XG4gICAgICAgIGNvbnN0IG5ld3NldDogSGFzaFNldCA9IG5ldyBIYXNoU2V0KCk7XG4gICAgICAgIGZvciAoY29uc3QgaXRlbSBvZiBPYmplY3QudmFsdWVzKHRoaXMuZGljdCkpIHtcbiAgICAgICAgICAgIG5ld3NldC5hZGQoaXRlbSk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIG5ld3NldDtcbiAgICB9XG5cbiAgICBlbmNvZGUoaXRlbTogYW55KTogc3RyaW5nIHtcbiAgICAgICAgcmV0dXJuIFV0aWwuaGFzaEtleShpdGVtKTtcbiAgICB9XG5cbiAgICBhZGQoaXRlbTogYW55KSB7XG4gICAgICAgIGNvbnN0IGtleSA9IHRoaXMuZW5jb2RlKGl0ZW0pO1xuICAgICAgICBpZiAoIShrZXkgaW4gdGhpcy5kaWN0KSkge1xuICAgICAgICAgICAgdGhpcy5zaXplKys7XG4gICAgICAgIH07XG4gICAgICAgIHRoaXMuZGljdFtrZXldID0gaXRlbTtcbiAgICB9XG5cbiAgICBhZGRBcnIoYXJyOiBhbnlbXSkge1xuICAgICAgICBmb3IgKGNvbnN0IGUgb2YgYXJyKSB7XG4gICAgICAgICAgICB0aGlzLmFkZChlKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGhhcyhpdGVtOiBhbnkpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuZW5jb2RlKGl0ZW0pIGluIHRoaXMuZGljdDtcbiAgICB9XG5cbiAgICB0b0FycmF5KCkge1xuICAgICAgICByZXR1cm4gT2JqZWN0LnZhbHVlcyh0aGlzLmRpY3QpO1xuICAgIH1cblxuICAgIC8vIGdldCB0aGUgaGFzaGtleSBmb3IgdGhpcyBzZXQgKGUuZy4sIGluIGEgZGljdGlvbmFyeSlcbiAgICBoYXNoS2V5KCkge1xuICAgICAgICByZXR1cm4gdGhpcy50b0FycmF5KClcbiAgICAgICAgICAgIC5tYXAoKGUpID0+IFV0aWwuaGFzaEtleShlKSlcbiAgICAgICAgICAgIC5zb3J0KClcbiAgICAgICAgICAgIC5qb2luKFwiLFwiKTtcbiAgICB9XG5cbiAgICBpc0VtcHR5KCkge1xuICAgICAgICByZXR1cm4gdGhpcy5zaXplID09PSAwO1xuICAgIH1cblxuICAgIHJlbW92ZShpdGVtOiBhbnkpIHtcbiAgICAgICAgdGhpcy5zaXplLS07XG4gICAgICAgIGRlbGV0ZSB0aGlzLmRpY3RbdGhpcy5lbmNvZGUoaXRlbSldO1xuICAgIH1cblxuICAgIGdldChrZXk6IGFueSkge1xuICAgICAgICByZXR1cm4gdGhpcy5kaWN0W1V0aWwuaGFzaEtleShrZXkpXTtcbiAgICB9XG5cbiAgICBzZXQoa2V5OiBhbnksIHZhbDogYW55KSB7XG4gICAgICAgIHRoaXMuZGljdFtVdGlsLmhhc2hLZXkoa2V5KV0gPSB2YWw7XG4gICAgfVxuXG4gICAgc29ydChrZXlmdW5jOiBhbnkgPSAoKGE6IGFueSwgYjogYW55KSA9PiBhIC0gYiksIHJldmVyc2U6IGJvb2xlYW4gPSB0cnVlKSB7XG4gICAgICAgIHRoaXMuc29ydGVkQXJyID0gdGhpcy50b0FycmF5KCk7XG4gICAgICAgIHRoaXMuc29ydGVkQXJyLnNvcnQoa2V5ZnVuYyk7XG4gICAgICAgIGlmIChyZXZlcnNlKSB7XG4gICAgICAgICAgICB0aGlzLnNvcnRlZEFyci5yZXZlcnNlKCk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBwb3AoKSB7XG4gICAgICAgIHRoaXMuc29ydCgpOyAvLyAhISEgc2xvdyBidXQgSSBkb24ndCBzZWUgYSB3b3JrIGFyb3VuZFxuICAgICAgICBpZiAodGhpcy5zb3J0ZWRBcnIubGVuZ3RoID49IDEpIHtcbiAgICAgICAgICAgIGNvbnN0IHRlbXAgPSB0aGlzLnNvcnRlZEFyclt0aGlzLnNvcnRlZEFyci5sZW5ndGggLSAxXTtcbiAgICAgICAgICAgIHRoaXMucmVtb3ZlKHRlbXApO1xuICAgICAgICAgICAgcmV0dXJuIHRlbXA7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gdW5kZWZpbmVkO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgZGlmZmVyZW5jZShvdGhlcjogSGFzaFNldCkge1xuICAgICAgICBjb25zdCByZXMgPSBuZXcgSGFzaFNldCgpO1xuICAgICAgICBmb3IgKGNvbnN0IGkgb2YgdGhpcy50b0FycmF5KCkpIHtcbiAgICAgICAgICAgIGlmICghKG90aGVyLmhhcyhpKSkpIHtcbiAgICAgICAgICAgICAgICByZXMuYWRkKGkpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiByZXM7XG4gICAgfVxufVxuXG4vLyBhIGhhc2hkaWN0IGNsYXNzIHJlcGxhY2luZyB0aGUgZGljdCBjbGFzcyBpbiBweXRob25cbmNsYXNzIEhhc2hEaWN0IHtcbiAgICBzaXplOiBudW1iZXI7XG4gICAgZGljdDogUmVjb3JkPGFueSwgYW55PjtcblxuICAgIGNvbnN0cnVjdG9yKGQ6IFJlY29yZDxhbnksIGFueT4gPSB7fSkge1xuICAgICAgICB0aGlzLnNpemUgPSAwO1xuICAgICAgICB0aGlzLmRpY3QgPSB7fTtcbiAgICAgICAgZm9yIChjb25zdCBpdGVtIG9mIE9iamVjdC5lbnRyaWVzKGQpKSB7XG4gICAgICAgICAgICB0aGlzLmRpY3RbVXRpbC5oYXNoS2V5KGl0ZW1bMF0pXSA9IFtpdGVtWzBdLCBpdGVtWzFdXTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGNsb25lKCkge1xuICAgICAgICByZXR1cm4gbmV3IEhhc2hEaWN0KHRoaXMuZGljdCk7XG4gICAgfVxuXG4gICAgcmVtb3ZlKGl0ZW06IGFueSkge1xuICAgICAgICB0aGlzLnNpemUtLTtcbiAgICAgICAgZGVsZXRlIHRoaXMuZGljdFtVdGlsLmhhc2hLZXkoaXRlbSldO1xuICAgIH1cblxuICAgIHNldGRlZmF1bHQoa2V5OiBhbnksIHZhbHVlOiBhbnkpIHtcbiAgICAgICAgaWYgKHRoaXMuaGFzKGtleSkpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmdldChrZXkpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5hZGQoa2V5LCB2YWx1ZSk7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5nZXQoa2V5KTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGdldChrZXk6IGFueSwgZGVmOiBhbnkgPSB1bmRlZmluZWQpOiBhbnkge1xuICAgICAgICBjb25zdCBoYXNoID0gVXRpbC5oYXNoS2V5KGtleSk7XG4gICAgICAgIGlmIChoYXNoIGluIHRoaXMuZGljdCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuZGljdFtoYXNoXVsxXTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gZGVmO1xuICAgIH1cblxuICAgIGhhcyhrZXk6IGFueSk6IGJvb2xlYW4ge1xuICAgICAgICBjb25zdCBoYXNoS2V5ID0gVXRpbC5oYXNoS2V5KGtleSk7XG4gICAgICAgIHJldHVybiBoYXNoS2V5IGluIHRoaXMuZGljdDtcbiAgICB9XG5cbiAgICBhZGQoa2V5OiBhbnksIHZhbHVlOiBhbnkpIHtcbiAgICAgICAgY29uc3Qga2V5SGFzaCA9IFV0aWwuaGFzaEtleShrZXkpO1xuICAgICAgICBpZiAoIShrZXlIYXNoIGluIE9iamVjdC5rZXlzKHRoaXMuZGljdCkpKSB7XG4gICAgICAgICAgICB0aGlzLnNpemUrKztcbiAgICAgICAgfVxuICAgICAgICB0aGlzLmRpY3Rba2V5SGFzaF0gPSBba2V5LCB2YWx1ZV07XG4gICAgfVxuXG4gICAga2V5cygpIHtcbiAgICAgICAgY29uc3QgdmFscyA9IE9iamVjdC52YWx1ZXModGhpcy5kaWN0KTtcbiAgICAgICAgcmV0dXJuIHZhbHMubWFwKChlKSA9PiBlWzBdKTtcbiAgICB9XG5cbiAgICB2YWx1ZXMoKSB7XG4gICAgICAgIGNvbnN0IHZhbHMgPSBPYmplY3QudmFsdWVzKHRoaXMuZGljdCk7XG4gICAgICAgIHJldHVybiB2YWxzLm1hcCgoZSkgPT4gZVsxXSk7XG4gICAgfVxuXG4gICAgZW50cmllcygpIHtcbiAgICAgICAgcmV0dXJuIE9iamVjdC52YWx1ZXModGhpcy5kaWN0KTtcbiAgICB9XG5cbiAgICBhZGRBcnIoYXJyOiBhbnlbXSkge1xuICAgICAgICBjb25zdCBrZXlIYXNoID0gVXRpbC5oYXNoS2V5KGFyclswXSk7XG4gICAgICAgIHRoaXMuZGljdFtrZXlIYXNoXSA9IGFycjtcbiAgICB9XG5cbiAgICBkZWxldGUoa2V5OiBhbnkpIHtcbiAgICAgICAgY29uc3Qga2V5aGFzaCA9IFV0aWwuaGFzaEtleShrZXkpO1xuICAgICAgICBpZiAoa2V5aGFzaCBpbiB0aGlzLmRpY3QpIHtcbiAgICAgICAgICAgIHRoaXMuc2l6ZS0tO1xuICAgICAgICAgICAgZGVsZXRlIHRoaXMuZGljdFtrZXloYXNoXTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIG1lcmdlKG90aGVyOiBIYXNoRGljdCkge1xuICAgICAgICBmb3IgKGNvbnN0IGl0ZW0gb2Ygb3RoZXIuZW50cmllcygpKSB7XG4gICAgICAgICAgICB0aGlzLmFkZChpdGVtWzBdLCBpdGVtWzFdKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGNvcHkoKSB7XG4gICAgICAgIGNvbnN0IHJlczogSGFzaERpY3QgPSBuZXcgSGFzaERpY3QoKTtcbiAgICAgICAgZm9yIChjb25zdCBpdGVtIG9mIHRoaXMuZW50cmllcygpKSB7XG4gICAgICAgICAgICByZXMuYWRkKGl0ZW1bMF0sIGl0ZW1bMV0pO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiByZXM7XG4gICAgfVxuXG4gICAgaXNTYW1lKG90aGVyOiBIYXNoRGljdCkge1xuICAgICAgICBjb25zdCBhcnIxID0gdGhpcy5lbnRyaWVzKCkuc29ydCgpO1xuICAgICAgICBjb25zdCBhcnIyID0gb3RoZXIuZW50cmllcygpLnNvcnQoKTtcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBhcnIxLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBpZiAoIShVdGlsLmFyckVxKGFycjFbaV0sIGFycjJbaV0pKSkge1xuICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG59XG5cblxuLy8gc3ltcHkgb2Z0ZW4gdXNlcyBkZWZhdWx0ZGljdChzZXQpIHdoaWNoIGlzIG5vdCBhdmFpbGFibGUgaW4gdHNcbi8vIHdlIGNyZWF0ZSBhIHJlcGxhY2VtZW50IGRpY3Rpb25hcnkgY2xhc3Mgd2hpY2ggcmV0dXJucyBhbiBlbXB0eSBzZXRcbi8vIGlmIHRoZSBrZXkgdXNlZCBpcyBub3QgaW4gdGhlIGRpY3Rpb25hcnlcbmNsYXNzIFNldERlZmF1bHREaWN0IGV4dGVuZHMgSGFzaERpY3Qge1xuICAgIGNvbnN0cnVjdG9yKCkge1xuICAgICAgICBzdXBlcigpO1xuICAgIH1cblxuICAgIGdldChrZXk6IGFueSkge1xuICAgICAgICBjb25zdCBrZXlIYXNoID0gVXRpbC5oYXNoS2V5KGtleSk7XG4gICAgICAgIGlmIChrZXlIYXNoIGluIHRoaXMuZGljdCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuZGljdFtrZXlIYXNoXVsxXTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gbmV3IEhhc2hTZXQoKTtcbiAgICB9XG59XG5cbmNsYXNzIEludERlZmF1bHREaWN0IGV4dGVuZHMgSGFzaERpY3Qge1xuICAgIGNvbnN0cnVjdG9yKCkge1xuICAgICAgICBzdXBlcigpO1xuICAgIH1cblxuICAgIGluY3JlbWVudChrZXk6IGFueSwgdmFsOiBhbnkpIHtcbiAgICAgICAgY29uc3Qga2V5SGFzaCA9IFV0aWwuaGFzaEtleShrZXkpO1xuICAgICAgICBpZiAoa2V5SGFzaCBpbiB0aGlzLmRpY3QpIHtcbiAgICAgICAgICAgIHRoaXMuZGljdFtrZXlIYXNoXSArPSB2YWw7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aGlzLmRpY3Rba2V5SGFzaF0gPSAwO1xuICAgICAgICAgICAgdGhpcy5kaWN0W2tleUhhc2hdICs9IHZhbDtcbiAgICAgICAgfVxuICAgIH1cbn1cblxuY2xhc3MgQXJyRGVmYXVsdERpY3QgZXh0ZW5kcyBIYXNoRGljdCB7XG4gICAgY29uc3RydWN0b3IoKSB7XG4gICAgICAgIHN1cGVyKCk7XG4gICAgfVxuXG4gICAgZ2V0KGtleTogYW55KSB7XG4gICAgICAgIGNvbnN0IGtleUhhc2ggPSBVdGlsLmhhc2hLZXkoa2V5KTtcbiAgICAgICAgaWYgKGtleUhhc2ggaW4gdGhpcy5kaWN0KSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5kaWN0W2tleUhhc2hdWzFdO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBbXTtcbiAgICB9XG59XG5cblxuLy8gYW4gaW1wbGljYXRpb24gY2xhc3MgdXNlZCBhcyBhbiBhbHRlcm5hdGl2ZSB0byB0dXBsZXMgaW4gc3ltcHlcbmNsYXNzIEltcGxpY2F0aW9uIHtcbiAgICBwO1xuICAgIHE7XG5cbiAgICBjb25zdHJ1Y3RvcihwOiBhbnksIHE6IGFueSkge1xuICAgICAgICB0aGlzLnAgPSBwO1xuICAgICAgICB0aGlzLnEgPSBxO1xuICAgIH1cblxuICAgIGhhc2hLZXkoKSB7XG4gICAgICAgIHJldHVybiAodGhpcy5wIGFzIHN0cmluZykgKyAodGhpcy5xIGFzIHN0cmluZyk7XG4gICAgfVxufVxuXG5cbi8vIGFuIExSVSBjYWNoZSBpbXBsZW1lbnRhdGlvbiB1c2VkIGZvciBjYWNoZS50c1xuXG5pbnRlcmZhY2UgTm9kZSB7XG4gICAga2V5OiBhbnk7XG4gICAgdmFsdWU6IGFueTtcbiAgICBwcmV2OiBhbnk7XG4gICAgbmV4dDogYW55O1xufVxuXG5jbGFzcyBMUlVDYWNoZSB7XG4gICAgY2FwYWNpdHk6IG51bWJlcjtcbiAgICBtYXA6IEhhc2hEaWN0O1xuICAgIGhlYWQ6IGFueTtcbiAgICB0YWlsOiBhbnk7XG5cbiAgICBjb25zdHJ1Y3RvcihjYXBhY2l0eTogbnVtYmVyKSB7XG4gICAgICAgIHRoaXMuY2FwYWNpdHkgPSBjYXBhY2l0eTtcbiAgICAgICAgdGhpcy5tYXAgPSBuZXcgSGFzaERpY3QoKTtcblxuICAgICAgICAvLyB0aGVzZSBhcmUgYm91bmRhcmllcyBmb3IgdGhlIGRvdWJsZSBsaW5rZWQgbGlzdFxuICAgICAgICB0aGlzLmhlYWQgPSB7fTtcbiAgICAgICAgdGhpcy50YWlsID0ge307XG5cbiAgICAgICAgdGhpcy5oZWFkLm5leHQgPSB0aGlzLmhlYWQ7XG4gICAgICAgIHRoaXMudGFpbC5wcmV2ID0gdGhpcy5oZWFkO1xuICAgIH1cblxuICAgIGdldChrZXk6IGFueSkge1xuICAgICAgICBpZiAodGhpcy5tYXAuaGFzKGtleSkpIHtcbiAgICAgICAgICAgIC8vIHJlbW92ZSBlbGVtZW50IGZyb20gdGhlIGN1cnJlbnQgcG9zaXRpb25cbiAgICAgICAgICAgIGNvbnN0IGMgPSB0aGlzLm1hcC5nZXQoa2V5KTtcbiAgICAgICAgICAgIGMucHJldi5uZXh0ID0gYy5uZXh0O1xuICAgICAgICAgICAgYy5uZXh0LnByZXYgPSBjLnByZXY7XG5cbiAgICAgICAgICAgIHRoaXMudGFpbC5wcmV2Lm5leHQgPSBjOyAvLyBpbnNlcnQgYWZ0ZXIgbGFzdCBlbGVtZW50XG4gICAgICAgICAgICBjLnByZXYgPSB0aGlzLnRhaWwucHJldjtcbiAgICAgICAgICAgIGMubmV4dCA9IHRoaXMudGFpbDtcbiAgICAgICAgICAgIHRoaXMudGFpbC5wcmV2ID0gYztcblxuICAgICAgICAgICAgcmV0dXJuIGMudmFsdWU7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gdW5kZWZpbmVkOyAvLyBpbnZhbGlkIGtleVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgcHV0KGtleTogYW55LCB2YWx1ZTogYW55KSB7XG4gICAgICAgIGlmICh0eXBlb2YgdGhpcy5nZXQoa2V5KSAhPT0gXCJ1bmRlZmluZWRcIikgeyAvLyB0aGUga2V5IGlzIGludmFsaWRcbiAgICAgICAgICAgIHRoaXMudGFpbC5wcmV2LnZhbHVlID0gdmFsdWU7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAvLyBjaGVjayBmb3IgY2FwYWNpdHlcbiAgICAgICAgICAgIGlmICh0aGlzLm1hcC5zaXplID09PSB0aGlzLmNhcGFjaXR5KSB7XG4gICAgICAgICAgICAgICAgdGhpcy5tYXAuZGVsZXRlKHRoaXMuaGVhZC5uZXh0LmtleSk7IC8vIGRlbGV0ZSBmaXJzdCBlbGVtZW50XG4gICAgICAgICAgICAgICAgdGhpcy5oZWFkLm5leHQgPSB0aGlzLmhlYWQubmV4dC5uZXh0OyAvLyByZXBsYWNlIHdpdGggbmV4dFxuICAgICAgICAgICAgICAgIHRoaXMuaGVhZC5uZXh0LnByZXYgPSB0aGlzLmhlYWQ7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgY29uc3QgbmV3Tm9kZTogTm9kZSA9IHtcbiAgICAgICAgICAgIHZhbHVlLFxuICAgICAgICAgICAga2V5LFxuICAgICAgICAgICAgcHJldjogbnVsbCxcbiAgICAgICAgICAgIG5leHQ6IG51bGwsXG4gICAgICAgIH07IC8vIGVhY2ggbm9kZSBpcyBhIGhhc2ggZW50cnlcblxuICAgICAgICAvLyB3aGVuIGFkZGluZyBhIG5ldyBub2RlLCB3ZSBuZWVkIHRvIHVwZGF0ZSBib3RoIG1hcCBhbmQgRExMXG4gICAgICAgIHRoaXMubWFwLmFkZChrZXksIG5ld05vZGUpOyAvLyBhZGQgdGhlIGN1cnJlbnQgbm9kZVxuICAgICAgICB0aGlzLnRhaWwucHJldi5uZXh0ID0gbmV3Tm9kZTsgLy8gYWRkIG5vZGUgdG8gdGhlIGVuZFxuICAgICAgICBuZXdOb2RlLnByZXYgPSB0aGlzLnRhaWwucHJldjtcbiAgICAgICAgbmV3Tm9kZS5uZXh0ID0gdGhpcy50YWlsO1xuICAgICAgICB0aGlzLnRhaWwucHJldiA9IG5ld05vZGU7XG4gICAgfVxufVxuXG5jbGFzcyBJdGVyYXRvciB7XG4gICAgYXJyOiBhbnlbXTtcbiAgICBjb3VudGVyO1xuXG4gICAgY29uc3RydWN0b3IoYXJyOiBhbnlbXSkge1xuICAgICAgICB0aGlzLmFyciA9IGFycjtcbiAgICAgICAgdGhpcy5jb3VudGVyID0gMDtcbiAgICB9XG5cbiAgICBuZXh0KCkge1xuICAgICAgICBpZiAodGhpcy5jb3VudGVyID49IHRoaXMuYXJyLmxlbmd0aCkge1xuICAgICAgICAgICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLmNvdW50ZXIrKztcbiAgICAgICAgcmV0dXJuIHRoaXMuYXJyW3RoaXMuY291bnRlci0xXTtcbiAgICB9XG59XG5cbi8vIG1peGluIGNsYXNzIHVzZWQgdG8gcmVwbGljYXRlIG11bHRpcGxlIGluaGVyaXRhbmNlXG5cbmNsYXNzIE1peGluQnVpbGRlciB7XG4gICAgc3VwZXJjbGFzcztcbiAgICBjb25zdHJ1Y3RvcihzdXBlcmNsYXNzOiBhbnkpIHtcbiAgICAgICAgdGhpcy5zdXBlcmNsYXNzID0gc3VwZXJjbGFzcztcbiAgICB9XG4gICAgd2l0aCguLi5taXhpbnM6IGFueVtdKSB7XG4gICAgICAgIHJldHVybiBtaXhpbnMucmVkdWNlKChjLCBtaXhpbikgPT4gbWl4aW4oYyksIHRoaXMuc3VwZXJjbGFzcyk7XG4gICAgfVxufVxuXG5jbGFzcyBiYXNlIHt9XG5cbmNvbnN0IG1peCA9IChzdXBlcmNsYXNzOiBhbnkpID0+IG5ldyBNaXhpbkJ1aWxkZXIoc3VwZXJjbGFzcyk7XG5cblxuZXhwb3J0IHtVdGlsLCBIYXNoU2V0LCBTZXREZWZhdWx0RGljdCwgSGFzaERpY3QsIEltcGxpY2F0aW9uLCBMUlVDYWNoZSwgSXRlcmF0b3IsIEludERlZmF1bHREaWN0LCBBcnJEZWZhdWx0RGljdCwgbWl4LCBiYXNlfTtcblxuIiwgIi8qIGVzbGludC1kaXNhYmxlIG5ldy1jYXAgKi9cbi8qIGVzbGludC1kaXNhYmxlIG5vLXVudXNlZC12YXJzICovXG4vKlxuXG5Ob3RhYmxlIGNobmFnZXMgbWFkZSAoV0IgJiBHTSk6XG4tIE51bGwgaXMgYmVpbmcgdXNlZCBhcyBhIHRoaXJkIGJvb2xlYW4gdmFsdWUgaW5zdGVhZCBvZiAnbm9uZSdcbi0gQXJyYXlzIGFyZSBiZWluZyB1c2VkIGluc3RlYWQgb2YgdHVwbGVzXG4tIFRoZSBtZXRob2RzIGhhc2hLZXkoKSBhbmQgdG9TdHJpbmcoKSBhcmUgYWRkZWQgdG8gTG9naWMgZm9yIGhhc2hpbmcuIFRoZVxuICBzdGF0aWMgbWV0aG9kIGhhc2hLZXkoKSBpcyBhbHNvIGFkZGVkIHRvIExvZ2ljIGFuZCBoYXNoZXMgZGVwZW5kaW5nIG9uIHRoZSBpbnB1dC5cbi0gVGhlIGFycmF5IGFyZ3MgaW4gdGhlIEFuZE9yX0Jhc2UgY29uc3RydWN0b3IgaXMgbm90IHNvcnRlZCBvciBwdXQgaW4gYSBzZXRcbiAgc2luY2Ugd2UgZGlkJ3Qgc2VlIHdoeSB0aGlzIHdvdWxkIGJlIG5lY2VzYXJ5XG4tIEEgY29uc3RydWN0b3IgaXMgYWRkZWQgdG8gdGhlIGxvZ2ljIGNsYXNzLCB3aGljaCBpcyB1c2VkIGJ5IExvZ2ljIGFuZCBpdHNcbiAgc3ViY2xhc3NlcyAoQW5kT3JfQmFzZSwgQW5kLCBPciwgTm90KVxuLSBJbiB0aGUgZmxhdHRlbiBtZXRob2Qgb2YgQW5kT3JfQmFzZSB3ZSByZW1vdmVkIHRoZSB0cnkgY2F0Y2ggYW5kIGNoYW5nZWQgdGhlXG4gIHdoaWxlIGxvb3AgdG8gZGVwZW5kIG9uIHRoZSBsZWdudGggb2YgdGhlIGFyZ3MgYXJyYXlcbi0gQWRkZWQgZXhwYW5kKCkgYW5kIGV2YWxfcHJvcGFnYXRlX25vdCBhcyBhYnN0cmFjdCBtZXRob2RzIHRvIHRoZSBMb2dpYyBjbGFzc1xuLSBBZGRlZCBzdGF0aWMgTmV3IG1ldGhvZHMgdG8gTm90LCBBbmQsIGFuZCBPciB3aGljaCBmdW5jdGlvbiBhcyBjb25zdHJ1Y3RvcnNcbi0gUmVwbGFjZW1kIG5vcm1hbCBib29sZWFucyB3aXRoIExvZ2ljLlRydWUgYW5kIExvZ2ljLkZhbHNlIHNpbmNlIGl0IGlzIHNvbWV0aW1lc1xubmVjZXNhcnkgdG8gZmluZCBpZiBhIGdpdmVuIGFyZ3VtZW5ldCBpcyBhIGJvb2xlYW5cbi0gQWRkZWQgc29tZSB2MiBtZXRob2RzIHdoaWNoIHJldHVybiB0cnVlLCBmYWxzZSwgYW5kIHVuZGVmaW5lZCwgd2hpY2ggd29ya3NcbiAgd2l0aCB0aGUgcmVzdCBvZiB0aGUgY29kZVxuXG4qL1xuXG5pbXBvcnQge1V0aWx9IGZyb20gXCIuL3V0aWxpdHkuanNcIjtcblxuXG5mdW5jdGlvbiBfdG9yZihhcmdzOiBhbnlbXSk6IExvZ2ljIHwgbnVsbCB7XG4gICAgLyogUmV0dXJuIFRydWUgaWYgYWxsIGFyZ3MgYXJlIFRydWUsIEZhbHNlIGlmIHRoZXlcbiAgICBhcmUgYWxsIEZhbHNlLCBlbHNlIE5vbmVcbiAgICA+Pj4gZnJvbSBzeW1weS5jb3JlLmxvZ2ljIGltcG9ydCBfdG9yZlxuICAgID4+PiBfdG9yZigoVHJ1ZSwgVHJ1ZSkpXG4gICAgVHJ1ZVxuICAgID4+PiBfdG9yZigoRmFsc2UsIEZhbHNlKSlcbiAgICBGYWxzZVxuICAgID4+PiBfdG9yZigoVHJ1ZSwgRmFsc2UpKVxuICAgICovXG4gICAgbGV0IHNhd1QgPSBMb2dpYy5GYWxzZTtcbiAgICBsZXQgc2F3RiA9IExvZ2ljLkZhbHNlO1xuICAgIGZvciAoY29uc3QgYSBvZiBhcmdzKSB7XG4gICAgICAgIGlmIChhID09PSBMb2dpYy5UcnVlKSB7XG4gICAgICAgICAgICBpZiAoc2F3RiBpbnN0YW5jZW9mIFRydWUpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHNhd1QgPSBMb2dpYy5UcnVlO1xuICAgICAgICB9IGVsc2UgaWYgKGEgPT09IExvZ2ljLkZhbHNlKSB7XG4gICAgICAgICAgICBpZiAoc2F3VCBpbnN0YW5jZW9mIFRydWUpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHNhd0YgPSBMb2dpYy5UcnVlO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIHNhd1Q7XG59XG5cbmZ1bmN0aW9uIF9mdXp6eV9ncm91cChhcmdzOiBhbnlbXSwgcXVpY2tfZXhpdCA9IExvZ2ljLkZhbHNlKTogTG9naWMgfCBudWxsIHtcbiAgICAvKiBSZXR1cm4gVHJ1ZSBpZiBhbGwgYXJncyBhcmUgVHJ1ZSwgTm9uZSBpZiB0aGVyZSBpcyBhbnkgTm9uZSBlbHNlIEZhbHNlXG4gICAgdW5sZXNzIGBgcXVpY2tfZXhpdGBgIGlzIFRydWUgKHRoZW4gcmV0dXJuIE5vbmUgYXMgc29vbiBhcyBhIHNlY29uZCBGYWxzZVxuICAgIGlzIHNlZW4uXG4gICAgIGBgX2Z1enp5X2dyb3VwYGAgaXMgbGlrZSBgYGZ1enp5X2FuZGBgIGV4Y2VwdCB0aGF0IGl0IGlzIG1vcmVcbiAgICBjb25zZXJ2YXRpdmUgaW4gcmV0dXJuaW5nIGEgRmFsc2UsIHdhaXRpbmcgdG8gbWFrZSBzdXJlIHRoYXQgYWxsXG4gICAgYXJndW1lbnRzIGFyZSBUcnVlIG9yIEZhbHNlIGFuZCByZXR1cm5pbmcgTm9uZSBpZiBhbnkgYXJndW1lbnRzIGFyZVxuICAgIE5vbmUuIEl0IGFsc28gaGFzIHRoZSBjYXBhYmlsaXR5IG9mIHBlcm1pdGluZyBvbmx5IGEgc2luZ2xlIEZhbHNlIGFuZFxuICAgIHJldHVybmluZyBOb25lIGlmIG1vcmUgdGhhbiBvbmUgaXMgc2Vlbi4gRm9yIGV4YW1wbGUsIHRoZSBwcmVzZW5jZSBvZiBhXG4gICAgc2luZ2xlIHRyYW5zY2VuZGVudGFsIGFtb25nc3QgcmF0aW9uYWxzIHdvdWxkIGluZGljYXRlIHRoYXQgdGhlIGdyb3VwIGlzXG4gICAgbm8gbG9uZ2VyIHJhdGlvbmFsOyBidXQgYSBzZWNvbmQgdHJhbnNjZW5kZW50YWwgaW4gdGhlIGdyb3VwIHdvdWxkIG1ha2UgdGhlXG4gICAgZGV0ZXJtaW5hdGlvbiBpbXBvc3NpYmxlLlxuICAgIEV4YW1wbGVzXG4gICAgPT09PT09PT1cbiAgICA+Pj4gZnJvbSBzeW1weS5jb3JlLmxvZ2ljIGltcG9ydCBfZnV6enlfZ3JvdXBcbiAgICBCeSBkZWZhdWx0LCBtdWx0aXBsZSBGYWxzZXMgbWVhbiB0aGUgZ3JvdXAgaXMgYnJva2VuOlxuICAgID4+PiBfZnV6enlfZ3JvdXAoW0ZhbHNlLCBGYWxzZSwgVHJ1ZV0pXG4gICAgRmFsc2VcbiAgICBJZiBtdWx0aXBsZSBGYWxzZXMgbWVhbiB0aGUgZ3JvdXAgc3RhdHVzIGlzIHVua25vd24gdGhlbiBzZXRcbiAgICBgcXVpY2tfZXhpdGAgdG8gVHJ1ZSBzbyBOb25lIGNhbiBiZSByZXR1cm5lZCB3aGVuIHRoZSAybmQgRmFsc2UgaXMgc2VlbjpcbiAgICA+Pj4gX2Z1enp5X2dyb3VwKFtGYWxzZSwgRmFsc2UsIFRydWVdLCBxdWlja19leGl0PVRydWUpXG4gICAgQnV0IGlmIG9ubHkgYSBzaW5nbGUgRmFsc2UgaXMgc2VlbiB0aGVuIHRoZSBncm91cCBpcyBrbm93biB0b1xuICAgIGJlIGJyb2tlbjpcbiAgICA+Pj4gX2Z1enp5X2dyb3VwKFtGYWxzZSwgVHJ1ZSwgVHJ1ZV0sIHF1aWNrX2V4aXQ9VHJ1ZSlcbiAgICBGYWxzZVxuICAgICovXG4gICAgbGV0IHNhd19vdGhlciA9IExvZ2ljLkZhbHNlO1xuICAgIGZvciAoY29uc3QgYSBvZiBhcmdzKSB7XG4gICAgICAgIGlmIChhID09PSBMb2dpYy5UcnVlKSB7XG4gICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgfSBpZiAoYSA9PSBudWxsKSB7XG4gICAgICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgICAgfSBpZiAocXVpY2tfZXhpdCBpbnN0YW5jZW9mIFRydWUgJiYgc2F3X290aGVyIGluc3RhbmNlb2YgVHJ1ZSkge1xuICAgICAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICAgIH1cbiAgICAgICAgc2F3X290aGVyID0gTG9naWMuVHJ1ZTtcbiAgICB9XG4gICAgaWYgKHNhd19vdGhlciBpbnN0YW5jZW9mIFRydWUpIHtcbiAgICAgICAgcmV0dXJuIExvZ2ljLkZhbHNlO1xuICAgIH1cbiAgICByZXR1cm4gTG9naWMuVHJ1ZTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIF9mdXp6eV9ncm91cHYyKGFyZ3M6IGFueVtdKSB7XG4gICAgY29uc3QgcmVzID0gX2Z1enp5X2dyb3VwKGFyZ3MpO1xuICAgIGlmIChyZXMgPT09IExvZ2ljLlRydWUpIHtcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgfSBlbHNlIGlmIChyZXMgPT09IExvZ2ljLkZhbHNlKSB7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gICAgcmV0dXJuIHVuZGVmaW5lZDtcbn1cblxuXG5mdW5jdGlvbiBmdXp6eV9ib29sKHg6IExvZ2ljKTogTG9naWMgfCBudWxsIHtcbiAgICAvKiBSZXR1cm4gVHJ1ZSwgRmFsc2Ugb3IgTm9uZSBhY2NvcmRpbmcgdG8geC5cbiAgICBXaGVyZWFzIGJvb2woeCkgcmV0dXJucyBUcnVlIG9yIEZhbHNlLCBmdXp6eV9ib29sIGFsbG93c1xuICAgIGZvciB0aGUgTm9uZSB2YWx1ZSBhbmQgbm9uIC0gZmFsc2UgdmFsdWVzKHdoaWNoIGJlY29tZSBOb25lKSwgdG9vLlxuICAgIEV4YW1wbGVzXG4gICAgPT09PT09PT1cbiAgICA+Pj4gZnJvbSBzeW1weS5jb3JlLmxvZ2ljIGltcG9ydCBmdXp6eV9ib29sXG4gICAgPj4+IGZyb20gc3ltcHkuYWJjIGltcG9ydCB4XG4gICAgPj4+IGZ1enp5X2Jvb2woeCksIGZ1enp5X2Jvb2woTm9uZSlcbiAgICAoTm9uZSwgTm9uZSlcbiAgICA+Pj4gYm9vbCh4KSwgYm9vbChOb25lKVxuICAgICAgICAoVHJ1ZSwgRmFsc2UpXG4gICAgKi9cbiAgICBpZiAoeCA9PSBudWxsKSB7XG4gICAgICAgIHJldHVybiBudWxsO1xuICAgIH1cbiAgICBpZiAoeCBpbnN0YW5jZW9mIFRydWUpIHtcbiAgICAgICAgcmV0dXJuIExvZ2ljLlRydWU7XG4gICAgfVxuICAgIGlmICh4IGluc3RhbmNlb2YgRmFsc2UpIHtcbiAgICAgICAgcmV0dXJuIExvZ2ljLkZhbHNlO1xuICAgIH1cbn1cblxuZnVuY3Rpb24gZnV6enlfYm9vbF92Mih4OiBib29sZWFuKSB7XG4gICAgLyogUmV0dXJuIFRydWUsIEZhbHNlIG9yIE5vbmUgYWNjb3JkaW5nIHRvIHguXG4gICAgV2hlcmVhcyBib29sKHgpIHJldHVybnMgVHJ1ZSBvciBGYWxzZSwgZnV6enlfYm9vbCBhbGxvd3NcbiAgICBmb3IgdGhlIE5vbmUgdmFsdWUgYW5kIG5vbiAtIGZhbHNlIHZhbHVlcyh3aGljaCBiZWNvbWUgTm9uZSksIHRvby5cbiAgICBFeGFtcGxlc1xuICAgID09PT09PT09XG4gICAgPj4+IGZyb20gc3ltcHkuY29yZS5sb2dpYyBpbXBvcnQgZnV6enlfYm9vbFxuICAgID4+PiBmcm9tIHN5bXB5LmFiYyBpbXBvcnQgeFxuICAgID4+PiBmdXp6eV9ib29sKHgpLCBmdXp6eV9ib29sKE5vbmUpXG4gICAgKE5vbmUsIE5vbmUpXG4gICAgPj4+IGJvb2woeCksIGJvb2woTm9uZSlcbiAgICAgICAgKFRydWUsIEZhbHNlKVxuICAgICovXG4gICAgaWYgKHR5cGVvZiB4ID09PSBcInVuZGVmaW5lZFwiKSB7XG4gICAgICAgIHJldHVybiBudWxsO1xuICAgIH1cbiAgICBpZiAoeCA9PT0gdHJ1ZSkge1xuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG4gICAgaWYgKHggPT09IGZhbHNlKSB7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG59XG5cbmZ1bmN0aW9uIGZ1enp5X2FuZChhcmdzOiBhbnlbXSk6IExvZ2ljIHwgbnVsbCB7XG4gICAgLyogUmV0dXJuIFRydWUgKGFsbCBUcnVlKSwgRmFsc2UgKGFueSBGYWxzZSkgb3IgTm9uZS5cbiAgICBFeGFtcGxlc1xuICAgID09PT09PT09XG4gICAgPj4+IGZyb20gc3ltcHkuY29yZS5sb2dpYyBpbXBvcnQgZnV6enlfYW5kXG4gICAgPj4+IGZyb20gc3ltcHkgaW1wb3J0IER1bW15XG4gICAgSWYgeW91IGhhZCBhIGxpc3Qgb2Ygb2JqZWN0cyB0byB0ZXN0IHRoZSBjb21tdXRpdml0eSBvZlxuICAgIGFuZCB5b3Ugd2FudCB0aGUgZnV6enlfYW5kIGxvZ2ljIGFwcGxpZWQsIHBhc3NpbmcgYW5cbiAgICBpdGVyYXRvciB3aWxsIGFsbG93IHRoZSBjb21tdXRhdGl2aXR5IHRvIG9ubHkgYmUgY29tcHV0ZWRcbiAgICBhcyBtYW55IHRpbWVzIGFzIG5lY2Vzc2FyeS5XaXRoIHRoaXMgbGlzdCwgRmFsc2UgY2FuIGJlXG4gICAgcmV0dXJuZWQgYWZ0ZXIgYW5hbHl6aW5nIHRoZSBmaXJzdCBzeW1ib2w6XG4gICAgPj4+IHN5bXMgPVtEdW1teShjb21tdXRhdGl2ZSA9IEZhbHNlKSwgRHVtbXkoKV1cbiAgICA+Pj4gZnV6enlfYW5kKHMuaXNfY29tbXV0YXRpdmUgZm9yIHMgaW4gc3ltcylcbiAgICBGYWxzZVxuICAgIFRoYXQgRmFsc2Ugd291bGQgcmVxdWlyZSBsZXNzIHdvcmsgdGhhbiBpZiBhIGxpc3Qgb2YgcHJlIC0gY29tcHV0ZWRcbiAgICBpdGVtcyB3YXMgc2VudDpcbiAgICA+Pj4gZnV6enlfYW5kKFtzLmlzX2NvbW11dGF0aXZlIGZvciBzIGluIHN5bXNdKVxuICAgIEZhbHNlXG4gICAgKi9cblxuICAgIGxldCBydiA9IExvZ2ljLlRydWU7XG4gICAgZm9yIChsZXQgYWkgb2YgYXJncykge1xuICAgICAgICBhaSA9IGZ1enp5X2Jvb2woYWkpO1xuICAgICAgICBpZiAoYWkgaW5zdGFuY2VvZiBGYWxzZSkge1xuICAgICAgICAgICAgcmV0dXJuIExvZ2ljLkZhbHNlO1xuICAgICAgICB9IGlmIChydiBpbnN0YW5jZW9mIFRydWUpIHsgLy8gdGhpcyB3aWxsIHN0b3AgdXBkYXRpbmcgaWYgYSBOb25lIGlzIGV2ZXIgdHJhcHBlZFxuICAgICAgICAgICAgcnYgPSBhaTtcbiAgICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gcnY7XG59XG5cbmZ1bmN0aW9uIGZ1enp5X2FuZF92MihhcmdzOiBhbnlbXSkge1xuICAgIGxldCBydiA9IHRydWU7XG4gICAgZm9yIChsZXQgYWkgb2YgYXJncykge1xuICAgICAgICBhaSA9IGZ1enp5X2Jvb2xfdjIoYWkpO1xuICAgICAgICBpZiAoYWkgPT09IGZhbHNlKSB7XG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH0gaWYgKHJ2ID09PSB0cnVlKSB7XG4gICAgICAgICAgICBydiA9IGFpO1xuICAgICAgICB9XG4gICAgfVxuICAgIHJldHVybiBydjtcbn1cblxuZnVuY3Rpb24gZnV6enlfbm90KHY6IGFueSk6IExvZ2ljIHwgbnVsbCB7XG4gICAgLypcbiAgICBOb3QgaW4gZnV6enkgbG9naWNcbiAgICAgICAgUmV0dXJuIE5vbmUgaWYgYHZgIGlzIE5vbmUgZWxzZSBgbm90IHZgLlxuICAgICAgICBFeGFtcGxlc1xuICAgICAgICA9PT09PT09PVxuICAgICAgICA+Pj4gZnJvbSBzeW1weS5jb3JlLmxvZ2ljIGltcG9ydCBmdXp6eV9ub3RcbiAgICAgICAgPj4+IGZ1enp5X25vdChUcnVlKVxuICAgIEZhbHNlXG4gICAgICAgID4+PiBmdXp6eV9ub3QoTm9uZSlcbiAgICAgICAgPj4+IGZ1enp5X25vdChGYWxzZSlcbiAgICBUcnVlXG4gICAgKi9cbiAgICBpZiAodiA9PSBudWxsKSB7XG4gICAgICAgIHJldHVybiB2O1xuICAgIH0gZWxzZSBpZiAodiBpbnN0YW5jZW9mIFRydWUpIHtcbiAgICAgICAgcmV0dXJuIExvZ2ljLkZhbHNlO1xuICAgIH1cbiAgICByZXR1cm4gTG9naWMuVHJ1ZTtcbn1cblxuXG5leHBvcnQgZnVuY3Rpb24gZnV6enlfbm90djIodjogYW55KSB7XG4gICAgLypcbiAgICBOb3QgaW4gZnV6enkgbG9naWNcbiAgICAgICAgUmV0dXJuIE5vbmUgaWYgYHZgIGlzIE5vbmUgZWxzZSBgbm90IHZgLlxuICAgICAgICBFeGFtcGxlc1xuICAgICAgICA9PT09PT09PVxuICAgICAgICA+Pj4gZnJvbSBzeW1weS5jb3JlLmxvZ2ljIGltcG9ydCBmdXp6eV9ub3RcbiAgICAgICAgPj4+IGZ1enp5X25vdChUcnVlKVxuICAgIEZhbHNlXG4gICAgICAgID4+PiBmdXp6eV9ub3QoTm9uZSlcbiAgICAgICAgPj4+IGZ1enp5X25vdChGYWxzZSlcbiAgICBUcnVlXG4gICAgKi9cbiAgICBpZiAodiA9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgICB9IGVsc2UgaWYgKHYgPT09IHRydWUpIHtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgICByZXR1cm4gdHJ1ZTtcbn1cblxuXG5mdW5jdGlvbiBmdXp6eV9vcihhcmdzOiBhbnlbXSk6IExvZ2ljIHtcbiAgICAvKlxuICAgIE9yIGluIGZ1enp5IGxvZ2ljLlJldHVybnMgVHJ1ZShhbnkgVHJ1ZSksIEZhbHNlKGFsbCBGYWxzZSksIG9yIE5vbmVcbiAgICAgICAgU2VlIHRoZSBkb2NzdHJpbmdzIG9mIGZ1enp5X2FuZCBhbmQgZnV6enlfbm90IGZvciBtb3JlIGluZm8uZnV6enlfb3IgaXNcbiAgICAgICAgcmVsYXRlZCB0byB0aGUgdHdvIGJ5IHRoZSBzdGFuZGFyZCBEZSBNb3JnYW4ncyBsYXcuXG4gICAgICAgID4+PiBmcm9tIHN5bXB5LmNvcmUubG9naWMgaW1wb3J0IGZ1enp5X29yXG4gICAgICAgID4+PiBmdXp6eV9vcihbVHJ1ZSwgRmFsc2VdKVxuICAgIFRydWVcbiAgICAgICAgPj4+IGZ1enp5X29yKFtUcnVlLCBOb25lXSlcbiAgICBUcnVlXG4gICAgICAgID4+PiBmdXp6eV9vcihbRmFsc2UsIEZhbHNlXSlcbiAgICBGYWxzZVxuICAgICAgICA+Pj4gcHJpbnQoZnV6enlfb3IoW0ZhbHNlLCBOb25lXSkpXG4gICAgTm9uZVxuICAgICovXG4gICAgbGV0IHJ2ID0gTG9naWMuRmFsc2U7XG5cbiAgICBmb3IgKGxldCBhaSBvZiBhcmdzKSB7XG4gICAgICAgIGFpID0gZnV6enlfYm9vbChhaSk7XG4gICAgICAgIGlmIChhaSBpbnN0YW5jZW9mIFRydWUpIHtcbiAgICAgICAgICAgIHJldHVybiBMb2dpYy5UcnVlO1xuICAgICAgICB9XG4gICAgICAgIGlmIChydiBpbnN0YW5jZW9mIEZhbHNlKSB7IC8vIHRoaXMgd2lsbCBzdG9wIHVwZGF0aW5nIGlmIGEgTm9uZSBpcyBldmVyIHRyYXBwZWRcbiAgICAgICAgICAgIHJ2ID0gYWk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIHJ2O1xufVxuXG5mdW5jdGlvbiBmdXp6eV94b3IoYXJnczogYW55W10pOiBMb2dpYyB8IG51bGwge1xuICAgIC8qIFJldHVybiBOb25lIGlmIGFueSBlbGVtZW50IG9mIGFyZ3MgaXMgbm90IFRydWUgb3IgRmFsc2UsIGVsc2VcbiAgICBUcnVlKGlmIHRoZXJlIGFyZSBhbiBvZGQgbnVtYmVyIG9mIFRydWUgZWxlbWVudHMpLCBlbHNlIEZhbHNlLiAqL1xuICAgIGxldCB0ID0gMDtcbiAgICBsZXQgZiA9IDA7XG4gICAgZm9yIChjb25zdCBhIG9mIGFyZ3MpIHtcbiAgICAgICAgY29uc3QgYWkgPSBmdXp6eV9ib29sKGEpO1xuICAgICAgICBpZiAoYWkgaW5zdGFuY2VvZiBUcnVlKSB7XG4gICAgICAgICAgICB0ICs9IDE7XG4gICAgICAgIH0gZWxzZSBpZiAoYWkgaW5zdGFuY2VvZiBGYWxzZSkge1xuICAgICAgICAgICAgZiArPSAxO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICAgIH1cbiAgICB9XG4gICAgaWYgKHQgJSAyID09IDEpIHtcbiAgICAgICAgcmV0dXJuIExvZ2ljLlRydWU7XG4gICAgfVxuICAgIHJldHVybiBMb2dpYy5GYWxzZTtcbn1cblxuZnVuY3Rpb24gZnV6enlfbmFuZChhcmdzOiBhbnlbXSk6IExvZ2ljIHwgbnVsbCB7XG4gICAgLyogUmV0dXJuIEZhbHNlIGlmIGFsbCBhcmdzIGFyZSBUcnVlLCBUcnVlIGlmIHRoZXkgYXJlIGFsbCBGYWxzZSxcbiAgICBlbHNlIE5vbmUuICovXG4gICAgcmV0dXJuIGZ1enp5X25vdChmdXp6eV9hbmQoYXJncykpO1xufVxuXG5cbmNsYXNzIExvZ2ljIHtcbiAgICBzdGF0aWMgVHJ1ZTogTG9naWM7XG4gICAgc3RhdGljIEZhbHNlOiBMb2dpYztcblxuICAgIHN0YXRpYyBvcF8yY2xhc3M6IFJlY29yZDxzdHJpbmcsICguLi5hcmdzOiBhbnlbXSkgPT4gTG9naWM+ID0ge1xuICAgICAgICBcIiZcIjogKC4uLmFyZ3MpID0+IHtcbiAgICAgICAgICAgIHJldHVybiBBbmQuX19uZXdfXyhBbmQucHJvdG90eXBlLCAuLi5hcmdzKTtcbiAgICAgICAgfSxcbiAgICAgICAgXCJ8XCI6ICguLi5hcmdzKSA9PiB7XG4gICAgICAgICAgICByZXR1cm4gT3IuX19uZXdfXyhPci5wcm90b3R5cGUsIC4uLmFyZ3MpO1xuICAgICAgICB9LFxuICAgICAgICBcIiFcIjogKGFyZykgPT4ge1xuICAgICAgICAgICAgcmV0dXJuIE5vdC5fX25ld19fKE5vdC5wcm90b3R5cGUsIGFyZyk7XG4gICAgICAgIH0sXG4gICAgfTtcblxuICAgIGFyZ3M6IGFueVtdO1xuXG4gICAgY29uc3RydWN0b3IoLi4uYXJnczogYW55W10pIHtcbiAgICAgICAgdGhpcy5hcmdzID0gYXJncztcbiAgICB9XG5cbiAgICBfZXZhbF9wcm9wYWdhdGVfbm90KCk6IGFueSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcihcIkV2YWwgcHJvcGFnYXRlIG5vdCBpcyBhYnN0cmFjdCBpbiBMb2dpY1wiKTtcbiAgICB9XG5cbiAgICBleHBhbmQoKTogYW55IHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiRXhwYW5kIGlzIGFic3RyYWN0IGluIExvZ2ljXCIpO1xuICAgIH1cblxuICAgIHN0YXRpYyBfX25ld19fKGNsczogYW55LCAuLi5hcmdzOiBhbnlbXSk6IGFueSB7XG4gICAgICAgIGlmIChjbHMgPT09IE5vdCkge1xuICAgICAgICAgICAgcmV0dXJuIG5ldyBOb3QoYXJnc1swXSk7XG4gICAgICAgIH0gZWxzZSBpZiAoY2xzID09PSBBbmQpIHtcbiAgICAgICAgICAgIHJldHVybiBuZXcgQW5kKGFyZ3MpO1xuICAgICAgICB9IGVsc2UgaWYgKGNscyA9PT0gT3IpIHtcbiAgICAgICAgICAgIHJldHVybiBuZXcgT3IoYXJncyk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBnZXRfb3BfeF9ub3R4KCk6IGFueSB7XG4gICAgICAgIHJldHVybiBudWxsO1xuICAgIH1cblxuICAgIGhhc2hLZXkoKTogc3RyaW5nIHtcbiAgICAgICAgcmV0dXJuIHRoaXMudG9TdHJpbmcoKTtcbiAgICB9XG5cbiAgICB0b1N0cmluZygpIHtcbiAgICAgICAgcmV0dXJuIFwiTG9naWMgXCIgKyB0aGlzLmFyZ3MudG9TdHJpbmcoKTtcbiAgICB9XG5cbiAgICBnZXROZXdBcmdzKCk6IGFueVtdIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuYXJncztcbiAgICB9XG5cbiAgICBzdGF0aWMgZXF1YWxzKGE6IGFueSwgYjogYW55KTogTG9naWMge1xuICAgICAgICBpZiAoIShiIGluc3RhbmNlb2YgYS5jb25zdHJ1Y3RvcikpIHtcbiAgICAgICAgICAgIHJldHVybiBMb2dpYy5GYWxzZTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGlmIChhLmFyZ3MgPT0gYi5hcmdzKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIExvZ2ljLlRydWU7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gTG9naWMuRmFsc2U7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBzdGF0aWMgbm90RXF1YWxzKGE6IGFueSwgYjogYW55KTogTG9naWMge1xuICAgICAgICBpZiAoIShiIGluc3RhbmNlb2YgYS5jb25zdHJ1Y3RvcikpIHtcbiAgICAgICAgICAgIHJldHVybiBMb2dpYy5UcnVlO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgaWYgKGEuYXJncyA9PSBiLmFyZ3MpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gTG9naWMuRmFsc2U7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gTG9naWMuVHJ1ZTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGxlc3NUaGFuKG90aGVyOiBPYmplY3QpOiBMb2dpYyB7XG4gICAgICAgIGlmICh0aGlzLmNvbXBhcmUob3RoZXIpID09IC0xKSB7XG4gICAgICAgICAgICByZXR1cm4gTG9naWMuVHJ1ZTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gTG9naWMuRmFsc2U7XG4gICAgfVxuXG4gICAgY29tcGFyZShvdGhlcjogYW55KTogbnVtYmVyIHtcbiAgICAgICAgbGV0IGE7IGxldCBiO1xuICAgICAgICBpZiAodHlwZW9mIHRoaXMgIT0gdHlwZW9mIG90aGVyKSB7XG4gICAgICAgICAgICBjb25zdCB1bmtTZWxmOiB1bmtub3duID0gPHVua25vd24+IHRoaXMuY29uc3RydWN0b3I7XG4gICAgICAgICAgICBjb25zdCB1bmtPdGhlcjogdW5rbm93biA9IDx1bmtub3duPiBvdGhlci5jb25zdHJ1Y3RvcjtcbiAgICAgICAgICAgIGEgPSA8c3RyaW5nPiB1bmtTZWxmO1xuICAgICAgICAgICAgYiA9IDxzdHJpbmc+IHVua090aGVyO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgYSA9IHRoaXMuYXJncztcbiAgICAgICAgICAgIGIgPSBvdGhlci5hcmdzO1xuICAgICAgICB9XG4gICAgICAgIGlmIChhID4gYikge1xuICAgICAgICAgICAgcmV0dXJuIDE7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gMDtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHN0YXRpYyBmcm9tc3RyaW5nKHRleHQ6IHN0cmluZykge1xuICAgICAgICAvKiBMb2dpYyBmcm9tIHN0cmluZyB3aXRoIHNwYWNlIGFyb3VuZCAmIGFuZCB8IGJ1dCBub25lIGFmdGVyICEuXG4gICAgICAgICAgIGUuZy5cbiAgICAgICAgICAgIWEgJiBiIHwgY1xuICAgICAgICAqL1xuICAgICAgICBsZXQgbGV4cHIgPSBudWxsOyAvLyBjdXJyZW50IGxvZ2ljYWwgZXhwcmVzc2lvblxuICAgICAgICBsZXQgc2NoZWRvcCA9IG51bGw7IC8vIHNjaGVkdWxlZCBvcGVyYXRpb25cbiAgICAgICAgZm9yIChjb25zdCB0ZXJtIG9mIHRleHQuc3BsaXQoXCIgXCIpKSB7XG4gICAgICAgICAgICBsZXQgZmxleFRlcm06IHN0cmluZyB8IExvZ2ljID0gdGVybTtcbiAgICAgICAgICAgIC8vIG9wZXJhdGlvbiBzeW1ib2xcbiAgICAgICAgICAgIGlmIChcIiZ8XCIuaW5jbHVkZXMoZmxleFRlcm0pKSB7XG4gICAgICAgICAgICAgICAgaWYgKHNjaGVkb3AgIT0gbnVsbCkge1xuICAgICAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJkb3VibGUgb3AgZm9yYmlkZGVuIFwiICsgZmxleFRlcm0gKyBcIiBcIiArIHNjaGVkb3ApO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBpZiAobGV4cHIgPT0gbnVsbCkge1xuICAgICAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoZmxleFRlcm0gKyBcIiBjYW5ub3QgYmUgaW4gdGhlIGJlZ2lubmluZyBvZiBleHByZXNzaW9uXCIpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBzY2hlZG9wID0gZmxleFRlcm07XG4gICAgICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoZmxleFRlcm0uaW5jbHVkZXMoXCJ8XCIpIHx8IGZsZXhUZXJtLmluY2x1ZGVzKFwiJlwiKSkge1xuICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcIiYgYW5kIHwgbXVzdCBoYXZlIHNwYWNlIGFyb3VuZCB0aGVtXCIpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKGZsZXhUZXJtWzBdID09IFwiIVwiKSB7XG4gICAgICAgICAgICAgICAgaWYgKGZsZXhUZXJtLmxlbmd0aCA9PSAxKSB7XG4gICAgICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcImRvIG5vdCBpbmNsdWRlIHNwYWNlIGFmdGVyICFcIik7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGZsZXhUZXJtID0gTm90Lk5ldyhmbGV4VGVybS5zdWJzdHJpbmcoMSkpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgLy8gYWxyZWFkeSBzY2hlZHVsZWQgb3BlcmF0aW9uLCBlLmcuICcmJ1xuICAgICAgICAgICAgaWYgKHNjaGVkb3ApIHtcbiAgICAgICAgICAgICAgICBsZXhwciA9IExvZ2ljLm9wXzJjbGFzc1tzY2hlZG9wXShsZXhwciwgZmxleFRlcm0pO1xuICAgICAgICAgICAgICAgIHNjaGVkb3AgPSBudWxsO1xuICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgLy8gdGhpcyBzaG91bGQgYmUgYXRvbVxuICAgICAgICAgICAgaWYgKGxleHByICE9IG51bGwpIHtcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJtaXNzaW5nIG9wIGJldHdlZW4gXCIgKyBsZXhwciArIFwiIGFuZCBcIiArIGZsZXhUZXJtICk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBsZXhwciA9IGZsZXhUZXJtO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gbGV0J3MgY2hlY2sgdGhhdCB3ZSBlbmRlZCB1cCBpbiBjb3JyZWN0IHN0YXRlXG4gICAgICAgIGlmIChzY2hlZG9wICE9IG51bGwpIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcInByZW1hdHVyZSBlbmQtb2YtZXhwcmVzc2lvbiBpbiBcIiArIHRleHQpO1xuICAgICAgICB9XG4gICAgICAgIGlmIChsZXhwciA9PSBudWxsKSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IodGV4dCArIFwiIGlzIGVtcHR5XCIpO1xuICAgICAgICB9XG4gICAgICAgIC8vIGV2ZXJ5dGhpbmcgbG9va3MgZ29vZCBub3dcbiAgICAgICAgcmV0dXJuIGxleHByO1xuICAgIH1cbn1cblxuY2xhc3MgVHJ1ZSBleHRlbmRzIExvZ2ljIHtcbiAgICBfZXZhbF9wcm9wYWdhdGVfbm90KCk6IGFueSB7XG4gICAgICAgIHJldHVybiBGYWxzZS5GYWxzZTtcbiAgICB9XG5cbiAgICBleHBhbmQoKTogYW55IHtcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxufVxuXG5jbGFzcyBGYWxzZSBleHRlbmRzIExvZ2ljIHtcbiAgICBfZXZhbF9wcm9wYWdhdGVfbm90KCk6IGFueSB7XG4gICAgICAgIHJldHVybiBUcnVlLlRydWU7XG4gICAgfVxuXG4gICAgZXhwYW5kKCk6IGFueSB7XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cbn1cblxuXG5jbGFzcyBBbmRPcl9CYXNlIGV4dGVuZHMgTG9naWMge1xuICAgIHN0YXRpYyBfX25ld19fKGNsczogYW55LCAuLi5hcmdzOiBhbnlbXSkge1xuICAgICAgICBjb25zdCBiYXJnczogYW55W10gPSBbXTtcbiAgICAgICAgZm9yIChjb25zdCBhIG9mIGFyZ3MpIHtcbiAgICAgICAgICAgIGlmIChhID09IGNscy5nZXRfb3BfeF9ub3R4KCkpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gYTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoYSA9PSAhKGNscy5nZXRfb3BfeF9ub3R4KCkpKSB7XG4gICAgICAgICAgICAgICAgY29udGludWU7IC8vIHNraXAgdGhpcyBhcmd1bWVudFxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgYmFyZ3MucHVzaChhKTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIHByZXYgdmVyc2lvbjogYXJncyA9IHNvcnRlZChzZXQodGhpcy5mbGF0dGVuKGJhcmdzKSksIGtleT1oYXNoKVxuICAgICAgICAvLyB3ZSB0aGluayB3ZSBkb24ndCBuZWVkIHRoZSBzb3J0IGFuZCBzZXRcbiAgICAgICAgYXJncyA9IEFuZE9yX0Jhc2UuZmxhdHRlbihiYXJncyk7XG5cbiAgICAgICAgLy8gY3JlYXRpbmcgYSBzZXQgd2l0aCBoYXNoIGtleXMgZm9yIGFyZ3NcbiAgICAgICAgY29uc3QgYXJnc19zZXQgPSBuZXcgU2V0KGFyZ3MubWFwKChlKSA9PiBVdGlsLmhhc2hLZXkoZSkpKTtcblxuICAgICAgICBmb3IgKGNvbnN0IGEgb2YgYXJncykge1xuICAgICAgICAgICAgaWYgKGFyZ3Nfc2V0LmhhcygoTm90Lk5ldyhhKSkuaGFzaEtleSgpKSkge1xuICAgICAgICAgICAgICAgIHJldHVybiBjbHMuZ2V0X29wX3hfbm90eCgpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGFyZ3MubGVuZ3RoID09IDEpIHtcbiAgICAgICAgICAgIHJldHVybiBhcmdzLnBvcCgpO1xuICAgICAgICB9IGVsc2UgaWYgKGFyZ3MubGVuZ3RoID09IDApIHtcbiAgICAgICAgICAgIGlmIChjbHMuZ2V0X29wX3hfbm90eCgpIGluc3RhbmNlb2YgVHJ1ZSkge1xuICAgICAgICAgICAgICAgIHJldHVybiBMb2dpYy5GYWxzZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiBMb2dpYy5UcnVlO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHN1cGVyLl9fbmV3X18oY2xzLCAuLi5hcmdzKTtcbiAgICB9XG5cbiAgICBzdGF0aWMgZmxhdHRlbihhcmdzOiBhbnlbXSk6IGFueVtdIHtcbiAgICAgICAgLy8gcXVpY2stbi1kaXJ0eSBmbGF0dGVuaW5nIGZvciBBbmQgYW5kIE9yXG4gICAgICAgIGNvbnN0IGFyZ3NfcXVldWU6IGFueVtdID0gWy4uLmFyZ3NdO1xuICAgICAgICBjb25zdCByZXMgPSBbXTtcbiAgICAgICAgd2hpbGUgKGFyZ3NfcXVldWUubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgY29uc3QgYXJnOiBhbnkgPSBhcmdzX3F1ZXVlLnBvcCgpO1xuICAgICAgICAgICAgaWYgKGFyZyBpbnN0YW5jZW9mIExvZ2ljKSB7XG4gICAgICAgICAgICAgICAgaWYgKGFyZyBpbnN0YW5jZW9mIHRoaXMpIHtcbiAgICAgICAgICAgICAgICAgICAgYXJnc19xdWV1ZS5wdXNoKGFyZy5hcmdzKTtcbiAgICAgICAgICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmVzLnB1c2goYXJnKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gcmVzO1xuICAgIH1cbn1cblxuY2xhc3MgQW5kIGV4dGVuZHMgQW5kT3JfQmFzZSB7XG4gICAgc3RhdGljIE5ldyguLi5hcmdzOiBhbnlbXSkge1xuICAgICAgICByZXR1cm4gc3VwZXIuX19uZXdfXyhBbmQsIGFyZ3MpO1xuICAgIH1cblxuICAgIGdldF9vcF94X25vdHgoKTogTG9naWMge1xuICAgICAgICByZXR1cm4gTG9naWMuRmFsc2U7XG4gICAgfVxuXG4gICAgX2V2YWxfcHJvcGFnYXRlX25vdCgpOiBPciB7XG4gICAgICAgIC8vICEgKGEmYiZjIC4uLikgPT0gIWEgfCAhYiB8ICFjIC4uLlxuICAgICAgICBjb25zdCBwYXJhbTogYW55W10gPSBbXTtcbiAgICAgICAgZm9yIChjb25zdCBhIG9mIHBhcmFtKSB7XG4gICAgICAgICAgICBwYXJhbS5wdXNoKE5vdC5OZXcoYSkpOyAvLyA/P1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBPci5OZXcoLi4ucGFyYW0pOyAvLyA/Pz9cbiAgICB9XG5cbiAgICAvLyAoYXxifC4uLikgJiBjID09IChhJmMpIHwgKGImYykgfCAuLi5cbiAgICBleHBhbmQoKTogYW55IHtcbiAgICAgICAgLy8gZmlyc3QgbG9jYXRlIE9yXG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5hcmdzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBjb25zdCBhcmcgPSB0aGlzLmFyZ3NbaV07XG4gICAgICAgICAgICBpZiAoYXJnIGluc3RhbmNlb2YgT3IpIHtcbiAgICAgICAgICAgICAgICAvLyBjb3B5IG9mIHRoaXMuYXJncyB3aXRoIGFyZyBhdCBwb3NpdGlvbiBpIHJlbW92ZWRcblxuICAgICAgICAgICAgICAgIGNvbnN0IGFyZXN0ID0gWy4uLnRoaXMuYXJnc10uc3BsaWNlKGksIDEpO1xuXG4gICAgICAgICAgICAgICAgLy8gc3RlcCBieSBzdGVwIHZlcnNpb24gb2YgdGhlIG1hcCBiZWxvd1xuICAgICAgICAgICAgICAgIC8qXG4gICAgICAgICAgICAgICAgbGV0IG9ydGVybXMgPSBbXTtcbiAgICAgICAgICAgICAgICBmb3IgKGxldCBhIG9mIGFyZy5hcmdzKSB7XG4gICAgICAgICAgICAgICAgICAgIG9ydGVybXMucHVzaChuZXcgQW5kKC4uLmFyZXN0LmNvbmNhdChbYV0pKSlcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgKi9cblxuICAgICAgICAgICAgICAgIGNvbnN0IG9ydGVybXMgPSBhcmcuYXJncy5tYXAoKGUpID0+IEFuZC5OZXcoLi4uYXJlc3QuY29uY2F0KFtlXSkpKTtcblxuXG4gICAgICAgICAgICAgICAgZm9yIChsZXQgaiA9IDA7IGogPCBvcnRlcm1zLmxlbmd0aDsgaisrKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChvcnRlcm1zW2pdIGluc3RhbmNlb2YgTG9naWMpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIG9ydGVybXNbal0gPSBvcnRlcm1zW2pdLmV4cGFuZCgpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGNvbnN0IHJlcyA9IE9yLk5ldyguLi5vcnRlcm1zKTtcbiAgICAgICAgICAgICAgICByZXR1cm4gcmVzO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cbn1cblxuY2xhc3MgT3IgZXh0ZW5kcyBBbmRPcl9CYXNlIHtcbiAgICBzdGF0aWMgTmV3KC4uLmFyZ3M6IGFueVtdKSB7XG4gICAgICAgIHJldHVybiBzdXBlci5fX25ld19fKE9yLCBhcmdzKTtcbiAgICB9XG5cbiAgICBnZXRfb3BfeF9ub3R4KCk6IExvZ2ljIHtcbiAgICAgICAgcmV0dXJuIExvZ2ljLlRydWU7XG4gICAgfVxuXG4gICAgX2V2YWxfcHJvcGFnYXRlX25vdCgpOiBBbmQge1xuICAgICAgICAvLyAhIChhJmImYyAuLi4pID09ICFhIHwgIWIgfCAhYyAuLi5cbiAgICAgICAgY29uc3QgcGFyYW06IGFueVtdID0gW107XG4gICAgICAgIGZvciAoY29uc3QgYSBvZiBwYXJhbSkge1xuICAgICAgICAgICAgcGFyYW0ucHVzaChOb3QuTmV3KGEpKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gQW5kLk5ldyguLi5wYXJhbSk7XG4gICAgfVxufVxuXG5jbGFzcyBOb3QgZXh0ZW5kcyBMb2dpYyB7XG4gICAgc3RhdGljIE5ldyhhcmdzOiBhbnkpIHtcbiAgICAgICAgcmV0dXJuIE5vdC5fX25ld19fKE5vdCwgYXJncyk7XG4gICAgfVxuXG4gICAgc3RhdGljIF9fbmV3X18oY2xzOiBhbnksIGFyZzogYW55KSB7XG4gICAgICAgIGlmICh0eXBlb2YgYXJnID09PSBcInN0cmluZ1wiKSB7XG4gICAgICAgICAgICByZXR1cm4gc3VwZXIuX19uZXdfXyhjbHMsIGFyZyk7XG4gICAgICAgIH0gZWxzZSBpZiAoYXJnIGluc3RhbmNlb2YgVHJ1ZSkge1xuICAgICAgICAgICAgcmV0dXJuIExvZ2ljLkZhbHNlO1xuICAgICAgICB9IGVsc2UgaWYgKGFyZyBpbnN0YW5jZW9mIEZhbHNlKSB7XG4gICAgICAgICAgICByZXR1cm4gTG9naWMuVHJ1ZTtcbiAgICAgICAgfSBlbHNlIGlmIChhcmcgaW5zdGFuY2VvZiBOb3QpIHtcbiAgICAgICAgICAgIHJldHVybiBhcmcuYXJnc1swXTtcbiAgICAgICAgfSBlbHNlIGlmIChhcmcgaW5zdGFuY2VvZiBMb2dpYykge1xuICAgICAgICAgICAgLy8gWFhYIHRoaXMgaXMgYSBoYWNrIHRvIGV4cGFuZCByaWdodCBmcm9tIHRoZSBiZWdpbm5pbmdcbiAgICAgICAgICAgIGFyZyA9IGFyZy5fZXZhbF9wcm9wYWdhdGVfbm90KCk7XG4gICAgICAgICAgICByZXR1cm4gYXJnO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiTm90OiB1bmtub3duIGFyZ3VtZW50IFwiICsgYXJnKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGFyZygpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuYXJnc1swXTtcbiAgICB9XG59XG5cbkxvZ2ljLlRydWUgPSBuZXcgVHJ1ZSgpO1xuTG9naWMuRmFsc2UgPSBuZXcgRmFsc2UoKTtcblxuZXhwb3J0IHtMb2dpYywgVHJ1ZSwgRmFsc2UsIEFuZCwgT3IsIE5vdCwgZnV6enlfYm9vbCwgZnV6enlfYW5kLCBmdXp6eV9ib29sX3YyLCBmdXp6eV9hbmRfdjJ9O1xuXG5cbiIsICIvKiBlc2xpbnQtZGlzYWJsZSBuZXctY2FwICovXG4vKiBUaGlzIGlzIHJ1bGUtYmFzZWQgZGVkdWN0aW9uIHN5c3RlbSBmb3IgU3ltUHlcblRoZSB3aG9sZSB0aGluZyBpcyBzcGxpdCBpbnRvIHR3byBwYXJ0c1xuIC0gcnVsZXMgY29tcGlsYXRpb24gYW5kIHByZXBhcmF0aW9uIG9mIHRhYmxlc1xuIC0gcnVudGltZSBpbmZlcmVuY2VcbkZvciBydWxlLWJhc2VkIGluZmVyZW5jZSBlbmdpbmVzLCB0aGUgY2xhc3NpY2FsIHdvcmsgaXMgUkVURSBhbGdvcml0aG0gWzFdLFxuWzJdIEFsdGhvdWdoIHdlIGFyZSBub3QgaW1wbGVtZW50aW5nIGl0IGluIGZ1bGwgKG9yIGV2ZW4gc2lnbmlmaWNhbnRseSlcbml0J3Mgc3RpbGwgd29ydGggYSByZWFkIHRvIHVuZGVyc3RhbmQgdGhlIHVuZGVybHlpbmcgaWRlYXMuXG5JbiBzaG9ydCwgZXZlcnkgcnVsZSBpbiBhIHN5c3RlbSBvZiBydWxlcyBpcyBvbmUgb2YgdHdvIGZvcm1zOlxuIC0gYXRvbSAgICAgICAgICAgICAgICAgICAgIC0+IC4uLiAgICAgIChhbHBoYSBydWxlKVxuIC0gQW5kKGF0b20xLCBhdG9tMiwgLi4uKSAgIC0+IC4uLiAgICAgIChiZXRhIHJ1bGUpXG5UaGUgbWFqb3IgY29tcGxleGl0eSBpcyBpbiBlZmZpY2llbnQgYmV0YS1ydWxlcyBwcm9jZXNzaW5nIGFuZCB1c3VhbGx5IGZvciBhblxuZXhwZXJ0IHN5c3RlbSBhIGxvdCBvZiBlZmZvcnQgZ29lcyBpbnRvIGNvZGUgdGhhdCBvcGVyYXRlcyBvbiBiZXRhLXJ1bGVzLlxuSGVyZSB3ZSB0YWtlIG1pbmltYWxpc3RpYyBhcHByb2FjaCB0byBnZXQgc29tZXRoaW5nIHVzYWJsZSBmaXJzdC5cbiAtIChwcmVwYXJhdGlvbikgICAgb2YgYWxwaGEtIGFuZCBiZXRhLSBuZXR3b3JrcywgZXZlcnl0aGluZyBleGNlcHRcbiAtIChydW50aW1lKSAgICAgICAgRmFjdFJ1bGVzLmRlZHVjZV9hbGxfZmFjdHNcbiAgICAgICAgICAgICBfX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fXG4gICAgICAgICAgICAoIEtpcnI6IEkndmUgbmV2ZXIgdGhvdWdodCB0aGF0IGRvaW5nIClcbiAgICAgICAgICAgICggbG9naWMgc3R1ZmYgaXMgdGhhdCBkaWZmaWN1bHQuLi4gICAgKVxuICAgICAgICAgICAgIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAgICAgICAgICAgICAgICAgbyAgIF5fX15cbiAgICAgICAgICAgICAgICAgICAgIG8gIChvbylcXF9fX19fX19cbiAgICAgICAgICAgICAgICAgICAgICAgIChfXylcXCAgICAgICApXFwvXFxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB8fC0tLS13IHxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB8fCAgICAgfHxcblNvbWUgcmVmZXJlbmNlcyBvbiB0aGUgdG9waWNcbi0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblsxXSBodHRwczovL2VuLndpa2lwZWRpYS5vcmcvd2lraS9SZXRlX2FsZ29yaXRobVxuWzJdIGh0dHA6Ly9yZXBvcnRzLWFyY2hpdmUuYWRtLmNzLmNtdS5lZHUvYW5vbi8xOTk1L0NNVS1DUy05NS0xMTMucGRmXG5odHRwczovL2VuLndpa2lwZWRpYS5vcmcvd2lraS9Qcm9wb3NpdGlvbmFsX2Zvcm11bGFcbmh0dHBzOi8vZW4ud2lraXBlZGlhLm9yZy93aWtpL0luZmVyZW5jZV9ydWxlXG5odHRwczovL2VuLndpa2lwZWRpYS5vcmcvd2lraS9MaXN0X29mX3J1bGVzX29mX2luZmVyZW5jZVxuKi9cblxuLypcblxuU2lnbmlmaWNhbnQgY2hhbmdlcyBtYWRlIChXQiBhbmQgR00pOlxuLSBDcmVhdGVkIHRoZSBJbXBsaWNhdGlvbiBjbGFzcywgdXNlIHRvIHJlcHJlc2VudCB0aGUgaW1wbGljYXRpb24gcCAtPiBxIHdoaWNoXG4gIGlzIHN0b3JlZCBhcyBhIHR1cGxlIGluIHN5bXB5XG4tIENyZWF0ZWQgdGhlIFNldERlZmF1bHREaWN0LCBIYXNoRGljdCBhbmQgSGFzaFNldCBjbGFzc2VzLiBTZXREZWZhdWx0RGljdCBhY3RzXG4gIGFzIGEgcmVwbGNhY2VtZW50IGRlZmF1bHRkaWN0KHNldCksIGFuZCBIYXNoRGljdCBhbmQgSGFzaFNldCByZXBsYWNlIHRoZVxuICBkaWN0IGFuZCBzZXQgY2xhc3Nlcy5cbi0gQWRkZWQgaXNTdWJzZXQoKSB0byB0aGUgdXRpbGl0eSBjbGFzcyB0byBoZWxwIHdpdGggdGhpcyBwcm9ncmFtXG5cbiovXG5cblxuaW1wb3J0IHtTdGRGYWN0S0J9IGZyb20gXCIuL2Fzc3VtcHRpb25zLmpzXCI7XG5pbXBvcnQge0xvZ2ljLCBUcnVlLCBGYWxzZSwgQW5kLCBPciwgTm90fSBmcm9tIFwiLi9sb2dpYy5qc1wiO1xuXG5pbXBvcnQge1V0aWwsIEhhc2hTZXQsIFNldERlZmF1bHREaWN0LCBIYXNoRGljdCwgSW1wbGljYXRpb259IGZyb20gXCIuL3V0aWxpdHkuanNcIjtcblxuXG5mdW5jdGlvbiBfYmFzZV9mYWN0KGF0b206IGFueSkge1xuICAgIC8qICBSZXR1cm4gdGhlIGxpdGVyYWwgZmFjdCBvZiBhbiBhdG9tLlxuICAgIEVmZmVjdGl2ZWx5LCB0aGlzIG1lcmVseSBzdHJpcHMgdGhlIE5vdCBhcm91bmQgYSBmYWN0LlxuICAgICovXG4gICAgaWYgKGF0b20gaW5zdGFuY2VvZiBOb3QpIHtcbiAgICAgICAgcmV0dXJuIGF0b20uYXJnKCk7XG4gICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuIGF0b207XG4gICAgfVxufVxuXG5cbmZ1bmN0aW9uIF9hc19wYWlyKGF0b206IGFueSkge1xuICAgIC8qICBSZXR1cm4gdGhlIGxpdGVyYWwgZmFjdCBvZiBhbiBhdG9tLlxuICAgIEVmZmVjdGl2ZWx5LCB0aGlzIG1lcmVseSBzdHJpcHMgdGhlIE5vdCBhcm91bmQgYSBmYWN0LlxuICAgICovXG4gICAgaWYgKGF0b20gaW5zdGFuY2VvZiBOb3QpIHtcbiAgICAgICAgcmV0dXJuIG5ldyBJbXBsaWNhdGlvbihhdG9tLmFyZygpLCBMb2dpYy5GYWxzZSk7XG4gICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuIG5ldyBJbXBsaWNhdGlvbihhdG9tLCBMb2dpYy5UcnVlKTtcbiAgICB9XG59XG5cbi8vIFhYWCB0aGlzIHByZXBhcmVzIGZvcndhcmQtY2hhaW5pbmcgcnVsZXMgZm9yIGFscGhhLW5ldHdvcmtcblxuZnVuY3Rpb24gdHJhbnNpdGl2ZV9jbG9zdXJlKGltcGxpY2F0aW9uczogSW1wbGljYXRpb25bXSkge1xuICAgIC8qXG4gICAgQ29tcHV0ZXMgdGhlIHRyYW5zaXRpdmUgY2xvc3VyZSBvZiBhIGxpc3Qgb2YgaW1wbGljYXRpb25zXG4gICAgVXNlcyBXYXJzaGFsbCdzIGFsZ29yaXRobSwgYXMgZGVzY3JpYmVkIGF0XG4gICAgaHR0cDovL3d3dy5jcy5ob3BlLmVkdS9+Y3VzYWNrL05vdGVzL05vdGVzL0Rpc2NyZXRlTWF0aC9XYXJzaGFsbC5wZGYuXG4gICAgKi9cblxuICAgIGNvbnN0IGZ1bGxfaW1wbGljYXRpb25zID0gbmV3IEhhc2hTZXQoaW1wbGljYXRpb25zKTtcbiAgICBjb25zdCBsaXRlcmFscyA9IG5ldyBTZXQoaW1wbGljYXRpb25zLmZsYXQoKSk7XG5cbiAgICBmb3IgKGNvbnN0IGsgb2YgbGl0ZXJhbHMpIHtcbiAgICAgICAgZm9yIChjb25zdCBpIG9mIGxpdGVyYWxzKSB7XG4gICAgICAgICAgICBpZiAoZnVsbF9pbXBsaWNhdGlvbnMuaGFzKG5ldyBJbXBsaWNhdGlvbihpLCBrKSkpIHtcbiAgICAgICAgICAgICAgICBmb3IgKGNvbnN0IGogb2YgbGl0ZXJhbHMpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGZ1bGxfaW1wbGljYXRpb25zLmhhcyhuZXcgSW1wbGljYXRpb24oaywgaikpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBmdWxsX2ltcGxpY2F0aW9ucy5hZGQobmV3IEltcGxpY2F0aW9uKGksIGopKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gZnVsbF9pbXBsaWNhdGlvbnM7XG59XG5cblxuZnVuY3Rpb24gZGVkdWNlX2FscGhhX2ltcGxpY2F0aW9ucyhpbXBsaWNhdGlvbnM6IEltcGxpY2F0aW9uW10pIHtcbiAgICAvKiBkZWR1Y2UgYWxsIGltcGxpY2F0aW9uc1xuICAgICAgIERlc2NyaXB0aW9uIGJ5IGV4YW1wbGVcbiAgICAgICAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgICAgZ2l2ZW4gc2V0IG9mIGxvZ2ljIHJ1bGVzOlxuICAgICAgICAgYSAtPiBiXG4gICAgICAgICBiIC0+IGNcbiAgICAgICB3ZSBkZWR1Y2UgYWxsIHBvc3NpYmxlIHJ1bGVzOlxuICAgICAgICAgYSAtPiBiLCBjXG4gICAgICAgICBiIC0+IGNcbiAgICAgICBpbXBsaWNhdGlvbnM6IFtdIG9mIChhLGIpXG4gICAgICAgcmV0dXJuOiAgICAgICB7fSBvZiBhIC0+IHNldChbYiwgYywgLi4uXSlcbiAgICAgICAqL1xuICAgIGNvbnN0IG5ld19hcnI6IGFueVtdID0gW107XG4gICAgZm9yIChjb25zdCBpbXBsIG9mIGltcGxpY2F0aW9ucykge1xuICAgICAgICBuZXdfYXJyLnB1c2gobmV3IEltcGxpY2F0aW9uKE5vdC5OZXcoaW1wbC5xKSwgTm90Lk5ldyhpbXBsLnApKSk7XG4gICAgfVxuICAgIGltcGxpY2F0aW9ucyA9IGltcGxpY2F0aW9ucy5jb25jYXQobmV3X2Fycik7XG4gICAgY29uc3QgcmVzID0gbmV3IFNldERlZmF1bHREaWN0KCk7XG4gICAgY29uc3QgZnVsbF9pbXBsaWNhdGlvbnMgPSB0cmFuc2l0aXZlX2Nsb3N1cmUoaW1wbGljYXRpb25zKTtcbiAgICBmb3IgKGNvbnN0IGltcGwgb2YgZnVsbF9pbXBsaWNhdGlvbnMudG9BcnJheSgpKSB7XG4gICAgICAgIGlmIChpbXBsLnAgPT09IGltcGwucSkge1xuICAgICAgICAgICAgY29udGludWU7IC8vIHNraXAgYS0+YSBjeWNsaWMgaW5wdXRcbiAgICAgICAgfVxuICAgICAgICBjb25zdCBjdXJyU2V0ID0gcmVzLmdldChpbXBsLnApO1xuICAgICAgICBjdXJyU2V0LmFkZChpbXBsLnEpO1xuICAgICAgICByZXMuYWRkKGltcGwucCwgY3VyclNldCk7XG4gICAgfVxuICAgIC8vIENsZWFuIHVwIHRhdXRvbG9naWVzIGFuZCBjaGVjayBjb25zaXN0ZW5jeVxuICAgIC8vIGltcGwgaXMgdGhlIHNldFxuICAgIGZvciAoY29uc3QgaXRlbSBvZiByZXMuZW50cmllcygpKSB7XG4gICAgICAgIGNvbnN0IGEgPSBpdGVtWzBdO1xuICAgICAgICBjb25zdCBpbXBsOiBIYXNoU2V0ID0gaXRlbVsxXTtcbiAgICAgICAgaW1wbC5yZW1vdmUoYSk7XG4gICAgICAgIGNvbnN0IG5hID0gTm90Lk5ldyhhKTtcbiAgICAgICAgaWYgKGltcGwuaGFzKG5hKSkge1xuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiaW1wbGljYXRpb25zIGFyZSBpbmNvbnNpc3RlbnQ6IFwiICsgYSArIFwiIC0+IFwiICsgbmEgKyBcIiBcIiArIGltcGwpO1xuICAgICAgICB9XG4gICAgfVxuICAgIHJldHVybiByZXM7XG59XG5cbmZ1bmN0aW9uIGFwcGx5X2JldGFfdG9fYWxwaGFfcm91dGUoYWxwaGFfaW1wbGljYXRpb25zOiBIYXNoRGljdCwgYmV0YV9ydWxlczogYW55W10pIHtcbiAgICAvKiBhcHBseSBhZGRpdGlvbmFsIGJldGEtcnVsZXMgKEFuZCBjb25kaXRpb25zKSB0byBhbHJlYWR5LWJ1aWx0XG4gICAgYWxwaGEgaW1wbGljYXRpb24gdGFibGVzXG4gICAgICAgVE9ETzogd3JpdGUgYWJvdXRcbiAgICAgICAtIHN0YXRpYyBleHRlbnNpb24gb2YgYWxwaGEtY2hhaW5zXG4gICAgICAgLSBhdHRhY2hpbmcgcmVmcyB0byBiZXRhLW5vZGVzIHRvIGFscGhhIGNoYWluc1xuICAgICAgIGUuZy5cbiAgICAgICBhbHBoYV9pbXBsaWNhdGlvbnM6XG4gICAgICAgYSAgLT4gIFtiLCAhYywgZF1cbiAgICAgICBiICAtPiAgW2RdXG4gICAgICAgLi4uXG4gICAgICAgYmV0YV9ydWxlczpcbiAgICAgICAmKGIsZCkgLT4gZVxuICAgICAgIHRoZW4gd2UnbGwgZXh0ZW5kIGEncyBydWxlIHRvIHRoZSBmb2xsb3dpbmdcbiAgICAgICBhICAtPiAgW2IsICFjLCBkLCBlXVxuICAgICovXG5cbiAgICAvLyBpcyBiZXRhX3J1bGVzIGFuIGFycmF5IG9yIGEgZGljdGlvbmFyeT9cblxuICAgIGNvbnN0IHhfaW1wbDogSGFzaERpY3QgPSBuZXcgSGFzaERpY3QoKTtcbiAgICBmb3IgKGNvbnN0IHggb2YgYWxwaGFfaW1wbGljYXRpb25zLmtleXMoKSkge1xuICAgICAgICBjb25zdCBuZXdzZXQgPSBuZXcgSGFzaFNldCgpO1xuICAgICAgICBuZXdzZXQuYWRkKGFscGhhX2ltcGxpY2F0aW9ucy5nZXQoeCkpO1xuICAgICAgICBjb25zdCBpbXAgPSBuZXcgSW1wbGljYXRpb24obmV3c2V0LCBbXSk7XG4gICAgICAgIHhfaW1wbC5hZGQoeCwgaW1wKTtcbiAgICB9XG4gICAgZm9yIChjb25zdCBpdGVtIG9mIGJldGFfcnVsZXMpIHtcbiAgICAgICAgY29uc3QgYmNvbmQgPSBpdGVtWzBdO1xuICAgICAgICBmb3IgKGNvbnN0IGJrIG9mIGJjb25kLmFyZ3MpIHtcbiAgICAgICAgICAgIGlmICh4X2ltcGwuaGFzKGJrKSkge1xuICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgY29uc3QgaW1wID0gbmV3IEltcGxpY2F0aW9uKG5ldyBIYXNoU2V0KCksIFtdKTtcbiAgICAgICAgICAgIHhfaW1wbC5hZGQoaW1wLnAsIGltcC5xKTtcbiAgICAgICAgfVxuICAgIH1cbiAgICAvLyBzdGF0aWMgZXh0ZW5zaW9ucyB0byBhbHBoYSBydWxlczpcbiAgICAvLyBBOiB4IC0+IGEsYiAgIEI6ICYoYSxiKSAtPiBjICA9PT4gIEE6IHggLT4gYSxiLGNcblxuICAgIGxldCBzZWVuX3N0YXRpY19leHRlbnNpb246IExvZ2ljID0gTG9naWMuVHJ1ZTtcbiAgICB3aGlsZSAoc2Vlbl9zdGF0aWNfZXh0ZW5zaW9uIGluc3RhbmNlb2YgVHJ1ZSkge1xuICAgICAgICBzZWVuX3N0YXRpY19leHRlbnNpb24gPSBMb2dpYy5GYWxzZTtcblxuICAgICAgICBmb3IgKGNvbnN0IGltcGwgb2YgYmV0YV9ydWxlcykge1xuICAgICAgICAgICAgY29uc3QgYmNvbmQgPSBpbXBsLnA7XG4gICAgICAgICAgICBjb25zdCBiaW1wbCA9IGltcGwucTtcbiAgICAgICAgICAgIGlmICghKGJjb25kIGluc3RhbmNlb2YgQW5kKSkge1xuICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcIkNvbmQgaXMgbm90IEFuZFwiKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGNvbnN0IGJhcmdzID0gbmV3IEhhc2hTZXQoYmNvbmQuYXJncyk7XG4gICAgICAgICAgICBmb3IgKGNvbnN0IGl0ZW0gb2YgeF9pbXBsLmVudHJpZXMoKSkge1xuICAgICAgICAgICAgICAgIGNvbnN0IHggPSBpdGVtWzBdO1xuICAgICAgICAgICAgICAgIGNvbnN0IGltcGwgPSBpdGVtWzFdO1xuICAgICAgICAgICAgICAgIGxldCB4aW1wbHMgPSBpbXBsLnA7XG4gICAgICAgICAgICAgICAgY29uc3QgeF9hbGwgPSB4aW1wbHMuY2xvbmUoKS5hZGQoeCk7XG4gICAgICAgICAgICAgICAgLy8gQTogLi4uIC0+IGEgICBCOiAmKC4uLikgLT4gYSAgaXMgbm9uLWluZm9ybWF0aXZlXG4gICAgICAgICAgICAgICAgaWYgKCEoeF9hbGwuaW5jbHVkZXMoYmltcGwpKSAmJiBVdGlsLmlzU3Vic2V0KGJhcmdzLnRvQXJyYXkoKSwgeF9hbGwpKSB7XG4gICAgICAgICAgICAgICAgICAgIHhpbXBscy5hZGQoYmltcGwpO1xuXG4gICAgICAgICAgICAgICAgICAgIC8vIHdlIGludHJvZHVjZWQgbmV3IGltcGxpY2F0aW9uIC0gbm93IHdlIGhhdmUgdG8gcmVzdG9yZVxuICAgICAgICAgICAgICAgICAgICAvLyBjb21wbGV0ZW5lc3Mgb2YgdGhlIHdob2xlIHNldC5cblxuICAgICAgICAgICAgICAgICAgICBjb25zdCBiaW1wbF9pbXBsID0geF9pbXBsLmdldChiaW1wbCk7XG4gICAgICAgICAgICAgICAgICAgIGlmIChiaW1wbF9pbXBsICE9IG51bGwpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHhpbXBscyB8PSBiaW1wbF9pbXBsWzBdO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIHNlZW5fc3RhdGljX2V4dGVuc2lvbiA9IExvZ2ljLlRydWU7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuICAgIC8vIGF0dGFjaCBiZXRhLW5vZGVzIHdoaWNoIGNhbiBiZSBwb3NzaWJseSB0cmlnZ2VyZWQgYnkgYW4gYWxwaGEtY2hhaW5cbiAgICBmb3IgKGxldCBiaWR4ID0gMDsgYmlkeCA8IGJldGFfcnVsZXMubGVuZ3RoOyBiaWR4KyspIHtcbiAgICAgICAgY29uc3QgaW1wbCA9IGJldGFfcnVsZXNbYmlkeF07XG4gICAgICAgIGNvbnN0IGJjb25kID0gaW1wbC5wO1xuICAgICAgICBjb25zdCBiaW1wbCA9IGltcGwucTtcbiAgICAgICAgY29uc3QgYmFyZ3MgPSBuZXcgSGFzaFNldChiY29uZC5hcmdzKTtcbiAgICAgICAgZm9yIChjb25zdCBpdGVtIG9mIHhfaW1wbC5lbnRyaWVzKCkpIHtcbiAgICAgICAgICAgIGNvbnN0IHggPSBpdGVtWzBdO1xuICAgICAgICAgICAgY29uc3QgdmFsdWU6IEltcGxpY2F0aW9uID0gaXRlbVsxXTtcbiAgICAgICAgICAgIGNvbnN0IHhpbXBscyA9IHZhbHVlLnA7XG4gICAgICAgICAgICBjb25zdCBiYiA9IHZhbHVlLnE7XG4gICAgICAgICAgICBjb25zdCB4X2FsbCA9IHhpbXBscy5jbG9uZSgpLmFkZCh4KTtcbiAgICAgICAgICAgIGlmICh4X2FsbC5oYXMoYmltcGwpKSB7XG4gICAgICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICAvLyBBOiB4IC0+IGEuLi4gIEI6ICYoIWEsLi4uKSAtPiAuLi4gKHdpbGwgbmV2ZXIgdHJpZ2dlcilcbiAgICAgICAgICAgIC8vIEE6IHggLT4gYS4uLiAgQjogJiguLi4pIC0+ICFhICAgICAod2lsbCBuZXZlciB0cmlnZ2VyKVxuICAgICAgICAgICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5ldy1jYXBcbiAgICAgICAgICAgIGlmICh4X2FsbC5zb21lKChlOiBhbnkpID0+IChiYXJncy5oYXMoTm90Lk5ldyhlKSkgfHwgTm90Lk5ldyhlKSA9PT0gYmltcGwpKSkge1xuICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKGJhcmdzICYmIHhfYWxsKSB7XG4gICAgICAgICAgICAgICAgYmIucHVzaChiaWR4KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4geF9pbXBsO1xufVxuXG5cbmZ1bmN0aW9uIHJ1bGVzXzJwcmVyZXEocnVsZXM6IFNldERlZmF1bHREaWN0KSB7XG4gICAgLyogYnVpbGQgcHJlcmVxdWlzaXRlcyB0YWJsZSBmcm9tIHJ1bGVzXG4gICAgICAgRGVzY3JpcHRpb24gYnkgZXhhbXBsZVxuICAgICAgIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAgICBnaXZlbiBzZXQgb2YgbG9naWMgcnVsZXM6XG4gICAgICAgICBhIC0+IGIsIGNcbiAgICAgICAgIGIgLT4gY1xuICAgICAgIHdlIGJ1aWxkIHByZXJlcXVpc2l0ZXMgKGZyb20gd2hhdCBwb2ludHMgc29tZXRoaW5nIGNhbiBiZSBkZWR1Y2VkKTpcbiAgICAgICAgIGIgPC0gYVxuICAgICAgICAgYyA8LSBhLCBiXG4gICAgICAgcnVsZXM6ICAge30gb2YgYSAtPiBbYiwgYywgLi4uXVxuICAgICAgIHJldHVybjogIHt9IG9mIGMgPC0gW2EsIGIsIC4uLl1cbiAgICAgICBOb3RlIGhvd2V2ZXIsIHRoYXQgdGhpcyBwcmVyZXF1aXNpdGVzIG1heSBiZSAqbm90KiBlbm91Z2ggdG8gcHJvdmUgYVxuICAgICAgIGZhY3QuIEFuIGV4YW1wbGUgaXMgJ2EgLT4gYicgcnVsZSwgd2hlcmUgcHJlcmVxKGEpIGlzIGIsIGFuZCBwcmVyZXEoYilcbiAgICAgICBpcyBhLiBUaGF0J3MgYmVjYXVzZSBhPVQgLT4gYj1ULCBhbmQgYj1GIC0+IGE9RiwgYnV0IGE9RiAtPiBiPT9cbiAgICAqL1xuXG4gICAgY29uc3QgcHJlcmVxID0gbmV3IFNldERlZmF1bHREaWN0KCk7XG4gICAgZm9yIChjb25zdCBpdGVtIG9mIHJ1bGVzLmVudHJpZXMoKSkge1xuICAgICAgICBsZXQgYSA9IGl0ZW1bMF0ucDtcbiAgICAgICAgY29uc3QgaW1wbCA9IGl0ZW1bMV07XG4gICAgICAgIGlmIChhIGluc3RhbmNlb2YgTm90KSB7XG4gICAgICAgICAgICBhID0gYS5hcmdzWzBdO1xuICAgICAgICB9XG4gICAgICAgIGZvciAoY29uc3QgaXRlbSBvZiBpbXBsLnRvQXJyYXkoKSkge1xuICAgICAgICAgICAgbGV0IGkgPSBpdGVtLnA7XG4gICAgICAgICAgICBpZiAoaSBpbnN0YW5jZW9mIE5vdCkge1xuICAgICAgICAgICAgICAgIGkgPSBpLmFyZ3NbMF07XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBwcmVyZXEuZ2V0KGkpLmFkZChhKTtcbiAgICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gcHJlcmVxO1xufVxuXG5cbi8vIC8vLy8vLy8vLy8vLy8vLy9cbi8vIFJVTEVTIFBST1ZFUiAvL1xuLy8gLy8vLy8vLy8vLy8vLy8vL1xuXG5jbGFzcyBUYXV0b2xvZ3lEZXRlY3RlZCBleHRlbmRzIEVycm9yIHtcbiAgICBhcmdzO1xuXG4gICAgY29uc3RydWN0b3IoLi4uYXJnczogYW55W10pIHtcbiAgICAgICAgc3VwZXIoKTtcbiAgICAgICAgdGhpcy5hcmdzID0gYXJncztcbiAgICB9XG4gICAgLy8gKGludGVybmFsKSBQcm92ZXIgdXNlcyBpdCBmb3IgcmVwb3J0aW5nIGRldGVjdGVkIHRhdXRvbG9neVxufVxuXG5jbGFzcyBQcm92ZXIge1xuICAgIC8qIGFpIC0gcHJvdmVyIG9mIGxvZ2ljIHJ1bGVzXG4gICAgICAgZ2l2ZW4gYSBzZXQgb2YgaW5pdGlhbCBydWxlcywgUHJvdmVyIHRyaWVzIHRvIHByb3ZlIGFsbCBwb3NzaWJsZSBydWxlc1xuICAgICAgIHdoaWNoIGZvbGxvdyBmcm9tIGdpdmVuIHByZW1pc2VzLlxuICAgICAgIEFzIGEgcmVzdWx0IHByb3ZlZF9ydWxlcyBhcmUgYWx3YXlzIGVpdGhlciBpbiBvbmUgb2YgdHdvIGZvcm1zOiBhbHBoYSBvclxuICAgICAgIGJldGE6XG4gICAgICAgQWxwaGEgcnVsZXNcbiAgICAgICAtLS0tLS0tLS0tLVxuICAgICAgIFRoaXMgYXJlIHJ1bGVzIG9mIHRoZSBmb3JtOjpcbiAgICAgICAgIGEgLT4gYiAmIGMgJiBkICYgLi4uXG4gICAgICAgQmV0YSBydWxlc1xuICAgICAgIC0tLS0tLS0tLS1cbiAgICAgICBUaGlzIGFyZSBydWxlcyBvZiB0aGUgZm9ybTo6XG4gICAgICAgICAmKGEsYiwuLi4pIC0+IGMgJiBkICYgLi4uXG4gICAgICAgaS5lLiBiZXRhIHJ1bGVzIGFyZSBqb2luIGNvbmRpdGlvbnMgdGhhdCBzYXkgdGhhdCBzb21ldGhpbmcgZm9sbG93cyB3aGVuXG4gICAgICAgKnNldmVyYWwqIGZhY3RzIGFyZSB0cnVlIGF0IHRoZSBzYW1lIHRpbWUuXG4gICAgKi9cblxuICAgIHByb3ZlZF9ydWxlczogYW55W107XG4gICAgX3J1bGVzX3NlZW47XG5cbiAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICAgICAgdGhpcy5wcm92ZWRfcnVsZXMgPSBbXTtcbiAgICAgICAgdGhpcy5fcnVsZXNfc2VlbiA9IG5ldyBIYXNoU2V0KCk7XG4gICAgfVxuXG4gICAgc3BsaXRfYWxwaGFfYmV0YSgpIHtcbiAgICAgICAgLy8gc3BsaXQgcHJvdmVkIHJ1bGVzIGludG8gYWxwaGEgYW5kIGJldGEgY2hhaW5zXG4gICAgICAgIGNvbnN0IHJ1bGVzX2FscGhhID0gW107IC8vIGEgICAgICAtPiBiXG4gICAgICAgIGNvbnN0IHJ1bGVzX2JldGEgPSBbXTsgLy8gJiguLi4pIC0+IGJcbiAgICAgICAgZm9yIChjb25zdCBpbXBsIG9mIHRoaXMucHJvdmVkX3J1bGVzKSB7XG4gICAgICAgICAgICBjb25zdCBhID0gaW1wbC5wO1xuICAgICAgICAgICAgY29uc3QgYiA9IGltcGwucTtcbiAgICAgICAgICAgIGlmIChhIGluc3RhbmNlb2YgQW5kKSB7XG4gICAgICAgICAgICAgICAgcnVsZXNfYmV0YS5wdXNoKG5ldyBJbXBsaWNhdGlvbihhLCBiKSk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHJ1bGVzX2FscGhhLnB1c2gobmV3IEltcGxpY2F0aW9uKGEsIGIpKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gW3J1bGVzX2FscGhhLCBydWxlc19iZXRhXTtcbiAgICB9XG5cbiAgICBydWxlc19hbHBoYSgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuc3BsaXRfYWxwaGFfYmV0YSgpWzBdO1xuICAgIH1cblxuICAgIHJ1bGVzX2JldGEoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLnNwbGl0X2FscGhhX2JldGEoKVsxXTtcbiAgICB9XG5cbiAgICBwcm9jZXNzX3J1bGUoYTogYW55LCBiOiBhbnkpIHtcbiAgICAgICAgLy8gcHJvY2VzcyBhIC0+IGIgcnVsZSAgLT4gIFRPRE8gd3JpdGUgbW9yZT9cbiAgICAgICAgaWYgKGIgaW5zdGFuY2VvZiBUcnVlIHx8IGIgaW5zdGFuY2VvZiBGYWxzZSkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIGlmIChhIGluc3RhbmNlb2YgVHJ1ZSB8fCBhIGluc3RhbmNlb2YgRmFsc2UpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICBpZiAodGhpcy5fcnVsZXNfc2Vlbi5oYXMobmV3IEltcGxpY2F0aW9uKGEsIGIpKSkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5fcnVsZXNfc2Vlbi5hZGQobmV3IEltcGxpY2F0aW9uKGEsIGIpKTtcbiAgICAgICAgfVxuICAgICAgICAvLyB0aGlzIGlzIHRoZSBjb3JlIG9mIHRoZSBwcm9jZXNzaW5nXG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICB0aGlzLl9wcm9jZXNzX3J1bGUoYSwgYik7XG4gICAgICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICAgICAgICBpZiAoIShlcnJvciBpbnN0YW5jZW9mIFRhdXRvbG9neURldGVjdGVkKSkge1xuICAgICAgICAgICAgICAgIHRocm93IEVycm9yO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgX3Byb2Nlc3NfcnVsZShhOiBhbnksIGI6IGFueSkge1xuICAgICAgICAvLyByaWdodCBwYXJ0IGZpcnN0XG5cbiAgICAgICAgLy8gYSAtPiBiICYgYyAgIC0tPiAgICBhLT4gYiAgOyAgYSAtPiBjXG5cbiAgICAgICAgLy8gICg/KSBGSVhNRSB0aGlzIGlzIG9ubHkgY29ycmVjdCB3aGVuIGIgJiBjICE9IG51bGwgIVxuXG4gICAgICAgIGlmIChiIGluc3RhbmNlb2YgQW5kKSB7XG4gICAgICAgICAgICBmb3IgKGNvbnN0IGJhcmcgb2YgYi5hcmdzKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5wcm9jZXNzX3J1bGUoYSwgYmFyZyk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSBpZiAoYiBpbnN0YW5jZW9mIE9yKSB7XG4gICAgICAgICAgICAvLyBkZXRlY3QgdGF1dG9sb2d5IGZpcnN0XG4gICAgICAgICAgICBpZiAoIShhIGluc3RhbmNlb2YgTG9naWMpKSB7IC8vIGF0b21cbiAgICAgICAgICAgICAgICAvLyB0YXV0b2xvZ3k6ICBhIC0+IGF8Y3wuLi5cbiAgICAgICAgICAgICAgICBpZiAoYi5hcmdzLmluY2x1ZGVzKGEpKSB7XG4gICAgICAgICAgICAgICAgICAgIHRocm93IG5ldyBUYXV0b2xvZ3lEZXRlY3RlZChhLCBiLCBcImEgLT4gYXxjfC4uLlwiKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBjb25zdCBub3RfYmFyZ3M6IGFueVtdID0gW107XG4gICAgICAgICAgICBmb3IgKGNvbnN0IGJhcmcgb2YgYi5hcmdzKSB7XG4gICAgICAgICAgICAgICAgbm90X2JhcmdzLnB1c2goTm90Lk5ldyhiYXJnKSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB0aGlzLnByb2Nlc3NfcnVsZShBbmQuTmV3KC4uLm5vdF9iYXJncyksIE5vdC5OZXcoYSkpO1xuXG4gICAgICAgICAgICBmb3IgKGxldCBiaWR4ID0gMDsgYmlkeCA8IGIuYXJncy5sZW5ndGg7IGJpZHgrKykge1xuICAgICAgICAgICAgICAgIGNvbnN0IGJhcmcgPSBiLmFyZ3NbYmlkeF07XG4gICAgICAgICAgICAgICAgY29uc3QgYnJlc3QgPSBbLi4uYi5hcmdzXS5zcGxpY2UoYmlkeCwgMSk7XG4gICAgICAgICAgICAgICAgdGhpcy5wcm9jZXNzX3J1bGUoQW5kLk5ldyhhLCBOb3QuTmV3KGJhcmcpKSwgT3IuTmV3KC4uLmJyZXN0KSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSBpZiAoYSBpbnN0YW5jZW9mIEFuZCkge1xuICAgICAgICAgICAgaWYgKGEuYXJncy5pbmNsdWRlcyhiKSkge1xuICAgICAgICAgICAgICAgIHRocm93IG5ldyBUYXV0b2xvZ3lEZXRlY3RlZChhLCBiLCBcImEgJiBiIC0+IGFcIik7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB0aGlzLnByb3ZlZF9ydWxlcy5wdXNoKG5ldyBJbXBsaWNhdGlvbihhLCBiKSk7XG4gICAgICAgICAgICAvLyBYWFggTk9URSBhdCBwcmVzZW50IHdlIGlnbm9yZSAgIWMgLT4gIWEgfCAhYlxuICAgICAgICB9IGVsc2UgaWYgKGEgaW5zdGFuY2VvZiBPcikge1xuICAgICAgICAgICAgaWYgKGEuYXJncy5pbmNsdWRlcyhiKSkge1xuICAgICAgICAgICAgICAgIHRocm93IG5ldyBUYXV0b2xvZ3lEZXRlY3RlZChhLCBiLCBcImEgJiBiIC0+IGFcIik7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBmb3IgKGNvbnN0IGFhcmcgb2YgYS5hcmdzKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5wcm9jZXNzX3J1bGUoYWFyZywgYik7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAvLyBib3RoICdhJyBhbmQgJ2InIGFyZSBhdG9tc1xuICAgICAgICAgICAgdGhpcy5wcm92ZWRfcnVsZXMucHVzaChuZXcgSW1wbGljYXRpb24oYSwgYikpOyAvLyBhIC0+IGJcbiAgICAgICAgICAgIHRoaXMucHJvdmVkX3J1bGVzLnB1c2gobmV3IEltcGxpY2F0aW9uKE5vdC5OZXcoYiksIE5vdC5OZXcoYSkpKTtcbiAgICAgICAgfVxuICAgIH1cbn1cblxuLy8gLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cblxuY2xhc3MgRmFjdFJ1bGVzIHtcbiAgICAvKiBSdWxlcyB0aGF0IGRlc2NyaWJlIGhvdyB0byBkZWR1Y2UgZmFjdHMgaW4gbG9naWMgc3BhY2VcbiAgICBXaGVuIGRlZmluZWQsIHRoZXNlIHJ1bGVzIGFsbG93IGltcGxpY2F0aW9ucyB0byBxdWlja2x5IGJlIGRldGVybWluZWRcbiAgICBmb3IgYSBzZXQgb2YgZmFjdHMuIEZvciB0aGlzIHByZWNvbXB1dGVkIGRlZHVjdGlvbiB0YWJsZXMgYXJlIHVzZWQuXG4gICAgc2VlIGBkZWR1Y2VfYWxsX2ZhY3RzYCAgIChmb3J3YXJkLWNoYWluaW5nKVxuICAgIEFsc28gaXQgaXMgcG9zc2libGUgdG8gZ2F0aGVyIHByZXJlcXVpc2l0ZXMgZm9yIGEgZmFjdCwgd2hpY2ggaXMgdHJpZWRcbiAgICB0byBiZSBwcm92ZW4uICAgIChiYWNrd2FyZC1jaGFpbmluZylcbiAgICBEZWZpbml0aW9uIFN5bnRheFxuICAgIC0tLS0tLS0tLS0tLS0tLS0tXG4gICAgYSAtPiBiICAgICAgIC0tIGE9VCAtPiBiPVQgIChhbmQgYXV0b21hdGljYWxseSBiPUYgLT4gYT1GKVxuICAgIGEgLT4gIWIgICAgICAtLSBhPVQgLT4gYj1GXG4gICAgYSA9PSBiICAgICAgIC0tIGEgLT4gYiAmIGIgLT4gYVxuICAgIGEgLT4gYiAmIGMgICAtLSBhPVQgLT4gYj1UICYgYz1UXG4gICAgIyBUT0RPIGIgfCBjXG4gICAgSW50ZXJuYWxzXG4gICAgLS0tLS0tLS0tXG4gICAgLmZ1bGxfaW1wbGljYXRpb25zW2ssIHZdOiBhbGwgdGhlIGltcGxpY2F0aW9ucyBvZiBmYWN0IGs9dlxuICAgIC5iZXRhX3RyaWdnZXJzW2ssIHZdOiBiZXRhIHJ1bGVzIHRoYXQgbWlnaHQgYmUgdHJpZ2dlcmVkIHdoZW4gaz12XG4gICAgLnByZXJlcSAgLS0ge30gayA8LSBbXSBvZiBrJ3MgcHJlcmVxdWlzaXRlc1xuICAgIC5kZWZpbmVkX2ZhY3RzIC0tIHNldCBvZiBkZWZpbmVkIGZhY3QgbmFtZXNcbiAgICAqL1xuXG4gICAgYmV0YV9ydWxlczogYW55W107XG4gICAgZGVmaW5lZF9mYWN0cztcbiAgICBmdWxsX2ltcGxpY2F0aW9ucztcbiAgICBiZXRhX3RyaWdnZXJzO1xuICAgIHByZXJlcTtcblxuICAgIGNvbnN0cnVjdG9yKHJ1bGVzOiBhbnlbXSB8IHN0cmluZykge1xuICAgICAgICAvLyBDb21waWxlIHJ1bGVzIGludG8gaW50ZXJuYWwgbG9va3VwIHRhYmxlc1xuICAgICAgICBpZiAodHlwZW9mIHJ1bGVzID09PSBcInN0cmluZ1wiKSB7XG4gICAgICAgICAgICBydWxlcyA9IHJ1bGVzLnNwbGl0KFwiXFxuXCIpO1xuICAgICAgICB9XG4gICAgICAgIC8vIC0tLSBwYXJzZSBhbmQgcHJvY2VzcyBydWxlcyAtLS1cbiAgICAgICAgY29uc3QgUDogUHJvdmVyID0gbmV3IFByb3ZlcjtcblxuICAgICAgICBmb3IgKGNvbnN0IHJ1bGUgb2YgcnVsZXMpIHtcbiAgICAgICAgICAgIC8vIFhYWCBgYWAgaXMgaGFyZGNvZGVkIHRvIGJlIGFsd2F5cyBhdG9tXG4gICAgICAgICAgICBsZXQgW2EsIG9wLCBiXSA9IHJ1bGUuc3BsaXQoXCIgXCIsIDMpO1xuICAgICAgICAgICAgYSA9IExvZ2ljLmZyb21zdHJpbmcoYSk7XG4gICAgICAgICAgICBiID0gTG9naWMuZnJvbXN0cmluZyhiKTtcblxuICAgICAgICAgICAgaWYgKG9wID09PSBcIi0+XCIpIHtcbiAgICAgICAgICAgICAgICBQLnByb2Nlc3NfcnVsZShhLCBiKTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAob3AgPT09IFwiPT1cIikge1xuICAgICAgICAgICAgICAgIFAucHJvY2Vzc19ydWxlKGEsIGIpO1xuICAgICAgICAgICAgICAgIFAucHJvY2Vzc19ydWxlKGIsIGEpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJ1bmtub3duIG9wIFwiICsgb3ApO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIC8vIC0tLSBidWlsZCBkZWR1Y3Rpb24gbmV0d29ya3MgLS0tXG5cbiAgICAgICAgdGhpcy5iZXRhX3J1bGVzID0gW107XG4gICAgICAgIGZvciAoY29uc3QgaXRlbSBvZiBQLnJ1bGVzX2JldGEoKSkge1xuICAgICAgICAgICAgY29uc3QgYmNvbmQgPSBpdGVtLnA7XG4gICAgICAgICAgICBjb25zdCBiaW1wbCA9IGl0ZW0ucTtcbiAgICAgICAgICAgIGNvbnN0IHBhaXJzOiBIYXNoU2V0ID0gbmV3IEhhc2hTZXQoKTtcbiAgICAgICAgICAgIGJjb25kLmFyZ3MuZm9yRWFjaCgoYTogYW55KSA9PiBwYWlycy5hZGQoX2FzX3BhaXIoYSkpKTtcbiAgICAgICAgICAgIHRoaXMuYmV0YV9ydWxlcy5wdXNoKG5ldyBJbXBsaWNhdGlvbihwYWlycywgX2FzX3BhaXIoYmltcGwpKSk7XG4gICAgICAgIH1cblxuICAgICAgICAvLyBkZWR1Y2UgYWxwaGEgaW1wbGljYXRpb25zXG4gICAgICAgIGNvbnN0IGltcGxfYSA9IGRlZHVjZV9hbHBoYV9pbXBsaWNhdGlvbnMoUC5ydWxlc19hbHBoYSgpKTtcblxuICAgICAgICAvLyBub3c6XG4gICAgICAgIC8vIC0gYXBwbHkgYmV0YSBydWxlcyB0byBhbHBoYSBjaGFpbnMgIChzdGF0aWMgZXh0ZW5zaW9uKSwgYW5kXG4gICAgICAgIC8vIC0gZnVydGhlciBhc3NvY2lhdGUgYmV0YSBydWxlcyB0byBhbHBoYSBjaGFpbiAoZm9yIGluZmVyZW5jZVxuICAgICAgICAvLyBhdCBydW50aW1lKVxuXG4gICAgICAgIGNvbnN0IGltcGxfYWIgPSBhcHBseV9iZXRhX3RvX2FscGhhX3JvdXRlKGltcGxfYSwgUC5ydWxlc19iZXRhKCkpO1xuXG4gICAgICAgIC8vIGV4dHJhY3QgZGVmaW5lZCBmYWN0IG5hbWVzXG4gICAgICAgIHRoaXMuZGVmaW5lZF9mYWN0cyA9IG5ldyBIYXNoU2V0KCk7XG5cblxuICAgICAgICBmb3IgKGNvbnN0IGsgb2YgaW1wbF9hYi5rZXlzKCkpIHtcbiAgICAgICAgICAgIHRoaXMuZGVmaW5lZF9mYWN0cy5hZGQoX2Jhc2VfZmFjdChrKSk7XG4gICAgICAgIH1cblxuICAgICAgICAvLyBidWlsZCByZWxzIChmb3J3YXJkIGNoYWlucylcblxuICAgICAgICBjb25zdCBmdWxsX2ltcGxpY2F0aW9ucyA9IG5ldyBTZXREZWZhdWx0RGljdCgpO1xuICAgICAgICBjb25zdCBiZXRhX3RyaWdnZXJzID0gbmV3IFNldERlZmF1bHREaWN0KCk7XG4gICAgICAgIGZvciAoY29uc3QgaXRlbSBvZiBpbXBsX2FiLmVudHJpZXMoKSkge1xuICAgICAgICAgICAgY29uc3QgayA9IGl0ZW1bMF07XG4gICAgICAgICAgICBjb25zdCB2YWwgPSBpdGVtWzFdO1xuICAgICAgICAgICAgY29uc3QgaW1wbDogSGFzaFNldCA9IHZhbC5wO1xuICAgICAgICAgICAgY29uc3QgYmV0YWlkeHMgPSB2YWwucTtcbiAgICAgICAgICAgIGNvbnN0IHNldFRvQWRkID0gbmV3IEhhc2hTZXQoKTtcbiAgICAgICAgICAgIGltcGwudG9BcnJheSgpLmZvckVhY2goKGU6IGFueSkgPT4gc2V0VG9BZGQuYWRkKF9hc19wYWlyKGUpKSk7XG4gICAgICAgICAgICBmdWxsX2ltcGxpY2F0aW9ucy5hZGQoX2FzX3BhaXIoayksIHNldFRvQWRkKTtcbiAgICAgICAgICAgIGJldGFfdHJpZ2dlcnMuYWRkKF9hc19wYWlyKGspLCBiZXRhaWR4cyk7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5mdWxsX2ltcGxpY2F0aW9ucyA9IGZ1bGxfaW1wbGljYXRpb25zO1xuXG4gICAgICAgIHRoaXMuYmV0YV90cmlnZ2VycyA9IGJldGFfdHJpZ2dlcnM7XG5cbiAgICAgICAgLy8gYnVpbGQgcHJlcmVxIChiYWNrd2FyZCBjaGFpbnMpXG4gICAgICAgIGNvbnN0IHByZXJlcSA9IG5ldyBTZXREZWZhdWx0RGljdCgpO1xuICAgICAgICBjb25zdCByZWxfcHJlcmVxID0gcnVsZXNfMnByZXJlcShmdWxsX2ltcGxpY2F0aW9ucyk7XG4gICAgICAgIGZvciAoY29uc3QgaXRlbSBvZiByZWxfcHJlcmVxLmVudHJpZXMoKSkge1xuICAgICAgICAgICAgY29uc3QgayA9IGl0ZW1bMF07XG4gICAgICAgICAgICBjb25zdCBwaXRlbXMgPSBpdGVtWzFdO1xuICAgICAgICAgICAgcHJlcmVxLmdldChrKS5hZGQocGl0ZW1zKTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLnByZXJlcSA9IHByZXJlcTtcbiAgICB9XG59XG5cblxuY2xhc3MgSW5jb25zaXN0ZW50QXNzdW1wdGlvbnMgZXh0ZW5kcyBFcnJvciB7XG4gICAgYXJncztcblxuICAgIGNvbnN0cnVjdG9yKC4uLmFyZ3M6IGFueVtdKSB7XG4gICAgICAgIHN1cGVyKCk7XG4gICAgICAgIHRoaXMuYXJncyA9IGFyZ3M7XG4gICAgfVxuXG4gICAgc3RhdGljIF9fc3RyX18oLi4uYXJnczogYW55W10pIHtcbiAgICAgICAgY29uc3QgW2tiLCBmYWN0LCB2YWx1ZV0gPSBhcmdzO1xuICAgICAgICByZXR1cm4ga2IgKyBcIiwgXCIgKyBmYWN0ICsgXCI9XCIgKyB2YWx1ZTtcbiAgICB9XG59XG5cbmNsYXNzIEZhY3RLQiBleHRlbmRzIEhhc2hEaWN0IHtcbiAgICAvKlxuICAgIEEgc2ltcGxlIHByb3Bvc2l0aW9uYWwga25vd2xlZGdlIGJhc2UgcmVseWluZyBvbiBjb21waWxlZCBpbmZlcmVuY2UgcnVsZXMuXG4gICAgKi9cblxuICAgIHJ1bGVzO1xuXG4gICAgY29uc3RydWN0b3IocnVsZXM6IGFueSkge1xuICAgICAgICBzdXBlcigpO1xuICAgICAgICB0aGlzLnJ1bGVzID0gcnVsZXM7XG4gICAgfVxuXG4gICAgX3RlbGwoazogYW55LCB2OiBhbnkpIHtcbiAgICAgICAgLyogQWRkIGZhY3Qgaz12IHRvIHRoZSBrbm93bGVkZ2UgYmFzZS5cbiAgICAgICAgUmV0dXJucyBUcnVlIGlmIHRoZSBLQiBoYXMgYWN0dWFsbHkgYmVlbiB1cGRhdGVkLCBGYWxzZSBvdGhlcndpc2UuXG4gICAgICAgICovXG4gICAgICAgIGlmIChrIGluIHRoaXMuZGljdCAmJiB0eXBlb2YgdGhpcy5nZXQoaykgIT09IFwidW5kZWZpbmVkXCIpIHtcbiAgICAgICAgICAgIGlmICh0aGlzLmdldChrKSA9PT0gdikge1xuICAgICAgICAgICAgICAgIHJldHVybiBMb2dpYy5GYWxzZTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IEluY29uc2lzdGVudEFzc3VtcHRpb25zKHRoaXMsIGssIHYpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5hZGQoaywgdik7XG4gICAgICAgICAgICByZXR1cm4gTG9naWMuVHJ1ZTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8vIC8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cbiAgICAvLyogVGhpcyBpcyB0aGUgd29ya2hvcnNlLCBzbyBrZWVwIGl0ICpmYXN0Ki4gLy9cbiAgICAvLyAvLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXG5cbiAgICBkZWR1Y2VfYWxsX2ZhY3RzKGZhY3RzOiBhbnkpIHtcbiAgICAgICAgLypcbiAgICAgICAgVXBkYXRlIHRoZSBLQiB3aXRoIGFsbCB0aGUgaW1wbGljYXRpb25zIG9mIGEgbGlzdCBvZiBmYWN0cy5cbiAgICAgICAgRmFjdHMgY2FuIGJlIHNwZWNpZmllZCBhcyBhIGRpY3Rpb25hcnkgb3IgYXMgYSBsaXN0IG9mIChrZXksIHZhbHVlKVxuICAgICAgICBwYWlycy5cbiAgICAgICAgKi9cbiAgICAgICAgLy8ga2VlcCBmcmVxdWVudGx5IHVzZWQgYXR0cmlidXRlcyBsb2NhbGx5LCBzbyB3ZSdsbCBhdm9pZCBleHRyYVxuICAgICAgICAvLyBhdHRyaWJ1dGUgYWNjZXNzIG92ZXJoZWFkXG5cbiAgICAgICAgY29uc3QgZnVsbF9pbXBsaWNhdGlvbnM6IFNldERlZmF1bHREaWN0ID0gdGhpcy5ydWxlcy5mdWxsX2ltcGxpY2F0aW9ucztcbiAgICAgICAgY29uc3QgYmV0YV90cmlnZ2VyczogU2V0RGVmYXVsdERpY3QgPSB0aGlzLnJ1bGVzLmJldGFfdHJpZ2dlcnM7XG4gICAgICAgIGNvbnN0IGJldGFfcnVsZXM6IGFueVtdID0gdGhpcy5ydWxlcy5iZXRhX3J1bGVzO1xuXG4gICAgICAgIGlmIChmYWN0cyBpbnN0YW5jZW9mIEhhc2hEaWN0IHx8IGZhY3RzIGluc3RhbmNlb2YgU3RkRmFjdEtCKSB7XG4gICAgICAgICAgICBmYWN0cyA9IGZhY3RzLmVudHJpZXMoKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHdoaWxlIChmYWN0cy5sZW5ndGggIT0gMCkge1xuICAgICAgICAgICAgY29uc3QgYmV0YV9tYXl0cmlnZ2VyID0gbmV3IEhhc2hTZXQoKTtcblxuICAgICAgICAgICAgLy8gLS0tIGFscGhhIGNoYWlucyAtLS1cbiAgICAgICAgICAgIGZvciAoY29uc3QgaXRlbSBvZiBmYWN0cykge1xuICAgICAgICAgICAgICAgIGNvbnN0IGsgPSBpdGVtWzBdO1xuICAgICAgICAgICAgICAgIGNvbnN0IHYgPSBpdGVtWzFdO1xuICAgICAgICAgICAgICAgIGlmICh0aGlzLl90ZWxsKGssIHYpIGluc3RhbmNlb2YgRmFsc2UgfHwgKHR5cGVvZiB2ID09PSBcInVuZGVmaW5lZFwiKSkge1xuICAgICAgICAgICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAvLyBsb29rdXAgcm91dGluZyB0YWJsZXNcbiAgICAgICAgICAgICAgICBjb25zdCBhcnIgPSBmdWxsX2ltcGxpY2F0aW9ucy5nZXQobmV3IEltcGxpY2F0aW9uKGssIHYpKS50b0FycmF5KCk7XG4gICAgICAgICAgICAgICAgZm9yIChjb25zdCBpdGVtIG9mIGFycikge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLl90ZWxsKGl0ZW1bMF0sIGl0ZW1bMV0pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBjb25zdCBjdXJyaW1wID0gYmV0YV90cmlnZ2Vycy5nZXQobmV3IEltcGxpY2F0aW9uKGssIHYpKTtcbiAgICAgICAgICAgICAgICBpZiAoIShjdXJyaW1wLmlzRW1wdHkoKSkpIHtcbiAgICAgICAgICAgICAgICAgICAgYmV0YV9tYXl0cmlnZ2VyLmFkZChiZXRhX3RyaWdnZXJzLmdldChuZXcgSW1wbGljYXRpb24oaywgdikpKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICAvLyAtLS0gYmV0YSBjaGFpbnMgLS0tXG4gICAgICAgICAgICBmYWN0cyA9IFtdO1xuICAgICAgICAgICAgZm9yIChjb25zdCBiaWR4IG9mIGJldGFfbWF5dHJpZ2dlci50b0FycmF5KCkpIHtcbiAgICAgICAgICAgICAgICBjb25zdCBbYmNvbmQsIGJpbXBsXSA9IGJldGFfcnVsZXNbYmlkeF07XG4gICAgICAgICAgICAgICAgZm9yIChjb25zdCBpdGVtIG9mIGJjb25kKSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGsgPSBpdGVtWzBdO1xuICAgICAgICAgICAgICAgICAgICBjb25zdCB2ID0gaXRlbVsxXTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXMuZ2V0KGspICE9PSB2KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBmYWN0cy5wdXNoKGJpbXBsKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG59XG5cbmV4cG9ydCB7RmFjdEtCLCBGYWN0UnVsZXN9O1xuIiwgIi8qIFRoZSBjb3JlJ3MgY29yZS4gKi9cblxuLypcbk5vdGFibGUgY2hhbmdlcyBtYWRlIChXQiBhbmQgR00pXG4tIFJlcGxhY2VkIGFycmF5IG9mIGNsYXNzZXMgd2l0aCBkaWN0aW9uYXJ5IGZvciBxdWlja2VyIGluZGV4IHJldHJpZXZhbHNcbi0gSW1wbGVtZW50ZWQgYSBjb25zdHJ1Y3RvciBzeXN0ZW0gZm9yIGJhc2ljbWV0YSByYXRoZXIgdGhhbiBfX25ld19fXG4qL1xuXG5cbmltcG9ydCB7SGFzaFNldH0gZnJvbSBcIi4vdXRpbGl0eS5qc1wiO1xuXG4vLyB1c2VkIGZvciBjYW5vbmljYWwgb3JkZXJpbmcgb2Ygc3ltYm9saWMgc2VxdWVuY2VzXG4vLyB2aWEgX19jbXBfXyBtZXRob2Q6XG4vLyBGSVhNRSB0aGlzIGlzICpzbyogaXJyZWxldmFudCBhbmQgb3V0ZGF0ZWQhXG5cbmNvbnN0IG9yZGVyaW5nX29mX2NsYXNzZXM6IFJlY29yZDxhbnksIGFueT4gPSB7XG4gICAgLy8gc2luZ2xldG9uIG51bWJlcnNcbiAgICBaZXJvOiAwLCBPbmU6IDEsIEhhbGY6IDIsIEluZmluaXR5OiAzLCBOYU46IDQsIE5lZ2F0aXZlT25lOiA1LCBOZWdhdGl2ZUluZmluaXR5OiA2LFxuICAgIC8vIG51bWJlcnNcbiAgICBJbnRlZ2VyOiA3LCBSYXRpb25hbDogOCwgRmxvYXQ6IDksXG4gICAgLy8gc2luZ2xldG9uIG51bWJlcnNcbiAgICBFeHAxOiAxMCwgUGk6IDExLCBJbWFnaW5hcnlVbml0OiAxMixcbiAgICAvLyBzeW1ib2xzXG4gICAgU3ltYm9sOiAxMywgV2lsZDogMTQsIFRlbXBvcmFyeTogMTUsXG4gICAgLy8gYXJpdGhtZXRpYyBvcGVyYXRpb25zXG4gICAgUG93OiAxNiwgTXVsOiAxNywgQWRkOiAxOCxcbiAgICAvLyBmdW5jdGlvbiB2YWx1ZXNcbiAgICBEZXJpdmF0aXZlOiAxOSwgSW50ZWdyYWw6IDIwLFxuICAgIC8vIGRlZmluZWQgc2luZ2xldG9uIGZ1bmN0aW9uc1xuICAgIEFiczogMjEsIFNpZ246IDIyLCBTcXJ0OiAyMywgRmxvb3I6IDI0LCBDZWlsaW5nOiAyNSwgUmU6IDI2LCBJbTogMjcsXG4gICAgQXJnOiAyOCwgQ29uanVnYXRlOiAyOSwgRXhwOiAzMCwgTG9nOiAzMSwgU2luOiAzMiwgQ29zOiAzMywgVGFuOiAzNCxcbiAgICBDb3Q6IDM1LCBBU2luOiAzNiwgQUNvczogMzcsIEFUYW46IDM4LCBBQ290OiAzOSwgU2luaDogNDAsIENvc2g6IDQxLFxuICAgIFRhbmg6IDQyLCBBU2luaDogNDMsIEFDb3NoOiA0NCwgQVRhbmg6IDQ1LCBBQ290aDogNDYsXG4gICAgUmlzaW5nRmFjdG9yaWFsOiA0NywgRmFsbGluZ0ZhY3RvcmlhbDogNDgsIGZhY3RvcmlhbDogNDksIGJpbm9taWFsOiA1MCxcbiAgICBHYW1tYTogNTEsIExvd2VyR2FtbWE6IDUyLCBVcHBlckdhbWE6IDUzLCBQb2x5R2FtbWE6IDU0LCBFcmY6IDU1LFxuICAgIC8vIHNwZWNpYWwgcG9seW5vbWlhbHNcbiAgICBDaGVieXNoZXY6IDU2LCBDaGVieXNoZXYyOiA1NyxcbiAgICAvLyB1bmRlZmluZWQgZnVuY3Rpb25zXG4gICAgRnVuY3Rpb246IDU4LCBXaWxkRnVuY3Rpb246IDU5LFxuICAgIC8vIGFub255bW91cyBmdW5jdGlvbnNcbiAgICBMYW1iZGE6IDYwLFxuICAgIC8vIExhbmRhdSBPIHN5bWJvbFxuICAgIE9yZGVyOiA2MSxcbiAgICAvLyByZWxhdGlvbmFsIG9wZXJhdGlvbnNcbiAgICBFcXVhbGxpdHk6IDYyLCBVbmVxdWFsaXR5OiA2MywgU3RyaWN0R3JlYXRlclRoYW46IDY0LCBTdHJpY3RMZXNzVGhhbjogNjUsXG4gICAgR3JlYXRlclRoYW46IDY2LCBMZXNzVGhhbjogNjYsXG59O1xuXG5cbmNsYXNzIFJlZ2lzdHJ5IHtcbiAgICAvKlxuICAgIEJhc2UgY2xhc3MgZm9yIHJlZ2lzdHJ5IG9iamVjdHMuXG5cbiAgICBSZWdpc3RyaWVzIG1hcCBhIG5hbWUgdG8gYW4gb2JqZWN0IHVzaW5nIGF0dHJpYnV0ZSBub3RhdGlvbi4gUmVnaXN0cnlcbiAgICBjbGFzc2VzIGJlaGF2ZSBzaW5nbGV0b25pY2FsbHk6IGFsbCB0aGVpciBpbnN0YW5jZXMgc2hhcmUgdGhlIHNhbWUgc3RhdGUsXG4gICAgd2hpY2ggaXMgc3RvcmVkIGluIHRoZSBjbGFzcyBvYmplY3QuXG5cbiAgICBBbGwgc3ViY2xhc3NlcyBzaG91bGQgc2V0IGBfX3Nsb3RzX18gPSAoKWAuXG4gICAgKi9cblxuICAgIHN0YXRpYyBkaWN0OiBSZWNvcmQ8YW55LCBhbnk+O1xuXG4gICAgYWRkQXR0cihuYW1lOiBhbnksIG9iajogYW55KSB7XG4gICAgICAgIFJlZ2lzdHJ5LmRpY3RbbmFtZV0gPSBvYmo7XG4gICAgfVxuXG4gICAgZGVsQXR0cihuYW1lOiBhbnkpIHtcbiAgICAgICAgZGVsZXRlIFJlZ2lzdHJ5LmRpY3RbbmFtZV07XG4gICAgfVxufVxuXG4vLyBBIHNldCBjb250YWluaW5nIGFsbCBTeW1QeSBjbGFzcyBvYmplY3RzXG5jb25zdCBhbGxfY2xhc3NlcyA9IG5ldyBIYXNoU2V0KCk7XG5cbmNsYXNzIEJhc2ljTWV0YSB7XG4gICAgX19zeW1weV9fOiBhbnk7XG5cbiAgICBzdGF0aWMgcmVnaXN0ZXIoY2xzOiBhbnkpIHtcbiAgICAgICAgYWxsX2NsYXNzZXMuYWRkKGNscyk7XG4gICAgICAgIGNscy5fX3N5bXB5X18gPSB0cnVlO1xuICAgIH1cblxuICAgIHN0YXRpYyBjb21wYXJlKHNlbGY6IGFueSwgb3RoZXI6IGFueSkge1xuICAgICAgICAvLyBJZiB0aGUgb3RoZXIgb2JqZWN0IGlzIG5vdCBhIEJhc2ljIHN1YmNsYXNzLCB0aGVuIHdlIGFyZSBub3QgZXF1YWwgdG9cbiAgICAgICAgLy8gaXQuXG4gICAgICAgIGlmICghKG90aGVyIGluc3RhbmNlb2YgQmFzaWNNZXRhKSkge1xuICAgICAgICAgICAgcmV0dXJuIC0xO1xuICAgICAgICB9XG4gICAgICAgIGNvbnN0IG4xID0gc2VsZi5jb25zdHJ1Y3Rvci5uYW1lO1xuICAgICAgICBjb25zdCBuMiA9IG90aGVyLmNvbnN0cnVjdG9yLm5hbWU7XG4gICAgICAgIC8vIGNoZWNrIGlmIGJvdGggYXJlIGluIHRoZSBjbGFzc2VzIGRpY3Rpb25hcnlcbiAgICAgICAgaWYgKG9yZGVyaW5nX29mX2NsYXNzZXMuaGFzKG4xKSAmJiBvcmRlcmluZ19vZl9jbGFzc2VzLmhhcyhuMikpIHtcbiAgICAgICAgICAgIGNvbnN0IGlkeDEgPSBvcmRlcmluZ19vZl9jbGFzc2VzW24xXTtcbiAgICAgICAgICAgIGNvbnN0IGlkeDIgPSBvcmRlcmluZ19vZl9jbGFzc2VzW24yXTtcbiAgICAgICAgICAgIC8vIHRoZSBjbGFzcyB3aXRoIHRoZSBsYXJnZXIgaW5kZXggaXMgZ3JlYXRlclxuICAgICAgICAgICAgcmV0dXJuIE1hdGguc2lnbihpZHgxIC0gaWR4Mik7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKG4xID4gbjIpIHtcbiAgICAgICAgICAgIHJldHVybiAxO1xuICAgICAgICB9IGVsc2UgaWYgKG4xID09PSBuMikge1xuICAgICAgICAgICAgcmV0dXJuIDA7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIC0xO1xuICAgIH1cblxuICAgIGxlc3NUaGFuKG90aGVyOiBhbnkpIHtcbiAgICAgICAgaWYgKEJhc2ljTWV0YS5jb21wYXJlKHNlbGYsIG90aGVyKSA9PT0gLTEpIHtcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG5cbiAgICBncmVhdGVyVGhhbihvdGhlcjogYW55KSB7XG4gICAgICAgIGlmIChCYXNpY01ldGEuY29tcGFyZShzZWxmLCBvdGhlcikgPT09IDEpIHtcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG59XG5cblxuZXhwb3J0IHtCYXNpY01ldGEsIFJlZ2lzdHJ5fTtcblxuIiwgIi8qXG5Ob3RhYmxlIGNoYW5nZXMgbWFkZSAoYW5kIG5vdGVzKTpcbi0gTWFuYWdlZFByb3BlcnRpZXMgcmV3b3JrZWQgYXMgbm9ybWFsIGNsYXNzIC0gZWFjaCBjbGFzcyBpcyByZWdpc3RlcmVkIGRpcmVjdGx5XG4gIGFmdGVyIGRlZmluZWRcbi0gTWFuYWdlZFByb3BlcnRpZXMgdHJhY2tzIHByb3BlcnRpZXMgb2YgYmFzZSBjbGFzc2VzIGJ5IHRyYWNraW5nIGFsbCBwcm9wZXJ0aWVzXG4gIChzZWUgY29tbWVudHMgd2l0aGluIGNsYXNzKVxuLSBDbGFzcyBwcm9wZXJ0aWVzIGZyb20gX2V2YWxfaXMgbWV0aG9kcyBhcmUgYXNzaWduZWQgdG8gZWFjaCBvYmplY3QgaXRzZWxmIGluXG4gIHRoZSBCYXNpYyBjb25zdHJ1Y3RvclxuLSBDaG9vc2luZyB0byBydW4gZ2V0aXQoKSBvbiBtYWtlX3Byb3BlcnR5IHRvIGFkZCBjb25zaXN0ZW5jeSBpbiBhY2Nlc3Npbmdcbi0gVG8tZG86IG1ha2UgYWNjZXNzaW5nIHByb3BlcnRpZXMgbW9yZSBjb25zaXN0ZW50IChpLmUuLCBzYW1lIHN5bnRheCBmb3JcbiAgYWNlc3Npbmcgc3RhdGljIGFuZCBub24tc3RhdGljIHByb3BlcnRpZXMpXG4qL1xuXG5pbXBvcnQge0ZhY3RLQiwgRmFjdFJ1bGVzfSBmcm9tIFwiLi9mYWN0cy5qc1wiO1xuaW1wb3J0IHtCYXNpY01ldGF9IGZyb20gXCIuL2NvcmUuanNcIjtcbmltcG9ydCB7SGFzaERpY3QsIEhhc2hTZXQsIFV0aWx9IGZyb20gXCIuL3V0aWxpdHkuanNcIjtcblxuXG5jb25zdCBfYXNzdW1lX3J1bGVzID0gbmV3IEZhY3RSdWxlcyhbXG4gICAgXCJpbnRlZ2VyIC0+IHJhdGlvbmFsXCIsXG4gICAgXCJyYXRpb25hbCAtPiByZWFsXCIsXG4gICAgXCJyYXRpb25hbCAtPiBhbGdlYnJhaWNcIixcbiAgICBcImFsZ2VicmFpYyAtPiBjb21wbGV4XCIsXG4gICAgXCJ0cmFuc2NlbmRlbnRhbCA9PSBjb21wbGV4ICYgIWFsZ2VicmFpY1wiLFxuICAgIFwicmVhbCAtPiBoZXJtaXRpYW5cIixcbiAgICBcImltYWdpbmFyeSAtPiBjb21wbGV4XCIsXG4gICAgXCJpbWFnaW5hcnkgLT4gYW50aWhlcm1pdGlhblwiLFxuICAgIFwiZXh0ZW5kZWRfcmVhbCAtPiBjb21tdXRhdGl2ZVwiLFxuICAgIFwiY29tcGxleCAtPiBjb21tdXRhdGl2ZVwiLFxuICAgIFwiY29tcGxleCAtPiBmaW5pdGVcIixcblxuICAgIFwib2RkID09IGludGVnZXIgJiAhZXZlblwiLFxuICAgIFwiZXZlbiA9PSBpbnRlZ2VyICYgIW9kZFwiLFxuXG4gICAgXCJyZWFsIC0+IGNvbXBsZXhcIixcbiAgICBcImV4dGVuZGVkX3JlYWwgLT4gcmVhbCB8IGluZmluaXRlXCIsXG4gICAgXCJyZWFsID09IGV4dGVuZGVkX3JlYWwgJiBmaW5pdGVcIixcblxuICAgIFwiZXh0ZW5kZWRfcmVhbCA9PSBleHRlbmRlZF9uZWdhdGl2ZSB8IHplcm8gfCBleHRlbmRlZF9wb3NpdGl2ZVwiLFxuICAgIFwiZXh0ZW5kZWRfbmVnYXRpdmUgPT0gZXh0ZW5kZWRfbm9ucG9zaXRpdmUgJiBleHRlbmRlZF9ub256ZXJvXCIsXG4gICAgXCJleHRlbmRlZF9wb3NpdGl2ZSA9PSBleHRlbmRlZF9ub25uZWdhdGl2ZSAmIGV4dGVuZGVkX25vbnplcm9cIixcblxuICAgIFwiZXh0ZW5kZWRfbm9ucG9zaXRpdmUgPT0gZXh0ZW5kZWRfcmVhbCAmICFleHRlbmRlZF9wb3NpdGl2ZVwiLFxuICAgIFwiZXh0ZW5kZWRfbm9ubmVnYXRpdmUgPT0gZXh0ZW5kZWRfcmVhbCAmICFleHRlbmRlZF9uZWdhdGl2ZVwiLFxuXG4gICAgXCJyZWFsID09IG5lZ2F0aXZlIHwgemVybyB8IHBvc2l0aXZlXCIsXG4gICAgXCJuZWdhdGl2ZSA9PSBub25wb3NpdGl2ZSAmIG5vbnplcm9cIixcbiAgICBcInBvc2l0aXZlID09IG5vbm5lZ2F0aXZlICYgbm9uemVyb1wiLFxuXG4gICAgXCJub25wb3NpdGl2ZSA9PSByZWFsICYgIXBvc2l0aXZlXCIsXG4gICAgXCJub25uZWdhdGl2ZSA9PSByZWFsICYgIW5lZ2F0aXZlXCIsXG5cbiAgICBcInBvc2l0aXZlID09IGV4dGVuZGVkX3Bvc2l0aXZlICYgZmluaXRlXCIsXG4gICAgXCJuZWdhdGl2ZSA9PSBleHRlbmRlZF9uZWdhdGl2ZSAmIGZpbml0ZVwiLFxuICAgIFwibm9ucG9zaXRpdmUgPT0gZXh0ZW5kZWRfbm9ucG9zaXRpdmUgJiBmaW5pdGVcIixcbiAgICBcIm5vbm5lZ2F0aXZlID09IGV4dGVuZGVkX25vbm5lZ2F0aXZlICYgZmluaXRlXCIsXG4gICAgXCJub256ZXJvID09IGV4dGVuZGVkX25vbnplcm8gJiBmaW5pdGVcIixcblxuICAgIFwiemVybyAtPiBldmVuICYgZmluaXRlXCIsXG4gICAgXCJ6ZXJvID09IGV4dGVuZGVkX25vbm5lZ2F0aXZlICYgZXh0ZW5kZWRfbm9ucG9zaXRpdmVcIixcbiAgICBcInplcm8gPT0gbm9ubmVnYXRpdmUgJiBub25wb3NpdGl2ZVwiLFxuICAgIFwibm9uemVybyAtPiByZWFsXCIsXG5cbiAgICBcInByaW1lIC0+IGludGVnZXIgJiBwb3NpdGl2ZVwiLFxuICAgIFwiY29tcG9zaXRlIC0+IGludGVnZXIgJiBwb3NpdGl2ZSAmICFwcmltZVwiLFxuICAgIFwiIWNvbXBvc2l0ZSAtPiAhcG9zaXRpdmUgfCAhZXZlbiB8IHByaW1lXCIsXG5cbiAgICBcImlycmF0aW9uYWwgPT0gcmVhbCAmICFyYXRpb25hbFwiLFxuXG4gICAgXCJpbWFnaW5hcnkgLT4gIWV4dGVuZGVkX3JlYWxcIixcblxuICAgIFwiaW5maW5pdGUgPT0gIWZpbml0ZVwiLFxuICAgIFwibm9uaW50ZWdlciA9PSBleHRlbmRlZF9yZWFsICYgIWludGVnZXJcIixcbiAgICBcImV4dGVuZGVkX25vbnplcm8gPT0gZXh0ZW5kZWRfcmVhbCAmICF6ZXJvXCIsXG5dKTtcblxuXG5leHBvcnQgY29uc3QgX2Fzc3VtZV9kZWZpbmVkID0gX2Fzc3VtZV9ydWxlcy5kZWZpbmVkX2ZhY3RzLmNsb25lKCk7XG5cbmNsYXNzIFN0ZEZhY3RLQiBleHRlbmRzIEZhY3RLQiB7XG4gICAgLyogQSBGYWN0S0Igc3BlY2lhbGl6ZWQgZm9yIHRoZSBidWlsdC1pbiBydWxlc1xuICAgIFRoaXMgaXMgdGhlIG9ubHkga2luZCBvZiBGYWN0S0IgdGhhdCBCYXNpYyBvYmplY3RzIHNob3VsZCB1c2UuXG4gICAgKi9cblxuICAgIF9nZW5lcmF0b3I7XG5cbiAgICBjb25zdHJ1Y3RvcihmYWN0czogYW55ID0gdW5kZWZpbmVkKSB7XG4gICAgICAgIHN1cGVyKF9hc3N1bWVfcnVsZXMpO1xuICAgICAgICAvLyBzYXZlIGEgY29weSBvZiBmYWN0cyBkaWN0XG4gICAgICAgIGlmICh0eXBlb2YgZmFjdHMgPT09IFwidW5kZWZpbmVkXCIpIHtcbiAgICAgICAgICAgIHRoaXMuX2dlbmVyYXRvciA9IHt9O1xuICAgICAgICB9IGVsc2UgaWYgKCEoZmFjdHMgaW5zdGFuY2VvZiBGYWN0S0IpKSB7XG4gICAgICAgICAgICB0aGlzLl9nZW5lcmF0b3IgPSBmYWN0cy5jb3B5KCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aGlzLl9nZW5lcmF0b3IgPSAoZmFjdHMgYXMgYW55KS5nZW5lcmF0b3I7IC8vICEhIVxuICAgICAgICB9XG4gICAgICAgIGlmIChmYWN0cykge1xuICAgICAgICAgICAgdGhpcy5kZWR1Y2VfYWxsX2ZhY3RzKGZhY3RzKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHN0ZGNsb25lKCkge1xuICAgICAgICByZXR1cm4gbmV3IFN0ZEZhY3RLQih0aGlzKTtcbiAgICB9XG5cbiAgICBnZW5lcmF0b3IoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9nZW5lcmF0b3IuY29weSgpO1xuICAgIH1cbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGFzX3Byb3BlcnR5KGZhY3Q6IGFueSkge1xuICAgIHJldHVybiBcImlzX1wiICsgZmFjdDtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIG1ha2VfcHJvcGVydHkob2JqOiBhbnksIGZhY3Q6IGFueSkge1xuICAgIC8vIGNob29zaW5nIHRvIHJ1biBnZXRpdCgpIG9uIG1ha2VfcHJvcGVydHkgdG8gYWRkIGNvbnNpc3RlbmN5IGluIGFjY2Vzc2luZ1xuICAgIC8vIHByb3BvZXJ0aWVzIG9mIHN5bXR5cGUgb2JqZWN0cy4gdGhpcyBtYXkgc2xvdyBkb3duIHN5bXR5cGUgc2xpZ2h0bHlcbiAgICBvYmpbYXNfcHJvcGVydHkoZmFjdCldID0gZ2V0aXQ7XG4gICAgZnVuY3Rpb24gZ2V0aXQoKSB7XG4gICAgICAgIGlmICh0eXBlb2Ygb2JqLl9hc3N1bXB0aW9uc1tmYWN0XSAhPT0gXCJ1bmRlZmluZWRcIikge1xuICAgICAgICAgICAgcmV0dXJuIG9iai5fYXNzdW1wdGlvbnNbZmFjdF07XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gX2FzayhmYWN0LCBvYmopO1xuICAgICAgICB9XG4gICAgfVxufVxuXG5cbi8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBuby11bnVzZWQtdmFyc1xuZnVuY3Rpb24gX2FzayhmYWN0OiBhbnksIG9iajogYW55KSB7XG4gICAgLypcbiAgICBGaW5kIHRoZSB0cnV0aCB2YWx1ZSBmb3IgYSBwcm9wZXJ0eSBvZiBhbiBvYmplY3QuXG4gICAgVGhpcyBmdW5jdGlvbiBpcyBjYWxsZWQgd2hlbiBhIHJlcXVlc3QgaXMgbWFkZSB0byBzZWUgd2hhdCBhIGZhY3RcbiAgICB2YWx1ZSBpcy5cbiAgICBGb3IgdGhpcyB3ZSB1c2Ugc2V2ZXJhbCB0ZWNobmlxdWVzOlxuICAgIEZpcnN0LCB0aGUgZmFjdC1ldmFsdWF0aW9uIGZ1bmN0aW9uIGlzIHRyaWVkLCBpZiBpdCBleGlzdHMgKGZvclxuICAgIGV4YW1wbGUgX2V2YWxfaXNfaW50ZWdlcikuIFRoZW4gd2UgdHJ5IHJlbGF0ZWQgZmFjdHMuIEZvciBleGFtcGxlXG4gICAgICAgIHJhdGlvbmFsICAgLS0+ICAgaW50ZWdlclxuICAgIGFub3RoZXIgZXhhbXBsZSBpcyBqb2luZWQgcnVsZTpcbiAgICAgICAgaW50ZWdlciAmICFvZGQgIC0tPiBldmVuXG4gICAgc28gaW4gdGhlIGxhdHRlciBjYXNlIGlmIHdlIGFyZSBsb29raW5nIGF0IHdoYXQgJ2V2ZW4nIHZhbHVlIGlzLFxuICAgICdpbnRlZ2VyJyBhbmQgJ29kZCcgZmFjdHMgd2lsbCBiZSBhc2tlZC5cbiAgICBJbiBhbGwgY2FzZXMsIHdoZW4gd2Ugc2V0dGxlIG9uIHNvbWUgZmFjdCB2YWx1ZSwgaXRzIGltcGxpY2F0aW9ucyBhcmVcbiAgICBkZWR1Y2VkLCBhbmQgdGhlIHJlc3VsdCBpcyBjYWNoZWQgaW4gLl9hc3N1bXB0aW9ucy5cbiAgICAqL1xuXG4gICAgLy8gRmFjdEtCIHdoaWNoIGlzIGRpY3QtbGlrZSBhbmQgbWFwcyBmYWN0cyB0byB0aGVpciBrbm93biB2YWx1ZXM6XG4gICAgY29uc3QgYXNzdW1wdGlvbnM6IEZhY3RLQiA9IG9iai5fYXNzdW1wdGlvbnM7XG5cbiAgICAvLyBBIGRpY3QgdGhhdCBtYXBzIGZhY3RzIHRvIHRoZWlyIGhhbmRsZXJzOlxuICAgIGNvbnN0IGhhbmRsZXJfbWFwOiBIYXNoRGljdCA9IG9iai5fcHJvcF9oYW5kbGVyO1xuXG4gICAgLy8gVGhpcyBpcyBvdXIgcXVldWUgb2YgZmFjdHMgdG8gY2hlY2s6XG4gICAgY29uc3QgZmFjdHNfdG9fY2hlY2sgPSBuZXcgQXJyYXkoZmFjdCk7XG4gICAgY29uc3QgZmFjdHNfcXVldWVkID0gbmV3IEhhc2hTZXQoW2ZhY3RdKTtcblxuICAgIGNvbnN0IGNscyA9IG9iai5jb25zdHJ1Y3RvcjtcblxuICAgIGZvciAoY29uc3QgZmFjdF9pIG9mIGZhY3RzX3RvX2NoZWNrKSB7XG4gICAgICAgIGlmICh0eXBlb2YgYXNzdW1wdGlvbnMuZ2V0KGZhY3RfaSkgIT09IFwidW5kZWZpbmVkXCIpIHtcbiAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICB9IGVsc2UgaWYgKGNsc1thc19wcm9wZXJ0eShmYWN0KV0pIHtcbiAgICAgICAgICAgIHJldHVybiAoY2xzW2FzX3Byb3BlcnR5KGZhY3QpXSk7XG4gICAgICAgIH1cbiAgICAgICAgbGV0IGZhY3RfaV92YWx1ZSA9IHVuZGVmaW5lZDtcbiAgICAgICAgbGV0IGhhbmRsZXJfaSA9IGhhbmRsZXJfbWFwLmdldChmYWN0X2kpO1xuICAgICAgICBpZiAodHlwZW9mIGhhbmRsZXJfaSAhPT0gXCJ1bmRlZmluZWRcIikge1xuICAgICAgICAgICAgZmFjdF9pX3ZhbHVlID0gb2JqW2hhbmRsZXJfaS5uYW1lXSgpO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHR5cGVvZiBmYWN0X2lfdmFsdWUgIT09IFwidW5kZWZpbmVkXCIpIHtcbiAgICAgICAgICAgIGFzc3VtcHRpb25zLmRlZHVjZV9hbGxfZmFjdHMoW1tmYWN0X2ksIGZhY3RfaV92YWx1ZV1dKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IGZhY3RfdmFsdWUgPSBhc3N1bXB0aW9ucy5nZXQoZmFjdCk7XG4gICAgICAgIGlmICh0eXBlb2YgZmFjdF92YWx1ZSAhPT0gXCJ1bmRlZmluZWRcIikge1xuICAgICAgICAgICAgcmV0dXJuIGZhY3RfdmFsdWU7XG4gICAgICAgIH1cbiAgICAgICAgY29uc3QgZmFjdHNldCA9IF9hc3N1bWVfcnVsZXMucHJlcmVxLmdldChmYWN0X2kpLmRpZmZlcmVuY2UoZmFjdHNfcXVldWVkKTtcbiAgICAgICAgaWYgKGZhY3RzZXQuc2l6ZSAhPT0gMCkge1xuICAgICAgICAgICAgY29uc3QgbmV3X2ZhY3RzX3RvX2NoZWNrID0gbmV3IEFycmF5KF9hc3N1bWVfcnVsZXMucHJlcmVxLmdldChmYWN0X2kpLmRpZmZlcmVuY2UoZmFjdHNfcXVldWVkKSk7XG4gICAgICAgICAgICBVdGlsLnNodWZmbGVBcnJheShuZXdfZmFjdHNfdG9fY2hlY2spO1xuICAgICAgICAgICAgZmFjdHNfdG9fY2hlY2sucHVzaChuZXdfZmFjdHNfdG9fY2hlY2spO1xuICAgICAgICAgICAgZmFjdHNfdG9fY2hlY2suZmxhdCgpO1xuICAgICAgICAgICAgZmFjdHNfcXVldWVkLmFkZEFycihuZXdfZmFjdHNfdG9fY2hlY2spO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAoYXNzdW1wdGlvbnMuaGFzKGZhY3QpKSB7XG4gICAgICAgIHJldHVybiBhc3N1bXB0aW9ucy5nZXQoZmFjdCk7XG4gICAgfVxuXG4gICAgYXNzdW1wdGlvbnMuX3RlbGwoZmFjdCwgdW5kZWZpbmVkKTtcbiAgICByZXR1cm4gdW5kZWZpbmVkO1xufVxuXG5cbmNsYXNzIE1hbmFnZWRQcm9wZXJ0aWVzIHtcbiAgICBzdGF0aWMgYWxsX2V4cGxpY2l0X2Fzc3VtcHRpb25zOiBIYXNoRGljdCA9IG5ldyBIYXNoRGljdCgpO1xuICAgIHN0YXRpYyBhbGxfZGVmYXVsdF9hc3N1bXB0aW9uczogSGFzaFNldCA9IG5ldyBIYXNoU2V0KCk7XG5cblxuICAgIHN0YXRpYyByZWdpc3RlcihjbHM6IGFueSkge1xuICAgICAgICAvLyByZWdpc3RlciB3aXRoIEJhc2ljTWV0YSAocmVjb3JkIGNsYXNzIG5hbWUpXG4gICAgICAgIEJhc2ljTWV0YS5yZWdpc3RlcihjbHMpO1xuXG4gICAgICAgIC8vIEZvciBhbGwgcHJvcGVydGllcyB3ZSB3YW50IHRvIGRlZmluZSwgZGV0ZXJtaW5lIGlmIHRoZXkgYXJlIGRlZmluZWRcbiAgICAgICAgLy8gYnkgdGhlIGNsYXNzIG9yIGlmIHdlIHNldCB0aGVtIGFzIHVuZGVmaW5lZC5cbiAgICAgICAgLy8gQWRkIHRoZXNlIHByb3BlcnRpZXMgdG8gYSBkaWN0IGNhbGxlZCBsb2NhbF9kZWZzXG4gICAgICAgIGNvbnN0IGxvY2FsX2RlZnMgPSBuZXcgSGFzaERpY3QoKTtcbiAgICAgICAgZm9yIChjb25zdCBrIG9mIF9hc3N1bWVfZGVmaW5lZC50b0FycmF5KCkpIHtcbiAgICAgICAgICAgIGNvbnN0IGF0dHJuYW1lID0gYXNfcHJvcGVydHkoayk7XG4gICAgICAgICAgICBpZiAoYXR0cm5hbWUgaW4gY2xzKSB7XG4gICAgICAgICAgICAgICAgbGV0IHYgPSBjbHNbYXR0cm5hbWVdO1xuICAgICAgICAgICAgICAgIGlmICgodHlwZW9mIHYgPT09IFwibnVtYmVyXCIgJiYgTnVtYmVyLmlzSW50ZWdlcih2KSkgfHwgdHlwZW9mIHYgPT09IFwiYm9vbGVhblwiIHx8IHR5cGVvZiB2ID09PSBcInVuZGVmaW5lZFwiKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmICh0eXBlb2YgdiAhPT0gXCJ1bmRlZmluZWRcIikge1xuICAgICAgICAgICAgICAgICAgICAgICAgdiA9ICEhdjtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBsb2NhbF9kZWZzLmFkZChrLCB2KTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICAvLyBLZWVwIHRyYWNrIG9mIHRoZSBleHBsaWNpdCBhc3N1bXB0aW9ucyBmb3IgYWxsIHJlZ2lzdGVyZWQgY2xhc3Nlcy5cbiAgICAgICAgLy8gRm9yIGEgZ2l2ZW4gY2xhc3MsIHRoaXMgbG9va3MgbGlrZSB0aGUgYXNzdW1wdGlvbnMgZm9yIGFsbCBvZiBpdHNcbiAgICAgICAgLy8gc3VwZXJjbGFzc2VzIHNpbmNlIHdlIHJlZ2lzdGVyIGNsYXNzZXMgdG9wLWRvd24uXG4gICAgICAgIHRoaXMuYWxsX2V4cGxpY2l0X2Fzc3VtcHRpb25zLm1lcmdlKGxvY2FsX2RlZnMpO1xuXG4gICAgICAgIC8vIFNldCBjbGFzcyBwcm9wZXJ0aWVzXG4gICAgICAgIGNscy5fZXhwbGljaXRfY2xhc3NfYXNzdW1wdGlvbnMgPSB0aGlzLmFsbF9leHBsaWNpdF9hc3N1bXB0aW9ucztcbiAgICAgICAgY2xzLmRlZmF1bHRfYXNzdW1wdGlvbnMgPSBuZXcgU3RkRmFjdEtCKHRoaXMuYWxsX2V4cGxpY2l0X2Fzc3VtcHRpb25zKTtcblxuICAgICAgICAvLyBBZGQgZGVmYXVsdCBhc3N1bXB0aW9ucyBhcyBjbGFzcyBwcm9wZXJ0aWVzXG4gICAgICAgIGZvciAoY29uc3QgaXRlbSBvZiBjbHMuZGVmYXVsdF9hc3N1bXB0aW9ucy5lbnRyaWVzKCkpIHtcbiAgICAgICAgICAgIGNsc1thc19wcm9wZXJ0eShpdGVtWzBdKV0gPSBpdGVtWzFdO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gQ3JlYXRlIHR3byBzZXRzOiBvbmUgb2YgdGhlIGRlZmF1bHQgYXNzdW1wdGlvbiBrZXlzIGZvciB0aGlzIGNsYXNzXG4gICAgICAgIC8vIGFub3RoZXIgZm9yIHRoZSBiYXNlIGNsYXNzZXNcbiAgICAgICAgY29uc3QgcyA9IG5ldyBIYXNoU2V0KCk7XG4gICAgICAgIHMuYWRkQXJyKGNscy5kZWZhdWx0X2Fzc3VtcHRpb25zLmtleXMoKSk7XG4gICAgICAgIHRoaXMuYWxsX2RlZmF1bHRfYXNzdW1wdGlvbnMuYWRkQXJyKGNscy5kZWZhdWx0X2Fzc3VtcHRpb25zLmtleXMoKSk7XG5cblxuICAgICAgICAvLyBBZGQgb25seSB0aGUgcHJvcGVydGllcyBmcm9tIGJhc2UgY2xhc3NlcyB0aGF0IHdlIGRvbid0IGFscmVhZHkgaGF2ZVxuICAgICAgICBmb3IgKGNvbnN0IGZhY3Qgb2YgdGhpcy5hbGxfZGVmYXVsdF9hc3N1bXB0aW9ucy5kaWZmZXJlbmNlKHMpLnRvQXJyYXkoKSkge1xuICAgICAgICAgICAgY29uc3QgcG5hbWUgPSBhc19wcm9wZXJ0eShmYWN0KTtcbiAgICAgICAgICAgIGlmICghKHBuYW1lIGluIGNscykpIHtcbiAgICAgICAgICAgICAgICBtYWtlX3Byb3BlcnR5KGNscywgZmFjdCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCBhbGxkZWZzID0gbmV3IEhhc2hTZXQoT2JqZWN0LmtleXMoY2xzKSk7XG4gICAgICAgIGZvciAoY29uc3QgZmFjdCBvZiBhbGxkZWZzLmRpZmZlcmVuY2UoY2xzLmRlZmF1bHRfYXNzdW1wdGlvbnMpLnRvQXJyYXkoKSkge1xuICAgICAgICAgICAgY2xzLmRlZmF1bHRfYXNzdW1wdGlvbnMuYWRkKGZhY3QsIGNsc1tmYWN0XSk7XG4gICAgICAgIH1cbiAgICB9XG59XG5cbmV4cG9ydCB7U3RkRmFjdEtCLCBNYW5hZ2VkUHJvcGVydGllc307XG4iLCAiLypcbk5vdGFibGUgY2hhbmdlcyBtYWRlIChhbmQgbm90ZXMpOlxuLSBWZXJ5IGJhcmVib25lcyB2ZXJzaW9ucyBvZiBjbGFzc2VzIGltcGxlbWVudGVkIHNvIGZhclxuLSBTYW1lIHJlZ2lzdHJ5IHN5c3RlbSBhcyBTaW5nbGV0b24gLSB1c2luZyBzdGF0aWMgZGljdGlvbmFyeVxuKi9cblxuLyogZXNsaW50LWRpc2FibGUgbmV3LWNhcCAqL1xuY2xhc3MgS2luZFJlZ2lzdHJ5IHtcbiAgICBzdGF0aWMgcmVnaXN0cnk6IFJlY29yZDxhbnksIGFueT4gPSB7fTtcblxuICAgIHN0YXRpYyByZWdpc3RlcihuYW1lOiBzdHJpbmcsIGNsczogYW55KSB7XG4gICAgICAgIEtpbmRSZWdpc3RyeS5yZWdpc3RyeVtuYW1lXSA9IG5ldyBjbHMoKTtcbiAgICB9XG59XG5cbmNsYXNzIEtpbmQgeyAvLyAhISEgbWV0YWNsYXNzIHNpdHVhdGlvblxuICAgIC8qXG4gICAgQmFzZSBjbGFzcyBmb3Iga2luZHMuXG4gICAgS2luZCBvZiB0aGUgb2JqZWN0IHJlcHJlc2VudHMgdGhlIG1hdGhlbWF0aWNhbCBjbGFzc2lmaWNhdGlvbiB0aGF0XG4gICAgdGhlIGVudGl0eSBmYWxscyBpbnRvLiBJdCBpcyBleHBlY3RlZCB0aGF0IGZ1bmN0aW9ucyBhbmQgY2xhc3Nlc1xuICAgIHJlY29nbml6ZSBhbmQgZmlsdGVyIHRoZSBhcmd1bWVudCBieSBpdHMga2luZC5cbiAgICBLaW5kIG9mIGV2ZXJ5IG9iamVjdCBtdXN0IGJlIGNhcmVmdWxseSBzZWxlY3RlZCBzbyB0aGF0IGl0IHNob3dzIHRoZVxuICAgIGludGVudGlvbiBvZiBkZXNpZ24uIEV4cHJlc3Npb25zIG1heSBoYXZlIGRpZmZlcmVudCBraW5kIGFjY29yZGluZ1xuICAgIHRvIHRoZSBraW5kIG9mIGl0cyBhcmd1ZW1lbnRzLiBGb3IgZXhhbXBsZSwgYXJndWVtZW50cyBvZiBgYEFkZGBgXG4gICAgbXVzdCBoYXZlIGNvbW1vbiBraW5kIHNpbmNlIGFkZGl0aW9uIGlzIGdyb3VwIG9wZXJhdG9yLCBhbmQgdGhlXG4gICAgcmVzdWx0aW5nIGBgQWRkKClgYCBoYXMgdGhlIHNhbWUga2luZC5cbiAgICBGb3IgdGhlIHBlcmZvcm1hbmNlLCBlYWNoIGtpbmQgaXMgYXMgYnJvYWQgYXMgcG9zc2libGUgYW5kIGlzIG5vdFxuICAgIGJhc2VkIG9uIHNldCB0aGVvcnkuIEZvciBleGFtcGxlLCBgYE51bWJlcktpbmRgYCBpbmNsdWRlcyBub3Qgb25seVxuICAgIGNvbXBsZXggbnVtYmVyIGJ1dCBleHByZXNzaW9uIGNvbnRhaW5pbmcgYGBTLkluZmluaXR5YGAgb3IgYGBTLk5hTmBgXG4gICAgd2hpY2ggYXJlIG5vdCBzdHJpY3RseSBudW1iZXIuXG4gICAgS2luZCBtYXkgaGF2ZSBhcmd1bWVudHMgYXMgcGFyYW1ldGVyLiBGb3IgZXhhbXBsZSwgYGBNYXRyaXhLaW5kKClgYFxuICAgIG1heSBiZSBjb25zdHJ1Y3RlZCB3aXRoIG9uZSBlbGVtZW50IHdoaWNoIHJlcHJlc2VudHMgdGhlIGtpbmQgb2YgaXRzXG4gICAgZWxlbWVudHMuXG4gICAgYGBLaW5kYGAgYmVoYXZlcyBpbiBzaW5nbGV0b24tbGlrZSBmYXNoaW9uLiBTYW1lIHNpZ25hdHVyZSB3aWxsXG4gICAgcmV0dXJuIHRoZSBzYW1lIG9iamVjdC5cbiAgICAqL1xuXG4gICAgc3RhdGljIG5ldyhjbHM6IGFueSwgLi4uYXJnczogYW55KSB7XG4gICAgICAgIGxldCBpbnN0O1xuICAgICAgICBpZiAoYXJncyBpbiBLaW5kUmVnaXN0cnkucmVnaXN0cnkpIHtcbiAgICAgICAgICAgIGluc3QgPSBLaW5kUmVnaXN0cnkucmVnaXN0cnlbYXJnc107XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBLaW5kUmVnaXN0cnkucmVnaXN0ZXIoY2xzLm5hbWUsIGNscyk7XG4gICAgICAgICAgICBpbnN0ID0gbmV3IGNscygpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBpbnN0O1xuICAgIH1cbn1cblxuY2xhc3MgX1VuZGVmaW5lZEtpbmQgZXh0ZW5kcyBLaW5kIHtcbiAgICAvKlxuICAgIERlZmF1bHQga2luZCBmb3IgYWxsIFN5bVB5IG9iamVjdC4gSWYgdGhlIGtpbmQgaXMgbm90IGRlZmluZWQgZm9yXG4gICAgdGhlIG9iamVjdCwgb3IgaWYgdGhlIG9iamVjdCBjYW5ub3QgaW5mZXIgdGhlIGtpbmQgZnJvbSBpdHNcbiAgICBhcmd1bWVudHMsIHRoaXMgd2lsbCBiZSByZXR1cm5lZC5cbiAgICBFeGFtcGxlc1xuICAgID09PT09PT09XG4gICAgPj4+IGZyb20gc3ltcHkgaW1wb3J0IEV4cHJcbiAgICA+Pj4gRXhwcigpLmtpbmRcbiAgICBVbmRlZmluZWRLaW5kXG4gICAgKi9cblxuICAgIGNvbnN0cnVjdG9yKCkge1xuICAgICAgICBzdXBlcigpO1xuICAgIH1cblxuICAgIHN0YXRpYyBuZXcoKSB7XG4gICAgICAgIHJldHVybiBLaW5kLm5ldyhfVW5kZWZpbmVkS2luZCk7XG4gICAgfVxuXG4gICAgdG9TdHJpbmcoKSB7XG4gICAgICAgIHJldHVybiBcIlVuZGVmaW5lZEtpbmRcIjtcbiAgICB9XG59XG5cbmNvbnN0IFVuZGVmaW5lZEtpbmQgPSBfVW5kZWZpbmVkS2luZC5uZXcoKTtcblxuY2xhc3MgX051bWJlcktpbmQgZXh0ZW5kcyBLaW5kIHtcbiAgICAvKlxuICAgIEtpbmQgZm9yIGFsbCBudW1lcmljIG9iamVjdC5cbiAgICBUaGlzIGtpbmQgcmVwcmVzZW50cyBldmVyeSBudW1iZXIsIGluY2x1ZGluZyBjb21wbGV4IG51bWJlcnMsXG4gICAgaW5maW5pdHkgYW5kIGBgUy5OYU5gYC4gT3RoZXIgb2JqZWN0cyBzdWNoIGFzIHF1YXRlcm5pb25zIGRvIG5vdFxuICAgIGhhdmUgdGhpcyBraW5kLlxuICAgIE1vc3QgYGBFeHByYGAgYXJlIGluaXRpYWxseSBkZXNpZ25lZCB0byByZXByZXNlbnQgdGhlIG51bWJlciwgc29cbiAgICB0aGlzIHdpbGwgYmUgdGhlIG1vc3QgY29tbW9uIGtpbmQgaW4gU3ltUHkgY29yZS4gRm9yIGV4YW1wbGVcbiAgICBgYFN5bWJvbCgpYGAsIHdoaWNoIHJlcHJlc2VudHMgYSBzY2FsYXIsIGhhcyB0aGlzIGtpbmQgYXMgbG9uZyBhcyBpdFxuICAgIGlzIGNvbW11dGF0aXZlLlxuICAgIE51bWJlcnMgZm9ybSBhIGZpZWxkLiBBbnkgb3BlcmF0aW9uIGJldHdlZW4gbnVtYmVyLWtpbmQgb2JqZWN0cyB3aWxsXG4gICAgcmVzdWx0IHRoaXMga2luZCBhcyB3ZWxsLlxuICAgIEV4YW1wbGVzXG4gICAgPT09PT09PT1cbiAgICA+Pj4gZnJvbSBzeW1weSBpbXBvcnQgUywgb28sIFN5bWJvbFxuICAgID4+PiBTLk9uZS5raW5kXG4gICAgTnVtYmVyS2luZFxuICAgID4+PiAoLW9vKS5raW5kXG4gICAgTnVtYmVyS2luZFxuICAgID4+PiBTLk5hTi5raW5kXG4gICAgTnVtYmVyS2luZFxuICAgIENvbW11dGF0aXZlIHN5bWJvbCBhcmUgdHJlYXRlZCBhcyBudW1iZXIuXG4gICAgPj4+IHggPSBTeW1ib2woJ3gnKVxuICAgID4+PiB4LmtpbmRcbiAgICBOdW1iZXJLaW5kXG4gICAgPj4+IFN5bWJvbCgneScsIGNvbW11dGF0aXZlPUZhbHNlKS5raW5kXG4gICAgVW5kZWZpbmVkS2luZFxuICAgIE9wZXJhdGlvbiBiZXR3ZWVuIG51bWJlcnMgcmVzdWx0cyBudW1iZXIuXG4gICAgPj4+ICh4KzEpLmtpbmRcbiAgICBOdW1iZXJLaW5kXG4gICAgU2VlIEFsc29cbiAgICA9PT09PT09PVxuICAgIHN5bXB5LmNvcmUuZXhwci5FeHByLmlzX051bWJlciA6IGNoZWNrIGlmIHRoZSBvYmplY3QgaXMgc3RyaWN0bHlcbiAgICBzdWJjbGFzcyBvZiBgYE51bWJlcmBgIGNsYXNzLlxuICAgIHN5bXB5LmNvcmUuZXhwci5FeHByLmlzX251bWJlciA6IGNoZWNrIGlmIHRoZSBvYmplY3QgaXMgbnVtYmVyXG4gICAgd2l0aG91dCBhbnkgZnJlZSBzeW1ib2wuXG4gICAgKi9cblxuICAgIGNvbnN0cnVjdG9yKCkge1xuICAgICAgICBzdXBlcigpO1xuICAgIH1cblxuICAgIHN0YXRpYyBuZXcoKSB7XG4gICAgICAgIHJldHVybiBLaW5kLm5ldyhfTnVtYmVyS2luZCk7XG4gICAgfVxuXG4gICAgdG9TdHJpbmcoKSB7XG4gICAgICAgIHJldHVybiBcIk51bWJlcktpbmRcIjtcbiAgICB9XG59XG5cbmNvbnN0IE51bWJlcktpbmQgPSBfTnVtYmVyS2luZC5uZXcoKTtcblxuY2xhc3MgX0Jvb2xlYW5LaW5kIGV4dGVuZHMgS2luZCB7XG4gICAgLypcbiAgICBLaW5kIGZvciBib29sZWFuIG9iamVjdHMuXG4gICAgU3ltUHkncyBgYFMudHJ1ZWBgLCBgYFMuZmFsc2VgYCwgYW5kIGJ1aWx0LWluIGBgVHJ1ZWBgIGFuZCBgYEZhbHNlYGBcbiAgICBoYXZlIHRoaXMga2luZC4gQm9vbGVhbiBudW1iZXIgYGAxYGAgYW5kIGBgMGBgIGFyZSBub3QgcmVsZXZlbnQuXG4gICAgRXhhbXBsZXNcbiAgICA9PT09PT09PVxuICAgID4+PiBmcm9tIHN5bXB5IGltcG9ydCBTLCBRXG4gICAgPj4+IFMudHJ1ZS5raW5kXG4gICAgQm9vbGVhbktpbmRcbiAgICA+Pj4gUS5ldmVuKDMpLmtpbmRcbiAgICBCb29sZWFuS2luZFxuICAgICovXG5cbiAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICAgICAgc3VwZXIoKTtcbiAgICB9XG5cbiAgICBzdGF0aWMgbmV3KCkge1xuICAgICAgICByZXR1cm4gS2luZC5uZXcoX0Jvb2xlYW5LaW5kKTtcbiAgICB9XG5cbiAgICB0b1N0cmluZygpIHtcbiAgICAgICAgcmV0dXJuIFwiQm9vbGVhbktpbmRcIjtcbiAgICB9XG59XG5cbmNvbnN0IEJvb2xlYW5LaW5kID0gX0Jvb2xlYW5LaW5kLm5ldygpO1xuXG5cbmV4cG9ydCB7VW5kZWZpbmVkS2luZCwgTnVtYmVyS2luZCwgQm9vbGVhbktpbmR9O1xuIiwgImNsYXNzIHByZW9yZGVyX3RyYXZlcnNhbCB7XG4gICAgLypcbiAgICBEbyBhIHByZS1vcmRlciB0cmF2ZXJzYWwgb2YgYSB0cmVlLlxuICAgIFRoaXMgaXRlcmF0b3IgcmVjdXJzaXZlbHkgeWllbGRzIG5vZGVzIHRoYXQgaXQgaGFzIHZpc2l0ZWQgaW4gYSBwcmUtb3JkZXJcbiAgICBmYXNoaW9uLiBUaGF0IGlzLCBpdCB5aWVsZHMgdGhlIGN1cnJlbnQgbm9kZSB0aGVuIGRlc2NlbmRzIHRocm91Z2ggdGhlXG4gICAgdHJlZSBicmVhZHRoLWZpcnN0IHRvIHlpZWxkIGFsbCBvZiBhIG5vZGUncyBjaGlsZHJlbidzIHByZS1vcmRlclxuICAgIHRyYXZlcnNhbC5cbiAgICBGb3IgYW4gZXhwcmVzc2lvbiwgdGhlIG9yZGVyIG9mIHRoZSB0cmF2ZXJzYWwgZGVwZW5kcyBvbiB0aGUgb3JkZXIgb2ZcbiAgICAuYXJncywgd2hpY2ggaW4gbWFueSBjYXNlcyBjYW4gYmUgYXJiaXRyYXJ5LlxuICAgIFBhcmFtZXRlcnNcbiAgICA9PT09PT09PT09XG4gICAgbm9kZSA6IFN5bVB5IGV4cHJlc3Npb25cbiAgICAgICAgVGhlIGV4cHJlc3Npb24gdG8gdHJhdmVyc2UuXG4gICAga2V5cyA6IChkZWZhdWx0IE5vbmUpIHNvcnQga2V5KHMpXG4gICAgICAgIFRoZSBrZXkocykgdXNlZCB0byBzb3J0IGFyZ3Mgb2YgQmFzaWMgb2JqZWN0cy4gV2hlbiBOb25lLCBhcmdzIG9mIEJhc2ljXG4gICAgICAgIG9iamVjdHMgYXJlIHByb2Nlc3NlZCBpbiBhcmJpdHJhcnkgb3JkZXIuIElmIGtleSBpcyBkZWZpbmVkLCBpdCB3aWxsXG4gICAgICAgIGJlIHBhc3NlZCBhbG9uZyB0byBvcmRlcmVkKCkgYXMgdGhlIG9ubHkga2V5KHMpIHRvIHVzZSB0byBzb3J0IHRoZVxuICAgICAgICBhcmd1bWVudHM7IGlmIGBga2V5YGAgaXMgc2ltcGx5IFRydWUgdGhlbiB0aGUgZGVmYXVsdCBrZXlzIG9mIG9yZGVyZWRcbiAgICAgICAgd2lsbCBiZSB1c2VkLlxuICAgIFlpZWxkc1xuICAgID09PT09PVxuICAgIHN1YnRyZWUgOiBTeW1QeSBleHByZXNzaW9uXG4gICAgICAgIEFsbCBvZiB0aGUgc3VidHJlZXMgaW4gdGhlIHRyZWUuXG4gICAgRXhhbXBsZXNcbiAgICA9PT09PT09PVxuICAgID4+PiBmcm9tIHN5bXB5IGltcG9ydCBwcmVvcmRlcl90cmF2ZXJzYWwsIHN5bWJvbHNcbiAgICA+Pj4geCwgeSwgeiA9IHN5bWJvbHMoJ3ggeSB6JylcbiAgICBUaGUgbm9kZXMgYXJlIHJldHVybmVkIGluIHRoZSBvcmRlciB0aGF0IHRoZXkgYXJlIGVuY291bnRlcmVkIHVubGVzcyBrZXlcbiAgICBpcyBnaXZlbjsgc2ltcGx5IHBhc3Npbmcga2V5PVRydWUgd2lsbCBndWFyYW50ZWUgdGhhdCB0aGUgdHJhdmVyc2FsIGlzXG4gICAgdW5pcXVlLlxuICAgID4+PiBsaXN0KHByZW9yZGVyX3RyYXZlcnNhbCgoeCArIHkpKnosIGtleXM9Tm9uZSkpICMgZG9jdGVzdDogK1NLSVBcbiAgICBbeiooeCArIHkpLCB6LCB4ICsgeSwgeSwgeF1cbiAgICA+Pj4gbGlzdChwcmVvcmRlcl90cmF2ZXJzYWwoKHggKyB5KSp6LCBrZXlzPVRydWUpKVxuICAgIFt6Kih4ICsgeSksIHosIHggKyB5LCB4LCB5XVxuICAgICovXG5cbiAgICBfc2tpcF9mbGFnOiBhbnk7XG4gICAgX3B0OiBhbnk7XG4gICAgY29uc3RydWN0b3Iobm9kZTogYW55KSB7XG4gICAgICAgIHRoaXMuX3NraXBfZmxhZyA9IGZhbHNlO1xuICAgICAgICB0aGlzLl9wdCA9IHRoaXMuX3ByZW9yZGVyX3RyYXZlcnNhbChub2RlKTtcbiAgICB9XG5cbiAgICAqIF9wcmVvcmRlcl90cmF2ZXJzYWwobm9kZTogYW55KTogYW55IHtcbiAgICAgICAgeWllbGQgbm9kZTtcbiAgICAgICAgaWYgKHRoaXMuX3NraXBfZmxhZykge1xuICAgICAgICAgICAgdGhpcy5fc2tpcF9mbGFnID0gZmFsc2U7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgaWYgKG5vZGUuaW5zdGFuY2VvZkJhc2ljKSB7XG4gICAgICAgICAgICBsZXQgYXJncztcbiAgICAgICAgICAgIGlmIChub2RlLl9hcmdzZXQpIHtcbiAgICAgICAgICAgICAgICBhcmdzID0gbm9kZS5fYXJnc2V0O1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBhcmdzID0gbm9kZS5fYXJncztcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGZvciAoY29uc3QgYXJnIG9mIGFyZ3MpIHtcbiAgICAgICAgICAgICAgICBmb3IgKGNvbnN0IHZhbCBvZiB0aGlzLl9wcmVvcmRlcl90cmF2ZXJzYWwoYXJnKSkge1xuICAgICAgICAgICAgICAgICAgICB5aWVsZCB2YWw7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9IGVsc2UgaWYgKFN5bWJvbC5pdGVyYXRvciBpbiBPYmplY3Qobm9kZSkpIHtcbiAgICAgICAgICAgIGZvciAoY29uc3QgaXRlbSBvZiBub2RlKSB7XG4gICAgICAgICAgICAgICAgZm9yIChjb25zdCB2YWwgb2YgdGhpcy5fcHJlb3JkZXJfdHJhdmVyc2FsKGl0ZW0pKSB7XG4gICAgICAgICAgICAgICAgICAgIHlpZWxkIHZhbDtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBhc0l0ZXIoKSB7XG4gICAgICAgIGNvbnN0IHJlczogYW55W10gPSBbXTtcbiAgICAgICAgZm9yIChjb25zdCBpdGVtIG9mIHRoaXMuX3B0KSB7XG4gICAgICAgICAgICByZXMucHVzaChpdGVtKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gcmVzO1xuICAgIH1cbn1cblxuZXhwb3J0IHtwcmVvcmRlcl90cmF2ZXJzYWx9O1xuIiwgIi8qXG5Ob3RhYmxlIGNoYW5nZXMgbWFkZSAoYW5kIG5vdGVzKTpcbi0gQmFzaWMgcmV3b3JrZWQgd2l0aCBjb25zdHJ1Y3RvciBzeXN0ZW1cbi0gQmFzaWMgaGFuZGxlcyBPQkpFQ1QgcHJvcGVydGllcywgTWFuYWdlZFByb3BlcnRpZXMgaGFuZGxlcyBDTEFTUyBwcm9wZXJ0aWVzXG4tIF9ldmFsX2lzIHByb3BlcnRpZXMgKGRlcGVuZGVudCBvbiBvYmplY3QpIGFyZSBub3cgYXNzaWduZWQgaW4gQmFzaWNcbi0gU29tZSBwcm9wZXJ0aWVzIG9mIEJhc2ljIChhbmQgc3ViY2xhc3NlcykgYXJlIHN0YXRpY1xuKi9cblxuaW1wb3J0IHthc19wcm9wZXJ0eSwgbWFrZV9wcm9wZXJ0eSwgTWFuYWdlZFByb3BlcnRpZXMsIF9hc3N1bWVfZGVmaW5lZH0gZnJvbSBcIi4vYXNzdW1wdGlvbnMuanNcIjtcbmltcG9ydCB7VXRpbCwgSGFzaERpY3QsIG1peCwgYmFzZSwgSGFzaFNldH0gZnJvbSBcIi4vdXRpbGl0eS5qc1wiO1xuaW1wb3J0IHtVbmRlZmluZWRLaW5kfSBmcm9tIFwiLi9raW5kLmpzXCI7XG5pbXBvcnQge3ByZW9yZGVyX3RyYXZlcnNhbH0gZnJvbSBcIi4vdHJhdmVyc2FsLmpzXCI7XG5cblxuY29uc3QgX0Jhc2ljID0gKHN1cGVyY2xhc3M6IGFueSkgPT4gY2xhc3MgX0Jhc2ljIGV4dGVuZHMgc3VwZXJjbGFzcyB7XG4gICAgLypcbiAgICBCYXNlIGNsYXNzIGZvciBhbGwgU3ltUHkgb2JqZWN0cy5cbiAgICBOb3RlcyBhbmQgY29udmVudGlvbnNcbiAgICA9PT09PT09PT09PT09PT09PT09PT1cbiAgICAxKSBBbHdheXMgdXNlIGBgLmFyZ3NgYCwgd2hlbiBhY2Nlc3NpbmcgcGFyYW1ldGVycyBvZiBzb21lIGluc3RhbmNlOlxuICAgID4+PiBmcm9tIHN5bXB5IGltcG9ydCBjb3RcbiAgICA+Pj4gZnJvbSBzeW1weS5hYmMgaW1wb3J0IHgsIHlcbiAgICA+Pj4gY290KHgpLmFyZ3NcbiAgICAoeCwpXG4gICAgPj4+IGNvdCh4KS5hcmdzWzBdXG4gICAgeFxuICAgID4+PiAoeCp5KS5hcmdzXG4gICAgKHgsIHkpXG4gICAgPj4+ICh4KnkpLmFyZ3NbMV1cbiAgICB5XG4gICAgMikgTmV2ZXIgdXNlIGludGVybmFsIG1ldGhvZHMgb3IgdmFyaWFibGVzICh0aGUgb25lcyBwcmVmaXhlZCB3aXRoIGBgX2BgKTpcbiAgICA+Pj4gY290KHgpLl9hcmdzICAgICMgZG8gbm90IHVzZSB0aGlzLCB1c2UgY290KHgpLmFyZ3MgaW5zdGVhZFxuICAgICh4LClcbiAgICAzKSAgQnkgXCJTeW1QeSBvYmplY3RcIiB3ZSBtZWFuIHNvbWV0aGluZyB0aGF0IGNhbiBiZSByZXR1cm5lZCBieVxuICAgICAgICBgYHN5bXBpZnlgYC4gIEJ1dCBub3QgYWxsIG9iamVjdHMgb25lIGVuY291bnRlcnMgdXNpbmcgU3ltUHkgYXJlXG4gICAgICAgIHN1YmNsYXNzZXMgb2YgQmFzaWMuICBGb3IgZXhhbXBsZSwgbXV0YWJsZSBvYmplY3RzIGFyZSBub3Q6XG4gICAgICAgID4+PiBmcm9tIHN5bXB5IGltcG9ydCBCYXNpYywgTWF0cml4LCBzeW1waWZ5XG4gICAgICAgID4+PiBBID0gTWF0cml4KFtbMSwgMl0sIFszLCA0XV0pLmFzX211dGFibGUoKVxuICAgICAgICA+Pj4gaXNpbnN0YW5jZShBLCBCYXNpYylcbiAgICAgICAgRmFsc2VcbiAgICAgICAgPj4+IEIgPSBzeW1waWZ5KEEpXG4gICAgICAgID4+PiBpc2luc3RhbmNlKEIsIEJhc2ljKVxuICAgICAgICBUcnVlXG4gICAgKi9cblxuICAgIF9fc2xvdHNfXyA9IFtcIl9taGFzaFwiLCBcIl9hcmdzXCIsIFwiX2Fzc3VtcHRpb25zXCJdO1xuICAgIF9hcmdzOiBhbnlbXTtcbiAgICBfbWhhc2g6IE51bWJlciB8IHVuZGVmaW5lZDtcbiAgICBfYXNzdW1wdGlvbnM7XG5cbiAgICAvLyBUbyBiZSBvdmVycmlkZGVuIHdpdGggVHJ1ZSBpbiB0aGUgYXBwcm9wcmlhdGUgc3ViY2xhc3Nlc1xuICAgIHN0YXRpYyBpc19udW1iZXIgPSBmYWxzZTtcbiAgICBzdGF0aWMgaXNfQXRvbSA9IGZhbHNlO1xuICAgIHN0YXRpYyBpc19TeW1ib2wgPSBmYWxzZTtcbiAgICBzdGF0aWMgaXNfc3ltYm9sID0gZmFsc2U7XG4gICAgc3RhdGljIGlzX0luZGV4ZWQgPSBmYWxzZTtcbiAgICBzdGF0aWMgaXNfRHVtbXkgPSBmYWxzZTtcbiAgICBzdGF0aWMgaXNfV2lsZCA9IGZhbHNlO1xuICAgIHN0YXRpYyBpc19GdW5jdGlvbiA9IGZhbHNlO1xuICAgIHN0YXRpYyBpc19BZGQgPSBmYWxzZTtcbiAgICBzdGF0aWMgaXNfTXVsID0gZmFsc2U7XG4gICAgc3RhdGljIGlzX1BvdyA9IGZhbHNlO1xuICAgIHN0YXRpYyBpc19OdW1iZXIgPSBmYWxzZTtcbiAgICBzdGF0aWMgaXNfRmxvYXQgPSBmYWxzZTtcbiAgICBzdGF0aWMgaXNfUmF0aW9uYWwgPSBmYWxzZTtcbiAgICBzdGF0aWMgaXNfSW50ZWdlciA9IGZhbHNlO1xuICAgIHN0YXRpYyBpc19OdW1iZXJTeW1ib2wgPSBmYWxzZTtcbiAgICBzdGF0aWMgaXNfT3JkZXIgPSBmYWxzZTtcbiAgICBzdGF0aWMgaXNfRGVyaXZhdGl2ZSA9IGZhbHNlO1xuICAgIHN0YXRpYyBpc19QaWVjZXdpc2UgPSBmYWxzZTtcbiAgICBzdGF0aWMgaXNfUG9seSA9IGZhbHNlO1xuICAgIHN0YXRpYyBpc19BbGdlYnJhaWNOdW1iZXIgPSBmYWxzZTtcbiAgICBzdGF0aWMgaXNfUmVsYXRpb25hbCA9IGZhbHNlO1xuICAgIHN0YXRpYyBpc19FcXVhbGl0eSA9IGZhbHNlO1xuICAgIHN0YXRpYyBpc19Cb29sZWFuID0gZmFsc2U7XG4gICAgc3RhdGljIGlzX05vdCA9IGZhbHNlO1xuICAgIHN0YXRpYyBpc19NYXRyaXggPSBmYWxzZTtcbiAgICBzdGF0aWMgaXNfVmVjdG9yID0gZmFsc2U7XG4gICAgc3RhdGljIGlzX1BvaW50ID0gZmFsc2U7XG4gICAgc3RhdGljIGlzX01hdEFkZCA9IGZhbHNlO1xuICAgIHN0YXRpYyBpc19NYXRNdWwgPSBmYWxzZTtcbiAgICBzdGF0aWMgaXNfbmVnYXRpdmU6IGJvb2xlYW4gfCB1bmRlZmluZWQ7XG4gICAgc3RhdGljIGlzX2NvbW11dGF0aXZlOiBib29sZWFuIHwgdW5kZWZpbmVkO1xuXG4gICAgc3RhdGljIGtpbmQgPSBVbmRlZmluZWRLaW5kO1xuICAgIHN0YXRpYyBhbGxfdW5pcXVlX3Byb3BzOiBIYXNoU2V0ID0gbmV3IEhhc2hTZXQoKTtcblxuICAgIGNvbnN0cnVjdG9yKC4uLmFyZ3M6IGFueSkge1xuICAgICAgICBzdXBlcigpO1xuICAgICAgICBjb25zdCBjbHM6IGFueSA9IHRoaXMuY29uc3RydWN0b3I7XG4gICAgICAgIHRoaXMuX2Fzc3VtcHRpb25zID0gY2xzLmRlZmF1bHRfYXNzdW1wdGlvbnMuc3RkY2xvbmUoKTtcbiAgICAgICAgdGhpcy5fbWhhc2ggPSB1bmRlZmluZWQ7XG4gICAgICAgIHRoaXMuX2FyZ3MgPSBhcmdzO1xuICAgICAgICAvLyBDcmVhdGUgYSBkaWN0aW9uYXJ5IHRvIGhhbmRsZSB0aGUgY3VycmVudCBwcm9wZXJ0aWVzIG9mIHRoZSBjbGFzc1xuICAgICAgICAvLyBPbmx5IGV2dWF0ZWQgb25jZSBwZXIgY2xhc3NcbiAgICAgICAgaWYgKHR5cGVvZiBjbHMuX3Byb3BfaGFuZGxlciA9PT0gXCJ1bmRlZmluZWRcIikge1xuICAgICAgICAgICAgY2xzLl9wcm9wX2hhbmRsZXIgPSBuZXcgSGFzaERpY3QoKTtcbiAgICAgICAgICAgIGZvciAoY29uc3QgayBvZiBfYXNzdW1lX2RlZmluZWQudG9BcnJheSgpKSB7XG4gICAgICAgICAgICAgICAgY29uc3QgbWV0aDEgPSBcIl9ldmFsX2lzX1wiICsgaztcbiAgICAgICAgICAgICAgICBpZiAodGhpc1ttZXRoMV0pIHtcbiAgICAgICAgICAgICAgICAgICAgY2xzLl9wcm9wX2hhbmRsZXIuYWRkKGssIHRoaXNbbWV0aDFdKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgLy8gQWRkIGFsbCBkZWZpbmVkIHByb3BlcnRpZXNcbiAgICAgICAgdGhpcy5fcHJvcF9oYW5kbGVyID0gY2xzLl9wcm9wX2hhbmRsZXIuY29weSgpO1xuICAgICAgICBmb3IgKGNvbnN0IGZhY3Qgb2YgX2Fzc3VtZV9kZWZpbmVkLnRvQXJyYXkoKSkge1xuICAgICAgICAgICAgY29uc3QgcG5hbWUgPSBhc19wcm9wZXJ0eShmYWN0KTtcbiAgICAgICAgICAgIGlmICh0eXBlb2YgY2xzW3BuYW1lXSA9PT0gXCJ1bmRlZmluZWRcIikge1xuICAgICAgICAgICAgICAgIG1ha2VfcHJvcGVydHkodGhpcywgZmFjdCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICAvLyBTWU1UWVBFIEFERElUSU9OOiBhZGQgc3RhdGljIHZhcmlhYmxlcyBhcyBvYmplY3QgcHJvcGVydGllc1xuXG5cbiAgICAgICAgLy8gaGVscGVyIGZ1bmN0aW9uIHRvIGdldCBzdXBlciBjbGFzc2VzIG9mIG91ciBjdXJyZW50IGNsYXNzXG4gICAgICAgIGZ1bmN0aW9uIGdldFN1cGVycyhjbHM6IGFueSk6IGFueVtdIHtcbiAgICAgICAgICAgIGNvbnN0IHN1cGVyY2xhc3NlcyA9IFtdO1xuICAgICAgICAgICAgY29uc3Qgc3VwZXJjbGFzcyA9IE9iamVjdC5nZXRQcm90b3R5cGVPZihjbHMpO1xuICAgICAgICAgIFxuICAgICAgICAgICAgaWYgKHN1cGVyY2xhc3MgIT09IG51bGwgJiYgc3VwZXJjbGFzcyAhPT0gT2JqZWN0LnByb3RvdHlwZSkge1xuICAgICAgICAgICAgICAgIHN1cGVyY2xhc3Nlcy5wdXNoKHN1cGVyY2xhc3MpO1xuICAgICAgICAgICAgICAgIGNvbnN0IHBhcmVudFN1cGVyY2xhc3NlcyA9IGdldFN1cGVycyhzdXBlcmNsYXNzKTtcbiAgICAgICAgICAgICAgICBzdXBlcmNsYXNzZXMucHVzaCguLi5wYXJlbnRTdXBlcmNsYXNzZXMpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIFxuICAgICAgICAgICAgcmV0dXJuIHN1cGVyY2xhc3NlcztcbiAgICAgICAgfVxuICAgIFxuICAgICAgICAvLyBnZXQgdGhlIHN0YXRpYyB2YXJpYWJsZXMgb2YgdGhpcyBjbGFzcyBhbmQgYXNzaWduIHRvIG9iamVjdFxuICAgICAgICBjb25zdCBjdXJyZW50U3RhdGljVmFycyA9IE9iamVjdC5nZXRPd25Qcm9wZXJ0eU5hbWVzKGNscykuZmlsdGVyKHByb3AgPT4gcHJvcC5pbmNsdWRlcyhcImlzX1wiKSk7XG4gICAgICAgIGZvciAoY29uc3QgcHJvcCBvZiBjdXJyZW50U3RhdGljVmFycykge1xuICAgICAgICAgICAgdGhpc1twcm9wXSA9ICgpID0+IGNsc1twcm9wXTtcbiAgICAgICAgfVxuICAgICAgICBcbiAgICAgICAgLy8gZ2V0IHRoZSBzdGF0aWMgdmFyaWFibGVzIG9mIGFsbCBzdXBlcmNsYXNzZXMgYW5kIGFzc2lnbiB0byBvYmplY3RcbiAgICAgICAgLy8gbm90ZSB0aGF0IHdlIG9ubHkgYXNzaWduIHRoZSBwcm9wZXJ0aWVzIGlmIHRoZXkgYXJlIHVuZGVmaW5lZCBcbiAgICAgICAgY29uc3Qgc3VwZXJzOiBhbnlbXSA9IGdldFN1cGVycyhjbHMpO1xuICAgICAgICBmb3IgKGNvbnN0IHN1cGVyY2xzIG9mIHN1cGVycykge1xuICAgICAgICAgICAgY29uc3Qgc3VwZXJjbGFzc1N0YXRpY1ZhcnMgPSBPYmplY3QuZ2V0T3duUHJvcGVydHlOYW1lcyhzdXBlcmNscykuZmlsdGVyKHByb3AgPT4gcHJvcC5pbmNsdWRlcyhcImlzX1wiKSk7XG4gICAgICAgICAgICBmb3IgKGNvbnN0IHByb3Agb2Ygc3VwZXJjbGFzc1N0YXRpY1ZhcnMpIHtcbiAgICAgICAgICAgICAgICBpZiAodHlwZW9mIHRoaXNbcHJvcF0gPT0gXCJ1bmRlZmluZWRcIikge1xuICAgICAgICAgICAgICAgICAgICB0aGlzW3Byb3BdID0gKCkgPT4gY2xzW3Byb3BdO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgIF9fZ2V0bmV3YXJnc19fKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5fYXJncztcbiAgICB9XG5cbiAgICBfX2dldHN0YXRlX18oKTogYW55IHtcbiAgICAgICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgICB9XG5cbiAgICBoYXNoKCkge1xuICAgICAgICBpZiAodHlwZW9mIHRoaXMuX21oYXNoID09PSBcInVuZGVmaW5lZFwiKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5jb25zdHJ1Y3Rvci5uYW1lICsgdGhpcy5oYXNoS2V5KCk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRoaXMuX21oYXNoO1xuICAgIH1cblxuICAgIC8vIGJhbmRhaWQgc29sdXRpb24gZm9yIGluc3RhbmNlb2YgaXNzdWUgLSBzdGlsbCBuZWVkIHRvIGZpeFxuICAgIGluc3RhbmNlb2ZCYXNpYygpIHtcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuXG4gICAgYXNzdW1wdGlvbnMwKCkge1xuICAgICAgICAvKlxuICAgICAgICBSZXR1cm4gb2JqZWN0IGB0eXBlYCBhc3N1bXB0aW9ucy5cbiAgICAgICAgRm9yIGV4YW1wbGU6XG4gICAgICAgICAgU3ltYm9sKCd4JywgcmVhbD1UcnVlKVxuICAgICAgICAgIFN5bWJvbCgneCcsIGludGVnZXI9VHJ1ZSlcbiAgICAgICAgYXJlIGRpZmZlcmVudCBvYmplY3RzLiBJbiBvdGhlciB3b3JkcywgYmVzaWRlcyBQeXRob24gdHlwZSAoU3ltYm9sIGluXG4gICAgICAgIHRoaXMgY2FzZSksIHRoZSBpbml0aWFsIGFzc3VtcHRpb25zIGFyZSBhbHNvIGZvcm1pbmcgdGhlaXIgdHlwZWluZm8uXG4gICAgICAgIEV4YW1wbGVzXG4gICAgICAgID09PT09PT09XG4gICAgICAgID4+PiBmcm9tIHN5bXB5IGltcG9ydCBTeW1ib2xcbiAgICAgICAgPj4+IGZyb20gc3ltcHkuYWJjIGltcG9ydCB4XG4gICAgICAgID4+PiB4LmFzc3VtcHRpb25zMFxuICAgICAgICB7J2NvbW11dGF0aXZlJzogVHJ1ZX1cbiAgICAgICAgPj4+IHggPSBTeW1ib2woXCJ4XCIsIHBvc2l0aXZlPVRydWUpXG4gICAgICAgID4+PiB4LmFzc3VtcHRpb25zMFxuICAgICAgICB7J2NvbW11dGF0aXZlJzogVHJ1ZSwgJ2NvbXBsZXgnOiBUcnVlLCAnZXh0ZW5kZWRfbmVnYXRpdmUnOiBGYWxzZSxcbiAgICAgICAgICdleHRlbmRlZF9ub25uZWdhdGl2ZSc6IFRydWUsICdleHRlbmRlZF9ub25wb3NpdGl2ZSc6IEZhbHNlLFxuICAgICAgICAgJ2V4dGVuZGVkX25vbnplcm8nOiBUcnVlLCAnZXh0ZW5kZWRfcG9zaXRpdmUnOiBUcnVlLCAnZXh0ZW5kZWRfcmVhbCc6XG4gICAgICAgICBUcnVlLCAnZmluaXRlJzogVHJ1ZSwgJ2hlcm1pdGlhbic6IFRydWUsICdpbWFnaW5hcnknOiBGYWxzZSxcbiAgICAgICAgICdpbmZpbml0ZSc6IEZhbHNlLCAnbmVnYXRpdmUnOiBGYWxzZSwgJ25vbm5lZ2F0aXZlJzogVHJ1ZSxcbiAgICAgICAgICdub25wb3NpdGl2ZSc6IEZhbHNlLCAnbm9uemVybyc6IFRydWUsICdwb3NpdGl2ZSc6IFRydWUsICdyZWFsJzpcbiAgICAgICAgIFRydWUsICd6ZXJvJzogRmFsc2V9XG4gICAgICAgICovXG4gICAgICAgIHJldHVybiB7fTtcbiAgICB9XG5cbiAgICBoYXNoS2V5KCkge1xuICAgICAgICAvKiBSZXR1cm4gYSB0dXBsZSBvZiBpbmZvcm1hdGlvbiBhYm91dCBzZWxmIHRoYXQgY2FuIGJlIHVzZWQgdG9cbiAgICAgICAgY29tcHV0ZSB0aGUgaGFzaC4gSWYgYSBjbGFzcyBkZWZpbmVzIGFkZGl0aW9uYWwgYXR0cmlidXRlcyxcbiAgICAgICAgbGlrZSBgYG5hbWVgYCBpbiBTeW1ib2wsIHRoZW4gdGhpcyBtZXRob2Qgc2hvdWxkIGJlIHVwZGF0ZWRcbiAgICAgICAgYWNjb3JkaW5nbHkgdG8gcmV0dXJuIHN1Y2ggcmVsZXZhbnQgYXR0cmlidXRlcy5cbiAgICAgICAgRGVmaW5pbmcgbW9yZSB0aGFuIF9oYXNoYWJsZV9jb250ZW50IGlzIG5lY2Vzc2FyeSBpZiBfX2VxX18gaGFzXG4gICAgICAgIGJlZW4gZGVmaW5lZCBieSBhIGNsYXNzLiBTZWUgbm90ZSBhYm91dCB0aGlzIGluIEJhc2ljLl9fZXFfXy4qL1xuXG4gICAgICAgIHJldHVybiB0aGlzLl9hcmdzO1xuICAgIH1cblxuICAgIHN0YXRpYyBjbXAoc2VsZjogYW55LCBvdGhlcjogYW55KTogYW55IHtcbiAgICAgICAgLypcbiAgICAgICAgUmV0dXJuIC0xLCAwLCAxIGlmIHRoZSBvYmplY3QgaXMgc21hbGxlciwgZXF1YWwsIG9yIGdyZWF0ZXIgdGhhbiBvdGhlci5cbiAgICAgICAgTm90IGluIHRoZSBtYXRoZW1hdGljYWwgc2Vuc2UuIElmIHRoZSBvYmplY3QgaXMgb2YgYSBkaWZmZXJlbnQgdHlwZVxuICAgICAgICBmcm9tIHRoZSBcIm90aGVyXCIgdGhlbiB0aGVpciBjbGFzc2VzIGFyZSBvcmRlcmVkIGFjY29yZGluZyB0b1xuICAgICAgICB0aGUgc29ydGVkX2NsYXNzZXMgbGlzdC5cbiAgICAgICAgRXhhbXBsZXNcbiAgICAgICAgPT09PT09PT1cbiAgICAgICAgPj4+IGZyb20gc3ltcHkuYWJjIGltcG9ydCB4LCB5XG4gICAgICAgID4+PiB4LmNvbXBhcmUoeSlcbiAgICAgICAgLTFcbiAgICAgICAgPj4+IHguY29tcGFyZSh4KVxuICAgICAgICAwXG4gICAgICAgID4+PiB5LmNvbXBhcmUoeClcbiAgICAgICAgMVxuICAgICAgICAqL1xuICAgICAgICBpZiAoc2VsZiA9PT0gb3RoZXIpIHtcbiAgICAgICAgICAgIHJldHVybiAwO1xuICAgICAgICB9XG4gICAgICAgIGNvbnN0IG4xID0gc2VsZi5jb25zdHJ1Y3Rvci5uYW1lO1xuICAgICAgICBjb25zdCBuMiA9IG90aGVyLmNvbnN0cnVjdG9yLm5hbWU7XG4gICAgICAgIGlmIChuMSAmJiBuMikge1xuICAgICAgICAgICAgcmV0dXJuIChuMSA+IG4yIGFzIHVua25vd24gYXMgbnVtYmVyKSAtIChuMSA8IG4yIGFzIHVua25vd24gYXMgbnVtYmVyKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IHN0ID0gc2VsZi5faGFzaGFibGVfY29udGVudCgpO1xuICAgICAgICBjb25zdCBvdCA9IG90aGVyLl9oYXNoYWJsZV9jb250ZW50KCk7XG4gICAgICAgIGlmIChzdCAmJiBvdCkge1xuICAgICAgICAgICAgcmV0dXJuIChzdC5sZW5ndGggPiBvdC5sZW5ndGggYXMgdW5rbm93biBhcyBudW1iZXIpIC0gKHN0Lmxlbmd0aCA8IG90Lmxlbmd0aCBhcyB1bmtub3duIGFzIG51bWJlcik7XG4gICAgICAgIH1cbiAgICAgICAgZm9yIChjb25zdCBlbGVtIG9mIFV0aWwuemlwKHN0LCBvdCkpIHtcbiAgICAgICAgICAgIGNvbnN0IGwgPSBlbGVtWzBdO1xuICAgICAgICAgICAgY29uc3QgciA9IGVsZW1bMV07XG4gICAgICAgICAgICAvLyAhISEgc2tpcHBpbmcgZnJvemVuc2V0IHN0dWZmXG4gICAgICAgICAgICBsZXQgYztcbiAgICAgICAgICAgIGlmIChsIGluc3RhbmNlb2YgQmFzaWMpIHtcbiAgICAgICAgICAgICAgICBjID0gbC5jbXAocik7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGMgPSAobCA+IHIgYXMgdW5rbm93biBhcyBudW1iZXIpIC0gKGwgPCByIGFzIHVua25vd24gYXMgbnVtYmVyKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChjKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGM7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIDA7XG4gICAgfVxuXG4gICAgX2NvbnN0cnVjdG9yX3Bvc3Rwcm9jZXNzb3JfbWFwcGluZzogUmVjb3JkPGFueSwgYW55PiA9IHt9O1xuXG4gICAgX2V4ZWNfY29uc3RydWN0b3JfcG9zdHByb2Nlc3NvcnMob2JqOiBhbnkpIHtcbiAgICAgICAgY29uc3QgY2xzbmFtZSA9IHRoaXMuY29uc3RydWN0b3IubmFtZTtcbiAgICAgICAgY29uc3QgcG9zdHByb2Nlc3NvcnMgPSBuZXcgSGFzaERpY3QoKTtcbiAgICAgICAgLy8gISEhIGZvciBsb29wIG5vdCBpbXBsZW1lbnRlZCAtIGNvbXBsaWNhdGVkIHRvIHJlY3JlYXRlXG4gICAgICAgIGZvciAoY29uc3QgZiBvZiBwb3N0cHJvY2Vzc29ycy5nZXQoY2xzbmFtZSwgW10pKSB7XG4gICAgICAgICAgICBvYmogPSBmKG9iaik7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIG9iajtcbiAgICB9XG5cbiAgICBfZXZhbF9zdWJzKG9sZDogYW55LCBfbmV3OiBhbnkpOiBhbnkge1xuICAgICAgICAvLyBkb24ndCBuZWVkIGFueSBvdGhlciB1dGlsaXRpZXMgdW50aWwgd2UgZG8gbW9yZSBjb21wbGljYXRlZCBzdWJzXG4gICAgICAgIHJldHVybiB1bmRlZmluZWQ7XG4gICAgfVxuXG4gICAgX2FyZXNhbWUoYTogYW55LCBiOiBhbnkpIHtcbiAgICAgICAgaWYgKGEuaXNfTnVtYmVyICYmIGIuaXNfTnVtYmVyKSB7XG4gICAgICAgICAgICByZXR1cm4gYSA9PT0gYiAmJiBhLmNvbnN0cnVjdG9yLm5hbWUgPT09IGIuY29uc3RydWN0b3IubmFtZTtcbiAgICAgICAgfVxuICAgICAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbmV3LWNhcFxuICAgICAgICBmb3IgKGNvbnN0IGl0ZW0gb2YgVXRpbC56aXAobmV3IHByZW9yZGVyX3RyYXZlcnNhbChhKS5hc0l0ZXIoKSwgbmV3IHByZW9yZGVyX3RyYXZlcnNhbChiKS5hc0l0ZXIoKSkpIHtcbiAgICAgICAgICAgIGNvbnN0IGkgPSBpdGVtWzBdO1xuICAgICAgICAgICAgY29uc3QgaiA9IGl0ZW1bMV07XG4gICAgICAgICAgICBpZiAoaSAhPT0gaiB8fCB0eXBlb2YgaSAhPT0gdHlwZW9mIGopIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuXG4gICAgc3VicyguLi5hcmdzOiBhbnkpIHtcbiAgICAgICAgbGV0IHNlcXVlbmNlO1xuICAgICAgICBpZiAoYXJncy5sZW5ndGggPT09IDEpIHtcbiAgICAgICAgICAgIHNlcXVlbmNlID0gYXJnc1swXTtcbiAgICAgICAgICAgIGlmIChzZXF1ZW5jZSBpbnN0YW5jZW9mIEhhc2hTZXQpIHtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoc2VxdWVuY2UgaW5zdGFuY2VvZiBIYXNoRGljdCkge1xuICAgICAgICAgICAgICAgIHNlcXVlbmNlID0gc2VxdWVuY2UuZW50cmllcygpO1xuICAgICAgICAgICAgfSBlbHNlIGlmIChTeW1ib2wuaXRlcmF0b3IgaW4gT2JqZWN0KHNlcXVlbmNlKSkge1xuICAgICAgICAgICAgICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBtYXgtbGVuXG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiV2hlbiBhIHNpbmdsZSBhcmd1bWVudCBpcyBwYXNzZWQgdG8gc3VicyBpdCBzaG91bGQgYmUgYSBkaWN0aW9uYXJ5IG9mIG9sZDogbmV3IHBhaXJzIG9yIGFuIGl0ZXJhYmxlIG9mIChvbGQsIG5ldykgdHVwbGVzXCIpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9IGVsc2UgaWYgKGFyZ3MubGVuZ3RoID09PSAyKSB7XG4gICAgICAgICAgICBzZXF1ZW5jZSA9IFthcmdzXTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcInN1YiBhY2NlcHRzIDEgb3IgMiBhcmdzXCIpO1xuICAgICAgICB9XG4gICAgICAgIGxldCBydiA9IHRoaXM7XG4gICAgICAgIGZvciAoY29uc3QgaXRlbSBvZiBzZXF1ZW5jZSkge1xuICAgICAgICAgICAgY29uc3Qgb2xkID0gaXRlbVswXTtcbiAgICAgICAgICAgIGNvbnN0IF9uZXcgPSBpdGVtWzFdO1xuICAgICAgICAgICAgcnYgPSBydi5fc3VicyhvbGQsIF9uZXcpO1xuICAgICAgICAgICAgaWYgKCEocnYgaW5zdGFuY2VvZiBCYXNpYykpIHtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gcnY7XG4gICAgfVxuXG4gICAgX3N1YnMob2xkOiBhbnksIF9uZXc6IGFueSkge1xuICAgICAgICBmdW5jdGlvbiBmYWxsYmFjayhjbHM6IGFueSwgb2xkOiBhbnksIF9uZXc6IGFueSkge1xuICAgICAgICAgICAgbGV0IGhpdCA9IGZhbHNlO1xuICAgICAgICAgICAgY29uc3QgYXJncyA9IGNscy5fYXJncztcbiAgICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgYXJncy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICAgIGxldCBhcmcgPSBhcmdzW2ldO1xuICAgICAgICAgICAgICAgIGlmICghKGFyZy5fZXZhbF9zdWJzKSkge1xuICAgICAgICAgICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgYXJnID0gYXJnLl9zdWJzKG9sZCwgX25ldyk7XG4gICAgICAgICAgICAgICAgaWYgKCEoY2xzLl9hcmVzYW1lKGFyZywgYXJnc1tpXSkpKSB7XG4gICAgICAgICAgICAgICAgICAgIGhpdCA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgIGFyZ3NbaV0gPSBhcmc7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKGhpdCkge1xuICAgICAgICAgICAgICAgIGxldCBydjtcbiAgICAgICAgICAgICAgICBpZiAoY2xzLmNvbnN0cnVjdG9yLm5hbWUgPT09IFwiTXVsXCIgfHwgY2xzLmNvbnN0cnVjdG9yLm5hbWUgPT09IFwiQWRkXCIpIHtcbiAgICAgICAgICAgICAgICAgICAgcnYgPSBuZXcgY2xzLmNvbnN0cnVjdG9yKHRydWUsIHRydWUsIC4uLmFyZ3MpO1xuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoY2xzLmNvbnN0cnVjdG9yLm5hbWUgPT09IFwiUG93XCIpIHtcbiAgICAgICAgICAgICAgICAgICAgcnYgPSBuZXcgY2xzLmNvbnN0cnVjdG9yKC4uLmFyZ3MpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICByZXR1cm4gcnY7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gY2xzO1xuICAgICAgICB9XG4gICAgICAgIGlmICh0aGlzLl9hcmVzYW1lKHRoaXMsIG9sZCkpIHtcbiAgICAgICAgICAgIHJldHVybiBfbmV3O1xuICAgICAgICB9XG5cbiAgICAgICAgbGV0IHJ2ID0gdGhpcy5fZXZhbF9zdWJzKG9sZCwgX25ldyk7XG4gICAgICAgIGlmICh0eXBlb2YgcnYgPT09IFwidW5kZWZpbmVkXCIpIHtcbiAgICAgICAgICAgIHJ2ID0gZmFsbGJhY2sodGhpcywgb2xkLCBfbmV3KTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gcnY7XG4gICAgfVxufTtcblxuLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5ldy1jYXBcbmNvbnN0IEJhc2ljID0gX0Jhc2ljKE9iamVjdCk7XG5NYW5hZ2VkUHJvcGVydGllcy5yZWdpc3RlcihCYXNpYyk7XG5cbmNvbnN0IEF0b20gPSAoc3VwZXJjbGFzczogYW55KSA9PiBjbGFzcyBBdG9tIGV4dGVuZHMgbWl4KGJhc2UpLndpdGgoX0Jhc2ljKSB7XG4gICAgLypcbiAgICBBIHBhcmVudCBjbGFzcyBmb3IgYXRvbWljIHRoaW5ncy4gQW4gYXRvbSBpcyBhbiBleHByZXNzaW9uIHdpdGggbm8gc3ViZXhwcmVzc2lvbnMuXG4gICAgRXhhbXBsZXNcbiAgICA9PT09PT09PVxuICAgIFN5bWJvbCwgTnVtYmVyLCBSYXRpb25hbCwgSW50ZWdlciwgLi4uXG4gICAgQnV0IG5vdDogQWRkLCBNdWwsIFBvdywgLi4uXG4gICAgKi9cblxuICAgIHN0YXRpYyBpc19BdG9tID0gdHJ1ZTtcblxuICAgIF9fc2xvdHNfXzogYW55W10gPSBbXTtcblxuICAgIG1hdGNoZXMoZXhwcjogYW55LCByZXBsX2RpY3Q6IEhhc2hEaWN0ID0gdW5kZWZpbmVkLCBvbGQ6IGFueSA9IGZhbHNlKSB7XG4gICAgICAgIGlmICh0aGlzID09PSBleHByKSB7XG4gICAgICAgICAgICBpZiAodHlwZW9mIHJlcGxfZGljdCA9PT0gXCJ1bmRlZmluZWRcIikge1xuICAgICAgICAgICAgICAgIHJldHVybiBuZXcgSGFzaERpY3QoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiByZXBsX2RpY3QuY29weSgpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgeHJlcGxhY2UocnVsZTogYW55LCBoYWNrMjogYW55ID0gZmFsc2UpIHtcbiAgICAgICAgcmV0dXJuIHJ1bGUuZ2V0KHRoaXMpO1xuICAgIH1cblxuICAgIGRvaXQoLi4uaGludHM6IGFueSkge1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9XG59O1xuXG4vLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbmV3LWNhcFxuY29uc3QgX0F0b21pY0V4cHIgPSBBdG9tKE9iamVjdCk7XG5NYW5hZ2VkUHJvcGVydGllcy5yZWdpc3RlcihfQXRvbWljRXhwcik7XG5cbmV4cG9ydCB7X0Jhc2ljLCBCYXNpYywgQXRvbSwgX0F0b21pY0V4cHJ9O1xuIiwgIi8qXG5Ob3RhYmxlIGNoYW5nZXMgbWFkZSAoYW5kIG5vdGVzKVxuLSBSZXdvcmtlZCBTaW5nbGV0b24gdG8gdXNlIGEgcmVnaXN0cnkgc3lzdGVtIHVzaW5nIGEgc3RhdGljIGRpY3Rpb25hcnlcbi0gUmVnaXN0ZXJzIG51bWJlciBvYmplY3RzIGFzIHRoZXkgYXJlIHVzZWRcbiovXG5cbi8qIGVzbGludC1kaXNhYmxlIG5ldy1jYXAgKi9cbmltcG9ydCB7TWFuYWdlZFByb3BlcnRpZXN9IGZyb20gXCIuL2Fzc3VtcHRpb25zLmpzXCI7XG5cbmNsYXNzIFNpbmdsZXRvbiB7XG4gICAgc3RhdGljIHJlZ2lzdHJ5OiBSZWNvcmQ8YW55LCBhbnk+ID0ge307XG5cbiAgICBzdGF0aWMgcmVnaXN0ZXIobmFtZTogc3RyaW5nLCBjbHM6IGFueSkge1xuICAgICAgICBNYW5hZ2VkUHJvcGVydGllcy5yZWdpc3RlcihjbHMpO1xuICAgICAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbmV3LWNhcFxuICAgICAgICBTaW5nbGV0b24ucmVnaXN0cnlbbmFtZV0gPSBuZXcgY2xzKCk7XG4gICAgfVxufVxuXG5jb25zdCBTOiBhbnkgPSBuZXcgU2luZ2xldG9uKCk7XG5cblxuZXhwb3J0IHtTLCBTaW5nbGV0b259O1xuIiwgIi8qXG5OZXcgY2xhc3MgZ2xvYmFsXG5IZWxwcyB0byBhdm9pZCBjeWNsaWNhbCBpbXBvcnRzIGJ5IHN0b3JpbmcgY29uc3RydWN0b3JzIGFuZCBmdW5jdGlvbnMgd2hpY2hcbmNhbiBiZSBhY2Nlc3NlZCBhbnl3aGVyZVxuXG5Ob3RlOiBzdGF0aWMgbmV3IG1ldGhvZHMgYXJlIGNyZWF0ZWQgaW4gdGhlIGNsYXNzZXMgdG8gYmUgcmVnaXN0ZXJlZCwgYW5kIHRob3NlXG5tZXRob2RzIGFyZSBhZGRlZCBoZXJlXG4qL1xuXG5leHBvcnQgY2xhc3MgR2xvYmFsIHtcbiAgICBzdGF0aWMgY29uc3RydWN0b3JzOiBSZWNvcmQ8c3RyaW5nLCBhbnk+ID0ge307XG4gICAgc3RhdGljIGZ1bmN0aW9uczogUmVjb3JkPHN0cmluZywgYW55PiA9IHt9O1xuXG4gICAgc3RhdGljIGNvbnN0cnVjdChjbGFzc25hbWU6IHN0cmluZywgLi4uYXJnczogYW55W10pIHtcbiAgICAgICAgY29uc3QgY29uc3RydWN0b3IgPSBHbG9iYWwuY29uc3RydWN0b3JzW2NsYXNzbmFtZV07XG4gICAgICAgIHJldHVybiBjb25zdHJ1Y3RvciguLi5hcmdzKTtcbiAgICB9XG5cbiAgICBzdGF0aWMgcmVnaXN0ZXIoY2xzOiBzdHJpbmcsIGNvbnN0cnVjdG9yOiBhbnkpIHtcbiAgICAgICAgR2xvYmFsLmNvbnN0cnVjdG9yc1tjbHNdID0gY29uc3RydWN0b3I7XG4gICAgfVxuXG4gICAgc3RhdGljIHJlZ2lzdGVyZnVuYyhuYW1lOiBzdHJpbmcsIGZ1bmM6IGFueSkge1xuICAgICAgICBHbG9iYWwuZnVuY3Rpb25zW25hbWVdID0gZnVuYztcbiAgICB9XG5cbiAgICBzdGF0aWMgZXZhbGZ1bmMobmFtZTogc3RyaW5nLCAuLi5hcmdzOiBhbnlbXSkge1xuICAgICAgICBjb25zdCBmdW5jID0gR2xvYmFsLmZ1bmN0aW9uc1tuYW1lXTtcbiAgICAgICAgcmV0dXJuIGZ1bmMoLi4uYXJncyk7XG4gICAgfVxufVxuIiwgIi8qIGVzbGludC1kaXNhYmxlIG5vLXVudXNlZC12YXJzICovXG4vKiBNaXNjZWxsYW5lb3VzIHN0dWZmIHRoYXQgZG9lcyBub3QgcmVhbGx5IGZpdCBhbnl3aGVyZSBlbHNlICovXG5cbi8qXG5cbk5vdGFibGUgY2hhbmdlcyBtYWRlIChXQiBhbmQgR00pOlxuLSBGaWxsZGVkZW50IGFuZCBhc19pbnQgYXJlIHJld3JpdHRlbiB0byBpbmNsdWRlIHRoZSBzYW1lIGZ1bmN0aW9uYWxpdHkgd2l0aFxuICBkaWZmZXJlbnQgbWV0aG9kb2xvZ3lcbi0gTWFueSBmdW5jdGlvbnMgYXJlIG5vdCB5ZXQgaW1wbGVtZW50ZWQgYW5kIHdpbGwgYmUgY29tcGxldGVkIGFzIHdlIGZpbmQgdGhlbVxuICBuZWNlc3Nhcnlcbn1cblxuKi9cblxuXG5jbGFzcyBVbmRlY2lkYWJsZSBleHRlbmRzIEVycm9yIHtcbiAgICAvLyBhbiBlcnJvciB0byBiZSByYWlzZWQgd2hlbiBhIGRlY2lzaW9uIGNhbm5vdCBiZSBtYWRlIGRlZmluaXRpdmVseVxuICAgIC8vIHdoZXJlIGEgZGVmaW5pdGl2ZSBhbnN3ZXIgaXMgbmVlZGVkXG59XG5cbi8qXG5mdW5jdGlvbiBmaWxsZGVkZW50KHM6IHN0cmluZywgdzogbnVtYmVyID0gNzApOiBzdHJpbmcge1xuXG4gICAgLy8gcmVtb3ZlIGVtcHR5IGJsYW5rIGxpbmVzXG4gICAgbGV0IHN0ciA9IHMucmVwbGFjZSgvXlxccypcXG4vZ20sIFwiXCIpO1xuICAgIC8vIGRlZGVudFxuICAgIHN0ciA9IGRlZGVudChzdHIpO1xuICAgIC8vIHdyYXBcbiAgICBjb25zdCBhcnIgPSBzdHIuc3BsaXQoXCIgXCIpO1xuICAgIGxldCByZXMgPSBcIlwiO1xuICAgIGxldCBsaW5lbGVuZ3RoID0gMDtcbiAgICBmb3IgKGNvbnN0IHdvcmQgb2YgYXJyKSB7XG4gICAgICAgIGlmIChsaW5lbGVuZ3RoIDw9IHcgKyB3b3JkLmxlbmd0aCkge1xuICAgICAgICAgICAgcmVzICs9IHdvcmQ7XG4gICAgICAgICAgICBsaW5lbGVuZ3RoICs9IHdvcmQubGVuZ3RoO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmVzICs9IFwiXFxuXCI7XG4gICAgICAgICAgICBsaW5lbGVuZ3RoID0gMDtcbiAgICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gcmVzO1xufVxuKi9cblxuXG5mdW5jdGlvbiBzdHJsaW5lcyhzOiBzdHJpbmcsIGM6IG51bWJlciA9IDY0LCBzaG9ydD1mYWxzZSkge1xuICAgIHRocm93IG5ldyBFcnJvcihcInN0cmxpbmVzIGlzIG5vdCB5ZXQgaW1wbGVtZW50ZWRcIik7XG59XG5cbmZ1bmN0aW9uIHJhd2xpbmVzKHM6IHN0cmluZykge1xuICAgIHRocm93IG5ldyBFcnJvcihcInJhd2xpbmVzIGlzIG5vdCB5ZXQgaW1wbGVtZW50ZWRcIik7XG59XG5cbmZ1bmN0aW9uIGRlYnVnX2RlY29yYXRvcihmdW5jOiBhbnkpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoXCJkZWJ1Z19kZWNvcmF0b3IgaXMgbm90IHlldCBpbXBsZW1lbnRlZFwiKTtcbn1cblxuZnVuY3Rpb24gZGVidWcoLi4uYXJnczogYW55KSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKFwiZGVidWcgaXMgbm90IHlldCBpbXBsZW1lbnRlZFwiKTtcbn1cblxuZnVuY3Rpb24gZmluZF9leGVjdXRhYmxlKGV4ZWN1dGFibGU6IGFueSwgcGF0aDogYW55PXVuZGVmaW5lZCkge1xuICAgIHRocm93IG5ldyBFcnJvcihcImZpbmRfZXhlY3V0YWJsZSBpcyBub3QgeWV0IGltcGxlbWVudGVkXCIpO1xufVxuXG5mdW5jdGlvbiBmdW5jX25hbWUoeDogYW55LCBzaG9ydDogYW55PWZhbHNlKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKFwiZnVuY19uYW1lIGlzIG5vdCB5ZXQgaW1wbGVtZW50ZWRcIik7XG59XG5cbmZ1bmN0aW9uIF9yZXBsYWNlKHJlcHM6IGFueSkge1xuICAgIHRocm93IG5ldyBFcnJvcihcIl9yZXBsYWNlIGlzIG5vdCB5ZXQgaW1wbGVtZW50ZWRcIik7XG59XG5cbmZ1bmN0aW9uIHJlcGxhY2Uoc3RyOiBzdHJpbmcsIC4uLnJlcHM6IGFueSkge1xuICAgIHRocm93IG5ldyBFcnJvcihcInJlcGxhY2UgaXMgbm90IHlldCBpbXBsZW1lbnRlZFwiKTtcbn1cblxuZnVuY3Rpb24gdHJhbnNsYXRlKHM6IGFueSwgYTogYW55LCBiOiBhbnk9dW5kZWZpbmVkLCBjOiBhbnk9dW5kZWZpbmVkKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKFwidHJhbnNsYXRlIGlzIG5vdCB5ZXQgaW1wbGVtZW50ZWRcIik7XG59XG5cbmZ1bmN0aW9uIG9yZGluYWwobnVtOiBhbnkpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoXCJvcmRpbmFsIGlzIG5vdCB5ZXQgaW1wbGVtZW50ZWRcIik7XG59XG5cbmZ1bmN0aW9uIGFzX2ludChuOiBhbnkpIHtcbiAgICBpZiAoIU51bWJlci5pc0ludGVnZXIobikpIHsgLy8gISEhIC0gbWlnaHQgbmVlZCB0byB1cGRhdGUgdGhpc1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IobiArIFwiIGlzIG5vdCBpbnRcIik7XG4gICAgfVxuICAgIHJldHVybiBuO1xufVxuXG5leHBvcnQge2FzX2ludH07XG4iLCAiLypcbk5vdGFibGUgY2hhbmdlcyBtYWRlIChhbmQgbm90ZXMpOlxuLSBWZXJ5IGJhcmVib25lcyB2ZXJzaW9ucyBvZiBFeHByIGltcGxlbWVudGVkIHNvIGZhciAtIHZlcnkgZmV3IHV0aWwgbWV0aG9kc1xuLSBOb3RlIHRoYXQgZXhwcmVzc2lvbiB1c2VzIGdsb2JhbC50cyB0byBjb25zdHJ1Y3QgYWRkIGFuZCBtdWwgb2JqZWN0cywgd2hpY2hcbiAgYXZvaWRzIGN5Y2xpY2FsIGltcG9ydHNcbiovXG5cbmltcG9ydCB7X0Jhc2ljLCBBdG9tfSBmcm9tIFwiLi9iYXNpYy5qc1wiO1xuaW1wb3J0IHtIYXNoU2V0LCBtaXh9IGZyb20gXCIuL3V0aWxpdHkuanNcIjtcbmltcG9ydCB7TWFuYWdlZFByb3BlcnRpZXN9IGZyb20gXCIuL2Fzc3VtcHRpb25zLmpzXCI7XG5pbXBvcnQge1N9IGZyb20gXCIuL3NpbmdsZXRvbi5qc1wiO1xuaW1wb3J0IHtHbG9iYWx9IGZyb20gXCIuL2dsb2JhbC5qc1wiO1xuaW1wb3J0IHthc19pbnR9IGZyb20gXCIuLi91dGlsaXRpZXMvbWlzYy5qc1wiO1xuXG5cbmNvbnN0IEV4cHIgPSAoc3VwZXJjbGFzczogYW55KSA9PiBjbGFzcyBFeHByIGV4dGVuZHMgbWl4KHN1cGVyY2xhc3MpLndpdGgoX0Jhc2ljKSB7XG4gICAgLypcbiAgICBCYXNlIGNsYXNzIGZvciBhbGdlYnJhaWMgZXhwcmVzc2lvbnMuXG4gICAgRXhwbGFuYXRpb25cbiAgICA9PT09PT09PT09PVxuICAgIEV2ZXJ5dGhpbmcgdGhhdCByZXF1aXJlcyBhcml0aG1ldGljIG9wZXJhdGlvbnMgdG8gYmUgZGVmaW5lZFxuICAgIHNob3VsZCBzdWJjbGFzcyB0aGlzIGNsYXNzLCBpbnN0ZWFkIG9mIEJhc2ljICh3aGljaCBzaG91bGQgYmVcbiAgICB1c2VkIG9ubHkgZm9yIGFyZ3VtZW50IHN0b3JhZ2UgYW5kIGV4cHJlc3Npb24gbWFuaXB1bGF0aW9uLCBpLmUuXG4gICAgcGF0dGVybiBtYXRjaGluZywgc3Vic3RpdHV0aW9ucywgZXRjKS5cbiAgICBJZiB5b3Ugd2FudCB0byBvdmVycmlkZSB0aGUgY29tcGFyaXNvbnMgb2YgZXhwcmVzc2lvbnM6XG4gICAgU2hvdWxkIHVzZSBfZXZhbF9pc19nZSBmb3IgaW5lcXVhbGl0eSwgb3IgX2V2YWxfaXNfZXEsIHdpdGggbXVsdGlwbGUgZGlzcGF0Y2guXG4gICAgX2V2YWxfaXNfZ2UgcmV0dXJuIHRydWUgaWYgeCA+PSB5LCBmYWxzZSBpZiB4IDwgeSwgYW5kIE5vbmUgaWYgdGhlIHR3byB0eXBlc1xuICAgIGFyZSBub3QgY29tcGFyYWJsZSBvciB0aGUgY29tcGFyaXNvbiBpcyBpbmRldGVybWluYXRlXG4gICAgU2VlIEFsc29cbiAgICA9PT09PT09PVxuICAgIHN5bXB5LmNvcmUuYmFzaWMuQmFzaWNcbiAgICAqL1xuXG4gICAgX19zbG90c19fOiBhbnlbXSA9IFtdO1xuICAgIHN0YXRpYyBpc19zY2FsYXIgPSB0cnVlO1xuXG4gICAgY29uc3RydWN0b3IoLi4uYXJnczogYW55KSB7XG4gICAgICAgIHN1cGVyKC4uLmFyZ3MpO1xuICAgIH1cblxuICAgIGFzX2Jhc2VfZXhwKCkge1xuICAgICAgICByZXR1cm4gW3RoaXMsIFMuT25lXTtcbiAgICB9XG5cbiAgICBhc19jb2VmZl9NdWwocmF0aW9uYWw6IGJvb2xlYW4gPSBmYWxzZSkge1xuICAgICAgICByZXR1cm4gW1MuT25lLCB0aGlzXTtcbiAgICB9XG5cbiAgICBhc19jb2VmZl9BZGQoKSB7XG4gICAgICAgIHJldHVybiBbUy5aZXJvLCB0aGlzXTtcbiAgICB9XG5cbiAgICBfX2FkZF9fKG90aGVyOiBhbnkpIHtcbiAgICAgICAgcmV0dXJuIEdsb2JhbC5jb25zdHJ1Y3QoXCJBZGRcIiwgdHJ1ZSwgdHJ1ZSwgdGhpcywgb3RoZXIpO1xuICAgIH1cblxuICAgIF9fcmFkZF9fKG90aGVyOiBhbnkpIHtcbiAgICAgICAgcmV0dXJuIEdsb2JhbC5jb25zdHJ1Y3QoXCJBZGRcIiwgdHJ1ZSwgdHJ1ZSwgb3RoZXIsIHRoaXMpO1xuICAgIH1cblxuICAgIF9fc3ViX18ob3RoZXI6IGFueSkge1xuICAgICAgICByZXR1cm4gR2xvYmFsLmNvbnN0cnVjdChcIkFkZFwiLCB0cnVlLCB0cnVlLCB0aGlzLCBvdGhlci5fX211bF9fKFMuTmVnYXRpdmVPbmUpKTtcbiAgICB9XG5cbiAgICBfX3JzdWJfXyhvdGhlcjogYW55KSB7XG4gICAgICAgIHJldHVybiBHbG9iYWwuY29uc3RydWN0KFwiQWRkXCIsIHRydWUsIHRydWUsIG90aGVyLCB0aGlzLl9fbXVsX18oUy5OZWdhdGl2ZU9uZSkpO1xuICAgIH1cblxuICAgIF9fbXVsX18ob3RoZXI6IGFueSkge1xuICAgICAgICByZXR1cm4gR2xvYmFsLmNvbnN0cnVjdChcIk11bFwiLCB0cnVlLCB0cnVlLCB0aGlzLCBvdGhlcik7XG4gICAgfVxuXG4gICAgX19ybXVsX18ob3RoZXI6IGFueSkge1xuICAgICAgICByZXR1cm4gR2xvYmFsLmNvbnN0cnVjdChcIk11bFwiLCB0cnVlLCB0cnVlLCBvdGhlciwgdGhpcyk7XG4gICAgfVxuXG4gICAgX3BvdyhvdGhlcjogYW55KSB7XG4gICAgICAgIHJldHVybiBHbG9iYWwuY29uc3RydWN0KFwiUG93XCIsIHRoaXMsIG90aGVyKTtcbiAgICB9XG5cbiAgICBfX3Bvd19fKG90aGVyOiBhbnksIG1vZDogYm9vbGVhbiA9IHVuZGVmaW5lZCkge1xuICAgICAgICBpZiAodHlwZW9mIG1vZCA9PT0gXCJ1bmRlZmluZWRcIikge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX3BvdyhvdGhlcik7XG4gICAgICAgIH1cbiAgICAgICAgbGV0IF9zZWxmOyBsZXQgX290aGVyOyBsZXQgX21vZDtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIFtfc2VsZiwgX290aGVyLCBfbW9kXSA9IFthc19pbnQodGhpcyksIGFzX2ludChvdGhlciksIGFzX2ludChtb2QpXTtcbiAgICAgICAgICAgIGlmIChvdGhlciA+PSAwKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIEdsb2JhbC5jb25zdHJ1Y3QoXCJfTnVtYmVyX1wiLCBfc2VsZioqX290aGVyICUgX21vZCk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHJldHVybiBHbG9iYWwuY29uc3RydWN0KFwiX051bWJlcl9cIiwgR2xvYmFsLmV2YWxmdW5jKFwibW9kX2ludmVyc2VcIiwgKF9zZWxmICoqIChfb3RoZXIpICUgKG1vZCBhcyBhbnkpKSwgbW9kKSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0gY2F0Y2ggKEVycm9yKSB7XG4gICAgICAgICAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tdW51c2VkLXZhcnNcbiAgICAgICAgICAgIGNvbnN0IHBvd2VyID0gdGhpcy5fcG93KF9vdGhlcik7XG4gICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgIC8vIHJldHVybiBwb3dlci5fX21vZF9fKG1vZCk7XG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwibW9kIGNsYXNzIG5vdCB5ZXQgaW1wbGVtZW50ZWRcIik7XG4gICAgICAgICAgICB9IGNhdGNoIChFcnJvcikge1xuICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcIm5vdCBpbXBsZW1lbnRlZFwiKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgIF9fcnBvd19fKG90aGVyOiBhbnkpIHtcbiAgICAgICAgcmV0dXJuIEdsb2JhbC5jb25zdHJ1Y3QoXCJQb3dcIiwgb3RoZXIsIHRoaXMpO1xuICAgIH1cblxuICAgIF9fdHJ1ZWRpdl9fKG90aGVyOiBhbnkpIHtcbiAgICAgICAgY29uc3QgZGVub20gPSBHbG9iYWwuY29uc3RydWN0KFwiUG93XCIsIG90aGVyLCBTLk5lZ2F0aXZlT25lKTtcbiAgICAgICAgaWYgKHRoaXMgPT09IFMuT25lKSB7XG4gICAgICAgICAgICByZXR1cm4gZGVub207XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gR2xvYmFsLmNvbnN0cnVjdChcIk11bFwiLCB0cnVlLCB0cnVlLCB0aGlzLCBkZW5vbSk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBfX3J0cnVlZGl2X18ob3RoZXI6IGFueSkge1xuICAgICAgICBjb25zdCBkZW5vbSA9IEdsb2JhbC5jb25zdHJ1Y3QoXCJQb3dcIiwgdGhpcywgUy5OZWdhdGl2ZU9uZSk7XG4gICAgICAgIGlmIChvdGhlciA9PT0gUy5PbmUpIHtcbiAgICAgICAgICAgIHJldHVybiBkZW5vbTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiBHbG9iYWwuY29uc3RydWN0KFwiTXVsXCIsIHRydWUsIHRydWUsIG90aGVyLCBkZW5vbSk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBfZXZhbF9wb3dlcihvdGhlcjogYW55KTogYW55IHtcbiAgICAgICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgICB9XG5cbiAgICBhcmdzX2NuYyhjc2V0OiBib29sZWFuID0gZmFsc2UsIHdhcm46IGJvb2xlYW4gPSB0cnVlLCBzcGxpdF8xOiBib29sZWFuID0gdHJ1ZSkge1xuICAgICAgICBsZXQgYXJncztcbiAgICAgICAgaWYgKCh0aGlzLmNvbnN0cnVjdG9yIGFzIGFueSkuaXNfTXVsKSB7XG4gICAgICAgICAgICBhcmdzID0gdGhpcy5fYXJncztcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGFyZ3MgPSBbdGhpc107XG4gICAgICAgIH1cbiAgICAgICAgbGV0IGM7IGxldCBuYztcbiAgICAgICAgbGV0IGxvb3AyID0gdHJ1ZTtcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBhcmdzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBjb25zdCBtaSA9IGFyZ3NbaV07XG4gICAgICAgICAgICBpZiAoIShtaS5pc19jb21tdXRhdGl2ZSkpIHtcbiAgICAgICAgICAgICAgICBjID0gYXJncy5zbGljZSgwLCBpKTtcbiAgICAgICAgICAgICAgICBuYyA9IGFyZ3Muc2xpY2UoaSk7XG4gICAgICAgICAgICAgICAgbG9vcDIgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSBpZiAobG9vcDIpIHtcbiAgICAgICAgICAgIGMgPSBhcmdzO1xuICAgICAgICAgICAgbmMgPSBbXTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChjICYmIHNwbGl0XzEgJiZcbiAgICAgICAgICAgIGNbMF0uaXNfTnVtYmVyICYmXG4gICAgICAgICAgICBjWzBdLmlzX2V4dGVuZGVkX25lZ2F0aXZlICYmXG4gICAgICAgICAgICBjWzBdICE9PSBTLk5lZ2F0aXZlT25lKSB7XG4gICAgICAgICAgICBjLnNwbGljZSgwLCAxLCBTLk5lZ2F0aXZlT25lLCBjWzBdLl9fbXVsX18oUy5OZWdhdGl2ZU9uZSkpO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGNzZXQpIHtcbiAgICAgICAgICAgIGNvbnN0IGNsZW4gPSBjLmxlbmd0aDtcbiAgICAgICAgICAgIGNvbnN0IGNzZXQgPSBuZXcgSGFzaFNldCgpO1xuICAgICAgICAgICAgY3NldC5hZGRBcnIoYyk7XG4gICAgICAgICAgICBpZiAoY2xlbiAmJiB3YXJuICYmIGNzZXQuc2l6ZSAhPT0gY2xlbikge1xuICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcInJlcGVhdGVkIGNvbW11dGF0aXZlIGFyZ3NcIik7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIFtjLCBuY107XG4gICAgfVxufTtcblxuLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5ldy1jYXBcbmNvbnN0IF9FeHByID0gRXhwcihPYmplY3QpO1xuTWFuYWdlZFByb3BlcnRpZXMucmVnaXN0ZXIoX0V4cHIpO1xuXG5jb25zdCBBdG9taWNFeHByID0gKHN1cGVyY2xhc3M6IGFueSkgPT4gY2xhc3MgQXRvbWljRXhwciBleHRlbmRzIG1peChzdXBlcmNsYXNzKS53aXRoKEF0b20sIEV4cHIpIHtcbiAgICAvKlxuICAgIEEgcGFyZW50IGNsYXNzIGZvciBvYmplY3Qgd2hpY2ggYXJlIGJvdGggYXRvbXMgYW5kIEV4cHJzLlxuICAgIEZvciBleGFtcGxlOiBTeW1ib2wsIE51bWJlciwgUmF0aW9uYWwsIEludGVnZXIsIC4uLlxuICAgIEJ1dCBub3Q6IEFkZCwgTXVsLCBQb3csIC4uLlxuICAgICovXG4gICAgc3RhdGljIGlzX251bWJlciA9IGZhbHNlO1xuICAgIHN0YXRpYyBpc19BdG9tID0gdHJ1ZTtcblxuICAgIF9fc2xvdHNfXzogYW55W10gPSBbXTtcblxuICAgIGNvbnN0cnVjdG9yKC4uLmFyZ3M6IGFueSkge1xuICAgICAgICBzdXBlcihBdG9taWNFeHByLCBhcmdzKTtcbiAgICB9XG5cbiAgICBfZXZhbF9pc19wb2x5bm9taWFsKHN5bXM6IGFueSkge1xuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG5cbiAgICBfZXZhbF9pc19yYXRpb25hbF9mdW5jdGlvbihzeW1zOiBhbnkpIHtcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuXG4gICAgZXZhbF9pc19hbGdlYnJhaWNfZXhwcihzeW1zOiBhbnkpIHtcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuXG4gICAgX2V2YWxfbnNlcmllcyh4OiBhbnksIG46IGFueSwgbG9neDogYW55LCBjZG9yOiBhbnkgPSAwKSB7XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cbn07XG5cbi8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBuZXctY2FwXG5jb25zdCBfQXRvbWljRXhwciA9IEF0b21pY0V4cHIoT2JqZWN0KTtcbk1hbmFnZWRQcm9wZXJ0aWVzLnJlZ2lzdGVyKF9BdG9taWNFeHByKTtcblxuZXhwb3J0IHtBdG9taWNFeHByLCBfQXRvbWljRXhwciwgRXhwciwgX0V4cHJ9O1xuIiwgIi8qXG5Ob3RhYmxlIGNoYW5nZXMgbWFkZTpcbi0gRGljdGlvbmFyeSBzeXN0ZW0gcmV3b3JrZWQgYXMgY2xhc3MgcHJvcGVydGllc1xuKi9cblxuY2xhc3MgX2dsb2JhbF9wYXJhbWV0ZXJzIHtcbiAgICAvKlxuICAgIFRocmVhZC1sb2NhbCBnbG9iYWwgcGFyYW1ldGVycy5cbiAgICBFeHBsYW5hdGlvblxuICAgID09PT09PT09PT09XG4gICAgVGhpcyBjbGFzcyBnZW5lcmF0ZXMgdGhyZWFkLWxvY2FsIGNvbnRhaW5lciBmb3IgU3ltUHkncyBnbG9iYWwgcGFyYW1ldGVycy5cbiAgICBFdmVyeSBnbG9iYWwgcGFyYW1ldGVycyBtdXN0IGJlIHBhc3NlZCBhcyBrZXl3b3JkIGFyZ3VtZW50IHdoZW4gZ2VuZXJhdGluZ1xuICAgIGl0cyBpbnN0YW5jZS5cbiAgICBBIHZhcmlhYmxlLCBgZ2xvYmFsX3BhcmFtZXRlcnNgIGlzIHByb3ZpZGVkIGFzIGRlZmF1bHQgaW5zdGFuY2UgZm9yIHRoaXMgY2xhc3MuXG4gICAgV0FSTklORyEgQWx0aG91Z2ggdGhlIGdsb2JhbCBwYXJhbWV0ZXJzIGFyZSB0aHJlYWQtbG9jYWwsIFN5bVB5J3MgY2FjaGUgaXMgbm90XG4gICAgYnkgbm93LlxuICAgIFRoaXMgbWF5IGxlYWQgdG8gdW5kZXNpcmVkIHJlc3VsdCBpbiBtdWx0aS10aHJlYWRpbmcgb3BlcmF0aW9ucy5cbiAgICBFeGFtcGxlc1xuICAgID09PT09PT09XG4gICAgPj4+IGZyb20gc3ltcHkuYWJjIGltcG9ydCB4XG4gICAgPj4+IGZyb20gc3ltcHkuY29yZS5jYWNoZSBpbXBvcnQgY2xlYXJfY2FjaGVcbiAgICA+Pj4gZnJvbSBzeW1weS5jb3JlLnBhcmFtZXRlcnMgaW1wb3J0IGdsb2JhbF9wYXJhbWV0ZXJzIGFzIGdwXG4gICAgPj4+IGdwLmV2YWx1YXRlXG4gICAgVHJ1ZVxuICAgID4+PiB4K3hcbiAgICAyKnhcbiAgICA+Pj4gbG9nID0gW11cbiAgICA+Pj4gZGVmIGYoKTpcbiAgICAuLi4gICAgIGNsZWFyX2NhY2hlKClcbiAgICAuLi4gICAgIGdwLmV2YWx1YXRlID0gRmFsc2VcbiAgICAuLi4gICAgIGxvZy5hcHBlbmQoeCt4KVxuICAgIC4uLiAgICAgY2xlYXJfY2FjaGUoKVxuICAgID4+PiBpbXBvcnQgdGhyZWFkaW5nXG4gICAgPj4+IHRocmVhZCA9IHRocmVhZGluZy5UaHJlYWQodGFyZ2V0PWYpXG4gICAgPj4+IHRocmVhZC5zdGFydCgpXG4gICAgPj4+IHRocmVhZC5qb2luKClcbiAgICA+Pj4gcHJpbnQobG9nKVxuICAgIFt4ICsgeF1cbiAgICA+Pj4gZ3AuZXZhbHVhdGVcbiAgICBUcnVlXG4gICAgPj4+IHgreFxuICAgIDIqeFxuICAgIFJlZmVyZW5jZXNcbiAgICA9PT09PT09PT09XG4gICAgLi4gWzFdIGh0dHBzOi8vZG9jcy5weXRob24ub3JnLzMvbGlicmFyeS90aHJlYWRpbmcuaHRtbFxuICAgICovXG5cbiAgICBkaWN0OiBSZWNvcmQ8YW55LCBhbnk+ID0ge307XG5cbiAgICBldmFsdWF0ZTtcbiAgICBkaXN0cmlidXRlO1xuICAgIGV4cF9pc19wb3c7XG5cbiAgICBjb25zdHJ1Y3RvcihkaWN0OiBSZWNvcmQ8c3RyaW5nLCBhbnk+KSB7XG4gICAgICAgIHRoaXMuZGljdCA9IGRpY3Q7XG4gICAgICAgIHRoaXMuZXZhbHVhdGUgPSB0aGlzLmRpY3RbXCJldmFsdWF0ZVwiXTtcbiAgICAgICAgdGhpcy5kaXN0cmlidXRlID0gdGhpcy5kaWN0W1wiZGlzdHJpYnV0ZVwiXTtcbiAgICAgICAgdGhpcy5leHBfaXNfcG93ID0gdGhpcy5kaWN0W1wiZXhwX2lzX3Bvd1wiXTtcbiAgICB9XG59XG5cbmNvbnN0IGdsb2JhbF9wYXJhbWV0ZXJzID0gbmV3IF9nbG9iYWxfcGFyYW1ldGVycyh7XCJldmFsdWF0ZVwiOiB0cnVlLCBcImRpc3RyaWJ1dGVcIjogdHJ1ZSwgXCJleHBfaXNfcG93XCI6IGZhbHNlfSk7XG5cbmV4cG9ydCB7Z2xvYmFsX3BhcmFtZXRlcnN9O1xuIiwgIi8qXG5Ob3RhYmxlIGNoYW5nZXMgbWFkZSBhbmQgbm90ZXM6XG4tIE9yZGVyLXN5bWJvbHMgYW5kIHJlbGF0ZWQgY29tcG9uZW50ZWQgbm90IHlldCBpbXBsZW1lbnRlZFxuLSBNb3N0IG1ldGhvZHMgbm90IHlldCBpbXBsZW1lbnRlZCAoYnV0IGVub3VnaCB0byBldmFsdWF0ZSBhZGQgaW4gdGhlb3J5KVxuLSBTaW1wbGlmeSBhcmd1bWVudCBhZGRlZCB0byBjb25zdHJ1Y3RvciB0byBwcmV2ZW50IGluZmluaXRlIHJlY3Vyc2lvblxuKi9cblxuaW1wb3J0IHtfQmFzaWN9IGZyb20gXCIuL2Jhc2ljLmpzXCI7XG5pbXBvcnQge21peH0gZnJvbSBcIi4vdXRpbGl0eS5qc1wiO1xuaW1wb3J0IHtnbG9iYWxfcGFyYW1ldGVyc30gZnJvbSBcIi4vcGFyYW1ldGVycy5qc1wiO1xuaW1wb3J0IHtmdXp6eV9hbmRfdjJ9IGZyb20gXCIuL2xvZ2ljLmpzXCI7XG5pbXBvcnQge01hbmFnZWRQcm9wZXJ0aWVzfSBmcm9tIFwiLi9hc3N1bXB0aW9ucy5qc1wiO1xuaW1wb3J0IHtTfSBmcm9tIFwiLi9zaW5nbGV0b24uanNcIjtcblxuXG5jb25zdCBBc3NvY09wID0gKHN1cGVyY2xhc3M6IGFueSkgPT4gY2xhc3MgQXNzb2NPcCBleHRlbmRzIG1peChzdXBlcmNsYXNzKS53aXRoKF9CYXNpYykge1xuICAgIC8qIEFzc29jaWF0aXZlIG9wZXJhdGlvbnMsIGNhbiBzZXBhcmF0ZSBub25jb21tdXRhdGl2ZSBhbmRcbiAgICBjb21tdXRhdGl2ZSBwYXJ0cy5cbiAgICAoYSBvcCBiKSBvcCBjID09IGEgb3AgKGIgb3AgYykgPT0gYSBvcCBiIG9wIGMuXG4gICAgQmFzZSBjbGFzcyBmb3IgQWRkIGFuZCBNdWwuXG4gICAgVGhpcyBpcyBhbiBhYnN0cmFjdCBiYXNlIGNsYXNzLCBjb25jcmV0ZSBkZXJpdmVkIGNsYXNzZXMgbXVzdCBkZWZpbmVcbiAgICB0aGUgYXR0cmlidXRlIGBpZGVudGl0eWAuXG4gICAgLi4gZGVwcmVjYXRlZDo6IDEuN1xuICAgICAgIFVzaW5nIGFyZ3VtZW50cyB0aGF0IGFyZW4ndCBzdWJjbGFzc2VzIG9mIDpjbGFzczpgfi5FeHByYCBpbiBjb3JlXG4gICAgICAgb3BlcmF0b3JzICg6Y2xhc3M6YH4uTXVsYCwgOmNsYXNzOmB+LkFkZGAsIGFuZCA6Y2xhc3M6YH4uUG93YCkgaXNcbiAgICAgICBkZXByZWNhdGVkLiBTZWUgOnJlZjpgbm9uLWV4cHItYXJncy1kZXByZWNhdGVkYCBmb3IgZGV0YWlscy5cbiAgICBQYXJhbWV0ZXJzXG4gICAgPT09PT09PT09PVxuICAgICphcmdzIDpcbiAgICAgICAgQXJndW1lbnRzIHdoaWNoIGFyZSBvcGVyYXRlZFxuICAgIGV2YWx1YXRlIDogYm9vbCwgb3B0aW9uYWxcbiAgICAgICAgRXZhbHVhdGUgdGhlIG9wZXJhdGlvbi4gSWYgbm90IHBhc3NlZCwgcmVmZXIgdG8gYGBnbG9iYWxfcGFyYW1ldGVycy5ldmFsdWF0ZWBgLlxuICAgICovXG5cbiAgICAvLyBmb3IgcGVyZm9ybWFuY2UgcmVhc29uLCB3ZSBkb24ndCBsZXQgaXNfY29tbXV0YXRpdmUgZ28gdG8gYXNzdW1wdGlvbnMsXG4gICAgLy8gYW5kIGtlZXAgaXQgcmlnaHQgaGVyZVxuXG4gICAgX19zbG90c19fOiBhbnlbXSA9IFtcImlzX2NvbW11dGF0aXZlXCJdO1xuICAgIHN0YXRpYyBfYXJnc190eXBlOiBhbnkgPSB1bmRlZmluZWQ7XG5cbiAgICBjb25zdHJ1Y3RvcihjbHM6IGFueSwgZXZhbHVhdGU6IGFueSwgc2ltcGxpZnk6IGJvb2xlYW4sIC4uLmFyZ3M6IGFueSkge1xuICAgICAgICAvLyBpZGVudGl0eSB3YXNuJ3Qgd29ya2luZyBmb3Igc29tZSByZWFzb24sIHNvIGhlcmUgaXMgYSBiYW5kYWlkIGZpeFxuICAgICAgICBpZiAoY2xzLm5hbWUgPT09IFwiTXVsXCIpIHtcbiAgICAgICAgICAgIGNscy5pZGVudGl0eSA9IFMuT25lO1xuICAgICAgICB9IGVsc2UgaWYgKGNscy5uYW1lID09PSBcIkFkZFwiKSB7XG4gICAgICAgICAgICBjbHMuaWRlbnRpdHkgPSBTLlplcm87XG4gICAgICAgIH1cbiAgICAgICAgc3VwZXIoLi4uYXJncyk7XG4gICAgICAgIGlmIChzaW1wbGlmeSkge1xuICAgICAgICAgICAgaWYgKHR5cGVvZiBldmFsdWF0ZSA9PT0gXCJ1bmRlZmluZWRcIikge1xuICAgICAgICAgICAgICAgIGV2YWx1YXRlID0gZ2xvYmFsX3BhcmFtZXRlcnMuZXZhbHVhdGU7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKGV2YWx1YXRlID09PSBmYWxzZSkge1xuICAgICAgICAgICAgICAgIGxldCBvYmogPSB0aGlzLl9mcm9tX2FyZ3MoY2xzLCB1bmRlZmluZWQsIC4uLmFyZ3MpO1xuICAgICAgICAgICAgICAgIG9iaiA9IHRoaXMuX2V4ZWNfY29uc3RydWN0b3JfcG9zdHByb2Nlc3NvcnMob2JqKTtcbiAgICAgICAgICAgICAgICByZXR1cm4gb2JqO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgY29uc3QgYXJnc1RlbXA6IGFueVtdID0gW107XG4gICAgICAgICAgICBmb3IgKGNvbnN0IGEgb2YgYXJncykge1xuICAgICAgICAgICAgICAgIGlmIChhICE9PSBjbHMuaWRlbnRpdHkpIHtcbiAgICAgICAgICAgICAgICAgICAgYXJnc1RlbXAucHVzaChhKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBhcmdzID0gYXJnc1RlbXA7XG4gICAgICAgICAgICBpZiAoYXJncy5sZW5ndGggPT09IDApIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gY2xzLmlkZW50aXR5O1xuICAgICAgICAgICAgfSBlbHNlIGlmIChhcmdzLmxlbmd0aCA9PT0gMSkge1xuICAgICAgICAgICAgICAgIHJldHVybiBhcmdzWzBdO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5vLXVudXNlZC12YXJzXG4gICAgICAgICAgICBjb25zdCBbY19wYXJ0LCBuY19wYXJ0LCBvcmRlcl9zeW1ib2xzXSA9IHRoaXMuZmxhdHRlbihhcmdzKTtcbiAgICAgICAgICAgIGNvbnN0IGlzX2NvbW11dGF0aXZlOiBib29sZWFuID0gbmNfcGFydC5sZW5ndGggPT09IDA7XG4gICAgICAgICAgICBsZXQgb2JqOiBhbnkgPSB0aGlzLl9mcm9tX2FyZ3MoY2xzLCBpc19jb21tdXRhdGl2ZSwgLi4uY19wYXJ0LmNvbmNhdChuY19wYXJ0KSk7XG4gICAgICAgICAgICBvYmogPSB0aGlzLl9leGVjX2NvbnN0cnVjdG9yX3Bvc3Rwcm9jZXNzb3JzKG9iaik7XG4gICAgICAgICAgICAvLyAhISEgb3JkZXIgc3ltYm9scyBub3QgeWV0IGltcGxlbWVudGVkXG4gICAgICAgICAgICByZXR1cm4gb2JqO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgX2Zyb21fYXJncyhjbHM6IGFueSwgaXNfY29tbXV0YXRpdmU6IGFueSwgLi4uYXJnczogYW55KSB7XG4gICAgICAgIC8qIFwiQ3JlYXRlIG5ldyBpbnN0YW5jZSB3aXRoIGFscmVhZHktcHJvY2Vzc2VkIGFyZ3MuXG4gICAgICAgIElmIHRoZSBhcmdzIGFyZSBub3QgaW4gY2Fub25pY2FsIG9yZGVyLCB0aGVuIGEgbm9uLWNhbm9uaWNhbFxuICAgICAgICByZXN1bHQgd2lsbCBiZSByZXR1cm5lZCwgc28gdXNlIHdpdGggY2F1dGlvbi4gVGhlIG9yZGVyIG9mXG4gICAgICAgIGFyZ3MgbWF5IGNoYW5nZSBpZiB0aGUgc2lnbiBvZiB0aGUgYXJncyBpcyBjaGFuZ2VkLiAqL1xuICAgICAgICBpZiAoYXJncy5sZW5ndGggPT09IDApIHtcbiAgICAgICAgICAgIHJldHVybiBjbHMuaWRlbnRpdHk7XG4gICAgICAgIH0gZWxzZSBpZiAoYXJncy5sZW5ndGggPT09IDEpIHtcbiAgICAgICAgICAgIHJldHVybiBhcmdzWzBdO1xuICAgICAgICB9XG4gICAgICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBuZXctY2FwXG4gICAgICAgIGNvbnN0IG9iajogYW55ID0gbmV3IGNscyh0cnVlLCBmYWxzZSwgLi4uYXJncyk7XG4gICAgICAgIGlmICh0eXBlb2YgaXNfY29tbXV0YXRpdmUgPT09IFwidW5kZWZpbmVkXCIpIHtcbiAgICAgICAgICAgIGNvbnN0IGlucHV0OiBhbnlbXSA9IFtdO1xuICAgICAgICAgICAgZm9yIChjb25zdCBhIG9mIGFyZ3MpIHtcbiAgICAgICAgICAgICAgICBpbnB1dC5wdXNoKGEuaXNfY29tbXV0YXRpdmUpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaXNfY29tbXV0YXRpdmUgPSBmdXp6eV9hbmRfdjIoaW5wdXQpO1xuICAgICAgICB9XG4gICAgICAgIG9iai5pc19jb21tdXRhdGl2ZSA9IGlzX2NvbW11dGF0aXZlO1xuICAgICAgICByZXR1cm4gb2JqO1xuICAgIH1cblxuICAgIF9uZXdfcmF3YXJncyhyZWV2YWw6IGJvb2xlYW4sIC4uLmFyZ3M6IGFueSkge1xuICAgICAgICBsZXQgaXNfY29tbXV0YXRpdmU7XG4gICAgICAgIGlmIChyZWV2YWwgJiYgdGhpcy5pc19jb21tdXRhdGl2ZSA9PT0gZmFsc2UpIHtcbiAgICAgICAgICAgIGlzX2NvbW11dGF0aXZlID0gdW5kZWZpbmVkO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgaXNfY29tbXV0YXRpdmUgPSB0aGlzLmlzX2NvbW11dGF0aXZlO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0aGlzLl9mcm9tX2FyZ3ModGhpcy5jb25zdHJ1Y3RvciwgaXNfY29tbXV0YXRpdmUsIC4uLmFyZ3MpO1xuICAgIH1cblxuICAgIG1ha2VfYXJncyhjbHM6IGFueSwgZXhwcjogYW55KSB7XG4gICAgICAgIGlmIChleHByIGluc3RhbmNlb2YgY2xzKSB7XG4gICAgICAgICAgICByZXR1cm4gZXhwci5fYXJncztcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiBbZXhwcl07XG4gICAgICAgIH1cbiAgICB9XG59O1xuXG4vLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbmV3LWNhcFxuTWFuYWdlZFByb3BlcnRpZXMucmVnaXN0ZXIoQXNzb2NPcChPYmplY3QpKTtcblxuZXhwb3J0IHtBc3NvY09wfTtcbiIsICIvKlxuSW50ZWdlciBhbmQgcmF0aW9uYWwgZmFjdG9yaXphdGlvblxuXG5Ob3RhYmxlIGNoYW5nZXMgbWFkZVxuLSBBIGZldyBmdW5jdGlvbnMgaW4gLmdlbmVyYXRvciBhbmQgLmV2YWxmIGhhdmUgYmVlbiBtb3ZlZCBoZXJlIGZvciBzaW1wbGljaXR5XG4tIE5vdGU6IG1vc3QgcGFyYW1ldGVycyBmb3IgZmFjdG9yaW50IGFuZCBmYWN0b3JyYXQgaGF2ZSBub3QgYmVlbiBpbXBsZW1lbnRlZFxuLSBTZWUgbm90ZXMgd2l0aGluIHBlcmZlY3RfcG93ZXIgZm9yIHNwZWNpZmljIGNoYW5nZXNcbi0gQWxsIGZhY3RvciBmdW5jdGlvbnMgcmV0dXJuIGhhc2hkaWN0aW9uYXJpZXNcbi0gQWR2YW5jZWQgZmFjdG9yaW5nIGFsZ29yaXRobXMgZm9yIGZhY3RvcmludCBhcmUgbm90IHlldCBpbXBsZW1lbnRlZFxuKi9cblxuaW1wb3J0IHtSYXRpb25hbCwgaW50X250aHJvb3QsIEludGVnZXJ9IGZyb20gXCIuLi9jb3JlL251bWJlcnMuanNcIjtcbmltcG9ydCB7U30gZnJvbSBcIi4uL2NvcmUvc2luZ2xldG9uLmpzXCI7XG5pbXBvcnQge0hhc2hEaWN0LCBVdGlsfSBmcm9tIFwiLi4vY29yZS91dGlsaXR5LmpzXCI7XG5pbXBvcnQge2FzX2ludH0gZnJvbSBcIi4uL3V0aWxpdGllcy9taXNjLmpzXCI7XG5cbmNvbnN0IHNtYWxsX3RyYWlsaW5nID0gbmV3IEFycmF5KDI1NikuZmlsbCgwKTtcbmZvciAobGV0IGogPSAxOyBqIDwgODsgaisrKSB7XG4gICAgVXRpbC5hc3NpZ25FbGVtZW50cyhzbWFsbF90cmFpbGluZywgbmV3IEFycmF5KCgxPDwoNy1qKSkpLmZpbGwoaiksIDE8PGosIDE8PChqKzEpKTtcbn1cblxuZnVuY3Rpb24gYml0Y291bnQobjogbnVtYmVyKSB7XG4gICAgLy8gUmV0dXJuIHNtYWxsZXN0IGludGVnZXIsIGIsIHN1Y2ggdGhhdCB8bnwvMioqYiA8IDFcbiAgICBsZXQgYml0cyA9IDA7XG4gICAgd2hpbGUgKG4gIT09IDApIHtcbiAgICAgICAgYml0cyArPSBiaXRDb3VudDMyKG4gfCAwKTtcbiAgICAgICAgbiAvPSAweDEwMDAwMDAwMDtcbiAgICB9XG4gICAgcmV0dXJuIGJpdHM7XG59XG5cbi8vIHNtYWxsIGJpdGNvdW50IHVzZWQgdG8gZmFjaWxpYXRlIGxhcmdlciBvbmVcbmZ1bmN0aW9uIGJpdENvdW50MzIobjogbnVtYmVyKSB7XG4gICAgbiA9IG4gLSAoKG4gPj4gMSkgJiAweDU1NTU1NTU1KTtcbiAgICBuID0gKG4gJiAweDMzMzMzMzMzKSArICgobiA+PiAyKSAmIDB4MzMzMzMzMzMpO1xuICAgIHJldHVybiAoKG4gKyAobiA+PiA0KSAmIDB4RjBGMEYwRikgKiAweDEwMTAxMDEpID4+IDI0O1xufVxuXG5mdW5jdGlvbiB0cmFpbGluZyhuOiBudW1iZXIpIHtcbiAgICAvKlxuICAgIENvdW50IHRoZSBudW1iZXIgb2YgdHJhaWxpbmcgemVybyBkaWdpdHMgaW4gdGhlIGJpbmFyeVxuICAgIHJlcHJlc2VudGF0aW9uIG9mIG4sIGkuZS4gZGV0ZXJtaW5lIHRoZSBsYXJnZXN0IHBvd2VyIG9mIDJcbiAgICB0aGF0IGRpdmlkZXMgbi5cbiAgICBFeGFtcGxlc1xuICAgID09PT09PT09XG4gICAgPj4+IGZyb20gc3ltcHkgaW1wb3J0IHRyYWlsaW5nXG4gICAgPj4+IHRyYWlsaW5nKDEyOClcbiAgICA3XG4gICAgPj4+IHRyYWlsaW5nKDYzKVxuICAgIDBcbiAgICAqL1xuICAgIG4gPSBNYXRoLmZsb29yKE1hdGguYWJzKG4pKTtcbiAgICBjb25zdCBsb3dfYnl0ZSA9IG4gJiAweGZmO1xuICAgIGlmIChsb3dfYnl0ZSkge1xuICAgICAgICByZXR1cm4gc21hbGxfdHJhaWxpbmdbbG93X2J5dGVdO1xuICAgIH1cbiAgICBjb25zdCB6ID0gYml0Y291bnQobikgLSAxO1xuICAgIGlmIChOdW1iZXIuaXNJbnRlZ2VyKHopKSB7XG4gICAgICAgIGlmIChuID09PSAxIDw8IHopIHtcbiAgICAgICAgICAgIHJldHVybiB6O1xuICAgICAgICB9XG4gICAgfVxuICAgIGlmICh6IDwgMzAwKSB7XG4gICAgICAgIGxldCB0ID0gODtcbiAgICAgICAgbiA+Pj0gODtcbiAgICAgICAgd2hpbGUgKCEobiAmIDB4ZmYpKSB7XG4gICAgICAgICAgICBuID4+PSA4O1xuICAgICAgICAgICAgdCArPSA4O1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0ICsgc21hbGxfdHJhaWxpbmdbbiAmIDB4ZmZdO1xuICAgIH1cbiAgICBsZXQgdCA9IDA7XG4gICAgbGV0IHAgPSA4O1xuICAgIHdoaWxlICghKG4gJiAxKSkge1xuICAgICAgICB3aGlsZSAoIShuICYgKCgxIDw8IHApIC0gMSkpKSB7XG4gICAgICAgICAgICBuID4+PSBwO1xuICAgICAgICAgICAgdCArPSBwO1xuICAgICAgICAgICAgcCAqPSAyO1xuICAgICAgICB9XG4gICAgICAgIHAgPSBNYXRoLmZsb29yKHAvMik7XG4gICAgfVxuICAgIHJldHVybiB0O1xufVxuXG4vLyBub3RlOiB0aGlzIGlzIGRpZmZlcmVudCB0aGFuIHRoZSBvcmlnaW5hbCBzeW1weSB2ZXJzaW9uIC0gaW1wbGVtZW50IGxhdGVyXG5mdW5jdGlvbiBpc3ByaW1lKG51bTogbnVtYmVyKSB7XG4gICAgZm9yIChsZXQgaSA9IDIsIHMgPSBNYXRoLnNxcnQobnVtKTsgaSA8PSBzOyBpKyspIHtcbiAgICAgICAgaWYgKG51bSAlIGkgPT09IDApIHtcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gKG51bSA+IDEpO1xufVxuXG5mdW5jdGlvbiogcHJpbWVyYW5nZShhOiBudW1iZXIsIGI6IG51bWJlciA9IHVuZGVmaW5lZCkge1xuICAgIC8qXG4gICAgR2VuZXJhdGUgYWxsIHByaW1lIG51bWJlcnMgaW4gdGhlIHJhbmdlIFsyLCBhKSBvciBbYSwgYikuXG4gICAgRXhhbXBsZXNcbiAgICA9PT09PT09PVxuICAgID4+PiBmcm9tIHN5bXB5IGltcG9ydCBzaWV2ZSwgcHJpbWVcbiAgICBBbGwgcHJpbWVzIGxlc3MgdGhhbiAxOTpcbiAgICA+Pj4gcHJpbnQoW2kgZm9yIGkgaW4gc2lldmUucHJpbWVyYW5nZSgxOSldKVxuICAgIFsyLCAzLCA1LCA3LCAxMSwgMTMsIDE3XVxuICAgIEFsbCBwcmltZXMgZ3JlYXRlciB0aGFuIG9yIGVxdWFsIHRvIDcgYW5kIGxlc3MgdGhhbiAxOTpcbiAgICA+Pj4gcHJpbnQoW2kgZm9yIGkgaW4gc2lldmUucHJpbWVyYW5nZSg3LCAxOSldKVxuICAgIFs3LCAxMSwgMTMsIDE3XVxuICAgIEFsbCBwcmltZXMgdGhyb3VnaCB0aGUgMTB0aCBwcmltZVxuICAgID4+PiBsaXN0KHNpZXZlLnByaW1lcmFuZ2UocHJpbWUoMTApICsgMSkpXG4gICAgWzIsIDMsIDUsIDcsIDExLCAxMywgMTcsIDE5LCAyMywgMjldXG4gICAgKi9cbiAgICBpZiAodHlwZW9mIGIgPT09IFwidW5kZWZpbmVkXCIpIHtcbiAgICAgICAgW2EsIGJdID0gWzIsIGFdO1xuICAgIH1cbiAgICBpZiAoYSA+PSBiKSB7XG4gICAgICAgIHJldHVybjtcbiAgICB9XG4gICAgYSA9IE1hdGguY2VpbChhKSAtIDE7XG4gICAgYiA9IE1hdGguZmxvb3IoYik7XG5cbiAgICB3aGlsZSAoMSkge1xuICAgICAgICBhID0gbmV4dHByaW1lKGEpO1xuICAgICAgICBpZiAoYSA8IGIpIHtcbiAgICAgICAgICAgIHlpZWxkIGE7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICB9XG59XG5cbmZ1bmN0aW9uIG5leHRwcmltZShuOiBudW1iZXIsIGl0aDogbnVtYmVyID0gMSkge1xuICAgIC8qXG4gICAgUmV0dXJuIHRoZSBpdGggcHJpbWUgZ3JlYXRlciB0aGFuIG4uXG4gICAgaSBtdXN0IGJlIGFuIGludGVnZXIuXG4gICAgTm90ZXNcbiAgICA9PT09PVxuICAgIFBvdGVudGlhbCBwcmltZXMgYXJlIGxvY2F0ZWQgYXQgNipqICsvLSAxLiBUaGlzXG4gICAgcHJvcGVydHkgaXMgdXNlZCBkdXJpbmcgc2VhcmNoaW5nLlxuICAgID4+PiBmcm9tIHN5bXB5IGltcG9ydCBuZXh0cHJpbWVcbiAgICA+Pj4gWyhpLCBuZXh0cHJpbWUoaSkpIGZvciBpIGluIHJhbmdlKDEwLCAxNSldXG4gICAgWygxMCwgMTEpLCAoMTEsIDEzKSwgKDEyLCAxMyksICgxMywgMTcpLCAoMTQsIDE3KV1cbiAgICA+Pj4gbmV4dHByaW1lKDIsIGl0aD0yKSAjIHRoZSAybmQgcHJpbWUgYWZ0ZXIgMlxuICAgIDVcbiAgICBTZWUgQWxzb1xuICAgID09PT09PT09XG4gICAgcHJldnByaW1lIDogUmV0dXJuIHRoZSBsYXJnZXN0IHByaW1lIHNtYWxsZXIgdGhhbiBuXG4gICAgcHJpbWVyYW5nZSA6IEdlbmVyYXRlIGFsbCBwcmltZXMgaW4gYSBnaXZlbiByYW5nZVxuICAgICovXG4gICAgbiA9IE1hdGguZmxvb3Iobik7XG4gICAgY29uc3QgaSA9IGFzX2ludChpdGgpO1xuICAgIGlmIChpID4gMSkge1xuICAgICAgICBsZXQgcHIgPSBuO1xuICAgICAgICBsZXQgaiA9IDE7XG4gICAgICAgIHdoaWxlICgxKSB7XG4gICAgICAgICAgICBwciA9IG5leHRwcmltZShwcik7XG4gICAgICAgICAgICBqKys7XG4gICAgICAgICAgICBpZiAoaiA+IDEpIHtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gcHI7XG4gICAgfVxuICAgIGlmIChuIDwgMikge1xuICAgICAgICByZXR1cm4gMjtcbiAgICB9XG4gICAgaWYgKG4gPCA3KSB7XG4gICAgICAgIHJldHVybiB7MjogMywgMzogNSwgNDogNSwgNTogNywgNjogN31bbl07XG4gICAgfVxuICAgIGNvbnN0IG5uID0gNiAqIE1hdGguZmxvb3Iobi82KTtcbiAgICBpZiAobm4gPT09IG4pIHtcbiAgICAgICAgbisrO1xuICAgICAgICBpZiAoaXNwcmltZShuKSkge1xuICAgICAgICAgICAgcmV0dXJuIG47XG4gICAgICAgIH1cbiAgICAgICAgbiArPSA0O1xuICAgIH0gZWxzZSBpZiAobiAtIG5uID09PSA1KSB7XG4gICAgICAgIG4gKz0gMjtcbiAgICAgICAgaWYgKGlzcHJpbWUobikpIHtcbiAgICAgICAgICAgIHJldHVybiBuO1xuICAgICAgICB9XG4gICAgICAgIG4gKz0gNDtcbiAgICB9IGVsc2Uge1xuICAgICAgICBuID0gbm4gKyA1O1xuICAgIH1cbiAgICB3aGlsZSAoMSkge1xuICAgICAgICBpZiAoaXNwcmltZShuKSkge1xuICAgICAgICAgICAgcmV0dXJuIG47XG4gICAgICAgIH1cbiAgICAgICAgbiArPSAyO1xuICAgICAgICBpZiAoaXNwcmltZShuKSkge1xuICAgICAgICAgICAgcmV0dXJuIG47XG4gICAgICAgIH1cbiAgICAgICAgbiArPSA0O1xuICAgIH1cbn1cblxuZXhwb3J0IGNvbnN0IGRpdm1vZCA9IChhOiBudW1iZXIsIGI6IG51bWJlcikgPT4gW01hdGguZmxvb3IoYS9iKSwgYSViXTtcblxuZnVuY3Rpb24gbXVsdGlwbGljaXR5KHA6IGFueSwgbjogYW55KTogYW55IHtcbiAgICAvKlxuICAgIEZpbmQgdGhlIGdyZWF0ZXN0IGludGVnZXIgbSBzdWNoIHRoYXQgcCoqbSBkaXZpZGVzIG4uXG4gICAgRXhhbXBsZXNcbiAgICA9PT09PT09PVxuICAgID4+PiBmcm9tIHN5bXB5IGltcG9ydCBtdWx0aXBsaWNpdHksIFJhdGlvbmFsXG4gICAgPj4+IFttdWx0aXBsaWNpdHkoNSwgbikgZm9yIG4gaW4gWzgsIDUsIDI1LCAxMjUsIDI1MF1dXG4gICAgWzAsIDEsIDIsIDMsIDNdXG4gICAgPj4+IG11bHRpcGxpY2l0eSgzLCBSYXRpb25hbCgxLCA5KSlcbiAgICAtMlxuICAgIE5vdGU6IHdoZW4gY2hlY2tpbmcgZm9yIHRoZSBtdWx0aXBsaWNpdHkgb2YgYSBudW1iZXIgaW4gYVxuICAgIGxhcmdlIGZhY3RvcmlhbCBpdCBpcyBtb3N0IGVmZmljaWVudCB0byBzZW5kIGl0IGFzIGFuIHVuZXZhbHVhdGVkXG4gICAgZmFjdG9yaWFsIG9yIHRvIGNhbGwgYGBtdWx0aXBsaWNpdHlfaW5fZmFjdG9yaWFsYGAgZGlyZWN0bHk6XG4gICAgPj4+IGZyb20gc3ltcHkubnRoZW9yeSBpbXBvcnQgbXVsdGlwbGljaXR5X2luX2ZhY3RvcmlhbFxuICAgID4+PiBmcm9tIHN5bXB5IGltcG9ydCBmYWN0b3JpYWxcbiAgICA+Pj4gcCA9IGZhY3RvcmlhbCgyNSlcbiAgICA+Pj4gbiA9IDIqKjEwMFxuICAgID4+PiBuZmFjID0gZmFjdG9yaWFsKG4sIGV2YWx1YXRlPUZhbHNlKVxuICAgID4+PiBtdWx0aXBsaWNpdHkocCwgbmZhYylcbiAgICA1MjgxODc3NTAwOTUwOTU1ODM5NTY5NTk2Njg4N1xuICAgID4+PiBfID09IG11bHRpcGxpY2l0eV9pbl9mYWN0b3JpYWwocCwgbilcbiAgICBUcnVlXG4gICAgKi9cbiAgICB0cnkge1xuICAgICAgICBbcCwgbl0gPSBbYXNfaW50KHApLCBhc19pbnQobildO1xuICAgIH0gY2F0Y2ggKEVycm9yKSB7XG4gICAgICAgIGlmIChOdW1iZXIuaXNJbnRlZ2VyKHApIHx8IHAgaW5zdGFuY2VvZiBSYXRpb25hbCAmJiBOdW1iZXIuaXNJbnRlZ2VyKG4pIHx8IG4gaW5zdGFuY2VvZiBSYXRpb25hbCkge1xuICAgICAgICAgICAgcCA9IG5ldyBSYXRpb25hbChwKTtcbiAgICAgICAgICAgIG4gPSBuZXcgUmF0aW9uYWwobik7XG4gICAgICAgICAgICBpZiAocC5xID09PSAxKSB7XG4gICAgICAgICAgICAgICAgaWYgKG4ucCA9PT0gMSkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gLW11bHRpcGxpY2l0eShwLnAsIG4ucSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHJldHVybiBtdWx0aXBsaWNpdHkocC5wLCBuLnApIC0gbXVsdGlwbGljaXR5KHAucCwgbi5xKTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAocC5wID09PSAxKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIG11bHRpcGxpY2l0eShwLnEsIG4ucSk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGNvbnN0IGxpa2UgPSBNYXRoLm1pbihtdWx0aXBsaWNpdHkocC5wLCBuLnApLCBtdWx0aXBsaWNpdHkocC5xLCBuLnEpKTtcbiAgICAgICAgICAgICAgICBjb25zdCBjcm9zcyA9IE1hdGgubWluKG11bHRpcGxpY2l0eShwLnEsIG4ucCksIG11bHRpcGxpY2l0eShwLnAsIG4ucSkpO1xuICAgICAgICAgICAgICAgIHJldHVybiBsaWtlIC0gY3Jvc3M7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG4gICAgaWYgKG4gPT09IDApIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwibm8gaW50IGV4aXN0c1wiKTtcbiAgICB9XG4gICAgaWYgKHAgPT09IDIpIHtcbiAgICAgICAgcmV0dXJuIHRyYWlsaW5nKG4pO1xuICAgIH1cbiAgICBpZiAocCA8IDIpIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwicCBtdXN0IGJlIGludFwiKTtcbiAgICB9XG4gICAgaWYgKHAgPT09IG4pIHtcbiAgICAgICAgcmV0dXJuIDE7XG4gICAgfVxuXG4gICAgbGV0IG0gPSAwO1xuICAgIG4gPSBNYXRoLmZsb29yKG4vcCk7XG4gICAgbGV0IHJlbSA9IG4gJSBwO1xuICAgIHdoaWxlICghcmVtKSB7XG4gICAgICAgIG0rKztcbiAgICAgICAgaWYgKG0gPiA1KSB7XG4gICAgICAgICAgICBsZXQgZSA9IDI7XG4gICAgICAgICAgICB3aGlsZSAoMSkge1xuICAgICAgICAgICAgICAgIGNvbnN0IHBwb3cgPSBwKiplO1xuICAgICAgICAgICAgICAgIGlmIChwcG93IDwgbikge1xuICAgICAgICAgICAgICAgICAgICBjb25zdCBubmV3ID0gTWF0aC5mbG9vcihuL3Bwb3cpO1xuICAgICAgICAgICAgICAgICAgICByZW0gPSBuICUgcHBvdztcbiAgICAgICAgICAgICAgICAgICAgaWYgKCEocmVtKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgbSArPSBlO1xuICAgICAgICAgICAgICAgICAgICAgICAgZSAqPSAyO1xuICAgICAgICAgICAgICAgICAgICAgICAgbiA9IG5uZXc7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICByZXR1cm4gbSArIG11bHRpcGxpY2l0eShwLCBuKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBbbiwgcmVtXSA9IGRpdm1vZChuLCBwKTtcbiAgICB9XG4gICAgcmV0dXJuIG07XG59XG5cbmZ1bmN0aW9uIGRpdmlzb3JzKG46IG51bWJlciwgZ2VuZXJhdG9yOiBib29sZWFuID0gZmFsc2UsIHByb3BlcjogYm9vbGVhbiA9IGZhbHNlKSB7XG4gICAgLypcbiAgICBSZXR1cm4gYWxsIGRpdmlzb3JzIG9mIG4gc29ydGVkIGZyb20gMS4ubiBieSBkZWZhdWx0LlxuICAgIElmIGdlbmVyYXRvciBpcyBgYFRydWVgYCBhbiB1bm9yZGVyZWQgZ2VuZXJhdG9yIGlzIHJldHVybmVkLlxuICAgIFRoZSBudW1iZXIgb2YgZGl2aXNvcnMgb2YgbiBjYW4gYmUgcXVpdGUgbGFyZ2UgaWYgdGhlcmUgYXJlIG1hbnlcbiAgICBwcmltZSBmYWN0b3JzIChjb3VudGluZyByZXBlYXRlZCBmYWN0b3JzKS4gSWYgb25seSB0aGUgbnVtYmVyIG9mXG4gICAgZmFjdG9ycyBpcyBkZXNpcmVkIHVzZSBkaXZpc29yX2NvdW50KG4pLlxuICAgIEV4YW1wbGVzXG4gICAgPT09PT09PT1cbiAgICA+Pj4gZnJvbSBzeW1weSBpbXBvcnQgZGl2aXNvcnMsIGRpdmlzb3JfY291bnRcbiAgICA+Pj4gZGl2aXNvcnMoMjQpXG4gICAgWzEsIDIsIDMsIDQsIDYsIDgsIDEyLCAyNF1cbiAgICA+Pj4gZGl2aXNvcl9jb3VudCgyNClcbiAgICA4XG4gICAgPj4+IGxpc3QoZGl2aXNvcnMoMTIwLCBnZW5lcmF0b3I9VHJ1ZSkpXG4gICAgWzEsIDIsIDQsIDgsIDMsIDYsIDEyLCAyNCwgNSwgMTAsIDIwLCA0MCwgMTUsIDMwLCA2MCwgMTIwXVxuICAgIE5vdGVzXG4gICAgPT09PT1cbiAgICBUaGlzIGlzIGEgc2xpZ2h0bHkgbW9kaWZpZWQgdmVyc2lvbiBvZiBUaW0gUGV0ZXJzIHJlZmVyZW5jZWQgYXQ6XG4gICAgaHR0cHM6Ly9zdGFja292ZXJmbG93LmNvbS9xdWVzdGlvbnMvMTAxMDM4MS9weXRob24tZmFjdG9yaXphdGlvblxuICAgIFNlZSBBbHNvXG4gICAgPT09PT09PT1cbiAgICBwcmltZWZhY3RvcnMsIGZhY3RvcmludCwgZGl2aXNvcl9jb3VudFxuICAgICovXG4gICAgbiA9IGFzX2ludChNYXRoLmFicyhuKSk7XG4gICAgaWYgKGlzcHJpbWUobikpIHtcbiAgICAgICAgaWYgKHByb3Blcikge1xuICAgICAgICAgICAgcmV0dXJuIFsxXTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gWzEsIG5dO1xuICAgIH1cbiAgICBpZiAobiA9PT0gMSkge1xuICAgICAgICBpZiAocHJvcGVyKSB7XG4gICAgICAgICAgICByZXR1cm4gW107XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIFsxXTtcbiAgICB9XG4gICAgaWYgKG4gPT09IDApIHtcbiAgICAgICAgcmV0dXJuIFtdO1xuICAgIH1cbiAgICBjb25zdCBydiA9IF9kaXZpc29ycyhuLCBwcm9wZXIpO1xuICAgIGlmICghZ2VuZXJhdG9yKSB7XG4gICAgICAgIGNvbnN0IHRlbXAgPSBbXTtcbiAgICAgICAgZm9yIChjb25zdCBpIG9mIHJ2KSB7XG4gICAgICAgICAgICB0ZW1wLnB1c2goaSk7XG4gICAgICAgIH1cbiAgICAgICAgdGVtcC5zb3J0KCk7XG4gICAgICAgIHJldHVybiB0ZW1wO1xuICAgIH1cbiAgICByZXR1cm4gcnY7XG59XG5cbmZ1bmN0aW9uKiBfZGl2aXNvcnMobjogbnVtYmVyLCBnZW5lcmF0b3I6IGJvb2xlYW4gPSBmYWxzZSwgcHJvcGVyOiBib29sZWFuID0gZmFsc2UpIHtcbiAgICAvLyBIZWxwZXIgZnVuY3Rpb24gZm9yIGRpdmlzb3JzIHdoaWNoIGdlbmVyYXRlcyB0aGUgZGl2aXNvcnMuXG4gICAgY29uc3QgZmFjdG9yZGljdCA9IGZhY3RvcmludChuKTtcbiAgICBjb25zdCBwcyA9IGZhY3RvcmRpY3Qua2V5cygpLnNvcnQoKTtcblxuICAgIGZ1bmN0aW9uKiByZWNfZ2VuKG46IG51bWJlciA9IDApOiBhbnkge1xuICAgICAgICBpZiAobiA9PT0gcHMubGVuZ3RoKSB7XG4gICAgICAgICAgICB5aWVsZCAxO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgY29uc3QgcG93cyA9IFsxXTtcbiAgICAgICAgICAgIGZvciAobGV0IGogPSAwOyBqIDwgZmFjdG9yZGljdC5nZXQocHNbbl0pOyBqKyspIHtcbiAgICAgICAgICAgICAgICBwb3dzLnB1c2gocG93c1twb3dzLmxlbmd0aCAtIDFdICogcHNbbl0pO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZm9yIChjb25zdCBxIG9mIHJlY19nZW4obiArIDEpKSB7XG4gICAgICAgICAgICAgICAgZm9yIChjb25zdCBwIG9mIHBvd3MpIHtcbiAgICAgICAgICAgICAgICAgICAgeWllbGQgcCAqIHE7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuICAgIGlmIChwcm9wZXIpIHtcbiAgICAgICAgZm9yIChjb25zdCBwIG9mIHJlY19nZW4oKSkge1xuICAgICAgICAgICAgaWYgKHAgIT0gbikge1xuICAgICAgICAgICAgICAgIHlpZWxkIHA7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgICBmb3IgKGNvbnN0IHAgb2YgcmVjX2dlbigpKSB7XG4gICAgICAgICAgICB5aWVsZCBwO1xuICAgICAgICB9XG4gICAgfVxufVxuXG5cbmZ1bmN0aW9uIF9jaGVja190ZXJtaW5hdGlvbihmYWN0b3JzOiBhbnksIG46IG51bWJlciwgbGltaXRwMTogYW55KSB7XG4gICAgLypcbiAgICBIZWxwZXIgZnVuY3Rpb24gZm9yIGludGVnZXIgZmFjdG9yaXphdGlvbi4gQ2hlY2tzIGlmIGBgbmBgXG4gICAgaXMgYSBwcmltZSBvciBhIHBlcmZlY3QgcG93ZXIsIGFuZCBpbiB0aG9zZSBjYXNlcyB1cGRhdGVzXG4gICAgdGhlIGZhY3Rvcml6YXRpb24gYW5kIHJhaXNlcyBgYFN0b3BJdGVyYXRpb25gYC5cbiAgICAqL1xuICAgIGNvbnN0IHAgPSBwZXJmZWN0X3Bvd2VyKG4sIHVuZGVmaW5lZCwgdHJ1ZSwgZmFsc2UpO1xuICAgIGlmIChwICE9PSBmYWxzZSkge1xuICAgICAgICBjb25zdCBbYmFzZSwgZXhwXSA9IHA7XG4gICAgICAgIGxldCBsaW1pdDtcbiAgICAgICAgaWYgKGxpbWl0cDEpIHtcbiAgICAgICAgICAgIGxpbWl0ID0gbGltaXRwMSA9IDE7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBsaW1pdCA9IGxpbWl0cDE7XG4gICAgICAgIH1cbiAgICAgICAgY29uc3QgZmFjcyA9IGZhY3RvcmludChiYXNlLCBsaW1pdCk7XG4gICAgICAgIGZvciAoY29uc3QgW2IsIGVdIG9mIGZhY3MuZW50cmllcygpKSB7XG4gICAgICAgICAgICBmYWN0b3JzW2JdID0gZXhwKmU7XG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoKTtcbiAgICAgICAgfVxuICAgIH1cbiAgICBpZiAoaXNwcmltZShuKSkge1xuICAgICAgICBmYWN0b3JzLmFkZChuLCAxKTtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKCk7XG4gICAgfVxuICAgIGlmIChuID09PSAxKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcigpO1xuICAgIH1cbn1cblxuZnVuY3Rpb24gX3RyaWFsKGZhY3RvcnM6IGFueSwgbjogbnVtYmVyLCBjYW5kaWRhdGVzOiBhbnkpIHtcbiAgICAvKlxuICAgIEhlbHBlciBmdW5jdGlvbiBmb3IgaW50ZWdlciBmYWN0b3JpemF0aW9uLiBUcmlhbCBmYWN0b3JzIGBgbmBcbiAgICBhZ2FpbnN0IGFsbCBpbnRlZ2VycyBnaXZlbiBpbiB0aGUgc2VxdWVuY2UgYGBjYW5kaWRhdGVzYGBcbiAgICBhbmQgdXBkYXRlcyB0aGUgZGljdCBgYGZhY3RvcnNgYCBpbi1wbGFjZS4gUmV0dXJucyB0aGUgcmVkdWNlZFxuICAgIHZhbHVlIG9mIGBgbmBgIGFuZCBhIGZsYWcgaW5kaWNhdGluZyB3aGV0aGVyIGFueSBmYWN0b3JzIHdlcmUgZm91bmQuXG4gICAgKi9cbiAgICBjb25zdCBuZmFjdG9ycyA9IGZhY3RvcnMubGVuZ3RoO1xuICAgIGZvciAoY29uc3QgZCBvZiBjYW5kaWRhdGVzKSB7XG4gICAgICAgIGlmIChuICUgZCA9PT0gMCkge1xuICAgICAgICAgICAgY29uc3QgbSA9IG11bHRpcGxpY2l0eShkLCBuKTtcbiAgICAgICAgICAgIG4gPSBNYXRoLmZsb29yKG4vKGQqKm0pKTtcbiAgICAgICAgICAgIGZhY3RvcnNbZF0gPSBtO1xuICAgICAgICB9XG4gICAgfVxuICAgIHJldHVybiBbbiwgZmFjdG9ycy5sZW5ndGggIT09IG5mYWN0b3JzXTtcbn1cblxuZnVuY3Rpb24gX2ZhY3RvcmludF9zbWFsbChmYWN0b3JzOiBIYXNoRGljdCwgbjogYW55LCBsaW1pdDogYW55LCBmYWlsX21heDogYW55KSB7XG4gICAgLypcbiAgICBSZXR1cm4gdGhlIHZhbHVlIG9mIG4gYW5kIGVpdGhlciBhIDAgKGluZGljYXRpbmcgdGhhdCBmYWN0b3JpemF0aW9uIHVwXG4gICAgdG8gdGhlIGxpbWl0IHdhcyBjb21wbGV0ZSkgb3IgZWxzZSB0aGUgbmV4dCBuZWFyLXByaW1lIHRoYXQgd291bGQgaGF2ZVxuICAgIGJlZW4gdGVzdGVkLlxuICAgIEZhY3RvcmluZyBzdG9wcyBpZiB0aGVyZSBhcmUgZmFpbF9tYXggdW5zdWNjZXNzZnVsIHRlc3RzIGluIGEgcm93LlxuICAgIElmIGZhY3RvcnMgb2YgbiB3ZXJlIGZvdW5kIHRoZXkgd2lsbCBiZSBpbiB0aGUgZmFjdG9ycyBkaWN0aW9uYXJ5IGFzXG4gICAge2ZhY3RvcjogbXVsdGlwbGljaXR5fSBhbmQgdGhlIHJldHVybmVkIHZhbHVlIG9mIG4gd2lsbCBoYXZlIGhhZCB0aG9zZVxuICAgIGZhY3RvcnMgcmVtb3ZlZC4gVGhlIGZhY3RvcnMgZGljdGlvbmFyeSBpcyBtb2RpZmllZCBpbi1wbGFjZS5cbiAgICAqL1xuICAgIGZ1bmN0aW9uIGRvbmUobjogbnVtYmVyLCBkOiBudW1iZXIpIHtcbiAgICAgICAgLypcbiAgICAgICAgcmV0dXJuIG4sIGQgaWYgdGhlIHNxcnQobikgd2FzIG5vdCByZWFjaGVkIHlldCwgZWxzZVxuICAgICAgICBuLCAwIGluZGljYXRpbmcgdGhhdCBmYWN0b3JpbmcgaXMgZG9uZS5cbiAgICAgICAgKi9cbiAgICAgICAgaWYgKGQqZCA8PSBuKSB7XG4gICAgICAgICAgICByZXR1cm4gW24sIGRdO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBbbiwgMF07XG4gICAgfVxuICAgIGxldCBkID0gMjtcbiAgICBsZXQgbSA9IHRyYWlsaW5nKG4pO1xuICAgIGlmIChtKSB7XG4gICAgICAgIGZhY3RvcnMuYWRkKGQsIG0pO1xuICAgICAgICBuID4+PSBtO1xuICAgIH1cbiAgICBkID0gMztcbiAgICBpZiAobGltaXQgPCBkKSB7XG4gICAgICAgIGlmIChuID4gMSkge1xuICAgICAgICAgICAgZmFjdG9ycy5hZGQobiwgMSk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGRvbmUobiwgZCk7XG4gICAgfVxuICAgIG0gPSAwO1xuICAgIHdoaWxlIChuICUgZCA9PT0gMCkge1xuICAgICAgICBuID0gTWF0aC5mbG9vcihuL2QpO1xuICAgICAgICBtKys7XG4gICAgICAgIGlmIChtID09PSAyMCkge1xuICAgICAgICAgICAgY29uc3QgbW0gPSBtdWx0aXBsaWNpdHkoZCwgbik7XG4gICAgICAgICAgICBtICs9IG1tO1xuICAgICAgICAgICAgbiA9IE1hdGguZmxvb3Iobi8oZCoqbW0pKTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG4gICAgfVxuICAgIGlmIChtKSB7XG4gICAgICAgIGZhY3RvcnMuYWRkKGQsIG0pO1xuICAgIH1cbiAgICBsZXQgbWF4eDtcbiAgICBpZiAobGltaXQgKiBsaW1pdCA+IG4pIHtcbiAgICAgICAgbWF4eCA9IDA7XG4gICAgfSBlbHNlIHtcbiAgICAgICAgbWF4eCA9IGxpbWl0KmxpbWl0O1xuICAgIH1cbiAgICBsZXQgZGQgPSBtYXh4IHx8IG47XG4gICAgZCA9IDU7XG4gICAgbGV0IGZhaWxzID0gMDtcbiAgICB3aGlsZSAoZmFpbHMgPCBmYWlsX21heCkge1xuICAgICAgICBpZiAoZCpkID4gZGQpIHtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG4gICAgICAgIG0gPSAwO1xuICAgICAgICB3aGlsZSAobiAlIGQgPT09IDApIHtcbiAgICAgICAgICAgIG4gPSBNYXRoLmZsb29yKG4vZCk7XG4gICAgICAgICAgICBtKys7XG4gICAgICAgICAgICBpZiAobSA9PT0gMjApIHtcbiAgICAgICAgICAgICAgICBjb25zdCBtbSA9IG11bHRpcGxpY2l0eShkLCBuKTtcbiAgICAgICAgICAgICAgICBtICs9IG1tO1xuICAgICAgICAgICAgICAgIG4gPSBNYXRoLmZsb29yKG4gLyAoZCoqbW0pKTtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBpZiAobSkge1xuICAgICAgICAgICAgZmFjdG9ycy5hZGQoZCwgbSk7XG4gICAgICAgICAgICBkZCA9IG1heHggfHwgbjtcbiAgICAgICAgICAgIGZhaWxzID0gMDtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGZhaWxzKys7XG4gICAgICAgIH1cbiAgICAgICAgZCArPSAyO1xuICAgICAgICBpZiAoZCpkPiBkZCkge1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cbiAgICAgICAgbSA9IDA7XG4gICAgICAgIHdoaWxlIChuICUgZCA9PT0gMCkge1xuICAgICAgICAgICAgbiA9IE1hdGguZmxvb3IobiAvIGQpO1xuICAgICAgICAgICAgbSsrO1xuICAgICAgICAgICAgaWYgKG0gPT09IDIwKSB7XG4gICAgICAgICAgICAgICAgY29uc3QgbW0gPSBtdWx0aXBsaWNpdHkoZCwgbik7XG4gICAgICAgICAgICAgICAgbSArPSBtbTtcbiAgICAgICAgICAgICAgICBuID0gTWF0aC5mbG9vcihuLyhkKiptbSkpO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGlmIChtKSB7XG4gICAgICAgICAgICBmYWN0b3JzLmFkZChkLCBtKTtcbiAgICAgICAgICAgIGRkID0gbWF4eCB8fCBuO1xuICAgICAgICAgICAgZmFpbHMgPSAwO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgZmFpbHMrKztcbiAgICAgICAgfVxuICAgICAgICBkICs9NDtcbiAgICB9XG4gICAgcmV0dXJuIGRvbmUobiwgZCk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBmYWN0b3JpbnQobjogYW55LCBsaW1pdDogYW55ID0gdW5kZWZpbmVkKTogSGFzaERpY3Qge1xuICAgIC8qXG4gICAgR2l2ZW4gYSBwb3NpdGl2ZSBpbnRlZ2VyIGBgbmBgLCBgYGZhY3RvcmludChuKWBgIHJldHVybnMgYSBkaWN0IGNvbnRhaW5pbmdcbiAgICB0aGUgcHJpbWUgZmFjdG9ycyBvZiBgYG5gYCBhcyBrZXlzIGFuZCB0aGVpciByZXNwZWN0aXZlIG11bHRpcGxpY2l0aWVzXG4gICAgYXMgdmFsdWVzLiBGb3IgZXhhbXBsZTpcbiAgICA+Pj4gZnJvbSBzeW1weS5udGhlb3J5IGltcG9ydCBmYWN0b3JpbnRcbiAgICA+Pj4gZmFjdG9yaW50KDIwMDApICAgICMgMjAwMCA9ICgyKio0KSAqICg1KiozKVxuICAgIHsyOiA0LCA1OiAzfVxuICAgID4+PiBmYWN0b3JpbnQoNjU1MzcpICAgIyBUaGlzIG51bWJlciBpcyBwcmltZVxuICAgIHs2NTUzNzogMX1cbiAgICBGb3IgaW5wdXQgbGVzcyB0aGFuIDIsIGZhY3RvcmludCBiZWhhdmVzIGFzIGZvbGxvd3M6XG4gICAgICAgIC0gYGBmYWN0b3JpbnQoMSlgYCByZXR1cm5zIHRoZSBlbXB0eSBmYWN0b3JpemF0aW9uLCBgYHt9YGBcbiAgICAgICAgLSBgYGZhY3RvcmludCgwKWBgIHJldHVybnMgYGB7MDoxfWBgXG4gICAgICAgIC0gYGBmYWN0b3JpbnQoLW4pYGAgYWRkcyBgYC0xOjFgYCB0byB0aGUgZmFjdG9ycyBhbmQgdGhlbiBmYWN0b3JzIGBgbmBgXG4gICAgUGFydGlhbCBGYWN0b3JpemF0aW9uOlxuICAgIElmIGBgbGltaXRgYCAoPiAzKSBpcyBzcGVjaWZpZWQsIHRoZSBzZWFyY2ggaXMgc3RvcHBlZCBhZnRlciBwZXJmb3JtaW5nXG4gICAgdHJpYWwgZGl2aXNpb24gdXAgdG8gKGFuZCBpbmNsdWRpbmcpIHRoZSBsaW1pdCAob3IgdGFraW5nIGFcbiAgICBjb3JyZXNwb25kaW5nIG51bWJlciBvZiByaG8vcC0xIHN0ZXBzKS4gVGhpcyBpcyB1c2VmdWwgaWYgb25lIGhhc1xuICAgIGEgbGFyZ2UgbnVtYmVyIGFuZCBvbmx5IGlzIGludGVyZXN0ZWQgaW4gZmluZGluZyBzbWFsbCBmYWN0b3JzIChpZlxuICAgIGFueSkuIE5vdGUgdGhhdCBzZXR0aW5nIGEgbGltaXQgZG9lcyBub3QgcHJldmVudCBsYXJnZXIgZmFjdG9yc1xuICAgIGZyb20gYmVpbmcgZm91bmQgZWFybHk7IGl0IHNpbXBseSBtZWFucyB0aGF0IHRoZSBsYXJnZXN0IGZhY3RvciBtYXlcbiAgICBiZSBjb21wb3NpdGUuIFNpbmNlIGNoZWNraW5nIGZvciBwZXJmZWN0IHBvd2VyIGlzIHJlbGF0aXZlbHkgY2hlYXAsIGl0IGlzXG4gICAgZG9uZSByZWdhcmRsZXNzIG9mIHRoZSBsaW1pdCBzZXR0aW5nLlxuICAgIFRoaXMgbnVtYmVyLCBmb3IgZXhhbXBsZSwgaGFzIHR3byBzbWFsbCBmYWN0b3JzIGFuZCBhIGh1Z2VcbiAgICBzZW1pLXByaW1lIGZhY3RvciB0aGF0IGNhbm5vdCBiZSByZWR1Y2VkIGVhc2lseTpcbiAgICA+Pj4gZnJvbSBzeW1weS5udGhlb3J5IGltcG9ydCBpc3ByaW1lXG4gICAgPj4+IGEgPSAxNDA3NjMzNzE3MjYyMzM4OTU3NDMwNjk3OTIxNDQ2ODgzXG4gICAgPj4+IGYgPSBmYWN0b3JpbnQoYSwgbGltaXQ9MTAwMDApXG4gICAgPj4+IGYgPT0gezk5MTogMSwgaW50KDIwMjkxNjc4MjA3NjE2MjQ1NjAyMjg3NzAyNDg1OSk6IDEsIDc6IDF9XG4gICAgVHJ1ZVxuICAgID4+PiBpc3ByaW1lKG1heChmKSlcbiAgICBGYWxzZVxuICAgIFRoaXMgbnVtYmVyIGhhcyBhIHNtYWxsIGZhY3RvciBhbmQgYSByZXNpZHVhbCBwZXJmZWN0IHBvd2VyIHdob3NlXG4gICAgYmFzZSBpcyBncmVhdGVyIHRoYW4gdGhlIGxpbWl0OlxuICAgID4+PiBmYWN0b3JpbnQoMyoxMDEqKjcsIGxpbWl0PTUpXG4gICAgezM6IDEsIDEwMTogN31cbiAgICBMaXN0IG9mIEZhY3RvcnM6XG4gICAgSWYgYGBtdWx0aXBsZWBgIGlzIHNldCB0byBgYFRydWVgYCB0aGVuIGEgbGlzdCBjb250YWluaW5nIHRoZVxuICAgIHByaW1lIGZhY3RvcnMgaW5jbHVkaW5nIG11bHRpcGxpY2l0aWVzIGlzIHJldHVybmVkLlxuICAgID4+PiBmYWN0b3JpbnQoMjQsIG11bHRpcGxlPVRydWUpXG4gICAgWzIsIDIsIDIsIDNdXG4gICAgVmlzdWFsIEZhY3Rvcml6YXRpb246XG4gICAgSWYgYGB2aXN1YWxgYCBpcyBzZXQgdG8gYGBUcnVlYGAsIHRoZW4gaXQgd2lsbCByZXR1cm4gYSB2aXN1YWxcbiAgICBmYWN0b3JpemF0aW9uIG9mIHRoZSBpbnRlZ2VyLiAgRm9yIGV4YW1wbGU6XG4gICAgPj4+IGZyb20gc3ltcHkgaW1wb3J0IHBwcmludFxuICAgID4+PiBwcHJpbnQoZmFjdG9yaW50KDQyMDAsIHZpc3VhbD1UcnVlKSlcbiAgICAgMyAgMSAgMiAgMVxuICAgIDIgKjMgKjUgKjdcbiAgICBOb3RlIHRoYXQgdGhpcyBpcyBhY2hpZXZlZCBieSB1c2luZyB0aGUgZXZhbHVhdGU9RmFsc2UgZmxhZyBpbiBNdWxcbiAgICBhbmQgUG93LiBJZiB5b3UgZG8gb3RoZXIgbWFuaXB1bGF0aW9ucyB3aXRoIGFuIGV4cHJlc3Npb24gd2hlcmVcbiAgICBldmFsdWF0ZT1GYWxzZSwgaXQgbWF5IGV2YWx1YXRlLiAgVGhlcmVmb3JlLCB5b3Ugc2hvdWxkIHVzZSB0aGVcbiAgICB2aXN1YWwgb3B0aW9uIG9ubHkgZm9yIHZpc3VhbGl6YXRpb24sIGFuZCB1c2UgdGhlIG5vcm1hbCBkaWN0aW9uYXJ5XG4gICAgcmV0dXJuZWQgYnkgdmlzdWFsPUZhbHNlIGlmIHlvdSB3YW50IHRvIHBlcmZvcm0gb3BlcmF0aW9ucyBvbiB0aGVcbiAgICBmYWN0b3JzLlxuICAgIFlvdSBjYW4gZWFzaWx5IHN3aXRjaCBiZXR3ZWVuIHRoZSB0d28gZm9ybXMgYnkgc2VuZGluZyB0aGVtIGJhY2sgdG9cbiAgICBmYWN0b3JpbnQ6XG4gICAgPj4+IGZyb20gc3ltcHkgaW1wb3J0IE11bFxuICAgID4+PiByZWd1bGFyID0gZmFjdG9yaW50KDE3NjQpOyByZWd1bGFyXG4gICAgezI6IDIsIDM6IDIsIDc6IDJ9XG4gICAgPj4+IHBwcmludChmYWN0b3JpbnQocmVndWxhcikpXG4gICAgIDIgIDIgIDJcbiAgICAyICozICo3XG4gICAgPj4+IHZpc3VhbCA9IGZhY3RvcmludCgxNzY0LCB2aXN1YWw9VHJ1ZSk7IHBwcmludCh2aXN1YWwpXG4gICAgIDIgIDIgIDJcbiAgICAyICozICo3XG4gICAgPj4+IHByaW50KGZhY3RvcmludCh2aXN1YWwpKVxuICAgIHsyOiAyLCAzOiAyLCA3OiAyfVxuICAgIElmIHlvdSB3YW50IHRvIHNlbmQgYSBudW1iZXIgdG8gYmUgZmFjdG9yZWQgaW4gYSBwYXJ0aWFsbHkgZmFjdG9yZWQgZm9ybVxuICAgIHlvdSBjYW4gZG8gc28gd2l0aCBhIGRpY3Rpb25hcnkgb3IgdW5ldmFsdWF0ZWQgZXhwcmVzc2lvbjpcbiAgICA+Pj4gZmFjdG9yaW50KGZhY3RvcmludCh7NDogMiwgMTI6IDN9KSkgIyB0d2ljZSB0byB0b2dnbGUgdG8gZGljdCBmb3JtXG4gICAgezI6IDEwLCAzOiAzfVxuICAgID4+PiBmYWN0b3JpbnQoTXVsKDQsIDEyLCBldmFsdWF0ZT1GYWxzZSkpXG4gICAgezI6IDQsIDM6IDF9XG4gICAgVGhlIHRhYmxlIG9mIHRoZSBvdXRwdXQgbG9naWMgaXM6XG4gICAgICAgID09PT09PSA9PT09PT0gPT09PT09PSA9PT09PT09XG4gICAgICAgICAgICAgICAgICAgICAgIFZpc3VhbFxuICAgICAgICAtLS0tLS0gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgICAgICBJbnB1dCAgVHJ1ZSAgIEZhbHNlICAgb3RoZXJcbiAgICAgICAgPT09PT09ID09PT09PSA9PT09PT09ID09PT09PT1cbiAgICAgICAgZGljdCAgICBtdWwgICAgZGljdCAgICBtdWxcbiAgICAgICAgbiAgICAgICBtdWwgICAgZGljdCAgICBkaWN0XG4gICAgICAgIG11bCAgICAgbXVsICAgIGRpY3QgICAgZGljdFxuICAgICAgICA9PT09PT0gPT09PT09ID09PT09PT0gPT09PT09PVxuICAgIE5vdGVzXG4gICAgPT09PT1cbiAgICBBbGdvcml0aG06XG4gICAgVGhlIGZ1bmN0aW9uIHN3aXRjaGVzIGJldHdlZW4gbXVsdGlwbGUgYWxnb3JpdGhtcy4gVHJpYWwgZGl2aXNpb25cbiAgICBxdWlja2x5IGZpbmRzIHNtYWxsIGZhY3RvcnMgKG9mIHRoZSBvcmRlciAxLTUgZGlnaXRzKSwgYW5kIGZpbmRzXG4gICAgYWxsIGxhcmdlIGZhY3RvcnMgaWYgZ2l2ZW4gZW5vdWdoIHRpbWUuIFRoZSBQb2xsYXJkIHJobyBhbmQgcC0xXG4gICAgYWxnb3JpdGhtcyBhcmUgdXNlZCB0byBmaW5kIGxhcmdlIGZhY3RvcnMgYWhlYWQgb2YgdGltZTsgdGhleVxuICAgIHdpbGwgb2Z0ZW4gZmluZCBmYWN0b3JzIG9mIHRoZSBvcmRlciBvZiAxMCBkaWdpdHMgd2l0aGluIGEgZmV3XG4gICAgc2Vjb25kczpcbiAgICA+Pj4gZmFjdG9ycyA9IGZhY3RvcmludCgxMjM0NTY3ODkxMDExMTIxMzE0MTUxNilcbiAgICA+Pj4gZm9yIGJhc2UsIGV4cCBpbiBzb3J0ZWQoZmFjdG9ycy5pdGVtcygpKTpcbiAgICAuLi4gICAgIHByaW50KCclcyAlcycgJSAoYmFzZSwgZXhwKSlcbiAgICAuLi5cbiAgICAyIDJcbiAgICAyNTA3MTkxNjkxIDFcbiAgICAxMjMxMDI2NjI1NzY5IDFcbiAgICBBbnkgb2YgdGhlc2UgbWV0aG9kcyBjYW4gb3B0aW9uYWxseSBiZSBkaXNhYmxlZCB3aXRoIHRoZSBmb2xsb3dpbmdcbiAgICBib29sZWFuIHBhcmFtZXRlcnM6XG4gICAgICAgIC0gYGB1c2VfdHJpYWxgYDogVG9nZ2xlIHVzZSBvZiB0cmlhbCBkaXZpc2lvblxuICAgICAgICAtIGBgdXNlX3Job2BgOiBUb2dnbGUgdXNlIG9mIFBvbGxhcmQncyByaG8gbWV0aG9kXG4gICAgICAgIC0gYGB1c2VfcG0xYGA6IFRvZ2dsZSB1c2Ugb2YgUG9sbGFyZCdzIHAtMSBtZXRob2RcbiAgICBgYGZhY3RvcmludGBgIGFsc28gcGVyaW9kaWNhbGx5IGNoZWNrcyBpZiB0aGUgcmVtYWluaW5nIHBhcnQgaXNcbiAgICBhIHByaW1lIG51bWJlciBvciBhIHBlcmZlY3QgcG93ZXIsIGFuZCBpbiB0aG9zZSBjYXNlcyBzdG9wcy5cbiAgICBGb3IgdW5ldmFsdWF0ZWQgZmFjdG9yaWFsLCBpdCB1c2VzIExlZ2VuZHJlJ3MgZm9ybXVsYSh0aGVvcmVtKS5cbiAgICBJZiBgYHZlcmJvc2VgYCBpcyBzZXQgdG8gYGBUcnVlYGAsIGRldGFpbGVkIHByb2dyZXNzIGlzIHByaW50ZWQuXG4gICAgU2VlIEFsc29cbiAgICA9PT09PT09PVxuICAgIHNtb290aG5lc3MsIHNtb290aG5lc3NfcCwgZGl2aXNvcnNcbiAgICAqL1xuICAgIGlmIChuIGluc3RhbmNlb2YgSW50ZWdlcikge1xuICAgICAgICBuID0gbi5wO1xuICAgIH1cbiAgICBuID0gYXNfaW50KG4pO1xuICAgIGlmIChsaW1pdCkge1xuICAgICAgICBsaW1pdCA9IGxpbWl0IGFzIG51bWJlcjtcbiAgICB9XG4gICAgaWYgKG4gPCAwKSB7XG4gICAgICAgIGNvbnN0IGZhY3RvcnMgPSBmYWN0b3JpbnQoLW4sIGxpbWl0KTtcbiAgICAgICAgZmFjdG9ycy5hZGQoZmFjdG9ycy5zaXplIC0gMSwgMSk7XG4gICAgICAgIHJldHVybiBmYWN0b3JzO1xuICAgIH1cbiAgICBpZiAobGltaXQgJiYgbGltaXQgPCAyKSB7XG4gICAgICAgIGlmIChuID09PSAxKSB7XG4gICAgICAgICAgICByZXR1cm4gbmV3IEhhc2hEaWN0KCk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIG5ldyBIYXNoRGljdCh7bjogMX0pO1xuICAgIH0gZWxzZSBpZiAobiA8IDEwKSB7XG4gICAgICAgIHJldHVybiBuZXcgSGFzaERpY3QoW3swOiAxfSwge30sIHsyOiAxfSwgezM6IDF9LCB7MjogMn0sIHs1OiAxfSxcbiAgICAgICAgICAgIHsyOiAxLCAzOiAxfSwgezc6IDF9LCB7MjogM30sIHszOiAyfV1bbl0pO1xuICAgIH1cblxuICAgIGNvbnN0IGZhY3RvcnMgPSBuZXcgSGFzaERpY3QoKTtcbiAgICBsZXQgc21hbGwgPSAyKioxNTtcbiAgICBjb25zdCBmYWlsX21heCA9IDYwMDtcbiAgICBzbWFsbCA9IE1hdGgubWluKHNtYWxsLCBsaW1pdCB8fCBzbWFsbCk7XG4gICAgbGV0IG5leHRfcDtcbiAgICBbbiwgbmV4dF9wXSA9IF9mYWN0b3JpbnRfc21hbGwoZmFjdG9ycywgbiwgc21hbGwsIGZhaWxfbWF4KTtcbiAgICBsZXQgc3FydF9uOiBhbnk7XG4gICAgdHJ5IHtcbiAgICAgICAgaWYgKGxpbWl0ICYmIG5leHRfcCA+IGxpbWl0KSB7XG4gICAgICAgICAgICBfY2hlY2tfdGVybWluYXRpb24oZmFjdG9ycywgbiwgbGltaXQpO1xuICAgICAgICAgICAgaWYgKG4gPiAxKSB7XG4gICAgICAgICAgICAgICAgZmFjdG9ycy5hZGQobiwgMSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gZmFjdG9ycztcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHNxcnRfbiA9IGludF9udGhyb290KG4sIDIpWzBdO1xuICAgICAgICAgICAgbGV0IGEgPSBzcXJ0X24gKyAxO1xuICAgICAgICAgICAgY29uc3QgYTIgPSBhKioyO1xuICAgICAgICAgICAgbGV0IGIyID0gYTIgLSBuO1xuICAgICAgICAgICAgbGV0IGI6IGFueTsgbGV0IGZlcm1hdDogYW55O1xuICAgICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCAzOyBpKyspIHtcbiAgICAgICAgICAgICAgICBbYiwgZmVybWF0XSA9IGludF9udGhyb290KGIyLCAyKTtcbiAgICAgICAgICAgICAgICBpZiAoZmVybWF0KSB7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBiMiArPSAyKmEgKyAxO1xuICAgICAgICAgICAgICAgIGErKztcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChmZXJtYXQpIHtcbiAgICAgICAgICAgICAgICBpZiAobGltaXQpIHtcbiAgICAgICAgICAgICAgICAgICAgbGltaXQgLT0gMTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZm9yIChjb25zdCByIG9mIFthIC0gYiwgYSArIGJdKSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGZhY3MgPSBmYWN0b3JpbnQociwgbGltaXQpO1xuICAgICAgICAgICAgICAgICAgICBmb3IgKGNvbnN0IFtrLCB2XSBvZiBmYWNzLmVudHJpZXMoKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgZmFjdG9ycy5hZGQoaywgZmFjdG9ycy5nZXQoaywgMCkgKyB2KTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIF9jaGVja190ZXJtaW5hdGlvbihmYWN0b3JzLCBuLCBsaW1pdCk7XG4gICAgICAgIH1cbiAgICB9IGNhdGNoIChFcnJvcikge1xuICAgICAgICByZXR1cm4gZmFjdG9ycztcbiAgICB9XG5cbiAgICBsZXQgW2xvdywgaGlnaF0gPSBbbmV4dF9wLCAyICogbmV4dF9wXTtcbiAgICBsaW1pdCA9IChsaW1pdCB8fCBzcXJ0X24pIGFzIG51bWJlcjtcbiAgICBsaW1pdCsrO1xuICAgIHdoaWxlICgxKSB7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICBsZXQgaGlnaF8gPSBoaWdoO1xuICAgICAgICAgICAgaWYgKGxpbWl0IDwgaGlnaF8pIHtcbiAgICAgICAgICAgICAgICBoaWdoXyA9IGxpbWl0O1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgY29uc3QgcHMgPSBwcmltZXJhbmdlKGxvdywgaGlnaF8pO1xuICAgICAgICAgICAgbGV0IGZvdW5kX3RyaWFsO1xuICAgICAgICAgICAgW24sIGZvdW5kX3RyaWFsXSA9IF90cmlhbChmYWN0b3JzLCBuLCBwcyk7XG4gICAgICAgICAgICBpZiAoZm91bmRfdHJpYWwpIHtcbiAgICAgICAgICAgICAgICBfY2hlY2tfdGVybWluYXRpb24oZmFjdG9ycywgbiwgbGltaXQpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKGhpZ2ggPiBsaW1pdCkge1xuICAgICAgICAgICAgICAgIGlmIChuID4gMSkge1xuICAgICAgICAgICAgICAgICAgICBmYWN0b3JzLmFkZChuLCAxKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoIWZvdW5kX3RyaWFsKSB7XG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiYWR2YW5jZWQgZmFjdG9yaW5nIG1ldGhvZHMgYXJlIG5vdCB5ZXQgaW1wbGVtZW50ZWRcIik7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0gY2F0Y2ggKEVycm9yKSB7XG4gICAgICAgICAgICByZXR1cm4gZmFjdG9ycztcbiAgICAgICAgfVxuICAgICAgICBbbG93LCBoaWdoXSA9IFtoaWdoLCBoaWdoKjJdO1xuICAgIH1cbiAgICBsZXQgQjEgPSAxMDAwMDtcbiAgICBsZXQgQjIgPSAxMDAqQjE7XG4gICAgbGV0IG51bV9jdXJ2ZXMgPSA1MDtcbiAgICB3aGlsZSAoMSkge1xuICAgICAgICB3aGlsZSAoMSkge1xuICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJlY20gb25lIGZhY3RvciBub3QgeWV0IGltcGxlbWVudGVkXCIpO1xuICAgICAgICAgICAgICAgIC8vIF9jaGVja190ZXJtaW5hdGlvbihmYWN0b3JzLCBuLCBsaW1pdCk7XG4gICAgICAgICAgICB9IGNhdGNoIChFcnJvcikge1xuICAgICAgICAgICAgICAgIHJldHVybiBmYWN0b3JzO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIEIxICo9IDU7XG4gICAgICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBuby11bnVzZWQtdmFyc1xuICAgICAgICBCMiA9IDEwMCpCMTtcbiAgICAgICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5vLXVudXNlZC12YXJzXG4gICAgICAgIG51bV9jdXJ2ZXMgKj0gNDtcbiAgICB9XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBwZXJmZWN0X3Bvd2VyKG46IGFueSwgY2FuZGlkYXRlczogYW55ID0gdW5kZWZpbmVkLCBiaWc6IGJvb2xlYW4gPSB0cnVlLFxuICAgIGZhY3RvcjogYm9vbGVhbiA9IHRydWUsIG51bV9pdGVyYXRpb25zOiBudW1iZXIgPSAxNSk6IGFueSB7XG4gICAgLypcbiAgICBSZXR1cm4gYGAoYiwgZSlgYCBzdWNoIHRoYXQgYGBuYGAgPT0gYGBiKiplYGAgaWYgYGBuYGAgaXMgYSB1bmlxdWVcbiAgICBwZXJmZWN0IHBvd2VyIHdpdGggYGBlID4gMWBgLCBlbHNlIGBgRmFsc2VgYCAoZS5nLiAxIGlzIG5vdCBhXG4gICAgcGVyZmVjdCBwb3dlcikuIEEgVmFsdWVFcnJvciBpcyByYWlzZWQgaWYgYGBuYGAgaXMgbm90IFJhdGlvbmFsLlxuICAgIEJ5IGRlZmF1bHQsIHRoZSBiYXNlIGlzIHJlY3Vyc2l2ZWx5IGRlY29tcG9zZWQgYW5kIHRoZSBleHBvbmVudHNcbiAgICBjb2xsZWN0ZWQgc28gdGhlIGxhcmdlc3QgcG9zc2libGUgYGBlYGAgaXMgc291Z2h0LiBJZiBgYGJpZz1GYWxzZWBgXG4gICAgdGhlbiB0aGUgc21hbGxlc3QgcG9zc2libGUgYGBlYGAgKHRodXMgcHJpbWUpIHdpbGwgYmUgY2hvc2VuLlxuICAgIElmIGBgZmFjdG9yPVRydWVgYCB0aGVuIHNpbXVsdGFuZW91cyBmYWN0b3JpemF0aW9uIG9mIGBgbmBgIGlzXG4gICAgYXR0ZW1wdGVkIHNpbmNlIGZpbmRpbmcgYSBmYWN0b3IgaW5kaWNhdGVzIHRoZSBvbmx5IHBvc3NpYmxlIHJvb3RcbiAgICBmb3IgYGBuYGAuIFRoaXMgaXMgVHJ1ZSBieSBkZWZhdWx0IHNpbmNlIG9ubHkgYSBmZXcgc21hbGwgZmFjdG9ycyB3aWxsXG4gICAgYmUgdGVzdGVkIGluIHRoZSBjb3Vyc2Ugb2Ygc2VhcmNoaW5nIGZvciB0aGUgcGVyZmVjdCBwb3dlci5cbiAgICBUaGUgdXNlIG9mIGBgY2FuZGlkYXRlc2BgIGlzIHByaW1hcmlseSBmb3IgaW50ZXJuYWwgdXNlOyBpZiBwcm92aWRlZCxcbiAgICBGYWxzZSB3aWxsIGJlIHJldHVybmVkIGlmIGBgbmBgIGNhbm5vdCBiZSB3cml0dGVuIGFzIGEgcG93ZXIgd2l0aCBvbmVcbiAgICBvZiB0aGUgY2FuZGlkYXRlcyBhcyBhbiBleHBvbmVudCBhbmQgZmFjdG9yaW5nIChiZXlvbmQgdGVzdGluZyBmb3JcbiAgICBhIGZhY3RvciBvZiAyKSB3aWxsIG5vdCBiZSBhdHRlbXB0ZWQuXG4gICAgRXhhbXBsZXNcbiAgICA9PT09PT09PVxuICAgID4+PiBmcm9tIHN5bXB5IGltcG9ydCBwZXJmZWN0X3Bvd2VyLCBSYXRpb25hbFxuICAgID4+PiBwZXJmZWN0X3Bvd2VyKDE2KVxuICAgICgyLCA0KVxuICAgID4+PiBwZXJmZWN0X3Bvd2VyKDE2LCBiaWc9RmFsc2UpXG4gICAgKDQsIDIpXG4gICAgTmVnYXRpdmUgbnVtYmVycyBjYW4gb25seSBoYXZlIG9kZCBwZXJmZWN0IHBvd2VyczpcbiAgICA+Pj4gcGVyZmVjdF9wb3dlcigtNClcbiAgICBGYWxzZVxuICAgID4+PiBwZXJmZWN0X3Bvd2VyKC04KVxuICAgICgtMiwgMylcbiAgICBSYXRpb25hbHMgYXJlIGFsc28gcmVjb2duaXplZDpcbiAgICA+Pj4gcGVyZmVjdF9wb3dlcihSYXRpb25hbCgxLCAyKSoqMylcbiAgICAoMS8yLCAzKVxuICAgID4+PiBwZXJmZWN0X3Bvd2VyKFJhdGlvbmFsKC0zLCAyKSoqMylcbiAgICAoLTMvMiwgMylcbiAgICBOb3Rlc1xuICAgID09PT09XG4gICAgVG8ga25vdyB3aGV0aGVyIGFuIGludGVnZXIgaXMgYSBwZXJmZWN0IHBvd2VyIG9mIDIgdXNlXG4gICAgICAgID4+PiBpczJwb3cgPSBsYW1iZGEgbjogYm9vbChuIGFuZCBub3QgbiAmIChuIC0gMSkpXG4gICAgICAgID4+PiBbKGksIGlzMnBvdyhpKSkgZm9yIGkgaW4gcmFuZ2UoNSldXG4gICAgICAgIFsoMCwgRmFsc2UpLCAoMSwgVHJ1ZSksICgyLCBUcnVlKSwgKDMsIEZhbHNlKSwgKDQsIFRydWUpXVxuICAgIEl0IGlzIG5vdCBuZWNlc3NhcnkgdG8gcHJvdmlkZSBgYGNhbmRpZGF0ZXNgYC4gV2hlbiBwcm92aWRlZFxuICAgIGl0IHdpbGwgYmUgYXNzdW1lZCB0aGF0IHRoZXkgYXJlIGludHMuIFRoZSBmaXJzdCBvbmUgdGhhdCBpc1xuICAgIGxhcmdlciB0aGFuIHRoZSBjb21wdXRlZCBtYXhpbXVtIHBvc3NpYmxlIGV4cG9uZW50IHdpbGwgc2lnbmFsXG4gICAgZmFpbHVyZSBmb3IgdGhlIHJvdXRpbmUuXG4gICAgICAgID4+PiBwZXJmZWN0X3Bvd2VyKDMqKjgsIFs5XSlcbiAgICAgICAgRmFsc2VcbiAgICAgICAgPj4+IHBlcmZlY3RfcG93ZXIoMyoqOCwgWzIsIDQsIDhdKVxuICAgICAgICAoMywgOClcbiAgICAgICAgPj4+IHBlcmZlY3RfcG93ZXIoMyoqOCwgWzQsIDhdLCBiaWc9RmFsc2UpXG4gICAgICAgICg5LCA0KVxuICAgIFNlZSBBbHNvXG4gICAgPT09PT09PT1cbiAgICBzeW1weS5jb3JlLnBvd2VyLmludGVnZXJfbnRocm9vdFxuICAgIHN5bXB5Lm50aGVvcnkucHJpbWV0ZXN0LmlzX3NxdWFyZVxuICAgICovXG4gICAgbGV0IHBwO1xuICAgIGlmIChuIGluc3RhbmNlb2YgUmF0aW9uYWwgJiYgIShuLmlzX2ludGVnZXIpKSB7XG4gICAgICAgIGNvbnN0IFtwLCBxXSA9IG4uX2FzX251bWVyX2Rlbm9tKCk7XG4gICAgICAgIGlmIChwID09PSBTLk9uZSkge1xuICAgICAgICAgICAgcHAgPSBwZXJmZWN0X3Bvd2VyKHEpO1xuICAgICAgICAgICAgaWYgKHBwKSB7XG4gICAgICAgICAgICAgICAgcHAgPSBbbi5jb25zdHJ1Y3RvcigxLCBwcFswXSksIHBwWzFdXTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHBwID0gcGVyZmVjdF9wb3dlcihwKTtcbiAgICAgICAgICAgIGlmIChwcCkge1xuICAgICAgICAgICAgICAgIGNvbnN0IFtudW0sIGVdID0gcHA7XG4gICAgICAgICAgICAgICAgY29uc3QgcHEgPSBwZXJmZWN0X3Bvd2VyKHEsIFtlXSk7XG4gICAgICAgICAgICAgICAgaWYgKHBxKSB7XG4gICAgICAgICAgICAgICAgICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBuby11bnVzZWQtdmFyc1xuICAgICAgICAgICAgICAgICAgICBjb25zdCBbZGVuLCBibGFua10gPSBwcTtcbiAgICAgICAgICAgICAgICAgICAgcHAgPSBbbi5jb25zdHJ1Y3RvcihudW0sIGRlbiksIGVdO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gcHA7XG4gICAgfVxuXG4gICAgbiA9IGFzX2ludChuKTtcbiAgICBpZiAobiA8IDApIHtcbiAgICAgICAgcHAgPSBwZXJmZWN0X3Bvd2VyKC1uKTtcbiAgICAgICAgaWYgKHBwKSB7XG4gICAgICAgICAgICBjb25zdCBbYiwgZV0gPSBwcDtcbiAgICAgICAgICAgIGlmIChlICUgMiAhPT0gMCkge1xuICAgICAgICAgICAgICAgIHJldHVybiBbLWIsIGVdO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG5cbiAgICBpZiAobiA8PSAzKSB7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG5cbiAgICBjb25zdCBsb2duID0gTWF0aC5sb2cyKG4pO1xuICAgIGNvbnN0IG1heF9wb3NzaWJsZSA9IE1hdGguZmxvb3IobG9nbikgKyAyO1xuICAgIGNvbnN0IG5vdF9zcXVhcmUgPSBbMiwgMywgNywgOF0uaW5jbHVkZXMobiAlIDEwKTtcbiAgICBjb25zdCBtaW5fcG9zc2libGUgPSAyICsgKG5vdF9zcXVhcmUgYXMgYW55IGFzIG51bWJlcik7XG4gICAgaWYgKHR5cGVvZiBjYW5kaWRhdGVzID09PSBcInVuZGVmaW5lZFwiKSB7XG4gICAgICAgIGNhbmRpZGF0ZXMgPSBwcmltZXJhbmdlKG1pbl9wb3NzaWJsZSwgbWF4X3Bvc3NpYmxlKTtcbiAgICB9IGVsc2Uge1xuICAgICAgICBjb25zdCB0ZW1wID0gW107XG4gICAgICAgIGNhbmRpZGF0ZXMuc29ydCgpO1xuICAgICAgICBmb3IgKGNvbnN0IGkgb2YgY2FuZGlkYXRlcykge1xuICAgICAgICAgICAgaWYgKG1pbl9wb3NzaWJsZSA8PSBpICYmIGkgPD0gbWF4X3Bvc3NpYmxlKSB7XG4gICAgICAgICAgICAgICAgdGVtcC5wdXNoKGkpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGNhbmRpZGF0ZXMgPSB0ZW1wO1xuICAgICAgICBpZiAobiAlIDIgPT09IDApIHtcbiAgICAgICAgICAgIGNvbnN0IGUgPSB0cmFpbGluZyhuKTtcbiAgICAgICAgICAgIGNvbnN0IHRlbXAyID0gW107XG4gICAgICAgICAgICBmb3IgKGNvbnN0IGkgb2YgY2FuZGlkYXRlcykge1xuICAgICAgICAgICAgICAgIGlmIChlICUgaSA9PT0gMCkge1xuICAgICAgICAgICAgICAgICAgICB0ZW1wMi5wdXNoKGkpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGNhbmRpZGF0ZXMgPSB0ZW1wMjtcbiAgICAgICAgfVxuICAgICAgICBpZiAoYmlnKSB7XG4gICAgICAgICAgICBjYW5kaWRhdGVzLnJldmVyc2UoKTtcbiAgICAgICAgfVxuICAgICAgICBmb3IgKGNvbnN0IGUgb2YgY2FuZGlkYXRlcykge1xuICAgICAgICAgICAgY29uc3QgW3IsIG9rXSA9IGludF9udGhyb290KG4sIGUpO1xuICAgICAgICAgICAgaWYgKG9rKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIFtyLCBlXTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICAgIGZ1bmN0aW9uKiBfZmFjdG9ycyhsZW5ndGg6IG51bWJlcikge1xuICAgICAgICBsZXQgcnYgPSAyICsgbiAlIDI7XG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgbGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIHlpZWxkIHJ2O1xuICAgICAgICAgICAgcnYgPSBuZXh0cHJpbWUocnYpO1xuICAgICAgICB9XG4gICAgfVxuICAgIC8vIG9yaWdpbmFsIGFsZ29yaXRobSBnZW5lcmF0ZXMgaW5maW5pdGUgc2VxdWVuY2VzIG9mIHRoZSBmb2xsb3dpbmdcbiAgICAvLyBmb3Igbm93IHdlIHdpbGwgZ2VuZXJhdGUgbGltaXRlZCBzaXplZCBhcnJheXMgYW5kIHVzZSB0aG9zZVxuICAgIGNvbnN0IF9jYW5kaWRhdGVzID0gW107XG4gICAgZm9yIChjb25zdCBpIG9mIGNhbmRpZGF0ZXMpIHtcbiAgICAgICAgX2NhbmRpZGF0ZXMucHVzaChpKTtcbiAgICB9XG4gICAgY29uc3QgX2ZhY3RvcnNfID0gW107XG4gICAgZm9yIChjb25zdCBpIG9mIF9mYWN0b3JzKF9jYW5kaWRhdGVzLmxlbmd0aCkpIHtcbiAgICAgICAgX2ZhY3RvcnNfLnB1c2goaSk7XG4gICAgfVxuICAgIGZvciAoY29uc3QgaXRlbSBvZiBVdGlsLnppcChfZmFjdG9yc18sIF9jYW5kaWRhdGVzKSkge1xuICAgICAgICBjb25zdCBmYWMgPSBpdGVtWzBdO1xuICAgICAgICBsZXQgZSA9IGl0ZW1bMV07XG4gICAgICAgIGxldCByO1xuICAgICAgICBsZXQgZXhhY3Q7XG4gICAgICAgIGlmIChmYWN0b3IgJiYgbiAlIGZhYyA9PT0gMCkge1xuICAgICAgICAgICAgaWYgKGZhYyA9PT0gMikge1xuICAgICAgICAgICAgICAgIGUgPSB0cmFpbGluZyhuKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgZSA9IG11bHRpcGxpY2l0eShmYWMsIG4pO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKGUgPT09IDEpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIFtyLCBleGFjdF0gPSBpbnRfbnRocm9vdChuLCBlKTtcbiAgICAgICAgICAgIGlmICghKGV4YWN0KSkge1xuICAgICAgICAgICAgICAgIGNvbnN0IG0gPSBNYXRoLmZsb29yKG4gLyBmYWMpICoqIGU7XG4gICAgICAgICAgICAgICAgY29uc3QgckUgPSBwZXJmZWN0X3Bvd2VyKG0sIGRpdmlzb3JzKGUsIHRydWUpKTtcbiAgICAgICAgICAgICAgICBpZiAoIShyRSkpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIGxldCBbciwgRV0gPSByRTtcbiAgICAgICAgICAgICAgICAgICAgW3IsIGVdID0gW2ZhYyoqKE1hdGguZmxvb3IoZS9FKSpyKSwgRV07XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIFtyLCBlXTtcbiAgICAgICAgfVxuICAgICAgICBpZiAobG9nbi9lIDwgNDApIHtcbiAgICAgICAgICAgIGNvbnN0IGIgPSAyLjAqKihsb2duL2UpO1xuICAgICAgICAgICAgaWYgKE1hdGguYWJzKE1hdGguZmxvb3IoYiArIDAuNSkgLSBiKSA+IDAuMDEpIHtcbiAgICAgICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBbciwgZXhhY3RdID0gaW50X250aHJvb3QobiwgZSk7XG4gICAgICAgIGlmIChleGFjdCkge1xuICAgICAgICAgICAgY29uc3QgbSA9IHBlcmZlY3RfcG93ZXIociwgdW5kZWZpbmVkLCBiaWcsIGZhY3Rvcik7XG4gICAgICAgICAgICBpZiAobSkge1xuICAgICAgICAgICAgICAgIFtyLCBlXSA9IFttWzBdLCBlICogbVsxXV07XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gW01hdGguZmxvb3IociksIGVdO1xuICAgICAgICB9XG4gICAgfVxuICAgIHJldHVybiBmYWxzZTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGZhY3RvcnJhdChyYXQ6IGFueSwgbGltaXQ6IG51bWJlciA9IHVuZGVmaW5lZCkge1xuICAgIC8qXG4gICAgR2l2ZW4gYSBSYXRpb25hbCBgYHJgYCwgYGBmYWN0b3JyYXQocilgYCByZXR1cm5zIGEgZGljdCBjb250YWluaW5nXG4gICAgdGhlIHByaW1lIGZhY3RvcnMgb2YgYGByYGAgYXMga2V5cyBhbmQgdGhlaXIgcmVzcGVjdGl2ZSBtdWx0aXBsaWNpdGllc1xuICAgIGFzIHZhbHVlcy4gRm9yIGV4YW1wbGU6XG4gICAgPj4+IGZyb20gc3ltcHkgaW1wb3J0IGZhY3RvcnJhdCwgU1xuICAgID4+PiBmYWN0b3JyYXQoUyg4KS85KSAgICAjIDgvOSA9ICgyKiozKSAqICgzKiotMilcbiAgICB7MjogMywgMzogLTJ9XG4gICAgPj4+IGZhY3RvcnJhdChTKC0xKS85ODcpICAgICMgLTEvNzg5ID0gLTEgKiAoMyoqLTEpICogKDcqKi0xKSAqICg0NyoqLTEpXG4gICAgey0xOiAxLCAzOiAtMSwgNzogLTEsIDQ3OiAtMX1cbiAgICBQbGVhc2Ugc2VlIHRoZSBkb2NzdHJpbmcgZm9yIGBgZmFjdG9yaW50YGAgZm9yIGRldGFpbGVkIGV4cGxhbmF0aW9uc1xuICAgIGFuZCBleGFtcGxlcyBvZiB0aGUgZm9sbG93aW5nIGtleXdvcmRzOlxuICAgICAgICAtIGBgbGltaXRgYDogSW50ZWdlciBsaW1pdCB1cCB0byB3aGljaCB0cmlhbCBkaXZpc2lvbiBpcyBkb25lXG4gICAgICAgIC0gYGB1c2VfdHJpYWxgYDogVG9nZ2xlIHVzZSBvZiB0cmlhbCBkaXZpc2lvblxuICAgICAgICAtIGBgdXNlX3Job2BgOiBUb2dnbGUgdXNlIG9mIFBvbGxhcmQncyByaG8gbWV0aG9kXG4gICAgICAgIC0gYGB1c2VfcG0xYGA6IFRvZ2dsZSB1c2Ugb2YgUG9sbGFyZCdzIHAtMSBtZXRob2RcbiAgICAgICAgLSBgYHZlcmJvc2VgYDogVG9nZ2xlIGRldGFpbGVkIHByaW50aW5nIG9mIHByb2dyZXNzXG4gICAgICAgIC0gYGBtdWx0aXBsZWBgOiBUb2dnbGUgcmV0dXJuaW5nIGEgbGlzdCBvZiBmYWN0b3JzIG9yIGRpY3RcbiAgICAgICAgLSBgYHZpc3VhbGBgOiBUb2dnbGUgcHJvZHVjdCBmb3JtIG9mIG91dHB1dFxuICAgICovXG4gICAgY29uc3QgZiA9IGZhY3RvcmludChyYXQucCwgbGltaXQpO1xuICAgIGZvciAoY29uc3QgaXRlbSBvZiBmYWN0b3JpbnQocmF0LnEsIGxpbWl0KS5lbnRyaWVzKCkpIHtcbiAgICAgICAgY29uc3QgcCA9IGl0ZW1bMF07XG4gICAgICAgIGNvbnN0IGUgPSBpdGVtWzFdO1xuICAgICAgICBmLmFkZChwLCBmLmdldChwLCAwKSAtIGUpO1xuICAgIH1cbiAgICBpZiAoZi5zaXplID4gMSAmJiBmLmhhcygxKSkge1xuICAgICAgICBmLnJlbW92ZSgxKTtcbiAgICB9XG4gICAgcmV0dXJuIGY7XG59XG4iLCAiXG5pbXBvcnQge01hbmFnZWRQcm9wZXJ0aWVzfSBmcm9tIFwiLi9hc3N1bXB0aW9ucy5qc1wiO1xuaW1wb3J0IHtfRXhwcn0gZnJvbSBcIi4vZXhwci5qc1wiO1xuaW1wb3J0IHtHbG9iYWx9IGZyb20gXCIuL2dsb2JhbC5qc1wiO1xuaW1wb3J0IHtfTnVtYmVyX30gZnJvbSBcIi4vbnVtYmVycy5qc1wiO1xuaW1wb3J0IHtnbG9iYWxfcGFyYW1ldGVyc30gZnJvbSBcIi4vcGFyYW1ldGVycy5qc1wiO1xuaW1wb3J0IHtTfSBmcm9tIFwiLi9zaW5nbGV0b24uanNcIjtcblxuZXhwb3J0IGNsYXNzIFBvdyBleHRlbmRzIF9FeHByIHtcbiAgICAvKlxuICAgIERlZmluZXMgdGhlIGV4cHJlc3Npb24geCoqeSBhcyBcInggcmFpc2VkIHRvIGEgcG93ZXIgeVwiXG4gICAgLi4gZGVwcmVjYXRlZDo6IDEuN1xuICAgICAgIFVzaW5nIGFyZ3VtZW50cyB0aGF0IGFyZW4ndCBzdWJjbGFzc2VzIG9mIDpjbGFzczpgfi5FeHByYCBpbiBjb3JlXG4gICAgICAgb3BlcmF0b3JzICg6Y2xhc3M6YH4uTXVsYCwgOmNsYXNzOmB+LkFkZGAsIGFuZCA6Y2xhc3M6YH4uUG93YCkgaXNcbiAgICAgICBkZXByZWNhdGVkLiBTZWUgOnJlZjpgbm9uLWV4cHItYXJncy1kZXByZWNhdGVkYCBmb3IgZGV0YWlscy5cbiAgICBTaW5nbGV0b24gZGVmaW5pdGlvbnMgaW52b2x2aW5nICgwLCAxLCAtMSwgb28sIC1vbywgSSwgLUkpOlxuICAgICstLS0tLS0tLS0tLS0tLSstLS0tLS0tLS0rLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0rXG4gICAgfCBleHByICAgICAgICAgfCB2YWx1ZSAgIHwgcmVhc29uICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHxcbiAgICArPT09PT09PT09PT09PT0rPT09PT09PT09Kz09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09K1xuICAgIHwgeioqMCAgICAgICAgIHwgMSAgICAgICB8IEFsdGhvdWdoIGFyZ3VtZW50cyBvdmVyIDAqKjAgZXhpc3QsIHNlZSBbMl0uICB8XG4gICAgKy0tLS0tLS0tLS0tLS0tKy0tLS0tLS0tLSstLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLStcbiAgICB8IHoqKjEgICAgICAgICB8IHogICAgICAgfCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfFxuICAgICstLS0tLS0tLS0tLS0tLSstLS0tLS0tLS0rLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0rXG4gICAgfCAoLW9vKSoqKC0xKSAgfCAwICAgICAgIHwgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHxcbiAgICArLS0tLS0tLS0tLS0tLS0rLS0tLS0tLS0tKy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tK1xuICAgIHwgKC0xKSoqLTEgICAgIHwgLTEgICAgICB8ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB8XG4gICAgKy0tLS0tLS0tLS0tLS0tKy0tLS0tLS0tLSstLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLStcbiAgICB8IFMuWmVybyoqLTEgICB8IHpvbyAgICAgfCBUaGlzIGlzIG5vdCBzdHJpY3RseSB0cnVlLCBhcyAwKiotMSBtYXkgYmUgICAgfFxuICAgIHwgICAgICAgICAgICAgIHwgICAgICAgICB8IHVuZGVmaW5lZCwgYnV0IGlzIGNvbnZlbmllbnQgaW4gc29tZSBjb250ZXh0cyB8XG4gICAgfCAgICAgICAgICAgICAgfCAgICAgICAgIHwgd2hlcmUgdGhlIGJhc2UgaXMgYXNzdW1lZCB0byBiZSBwb3NpdGl2ZS4gICAgIHxcbiAgICArLS0tLS0tLS0tLS0tLS0rLS0tLS0tLS0tKy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tK1xuICAgIHwgMSoqLTEgICAgICAgIHwgMSAgICAgICB8ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB8XG4gICAgKy0tLS0tLS0tLS0tLS0tKy0tLS0tLS0tLSstLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLStcbiAgICB8IG9vKiotMSAgICAgICB8IDAgICAgICAgfCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfFxuICAgICstLS0tLS0tLS0tLS0tLSstLS0tLS0tLS0rLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0rXG4gICAgfCAwKipvbyAgICAgICAgfCAwICAgICAgIHwgQmVjYXVzZSBmb3IgYWxsIGNvbXBsZXggbnVtYmVycyB6IG5lYXIgICAgICAgIHxcbiAgICB8ICAgICAgICAgICAgICB8ICAgICAgICAgfCAwLCB6KipvbyAtPiAwLiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfFxuICAgICstLS0tLS0tLS0tLS0tLSstLS0tLS0tLS0rLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0rXG4gICAgfCAwKiotb28gICAgICAgfCB6b28gICAgIHwgVGhpcyBpcyBub3Qgc3RyaWN0bHkgdHJ1ZSwgYXMgMCoqb28gbWF5IGJlICAgIHxcbiAgICB8ICAgICAgICAgICAgICB8ICAgICAgICAgfCBvc2NpbGxhdGluZyBiZXR3ZWVuIHBvc2l0aXZlIGFuZCBuZWdhdGl2ZSAgICAgfFxuICAgIHwgICAgICAgICAgICAgIHwgICAgICAgICB8IHZhbHVlcyBvciByb3RhdGluZyBpbiB0aGUgY29tcGxleCBwbGFuZS4gICAgICB8XG4gICAgfCAgICAgICAgICAgICAgfCAgICAgICAgIHwgSXQgaXMgY29udmVuaWVudCwgaG93ZXZlciwgd2hlbiB0aGUgYmFzZSAgICAgIHxcbiAgICB8ICAgICAgICAgICAgICB8ICAgICAgICAgfCBpcyBwb3NpdGl2ZS4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfFxuICAgICstLS0tLS0tLS0tLS0tLSstLS0tLS0tLS0rLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0rXG4gICAgfCAxKipvbyAgICAgICAgfCBuYW4gICAgIHwgQmVjYXVzZSB0aGVyZSBhcmUgdmFyaW91cyBjYXNlcyB3aGVyZSAgICAgICAgIHxcbiAgICB8IDEqKi1vbyAgICAgICB8ICAgICAgICAgfCBsaW0oeCh0KSx0KT0xLCBsaW0oeSh0KSx0KT1vbyAob3IgLW9vKSwgICAgICAgfFxuICAgIHwgICAgICAgICAgICAgIHwgICAgICAgICB8IGJ1dCBsaW0oIHgodCkqKnkodCksIHQpICE9IDEuICBTZWUgWzNdLiAgICAgICB8XG4gICAgKy0tLS0tLS0tLS0tLS0tKy0tLS0tLS0tLSstLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLStcbiAgICB8IGIqKnpvbyAgICAgICB8IG5hbiAgICAgfCBCZWNhdXNlIGIqKnogaGFzIG5vIGxpbWl0IGFzIHogLT4gem9vICAgICAgICAgfFxuICAgICstLS0tLS0tLS0tLS0tLSstLS0tLS0tLS0rLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0rXG4gICAgfCAoLTEpKipvbyAgICAgfCBuYW4gICAgIHwgQmVjYXVzZSBvZiBvc2NpbGxhdGlvbnMgaW4gdGhlIGxpbWl0LiAgICAgICAgIHxcbiAgICB8ICgtMSkqKigtb28pICB8ICAgICAgICAgfCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfFxuICAgICstLS0tLS0tLS0tLS0tLSstLS0tLS0tLS0rLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0rXG4gICAgfCBvbyoqb28gICAgICAgfCBvbyAgICAgIHwgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHxcbiAgICArLS0tLS0tLS0tLS0tLS0rLS0tLS0tLS0tKy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tK1xuICAgIHwgb28qKi1vbyAgICAgIHwgMCAgICAgICB8ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB8XG4gICAgKy0tLS0tLS0tLS0tLS0tKy0tLS0tLS0tLSstLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLStcbiAgICB8ICgtb28pKipvbyAgICB8IG5hbiAgICAgfCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfFxuICAgIHwgKC1vbykqKi1vbyAgIHwgICAgICAgICB8ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB8XG4gICAgKy0tLS0tLS0tLS0tLS0tKy0tLS0tLS0tLSstLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLStcbiAgICB8IG9vKipJICAgICAgICB8IG5hbiAgICAgfCBvbyoqZSBjb3VsZCBwcm9iYWJseSBiZSBiZXN0IHRob3VnaHQgb2YgYXMgICAgfFxuICAgIHwgKC1vbykqKkkgICAgIHwgICAgICAgICB8IHRoZSBsaW1pdCBvZiB4KiplIGZvciByZWFsIHggYXMgeCB0ZW5kcyB0byAgICB8XG4gICAgfCAgICAgICAgICAgICAgfCAgICAgICAgIHwgb28uIElmIGUgaXMgSSwgdGhlbiB0aGUgbGltaXQgZG9lcyBub3QgZXhpc3QgIHxcbiAgICB8ICAgICAgICAgICAgICB8ICAgICAgICAgfCBhbmQgbmFuIGlzIHVzZWQgdG8gaW5kaWNhdGUgdGhhdC4gICAgICAgICAgICAgfFxuICAgICstLS0tLS0tLS0tLS0tLSstLS0tLS0tLS0rLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0rXG4gICAgfCBvbyoqKDErSSkgICAgfCB6b28gICAgIHwgSWYgdGhlIHJlYWwgcGFydCBvZiBlIGlzIHBvc2l0aXZlLCB0aGVuIHRoZSAgIHxcbiAgICB8ICgtb28pKiooMStJKSB8ICAgICAgICAgfCBsaW1pdCBvZiBhYnMoeCoqZSkgaXMgb28uIFNvIHRoZSBsaW1pdCB2YWx1ZSAgfFxuICAgIHwgICAgICAgICAgICAgIHwgICAgICAgICB8IGlzIHpvby4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB8XG4gICAgKy0tLS0tLS0tLS0tLS0tKy0tLS0tLS0tLSstLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLStcbiAgICB8IG9vKiooLTErSSkgICB8IDAgICAgICAgfCBJZiB0aGUgcmVhbCBwYXJ0IG9mIGUgaXMgbmVnYXRpdmUsIHRoZW4gdGhlICAgfFxuICAgIHwgLW9vKiooLTErSSkgIHwgICAgICAgICB8IGxpbWl0IGlzIDAuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB8XG4gICAgKy0tLS0tLS0tLS0tLS0tKy0tLS0tLS0tLSstLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLStcbiAgICBCZWNhdXNlIHN5bWJvbGljIGNvbXB1dGF0aW9ucyBhcmUgbW9yZSBmbGV4aWJsZSB0aGFuIGZsb2F0aW5nIHBvaW50XG4gICAgY2FsY3VsYXRpb25zIGFuZCB3ZSBwcmVmZXIgdG8gbmV2ZXIgcmV0dXJuIGFuIGluY29ycmVjdCBhbnN3ZXIsXG4gICAgd2UgY2hvb3NlIG5vdCB0byBjb25mb3JtIHRvIGFsbCBJRUVFIDc1NCBjb252ZW50aW9ucy4gIFRoaXMgaGVscHNcbiAgICB1cyBhdm9pZCBleHRyYSB0ZXN0LWNhc2UgY29kZSBpbiB0aGUgY2FsY3VsYXRpb24gb2YgbGltaXRzLlxuICAgIFNlZSBBbHNvXG4gICAgPT09PT09PT1cbiAgICBzeW1weS5jb3JlLm51bWJlcnMuSW5maW5pdHlcbiAgICBzeW1weS5jb3JlLm51bWJlcnMuTmVnYXRpdmVJbmZpbml0eVxuICAgIHN5bXB5LmNvcmUubnVtYmVycy5OYU5cbiAgICBSZWZlcmVuY2VzXG4gICAgPT09PT09PT09PVxuICAgIC4uIFsxXSBodHRwczovL2VuLndpa2lwZWRpYS5vcmcvd2lraS9FeHBvbmVudGlhdGlvblxuICAgIC4uIFsyXSBodHRwczovL2VuLndpa2lwZWRpYS5vcmcvd2lraS9FeHBvbmVudGlhdGlvbiNaZXJvX3RvX3RoZV9wb3dlcl9vZl96ZXJvXG4gICAgLi4gWzNdIGh0dHBzOi8vZW4ud2lraXBlZGlhLm9yZy93aWtpL0luZGV0ZXJtaW5hdGVfZm9ybXNcbiAgICAqL1xuICAgIHN0YXRpYyBpc19Qb3cgPSB0cnVlO1xuICAgIF9fc2xvdHNfXyA9IFtcImlzX2NvbW11dGF0aXZlXCJdO1xuXG4gICAgLy8gdG8tZG86IG5lZWRzIHN1cHBvcnQgZm9yIGVeeFxuICAgIGNvbnN0cnVjdG9yKGI6IGFueSwgZTogYW55LCBldmFsdWF0ZTogYm9vbGVhbiA9IHVuZGVmaW5lZCwgc2ltcGxpZnk6IGJvb2xlYW4gPSB0cnVlKSB7XG4gICAgICAgIHN1cGVyKGIsIGUpO1xuICAgICAgICB0aGlzLl9hcmdzID0gW2IsIGVdO1xuICAgICAgICBpZiAodHlwZW9mIGV2YWx1YXRlID09PSBcInVuZGVmaW5lZFwiKSB7XG4gICAgICAgICAgICBldmFsdWF0ZSA9IGdsb2JhbF9wYXJhbWV0ZXJzLmV2YWx1YXRlO1xuICAgICAgICB9XG4gICAgICAgIGlmIChzaW1wbGlmeSkge1xuICAgICAgICAgICAgaWYgKGV2YWx1YXRlKSB7XG4gICAgICAgICAgICAgICAgaWYgKGUgPT09IFMuQ29tcGxleEluZmluaXR5KSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBTLk5hTjtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgaWYgKGUgPT09IFMuSW5maW5pdHkpIHtcbiAgICAgICAgICAgICAgICAgICAgLy8gdGhpcyBwYXJ0IGlzIG5vdCBmdWxseSBkb25lXG4gICAgICAgICAgICAgICAgICAgIC8vIHNob3VsZCBiZSB1cGRhdGVkIHRvIHVzZSByZWxhdGlvbmFsXG4gICAgICAgICAgICAgICAgICAgIGlmIChiLmNvbnN0cnVjdG9yLmlzX3Bvc2l0aXZlIHx8IGIuaXNfcG9zaXRpdmUoKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFMuSW5maW5pdHk7XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoYi5jb25zdHJ1Y3Rvci5pc196ZXJvKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gUy5aZXJvO1xuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGIuaXNfZmluaXRlKCkgfHwgYi5jb25zdHJ1Y3Rvci5pc19maW5pdGUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gUy5Db21wbGV4SW5maW5pdHk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBTLk5hTjtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBpZiAoZSA9PT0gUy5aZXJvKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBTLk9uZTtcbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKGUgPT09IFMuT25lKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBiO1xuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoZSA9PT0gUy5OZWdhdGl2ZU9uZSAmJiAhYikge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gUy5Db21wbGV4SW5maW5pdHk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmICgoZS5jb25zdHJ1Y3Rvci5pc19TeW1ib2wgJiYgZS5jb25zdHJ1Y3Rvci5pc19pbnRlZ2VyIHx8XG4gICAgICAgICAgICAgICAgICAgIGUuY29uc3RydWN0b3IuaXNfSW50ZWdlciAmJiAoYi5jb25zdHJ1Y3Rvci5pc19OdW1iZXIgJiZcbiAgICAgICAgICAgICAgICAgICAgYi5jb25zdHJ1Y3Rvci5pc19NdWwgfHwgYi5jb25zdHJ1Y3Rvci5pc19OdW1iZXIpKSAmJiAoZS5pc19leHRlbmRlZF9uZWdhdGl2ZSA9PT0gdHJ1ZSkpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGUuaXNfZXZlbigpIHx8IGUuY29uc3RydWN0b3IuaXNfZXZlbikge1xuICAgICAgICAgICAgICAgICAgICAgICAgYiA9IGIuX19tdWxfXyhTLk5lZ2F0aXZlT25lKTtcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBuZXcgUG93KGIuX19tdWxfXyhTLk5lZ2F0aXZlT25lKSwgZSkuX19tdWxfXyhTLk5lZ2F0aXZlT25lKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBpZiAoYiA9PT0gUy5OYU4gfHwgZSA9PT0gUy5OYU4pIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFMuTmFOO1xuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoYiA9PT0gUy5PbmUpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGUuaXNfaW5maW5pdGUoKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFMuTmFOO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBTLk9uZTtcbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKGUuY29uc3RydWN0b3IuaXNfTnVtYmVyICYmIGIuY29uc3RydWN0b3IuaXNfTnVtYmVyICkge1xuICAgICAgICAgICAgICAgICAgICAvLyBiYXNlIEUgc3R1ZmYgbm90IHlldCBpbXBsZW1lbnRlZFxuICAgICAgICAgICAgICAgICAgICBjb25zdCBvYmogPSBiLl9ldmFsX3Bvd2VyKGUpO1xuICAgICAgICAgICAgICAgICAgICBpZiAodHlwZW9mIG9iaiAhPT0gXCJ1bmRlZmluZWRcIikge1xuICAgICAgICAgICAgICAgICAgICAgICAgb2JqLmlzX2NvbW11dGF0aXZlID0gKGIuY29uc3RydWN0b3IuaXNfY29tbXV0YXRpdmUgJiYgZS5jb25zdHJ1Y3Rvci5pc19jb21tdXRhdGl2ZSk7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gb2JqO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHRoaXMuaXNfY29tbXV0YXRpdmUgPSAoYi5jb25zdHJ1Y3Rvci5pc19jb21tdXRhdGl2ZSAmJiBlLmNvbnN0cnVjdG9yLmlzX2NvbW11dGF0aXZlKTtcbiAgICB9XG5cbiAgICBhc19iYXNlX2V4cCgpIHtcbiAgICAgICAgY29uc3QgYiA9IHRoaXMuX2FyZ3NbMF07XG4gICAgICAgIGNvbnN0IGUgPSB0aGlzLl9hcmdzWzFdO1xuICAgICAgICBpZiAoYi5pc19SYXRpb25hbCAmJiBiLnAgPT09IDEgJiYgYi5xICE9PSAxKSB7XG4gICAgICAgICAgICBjb25zdCBwMSA9IF9OdW1iZXJfLm5ldyhiLnEpO1xuICAgICAgICAgICAgY29uc3QgcDIgPSBlLl9fbXVsX18oUy5OZWdhdGl2ZU9uZSk7XG4gICAgICAgICAgICByZXR1cm4gW3AxLCBwMl07XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIFtiLCBlXTtcbiAgICB9XG5cbiAgICBzdGF0aWMgX25ldyhiOiBhbnksIGU6IGFueSkge1xuICAgICAgICByZXR1cm4gbmV3IFBvdyhiLCBlKTtcbiAgICB9XG59XG5cbk1hbmFnZWRQcm9wZXJ0aWVzLnJlZ2lzdGVyKFBvdyk7XG5HbG9iYWwucmVnaXN0ZXIoXCJQb3dcIiwgUG93Ll9uZXcpO1xuXG4vLyBpbXBsZW1lbnRlZCBkaWZmZXJlbnQgdGhhbiBzeW1weSwgYnV0IGhhcyBzYW1lIGZ1bmN0aW9uYWxpdHkgKGZvciBub3cpXG5leHBvcnQgZnVuY3Rpb24gbnJvb3QoeTogbnVtYmVyLCBuOiBudW1iZXIpIHtcbiAgICBjb25zdCB4ID0gTWF0aC5mbG9vcih5ICoqICgxIC8gbikpO1xuICAgIHJldHVybiBbeCwgeCoqbiA9PT0geV07XG59XG4iLCAiaW1wb3J0IHtkaXZtb2R9IGZyb20gXCIuLi9udGhlb3J5L2ZhY3Rvcl8uanNcIjtcbmltcG9ydCB7QWRkfSBmcm9tIFwiLi9hZGQuanNcIjtcbmltcG9ydCB7TWFuYWdlZFByb3BlcnRpZXN9IGZyb20gXCIuL2Fzc3VtcHRpb25zLmpzXCI7XG5pbXBvcnQge0Jhc2ljfSBmcm9tIFwiLi9iYXNpYy5qc1wiO1xuaW1wb3J0IHtFeHByfSBmcm9tIFwiLi9leHByLmpzXCI7XG5pbXBvcnQge0dsb2JhbH0gZnJvbSBcIi4vZ2xvYmFsLmpzXCI7XG5pbXBvcnQge2Z1enp5X25vdHYyLCBfZnV6enlfZ3JvdXB2Mn0gZnJvbSBcIi4vbG9naWMuanNcIjtcbmltcG9ydCB7SW50ZWdlciwgUmF0aW9uYWx9IGZyb20gXCIuL251bWJlcnMuanNcIjtcbmltcG9ydCB7QXNzb2NPcH0gZnJvbSBcIi4vb3BlcmF0aW9ucy5qc1wiO1xuaW1wb3J0IHtnbG9iYWxfcGFyYW1ldGVyc30gZnJvbSBcIi4vcGFyYW1ldGVycy5qc1wiO1xuaW1wb3J0IHtQb3d9IGZyb20gXCIuL3Bvd2VyLmpzXCI7XG5pbXBvcnQge1N9IGZyb20gXCIuL3NpbmdsZXRvbi5qc1wiO1xuaW1wb3J0IHttaXgsIGJhc2UsIEhhc2hEaWN0LCBIYXNoU2V0LCBBcnJEZWZhdWx0RGljdH0gZnJvbSBcIi4vdXRpbGl0eS5qc1wiO1xuXG4vLyAjIGludGVybmFsIG1hcmtlciB0byBpbmRpY2F0ZTpcbi8vIFwidGhlcmUgYXJlIHN0aWxsIG5vbi1jb21tdXRhdGl2ZSBvYmplY3RzIC0tIGRvbid0IGZvcmdldCB0byBwcm9jZXNzIHRoZW1cIlxuXG4vLyBub3QgY3VycmVudGx5IGJlaW5nIHVzZWRcbmNsYXNzIE5DX01hcmtlciB7XG4gICAgaXNfT3JkZXIgPSBmYWxzZTtcbiAgICBpc19NdWwgPSBmYWxzZTtcbiAgICBpc19OdW1iZXIgPSBmYWxzZTtcbiAgICBpc19Qb2x5ID0gZmFsc2U7XG5cbiAgICBpc19jb21tdXRhdGl2ZSA9IGZhbHNlO1xufVxuXG5mdW5jdGlvbiBfbXVsc29ydChhcmdzOiBhbnlbXSkge1xuICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBuZXctY2FwXG4gICAgYXJncy5zb3J0KChhLCBiKSA9PiBCYXNpYy5jbXAoYSwgYikpO1xufVxuXG5leHBvcnQgY2xhc3MgTXVsIGV4dGVuZHMgbWl4KGJhc2UpLndpdGgoRXhwciwgQXNzb2NPcCkge1xuICAgIC8qXG4gICAgRXhwcmVzc2lvbiByZXByZXNlbnRpbmcgbXVsdGlwbGljYXRpb24gb3BlcmF0aW9uIGZvciBhbGdlYnJhaWMgZmllbGQuXG4gICAgLi4gZGVwcmVjYXRlZDo6IDEuN1xuICAgICAgIFVzaW5nIGFyZ3VtZW50cyB0aGF0IGFyZW4ndCBzdWJjbGFzc2VzIG9mIDpjbGFzczpgfi5FeHByYCBpbiBjb3JlXG4gICAgICAgb3BlcmF0b3JzICg6Y2xhc3M6YH4uTXVsYCwgOmNsYXNzOmB+LkFkZGAsIGFuZCA6Y2xhc3M6YH4uUG93YCkgaXNcbiAgICAgICBkZXByZWNhdGVkLiBTZWUgOnJlZjpgbm9uLWV4cHItYXJncy1kZXByZWNhdGVkYCBmb3IgZGV0YWlscy5cbiAgICBFdmVyeSBhcmd1bWVudCBvZiBgYE11bCgpYGAgbXVzdCBiZSBgYEV4cHJgYC4gSW5maXggb3BlcmF0b3IgYGAqYGBcbiAgICBvbiBtb3N0IHNjYWxhciBvYmplY3RzIGluIFN5bVB5IGNhbGxzIHRoaXMgY2xhc3MuXG4gICAgQW5vdGhlciB1c2Ugb2YgYGBNdWwoKWBgIGlzIHRvIHJlcHJlc2VudCB0aGUgc3RydWN0dXJlIG9mIGFic3RyYWN0XG4gICAgbXVsdGlwbGljYXRpb24gc28gdGhhdCBpdHMgYXJndW1lbnRzIGNhbiBiZSBzdWJzdGl0dXRlZCB0byByZXR1cm5cbiAgICBkaWZmZXJlbnQgY2xhc3MuIFJlZmVyIHRvIGV4YW1wbGVzIHNlY3Rpb24gZm9yIHRoaXMuXG4gICAgYGBNdWwoKWBgIGV2YWx1YXRlcyB0aGUgYXJndW1lbnQgdW5sZXNzIGBgZXZhbHVhdGU9RmFsc2VgYCBpcyBwYXNzZWQuXG4gICAgVGhlIGV2YWx1YXRpb24gbG9naWMgaW5jbHVkZXM6XG4gICAgMS4gRmxhdHRlbmluZ1xuICAgICAgICBgYE11bCh4LCBNdWwoeSwgeikpYGAgLT4gYGBNdWwoeCwgeSwgeilgYFxuICAgIDIuIElkZW50aXR5IHJlbW92aW5nXG4gICAgICAgIGBgTXVsKHgsIDEsIHkpYGAgLT4gYGBNdWwoeCwgeSlgYFxuICAgIDMuIEV4cG9uZW50IGNvbGxlY3RpbmcgYnkgYGAuYXNfYmFzZV9leHAoKWBgXG4gICAgICAgIGBgTXVsKHgsIHgqKjIpYGAgLT4gYGBQb3coeCwgMylgYFxuICAgIDQuIFRlcm0gc29ydGluZ1xuICAgICAgICBgYE11bCh5LCB4LCAyKWBgIC0+IGBgTXVsKDIsIHgsIHkpYGBcbiAgICBTaW5jZSBtdWx0aXBsaWNhdGlvbiBjYW4gYmUgdmVjdG9yIHNwYWNlIG9wZXJhdGlvbiwgYXJndW1lbnRzIG1heVxuICAgIGhhdmUgdGhlIGRpZmZlcmVudCA6b2JqOmBzeW1weS5jb3JlLmtpbmQuS2luZCgpYC4gS2luZCBvZiB0aGVcbiAgICByZXN1bHRpbmcgb2JqZWN0IGlzIGF1dG9tYXRpY2FsbHkgaW5mZXJyZWQuXG4gICAgRXhhbXBsZXNcbiAgICA9PT09PT09PVxuICAgID4+PiBmcm9tIHN5bXB5IGltcG9ydCBNdWxcbiAgICA+Pj4gZnJvbSBzeW1weS5hYmMgaW1wb3J0IHgsIHlcbiAgICA+Pj4gTXVsKHgsIDEpXG4gICAgeFxuICAgID4+PiBNdWwoeCwgeClcbiAgICB4KioyXG4gICAgSWYgYGBldmFsdWF0ZT1GYWxzZWBgIGlzIHBhc3NlZCwgcmVzdWx0IGlzIG5vdCBldmFsdWF0ZWQuXG4gICAgPj4+IE11bCgxLCAyLCBldmFsdWF0ZT1GYWxzZSlcbiAgICAxKjJcbiAgICA+Pj4gTXVsKHgsIHgsIGV2YWx1YXRlPUZhbHNlKVxuICAgIHgqeFxuICAgIGBgTXVsKClgYCBhbHNvIHJlcHJlc2VudHMgdGhlIGdlbmVyYWwgc3RydWN0dXJlIG9mIG11bHRpcGxpY2F0aW9uXG4gICAgb3BlcmF0aW9uLlxuICAgID4+PiBmcm9tIHN5bXB5IGltcG9ydCBNYXRyaXhTeW1ib2xcbiAgICA+Pj4gQSA9IE1hdHJpeFN5bWJvbCgnQScsIDIsMilcbiAgICA+Pj4gZXhwciA9IE11bCh4LHkpLnN1YnMoe3k6QX0pXG4gICAgPj4+IGV4cHJcbiAgICB4KkFcbiAgICA+Pj4gdHlwZShleHByKVxuICAgIDxjbGFzcyAnc3ltcHkubWF0cmljZXMuZXhwcmVzc2lvbnMubWF0bXVsLk1hdE11bCc+XG4gICAgU2VlIEFsc29cbiAgICA9PT09PT09PVxuICAgIE1hdE11bFxuICAgICovXG4gICAgX19zbG90c19fOiBhbnlbXSA9IFtdO1xuICAgIGFyZ3M6IGFueVtdO1xuICAgIHN0YXRpYyBpc19NdWwgPSB0cnVlO1xuICAgIF9hcmdzX3R5cGUgPSBFeHByO1xuICAgIHN0YXRpYyBpZGVudGl0eSA9IFMuT25lO1xuXG4gICAgY29uc3RydWN0b3IoZXZhbHVhdGU6IGJvb2xlYW4sIHNpbXBsaWZ5OiBib29sZWFuLCAuLi5hcmdzOiBhbnkpIHtcbiAgICAgICAgc3VwZXIoTXVsLCBldmFsdWF0ZSwgc2ltcGxpZnksIC4uLmFyZ3MpO1xuICAgIH1cblxuICAgIGZsYXR0ZW4oc2VxOiBhbnkpIHtcbiAgICAgICAgLyogUmV0dXJuIGNvbW11dGF0aXZlLCBub25jb21tdXRhdGl2ZSBhbmQgb3JkZXIgYXJndW1lbnRzIGJ5XG4gICAgICAgIGNvbWJpbmluZyByZWxhdGVkIHRlcm1zLlxuICAgICAgICBOb3Rlc1xuICAgICAgICA9PT09PVxuICAgICAgICAgICAgKiBJbiBhbiBleHByZXNzaW9uIGxpa2UgYGBhKmIqY2BgLCBQeXRob24gcHJvY2VzcyB0aGlzIHRocm91Z2ggU3ltUHlcbiAgICAgICAgICAgICAgYXMgYGBNdWwoTXVsKGEsIGIpLCBjKWBgLiBUaGlzIGNhbiBoYXZlIHVuZGVzaXJhYmxlIGNvbnNlcXVlbmNlcy5cbiAgICAgICAgICAgICAgLSAgU29tZXRpbWVzIHRlcm1zIGFyZSBub3QgY29tYmluZWQgYXMgb25lIHdvdWxkIGxpa2U6XG4gICAgICAgICAgICAgICAgIHtjLmYuIGh0dHBzOi8vZ2l0aHViLmNvbS9zeW1weS9zeW1weS9pc3N1ZXMvNDU5Nn1cbiAgICAgICAgICAgICAgICA+Pj4gZnJvbSBzeW1weSBpbXBvcnQgTXVsLCBzcXJ0XG4gICAgICAgICAgICAgICAgPj4+IGZyb20gc3ltcHkuYWJjIGltcG9ydCB4LCB5LCB6XG4gICAgICAgICAgICAgICAgPj4+IDIqKHggKyAxKSAjIHRoaXMgaXMgdGhlIDItYXJnIE11bCBiZWhhdmlvclxuICAgICAgICAgICAgICAgIDIqeCArIDJcbiAgICAgICAgICAgICAgICA+Pj4geSooeCArIDEpKjJcbiAgICAgICAgICAgICAgICAyKnkqKHggKyAxKVxuICAgICAgICAgICAgICAgID4+PiAyKih4ICsgMSkqeSAjIDItYXJnIHJlc3VsdCB3aWxsIGJlIG9idGFpbmVkIGZpcnN0XG4gICAgICAgICAgICAgICAgeSooMip4ICsgMilcbiAgICAgICAgICAgICAgICA+Pj4gTXVsKDIsIHggKyAxLCB5KSAjIGFsbCAzIGFyZ3Mgc2ltdWx0YW5lb3VzbHkgcHJvY2Vzc2VkXG4gICAgICAgICAgICAgICAgMip5Kih4ICsgMSlcbiAgICAgICAgICAgICAgICA+Pj4gMiooKHggKyAxKSp5KSAjIHBhcmVudGhlc2VzIGNhbiBjb250cm9sIHRoaXMgYmVoYXZpb3JcbiAgICAgICAgICAgICAgICAyKnkqKHggKyAxKVxuICAgICAgICAgICAgICAgIFBvd2VycyB3aXRoIGNvbXBvdW5kIGJhc2VzIG1heSBub3QgZmluZCBhIHNpbmdsZSBiYXNlIHRvXG4gICAgICAgICAgICAgICAgY29tYmluZSB3aXRoIHVubGVzcyBhbGwgYXJndW1lbnRzIGFyZSBwcm9jZXNzZWQgYXQgb25jZS5cbiAgICAgICAgICAgICAgICBQb3N0LXByb2Nlc3NpbmcgbWF5IGJlIG5lY2Vzc2FyeSBpbiBzdWNoIGNhc2VzLlxuICAgICAgICAgICAgICAgIHtjLmYuIGh0dHBzOi8vZ2l0aHViLmNvbS9zeW1weS9zeW1weS9pc3N1ZXMvNTcyOH1cbiAgICAgICAgICAgICAgICA+Pj4gYSA9IHNxcnQoeCpzcXJ0KHkpKVxuICAgICAgICAgICAgICAgID4+PiBhKiozXG4gICAgICAgICAgICAgICAgKHgqc3FydCh5KSkqKigzLzIpXG4gICAgICAgICAgICAgICAgPj4+IE11bChhLGEsYSlcbiAgICAgICAgICAgICAgICAoeCpzcXJ0KHkpKSoqKDMvMilcbiAgICAgICAgICAgICAgICA+Pj4gYSphKmFcbiAgICAgICAgICAgICAgICB4KnNxcnQoeSkqc3FydCh4KnNxcnQoeSkpXG4gICAgICAgICAgICAgICAgPj4+IF8uc3VicyhhLmJhc2UsIHopLnN1YnMoeiwgYS5iYXNlKVxuICAgICAgICAgICAgICAgICh4KnNxcnQoeSkpKiooMy8yKVxuICAgICAgICAgICAgICAtICBJZiBtb3JlIHRoYW4gdHdvIHRlcm1zIGFyZSBiZWluZyBtdWx0aXBsaWVkIHRoZW4gYWxsIHRoZVxuICAgICAgICAgICAgICAgICBwcmV2aW91cyB0ZXJtcyB3aWxsIGJlIHJlLXByb2Nlc3NlZCBmb3IgZWFjaCBuZXcgYXJndW1lbnQuXG4gICAgICAgICAgICAgICAgIFNvIGlmIGVhY2ggb2YgYGBhYGAsIGBgYmBgIGFuZCBgYGNgYCB3ZXJlIDpjbGFzczpgTXVsYFxuICAgICAgICAgICAgICAgICBleHByZXNzaW9uLCB0aGVuIGBgYSpiKmNgYCAob3IgYnVpbGRpbmcgdXAgdGhlIHByb2R1Y3RcbiAgICAgICAgICAgICAgICAgd2l0aCBgYCo9YGApIHdpbGwgcHJvY2VzcyBhbGwgdGhlIGFyZ3VtZW50cyBvZiBgYGFgYCBhbmRcbiAgICAgICAgICAgICAgICAgYGBiYGAgdHdpY2U6IG9uY2Ugd2hlbiBgYGEqYmBgIGlzIGNvbXB1dGVkIGFuZCBhZ2FpbiB3aGVuXG4gICAgICAgICAgICAgICAgIGBgY2BgIGlzIG11bHRpcGxpZWQuXG4gICAgICAgICAgICAgICAgIFVzaW5nIGBgTXVsKGEsIGIsIGMpYGAgd2lsbCBwcm9jZXNzIGFsbCBhcmd1bWVudHMgb25jZS5cbiAgICAgICAgICAgICogVGhlIHJlc3VsdHMgb2YgTXVsIGFyZSBjYWNoZWQgYWNjb3JkaW5nIHRvIGFyZ3VtZW50cywgc28gZmxhdHRlblxuICAgICAgICAgICAgICB3aWxsIG9ubHkgYmUgY2FsbGVkIG9uY2UgZm9yIGBgTXVsKGEsIGIsIGMpYGAuIElmIHlvdSBjYW5cbiAgICAgICAgICAgICAgc3RydWN0dXJlIGEgY2FsY3VsYXRpb24gc28gdGhlIGFyZ3VtZW50cyBhcmUgbW9zdCBsaWtlbHkgdG8gYmVcbiAgICAgICAgICAgICAgcmVwZWF0cyB0aGVuIHRoaXMgY2FuIHNhdmUgdGltZSBpbiBjb21wdXRpbmcgdGhlIGFuc3dlci4gRm9yXG4gICAgICAgICAgICAgIGV4YW1wbGUsIHNheSB5b3UgaGFkIGEgTXVsLCBNLCB0aGF0IHlvdSB3aXNoZWQgdG8gZGl2aWRlIGJ5IGBgZFtpXWBgXG4gICAgICAgICAgICAgIGFuZCBtdWx0aXBseSBieSBgYG5baV1gYCBhbmQgeW91IHN1c3BlY3QgdGhlcmUgYXJlIG1hbnkgcmVwZWF0c1xuICAgICAgICAgICAgICBpbiBgYG5gYC4gSXQgd291bGQgYmUgYmV0dGVyIHRvIGNvbXB1dGUgYGBNKm5baV0vZFtpXWBgIHJhdGhlclxuICAgICAgICAgICAgICB0aGFuIGBgTS9kW2ldKm5baV1gYCBzaW5jZSBldmVyeSB0aW1lIG5baV0gaXMgYSByZXBlYXQsIHRoZVxuICAgICAgICAgICAgICBwcm9kdWN0LCBgYE0qbltpXWBgIHdpbGwgYmUgcmV0dXJuZWQgd2l0aG91dCBmbGF0dGVuaW5nIC0tIHRoZVxuICAgICAgICAgICAgICBjYWNoZWQgdmFsdWUgd2lsbCBiZSByZXR1cm5lZC4gSWYgeW91IGRpdmlkZSBieSB0aGUgYGBkW2ldYGBcbiAgICAgICAgICAgICAgZmlyc3QgKGFuZCB0aG9zZSBhcmUgbW9yZSB1bmlxdWUgdGhhbiB0aGUgYGBuW2ldYGApIHRoZW4gdGhhdCB3aWxsXG4gICAgICAgICAgICAgIGNyZWF0ZSBhIG5ldyBNdWwsIGBgTS9kW2ldYGAgdGhlIGFyZ3Mgb2Ygd2hpY2ggd2lsbCBiZSB0cmF2ZXJzZWRcbiAgICAgICAgICAgICAgYWdhaW4gd2hlbiBpdCBpcyBtdWx0aXBsaWVkIGJ5IGBgbltpXWBgLlxuICAgICAgICAgICAgICB7Yy5mLiBodHRwczovL2dpdGh1Yi5jb20vc3ltcHkvc3ltcHkvaXNzdWVzLzU3MDZ9XG4gICAgICAgICAgICAgIFRoaXMgY29uc2lkZXJhdGlvbiBpcyBtb290IGlmIHRoZSBjYWNoZSBpcyB0dXJuZWQgb2ZmLlxuICAgICAgICAgICAgTkJcbiAgICAgICAgICAgIC0tXG4gICAgICAgICAgICAgIFRoZSB2YWxpZGl0eSBvZiB0aGUgYWJvdmUgbm90ZXMgZGVwZW5kcyBvbiB0aGUgaW1wbGVtZW50YXRpb25cbiAgICAgICAgICAgICAgZGV0YWlscyBvZiBNdWwgYW5kIGZsYXR0ZW4gd2hpY2ggbWF5IGNoYW5nZSBhdCBhbnkgdGltZS4gVGhlcmVmb3JlLFxuICAgICAgICAgICAgICB5b3Ugc2hvdWxkIG9ubHkgY29uc2lkZXIgdGhlbSB3aGVuIHlvdXIgY29kZSBpcyBoaWdobHkgcGVyZm9ybWFuY2VcbiAgICAgICAgICAgICAgc2Vuc2l0aXZlLlxuICAgICAgICAgICAgICBSZW1vdmFsIG9mIDEgZnJvbSB0aGUgc2VxdWVuY2UgaXMgYWxyZWFkeSBoYW5kbGVkIGJ5IEFzc29jT3AuX19uZXdfXy5cbiAgICAgICAgKi9cbiAgICAgICAgbGV0IHJ2ID0gdW5kZWZpbmVkO1xuICAgICAgICBpZiAoc2VxLmxlbmd0aCA9PT0gMikge1xuICAgICAgICAgICAgbGV0IFthLCBiXSA9IHNlcTtcbiAgICAgICAgICAgIGlmIChiLmlzX1JhdGlvbmFsKCkpIHtcbiAgICAgICAgICAgICAgICBbYSwgYl0gPSBbYiwgYV07XG4gICAgICAgICAgICAgICAgc2VxID0gW2EsIGJdO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKCEoYS5pc196ZXJvKCkgJiYgYS5pc19SYXRpb25hbCgpKSkge1xuICAgICAgICAgICAgICAgIGxldCByO1xuICAgICAgICAgICAgICAgIFtyLCBiXSA9IGIuYXNfY29lZmZfTXVsKCk7XG4gICAgICAgICAgICAgICAgaWYgKGIuaXNfQWRkKCkpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHIgIT09IFMuT25lKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBsZXQgYXJiO1xuICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgYXIgPSBhLl9fbXVsX18ocik7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoYXIgPT09IFMuT25lKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYXJiID0gYjtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYXJiID0gdGhpcy5jb25zdHJ1Y3RvcihmYWxzZSwgdHJ1ZSwgYS5fX211bF9fKHIpLCBiKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIHJ2ID0gW1thcmJdLCBbXSwgdW5kZWZpbmVkXTtcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIGlmIChnbG9iYWxfcGFyYW1ldGVycy5kaXN0cmlidXRlICYmIGIuaXNfY29tbXV0YXRpdmUoKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgYXJnOiBhbnkgPSBbXTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGZvciAoY29uc3QgYmkgb2YgYi5fYXJncykge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGFyZy5wdXNoKHRoaXMuX2tlZXBfY29lZmYoYSwgYmkpKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IG5ld2IgPSBuZXcgQWRkKHRydWUsIHRydWUsIC4uLmFyZyk7XG4gICAgICAgICAgICAgICAgICAgICAgICBydiA9IFtbbmV3Yl0sIFtdLCB1bmRlZmluZWRdO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKHJ2KSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHJ2O1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgbGV0IGNfcGFydDogYW55ID0gW107XG4gICAgICAgIGNvbnN0IG5jX3NlcSA9IFtdO1xuICAgICAgICBsZXQgbmNfcGFydDogYW55ID0gW107XG4gICAgICAgIGxldCBjb2VmZiA9IFMuT25lO1xuICAgICAgICBsZXQgY19wb3dlcnMgPSBbXTtcbiAgICAgICAgbGV0IG5lZzFlID0gUy5aZXJvOyBsZXQgbnVtX2V4cCA9IFtdO1xuICAgICAgICBjb25zdCBwbnVtX3JhdCA9IG5ldyBIYXNoRGljdCgpO1xuICAgICAgICBjb25zdCBvcmRlcl9zeW1ib2xzOiBhbnlbXSA9IFtdO1xuXG4gICAgICAgIGZvciAobGV0IG8gb2Ygc2VxKSB7XG4gICAgICAgICAgICBpZiAoby5pc19NdWwoKSkge1xuICAgICAgICAgICAgICAgIGlmIChvLmlzX2NvbW11dGF0aXZlKCkpIHtcbiAgICAgICAgICAgICAgICAgICAgc2VxLnB1c2goLi4uby5fYXJncyk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgZm9yIChjb25zdCBxIG9mIG8uX2FyZ3MpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChxLmlzX2NvbW11dGF0aXZlKCkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzZXEucHVzaChxKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbmNfc2VxLnB1c2gocSk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKG8uaXNfTnVtYmVyKCkpIHtcbiAgICAgICAgICAgICAgICBpZiAobyA9PT0gUy5OYU4gfHwgY29lZmYgPT09IFMuQ29tcGxleEluZmluaXR5ICYmIG8uaXNfemVybygpKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBbW1MuTmFOXSwgW10sIHVuZGVmaW5lZF07XG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmIChjb2VmZi5pc19OdW1iZXIoKSkge1xuICAgICAgICAgICAgICAgICAgICBjb2VmZiA9IGNvZWZmLl9fbXVsX18obyk7XG4gICAgICAgICAgICAgICAgICAgIGlmIChjb2VmZiA9PT0gUy5OYU4pIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBbW1MuTmFOXSwgW10sIHVuZGVmaW5lZF07XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKG8gPT09IFMuQ29tcGxleEluZmluaXR5KSB7XG4gICAgICAgICAgICAgICAgaWYgKCEoY29lZmYpKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBbW1MuTmFOXSwgW10sIHVuZGVmaW5lZF07XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGNvZWZmID0gUy5Db21wbGV4SW5maW5pdHk7XG4gICAgICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKG8uaXNfY29tbXV0YXRpdmUoKSkge1xuICAgICAgICAgICAgICAgIGxldCBlOyBsZXQgYjtcbiAgICAgICAgICAgICAgICBbYiwgZV0gPSBvLmFzX2Jhc2VfZXhwKCk7XG4gICAgICAgICAgICAgICAgaWYgKG8uaXNfUG93KCkpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGIuaXNfTnVtYmVyKCkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChlLmlzX1JhdGlvbmFsKCkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoZS5pc19JbnRlZ2VyKCkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29lZmYgPSBjb2VmZi5fX211bF9fKG5ldyBQb3coYiwgZSkpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKGUuaXNfbmVnYXRpdmUoKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzZXEucHVzaChuZXcgUG93KGIsIGUpKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIGlmIChiLmlzX25lZ2F0aXZlKCkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbmVnMWUgPSBuZWcxZS5fX2FkZF9fKGUpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBiID0gYi5fX211bF9fKFMuTmVnYXRpdmVPbmUpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoYiAhPT0gUy5PbmUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcG51bV9yYXQuc2V0ZGVmYXVsdChiLCBbXSkucHVzaChlKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKGIuaXNfcG9zaXRpdmUoKSB8fCBiLmlzX2ludGVnZXIoKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG51bV9leHAucHVzaChbYiwgZV0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGNfcG93ZXJzLnB1c2goW2IsIGVdKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgaWYgKG8gIT09IE5DX01hcmtlcikge1xuICAgICAgICAgICAgICAgICAgICBuY19zZXEucHVzaChvKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgd2hpbGUgKG5jX3NlcSkge1xuICAgICAgICAgICAgICAgICAgICBvID0gbmNfc2VxLnNwbGljZSgwLCAxKTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKCEobmNfcGFydCkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIG5jX3BhcnQucHVzaChvKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IG8xID0gbmNfcGFydC5wb3AoKTtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgW2IxLCBlMV0gPSBvMS5hc19iYXNlX2V4cCgpO1xuICAgICAgICAgICAgICAgICAgICBjb25zdCBbYjIsIGUyXSA9IG8uYXNfYmFzZV9leHAoKTtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgbmV3X2V4cCA9IGUxLl9fYWRkX18oZTIpO1xuICAgICAgICAgICAgICAgICAgICBpZiAoYjEuZXEoYjIpICYmICEobmV3X2V4cC5pc19BZGQoKSkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IG8xMiA9IGIxLl9ldmFsX3Bvd2VyKG5ld19leHApO1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKG8xMi5pc19jb21tdXRhdGl2ZSgpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc2VxLnB1c2gobzEyKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbmNfc2VxLnNwbGljZSgwLCAwLCBvMTIpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgbmNfcGFydC5wdXNoKG8xKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIG5jX3BhcnQucHVzaChvKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGZ1bmN0aW9uIF9nYXRoZXIoY19wb3dlcnM6IGFueVtdKSB7XG4gICAgICAgICAgICBjb25zdCBjb21tb25fYiA9IG5ldyBIYXNoRGljdCgpO1xuICAgICAgICAgICAgZm9yIChjb25zdCBbYiwgZV0gb2YgY19wb3dlcnMpIHtcbiAgICAgICAgICAgICAgICBjb25zdCBjbyA9IGUuYXNfY29lZmZfTXVsKCk7XG4gICAgICAgICAgICAgICAgY29tbW9uX2Iuc2V0ZGVmYXVsdChiLCBuZXcgSGFzaERpY3QoKSkuc2V0ZGVmYXVsdChjb1sxXSwgW10pLnB1c2goY29bMF0pO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5vLXVudXNlZC12YXJzXG4gICAgICAgICAgICBmb3IgKGNvbnN0IFtiLCBkXSBvZiBjb21tb25fYi5lbnRyaWVzKCkpIHtcbiAgICAgICAgICAgICAgICBmb3IgKGNvbnN0IFtkaSwgbGldIG9mIGQuZW50cmllcygpKSB7XG4gICAgICAgICAgICAgICAgICAgIGQuYWRkKGRpLCBuZXcgQWRkKHRydWUsIHRydWUsIC4uLmxpKSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgY29uc3QgbmV3X2NfcG93ZXJzID0gW107XG4gICAgICAgICAgICBmb3IgKGNvbnN0IFtiLCBlXSBvZiBjb21tb25fYi5lbnRyaWVzKCkpIHtcbiAgICAgICAgICAgICAgICBmb3IgKGNvbnN0IFt0LCBjXSBvZiBlLmVudHJpZXMoKSkge1xuICAgICAgICAgICAgICAgICAgICBuZXdfY19wb3dlcnMucHVzaChbYiwgYy5fX211bF9fKHQpXSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIG5ld19jX3Bvd2VycztcbiAgICAgICAgfVxuXG4gICAgICAgIGNfcG93ZXJzID0gX2dhdGhlcihjX3Bvd2Vycyk7XG4gICAgICAgIG51bV9leHAgPSBfZ2F0aGVyKG51bV9leHApO1xuXG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgMjsgaSsrKSB7XG4gICAgICAgICAgICBjb25zdCBuZXdfY19wb3dlcnM6IGFueVtdID0gW107XG4gICAgICAgICAgICBsZXQgY2hhbmdlZCA9IGZhbHNlO1xuICAgICAgICAgICAgZm9yIChsZXQgW2IsIGVdIG9mIGNfcG93ZXJzKSB7XG4gICAgICAgICAgICAgICAgbGV0IHA6IGFueTtcbiAgICAgICAgICAgICAgICBpZiAoZS5pc196ZXJvKCkgPT09IHRydWUpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKChiLmlzX0FkZCgpIHx8IGIuaXNfTXVsKCkgJiZcbiAgICAgICAgICAgICAgICAgICAgICAgIGIuX2FyZ3MuaW5jbHVkZXMoUy5Db21wbGV4SW5maW5pdHksIFMuSW5maW5pdHksIFMuTmVmYXRpdmVJbmZpbml0eSkpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gW1tTLk5hTl0sIFtdLCB1bmRlZmluZWRdO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBpZiAoZSA9PT0gUy5PbmUpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGIuaXNfTnVtYmVyKCkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvZWZmID0gY29lZmYuX19tdWxfXyhiKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIHAgPSBiO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBpZiAoZSAhPT0gUy5PbmUpIHtcbiAgICAgICAgICAgICAgICAgICAgcCA9IG5ldyBQb3coYiwgZSk7XG4gICAgICAgICAgICAgICAgICAgIGlmIChwLmlzX1BvdygpICYmICFiLmlzX1BvdygpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBiaSA9IGI7XG4gICAgICAgICAgICAgICAgICAgICAgICBbYiwgZV0gPSBwLmFzX2Jhc2VfZXhwKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoYiAhPT0gYmkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjaGFuZ2VkID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBjX3BhcnQucHVzaChwKTtcbiAgICAgICAgICAgICAgICBuZXdfY19wb3dlcnMucHVzaChbYiwgZV0pO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgY29uc3QgYXJnc2V0ID0gbmV3IEhhc2hTZXQoKTtcbiAgICAgICAgICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBuby11bnVzZWQtdmFyc1xuICAgICAgICAgICAgZm9yIChjb25zdCBbYiwgZV0gb2YgbmV3X2NfcG93ZXJzKSB7XG4gICAgICAgICAgICAgICAgYXJnc2V0LmFkZChiKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChjaGFuZ2VkICYmIGFyZ3NldC5zaXplICE9PSBuZXdfY19wb3dlcnMubGVuZ3RoKSB7XG4gICAgICAgICAgICAgICAgY19wYXJ0ID0gW107XG4gICAgICAgICAgICAgICAgY19wb3dlcnMgPSBfZ2F0aGVyKG5ld19jX3Bvd2Vycyk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGNvbnN0IGludl9leHBfZGljdCA9IG5ldyBIYXNoRGljdCgpO1xuICAgICAgICBmb3IgKGNvbnN0IFtiLCBlXSBvZiBudW1fZXhwKSB7XG4gICAgICAgICAgICBpbnZfZXhwX2RpY3Quc2V0ZGVmYXVsdChlLCBbXSkucHVzaChiKTtcbiAgICAgICAgfVxuICAgICAgICBmb3IgKGNvbnN0IFtlLCBiXSBvZiBpbnZfZXhwX2RpY3QuZW50cmllcygpKSB7XG4gICAgICAgICAgICBpbnZfZXhwX2RpY3QuYWRkKGUsIG5ldyBNdWwodHJ1ZSwgdHJ1ZSwgLi4uYikpO1xuICAgICAgICB9XG4gICAgICAgIGNvbnN0IGNfcGFydF9hcmcgPSBbXTtcbiAgICAgICAgZm9yIChjb25zdCBbZSwgYl0gb2YgaW52X2V4cF9kaWN0LmVudHJpZXMoKSkge1xuICAgICAgICAgICAgaWYgKGUpIHtcbiAgICAgICAgICAgICAgICBjX3BhcnRfYXJnLnB1c2gobmV3IFBvdyhiLCBlKSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgY19wYXJ0LnB1c2goLi4uY19wYXJ0X2FyZyk7XG5cbiAgICAgICAgY29uc3QgY29tYl9lID0gbmV3IEhhc2hEaWN0KCk7XG4gICAgICAgIGZvciAoY29uc3QgW2IsIGVdIG9mIHBudW1fcmF0LmVudHJpZXMoKSkge1xuICAgICAgICAgICAgY29tYl9lLnNldGRlZmF1bHQobmV3IEFkZCh0cnVlLCB0cnVlLCAuLi5lKSwgW10pLnB1c2goYik7XG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCBudW1fcmF0ID0gW107XG4gICAgICAgIGZvciAobGV0IFtlLCBiXSBvZiBjb21iX2UuZW50cmllcygpKSB7XG4gICAgICAgICAgICBiID0gbmV3IE11bCh0cnVlLCB0cnVlLCAuLi5iKTtcbiAgICAgICAgICAgIGlmIChlLnEgPT09IDEpIHtcbiAgICAgICAgICAgICAgICBjb2VmZiA9IGNvZWZmLl9fbXVsX18obmV3IFBvdyhiLCBlKSk7XG4gICAgICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoZS5wID4gZS5xKSB7XG4gICAgICAgICAgICAgICAgY29uc3QgW2VfaSwgZXBdID0gZGl2bW9kKGUucCwgZS5xKTtcbiAgICAgICAgICAgICAgICBjb2VmZiA9IGNvZWZmLl9fbXVsX18obmV3IFBvdyhiLCBlX2kpKTtcbiAgICAgICAgICAgICAgICBlID0gbmV3IFJhdGlvbmFsKGVwLCBlLnEpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgbnVtX3JhdC5wdXNoKFtiLCBlXSk7XG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCBwbmV3ID0gbmV3IEFyckRlZmF1bHREaWN0KCk7XG4gICAgICAgIGxldCBpID0gMDtcbiAgICAgICAgd2hpbGUgKGkgPCBudW1fcmF0Lmxlbmd0aCkge1xuICAgICAgICAgICAgbGV0IFtiaSwgZWldOiBhbnkgPSBudW1fcmF0W2ldO1xuICAgICAgICAgICAgY29uc3QgZ3JvdyA9IFtdO1xuICAgICAgICAgICAgZm9yIChsZXQgaiA9IGkgKyAxOyBqIDwgbnVtX3JhdC5sZW5ndGg7IGorKykge1xuICAgICAgICAgICAgICAgIGNvbnN0IFtiaiwgZWpdOiBhbnkgPSBudW1fcmF0W2pdO1xuICAgICAgICAgICAgICAgIGNvbnN0IGcgPSBiaS5nY2QoYmopO1xuICAgICAgICAgICAgICAgIGlmIChnICE9PSBTLk9uZSkge1xuICAgICAgICAgICAgICAgICAgICBsZXQgZSA9IGVpLl9fYWRkX18oZWopO1xuICAgICAgICAgICAgICAgICAgICBpZiAoZS5xID09PSAxKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb2VmZiA9IGNvZWZmLl9fbXVsX18obmV3IFBvdyhnLCBlKSk7XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoZS5wID4gZS5xKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgW2VfaSwgZXBdID0gZGl2bW9kKGUucCwgZS5xKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb2VmZiA9IGNvZWZmLl9fbXVsX18obmV3IFBvdyhnLCBlX2kpKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBlID0gbmV3IFJhdGlvbmFsKGVwLCBlLnEpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgZ3Jvdy5wdXNoKFtnLCBlXSk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgbnVtX3JhdFtqXSA9IFtiai9nLCBlal07XG4gICAgICAgICAgICAgICAgICAgIGJpID0gYmkvZztcbiAgICAgICAgICAgICAgICAgICAgaWYgKGJpID09PSBTLk9uZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoYmkgIT09IFMuT25lKSB7XG4gICAgICAgICAgICAgICAgY29uc3Qgb2JqOiBhbnkgPSBuZXcgUG93KGJpLCBlaSk7XG4gICAgICAgICAgICAgICAgaWYgKG9iai5pc19OdW1iZXIoKSkge1xuICAgICAgICAgICAgICAgICAgICBjb2VmZiA9IGNvZWZmLl9fbXVsX18ob2JqKTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBmb3IgKGNvbnN0IGl0ZW0gb2YgdGhpcy5tYWtlX2FyZ3MoTXVsLCBvYmopKSB7IC8vICEhISEhIVxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGl0ZW0uaXNfTnVtYmVyKCkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb2VmZiA9IGNvZWZmLl9fbXVsX18ob2JqKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgW2JpLCBlaV0gPSBpdGVtLl9hcmdzO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBuZXcuYWRkKGVpLCBwbmV3LmdldChlaSkucHVzaChiaSkpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgbnVtX3JhdC5wdXNoKC4uLmdyb3cpO1xuICAgICAgICAgICAgaSsrO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKG5lZzFlICE9PSBTLlplcm8pIHtcbiAgICAgICAgICAgIGxldCBuOyBsZXQgcTsgbGV0IHA7XG4gICAgICAgICAgICBbcCwgcV0gPSBuZWcxZS5fYXNfbnVtZXJfZGVub20oKTtcbiAgICAgICAgICAgIFtuLCBwXSA9IGRpdm1vZChwLnAsIHEucCk7XG4gICAgICAgICAgICBpZiAobiAlIDIgIT09IDApIHtcbiAgICAgICAgICAgICAgICBjb2VmZiA9IGNvZWZmLl9fbXVsX18oUy5OZWdhdGl2ZU9uZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAocSA9PT0gMikge1xuICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcImltYWdpbmFyeSBudW1iZXJzIG5vdCB5ZXQgc3VwcG9ydGVkXCIpO1xuICAgICAgICAgICAgfSBlbHNlIGlmIChwKSB7XG4gICAgICAgICAgICAgICAgbmVnMWUgPSBuZXcgUmF0aW9uYWwocCwgcSk7XG4gICAgICAgICAgICAgICAgbGV0IGVudGVyZWxzZTogYm9vbGVhbiA9IHRydWU7XG4gICAgICAgICAgICAgICAgZm9yIChjb25zdCBbZSwgYl0gb2YgcG5ldy5lbnRyaWVzKCkpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGUgPT09IG5lZzFlICYmIGIuaXNfcG9zaXRpdmUoKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgcG5ldy5hZGQoZSwgcG5ldy5nZXQoZSkgLSBiKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGVudGVyZWxzZSA9IGZhbHNlO1xuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgaWYgKGVudGVyZWxzZSkge1xuICAgICAgICAgICAgICAgICAgICBjX3BhcnQucHVzaChuZXcgUG93KFMuTmVnYXRpdmVPbmUsIG5lZzFlLCBmYWxzZSkpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IGNfcGFydF9hcmd2MiA9IFtdO1xuICAgICAgICBmb3IgKGNvbnN0IFtiLCBlXSBvZiBwbmV3LmVudHJpZXMoKSkge1xuICAgICAgICAgICAgY19wYXJ0X2FyZ3YyLnB1c2gobmV3IFBvdyhiLCBlKSk7XG4gICAgICAgIH1cbiAgICAgICAgY19wYXJ0LnB1c2goLi4uY19wYXJ0X2FyZ3YyKTtcblxuICAgICAgICBpZiAoY29lZmYgPT09IFMuSW5maW5pdHkgfHwgY29lZmYgPT09IFMuTmVnYXRpdmVJbmZpbml0eSkge1xuICAgICAgICAgICAgZnVuY3Rpb24gX2hhbmRsZV9mb3Jfb28oY19wYXJ0OiBhbnlbXSwgY29lZmZfc2lnbjogbnVtYmVyKSB7XG4gICAgICAgICAgICAgICAgY29uc3QgbmV3X2NfcGFydCA9IFtdO1xuICAgICAgICAgICAgICAgIGZvciAoY29uc3QgdCBvZiBjX3BhcnQpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHQuaXNfZXh0ZW5kZWRfbmVnYXRpdmUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGlmICh0LmlzX2V4dGVuZGVkX25lZ2F0aXZlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb2VmZl9zaWduICo9IC0xO1xuICAgICAgICAgICAgICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgbmV3X2NfcGFydC5wdXNoKHQpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICByZXR1cm4gW25ld19jX3BhcnQsIGNvZWZmX3NpZ25dO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgbGV0IGNvZWZmX3NpZ246IGFueTtcbiAgICAgICAgICAgIFtjX3BhcnQsIGNvZWZmX3NpZ25dID0gX2hhbmRsZV9mb3Jfb28oY19wYXJ0LCAxKTtcbiAgICAgICAgICAgIFtuY19wYXJ0LCBjb2VmZl9zaWduXSA9IF9oYW5kbGVfZm9yX29vKG5jX3BhcnQsIGNvZWZmX3NpZ24pO1xuICAgICAgICAgICAgY29lZmYgPSBjb2VmZi5fX211bF9fKG5ldyBJbnRlZ2VyKGNvZWZmX3NpZ24pKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChjb2VmZiA9PT0gUy5Db21wbGV4SW5maW5pdHkpIHtcbiAgICAgICAgICAgIGNvbnN0IGN0ZW1wID0gW107XG4gICAgICAgICAgICBmb3IgKGNvbnN0IGMgb2YgY19wYXJ0KSB7XG4gICAgICAgICAgICAgICAgaWYgKCEoZnV6enlfbm90djIoYy5pc196ZXJvKCkpICYmIGMuaXNfZXh0ZW5kZWRfcmVhbCgpICE9PSBcInVuZGVmaW5lZFwiKSkge1xuICAgICAgICAgICAgICAgICAgICBjdGVtcC5wdXNoKGMpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGNfcGFydCA9IGN0ZW1wO1xuICAgICAgICAgICAgY29uc3QgbmN0ZW1wID0gW107XG4gICAgICAgICAgICBmb3IgKGNvbnN0IGMgb2YgbmNfcGFydCkge1xuICAgICAgICAgICAgICAgIGlmICghKGZ1enp5X25vdHYyKGMuaXNfemVybygpKSAmJiBjLmlzX2V4dGVuZGVkX3JlYWwoKSAhPT0gXCJ1bmRlZmluZWRcIikpIHtcbiAgICAgICAgICAgICAgICAgICAgbmN0ZW1wLnB1c2goYyk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgbmNfcGFydCA9IG5jdGVtcDtcbiAgICAgICAgfSBlbHNlIGlmIChjb2VmZi5pc196ZXJvKCkpIHtcbiAgICAgICAgICAgIGZvciAoY29uc3QgYyBvZiBjX3BhcnQpIHtcbiAgICAgICAgICAgICAgICBpZiAoYy5pc19maW5pdGUoKSA9PT0gZmFsc2UpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFtbUy5OYU5dLCBbXSwgb3JkZXJfc3ltYm9sc107XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgY29uc3QgX25ldyA9IFtdO1xuICAgICAgICBmb3IgKGNvbnN0IGkgb2YgY19wYXJ0KSB7XG4gICAgICAgICAgICBpZiAoaS5pc19OdW1iZXIoKSkge1xuICAgICAgICAgICAgICAgIGNvZWZmID0gY29lZmYuX19tdWxfXyhpKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgX25ldy5wdXNoKGkpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGNfcGFydCA9IF9uZXc7XG5cbiAgICAgICAgX211bHNvcnQoY19wYXJ0KTtcblxuICAgICAgICBpZiAoY29lZmYgIT09IFMuT25lKSB7XG4gICAgICAgICAgICBjX3BhcnQuc3BsaWNlKDAsIDAsIGNvZWZmKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChnbG9iYWxfcGFyYW1ldGVycy5kaXN0cmlidXRlICYmICFuY19wYXJ0ICYmIGNfcGFydC5sZW5ndGggPT09IDIgJiZcbiAgICAgICAgICAgIGNfcGFydFswXS5pc19OdW1iZXIoKSAmJiBjX3BhcnRbMF0uaXNfZmluaXRlKCkgJiYgY19wYXJ0WzFdLmlzX0FkZCgpKSB7XG4gICAgICAgICAgICBjb2VmZiA9IGNfcGFydFswXTtcbiAgICAgICAgICAgIGNvbnN0IGFkZGFyZyA9IFtdO1xuICAgICAgICAgICAgZm9yIChjb25zdCBmIG9mIGNfcGFydFsxXS5fYXJncykge1xuICAgICAgICAgICAgICAgIGFkZGFyZy5wdXNoKGNvZWZmLl9fbXVsX18oZikpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgY19wYXJ0ID0gbmV3IEFkZCh0cnVlLCB0cnVlLCAuLi5hZGRhcmcpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBbY19wYXJ0LCBuY19wYXJ0LCBvcmRlcl9zeW1ib2xzXTtcbiAgICB9XG5cbiAgICBhc19jb2VmZl9NdWwocmF0aW9uYWw6IGJvb2xlYW4gPSBmYWxzZSkge1xuICAgICAgICBjb25zdCBjb2VmZjogYW55ID0gdGhpcy5fYXJncy5zbGljZSgwLCAxKVswXTtcbiAgICAgICAgY29uc3QgYXJnczogYW55ID0gdGhpcy5fYXJncy5zbGljZSgxKTtcblxuICAgICAgICBpZiAoY29lZmYuaXNfTnVtYmVyKCkpIHtcbiAgICAgICAgICAgIGlmICghcmF0aW9uYWwgfHwgY29lZmYuaXNfUmF0aW9uYWwoKSkge1xuICAgICAgICAgICAgICAgIGlmIChhcmdzLmxlbmd0aCA9PT0gMSkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gW2NvZWZmLCBhcmdzWzBdXTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gW2NvZWZmLCB0aGlzLl9uZXdfcmF3YXJncyh0cnVlLCAuLi5hcmdzKV07XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSBlbHNlIGlmIChjb2VmZi5pc19leHRlbmRlZF9uZWdhdGl2ZSgpKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIFtTLk5lZ2F0aXZlT25lLCB0aGlzLl9uZXdfcmF3YXJncyh0cnVlLCAuLi5bLWNvZWZmXS5jb25jYXQoYXJncykpXTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gW1MuT25lLCB0aGlzXTtcbiAgICB9XG5cbiAgICBfZXZhbF9wb3dlcihlOiBhbnkpIHtcbiAgICAgICAgY29uc3QgW2NhcmdzLCBuY10gPSB0aGlzLmFyZ3NfY25jKGZhbHNlLCB0cnVlLCBmYWxzZSk7XG4gICAgICAgIGlmIChlLmlzX0ludGVnZXIoKSkge1xuICAgICAgICAgICAgY29uc3QgbXVsYXJncyA9IFtdO1xuICAgICAgICAgICAgZm9yIChjb25zdCBiIG9mIGNhcmdzKSB7XG4gICAgICAgICAgICAgICAgbXVsYXJncy5wdXNoKG5ldyBQb3coYiwgZSwgZmFsc2UpKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiBuZXcgTXVsKHRydWUsIHRydWUsIC4uLm11bGFyZ3MpLl9fbXVsX18oXG4gICAgICAgICAgICAgICAgbmV3IFBvdyh0aGlzLl9mcm9tX2FyZ3MoTXVsLCB1bmRlZmluZWQsIC4uLm5jKSwgZSwgZmFsc2UpKTtcbiAgICAgICAgfVxuICAgICAgICBjb25zdCBwID0gbmV3IFBvdyh0aGlzLCBlLCBmYWxzZSk7XG5cbiAgICAgICAgaWYgKGUuaXNfUmF0aW9uYWwoKSB8fCBlLmlzX0Zsb2F0KCkpIHtcbiAgICAgICAgICAgIHJldHVybiBwLl9ldmFsX2V4cGFuZF9wb3dlcl9iYXNlKCk7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gcDtcbiAgICB9XG5cbiAgICBfa2VlcF9jb2VmZihjb2VmZjogYW55LCBmYWN0b3JzOiBhbnksIGNsZWFyOiBib29sZWFuID0gdHJ1ZSwgc2lnbjogYm9vbGVhbiA9IGZhbHNlKTogYW55IHtcbiAgICAgICAgLyogUmV0dXJuIGBgY29lZmYqZmFjdG9yc2BgIHVuZXZhbHVhdGVkIGlmIG5lY2Vzc2FyeS5cbiAgICAgICAgSWYgYGBjbGVhcmBgIGlzIEZhbHNlLCBkbyBub3Qga2VlcCB0aGUgY29lZmZpY2llbnQgYXMgYSBmYWN0b3JcbiAgICAgICAgaWYgaXQgY2FuIGJlIGRpc3RyaWJ1dGVkIG9uIGEgc2luZ2xlIGZhY3RvciBzdWNoIHRoYXQgb25lIG9yXG4gICAgICAgIG1vcmUgdGVybXMgd2lsbCBzdGlsbCBoYXZlIGludGVnZXIgY29lZmZpY2llbnRzLlxuICAgICAgICBJZiBgYHNpZ25gYCBpcyBUcnVlLCBhbGxvdyBhIGNvZWZmaWNpZW50IG9mIC0xIHRvIHJlbWFpbiBmYWN0b3JlZCBvdXQuXG4gICAgICAgIEV4YW1wbGVzXG4gICAgICAgID09PT09PT09XG4gICAgICAgID4+PiBmcm9tIHN5bXB5LmNvcmUubXVsIGltcG9ydCBfa2VlcF9jb2VmZlxuICAgICAgICA+Pj4gZnJvbSBzeW1weS5hYmMgaW1wb3J0IHgsIHlcbiAgICAgICAgPj4+IGZyb20gc3ltcHkgaW1wb3J0IFNcbiAgICAgICAgPj4+IF9rZWVwX2NvZWZmKFMuSGFsZiwgeCArIDIpXG4gICAgICAgICh4ICsgMikvMlxuICAgICAgICA+Pj4gX2tlZXBfY29lZmYoUy5IYWxmLCB4ICsgMiwgY2xlYXI9RmFsc2UpXG4gICAgICAgIHgvMiArIDFcbiAgICAgICAgPj4+IF9rZWVwX2NvZWZmKFMuSGFsZiwgKHggKyAyKSp5LCBjbGVhcj1GYWxzZSlcbiAgICAgICAgeSooeCArIDIpLzJcbiAgICAgICAgPj4+IF9rZWVwX2NvZWZmKFMoLTEpLCB4ICsgeSlcbiAgICAgICAgLXggLSB5XG4gICAgICAgID4+PiBfa2VlcF9jb2VmZihTKC0xKSwgeCArIHksIHNpZ249VHJ1ZSlcbiAgICAgICAgLSh4ICsgeSlcbiAgICAgICAgKi9cbiAgICAgICAgaWYgKCEoY29lZmYuaXNfTnVtYmVyKCkpKSB7XG4gICAgICAgICAgICBpZiAoZmFjdG9ycy5pc19OdW1iZXIoKSkge1xuICAgICAgICAgICAgICAgIFtmYWN0b3JzLCBjb2VmZl0gPSBbY29lZmYsIGZhY3RvcnNdO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gY29lZmYuX19tdWxfXyhmYWN0b3JzKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBpZiAoZmFjdG9ycyA9PT0gUy5PbmUpIHtcbiAgICAgICAgICAgIHJldHVybiBjb2VmZjtcbiAgICAgICAgfVxuICAgICAgICBpZiAoY29lZmYgPT09IFMuT25lKSB7XG4gICAgICAgICAgICByZXR1cm4gZmFjdG9ycztcbiAgICAgICAgfSBlbHNlIGlmIChjb2VmZiA9PT0gUy5OZWdhdGl2ZU9uZSAmJiAhc2lnbikge1xuICAgICAgICAgICAgcmV0dXJuIGZhY3RvcnMuX19tdWxfXyhTLk5lZ2F0aXZlT25lKTtcbiAgICAgICAgfSBlbHNlIGlmIChmYWN0b3JzLmNvbnN0cnVjdG9yLmlzQWRkKSB7XG4gICAgICAgICAgICBpZiAoIWNsZWFyICYmIGNvZWZmLmNvbnN0cnVjdG9yLmlzX1JhdGlvbmFsICYmIGNvZWZmLnEgIT09IDEpIHtcbiAgICAgICAgICAgICAgICBsZXQgYXJncyA9IFtdO1xuICAgICAgICAgICAgICAgIGZvciAoY29uc3QgaSBvZiBmYWN0b3JzLl9hcmdzKSB7XG4gICAgICAgICAgICAgICAgICAgIGFyZ3MucHVzaChpLmFzX2NvZWZmX011bCgpKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgY29uc3QgdGVtcCA9IFtdO1xuICAgICAgICAgICAgICAgIGZvciAoY29uc3QgW2MsIG1dIG9mIGFyZ3MpIHtcbiAgICAgICAgICAgICAgICAgICAgdGVtcC5wdXNoKFt0aGlzLl9rZWVwX2NvZWZmKGMsIGNvZWZmKSwgbV0pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBhcmdzID0gdGVtcDtcbiAgICAgICAgICAgICAgICBmb3IgKGNvbnN0IFtjXSBvZiBhcmdzKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChjLmNvbnN0cnVjdG9yLmlzX0ludGVnZXIpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IHRlbXBhcmcgPSBbXTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGZvciAoY29uc3QgaSBvZiBhcmdzKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGlbMF0gPT09IDEpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGVtcGFyZy5wdXNoKGkuc2xpY2UoMCwgMSkpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuX2Zyb21fYXJncyhBZGQsIHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAuLi50aGlzLl9mcm9tX2FyZ3MoTXVsLCB1bmRlZmluZWQsIC4uLnRlbXBhcmcpKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIG5ldyBNdWwoZmFsc2UsIHRydWUsIGNvZWZmLCBmYWN0b3JzKTtcbiAgICAgICAgfSBlbHNlIGlmIChmYWN0b3JzLmNvbnN0cnVjdG9yLmlzTXVsKSB7XG4gICAgICAgICAgICBjb25zdCBtYXJnczogYW55W10gPSBmYWN0b3JzLl9hcmdzO1xuICAgICAgICAgICAgaWYgKG1hcmdzWzBdLmNvbnN0cnVjdG9yLmlzX051bWJlcikge1xuICAgICAgICAgICAgICAgIG1hcmdzWzBdID0gbWFyZ3NbMF0uX19tdWxfXyhjb2VmZik7XG4gICAgICAgICAgICAgICAgaWYgKG1hcmdzWzBdID09PSAxKSB7XG4gICAgICAgICAgICAgICAgICAgIG1hcmdzLnNwbGljZSgyLCAxKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIG1hcmdzLnNwbGljZSgwLCAwLCBjb2VmZik7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fZnJvbV9hcmdzKE11bCwgdW5kZWZpbmVkLCAuLi5tYXJncyk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBsZXQgbSA9IGNvZWZmLl9fbXVsX18oZmFjdG9ycyk7XG4gICAgICAgICAgICBpZiAobS5jb25zdHJ1Y3Rvci5pc19OdW1iZXIgJiYgIShmYWN0b3JzLmNvbnN0cnVjdG9yLmlzX051bWJlcikpIHtcbiAgICAgICAgICAgICAgICBtID0gdGhpcy5fZnJvbV9hcmdzKE11bCwgdW5kZWZpbmVkLCBjb2VmZiwgZmFjdG9ycyk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gbTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHN0YXRpYyBfbmV3KGV2YWx1YXRlOiBib29sZWFuLCBzaW1wbGlmeTogYm9vbGVhbiwgLi4uYXJnczogYW55KSB7XG4gICAgICAgIHJldHVybiBuZXcgTXVsKGV2YWx1YXRlLCBzaW1wbGlmeSwgLi4uYXJncyk7XG4gICAgfVxuXG5cbiAgICBfZXZhbF9pc19jb21tdXRhdGl2ZSgpIHtcbiAgICAgICAgY29uc3QgYWxsYXJncyA9IFtdO1xuICAgICAgICBmb3IgKGNvbnN0IGEgb2YgdGhpcy5fYXJncykge1xuICAgICAgICAgICAgYWxsYXJncy5wdXNoKGEuY29uc3RydWN0b3IuaXNfY29tbXV0YXRpdmUpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBfZnV6enlfZ3JvdXB2MihhbGxhcmdzKTtcbiAgICB9XG59XG5cbk1hbmFnZWRQcm9wZXJ0aWVzLnJlZ2lzdGVyKE11bCk7XG5HbG9iYWwucmVnaXN0ZXIoXCJNdWxcIiwgTXVsLl9uZXcpO1xuIiwgIi8qXG5DaGFuZ2VzIG1hZGUgKFdCIGFuZCBHTSk6XG4tIEFkZGVkIGNvbnN0cnVjdG9yIHRvIGV4cGxpY2l0bHkgY2FsbCBBc3NvY09wIHN1cGVyY2xhc3Ncbi0gQWRkZWQgXCJzaW1wbGlmeVwiIGFyZ3VtZW50LCB3aGljaCBwcmV2ZW50cyBpbmZpbml0ZSByZWN1cnNpb24gaW4gQXNzb2NPcFxuLSBOb3RlOiBPcmRlciBvYmplY3RzIGluIEFkZCBhcmUgbm90IHlldCBpbXBsZW1lbnRlZFxuKi9cblxuaW1wb3J0IHtFeHByfSBmcm9tIFwiLi9leHByLmpzXCI7XG5pbXBvcnQge0Fzc29jT3B9IGZyb20gXCIuL29wZXJhdGlvbnMuanNcIjtcbmltcG9ydCB7YmFzZSwgbWl4LCBIYXNoRGljdH0gZnJvbSBcIi4vdXRpbGl0eS5qc1wiO1xuaW1wb3J0IHtTfSBmcm9tIFwiLi9zaW5nbGV0b24uanNcIjtcbmltcG9ydCB7QmFzaWN9IGZyb20gXCIuL2Jhc2ljLmpzXCI7XG5pbXBvcnQge01hbmFnZWRQcm9wZXJ0aWVzfSBmcm9tIFwiLi9hc3N1bXB0aW9ucy5qc1wiO1xuaW1wb3J0IHtNdWx9IGZyb20gXCIuL211bC5qc1wiO1xuaW1wb3J0IHtHbG9iYWx9IGZyb20gXCIuL2dsb2JhbC5qc1wiO1xuaW1wb3J0IHtfZnV6enlfZ3JvdXB2Mn0gZnJvbSBcIi4vbG9naWMuanNcIjtcblxuZnVuY3Rpb24gX2FkZHNvcnQoYXJnczogYW55W10pIHtcbiAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbmV3LWNhcFxuICAgIGFyZ3Muc29ydCgoYSwgYikgPT4gQmFzaWMuY21wKGEsIGIpKTtcbn1cblxuZXhwb3J0IGNsYXNzIEFkZCBleHRlbmRzIG1peChiYXNlKS53aXRoKEV4cHIsIEFzc29jT3ApIHtcbiAgICAvKlxuICAgIFwiXCJcIlxuICAgIEV4cHJlc3Npb24gcmVwcmVzZW50aW5nIGFkZGl0aW9uIG9wZXJhdGlvbiBmb3IgYWxnZWJyYWljIGdyb3VwLlxuICAgIC4uIGRlcHJlY2F0ZWQ6OiAxLjdcbiAgICAgICBVc2luZyBhcmd1bWVudHMgdGhhdCBhcmVuJ3Qgc3ViY2xhc3NlcyBvZiA6Y2xhc3M6YH4uRXhwcmAgaW4gY29yZVxuICAgICAgIG9wZXJhdG9ycyAoOmNsYXNzOmB+Lk11bGAsIDpjbGFzczpgfi5BZGRgLCBhbmQgOmNsYXNzOmB+LlBvd2ApIGlzXG4gICAgICAgZGVwcmVjYXRlZC4gU2VlIDpyZWY6YG5vbi1leHByLWFyZ3MtZGVwcmVjYXRlZGAgZm9yIGRldGFpbHMuXG4gICAgRXZlcnkgYXJndW1lbnQgb2YgYGBBZGQoKWBgIG11c3QgYmUgYGBFeHByYGAuIEluZml4IG9wZXJhdG9yIGBgK2BgXG4gICAgb24gbW9zdCBzY2FsYXIgb2JqZWN0cyBpbiBTeW1QeSBjYWxscyB0aGlzIGNsYXNzLlxuICAgIEFub3RoZXIgdXNlIG9mIGBgQWRkKClgYCBpcyB0byByZXByZXNlbnQgdGhlIHN0cnVjdHVyZSBvZiBhYnN0cmFjdFxuICAgIGFkZGl0aW9uIHNvIHRoYXQgaXRzIGFyZ3VtZW50cyBjYW4gYmUgc3Vic3RpdHV0ZWQgdG8gcmV0dXJuIGRpZmZlcmVudFxuICAgIGNsYXNzLiBSZWZlciB0byBleGFtcGxlcyBzZWN0aW9uIGZvciB0aGlzLlxuICAgIGBgQWRkKClgYCBldmFsdWF0ZXMgdGhlIGFyZ3VtZW50IHVubGVzcyBgYGV2YWx1YXRlPUZhbHNlYGAgaXMgcGFzc2VkLlxuICAgIFRoZSBldmFsdWF0aW9uIGxvZ2ljIGluY2x1ZGVzOlxuICAgIDEuIEZsYXR0ZW5pbmdcbiAgICAgICAgYGBBZGQoeCwgQWRkKHksIHopKWBgIC0+IGBgQWRkKHgsIHksIHopYGBcbiAgICAyLiBJZGVudGl0eSByZW1vdmluZ1xuICAgICAgICBgYEFkZCh4LCAwLCB5KWBgIC0+IGBgQWRkKHgsIHkpYGBcbiAgICAzLiBDb2VmZmljaWVudCBjb2xsZWN0aW5nIGJ5IGBgLmFzX2NvZWZmX011bCgpYGBcbiAgICAgICAgYGBBZGQoeCwgMip4KWBgIC0+IGBgTXVsKDMsIHgpYGBcbiAgICA0LiBUZXJtIHNvcnRpbmdcbiAgICAgICAgYGBBZGQoeSwgeCwgMilgYCAtPiBgYEFkZCgyLCB4LCB5KWBgXG4gICAgSWYgbm8gYXJndW1lbnQgaXMgcGFzc2VkLCBpZGVudGl0eSBlbGVtZW50IDAgaXMgcmV0dXJuZWQuIElmIHNpbmdsZVxuICAgIGVsZW1lbnQgaXMgcGFzc2VkLCB0aGF0IGVsZW1lbnQgaXMgcmV0dXJuZWQuXG4gICAgTm90ZSB0aGF0IGBgQWRkKCphcmdzKWBgIGlzIG1vcmUgZWZmaWNpZW50IHRoYW4gYGBzdW0oYXJncylgYCBiZWNhdXNlXG4gICAgaXQgZmxhdHRlbnMgdGhlIGFyZ3VtZW50cy4gYGBzdW0oYSwgYiwgYywgLi4uKWBgIHJlY3Vyc2l2ZWx5IGFkZHMgdGhlXG4gICAgYXJndW1lbnRzIGFzIGBgYSArIChiICsgKGMgKyAuLi4pKWBgLCB3aGljaCBoYXMgcXVhZHJhdGljIGNvbXBsZXhpdHkuXG4gICAgT24gdGhlIG90aGVyIGhhbmQsIGBgQWRkKGEsIGIsIGMsIGQpYGAgZG9lcyBub3QgYXNzdW1lIG5lc3RlZFxuICAgIHN0cnVjdHVyZSwgbWFraW5nIHRoZSBjb21wbGV4aXR5IGxpbmVhci5cbiAgICBTaW5jZSBhZGRpdGlvbiBpcyBncm91cCBvcGVyYXRpb24sIGV2ZXJ5IGFyZ3VtZW50IHNob3VsZCBoYXZlIHRoZVxuICAgIHNhbWUgOm9iajpgc3ltcHkuY29yZS5raW5kLktpbmQoKWAuXG4gICAgRXhhbXBsZXNcbiAgICA9PT09PT09PVxuICAgID4+PiBmcm9tIHN5bXB5IGltcG9ydCBBZGQsIElcbiAgICA+Pj4gZnJvbSBzeW1weS5hYmMgaW1wb3J0IHgsIHlcbiAgICA+Pj4gQWRkKHgsIDEpXG4gICAgeCArIDFcbiAgICA+Pj4gQWRkKHgsIHgpXG4gICAgMip4XG4gICAgPj4+IDIqeCoqMiArIDMqeCArIEkqeSArIDIqeSArIDIqeC81ICsgMS4wKnkgKyAxXG4gICAgMip4KioyICsgMTcqeC81ICsgMy4wKnkgKyBJKnkgKyAxXG4gICAgSWYgYGBldmFsdWF0ZT1GYWxzZWBgIGlzIHBhc3NlZCwgcmVzdWx0IGlzIG5vdCBldmFsdWF0ZWQuXG4gICAgPj4+IEFkZCgxLCAyLCBldmFsdWF0ZT1GYWxzZSlcbiAgICAxICsgMlxuICAgID4+PiBBZGQoeCwgeCwgZXZhbHVhdGU9RmFsc2UpXG4gICAgeCArIHhcbiAgICBgYEFkZCgpYGAgYWxzbyByZXByZXNlbnRzIHRoZSBnZW5lcmFsIHN0cnVjdHVyZSBvZiBhZGRpdGlvbiBvcGVyYXRpb24uXG4gICAgPj4+IGZyb20gc3ltcHkgaW1wb3J0IE1hdHJpeFN5bWJvbFxuICAgID4+PiBBLEIgPSBNYXRyaXhTeW1ib2woJ0EnLCAyLDIpLCBNYXRyaXhTeW1ib2woJ0InLCAyLDIpXG4gICAgPj4+IGV4cHIgPSBBZGQoeCx5KS5zdWJzKHt4OkEsIHk6Qn0pXG4gICAgPj4+IGV4cHJcbiAgICBBICsgQlxuICAgID4+PiB0eXBlKGV4cHIpXG4gICAgPGNsYXNzICdzeW1weS5tYXRyaWNlcy5leHByZXNzaW9ucy5tYXRhZGQuTWF0QWRkJz5cbiAgICBOb3RlIHRoYXQgdGhlIHByaW50ZXJzIGRvIG5vdCBkaXNwbGF5IGluIGFyZ3Mgb3JkZXIuXG4gICAgPj4+IEFkZCh4LCAxKVxuICAgIHggKyAxXG4gICAgPj4+IEFkZCh4LCAxKS5hcmdzXG4gICAgKDEsIHgpXG4gICAgU2VlIEFsc29cbiAgICA9PT09PT09PVxuICAgIE1hdEFkZFxuICAgIFwiXCJcIlxuICAgICovXG5cbiAgICBfX3Nsb3RzX186IGFueVtdID0gW107XG4gICAgYXJnczogYW55W107XG4gICAgc3RhdGljIGlzX0FkZDogYW55ID0gdHJ1ZTsgXG4gICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5ldy1jYXBcbiAgICBzdGF0aWMgX2FyZ3NfdHlwZSA9IEV4cHIoT2JqZWN0KTtcbiAgICBzdGF0aWMgaWRlbnRpdHkgPSBTLlplcm87IC8vICEhISB1bnN1cmUgYWJ0IHRoaXNcblxuICAgIGNvbnN0cnVjdG9yKGV2YWx1YXRlOiBib29sZWFuLCBzaW1wbGlmeTogYm9vbGVhbiwgLi4uYXJnczogYW55KSB7XG4gICAgICAgIHN1cGVyKEFkZCwgZXZhbHVhdGUsIHNpbXBsaWZ5LCAuLi5hcmdzKTtcbiAgICB9XG5cbiAgICBmbGF0dGVuKHNlcTogYW55W10pIHtcbiAgICAgICAgLypcbiAgICAgICAgVGFrZXMgdGhlIHNlcXVlbmNlIFwic2VxXCIgb2YgbmVzdGVkIEFkZHMgYW5kIHJldHVybnMgYSBmbGF0dGVuIGxpc3QuXG4gICAgICAgIFJldHVybnM6IChjb21tdXRhdGl2ZV9wYXJ0LCBub25jb21tdXRhdGl2ZV9wYXJ0LCBvcmRlcl9zeW1ib2xzKVxuICAgICAgICBBcHBsaWVzIGFzc29jaWF0aXZpdHksIGFsbCB0ZXJtcyBhcmUgY29tbXV0YWJsZSB3aXRoIHJlc3BlY3QgdG9cbiAgICAgICAgYWRkaXRpb24uXG4gICAgICAgIE5COiB0aGUgcmVtb3ZhbCBvZiAwIGlzIGFscmVhZHkgaGFuZGxlZCBieSBBc3NvY09wLl9fbmV3X19cbiAgICAgICAgU2VlIGFsc29cbiAgICAgICAgPT09PT09PT1cbiAgICAgICAgc3ltcHkuY29yZS5tdWwuTXVsLmZsYXR0ZW5cbiAgICAgICAgKi9cbiAgICAgICAgbGV0IHJ2ID0gdW5kZWZpbmVkO1xuICAgICAgICBpZiAoc2VxLmxlbmd0aCA9PT0gMikge1xuICAgICAgICAgICAgbGV0IFthLCBiXSA9IHNlcTtcbiAgICAgICAgICAgIGlmIChiLmlzX1JhdGlvbmFsKCkpIHtcbiAgICAgICAgICAgICAgICBbYSwgYl0gPSBbYiwgYV07XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoYS5pc19SYXRpb25hbCgpKSB7XG4gICAgICAgICAgICAgICAgaWYgKGIuaXNfTXVsKCkpIHtcbiAgICAgICAgICAgICAgICAgICAgcnYgPSBbW2EsIGJdLCBbXSwgdW5kZWZpbmVkXTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAocnYpIHtcbiAgICAgICAgICAgICAgICBsZXQgYWxsYyA9IHRydWU7XG4gICAgICAgICAgICAgICAgZm9yIChjb25zdCBzIG9mIHJ2WzBdKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChzLmlzX2NvbW11dGF0aXZlKCkgPT09IGZhbHNlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBhbGxjID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgaWYgKGFsbGMpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHJ2O1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBbW10sIHJ2WzBdLCB1bmRlZmluZWRdO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBjb25zdCB0ZXJtczogSGFzaERpY3QgPSBuZXcgSGFzaERpY3QoKTtcbiAgICAgICAgbGV0IGNvZWZmID0gUy5aZXJvO1xuICAgICAgICBjb25zdCBleHRyYTogYW55W10gPSBbXTtcbiAgICAgICAgZm9yIChjb25zdCBvIG9mIHNlcSkge1xuICAgICAgICAgICAgbGV0IGM7XG4gICAgICAgICAgICBsZXQgcztcbiAgICAgICAgICAgIGlmIChvLmlzX051bWJlcigpKSB7XG4gICAgICAgICAgICAgICAgaWYgKChvID09PSBTLk5hTiB8fCAoY29lZmYgPT09IFMuQ29tcGxleEluZmluaXR5ICYmIG8uaXNfZmluaXRlKCkgPT09IGZhbHNlKSkpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFtbUy5OYU5dLCBbXSwgdW5kZWZpbmVkXTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgaWYgKGNvZWZmLmlzX051bWJlcigpKSB7XG4gICAgICAgICAgICAgICAgICAgIGNvZWZmID0gY29lZmYuX19hZGRfXyhvKTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGNvZWZmID09PSBTLk5hTiB8fCAhZXh0cmEpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBbW1MuTmFOXSwgW10sIHVuZGVmaW5lZF07XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKG8gPT09IFMuQ29tcGxleEluZmluaXR5KSB7XG4gICAgICAgICAgICAgICAgaWYgKGNvZWZmLmlzX2Zpbml0ZSgpID09PSBmYWxzZSkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gW1tTLk5hTl0sIFtdLCB1bmRlZmluZWRdO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBjb2VmZiA9IFMuQ29tcGxleEluZmluaXR5O1xuICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgICAgfSBlbHNlIGlmIChvLmlzX0FkZCgpKSB7XG4gICAgICAgICAgICAgICAgc2VxLnB1c2goLi4uby5fYXJncyk7XG4gICAgICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKG8uaXNfTXVsKCkpIHtcbiAgICAgICAgICAgICAgICBbYywgc10gPSBvLmFzX2NvZWZmX011bCgpO1xuICAgICAgICAgICAgfSBlbHNlIGlmIChvLmlzX1Bvdykge1xuICAgICAgICAgICAgICAgIGNvbnN0IHBhaXIgPSBvLmFzX2Jhc2VfZXhwKCk7XG4gICAgICAgICAgICAgICAgY29uc3QgYiA9IHBhaXJbMF07XG4gICAgICAgICAgICAgICAgY29uc3QgZSA9IHBhaXJbMV07XG4gICAgICAgICAgICAgICAgaWYgKGIuaXNfTnVtYmVyKCkgJiYgKGUuaXNfSW50ZWdlcigpIHx8IChlLmlzX1JhdGlvbmFsKCkgJiYgZS5pc19uZWdhdGl2ZSgpKSkpIHtcbiAgICAgICAgICAgICAgICAgICAgc2VxLnB1c2goYi5fZXZhbF9wb3dlcihlKSk7XG4gICAgICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBbYywgc10gPSBbUy5PbmUsIG9dO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBjID0gUy5PbmU7XG4gICAgICAgICAgICAgICAgcyA9IG87XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAodGVybXMuaGFzKHMpKSB7XG4gICAgICAgICAgICAgICAgdGVybXMuYWRkKHMsIHRlcm1zLmdldChzKS5fX2FkZF9fKGMpKTtcbiAgICAgICAgICAgICAgICBpZiAodGVybXMuZ2V0KHMpID09PSBTLk5hTikge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gW1tTLk5hTl0sIFtdLCB1bmRlZmluZWRdO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgdGVybXMuYWRkKHMsIGMpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGxldCBuZXdzZXE6IGFueVtdID0gW107XG4gICAgICAgIGxldCBub25jb21tdXRhdGl2ZTogYm9vbGVhbiA9IGZhbHNlO1xuICAgICAgICBmb3IgKGNvbnN0IGl0ZW0gb2YgdGVybXMuZW50cmllcygpKSB7XG4gICAgICAgICAgICBjb25zdCBzOiBhbnkgPSBpdGVtWzBdO1xuICAgICAgICAgICAgY29uc3QgYzogYW55ID0gaXRlbVsxXTtcbiAgICAgICAgICAgIGlmIChjLmlzX3plcm8oKSkge1xuICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgICAgfSBlbHNlIGlmIChjID09PSBTLk9uZSkge1xuICAgICAgICAgICAgICAgIG5ld3NlcS5wdXNoKHMpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBpZiAocy5pc19NdWwoKSkge1xuICAgICAgICAgICAgICAgICAgICBjb25zdCBjcyA9IHMuX25ld19yYXdhcmdzKHRydWUsIC4uLltjXS5jb25jYXQocy5fYXJncykpO1xuICAgICAgICAgICAgICAgICAgICBuZXdzZXEucHVzaChjcyk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmIChzLmlzX0FkZCgpKSB7XG4gICAgICAgICAgICAgICAgICAgIG5ld3NlcS5wdXNoKG5ldyBNdWwoZmFsc2UsIHRydWUsIGMsIHMpKTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBuZXdzZXEucHVzaChuZXcgTXVsKHRydWUsIHRydWUsIGMsIHMpKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBub25jb21tdXRhdGl2ZSA9IG5vbmNvbW11dGF0aXZlIHx8ICEocy5pc19jb21tdXRhdGl2ZSgpKTtcbiAgICAgICAgfVxuICAgICAgICBjb25zdCB0ZW1wID0gW107XG4gICAgICAgIGlmIChjb2VmZiA9PT0gUy5JbmZpbml0eSkge1xuICAgICAgICAgICAgZm9yIChjb25zdCBmIG9mIG5ld3NlcSkge1xuICAgICAgICAgICAgICAgIGlmICghKGYuaXNfZXh0ZW5kZWRfbm9ubmVnYXRpdmUoKSkpIHtcbiAgICAgICAgICAgICAgICAgICAgdGVtcC5wdXNoKGYpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIG5ld3NlcSA9IHRlbXA7XG4gICAgICAgIH0gZWxzZSBpZiAoY29lZmYgPT09IFMuTmVnYXRpdmVJbmZpbml0eSkge1xuICAgICAgICAgICAgZm9yIChjb25zdCBmIG9mIG5ld3NlcSkge1xuICAgICAgICAgICAgICAgIGlmICghKGYuaXNfZXh0ZW5kZWRfbm9ucG9zaXRpdmUoKSkpIHtcbiAgICAgICAgICAgICAgICAgICAgdGVtcC5wdXNoKGYpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIG5ld3NlcSA9IHRlbXA7XG4gICAgICAgIH1cbiAgICAgICAgY29uc3QgdGVtcDIgPSBbXTtcbiAgICAgICAgaWYgKGNvZWZmID09PSBTLkNvbXBsZXhJbmZpbml0eSkge1xuICAgICAgICAgICAgZm9yIChjb25zdCBjIG9mIG5ld3NlcSkge1xuICAgICAgICAgICAgICAgIGlmICghKGMuaXNfZmluaXRlKCkgfHwgYy5pc19leHRlbmRlZF9yZWFsKCkgIT09IFwidW5kZWZpbmVkXCIpKSB7XG4gICAgICAgICAgICAgICAgICAgIHRlbXAyLnB1c2goYyk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgbmV3c2VxID0gdGVtcDI7XG4gICAgICAgIH1cbiAgICAgICAgX2FkZHNvcnQobmV3c2VxKTtcbiAgICAgICAgaWYgKGNvZWZmICE9PSBTLlplcm8pIHtcbiAgICAgICAgICAgIG5ld3NlcS5zcGxpY2UoMCwgMCwgY29lZmYpO1xuICAgICAgICB9XG4gICAgICAgIGlmIChub25jb21tdXRhdGl2ZSkge1xuICAgICAgICAgICAgcmV0dXJuIFtbXSwgbmV3c2VxLCB1bmRlZmluZWRdO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuIFtuZXdzZXEsIFtdLCB1bmRlZmluZWRdO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgX2V2YWxfaXNfY29tbXV0YXRpdmUoKSB7XG4gICAgICAgIGNvbnN0IGZ1enp5YXJnID0gW107XG4gICAgICAgIGZvciAoY29uc3QgYSBvZiB0aGlzLl9hcmdzKSB7XG4gICAgICAgICAgICBmdXp6eWFyZy5wdXNoKGEuaXNfY29tbXV0YXRpdmUoKSk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIF9mdXp6eV9ncm91cHYyKGZ1enp5YXJnKTtcbiAgICB9XG5cbiAgICBhc19jb2VmZl9BZGQoKSB7XG4gICAgICAgIGNvbnN0IFtjb2VmZiwgYXJnc10gPSBbdGhpcy5hcmdzWzBdLCB0aGlzLmFyZ3Muc2xpY2UoMSldO1xuICAgICAgICBpZiAoY29lZmYuaXNfTnVtYmVyKCkgJiYgY29lZmYuaXNfUmF0aW9uYWwoKSkge1xuICAgICAgICAgICAgcmV0dXJuIFtjb2VmZiwgdGhpcy5fbmV3X3Jhd2FyZ3ModHJ1ZSwgLi4uYXJncyldO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBbUy5aZXJvLCB0aGlzXTtcbiAgICB9XG5cbiAgICBzdGF0aWMgX25ldyhldmFsdWF0ZTogYm9vbGVhbiwgc2ltcGxpZnk6IGJvb2xlYW4sIC4uLmFyZ3M6IGFueSkge1xuICAgICAgICByZXR1cm4gbmV3IEFkZChldmFsdWF0ZSwgc2ltcGxpZnksIC4uLmFyZ3MpO1xuICAgIH1cbn1cblxuTWFuYWdlZFByb3BlcnRpZXMucmVnaXN0ZXIoQWRkKTtcbkdsb2JhbC5yZWdpc3RlcihcIkFkZFwiLCBBZGQuX25ldyk7XG4iLCAiLyohXHJcbiAqICBkZWNpbWFsLmpzIHYxMC40LjNcclxuICogIEFuIGFyYml0cmFyeS1wcmVjaXNpb24gRGVjaW1hbCB0eXBlIGZvciBKYXZhU2NyaXB0LlxyXG4gKiAgaHR0cHM6Ly9naXRodWIuY29tL01pa2VNY2wvZGVjaW1hbC5qc1xyXG4gKiAgQ29weXJpZ2h0IChjKSAyMDIyIE1pY2hhZWwgTWNsYXVnaGxpbiA8TThjaDg4bEBnbWFpbC5jb20+XHJcbiAqICBNSVQgTGljZW5jZVxyXG4gKi9cclxuXHJcblxyXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSAgRURJVEFCTEUgREVGQVVMVFMgIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSAvL1xyXG5cclxuXHJcbiAgLy8gVGhlIG1heGltdW0gZXhwb25lbnQgbWFnbml0dWRlLlxyXG4gIC8vIFRoZSBsaW1pdCBvbiB0aGUgdmFsdWUgb2YgYHRvRXhwTmVnYCwgYHRvRXhwUG9zYCwgYG1pbkVgIGFuZCBgbWF4RWAuXHJcbnZhciBFWFBfTElNSVQgPSA5ZTE1LCAgICAgICAgICAgICAgICAgICAgICAvLyAwIHRvIDllMTVcclxuXHJcbiAgLy8gVGhlIGxpbWl0IG9uIHRoZSB2YWx1ZSBvZiBgcHJlY2lzaW9uYCwgYW5kIG9uIHRoZSB2YWx1ZSBvZiB0aGUgZmlyc3QgYXJndW1lbnQgdG9cclxuICAvLyBgdG9EZWNpbWFsUGxhY2VzYCwgYHRvRXhwb25lbnRpYWxgLCBgdG9GaXhlZGAsIGB0b1ByZWNpc2lvbmAgYW5kIGB0b1NpZ25pZmljYW50RGlnaXRzYC5cclxuICBNQVhfRElHSVRTID0gMWU5LCAgICAgICAgICAgICAgICAgICAgICAgIC8vIDAgdG8gMWU5XHJcblxyXG4gIC8vIEJhc2UgY29udmVyc2lvbiBhbHBoYWJldC5cclxuICBOVU1FUkFMUyA9ICcwMTIzNDU2Nzg5YWJjZGVmJyxcclxuXHJcbiAgLy8gVGhlIG5hdHVyYWwgbG9nYXJpdGhtIG9mIDEwICgxMDI1IGRpZ2l0cykuXHJcbiAgTE4xMCA9ICcyLjMwMjU4NTA5Mjk5NDA0NTY4NDAxNzk5MTQ1NDY4NDM2NDIwNzYwMTEwMTQ4ODYyODc3Mjk3NjAzMzMyNzkwMDk2NzU3MjYwOTY3NzM1MjQ4MDIzNTk5NzIwNTA4OTU5ODI5ODM0MTk2Nzc4NDA0MjI4NjI0ODYzMzQwOTUyNTQ2NTA4MjgwNjc1NjY2NjI4NzM2OTA5ODc4MTY4OTQ4MjkwNzIwODMyNTU1NDY4MDg0Mzc5OTg5NDgyNjIzMzE5ODUyODM5MzUwNTMwODk2NTM3NzczMjYyODg0NjE2MzM2NjIyMjI4NzY5ODIxOTg4Njc0NjU0MzY2NzQ3NDQwNDI0MzI3NDM2NTE1NTA0ODkzNDMxNDkzOTM5MTQ3OTYxOTQwNDQwMDIyMjEwNTEwMTcxNDE3NDgwMDM2ODgwODQwMTI2NDcwODA2ODU1Njc3NDMyMTYyMjgzNTUyMjAxMTQ4MDQ2NjM3MTU2NTkxMjEzNzM0NTA3NDc4NTY5NDc2ODM0NjM2MTY3OTIxMDE4MDY0NDUwNzA2NDgwMDAyNzc1MDI2ODQ5MTY3NDY1NTA1ODY4NTY5MzU2NzM0MjA2NzA1ODExMzY0MjkyMjQ1NTQ0MDU3NTg5MjU3MjQyMDgyNDEzMTQ2OTU2ODkwMTY3NTg5NDAyNTY3NzYzMTEzNTY5MTkyOTIwMzMzNzY1ODcxNDE2NjAyMzAxMDU3MDMwODk2MzQ1NzIwNzU0NDAzNzA4NDc0Njk5NDAxNjgyNjkyODI4MDg0ODExODQyODkzMTQ4NDg1MjQ5NDg2NDQ4NzE5Mjc4MDk2NzYyNzEyNzU3NzUzOTcwMjc2Njg2MDU5NTI0OTY3MTY2NzQxODM0ODU3MDQ0MjI1MDcxOTc5NjUwMDQ3MTQ5NTEwNTA0OTIyMTQ3NzY1Njc2MzY5Mzg2NjI5NzY5Nzk1MjIxMTA3MTgyNjQ1NDk3MzQ3NzI2NjI0MjU3MDk0MjkzMjI1ODI3OTg1MDI1ODU1MDk3ODUyNjUzODMyMDc2MDY3MjYzMTcxNjQzMDk1MDU5OTUwODc4MDc1MjM3MTAzMzMxMDExOTc4NTc1NDczMzE1NDE0MjE4MDg0Mjc1NDM4NjM1OTE3NzgxMTcwNTQzMDk4Mjc0ODIzODUwNDU2NDgwMTkwOTU2MTAyOTkyOTE4MjQzMTgyMzc1MjUzNTc3MDk3NTA1Mzk1NjUxODc2OTc1MTAzNzQ5NzA4ODg2OTIxODAyMDUxODkzMzk1MDcyMzg1MzkyMDUxNDQ2MzQxOTcyNjUyODcyODY5NjUxMTA4NjI1NzE0OTIxOTg4NDk5Nzg3NDg4NzM3NzEzNDU2ODYyMDkxNjcwNTgnLFxyXG5cclxuICAvLyBQaSAoMTAyNSBkaWdpdHMpLlxyXG4gIFBJID0gJzMuMTQxNTkyNjUzNTg5NzkzMjM4NDYyNjQzMzgzMjc5NTAyODg0MTk3MTY5Mzk5Mzc1MTA1ODIwOTc0OTQ0NTkyMzA3ODE2NDA2Mjg2MjA4OTk4NjI4MDM0ODI1MzQyMTE3MDY3OTgyMTQ4MDg2NTEzMjgyMzA2NjQ3MDkzODQ0NjA5NTUwNTgyMjMxNzI1MzU5NDA4MTI4NDgxMTE3NDUwMjg0MTAyNzAxOTM4NTIxMTA1NTU5NjQ0NjIyOTQ4OTU0OTMwMzgxOTY0NDI4ODEwOTc1NjY1OTMzNDQ2MTI4NDc1NjQ4MjMzNzg2NzgzMTY1MjcxMjAxOTA5MTQ1NjQ4NTY2OTIzNDYwMzQ4NjEwNDU0MzI2NjQ4MjEzMzkzNjA3MjYwMjQ5MTQxMjczNzI0NTg3MDA2NjA2MzE1NTg4MTc0ODgxNTIwOTIwOTYyODI5MjU0MDkxNzE1MzY0MzY3ODkyNTkwMzYwMDExMzMwNTMwNTQ4ODIwNDY2NTIxMzg0MTQ2OTUxOTQxNTExNjA5NDMzMDU3MjcwMzY1NzU5NTkxOTUzMDkyMTg2MTE3MzgxOTMyNjExNzkzMTA1MTE4NTQ4MDc0NDYyMzc5OTYyNzQ5NTY3MzUxODg1NzUyNzI0ODkxMjI3OTM4MTgzMDExOTQ5MTI5ODMzNjczMzYyNDQwNjU2NjQzMDg2MDIxMzk0OTQ2Mzk1MjI0NzM3MTkwNzAyMTc5ODYwOTQzNzAyNzcwNTM5MjE3MTc2MjkzMTc2NzUyMzg0Njc0ODE4NDY3NjY5NDA1MTMyMDAwNTY4MTI3MTQ1MjYzNTYwODI3Nzg1NzcxMzQyNzU3Nzg5NjA5MTczNjM3MTc4NzIxNDY4NDQwOTAxMjI0OTUzNDMwMTQ2NTQ5NTg1MzcxMDUwNzkyMjc5Njg5MjU4OTIzNTQyMDE5OTU2MTEyMTI5MDIxOTYwODY0MDM0NDE4MTU5ODEzNjI5Nzc0NzcxMzA5OTYwNTE4NzA3MjExMzQ5OTk5OTk4MzcyOTc4MDQ5OTUxMDU5NzMxNzMyODE2MDk2MzE4NTk1MDI0NDU5NDU1MzQ2OTA4MzAyNjQyNTIyMzA4MjUzMzQ0Njg1MDM1MjYxOTMxMTg4MTcxMDEwMDAzMTM3ODM4NzUyODg2NTg3NTMzMjA4MzgxNDIwNjE3MTc3NjY5MTQ3MzAzNTk4MjUzNDkwNDI4NzU1NDY4NzMxMTU5NTYyODYzODgyMzUzNzg3NTkzNzUxOTU3NzgxODU3NzgwNTMyMTcxMjI2ODA2NjEzMDAxOTI3ODc2NjExMTk1OTA5MjE2NDIwMTk4OTM4MDk1MjU3MjAxMDY1NDg1ODYzMjc4OScsXHJcblxyXG5cclxuICAvLyBUaGUgaW5pdGlhbCBjb25maWd1cmF0aW9uIHByb3BlcnRpZXMgb2YgdGhlIERlY2ltYWwgY29uc3RydWN0b3IuXHJcbiAgREVGQVVMVFMgPSB7XHJcblxyXG4gICAgLy8gVGhlc2UgdmFsdWVzIG11c3QgYmUgaW50ZWdlcnMgd2l0aGluIHRoZSBzdGF0ZWQgcmFuZ2VzIChpbmNsdXNpdmUpLlxyXG4gICAgLy8gTW9zdCBvZiB0aGVzZSB2YWx1ZXMgY2FuIGJlIGNoYW5nZWQgYXQgcnVuLXRpbWUgdXNpbmcgdGhlIGBEZWNpbWFsLmNvbmZpZ2AgbWV0aG9kLlxyXG5cclxuICAgIC8vIFRoZSBtYXhpbXVtIG51bWJlciBvZiBzaWduaWZpY2FudCBkaWdpdHMgb2YgdGhlIHJlc3VsdCBvZiBhIGNhbGN1bGF0aW9uIG9yIGJhc2UgY29udmVyc2lvbi5cclxuICAgIC8vIEUuZy4gYERlY2ltYWwuY29uZmlnKHsgcHJlY2lzaW9uOiAyMCB9KTtgXHJcbiAgICBwcmVjaXNpb246IDIwLCAgICAgICAgICAgICAgICAgICAgICAgICAvLyAxIHRvIE1BWF9ESUdJVFNcclxuXHJcbiAgICAvLyBUaGUgcm91bmRpbmcgbW9kZSB1c2VkIHdoZW4gcm91bmRpbmcgdG8gYHByZWNpc2lvbmAuXHJcbiAgICAvL1xyXG4gICAgLy8gUk9VTkRfVVAgICAgICAgICAwIEF3YXkgZnJvbSB6ZXJvLlxyXG4gICAgLy8gUk9VTkRfRE9XTiAgICAgICAxIFRvd2FyZHMgemVyby5cclxuICAgIC8vIFJPVU5EX0NFSUwgICAgICAgMiBUb3dhcmRzICtJbmZpbml0eS5cclxuICAgIC8vIFJPVU5EX0ZMT09SICAgICAgMyBUb3dhcmRzIC1JbmZpbml0eS5cclxuICAgIC8vIFJPVU5EX0hBTEZfVVAgICAgNCBUb3dhcmRzIG5lYXJlc3QgbmVpZ2hib3VyLiBJZiBlcXVpZGlzdGFudCwgdXAuXHJcbiAgICAvLyBST1VORF9IQUxGX0RPV04gIDUgVG93YXJkcyBuZWFyZXN0IG5laWdoYm91ci4gSWYgZXF1aWRpc3RhbnQsIGRvd24uXHJcbiAgICAvLyBST1VORF9IQUxGX0VWRU4gIDYgVG93YXJkcyBuZWFyZXN0IG5laWdoYm91ci4gSWYgZXF1aWRpc3RhbnQsIHRvd2FyZHMgZXZlbiBuZWlnaGJvdXIuXHJcbiAgICAvLyBST1VORF9IQUxGX0NFSUwgIDcgVG93YXJkcyBuZWFyZXN0IG5laWdoYm91ci4gSWYgZXF1aWRpc3RhbnQsIHRvd2FyZHMgK0luZmluaXR5LlxyXG4gICAgLy8gUk9VTkRfSEFMRl9GTE9PUiA4IFRvd2FyZHMgbmVhcmVzdCBuZWlnaGJvdXIuIElmIGVxdWlkaXN0YW50LCB0b3dhcmRzIC1JbmZpbml0eS5cclxuICAgIC8vXHJcbiAgICAvLyBFLmcuXHJcbiAgICAvLyBgRGVjaW1hbC5yb3VuZGluZyA9IDQ7YFxyXG4gICAgLy8gYERlY2ltYWwucm91bmRpbmcgPSBEZWNpbWFsLlJPVU5EX0hBTEZfVVA7YFxyXG4gICAgcm91bmRpbmc6IDQsICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gMCB0byA4XHJcblxyXG4gICAgLy8gVGhlIG1vZHVsbyBtb2RlIHVzZWQgd2hlbiBjYWxjdWxhdGluZyB0aGUgbW9kdWx1czogYSBtb2Qgbi5cclxuICAgIC8vIFRoZSBxdW90aWVudCAocSA9IGEgLyBuKSBpcyBjYWxjdWxhdGVkIGFjY29yZGluZyB0byB0aGUgY29ycmVzcG9uZGluZyByb3VuZGluZyBtb2RlLlxyXG4gICAgLy8gVGhlIHJlbWFpbmRlciAocikgaXMgY2FsY3VsYXRlZCBhczogciA9IGEgLSBuICogcS5cclxuICAgIC8vXHJcbiAgICAvLyBVUCAgICAgICAgIDAgVGhlIHJlbWFpbmRlciBpcyBwb3NpdGl2ZSBpZiB0aGUgZGl2aWRlbmQgaXMgbmVnYXRpdmUsIGVsc2UgaXMgbmVnYXRpdmUuXHJcbiAgICAvLyBET1dOICAgICAgIDEgVGhlIHJlbWFpbmRlciBoYXMgdGhlIHNhbWUgc2lnbiBhcyB0aGUgZGl2aWRlbmQgKEphdmFTY3JpcHQgJSkuXHJcbiAgICAvLyBGTE9PUiAgICAgIDMgVGhlIHJlbWFpbmRlciBoYXMgdGhlIHNhbWUgc2lnbiBhcyB0aGUgZGl2aXNvciAoUHl0aG9uICUpLlxyXG4gICAgLy8gSEFMRl9FVkVOICA2IFRoZSBJRUVFIDc1NCByZW1haW5kZXIgZnVuY3Rpb24uXHJcbiAgICAvLyBFVUNMSUQgICAgIDkgRXVjbGlkaWFuIGRpdmlzaW9uLiBxID0gc2lnbihuKSAqIGZsb29yKGEgLyBhYnMobikpLiBBbHdheXMgcG9zaXRpdmUuXHJcbiAgICAvL1xyXG4gICAgLy8gVHJ1bmNhdGVkIGRpdmlzaW9uICgxKSwgZmxvb3JlZCBkaXZpc2lvbiAoMyksIHRoZSBJRUVFIDc1NCByZW1haW5kZXIgKDYpLCBhbmQgRXVjbGlkaWFuXHJcbiAgICAvLyBkaXZpc2lvbiAoOSkgYXJlIGNvbW1vbmx5IHVzZWQgZm9yIHRoZSBtb2R1bHVzIG9wZXJhdGlvbi4gVGhlIG90aGVyIHJvdW5kaW5nIG1vZGVzIGNhbiBhbHNvXHJcbiAgICAvLyBiZSB1c2VkLCBidXQgdGhleSBtYXkgbm90IGdpdmUgdXNlZnVsIHJlc3VsdHMuXHJcbiAgICBtb2R1bG86IDEsICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyAwIHRvIDlcclxuXHJcbiAgICAvLyBUaGUgZXhwb25lbnQgdmFsdWUgYXQgYW5kIGJlbmVhdGggd2hpY2ggYHRvU3RyaW5nYCByZXR1cm5zIGV4cG9uZW50aWFsIG5vdGF0aW9uLlxyXG4gICAgLy8gSmF2YVNjcmlwdCBudW1iZXJzOiAtN1xyXG4gICAgdG9FeHBOZWc6IC03LCAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gMCB0byAtRVhQX0xJTUlUXHJcblxyXG4gICAgLy8gVGhlIGV4cG9uZW50IHZhbHVlIGF0IGFuZCBhYm92ZSB3aGljaCBgdG9TdHJpbmdgIHJldHVybnMgZXhwb25lbnRpYWwgbm90YXRpb24uXHJcbiAgICAvLyBKYXZhU2NyaXB0IG51bWJlcnM6IDIxXHJcbiAgICB0b0V4cFBvczogIDIxLCAgICAgICAgICAgICAgICAgICAgICAgICAvLyAwIHRvIEVYUF9MSU1JVFxyXG5cclxuICAgIC8vIFRoZSBtaW5pbXVtIGV4cG9uZW50IHZhbHVlLCBiZW5lYXRoIHdoaWNoIHVuZGVyZmxvdyB0byB6ZXJvIG9jY3Vycy5cclxuICAgIC8vIEphdmFTY3JpcHQgbnVtYmVyczogLTMyNCAgKDVlLTMyNClcclxuICAgIG1pbkU6IC1FWFBfTElNSVQsICAgICAgICAgICAgICAgICAgICAgIC8vIC0xIHRvIC1FWFBfTElNSVRcclxuXHJcbiAgICAvLyBUaGUgbWF4aW11bSBleHBvbmVudCB2YWx1ZSwgYWJvdmUgd2hpY2ggb3ZlcmZsb3cgdG8gSW5maW5pdHkgb2NjdXJzLlxyXG4gICAgLy8gSmF2YVNjcmlwdCBudW1iZXJzOiAzMDggICgxLjc5NzY5MzEzNDg2MjMxNTdlKzMwOClcclxuICAgIG1heEU6IEVYUF9MSU1JVCwgICAgICAgICAgICAgICAgICAgICAgIC8vIDEgdG8gRVhQX0xJTUlUXHJcblxyXG4gICAgLy8gV2hldGhlciB0byB1c2UgY3J5cHRvZ3JhcGhpY2FsbHktc2VjdXJlIHJhbmRvbSBudW1iZXIgZ2VuZXJhdGlvbiwgaWYgYXZhaWxhYmxlLlxyXG4gICAgY3J5cHRvOiBmYWxzZSAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gdHJ1ZS9mYWxzZVxyXG4gIH0sXHJcblxyXG5cclxuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0gRU5EIE9GIEVESVRBQkxFIERFRkFVTFRTIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0gLy9cclxuXHJcblxyXG4gIGluZXhhY3QsIHF1YWRyYW50LFxyXG4gIGV4dGVybmFsID0gdHJ1ZSxcclxuXHJcbiAgZGVjaW1hbEVycm9yID0gJ1tEZWNpbWFsRXJyb3JdICcsXHJcbiAgaW52YWxpZEFyZ3VtZW50ID0gZGVjaW1hbEVycm9yICsgJ0ludmFsaWQgYXJndW1lbnQ6ICcsXHJcbiAgcHJlY2lzaW9uTGltaXRFeGNlZWRlZCA9IGRlY2ltYWxFcnJvciArICdQcmVjaXNpb24gbGltaXQgZXhjZWVkZWQnLFxyXG4gIGNyeXB0b1VuYXZhaWxhYmxlID0gZGVjaW1hbEVycm9yICsgJ2NyeXB0byB1bmF2YWlsYWJsZScsXHJcbiAgdGFnID0gJ1tvYmplY3QgRGVjaW1hbF0nLFxyXG5cclxuICBtYXRoZmxvb3IgPSBNYXRoLmZsb29yLFxyXG4gIG1hdGhwb3cgPSBNYXRoLnBvdyxcclxuXHJcbiAgaXNCaW5hcnkgPSAvXjBiKFswMV0rKFxcLlswMV0qKT98XFwuWzAxXSspKHBbKy1dP1xcZCspPyQvaSxcclxuICBpc0hleCA9IC9eMHgoWzAtOWEtZl0rKFxcLlswLTlhLWZdKik/fFxcLlswLTlhLWZdKykocFsrLV0/XFxkKyk/JC9pLFxyXG4gIGlzT2N0YWwgPSAvXjBvKFswLTddKyhcXC5bMC03XSopP3xcXC5bMC03XSspKHBbKy1dP1xcZCspPyQvaSxcclxuICBpc0RlY2ltYWwgPSAvXihcXGQrKFxcLlxcZCopP3xcXC5cXGQrKShlWystXT9cXGQrKT8kL2ksXHJcblxyXG4gIEJBU0UgPSAxZTcsXHJcbiAgTE9HX0JBU0UgPSA3LFxyXG4gIE1BWF9TQUZFX0lOVEVHRVIgPSA5MDA3MTk5MjU0NzQwOTkxLFxyXG5cclxuICBMTjEwX1BSRUNJU0lPTiA9IExOMTAubGVuZ3RoIC0gMSxcclxuICBQSV9QUkVDSVNJT04gPSBQSS5sZW5ndGggLSAxLFxyXG5cclxuICAvLyBEZWNpbWFsLnByb3RvdHlwZSBvYmplY3RcclxuICBQID0geyB0b1N0cmluZ1RhZzogdGFnIH07XHJcblxyXG5cclxuLy8gRGVjaW1hbCBwcm90b3R5cGUgbWV0aG9kc1xyXG5cclxuXHJcbi8qXHJcbiAqICBhYnNvbHV0ZVZhbHVlICAgICAgICAgICAgIGFic1xyXG4gKiAgY2VpbFxyXG4gKiAgY2xhbXBlZFRvICAgICAgICAgICAgICAgICBjbGFtcFxyXG4gKiAgY29tcGFyZWRUbyAgICAgICAgICAgICAgICBjbXBcclxuICogIGNvc2luZSAgICAgICAgICAgICAgICAgICAgY29zXHJcbiAqICBjdWJlUm9vdCAgICAgICAgICAgICAgICAgIGNicnRcclxuICogIGRlY2ltYWxQbGFjZXMgICAgICAgICAgICAgZHBcclxuICogIGRpdmlkZWRCeSAgICAgICAgICAgICAgICAgZGl2XHJcbiAqICBkaXZpZGVkVG9JbnRlZ2VyQnkgICAgICAgIGRpdlRvSW50XHJcbiAqICBlcXVhbHMgICAgICAgICAgICAgICAgICAgIGVxXHJcbiAqICBmbG9vclxyXG4gKiAgZ3JlYXRlclRoYW4gICAgICAgICAgICAgICBndFxyXG4gKiAgZ3JlYXRlclRoYW5PckVxdWFsVG8gICAgICBndGVcclxuICogIGh5cGVyYm9saWNDb3NpbmUgICAgICAgICAgY29zaFxyXG4gKiAgaHlwZXJib2xpY1NpbmUgICAgICAgICAgICBzaW5oXHJcbiAqICBoeXBlcmJvbGljVGFuZ2VudCAgICAgICAgIHRhbmhcclxuICogIGludmVyc2VDb3NpbmUgICAgICAgICAgICAgYWNvc1xyXG4gKiAgaW52ZXJzZUh5cGVyYm9saWNDb3NpbmUgICBhY29zaFxyXG4gKiAgaW52ZXJzZUh5cGVyYm9saWNTaW5lICAgICBhc2luaFxyXG4gKiAgaW52ZXJzZUh5cGVyYm9saWNUYW5nZW50ICBhdGFuaFxyXG4gKiAgaW52ZXJzZVNpbmUgICAgICAgICAgICAgICBhc2luXHJcbiAqICBpbnZlcnNlVGFuZ2VudCAgICAgICAgICAgIGF0YW5cclxuICogIGlzRmluaXRlXHJcbiAqICBpc0ludGVnZXIgICAgICAgICAgICAgICAgIGlzSW50XHJcbiAqICBpc05hTlxyXG4gKiAgaXNOZWdhdGl2ZSAgICAgICAgICAgICAgICBpc05lZ1xyXG4gKiAgaXNQb3NpdGl2ZSAgICAgICAgICAgICAgICBpc1Bvc1xyXG4gKiAgaXNaZXJvXHJcbiAqICBsZXNzVGhhbiAgICAgICAgICAgICAgICAgIGx0XHJcbiAqICBsZXNzVGhhbk9yRXF1YWxUbyAgICAgICAgIGx0ZVxyXG4gKiAgbG9nYXJpdGhtICAgICAgICAgICAgICAgICBsb2dcclxuICogIFttYXhpbXVtXSAgICAgICAgICAgICAgICAgW21heF1cclxuICogIFttaW5pbXVtXSAgICAgICAgICAgICAgICAgW21pbl1cclxuICogIG1pbnVzICAgICAgICAgICAgICAgICAgICAgc3ViXHJcbiAqICBtb2R1bG8gICAgICAgICAgICAgICAgICAgIG1vZFxyXG4gKiAgbmF0dXJhbEV4cG9uZW50aWFsICAgICAgICBleHBcclxuICogIG5hdHVyYWxMb2dhcml0aG0gICAgICAgICAgbG5cclxuICogIG5lZ2F0ZWQgICAgICAgICAgICAgICAgICAgbmVnXHJcbiAqICBwbHVzICAgICAgICAgICAgICAgICAgICAgIGFkZFxyXG4gKiAgcHJlY2lzaW9uICAgICAgICAgICAgICAgICBzZFxyXG4gKiAgcm91bmRcclxuICogIHNpbmUgICAgICAgICAgICAgICAgICAgICAgc2luXHJcbiAqICBzcXVhcmVSb290ICAgICAgICAgICAgICAgIHNxcnRcclxuICogIHRhbmdlbnQgICAgICAgICAgICAgICAgICAgdGFuXHJcbiAqICB0aW1lcyAgICAgICAgICAgICAgICAgICAgIG11bFxyXG4gKiAgdG9CaW5hcnlcclxuICogIHRvRGVjaW1hbFBsYWNlcyAgICAgICAgICAgdG9EUFxyXG4gKiAgdG9FeHBvbmVudGlhbFxyXG4gKiAgdG9GaXhlZFxyXG4gKiAgdG9GcmFjdGlvblxyXG4gKiAgdG9IZXhhZGVjaW1hbCAgICAgICAgICAgICB0b0hleFxyXG4gKiAgdG9OZWFyZXN0XHJcbiAqICB0b051bWJlclxyXG4gKiAgdG9PY3RhbFxyXG4gKiAgdG9Qb3dlciAgICAgICAgICAgICAgICAgICBwb3dcclxuICogIHRvUHJlY2lzaW9uXHJcbiAqICB0b1NpZ25pZmljYW50RGlnaXRzICAgICAgIHRvU0RcclxuICogIHRvU3RyaW5nXHJcbiAqICB0cnVuY2F0ZWQgICAgICAgICAgICAgICAgIHRydW5jXHJcbiAqICB2YWx1ZU9mICAgICAgICAgICAgICAgICAgIHRvSlNPTlxyXG4gKi9cclxuXHJcblxyXG4vKlxyXG4gKiBSZXR1cm4gYSBuZXcgRGVjaW1hbCB3aG9zZSB2YWx1ZSBpcyB0aGUgYWJzb2x1dGUgdmFsdWUgb2YgdGhpcyBEZWNpbWFsLlxyXG4gKlxyXG4gKi9cclxuUC5hYnNvbHV0ZVZhbHVlID0gUC5hYnMgPSBmdW5jdGlvbiAoKSB7XHJcbiAgdmFyIHggPSBuZXcgdGhpcy5jb25zdHJ1Y3Rvcih0aGlzKTtcclxuICBpZiAoeC5zIDwgMCkgeC5zID0gMTtcclxuICByZXR1cm4gZmluYWxpc2UoeCk7XHJcbn07XHJcblxyXG5cclxuLypcclxuICogUmV0dXJuIGEgbmV3IERlY2ltYWwgd2hvc2UgdmFsdWUgaXMgdGhlIHZhbHVlIG9mIHRoaXMgRGVjaW1hbCByb3VuZGVkIHRvIGEgd2hvbGUgbnVtYmVyIGluIHRoZVxyXG4gKiBkaXJlY3Rpb24gb2YgcG9zaXRpdmUgSW5maW5pdHkuXHJcbiAqXHJcbiAqL1xyXG5QLmNlaWwgPSBmdW5jdGlvbiAoKSB7XHJcbiAgcmV0dXJuIGZpbmFsaXNlKG5ldyB0aGlzLmNvbnN0cnVjdG9yKHRoaXMpLCB0aGlzLmUgKyAxLCAyKTtcclxufTtcclxuXHJcblxyXG4vKlxyXG4gKiBSZXR1cm4gYSBuZXcgRGVjaW1hbCB3aG9zZSB2YWx1ZSBpcyB0aGUgdmFsdWUgb2YgdGhpcyBEZWNpbWFsIGNsYW1wZWQgdG8gdGhlIHJhbmdlXHJcbiAqIGRlbGluZWF0ZWQgYnkgYG1pbmAgYW5kIGBtYXhgLlxyXG4gKlxyXG4gKiBtaW4ge251bWJlcnxzdHJpbmd8RGVjaW1hbH1cclxuICogbWF4IHtudW1iZXJ8c3RyaW5nfERlY2ltYWx9XHJcbiAqXHJcbiAqL1xyXG5QLmNsYW1wZWRUbyA9IFAuY2xhbXAgPSBmdW5jdGlvbiAobWluLCBtYXgpIHtcclxuICB2YXIgayxcclxuICAgIHggPSB0aGlzLFxyXG4gICAgQ3RvciA9IHguY29uc3RydWN0b3I7XHJcbiAgbWluID0gbmV3IEN0b3IobWluKTtcclxuICBtYXggPSBuZXcgQ3RvcihtYXgpO1xyXG4gIGlmICghbWluLnMgfHwgIW1heC5zKSByZXR1cm4gbmV3IEN0b3IoTmFOKTtcclxuICBpZiAobWluLmd0KG1heCkpIHRocm93IEVycm9yKGludmFsaWRBcmd1bWVudCArIG1heCk7XHJcbiAgayA9IHguY21wKG1pbik7XHJcbiAgcmV0dXJuIGsgPCAwID8gbWluIDogeC5jbXAobWF4KSA+IDAgPyBtYXggOiBuZXcgQ3Rvcih4KTtcclxufTtcclxuXHJcblxyXG4vKlxyXG4gKiBSZXR1cm5cclxuICogICAxICAgIGlmIHRoZSB2YWx1ZSBvZiB0aGlzIERlY2ltYWwgaXMgZ3JlYXRlciB0aGFuIHRoZSB2YWx1ZSBvZiBgeWAsXHJcbiAqICAtMSAgICBpZiB0aGUgdmFsdWUgb2YgdGhpcyBEZWNpbWFsIGlzIGxlc3MgdGhhbiB0aGUgdmFsdWUgb2YgYHlgLFxyXG4gKiAgIDAgICAgaWYgdGhleSBoYXZlIHRoZSBzYW1lIHZhbHVlLFxyXG4gKiAgIE5hTiAgaWYgdGhlIHZhbHVlIG9mIGVpdGhlciBEZWNpbWFsIGlzIE5hTi5cclxuICpcclxuICovXHJcblAuY29tcGFyZWRUbyA9IFAuY21wID0gZnVuY3Rpb24gKHkpIHtcclxuICB2YXIgaSwgaiwgeGRMLCB5ZEwsXHJcbiAgICB4ID0gdGhpcyxcclxuICAgIHhkID0geC5kLFxyXG4gICAgeWQgPSAoeSA9IG5ldyB4LmNvbnN0cnVjdG9yKHkpKS5kLFxyXG4gICAgeHMgPSB4LnMsXHJcbiAgICB5cyA9IHkucztcclxuXHJcbiAgLy8gRWl0aGVyIE5hTiBvciBcdTAwQjFJbmZpbml0eT9cclxuICBpZiAoIXhkIHx8ICF5ZCkge1xyXG4gICAgcmV0dXJuICF4cyB8fCAheXMgPyBOYU4gOiB4cyAhPT0geXMgPyB4cyA6IHhkID09PSB5ZCA/IDAgOiAheGQgXiB4cyA8IDAgPyAxIDogLTE7XHJcbiAgfVxyXG5cclxuICAvLyBFaXRoZXIgemVybz9cclxuICBpZiAoIXhkWzBdIHx8ICF5ZFswXSkgcmV0dXJuIHhkWzBdID8geHMgOiB5ZFswXSA/IC15cyA6IDA7XHJcblxyXG4gIC8vIFNpZ25zIGRpZmZlcj9cclxuICBpZiAoeHMgIT09IHlzKSByZXR1cm4geHM7XHJcblxyXG4gIC8vIENvbXBhcmUgZXhwb25lbnRzLlxyXG4gIGlmICh4LmUgIT09IHkuZSkgcmV0dXJuIHguZSA+IHkuZSBeIHhzIDwgMCA/IDEgOiAtMTtcclxuXHJcbiAgeGRMID0geGQubGVuZ3RoO1xyXG4gIHlkTCA9IHlkLmxlbmd0aDtcclxuXHJcbiAgLy8gQ29tcGFyZSBkaWdpdCBieSBkaWdpdC5cclxuICBmb3IgKGkgPSAwLCBqID0geGRMIDwgeWRMID8geGRMIDogeWRMOyBpIDwgajsgKytpKSB7XHJcbiAgICBpZiAoeGRbaV0gIT09IHlkW2ldKSByZXR1cm4geGRbaV0gPiB5ZFtpXSBeIHhzIDwgMCA/IDEgOiAtMTtcclxuICB9XHJcblxyXG4gIC8vIENvbXBhcmUgbGVuZ3Rocy5cclxuICByZXR1cm4geGRMID09PSB5ZEwgPyAwIDogeGRMID4geWRMIF4geHMgPCAwID8gMSA6IC0xO1xyXG59O1xyXG5cclxuXHJcbi8qXHJcbiAqIFJldHVybiBhIG5ldyBEZWNpbWFsIHdob3NlIHZhbHVlIGlzIHRoZSBjb3NpbmUgb2YgdGhlIHZhbHVlIGluIHJhZGlhbnMgb2YgdGhpcyBEZWNpbWFsLlxyXG4gKlxyXG4gKiBEb21haW46IFstSW5maW5pdHksIEluZmluaXR5XVxyXG4gKiBSYW5nZTogWy0xLCAxXVxyXG4gKlxyXG4gKiBjb3MoMCkgICAgICAgICA9IDFcclxuICogY29zKC0wKSAgICAgICAgPSAxXHJcbiAqIGNvcyhJbmZpbml0eSkgID0gTmFOXHJcbiAqIGNvcygtSW5maW5pdHkpID0gTmFOXHJcbiAqIGNvcyhOYU4pICAgICAgID0gTmFOXHJcbiAqXHJcbiAqL1xyXG5QLmNvc2luZSA9IFAuY29zID0gZnVuY3Rpb24gKCkge1xyXG4gIHZhciBwciwgcm0sXHJcbiAgICB4ID0gdGhpcyxcclxuICAgIEN0b3IgPSB4LmNvbnN0cnVjdG9yO1xyXG5cclxuICBpZiAoIXguZCkgcmV0dXJuIG5ldyBDdG9yKE5hTik7XHJcblxyXG4gIC8vIGNvcygwKSA9IGNvcygtMCkgPSAxXHJcbiAgaWYgKCF4LmRbMF0pIHJldHVybiBuZXcgQ3RvcigxKTtcclxuXHJcbiAgcHIgPSBDdG9yLnByZWNpc2lvbjtcclxuICBybSA9IEN0b3Iucm91bmRpbmc7XHJcbiAgQ3Rvci5wcmVjaXNpb24gPSBwciArIE1hdGgubWF4KHguZSwgeC5zZCgpKSArIExPR19CQVNFO1xyXG4gIEN0b3Iucm91bmRpbmcgPSAxO1xyXG5cclxuICB4ID0gY29zaW5lKEN0b3IsIHRvTGVzc1RoYW5IYWxmUGkoQ3RvciwgeCkpO1xyXG5cclxuICBDdG9yLnByZWNpc2lvbiA9IHByO1xyXG4gIEN0b3Iucm91bmRpbmcgPSBybTtcclxuXHJcbiAgcmV0dXJuIGZpbmFsaXNlKHF1YWRyYW50ID09IDIgfHwgcXVhZHJhbnQgPT0gMyA/IHgubmVnKCkgOiB4LCBwciwgcm0sIHRydWUpO1xyXG59O1xyXG5cclxuXHJcbi8qXHJcbiAqXHJcbiAqIFJldHVybiBhIG5ldyBEZWNpbWFsIHdob3NlIHZhbHVlIGlzIHRoZSBjdWJlIHJvb3Qgb2YgdGhlIHZhbHVlIG9mIHRoaXMgRGVjaW1hbCwgcm91bmRlZCB0b1xyXG4gKiBgcHJlY2lzaW9uYCBzaWduaWZpY2FudCBkaWdpdHMgdXNpbmcgcm91bmRpbmcgbW9kZSBgcm91bmRpbmdgLlxyXG4gKlxyXG4gKiAgY2JydCgwKSAgPSAgMFxyXG4gKiAgY2JydCgtMCkgPSAtMFxyXG4gKiAgY2JydCgxKSAgPSAgMVxyXG4gKiAgY2JydCgtMSkgPSAtMVxyXG4gKiAgY2JydChOKSAgPSAgTlxyXG4gKiAgY2JydCgtSSkgPSAtSVxyXG4gKiAgY2JydChJKSAgPSAgSVxyXG4gKlxyXG4gKiBNYXRoLmNicnQoeCkgPSAoeCA8IDAgPyAtTWF0aC5wb3coLXgsIDEvMykgOiBNYXRoLnBvdyh4LCAxLzMpKVxyXG4gKlxyXG4gKi9cclxuUC5jdWJlUm9vdCA9IFAuY2JydCA9IGZ1bmN0aW9uICgpIHtcclxuICB2YXIgZSwgbSwgbiwgciwgcmVwLCBzLCBzZCwgdCwgdDMsIHQzcGx1c3gsXHJcbiAgICB4ID0gdGhpcyxcclxuICAgIEN0b3IgPSB4LmNvbnN0cnVjdG9yO1xyXG5cclxuICBpZiAoIXguaXNGaW5pdGUoKSB8fCB4LmlzWmVybygpKSByZXR1cm4gbmV3IEN0b3IoeCk7XHJcbiAgZXh0ZXJuYWwgPSBmYWxzZTtcclxuXHJcbiAgLy8gSW5pdGlhbCBlc3RpbWF0ZS5cclxuICBzID0geC5zICogbWF0aHBvdyh4LnMgKiB4LCAxIC8gMyk7XHJcblxyXG4gICAvLyBNYXRoLmNicnQgdW5kZXJmbG93L292ZXJmbG93P1xyXG4gICAvLyBQYXNzIHggdG8gTWF0aC5wb3cgYXMgaW50ZWdlciwgdGhlbiBhZGp1c3QgdGhlIGV4cG9uZW50IG9mIHRoZSByZXN1bHQuXHJcbiAgaWYgKCFzIHx8IE1hdGguYWJzKHMpID09IDEgLyAwKSB7XHJcbiAgICBuID0gZGlnaXRzVG9TdHJpbmcoeC5kKTtcclxuICAgIGUgPSB4LmU7XHJcblxyXG4gICAgLy8gQWRqdXN0IG4gZXhwb25lbnQgc28gaXQgaXMgYSBtdWx0aXBsZSBvZiAzIGF3YXkgZnJvbSB4IGV4cG9uZW50LlxyXG4gICAgaWYgKHMgPSAoZSAtIG4ubGVuZ3RoICsgMSkgJSAzKSBuICs9IChzID09IDEgfHwgcyA9PSAtMiA/ICcwJyA6ICcwMCcpO1xyXG4gICAgcyA9IG1hdGhwb3cobiwgMSAvIDMpO1xyXG5cclxuICAgIC8vIFJhcmVseSwgZSBtYXkgYmUgb25lIGxlc3MgdGhhbiB0aGUgcmVzdWx0IGV4cG9uZW50IHZhbHVlLlxyXG4gICAgZSA9IG1hdGhmbG9vcigoZSArIDEpIC8gMykgLSAoZSAlIDMgPT0gKGUgPCAwID8gLTEgOiAyKSk7XHJcblxyXG4gICAgaWYgKHMgPT0gMSAvIDApIHtcclxuICAgICAgbiA9ICc1ZScgKyBlO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgbiA9IHMudG9FeHBvbmVudGlhbCgpO1xyXG4gICAgICBuID0gbi5zbGljZSgwLCBuLmluZGV4T2YoJ2UnKSArIDEpICsgZTtcclxuICAgIH1cclxuXHJcbiAgICByID0gbmV3IEN0b3Iobik7XHJcbiAgICByLnMgPSB4LnM7XHJcbiAgfSBlbHNlIHtcclxuICAgIHIgPSBuZXcgQ3RvcihzLnRvU3RyaW5nKCkpO1xyXG4gIH1cclxuXHJcbiAgc2QgPSAoZSA9IEN0b3IucHJlY2lzaW9uKSArIDM7XHJcblxyXG4gIC8vIEhhbGxleSdzIG1ldGhvZC5cclxuICAvLyBUT0RPPyBDb21wYXJlIE5ld3RvbidzIG1ldGhvZC5cclxuICBmb3IgKDs7KSB7XHJcbiAgICB0ID0gcjtcclxuICAgIHQzID0gdC50aW1lcyh0KS50aW1lcyh0KTtcclxuICAgIHQzcGx1c3ggPSB0My5wbHVzKHgpO1xyXG4gICAgciA9IGRpdmlkZSh0M3BsdXN4LnBsdXMoeCkudGltZXModCksIHQzcGx1c3gucGx1cyh0MyksIHNkICsgMiwgMSk7XHJcblxyXG4gICAgLy8gVE9ETz8gUmVwbGFjZSB3aXRoIGZvci1sb29wIGFuZCBjaGVja1JvdW5kaW5nRGlnaXRzLlxyXG4gICAgaWYgKGRpZ2l0c1RvU3RyaW5nKHQuZCkuc2xpY2UoMCwgc2QpID09PSAobiA9IGRpZ2l0c1RvU3RyaW5nKHIuZCkpLnNsaWNlKDAsIHNkKSkge1xyXG4gICAgICBuID0gbi5zbGljZShzZCAtIDMsIHNkICsgMSk7XHJcblxyXG4gICAgICAvLyBUaGUgNHRoIHJvdW5kaW5nIGRpZ2l0IG1heSBiZSBpbiBlcnJvciBieSAtMSBzbyBpZiB0aGUgNCByb3VuZGluZyBkaWdpdHMgYXJlIDk5OTkgb3IgNDk5OVxyXG4gICAgICAvLyAsIGkuZS4gYXBwcm9hY2hpbmcgYSByb3VuZGluZyBib3VuZGFyeSwgY29udGludWUgdGhlIGl0ZXJhdGlvbi5cclxuICAgICAgaWYgKG4gPT0gJzk5OTknIHx8ICFyZXAgJiYgbiA9PSAnNDk5OScpIHtcclxuXHJcbiAgICAgICAgLy8gT24gdGhlIGZpcnN0IGl0ZXJhdGlvbiBvbmx5LCBjaGVjayB0byBzZWUgaWYgcm91bmRpbmcgdXAgZ2l2ZXMgdGhlIGV4YWN0IHJlc3VsdCBhcyB0aGVcclxuICAgICAgICAvLyBuaW5lcyBtYXkgaW5maW5pdGVseSByZXBlYXQuXHJcbiAgICAgICAgaWYgKCFyZXApIHtcclxuICAgICAgICAgIGZpbmFsaXNlKHQsIGUgKyAxLCAwKTtcclxuXHJcbiAgICAgICAgICBpZiAodC50aW1lcyh0KS50aW1lcyh0KS5lcSh4KSkge1xyXG4gICAgICAgICAgICByID0gdDtcclxuICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBzZCArPSA0O1xyXG4gICAgICAgIHJlcCA9IDE7XHJcbiAgICAgIH0gZWxzZSB7XHJcblxyXG4gICAgICAgIC8vIElmIHRoZSByb3VuZGluZyBkaWdpdHMgYXJlIG51bGwsIDB7MCw0fSBvciA1MHswLDN9LCBjaGVjayBmb3IgYW4gZXhhY3QgcmVzdWx0LlxyXG4gICAgICAgIC8vIElmIG5vdCwgdGhlbiB0aGVyZSBhcmUgZnVydGhlciBkaWdpdHMgYW5kIG0gd2lsbCBiZSB0cnV0aHkuXHJcbiAgICAgICAgaWYgKCErbiB8fCAhK24uc2xpY2UoMSkgJiYgbi5jaGFyQXQoMCkgPT0gJzUnKSB7XHJcblxyXG4gICAgICAgICAgLy8gVHJ1bmNhdGUgdG8gdGhlIGZpcnN0IHJvdW5kaW5nIGRpZ2l0LlxyXG4gICAgICAgICAgZmluYWxpc2UociwgZSArIDEsIDEpO1xyXG4gICAgICAgICAgbSA9ICFyLnRpbWVzKHIpLnRpbWVzKHIpLmVxKHgpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgYnJlYWs7XHJcbiAgICAgIH1cclxuICAgIH1cclxuICB9XHJcblxyXG4gIGV4dGVybmFsID0gdHJ1ZTtcclxuXHJcbiAgcmV0dXJuIGZpbmFsaXNlKHIsIGUsIEN0b3Iucm91bmRpbmcsIG0pO1xyXG59O1xyXG5cclxuXHJcbi8qXHJcbiAqIFJldHVybiB0aGUgbnVtYmVyIG9mIGRlY2ltYWwgcGxhY2VzIG9mIHRoZSB2YWx1ZSBvZiB0aGlzIERlY2ltYWwuXHJcbiAqXHJcbiAqL1xyXG5QLmRlY2ltYWxQbGFjZXMgPSBQLmRwID0gZnVuY3Rpb24gKCkge1xyXG4gIHZhciB3LFxyXG4gICAgZCA9IHRoaXMuZCxcclxuICAgIG4gPSBOYU47XHJcblxyXG4gIGlmIChkKSB7XHJcbiAgICB3ID0gZC5sZW5ndGggLSAxO1xyXG4gICAgbiA9ICh3IC0gbWF0aGZsb29yKHRoaXMuZSAvIExPR19CQVNFKSkgKiBMT0dfQkFTRTtcclxuXHJcbiAgICAvLyBTdWJ0cmFjdCB0aGUgbnVtYmVyIG9mIHRyYWlsaW5nIHplcm9zIG9mIHRoZSBsYXN0IHdvcmQuXHJcbiAgICB3ID0gZFt3XTtcclxuICAgIGlmICh3KSBmb3IgKDsgdyAlIDEwID09IDA7IHcgLz0gMTApIG4tLTtcclxuICAgIGlmIChuIDwgMCkgbiA9IDA7XHJcbiAgfVxyXG5cclxuICByZXR1cm4gbjtcclxufTtcclxuXHJcblxyXG4vKlxyXG4gKiAgbiAvIDAgPSBJXHJcbiAqICBuIC8gTiA9IE5cclxuICogIG4gLyBJID0gMFxyXG4gKiAgMCAvIG4gPSAwXHJcbiAqICAwIC8gMCA9IE5cclxuICogIDAgLyBOID0gTlxyXG4gKiAgMCAvIEkgPSAwXHJcbiAqICBOIC8gbiA9IE5cclxuICogIE4gLyAwID0gTlxyXG4gKiAgTiAvIE4gPSBOXHJcbiAqICBOIC8gSSA9IE5cclxuICogIEkgLyBuID0gSVxyXG4gKiAgSSAvIDAgPSBJXHJcbiAqICBJIC8gTiA9IE5cclxuICogIEkgLyBJID0gTlxyXG4gKlxyXG4gKiBSZXR1cm4gYSBuZXcgRGVjaW1hbCB3aG9zZSB2YWx1ZSBpcyB0aGUgdmFsdWUgb2YgdGhpcyBEZWNpbWFsIGRpdmlkZWQgYnkgYHlgLCByb3VuZGVkIHRvXHJcbiAqIGBwcmVjaXNpb25gIHNpZ25pZmljYW50IGRpZ2l0cyB1c2luZyByb3VuZGluZyBtb2RlIGByb3VuZGluZ2AuXHJcbiAqXHJcbiAqL1xyXG5QLmRpdmlkZWRCeSA9IFAuZGl2ID0gZnVuY3Rpb24gKHkpIHtcclxuICByZXR1cm4gZGl2aWRlKHRoaXMsIG5ldyB0aGlzLmNvbnN0cnVjdG9yKHkpKTtcclxufTtcclxuXHJcblxyXG4vKlxyXG4gKiBSZXR1cm4gYSBuZXcgRGVjaW1hbCB3aG9zZSB2YWx1ZSBpcyB0aGUgaW50ZWdlciBwYXJ0IG9mIGRpdmlkaW5nIHRoZSB2YWx1ZSBvZiB0aGlzIERlY2ltYWxcclxuICogYnkgdGhlIHZhbHVlIG9mIGB5YCwgcm91bmRlZCB0byBgcHJlY2lzaW9uYCBzaWduaWZpY2FudCBkaWdpdHMgdXNpbmcgcm91bmRpbmcgbW9kZSBgcm91bmRpbmdgLlxyXG4gKlxyXG4gKi9cclxuUC5kaXZpZGVkVG9JbnRlZ2VyQnkgPSBQLmRpdlRvSW50ID0gZnVuY3Rpb24gKHkpIHtcclxuICB2YXIgeCA9IHRoaXMsXHJcbiAgICBDdG9yID0geC5jb25zdHJ1Y3RvcjtcclxuICByZXR1cm4gZmluYWxpc2UoZGl2aWRlKHgsIG5ldyBDdG9yKHkpLCAwLCAxLCAxKSwgQ3Rvci5wcmVjaXNpb24sIEN0b3Iucm91bmRpbmcpO1xyXG59O1xyXG5cclxuXHJcbi8qXHJcbiAqIFJldHVybiB0cnVlIGlmIHRoZSB2YWx1ZSBvZiB0aGlzIERlY2ltYWwgaXMgZXF1YWwgdG8gdGhlIHZhbHVlIG9mIGB5YCwgb3RoZXJ3aXNlIHJldHVybiBmYWxzZS5cclxuICpcclxuICovXHJcblAuZXF1YWxzID0gUC5lcSA9IGZ1bmN0aW9uICh5KSB7XHJcbiAgcmV0dXJuIHRoaXMuY21wKHkpID09PSAwO1xyXG59O1xyXG5cclxuXHJcbi8qXHJcbiAqIFJldHVybiBhIG5ldyBEZWNpbWFsIHdob3NlIHZhbHVlIGlzIHRoZSB2YWx1ZSBvZiB0aGlzIERlY2ltYWwgcm91bmRlZCB0byBhIHdob2xlIG51bWJlciBpbiB0aGVcclxuICogZGlyZWN0aW9uIG9mIG5lZ2F0aXZlIEluZmluaXR5LlxyXG4gKlxyXG4gKi9cclxuUC5mbG9vciA9IGZ1bmN0aW9uICgpIHtcclxuICByZXR1cm4gZmluYWxpc2UobmV3IHRoaXMuY29uc3RydWN0b3IodGhpcyksIHRoaXMuZSArIDEsIDMpO1xyXG59O1xyXG5cclxuXHJcbi8qXHJcbiAqIFJldHVybiB0cnVlIGlmIHRoZSB2YWx1ZSBvZiB0aGlzIERlY2ltYWwgaXMgZ3JlYXRlciB0aGFuIHRoZSB2YWx1ZSBvZiBgeWAsIG90aGVyd2lzZSByZXR1cm5cclxuICogZmFsc2UuXHJcbiAqXHJcbiAqL1xyXG5QLmdyZWF0ZXJUaGFuID0gUC5ndCA9IGZ1bmN0aW9uICh5KSB7XHJcbiAgcmV0dXJuIHRoaXMuY21wKHkpID4gMDtcclxufTtcclxuXHJcblxyXG4vKlxyXG4gKiBSZXR1cm4gdHJ1ZSBpZiB0aGUgdmFsdWUgb2YgdGhpcyBEZWNpbWFsIGlzIGdyZWF0ZXIgdGhhbiBvciBlcXVhbCB0byB0aGUgdmFsdWUgb2YgYHlgLFxyXG4gKiBvdGhlcndpc2UgcmV0dXJuIGZhbHNlLlxyXG4gKlxyXG4gKi9cclxuUC5ncmVhdGVyVGhhbk9yRXF1YWxUbyA9IFAuZ3RlID0gZnVuY3Rpb24gKHkpIHtcclxuICB2YXIgayA9IHRoaXMuY21wKHkpO1xyXG4gIHJldHVybiBrID09IDEgfHwgayA9PT0gMDtcclxufTtcclxuXHJcblxyXG4vKlxyXG4gKiBSZXR1cm4gYSBuZXcgRGVjaW1hbCB3aG9zZSB2YWx1ZSBpcyB0aGUgaHlwZXJib2xpYyBjb3NpbmUgb2YgdGhlIHZhbHVlIGluIHJhZGlhbnMgb2YgdGhpc1xyXG4gKiBEZWNpbWFsLlxyXG4gKlxyXG4gKiBEb21haW46IFstSW5maW5pdHksIEluZmluaXR5XVxyXG4gKiBSYW5nZTogWzEsIEluZmluaXR5XVxyXG4gKlxyXG4gKiBjb3NoKHgpID0gMSArIHheMi8yISArIHheNC80ISArIHheNi82ISArIC4uLlxyXG4gKlxyXG4gKiBjb3NoKDApICAgICAgICAgPSAxXHJcbiAqIGNvc2goLTApICAgICAgICA9IDFcclxuICogY29zaChJbmZpbml0eSkgID0gSW5maW5pdHlcclxuICogY29zaCgtSW5maW5pdHkpID0gSW5maW5pdHlcclxuICogY29zaChOYU4pICAgICAgID0gTmFOXHJcbiAqXHJcbiAqICB4ICAgICAgICB0aW1lIHRha2VuIChtcykgICByZXN1bHRcclxuICogMTAwMCAgICAgIDkgICAgICAgICAgICAgICAgIDkuODUwMzU1NTcwMDg1MjM0OTY5NGUrNDMzXHJcbiAqIDEwMDAwICAgICAyNSAgICAgICAgICAgICAgICA0LjQwMzQwOTExMjgzMTQ2MDc5MzZlKzQzNDJcclxuICogMTAwMDAwICAgIDE3MSAgICAgICAgICAgICAgIDEuNDAzMzMxNjgwMjEzMDYxNTg5N2UrNDM0MjlcclxuICogMTAwMDAwMCAgIDM4MTcgICAgICAgICAgICAgIDEuNTE2NjA3Njk4NDAxMDQzNzcyNWUrNDM0Mjk0XHJcbiAqIDEwMDAwMDAwICBhYmFuZG9uZWQgYWZ0ZXIgMiBtaW51dGUgd2FpdFxyXG4gKlxyXG4gKiBUT0RPPyBDb21wYXJlIHBlcmZvcm1hbmNlIG9mIGNvc2goeCkgPSAwLjUgKiAoZXhwKHgpICsgZXhwKC14KSlcclxuICpcclxuICovXHJcblAuaHlwZXJib2xpY0Nvc2luZSA9IFAuY29zaCA9IGZ1bmN0aW9uICgpIHtcclxuICB2YXIgaywgbiwgcHIsIHJtLCBsZW4sXHJcbiAgICB4ID0gdGhpcyxcclxuICAgIEN0b3IgPSB4LmNvbnN0cnVjdG9yLFxyXG4gICAgb25lID0gbmV3IEN0b3IoMSk7XHJcblxyXG4gIGlmICgheC5pc0Zpbml0ZSgpKSByZXR1cm4gbmV3IEN0b3IoeC5zID8gMSAvIDAgOiBOYU4pO1xyXG4gIGlmICh4LmlzWmVybygpKSByZXR1cm4gb25lO1xyXG5cclxuICBwciA9IEN0b3IucHJlY2lzaW9uO1xyXG4gIHJtID0gQ3Rvci5yb3VuZGluZztcclxuICBDdG9yLnByZWNpc2lvbiA9IHByICsgTWF0aC5tYXgoeC5lLCB4LnNkKCkpICsgNDtcclxuICBDdG9yLnJvdW5kaW5nID0gMTtcclxuICBsZW4gPSB4LmQubGVuZ3RoO1xyXG5cclxuICAvLyBBcmd1bWVudCByZWR1Y3Rpb246IGNvcyg0eCkgPSAxIC0gOGNvc14yKHgpICsgOGNvc140KHgpICsgMVxyXG4gIC8vIGkuZS4gY29zKHgpID0gMSAtIGNvc14yKHgvNCkoOCAtIDhjb3NeMih4LzQpKVxyXG5cclxuICAvLyBFc3RpbWF0ZSB0aGUgb3B0aW11bSBudW1iZXIgb2YgdGltZXMgdG8gdXNlIHRoZSBhcmd1bWVudCByZWR1Y3Rpb24uXHJcbiAgLy8gVE9ETz8gRXN0aW1hdGlvbiByZXVzZWQgZnJvbSBjb3NpbmUoKSBhbmQgbWF5IG5vdCBiZSBvcHRpbWFsIGhlcmUuXHJcbiAgaWYgKGxlbiA8IDMyKSB7XHJcbiAgICBrID0gTWF0aC5jZWlsKGxlbiAvIDMpO1xyXG4gICAgbiA9ICgxIC8gdGlueVBvdyg0LCBrKSkudG9TdHJpbmcoKTtcclxuICB9IGVsc2Uge1xyXG4gICAgayA9IDE2O1xyXG4gICAgbiA9ICcyLjMyODMwNjQzNjUzODY5NjI4OTA2MjVlLTEwJztcclxuICB9XHJcblxyXG4gIHggPSB0YXlsb3JTZXJpZXMoQ3RvciwgMSwgeC50aW1lcyhuKSwgbmV3IEN0b3IoMSksIHRydWUpO1xyXG5cclxuICAvLyBSZXZlcnNlIGFyZ3VtZW50IHJlZHVjdGlvblxyXG4gIHZhciBjb3NoMl94LFxyXG4gICAgaSA9IGssXHJcbiAgICBkOCA9IG5ldyBDdG9yKDgpO1xyXG4gIGZvciAoOyBpLS07KSB7XHJcbiAgICBjb3NoMl94ID0geC50aW1lcyh4KTtcclxuICAgIHggPSBvbmUubWludXMoY29zaDJfeC50aW1lcyhkOC5taW51cyhjb3NoMl94LnRpbWVzKGQ4KSkpKTtcclxuICB9XHJcblxyXG4gIHJldHVybiBmaW5hbGlzZSh4LCBDdG9yLnByZWNpc2lvbiA9IHByLCBDdG9yLnJvdW5kaW5nID0gcm0sIHRydWUpO1xyXG59O1xyXG5cclxuXHJcbi8qXHJcbiAqIFJldHVybiBhIG5ldyBEZWNpbWFsIHdob3NlIHZhbHVlIGlzIHRoZSBoeXBlcmJvbGljIHNpbmUgb2YgdGhlIHZhbHVlIGluIHJhZGlhbnMgb2YgdGhpc1xyXG4gKiBEZWNpbWFsLlxyXG4gKlxyXG4gKiBEb21haW46IFstSW5maW5pdHksIEluZmluaXR5XVxyXG4gKiBSYW5nZTogWy1JbmZpbml0eSwgSW5maW5pdHldXHJcbiAqXHJcbiAqIHNpbmgoeCkgPSB4ICsgeF4zLzMhICsgeF41LzUhICsgeF43LzchICsgLi4uXHJcbiAqXHJcbiAqIHNpbmgoMCkgICAgICAgICA9IDBcclxuICogc2luaCgtMCkgICAgICAgID0gLTBcclxuICogc2luaChJbmZpbml0eSkgID0gSW5maW5pdHlcclxuICogc2luaCgtSW5maW5pdHkpID0gLUluZmluaXR5XHJcbiAqIHNpbmgoTmFOKSAgICAgICA9IE5hTlxyXG4gKlxyXG4gKiB4ICAgICAgICB0aW1lIHRha2VuIChtcylcclxuICogMTAgICAgICAgMiBtc1xyXG4gKiAxMDAgICAgICA1IG1zXHJcbiAqIDEwMDAgICAgIDE0IG1zXHJcbiAqIDEwMDAwICAgIDgyIG1zXHJcbiAqIDEwMDAwMCAgIDg4NiBtcyAgICAgICAgICAgIDEuNDAzMzMxNjgwMjEzMDYxNTg5N2UrNDM0MjlcclxuICogMjAwMDAwICAgMjYxMyBtc1xyXG4gKiAzMDAwMDAgICA1NDA3IG1zXHJcbiAqIDQwMDAwMCAgIDg4MjQgbXNcclxuICogNTAwMDAwICAgMTMwMjYgbXMgICAgICAgICAgOC43MDgwNjQzNjEyNzE4MDg0MTI5ZSsyMTcxNDZcclxuICogMTAwMDAwMCAgNDg1NDMgbXNcclxuICpcclxuICogVE9ETz8gQ29tcGFyZSBwZXJmb3JtYW5jZSBvZiBzaW5oKHgpID0gMC41ICogKGV4cCh4KSAtIGV4cCgteCkpXHJcbiAqXHJcbiAqL1xyXG5QLmh5cGVyYm9saWNTaW5lID0gUC5zaW5oID0gZnVuY3Rpb24gKCkge1xyXG4gIHZhciBrLCBwciwgcm0sIGxlbixcclxuICAgIHggPSB0aGlzLFxyXG4gICAgQ3RvciA9IHguY29uc3RydWN0b3I7XHJcblxyXG4gIGlmICgheC5pc0Zpbml0ZSgpIHx8IHguaXNaZXJvKCkpIHJldHVybiBuZXcgQ3Rvcih4KTtcclxuXHJcbiAgcHIgPSBDdG9yLnByZWNpc2lvbjtcclxuICBybSA9IEN0b3Iucm91bmRpbmc7XHJcbiAgQ3Rvci5wcmVjaXNpb24gPSBwciArIE1hdGgubWF4KHguZSwgeC5zZCgpKSArIDQ7XHJcbiAgQ3Rvci5yb3VuZGluZyA9IDE7XHJcbiAgbGVuID0geC5kLmxlbmd0aDtcclxuXHJcbiAgaWYgKGxlbiA8IDMpIHtcclxuICAgIHggPSB0YXlsb3JTZXJpZXMoQ3RvciwgMiwgeCwgeCwgdHJ1ZSk7XHJcbiAgfSBlbHNlIHtcclxuXHJcbiAgICAvLyBBbHRlcm5hdGl2ZSBhcmd1bWVudCByZWR1Y3Rpb246IHNpbmgoM3gpID0gc2luaCh4KSgzICsgNHNpbmheMih4KSlcclxuICAgIC8vIGkuZS4gc2luaCh4KSA9IHNpbmgoeC8zKSgzICsgNHNpbmheMih4LzMpKVxyXG4gICAgLy8gMyBtdWx0aXBsaWNhdGlvbnMgYW5kIDEgYWRkaXRpb25cclxuXHJcbiAgICAvLyBBcmd1bWVudCByZWR1Y3Rpb246IHNpbmgoNXgpID0gc2luaCh4KSg1ICsgc2luaF4yKHgpKDIwICsgMTZzaW5oXjIoeCkpKVxyXG4gICAgLy8gaS5lLiBzaW5oKHgpID0gc2luaCh4LzUpKDUgKyBzaW5oXjIoeC81KSgyMCArIDE2c2luaF4yKHgvNSkpKVxyXG4gICAgLy8gNCBtdWx0aXBsaWNhdGlvbnMgYW5kIDIgYWRkaXRpb25zXHJcblxyXG4gICAgLy8gRXN0aW1hdGUgdGhlIG9wdGltdW0gbnVtYmVyIG9mIHRpbWVzIHRvIHVzZSB0aGUgYXJndW1lbnQgcmVkdWN0aW9uLlxyXG4gICAgayA9IDEuNCAqIE1hdGguc3FydChsZW4pO1xyXG4gICAgayA9IGsgPiAxNiA/IDE2IDogayB8IDA7XHJcblxyXG4gICAgeCA9IHgudGltZXMoMSAvIHRpbnlQb3coNSwgaykpO1xyXG4gICAgeCA9IHRheWxvclNlcmllcyhDdG9yLCAyLCB4LCB4LCB0cnVlKTtcclxuXHJcbiAgICAvLyBSZXZlcnNlIGFyZ3VtZW50IHJlZHVjdGlvblxyXG4gICAgdmFyIHNpbmgyX3gsXHJcbiAgICAgIGQ1ID0gbmV3IEN0b3IoNSksXHJcbiAgICAgIGQxNiA9IG5ldyBDdG9yKDE2KSxcclxuICAgICAgZDIwID0gbmV3IEN0b3IoMjApO1xyXG4gICAgZm9yICg7IGstLTspIHtcclxuICAgICAgc2luaDJfeCA9IHgudGltZXMoeCk7XHJcbiAgICAgIHggPSB4LnRpbWVzKGQ1LnBsdXMoc2luaDJfeC50aW1lcyhkMTYudGltZXMoc2luaDJfeCkucGx1cyhkMjApKSkpO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgQ3Rvci5wcmVjaXNpb24gPSBwcjtcclxuICBDdG9yLnJvdW5kaW5nID0gcm07XHJcblxyXG4gIHJldHVybiBmaW5hbGlzZSh4LCBwciwgcm0sIHRydWUpO1xyXG59O1xyXG5cclxuXHJcbi8qXHJcbiAqIFJldHVybiBhIG5ldyBEZWNpbWFsIHdob3NlIHZhbHVlIGlzIHRoZSBoeXBlcmJvbGljIHRhbmdlbnQgb2YgdGhlIHZhbHVlIGluIHJhZGlhbnMgb2YgdGhpc1xyXG4gKiBEZWNpbWFsLlxyXG4gKlxyXG4gKiBEb21haW46IFstSW5maW5pdHksIEluZmluaXR5XVxyXG4gKiBSYW5nZTogWy0xLCAxXVxyXG4gKlxyXG4gKiB0YW5oKHgpID0gc2luaCh4KSAvIGNvc2goeClcclxuICpcclxuICogdGFuaCgwKSAgICAgICAgID0gMFxyXG4gKiB0YW5oKC0wKSAgICAgICAgPSAtMFxyXG4gKiB0YW5oKEluZmluaXR5KSAgPSAxXHJcbiAqIHRhbmgoLUluZmluaXR5KSA9IC0xXHJcbiAqIHRhbmgoTmFOKSAgICAgICA9IE5hTlxyXG4gKlxyXG4gKi9cclxuUC5oeXBlcmJvbGljVGFuZ2VudCA9IFAudGFuaCA9IGZ1bmN0aW9uICgpIHtcclxuICB2YXIgcHIsIHJtLFxyXG4gICAgeCA9IHRoaXMsXHJcbiAgICBDdG9yID0geC5jb25zdHJ1Y3RvcjtcclxuXHJcbiAgaWYgKCF4LmlzRmluaXRlKCkpIHJldHVybiBuZXcgQ3Rvcih4LnMpO1xyXG4gIGlmICh4LmlzWmVybygpKSByZXR1cm4gbmV3IEN0b3IoeCk7XHJcblxyXG4gIHByID0gQ3Rvci5wcmVjaXNpb247XHJcbiAgcm0gPSBDdG9yLnJvdW5kaW5nO1xyXG4gIEN0b3IucHJlY2lzaW9uID0gcHIgKyA3O1xyXG4gIEN0b3Iucm91bmRpbmcgPSAxO1xyXG5cclxuICByZXR1cm4gZGl2aWRlKHguc2luaCgpLCB4LmNvc2goKSwgQ3Rvci5wcmVjaXNpb24gPSBwciwgQ3Rvci5yb3VuZGluZyA9IHJtKTtcclxufTtcclxuXHJcblxyXG4vKlxyXG4gKiBSZXR1cm4gYSBuZXcgRGVjaW1hbCB3aG9zZSB2YWx1ZSBpcyB0aGUgYXJjY29zaW5lIChpbnZlcnNlIGNvc2luZSkgaW4gcmFkaWFucyBvZiB0aGUgdmFsdWUgb2ZcclxuICogdGhpcyBEZWNpbWFsLlxyXG4gKlxyXG4gKiBEb21haW46IFstMSwgMV1cclxuICogUmFuZ2U6IFswLCBwaV1cclxuICpcclxuICogYWNvcyh4KSA9IHBpLzIgLSBhc2luKHgpXHJcbiAqXHJcbiAqIGFjb3MoMCkgICAgICAgPSBwaS8yXHJcbiAqIGFjb3MoLTApICAgICAgPSBwaS8yXHJcbiAqIGFjb3MoMSkgICAgICAgPSAwXHJcbiAqIGFjb3MoLTEpICAgICAgPSBwaVxyXG4gKiBhY29zKDEvMikgICAgID0gcGkvM1xyXG4gKiBhY29zKC0xLzIpICAgID0gMipwaS8zXHJcbiAqIGFjb3MofHh8ID4gMSkgPSBOYU5cclxuICogYWNvcyhOYU4pICAgICA9IE5hTlxyXG4gKlxyXG4gKi9cclxuUC5pbnZlcnNlQ29zaW5lID0gUC5hY29zID0gZnVuY3Rpb24gKCkge1xyXG4gIHZhciBoYWxmUGksXHJcbiAgICB4ID0gdGhpcyxcclxuICAgIEN0b3IgPSB4LmNvbnN0cnVjdG9yLFxyXG4gICAgayA9IHguYWJzKCkuY21wKDEpLFxyXG4gICAgcHIgPSBDdG9yLnByZWNpc2lvbixcclxuICAgIHJtID0gQ3Rvci5yb3VuZGluZztcclxuXHJcbiAgaWYgKGsgIT09IC0xKSB7XHJcbiAgICByZXR1cm4gayA9PT0gMFxyXG4gICAgICAvLyB8eHwgaXMgMVxyXG4gICAgICA/IHguaXNOZWcoKSA/IGdldFBpKEN0b3IsIHByLCBybSkgOiBuZXcgQ3RvcigwKVxyXG4gICAgICAvLyB8eHwgPiAxIG9yIHggaXMgTmFOXHJcbiAgICAgIDogbmV3IEN0b3IoTmFOKTtcclxuICB9XHJcblxyXG4gIGlmICh4LmlzWmVybygpKSByZXR1cm4gZ2V0UGkoQ3RvciwgcHIgKyA0LCBybSkudGltZXMoMC41KTtcclxuXHJcbiAgLy8gVE9ETz8gU3BlY2lhbCBjYXNlIGFjb3MoMC41KSA9IHBpLzMgYW5kIGFjb3MoLTAuNSkgPSAyKnBpLzNcclxuXHJcbiAgQ3Rvci5wcmVjaXNpb24gPSBwciArIDY7XHJcbiAgQ3Rvci5yb3VuZGluZyA9IDE7XHJcblxyXG4gIHggPSB4LmFzaW4oKTtcclxuICBoYWxmUGkgPSBnZXRQaShDdG9yLCBwciArIDQsIHJtKS50aW1lcygwLjUpO1xyXG5cclxuICBDdG9yLnByZWNpc2lvbiA9IHByO1xyXG4gIEN0b3Iucm91bmRpbmcgPSBybTtcclxuXHJcbiAgcmV0dXJuIGhhbGZQaS5taW51cyh4KTtcclxufTtcclxuXHJcblxyXG4vKlxyXG4gKiBSZXR1cm4gYSBuZXcgRGVjaW1hbCB3aG9zZSB2YWx1ZSBpcyB0aGUgaW52ZXJzZSBvZiB0aGUgaHlwZXJib2xpYyBjb3NpbmUgaW4gcmFkaWFucyBvZiB0aGVcclxuICogdmFsdWUgb2YgdGhpcyBEZWNpbWFsLlxyXG4gKlxyXG4gKiBEb21haW46IFsxLCBJbmZpbml0eV1cclxuICogUmFuZ2U6IFswLCBJbmZpbml0eV1cclxuICpcclxuICogYWNvc2goeCkgPSBsbih4ICsgc3FydCh4XjIgLSAxKSlcclxuICpcclxuICogYWNvc2goeCA8IDEpICAgICA9IE5hTlxyXG4gKiBhY29zaChOYU4pICAgICAgID0gTmFOXHJcbiAqIGFjb3NoKEluZmluaXR5KSAgPSBJbmZpbml0eVxyXG4gKiBhY29zaCgtSW5maW5pdHkpID0gTmFOXHJcbiAqIGFjb3NoKDApICAgICAgICAgPSBOYU5cclxuICogYWNvc2goLTApICAgICAgICA9IE5hTlxyXG4gKiBhY29zaCgxKSAgICAgICAgID0gMFxyXG4gKiBhY29zaCgtMSkgICAgICAgID0gTmFOXHJcbiAqXHJcbiAqL1xyXG5QLmludmVyc2VIeXBlcmJvbGljQ29zaW5lID0gUC5hY29zaCA9IGZ1bmN0aW9uICgpIHtcclxuICB2YXIgcHIsIHJtLFxyXG4gICAgeCA9IHRoaXMsXHJcbiAgICBDdG9yID0geC5jb25zdHJ1Y3RvcjtcclxuXHJcbiAgaWYgKHgubHRlKDEpKSByZXR1cm4gbmV3IEN0b3IoeC5lcSgxKSA/IDAgOiBOYU4pO1xyXG4gIGlmICgheC5pc0Zpbml0ZSgpKSByZXR1cm4gbmV3IEN0b3IoeCk7XHJcblxyXG4gIHByID0gQ3Rvci5wcmVjaXNpb247XHJcbiAgcm0gPSBDdG9yLnJvdW5kaW5nO1xyXG4gIEN0b3IucHJlY2lzaW9uID0gcHIgKyBNYXRoLm1heChNYXRoLmFicyh4LmUpLCB4LnNkKCkpICsgNDtcclxuICBDdG9yLnJvdW5kaW5nID0gMTtcclxuICBleHRlcm5hbCA9IGZhbHNlO1xyXG5cclxuICB4ID0geC50aW1lcyh4KS5taW51cygxKS5zcXJ0KCkucGx1cyh4KTtcclxuXHJcbiAgZXh0ZXJuYWwgPSB0cnVlO1xyXG4gIEN0b3IucHJlY2lzaW9uID0gcHI7XHJcbiAgQ3Rvci5yb3VuZGluZyA9IHJtO1xyXG5cclxuICByZXR1cm4geC5sbigpO1xyXG59O1xyXG5cclxuXHJcbi8qXHJcbiAqIFJldHVybiBhIG5ldyBEZWNpbWFsIHdob3NlIHZhbHVlIGlzIHRoZSBpbnZlcnNlIG9mIHRoZSBoeXBlcmJvbGljIHNpbmUgaW4gcmFkaWFucyBvZiB0aGUgdmFsdWVcclxuICogb2YgdGhpcyBEZWNpbWFsLlxyXG4gKlxyXG4gKiBEb21haW46IFstSW5maW5pdHksIEluZmluaXR5XVxyXG4gKiBSYW5nZTogWy1JbmZpbml0eSwgSW5maW5pdHldXHJcbiAqXHJcbiAqIGFzaW5oKHgpID0gbG4oeCArIHNxcnQoeF4yICsgMSkpXHJcbiAqXHJcbiAqIGFzaW5oKE5hTikgICAgICAgPSBOYU5cclxuICogYXNpbmgoSW5maW5pdHkpICA9IEluZmluaXR5XHJcbiAqIGFzaW5oKC1JbmZpbml0eSkgPSAtSW5maW5pdHlcclxuICogYXNpbmgoMCkgICAgICAgICA9IDBcclxuICogYXNpbmgoLTApICAgICAgICA9IC0wXHJcbiAqXHJcbiAqL1xyXG5QLmludmVyc2VIeXBlcmJvbGljU2luZSA9IFAuYXNpbmggPSBmdW5jdGlvbiAoKSB7XHJcbiAgdmFyIHByLCBybSxcclxuICAgIHggPSB0aGlzLFxyXG4gICAgQ3RvciA9IHguY29uc3RydWN0b3I7XHJcblxyXG4gIGlmICgheC5pc0Zpbml0ZSgpIHx8IHguaXNaZXJvKCkpIHJldHVybiBuZXcgQ3Rvcih4KTtcclxuXHJcbiAgcHIgPSBDdG9yLnByZWNpc2lvbjtcclxuICBybSA9IEN0b3Iucm91bmRpbmc7XHJcbiAgQ3Rvci5wcmVjaXNpb24gPSBwciArIDIgKiBNYXRoLm1heChNYXRoLmFicyh4LmUpLCB4LnNkKCkpICsgNjtcclxuICBDdG9yLnJvdW5kaW5nID0gMTtcclxuICBleHRlcm5hbCA9IGZhbHNlO1xyXG5cclxuICB4ID0geC50aW1lcyh4KS5wbHVzKDEpLnNxcnQoKS5wbHVzKHgpO1xyXG5cclxuICBleHRlcm5hbCA9IHRydWU7XHJcbiAgQ3Rvci5wcmVjaXNpb24gPSBwcjtcclxuICBDdG9yLnJvdW5kaW5nID0gcm07XHJcblxyXG4gIHJldHVybiB4LmxuKCk7XHJcbn07XHJcblxyXG5cclxuLypcclxuICogUmV0dXJuIGEgbmV3IERlY2ltYWwgd2hvc2UgdmFsdWUgaXMgdGhlIGludmVyc2Ugb2YgdGhlIGh5cGVyYm9saWMgdGFuZ2VudCBpbiByYWRpYW5zIG9mIHRoZVxyXG4gKiB2YWx1ZSBvZiB0aGlzIERlY2ltYWwuXHJcbiAqXHJcbiAqIERvbWFpbjogWy0xLCAxXVxyXG4gKiBSYW5nZTogWy1JbmZpbml0eSwgSW5maW5pdHldXHJcbiAqXHJcbiAqIGF0YW5oKHgpID0gMC41ICogbG4oKDEgKyB4KSAvICgxIC0geCkpXHJcbiAqXHJcbiAqIGF0YW5oKHx4fCA+IDEpICAgPSBOYU5cclxuICogYXRhbmgoTmFOKSAgICAgICA9IE5hTlxyXG4gKiBhdGFuaChJbmZpbml0eSkgID0gTmFOXHJcbiAqIGF0YW5oKC1JbmZpbml0eSkgPSBOYU5cclxuICogYXRhbmgoMCkgICAgICAgICA9IDBcclxuICogYXRhbmgoLTApICAgICAgICA9IC0wXHJcbiAqIGF0YW5oKDEpICAgICAgICAgPSBJbmZpbml0eVxyXG4gKiBhdGFuaCgtMSkgICAgICAgID0gLUluZmluaXR5XHJcbiAqXHJcbiAqL1xyXG5QLmludmVyc2VIeXBlcmJvbGljVGFuZ2VudCA9IFAuYXRhbmggPSBmdW5jdGlvbiAoKSB7XHJcbiAgdmFyIHByLCBybSwgd3ByLCB4c2QsXHJcbiAgICB4ID0gdGhpcyxcclxuICAgIEN0b3IgPSB4LmNvbnN0cnVjdG9yO1xyXG5cclxuICBpZiAoIXguaXNGaW5pdGUoKSkgcmV0dXJuIG5ldyBDdG9yKE5hTik7XHJcbiAgaWYgKHguZSA+PSAwKSByZXR1cm4gbmV3IEN0b3IoeC5hYnMoKS5lcSgxKSA/IHgucyAvIDAgOiB4LmlzWmVybygpID8geCA6IE5hTik7XHJcblxyXG4gIHByID0gQ3Rvci5wcmVjaXNpb247XHJcbiAgcm0gPSBDdG9yLnJvdW5kaW5nO1xyXG4gIHhzZCA9IHguc2QoKTtcclxuXHJcbiAgaWYgKE1hdGgubWF4KHhzZCwgcHIpIDwgMiAqIC14LmUgLSAxKSByZXR1cm4gZmluYWxpc2UobmV3IEN0b3IoeCksIHByLCBybSwgdHJ1ZSk7XHJcblxyXG4gIEN0b3IucHJlY2lzaW9uID0gd3ByID0geHNkIC0geC5lO1xyXG5cclxuICB4ID0gZGl2aWRlKHgucGx1cygxKSwgbmV3IEN0b3IoMSkubWludXMoeCksIHdwciArIHByLCAxKTtcclxuXHJcbiAgQ3Rvci5wcmVjaXNpb24gPSBwciArIDQ7XHJcbiAgQ3Rvci5yb3VuZGluZyA9IDE7XHJcblxyXG4gIHggPSB4LmxuKCk7XHJcblxyXG4gIEN0b3IucHJlY2lzaW9uID0gcHI7XHJcbiAgQ3Rvci5yb3VuZGluZyA9IHJtO1xyXG5cclxuICByZXR1cm4geC50aW1lcygwLjUpO1xyXG59O1xyXG5cclxuXHJcbi8qXHJcbiAqIFJldHVybiBhIG5ldyBEZWNpbWFsIHdob3NlIHZhbHVlIGlzIHRoZSBhcmNzaW5lIChpbnZlcnNlIHNpbmUpIGluIHJhZGlhbnMgb2YgdGhlIHZhbHVlIG9mIHRoaXNcclxuICogRGVjaW1hbC5cclxuICpcclxuICogRG9tYWluOiBbLUluZmluaXR5LCBJbmZpbml0eV1cclxuICogUmFuZ2U6IFstcGkvMiwgcGkvMl1cclxuICpcclxuICogYXNpbih4KSA9IDIqYXRhbih4LygxICsgc3FydCgxIC0geF4yKSkpXHJcbiAqXHJcbiAqIGFzaW4oMCkgICAgICAgPSAwXHJcbiAqIGFzaW4oLTApICAgICAgPSAtMFxyXG4gKiBhc2luKDEvMikgICAgID0gcGkvNlxyXG4gKiBhc2luKC0xLzIpICAgID0gLXBpLzZcclxuICogYXNpbigxKSAgICAgICA9IHBpLzJcclxuICogYXNpbigtMSkgICAgICA9IC1waS8yXHJcbiAqIGFzaW4ofHh8ID4gMSkgPSBOYU5cclxuICogYXNpbihOYU4pICAgICA9IE5hTlxyXG4gKlxyXG4gKiBUT0RPPyBDb21wYXJlIHBlcmZvcm1hbmNlIG9mIFRheWxvciBzZXJpZXMuXHJcbiAqXHJcbiAqL1xyXG5QLmludmVyc2VTaW5lID0gUC5hc2luID0gZnVuY3Rpb24gKCkge1xyXG4gIHZhciBoYWxmUGksIGssXHJcbiAgICBwciwgcm0sXHJcbiAgICB4ID0gdGhpcyxcclxuICAgIEN0b3IgPSB4LmNvbnN0cnVjdG9yO1xyXG5cclxuICBpZiAoeC5pc1plcm8oKSkgcmV0dXJuIG5ldyBDdG9yKHgpO1xyXG5cclxuICBrID0geC5hYnMoKS5jbXAoMSk7XHJcbiAgcHIgPSBDdG9yLnByZWNpc2lvbjtcclxuICBybSA9IEN0b3Iucm91bmRpbmc7XHJcblxyXG4gIGlmIChrICE9PSAtMSkge1xyXG5cclxuICAgIC8vIHx4fCBpcyAxXHJcbiAgICBpZiAoayA9PT0gMCkge1xyXG4gICAgICBoYWxmUGkgPSBnZXRQaShDdG9yLCBwciArIDQsIHJtKS50aW1lcygwLjUpO1xyXG4gICAgICBoYWxmUGkucyA9IHgucztcclxuICAgICAgcmV0dXJuIGhhbGZQaTtcclxuICAgIH1cclxuXHJcbiAgICAvLyB8eHwgPiAxIG9yIHggaXMgTmFOXHJcbiAgICByZXR1cm4gbmV3IEN0b3IoTmFOKTtcclxuICB9XHJcblxyXG4gIC8vIFRPRE8/IFNwZWNpYWwgY2FzZSBhc2luKDEvMikgPSBwaS82IGFuZCBhc2luKC0xLzIpID0gLXBpLzZcclxuXHJcbiAgQ3Rvci5wcmVjaXNpb24gPSBwciArIDY7XHJcbiAgQ3Rvci5yb3VuZGluZyA9IDE7XHJcblxyXG4gIHggPSB4LmRpdihuZXcgQ3RvcigxKS5taW51cyh4LnRpbWVzKHgpKS5zcXJ0KCkucGx1cygxKSkuYXRhbigpO1xyXG5cclxuICBDdG9yLnByZWNpc2lvbiA9IHByO1xyXG4gIEN0b3Iucm91bmRpbmcgPSBybTtcclxuXHJcbiAgcmV0dXJuIHgudGltZXMoMik7XHJcbn07XHJcblxyXG5cclxuLypcclxuICogUmV0dXJuIGEgbmV3IERlY2ltYWwgd2hvc2UgdmFsdWUgaXMgdGhlIGFyY3RhbmdlbnQgKGludmVyc2UgdGFuZ2VudCkgaW4gcmFkaWFucyBvZiB0aGUgdmFsdWVcclxuICogb2YgdGhpcyBEZWNpbWFsLlxyXG4gKlxyXG4gKiBEb21haW46IFstSW5maW5pdHksIEluZmluaXR5XVxyXG4gKiBSYW5nZTogWy1waS8yLCBwaS8yXVxyXG4gKlxyXG4gKiBhdGFuKHgpID0geCAtIHheMy8zICsgeF41LzUgLSB4XjcvNyArIC4uLlxyXG4gKlxyXG4gKiBhdGFuKDApICAgICAgICAgPSAwXHJcbiAqIGF0YW4oLTApICAgICAgICA9IC0wXHJcbiAqIGF0YW4oMSkgICAgICAgICA9IHBpLzRcclxuICogYXRhbigtMSkgICAgICAgID0gLXBpLzRcclxuICogYXRhbihJbmZpbml0eSkgID0gcGkvMlxyXG4gKiBhdGFuKC1JbmZpbml0eSkgPSAtcGkvMlxyXG4gKiBhdGFuKE5hTikgICAgICAgPSBOYU5cclxuICpcclxuICovXHJcblAuaW52ZXJzZVRhbmdlbnQgPSBQLmF0YW4gPSBmdW5jdGlvbiAoKSB7XHJcbiAgdmFyIGksIGosIGssIG4sIHB4LCB0LCByLCB3cHIsIHgyLFxyXG4gICAgeCA9IHRoaXMsXHJcbiAgICBDdG9yID0geC5jb25zdHJ1Y3RvcixcclxuICAgIHByID0gQ3Rvci5wcmVjaXNpb24sXHJcbiAgICBybSA9IEN0b3Iucm91bmRpbmc7XHJcblxyXG4gIGlmICgheC5pc0Zpbml0ZSgpKSB7XHJcbiAgICBpZiAoIXgucykgcmV0dXJuIG5ldyBDdG9yKE5hTik7XHJcbiAgICBpZiAocHIgKyA0IDw9IFBJX1BSRUNJU0lPTikge1xyXG4gICAgICByID0gZ2V0UGkoQ3RvciwgcHIgKyA0LCBybSkudGltZXMoMC41KTtcclxuICAgICAgci5zID0geC5zO1xyXG4gICAgICByZXR1cm4gcjtcclxuICAgIH1cclxuICB9IGVsc2UgaWYgKHguaXNaZXJvKCkpIHtcclxuICAgIHJldHVybiBuZXcgQ3Rvcih4KTtcclxuICB9IGVsc2UgaWYgKHguYWJzKCkuZXEoMSkgJiYgcHIgKyA0IDw9IFBJX1BSRUNJU0lPTikge1xyXG4gICAgciA9IGdldFBpKEN0b3IsIHByICsgNCwgcm0pLnRpbWVzKDAuMjUpO1xyXG4gICAgci5zID0geC5zO1xyXG4gICAgcmV0dXJuIHI7XHJcbiAgfVxyXG5cclxuICBDdG9yLnByZWNpc2lvbiA9IHdwciA9IHByICsgMTA7XHJcbiAgQ3Rvci5yb3VuZGluZyA9IDE7XHJcblxyXG4gIC8vIFRPRE8/IGlmICh4ID49IDEgJiYgcHIgPD0gUElfUFJFQ0lTSU9OKSBhdGFuKHgpID0gaGFsZlBpICogeC5zIC0gYXRhbigxIC8geCk7XHJcblxyXG4gIC8vIEFyZ3VtZW50IHJlZHVjdGlvblxyXG4gIC8vIEVuc3VyZSB8eHwgPCAwLjQyXHJcbiAgLy8gYXRhbih4KSA9IDIgKiBhdGFuKHggLyAoMSArIHNxcnQoMSArIHheMikpKVxyXG5cclxuICBrID0gTWF0aC5taW4oMjgsIHdwciAvIExPR19CQVNFICsgMiB8IDApO1xyXG5cclxuICBmb3IgKGkgPSBrOyBpOyAtLWkpIHggPSB4LmRpdih4LnRpbWVzKHgpLnBsdXMoMSkuc3FydCgpLnBsdXMoMSkpO1xyXG5cclxuICBleHRlcm5hbCA9IGZhbHNlO1xyXG5cclxuICBqID0gTWF0aC5jZWlsKHdwciAvIExPR19CQVNFKTtcclxuICBuID0gMTtcclxuICB4MiA9IHgudGltZXMoeCk7XHJcbiAgciA9IG5ldyBDdG9yKHgpO1xyXG4gIHB4ID0geDtcclxuXHJcbiAgLy8gYXRhbih4KSA9IHggLSB4XjMvMyArIHheNS81IC0geF43LzcgKyAuLi5cclxuICBmb3IgKDsgaSAhPT0gLTE7KSB7XHJcbiAgICBweCA9IHB4LnRpbWVzKHgyKTtcclxuICAgIHQgPSByLm1pbnVzKHB4LmRpdihuICs9IDIpKTtcclxuXHJcbiAgICBweCA9IHB4LnRpbWVzKHgyKTtcclxuICAgIHIgPSB0LnBsdXMocHguZGl2KG4gKz0gMikpO1xyXG5cclxuICAgIGlmIChyLmRbal0gIT09IHZvaWQgMCkgZm9yIChpID0gajsgci5kW2ldID09PSB0LmRbaV0gJiYgaS0tOyk7XHJcbiAgfVxyXG5cclxuICBpZiAoaykgciA9IHIudGltZXMoMiA8PCAoayAtIDEpKTtcclxuXHJcbiAgZXh0ZXJuYWwgPSB0cnVlO1xyXG5cclxuICByZXR1cm4gZmluYWxpc2UociwgQ3Rvci5wcmVjaXNpb24gPSBwciwgQ3Rvci5yb3VuZGluZyA9IHJtLCB0cnVlKTtcclxufTtcclxuXHJcblxyXG4vKlxyXG4gKiBSZXR1cm4gdHJ1ZSBpZiB0aGUgdmFsdWUgb2YgdGhpcyBEZWNpbWFsIGlzIGEgZmluaXRlIG51bWJlciwgb3RoZXJ3aXNlIHJldHVybiBmYWxzZS5cclxuICpcclxuICovXHJcblAuaXNGaW5pdGUgPSBmdW5jdGlvbiAoKSB7XHJcbiAgcmV0dXJuICEhdGhpcy5kO1xyXG59O1xyXG5cclxuXHJcbi8qXHJcbiAqIFJldHVybiB0cnVlIGlmIHRoZSB2YWx1ZSBvZiB0aGlzIERlY2ltYWwgaXMgYW4gaW50ZWdlciwgb3RoZXJ3aXNlIHJldHVybiBmYWxzZS5cclxuICpcclxuICovXHJcblAuaXNJbnRlZ2VyID0gUC5pc0ludCA9IGZ1bmN0aW9uICgpIHtcclxuICByZXR1cm4gISF0aGlzLmQgJiYgbWF0aGZsb29yKHRoaXMuZSAvIExPR19CQVNFKSA+IHRoaXMuZC5sZW5ndGggLSAyO1xyXG59O1xyXG5cclxuXHJcbi8qXHJcbiAqIFJldHVybiB0cnVlIGlmIHRoZSB2YWx1ZSBvZiB0aGlzIERlY2ltYWwgaXMgTmFOLCBvdGhlcndpc2UgcmV0dXJuIGZhbHNlLlxyXG4gKlxyXG4gKi9cclxuUC5pc05hTiA9IGZ1bmN0aW9uICgpIHtcclxuICByZXR1cm4gIXRoaXMucztcclxufTtcclxuXHJcblxyXG4vKlxyXG4gKiBSZXR1cm4gdHJ1ZSBpZiB0aGUgdmFsdWUgb2YgdGhpcyBEZWNpbWFsIGlzIG5lZ2F0aXZlLCBvdGhlcndpc2UgcmV0dXJuIGZhbHNlLlxyXG4gKlxyXG4gKi9cclxuUC5pc05lZ2F0aXZlID0gUC5pc05lZyA9IGZ1bmN0aW9uICgpIHtcclxuICByZXR1cm4gdGhpcy5zIDwgMDtcclxufTtcclxuXHJcblxyXG4vKlxyXG4gKiBSZXR1cm4gdHJ1ZSBpZiB0aGUgdmFsdWUgb2YgdGhpcyBEZWNpbWFsIGlzIHBvc2l0aXZlLCBvdGhlcndpc2UgcmV0dXJuIGZhbHNlLlxyXG4gKlxyXG4gKi9cclxuUC5pc1Bvc2l0aXZlID0gUC5pc1BvcyA9IGZ1bmN0aW9uICgpIHtcclxuICByZXR1cm4gdGhpcy5zID4gMDtcclxufTtcclxuXHJcblxyXG4vKlxyXG4gKiBSZXR1cm4gdHJ1ZSBpZiB0aGUgdmFsdWUgb2YgdGhpcyBEZWNpbWFsIGlzIDAgb3IgLTAsIG90aGVyd2lzZSByZXR1cm4gZmFsc2UuXHJcbiAqXHJcbiAqL1xyXG5QLmlzWmVybyA9IGZ1bmN0aW9uICgpIHtcclxuICByZXR1cm4gISF0aGlzLmQgJiYgdGhpcy5kWzBdID09PSAwO1xyXG59O1xyXG5cclxuXHJcbi8qXHJcbiAqIFJldHVybiB0cnVlIGlmIHRoZSB2YWx1ZSBvZiB0aGlzIERlY2ltYWwgaXMgbGVzcyB0aGFuIGB5YCwgb3RoZXJ3aXNlIHJldHVybiBmYWxzZS5cclxuICpcclxuICovXHJcblAubGVzc1RoYW4gPSBQLmx0ID0gZnVuY3Rpb24gKHkpIHtcclxuICByZXR1cm4gdGhpcy5jbXAoeSkgPCAwO1xyXG59O1xyXG5cclxuXHJcbi8qXHJcbiAqIFJldHVybiB0cnVlIGlmIHRoZSB2YWx1ZSBvZiB0aGlzIERlY2ltYWwgaXMgbGVzcyB0aGFuIG9yIGVxdWFsIHRvIGB5YCwgb3RoZXJ3aXNlIHJldHVybiBmYWxzZS5cclxuICpcclxuICovXHJcblAubGVzc1RoYW5PckVxdWFsVG8gPSBQLmx0ZSA9IGZ1bmN0aW9uICh5KSB7XHJcbiAgcmV0dXJuIHRoaXMuY21wKHkpIDwgMTtcclxufTtcclxuXHJcblxyXG4vKlxyXG4gKiBSZXR1cm4gdGhlIGxvZ2FyaXRobSBvZiB0aGUgdmFsdWUgb2YgdGhpcyBEZWNpbWFsIHRvIHRoZSBzcGVjaWZpZWQgYmFzZSwgcm91bmRlZCB0byBgcHJlY2lzaW9uYFxyXG4gKiBzaWduaWZpY2FudCBkaWdpdHMgdXNpbmcgcm91bmRpbmcgbW9kZSBgcm91bmRpbmdgLlxyXG4gKlxyXG4gKiBJZiBubyBiYXNlIGlzIHNwZWNpZmllZCwgcmV0dXJuIGxvZ1sxMF0oYXJnKS5cclxuICpcclxuICogbG9nW2Jhc2VdKGFyZykgPSBsbihhcmcpIC8gbG4oYmFzZSlcclxuICpcclxuICogVGhlIHJlc3VsdCB3aWxsIGFsd2F5cyBiZSBjb3JyZWN0bHkgcm91bmRlZCBpZiB0aGUgYmFzZSBvZiB0aGUgbG9nIGlzIDEwLCBhbmQgJ2FsbW9zdCBhbHdheXMnXHJcbiAqIG90aGVyd2lzZTpcclxuICpcclxuICogRGVwZW5kaW5nIG9uIHRoZSByb3VuZGluZyBtb2RlLCB0aGUgcmVzdWx0IG1heSBiZSBpbmNvcnJlY3RseSByb3VuZGVkIGlmIHRoZSBmaXJzdCBmaWZ0ZWVuXHJcbiAqIHJvdW5kaW5nIGRpZ2l0cyBhcmUgWzQ5XTk5OTk5OTk5OTk5OTk5IG9yIFs1MF0wMDAwMDAwMDAwMDAwMC4gSW4gdGhhdCBjYXNlLCB0aGUgbWF4aW11bSBlcnJvclxyXG4gKiBiZXR3ZWVuIHRoZSByZXN1bHQgYW5kIHRoZSBjb3JyZWN0bHkgcm91bmRlZCByZXN1bHQgd2lsbCBiZSBvbmUgdWxwICh1bml0IGluIHRoZSBsYXN0IHBsYWNlKS5cclxuICpcclxuICogbG9nWy1iXShhKSAgICAgICA9IE5hTlxyXG4gKiBsb2dbMF0oYSkgICAgICAgID0gTmFOXHJcbiAqIGxvZ1sxXShhKSAgICAgICAgPSBOYU5cclxuICogbG9nW05hTl0oYSkgICAgICA9IE5hTlxyXG4gKiBsb2dbSW5maW5pdHldKGEpID0gTmFOXHJcbiAqIGxvZ1tiXSgwKSAgICAgICAgPSAtSW5maW5pdHlcclxuICogbG9nW2JdKC0wKSAgICAgICA9IC1JbmZpbml0eVxyXG4gKiBsb2dbYl0oLWEpICAgICAgID0gTmFOXHJcbiAqIGxvZ1tiXSgxKSAgICAgICAgPSAwXHJcbiAqIGxvZ1tiXShJbmZpbml0eSkgPSBJbmZpbml0eVxyXG4gKiBsb2dbYl0oTmFOKSAgICAgID0gTmFOXHJcbiAqXHJcbiAqIFtiYXNlXSB7bnVtYmVyfHN0cmluZ3xEZWNpbWFsfSBUaGUgYmFzZSBvZiB0aGUgbG9nYXJpdGhtLlxyXG4gKlxyXG4gKi9cclxuUC5sb2dhcml0aG0gPSBQLmxvZyA9IGZ1bmN0aW9uIChiYXNlKSB7XHJcbiAgdmFyIGlzQmFzZTEwLCBkLCBkZW5vbWluYXRvciwgaywgaW5mLCBudW0sIHNkLCByLFxyXG4gICAgYXJnID0gdGhpcyxcclxuICAgIEN0b3IgPSBhcmcuY29uc3RydWN0b3IsXHJcbiAgICBwciA9IEN0b3IucHJlY2lzaW9uLFxyXG4gICAgcm0gPSBDdG9yLnJvdW5kaW5nLFxyXG4gICAgZ3VhcmQgPSA1O1xyXG5cclxuICAvLyBEZWZhdWx0IGJhc2UgaXMgMTAuXHJcbiAgaWYgKGJhc2UgPT0gbnVsbCkge1xyXG4gICAgYmFzZSA9IG5ldyBDdG9yKDEwKTtcclxuICAgIGlzQmFzZTEwID0gdHJ1ZTtcclxuICB9IGVsc2Uge1xyXG4gICAgYmFzZSA9IG5ldyBDdG9yKGJhc2UpO1xyXG4gICAgZCA9IGJhc2UuZDtcclxuXHJcbiAgICAvLyBSZXR1cm4gTmFOIGlmIGJhc2UgaXMgbmVnYXRpdmUsIG9yIG5vbi1maW5pdGUsIG9yIGlzIDAgb3IgMS5cclxuICAgIGlmIChiYXNlLnMgPCAwIHx8ICFkIHx8ICFkWzBdIHx8IGJhc2UuZXEoMSkpIHJldHVybiBuZXcgQ3RvcihOYU4pO1xyXG5cclxuICAgIGlzQmFzZTEwID0gYmFzZS5lcSgxMCk7XHJcbiAgfVxyXG5cclxuICBkID0gYXJnLmQ7XHJcblxyXG4gIC8vIElzIGFyZyBuZWdhdGl2ZSwgbm9uLWZpbml0ZSwgMCBvciAxP1xyXG4gIGlmIChhcmcucyA8IDAgfHwgIWQgfHwgIWRbMF0gfHwgYXJnLmVxKDEpKSB7XHJcbiAgICByZXR1cm4gbmV3IEN0b3IoZCAmJiAhZFswXSA/IC0xIC8gMCA6IGFyZy5zICE9IDEgPyBOYU4gOiBkID8gMCA6IDEgLyAwKTtcclxuICB9XHJcblxyXG4gIC8vIFRoZSByZXN1bHQgd2lsbCBoYXZlIGEgbm9uLXRlcm1pbmF0aW5nIGRlY2ltYWwgZXhwYW5zaW9uIGlmIGJhc2UgaXMgMTAgYW5kIGFyZyBpcyBub3QgYW5cclxuICAvLyBpbnRlZ2VyIHBvd2VyIG9mIDEwLlxyXG4gIGlmIChpc0Jhc2UxMCkge1xyXG4gICAgaWYgKGQubGVuZ3RoID4gMSkge1xyXG4gICAgICBpbmYgPSB0cnVlO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgZm9yIChrID0gZFswXTsgayAlIDEwID09PSAwOykgayAvPSAxMDtcclxuICAgICAgaW5mID0gayAhPT0gMTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIGV4dGVybmFsID0gZmFsc2U7XHJcbiAgc2QgPSBwciArIGd1YXJkO1xyXG4gIG51bSA9IG5hdHVyYWxMb2dhcml0aG0oYXJnLCBzZCk7XHJcbiAgZGVub21pbmF0b3IgPSBpc0Jhc2UxMCA/IGdldExuMTAoQ3Rvciwgc2QgKyAxMCkgOiBuYXR1cmFsTG9nYXJpdGhtKGJhc2UsIHNkKTtcclxuXHJcbiAgLy8gVGhlIHJlc3VsdCB3aWxsIGhhdmUgNSByb3VuZGluZyBkaWdpdHMuXHJcbiAgciA9IGRpdmlkZShudW0sIGRlbm9taW5hdG9yLCBzZCwgMSk7XHJcblxyXG4gIC8vIElmIGF0IGEgcm91bmRpbmcgYm91bmRhcnksIGkuZS4gdGhlIHJlc3VsdCdzIHJvdW5kaW5nIGRpZ2l0cyBhcmUgWzQ5XTk5OTkgb3IgWzUwXTAwMDAsXHJcbiAgLy8gY2FsY3VsYXRlIDEwIGZ1cnRoZXIgZGlnaXRzLlxyXG4gIC8vXHJcbiAgLy8gSWYgdGhlIHJlc3VsdCBpcyBrbm93biB0byBoYXZlIGFuIGluZmluaXRlIGRlY2ltYWwgZXhwYW5zaW9uLCByZXBlYXQgdGhpcyB1bnRpbCBpdCBpcyBjbGVhclxyXG4gIC8vIHRoYXQgdGhlIHJlc3VsdCBpcyBhYm92ZSBvciBiZWxvdyB0aGUgYm91bmRhcnkuIE90aGVyd2lzZSwgaWYgYWZ0ZXIgY2FsY3VsYXRpbmcgdGhlIDEwXHJcbiAgLy8gZnVydGhlciBkaWdpdHMsIHRoZSBsYXN0IDE0IGFyZSBuaW5lcywgcm91bmQgdXAgYW5kIGFzc3VtZSB0aGUgcmVzdWx0IGlzIGV4YWN0LlxyXG4gIC8vIEFsc28gYXNzdW1lIHRoZSByZXN1bHQgaXMgZXhhY3QgaWYgdGhlIGxhc3QgMTQgYXJlIHplcm8uXHJcbiAgLy9cclxuICAvLyBFeGFtcGxlIG9mIGEgcmVzdWx0IHRoYXQgd2lsbCBiZSBpbmNvcnJlY3RseSByb3VuZGVkOlxyXG4gIC8vIGxvZ1sxMDQ4NTc2XSg0NTAzNTk5NjI3MzcwNTAyKSA9IDIuNjAwMDAwMDAwMDAwMDAwMDk2MTAyNzk1MTE0NDQ3NDYuLi5cclxuICAvLyBUaGUgYWJvdmUgcmVzdWx0IGNvcnJlY3RseSByb3VuZGVkIHVzaW5nIFJPVU5EX0NFSUwgdG8gMSBkZWNpbWFsIHBsYWNlIHNob3VsZCBiZSAyLjcsIGJ1dCBpdFxyXG4gIC8vIHdpbGwgYmUgZ2l2ZW4gYXMgMi42IGFzIHRoZXJlIGFyZSAxNSB6ZXJvcyBpbW1lZGlhdGVseSBhZnRlciB0aGUgcmVxdWVzdGVkIGRlY2ltYWwgcGxhY2UsIHNvXHJcbiAgLy8gdGhlIGV4YWN0IHJlc3VsdCB3b3VsZCBiZSBhc3N1bWVkIHRvIGJlIDIuNiwgd2hpY2ggcm91bmRlZCB1c2luZyBST1VORF9DRUlMIHRvIDEgZGVjaW1hbFxyXG4gIC8vIHBsYWNlIGlzIHN0aWxsIDIuNi5cclxuICBpZiAoY2hlY2tSb3VuZGluZ0RpZ2l0cyhyLmQsIGsgPSBwciwgcm0pKSB7XHJcblxyXG4gICAgZG8ge1xyXG4gICAgICBzZCArPSAxMDtcclxuICAgICAgbnVtID0gbmF0dXJhbExvZ2FyaXRobShhcmcsIHNkKTtcclxuICAgICAgZGVub21pbmF0b3IgPSBpc0Jhc2UxMCA/IGdldExuMTAoQ3Rvciwgc2QgKyAxMCkgOiBuYXR1cmFsTG9nYXJpdGhtKGJhc2UsIHNkKTtcclxuICAgICAgciA9IGRpdmlkZShudW0sIGRlbm9taW5hdG9yLCBzZCwgMSk7XHJcblxyXG4gICAgICBpZiAoIWluZikge1xyXG5cclxuICAgICAgICAvLyBDaGVjayBmb3IgMTQgbmluZXMgZnJvbSB0aGUgMm5kIHJvdW5kaW5nIGRpZ2l0LCBhcyB0aGUgZmlyc3QgbWF5IGJlIDQuXHJcbiAgICAgICAgaWYgKCtkaWdpdHNUb1N0cmluZyhyLmQpLnNsaWNlKGsgKyAxLCBrICsgMTUpICsgMSA9PSAxZTE0KSB7XHJcbiAgICAgICAgICByID0gZmluYWxpc2UociwgcHIgKyAxLCAwKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGJyZWFrO1xyXG4gICAgICB9XHJcbiAgICB9IHdoaWxlIChjaGVja1JvdW5kaW5nRGlnaXRzKHIuZCwgayArPSAxMCwgcm0pKTtcclxuICB9XHJcblxyXG4gIGV4dGVybmFsID0gdHJ1ZTtcclxuXHJcbiAgcmV0dXJuIGZpbmFsaXNlKHIsIHByLCBybSk7XHJcbn07XHJcblxyXG5cclxuLypcclxuICogUmV0dXJuIGEgbmV3IERlY2ltYWwgd2hvc2UgdmFsdWUgaXMgdGhlIG1heGltdW0gb2YgdGhlIGFyZ3VtZW50cyBhbmQgdGhlIHZhbHVlIG9mIHRoaXMgRGVjaW1hbC5cclxuICpcclxuICogYXJndW1lbnRzIHtudW1iZXJ8c3RyaW5nfERlY2ltYWx9XHJcbiAqXHJcblAubWF4ID0gZnVuY3Rpb24gKCkge1xyXG4gIEFycmF5LnByb3RvdHlwZS5wdXNoLmNhbGwoYXJndW1lbnRzLCB0aGlzKTtcclxuICByZXR1cm4gbWF4T3JNaW4odGhpcy5jb25zdHJ1Y3RvciwgYXJndW1lbnRzLCAnbHQnKTtcclxufTtcclxuICovXHJcblxyXG5cclxuLypcclxuICogUmV0dXJuIGEgbmV3IERlY2ltYWwgd2hvc2UgdmFsdWUgaXMgdGhlIG1pbmltdW0gb2YgdGhlIGFyZ3VtZW50cyBhbmQgdGhlIHZhbHVlIG9mIHRoaXMgRGVjaW1hbC5cclxuICpcclxuICogYXJndW1lbnRzIHtudW1iZXJ8c3RyaW5nfERlY2ltYWx9XHJcbiAqXHJcblAubWluID0gZnVuY3Rpb24gKCkge1xyXG4gIEFycmF5LnByb3RvdHlwZS5wdXNoLmNhbGwoYXJndW1lbnRzLCB0aGlzKTtcclxuICByZXR1cm4gbWF4T3JNaW4odGhpcy5jb25zdHJ1Y3RvciwgYXJndW1lbnRzLCAnZ3QnKTtcclxufTtcclxuICovXHJcblxyXG5cclxuLypcclxuICogIG4gLSAwID0gblxyXG4gKiAgbiAtIE4gPSBOXHJcbiAqICBuIC0gSSA9IC1JXHJcbiAqICAwIC0gbiA9IC1uXHJcbiAqICAwIC0gMCA9IDBcclxuICogIDAgLSBOID0gTlxyXG4gKiAgMCAtIEkgPSAtSVxyXG4gKiAgTiAtIG4gPSBOXHJcbiAqICBOIC0gMCA9IE5cclxuICogIE4gLSBOID0gTlxyXG4gKiAgTiAtIEkgPSBOXHJcbiAqICBJIC0gbiA9IElcclxuICogIEkgLSAwID0gSVxyXG4gKiAgSSAtIE4gPSBOXHJcbiAqICBJIC0gSSA9IE5cclxuICpcclxuICogUmV0dXJuIGEgbmV3IERlY2ltYWwgd2hvc2UgdmFsdWUgaXMgdGhlIHZhbHVlIG9mIHRoaXMgRGVjaW1hbCBtaW51cyBgeWAsIHJvdW5kZWQgdG8gYHByZWNpc2lvbmBcclxuICogc2lnbmlmaWNhbnQgZGlnaXRzIHVzaW5nIHJvdW5kaW5nIG1vZGUgYHJvdW5kaW5nYC5cclxuICpcclxuICovXHJcblAubWludXMgPSBQLnN1YiA9IGZ1bmN0aW9uICh5KSB7XHJcbiAgdmFyIGQsIGUsIGksIGosIGssIGxlbiwgcHIsIHJtLCB4ZCwgeGUsIHhMVHksIHlkLFxyXG4gICAgeCA9IHRoaXMsXHJcbiAgICBDdG9yID0geC5jb25zdHJ1Y3RvcjtcclxuXHJcbiAgeSA9IG5ldyBDdG9yKHkpO1xyXG5cclxuICAvLyBJZiBlaXRoZXIgaXMgbm90IGZpbml0ZS4uLlxyXG4gIGlmICgheC5kIHx8ICF5LmQpIHtcclxuXHJcbiAgICAvLyBSZXR1cm4gTmFOIGlmIGVpdGhlciBpcyBOYU4uXHJcbiAgICBpZiAoIXgucyB8fCAheS5zKSB5ID0gbmV3IEN0b3IoTmFOKTtcclxuXHJcbiAgICAvLyBSZXR1cm4geSBuZWdhdGVkIGlmIHggaXMgZmluaXRlIGFuZCB5IGlzIFx1MDBCMUluZmluaXR5LlxyXG4gICAgZWxzZSBpZiAoeC5kKSB5LnMgPSAteS5zO1xyXG5cclxuICAgIC8vIFJldHVybiB4IGlmIHkgaXMgZmluaXRlIGFuZCB4IGlzIFx1MDBCMUluZmluaXR5LlxyXG4gICAgLy8gUmV0dXJuIHggaWYgYm90aCBhcmUgXHUwMEIxSW5maW5pdHkgd2l0aCBkaWZmZXJlbnQgc2lnbnMuXHJcbiAgICAvLyBSZXR1cm4gTmFOIGlmIGJvdGggYXJlIFx1MDBCMUluZmluaXR5IHdpdGggdGhlIHNhbWUgc2lnbi5cclxuICAgIGVsc2UgeSA9IG5ldyBDdG9yKHkuZCB8fCB4LnMgIT09IHkucyA/IHggOiBOYU4pO1xyXG5cclxuICAgIHJldHVybiB5O1xyXG4gIH1cclxuXHJcbiAgLy8gSWYgc2lnbnMgZGlmZmVyLi4uXHJcbiAgaWYgKHgucyAhPSB5LnMpIHtcclxuICAgIHkucyA9IC15LnM7XHJcbiAgICByZXR1cm4geC5wbHVzKHkpO1xyXG4gIH1cclxuXHJcbiAgeGQgPSB4LmQ7XHJcbiAgeWQgPSB5LmQ7XHJcbiAgcHIgPSBDdG9yLnByZWNpc2lvbjtcclxuICBybSA9IEN0b3Iucm91bmRpbmc7XHJcblxyXG4gIC8vIElmIGVpdGhlciBpcyB6ZXJvLi4uXHJcbiAgaWYgKCF4ZFswXSB8fCAheWRbMF0pIHtcclxuXHJcbiAgICAvLyBSZXR1cm4geSBuZWdhdGVkIGlmIHggaXMgemVybyBhbmQgeSBpcyBub24temVyby5cclxuICAgIGlmICh5ZFswXSkgeS5zID0gLXkucztcclxuXHJcbiAgICAvLyBSZXR1cm4geCBpZiB5IGlzIHplcm8gYW5kIHggaXMgbm9uLXplcm8uXHJcbiAgICBlbHNlIGlmICh4ZFswXSkgeSA9IG5ldyBDdG9yKHgpO1xyXG5cclxuICAgIC8vIFJldHVybiB6ZXJvIGlmIGJvdGggYXJlIHplcm8uXHJcbiAgICAvLyBGcm9tIElFRUUgNzU0ICgyMDA4KSA2LjM6IDAgLSAwID0gLTAgLSAtMCA9IC0wIHdoZW4gcm91bmRpbmcgdG8gLUluZmluaXR5LlxyXG4gICAgZWxzZSByZXR1cm4gbmV3IEN0b3Iocm0gPT09IDMgPyAtMCA6IDApO1xyXG5cclxuICAgIHJldHVybiBleHRlcm5hbCA/IGZpbmFsaXNlKHksIHByLCBybSkgOiB5O1xyXG4gIH1cclxuXHJcbiAgLy8geCBhbmQgeSBhcmUgZmluaXRlLCBub24temVybyBudW1iZXJzIHdpdGggdGhlIHNhbWUgc2lnbi5cclxuXHJcbiAgLy8gQ2FsY3VsYXRlIGJhc2UgMWU3IGV4cG9uZW50cy5cclxuICBlID0gbWF0aGZsb29yKHkuZSAvIExPR19CQVNFKTtcclxuICB4ZSA9IG1hdGhmbG9vcih4LmUgLyBMT0dfQkFTRSk7XHJcblxyXG4gIHhkID0geGQuc2xpY2UoKTtcclxuICBrID0geGUgLSBlO1xyXG5cclxuICAvLyBJZiBiYXNlIDFlNyBleHBvbmVudHMgZGlmZmVyLi4uXHJcbiAgaWYgKGspIHtcclxuICAgIHhMVHkgPSBrIDwgMDtcclxuXHJcbiAgICBpZiAoeExUeSkge1xyXG4gICAgICBkID0geGQ7XHJcbiAgICAgIGsgPSAtaztcclxuICAgICAgbGVuID0geWQubGVuZ3RoO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgZCA9IHlkO1xyXG4gICAgICBlID0geGU7XHJcbiAgICAgIGxlbiA9IHhkLmxlbmd0aDtcclxuICAgIH1cclxuXHJcbiAgICAvLyBOdW1iZXJzIHdpdGggbWFzc2l2ZWx5IGRpZmZlcmVudCBleHBvbmVudHMgd291bGQgcmVzdWx0IGluIGEgdmVyeSBoaWdoIG51bWJlciBvZlxyXG4gICAgLy8gemVyb3MgbmVlZGluZyB0byBiZSBwcmVwZW5kZWQsIGJ1dCB0aGlzIGNhbiBiZSBhdm9pZGVkIHdoaWxlIHN0aWxsIGVuc3VyaW5nIGNvcnJlY3RcclxuICAgIC8vIHJvdW5kaW5nIGJ5IGxpbWl0aW5nIHRoZSBudW1iZXIgb2YgemVyb3MgdG8gYE1hdGguY2VpbChwciAvIExPR19CQVNFKSArIDJgLlxyXG4gICAgaSA9IE1hdGgubWF4KE1hdGguY2VpbChwciAvIExPR19CQVNFKSwgbGVuKSArIDI7XHJcblxyXG4gICAgaWYgKGsgPiBpKSB7XHJcbiAgICAgIGsgPSBpO1xyXG4gICAgICBkLmxlbmd0aCA9IDE7XHJcbiAgICB9XHJcblxyXG4gICAgLy8gUHJlcGVuZCB6ZXJvcyB0byBlcXVhbGlzZSBleHBvbmVudHMuXHJcbiAgICBkLnJldmVyc2UoKTtcclxuICAgIGZvciAoaSA9IGs7IGktLTspIGQucHVzaCgwKTtcclxuICAgIGQucmV2ZXJzZSgpO1xyXG5cclxuICAvLyBCYXNlIDFlNyBleHBvbmVudHMgZXF1YWwuXHJcbiAgfSBlbHNlIHtcclxuXHJcbiAgICAvLyBDaGVjayBkaWdpdHMgdG8gZGV0ZXJtaW5lIHdoaWNoIGlzIHRoZSBiaWdnZXIgbnVtYmVyLlxyXG5cclxuICAgIGkgPSB4ZC5sZW5ndGg7XHJcbiAgICBsZW4gPSB5ZC5sZW5ndGg7XHJcbiAgICB4TFR5ID0gaSA8IGxlbjtcclxuICAgIGlmICh4TFR5KSBsZW4gPSBpO1xyXG5cclxuICAgIGZvciAoaSA9IDA7IGkgPCBsZW47IGkrKykge1xyXG4gICAgICBpZiAoeGRbaV0gIT0geWRbaV0pIHtcclxuICAgICAgICB4TFR5ID0geGRbaV0gPCB5ZFtpXTtcclxuICAgICAgICBicmVhaztcclxuICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGsgPSAwO1xyXG4gIH1cclxuXHJcbiAgaWYgKHhMVHkpIHtcclxuICAgIGQgPSB4ZDtcclxuICAgIHhkID0geWQ7XHJcbiAgICB5ZCA9IGQ7XHJcbiAgICB5LnMgPSAteS5zO1xyXG4gIH1cclxuXHJcbiAgbGVuID0geGQubGVuZ3RoO1xyXG5cclxuICAvLyBBcHBlbmQgemVyb3MgdG8gYHhkYCBpZiBzaG9ydGVyLlxyXG4gIC8vIERvbid0IGFkZCB6ZXJvcyB0byBgeWRgIGlmIHNob3J0ZXIgYXMgc3VidHJhY3Rpb24gb25seSBuZWVkcyB0byBzdGFydCBhdCBgeWRgIGxlbmd0aC5cclxuICBmb3IgKGkgPSB5ZC5sZW5ndGggLSBsZW47IGkgPiAwOyAtLWkpIHhkW2xlbisrXSA9IDA7XHJcblxyXG4gIC8vIFN1YnRyYWN0IHlkIGZyb20geGQuXHJcbiAgZm9yIChpID0geWQubGVuZ3RoOyBpID4gazspIHtcclxuXHJcbiAgICBpZiAoeGRbLS1pXSA8IHlkW2ldKSB7XHJcbiAgICAgIGZvciAoaiA9IGk7IGogJiYgeGRbLS1qXSA9PT0gMDspIHhkW2pdID0gQkFTRSAtIDE7XHJcbiAgICAgIC0teGRbal07XHJcbiAgICAgIHhkW2ldICs9IEJBU0U7XHJcbiAgICB9XHJcblxyXG4gICAgeGRbaV0gLT0geWRbaV07XHJcbiAgfVxyXG5cclxuICAvLyBSZW1vdmUgdHJhaWxpbmcgemVyb3MuXHJcbiAgZm9yICg7IHhkWy0tbGVuXSA9PT0gMDspIHhkLnBvcCgpO1xyXG5cclxuICAvLyBSZW1vdmUgbGVhZGluZyB6ZXJvcyBhbmQgYWRqdXN0IGV4cG9uZW50IGFjY29yZGluZ2x5LlxyXG4gIGZvciAoOyB4ZFswXSA9PT0gMDsgeGQuc2hpZnQoKSkgLS1lO1xyXG5cclxuICAvLyBaZXJvP1xyXG4gIGlmICgheGRbMF0pIHJldHVybiBuZXcgQ3RvcihybSA9PT0gMyA/IC0wIDogMCk7XHJcblxyXG4gIHkuZCA9IHhkO1xyXG4gIHkuZSA9IGdldEJhc2UxMEV4cG9uZW50KHhkLCBlKTtcclxuXHJcbiAgcmV0dXJuIGV4dGVybmFsID8gZmluYWxpc2UoeSwgcHIsIHJtKSA6IHk7XHJcbn07XHJcblxyXG5cclxuLypcclxuICogICBuICUgMCA9ICBOXHJcbiAqICAgbiAlIE4gPSAgTlxyXG4gKiAgIG4gJSBJID0gIG5cclxuICogICAwICUgbiA9ICAwXHJcbiAqICAtMCAlIG4gPSAtMFxyXG4gKiAgIDAgJSAwID0gIE5cclxuICogICAwICUgTiA9ICBOXHJcbiAqICAgMCAlIEkgPSAgMFxyXG4gKiAgIE4gJSBuID0gIE5cclxuICogICBOICUgMCA9ICBOXHJcbiAqICAgTiAlIE4gPSAgTlxyXG4gKiAgIE4gJSBJID0gIE5cclxuICogICBJICUgbiA9ICBOXHJcbiAqICAgSSAlIDAgPSAgTlxyXG4gKiAgIEkgJSBOID0gIE5cclxuICogICBJICUgSSA9ICBOXHJcbiAqXHJcbiAqIFJldHVybiBhIG5ldyBEZWNpbWFsIHdob3NlIHZhbHVlIGlzIHRoZSB2YWx1ZSBvZiB0aGlzIERlY2ltYWwgbW9kdWxvIGB5YCwgcm91bmRlZCB0b1xyXG4gKiBgcHJlY2lzaW9uYCBzaWduaWZpY2FudCBkaWdpdHMgdXNpbmcgcm91bmRpbmcgbW9kZSBgcm91bmRpbmdgLlxyXG4gKlxyXG4gKiBUaGUgcmVzdWx0IGRlcGVuZHMgb24gdGhlIG1vZHVsbyBtb2RlLlxyXG4gKlxyXG4gKi9cclxuUC5tb2R1bG8gPSBQLm1vZCA9IGZ1bmN0aW9uICh5KSB7XHJcbiAgdmFyIHEsXHJcbiAgICB4ID0gdGhpcyxcclxuICAgIEN0b3IgPSB4LmNvbnN0cnVjdG9yO1xyXG5cclxuICB5ID0gbmV3IEN0b3IoeSk7XHJcblxyXG4gIC8vIFJldHVybiBOYU4gaWYgeCBpcyBcdTAwQjFJbmZpbml0eSBvciBOYU4sIG9yIHkgaXMgTmFOIG9yIFx1MDBCMTAuXHJcbiAgaWYgKCF4LmQgfHwgIXkucyB8fCB5LmQgJiYgIXkuZFswXSkgcmV0dXJuIG5ldyBDdG9yKE5hTik7XHJcblxyXG4gIC8vIFJldHVybiB4IGlmIHkgaXMgXHUwMEIxSW5maW5pdHkgb3IgeCBpcyBcdTAwQjEwLlxyXG4gIGlmICgheS5kIHx8IHguZCAmJiAheC5kWzBdKSB7XHJcbiAgICByZXR1cm4gZmluYWxpc2UobmV3IEN0b3IoeCksIEN0b3IucHJlY2lzaW9uLCBDdG9yLnJvdW5kaW5nKTtcclxuICB9XHJcblxyXG4gIC8vIFByZXZlbnQgcm91bmRpbmcgb2YgaW50ZXJtZWRpYXRlIGNhbGN1bGF0aW9ucy5cclxuICBleHRlcm5hbCA9IGZhbHNlO1xyXG5cclxuICBpZiAoQ3Rvci5tb2R1bG8gPT0gOSkge1xyXG5cclxuICAgIC8vIEV1Y2xpZGlhbiBkaXZpc2lvbjogcSA9IHNpZ24oeSkgKiBmbG9vcih4IC8gYWJzKHkpKVxyXG4gICAgLy8gcmVzdWx0ID0geCAtIHEgKiB5ICAgIHdoZXJlICAwIDw9IHJlc3VsdCA8IGFicyh5KVxyXG4gICAgcSA9IGRpdmlkZSh4LCB5LmFicygpLCAwLCAzLCAxKTtcclxuICAgIHEucyAqPSB5LnM7XHJcbiAgfSBlbHNlIHtcclxuICAgIHEgPSBkaXZpZGUoeCwgeSwgMCwgQ3Rvci5tb2R1bG8sIDEpO1xyXG4gIH1cclxuXHJcbiAgcSA9IHEudGltZXMoeSk7XHJcblxyXG4gIGV4dGVybmFsID0gdHJ1ZTtcclxuXHJcbiAgcmV0dXJuIHgubWludXMocSk7XHJcbn07XHJcblxyXG5cclxuLypcclxuICogUmV0dXJuIGEgbmV3IERlY2ltYWwgd2hvc2UgdmFsdWUgaXMgdGhlIG5hdHVyYWwgZXhwb25lbnRpYWwgb2YgdGhlIHZhbHVlIG9mIHRoaXMgRGVjaW1hbCxcclxuICogaS5lLiB0aGUgYmFzZSBlIHJhaXNlZCB0byB0aGUgcG93ZXIgdGhlIHZhbHVlIG9mIHRoaXMgRGVjaW1hbCwgcm91bmRlZCB0byBgcHJlY2lzaW9uYFxyXG4gKiBzaWduaWZpY2FudCBkaWdpdHMgdXNpbmcgcm91bmRpbmcgbW9kZSBgcm91bmRpbmdgLlxyXG4gKlxyXG4gKi9cclxuUC5uYXR1cmFsRXhwb25lbnRpYWwgPSBQLmV4cCA9IGZ1bmN0aW9uICgpIHtcclxuICByZXR1cm4gbmF0dXJhbEV4cG9uZW50aWFsKHRoaXMpO1xyXG59O1xyXG5cclxuXHJcbi8qXHJcbiAqIFJldHVybiBhIG5ldyBEZWNpbWFsIHdob3NlIHZhbHVlIGlzIHRoZSBuYXR1cmFsIGxvZ2FyaXRobSBvZiB0aGUgdmFsdWUgb2YgdGhpcyBEZWNpbWFsLFxyXG4gKiByb3VuZGVkIHRvIGBwcmVjaXNpb25gIHNpZ25pZmljYW50IGRpZ2l0cyB1c2luZyByb3VuZGluZyBtb2RlIGByb3VuZGluZ2AuXHJcbiAqXHJcbiAqL1xyXG5QLm5hdHVyYWxMb2dhcml0aG0gPSBQLmxuID0gZnVuY3Rpb24gKCkge1xyXG4gIHJldHVybiBuYXR1cmFsTG9nYXJpdGhtKHRoaXMpO1xyXG59O1xyXG5cclxuXHJcbi8qXHJcbiAqIFJldHVybiBhIG5ldyBEZWNpbWFsIHdob3NlIHZhbHVlIGlzIHRoZSB2YWx1ZSBvZiB0aGlzIERlY2ltYWwgbmVnYXRlZCwgaS5lLiBhcyBpZiBtdWx0aXBsaWVkIGJ5XHJcbiAqIC0xLlxyXG4gKlxyXG4gKi9cclxuUC5uZWdhdGVkID0gUC5uZWcgPSBmdW5jdGlvbiAoKSB7XHJcbiAgdmFyIHggPSBuZXcgdGhpcy5jb25zdHJ1Y3Rvcih0aGlzKTtcclxuICB4LnMgPSAteC5zO1xyXG4gIHJldHVybiBmaW5hbGlzZSh4KTtcclxufTtcclxuXHJcblxyXG4vKlxyXG4gKiAgbiArIDAgPSBuXHJcbiAqICBuICsgTiA9IE5cclxuICogIG4gKyBJID0gSVxyXG4gKiAgMCArIG4gPSBuXHJcbiAqICAwICsgMCA9IDBcclxuICogIDAgKyBOID0gTlxyXG4gKiAgMCArIEkgPSBJXHJcbiAqICBOICsgbiA9IE5cclxuICogIE4gKyAwID0gTlxyXG4gKiAgTiArIE4gPSBOXHJcbiAqICBOICsgSSA9IE5cclxuICogIEkgKyBuID0gSVxyXG4gKiAgSSArIDAgPSBJXHJcbiAqICBJICsgTiA9IE5cclxuICogIEkgKyBJID0gSVxyXG4gKlxyXG4gKiBSZXR1cm4gYSBuZXcgRGVjaW1hbCB3aG9zZSB2YWx1ZSBpcyB0aGUgdmFsdWUgb2YgdGhpcyBEZWNpbWFsIHBsdXMgYHlgLCByb3VuZGVkIHRvIGBwcmVjaXNpb25gXHJcbiAqIHNpZ25pZmljYW50IGRpZ2l0cyB1c2luZyByb3VuZGluZyBtb2RlIGByb3VuZGluZ2AuXHJcbiAqXHJcbiAqL1xyXG5QLnBsdXMgPSBQLmFkZCA9IGZ1bmN0aW9uICh5KSB7XHJcbiAgdmFyIGNhcnJ5LCBkLCBlLCBpLCBrLCBsZW4sIHByLCBybSwgeGQsIHlkLFxyXG4gICAgeCA9IHRoaXMsXHJcbiAgICBDdG9yID0geC5jb25zdHJ1Y3RvcjtcclxuXHJcbiAgeSA9IG5ldyBDdG9yKHkpO1xyXG5cclxuICAvLyBJZiBlaXRoZXIgaXMgbm90IGZpbml0ZS4uLlxyXG4gIGlmICgheC5kIHx8ICF5LmQpIHtcclxuXHJcbiAgICAvLyBSZXR1cm4gTmFOIGlmIGVpdGhlciBpcyBOYU4uXHJcbiAgICBpZiAoIXgucyB8fCAheS5zKSB5ID0gbmV3IEN0b3IoTmFOKTtcclxuXHJcbiAgICAvLyBSZXR1cm4geCBpZiB5IGlzIGZpbml0ZSBhbmQgeCBpcyBcdTAwQjFJbmZpbml0eS5cclxuICAgIC8vIFJldHVybiB4IGlmIGJvdGggYXJlIFx1MDBCMUluZmluaXR5IHdpdGggdGhlIHNhbWUgc2lnbi5cclxuICAgIC8vIFJldHVybiBOYU4gaWYgYm90aCBhcmUgXHUwMEIxSW5maW5pdHkgd2l0aCBkaWZmZXJlbnQgc2lnbnMuXHJcbiAgICAvLyBSZXR1cm4geSBpZiB4IGlzIGZpbml0ZSBhbmQgeSBpcyBcdTAwQjFJbmZpbml0eS5cclxuICAgIGVsc2UgaWYgKCF4LmQpIHkgPSBuZXcgQ3Rvcih5LmQgfHwgeC5zID09PSB5LnMgPyB4IDogTmFOKTtcclxuXHJcbiAgICByZXR1cm4geTtcclxuICB9XHJcblxyXG4gICAvLyBJZiBzaWducyBkaWZmZXIuLi5cclxuICBpZiAoeC5zICE9IHkucykge1xyXG4gICAgeS5zID0gLXkucztcclxuICAgIHJldHVybiB4Lm1pbnVzKHkpO1xyXG4gIH1cclxuXHJcbiAgeGQgPSB4LmQ7XHJcbiAgeWQgPSB5LmQ7XHJcbiAgcHIgPSBDdG9yLnByZWNpc2lvbjtcclxuICBybSA9IEN0b3Iucm91bmRpbmc7XHJcblxyXG4gIC8vIElmIGVpdGhlciBpcyB6ZXJvLi4uXHJcbiAgaWYgKCF4ZFswXSB8fCAheWRbMF0pIHtcclxuXHJcbiAgICAvLyBSZXR1cm4geCBpZiB5IGlzIHplcm8uXHJcbiAgICAvLyBSZXR1cm4geSBpZiB5IGlzIG5vbi16ZXJvLlxyXG4gICAgaWYgKCF5ZFswXSkgeSA9IG5ldyBDdG9yKHgpO1xyXG5cclxuICAgIHJldHVybiBleHRlcm5hbCA/IGZpbmFsaXNlKHksIHByLCBybSkgOiB5O1xyXG4gIH1cclxuXHJcbiAgLy8geCBhbmQgeSBhcmUgZmluaXRlLCBub24temVybyBudW1iZXJzIHdpdGggdGhlIHNhbWUgc2lnbi5cclxuXHJcbiAgLy8gQ2FsY3VsYXRlIGJhc2UgMWU3IGV4cG9uZW50cy5cclxuICBrID0gbWF0aGZsb29yKHguZSAvIExPR19CQVNFKTtcclxuICBlID0gbWF0aGZsb29yKHkuZSAvIExPR19CQVNFKTtcclxuXHJcbiAgeGQgPSB4ZC5zbGljZSgpO1xyXG4gIGkgPSBrIC0gZTtcclxuXHJcbiAgLy8gSWYgYmFzZSAxZTcgZXhwb25lbnRzIGRpZmZlci4uLlxyXG4gIGlmIChpKSB7XHJcblxyXG4gICAgaWYgKGkgPCAwKSB7XHJcbiAgICAgIGQgPSB4ZDtcclxuICAgICAgaSA9IC1pO1xyXG4gICAgICBsZW4gPSB5ZC5sZW5ndGg7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICBkID0geWQ7XHJcbiAgICAgIGUgPSBrO1xyXG4gICAgICBsZW4gPSB4ZC5sZW5ndGg7XHJcbiAgICB9XHJcblxyXG4gICAgLy8gTGltaXQgbnVtYmVyIG9mIHplcm9zIHByZXBlbmRlZCB0byBtYXgoY2VpbChwciAvIExPR19CQVNFKSwgbGVuKSArIDEuXHJcbiAgICBrID0gTWF0aC5jZWlsKHByIC8gTE9HX0JBU0UpO1xyXG4gICAgbGVuID0gayA+IGxlbiA/IGsgKyAxIDogbGVuICsgMTtcclxuXHJcbiAgICBpZiAoaSA+IGxlbikge1xyXG4gICAgICBpID0gbGVuO1xyXG4gICAgICBkLmxlbmd0aCA9IDE7XHJcbiAgICB9XHJcblxyXG4gICAgLy8gUHJlcGVuZCB6ZXJvcyB0byBlcXVhbGlzZSBleHBvbmVudHMuIE5vdGU6IEZhc3RlciB0byB1c2UgcmV2ZXJzZSB0aGVuIGRvIHVuc2hpZnRzLlxyXG4gICAgZC5yZXZlcnNlKCk7XHJcbiAgICBmb3IgKDsgaS0tOykgZC5wdXNoKDApO1xyXG4gICAgZC5yZXZlcnNlKCk7XHJcbiAgfVxyXG5cclxuICBsZW4gPSB4ZC5sZW5ndGg7XHJcbiAgaSA9IHlkLmxlbmd0aDtcclxuXHJcbiAgLy8gSWYgeWQgaXMgbG9uZ2VyIHRoYW4geGQsIHN3YXAgeGQgYW5kIHlkIHNvIHhkIHBvaW50cyB0byB0aGUgbG9uZ2VyIGFycmF5LlxyXG4gIGlmIChsZW4gLSBpIDwgMCkge1xyXG4gICAgaSA9IGxlbjtcclxuICAgIGQgPSB5ZDtcclxuICAgIHlkID0geGQ7XHJcbiAgICB4ZCA9IGQ7XHJcbiAgfVxyXG5cclxuICAvLyBPbmx5IHN0YXJ0IGFkZGluZyBhdCB5ZC5sZW5ndGggLSAxIGFzIHRoZSBmdXJ0aGVyIGRpZ2l0cyBvZiB4ZCBjYW4gYmUgbGVmdCBhcyB0aGV5IGFyZS5cclxuICBmb3IgKGNhcnJ5ID0gMDsgaTspIHtcclxuICAgIGNhcnJ5ID0gKHhkWy0taV0gPSB4ZFtpXSArIHlkW2ldICsgY2FycnkpIC8gQkFTRSB8IDA7XHJcbiAgICB4ZFtpXSAlPSBCQVNFO1xyXG4gIH1cclxuXHJcbiAgaWYgKGNhcnJ5KSB7XHJcbiAgICB4ZC51bnNoaWZ0KGNhcnJ5KTtcclxuICAgICsrZTtcclxuICB9XHJcblxyXG4gIC8vIFJlbW92ZSB0cmFpbGluZyB6ZXJvcy5cclxuICAvLyBObyBuZWVkIHRvIGNoZWNrIGZvciB6ZXJvLCBhcyAreCArICt5ICE9IDAgJiYgLXggKyAteSAhPSAwXHJcbiAgZm9yIChsZW4gPSB4ZC5sZW5ndGg7IHhkWy0tbGVuXSA9PSAwOykgeGQucG9wKCk7XHJcblxyXG4gIHkuZCA9IHhkO1xyXG4gIHkuZSA9IGdldEJhc2UxMEV4cG9uZW50KHhkLCBlKTtcclxuXHJcbiAgcmV0dXJuIGV4dGVybmFsID8gZmluYWxpc2UoeSwgcHIsIHJtKSA6IHk7XHJcbn07XHJcblxyXG5cclxuLypcclxuICogUmV0dXJuIHRoZSBudW1iZXIgb2Ygc2lnbmlmaWNhbnQgZGlnaXRzIG9mIHRoZSB2YWx1ZSBvZiB0aGlzIERlY2ltYWwuXHJcbiAqXHJcbiAqIFt6XSB7Ym9vbGVhbnxudW1iZXJ9IFdoZXRoZXIgdG8gY291bnQgaW50ZWdlci1wYXJ0IHRyYWlsaW5nIHplcm9zOiB0cnVlLCBmYWxzZSwgMSBvciAwLlxyXG4gKlxyXG4gKi9cclxuUC5wcmVjaXNpb24gPSBQLnNkID0gZnVuY3Rpb24gKHopIHtcclxuICB2YXIgayxcclxuICAgIHggPSB0aGlzO1xyXG5cclxuICBpZiAoeiAhPT0gdm9pZCAwICYmIHogIT09ICEheiAmJiB6ICE9PSAxICYmIHogIT09IDApIHRocm93IEVycm9yKGludmFsaWRBcmd1bWVudCArIHopO1xyXG5cclxuICBpZiAoeC5kKSB7XHJcbiAgICBrID0gZ2V0UHJlY2lzaW9uKHguZCk7XHJcbiAgICBpZiAoeiAmJiB4LmUgKyAxID4gaykgayA9IHguZSArIDE7XHJcbiAgfSBlbHNlIHtcclxuICAgIGsgPSBOYU47XHJcbiAgfVxyXG5cclxuICByZXR1cm4gaztcclxufTtcclxuXHJcblxyXG4vKlxyXG4gKiBSZXR1cm4gYSBuZXcgRGVjaW1hbCB3aG9zZSB2YWx1ZSBpcyB0aGUgdmFsdWUgb2YgdGhpcyBEZWNpbWFsIHJvdW5kZWQgdG8gYSB3aG9sZSBudW1iZXIgdXNpbmdcclxuICogcm91bmRpbmcgbW9kZSBgcm91bmRpbmdgLlxyXG4gKlxyXG4gKi9cclxuUC5yb3VuZCA9IGZ1bmN0aW9uICgpIHtcclxuICB2YXIgeCA9IHRoaXMsXHJcbiAgICBDdG9yID0geC5jb25zdHJ1Y3RvcjtcclxuXHJcbiAgcmV0dXJuIGZpbmFsaXNlKG5ldyBDdG9yKHgpLCB4LmUgKyAxLCBDdG9yLnJvdW5kaW5nKTtcclxufTtcclxuXHJcblxyXG4vKlxyXG4gKiBSZXR1cm4gYSBuZXcgRGVjaW1hbCB3aG9zZSB2YWx1ZSBpcyB0aGUgc2luZSBvZiB0aGUgdmFsdWUgaW4gcmFkaWFucyBvZiB0aGlzIERlY2ltYWwuXHJcbiAqXHJcbiAqIERvbWFpbjogWy1JbmZpbml0eSwgSW5maW5pdHldXHJcbiAqIFJhbmdlOiBbLTEsIDFdXHJcbiAqXHJcbiAqIHNpbih4KSA9IHggLSB4XjMvMyEgKyB4XjUvNSEgLSAuLi5cclxuICpcclxuICogc2luKDApICAgICAgICAgPSAwXHJcbiAqIHNpbigtMCkgICAgICAgID0gLTBcclxuICogc2luKEluZmluaXR5KSAgPSBOYU5cclxuICogc2luKC1JbmZpbml0eSkgPSBOYU5cclxuICogc2luKE5hTikgICAgICAgPSBOYU5cclxuICpcclxuICovXHJcblAuc2luZSA9IFAuc2luID0gZnVuY3Rpb24gKCkge1xyXG4gIHZhciBwciwgcm0sXHJcbiAgICB4ID0gdGhpcyxcclxuICAgIEN0b3IgPSB4LmNvbnN0cnVjdG9yO1xyXG5cclxuICBpZiAoIXguaXNGaW5pdGUoKSkgcmV0dXJuIG5ldyBDdG9yKE5hTik7XHJcbiAgaWYgKHguaXNaZXJvKCkpIHJldHVybiBuZXcgQ3Rvcih4KTtcclxuXHJcbiAgcHIgPSBDdG9yLnByZWNpc2lvbjtcclxuICBybSA9IEN0b3Iucm91bmRpbmc7XHJcbiAgQ3Rvci5wcmVjaXNpb24gPSBwciArIE1hdGgubWF4KHguZSwgeC5zZCgpKSArIExPR19CQVNFO1xyXG4gIEN0b3Iucm91bmRpbmcgPSAxO1xyXG5cclxuICB4ID0gc2luZShDdG9yLCB0b0xlc3NUaGFuSGFsZlBpKEN0b3IsIHgpKTtcclxuXHJcbiAgQ3Rvci5wcmVjaXNpb24gPSBwcjtcclxuICBDdG9yLnJvdW5kaW5nID0gcm07XHJcblxyXG4gIHJldHVybiBmaW5hbGlzZShxdWFkcmFudCA+IDIgPyB4Lm5lZygpIDogeCwgcHIsIHJtLCB0cnVlKTtcclxufTtcclxuXHJcblxyXG4vKlxyXG4gKiBSZXR1cm4gYSBuZXcgRGVjaW1hbCB3aG9zZSB2YWx1ZSBpcyB0aGUgc3F1YXJlIHJvb3Qgb2YgdGhpcyBEZWNpbWFsLCByb3VuZGVkIHRvIGBwcmVjaXNpb25gXHJcbiAqIHNpZ25pZmljYW50IGRpZ2l0cyB1c2luZyByb3VuZGluZyBtb2RlIGByb3VuZGluZ2AuXHJcbiAqXHJcbiAqICBzcXJ0KC1uKSA9ICBOXHJcbiAqICBzcXJ0KE4pICA9ICBOXHJcbiAqICBzcXJ0KC1JKSA9ICBOXHJcbiAqICBzcXJ0KEkpICA9ICBJXHJcbiAqICBzcXJ0KDApICA9ICAwXHJcbiAqICBzcXJ0KC0wKSA9IC0wXHJcbiAqXHJcbiAqL1xyXG5QLnNxdWFyZVJvb3QgPSBQLnNxcnQgPSBmdW5jdGlvbiAoKSB7XHJcbiAgdmFyIG0sIG4sIHNkLCByLCByZXAsIHQsXHJcbiAgICB4ID0gdGhpcyxcclxuICAgIGQgPSB4LmQsXHJcbiAgICBlID0geC5lLFxyXG4gICAgcyA9IHgucyxcclxuICAgIEN0b3IgPSB4LmNvbnN0cnVjdG9yO1xyXG5cclxuICAvLyBOZWdhdGl2ZS9OYU4vSW5maW5pdHkvemVybz9cclxuICBpZiAocyAhPT0gMSB8fCAhZCB8fCAhZFswXSkge1xyXG4gICAgcmV0dXJuIG5ldyBDdG9yKCFzIHx8IHMgPCAwICYmICghZCB8fCBkWzBdKSA/IE5hTiA6IGQgPyB4IDogMSAvIDApO1xyXG4gIH1cclxuXHJcbiAgZXh0ZXJuYWwgPSBmYWxzZTtcclxuXHJcbiAgLy8gSW5pdGlhbCBlc3RpbWF0ZS5cclxuICBzID0gTWF0aC5zcXJ0KCt4KTtcclxuXHJcbiAgLy8gTWF0aC5zcXJ0IHVuZGVyZmxvdy9vdmVyZmxvdz9cclxuICAvLyBQYXNzIHggdG8gTWF0aC5zcXJ0IGFzIGludGVnZXIsIHRoZW4gYWRqdXN0IHRoZSBleHBvbmVudCBvZiB0aGUgcmVzdWx0LlxyXG4gIGlmIChzID09IDAgfHwgcyA9PSAxIC8gMCkge1xyXG4gICAgbiA9IGRpZ2l0c1RvU3RyaW5nKGQpO1xyXG5cclxuICAgIGlmICgobi5sZW5ndGggKyBlKSAlIDIgPT0gMCkgbiArPSAnMCc7XHJcbiAgICBzID0gTWF0aC5zcXJ0KG4pO1xyXG4gICAgZSA9IG1hdGhmbG9vcigoZSArIDEpIC8gMikgLSAoZSA8IDAgfHwgZSAlIDIpO1xyXG5cclxuICAgIGlmIChzID09IDEgLyAwKSB7XHJcbiAgICAgIG4gPSAnNWUnICsgZTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIG4gPSBzLnRvRXhwb25lbnRpYWwoKTtcclxuICAgICAgbiA9IG4uc2xpY2UoMCwgbi5pbmRleE9mKCdlJykgKyAxKSArIGU7XHJcbiAgICB9XHJcblxyXG4gICAgciA9IG5ldyBDdG9yKG4pO1xyXG4gIH0gZWxzZSB7XHJcbiAgICByID0gbmV3IEN0b3Iocy50b1N0cmluZygpKTtcclxuICB9XHJcblxyXG4gIHNkID0gKGUgPSBDdG9yLnByZWNpc2lvbikgKyAzO1xyXG5cclxuICAvLyBOZXd0b24tUmFwaHNvbiBpdGVyYXRpb24uXHJcbiAgZm9yICg7Oykge1xyXG4gICAgdCA9IHI7XHJcbiAgICByID0gdC5wbHVzKGRpdmlkZSh4LCB0LCBzZCArIDIsIDEpKS50aW1lcygwLjUpO1xyXG5cclxuICAgIC8vIFRPRE8/IFJlcGxhY2Ugd2l0aCBmb3ItbG9vcCBhbmQgY2hlY2tSb3VuZGluZ0RpZ2l0cy5cclxuICAgIGlmIChkaWdpdHNUb1N0cmluZyh0LmQpLnNsaWNlKDAsIHNkKSA9PT0gKG4gPSBkaWdpdHNUb1N0cmluZyhyLmQpKS5zbGljZSgwLCBzZCkpIHtcclxuICAgICAgbiA9IG4uc2xpY2Uoc2QgLSAzLCBzZCArIDEpO1xyXG5cclxuICAgICAgLy8gVGhlIDR0aCByb3VuZGluZyBkaWdpdCBtYXkgYmUgaW4gZXJyb3IgYnkgLTEgc28gaWYgdGhlIDQgcm91bmRpbmcgZGlnaXRzIGFyZSA5OTk5IG9yXHJcbiAgICAgIC8vIDQ5OTksIGkuZS4gYXBwcm9hY2hpbmcgYSByb3VuZGluZyBib3VuZGFyeSwgY29udGludWUgdGhlIGl0ZXJhdGlvbi5cclxuICAgICAgaWYgKG4gPT0gJzk5OTknIHx8ICFyZXAgJiYgbiA9PSAnNDk5OScpIHtcclxuXHJcbiAgICAgICAgLy8gT24gdGhlIGZpcnN0IGl0ZXJhdGlvbiBvbmx5LCBjaGVjayB0byBzZWUgaWYgcm91bmRpbmcgdXAgZ2l2ZXMgdGhlIGV4YWN0IHJlc3VsdCBhcyB0aGVcclxuICAgICAgICAvLyBuaW5lcyBtYXkgaW5maW5pdGVseSByZXBlYXQuXHJcbiAgICAgICAgaWYgKCFyZXApIHtcclxuICAgICAgICAgIGZpbmFsaXNlKHQsIGUgKyAxLCAwKTtcclxuXHJcbiAgICAgICAgICBpZiAodC50aW1lcyh0KS5lcSh4KSkge1xyXG4gICAgICAgICAgICByID0gdDtcclxuICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBzZCArPSA0O1xyXG4gICAgICAgIHJlcCA9IDE7XHJcbiAgICAgIH0gZWxzZSB7XHJcblxyXG4gICAgICAgIC8vIElmIHRoZSByb3VuZGluZyBkaWdpdHMgYXJlIG51bGwsIDB7MCw0fSBvciA1MHswLDN9LCBjaGVjayBmb3IgYW4gZXhhY3QgcmVzdWx0LlxyXG4gICAgICAgIC8vIElmIG5vdCwgdGhlbiB0aGVyZSBhcmUgZnVydGhlciBkaWdpdHMgYW5kIG0gd2lsbCBiZSB0cnV0aHkuXHJcbiAgICAgICAgaWYgKCErbiB8fCAhK24uc2xpY2UoMSkgJiYgbi5jaGFyQXQoMCkgPT0gJzUnKSB7XHJcblxyXG4gICAgICAgICAgLy8gVHJ1bmNhdGUgdG8gdGhlIGZpcnN0IHJvdW5kaW5nIGRpZ2l0LlxyXG4gICAgICAgICAgZmluYWxpc2UociwgZSArIDEsIDEpO1xyXG4gICAgICAgICAgbSA9ICFyLnRpbWVzKHIpLmVxKHgpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgYnJlYWs7XHJcbiAgICAgIH1cclxuICAgIH1cclxuICB9XHJcblxyXG4gIGV4dGVybmFsID0gdHJ1ZTtcclxuXHJcbiAgcmV0dXJuIGZpbmFsaXNlKHIsIGUsIEN0b3Iucm91bmRpbmcsIG0pO1xyXG59O1xyXG5cclxuXHJcbi8qXHJcbiAqIFJldHVybiBhIG5ldyBEZWNpbWFsIHdob3NlIHZhbHVlIGlzIHRoZSB0YW5nZW50IG9mIHRoZSB2YWx1ZSBpbiByYWRpYW5zIG9mIHRoaXMgRGVjaW1hbC5cclxuICpcclxuICogRG9tYWluOiBbLUluZmluaXR5LCBJbmZpbml0eV1cclxuICogUmFuZ2U6IFstSW5maW5pdHksIEluZmluaXR5XVxyXG4gKlxyXG4gKiB0YW4oMCkgICAgICAgICA9IDBcclxuICogdGFuKC0wKSAgICAgICAgPSAtMFxyXG4gKiB0YW4oSW5maW5pdHkpICA9IE5hTlxyXG4gKiB0YW4oLUluZmluaXR5KSA9IE5hTlxyXG4gKiB0YW4oTmFOKSAgICAgICA9IE5hTlxyXG4gKlxyXG4gKi9cclxuUC50YW5nZW50ID0gUC50YW4gPSBmdW5jdGlvbiAoKSB7XHJcbiAgdmFyIHByLCBybSxcclxuICAgIHggPSB0aGlzLFxyXG4gICAgQ3RvciA9IHguY29uc3RydWN0b3I7XHJcblxyXG4gIGlmICgheC5pc0Zpbml0ZSgpKSByZXR1cm4gbmV3IEN0b3IoTmFOKTtcclxuICBpZiAoeC5pc1plcm8oKSkgcmV0dXJuIG5ldyBDdG9yKHgpO1xyXG5cclxuICBwciA9IEN0b3IucHJlY2lzaW9uO1xyXG4gIHJtID0gQ3Rvci5yb3VuZGluZztcclxuICBDdG9yLnByZWNpc2lvbiA9IHByICsgMTA7XHJcbiAgQ3Rvci5yb3VuZGluZyA9IDE7XHJcblxyXG4gIHggPSB4LnNpbigpO1xyXG4gIHgucyA9IDE7XHJcbiAgeCA9IGRpdmlkZSh4LCBuZXcgQ3RvcigxKS5taW51cyh4LnRpbWVzKHgpKS5zcXJ0KCksIHByICsgMTAsIDApO1xyXG5cclxuICBDdG9yLnByZWNpc2lvbiA9IHByO1xyXG4gIEN0b3Iucm91bmRpbmcgPSBybTtcclxuXHJcbiAgcmV0dXJuIGZpbmFsaXNlKHF1YWRyYW50ID09IDIgfHwgcXVhZHJhbnQgPT0gNCA/IHgubmVnKCkgOiB4LCBwciwgcm0sIHRydWUpO1xyXG59O1xyXG5cclxuXHJcbi8qXHJcbiAqICBuICogMCA9IDBcclxuICogIG4gKiBOID0gTlxyXG4gKiAgbiAqIEkgPSBJXHJcbiAqICAwICogbiA9IDBcclxuICogIDAgKiAwID0gMFxyXG4gKiAgMCAqIE4gPSBOXHJcbiAqICAwICogSSA9IE5cclxuICogIE4gKiBuID0gTlxyXG4gKiAgTiAqIDAgPSBOXHJcbiAqICBOICogTiA9IE5cclxuICogIE4gKiBJID0gTlxyXG4gKiAgSSAqIG4gPSBJXHJcbiAqICBJICogMCA9IE5cclxuICogIEkgKiBOID0gTlxyXG4gKiAgSSAqIEkgPSBJXHJcbiAqXHJcbiAqIFJldHVybiBhIG5ldyBEZWNpbWFsIHdob3NlIHZhbHVlIGlzIHRoaXMgRGVjaW1hbCB0aW1lcyBgeWAsIHJvdW5kZWQgdG8gYHByZWNpc2lvbmAgc2lnbmlmaWNhbnRcclxuICogZGlnaXRzIHVzaW5nIHJvdW5kaW5nIG1vZGUgYHJvdW5kaW5nYC5cclxuICpcclxuICovXHJcblAudGltZXMgPSBQLm11bCA9IGZ1bmN0aW9uICh5KSB7XHJcbiAgdmFyIGNhcnJ5LCBlLCBpLCBrLCByLCByTCwgdCwgeGRMLCB5ZEwsXHJcbiAgICB4ID0gdGhpcyxcclxuICAgIEN0b3IgPSB4LmNvbnN0cnVjdG9yLFxyXG4gICAgeGQgPSB4LmQsXHJcbiAgICB5ZCA9ICh5ID0gbmV3IEN0b3IoeSkpLmQ7XHJcblxyXG4gIHkucyAqPSB4LnM7XHJcblxyXG4gICAvLyBJZiBlaXRoZXIgaXMgTmFOLCBcdTAwQjFJbmZpbml0eSBvciBcdTAwQjEwLi4uXHJcbiAgaWYgKCF4ZCB8fCAheGRbMF0gfHwgIXlkIHx8ICF5ZFswXSkge1xyXG5cclxuICAgIHJldHVybiBuZXcgQ3RvcigheS5zIHx8IHhkICYmICF4ZFswXSAmJiAheWQgfHwgeWQgJiYgIXlkWzBdICYmICF4ZFxyXG5cclxuICAgICAgLy8gUmV0dXJuIE5hTiBpZiBlaXRoZXIgaXMgTmFOLlxyXG4gICAgICAvLyBSZXR1cm4gTmFOIGlmIHggaXMgXHUwMEIxMCBhbmQgeSBpcyBcdTAwQjFJbmZpbml0eSwgb3IgeSBpcyBcdTAwQjEwIGFuZCB4IGlzIFx1MDBCMUluZmluaXR5LlxyXG4gICAgICA/IE5hTlxyXG5cclxuICAgICAgLy8gUmV0dXJuIFx1MDBCMUluZmluaXR5IGlmIGVpdGhlciBpcyBcdTAwQjFJbmZpbml0eS5cclxuICAgICAgLy8gUmV0dXJuIFx1MDBCMTAgaWYgZWl0aGVyIGlzIFx1MDBCMTAuXHJcbiAgICAgIDogIXhkIHx8ICF5ZCA/IHkucyAvIDAgOiB5LnMgKiAwKTtcclxuICB9XHJcblxyXG4gIGUgPSBtYXRoZmxvb3IoeC5lIC8gTE9HX0JBU0UpICsgbWF0aGZsb29yKHkuZSAvIExPR19CQVNFKTtcclxuICB4ZEwgPSB4ZC5sZW5ndGg7XHJcbiAgeWRMID0geWQubGVuZ3RoO1xyXG5cclxuICAvLyBFbnN1cmUgeGQgcG9pbnRzIHRvIHRoZSBsb25nZXIgYXJyYXkuXHJcbiAgaWYgKHhkTCA8IHlkTCkge1xyXG4gICAgciA9IHhkO1xyXG4gICAgeGQgPSB5ZDtcclxuICAgIHlkID0gcjtcclxuICAgIHJMID0geGRMO1xyXG4gICAgeGRMID0geWRMO1xyXG4gICAgeWRMID0gckw7XHJcbiAgfVxyXG5cclxuICAvLyBJbml0aWFsaXNlIHRoZSByZXN1bHQgYXJyYXkgd2l0aCB6ZXJvcy5cclxuICByID0gW107XHJcbiAgckwgPSB4ZEwgKyB5ZEw7XHJcbiAgZm9yIChpID0gckw7IGktLTspIHIucHVzaCgwKTtcclxuXHJcbiAgLy8gTXVsdGlwbHkhXHJcbiAgZm9yIChpID0geWRMOyAtLWkgPj0gMDspIHtcclxuICAgIGNhcnJ5ID0gMDtcclxuICAgIGZvciAoayA9IHhkTCArIGk7IGsgPiBpOykge1xyXG4gICAgICB0ID0gcltrXSArIHlkW2ldICogeGRbayAtIGkgLSAxXSArIGNhcnJ5O1xyXG4gICAgICByW2stLV0gPSB0ICUgQkFTRSB8IDA7XHJcbiAgICAgIGNhcnJ5ID0gdCAvIEJBU0UgfCAwO1xyXG4gICAgfVxyXG5cclxuICAgIHJba10gPSAocltrXSArIGNhcnJ5KSAlIEJBU0UgfCAwO1xyXG4gIH1cclxuXHJcbiAgLy8gUmVtb3ZlIHRyYWlsaW5nIHplcm9zLlxyXG4gIGZvciAoOyAhclstLXJMXTspIHIucG9wKCk7XHJcblxyXG4gIGlmIChjYXJyeSkgKytlO1xyXG4gIGVsc2Ugci5zaGlmdCgpO1xyXG5cclxuICB5LmQgPSByO1xyXG4gIHkuZSA9IGdldEJhc2UxMEV4cG9uZW50KHIsIGUpO1xyXG5cclxuICByZXR1cm4gZXh0ZXJuYWwgPyBmaW5hbGlzZSh5LCBDdG9yLnByZWNpc2lvbiwgQ3Rvci5yb3VuZGluZykgOiB5O1xyXG59O1xyXG5cclxuXHJcbi8qXHJcbiAqIFJldHVybiBhIHN0cmluZyByZXByZXNlbnRpbmcgdGhlIHZhbHVlIG9mIHRoaXMgRGVjaW1hbCBpbiBiYXNlIDIsIHJvdW5kIHRvIGBzZGAgc2lnbmlmaWNhbnRcclxuICogZGlnaXRzIHVzaW5nIHJvdW5kaW5nIG1vZGUgYHJtYC5cclxuICpcclxuICogSWYgdGhlIG9wdGlvbmFsIGBzZGAgYXJndW1lbnQgaXMgcHJlc2VudCB0aGVuIHJldHVybiBiaW5hcnkgZXhwb25lbnRpYWwgbm90YXRpb24uXHJcbiAqXHJcbiAqIFtzZF0ge251bWJlcn0gU2lnbmlmaWNhbnQgZGlnaXRzLiBJbnRlZ2VyLCAxIHRvIE1BWF9ESUdJVFMgaW5jbHVzaXZlLlxyXG4gKiBbcm1dIHtudW1iZXJ9IFJvdW5kaW5nIG1vZGUuIEludGVnZXIsIDAgdG8gOCBpbmNsdXNpdmUuXHJcbiAqXHJcbiAqL1xyXG5QLnRvQmluYXJ5ID0gZnVuY3Rpb24gKHNkLCBybSkge1xyXG4gIHJldHVybiB0b1N0cmluZ0JpbmFyeSh0aGlzLCAyLCBzZCwgcm0pO1xyXG59O1xyXG5cclxuXHJcbi8qXHJcbiAqIFJldHVybiBhIG5ldyBEZWNpbWFsIHdob3NlIHZhbHVlIGlzIHRoZSB2YWx1ZSBvZiB0aGlzIERlY2ltYWwgcm91bmRlZCB0byBhIG1heGltdW0gb2YgYGRwYFxyXG4gKiBkZWNpbWFsIHBsYWNlcyB1c2luZyByb3VuZGluZyBtb2RlIGBybWAgb3IgYHJvdW5kaW5nYCBpZiBgcm1gIGlzIG9taXR0ZWQuXHJcbiAqXHJcbiAqIElmIGBkcGAgaXMgb21pdHRlZCwgcmV0dXJuIGEgbmV3IERlY2ltYWwgd2hvc2UgdmFsdWUgaXMgdGhlIHZhbHVlIG9mIHRoaXMgRGVjaW1hbC5cclxuICpcclxuICogW2RwXSB7bnVtYmVyfSBEZWNpbWFsIHBsYWNlcy4gSW50ZWdlciwgMCB0byBNQVhfRElHSVRTIGluY2x1c2l2ZS5cclxuICogW3JtXSB7bnVtYmVyfSBSb3VuZGluZyBtb2RlLiBJbnRlZ2VyLCAwIHRvIDggaW5jbHVzaXZlLlxyXG4gKlxyXG4gKi9cclxuUC50b0RlY2ltYWxQbGFjZXMgPSBQLnRvRFAgPSBmdW5jdGlvbiAoZHAsIHJtKSB7XHJcbiAgdmFyIHggPSB0aGlzLFxyXG4gICAgQ3RvciA9IHguY29uc3RydWN0b3I7XHJcblxyXG4gIHggPSBuZXcgQ3Rvcih4KTtcclxuICBpZiAoZHAgPT09IHZvaWQgMCkgcmV0dXJuIHg7XHJcblxyXG4gIGNoZWNrSW50MzIoZHAsIDAsIE1BWF9ESUdJVFMpO1xyXG5cclxuICBpZiAocm0gPT09IHZvaWQgMCkgcm0gPSBDdG9yLnJvdW5kaW5nO1xyXG4gIGVsc2UgY2hlY2tJbnQzMihybSwgMCwgOCk7XHJcblxyXG4gIHJldHVybiBmaW5hbGlzZSh4LCBkcCArIHguZSArIDEsIHJtKTtcclxufTtcclxuXHJcblxyXG4vKlxyXG4gKiBSZXR1cm4gYSBzdHJpbmcgcmVwcmVzZW50aW5nIHRoZSB2YWx1ZSBvZiB0aGlzIERlY2ltYWwgaW4gZXhwb25lbnRpYWwgbm90YXRpb24gcm91bmRlZCB0b1xyXG4gKiBgZHBgIGZpeGVkIGRlY2ltYWwgcGxhY2VzIHVzaW5nIHJvdW5kaW5nIG1vZGUgYHJvdW5kaW5nYC5cclxuICpcclxuICogW2RwXSB7bnVtYmVyfSBEZWNpbWFsIHBsYWNlcy4gSW50ZWdlciwgMCB0byBNQVhfRElHSVRTIGluY2x1c2l2ZS5cclxuICogW3JtXSB7bnVtYmVyfSBSb3VuZGluZyBtb2RlLiBJbnRlZ2VyLCAwIHRvIDggaW5jbHVzaXZlLlxyXG4gKlxyXG4gKi9cclxuUC50b0V4cG9uZW50aWFsID0gZnVuY3Rpb24gKGRwLCBybSkge1xyXG4gIHZhciBzdHIsXHJcbiAgICB4ID0gdGhpcyxcclxuICAgIEN0b3IgPSB4LmNvbnN0cnVjdG9yO1xyXG5cclxuICBpZiAoZHAgPT09IHZvaWQgMCkge1xyXG4gICAgc3RyID0gZmluaXRlVG9TdHJpbmcoeCwgdHJ1ZSk7XHJcbiAgfSBlbHNlIHtcclxuICAgIGNoZWNrSW50MzIoZHAsIDAsIE1BWF9ESUdJVFMpO1xyXG5cclxuICAgIGlmIChybSA9PT0gdm9pZCAwKSBybSA9IEN0b3Iucm91bmRpbmc7XHJcbiAgICBlbHNlIGNoZWNrSW50MzIocm0sIDAsIDgpO1xyXG5cclxuICAgIHggPSBmaW5hbGlzZShuZXcgQ3Rvcih4KSwgZHAgKyAxLCBybSk7XHJcbiAgICBzdHIgPSBmaW5pdGVUb1N0cmluZyh4LCB0cnVlLCBkcCArIDEpO1xyXG4gIH1cclxuXHJcbiAgcmV0dXJuIHguaXNOZWcoKSAmJiAheC5pc1plcm8oKSA/ICctJyArIHN0ciA6IHN0cjtcclxufTtcclxuXHJcblxyXG4vKlxyXG4gKiBSZXR1cm4gYSBzdHJpbmcgcmVwcmVzZW50aW5nIHRoZSB2YWx1ZSBvZiB0aGlzIERlY2ltYWwgaW4gbm9ybWFsIChmaXhlZC1wb2ludCkgbm90YXRpb24gdG9cclxuICogYGRwYCBmaXhlZCBkZWNpbWFsIHBsYWNlcyBhbmQgcm91bmRlZCB1c2luZyByb3VuZGluZyBtb2RlIGBybWAgb3IgYHJvdW5kaW5nYCBpZiBgcm1gIGlzXHJcbiAqIG9taXR0ZWQuXHJcbiAqXHJcbiAqIEFzIHdpdGggSmF2YVNjcmlwdCBudW1iZXJzLCAoLTApLnRvRml4ZWQoMCkgaXMgJzAnLCBidXQgZS5nLiAoLTAuMDAwMDEpLnRvRml4ZWQoMCkgaXMgJy0wJy5cclxuICpcclxuICogW2RwXSB7bnVtYmVyfSBEZWNpbWFsIHBsYWNlcy4gSW50ZWdlciwgMCB0byBNQVhfRElHSVRTIGluY2x1c2l2ZS5cclxuICogW3JtXSB7bnVtYmVyfSBSb3VuZGluZyBtb2RlLiBJbnRlZ2VyLCAwIHRvIDggaW5jbHVzaXZlLlxyXG4gKlxyXG4gKiAoLTApLnRvRml4ZWQoMCkgaXMgJzAnLCBidXQgKC0wLjEpLnRvRml4ZWQoMCkgaXMgJy0wJy5cclxuICogKC0wKS50b0ZpeGVkKDEpIGlzICcwLjAnLCBidXQgKC0wLjAxKS50b0ZpeGVkKDEpIGlzICctMC4wJy5cclxuICogKC0wKS50b0ZpeGVkKDMpIGlzICcwLjAwMCcuXHJcbiAqICgtMC41KS50b0ZpeGVkKDApIGlzICctMCcuXHJcbiAqXHJcbiAqL1xyXG5QLnRvRml4ZWQgPSBmdW5jdGlvbiAoZHAsIHJtKSB7XHJcbiAgdmFyIHN0ciwgeSxcclxuICAgIHggPSB0aGlzLFxyXG4gICAgQ3RvciA9IHguY29uc3RydWN0b3I7XHJcblxyXG4gIGlmIChkcCA9PT0gdm9pZCAwKSB7XHJcbiAgICBzdHIgPSBmaW5pdGVUb1N0cmluZyh4KTtcclxuICB9IGVsc2Uge1xyXG4gICAgY2hlY2tJbnQzMihkcCwgMCwgTUFYX0RJR0lUUyk7XHJcblxyXG4gICAgaWYgKHJtID09PSB2b2lkIDApIHJtID0gQ3Rvci5yb3VuZGluZztcclxuICAgIGVsc2UgY2hlY2tJbnQzMihybSwgMCwgOCk7XHJcblxyXG4gICAgeSA9IGZpbmFsaXNlKG5ldyBDdG9yKHgpLCBkcCArIHguZSArIDEsIHJtKTtcclxuICAgIHN0ciA9IGZpbml0ZVRvU3RyaW5nKHksIGZhbHNlLCBkcCArIHkuZSArIDEpO1xyXG4gIH1cclxuXHJcbiAgLy8gVG8gZGV0ZXJtaW5lIHdoZXRoZXIgdG8gYWRkIHRoZSBtaW51cyBzaWduIGxvb2sgYXQgdGhlIHZhbHVlIGJlZm9yZSBpdCB3YXMgcm91bmRlZCxcclxuICAvLyBpLmUuIGxvb2sgYXQgYHhgIHJhdGhlciB0aGFuIGB5YC5cclxuICByZXR1cm4geC5pc05lZygpICYmICF4LmlzWmVybygpID8gJy0nICsgc3RyIDogc3RyO1xyXG59O1xyXG5cclxuXHJcbi8qXHJcbiAqIFJldHVybiBhbiBhcnJheSByZXByZXNlbnRpbmcgdGhlIHZhbHVlIG9mIHRoaXMgRGVjaW1hbCBhcyBhIHNpbXBsZSBmcmFjdGlvbiB3aXRoIGFuIGludGVnZXJcclxuICogbnVtZXJhdG9yIGFuZCBhbiBpbnRlZ2VyIGRlbm9taW5hdG9yLlxyXG4gKlxyXG4gKiBUaGUgZGVub21pbmF0b3Igd2lsbCBiZSBhIHBvc2l0aXZlIG5vbi16ZXJvIHZhbHVlIGxlc3MgdGhhbiBvciBlcXVhbCB0byB0aGUgc3BlY2lmaWVkIG1heGltdW1cclxuICogZGVub21pbmF0b3IuIElmIGEgbWF4aW11bSBkZW5vbWluYXRvciBpcyBub3Qgc3BlY2lmaWVkLCB0aGUgZGVub21pbmF0b3Igd2lsbCBiZSB0aGUgbG93ZXN0XHJcbiAqIHZhbHVlIG5lY2Vzc2FyeSB0byByZXByZXNlbnQgdGhlIG51bWJlciBleGFjdGx5LlxyXG4gKlxyXG4gKiBbbWF4RF0ge251bWJlcnxzdHJpbmd8RGVjaW1hbH0gTWF4aW11bSBkZW5vbWluYXRvci4gSW50ZWdlciA+PSAxIGFuZCA8IEluZmluaXR5LlxyXG4gKlxyXG4gKi9cclxuUC50b0ZyYWN0aW9uID0gZnVuY3Rpb24gKG1heEQpIHtcclxuICB2YXIgZCwgZDAsIGQxLCBkMiwgZSwgaywgbiwgbjAsIG4xLCBwciwgcSwgcixcclxuICAgIHggPSB0aGlzLFxyXG4gICAgeGQgPSB4LmQsXHJcbiAgICBDdG9yID0geC5jb25zdHJ1Y3RvcjtcclxuXHJcbiAgaWYgKCF4ZCkgcmV0dXJuIG5ldyBDdG9yKHgpO1xyXG5cclxuICBuMSA9IGQwID0gbmV3IEN0b3IoMSk7XHJcbiAgZDEgPSBuMCA9IG5ldyBDdG9yKDApO1xyXG5cclxuICBkID0gbmV3IEN0b3IoZDEpO1xyXG4gIGUgPSBkLmUgPSBnZXRQcmVjaXNpb24oeGQpIC0geC5lIC0gMTtcclxuICBrID0gZSAlIExPR19CQVNFO1xyXG4gIGQuZFswXSA9IG1hdGhwb3coMTAsIGsgPCAwID8gTE9HX0JBU0UgKyBrIDogayk7XHJcblxyXG4gIGlmIChtYXhEID09IG51bGwpIHtcclxuXHJcbiAgICAvLyBkIGlzIDEwKiplLCB0aGUgbWluaW11bSBtYXgtZGVub21pbmF0b3IgbmVlZGVkLlxyXG4gICAgbWF4RCA9IGUgPiAwID8gZCA6IG4xO1xyXG4gIH0gZWxzZSB7XHJcbiAgICBuID0gbmV3IEN0b3IobWF4RCk7XHJcbiAgICBpZiAoIW4uaXNJbnQoKSB8fCBuLmx0KG4xKSkgdGhyb3cgRXJyb3IoaW52YWxpZEFyZ3VtZW50ICsgbik7XHJcbiAgICBtYXhEID0gbi5ndChkKSA/IChlID4gMCA/IGQgOiBuMSkgOiBuO1xyXG4gIH1cclxuXHJcbiAgZXh0ZXJuYWwgPSBmYWxzZTtcclxuICBuID0gbmV3IEN0b3IoZGlnaXRzVG9TdHJpbmcoeGQpKTtcclxuICBwciA9IEN0b3IucHJlY2lzaW9uO1xyXG4gIEN0b3IucHJlY2lzaW9uID0gZSA9IHhkLmxlbmd0aCAqIExPR19CQVNFICogMjtcclxuXHJcbiAgZm9yICg7OykgIHtcclxuICAgIHEgPSBkaXZpZGUobiwgZCwgMCwgMSwgMSk7XHJcbiAgICBkMiA9IGQwLnBsdXMocS50aW1lcyhkMSkpO1xyXG4gICAgaWYgKGQyLmNtcChtYXhEKSA9PSAxKSBicmVhaztcclxuICAgIGQwID0gZDE7XHJcbiAgICBkMSA9IGQyO1xyXG4gICAgZDIgPSBuMTtcclxuICAgIG4xID0gbjAucGx1cyhxLnRpbWVzKGQyKSk7XHJcbiAgICBuMCA9IGQyO1xyXG4gICAgZDIgPSBkO1xyXG4gICAgZCA9IG4ubWludXMocS50aW1lcyhkMikpO1xyXG4gICAgbiA9IGQyO1xyXG4gIH1cclxuXHJcbiAgZDIgPSBkaXZpZGUobWF4RC5taW51cyhkMCksIGQxLCAwLCAxLCAxKTtcclxuICBuMCA9IG4wLnBsdXMoZDIudGltZXMobjEpKTtcclxuICBkMCA9IGQwLnBsdXMoZDIudGltZXMoZDEpKTtcclxuICBuMC5zID0gbjEucyA9IHgucztcclxuXHJcbiAgLy8gRGV0ZXJtaW5lIHdoaWNoIGZyYWN0aW9uIGlzIGNsb3NlciB0byB4LCBuMC9kMCBvciBuMS9kMT9cclxuICByID0gZGl2aWRlKG4xLCBkMSwgZSwgMSkubWludXMoeCkuYWJzKCkuY21wKGRpdmlkZShuMCwgZDAsIGUsIDEpLm1pbnVzKHgpLmFicygpKSA8IDFcclxuICAgICAgPyBbbjEsIGQxXSA6IFtuMCwgZDBdO1xyXG5cclxuICBDdG9yLnByZWNpc2lvbiA9IHByO1xyXG4gIGV4dGVybmFsID0gdHJ1ZTtcclxuXHJcbiAgcmV0dXJuIHI7XHJcbn07XHJcblxyXG5cclxuLypcclxuICogUmV0dXJuIGEgc3RyaW5nIHJlcHJlc2VudGluZyB0aGUgdmFsdWUgb2YgdGhpcyBEZWNpbWFsIGluIGJhc2UgMTYsIHJvdW5kIHRvIGBzZGAgc2lnbmlmaWNhbnRcclxuICogZGlnaXRzIHVzaW5nIHJvdW5kaW5nIG1vZGUgYHJtYC5cclxuICpcclxuICogSWYgdGhlIG9wdGlvbmFsIGBzZGAgYXJndW1lbnQgaXMgcHJlc2VudCB0aGVuIHJldHVybiBiaW5hcnkgZXhwb25lbnRpYWwgbm90YXRpb24uXHJcbiAqXHJcbiAqIFtzZF0ge251bWJlcn0gU2lnbmlmaWNhbnQgZGlnaXRzLiBJbnRlZ2VyLCAxIHRvIE1BWF9ESUdJVFMgaW5jbHVzaXZlLlxyXG4gKiBbcm1dIHtudW1iZXJ9IFJvdW5kaW5nIG1vZGUuIEludGVnZXIsIDAgdG8gOCBpbmNsdXNpdmUuXHJcbiAqXHJcbiAqL1xyXG5QLnRvSGV4YWRlY2ltYWwgPSBQLnRvSGV4ID0gZnVuY3Rpb24gKHNkLCBybSkge1xyXG4gIHJldHVybiB0b1N0cmluZ0JpbmFyeSh0aGlzLCAxNiwgc2QsIHJtKTtcclxufTtcclxuXHJcblxyXG4vKlxyXG4gKiBSZXR1cm5zIGEgbmV3IERlY2ltYWwgd2hvc2UgdmFsdWUgaXMgdGhlIG5lYXJlc3QgbXVsdGlwbGUgb2YgYHlgIGluIHRoZSBkaXJlY3Rpb24gb2Ygcm91bmRpbmdcclxuICogbW9kZSBgcm1gLCBvciBgRGVjaW1hbC5yb3VuZGluZ2AgaWYgYHJtYCBpcyBvbWl0dGVkLCB0byB0aGUgdmFsdWUgb2YgdGhpcyBEZWNpbWFsLlxyXG4gKlxyXG4gKiBUaGUgcmV0dXJuIHZhbHVlIHdpbGwgYWx3YXlzIGhhdmUgdGhlIHNhbWUgc2lnbiBhcyB0aGlzIERlY2ltYWwsIHVubGVzcyBlaXRoZXIgdGhpcyBEZWNpbWFsXHJcbiAqIG9yIGB5YCBpcyBOYU4sIGluIHdoaWNoIGNhc2UgdGhlIHJldHVybiB2YWx1ZSB3aWxsIGJlIGFsc28gYmUgTmFOLlxyXG4gKlxyXG4gKiBUaGUgcmV0dXJuIHZhbHVlIGlzIG5vdCBhZmZlY3RlZCBieSB0aGUgdmFsdWUgb2YgYHByZWNpc2lvbmAuXHJcbiAqXHJcbiAqIHkge251bWJlcnxzdHJpbmd8RGVjaW1hbH0gVGhlIG1hZ25pdHVkZSB0byByb3VuZCB0byBhIG11bHRpcGxlIG9mLlxyXG4gKiBbcm1dIHtudW1iZXJ9IFJvdW5kaW5nIG1vZGUuIEludGVnZXIsIDAgdG8gOCBpbmNsdXNpdmUuXHJcbiAqXHJcbiAqICd0b05lYXJlc3QoKSByb3VuZGluZyBtb2RlIG5vdCBhbiBpbnRlZ2VyOiB7cm19J1xyXG4gKiAndG9OZWFyZXN0KCkgcm91bmRpbmcgbW9kZSBvdXQgb2YgcmFuZ2U6IHtybX0nXHJcbiAqXHJcbiAqL1xyXG5QLnRvTmVhcmVzdCA9IGZ1bmN0aW9uICh5LCBybSkge1xyXG4gIHZhciB4ID0gdGhpcyxcclxuICAgIEN0b3IgPSB4LmNvbnN0cnVjdG9yO1xyXG5cclxuICB4ID0gbmV3IEN0b3IoeCk7XHJcblxyXG4gIGlmICh5ID09IG51bGwpIHtcclxuXHJcbiAgICAvLyBJZiB4IGlzIG5vdCBmaW5pdGUsIHJldHVybiB4LlxyXG4gICAgaWYgKCF4LmQpIHJldHVybiB4O1xyXG5cclxuICAgIHkgPSBuZXcgQ3RvcigxKTtcclxuICAgIHJtID0gQ3Rvci5yb3VuZGluZztcclxuICB9IGVsc2Uge1xyXG4gICAgeSA9IG5ldyBDdG9yKHkpO1xyXG4gICAgaWYgKHJtID09PSB2b2lkIDApIHtcclxuICAgICAgcm0gPSBDdG9yLnJvdW5kaW5nO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgY2hlY2tJbnQzMihybSwgMCwgOCk7XHJcbiAgICB9XHJcblxyXG4gICAgLy8gSWYgeCBpcyBub3QgZmluaXRlLCByZXR1cm4geCBpZiB5IGlzIG5vdCBOYU4sIGVsc2UgTmFOLlxyXG4gICAgaWYgKCF4LmQpIHJldHVybiB5LnMgPyB4IDogeTtcclxuXHJcbiAgICAvLyBJZiB5IGlzIG5vdCBmaW5pdGUsIHJldHVybiBJbmZpbml0eSB3aXRoIHRoZSBzaWduIG9mIHggaWYgeSBpcyBJbmZpbml0eSwgZWxzZSBOYU4uXHJcbiAgICBpZiAoIXkuZCkge1xyXG4gICAgICBpZiAoeS5zKSB5LnMgPSB4LnM7XHJcbiAgICAgIHJldHVybiB5O1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgLy8gSWYgeSBpcyBub3QgemVybywgY2FsY3VsYXRlIHRoZSBuZWFyZXN0IG11bHRpcGxlIG9mIHkgdG8geC5cclxuICBpZiAoeS5kWzBdKSB7XHJcbiAgICBleHRlcm5hbCA9IGZhbHNlO1xyXG4gICAgeCA9IGRpdmlkZSh4LCB5LCAwLCBybSwgMSkudGltZXMoeSk7XHJcbiAgICBleHRlcm5hbCA9IHRydWU7XHJcbiAgICBmaW5hbGlzZSh4KTtcclxuXHJcbiAgLy8gSWYgeSBpcyB6ZXJvLCByZXR1cm4gemVybyB3aXRoIHRoZSBzaWduIG9mIHguXHJcbiAgfSBlbHNlIHtcclxuICAgIHkucyA9IHgucztcclxuICAgIHggPSB5O1xyXG4gIH1cclxuXHJcbiAgcmV0dXJuIHg7XHJcbn07XHJcblxyXG5cclxuLypcclxuICogUmV0dXJuIHRoZSB2YWx1ZSBvZiB0aGlzIERlY2ltYWwgY29udmVydGVkIHRvIGEgbnVtYmVyIHByaW1pdGl2ZS5cclxuICogWmVybyBrZWVwcyBpdHMgc2lnbi5cclxuICpcclxuICovXHJcblAudG9OdW1iZXIgPSBmdW5jdGlvbiAoKSB7XHJcbiAgcmV0dXJuICt0aGlzO1xyXG59O1xyXG5cclxuXHJcbi8qXHJcbiAqIFJldHVybiBhIHN0cmluZyByZXByZXNlbnRpbmcgdGhlIHZhbHVlIG9mIHRoaXMgRGVjaW1hbCBpbiBiYXNlIDgsIHJvdW5kIHRvIGBzZGAgc2lnbmlmaWNhbnRcclxuICogZGlnaXRzIHVzaW5nIHJvdW5kaW5nIG1vZGUgYHJtYC5cclxuICpcclxuICogSWYgdGhlIG9wdGlvbmFsIGBzZGAgYXJndW1lbnQgaXMgcHJlc2VudCB0aGVuIHJldHVybiBiaW5hcnkgZXhwb25lbnRpYWwgbm90YXRpb24uXHJcbiAqXHJcbiAqIFtzZF0ge251bWJlcn0gU2lnbmlmaWNhbnQgZGlnaXRzLiBJbnRlZ2VyLCAxIHRvIE1BWF9ESUdJVFMgaW5jbHVzaXZlLlxyXG4gKiBbcm1dIHtudW1iZXJ9IFJvdW5kaW5nIG1vZGUuIEludGVnZXIsIDAgdG8gOCBpbmNsdXNpdmUuXHJcbiAqXHJcbiAqL1xyXG5QLnRvT2N0YWwgPSBmdW5jdGlvbiAoc2QsIHJtKSB7XHJcbiAgcmV0dXJuIHRvU3RyaW5nQmluYXJ5KHRoaXMsIDgsIHNkLCBybSk7XHJcbn07XHJcblxyXG5cclxuLypcclxuICogUmV0dXJuIGEgbmV3IERlY2ltYWwgd2hvc2UgdmFsdWUgaXMgdGhlIHZhbHVlIG9mIHRoaXMgRGVjaW1hbCByYWlzZWQgdG8gdGhlIHBvd2VyIGB5YCwgcm91bmRlZFxyXG4gKiB0byBgcHJlY2lzaW9uYCBzaWduaWZpY2FudCBkaWdpdHMgdXNpbmcgcm91bmRpbmcgbW9kZSBgcm91bmRpbmdgLlxyXG4gKlxyXG4gKiBFQ01BU2NyaXB0IGNvbXBsaWFudC5cclxuICpcclxuICogICBwb3coeCwgTmFOKSAgICAgICAgICAgICAgICAgICAgICAgICAgID0gTmFOXHJcbiAqICAgcG93KHgsIFx1MDBCMTApICAgICAgICAgICAgICAgICAgICAgICAgICAgID0gMVxyXG5cclxuICogICBwb3coTmFOLCBub24temVybykgICAgICAgICAgICAgICAgICAgID0gTmFOXHJcbiAqICAgcG93KGFicyh4KSA+IDEsICtJbmZpbml0eSkgICAgICAgICAgICA9ICtJbmZpbml0eVxyXG4gKiAgIHBvdyhhYnMoeCkgPiAxLCAtSW5maW5pdHkpICAgICAgICAgICAgPSArMFxyXG4gKiAgIHBvdyhhYnMoeCkgPT0gMSwgXHUwMEIxSW5maW5pdHkpICAgICAgICAgICA9IE5hTlxyXG4gKiAgIHBvdyhhYnMoeCkgPCAxLCArSW5maW5pdHkpICAgICAgICAgICAgPSArMFxyXG4gKiAgIHBvdyhhYnMoeCkgPCAxLCAtSW5maW5pdHkpICAgICAgICAgICAgPSArSW5maW5pdHlcclxuICogICBwb3coK0luZmluaXR5LCB5ID4gMCkgICAgICAgICAgICAgICAgID0gK0luZmluaXR5XHJcbiAqICAgcG93KCtJbmZpbml0eSwgeSA8IDApICAgICAgICAgICAgICAgICA9ICswXHJcbiAqICAgcG93KC1JbmZpbml0eSwgb2RkIGludGVnZXIgPiAwKSAgICAgICA9IC1JbmZpbml0eVxyXG4gKiAgIHBvdygtSW5maW5pdHksIGV2ZW4gaW50ZWdlciA+IDApICAgICAgPSArSW5maW5pdHlcclxuICogICBwb3coLUluZmluaXR5LCBvZGQgaW50ZWdlciA8IDApICAgICAgID0gLTBcclxuICogICBwb3coLUluZmluaXR5LCBldmVuIGludGVnZXIgPCAwKSAgICAgID0gKzBcclxuICogICBwb3coKzAsIHkgPiAwKSAgICAgICAgICAgICAgICAgICAgICAgID0gKzBcclxuICogICBwb3coKzAsIHkgPCAwKSAgICAgICAgICAgICAgICAgICAgICAgID0gK0luZmluaXR5XHJcbiAqICAgcG93KC0wLCBvZGQgaW50ZWdlciA+IDApICAgICAgICAgICAgICA9IC0wXHJcbiAqICAgcG93KC0wLCBldmVuIGludGVnZXIgPiAwKSAgICAgICAgICAgICA9ICswXHJcbiAqICAgcG93KC0wLCBvZGQgaW50ZWdlciA8IDApICAgICAgICAgICAgICA9IC1JbmZpbml0eVxyXG4gKiAgIHBvdygtMCwgZXZlbiBpbnRlZ2VyIDwgMCkgICAgICAgICAgICAgPSArSW5maW5pdHlcclxuICogICBwb3coZmluaXRlIHggPCAwLCBmaW5pdGUgbm9uLWludGVnZXIpID0gTmFOXHJcbiAqXHJcbiAqIEZvciBub24taW50ZWdlciBvciB2ZXJ5IGxhcmdlIGV4cG9uZW50cyBwb3coeCwgeSkgaXMgY2FsY3VsYXRlZCB1c2luZ1xyXG4gKlxyXG4gKiAgIHheeSA9IGV4cCh5KmxuKHgpKVxyXG4gKlxyXG4gKiBBc3N1bWluZyB0aGUgZmlyc3QgMTUgcm91bmRpbmcgZGlnaXRzIGFyZSBlYWNoIGVxdWFsbHkgbGlrZWx5IHRvIGJlIGFueSBkaWdpdCAwLTksIHRoZVxyXG4gKiBwcm9iYWJpbGl0eSBvZiBhbiBpbmNvcnJlY3RseSByb3VuZGVkIHJlc3VsdFxyXG4gKiBQKFs0OV05ezE0fSB8IFs1MF0wezE0fSkgPSAyICogMC4yICogMTBeLTE0ID0gNGUtMTUgPSAxLzIuNWUrMTRcclxuICogaS5lLiAxIGluIDI1MCwwMDAsMDAwLDAwMCwwMDBcclxuICpcclxuICogSWYgYSByZXN1bHQgaXMgaW5jb3JyZWN0bHkgcm91bmRlZCB0aGUgbWF4aW11bSBlcnJvciB3aWxsIGJlIDEgdWxwICh1bml0IGluIGxhc3QgcGxhY2UpLlxyXG4gKlxyXG4gKiB5IHtudW1iZXJ8c3RyaW5nfERlY2ltYWx9IFRoZSBwb3dlciB0byB3aGljaCB0byByYWlzZSB0aGlzIERlY2ltYWwuXHJcbiAqXHJcbiAqL1xyXG5QLnRvUG93ZXIgPSBQLnBvdyA9IGZ1bmN0aW9uICh5KSB7XHJcbiAgdmFyIGUsIGssIHByLCByLCBybSwgcyxcclxuICAgIHggPSB0aGlzLFxyXG4gICAgQ3RvciA9IHguY29uc3RydWN0b3IsXHJcbiAgICB5biA9ICsoeSA9IG5ldyBDdG9yKHkpKTtcclxuXHJcbiAgLy8gRWl0aGVyIFx1MDBCMUluZmluaXR5LCBOYU4gb3IgXHUwMEIxMD9cclxuICBpZiAoIXguZCB8fCAheS5kIHx8ICF4LmRbMF0gfHwgIXkuZFswXSkgcmV0dXJuIG5ldyBDdG9yKG1hdGhwb3coK3gsIHluKSk7XHJcblxyXG4gIHggPSBuZXcgQ3Rvcih4KTtcclxuXHJcbiAgaWYgKHguZXEoMSkpIHJldHVybiB4O1xyXG5cclxuICBwciA9IEN0b3IucHJlY2lzaW9uO1xyXG4gIHJtID0gQ3Rvci5yb3VuZGluZztcclxuXHJcbiAgaWYgKHkuZXEoMSkpIHJldHVybiBmaW5hbGlzZSh4LCBwciwgcm0pO1xyXG5cclxuICAvLyB5IGV4cG9uZW50XHJcbiAgZSA9IG1hdGhmbG9vcih5LmUgLyBMT0dfQkFTRSk7XHJcblxyXG4gIC8vIElmIHkgaXMgYSBzbWFsbCBpbnRlZ2VyIHVzZSB0aGUgJ2V4cG9uZW50aWF0aW9uIGJ5IHNxdWFyaW5nJyBhbGdvcml0aG0uXHJcbiAgaWYgKGUgPj0geS5kLmxlbmd0aCAtIDEgJiYgKGsgPSB5biA8IDAgPyAteW4gOiB5bikgPD0gTUFYX1NBRkVfSU5URUdFUikge1xyXG4gICAgciA9IGludFBvdyhDdG9yLCB4LCBrLCBwcik7XHJcbiAgICByZXR1cm4geS5zIDwgMCA/IG5ldyBDdG9yKDEpLmRpdihyKSA6IGZpbmFsaXNlKHIsIHByLCBybSk7XHJcbiAgfVxyXG5cclxuICBzID0geC5zO1xyXG5cclxuICAvLyBpZiB4IGlzIG5lZ2F0aXZlXHJcbiAgaWYgKHMgPCAwKSB7XHJcblxyXG4gICAgLy8gaWYgeSBpcyBub3QgYW4gaW50ZWdlclxyXG4gICAgaWYgKGUgPCB5LmQubGVuZ3RoIC0gMSkgcmV0dXJuIG5ldyBDdG9yKE5hTik7XHJcblxyXG4gICAgLy8gUmVzdWx0IGlzIHBvc2l0aXZlIGlmIHggaXMgbmVnYXRpdmUgYW5kIHRoZSBsYXN0IGRpZ2l0IG9mIGludGVnZXIgeSBpcyBldmVuLlxyXG4gICAgaWYgKCh5LmRbZV0gJiAxKSA9PSAwKSBzID0gMTtcclxuXHJcbiAgICAvLyBpZiB4LmVxKC0xKVxyXG4gICAgaWYgKHguZSA9PSAwICYmIHguZFswXSA9PSAxICYmIHguZC5sZW5ndGggPT0gMSkge1xyXG4gICAgICB4LnMgPSBzO1xyXG4gICAgICByZXR1cm4geDtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIC8vIEVzdGltYXRlIHJlc3VsdCBleHBvbmVudC5cclxuICAvLyB4XnkgPSAxMF5lLCAgd2hlcmUgZSA9IHkgKiBsb2cxMCh4KVxyXG4gIC8vIGxvZzEwKHgpID0gbG9nMTAoeF9zaWduaWZpY2FuZCkgKyB4X2V4cG9uZW50XHJcbiAgLy8gbG9nMTAoeF9zaWduaWZpY2FuZCkgPSBsbih4X3NpZ25pZmljYW5kKSAvIGxuKDEwKVxyXG4gIGsgPSBtYXRocG93KCt4LCB5bik7XHJcbiAgZSA9IGsgPT0gMCB8fCAhaXNGaW5pdGUoaylcclxuICAgID8gbWF0aGZsb29yKHluICogKE1hdGgubG9nKCcwLicgKyBkaWdpdHNUb1N0cmluZyh4LmQpKSAvIE1hdGguTE4xMCArIHguZSArIDEpKVxyXG4gICAgOiBuZXcgQ3RvcihrICsgJycpLmU7XHJcblxyXG4gIC8vIEV4cG9uZW50IGVzdGltYXRlIG1heSBiZSBpbmNvcnJlY3QgZS5nLiB4OiAwLjk5OTk5OTk5OTk5OTk5OTk5OSwgeTogMi4yOSwgZTogMCwgci5lOiAtMS5cclxuXHJcbiAgLy8gT3ZlcmZsb3cvdW5kZXJmbG93P1xyXG4gIGlmIChlID4gQ3Rvci5tYXhFICsgMSB8fCBlIDwgQ3Rvci5taW5FIC0gMSkgcmV0dXJuIG5ldyBDdG9yKGUgPiAwID8gcyAvIDAgOiAwKTtcclxuXHJcbiAgZXh0ZXJuYWwgPSBmYWxzZTtcclxuICBDdG9yLnJvdW5kaW5nID0geC5zID0gMTtcclxuXHJcbiAgLy8gRXN0aW1hdGUgdGhlIGV4dHJhIGd1YXJkIGRpZ2l0cyBuZWVkZWQgdG8gZW5zdXJlIGZpdmUgY29ycmVjdCByb3VuZGluZyBkaWdpdHMgZnJvbVxyXG4gIC8vIG5hdHVyYWxMb2dhcml0aG0oeCkuIEV4YW1wbGUgb2YgZmFpbHVyZSB3aXRob3V0IHRoZXNlIGV4dHJhIGRpZ2l0cyAocHJlY2lzaW9uOiAxMCk6XHJcbiAgLy8gbmV3IERlY2ltYWwoMi4zMjQ1NikucG93KCcyMDg3OTg3NDM2NTM0NTY2LjQ2NDExJylcclxuICAvLyBzaG91bGQgYmUgMS4xNjIzNzc4MjNlKzc2NDkxNDkwNTE3MzgxNSwgYnV0IGlzIDEuMTYyMzU1ODIzZSs3NjQ5MTQ5MDUxNzM4MTVcclxuICBrID0gTWF0aC5taW4oMTIsIChlICsgJycpLmxlbmd0aCk7XHJcblxyXG4gIC8vIHIgPSB4XnkgPSBleHAoeSpsbih4KSlcclxuICByID0gbmF0dXJhbEV4cG9uZW50aWFsKHkudGltZXMobmF0dXJhbExvZ2FyaXRobSh4LCBwciArIGspKSwgcHIpO1xyXG5cclxuICAvLyByIG1heSBiZSBJbmZpbml0eSwgZS5nLiAoMC45OTk5OTk5OTk5OTk5OTk5KS5wb3coLTFlKzQwKVxyXG4gIGlmIChyLmQpIHtcclxuXHJcbiAgICAvLyBUcnVuY2F0ZSB0byB0aGUgcmVxdWlyZWQgcHJlY2lzaW9uIHBsdXMgZml2ZSByb3VuZGluZyBkaWdpdHMuXHJcbiAgICByID0gZmluYWxpc2UociwgcHIgKyA1LCAxKTtcclxuXHJcbiAgICAvLyBJZiB0aGUgcm91bmRpbmcgZGlnaXRzIGFyZSBbNDldOTk5OSBvciBbNTBdMDAwMCBpbmNyZWFzZSB0aGUgcHJlY2lzaW9uIGJ5IDEwIGFuZCByZWNhbGN1bGF0ZVxyXG4gICAgLy8gdGhlIHJlc3VsdC5cclxuICAgIGlmIChjaGVja1JvdW5kaW5nRGlnaXRzKHIuZCwgcHIsIHJtKSkge1xyXG4gICAgICBlID0gcHIgKyAxMDtcclxuXHJcbiAgICAgIC8vIFRydW5jYXRlIHRvIHRoZSBpbmNyZWFzZWQgcHJlY2lzaW9uIHBsdXMgZml2ZSByb3VuZGluZyBkaWdpdHMuXHJcbiAgICAgIHIgPSBmaW5hbGlzZShuYXR1cmFsRXhwb25lbnRpYWwoeS50aW1lcyhuYXR1cmFsTG9nYXJpdGhtKHgsIGUgKyBrKSksIGUpLCBlICsgNSwgMSk7XHJcblxyXG4gICAgICAvLyBDaGVjayBmb3IgMTQgbmluZXMgZnJvbSB0aGUgMm5kIHJvdW5kaW5nIGRpZ2l0ICh0aGUgZmlyc3Qgcm91bmRpbmcgZGlnaXQgbWF5IGJlIDQgb3IgOSkuXHJcbiAgICAgIGlmICgrZGlnaXRzVG9TdHJpbmcoci5kKS5zbGljZShwciArIDEsIHByICsgMTUpICsgMSA9PSAxZTE0KSB7XHJcbiAgICAgICAgciA9IGZpbmFsaXNlKHIsIHByICsgMSwgMCk7XHJcbiAgICAgIH1cclxuICAgIH1cclxuICB9XHJcblxyXG4gIHIucyA9IHM7XHJcbiAgZXh0ZXJuYWwgPSB0cnVlO1xyXG4gIEN0b3Iucm91bmRpbmcgPSBybTtcclxuXHJcbiAgcmV0dXJuIGZpbmFsaXNlKHIsIHByLCBybSk7XHJcbn07XHJcblxyXG5cclxuLypcclxuICogUmV0dXJuIGEgc3RyaW5nIHJlcHJlc2VudGluZyB0aGUgdmFsdWUgb2YgdGhpcyBEZWNpbWFsIHJvdW5kZWQgdG8gYHNkYCBzaWduaWZpY2FudCBkaWdpdHNcclxuICogdXNpbmcgcm91bmRpbmcgbW9kZSBgcm91bmRpbmdgLlxyXG4gKlxyXG4gKiBSZXR1cm4gZXhwb25lbnRpYWwgbm90YXRpb24gaWYgYHNkYCBpcyBsZXNzIHRoYW4gdGhlIG51bWJlciBvZiBkaWdpdHMgbmVjZXNzYXJ5IHRvIHJlcHJlc2VudFxyXG4gKiB0aGUgaW50ZWdlciBwYXJ0IG9mIHRoZSB2YWx1ZSBpbiBub3JtYWwgbm90YXRpb24uXHJcbiAqXHJcbiAqIFtzZF0ge251bWJlcn0gU2lnbmlmaWNhbnQgZGlnaXRzLiBJbnRlZ2VyLCAxIHRvIE1BWF9ESUdJVFMgaW5jbHVzaXZlLlxyXG4gKiBbcm1dIHtudW1iZXJ9IFJvdW5kaW5nIG1vZGUuIEludGVnZXIsIDAgdG8gOCBpbmNsdXNpdmUuXHJcbiAqXHJcbiAqL1xyXG5QLnRvUHJlY2lzaW9uID0gZnVuY3Rpb24gKHNkLCBybSkge1xyXG4gIHZhciBzdHIsXHJcbiAgICB4ID0gdGhpcyxcclxuICAgIEN0b3IgPSB4LmNvbnN0cnVjdG9yO1xyXG5cclxuICBpZiAoc2QgPT09IHZvaWQgMCkge1xyXG4gICAgc3RyID0gZmluaXRlVG9TdHJpbmcoeCwgeC5lIDw9IEN0b3IudG9FeHBOZWcgfHwgeC5lID49IEN0b3IudG9FeHBQb3MpO1xyXG4gIH0gZWxzZSB7XHJcbiAgICBjaGVja0ludDMyKHNkLCAxLCBNQVhfRElHSVRTKTtcclxuXHJcbiAgICBpZiAocm0gPT09IHZvaWQgMCkgcm0gPSBDdG9yLnJvdW5kaW5nO1xyXG4gICAgZWxzZSBjaGVja0ludDMyKHJtLCAwLCA4KTtcclxuXHJcbiAgICB4ID0gZmluYWxpc2UobmV3IEN0b3IoeCksIHNkLCBybSk7XHJcbiAgICBzdHIgPSBmaW5pdGVUb1N0cmluZyh4LCBzZCA8PSB4LmUgfHwgeC5lIDw9IEN0b3IudG9FeHBOZWcsIHNkKTtcclxuICB9XHJcblxyXG4gIHJldHVybiB4LmlzTmVnKCkgJiYgIXguaXNaZXJvKCkgPyAnLScgKyBzdHIgOiBzdHI7XHJcbn07XHJcblxyXG5cclxuLypcclxuICogUmV0dXJuIGEgbmV3IERlY2ltYWwgd2hvc2UgdmFsdWUgaXMgdGhlIHZhbHVlIG9mIHRoaXMgRGVjaW1hbCByb3VuZGVkIHRvIGEgbWF4aW11bSBvZiBgc2RgXHJcbiAqIHNpZ25pZmljYW50IGRpZ2l0cyB1c2luZyByb3VuZGluZyBtb2RlIGBybWAsIG9yIHRvIGBwcmVjaXNpb25gIGFuZCBgcm91bmRpbmdgIHJlc3BlY3RpdmVseSBpZlxyXG4gKiBvbWl0dGVkLlxyXG4gKlxyXG4gKiBbc2RdIHtudW1iZXJ9IFNpZ25pZmljYW50IGRpZ2l0cy4gSW50ZWdlciwgMSB0byBNQVhfRElHSVRTIGluY2x1c2l2ZS5cclxuICogW3JtXSB7bnVtYmVyfSBSb3VuZGluZyBtb2RlLiBJbnRlZ2VyLCAwIHRvIDggaW5jbHVzaXZlLlxyXG4gKlxyXG4gKiAndG9TRCgpIGRpZ2l0cyBvdXQgb2YgcmFuZ2U6IHtzZH0nXHJcbiAqICd0b1NEKCkgZGlnaXRzIG5vdCBhbiBpbnRlZ2VyOiB7c2R9J1xyXG4gKiAndG9TRCgpIHJvdW5kaW5nIG1vZGUgbm90IGFuIGludGVnZXI6IHtybX0nXHJcbiAqICd0b1NEKCkgcm91bmRpbmcgbW9kZSBvdXQgb2YgcmFuZ2U6IHtybX0nXHJcbiAqXHJcbiAqL1xyXG5QLnRvU2lnbmlmaWNhbnREaWdpdHMgPSBQLnRvU0QgPSBmdW5jdGlvbiAoc2QsIHJtKSB7XHJcbiAgdmFyIHggPSB0aGlzLFxyXG4gICAgQ3RvciA9IHguY29uc3RydWN0b3I7XHJcblxyXG4gIGlmIChzZCA9PT0gdm9pZCAwKSB7XHJcbiAgICBzZCA9IEN0b3IucHJlY2lzaW9uO1xyXG4gICAgcm0gPSBDdG9yLnJvdW5kaW5nO1xyXG4gIH0gZWxzZSB7XHJcbiAgICBjaGVja0ludDMyKHNkLCAxLCBNQVhfRElHSVRTKTtcclxuXHJcbiAgICBpZiAocm0gPT09IHZvaWQgMCkgcm0gPSBDdG9yLnJvdW5kaW5nO1xyXG4gICAgZWxzZSBjaGVja0ludDMyKHJtLCAwLCA4KTtcclxuICB9XHJcblxyXG4gIHJldHVybiBmaW5hbGlzZShuZXcgQ3Rvcih4KSwgc2QsIHJtKTtcclxufTtcclxuXHJcblxyXG4vKlxyXG4gKiBSZXR1cm4gYSBzdHJpbmcgcmVwcmVzZW50aW5nIHRoZSB2YWx1ZSBvZiB0aGlzIERlY2ltYWwuXHJcbiAqXHJcbiAqIFJldHVybiBleHBvbmVudGlhbCBub3RhdGlvbiBpZiB0aGlzIERlY2ltYWwgaGFzIGEgcG9zaXRpdmUgZXhwb25lbnQgZXF1YWwgdG8gb3IgZ3JlYXRlciB0aGFuXHJcbiAqIGB0b0V4cFBvc2AsIG9yIGEgbmVnYXRpdmUgZXhwb25lbnQgZXF1YWwgdG8gb3IgbGVzcyB0aGFuIGB0b0V4cE5lZ2AuXHJcbiAqXHJcbiAqL1xyXG5QLnRvU3RyaW5nID0gZnVuY3Rpb24gKCkge1xyXG4gIHZhciB4ID0gdGhpcyxcclxuICAgIEN0b3IgPSB4LmNvbnN0cnVjdG9yLFxyXG4gICAgc3RyID0gZmluaXRlVG9TdHJpbmcoeCwgeC5lIDw9IEN0b3IudG9FeHBOZWcgfHwgeC5lID49IEN0b3IudG9FeHBQb3MpO1xyXG5cclxuICByZXR1cm4geC5pc05lZygpICYmICF4LmlzWmVybygpID8gJy0nICsgc3RyIDogc3RyO1xyXG59O1xyXG5cclxuXHJcbi8qXHJcbiAqIFJldHVybiBhIG5ldyBEZWNpbWFsIHdob3NlIHZhbHVlIGlzIHRoZSB2YWx1ZSBvZiB0aGlzIERlY2ltYWwgdHJ1bmNhdGVkIHRvIGEgd2hvbGUgbnVtYmVyLlxyXG4gKlxyXG4gKi9cclxuUC50cnVuY2F0ZWQgPSBQLnRydW5jID0gZnVuY3Rpb24gKCkge1xyXG4gIHJldHVybiBmaW5hbGlzZShuZXcgdGhpcy5jb25zdHJ1Y3Rvcih0aGlzKSwgdGhpcy5lICsgMSwgMSk7XHJcbn07XHJcblxyXG5cclxuLypcclxuICogUmV0dXJuIGEgc3RyaW5nIHJlcHJlc2VudGluZyB0aGUgdmFsdWUgb2YgdGhpcyBEZWNpbWFsLlxyXG4gKiBVbmxpa2UgYHRvU3RyaW5nYCwgbmVnYXRpdmUgemVybyB3aWxsIGluY2x1ZGUgdGhlIG1pbnVzIHNpZ24uXHJcbiAqXHJcbiAqL1xyXG5QLnZhbHVlT2YgPSBQLnRvSlNPTiA9IGZ1bmN0aW9uICgpIHtcclxuICB2YXIgeCA9IHRoaXMsXHJcbiAgICBDdG9yID0geC5jb25zdHJ1Y3RvcixcclxuICAgIHN0ciA9IGZpbml0ZVRvU3RyaW5nKHgsIHguZSA8PSBDdG9yLnRvRXhwTmVnIHx8IHguZSA+PSBDdG9yLnRvRXhwUG9zKTtcclxuXHJcbiAgcmV0dXJuIHguaXNOZWcoKSA/ICctJyArIHN0ciA6IHN0cjtcclxufTtcclxuXHJcblxyXG4vLyBIZWxwZXIgZnVuY3Rpb25zIGZvciBEZWNpbWFsLnByb3RvdHlwZSAoUCkgYW5kL29yIERlY2ltYWwgbWV0aG9kcywgYW5kIHRoZWlyIGNhbGxlcnMuXHJcblxyXG5cclxuLypcclxuICogIGRpZ2l0c1RvU3RyaW5nICAgICAgICAgICBQLmN1YmVSb290LCBQLmxvZ2FyaXRobSwgUC5zcXVhcmVSb290LCBQLnRvRnJhY3Rpb24sIFAudG9Qb3dlcixcclxuICogICAgICAgICAgICAgICAgICAgICAgICAgICBmaW5pdGVUb1N0cmluZywgbmF0dXJhbEV4cG9uZW50aWFsLCBuYXR1cmFsTG9nYXJpdGhtXHJcbiAqICBjaGVja0ludDMyICAgICAgICAgICAgICAgUC50b0RlY2ltYWxQbGFjZXMsIFAudG9FeHBvbmVudGlhbCwgUC50b0ZpeGVkLCBQLnRvTmVhcmVzdCxcclxuICogICAgICAgICAgICAgICAgICAgICAgICAgICBQLnRvUHJlY2lzaW9uLCBQLnRvU2lnbmlmaWNhbnREaWdpdHMsIHRvU3RyaW5nQmluYXJ5LCByYW5kb21cclxuICogIGNoZWNrUm91bmRpbmdEaWdpdHMgICAgICBQLmxvZ2FyaXRobSwgUC50b1Bvd2VyLCBuYXR1cmFsRXhwb25lbnRpYWwsIG5hdHVyYWxMb2dhcml0aG1cclxuICogIGNvbnZlcnRCYXNlICAgICAgICAgICAgICB0b1N0cmluZ0JpbmFyeSwgcGFyc2VPdGhlclxyXG4gKiAgY29zICAgICAgICAgICAgICAgICAgICAgIFAuY29zXHJcbiAqICBkaXZpZGUgICAgICAgICAgICAgICAgICAgUC5hdGFuaCwgUC5jdWJlUm9vdCwgUC5kaXZpZGVkQnksIFAuZGl2aWRlZFRvSW50ZWdlckJ5LFxyXG4gKiAgICAgICAgICAgICAgICAgICAgICAgICAgIFAubG9nYXJpdGhtLCBQLm1vZHVsbywgUC5zcXVhcmVSb290LCBQLnRhbiwgUC50YW5oLCBQLnRvRnJhY3Rpb24sXHJcbiAqICAgICAgICAgICAgICAgICAgICAgICAgICAgUC50b05lYXJlc3QsIHRvU3RyaW5nQmluYXJ5LCBuYXR1cmFsRXhwb25lbnRpYWwsIG5hdHVyYWxMb2dhcml0aG0sXHJcbiAqICAgICAgICAgICAgICAgICAgICAgICAgICAgdGF5bG9yU2VyaWVzLCBhdGFuMiwgcGFyc2VPdGhlclxyXG4gKiAgZmluYWxpc2UgICAgICAgICAgICAgICAgIFAuYWJzb2x1dGVWYWx1ZSwgUC5hdGFuLCBQLmF0YW5oLCBQLmNlaWwsIFAuY29zLCBQLmNvc2gsXHJcbiAqICAgICAgICAgICAgICAgICAgICAgICAgICAgUC5jdWJlUm9vdCwgUC5kaXZpZGVkVG9JbnRlZ2VyQnksIFAuZmxvb3IsIFAubG9nYXJpdGhtLCBQLm1pbnVzLFxyXG4gKiAgICAgICAgICAgICAgICAgICAgICAgICAgIFAubW9kdWxvLCBQLm5lZ2F0ZWQsIFAucGx1cywgUC5yb3VuZCwgUC5zaW4sIFAuc2luaCwgUC5zcXVhcmVSb290LFxyXG4gKiAgICAgICAgICAgICAgICAgICAgICAgICAgIFAudGFuLCBQLnRpbWVzLCBQLnRvRGVjaW1hbFBsYWNlcywgUC50b0V4cG9uZW50aWFsLCBQLnRvRml4ZWQsXHJcbiAqICAgICAgICAgICAgICAgICAgICAgICAgICAgUC50b05lYXJlc3QsIFAudG9Qb3dlciwgUC50b1ByZWNpc2lvbiwgUC50b1NpZ25pZmljYW50RGlnaXRzLFxyXG4gKiAgICAgICAgICAgICAgICAgICAgICAgICAgIFAudHJ1bmNhdGVkLCBkaXZpZGUsIGdldExuMTAsIGdldFBpLCBuYXR1cmFsRXhwb25lbnRpYWwsXHJcbiAqICAgICAgICAgICAgICAgICAgICAgICAgICAgbmF0dXJhbExvZ2FyaXRobSwgY2VpbCwgZmxvb3IsIHJvdW5kLCB0cnVuY1xyXG4gKiAgZmluaXRlVG9TdHJpbmcgICAgICAgICAgIFAudG9FeHBvbmVudGlhbCwgUC50b0ZpeGVkLCBQLnRvUHJlY2lzaW9uLCBQLnRvU3RyaW5nLCBQLnZhbHVlT2YsXHJcbiAqICAgICAgICAgICAgICAgICAgICAgICAgICAgdG9TdHJpbmdCaW5hcnlcclxuICogIGdldEJhc2UxMEV4cG9uZW50ICAgICAgICBQLm1pbnVzLCBQLnBsdXMsIFAudGltZXMsIHBhcnNlT3RoZXJcclxuICogIGdldExuMTAgICAgICAgICAgICAgICAgICBQLmxvZ2FyaXRobSwgbmF0dXJhbExvZ2FyaXRobVxyXG4gKiAgZ2V0UGkgICAgICAgICAgICAgICAgICAgIFAuYWNvcywgUC5hc2luLCBQLmF0YW4sIHRvTGVzc1RoYW5IYWxmUGksIGF0YW4yXHJcbiAqICBnZXRQcmVjaXNpb24gICAgICAgICAgICAgUC5wcmVjaXNpb24sIFAudG9GcmFjdGlvblxyXG4gKiAgZ2V0WmVyb1N0cmluZyAgICAgICAgICAgIGRpZ2l0c1RvU3RyaW5nLCBmaW5pdGVUb1N0cmluZ1xyXG4gKiAgaW50UG93ICAgICAgICAgICAgICAgICAgIFAudG9Qb3dlciwgcGFyc2VPdGhlclxyXG4gKiAgaXNPZGQgICAgICAgICAgICAgICAgICAgIHRvTGVzc1RoYW5IYWxmUGlcclxuICogIG1heE9yTWluICAgICAgICAgICAgICAgICBtYXgsIG1pblxyXG4gKiAgbmF0dXJhbEV4cG9uZW50aWFsICAgICAgIFAubmF0dXJhbEV4cG9uZW50aWFsLCBQLnRvUG93ZXJcclxuICogIG5hdHVyYWxMb2dhcml0aG0gICAgICAgICBQLmFjb3NoLCBQLmFzaW5oLCBQLmF0YW5oLCBQLmxvZ2FyaXRobSwgUC5uYXR1cmFsTG9nYXJpdGhtLFxyXG4gKiAgICAgICAgICAgICAgICAgICAgICAgICAgIFAudG9Qb3dlciwgbmF0dXJhbEV4cG9uZW50aWFsXHJcbiAqICBub25GaW5pdGVUb1N0cmluZyAgICAgICAgZmluaXRlVG9TdHJpbmcsIHRvU3RyaW5nQmluYXJ5XHJcbiAqICBwYXJzZURlY2ltYWwgICAgICAgICAgICAgRGVjaW1hbFxyXG4gKiAgcGFyc2VPdGhlciAgICAgICAgICAgICAgIERlY2ltYWxcclxuICogIHNpbiAgICAgICAgICAgICAgICAgICAgICBQLnNpblxyXG4gKiAgdGF5bG9yU2VyaWVzICAgICAgICAgICAgIFAuY29zaCwgUC5zaW5oLCBjb3MsIHNpblxyXG4gKiAgdG9MZXNzVGhhbkhhbGZQaSAgICAgICAgIFAuY29zLCBQLnNpblxyXG4gKiAgdG9TdHJpbmdCaW5hcnkgICAgICAgICAgIFAudG9CaW5hcnksIFAudG9IZXhhZGVjaW1hbCwgUC50b09jdGFsXHJcbiAqICB0cnVuY2F0ZSAgICAgICAgICAgICAgICAgaW50UG93XHJcbiAqXHJcbiAqICBUaHJvd3M6ICAgICAgICAgICAgICAgICAgUC5sb2dhcml0aG0sIFAucHJlY2lzaW9uLCBQLnRvRnJhY3Rpb24sIGNoZWNrSW50MzIsIGdldExuMTAsIGdldFBpLFxyXG4gKiAgICAgICAgICAgICAgICAgICAgICAgICAgIG5hdHVyYWxMb2dhcml0aG0sIGNvbmZpZywgcGFyc2VPdGhlciwgcmFuZG9tLCBEZWNpbWFsXHJcbiAqL1xyXG5cclxuXHJcbmZ1bmN0aW9uIGRpZ2l0c1RvU3RyaW5nKGQpIHtcclxuICB2YXIgaSwgaywgd3MsXHJcbiAgICBpbmRleE9mTGFzdFdvcmQgPSBkLmxlbmd0aCAtIDEsXHJcbiAgICBzdHIgPSAnJyxcclxuICAgIHcgPSBkWzBdO1xyXG5cclxuICBpZiAoaW5kZXhPZkxhc3RXb3JkID4gMCkge1xyXG4gICAgc3RyICs9IHc7XHJcbiAgICBmb3IgKGkgPSAxOyBpIDwgaW5kZXhPZkxhc3RXb3JkOyBpKyspIHtcclxuICAgICAgd3MgPSBkW2ldICsgJyc7XHJcbiAgICAgIGsgPSBMT0dfQkFTRSAtIHdzLmxlbmd0aDtcclxuICAgICAgaWYgKGspIHN0ciArPSBnZXRaZXJvU3RyaW5nKGspO1xyXG4gICAgICBzdHIgKz0gd3M7XHJcbiAgICB9XHJcblxyXG4gICAgdyA9IGRbaV07XHJcbiAgICB3cyA9IHcgKyAnJztcclxuICAgIGsgPSBMT0dfQkFTRSAtIHdzLmxlbmd0aDtcclxuICAgIGlmIChrKSBzdHIgKz0gZ2V0WmVyb1N0cmluZyhrKTtcclxuICB9IGVsc2UgaWYgKHcgPT09IDApIHtcclxuICAgIHJldHVybiAnMCc7XHJcbiAgfVxyXG5cclxuICAvLyBSZW1vdmUgdHJhaWxpbmcgemVyb3Mgb2YgbGFzdCB3LlxyXG4gIGZvciAoOyB3ICUgMTAgPT09IDA7KSB3IC89IDEwO1xyXG5cclxuICByZXR1cm4gc3RyICsgdztcclxufVxyXG5cclxuXHJcbmZ1bmN0aW9uIGNoZWNrSW50MzIoaSwgbWluLCBtYXgpIHtcclxuICBpZiAoaSAhPT0gfn5pIHx8IGkgPCBtaW4gfHwgaSA+IG1heCkge1xyXG4gICAgdGhyb3cgRXJyb3IoaW52YWxpZEFyZ3VtZW50ICsgaSk7XHJcbiAgfVxyXG59XHJcblxyXG5cclxuLypcclxuICogQ2hlY2sgNSByb3VuZGluZyBkaWdpdHMgaWYgYHJlcGVhdGluZ2AgaXMgbnVsbCwgNCBvdGhlcndpc2UuXHJcbiAqIGByZXBlYXRpbmcgPT0gbnVsbGAgaWYgY2FsbGVyIGlzIGBsb2dgIG9yIGBwb3dgLFxyXG4gKiBgcmVwZWF0aW5nICE9IG51bGxgIGlmIGNhbGxlciBpcyBgbmF0dXJhbExvZ2FyaXRobWAgb3IgYG5hdHVyYWxFeHBvbmVudGlhbGAuXHJcbiAqL1xyXG5mdW5jdGlvbiBjaGVja1JvdW5kaW5nRGlnaXRzKGQsIGksIHJtLCByZXBlYXRpbmcpIHtcclxuICB2YXIgZGksIGssIHIsIHJkO1xyXG5cclxuICAvLyBHZXQgdGhlIGxlbmd0aCBvZiB0aGUgZmlyc3Qgd29yZCBvZiB0aGUgYXJyYXkgZC5cclxuICBmb3IgKGsgPSBkWzBdOyBrID49IDEwOyBrIC89IDEwKSAtLWk7XHJcblxyXG4gIC8vIElzIHRoZSByb3VuZGluZyBkaWdpdCBpbiB0aGUgZmlyc3Qgd29yZCBvZiBkP1xyXG4gIGlmICgtLWkgPCAwKSB7XHJcbiAgICBpICs9IExPR19CQVNFO1xyXG4gICAgZGkgPSAwO1xyXG4gIH0gZWxzZSB7XHJcbiAgICBkaSA9IE1hdGguY2VpbCgoaSArIDEpIC8gTE9HX0JBU0UpO1xyXG4gICAgaSAlPSBMT0dfQkFTRTtcclxuICB9XHJcblxyXG4gIC8vIGkgaXMgdGhlIGluZGV4ICgwIC0gNikgb2YgdGhlIHJvdW5kaW5nIGRpZ2l0LlxyXG4gIC8vIEUuZy4gaWYgd2l0aGluIHRoZSB3b3JkIDM0ODc1NjMgdGhlIGZpcnN0IHJvdW5kaW5nIGRpZ2l0IGlzIDUsXHJcbiAgLy8gdGhlbiBpID0gNCwgayA9IDEwMDAsIHJkID0gMzQ4NzU2MyAlIDEwMDAgPSA1NjNcclxuICBrID0gbWF0aHBvdygxMCwgTE9HX0JBU0UgLSBpKTtcclxuICByZCA9IGRbZGldICUgayB8IDA7XHJcblxyXG4gIGlmIChyZXBlYXRpbmcgPT0gbnVsbCkge1xyXG4gICAgaWYgKGkgPCAzKSB7XHJcbiAgICAgIGlmIChpID09IDApIHJkID0gcmQgLyAxMDAgfCAwO1xyXG4gICAgICBlbHNlIGlmIChpID09IDEpIHJkID0gcmQgLyAxMCB8IDA7XHJcbiAgICAgIHIgPSBybSA8IDQgJiYgcmQgPT0gOTk5OTkgfHwgcm0gPiAzICYmIHJkID09IDQ5OTk5IHx8IHJkID09IDUwMDAwIHx8IHJkID09IDA7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICByID0gKHJtIDwgNCAmJiByZCArIDEgPT0gayB8fCBybSA+IDMgJiYgcmQgKyAxID09IGsgLyAyKSAmJlxyXG4gICAgICAgIChkW2RpICsgMV0gLyBrIC8gMTAwIHwgMCkgPT0gbWF0aHBvdygxMCwgaSAtIDIpIC0gMSB8fFxyXG4gICAgICAgICAgKHJkID09IGsgLyAyIHx8IHJkID09IDApICYmIChkW2RpICsgMV0gLyBrIC8gMTAwIHwgMCkgPT0gMDtcclxuICAgIH1cclxuICB9IGVsc2Uge1xyXG4gICAgaWYgKGkgPCA0KSB7XHJcbiAgICAgIGlmIChpID09IDApIHJkID0gcmQgLyAxMDAwIHwgMDtcclxuICAgICAgZWxzZSBpZiAoaSA9PSAxKSByZCA9IHJkIC8gMTAwIHwgMDtcclxuICAgICAgZWxzZSBpZiAoaSA9PSAyKSByZCA9IHJkIC8gMTAgfCAwO1xyXG4gICAgICByID0gKHJlcGVhdGluZyB8fCBybSA8IDQpICYmIHJkID09IDk5OTkgfHwgIXJlcGVhdGluZyAmJiBybSA+IDMgJiYgcmQgPT0gNDk5OTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIHIgPSAoKHJlcGVhdGluZyB8fCBybSA8IDQpICYmIHJkICsgMSA9PSBrIHx8XHJcbiAgICAgICghcmVwZWF0aW5nICYmIHJtID4gMykgJiYgcmQgKyAxID09IGsgLyAyKSAmJlxyXG4gICAgICAgIChkW2RpICsgMV0gLyBrIC8gMTAwMCB8IDApID09IG1hdGhwb3coMTAsIGkgLSAzKSAtIDE7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICByZXR1cm4gcjtcclxufVxyXG5cclxuXHJcbi8vIENvbnZlcnQgc3RyaW5nIG9mIGBiYXNlSW5gIHRvIGFuIGFycmF5IG9mIG51bWJlcnMgb2YgYGJhc2VPdXRgLlxyXG4vLyBFZy4gY29udmVydEJhc2UoJzI1NScsIDEwLCAxNikgcmV0dXJucyBbMTUsIDE1XS5cclxuLy8gRWcuIGNvbnZlcnRCYXNlKCdmZicsIDE2LCAxMCkgcmV0dXJucyBbMiwgNSwgNV0uXHJcbmZ1bmN0aW9uIGNvbnZlcnRCYXNlKHN0ciwgYmFzZUluLCBiYXNlT3V0KSB7XHJcbiAgdmFyIGosXHJcbiAgICBhcnIgPSBbMF0sXHJcbiAgICBhcnJMLFxyXG4gICAgaSA9IDAsXHJcbiAgICBzdHJMID0gc3RyLmxlbmd0aDtcclxuXHJcbiAgZm9yICg7IGkgPCBzdHJMOykge1xyXG4gICAgZm9yIChhcnJMID0gYXJyLmxlbmd0aDsgYXJyTC0tOykgYXJyW2FyckxdICo9IGJhc2VJbjtcclxuICAgIGFyclswXSArPSBOVU1FUkFMUy5pbmRleE9mKHN0ci5jaGFyQXQoaSsrKSk7XHJcbiAgICBmb3IgKGogPSAwOyBqIDwgYXJyLmxlbmd0aDsgaisrKSB7XHJcbiAgICAgIGlmIChhcnJbal0gPiBiYXNlT3V0IC0gMSkge1xyXG4gICAgICAgIGlmIChhcnJbaiArIDFdID09PSB2b2lkIDApIGFycltqICsgMV0gPSAwO1xyXG4gICAgICAgIGFycltqICsgMV0gKz0gYXJyW2pdIC8gYmFzZU91dCB8IDA7XHJcbiAgICAgICAgYXJyW2pdICU9IGJhc2VPdXQ7XHJcbiAgICAgIH1cclxuICAgIH1cclxuICB9XHJcblxyXG4gIHJldHVybiBhcnIucmV2ZXJzZSgpO1xyXG59XHJcblxyXG5cclxuLypcclxuICogY29zKHgpID0gMSAtIHheMi8yISArIHheNC80ISAtIC4uLlxyXG4gKiB8eHwgPCBwaS8yXHJcbiAqXHJcbiAqL1xyXG5mdW5jdGlvbiBjb3NpbmUoQ3RvciwgeCkge1xyXG4gIHZhciBrLCBsZW4sIHk7XHJcblxyXG4gIGlmICh4LmlzWmVybygpKSByZXR1cm4geDtcclxuXHJcbiAgLy8gQXJndW1lbnQgcmVkdWN0aW9uOiBjb3MoNHgpID0gOCooY29zXjQoeCkgLSBjb3NeMih4KSkgKyAxXHJcbiAgLy8gaS5lLiBjb3MoeCkgPSA4Kihjb3NeNCh4LzQpIC0gY29zXjIoeC80KSkgKyAxXHJcblxyXG4gIC8vIEVzdGltYXRlIHRoZSBvcHRpbXVtIG51bWJlciBvZiB0aW1lcyB0byB1c2UgdGhlIGFyZ3VtZW50IHJlZHVjdGlvbi5cclxuICBsZW4gPSB4LmQubGVuZ3RoO1xyXG4gIGlmIChsZW4gPCAzMikge1xyXG4gICAgayA9IE1hdGguY2VpbChsZW4gLyAzKTtcclxuICAgIHkgPSAoMSAvIHRpbnlQb3coNCwgaykpLnRvU3RyaW5nKCk7XHJcbiAgfSBlbHNlIHtcclxuICAgIGsgPSAxNjtcclxuICAgIHkgPSAnMi4zMjgzMDY0MzY1Mzg2OTYyODkwNjI1ZS0xMCc7XHJcbiAgfVxyXG5cclxuICBDdG9yLnByZWNpc2lvbiArPSBrO1xyXG5cclxuICB4ID0gdGF5bG9yU2VyaWVzKEN0b3IsIDEsIHgudGltZXMoeSksIG5ldyBDdG9yKDEpKTtcclxuXHJcbiAgLy8gUmV2ZXJzZSBhcmd1bWVudCByZWR1Y3Rpb25cclxuICBmb3IgKHZhciBpID0gazsgaS0tOykge1xyXG4gICAgdmFyIGNvczJ4ID0geC50aW1lcyh4KTtcclxuICAgIHggPSBjb3MyeC50aW1lcyhjb3MyeCkubWludXMoY29zMngpLnRpbWVzKDgpLnBsdXMoMSk7XHJcbiAgfVxyXG5cclxuICBDdG9yLnByZWNpc2lvbiAtPSBrO1xyXG5cclxuICByZXR1cm4geDtcclxufVxyXG5cclxuXHJcbi8qXHJcbiAqIFBlcmZvcm0gZGl2aXNpb24gaW4gdGhlIHNwZWNpZmllZCBiYXNlLlxyXG4gKi9cclxudmFyIGRpdmlkZSA9IChmdW5jdGlvbiAoKSB7XHJcblxyXG4gIC8vIEFzc3VtZXMgbm9uLXplcm8geCBhbmQgaywgYW5kIGhlbmNlIG5vbi16ZXJvIHJlc3VsdC5cclxuICBmdW5jdGlvbiBtdWx0aXBseUludGVnZXIoeCwgaywgYmFzZSkge1xyXG4gICAgdmFyIHRlbXAsXHJcbiAgICAgIGNhcnJ5ID0gMCxcclxuICAgICAgaSA9IHgubGVuZ3RoO1xyXG5cclxuICAgIGZvciAoeCA9IHguc2xpY2UoKTsgaS0tOykge1xyXG4gICAgICB0ZW1wID0geFtpXSAqIGsgKyBjYXJyeTtcclxuICAgICAgeFtpXSA9IHRlbXAgJSBiYXNlIHwgMDtcclxuICAgICAgY2FycnkgPSB0ZW1wIC8gYmFzZSB8IDA7XHJcbiAgICB9XHJcblxyXG4gICAgaWYgKGNhcnJ5KSB4LnVuc2hpZnQoY2FycnkpO1xyXG5cclxuICAgIHJldHVybiB4O1xyXG4gIH1cclxuXHJcbiAgZnVuY3Rpb24gY29tcGFyZShhLCBiLCBhTCwgYkwpIHtcclxuICAgIHZhciBpLCByO1xyXG5cclxuICAgIGlmIChhTCAhPSBiTCkge1xyXG4gICAgICByID0gYUwgPiBiTCA/IDEgOiAtMTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIGZvciAoaSA9IHIgPSAwOyBpIDwgYUw7IGkrKykge1xyXG4gICAgICAgIGlmIChhW2ldICE9IGJbaV0pIHtcclxuICAgICAgICAgIHIgPSBhW2ldID4gYltpXSA/IDEgOiAtMTtcclxuICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiByO1xyXG4gIH1cclxuXHJcbiAgZnVuY3Rpb24gc3VidHJhY3QoYSwgYiwgYUwsIGJhc2UpIHtcclxuICAgIHZhciBpID0gMDtcclxuXHJcbiAgICAvLyBTdWJ0cmFjdCBiIGZyb20gYS5cclxuICAgIGZvciAoOyBhTC0tOykge1xyXG4gICAgICBhW2FMXSAtPSBpO1xyXG4gICAgICBpID0gYVthTF0gPCBiW2FMXSA/IDEgOiAwO1xyXG4gICAgICBhW2FMXSA9IGkgKiBiYXNlICsgYVthTF0gLSBiW2FMXTtcclxuICAgIH1cclxuXHJcbiAgICAvLyBSZW1vdmUgbGVhZGluZyB6ZXJvcy5cclxuICAgIGZvciAoOyAhYVswXSAmJiBhLmxlbmd0aCA+IDE7KSBhLnNoaWZ0KCk7XHJcbiAgfVxyXG5cclxuICByZXR1cm4gZnVuY3Rpb24gKHgsIHksIHByLCBybSwgZHAsIGJhc2UpIHtcclxuICAgIHZhciBjbXAsIGUsIGksIGssIGxvZ0Jhc2UsIG1vcmUsIHByb2QsIHByb2RMLCBxLCBxZCwgcmVtLCByZW1MLCByZW0wLCBzZCwgdCwgeGksIHhMLCB5ZDAsXHJcbiAgICAgIHlMLCB5eixcclxuICAgICAgQ3RvciA9IHguY29uc3RydWN0b3IsXHJcbiAgICAgIHNpZ24gPSB4LnMgPT0geS5zID8gMSA6IC0xLFxyXG4gICAgICB4ZCA9IHguZCxcclxuICAgICAgeWQgPSB5LmQ7XHJcblxyXG4gICAgLy8gRWl0aGVyIE5hTiwgSW5maW5pdHkgb3IgMD9cclxuICAgIGlmICgheGQgfHwgIXhkWzBdIHx8ICF5ZCB8fCAheWRbMF0pIHtcclxuXHJcbiAgICAgIHJldHVybiBuZXcgQ3RvcigvLyBSZXR1cm4gTmFOIGlmIGVpdGhlciBOYU4sIG9yIGJvdGggSW5maW5pdHkgb3IgMC5cclxuICAgICAgICAheC5zIHx8ICF5LnMgfHwgKHhkID8geWQgJiYgeGRbMF0gPT0geWRbMF0gOiAheWQpID8gTmFOIDpcclxuXHJcbiAgICAgICAgLy8gUmV0dXJuIFx1MDBCMTAgaWYgeCBpcyAwIG9yIHkgaXMgXHUwMEIxSW5maW5pdHksIG9yIHJldHVybiBcdTAwQjFJbmZpbml0eSBhcyB5IGlzIDAuXHJcbiAgICAgICAgeGQgJiYgeGRbMF0gPT0gMCB8fCAheWQgPyBzaWduICogMCA6IHNpZ24gLyAwKTtcclxuICAgIH1cclxuXHJcbiAgICBpZiAoYmFzZSkge1xyXG4gICAgICBsb2dCYXNlID0gMTtcclxuICAgICAgZSA9IHguZSAtIHkuZTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIGJhc2UgPSBCQVNFO1xyXG4gICAgICBsb2dCYXNlID0gTE9HX0JBU0U7XHJcbiAgICAgIGUgPSBtYXRoZmxvb3IoeC5lIC8gbG9nQmFzZSkgLSBtYXRoZmxvb3IoeS5lIC8gbG9nQmFzZSk7XHJcbiAgICB9XHJcblxyXG4gICAgeUwgPSB5ZC5sZW5ndGg7XHJcbiAgICB4TCA9IHhkLmxlbmd0aDtcclxuICAgIHEgPSBuZXcgQ3RvcihzaWduKTtcclxuICAgIHFkID0gcS5kID0gW107XHJcblxyXG4gICAgLy8gUmVzdWx0IGV4cG9uZW50IG1heSBiZSBvbmUgbGVzcyB0aGFuIGUuXHJcbiAgICAvLyBUaGUgZGlnaXQgYXJyYXkgb2YgYSBEZWNpbWFsIGZyb20gdG9TdHJpbmdCaW5hcnkgbWF5IGhhdmUgdHJhaWxpbmcgemVyb3MuXHJcbiAgICBmb3IgKGkgPSAwOyB5ZFtpXSA9PSAoeGRbaV0gfHwgMCk7IGkrKyk7XHJcblxyXG4gICAgaWYgKHlkW2ldID4gKHhkW2ldIHx8IDApKSBlLS07XHJcblxyXG4gICAgaWYgKHByID09IG51bGwpIHtcclxuICAgICAgc2QgPSBwciA9IEN0b3IucHJlY2lzaW9uO1xyXG4gICAgICBybSA9IEN0b3Iucm91bmRpbmc7XHJcbiAgICB9IGVsc2UgaWYgKGRwKSB7XHJcbiAgICAgIHNkID0gcHIgKyAoeC5lIC0geS5lKSArIDE7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICBzZCA9IHByO1xyXG4gICAgfVxyXG5cclxuICAgIGlmIChzZCA8IDApIHtcclxuICAgICAgcWQucHVzaCgxKTtcclxuICAgICAgbW9yZSA9IHRydWU7XHJcbiAgICB9IGVsc2Uge1xyXG5cclxuICAgICAgLy8gQ29udmVydCBwcmVjaXNpb24gaW4gbnVtYmVyIG9mIGJhc2UgMTAgZGlnaXRzIHRvIGJhc2UgMWU3IGRpZ2l0cy5cclxuICAgICAgc2QgPSBzZCAvIGxvZ0Jhc2UgKyAyIHwgMDtcclxuICAgICAgaSA9IDA7XHJcblxyXG4gICAgICAvLyBkaXZpc29yIDwgMWU3XHJcbiAgICAgIGlmICh5TCA9PSAxKSB7XHJcbiAgICAgICAgayA9IDA7XHJcbiAgICAgICAgeWQgPSB5ZFswXTtcclxuICAgICAgICBzZCsrO1xyXG5cclxuICAgICAgICAvLyBrIGlzIHRoZSBjYXJyeS5cclxuICAgICAgICBmb3IgKDsgKGkgPCB4TCB8fCBrKSAmJiBzZC0tOyBpKyspIHtcclxuICAgICAgICAgIHQgPSBrICogYmFzZSArICh4ZFtpXSB8fCAwKTtcclxuICAgICAgICAgIHFkW2ldID0gdCAvIHlkIHwgMDtcclxuICAgICAgICAgIGsgPSB0ICUgeWQgfCAwO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgbW9yZSA9IGsgfHwgaSA8IHhMO1xyXG5cclxuICAgICAgLy8gZGl2aXNvciA+PSAxZTdcclxuICAgICAgfSBlbHNlIHtcclxuXHJcbiAgICAgICAgLy8gTm9ybWFsaXNlIHhkIGFuZCB5ZCBzbyBoaWdoZXN0IG9yZGVyIGRpZ2l0IG9mIHlkIGlzID49IGJhc2UvMlxyXG4gICAgICAgIGsgPSBiYXNlIC8gKHlkWzBdICsgMSkgfCAwO1xyXG5cclxuICAgICAgICBpZiAoayA+IDEpIHtcclxuICAgICAgICAgIHlkID0gbXVsdGlwbHlJbnRlZ2VyKHlkLCBrLCBiYXNlKTtcclxuICAgICAgICAgIHhkID0gbXVsdGlwbHlJbnRlZ2VyKHhkLCBrLCBiYXNlKTtcclxuICAgICAgICAgIHlMID0geWQubGVuZ3RoO1xyXG4gICAgICAgICAgeEwgPSB4ZC5sZW5ndGg7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB4aSA9IHlMO1xyXG4gICAgICAgIHJlbSA9IHhkLnNsaWNlKDAsIHlMKTtcclxuICAgICAgICByZW1MID0gcmVtLmxlbmd0aDtcclxuXHJcbiAgICAgICAgLy8gQWRkIHplcm9zIHRvIG1ha2UgcmVtYWluZGVyIGFzIGxvbmcgYXMgZGl2aXNvci5cclxuICAgICAgICBmb3IgKDsgcmVtTCA8IHlMOykgcmVtW3JlbUwrK10gPSAwO1xyXG5cclxuICAgICAgICB5eiA9IHlkLnNsaWNlKCk7XHJcbiAgICAgICAgeXoudW5zaGlmdCgwKTtcclxuICAgICAgICB5ZDAgPSB5ZFswXTtcclxuXHJcbiAgICAgICAgaWYgKHlkWzFdID49IGJhc2UgLyAyKSArK3lkMDtcclxuXHJcbiAgICAgICAgZG8ge1xyXG4gICAgICAgICAgayA9IDA7XHJcblxyXG4gICAgICAgICAgLy8gQ29tcGFyZSBkaXZpc29yIGFuZCByZW1haW5kZXIuXHJcbiAgICAgICAgICBjbXAgPSBjb21wYXJlKHlkLCByZW0sIHlMLCByZW1MKTtcclxuXHJcbiAgICAgICAgICAvLyBJZiBkaXZpc29yIDwgcmVtYWluZGVyLlxyXG4gICAgICAgICAgaWYgKGNtcCA8IDApIHtcclxuXHJcbiAgICAgICAgICAgIC8vIENhbGN1bGF0ZSB0cmlhbCBkaWdpdCwgay5cclxuICAgICAgICAgICAgcmVtMCA9IHJlbVswXTtcclxuICAgICAgICAgICAgaWYgKHlMICE9IHJlbUwpIHJlbTAgPSByZW0wICogYmFzZSArIChyZW1bMV0gfHwgMCk7XHJcblxyXG4gICAgICAgICAgICAvLyBrIHdpbGwgYmUgaG93IG1hbnkgdGltZXMgdGhlIGRpdmlzb3IgZ29lcyBpbnRvIHRoZSBjdXJyZW50IHJlbWFpbmRlci5cclxuICAgICAgICAgICAgayA9IHJlbTAgLyB5ZDAgfCAwO1xyXG5cclxuICAgICAgICAgICAgLy8gIEFsZ29yaXRobTpcclxuICAgICAgICAgICAgLy8gIDEuIHByb2R1Y3QgPSBkaXZpc29yICogdHJpYWwgZGlnaXQgKGspXHJcbiAgICAgICAgICAgIC8vICAyLiBpZiBwcm9kdWN0ID4gcmVtYWluZGVyOiBwcm9kdWN0IC09IGRpdmlzb3IsIGstLVxyXG4gICAgICAgICAgICAvLyAgMy4gcmVtYWluZGVyIC09IHByb2R1Y3RcclxuICAgICAgICAgICAgLy8gIDQuIGlmIHByb2R1Y3Qgd2FzIDwgcmVtYWluZGVyIGF0IDI6XHJcbiAgICAgICAgICAgIC8vICAgIDUuIGNvbXBhcmUgbmV3IHJlbWFpbmRlciBhbmQgZGl2aXNvclxyXG4gICAgICAgICAgICAvLyAgICA2LiBJZiByZW1haW5kZXIgPiBkaXZpc29yOiByZW1haW5kZXIgLT0gZGl2aXNvciwgaysrXHJcblxyXG4gICAgICAgICAgICBpZiAoayA+IDEpIHtcclxuICAgICAgICAgICAgICBpZiAoayA+PSBiYXNlKSBrID0gYmFzZSAtIDE7XHJcblxyXG4gICAgICAgICAgICAgIC8vIHByb2R1Y3QgPSBkaXZpc29yICogdHJpYWwgZGlnaXQuXHJcbiAgICAgICAgICAgICAgcHJvZCA9IG11bHRpcGx5SW50ZWdlcih5ZCwgaywgYmFzZSk7XHJcbiAgICAgICAgICAgICAgcHJvZEwgPSBwcm9kLmxlbmd0aDtcclxuICAgICAgICAgICAgICByZW1MID0gcmVtLmxlbmd0aDtcclxuXHJcbiAgICAgICAgICAgICAgLy8gQ29tcGFyZSBwcm9kdWN0IGFuZCByZW1haW5kZXIuXHJcbiAgICAgICAgICAgICAgY21wID0gY29tcGFyZShwcm9kLCByZW0sIHByb2RMLCByZW1MKTtcclxuXHJcbiAgICAgICAgICAgICAgLy8gcHJvZHVjdCA+IHJlbWFpbmRlci5cclxuICAgICAgICAgICAgICBpZiAoY21wID09IDEpIHtcclxuICAgICAgICAgICAgICAgIGstLTtcclxuXHJcbiAgICAgICAgICAgICAgICAvLyBTdWJ0cmFjdCBkaXZpc29yIGZyb20gcHJvZHVjdC5cclxuICAgICAgICAgICAgICAgIHN1YnRyYWN0KHByb2QsIHlMIDwgcHJvZEwgPyB5eiA6IHlkLCBwcm9kTCwgYmFzZSk7XHJcbiAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG5cclxuICAgICAgICAgICAgICAvLyBjbXAgaXMgLTEuXHJcbiAgICAgICAgICAgICAgLy8gSWYgayBpcyAwLCB0aGVyZSBpcyBubyBuZWVkIHRvIGNvbXBhcmUgeWQgYW5kIHJlbSBhZ2FpbiBiZWxvdywgc28gY2hhbmdlIGNtcCB0byAxXHJcbiAgICAgICAgICAgICAgLy8gdG8gYXZvaWQgaXQuIElmIGsgaXMgMSB0aGVyZSBpcyBhIG5lZWQgdG8gY29tcGFyZSB5ZCBhbmQgcmVtIGFnYWluIGJlbG93LlxyXG4gICAgICAgICAgICAgIGlmIChrID09IDApIGNtcCA9IGsgPSAxO1xyXG4gICAgICAgICAgICAgIHByb2QgPSB5ZC5zbGljZSgpO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBwcm9kTCA9IHByb2QubGVuZ3RoO1xyXG4gICAgICAgICAgICBpZiAocHJvZEwgPCByZW1MKSBwcm9kLnVuc2hpZnQoMCk7XHJcblxyXG4gICAgICAgICAgICAvLyBTdWJ0cmFjdCBwcm9kdWN0IGZyb20gcmVtYWluZGVyLlxyXG4gICAgICAgICAgICBzdWJ0cmFjdChyZW0sIHByb2QsIHJlbUwsIGJhc2UpO1xyXG5cclxuICAgICAgICAgICAgLy8gSWYgcHJvZHVjdCB3YXMgPCBwcmV2aW91cyByZW1haW5kZXIuXHJcbiAgICAgICAgICAgIGlmIChjbXAgPT0gLTEpIHtcclxuICAgICAgICAgICAgICByZW1MID0gcmVtLmxlbmd0aDtcclxuXHJcbiAgICAgICAgICAgICAgLy8gQ29tcGFyZSBkaXZpc29yIGFuZCBuZXcgcmVtYWluZGVyLlxyXG4gICAgICAgICAgICAgIGNtcCA9IGNvbXBhcmUoeWQsIHJlbSwgeUwsIHJlbUwpO1xyXG5cclxuICAgICAgICAgICAgICAvLyBJZiBkaXZpc29yIDwgbmV3IHJlbWFpbmRlciwgc3VidHJhY3QgZGl2aXNvciBmcm9tIHJlbWFpbmRlci5cclxuICAgICAgICAgICAgICBpZiAoY21wIDwgMSkge1xyXG4gICAgICAgICAgICAgICAgaysrO1xyXG5cclxuICAgICAgICAgICAgICAgIC8vIFN1YnRyYWN0IGRpdmlzb3IgZnJvbSByZW1haW5kZXIuXHJcbiAgICAgICAgICAgICAgICBzdWJ0cmFjdChyZW0sIHlMIDwgcmVtTCA/IHl6IDogeWQsIHJlbUwsIGJhc2UpO1xyXG4gICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgcmVtTCA9IHJlbS5sZW5ndGg7XHJcbiAgICAgICAgICB9IGVsc2UgaWYgKGNtcCA9PT0gMCkge1xyXG4gICAgICAgICAgICBrKys7XHJcbiAgICAgICAgICAgIHJlbSA9IFswXTtcclxuICAgICAgICAgIH0gICAgLy8gaWYgY21wID09PSAxLCBrIHdpbGwgYmUgMFxyXG5cclxuICAgICAgICAgIC8vIEFkZCB0aGUgbmV4dCBkaWdpdCwgaywgdG8gdGhlIHJlc3VsdCBhcnJheS5cclxuICAgICAgICAgIHFkW2krK10gPSBrO1xyXG5cclxuICAgICAgICAgIC8vIFVwZGF0ZSB0aGUgcmVtYWluZGVyLlxyXG4gICAgICAgICAgaWYgKGNtcCAmJiByZW1bMF0pIHtcclxuICAgICAgICAgICAgcmVtW3JlbUwrK10gPSB4ZFt4aV0gfHwgMDtcclxuICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHJlbSA9IFt4ZFt4aV1dO1xyXG4gICAgICAgICAgICByZW1MID0gMTtcclxuICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgfSB3aGlsZSAoKHhpKysgPCB4TCB8fCByZW1bMF0gIT09IHZvaWQgMCkgJiYgc2QtLSk7XHJcblxyXG4gICAgICAgIG1vcmUgPSByZW1bMF0gIT09IHZvaWQgMDtcclxuICAgICAgfVxyXG5cclxuICAgICAgLy8gTGVhZGluZyB6ZXJvP1xyXG4gICAgICBpZiAoIXFkWzBdKSBxZC5zaGlmdCgpO1xyXG4gICAgfVxyXG5cclxuICAgIC8vIGxvZ0Jhc2UgaXMgMSB3aGVuIGRpdmlkZSBpcyBiZWluZyB1c2VkIGZvciBiYXNlIGNvbnZlcnNpb24uXHJcbiAgICBpZiAobG9nQmFzZSA9PSAxKSB7XHJcbiAgICAgIHEuZSA9IGU7XHJcbiAgICAgIGluZXhhY3QgPSBtb3JlO1xyXG4gICAgfSBlbHNlIHtcclxuXHJcbiAgICAgIC8vIFRvIGNhbGN1bGF0ZSBxLmUsIGZpcnN0IGdldCB0aGUgbnVtYmVyIG9mIGRpZ2l0cyBvZiBxZFswXS5cclxuICAgICAgZm9yIChpID0gMSwgayA9IHFkWzBdOyBrID49IDEwOyBrIC89IDEwKSBpKys7XHJcbiAgICAgIHEuZSA9IGkgKyBlICogbG9nQmFzZSAtIDE7XHJcblxyXG4gICAgICBmaW5hbGlzZShxLCBkcCA/IHByICsgcS5lICsgMSA6IHByLCBybSwgbW9yZSk7XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIHE7XHJcbiAgfTtcclxufSkoKTtcclxuXHJcblxyXG4vKlxyXG4gKiBSb3VuZCBgeGAgdG8gYHNkYCBzaWduaWZpY2FudCBkaWdpdHMgdXNpbmcgcm91bmRpbmcgbW9kZSBgcm1gLlxyXG4gKiBDaGVjayBmb3Igb3Zlci91bmRlci1mbG93LlxyXG4gKi9cclxuIGZ1bmN0aW9uIGZpbmFsaXNlKHgsIHNkLCBybSwgaXNUcnVuY2F0ZWQpIHtcclxuICB2YXIgZGlnaXRzLCBpLCBqLCBrLCByZCwgcm91bmRVcCwgdywgeGQsIHhkaSxcclxuICAgIEN0b3IgPSB4LmNvbnN0cnVjdG9yO1xyXG5cclxuICAvLyBEb24ndCByb3VuZCBpZiBzZCBpcyBudWxsIG9yIHVuZGVmaW5lZC5cclxuICBvdXQ6IGlmIChzZCAhPSBudWxsKSB7XHJcbiAgICB4ZCA9IHguZDtcclxuXHJcbiAgICAvLyBJbmZpbml0eS9OYU4uXHJcbiAgICBpZiAoIXhkKSByZXR1cm4geDtcclxuXHJcbiAgICAvLyByZDogdGhlIHJvdW5kaW5nIGRpZ2l0LCBpLmUuIHRoZSBkaWdpdCBhZnRlciB0aGUgZGlnaXQgdGhhdCBtYXkgYmUgcm91bmRlZCB1cC5cclxuICAgIC8vIHc6IHRoZSB3b3JkIG9mIHhkIGNvbnRhaW5pbmcgcmQsIGEgYmFzZSAxZTcgbnVtYmVyLlxyXG4gICAgLy8geGRpOiB0aGUgaW5kZXggb2YgdyB3aXRoaW4geGQuXHJcbiAgICAvLyBkaWdpdHM6IHRoZSBudW1iZXIgb2YgZGlnaXRzIG9mIHcuXHJcbiAgICAvLyBpOiB3aGF0IHdvdWxkIGJlIHRoZSBpbmRleCBvZiByZCB3aXRoaW4gdyBpZiBhbGwgdGhlIG51bWJlcnMgd2VyZSA3IGRpZ2l0cyBsb25nIChpLmUuIGlmXHJcbiAgICAvLyB0aGV5IGhhZCBsZWFkaW5nIHplcm9zKVxyXG4gICAgLy8gajogaWYgPiAwLCB0aGUgYWN0dWFsIGluZGV4IG9mIHJkIHdpdGhpbiB3IChpZiA8IDAsIHJkIGlzIGEgbGVhZGluZyB6ZXJvKS5cclxuXHJcbiAgICAvLyBHZXQgdGhlIGxlbmd0aCBvZiB0aGUgZmlyc3Qgd29yZCBvZiB0aGUgZGlnaXRzIGFycmF5IHhkLlxyXG4gICAgZm9yIChkaWdpdHMgPSAxLCBrID0geGRbMF07IGsgPj0gMTA7IGsgLz0gMTApIGRpZ2l0cysrO1xyXG4gICAgaSA9IHNkIC0gZGlnaXRzO1xyXG5cclxuICAgIC8vIElzIHRoZSByb3VuZGluZyBkaWdpdCBpbiB0aGUgZmlyc3Qgd29yZCBvZiB4ZD9cclxuICAgIGlmIChpIDwgMCkge1xyXG4gICAgICBpICs9IExPR19CQVNFO1xyXG4gICAgICBqID0gc2Q7XHJcbiAgICAgIHcgPSB4ZFt4ZGkgPSAwXTtcclxuXHJcbiAgICAgIC8vIEdldCB0aGUgcm91bmRpbmcgZGlnaXQgYXQgaW5kZXggaiBvZiB3LlxyXG4gICAgICByZCA9IHcgLyBtYXRocG93KDEwLCBkaWdpdHMgLSBqIC0gMSkgJSAxMCB8IDA7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICB4ZGkgPSBNYXRoLmNlaWwoKGkgKyAxKSAvIExPR19CQVNFKTtcclxuICAgICAgayA9IHhkLmxlbmd0aDtcclxuICAgICAgaWYgKHhkaSA+PSBrKSB7XHJcbiAgICAgICAgaWYgKGlzVHJ1bmNhdGVkKSB7XHJcblxyXG4gICAgICAgICAgLy8gTmVlZGVkIGJ5IGBuYXR1cmFsRXhwb25lbnRpYWxgLCBgbmF0dXJhbExvZ2FyaXRobWAgYW5kIGBzcXVhcmVSb290YC5cclxuICAgICAgICAgIGZvciAoOyBrKysgPD0geGRpOykgeGQucHVzaCgwKTtcclxuICAgICAgICAgIHcgPSByZCA9IDA7XHJcbiAgICAgICAgICBkaWdpdHMgPSAxO1xyXG4gICAgICAgICAgaSAlPSBMT0dfQkFTRTtcclxuICAgICAgICAgIGogPSBpIC0gTE9HX0JBU0UgKyAxO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICBicmVhayBvdXQ7XHJcbiAgICAgICAgfVxyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIHcgPSBrID0geGRbeGRpXTtcclxuXHJcbiAgICAgICAgLy8gR2V0IHRoZSBudW1iZXIgb2YgZGlnaXRzIG9mIHcuXHJcbiAgICAgICAgZm9yIChkaWdpdHMgPSAxOyBrID49IDEwOyBrIC89IDEwKSBkaWdpdHMrKztcclxuXHJcbiAgICAgICAgLy8gR2V0IHRoZSBpbmRleCBvZiByZCB3aXRoaW4gdy5cclxuICAgICAgICBpICU9IExPR19CQVNFO1xyXG5cclxuICAgICAgICAvLyBHZXQgdGhlIGluZGV4IG9mIHJkIHdpdGhpbiB3LCBhZGp1c3RlZCBmb3IgbGVhZGluZyB6ZXJvcy5cclxuICAgICAgICAvLyBUaGUgbnVtYmVyIG9mIGxlYWRpbmcgemVyb3Mgb2YgdyBpcyBnaXZlbiBieSBMT0dfQkFTRSAtIGRpZ2l0cy5cclxuICAgICAgICBqID0gaSAtIExPR19CQVNFICsgZGlnaXRzO1xyXG5cclxuICAgICAgICAvLyBHZXQgdGhlIHJvdW5kaW5nIGRpZ2l0IGF0IGluZGV4IGogb2Ygdy5cclxuICAgICAgICByZCA9IGogPCAwID8gMCA6IHcgLyBtYXRocG93KDEwLCBkaWdpdHMgLSBqIC0gMSkgJSAxMCB8IDA7XHJcbiAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICAvLyBBcmUgdGhlcmUgYW55IG5vbi16ZXJvIGRpZ2l0cyBhZnRlciB0aGUgcm91bmRpbmcgZGlnaXQ/XHJcbiAgICBpc1RydW5jYXRlZCA9IGlzVHJ1bmNhdGVkIHx8IHNkIDwgMCB8fFxyXG4gICAgICB4ZFt4ZGkgKyAxXSAhPT0gdm9pZCAwIHx8IChqIDwgMCA/IHcgOiB3ICUgbWF0aHBvdygxMCwgZGlnaXRzIC0gaiAtIDEpKTtcclxuXHJcbiAgICAvLyBUaGUgZXhwcmVzc2lvbiBgdyAlIG1hdGhwb3coMTAsIGRpZ2l0cyAtIGogLSAxKWAgcmV0dXJucyBhbGwgdGhlIGRpZ2l0cyBvZiB3IHRvIHRoZSByaWdodFxyXG4gICAgLy8gb2YgdGhlIGRpZ2l0IGF0IChsZWZ0LXRvLXJpZ2h0KSBpbmRleCBqLCBlLmcuIGlmIHcgaXMgOTA4NzE0IGFuZCBqIGlzIDIsIHRoZSBleHByZXNzaW9uXHJcbiAgICAvLyB3aWxsIGdpdmUgNzE0LlxyXG5cclxuICAgIHJvdW5kVXAgPSBybSA8IDRcclxuICAgICAgPyAocmQgfHwgaXNUcnVuY2F0ZWQpICYmIChybSA9PSAwIHx8IHJtID09ICh4LnMgPCAwID8gMyA6IDIpKVxyXG4gICAgICA6IHJkID4gNSB8fCByZCA9PSA1ICYmIChybSA9PSA0IHx8IGlzVHJ1bmNhdGVkIHx8IHJtID09IDYgJiZcclxuXHJcbiAgICAgICAgLy8gQ2hlY2sgd2hldGhlciB0aGUgZGlnaXQgdG8gdGhlIGxlZnQgb2YgdGhlIHJvdW5kaW5nIGRpZ2l0IGlzIG9kZC5cclxuICAgICAgICAoKGkgPiAwID8gaiA+IDAgPyB3IC8gbWF0aHBvdygxMCwgZGlnaXRzIC0gaikgOiAwIDogeGRbeGRpIC0gMV0pICUgMTApICYgMSB8fFxyXG4gICAgICAgICAgcm0gPT0gKHgucyA8IDAgPyA4IDogNykpO1xyXG5cclxuICAgIGlmIChzZCA8IDEgfHwgIXhkWzBdKSB7XHJcbiAgICAgIHhkLmxlbmd0aCA9IDA7XHJcbiAgICAgIGlmIChyb3VuZFVwKSB7XHJcblxyXG4gICAgICAgIC8vIENvbnZlcnQgc2QgdG8gZGVjaW1hbCBwbGFjZXMuXHJcbiAgICAgICAgc2QgLT0geC5lICsgMTtcclxuXHJcbiAgICAgICAgLy8gMSwgMC4xLCAwLjAxLCAwLjAwMSwgMC4wMDAxIGV0Yy5cclxuICAgICAgICB4ZFswXSA9IG1hdGhwb3coMTAsIChMT0dfQkFTRSAtIHNkICUgTE9HX0JBU0UpICUgTE9HX0JBU0UpO1xyXG4gICAgICAgIHguZSA9IC1zZCB8fCAwO1xyXG4gICAgICB9IGVsc2Uge1xyXG5cclxuICAgICAgICAvLyBaZXJvLlxyXG4gICAgICAgIHhkWzBdID0geC5lID0gMDtcclxuICAgICAgfVxyXG5cclxuICAgICAgcmV0dXJuIHg7XHJcbiAgICB9XHJcblxyXG4gICAgLy8gUmVtb3ZlIGV4Y2VzcyBkaWdpdHMuXHJcbiAgICBpZiAoaSA9PSAwKSB7XHJcbiAgICAgIHhkLmxlbmd0aCA9IHhkaTtcclxuICAgICAgayA9IDE7XHJcbiAgICAgIHhkaS0tO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgeGQubGVuZ3RoID0geGRpICsgMTtcclxuICAgICAgayA9IG1hdGhwb3coMTAsIExPR19CQVNFIC0gaSk7XHJcblxyXG4gICAgICAvLyBFLmcuIDU2NzAwIGJlY29tZXMgNTYwMDAgaWYgNyBpcyB0aGUgcm91bmRpbmcgZGlnaXQuXHJcbiAgICAgIC8vIGogPiAwIG1lYW5zIGkgPiBudW1iZXIgb2YgbGVhZGluZyB6ZXJvcyBvZiB3LlxyXG4gICAgICB4ZFt4ZGldID0gaiA+IDAgPyAodyAvIG1hdGhwb3coMTAsIGRpZ2l0cyAtIGopICUgbWF0aHBvdygxMCwgaikgfCAwKSAqIGsgOiAwO1xyXG4gICAgfVxyXG5cclxuICAgIGlmIChyb3VuZFVwKSB7XHJcbiAgICAgIGZvciAoOzspIHtcclxuXHJcbiAgICAgICAgLy8gSXMgdGhlIGRpZ2l0IHRvIGJlIHJvdW5kZWQgdXAgaW4gdGhlIGZpcnN0IHdvcmQgb2YgeGQ/XHJcbiAgICAgICAgaWYgKHhkaSA9PSAwKSB7XHJcblxyXG4gICAgICAgICAgLy8gaSB3aWxsIGJlIHRoZSBsZW5ndGggb2YgeGRbMF0gYmVmb3JlIGsgaXMgYWRkZWQuXHJcbiAgICAgICAgICBmb3IgKGkgPSAxLCBqID0geGRbMF07IGogPj0gMTA7IGogLz0gMTApIGkrKztcclxuICAgICAgICAgIGogPSB4ZFswXSArPSBrO1xyXG4gICAgICAgICAgZm9yIChrID0gMTsgaiA+PSAxMDsgaiAvPSAxMCkgaysrO1xyXG5cclxuICAgICAgICAgIC8vIGlmIGkgIT0gayB0aGUgbGVuZ3RoIGhhcyBpbmNyZWFzZWQuXHJcbiAgICAgICAgICBpZiAoaSAhPSBrKSB7XHJcbiAgICAgICAgICAgIHguZSsrO1xyXG4gICAgICAgICAgICBpZiAoeGRbMF0gPT0gQkFTRSkgeGRbMF0gPSAxO1xyXG4gICAgICAgICAgfVxyXG5cclxuICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICB4ZFt4ZGldICs9IGs7XHJcbiAgICAgICAgICBpZiAoeGRbeGRpXSAhPSBCQVNFKSBicmVhaztcclxuICAgICAgICAgIHhkW3hkaS0tXSA9IDA7XHJcbiAgICAgICAgICBrID0gMTtcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICAvLyBSZW1vdmUgdHJhaWxpbmcgemVyb3MuXHJcbiAgICBmb3IgKGkgPSB4ZC5sZW5ndGg7IHhkWy0taV0gPT09IDA7KSB4ZC5wb3AoKTtcclxuICB9XHJcblxyXG4gIGlmIChleHRlcm5hbCkge1xyXG5cclxuICAgIC8vIE92ZXJmbG93P1xyXG4gICAgaWYgKHguZSA+IEN0b3IubWF4RSkge1xyXG5cclxuICAgICAgLy8gSW5maW5pdHkuXHJcbiAgICAgIHguZCA9IG51bGw7XHJcbiAgICAgIHguZSA9IE5hTjtcclxuXHJcbiAgICAvLyBVbmRlcmZsb3c/XHJcbiAgICB9IGVsc2UgaWYgKHguZSA8IEN0b3IubWluRSkge1xyXG5cclxuICAgICAgLy8gWmVyby5cclxuICAgICAgeC5lID0gMDtcclxuICAgICAgeC5kID0gWzBdO1xyXG4gICAgICAvLyBDdG9yLnVuZGVyZmxvdyA9IHRydWU7XHJcbiAgICB9IC8vIGVsc2UgQ3Rvci51bmRlcmZsb3cgPSBmYWxzZTtcclxuICB9XHJcblxyXG4gIHJldHVybiB4O1xyXG59XHJcblxyXG5cclxuZnVuY3Rpb24gZmluaXRlVG9TdHJpbmcoeCwgaXNFeHAsIHNkKSB7XHJcbiAgaWYgKCF4LmlzRmluaXRlKCkpIHJldHVybiBub25GaW5pdGVUb1N0cmluZyh4KTtcclxuICB2YXIgayxcclxuICAgIGUgPSB4LmUsXHJcbiAgICBzdHIgPSBkaWdpdHNUb1N0cmluZyh4LmQpLFxyXG4gICAgbGVuID0gc3RyLmxlbmd0aDtcclxuXHJcbiAgaWYgKGlzRXhwKSB7XHJcbiAgICBpZiAoc2QgJiYgKGsgPSBzZCAtIGxlbikgPiAwKSB7XHJcbiAgICAgIHN0ciA9IHN0ci5jaGFyQXQoMCkgKyAnLicgKyBzdHIuc2xpY2UoMSkgKyBnZXRaZXJvU3RyaW5nKGspO1xyXG4gICAgfSBlbHNlIGlmIChsZW4gPiAxKSB7XHJcbiAgICAgIHN0ciA9IHN0ci5jaGFyQXQoMCkgKyAnLicgKyBzdHIuc2xpY2UoMSk7XHJcbiAgICB9XHJcblxyXG4gICAgc3RyID0gc3RyICsgKHguZSA8IDAgPyAnZScgOiAnZSsnKSArIHguZTtcclxuICB9IGVsc2UgaWYgKGUgPCAwKSB7XHJcbiAgICBzdHIgPSAnMC4nICsgZ2V0WmVyb1N0cmluZygtZSAtIDEpICsgc3RyO1xyXG4gICAgaWYgKHNkICYmIChrID0gc2QgLSBsZW4pID4gMCkgc3RyICs9IGdldFplcm9TdHJpbmcoayk7XHJcbiAgfSBlbHNlIGlmIChlID49IGxlbikge1xyXG4gICAgc3RyICs9IGdldFplcm9TdHJpbmcoZSArIDEgLSBsZW4pO1xyXG4gICAgaWYgKHNkICYmIChrID0gc2QgLSBlIC0gMSkgPiAwKSBzdHIgPSBzdHIgKyAnLicgKyBnZXRaZXJvU3RyaW5nKGspO1xyXG4gIH0gZWxzZSB7XHJcbiAgICBpZiAoKGsgPSBlICsgMSkgPCBsZW4pIHN0ciA9IHN0ci5zbGljZSgwLCBrKSArICcuJyArIHN0ci5zbGljZShrKTtcclxuICAgIGlmIChzZCAmJiAoayA9IHNkIC0gbGVuKSA+IDApIHtcclxuICAgICAgaWYgKGUgKyAxID09PSBsZW4pIHN0ciArPSAnLic7XHJcbiAgICAgIHN0ciArPSBnZXRaZXJvU3RyaW5nKGspO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgcmV0dXJuIHN0cjtcclxufVxyXG5cclxuXHJcbi8vIENhbGN1bGF0ZSB0aGUgYmFzZSAxMCBleHBvbmVudCBmcm9tIHRoZSBiYXNlIDFlNyBleHBvbmVudC5cclxuZnVuY3Rpb24gZ2V0QmFzZTEwRXhwb25lbnQoZGlnaXRzLCBlKSB7XHJcbiAgdmFyIHcgPSBkaWdpdHNbMF07XHJcblxyXG4gIC8vIEFkZCB0aGUgbnVtYmVyIG9mIGRpZ2l0cyBvZiB0aGUgZmlyc3Qgd29yZCBvZiB0aGUgZGlnaXRzIGFycmF5LlxyXG4gIGZvciAoIGUgKj0gTE9HX0JBU0U7IHcgPj0gMTA7IHcgLz0gMTApIGUrKztcclxuICByZXR1cm4gZTtcclxufVxyXG5cclxuXHJcbmZ1bmN0aW9uIGdldExuMTAoQ3Rvciwgc2QsIHByKSB7XHJcbiAgaWYgKHNkID4gTE4xMF9QUkVDSVNJT04pIHtcclxuXHJcbiAgICAvLyBSZXNldCBnbG9iYWwgc3RhdGUgaW4gY2FzZSB0aGUgZXhjZXB0aW9uIGlzIGNhdWdodC5cclxuICAgIGV4dGVybmFsID0gdHJ1ZTtcclxuICAgIGlmIChwcikgQ3Rvci5wcmVjaXNpb24gPSBwcjtcclxuICAgIHRocm93IEVycm9yKHByZWNpc2lvbkxpbWl0RXhjZWVkZWQpO1xyXG4gIH1cclxuICByZXR1cm4gZmluYWxpc2UobmV3IEN0b3IoTE4xMCksIHNkLCAxLCB0cnVlKTtcclxufVxyXG5cclxuXHJcbmZ1bmN0aW9uIGdldFBpKEN0b3IsIHNkLCBybSkge1xyXG4gIGlmIChzZCA+IFBJX1BSRUNJU0lPTikgdGhyb3cgRXJyb3IocHJlY2lzaW9uTGltaXRFeGNlZWRlZCk7XHJcbiAgcmV0dXJuIGZpbmFsaXNlKG5ldyBDdG9yKFBJKSwgc2QsIHJtLCB0cnVlKTtcclxufVxyXG5cclxuXHJcbmZ1bmN0aW9uIGdldFByZWNpc2lvbihkaWdpdHMpIHtcclxuICB2YXIgdyA9IGRpZ2l0cy5sZW5ndGggLSAxLFxyXG4gICAgbGVuID0gdyAqIExPR19CQVNFICsgMTtcclxuXHJcbiAgdyA9IGRpZ2l0c1t3XTtcclxuXHJcbiAgLy8gSWYgbm9uLXplcm8uLi5cclxuICBpZiAodykge1xyXG5cclxuICAgIC8vIFN1YnRyYWN0IHRoZSBudW1iZXIgb2YgdHJhaWxpbmcgemVyb3Mgb2YgdGhlIGxhc3Qgd29yZC5cclxuICAgIGZvciAoOyB3ICUgMTAgPT0gMDsgdyAvPSAxMCkgbGVuLS07XHJcblxyXG4gICAgLy8gQWRkIHRoZSBudW1iZXIgb2YgZGlnaXRzIG9mIHRoZSBmaXJzdCB3b3JkLlxyXG4gICAgZm9yICh3ID0gZGlnaXRzWzBdOyB3ID49IDEwOyB3IC89IDEwKSBsZW4rKztcclxuICB9XHJcblxyXG4gIHJldHVybiBsZW47XHJcbn1cclxuXHJcblxyXG5mdW5jdGlvbiBnZXRaZXJvU3RyaW5nKGspIHtcclxuICB2YXIgenMgPSAnJztcclxuICBmb3IgKDsgay0tOykgenMgKz0gJzAnO1xyXG4gIHJldHVybiB6cztcclxufVxyXG5cclxuXHJcbi8qXHJcbiAqIFJldHVybiBhIG5ldyBEZWNpbWFsIHdob3NlIHZhbHVlIGlzIHRoZSB2YWx1ZSBvZiBEZWNpbWFsIGB4YCB0byB0aGUgcG93ZXIgYG5gLCB3aGVyZSBgbmAgaXMgYW5cclxuICogaW50ZWdlciBvZiB0eXBlIG51bWJlci5cclxuICpcclxuICogSW1wbGVtZW50cyAnZXhwb25lbnRpYXRpb24gYnkgc3F1YXJpbmcnLiBDYWxsZWQgYnkgYHBvd2AgYW5kIGBwYXJzZU90aGVyYC5cclxuICpcclxuICovXHJcbmZ1bmN0aW9uIGludFBvdyhDdG9yLCB4LCBuLCBwcikge1xyXG4gIHZhciBpc1RydW5jYXRlZCxcclxuICAgIHIgPSBuZXcgQ3RvcigxKSxcclxuXHJcbiAgICAvLyBNYXggbiBvZiA5MDA3MTk5MjU0NzQwOTkxIHRha2VzIDUzIGxvb3AgaXRlcmF0aW9ucy5cclxuICAgIC8vIE1heGltdW0gZGlnaXRzIGFycmF5IGxlbmd0aDsgbGVhdmVzIFsyOCwgMzRdIGd1YXJkIGRpZ2l0cy5cclxuICAgIGsgPSBNYXRoLmNlaWwocHIgLyBMT0dfQkFTRSArIDQpO1xyXG5cclxuICBleHRlcm5hbCA9IGZhbHNlO1xyXG5cclxuICBmb3IgKDs7KSB7XHJcbiAgICBpZiAobiAlIDIpIHtcclxuICAgICAgciA9IHIudGltZXMoeCk7XHJcbiAgICAgIGlmICh0cnVuY2F0ZShyLmQsIGspKSBpc1RydW5jYXRlZCA9IHRydWU7XHJcbiAgICB9XHJcblxyXG4gICAgbiA9IG1hdGhmbG9vcihuIC8gMik7XHJcbiAgICBpZiAobiA9PT0gMCkge1xyXG5cclxuICAgICAgLy8gVG8gZW5zdXJlIGNvcnJlY3Qgcm91bmRpbmcgd2hlbiByLmQgaXMgdHJ1bmNhdGVkLCBpbmNyZW1lbnQgdGhlIGxhc3Qgd29yZCBpZiBpdCBpcyB6ZXJvLlxyXG4gICAgICBuID0gci5kLmxlbmd0aCAtIDE7XHJcbiAgICAgIGlmIChpc1RydW5jYXRlZCAmJiByLmRbbl0gPT09IDApICsrci5kW25dO1xyXG4gICAgICBicmVhaztcclxuICAgIH1cclxuXHJcbiAgICB4ID0geC50aW1lcyh4KTtcclxuICAgIHRydW5jYXRlKHguZCwgayk7XHJcbiAgfVxyXG5cclxuICBleHRlcm5hbCA9IHRydWU7XHJcblxyXG4gIHJldHVybiByO1xyXG59XHJcblxyXG5cclxuZnVuY3Rpb24gaXNPZGQobikge1xyXG4gIHJldHVybiBuLmRbbi5kLmxlbmd0aCAtIDFdICYgMTtcclxufVxyXG5cclxuXHJcbi8qXHJcbiAqIEhhbmRsZSBgbWF4YCBhbmQgYG1pbmAuIGBsdGd0YCBpcyAnbHQnIG9yICdndCcuXHJcbiAqL1xyXG5mdW5jdGlvbiBtYXhPck1pbihDdG9yLCBhcmdzLCBsdGd0KSB7XHJcbiAgdmFyIHksXHJcbiAgICB4ID0gbmV3IEN0b3IoYXJnc1swXSksXHJcbiAgICBpID0gMDtcclxuXHJcbiAgZm9yICg7ICsraSA8IGFyZ3MubGVuZ3RoOykge1xyXG4gICAgeSA9IG5ldyBDdG9yKGFyZ3NbaV0pO1xyXG4gICAgaWYgKCF5LnMpIHtcclxuICAgICAgeCA9IHk7XHJcbiAgICAgIGJyZWFrO1xyXG4gICAgfSBlbHNlIGlmICh4W2x0Z3RdKHkpKSB7XHJcbiAgICAgIHggPSB5O1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgcmV0dXJuIHg7XHJcbn1cclxuXHJcblxyXG4vKlxyXG4gKiBSZXR1cm4gYSBuZXcgRGVjaW1hbCB3aG9zZSB2YWx1ZSBpcyB0aGUgbmF0dXJhbCBleHBvbmVudGlhbCBvZiBgeGAgcm91bmRlZCB0byBgc2RgIHNpZ25pZmljYW50XHJcbiAqIGRpZ2l0cy5cclxuICpcclxuICogVGF5bG9yL01hY2xhdXJpbiBzZXJpZXMuXHJcbiAqXHJcbiAqIGV4cCh4KSA9IHheMC8wISArIHheMS8xISArIHheMi8yISArIHheMy8zISArIC4uLlxyXG4gKlxyXG4gKiBBcmd1bWVudCByZWR1Y3Rpb246XHJcbiAqICAgUmVwZWF0IHggPSB4IC8gMzIsIGsgKz0gNSwgdW50aWwgfHh8IDwgMC4xXHJcbiAqICAgZXhwKHgpID0gZXhwKHggLyAyXmspXigyXmspXHJcbiAqXHJcbiAqIFByZXZpb3VzbHksIHRoZSBhcmd1bWVudCB3YXMgaW5pdGlhbGx5IHJlZHVjZWQgYnlcclxuICogZXhwKHgpID0gZXhwKHIpICogMTBeayAgd2hlcmUgciA9IHggLSBrICogbG4xMCwgayA9IGZsb29yKHggLyBsbjEwKVxyXG4gKiB0byBmaXJzdCBwdXQgciBpbiB0aGUgcmFuZ2UgWzAsIGxuMTBdLCBiZWZvcmUgZGl2aWRpbmcgYnkgMzIgdW50aWwgfHh8IDwgMC4xLCBidXQgdGhpcyB3YXNcclxuICogZm91bmQgdG8gYmUgc2xvd2VyIHRoYW4ganVzdCBkaXZpZGluZyByZXBlYXRlZGx5IGJ5IDMyIGFzIGFib3ZlLlxyXG4gKlxyXG4gKiBNYXggaW50ZWdlciBhcmd1bWVudDogZXhwKCcyMDcyMzI2NTgzNjk0NjQxMycpID0gNi4zZSs5MDAwMDAwMDAwMDAwMDAwXHJcbiAqIE1pbiBpbnRlZ2VyIGFyZ3VtZW50OiBleHAoJy0yMDcyMzI2NTgzNjk0NjQxMScpID0gMS4yZS05MDAwMDAwMDAwMDAwMDAwXHJcbiAqIChNYXRoIG9iamVjdCBpbnRlZ2VyIG1pbi9tYXg6IE1hdGguZXhwKDcwOSkgPSA4LjJlKzMwNywgTWF0aC5leHAoLTc0NSkgPSA1ZS0zMjQpXHJcbiAqXHJcbiAqICBleHAoSW5maW5pdHkpICA9IEluZmluaXR5XHJcbiAqICBleHAoLUluZmluaXR5KSA9IDBcclxuICogIGV4cChOYU4pICAgICAgID0gTmFOXHJcbiAqICBleHAoXHUwMEIxMCkgICAgICAgID0gMVxyXG4gKlxyXG4gKiAgZXhwKHgpIGlzIG5vbi10ZXJtaW5hdGluZyBmb3IgYW55IGZpbml0ZSwgbm9uLXplcm8geC5cclxuICpcclxuICogIFRoZSByZXN1bHQgd2lsbCBhbHdheXMgYmUgY29ycmVjdGx5IHJvdW5kZWQuXHJcbiAqXHJcbiAqL1xyXG5mdW5jdGlvbiBuYXR1cmFsRXhwb25lbnRpYWwoeCwgc2QpIHtcclxuICB2YXIgZGVub21pbmF0b3IsIGd1YXJkLCBqLCBwb3csIHN1bSwgdCwgd3ByLFxyXG4gICAgcmVwID0gMCxcclxuICAgIGkgPSAwLFxyXG4gICAgayA9IDAsXHJcbiAgICBDdG9yID0geC5jb25zdHJ1Y3RvcixcclxuICAgIHJtID0gQ3Rvci5yb3VuZGluZyxcclxuICAgIHByID0gQ3Rvci5wcmVjaXNpb247XHJcblxyXG4gIC8vIDAvTmFOL0luZmluaXR5P1xyXG4gIGlmICgheC5kIHx8ICF4LmRbMF0gfHwgeC5lID4gMTcpIHtcclxuXHJcbiAgICByZXR1cm4gbmV3IEN0b3IoeC5kXHJcbiAgICAgID8gIXguZFswXSA/IDEgOiB4LnMgPCAwID8gMCA6IDEgLyAwXHJcbiAgICAgIDogeC5zID8geC5zIDwgMCA/IDAgOiB4IDogMCAvIDApO1xyXG4gIH1cclxuXHJcbiAgaWYgKHNkID09IG51bGwpIHtcclxuICAgIGV4dGVybmFsID0gZmFsc2U7XHJcbiAgICB3cHIgPSBwcjtcclxuICB9IGVsc2Uge1xyXG4gICAgd3ByID0gc2Q7XHJcbiAgfVxyXG5cclxuICB0ID0gbmV3IEN0b3IoMC4wMzEyNSk7XHJcblxyXG4gIC8vIHdoaWxlIGFicyh4KSA+PSAwLjFcclxuICB3aGlsZSAoeC5lID4gLTIpIHtcclxuXHJcbiAgICAvLyB4ID0geCAvIDJeNVxyXG4gICAgeCA9IHgudGltZXModCk7XHJcbiAgICBrICs9IDU7XHJcbiAgfVxyXG5cclxuICAvLyBVc2UgMiAqIGxvZzEwKDJeaykgKyA1IChlbXBpcmljYWxseSBkZXJpdmVkKSB0byBlc3RpbWF0ZSB0aGUgaW5jcmVhc2UgaW4gcHJlY2lzaW9uXHJcbiAgLy8gbmVjZXNzYXJ5IHRvIGVuc3VyZSB0aGUgZmlyc3QgNCByb3VuZGluZyBkaWdpdHMgYXJlIGNvcnJlY3QuXHJcbiAgZ3VhcmQgPSBNYXRoLmxvZyhtYXRocG93KDIsIGspKSAvIE1hdGguTE4xMCAqIDIgKyA1IHwgMDtcclxuICB3cHIgKz0gZ3VhcmQ7XHJcbiAgZGVub21pbmF0b3IgPSBwb3cgPSBzdW0gPSBuZXcgQ3RvcigxKTtcclxuICBDdG9yLnByZWNpc2lvbiA9IHdwcjtcclxuXHJcbiAgZm9yICg7Oykge1xyXG4gICAgcG93ID0gZmluYWxpc2UocG93LnRpbWVzKHgpLCB3cHIsIDEpO1xyXG4gICAgZGVub21pbmF0b3IgPSBkZW5vbWluYXRvci50aW1lcygrK2kpO1xyXG4gICAgdCA9IHN1bS5wbHVzKGRpdmlkZShwb3csIGRlbm9taW5hdG9yLCB3cHIsIDEpKTtcclxuXHJcbiAgICBpZiAoZGlnaXRzVG9TdHJpbmcodC5kKS5zbGljZSgwLCB3cHIpID09PSBkaWdpdHNUb1N0cmluZyhzdW0uZCkuc2xpY2UoMCwgd3ByKSkge1xyXG4gICAgICBqID0gaztcclxuICAgICAgd2hpbGUgKGotLSkgc3VtID0gZmluYWxpc2Uoc3VtLnRpbWVzKHN1bSksIHdwciwgMSk7XHJcblxyXG4gICAgICAvLyBDaGVjayB0byBzZWUgaWYgdGhlIGZpcnN0IDQgcm91bmRpbmcgZGlnaXRzIGFyZSBbNDldOTk5LlxyXG4gICAgICAvLyBJZiBzbywgcmVwZWF0IHRoZSBzdW1tYXRpb24gd2l0aCBhIGhpZ2hlciBwcmVjaXNpb24sIG90aGVyd2lzZVxyXG4gICAgICAvLyBlLmcuIHdpdGggcHJlY2lzaW9uOiAxOCwgcm91bmRpbmc6IDFcclxuICAgICAgLy8gZXhwKDE4LjQwNDI3MjQ2MjU5NTAzNDA4MzU2Nzc5MzkxOTg0Mzc2MSkgPSA5ODM3MjU2MC4xMjI5OTk5OTk5IChzaG91bGQgYmUgOTgzNzI1NjAuMTIzKVxyXG4gICAgICAvLyBgd3ByIC0gZ3VhcmRgIGlzIHRoZSBpbmRleCBvZiBmaXJzdCByb3VuZGluZyBkaWdpdC5cclxuICAgICAgaWYgKHNkID09IG51bGwpIHtcclxuXHJcbiAgICAgICAgaWYgKHJlcCA8IDMgJiYgY2hlY2tSb3VuZGluZ0RpZ2l0cyhzdW0uZCwgd3ByIC0gZ3VhcmQsIHJtLCByZXApKSB7XHJcbiAgICAgICAgICBDdG9yLnByZWNpc2lvbiA9IHdwciArPSAxMDtcclxuICAgICAgICAgIGRlbm9taW5hdG9yID0gcG93ID0gdCA9IG5ldyBDdG9yKDEpO1xyXG4gICAgICAgICAgaSA9IDA7XHJcbiAgICAgICAgICByZXArKztcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgcmV0dXJuIGZpbmFsaXNlKHN1bSwgQ3Rvci5wcmVjaXNpb24gPSBwciwgcm0sIGV4dGVybmFsID0gdHJ1ZSk7XHJcbiAgICAgICAgfVxyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIEN0b3IucHJlY2lzaW9uID0gcHI7XHJcbiAgICAgICAgcmV0dXJuIHN1bTtcclxuICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHN1bSA9IHQ7XHJcbiAgfVxyXG59XHJcblxyXG5cclxuLypcclxuICogUmV0dXJuIGEgbmV3IERlY2ltYWwgd2hvc2UgdmFsdWUgaXMgdGhlIG5hdHVyYWwgbG9nYXJpdGhtIG9mIGB4YCByb3VuZGVkIHRvIGBzZGAgc2lnbmlmaWNhbnRcclxuICogZGlnaXRzLlxyXG4gKlxyXG4gKiAgbG4oLW4pICAgICAgICA9IE5hTlxyXG4gKiAgbG4oMCkgICAgICAgICA9IC1JbmZpbml0eVxyXG4gKiAgbG4oLTApICAgICAgICA9IC1JbmZpbml0eVxyXG4gKiAgbG4oMSkgICAgICAgICA9IDBcclxuICogIGxuKEluZmluaXR5KSAgPSBJbmZpbml0eVxyXG4gKiAgbG4oLUluZmluaXR5KSA9IE5hTlxyXG4gKiAgbG4oTmFOKSAgICAgICA9IE5hTlxyXG4gKlxyXG4gKiAgbG4obikgKG4gIT0gMSkgaXMgbm9uLXRlcm1pbmF0aW5nLlxyXG4gKlxyXG4gKi9cclxuZnVuY3Rpb24gbmF0dXJhbExvZ2FyaXRobSh5LCBzZCkge1xyXG4gIHZhciBjLCBjMCwgZGVub21pbmF0b3IsIGUsIG51bWVyYXRvciwgcmVwLCBzdW0sIHQsIHdwciwgeDEsIHgyLFxyXG4gICAgbiA9IDEsXHJcbiAgICBndWFyZCA9IDEwLFxyXG4gICAgeCA9IHksXHJcbiAgICB4ZCA9IHguZCxcclxuICAgIEN0b3IgPSB4LmNvbnN0cnVjdG9yLFxyXG4gICAgcm0gPSBDdG9yLnJvdW5kaW5nLFxyXG4gICAgcHIgPSBDdG9yLnByZWNpc2lvbjtcclxuXHJcbiAgLy8gSXMgeCBuZWdhdGl2ZSBvciBJbmZpbml0eSwgTmFOLCAwIG9yIDE/XHJcbiAgaWYgKHgucyA8IDAgfHwgIXhkIHx8ICF4ZFswXSB8fCAheC5lICYmIHhkWzBdID09IDEgJiYgeGQubGVuZ3RoID09IDEpIHtcclxuICAgIHJldHVybiBuZXcgQ3Rvcih4ZCAmJiAheGRbMF0gPyAtMSAvIDAgOiB4LnMgIT0gMSA/IE5hTiA6IHhkID8gMCA6IHgpO1xyXG4gIH1cclxuXHJcbiAgaWYgKHNkID09IG51bGwpIHtcclxuICAgIGV4dGVybmFsID0gZmFsc2U7XHJcbiAgICB3cHIgPSBwcjtcclxuICB9IGVsc2Uge1xyXG4gICAgd3ByID0gc2Q7XHJcbiAgfVxyXG5cclxuICBDdG9yLnByZWNpc2lvbiA9IHdwciArPSBndWFyZDtcclxuICBjID0gZGlnaXRzVG9TdHJpbmcoeGQpO1xyXG4gIGMwID0gYy5jaGFyQXQoMCk7XHJcblxyXG4gIGlmIChNYXRoLmFicyhlID0geC5lKSA8IDEuNWUxNSkge1xyXG5cclxuICAgIC8vIEFyZ3VtZW50IHJlZHVjdGlvbi5cclxuICAgIC8vIFRoZSBzZXJpZXMgY29udmVyZ2VzIGZhc3RlciB0aGUgY2xvc2VyIHRoZSBhcmd1bWVudCBpcyB0byAxLCBzbyB1c2luZ1xyXG4gICAgLy8gbG4oYV5iKSA9IGIgKiBsbihhKSwgICBsbihhKSA9IGxuKGFeYikgLyBiXHJcbiAgICAvLyBtdWx0aXBseSB0aGUgYXJndW1lbnQgYnkgaXRzZWxmIHVudGlsIHRoZSBsZWFkaW5nIGRpZ2l0cyBvZiB0aGUgc2lnbmlmaWNhbmQgYXJlIDcsIDgsIDksXHJcbiAgICAvLyAxMCwgMTEsIDEyIG9yIDEzLCByZWNvcmRpbmcgdGhlIG51bWJlciBvZiBtdWx0aXBsaWNhdGlvbnMgc28gdGhlIHN1bSBvZiB0aGUgc2VyaWVzIGNhblxyXG4gICAgLy8gbGF0ZXIgYmUgZGl2aWRlZCBieSB0aGlzIG51bWJlciwgdGhlbiBzZXBhcmF0ZSBvdXQgdGhlIHBvd2VyIG9mIDEwIHVzaW5nXHJcbiAgICAvLyBsbihhKjEwXmIpID0gbG4oYSkgKyBiKmxuKDEwKS5cclxuXHJcbiAgICAvLyBtYXggbiBpcyAyMSAoZ2l2ZXMgMC45LCAxLjAgb3IgMS4xKSAoOWUxNSAvIDIxID0gNC4yZTE0KS5cclxuICAgIC8vd2hpbGUgKGMwIDwgOSAmJiBjMCAhPSAxIHx8IGMwID09IDEgJiYgYy5jaGFyQXQoMSkgPiAxKSB7XHJcbiAgICAvLyBtYXggbiBpcyA2IChnaXZlcyAwLjcgLSAxLjMpXHJcbiAgICB3aGlsZSAoYzAgPCA3ICYmIGMwICE9IDEgfHwgYzAgPT0gMSAmJiBjLmNoYXJBdCgxKSA+IDMpIHtcclxuICAgICAgeCA9IHgudGltZXMoeSk7XHJcbiAgICAgIGMgPSBkaWdpdHNUb1N0cmluZyh4LmQpO1xyXG4gICAgICBjMCA9IGMuY2hhckF0KDApO1xyXG4gICAgICBuKys7XHJcbiAgICB9XHJcblxyXG4gICAgZSA9IHguZTtcclxuXHJcbiAgICBpZiAoYzAgPiAxKSB7XHJcbiAgICAgIHggPSBuZXcgQ3RvcignMC4nICsgYyk7XHJcbiAgICAgIGUrKztcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIHggPSBuZXcgQ3RvcihjMCArICcuJyArIGMuc2xpY2UoMSkpO1xyXG4gICAgfVxyXG4gIH0gZWxzZSB7XHJcblxyXG4gICAgLy8gVGhlIGFyZ3VtZW50IHJlZHVjdGlvbiBtZXRob2QgYWJvdmUgbWF5IHJlc3VsdCBpbiBvdmVyZmxvdyBpZiB0aGUgYXJndW1lbnQgeSBpcyBhIG1hc3NpdmVcclxuICAgIC8vIG51bWJlciB3aXRoIGV4cG9uZW50ID49IDE1MDAwMDAwMDAwMDAwMDAgKDllMTUgLyA2ID0gMS41ZTE1KSwgc28gaW5zdGVhZCByZWNhbGwgdGhpc1xyXG4gICAgLy8gZnVuY3Rpb24gdXNpbmcgbG4oeCoxMF5lKSA9IGxuKHgpICsgZSpsbigxMCkuXHJcbiAgICB0ID0gZ2V0TG4xMChDdG9yLCB3cHIgKyAyLCBwcikudGltZXMoZSArICcnKTtcclxuICAgIHggPSBuYXR1cmFsTG9nYXJpdGhtKG5ldyBDdG9yKGMwICsgJy4nICsgYy5zbGljZSgxKSksIHdwciAtIGd1YXJkKS5wbHVzKHQpO1xyXG4gICAgQ3Rvci5wcmVjaXNpb24gPSBwcjtcclxuXHJcbiAgICByZXR1cm4gc2QgPT0gbnVsbCA/IGZpbmFsaXNlKHgsIHByLCBybSwgZXh0ZXJuYWwgPSB0cnVlKSA6IHg7XHJcbiAgfVxyXG5cclxuICAvLyB4MSBpcyB4IHJlZHVjZWQgdG8gYSB2YWx1ZSBuZWFyIDEuXHJcbiAgeDEgPSB4O1xyXG5cclxuICAvLyBUYXlsb3Igc2VyaWVzLlxyXG4gIC8vIGxuKHkpID0gbG4oKDEgKyB4KS8oMSAtIHgpKSA9IDIoeCArIHheMy8zICsgeF41LzUgKyB4XjcvNyArIC4uLilcclxuICAvLyB3aGVyZSB4ID0gKHkgLSAxKS8oeSArIDEpICAgICh8eHwgPCAxKVxyXG4gIHN1bSA9IG51bWVyYXRvciA9IHggPSBkaXZpZGUoeC5taW51cygxKSwgeC5wbHVzKDEpLCB3cHIsIDEpO1xyXG4gIHgyID0gZmluYWxpc2UoeC50aW1lcyh4KSwgd3ByLCAxKTtcclxuICBkZW5vbWluYXRvciA9IDM7XHJcblxyXG4gIGZvciAoOzspIHtcclxuICAgIG51bWVyYXRvciA9IGZpbmFsaXNlKG51bWVyYXRvci50aW1lcyh4MiksIHdwciwgMSk7XHJcbiAgICB0ID0gc3VtLnBsdXMoZGl2aWRlKG51bWVyYXRvciwgbmV3IEN0b3IoZGVub21pbmF0b3IpLCB3cHIsIDEpKTtcclxuXHJcbiAgICBpZiAoZGlnaXRzVG9TdHJpbmcodC5kKS5zbGljZSgwLCB3cHIpID09PSBkaWdpdHNUb1N0cmluZyhzdW0uZCkuc2xpY2UoMCwgd3ByKSkge1xyXG4gICAgICBzdW0gPSBzdW0udGltZXMoMik7XHJcblxyXG4gICAgICAvLyBSZXZlcnNlIHRoZSBhcmd1bWVudCByZWR1Y3Rpb24uIENoZWNrIHRoYXQgZSBpcyBub3QgMCBiZWNhdXNlLCBiZXNpZGVzIHByZXZlbnRpbmcgYW5cclxuICAgICAgLy8gdW5uZWNlc3NhcnkgY2FsY3VsYXRpb24sIC0wICsgMCA9ICswIGFuZCB0byBlbnN1cmUgY29ycmVjdCByb3VuZGluZyAtMCBuZWVkcyB0byBzdGF5IC0wLlxyXG4gICAgICBpZiAoZSAhPT0gMCkgc3VtID0gc3VtLnBsdXMoZ2V0TG4xMChDdG9yLCB3cHIgKyAyLCBwcikudGltZXMoZSArICcnKSk7XHJcbiAgICAgIHN1bSA9IGRpdmlkZShzdW0sIG5ldyBDdG9yKG4pLCB3cHIsIDEpO1xyXG5cclxuICAgICAgLy8gSXMgcm0gPiAzIGFuZCB0aGUgZmlyc3QgNCByb3VuZGluZyBkaWdpdHMgNDk5OSwgb3Igcm0gPCA0IChvciB0aGUgc3VtbWF0aW9uIGhhc1xyXG4gICAgICAvLyBiZWVuIHJlcGVhdGVkIHByZXZpb3VzbHkpIGFuZCB0aGUgZmlyc3QgNCByb3VuZGluZyBkaWdpdHMgOTk5OT9cclxuICAgICAgLy8gSWYgc28sIHJlc3RhcnQgdGhlIHN1bW1hdGlvbiB3aXRoIGEgaGlnaGVyIHByZWNpc2lvbiwgb3RoZXJ3aXNlXHJcbiAgICAgIC8vIGUuZy4gd2l0aCBwcmVjaXNpb246IDEyLCByb3VuZGluZzogMVxyXG4gICAgICAvLyBsbigxMzU1MjAwMjguNjEyNjA5MTcxNDI2NTM4MTUzMykgPSAxOC43MjQ2Mjk5OTk5IHdoZW4gaXQgc2hvdWxkIGJlIDE4LjcyNDYzLlxyXG4gICAgICAvLyBgd3ByIC0gZ3VhcmRgIGlzIHRoZSBpbmRleCBvZiBmaXJzdCByb3VuZGluZyBkaWdpdC5cclxuICAgICAgaWYgKHNkID09IG51bGwpIHtcclxuICAgICAgICBpZiAoY2hlY2tSb3VuZGluZ0RpZ2l0cyhzdW0uZCwgd3ByIC0gZ3VhcmQsIHJtLCByZXApKSB7XHJcbiAgICAgICAgICBDdG9yLnByZWNpc2lvbiA9IHdwciArPSBndWFyZDtcclxuICAgICAgICAgIHQgPSBudW1lcmF0b3IgPSB4ID0gZGl2aWRlKHgxLm1pbnVzKDEpLCB4MS5wbHVzKDEpLCB3cHIsIDEpO1xyXG4gICAgICAgICAgeDIgPSBmaW5hbGlzZSh4LnRpbWVzKHgpLCB3cHIsIDEpO1xyXG4gICAgICAgICAgZGVub21pbmF0b3IgPSByZXAgPSAxO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICByZXR1cm4gZmluYWxpc2Uoc3VtLCBDdG9yLnByZWNpc2lvbiA9IHByLCBybSwgZXh0ZXJuYWwgPSB0cnVlKTtcclxuICAgICAgICB9XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgQ3Rvci5wcmVjaXNpb24gPSBwcjtcclxuICAgICAgICByZXR1cm4gc3VtO1xyXG4gICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgc3VtID0gdDtcclxuICAgIGRlbm9taW5hdG9yICs9IDI7XHJcbiAgfVxyXG59XHJcblxyXG5cclxuLy8gXHUwMEIxSW5maW5pdHksIE5hTi5cclxuZnVuY3Rpb24gbm9uRmluaXRlVG9TdHJpbmcoeCkge1xyXG4gIC8vIFVuc2lnbmVkLlxyXG4gIHJldHVybiBTdHJpbmcoeC5zICogeC5zIC8gMCk7XHJcbn1cclxuXHJcblxyXG4vKlxyXG4gKiBQYXJzZSB0aGUgdmFsdWUgb2YgYSBuZXcgRGVjaW1hbCBgeGAgZnJvbSBzdHJpbmcgYHN0cmAuXHJcbiAqL1xyXG5mdW5jdGlvbiBwYXJzZURlY2ltYWwoeCwgc3RyKSB7XHJcbiAgdmFyIGUsIGksIGxlbjtcclxuXHJcbiAgLy8gRGVjaW1hbCBwb2ludD9cclxuICBpZiAoKGUgPSBzdHIuaW5kZXhPZignLicpKSA+IC0xKSBzdHIgPSBzdHIucmVwbGFjZSgnLicsICcnKTtcclxuXHJcbiAgLy8gRXhwb25lbnRpYWwgZm9ybT9cclxuICBpZiAoKGkgPSBzdHIuc2VhcmNoKC9lL2kpKSA+IDApIHtcclxuXHJcbiAgICAvLyBEZXRlcm1pbmUgZXhwb25lbnQuXHJcbiAgICBpZiAoZSA8IDApIGUgPSBpO1xyXG4gICAgZSArPSArc3RyLnNsaWNlKGkgKyAxKTtcclxuICAgIHN0ciA9IHN0ci5zdWJzdHJpbmcoMCwgaSk7XHJcbiAgfSBlbHNlIGlmIChlIDwgMCkge1xyXG5cclxuICAgIC8vIEludGVnZXIuXHJcbiAgICBlID0gc3RyLmxlbmd0aDtcclxuICB9XHJcblxyXG4gIC8vIERldGVybWluZSBsZWFkaW5nIHplcm9zLlxyXG4gIGZvciAoaSA9IDA7IHN0ci5jaGFyQ29kZUF0KGkpID09PSA0ODsgaSsrKTtcclxuXHJcbiAgLy8gRGV0ZXJtaW5lIHRyYWlsaW5nIHplcm9zLlxyXG4gIGZvciAobGVuID0gc3RyLmxlbmd0aDsgc3RyLmNoYXJDb2RlQXQobGVuIC0gMSkgPT09IDQ4OyAtLWxlbik7XHJcbiAgc3RyID0gc3RyLnNsaWNlKGksIGxlbik7XHJcblxyXG4gIGlmIChzdHIpIHtcclxuICAgIGxlbiAtPSBpO1xyXG4gICAgeC5lID0gZSA9IGUgLSBpIC0gMTtcclxuICAgIHguZCA9IFtdO1xyXG5cclxuICAgIC8vIFRyYW5zZm9ybSBiYXNlXHJcblxyXG4gICAgLy8gZSBpcyB0aGUgYmFzZSAxMCBleHBvbmVudC5cclxuICAgIC8vIGkgaXMgd2hlcmUgdG8gc2xpY2Ugc3RyIHRvIGdldCB0aGUgZmlyc3Qgd29yZCBvZiB0aGUgZGlnaXRzIGFycmF5LlxyXG4gICAgaSA9IChlICsgMSkgJSBMT0dfQkFTRTtcclxuICAgIGlmIChlIDwgMCkgaSArPSBMT0dfQkFTRTtcclxuXHJcbiAgICBpZiAoaSA8IGxlbikge1xyXG4gICAgICBpZiAoaSkgeC5kLnB1c2goK3N0ci5zbGljZSgwLCBpKSk7XHJcbiAgICAgIGZvciAobGVuIC09IExPR19CQVNFOyBpIDwgbGVuOykgeC5kLnB1c2goK3N0ci5zbGljZShpLCBpICs9IExPR19CQVNFKSk7XHJcbiAgICAgIHN0ciA9IHN0ci5zbGljZShpKTtcclxuICAgICAgaSA9IExPR19CQVNFIC0gc3RyLmxlbmd0aDtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIGkgLT0gbGVuO1xyXG4gICAgfVxyXG5cclxuICAgIGZvciAoOyBpLS07KSBzdHIgKz0gJzAnO1xyXG4gICAgeC5kLnB1c2goK3N0cik7XHJcblxyXG4gICAgaWYgKGV4dGVybmFsKSB7XHJcblxyXG4gICAgICAvLyBPdmVyZmxvdz9cclxuICAgICAgaWYgKHguZSA+IHguY29uc3RydWN0b3IubWF4RSkge1xyXG5cclxuICAgICAgICAvLyBJbmZpbml0eS5cclxuICAgICAgICB4LmQgPSBudWxsO1xyXG4gICAgICAgIHguZSA9IE5hTjtcclxuXHJcbiAgICAgIC8vIFVuZGVyZmxvdz9cclxuICAgICAgfSBlbHNlIGlmICh4LmUgPCB4LmNvbnN0cnVjdG9yLm1pbkUpIHtcclxuXHJcbiAgICAgICAgLy8gWmVyby5cclxuICAgICAgICB4LmUgPSAwO1xyXG4gICAgICAgIHguZCA9IFswXTtcclxuICAgICAgICAvLyB4LmNvbnN0cnVjdG9yLnVuZGVyZmxvdyA9IHRydWU7XHJcbiAgICAgIH0gLy8gZWxzZSB4LmNvbnN0cnVjdG9yLnVuZGVyZmxvdyA9IGZhbHNlO1xyXG4gICAgfVxyXG4gIH0gZWxzZSB7XHJcblxyXG4gICAgLy8gWmVyby5cclxuICAgIHguZSA9IDA7XHJcbiAgICB4LmQgPSBbMF07XHJcbiAgfVxyXG5cclxuICByZXR1cm4geDtcclxufVxyXG5cclxuXHJcbi8qXHJcbiAqIFBhcnNlIHRoZSB2YWx1ZSBvZiBhIG5ldyBEZWNpbWFsIGB4YCBmcm9tIGEgc3RyaW5nIGBzdHJgLCB3aGljaCBpcyBub3QgYSBkZWNpbWFsIHZhbHVlLlxyXG4gKi9cclxuZnVuY3Rpb24gcGFyc2VPdGhlcih4LCBzdHIpIHtcclxuICB2YXIgYmFzZSwgQ3RvciwgZGl2aXNvciwgaSwgaXNGbG9hdCwgbGVuLCBwLCB4ZCwgeGU7XHJcblxyXG4gIGlmIChzdHIuaW5kZXhPZignXycpID4gLTEpIHtcclxuICAgIHN0ciA9IHN0ci5yZXBsYWNlKC8oXFxkKV8oPz1cXGQpL2csICckMScpO1xyXG4gICAgaWYgKGlzRGVjaW1hbC50ZXN0KHN0cikpIHJldHVybiBwYXJzZURlY2ltYWwoeCwgc3RyKTtcclxuICB9IGVsc2UgaWYgKHN0ciA9PT0gJ0luZmluaXR5JyB8fCBzdHIgPT09ICdOYU4nKSB7XHJcbiAgICBpZiAoIStzdHIpIHgucyA9IE5hTjtcclxuICAgIHguZSA9IE5hTjtcclxuICAgIHguZCA9IG51bGw7XHJcbiAgICByZXR1cm4geDtcclxuICB9XHJcblxyXG4gIGlmIChpc0hleC50ZXN0KHN0cikpICB7XHJcbiAgICBiYXNlID0gMTY7XHJcbiAgICBzdHIgPSBzdHIudG9Mb3dlckNhc2UoKTtcclxuICB9IGVsc2UgaWYgKGlzQmluYXJ5LnRlc3Qoc3RyKSkgIHtcclxuICAgIGJhc2UgPSAyO1xyXG4gIH0gZWxzZSBpZiAoaXNPY3RhbC50ZXN0KHN0cikpICB7XHJcbiAgICBiYXNlID0gODtcclxuICB9IGVsc2Uge1xyXG4gICAgdGhyb3cgRXJyb3IoaW52YWxpZEFyZ3VtZW50ICsgc3RyKTtcclxuICB9XHJcblxyXG4gIC8vIElzIHRoZXJlIGEgYmluYXJ5IGV4cG9uZW50IHBhcnQ/XHJcbiAgaSA9IHN0ci5zZWFyY2goL3AvaSk7XHJcblxyXG4gIGlmIChpID4gMCkge1xyXG4gICAgcCA9ICtzdHIuc2xpY2UoaSArIDEpO1xyXG4gICAgc3RyID0gc3RyLnN1YnN0cmluZygyLCBpKTtcclxuICB9IGVsc2Uge1xyXG4gICAgc3RyID0gc3RyLnNsaWNlKDIpO1xyXG4gIH1cclxuXHJcbiAgLy8gQ29udmVydCBgc3RyYCBhcyBhbiBpbnRlZ2VyIHRoZW4gZGl2aWRlIHRoZSByZXN1bHQgYnkgYGJhc2VgIHJhaXNlZCB0byBhIHBvd2VyIHN1Y2ggdGhhdCB0aGVcclxuICAvLyBmcmFjdGlvbiBwYXJ0IHdpbGwgYmUgcmVzdG9yZWQuXHJcbiAgaSA9IHN0ci5pbmRleE9mKCcuJyk7XHJcbiAgaXNGbG9hdCA9IGkgPj0gMDtcclxuICBDdG9yID0geC5jb25zdHJ1Y3RvcjtcclxuXHJcbiAgaWYgKGlzRmxvYXQpIHtcclxuICAgIHN0ciA9IHN0ci5yZXBsYWNlKCcuJywgJycpO1xyXG4gICAgbGVuID0gc3RyLmxlbmd0aDtcclxuICAgIGkgPSBsZW4gLSBpO1xyXG5cclxuICAgIC8vIGxvZ1sxMF0oMTYpID0gMS4yMDQxLi4uICwgbG9nWzEwXSg4OCkgPSAxLjk0NDQuLi4uXHJcbiAgICBkaXZpc29yID0gaW50UG93KEN0b3IsIG5ldyBDdG9yKGJhc2UpLCBpLCBpICogMik7XHJcbiAgfVxyXG5cclxuICB4ZCA9IGNvbnZlcnRCYXNlKHN0ciwgYmFzZSwgQkFTRSk7XHJcbiAgeGUgPSB4ZC5sZW5ndGggLSAxO1xyXG5cclxuICAvLyBSZW1vdmUgdHJhaWxpbmcgemVyb3MuXHJcbiAgZm9yIChpID0geGU7IHhkW2ldID09PSAwOyAtLWkpIHhkLnBvcCgpO1xyXG4gIGlmIChpIDwgMCkgcmV0dXJuIG5ldyBDdG9yKHgucyAqIDApO1xyXG4gIHguZSA9IGdldEJhc2UxMEV4cG9uZW50KHhkLCB4ZSk7XHJcbiAgeC5kID0geGQ7XHJcbiAgZXh0ZXJuYWwgPSBmYWxzZTtcclxuXHJcbiAgLy8gQXQgd2hhdCBwcmVjaXNpb24gdG8gcGVyZm9ybSB0aGUgZGl2aXNpb24gdG8gZW5zdXJlIGV4YWN0IGNvbnZlcnNpb24/XHJcbiAgLy8gbWF4RGVjaW1hbEludGVnZXJQYXJ0RGlnaXRDb3VudCA9IGNlaWwobG9nWzEwXShiKSAqIG90aGVyQmFzZUludGVnZXJQYXJ0RGlnaXRDb3VudClcclxuICAvLyBsb2dbMTBdKDIpID0gMC4zMDEwMywgbG9nWzEwXSg4KSA9IDAuOTAzMDksIGxvZ1sxMF0oMTYpID0gMS4yMDQxMlxyXG4gIC8vIEUuZy4gY2VpbCgxLjIgKiAzKSA9IDQsIHNvIHVwIHRvIDQgZGVjaW1hbCBkaWdpdHMgYXJlIG5lZWRlZCB0byByZXByZXNlbnQgMyBoZXggaW50IGRpZ2l0cy5cclxuICAvLyBtYXhEZWNpbWFsRnJhY3Rpb25QYXJ0RGlnaXRDb3VudCA9IHtIZXg6NHxPY3Q6M3xCaW46MX0gKiBvdGhlckJhc2VGcmFjdGlvblBhcnREaWdpdENvdW50XHJcbiAgLy8gVGhlcmVmb3JlIHVzaW5nIDQgKiB0aGUgbnVtYmVyIG9mIGRpZ2l0cyBvZiBzdHIgd2lsbCBhbHdheXMgYmUgZW5vdWdoLlxyXG4gIGlmIChpc0Zsb2F0KSB4ID0gZGl2aWRlKHgsIGRpdmlzb3IsIGxlbiAqIDQpO1xyXG5cclxuICAvLyBNdWx0aXBseSBieSB0aGUgYmluYXJ5IGV4cG9uZW50IHBhcnQgaWYgcHJlc2VudC5cclxuICBpZiAocCkgeCA9IHgudGltZXMoTWF0aC5hYnMocCkgPCA1NCA/IG1hdGhwb3coMiwgcCkgOiBEZWNpbWFsLnBvdygyLCBwKSk7XHJcbiAgZXh0ZXJuYWwgPSB0cnVlO1xyXG5cclxuICByZXR1cm4geDtcclxufVxyXG5cclxuXHJcbi8qXHJcbiAqIHNpbih4KSA9IHggLSB4XjMvMyEgKyB4XjUvNSEgLSAuLi5cclxuICogfHh8IDwgcGkvMlxyXG4gKlxyXG4gKi9cclxuZnVuY3Rpb24gc2luZShDdG9yLCB4KSB7XHJcbiAgdmFyIGssXHJcbiAgICBsZW4gPSB4LmQubGVuZ3RoO1xyXG5cclxuICBpZiAobGVuIDwgMykge1xyXG4gICAgcmV0dXJuIHguaXNaZXJvKCkgPyB4IDogdGF5bG9yU2VyaWVzKEN0b3IsIDIsIHgsIHgpO1xyXG4gIH1cclxuXHJcbiAgLy8gQXJndW1lbnQgcmVkdWN0aW9uOiBzaW4oNXgpID0gMTYqc2luXjUoeCkgLSAyMCpzaW5eMyh4KSArIDUqc2luKHgpXHJcbiAgLy8gaS5lLiBzaW4oeCkgPSAxNipzaW5eNSh4LzUpIC0gMjAqc2luXjMoeC81KSArIDUqc2luKHgvNSlcclxuICAvLyBhbmQgIHNpbih4KSA9IHNpbih4LzUpKDUgKyBzaW5eMih4LzUpKDE2c2luXjIoeC81KSAtIDIwKSlcclxuXHJcbiAgLy8gRXN0aW1hdGUgdGhlIG9wdGltdW0gbnVtYmVyIG9mIHRpbWVzIHRvIHVzZSB0aGUgYXJndW1lbnQgcmVkdWN0aW9uLlxyXG4gIGsgPSAxLjQgKiBNYXRoLnNxcnQobGVuKTtcclxuICBrID0gayA+IDE2ID8gMTYgOiBrIHwgMDtcclxuXHJcbiAgeCA9IHgudGltZXMoMSAvIHRpbnlQb3coNSwgaykpO1xyXG4gIHggPSB0YXlsb3JTZXJpZXMoQ3RvciwgMiwgeCwgeCk7XHJcblxyXG4gIC8vIFJldmVyc2UgYXJndW1lbnQgcmVkdWN0aW9uXHJcbiAgdmFyIHNpbjJfeCxcclxuICAgIGQ1ID0gbmV3IEN0b3IoNSksXHJcbiAgICBkMTYgPSBuZXcgQ3RvcigxNiksXHJcbiAgICBkMjAgPSBuZXcgQ3RvcigyMCk7XHJcbiAgZm9yICg7IGstLTspIHtcclxuICAgIHNpbjJfeCA9IHgudGltZXMoeCk7XHJcbiAgICB4ID0geC50aW1lcyhkNS5wbHVzKHNpbjJfeC50aW1lcyhkMTYudGltZXMoc2luMl94KS5taW51cyhkMjApKSkpO1xyXG4gIH1cclxuXHJcbiAgcmV0dXJuIHg7XHJcbn1cclxuXHJcblxyXG4vLyBDYWxjdWxhdGUgVGF5bG9yIHNlcmllcyBmb3IgYGNvc2AsIGBjb3NoYCwgYHNpbmAgYW5kIGBzaW5oYC5cclxuZnVuY3Rpb24gdGF5bG9yU2VyaWVzKEN0b3IsIG4sIHgsIHksIGlzSHlwZXJib2xpYykge1xyXG4gIHZhciBqLCB0LCB1LCB4MixcclxuICAgIGkgPSAxLFxyXG4gICAgcHIgPSBDdG9yLnByZWNpc2lvbixcclxuICAgIGsgPSBNYXRoLmNlaWwocHIgLyBMT0dfQkFTRSk7XHJcblxyXG4gIGV4dGVybmFsID0gZmFsc2U7XHJcbiAgeDIgPSB4LnRpbWVzKHgpO1xyXG4gIHUgPSBuZXcgQ3Rvcih5KTtcclxuXHJcbiAgZm9yICg7Oykge1xyXG4gICAgdCA9IGRpdmlkZSh1LnRpbWVzKHgyKSwgbmV3IEN0b3IobisrICogbisrKSwgcHIsIDEpO1xyXG4gICAgdSA9IGlzSHlwZXJib2xpYyA/IHkucGx1cyh0KSA6IHkubWludXModCk7XHJcbiAgICB5ID0gZGl2aWRlKHQudGltZXMoeDIpLCBuZXcgQ3RvcihuKysgKiBuKyspLCBwciwgMSk7XHJcbiAgICB0ID0gdS5wbHVzKHkpO1xyXG5cclxuICAgIGlmICh0LmRba10gIT09IHZvaWQgMCkge1xyXG4gICAgICBmb3IgKGogPSBrOyB0LmRbal0gPT09IHUuZFtqXSAmJiBqLS07KTtcclxuICAgICAgaWYgKGogPT0gLTEpIGJyZWFrO1xyXG4gICAgfVxyXG5cclxuICAgIGogPSB1O1xyXG4gICAgdSA9IHk7XHJcbiAgICB5ID0gdDtcclxuICAgIHQgPSBqO1xyXG4gICAgaSsrO1xyXG4gIH1cclxuXHJcbiAgZXh0ZXJuYWwgPSB0cnVlO1xyXG4gIHQuZC5sZW5ndGggPSBrICsgMTtcclxuXHJcbiAgcmV0dXJuIHQ7XHJcbn1cclxuXHJcblxyXG4vLyBFeHBvbmVudCBlIG11c3QgYmUgcG9zaXRpdmUgYW5kIG5vbi16ZXJvLlxyXG5mdW5jdGlvbiB0aW55UG93KGIsIGUpIHtcclxuICB2YXIgbiA9IGI7XHJcbiAgd2hpbGUgKC0tZSkgbiAqPSBiO1xyXG4gIHJldHVybiBuO1xyXG59XHJcblxyXG5cclxuLy8gUmV0dXJuIHRoZSBhYnNvbHV0ZSB2YWx1ZSBvZiBgeGAgcmVkdWNlZCB0byBsZXNzIHRoYW4gb3IgZXF1YWwgdG8gaGFsZiBwaS5cclxuZnVuY3Rpb24gdG9MZXNzVGhhbkhhbGZQaShDdG9yLCB4KSB7XHJcbiAgdmFyIHQsXHJcbiAgICBpc05lZyA9IHgucyA8IDAsXHJcbiAgICBwaSA9IGdldFBpKEN0b3IsIEN0b3IucHJlY2lzaW9uLCAxKSxcclxuICAgIGhhbGZQaSA9IHBpLnRpbWVzKDAuNSk7XHJcblxyXG4gIHggPSB4LmFicygpO1xyXG5cclxuICBpZiAoeC5sdGUoaGFsZlBpKSkge1xyXG4gICAgcXVhZHJhbnQgPSBpc05lZyA/IDQgOiAxO1xyXG4gICAgcmV0dXJuIHg7XHJcbiAgfVxyXG5cclxuICB0ID0geC5kaXZUb0ludChwaSk7XHJcblxyXG4gIGlmICh0LmlzWmVybygpKSB7XHJcbiAgICBxdWFkcmFudCA9IGlzTmVnID8gMyA6IDI7XHJcbiAgfSBlbHNlIHtcclxuICAgIHggPSB4Lm1pbnVzKHQudGltZXMocGkpKTtcclxuXHJcbiAgICAvLyAwIDw9IHggPCBwaVxyXG4gICAgaWYgKHgubHRlKGhhbGZQaSkpIHtcclxuICAgICAgcXVhZHJhbnQgPSBpc09kZCh0KSA/IChpc05lZyA/IDIgOiAzKSA6IChpc05lZyA/IDQgOiAxKTtcclxuICAgICAgcmV0dXJuIHg7XHJcbiAgICB9XHJcblxyXG4gICAgcXVhZHJhbnQgPSBpc09kZCh0KSA/IChpc05lZyA/IDEgOiA0KSA6IChpc05lZyA/IDMgOiAyKTtcclxuICB9XHJcblxyXG4gIHJldHVybiB4Lm1pbnVzKHBpKS5hYnMoKTtcclxufVxyXG5cclxuXHJcbi8qXHJcbiAqIFJldHVybiB0aGUgdmFsdWUgb2YgRGVjaW1hbCBgeGAgYXMgYSBzdHJpbmcgaW4gYmFzZSBgYmFzZU91dGAuXHJcbiAqXHJcbiAqIElmIHRoZSBvcHRpb25hbCBgc2RgIGFyZ3VtZW50IGlzIHByZXNlbnQgaW5jbHVkZSBhIGJpbmFyeSBleHBvbmVudCBzdWZmaXguXHJcbiAqL1xyXG5mdW5jdGlvbiB0b1N0cmluZ0JpbmFyeSh4LCBiYXNlT3V0LCBzZCwgcm0pIHtcclxuICB2YXIgYmFzZSwgZSwgaSwgaywgbGVuLCByb3VuZFVwLCBzdHIsIHhkLCB5LFxyXG4gICAgQ3RvciA9IHguY29uc3RydWN0b3IsXHJcbiAgICBpc0V4cCA9IHNkICE9PSB2b2lkIDA7XHJcblxyXG4gIGlmIChpc0V4cCkge1xyXG4gICAgY2hlY2tJbnQzMihzZCwgMSwgTUFYX0RJR0lUUyk7XHJcbiAgICBpZiAocm0gPT09IHZvaWQgMCkgcm0gPSBDdG9yLnJvdW5kaW5nO1xyXG4gICAgZWxzZSBjaGVja0ludDMyKHJtLCAwLCA4KTtcclxuICB9IGVsc2Uge1xyXG4gICAgc2QgPSBDdG9yLnByZWNpc2lvbjtcclxuICAgIHJtID0gQ3Rvci5yb3VuZGluZztcclxuICB9XHJcblxyXG4gIGlmICgheC5pc0Zpbml0ZSgpKSB7XHJcbiAgICBzdHIgPSBub25GaW5pdGVUb1N0cmluZyh4KTtcclxuICB9IGVsc2Uge1xyXG4gICAgc3RyID0gZmluaXRlVG9TdHJpbmcoeCk7XHJcbiAgICBpID0gc3RyLmluZGV4T2YoJy4nKTtcclxuXHJcbiAgICAvLyBVc2UgZXhwb25lbnRpYWwgbm90YXRpb24gYWNjb3JkaW5nIHRvIGB0b0V4cFBvc2AgYW5kIGB0b0V4cE5lZ2A/IE5vLCBidXQgaWYgcmVxdWlyZWQ6XHJcbiAgICAvLyBtYXhCaW5hcnlFeHBvbmVudCA9IGZsb29yKChkZWNpbWFsRXhwb25lbnQgKyAxKSAqIGxvZ1syXSgxMCkpXHJcbiAgICAvLyBtaW5CaW5hcnlFeHBvbmVudCA9IGZsb29yKGRlY2ltYWxFeHBvbmVudCAqIGxvZ1syXSgxMCkpXHJcbiAgICAvLyBsb2dbMl0oMTApID0gMy4zMjE5MjgwOTQ4ODczNjIzNDc4NzAzMTk0Mjk0ODkzOTAxNzU4NjRcclxuXHJcbiAgICBpZiAoaXNFeHApIHtcclxuICAgICAgYmFzZSA9IDI7XHJcbiAgICAgIGlmIChiYXNlT3V0ID09IDE2KSB7XHJcbiAgICAgICAgc2QgPSBzZCAqIDQgLSAzO1xyXG4gICAgICB9IGVsc2UgaWYgKGJhc2VPdXQgPT0gOCkge1xyXG4gICAgICAgIHNkID0gc2QgKiAzIC0gMjtcclxuICAgICAgfVxyXG4gICAgfSBlbHNlIHtcclxuICAgICAgYmFzZSA9IGJhc2VPdXQ7XHJcbiAgICB9XHJcblxyXG4gICAgLy8gQ29udmVydCB0aGUgbnVtYmVyIGFzIGFuIGludGVnZXIgdGhlbiBkaXZpZGUgdGhlIHJlc3VsdCBieSBpdHMgYmFzZSByYWlzZWQgdG8gYSBwb3dlciBzdWNoXHJcbiAgICAvLyB0aGF0IHRoZSBmcmFjdGlvbiBwYXJ0IHdpbGwgYmUgcmVzdG9yZWQuXHJcblxyXG4gICAgLy8gTm9uLWludGVnZXIuXHJcbiAgICBpZiAoaSA+PSAwKSB7XHJcbiAgICAgIHN0ciA9IHN0ci5yZXBsYWNlKCcuJywgJycpO1xyXG4gICAgICB5ID0gbmV3IEN0b3IoMSk7XHJcbiAgICAgIHkuZSA9IHN0ci5sZW5ndGggLSBpO1xyXG4gICAgICB5LmQgPSBjb252ZXJ0QmFzZShmaW5pdGVUb1N0cmluZyh5KSwgMTAsIGJhc2UpO1xyXG4gICAgICB5LmUgPSB5LmQubGVuZ3RoO1xyXG4gICAgfVxyXG5cclxuICAgIHhkID0gY29udmVydEJhc2Uoc3RyLCAxMCwgYmFzZSk7XHJcbiAgICBlID0gbGVuID0geGQubGVuZ3RoO1xyXG5cclxuICAgIC8vIFJlbW92ZSB0cmFpbGluZyB6ZXJvcy5cclxuICAgIGZvciAoOyB4ZFstLWxlbl0gPT0gMDspIHhkLnBvcCgpO1xyXG5cclxuICAgIGlmICgheGRbMF0pIHtcclxuICAgICAgc3RyID0gaXNFeHAgPyAnMHArMCcgOiAnMCc7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICBpZiAoaSA8IDApIHtcclxuICAgICAgICBlLS07XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgeCA9IG5ldyBDdG9yKHgpO1xyXG4gICAgICAgIHguZCA9IHhkO1xyXG4gICAgICAgIHguZSA9IGU7XHJcbiAgICAgICAgeCA9IGRpdmlkZSh4LCB5LCBzZCwgcm0sIDAsIGJhc2UpO1xyXG4gICAgICAgIHhkID0geC5kO1xyXG4gICAgICAgIGUgPSB4LmU7XHJcbiAgICAgICAgcm91bmRVcCA9IGluZXhhY3Q7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIC8vIFRoZSByb3VuZGluZyBkaWdpdCwgaS5lLiB0aGUgZGlnaXQgYWZ0ZXIgdGhlIGRpZ2l0IHRoYXQgbWF5IGJlIHJvdW5kZWQgdXAuXHJcbiAgICAgIGkgPSB4ZFtzZF07XHJcbiAgICAgIGsgPSBiYXNlIC8gMjtcclxuICAgICAgcm91bmRVcCA9IHJvdW5kVXAgfHwgeGRbc2QgKyAxXSAhPT0gdm9pZCAwO1xyXG5cclxuICAgICAgcm91bmRVcCA9IHJtIDwgNFxyXG4gICAgICAgID8gKGkgIT09IHZvaWQgMCB8fCByb3VuZFVwKSAmJiAocm0gPT09IDAgfHwgcm0gPT09ICh4LnMgPCAwID8gMyA6IDIpKVxyXG4gICAgICAgIDogaSA+IGsgfHwgaSA9PT0gayAmJiAocm0gPT09IDQgfHwgcm91bmRVcCB8fCBybSA9PT0gNiAmJiB4ZFtzZCAtIDFdICYgMSB8fFxyXG4gICAgICAgICAgcm0gPT09ICh4LnMgPCAwID8gOCA6IDcpKTtcclxuXHJcbiAgICAgIHhkLmxlbmd0aCA9IHNkO1xyXG5cclxuICAgICAgaWYgKHJvdW5kVXApIHtcclxuXHJcbiAgICAgICAgLy8gUm91bmRpbmcgdXAgbWF5IG1lYW4gdGhlIHByZXZpb3VzIGRpZ2l0IGhhcyB0byBiZSByb3VuZGVkIHVwIGFuZCBzbyBvbi5cclxuICAgICAgICBmb3IgKDsgKyt4ZFstLXNkXSA+IGJhc2UgLSAxOykge1xyXG4gICAgICAgICAgeGRbc2RdID0gMDtcclxuICAgICAgICAgIGlmICghc2QpIHtcclxuICAgICAgICAgICAgKytlO1xyXG4gICAgICAgICAgICB4ZC51bnNoaWZ0KDEpO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG5cclxuICAgICAgLy8gRGV0ZXJtaW5lIHRyYWlsaW5nIHplcm9zLlxyXG4gICAgICBmb3IgKGxlbiA9IHhkLmxlbmd0aDsgIXhkW2xlbiAtIDFdOyAtLWxlbik7XHJcblxyXG4gICAgICAvLyBFLmcuIFs0LCAxMSwgMTVdIGJlY29tZXMgNGJmLlxyXG4gICAgICBmb3IgKGkgPSAwLCBzdHIgPSAnJzsgaSA8IGxlbjsgaSsrKSBzdHIgKz0gTlVNRVJBTFMuY2hhckF0KHhkW2ldKTtcclxuXHJcbiAgICAgIC8vIEFkZCBiaW5hcnkgZXhwb25lbnQgc3VmZml4P1xyXG4gICAgICBpZiAoaXNFeHApIHtcclxuICAgICAgICBpZiAobGVuID4gMSkge1xyXG4gICAgICAgICAgaWYgKGJhc2VPdXQgPT0gMTYgfHwgYmFzZU91dCA9PSA4KSB7XHJcbiAgICAgICAgICAgIGkgPSBiYXNlT3V0ID09IDE2ID8gNCA6IDM7XHJcbiAgICAgICAgICAgIGZvciAoLS1sZW47IGxlbiAlIGk7IGxlbisrKSBzdHIgKz0gJzAnO1xyXG4gICAgICAgICAgICB4ZCA9IGNvbnZlcnRCYXNlKHN0ciwgYmFzZSwgYmFzZU91dCk7XHJcbiAgICAgICAgICAgIGZvciAobGVuID0geGQubGVuZ3RoOyAheGRbbGVuIC0gMV07IC0tbGVuKTtcclxuXHJcbiAgICAgICAgICAgIC8vIHhkWzBdIHdpbGwgYWx3YXlzIGJlIGJlIDFcclxuICAgICAgICAgICAgZm9yIChpID0gMSwgc3RyID0gJzEuJzsgaSA8IGxlbjsgaSsrKSBzdHIgKz0gTlVNRVJBTFMuY2hhckF0KHhkW2ldKTtcclxuICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHN0ciA9IHN0ci5jaGFyQXQoMCkgKyAnLicgKyBzdHIuc2xpY2UoMSk7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBzdHIgPSAgc3RyICsgKGUgPCAwID8gJ3AnIDogJ3ArJykgKyBlO1xyXG4gICAgICB9IGVsc2UgaWYgKGUgPCAwKSB7XHJcbiAgICAgICAgZm9yICg7ICsrZTspIHN0ciA9ICcwJyArIHN0cjtcclxuICAgICAgICBzdHIgPSAnMC4nICsgc3RyO1xyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIGlmICgrK2UgPiBsZW4pIGZvciAoZSAtPSBsZW47IGUtLSA7KSBzdHIgKz0gJzAnO1xyXG4gICAgICAgIGVsc2UgaWYgKGUgPCBsZW4pIHN0ciA9IHN0ci5zbGljZSgwLCBlKSArICcuJyArIHN0ci5zbGljZShlKTtcclxuICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHN0ciA9IChiYXNlT3V0ID09IDE2ID8gJzB4JyA6IGJhc2VPdXQgPT0gMiA/ICcwYicgOiBiYXNlT3V0ID09IDggPyAnMG8nIDogJycpICsgc3RyO1xyXG4gIH1cclxuXHJcbiAgcmV0dXJuIHgucyA8IDAgPyAnLScgKyBzdHIgOiBzdHI7XHJcbn1cclxuXHJcblxyXG4vLyBEb2VzIG5vdCBzdHJpcCB0cmFpbGluZyB6ZXJvcy5cclxuZnVuY3Rpb24gdHJ1bmNhdGUoYXJyLCBsZW4pIHtcclxuICBpZiAoYXJyLmxlbmd0aCA+IGxlbikge1xyXG4gICAgYXJyLmxlbmd0aCA9IGxlbjtcclxuICAgIHJldHVybiB0cnVlO1xyXG4gIH1cclxufVxyXG5cclxuXHJcbi8vIERlY2ltYWwgbWV0aG9kc1xyXG5cclxuXHJcbi8qXHJcbiAqICBhYnNcclxuICogIGFjb3NcclxuICogIGFjb3NoXHJcbiAqICBhZGRcclxuICogIGFzaW5cclxuICogIGFzaW5oXHJcbiAqICBhdGFuXHJcbiAqICBhdGFuaFxyXG4gKiAgYXRhbjJcclxuICogIGNicnRcclxuICogIGNlaWxcclxuICogIGNsYW1wXHJcbiAqICBjbG9uZVxyXG4gKiAgY29uZmlnXHJcbiAqICBjb3NcclxuICogIGNvc2hcclxuICogIGRpdlxyXG4gKiAgZXhwXHJcbiAqICBmbG9vclxyXG4gKiAgaHlwb3RcclxuICogIGxuXHJcbiAqICBsb2dcclxuICogIGxvZzJcclxuICogIGxvZzEwXHJcbiAqICBtYXhcclxuICogIG1pblxyXG4gKiAgbW9kXHJcbiAqICBtdWxcclxuICogIHBvd1xyXG4gKiAgcmFuZG9tXHJcbiAqICByb3VuZFxyXG4gKiAgc2V0XHJcbiAqICBzaWduXHJcbiAqICBzaW5cclxuICogIHNpbmhcclxuICogIHNxcnRcclxuICogIHN1YlxyXG4gKiAgc3VtXHJcbiAqICB0YW5cclxuICogIHRhbmhcclxuICogIHRydW5jXHJcbiAqL1xyXG5cclxuXHJcbi8qXHJcbiAqIFJldHVybiBhIG5ldyBEZWNpbWFsIHdob3NlIHZhbHVlIGlzIHRoZSBhYnNvbHV0ZSB2YWx1ZSBvZiBgeGAuXHJcbiAqXHJcbiAqIHgge251bWJlcnxzdHJpbmd8RGVjaW1hbH1cclxuICpcclxuICovXHJcbmZ1bmN0aW9uIGFicyh4KSB7XHJcbiAgcmV0dXJuIG5ldyB0aGlzKHgpLmFicygpO1xyXG59XHJcblxyXG5cclxuLypcclxuICogUmV0dXJuIGEgbmV3IERlY2ltYWwgd2hvc2UgdmFsdWUgaXMgdGhlIGFyY2Nvc2luZSBpbiByYWRpYW5zIG9mIGB4YC5cclxuICpcclxuICogeCB7bnVtYmVyfHN0cmluZ3xEZWNpbWFsfVxyXG4gKlxyXG4gKi9cclxuZnVuY3Rpb24gYWNvcyh4KSB7XHJcbiAgcmV0dXJuIG5ldyB0aGlzKHgpLmFjb3MoKTtcclxufVxyXG5cclxuXHJcbi8qXHJcbiAqIFJldHVybiBhIG5ldyBEZWNpbWFsIHdob3NlIHZhbHVlIGlzIHRoZSBpbnZlcnNlIG9mIHRoZSBoeXBlcmJvbGljIGNvc2luZSBvZiBgeGAsIHJvdW5kZWQgdG9cclxuICogYHByZWNpc2lvbmAgc2lnbmlmaWNhbnQgZGlnaXRzIHVzaW5nIHJvdW5kaW5nIG1vZGUgYHJvdW5kaW5nYC5cclxuICpcclxuICogeCB7bnVtYmVyfHN0cmluZ3xEZWNpbWFsfSBBIHZhbHVlIGluIHJhZGlhbnMuXHJcbiAqXHJcbiAqL1xyXG5mdW5jdGlvbiBhY29zaCh4KSB7XHJcbiAgcmV0dXJuIG5ldyB0aGlzKHgpLmFjb3NoKCk7XHJcbn1cclxuXHJcblxyXG4vKlxyXG4gKiBSZXR1cm4gYSBuZXcgRGVjaW1hbCB3aG9zZSB2YWx1ZSBpcyB0aGUgc3VtIG9mIGB4YCBhbmQgYHlgLCByb3VuZGVkIHRvIGBwcmVjaXNpb25gIHNpZ25pZmljYW50XHJcbiAqIGRpZ2l0cyB1c2luZyByb3VuZGluZyBtb2RlIGByb3VuZGluZ2AuXHJcbiAqXHJcbiAqIHgge251bWJlcnxzdHJpbmd8RGVjaW1hbH1cclxuICogeSB7bnVtYmVyfHN0cmluZ3xEZWNpbWFsfVxyXG4gKlxyXG4gKi9cclxuZnVuY3Rpb24gYWRkKHgsIHkpIHtcclxuICByZXR1cm4gbmV3IHRoaXMoeCkucGx1cyh5KTtcclxufVxyXG5cclxuXHJcbi8qXHJcbiAqIFJldHVybiBhIG5ldyBEZWNpbWFsIHdob3NlIHZhbHVlIGlzIHRoZSBhcmNzaW5lIGluIHJhZGlhbnMgb2YgYHhgLCByb3VuZGVkIHRvIGBwcmVjaXNpb25gXHJcbiAqIHNpZ25pZmljYW50IGRpZ2l0cyB1c2luZyByb3VuZGluZyBtb2RlIGByb3VuZGluZ2AuXHJcbiAqXHJcbiAqIHgge251bWJlcnxzdHJpbmd8RGVjaW1hbH1cclxuICpcclxuICovXHJcbmZ1bmN0aW9uIGFzaW4oeCkge1xyXG4gIHJldHVybiBuZXcgdGhpcyh4KS5hc2luKCk7XHJcbn1cclxuXHJcblxyXG4vKlxyXG4gKiBSZXR1cm4gYSBuZXcgRGVjaW1hbCB3aG9zZSB2YWx1ZSBpcyB0aGUgaW52ZXJzZSBvZiB0aGUgaHlwZXJib2xpYyBzaW5lIG9mIGB4YCwgcm91bmRlZCB0b1xyXG4gKiBgcHJlY2lzaW9uYCBzaWduaWZpY2FudCBkaWdpdHMgdXNpbmcgcm91bmRpbmcgbW9kZSBgcm91bmRpbmdgLlxyXG4gKlxyXG4gKiB4IHtudW1iZXJ8c3RyaW5nfERlY2ltYWx9IEEgdmFsdWUgaW4gcmFkaWFucy5cclxuICpcclxuICovXHJcbmZ1bmN0aW9uIGFzaW5oKHgpIHtcclxuICByZXR1cm4gbmV3IHRoaXMoeCkuYXNpbmgoKTtcclxufVxyXG5cclxuXHJcbi8qXHJcbiAqIFJldHVybiBhIG5ldyBEZWNpbWFsIHdob3NlIHZhbHVlIGlzIHRoZSBhcmN0YW5nZW50IGluIHJhZGlhbnMgb2YgYHhgLCByb3VuZGVkIHRvIGBwcmVjaXNpb25gXHJcbiAqIHNpZ25pZmljYW50IGRpZ2l0cyB1c2luZyByb3VuZGluZyBtb2RlIGByb3VuZGluZ2AuXHJcbiAqXHJcbiAqIHgge251bWJlcnxzdHJpbmd8RGVjaW1hbH1cclxuICpcclxuICovXHJcbmZ1bmN0aW9uIGF0YW4oeCkge1xyXG4gIHJldHVybiBuZXcgdGhpcyh4KS5hdGFuKCk7XHJcbn1cclxuXHJcblxyXG4vKlxyXG4gKiBSZXR1cm4gYSBuZXcgRGVjaW1hbCB3aG9zZSB2YWx1ZSBpcyB0aGUgaW52ZXJzZSBvZiB0aGUgaHlwZXJib2xpYyB0YW5nZW50IG9mIGB4YCwgcm91bmRlZCB0b1xyXG4gKiBgcHJlY2lzaW9uYCBzaWduaWZpY2FudCBkaWdpdHMgdXNpbmcgcm91bmRpbmcgbW9kZSBgcm91bmRpbmdgLlxyXG4gKlxyXG4gKiB4IHtudW1iZXJ8c3RyaW5nfERlY2ltYWx9IEEgdmFsdWUgaW4gcmFkaWFucy5cclxuICpcclxuICovXHJcbmZ1bmN0aW9uIGF0YW5oKHgpIHtcclxuICByZXR1cm4gbmV3IHRoaXMoeCkuYXRhbmgoKTtcclxufVxyXG5cclxuXHJcbi8qXHJcbiAqIFJldHVybiBhIG5ldyBEZWNpbWFsIHdob3NlIHZhbHVlIGlzIHRoZSBhcmN0YW5nZW50IGluIHJhZGlhbnMgb2YgYHkveGAgaW4gdGhlIHJhbmdlIC1waSB0byBwaVxyXG4gKiAoaW5jbHVzaXZlKSwgcm91bmRlZCB0byBgcHJlY2lzaW9uYCBzaWduaWZpY2FudCBkaWdpdHMgdXNpbmcgcm91bmRpbmcgbW9kZSBgcm91bmRpbmdgLlxyXG4gKlxyXG4gKiBEb21haW46IFstSW5maW5pdHksIEluZmluaXR5XVxyXG4gKiBSYW5nZTogWy1waSwgcGldXHJcbiAqXHJcbiAqIHkge251bWJlcnxzdHJpbmd8RGVjaW1hbH0gVGhlIHktY29vcmRpbmF0ZS5cclxuICogeCB7bnVtYmVyfHN0cmluZ3xEZWNpbWFsfSBUaGUgeC1jb29yZGluYXRlLlxyXG4gKlxyXG4gKiBhdGFuMihcdTAwQjEwLCAtMCkgICAgICAgICAgICAgICA9IFx1MDBCMXBpXHJcbiAqIGF0YW4yKFx1MDBCMTAsICswKSAgICAgICAgICAgICAgID0gXHUwMEIxMFxyXG4gKiBhdGFuMihcdTAwQjEwLCAteCkgICAgICAgICAgICAgICA9IFx1MDBCMXBpIGZvciB4ID4gMFxyXG4gKiBhdGFuMihcdTAwQjEwLCB4KSAgICAgICAgICAgICAgICA9IFx1MDBCMTAgZm9yIHggPiAwXHJcbiAqIGF0YW4yKC15LCBcdTAwQjEwKSAgICAgICAgICAgICAgID0gLXBpLzIgZm9yIHkgPiAwXHJcbiAqIGF0YW4yKHksIFx1MDBCMTApICAgICAgICAgICAgICAgID0gcGkvMiBmb3IgeSA+IDBcclxuICogYXRhbjIoXHUwMEIxeSwgLUluZmluaXR5KSAgICAgICAgPSBcdTAwQjFwaSBmb3IgZmluaXRlIHkgPiAwXHJcbiAqIGF0YW4yKFx1MDBCMXksICtJbmZpbml0eSkgICAgICAgID0gXHUwMEIxMCBmb3IgZmluaXRlIHkgPiAwXHJcbiAqIGF0YW4yKFx1MDBCMUluZmluaXR5LCB4KSAgICAgICAgID0gXHUwMEIxcGkvMiBmb3IgZmluaXRlIHhcclxuICogYXRhbjIoXHUwMEIxSW5maW5pdHksIC1JbmZpbml0eSkgPSBcdTAwQjEzKnBpLzRcclxuICogYXRhbjIoXHUwMEIxSW5maW5pdHksICtJbmZpbml0eSkgPSBcdTAwQjFwaS80XHJcbiAqIGF0YW4yKE5hTiwgeCkgPSBOYU5cclxuICogYXRhbjIoeSwgTmFOKSA9IE5hTlxyXG4gKlxyXG4gKi9cclxuZnVuY3Rpb24gYXRhbjIoeSwgeCkge1xyXG4gIHkgPSBuZXcgdGhpcyh5KTtcclxuICB4ID0gbmV3IHRoaXMoeCk7XHJcbiAgdmFyIHIsXHJcbiAgICBwciA9IHRoaXMucHJlY2lzaW9uLFxyXG4gICAgcm0gPSB0aGlzLnJvdW5kaW5nLFxyXG4gICAgd3ByID0gcHIgKyA0O1xyXG5cclxuICAvLyBFaXRoZXIgTmFOXHJcbiAgaWYgKCF5LnMgfHwgIXgucykge1xyXG4gICAgciA9IG5ldyB0aGlzKE5hTik7XHJcblxyXG4gIC8vIEJvdGggXHUwMEIxSW5maW5pdHlcclxuICB9IGVsc2UgaWYgKCF5LmQgJiYgIXguZCkge1xyXG4gICAgciA9IGdldFBpKHRoaXMsIHdwciwgMSkudGltZXMoeC5zID4gMCA/IDAuMjUgOiAwLjc1KTtcclxuICAgIHIucyA9IHkucztcclxuXHJcbiAgLy8geCBpcyBcdTAwQjFJbmZpbml0eSBvciB5IGlzIFx1MDBCMTBcclxuICB9IGVsc2UgaWYgKCF4LmQgfHwgeS5pc1plcm8oKSkge1xyXG4gICAgciA9IHgucyA8IDAgPyBnZXRQaSh0aGlzLCBwciwgcm0pIDogbmV3IHRoaXMoMCk7XHJcbiAgICByLnMgPSB5LnM7XHJcblxyXG4gIC8vIHkgaXMgXHUwMEIxSW5maW5pdHkgb3IgeCBpcyBcdTAwQjEwXHJcbiAgfSBlbHNlIGlmICgheS5kIHx8IHguaXNaZXJvKCkpIHtcclxuICAgIHIgPSBnZXRQaSh0aGlzLCB3cHIsIDEpLnRpbWVzKDAuNSk7XHJcbiAgICByLnMgPSB5LnM7XHJcblxyXG4gIC8vIEJvdGggbm9uLXplcm8gYW5kIGZpbml0ZVxyXG4gIH0gZWxzZSBpZiAoeC5zIDwgMCkge1xyXG4gICAgdGhpcy5wcmVjaXNpb24gPSB3cHI7XHJcbiAgICB0aGlzLnJvdW5kaW5nID0gMTtcclxuICAgIHIgPSB0aGlzLmF0YW4oZGl2aWRlKHksIHgsIHdwciwgMSkpO1xyXG4gICAgeCA9IGdldFBpKHRoaXMsIHdwciwgMSk7XHJcbiAgICB0aGlzLnByZWNpc2lvbiA9IHByO1xyXG4gICAgdGhpcy5yb3VuZGluZyA9IHJtO1xyXG4gICAgciA9IHkucyA8IDAgPyByLm1pbnVzKHgpIDogci5wbHVzKHgpO1xyXG4gIH0gZWxzZSB7XHJcbiAgICByID0gdGhpcy5hdGFuKGRpdmlkZSh5LCB4LCB3cHIsIDEpKTtcclxuICB9XHJcblxyXG4gIHJldHVybiByO1xyXG59XHJcblxyXG5cclxuLypcclxuICogUmV0dXJuIGEgbmV3IERlY2ltYWwgd2hvc2UgdmFsdWUgaXMgdGhlIGN1YmUgcm9vdCBvZiBgeGAsIHJvdW5kZWQgdG8gYHByZWNpc2lvbmAgc2lnbmlmaWNhbnRcclxuICogZGlnaXRzIHVzaW5nIHJvdW5kaW5nIG1vZGUgYHJvdW5kaW5nYC5cclxuICpcclxuICogeCB7bnVtYmVyfHN0cmluZ3xEZWNpbWFsfVxyXG4gKlxyXG4gKi9cclxuZnVuY3Rpb24gY2JydCh4KSB7XHJcbiAgcmV0dXJuIG5ldyB0aGlzKHgpLmNicnQoKTtcclxufVxyXG5cclxuXHJcbi8qXHJcbiAqIFJldHVybiBhIG5ldyBEZWNpbWFsIHdob3NlIHZhbHVlIGlzIGB4YCByb3VuZGVkIHRvIGFuIGludGVnZXIgdXNpbmcgYFJPVU5EX0NFSUxgLlxyXG4gKlxyXG4gKiB4IHtudW1iZXJ8c3RyaW5nfERlY2ltYWx9XHJcbiAqXHJcbiAqL1xyXG5mdW5jdGlvbiBjZWlsKHgpIHtcclxuICByZXR1cm4gZmluYWxpc2UoeCA9IG5ldyB0aGlzKHgpLCB4LmUgKyAxLCAyKTtcclxufVxyXG5cclxuXHJcbi8qXHJcbiAqIFJldHVybiBhIG5ldyBEZWNpbWFsIHdob3NlIHZhbHVlIGlzIGB4YCBjbGFtcGVkIHRvIHRoZSByYW5nZSBkZWxpbmVhdGVkIGJ5IGBtaW5gIGFuZCBgbWF4YC5cclxuICpcclxuICogeCB7bnVtYmVyfHN0cmluZ3xEZWNpbWFsfVxyXG4gKiBtaW4ge251bWJlcnxzdHJpbmd8RGVjaW1hbH1cclxuICogbWF4IHtudW1iZXJ8c3RyaW5nfERlY2ltYWx9XHJcbiAqXHJcbiAqL1xyXG5mdW5jdGlvbiBjbGFtcCh4LCBtaW4sIG1heCkge1xyXG4gIHJldHVybiBuZXcgdGhpcyh4KS5jbGFtcChtaW4sIG1heCk7XHJcbn1cclxuXHJcblxyXG4vKlxyXG4gKiBDb25maWd1cmUgZ2xvYmFsIHNldHRpbmdzIGZvciBhIERlY2ltYWwgY29uc3RydWN0b3IuXHJcbiAqXHJcbiAqIGBvYmpgIGlzIGFuIG9iamVjdCB3aXRoIG9uZSBvciBtb3JlIG9mIHRoZSBmb2xsb3dpbmcgcHJvcGVydGllcyxcclxuICpcclxuICogICBwcmVjaXNpb24gIHtudW1iZXJ9XHJcbiAqICAgcm91bmRpbmcgICB7bnVtYmVyfVxyXG4gKiAgIHRvRXhwTmVnICAge251bWJlcn1cclxuICogICB0b0V4cFBvcyAgIHtudW1iZXJ9XHJcbiAqICAgbWF4RSAgICAgICB7bnVtYmVyfVxyXG4gKiAgIG1pbkUgICAgICAge251bWJlcn1cclxuICogICBtb2R1bG8gICAgIHtudW1iZXJ9XHJcbiAqICAgY3J5cHRvICAgICB7Ym9vbGVhbnxudW1iZXJ9XHJcbiAqICAgZGVmYXVsdHMgICB7dHJ1ZX1cclxuICpcclxuICogRS5nLiBEZWNpbWFsLmNvbmZpZyh7IHByZWNpc2lvbjogMjAsIHJvdW5kaW5nOiA0IH0pXHJcbiAqXHJcbiAqL1xyXG5mdW5jdGlvbiBjb25maWcob2JqKSB7XHJcbiAgaWYgKCFvYmogfHwgdHlwZW9mIG9iaiAhPT0gJ29iamVjdCcpIHRocm93IEVycm9yKGRlY2ltYWxFcnJvciArICdPYmplY3QgZXhwZWN0ZWQnKTtcclxuICB2YXIgaSwgcCwgdixcclxuICAgIHVzZURlZmF1bHRzID0gb2JqLmRlZmF1bHRzID09PSB0cnVlLFxyXG4gICAgcHMgPSBbXHJcbiAgICAgICdwcmVjaXNpb24nLCAxLCBNQVhfRElHSVRTLFxyXG4gICAgICAncm91bmRpbmcnLCAwLCA4LFxyXG4gICAgICAndG9FeHBOZWcnLCAtRVhQX0xJTUlULCAwLFxyXG4gICAgICAndG9FeHBQb3MnLCAwLCBFWFBfTElNSVQsXHJcbiAgICAgICdtYXhFJywgMCwgRVhQX0xJTUlULFxyXG4gICAgICAnbWluRScsIC1FWFBfTElNSVQsIDAsXHJcbiAgICAgICdtb2R1bG8nLCAwLCA5XHJcbiAgICBdO1xyXG5cclxuICBmb3IgKGkgPSAwOyBpIDwgcHMubGVuZ3RoOyBpICs9IDMpIHtcclxuICAgIGlmIChwID0gcHNbaV0sIHVzZURlZmF1bHRzKSB0aGlzW3BdID0gREVGQVVMVFNbcF07XHJcbiAgICBpZiAoKHYgPSBvYmpbcF0pICE9PSB2b2lkIDApIHtcclxuICAgICAgaWYgKG1hdGhmbG9vcih2KSA9PT0gdiAmJiB2ID49IHBzW2kgKyAxXSAmJiB2IDw9IHBzW2kgKyAyXSkgdGhpc1twXSA9IHY7XHJcbiAgICAgIGVsc2UgdGhyb3cgRXJyb3IoaW52YWxpZEFyZ3VtZW50ICsgcCArICc6ICcgKyB2KTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIGlmIChwID0gJ2NyeXB0bycsIHVzZURlZmF1bHRzKSB0aGlzW3BdID0gREVGQVVMVFNbcF07XHJcbiAgaWYgKCh2ID0gb2JqW3BdKSAhPT0gdm9pZCAwKSB7XHJcbiAgICBpZiAodiA9PT0gdHJ1ZSB8fCB2ID09PSBmYWxzZSB8fCB2ID09PSAwIHx8IHYgPT09IDEpIHtcclxuICAgICAgaWYgKHYpIHtcclxuICAgICAgICBpZiAodHlwZW9mIGNyeXB0byAhPSAndW5kZWZpbmVkJyAmJiBjcnlwdG8gJiZcclxuICAgICAgICAgIChjcnlwdG8uZ2V0UmFuZG9tVmFsdWVzIHx8IGNyeXB0by5yYW5kb21CeXRlcykpIHtcclxuICAgICAgICAgIHRoaXNbcF0gPSB0cnVlO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICB0aHJvdyBFcnJvcihjcnlwdG9VbmF2YWlsYWJsZSk7XHJcbiAgICAgICAgfVxyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIHRoaXNbcF0gPSBmYWxzZTtcclxuICAgICAgfVxyXG4gICAgfSBlbHNlIHtcclxuICAgICAgdGhyb3cgRXJyb3IoaW52YWxpZEFyZ3VtZW50ICsgcCArICc6ICcgKyB2KTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIHJldHVybiB0aGlzO1xyXG59XHJcblxyXG5cclxuLypcclxuICogUmV0dXJuIGEgbmV3IERlY2ltYWwgd2hvc2UgdmFsdWUgaXMgdGhlIGNvc2luZSBvZiBgeGAsIHJvdW5kZWQgdG8gYHByZWNpc2lvbmAgc2lnbmlmaWNhbnRcclxuICogZGlnaXRzIHVzaW5nIHJvdW5kaW5nIG1vZGUgYHJvdW5kaW5nYC5cclxuICpcclxuICogeCB7bnVtYmVyfHN0cmluZ3xEZWNpbWFsfSBBIHZhbHVlIGluIHJhZGlhbnMuXHJcbiAqXHJcbiAqL1xyXG5mdW5jdGlvbiBjb3MoeCkge1xyXG4gIHJldHVybiBuZXcgdGhpcyh4KS5jb3MoKTtcclxufVxyXG5cclxuXHJcbi8qXHJcbiAqIFJldHVybiBhIG5ldyBEZWNpbWFsIHdob3NlIHZhbHVlIGlzIHRoZSBoeXBlcmJvbGljIGNvc2luZSBvZiBgeGAsIHJvdW5kZWQgdG8gcHJlY2lzaW9uXHJcbiAqIHNpZ25pZmljYW50IGRpZ2l0cyB1c2luZyByb3VuZGluZyBtb2RlIGByb3VuZGluZ2AuXHJcbiAqXHJcbiAqIHgge251bWJlcnxzdHJpbmd8RGVjaW1hbH0gQSB2YWx1ZSBpbiByYWRpYW5zLlxyXG4gKlxyXG4gKi9cclxuZnVuY3Rpb24gY29zaCh4KSB7XHJcbiAgcmV0dXJuIG5ldyB0aGlzKHgpLmNvc2goKTtcclxufVxyXG5cclxuXHJcbi8qXHJcbiAqIENyZWF0ZSBhbmQgcmV0dXJuIGEgRGVjaW1hbCBjb25zdHJ1Y3RvciB3aXRoIHRoZSBzYW1lIGNvbmZpZ3VyYXRpb24gcHJvcGVydGllcyBhcyB0aGlzIERlY2ltYWxcclxuICogY29uc3RydWN0b3IuXHJcbiAqXHJcbiAqL1xyXG5mdW5jdGlvbiBjbG9uZShvYmopIHtcclxuICB2YXIgaSwgcCwgcHM7XHJcblxyXG4gIC8qXHJcbiAgICogVGhlIERlY2ltYWwgY29uc3RydWN0b3IgYW5kIGV4cG9ydGVkIGZ1bmN0aW9uLlxyXG4gICAqIFJldHVybiBhIG5ldyBEZWNpbWFsIGluc3RhbmNlLlxyXG4gICAqXHJcbiAgICogdiB7bnVtYmVyfHN0cmluZ3xEZWNpbWFsfSBBIG51bWVyaWMgdmFsdWUuXHJcbiAgICpcclxuICAgKi9cclxuICBmdW5jdGlvbiBEZWNpbWFsKHYpIHtcclxuICAgIHZhciBlLCBpLCB0LFxyXG4gICAgICB4ID0gdGhpcztcclxuXHJcbiAgICAvLyBEZWNpbWFsIGNhbGxlZCB3aXRob3V0IG5ldy5cclxuICAgIGlmICghKHggaW5zdGFuY2VvZiBEZWNpbWFsKSkgcmV0dXJuIG5ldyBEZWNpbWFsKHYpO1xyXG5cclxuICAgIC8vIFJldGFpbiBhIHJlZmVyZW5jZSB0byB0aGlzIERlY2ltYWwgY29uc3RydWN0b3IsIGFuZCBzaGFkb3cgRGVjaW1hbC5wcm90b3R5cGUuY29uc3RydWN0b3JcclxuICAgIC8vIHdoaWNoIHBvaW50cyB0byBPYmplY3QuXHJcbiAgICB4LmNvbnN0cnVjdG9yID0gRGVjaW1hbDtcclxuXHJcbiAgICAvLyBEdXBsaWNhdGUuXHJcbiAgICBpZiAoaXNEZWNpbWFsSW5zdGFuY2UodikpIHtcclxuICAgICAgeC5zID0gdi5zO1xyXG5cclxuICAgICAgaWYgKGV4dGVybmFsKSB7XHJcbiAgICAgICAgaWYgKCF2LmQgfHwgdi5lID4gRGVjaW1hbC5tYXhFKSB7XHJcblxyXG4gICAgICAgICAgLy8gSW5maW5pdHkuXHJcbiAgICAgICAgICB4LmUgPSBOYU47XHJcbiAgICAgICAgICB4LmQgPSBudWxsO1xyXG4gICAgICAgIH0gZWxzZSBpZiAodi5lIDwgRGVjaW1hbC5taW5FKSB7XHJcblxyXG4gICAgICAgICAgLy8gWmVyby5cclxuICAgICAgICAgIHguZSA9IDA7XHJcbiAgICAgICAgICB4LmQgPSBbMF07XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgIHguZSA9IHYuZTtcclxuICAgICAgICAgIHguZCA9IHYuZC5zbGljZSgpO1xyXG4gICAgICAgIH1cclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICB4LmUgPSB2LmU7XHJcbiAgICAgICAgeC5kID0gdi5kID8gdi5kLnNsaWNlKCkgOiB2LmQ7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIHJldHVybjtcclxuICAgIH1cclxuXHJcbiAgICB0ID0gdHlwZW9mIHY7XHJcblxyXG4gICAgaWYgKHQgPT09ICdudW1iZXInKSB7XHJcbiAgICAgIGlmICh2ID09PSAwKSB7XHJcbiAgICAgICAgeC5zID0gMSAvIHYgPCAwID8gLTEgOiAxO1xyXG4gICAgICAgIHguZSA9IDA7XHJcbiAgICAgICAgeC5kID0gWzBdO1xyXG4gICAgICAgIHJldHVybjtcclxuICAgICAgfVxyXG5cclxuICAgICAgaWYgKHYgPCAwKSB7XHJcbiAgICAgICAgdiA9IC12O1xyXG4gICAgICAgIHgucyA9IC0xO1xyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIHgucyA9IDE7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIC8vIEZhc3QgcGF0aCBmb3Igc21hbGwgaW50ZWdlcnMuXHJcbiAgICAgIGlmICh2ID09PSB+fnYgJiYgdiA8IDFlNykge1xyXG4gICAgICAgIGZvciAoZSA9IDAsIGkgPSB2OyBpID49IDEwOyBpIC89IDEwKSBlKys7XHJcblxyXG4gICAgICAgIGlmIChleHRlcm5hbCkge1xyXG4gICAgICAgICAgaWYgKGUgPiBEZWNpbWFsLm1heEUpIHtcclxuICAgICAgICAgICAgeC5lID0gTmFOO1xyXG4gICAgICAgICAgICB4LmQgPSBudWxsO1xyXG4gICAgICAgICAgfSBlbHNlIGlmIChlIDwgRGVjaW1hbC5taW5FKSB7XHJcbiAgICAgICAgICAgIHguZSA9IDA7XHJcbiAgICAgICAgICAgIHguZCA9IFswXTtcclxuICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHguZSA9IGU7XHJcbiAgICAgICAgICAgIHguZCA9IFt2XTtcclxuICAgICAgICAgIH1cclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgeC5lID0gZTtcclxuICAgICAgICAgIHguZCA9IFt2XTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybjtcclxuXHJcbiAgICAgIC8vIEluZmluaXR5LCBOYU4uXHJcbiAgICAgIH0gZWxzZSBpZiAodiAqIDAgIT09IDApIHtcclxuICAgICAgICBpZiAoIXYpIHgucyA9IE5hTjtcclxuICAgICAgICB4LmUgPSBOYU47XHJcbiAgICAgICAgeC5kID0gbnVsbDtcclxuICAgICAgICByZXR1cm47XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIHJldHVybiBwYXJzZURlY2ltYWwoeCwgdi50b1N0cmluZygpKTtcclxuXHJcbiAgICB9IGVsc2UgaWYgKHQgIT09ICdzdHJpbmcnKSB7XHJcbiAgICAgIHRocm93IEVycm9yKGludmFsaWRBcmd1bWVudCArIHYpO1xyXG4gICAgfVxyXG5cclxuICAgIC8vIE1pbnVzIHNpZ24/XHJcbiAgICBpZiAoKGkgPSB2LmNoYXJDb2RlQXQoMCkpID09PSA0NSkge1xyXG4gICAgICB2ID0gdi5zbGljZSgxKTtcclxuICAgICAgeC5zID0gLTE7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICAvLyBQbHVzIHNpZ24/XHJcbiAgICAgIGlmIChpID09PSA0MykgdiA9IHYuc2xpY2UoMSk7XHJcbiAgICAgIHgucyA9IDE7XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIGlzRGVjaW1hbC50ZXN0KHYpID8gcGFyc2VEZWNpbWFsKHgsIHYpIDogcGFyc2VPdGhlcih4LCB2KTtcclxuICB9XHJcblxyXG4gIERlY2ltYWwucHJvdG90eXBlID0gUDtcclxuXHJcbiAgRGVjaW1hbC5ST1VORF9VUCA9IDA7XHJcbiAgRGVjaW1hbC5ST1VORF9ET1dOID0gMTtcclxuICBEZWNpbWFsLlJPVU5EX0NFSUwgPSAyO1xyXG4gIERlY2ltYWwuUk9VTkRfRkxPT1IgPSAzO1xyXG4gIERlY2ltYWwuUk9VTkRfSEFMRl9VUCA9IDQ7XHJcbiAgRGVjaW1hbC5ST1VORF9IQUxGX0RPV04gPSA1O1xyXG4gIERlY2ltYWwuUk9VTkRfSEFMRl9FVkVOID0gNjtcclxuICBEZWNpbWFsLlJPVU5EX0hBTEZfQ0VJTCA9IDc7XHJcbiAgRGVjaW1hbC5ST1VORF9IQUxGX0ZMT09SID0gODtcclxuICBEZWNpbWFsLkVVQ0xJRCA9IDk7XHJcblxyXG4gIERlY2ltYWwuY29uZmlnID0gRGVjaW1hbC5zZXQgPSBjb25maWc7XHJcbiAgRGVjaW1hbC5jbG9uZSA9IGNsb25lO1xyXG4gIERlY2ltYWwuaXNEZWNpbWFsID0gaXNEZWNpbWFsSW5zdGFuY2U7XHJcblxyXG4gIERlY2ltYWwuYWJzID0gYWJzO1xyXG4gIERlY2ltYWwuYWNvcyA9IGFjb3M7XHJcbiAgRGVjaW1hbC5hY29zaCA9IGFjb3NoOyAgICAgICAgLy8gRVM2XHJcbiAgRGVjaW1hbC5hZGQgPSBhZGQ7XHJcbiAgRGVjaW1hbC5hc2luID0gYXNpbjtcclxuICBEZWNpbWFsLmFzaW5oID0gYXNpbmg7ICAgICAgICAvLyBFUzZcclxuICBEZWNpbWFsLmF0YW4gPSBhdGFuO1xyXG4gIERlY2ltYWwuYXRhbmggPSBhdGFuaDsgICAgICAgIC8vIEVTNlxyXG4gIERlY2ltYWwuYXRhbjIgPSBhdGFuMjtcclxuICBEZWNpbWFsLmNicnQgPSBjYnJ0OyAgICAgICAgICAvLyBFUzZcclxuICBEZWNpbWFsLmNlaWwgPSBjZWlsO1xyXG4gIERlY2ltYWwuY2xhbXAgPSBjbGFtcDtcclxuICBEZWNpbWFsLmNvcyA9IGNvcztcclxuICBEZWNpbWFsLmNvc2ggPSBjb3NoOyAgICAgICAgICAvLyBFUzZcclxuICBEZWNpbWFsLmRpdiA9IGRpdjtcclxuICBEZWNpbWFsLmV4cCA9IGV4cDtcclxuICBEZWNpbWFsLmZsb29yID0gZmxvb3I7XHJcbiAgRGVjaW1hbC5oeXBvdCA9IGh5cG90OyAgICAgICAgLy8gRVM2XHJcbiAgRGVjaW1hbC5sbiA9IGxuO1xyXG4gIERlY2ltYWwubG9nID0gbG9nO1xyXG4gIERlY2ltYWwubG9nMTAgPSBsb2cxMDsgICAgICAgIC8vIEVTNlxyXG4gIERlY2ltYWwubG9nMiA9IGxvZzI7ICAgICAgICAgIC8vIEVTNlxyXG4gIERlY2ltYWwubWF4ID0gbWF4O1xyXG4gIERlY2ltYWwubWluID0gbWluO1xyXG4gIERlY2ltYWwubW9kID0gbW9kO1xyXG4gIERlY2ltYWwubXVsID0gbXVsO1xyXG4gIERlY2ltYWwucG93ID0gcG93O1xyXG4gIERlY2ltYWwucmFuZG9tID0gcmFuZG9tO1xyXG4gIERlY2ltYWwucm91bmQgPSByb3VuZDtcclxuICBEZWNpbWFsLnNpZ24gPSBzaWduOyAgICAgICAgICAvLyBFUzZcclxuICBEZWNpbWFsLnNpbiA9IHNpbjtcclxuICBEZWNpbWFsLnNpbmggPSBzaW5oOyAgICAgICAgICAvLyBFUzZcclxuICBEZWNpbWFsLnNxcnQgPSBzcXJ0O1xyXG4gIERlY2ltYWwuc3ViID0gc3ViO1xyXG4gIERlY2ltYWwuc3VtID0gc3VtO1xyXG4gIERlY2ltYWwudGFuID0gdGFuO1xyXG4gIERlY2ltYWwudGFuaCA9IHRhbmg7ICAgICAgICAgIC8vIEVTNlxyXG4gIERlY2ltYWwudHJ1bmMgPSB0cnVuYzsgICAgICAgIC8vIEVTNlxyXG5cclxuICBpZiAob2JqID09PSB2b2lkIDApIG9iaiA9IHt9O1xyXG4gIGlmIChvYmopIHtcclxuICAgIGlmIChvYmouZGVmYXVsdHMgIT09IHRydWUpIHtcclxuICAgICAgcHMgPSBbJ3ByZWNpc2lvbicsICdyb3VuZGluZycsICd0b0V4cE5lZycsICd0b0V4cFBvcycsICdtYXhFJywgJ21pbkUnLCAnbW9kdWxvJywgJ2NyeXB0byddO1xyXG4gICAgICBmb3IgKGkgPSAwOyBpIDwgcHMubGVuZ3RoOykgaWYgKCFvYmouaGFzT3duUHJvcGVydHkocCA9IHBzW2krK10pKSBvYmpbcF0gPSB0aGlzW3BdO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgRGVjaW1hbC5jb25maWcob2JqKTtcclxuXHJcbiAgcmV0dXJuIERlY2ltYWw7XHJcbn1cclxuXHJcblxyXG4vKlxyXG4gKiBSZXR1cm4gYSBuZXcgRGVjaW1hbCB3aG9zZSB2YWx1ZSBpcyBgeGAgZGl2aWRlZCBieSBgeWAsIHJvdW5kZWQgdG8gYHByZWNpc2lvbmAgc2lnbmlmaWNhbnRcclxuICogZGlnaXRzIHVzaW5nIHJvdW5kaW5nIG1vZGUgYHJvdW5kaW5nYC5cclxuICpcclxuICogeCB7bnVtYmVyfHN0cmluZ3xEZWNpbWFsfVxyXG4gKiB5IHtudW1iZXJ8c3RyaW5nfERlY2ltYWx9XHJcbiAqXHJcbiAqL1xyXG5mdW5jdGlvbiBkaXYoeCwgeSkge1xyXG4gIHJldHVybiBuZXcgdGhpcyh4KS5kaXYoeSk7XHJcbn1cclxuXHJcblxyXG4vKlxyXG4gKiBSZXR1cm4gYSBuZXcgRGVjaW1hbCB3aG9zZSB2YWx1ZSBpcyB0aGUgbmF0dXJhbCBleHBvbmVudGlhbCBvZiBgeGAsIHJvdW5kZWQgdG8gYHByZWNpc2lvbmBcclxuICogc2lnbmlmaWNhbnQgZGlnaXRzIHVzaW5nIHJvdW5kaW5nIG1vZGUgYHJvdW5kaW5nYC5cclxuICpcclxuICogeCB7bnVtYmVyfHN0cmluZ3xEZWNpbWFsfSBUaGUgcG93ZXIgdG8gd2hpY2ggdG8gcmFpc2UgdGhlIGJhc2Ugb2YgdGhlIG5hdHVyYWwgbG9nLlxyXG4gKlxyXG4gKi9cclxuZnVuY3Rpb24gZXhwKHgpIHtcclxuICByZXR1cm4gbmV3IHRoaXMoeCkuZXhwKCk7XHJcbn1cclxuXHJcblxyXG4vKlxyXG4gKiBSZXR1cm4gYSBuZXcgRGVjaW1hbCB3aG9zZSB2YWx1ZSBpcyBgeGAgcm91bmQgdG8gYW4gaW50ZWdlciB1c2luZyBgUk9VTkRfRkxPT1JgLlxyXG4gKlxyXG4gKiB4IHtudW1iZXJ8c3RyaW5nfERlY2ltYWx9XHJcbiAqXHJcbiAqL1xyXG5mdW5jdGlvbiBmbG9vcih4KSB7XHJcbiAgcmV0dXJuIGZpbmFsaXNlKHggPSBuZXcgdGhpcyh4KSwgeC5lICsgMSwgMyk7XHJcbn1cclxuXHJcblxyXG4vKlxyXG4gKiBSZXR1cm4gYSBuZXcgRGVjaW1hbCB3aG9zZSB2YWx1ZSBpcyB0aGUgc3F1YXJlIHJvb3Qgb2YgdGhlIHN1bSBvZiB0aGUgc3F1YXJlcyBvZiB0aGUgYXJndW1lbnRzLFxyXG4gKiByb3VuZGVkIHRvIGBwcmVjaXNpb25gIHNpZ25pZmljYW50IGRpZ2l0cyB1c2luZyByb3VuZGluZyBtb2RlIGByb3VuZGluZ2AuXHJcbiAqXHJcbiAqIGh5cG90KGEsIGIsIC4uLikgPSBzcXJ0KGFeMiArIGJeMiArIC4uLilcclxuICpcclxuICogYXJndW1lbnRzIHtudW1iZXJ8c3RyaW5nfERlY2ltYWx9XHJcbiAqXHJcbiAqL1xyXG5mdW5jdGlvbiBoeXBvdCgpIHtcclxuICB2YXIgaSwgbixcclxuICAgIHQgPSBuZXcgdGhpcygwKTtcclxuXHJcbiAgZXh0ZXJuYWwgPSBmYWxzZTtcclxuXHJcbiAgZm9yIChpID0gMDsgaSA8IGFyZ3VtZW50cy5sZW5ndGg7KSB7XHJcbiAgICBuID0gbmV3IHRoaXMoYXJndW1lbnRzW2krK10pO1xyXG4gICAgaWYgKCFuLmQpIHtcclxuICAgICAgaWYgKG4ucykge1xyXG4gICAgICAgIGV4dGVybmFsID0gdHJ1ZTtcclxuICAgICAgICByZXR1cm4gbmV3IHRoaXMoMSAvIDApO1xyXG4gICAgICB9XHJcbiAgICAgIHQgPSBuO1xyXG4gICAgfSBlbHNlIGlmICh0LmQpIHtcclxuICAgICAgdCA9IHQucGx1cyhuLnRpbWVzKG4pKTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIGV4dGVybmFsID0gdHJ1ZTtcclxuXHJcbiAgcmV0dXJuIHQuc3FydCgpO1xyXG59XHJcblxyXG5cclxuLypcclxuICogUmV0dXJuIHRydWUgaWYgb2JqZWN0IGlzIGEgRGVjaW1hbCBpbnN0YW5jZSAod2hlcmUgRGVjaW1hbCBpcyBhbnkgRGVjaW1hbCBjb25zdHJ1Y3RvciksXHJcbiAqIG90aGVyd2lzZSByZXR1cm4gZmFsc2UuXHJcbiAqXHJcbiAqL1xyXG5mdW5jdGlvbiBpc0RlY2ltYWxJbnN0YW5jZShvYmopIHtcclxuICByZXR1cm4gb2JqIGluc3RhbmNlb2YgRGVjaW1hbCB8fCBvYmogJiYgb2JqLnRvU3RyaW5nVGFnID09PSB0YWcgfHwgZmFsc2U7XHJcbn1cclxuXHJcblxyXG4vKlxyXG4gKiBSZXR1cm4gYSBuZXcgRGVjaW1hbCB3aG9zZSB2YWx1ZSBpcyB0aGUgbmF0dXJhbCBsb2dhcml0aG0gb2YgYHhgLCByb3VuZGVkIHRvIGBwcmVjaXNpb25gXHJcbiAqIHNpZ25pZmljYW50IGRpZ2l0cyB1c2luZyByb3VuZGluZyBtb2RlIGByb3VuZGluZ2AuXHJcbiAqXHJcbiAqIHgge251bWJlcnxzdHJpbmd8RGVjaW1hbH1cclxuICpcclxuICovXHJcbmZ1bmN0aW9uIGxuKHgpIHtcclxuICByZXR1cm4gbmV3IHRoaXMoeCkubG4oKTtcclxufVxyXG5cclxuXHJcbi8qXHJcbiAqIFJldHVybiBhIG5ldyBEZWNpbWFsIHdob3NlIHZhbHVlIGlzIHRoZSBsb2cgb2YgYHhgIHRvIHRoZSBiYXNlIGB5YCwgb3IgdG8gYmFzZSAxMCBpZiBubyBiYXNlXHJcbiAqIGlzIHNwZWNpZmllZCwgcm91bmRlZCB0byBgcHJlY2lzaW9uYCBzaWduaWZpY2FudCBkaWdpdHMgdXNpbmcgcm91bmRpbmcgbW9kZSBgcm91bmRpbmdgLlxyXG4gKlxyXG4gKiBsb2dbeV0oeClcclxuICpcclxuICogeCB7bnVtYmVyfHN0cmluZ3xEZWNpbWFsfSBUaGUgYXJndW1lbnQgb2YgdGhlIGxvZ2FyaXRobS5cclxuICogeSB7bnVtYmVyfHN0cmluZ3xEZWNpbWFsfSBUaGUgYmFzZSBvZiB0aGUgbG9nYXJpdGhtLlxyXG4gKlxyXG4gKi9cclxuZnVuY3Rpb24gbG9nKHgsIHkpIHtcclxuICByZXR1cm4gbmV3IHRoaXMoeCkubG9nKHkpO1xyXG59XHJcblxyXG5cclxuLypcclxuICogUmV0dXJuIGEgbmV3IERlY2ltYWwgd2hvc2UgdmFsdWUgaXMgdGhlIGJhc2UgMiBsb2dhcml0aG0gb2YgYHhgLCByb3VuZGVkIHRvIGBwcmVjaXNpb25gXHJcbiAqIHNpZ25pZmljYW50IGRpZ2l0cyB1c2luZyByb3VuZGluZyBtb2RlIGByb3VuZGluZ2AuXHJcbiAqXHJcbiAqIHgge251bWJlcnxzdHJpbmd8RGVjaW1hbH1cclxuICpcclxuICovXHJcbmZ1bmN0aW9uIGxvZzIoeCkge1xyXG4gIHJldHVybiBuZXcgdGhpcyh4KS5sb2coMik7XHJcbn1cclxuXHJcblxyXG4vKlxyXG4gKiBSZXR1cm4gYSBuZXcgRGVjaW1hbCB3aG9zZSB2YWx1ZSBpcyB0aGUgYmFzZSAxMCBsb2dhcml0aG0gb2YgYHhgLCByb3VuZGVkIHRvIGBwcmVjaXNpb25gXHJcbiAqIHNpZ25pZmljYW50IGRpZ2l0cyB1c2luZyByb3VuZGluZyBtb2RlIGByb3VuZGluZ2AuXHJcbiAqXHJcbiAqIHgge251bWJlcnxzdHJpbmd8RGVjaW1hbH1cclxuICpcclxuICovXHJcbmZ1bmN0aW9uIGxvZzEwKHgpIHtcclxuICByZXR1cm4gbmV3IHRoaXMoeCkubG9nKDEwKTtcclxufVxyXG5cclxuXHJcbi8qXHJcbiAqIFJldHVybiBhIG5ldyBEZWNpbWFsIHdob3NlIHZhbHVlIGlzIHRoZSBtYXhpbXVtIG9mIHRoZSBhcmd1bWVudHMuXHJcbiAqXHJcbiAqIGFyZ3VtZW50cyB7bnVtYmVyfHN0cmluZ3xEZWNpbWFsfVxyXG4gKlxyXG4gKi9cclxuZnVuY3Rpb24gbWF4KCkge1xyXG4gIHJldHVybiBtYXhPck1pbih0aGlzLCBhcmd1bWVudHMsICdsdCcpO1xyXG59XHJcblxyXG5cclxuLypcclxuICogUmV0dXJuIGEgbmV3IERlY2ltYWwgd2hvc2UgdmFsdWUgaXMgdGhlIG1pbmltdW0gb2YgdGhlIGFyZ3VtZW50cy5cclxuICpcclxuICogYXJndW1lbnRzIHtudW1iZXJ8c3RyaW5nfERlY2ltYWx9XHJcbiAqXHJcbiAqL1xyXG5mdW5jdGlvbiBtaW4oKSB7XHJcbiAgcmV0dXJuIG1heE9yTWluKHRoaXMsIGFyZ3VtZW50cywgJ2d0Jyk7XHJcbn1cclxuXHJcblxyXG4vKlxyXG4gKiBSZXR1cm4gYSBuZXcgRGVjaW1hbCB3aG9zZSB2YWx1ZSBpcyBgeGAgbW9kdWxvIGB5YCwgcm91bmRlZCB0byBgcHJlY2lzaW9uYCBzaWduaWZpY2FudCBkaWdpdHNcclxuICogdXNpbmcgcm91bmRpbmcgbW9kZSBgcm91bmRpbmdgLlxyXG4gKlxyXG4gKiB4IHtudW1iZXJ8c3RyaW5nfERlY2ltYWx9XHJcbiAqIHkge251bWJlcnxzdHJpbmd8RGVjaW1hbH1cclxuICpcclxuICovXHJcbmZ1bmN0aW9uIG1vZCh4LCB5KSB7XHJcbiAgcmV0dXJuIG5ldyB0aGlzKHgpLm1vZCh5KTtcclxufVxyXG5cclxuXHJcbi8qXHJcbiAqIFJldHVybiBhIG5ldyBEZWNpbWFsIHdob3NlIHZhbHVlIGlzIGB4YCBtdWx0aXBsaWVkIGJ5IGB5YCwgcm91bmRlZCB0byBgcHJlY2lzaW9uYCBzaWduaWZpY2FudFxyXG4gKiBkaWdpdHMgdXNpbmcgcm91bmRpbmcgbW9kZSBgcm91bmRpbmdgLlxyXG4gKlxyXG4gKiB4IHtudW1iZXJ8c3RyaW5nfERlY2ltYWx9XHJcbiAqIHkge251bWJlcnxzdHJpbmd8RGVjaW1hbH1cclxuICpcclxuICovXHJcbmZ1bmN0aW9uIG11bCh4LCB5KSB7XHJcbiAgcmV0dXJuIG5ldyB0aGlzKHgpLm11bCh5KTtcclxufVxyXG5cclxuXHJcbi8qXHJcbiAqIFJldHVybiBhIG5ldyBEZWNpbWFsIHdob3NlIHZhbHVlIGlzIGB4YCByYWlzZWQgdG8gdGhlIHBvd2VyIGB5YCwgcm91bmRlZCB0byBwcmVjaXNpb25cclxuICogc2lnbmlmaWNhbnQgZGlnaXRzIHVzaW5nIHJvdW5kaW5nIG1vZGUgYHJvdW5kaW5nYC5cclxuICpcclxuICogeCB7bnVtYmVyfHN0cmluZ3xEZWNpbWFsfSBUaGUgYmFzZS5cclxuICogeSB7bnVtYmVyfHN0cmluZ3xEZWNpbWFsfSBUaGUgZXhwb25lbnQuXHJcbiAqXHJcbiAqL1xyXG5mdW5jdGlvbiBwb3coeCwgeSkge1xyXG4gIHJldHVybiBuZXcgdGhpcyh4KS5wb3coeSk7XHJcbn1cclxuXHJcblxyXG4vKlxyXG4gKiBSZXR1cm5zIGEgbmV3IERlY2ltYWwgd2l0aCBhIHJhbmRvbSB2YWx1ZSBlcXVhbCB0byBvciBncmVhdGVyIHRoYW4gMCBhbmQgbGVzcyB0aGFuIDEsIGFuZCB3aXRoXHJcbiAqIGBzZGAsIG9yIGBEZWNpbWFsLnByZWNpc2lvbmAgaWYgYHNkYCBpcyBvbWl0dGVkLCBzaWduaWZpY2FudCBkaWdpdHMgKG9yIGxlc3MgaWYgdHJhaWxpbmcgemVyb3NcclxuICogYXJlIHByb2R1Y2VkKS5cclxuICpcclxuICogW3NkXSB7bnVtYmVyfSBTaWduaWZpY2FudCBkaWdpdHMuIEludGVnZXIsIDAgdG8gTUFYX0RJR0lUUyBpbmNsdXNpdmUuXHJcbiAqXHJcbiAqL1xyXG5mdW5jdGlvbiByYW5kb20oc2QpIHtcclxuICB2YXIgZCwgZSwgaywgbixcclxuICAgIGkgPSAwLFxyXG4gICAgciA9IG5ldyB0aGlzKDEpLFxyXG4gICAgcmQgPSBbXTtcclxuXHJcbiAgaWYgKHNkID09PSB2b2lkIDApIHNkID0gdGhpcy5wcmVjaXNpb247XHJcbiAgZWxzZSBjaGVja0ludDMyKHNkLCAxLCBNQVhfRElHSVRTKTtcclxuXHJcbiAgayA9IE1hdGguY2VpbChzZCAvIExPR19CQVNFKTtcclxuXHJcbiAgaWYgKCF0aGlzLmNyeXB0bykge1xyXG4gICAgZm9yICg7IGkgPCBrOykgcmRbaSsrXSA9IE1hdGgucmFuZG9tKCkgKiAxZTcgfCAwO1xyXG5cclxuICAvLyBCcm93c2VycyBzdXBwb3J0aW5nIGNyeXB0by5nZXRSYW5kb21WYWx1ZXMuXHJcbiAgfSBlbHNlIGlmIChjcnlwdG8uZ2V0UmFuZG9tVmFsdWVzKSB7XHJcbiAgICBkID0gY3J5cHRvLmdldFJhbmRvbVZhbHVlcyhuZXcgVWludDMyQXJyYXkoaykpO1xyXG5cclxuICAgIGZvciAoOyBpIDwgazspIHtcclxuICAgICAgbiA9IGRbaV07XHJcblxyXG4gICAgICAvLyAwIDw9IG4gPCA0Mjk0OTY3Mjk2XHJcbiAgICAgIC8vIFByb2JhYmlsaXR5IG4gPj0gNC4yOWU5LCBpcyA0OTY3Mjk2IC8gNDI5NDk2NzI5NiA9IDAuMDAxMTYgKDEgaW4gODY1KS5cclxuICAgICAgaWYgKG4gPj0gNC4yOWU5KSB7XHJcbiAgICAgICAgZFtpXSA9IGNyeXB0by5nZXRSYW5kb21WYWx1ZXMobmV3IFVpbnQzMkFycmF5KDEpKVswXTtcclxuICAgICAgfSBlbHNlIHtcclxuXHJcbiAgICAgICAgLy8gMCA8PSBuIDw9IDQyODk5OTk5OTlcclxuICAgICAgICAvLyAwIDw9IChuICUgMWU3KSA8PSA5OTk5OTk5XHJcbiAgICAgICAgcmRbaSsrXSA9IG4gJSAxZTc7XHJcbiAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgLy8gTm9kZS5qcyBzdXBwb3J0aW5nIGNyeXB0by5yYW5kb21CeXRlcy5cclxuICB9IGVsc2UgaWYgKGNyeXB0by5yYW5kb21CeXRlcykge1xyXG5cclxuICAgIC8vIGJ1ZmZlclxyXG4gICAgZCA9IGNyeXB0by5yYW5kb21CeXRlcyhrICo9IDQpO1xyXG5cclxuICAgIGZvciAoOyBpIDwgazspIHtcclxuXHJcbiAgICAgIC8vIDAgPD0gbiA8IDIxNDc0ODM2NDhcclxuICAgICAgbiA9IGRbaV0gKyAoZFtpICsgMV0gPDwgOCkgKyAoZFtpICsgMl0gPDwgMTYpICsgKChkW2kgKyAzXSAmIDB4N2YpIDw8IDI0KTtcclxuXHJcbiAgICAgIC8vIFByb2JhYmlsaXR5IG4gPj0gMi4xNGU5LCBpcyA3NDgzNjQ4IC8gMjE0NzQ4MzY0OCA9IDAuMDAzNSAoMSBpbiAyODYpLlxyXG4gICAgICBpZiAobiA+PSAyLjE0ZTkpIHtcclxuICAgICAgICBjcnlwdG8ucmFuZG9tQnl0ZXMoNCkuY29weShkLCBpKTtcclxuICAgICAgfSBlbHNlIHtcclxuXHJcbiAgICAgICAgLy8gMCA8PSBuIDw9IDIxMzk5OTk5OTlcclxuICAgICAgICAvLyAwIDw9IChuICUgMWU3KSA8PSA5OTk5OTk5XHJcbiAgICAgICAgcmQucHVzaChuICUgMWU3KTtcclxuICAgICAgICBpICs9IDQ7XHJcbiAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBpID0gayAvIDQ7XHJcbiAgfSBlbHNlIHtcclxuICAgIHRocm93IEVycm9yKGNyeXB0b1VuYXZhaWxhYmxlKTtcclxuICB9XHJcblxyXG4gIGsgPSByZFstLWldO1xyXG4gIHNkICU9IExPR19CQVNFO1xyXG5cclxuICAvLyBDb252ZXJ0IHRyYWlsaW5nIGRpZ2l0cyB0byB6ZXJvcyBhY2NvcmRpbmcgdG8gc2QuXHJcbiAgaWYgKGsgJiYgc2QpIHtcclxuICAgIG4gPSBtYXRocG93KDEwLCBMT0dfQkFTRSAtIHNkKTtcclxuICAgIHJkW2ldID0gKGsgLyBuIHwgMCkgKiBuO1xyXG4gIH1cclxuXHJcbiAgLy8gUmVtb3ZlIHRyYWlsaW5nIHdvcmRzIHdoaWNoIGFyZSB6ZXJvLlxyXG4gIGZvciAoOyByZFtpXSA9PT0gMDsgaS0tKSByZC5wb3AoKTtcclxuXHJcbiAgLy8gWmVybz9cclxuICBpZiAoaSA8IDApIHtcclxuICAgIGUgPSAwO1xyXG4gICAgcmQgPSBbMF07XHJcbiAgfSBlbHNlIHtcclxuICAgIGUgPSAtMTtcclxuXHJcbiAgICAvLyBSZW1vdmUgbGVhZGluZyB3b3JkcyB3aGljaCBhcmUgemVybyBhbmQgYWRqdXN0IGV4cG9uZW50IGFjY29yZGluZ2x5LlxyXG4gICAgZm9yICg7IHJkWzBdID09PSAwOyBlIC09IExPR19CQVNFKSByZC5zaGlmdCgpO1xyXG5cclxuICAgIC8vIENvdW50IHRoZSBkaWdpdHMgb2YgdGhlIGZpcnN0IHdvcmQgb2YgcmQgdG8gZGV0ZXJtaW5lIGxlYWRpbmcgemVyb3MuXHJcbiAgICBmb3IgKGsgPSAxLCBuID0gcmRbMF07IG4gPj0gMTA7IG4gLz0gMTApIGsrKztcclxuXHJcbiAgICAvLyBBZGp1c3QgdGhlIGV4cG9uZW50IGZvciBsZWFkaW5nIHplcm9zIG9mIHRoZSBmaXJzdCB3b3JkIG9mIHJkLlxyXG4gICAgaWYgKGsgPCBMT0dfQkFTRSkgZSAtPSBMT0dfQkFTRSAtIGs7XHJcbiAgfVxyXG5cclxuICByLmUgPSBlO1xyXG4gIHIuZCA9IHJkO1xyXG5cclxuICByZXR1cm4gcjtcclxufVxyXG5cclxuXHJcbi8qXHJcbiAqIFJldHVybiBhIG5ldyBEZWNpbWFsIHdob3NlIHZhbHVlIGlzIGB4YCByb3VuZGVkIHRvIGFuIGludGVnZXIgdXNpbmcgcm91bmRpbmcgbW9kZSBgcm91bmRpbmdgLlxyXG4gKlxyXG4gKiBUbyBlbXVsYXRlIGBNYXRoLnJvdW5kYCwgc2V0IHJvdW5kaW5nIHRvIDcgKFJPVU5EX0hBTEZfQ0VJTCkuXHJcbiAqXHJcbiAqIHgge251bWJlcnxzdHJpbmd8RGVjaW1hbH1cclxuICpcclxuICovXHJcbmZ1bmN0aW9uIHJvdW5kKHgpIHtcclxuICByZXR1cm4gZmluYWxpc2UoeCA9IG5ldyB0aGlzKHgpLCB4LmUgKyAxLCB0aGlzLnJvdW5kaW5nKTtcclxufVxyXG5cclxuXHJcbi8qXHJcbiAqIFJldHVyblxyXG4gKiAgIDEgICAgaWYgeCA+IDAsXHJcbiAqICAtMSAgICBpZiB4IDwgMCxcclxuICogICAwICAgIGlmIHggaXMgMCxcclxuICogIC0wICAgIGlmIHggaXMgLTAsXHJcbiAqICAgTmFOICBvdGhlcndpc2VcclxuICpcclxuICogeCB7bnVtYmVyfHN0cmluZ3xEZWNpbWFsfVxyXG4gKlxyXG4gKi9cclxuZnVuY3Rpb24gc2lnbih4KSB7XHJcbiAgeCA9IG5ldyB0aGlzKHgpO1xyXG4gIHJldHVybiB4LmQgPyAoeC5kWzBdID8geC5zIDogMCAqIHgucykgOiB4LnMgfHwgTmFOO1xyXG59XHJcblxyXG5cclxuLypcclxuICogUmV0dXJuIGEgbmV3IERlY2ltYWwgd2hvc2UgdmFsdWUgaXMgdGhlIHNpbmUgb2YgYHhgLCByb3VuZGVkIHRvIGBwcmVjaXNpb25gIHNpZ25pZmljYW50IGRpZ2l0c1xyXG4gKiB1c2luZyByb3VuZGluZyBtb2RlIGByb3VuZGluZ2AuXHJcbiAqXHJcbiAqIHgge251bWJlcnxzdHJpbmd8RGVjaW1hbH0gQSB2YWx1ZSBpbiByYWRpYW5zLlxyXG4gKlxyXG4gKi9cclxuZnVuY3Rpb24gc2luKHgpIHtcclxuICByZXR1cm4gbmV3IHRoaXMoeCkuc2luKCk7XHJcbn1cclxuXHJcblxyXG4vKlxyXG4gKiBSZXR1cm4gYSBuZXcgRGVjaW1hbCB3aG9zZSB2YWx1ZSBpcyB0aGUgaHlwZXJib2xpYyBzaW5lIG9mIGB4YCwgcm91bmRlZCB0byBgcHJlY2lzaW9uYFxyXG4gKiBzaWduaWZpY2FudCBkaWdpdHMgdXNpbmcgcm91bmRpbmcgbW9kZSBgcm91bmRpbmdgLlxyXG4gKlxyXG4gKiB4IHtudW1iZXJ8c3RyaW5nfERlY2ltYWx9IEEgdmFsdWUgaW4gcmFkaWFucy5cclxuICpcclxuICovXHJcbmZ1bmN0aW9uIHNpbmgoeCkge1xyXG4gIHJldHVybiBuZXcgdGhpcyh4KS5zaW5oKCk7XHJcbn1cclxuXHJcblxyXG4vKlxyXG4gKiBSZXR1cm4gYSBuZXcgRGVjaW1hbCB3aG9zZSB2YWx1ZSBpcyB0aGUgc3F1YXJlIHJvb3Qgb2YgYHhgLCByb3VuZGVkIHRvIGBwcmVjaXNpb25gIHNpZ25pZmljYW50XHJcbiAqIGRpZ2l0cyB1c2luZyByb3VuZGluZyBtb2RlIGByb3VuZGluZ2AuXHJcbiAqXHJcbiAqIHgge251bWJlcnxzdHJpbmd8RGVjaW1hbH1cclxuICpcclxuICovXHJcbmZ1bmN0aW9uIHNxcnQoeCkge1xyXG4gIHJldHVybiBuZXcgdGhpcyh4KS5zcXJ0KCk7XHJcbn1cclxuXHJcblxyXG4vKlxyXG4gKiBSZXR1cm4gYSBuZXcgRGVjaW1hbCB3aG9zZSB2YWx1ZSBpcyBgeGAgbWludXMgYHlgLCByb3VuZGVkIHRvIGBwcmVjaXNpb25gIHNpZ25pZmljYW50IGRpZ2l0c1xyXG4gKiB1c2luZyByb3VuZGluZyBtb2RlIGByb3VuZGluZ2AuXHJcbiAqXHJcbiAqIHgge251bWJlcnxzdHJpbmd8RGVjaW1hbH1cclxuICogeSB7bnVtYmVyfHN0cmluZ3xEZWNpbWFsfVxyXG4gKlxyXG4gKi9cclxuZnVuY3Rpb24gc3ViKHgsIHkpIHtcclxuICByZXR1cm4gbmV3IHRoaXMoeCkuc3ViKHkpO1xyXG59XHJcblxyXG5cclxuLypcclxuICogUmV0dXJuIGEgbmV3IERlY2ltYWwgd2hvc2UgdmFsdWUgaXMgdGhlIHN1bSBvZiB0aGUgYXJndW1lbnRzLCByb3VuZGVkIHRvIGBwcmVjaXNpb25gXHJcbiAqIHNpZ25pZmljYW50IGRpZ2l0cyB1c2luZyByb3VuZGluZyBtb2RlIGByb3VuZGluZ2AuXHJcbiAqXHJcbiAqIE9ubHkgdGhlIHJlc3VsdCBpcyByb3VuZGVkLCBub3QgdGhlIGludGVybWVkaWF0ZSBjYWxjdWxhdGlvbnMuXHJcbiAqXHJcbiAqIGFyZ3VtZW50cyB7bnVtYmVyfHN0cmluZ3xEZWNpbWFsfVxyXG4gKlxyXG4gKi9cclxuZnVuY3Rpb24gc3VtKCkge1xyXG4gIHZhciBpID0gMCxcclxuICAgIGFyZ3MgPSBhcmd1bWVudHMsXHJcbiAgICB4ID0gbmV3IHRoaXMoYXJnc1tpXSk7XHJcblxyXG4gIGV4dGVybmFsID0gZmFsc2U7XHJcbiAgZm9yICg7IHgucyAmJiArK2kgPCBhcmdzLmxlbmd0aDspIHggPSB4LnBsdXMoYXJnc1tpXSk7XHJcbiAgZXh0ZXJuYWwgPSB0cnVlO1xyXG5cclxuICByZXR1cm4gZmluYWxpc2UoeCwgdGhpcy5wcmVjaXNpb24sIHRoaXMucm91bmRpbmcpO1xyXG59XHJcblxyXG5cclxuLypcclxuICogUmV0dXJuIGEgbmV3IERlY2ltYWwgd2hvc2UgdmFsdWUgaXMgdGhlIHRhbmdlbnQgb2YgYHhgLCByb3VuZGVkIHRvIGBwcmVjaXNpb25gIHNpZ25pZmljYW50XHJcbiAqIGRpZ2l0cyB1c2luZyByb3VuZGluZyBtb2RlIGByb3VuZGluZ2AuXHJcbiAqXHJcbiAqIHgge251bWJlcnxzdHJpbmd8RGVjaW1hbH0gQSB2YWx1ZSBpbiByYWRpYW5zLlxyXG4gKlxyXG4gKi9cclxuZnVuY3Rpb24gdGFuKHgpIHtcclxuICByZXR1cm4gbmV3IHRoaXMoeCkudGFuKCk7XHJcbn1cclxuXHJcblxyXG4vKlxyXG4gKiBSZXR1cm4gYSBuZXcgRGVjaW1hbCB3aG9zZSB2YWx1ZSBpcyB0aGUgaHlwZXJib2xpYyB0YW5nZW50IG9mIGB4YCwgcm91bmRlZCB0byBgcHJlY2lzaW9uYFxyXG4gKiBzaWduaWZpY2FudCBkaWdpdHMgdXNpbmcgcm91bmRpbmcgbW9kZSBgcm91bmRpbmdgLlxyXG4gKlxyXG4gKiB4IHtudW1iZXJ8c3RyaW5nfERlY2ltYWx9IEEgdmFsdWUgaW4gcmFkaWFucy5cclxuICpcclxuICovXHJcbmZ1bmN0aW9uIHRhbmgoeCkge1xyXG4gIHJldHVybiBuZXcgdGhpcyh4KS50YW5oKCk7XHJcbn1cclxuXHJcblxyXG4vKlxyXG4gKiBSZXR1cm4gYSBuZXcgRGVjaW1hbCB3aG9zZSB2YWx1ZSBpcyBgeGAgdHJ1bmNhdGVkIHRvIGFuIGludGVnZXIuXHJcbiAqXHJcbiAqIHgge251bWJlcnxzdHJpbmd8RGVjaW1hbH1cclxuICpcclxuICovXHJcbmZ1bmN0aW9uIHRydW5jKHgpIHtcclxuICByZXR1cm4gZmluYWxpc2UoeCA9IG5ldyB0aGlzKHgpLCB4LmUgKyAxLCAxKTtcclxufVxyXG5cclxuXHJcblBbU3ltYm9sLmZvcignbm9kZWpzLnV0aWwuaW5zcGVjdC5jdXN0b20nKV0gPSBQLnRvU3RyaW5nO1xyXG5QW1N5bWJvbC50b1N0cmluZ1RhZ10gPSAnRGVjaW1hbCc7XHJcblxyXG4vLyBDcmVhdGUgYW5kIGNvbmZpZ3VyZSBpbml0aWFsIERlY2ltYWwgY29uc3RydWN0b3IuXHJcbmV4cG9ydCB2YXIgRGVjaW1hbCA9IFAuY29uc3RydWN0b3IgPSBjbG9uZShERUZBVUxUUyk7XHJcblxyXG4vLyBDcmVhdGUgdGhlIGludGVybmFsIGNvbnN0YW50cyBmcm9tIHRoZWlyIHN0cmluZyB2YWx1ZXMuXHJcbkxOMTAgPSBuZXcgRGVjaW1hbChMTjEwKTtcclxuUEkgPSBuZXcgRGVjaW1hbChQSSk7XHJcblxyXG5leHBvcnQgZGVmYXVsdCBEZWNpbWFsO1xyXG4iLCAiLypcbk5vdGFibGUgY2hhbmdlcyBtYWRlIChhbmQgbm90ZXMpOlxuLSBOdW1iZXIgY2xhc3NlcyByZWdpc3RlcmVkIGFmdGVyIHRoZXkgYXJlIGRlZmluZWRcbi0gRmxvYXQgaXMgaGFuZGVsZWQgZW50aXJlbHkgYnkgZGVjaW1hbC5qcywgYW5kIG5vdyBvbmx5IHRha2VzIHByZWNpc2lvbiBpblxuICAjIG9mIGRlY2ltYWwgcG9pbnRzXG4tIE5vdGU6IG9ubHkgbWV0aG9kcyBuZWNlc3NhcnkgZm9yIGFkZCwgbXVsLCBhbmQgcG93IGhhdmUgYmVlbiBpbXBsZW1lbnRlZFxuKi9cblxuLy8gYmFzaWMgaW1wbGVtZW50YXRpb25zIG9ubHkgLSBubyB1dGlsaXR5IGFkZGVkIHlldFxuaW1wb3J0IHtfQXRvbWljRXhwcn0gZnJvbSBcIi4vZXhwci5qc1wiO1xuaW1wb3J0IHtOdW1iZXJLaW5kfSBmcm9tIFwiLi9raW5kLmpzXCI7XG5pbXBvcnQge01hbmFnZWRQcm9wZXJ0aWVzfSBmcm9tIFwiLi9hc3N1bXB0aW9ucy5qc1wiO1xuaW1wb3J0IHtnbG9iYWxfcGFyYW1ldGVyc30gZnJvbSBcIi4vcGFyYW1ldGVycy5qc1wiO1xuaW1wb3J0IHtBZGR9IGZyb20gXCIuL2FkZC5qc1wiO1xuaW1wb3J0IHtTLCBTaW5nbGV0b259IGZyb20gXCIuL3NpbmdsZXRvbi5qc1wiO1xuaW1wb3J0IERlY2ltYWwgZnJvbSBcImRlY2ltYWwuanNcIjtcbmltcG9ydCB7YXNfaW50fSBmcm9tIFwiLi4vdXRpbGl0aWVzL21pc2MuanNcIjtcbmltcG9ydCB7UG93fSBmcm9tIFwiLi9wb3dlci5qc1wiO1xuaW1wb3J0IHtHbG9iYWx9IGZyb20gXCIuL2dsb2JhbC5qc1wiO1xuaW1wb3J0IHtkaXZtb2QsIGZhY3RvcmludCwgZmFjdG9ycmF0LCBwZXJmZWN0X3Bvd2VyfSBmcm9tIFwiLi4vbnRoZW9yeS9mYWN0b3JfLmpzXCI7XG5pbXBvcnQge0hhc2hEaWN0fSBmcm9tIFwiLi91dGlsaXR5LmpzXCI7XG5pbXBvcnQge011bH0gZnJvbSBcIi4vbXVsLmpzXCI7XG5cbi8qXG51dGlsaXR5IGZ1bmN0aW9uc1xuXG5UaGVzZSBhcmUgc29tZXdoYXQgd3JpdHRlbiBkaWZmZXJlbnRseSB0aGFuIGluIHN5bXB5ICh3aGljaCBkZXBlbmRzIG9uIG1wbWF0aClcbmJ1dCB0aGV5IHByb3ZpZGUgdGhlIHNhbWUgZnVuY3Rpb25hbGl0eVxuKi9cblxuZnVuY3Rpb24gaWdjZCh4OiBudW1iZXIsIHk6IG51bWJlcikge1xuICAgIHdoaWxlICh5KSB7XG4gICAgICAgIGNvbnN0IHQgPSB5O1xuICAgICAgICB5ID0geCAlIHk7XG4gICAgICAgIHggPSB0O1xuICAgIH1cbiAgICByZXR1cm4geDtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGludF9udGhyb290KHk6IG51bWJlciwgbjogbnVtYmVyKSB7XG4gICAgY29uc3QgeCA9IE1hdGguZmxvb3IoeSoqKDEvbikpO1xuICAgIGNvbnN0IGlzZXhhY3QgPSB4KipuID09PSB5O1xuICAgIHJldHVybiBbeCwgaXNleGFjdF07XG59XG5cbi8vIHR1cm4gYSBmbG9hdCB0byBhIHJhdGlvbmFsIC0+IHJlcGxpYWNhdGVzIG1wbWF0aCBmdW5jdGlvbmFsaXR5IGJ1dCB3ZSBzaG91bGRcbi8vIHByb2JhYmx5IGZpbmQgYSBsaWJyYXJ5IHRvIGRvIHRoaXMgZXZlbnR1YWxseVxuZnVuY3Rpb24gdG9SYXRpbyhuOiBhbnksIGVwczogbnVtYmVyKSB7XG4gICAgY29uc3QgZ2NkZSA9IChlOiBudW1iZXIsIHg6IG51bWJlciwgeTogbnVtYmVyKSA9PiB7XG4gICAgICAgIGNvbnN0IF9nY2Q6IGFueSA9IChhOiBudW1iZXIsIGI6IG51bWJlcikgPT4gKGIgPCBlID8gYSA6IF9nY2QoYiwgYSAlIGIpKTtcbiAgICAgICAgcmV0dXJuIF9nY2QoTWF0aC5hYnMoeCksIE1hdGguYWJzKHkpKTtcbiAgICB9O1xuICAgIGNvbnN0IGMgPSBnY2RlKEJvb2xlYW4oZXBzKSA/IGVwcyA6ICgxIC8gMTAwMDApLCAxLCBuKTtcbiAgICByZXR1cm4gW01hdGguZmxvb3IobiAvIGMpLCBNYXRoLmZsb29yKDEgLyBjKV07XG59XG5cbmZ1bmN0aW9uIGlnY2RleChhOiBudW1iZXIgPSB1bmRlZmluZWQsIGI6IG51bWJlciA9IHVuZGVmaW5lZCkge1xuICAgIGlmICh0eXBlb2YgYSA9PT0gXCJ1bmRlZmluZWRcIiAmJiB0eXBlb2YgYiA9PT0gXCJ1bmRlZmluZWRcIikge1xuICAgICAgICByZXR1cm4gWzAsIDEsIDBdO1xuICAgIH1cblxuICAgIGlmICh0eXBlb2YgYSA9PT0gXCJ1bmRlZmluZWRcIikge1xuICAgICAgICByZXR1cm4gWzAsIE1hdGguZmxvb3IoYiAvIE1hdGguYWJzKGIpKSwgTWF0aC5hYnMoYildO1xuICAgIH1cblxuICAgIGlmICh0eXBlb2YgYiA9PT0gXCJ1bmRlZmluZWRcIikge1xuICAgICAgICByZXR1cm4gW01hdGguZmxvb3IoYSAvIE1hdGguYWJzKGEpKSwgMCwgTWF0aC5hYnMoYSldO1xuICAgIH1cbiAgICBsZXQgeF9zaWduO1xuICAgIGxldCB5X3NpZ247XG4gICAgaWYgKGEgPCAwKSB7XG4gICAgICAgIGEgPSAtMTtcbiAgICAgICAgeF9zaWduID0gLTE7XG4gICAgfSBlbHNlIHtcbiAgICAgICAgeF9zaWduID0gMTtcbiAgICB9XG4gICAgaWYgKGIgPCAwKSB7XG4gICAgICAgIGIgPSAtYjtcbiAgICAgICAgeV9zaWduID0gLTE7XG4gICAgfSBlbHNlIHtcbiAgICAgICAgeV9zaWduID0gMTtcbiAgICB9XG5cbiAgICBsZXQgW3gsIHksIHIsIHNdID0gWzEsIDAsIDAsIDFdO1xuICAgIGxldCBjOyBsZXQgcTtcbiAgICB3aGlsZSAoYikge1xuICAgICAgICBbYywgcV0gPSBbYSAlIGIsIE1hdGguZmxvb3IoYSAvIGIpXTtcbiAgICAgICAgW2EsIGIsIHIsIHMsIHgsIHldID0gW2IsIGMsIHggLSBxICogciwgeSAtIHEgKiBzLCByLCBzXTtcbiAgICB9XG4gICAgcmV0dXJuIFt4ICogeF9zaWduLCB5ICogeV9zaWduLCBhXTtcbn1cblxuZnVuY3Rpb24gbW9kX2ludmVyc2UoYTogYW55LCBtOiBhbnkpIHtcbiAgICBsZXQgYyA9IHVuZGVmaW5lZDtcbiAgICBbYSwgbV0gPSBbYXNfaW50KGEpLCBhc19pbnQobSldO1xuICAgIGlmIChtICE9PSAxICYmIG0gIT09IC0xKSB7XG4gICAgICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBuby11bnVzZWQtdmFyc1xuICAgICAgICBjb25zdCBbeCwgYiwgZ10gPSBpZ2NkZXgoYSwgbSk7XG4gICAgICAgIGlmIChnID09PSAxKSB7XG4gICAgICAgICAgICBjID0geCAmIG07XG4gICAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIGM7XG59XG5cbkdsb2JhbC5yZWdpc3RlcmZ1bmMoXCJtb2RfaW52ZXJzZVwiLCBtb2RfaW52ZXJzZSk7XG5cbmNsYXNzIF9OdW1iZXJfIGV4dGVuZHMgX0F0b21pY0V4cHIge1xuICAgIC8qXG4gICAgUmVwcmVzZW50cyBhdG9taWMgbnVtYmVycyBpbiBTeW1QeS5cbiAgICBFeHBsYW5hdGlvblxuICAgID09PT09PT09PT09XG4gICAgRmxvYXRpbmcgcG9pbnQgbnVtYmVycyBhcmUgcmVwcmVzZW50ZWQgYnkgdGhlIEZsb2F0IGNsYXNzLlxuICAgIFJhdGlvbmFsIG51bWJlcnMgKG9mIGFueSBzaXplKSBhcmUgcmVwcmVzZW50ZWQgYnkgdGhlIFJhdGlvbmFsIGNsYXNzLlxuICAgIEludGVnZXIgbnVtYmVycyAob2YgYW55IHNpemUpIGFyZSByZXByZXNlbnRlZCBieSB0aGUgSW50ZWdlciBjbGFzcy5cbiAgICBGbG9hdCBhbmQgUmF0aW9uYWwgYXJlIHN1YmNsYXNzZXMgb2YgTnVtYmVyOyBJbnRlZ2VyIGlzIGEgc3ViY2xhc3NcbiAgICBvZiBSYXRpb25hbC5cbiAgICBGb3IgZXhhbXBsZSwgYGAyLzNgYCBpcyByZXByZXNlbnRlZCBhcyBgYFJhdGlvbmFsKDIsIDMpYGAgd2hpY2ggaXNcbiAgICBhIGRpZmZlcmVudCBvYmplY3QgZnJvbSB0aGUgZmxvYXRpbmcgcG9pbnQgbnVtYmVyIG9idGFpbmVkIHdpdGhcbiAgICBQeXRob24gZGl2aXNpb24gYGAyLzNgYC4gRXZlbiBmb3IgbnVtYmVycyB0aGF0IGFyZSBleGFjdGx5XG4gICAgcmVwcmVzZW50ZWQgaW4gYmluYXJ5LCB0aGVyZSBpcyBhIGRpZmZlcmVuY2UgYmV0d2VlbiBob3cgdHdvIGZvcm1zLFxuICAgIHN1Y2ggYXMgYGBSYXRpb25hbCgxLCAyKWBgIGFuZCBgYEZsb2F0KDAuNSlgYCwgYXJlIHVzZWQgaW4gU3ltUHkuXG4gICAgVGhlIHJhdGlvbmFsIGZvcm0gaXMgdG8gYmUgcHJlZmVycmVkIGluIHN5bWJvbGljIGNvbXB1dGF0aW9ucy5cbiAgICBPdGhlciBraW5kcyBvZiBudW1iZXJzLCBzdWNoIGFzIGFsZ2VicmFpYyBudW1iZXJzIGBgc3FydCgyKWBgIG9yXG4gICAgY29tcGxleCBudW1iZXJzIGBgMyArIDQqSWBgLCBhcmUgbm90IGluc3RhbmNlcyBvZiBOdW1iZXIgY2xhc3MgYXNcbiAgICB0aGV5IGFyZSBub3QgYXRvbWljLlxuICAgIFNlZSBBbHNvXG4gICAgPT09PT09PT1cbiAgICBGbG9hdCwgSW50ZWdlciwgUmF0aW9uYWxcbiAgICAqL1xuICAgIHN0YXRpYyBpc19jb21tdXRhdGl2ZSA9IHRydWU7XG4gICAgc3RhdGljIGlzX251bWJlciA9IHRydWU7XG4gICAgc3RhdGljIGlzX051bWJlciA9IHRydWU7XG4gICAgc3RhdGljIGtpbmQgPSBOdW1iZXJLaW5kO1xuXG4gICAgc3RhdGljIG5ldyguLi5vYmo6IGFueSkge1xuICAgICAgICBpZiAob2JqLmxlbmd0aCA9PT0gMSkge1xuICAgICAgICAgICAgb2JqID0gb2JqWzBdO1xuICAgICAgICB9XG4gICAgICAgIGlmIChvYmogaW5zdGFuY2VvZiBfTnVtYmVyXykge1xuICAgICAgICAgICAgcmV0dXJuIG9iajtcbiAgICAgICAgfSBlbHNlIGlmICh0eXBlb2Ygb2JqID09PSBcIm51bWJlclwiICYmICFOdW1iZXIuaXNJbnRlZ2VyKG9iaikgfHwgb2JqIGluc3RhbmNlb2YgRGVjaW1hbCB8fCB0eXBlb2Ygb2JqID09PSBcInN0cmluZ1wiKSB7XG4gICAgICAgICAgICByZXR1cm4gbmV3IEZsb2F0KG9iaik7XG4gICAgICAgIH0gZWxzZSBpZiAoTnVtYmVyLmlzSW50ZWdlcihvYmopKSB7XG4gICAgICAgICAgICByZXR1cm4gbmV3IEludGVnZXIob2JqKTtcbiAgICAgICAgfSBlbHNlIGlmIChvYmoubGVuZ3RoID09PSAyKSB7XG4gICAgICAgICAgICByZXR1cm4gbmV3IFJhdGlvbmFsKG9ialswXSwgb2JqWzFdKTtcbiAgICAgICAgfSBlbHNlIGlmICh0eXBlb2Ygb2JqID09PSBcInN0cmluZ1wiKSB7XG4gICAgICAgICAgICBjb25zdCBfb2JqID0gb2JqLnRvTG93ZXJDYXNlKCk7XG4gICAgICAgICAgICBpZiAoX29iaiA9PT0gXCJuYW5cIikge1xuICAgICAgICAgICAgICAgIHJldHVybiBTLk5hTjtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoX29iaiA9PT0gXCJpbmZcIikge1xuICAgICAgICAgICAgICAgIHJldHVybiBTLkluZmluaXR5O1xuICAgICAgICAgICAgfSBlbHNlIGlmIChfb2JqID09PSBcIitpbmZcIikge1xuICAgICAgICAgICAgICAgIHJldHVybiBTLkluZmluaXR5O1xuICAgICAgICAgICAgfSBlbHNlIGlmIChfb2JqID09PSBcIi1pbmZcIikge1xuICAgICAgICAgICAgICAgIHJldHVybiBTLk5lZ2F0aXZlSW5maW5pdHk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcImFyZ3VtZW50IGZvciBudW1iZXIgaXMgaW52YWxpZFwiKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJhcmd1bWVudCBmb3IgbnVtYmVyIGlzIGludmFsaWRcIik7XG4gICAgfVxuXG4gICAgYXNfY29lZmZfTXVsKHJhdGlvbmFsOiBib29sZWFuID0gZmFsc2UpIHtcbiAgICAgICAgaWYgKHJhdGlvbmFsICYmICF0aGlzLmlzX1JhdGlvbmFsKSB7XG4gICAgICAgICAgICByZXR1cm4gW1MuT25lLCB0aGlzXTtcbiAgICAgICAgfVxuICAgICAgICBpZiAodGhpcykge1xuICAgICAgICAgICAgcmV0dXJuIFt0aGlzLCBTLk9uZV07XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gW1MuT25lLCB0aGlzXTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGFzX2NvZWZmX0FkZCgpIHtcbiAgICAgICAgcmV0dXJuIFt0aGlzLCBTLlplcm9dO1xuICAgIH1cblxuICAgIC8vIE5PVEU6IFRIRVNFIE1FVEhPRFMgQVJFIE5PVCBZRVQgSU1QTEVNRU5URUQgSU4gVEhFIFNVUEVSQ0xBU1NcblxuICAgIF9fYWRkX18ob3RoZXI6IGFueSkge1xuICAgICAgICBpZiAob3RoZXIgaW5zdGFuY2VvZiBfTnVtYmVyXyAmJiBnbG9iYWxfcGFyYW1ldGVycy5ldmFsdWF0ZSkge1xuICAgICAgICAgICAgaWYgKG90aGVyID09PSBTLk5hTikge1xuICAgICAgICAgICAgICAgIHJldHVybiBTLk5hTjtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAob3RoZXIgPT09IFMuSW5maW5pdHkpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gUy5JbmZpbml0eTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAob3RoZXIgPT09IFMuTmVnYXRpdmVJbmZpbml0eSkge1xuICAgICAgICAgICAgICAgIHJldHVybiBTLk5lZ2F0aXZlSW5maW5pdHk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHN1cGVyLl9fYWRkX18ob3RoZXIpO1xuICAgIH1cblxuICAgIF9fc3ViX18ob3RoZXI6IGFueSkge1xuICAgICAgICBpZiAob3RoZXIgaW5zdGFuY2VvZiBfTnVtYmVyXyAmJiBnbG9iYWxfcGFyYW1ldGVycy5ldmFsdWF0ZSkge1xuICAgICAgICAgICAgaWYgKG90aGVyID09PSBTLk5hTikge1xuICAgICAgICAgICAgICAgIHJldHVybiBTLk5hTjtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAob3RoZXIgPT09IFMuSW5maW5pdHkpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gUy5OZWdhdGl2ZUluZmluaXR5O1xuICAgICAgICAgICAgfSBlbHNlIGlmIChvdGhlciA9PT0gUy5OZWdhdGl2ZUluZmluaXR5KSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIFMuSW5maW5pdHk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHN1cGVyLl9fc3ViX18ob3RoZXIpO1xuICAgIH1cblxuICAgIF9fbXVsX18ob3RoZXI6IGFueSkge1xuICAgICAgICBpZiAob3RoZXIgaW5zdGFuY2VvZiBfTnVtYmVyXyAmJiBnbG9iYWxfcGFyYW1ldGVycy5ldmFsdWF0ZSkge1xuICAgICAgICAgICAgY29uc3QgY2xzOiBhbnkgPSB0aGlzLmNvbnN0cnVjdG9yO1xuICAgICAgICAgICAgaWYgKG90aGVyID09PSBTLk5hbikge1xuICAgICAgICAgICAgICAgIHJldHVybiBTLk5hbjtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAob3RoZXIgPT09IFMuSW5maW5pdHkpIHtcbiAgICAgICAgICAgICAgICBpZiAoY2xzLmlzX3plcm8pIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFMuTmFOO1xuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoY2xzLmlzX3Bvc2l0aXZlKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBTLkluZmluaXR5O1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBTLk5lZ2F0aXZlSW5maW5pdHk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSBlbHNlIGlmIChvdGhlciA9PT0gUy5OZWdhdGl2ZUluZmluaXR5KSB7XG4gICAgICAgICAgICAgICAgaWYgKGNscy5pc196ZXJvKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBTLk5hTjtcbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKGNscy5pc19wb3NpdGl2ZSkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gUy5OZWdhdGl2ZUluZmluaXR5O1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBTLkluZmluaXR5O1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gc3VwZXIuX19tdWxfXyhvdGhlcik7XG4gICAgfVxuICAgIF9fdHJ1ZWRpdl9fKG90aGVyOiBhbnkpIHtcbiAgICAgICAgaWYgKG90aGVyIGluc3RhbmNlb2YgX051bWJlcl8gJiYgZ2xvYmFsX3BhcmFtZXRlcnMuZXZhbHVhdGUpIHtcbiAgICAgICAgICAgIGlmIChvdGhlciA9PT0gUy5OYU4pIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gUy5OYU47XG4gICAgICAgICAgICB9IGVsc2UgaWYgKG90aGVyID09PSBTLkluZmluaXR5IHx8IG90aGVyID09PSBTLk5lZ2F0aXZlSW5maW5pdHkpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gUy5aZXJvO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBzdXBlci5fX3RydWVkaXZfXyhvdGhlcik7XG4gICAgfVxuXG4gICAgZXZhbF9ldmFsZihwcmVjOiBudW1iZXIpIHtcbiAgICAgICAgcmV0dXJuIG5ldyBGbG9hdCh0aGlzLl9mbG9hdF92YWwocHJlYyksIHByZWMpO1xuICAgIH1cblxuICAgIF9mbG9hdF92YWwocHJlYzogbnVtYmVyKTogYW55IHtcbiAgICAgICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgICB9XG59O1xuXG4vLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbmV3LWNhcFxuTWFuYWdlZFByb3BlcnRpZXMucmVnaXN0ZXIoX051bWJlcl8pO1xuR2xvYmFsLnJlZ2lzdGVyKFwiX051bWJlcl9cIiwgX051bWJlcl8ubmV3KTtcblxuY2xhc3MgRmxvYXQgZXh0ZW5kcyBfTnVtYmVyXyB7XG4gICAgLypcbiAgICAobm90IGNvcHlpbmcgc3ltcHkgY29tbWVudCBiZWNhdXNlIHRoaXMgaW1wbGVtZW50YXRpb24gaXMgdmVyeSBkaWZmZXJlbnQpXG4gICAgc2VlIGhlYWRlciBjb21tZW50IGZvciBjaGFuZ2VzXG4gICAgKi9cbiAgICBfX3Nsb3RzX186IGFueVtdID0gW1wiX21wZl9cIiwgXCJfcHJlY1wiXTtcbiAgICBfbXBmXzogW251bWJlciwgbnVtYmVyLCBudW1iZXIsIG51bWJlcl07XG4gICAgc3RhdGljIGlzX3JhdGlvbmFsOiBhbnkgPSB1bmRlZmluZWQ7XG4gICAgc3RhdGljIGlzX2lycmF0aW9uYWw6IGFueSA9IHVuZGVmaW5lZDtcbiAgICBzdGF0aWMgaXNfbnVtYmVyID0gdHJ1ZTtcbiAgICBzdGF0aWMgaXNfcmVhbCA9IHRydWU7XG4gICAgc3RhdGljIGlzX2V4dGVuZGVkX3JlYWwgPSB0cnVlO1xuICAgIHN0YXRpYyBpc19GbG9hdCA9IHRydWU7XG4gICAgZGVjaW1hbDogRGVjaW1hbDtcbiAgICBwcmVjOiBudW1iZXI7XG5cbiAgICBjb25zdHJ1Y3RvcihudW06IGFueSwgcHJlYzogYW55ID0gMTUpIHtcbiAgICAgICAgc3VwZXIoKTtcbiAgICAgICAgdGhpcy5wcmVjID0gcHJlYztcbiAgICAgICAgaWYgKHR5cGVvZiBudW0gIT09IFwidW5kZWZpbmVkXCIpIHtcbiAgICAgICAgICAgIGlmIChudW0gaW5zdGFuY2VvZiBGbG9hdCkge1xuICAgICAgICAgICAgICAgIHRoaXMuZGVjaW1hbCA9IG51bS5kZWNpbWFsO1xuICAgICAgICAgICAgfSBlbHNlIGlmIChudW0gaW5zdGFuY2VvZiBEZWNpbWFsKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5kZWNpbWFsID0gbnVtO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICB0aGlzLmRlY2ltYWwgPSBuZXcgRGVjaW1hbChudW0pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgX19hZGRfXyhvdGhlcjogYW55KSB7XG4gICAgICAgIGlmIChnbG9iYWxfcGFyYW1ldGVycy5ldmFsdWF0ZSAmJiBvdGhlciBpbnN0YW5jZW9mIF9OdW1iZXJfKSB7XG4gICAgICAgICAgICBjb25zdCB2YWwgPSBvdGhlci5fZmxvYXRfdmFsKHRoaXMucHJlYyk7XG4gICAgICAgICAgICByZXR1cm4gbmV3IEZsb2F0KERlY2ltYWwuc2V0KHtwcmVjaXNpb246IHRoaXMucHJlY30pLmFkZCh0aGlzLmRlY2ltYWwsIHZhbC5kZWNpbWFsKSwgdGhpcy5wcmVjKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gc3VwZXIuX19hZGRfXyhvdGhlcik7XG4gICAgfVxuXG4gICAgX19zdWJfXyhvdGhlcjogYW55KSB7XG4gICAgICAgIGlmIChnbG9iYWxfcGFyYW1ldGVycy5ldmFsdWF0ZSAmJiBvdGhlciBpbnN0YW5jZW9mIF9OdW1iZXJfKSB7XG4gICAgICAgICAgICBjb25zdCB2YWwgPSBvdGhlci5fZmxvYXRfdmFsKHRoaXMucHJlYyk7XG4gICAgICAgICAgICByZXR1cm4gbmV3IEZsb2F0KERlY2ltYWwuc2V0KHtwcmVjaXNpb246IHRoaXMucHJlY30pLnN1Yih0aGlzLmRlY2ltYWwsIHZhbC5kZWNpbWFsKSwgdGhpcy5wcmVjKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gc3VwZXIuX19zdWJfXyhvdGhlcik7XG4gICAgfVxuXG4gICAgX19tdWxfXyhvdGhlcjogYW55KSB7XG4gICAgICAgIGlmIChnbG9iYWxfcGFyYW1ldGVycy5ldmFsdWF0ZSAmJiBvdGhlciBpbnN0YW5jZW9mIF9OdW1iZXJfKSB7XG4gICAgICAgICAgICBjb25zdCB2YWwgPSBvdGhlci5fZmxvYXRfdmFsKHRoaXMucHJlYyk7XG4gICAgICAgICAgICByZXR1cm4gbmV3IEZsb2F0KERlY2ltYWwuc2V0KHtwcmVjaXNpb246IHRoaXMucHJlY30pLm11bCh0aGlzLmRlY2ltYWwsIHZhbC5kZWNpbWFsKSwgdGhpcy5wcmVjKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gc3VwZXIuX19tdWxfXyhvdGhlcik7XG4gICAgfVxuXG4gICAgX190cnVlZGl2X18ob3RoZXI6IGFueSkge1xuICAgICAgICBpZiAoZ2xvYmFsX3BhcmFtZXRlcnMuZXZhbHVhdGUgJiYgb3RoZXIgaW5zdGFuY2VvZiBfTnVtYmVyXykge1xuICAgICAgICAgICAgY29uc3QgdmFsID0gb3RoZXIuX2Zsb2F0X3ZhbCh0aGlzLnByZWMpO1xuICAgICAgICAgICAgcmV0dXJuIG5ldyBGbG9hdChEZWNpbWFsLnNldCh7cHJlY2lzaW9uOiB0aGlzLnByZWN9KS5kaXYodGhpcy5kZWNpbWFsLCB2YWwuZGVjaW1hbCksIHRoaXMucHJlYyk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHN1cGVyLl9fZGl2X18ob3RoZXIpO1xuICAgIH1cblxuICAgIF9ldmFsX2lzX25lZ2F0aXZlKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5kZWNpbWFsLmxlc3NUaGFuKDApO1xuICAgIH1cblxuICAgIF9ldmFsX2lzX3Bvc2l0aXZlKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5kZWNpbWFsLmdyZWF0ZXJUaGFuKDApO1xuICAgIH1cblxuICAgIC8vIHJldHVybiBuZXcgRmxvYXQoRGVjaW1hbC5zZXQoe3ByZWNpc2lvbjogdGhpcy5wcmVjfSkucG93KHRoaXMuZGVjaW1hbCwgb3RoZXIuZXZhbF9ldmFsZih0aGlzLnByZWMpLmRlY2ltYWwpLCB0aGlzLnByZWMpO1xuXG4gICAgX2V2YWxfcG93ZXIoZXhwdDogYW55KSB7XG4gICAgICAgIGlmICh0aGlzID09PSBTLlplcm8pIHtcbiAgICAgICAgICAgIGlmIChleHB0LmlzX2V4dGVuZGVkX3Bvc2l0aXZlKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICAgICAgICB9IGlmIChleHB0LmlzX2V4dGVuZGVkX25lZ2F0aXZlKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIFMuQ29tcGxleEluZmluaXR5O1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGlmIChleHB0IGluc3RhbmNlb2YgX051bWJlcl8pIHtcbiAgICAgICAgICAgIGlmIChleHB0IGluc3RhbmNlb2YgSW50ZWdlcikge1xuICAgICAgICAgICAgICAgIGNvbnN0IHByZWMgPSB0aGlzLnByZWM7XG4gICAgICAgICAgICAgICAgcmV0dXJuIG5ldyBGbG9hdChEZWNpbWFsLnNldCh7cHJlY2lzaW9uOiB0aGlzLnByZWN9KS5wb3codGhpcy5kZWNpbWFsLCBleHB0LnApLCBwcmVjKTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoZXhwdCBpbnN0YW5jZW9mIFJhdGlvbmFsICYmXG4gICAgICAgICAgICAgICAgZXhwdC5wID09PSAxICYmIGV4cHQucSAlIDIgIT09IDAgJiYgdGhpcy5pc19uZWdhdGl2ZSgpKSB7XG4gICAgICAgICAgICAgICAgY29uc3QgbmVncGFydCA9ICh0aGlzLl9fbXVsX18oUy5OZWdhdGl2ZU9uZSkpLl9ldmFsX3Bvd2VyKGV4cHQpO1xuICAgICAgICAgICAgICAgIHJldHVybiBuZXcgTXVsKHRydWUsIHRydWUsIG5lZ3BhcnQsIG5ldyBQb3coUy5OZWdhdGl2ZU9uZSwgZXhwdCwgZmFsc2UpKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGNvbnN0IHZhbCA9IGV4cHQuX2Zsb2F0X3ZhbCh0aGlzLnByZWMpLmRlY2ltYWw7XG4gICAgICAgICAgICBjb25zdCByZXMgPSBEZWNpbWFsLnNldCh7cHJlY2lzaW9uOiB0aGlzLnByZWN9KS5wb3codGhpcy5kZWNpbWFsLCB2YWwpO1xuICAgICAgICAgICAgaWYgKHJlcy5pc05hTigpKSB7XG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiY29tcGxleCBhbmQgaW1hZ2luYXJ5IG51bWJlcnMgbm90IHlldCBpbXBsZW1lbnRlZFwiKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiBuZXcgRmxvYXQocmVzKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIF9mbG9hdF92YWwocHJlYzogbnVtYmVyKTogYW55IHtcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuXG4gICAgaW52ZXJzZSgpIHtcbiAgICAgICAgcmV0dXJuIG5ldyBGbG9hdCgxLyh0aGlzLmRlY2ltYWwgYXMgYW55KSk7XG4gICAgfVxuXG4gICAgX2V2YWxfaXNfZmluaXRlKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5kZWNpbWFsLmlzRmluaXRlKCk7XG4gICAgfVxufVxuXG5NYW5hZ2VkUHJvcGVydGllcy5yZWdpc3RlcihGbG9hdCk7XG5cblxuY2xhc3MgUmF0aW9uYWwgZXh0ZW5kcyBfTnVtYmVyXyB7XG4gICAgc3RhdGljIGlzX3JlYWwgPSB0cnVlO1xuICAgIHN0YXRpYyBpc19pbnRlZ2VyID0gZmFsc2U7XG4gICAgc3RhdGljIGlzX3JhdGlvbmFsID0gdHJ1ZTtcbiAgICBzdGF0aWMgaXNfbnVtYmVyID0gdHJ1ZTtcbiAgICBwOiBudW1iZXI7XG4gICAgcTogbnVtYmVyO1xuICAgIF9fc2xvdHNfXzogYW55W10gPSBbXCJwXCIsIFwicVwiXTtcblxuICAgIHN0YXRpYyBpc19SYXRpb25hbCA9IHRydWU7XG5cblxuICAgIGNvbnN0cnVjdG9yKHA6IGFueSwgcTogYW55ID0gdW5kZWZpbmVkLCBnY2Q6IG51bWJlciA9IHVuZGVmaW5lZCwgc2ltcGxpZnk6IGJvb2xlYW4gPSB0cnVlKSB7XG4gICAgICAgIHN1cGVyKCk7XG4gICAgICAgIGlmICh0eXBlb2YgcSA9PT0gXCJ1bmRlZmluZWRcIikge1xuICAgICAgICAgICAgaWYgKHAgaW5zdGFuY2VvZiBSYXRpb25hbCkge1xuICAgICAgICAgICAgICAgIHJldHVybiBwO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBpZiAodHlwZW9mIHAgPT09IFwibnVtYmVyXCIgJiYgcCAlIDEgIT09IDApIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIG5ldyBSYXRpb25hbCh0b1JhdGlvKHAsIDAuMDAwMSkpO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7fVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcSA9IDE7XG4gICAgICAgICAgICBnY2QgPSAxO1xuICAgICAgICB9XG4gICAgICAgIGlmICghTnVtYmVyLmlzSW50ZWdlcihwKSkge1xuICAgICAgICAgICAgcCA9IG5ldyBSYXRpb25hbChwKTtcbiAgICAgICAgICAgIHEgKj0gcC5xO1xuICAgICAgICAgICAgcCA9IHAucDtcbiAgICAgICAgfVxuICAgICAgICBpZiAoIU51bWJlci5pc0ludGVnZXIocSkpIHtcbiAgICAgICAgICAgIHEgPSBuZXcgUmF0aW9uYWwocSk7XG4gICAgICAgICAgICBwICo9IHEucTtcbiAgICAgICAgICAgIHEgPSBxLnA7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHEgPT09IDApIHtcbiAgICAgICAgICAgIGlmIChwID09PSAwKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIFMuTmFuO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIFMuQ29tcGxleEluZmluaXR5O1xuICAgICAgICB9XG4gICAgICAgIGlmIChxIDwgMCkge1xuICAgICAgICAgICAgcSA9IC1xO1xuICAgICAgICAgICAgcCA9IC1wO1xuICAgICAgICB9XG4gICAgICAgIGlmICh0eXBlb2YgZ2NkID09PSBcInVuZGVmaW5lZFwiKSB7XG4gICAgICAgICAgICBnY2QgPSBpZ2NkKE1hdGguYWJzKHApLCBxKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoZ2NkID4gMSkge1xuICAgICAgICAgICAgcCA9IHAvZ2NkO1xuICAgICAgICAgICAgcSA9IHEvZ2NkO1xuICAgICAgICB9XG4gICAgICAgIGlmIChxID09PSAxICYmIHNpbXBsaWZ5KSB7XG4gICAgICAgICAgICByZXR1cm4gbmV3IEludGVnZXIocCk7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5wID0gcDtcbiAgICAgICAgdGhpcy5xID0gcTtcbiAgICB9XG5cbiAgICBoYXNoS2V5KCkge1xuICAgICAgICByZXR1cm4gdGhpcy5jb25zdHJ1Y3Rvci5uYW1lICsgdGhpcy5wICsgdGhpcy5xO1xuICAgIH1cblxuICAgIF9fYWRkX18ob3RoZXI6IGFueSkge1xuICAgICAgICBpZiAoZ2xvYmFsX3BhcmFtZXRlcnMuZXZhbHVhdGUpIHtcbiAgICAgICAgICAgIGlmIChvdGhlciBpbnN0YW5jZW9mIEludGVnZXIpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gbmV3IFJhdGlvbmFsKHRoaXMucCArIHRoaXMucSAqIG90aGVyLnAsIHRoaXMucSwgMSk7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKG90aGVyIGluc3RhbmNlb2YgUmF0aW9uYWwpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gbmV3IFJhdGlvbmFsKHRoaXMucCAqIG90aGVyLnEgKyB0aGlzLnEgKiBvdGhlci5wLCB0aGlzLnEgKiBvdGhlci5xKTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAob3RoZXIgaW5zdGFuY2VvZiBGbG9hdCkge1xuICAgICAgICAgICAgICAgIHJldHVybiBvdGhlci5fX2FkZF9fKHRoaXMpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gc3VwZXIuX19hZGRfXyhvdGhlcik7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHN1cGVyLl9fYWRkX18ob3RoZXIpO1xuICAgIH1cblxuICAgIF9fcmFkZF9fKG90aGVyOiBhbnkpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX19hZGRfXyhvdGhlcik7XG4gICAgfVxuXG4gICAgX19zdWJfXyhvdGhlcjogYW55KSB7XG4gICAgICAgIGlmIChnbG9iYWxfcGFyYW1ldGVycy5ldmFsdWF0ZSkge1xuICAgICAgICAgICAgaWYgKG90aGVyIGluc3RhbmNlb2YgSW50ZWdlcikge1xuICAgICAgICAgICAgICAgIHJldHVybiBuZXcgUmF0aW9uYWwodGhpcy5xICogb3RoZXIucCAtIHRoaXMucCwgdGhpcy5xLCAxKTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAob3RoZXIgaW5zdGFuY2VvZiBSYXRpb25hbCkge1xuICAgICAgICAgICAgICAgIHJldHVybiBuZXcgUmF0aW9uYWwodGhpcy5wICogb3RoZXIucSAtIHRoaXMucSAqIG90aGVyLnAsIHRoaXMucSAqIG90aGVyLnEpO1xuICAgICAgICAgICAgfSBlbHNlIGlmIChvdGhlciBpbnN0YW5jZW9mIEZsb2F0KSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuX19tdWxfXyhTLk5lZ2F0aXZlT25lKS5fX2FkZF9fKG90aGVyKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHN1cGVyLl9fc3ViX18ob3RoZXIpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBzdXBlci5fX3N1Yl9fKG90aGVyKTtcbiAgICB9XG5cbiAgICBfX3JzdWJfXyhvdGhlcjogYW55KSB7XG4gICAgICAgIGlmIChnbG9iYWxfcGFyYW1ldGVycy5ldmFsdWF0ZSkge1xuICAgICAgICAgICAgaWYgKG90aGVyIGluc3RhbmNlb2YgSW50ZWdlcikge1xuICAgICAgICAgICAgICAgIHJldHVybiBuZXcgUmF0aW9uYWwodGhpcy5wIC0gdGhpcy5xICogb3RoZXIucCwgdGhpcy5xLCAxKTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAob3RoZXIgaW5zdGFuY2VvZiBSYXRpb25hbCkge1xuICAgICAgICAgICAgICAgIHJldHVybiBuZXcgUmF0aW9uYWwodGhpcy5xICogb3RoZXIucCAtIHRoaXMucCAqIG90aGVyLnEsIHRoaXMucSAqIG90aGVyLnEpO1xuICAgICAgICAgICAgfSBlbHNlIGlmIChvdGhlciBpbnN0YW5jZW9mIEZsb2F0KSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIG90aGVyLl9fbXVsX18oUy5OZWdhdGl2ZU9uZSkuX19hZGRfXyh0aGlzKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHN1cGVyLl9fcnN1Yl9fKG90aGVyKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gc3VwZXIuX19yc3ViX18ob3RoZXIpO1xuICAgIH1cblxuICAgIF9fbXVsX18ob3RoZXI6IGFueSkge1xuICAgICAgICBpZiAoZ2xvYmFsX3BhcmFtZXRlcnMuZXZhbHVhdGUpIHtcbiAgICAgICAgICAgIGlmIChvdGhlciBpbnN0YW5jZW9mIEludGVnZXIpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gbmV3IFJhdGlvbmFsKHRoaXMucCAqIG90aGVyLnAsIHRoaXMucSwgaWdjZChvdGhlci5wLCB0aGlzLnEpKTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAob3RoZXIgaW5zdGFuY2VvZiBSYXRpb25hbCkge1xuICAgICAgICAgICAgICAgIHJldHVybiBuZXcgUmF0aW9uYWwodGhpcy5wICogb3RoZXIucCwgdGhpcy5xICogb3RoZXIucSwgaWdjZCh0aGlzLnAsIG90aGVyLnEpICogaWdjZCh0aGlzLnEsIG90aGVyLnApKTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAob3RoZXIgaW5zdGFuY2VvZiBGbG9hdCkge1xuICAgICAgICAgICAgICAgIHJldHVybiBvdGhlci5fX211bF9fKHRoaXMpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gc3VwZXIuX19tdWxfXyhvdGhlcik7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHN1cGVyLl9fbXVsX18ob3RoZXIpO1xuICAgIH1cblxuICAgIF9fcm11bF9fKG90aGVyOiBhbnkpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX19tdWxfXyhvdGhlcik7XG4gICAgfVxuXG4gICAgX190cnVlZGl2X18ob3RoZXI6IGFueSkge1xuICAgICAgICBpZiAoZ2xvYmFsX3BhcmFtZXRlcnMuZXZhbHVhdGUpIHtcbiAgICAgICAgICAgIGlmIChvdGhlciBpbnN0YW5jZW9mIEludGVnZXIpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gbmV3IFJhdGlvbmFsKHRoaXMucCwgdGhpcy5xICogb3RoZXIucCwgaWdjZCh0aGlzLnAsIG90aGVyLnApKTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAob3RoZXIgaW5zdGFuY2VvZiBSYXRpb25hbCkge1xuICAgICAgICAgICAgICAgIHJldHVybiBuZXcgUmF0aW9uYWwodGhpcy5wICogb3RoZXIucSwgdGhpcy5xICogb3RoZXIucCwgaWdjZCh0aGlzLnAsIG90aGVyLnApICogaWdjZCh0aGlzLnEsIG90aGVyLnEpKTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAob3RoZXIgaW5zdGFuY2VvZiBGbG9hdCkge1xuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLl9fbXVsX18ob3RoZXIuaW52ZXJzZSgpKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHN1cGVyLl9fdHJ1ZWRpdl9fKG90aGVyKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gc3VwZXIuX190cnVlZGl2X18ob3RoZXIpO1xuICAgIH1cblxuICAgIF9fcnRydWVkaXZfXyhvdGhlcjogYW55KSB7XG4gICAgICAgIGlmIChnbG9iYWxfcGFyYW1ldGVycy5ldmFsdWF0ZSkge1xuICAgICAgICAgICAgaWYgKG90aGVyIGluc3RhbmNlb2YgSW50ZWdlcikge1xuICAgICAgICAgICAgICAgIHJldHVybiBuZXcgUmF0aW9uYWwob3RoZXIucCAqIHRoaXMucSwgdGhpcy5wLCBpZ2NkKHRoaXMucCwgb3RoZXIucCkpO1xuICAgICAgICAgICAgfSBlbHNlIGlmIChvdGhlciBpbnN0YW5jZW9mIFJhdGlvbmFsKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIG5ldyBSYXRpb25hbChvdGhlci5wICogdGhpcy5xLCBvdGhlci5xICogdGhpcy5wLCBpZ2NkKHRoaXMucCwgb3RoZXIucCkgKiBpZ2NkKHRoaXMucSwgb3RoZXIucSkpO1xuICAgICAgICAgICAgfSBlbHNlIGlmIChvdGhlciBpbnN0YW5jZW9mIEZsb2F0KSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIG90aGVyLl9fbXVsX18oUy5PbmUuX190cnVlZGl2X18odGhpcykpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gc3VwZXIuX19ydHJ1ZWRpdl9fKG90aGVyKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gc3VwZXIuX19ydHJ1ZWRpdl9fKG90aGVyKTtcbiAgICB9XG5cblxuICAgIF9ldmFsX3Bvd2VyKGV4cHQ6IGFueSkge1xuICAgICAgICBpZiAoZXhwdCBpbnN0YW5jZW9mIF9OdW1iZXJfKSB7XG4gICAgICAgICAgICBpZiAoZXhwdCBpbnN0YW5jZW9mIEZsb2F0KSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuZXZhbF9ldmFsZihleHB0LnByZWMpLl9ldmFsX3Bvd2VyKGV4cHQpO1xuICAgICAgICAgICAgfSBlbHNlIGlmIChleHB0IGluc3RhbmNlb2YgSW50ZWdlcikge1xuICAgICAgICAgICAgICAgIHJldHVybiBuZXcgUmF0aW9uYWwodGhpcy5wICoqIGV4cHQucCwgdGhpcy5xICoqIGV4cHQucCwgMSk7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKGV4cHQgaW5zdGFuY2VvZiBSYXRpb25hbCkge1xuICAgICAgICAgICAgICAgIGxldCBpbnRwYXJ0ID0gTWF0aC5mbG9vcihleHB0LnAgLyBleHB0LnEpO1xuICAgICAgICAgICAgICAgIGlmIChpbnRwYXJ0KSB7XG4gICAgICAgICAgICAgICAgICAgIGludHBhcnQrKztcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgcmVtZnJhY3BhcnQgPSBpbnRwYXJ0ICogZXhwdC5xIC0gZXhwdC5wO1xuICAgICAgICAgICAgICAgICAgICBjb25zdCByYXRmcmFjcGFydCA9IG5ldyBSYXRpb25hbChyZW1mcmFjcGFydCwgZXhwdC5xKTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXMucCAhPT0gMSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG1heC1sZW5cbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBuZXcgSW50ZWdlcih0aGlzLnApLl9ldmFsX3Bvd2VyKGV4cHQpLl9fbXVsX18obmV3IEludGVnZXIodGhpcy5xKSkuX2V2YWxfcG93ZXIocmF0ZnJhY3BhcnQpLl9fbXVsX18obmV3IFJhdGlvbmFsKDEsIHRoaXMucSAqKiBpbnRwYXJ0LCAxKSk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIG5ldyBJbnRlZ2VyKHRoaXMucSkuX2V2YWxfcG93ZXIocmF0ZnJhY3BhcnQpLl9fbXVsX18obmV3IFJhdGlvbmFsKDEsIHRoaXMucSAqKiBpbnRwYXJ0LCAxKSk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgcmVtZnJhY3BhcnQgPSBleHB0LnEgLSBleHB0LnA7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHJhdGZyYWNwYXJ0ID0gbmV3IFJhdGlvbmFsKHJlbWZyYWNwYXJ0LCBleHB0LnEpO1xuICAgICAgICAgICAgICAgICAgICBpZiAodGhpcy5wICE9PSAxKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbWF4LWxlblxuICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgcDEgPSBuZXcgSW50ZWdlcih0aGlzLnApLl9ldmFsX3Bvd2VyKGV4cHQpO1xuICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgcDIgPSBuZXcgSW50ZWdlcih0aGlzLnEpLl9ldmFsX3Bvd2VyKHJhdGZyYWNwYXJ0KTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBwMS5fX211bF9fKHAyKS5fX211bF9fKG5ldyBSYXRpb25hbCgxLCB0aGlzLnEsIDEpKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gbmV3IEludGVnZXIodGhpcy5xKS5fZXZhbF9wb3dlcihyYXRmcmFjcGFydCkuX19tdWxfXyhuZXcgUmF0aW9uYWwoMSwgdGhpcy5xLCAxKSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgYXNfY29lZmZfQWRkKCkge1xuICAgICAgICByZXR1cm4gW3RoaXMsIFMuWmVyb107XG4gICAgfVxuXG4gICAgX2Zsb2F0X3ZhbChwcmVjOiBudW1iZXIpOiBhbnkge1xuICAgICAgICBjb25zdCBhID0gbmV3IERlY2ltYWwodGhpcy5wKTtcbiAgICAgICAgY29uc3QgYiA9IG5ldyBEZWNpbWFsKHRoaXMucSk7XG4gICAgICAgIHJldHVybiBuZXcgRmxvYXQoRGVjaW1hbC5zZXQoe3ByZWNpc2lvbjogcHJlY30pLmRpdihhLCBiKSk7XG4gICAgfVxuICAgIF9hc19udW1lcl9kZW5vbSgpIHtcbiAgICAgICAgcmV0dXJuIFtuZXcgSW50ZWdlcih0aGlzLnApLCBuZXcgSW50ZWdlcih0aGlzLnEpXTtcbiAgICB9XG5cbiAgICBmYWN0b3JzKGxpbWl0OiBhbnkgPSB1bmRlZmluZWQpIHtcbiAgICAgICAgcmV0dXJuIGZhY3RvcnJhdCh0aGlzLCBsaW1pdCk7XG4gICAgfVxuXG4gICAgX2V2YWxfaXNfbmVnYXRpdmUoKSB7XG4gICAgICAgIGlmICh0aGlzLnAgPCAwICYmIHRoaXMucSA+IDApIHtcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgX2V2YWxfaXNfcG9zaXRpdmUoKSB7XG4gICAgICAgIHJldHVybiAhdGhpcy5fZXZhbF9pc19uZWdhdGl2ZTtcbiAgICB9XG5cbiAgICBfZXZhbF9pc19vZGQoKSB7XG4gICAgICAgIGNvbnNvbGUubG9nKFwiaGVsbG9cIik7XG4gICAgICAgIGNvbnNvbGUubG9nKHRoaXMpO1xuICAgICAgICByZXR1cm4gdGhpcy5wICUgMiAhPT0gMDtcbiAgICB9XG5cbiAgICBfZXZhbF9pc19ldmVuKCkge1xuICAgICAgICBjb25zb2xlLmxvZyhcImV2YWwgZXZlblwiKVxuICAgICAgICByZXR1cm4gdGhpcy5wICUgMiA9PT0gMDtcbiAgICB9XG5cbiAgICBfZXZhbF9pc19maW5pdGUoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLnAgPT09IFMuSW5maW5pdHkgfHwgdGhpcy5wID09PSBTLk5lZ2F0aXZlSW5maW5pdHk7XG4gICAgfVxuXG4gICAgZXEob3RoZXI6IFJhdGlvbmFsKSB7XG4gICAgICAgIHJldHVybiB0aGlzLnAgPT09IG90aGVyLnAgJiYgdGhpcy5xID09PSBvdGhlci5xO1xuICAgIH1cbn07XG5cbi8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBuZXctY2FwXG5NYW5hZ2VkUHJvcGVydGllcy5yZWdpc3RlcihSYXRpb25hbCk7XG5cbmNsYXNzIEludGVnZXIgZXh0ZW5kcyBSYXRpb25hbCB7XG4gICAgLypcbiAgICBSZXByZXNlbnRzIGludGVnZXIgbnVtYmVycyBvZiBhbnkgc2l6ZS5cbiAgICBFeGFtcGxlc1xuICAgID09PT09PT09XG4gICAgPj4+IGZyb20gc3ltcHkgaW1wb3J0IEludGVnZXJcbiAgICA+Pj4gSW50ZWdlcigzKVxuICAgIDNcbiAgICBJZiBhIGZsb2F0IG9yIGEgcmF0aW9uYWwgaXMgcGFzc2VkIHRvIEludGVnZXIsIHRoZSBmcmFjdGlvbmFsIHBhcnRcbiAgICB3aWxsIGJlIGRpc2NhcmRlZDsgdGhlIGVmZmVjdCBpcyBvZiByb3VuZGluZyB0b3dhcmQgemVyby5cbiAgICA+Pj4gSW50ZWdlcigzLjgpXG4gICAgM1xuICAgID4+PiBJbnRlZ2VyKC0zLjgpXG4gICAgLTNcbiAgICBBIHN0cmluZyBpcyBhY2NlcHRhYmxlIGlucHV0IGlmIGl0IGNhbiBiZSBwYXJzZWQgYXMgYW4gaW50ZWdlcjpcbiAgICA+Pj4gSW50ZWdlcihcIjlcIiAqIDIwKVxuICAgIDk5OTk5OTk5OTk5OTk5OTk5OTk5XG4gICAgSXQgaXMgcmFyZWx5IG5lZWRlZCB0byBleHBsaWNpdGx5IGluc3RhbnRpYXRlIGFuIEludGVnZXIsIGJlY2F1c2VcbiAgICBQeXRob24gaW50ZWdlcnMgYXJlIGF1dG9tYXRpY2FsbHkgY29udmVydGVkIHRvIEludGVnZXIgd2hlbiB0aGV5XG4gICAgYXJlIHVzZWQgaW4gU3ltUHkgZXhwcmVzc2lvbnMuXG4gICAgXCJcIlwiXG4gICAgKi9cbiAgICBzdGF0aWMgaXNfaW50ZWdlciA9IHRydWU7XG4gICAgc3RhdGljIGlzX0ludGVnZXIgPSB0cnVlO1xuICAgIF9fc2xvdHNfXzogYW55W10gPSBbXTtcbiAgICBjb25zdHJ1Y3RvcihwOiBudW1iZXIpIHtcbiAgICAgICAgc3VwZXIocCwgdW5kZWZpbmVkLCB1bmRlZmluZWQsIGZhbHNlKTtcbiAgICAgICAgdGhpcy5wID0gcDtcbiAgICAgICAgaWYgKHAgPT09IDEpIHtcbiAgICAgICAgICAgIHJldHVybiBTLk9uZTtcbiAgICAgICAgfSBlbHNlIGlmIChwID09PSAwKSB7XG4gICAgICAgICAgICByZXR1cm4gUy5aZXJvO1xuICAgICAgICB9IGVsc2UgaWYgKHAgPT09IC0xKSB7XG4gICAgICAgICAgICByZXR1cm4gUy5OZWdhdGl2ZU9uZTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGZhY3RvcnMobGltaXQ6IGFueSA9IHVuZGVmaW5lZCkge1xuICAgICAgICByZXR1cm4gZmFjdG9yaW50KHRoaXMucCwgbGltaXQpO1xuICAgIH1cblxuICAgIF9fYWRkX18ob3RoZXI6IGFueSk6IGFueSB7XG4gICAgICAgIGlmIChnbG9iYWxfcGFyYW1ldGVycy5ldmFsdWF0ZSkge1xuICAgICAgICAgICAgaWYgKE51bWJlci5pc0ludGVnZXIob3RoZXIpKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIG5ldyBJbnRlZ2VyKHRoaXMucCArIG90aGVyKTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAob3RoZXIgaW5zdGFuY2VvZiBJbnRlZ2VyKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIG5ldyBJbnRlZ2VyKHRoaXMucCArIG90aGVyLnApO1xuICAgICAgICAgICAgfSBlbHNlIGlmIChvdGhlciBpbnN0YW5jZW9mIFJhdGlvbmFsKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIG5ldyBSYXRpb25hbCh0aGlzLnAgKiBvdGhlci5xICsgb3RoZXIucCwgb3RoZXIucSwgMSk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHJldHVybiBzdXBlci5fX2FkZF9fKG90aGVyKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiBuZXcgQWRkKHRydWUsIHRydWUsIHRoaXMsIG90aGVyKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIF9fcmFkZF9fKG90aGVyOiBhbnkpOiBhbnkge1xuICAgICAgICBpZiAoZ2xvYmFsX3BhcmFtZXRlcnMuZXZhbHVhdGUpIHtcbiAgICAgICAgICAgIGlmIChOdW1iZXIuaXNJbnRlZ2VyKG90aGVyKSkge1xuICAgICAgICAgICAgICAgIHJldHVybiBuZXcgSW50ZWdlcihvdGhlciArIHRoaXMucCk7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKG90aGVyIGluc3RhbmNlb2YgUmF0aW9uYWwpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gbmV3IFJhdGlvbmFsKG90aGVyLnAgKyB0aGlzLnAgKiBvdGhlci5xLCBvdGhlci5xLCAxKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHN1cGVyLl9fcmFkZF9fKG90aGVyKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiBzdXBlci5fX3JhZGRfXyhvdGhlcik7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBfX3N1Yl9fKG90aGVyOiBhbnkpOiBhbnkge1xuICAgICAgICBpZiAoZ2xvYmFsX3BhcmFtZXRlcnMuZXZhbHVhdGUpIHtcbiAgICAgICAgICAgIGlmIChOdW1iZXIuaXNJbnRlZ2VyKG90aGVyKSkge1xuICAgICAgICAgICAgICAgIHJldHVybiBuZXcgSW50ZWdlcih0aGlzLnAgLSBvdGhlcik7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKG90aGVyIGluc3RhbmNlb2YgSW50ZWdlcikge1xuICAgICAgICAgICAgICAgIHJldHVybiBuZXcgSW50ZWdlcih0aGlzLnAgLSBvdGhlci5wKTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAob3RoZXIgaW5zdGFuY2VvZiBSYXRpb25hbCkge1xuICAgICAgICAgICAgICAgIHJldHVybiBuZXcgUmF0aW9uYWwodGhpcy5wICogb3RoZXIucSAtIG90aGVyLnAsIG90aGVyLnEsIDEpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gc3VwZXIuX19zdWJfXyhvdGhlcik7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gc3VwZXIuX19zdWJfXyhvdGhlcik7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBfX3JzdWJfXyhvdGhlcjogYW55KTogYW55IHtcbiAgICAgICAgaWYgKGdsb2JhbF9wYXJhbWV0ZXJzLmV2YWx1YXRlKSB7XG4gICAgICAgICAgICBpZiAoTnVtYmVyLmlzSW50ZWdlcihvdGhlcikpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gbmV3IEludGVnZXIodGhpcy5wIC0gb3RoZXIpO1xuICAgICAgICAgICAgfSBlbHNlIGlmIChvdGhlciBpbnN0YW5jZW9mIFJhdGlvbmFsKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIG5ldyBSYXRpb25hbChvdGhlci5wIC0gdGhpcy5wICogb3RoZXIucSwgb3RoZXIucSwgMSk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHJldHVybiBzdXBlci5fX3JzdWJfXyhvdGhlcik7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gc3VwZXIuX19yc3ViX18ob3RoZXIpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgX19tdWxfXyhvdGhlcjogYW55KTogYW55IHtcbiAgICAgICAgaWYgKGdsb2JhbF9wYXJhbWV0ZXJzLmV2YWx1YXRlKSB7XG4gICAgICAgICAgICBpZiAoTnVtYmVyLmlzSW50ZWdlcihvdGhlcikgKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIG5ldyBJbnRlZ2VyKHRoaXMucCAqIG90aGVyKTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAob3RoZXIgaW5zdGFuY2VvZiBJbnRlZ2VyKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIG5ldyBJbnRlZ2VyKHRoaXMucCAqIG90aGVyLnApO1xuICAgICAgICAgICAgfSBlbHNlIGlmIChvdGhlciBpbnN0YW5jZW9mIFJhdGlvbmFsKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIG5ldyBSYXRpb25hbCh0aGlzLnAgKiBvdGhlci5wLCBvdGhlci5xLCBpZ2NkKHRoaXMucCwgb3RoZXIucSkpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gc3VwZXIuX19tdWxfXyhvdGhlcik7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gc3VwZXIuX19tdWxfXyhvdGhlcik7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBfX3JtdWxfXyhvdGhlcjogYW55KTogYW55IHtcbiAgICAgICAgaWYgKGdsb2JhbF9wYXJhbWV0ZXJzLmV2YWx1YXRlKSB7XG4gICAgICAgICAgICBpZiAoTnVtYmVyLmlzSW50ZWdlcihvdGhlcikgKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIG5ldyBJbnRlZ2VyKG90aGVyICogdGhpcy5wKTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAob3RoZXIgaW5zdGFuY2VvZiBSYXRpb25hbCkge1xuICAgICAgICAgICAgICAgIHJldHVybiBuZXcgUmF0aW9uYWwob3RoZXIucCAqIHRoaXMucCwgb3RoZXIucSwgaWdjZCh0aGlzLnAsIG90aGVyLnEpKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHN1cGVyLl9fcm11bF9fKG90aGVyKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiBzdXBlci5fX3JtdWxfXyhvdGhlcik7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBfZXZhbF9pc19uZWdhdGl2ZSgpIHtcbiAgICAgICAgY29uc29sZS5sb2coXCJldmFsIG5lZ2F0aXZlXCIpXG4gICAgICAgIHJldHVybiB0aGlzLnAgPCAwO1xuICAgIH1cblxuICAgIF9ldmFsX2lzX3Bvc2l0aXZlKCkge1xuICAgICAgICBjb25zb2xlLmxvZyhcImV2YWwgcG9zaXRpdmVcIilcbiAgICAgICAgcmV0dXJuIHRoaXMucCA+IDA7XG4gICAgfVxuXG4gICAgX2V2YWxfaXNfb2RkKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5wICUgMiA9PT0gMTtcbiAgICB9XG5cbiAgICBfZXZhbF9wb3dlcihleHB0OiBhbnkpOiBhbnkge1xuICAgICAgICBpZiAoZXhwdCA9PT0gUy5JbmZpbml0eSkge1xuICAgICAgICAgICAgaWYgKHRoaXMucCA+IDEpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gUy5JbmZpbml0eTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBpZiAoZXhwdCA9PT0gUy5OZWdhdGl2ZUluZmluaXR5KSB7XG4gICAgICAgICAgICByZXR1cm4gbmV3IFJhdGlvbmFsKDEsIHRoaXMsIDEpLl9ldmFsX3Bvd2VyKFMuSW5maW5pdHkpO1xuICAgICAgICB9XG4gICAgICAgIGlmICghKGV4cHQgaW5zdGFuY2VvZiBfTnVtYmVyXykpIHtcbiAgICAgICAgICAgIGlmICh0aGlzLmlzX25lZ2F0aXZlICYmIGV4cHQuaXNfZXZlbikge1xuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLl9fbXVsX18oUy5OZWdhdGl2ZU9uZSkuX2V2YWxfcG93ZXIoZXhwdCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGV4cHQgaW5zdGFuY2VvZiBGbG9hdCkge1xuICAgICAgICAgICAgcmV0dXJuIHN1cGVyLl9ldmFsX3Bvd2VyKGV4cHQpO1xuICAgICAgICB9XG4gICAgICAgIGlmICghKGV4cHQgaW5zdGFuY2VvZiBSYXRpb25hbCkpIHtcbiAgICAgICAgICAgIHJldHVybiB1bmRlZmluZWQ7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGV4cHQuaXNfbmVnYXRpdmUoKSkge1xuICAgICAgICAgICAgY29uc3QgbmUgPSBleHB0Ll9fbXVsX18oUy5OZWdhdGl2ZU9uZSk7XG4gICAgICAgICAgICBpZiAodGhpcy5pc19uZWdhdGl2ZSgpKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIFMuTmVnYXRpdmVPbmUuX2V2YWxfcG93ZXIoZXhwdCkuX19tdWxfXyhuZXcgUmF0aW9uYWwoMSwgdGhpcy5fX211bF9fKFMuTmVnYXRpdmVPbmUpLCAxKSkuX2V2YWxfcG93ZXIobmUpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gbmV3IFJhdGlvbmFsKDEsIHRoaXMucCwgMSkuX2V2YWxfcG93ZXIobmUpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGNvbnN0IFt4LCB4ZXhhY3RdID0gaW50X250aHJvb3QoTWF0aC5hYnModGhpcy5wKSwgZXhwdC5xKTtcbiAgICAgICAgaWYgKHhleGFjdCkge1xuICAgICAgICAgICAgbGV0IHJlc3VsdCA9IG5ldyBJbnRlZ2VyKCh4IGFzIG51bWJlcikqKk1hdGguYWJzKGV4cHQucCkpO1xuICAgICAgICAgICAgaWYgKHRoaXMuaXNfbmVnYXRpdmUoKSkge1xuICAgICAgICAgICAgICAgIHJlc3VsdCA9IHJlc3VsdC5fX211bF9fKFMuTmVnYXRpdmVPbmUuX2V2YWxfcG93ZXIoZXhwdCkpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICAgICAgfVxuICAgICAgICBjb25zdCBiX3BvcyA9IE1hdGguYWJzKHRoaXMucCk7XG4gICAgICAgIGNvbnN0IHAgPSBwZXJmZWN0X3Bvd2VyKGJfcG9zKTtcbiAgICAgICAgbGV0IGRpY3QgPSBuZXcgSGFzaERpY3QoKTtcbiAgICAgICAgaWYgKHAgIT09IGZhbHNlKSB7XG4gICAgICAgICAgICBkaWN0LmFkZChwWzBdLCBwWzFdKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGRpY3QgPSBuZXcgSW50ZWdlcihiX3BvcykuZmFjdG9ycygyKioxNSk7XG4gICAgICAgIH1cblxuICAgICAgICBsZXQgb3V0X2ludCA9IDE7XG4gICAgICAgIGxldCBvdXRfcmFkOiBJbnRlZ2VyID0gUy5PbmU7XG4gICAgICAgIGxldCBzcXJfaW50ID0gMTtcbiAgICAgICAgbGV0IHNxcl9nY2QgPSAwO1xuICAgICAgICBjb25zdCBzcXJfZGljdCA9IG5ldyBIYXNoRGljdCgpO1xuICAgICAgICBsZXQgcHJpbWU7IGxldCBleHBvbmVudDtcbiAgICAgICAgZm9yIChbcHJpbWUsIGV4cG9uZW50XSBvZiBkaWN0LmVudHJpZXMoKSkge1xuICAgICAgICAgICAgZXhwb25lbnQgKj0gZXhwdC5wO1xuICAgICAgICAgICAgY29uc3QgW2Rpdl9lLCBkaXZfbV0gPSBkaXZtb2QoZXhwb25lbnQsIGV4cHQucSk7XG4gICAgICAgICAgICBpZiAoZGl2X2UgPiAwKSB7XG4gICAgICAgICAgICAgICAgb3V0X2ludCAqPSBwcmltZSoqZGl2X2U7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoZGl2X20gPiAwKSB7XG4gICAgICAgICAgICAgICAgY29uc3QgZyA9IGlnY2QoZGl2X20sIGV4cHQucSk7XG4gICAgICAgICAgICAgICAgaWYgKGcgIT09IDEpIHtcbiAgICAgICAgICAgICAgICAgICAgb3V0X3JhZCA9IG91dF9yYWQuX19tdWxfXyhuZXcgUG93KHByaW1lLCBuZXcgUmF0aW9uYWwoTWF0aC5mbG9vcihkaXZfbS9nKSwgTWF0aC5mbG9vcihleHB0LnEvZyksIDEpKSk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgc3FyX2RpY3QuYWRkKHByaW1lLCBkaXZfbSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGZvciAoY29uc3QgWywgZXhdIG9mIHNxcl9kaWN0LmVudHJpZXMoKSkge1xuICAgICAgICAgICAgaWYgKHNxcl9nY2QgPT09IDApIHtcbiAgICAgICAgICAgICAgICBzcXJfZ2NkID0gZXg7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHNxcl9nY2QgPSBpZ2NkKHNxcl9nY2QsIGV4KTtcbiAgICAgICAgICAgICAgICBpZiAoc3FyX2djZCA9PT0gMSkge1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgZm9yIChjb25zdCBbaywgdl0gb2Ygc3FyX2RpY3QuZW50cmllcygpKSB7XG4gICAgICAgICAgICBzcXJfaW50ICo9IGsqKihNYXRoLmZsb29yKHYvc3FyX2djZCkpO1xuICAgICAgICB9XG4gICAgICAgIGxldCByZXN1bHQ6IGFueTtcbiAgICAgICAgaWYgKHNxcl9pbnQgPT09IGJfcG9zICYmIG91dF9pbnQgPT09IDEgJiYgb3V0X3JhZCA9PT0gUy5PbmUpIHtcbiAgICAgICAgICAgIHJlc3VsdCA9IHVuZGVmaW5lZDtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGNvbnN0IHAxID0gb3V0X3JhZC5fX211bF9fKG5ldyBJbnRlZ2VyKG91dF9pbnQpKTtcbiAgICAgICAgICAgIGNvbnN0IHAyID0gbmV3IFBvdyhuZXcgSW50ZWdlcihzcXJfaW50KSwgbmV3IFJhdGlvbmFsKHNxcl9nY2QsIGV4cHQucSkpO1xuICAgICAgICAgICAgcmVzdWx0ID0gbmV3IE11bCh0cnVlLCB0cnVlLCBwMSwgcDIpO1xuICAgICAgICAgICAgaWYgKHRoaXMuaXNfbmVnYXRpdmUoKSkge1xuICAgICAgICAgICAgICAgIHJlc3VsdCA9IHJlc3VsdC5fX211bF9fKG5ldyBQb3coUy5OZWdhdGl2ZU9uZSwgZXhwdCkpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgfVxufTtcblxuTWFuYWdlZFByb3BlcnRpZXMucmVnaXN0ZXIoSW50ZWdlcik7XG5cblxuY2xhc3MgSW50ZWdlckNvbnN0YW50IGV4dGVuZHMgSW50ZWdlciB7XG4gICAgX19zbG90c19fOiBhbnlbXSA9IFtdO1xufTtcblxuTWFuYWdlZFByb3BlcnRpZXMucmVnaXN0ZXIoSW50ZWdlckNvbnN0YW50KTtcblxuY2xhc3MgWmVybyBleHRlbmRzIEludGVnZXJDb25zdGFudCB7XG4gICAgLypcbiAgICBUaGUgbnVtYmVyIHplcm8uXG4gICAgWmVybyBpcyBhIHNpbmdsZXRvbiwgYW5kIGNhbiBiZSBhY2Nlc3NlZCBieSBgYFMuWmVyb2BgXG4gICAgRXhhbXBsZXNcbiAgICA9PT09PT09PVxuICAgID4+PiBmcm9tIHN5bXB5IGltcG9ydCBTLCBJbnRlZ2VyXG4gICAgPj4+IEludGVnZXIoMCkgaXMgUy5aZXJvXG4gICAgVHJ1ZVxuICAgID4+PiAxL1MuWmVyb1xuICAgIHpvb1xuICAgIFJlZmVyZW5jZXNcbiAgICA9PT09PT09PT09XG4gICAgLi4gWzFdIGh0dHBzOi8vZW4ud2lraXBlZGlhLm9yZy93aWtpL1plcm9cbiAgICAqL1xuICAgIF9fc2xvdHNfXzogYW55W10gPSBbXTtcbiAgICBzdGF0aWMgaXNfcG9zaXRpdmUgPSBmYWxzZTtcbiAgICBzdGF0aWMgc3RhdGljID0gZmFsc2U7XG4gICAgc3RhdGljIGlzX3plcm8gPSB0cnVlO1xuICAgIHN0YXRpYyBpc19udW1iZXIgPSB0cnVlO1xuICAgIHN0YXRpYyBpc19jb21wYXJhYmxlID0gdHJ1ZTtcbiAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICAgICAgc3VwZXIoMCk7XG4gICAgfVxufTtcblxuTWFuYWdlZFByb3BlcnRpZXMucmVnaXN0ZXIoWmVybyk7XG5cblxuY2xhc3MgT25lIGV4dGVuZHMgSW50ZWdlckNvbnN0YW50IHtcbiAgICAvKlxuICAgIFRoZSBudW1iZXIgb25lLlxuICAgIE9uZSBpcyBhIHNpbmdsZXRvbiwgYW5kIGNhbiBiZSBhY2Nlc3NlZCBieSBgYFMuT25lYGAuXG4gICAgRXhhbXBsZXNcbiAgICA9PT09PT09PVxuICAgID4+PiBmcm9tIHN5bXB5IGltcG9ydCBTLCBJbnRlZ2VyXG4gICAgPj4+IEludGVnZXIoMSkgaXMgUy5PbmVcbiAgICBUcnVlXG4gICAgUmVmZXJlbmNlc1xuICAgID09PT09PT09PT1cbiAgICAuLiBbMV0gaHR0cHM6Ly9lbi53aWtpcGVkaWEub3JnL3dpa2kvMV8lMjhudW1iZXIlMjlcbiAgICAqL1xuICAgIHN0YXRpYyBpc19udW1iZXIgPSB0cnVlO1xuICAgIHN0YXRpYyBpc19wb3NpdGl2ZSA9IHRydWU7XG4gICAgc3RhdGljIGlzX3plcm8gPSBmYWxzZTtcbiAgICBfX3Nsb3RzX186IGFueVtdID0gW107XG4gICAgY29uc3RydWN0b3IoKSB7XG4gICAgICAgIHN1cGVyKDEpO1xuICAgIH1cbn07XG5cbk1hbmFnZWRQcm9wZXJ0aWVzLnJlZ2lzdGVyKE9uZSk7XG5cblxuY2xhc3MgTmVnYXRpdmVPbmUgZXh0ZW5kcyBJbnRlZ2VyQ29uc3RhbnQge1xuICAgIC8qXG4gICAgVGhlIG51bWJlciBuZWdhdGl2ZSBvbmUuXG4gICAgTmVnYXRpdmVPbmUgaXMgYSBzaW5nbGV0b24sIGFuZCBjYW4gYmUgYWNjZXNzZWQgYnkgYGBTLk5lZ2F0aXZlT25lYGAuXG4gICAgRXhhbXBsZXNcbiAgICA9PT09PT09PVxuICAgID4+PiBmcm9tIHN5bXB5IGltcG9ydCBTLCBJbnRlZ2VyXG4gICAgPj4+IEludGVnZXIoLTEpIGlzIFMuTmVnYXRpdmVPbmVcbiAgICBUcnVlXG4gICAgU2VlIEFsc29cbiAgICA9PT09PT09PVxuICAgIE9uZVxuICAgIFJlZmVyZW5jZXNcbiAgICA9PT09PT09PT09XG4gICAgLi4gWzFdIGh0dHBzOi8vZW4ud2lraXBlZGlhLm9yZy93aWtpLyVFMiU4OCU5MjFfJTI4bnVtYmVyJTI5XG4gICAgKi9cbiAgICBzdGF0aWMgaXNfbnVtYmVyID0gdHJ1ZTtcbiAgICBfX3Nsb3RzX186IGFueVtdID0gW107XG4gICAgY29uc3RydWN0b3IoKSB7XG4gICAgICAgIHN1cGVyKC0xKTtcbiAgICB9XG5cbiAgICBfZXZhbF9wb3dlcihleHB0OiBhbnkpIHtcbiAgICAgICAgaWYgKGV4cHQuaXNfb2RkKSB7XG4gICAgICAgICAgICByZXR1cm4gUy5OZWdhdGl2ZU9uZTtcbiAgICAgICAgfSBlbHNlIGlmIChleHB0LmlzX2V2ZW4pIHtcbiAgICAgICAgICAgIHJldHVybiBTLk9uZTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoZXhwdCBpbnN0YW5jZW9mIF9OdW1iZXJfKSB7XG4gICAgICAgICAgICBpZiAoZXhwdCBpbnN0YW5jZW9mIEZsb2F0KSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIG5ldyBGbG9hdCgtMS4wKS5fZXZhbF9wb3dlcihleHB0KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChleHB0ID09PSBTLk5hTikge1xuICAgICAgICAgICAgICAgIHJldHVybiBTLk5hTjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChleHB0ID09PSBTLkluZmluaXR5IHx8IGV4cHQgPT09IFMuTmVnYXRpdmVJbmZpbml0eSkge1xuICAgICAgICAgICAgICAgIHJldHVybiBTLk5hTjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm47XG4gICAgfVxufTtcblxuTWFuYWdlZFByb3BlcnRpZXMucmVnaXN0ZXIoTmVnYXRpdmVPbmUpO1xuXG5jbGFzcyBOYU4gZXh0ZW5kcyBfTnVtYmVyXyB7XG4gICAgLypcbiAgICBOb3QgYSBOdW1iZXIuXG4gICAgRXhwbGFuYXRpb25cbiAgICA9PT09PT09PT09PVxuICAgIFRoaXMgc2VydmVzIGFzIGEgcGxhY2UgaG9sZGVyIGZvciBudW1lcmljIHZhbHVlcyB0aGF0IGFyZSBpbmRldGVybWluYXRlLlxuICAgIE1vc3Qgb3BlcmF0aW9ucyBvbiBOYU4sIHByb2R1Y2UgYW5vdGhlciBOYU4uICBNb3N0IGluZGV0ZXJtaW5hdGUgZm9ybXMsXG4gICAgc3VjaCBhcyBgYDAvMGBgIG9yIGBgb28gLSBvb2AgcHJvZHVjZSBOYU4uICBUd28gZXhjZXB0aW9ucyBhcmUgYGAwKiowYGBcbiAgICBhbmQgYGBvbyoqMGBgLCB3aGljaCBhbGwgcHJvZHVjZSBgYDFgYCAodGhpcyBpcyBjb25zaXN0ZW50IHdpdGggUHl0aG9uJ3NcbiAgICBmbG9hdCkuXG4gICAgTmFOIGlzIGxvb3NlbHkgcmVsYXRlZCB0byBmbG9hdGluZyBwb2ludCBuYW4sIHdoaWNoIGlzIGRlZmluZWQgaW4gdGhlXG4gICAgSUVFRSA3NTQgZmxvYXRpbmcgcG9pbnQgc3RhbmRhcmQsIGFuZCBjb3JyZXNwb25kcyB0byB0aGUgUHl0aG9uXG4gICAgYGBmbG9hdCgnbmFuJylgYC4gIERpZmZlcmVuY2VzIGFyZSBub3RlZCBiZWxvdy5cbiAgICBOYU4gaXMgbWF0aGVtYXRpY2FsbHkgbm90IGVxdWFsIHRvIGFueXRoaW5nIGVsc2UsIGV2ZW4gTmFOIGl0c2VsZi4gIFRoaXNcbiAgICBleHBsYWlucyB0aGUgaW5pdGlhbGx5IGNvdW50ZXItaW50dWl0aXZlIHJlc3VsdHMgd2l0aCBgYEVxYGAgYW5kIGBgPT1gYCBpblxuICAgIHRoZSBleGFtcGxlcyBiZWxvdy5cbiAgICBOYU4gaXMgbm90IGNvbXBhcmFibGUgc28gaW5lcXVhbGl0aWVzIHJhaXNlIGEgVHlwZUVycm9yLiAgVGhpcyBpcyBpblxuICAgIGNvbnRyYXN0IHdpdGggZmxvYXRpbmcgcG9pbnQgbmFuIHdoZXJlIGFsbCBpbmVxdWFsaXRpZXMgYXJlIGZhbHNlLlxuICAgIE5hTiBpcyBhIHNpbmdsZXRvbiwgYW5kIGNhbiBiZSBhY2Nlc3NlZCBieSBgYFMuTmFOYGAsIG9yIGNhbiBiZSBpbXBvcnRlZFxuICAgIGFzIGBgbmFuYGAuXG4gICAgRXhhbXBsZXNcbiAgICA9PT09PT09PVxuICAgID4+PiBmcm9tIHN5bXB5IGltcG9ydCBuYW4sIFMsIG9vLCBFcVxuICAgID4+PiBuYW4gaXMgUy5OYU5cbiAgICBUcnVlXG4gICAgPj4+IG9vIC0gb29cbiAgICBuYW5cbiAgICA+Pj4gbmFuICsgMVxuICAgIG5hblxuICAgID4+PiBFcShuYW4sIG5hbikgICAjIG1hdGhlbWF0aWNhbCBlcXVhbGl0eVxuICAgIEZhbHNlXG4gICAgPj4+IG5hbiA9PSBuYW4gICAgICMgc3RydWN0dXJhbCBlcXVhbGl0eVxuICAgIFRydWVcbiAgICBSZWZlcmVuY2VzXG4gICAgPT09PT09PT09PVxuICAgIC4uIFsxXSBodHRwczovL2VuLndpa2lwZWRpYS5vcmcvd2lraS9OYU5cbiAgICAqL1xuICAgIHN0YXRpYyBpc19jb21tdXRhdGl2ZSA9IHRydWU7XG4gICAgc3RhdGljIGlzX2V4dGVuZGVkX3JlYWw6IGFueSA9IHVuZGVmaW5lZDtcbiAgICBzdGF0aWMgaXNfcmVhbDogYW55ID0gdW5kZWZpbmVkO1xuICAgIHN0YXRpYyBpc19yYXRpb25hOiBhbnkgPSB1bmRlZmluZWQ7XG4gICAgc3RhdGljIGlzX2FsZ2VicmFpYzogYW55ID0gdW5kZWZpbmVkO1xuICAgIHN0YXRpYyBpc190cmFuc2NlbmRlbnRhbDogYW55ID0gdW5kZWZpbmVkO1xuICAgIHN0YXRpYyBpc19pbnRlZ2VyOiBhbnkgPSB1bmRlZmluZWQ7XG4gICAgc3RhdGljIGlzX2NvbXBhcmFibGUgPSBmYWxzZTtcbiAgICBzdGF0aWMgaXNfZmluaXRlOiBhbnkgPSB1bmRlZmluZWQ7XG4gICAgc3RhdGljIGlzX3plcm86IGFueSA9IHVuZGVmaW5lZDtcbiAgICBzdGF0aWMgaXNfcHJpbWU6IGFueSA9IHVuZGVmaW5lZDtcbiAgICBzdGF0aWMgaXNfcG9zaXRpdmU6IGFueSA9IHVuZGVmaW5lZDtcbiAgICBzdGF0aWMgaXNfbmVnYXRpdmU6IGFueSA9IHVuZGVmaW5lZDtcbiAgICBzdGF0aWMgaXNfbnVtYmVyID0gdHJ1ZTtcbiAgICBfX3Nsb3RzX186IGFueSA9IFtdO1xufVxuXG5NYW5hZ2VkUHJvcGVydGllcy5yZWdpc3RlcihOYU4pO1xuXG4vLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbmV3LWNhcFxuY2xhc3MgQ29tcGxleEluZmluaXR5IGV4dGVuZHMgX0F0b21pY0V4cHIge1xuICAgIC8qXG4gICAgQ29tcGxleCBpbmZpbml0eS5cbiAgICBFeHBsYW5hdGlvblxuICAgID09PT09PT09PT09XG4gICAgSW4gY29tcGxleCBhbmFseXNpcyB0aGUgc3ltYm9sIGBcXHRpbGRlXFxpbmZ0eWAsIGNhbGxlZCBcImNvbXBsZXhcbiAgICBpbmZpbml0eVwiLCByZXByZXNlbnRzIGEgcXVhbnRpdHkgd2l0aCBpbmZpbml0ZSBtYWduaXR1ZGUsIGJ1dFxuICAgIHVuZGV0ZXJtaW5lZCBjb21wbGV4IHBoYXNlLlxuICAgIENvbXBsZXhJbmZpbml0eSBpcyBhIHNpbmdsZXRvbiwgYW5kIGNhbiBiZSBhY2Nlc3NlZCBieVxuICAgIGBgUy5Db21wbGV4SW5maW5pdHlgYCwgb3IgY2FuIGJlIGltcG9ydGVkIGFzIGBgem9vYGAuXG4gICAgRXhhbXBsZXNcbiAgICA9PT09PT09PVxuICAgID4+PiBmcm9tIHN5bXB5IGltcG9ydCB6b29cbiAgICA+Pj4gem9vICsgNDJcbiAgICB6b29cbiAgICA+Pj4gNDIvem9vXG4gICAgMFxuICAgID4+PiB6b28gKyB6b29cbiAgICBuYW5cbiAgICA+Pj4gem9vKnpvb1xuICAgIHpvb1xuICAgIFNlZSBBbHNvXG4gICAgPT09PT09PT1cbiAgICBJbmZpbml0eVxuICAgICovXG4gICAgc3RhdGljIGlzX2NvbW11dGF0aXZlID0gdHJ1ZTtcbiAgICBzdGF0aWMgaXNfaW5maW5pdGUgPSB0cnVlO1xuICAgIHN0YXRpYyBpc19udW1iZXIgPSB0cnVlO1xuICAgIHN0YXRpYyBpc19wcmltZSA9IGZhbHNlO1xuICAgIHN0YXRpYyBpc19jb21wbGV4ID0gZmFsc2U7XG4gICAgc3RhdGljIGlzX2V4dGVuZGVkX3JlYWwgPSBmYWxzZTtcbiAgICBraW5kID0gTnVtYmVyS2luZDtcbiAgICBfX3Nsb3RzX186IGFueSA9IFtdO1xuXG4gICAgY29uc3RydWN0b3IoKSB7XG4gICAgICAgIHN1cGVyKCk7XG4gICAgfVxufVxuXG5NYW5hZ2VkUHJvcGVydGllcy5yZWdpc3RlcihDb21wbGV4SW5maW5pdHkpO1xuXG5jbGFzcyBJbmZpbml0eSBleHRlbmRzIF9OdW1iZXJfIHtcbiAgICAvKlxuICAgIFBvc2l0aXZlIGluZmluaXRlIHF1YW50aXR5LlxuICAgIEV4cGxhbmF0aW9uXG4gICAgPT09PT09PT09PT1cbiAgICBJbiByZWFsIGFuYWx5c2lzIHRoZSBzeW1ib2wgYFxcaW5mdHlgIGRlbm90ZXMgYW4gdW5ib3VuZGVkXG4gICAgbGltaXQ6IGB4XFx0b1xcaW5mdHlgIG1lYW5zIHRoYXQgYHhgIGdyb3dzIHdpdGhvdXQgYm91bmQuXG4gICAgSW5maW5pdHkgaXMgb2Z0ZW4gdXNlZCBub3Qgb25seSB0byBkZWZpbmUgYSBsaW1pdCBidXQgYXMgYSB2YWx1ZVxuICAgIGluIHRoZSBhZmZpbmVseSBleHRlbmRlZCByZWFsIG51bWJlciBzeXN0ZW0uICBQb2ludHMgbGFiZWxlZCBgK1xcaW5mdHlgXG4gICAgYW5kIGAtXFxpbmZ0eWAgY2FuIGJlIGFkZGVkIHRvIHRoZSB0b3BvbG9naWNhbCBzcGFjZSBvZiB0aGUgcmVhbCBudW1iZXJzLFxuICAgIHByb2R1Y2luZyB0aGUgdHdvLXBvaW50IGNvbXBhY3RpZmljYXRpb24gb2YgdGhlIHJlYWwgbnVtYmVycy4gIEFkZGluZ1xuICAgIGFsZ2VicmFpYyBwcm9wZXJ0aWVzIHRvIHRoaXMgZ2l2ZXMgdXMgdGhlIGV4dGVuZGVkIHJlYWwgbnVtYmVycy5cbiAgICBJbmZpbml0eSBpcyBhIHNpbmdsZXRvbiwgYW5kIGNhbiBiZSBhY2Nlc3NlZCBieSBgYFMuSW5maW5pdHlgYCxcbiAgICBvciBjYW4gYmUgaW1wb3J0ZWQgYXMgYGBvb2BgLlxuICAgIEV4YW1wbGVzXG4gICAgPT09PT09PT1cbiAgICA+Pj4gZnJvbSBzeW1weSBpbXBvcnQgb28sIGV4cCwgbGltaXQsIFN5bWJvbFxuICAgID4+PiAxICsgb29cbiAgICBvb1xuICAgID4+PiA0Mi9vb1xuICAgIDBcbiAgICA+Pj4geCA9IFN5bWJvbCgneCcpXG4gICAgPj4+IGxpbWl0KGV4cCh4KSwgeCwgb28pXG4gICAgb29cbiAgICBTZWUgQWxzb1xuICAgID09PT09PT09XG4gICAgTmVnYXRpdmVJbmZpbml0eSwgTmFOXG4gICAgUmVmZXJlbmNlc1xuICAgID09PT09PT09PT1cbiAgICAuLiBbMV0gaHR0cHM6Ly9lbi53aWtpcGVkaWEub3JnL3dpa2kvSW5maW5pdHlcbiAgICAqL1xuICAgIHN0YXRpYyBpc19jb21tdXRhdGl2ZSA9IHRydWU7XG4gICAgc3RhdGljIGlzX251bWJlciA9IHRydWU7XG4gICAgc3RhdGljIGlzX2NvbXBsZXggPSBmYWxzZTtcbiAgICBzdGF0aWMgaXNfZXh0ZW5kZWRfcmVhbCA9IHRydWU7XG4gICAgc3RhdGljIGlzX2luZmluaXRlID0gdHJ1ZTtcbiAgICBzdGF0aWMgaXNfY29tcGFyYWJsZSA9IHRydWU7XG4gICAgc3RhdGljIGlzX2V4dGVuZGVkX3Bvc2l0aXZlID0gdHJ1ZTtcbiAgICBzdGF0aWMgaXNfcHJpbWUgPSBmYWxzZTtcbiAgICBfX3Nsb3RzX186IGFueSA9IFtdO1xuXG4gICAgY29uc3RydWN0b3IoKSB7XG4gICAgICAgIHN1cGVyKCk7XG4gICAgfVxuXG4gICAgLy8gTk9URTogbW9yZSBhcml0aG1ldGljIG1ldGhvZHMgc2hvdWxkIGJlIGltcGxlbWVudGVkIGJ1dCBJIGhhdmUgb25seVxuICAgIC8vIGRvbmUgZW5vdWdoIHN1Y2ggdGhhdCBhZGQgYW5kIG11bCBjYW4gaGFuZGxlIGluZmluaXR5IGFzIGFuIGFyZ3VtZW50XG4gICAgX19hZGRfXyhvdGhlcjogYW55KSB7XG4gICAgICAgIGlmIChvdGhlciBpbnN0YW5jZW9mIF9OdW1iZXJfICYmIGdsb2JhbF9wYXJhbWV0ZXJzLmV2YWx1YXRlKSB7XG4gICAgICAgICAgICBpZiAob3RoZXIgPT09IFMuSW5maW5pdHkgfHwgb3RoZXIgPT09IFMuTmFOKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIFMuTmFOO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHN1cGVyLl9fYWRkX18ob3RoZXIpO1xuICAgIH1cblxuICAgIF9fbXVsX18ob3RoZXI6IGFueSkge1xuICAgICAgICBpZiAob3RoZXIgaW5zdGFuY2VvZiBfTnVtYmVyXyAmJiBnbG9iYWxfcGFyYW1ldGVycy5ldmFsdWF0ZSkge1xuICAgICAgICAgICAgaWYgKG90aGVyID09PSBTLlplcm8gfHwgb3RoZXIgPT09IFMuTmFOKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIFMuTmFOO1xuICAgICAgICAgICAgfSBlbHNlIGlmIChvdGhlci5pc19leHRlbmRlZF9wb3NpdGl2ZSkge1xuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIFMuTmVnYXRpdmVJbmZpbml0eTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gc3VwZXIuX19tdWxfXyhvdGhlcik7XG4gICAgfVxufVxuXG5jbGFzcyBOZWdhdGl2ZUluZmluaXR5IGV4dGVuZHMgX051bWJlcl8ge1xuICAgIC8qXG4gICAgXCJOZWdhdGl2ZSBpbmZpbml0ZSBxdWFudGl0eS5cbiAgICBOZWdhdGl2ZUluZmluaXR5IGlzIGEgc2luZ2xldG9uLCBhbmQgY2FuIGJlIGFjY2Vzc2VkXG4gICAgYnkgYGBTLk5lZ2F0aXZlSW5maW5pdHlgYC5cbiAgICBTZWUgQWxzb1xuICAgID09PT09PT09XG4gICAgSW5maW5pdHlcbiAgICAqL1xuICAgIHN0YXRpYyBpc19leHRlbmRlZF9yZWFsID0gdHJ1ZTtcbiAgICBzdGF0aWMgaXNfY29tcGxleCA9IGZhbHNlO1xuICAgIHN0YXRpYyBpc19jb21tdXRhdGl2ZSA9IHRydWU7XG4gICAgc3RhdGljIGlzX2luZmluaXRlID0gdHJ1ZTtcbiAgICBzdGF0aWMgaXNfY29tcGFyYWJsZSA9IHRydWU7XG4gICAgc3RhdGljIGlzX2V4dGVuZGVkX25lZ2F0aXZlID0gdHJ1ZTtcbiAgICBzdGF0aWMgaXNfbnVtYmVyID0gdHJ1ZTtcbiAgICBzdGF0aWMgaXNfcHJpbWUgPSBmYWxzZTtcbiAgICBfX3Nsb3RzX186IGFueSA9IFtdO1xuXG4gICAgY29uc3RydWN0b3IoKSB7XG4gICAgICAgIHN1cGVyKCk7XG4gICAgfVxuXG4gICAgLy8gTk9URTogbW9yZSBhcml0aG1ldGljIG1ldGhvZHMgc2hvdWxkIGJlIGltcGxlbWVudGVkIGJ1dCBJIGhhdmUgb25seVxuICAgIC8vIGRvbmUgZW5vdWdoIHN1Y2ggdGhhdCBhZGQgYW5kIG11bCBjYW4gaGFuZGxlIG5lZ2F0aXZlaW5maW5pdHkgYXMgYW4gYXJndW1lbnRcbiAgICBfX2FkZF9fKG90aGVyOiBhbnkpIHtcbiAgICAgICAgaWYgKG90aGVyIGluc3RhbmNlb2YgX051bWJlcl8gJiYgZ2xvYmFsX3BhcmFtZXRlcnMuZXZhbHVhdGUpIHtcbiAgICAgICAgICAgIGlmIChvdGhlciA9PT0gUy5OZWdhdGl2ZUluZmluaXR5IHx8IG90aGVyID09PSBTLk5hTikge1xuICAgICAgICAgICAgICAgIHJldHVybiBTLk5hTjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBzdXBlci5fX2FkZF9fKG90aGVyKTtcbiAgICB9XG5cbiAgICBfX211bF9fKG90aGVyOiBhbnkpIHtcbiAgICAgICAgaWYgKG90aGVyIGluc3RhbmNlb2YgX051bWJlcl8gJiYgZ2xvYmFsX3BhcmFtZXRlcnMuZXZhbHVhdGUpIHtcbiAgICAgICAgICAgIGlmIChvdGhlciA9PT0gUy5aZXJvIHx8IG90aGVyID09PSBTLk5hTikge1xuICAgICAgICAgICAgICAgIHJldHVybiBTLk5hTjtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAob3RoZXIuaXNfZXh0ZW5kZWRfcG9zaXRpdmUpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiBTLkluZmluaXR5O1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBzdXBlci5fX211bF9fKG90aGVyKTtcbiAgICB9XG59XG5cbi8vIFJlZ2lzdGVyaW5nIHNpbmdsZXRvbnMgKHNlZSBzaW5nbGV0b24gY2xhc3MpXG5TaW5nbGV0b24ucmVnaXN0ZXIoXCJaZXJvXCIsIFplcm8pO1xuUy5aZXJvID0gU2luZ2xldG9uLnJlZ2lzdHJ5W1wiWmVyb1wiXTtcblxuU2luZ2xldG9uLnJlZ2lzdGVyKFwiT25lXCIsIE9uZSk7XG5TLk9uZSA9IFNpbmdsZXRvbi5yZWdpc3RyeVtcIk9uZVwiXTtcblxuU2luZ2xldG9uLnJlZ2lzdGVyKFwiTmVnYXRpdmVPbmVcIiwgTmVnYXRpdmVPbmUpO1xuUy5OZWdhdGl2ZU9uZSA9IFNpbmdsZXRvbi5yZWdpc3RyeVtcIk5lZ2F0aXZlT25lXCJdO1xuXG5TaW5nbGV0b24ucmVnaXN0ZXIoXCJOYU5cIiwgTmFOKTtcblMuTmFOID0gU2luZ2xldG9uLnJlZ2lzdHJ5W1wiTmFOXCJdO1xuXG5TaW5nbGV0b24ucmVnaXN0ZXIoXCJDb21wbGV4SW5maW5pdHlcIiwgQ29tcGxleEluZmluaXR5KTtcblMuQ29tcGxleEluZmluaXR5ID0gU2luZ2xldG9uLnJlZ2lzdHJ5W1wiQ29tcGxleEluZmluaXR5XCJdO1xuXG5TaW5nbGV0b24ucmVnaXN0ZXIoXCJJbmZpbml0eVwiLCBJbmZpbml0eSk7XG5TLkluZmluaXR5ID0gU2luZ2xldG9uLnJlZ2lzdHJ5W1wiSW5maW5pdHlcIl07XG5cblNpbmdsZXRvbi5yZWdpc3RlcihcIk5lZ2F0aXZlSW5maW5pdHlcIiwgTmVnYXRpdmVJbmZpbml0eSk7XG5TLk5lZ2F0aXZlSW5maW5pdHkgPSBTaW5nbGV0b24ucmVnaXN0cnlbXCJOZWdhdGl2ZUluZmluaXR5XCJdO1xuXG5leHBvcnQge1JhdGlvbmFsLCBfTnVtYmVyXywgRmxvYXQsIEludGVnZXIsIFplcm8sIE9uZX07XG4iLCAiaW1wb3J0IHtmYWN0b3JpbnQsIGZhY3RvcnJhdH0gZnJvbSBcIi4vbnRoZW9yeS9mYWN0b3JfLmpzXCI7XG5pbXBvcnQge0FkZH0gZnJvbSBcIi4vY29yZS9hZGQuanNcIjtcbmltcG9ydCB7TXVsfSBmcm9tIFwiLi9jb3JlL211bC5qc1wiO1xuaW1wb3J0IHtfTnVtYmVyXywgSW50ZWdlcn0gZnJvbSBcIi4vY29yZS9udW1iZXJzLmpzXCI7XG5pbXBvcnQge1V0aWx9IGZyb20gXCIuL2NvcmUvdXRpbGl0eS5qc1wiO1xuaW1wb3J0IHtQb3d9IGZyb20gXCIuL2NvcmUvcG93ZXIuanNcIjtcbmltcG9ydCB7U30gZnJvbSBcIi4vY29yZS9zaW5nbGV0b24uanNcIjtcbmltcG9ydCB7U3ltYm9sfSBmcm9tIFwiLi9jb3JlL3N5bWJvbC5qc1wiO1xuXG5cbi8vIERlZmluZSBpbnRlZ2VycywgcmF0aW9uYWxzLCBmbG9hdHMsIGFuZCBzeW1ib2xzXG5jb25zdCBuID0gX051bWJlcl8ubmV3KDQpO1xuY29uc29sZS5sb2cobi5pc19SYXRpb25hbCgpKVxuY29uc29sZS5sb2cobi5pc196ZXJvKCkpXG5jb25zb2xlLmxvZyhuLmlzX0FkZCgpKVxuY29uc29sZS5sb2cobi5pc19jb21wbGV4KCkpXG5jb25zb2xlLmxvZyhuLmlzX0Zsb2F0KCkpXG5cbmNvbnN0IG4zID0gX051bWJlcl8ubmV3KC0xLjUpO1xuXG5jb25zb2xlLmxvZyhuMy5pc19GbG9hdCgpKVxuY29uc29sZS5sb2cobjMuaXNfUmF0aW9uYWwoKSlcblxuXG4vKlxuXG5cbmNvbnN0IG4yID0gX051bWJlcl8ubmV3KDQsIDkpO1xuY29uc3QgbjMgPSBfTnVtYmVyXy5uZXcoLTEuNSk7XG5jb25zdCBuNCA9IF9OdW1iZXJfLm5ldygxLCAzKTtcbmNvbnN0IHggPSBuZXcgU3ltYm9sKFwieFwiKTtcblxuLy8gQWRkaXRpb25cblxuLy8gQmFzaWMgZXZhbHVhdGVkIGFkZFxuY29uc29sZS5sb2cobmV3IEFkZCh0cnVlLCB0cnVlLCBuLCBuMiwgeCkpO1xuLy8gQWRkIHdpdGhvdXQgZXZhbFxuY29uc29sZS5sb2cobmV3IEFkZChmYWxzZSwgdHJ1ZSwgbiwgbjIsIHgpKTtcbi8vIENvbWJpbmUgY29lZmZzIGFuZCBjb252ZXJ0IHRvIG11bFxuY29uc29sZS5sb2cobmV3IEFkZCh0cnVlLCB0cnVlLCB4LCB4LCB4KSk7XG4vLyBBZGQgd2l0aCBuZXN0ZWQgYWRkXG5jb25zb2xlLmxvZyhuZXcgQWRkKHRydWUsIHRydWUsIHgsIHgsIG5ldyBBZGQodHJ1ZSwgdHJ1ZSwgbiwgbjIsIHgpKSk7XG4vLyBBZGQgd2l0aCBuZXN0ZWQgbXVsXG5jb25zb2xlLmxvZyhuZXcgQWRkKHRydWUsIHRydWUsIHgsIG5ldyBNdWwodHJ1ZSwgdHJ1ZSwgbiwgeCkpKTtcblxuLy8gTXVsdGlwbGljYXRpb25cblxuLy8gQmFzaWMgZXZhbHVhdGVkIG11bFxuY29uc29sZS5sb2cobmV3IE11bCh0cnVlLCB0cnVlLCBuLCBuMiwgeCkpO1xuLy8gTXVsIHdpdGhvdXQgZXZhbFxuY29uc29sZS5sb2cobmV3IE11bChmYWxzZSwgdHJ1ZSwgbiwgbjIsIHgpKTtcbi8vIENvbWJpbmUgY29lZmZzIGFuZCBjb252ZXJ0IHRvIHBvd1xuY29uc29sZS5sb2cobmV3IE11bCh0cnVlLCB0cnVlLCB4LCB4LCB4KSk7XG4vLyBOZXN0ZWQgbXVsc1xuY29uc29sZS5sb2cobmV3IE11bCh0cnVlLCB0cnVlLCB4LCB4LCBuZXcgTXVsKHRydWUsIHRydWUsIG4sIG4yLCB4KSkpO1xuLy8gTmVzdGVkIG11bCB3aXRoIHBvd1xuY29uc29sZS5sb2cobmV3IE11bCh0cnVlLCB0cnVlLCB4LCBuZXcgUG93KG4sIHgpKSk7XG4vLyBNdWwgcG93IGV4cHJlc3Npb25zIChjb21iaW5lIGV4cG9uZW50cylcbmNvbnNvbGUubG9nKG5ldyBNdWwodHJ1ZSwgdHJ1ZSwgbmV3IFBvdyhuLCB4KSwgbmV3IFBvdyhuLCB4KSkpO1xuXG4vLyBFeHBvbmVudGlhbHNcblxuLy8gQmFzaWMgcG93XG5jb25zb2xlLmxvZyhuZXcgUG93KG4sIG4pKTtcbi8vIFVuZXZhbHVhdGVkIHBvdyB3aXRoIHN5bWJvbFxuY29uc29sZS5sb2cobmV3IFBvdyhuLCB4KSk7XG4vLyBTaW1wbGlmeSBpbnQgcmFpc2VkIHRvIHJhdGlvbmFsXG5jb25zb2xlLmxvZyhuZXcgUG93KG4sIG4yKSk7XG4vLyBTaW1wbGlmeSBuZWdhdGl2ZSBmbG9hdCByYWlzZWQgdG8gcmF0aW9uYWxcbmNvbnNvbGUubG9nKG5ldyBQb3cobjMsIG40KSk7XG5cbi8vIFN1YnN0aXR1dGlvblxuXG5jb25zb2xlLmxvZyhuZXcgUG93KG4sIHgpLnN1YnMoeCwgbjQpKTtcbmNvbnNvbGUubG9nKG5ldyBNdWwoZmFsc2UsIHRydWUsIG4sIG4yLCB4KS5zdWJzKHgsIG4yKSk7XG5jb25zb2xlLmxvZyhuZXcgQWRkKGZhbHNlLCB0cnVlLCBuLCBuMiwgeCkuc3Vicyh4LCBuKSk7XG5cbi8vIEZhY3RvcmluZ1xuXG4vLyBGYWN0b3IgYSBiaWcgaW50ZWdlclxuY29uc3QgYmlnaW50ID0gX051bWJlcl8ubmV3KDI4NSk7XG5jb25zb2xlLmxvZyhmYWN0b3JpbnQoYmlnaW50KSk7XG4vLyBGYWN0b3IgYSBjb21wbGljYXRlZCByYXRpb25hbFxuY29uc3QgYmlncmF0ID0gX051bWJlcl8ubmV3KDI3MSwgOTMyKTtcbmNvbnNvbGUubG9nKGZhY3RvcnJhdChiaWdyYXQpKTtcblxuLy8gVGVzdGluZyB3ZWlyZCBpbnB1dHNcblxuLy8gTk9URTogUG93KG4sIFMuTmVnYXRpdmVJbmZpbml0eSkgaXMgbm90IGN1cnJlbnRseSBzdXBwb3J0ZWQgLSBfZXZhbF9wb3dlciBuZWVkc1xuLy8gdG8gYmUgYWRkZWQgYW5kIGRlYnVnZ2VkIGZvciBTLkluZmluaXR5LCBTLk5lZ2F0aXZlSW5maW5pdHksIGFuZCBTLk5lZ2F0aXZlT25lXG5cbmNvbnNvbGUubG9nKG5ldyBNdWwodHJ1ZSwgdHJ1ZSwgUy5Db21wbGV4SW5maW5pdHksIFMuTmVnYXRpdmVJbmZpbml0eSwgeCkpO1xuY29uc29sZS5sb2cobmV3IE11bCh0cnVlLCB0cnVlLCBTLkluZmluaXR5LCBuMiwgeCkpO1xuY29uc29sZS5sb2cobmV3IFBvdyhuLCBTLk5hTikpO1xuKi8iXSwKICAibWFwcGluZ3MiOiAiOztBQU1BLE1BQU0sT0FBTixNQUFXO0FBQUEsSUFHUCxPQUFPLFFBQVEsR0FBZ0I7QUFDM0IsVUFBSSxPQUFPLE1BQU0sYUFBYTtBQUMxQixlQUFPO0FBQUEsTUFDWDtBQUNBLFVBQUksRUFBRSxTQUFTO0FBQ1gsZUFBTyxFQUFFLFFBQVE7QUFBQSxNQUNyQjtBQUNBLFVBQUksTUFBTSxRQUFRLENBQUMsR0FBRztBQUNsQixlQUFPLEVBQUUsSUFBSSxDQUFDLE1BQU0sS0FBSyxRQUFRLENBQUMsQ0FBQyxFQUFFLEtBQUssR0FBRztBQUFBLE1BQ2pEO0FBQ0EsVUFBSSxNQUFNLE1BQU07QUFDWixlQUFPO0FBQUEsTUFDWDtBQUNBLGFBQU8sRUFBRSxTQUFTO0FBQUEsSUFDdEI7QUFBQSxJQUdBLE9BQU8sU0FBUyxNQUFhLE1BQXNCO0FBQy9DLGlCQUFXLEtBQUssTUFBTTtBQUNsQixZQUFJLENBQUUsS0FBSyxTQUFTLENBQUMsR0FBSTtBQUNyQixpQkFBTztBQUFBLFFBQ1g7QUFBQSxNQUNKO0FBQ0EsYUFBTztBQUFBLElBQ1g7QUFBQSxJQUlBLE9BQU8sSUFBSSxLQUFhO0FBQ3BCLGNBQVEsUUFBUSxHQUFHLFNBQVMsQ0FBQztBQUFBLElBQ2pDO0FBQUEsSUFFQSxRQUFRLFFBQVEsU0FBaUIsTUFBTSxNQUFhO0FBQ2hELFlBQU0sUUFBZSxDQUFDO0FBQ3RCLGlCQUFXLEtBQUssTUFBTTtBQUNsQixjQUFNLEtBQUssQ0FBQyxDQUFDLENBQUM7QUFBQSxNQUNsQjtBQUNBLFlBQU0sUUFBZSxDQUFDO0FBQ3RCLGVBQVMsSUFBSSxHQUFHLElBQUksUUFBUSxLQUFLO0FBQzdCLGNBQU0sUUFBUSxDQUFD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VUFBUSxJQUFJLEVBQUUsV0FBVyxDQUFDO0FBQzFCLFVBQVEsSUFBSSxFQUFFLFNBQVMsQ0FBQztBQUV4QixNQUFNLEtBQUssU0FBUyxJQUFJLElBQUk7QUFFNUIsVUFBUSxJQUFJLEdBQUcsU0FBUyxDQUFDO0FBQ3pCLFVBQVEsSUFBSSxHQUFHLFlBQVksQ0FBQzsiLAogICJuYW1lcyI6IFsibiIsICJpbXBsIiwgIml0ZW0iLCAiUCIsICJzZWxmIiwgImNscyIsICJzdXBlcmNsYXNzIiwgInNlbGYiLCAib2xkIiwgIl9uZXciLCAicnYiLCAibiIsICJtb2QiLCAiRXJyb3IiLCAiY3NldCIsICJuIiwgIl9BdG9taWNFeHByIiwgIm9iaiIsICJuIiwgInQiLCAiRXJyb3IiLCAiYmFzZSIsICJleHAiLCAiZCIsICJmYWN0b3JzIiwgInIiLCAiY19wb3dlcnMiLCAiaSIsICJuIiwgImNfcGFydCIsICJjb2VmZl9zaWduIiwgInNpZ24iLCAibWluIiwgIm1heCIsICJuIiwgImJhc2UiLCAic2lnbiIsICJwb3ciLCAic3VtIiwgIkRlY2ltYWwiLCAiaSIsICJuIiwgIl9BdG9taWNFeHByIiwgInJlc3VsdCIsICJOYU4iLCAiX0F0b21pY0V4cHIiXQp9Cg==
