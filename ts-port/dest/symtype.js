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
    for (const x2 of alpha_implications.keys()) {
      const newset = new HashSet();
      newset.add(alpha_implications.get(x2));
      const imp = new Implication(newset, []);
      x_impl.add(x2, imp);
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
          const x2 = item[0];
          const impl2 = item[1];
          let ximpls = impl2.p;
          const x_all = ximpls.clone().add(x2);
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
        const x2 = item[0];
        const value = item[1];
        const ximpls = value.p;
        const bb = value.q;
        const x_all = ximpls.clone().add(x2);
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
      const assumptions = new HashDict(properties);
      _Symbol._sanitize(assumptions);
      this.name = name;
      const tmp_asm_copy = assumptions.copy();
      const is_commutative = fuzzy_bool_v2(assumptions.get("commutative", true));
      assumptions.add("commutative", is_commutative);
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
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsiLi4vY29yZS91dGlsaXR5LnRzIiwgIi4uL2NvcmUvbG9naWMudHMiLCAiLi4vY29yZS9mYWN0cy50cyIsICIuLi9jb3JlL2NvcmUudHMiLCAiLi4vY29yZS9hc3N1bXB0aW9ucy50cyIsICIuLi9jb3JlL2tpbmQudHMiLCAiLi4vY29yZS90cmF2ZXJzYWwudHMiLCAiLi4vY29yZS9iYXNpYy50cyIsICIuLi9jb3JlL3NpbmdsZXRvbi50cyIsICIuLi9jb3JlL2dsb2JhbC50cyIsICIuLi91dGlsaXRpZXMvbWlzYy50cyIsICIuLi9jb3JlL2V4cHIudHMiLCAiLi4vY29yZS9wYXJhbWV0ZXJzLnRzIiwgIi4uL2NvcmUvb3BlcmF0aW9ucy50cyIsICIuLi9jb3JlL3Bvd2VyLnRzIiwgIi4uL2NvcmUvbXVsLnRzIiwgIi4uL2NvcmUvYWRkLnRzIiwgIi4uLy4uL25vZGVfbW9kdWxlcy9kZWNpbWFsLmpzL2RlY2ltYWwubWpzIiwgIi4uL2NvcmUvbnVtYmVycy50cyIsICIuLi9udGhlb3J5L2ZhY3Rvcl8udHMiLCAiLi4vY29yZS9ib29sYWxnLnRzIiwgIi4uL2NvcmUvc3ltYm9sLnRzIiwgIi4uL3N5bXR5cGUudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbIi8qXG5BIGZpbGUgd2l0aCB1dGlsaXR5IGNsYXNzZXMgYW5kIGZ1bmN0aW9ucyB0byBoZWxwIHdpdGggcG9ydGluZ1xuRGV2ZWxvcGQgYnkgV0IgYW5kIEdNXG4qL1xuXG4vLyBnZW5lcmFsIHV0aWwgZnVuY3Rpb25zXG5jbGFzcyBVdGlsIHtcbiAgICAvLyBoYXNoa2V5IGZ1bmN0aW9uXG4gICAgLy8gc2hvdWxkIGJlIGFibGUgdG8gaGFuZGxlIG11bHRpcGxlIHR5cGVzIG9mIGlucHV0c1xuICAgIHN0YXRpYyBoYXNoS2V5KHg6IGFueSk6IHN0cmluZyB7XG4gICAgICAgIGlmICh0eXBlb2YgeCA9PT0gXCJ1bmRlZmluZWRcIikge1xuICAgICAgICAgICAgcmV0dXJuIFwidW5kZWZpbmVkXCI7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHguaGFzaEtleSkge1xuICAgICAgICAgICAgcmV0dXJuIHguaGFzaEtleSgpO1xuICAgICAgICB9XG4gICAgICAgIGlmIChBcnJheS5pc0FycmF5KHgpKSB7XG4gICAgICAgICAgICByZXR1cm4geC5tYXAoKGUpID0+IFV0aWwuaGFzaEtleShlKSkuam9pbihcIixcIik7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHggPT09IG51bGwpIHtcbiAgICAgICAgICAgIHJldHVybiBcIm51bGxcIjtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4geC50b1N0cmluZygpO1xuICAgIH1cblxuICAgIC8vIGNoZWNrIGlmIGFycjEgaXMgYSBzdWJzZXQgb2YgYXJyMlxuICAgIHN0YXRpYyBpc1N1YnNldChhcnIxOiBhbnlbXSwgYXJyMjogYW55W10pOiBib29sZWFuIHtcbiAgICAgICAgZm9yIChjb25zdCBlIG9mIGFycjEpIHtcbiAgICAgICAgICAgIGlmICghKGFycjIuaW5jbHVkZXMoZSkpKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cblxuICAgIC8vIGNvbnZlcnQgYW4gaW50ZWdlciB0byBiaW5hcnlcbiAgICAvLyBmdW5jdGlvbmFsIGZvciBuZWdhdGl2ZSBudW1iZXJzXG4gICAgc3RhdGljIGJpbihudW06IG51bWJlcikge1xuICAgICAgICByZXR1cm4gKG51bSA+Pj4gMCkudG9TdHJpbmcoMik7XG4gICAgfVxuXG4gICAgc3RhdGljKiBwcm9kdWN0KHJlcGVhdDogbnVtYmVyID0gMSwgLi4uYXJnczogYW55W10pIHtcbiAgICAgICAgY29uc3QgdG9BZGQ6IGFueVtdID0gW107XG4gICAgICAgIGZvciAoY29uc3QgYSBvZiBhcmdzKSB7XG4gICAgICAgICAgICB0b0FkZC5wdXNoKFthXSk7XG4gICAgICAgIH1cbiAgICAgICAgY29uc3QgcG9vbHM6IGFueVtdID0gW107XG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgcmVwZWF0OyBpKyspIHtcbiAgICAgICAgICAgIHRvQWRkLmZvckVhY2goKGU6IGFueSkgPT4gcG9vbHMucHVzaChlWzBdKSk7XG4gICAgICAgIH1cbiAgICAgICAgbGV0IHJlczogYW55W11bXSA9IFtbXV07XG4gICAgICAgIGZvciAoY29uc3QgcG9vbCBvZiBwb29scykge1xuICAgICAgICAgICAgY29uc3QgcmVzX3RlbXA6IGFueVtdID0gW107XG4gICAgICAgICAgICBmb3IgKGNvbnN0IHggb2YgcmVzKSB7XG4gICAgICAgICAgICAgICAgZm9yIChjb25zdCB5IG9mIHBvb2wpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHR5cGVvZiB4WzBdID09PSBcInVuZGVmaW5lZFwiKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXNfdGVtcC5wdXNoKFt5XSk7XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXNfdGVtcC5wdXNoKHguY29uY2F0KHkpKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJlcyA9IHJlc190ZW1wO1xuICAgICAgICB9XG4gICAgICAgIGZvciAoY29uc3QgcHJvZCBvZiByZXMpIHtcbiAgICAgICAgICAgIHlpZWxkIHByb2Q7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBzdGF0aWMqIHBlcm11dGF0aW9ucyhpdGVyYWJsZTogYW55LCByOiBhbnkgPSB1bmRlZmluZWQpIHtcbiAgICAgICAgY29uc3QgbiA9IGl0ZXJhYmxlLmxlbmd0aDtcbiAgICAgICAgaWYgKHR5cGVvZiByID09PSBcInVuZGVmaW5lZFwiKSB7XG4gICAgICAgICAgICByID0gbjtcbiAgICAgICAgfVxuICAgICAgICBjb25zdCByYW5nZSA9IHRoaXMucmFuZ2Uobik7XG4gICAgICAgIGZvciAoY29uc3QgaW5kaWNlcyBvZiBVdGlsLnByb2R1Y3QociwgcmFuZ2UpKSB7XG4gICAgICAgICAgICBpZiAoaW5kaWNlcy5sZW5ndGggPT09IHIpIHtcbiAgICAgICAgICAgICAgICBjb25zdCB5OiBhbnlbXSA9IFtdO1xuICAgICAgICAgICAgICAgIGZvciAoY29uc3QgaSBvZiBpbmRpY2VzKSB7XG4gICAgICAgICAgICAgICAgICAgIHkucHVzaChpdGVyYWJsZVtpXSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHlpZWxkIHk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBzdGF0aWMqIGZyb21faXRlcmFibGUoaXRlcmFibGVzOiBhbnkpIHtcbiAgICAgICAgZm9yIChjb25zdCBpdCBvZiBpdGVyYWJsZXMpIHtcbiAgICAgICAgICAgIGZvciAoY29uc3QgZWxlbWVudCBvZiBpdCkge1xuICAgICAgICAgICAgICAgIHlpZWxkIGVsZW1lbnQ7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBzdGF0aWMgYXJyRXEoYXJyMTogYW55W10sIGFycjI6IGFueSkge1xuICAgICAgICBpZiAoYXJyMS5sZW5ndGggIT09IGFycjIubGVuZ3RoKSB7XG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH1cbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBhcnIxLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBpZiAoIShhcnIxW2ldID09PSBhcnIyW2ldKSkge1xuICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG5cbiAgICBzdGF0aWMqIGNvbWJpbmF0aW9ucyhpdGVyYWJsZTogYW55LCByOiBhbnkpIHtcbiAgICAgICAgY29uc3QgbiA9IGl0ZXJhYmxlLmxlbmd0aDtcbiAgICAgICAgY29uc3QgcmFuZ2UgPSB0aGlzLnJhbmdlKG4pO1xuICAgICAgICBmb3IgKGNvbnN0IGluZGljZXMgb2YgVXRpbC5wZXJtdXRhdGlvbnMocmFuZ2UsIHIpKSB7XG4gICAgICAgICAgICBpZiAoVXRpbC5hcnJFcShpbmRpY2VzLnNvcnQoZnVuY3Rpb24oYSwgYikge1xuICAgICAgICAgICAgICAgIHJldHVybiBhIC0gYjtcbiAgICAgICAgICAgIH0pLCBpbmRpY2VzKSkge1xuICAgICAgICAgICAgICAgIGNvbnN0IHJlczogYW55W10gPSBbXTtcbiAgICAgICAgICAgICAgICBmb3IgKGNvbnN0IGkgb2YgaW5kaWNlcykge1xuICAgICAgICAgICAgICAgICAgICByZXMucHVzaChpdGVyYWJsZVtpXSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHlpZWxkIHJlcztcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgIHN0YXRpYyogY29tYmluYXRpb25zX3dpdGhfcmVwbGFjZW1lbnQoaXRlcmFibGU6IGFueSwgcjogYW55KSB7XG4gICAgICAgIGNvbnN0IG4gPSBpdGVyYWJsZS5sZW5ndGg7XG4gICAgICAgIGNvbnN0IHJhbmdlID0gdGhpcy5yYW5nZShuKTtcbiAgICAgICAgZm9yIChjb25zdCBpbmRpY2VzIG9mIFV0aWwucHJvZHVjdChyLCByYW5nZSkpIHtcbiAgICAgICAgICAgIGlmIChVdGlsLmFyckVxKGluZGljZXMuc29ydChmdW5jdGlvbihhLCBiKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGEgLSBiO1xuICAgICAgICAgICAgfSksIGluZGljZXMpKSB7XG4gICAgICAgICAgICAgICAgY29uc3QgcmVzOiBhbnlbXSA9IFtdO1xuICAgICAgICAgICAgICAgIGZvciAoY29uc3QgaSBvZiBpbmRpY2VzKSB7XG4gICAgICAgICAgICAgICAgICAgIHJlcy5wdXNoKGl0ZXJhYmxlW2ldKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgeWllbGQgcmVzO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgc3RhdGljIHppcChhcnIxOiBhbnlbXSwgYXJyMjogYW55W10sIGZpbGx2YWx1ZTogc3RyaW5nID0gXCItXCIpIHtcbiAgICAgICAgY29uc3QgcmVzID0gYXJyMS5tYXAoZnVuY3Rpb24oZSwgaSkge1xuICAgICAgICAgICAgcmV0dXJuIFtlLCBhcnIyW2ldXTtcbiAgICAgICAgfSk7XG4gICAgICAgIHJlcy5mb3JFYWNoKCh6aXA6IGFueSkgPT4ge1xuICAgICAgICAgICAgaWYgKHppcC5pbmNsdWRlcyh1bmRlZmluZWQpKSB7XG4gICAgICAgICAgICAgICAgemlwLnNwbGljZSgxLCAxLCBmaWxsdmFsdWUpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgICAgcmV0dXJuIHJlcztcbiAgICB9XG5cbiAgICBzdGF0aWMgcmFuZ2UobjogbnVtYmVyKSB7XG4gICAgICAgIHJldHVybiBuZXcgQXJyYXkobikuZmlsbCgwKS5tYXAoKF8sIGlkeCkgPT4gaWR4KTtcbiAgICB9XG5cbiAgICBzdGF0aWMgZ2V0QXJySW5kZXgoYXJyMmQ6IGFueVtdW10sIGFycjogYW55W10pIHtcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBhcnIyZC5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgaWYgKFV0aWwuYXJyRXEoYXJyMmRbaV0sIGFycikpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gaTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdW5kZWZpbmVkO1xuICAgIH1cblxuICAgIC8vIHN0YXRpYyBnZXRTdXBlcnMob2JqOiBhbnkpIHtcbiAgICAvLyAgICAgY29uc3QgcmVzOiBhbnlbXSA9IFtdO1xuICAgIC8vICAgICBsZXQgcyA9IE9iamVjdC5nZXRQcm90b3R5cGVPZihPYmplY3QuZ2V0UHJvdG90eXBlT2Yob2JqKSk7XG4gICAgLy8gICAgIHdoaWxlIChzLmNvbnN0cnVjdG9yLm5hbWUgIT09IFwiT2JqZWN0XCIpIHtcbiAgICAvLyAgICAgICAgIHJlcy5wdXNoKHMubmFtZSk7XG4gICAgLy8gICAgICAgICBzID0gT2JqZWN0LmdldFByb3RvdHlwZU9mKHMpO1xuICAgIC8vICAgICB9XG4gICAgLy8gICAgIHJldHVybiByZXM7XG4gICAgLy8gfVxuXG4gICAgc3RhdGljIGdldFN1cGVycyhjbHM6IGFueSkge1xuICAgICAgICBjb25zdCByZXM6IGFueVtdID0gW107XG4gICAgICAgIGxldCBzID0gT2JqZWN0LmdldFByb3RvdHlwZU9mKGNscyk7XG4gICAgICAgIHdoaWxlIChzLmNvbnN0cnVjdG9yLm5hbWUgIT09IFwiT2JqZWN0XCIpIHtcbiAgICAgICAgICAgIHJlcy5wdXNoKHMubmFtZSk7XG4gICAgICAgICAgICBzID0gT2JqZWN0LmdldFByb3RvdHlwZU9mKHMpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiByZXM7XG4gICAgfVxuXG4gICAgc3RhdGljIHNodWZmbGVBcnJheShhcnI6IGFueVtdKSB7XG4gICAgICAgIGZvciAobGV0IGkgPSBhcnIubGVuZ3RoIC0gMTsgaSA+IDA7IGktLSkge1xuICAgICAgICAgICAgY29uc3QgaiA9IE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIChpICsgMSkpO1xuICAgICAgICAgICAgY29uc3QgdGVtcCA9IGFycltpXTtcbiAgICAgICAgICAgIGFycltpXSA9IGFycltqXTtcbiAgICAgICAgICAgIGFycltqXSA9IHRlbXA7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBzdGF0aWMgYXJyTXVsKGFycjogYW55W10sIG46IG51bWJlcikge1xuICAgICAgICBjb25zdCByZXMgPSBbXTtcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBuOyBpKyspIHtcbiAgICAgICAgICAgIHJlcy5wdXNoKGFycik7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHJlcztcbiAgICB9XG5cbiAgICBzdGF0aWMgYXNzaWduRWxlbWVudHMoYXJyOiBhbnlbXSwgbmV3dmFsczogYW55W10sIHN0YXJ0OiBudW1iZXIsIHN0ZXA6IG51bWJlcikge1xuICAgICAgICBsZXQgY291bnQgPSAwO1xuICAgICAgICBmb3IgKGxldCBpID0gc3RhcnQ7IGkgPCBhcnIubGVuZ3RoOyBpKz1zdGVwKSB7XG4gICAgICAgICAgICBhcnJbaV0gPSBuZXd2YWxzW2NvdW50XTtcbiAgICAgICAgICAgIGNvdW50Kys7XG4gICAgICAgIH1cbiAgICB9XG59XG5cbi8vIGN1c3RvbSB2ZXJzaW9uIG9mIHRoZSBTZXQgY2xhc3Ncbi8vIG5lZWRlZCBzaW5jZSBzeW1weSByZWxpZXMgb24gaXRlbSB0dXBsZXMgd2l0aCBlcXVhbCBjb250ZW50cyBiZWluZyBtYXBwZWRcbi8vIHRvIHRoZSBzYW1lIGVudHJ5XG5jbGFzcyBIYXNoU2V0IHtcbiAgICBkaWN0OiBSZWNvcmQ8c3RyaW5nLCBhbnk+O1xuICAgIHNpemU6IG51bWJlcjtcbiAgICBzb3J0ZWRBcnI6IGFueVtdO1xuXG4gICAgY29uc3RydWN0b3IoYXJyPzogYW55W10pIHtcbiAgICAgICAgdGhpcy5zaXplID0gMDtcbiAgICAgICAgdGhpcy5kaWN0ID0ge307XG4gICAgICAgIGlmIChhcnIpIHtcbiAgICAgICAgICAgIEFycmF5LmZyb20oYXJyKS5mb3JFYWNoKChlbGVtZW50KSA9PiB7XG4gICAgICAgICAgICAgICAgdGhpcy5hZGQoZWxlbWVudCk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGNsb25lKCk6IEhhc2hTZXQge1xuICAgICAgICBjb25zdCBuZXdzZXQ6IEhhc2hTZXQgPSBuZXcgSGFzaFNldCgpO1xuICAgICAgICBmb3IgKGNvbnN0IGl0ZW0gb2YgT2JqZWN0LnZhbHVlcyh0aGlzLmRpY3QpKSB7XG4gICAgICAgICAgICBuZXdzZXQuYWRkKGl0ZW0pO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBuZXdzZXQ7XG4gICAgfVxuXG4gICAgZW5jb2RlKGl0ZW06IGFueSk6IHN0cmluZyB7XG4gICAgICAgIHJldHVybiBVdGlsLmhhc2hLZXkoaXRlbSk7XG4gICAgfVxuXG4gICAgYWRkKGl0ZW06IGFueSkge1xuICAgICAgICBjb25zdCBrZXkgPSB0aGlzLmVuY29kZShpdGVtKTtcbiAgICAgICAgaWYgKCEoa2V5IGluIHRoaXMuZGljdCkpIHtcbiAgICAgICAgICAgIHRoaXMuc2l6ZSsrO1xuICAgICAgICB9O1xuICAgICAgICB0aGlzLmRpY3Rba2V5XSA9IGl0ZW07XG4gICAgfVxuXG4gICAgYWRkQXJyKGFycjogYW55W10pIHtcbiAgICAgICAgZm9yIChjb25zdCBlIG9mIGFycikge1xuICAgICAgICAgICAgdGhpcy5hZGQoZSk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBoYXMoaXRlbTogYW55KSB7XG4gICAgICAgIHJldHVybiB0aGlzLmVuY29kZShpdGVtKSBpbiB0aGlzLmRpY3Q7XG4gICAgfVxuXG4gICAgdG9BcnJheSgpIHtcbiAgICAgICAgcmV0dXJuIE9iamVjdC52YWx1ZXModGhpcy5kaWN0KTtcbiAgICB9XG5cbiAgICAvLyBnZXQgdGhlIGhhc2hrZXkgZm9yIHRoaXMgc2V0IChlLmcuLCBpbiBhIGRpY3Rpb25hcnkpXG4gICAgaGFzaEtleSgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMudG9BcnJheSgpXG4gICAgICAgICAgICAubWFwKChlKSA9PiBVdGlsLmhhc2hLZXkoZSkpXG4gICAgICAgICAgICAuc29ydCgpXG4gICAgICAgICAgICAuam9pbihcIixcIik7XG4gICAgfVxuXG4gICAgaXNFbXB0eSgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuc2l6ZSA9PT0gMDtcbiAgICB9XG5cbiAgICByZW1vdmUoaXRlbTogYW55KSB7XG4gICAgICAgIHRoaXMuc2l6ZS0tO1xuICAgICAgICBkZWxldGUgdGhpcy5kaWN0W3RoaXMuZW5jb2RlKGl0ZW0pXTtcbiAgICB9XG5cbiAgICBnZXQoa2V5OiBhbnkpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuZGljdFtVdGlsLmhhc2hLZXkoa2V5KV07XG4gICAgfVxuXG4gICAgc2V0KGtleTogYW55LCB2YWw6IGFueSkge1xuICAgICAgICB0aGlzLmRpY3RbVXRpbC5oYXNoS2V5KGtleSldID0gdmFsO1xuICAgIH1cblxuICAgIHNvcnQoa2V5ZnVuYzogYW55ID0gKChhOiBhbnksIGI6IGFueSkgPT4gYSAtIGIpLCByZXZlcnNlOiBib29sZWFuID0gdHJ1ZSkge1xuICAgICAgICB0aGlzLnNvcnRlZEFyciA9IHRoaXMudG9BcnJheSgpO1xuICAgICAgICB0aGlzLnNvcnRlZEFyci5zb3J0KGtleWZ1bmMpO1xuICAgICAgICBpZiAocmV2ZXJzZSkge1xuICAgICAgICAgICAgdGhpcy5zb3J0ZWRBcnIucmV2ZXJzZSgpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcG9wKCkge1xuICAgICAgICB0aGlzLnNvcnQoKTsgLy8gISEhIHNsb3cgYnV0IEkgZG9uJ3Qgc2VlIGEgd29yayBhcm91bmRcbiAgICAgICAgaWYgKHRoaXMuc29ydGVkQXJyLmxlbmd0aCA+PSAxKSB7XG4gICAgICAgICAgICBjb25zdCB0ZW1wID0gdGhpcy5zb3J0ZWRBcnJbdGhpcy5zb3J0ZWRBcnIubGVuZ3RoIC0gMV07XG4gICAgICAgICAgICB0aGlzLnJlbW92ZSh0ZW1wKTtcbiAgICAgICAgICAgIHJldHVybiB0ZW1wO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGRpZmZlcmVuY2Uob3RoZXI6IEhhc2hTZXQpIHtcbiAgICAgICAgY29uc3QgcmVzID0gbmV3IEhhc2hTZXQoKTtcbiAgICAgICAgZm9yIChjb25zdCBpIG9mIHRoaXMudG9BcnJheSgpKSB7XG4gICAgICAgICAgICBpZiAoIShvdGhlci5oYXMoaSkpKSB7XG4gICAgICAgICAgICAgICAgcmVzLmFkZChpKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gcmVzO1xuICAgIH1cbn1cblxuLy8gYSBoYXNoZGljdCBjbGFzcyByZXBsYWNpbmcgdGhlIGRpY3QgY2xhc3MgaW4gcHl0aG9uXG5jbGFzcyBIYXNoRGljdCB7XG4gICAgc2l6ZTogbnVtYmVyO1xuICAgIGRpY3Q6IFJlY29yZDxhbnksIGFueT47XG5cbiAgICBjb25zdHJ1Y3RvcihkOiBSZWNvcmQ8YW55LCBhbnk+ID0ge30pIHtcbiAgICAgICAgdGhpcy5zaXplID0gMDtcbiAgICAgICAgdGhpcy5kaWN0ID0ge307XG4gICAgICAgIGZvciAoY29uc3QgaXRlbSBvZiBPYmplY3QuZW50cmllcyhkKSkge1xuICAgICAgICAgICAgdGhpcy5kaWN0W1V0aWwuaGFzaEtleShpdGVtWzBdKV0gPSBbaXRlbVswXSwgaXRlbVsxXV07XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBjbG9uZSgpIHtcbiAgICAgICAgcmV0dXJuIG5ldyBIYXNoRGljdCh0aGlzLmRpY3QpO1xuICAgIH1cblxuICAgIHJlbW92ZShpdGVtOiBhbnkpIHtcbiAgICAgICAgdGhpcy5zaXplLS07XG4gICAgICAgIGRlbGV0ZSB0aGlzLmRpY3RbVXRpbC5oYXNoS2V5KGl0ZW0pXTtcbiAgICB9XG5cbiAgICBzZXRkZWZhdWx0KGtleTogYW55LCB2YWx1ZTogYW55KSB7XG4gICAgICAgIGlmICh0aGlzLmhhcyhrZXkpKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5nZXQoa2V5KTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMuYWRkKGtleSwgdmFsdWUpO1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuZ2V0KGtleSk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBnZXQoa2V5OiBhbnksIGRlZjogYW55ID0gdW5kZWZpbmVkKTogYW55IHtcbiAgICAgICAgY29uc3QgaGFzaCA9IFV0aWwuaGFzaEtleShrZXkpO1xuICAgICAgICBpZiAoaGFzaCBpbiB0aGlzLmRpY3QpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmRpY3RbaGFzaF1bMV07XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGRlZjtcbiAgICB9XG5cbiAgICBoYXMoa2V5OiBhbnkpOiBib29sZWFuIHtcbiAgICAgICAgY29uc3QgaGFzaEtleSA9IFV0aWwuaGFzaEtleShrZXkpO1xuICAgICAgICByZXR1cm4gaGFzaEtleSBpbiB0aGlzLmRpY3Q7XG4gICAgfVxuXG4gICAgYWRkKGtleTogYW55LCB2YWx1ZTogYW55KSB7XG4gICAgICAgIGNvbnN0IGtleUhhc2ggPSBVdGlsLmhhc2hLZXkoa2V5KTtcbiAgICAgICAgaWYgKCEoa2V5SGFzaCBpbiBPYmplY3Qua2V5cyh0aGlzLmRpY3QpKSkge1xuICAgICAgICAgICAgdGhpcy5zaXplKys7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5kaWN0W2tleUhhc2hdID0gW2tleSwgdmFsdWVdO1xuICAgIH1cblxuICAgIGtleXMoKSB7XG4gICAgICAgIGNvbnN0IHZhbHMgPSBPYmplY3QudmFsdWVzKHRoaXMuZGljdCk7XG4gICAgICAgIHJldHVybiB2YWxzLm1hcCgoZSkgPT4gZVswXSk7XG4gICAgfVxuXG4gICAgdmFsdWVzKCkge1xuICAgICAgICBjb25zdCB2YWxzID0gT2JqZWN0LnZhbHVlcyh0aGlzLmRpY3QpO1xuICAgICAgICByZXR1cm4gdmFscy5tYXAoKGUpID0+IGVbMV0pO1xuICAgIH1cblxuICAgIGVudHJpZXMoKSB7XG4gICAgICAgIHJldHVybiBPYmplY3QudmFsdWVzKHRoaXMuZGljdCk7XG4gICAgfVxuXG4gICAgYWRkQXJyKGFycjogYW55W10pIHtcbiAgICAgICAgY29uc3Qga2V5SGFzaCA9IFV0aWwuaGFzaEtleShhcnJbMF0pO1xuICAgICAgICB0aGlzLmRpY3Rba2V5SGFzaF0gPSBhcnI7XG4gICAgfVxuXG4gICAgZGVsZXRlKGtleTogYW55KSB7XG4gICAgICAgIGNvbnN0IGtleWhhc2ggPSBVdGlsLmhhc2hLZXkoa2V5KTtcbiAgICAgICAgaWYgKGtleWhhc2ggaW4gdGhpcy5kaWN0KSB7XG4gICAgICAgICAgICB0aGlzLnNpemUtLTtcbiAgICAgICAgICAgIGRlbGV0ZSB0aGlzLmRpY3Rba2V5aGFzaF07XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBtZXJnZShvdGhlcjogSGFzaERpY3QpIHtcbiAgICAgICAgZm9yIChjb25zdCBpdGVtIG9mIG90aGVyLmVudHJpZXMoKSkge1xuICAgICAgICAgICAgdGhpcy5hZGQoaXRlbVswXSwgaXRlbVsxXSk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBjb3B5KCkge1xuICAgICAgICBjb25zdCByZXM6IEhhc2hEaWN0ID0gbmV3IEhhc2hEaWN0KCk7XG4gICAgICAgIGZvciAoY29uc3QgaXRlbSBvZiB0aGlzLmVudHJpZXMoKSkge1xuICAgICAgICAgICAgcmVzLmFkZChpdGVtWzBdLCBpdGVtWzFdKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gcmVzO1xuICAgIH1cblxuICAgIGlzU2FtZShvdGhlcjogSGFzaERpY3QpIHtcbiAgICAgICAgY29uc3QgYXJyMSA9IHRoaXMuZW50cmllcygpLnNvcnQoKTtcbiAgICAgICAgY29uc3QgYXJyMiA9IG90aGVyLmVudHJpZXMoKS5zb3J0KCk7XG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgYXJyMS5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgaWYgKCEoVXRpbC5hcnJFcShhcnIxW2ldLCBhcnIyW2ldKSkpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxufVxuXG5cbi8vIHN5bXB5IG9mdGVuIHVzZXMgZGVmYXVsdGRpY3Qoc2V0KSB3aGljaCBpcyBub3QgYXZhaWxhYmxlIGluIHRzXG4vLyB3ZSBjcmVhdGUgYSByZXBsYWNlbWVudCBkaWN0aW9uYXJ5IGNsYXNzIHdoaWNoIHJldHVybnMgYW4gZW1wdHkgc2V0XG4vLyBpZiB0aGUga2V5IHVzZWQgaXMgbm90IGluIHRoZSBkaWN0aW9uYXJ5XG5jbGFzcyBTZXREZWZhdWx0RGljdCBleHRlbmRzIEhhc2hEaWN0IHtcbiAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICAgICAgc3VwZXIoKTtcbiAgICB9XG5cbiAgICBnZXQoa2V5OiBhbnkpIHtcbiAgICAgICAgY29uc3Qga2V5SGFzaCA9IFV0aWwuaGFzaEtleShrZXkpO1xuICAgICAgICBpZiAoa2V5SGFzaCBpbiB0aGlzLmRpY3QpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmRpY3Rba2V5SGFzaF1bMV07XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIG5ldyBIYXNoU2V0KCk7XG4gICAgfVxufVxuXG5jbGFzcyBJbnREZWZhdWx0RGljdCBleHRlbmRzIEhhc2hEaWN0IHtcbiAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICAgICAgc3VwZXIoKTtcbiAgICB9XG5cbiAgICBpbmNyZW1lbnQoa2V5OiBhbnksIHZhbDogYW55KSB7XG4gICAgICAgIGNvbnN0IGtleUhhc2ggPSBVdGlsLmhhc2hLZXkoa2V5KTtcbiAgICAgICAgaWYgKGtleUhhc2ggaW4gdGhpcy5kaWN0KSB7XG4gICAgICAgICAgICB0aGlzLmRpY3Rba2V5SGFzaF0gKz0gdmFsO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5kaWN0W2tleUhhc2hdID0gMDtcbiAgICAgICAgICAgIHRoaXMuZGljdFtrZXlIYXNoXSArPSB2YWw7XG4gICAgICAgIH1cbiAgICB9XG59XG5cbmNsYXNzIEFyckRlZmF1bHREaWN0IGV4dGVuZHMgSGFzaERpY3Qge1xuICAgIGNvbnN0cnVjdG9yKCkge1xuICAgICAgICBzdXBlcigpO1xuICAgIH1cblxuICAgIGdldChrZXk6IGFueSkge1xuICAgICAgICBjb25zdCBrZXlIYXNoID0gVXRpbC5oYXNoS2V5KGtleSk7XG4gICAgICAgIGlmIChrZXlIYXNoIGluIHRoaXMuZGljdCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuZGljdFtrZXlIYXNoXVsxXTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gW107XG4gICAgfVxufVxuXG5cbi8vIGFuIGltcGxpY2F0aW9uIGNsYXNzIHVzZWQgYXMgYW4gYWx0ZXJuYXRpdmUgdG8gdHVwbGVzIGluIHN5bXB5XG5jbGFzcyBJbXBsaWNhdGlvbiB7XG4gICAgcDtcbiAgICBxO1xuXG4gICAgY29uc3RydWN0b3IocDogYW55LCBxOiBhbnkpIHtcbiAgICAgICAgdGhpcy5wID0gcDtcbiAgICAgICAgdGhpcy5xID0gcTtcbiAgICB9XG5cbiAgICBoYXNoS2V5KCkge1xuICAgICAgICByZXR1cm4gKHRoaXMucCBhcyBzdHJpbmcpICsgKHRoaXMucSBhcyBzdHJpbmcpO1xuICAgIH1cbn1cblxuXG4vLyBhbiBMUlUgY2FjaGUgaW1wbGVtZW50YXRpb24gdXNlZCBmb3IgY2FjaGUudHNcblxuaW50ZXJmYWNlIE5vZGUge1xuICAgIGtleTogYW55O1xuICAgIHZhbHVlOiBhbnk7XG4gICAgcHJldjogYW55O1xuICAgIG5leHQ6IGFueTtcbn1cblxuY2xhc3MgTFJVQ2FjaGUge1xuICAgIGNhcGFjaXR5OiBudW1iZXI7XG4gICAgbWFwOiBIYXNoRGljdDtcbiAgICBoZWFkOiBhbnk7XG4gICAgdGFpbDogYW55O1xuXG4gICAgY29uc3RydWN0b3IoY2FwYWNpdHk6IG51bWJlcikge1xuICAgICAgICB0aGlzLmNhcGFjaXR5ID0gY2FwYWNpdHk7XG4gICAgICAgIHRoaXMubWFwID0gbmV3IEhhc2hEaWN0KCk7XG5cbiAgICAgICAgLy8gdGhlc2UgYXJlIGJvdW5kYXJpZXMgZm9yIHRoZSBkb3VibGUgbGlua2VkIGxpc3RcbiAgICAgICAgdGhpcy5oZWFkID0ge307XG4gICAgICAgIHRoaXMudGFpbCA9IHt9O1xuXG4gICAgICAgIHRoaXMuaGVhZC5uZXh0ID0gdGhpcy5oZWFkO1xuICAgICAgICB0aGlzLnRhaWwucHJldiA9IHRoaXMuaGVhZDtcbiAgICB9XG5cbiAgICBnZXQoa2V5OiBhbnkpIHtcbiAgICAgICAgaWYgKHRoaXMubWFwLmhhcyhrZXkpKSB7XG4gICAgICAgICAgICAvLyByZW1vdmUgZWxlbWVudCBmcm9tIHRoZSBjdXJyZW50IHBvc2l0aW9uXG4gICAgICAgICAgICBjb25zdCBjID0gdGhpcy5tYXAuZ2V0KGtleSk7XG4gICAgICAgICAgICBjLnByZXYubmV4dCA9IGMubmV4dDtcbiAgICAgICAgICAgIGMubmV4dC5wcmV2ID0gYy5wcmV2O1xuXG4gICAgICAgICAgICB0aGlzLnRhaWwucHJldi5uZXh0ID0gYzsgLy8gaW5zZXJ0IGFmdGVyIGxhc3QgZWxlbWVudFxuICAgICAgICAgICAgYy5wcmV2ID0gdGhpcy50YWlsLnByZXY7XG4gICAgICAgICAgICBjLm5leHQgPSB0aGlzLnRhaWw7XG4gICAgICAgICAgICB0aGlzLnRhaWwucHJldiA9IGM7XG5cbiAgICAgICAgICAgIHJldHVybiBjLnZhbHVlO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuIHVuZGVmaW5lZDsgLy8gaW52YWxpZCBrZXlcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHB1dChrZXk6IGFueSwgdmFsdWU6IGFueSkge1xuICAgICAgICBpZiAodHlwZW9mIHRoaXMuZ2V0KGtleSkgIT09IFwidW5kZWZpbmVkXCIpIHsgLy8gdGhlIGtleSBpcyBpbnZhbGlkXG4gICAgICAgICAgICB0aGlzLnRhaWwucHJldi52YWx1ZSA9IHZhbHVlO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgLy8gY2hlY2sgZm9yIGNhcGFjaXR5XG4gICAgICAgICAgICBpZiAodGhpcy5tYXAuc2l6ZSA9PT0gdGhpcy5jYXBhY2l0eSkge1xuICAgICAgICAgICAgICAgIHRoaXMubWFwLmRlbGV0ZSh0aGlzLmhlYWQubmV4dC5rZXkpOyAvLyBkZWxldGUgZmlyc3QgZWxlbWVudFxuICAgICAgICAgICAgICAgIHRoaXMuaGVhZC5uZXh0ID0gdGhpcy5oZWFkLm5leHQubmV4dDsgLy8gcmVwbGFjZSB3aXRoIG5leHRcbiAgICAgICAgICAgICAgICB0aGlzLmhlYWQubmV4dC5wcmV2ID0gdGhpcy5oZWFkO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGNvbnN0IG5ld05vZGU6IE5vZGUgPSB7XG4gICAgICAgICAgICB2YWx1ZSxcbiAgICAgICAgICAgIGtleSxcbiAgICAgICAgICAgIHByZXY6IG51bGwsXG4gICAgICAgICAgICBuZXh0OiBudWxsLFxuICAgICAgICB9OyAvLyBlYWNoIG5vZGUgaXMgYSBoYXNoIGVudHJ5XG5cbiAgICAgICAgLy8gd2hlbiBhZGRpbmcgYSBuZXcgbm9kZSwgd2UgbmVlZCB0byB1cGRhdGUgYm90aCBtYXAgYW5kIERMTFxuICAgICAgICB0aGlzLm1hcC5hZGQoa2V5LCBuZXdOb2RlKTsgLy8gYWRkIHRoZSBjdXJyZW50IG5vZGVcbiAgICAgICAgdGhpcy50YWlsLnByZXYubmV4dCA9IG5ld05vZGU7IC8vIGFkZCBub2RlIHRvIHRoZSBlbmRcbiAgICAgICAgbmV3Tm9kZS5wcmV2ID0gdGhpcy50YWlsLnByZXY7XG4gICAgICAgIG5ld05vZGUubmV4dCA9IHRoaXMudGFpbDtcbiAgICAgICAgdGhpcy50YWlsLnByZXYgPSBuZXdOb2RlO1xuICAgIH1cbn1cblxuY2xhc3MgSXRlcmF0b3Ige1xuICAgIGFycjogYW55W107XG4gICAgY291bnRlcjtcblxuICAgIGNvbnN0cnVjdG9yKGFycjogYW55W10pIHtcbiAgICAgICAgdGhpcy5hcnIgPSBhcnI7XG4gICAgICAgIHRoaXMuY291bnRlciA9IDA7XG4gICAgfVxuXG4gICAgbmV4dCgpIHtcbiAgICAgICAgaWYgKHRoaXMuY291bnRlciA+PSB0aGlzLmFyci5sZW5ndGgpIHtcbiAgICAgICAgICAgIHJldHVybiB1bmRlZmluZWQ7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5jb3VudGVyKys7XG4gICAgICAgIHJldHVybiB0aGlzLmFyclt0aGlzLmNvdW50ZXItMV07XG4gICAgfVxufVxuXG4vLyBtaXhpbiBjbGFzcyB1c2VkIHRvIHJlcGxpY2F0ZSBtdWx0aXBsZSBpbmhlcml0YW5jZVxuXG5jbGFzcyBNaXhpbkJ1aWxkZXIge1xuICAgIHN1cGVyY2xhc3M7XG4gICAgY29uc3RydWN0b3Ioc3VwZXJjbGFzczogYW55KSB7XG4gICAgICAgIHRoaXMuc3VwZXJjbGFzcyA9IHN1cGVyY2xhc3M7XG4gICAgfVxuICAgIHdpdGgoLi4ubWl4aW5zOiBhbnlbXSkge1xuICAgICAgICByZXR1cm4gbWl4aW5zLnJlZHVjZSgoYywgbWl4aW4pID0+IG1peGluKGMpLCB0aGlzLnN1cGVyY2xhc3MpO1xuICAgIH1cbn1cblxuY2xhc3MgYmFzZSB7fVxuXG5jb25zdCBtaXggPSAoc3VwZXJjbGFzczogYW55KSA9PiBuZXcgTWl4aW5CdWlsZGVyKHN1cGVyY2xhc3MpO1xuXG5cbmV4cG9ydCB7VXRpbCwgSGFzaFNldCwgU2V0RGVmYXVsdERpY3QsIEhhc2hEaWN0LCBJbXBsaWNhdGlvbiwgTFJVQ2FjaGUsIEl0ZXJhdG9yLCBJbnREZWZhdWx0RGljdCwgQXJyRGVmYXVsdERpY3QsIG1peCwgYmFzZX07XG5cbiIsICIvKiBlc2xpbnQtZGlzYWJsZSBuZXctY2FwICovXG4vKiBlc2xpbnQtZGlzYWJsZSBuby11bnVzZWQtdmFycyAqL1xuLypcblxuTm90YWJsZSBjaG5hZ2VzIG1hZGUgKFdCICYgR00pOlxuLSBOdWxsIGlzIGJlaW5nIHVzZWQgYXMgYSB0aGlyZCBib29sZWFuIHZhbHVlIGluc3RlYWQgb2YgJ25vbmUnXG4tIEFycmF5cyBhcmUgYmVpbmcgdXNlZCBpbnN0ZWFkIG9mIHR1cGxlc1xuLSBUaGUgbWV0aG9kcyBoYXNoS2V5KCkgYW5kIHRvU3RyaW5nKCkgYXJlIGFkZGVkIHRvIExvZ2ljIGZvciBoYXNoaW5nLiBUaGVcbiAgc3RhdGljIG1ldGhvZCBoYXNoS2V5KCkgaXMgYWxzbyBhZGRlZCB0byBMb2dpYyBhbmQgaGFzaGVzIGRlcGVuZGluZyBvbiB0aGUgaW5wdXQuXG4tIFRoZSBhcnJheSBhcmdzIGluIHRoZSBBbmRPcl9CYXNlIGNvbnN0cnVjdG9yIGlzIG5vdCBzb3J0ZWQgb3IgcHV0IGluIGEgc2V0XG4gIHNpbmNlIHdlIGRpZCd0IHNlZSB3aHkgdGhpcyB3b3VsZCBiZSBuZWNlc2FyeVxuLSBBIGNvbnN0cnVjdG9yIGlzIGFkZGVkIHRvIHRoZSBsb2dpYyBjbGFzcywgd2hpY2ggaXMgdXNlZCBieSBMb2dpYyBhbmQgaXRzXG4gIHN1YmNsYXNzZXMgKEFuZE9yX0Jhc2UsIEFuZCwgT3IsIE5vdClcbi0gSW4gdGhlIGZsYXR0ZW4gbWV0aG9kIG9mIEFuZE9yX0Jhc2Ugd2UgcmVtb3ZlZCB0aGUgdHJ5IGNhdGNoIGFuZCBjaGFuZ2VkIHRoZVxuICB3aGlsZSBsb29wIHRvIGRlcGVuZCBvbiB0aGUgbGVnbnRoIG9mIHRoZSBhcmdzIGFycmF5XG4tIEFkZGVkIGV4cGFuZCgpIGFuZCBldmFsX3Byb3BhZ2F0ZV9ub3QgYXMgYWJzdHJhY3QgbWV0aG9kcyB0byB0aGUgTG9naWMgY2xhc3Ncbi0gQWRkZWQgc3RhdGljIE5ldyBtZXRob2RzIHRvIE5vdCwgQW5kLCBhbmQgT3Igd2hpY2ggZnVuY3Rpb24gYXMgY29uc3RydWN0b3JzXG4tIFJlcGxhY2VtZCBub3JtYWwgYm9vbGVhbnMgd2l0aCBMb2dpYy5UcnVlIGFuZCBMb2dpYy5GYWxzZSBzaW5jZSBpdCBpcyBzb21ldGltZXNcbm5lY2VzYXJ5IHRvIGZpbmQgaWYgYSBnaXZlbiBhcmd1bWVuZXQgaXMgYSBib29sZWFuXG4tIEFkZGVkIHNvbWUgdjIgbWV0aG9kcyB3aGljaCByZXR1cm4gdHJ1ZSwgZmFsc2UsIGFuZCB1bmRlZmluZWQsIHdoaWNoIHdvcmtzXG4gIHdpdGggdGhlIHJlc3Qgb2YgdGhlIGNvZGVcblxuKi9cblxuaW1wb3J0IHtVdGlsfSBmcm9tIFwiLi91dGlsaXR5LmpzXCI7XG5cblxuZnVuY3Rpb24gX3RvcmYoYXJnczogYW55W10pOiBMb2dpYyB8IG51bGwge1xuICAgIC8qIFJldHVybiBUcnVlIGlmIGFsbCBhcmdzIGFyZSBUcnVlLCBGYWxzZSBpZiB0aGV5XG4gICAgYXJlIGFsbCBGYWxzZSwgZWxzZSBOb25lXG4gICAgPj4+IGZyb20gc3ltcHkuY29yZS5sb2dpYyBpbXBvcnQgX3RvcmZcbiAgICA+Pj4gX3RvcmYoKFRydWUsIFRydWUpKVxuICAgIFRydWVcbiAgICA+Pj4gX3RvcmYoKEZhbHNlLCBGYWxzZSkpXG4gICAgRmFsc2VcbiAgICA+Pj4gX3RvcmYoKFRydWUsIEZhbHNlKSlcbiAgICAqL1xuICAgIGxldCBzYXdUID0gTG9naWMuRmFsc2U7XG4gICAgbGV0IHNhd0YgPSBMb2dpYy5GYWxzZTtcbiAgICBmb3IgKGNvbnN0IGEgb2YgYXJncykge1xuICAgICAgICBpZiAoYSA9PT0gTG9naWMuVHJ1ZSkge1xuICAgICAgICAgICAgaWYgKHNhd0YgaW5zdGFuY2VvZiBUcnVlKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBzYXdUID0gTG9naWMuVHJ1ZTtcbiAgICAgICAgfSBlbHNlIGlmIChhID09PSBMb2dpYy5GYWxzZSkge1xuICAgICAgICAgICAgaWYgKHNhd1QgaW5zdGFuY2VvZiBUcnVlKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBzYXdGID0gTG9naWMuVHJ1ZTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiBudWxsO1xuICAgICAgICB9XG4gICAgfVxuICAgIHJldHVybiBzYXdUO1xufVxuXG5mdW5jdGlvbiBfZnV6enlfZ3JvdXAoYXJnczogYW55W10sIHF1aWNrX2V4aXQgPSBMb2dpYy5GYWxzZSk6IExvZ2ljIHwgbnVsbCB7XG4gICAgLyogUmV0dXJuIFRydWUgaWYgYWxsIGFyZ3MgYXJlIFRydWUsIE5vbmUgaWYgdGhlcmUgaXMgYW55IE5vbmUgZWxzZSBGYWxzZVxuICAgIHVubGVzcyBgYHF1aWNrX2V4aXRgYCBpcyBUcnVlICh0aGVuIHJldHVybiBOb25lIGFzIHNvb24gYXMgYSBzZWNvbmQgRmFsc2VcbiAgICBpcyBzZWVuLlxuICAgICBgYF9mdXp6eV9ncm91cGBgIGlzIGxpa2UgYGBmdXp6eV9hbmRgYCBleGNlcHQgdGhhdCBpdCBpcyBtb3JlXG4gICAgY29uc2VydmF0aXZlIGluIHJldHVybmluZyBhIEZhbHNlLCB3YWl0aW5nIHRvIG1ha2Ugc3VyZSB0aGF0IGFsbFxuICAgIGFyZ3VtZW50cyBhcmUgVHJ1ZSBvciBGYWxzZSBhbmQgcmV0dXJuaW5nIE5vbmUgaWYgYW55IGFyZ3VtZW50cyBhcmVcbiAgICBOb25lLiBJdCBhbHNvIGhhcyB0aGUgY2FwYWJpbGl0eSBvZiBwZXJtaXRpbmcgb25seSBhIHNpbmdsZSBGYWxzZSBhbmRcbiAgICByZXR1cm5pbmcgTm9uZSBpZiBtb3JlIHRoYW4gb25lIGlzIHNlZW4uIEZvciBleGFtcGxlLCB0aGUgcHJlc2VuY2Ugb2YgYVxuICAgIHNpbmdsZSB0cmFuc2NlbmRlbnRhbCBhbW9uZ3N0IHJhdGlvbmFscyB3b3VsZCBpbmRpY2F0ZSB0aGF0IHRoZSBncm91cCBpc1xuICAgIG5vIGxvbmdlciByYXRpb25hbDsgYnV0IGEgc2Vjb25kIHRyYW5zY2VuZGVudGFsIGluIHRoZSBncm91cCB3b3VsZCBtYWtlIHRoZVxuICAgIGRldGVybWluYXRpb24gaW1wb3NzaWJsZS5cbiAgICBFeGFtcGxlc1xuICAgID09PT09PT09XG4gICAgPj4+IGZyb20gc3ltcHkuY29yZS5sb2dpYyBpbXBvcnQgX2Z1enp5X2dyb3VwXG4gICAgQnkgZGVmYXVsdCwgbXVsdGlwbGUgRmFsc2VzIG1lYW4gdGhlIGdyb3VwIGlzIGJyb2tlbjpcbiAgICA+Pj4gX2Z1enp5X2dyb3VwKFtGYWxzZSwgRmFsc2UsIFRydWVdKVxuICAgIEZhbHNlXG4gICAgSWYgbXVsdGlwbGUgRmFsc2VzIG1lYW4gdGhlIGdyb3VwIHN0YXR1cyBpcyB1bmtub3duIHRoZW4gc2V0XG4gICAgYHF1aWNrX2V4aXRgIHRvIFRydWUgc28gTm9uZSBjYW4gYmUgcmV0dXJuZWQgd2hlbiB0aGUgMm5kIEZhbHNlIGlzIHNlZW46XG4gICAgPj4+IF9mdXp6eV9ncm91cChbRmFsc2UsIEZhbHNlLCBUcnVlXSwgcXVpY2tfZXhpdD1UcnVlKVxuICAgIEJ1dCBpZiBvbmx5IGEgc2luZ2xlIEZhbHNlIGlzIHNlZW4gdGhlbiB0aGUgZ3JvdXAgaXMga25vd24gdG9cbiAgICBiZSBicm9rZW46XG4gICAgPj4+IF9mdXp6eV9ncm91cChbRmFsc2UsIFRydWUsIFRydWVdLCBxdWlja19leGl0PVRydWUpXG4gICAgRmFsc2VcbiAgICAqL1xuICAgIGxldCBzYXdfb3RoZXIgPSBMb2dpYy5GYWxzZTtcbiAgICBmb3IgKGNvbnN0IGEgb2YgYXJncykge1xuICAgICAgICBpZiAoYSA9PT0gTG9naWMuVHJ1ZSkge1xuICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgIH0gaWYgKGEgPT0gbnVsbCkge1xuICAgICAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICAgIH0gaWYgKHF1aWNrX2V4aXQgaW5zdGFuY2VvZiBUcnVlICYmIHNhd19vdGhlciBpbnN0YW5jZW9mIFRydWUpIHtcbiAgICAgICAgICAgIHJldHVybiBudWxsO1xuICAgICAgICB9XG4gICAgICAgIHNhd19vdGhlciA9IExvZ2ljLlRydWU7XG4gICAgfVxuICAgIGlmIChzYXdfb3RoZXIgaW5zdGFuY2VvZiBUcnVlKSB7XG4gICAgICAgIHJldHVybiBMb2dpYy5GYWxzZTtcbiAgICB9XG4gICAgcmV0dXJuIExvZ2ljLlRydWU7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBfZnV6enlfZ3JvdXB2MihhcmdzOiBhbnlbXSkge1xuICAgIGNvbnN0IHJlcyA9IF9mdXp6eV9ncm91cChhcmdzKTtcbiAgICBpZiAocmVzID09PSBMb2dpYy5UcnVlKSB7XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgIH0gZWxzZSBpZiAocmVzID09PSBMb2dpYy5GYWxzZSkge1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICAgIHJldHVybiB1bmRlZmluZWQ7XG59XG5cblxuZnVuY3Rpb24gZnV6enlfYm9vbCh4OiBMb2dpYyk6IExvZ2ljIHwgbnVsbCB7XG4gICAgLyogUmV0dXJuIFRydWUsIEZhbHNlIG9yIE5vbmUgYWNjb3JkaW5nIHRvIHguXG4gICAgV2hlcmVhcyBib29sKHgpIHJldHVybnMgVHJ1ZSBvciBGYWxzZSwgZnV6enlfYm9vbCBhbGxvd3NcbiAgICBmb3IgdGhlIE5vbmUgdmFsdWUgYW5kIG5vbiAtIGZhbHNlIHZhbHVlcyh3aGljaCBiZWNvbWUgTm9uZSksIHRvby5cbiAgICBFeGFtcGxlc1xuICAgID09PT09PT09XG4gICAgPj4+IGZyb20gc3ltcHkuY29yZS5sb2dpYyBpbXBvcnQgZnV6enlfYm9vbFxuICAgID4+PiBmcm9tIHN5bXB5LmFiYyBpbXBvcnQgeFxuICAgID4+PiBmdXp6eV9ib29sKHgpLCBmdXp6eV9ib29sKE5vbmUpXG4gICAgKE5vbmUsIE5vbmUpXG4gICAgPj4+IGJvb2woeCksIGJvb2woTm9uZSlcbiAgICAgICAgKFRydWUsIEZhbHNlKVxuICAgICovXG4gICAgaWYgKHggPT0gbnVsbCkge1xuICAgICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG4gICAgaWYgKHggaW5zdGFuY2VvZiBUcnVlKSB7XG4gICAgICAgIHJldHVybiBMb2dpYy5UcnVlO1xuICAgIH1cbiAgICBpZiAoeCBpbnN0YW5jZW9mIEZhbHNlKSB7XG4gICAgICAgIHJldHVybiBMb2dpYy5GYWxzZTtcbiAgICB9XG59XG5cbmZ1bmN0aW9uIGZ1enp5X2Jvb2xfdjIoeDogYm9vbGVhbikge1xuICAgIC8qIFJldHVybiBUcnVlLCBGYWxzZSBvciBOb25lIGFjY29yZGluZyB0byB4LlxuICAgIFdoZXJlYXMgYm9vbCh4KSByZXR1cm5zIFRydWUgb3IgRmFsc2UsIGZ1enp5X2Jvb2wgYWxsb3dzXG4gICAgZm9yIHRoZSBOb25lIHZhbHVlIGFuZCBub24gLSBmYWxzZSB2YWx1ZXMod2hpY2ggYmVjb21lIE5vbmUpLCB0b28uXG4gICAgRXhhbXBsZXNcbiAgICA9PT09PT09PVxuICAgID4+PiBmcm9tIHN5bXB5LmNvcmUubG9naWMgaW1wb3J0IGZ1enp5X2Jvb2xcbiAgICA+Pj4gZnJvbSBzeW1weS5hYmMgaW1wb3J0IHhcbiAgICA+Pj4gZnV6enlfYm9vbCh4KSwgZnV6enlfYm9vbChOb25lKVxuICAgIChOb25lLCBOb25lKVxuICAgID4+PiBib29sKHgpLCBib29sKE5vbmUpXG4gICAgICAgIChUcnVlLCBGYWxzZSlcbiAgICAqL1xuICAgIGlmICh0eXBlb2YgeCA9PT0gXCJ1bmRlZmluZWRcIikge1xuICAgICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG4gICAgaWYgKHggPT09IHRydWUpIHtcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuICAgIGlmICh4ID09PSBmYWxzZSkge1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxufVxuXG5mdW5jdGlvbiBmdXp6eV9hbmQoYXJnczogYW55W10pOiBMb2dpYyB8IG51bGwge1xuICAgIC8qIFJldHVybiBUcnVlIChhbGwgVHJ1ZSksIEZhbHNlIChhbnkgRmFsc2UpIG9yIE5vbmUuXG4gICAgRXhhbXBsZXNcbiAgICA9PT09PT09PVxuICAgID4+PiBmcm9tIHN5bXB5LmNvcmUubG9naWMgaW1wb3J0IGZ1enp5X2FuZFxuICAgID4+PiBmcm9tIHN5bXB5IGltcG9ydCBEdW1teVxuICAgIElmIHlvdSBoYWQgYSBsaXN0IG9mIG9iamVjdHMgdG8gdGVzdCB0aGUgY29tbXV0aXZpdHkgb2ZcbiAgICBhbmQgeW91IHdhbnQgdGhlIGZ1enp5X2FuZCBsb2dpYyBhcHBsaWVkLCBwYXNzaW5nIGFuXG4gICAgaXRlcmF0b3Igd2lsbCBhbGxvdyB0aGUgY29tbXV0YXRpdml0eSB0byBvbmx5IGJlIGNvbXB1dGVkXG4gICAgYXMgbWFueSB0aW1lcyBhcyBuZWNlc3NhcnkuV2l0aCB0aGlzIGxpc3QsIEZhbHNlIGNhbiBiZVxuICAgIHJldHVybmVkIGFmdGVyIGFuYWx5emluZyB0aGUgZmlyc3Qgc3ltYm9sOlxuICAgID4+PiBzeW1zID1bRHVtbXkoY29tbXV0YXRpdmUgPSBGYWxzZSksIER1bW15KCldXG4gICAgPj4+IGZ1enp5X2FuZChzLmlzX2NvbW11dGF0aXZlIGZvciBzIGluIHN5bXMpXG4gICAgRmFsc2VcbiAgICBUaGF0IEZhbHNlIHdvdWxkIHJlcXVpcmUgbGVzcyB3b3JrIHRoYW4gaWYgYSBsaXN0IG9mIHByZSAtIGNvbXB1dGVkXG4gICAgaXRlbXMgd2FzIHNlbnQ6XG4gICAgPj4+IGZ1enp5X2FuZChbcy5pc19jb21tdXRhdGl2ZSBmb3IgcyBpbiBzeW1zXSlcbiAgICBGYWxzZVxuICAgICovXG5cbiAgICBsZXQgcnYgPSBMb2dpYy5UcnVlO1xuICAgIGZvciAobGV0IGFpIG9mIGFyZ3MpIHtcbiAgICAgICAgYWkgPSBmdXp6eV9ib29sKGFpKTtcbiAgICAgICAgaWYgKGFpIGluc3RhbmNlb2YgRmFsc2UpIHtcbiAgICAgICAgICAgIHJldHVybiBMb2dpYy5GYWxzZTtcbiAgICAgICAgfSBpZiAocnYgaW5zdGFuY2VvZiBUcnVlKSB7IC8vIHRoaXMgd2lsbCBzdG9wIHVwZGF0aW5nIGlmIGEgTm9uZSBpcyBldmVyIHRyYXBwZWRcbiAgICAgICAgICAgIHJ2ID0gYWk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIHJ2O1xufVxuXG5mdW5jdGlvbiBmdXp6eV9hbmRfdjIoYXJnczogYW55W10pIHtcbiAgICBsZXQgcnYgPSB0cnVlO1xuICAgIGZvciAobGV0IGFpIG9mIGFyZ3MpIHtcbiAgICAgICAgYWkgPSBmdXp6eV9ib29sX3YyKGFpKTtcbiAgICAgICAgaWYgKGFpID09PSBmYWxzZSkge1xuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9IGlmIChydiA9PT0gdHJ1ZSkge1xuICAgICAgICAgICAgcnYgPSBhaTtcbiAgICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gcnY7XG59XG5cbmZ1bmN0aW9uIGZ1enp5X25vdCh2OiBhbnkpOiBMb2dpYyB8IG51bGwge1xuICAgIC8qXG4gICAgTm90IGluIGZ1enp5IGxvZ2ljXG4gICAgICAgIFJldHVybiBOb25lIGlmIGB2YCBpcyBOb25lIGVsc2UgYG5vdCB2YC5cbiAgICAgICAgRXhhbXBsZXNcbiAgICAgICAgPT09PT09PT1cbiAgICAgICAgPj4+IGZyb20gc3ltcHkuY29yZS5sb2dpYyBpbXBvcnQgZnV6enlfbm90XG4gICAgICAgID4+PiBmdXp6eV9ub3QoVHJ1ZSlcbiAgICBGYWxzZVxuICAgICAgICA+Pj4gZnV6enlfbm90KE5vbmUpXG4gICAgICAgID4+PiBmdXp6eV9ub3QoRmFsc2UpXG4gICAgVHJ1ZVxuICAgICovXG4gICAgaWYgKHYgPT0gbnVsbCkge1xuICAgICAgICByZXR1cm4gdjtcbiAgICB9IGVsc2UgaWYgKHYgaW5zdGFuY2VvZiBUcnVlKSB7XG4gICAgICAgIHJldHVybiBMb2dpYy5GYWxzZTtcbiAgICB9XG4gICAgcmV0dXJuIExvZ2ljLlRydWU7XG59XG5cblxuZXhwb3J0IGZ1bmN0aW9uIGZ1enp5X25vdHYyKHY6IGFueSkge1xuICAgIC8qXG4gICAgTm90IGluIGZ1enp5IGxvZ2ljXG4gICAgICAgIFJldHVybiBOb25lIGlmIGB2YCBpcyBOb25lIGVsc2UgYG5vdCB2YC5cbiAgICAgICAgRXhhbXBsZXNcbiAgICAgICAgPT09PT09PT1cbiAgICAgICAgPj4+IGZyb20gc3ltcHkuY29yZS5sb2dpYyBpbXBvcnQgZnV6enlfbm90XG4gICAgICAgID4+PiBmdXp6eV9ub3QoVHJ1ZSlcbiAgICBGYWxzZVxuICAgICAgICA+Pj4gZnV6enlfbm90KE5vbmUpXG4gICAgICAgID4+PiBmdXp6eV9ub3QoRmFsc2UpXG4gICAgVHJ1ZVxuICAgICovXG4gICAgaWYgKHYgPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgIHJldHVybiB1bmRlZmluZWQ7XG4gICAgfSBlbHNlIGlmICh2ID09PSB0cnVlKSB7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gICAgcmV0dXJuIHRydWU7XG59XG5cblxuZnVuY3Rpb24gZnV6enlfb3IoYXJnczogYW55W10pOiBMb2dpYyB7XG4gICAgLypcbiAgICBPciBpbiBmdXp6eSBsb2dpYy5SZXR1cm5zIFRydWUoYW55IFRydWUpLCBGYWxzZShhbGwgRmFsc2UpLCBvciBOb25lXG4gICAgICAgIFNlZSB0aGUgZG9jc3RyaW5ncyBvZiBmdXp6eV9hbmQgYW5kIGZ1enp5X25vdCBmb3IgbW9yZSBpbmZvLmZ1enp5X29yIGlzXG4gICAgICAgIHJlbGF0ZWQgdG8gdGhlIHR3byBieSB0aGUgc3RhbmRhcmQgRGUgTW9yZ2FuJ3MgbGF3LlxuICAgICAgICA+Pj4gZnJvbSBzeW1weS5jb3JlLmxvZ2ljIGltcG9ydCBmdXp6eV9vclxuICAgICAgICA+Pj4gZnV6enlfb3IoW1RydWUsIEZhbHNlXSlcbiAgICBUcnVlXG4gICAgICAgID4+PiBmdXp6eV9vcihbVHJ1ZSwgTm9uZV0pXG4gICAgVHJ1ZVxuICAgICAgICA+Pj4gZnV6enlfb3IoW0ZhbHNlLCBGYWxzZV0pXG4gICAgRmFsc2VcbiAgICAgICAgPj4+IHByaW50KGZ1enp5X29yKFtGYWxzZSwgTm9uZV0pKVxuICAgIE5vbmVcbiAgICAqL1xuICAgIGxldCBydiA9IExvZ2ljLkZhbHNlO1xuXG4gICAgZm9yIChsZXQgYWkgb2YgYXJncykge1xuICAgICAgICBhaSA9IGZ1enp5X2Jvb2woYWkpO1xuICAgICAgICBpZiAoYWkgaW5zdGFuY2VvZiBUcnVlKSB7XG4gICAgICAgICAgICByZXR1cm4gTG9naWMuVHJ1ZTtcbiAgICAgICAgfVxuICAgICAgICBpZiAocnYgaW5zdGFuY2VvZiBGYWxzZSkgeyAvLyB0aGlzIHdpbGwgc3RvcCB1cGRhdGluZyBpZiBhIE5vbmUgaXMgZXZlciB0cmFwcGVkXG4gICAgICAgICAgICBydiA9IGFpO1xuICAgICAgICB9XG4gICAgfVxuICAgIHJldHVybiBydjtcbn1cblxuZnVuY3Rpb24gZnV6enlfeG9yKGFyZ3M6IGFueVtdKTogTG9naWMgfCBudWxsIHtcbiAgICAvKiBSZXR1cm4gTm9uZSBpZiBhbnkgZWxlbWVudCBvZiBhcmdzIGlzIG5vdCBUcnVlIG9yIEZhbHNlLCBlbHNlXG4gICAgVHJ1ZShpZiB0aGVyZSBhcmUgYW4gb2RkIG51bWJlciBvZiBUcnVlIGVsZW1lbnRzKSwgZWxzZSBGYWxzZS4gKi9cbiAgICBsZXQgdCA9IDA7XG4gICAgbGV0IGYgPSAwO1xuICAgIGZvciAoY29uc3QgYSBvZiBhcmdzKSB7XG4gICAgICAgIGNvbnN0IGFpID0gZnV6enlfYm9vbChhKTtcbiAgICAgICAgaWYgKGFpIGluc3RhbmNlb2YgVHJ1ZSkge1xuICAgICAgICAgICAgdCArPSAxO1xuICAgICAgICB9IGVsc2UgaWYgKGFpIGluc3RhbmNlb2YgRmFsc2UpIHtcbiAgICAgICAgICAgIGYgKz0gMTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiBudWxsO1xuICAgICAgICB9XG4gICAgfVxuICAgIGlmICh0ICUgMiA9PSAxKSB7XG4gICAgICAgIHJldHVybiBMb2dpYy5UcnVlO1xuICAgIH1cbiAgICByZXR1cm4gTG9naWMuRmFsc2U7XG59XG5cbmZ1bmN0aW9uIGZ1enp5X25hbmQoYXJnczogYW55W10pOiBMb2dpYyB8IG51bGwge1xuICAgIC8qIFJldHVybiBGYWxzZSBpZiBhbGwgYXJncyBhcmUgVHJ1ZSwgVHJ1ZSBpZiB0aGV5IGFyZSBhbGwgRmFsc2UsXG4gICAgZWxzZSBOb25lLiAqL1xuICAgIHJldHVybiBmdXp6eV9ub3QoZnV6enlfYW5kKGFyZ3MpKTtcbn1cblxuXG5jbGFzcyBMb2dpYyB7XG4gICAgc3RhdGljIFRydWU6IExvZ2ljO1xuICAgIHN0YXRpYyBGYWxzZTogTG9naWM7XG5cbiAgICBzdGF0aWMgb3BfMmNsYXNzOiBSZWNvcmQ8c3RyaW5nLCAoLi4uYXJnczogYW55W10pID0+IExvZ2ljPiA9IHtcbiAgICAgICAgXCImXCI6ICguLi5hcmdzKSA9PiB7XG4gICAgICAgICAgICByZXR1cm4gQW5kLl9fbmV3X18oQW5kLnByb3RvdHlwZSwgLi4uYXJncyk7XG4gICAgICAgIH0sXG4gICAgICAgIFwifFwiOiAoLi4uYXJncykgPT4ge1xuICAgICAgICAgICAgcmV0dXJuIE9yLl9fbmV3X18oT3IucHJvdG90eXBlLCAuLi5hcmdzKTtcbiAgICAgICAgfSxcbiAgICAgICAgXCIhXCI6IChhcmcpID0+IHtcbiAgICAgICAgICAgIHJldHVybiBOb3QuX19uZXdfXyhOb3QucHJvdG90eXBlLCBhcmcpO1xuICAgICAgICB9LFxuICAgIH07XG5cbiAgICBhcmdzOiBhbnlbXTtcblxuICAgIGNvbnN0cnVjdG9yKC4uLmFyZ3M6IGFueVtdKSB7XG4gICAgICAgIHRoaXMuYXJncyA9IGFyZ3M7XG4gICAgfVxuXG4gICAgX2V2YWxfcHJvcGFnYXRlX25vdCgpOiBhbnkge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJFdmFsIHByb3BhZ2F0ZSBub3QgaXMgYWJzdHJhY3QgaW4gTG9naWNcIik7XG4gICAgfVxuXG4gICAgZXhwYW5kKCk6IGFueSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcihcIkV4cGFuZCBpcyBhYnN0cmFjdCBpbiBMb2dpY1wiKTtcbiAgICB9XG5cbiAgICBzdGF0aWMgX19uZXdfXyhjbHM6IGFueSwgLi4uYXJnczogYW55W10pOiBhbnkge1xuICAgICAgICBpZiAoY2xzID09PSBOb3QpIHtcbiAgICAgICAgICAgIHJldHVybiBuZXcgTm90KGFyZ3NbMF0pO1xuICAgICAgICB9IGVsc2UgaWYgKGNscyA9PT0gQW5kKSB7XG4gICAgICAgICAgICByZXR1cm4gbmV3IEFuZChhcmdzKTtcbiAgICAgICAgfSBlbHNlIGlmIChjbHMgPT09IE9yKSB7XG4gICAgICAgICAgICByZXR1cm4gbmV3IE9yKGFyZ3MpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgZ2V0X29wX3hfbm90eCgpOiBhbnkge1xuICAgICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG5cbiAgICBoYXNoS2V5KCk6IHN0cmluZyB7XG4gICAgICAgIHJldHVybiB0aGlzLnRvU3RyaW5nKCk7XG4gICAgfVxuXG4gICAgdG9TdHJpbmcoKSB7XG4gICAgICAgIHJldHVybiBcIkxvZ2ljIFwiICsgdGhpcy5hcmdzLnRvU3RyaW5nKCk7XG4gICAgfVxuXG4gICAgZ2V0TmV3QXJncygpOiBhbnlbXSB7XG4gICAgICAgIHJldHVybiB0aGlzLmFyZ3M7XG4gICAgfVxuXG4gICAgc3RhdGljIGVxdWFscyhhOiBhbnksIGI6IGFueSk6IExvZ2ljIHtcbiAgICAgICAgaWYgKCEoYiBpbnN0YW5jZW9mIGEuY29uc3RydWN0b3IpKSB7XG4gICAgICAgICAgICByZXR1cm4gTG9naWMuRmFsc2U7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBpZiAoYS5hcmdzID09IGIuYXJncykge1xuICAgICAgICAgICAgICAgIHJldHVybiBMb2dpYy5UcnVlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIExvZ2ljLkZhbHNlO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgc3RhdGljIG5vdEVxdWFscyhhOiBhbnksIGI6IGFueSk6IExvZ2ljIHtcbiAgICAgICAgaWYgKCEoYiBpbnN0YW5jZW9mIGEuY29uc3RydWN0b3IpKSB7XG4gICAgICAgICAgICByZXR1cm4gTG9naWMuVHJ1ZTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGlmIChhLmFyZ3MgPT0gYi5hcmdzKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIExvZ2ljLkZhbHNlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIExvZ2ljLlRydWU7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBsZXNzVGhhbihvdGhlcjogT2JqZWN0KTogTG9naWMge1xuICAgICAgICBpZiAodGhpcy5jb21wYXJlKG90aGVyKSA9PSAtMSkge1xuICAgICAgICAgICAgcmV0dXJuIExvZ2ljLlRydWU7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIExvZ2ljLkZhbHNlO1xuICAgIH1cblxuICAgIGNvbXBhcmUob3RoZXI6IGFueSk6IG51bWJlciB7XG4gICAgICAgIGxldCBhOyBsZXQgYjtcbiAgICAgICAgaWYgKHR5cGVvZiB0aGlzICE9IHR5cGVvZiBvdGhlcikge1xuICAgICAgICAgICAgY29uc3QgdW5rU2VsZjogdW5rbm93biA9IDx1bmtub3duPiB0aGlzLmNvbnN0cnVjdG9yO1xuICAgICAgICAgICAgY29uc3QgdW5rT3RoZXI6IHVua25vd24gPSA8dW5rbm93bj4gb3RoZXIuY29uc3RydWN0b3I7XG4gICAgICAgICAgICBhID0gPHN0cmluZz4gdW5rU2VsZjtcbiAgICAgICAgICAgIGIgPSA8c3RyaW5nPiB1bmtPdGhlcjtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGEgPSB0aGlzLmFyZ3M7XG4gICAgICAgICAgICBiID0gb3RoZXIuYXJncztcbiAgICAgICAgfVxuICAgICAgICBpZiAoYSA+IGIpIHtcbiAgICAgICAgICAgIHJldHVybiAxO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuIDA7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBzdGF0aWMgZnJvbXN0cmluZyh0ZXh0OiBzdHJpbmcpIHtcbiAgICAgICAgLyogTG9naWMgZnJvbSBzdHJpbmcgd2l0aCBzcGFjZSBhcm91bmQgJiBhbmQgfCBidXQgbm9uZSBhZnRlciAhLlxuICAgICAgICAgICBlLmcuXG4gICAgICAgICAgICFhICYgYiB8IGNcbiAgICAgICAgKi9cbiAgICAgICAgbGV0IGxleHByID0gbnVsbDsgLy8gY3VycmVudCBsb2dpY2FsIGV4cHJlc3Npb25cbiAgICAgICAgbGV0IHNjaGVkb3AgPSBudWxsOyAvLyBzY2hlZHVsZWQgb3BlcmF0aW9uXG4gICAgICAgIGZvciAoY29uc3QgdGVybSBvZiB0ZXh0LnNwbGl0KFwiIFwiKSkge1xuICAgICAgICAgICAgbGV0IGZsZXhUZXJtOiBzdHJpbmcgfCBMb2dpYyA9IHRlcm07XG4gICAgICAgICAgICAvLyBvcGVyYXRpb24gc3ltYm9sXG4gICAgICAgICAgICBpZiAoXCImfFwiLmluY2x1ZGVzKGZsZXhUZXJtKSkge1xuICAgICAgICAgICAgICAgIGlmIChzY2hlZG9wICE9IG51bGwpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiZG91YmxlIG9wIGZvcmJpZGRlbiBcIiArIGZsZXhUZXJtICsgXCIgXCIgKyBzY2hlZG9wKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgaWYgKGxleHByID09IG51bGwpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKGZsZXhUZXJtICsgXCIgY2Fubm90IGJlIGluIHRoZSBiZWdpbm5pbmcgb2YgZXhwcmVzc2lvblwiKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgc2NoZWRvcCA9IGZsZXhUZXJtO1xuICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKGZsZXhUZXJtLmluY2x1ZGVzKFwifFwiKSB8fCBmbGV4VGVybS5pbmNsdWRlcyhcIiZcIikpIHtcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCImIGFuZCB8IG11c3QgaGF2ZSBzcGFjZSBhcm91bmQgdGhlbVwiKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChmbGV4VGVybVswXSA9PSBcIiFcIikge1xuICAgICAgICAgICAgICAgIGlmIChmbGV4VGVybS5sZW5ndGggPT0gMSkge1xuICAgICAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJkbyBub3QgaW5jbHVkZSBzcGFjZSBhZnRlciAhXCIpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBmbGV4VGVybSA9IE5vdC5OZXcoZmxleFRlcm0uc3Vic3RyaW5nKDEpKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIC8vIGFscmVhZHkgc2NoZWR1bGVkIG9wZXJhdGlvbiwgZS5nLiAnJidcbiAgICAgICAgICAgIGlmIChzY2hlZG9wKSB7XG4gICAgICAgICAgICAgICAgbGV4cHIgPSBMb2dpYy5vcF8yY2xhc3Nbc2NoZWRvcF0obGV4cHIsIGZsZXhUZXJtKTtcbiAgICAgICAgICAgICAgICBzY2hlZG9wID0gbnVsbDtcbiAgICAgICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIC8vIHRoaXMgc2hvdWxkIGJlIGF0b21cbiAgICAgICAgICAgIGlmIChsZXhwciAhPSBudWxsKSB7XG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwibWlzc2luZyBvcCBiZXR3ZWVuIFwiICsgbGV4cHIgKyBcIiBhbmQgXCIgKyBmbGV4VGVybSApO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgbGV4cHIgPSBmbGV4VGVybTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIGxldCdzIGNoZWNrIHRoYXQgd2UgZW5kZWQgdXAgaW4gY29ycmVjdCBzdGF0ZVxuICAgICAgICBpZiAoc2NoZWRvcCAhPSBudWxsKSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJwcmVtYXR1cmUgZW5kLW9mLWV4cHJlc3Npb24gaW4gXCIgKyB0ZXh0KTtcbiAgICAgICAgfVxuICAgICAgICBpZiAobGV4cHIgPT0gbnVsbCkge1xuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKHRleHQgKyBcIiBpcyBlbXB0eVwiKTtcbiAgICAgICAgfVxuICAgICAgICAvLyBldmVyeXRoaW5nIGxvb2tzIGdvb2Qgbm93XG4gICAgICAgIHJldHVybiBsZXhwcjtcbiAgICB9XG59XG5cbmNsYXNzIFRydWUgZXh0ZW5kcyBMb2dpYyB7XG4gICAgX2V2YWxfcHJvcGFnYXRlX25vdCgpOiBhbnkge1xuICAgICAgICByZXR1cm4gRmFsc2UuRmFsc2U7XG4gICAgfVxuXG4gICAgZXhwYW5kKCk6IGFueSB7XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cbn1cblxuY2xhc3MgRmFsc2UgZXh0ZW5kcyBMb2dpYyB7XG4gICAgX2V2YWxfcHJvcGFnYXRlX25vdCgpOiBhbnkge1xuICAgICAgICByZXR1cm4gVHJ1ZS5UcnVlO1xuICAgIH1cblxuICAgIGV4cGFuZCgpOiBhbnkge1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9XG59XG5cblxuY2xhc3MgQW5kT3JfQmFzZSBleHRlbmRzIExvZ2ljIHtcbiAgICBzdGF0aWMgX19uZXdfXyhjbHM6IGFueSwgLi4uYXJnczogYW55W10pIHtcbiAgICAgICAgY29uc3QgYmFyZ3M6IGFueVtdID0gW107XG4gICAgICAgIGZvciAoY29uc3QgYSBvZiBhcmdzKSB7XG4gICAgICAgICAgICBpZiAoYSA9PSBjbHMuZ2V0X29wX3hfbm90eCgpKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGE7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKGEgPT0gIShjbHMuZ2V0X29wX3hfbm90eCgpKSkge1xuICAgICAgICAgICAgICAgIGNvbnRpbnVlOyAvLyBza2lwIHRoaXMgYXJndW1lbnRcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGJhcmdzLnB1c2goYSk7XG4gICAgICAgIH1cblxuICAgICAgICAvLyBwcmV2IHZlcnNpb246IGFyZ3MgPSBzb3J0ZWQoc2V0KHRoaXMuZmxhdHRlbihiYXJncykpLCBrZXk9aGFzaClcbiAgICAgICAgLy8gd2UgdGhpbmsgd2UgZG9uJ3QgbmVlZCB0aGUgc29ydCBhbmQgc2V0XG4gICAgICAgIGFyZ3MgPSBBbmRPcl9CYXNlLmZsYXR0ZW4oYmFyZ3MpO1xuXG4gICAgICAgIC8vIGNyZWF0aW5nIGEgc2V0IHdpdGggaGFzaCBrZXlzIGZvciBhcmdzXG4gICAgICAgIGNvbnN0IGFyZ3Nfc2V0ID0gbmV3IFNldChhcmdzLm1hcCgoZSkgPT4gVXRpbC5oYXNoS2V5KGUpKSk7XG5cbiAgICAgICAgZm9yIChjb25zdCBhIG9mIGFyZ3MpIHtcbiAgICAgICAgICAgIGlmIChhcmdzX3NldC5oYXMoKE5vdC5OZXcoYSkpLmhhc2hLZXkoKSkpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gY2xzLmdldF9vcF94X25vdHgoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChhcmdzLmxlbmd0aCA9PSAxKSB7XG4gICAgICAgICAgICByZXR1cm4gYXJncy5wb3AoKTtcbiAgICAgICAgfSBlbHNlIGlmIChhcmdzLmxlbmd0aCA9PSAwKSB7XG4gICAgICAgICAgICBpZiAoY2xzLmdldF9vcF94X25vdHgoKSBpbnN0YW5jZW9mIFRydWUpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gTG9naWMuRmFsc2U7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gTG9naWMuVHJ1ZTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBzdXBlci5fX25ld19fKGNscywgLi4uYXJncyk7XG4gICAgfVxuXG4gICAgc3RhdGljIGZsYXR0ZW4oYXJnczogYW55W10pOiBhbnlbXSB7XG4gICAgICAgIC8vIHF1aWNrLW4tZGlydHkgZmxhdHRlbmluZyBmb3IgQW5kIGFuZCBPclxuICAgICAgICBjb25zdCBhcmdzX3F1ZXVlOiBhbnlbXSA9IFsuLi5hcmdzXTtcbiAgICAgICAgY29uc3QgcmVzID0gW107XG4gICAgICAgIHdoaWxlIChhcmdzX3F1ZXVlLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgIGNvbnN0IGFyZzogYW55ID0gYXJnc19xdWV1ZS5wb3AoKTtcbiAgICAgICAgICAgIGlmIChhcmcgaW5zdGFuY2VvZiBMb2dpYykge1xuICAgICAgICAgICAgICAgIGlmIChhcmcgaW5zdGFuY2VvZiB0aGlzKSB7XG4gICAgICAgICAgICAgICAgICAgIGFyZ3NfcXVldWUucHVzaChhcmcuYXJncyk7XG4gICAgICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJlcy5wdXNoKGFyZyk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHJlcztcbiAgICB9XG59XG5cbmNsYXNzIEFuZCBleHRlbmRzIEFuZE9yX0Jhc2Uge1xuICAgIHN0YXRpYyBOZXcoLi4uYXJnczogYW55W10pIHtcbiAgICAgICAgcmV0dXJuIHN1cGVyLl9fbmV3X18oQW5kLCBhcmdzKTtcbiAgICB9XG5cbiAgICBnZXRfb3BfeF9ub3R4KCk6IExvZ2ljIHtcbiAgICAgICAgcmV0dXJuIExvZ2ljLkZhbHNlO1xuICAgIH1cblxuICAgIF9ldmFsX3Byb3BhZ2F0ZV9ub3QoKTogT3Ige1xuICAgICAgICAvLyAhIChhJmImYyAuLi4pID09ICFhIHwgIWIgfCAhYyAuLi5cbiAgICAgICAgY29uc3QgcGFyYW06IGFueVtdID0gW107XG4gICAgICAgIGZvciAoY29uc3QgYSBvZiBwYXJhbSkge1xuICAgICAgICAgICAgcGFyYW0ucHVzaChOb3QuTmV3KGEpKTsgLy8gPz9cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gT3IuTmV3KC4uLnBhcmFtKTsgLy8gPz8/XG4gICAgfVxuXG4gICAgLy8gKGF8YnwuLi4pICYgYyA9PSAoYSZjKSB8IChiJmMpIHwgLi4uXG4gICAgZXhwYW5kKCk6IGFueSB7XG4gICAgICAgIC8vIGZpcnN0IGxvY2F0ZSBPclxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMuYXJncy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgY29uc3QgYXJnID0gdGhpcy5hcmdzW2ldO1xuICAgICAgICAgICAgaWYgKGFyZyBpbnN0YW5jZW9mIE9yKSB7XG4gICAgICAgICAgICAgICAgLy8gY29weSBvZiB0aGlzLmFyZ3Mgd2l0aCBhcmcgYXQgcG9zaXRpb24gaSByZW1vdmVkXG5cbiAgICAgICAgICAgICAgICBjb25zdCBhcmVzdCA9IFsuLi50aGlzLmFyZ3NdLnNwbGljZShpLCAxKTtcblxuICAgICAgICAgICAgICAgIC8vIHN0ZXAgYnkgc3RlcCB2ZXJzaW9uIG9mIHRoZSBtYXAgYmVsb3dcbiAgICAgICAgICAgICAgICAvKlxuICAgICAgICAgICAgICAgIGxldCBvcnRlcm1zID0gW107XG4gICAgICAgICAgICAgICAgZm9yIChsZXQgYSBvZiBhcmcuYXJncykge1xuICAgICAgICAgICAgICAgICAgICBvcnRlcm1zLnB1c2gobmV3IEFuZCguLi5hcmVzdC5jb25jYXQoW2FdKSkpXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICovXG5cbiAgICAgICAgICAgICAgICBjb25zdCBvcnRlcm1zID0gYXJnLmFyZ3MubWFwKChlKSA9PiBBbmQuTmV3KC4uLmFyZXN0LmNvbmNhdChbZV0pKSk7XG5cblxuICAgICAgICAgICAgICAgIGZvciAobGV0IGogPSAwOyBqIDwgb3J0ZXJtcy5sZW5ndGg7IGorKykge1xuICAgICAgICAgICAgICAgICAgICBpZiAob3J0ZXJtc1tqXSBpbnN0YW5jZW9mIExvZ2ljKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBvcnRlcm1zW2pdID0gb3J0ZXJtc1tqXS5leHBhbmQoKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBjb25zdCByZXMgPSBPci5OZXcoLi4ub3J0ZXJtcyk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHJlcztcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9XG59XG5cbmNsYXNzIE9yIGV4dGVuZHMgQW5kT3JfQmFzZSB7XG4gICAgc3RhdGljIE5ldyguLi5hcmdzOiBhbnlbXSkge1xuICAgICAgICByZXR1cm4gc3VwZXIuX19uZXdfXyhPciwgYXJncyk7XG4gICAgfVxuXG4gICAgZ2V0X29wX3hfbm90eCgpOiBMb2dpYyB7XG4gICAgICAgIHJldHVybiBMb2dpYy5UcnVlO1xuICAgIH1cblxuICAgIF9ldmFsX3Byb3BhZ2F0ZV9ub3QoKTogQW5kIHtcbiAgICAgICAgLy8gISAoYSZiJmMgLi4uKSA9PSAhYSB8ICFiIHwgIWMgLi4uXG4gICAgICAgIGNvbnN0IHBhcmFtOiBhbnlbXSA9IFtdO1xuICAgICAgICBmb3IgKGNvbnN0IGEgb2YgcGFyYW0pIHtcbiAgICAgICAgICAgIHBhcmFtLnB1c2goTm90Lk5ldyhhKSk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIEFuZC5OZXcoLi4ucGFyYW0pO1xuICAgIH1cbn1cblxuY2xhc3MgTm90IGV4dGVuZHMgTG9naWMge1xuICAgIHN0YXRpYyBOZXcoYXJnczogYW55KSB7XG4gICAgICAgIHJldHVybiBOb3QuX19uZXdfXyhOb3QsIGFyZ3MpO1xuICAgIH1cblxuICAgIHN0YXRpYyBfX25ld19fKGNsczogYW55LCBhcmc6IGFueSkge1xuICAgICAgICBpZiAodHlwZW9mIGFyZyA9PT0gXCJzdHJpbmdcIikge1xuICAgICAgICAgICAgcmV0dXJuIHN1cGVyLl9fbmV3X18oY2xzLCBhcmcpO1xuICAgICAgICB9IGVsc2UgaWYgKGFyZyBpbnN0YW5jZW9mIFRydWUpIHtcbiAgICAgICAgICAgIHJldHVybiBMb2dpYy5GYWxzZTtcbiAgICAgICAgfSBlbHNlIGlmIChhcmcgaW5zdGFuY2VvZiBGYWxzZSkge1xuICAgICAgICAgICAgcmV0dXJuIExvZ2ljLlRydWU7XG4gICAgICAgIH0gZWxzZSBpZiAoYXJnIGluc3RhbmNlb2YgTm90KSB7XG4gICAgICAgICAgICByZXR1cm4gYXJnLmFyZ3NbMF07XG4gICAgICAgIH0gZWxzZSBpZiAoYXJnIGluc3RhbmNlb2YgTG9naWMpIHtcbiAgICAgICAgICAgIC8vIFhYWCB0aGlzIGlzIGEgaGFjayB0byBleHBhbmQgcmlnaHQgZnJvbSB0aGUgYmVnaW5uaW5nXG4gICAgICAgICAgICBhcmcgPSBhcmcuX2V2YWxfcHJvcGFnYXRlX25vdCgpO1xuICAgICAgICAgICAgcmV0dXJuIGFyZztcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcIk5vdDogdW5rbm93biBhcmd1bWVudCBcIiArIGFyZyk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBhcmcoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmFyZ3NbMF07XG4gICAgfVxufVxuXG5Mb2dpYy5UcnVlID0gbmV3IFRydWUoKTtcbkxvZ2ljLkZhbHNlID0gbmV3IEZhbHNlKCk7XG5cbmV4cG9ydCB7TG9naWMsIFRydWUsIEZhbHNlLCBBbmQsIE9yLCBOb3QsIGZ1enp5X2Jvb2wsIGZ1enp5X2FuZCwgZnV6enlfYm9vbF92MiwgZnV6enlfYW5kX3YyfTtcblxuXG4iLCAiLyogZXNsaW50LWRpc2FibGUgbmV3LWNhcCAqL1xuLyogVGhpcyBpcyBydWxlLWJhc2VkIGRlZHVjdGlvbiBzeXN0ZW0gZm9yIFN5bVB5XG5UaGUgd2hvbGUgdGhpbmcgaXMgc3BsaXQgaW50byB0d28gcGFydHNcbiAtIHJ1bGVzIGNvbXBpbGF0aW9uIGFuZCBwcmVwYXJhdGlvbiBvZiB0YWJsZXNcbiAtIHJ1bnRpbWUgaW5mZXJlbmNlXG5Gb3IgcnVsZS1iYXNlZCBpbmZlcmVuY2UgZW5naW5lcywgdGhlIGNsYXNzaWNhbCB3b3JrIGlzIFJFVEUgYWxnb3JpdGhtIFsxXSxcblsyXSBBbHRob3VnaCB3ZSBhcmUgbm90IGltcGxlbWVudGluZyBpdCBpbiBmdWxsIChvciBldmVuIHNpZ25pZmljYW50bHkpXG5pdCdzIHN0aWxsIHdvcnRoIGEgcmVhZCB0byB1bmRlcnN0YW5kIHRoZSB1bmRlcmx5aW5nIGlkZWFzLlxuSW4gc2hvcnQsIGV2ZXJ5IHJ1bGUgaW4gYSBzeXN0ZW0gb2YgcnVsZXMgaXMgb25lIG9mIHR3byBmb3JtczpcbiAtIGF0b20gICAgICAgICAgICAgICAgICAgICAtPiAuLi4gICAgICAoYWxwaGEgcnVsZSlcbiAtIEFuZChhdG9tMSwgYXRvbTIsIC4uLikgICAtPiAuLi4gICAgICAoYmV0YSBydWxlKVxuVGhlIG1ham9yIGNvbXBsZXhpdHkgaXMgaW4gZWZmaWNpZW50IGJldGEtcnVsZXMgcHJvY2Vzc2luZyBhbmQgdXN1YWxseSBmb3IgYW5cbmV4cGVydCBzeXN0ZW0gYSBsb3Qgb2YgZWZmb3J0IGdvZXMgaW50byBjb2RlIHRoYXQgb3BlcmF0ZXMgb24gYmV0YS1ydWxlcy5cbkhlcmUgd2UgdGFrZSBtaW5pbWFsaXN0aWMgYXBwcm9hY2ggdG8gZ2V0IHNvbWV0aGluZyB1c2FibGUgZmlyc3QuXG4gLSAocHJlcGFyYXRpb24pICAgIG9mIGFscGhhLSBhbmQgYmV0YS0gbmV0d29ya3MsIGV2ZXJ5dGhpbmcgZXhjZXB0XG4gLSAocnVudGltZSkgICAgICAgIEZhY3RSdWxlcy5kZWR1Y2VfYWxsX2ZhY3RzXG4gICAgICAgICAgICAgX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX1xuICAgICAgICAgICAgKCBLaXJyOiBJJ3ZlIG5ldmVyIHRob3VnaHQgdGhhdCBkb2luZyApXG4gICAgICAgICAgICAoIGxvZ2ljIHN0dWZmIGlzIHRoYXQgZGlmZmljdWx0Li4uICAgIClcbiAgICAgICAgICAgICAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgICAgICAgICAgICAgICAgIG8gICBeX19eXG4gICAgICAgICAgICAgICAgICAgICBvICAob28pXFxfX19fX19fXG4gICAgICAgICAgICAgICAgICAgICAgICAoX18pXFwgICAgICAgKVxcL1xcXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfHwtLS0tdyB8XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfHwgICAgIHx8XG5Tb21lIHJlZmVyZW5jZXMgb24gdGhlIHRvcGljXG4tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5bMV0gaHR0cHM6Ly9lbi53aWtpcGVkaWEub3JnL3dpa2kvUmV0ZV9hbGdvcml0aG1cblsyXSBodHRwOi8vcmVwb3J0cy1hcmNoaXZlLmFkbS5jcy5jbXUuZWR1L2Fub24vMTk5NS9DTVUtQ1MtOTUtMTEzLnBkZlxuaHR0cHM6Ly9lbi53aWtpcGVkaWEub3JnL3dpa2kvUHJvcG9zaXRpb25hbF9mb3JtdWxhXG5odHRwczovL2VuLndpa2lwZWRpYS5vcmcvd2lraS9JbmZlcmVuY2VfcnVsZVxuaHR0cHM6Ly9lbi53aWtpcGVkaWEub3JnL3dpa2kvTGlzdF9vZl9ydWxlc19vZl9pbmZlcmVuY2VcbiovXG5cbi8qXG5cblNpZ25pZmljYW50IGNoYW5nZXMgbWFkZSAoV0IgYW5kIEdNKTpcbi0gQ3JlYXRlZCB0aGUgSW1wbGljYXRpb24gY2xhc3MsIHVzZSB0byByZXByZXNlbnQgdGhlIGltcGxpY2F0aW9uIHAgLT4gcSB3aGljaFxuICBpcyBzdG9yZWQgYXMgYSB0dXBsZSBpbiBzeW1weVxuLSBDcmVhdGVkIHRoZSBTZXREZWZhdWx0RGljdCwgSGFzaERpY3QgYW5kIEhhc2hTZXQgY2xhc3Nlcy4gU2V0RGVmYXVsdERpY3QgYWN0c1xuICBhcyBhIHJlcGxjYWNlbWVudCBkZWZhdWx0ZGljdChzZXQpLCBhbmQgSGFzaERpY3QgYW5kIEhhc2hTZXQgcmVwbGFjZSB0aGVcbiAgZGljdCBhbmQgc2V0IGNsYXNzZXMuXG4tIEFkZGVkIGlzU3Vic2V0KCkgdG8gdGhlIHV0aWxpdHkgY2xhc3MgdG8gaGVscCB3aXRoIHRoaXMgcHJvZ3JhbVxuXG4qL1xuXG5cbmltcG9ydCB7U3RkRmFjdEtCfSBmcm9tIFwiLi9hc3N1bXB0aW9ucy5qc1wiO1xuaW1wb3J0IHtMb2dpYywgVHJ1ZSwgRmFsc2UsIEFuZCwgT3IsIE5vdH0gZnJvbSBcIi4vbG9naWMuanNcIjtcblxuaW1wb3J0IHtVdGlsLCBIYXNoU2V0LCBTZXREZWZhdWx0RGljdCwgSGFzaERpY3QsIEltcGxpY2F0aW9ufSBmcm9tIFwiLi91dGlsaXR5LmpzXCI7XG5cblxuZnVuY3Rpb24gX2Jhc2VfZmFjdChhdG9tOiBhbnkpIHtcbiAgICAvKiAgUmV0dXJuIHRoZSBsaXRlcmFsIGZhY3Qgb2YgYW4gYXRvbS5cbiAgICBFZmZlY3RpdmVseSwgdGhpcyBtZXJlbHkgc3RyaXBzIHRoZSBOb3QgYXJvdW5kIGEgZmFjdC5cbiAgICAqL1xuICAgIGlmIChhdG9tIGluc3RhbmNlb2YgTm90KSB7XG4gICAgICAgIHJldHVybiBhdG9tLmFyZygpO1xuICAgIH0gZWxzZSB7XG4gICAgICAgIHJldHVybiBhdG9tO1xuICAgIH1cbn1cblxuXG5mdW5jdGlvbiBfYXNfcGFpcihhdG9tOiBhbnkpIHtcbiAgICAvKiAgUmV0dXJuIHRoZSBsaXRlcmFsIGZhY3Qgb2YgYW4gYXRvbS5cbiAgICBFZmZlY3RpdmVseSwgdGhpcyBtZXJlbHkgc3RyaXBzIHRoZSBOb3QgYXJvdW5kIGEgZmFjdC5cbiAgICAqL1xuICAgIGlmIChhdG9tIGluc3RhbmNlb2YgTm90KSB7XG4gICAgICAgIHJldHVybiBuZXcgSW1wbGljYXRpb24oYXRvbS5hcmcoKSwgTG9naWMuRmFsc2UpO1xuICAgIH0gZWxzZSB7XG4gICAgICAgIHJldHVybiBuZXcgSW1wbGljYXRpb24oYXRvbSwgTG9naWMuVHJ1ZSk7XG4gICAgfVxufVxuXG4vLyBYWFggdGhpcyBwcmVwYXJlcyBmb3J3YXJkLWNoYWluaW5nIHJ1bGVzIGZvciBhbHBoYS1uZXR3b3JrXG5cbmZ1bmN0aW9uIHRyYW5zaXRpdmVfY2xvc3VyZShpbXBsaWNhdGlvbnM6IEltcGxpY2F0aW9uW10pIHtcbiAgICAvKlxuICAgIENvbXB1dGVzIHRoZSB0cmFuc2l0aXZlIGNsb3N1cmUgb2YgYSBsaXN0IG9mIGltcGxpY2F0aW9uc1xuICAgIFVzZXMgV2Fyc2hhbGwncyBhbGdvcml0aG0sIGFzIGRlc2NyaWJlZCBhdFxuICAgIGh0dHA6Ly93d3cuY3MuaG9wZS5lZHUvfmN1c2Fjay9Ob3Rlcy9Ob3Rlcy9EaXNjcmV0ZU1hdGgvV2Fyc2hhbGwucGRmLlxuICAgICovXG5cbiAgICBjb25zdCBmdWxsX2ltcGxpY2F0aW9ucyA9IG5ldyBIYXNoU2V0KGltcGxpY2F0aW9ucyk7XG4gICAgY29uc3QgbGl0ZXJhbHMgPSBuZXcgU2V0KGltcGxpY2F0aW9ucy5mbGF0KCkpO1xuXG4gICAgZm9yIChjb25zdCBrIG9mIGxpdGVyYWxzKSB7XG4gICAgICAgIGZvciAoY29uc3QgaSBvZiBsaXRlcmFscykge1xuICAgICAgICAgICAgaWYgKGZ1bGxfaW1wbGljYXRpb25zLmhhcyhuZXcgSW1wbGljYXRpb24oaSwgaykpKSB7XG4gICAgICAgICAgICAgICAgZm9yIChjb25zdCBqIG9mIGxpdGVyYWxzKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChmdWxsX2ltcGxpY2F0aW9ucy5oYXMobmV3IEltcGxpY2F0aW9uKGssIGopKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgZnVsbF9pbXBsaWNhdGlvbnMuYWRkKG5ldyBJbXBsaWNhdGlvbihpLCBqKSk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIGZ1bGxfaW1wbGljYXRpb25zO1xufVxuXG5cbmZ1bmN0aW9uIGRlZHVjZV9hbHBoYV9pbXBsaWNhdGlvbnMoaW1wbGljYXRpb25zOiBJbXBsaWNhdGlvbltdKSB7XG4gICAgLyogZGVkdWNlIGFsbCBpbXBsaWNhdGlvbnNcbiAgICAgICBEZXNjcmlwdGlvbiBieSBleGFtcGxlXG4gICAgICAgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgICAgIGdpdmVuIHNldCBvZiBsb2dpYyBydWxlczpcbiAgICAgICAgIGEgLT4gYlxuICAgICAgICAgYiAtPiBjXG4gICAgICAgd2UgZGVkdWNlIGFsbCBwb3NzaWJsZSBydWxlczpcbiAgICAgICAgIGEgLT4gYiwgY1xuICAgICAgICAgYiAtPiBjXG4gICAgICAgaW1wbGljYXRpb25zOiBbXSBvZiAoYSxiKVxuICAgICAgIHJldHVybjogICAgICAge30gb2YgYSAtPiBzZXQoW2IsIGMsIC4uLl0pXG4gICAgICAgKi9cbiAgICBjb25zdCBuZXdfYXJyOiBhbnlbXSA9IFtdO1xuICAgIGZvciAoY29uc3QgaW1wbCBvZiBpbXBsaWNhdGlvbnMpIHtcbiAgICAgICAgbmV3X2Fyci5wdXNoKG5ldyBJbXBsaWNhdGlvbihOb3QuTmV3KGltcGwucSksIE5vdC5OZXcoaW1wbC5wKSkpO1xuICAgIH1cbiAgICBpbXBsaWNhdGlvbnMgPSBpbXBsaWNhdGlvbnMuY29uY2F0KG5ld19hcnIpO1xuICAgIGNvbnN0IHJlcyA9IG5ldyBTZXREZWZhdWx0RGljdCgpO1xuICAgIGNvbnN0IGZ1bGxfaW1wbGljYXRpb25zID0gdHJhbnNpdGl2ZV9jbG9zdXJlKGltcGxpY2F0aW9ucyk7XG4gICAgZm9yIChjb25zdCBpbXBsIG9mIGZ1bGxfaW1wbGljYXRpb25zLnRvQXJyYXkoKSkge1xuICAgICAgICBpZiAoaW1wbC5wID09PSBpbXBsLnEpIHtcbiAgICAgICAgICAgIGNvbnRpbnVlOyAvLyBza2lwIGEtPmEgY3ljbGljIGlucHV0XG4gICAgICAgIH1cbiAgICAgICAgY29uc3QgY3VyclNldCA9IHJlcy5nZXQoaW1wbC5wKTtcbiAgICAgICAgY3VyclNldC5hZGQoaW1wbC5xKTtcbiAgICAgICAgcmVzLmFkZChpbXBsLnAsIGN1cnJTZXQpO1xuICAgIH1cbiAgICAvLyBDbGVhbiB1cCB0YXV0b2xvZ2llcyBhbmQgY2hlY2sgY29uc2lzdGVuY3lcbiAgICAvLyBpbXBsIGlzIHRoZSBzZXRcbiAgICBmb3IgKGNvbnN0IGl0ZW0gb2YgcmVzLmVudHJpZXMoKSkge1xuICAgICAgICBjb25zdCBhID0gaXRlbVswXTtcbiAgICAgICAgY29uc3QgaW1wbDogSGFzaFNldCA9IGl0ZW1bMV07XG4gICAgICAgIGltcGwucmVtb3ZlKGEpO1xuICAgICAgICBjb25zdCBuYSA9IE5vdC5OZXcoYSk7XG4gICAgICAgIGlmIChpbXBsLmhhcyhuYSkpIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcImltcGxpY2F0aW9ucyBhcmUgaW5jb25zaXN0ZW50OiBcIiArIGEgKyBcIiAtPiBcIiArIG5hICsgXCIgXCIgKyBpbXBsKTtcbiAgICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gcmVzO1xufVxuXG5mdW5jdGlvbiBhcHBseV9iZXRhX3RvX2FscGhhX3JvdXRlKGFscGhhX2ltcGxpY2F0aW9uczogSGFzaERpY3QsIGJldGFfcnVsZXM6IGFueVtdKSB7XG4gICAgLyogYXBwbHkgYWRkaXRpb25hbCBiZXRhLXJ1bGVzIChBbmQgY29uZGl0aW9ucykgdG8gYWxyZWFkeS1idWlsdFxuICAgIGFscGhhIGltcGxpY2F0aW9uIHRhYmxlc1xuICAgICAgIFRPRE86IHdyaXRlIGFib3V0XG4gICAgICAgLSBzdGF0aWMgZXh0ZW5zaW9uIG9mIGFscGhhLWNoYWluc1xuICAgICAgIC0gYXR0YWNoaW5nIHJlZnMgdG8gYmV0YS1ub2RlcyB0byBhbHBoYSBjaGFpbnNcbiAgICAgICBlLmcuXG4gICAgICAgYWxwaGFfaW1wbGljYXRpb25zOlxuICAgICAgIGEgIC0+ICBbYiwgIWMsIGRdXG4gICAgICAgYiAgLT4gIFtkXVxuICAgICAgIC4uLlxuICAgICAgIGJldGFfcnVsZXM6XG4gICAgICAgJihiLGQpIC0+IGVcbiAgICAgICB0aGVuIHdlJ2xsIGV4dGVuZCBhJ3MgcnVsZSB0byB0aGUgZm9sbG93aW5nXG4gICAgICAgYSAgLT4gIFtiLCAhYywgZCwgZV1cbiAgICAqL1xuXG4gICAgLy8gaXMgYmV0YV9ydWxlcyBhbiBhcnJheSBvciBhIGRpY3Rpb25hcnk/XG5cbiAgICBjb25zdCB4X2ltcGw6IEhhc2hEaWN0ID0gbmV3IEhhc2hEaWN0KCk7XG4gICAgZm9yIChjb25zdCB4IG9mIGFscGhhX2ltcGxpY2F0aW9ucy5rZXlzKCkpIHtcbiAgICAgICAgY29uc3QgbmV3c2V0ID0gbmV3IEhhc2hTZXQoKTtcbiAgICAgICAgbmV3c2V0LmFkZChhbHBoYV9pbXBsaWNhdGlvbnMuZ2V0KHgpKTtcbiAgICAgICAgY29uc3QgaW1wID0gbmV3IEltcGxpY2F0aW9uKG5ld3NldCwgW10pO1xuICAgICAgICB4X2ltcGwuYWRkKHgsIGltcCk7XG4gICAgfVxuICAgIGZvciAoY29uc3QgaXRlbSBvZiBiZXRhX3J1bGVzKSB7XG4gICAgICAgIGNvbnN0IGJjb25kID0gaXRlbVswXTtcbiAgICAgICAgZm9yIChjb25zdCBiayBvZiBiY29uZC5hcmdzKSB7XG4gICAgICAgICAgICBpZiAoeF9pbXBsLmhhcyhiaykpIHtcbiAgICAgICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGNvbnN0IGltcCA9IG5ldyBJbXBsaWNhdGlvbihuZXcgSGFzaFNldCgpLCBbXSk7XG4gICAgICAgICAgICB4X2ltcGwuYWRkKGltcC5wLCBpbXAucSk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgLy8gc3RhdGljIGV4dGVuc2lvbnMgdG8gYWxwaGEgcnVsZXM6XG4gICAgLy8gQTogeCAtPiBhLGIgICBCOiAmKGEsYikgLT4gYyAgPT0+ICBBOiB4IC0+IGEsYixjXG5cbiAgICBsZXQgc2Vlbl9zdGF0aWNfZXh0ZW5zaW9uOiBMb2dpYyA9IExvZ2ljLlRydWU7XG4gICAgd2hpbGUgKHNlZW5fc3RhdGljX2V4dGVuc2lvbiBpbnN0YW5jZW9mIFRydWUpIHtcbiAgICAgICAgc2Vlbl9zdGF0aWNfZXh0ZW5zaW9uID0gTG9naWMuRmFsc2U7XG5cbiAgICAgICAgZm9yIChjb25zdCBpbXBsIG9mIGJldGFfcnVsZXMpIHtcbiAgICAgICAgICAgIGNvbnN0IGJjb25kID0gaW1wbC5wO1xuICAgICAgICAgICAgY29uc3QgYmltcGwgPSBpbXBsLnE7XG4gICAgICAgICAgICBpZiAoIShiY29uZCBpbnN0YW5jZW9mIEFuZCkpIHtcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJDb25kIGlzIG5vdCBBbmRcIik7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBjb25zdCBiYXJncyA9IG5ldyBIYXNoU2V0KGJjb25kLmFyZ3MpO1xuICAgICAgICAgICAgZm9yIChjb25zdCBpdGVtIG9mIHhfaW1wbC5lbnRyaWVzKCkpIHtcbiAgICAgICAgICAgICAgICBjb25zdCB4ID0gaXRlbVswXTtcbiAgICAgICAgICAgICAgICBjb25zdCBpbXBsID0gaXRlbVsxXTtcbiAgICAgICAgICAgICAgICBsZXQgeGltcGxzID0gaW1wbC5wO1xuICAgICAgICAgICAgICAgIGNvbnN0IHhfYWxsID0geGltcGxzLmNsb25lKCkuYWRkKHgpO1xuICAgICAgICAgICAgICAgIC8vIEE6IC4uLiAtPiBhICAgQjogJiguLi4pIC0+IGEgIGlzIG5vbi1pbmZvcm1hdGl2ZVxuICAgICAgICAgICAgICAgIGlmICghKHhfYWxsLmluY2x1ZGVzKGJpbXBsKSkgJiYgVXRpbC5pc1N1YnNldChiYXJncy50b0FycmF5KCksIHhfYWxsKSkge1xuICAgICAgICAgICAgICAgICAgICB4aW1wbHMuYWRkKGJpbXBsKTtcblxuICAgICAgICAgICAgICAgICAgICAvLyB3ZSBpbnRyb2R1Y2VkIG5ldyBpbXBsaWNhdGlvbiAtIG5vdyB3ZSBoYXZlIHRvIHJlc3RvcmVcbiAgICAgICAgICAgICAgICAgICAgLy8gY29tcGxldGVuZXNzIG9mIHRoZSB3aG9sZSBzZXQuXG5cbiAgICAgICAgICAgICAgICAgICAgY29uc3QgYmltcGxfaW1wbCA9IHhfaW1wbC5nZXQoYmltcGwpO1xuICAgICAgICAgICAgICAgICAgICBpZiAoYmltcGxfaW1wbCAhPSBudWxsKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB4aW1wbHMgfD0gYmltcGxfaW1wbFswXTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBzZWVuX3N0YXRpY19leHRlbnNpb24gPSBMb2dpYy5UcnVlO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cbiAgICAvLyBhdHRhY2ggYmV0YS1ub2RlcyB3aGljaCBjYW4gYmUgcG9zc2libHkgdHJpZ2dlcmVkIGJ5IGFuIGFscGhhLWNoYWluXG4gICAgZm9yIChsZXQgYmlkeCA9IDA7IGJpZHggPCBiZXRhX3J1bGVzLmxlbmd0aDsgYmlkeCsrKSB7XG4gICAgICAgIGNvbnN0IGltcGwgPSBiZXRhX3J1bGVzW2JpZHhdO1xuICAgICAgICBjb25zdCBiY29uZCA9IGltcGwucDtcbiAgICAgICAgY29uc3QgYmltcGwgPSBpbXBsLnE7XG4gICAgICAgIGNvbnN0IGJhcmdzID0gbmV3IEhhc2hTZXQoYmNvbmQuYXJncyk7XG4gICAgICAgIGZvciAoY29uc3QgaXRlbSBvZiB4X2ltcGwuZW50cmllcygpKSB7XG4gICAgICAgICAgICBjb25zdCB4ID0gaXRlbVswXTtcbiAgICAgICAgICAgIGNvbnN0IHZhbHVlOiBJbXBsaWNhdGlvbiA9IGl0ZW1bMV07XG4gICAgICAgICAgICBjb25zdCB4aW1wbHMgPSB2YWx1ZS5wO1xuICAgICAgICAgICAgY29uc3QgYmIgPSB2YWx1ZS5xO1xuICAgICAgICAgICAgY29uc3QgeF9hbGwgPSB4aW1wbHMuY2xvbmUoKS5hZGQoeCk7XG4gICAgICAgICAgICBpZiAoeF9hbGwuaGFzKGJpbXBsKSkge1xuICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgLy8gQTogeCAtPiBhLi4uICBCOiAmKCFhLC4uLikgLT4gLi4uICh3aWxsIG5ldmVyIHRyaWdnZXIpXG4gICAgICAgICAgICAvLyBBOiB4IC0+IGEuLi4gIEI6ICYoLi4uKSAtPiAhYSAgICAgKHdpbGwgbmV2ZXIgdHJpZ2dlcilcbiAgICAgICAgICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBuZXctY2FwXG4gICAgICAgICAgICBpZiAoeF9hbGwuc29tZSgoZTogYW55KSA9PiAoYmFyZ3MuaGFzKE5vdC5OZXcoZSkpIHx8IE5vdC5OZXcoZSkgPT09IGJpbXBsKSkpIHtcbiAgICAgICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChiYXJncyAmJiB4X2FsbCkge1xuICAgICAgICAgICAgICAgIGJiLnB1c2goYmlkeCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIHhfaW1wbDtcbn1cblxuXG5mdW5jdGlvbiBydWxlc18ycHJlcmVxKHJ1bGVzOiBTZXREZWZhdWx0RGljdCkge1xuICAgIC8qIGJ1aWxkIHByZXJlcXVpc2l0ZXMgdGFibGUgZnJvbSBydWxlc1xuICAgICAgIERlc2NyaXB0aW9uIGJ5IGV4YW1wbGVcbiAgICAgICAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgICAgZ2l2ZW4gc2V0IG9mIGxvZ2ljIHJ1bGVzOlxuICAgICAgICAgYSAtPiBiLCBjXG4gICAgICAgICBiIC0+IGNcbiAgICAgICB3ZSBidWlsZCBwcmVyZXF1aXNpdGVzIChmcm9tIHdoYXQgcG9pbnRzIHNvbWV0aGluZyBjYW4gYmUgZGVkdWNlZCk6XG4gICAgICAgICBiIDwtIGFcbiAgICAgICAgIGMgPC0gYSwgYlxuICAgICAgIHJ1bGVzOiAgIHt9IG9mIGEgLT4gW2IsIGMsIC4uLl1cbiAgICAgICByZXR1cm46ICB7fSBvZiBjIDwtIFthLCBiLCAuLi5dXG4gICAgICAgTm90ZSBob3dldmVyLCB0aGF0IHRoaXMgcHJlcmVxdWlzaXRlcyBtYXkgYmUgKm5vdCogZW5vdWdoIHRvIHByb3ZlIGFcbiAgICAgICBmYWN0LiBBbiBleGFtcGxlIGlzICdhIC0+IGInIHJ1bGUsIHdoZXJlIHByZXJlcShhKSBpcyBiLCBhbmQgcHJlcmVxKGIpXG4gICAgICAgaXMgYS4gVGhhdCdzIGJlY2F1c2UgYT1UIC0+IGI9VCwgYW5kIGI9RiAtPiBhPUYsIGJ1dCBhPUYgLT4gYj0/XG4gICAgKi9cblxuICAgIGNvbnN0IHByZXJlcSA9IG5ldyBTZXREZWZhdWx0RGljdCgpO1xuICAgIGZvciAoY29uc3QgaXRlbSBvZiBydWxlcy5lbnRyaWVzKCkpIHtcbiAgICAgICAgbGV0IGEgPSBpdGVtWzBdLnA7XG4gICAgICAgIGNvbnN0IGltcGwgPSBpdGVtWzFdO1xuICAgICAgICBpZiAoYSBpbnN0YW5jZW9mIE5vdCkge1xuICAgICAgICAgICAgYSA9IGEuYXJnc1swXTtcbiAgICAgICAgfVxuICAgICAgICBmb3IgKGNvbnN0IGl0ZW0gb2YgaW1wbC50b0FycmF5KCkpIHtcbiAgICAgICAgICAgIGxldCBpID0gaXRlbS5wO1xuICAgICAgICAgICAgaWYgKGkgaW5zdGFuY2VvZiBOb3QpIHtcbiAgICAgICAgICAgICAgICBpID0gaS5hcmdzWzBdO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcHJlcmVxLmdldChpKS5hZGQoYSk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIHByZXJlcTtcbn1cblxuXG4vLyAvLy8vLy8vLy8vLy8vLy8vXG4vLyBSVUxFUyBQUk9WRVIgLy9cbi8vIC8vLy8vLy8vLy8vLy8vLy9cblxuY2xhc3MgVGF1dG9sb2d5RGV0ZWN0ZWQgZXh0ZW5kcyBFcnJvciB7XG4gICAgYXJncztcblxuICAgIGNvbnN0cnVjdG9yKC4uLmFyZ3M6IGFueVtdKSB7XG4gICAgICAgIHN1cGVyKCk7XG4gICAgICAgIHRoaXMuYXJncyA9IGFyZ3M7XG4gICAgfVxuICAgIC8vIChpbnRlcm5hbCkgUHJvdmVyIHVzZXMgaXQgZm9yIHJlcG9ydGluZyBkZXRlY3RlZCB0YXV0b2xvZ3lcbn1cblxuY2xhc3MgUHJvdmVyIHtcbiAgICAvKiBhaSAtIHByb3ZlciBvZiBsb2dpYyBydWxlc1xuICAgICAgIGdpdmVuIGEgc2V0IG9mIGluaXRpYWwgcnVsZXMsIFByb3ZlciB0cmllcyB0byBwcm92ZSBhbGwgcG9zc2libGUgcnVsZXNcbiAgICAgICB3aGljaCBmb2xsb3cgZnJvbSBnaXZlbiBwcmVtaXNlcy5cbiAgICAgICBBcyBhIHJlc3VsdCBwcm92ZWRfcnVsZXMgYXJlIGFsd2F5cyBlaXRoZXIgaW4gb25lIG9mIHR3byBmb3JtczogYWxwaGEgb3JcbiAgICAgICBiZXRhOlxuICAgICAgIEFscGhhIHJ1bGVzXG4gICAgICAgLS0tLS0tLS0tLS1cbiAgICAgICBUaGlzIGFyZSBydWxlcyBvZiB0aGUgZm9ybTo6XG4gICAgICAgICBhIC0+IGIgJiBjICYgZCAmIC4uLlxuICAgICAgIEJldGEgcnVsZXNcbiAgICAgICAtLS0tLS0tLS0tXG4gICAgICAgVGhpcyBhcmUgcnVsZXMgb2YgdGhlIGZvcm06OlxuICAgICAgICAgJihhLGIsLi4uKSAtPiBjICYgZCAmIC4uLlxuICAgICAgIGkuZS4gYmV0YSBydWxlcyBhcmUgam9pbiBjb25kaXRpb25zIHRoYXQgc2F5IHRoYXQgc29tZXRoaW5nIGZvbGxvd3Mgd2hlblxuICAgICAgICpzZXZlcmFsKiBmYWN0cyBhcmUgdHJ1ZSBhdCB0aGUgc2FtZSB0aW1lLlxuICAgICovXG5cbiAgICBwcm92ZWRfcnVsZXM6IGFueVtdO1xuICAgIF9ydWxlc19zZWVuO1xuXG4gICAgY29uc3RydWN0b3IoKSB7XG4gICAgICAgIHRoaXMucHJvdmVkX3J1bGVzID0gW107XG4gICAgICAgIHRoaXMuX3J1bGVzX3NlZW4gPSBuZXcgSGFzaFNldCgpO1xuICAgIH1cblxuICAgIHNwbGl0X2FscGhhX2JldGEoKSB7XG4gICAgICAgIC8vIHNwbGl0IHByb3ZlZCBydWxlcyBpbnRvIGFscGhhIGFuZCBiZXRhIGNoYWluc1xuICAgICAgICBjb25zdCBydWxlc19hbHBoYSA9IFtdOyAvLyBhICAgICAgLT4gYlxuICAgICAgICBjb25zdCBydWxlc19iZXRhID0gW107IC8vICYoLi4uKSAtPiBiXG4gICAgICAgIGZvciAoY29uc3QgaW1wbCBvZiB0aGlzLnByb3ZlZF9ydWxlcykge1xuICAgICAgICAgICAgY29uc3QgYSA9IGltcGwucDtcbiAgICAgICAgICAgIGNvbnN0IGIgPSBpbXBsLnE7XG4gICAgICAgICAgICBpZiAoYSBpbnN0YW5jZW9mIEFuZCkge1xuICAgICAgICAgICAgICAgIHJ1bGVzX2JldGEucHVzaChuZXcgSW1wbGljYXRpb24oYSwgYikpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBydWxlc19hbHBoYS5wdXNoKG5ldyBJbXBsaWNhdGlvbihhLCBiKSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIFtydWxlc19hbHBoYSwgcnVsZXNfYmV0YV07XG4gICAgfVxuXG4gICAgcnVsZXNfYWxwaGEoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLnNwbGl0X2FscGhhX2JldGEoKVswXTtcbiAgICB9XG5cbiAgICBydWxlc19iZXRhKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5zcGxpdF9hbHBoYV9iZXRhKClbMV07XG4gICAgfVxuXG4gICAgcHJvY2Vzc19ydWxlKGE6IGFueSwgYjogYW55KSB7XG4gICAgICAgIC8vIHByb2Nlc3MgYSAtPiBiIHJ1bGUgIC0+ICBUT0RPIHdyaXRlIG1vcmU/XG4gICAgICAgIGlmIChiIGluc3RhbmNlb2YgVHJ1ZSB8fCBiIGluc3RhbmNlb2YgRmFsc2UpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICBpZiAoYSBpbnN0YW5jZW9mIFRydWUgfHwgYSBpbnN0YW5jZW9mIEZhbHNlKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHRoaXMuX3J1bGVzX3NlZW4uaGFzKG5ldyBJbXBsaWNhdGlvbihhLCBiKSkpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMuX3J1bGVzX3NlZW4uYWRkKG5ldyBJbXBsaWNhdGlvbihhLCBiKSk7XG4gICAgICAgIH1cbiAgICAgICAgLy8gdGhpcyBpcyB0aGUgY29yZSBvZiB0aGUgcHJvY2Vzc2luZ1xuICAgICAgICB0cnkge1xuICAgICAgICAgICAgdGhpcy5fcHJvY2Vzc19ydWxlKGEsIGIpO1xuICAgICAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgICAgICAgaWYgKCEoZXJyb3IgaW5zdGFuY2VvZiBUYXV0b2xvZ3lEZXRlY3RlZCkpIHtcbiAgICAgICAgICAgICAgICB0aHJvdyBFcnJvcjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgIF9wcm9jZXNzX3J1bGUoYTogYW55LCBiOiBhbnkpIHtcbiAgICAgICAgLy8gcmlnaHQgcGFydCBmaXJzdFxuXG4gICAgICAgIC8vIGEgLT4gYiAmIGMgICAtLT4gICAgYS0+IGIgIDsgIGEgLT4gY1xuXG4gICAgICAgIC8vICAoPykgRklYTUUgdGhpcyBpcyBvbmx5IGNvcnJlY3Qgd2hlbiBiICYgYyAhPSBudWxsICFcblxuICAgICAgICBpZiAoYiBpbnN0YW5jZW9mIEFuZCkge1xuICAgICAgICAgICAgZm9yIChjb25zdCBiYXJnIG9mIGIuYXJncykge1xuICAgICAgICAgICAgICAgIHRoaXMucHJvY2Vzc19ydWxlKGEsIGJhcmcpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9IGVsc2UgaWYgKGIgaW5zdGFuY2VvZiBPcikge1xuICAgICAgICAgICAgLy8gZGV0ZWN0IHRhdXRvbG9neSBmaXJzdFxuICAgICAgICAgICAgaWYgKCEoYSBpbnN0YW5jZW9mIExvZ2ljKSkgeyAvLyBhdG9tXG4gICAgICAgICAgICAgICAgLy8gdGF1dG9sb2d5OiAgYSAtPiBhfGN8Li4uXG4gICAgICAgICAgICAgICAgaWYgKGIuYXJncy5pbmNsdWRlcyhhKSkge1xuICAgICAgICAgICAgICAgICAgICB0aHJvdyBuZXcgVGF1dG9sb2d5RGV0ZWN0ZWQoYSwgYiwgXCJhIC0+IGF8Y3wuLi5cIik7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgY29uc3Qgbm90X2JhcmdzOiBhbnlbXSA9IFtdO1xuICAgICAgICAgICAgZm9yIChjb25zdCBiYXJnIG9mIGIuYXJncykge1xuICAgICAgICAgICAgICAgIG5vdF9iYXJncy5wdXNoKE5vdC5OZXcoYmFyZykpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdGhpcy5wcm9jZXNzX3J1bGUoQW5kLk5ldyguLi5ub3RfYmFyZ3MpLCBOb3QuTmV3KGEpKTtcblxuICAgICAgICAgICAgZm9yIChsZXQgYmlkeCA9IDA7IGJpZHggPCBiLmFyZ3MubGVuZ3RoOyBiaWR4KyspIHtcbiAgICAgICAgICAgICAgICBjb25zdCBiYXJnID0gYi5hcmdzW2JpZHhdO1xuICAgICAgICAgICAgICAgIGNvbnN0IGJyZXN0ID0gWy4uLmIuYXJnc10uc3BsaWNlKGJpZHgsIDEpO1xuICAgICAgICAgICAgICAgIHRoaXMucHJvY2Vzc19ydWxlKEFuZC5OZXcoYSwgTm90Lk5ldyhiYXJnKSksIE9yLk5ldyguLi5icmVzdCkpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9IGVsc2UgaWYgKGEgaW5zdGFuY2VvZiBBbmQpIHtcbiAgICAgICAgICAgIGlmIChhLmFyZ3MuaW5jbHVkZXMoYikpIHtcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgVGF1dG9sb2d5RGV0ZWN0ZWQoYSwgYiwgXCJhICYgYiAtPiBhXCIpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdGhpcy5wcm92ZWRfcnVsZXMucHVzaChuZXcgSW1wbGljYXRpb24oYSwgYikpO1xuICAgICAgICAgICAgLy8gWFhYIE5PVEUgYXQgcHJlc2VudCB3ZSBpZ25vcmUgICFjIC0+ICFhIHwgIWJcbiAgICAgICAgfSBlbHNlIGlmIChhIGluc3RhbmNlb2YgT3IpIHtcbiAgICAgICAgICAgIGlmIChhLmFyZ3MuaW5jbHVkZXMoYikpIHtcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgVGF1dG9sb2d5RGV0ZWN0ZWQoYSwgYiwgXCJhICYgYiAtPiBhXCIpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZm9yIChjb25zdCBhYXJnIG9mIGEuYXJncykge1xuICAgICAgICAgICAgICAgIHRoaXMucHJvY2Vzc19ydWxlKGFhcmcsIGIpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgLy8gYm90aCAnYScgYW5kICdiJyBhcmUgYXRvbXNcbiAgICAgICAgICAgIHRoaXMucHJvdmVkX3J1bGVzLnB1c2gobmV3IEltcGxpY2F0aW9uKGEsIGIpKTsgLy8gYSAtPiBiXG4gICAgICAgICAgICB0aGlzLnByb3ZlZF9ydWxlcy5wdXNoKG5ldyBJbXBsaWNhdGlvbihOb3QuTmV3KGIpLCBOb3QuTmV3KGEpKSk7XG4gICAgICAgIH1cbiAgICB9XG59XG5cbi8vIC8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXG5cbmNsYXNzIEZhY3RSdWxlcyB7XG4gICAgLyogUnVsZXMgdGhhdCBkZXNjcmliZSBob3cgdG8gZGVkdWNlIGZhY3RzIGluIGxvZ2ljIHNwYWNlXG4gICAgV2hlbiBkZWZpbmVkLCB0aGVzZSBydWxlcyBhbGxvdyBpbXBsaWNhdGlvbnMgdG8gcXVpY2tseSBiZSBkZXRlcm1pbmVkXG4gICAgZm9yIGEgc2V0IG9mIGZhY3RzLiBGb3IgdGhpcyBwcmVjb21wdXRlZCBkZWR1Y3Rpb24gdGFibGVzIGFyZSB1c2VkLlxuICAgIHNlZSBgZGVkdWNlX2FsbF9mYWN0c2AgICAoZm9yd2FyZC1jaGFpbmluZylcbiAgICBBbHNvIGl0IGlzIHBvc3NpYmxlIHRvIGdhdGhlciBwcmVyZXF1aXNpdGVzIGZvciBhIGZhY3QsIHdoaWNoIGlzIHRyaWVkXG4gICAgdG8gYmUgcHJvdmVuLiAgICAoYmFja3dhcmQtY2hhaW5pbmcpXG4gICAgRGVmaW5pdGlvbiBTeW50YXhcbiAgICAtLS0tLS0tLS0tLS0tLS0tLVxuICAgIGEgLT4gYiAgICAgICAtLSBhPVQgLT4gYj1UICAoYW5kIGF1dG9tYXRpY2FsbHkgYj1GIC0+IGE9RilcbiAgICBhIC0+ICFiICAgICAgLS0gYT1UIC0+IGI9RlxuICAgIGEgPT0gYiAgICAgICAtLSBhIC0+IGIgJiBiIC0+IGFcbiAgICBhIC0+IGIgJiBjICAgLS0gYT1UIC0+IGI9VCAmIGM9VFxuICAgICMgVE9ETyBiIHwgY1xuICAgIEludGVybmFsc1xuICAgIC0tLS0tLS0tLVxuICAgIC5mdWxsX2ltcGxpY2F0aW9uc1trLCB2XTogYWxsIHRoZSBpbXBsaWNhdGlvbnMgb2YgZmFjdCBrPXZcbiAgICAuYmV0YV90cmlnZ2Vyc1trLCB2XTogYmV0YSBydWxlcyB0aGF0IG1pZ2h0IGJlIHRyaWdnZXJlZCB3aGVuIGs9dlxuICAgIC5wcmVyZXEgIC0tIHt9IGsgPC0gW10gb2YgaydzIHByZXJlcXVpc2l0ZXNcbiAgICAuZGVmaW5lZF9mYWN0cyAtLSBzZXQgb2YgZGVmaW5lZCBmYWN0IG5hbWVzXG4gICAgKi9cblxuICAgIGJldGFfcnVsZXM6IGFueVtdO1xuICAgIGRlZmluZWRfZmFjdHM7XG4gICAgZnVsbF9pbXBsaWNhdGlvbnM7XG4gICAgYmV0YV90cmlnZ2VycztcbiAgICBwcmVyZXE7XG5cbiAgICBjb25zdHJ1Y3RvcihydWxlczogYW55W10gfCBzdHJpbmcpIHtcbiAgICAgICAgLy8gQ29tcGlsZSBydWxlcyBpbnRvIGludGVybmFsIGxvb2t1cCB0YWJsZXNcbiAgICAgICAgaWYgKHR5cGVvZiBydWxlcyA9PT0gXCJzdHJpbmdcIikge1xuICAgICAgICAgICAgcnVsZXMgPSBydWxlcy5zcGxpdChcIlxcblwiKTtcbiAgICAgICAgfVxuICAgICAgICAvLyAtLS0gcGFyc2UgYW5kIHByb2Nlc3MgcnVsZXMgLS0tXG4gICAgICAgIGNvbnN0IFA6IFByb3ZlciA9IG5ldyBQcm92ZXI7XG5cbiAgICAgICAgZm9yIChjb25zdCBydWxlIG9mIHJ1bGVzKSB7XG4gICAgICAgICAgICAvLyBYWFggYGFgIGlzIGhhcmRjb2RlZCB0byBiZSBhbHdheXMgYXRvbVxuICAgICAgICAgICAgbGV0IFthLCBvcCwgYl0gPSBydWxlLnNwbGl0KFwiIFwiLCAzKTtcbiAgICAgICAgICAgIGEgPSBMb2dpYy5mcm9tc3RyaW5nKGEpO1xuICAgICAgICAgICAgYiA9IExvZ2ljLmZyb21zdHJpbmcoYik7XG5cbiAgICAgICAgICAgIGlmIChvcCA9PT0gXCItPlwiKSB7XG4gICAgICAgICAgICAgICAgUC5wcm9jZXNzX3J1bGUoYSwgYik7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKG9wID09PSBcIj09XCIpIHtcbiAgICAgICAgICAgICAgICBQLnByb2Nlc3NfcnVsZShhLCBiKTtcbiAgICAgICAgICAgICAgICBQLnByb2Nlc3NfcnVsZShiLCBhKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwidW5rbm93biBvcCBcIiArIG9wKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICAvLyAtLS0gYnVpbGQgZGVkdWN0aW9uIG5ldHdvcmtzIC0tLVxuXG4gICAgICAgIHRoaXMuYmV0YV9ydWxlcyA9IFtdO1xuICAgICAgICBmb3IgKGNvbnN0IGl0ZW0gb2YgUC5ydWxlc19iZXRhKCkpIHtcbiAgICAgICAgICAgIGNvbnN0IGJjb25kID0gaXRlbS5wO1xuICAgICAgICAgICAgY29uc3QgYmltcGwgPSBpdGVtLnE7XG4gICAgICAgICAgICBjb25zdCBwYWlyczogSGFzaFNldCA9IG5ldyBIYXNoU2V0KCk7XG4gICAgICAgICAgICBiY29uZC5hcmdzLmZvckVhY2goKGE6IGFueSkgPT4gcGFpcnMuYWRkKF9hc19wYWlyKGEpKSk7XG4gICAgICAgICAgICB0aGlzLmJldGFfcnVsZXMucHVzaChuZXcgSW1wbGljYXRpb24ocGFpcnMsIF9hc19wYWlyKGJpbXBsKSkpO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gZGVkdWNlIGFscGhhIGltcGxpY2F0aW9uc1xuICAgICAgICBjb25zdCBpbXBsX2EgPSBkZWR1Y2VfYWxwaGFfaW1wbGljYXRpb25zKFAucnVsZXNfYWxwaGEoKSk7XG5cbiAgICAgICAgLy8gbm93OlxuICAgICAgICAvLyAtIGFwcGx5IGJldGEgcnVsZXMgdG8gYWxwaGEgY2hhaW5zICAoc3RhdGljIGV4dGVuc2lvbiksIGFuZFxuICAgICAgICAvLyAtIGZ1cnRoZXIgYXNzb2NpYXRlIGJldGEgcnVsZXMgdG8gYWxwaGEgY2hhaW4gKGZvciBpbmZlcmVuY2VcbiAgICAgICAgLy8gYXQgcnVudGltZSlcblxuICAgICAgICBjb25zdCBpbXBsX2FiID0gYXBwbHlfYmV0YV90b19hbHBoYV9yb3V0ZShpbXBsX2EsIFAucnVsZXNfYmV0YSgpKTtcblxuICAgICAgICAvLyBleHRyYWN0IGRlZmluZWQgZmFjdCBuYW1lc1xuICAgICAgICB0aGlzLmRlZmluZWRfZmFjdHMgPSBuZXcgSGFzaFNldCgpO1xuXG5cbiAgICAgICAgZm9yIChjb25zdCBrIG9mIGltcGxfYWIua2V5cygpKSB7XG4gICAgICAgICAgICB0aGlzLmRlZmluZWRfZmFjdHMuYWRkKF9iYXNlX2ZhY3QoaykpO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gYnVpbGQgcmVscyAoZm9yd2FyZCBjaGFpbnMpXG5cbiAgICAgICAgY29uc3QgZnVsbF9pbXBsaWNhdGlvbnMgPSBuZXcgU2V0RGVmYXVsdERpY3QoKTtcbiAgICAgICAgY29uc3QgYmV0YV90cmlnZ2VycyA9IG5ldyBTZXREZWZhdWx0RGljdCgpO1xuICAgICAgICBmb3IgKGNvbnN0IGl0ZW0gb2YgaW1wbF9hYi5lbnRyaWVzKCkpIHtcbiAgICAgICAgICAgIGNvbnN0IGsgPSBpdGVtWzBdO1xuICAgICAgICAgICAgY29uc3QgdmFsID0gaXRlbVsxXTtcbiAgICAgICAgICAgIGNvbnN0IGltcGw6IEhhc2hTZXQgPSB2YWwucDtcbiAgICAgICAgICAgIGNvbnN0IGJldGFpZHhzID0gdmFsLnE7XG4gICAgICAgICAgICBjb25zdCBzZXRUb0FkZCA9IG5ldyBIYXNoU2V0KCk7XG4gICAgICAgICAgICBpbXBsLnRvQXJyYXkoKS5mb3JFYWNoKChlOiBhbnkpID0+IHNldFRvQWRkLmFkZChfYXNfcGFpcihlKSkpO1xuICAgICAgICAgICAgZnVsbF9pbXBsaWNhdGlvbnMuYWRkKF9hc19wYWlyKGspLCBzZXRUb0FkZCk7XG4gICAgICAgICAgICBiZXRhX3RyaWdnZXJzLmFkZChfYXNfcGFpcihrKSwgYmV0YWlkeHMpO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuZnVsbF9pbXBsaWNhdGlvbnMgPSBmdWxsX2ltcGxpY2F0aW9ucztcblxuICAgICAgICB0aGlzLmJldGFfdHJpZ2dlcnMgPSBiZXRhX3RyaWdnZXJzO1xuXG4gICAgICAgIC8vIGJ1aWxkIHByZXJlcSAoYmFja3dhcmQgY2hhaW5zKVxuICAgICAgICBjb25zdCBwcmVyZXEgPSBuZXcgU2V0RGVmYXVsdERpY3QoKTtcbiAgICAgICAgY29uc3QgcmVsX3ByZXJlcSA9IHJ1bGVzXzJwcmVyZXEoZnVsbF9pbXBsaWNhdGlvbnMpO1xuICAgICAgICBmb3IgKGNvbnN0IGl0ZW0gb2YgcmVsX3ByZXJlcS5lbnRyaWVzKCkpIHtcbiAgICAgICAgICAgIGNvbnN0IGsgPSBpdGVtWzBdO1xuICAgICAgICAgICAgY29uc3QgcGl0ZW1zID0gaXRlbVsxXTtcbiAgICAgICAgICAgIHByZXJlcS5nZXQoaykuYWRkKHBpdGVtcyk7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5wcmVyZXEgPSBwcmVyZXE7XG4gICAgfVxufVxuXG5cbmNsYXNzIEluY29uc2lzdGVudEFzc3VtcHRpb25zIGV4dGVuZHMgRXJyb3Ige1xuICAgIGFyZ3M7XG5cbiAgICBjb25zdHJ1Y3RvciguLi5hcmdzOiBhbnlbXSkge1xuICAgICAgICBzdXBlcigpO1xuICAgICAgICB0aGlzLmFyZ3MgPSBhcmdzO1xuICAgIH1cblxuICAgIHN0YXRpYyBfX3N0cl9fKC4uLmFyZ3M6IGFueVtdKSB7XG4gICAgICAgIGNvbnN0IFtrYiwgZmFjdCwgdmFsdWVdID0gYXJncztcbiAgICAgICAgcmV0dXJuIGtiICsgXCIsIFwiICsgZmFjdCArIFwiPVwiICsgdmFsdWU7XG4gICAgfVxufVxuXG5jbGFzcyBGYWN0S0IgZXh0ZW5kcyBIYXNoRGljdCB7XG4gICAgLypcbiAgICBBIHNpbXBsZSBwcm9wb3NpdGlvbmFsIGtub3dsZWRnZSBiYXNlIHJlbHlpbmcgb24gY29tcGlsZWQgaW5mZXJlbmNlIHJ1bGVzLlxuICAgICovXG5cbiAgICBydWxlcztcblxuICAgIGNvbnN0cnVjdG9yKHJ1bGVzOiBhbnkpIHtcbiAgICAgICAgc3VwZXIoKTtcbiAgICAgICAgdGhpcy5ydWxlcyA9IHJ1bGVzO1xuICAgIH1cblxuICAgIF90ZWxsKGs6IGFueSwgdjogYW55KSB7XG4gICAgICAgIC8qIEFkZCBmYWN0IGs9diB0byB0aGUga25vd2xlZGdlIGJhc2UuXG4gICAgICAgIFJldHVybnMgVHJ1ZSBpZiB0aGUgS0IgaGFzIGFjdHVhbGx5IGJlZW4gdXBkYXRlZCwgRmFsc2Ugb3RoZXJ3aXNlLlxuICAgICAgICAqL1xuICAgICAgICBpZiAoayBpbiB0aGlzLmRpY3QgJiYgdHlwZW9mIHRoaXMuZ2V0KGspICE9PSBcInVuZGVmaW5lZFwiKSB7XG4gICAgICAgICAgICBpZiAodGhpcy5nZXQoaykgPT09IHYpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gTG9naWMuRmFsc2U7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHRocm93IG5ldyBJbmNvbnNpc3RlbnRBc3N1bXB0aW9ucyh0aGlzLCBrLCB2KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMuYWRkKGssIHYpO1xuICAgICAgICAgICAgcmV0dXJuIExvZ2ljLlRydWU7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvLyAvLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXG4gICAgLy8qIFRoaXMgaXMgdGhlIHdvcmtob3JzZSwgc28ga2VlcCBpdCAqZmFzdCouIC8vXG4gICAgLy8gLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xuXG4gICAgZGVkdWNlX2FsbF9mYWN0cyhmYWN0czogYW55KSB7XG4gICAgICAgIC8qXG4gICAgICAgIFVwZGF0ZSB0aGUgS0Igd2l0aCBhbGwgdGhlIGltcGxpY2F0aW9ucyBvZiBhIGxpc3Qgb2YgZmFjdHMuXG4gICAgICAgIEZhY3RzIGNhbiBiZSBzcGVjaWZpZWQgYXMgYSBkaWN0aW9uYXJ5IG9yIGFzIGEgbGlzdCBvZiAoa2V5LCB2YWx1ZSlcbiAgICAgICAgcGFpcnMuXG4gICAgICAgICovXG4gICAgICAgIC8vIGtlZXAgZnJlcXVlbnRseSB1c2VkIGF0dHJpYnV0ZXMgbG9jYWxseSwgc28gd2UnbGwgYXZvaWQgZXh0cmFcbiAgICAgICAgLy8gYXR0cmlidXRlIGFjY2VzcyBvdmVyaGVhZFxuXG4gICAgICAgIGNvbnN0IGZ1bGxfaW1wbGljYXRpb25zOiBTZXREZWZhdWx0RGljdCA9IHRoaXMucnVsZXMuZnVsbF9pbXBsaWNhdGlvbnM7XG4gICAgICAgIGNvbnN0IGJldGFfdHJpZ2dlcnM6IFNldERlZmF1bHREaWN0ID0gdGhpcy5ydWxlcy5iZXRhX3RyaWdnZXJzO1xuICAgICAgICBjb25zdCBiZXRhX3J1bGVzOiBhbnlbXSA9IHRoaXMucnVsZXMuYmV0YV9ydWxlcztcblxuICAgICAgICBpZiAoZmFjdHMgaW5zdGFuY2VvZiBIYXNoRGljdCB8fCBmYWN0cyBpbnN0YW5jZW9mIFN0ZEZhY3RLQikge1xuICAgICAgICAgICAgZmFjdHMgPSBmYWN0cy5lbnRyaWVzKCk7XG4gICAgICAgIH1cblxuICAgICAgICB3aGlsZSAoZmFjdHMubGVuZ3RoICE9IDApIHtcbiAgICAgICAgICAgIGNvbnN0IGJldGFfbWF5dHJpZ2dlciA9IG5ldyBIYXNoU2V0KCk7XG5cbiAgICAgICAgICAgIC8vIC0tLSBhbHBoYSBjaGFpbnMgLS0tXG4gICAgICAgICAgICBmb3IgKGNvbnN0IGl0ZW0gb2YgZmFjdHMpIHtcbiAgICAgICAgICAgICAgICBjb25zdCBrID0gaXRlbVswXTtcbiAgICAgICAgICAgICAgICBjb25zdCB2ID0gaXRlbVsxXTtcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5fdGVsbChrLCB2KSBpbnN0YW5jZW9mIEZhbHNlIHx8ICh0eXBlb2YgdiA9PT0gXCJ1bmRlZmluZWRcIikpIHtcbiAgICAgICAgICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgLy8gbG9va3VwIHJvdXRpbmcgdGFibGVzXG4gICAgICAgICAgICAgICAgY29uc3QgYXJyID0gZnVsbF9pbXBsaWNhdGlvbnMuZ2V0KG5ldyBJbXBsaWNhdGlvbihrLCB2KSkudG9BcnJheSgpO1xuICAgICAgICAgICAgICAgIGZvciAoY29uc3QgaXRlbSBvZiBhcnIpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fdGVsbChpdGVtWzBdLCBpdGVtWzFdKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgY29uc3QgY3VycmltcCA9IGJldGFfdHJpZ2dlcnMuZ2V0KG5ldyBJbXBsaWNhdGlvbihrLCB2KSk7XG4gICAgICAgICAgICAgICAgaWYgKCEoY3VycmltcC5pc0VtcHR5KCkpKSB7XG4gICAgICAgICAgICAgICAgICAgIGJldGFfbWF5dHJpZ2dlci5hZGQoYmV0YV90cmlnZ2Vycy5nZXQobmV3IEltcGxpY2F0aW9uKGssIHYpKSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgLy8gLS0tIGJldGEgY2hhaW5zIC0tLVxuICAgICAgICAgICAgZmFjdHMgPSBbXTtcbiAgICAgICAgICAgIGZvciAoY29uc3QgYmlkeCBvZiBiZXRhX21heXRyaWdnZXIudG9BcnJheSgpKSB7XG4gICAgICAgICAgICAgICAgY29uc3QgW2Jjb25kLCBiaW1wbF0gPSBiZXRhX3J1bGVzW2JpZHhdO1xuICAgICAgICAgICAgICAgIGZvciAoY29uc3QgaXRlbSBvZiBiY29uZCkge1xuICAgICAgICAgICAgICAgICAgICBjb25zdCBrID0gaXRlbVswXTtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgdiA9IGl0ZW1bMV07XG4gICAgICAgICAgICAgICAgICAgIGlmICh0aGlzLmdldChrKSAhPT0gdikge1xuICAgICAgICAgICAgICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgZmFjdHMucHVzaChiaW1wbCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxufVxuXG5leHBvcnQge0ZhY3RLQiwgRmFjdFJ1bGVzfTtcbiIsICIvKiBUaGUgY29yZSdzIGNvcmUuICovXG5cbi8qXG5Ob3RhYmxlIGNoYW5nZXMgbWFkZSAoV0IgYW5kIEdNKVxuLSBSZXBsYWNlZCBhcnJheSBvZiBjbGFzc2VzIHdpdGggZGljdGlvbmFyeSBmb3IgcXVpY2tlciBpbmRleCByZXRyaWV2YWxzXG4tIEltcGxlbWVudGVkIGEgY29uc3RydWN0b3Igc3lzdGVtIGZvciBiYXNpY21ldGEgcmF0aGVyIHRoYW4gX19uZXdfX1xuKi9cblxuXG5pbXBvcnQge0hhc2hTZXR9IGZyb20gXCIuL3V0aWxpdHkuanNcIjtcblxuLy8gdXNlZCBmb3IgY2Fub25pY2FsIG9yZGVyaW5nIG9mIHN5bWJvbGljIHNlcXVlbmNlc1xuLy8gdmlhIF9fY21wX18gbWV0aG9kOlxuLy8gRklYTUUgdGhpcyBpcyAqc28qIGlycmVsZXZhbnQgYW5kIG91dGRhdGVkIVxuXG5jb25zdCBvcmRlcmluZ19vZl9jbGFzc2VzOiBSZWNvcmQ8YW55LCBhbnk+ID0ge1xuICAgIC8vIHNpbmdsZXRvbiBudW1iZXJzXG4gICAgWmVybzogMCwgT25lOiAxLCBIYWxmOiAyLCBJbmZpbml0eTogMywgTmFOOiA0LCBOZWdhdGl2ZU9uZTogNSwgTmVnYXRpdmVJbmZpbml0eTogNixcbiAgICAvLyBudW1iZXJzXG4gICAgSW50ZWdlcjogNywgUmF0aW9uYWw6IDgsIEZsb2F0OiA5LFxuICAgIC8vIHNpbmdsZXRvbiBudW1iZXJzXG4gICAgRXhwMTogMTAsIFBpOiAxMSwgSW1hZ2luYXJ5VW5pdDogMTIsXG4gICAgLy8gc3ltYm9sc1xuICAgIFN5bWJvbDogMTMsIFdpbGQ6IDE0LCBUZW1wb3Jhcnk6IDE1LFxuICAgIC8vIGFyaXRobWV0aWMgb3BlcmF0aW9uc1xuICAgIFBvdzogMTYsIE11bDogMTcsIEFkZDogMTgsXG4gICAgLy8gZnVuY3Rpb24gdmFsdWVzXG4gICAgRGVyaXZhdGl2ZTogMTksIEludGVncmFsOiAyMCxcbiAgICAvLyBkZWZpbmVkIHNpbmdsZXRvbiBmdW5jdGlvbnNcbiAgICBBYnM6IDIxLCBTaWduOiAyMiwgU3FydDogMjMsIEZsb29yOiAyNCwgQ2VpbGluZzogMjUsIFJlOiAyNiwgSW06IDI3LFxuICAgIEFyZzogMjgsIENvbmp1Z2F0ZTogMjksIEV4cDogMzAsIExvZzogMzEsIFNpbjogMzIsIENvczogMzMsIFRhbjogMzQsXG4gICAgQ290OiAzNSwgQVNpbjogMzYsIEFDb3M6IDM3LCBBVGFuOiAzOCwgQUNvdDogMzksIFNpbmg6IDQwLCBDb3NoOiA0MSxcbiAgICBUYW5oOiA0MiwgQVNpbmg6IDQzLCBBQ29zaDogNDQsIEFUYW5oOiA0NSwgQUNvdGg6IDQ2LFxuICAgIFJpc2luZ0ZhY3RvcmlhbDogNDcsIEZhbGxpbmdGYWN0b3JpYWw6IDQ4LCBmYWN0b3JpYWw6IDQ5LCBiaW5vbWlhbDogNTAsXG4gICAgR2FtbWE6IDUxLCBMb3dlckdhbW1hOiA1MiwgVXBwZXJHYW1hOiA1MywgUG9seUdhbW1hOiA1NCwgRXJmOiA1NSxcbiAgICAvLyBzcGVjaWFsIHBvbHlub21pYWxzXG4gICAgQ2hlYnlzaGV2OiA1NiwgQ2hlYnlzaGV2MjogNTcsXG4gICAgLy8gdW5kZWZpbmVkIGZ1bmN0aW9uc1xuICAgIEZ1bmN0aW9uOiA1OCwgV2lsZEZ1bmN0aW9uOiA1OSxcbiAgICAvLyBhbm9ueW1vdXMgZnVuY3Rpb25zXG4gICAgTGFtYmRhOiA2MCxcbiAgICAvLyBMYW5kYXUgTyBzeW1ib2xcbiAgICBPcmRlcjogNjEsXG4gICAgLy8gcmVsYXRpb25hbCBvcGVyYXRpb25zXG4gICAgRXF1YWxsaXR5OiA2MiwgVW5lcXVhbGl0eTogNjMsIFN0cmljdEdyZWF0ZXJUaGFuOiA2NCwgU3RyaWN0TGVzc1RoYW46IDY1LFxuICAgIEdyZWF0ZXJUaGFuOiA2NiwgTGVzc1RoYW46IDY2LFxufTtcblxuXG5jbGFzcyBSZWdpc3RyeSB7XG4gICAgLypcbiAgICBCYXNlIGNsYXNzIGZvciByZWdpc3RyeSBvYmplY3RzLlxuXG4gICAgUmVnaXN0cmllcyBtYXAgYSBuYW1lIHRvIGFuIG9iamVjdCB1c2luZyBhdHRyaWJ1dGUgbm90YXRpb24uIFJlZ2lzdHJ5XG4gICAgY2xhc3NlcyBiZWhhdmUgc2luZ2xldG9uaWNhbGx5OiBhbGwgdGhlaXIgaW5zdGFuY2VzIHNoYXJlIHRoZSBzYW1lIHN0YXRlLFxuICAgIHdoaWNoIGlzIHN0b3JlZCBpbiB0aGUgY2xhc3Mgb2JqZWN0LlxuXG4gICAgQWxsIHN1YmNsYXNzZXMgc2hvdWxkIHNldCBgX19zbG90c19fID0gKClgLlxuICAgICovXG5cbiAgICBzdGF0aWMgZGljdDogUmVjb3JkPGFueSwgYW55PjtcblxuICAgIGFkZEF0dHIobmFtZTogYW55LCBvYmo6IGFueSkge1xuICAgICAgICBSZWdpc3RyeS5kaWN0W25hbWVdID0gb2JqO1xuICAgIH1cblxuICAgIGRlbEF0dHIobmFtZTogYW55KSB7XG4gICAgICAgIGRlbGV0ZSBSZWdpc3RyeS5kaWN0W25hbWVdO1xuICAgIH1cbn1cblxuLy8gQSBzZXQgY29udGFpbmluZyBhbGwgU3ltUHkgY2xhc3Mgb2JqZWN0c1xuY29uc3QgYWxsX2NsYXNzZXMgPSBuZXcgSGFzaFNldCgpO1xuXG5jbGFzcyBCYXNpY01ldGEge1xuICAgIF9fc3ltcHlfXzogYW55O1xuXG4gICAgc3RhdGljIHJlZ2lzdGVyKGNsczogYW55KSB7XG4gICAgICAgIGFsbF9jbGFzc2VzLmFkZChjbHMpO1xuICAgICAgICBjbHMuX19zeW1weV9fID0gdHJ1ZTtcbiAgICB9XG5cbiAgICBzdGF0aWMgY29tcGFyZShzZWxmOiBhbnksIG90aGVyOiBhbnkpIHtcbiAgICAgICAgLy8gSWYgdGhlIG90aGVyIG9iamVjdCBpcyBub3QgYSBCYXNpYyBzdWJjbGFzcywgdGhlbiB3ZSBhcmUgbm90IGVxdWFsIHRvXG4gICAgICAgIC8vIGl0LlxuICAgICAgICBpZiAoIShvdGhlciBpbnN0YW5jZW9mIEJhc2ljTWV0YSkpIHtcbiAgICAgICAgICAgIHJldHVybiAtMTtcbiAgICAgICAgfVxuICAgICAgICBjb25zdCBuMSA9IHNlbGYuY29uc3RydWN0b3IubmFtZTtcbiAgICAgICAgY29uc3QgbjIgPSBvdGhlci5jb25zdHJ1Y3Rvci5uYW1lO1xuICAgICAgICAvLyBjaGVjayBpZiBib3RoIGFyZSBpbiB0aGUgY2xhc3NlcyBkaWN0aW9uYXJ5XG4gICAgICAgIGlmIChvcmRlcmluZ19vZl9jbGFzc2VzLmhhcyhuMSkgJiYgb3JkZXJpbmdfb2ZfY2xhc3Nlcy5oYXMobjIpKSB7XG4gICAgICAgICAgICBjb25zdCBpZHgxID0gb3JkZXJpbmdfb2ZfY2xhc3Nlc1tuMV07XG4gICAgICAgICAgICBjb25zdCBpZHgyID0gb3JkZXJpbmdfb2ZfY2xhc3Nlc1tuMl07XG4gICAgICAgICAgICAvLyB0aGUgY2xhc3Mgd2l0aCB0aGUgbGFyZ2VyIGluZGV4IGlzIGdyZWF0ZXJcbiAgICAgICAgICAgIHJldHVybiBNYXRoLnNpZ24oaWR4MSAtIGlkeDIpO1xuICAgICAgICB9XG4gICAgICAgIGlmIChuMSA+IG4yKSB7XG4gICAgICAgICAgICByZXR1cm4gMTtcbiAgICAgICAgfSBlbHNlIGlmIChuMSA9PT0gbjIpIHtcbiAgICAgICAgICAgIHJldHVybiAwO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiAtMTtcbiAgICB9XG5cbiAgICBsZXNzVGhhbihvdGhlcjogYW55KSB7XG4gICAgICAgIGlmIChCYXNpY01ldGEuY29tcGFyZShzZWxmLCBvdGhlcikgPT09IC0xKSB7XG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuXG4gICAgZ3JlYXRlclRoYW4ob3RoZXI6IGFueSkge1xuICAgICAgICBpZiAoQmFzaWNNZXRhLmNvbXBhcmUoc2VsZiwgb3RoZXIpID09PSAxKSB7XG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxufVxuXG5cbmV4cG9ydCB7QmFzaWNNZXRhLCBSZWdpc3RyeX07XG5cbiIsICIvKlxuTm90YWJsZSBjaGFuZ2VzIG1hZGUgKGFuZCBub3Rlcyk6XG4tIE1hbmFnZWRQcm9wZXJ0aWVzIHJld29ya2VkIGFzIG5vcm1hbCBjbGFzcyAtIGVhY2ggY2xhc3MgaXMgcmVnaXN0ZXJlZCBkaXJlY3RseVxuICBhZnRlciBkZWZpbmVkXG4tIE1hbmFnZWRQcm9wZXJ0aWVzIHRyYWNrcyBwcm9wZXJ0aWVzIG9mIGJhc2UgY2xhc3NlcyBieSB0cmFja2luZyBhbGwgcHJvcGVydGllc1xuICAoc2VlIGNvbW1lbnRzIHdpdGhpbiBjbGFzcylcbi0gQ2xhc3MgcHJvcGVydGllcyBmcm9tIF9ldmFsX2lzIG1ldGhvZHMgYXJlIGFzc2lnbmVkIHRvIGVhY2ggb2JqZWN0IGl0c2VsZiBpblxuICB0aGUgQmFzaWMgY29uc3RydWN0b3Jcbi0gQ2hvb3NpbmcgdG8gcnVuIGdldGl0KCkgb24gbWFrZV9wcm9wZXJ0eSB0byBhZGQgY29uc2lzdGVuY3kgaW4gYWNjZXNzaW5nXG4tIFRvLWRvOiBtYWtlIGFjY2Vzc2luZyBwcm9wZXJ0aWVzIG1vcmUgY29uc2lzdGVudCAoaS5lLiwgc2FtZSBzeW50YXggZm9yXG4gIGFjZXNzaW5nIHN0YXRpYyBhbmQgbm9uLXN0YXRpYyBwcm9wZXJ0aWVzKVxuKi9cblxuaW1wb3J0IHtGYWN0S0IsIEZhY3RSdWxlc30gZnJvbSBcIi4vZmFjdHMuanNcIjtcbmltcG9ydCB7QmFzaWNNZXRhfSBmcm9tIFwiLi9jb3JlLmpzXCI7XG5pbXBvcnQge0hhc2hEaWN0LCBIYXNoU2V0LCBVdGlsfSBmcm9tIFwiLi91dGlsaXR5LmpzXCI7XG5cblxuY29uc3QgX2Fzc3VtZV9ydWxlcyA9IG5ldyBGYWN0UnVsZXMoW1xuICAgIFwiaW50ZWdlciAtPiByYXRpb25hbFwiLFxuICAgIFwicmF0aW9uYWwgLT4gcmVhbFwiLFxuICAgIFwicmF0aW9uYWwgLT4gYWxnZWJyYWljXCIsXG4gICAgXCJhbGdlYnJhaWMgLT4gY29tcGxleFwiLFxuICAgIFwidHJhbnNjZW5kZW50YWwgPT0gY29tcGxleCAmICFhbGdlYnJhaWNcIixcbiAgICBcInJlYWwgLT4gaGVybWl0aWFuXCIsXG4gICAgXCJpbWFnaW5hcnkgLT4gY29tcGxleFwiLFxuICAgIFwiaW1hZ2luYXJ5IC0+IGFudGloZXJtaXRpYW5cIixcbiAgICBcImV4dGVuZGVkX3JlYWwgLT4gY29tbXV0YXRpdmVcIixcbiAgICBcImNvbXBsZXggLT4gY29tbXV0YXRpdmVcIixcbiAgICBcImNvbXBsZXggLT4gZmluaXRlXCIsXG5cbiAgICBcIm9kZCA9PSBpbnRlZ2VyICYgIWV2ZW5cIixcbiAgICBcImV2ZW4gPT0gaW50ZWdlciAmICFvZGRcIixcblxuICAgIFwicmVhbCAtPiBjb21wbGV4XCIsXG4gICAgXCJleHRlbmRlZF9yZWFsIC0+IHJlYWwgfCBpbmZpbml0ZVwiLFxuICAgIFwicmVhbCA9PSBleHRlbmRlZF9yZWFsICYgZmluaXRlXCIsXG5cbiAgICBcImV4dGVuZGVkX3JlYWwgPT0gZXh0ZW5kZWRfbmVnYXRpdmUgfCB6ZXJvIHwgZXh0ZW5kZWRfcG9zaXRpdmVcIixcbiAgICBcImV4dGVuZGVkX25lZ2F0aXZlID09IGV4dGVuZGVkX25vbnBvc2l0aXZlICYgZXh0ZW5kZWRfbm9uemVyb1wiLFxuICAgIFwiZXh0ZW5kZWRfcG9zaXRpdmUgPT0gZXh0ZW5kZWRfbm9ubmVnYXRpdmUgJiBleHRlbmRlZF9ub256ZXJvXCIsXG5cbiAgICBcImV4dGVuZGVkX25vbnBvc2l0aXZlID09IGV4dGVuZGVkX3JlYWwgJiAhZXh0ZW5kZWRfcG9zaXRpdmVcIixcbiAgICBcImV4dGVuZGVkX25vbm5lZ2F0aXZlID09IGV4dGVuZGVkX3JlYWwgJiAhZXh0ZW5kZWRfbmVnYXRpdmVcIixcblxuICAgIFwicmVhbCA9PSBuZWdhdGl2ZSB8IHplcm8gfCBwb3NpdGl2ZVwiLFxuICAgIFwibmVnYXRpdmUgPT0gbm9ucG9zaXRpdmUgJiBub256ZXJvXCIsXG4gICAgXCJwb3NpdGl2ZSA9PSBub25uZWdhdGl2ZSAmIG5vbnplcm9cIixcblxuICAgIFwibm9ucG9zaXRpdmUgPT0gcmVhbCAmICFwb3NpdGl2ZVwiLFxuICAgIFwibm9ubmVnYXRpdmUgPT0gcmVhbCAmICFuZWdhdGl2ZVwiLFxuXG4gICAgXCJwb3NpdGl2ZSA9PSBleHRlbmRlZF9wb3NpdGl2ZSAmIGZpbml0ZVwiLFxuICAgIFwibmVnYXRpdmUgPT0gZXh0ZW5kZWRfbmVnYXRpdmUgJiBmaW5pdGVcIixcbiAgICBcIm5vbnBvc2l0aXZlID09IGV4dGVuZGVkX25vbnBvc2l0aXZlICYgZmluaXRlXCIsXG4gICAgXCJub25uZWdhdGl2ZSA9PSBleHRlbmRlZF9ub25uZWdhdGl2ZSAmIGZpbml0ZVwiLFxuICAgIFwibm9uemVybyA9PSBleHRlbmRlZF9ub256ZXJvICYgZmluaXRlXCIsXG5cbiAgICBcInplcm8gLT4gZXZlbiAmIGZpbml0ZVwiLFxuICAgIFwiemVybyA9PSBleHRlbmRlZF9ub25uZWdhdGl2ZSAmIGV4dGVuZGVkX25vbnBvc2l0aXZlXCIsXG4gICAgXCJ6ZXJvID09IG5vbm5lZ2F0aXZlICYgbm9ucG9zaXRpdmVcIixcbiAgICBcIm5vbnplcm8gLT4gcmVhbFwiLFxuXG4gICAgXCJwcmltZSAtPiBpbnRlZ2VyICYgcG9zaXRpdmVcIixcbiAgICBcImNvbXBvc2l0ZSAtPiBpbnRlZ2VyICYgcG9zaXRpdmUgJiAhcHJpbWVcIixcbiAgICBcIiFjb21wb3NpdGUgLT4gIXBvc2l0aXZlIHwgIWV2ZW4gfCBwcmltZVwiLFxuXG4gICAgXCJpcnJhdGlvbmFsID09IHJlYWwgJiAhcmF0aW9uYWxcIixcblxuICAgIFwiaW1hZ2luYXJ5IC0+ICFleHRlbmRlZF9yZWFsXCIsXG5cbiAgICBcImluZmluaXRlID09ICFmaW5pdGVcIixcbiAgICBcIm5vbmludGVnZXIgPT0gZXh0ZW5kZWRfcmVhbCAmICFpbnRlZ2VyXCIsXG4gICAgXCJleHRlbmRlZF9ub256ZXJvID09IGV4dGVuZGVkX3JlYWwgJiAhemVyb1wiLFxuXSk7XG5cblxuZXhwb3J0IGNvbnN0IF9hc3N1bWVfZGVmaW5lZCA9IF9hc3N1bWVfcnVsZXMuZGVmaW5lZF9mYWN0cy5jbG9uZSgpO1xuXG5jbGFzcyBTdGRGYWN0S0IgZXh0ZW5kcyBGYWN0S0Ige1xuICAgIC8qIEEgRmFjdEtCIHNwZWNpYWxpemVkIGZvciB0aGUgYnVpbHQtaW4gcnVsZXNcbiAgICBUaGlzIGlzIHRoZSBvbmx5IGtpbmQgb2YgRmFjdEtCIHRoYXQgQmFzaWMgb2JqZWN0cyBzaG91bGQgdXNlLlxuICAgICovXG5cbiAgICBfZ2VuZXJhdG9yO1xuXG4gICAgY29uc3RydWN0b3IoZmFjdHM6IGFueSA9IHVuZGVmaW5lZCkge1xuICAgICAgICBzdXBlcihfYXNzdW1lX3J1bGVzKTtcbiAgICAgICAgLy8gc2F2ZSBhIGNvcHkgb2YgZmFjdHMgZGljdFxuICAgICAgICBpZiAodHlwZW9mIGZhY3RzID09PSBcInVuZGVmaW5lZFwiKSB7XG4gICAgICAgICAgICB0aGlzLl9nZW5lcmF0b3IgPSB7fTtcbiAgICAgICAgfSBlbHNlIGlmICghKGZhY3RzIGluc3RhbmNlb2YgRmFjdEtCKSkge1xuICAgICAgICAgICAgdGhpcy5fZ2VuZXJhdG9yID0gZmFjdHMuY29weSgpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5fZ2VuZXJhdG9yID0gKGZhY3RzIGFzIGFueSkuZ2VuZXJhdG9yOyAvLyAhISFcbiAgICAgICAgfVxuICAgICAgICBpZiAoZmFjdHMpIHtcbiAgICAgICAgICAgIHRoaXMuZGVkdWNlX2FsbF9mYWN0cyhmYWN0cyk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBzdGRjbG9uZSgpIHtcbiAgICAgICAgcmV0dXJuIG5ldyBTdGRGYWN0S0IodGhpcyk7XG4gICAgfVxuXG4gICAgZ2VuZXJhdG9yKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5fZ2VuZXJhdG9yLmNvcHkoKTtcbiAgICB9XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBhc19wcm9wZXJ0eShmYWN0OiBhbnkpIHtcbiAgICByZXR1cm4gXCJpc19cIiArIGZhY3Q7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBtYWtlX3Byb3BlcnR5KG9iajogYW55LCBmYWN0OiBhbnkpIHtcbiAgICAvLyBjaG9vc2luZyB0byBydW4gZ2V0aXQoKSBvbiBtYWtlX3Byb3BlcnR5IHRvIGFkZCBjb25zaXN0ZW5jeSBpbiBhY2Nlc3NpbmdcbiAgICAvLyBwcm9wb2VydGllcyBvZiBzeW10eXBlIG9iamVjdHMuIHRoaXMgbWF5IHNsb3cgZG93biBzeW10eXBlIHNsaWdodGx5XG4gICAgb2JqW2FzX3Byb3BlcnR5KGZhY3QpXSA9IGdldGl0O1xuICAgIGZ1bmN0aW9uIGdldGl0KCkge1xuICAgICAgICBpZiAodHlwZW9mIG9iai5fYXNzdW1wdGlvbnNbZmFjdF0gIT09IFwidW5kZWZpbmVkXCIpIHtcbiAgICAgICAgICAgIHJldHVybiBvYmouX2Fzc3VtcHRpb25zW2ZhY3RdO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuIF9hc2soZmFjdCwgb2JqKTtcbiAgICAgICAgfVxuICAgIH1cbn1cblxuXG4vLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tdW51c2VkLXZhcnNcbmZ1bmN0aW9uIF9hc2soZmFjdDogYW55LCBvYmo6IGFueSkge1xuICAgIC8qXG4gICAgRmluZCB0aGUgdHJ1dGggdmFsdWUgZm9yIGEgcHJvcGVydHkgb2YgYW4gb2JqZWN0LlxuICAgIFRoaXMgZnVuY3Rpb24gaXMgY2FsbGVkIHdoZW4gYSByZXF1ZXN0IGlzIG1hZGUgdG8gc2VlIHdoYXQgYSBmYWN0XG4gICAgdmFsdWUgaXMuXG4gICAgRm9yIHRoaXMgd2UgdXNlIHNldmVyYWwgdGVjaG5pcXVlczpcbiAgICBGaXJzdCwgdGhlIGZhY3QtZXZhbHVhdGlvbiBmdW5jdGlvbiBpcyB0cmllZCwgaWYgaXQgZXhpc3RzIChmb3JcbiAgICBleGFtcGxlIF9ldmFsX2lzX2ludGVnZXIpLiBUaGVuIHdlIHRyeSByZWxhdGVkIGZhY3RzLiBGb3IgZXhhbXBsZVxuICAgICAgICByYXRpb25hbCAgIC0tPiAgIGludGVnZXJcbiAgICBhbm90aGVyIGV4YW1wbGUgaXMgam9pbmVkIHJ1bGU6XG4gICAgICAgIGludGVnZXIgJiAhb2RkICAtLT4gZXZlblxuICAgIHNvIGluIHRoZSBsYXR0ZXIgY2FzZSBpZiB3ZSBhcmUgbG9va2luZyBhdCB3aGF0ICdldmVuJyB2YWx1ZSBpcyxcbiAgICAnaW50ZWdlcicgYW5kICdvZGQnIGZhY3RzIHdpbGwgYmUgYXNrZWQuXG4gICAgSW4gYWxsIGNhc2VzLCB3aGVuIHdlIHNldHRsZSBvbiBzb21lIGZhY3QgdmFsdWUsIGl0cyBpbXBsaWNhdGlvbnMgYXJlXG4gICAgZGVkdWNlZCwgYW5kIHRoZSByZXN1bHQgaXMgY2FjaGVkIGluIC5fYXNzdW1wdGlvbnMuXG4gICAgKi9cblxuICAgIC8vIEZhY3RLQiB3aGljaCBpcyBkaWN0LWxpa2UgYW5kIG1hcHMgZmFjdHMgdG8gdGhlaXIga25vd24gdmFsdWVzOlxuICAgIGNvbnN0IGFzc3VtcHRpb25zOiBGYWN0S0IgPSBvYmouX2Fzc3VtcHRpb25zO1xuXG4gICAgLy8gQSBkaWN0IHRoYXQgbWFwcyBmYWN0cyB0byB0aGVpciBoYW5kbGVyczpcbiAgICBjb25zdCBoYW5kbGVyX21hcDogSGFzaERpY3QgPSBvYmouX3Byb3BfaGFuZGxlcjtcblxuICAgIC8vIFRoaXMgaXMgb3VyIHF1ZXVlIG9mIGZhY3RzIHRvIGNoZWNrOlxuICAgIGNvbnN0IGZhY3RzX3RvX2NoZWNrID0gbmV3IEFycmF5KGZhY3QpO1xuICAgIGNvbnN0IGZhY3RzX3F1ZXVlZCA9IG5ldyBIYXNoU2V0KFtmYWN0XSk7XG5cbiAgICBjb25zdCBjbHMgPSBvYmouY29uc3RydWN0b3I7XG5cbiAgICBmb3IgKGNvbnN0IGZhY3RfaSBvZiBmYWN0c190b19jaGVjaykge1xuICAgICAgICBpZiAodHlwZW9mIGFzc3VtcHRpb25zLmdldChmYWN0X2kpICE9PSBcInVuZGVmaW5lZFwiKSB7XG4gICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgfSBlbHNlIGlmIChjbHNbYXNfcHJvcGVydHkoZmFjdCldKSB7XG4gICAgICAgICAgICByZXR1cm4gKGNsc1thc19wcm9wZXJ0eShmYWN0KV0pO1xuICAgICAgICB9XG4gICAgICAgIGxldCBmYWN0X2lfdmFsdWUgPSB1bmRlZmluZWQ7XG4gICAgICAgIGxldCBoYW5kbGVyX2kgPSBoYW5kbGVyX21hcC5nZXQoZmFjdF9pKTtcbiAgICAgICAgaWYgKHR5cGVvZiBoYW5kbGVyX2kgIT09IFwidW5kZWZpbmVkXCIpIHtcbiAgICAgICAgICAgIGZhY3RfaV92YWx1ZSA9IG9ialtoYW5kbGVyX2kubmFtZV0oKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICh0eXBlb2YgZmFjdF9pX3ZhbHVlICE9PSBcInVuZGVmaW5lZFwiKSB7XG4gICAgICAgICAgICBhc3N1bXB0aW9ucy5kZWR1Y2VfYWxsX2ZhY3RzKFtbZmFjdF9pLCBmYWN0X2lfdmFsdWVdXSk7XG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCBmYWN0X3ZhbHVlID0gYXNzdW1wdGlvbnMuZ2V0KGZhY3QpO1xuICAgICAgICBpZiAodHlwZW9mIGZhY3RfdmFsdWUgIT09IFwidW5kZWZpbmVkXCIpIHtcbiAgICAgICAgICAgIHJldHVybiBmYWN0X3ZhbHVlO1xuICAgICAgICB9XG4gICAgICAgIGNvbnN0IGZhY3RzZXQgPSBfYXNzdW1lX3J1bGVzLnByZXJlcS5nZXQoZmFjdF9pKS5kaWZmZXJlbmNlKGZhY3RzX3F1ZXVlZCk7XG4gICAgICAgIGlmIChmYWN0c2V0LnNpemUgIT09IDApIHtcbiAgICAgICAgICAgIGNvbnN0IG5ld19mYWN0c190b19jaGVjayA9IG5ldyBBcnJheShfYXNzdW1lX3J1bGVzLnByZXJlcS5nZXQoZmFjdF9pKS5kaWZmZXJlbmNlKGZhY3RzX3F1ZXVlZCkpO1xuICAgICAgICAgICAgVXRpbC5zaHVmZmxlQXJyYXkobmV3X2ZhY3RzX3RvX2NoZWNrKTtcbiAgICAgICAgICAgIGZhY3RzX3RvX2NoZWNrLnB1c2gobmV3X2ZhY3RzX3RvX2NoZWNrKTtcbiAgICAgICAgICAgIGZhY3RzX3RvX2NoZWNrLmZsYXQoKTtcbiAgICAgICAgICAgIGZhY3RzX3F1ZXVlZC5hZGRBcnIobmV3X2ZhY3RzX3RvX2NoZWNrKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgaWYgKGFzc3VtcHRpb25zLmhhcyhmYWN0KSkge1xuICAgICAgICByZXR1cm4gYXNzdW1wdGlvbnMuZ2V0KGZhY3QpO1xuICAgIH1cblxuICAgIGFzc3VtcHRpb25zLl90ZWxsKGZhY3QsIHVuZGVmaW5lZCk7XG4gICAgcmV0dXJuIHVuZGVmaW5lZDtcbn1cblxuXG5jbGFzcyBNYW5hZ2VkUHJvcGVydGllcyB7XG4gICAgc3RhdGljIGFsbF9leHBsaWNpdF9hc3N1bXB0aW9uczogSGFzaERpY3QgPSBuZXcgSGFzaERpY3QoKTtcbiAgICBzdGF0aWMgYWxsX2RlZmF1bHRfYXNzdW1wdGlvbnM6IEhhc2hTZXQgPSBuZXcgSGFzaFNldCgpO1xuXG5cbiAgICBzdGF0aWMgcmVnaXN0ZXIoY2xzOiBhbnkpIHtcbiAgICAgICAgLy8gcmVnaXN0ZXIgd2l0aCBCYXNpY01ldGEgKHJlY29yZCBjbGFzcyBuYW1lKVxuICAgICAgICBCYXNpY01ldGEucmVnaXN0ZXIoY2xzKTtcblxuICAgICAgICAvLyBGb3IgYWxsIHByb3BlcnRpZXMgd2Ugd2FudCB0byBkZWZpbmUsIGRldGVybWluZSBpZiB0aGV5IGFyZSBkZWZpbmVkXG4gICAgICAgIC8vIGJ5IHRoZSBjbGFzcyBvciBpZiB3ZSBzZXQgdGhlbSBhcyB1bmRlZmluZWQuXG4gICAgICAgIC8vIEFkZCB0aGVzZSBwcm9wZXJ0aWVzIHRvIGEgZGljdCBjYWxsZWQgbG9jYWxfZGVmc1xuICAgICAgICBjb25zdCBsb2NhbF9kZWZzID0gbmV3IEhhc2hEaWN0KCk7XG4gICAgICAgIGZvciAoY29uc3QgayBvZiBfYXNzdW1lX2RlZmluZWQudG9BcnJheSgpKSB7XG4gICAgICAgICAgICBjb25zdCBhdHRybmFtZSA9IGFzX3Byb3BlcnR5KGspO1xuICAgICAgICAgICAgaWYgKGF0dHJuYW1lIGluIGNscykge1xuICAgICAgICAgICAgICAgIGxldCB2ID0gY2xzW2F0dHJuYW1lXTtcbiAgICAgICAgICAgICAgICBpZiAoKHR5cGVvZiB2ID09PSBcIm51bWJlclwiICYmIE51bWJlci5pc0ludGVnZXIodikpIHx8IHR5cGVvZiB2ID09PSBcImJvb2xlYW5cIiB8fCB0eXBlb2YgdiA9PT0gXCJ1bmRlZmluZWRcIikge1xuICAgICAgICAgICAgICAgICAgICBpZiAodHlwZW9mIHYgIT09IFwidW5kZWZpbmVkXCIpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHYgPSAhIXY7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgbG9jYWxfZGVmcy5hZGQoaywgdik7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgLy8gS2VlcCB0cmFjayBvZiB0aGUgZXhwbGljaXQgYXNzdW1wdGlvbnMgZm9yIGFsbCByZWdpc3RlcmVkIGNsYXNzZXMuXG4gICAgICAgIC8vIEZvciBhIGdpdmVuIGNsYXNzLCB0aGlzIGxvb2tzIGxpa2UgdGhlIGFzc3VtcHRpb25zIGZvciBhbGwgb2YgaXRzXG4gICAgICAgIC8vIHN1cGVyY2xhc3NlcyBzaW5jZSB3ZSByZWdpc3RlciBjbGFzc2VzIHRvcC1kb3duLlxuICAgICAgICB0aGlzLmFsbF9leHBsaWNpdF9hc3N1bXB0aW9ucy5tZXJnZShsb2NhbF9kZWZzKTtcblxuICAgICAgICAvLyBTZXQgY2xhc3MgcHJvcGVydGllc1xuICAgICAgICBjbHMuX2V4cGxpY2l0X2NsYXNzX2Fzc3VtcHRpb25zID0gdGhpcy5hbGxfZXhwbGljaXRfYXNzdW1wdGlvbnM7XG4gICAgICAgIGNscy5kZWZhdWx0X2Fzc3VtcHRpb25zID0gbmV3IFN0ZEZhY3RLQih0aGlzLmFsbF9leHBsaWNpdF9hc3N1bXB0aW9ucyk7XG5cbiAgICAgICAgLy8gQWRkIGRlZmF1bHQgYXNzdW1wdGlvbnMgYXMgY2xhc3MgcHJvcGVydGllc1xuICAgICAgICBmb3IgKGNvbnN0IGl0ZW0gb2YgY2xzLmRlZmF1bHRfYXNzdW1wdGlvbnMuZW50cmllcygpKSB7XG4gICAgICAgICAgICBjbHNbYXNfcHJvcGVydHkoaXRlbVswXSldID0gaXRlbVsxXTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIENyZWF0ZSB0d28gc2V0czogb25lIG9mIHRoZSBkZWZhdWx0IGFzc3VtcHRpb24ga2V5cyBmb3IgdGhpcyBjbGFzc1xuICAgICAgICAvLyBhbm90aGVyIGZvciB0aGUgYmFzZSBjbGFzc2VzXG4gICAgICAgIGNvbnN0IHMgPSBuZXcgSGFzaFNldCgpO1xuICAgICAgICBzLmFkZEFycihjbHMuZGVmYXVsdF9hc3N1bXB0aW9ucy5rZXlzKCkpO1xuICAgICAgICB0aGlzLmFsbF9kZWZhdWx0X2Fzc3VtcHRpb25zLmFkZEFycihjbHMuZGVmYXVsdF9hc3N1bXB0aW9ucy5rZXlzKCkpO1xuXG5cbiAgICAgICAgLy8gQWRkIG9ubHkgdGhlIHByb3BlcnRpZXMgZnJvbSBiYXNlIGNsYXNzZXMgdGhhdCB3ZSBkb24ndCBhbHJlYWR5IGhhdmVcbiAgICAgICAgZm9yIChjb25zdCBmYWN0IG9mIHRoaXMuYWxsX2RlZmF1bHRfYXNzdW1wdGlvbnMuZGlmZmVyZW5jZShzKS50b0FycmF5KCkpIHtcbiAgICAgICAgICAgIGNvbnN0IHBuYW1lID0gYXNfcHJvcGVydHkoZmFjdCk7XG4gICAgICAgICAgICBpZiAoIShwbmFtZSBpbiBjbHMpKSB7XG4gICAgICAgICAgICAgICAgbWFrZV9wcm9wZXJ0eShjbHMsIGZhY3QpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgY29uc3QgYWxsZGVmcyA9IG5ldyBIYXNoU2V0KE9iamVjdC5rZXlzKGNscykpO1xuICAgICAgICBmb3IgKGNvbnN0IGZhY3Qgb2YgYWxsZGVmcy5kaWZmZXJlbmNlKGNscy5kZWZhdWx0X2Fzc3VtcHRpb25zKS50b0FycmF5KCkpIHtcbiAgICAgICAgICAgIGNscy5kZWZhdWx0X2Fzc3VtcHRpb25zLmFkZChmYWN0LCBjbHNbZmFjdF0pO1xuICAgICAgICB9XG4gICAgfVxufVxuXG5leHBvcnQge1N0ZEZhY3RLQiwgTWFuYWdlZFByb3BlcnRpZXN9O1xuIiwgIi8qXG5Ob3RhYmxlIGNoYW5nZXMgbWFkZSAoYW5kIG5vdGVzKTpcbi0gVmVyeSBiYXJlYm9uZXMgdmVyc2lvbnMgb2YgY2xhc3NlcyBpbXBsZW1lbnRlZCBzbyBmYXJcbi0gU2FtZSByZWdpc3RyeSBzeXN0ZW0gYXMgU2luZ2xldG9uIC0gdXNpbmcgc3RhdGljIGRpY3Rpb25hcnlcbiovXG5cbi8qIGVzbGludC1kaXNhYmxlIG5ldy1jYXAgKi9cbmNsYXNzIEtpbmRSZWdpc3RyeSB7XG4gICAgc3RhdGljIHJlZ2lzdHJ5OiBSZWNvcmQ8YW55LCBhbnk+ID0ge307XG5cbiAgICBzdGF0aWMgcmVnaXN0ZXIobmFtZTogc3RyaW5nLCBjbHM6IGFueSkge1xuICAgICAgICBLaW5kUmVnaXN0cnkucmVnaXN0cnlbbmFtZV0gPSBuZXcgY2xzKCk7XG4gICAgfVxufVxuXG5jbGFzcyBLaW5kIHsgLy8gISEhIG1ldGFjbGFzcyBzaXR1YXRpb25cbiAgICAvKlxuICAgIEJhc2UgY2xhc3MgZm9yIGtpbmRzLlxuICAgIEtpbmQgb2YgdGhlIG9iamVjdCByZXByZXNlbnRzIHRoZSBtYXRoZW1hdGljYWwgY2xhc3NpZmljYXRpb24gdGhhdFxuICAgIHRoZSBlbnRpdHkgZmFsbHMgaW50by4gSXQgaXMgZXhwZWN0ZWQgdGhhdCBmdW5jdGlvbnMgYW5kIGNsYXNzZXNcbiAgICByZWNvZ25pemUgYW5kIGZpbHRlciB0aGUgYXJndW1lbnQgYnkgaXRzIGtpbmQuXG4gICAgS2luZCBvZiBldmVyeSBvYmplY3QgbXVzdCBiZSBjYXJlZnVsbHkgc2VsZWN0ZWQgc28gdGhhdCBpdCBzaG93cyB0aGVcbiAgICBpbnRlbnRpb24gb2YgZGVzaWduLiBFeHByZXNzaW9ucyBtYXkgaGF2ZSBkaWZmZXJlbnQga2luZCBhY2NvcmRpbmdcbiAgICB0byB0aGUga2luZCBvZiBpdHMgYXJndWVtZW50cy4gRm9yIGV4YW1wbGUsIGFyZ3VlbWVudHMgb2YgYGBBZGRgYFxuICAgIG11c3QgaGF2ZSBjb21tb24ga2luZCBzaW5jZSBhZGRpdGlvbiBpcyBncm91cCBvcGVyYXRvciwgYW5kIHRoZVxuICAgIHJlc3VsdGluZyBgYEFkZCgpYGAgaGFzIHRoZSBzYW1lIGtpbmQuXG4gICAgRm9yIHRoZSBwZXJmb3JtYW5jZSwgZWFjaCBraW5kIGlzIGFzIGJyb2FkIGFzIHBvc3NpYmxlIGFuZCBpcyBub3RcbiAgICBiYXNlZCBvbiBzZXQgdGhlb3J5LiBGb3IgZXhhbXBsZSwgYGBOdW1iZXJLaW5kYGAgaW5jbHVkZXMgbm90IG9ubHlcbiAgICBjb21wbGV4IG51bWJlciBidXQgZXhwcmVzc2lvbiBjb250YWluaW5nIGBgUy5JbmZpbml0eWBgIG9yIGBgUy5OYU5gYFxuICAgIHdoaWNoIGFyZSBub3Qgc3RyaWN0bHkgbnVtYmVyLlxuICAgIEtpbmQgbWF5IGhhdmUgYXJndW1lbnRzIGFzIHBhcmFtZXRlci4gRm9yIGV4YW1wbGUsIGBgTWF0cml4S2luZCgpYGBcbiAgICBtYXkgYmUgY29uc3RydWN0ZWQgd2l0aCBvbmUgZWxlbWVudCB3aGljaCByZXByZXNlbnRzIHRoZSBraW5kIG9mIGl0c1xuICAgIGVsZW1lbnRzLlxuICAgIGBgS2luZGBgIGJlaGF2ZXMgaW4gc2luZ2xldG9uLWxpa2UgZmFzaGlvbi4gU2FtZSBzaWduYXR1cmUgd2lsbFxuICAgIHJldHVybiB0aGUgc2FtZSBvYmplY3QuXG4gICAgKi9cblxuICAgIHN0YXRpYyBuZXcoY2xzOiBhbnksIC4uLmFyZ3M6IGFueSkge1xuICAgICAgICBsZXQgaW5zdDtcbiAgICAgICAgaWYgKGFyZ3MgaW4gS2luZFJlZ2lzdHJ5LnJlZ2lzdHJ5KSB7XG4gICAgICAgICAgICBpbnN0ID0gS2luZFJlZ2lzdHJ5LnJlZ2lzdHJ5W2FyZ3NdO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgS2luZFJlZ2lzdHJ5LnJlZ2lzdGVyKGNscy5uYW1lLCBjbHMpO1xuICAgICAgICAgICAgaW5zdCA9IG5ldyBjbHMoKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gaW5zdDtcbiAgICB9XG59XG5cbmNsYXNzIF9VbmRlZmluZWRLaW5kIGV4dGVuZHMgS2luZCB7XG4gICAgLypcbiAgICBEZWZhdWx0IGtpbmQgZm9yIGFsbCBTeW1QeSBvYmplY3QuIElmIHRoZSBraW5kIGlzIG5vdCBkZWZpbmVkIGZvclxuICAgIHRoZSBvYmplY3QsIG9yIGlmIHRoZSBvYmplY3QgY2Fubm90IGluZmVyIHRoZSBraW5kIGZyb20gaXRzXG4gICAgYXJndW1lbnRzLCB0aGlzIHdpbGwgYmUgcmV0dXJuZWQuXG4gICAgRXhhbXBsZXNcbiAgICA9PT09PT09PVxuICAgID4+PiBmcm9tIHN5bXB5IGltcG9ydCBFeHByXG4gICAgPj4+IEV4cHIoKS5raW5kXG4gICAgVW5kZWZpbmVkS2luZFxuICAgICovXG5cbiAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICAgICAgc3VwZXIoKTtcbiAgICB9XG5cbiAgICBzdGF0aWMgbmV3KCkge1xuICAgICAgICByZXR1cm4gS2luZC5uZXcoX1VuZGVmaW5lZEtpbmQpO1xuICAgIH1cblxuICAgIHRvU3RyaW5nKCkge1xuICAgICAgICByZXR1cm4gXCJVbmRlZmluZWRLaW5kXCI7XG4gICAgfVxufVxuXG5jb25zdCBVbmRlZmluZWRLaW5kID0gX1VuZGVmaW5lZEtpbmQubmV3KCk7XG5cbmNsYXNzIF9OdW1iZXJLaW5kIGV4dGVuZHMgS2luZCB7XG4gICAgLypcbiAgICBLaW5kIGZvciBhbGwgbnVtZXJpYyBvYmplY3QuXG4gICAgVGhpcyBraW5kIHJlcHJlc2VudHMgZXZlcnkgbnVtYmVyLCBpbmNsdWRpbmcgY29tcGxleCBudW1iZXJzLFxuICAgIGluZmluaXR5IGFuZCBgYFMuTmFOYGAuIE90aGVyIG9iamVjdHMgc3VjaCBhcyBxdWF0ZXJuaW9ucyBkbyBub3RcbiAgICBoYXZlIHRoaXMga2luZC5cbiAgICBNb3N0IGBgRXhwcmBgIGFyZSBpbml0aWFsbHkgZGVzaWduZWQgdG8gcmVwcmVzZW50IHRoZSBudW1iZXIsIHNvXG4gICAgdGhpcyB3aWxsIGJlIHRoZSBtb3N0IGNvbW1vbiBraW5kIGluIFN5bVB5IGNvcmUuIEZvciBleGFtcGxlXG4gICAgYGBTeW1ib2woKWBgLCB3aGljaCByZXByZXNlbnRzIGEgc2NhbGFyLCBoYXMgdGhpcyBraW5kIGFzIGxvbmcgYXMgaXRcbiAgICBpcyBjb21tdXRhdGl2ZS5cbiAgICBOdW1iZXJzIGZvcm0gYSBmaWVsZC4gQW55IG9wZXJhdGlvbiBiZXR3ZWVuIG51bWJlci1raW5kIG9iamVjdHMgd2lsbFxuICAgIHJlc3VsdCB0aGlzIGtpbmQgYXMgd2VsbC5cbiAgICBFeGFtcGxlc1xuICAgID09PT09PT09XG4gICAgPj4+IGZyb20gc3ltcHkgaW1wb3J0IFMsIG9vLCBTeW1ib2xcbiAgICA+Pj4gUy5PbmUua2luZFxuICAgIE51bWJlcktpbmRcbiAgICA+Pj4gKC1vbykua2luZFxuICAgIE51bWJlcktpbmRcbiAgICA+Pj4gUy5OYU4ua2luZFxuICAgIE51bWJlcktpbmRcbiAgICBDb21tdXRhdGl2ZSBzeW1ib2wgYXJlIHRyZWF0ZWQgYXMgbnVtYmVyLlxuICAgID4+PiB4ID0gU3ltYm9sKCd4JylcbiAgICA+Pj4geC5raW5kXG4gICAgTnVtYmVyS2luZFxuICAgID4+PiBTeW1ib2woJ3knLCBjb21tdXRhdGl2ZT1GYWxzZSkua2luZFxuICAgIFVuZGVmaW5lZEtpbmRcbiAgICBPcGVyYXRpb24gYmV0d2VlbiBudW1iZXJzIHJlc3VsdHMgbnVtYmVyLlxuICAgID4+PiAoeCsxKS5raW5kXG4gICAgTnVtYmVyS2luZFxuICAgIFNlZSBBbHNvXG4gICAgPT09PT09PT1cbiAgICBzeW1weS5jb3JlLmV4cHIuRXhwci5pc19OdW1iZXIgOiBjaGVjayBpZiB0aGUgb2JqZWN0IGlzIHN0cmljdGx5XG4gICAgc3ViY2xhc3Mgb2YgYGBOdW1iZXJgYCBjbGFzcy5cbiAgICBzeW1weS5jb3JlLmV4cHIuRXhwci5pc19udW1iZXIgOiBjaGVjayBpZiB0aGUgb2JqZWN0IGlzIG51bWJlclxuICAgIHdpdGhvdXQgYW55IGZyZWUgc3ltYm9sLlxuICAgICovXG5cbiAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICAgICAgc3VwZXIoKTtcbiAgICB9XG5cbiAgICBzdGF0aWMgbmV3KCkge1xuICAgICAgICByZXR1cm4gS2luZC5uZXcoX051bWJlcktpbmQpO1xuICAgIH1cblxuICAgIHRvU3RyaW5nKCkge1xuICAgICAgICByZXR1cm4gXCJOdW1iZXJLaW5kXCI7XG4gICAgfVxufVxuXG5jb25zdCBOdW1iZXJLaW5kID0gX051bWJlcktpbmQubmV3KCk7XG5cbmNsYXNzIF9Cb29sZWFuS2luZCBleHRlbmRzIEtpbmQge1xuICAgIC8qXG4gICAgS2luZCBmb3IgYm9vbGVhbiBvYmplY3RzLlxuICAgIFN5bVB5J3MgYGBTLnRydWVgYCwgYGBTLmZhbHNlYGAsIGFuZCBidWlsdC1pbiBgYFRydWVgYCBhbmQgYGBGYWxzZWBgXG4gICAgaGF2ZSB0aGlzIGtpbmQuIEJvb2xlYW4gbnVtYmVyIGBgMWBgIGFuZCBgYDBgYCBhcmUgbm90IHJlbGV2ZW50LlxuICAgIEV4YW1wbGVzXG4gICAgPT09PT09PT1cbiAgICA+Pj4gZnJvbSBzeW1weSBpbXBvcnQgUywgUVxuICAgID4+PiBTLnRydWUua2luZFxuICAgIEJvb2xlYW5LaW5kXG4gICAgPj4+IFEuZXZlbigzKS5raW5kXG4gICAgQm9vbGVhbktpbmRcbiAgICAqL1xuXG4gICAgY29uc3RydWN0b3IoKSB7XG4gICAgICAgIHN1cGVyKCk7XG4gICAgfVxuXG4gICAgc3RhdGljIG5ldygpIHtcbiAgICAgICAgcmV0dXJuIEtpbmQubmV3KF9Cb29sZWFuS2luZCk7XG4gICAgfVxuXG4gICAgdG9TdHJpbmcoKSB7XG4gICAgICAgIHJldHVybiBcIkJvb2xlYW5LaW5kXCI7XG4gICAgfVxufVxuXG5jb25zdCBCb29sZWFuS2luZCA9IF9Cb29sZWFuS2luZC5uZXcoKTtcblxuXG5leHBvcnQge1VuZGVmaW5lZEtpbmQsIE51bWJlcktpbmQsIEJvb2xlYW5LaW5kfTtcbiIsICJjbGFzcyBwcmVvcmRlcl90cmF2ZXJzYWwge1xuICAgIC8qXG4gICAgRG8gYSBwcmUtb3JkZXIgdHJhdmVyc2FsIG9mIGEgdHJlZS5cbiAgICBUaGlzIGl0ZXJhdG9yIHJlY3Vyc2l2ZWx5IHlpZWxkcyBub2RlcyB0aGF0IGl0IGhhcyB2aXNpdGVkIGluIGEgcHJlLW9yZGVyXG4gICAgZmFzaGlvbi4gVGhhdCBpcywgaXQgeWllbGRzIHRoZSBjdXJyZW50IG5vZGUgdGhlbiBkZXNjZW5kcyB0aHJvdWdoIHRoZVxuICAgIHRyZWUgYnJlYWR0aC1maXJzdCB0byB5aWVsZCBhbGwgb2YgYSBub2RlJ3MgY2hpbGRyZW4ncyBwcmUtb3JkZXJcbiAgICB0cmF2ZXJzYWwuXG4gICAgRm9yIGFuIGV4cHJlc3Npb24sIHRoZSBvcmRlciBvZiB0aGUgdHJhdmVyc2FsIGRlcGVuZHMgb24gdGhlIG9yZGVyIG9mXG4gICAgLmFyZ3MsIHdoaWNoIGluIG1hbnkgY2FzZXMgY2FuIGJlIGFyYml0cmFyeS5cbiAgICBQYXJhbWV0ZXJzXG4gICAgPT09PT09PT09PVxuICAgIG5vZGUgOiBTeW1QeSBleHByZXNzaW9uXG4gICAgICAgIFRoZSBleHByZXNzaW9uIHRvIHRyYXZlcnNlLlxuICAgIGtleXMgOiAoZGVmYXVsdCBOb25lKSBzb3J0IGtleShzKVxuICAgICAgICBUaGUga2V5KHMpIHVzZWQgdG8gc29ydCBhcmdzIG9mIEJhc2ljIG9iamVjdHMuIFdoZW4gTm9uZSwgYXJncyBvZiBCYXNpY1xuICAgICAgICBvYmplY3RzIGFyZSBwcm9jZXNzZWQgaW4gYXJiaXRyYXJ5IG9yZGVyLiBJZiBrZXkgaXMgZGVmaW5lZCwgaXQgd2lsbFxuICAgICAgICBiZSBwYXNzZWQgYWxvbmcgdG8gb3JkZXJlZCgpIGFzIHRoZSBvbmx5IGtleShzKSB0byB1c2UgdG8gc29ydCB0aGVcbiAgICAgICAgYXJndW1lbnRzOyBpZiBgYGtleWBgIGlzIHNpbXBseSBUcnVlIHRoZW4gdGhlIGRlZmF1bHQga2V5cyBvZiBvcmRlcmVkXG4gICAgICAgIHdpbGwgYmUgdXNlZC5cbiAgICBZaWVsZHNcbiAgICA9PT09PT1cbiAgICBzdWJ0cmVlIDogU3ltUHkgZXhwcmVzc2lvblxuICAgICAgICBBbGwgb2YgdGhlIHN1YnRyZWVzIGluIHRoZSB0cmVlLlxuICAgIEV4YW1wbGVzXG4gICAgPT09PT09PT1cbiAgICA+Pj4gZnJvbSBzeW1weSBpbXBvcnQgcHJlb3JkZXJfdHJhdmVyc2FsLCBzeW1ib2xzXG4gICAgPj4+IHgsIHksIHogPSBzeW1ib2xzKCd4IHkgeicpXG4gICAgVGhlIG5vZGVzIGFyZSByZXR1cm5lZCBpbiB0aGUgb3JkZXIgdGhhdCB0aGV5IGFyZSBlbmNvdW50ZXJlZCB1bmxlc3Mga2V5XG4gICAgaXMgZ2l2ZW47IHNpbXBseSBwYXNzaW5nIGtleT1UcnVlIHdpbGwgZ3VhcmFudGVlIHRoYXQgdGhlIHRyYXZlcnNhbCBpc1xuICAgIHVuaXF1ZS5cbiAgICA+Pj4gbGlzdChwcmVvcmRlcl90cmF2ZXJzYWwoKHggKyB5KSp6LCBrZXlzPU5vbmUpKSAjIGRvY3Rlc3Q6ICtTS0lQXG4gICAgW3oqKHggKyB5KSwgeiwgeCArIHksIHksIHhdXG4gICAgPj4+IGxpc3QocHJlb3JkZXJfdHJhdmVyc2FsKCh4ICsgeSkqeiwga2V5cz1UcnVlKSlcbiAgICBbeiooeCArIHkpLCB6LCB4ICsgeSwgeCwgeV1cbiAgICAqL1xuXG4gICAgX3NraXBfZmxhZzogYW55O1xuICAgIF9wdDogYW55O1xuICAgIGNvbnN0cnVjdG9yKG5vZGU6IGFueSkge1xuICAgICAgICB0aGlzLl9za2lwX2ZsYWcgPSBmYWxzZTtcbiAgICAgICAgdGhpcy5fcHQgPSB0aGlzLl9wcmVvcmRlcl90cmF2ZXJzYWwobm9kZSk7XG4gICAgfVxuXG4gICAgKiBfcHJlb3JkZXJfdHJhdmVyc2FsKG5vZGU6IGFueSk6IGFueSB7XG4gICAgICAgIHlpZWxkIG5vZGU7XG4gICAgICAgIGlmICh0aGlzLl9za2lwX2ZsYWcpIHtcbiAgICAgICAgICAgIHRoaXMuX3NraXBfZmxhZyA9IGZhbHNlO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIGlmIChub2RlLmluc3RhbmNlb2ZCYXNpYykge1xuICAgICAgICAgICAgbGV0IGFyZ3M7XG4gICAgICAgICAgICBpZiAobm9kZS5fYXJnc2V0KSB7XG4gICAgICAgICAgICAgICAgYXJncyA9IG5vZGUuX2FyZ3NldDtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgYXJncyA9IG5vZGUuX2FyZ3M7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBmb3IgKGNvbnN0IGFyZyBvZiBhcmdzKSB7XG4gICAgICAgICAgICAgICAgZm9yIChjb25zdCB2YWwgb2YgdGhpcy5fcHJlb3JkZXJfdHJhdmVyc2FsKGFyZykpIHtcbiAgICAgICAgICAgICAgICAgICAgeWllbGQgdmFsO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIGlmIChTeW1ib2wuaXRlcmF0b3IgaW4gT2JqZWN0KG5vZGUpKSB7XG4gICAgICAgICAgICBmb3IgKGNvbnN0IGl0ZW0gb2Ygbm9kZSkge1xuICAgICAgICAgICAgICAgIGZvciAoY29uc3QgdmFsIG9mIHRoaXMuX3ByZW9yZGVyX3RyYXZlcnNhbChpdGVtKSkge1xuICAgICAgICAgICAgICAgICAgICB5aWVsZCB2YWw7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgYXNJdGVyKCkge1xuICAgICAgICBjb25zdCByZXM6IGFueVtdID0gW107XG4gICAgICAgIGZvciAoY29uc3QgaXRlbSBvZiB0aGlzLl9wdCkge1xuICAgICAgICAgICAgcmVzLnB1c2goaXRlbSk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHJlcztcbiAgICB9XG59XG5cbmV4cG9ydCB7cHJlb3JkZXJfdHJhdmVyc2FsfTtcbiIsICIvKlxuTm90YWJsZSBjaGFuZ2VzIG1hZGUgKGFuZCBub3Rlcyk6XG4tIEJhc2ljIHJld29ya2VkIHdpdGggY29uc3RydWN0b3Igc3lzdGVtXG4tIEJhc2ljIGhhbmRsZXMgT0JKRUNUIHByb3BlcnRpZXMsIE1hbmFnZWRQcm9wZXJ0aWVzIGhhbmRsZXMgQ0xBU1MgcHJvcGVydGllc1xuLSBfZXZhbF9pcyBwcm9wZXJ0aWVzIChkZXBlbmRlbnQgb24gb2JqZWN0KSBhcmUgbm93IGFzc2lnbmVkIGluIEJhc2ljXG4tIFNvbWUgcHJvcGVydGllcyBvZiBCYXNpYyAoYW5kIHN1YmNsYXNzZXMpIGFyZSBzdGF0aWNcbiovXG5cbmltcG9ydCB7YXNfcHJvcGVydHksIG1ha2VfcHJvcGVydHksIE1hbmFnZWRQcm9wZXJ0aWVzLCBfYXNzdW1lX2RlZmluZWR9IGZyb20gXCIuL2Fzc3VtcHRpb25zLmpzXCI7XG5pbXBvcnQge1V0aWwsIEhhc2hEaWN0LCBtaXgsIGJhc2UsIEhhc2hTZXR9IGZyb20gXCIuL3V0aWxpdHkuanNcIjtcbmltcG9ydCB7VW5kZWZpbmVkS2luZH0gZnJvbSBcIi4va2luZC5qc1wiO1xuaW1wb3J0IHtwcmVvcmRlcl90cmF2ZXJzYWx9IGZyb20gXCIuL3RyYXZlcnNhbC5qc1wiO1xuXG5cbmNvbnN0IF9CYXNpYyA9IChzdXBlcmNsYXNzOiBhbnkpID0+IGNsYXNzIF9CYXNpYyBleHRlbmRzIHN1cGVyY2xhc3Mge1xuICAgIC8qXG4gICAgQmFzZSBjbGFzcyBmb3IgYWxsIFN5bVB5IG9iamVjdHMuXG4gICAgTm90ZXMgYW5kIGNvbnZlbnRpb25zXG4gICAgPT09PT09PT09PT09PT09PT09PT09XG4gICAgMSkgQWx3YXlzIHVzZSBgYC5hcmdzYGAsIHdoZW4gYWNjZXNzaW5nIHBhcmFtZXRlcnMgb2Ygc29tZSBpbnN0YW5jZTpcbiAgICA+Pj4gZnJvbSBzeW1weSBpbXBvcnQgY290XG4gICAgPj4+IGZyb20gc3ltcHkuYWJjIGltcG9ydCB4LCB5XG4gICAgPj4+IGNvdCh4KS5hcmdzXG4gICAgKHgsKVxuICAgID4+PiBjb3QoeCkuYXJnc1swXVxuICAgIHhcbiAgICA+Pj4gKHgqeSkuYXJnc1xuICAgICh4LCB5KVxuICAgID4+PiAoeCp5KS5hcmdzWzFdXG4gICAgeVxuICAgIDIpIE5ldmVyIHVzZSBpbnRlcm5hbCBtZXRob2RzIG9yIHZhcmlhYmxlcyAodGhlIG9uZXMgcHJlZml4ZWQgd2l0aCBgYF9gYCk6XG4gICAgPj4+IGNvdCh4KS5fYXJncyAgICAjIGRvIG5vdCB1c2UgdGhpcywgdXNlIGNvdCh4KS5hcmdzIGluc3RlYWRcbiAgICAoeCwpXG4gICAgMykgIEJ5IFwiU3ltUHkgb2JqZWN0XCIgd2UgbWVhbiBzb21ldGhpbmcgdGhhdCBjYW4gYmUgcmV0dXJuZWQgYnlcbiAgICAgICAgYGBzeW1waWZ5YGAuICBCdXQgbm90IGFsbCBvYmplY3RzIG9uZSBlbmNvdW50ZXJzIHVzaW5nIFN5bVB5IGFyZVxuICAgICAgICBzdWJjbGFzc2VzIG9mIEJhc2ljLiAgRm9yIGV4YW1wbGUsIG11dGFibGUgb2JqZWN0cyBhcmUgbm90OlxuICAgICAgICA+Pj4gZnJvbSBzeW1weSBpbXBvcnQgQmFzaWMsIE1hdHJpeCwgc3ltcGlmeVxuICAgICAgICA+Pj4gQSA9IE1hdHJpeChbWzEsIDJdLCBbMywgNF1dKS5hc19tdXRhYmxlKClcbiAgICAgICAgPj4+IGlzaW5zdGFuY2UoQSwgQmFzaWMpXG4gICAgICAgIEZhbHNlXG4gICAgICAgID4+PiBCID0gc3ltcGlmeShBKVxuICAgICAgICA+Pj4gaXNpbnN0YW5jZShCLCBCYXNpYylcbiAgICAgICAgVHJ1ZVxuICAgICovXG5cbiAgICBfX3Nsb3RzX18gPSBbXCJfbWhhc2hcIiwgXCJfYXJnc1wiLCBcIl9hc3N1bXB0aW9uc1wiXTtcbiAgICBfYXJnczogYW55W107XG4gICAgX21oYXNoOiBOdW1iZXIgfCB1bmRlZmluZWQ7XG4gICAgX2Fzc3VtcHRpb25zO1xuXG4gICAgLy8gVG8gYmUgb3ZlcnJpZGRlbiB3aXRoIFRydWUgaW4gdGhlIGFwcHJvcHJpYXRlIHN1YmNsYXNzZXNcbiAgICBzdGF0aWMgaXNfbnVtYmVyID0gZmFsc2U7XG4gICAgc3RhdGljIGlzX0F0b20gPSBmYWxzZTtcbiAgICBzdGF0aWMgaXNfU3ltYm9sID0gZmFsc2U7XG4gICAgc3RhdGljIGlzX3N5bWJvbCA9IGZhbHNlO1xuICAgIHN0YXRpYyBpc19JbmRleGVkID0gZmFsc2U7XG4gICAgc3RhdGljIGlzX0R1bW15ID0gZmFsc2U7XG4gICAgc3RhdGljIGlzX1dpbGQgPSBmYWxzZTtcbiAgICBzdGF0aWMgaXNfRnVuY3Rpb24gPSBmYWxzZTtcbiAgICBzdGF0aWMgaXNfQWRkID0gZmFsc2U7XG4gICAgc3RhdGljIGlzX011bCA9IGZhbHNlO1xuICAgIHN0YXRpYyBpc19Qb3cgPSBmYWxzZTtcbiAgICBzdGF0aWMgaXNfTnVtYmVyID0gZmFsc2U7XG4gICAgc3RhdGljIGlzX0Zsb2F0ID0gZmFsc2U7XG4gICAgc3RhdGljIGlzX1JhdGlvbmFsID0gZmFsc2U7XG4gICAgc3RhdGljIGlzX0ludGVnZXIgPSBmYWxzZTtcbiAgICBzdGF0aWMgaXNfTnVtYmVyU3ltYm9sID0gZmFsc2U7XG4gICAgc3RhdGljIGlzX09yZGVyID0gZmFsc2U7XG4gICAgc3RhdGljIGlzX0Rlcml2YXRpdmUgPSBmYWxzZTtcbiAgICBzdGF0aWMgaXNfUGllY2V3aXNlID0gZmFsc2U7XG4gICAgc3RhdGljIGlzX1BvbHkgPSBmYWxzZTtcbiAgICBzdGF0aWMgaXNfQWxnZWJyYWljTnVtYmVyID0gZmFsc2U7XG4gICAgc3RhdGljIGlzX1JlbGF0aW9uYWwgPSBmYWxzZTtcbiAgICBzdGF0aWMgaXNfRXF1YWxpdHkgPSBmYWxzZTtcbiAgICBzdGF0aWMgaXNfQm9vbGVhbiA9IGZhbHNlO1xuICAgIHN0YXRpYyBpc19Ob3QgPSBmYWxzZTtcbiAgICBzdGF0aWMgaXNfTWF0cml4ID0gZmFsc2U7XG4gICAgc3RhdGljIGlzX1ZlY3RvciA9IGZhbHNlO1xuICAgIHN0YXRpYyBpc19Qb2ludCA9IGZhbHNlO1xuICAgIHN0YXRpYyBpc19NYXRBZGQgPSBmYWxzZTtcbiAgICBzdGF0aWMgaXNfTWF0TXVsID0gZmFsc2U7XG4gICAgc3RhdGljIGlzX25lZ2F0aXZlOiBib29sZWFuIHwgdW5kZWZpbmVkO1xuICAgIHN0YXRpYyBpc19jb21tdXRhdGl2ZTogYm9vbGVhbiB8IHVuZGVmaW5lZDtcblxuICAgIHN0YXRpYyBraW5kID0gVW5kZWZpbmVkS2luZDtcbiAgICBzdGF0aWMgYWxsX3VuaXF1ZV9wcm9wczogSGFzaFNldCA9IG5ldyBIYXNoU2V0KCk7XG5cbiAgICBjb25zdHJ1Y3RvciguLi5hcmdzOiBhbnkpIHtcbiAgICAgICAgc3VwZXIoKTtcbiAgICAgICAgY29uc3QgY2xzOiBhbnkgPSB0aGlzLmNvbnN0cnVjdG9yO1xuICAgICAgICB0aGlzLl9hc3N1bXB0aW9ucyA9IGNscy5kZWZhdWx0X2Fzc3VtcHRpb25zLnN0ZGNsb25lKCk7XG4gICAgICAgIHRoaXMuX21oYXNoID0gdW5kZWZpbmVkO1xuICAgICAgICB0aGlzLl9hcmdzID0gYXJncztcbiAgICAgICAgLy8gQ3JlYXRlIGEgZGljdGlvbmFyeSB0byBoYW5kbGUgdGhlIGN1cnJlbnQgcHJvcGVydGllcyBvZiB0aGUgY2xhc3NcbiAgICAgICAgLy8gT25seSBldnVhdGVkIG9uY2UgcGVyIGNsYXNzXG4gICAgICAgIGlmICh0eXBlb2YgY2xzLl9wcm9wX2hhbmRsZXIgPT09IFwidW5kZWZpbmVkXCIpIHtcbiAgICAgICAgICAgIGNscy5fcHJvcF9oYW5kbGVyID0gbmV3IEhhc2hEaWN0KCk7XG4gICAgICAgICAgICBmb3IgKGNvbnN0IGsgb2YgX2Fzc3VtZV9kZWZpbmVkLnRvQXJyYXkoKSkge1xuICAgICAgICAgICAgICAgIGNvbnN0IG1ldGgxID0gXCJfZXZhbF9pc19cIiArIGs7XG4gICAgICAgICAgICAgICAgaWYgKHRoaXNbbWV0aDFdKSB7XG4gICAgICAgICAgICAgICAgICAgIGNscy5fcHJvcF9oYW5kbGVyLmFkZChrLCB0aGlzW21ldGgxXSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIC8vIEFkZCBhbGwgZGVmaW5lZCBwcm9wZXJ0aWVzXG4gICAgICAgIHRoaXMuX3Byb3BfaGFuZGxlciA9IGNscy5fcHJvcF9oYW5kbGVyLmNvcHkoKTtcbiAgICAgICAgZm9yIChjb25zdCBmYWN0IG9mIF9hc3N1bWVfZGVmaW5lZC50b0FycmF5KCkpIHtcbiAgICAgICAgICAgIGNvbnN0IHBuYW1lID0gYXNfcHJvcGVydHkoZmFjdCk7XG4gICAgICAgICAgICBpZiAodHlwZW9mIGNsc1twbmFtZV0gPT09IFwidW5kZWZpbmVkXCIpIHtcbiAgICAgICAgICAgICAgICBtYWtlX3Byb3BlcnR5KHRoaXMsIGZhY3QpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgLy8gU1lNVFlQRSBBRERJVElPTjogYWRkIHN0YXRpYyB2YXJpYWJsZXMgYXMgb2JqZWN0IHByb3BlcnRpZXNcblxuXG4gICAgICAgIC8vIGhlbHBlciBmdW5jdGlvbiB0byBnZXQgc3VwZXIgY2xhc3NlcyBvZiBvdXIgY3VycmVudCBjbGFzc1xuICAgICAgICBmdW5jdGlvbiBnZXRTdXBlcnMoY2xzOiBhbnkpOiBhbnlbXSB7XG4gICAgICAgICAgICBjb25zdCBzdXBlcmNsYXNzZXMgPSBbXTtcbiAgICAgICAgICAgIGNvbnN0IHN1cGVyY2xhc3MgPSBPYmplY3QuZ2V0UHJvdG90eXBlT2YoY2xzKTtcbiAgICAgICAgICBcbiAgICAgICAgICAgIGlmIChzdXBlcmNsYXNzICE9PSBudWxsICYmIHN1cGVyY2xhc3MgIT09IE9iamVjdC5wcm90b3R5cGUpIHtcbiAgICAgICAgICAgICAgICBzdXBlcmNsYXNzZXMucHVzaChzdXBlcmNsYXNzKTtcbiAgICAgICAgICAgICAgICBjb25zdCBwYXJlbnRTdXBlcmNsYXNzZXMgPSBnZXRTdXBlcnMoc3VwZXJjbGFzcyk7XG4gICAgICAgICAgICAgICAgc3VwZXJjbGFzc2VzLnB1c2goLi4ucGFyZW50U3VwZXJjbGFzc2VzKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICBcbiAgICAgICAgICAgIHJldHVybiBzdXBlcmNsYXNzZXM7XG4gICAgICAgIH1cbiAgICBcbiAgICAgICAgLy8gZ2V0IHRoZSBzdGF0aWMgdmFyaWFibGVzIG9mIHRoaXMgY2xhc3MgYW5kIGFzc2lnbiB0byBvYmplY3RcbiAgICAgICAgY29uc3QgY3VycmVudFN0YXRpY1ZhcnMgPSBPYmplY3QuZ2V0T3duUHJvcGVydHlOYW1lcyhjbHMpLmZpbHRlcihwcm9wID0+IHByb3AuaW5jbHVkZXMoXCJpc19cIikpO1xuICAgICAgICBmb3IgKGNvbnN0IHByb3Agb2YgY3VycmVudFN0YXRpY1ZhcnMpIHtcbiAgICAgICAgICAgIHRoaXNbcHJvcF0gPSAoKSA9PiBjbHNbcHJvcF07XG4gICAgICAgIH1cbiAgICAgICAgXG4gICAgICAgIC8vIGdldCB0aGUgc3RhdGljIHZhcmlhYmxlcyBvZiBhbGwgc3VwZXJjbGFzc2VzIGFuZCBhc3NpZ24gdG8gb2JqZWN0XG4gICAgICAgIC8vIG5vdGUgdGhhdCB3ZSBvbmx5IGFzc2lnbiB0aGUgcHJvcGVydGllcyBpZiB0aGV5IGFyZSB1bmRlZmluZWQgXG4gICAgICAgIGNvbnN0IHN1cGVyczogYW55W10gPSBnZXRTdXBlcnMoY2xzKTtcbiAgICAgICAgZm9yIChjb25zdCBzdXBlcmNscyBvZiBzdXBlcnMpIHtcbiAgICAgICAgICAgIGNvbnN0IHN1cGVyY2xhc3NTdGF0aWNWYXJzID0gT2JqZWN0LmdldE93blByb3BlcnR5TmFtZXMoc3VwZXJjbHMpLmZpbHRlcihwcm9wID0+IHByb3AuaW5jbHVkZXMoXCJpc19cIikpO1xuICAgICAgICAgICAgZm9yIChjb25zdCBwcm9wIG9mIHN1cGVyY2xhc3NTdGF0aWNWYXJzKSB7XG4gICAgICAgICAgICAgICAgaWYgKHR5cGVvZiB0aGlzW3Byb3BdID09IFwidW5kZWZpbmVkXCIpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpc1twcm9wXSA9ICgpID0+IGNsc1twcm9wXTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBfX2dldG5ld2FyZ3NfXygpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX2FyZ3M7XG4gICAgfVxuXG4gICAgX19nZXRzdGF0ZV9fKCk6IGFueSB7XG4gICAgICAgIHJldHVybiB1bmRlZmluZWQ7XG4gICAgfVxuXG4gICAgaGFzaCgpIHtcbiAgICAgICAgaWYgKHR5cGVvZiB0aGlzLl9taGFzaCA9PT0gXCJ1bmRlZmluZWRcIikge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuY29uc3RydWN0b3IubmFtZSArIHRoaXMuaGFzaEtleSgpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0aGlzLl9taGFzaDtcbiAgICB9XG5cbiAgICAvLyBiYW5kYWlkIHNvbHV0aW9uIGZvciBpbnN0YW5jZW9mIGlzc3VlIC0gc3RpbGwgbmVlZCB0byBmaXhcbiAgICBpbnN0YW5jZW9mQmFzaWMoKSB7XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cblxuICAgIGFzc3VtcHRpb25zMCgpIHtcbiAgICAgICAgLypcbiAgICAgICAgUmV0dXJuIG9iamVjdCBgdHlwZWAgYXNzdW1wdGlvbnMuXG4gICAgICAgIEZvciBleGFtcGxlOlxuICAgICAgICAgIFN5bWJvbCgneCcsIHJlYWw9VHJ1ZSlcbiAgICAgICAgICBTeW1ib2woJ3gnLCBpbnRlZ2VyPVRydWUpXG4gICAgICAgIGFyZSBkaWZmZXJlbnQgb2JqZWN0cy4gSW4gb3RoZXIgd29yZHMsIGJlc2lkZXMgUHl0aG9uIHR5cGUgKFN5bWJvbCBpblxuICAgICAgICB0aGlzIGNhc2UpLCB0aGUgaW5pdGlhbCBhc3N1bXB0aW9ucyBhcmUgYWxzbyBmb3JtaW5nIHRoZWlyIHR5cGVpbmZvLlxuICAgICAgICBFeGFtcGxlc1xuICAgICAgICA9PT09PT09PVxuICAgICAgICA+Pj4gZnJvbSBzeW1weSBpbXBvcnQgU3ltYm9sXG4gICAgICAgID4+PiBmcm9tIHN5bXB5LmFiYyBpbXBvcnQgeFxuICAgICAgICA+Pj4geC5hc3N1bXB0aW9uczBcbiAgICAgICAgeydjb21tdXRhdGl2ZSc6IFRydWV9XG4gICAgICAgID4+PiB4ID0gU3ltYm9sKFwieFwiLCBwb3NpdGl2ZT1UcnVlKVxuICAgICAgICA+Pj4geC5hc3N1bXB0aW9uczBcbiAgICAgICAgeydjb21tdXRhdGl2ZSc6IFRydWUsICdjb21wbGV4JzogVHJ1ZSwgJ2V4dGVuZGVkX25lZ2F0aXZlJzogRmFsc2UsXG4gICAgICAgICAnZXh0ZW5kZWRfbm9ubmVnYXRpdmUnOiBUcnVlLCAnZXh0ZW5kZWRfbm9ucG9zaXRpdmUnOiBGYWxzZSxcbiAgICAgICAgICdleHRlbmRlZF9ub256ZXJvJzogVHJ1ZSwgJ2V4dGVuZGVkX3Bvc2l0aXZlJzogVHJ1ZSwgJ2V4dGVuZGVkX3JlYWwnOlxuICAgICAgICAgVHJ1ZSwgJ2Zpbml0ZSc6IFRydWUsICdoZXJtaXRpYW4nOiBUcnVlLCAnaW1hZ2luYXJ5JzogRmFsc2UsXG4gICAgICAgICAnaW5maW5pdGUnOiBGYWxzZSwgJ25lZ2F0aXZlJzogRmFsc2UsICdub25uZWdhdGl2ZSc6IFRydWUsXG4gICAgICAgICAnbm9ucG9zaXRpdmUnOiBGYWxzZSwgJ25vbnplcm8nOiBUcnVlLCAncG9zaXRpdmUnOiBUcnVlLCAncmVhbCc6XG4gICAgICAgICBUcnVlLCAnemVybyc6IEZhbHNlfVxuICAgICAgICAqL1xuICAgICAgICByZXR1cm4ge307XG4gICAgfVxuXG4gICAgaGFzaEtleSgpIHtcbiAgICAgICAgLyogUmV0dXJuIGEgdHVwbGUgb2YgaW5mb3JtYXRpb24gYWJvdXQgc2VsZiB0aGF0IGNhbiBiZSB1c2VkIHRvXG4gICAgICAgIGNvbXB1dGUgdGhlIGhhc2guIElmIGEgY2xhc3MgZGVmaW5lcyBhZGRpdGlvbmFsIGF0dHJpYnV0ZXMsXG4gICAgICAgIGxpa2UgYGBuYW1lYGAgaW4gU3ltYm9sLCB0aGVuIHRoaXMgbWV0aG9kIHNob3VsZCBiZSB1cGRhdGVkXG4gICAgICAgIGFjY29yZGluZ2x5IHRvIHJldHVybiBzdWNoIHJlbGV2YW50IGF0dHJpYnV0ZXMuXG4gICAgICAgIERlZmluaW5nIG1vcmUgdGhhbiBfaGFzaGFibGVfY29udGVudCBpcyBuZWNlc3NhcnkgaWYgX19lcV9fIGhhc1xuICAgICAgICBiZWVuIGRlZmluZWQgYnkgYSBjbGFzcy4gU2VlIG5vdGUgYWJvdXQgdGhpcyBpbiBCYXNpYy5fX2VxX18uKi9cblxuICAgICAgICByZXR1cm4gdGhpcy5fYXJncztcbiAgICB9XG5cbiAgICBzdGF0aWMgY21wKHNlbGY6IGFueSwgb3RoZXI6IGFueSk6IGFueSB7XG4gICAgICAgIC8qXG4gICAgICAgIFJldHVybiAtMSwgMCwgMSBpZiB0aGUgb2JqZWN0IGlzIHNtYWxsZXIsIGVxdWFsLCBvciBncmVhdGVyIHRoYW4gb3RoZXIuXG4gICAgICAgIE5vdCBpbiB0aGUgbWF0aGVtYXRpY2FsIHNlbnNlLiBJZiB0aGUgb2JqZWN0IGlzIG9mIGEgZGlmZmVyZW50IHR5cGVcbiAgICAgICAgZnJvbSB0aGUgXCJvdGhlclwiIHRoZW4gdGhlaXIgY2xhc3NlcyBhcmUgb3JkZXJlZCBhY2NvcmRpbmcgdG9cbiAgICAgICAgdGhlIHNvcnRlZF9jbGFzc2VzIGxpc3QuXG4gICAgICAgIEV4YW1wbGVzXG4gICAgICAgID09PT09PT09XG4gICAgICAgID4+PiBmcm9tIHN5bXB5LmFiYyBpbXBvcnQgeCwgeVxuICAgICAgICA+Pj4geC5jb21wYXJlKHkpXG4gICAgICAgIC0xXG4gICAgICAgID4+PiB4LmNvbXBhcmUoeClcbiAgICAgICAgMFxuICAgICAgICA+Pj4geS5jb21wYXJlKHgpXG4gICAgICAgIDFcbiAgICAgICAgKi9cbiAgICAgICAgaWYgKHNlbGYgPT09IG90aGVyKSB7XG4gICAgICAgICAgICByZXR1cm4gMDtcbiAgICAgICAgfVxuICAgICAgICBjb25zdCBuMSA9IHNlbGYuY29uc3RydWN0b3IubmFtZTtcbiAgICAgICAgY29uc3QgbjIgPSBvdGhlci5jb25zdHJ1Y3Rvci5uYW1lO1xuICAgICAgICBpZiAobjEgJiYgbjIpIHtcbiAgICAgICAgICAgIHJldHVybiAobjEgPiBuMiBhcyB1bmtub3duIGFzIG51bWJlcikgLSAobjEgPCBuMiBhcyB1bmtub3duIGFzIG51bWJlcik7XG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCBzdCA9IHNlbGYuX2hhc2hhYmxlX2NvbnRlbnQoKTtcbiAgICAgICAgY29uc3Qgb3QgPSBvdGhlci5faGFzaGFibGVfY29udGVudCgpO1xuICAgICAgICBpZiAoc3QgJiYgb3QpIHtcbiAgICAgICAgICAgIHJldHVybiAoc3QubGVuZ3RoID4gb3QubGVuZ3RoIGFzIHVua25vd24gYXMgbnVtYmVyKSAtIChzdC5sZW5ndGggPCBvdC5sZW5ndGggYXMgdW5rbm93biBhcyBudW1iZXIpO1xuICAgICAgICB9XG4gICAgICAgIGZvciAoY29uc3QgZWxlbSBvZiBVdGlsLnppcChzdCwgb3QpKSB7XG4gICAgICAgICAgICBjb25zdCBsID0gZWxlbVswXTtcbiAgICAgICAgICAgIGNvbnN0IHIgPSBlbGVtWzFdO1xuICAgICAgICAgICAgLy8gISEhIHNraXBwaW5nIGZyb3plbnNldCBzdHVmZlxuICAgICAgICAgICAgbGV0IGM7XG4gICAgICAgICAgICBpZiAobCBpbnN0YW5jZW9mIEJhc2ljKSB7XG4gICAgICAgICAgICAgICAgYyA9IGwuY21wKHIpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBjID0gKGwgPiByIGFzIHVua25vd24gYXMgbnVtYmVyKSAtIChsIDwgciBhcyB1bmtub3duIGFzIG51bWJlcik7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoYykge1xuICAgICAgICAgICAgICAgIHJldHVybiBjO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiAwO1xuICAgIH1cblxuICAgIF9jb25zdHJ1Y3Rvcl9wb3N0cHJvY2Vzc29yX21hcHBpbmc6IFJlY29yZDxhbnksIGFueT4gPSB7fTtcblxuICAgIF9leGVjX2NvbnN0cnVjdG9yX3Bvc3Rwcm9jZXNzb3JzKG9iajogYW55KSB7XG4gICAgICAgIGNvbnN0IGNsc25hbWUgPSB0aGlzLmNvbnN0cnVjdG9yLm5hbWU7XG4gICAgICAgIGNvbnN0IHBvc3Rwcm9jZXNzb3JzID0gbmV3IEhhc2hEaWN0KCk7XG4gICAgICAgIC8vICEhISBmb3IgbG9vcCBub3QgaW1wbGVtZW50ZWQgLSBjb21wbGljYXRlZCB0byByZWNyZWF0ZVxuICAgICAgICBmb3IgKGNvbnN0IGYgb2YgcG9zdHByb2Nlc3NvcnMuZ2V0KGNsc25hbWUsIFtdKSkge1xuICAgICAgICAgICAgb2JqID0gZihvYmopO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBvYmo7XG4gICAgfVxuXG4gICAgX2V2YWxfc3VicyhvbGQ6IGFueSwgX25ldzogYW55KTogYW55IHtcbiAgICAgICAgLy8gZG9uJ3QgbmVlZCBhbnkgb3RoZXIgdXRpbGl0aWVzIHVudGlsIHdlIGRvIG1vcmUgY29tcGxpY2F0ZWQgc3Vic1xuICAgICAgICByZXR1cm4gdW5kZWZpbmVkO1xuICAgIH1cblxuICAgIF9hcmVzYW1lKGE6IGFueSwgYjogYW55KSB7XG4gICAgICAgIGlmIChhLmlzX051bWJlciAmJiBiLmlzX051bWJlcikge1xuICAgICAgICAgICAgcmV0dXJuIGEgPT09IGIgJiYgYS5jb25zdHJ1Y3Rvci5uYW1lID09PSBiLmNvbnN0cnVjdG9yLm5hbWU7XG4gICAgICAgIH1cbiAgICAgICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5ldy1jYXBcbiAgICAgICAgZm9yIChjb25zdCBpdGVtIG9mIFV0aWwuemlwKG5ldyBwcmVvcmRlcl90cmF2ZXJzYWwoYSkuYXNJdGVyKCksIG5ldyBwcmVvcmRlcl90cmF2ZXJzYWwoYikuYXNJdGVyKCkpKSB7XG4gICAgICAgICAgICBjb25zdCBpID0gaXRlbVswXTtcbiAgICAgICAgICAgIGNvbnN0IGogPSBpdGVtWzFdO1xuICAgICAgICAgICAgaWYgKGkgIT09IGogfHwgdHlwZW9mIGkgIT09IHR5cGVvZiBqKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cblxuICAgIHN1YnMoLi4uYXJnczogYW55KSB7XG4gICAgICAgIGxldCBzZXF1ZW5jZTtcbiAgICAgICAgaWYgKGFyZ3MubGVuZ3RoID09PSAxKSB7XG4gICAgICAgICAgICBzZXF1ZW5jZSA9IGFyZ3NbMF07XG4gICAgICAgICAgICBpZiAoc2VxdWVuY2UgaW5zdGFuY2VvZiBIYXNoU2V0KSB7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKHNlcXVlbmNlIGluc3RhbmNlb2YgSGFzaERpY3QpIHtcbiAgICAgICAgICAgICAgICBzZXF1ZW5jZSA9IHNlcXVlbmNlLmVudHJpZXMoKTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoU3ltYm9sLml0ZXJhdG9yIGluIE9iamVjdChzZXF1ZW5jZSkpIHtcbiAgICAgICAgICAgICAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbWF4LWxlblxuICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcIldoZW4gYSBzaW5nbGUgYXJndW1lbnQgaXMgcGFzc2VkIHRvIHN1YnMgaXQgc2hvdWxkIGJlIGEgZGljdGlvbmFyeSBvZiBvbGQ6IG5ldyBwYWlycyBvciBhbiBpdGVyYWJsZSBvZiAob2xkLCBuZXcpIHR1cGxlc1wiKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIGlmIChhcmdzLmxlbmd0aCA9PT0gMikge1xuICAgICAgICAgICAgc2VxdWVuY2UgPSBbYXJnc107XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJzdWIgYWNjZXB0cyAxIG9yIDIgYXJnc1wiKTtcbiAgICAgICAgfVxuICAgICAgICBsZXQgcnYgPSB0aGlzO1xuICAgICAgICBmb3IgKGNvbnN0IGl0ZW0gb2Ygc2VxdWVuY2UpIHtcbiAgICAgICAgICAgIGNvbnN0IG9sZCA9IGl0ZW1bMF07XG4gICAgICAgICAgICBjb25zdCBfbmV3ID0gaXRlbVsxXTtcbiAgICAgICAgICAgIHJ2ID0gcnYuX3N1YnMob2xkLCBfbmV3KTtcbiAgICAgICAgICAgIGlmICghKHJ2IGluc3RhbmNlb2YgQmFzaWMpKSB7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHJ2O1xuICAgIH1cblxuICAgIF9zdWJzKG9sZDogYW55LCBfbmV3OiBhbnkpIHtcbiAgICAgICAgZnVuY3Rpb24gZmFsbGJhY2soY2xzOiBhbnksIG9sZDogYW55LCBfbmV3OiBhbnkpIHtcbiAgICAgICAgICAgIGxldCBoaXQgPSBmYWxzZTtcbiAgICAgICAgICAgIGNvbnN0IGFyZ3MgPSBjbHMuX2FyZ3M7XG4gICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGFyZ3MubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgICBsZXQgYXJnID0gYXJnc1tpXTtcbiAgICAgICAgICAgICAgICBpZiAoIShhcmcuX2V2YWxfc3VicykpIHtcbiAgICAgICAgICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGFyZyA9IGFyZy5fc3VicyhvbGQsIF9uZXcpO1xuICAgICAgICAgICAgICAgIGlmICghKGNscy5fYXJlc2FtZShhcmcsIGFyZ3NbaV0pKSkge1xuICAgICAgICAgICAgICAgICAgICBoaXQgPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICBhcmdzW2ldID0gYXJnO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChoaXQpIHtcbiAgICAgICAgICAgICAgICBsZXQgcnY7XG4gICAgICAgICAgICAgICAgaWYgKGNscy5jb25zdHJ1Y3Rvci5uYW1lID09PSBcIk11bFwiIHx8IGNscy5jb25zdHJ1Y3Rvci5uYW1lID09PSBcIkFkZFwiKSB7XG4gICAgICAgICAgICAgICAgICAgIHJ2ID0gbmV3IGNscy5jb25zdHJ1Y3Rvcih0cnVlLCB0cnVlLCAuLi5hcmdzKTtcbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKGNscy5jb25zdHJ1Y3Rvci5uYW1lID09PSBcIlBvd1wiKSB7XG4gICAgICAgICAgICAgICAgICAgIHJ2ID0gbmV3IGNscy5jb25zdHJ1Y3RvciguLi5hcmdzKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgcmV0dXJuIHJ2O1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIGNscztcbiAgICAgICAgfVxuICAgICAgICBpZiAodGhpcy5fYXJlc2FtZSh0aGlzLCBvbGQpKSB7XG4gICAgICAgICAgICByZXR1cm4gX25ldztcbiAgICAgICAgfVxuXG4gICAgICAgIGxldCBydiA9IHRoaXMuX2V2YWxfc3VicyhvbGQsIF9uZXcpO1xuICAgICAgICBpZiAodHlwZW9mIHJ2ID09PSBcInVuZGVmaW5lZFwiKSB7XG4gICAgICAgICAgICBydiA9IGZhbGxiYWNrKHRoaXMsIG9sZCwgX25ldyk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHJ2O1xuICAgIH1cbn07XG5cbi8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBuZXctY2FwXG5jb25zdCBCYXNpYyA9IF9CYXNpYyhPYmplY3QpO1xuTWFuYWdlZFByb3BlcnRpZXMucmVnaXN0ZXIoQmFzaWMpO1xuXG5jb25zdCBBdG9tID0gKHN1cGVyY2xhc3M6IGFueSkgPT4gY2xhc3MgQXRvbSBleHRlbmRzIG1peChiYXNlKS53aXRoKF9CYXNpYykge1xuICAgIC8qXG4gICAgQSBwYXJlbnQgY2xhc3MgZm9yIGF0b21pYyB0aGluZ3MuIEFuIGF0b20gaXMgYW4gZXhwcmVzc2lvbiB3aXRoIG5vIHN1YmV4cHJlc3Npb25zLlxuICAgIEV4YW1wbGVzXG4gICAgPT09PT09PT1cbiAgICBTeW1ib2wsIE51bWJlciwgUmF0aW9uYWwsIEludGVnZXIsIC4uLlxuICAgIEJ1dCBub3Q6IEFkZCwgTXVsLCBQb3csIC4uLlxuICAgICovXG5cbiAgICBzdGF0aWMgaXNfQXRvbSA9IHRydWU7XG5cbiAgICBfX3Nsb3RzX186IGFueVtdID0gW107XG5cbiAgICBtYXRjaGVzKGV4cHI6IGFueSwgcmVwbF9kaWN0OiBIYXNoRGljdCA9IHVuZGVmaW5lZCwgb2xkOiBhbnkgPSBmYWxzZSkge1xuICAgICAgICBpZiAodGhpcyA9PT0gZXhwcikge1xuICAgICAgICAgICAgaWYgKHR5cGVvZiByZXBsX2RpY3QgPT09IFwidW5kZWZpbmVkXCIpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gbmV3IEhhc2hEaWN0KCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gcmVwbF9kaWN0LmNvcHkoKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHhyZXBsYWNlKHJ1bGU6IGFueSwgaGFjazI6IGFueSA9IGZhbHNlKSB7XG4gICAgICAgIHJldHVybiBydWxlLmdldCh0aGlzKTtcbiAgICB9XG5cbiAgICBkb2l0KC4uLmhpbnRzOiBhbnkpIHtcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxufTtcblxuLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5ldy1jYXBcbmNvbnN0IF9BdG9taWNFeHByID0gQXRvbShPYmplY3QpO1xuTWFuYWdlZFByb3BlcnRpZXMucmVnaXN0ZXIoX0F0b21pY0V4cHIpO1xuXG5leHBvcnQge19CYXNpYywgQmFzaWMsIEF0b20sIF9BdG9taWNFeHByfTtcbiIsICIvKlxuTm90YWJsZSBjaGFuZ2VzIG1hZGUgKGFuZCBub3Rlcylcbi0gUmV3b3JrZWQgU2luZ2xldG9uIHRvIHVzZSBhIHJlZ2lzdHJ5IHN5c3RlbSB1c2luZyBhIHN0YXRpYyBkaWN0aW9uYXJ5XG4tIFJlZ2lzdGVycyBudW1iZXIgb2JqZWN0cyBhcyB0aGV5IGFyZSB1c2VkXG4qL1xuXG4vKiBlc2xpbnQtZGlzYWJsZSBuZXctY2FwICovXG5pbXBvcnQge01hbmFnZWRQcm9wZXJ0aWVzfSBmcm9tIFwiLi9hc3N1bXB0aW9ucy5qc1wiO1xuXG5jbGFzcyBTaW5nbGV0b24ge1xuICAgIHN0YXRpYyByZWdpc3RyeTogUmVjb3JkPGFueSwgYW55PiA9IHt9O1xuXG4gICAgc3RhdGljIHJlZ2lzdGVyKG5hbWU6IHN0cmluZywgY2xzOiBhbnkpIHtcbiAgICAgICAgTWFuYWdlZFByb3BlcnRpZXMucmVnaXN0ZXIoY2xzKTtcbiAgICAgICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5ldy1jYXBcbiAgICAgICAgU2luZ2xldG9uLnJlZ2lzdHJ5W25hbWVdID0gbmV3IGNscygpO1xuICAgIH1cbn1cblxuY29uc3QgUzogYW55ID0gbmV3IFNpbmdsZXRvbigpO1xuXG5cbmV4cG9ydCB7UywgU2luZ2xldG9ufTtcbiIsICIvKlxuTmV3IGNsYXNzIGdsb2JhbFxuSGVscHMgdG8gYXZvaWQgY3ljbGljYWwgaW1wb3J0cyBieSBzdG9yaW5nIGNvbnN0cnVjdG9ycyBhbmQgZnVuY3Rpb25zIHdoaWNoXG5jYW4gYmUgYWNjZXNzZWQgYW55d2hlcmVcblxuTm90ZTogc3RhdGljIG5ldyBtZXRob2RzIGFyZSBjcmVhdGVkIGluIHRoZSBjbGFzc2VzIHRvIGJlIHJlZ2lzdGVyZWQsIGFuZCB0aG9zZVxubWV0aG9kcyBhcmUgYWRkZWQgaGVyZVxuKi9cblxuZXhwb3J0IGNsYXNzIEdsb2JhbCB7XG4gICAgc3RhdGljIGNvbnN0cnVjdG9yczogUmVjb3JkPHN0cmluZywgYW55PiA9IHt9O1xuICAgIHN0YXRpYyBmdW5jdGlvbnM6IFJlY29yZDxzdHJpbmcsIGFueT4gPSB7fTtcblxuICAgIHN0YXRpYyBjb25zdHJ1Y3QoY2xhc3NuYW1lOiBzdHJpbmcsIC4uLmFyZ3M6IGFueVtdKSB7XG4gICAgICAgIGNvbnN0IGNvbnN0cnVjdG9yID0gR2xvYmFsLmNvbnN0cnVjdG9yc1tjbGFzc25hbWVdO1xuICAgICAgICByZXR1cm4gY29uc3RydWN0b3IoLi4uYXJncyk7XG4gICAgfVxuXG4gICAgc3RhdGljIHJlZ2lzdGVyKGNsczogc3RyaW5nLCBjb25zdHJ1Y3RvcjogYW55KSB7XG4gICAgICAgIEdsb2JhbC5jb25zdHJ1Y3RvcnNbY2xzXSA9IGNvbnN0cnVjdG9yO1xuICAgIH1cblxuICAgIHN0YXRpYyByZWdpc3RlcmZ1bmMobmFtZTogc3RyaW5nLCBmdW5jOiBhbnkpIHtcbiAgICAgICAgR2xvYmFsLmZ1bmN0aW9uc1tuYW1lXSA9IGZ1bmM7XG4gICAgfVxuXG4gICAgc3RhdGljIGV2YWxmdW5jKG5hbWU6IHN0cmluZywgLi4uYXJnczogYW55W10pIHtcbiAgICAgICAgY29uc3QgZnVuYyA9IEdsb2JhbC5mdW5jdGlvbnNbbmFtZV07XG4gICAgICAgIHJldHVybiBmdW5jKC4uLmFyZ3MpO1xuICAgIH1cbn1cbiIsICIvKiBlc2xpbnQtZGlzYWJsZSBuby11bnVzZWQtdmFycyAqL1xuLyogTWlzY2VsbGFuZW91cyBzdHVmZiB0aGF0IGRvZXMgbm90IHJlYWxseSBmaXQgYW55d2hlcmUgZWxzZSAqL1xuXG4vKlxuXG5Ob3RhYmxlIGNoYW5nZXMgbWFkZSAoV0IgYW5kIEdNKTpcbi0gRmlsbGRlZGVudCBhbmQgYXNfaW50IGFyZSByZXdyaXR0ZW4gdG8gaW5jbHVkZSB0aGUgc2FtZSBmdW5jdGlvbmFsaXR5IHdpdGhcbiAgZGlmZmVyZW50IG1ldGhvZG9sb2d5XG4tIE1hbnkgZnVuY3Rpb25zIGFyZSBub3QgeWV0IGltcGxlbWVudGVkIGFuZCB3aWxsIGJlIGNvbXBsZXRlZCBhcyB3ZSBmaW5kIHRoZW1cbiAgbmVjZXNzYXJ5XG59XG5cbiovXG5cblxuY2xhc3MgVW5kZWNpZGFibGUgZXh0ZW5kcyBFcnJvciB7XG4gICAgLy8gYW4gZXJyb3IgdG8gYmUgcmFpc2VkIHdoZW4gYSBkZWNpc2lvbiBjYW5ub3QgYmUgbWFkZSBkZWZpbml0aXZlbHlcbiAgICAvLyB3aGVyZSBhIGRlZmluaXRpdmUgYW5zd2VyIGlzIG5lZWRlZFxufVxuXG4vKlxuZnVuY3Rpb24gZmlsbGRlZGVudChzOiBzdHJpbmcsIHc6IG51bWJlciA9IDcwKTogc3RyaW5nIHtcblxuICAgIC8vIHJlbW92ZSBlbXB0eSBibGFuayBsaW5lc1xuICAgIGxldCBzdHIgPSBzLnJlcGxhY2UoL15cXHMqXFxuL2dtLCBcIlwiKTtcbiAgICAvLyBkZWRlbnRcbiAgICBzdHIgPSBkZWRlbnQoc3RyKTtcbiAgICAvLyB3cmFwXG4gICAgY29uc3QgYXJyID0gc3RyLnNwbGl0KFwiIFwiKTtcbiAgICBsZXQgcmVzID0gXCJcIjtcbiAgICBsZXQgbGluZWxlbmd0aCA9IDA7XG4gICAgZm9yIChjb25zdCB3b3JkIG9mIGFycikge1xuICAgICAgICBpZiAobGluZWxlbmd0aCA8PSB3ICsgd29yZC5sZW5ndGgpIHtcbiAgICAgICAgICAgIHJlcyArPSB3b3JkO1xuICAgICAgICAgICAgbGluZWxlbmd0aCArPSB3b3JkLmxlbmd0aDtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJlcyArPSBcIlxcblwiO1xuICAgICAgICAgICAgbGluZWxlbmd0aCA9IDA7XG4gICAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIHJlcztcbn1cbiovXG5cblxuZnVuY3Rpb24gc3RybGluZXMoczogc3RyaW5nLCBjOiBudW1iZXIgPSA2NCwgc2hvcnQ9ZmFsc2UpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoXCJzdHJsaW5lcyBpcyBub3QgeWV0IGltcGxlbWVudGVkXCIpO1xufVxuXG5mdW5jdGlvbiByYXdsaW5lcyhzOiBzdHJpbmcpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoXCJyYXdsaW5lcyBpcyBub3QgeWV0IGltcGxlbWVudGVkXCIpO1xufVxuXG5mdW5jdGlvbiBkZWJ1Z19kZWNvcmF0b3IoZnVuYzogYW55KSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKFwiZGVidWdfZGVjb3JhdG9yIGlzIG5vdCB5ZXQgaW1wbGVtZW50ZWRcIik7XG59XG5cbmZ1bmN0aW9uIGRlYnVnKC4uLmFyZ3M6IGFueSkge1xuICAgIHRocm93IG5ldyBFcnJvcihcImRlYnVnIGlzIG5vdCB5ZXQgaW1wbGVtZW50ZWRcIik7XG59XG5cbmZ1bmN0aW9uIGZpbmRfZXhlY3V0YWJsZShleGVjdXRhYmxlOiBhbnksIHBhdGg6IGFueT11bmRlZmluZWQpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoXCJmaW5kX2V4ZWN1dGFibGUgaXMgbm90IHlldCBpbXBsZW1lbnRlZFwiKTtcbn1cblxuZnVuY3Rpb24gZnVuY19uYW1lKHg6IGFueSwgc2hvcnQ6IGFueT1mYWxzZSkge1xuICAgIHRocm93IG5ldyBFcnJvcihcImZ1bmNfbmFtZSBpcyBub3QgeWV0IGltcGxlbWVudGVkXCIpO1xufVxuXG5mdW5jdGlvbiBfcmVwbGFjZShyZXBzOiBhbnkpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoXCJfcmVwbGFjZSBpcyBub3QgeWV0IGltcGxlbWVudGVkXCIpO1xufVxuXG5mdW5jdGlvbiByZXBsYWNlKHN0cjogc3RyaW5nLCAuLi5yZXBzOiBhbnkpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoXCJyZXBsYWNlIGlzIG5vdCB5ZXQgaW1wbGVtZW50ZWRcIik7XG59XG5cbmZ1bmN0aW9uIHRyYW5zbGF0ZShzOiBhbnksIGE6IGFueSwgYjogYW55PXVuZGVmaW5lZCwgYzogYW55PXVuZGVmaW5lZCkge1xuICAgIHRocm93IG5ldyBFcnJvcihcInRyYW5zbGF0ZSBpcyBub3QgeWV0IGltcGxlbWVudGVkXCIpO1xufVxuXG5mdW5jdGlvbiBvcmRpbmFsKG51bTogYW55KSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKFwib3JkaW5hbCBpcyBub3QgeWV0IGltcGxlbWVudGVkXCIpO1xufVxuXG5mdW5jdGlvbiBhc19pbnQobjogYW55KSB7XG4gICAgaWYgKCFOdW1iZXIuaXNJbnRlZ2VyKG4pKSB7IC8vICEhISAtIG1pZ2h0IG5lZWQgdG8gdXBkYXRlIHRoaXNcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKG4gKyBcIiBpcyBub3QgaW50XCIpO1xuICAgIH1cbiAgICByZXR1cm4gbjtcbn1cblxuZXhwb3J0IHthc19pbnR9O1xuIiwgIi8qXG5Ob3RhYmxlIGNoYW5nZXMgbWFkZSAoYW5kIG5vdGVzKTpcbi0gVmVyeSBiYXJlYm9uZXMgdmVyc2lvbnMgb2YgRXhwciBpbXBsZW1lbnRlZCBzbyBmYXIgLSB2ZXJ5IGZldyB1dGlsIG1ldGhvZHNcbi0gTm90ZSB0aGF0IGV4cHJlc3Npb24gdXNlcyBnbG9iYWwudHMgdG8gY29uc3RydWN0IGFkZCBhbmQgbXVsIG9iamVjdHMsIHdoaWNoXG4gIGF2b2lkcyBjeWNsaWNhbCBpbXBvcnRzXG4qL1xuXG5pbXBvcnQge19CYXNpYywgQXRvbX0gZnJvbSBcIi4vYmFzaWMuanNcIjtcbmltcG9ydCB7SGFzaFNldCwgbWl4fSBmcm9tIFwiLi91dGlsaXR5LmpzXCI7XG5pbXBvcnQge01hbmFnZWRQcm9wZXJ0aWVzfSBmcm9tIFwiLi9hc3N1bXB0aW9ucy5qc1wiO1xuaW1wb3J0IHtTfSBmcm9tIFwiLi9zaW5nbGV0b24uanNcIjtcbmltcG9ydCB7R2xvYmFsfSBmcm9tIFwiLi9nbG9iYWwuanNcIjtcbmltcG9ydCB7YXNfaW50fSBmcm9tIFwiLi4vdXRpbGl0aWVzL21pc2MuanNcIjtcblxuXG5jb25zdCBFeHByID0gKHN1cGVyY2xhc3M6IGFueSkgPT4gY2xhc3MgRXhwciBleHRlbmRzIG1peChzdXBlcmNsYXNzKS53aXRoKF9CYXNpYykge1xuICAgIC8qXG4gICAgQmFzZSBjbGFzcyBmb3IgYWxnZWJyYWljIGV4cHJlc3Npb25zLlxuICAgIEV4cGxhbmF0aW9uXG4gICAgPT09PT09PT09PT1cbiAgICBFdmVyeXRoaW5nIHRoYXQgcmVxdWlyZXMgYXJpdGhtZXRpYyBvcGVyYXRpb25zIHRvIGJlIGRlZmluZWRcbiAgICBzaG91bGQgc3ViY2xhc3MgdGhpcyBjbGFzcywgaW5zdGVhZCBvZiBCYXNpYyAod2hpY2ggc2hvdWxkIGJlXG4gICAgdXNlZCBvbmx5IGZvciBhcmd1bWVudCBzdG9yYWdlIGFuZCBleHByZXNzaW9uIG1hbmlwdWxhdGlvbiwgaS5lLlxuICAgIHBhdHRlcm4gbWF0Y2hpbmcsIHN1YnN0aXR1dGlvbnMsIGV0YykuXG4gICAgSWYgeW91IHdhbnQgdG8gb3ZlcnJpZGUgdGhlIGNvbXBhcmlzb25zIG9mIGV4cHJlc3Npb25zOlxuICAgIFNob3VsZCB1c2UgX2V2YWxfaXNfZ2UgZm9yIGluZXF1YWxpdHksIG9yIF9ldmFsX2lzX2VxLCB3aXRoIG11bHRpcGxlIGRpc3BhdGNoLlxuICAgIF9ldmFsX2lzX2dlIHJldHVybiB0cnVlIGlmIHggPj0geSwgZmFsc2UgaWYgeCA8IHksIGFuZCBOb25lIGlmIHRoZSB0d28gdHlwZXNcbiAgICBhcmUgbm90IGNvbXBhcmFibGUgb3IgdGhlIGNvbXBhcmlzb24gaXMgaW5kZXRlcm1pbmF0ZVxuICAgIFNlZSBBbHNvXG4gICAgPT09PT09PT1cbiAgICBzeW1weS5jb3JlLmJhc2ljLkJhc2ljXG4gICAgKi9cblxuICAgIF9fc2xvdHNfXzogYW55W10gPSBbXTtcbiAgICBzdGF0aWMgaXNfc2NhbGFyID0gdHJ1ZTtcblxuICAgIGNvbnN0cnVjdG9yKC4uLmFyZ3M6IGFueSkge1xuICAgICAgICBzdXBlciguLi5hcmdzKTtcbiAgICB9XG5cbiAgICBhc19iYXNlX2V4cCgpIHtcbiAgICAgICAgcmV0dXJuIFt0aGlzLCBTLk9uZV07XG4gICAgfVxuXG4gICAgYXNfY29lZmZfTXVsKHJhdGlvbmFsOiBib29sZWFuID0gZmFsc2UpIHtcbiAgICAgICAgcmV0dXJuIFtTLk9uZSwgdGhpc107XG4gICAgfVxuXG4gICAgYXNfY29lZmZfQWRkKCkge1xuICAgICAgICByZXR1cm4gW1MuWmVybywgdGhpc107XG4gICAgfVxuXG4gICAgX19hZGRfXyhvdGhlcjogYW55KSB7XG4gICAgICAgIHJldHVybiBHbG9iYWwuY29uc3RydWN0KFwiQWRkXCIsIHRydWUsIHRydWUsIHRoaXMsIG90aGVyKTtcbiAgICB9XG5cbiAgICBfX3JhZGRfXyhvdGhlcjogYW55KSB7XG4gICAgICAgIHJldHVybiBHbG9iYWwuY29uc3RydWN0KFwiQWRkXCIsIHRydWUsIHRydWUsIG90aGVyLCB0aGlzKTtcbiAgICB9XG5cbiAgICBfX3N1Yl9fKG90aGVyOiBhbnkpIHtcbiAgICAgICAgcmV0dXJuIEdsb2JhbC5jb25zdHJ1Y3QoXCJBZGRcIiwgdHJ1ZSwgdHJ1ZSwgdGhpcywgb3RoZXIuX19tdWxfXyhTLk5lZ2F0aXZlT25lKSk7XG4gICAgfVxuXG4gICAgX19yc3ViX18ob3RoZXI6IGFueSkge1xuICAgICAgICByZXR1cm4gR2xvYmFsLmNvbnN0cnVjdChcIkFkZFwiLCB0cnVlLCB0cnVlLCBvdGhlciwgdGhpcy5fX211bF9fKFMuTmVnYXRpdmVPbmUpKTtcbiAgICB9XG5cbiAgICBfX211bF9fKG90aGVyOiBhbnkpIHtcbiAgICAgICAgcmV0dXJuIEdsb2JhbC5jb25zdHJ1Y3QoXCJNdWxcIiwgdHJ1ZSwgdHJ1ZSwgdGhpcywgb3RoZXIpO1xuICAgIH1cblxuICAgIF9fcm11bF9fKG90aGVyOiBhbnkpIHtcbiAgICAgICAgcmV0dXJuIEdsb2JhbC5jb25zdHJ1Y3QoXCJNdWxcIiwgdHJ1ZSwgdHJ1ZSwgb3RoZXIsIHRoaXMpO1xuICAgIH1cblxuICAgIF9wb3cob3RoZXI6IGFueSkge1xuICAgICAgICByZXR1cm4gR2xvYmFsLmNvbnN0cnVjdChcIlBvd1wiLCB0aGlzLCBvdGhlcik7XG4gICAgfVxuXG4gICAgX19wb3dfXyhvdGhlcjogYW55LCBtb2Q6IGJvb2xlYW4gPSB1bmRlZmluZWQpIHtcbiAgICAgICAgaWYgKHR5cGVvZiBtb2QgPT09IFwidW5kZWZpbmVkXCIpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9wb3cob3RoZXIpO1xuICAgICAgICB9XG4gICAgICAgIGxldCBfc2VsZjsgbGV0IF9vdGhlcjsgbGV0IF9tb2Q7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICBbX3NlbGYsIF9vdGhlciwgX21vZF0gPSBbYXNfaW50KHRoaXMpLCBhc19pbnQob3RoZXIpLCBhc19pbnQobW9kKV07XG4gICAgICAgICAgICBpZiAob3RoZXIgPj0gMCkge1xuICAgICAgICAgICAgICAgIHJldHVybiBHbG9iYWwuY29uc3RydWN0KFwiX051bWJlcl9cIiwgX3NlbGYqKl9vdGhlciAlIF9tb2QpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gR2xvYmFsLmNvbnN0cnVjdChcIl9OdW1iZXJfXCIsIEdsb2JhbC5ldmFsZnVuYyhcIm1vZF9pbnZlcnNlXCIsIChfc2VsZiAqKiAoX290aGVyKSAlIChtb2QgYXMgYW55KSksIG1vZCkpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9IGNhdGNoIChFcnJvcikge1xuICAgICAgICAgICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5vLXVudXNlZC12YXJzXG4gICAgICAgICAgICBjb25zdCBwb3dlciA9IHRoaXMuX3Bvdyhfb3RoZXIpO1xuICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICAvLyByZXR1cm4gcG93ZXIuX19tb2RfXyhtb2QpO1xuICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcIm1vZCBjbGFzcyBub3QgeWV0IGltcGxlbWVudGVkXCIpO1xuICAgICAgICAgICAgfSBjYXRjaCAoRXJyb3IpIHtcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJub3QgaW1wbGVtZW50ZWRcIik7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBfX3Jwb3dfXyhvdGhlcjogYW55KSB7XG4gICAgICAgIHJldHVybiBHbG9iYWwuY29uc3RydWN0KFwiUG93XCIsIG90aGVyLCB0aGlzKTtcbiAgICB9XG5cbiAgICBfX3RydWVkaXZfXyhvdGhlcjogYW55KSB7XG4gICAgICAgIGNvbnN0IGRlbm9tID0gR2xvYmFsLmNvbnN0cnVjdChcIlBvd1wiLCBvdGhlciwgUy5OZWdhdGl2ZU9uZSk7XG4gICAgICAgIGlmICh0aGlzID09PSBTLk9uZSkge1xuICAgICAgICAgICAgcmV0dXJuIGRlbm9tO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuIEdsb2JhbC5jb25zdHJ1Y3QoXCJNdWxcIiwgdHJ1ZSwgdHJ1ZSwgdGhpcywgZGVub20pO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgX19ydHJ1ZWRpdl9fKG90aGVyOiBhbnkpIHtcbiAgICAgICAgY29uc3QgZGVub20gPSBHbG9iYWwuY29uc3RydWN0KFwiUG93XCIsIHRoaXMsIFMuTmVnYXRpdmVPbmUpO1xuICAgICAgICBpZiAob3RoZXIgPT09IFMuT25lKSB7XG4gICAgICAgICAgICByZXR1cm4gZGVub207XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gR2xvYmFsLmNvbnN0cnVjdChcIk11bFwiLCB0cnVlLCB0cnVlLCBvdGhlciwgZGVub20pO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgX2V2YWxfcG93ZXIob3RoZXI6IGFueSk6IGFueSB7XG4gICAgICAgIHJldHVybiB1bmRlZmluZWQ7XG4gICAgfVxuXG4gICAgYXJnc19jbmMoY3NldDogYm9vbGVhbiA9IGZhbHNlLCB3YXJuOiBib29sZWFuID0gdHJ1ZSwgc3BsaXRfMTogYm9vbGVhbiA9IHRydWUpIHtcbiAgICAgICAgbGV0IGFyZ3M7XG4gICAgICAgIGlmICgodGhpcy5jb25zdHJ1Y3RvciBhcyBhbnkpLmlzX011bCkge1xuICAgICAgICAgICAgYXJncyA9IHRoaXMuX2FyZ3M7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBhcmdzID0gW3RoaXNdO1xuICAgICAgICB9XG4gICAgICAgIGxldCBjOyBsZXQgbmM7XG4gICAgICAgIGxldCBsb29wMiA9IHRydWU7XG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgYXJncy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgY29uc3QgbWkgPSBhcmdzW2ldO1xuICAgICAgICAgICAgaWYgKCEobWkuaXNfY29tbXV0YXRpdmUpKSB7XG4gICAgICAgICAgICAgICAgYyA9IGFyZ3Muc2xpY2UoMCwgaSk7XG4gICAgICAgICAgICAgICAgbmMgPSBhcmdzLnNsaWNlKGkpO1xuICAgICAgICAgICAgICAgIGxvb3AyID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0gaWYgKGxvb3AyKSB7XG4gICAgICAgICAgICBjID0gYXJncztcbiAgICAgICAgICAgIG5jID0gW107XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoYyAmJiBzcGxpdF8xICYmXG4gICAgICAgICAgICBjWzBdLmlzX051bWJlciAmJlxuICAgICAgICAgICAgY1swXS5pc19leHRlbmRlZF9uZWdhdGl2ZSAmJlxuICAgICAgICAgICAgY1swXSAhPT0gUy5OZWdhdGl2ZU9uZSkge1xuICAgICAgICAgICAgYy5zcGxpY2UoMCwgMSwgUy5OZWdhdGl2ZU9uZSwgY1swXS5fX211bF9fKFMuTmVnYXRpdmVPbmUpKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChjc2V0KSB7XG4gICAgICAgICAgICBjb25zdCBjbGVuID0gYy5sZW5ndGg7XG4gICAgICAgICAgICBjb25zdCBjc2V0ID0gbmV3IEhhc2hTZXQoKTtcbiAgICAgICAgICAgIGNzZXQuYWRkQXJyKGMpO1xuICAgICAgICAgICAgaWYgKGNsZW4gJiYgd2FybiAmJiBjc2V0LnNpemUgIT09IGNsZW4pIHtcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJyZXBlYXRlZCBjb21tdXRhdGl2ZSBhcmdzXCIpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBbYywgbmNdO1xuICAgIH1cbn07XG5cbi8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBuZXctY2FwXG5jb25zdCBfRXhwciA9IEV4cHIoT2JqZWN0KTtcbk1hbmFnZWRQcm9wZXJ0aWVzLnJlZ2lzdGVyKF9FeHByKTtcblxuY29uc3QgQXRvbWljRXhwciA9IChzdXBlcmNsYXNzOiBhbnkpID0+IGNsYXNzIEF0b21pY0V4cHIgZXh0ZW5kcyBtaXgoc3VwZXJjbGFzcykud2l0aChBdG9tLCBFeHByKSB7XG4gICAgLypcbiAgICBBIHBhcmVudCBjbGFzcyBmb3Igb2JqZWN0IHdoaWNoIGFyZSBib3RoIGF0b21zIGFuZCBFeHBycy5cbiAgICBGb3IgZXhhbXBsZTogU3ltYm9sLCBOdW1iZXIsIFJhdGlvbmFsLCBJbnRlZ2VyLCAuLi5cbiAgICBCdXQgbm90OiBBZGQsIE11bCwgUG93LCAuLi5cbiAgICAqL1xuICAgIHN0YXRpYyBpc19udW1iZXIgPSBmYWxzZTtcbiAgICBzdGF0aWMgaXNfQXRvbSA9IHRydWU7XG5cbiAgICBfX3Nsb3RzX186IGFueVtdID0gW107XG5cbiAgICBjb25zdHJ1Y3RvciguLi5hcmdzOiBhbnkpIHtcbiAgICAgICAgc3VwZXIoQXRvbWljRXhwciwgYXJncyk7XG4gICAgfVxuXG4gICAgX2V2YWxfaXNfcG9seW5vbWlhbChzeW1zOiBhbnkpIHtcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuXG4gICAgX2V2YWxfaXNfcmF0aW9uYWxfZnVuY3Rpb24oc3ltczogYW55KSB7XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cblxuICAgIGV2YWxfaXNfYWxnZWJyYWljX2V4cHIoc3ltczogYW55KSB7XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cblxuICAgIF9ldmFsX25zZXJpZXMoeDogYW55LCBuOiBhbnksIGxvZ3g6IGFueSwgY2RvcjogYW55ID0gMCkge1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9XG59O1xuXG4vLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbmV3LWNhcFxuY29uc3QgX0F0b21pY0V4cHIgPSBBdG9taWNFeHByKE9iamVjdCk7XG5NYW5hZ2VkUHJvcGVydGllcy5yZWdpc3RlcihfQXRvbWljRXhwcik7XG5cbmV4cG9ydCB7QXRvbWljRXhwciwgX0F0b21pY0V4cHIsIEV4cHIsIF9FeHByfTtcbiIsICIvKlxuTm90YWJsZSBjaGFuZ2VzIG1hZGU6XG4tIERpY3Rpb25hcnkgc3lzdGVtIHJld29ya2VkIGFzIGNsYXNzIHByb3BlcnRpZXNcbiovXG5cbmNsYXNzIF9nbG9iYWxfcGFyYW1ldGVycyB7XG4gICAgLypcbiAgICBUaHJlYWQtbG9jYWwgZ2xvYmFsIHBhcmFtZXRlcnMuXG4gICAgRXhwbGFuYXRpb25cbiAgICA9PT09PT09PT09PVxuICAgIFRoaXMgY2xhc3MgZ2VuZXJhdGVzIHRocmVhZC1sb2NhbCBjb250YWluZXIgZm9yIFN5bVB5J3MgZ2xvYmFsIHBhcmFtZXRlcnMuXG4gICAgRXZlcnkgZ2xvYmFsIHBhcmFtZXRlcnMgbXVzdCBiZSBwYXNzZWQgYXMga2V5d29yZCBhcmd1bWVudCB3aGVuIGdlbmVyYXRpbmdcbiAgICBpdHMgaW5zdGFuY2UuXG4gICAgQSB2YXJpYWJsZSwgYGdsb2JhbF9wYXJhbWV0ZXJzYCBpcyBwcm92aWRlZCBhcyBkZWZhdWx0IGluc3RhbmNlIGZvciB0aGlzIGNsYXNzLlxuICAgIFdBUk5JTkchIEFsdGhvdWdoIHRoZSBnbG9iYWwgcGFyYW1ldGVycyBhcmUgdGhyZWFkLWxvY2FsLCBTeW1QeSdzIGNhY2hlIGlzIG5vdFxuICAgIGJ5IG5vdy5cbiAgICBUaGlzIG1heSBsZWFkIHRvIHVuZGVzaXJlZCByZXN1bHQgaW4gbXVsdGktdGhyZWFkaW5nIG9wZXJhdGlvbnMuXG4gICAgRXhhbXBsZXNcbiAgICA9PT09PT09PVxuICAgID4+PiBmcm9tIHN5bXB5LmFiYyBpbXBvcnQgeFxuICAgID4+PiBmcm9tIHN5bXB5LmNvcmUuY2FjaGUgaW1wb3J0IGNsZWFyX2NhY2hlXG4gICAgPj4+IGZyb20gc3ltcHkuY29yZS5wYXJhbWV0ZXJzIGltcG9ydCBnbG9iYWxfcGFyYW1ldGVycyBhcyBncFxuICAgID4+PiBncC5ldmFsdWF0ZVxuICAgIFRydWVcbiAgICA+Pj4geCt4XG4gICAgMip4XG4gICAgPj4+IGxvZyA9IFtdXG4gICAgPj4+IGRlZiBmKCk6XG4gICAgLi4uICAgICBjbGVhcl9jYWNoZSgpXG4gICAgLi4uICAgICBncC5ldmFsdWF0ZSA9IEZhbHNlXG4gICAgLi4uICAgICBsb2cuYXBwZW5kKHgreClcbiAgICAuLi4gICAgIGNsZWFyX2NhY2hlKClcbiAgICA+Pj4gaW1wb3J0IHRocmVhZGluZ1xuICAgID4+PiB0aHJlYWQgPSB0aHJlYWRpbmcuVGhyZWFkKHRhcmdldD1mKVxuICAgID4+PiB0aHJlYWQuc3RhcnQoKVxuICAgID4+PiB0aHJlYWQuam9pbigpXG4gICAgPj4+IHByaW50KGxvZylcbiAgICBbeCArIHhdXG4gICAgPj4+IGdwLmV2YWx1YXRlXG4gICAgVHJ1ZVxuICAgID4+PiB4K3hcbiAgICAyKnhcbiAgICBSZWZlcmVuY2VzXG4gICAgPT09PT09PT09PVxuICAgIC4uIFsxXSBodHRwczovL2RvY3MucHl0aG9uLm9yZy8zL2xpYnJhcnkvdGhyZWFkaW5nLmh0bWxcbiAgICAqL1xuXG4gICAgZGljdDogUmVjb3JkPGFueSwgYW55PiA9IHt9O1xuXG4gICAgZXZhbHVhdGU7XG4gICAgZGlzdHJpYnV0ZTtcbiAgICBleHBfaXNfcG93O1xuXG4gICAgY29uc3RydWN0b3IoZGljdDogUmVjb3JkPHN0cmluZywgYW55Pikge1xuICAgICAgICB0aGlzLmRpY3QgPSBkaWN0O1xuICAgICAgICB0aGlzLmV2YWx1YXRlID0gdGhpcy5kaWN0W1wiZXZhbHVhdGVcIl07XG4gICAgICAgIHRoaXMuZGlzdHJpYnV0ZSA9IHRoaXMuZGljdFtcImRpc3RyaWJ1dGVcIl07XG4gICAgICAgIHRoaXMuZXhwX2lzX3BvdyA9IHRoaXMuZGljdFtcImV4cF9pc19wb3dcIl07XG4gICAgfVxufVxuXG5jb25zdCBnbG9iYWxfcGFyYW1ldGVycyA9IG5ldyBfZ2xvYmFsX3BhcmFtZXRlcnMoe1wiZXZhbHVhdGVcIjogdHJ1ZSwgXCJkaXN0cmlidXRlXCI6IHRydWUsIFwiZXhwX2lzX3Bvd1wiOiBmYWxzZX0pO1xuXG5leHBvcnQge2dsb2JhbF9wYXJhbWV0ZXJzfTtcbiIsICIvKlxuTm90YWJsZSBjaGFuZ2VzIG1hZGUgYW5kIG5vdGVzOlxuLSBPcmRlci1zeW1ib2xzIGFuZCByZWxhdGVkIGNvbXBvbmVudGVkIG5vdCB5ZXQgaW1wbGVtZW50ZWRcbi0gTW9zdCBtZXRob2RzIG5vdCB5ZXQgaW1wbGVtZW50ZWQgKGJ1dCBlbm91Z2ggdG8gZXZhbHVhdGUgYWRkIGluIHRoZW9yeSlcbi0gU2ltcGxpZnkgYXJndW1lbnQgYWRkZWQgdG8gY29uc3RydWN0b3IgdG8gcHJldmVudCBpbmZpbml0ZSByZWN1cnNpb25cbiovXG5cbmltcG9ydCB7X0Jhc2ljfSBmcm9tIFwiLi9iYXNpYy5qc1wiO1xuaW1wb3J0IHttaXh9IGZyb20gXCIuL3V0aWxpdHkuanNcIjtcbmltcG9ydCB7Z2xvYmFsX3BhcmFtZXRlcnN9IGZyb20gXCIuL3BhcmFtZXRlcnMuanNcIjtcbmltcG9ydCB7ZnV6enlfYW5kX3YyfSBmcm9tIFwiLi9sb2dpYy5qc1wiO1xuaW1wb3J0IHtNYW5hZ2VkUHJvcGVydGllc30gZnJvbSBcIi4vYXNzdW1wdGlvbnMuanNcIjtcbmltcG9ydCB7U30gZnJvbSBcIi4vc2luZ2xldG9uLmpzXCI7XG5cblxuY29uc3QgQXNzb2NPcCA9IChzdXBlcmNsYXNzOiBhbnkpID0+IGNsYXNzIEFzc29jT3AgZXh0ZW5kcyBtaXgoc3VwZXJjbGFzcykud2l0aChfQmFzaWMpIHtcbiAgICAvKiBBc3NvY2lhdGl2ZSBvcGVyYXRpb25zLCBjYW4gc2VwYXJhdGUgbm9uY29tbXV0YXRpdmUgYW5kXG4gICAgY29tbXV0YXRpdmUgcGFydHMuXG4gICAgKGEgb3AgYikgb3AgYyA9PSBhIG9wIChiIG9wIGMpID09IGEgb3AgYiBvcCBjLlxuICAgIEJhc2UgY2xhc3MgZm9yIEFkZCBhbmQgTXVsLlxuICAgIFRoaXMgaXMgYW4gYWJzdHJhY3QgYmFzZSBjbGFzcywgY29uY3JldGUgZGVyaXZlZCBjbGFzc2VzIG11c3QgZGVmaW5lXG4gICAgdGhlIGF0dHJpYnV0ZSBgaWRlbnRpdHlgLlxuICAgIC4uIGRlcHJlY2F0ZWQ6OiAxLjdcbiAgICAgICBVc2luZyBhcmd1bWVudHMgdGhhdCBhcmVuJ3Qgc3ViY2xhc3NlcyBvZiA6Y2xhc3M6YH4uRXhwcmAgaW4gY29yZVxuICAgICAgIG9wZXJhdG9ycyAoOmNsYXNzOmB+Lk11bGAsIDpjbGFzczpgfi5BZGRgLCBhbmQgOmNsYXNzOmB+LlBvd2ApIGlzXG4gICAgICAgZGVwcmVjYXRlZC4gU2VlIDpyZWY6YG5vbi1leHByLWFyZ3MtZGVwcmVjYXRlZGAgZm9yIGRldGFpbHMuXG4gICAgUGFyYW1ldGVyc1xuICAgID09PT09PT09PT1cbiAgICAqYXJncyA6XG4gICAgICAgIEFyZ3VtZW50cyB3aGljaCBhcmUgb3BlcmF0ZWRcbiAgICBldmFsdWF0ZSA6IGJvb2wsIG9wdGlvbmFsXG4gICAgICAgIEV2YWx1YXRlIHRoZSBvcGVyYXRpb24uIElmIG5vdCBwYXNzZWQsIHJlZmVyIHRvIGBgZ2xvYmFsX3BhcmFtZXRlcnMuZXZhbHVhdGVgYC5cbiAgICAqL1xuXG4gICAgLy8gZm9yIHBlcmZvcm1hbmNlIHJlYXNvbiwgd2UgZG9uJ3QgbGV0IGlzX2NvbW11dGF0aXZlIGdvIHRvIGFzc3VtcHRpb25zLFxuICAgIC8vIGFuZCBrZWVwIGl0IHJpZ2h0IGhlcmVcblxuICAgIF9fc2xvdHNfXzogYW55W10gPSBbXCJpc19jb21tdXRhdGl2ZVwiXTtcbiAgICBzdGF0aWMgX2FyZ3NfdHlwZTogYW55ID0gdW5kZWZpbmVkO1xuXG4gICAgY29uc3RydWN0b3IoY2xzOiBhbnksIGV2YWx1YXRlOiBhbnksIHNpbXBsaWZ5OiBib29sZWFuLCAuLi5hcmdzOiBhbnkpIHtcbiAgICAgICAgLy8gaWRlbnRpdHkgd2Fzbid0IHdvcmtpbmcgZm9yIHNvbWUgcmVhc29uLCBzbyBoZXJlIGlzIGEgYmFuZGFpZCBmaXhcbiAgICAgICAgaWYgKGNscy5uYW1lID09PSBcIk11bFwiKSB7XG4gICAgICAgICAgICBjbHMuaWRlbnRpdHkgPSBTLk9uZTtcbiAgICAgICAgfSBlbHNlIGlmIChjbHMubmFtZSA9PT0gXCJBZGRcIikge1xuICAgICAgICAgICAgY2xzLmlkZW50aXR5ID0gUy5aZXJvO1xuICAgICAgICB9XG4gICAgICAgIHN1cGVyKC4uLmFyZ3MpO1xuICAgICAgICBpZiAoc2ltcGxpZnkpIHtcbiAgICAgICAgICAgIGlmICh0eXBlb2YgZXZhbHVhdGUgPT09IFwidW5kZWZpbmVkXCIpIHtcbiAgICAgICAgICAgICAgICBldmFsdWF0ZSA9IGdsb2JhbF9wYXJhbWV0ZXJzLmV2YWx1YXRlO1xuICAgICAgICAgICAgfSBlbHNlIGlmIChldmFsdWF0ZSA9PT0gZmFsc2UpIHtcbiAgICAgICAgICAgICAgICBsZXQgb2JqID0gdGhpcy5fZnJvbV9hcmdzKGNscywgdW5kZWZpbmVkLCAuLi5hcmdzKTtcbiAgICAgICAgICAgICAgICBvYmogPSB0aGlzLl9leGVjX2NvbnN0cnVjdG9yX3Bvc3Rwcm9jZXNzb3JzKG9iaik7XG4gICAgICAgICAgICAgICAgcmV0dXJuIG9iajtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGNvbnN0IGFyZ3NUZW1wOiBhbnlbXSA9IFtdO1xuICAgICAgICAgICAgZm9yIChjb25zdCBhIG9mIGFyZ3MpIHtcbiAgICAgICAgICAgICAgICBpZiAoYSAhPT0gY2xzLmlkZW50aXR5KSB7XG4gICAgICAgICAgICAgICAgICAgIGFyZ3NUZW1wLnB1c2goYSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgYXJncyA9IGFyZ3NUZW1wO1xuICAgICAgICAgICAgaWYgKGFyZ3MubGVuZ3RoID09PSAwKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGNscy5pZGVudGl0eTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoYXJncy5sZW5ndGggPT09IDEpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gYXJnc1swXTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBuby11bnVzZWQtdmFyc1xuICAgICAgICAgICAgY29uc3QgW2NfcGFydCwgbmNfcGFydCwgb3JkZXJfc3ltYm9sc10gPSB0aGlzLmZsYXR0ZW4oYXJncyk7XG4gICAgICAgICAgICBjb25zdCBpc19jb21tdXRhdGl2ZTogYm9vbGVhbiA9IG5jX3BhcnQubGVuZ3RoID09PSAwO1xuICAgICAgICAgICAgbGV0IG9iajogYW55ID0gdGhpcy5fZnJvbV9hcmdzKGNscywgaXNfY29tbXV0YXRpdmUsIC4uLmNfcGFydC5jb25jYXQobmNfcGFydCkpO1xuICAgICAgICAgICAgb2JqID0gdGhpcy5fZXhlY19jb25zdHJ1Y3Rvcl9wb3N0cHJvY2Vzc29ycyhvYmopO1xuICAgICAgICAgICAgLy8gISEhIG9yZGVyIHN5bWJvbHMgbm90IHlldCBpbXBsZW1lbnRlZFxuICAgICAgICAgICAgcmV0dXJuIG9iajtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIF9mcm9tX2FyZ3MoY2xzOiBhbnksIGlzX2NvbW11dGF0aXZlOiBhbnksIC4uLmFyZ3M6IGFueSkge1xuICAgICAgICAvKiBcIkNyZWF0ZSBuZXcgaW5zdGFuY2Ugd2l0aCBhbHJlYWR5LXByb2Nlc3NlZCBhcmdzLlxuICAgICAgICBJZiB0aGUgYXJncyBhcmUgbm90IGluIGNhbm9uaWNhbCBvcmRlciwgdGhlbiBhIG5vbi1jYW5vbmljYWxcbiAgICAgICAgcmVzdWx0IHdpbGwgYmUgcmV0dXJuZWQsIHNvIHVzZSB3aXRoIGNhdXRpb24uIFRoZSBvcmRlciBvZlxuICAgICAgICBhcmdzIG1heSBjaGFuZ2UgaWYgdGhlIHNpZ24gb2YgdGhlIGFyZ3MgaXMgY2hhbmdlZC4gKi9cbiAgICAgICAgaWYgKGFyZ3MubGVuZ3RoID09PSAwKSB7XG4gICAgICAgICAgICByZXR1cm4gY2xzLmlkZW50aXR5O1xuICAgICAgICB9IGVsc2UgaWYgKGFyZ3MubGVuZ3RoID09PSAxKSB7XG4gICAgICAgICAgICByZXR1cm4gYXJnc1swXTtcbiAgICAgICAgfVxuICAgICAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbmV3LWNhcFxuICAgICAgICBjb25zdCBvYmo6IGFueSA9IG5ldyBjbHModHJ1ZSwgZmFsc2UsIC4uLmFyZ3MpO1xuICAgICAgICBpZiAodHlwZW9mIGlzX2NvbW11dGF0aXZlID09PSBcInVuZGVmaW5lZFwiKSB7XG4gICAgICAgICAgICBjb25zdCBpbnB1dDogYW55W10gPSBbXTtcbiAgICAgICAgICAgIGZvciAoY29uc3QgYSBvZiBhcmdzKSB7XG4gICAgICAgICAgICAgICAgaW5wdXQucHVzaChhLmlzX2NvbW11dGF0aXZlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlzX2NvbW11dGF0aXZlID0gZnV6enlfYW5kX3YyKGlucHV0KTtcbiAgICAgICAgfVxuICAgICAgICBvYmouaXNfY29tbXV0YXRpdmUgPSBpc19jb21tdXRhdGl2ZTtcbiAgICAgICAgcmV0dXJuIG9iajtcbiAgICB9XG5cbiAgICBfbmV3X3Jhd2FyZ3MocmVldmFsOiBib29sZWFuLCAuLi5hcmdzOiBhbnkpIHtcbiAgICAgICAgbGV0IGlzX2NvbW11dGF0aXZlO1xuICAgICAgICBpZiAocmVldmFsICYmIHRoaXMuaXNfY29tbXV0YXRpdmUgPT09IGZhbHNlKSB7XG4gICAgICAgICAgICBpc19jb21tdXRhdGl2ZSA9IHVuZGVmaW5lZDtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGlzX2NvbW11dGF0aXZlID0gdGhpcy5pc19jb21tdXRhdGl2ZTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdGhpcy5fZnJvbV9hcmdzKHRoaXMuY29uc3RydWN0b3IsIGlzX2NvbW11dGF0aXZlLCAuLi5hcmdzKTtcbiAgICB9XG5cbiAgICBtYWtlX2FyZ3MoY2xzOiBhbnksIGV4cHI6IGFueSkge1xuICAgICAgICBpZiAoZXhwciBpbnN0YW5jZW9mIGNscykge1xuICAgICAgICAgICAgcmV0dXJuIGV4cHIuX2FyZ3M7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gW2V4cHJdO1xuICAgICAgICB9XG4gICAgfVxufTtcblxuLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5ldy1jYXBcbk1hbmFnZWRQcm9wZXJ0aWVzLnJlZ2lzdGVyKEFzc29jT3AoT2JqZWN0KSk7XG5cbmV4cG9ydCB7QXNzb2NPcH07XG4iLCAiXG5pbXBvcnQge01hbmFnZWRQcm9wZXJ0aWVzfSBmcm9tIFwiLi9hc3N1bXB0aW9ucy5qc1wiO1xuaW1wb3J0IHtfRXhwcn0gZnJvbSBcIi4vZXhwci5qc1wiO1xuaW1wb3J0IHtHbG9iYWx9IGZyb20gXCIuL2dsb2JhbC5qc1wiO1xuaW1wb3J0IHtfTnVtYmVyX30gZnJvbSBcIi4vbnVtYmVycy5qc1wiO1xuaW1wb3J0IHtnbG9iYWxfcGFyYW1ldGVyc30gZnJvbSBcIi4vcGFyYW1ldGVycy5qc1wiO1xuaW1wb3J0IHtTfSBmcm9tIFwiLi9zaW5nbGV0b24uanNcIjtcblxuZXhwb3J0IGNsYXNzIFBvdyBleHRlbmRzIF9FeHByIHtcbiAgICAvKlxuICAgIERlZmluZXMgdGhlIGV4cHJlc3Npb24geCoqeSBhcyBcInggcmFpc2VkIHRvIGEgcG93ZXIgeVwiXG4gICAgLi4gZGVwcmVjYXRlZDo6IDEuN1xuICAgICAgIFVzaW5nIGFyZ3VtZW50cyB0aGF0IGFyZW4ndCBzdWJjbGFzc2VzIG9mIDpjbGFzczpgfi5FeHByYCBpbiBjb3JlXG4gICAgICAgb3BlcmF0b3JzICg6Y2xhc3M6YH4uTXVsYCwgOmNsYXNzOmB+LkFkZGAsIGFuZCA6Y2xhc3M6YH4uUG93YCkgaXNcbiAgICAgICBkZXByZWNhdGVkLiBTZWUgOnJlZjpgbm9uLWV4cHItYXJncy1kZXByZWNhdGVkYCBmb3IgZGV0YWlscy5cbiAgICBTaW5nbGV0b24gZGVmaW5pdGlvbnMgaW52b2x2aW5nICgwLCAxLCAtMSwgb28sIC1vbywgSSwgLUkpOlxuICAgICstLS0tLS0tLS0tLS0tLSstLS0tLS0tLS0rLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0rXG4gICAgfCBleHByICAgICAgICAgfCB2YWx1ZSAgIHwgcmVhc29uICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHxcbiAgICArPT09PT09PT09PT09PT0rPT09PT09PT09Kz09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09K1xuICAgIHwgeioqMCAgICAgICAgIHwgMSAgICAgICB8IEFsdGhvdWdoIGFyZ3VtZW50cyBvdmVyIDAqKjAgZXhpc3QsIHNlZSBbMl0uICB8XG4gICAgKy0tLS0tLS0tLS0tLS0tKy0tLS0tLS0tLSstLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLStcbiAgICB8IHoqKjEgICAgICAgICB8IHogICAgICAgfCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfFxuICAgICstLS0tLS0tLS0tLS0tLSstLS0tLS0tLS0rLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0rXG4gICAgfCAoLW9vKSoqKC0xKSAgfCAwICAgICAgIHwgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHxcbiAgICArLS0tLS0tLS0tLS0tLS0rLS0tLS0tLS0tKy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tK1xuICAgIHwgKC0xKSoqLTEgICAgIHwgLTEgICAgICB8ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB8XG4gICAgKy0tLS0tLS0tLS0tLS0tKy0tLS0tLS0tLSstLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLStcbiAgICB8IFMuWmVybyoqLTEgICB8IHpvbyAgICAgfCBUaGlzIGlzIG5vdCBzdHJpY3RseSB0cnVlLCBhcyAwKiotMSBtYXkgYmUgICAgfFxuICAgIHwgICAgICAgICAgICAgIHwgICAgICAgICB8IHVuZGVmaW5lZCwgYnV0IGlzIGNvbnZlbmllbnQgaW4gc29tZSBjb250ZXh0cyB8XG4gICAgfCAgICAgICAgICAgICAgfCAgICAgICAgIHwgd2hlcmUgdGhlIGJhc2UgaXMgYXNzdW1lZCB0byBiZSBwb3NpdGl2ZS4gICAgIHxcbiAgICArLS0tLS0tLS0tLS0tLS0rLS0tLS0tLS0tKy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tK1xuICAgIHwgMSoqLTEgICAgICAgIHwgMSAgICAgICB8ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB8XG4gICAgKy0tLS0tLS0tLS0tLS0tKy0tLS0tLS0tLSstLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLStcbiAgICB8IG9vKiotMSAgICAgICB8IDAgICAgICAgfCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfFxuICAgICstLS0tLS0tLS0tLS0tLSstLS0tLS0tLS0rLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0rXG4gICAgfCAwKipvbyAgICAgICAgfCAwICAgICAgIHwgQmVjYXVzZSBmb3IgYWxsIGNvbXBsZXggbnVtYmVycyB6IG5lYXIgICAgICAgIHxcbiAgICB8ICAgICAgICAgICAgICB8ICAgICAgICAgfCAwLCB6KipvbyAtPiAwLiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfFxuICAgICstLS0tLS0tLS0tLS0tLSstLS0tLS0tLS0rLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0rXG4gICAgfCAwKiotb28gICAgICAgfCB6b28gICAgIHwgVGhpcyBpcyBub3Qgc3RyaWN0bHkgdHJ1ZSwgYXMgMCoqb28gbWF5IGJlICAgIHxcbiAgICB8ICAgICAgICAgICAgICB8ICAgICAgICAgfCBvc2NpbGxhdGluZyBiZXR3ZWVuIHBvc2l0aXZlIGFuZCBuZWdhdGl2ZSAgICAgfFxuICAgIHwgICAgICAgICAgICAgIHwgICAgICAgICB8IHZhbHVlcyBvciByb3RhdGluZyBpbiB0aGUgY29tcGxleCBwbGFuZS4gICAgICB8XG4gICAgfCAgICAgICAgICAgICAgfCAgICAgICAgIHwgSXQgaXMgY29udmVuaWVudCwgaG93ZXZlciwgd2hlbiB0aGUgYmFzZSAgICAgIHxcbiAgICB8ICAgICAgICAgICAgICB8ICAgICAgICAgfCBpcyBwb3NpdGl2ZS4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfFxuICAgICstLS0tLS0tLS0tLS0tLSstLS0tLS0tLS0rLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0rXG4gICAgfCAxKipvbyAgICAgICAgfCBuYW4gICAgIHwgQmVjYXVzZSB0aGVyZSBhcmUgdmFyaW91cyBjYXNlcyB3aGVyZSAgICAgICAgIHxcbiAgICB8IDEqKi1vbyAgICAgICB8ICAgICAgICAgfCBsaW0oeCh0KSx0KT0xLCBsaW0oeSh0KSx0KT1vbyAob3IgLW9vKSwgICAgICAgfFxuICAgIHwgICAgICAgICAgICAgIHwgICAgICAgICB8IGJ1dCBsaW0oIHgodCkqKnkodCksIHQpICE9IDEuICBTZWUgWzNdLiAgICAgICB8XG4gICAgKy0tLS0tLS0tLS0tLS0tKy0tLS0tLS0tLSstLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLStcbiAgICB8IGIqKnpvbyAgICAgICB8IG5hbiAgICAgfCBCZWNhdXNlIGIqKnogaGFzIG5vIGxpbWl0IGFzIHogLT4gem9vICAgICAgICAgfFxuICAgICstLS0tLS0tLS0tLS0tLSstLS0tLS0tLS0rLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0rXG4gICAgfCAoLTEpKipvbyAgICAgfCBuYW4gICAgIHwgQmVjYXVzZSBvZiBvc2NpbGxhdGlvbnMgaW4gdGhlIGxpbWl0LiAgICAgICAgIHxcbiAgICB8ICgtMSkqKigtb28pICB8ICAgICAgICAgfCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfFxuICAgICstLS0tLS0tLS0tLS0tLSstLS0tLS0tLS0rLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0rXG4gICAgfCBvbyoqb28gICAgICAgfCBvbyAgICAgIHwgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHxcbiAgICArLS0tLS0tLS0tLS0tLS0rLS0tLS0tLS0tKy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tK1xuICAgIHwgb28qKi1vbyAgICAgIHwgMCAgICAgICB8ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB8XG4gICAgKy0tLS0tLS0tLS0tLS0tKy0tLS0tLS0tLSstLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLStcbiAgICB8ICgtb28pKipvbyAgICB8IG5hbiAgICAgfCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfFxuICAgIHwgKC1vbykqKi1vbyAgIHwgICAgICAgICB8ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB8XG4gICAgKy0tLS0tLS0tLS0tLS0tKy0tLS0tLS0tLSstLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLStcbiAgICB8IG9vKipJICAgICAgICB8IG5hbiAgICAgfCBvbyoqZSBjb3VsZCBwcm9iYWJseSBiZSBiZXN0IHRob3VnaHQgb2YgYXMgICAgfFxuICAgIHwgKC1vbykqKkkgICAgIHwgICAgICAgICB8IHRoZSBsaW1pdCBvZiB4KiplIGZvciByZWFsIHggYXMgeCB0ZW5kcyB0byAgICB8XG4gICAgfCAgICAgICAgICAgICAgfCAgICAgICAgIHwgb28uIElmIGUgaXMgSSwgdGhlbiB0aGUgbGltaXQgZG9lcyBub3QgZXhpc3QgIHxcbiAgICB8ICAgICAgICAgICAgICB8ICAgICAgICAgfCBhbmQgbmFuIGlzIHVzZWQgdG8gaW5kaWNhdGUgdGhhdC4gICAgICAgICAgICAgfFxuICAgICstLS0tLS0tLS0tLS0tLSstLS0tLS0tLS0rLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0rXG4gICAgfCBvbyoqKDErSSkgICAgfCB6b28gICAgIHwgSWYgdGhlIHJlYWwgcGFydCBvZiBlIGlzIHBvc2l0aXZlLCB0aGVuIHRoZSAgIHxcbiAgICB8ICgtb28pKiooMStJKSB8ICAgICAgICAgfCBsaW1pdCBvZiBhYnMoeCoqZSkgaXMgb28uIFNvIHRoZSBsaW1pdCB2YWx1ZSAgfFxuICAgIHwgICAgICAgICAgICAgIHwgICAgICAgICB8IGlzIHpvby4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB8XG4gICAgKy0tLS0tLS0tLS0tLS0tKy0tLS0tLS0tLSstLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLStcbiAgICB8IG9vKiooLTErSSkgICB8IDAgICAgICAgfCBJZiB0aGUgcmVhbCBwYXJ0IG9mIGUgaXMgbmVnYXRpdmUsIHRoZW4gdGhlICAgfFxuICAgIHwgLW9vKiooLTErSSkgIHwgICAgICAgICB8IGxpbWl0IGlzIDAuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB8XG4gICAgKy0tLS0tLS0tLS0tLS0tKy0tLS0tLS0tLSstLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLStcbiAgICBCZWNhdXNlIHN5bWJvbGljIGNvbXB1dGF0aW9ucyBhcmUgbW9yZSBmbGV4aWJsZSB0aGFuIGZsb2F0aW5nIHBvaW50XG4gICAgY2FsY3VsYXRpb25zIGFuZCB3ZSBwcmVmZXIgdG8gbmV2ZXIgcmV0dXJuIGFuIGluY29ycmVjdCBhbnN3ZXIsXG4gICAgd2UgY2hvb3NlIG5vdCB0byBjb25mb3JtIHRvIGFsbCBJRUVFIDc1NCBjb252ZW50aW9ucy4gIFRoaXMgaGVscHNcbiAgICB1cyBhdm9pZCBleHRyYSB0ZXN0LWNhc2UgY29kZSBpbiB0aGUgY2FsY3VsYXRpb24gb2YgbGltaXRzLlxuICAgIFNlZSBBbHNvXG4gICAgPT09PT09PT1cbiAgICBzeW1weS5jb3JlLm51bWJlcnMuSW5maW5pdHlcbiAgICBzeW1weS5jb3JlLm51bWJlcnMuTmVnYXRpdmVJbmZpbml0eVxuICAgIHN5bXB5LmNvcmUubnVtYmVycy5OYU5cbiAgICBSZWZlcmVuY2VzXG4gICAgPT09PT09PT09PVxuICAgIC4uIFsxXSBodHRwczovL2VuLndpa2lwZWRpYS5vcmcvd2lraS9FeHBvbmVudGlhdGlvblxuICAgIC4uIFsyXSBodHRwczovL2VuLndpa2lwZWRpYS5vcmcvd2lraS9FeHBvbmVudGlhdGlvbiNaZXJvX3RvX3RoZV9wb3dlcl9vZl96ZXJvXG4gICAgLi4gWzNdIGh0dHBzOi8vZW4ud2lraXBlZGlhLm9yZy93aWtpL0luZGV0ZXJtaW5hdGVfZm9ybXNcbiAgICAqL1xuICAgIHN0YXRpYyBpc19Qb3cgPSB0cnVlO1xuICAgIF9fc2xvdHNfXyA9IFtcImlzX2NvbW11dGF0aXZlXCJdO1xuXG4gICAgLy8gdG8tZG86IG5lZWRzIHN1cHBvcnQgZm9yIGVeeFxuICAgIGNvbnN0cnVjdG9yKGI6IGFueSwgZTogYW55LCBldmFsdWF0ZTogYm9vbGVhbiA9IHVuZGVmaW5lZCwgc2ltcGxpZnk6IGJvb2xlYW4gPSB0cnVlKSB7XG4gICAgICAgIHN1cGVyKGIsIGUpO1xuICAgICAgICB0aGlzLl9hcmdzID0gW2IsIGVdO1xuICAgICAgICBpZiAodHlwZW9mIGV2YWx1YXRlID09PSBcInVuZGVmaW5lZFwiKSB7XG4gICAgICAgICAgICBldmFsdWF0ZSA9IGdsb2JhbF9wYXJhbWV0ZXJzLmV2YWx1YXRlO1xuICAgICAgICB9XG4gICAgICAgIGlmIChzaW1wbGlmeSkge1xuICAgICAgICAgICAgaWYgKGV2YWx1YXRlKSB7XG4gICAgICAgICAgICAgICAgaWYgKGUgPT09IFMuQ29tcGxleEluZmluaXR5KSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBTLk5hTjtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgaWYgKGUgPT09IFMuSW5maW5pdHkpIHtcbiAgICAgICAgICAgICAgICAgICAgLy8gdGhpcyBwYXJ0IGlzIG5vdCBmdWxseSBkb25lXG4gICAgICAgICAgICAgICAgICAgIC8vIHNob3VsZCBiZSB1cGRhdGVkIHRvIHVzZSByZWxhdGlvbmFsXG4gICAgICAgICAgICAgICAgICAgIGlmIChiLmNvbnN0cnVjdG9yLmlzX3Bvc2l0aXZlIHx8IGIuaXNfcG9zaXRpdmUoKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFMuSW5maW5pdHk7XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoYi5jb25zdHJ1Y3Rvci5pc196ZXJvKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gUy5aZXJvO1xuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGIuaXNfZmluaXRlKCkgfHwgYi5jb25zdHJ1Y3Rvci5pc19maW5pdGUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gUy5Db21wbGV4SW5maW5pdHk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBTLk5hTjtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBpZiAoZSA9PT0gUy5aZXJvKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBTLk9uZTtcbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKGUgPT09IFMuT25lKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBiO1xuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoZSA9PT0gUy5OZWdhdGl2ZU9uZSAmJiAhYikge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gUy5Db21wbGV4SW5maW5pdHk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmICgoZS5jb25zdHJ1Y3Rvci5pc19TeW1ib2wgJiYgZS5jb25zdHJ1Y3Rvci5pc19pbnRlZ2VyIHx8XG4gICAgICAgICAgICAgICAgICAgIGUuY29uc3RydWN0b3IuaXNfSW50ZWdlciAmJiAoYi5jb25zdHJ1Y3Rvci5pc19OdW1iZXIgJiZcbiAgICAgICAgICAgICAgICAgICAgYi5jb25zdHJ1Y3Rvci5pc19NdWwgfHwgYi5jb25zdHJ1Y3Rvci5pc19OdW1iZXIpKSAmJiAoZS5pc19leHRlbmRlZF9uZWdhdGl2ZSA9PT0gdHJ1ZSkpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGUuaXNfZXZlbigpIHx8IGUuY29uc3RydWN0b3IuaXNfZXZlbikge1xuICAgICAgICAgICAgICAgICAgICAgICAgYiA9IGIuX19tdWxfXyhTLk5lZ2F0aXZlT25lKTtcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBuZXcgUG93KGIuX19tdWxfXyhTLk5lZ2F0aXZlT25lKSwgZSkuX19tdWxfXyhTLk5lZ2F0aXZlT25lKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBpZiAoYiA9PT0gUy5OYU4gfHwgZSA9PT0gUy5OYU4pIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFMuTmFOO1xuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoYiA9PT0gUy5PbmUpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGUuaXNfaW5maW5pdGUoKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFMuTmFOO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBTLk9uZTtcbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKGUuY29uc3RydWN0b3IuaXNfTnVtYmVyICYmIGIuY29uc3RydWN0b3IuaXNfTnVtYmVyICkge1xuICAgICAgICAgICAgICAgICAgICAvLyBiYXNlIEUgc3R1ZmYgbm90IHlldCBpbXBsZW1lbnRlZFxuICAgICAgICAgICAgICAgICAgICBjb25zdCBvYmogPSBiLl9ldmFsX3Bvd2VyKGUpO1xuICAgICAgICAgICAgICAgICAgICBpZiAodHlwZW9mIG9iaiAhPT0gXCJ1bmRlZmluZWRcIikge1xuICAgICAgICAgICAgICAgICAgICAgICAgb2JqLmlzX2NvbW11dGF0aXZlID0gKGIuY29uc3RydWN0b3IuaXNfY29tbXV0YXRpdmUgJiYgZS5jb25zdHJ1Y3Rvci5pc19jb21tdXRhdGl2ZSk7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gb2JqO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHRoaXMuaXNfY29tbXV0YXRpdmUgPSAoYi5jb25zdHJ1Y3Rvci5pc19jb21tdXRhdGl2ZSAmJiBlLmNvbnN0cnVjdG9yLmlzX2NvbW11dGF0aXZlKTtcbiAgICB9XG5cbiAgICBhc19iYXNlX2V4cCgpIHtcbiAgICAgICAgY29uc3QgYiA9IHRoaXMuX2FyZ3NbMF07XG4gICAgICAgIGNvbnN0IGUgPSB0aGlzLl9hcmdzWzFdO1xuICAgICAgICBpZiAoYi5pc19SYXRpb25hbCAmJiBiLnAgPT09IDEgJiYgYi5xICE9PSAxKSB7XG4gICAgICAgICAgICBjb25zdCBwMSA9IF9OdW1iZXJfLm5ldyhiLnEpO1xuICAgICAgICAgICAgY29uc3QgcDIgPSBlLl9fbXVsX18oUy5OZWdhdGl2ZU9uZSk7XG4gICAgICAgICAgICByZXR1cm4gW3AxLCBwMl07XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIFtiLCBlXTtcbiAgICB9XG5cbiAgICBzdGF0aWMgX25ldyhiOiBhbnksIGU6IGFueSkge1xuICAgICAgICByZXR1cm4gbmV3IFBvdyhiLCBlKTtcbiAgICB9XG59XG5cbk1hbmFnZWRQcm9wZXJ0aWVzLnJlZ2lzdGVyKFBvdyk7XG5HbG9iYWwucmVnaXN0ZXIoXCJQb3dcIiwgUG93Ll9uZXcpO1xuXG4vLyBpbXBsZW1lbnRlZCBkaWZmZXJlbnQgdGhhbiBzeW1weSwgYnV0IGhhcyBzYW1lIGZ1bmN0aW9uYWxpdHkgKGZvciBub3cpXG5leHBvcnQgZnVuY3Rpb24gbnJvb3QoeTogbnVtYmVyLCBuOiBudW1iZXIpIHtcbiAgICBjb25zdCB4ID0gTWF0aC5mbG9vcih5ICoqICgxIC8gbikpO1xuICAgIHJldHVybiBbeCwgeCoqbiA9PT0geV07XG59XG4iLCAiaW1wb3J0IHtkaXZtb2R9IGZyb20gXCIuLi9udGhlb3J5L2ZhY3Rvcl8uanNcIjtcbmltcG9ydCB7QWRkfSBmcm9tIFwiLi9hZGQuanNcIjtcbmltcG9ydCB7TWFuYWdlZFByb3BlcnRpZXN9IGZyb20gXCIuL2Fzc3VtcHRpb25zLmpzXCI7XG5pbXBvcnQge0Jhc2ljfSBmcm9tIFwiLi9iYXNpYy5qc1wiO1xuaW1wb3J0IHtFeHByfSBmcm9tIFwiLi9leHByLmpzXCI7XG5pbXBvcnQge0dsb2JhbH0gZnJvbSBcIi4vZ2xvYmFsLmpzXCI7XG5pbXBvcnQge2Z1enp5X25vdHYyLCBfZnV6enlfZ3JvdXB2Mn0gZnJvbSBcIi4vbG9naWMuanNcIjtcbmltcG9ydCB7SW50ZWdlciwgUmF0aW9uYWx9IGZyb20gXCIuL251bWJlcnMuanNcIjtcbmltcG9ydCB7QXNzb2NPcH0gZnJvbSBcIi4vb3BlcmF0aW9ucy5qc1wiO1xuaW1wb3J0IHtnbG9iYWxfcGFyYW1ldGVyc30gZnJvbSBcIi4vcGFyYW1ldGVycy5qc1wiO1xuaW1wb3J0IHtQb3d9IGZyb20gXCIuL3Bvd2VyLmpzXCI7XG5pbXBvcnQge1N9IGZyb20gXCIuL3NpbmdsZXRvbi5qc1wiO1xuaW1wb3J0IHttaXgsIGJhc2UsIEhhc2hEaWN0LCBIYXNoU2V0LCBBcnJEZWZhdWx0RGljdH0gZnJvbSBcIi4vdXRpbGl0eS5qc1wiO1xuXG4vLyAjIGludGVybmFsIG1hcmtlciB0byBpbmRpY2F0ZTpcbi8vIFwidGhlcmUgYXJlIHN0aWxsIG5vbi1jb21tdXRhdGl2ZSBvYmplY3RzIC0tIGRvbid0IGZvcmdldCB0byBwcm9jZXNzIHRoZW1cIlxuXG4vLyBub3QgY3VycmVudGx5IGJlaW5nIHVzZWRcbmNsYXNzIE5DX01hcmtlciB7XG4gICAgaXNfT3JkZXIgPSBmYWxzZTtcbiAgICBpc19NdWwgPSBmYWxzZTtcbiAgICBpc19OdW1iZXIgPSBmYWxzZTtcbiAgICBpc19Qb2x5ID0gZmFsc2U7XG5cbiAgICBpc19jb21tdXRhdGl2ZSA9IGZhbHNlO1xufVxuXG5mdW5jdGlvbiBfbXVsc29ydChhcmdzOiBhbnlbXSkge1xuICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBuZXctY2FwXG4gICAgYXJncy5zb3J0KChhLCBiKSA9PiBCYXNpYy5jbXAoYSwgYikpO1xufVxuXG5leHBvcnQgY2xhc3MgTXVsIGV4dGVuZHMgbWl4KGJhc2UpLndpdGgoRXhwciwgQXNzb2NPcCkge1xuICAgIC8qXG4gICAgRXhwcmVzc2lvbiByZXByZXNlbnRpbmcgbXVsdGlwbGljYXRpb24gb3BlcmF0aW9uIGZvciBhbGdlYnJhaWMgZmllbGQuXG4gICAgLi4gZGVwcmVjYXRlZDo6IDEuN1xuICAgICAgIFVzaW5nIGFyZ3VtZW50cyB0aGF0IGFyZW4ndCBzdWJjbGFzc2VzIG9mIDpjbGFzczpgfi5FeHByYCBpbiBjb3JlXG4gICAgICAgb3BlcmF0b3JzICg6Y2xhc3M6YH4uTXVsYCwgOmNsYXNzOmB+LkFkZGAsIGFuZCA6Y2xhc3M6YH4uUG93YCkgaXNcbiAgICAgICBkZXByZWNhdGVkLiBTZWUgOnJlZjpgbm9uLWV4cHItYXJncy1kZXByZWNhdGVkYCBmb3IgZGV0YWlscy5cbiAgICBFdmVyeSBhcmd1bWVudCBvZiBgYE11bCgpYGAgbXVzdCBiZSBgYEV4cHJgYC4gSW5maXggb3BlcmF0b3IgYGAqYGBcbiAgICBvbiBtb3N0IHNjYWxhciBvYmplY3RzIGluIFN5bVB5IGNhbGxzIHRoaXMgY2xhc3MuXG4gICAgQW5vdGhlciB1c2Ugb2YgYGBNdWwoKWBgIGlzIHRvIHJlcHJlc2VudCB0aGUgc3RydWN0dXJlIG9mIGFic3RyYWN0XG4gICAgbXVsdGlwbGljYXRpb24gc28gdGhhdCBpdHMgYXJndW1lbnRzIGNhbiBiZSBzdWJzdGl0dXRlZCB0byByZXR1cm5cbiAgICBkaWZmZXJlbnQgY2xhc3MuIFJlZmVyIHRvIGV4YW1wbGVzIHNlY3Rpb24gZm9yIHRoaXMuXG4gICAgYGBNdWwoKWBgIGV2YWx1YXRlcyB0aGUgYXJndW1lbnQgdW5sZXNzIGBgZXZhbHVhdGU9RmFsc2VgYCBpcyBwYXNzZWQuXG4gICAgVGhlIGV2YWx1YXRpb24gbG9naWMgaW5jbHVkZXM6XG4gICAgMS4gRmxhdHRlbmluZ1xuICAgICAgICBgYE11bCh4LCBNdWwoeSwgeikpYGAgLT4gYGBNdWwoeCwgeSwgeilgYFxuICAgIDIuIElkZW50aXR5IHJlbW92aW5nXG4gICAgICAgIGBgTXVsKHgsIDEsIHkpYGAgLT4gYGBNdWwoeCwgeSlgYFxuICAgIDMuIEV4cG9uZW50IGNvbGxlY3RpbmcgYnkgYGAuYXNfYmFzZV9leHAoKWBgXG4gICAgICAgIGBgTXVsKHgsIHgqKjIpYGAgLT4gYGBQb3coeCwgMylgYFxuICAgIDQuIFRlcm0gc29ydGluZ1xuICAgICAgICBgYE11bCh5LCB4LCAyKWBgIC0+IGBgTXVsKDIsIHgsIHkpYGBcbiAgICBTaW5jZSBtdWx0aXBsaWNhdGlvbiBjYW4gYmUgdmVjdG9yIHNwYWNlIG9wZXJhdGlvbiwgYXJndW1lbnRzIG1heVxuICAgIGhhdmUgdGhlIGRpZmZlcmVudCA6b2JqOmBzeW1weS5jb3JlLmtpbmQuS2luZCgpYC4gS2luZCBvZiB0aGVcbiAgICByZXN1bHRpbmcgb2JqZWN0IGlzIGF1dG9tYXRpY2FsbHkgaW5mZXJyZWQuXG4gICAgRXhhbXBsZXNcbiAgICA9PT09PT09PVxuICAgID4+PiBmcm9tIHN5bXB5IGltcG9ydCBNdWxcbiAgICA+Pj4gZnJvbSBzeW1weS5hYmMgaW1wb3J0IHgsIHlcbiAgICA+Pj4gTXVsKHgsIDEpXG4gICAgeFxuICAgID4+PiBNdWwoeCwgeClcbiAgICB4KioyXG4gICAgSWYgYGBldmFsdWF0ZT1GYWxzZWBgIGlzIHBhc3NlZCwgcmVzdWx0IGlzIG5vdCBldmFsdWF0ZWQuXG4gICAgPj4+IE11bCgxLCAyLCBldmFsdWF0ZT1GYWxzZSlcbiAgICAxKjJcbiAgICA+Pj4gTXVsKHgsIHgsIGV2YWx1YXRlPUZhbHNlKVxuICAgIHgqeFxuICAgIGBgTXVsKClgYCBhbHNvIHJlcHJlc2VudHMgdGhlIGdlbmVyYWwgc3RydWN0dXJlIG9mIG11bHRpcGxpY2F0aW9uXG4gICAgb3BlcmF0aW9uLlxuICAgID4+PiBmcm9tIHN5bXB5IGltcG9ydCBNYXRyaXhTeW1ib2xcbiAgICA+Pj4gQSA9IE1hdHJpeFN5bWJvbCgnQScsIDIsMilcbiAgICA+Pj4gZXhwciA9IE11bCh4LHkpLnN1YnMoe3k6QX0pXG4gICAgPj4+IGV4cHJcbiAgICB4KkFcbiAgICA+Pj4gdHlwZShleHByKVxuICAgIDxjbGFzcyAnc3ltcHkubWF0cmljZXMuZXhwcmVzc2lvbnMubWF0bXVsLk1hdE11bCc+XG4gICAgU2VlIEFsc29cbiAgICA9PT09PT09PVxuICAgIE1hdE11bFxuICAgICovXG4gICAgX19zbG90c19fOiBhbnlbXSA9IFtdO1xuICAgIGFyZ3M6IGFueVtdO1xuICAgIHN0YXRpYyBpc19NdWwgPSB0cnVlO1xuICAgIF9hcmdzX3R5cGUgPSBFeHByO1xuICAgIHN0YXRpYyBpZGVudGl0eSA9IFMuT25lO1xuXG4gICAgY29uc3RydWN0b3IoZXZhbHVhdGU6IGJvb2xlYW4sIHNpbXBsaWZ5OiBib29sZWFuLCAuLi5hcmdzOiBhbnkpIHtcbiAgICAgICAgc3VwZXIoTXVsLCBldmFsdWF0ZSwgc2ltcGxpZnksIC4uLmFyZ3MpO1xuICAgIH1cblxuICAgIGZsYXR0ZW4oc2VxOiBhbnkpIHtcbiAgICAgICAgLyogUmV0dXJuIGNvbW11dGF0aXZlLCBub25jb21tdXRhdGl2ZSBhbmQgb3JkZXIgYXJndW1lbnRzIGJ5XG4gICAgICAgIGNvbWJpbmluZyByZWxhdGVkIHRlcm1zLlxuICAgICAgICBOb3Rlc1xuICAgICAgICA9PT09PVxuICAgICAgICAgICAgKiBJbiBhbiBleHByZXNzaW9uIGxpa2UgYGBhKmIqY2BgLCBQeXRob24gcHJvY2VzcyB0aGlzIHRocm91Z2ggU3ltUHlcbiAgICAgICAgICAgICAgYXMgYGBNdWwoTXVsKGEsIGIpLCBjKWBgLiBUaGlzIGNhbiBoYXZlIHVuZGVzaXJhYmxlIGNvbnNlcXVlbmNlcy5cbiAgICAgICAgICAgICAgLSAgU29tZXRpbWVzIHRlcm1zIGFyZSBub3QgY29tYmluZWQgYXMgb25lIHdvdWxkIGxpa2U6XG4gICAgICAgICAgICAgICAgIHtjLmYuIGh0dHBzOi8vZ2l0aHViLmNvbS9zeW1weS9zeW1weS9pc3N1ZXMvNDU5Nn1cbiAgICAgICAgICAgICAgICA+Pj4gZnJvbSBzeW1weSBpbXBvcnQgTXVsLCBzcXJ0XG4gICAgICAgICAgICAgICAgPj4+IGZyb20gc3ltcHkuYWJjIGltcG9ydCB4LCB5LCB6XG4gICAgICAgICAgICAgICAgPj4+IDIqKHggKyAxKSAjIHRoaXMgaXMgdGhlIDItYXJnIE11bCBiZWhhdmlvclxuICAgICAgICAgICAgICAgIDIqeCArIDJcbiAgICAgICAgICAgICAgICA+Pj4geSooeCArIDEpKjJcbiAgICAgICAgICAgICAgICAyKnkqKHggKyAxKVxuICAgICAgICAgICAgICAgID4+PiAyKih4ICsgMSkqeSAjIDItYXJnIHJlc3VsdCB3aWxsIGJlIG9idGFpbmVkIGZpcnN0XG4gICAgICAgICAgICAgICAgeSooMip4ICsgMilcbiAgICAgICAgICAgICAgICA+Pj4gTXVsKDIsIHggKyAxLCB5KSAjIGFsbCAzIGFyZ3Mgc2ltdWx0YW5lb3VzbHkgcHJvY2Vzc2VkXG4gICAgICAgICAgICAgICAgMip5Kih4ICsgMSlcbiAgICAgICAgICAgICAgICA+Pj4gMiooKHggKyAxKSp5KSAjIHBhcmVudGhlc2VzIGNhbiBjb250cm9sIHRoaXMgYmVoYXZpb3JcbiAgICAgICAgICAgICAgICAyKnkqKHggKyAxKVxuICAgICAgICAgICAgICAgIFBvd2VycyB3aXRoIGNvbXBvdW5kIGJhc2VzIG1heSBub3QgZmluZCBhIHNpbmdsZSBiYXNlIHRvXG4gICAgICAgICAgICAgICAgY29tYmluZSB3aXRoIHVubGVzcyBhbGwgYXJndW1lbnRzIGFyZSBwcm9jZXNzZWQgYXQgb25jZS5cbiAgICAgICAgICAgICAgICBQb3N0LXByb2Nlc3NpbmcgbWF5IGJlIG5lY2Vzc2FyeSBpbiBzdWNoIGNhc2VzLlxuICAgICAgICAgICAgICAgIHtjLmYuIGh0dHBzOi8vZ2l0aHViLmNvbS9zeW1weS9zeW1weS9pc3N1ZXMvNTcyOH1cbiAgICAgICAgICAgICAgICA+Pj4gYSA9IHNxcnQoeCpzcXJ0KHkpKVxuICAgICAgICAgICAgICAgID4+PiBhKiozXG4gICAgICAgICAgICAgICAgKHgqc3FydCh5KSkqKigzLzIpXG4gICAgICAgICAgICAgICAgPj4+IE11bChhLGEsYSlcbiAgICAgICAgICAgICAgICAoeCpzcXJ0KHkpKSoqKDMvMilcbiAgICAgICAgICAgICAgICA+Pj4gYSphKmFcbiAgICAgICAgICAgICAgICB4KnNxcnQoeSkqc3FydCh4KnNxcnQoeSkpXG4gICAgICAgICAgICAgICAgPj4+IF8uc3VicyhhLmJhc2UsIHopLnN1YnMoeiwgYS5iYXNlKVxuICAgICAgICAgICAgICAgICh4KnNxcnQoeSkpKiooMy8yKVxuICAgICAgICAgICAgICAtICBJZiBtb3JlIHRoYW4gdHdvIHRlcm1zIGFyZSBiZWluZyBtdWx0aXBsaWVkIHRoZW4gYWxsIHRoZVxuICAgICAgICAgICAgICAgICBwcmV2aW91cyB0ZXJtcyB3aWxsIGJlIHJlLXByb2Nlc3NlZCBmb3IgZWFjaCBuZXcgYXJndW1lbnQuXG4gICAgICAgICAgICAgICAgIFNvIGlmIGVhY2ggb2YgYGBhYGAsIGBgYmBgIGFuZCBgYGNgYCB3ZXJlIDpjbGFzczpgTXVsYFxuICAgICAgICAgICAgICAgICBleHByZXNzaW9uLCB0aGVuIGBgYSpiKmNgYCAob3IgYnVpbGRpbmcgdXAgdGhlIHByb2R1Y3RcbiAgICAgICAgICAgICAgICAgd2l0aCBgYCo9YGApIHdpbGwgcHJvY2VzcyBhbGwgdGhlIGFyZ3VtZW50cyBvZiBgYGFgYCBhbmRcbiAgICAgICAgICAgICAgICAgYGBiYGAgdHdpY2U6IG9uY2Ugd2hlbiBgYGEqYmBgIGlzIGNvbXB1dGVkIGFuZCBhZ2FpbiB3aGVuXG4gICAgICAgICAgICAgICAgIGBgY2BgIGlzIG11bHRpcGxpZWQuXG4gICAgICAgICAgICAgICAgIFVzaW5nIGBgTXVsKGEsIGIsIGMpYGAgd2lsbCBwcm9jZXNzIGFsbCBhcmd1bWVudHMgb25jZS5cbiAgICAgICAgICAgICogVGhlIHJlc3VsdHMgb2YgTXVsIGFyZSBjYWNoZWQgYWNjb3JkaW5nIHRvIGFyZ3VtZW50cywgc28gZmxhdHRlblxuICAgICAgICAgICAgICB3aWxsIG9ubHkgYmUgY2FsbGVkIG9uY2UgZm9yIGBgTXVsKGEsIGIsIGMpYGAuIElmIHlvdSBjYW5cbiAgICAgICAgICAgICAgc3RydWN0dXJlIGEgY2FsY3VsYXRpb24gc28gdGhlIGFyZ3VtZW50cyBhcmUgbW9zdCBsaWtlbHkgdG8gYmVcbiAgICAgICAgICAgICAgcmVwZWF0cyB0aGVuIHRoaXMgY2FuIHNhdmUgdGltZSBpbiBjb21wdXRpbmcgdGhlIGFuc3dlci4gRm9yXG4gICAgICAgICAgICAgIGV4YW1wbGUsIHNheSB5b3UgaGFkIGEgTXVsLCBNLCB0aGF0IHlvdSB3aXNoZWQgdG8gZGl2aWRlIGJ5IGBgZFtpXWBgXG4gICAgICAgICAgICAgIGFuZCBtdWx0aXBseSBieSBgYG5baV1gYCBhbmQgeW91IHN1c3BlY3QgdGhlcmUgYXJlIG1hbnkgcmVwZWF0c1xuICAgICAgICAgICAgICBpbiBgYG5gYC4gSXQgd291bGQgYmUgYmV0dGVyIHRvIGNvbXB1dGUgYGBNKm5baV0vZFtpXWBgIHJhdGhlclxuICAgICAgICAgICAgICB0aGFuIGBgTS9kW2ldKm5baV1gYCBzaW5jZSBldmVyeSB0aW1lIG5baV0gaXMgYSByZXBlYXQsIHRoZVxuICAgICAgICAgICAgICBwcm9kdWN0LCBgYE0qbltpXWBgIHdpbGwgYmUgcmV0dXJuZWQgd2l0aG91dCBmbGF0dGVuaW5nIC0tIHRoZVxuICAgICAgICAgICAgICBjYWNoZWQgdmFsdWUgd2lsbCBiZSByZXR1cm5lZC4gSWYgeW91IGRpdmlkZSBieSB0aGUgYGBkW2ldYGBcbiAgICAgICAgICAgICAgZmlyc3QgKGFuZCB0aG9zZSBhcmUgbW9yZSB1bmlxdWUgdGhhbiB0aGUgYGBuW2ldYGApIHRoZW4gdGhhdCB3aWxsXG4gICAgICAgICAgICAgIGNyZWF0ZSBhIG5ldyBNdWwsIGBgTS9kW2ldYGAgdGhlIGFyZ3Mgb2Ygd2hpY2ggd2lsbCBiZSB0cmF2ZXJzZWRcbiAgICAgICAgICAgICAgYWdhaW4gd2hlbiBpdCBpcyBtdWx0aXBsaWVkIGJ5IGBgbltpXWBgLlxuICAgICAgICAgICAgICB7Yy5mLiBodHRwczovL2dpdGh1Yi5jb20vc3ltcHkvc3ltcHkvaXNzdWVzLzU3MDZ9XG4gICAgICAgICAgICAgIFRoaXMgY29uc2lkZXJhdGlvbiBpcyBtb290IGlmIHRoZSBjYWNoZSBpcyB0dXJuZWQgb2ZmLlxuICAgICAgICAgICAgTkJcbiAgICAgICAgICAgIC0tXG4gICAgICAgICAgICAgIFRoZSB2YWxpZGl0eSBvZiB0aGUgYWJvdmUgbm90ZXMgZGVwZW5kcyBvbiB0aGUgaW1wbGVtZW50YXRpb25cbiAgICAgICAgICAgICAgZGV0YWlscyBvZiBNdWwgYW5kIGZsYXR0ZW4gd2hpY2ggbWF5IGNoYW5nZSBhdCBhbnkgdGltZS4gVGhlcmVmb3JlLFxuICAgICAgICAgICAgICB5b3Ugc2hvdWxkIG9ubHkgY29uc2lkZXIgdGhlbSB3aGVuIHlvdXIgY29kZSBpcyBoaWdobHkgcGVyZm9ybWFuY2VcbiAgICAgICAgICAgICAgc2Vuc2l0aXZlLlxuICAgICAgICAgICAgICBSZW1vdmFsIG9mIDEgZnJvbSB0aGUgc2VxdWVuY2UgaXMgYWxyZWFkeSBoYW5kbGVkIGJ5IEFzc29jT3AuX19uZXdfXy5cbiAgICAgICAgKi9cbiAgICAgICAgbGV0IHJ2ID0gdW5kZWZpbmVkO1xuICAgICAgICBpZiAoc2VxLmxlbmd0aCA9PT0gMikge1xuICAgICAgICAgICAgbGV0IFthLCBiXSA9IHNlcTtcbiAgICAgICAgICAgIGlmIChiLmlzX1JhdGlvbmFsKCkpIHtcbiAgICAgICAgICAgICAgICBbYSwgYl0gPSBbYiwgYV07XG4gICAgICAgICAgICAgICAgc2VxID0gW2EsIGJdO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKCEoYS5pc196ZXJvKCkgJiYgYS5pc19SYXRpb25hbCgpKSkge1xuICAgICAgICAgICAgICAgIGxldCByO1xuICAgICAgICAgICAgICAgIFtyLCBiXSA9IGIuYXNfY29lZmZfTXVsKCk7XG4gICAgICAgICAgICAgICAgaWYgKGIuaXNfQWRkKCkpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHIgIT09IFMuT25lKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBsZXQgYXJiO1xuICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgYXIgPSBhLl9fbXVsX18ocik7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoYXIgPT09IFMuT25lKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYXJiID0gYjtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYXJiID0gdGhpcy5jb25zdHJ1Y3RvcihmYWxzZSwgdHJ1ZSwgYS5fX211bF9fKHIpLCBiKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIHJ2ID0gW1thcmJdLCBbXSwgdW5kZWZpbmVkXTtcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIGlmIChnbG9iYWxfcGFyYW1ldGVycy5kaXN0cmlidXRlICYmIGIuaXNfY29tbXV0YXRpdmUoKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgYXJnOiBhbnkgPSBbXTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGZvciAoY29uc3QgYmkgb2YgYi5fYXJncykge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGFyZy5wdXNoKHRoaXMuX2tlZXBfY29lZmYoYSwgYmkpKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IG5ld2IgPSBuZXcgQWRkKHRydWUsIHRydWUsIC4uLmFyZyk7XG4gICAgICAgICAgICAgICAgICAgICAgICBydiA9IFtbbmV3Yl0sIFtdLCB1bmRlZmluZWRdO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKHJ2KSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHJ2O1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgbGV0IGNfcGFydDogYW55ID0gW107XG4gICAgICAgIGNvbnN0IG5jX3NlcSA9IFtdO1xuICAgICAgICBsZXQgbmNfcGFydDogYW55ID0gW107XG4gICAgICAgIGxldCBjb2VmZiA9IFMuT25lO1xuICAgICAgICBsZXQgY19wb3dlcnMgPSBbXTtcbiAgICAgICAgbGV0IG5lZzFlID0gUy5aZXJvOyBsZXQgbnVtX2V4cCA9IFtdO1xuICAgICAgICBjb25zdCBwbnVtX3JhdCA9IG5ldyBIYXNoRGljdCgpO1xuICAgICAgICBjb25zdCBvcmRlcl9zeW1ib2xzOiBhbnlbXSA9IFtdO1xuXG4gICAgICAgIGZvciAobGV0IG8gb2Ygc2VxKSB7XG4gICAgICAgICAgICBpZiAoby5pc19NdWwoKSkge1xuICAgICAgICAgICAgICAgIGlmIChvLmlzX2NvbW11dGF0aXZlKCkpIHtcbiAgICAgICAgICAgICAgICAgICAgc2VxLnB1c2goLi4uby5fYXJncyk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgZm9yIChjb25zdCBxIG9mIG8uX2FyZ3MpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChxLmlzX2NvbW11dGF0aXZlKCkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzZXEucHVzaChxKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbmNfc2VxLnB1c2gocSk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKG8uaXNfTnVtYmVyKCkpIHtcbiAgICAgICAgICAgICAgICBpZiAobyA9PT0gUy5OYU4gfHwgY29lZmYgPT09IFMuQ29tcGxleEluZmluaXR5ICYmIG8uaXNfemVybygpKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBbW1MuTmFOXSwgW10sIHVuZGVmaW5lZF07XG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmIChjb2VmZi5pc19OdW1iZXIoKSkge1xuICAgICAgICAgICAgICAgICAgICBjb2VmZiA9IGNvZWZmLl9fbXVsX18obyk7XG4gICAgICAgICAgICAgICAgICAgIGlmIChjb2VmZiA9PT0gUy5OYU4pIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBbW1MuTmFOXSwgW10sIHVuZGVmaW5lZF07XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKG8gPT09IFMuQ29tcGxleEluZmluaXR5KSB7XG4gICAgICAgICAgICAgICAgaWYgKCEoY29lZmYpKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBbW1MuTmFOXSwgW10sIHVuZGVmaW5lZF07XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGNvZWZmID0gUy5Db21wbGV4SW5maW5pdHk7XG4gICAgICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKG8uaXNfY29tbXV0YXRpdmUoKSkge1xuICAgICAgICAgICAgICAgIGxldCBlOyBsZXQgYjtcbiAgICAgICAgICAgICAgICBbYiwgZV0gPSBvLmFzX2Jhc2VfZXhwKCk7XG4gICAgICAgICAgICAgICAgaWYgKG8uaXNfUG93KCkpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGIuaXNfTnVtYmVyKCkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChlLmlzX1JhdGlvbmFsKCkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoZS5pc19JbnRlZ2VyKCkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29lZmYgPSBjb2VmZi5fX211bF9fKG5ldyBQb3coYiwgZSkpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKGUuaXNfbmVnYXRpdmUoKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzZXEucHVzaChuZXcgUG93KGIsIGUpKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIGlmIChiLmlzX25lZ2F0aXZlKCkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbmVnMWUgPSBuZWcxZS5fX2FkZF9fKGUpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBiID0gYi5fX211bF9fKFMuTmVnYXRpdmVPbmUpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoYiAhPT0gUy5PbmUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcG51bV9yYXQuc2V0ZGVmYXVsdChiLCBbXSkucHVzaChlKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKGIuaXNfcG9zaXRpdmUoKSB8fCBiLmlzX2ludGVnZXIoKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG51bV9leHAucHVzaChbYiwgZV0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGNfcG93ZXJzLnB1c2goW2IsIGVdKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgaWYgKG8gIT09IE5DX01hcmtlcikge1xuICAgICAgICAgICAgICAgICAgICBuY19zZXEucHVzaChvKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgd2hpbGUgKG5jX3NlcSkge1xuICAgICAgICAgICAgICAgICAgICBvID0gbmNfc2VxLnNwbGljZSgwLCAxKTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKCEobmNfcGFydCkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIG5jX3BhcnQucHVzaChvKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IG8xID0gbmNfcGFydC5wb3AoKTtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgW2IxLCBlMV0gPSBvMS5hc19iYXNlX2V4cCgpO1xuICAgICAgICAgICAgICAgICAgICBjb25zdCBbYjIsIGUyXSA9IG8uYXNfYmFzZV9leHAoKTtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgbmV3X2V4cCA9IGUxLl9fYWRkX18oZTIpO1xuICAgICAgICAgICAgICAgICAgICBpZiAoYjEuZXEoYjIpICYmICEobmV3X2V4cC5pc19BZGQoKSkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IG8xMiA9IGIxLl9ldmFsX3Bvd2VyKG5ld19leHApO1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKG8xMi5pc19jb21tdXRhdGl2ZSgpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc2VxLnB1c2gobzEyKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbmNfc2VxLnNwbGljZSgwLCAwLCBvMTIpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgbmNfcGFydC5wdXNoKG8xKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIG5jX3BhcnQucHVzaChvKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGZ1bmN0aW9uIF9nYXRoZXIoY19wb3dlcnM6IGFueVtdKSB7XG4gICAgICAgICAgICBjb25zdCBjb21tb25fYiA9IG5ldyBIYXNoRGljdCgpO1xuICAgICAgICAgICAgZm9yIChjb25zdCBbYiwgZV0gb2YgY19wb3dlcnMpIHtcbiAgICAgICAgICAgICAgICBjb25zdCBjbyA9IGUuYXNfY29lZmZfTXVsKCk7XG4gICAgICAgICAgICAgICAgY29tbW9uX2Iuc2V0ZGVmYXVsdChiLCBuZXcgSGFzaERpY3QoKSkuc2V0ZGVmYXVsdChjb1sxXSwgW10pLnB1c2goY29bMF0pO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5vLXVudXNlZC12YXJzXG4gICAgICAgICAgICBmb3IgKGNvbnN0IFtiLCBkXSBvZiBjb21tb25fYi5lbnRyaWVzKCkpIHtcbiAgICAgICAgICAgICAgICBmb3IgKGNvbnN0IFtkaSwgbGldIG9mIGQuZW50cmllcygpKSB7XG4gICAgICAgICAgICAgICAgICAgIGQuYWRkKGRpLCBuZXcgQWRkKHRydWUsIHRydWUsIC4uLmxpKSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgY29uc3QgbmV3X2NfcG93ZXJzID0gW107XG4gICAgICAgICAgICBmb3IgKGNvbnN0IFtiLCBlXSBvZiBjb21tb25fYi5lbnRyaWVzKCkpIHtcbiAgICAgICAgICAgICAgICBmb3IgKGNvbnN0IFt0LCBjXSBvZiBlLmVudHJpZXMoKSkge1xuICAgICAgICAgICAgICAgICAgICBuZXdfY19wb3dlcnMucHVzaChbYiwgYy5fX211bF9fKHQpXSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIG5ld19jX3Bvd2VycztcbiAgICAgICAgfVxuXG4gICAgICAgIGNfcG93ZXJzID0gX2dhdGhlcihjX3Bvd2Vycyk7XG4gICAgICAgIG51bV9leHAgPSBfZ2F0aGVyKG51bV9leHApO1xuXG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgMjsgaSsrKSB7XG4gICAgICAgICAgICBjb25zdCBuZXdfY19wb3dlcnM6IGFueVtdID0gW107XG4gICAgICAgICAgICBsZXQgY2hhbmdlZCA9IGZhbHNlO1xuICAgICAgICAgICAgZm9yIChsZXQgW2IsIGVdIG9mIGNfcG93ZXJzKSB7XG4gICAgICAgICAgICAgICAgbGV0IHA6IGFueTtcbiAgICAgICAgICAgICAgICBpZiAoZS5pc196ZXJvKCkgPT09IHRydWUpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKChiLmlzX0FkZCgpIHx8IGIuaXNfTXVsKCkgJiZcbiAgICAgICAgICAgICAgICAgICAgICAgIGIuX2FyZ3MuaW5jbHVkZXMoUy5Db21wbGV4SW5maW5pdHksIFMuSW5maW5pdHksIFMuTmVmYXRpdmVJbmZpbml0eSkpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gW1tTLk5hTl0sIFtdLCB1bmRlZmluZWRdO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBpZiAoZSA9PT0gUy5PbmUpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGIuaXNfTnVtYmVyKCkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvZWZmID0gY29lZmYuX19tdWxfXyhiKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIHAgPSBiO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBpZiAoZSAhPT0gUy5PbmUpIHtcbiAgICAgICAgICAgICAgICAgICAgcCA9IG5ldyBQb3coYiwgZSk7XG4gICAgICAgICAgICAgICAgICAgIGlmIChwLmlzX1BvdygpICYmICFiLmlzX1BvdygpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBiaSA9IGI7XG4gICAgICAgICAgICAgICAgICAgICAgICBbYiwgZV0gPSBwLmFzX2Jhc2VfZXhwKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoYiAhPT0gYmkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjaGFuZ2VkID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBjX3BhcnQucHVzaChwKTtcbiAgICAgICAgICAgICAgICBuZXdfY19wb3dlcnMucHVzaChbYiwgZV0pO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgY29uc3QgYXJnc2V0ID0gbmV3IEhhc2hTZXQoKTtcbiAgICAgICAgICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBuby11bnVzZWQtdmFyc1xuICAgICAgICAgICAgZm9yIChjb25zdCBbYiwgZV0gb2YgbmV3X2NfcG93ZXJzKSB7XG4gICAgICAgICAgICAgICAgYXJnc2V0LmFkZChiKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChjaGFuZ2VkICYmIGFyZ3NldC5zaXplICE9PSBuZXdfY19wb3dlcnMubGVuZ3RoKSB7XG4gICAgICAgICAgICAgICAgY19wYXJ0ID0gW107XG4gICAgICAgICAgICAgICAgY19wb3dlcnMgPSBfZ2F0aGVyKG5ld19jX3Bvd2Vycyk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGNvbnN0IGludl9leHBfZGljdCA9IG5ldyBIYXNoRGljdCgpO1xuICAgICAgICBmb3IgKGNvbnN0IFtiLCBlXSBvZiBudW1fZXhwKSB7XG4gICAgICAgICAgICBpbnZfZXhwX2RpY3Quc2V0ZGVmYXVsdChlLCBbXSkucHVzaChiKTtcbiAgICAgICAgfVxuICAgICAgICBmb3IgKGNvbnN0IFtlLCBiXSBvZiBpbnZfZXhwX2RpY3QuZW50cmllcygpKSB7XG4gICAgICAgICAgICBpbnZfZXhwX2RpY3QuYWRkKGUsIG5ldyBNdWwodHJ1ZSwgdHJ1ZSwgLi4uYikpO1xuICAgICAgICB9XG4gICAgICAgIGNvbnN0IGNfcGFydF9hcmcgPSBbXTtcbiAgICAgICAgZm9yIChjb25zdCBbZSwgYl0gb2YgaW52X2V4cF9kaWN0LmVudHJpZXMoKSkge1xuICAgICAgICAgICAgaWYgKGUpIHtcbiAgICAgICAgICAgICAgICBjX3BhcnRfYXJnLnB1c2gobmV3IFBvdyhiLCBlKSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgY19wYXJ0LnB1c2goLi4uY19wYXJ0X2FyZyk7XG5cbiAgICAgICAgY29uc3QgY29tYl9lID0gbmV3IEhhc2hEaWN0KCk7XG4gICAgICAgIGZvciAoY29uc3QgW2IsIGVdIG9mIHBudW1fcmF0LmVudHJpZXMoKSkge1xuICAgICAgICAgICAgY29tYl9lLnNldGRlZmF1bHQobmV3IEFkZCh0cnVlLCB0cnVlLCAuLi5lKSwgW10pLnB1c2goYik7XG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCBudW1fcmF0ID0gW107XG4gICAgICAgIGZvciAobGV0IFtlLCBiXSBvZiBjb21iX2UuZW50cmllcygpKSB7XG4gICAgICAgICAgICBiID0gbmV3IE11bCh0cnVlLCB0cnVlLCAuLi5iKTtcbiAgICAgICAgICAgIGlmIChlLnEgPT09IDEpIHtcbiAgICAgICAgICAgICAgICBjb2VmZiA9IGNvZWZmLl9fbXVsX18obmV3IFBvdyhiLCBlKSk7XG4gICAgICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoZS5wID4gZS5xKSB7XG4gICAgICAgICAgICAgICAgY29uc3QgW2VfaSwgZXBdID0gZGl2bW9kKGUucCwgZS5xKTtcbiAgICAgICAgICAgICAgICBjb2VmZiA9IGNvZWZmLl9fbXVsX18obmV3IFBvdyhiLCBlX2kpKTtcbiAgICAgICAgICAgICAgICBlID0gbmV3IFJhdGlvbmFsKGVwLCBlLnEpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgbnVtX3JhdC5wdXNoKFtiLCBlXSk7XG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCBwbmV3ID0gbmV3IEFyckRlZmF1bHREaWN0KCk7XG4gICAgICAgIGxldCBpID0gMDtcbiAgICAgICAgd2hpbGUgKGkgPCBudW1fcmF0Lmxlbmd0aCkge1xuICAgICAgICAgICAgbGV0IFtiaSwgZWldOiBhbnkgPSBudW1fcmF0W2ldO1xuICAgICAgICAgICAgY29uc3QgZ3JvdyA9IFtdO1xuICAgICAgICAgICAgZm9yIChsZXQgaiA9IGkgKyAxOyBqIDwgbnVtX3JhdC5sZW5ndGg7IGorKykge1xuICAgICAgICAgICAgICAgIGNvbnN0IFtiaiwgZWpdOiBhbnkgPSBudW1fcmF0W2pdO1xuICAgICAgICAgICAgICAgIGNvbnN0IGcgPSBiaS5nY2QoYmopO1xuICAgICAgICAgICAgICAgIGlmIChnICE9PSBTLk9uZSkge1xuICAgICAgICAgICAgICAgICAgICBsZXQgZSA9IGVpLl9fYWRkX18oZWopO1xuICAgICAgICAgICAgICAgICAgICBpZiAoZS5xID09PSAxKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb2VmZiA9IGNvZWZmLl9fbXVsX18obmV3IFBvdyhnLCBlKSk7XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoZS5wID4gZS5xKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgW2VfaSwgZXBdID0gZGl2bW9kKGUucCwgZS5xKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb2VmZiA9IGNvZWZmLl9fbXVsX18obmV3IFBvdyhnLCBlX2kpKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBlID0gbmV3IFJhdGlvbmFsKGVwLCBlLnEpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgZ3Jvdy5wdXNoKFtnLCBlXSk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgbnVtX3JhdFtqXSA9IFtiai9nLCBlal07XG4gICAgICAgICAgICAgICAgICAgIGJpID0gYmkvZztcbiAgICAgICAgICAgICAgICAgICAgaWYgKGJpID09PSBTLk9uZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoYmkgIT09IFMuT25lKSB7XG4gICAgICAgICAgICAgICAgY29uc3Qgb2JqOiBhbnkgPSBuZXcgUG93KGJpLCBlaSk7XG4gICAgICAgICAgICAgICAgaWYgKG9iai5pc19OdW1iZXIoKSkge1xuICAgICAgICAgICAgICAgICAgICBjb2VmZiA9IGNvZWZmLl9fbXVsX18ob2JqKTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBmb3IgKGNvbnN0IGl0ZW0gb2YgdGhpcy5tYWtlX2FyZ3MoTXVsLCBvYmopKSB7IC8vICEhISEhIVxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGl0ZW0uaXNfTnVtYmVyKCkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb2VmZiA9IGNvZWZmLl9fbXVsX18ob2JqKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgW2JpLCBlaV0gPSBpdGVtLl9hcmdzO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBuZXcuYWRkKGVpLCBwbmV3LmdldChlaSkucHVzaChiaSkpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgbnVtX3JhdC5wdXNoKC4uLmdyb3cpO1xuICAgICAgICAgICAgaSsrO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKG5lZzFlICE9PSBTLlplcm8pIHtcbiAgICAgICAgICAgIGxldCBuOyBsZXQgcTsgbGV0IHA7XG4gICAgICAgICAgICBbcCwgcV0gPSBuZWcxZS5fYXNfbnVtZXJfZGVub20oKTtcbiAgICAgICAgICAgIFtuLCBwXSA9IGRpdm1vZChwLnAsIHEucCk7XG4gICAgICAgICAgICBpZiAobiAlIDIgIT09IDApIHtcbiAgICAgICAgICAgICAgICBjb2VmZiA9IGNvZWZmLl9fbXVsX18oUy5OZWdhdGl2ZU9uZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAocSA9PT0gMikge1xuICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcImltYWdpbmFyeSBudW1iZXJzIG5vdCB5ZXQgc3VwcG9ydGVkXCIpO1xuICAgICAgICAgICAgfSBlbHNlIGlmIChwKSB7XG4gICAgICAgICAgICAgICAgbmVnMWUgPSBuZXcgUmF0aW9uYWwocCwgcSk7XG4gICAgICAgICAgICAgICAgbGV0IGVudGVyZWxzZTogYm9vbGVhbiA9IHRydWU7XG4gICAgICAgICAgICAgICAgZm9yIChjb25zdCBbZSwgYl0gb2YgcG5ldy5lbnRyaWVzKCkpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGUgPT09IG5lZzFlICYmIGIuaXNfcG9zaXRpdmUoKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgcG5ldy5hZGQoZSwgcG5ldy5nZXQoZSkgLSBiKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGVudGVyZWxzZSA9IGZhbHNlO1xuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgaWYgKGVudGVyZWxzZSkge1xuICAgICAgICAgICAgICAgICAgICBjX3BhcnQucHVzaChuZXcgUG93KFMuTmVnYXRpdmVPbmUsIG5lZzFlLCBmYWxzZSkpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IGNfcGFydF9hcmd2MiA9IFtdO1xuICAgICAgICBmb3IgKGNvbnN0IFtiLCBlXSBvZiBwbmV3LmVudHJpZXMoKSkge1xuICAgICAgICAgICAgY19wYXJ0X2FyZ3YyLnB1c2gobmV3IFBvdyhiLCBlKSk7XG4gICAgICAgIH1cbiAgICAgICAgY19wYXJ0LnB1c2goLi4uY19wYXJ0X2FyZ3YyKTtcblxuICAgICAgICBpZiAoY29lZmYgPT09IFMuSW5maW5pdHkgfHwgY29lZmYgPT09IFMuTmVnYXRpdmVJbmZpbml0eSkge1xuICAgICAgICAgICAgZnVuY3Rpb24gX2hhbmRsZV9mb3Jfb28oY19wYXJ0OiBhbnlbXSwgY29lZmZfc2lnbjogbnVtYmVyKSB7XG4gICAgICAgICAgICAgICAgY29uc3QgbmV3X2NfcGFydCA9IFtdO1xuICAgICAgICAgICAgICAgIGZvciAoY29uc3QgdCBvZiBjX3BhcnQpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHQuaXNfZXh0ZW5kZWRfbmVnYXRpdmUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGlmICh0LmlzX2V4dGVuZGVkX25lZ2F0aXZlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb2VmZl9zaWduICo9IC0xO1xuICAgICAgICAgICAgICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgbmV3X2NfcGFydC5wdXNoKHQpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICByZXR1cm4gW25ld19jX3BhcnQsIGNvZWZmX3NpZ25dO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgbGV0IGNvZWZmX3NpZ246IGFueTtcbiAgICAgICAgICAgIFtjX3BhcnQsIGNvZWZmX3NpZ25dID0gX2hhbmRsZV9mb3Jfb28oY19wYXJ0LCAxKTtcbiAgICAgICAgICAgIFtuY19wYXJ0LCBjb2VmZl9zaWduXSA9IF9oYW5kbGVfZm9yX29vKG5jX3BhcnQsIGNvZWZmX3NpZ24pO1xuICAgICAgICAgICAgY29lZmYgPSBjb2VmZi5fX211bF9fKG5ldyBJbnRlZ2VyKGNvZWZmX3NpZ24pKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChjb2VmZiA9PT0gUy5Db21wbGV4SW5maW5pdHkpIHtcbiAgICAgICAgICAgIGNvbnN0IGN0ZW1wID0gW107XG4gICAgICAgICAgICBmb3IgKGNvbnN0IGMgb2YgY19wYXJ0KSB7XG4gICAgICAgICAgICAgICAgaWYgKCEoZnV6enlfbm90djIoYy5pc196ZXJvKCkpICYmIGMuaXNfZXh0ZW5kZWRfcmVhbCgpICE9PSBcInVuZGVmaW5lZFwiKSkge1xuICAgICAgICAgICAgICAgICAgICBjdGVtcC5wdXNoKGMpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGNfcGFydCA9IGN0ZW1wO1xuICAgICAgICAgICAgY29uc3QgbmN0ZW1wID0gW107XG4gICAgICAgICAgICBmb3IgKGNvbnN0IGMgb2YgbmNfcGFydCkge1xuICAgICAgICAgICAgICAgIGlmICghKGZ1enp5X25vdHYyKGMuaXNfemVybygpKSAmJiBjLmlzX2V4dGVuZGVkX3JlYWwoKSAhPT0gXCJ1bmRlZmluZWRcIikpIHtcbiAgICAgICAgICAgICAgICAgICAgbmN0ZW1wLnB1c2goYyk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgbmNfcGFydCA9IG5jdGVtcDtcbiAgICAgICAgfSBlbHNlIGlmIChjb2VmZi5pc196ZXJvKCkpIHtcbiAgICAgICAgICAgIGZvciAoY29uc3QgYyBvZiBjX3BhcnQpIHtcbiAgICAgICAgICAgICAgICBpZiAoYy5pc19maW5pdGUoKSA9PT0gZmFsc2UpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFtbUy5OYU5dLCBbXSwgb3JkZXJfc3ltYm9sc107XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgY29uc3QgX25ldyA9IFtdO1xuICAgICAgICBmb3IgKGNvbnN0IGkgb2YgY19wYXJ0KSB7XG4gICAgICAgICAgICBpZiAoaS5pc19OdW1iZXIoKSkge1xuICAgICAgICAgICAgICAgIGNvZWZmID0gY29lZmYuX19tdWxfXyhpKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgX25ldy5wdXNoKGkpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGNfcGFydCA9IF9uZXc7XG5cbiAgICAgICAgX211bHNvcnQoY19wYXJ0KTtcblxuICAgICAgICBpZiAoY29lZmYgIT09IFMuT25lKSB7XG4gICAgICAgICAgICBjX3BhcnQuc3BsaWNlKDAsIDAsIGNvZWZmKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChnbG9iYWxfcGFyYW1ldGVycy5kaXN0cmlidXRlICYmICFuY19wYXJ0ICYmIGNfcGFydC5sZW5ndGggPT09IDIgJiZcbiAgICAgICAgICAgIGNfcGFydFswXS5pc19OdW1iZXIoKSAmJiBjX3BhcnRbMF0uaXNfZmluaXRlKCkgJiYgY19wYXJ0WzFdLmlzX0FkZCgpKSB7XG4gICAgICAgICAgICBjb2VmZiA9IGNfcGFydFswXTtcbiAgICAgICAgICAgIGNvbnN0IGFkZGFyZyA9IFtdO1xuICAgICAgICAgICAgZm9yIChjb25zdCBmIG9mIGNfcGFydFsxXS5fYXJncykge1xuICAgICAgICAgICAgICAgIGFkZGFyZy5wdXNoKGNvZWZmLl9fbXVsX18oZikpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgY19wYXJ0ID0gbmV3IEFkZCh0cnVlLCB0cnVlLCAuLi5hZGRhcmcpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBbY19wYXJ0LCBuY19wYXJ0LCBvcmRlcl9zeW1ib2xzXTtcbiAgICB9XG5cbiAgICBhc19jb2VmZl9NdWwocmF0aW9uYWw6IGJvb2xlYW4gPSBmYWxzZSkge1xuICAgICAgICBjb25zdCBjb2VmZjogYW55ID0gdGhpcy5fYXJncy5zbGljZSgwLCAxKVswXTtcbiAgICAgICAgY29uc3QgYXJnczogYW55ID0gdGhpcy5fYXJncy5zbGljZSgxKTtcblxuICAgICAgICBpZiAoY29lZmYuaXNfTnVtYmVyKCkpIHtcbiAgICAgICAgICAgIGlmICghcmF0aW9uYWwgfHwgY29lZmYuaXNfUmF0aW9uYWwoKSkge1xuICAgICAgICAgICAgICAgIGlmIChhcmdzLmxlbmd0aCA9PT0gMSkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gW2NvZWZmLCBhcmdzWzBdXTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gW2NvZWZmLCB0aGlzLl9uZXdfcmF3YXJncyh0cnVlLCAuLi5hcmdzKV07XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSBlbHNlIGlmIChjb2VmZi5pc19leHRlbmRlZF9uZWdhdGl2ZSgpKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIFtTLk5lZ2F0aXZlT25lLCB0aGlzLl9uZXdfcmF3YXJncyh0cnVlLCAuLi5bLWNvZWZmXS5jb25jYXQoYXJncykpXTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gW1MuT25lLCB0aGlzXTtcbiAgICB9XG5cbiAgICBfZXZhbF9wb3dlcihlOiBhbnkpIHtcbiAgICAgICAgY29uc3QgW2NhcmdzLCBuY10gPSB0aGlzLmFyZ3NfY25jKGZhbHNlLCB0cnVlLCBmYWxzZSk7XG4gICAgICAgIGlmIChlLmlzX0ludGVnZXIoKSkge1xuICAgICAgICAgICAgY29uc3QgbXVsYXJncyA9IFtdO1xuICAgICAgICAgICAgZm9yIChjb25zdCBiIG9mIGNhcmdzKSB7XG4gICAgICAgICAgICAgICAgbXVsYXJncy5wdXNoKG5ldyBQb3coYiwgZSwgZmFsc2UpKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiBuZXcgTXVsKHRydWUsIHRydWUsIC4uLm11bGFyZ3MpLl9fbXVsX18oXG4gICAgICAgICAgICAgICAgbmV3IFBvdyh0aGlzLl9mcm9tX2FyZ3MoTXVsLCB1bmRlZmluZWQsIC4uLm5jKSwgZSwgZmFsc2UpKTtcbiAgICAgICAgfVxuICAgICAgICBjb25zdCBwID0gbmV3IFBvdyh0aGlzLCBlLCBmYWxzZSk7XG5cbiAgICAgICAgaWYgKGUuaXNfUmF0aW9uYWwoKSB8fCBlLmlzX0Zsb2F0KCkpIHtcbiAgICAgICAgICAgIHJldHVybiBwLl9ldmFsX2V4cGFuZF9wb3dlcl9iYXNlKCk7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gcDtcbiAgICB9XG5cbiAgICBfa2VlcF9jb2VmZihjb2VmZjogYW55LCBmYWN0b3JzOiBhbnksIGNsZWFyOiBib29sZWFuID0gdHJ1ZSwgc2lnbjogYm9vbGVhbiA9IGZhbHNlKTogYW55IHtcbiAgICAgICAgLyogUmV0dXJuIGBgY29lZmYqZmFjdG9yc2BgIHVuZXZhbHVhdGVkIGlmIG5lY2Vzc2FyeS5cbiAgICAgICAgSWYgYGBjbGVhcmBgIGlzIEZhbHNlLCBkbyBub3Qga2VlcCB0aGUgY29lZmZpY2llbnQgYXMgYSBmYWN0b3JcbiAgICAgICAgaWYgaXQgY2FuIGJlIGRpc3RyaWJ1dGVkIG9uIGEgc2luZ2xlIGZhY3RvciBzdWNoIHRoYXQgb25lIG9yXG4gICAgICAgIG1vcmUgdGVybXMgd2lsbCBzdGlsbCBoYXZlIGludGVnZXIgY29lZmZpY2llbnRzLlxuICAgICAgICBJZiBgYHNpZ25gYCBpcyBUcnVlLCBhbGxvdyBhIGNvZWZmaWNpZW50IG9mIC0xIHRvIHJlbWFpbiBmYWN0b3JlZCBvdXQuXG4gICAgICAgIEV4YW1wbGVzXG4gICAgICAgID09PT09PT09XG4gICAgICAgID4+PiBmcm9tIHN5bXB5LmNvcmUubXVsIGltcG9ydCBfa2VlcF9jb2VmZlxuICAgICAgICA+Pj4gZnJvbSBzeW1weS5hYmMgaW1wb3J0IHgsIHlcbiAgICAgICAgPj4+IGZyb20gc3ltcHkgaW1wb3J0IFNcbiAgICAgICAgPj4+IF9rZWVwX2NvZWZmKFMuSGFsZiwgeCArIDIpXG4gICAgICAgICh4ICsgMikvMlxuICAgICAgICA+Pj4gX2tlZXBfY29lZmYoUy5IYWxmLCB4ICsgMiwgY2xlYXI9RmFsc2UpXG4gICAgICAgIHgvMiArIDFcbiAgICAgICAgPj4+IF9rZWVwX2NvZWZmKFMuSGFsZiwgKHggKyAyKSp5LCBjbGVhcj1GYWxzZSlcbiAgICAgICAgeSooeCArIDIpLzJcbiAgICAgICAgPj4+IF9rZWVwX2NvZWZmKFMoLTEpLCB4ICsgeSlcbiAgICAgICAgLXggLSB5XG4gICAgICAgID4+PiBfa2VlcF9jb2VmZihTKC0xKSwgeCArIHksIHNpZ249VHJ1ZSlcbiAgICAgICAgLSh4ICsgeSlcbiAgICAgICAgKi9cbiAgICAgICAgaWYgKCEoY29lZmYuaXNfTnVtYmVyKCkpKSB7XG4gICAgICAgICAgICBpZiAoZmFjdG9ycy5pc19OdW1iZXIoKSkge1xuICAgICAgICAgICAgICAgIFtmYWN0b3JzLCBjb2VmZl0gPSBbY29lZmYsIGZhY3RvcnNdO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gY29lZmYuX19tdWxfXyhmYWN0b3JzKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBpZiAoZmFjdG9ycyA9PT0gUy5PbmUpIHtcbiAgICAgICAgICAgIHJldHVybiBjb2VmZjtcbiAgICAgICAgfVxuICAgICAgICBpZiAoY29lZmYgPT09IFMuT25lKSB7XG4gICAgICAgICAgICByZXR1cm4gZmFjdG9ycztcbiAgICAgICAgfSBlbHNlIGlmIChjb2VmZiA9PT0gUy5OZWdhdGl2ZU9uZSAmJiAhc2lnbikge1xuICAgICAgICAgICAgcmV0dXJuIGZhY3RvcnMuX19tdWxfXyhTLk5lZ2F0aXZlT25lKTtcbiAgICAgICAgfSBlbHNlIGlmIChmYWN0b3JzLmNvbnN0cnVjdG9yLmlzQWRkKSB7XG4gICAgICAgICAgICBpZiAoIWNsZWFyICYmIGNvZWZmLmNvbnN0cnVjdG9yLmlzX1JhdGlvbmFsICYmIGNvZWZmLnEgIT09IDEpIHtcbiAgICAgICAgICAgICAgICBsZXQgYXJncyA9IFtdO1xuICAgICAgICAgICAgICAgIGZvciAoY29uc3QgaSBvZiBmYWN0b3JzLl9hcmdzKSB7XG4gICAgICAgICAgICAgICAgICAgIGFyZ3MucHVzaChpLmFzX2NvZWZmX011bCgpKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgY29uc3QgdGVtcCA9IFtdO1xuICAgICAgICAgICAgICAgIGZvciAoY29uc3QgW2MsIG1dIG9mIGFyZ3MpIHtcbiAgICAgICAgICAgICAgICAgICAgdGVtcC5wdXNoKFt0aGlzLl9rZWVwX2NvZWZmKGMsIGNvZWZmKSwgbV0pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBhcmdzID0gdGVtcDtcbiAgICAgICAgICAgICAgICBmb3IgKGNvbnN0IFtjXSBvZiBhcmdzKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChjLmNvbnN0cnVjdG9yLmlzX0ludGVnZXIpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IHRlbXBhcmcgPSBbXTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGZvciAoY29uc3QgaSBvZiBhcmdzKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGlbMF0gPT09IDEpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGVtcGFyZy5wdXNoKGkuc2xpY2UoMCwgMSkpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuX2Zyb21fYXJncyhBZGQsIHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAuLi50aGlzLl9mcm9tX2FyZ3MoTXVsLCB1bmRlZmluZWQsIC4uLnRlbXBhcmcpKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIG5ldyBNdWwoZmFsc2UsIHRydWUsIGNvZWZmLCBmYWN0b3JzKTtcbiAgICAgICAgfSBlbHNlIGlmIChmYWN0b3JzLmNvbnN0cnVjdG9yLmlzTXVsKSB7XG4gICAgICAgICAgICBjb25zdCBtYXJnczogYW55W10gPSBmYWN0b3JzLl9hcmdzO1xuICAgICAgICAgICAgaWYgKG1hcmdzWzBdLmNvbnN0cnVjdG9yLmlzX051bWJlcikge1xuICAgICAgICAgICAgICAgIG1hcmdzWzBdID0gbWFyZ3NbMF0uX19tdWxfXyhjb2VmZik7XG4gICAgICAgICAgICAgICAgaWYgKG1hcmdzWzBdID09PSAxKSB7XG4gICAgICAgICAgICAgICAgICAgIG1hcmdzLnNwbGljZSgyLCAxKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIG1hcmdzLnNwbGljZSgwLCAwLCBjb2VmZik7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fZnJvbV9hcmdzKE11bCwgdW5kZWZpbmVkLCAuLi5tYXJncyk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBsZXQgbSA9IGNvZWZmLl9fbXVsX18oZmFjdG9ycyk7XG4gICAgICAgICAgICBpZiAobS5jb25zdHJ1Y3Rvci5pc19OdW1iZXIgJiYgIShmYWN0b3JzLmNvbnN0cnVjdG9yLmlzX051bWJlcikpIHtcbiAgICAgICAgICAgICAgICBtID0gdGhpcy5fZnJvbV9hcmdzKE11bCwgdW5kZWZpbmVkLCBjb2VmZiwgZmFjdG9ycyk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gbTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHN0YXRpYyBfbmV3KGV2YWx1YXRlOiBib29sZWFuLCBzaW1wbGlmeTogYm9vbGVhbiwgLi4uYXJnczogYW55KSB7XG4gICAgICAgIHJldHVybiBuZXcgTXVsKGV2YWx1YXRlLCBzaW1wbGlmeSwgLi4uYXJncyk7XG4gICAgfVxuXG5cbiAgICBfZXZhbF9pc19jb21tdXRhdGl2ZSgpIHtcbiAgICAgICAgY29uc3QgYWxsYXJncyA9IFtdO1xuICAgICAgICBmb3IgKGNvbnN0IGEgb2YgdGhpcy5fYXJncykge1xuICAgICAgICAgICAgYWxsYXJncy5wdXNoKGEuY29uc3RydWN0b3IuaXNfY29tbXV0YXRpdmUpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBfZnV6enlfZ3JvdXB2MihhbGxhcmdzKTtcbiAgICB9XG59XG5cbk1hbmFnZWRQcm9wZXJ0aWVzLnJlZ2lzdGVyKE11bCk7XG5HbG9iYWwucmVnaXN0ZXIoXCJNdWxcIiwgTXVsLl9uZXcpO1xuIiwgIi8qXG5DaGFuZ2VzIG1hZGUgKFdCIGFuZCBHTSk6XG4tIEFkZGVkIGNvbnN0cnVjdG9yIHRvIGV4cGxpY2l0bHkgY2FsbCBBc3NvY09wIHN1cGVyY2xhc3Ncbi0gQWRkZWQgXCJzaW1wbGlmeVwiIGFyZ3VtZW50LCB3aGljaCBwcmV2ZW50cyBpbmZpbml0ZSByZWN1cnNpb24gaW4gQXNzb2NPcFxuLSBOb3RlOiBPcmRlciBvYmplY3RzIGluIEFkZCBhcmUgbm90IHlldCBpbXBsZW1lbnRlZFxuKi9cblxuaW1wb3J0IHtFeHByfSBmcm9tIFwiLi9leHByLmpzXCI7XG5pbXBvcnQge0Fzc29jT3B9IGZyb20gXCIuL29wZXJhdGlvbnMuanNcIjtcbmltcG9ydCB7YmFzZSwgbWl4LCBIYXNoRGljdH0gZnJvbSBcIi4vdXRpbGl0eS5qc1wiO1xuaW1wb3J0IHtTfSBmcm9tIFwiLi9zaW5nbGV0b24uanNcIjtcbmltcG9ydCB7QmFzaWN9IGZyb20gXCIuL2Jhc2ljLmpzXCI7XG5pbXBvcnQge01hbmFnZWRQcm9wZXJ0aWVzfSBmcm9tIFwiLi9hc3N1bXB0aW9ucy5qc1wiO1xuaW1wb3J0IHtNdWx9IGZyb20gXCIuL211bC5qc1wiO1xuaW1wb3J0IHtHbG9iYWx9IGZyb20gXCIuL2dsb2JhbC5qc1wiO1xuaW1wb3J0IHtfZnV6enlfZ3JvdXB2Mn0gZnJvbSBcIi4vbG9naWMuanNcIjtcblxuZnVuY3Rpb24gX2FkZHNvcnQoYXJnczogYW55W10pIHtcbiAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbmV3LWNhcFxuICAgIGFyZ3Muc29ydCgoYSwgYikgPT4gQmFzaWMuY21wKGEsIGIpKTtcbn1cblxuZXhwb3J0IGNsYXNzIEFkZCBleHRlbmRzIG1peChiYXNlKS53aXRoKEV4cHIsIEFzc29jT3ApIHtcbiAgICAvKlxuICAgIFwiXCJcIlxuICAgIEV4cHJlc3Npb24gcmVwcmVzZW50aW5nIGFkZGl0aW9uIG9wZXJhdGlvbiBmb3IgYWxnZWJyYWljIGdyb3VwLlxuICAgIC4uIGRlcHJlY2F0ZWQ6OiAxLjdcbiAgICAgICBVc2luZyBhcmd1bWVudHMgdGhhdCBhcmVuJ3Qgc3ViY2xhc3NlcyBvZiA6Y2xhc3M6YH4uRXhwcmAgaW4gY29yZVxuICAgICAgIG9wZXJhdG9ycyAoOmNsYXNzOmB+Lk11bGAsIDpjbGFzczpgfi5BZGRgLCBhbmQgOmNsYXNzOmB+LlBvd2ApIGlzXG4gICAgICAgZGVwcmVjYXRlZC4gU2VlIDpyZWY6YG5vbi1leHByLWFyZ3MtZGVwcmVjYXRlZGAgZm9yIGRldGFpbHMuXG4gICAgRXZlcnkgYXJndW1lbnQgb2YgYGBBZGQoKWBgIG11c3QgYmUgYGBFeHByYGAuIEluZml4IG9wZXJhdG9yIGBgK2BgXG4gICAgb24gbW9zdCBzY2FsYXIgb2JqZWN0cyBpbiBTeW1QeSBjYWxscyB0aGlzIGNsYXNzLlxuICAgIEFub3RoZXIgdXNlIG9mIGBgQWRkKClgYCBpcyB0byByZXByZXNlbnQgdGhlIHN0cnVjdHVyZSBvZiBhYnN0cmFjdFxuICAgIGFkZGl0aW9uIHNvIHRoYXQgaXRzIGFyZ3VtZW50cyBjYW4gYmUgc3Vic3RpdHV0ZWQgdG8gcmV0dXJuIGRpZmZlcmVudFxuICAgIGNsYXNzLiBSZWZlciB0byBleGFtcGxlcyBzZWN0aW9uIGZvciB0aGlzLlxuICAgIGBgQWRkKClgYCBldmFsdWF0ZXMgdGhlIGFyZ3VtZW50IHVubGVzcyBgYGV2YWx1YXRlPUZhbHNlYGAgaXMgcGFzc2VkLlxuICAgIFRoZSBldmFsdWF0aW9uIGxvZ2ljIGluY2x1ZGVzOlxuICAgIDEuIEZsYXR0ZW5pbmdcbiAgICAgICAgYGBBZGQoeCwgQWRkKHksIHopKWBgIC0+IGBgQWRkKHgsIHksIHopYGBcbiAgICAyLiBJZGVudGl0eSByZW1vdmluZ1xuICAgICAgICBgYEFkZCh4LCAwLCB5KWBgIC0+IGBgQWRkKHgsIHkpYGBcbiAgICAzLiBDb2VmZmljaWVudCBjb2xsZWN0aW5nIGJ5IGBgLmFzX2NvZWZmX011bCgpYGBcbiAgICAgICAgYGBBZGQoeCwgMip4KWBgIC0+IGBgTXVsKDMsIHgpYGBcbiAgICA0LiBUZXJtIHNvcnRpbmdcbiAgICAgICAgYGBBZGQoeSwgeCwgMilgYCAtPiBgYEFkZCgyLCB4LCB5KWBgXG4gICAgSWYgbm8gYXJndW1lbnQgaXMgcGFzc2VkLCBpZGVudGl0eSBlbGVtZW50IDAgaXMgcmV0dXJuZWQuIElmIHNpbmdsZVxuICAgIGVsZW1lbnQgaXMgcGFzc2VkLCB0aGF0IGVsZW1lbnQgaXMgcmV0dXJuZWQuXG4gICAgTm90ZSB0aGF0IGBgQWRkKCphcmdzKWBgIGlzIG1vcmUgZWZmaWNpZW50IHRoYW4gYGBzdW0oYXJncylgYCBiZWNhdXNlXG4gICAgaXQgZmxhdHRlbnMgdGhlIGFyZ3VtZW50cy4gYGBzdW0oYSwgYiwgYywgLi4uKWBgIHJlY3Vyc2l2ZWx5IGFkZHMgdGhlXG4gICAgYXJndW1lbnRzIGFzIGBgYSArIChiICsgKGMgKyAuLi4pKWBgLCB3aGljaCBoYXMgcXVhZHJhdGljIGNvbXBsZXhpdHkuXG4gICAgT24gdGhlIG90aGVyIGhhbmQsIGBgQWRkKGEsIGIsIGMsIGQpYGAgZG9lcyBub3QgYXNzdW1lIG5lc3RlZFxuICAgIHN0cnVjdHVyZSwgbWFraW5nIHRoZSBjb21wbGV4aXR5IGxpbmVhci5cbiAgICBTaW5jZSBhZGRpdGlvbiBpcyBncm91cCBvcGVyYXRpb24sIGV2ZXJ5IGFyZ3VtZW50IHNob3VsZCBoYXZlIHRoZVxuICAgIHNhbWUgOm9iajpgc3ltcHkuY29yZS5raW5kLktpbmQoKWAuXG4gICAgRXhhbXBsZXNcbiAgICA9PT09PT09PVxuICAgID4+PiBmcm9tIHN5bXB5IGltcG9ydCBBZGQsIElcbiAgICA+Pj4gZnJvbSBzeW1weS5hYmMgaW1wb3J0IHgsIHlcbiAgICA+Pj4gQWRkKHgsIDEpXG4gICAgeCArIDFcbiAgICA+Pj4gQWRkKHgsIHgpXG4gICAgMip4XG4gICAgPj4+IDIqeCoqMiArIDMqeCArIEkqeSArIDIqeSArIDIqeC81ICsgMS4wKnkgKyAxXG4gICAgMip4KioyICsgMTcqeC81ICsgMy4wKnkgKyBJKnkgKyAxXG4gICAgSWYgYGBldmFsdWF0ZT1GYWxzZWBgIGlzIHBhc3NlZCwgcmVzdWx0IGlzIG5vdCBldmFsdWF0ZWQuXG4gICAgPj4+IEFkZCgxLCAyLCBldmFsdWF0ZT1GYWxzZSlcbiAgICAxICsgMlxuICAgID4+PiBBZGQoeCwgeCwgZXZhbHVhdGU9RmFsc2UpXG4gICAgeCArIHhcbiAgICBgYEFkZCgpYGAgYWxzbyByZXByZXNlbnRzIHRoZSBnZW5lcmFsIHN0cnVjdHVyZSBvZiBhZGRpdGlvbiBvcGVyYXRpb24uXG4gICAgPj4+IGZyb20gc3ltcHkgaW1wb3J0IE1hdHJpeFN5bWJvbFxuICAgID4+PiBBLEIgPSBNYXRyaXhTeW1ib2woJ0EnLCAyLDIpLCBNYXRyaXhTeW1ib2woJ0InLCAyLDIpXG4gICAgPj4+IGV4cHIgPSBBZGQoeCx5KS5zdWJzKHt4OkEsIHk6Qn0pXG4gICAgPj4+IGV4cHJcbiAgICBBICsgQlxuICAgID4+PiB0eXBlKGV4cHIpXG4gICAgPGNsYXNzICdzeW1weS5tYXRyaWNlcy5leHByZXNzaW9ucy5tYXRhZGQuTWF0QWRkJz5cbiAgICBOb3RlIHRoYXQgdGhlIHByaW50ZXJzIGRvIG5vdCBkaXNwbGF5IGluIGFyZ3Mgb3JkZXIuXG4gICAgPj4+IEFkZCh4LCAxKVxuICAgIHggKyAxXG4gICAgPj4+IEFkZCh4LCAxKS5hcmdzXG4gICAgKDEsIHgpXG4gICAgU2VlIEFsc29cbiAgICA9PT09PT09PVxuICAgIE1hdEFkZFxuICAgIFwiXCJcIlxuICAgICovXG5cbiAgICBfX3Nsb3RzX186IGFueVtdID0gW107XG4gICAgYXJnczogYW55W107XG4gICAgc3RhdGljIGlzX0FkZDogYW55ID0gdHJ1ZTsgXG4gICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5ldy1jYXBcbiAgICBzdGF0aWMgX2FyZ3NfdHlwZSA9IEV4cHIoT2JqZWN0KTtcbiAgICBzdGF0aWMgaWRlbnRpdHkgPSBTLlplcm87IC8vICEhISB1bnN1cmUgYWJ0IHRoaXNcblxuICAgIGNvbnN0cnVjdG9yKGV2YWx1YXRlOiBib29sZWFuLCBzaW1wbGlmeTogYm9vbGVhbiwgLi4uYXJnczogYW55KSB7XG4gICAgICAgIHN1cGVyKEFkZCwgZXZhbHVhdGUsIHNpbXBsaWZ5LCAuLi5hcmdzKTtcbiAgICB9XG5cbiAgICBmbGF0dGVuKHNlcTogYW55W10pIHtcbiAgICAgICAgLypcbiAgICAgICAgVGFrZXMgdGhlIHNlcXVlbmNlIFwic2VxXCIgb2YgbmVzdGVkIEFkZHMgYW5kIHJldHVybnMgYSBmbGF0dGVuIGxpc3QuXG4gICAgICAgIFJldHVybnM6IChjb21tdXRhdGl2ZV9wYXJ0LCBub25jb21tdXRhdGl2ZV9wYXJ0LCBvcmRlcl9zeW1ib2xzKVxuICAgICAgICBBcHBsaWVzIGFzc29jaWF0aXZpdHksIGFsbCB0ZXJtcyBhcmUgY29tbXV0YWJsZSB3aXRoIHJlc3BlY3QgdG9cbiAgICAgICAgYWRkaXRpb24uXG4gICAgICAgIE5COiB0aGUgcmVtb3ZhbCBvZiAwIGlzIGFscmVhZHkgaGFuZGxlZCBieSBBc3NvY09wLl9fbmV3X19cbiAgICAgICAgU2VlIGFsc29cbiAgICAgICAgPT09PT09PT1cbiAgICAgICAgc3ltcHkuY29yZS5tdWwuTXVsLmZsYXR0ZW5cbiAgICAgICAgKi9cbiAgICAgICAgbGV0IHJ2ID0gdW5kZWZpbmVkO1xuICAgICAgICBpZiAoc2VxLmxlbmd0aCA9PT0gMikge1xuICAgICAgICAgICAgbGV0IFthLCBiXSA9IHNlcTtcbiAgICAgICAgICAgIGlmIChiLmlzX1JhdGlvbmFsKCkpIHtcbiAgICAgICAgICAgICAgICBbYSwgYl0gPSBbYiwgYV07XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoYS5pc19SYXRpb25hbCgpKSB7XG4gICAgICAgICAgICAgICAgaWYgKGIuaXNfTXVsKCkpIHtcbiAgICAgICAgICAgICAgICAgICAgcnYgPSBbW2EsIGJdLCBbXSwgdW5kZWZpbmVkXTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAocnYpIHtcbiAgICAgICAgICAgICAgICBsZXQgYWxsYyA9IHRydWU7XG4gICAgICAgICAgICAgICAgZm9yIChjb25zdCBzIG9mIHJ2WzBdKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChzLmlzX2NvbW11dGF0aXZlKCkgPT09IGZhbHNlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBhbGxjID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgaWYgKGFsbGMpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHJ2O1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBbW10sIHJ2WzBdLCB1bmRlZmluZWRdO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBjb25zdCB0ZXJtczogSGFzaERpY3QgPSBuZXcgSGFzaERpY3QoKTtcbiAgICAgICAgbGV0IGNvZWZmID0gUy5aZXJvO1xuICAgICAgICBjb25zdCBleHRyYTogYW55W10gPSBbXTtcbiAgICAgICAgZm9yIChjb25zdCBvIG9mIHNlcSkge1xuICAgICAgICAgICAgbGV0IGM7XG4gICAgICAgICAgICBsZXQgcztcbiAgICAgICAgICAgIGlmIChvLmlzX051bWJlcigpKSB7XG4gICAgICAgICAgICAgICAgaWYgKChvID09PSBTLk5hTiB8fCAoY29lZmYgPT09IFMuQ29tcGxleEluZmluaXR5ICYmIG8uaXNfZmluaXRlKCkgPT09IGZhbHNlKSkpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFtbUy5OYU5dLCBbXSwgdW5kZWZpbmVkXTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgaWYgKGNvZWZmLmlzX051bWJlcigpKSB7XG4gICAgICAgICAgICAgICAgICAgIGNvZWZmID0gY29lZmYuX19hZGRfXyhvKTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGNvZWZmID09PSBTLk5hTiB8fCAhZXh0cmEpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBbW1MuTmFOXSwgW10sIHVuZGVmaW5lZF07XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKG8gPT09IFMuQ29tcGxleEluZmluaXR5KSB7XG4gICAgICAgICAgICAgICAgaWYgKGNvZWZmLmlzX2Zpbml0ZSgpID09PSBmYWxzZSkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gW1tTLk5hTl0sIFtdLCB1bmRlZmluZWRdO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBjb2VmZiA9IFMuQ29tcGxleEluZmluaXR5O1xuICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgICAgfSBlbHNlIGlmIChvLmlzX0FkZCgpKSB7XG4gICAgICAgICAgICAgICAgc2VxLnB1c2goLi4uby5fYXJncyk7XG4gICAgICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKG8uaXNfTXVsKCkpIHtcbiAgICAgICAgICAgICAgICBbYywgc10gPSBvLmFzX2NvZWZmX011bCgpO1xuICAgICAgICAgICAgfSBlbHNlIGlmIChvLmlzX1Bvdykge1xuICAgICAgICAgICAgICAgIGNvbnN0IHBhaXIgPSBvLmFzX2Jhc2VfZXhwKCk7XG4gICAgICAgICAgICAgICAgY29uc3QgYiA9IHBhaXJbMF07XG4gICAgICAgICAgICAgICAgY29uc3QgZSA9IHBhaXJbMV07XG4gICAgICAgICAgICAgICAgaWYgKGIuaXNfTnVtYmVyKCkgJiYgKGUuaXNfSW50ZWdlcigpIHx8IChlLmlzX1JhdGlvbmFsKCkgJiYgZS5pc19uZWdhdGl2ZSgpKSkpIHtcbiAgICAgICAgICAgICAgICAgICAgc2VxLnB1c2goYi5fZXZhbF9wb3dlcihlKSk7XG4gICAgICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBbYywgc10gPSBbUy5PbmUsIG9dO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBjID0gUy5PbmU7XG4gICAgICAgICAgICAgICAgcyA9IG87XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAodGVybXMuaGFzKHMpKSB7XG4gICAgICAgICAgICAgICAgdGVybXMuYWRkKHMsIHRlcm1zLmdldChzKS5fX2FkZF9fKGMpKTtcbiAgICAgICAgICAgICAgICBpZiAodGVybXMuZ2V0KHMpID09PSBTLk5hTikge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gW1tTLk5hTl0sIFtdLCB1bmRlZmluZWRdO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgdGVybXMuYWRkKHMsIGMpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGxldCBuZXdzZXE6IGFueVtdID0gW107XG4gICAgICAgIGxldCBub25jb21tdXRhdGl2ZTogYm9vbGVhbiA9IGZhbHNlO1xuICAgICAgICBmb3IgKGNvbnN0IGl0ZW0gb2YgdGVybXMuZW50cmllcygpKSB7XG4gICAgICAgICAgICBjb25zdCBzOiBhbnkgPSBpdGVtWzBdO1xuICAgICAgICAgICAgY29uc3QgYzogYW55ID0gaXRlbVsxXTtcbiAgICAgICAgICAgIGlmIChjLmlzX3plcm8oKSkge1xuICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgICAgfSBlbHNlIGlmIChjID09PSBTLk9uZSkge1xuICAgICAgICAgICAgICAgIG5ld3NlcS5wdXNoKHMpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBpZiAocy5pc19NdWwoKSkge1xuICAgICAgICAgICAgICAgICAgICBjb25zdCBjcyA9IHMuX25ld19yYXdhcmdzKHRydWUsIC4uLltjXS5jb25jYXQocy5fYXJncykpO1xuICAgICAgICAgICAgICAgICAgICBuZXdzZXEucHVzaChjcyk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmIChzLmlzX0FkZCgpKSB7XG4gICAgICAgICAgICAgICAgICAgIG5ld3NlcS5wdXNoKG5ldyBNdWwoZmFsc2UsIHRydWUsIGMsIHMpKTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBuZXdzZXEucHVzaChuZXcgTXVsKHRydWUsIHRydWUsIGMsIHMpKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBub25jb21tdXRhdGl2ZSA9IG5vbmNvbW11dGF0aXZlIHx8ICEocy5pc19jb21tdXRhdGl2ZSgpKTtcbiAgICAgICAgfVxuICAgICAgICBjb25zdCB0ZW1wID0gW107XG4gICAgICAgIGlmIChjb2VmZiA9PT0gUy5JbmZpbml0eSkge1xuICAgICAgICAgICAgZm9yIChjb25zdCBmIG9mIG5ld3NlcSkge1xuICAgICAgICAgICAgICAgIGlmICghKGYuaXNfZXh0ZW5kZWRfbm9ubmVnYXRpdmUoKSkpIHtcbiAgICAgICAgICAgICAgICAgICAgdGVtcC5wdXNoKGYpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIG5ld3NlcSA9IHRlbXA7XG4gICAgICAgIH0gZWxzZSBpZiAoY29lZmYgPT09IFMuTmVnYXRpdmVJbmZpbml0eSkge1xuICAgICAgICAgICAgZm9yIChjb25zdCBmIG9mIG5ld3NlcSkge1xuICAgICAgICAgICAgICAgIGlmICghKGYuaXNfZXh0ZW5kZWRfbm9ucG9zaXRpdmUoKSkpIHtcbiAgICAgICAgICAgICAgICAgICAgdGVtcC5wdXNoKGYpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIG5ld3NlcSA9IHRlbXA7XG4gICAgICAgIH1cbiAgICAgICAgY29uc3QgdGVtcDIgPSBbXTtcbiAgICAgICAgaWYgKGNvZWZmID09PSBTLkNvbXBsZXhJbmZpbml0eSkge1xuICAgICAgICAgICAgZm9yIChjb25zdCBjIG9mIG5ld3NlcSkge1xuICAgICAgICAgICAgICAgIGlmICghKGMuaXNfZmluaXRlKCkgfHwgYy5pc19leHRlbmRlZF9yZWFsKCkgIT09IFwidW5kZWZpbmVkXCIpKSB7XG4gICAgICAgICAgICAgICAgICAgIHRlbXAyLnB1c2goYyk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgbmV3c2VxID0gdGVtcDI7XG4gICAgICAgIH1cbiAgICAgICAgX2FkZHNvcnQobmV3c2VxKTtcbiAgICAgICAgaWYgKGNvZWZmICE9PSBTLlplcm8pIHtcbiAgICAgICAgICAgIG5ld3NlcS5zcGxpY2UoMCwgMCwgY29lZmYpO1xuICAgICAgICB9XG4gICAgICAgIGlmIChub25jb21tdXRhdGl2ZSkge1xuICAgICAgICAgICAgcmV0dXJuIFtbXSwgbmV3c2VxLCB1bmRlZmluZWRdO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuIFtuZXdzZXEsIFtdLCB1bmRlZmluZWRdO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgX2V2YWxfaXNfY29tbXV0YXRpdmUoKSB7XG4gICAgICAgIGNvbnN0IGZ1enp5YXJnID0gW107XG4gICAgICAgIGZvciAoY29uc3QgYSBvZiB0aGlzLl9hcmdzKSB7XG4gICAgICAgICAgICBmdXp6eWFyZy5wdXNoKGEuaXNfY29tbXV0YXRpdmUoKSk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIF9mdXp6eV9ncm91cHYyKGZ1enp5YXJnKTtcbiAgICB9XG5cbiAgICBhc19jb2VmZl9BZGQoKSB7XG4gICAgICAgIGNvbnN0IFtjb2VmZiwgYXJnc10gPSBbdGhpcy5hcmdzWzBdLCB0aGlzLmFyZ3Muc2xpY2UoMSldO1xuICAgICAgICBpZiAoY29lZmYuaXNfTnVtYmVyKCkgJiYgY29lZmYuaXNfUmF0aW9uYWwoKSkge1xuICAgICAgICAgICAgcmV0dXJuIFtjb2VmZiwgdGhpcy5fbmV3X3Jhd2FyZ3ModHJ1ZSwgLi4uYXJncyldO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBbUy5aZXJvLCB0aGlzXTtcbiAgICB9XG5cbiAgICBzdGF0aWMgX25ldyhldmFsdWF0ZTogYm9vbGVhbiwgc2ltcGxpZnk6IGJvb2xlYW4sIC4uLmFyZ3M6IGFueSkge1xuICAgICAgICByZXR1cm4gbmV3IEFkZChldmFsdWF0ZSwgc2ltcGxpZnksIC4uLmFyZ3MpO1xuICAgIH1cbn1cblxuTWFuYWdlZFByb3BlcnRpZXMucmVnaXN0ZXIoQWRkKTtcbkdsb2JhbC5yZWdpc3RlcihcIkFkZFwiLCBBZGQuX25ldyk7XG4iLCAiLyohXHJcbiAqICBkZWNpbWFsLmpzIHYxMC40LjNcclxuICogIEFuIGFyYml0cmFyeS1wcmVjaXNpb24gRGVjaW1hbCB0eXBlIGZvciBKYXZhU2NyaXB0LlxyXG4gKiAgaHR0cHM6Ly9naXRodWIuY29tL01pa2VNY2wvZGVjaW1hbC5qc1xyXG4gKiAgQ29weXJpZ2h0IChjKSAyMDIyIE1pY2hhZWwgTWNsYXVnaGxpbiA8TThjaDg4bEBnbWFpbC5jb20+XHJcbiAqICBNSVQgTGljZW5jZVxyXG4gKi9cclxuXHJcblxyXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSAgRURJVEFCTEUgREVGQVVMVFMgIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSAvL1xyXG5cclxuXHJcbiAgLy8gVGhlIG1heGltdW0gZXhwb25lbnQgbWFnbml0dWRlLlxyXG4gIC8vIFRoZSBsaW1pdCBvbiB0aGUgdmFsdWUgb2YgYHRvRXhwTmVnYCwgYHRvRXhwUG9zYCwgYG1pbkVgIGFuZCBgbWF4RWAuXHJcbnZhciBFWFBfTElNSVQgPSA5ZTE1LCAgICAgICAgICAgICAgICAgICAgICAvLyAwIHRvIDllMTVcclxuXHJcbiAgLy8gVGhlIGxpbWl0IG9uIHRoZSB2YWx1ZSBvZiBgcHJlY2lzaW9uYCwgYW5kIG9uIHRoZSB2YWx1ZSBvZiB0aGUgZmlyc3QgYXJndW1lbnQgdG9cclxuICAvLyBgdG9EZWNpbWFsUGxhY2VzYCwgYHRvRXhwb25lbnRpYWxgLCBgdG9GaXhlZGAsIGB0b1ByZWNpc2lvbmAgYW5kIGB0b1NpZ25pZmljYW50RGlnaXRzYC5cclxuICBNQVhfRElHSVRTID0gMWU5LCAgICAgICAgICAgICAgICAgICAgICAgIC8vIDAgdG8gMWU5XHJcblxyXG4gIC8vIEJhc2UgY29udmVyc2lvbiBhbHBoYWJldC5cclxuICBOVU1FUkFMUyA9ICcwMTIzNDU2Nzg5YWJjZGVmJyxcclxuXHJcbiAgLy8gVGhlIG5hdHVyYWwgbG9nYXJpdGhtIG9mIDEwICgxMDI1IGRpZ2l0cykuXHJcbiAgTE4xMCA9ICcyLjMwMjU4NTA5Mjk5NDA0NTY4NDAxNzk5MTQ1NDY4NDM2NDIwNzYwMTEwMTQ4ODYyODc3Mjk3NjAzMzMyNzkwMDk2NzU3MjYwOTY3NzM1MjQ4MDIzNTk5NzIwNTA4OTU5ODI5ODM0MTk2Nzc4NDA0MjI4NjI0ODYzMzQwOTUyNTQ2NTA4MjgwNjc1NjY2NjI4NzM2OTA5ODc4MTY4OTQ4MjkwNzIwODMyNTU1NDY4MDg0Mzc5OTg5NDgyNjIzMzE5ODUyODM5MzUwNTMwODk2NTM3NzczMjYyODg0NjE2MzM2NjIyMjI4NzY5ODIxOTg4Njc0NjU0MzY2NzQ3NDQwNDI0MzI3NDM2NTE1NTA0ODkzNDMxNDkzOTM5MTQ3OTYxOTQwNDQwMDIyMjEwNTEwMTcxNDE3NDgwMDM2ODgwODQwMTI2NDcwODA2ODU1Njc3NDMyMTYyMjgzNTUyMjAxMTQ4MDQ2NjM3MTU2NTkxMjEzNzM0NTA3NDc4NTY5NDc2ODM0NjM2MTY3OTIxMDE4MDY0NDUwNzA2NDgwMDAyNzc1MDI2ODQ5MTY3NDY1NTA1ODY4NTY5MzU2NzM0MjA2NzA1ODExMzY0MjkyMjQ1NTQ0MDU3NTg5MjU3MjQyMDgyNDEzMTQ2OTU2ODkwMTY3NTg5NDAyNTY3NzYzMTEzNTY5MTkyOTIwMzMzNzY1ODcxNDE2NjAyMzAxMDU3MDMwODk2MzQ1NzIwNzU0NDAzNzA4NDc0Njk5NDAxNjgyNjkyODI4MDg0ODExODQyODkzMTQ4NDg1MjQ5NDg2NDQ4NzE5Mjc4MDk2NzYyNzEyNzU3NzUzOTcwMjc2Njg2MDU5NTI0OTY3MTY2NzQxODM0ODU3MDQ0MjI1MDcxOTc5NjUwMDQ3MTQ5NTEwNTA0OTIyMTQ3NzY1Njc2MzY5Mzg2NjI5NzY5Nzk1MjIxMTA3MTgyNjQ1NDk3MzQ3NzI2NjI0MjU3MDk0MjkzMjI1ODI3OTg1MDI1ODU1MDk3ODUyNjUzODMyMDc2MDY3MjYzMTcxNjQzMDk1MDU5OTUwODc4MDc1MjM3MTAzMzMxMDExOTc4NTc1NDczMzE1NDE0MjE4MDg0Mjc1NDM4NjM1OTE3NzgxMTcwNTQzMDk4Mjc0ODIzODUwNDU2NDgwMTkwOTU2MTAyOTkyOTE4MjQzMTgyMzc1MjUzNTc3MDk3NTA1Mzk1NjUxODc2OTc1MTAzNzQ5NzA4ODg2OTIxODAyMDUxODkzMzk1MDcyMzg1MzkyMDUxNDQ2MzQxOTcyNjUyODcyODY5NjUxMTA4NjI1NzE0OTIxOTg4NDk5Nzg3NDg4NzM3NzEzNDU2ODYyMDkxNjcwNTgnLFxyXG5cclxuICAvLyBQaSAoMTAyNSBkaWdpdHMpLlxyXG4gIFBJID0gJzMuMTQxNTkyNjUzNTg5NzkzMjM4NDYyNjQzMzgzMjc5NTAyODg0MTk3MTY5Mzk5Mzc1MTA1ODIwOTc0OTQ0NTkyMzA3ODE2NDA2Mjg2MjA4OTk4NjI4MDM0ODI1MzQyMTE3MDY3OTgyMTQ4MDg2NTEzMjgyMzA2NjQ3MDkzODQ0NjA5NTUwNTgyMjMxNzI1MzU5NDA4MTI4NDgxMTE3NDUwMjg0MTAyNzAxOTM4NTIxMTA1NTU5NjQ0NjIyOTQ4OTU0OTMwMzgxOTY0NDI4ODEwOTc1NjY1OTMzNDQ2MTI4NDc1NjQ4MjMzNzg2NzgzMTY1MjcxMjAxOTA5MTQ1NjQ4NTY2OTIzNDYwMzQ4NjEwNDU0MzI2NjQ4MjEzMzkzNjA3MjYwMjQ5MTQxMjczNzI0NTg3MDA2NjA2MzE1NTg4MTc0ODgxNTIwOTIwOTYyODI5MjU0MDkxNzE1MzY0MzY3ODkyNTkwMzYwMDExMzMwNTMwNTQ4ODIwNDY2NTIxMzg0MTQ2OTUxOTQxNTExNjA5NDMzMDU3MjcwMzY1NzU5NTkxOTUzMDkyMTg2MTE3MzgxOTMyNjExNzkzMTA1MTE4NTQ4MDc0NDYyMzc5OTYyNzQ5NTY3MzUxODg1NzUyNzI0ODkxMjI3OTM4MTgzMDExOTQ5MTI5ODMzNjczMzYyNDQwNjU2NjQzMDg2MDIxMzk0OTQ2Mzk1MjI0NzM3MTkwNzAyMTc5ODYwOTQzNzAyNzcwNTM5MjE3MTc2MjkzMTc2NzUyMzg0Njc0ODE4NDY3NjY5NDA1MTMyMDAwNTY4MTI3MTQ1MjYzNTYwODI3Nzg1NzcxMzQyNzU3Nzg5NjA5MTczNjM3MTc4NzIxNDY4NDQwOTAxMjI0OTUzNDMwMTQ2NTQ5NTg1MzcxMDUwNzkyMjc5Njg5MjU4OTIzNTQyMDE5OTU2MTEyMTI5MDIxOTYwODY0MDM0NDE4MTU5ODEzNjI5Nzc0NzcxMzA5OTYwNTE4NzA3MjExMzQ5OTk5OTk4MzcyOTc4MDQ5OTUxMDU5NzMxNzMyODE2MDk2MzE4NTk1MDI0NDU5NDU1MzQ2OTA4MzAyNjQyNTIyMzA4MjUzMzQ0Njg1MDM1MjYxOTMxMTg4MTcxMDEwMDAzMTM3ODM4NzUyODg2NTg3NTMzMjA4MzgxNDIwNjE3MTc3NjY5MTQ3MzAzNTk4MjUzNDkwNDI4NzU1NDY4NzMxMTU5NTYyODYzODgyMzUzNzg3NTkzNzUxOTU3NzgxODU3NzgwNTMyMTcxMjI2ODA2NjEzMDAxOTI3ODc2NjExMTk1OTA5MjE2NDIwMTk4OTM4MDk1MjU3MjAxMDY1NDg1ODYzMjc4OScsXHJcblxyXG5cclxuICAvLyBUaGUgaW5pdGlhbCBjb25maWd1cmF0aW9uIHByb3BlcnRpZXMgb2YgdGhlIERlY2ltYWwgY29uc3RydWN0b3IuXHJcbiAgREVGQVVMVFMgPSB7XHJcblxyXG4gICAgLy8gVGhlc2UgdmFsdWVzIG11c3QgYmUgaW50ZWdlcnMgd2l0aGluIHRoZSBzdGF0ZWQgcmFuZ2VzIChpbmNsdXNpdmUpLlxyXG4gICAgLy8gTW9zdCBvZiB0aGVzZSB2YWx1ZXMgY2FuIGJlIGNoYW5nZWQgYXQgcnVuLXRpbWUgdXNpbmcgdGhlIGBEZWNpbWFsLmNvbmZpZ2AgbWV0aG9kLlxyXG5cclxuICAgIC8vIFRoZSBtYXhpbXVtIG51bWJlciBvZiBzaWduaWZpY2FudCBkaWdpdHMgb2YgdGhlIHJlc3VsdCBvZiBhIGNhbGN1bGF0aW9uIG9yIGJhc2UgY29udmVyc2lvbi5cclxuICAgIC8vIEUuZy4gYERlY2ltYWwuY29uZmlnKHsgcHJlY2lzaW9uOiAyMCB9KTtgXHJcbiAgICBwcmVjaXNpb246IDIwLCAgICAgICAgICAgICAgICAgICAgICAgICAvLyAxIHRvIE1BWF9ESUdJVFNcclxuXHJcbiAgICAvLyBUaGUgcm91bmRpbmcgbW9kZSB1c2VkIHdoZW4gcm91bmRpbmcgdG8gYHByZWNpc2lvbmAuXHJcbiAgICAvL1xyXG4gICAgLy8gUk9VTkRfVVAgICAgICAgICAwIEF3YXkgZnJvbSB6ZXJvLlxyXG4gICAgLy8gUk9VTkRfRE9XTiAgICAgICAxIFRvd2FyZHMgemVyby5cclxuICAgIC8vIFJPVU5EX0NFSUwgICAgICAgMiBUb3dhcmRzICtJbmZpbml0eS5cclxuICAgIC8vIFJPVU5EX0ZMT09SICAgICAgMyBUb3dhcmRzIC1JbmZpbml0eS5cclxuICAgIC8vIFJPVU5EX0hBTEZfVVAgICAgNCBUb3dhcmRzIG5lYXJlc3QgbmVpZ2hib3VyLiBJZiBlcXVpZGlzdGFudCwgdXAuXHJcbiAgICAvLyBST1VORF9IQUxGX0RPV04gIDUgVG93YXJkcyBuZWFyZXN0IG5laWdoYm91ci4gSWYgZXF1aWRpc3RhbnQsIGRvd24uXHJcbiAgICAvLyBST1VORF9IQUxGX0VWRU4gIDYgVG93YXJkcyBuZWFyZXN0IG5laWdoYm91ci4gSWYgZXF1aWRpc3RhbnQsIHRvd2FyZHMgZXZlbiBuZWlnaGJvdXIuXHJcbiAgICAvLyBST1VORF9IQUxGX0NFSUwgIDcgVG93YXJkcyBuZWFyZXN0IG5laWdoYm91ci4gSWYgZXF1aWRpc3RhbnQsIHRvd2FyZHMgK0luZmluaXR5LlxyXG4gICAgLy8gUk9VTkRfSEFMRl9GTE9PUiA4IFRvd2FyZHMgbmVhcmVzdCBuZWlnaGJvdXIuIElmIGVxdWlkaXN0YW50LCB0b3dhcmRzIC1JbmZpbml0eS5cclxuICAgIC8vXHJcbiAgICAvLyBFLmcuXHJcbiAgICAvLyBgRGVjaW1hbC5yb3VuZGluZyA9IDQ7YFxyXG4gICAgLy8gYERlY2ltYWwucm91bmRpbmcgPSBEZWNpbWFsLlJPVU5EX0hBTEZfVVA7YFxyXG4gICAgcm91bmRpbmc6IDQsICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gMCB0byA4XHJcblxyXG4gICAgLy8gVGhlIG1vZHVsbyBtb2RlIHVzZWQgd2hlbiBjYWxjdWxhdGluZyB0aGUgbW9kdWx1czogYSBtb2Qgbi5cclxuICAgIC8vIFRoZSBxdW90aWVudCAocSA9IGEgLyBuKSBpcyBjYWxjdWxhdGVkIGFjY29yZGluZyB0byB0aGUgY29ycmVzcG9uZGluZyByb3VuZGluZyBtb2RlLlxyXG4gICAgLy8gVGhlIHJlbWFpbmRlciAocikgaXMgY2FsY3VsYXRlZCBhczogciA9IGEgLSBuICogcS5cclxuICAgIC8vXHJcbiAgICAvLyBVUCAgICAgICAgIDAgVGhlIHJlbWFpbmRlciBpcyBwb3NpdGl2ZSBpZiB0aGUgZGl2aWRlbmQgaXMgbmVnYXRpdmUsIGVsc2UgaXMgbmVnYXRpdmUuXHJcbiAgICAvLyBET1dOICAgICAgIDEgVGhlIHJlbWFpbmRlciBoYXMgdGhlIHNhbWUgc2lnbiBhcyB0aGUgZGl2aWRlbmQgKEphdmFTY3JpcHQgJSkuXHJcbiAgICAvLyBGTE9PUiAgICAgIDMgVGhlIHJlbWFpbmRlciBoYXMgdGhlIHNhbWUgc2lnbiBhcyB0aGUgZGl2aXNvciAoUHl0aG9uICUpLlxyXG4gICAgLy8gSEFMRl9FVkVOICA2IFRoZSBJRUVFIDc1NCByZW1haW5kZXIgZnVuY3Rpb24uXHJcbiAgICAvLyBFVUNMSUQgICAgIDkgRXVjbGlkaWFuIGRpdmlzaW9uLiBxID0gc2lnbihuKSAqIGZsb29yKGEgLyBhYnMobikpLiBBbHdheXMgcG9zaXRpdmUuXHJcbiAgICAvL1xyXG4gICAgLy8gVHJ1bmNhdGVkIGRpdmlzaW9uICgxKSwgZmxvb3JlZCBkaXZpc2lvbiAoMyksIHRoZSBJRUVFIDc1NCByZW1haW5kZXIgKDYpLCBhbmQgRXVjbGlkaWFuXHJcbiAgICAvLyBkaXZpc2lvbiAoOSkgYXJlIGNvbW1vbmx5IHVzZWQgZm9yIHRoZSBtb2R1bHVzIG9wZXJhdGlvbi4gVGhlIG90aGVyIHJvdW5kaW5nIG1vZGVzIGNhbiBhbHNvXHJcbiAgICAvLyBiZSB1c2VkLCBidXQgdGhleSBtYXkgbm90IGdpdmUgdXNlZnVsIHJlc3VsdHMuXHJcbiAgICBtb2R1bG86IDEsICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyAwIHRvIDlcclxuXHJcbiAgICAvLyBUaGUgZXhwb25lbnQgdmFsdWUgYXQgYW5kIGJlbmVhdGggd2hpY2ggYHRvU3RyaW5nYCByZXR1cm5zIGV4cG9uZW50aWFsIG5vdGF0aW9uLlxyXG4gICAgLy8gSmF2YVNjcmlwdCBudW1iZXJzOiAtN1xyXG4gICAgdG9FeHBOZWc6IC03LCAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gMCB0byAtRVhQX0xJTUlUXHJcblxyXG4gICAgLy8gVGhlIGV4cG9uZW50IHZhbHVlIGF0IGFuZCBhYm92ZSB3aGljaCBgdG9TdHJpbmdgIHJldHVybnMgZXhwb25lbnRpYWwgbm90YXRpb24uXHJcbiAgICAvLyBKYXZhU2NyaXB0IG51bWJlcnM6IDIxXHJcbiAgICB0b0V4cFBvczogIDIxLCAgICAgICAgICAgICAgICAgICAgICAgICAvLyAwIHRvIEVYUF9MSU1JVFxyXG5cclxuICAgIC8vIFRoZSBtaW5pbXVtIGV4cG9uZW50IHZhbHVlLCBiZW5lYXRoIHdoaWNoIHVuZGVyZmxvdyB0byB6ZXJvIG9jY3Vycy5cclxuICAgIC8vIEphdmFTY3JpcHQgbnVtYmVyczogLTMyNCAgKDVlLTMyNClcclxuICAgIG1pbkU6IC1FWFBfTElNSVQsICAgICAgICAgICAgICAgICAgICAgIC8vIC0xIHRvIC1FWFBfTElNSVRcclxuXHJcbiAgICAvLyBUaGUgbWF4aW11bSBleHBvbmVudCB2YWx1ZSwgYWJvdmUgd2hpY2ggb3ZlcmZsb3cgdG8gSW5maW5pdHkgb2NjdXJzLlxyXG4gICAgLy8gSmF2YVNjcmlwdCBudW1iZXJzOiAzMDggICgxLjc5NzY5MzEzNDg2MjMxNTdlKzMwOClcclxuICAgIG1heEU6IEVYUF9MSU1JVCwgICAgICAgICAgICAgICAgICAgICAgIC8vIDEgdG8gRVhQX0xJTUlUXHJcblxyXG4gICAgLy8gV2hldGhlciB0byB1c2UgY3J5cHRvZ3JhcGhpY2FsbHktc2VjdXJlIHJhbmRvbSBudW1iZXIgZ2VuZXJhdGlvbiwgaWYgYXZhaWxhYmxlLlxyXG4gICAgY3J5cHRvOiBmYWxzZSAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gdHJ1ZS9mYWxzZVxyXG4gIH0sXHJcblxyXG5cclxuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0gRU5EIE9GIEVESVRBQkxFIERFRkFVTFRTIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0gLy9cclxuXHJcblxyXG4gIGluZXhhY3QsIHF1YWRyYW50LFxyXG4gIGV4dGVybmFsID0gdHJ1ZSxcclxuXHJcbiAgZGVjaW1hbEVycm9yID0gJ1tEZWNpbWFsRXJyb3JdICcsXHJcbiAgaW52YWxpZEFyZ3VtZW50ID0gZGVjaW1hbEVycm9yICsgJ0ludmFsaWQgYXJndW1lbnQ6ICcsXHJcbiAgcHJlY2lzaW9uTGltaXRFeGNlZWRlZCA9IGRlY2ltYWxFcnJvciArICdQcmVjaXNpb24gbGltaXQgZXhjZWVkZWQnLFxyXG4gIGNyeXB0b1VuYXZhaWxhYmxlID0gZGVjaW1hbEVycm9yICsgJ2NyeXB0byB1bmF2YWlsYWJsZScsXHJcbiAgdGFnID0gJ1tvYmplY3QgRGVjaW1hbF0nLFxyXG5cclxuICBtYXRoZmxvb3IgPSBNYXRoLmZsb29yLFxyXG4gIG1hdGhwb3cgPSBNYXRoLnBvdyxcclxuXHJcbiAgaXNCaW5hcnkgPSAvXjBiKFswMV0rKFxcLlswMV0qKT98XFwuWzAxXSspKHBbKy1dP1xcZCspPyQvaSxcclxuICBpc0hleCA9IC9eMHgoWzAtOWEtZl0rKFxcLlswLTlhLWZdKik/fFxcLlswLTlhLWZdKykocFsrLV0/XFxkKyk/JC9pLFxyXG4gIGlzT2N0YWwgPSAvXjBvKFswLTddKyhcXC5bMC03XSopP3xcXC5bMC03XSspKHBbKy1dP1xcZCspPyQvaSxcclxuICBpc0RlY2ltYWwgPSAvXihcXGQrKFxcLlxcZCopP3xcXC5cXGQrKShlWystXT9cXGQrKT8kL2ksXHJcblxyXG4gIEJBU0UgPSAxZTcsXHJcbiAgTE9HX0JBU0UgPSA3LFxyXG4gIE1BWF9TQUZFX0lOVEVHRVIgPSA5MDA3MTk5MjU0NzQwOTkxLFxyXG5cclxuICBMTjEwX1BSRUNJU0lPTiA9IExOMTAubGVuZ3RoIC0gMSxcclxuICBQSV9QUkVDSVNJT04gPSBQSS5sZW5ndGggLSAxLFxyXG5cclxuICAvLyBEZWNpbWFsLnByb3RvdHlwZSBvYmplY3RcclxuICBQID0geyB0b1N0cmluZ1RhZzogdGFnIH07XHJcblxyXG5cclxuLy8gRGVjaW1hbCBwcm90b3R5cGUgbWV0aG9kc1xyXG5cclxuXHJcbi8qXHJcbiAqICBhYnNvbHV0ZVZhbHVlICAgICAgICAgICAgIGFic1xyXG4gKiAgY2VpbFxyXG4gKiAgY2xhbXBlZFRvICAgICAgICAgICAgICAgICBjbGFtcFxyXG4gKiAgY29tcGFyZWRUbyAgICAgICAgICAgICAgICBjbXBcclxuICogIGNvc2luZSAgICAgICAgICAgICAgICAgICAgY29zXHJcbiAqICBjdWJlUm9vdCAgICAgICAgICAgICAgICAgIGNicnRcclxuICogIGRlY2ltYWxQbGFjZXMgICAgICAgICAgICAgZHBcclxuICogIGRpdmlkZWRCeSAgICAgICAgICAgICAgICAgZGl2XHJcbiAqICBkaXZpZGVkVG9JbnRlZ2VyQnkgICAgICAgIGRpdlRvSW50XHJcbiAqICBlcXVhbHMgICAgICAgICAgICAgICAgICAgIGVxXHJcbiAqICBmbG9vclxyXG4gKiAgZ3JlYXRlclRoYW4gICAgICAgICAgICAgICBndFxyXG4gKiAgZ3JlYXRlclRoYW5PckVxdWFsVG8gICAgICBndGVcclxuICogIGh5cGVyYm9saWNDb3NpbmUgICAgICAgICAgY29zaFxyXG4gKiAgaHlwZXJib2xpY1NpbmUgICAgICAgICAgICBzaW5oXHJcbiAqICBoeXBlcmJvbGljVGFuZ2VudCAgICAgICAgIHRhbmhcclxuICogIGludmVyc2VDb3NpbmUgICAgICAgICAgICAgYWNvc1xyXG4gKiAgaW52ZXJzZUh5cGVyYm9saWNDb3NpbmUgICBhY29zaFxyXG4gKiAgaW52ZXJzZUh5cGVyYm9saWNTaW5lICAgICBhc2luaFxyXG4gKiAgaW52ZXJzZUh5cGVyYm9saWNUYW5nZW50ICBhdGFuaFxyXG4gKiAgaW52ZXJzZVNpbmUgICAgICAgICAgICAgICBhc2luXHJcbiAqICBpbnZlcnNlVGFuZ2VudCAgICAgICAgICAgIGF0YW5cclxuICogIGlzRmluaXRlXHJcbiAqICBpc0ludGVnZXIgICAgICAgICAgICAgICAgIGlzSW50XHJcbiAqICBpc05hTlxyXG4gKiAgaXNOZWdhdGl2ZSAgICAgICAgICAgICAgICBpc05lZ1xyXG4gKiAgaXNQb3NpdGl2ZSAgICAgICAgICAgICAgICBpc1Bvc1xyXG4gKiAgaXNaZXJvXHJcbiAqICBsZXNzVGhhbiAgICAgICAgICAgICAgICAgIGx0XHJcbiAqICBsZXNzVGhhbk9yRXF1YWxUbyAgICAgICAgIGx0ZVxyXG4gKiAgbG9nYXJpdGhtICAgICAgICAgICAgICAgICBsb2dcclxuICogIFttYXhpbXVtXSAgICAgICAgICAgICAgICAgW21heF1cclxuICogIFttaW5pbXVtXSAgICAgICAgICAgICAgICAgW21pbl1cclxuICogIG1pbnVzICAgICAgICAgICAgICAgICAgICAgc3ViXHJcbiAqICBtb2R1bG8gICAgICAgICAgICAgICAgICAgIG1vZFxyXG4gKiAgbmF0dXJhbEV4cG9uZW50aWFsICAgICAgICBleHBcclxuICogIG5hdHVyYWxMb2dhcml0aG0gICAgICAgICAgbG5cclxuICogIG5lZ2F0ZWQgICAgICAgICAgICAgICAgICAgbmVnXHJcbiAqICBwbHVzICAgICAgICAgICAgICAgICAgICAgIGFkZFxyXG4gKiAgcHJlY2lzaW9uICAgICAgICAgICAgICAgICBzZFxyXG4gKiAgcm91bmRcclxuICogIHNpbmUgICAgICAgICAgICAgICAgICAgICAgc2luXHJcbiAqICBzcXVhcmVSb290ICAgICAgICAgICAgICAgIHNxcnRcclxuICogIHRhbmdlbnQgICAgICAgICAgICAgICAgICAgdGFuXHJcbiAqICB0aW1lcyAgICAgICAgICAgICAgICAgICAgIG11bFxyXG4gKiAgdG9CaW5hcnlcclxuICogIHRvRGVjaW1hbFBsYWNlcyAgICAgICAgICAgdG9EUFxyXG4gKiAgdG9FeHBvbmVudGlhbFxyXG4gKiAgdG9GaXhlZFxyXG4gKiAgdG9GcmFjdGlvblxyXG4gKiAgdG9IZXhhZGVjaW1hbCAgICAgICAgICAgICB0b0hleFxyXG4gKiAgdG9OZWFyZXN0XHJcbiAqICB0b051bWJlclxyXG4gKiAgdG9PY3RhbFxyXG4gKiAgdG9Qb3dlciAgICAgICAgICAgICAgICAgICBwb3dcclxuICogIHRvUHJlY2lzaW9uXHJcbiAqICB0b1NpZ25pZmljYW50RGlnaXRzICAgICAgIHRvU0RcclxuICogIHRvU3RyaW5nXHJcbiAqICB0cnVuY2F0ZWQgICAgICAgICAgICAgICAgIHRydW5jXHJcbiAqICB2YWx1ZU9mICAgICAgICAgICAgICAgICAgIHRvSlNPTlxyXG4gKi9cclxuXHJcblxyXG4vKlxyXG4gKiBSZXR1cm4gYSBuZXcgRGVjaW1hbCB3aG9zZSB2YWx1ZSBpcyB0aGUgYWJzb2x1dGUgdmFsdWUgb2YgdGhpcyBEZWNpbWFsLlxyXG4gKlxyXG4gKi9cclxuUC5hYnNvbHV0ZVZhbHVlID0gUC5hYnMgPSBmdW5jdGlvbiAoKSB7XHJcbiAgdmFyIHggPSBuZXcgdGhpcy5jb25zdHJ1Y3Rvcih0aGlzKTtcclxuICBpZiAoeC5zIDwgMCkgeC5zID0gMTtcclxuICByZXR1cm4gZmluYWxpc2UoeCk7XHJcbn07XHJcblxyXG5cclxuLypcclxuICogUmV0dXJuIGEgbmV3IERlY2ltYWwgd2hvc2UgdmFsdWUgaXMgdGhlIHZhbHVlIG9mIHRoaXMgRGVjaW1hbCByb3VuZGVkIHRvIGEgd2hvbGUgbnVtYmVyIGluIHRoZVxyXG4gKiBkaXJlY3Rpb24gb2YgcG9zaXRpdmUgSW5maW5pdHkuXHJcbiAqXHJcbiAqL1xyXG5QLmNlaWwgPSBmdW5jdGlvbiAoKSB7XHJcbiAgcmV0dXJuIGZpbmFsaXNlKG5ldyB0aGlzLmNvbnN0cnVjdG9yKHRoaXMpLCB0aGlzLmUgKyAxLCAyKTtcclxufTtcclxuXHJcblxyXG4vKlxyXG4gKiBSZXR1cm4gYSBuZXcgRGVjaW1hbCB3aG9zZSB2YWx1ZSBpcyB0aGUgdmFsdWUgb2YgdGhpcyBEZWNpbWFsIGNsYW1wZWQgdG8gdGhlIHJhbmdlXHJcbiAqIGRlbGluZWF0ZWQgYnkgYG1pbmAgYW5kIGBtYXhgLlxyXG4gKlxyXG4gKiBtaW4ge251bWJlcnxzdHJpbmd8RGVjaW1hbH1cclxuICogbWF4IHtudW1iZXJ8c3RyaW5nfERlY2ltYWx9XHJcbiAqXHJcbiAqL1xyXG5QLmNsYW1wZWRUbyA9IFAuY2xhbXAgPSBmdW5jdGlvbiAobWluLCBtYXgpIHtcclxuICB2YXIgayxcclxuICAgIHggPSB0aGlzLFxyXG4gICAgQ3RvciA9IHguY29uc3RydWN0b3I7XHJcbiAgbWluID0gbmV3IEN0b3IobWluKTtcclxuICBtYXggPSBuZXcgQ3RvcihtYXgpO1xyXG4gIGlmICghbWluLnMgfHwgIW1heC5zKSByZXR1cm4gbmV3IEN0b3IoTmFOKTtcclxuICBpZiAobWluLmd0KG1heCkpIHRocm93IEVycm9yKGludmFsaWRBcmd1bWVudCArIG1heCk7XHJcbiAgayA9IHguY21wKG1pbik7XHJcbiAgcmV0dXJuIGsgPCAwID8gbWluIDogeC5jbXAobWF4KSA+IDAgPyBtYXggOiBuZXcgQ3Rvcih4KTtcclxufTtcclxuXHJcblxyXG4vKlxyXG4gKiBSZXR1cm5cclxuICogICAxICAgIGlmIHRoZSB2YWx1ZSBvZiB0aGlzIERlY2ltYWwgaXMgZ3JlYXRlciB0aGFuIHRoZSB2YWx1ZSBvZiBgeWAsXHJcbiAqICAtMSAgICBpZiB0aGUgdmFsdWUgb2YgdGhpcyBEZWNpbWFsIGlzIGxlc3MgdGhhbiB0aGUgdmFsdWUgb2YgYHlgLFxyXG4gKiAgIDAgICAgaWYgdGhleSBoYXZlIHRoZSBzYW1lIHZhbHVlLFxyXG4gKiAgIE5hTiAgaWYgdGhlIHZhbHVlIG9mIGVpdGhlciBEZWNpbWFsIGlzIE5hTi5cclxuICpcclxuICovXHJcblAuY29tcGFyZWRUbyA9IFAuY21wID0gZnVuY3Rpb24gKHkpIHtcclxuICB2YXIgaSwgaiwgeGRMLCB5ZEwsXHJcbiAgICB4ID0gdGhpcyxcclxuICAgIHhkID0geC5kLFxyXG4gICAgeWQgPSAoeSA9IG5ldyB4LmNvbnN0cnVjdG9yKHkpKS5kLFxyXG4gICAgeHMgPSB4LnMsXHJcbiAgICB5cyA9IHkucztcclxuXHJcbiAgLy8gRWl0aGVyIE5hTiBvciBcdTAwQjFJbmZpbml0eT9cclxuICBpZiAoIXhkIHx8ICF5ZCkge1xyXG4gICAgcmV0dXJuICF4cyB8fCAheXMgPyBOYU4gOiB4cyAhPT0geXMgPyB4cyA6IHhkID09PSB5ZCA/IDAgOiAheGQgXiB4cyA8IDAgPyAxIDogLTE7XHJcbiAgfVxyXG5cclxuICAvLyBFaXRoZXIgemVybz9cclxuICBpZiAoIXhkWzBdIHx8ICF5ZFswXSkgcmV0dXJuIHhkWzBdID8geHMgOiB5ZFswXSA/IC15cyA6IDA7XHJcblxyXG4gIC8vIFNpZ25zIGRpZmZlcj9cclxuICBpZiAoeHMgIT09IHlzKSByZXR1cm4geHM7XHJcblxyXG4gIC8vIENvbXBhcmUgZXhwb25lbnRzLlxyXG4gIGlmICh4LmUgIT09IHkuZSkgcmV0dXJuIHguZSA+IHkuZSBeIHhzIDwgMCA/IDEgOiAtMTtcclxuXHJcbiAgeGRMID0geGQubGVuZ3RoO1xyXG4gIHlkTCA9IHlkLmxlbmd0aDtcclxuXHJcbiAgLy8gQ29tcGFyZSBkaWdpdCBieSBkaWdpdC5cclxuICBmb3IgKGkgPSAwLCBqID0geGRMIDwgeWRMID8geGRMIDogeWRMOyBpIDwgajsgKytpKSB7XHJcbiAgICBpZiAoeGRbaV0gIT09IHlkW2ldKSByZXR1cm4geGRbaV0gPiB5ZFtpXSBeIHhzIDwgMCA/IDEgOiAtMTtcclxuICB9XHJcblxyXG4gIC8vIENvbXBhcmUgbGVuZ3Rocy5cclxuICByZXR1cm4geGRMID09PSB5ZEwgPyAwIDogeGRMID4geWRMIF4geHMgPCAwID8gMSA6IC0xO1xyXG59O1xyXG5cclxuXHJcbi8qXHJcbiAqIFJldHVybiBhIG5ldyBEZWNpbWFsIHdob3NlIHZhbHVlIGlzIHRoZSBjb3NpbmUgb2YgdGhlIHZhbHVlIGluIHJhZGlhbnMgb2YgdGhpcyBEZWNpbWFsLlxyXG4gKlxyXG4gKiBEb21haW46IFstSW5maW5pdHksIEluZmluaXR5XVxyXG4gKiBSYW5nZTogWy0xLCAxXVxyXG4gKlxyXG4gKiBjb3MoMCkgICAgICAgICA9IDFcclxuICogY29zKC0wKSAgICAgICAgPSAxXHJcbiAqIGNvcyhJbmZpbml0eSkgID0gTmFOXHJcbiAqIGNvcygtSW5maW5pdHkpID0gTmFOXHJcbiAqIGNvcyhOYU4pICAgICAgID0gTmFOXHJcbiAqXHJcbiAqL1xyXG5QLmNvc2luZSA9IFAuY29zID0gZnVuY3Rpb24gKCkge1xyXG4gIHZhciBwciwgcm0sXHJcbiAgICB4ID0gdGhpcyxcclxuICAgIEN0b3IgPSB4LmNvbnN0cnVjdG9yO1xyXG5cclxuICBpZiAoIXguZCkgcmV0dXJuIG5ldyBDdG9yKE5hTik7XHJcblxyXG4gIC8vIGNvcygwKSA9IGNvcygtMCkgPSAxXHJcbiAgaWYgKCF4LmRbMF0pIHJldHVybiBuZXcgQ3RvcigxKTtcclxuXHJcbiAgcHIgPSBDdG9yLnByZWNpc2lvbjtcclxuICBybSA9IEN0b3Iucm91bmRpbmc7XHJcbiAgQ3Rvci5wcmVjaXNpb24gPSBwciArIE1hdGgubWF4KHguZSwgeC5zZCgpKSArIExPR19CQVNFO1xyXG4gIEN0b3Iucm91bmRpbmcgPSAxO1xyXG5cclxuICB4ID0gY29zaW5lKEN0b3IsIHRvTGVzc1RoYW5IYWxmUGkoQ3RvciwgeCkpO1xyXG5cclxuICBDdG9yLnByZWNpc2lvbiA9IHByO1xyXG4gIEN0b3Iucm91bmRpbmcgPSBybTtcclxuXHJcbiAgcmV0dXJuIGZpbmFsaXNlKHF1YWRyYW50ID09IDIgfHwgcXVhZHJhbnQgPT0gMyA/IHgubmVnKCkgOiB4LCBwciwgcm0sIHRydWUpO1xyXG59O1xyXG5cclxuXHJcbi8qXHJcbiAqXHJcbiAqIFJldHVybiBhIG5ldyBEZWNpbWFsIHdob3NlIHZhbHVlIGlzIHRoZSBjdWJlIHJvb3Qgb2YgdGhlIHZhbHVlIG9mIHRoaXMgRGVjaW1hbCwgcm91bmRlZCB0b1xyXG4gKiBgcHJlY2lzaW9uYCBzaWduaWZpY2FudCBkaWdpdHMgdXNpbmcgcm91bmRpbmcgbW9kZSBgcm91bmRpbmdgLlxyXG4gKlxyXG4gKiAgY2JydCgwKSAgPSAgMFxyXG4gKiAgY2JydCgtMCkgPSAtMFxyXG4gKiAgY2JydCgxKSAgPSAgMVxyXG4gKiAgY2JydCgtMSkgPSAtMVxyXG4gKiAgY2JydChOKSAgPSAgTlxyXG4gKiAgY2JydCgtSSkgPSAtSVxyXG4gKiAgY2JydChJKSAgPSAgSVxyXG4gKlxyXG4gKiBNYXRoLmNicnQoeCkgPSAoeCA8IDAgPyAtTWF0aC5wb3coLXgsIDEvMykgOiBNYXRoLnBvdyh4LCAxLzMpKVxyXG4gKlxyXG4gKi9cclxuUC5jdWJlUm9vdCA9IFAuY2JydCA9IGZ1bmN0aW9uICgpIHtcclxuICB2YXIgZSwgbSwgbiwgciwgcmVwLCBzLCBzZCwgdCwgdDMsIHQzcGx1c3gsXHJcbiAgICB4ID0gdGhpcyxcclxuICAgIEN0b3IgPSB4LmNvbnN0cnVjdG9yO1xyXG5cclxuICBpZiAoIXguaXNGaW5pdGUoKSB8fCB4LmlzWmVybygpKSByZXR1cm4gbmV3IEN0b3IoeCk7XHJcbiAgZXh0ZXJuYWwgPSBmYWxzZTtcclxuXHJcbiAgLy8gSW5pdGlhbCBlc3RpbWF0ZS5cclxuICBzID0geC5zICogbWF0aHBvdyh4LnMgKiB4LCAxIC8gMyk7XHJcblxyXG4gICAvLyBNYXRoLmNicnQgdW5kZXJmbG93L292ZXJmbG93P1xyXG4gICAvLyBQYXNzIHggdG8gTWF0aC5wb3cgYXMgaW50ZWdlciwgdGhlbiBhZGp1c3QgdGhlIGV4cG9uZW50IG9mIHRoZSByZXN1bHQuXHJcbiAgaWYgKCFzIHx8IE1hdGguYWJzKHMpID09IDEgLyAwKSB7XHJcbiAgICBuID0gZGlnaXRzVG9TdHJpbmcoeC5kKTtcclxuICAgIGUgPSB4LmU7XHJcblxyXG4gICAgLy8gQWRqdXN0IG4gZXhwb25lbnQgc28gaXQgaXMgYSBtdWx0aXBsZSBvZiAzIGF3YXkgZnJvbSB4IGV4cG9uZW50LlxyXG4gICAgaWYgKHMgPSAoZSAtIG4ubGVuZ3RoICsgMSkgJSAzKSBuICs9IChzID09IDEgfHwgcyA9PSAtMiA/ICcwJyA6ICcwMCcpO1xyXG4gICAgcyA9IG1hdGhwb3cobiwgMSAvIDMpO1xyXG5cclxuICAgIC8vIFJhcmVseSwgZSBtYXkgYmUgb25lIGxlc3MgdGhhbiB0aGUgcmVzdWx0IGV4cG9uZW50IHZhbHVlLlxyXG4gICAgZSA9IG1hdGhmbG9vcigoZSArIDEpIC8gMykgLSAoZSAlIDMgPT0gKGUgPCAwID8gLTEgOiAyKSk7XHJcblxyXG4gICAgaWYgKHMgPT0gMSAvIDApIHtcclxuICAgICAgbiA9ICc1ZScgKyBlO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgbiA9IHMudG9FeHBvbmVudGlhbCgpO1xyXG4gICAgICBuID0gbi5zbGljZSgwLCBuLmluZGV4T2YoJ2UnKSArIDEpICsgZTtcclxuICAgIH1cclxuXHJcbiAgICByID0gbmV3IEN0b3Iobik7XHJcbiAgICByLnMgPSB4LnM7XHJcbiAgfSBlbHNlIHtcclxuICAgIHIgPSBuZXcgQ3RvcihzLnRvU3RyaW5nKCkpO1xyXG4gIH1cclxuXHJcbiAgc2QgPSAoZSA9IEN0b3IucHJlY2lzaW9uKSArIDM7XHJcblxyXG4gIC8vIEhhbGxleSdzIG1ldGhvZC5cclxuICAvLyBUT0RPPyBDb21wYXJlIE5ld3RvbidzIG1ldGhvZC5cclxuICBmb3IgKDs7KSB7XHJcbiAgICB0ID0gcjtcclxuICAgIHQzID0gdC50aW1lcyh0KS50aW1lcyh0KTtcclxuICAgIHQzcGx1c3ggPSB0My5wbHVzKHgpO1xyXG4gICAgciA9IGRpdmlkZSh0M3BsdXN4LnBsdXMoeCkudGltZXModCksIHQzcGx1c3gucGx1cyh0MyksIHNkICsgMiwgMSk7XHJcblxyXG4gICAgLy8gVE9ETz8gUmVwbGFjZSB3aXRoIGZvci1sb29wIGFuZCBjaGVja1JvdW5kaW5nRGlnaXRzLlxyXG4gICAgaWYgKGRpZ2l0c1RvU3RyaW5nKHQuZCkuc2xpY2UoMCwgc2QpID09PSAobiA9IGRpZ2l0c1RvU3RyaW5nKHIuZCkpLnNsaWNlKDAsIHNkKSkge1xyXG4gICAgICBuID0gbi5zbGljZShzZCAtIDMsIHNkICsgMSk7XHJcblxyXG4gICAgICAvLyBUaGUgNHRoIHJvdW5kaW5nIGRpZ2l0IG1heSBiZSBpbiBlcnJvciBieSAtMSBzbyBpZiB0aGUgNCByb3VuZGluZyBkaWdpdHMgYXJlIDk5OTkgb3IgNDk5OVxyXG4gICAgICAvLyAsIGkuZS4gYXBwcm9hY2hpbmcgYSByb3VuZGluZyBib3VuZGFyeSwgY29udGludWUgdGhlIGl0ZXJhdGlvbi5cclxuICAgICAgaWYgKG4gPT0gJzk5OTknIHx8ICFyZXAgJiYgbiA9PSAnNDk5OScpIHtcclxuXHJcbiAgICAgICAgLy8gT24gdGhlIGZpcnN0IGl0ZXJhdGlvbiBvbmx5LCBjaGVjayB0byBzZWUgaWYgcm91bmRpbmcgdXAgZ2l2ZXMgdGhlIGV4YWN0IHJlc3VsdCBhcyB0aGVcclxuICAgICAgICAvLyBuaW5lcyBtYXkgaW5maW5pdGVseSByZXBlYXQuXHJcbiAgICAgICAgaWYgKCFyZXApIHtcclxuICAgICAgICAgIGZpbmFsaXNlKHQsIGUgKyAxLCAwKTtcclxuXHJcbiAgICAgICAgICBpZiAodC50aW1lcyh0KS50aW1lcyh0KS5lcSh4KSkge1xyXG4gICAgICAgICAgICByID0gdDtcclxuICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBzZCArPSA0O1xyXG4gICAgICAgIHJlcCA9IDE7XHJcbiAgICAgIH0gZWxzZSB7XHJcblxyXG4gICAgICAgIC8vIElmIHRoZSByb3VuZGluZyBkaWdpdHMgYXJlIG51bGwsIDB7MCw0fSBvciA1MHswLDN9LCBjaGVjayBmb3IgYW4gZXhhY3QgcmVzdWx0LlxyXG4gICAgICAgIC8vIElmIG5vdCwgdGhlbiB0aGVyZSBhcmUgZnVydGhlciBkaWdpdHMgYW5kIG0gd2lsbCBiZSB0cnV0aHkuXHJcbiAgICAgICAgaWYgKCErbiB8fCAhK24uc2xpY2UoMSkgJiYgbi5jaGFyQXQoMCkgPT0gJzUnKSB7XHJcblxyXG4gICAgICAgICAgLy8gVHJ1bmNhdGUgdG8gdGhlIGZpcnN0IHJvdW5kaW5nIGRpZ2l0LlxyXG4gICAgICAgICAgZmluYWxpc2UociwgZSArIDEsIDEpO1xyXG4gICAgICAgICAgbSA9ICFyLnRpbWVzKHIpLnRpbWVzKHIpLmVxKHgpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgYnJlYWs7XHJcbiAgICAgIH1cclxuICAgIH1cclxuICB9XHJcblxyXG4gIGV4dGVybmFsID0gdHJ1ZTtcclxuXHJcbiAgcmV0dXJuIGZpbmFsaXNlKHIsIGUsIEN0b3Iucm91bmRpbmcsIG0pO1xyXG59O1xyXG5cclxuXHJcbi8qXHJcbiAqIFJldHVybiB0aGUgbnVtYmVyIG9mIGRlY2ltYWwgcGxhY2VzIG9mIHRoZSB2YWx1ZSBvZiB0aGlzIERlY2ltYWwuXHJcbiAqXHJcbiAqL1xyXG5QLmRlY2ltYWxQbGFjZXMgPSBQLmRwID0gZnVuY3Rpb24gKCkge1xyXG4gIHZhciB3LFxyXG4gICAgZCA9IHRoaXMuZCxcclxuICAgIG4gPSBOYU47XHJcblxyXG4gIGlmIChkKSB7XHJcbiAgICB3ID0gZC5sZW5ndGggLSAxO1xyXG4gICAgbiA9ICh3IC0gbWF0aGZsb29yKHRoaXMuZSAvIExPR19CQVNFKSkgKiBMT0dfQkFTRTtcclxuXHJcbiAgICAvLyBTdWJ0cmFjdCB0aGUgbnVtYmVyIG9mIHRyYWlsaW5nIHplcm9zIG9mIHRoZSBsYXN0IHdvcmQuXHJcbiAgICB3ID0gZFt3XTtcclxuICAgIGlmICh3KSBmb3IgKDsgdyAlIDEwID09IDA7IHcgLz0gMTApIG4tLTtcclxuICAgIGlmIChuIDwgMCkgbiA9IDA7XHJcbiAgfVxyXG5cclxuICByZXR1cm4gbjtcclxufTtcclxuXHJcblxyXG4vKlxyXG4gKiAgbiAvIDAgPSBJXHJcbiAqICBuIC8gTiA9IE5cclxuICogIG4gLyBJID0gMFxyXG4gKiAgMCAvIG4gPSAwXHJcbiAqICAwIC8gMCA9IE5cclxuICogIDAgLyBOID0gTlxyXG4gKiAgMCAvIEkgPSAwXHJcbiAqICBOIC8gbiA9IE5cclxuICogIE4gLyAwID0gTlxyXG4gKiAgTiAvIE4gPSBOXHJcbiAqICBOIC8gSSA9IE5cclxuICogIEkgLyBuID0gSVxyXG4gKiAgSSAvIDAgPSBJXHJcbiAqICBJIC8gTiA9IE5cclxuICogIEkgLyBJID0gTlxyXG4gKlxyXG4gKiBSZXR1cm4gYSBuZXcgRGVjaW1hbCB3aG9zZSB2YWx1ZSBpcyB0aGUgdmFsdWUgb2YgdGhpcyBEZWNpbWFsIGRpdmlkZWQgYnkgYHlgLCByb3VuZGVkIHRvXHJcbiAqIGBwcmVjaXNpb25gIHNpZ25pZmljYW50IGRpZ2l0cyB1c2luZyByb3VuZGluZyBtb2RlIGByb3VuZGluZ2AuXHJcbiAqXHJcbiAqL1xyXG5QLmRpdmlkZWRCeSA9IFAuZGl2ID0gZnVuY3Rpb24gKHkpIHtcclxuICByZXR1cm4gZGl2aWRlKHRoaXMsIG5ldyB0aGlzLmNvbnN0cnVjdG9yKHkpKTtcclxufTtcclxuXHJcblxyXG4vKlxyXG4gKiBSZXR1cm4gYSBuZXcgRGVjaW1hbCB3aG9zZSB2YWx1ZSBpcyB0aGUgaW50ZWdlciBwYXJ0IG9mIGRpdmlkaW5nIHRoZSB2YWx1ZSBvZiB0aGlzIERlY2ltYWxcclxuICogYnkgdGhlIHZhbHVlIG9mIGB5YCwgcm91bmRlZCB0byBgcHJlY2lzaW9uYCBzaWduaWZpY2FudCBkaWdpdHMgdXNpbmcgcm91bmRpbmcgbW9kZSBgcm91bmRpbmdgLlxyXG4gKlxyXG4gKi9cclxuUC5kaXZpZGVkVG9JbnRlZ2VyQnkgPSBQLmRpdlRvSW50ID0gZnVuY3Rpb24gKHkpIHtcclxuICB2YXIgeCA9IHRoaXMsXHJcbiAgICBDdG9yID0geC5jb25zdHJ1Y3RvcjtcclxuICByZXR1cm4gZmluYWxpc2UoZGl2aWRlKHgsIG5ldyBDdG9yKHkpLCAwLCAxLCAxKSwgQ3Rvci5wcmVjaXNpb24sIEN0b3Iucm91bmRpbmcpO1xyXG59O1xyXG5cclxuXHJcbi8qXHJcbiAqIFJldHVybiB0cnVlIGlmIHRoZSB2YWx1ZSBvZiB0aGlzIERlY2ltYWwgaXMgZXF1YWwgdG8gdGhlIHZhbHVlIG9mIGB5YCwgb3RoZXJ3aXNlIHJldHVybiBmYWxzZS5cclxuICpcclxuICovXHJcblAuZXF1YWxzID0gUC5lcSA9IGZ1bmN0aW9uICh5KSB7XHJcbiAgcmV0dXJuIHRoaXMuY21wKHkpID09PSAwO1xyXG59O1xyXG5cclxuXHJcbi8qXHJcbiAqIFJldHVybiBhIG5ldyBEZWNpbWFsIHdob3NlIHZhbHVlIGlzIHRoZSB2YWx1ZSBvZiB0aGlzIERlY2ltYWwgcm91bmRlZCB0byBhIHdob2xlIG51bWJlciBpbiB0aGVcclxuICogZGlyZWN0aW9uIG9mIG5lZ2F0aXZlIEluZmluaXR5LlxyXG4gKlxyXG4gKi9cclxuUC5mbG9vciA9IGZ1bmN0aW9uICgpIHtcclxuICByZXR1cm4gZmluYWxpc2UobmV3IHRoaXMuY29uc3RydWN0b3IodGhpcyksIHRoaXMuZSArIDEsIDMpO1xyXG59O1xyXG5cclxuXHJcbi8qXHJcbiAqIFJldHVybiB0cnVlIGlmIHRoZSB2YWx1ZSBvZiB0aGlzIERlY2ltYWwgaXMgZ3JlYXRlciB0aGFuIHRoZSB2YWx1ZSBvZiBgeWAsIG90aGVyd2lzZSByZXR1cm5cclxuICogZmFsc2UuXHJcbiAqXHJcbiAqL1xyXG5QLmdyZWF0ZXJUaGFuID0gUC5ndCA9IGZ1bmN0aW9uICh5KSB7XHJcbiAgcmV0dXJuIHRoaXMuY21wKHkpID4gMDtcclxufTtcclxuXHJcblxyXG4vKlxyXG4gKiBSZXR1cm4gdHJ1ZSBpZiB0aGUgdmFsdWUgb2YgdGhpcyBEZWNpbWFsIGlzIGdyZWF0ZXIgdGhhbiBvciBlcXVhbCB0byB0aGUgdmFsdWUgb2YgYHlgLFxyXG4gKiBvdGhlcndpc2UgcmV0dXJuIGZhbHNlLlxyXG4gKlxyXG4gKi9cclxuUC5ncmVhdGVyVGhhbk9yRXF1YWxUbyA9IFAuZ3RlID0gZnVuY3Rpb24gKHkpIHtcclxuICB2YXIgayA9IHRoaXMuY21wKHkpO1xyXG4gIHJldHVybiBrID09IDEgfHwgayA9PT0gMDtcclxufTtcclxuXHJcblxyXG4vKlxyXG4gKiBSZXR1cm4gYSBuZXcgRGVjaW1hbCB3aG9zZSB2YWx1ZSBpcyB0aGUgaHlwZXJib2xpYyBjb3NpbmUgb2YgdGhlIHZhbHVlIGluIHJhZGlhbnMgb2YgdGhpc1xyXG4gKiBEZWNpbWFsLlxyXG4gKlxyXG4gKiBEb21haW46IFstSW5maW5pdHksIEluZmluaXR5XVxyXG4gKiBSYW5nZTogWzEsIEluZmluaXR5XVxyXG4gKlxyXG4gKiBjb3NoKHgpID0gMSArIHheMi8yISArIHheNC80ISArIHheNi82ISArIC4uLlxyXG4gKlxyXG4gKiBjb3NoKDApICAgICAgICAgPSAxXHJcbiAqIGNvc2goLTApICAgICAgICA9IDFcclxuICogY29zaChJbmZpbml0eSkgID0gSW5maW5pdHlcclxuICogY29zaCgtSW5maW5pdHkpID0gSW5maW5pdHlcclxuICogY29zaChOYU4pICAgICAgID0gTmFOXHJcbiAqXHJcbiAqICB4ICAgICAgICB0aW1lIHRha2VuIChtcykgICByZXN1bHRcclxuICogMTAwMCAgICAgIDkgICAgICAgICAgICAgICAgIDkuODUwMzU1NTcwMDg1MjM0OTY5NGUrNDMzXHJcbiAqIDEwMDAwICAgICAyNSAgICAgICAgICAgICAgICA0LjQwMzQwOTExMjgzMTQ2MDc5MzZlKzQzNDJcclxuICogMTAwMDAwICAgIDE3MSAgICAgICAgICAgICAgIDEuNDAzMzMxNjgwMjEzMDYxNTg5N2UrNDM0MjlcclxuICogMTAwMDAwMCAgIDM4MTcgICAgICAgICAgICAgIDEuNTE2NjA3Njk4NDAxMDQzNzcyNWUrNDM0Mjk0XHJcbiAqIDEwMDAwMDAwICBhYmFuZG9uZWQgYWZ0ZXIgMiBtaW51dGUgd2FpdFxyXG4gKlxyXG4gKiBUT0RPPyBDb21wYXJlIHBlcmZvcm1hbmNlIG9mIGNvc2goeCkgPSAwLjUgKiAoZXhwKHgpICsgZXhwKC14KSlcclxuICpcclxuICovXHJcblAuaHlwZXJib2xpY0Nvc2luZSA9IFAuY29zaCA9IGZ1bmN0aW9uICgpIHtcclxuICB2YXIgaywgbiwgcHIsIHJtLCBsZW4sXHJcbiAgICB4ID0gdGhpcyxcclxuICAgIEN0b3IgPSB4LmNvbnN0cnVjdG9yLFxyXG4gICAgb25lID0gbmV3IEN0b3IoMSk7XHJcblxyXG4gIGlmICgheC5pc0Zpbml0ZSgpKSByZXR1cm4gbmV3IEN0b3IoeC5zID8gMSAvIDAgOiBOYU4pO1xyXG4gIGlmICh4LmlzWmVybygpKSByZXR1cm4gb25lO1xyXG5cclxuICBwciA9IEN0b3IucHJlY2lzaW9uO1xyXG4gIHJtID0gQ3Rvci5yb3VuZGluZztcclxuICBDdG9yLnByZWNpc2lvbiA9IHByICsgTWF0aC5tYXgoeC5lLCB4LnNkKCkpICsgNDtcclxuICBDdG9yLnJvdW5kaW5nID0gMTtcclxuICBsZW4gPSB4LmQubGVuZ3RoO1xyXG5cclxuICAvLyBBcmd1bWVudCByZWR1Y3Rpb246IGNvcyg0eCkgPSAxIC0gOGNvc14yKHgpICsgOGNvc140KHgpICsgMVxyXG4gIC8vIGkuZS4gY29zKHgpID0gMSAtIGNvc14yKHgvNCkoOCAtIDhjb3NeMih4LzQpKVxyXG5cclxuICAvLyBFc3RpbWF0ZSB0aGUgb3B0aW11bSBudW1iZXIgb2YgdGltZXMgdG8gdXNlIHRoZSBhcmd1bWVudCByZWR1Y3Rpb24uXHJcbiAgLy8gVE9ETz8gRXN0aW1hdGlvbiByZXVzZWQgZnJvbSBjb3NpbmUoKSBhbmQgbWF5IG5vdCBiZSBvcHRpbWFsIGhlcmUuXHJcbiAgaWYgKGxlbiA8IDMyKSB7XHJcbiAgICBrID0gTWF0aC5jZWlsKGxlbiAvIDMpO1xyXG4gICAgbiA9ICgxIC8gdGlueVBvdyg0LCBrKSkudG9TdHJpbmcoKTtcclxuICB9IGVsc2Uge1xyXG4gICAgayA9IDE2O1xyXG4gICAgbiA9ICcyLjMyODMwNjQzNjUzODY5NjI4OTA2MjVlLTEwJztcclxuICB9XHJcblxyXG4gIHggPSB0YXlsb3JTZXJpZXMoQ3RvciwgMSwgeC50aW1lcyhuKSwgbmV3IEN0b3IoMSksIHRydWUpO1xyXG5cclxuICAvLyBSZXZlcnNlIGFyZ3VtZW50IHJlZHVjdGlvblxyXG4gIHZhciBjb3NoMl94LFxyXG4gICAgaSA9IGssXHJcbiAgICBkOCA9IG5ldyBDdG9yKDgpO1xyXG4gIGZvciAoOyBpLS07KSB7XHJcbiAgICBjb3NoMl94ID0geC50aW1lcyh4KTtcclxuICAgIHggPSBvbmUubWludXMoY29zaDJfeC50aW1lcyhkOC5taW51cyhjb3NoMl94LnRpbWVzKGQ4KSkpKTtcclxuICB9XHJcblxyXG4gIHJldHVybiBmaW5hbGlzZSh4LCBDdG9yLnByZWNpc2lvbiA9IHByLCBDdG9yLnJvdW5kaW5nID0gcm0sIHRydWUpO1xyXG59O1xyXG5cclxuXHJcbi8qXHJcbiAqIFJldHVybiBhIG5ldyBEZWNpbWFsIHdob3NlIHZhbHVlIGlzIHRoZSBoeXBlcmJvbGljIHNpbmUgb2YgdGhlIHZhbHVlIGluIHJhZGlhbnMgb2YgdGhpc1xyXG4gKiBEZWNpbWFsLlxyXG4gKlxyXG4gKiBEb21haW46IFstSW5maW5pdHksIEluZmluaXR5XVxyXG4gKiBSYW5nZTogWy1JbmZpbml0eSwgSW5maW5pdHldXHJcbiAqXHJcbiAqIHNpbmgoeCkgPSB4ICsgeF4zLzMhICsgeF41LzUhICsgeF43LzchICsgLi4uXHJcbiAqXHJcbiAqIHNpbmgoMCkgICAgICAgICA9IDBcclxuICogc2luaCgtMCkgICAgICAgID0gLTBcclxuICogc2luaChJbmZpbml0eSkgID0gSW5maW5pdHlcclxuICogc2luaCgtSW5maW5pdHkpID0gLUluZmluaXR5XHJcbiAqIHNpbmgoTmFOKSAgICAgICA9IE5hTlxyXG4gKlxyXG4gKiB4ICAgICAgICB0aW1lIHRha2VuIChtcylcclxuICogMTAgICAgICAgMiBtc1xyXG4gKiAxMDAgICAgICA1IG1zXHJcbiAqIDEwMDAgICAgIDE0IG1zXHJcbiAqIDEwMDAwICAgIDgyIG1zXHJcbiAqIDEwMDAwMCAgIDg4NiBtcyAgICAgICAgICAgIDEuNDAzMzMxNjgwMjEzMDYxNTg5N2UrNDM0MjlcclxuICogMjAwMDAwICAgMjYxMyBtc1xyXG4gKiAzMDAwMDAgICA1NDA3IG1zXHJcbiAqIDQwMDAwMCAgIDg4MjQgbXNcclxuICogNTAwMDAwICAgMTMwMjYgbXMgICAgICAgICAgOC43MDgwNjQzNjEyNzE4MDg0MTI5ZSsyMTcxNDZcclxuICogMTAwMDAwMCAgNDg1NDMgbXNcclxuICpcclxuICogVE9ETz8gQ29tcGFyZSBwZXJmb3JtYW5jZSBvZiBzaW5oKHgpID0gMC41ICogKGV4cCh4KSAtIGV4cCgteCkpXHJcbiAqXHJcbiAqL1xyXG5QLmh5cGVyYm9saWNTaW5lID0gUC5zaW5oID0gZnVuY3Rpb24gKCkge1xyXG4gIHZhciBrLCBwciwgcm0sIGxlbixcclxuICAgIHggPSB0aGlzLFxyXG4gICAgQ3RvciA9IHguY29uc3RydWN0b3I7XHJcblxyXG4gIGlmICgheC5pc0Zpbml0ZSgpIHx8IHguaXNaZXJvKCkpIHJldHVybiBuZXcgQ3Rvcih4KTtcclxuXHJcbiAgcHIgPSBDdG9yLnByZWNpc2lvbjtcclxuICBybSA9IEN0b3Iucm91bmRpbmc7XHJcbiAgQ3Rvci5wcmVjaXNpb24gPSBwciArIE1hdGgubWF4KHguZSwgeC5zZCgpKSArIDQ7XHJcbiAgQ3Rvci5yb3VuZGluZyA9IDE7XHJcbiAgbGVuID0geC5kLmxlbmd0aDtcclxuXHJcbiAgaWYgKGxlbiA8IDMpIHtcclxuICAgIHggPSB0YXlsb3JTZXJpZXMoQ3RvciwgMiwgeCwgeCwgdHJ1ZSk7XHJcbiAgfSBlbHNlIHtcclxuXHJcbiAgICAvLyBBbHRlcm5hdGl2ZSBhcmd1bWVudCByZWR1Y3Rpb246IHNpbmgoM3gpID0gc2luaCh4KSgzICsgNHNpbmheMih4KSlcclxuICAgIC8vIGkuZS4gc2luaCh4KSA9IHNpbmgoeC8zKSgzICsgNHNpbmheMih4LzMpKVxyXG4gICAgLy8gMyBtdWx0aXBsaWNhdGlvbnMgYW5kIDEgYWRkaXRpb25cclxuXHJcbiAgICAvLyBBcmd1bWVudCByZWR1Y3Rpb246IHNpbmgoNXgpID0gc2luaCh4KSg1ICsgc2luaF4yKHgpKDIwICsgMTZzaW5oXjIoeCkpKVxyXG4gICAgLy8gaS5lLiBzaW5oKHgpID0gc2luaCh4LzUpKDUgKyBzaW5oXjIoeC81KSgyMCArIDE2c2luaF4yKHgvNSkpKVxyXG4gICAgLy8gNCBtdWx0aXBsaWNhdGlvbnMgYW5kIDIgYWRkaXRpb25zXHJcblxyXG4gICAgLy8gRXN0aW1hdGUgdGhlIG9wdGltdW0gbnVtYmVyIG9mIHRpbWVzIHRvIHVzZSB0aGUgYXJndW1lbnQgcmVkdWN0aW9uLlxyXG4gICAgayA9IDEuNCAqIE1hdGguc3FydChsZW4pO1xyXG4gICAgayA9IGsgPiAxNiA/IDE2IDogayB8IDA7XHJcblxyXG4gICAgeCA9IHgudGltZXMoMSAvIHRpbnlQb3coNSwgaykpO1xyXG4gICAgeCA9IHRheWxvclNlcmllcyhDdG9yLCAyLCB4LCB4LCB0cnVlKTtcclxuXHJcbiAgICAvLyBSZXZlcnNlIGFyZ3VtZW50IHJlZHVjdGlvblxyXG4gICAgdmFyIHNpbmgyX3gsXHJcbiAgICAgIGQ1ID0gbmV3IEN0b3IoNSksXHJcbiAgICAgIGQxNiA9IG5ldyBDdG9yKDE2KSxcclxuICAgICAgZDIwID0gbmV3IEN0b3IoMjApO1xyXG4gICAgZm9yICg7IGstLTspIHtcclxuICAgICAgc2luaDJfeCA9IHgudGltZXMoeCk7XHJcbiAgICAgIHggPSB4LnRpbWVzKGQ1LnBsdXMoc2luaDJfeC50aW1lcyhkMTYudGltZXMoc2luaDJfeCkucGx1cyhkMjApKSkpO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgQ3Rvci5wcmVjaXNpb24gPSBwcjtcclxuICBDdG9yLnJvdW5kaW5nID0gcm07XHJcblxyXG4gIHJldHVybiBmaW5hbGlzZSh4LCBwciwgcm0sIHRydWUpO1xyXG59O1xyXG5cclxuXHJcbi8qXHJcbiAqIFJldHVybiBhIG5ldyBEZWNpbWFsIHdob3NlIHZhbHVlIGlzIHRoZSBoeXBlcmJvbGljIHRhbmdlbnQgb2YgdGhlIHZhbHVlIGluIHJhZGlhbnMgb2YgdGhpc1xyXG4gKiBEZWNpbWFsLlxyXG4gKlxyXG4gKiBEb21haW46IFstSW5maW5pdHksIEluZmluaXR5XVxyXG4gKiBSYW5nZTogWy0xLCAxXVxyXG4gKlxyXG4gKiB0YW5oKHgpID0gc2luaCh4KSAvIGNvc2goeClcclxuICpcclxuICogdGFuaCgwKSAgICAgICAgID0gMFxyXG4gKiB0YW5oKC0wKSAgICAgICAgPSAtMFxyXG4gKiB0YW5oKEluZmluaXR5KSAgPSAxXHJcbiAqIHRhbmgoLUluZmluaXR5KSA9IC0xXHJcbiAqIHRhbmgoTmFOKSAgICAgICA9IE5hTlxyXG4gKlxyXG4gKi9cclxuUC5oeXBlcmJvbGljVGFuZ2VudCA9IFAudGFuaCA9IGZ1bmN0aW9uICgpIHtcclxuICB2YXIgcHIsIHJtLFxyXG4gICAgeCA9IHRoaXMsXHJcbiAgICBDdG9yID0geC5jb25zdHJ1Y3RvcjtcclxuXHJcbiAgaWYgKCF4LmlzRmluaXRlKCkpIHJldHVybiBuZXcgQ3Rvcih4LnMpO1xyXG4gIGlmICh4LmlzWmVybygpKSByZXR1cm4gbmV3IEN0b3IoeCk7XHJcblxyXG4gIHByID0gQ3Rvci5wcmVjaXNpb247XHJcbiAgcm0gPSBDdG9yLnJvdW5kaW5nO1xyXG4gIEN0b3IucHJlY2lzaW9uID0gcHIgKyA3O1xyXG4gIEN0b3Iucm91bmRpbmcgPSAxO1xyXG5cclxuICByZXR1cm4gZGl2aWRlKHguc2luaCgpLCB4LmNvc2goKSwgQ3Rvci5wcmVjaXNpb24gPSBwciwgQ3Rvci5yb3VuZGluZyA9IHJtKTtcclxufTtcclxuXHJcblxyXG4vKlxyXG4gKiBSZXR1cm4gYSBuZXcgRGVjaW1hbCB3aG9zZSB2YWx1ZSBpcyB0aGUgYXJjY29zaW5lIChpbnZlcnNlIGNvc2luZSkgaW4gcmFkaWFucyBvZiB0aGUgdmFsdWUgb2ZcclxuICogdGhpcyBEZWNpbWFsLlxyXG4gKlxyXG4gKiBEb21haW46IFstMSwgMV1cclxuICogUmFuZ2U6IFswLCBwaV1cclxuICpcclxuICogYWNvcyh4KSA9IHBpLzIgLSBhc2luKHgpXHJcbiAqXHJcbiAqIGFjb3MoMCkgICAgICAgPSBwaS8yXHJcbiAqIGFjb3MoLTApICAgICAgPSBwaS8yXHJcbiAqIGFjb3MoMSkgICAgICAgPSAwXHJcbiAqIGFjb3MoLTEpICAgICAgPSBwaVxyXG4gKiBhY29zKDEvMikgICAgID0gcGkvM1xyXG4gKiBhY29zKC0xLzIpICAgID0gMipwaS8zXHJcbiAqIGFjb3MofHh8ID4gMSkgPSBOYU5cclxuICogYWNvcyhOYU4pICAgICA9IE5hTlxyXG4gKlxyXG4gKi9cclxuUC5pbnZlcnNlQ29zaW5lID0gUC5hY29zID0gZnVuY3Rpb24gKCkge1xyXG4gIHZhciBoYWxmUGksXHJcbiAgICB4ID0gdGhpcyxcclxuICAgIEN0b3IgPSB4LmNvbnN0cnVjdG9yLFxyXG4gICAgayA9IHguYWJzKCkuY21wKDEpLFxyXG4gICAgcHIgPSBDdG9yLnByZWNpc2lvbixcclxuICAgIHJtID0gQ3Rvci5yb3VuZGluZztcclxuXHJcbiAgaWYgKGsgIT09IC0xKSB7XHJcbiAgICByZXR1cm4gayA9PT0gMFxyXG4gICAgICAvLyB8eHwgaXMgMVxyXG4gICAgICA/IHguaXNOZWcoKSA/IGdldFBpKEN0b3IsIHByLCBybSkgOiBuZXcgQ3RvcigwKVxyXG4gICAgICAvLyB8eHwgPiAxIG9yIHggaXMgTmFOXHJcbiAgICAgIDogbmV3IEN0b3IoTmFOKTtcclxuICB9XHJcblxyXG4gIGlmICh4LmlzWmVybygpKSByZXR1cm4gZ2V0UGkoQ3RvciwgcHIgKyA0LCBybSkudGltZXMoMC41KTtcclxuXHJcbiAgLy8gVE9ETz8gU3BlY2lhbCBjYXNlIGFjb3MoMC41KSA9IHBpLzMgYW5kIGFjb3MoLTAuNSkgPSAyKnBpLzNcclxuXHJcbiAgQ3Rvci5wcmVjaXNpb24gPSBwciArIDY7XHJcbiAgQ3Rvci5yb3VuZGluZyA9IDE7XHJcblxyXG4gIHggPSB4LmFzaW4oKTtcclxuICBoYWxmUGkgPSBnZXRQaShDdG9yLCBwciArIDQsIHJtKS50aW1lcygwLjUpO1xyXG5cclxuICBDdG9yLnByZWNpc2lvbiA9IHByO1xyXG4gIEN0b3Iucm91bmRpbmcgPSBybTtcclxuXHJcbiAgcmV0dXJuIGhhbGZQaS5taW51cyh4KTtcclxufTtcclxuXHJcblxyXG4vKlxyXG4gKiBSZXR1cm4gYSBuZXcgRGVjaW1hbCB3aG9zZSB2YWx1ZSBpcyB0aGUgaW52ZXJzZSBvZiB0aGUgaHlwZXJib2xpYyBjb3NpbmUgaW4gcmFkaWFucyBvZiB0aGVcclxuICogdmFsdWUgb2YgdGhpcyBEZWNpbWFsLlxyXG4gKlxyXG4gKiBEb21haW46IFsxLCBJbmZpbml0eV1cclxuICogUmFuZ2U6IFswLCBJbmZpbml0eV1cclxuICpcclxuICogYWNvc2goeCkgPSBsbih4ICsgc3FydCh4XjIgLSAxKSlcclxuICpcclxuICogYWNvc2goeCA8IDEpICAgICA9IE5hTlxyXG4gKiBhY29zaChOYU4pICAgICAgID0gTmFOXHJcbiAqIGFjb3NoKEluZmluaXR5KSAgPSBJbmZpbml0eVxyXG4gKiBhY29zaCgtSW5maW5pdHkpID0gTmFOXHJcbiAqIGFjb3NoKDApICAgICAgICAgPSBOYU5cclxuICogYWNvc2goLTApICAgICAgICA9IE5hTlxyXG4gKiBhY29zaCgxKSAgICAgICAgID0gMFxyXG4gKiBhY29zaCgtMSkgICAgICAgID0gTmFOXHJcbiAqXHJcbiAqL1xyXG5QLmludmVyc2VIeXBlcmJvbGljQ29zaW5lID0gUC5hY29zaCA9IGZ1bmN0aW9uICgpIHtcclxuICB2YXIgcHIsIHJtLFxyXG4gICAgeCA9IHRoaXMsXHJcbiAgICBDdG9yID0geC5jb25zdHJ1Y3RvcjtcclxuXHJcbiAgaWYgKHgubHRlKDEpKSByZXR1cm4gbmV3IEN0b3IoeC5lcSgxKSA/IDAgOiBOYU4pO1xyXG4gIGlmICgheC5pc0Zpbml0ZSgpKSByZXR1cm4gbmV3IEN0b3IoeCk7XHJcblxyXG4gIHByID0gQ3Rvci5wcmVjaXNpb247XHJcbiAgcm0gPSBDdG9yLnJvdW5kaW5nO1xyXG4gIEN0b3IucHJlY2lzaW9uID0gcHIgKyBNYXRoLm1heChNYXRoLmFicyh4LmUpLCB4LnNkKCkpICsgNDtcclxuICBDdG9yLnJvdW5kaW5nID0gMTtcclxuICBleHRlcm5hbCA9IGZhbHNlO1xyXG5cclxuICB4ID0geC50aW1lcyh4KS5taW51cygxKS5zcXJ0KCkucGx1cyh4KTtcclxuXHJcbiAgZXh0ZXJuYWwgPSB0cnVlO1xyXG4gIEN0b3IucHJlY2lzaW9uID0gcHI7XHJcbiAgQ3Rvci5yb3VuZGluZyA9IHJtO1xyXG5cclxuICByZXR1cm4geC5sbigpO1xyXG59O1xyXG5cclxuXHJcbi8qXHJcbiAqIFJldHVybiBhIG5ldyBEZWNpbWFsIHdob3NlIHZhbHVlIGlzIHRoZSBpbnZlcnNlIG9mIHRoZSBoeXBlcmJvbGljIHNpbmUgaW4gcmFkaWFucyBvZiB0aGUgdmFsdWVcclxuICogb2YgdGhpcyBEZWNpbWFsLlxyXG4gKlxyXG4gKiBEb21haW46IFstSW5maW5pdHksIEluZmluaXR5XVxyXG4gKiBSYW5nZTogWy1JbmZpbml0eSwgSW5maW5pdHldXHJcbiAqXHJcbiAqIGFzaW5oKHgpID0gbG4oeCArIHNxcnQoeF4yICsgMSkpXHJcbiAqXHJcbiAqIGFzaW5oKE5hTikgICAgICAgPSBOYU5cclxuICogYXNpbmgoSW5maW5pdHkpICA9IEluZmluaXR5XHJcbiAqIGFzaW5oKC1JbmZpbml0eSkgPSAtSW5maW5pdHlcclxuICogYXNpbmgoMCkgICAgICAgICA9IDBcclxuICogYXNpbmgoLTApICAgICAgICA9IC0wXHJcbiAqXHJcbiAqL1xyXG5QLmludmVyc2VIeXBlcmJvbGljU2luZSA9IFAuYXNpbmggPSBmdW5jdGlvbiAoKSB7XHJcbiAgdmFyIHByLCBybSxcclxuICAgIHggPSB0aGlzLFxyXG4gICAgQ3RvciA9IHguY29uc3RydWN0b3I7XHJcblxyXG4gIGlmICgheC5pc0Zpbml0ZSgpIHx8IHguaXNaZXJvKCkpIHJldHVybiBuZXcgQ3Rvcih4KTtcclxuXHJcbiAgcHIgPSBDdG9yLnByZWNpc2lvbjtcclxuICBybSA9IEN0b3Iucm91bmRpbmc7XHJcbiAgQ3Rvci5wcmVjaXNpb24gPSBwciArIDIgKiBNYXRoLm1heChNYXRoLmFicyh4LmUpLCB4LnNkKCkpICsgNjtcclxuICBDdG9yLnJvdW5kaW5nID0gMTtcclxuICBleHRlcm5hbCA9IGZhbHNlO1xyXG5cclxuICB4ID0geC50aW1lcyh4KS5wbHVzKDEpLnNxcnQoKS5wbHVzKHgpO1xyXG5cclxuICBleHRlcm5hbCA9IHRydWU7XHJcbiAgQ3Rvci5wcmVjaXNpb24gPSBwcjtcclxuICBDdG9yLnJvdW5kaW5nID0gcm07XHJcblxyXG4gIHJldHVybiB4LmxuKCk7XHJcbn07XHJcblxyXG5cclxuLypcclxuICogUmV0dXJuIGEgbmV3IERlY2ltYWwgd2hvc2UgdmFsdWUgaXMgdGhlIGludmVyc2Ugb2YgdGhlIGh5cGVyYm9saWMgdGFuZ2VudCBpbiByYWRpYW5zIG9mIHRoZVxyXG4gKiB2YWx1ZSBvZiB0aGlzIERlY2ltYWwuXHJcbiAqXHJcbiAqIERvbWFpbjogWy0xLCAxXVxyXG4gKiBSYW5nZTogWy1JbmZpbml0eSwgSW5maW5pdHldXHJcbiAqXHJcbiAqIGF0YW5oKHgpID0gMC41ICogbG4oKDEgKyB4KSAvICgxIC0geCkpXHJcbiAqXHJcbiAqIGF0YW5oKHx4fCA+IDEpICAgPSBOYU5cclxuICogYXRhbmgoTmFOKSAgICAgICA9IE5hTlxyXG4gKiBhdGFuaChJbmZpbml0eSkgID0gTmFOXHJcbiAqIGF0YW5oKC1JbmZpbml0eSkgPSBOYU5cclxuICogYXRhbmgoMCkgICAgICAgICA9IDBcclxuICogYXRhbmgoLTApICAgICAgICA9IC0wXHJcbiAqIGF0YW5oKDEpICAgICAgICAgPSBJbmZpbml0eVxyXG4gKiBhdGFuaCgtMSkgICAgICAgID0gLUluZmluaXR5XHJcbiAqXHJcbiAqL1xyXG5QLmludmVyc2VIeXBlcmJvbGljVGFuZ2VudCA9IFAuYXRhbmggPSBmdW5jdGlvbiAoKSB7XHJcbiAgdmFyIHByLCBybSwgd3ByLCB4c2QsXHJcbiAgICB4ID0gdGhpcyxcclxuICAgIEN0b3IgPSB4LmNvbnN0cnVjdG9yO1xyXG5cclxuICBpZiAoIXguaXNGaW5pdGUoKSkgcmV0dXJuIG5ldyBDdG9yKE5hTik7XHJcbiAgaWYgKHguZSA+PSAwKSByZXR1cm4gbmV3IEN0b3IoeC5hYnMoKS5lcSgxKSA/IHgucyAvIDAgOiB4LmlzWmVybygpID8geCA6IE5hTik7XHJcblxyXG4gIHByID0gQ3Rvci5wcmVjaXNpb247XHJcbiAgcm0gPSBDdG9yLnJvdW5kaW5nO1xyXG4gIHhzZCA9IHguc2QoKTtcclxuXHJcbiAgaWYgKE1hdGgubWF4KHhzZCwgcHIpIDwgMiAqIC14LmUgLSAxKSByZXR1cm4gZmluYWxpc2UobmV3IEN0b3IoeCksIHByLCBybSwgdHJ1ZSk7XHJcblxyXG4gIEN0b3IucHJlY2lzaW9uID0gd3ByID0geHNkIC0geC5lO1xyXG5cclxuICB4ID0gZGl2aWRlKHgucGx1cygxKSwgbmV3IEN0b3IoMSkubWludXMoeCksIHdwciArIHByLCAxKTtcclxuXHJcbiAgQ3Rvci5wcmVjaXNpb24gPSBwciArIDQ7XHJcbiAgQ3Rvci5yb3VuZGluZyA9IDE7XHJcblxyXG4gIHggPSB4LmxuKCk7XHJcblxyXG4gIEN0b3IucHJlY2lzaW9uID0gcHI7XHJcbiAgQ3Rvci5yb3VuZGluZyA9IHJtO1xyXG5cclxuICByZXR1cm4geC50aW1lcygwLjUpO1xyXG59O1xyXG5cclxuXHJcbi8qXHJcbiAqIFJldHVybiBhIG5ldyBEZWNpbWFsIHdob3NlIHZhbHVlIGlzIHRoZSBhcmNzaW5lIChpbnZlcnNlIHNpbmUpIGluIHJhZGlhbnMgb2YgdGhlIHZhbHVlIG9mIHRoaXNcclxuICogRGVjaW1hbC5cclxuICpcclxuICogRG9tYWluOiBbLUluZmluaXR5LCBJbmZpbml0eV1cclxuICogUmFuZ2U6IFstcGkvMiwgcGkvMl1cclxuICpcclxuICogYXNpbih4KSA9IDIqYXRhbih4LygxICsgc3FydCgxIC0geF4yKSkpXHJcbiAqXHJcbiAqIGFzaW4oMCkgICAgICAgPSAwXHJcbiAqIGFzaW4oLTApICAgICAgPSAtMFxyXG4gKiBhc2luKDEvMikgICAgID0gcGkvNlxyXG4gKiBhc2luKC0xLzIpICAgID0gLXBpLzZcclxuICogYXNpbigxKSAgICAgICA9IHBpLzJcclxuICogYXNpbigtMSkgICAgICA9IC1waS8yXHJcbiAqIGFzaW4ofHh8ID4gMSkgPSBOYU5cclxuICogYXNpbihOYU4pICAgICA9IE5hTlxyXG4gKlxyXG4gKiBUT0RPPyBDb21wYXJlIHBlcmZvcm1hbmNlIG9mIFRheWxvciBzZXJpZXMuXHJcbiAqXHJcbiAqL1xyXG5QLmludmVyc2VTaW5lID0gUC5hc2luID0gZnVuY3Rpb24gKCkge1xyXG4gIHZhciBoYWxmUGksIGssXHJcbiAgICBwciwgcm0sXHJcbiAgICB4ID0gdGhpcyxcclxuICAgIEN0b3IgPSB4LmNvbnN0cnVjdG9yO1xyXG5cclxuICBpZiAoeC5pc1plcm8oKSkgcmV0dXJuIG5ldyBDdG9yKHgpO1xyXG5cclxuICBrID0geC5hYnMoKS5jbXAoMSk7XHJcbiAgcHIgPSBDdG9yLnByZWNpc2lvbjtcclxuICBybSA9IEN0b3Iucm91bmRpbmc7XHJcblxyXG4gIGlmIChrICE9PSAtMSkge1xyXG5cclxuICAgIC8vIHx4fCBpcyAxXHJcbiAgICBpZiAoayA9PT0gMCkge1xyXG4gICAgICBoYWxmUGkgPSBnZXRQaShDdG9yLCBwciArIDQsIHJtKS50aW1lcygwLjUpO1xyXG4gICAgICBoYWxmUGkucyA9IHgucztcclxuICAgICAgcmV0dXJuIGhhbGZQaTtcclxuICAgIH1cclxuXHJcbiAgICAvLyB8eHwgPiAxIG9yIHggaXMgTmFOXHJcbiAgICByZXR1cm4gbmV3IEN0b3IoTmFOKTtcclxuICB9XHJcblxyXG4gIC8vIFRPRE8/IFNwZWNpYWwgY2FzZSBhc2luKDEvMikgPSBwaS82IGFuZCBhc2luKC0xLzIpID0gLXBpLzZcclxuXHJcbiAgQ3Rvci5wcmVjaXNpb24gPSBwciArIDY7XHJcbiAgQ3Rvci5yb3VuZGluZyA9IDE7XHJcblxyXG4gIHggPSB4LmRpdihuZXcgQ3RvcigxKS5taW51cyh4LnRpbWVzKHgpKS5zcXJ0KCkucGx1cygxKSkuYXRhbigpO1xyXG5cclxuICBDdG9yLnByZWNpc2lvbiA9IHByO1xyXG4gIEN0b3Iucm91bmRpbmcgPSBybTtcclxuXHJcbiAgcmV0dXJuIHgudGltZXMoMik7XHJcbn07XHJcblxyXG5cclxuLypcclxuICogUmV0dXJuIGEgbmV3IERlY2ltYWwgd2hvc2UgdmFsdWUgaXMgdGhlIGFyY3RhbmdlbnQgKGludmVyc2UgdGFuZ2VudCkgaW4gcmFkaWFucyBvZiB0aGUgdmFsdWVcclxuICogb2YgdGhpcyBEZWNpbWFsLlxyXG4gKlxyXG4gKiBEb21haW46IFstSW5maW5pdHksIEluZmluaXR5XVxyXG4gKiBSYW5nZTogWy1waS8yLCBwaS8yXVxyXG4gKlxyXG4gKiBhdGFuKHgpID0geCAtIHheMy8zICsgeF41LzUgLSB4XjcvNyArIC4uLlxyXG4gKlxyXG4gKiBhdGFuKDApICAgICAgICAgPSAwXHJcbiAqIGF0YW4oLTApICAgICAgICA9IC0wXHJcbiAqIGF0YW4oMSkgICAgICAgICA9IHBpLzRcclxuICogYXRhbigtMSkgICAgICAgID0gLXBpLzRcclxuICogYXRhbihJbmZpbml0eSkgID0gcGkvMlxyXG4gKiBhdGFuKC1JbmZpbml0eSkgPSAtcGkvMlxyXG4gKiBhdGFuKE5hTikgICAgICAgPSBOYU5cclxuICpcclxuICovXHJcblAuaW52ZXJzZVRhbmdlbnQgPSBQLmF0YW4gPSBmdW5jdGlvbiAoKSB7XHJcbiAgdmFyIGksIGosIGssIG4sIHB4LCB0LCByLCB3cHIsIHgyLFxyXG4gICAgeCA9IHRoaXMsXHJcbiAgICBDdG9yID0geC5jb25zdHJ1Y3RvcixcclxuICAgIHByID0gQ3Rvci5wcmVjaXNpb24sXHJcbiAgICBybSA9IEN0b3Iucm91bmRpbmc7XHJcblxyXG4gIGlmICgheC5pc0Zpbml0ZSgpKSB7XHJcbiAgICBpZiAoIXgucykgcmV0dXJuIG5ldyBDdG9yKE5hTik7XHJcbiAgICBpZiAocHIgKyA0IDw9IFBJX1BSRUNJU0lPTikge1xyXG4gICAgICByID0gZ2V0UGkoQ3RvciwgcHIgKyA0LCBybSkudGltZXMoMC41KTtcclxuICAgICAgci5zID0geC5zO1xyXG4gICAgICByZXR1cm4gcjtcclxuICAgIH1cclxuICB9IGVsc2UgaWYgKHguaXNaZXJvKCkpIHtcclxuICAgIHJldHVybiBuZXcgQ3Rvcih4KTtcclxuICB9IGVsc2UgaWYgKHguYWJzKCkuZXEoMSkgJiYgcHIgKyA0IDw9IFBJX1BSRUNJU0lPTikge1xyXG4gICAgciA9IGdldFBpKEN0b3IsIHByICsgNCwgcm0pLnRpbWVzKDAuMjUpO1xyXG4gICAgci5zID0geC5zO1xyXG4gICAgcmV0dXJuIHI7XHJcbiAgfVxyXG5cclxuICBDdG9yLnByZWNpc2lvbiA9IHdwciA9IHByICsgMTA7XHJcbiAgQ3Rvci5yb3VuZGluZyA9IDE7XHJcblxyXG4gIC8vIFRPRE8/IGlmICh4ID49IDEgJiYgcHIgPD0gUElfUFJFQ0lTSU9OKSBhdGFuKHgpID0gaGFsZlBpICogeC5zIC0gYXRhbigxIC8geCk7XHJcblxyXG4gIC8vIEFyZ3VtZW50IHJlZHVjdGlvblxyXG4gIC8vIEVuc3VyZSB8eHwgPCAwLjQyXHJcbiAgLy8gYXRhbih4KSA9IDIgKiBhdGFuKHggLyAoMSArIHNxcnQoMSArIHheMikpKVxyXG5cclxuICBrID0gTWF0aC5taW4oMjgsIHdwciAvIExPR19CQVNFICsgMiB8IDApO1xyXG5cclxuICBmb3IgKGkgPSBrOyBpOyAtLWkpIHggPSB4LmRpdih4LnRpbWVzKHgpLnBsdXMoMSkuc3FydCgpLnBsdXMoMSkpO1xyXG5cclxuICBleHRlcm5hbCA9IGZhbHNlO1xyXG5cclxuICBqID0gTWF0aC5jZWlsKHdwciAvIExPR19CQVNFKTtcclxuICBuID0gMTtcclxuICB4MiA9IHgudGltZXMoeCk7XHJcbiAgciA9IG5ldyBDdG9yKHgpO1xyXG4gIHB4ID0geDtcclxuXHJcbiAgLy8gYXRhbih4KSA9IHggLSB4XjMvMyArIHheNS81IC0geF43LzcgKyAuLi5cclxuICBmb3IgKDsgaSAhPT0gLTE7KSB7XHJcbiAgICBweCA9IHB4LnRpbWVzKHgyKTtcclxuICAgIHQgPSByLm1pbnVzKHB4LmRpdihuICs9IDIpKTtcclxuXHJcbiAgICBweCA9IHB4LnRpbWVzKHgyKTtcclxuICAgIHIgPSB0LnBsdXMocHguZGl2KG4gKz0gMikpO1xyXG5cclxuICAgIGlmIChyLmRbal0gIT09IHZvaWQgMCkgZm9yIChpID0gajsgci5kW2ldID09PSB0LmRbaV0gJiYgaS0tOyk7XHJcbiAgfVxyXG5cclxuICBpZiAoaykgciA9IHIudGltZXMoMiA8PCAoayAtIDEpKTtcclxuXHJcbiAgZXh0ZXJuYWwgPSB0cnVlO1xyXG5cclxuICByZXR1cm4gZmluYWxpc2UociwgQ3Rvci5wcmVjaXNpb24gPSBwciwgQ3Rvci5yb3VuZGluZyA9IHJtLCB0cnVlKTtcclxufTtcclxuXHJcblxyXG4vKlxyXG4gKiBSZXR1cm4gdHJ1ZSBpZiB0aGUgdmFsdWUgb2YgdGhpcyBEZWNpbWFsIGlzIGEgZmluaXRlIG51bWJlciwgb3RoZXJ3aXNlIHJldHVybiBmYWxzZS5cclxuICpcclxuICovXHJcblAuaXNGaW5pdGUgPSBmdW5jdGlvbiAoKSB7XHJcbiAgcmV0dXJuICEhdGhpcy5kO1xyXG59O1xyXG5cclxuXHJcbi8qXHJcbiAqIFJldHVybiB0cnVlIGlmIHRoZSB2YWx1ZSBvZiB0aGlzIERlY2ltYWwgaXMgYW4gaW50ZWdlciwgb3RoZXJ3aXNlIHJldHVybiBmYWxzZS5cclxuICpcclxuICovXHJcblAuaXNJbnRlZ2VyID0gUC5pc0ludCA9IGZ1bmN0aW9uICgpIHtcclxuICByZXR1cm4gISF0aGlzLmQgJiYgbWF0aGZsb29yKHRoaXMuZSAvIExPR19CQVNFKSA+IHRoaXMuZC5sZW5ndGggLSAyO1xyXG59O1xyXG5cclxuXHJcbi8qXHJcbiAqIFJldHVybiB0cnVlIGlmIHRoZSB2YWx1ZSBvZiB0aGlzIERlY2ltYWwgaXMgTmFOLCBvdGhlcndpc2UgcmV0dXJuIGZhbHNlLlxyXG4gKlxyXG4gKi9cclxuUC5pc05hTiA9IGZ1bmN0aW9uICgpIHtcclxuICByZXR1cm4gIXRoaXMucztcclxufTtcclxuXHJcblxyXG4vKlxyXG4gKiBSZXR1cm4gdHJ1ZSBpZiB0aGUgdmFsdWUgb2YgdGhpcyBEZWNpbWFsIGlzIG5lZ2F0aXZlLCBvdGhlcndpc2UgcmV0dXJuIGZhbHNlLlxyXG4gKlxyXG4gKi9cclxuUC5pc05lZ2F0aXZlID0gUC5pc05lZyA9IGZ1bmN0aW9uICgpIHtcclxuICByZXR1cm4gdGhpcy5zIDwgMDtcclxufTtcclxuXHJcblxyXG4vKlxyXG4gKiBSZXR1cm4gdHJ1ZSBpZiB0aGUgdmFsdWUgb2YgdGhpcyBEZWNpbWFsIGlzIHBvc2l0aXZlLCBvdGhlcndpc2UgcmV0dXJuIGZhbHNlLlxyXG4gKlxyXG4gKi9cclxuUC5pc1Bvc2l0aXZlID0gUC5pc1BvcyA9IGZ1bmN0aW9uICgpIHtcclxuICByZXR1cm4gdGhpcy5zID4gMDtcclxufTtcclxuXHJcblxyXG4vKlxyXG4gKiBSZXR1cm4gdHJ1ZSBpZiB0aGUgdmFsdWUgb2YgdGhpcyBEZWNpbWFsIGlzIDAgb3IgLTAsIG90aGVyd2lzZSByZXR1cm4gZmFsc2UuXHJcbiAqXHJcbiAqL1xyXG5QLmlzWmVybyA9IGZ1bmN0aW9uICgpIHtcclxuICByZXR1cm4gISF0aGlzLmQgJiYgdGhpcy5kWzBdID09PSAwO1xyXG59O1xyXG5cclxuXHJcbi8qXHJcbiAqIFJldHVybiB0cnVlIGlmIHRoZSB2YWx1ZSBvZiB0aGlzIERlY2ltYWwgaXMgbGVzcyB0aGFuIGB5YCwgb3RoZXJ3aXNlIHJldHVybiBmYWxzZS5cclxuICpcclxuICovXHJcblAubGVzc1RoYW4gPSBQLmx0ID0gZnVuY3Rpb24gKHkpIHtcclxuICByZXR1cm4gdGhpcy5jbXAoeSkgPCAwO1xyXG59O1xyXG5cclxuXHJcbi8qXHJcbiAqIFJldHVybiB0cnVlIGlmIHRoZSB2YWx1ZSBvZiB0aGlzIERlY2ltYWwgaXMgbGVzcyB0aGFuIG9yIGVxdWFsIHRvIGB5YCwgb3RoZXJ3aXNlIHJldHVybiBmYWxzZS5cclxuICpcclxuICovXHJcblAubGVzc1RoYW5PckVxdWFsVG8gPSBQLmx0ZSA9IGZ1bmN0aW9uICh5KSB7XHJcbiAgcmV0dXJuIHRoaXMuY21wKHkpIDwgMTtcclxufTtcclxuXHJcblxyXG4vKlxyXG4gKiBSZXR1cm4gdGhlIGxvZ2FyaXRobSBvZiB0aGUgdmFsdWUgb2YgdGhpcyBEZWNpbWFsIHRvIHRoZSBzcGVjaWZpZWQgYmFzZSwgcm91bmRlZCB0byBgcHJlY2lzaW9uYFxyXG4gKiBzaWduaWZpY2FudCBkaWdpdHMgdXNpbmcgcm91bmRpbmcgbW9kZSBgcm91bmRpbmdgLlxyXG4gKlxyXG4gKiBJZiBubyBiYXNlIGlzIHNwZWNpZmllZCwgcmV0dXJuIGxvZ1sxMF0oYXJnKS5cclxuICpcclxuICogbG9nW2Jhc2VdKGFyZykgPSBsbihhcmcpIC8gbG4oYmFzZSlcclxuICpcclxuICogVGhlIHJlc3VsdCB3aWxsIGFsd2F5cyBiZSBjb3JyZWN0bHkgcm91bmRlZCBpZiB0aGUgYmFzZSBvZiB0aGUgbG9nIGlzIDEwLCBhbmQgJ2FsbW9zdCBhbHdheXMnXHJcbiAqIG90aGVyd2lzZTpcclxuICpcclxuICogRGVwZW5kaW5nIG9uIHRoZSByb3VuZGluZyBtb2RlLCB0aGUgcmVzdWx0IG1heSBiZSBpbmNvcnJlY3RseSByb3VuZGVkIGlmIHRoZSBmaXJzdCBmaWZ0ZWVuXHJcbiAqIHJvdW5kaW5nIGRpZ2l0cyBhcmUgWzQ5XTk5OTk5OTk5OTk5OTk5IG9yIFs1MF0wMDAwMDAwMDAwMDAwMC4gSW4gdGhhdCBjYXNlLCB0aGUgbWF4aW11bSBlcnJvclxyXG4gKiBiZXR3ZWVuIHRoZSByZXN1bHQgYW5kIHRoZSBjb3JyZWN0bHkgcm91bmRlZCByZXN1bHQgd2lsbCBiZSBvbmUgdWxwICh1bml0IGluIHRoZSBsYXN0IHBsYWNlKS5cclxuICpcclxuICogbG9nWy1iXShhKSAgICAgICA9IE5hTlxyXG4gKiBsb2dbMF0oYSkgICAgICAgID0gTmFOXHJcbiAqIGxvZ1sxXShhKSAgICAgICAgPSBOYU5cclxuICogbG9nW05hTl0oYSkgICAgICA9IE5hTlxyXG4gKiBsb2dbSW5maW5pdHldKGEpID0gTmFOXHJcbiAqIGxvZ1tiXSgwKSAgICAgICAgPSAtSW5maW5pdHlcclxuICogbG9nW2JdKC0wKSAgICAgICA9IC1JbmZpbml0eVxyXG4gKiBsb2dbYl0oLWEpICAgICAgID0gTmFOXHJcbiAqIGxvZ1tiXSgxKSAgICAgICAgPSAwXHJcbiAqIGxvZ1tiXShJbmZpbml0eSkgPSBJbmZpbml0eVxyXG4gKiBsb2dbYl0oTmFOKSAgICAgID0gTmFOXHJcbiAqXHJcbiAqIFtiYXNlXSB7bnVtYmVyfHN0cmluZ3xEZWNpbWFsfSBUaGUgYmFzZSBvZiB0aGUgbG9nYXJpdGhtLlxyXG4gKlxyXG4gKi9cclxuUC5sb2dhcml0aG0gPSBQLmxvZyA9IGZ1bmN0aW9uIChiYXNlKSB7XHJcbiAgdmFyIGlzQmFzZTEwLCBkLCBkZW5vbWluYXRvciwgaywgaW5mLCBudW0sIHNkLCByLFxyXG4gICAgYXJnID0gdGhpcyxcclxuICAgIEN0b3IgPSBhcmcuY29uc3RydWN0b3IsXHJcbiAgICBwciA9IEN0b3IucHJlY2lzaW9uLFxyXG4gICAgcm0gPSBDdG9yLnJvdW5kaW5nLFxyXG4gICAgZ3VhcmQgPSA1O1xyXG5cclxuICAvLyBEZWZhdWx0IGJhc2UgaXMgMTAuXHJcbiAgaWYgKGJhc2UgPT0gbnVsbCkge1xyXG4gICAgYmFzZSA9IG5ldyBDdG9yKDEwKTtcclxuICAgIGlzQmFzZTEwID0gdHJ1ZTtcclxuICB9IGVsc2Uge1xyXG4gICAgYmFzZSA9IG5ldyBDdG9yKGJhc2UpO1xyXG4gICAgZCA9IGJhc2UuZDtcclxuXHJcbiAgICAvLyBSZXR1cm4gTmFOIGlmIGJhc2UgaXMgbmVnYXRpdmUsIG9yIG5vbi1maW5pdGUsIG9yIGlzIDAgb3IgMS5cclxuICAgIGlmIChiYXNlLnMgPCAwIHx8ICFkIHx8ICFkWzBdIHx8IGJhc2UuZXEoMSkpIHJldHVybiBuZXcgQ3RvcihOYU4pO1xyXG5cclxuICAgIGlzQmFzZTEwID0gYmFzZS5lcSgxMCk7XHJcbiAgfVxyXG5cclxuICBkID0gYXJnLmQ7XHJcblxyXG4gIC8vIElzIGFyZyBuZWdhdGl2ZSwgbm9uLWZpbml0ZSwgMCBvciAxP1xyXG4gIGlmIChhcmcucyA8IDAgfHwgIWQgfHwgIWRbMF0gfHwgYXJnLmVxKDEpKSB7XHJcbiAgICByZXR1cm4gbmV3IEN0b3IoZCAmJiAhZFswXSA/IC0xIC8gMCA6IGFyZy5zICE9IDEgPyBOYU4gOiBkID8gMCA6IDEgLyAwKTtcclxuICB9XHJcblxyXG4gIC8vIFRoZSByZXN1bHQgd2lsbCBoYXZlIGEgbm9uLXRlcm1pbmF0aW5nIGRlY2ltYWwgZXhwYW5zaW9uIGlmIGJhc2UgaXMgMTAgYW5kIGFyZyBpcyBub3QgYW5cclxuICAvLyBpbnRlZ2VyIHBvd2VyIG9mIDEwLlxyXG4gIGlmIChpc0Jhc2UxMCkge1xyXG4gICAgaWYgKGQubGVuZ3RoID4gMSkge1xyXG4gICAgICBpbmYgPSB0cnVlO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgZm9yIChrID0gZFswXTsgayAlIDEwID09PSAwOykgayAvPSAxMDtcclxuICAgICAgaW5mID0gayAhPT0gMTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIGV4dGVybmFsID0gZmFsc2U7XHJcbiAgc2QgPSBwciArIGd1YXJkO1xyXG4gIG51bSA9IG5hdHVyYWxMb2dhcml0aG0oYXJnLCBzZCk7XHJcbiAgZGVub21pbmF0b3IgPSBpc0Jhc2UxMCA/IGdldExuMTAoQ3Rvciwgc2QgKyAxMCkgOiBuYXR1cmFsTG9nYXJpdGhtKGJhc2UsIHNkKTtcclxuXHJcbiAgLy8gVGhlIHJlc3VsdCB3aWxsIGhhdmUgNSByb3VuZGluZyBkaWdpdHMuXHJcbiAgciA9IGRpdmlkZShudW0sIGRlbm9taW5hdG9yLCBzZCwgMSk7XHJcblxyXG4gIC8vIElmIGF0IGEgcm91bmRpbmcgYm91bmRhcnksIGkuZS4gdGhlIHJlc3VsdCdzIHJvdW5kaW5nIGRpZ2l0cyBhcmUgWzQ5XTk5OTkgb3IgWzUwXTAwMDAsXHJcbiAgLy8gY2FsY3VsYXRlIDEwIGZ1cnRoZXIgZGlnaXRzLlxyXG4gIC8vXHJcbiAgLy8gSWYgdGhlIHJlc3VsdCBpcyBrbm93biB0byBoYXZlIGFuIGluZmluaXRlIGRlY2ltYWwgZXhwYW5zaW9uLCByZXBlYXQgdGhpcyB1bnRpbCBpdCBpcyBjbGVhclxyXG4gIC8vIHRoYXQgdGhlIHJlc3VsdCBpcyBhYm92ZSBvciBiZWxvdyB0aGUgYm91bmRhcnkuIE90aGVyd2lzZSwgaWYgYWZ0ZXIgY2FsY3VsYXRpbmcgdGhlIDEwXHJcbiAgLy8gZnVydGhlciBkaWdpdHMsIHRoZSBsYXN0IDE0IGFyZSBuaW5lcywgcm91bmQgdXAgYW5kIGFzc3VtZSB0aGUgcmVzdWx0IGlzIGV4YWN0LlxyXG4gIC8vIEFsc28gYXNzdW1lIHRoZSByZXN1bHQgaXMgZXhhY3QgaWYgdGhlIGxhc3QgMTQgYXJlIHplcm8uXHJcbiAgLy9cclxuICAvLyBFeGFtcGxlIG9mIGEgcmVzdWx0IHRoYXQgd2lsbCBiZSBpbmNvcnJlY3RseSByb3VuZGVkOlxyXG4gIC8vIGxvZ1sxMDQ4NTc2XSg0NTAzNTk5NjI3MzcwNTAyKSA9IDIuNjAwMDAwMDAwMDAwMDAwMDk2MTAyNzk1MTE0NDQ3NDYuLi5cclxuICAvLyBUaGUgYWJvdmUgcmVzdWx0IGNvcnJlY3RseSByb3VuZGVkIHVzaW5nIFJPVU5EX0NFSUwgdG8gMSBkZWNpbWFsIHBsYWNlIHNob3VsZCBiZSAyLjcsIGJ1dCBpdFxyXG4gIC8vIHdpbGwgYmUgZ2l2ZW4gYXMgMi42IGFzIHRoZXJlIGFyZSAxNSB6ZXJvcyBpbW1lZGlhdGVseSBhZnRlciB0aGUgcmVxdWVzdGVkIGRlY2ltYWwgcGxhY2UsIHNvXHJcbiAgLy8gdGhlIGV4YWN0IHJlc3VsdCB3b3VsZCBiZSBhc3N1bWVkIHRvIGJlIDIuNiwgd2hpY2ggcm91bmRlZCB1c2luZyBST1VORF9DRUlMIHRvIDEgZGVjaW1hbFxyXG4gIC8vIHBsYWNlIGlzIHN0aWxsIDIuNi5cclxuICBpZiAoY2hlY2tSb3VuZGluZ0RpZ2l0cyhyLmQsIGsgPSBwciwgcm0pKSB7XHJcblxyXG4gICAgZG8ge1xyXG4gICAgICBzZCArPSAxMDtcclxuICAgICAgbnVtID0gbmF0dXJhbExvZ2FyaXRobShhcmcsIHNkKTtcclxuICAgICAgZGVub21pbmF0b3IgPSBpc0Jhc2UxMCA/IGdldExuMTAoQ3Rvciwgc2QgKyAxMCkgOiBuYXR1cmFsTG9nYXJpdGhtKGJhc2UsIHNkKTtcclxuICAgICAgciA9IGRpdmlkZShudW0sIGRlbm9taW5hdG9yLCBzZCwgMSk7XHJcblxyXG4gICAgICBpZiAoIWluZikge1xyXG5cclxuICAgICAgICAvLyBDaGVjayBmb3IgMTQgbmluZXMgZnJvbSB0aGUgMm5kIHJvdW5kaW5nIGRpZ2l0LCBhcyB0aGUgZmlyc3QgbWF5IGJlIDQuXHJcbiAgICAgICAgaWYgKCtkaWdpdHNUb1N0cmluZyhyLmQpLnNsaWNlKGsgKyAxLCBrICsgMTUpICsgMSA9PSAxZTE0KSB7XHJcbiAgICAgICAgICByID0gZmluYWxpc2UociwgcHIgKyAxLCAwKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGJyZWFrO1xyXG4gICAgICB9XHJcbiAgICB9IHdoaWxlIChjaGVja1JvdW5kaW5nRGlnaXRzKHIuZCwgayArPSAxMCwgcm0pKTtcclxuICB9XHJcblxyXG4gIGV4dGVybmFsID0gdHJ1ZTtcclxuXHJcbiAgcmV0dXJuIGZpbmFsaXNlKHIsIHByLCBybSk7XHJcbn07XHJcblxyXG5cclxuLypcclxuICogUmV0dXJuIGEgbmV3IERlY2ltYWwgd2hvc2UgdmFsdWUgaXMgdGhlIG1heGltdW0gb2YgdGhlIGFyZ3VtZW50cyBhbmQgdGhlIHZhbHVlIG9mIHRoaXMgRGVjaW1hbC5cclxuICpcclxuICogYXJndW1lbnRzIHtudW1iZXJ8c3RyaW5nfERlY2ltYWx9XHJcbiAqXHJcblAubWF4ID0gZnVuY3Rpb24gKCkge1xyXG4gIEFycmF5LnByb3RvdHlwZS5wdXNoLmNhbGwoYXJndW1lbnRzLCB0aGlzKTtcclxuICByZXR1cm4gbWF4T3JNaW4odGhpcy5jb25zdHJ1Y3RvciwgYXJndW1lbnRzLCAnbHQnKTtcclxufTtcclxuICovXHJcblxyXG5cclxuLypcclxuICogUmV0dXJuIGEgbmV3IERlY2ltYWwgd2hvc2UgdmFsdWUgaXMgdGhlIG1pbmltdW0gb2YgdGhlIGFyZ3VtZW50cyBhbmQgdGhlIHZhbHVlIG9mIHRoaXMgRGVjaW1hbC5cclxuICpcclxuICogYXJndW1lbnRzIHtudW1iZXJ8c3RyaW5nfERlY2ltYWx9XHJcbiAqXHJcblAubWluID0gZnVuY3Rpb24gKCkge1xyXG4gIEFycmF5LnByb3RvdHlwZS5wdXNoLmNhbGwoYXJndW1lbnRzLCB0aGlzKTtcclxuICByZXR1cm4gbWF4T3JNaW4odGhpcy5jb25zdHJ1Y3RvciwgYXJndW1lbnRzLCAnZ3QnKTtcclxufTtcclxuICovXHJcblxyXG5cclxuLypcclxuICogIG4gLSAwID0gblxyXG4gKiAgbiAtIE4gPSBOXHJcbiAqICBuIC0gSSA9IC1JXHJcbiAqICAwIC0gbiA9IC1uXHJcbiAqICAwIC0gMCA9IDBcclxuICogIDAgLSBOID0gTlxyXG4gKiAgMCAtIEkgPSAtSVxyXG4gKiAgTiAtIG4gPSBOXHJcbiAqICBOIC0gMCA9IE5cclxuICogIE4gLSBOID0gTlxyXG4gKiAgTiAtIEkgPSBOXHJcbiAqICBJIC0gbiA9IElcclxuICogIEkgLSAwID0gSVxyXG4gKiAgSSAtIE4gPSBOXHJcbiAqICBJIC0gSSA9IE5cclxuICpcclxuICogUmV0dXJuIGEgbmV3IERlY2ltYWwgd2hvc2UgdmFsdWUgaXMgdGhlIHZhbHVlIG9mIHRoaXMgRGVjaW1hbCBtaW51cyBgeWAsIHJvdW5kZWQgdG8gYHByZWNpc2lvbmBcclxuICogc2lnbmlmaWNhbnQgZGlnaXRzIHVzaW5nIHJvdW5kaW5nIG1vZGUgYHJvdW5kaW5nYC5cclxuICpcclxuICovXHJcblAubWludXMgPSBQLnN1YiA9IGZ1bmN0aW9uICh5KSB7XHJcbiAgdmFyIGQsIGUsIGksIGosIGssIGxlbiwgcHIsIHJtLCB4ZCwgeGUsIHhMVHksIHlkLFxyXG4gICAgeCA9IHRoaXMsXHJcbiAgICBDdG9yID0geC5jb25zdHJ1Y3RvcjtcclxuXHJcbiAgeSA9IG5ldyBDdG9yKHkpO1xyXG5cclxuICAvLyBJZiBlaXRoZXIgaXMgbm90IGZpbml0ZS4uLlxyXG4gIGlmICgheC5kIHx8ICF5LmQpIHtcclxuXHJcbiAgICAvLyBSZXR1cm4gTmFOIGlmIGVpdGhlciBpcyBOYU4uXHJcbiAgICBpZiAoIXgucyB8fCAheS5zKSB5ID0gbmV3IEN0b3IoTmFOKTtcclxuXHJcbiAgICAvLyBSZXR1cm4geSBuZWdhdGVkIGlmIHggaXMgZmluaXRlIGFuZCB5IGlzIFx1MDBCMUluZmluaXR5LlxyXG4gICAgZWxzZSBpZiAoeC5kKSB5LnMgPSAteS5zO1xyXG5cclxuICAgIC8vIFJldHVybiB4IGlmIHkgaXMgZmluaXRlIGFuZCB4IGlzIFx1MDBCMUluZmluaXR5LlxyXG4gICAgLy8gUmV0dXJuIHggaWYgYm90aCBhcmUgXHUwMEIxSW5maW5pdHkgd2l0aCBkaWZmZXJlbnQgc2lnbnMuXHJcbiAgICAvLyBSZXR1cm4gTmFOIGlmIGJvdGggYXJlIFx1MDBCMUluZmluaXR5IHdpdGggdGhlIHNhbWUgc2lnbi5cclxuICAgIGVsc2UgeSA9IG5ldyBDdG9yKHkuZCB8fCB4LnMgIT09IHkucyA/IHggOiBOYU4pO1xyXG5cclxuICAgIHJldHVybiB5O1xyXG4gIH1cclxuXHJcbiAgLy8gSWYgc2lnbnMgZGlmZmVyLi4uXHJcbiAgaWYgKHgucyAhPSB5LnMpIHtcclxuICAgIHkucyA9IC15LnM7XHJcbiAgICByZXR1cm4geC5wbHVzKHkpO1xyXG4gIH1cclxuXHJcbiAgeGQgPSB4LmQ7XHJcbiAgeWQgPSB5LmQ7XHJcbiAgcHIgPSBDdG9yLnByZWNpc2lvbjtcclxuICBybSA9IEN0b3Iucm91bmRpbmc7XHJcblxyXG4gIC8vIElmIGVpdGhlciBpcyB6ZXJvLi4uXHJcbiAgaWYgKCF4ZFswXSB8fCAheWRbMF0pIHtcclxuXHJcbiAgICAvLyBSZXR1cm4geSBuZWdhdGVkIGlmIHggaXMgemVybyBhbmQgeSBpcyBub24temVyby5cclxuICAgIGlmICh5ZFswXSkgeS5zID0gLXkucztcclxuXHJcbiAgICAvLyBSZXR1cm4geCBpZiB5IGlzIHplcm8gYW5kIHggaXMgbm9uLXplcm8uXHJcbiAgICBlbHNlIGlmICh4ZFswXSkgeSA9IG5ldyBDdG9yKHgpO1xyXG5cclxuICAgIC8vIFJldHVybiB6ZXJvIGlmIGJvdGggYXJlIHplcm8uXHJcbiAgICAvLyBGcm9tIElFRUUgNzU0ICgyMDA4KSA2LjM6IDAgLSAwID0gLTAgLSAtMCA9IC0wIHdoZW4gcm91bmRpbmcgdG8gLUluZmluaXR5LlxyXG4gICAgZWxzZSByZXR1cm4gbmV3IEN0b3Iocm0gPT09IDMgPyAtMCA6IDApO1xyXG5cclxuICAgIHJldHVybiBleHRlcm5hbCA/IGZpbmFsaXNlKHksIHByLCBybSkgOiB5O1xyXG4gIH1cclxuXHJcbiAgLy8geCBhbmQgeSBhcmUgZmluaXRlLCBub24temVybyBudW1iZXJzIHdpdGggdGhlIHNhbWUgc2lnbi5cclxuXHJcbiAgLy8gQ2FsY3VsYXRlIGJhc2UgMWU3IGV4cG9uZW50cy5cclxuICBlID0gbWF0aGZsb29yKHkuZSAvIExPR19CQVNFKTtcclxuICB4ZSA9IG1hdGhmbG9vcih4LmUgLyBMT0dfQkFTRSk7XHJcblxyXG4gIHhkID0geGQuc2xpY2UoKTtcclxuICBrID0geGUgLSBlO1xyXG5cclxuICAvLyBJZiBiYXNlIDFlNyBleHBvbmVudHMgZGlmZmVyLi4uXHJcbiAgaWYgKGspIHtcclxuICAgIHhMVHkgPSBrIDwgMDtcclxuXHJcbiAgICBpZiAoeExUeSkge1xyXG4gICAgICBkID0geGQ7XHJcbiAgICAgIGsgPSAtaztcclxuICAgICAgbGVuID0geWQubGVuZ3RoO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgZCA9IHlkO1xyXG4gICAgICBlID0geGU7XHJcbiAgICAgIGxlbiA9IHhkLmxlbmd0aDtcclxuICAgIH1cclxuXHJcbiAgICAvLyBOdW1iZXJzIHdpdGggbWFzc2l2ZWx5IGRpZmZlcmVudCBleHBvbmVudHMgd291bGQgcmVzdWx0IGluIGEgdmVyeSBoaWdoIG51bWJlciBvZlxyXG4gICAgLy8gemVyb3MgbmVlZGluZyB0byBiZSBwcmVwZW5kZWQsIGJ1dCB0aGlzIGNhbiBiZSBhdm9pZGVkIHdoaWxlIHN0aWxsIGVuc3VyaW5nIGNvcnJlY3RcclxuICAgIC8vIHJvdW5kaW5nIGJ5IGxpbWl0aW5nIHRoZSBudW1iZXIgb2YgemVyb3MgdG8gYE1hdGguY2VpbChwciAvIExPR19CQVNFKSArIDJgLlxyXG4gICAgaSA9IE1hdGgubWF4KE1hdGguY2VpbChwciAvIExPR19CQVNFKSwgbGVuKSArIDI7XHJcblxyXG4gICAgaWYgKGsgPiBpKSB7XHJcbiAgICAgIGsgPSBpO1xyXG4gICAgICBkLmxlbmd0aCA9IDE7XHJcbiAgICB9XHJcblxyXG4gICAgLy8gUHJlcGVuZCB6ZXJvcyB0byBlcXVhbGlzZSBleHBvbmVudHMuXHJcbiAgICBkLnJldmVyc2UoKTtcclxuICAgIGZvciAoaSA9IGs7IGktLTspIGQucHVzaCgwKTtcclxuICAgIGQucmV2ZXJzZSgpO1xyXG5cclxuICAvLyBCYXNlIDFlNyBleHBvbmVudHMgZXF1YWwuXHJcbiAgfSBlbHNlIHtcclxuXHJcbiAgICAvLyBDaGVjayBkaWdpdHMgdG8gZGV0ZXJtaW5lIHdoaWNoIGlzIHRoZSBiaWdnZXIgbnVtYmVyLlxyXG5cclxuICAgIGkgPSB4ZC5sZW5ndGg7XHJcbiAgICBsZW4gPSB5ZC5sZW5ndGg7XHJcbiAgICB4TFR5ID0gaSA8IGxlbjtcclxuICAgIGlmICh4TFR5KSBsZW4gPSBpO1xyXG5cclxuICAgIGZvciAoaSA9IDA7IGkgPCBsZW47IGkrKykge1xyXG4gICAgICBpZiAoeGRbaV0gIT0geWRbaV0pIHtcclxuICAgICAgICB4TFR5ID0geGRbaV0gPCB5ZFtpXTtcclxuICAgICAgICBicmVhaztcclxuICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGsgPSAwO1xyXG4gIH1cclxuXHJcbiAgaWYgKHhMVHkpIHtcclxuICAgIGQgPSB4ZDtcclxuICAgIHhkID0geWQ7XHJcbiAgICB5ZCA9IGQ7XHJcbiAgICB5LnMgPSAteS5zO1xyXG4gIH1cclxuXHJcbiAgbGVuID0geGQubGVuZ3RoO1xyXG5cclxuICAvLyBBcHBlbmQgemVyb3MgdG8gYHhkYCBpZiBzaG9ydGVyLlxyXG4gIC8vIERvbid0IGFkZCB6ZXJvcyB0byBgeWRgIGlmIHNob3J0ZXIgYXMgc3VidHJhY3Rpb24gb25seSBuZWVkcyB0byBzdGFydCBhdCBgeWRgIGxlbmd0aC5cclxuICBmb3IgKGkgPSB5ZC5sZW5ndGggLSBsZW47IGkgPiAwOyAtLWkpIHhkW2xlbisrXSA9IDA7XHJcblxyXG4gIC8vIFN1YnRyYWN0IHlkIGZyb20geGQuXHJcbiAgZm9yIChpID0geWQubGVuZ3RoOyBpID4gazspIHtcclxuXHJcbiAgICBpZiAoeGRbLS1pXSA8IHlkW2ldKSB7XHJcbiAgICAgIGZvciAoaiA9IGk7IGogJiYgeGRbLS1qXSA9PT0gMDspIHhkW2pdID0gQkFTRSAtIDE7XHJcbiAgICAgIC0teGRbal07XHJcbiAgICAgIHhkW2ldICs9IEJBU0U7XHJcbiAgICB9XHJcblxyXG4gICAgeGRbaV0gLT0geWRbaV07XHJcbiAgfVxyXG5cclxuICAvLyBSZW1vdmUgdHJhaWxpbmcgemVyb3MuXHJcbiAgZm9yICg7IHhkWy0tbGVuXSA9PT0gMDspIHhkLnBvcCgpO1xyXG5cclxuICAvLyBSZW1vdmUgbGVhZGluZyB6ZXJvcyBhbmQgYWRqdXN0IGV4cG9uZW50IGFjY29yZGluZ2x5LlxyXG4gIGZvciAoOyB4ZFswXSA9PT0gMDsgeGQuc2hpZnQoKSkgLS1lO1xyXG5cclxuICAvLyBaZXJvP1xyXG4gIGlmICgheGRbMF0pIHJldHVybiBuZXcgQ3RvcihybSA9PT0gMyA/IC0wIDogMCk7XHJcblxyXG4gIHkuZCA9IHhkO1xyXG4gIHkuZSA9IGdldEJhc2UxMEV4cG9uZW50KHhkLCBlKTtcclxuXHJcbiAgcmV0dXJuIGV4dGVybmFsID8gZmluYWxpc2UoeSwgcHIsIHJtKSA6IHk7XHJcbn07XHJcblxyXG5cclxuLypcclxuICogICBuICUgMCA9ICBOXHJcbiAqICAgbiAlIE4gPSAgTlxyXG4gKiAgIG4gJSBJID0gIG5cclxuICogICAwICUgbiA9ICAwXHJcbiAqICAtMCAlIG4gPSAtMFxyXG4gKiAgIDAgJSAwID0gIE5cclxuICogICAwICUgTiA9ICBOXHJcbiAqICAgMCAlIEkgPSAgMFxyXG4gKiAgIE4gJSBuID0gIE5cclxuICogICBOICUgMCA9ICBOXHJcbiAqICAgTiAlIE4gPSAgTlxyXG4gKiAgIE4gJSBJID0gIE5cclxuICogICBJICUgbiA9ICBOXHJcbiAqICAgSSAlIDAgPSAgTlxyXG4gKiAgIEkgJSBOID0gIE5cclxuICogICBJICUgSSA9ICBOXHJcbiAqXHJcbiAqIFJldHVybiBhIG5ldyBEZWNpbWFsIHdob3NlIHZhbHVlIGlzIHRoZSB2YWx1ZSBvZiB0aGlzIERlY2ltYWwgbW9kdWxvIGB5YCwgcm91bmRlZCB0b1xyXG4gKiBgcHJlY2lzaW9uYCBzaWduaWZpY2FudCBkaWdpdHMgdXNpbmcgcm91bmRpbmcgbW9kZSBgcm91bmRpbmdgLlxyXG4gKlxyXG4gKiBUaGUgcmVzdWx0IGRlcGVuZHMgb24gdGhlIG1vZHVsbyBtb2RlLlxyXG4gKlxyXG4gKi9cclxuUC5tb2R1bG8gPSBQLm1vZCA9IGZ1bmN0aW9uICh5KSB7XHJcbiAgdmFyIHEsXHJcbiAgICB4ID0gdGhpcyxcclxuICAgIEN0b3IgPSB4LmNvbnN0cnVjdG9yO1xyXG5cclxuICB5ID0gbmV3IEN0b3IoeSk7XHJcblxyXG4gIC8vIFJldHVybiBOYU4gaWYgeCBpcyBcdTAwQjFJbmZpbml0eSBvciBOYU4sIG9yIHkgaXMgTmFOIG9yIFx1MDBCMTAuXHJcbiAgaWYgKCF4LmQgfHwgIXkucyB8fCB5LmQgJiYgIXkuZFswXSkgcmV0dXJuIG5ldyBDdG9yKE5hTik7XHJcblxyXG4gIC8vIFJldHVybiB4IGlmIHkgaXMgXHUwMEIxSW5maW5pdHkgb3IgeCBpcyBcdTAwQjEwLlxyXG4gIGlmICgheS5kIHx8IHguZCAmJiAheC5kWzBdKSB7XHJcbiAgICByZXR1cm4gZmluYWxpc2UobmV3IEN0b3IoeCksIEN0b3IucHJlY2lzaW9uLCBDdG9yLnJvdW5kaW5nKTtcclxuICB9XHJcblxyXG4gIC8vIFByZXZlbnQgcm91bmRpbmcgb2YgaW50ZXJtZWRpYXRlIGNhbGN1bGF0aW9ucy5cclxuICBleHRlcm5hbCA9IGZhbHNlO1xyXG5cclxuICBpZiAoQ3Rvci5tb2R1bG8gPT0gOSkge1xyXG5cclxuICAgIC8vIEV1Y2xpZGlhbiBkaXZpc2lvbjogcSA9IHNpZ24oeSkgKiBmbG9vcih4IC8gYWJzKHkpKVxyXG4gICAgLy8gcmVzdWx0ID0geCAtIHEgKiB5ICAgIHdoZXJlICAwIDw9IHJlc3VsdCA8IGFicyh5KVxyXG4gICAgcSA9IGRpdmlkZSh4LCB5LmFicygpLCAwLCAzLCAxKTtcclxuICAgIHEucyAqPSB5LnM7XHJcbiAgfSBlbHNlIHtcclxuICAgIHEgPSBkaXZpZGUoeCwgeSwgMCwgQ3Rvci5tb2R1bG8sIDEpO1xyXG4gIH1cclxuXHJcbiAgcSA9IHEudGltZXMoeSk7XHJcblxyXG4gIGV4dGVybmFsID0gdHJ1ZTtcclxuXHJcbiAgcmV0dXJuIHgubWludXMocSk7XHJcbn07XHJcblxyXG5cclxuLypcclxuICogUmV0dXJuIGEgbmV3IERlY2ltYWwgd2hvc2UgdmFsdWUgaXMgdGhlIG5hdHVyYWwgZXhwb25lbnRpYWwgb2YgdGhlIHZhbHVlIG9mIHRoaXMgRGVjaW1hbCxcclxuICogaS5lLiB0aGUgYmFzZSBlIHJhaXNlZCB0byB0aGUgcG93ZXIgdGhlIHZhbHVlIG9mIHRoaXMgRGVjaW1hbCwgcm91bmRlZCB0byBgcHJlY2lzaW9uYFxyXG4gKiBzaWduaWZpY2FudCBkaWdpdHMgdXNpbmcgcm91bmRpbmcgbW9kZSBgcm91bmRpbmdgLlxyXG4gKlxyXG4gKi9cclxuUC5uYXR1cmFsRXhwb25lbnRpYWwgPSBQLmV4cCA9IGZ1bmN0aW9uICgpIHtcclxuICByZXR1cm4gbmF0dXJhbEV4cG9uZW50aWFsKHRoaXMpO1xyXG59O1xyXG5cclxuXHJcbi8qXHJcbiAqIFJldHVybiBhIG5ldyBEZWNpbWFsIHdob3NlIHZhbHVlIGlzIHRoZSBuYXR1cmFsIGxvZ2FyaXRobSBvZiB0aGUgdmFsdWUgb2YgdGhpcyBEZWNpbWFsLFxyXG4gKiByb3VuZGVkIHRvIGBwcmVjaXNpb25gIHNpZ25pZmljYW50IGRpZ2l0cyB1c2luZyByb3VuZGluZyBtb2RlIGByb3VuZGluZ2AuXHJcbiAqXHJcbiAqL1xyXG5QLm5hdHVyYWxMb2dhcml0aG0gPSBQLmxuID0gZnVuY3Rpb24gKCkge1xyXG4gIHJldHVybiBuYXR1cmFsTG9nYXJpdGhtKHRoaXMpO1xyXG59O1xyXG5cclxuXHJcbi8qXHJcbiAqIFJldHVybiBhIG5ldyBEZWNpbWFsIHdob3NlIHZhbHVlIGlzIHRoZSB2YWx1ZSBvZiB0aGlzIERlY2ltYWwgbmVnYXRlZCwgaS5lLiBhcyBpZiBtdWx0aXBsaWVkIGJ5XHJcbiAqIC0xLlxyXG4gKlxyXG4gKi9cclxuUC5uZWdhdGVkID0gUC5uZWcgPSBmdW5jdGlvbiAoKSB7XHJcbiAgdmFyIHggPSBuZXcgdGhpcy5jb25zdHJ1Y3Rvcih0aGlzKTtcclxuICB4LnMgPSAteC5zO1xyXG4gIHJldHVybiBmaW5hbGlzZSh4KTtcclxufTtcclxuXHJcblxyXG4vKlxyXG4gKiAgbiArIDAgPSBuXHJcbiAqICBuICsgTiA9IE5cclxuICogIG4gKyBJID0gSVxyXG4gKiAgMCArIG4gPSBuXHJcbiAqICAwICsgMCA9IDBcclxuICogIDAgKyBOID0gTlxyXG4gKiAgMCArIEkgPSBJXHJcbiAqICBOICsgbiA9IE5cclxuICogIE4gKyAwID0gTlxyXG4gKiAgTiArIE4gPSBOXHJcbiAqICBOICsgSSA9IE5cclxuICogIEkgKyBuID0gSVxyXG4gKiAgSSArIDAgPSBJXHJcbiAqICBJICsgTiA9IE5cclxuICogIEkgKyBJID0gSVxyXG4gKlxyXG4gKiBSZXR1cm4gYSBuZXcgRGVjaW1hbCB3aG9zZSB2YWx1ZSBpcyB0aGUgdmFsdWUgb2YgdGhpcyBEZWNpbWFsIHBsdXMgYHlgLCByb3VuZGVkIHRvIGBwcmVjaXNpb25gXHJcbiAqIHNpZ25pZmljYW50IGRpZ2l0cyB1c2luZyByb3VuZGluZyBtb2RlIGByb3VuZGluZ2AuXHJcbiAqXHJcbiAqL1xyXG5QLnBsdXMgPSBQLmFkZCA9IGZ1bmN0aW9uICh5KSB7XHJcbiAgdmFyIGNhcnJ5LCBkLCBlLCBpLCBrLCBsZW4sIHByLCBybSwgeGQsIHlkLFxyXG4gICAgeCA9IHRoaXMsXHJcbiAgICBDdG9yID0geC5jb25zdHJ1Y3RvcjtcclxuXHJcbiAgeSA9IG5ldyBDdG9yKHkpO1xyXG5cclxuICAvLyBJZiBlaXRoZXIgaXMgbm90IGZpbml0ZS4uLlxyXG4gIGlmICgheC5kIHx8ICF5LmQpIHtcclxuXHJcbiAgICAvLyBSZXR1cm4gTmFOIGlmIGVpdGhlciBpcyBOYU4uXHJcbiAgICBpZiAoIXgucyB8fCAheS5zKSB5ID0gbmV3IEN0b3IoTmFOKTtcclxuXHJcbiAgICAvLyBSZXR1cm4geCBpZiB5IGlzIGZpbml0ZSBhbmQgeCBpcyBcdTAwQjFJbmZpbml0eS5cclxuICAgIC8vIFJldHVybiB4IGlmIGJvdGggYXJlIFx1MDBCMUluZmluaXR5IHdpdGggdGhlIHNhbWUgc2lnbi5cclxuICAgIC8vIFJldHVybiBOYU4gaWYgYm90aCBhcmUgXHUwMEIxSW5maW5pdHkgd2l0aCBkaWZmZXJlbnQgc2lnbnMuXHJcbiAgICAvLyBSZXR1cm4geSBpZiB4IGlzIGZpbml0ZSBhbmQgeSBpcyBcdTAwQjFJbmZpbml0eS5cclxuICAgIGVsc2UgaWYgKCF4LmQpIHkgPSBuZXcgQ3Rvcih5LmQgfHwgeC5zID09PSB5LnMgPyB4IDogTmFOKTtcclxuXHJcbiAgICByZXR1cm4geTtcclxuICB9XHJcblxyXG4gICAvLyBJZiBzaWducyBkaWZmZXIuLi5cclxuICBpZiAoeC5zICE9IHkucykge1xyXG4gICAgeS5zID0gLXkucztcclxuICAgIHJldHVybiB4Lm1pbnVzKHkpO1xyXG4gIH1cclxuXHJcbiAgeGQgPSB4LmQ7XHJcbiAgeWQgPSB5LmQ7XHJcbiAgcHIgPSBDdG9yLnByZWNpc2lvbjtcclxuICBybSA9IEN0b3Iucm91bmRpbmc7XHJcblxyXG4gIC8vIElmIGVpdGhlciBpcyB6ZXJvLi4uXHJcbiAgaWYgKCF4ZFswXSB8fCAheWRbMF0pIHtcclxuXHJcbiAgICAvLyBSZXR1cm4geCBpZiB5IGlzIHplcm8uXHJcbiAgICAvLyBSZXR1cm4geSBpZiB5IGlzIG5vbi16ZXJvLlxyXG4gICAgaWYgKCF5ZFswXSkgeSA9IG5ldyBDdG9yKHgpO1xyXG5cclxuICAgIHJldHVybiBleHRlcm5hbCA/IGZpbmFsaXNlKHksIHByLCBybSkgOiB5O1xyXG4gIH1cclxuXHJcbiAgLy8geCBhbmQgeSBhcmUgZmluaXRlLCBub24temVybyBudW1iZXJzIHdpdGggdGhlIHNhbWUgc2lnbi5cclxuXHJcbiAgLy8gQ2FsY3VsYXRlIGJhc2UgMWU3IGV4cG9uZW50cy5cclxuICBrID0gbWF0aGZsb29yKHguZSAvIExPR19CQVNFKTtcclxuICBlID0gbWF0aGZsb29yKHkuZSAvIExPR19CQVNFKTtcclxuXHJcbiAgeGQgPSB4ZC5zbGljZSgpO1xyXG4gIGkgPSBrIC0gZTtcclxuXHJcbiAgLy8gSWYgYmFzZSAxZTcgZXhwb25lbnRzIGRpZmZlci4uLlxyXG4gIGlmIChpKSB7XHJcblxyXG4gICAgaWYgKGkgPCAwKSB7XHJcbiAgICAgIGQgPSB4ZDtcclxuICAgICAgaSA9IC1pO1xyXG4gICAgICBsZW4gPSB5ZC5sZW5ndGg7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICBkID0geWQ7XHJcbiAgICAgIGUgPSBrO1xyXG4gICAgICBsZW4gPSB4ZC5sZW5ndGg7XHJcbiAgICB9XHJcblxyXG4gICAgLy8gTGltaXQgbnVtYmVyIG9mIHplcm9zIHByZXBlbmRlZCB0byBtYXgoY2VpbChwciAvIExPR19CQVNFKSwgbGVuKSArIDEuXHJcbiAgICBrID0gTWF0aC5jZWlsKHByIC8gTE9HX0JBU0UpO1xyXG4gICAgbGVuID0gayA+IGxlbiA/IGsgKyAxIDogbGVuICsgMTtcclxuXHJcbiAgICBpZiAoaSA+IGxlbikge1xyXG4gICAgICBpID0gbGVuO1xyXG4gICAgICBkLmxlbmd0aCA9IDE7XHJcbiAgICB9XHJcblxyXG4gICAgLy8gUHJlcGVuZCB6ZXJvcyB0byBlcXVhbGlzZSBleHBvbmVudHMuIE5vdGU6IEZhc3RlciB0byB1c2UgcmV2ZXJzZSB0aGVuIGRvIHVuc2hpZnRzLlxyXG4gICAgZC5yZXZlcnNlKCk7XHJcbiAgICBmb3IgKDsgaS0tOykgZC5wdXNoKDApO1xyXG4gICAgZC5yZXZlcnNlKCk7XHJcbiAgfVxyXG5cclxuICBsZW4gPSB4ZC5sZW5ndGg7XHJcbiAgaSA9IHlkLmxlbmd0aDtcclxuXHJcbiAgLy8gSWYgeWQgaXMgbG9uZ2VyIHRoYW4geGQsIHN3YXAgeGQgYW5kIHlkIHNvIHhkIHBvaW50cyB0byB0aGUgbG9uZ2VyIGFycmF5LlxyXG4gIGlmIChsZW4gLSBpIDwgMCkge1xyXG4gICAgaSA9IGxlbjtcclxuICAgIGQgPSB5ZDtcclxuICAgIHlkID0geGQ7XHJcbiAgICB4ZCA9IGQ7XHJcbiAgfVxyXG5cclxuICAvLyBPbmx5IHN0YXJ0IGFkZGluZyBhdCB5ZC5sZW5ndGggLSAxIGFzIHRoZSBmdXJ0aGVyIGRpZ2l0cyBvZiB4ZCBjYW4gYmUgbGVmdCBhcyB0aGV5IGFyZS5cclxuICBmb3IgKGNhcnJ5ID0gMDsgaTspIHtcclxuICAgIGNhcnJ5ID0gKHhkWy0taV0gPSB4ZFtpXSArIHlkW2ldICsgY2FycnkpIC8gQkFTRSB8IDA7XHJcbiAgICB4ZFtpXSAlPSBCQVNFO1xyXG4gIH1cclxuXHJcbiAgaWYgKGNhcnJ5KSB7XHJcbiAgICB4ZC51bnNoaWZ0KGNhcnJ5KTtcclxuICAgICsrZTtcclxuICB9XHJcblxyXG4gIC8vIFJlbW92ZSB0cmFpbGluZyB6ZXJvcy5cclxuICAvLyBObyBuZWVkIHRvIGNoZWNrIGZvciB6ZXJvLCBhcyAreCArICt5ICE9IDAgJiYgLXggKyAteSAhPSAwXHJcbiAgZm9yIChsZW4gPSB4ZC5sZW5ndGg7IHhkWy0tbGVuXSA9PSAwOykgeGQucG9wKCk7XHJcblxyXG4gIHkuZCA9IHhkO1xyXG4gIHkuZSA9IGdldEJhc2UxMEV4cG9uZW50KHhkLCBlKTtcclxuXHJcbiAgcmV0dXJuIGV4dGVybmFsID8gZmluYWxpc2UoeSwgcHIsIHJtKSA6IHk7XHJcbn07XHJcblxyXG5cclxuLypcclxuICogUmV0dXJuIHRoZSBudW1iZXIgb2Ygc2lnbmlmaWNhbnQgZGlnaXRzIG9mIHRoZSB2YWx1ZSBvZiB0aGlzIERlY2ltYWwuXHJcbiAqXHJcbiAqIFt6XSB7Ym9vbGVhbnxudW1iZXJ9IFdoZXRoZXIgdG8gY291bnQgaW50ZWdlci1wYXJ0IHRyYWlsaW5nIHplcm9zOiB0cnVlLCBmYWxzZSwgMSBvciAwLlxyXG4gKlxyXG4gKi9cclxuUC5wcmVjaXNpb24gPSBQLnNkID0gZnVuY3Rpb24gKHopIHtcclxuICB2YXIgayxcclxuICAgIHggPSB0aGlzO1xyXG5cclxuICBpZiAoeiAhPT0gdm9pZCAwICYmIHogIT09ICEheiAmJiB6ICE9PSAxICYmIHogIT09IDApIHRocm93IEVycm9yKGludmFsaWRBcmd1bWVudCArIHopO1xyXG5cclxuICBpZiAoeC5kKSB7XHJcbiAgICBrID0gZ2V0UHJlY2lzaW9uKHguZCk7XHJcbiAgICBpZiAoeiAmJiB4LmUgKyAxID4gaykgayA9IHguZSArIDE7XHJcbiAgfSBlbHNlIHtcclxuICAgIGsgPSBOYU47XHJcbiAgfVxyXG5cclxuICByZXR1cm4gaztcclxufTtcclxuXHJcblxyXG4vKlxyXG4gKiBSZXR1cm4gYSBuZXcgRGVjaW1hbCB3aG9zZSB2YWx1ZSBpcyB0aGUgdmFsdWUgb2YgdGhpcyBEZWNpbWFsIHJvdW5kZWQgdG8gYSB3aG9sZSBudW1iZXIgdXNpbmdcclxuICogcm91bmRpbmcgbW9kZSBgcm91bmRpbmdgLlxyXG4gKlxyXG4gKi9cclxuUC5yb3VuZCA9IGZ1bmN0aW9uICgpIHtcclxuICB2YXIgeCA9IHRoaXMsXHJcbiAgICBDdG9yID0geC5jb25zdHJ1Y3RvcjtcclxuXHJcbiAgcmV0dXJuIGZpbmFsaXNlKG5ldyBDdG9yKHgpLCB4LmUgKyAxLCBDdG9yLnJvdW5kaW5nKTtcclxufTtcclxuXHJcblxyXG4vKlxyXG4gKiBSZXR1cm4gYSBuZXcgRGVjaW1hbCB3aG9zZSB2YWx1ZSBpcyB0aGUgc2luZSBvZiB0aGUgdmFsdWUgaW4gcmFkaWFucyBvZiB0aGlzIERlY2ltYWwuXHJcbiAqXHJcbiAqIERvbWFpbjogWy1JbmZpbml0eSwgSW5maW5pdHldXHJcbiAqIFJhbmdlOiBbLTEsIDFdXHJcbiAqXHJcbiAqIHNpbih4KSA9IHggLSB4XjMvMyEgKyB4XjUvNSEgLSAuLi5cclxuICpcclxuICogc2luKDApICAgICAgICAgPSAwXHJcbiAqIHNpbigtMCkgICAgICAgID0gLTBcclxuICogc2luKEluZmluaXR5KSAgPSBOYU5cclxuICogc2luKC1JbmZpbml0eSkgPSBOYU5cclxuICogc2luKE5hTikgICAgICAgPSBOYU5cclxuICpcclxuICovXHJcblAuc2luZSA9IFAuc2luID0gZnVuY3Rpb24gKCkge1xyXG4gIHZhciBwciwgcm0sXHJcbiAgICB4ID0gdGhpcyxcclxuICAgIEN0b3IgPSB4LmNvbnN0cnVjdG9yO1xyXG5cclxuICBpZiAoIXguaXNGaW5pdGUoKSkgcmV0dXJuIG5ldyBDdG9yKE5hTik7XHJcbiAgaWYgKHguaXNaZXJvKCkpIHJldHVybiBuZXcgQ3Rvcih4KTtcclxuXHJcbiAgcHIgPSBDdG9yLnByZWNpc2lvbjtcclxuICBybSA9IEN0b3Iucm91bmRpbmc7XHJcbiAgQ3Rvci5wcmVjaXNpb24gPSBwciArIE1hdGgubWF4KHguZSwgeC5zZCgpKSArIExPR19CQVNFO1xyXG4gIEN0b3Iucm91bmRpbmcgPSAxO1xyXG5cclxuICB4ID0gc2luZShDdG9yLCB0b0xlc3NUaGFuSGFsZlBpKEN0b3IsIHgpKTtcclxuXHJcbiAgQ3Rvci5wcmVjaXNpb24gPSBwcjtcclxuICBDdG9yLnJvdW5kaW5nID0gcm07XHJcblxyXG4gIHJldHVybiBmaW5hbGlzZShxdWFkcmFudCA+IDIgPyB4Lm5lZygpIDogeCwgcHIsIHJtLCB0cnVlKTtcclxufTtcclxuXHJcblxyXG4vKlxyXG4gKiBSZXR1cm4gYSBuZXcgRGVjaW1hbCB3aG9zZSB2YWx1ZSBpcyB0aGUgc3F1YXJlIHJvb3Qgb2YgdGhpcyBEZWNpbWFsLCByb3VuZGVkIHRvIGBwcmVjaXNpb25gXHJcbiAqIHNpZ25pZmljYW50IGRpZ2l0cyB1c2luZyByb3VuZGluZyBtb2RlIGByb3VuZGluZ2AuXHJcbiAqXHJcbiAqICBzcXJ0KC1uKSA9ICBOXHJcbiAqICBzcXJ0KE4pICA9ICBOXHJcbiAqICBzcXJ0KC1JKSA9ICBOXHJcbiAqICBzcXJ0KEkpICA9ICBJXHJcbiAqICBzcXJ0KDApICA9ICAwXHJcbiAqICBzcXJ0KC0wKSA9IC0wXHJcbiAqXHJcbiAqL1xyXG5QLnNxdWFyZVJvb3QgPSBQLnNxcnQgPSBmdW5jdGlvbiAoKSB7XHJcbiAgdmFyIG0sIG4sIHNkLCByLCByZXAsIHQsXHJcbiAgICB4ID0gdGhpcyxcclxuICAgIGQgPSB4LmQsXHJcbiAgICBlID0geC5lLFxyXG4gICAgcyA9IHgucyxcclxuICAgIEN0b3IgPSB4LmNvbnN0cnVjdG9yO1xyXG5cclxuICAvLyBOZWdhdGl2ZS9OYU4vSW5maW5pdHkvemVybz9cclxuICBpZiAocyAhPT0gMSB8fCAhZCB8fCAhZFswXSkge1xyXG4gICAgcmV0dXJuIG5ldyBDdG9yKCFzIHx8IHMgPCAwICYmICghZCB8fCBkWzBdKSA/IE5hTiA6IGQgPyB4IDogMSAvIDApO1xyXG4gIH1cclxuXHJcbiAgZXh0ZXJuYWwgPSBmYWxzZTtcclxuXHJcbiAgLy8gSW5pdGlhbCBlc3RpbWF0ZS5cclxuICBzID0gTWF0aC5zcXJ0KCt4KTtcclxuXHJcbiAgLy8gTWF0aC5zcXJ0IHVuZGVyZmxvdy9vdmVyZmxvdz9cclxuICAvLyBQYXNzIHggdG8gTWF0aC5zcXJ0IGFzIGludGVnZXIsIHRoZW4gYWRqdXN0IHRoZSBleHBvbmVudCBvZiB0aGUgcmVzdWx0LlxyXG4gIGlmIChzID09IDAgfHwgcyA9PSAxIC8gMCkge1xyXG4gICAgbiA9IGRpZ2l0c1RvU3RyaW5nKGQpO1xyXG5cclxuICAgIGlmICgobi5sZW5ndGggKyBlKSAlIDIgPT0gMCkgbiArPSAnMCc7XHJcbiAgICBzID0gTWF0aC5zcXJ0KG4pO1xyXG4gICAgZSA9IG1hdGhmbG9vcigoZSArIDEpIC8gMikgLSAoZSA8IDAgfHwgZSAlIDIpO1xyXG5cclxuICAgIGlmIChzID09IDEgLyAwKSB7XHJcbiAgICAgIG4gPSAnNWUnICsgZTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIG4gPSBzLnRvRXhwb25lbnRpYWwoKTtcclxuICAgICAgbiA9IG4uc2xpY2UoMCwgbi5pbmRleE9mKCdlJykgKyAxKSArIGU7XHJcbiAgICB9XHJcblxyXG4gICAgciA9IG5ldyBDdG9yKG4pO1xyXG4gIH0gZWxzZSB7XHJcbiAgICByID0gbmV3IEN0b3Iocy50b1N0cmluZygpKTtcclxuICB9XHJcblxyXG4gIHNkID0gKGUgPSBDdG9yLnByZWNpc2lvbikgKyAzO1xyXG5cclxuICAvLyBOZXd0b24tUmFwaHNvbiBpdGVyYXRpb24uXHJcbiAgZm9yICg7Oykge1xyXG4gICAgdCA9IHI7XHJcbiAgICByID0gdC5wbHVzKGRpdmlkZSh4LCB0LCBzZCArIDIsIDEpKS50aW1lcygwLjUpO1xyXG5cclxuICAgIC8vIFRPRE8/IFJlcGxhY2Ugd2l0aCBmb3ItbG9vcCBhbmQgY2hlY2tSb3VuZGluZ0RpZ2l0cy5cclxuICAgIGlmIChkaWdpdHNUb1N0cmluZyh0LmQpLnNsaWNlKDAsIHNkKSA9PT0gKG4gPSBkaWdpdHNUb1N0cmluZyhyLmQpKS5zbGljZSgwLCBzZCkpIHtcclxuICAgICAgbiA9IG4uc2xpY2Uoc2QgLSAzLCBzZCArIDEpO1xyXG5cclxuICAgICAgLy8gVGhlIDR0aCByb3VuZGluZyBkaWdpdCBtYXkgYmUgaW4gZXJyb3IgYnkgLTEgc28gaWYgdGhlIDQgcm91bmRpbmcgZGlnaXRzIGFyZSA5OTk5IG9yXHJcbiAgICAgIC8vIDQ5OTksIGkuZS4gYXBwcm9hY2hpbmcgYSByb3VuZGluZyBib3VuZGFyeSwgY29udGludWUgdGhlIGl0ZXJhdGlvbi5cclxuICAgICAgaWYgKG4gPT0gJzk5OTknIHx8ICFyZXAgJiYgbiA9PSAnNDk5OScpIHtcclxuXHJcbiAgICAgICAgLy8gT24gdGhlIGZpcnN0IGl0ZXJhdGlvbiBvbmx5LCBjaGVjayB0byBzZWUgaWYgcm91bmRpbmcgdXAgZ2l2ZXMgdGhlIGV4YWN0IHJlc3VsdCBhcyB0aGVcclxuICAgICAgICAvLyBuaW5lcyBtYXkgaW5maW5pdGVseSByZXBlYXQuXHJcbiAgICAgICAgaWYgKCFyZXApIHtcclxuICAgICAgICAgIGZpbmFsaXNlKHQsIGUgKyAxLCAwKTtcclxuXHJcbiAgICAgICAgICBpZiAodC50aW1lcyh0KS5lcSh4KSkge1xyXG4gICAgICAgICAgICByID0gdDtcclxuICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBzZCArPSA0O1xyXG4gICAgICAgIHJlcCA9IDE7XHJcbiAgICAgIH0gZWxzZSB7XHJcblxyXG4gICAgICAgIC8vIElmIHRoZSByb3VuZGluZyBkaWdpdHMgYXJlIG51bGwsIDB7MCw0fSBvciA1MHswLDN9LCBjaGVjayBmb3IgYW4gZXhhY3QgcmVzdWx0LlxyXG4gICAgICAgIC8vIElmIG5vdCwgdGhlbiB0aGVyZSBhcmUgZnVydGhlciBkaWdpdHMgYW5kIG0gd2lsbCBiZSB0cnV0aHkuXHJcbiAgICAgICAgaWYgKCErbiB8fCAhK24uc2xpY2UoMSkgJiYgbi5jaGFyQXQoMCkgPT0gJzUnKSB7XHJcblxyXG4gICAgICAgICAgLy8gVHJ1bmNhdGUgdG8gdGhlIGZpcnN0IHJvdW5kaW5nIGRpZ2l0LlxyXG4gICAgICAgICAgZmluYWxpc2UociwgZSArIDEsIDEpO1xyXG4gICAgICAgICAgbSA9ICFyLnRpbWVzKHIpLmVxKHgpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgYnJlYWs7XHJcbiAgICAgIH1cclxuICAgIH1cclxuICB9XHJcblxyXG4gIGV4dGVybmFsID0gdHJ1ZTtcclxuXHJcbiAgcmV0dXJuIGZpbmFsaXNlKHIsIGUsIEN0b3Iucm91bmRpbmcsIG0pO1xyXG59O1xyXG5cclxuXHJcbi8qXHJcbiAqIFJldHVybiBhIG5ldyBEZWNpbWFsIHdob3NlIHZhbHVlIGlzIHRoZSB0YW5nZW50IG9mIHRoZSB2YWx1ZSBpbiByYWRpYW5zIG9mIHRoaXMgRGVjaW1hbC5cclxuICpcclxuICogRG9tYWluOiBbLUluZmluaXR5LCBJbmZpbml0eV1cclxuICogUmFuZ2U6IFstSW5maW5pdHksIEluZmluaXR5XVxyXG4gKlxyXG4gKiB0YW4oMCkgICAgICAgICA9IDBcclxuICogdGFuKC0wKSAgICAgICAgPSAtMFxyXG4gKiB0YW4oSW5maW5pdHkpICA9IE5hTlxyXG4gKiB0YW4oLUluZmluaXR5KSA9IE5hTlxyXG4gKiB0YW4oTmFOKSAgICAgICA9IE5hTlxyXG4gKlxyXG4gKi9cclxuUC50YW5nZW50ID0gUC50YW4gPSBmdW5jdGlvbiAoKSB7XHJcbiAgdmFyIHByLCBybSxcclxuICAgIHggPSB0aGlzLFxyXG4gICAgQ3RvciA9IHguY29uc3RydWN0b3I7XHJcblxyXG4gIGlmICgheC5pc0Zpbml0ZSgpKSByZXR1cm4gbmV3IEN0b3IoTmFOKTtcclxuICBpZiAoeC5pc1plcm8oKSkgcmV0dXJuIG5ldyBDdG9yKHgpO1xyXG5cclxuICBwciA9IEN0b3IucHJlY2lzaW9uO1xyXG4gIHJtID0gQ3Rvci5yb3VuZGluZztcclxuICBDdG9yLnByZWNpc2lvbiA9IHByICsgMTA7XHJcbiAgQ3Rvci5yb3VuZGluZyA9IDE7XHJcblxyXG4gIHggPSB4LnNpbigpO1xyXG4gIHgucyA9IDE7XHJcbiAgeCA9IGRpdmlkZSh4LCBuZXcgQ3RvcigxKS5taW51cyh4LnRpbWVzKHgpKS5zcXJ0KCksIHByICsgMTAsIDApO1xyXG5cclxuICBDdG9yLnByZWNpc2lvbiA9IHByO1xyXG4gIEN0b3Iucm91bmRpbmcgPSBybTtcclxuXHJcbiAgcmV0dXJuIGZpbmFsaXNlKHF1YWRyYW50ID09IDIgfHwgcXVhZHJhbnQgPT0gNCA/IHgubmVnKCkgOiB4LCBwciwgcm0sIHRydWUpO1xyXG59O1xyXG5cclxuXHJcbi8qXHJcbiAqICBuICogMCA9IDBcclxuICogIG4gKiBOID0gTlxyXG4gKiAgbiAqIEkgPSBJXHJcbiAqICAwICogbiA9IDBcclxuICogIDAgKiAwID0gMFxyXG4gKiAgMCAqIE4gPSBOXHJcbiAqICAwICogSSA9IE5cclxuICogIE4gKiBuID0gTlxyXG4gKiAgTiAqIDAgPSBOXHJcbiAqICBOICogTiA9IE5cclxuICogIE4gKiBJID0gTlxyXG4gKiAgSSAqIG4gPSBJXHJcbiAqICBJICogMCA9IE5cclxuICogIEkgKiBOID0gTlxyXG4gKiAgSSAqIEkgPSBJXHJcbiAqXHJcbiAqIFJldHVybiBhIG5ldyBEZWNpbWFsIHdob3NlIHZhbHVlIGlzIHRoaXMgRGVjaW1hbCB0aW1lcyBgeWAsIHJvdW5kZWQgdG8gYHByZWNpc2lvbmAgc2lnbmlmaWNhbnRcclxuICogZGlnaXRzIHVzaW5nIHJvdW5kaW5nIG1vZGUgYHJvdW5kaW5nYC5cclxuICpcclxuICovXHJcblAudGltZXMgPSBQLm11bCA9IGZ1bmN0aW9uICh5KSB7XHJcbiAgdmFyIGNhcnJ5LCBlLCBpLCBrLCByLCByTCwgdCwgeGRMLCB5ZEwsXHJcbiAgICB4ID0gdGhpcyxcclxuICAgIEN0b3IgPSB4LmNvbnN0cnVjdG9yLFxyXG4gICAgeGQgPSB4LmQsXHJcbiAgICB5ZCA9ICh5ID0gbmV3IEN0b3IoeSkpLmQ7XHJcblxyXG4gIHkucyAqPSB4LnM7XHJcblxyXG4gICAvLyBJZiBlaXRoZXIgaXMgTmFOLCBcdTAwQjFJbmZpbml0eSBvciBcdTAwQjEwLi4uXHJcbiAgaWYgKCF4ZCB8fCAheGRbMF0gfHwgIXlkIHx8ICF5ZFswXSkge1xyXG5cclxuICAgIHJldHVybiBuZXcgQ3RvcigheS5zIHx8IHhkICYmICF4ZFswXSAmJiAheWQgfHwgeWQgJiYgIXlkWzBdICYmICF4ZFxyXG5cclxuICAgICAgLy8gUmV0dXJuIE5hTiBpZiBlaXRoZXIgaXMgTmFOLlxyXG4gICAgICAvLyBSZXR1cm4gTmFOIGlmIHggaXMgXHUwMEIxMCBhbmQgeSBpcyBcdTAwQjFJbmZpbml0eSwgb3IgeSBpcyBcdTAwQjEwIGFuZCB4IGlzIFx1MDBCMUluZmluaXR5LlxyXG4gICAgICA/IE5hTlxyXG5cclxuICAgICAgLy8gUmV0dXJuIFx1MDBCMUluZmluaXR5IGlmIGVpdGhlciBpcyBcdTAwQjFJbmZpbml0eS5cclxuICAgICAgLy8gUmV0dXJuIFx1MDBCMTAgaWYgZWl0aGVyIGlzIFx1MDBCMTAuXHJcbiAgICAgIDogIXhkIHx8ICF5ZCA/IHkucyAvIDAgOiB5LnMgKiAwKTtcclxuICB9XHJcblxyXG4gIGUgPSBtYXRoZmxvb3IoeC5lIC8gTE9HX0JBU0UpICsgbWF0aGZsb29yKHkuZSAvIExPR19CQVNFKTtcclxuICB4ZEwgPSB4ZC5sZW5ndGg7XHJcbiAgeWRMID0geWQubGVuZ3RoO1xyXG5cclxuICAvLyBFbnN1cmUgeGQgcG9pbnRzIHRvIHRoZSBsb25nZXIgYXJyYXkuXHJcbiAgaWYgKHhkTCA8IHlkTCkge1xyXG4gICAgciA9IHhkO1xyXG4gICAgeGQgPSB5ZDtcclxuICAgIHlkID0gcjtcclxuICAgIHJMID0geGRMO1xyXG4gICAgeGRMID0geWRMO1xyXG4gICAgeWRMID0gckw7XHJcbiAgfVxyXG5cclxuICAvLyBJbml0aWFsaXNlIHRoZSByZXN1bHQgYXJyYXkgd2l0aCB6ZXJvcy5cclxuICByID0gW107XHJcbiAgckwgPSB4ZEwgKyB5ZEw7XHJcbiAgZm9yIChpID0gckw7IGktLTspIHIucHVzaCgwKTtcclxuXHJcbiAgLy8gTXVsdGlwbHkhXHJcbiAgZm9yIChpID0geWRMOyAtLWkgPj0gMDspIHtcclxuICAgIGNhcnJ5ID0gMDtcclxuICAgIGZvciAoayA9IHhkTCArIGk7IGsgPiBpOykge1xyXG4gICAgICB0ID0gcltrXSArIHlkW2ldICogeGRbayAtIGkgLSAxXSArIGNhcnJ5O1xyXG4gICAgICByW2stLV0gPSB0ICUgQkFTRSB8IDA7XHJcbiAgICAgIGNhcnJ5ID0gdCAvIEJBU0UgfCAwO1xyXG4gICAgfVxyXG5cclxuICAgIHJba10gPSAocltrXSArIGNhcnJ5KSAlIEJBU0UgfCAwO1xyXG4gIH1cclxuXHJcbiAgLy8gUmVtb3ZlIHRyYWlsaW5nIHplcm9zLlxyXG4gIGZvciAoOyAhclstLXJMXTspIHIucG9wKCk7XHJcblxyXG4gIGlmIChjYXJyeSkgKytlO1xyXG4gIGVsc2Ugci5zaGlmdCgpO1xyXG5cclxuICB5LmQgPSByO1xyXG4gIHkuZSA9IGdldEJhc2UxMEV4cG9uZW50KHIsIGUpO1xyXG5cclxuICByZXR1cm4gZXh0ZXJuYWwgPyBmaW5hbGlzZSh5LCBDdG9yLnByZWNpc2lvbiwgQ3Rvci5yb3VuZGluZykgOiB5O1xyXG59O1xyXG5cclxuXHJcbi8qXHJcbiAqIFJldHVybiBhIHN0cmluZyByZXByZXNlbnRpbmcgdGhlIHZhbHVlIG9mIHRoaXMgRGVjaW1hbCBpbiBiYXNlIDIsIHJvdW5kIHRvIGBzZGAgc2lnbmlmaWNhbnRcclxuICogZGlnaXRzIHVzaW5nIHJvdW5kaW5nIG1vZGUgYHJtYC5cclxuICpcclxuICogSWYgdGhlIG9wdGlvbmFsIGBzZGAgYXJndW1lbnQgaXMgcHJlc2VudCB0aGVuIHJldHVybiBiaW5hcnkgZXhwb25lbnRpYWwgbm90YXRpb24uXHJcbiAqXHJcbiAqIFtzZF0ge251bWJlcn0gU2lnbmlmaWNhbnQgZGlnaXRzLiBJbnRlZ2VyLCAxIHRvIE1BWF9ESUdJVFMgaW5jbHVzaXZlLlxyXG4gKiBbcm1dIHtudW1iZXJ9IFJvdW5kaW5nIG1vZGUuIEludGVnZXIsIDAgdG8gOCBpbmNsdXNpdmUuXHJcbiAqXHJcbiAqL1xyXG5QLnRvQmluYXJ5ID0gZnVuY3Rpb24gKHNkLCBybSkge1xyXG4gIHJldHVybiB0b1N0cmluZ0JpbmFyeSh0aGlzLCAyLCBzZCwgcm0pO1xyXG59O1xyXG5cclxuXHJcbi8qXHJcbiAqIFJldHVybiBhIG5ldyBEZWNpbWFsIHdob3NlIHZhbHVlIGlzIHRoZSB2YWx1ZSBvZiB0aGlzIERlY2ltYWwgcm91bmRlZCB0byBhIG1heGltdW0gb2YgYGRwYFxyXG4gKiBkZWNpbWFsIHBsYWNlcyB1c2luZyByb3VuZGluZyBtb2RlIGBybWAgb3IgYHJvdW5kaW5nYCBpZiBgcm1gIGlzIG9taXR0ZWQuXHJcbiAqXHJcbiAqIElmIGBkcGAgaXMgb21pdHRlZCwgcmV0dXJuIGEgbmV3IERlY2ltYWwgd2hvc2UgdmFsdWUgaXMgdGhlIHZhbHVlIG9mIHRoaXMgRGVjaW1hbC5cclxuICpcclxuICogW2RwXSB7bnVtYmVyfSBEZWNpbWFsIHBsYWNlcy4gSW50ZWdlciwgMCB0byBNQVhfRElHSVRTIGluY2x1c2l2ZS5cclxuICogW3JtXSB7bnVtYmVyfSBSb3VuZGluZyBtb2RlLiBJbnRlZ2VyLCAwIHRvIDggaW5jbHVzaXZlLlxyXG4gKlxyXG4gKi9cclxuUC50b0RlY2ltYWxQbGFjZXMgPSBQLnRvRFAgPSBmdW5jdGlvbiAoZHAsIHJtKSB7XHJcbiAgdmFyIHggPSB0aGlzLFxyXG4gICAgQ3RvciA9IHguY29uc3RydWN0b3I7XHJcblxyXG4gIHggPSBuZXcgQ3Rvcih4KTtcclxuICBpZiAoZHAgPT09IHZvaWQgMCkgcmV0dXJuIHg7XHJcblxyXG4gIGNoZWNrSW50MzIoZHAsIDAsIE1BWF9ESUdJVFMpO1xyXG5cclxuICBpZiAocm0gPT09IHZvaWQgMCkgcm0gPSBDdG9yLnJvdW5kaW5nO1xyXG4gIGVsc2UgY2hlY2tJbnQzMihybSwgMCwgOCk7XHJcblxyXG4gIHJldHVybiBmaW5hbGlzZSh4LCBkcCArIHguZSArIDEsIHJtKTtcclxufTtcclxuXHJcblxyXG4vKlxyXG4gKiBSZXR1cm4gYSBzdHJpbmcgcmVwcmVzZW50aW5nIHRoZSB2YWx1ZSBvZiB0aGlzIERlY2ltYWwgaW4gZXhwb25lbnRpYWwgbm90YXRpb24gcm91bmRlZCB0b1xyXG4gKiBgZHBgIGZpeGVkIGRlY2ltYWwgcGxhY2VzIHVzaW5nIHJvdW5kaW5nIG1vZGUgYHJvdW5kaW5nYC5cclxuICpcclxuICogW2RwXSB7bnVtYmVyfSBEZWNpbWFsIHBsYWNlcy4gSW50ZWdlciwgMCB0byBNQVhfRElHSVRTIGluY2x1c2l2ZS5cclxuICogW3JtXSB7bnVtYmVyfSBSb3VuZGluZyBtb2RlLiBJbnRlZ2VyLCAwIHRvIDggaW5jbHVzaXZlLlxyXG4gKlxyXG4gKi9cclxuUC50b0V4cG9uZW50aWFsID0gZnVuY3Rpb24gKGRwLCBybSkge1xyXG4gIHZhciBzdHIsXHJcbiAgICB4ID0gdGhpcyxcclxuICAgIEN0b3IgPSB4LmNvbnN0cnVjdG9yO1xyXG5cclxuICBpZiAoZHAgPT09IHZvaWQgMCkge1xyXG4gICAgc3RyID0gZmluaXRlVG9TdHJpbmcoeCwgdHJ1ZSk7XHJcbiAgfSBlbHNlIHtcclxuICAgIGNoZWNrSW50MzIoZHAsIDAsIE1BWF9ESUdJVFMpO1xyXG5cclxuICAgIGlmIChybSA9PT0gdm9pZCAwKSBybSA9IEN0b3Iucm91bmRpbmc7XHJcbiAgICBlbHNlIGNoZWNrSW50MzIocm0sIDAsIDgpO1xyXG5cclxuICAgIHggPSBmaW5hbGlzZShuZXcgQ3Rvcih4KSwgZHAgKyAxLCBybSk7XHJcbiAgICBzdHIgPSBmaW5pdGVUb1N0cmluZyh4LCB0cnVlLCBkcCArIDEpO1xyXG4gIH1cclxuXHJcbiAgcmV0dXJuIHguaXNOZWcoKSAmJiAheC5pc1plcm8oKSA/ICctJyArIHN0ciA6IHN0cjtcclxufTtcclxuXHJcblxyXG4vKlxyXG4gKiBSZXR1cm4gYSBzdHJpbmcgcmVwcmVzZW50aW5nIHRoZSB2YWx1ZSBvZiB0aGlzIERlY2ltYWwgaW4gbm9ybWFsIChmaXhlZC1wb2ludCkgbm90YXRpb24gdG9cclxuICogYGRwYCBmaXhlZCBkZWNpbWFsIHBsYWNlcyBhbmQgcm91bmRlZCB1c2luZyByb3VuZGluZyBtb2RlIGBybWAgb3IgYHJvdW5kaW5nYCBpZiBgcm1gIGlzXHJcbiAqIG9taXR0ZWQuXHJcbiAqXHJcbiAqIEFzIHdpdGggSmF2YVNjcmlwdCBudW1iZXJzLCAoLTApLnRvRml4ZWQoMCkgaXMgJzAnLCBidXQgZS5nLiAoLTAuMDAwMDEpLnRvRml4ZWQoMCkgaXMgJy0wJy5cclxuICpcclxuICogW2RwXSB7bnVtYmVyfSBEZWNpbWFsIHBsYWNlcy4gSW50ZWdlciwgMCB0byBNQVhfRElHSVRTIGluY2x1c2l2ZS5cclxuICogW3JtXSB7bnVtYmVyfSBSb3VuZGluZyBtb2RlLiBJbnRlZ2VyLCAwIHRvIDggaW5jbHVzaXZlLlxyXG4gKlxyXG4gKiAoLTApLnRvRml4ZWQoMCkgaXMgJzAnLCBidXQgKC0wLjEpLnRvRml4ZWQoMCkgaXMgJy0wJy5cclxuICogKC0wKS50b0ZpeGVkKDEpIGlzICcwLjAnLCBidXQgKC0wLjAxKS50b0ZpeGVkKDEpIGlzICctMC4wJy5cclxuICogKC0wKS50b0ZpeGVkKDMpIGlzICcwLjAwMCcuXHJcbiAqICgtMC41KS50b0ZpeGVkKDApIGlzICctMCcuXHJcbiAqXHJcbiAqL1xyXG5QLnRvRml4ZWQgPSBmdW5jdGlvbiAoZHAsIHJtKSB7XHJcbiAgdmFyIHN0ciwgeSxcclxuICAgIHggPSB0aGlzLFxyXG4gICAgQ3RvciA9IHguY29uc3RydWN0b3I7XHJcblxyXG4gIGlmIChkcCA9PT0gdm9pZCAwKSB7XHJcbiAgICBzdHIgPSBmaW5pdGVUb1N0cmluZyh4KTtcclxuICB9IGVsc2Uge1xyXG4gICAgY2hlY2tJbnQzMihkcCwgMCwgTUFYX0RJR0lUUyk7XHJcblxyXG4gICAgaWYgKHJtID09PSB2b2lkIDApIHJtID0gQ3Rvci5yb3VuZGluZztcclxuICAgIGVsc2UgY2hlY2tJbnQzMihybSwgMCwgOCk7XHJcblxyXG4gICAgeSA9IGZpbmFsaXNlKG5ldyBDdG9yKHgpLCBkcCArIHguZSArIDEsIHJtKTtcclxuICAgIHN0ciA9IGZpbml0ZVRvU3RyaW5nKHksIGZhbHNlLCBkcCArIHkuZSArIDEpO1xyXG4gIH1cclxuXHJcbiAgLy8gVG8gZGV0ZXJtaW5lIHdoZXRoZXIgdG8gYWRkIHRoZSBtaW51cyBzaWduIGxvb2sgYXQgdGhlIHZhbHVlIGJlZm9yZSBpdCB3YXMgcm91bmRlZCxcclxuICAvLyBpLmUuIGxvb2sgYXQgYHhgIHJhdGhlciB0aGFuIGB5YC5cclxuICByZXR1cm4geC5pc05lZygpICYmICF4LmlzWmVybygpID8gJy0nICsgc3RyIDogc3RyO1xyXG59O1xyXG5cclxuXHJcbi8qXHJcbiAqIFJldHVybiBhbiBhcnJheSByZXByZXNlbnRpbmcgdGhlIHZhbHVlIG9mIHRoaXMgRGVjaW1hbCBhcyBhIHNpbXBsZSBmcmFjdGlvbiB3aXRoIGFuIGludGVnZXJcclxuICogbnVtZXJhdG9yIGFuZCBhbiBpbnRlZ2VyIGRlbm9taW5hdG9yLlxyXG4gKlxyXG4gKiBUaGUgZGVub21pbmF0b3Igd2lsbCBiZSBhIHBvc2l0aXZlIG5vbi16ZXJvIHZhbHVlIGxlc3MgdGhhbiBvciBlcXVhbCB0byB0aGUgc3BlY2lmaWVkIG1heGltdW1cclxuICogZGVub21pbmF0b3IuIElmIGEgbWF4aW11bSBkZW5vbWluYXRvciBpcyBub3Qgc3BlY2lmaWVkLCB0aGUgZGVub21pbmF0b3Igd2lsbCBiZSB0aGUgbG93ZXN0XHJcbiAqIHZhbHVlIG5lY2Vzc2FyeSB0byByZXByZXNlbnQgdGhlIG51bWJlciBleGFjdGx5LlxyXG4gKlxyXG4gKiBbbWF4RF0ge251bWJlcnxzdHJpbmd8RGVjaW1hbH0gTWF4aW11bSBkZW5vbWluYXRvci4gSW50ZWdlciA+PSAxIGFuZCA8IEluZmluaXR5LlxyXG4gKlxyXG4gKi9cclxuUC50b0ZyYWN0aW9uID0gZnVuY3Rpb24gKG1heEQpIHtcclxuICB2YXIgZCwgZDAsIGQxLCBkMiwgZSwgaywgbiwgbjAsIG4xLCBwciwgcSwgcixcclxuICAgIHggPSB0aGlzLFxyXG4gICAgeGQgPSB4LmQsXHJcbiAgICBDdG9yID0geC5jb25zdHJ1Y3RvcjtcclxuXHJcbiAgaWYgKCF4ZCkgcmV0dXJuIG5ldyBDdG9yKHgpO1xyXG5cclxuICBuMSA9IGQwID0gbmV3IEN0b3IoMSk7XHJcbiAgZDEgPSBuMCA9IG5ldyBDdG9yKDApO1xyXG5cclxuICBkID0gbmV3IEN0b3IoZDEpO1xyXG4gIGUgPSBkLmUgPSBnZXRQcmVjaXNpb24oeGQpIC0geC5lIC0gMTtcclxuICBrID0gZSAlIExPR19CQVNFO1xyXG4gIGQuZFswXSA9IG1hdGhwb3coMTAsIGsgPCAwID8gTE9HX0JBU0UgKyBrIDogayk7XHJcblxyXG4gIGlmIChtYXhEID09IG51bGwpIHtcclxuXHJcbiAgICAvLyBkIGlzIDEwKiplLCB0aGUgbWluaW11bSBtYXgtZGVub21pbmF0b3IgbmVlZGVkLlxyXG4gICAgbWF4RCA9IGUgPiAwID8gZCA6IG4xO1xyXG4gIH0gZWxzZSB7XHJcbiAgICBuID0gbmV3IEN0b3IobWF4RCk7XHJcbiAgICBpZiAoIW4uaXNJbnQoKSB8fCBuLmx0KG4xKSkgdGhyb3cgRXJyb3IoaW52YWxpZEFyZ3VtZW50ICsgbik7XHJcbiAgICBtYXhEID0gbi5ndChkKSA/IChlID4gMCA/IGQgOiBuMSkgOiBuO1xyXG4gIH1cclxuXHJcbiAgZXh0ZXJuYWwgPSBmYWxzZTtcclxuICBuID0gbmV3IEN0b3IoZGlnaXRzVG9TdHJpbmcoeGQpKTtcclxuICBwciA9IEN0b3IucHJlY2lzaW9uO1xyXG4gIEN0b3IucHJlY2lzaW9uID0gZSA9IHhkLmxlbmd0aCAqIExPR19CQVNFICogMjtcclxuXHJcbiAgZm9yICg7OykgIHtcclxuICAgIHEgPSBkaXZpZGUobiwgZCwgMCwgMSwgMSk7XHJcbiAgICBkMiA9IGQwLnBsdXMocS50aW1lcyhkMSkpO1xyXG4gICAgaWYgKGQyLmNtcChtYXhEKSA9PSAxKSBicmVhaztcclxuICAgIGQwID0gZDE7XHJcbiAgICBkMSA9IGQyO1xyXG4gICAgZDIgPSBuMTtcclxuICAgIG4xID0gbjAucGx1cyhxLnRpbWVzKGQyKSk7XHJcbiAgICBuMCA9IGQyO1xyXG4gICAgZDIgPSBkO1xyXG4gICAgZCA9IG4ubWludXMocS50aW1lcyhkMikpO1xyXG4gICAgbiA9IGQyO1xyXG4gIH1cclxuXHJcbiAgZDIgPSBkaXZpZGUobWF4RC5taW51cyhkMCksIGQxLCAwLCAxLCAxKTtcclxuICBuMCA9IG4wLnBsdXMoZDIudGltZXMobjEpKTtcclxuICBkMCA9IGQwLnBsdXMoZDIudGltZXMoZDEpKTtcclxuICBuMC5zID0gbjEucyA9IHgucztcclxuXHJcbiAgLy8gRGV0ZXJtaW5lIHdoaWNoIGZyYWN0aW9uIGlzIGNsb3NlciB0byB4LCBuMC9kMCBvciBuMS9kMT9cclxuICByID0gZGl2aWRlKG4xLCBkMSwgZSwgMSkubWludXMoeCkuYWJzKCkuY21wKGRpdmlkZShuMCwgZDAsIGUsIDEpLm1pbnVzKHgpLmFicygpKSA8IDFcclxuICAgICAgPyBbbjEsIGQxXSA6IFtuMCwgZDBdO1xyXG5cclxuICBDdG9yLnByZWNpc2lvbiA9IHByO1xyXG4gIGV4dGVybmFsID0gdHJ1ZTtcclxuXHJcbiAgcmV0dXJuIHI7XHJcbn07XHJcblxyXG5cclxuLypcclxuICogUmV0dXJuIGEgc3RyaW5nIHJlcHJlc2VudGluZyB0aGUgdmFsdWUgb2YgdGhpcyBEZWNpbWFsIGluIGJhc2UgMTYsIHJvdW5kIHRvIGBzZGAgc2lnbmlmaWNhbnRcclxuICogZGlnaXRzIHVzaW5nIHJvdW5kaW5nIG1vZGUgYHJtYC5cclxuICpcclxuICogSWYgdGhlIG9wdGlvbmFsIGBzZGAgYXJndW1lbnQgaXMgcHJlc2VudCB0aGVuIHJldHVybiBiaW5hcnkgZXhwb25lbnRpYWwgbm90YXRpb24uXHJcbiAqXHJcbiAqIFtzZF0ge251bWJlcn0gU2lnbmlmaWNhbnQgZGlnaXRzLiBJbnRlZ2VyLCAxIHRvIE1BWF9ESUdJVFMgaW5jbHVzaXZlLlxyXG4gKiBbcm1dIHtudW1iZXJ9IFJvdW5kaW5nIG1vZGUuIEludGVnZXIsIDAgdG8gOCBpbmNsdXNpdmUuXHJcbiAqXHJcbiAqL1xyXG5QLnRvSGV4YWRlY2ltYWwgPSBQLnRvSGV4ID0gZnVuY3Rpb24gKHNkLCBybSkge1xyXG4gIHJldHVybiB0b1N0cmluZ0JpbmFyeSh0aGlzLCAxNiwgc2QsIHJtKTtcclxufTtcclxuXHJcblxyXG4vKlxyXG4gKiBSZXR1cm5zIGEgbmV3IERlY2ltYWwgd2hvc2UgdmFsdWUgaXMgdGhlIG5lYXJlc3QgbXVsdGlwbGUgb2YgYHlgIGluIHRoZSBkaXJlY3Rpb24gb2Ygcm91bmRpbmdcclxuICogbW9kZSBgcm1gLCBvciBgRGVjaW1hbC5yb3VuZGluZ2AgaWYgYHJtYCBpcyBvbWl0dGVkLCB0byB0aGUgdmFsdWUgb2YgdGhpcyBEZWNpbWFsLlxyXG4gKlxyXG4gKiBUaGUgcmV0dXJuIHZhbHVlIHdpbGwgYWx3YXlzIGhhdmUgdGhlIHNhbWUgc2lnbiBhcyB0aGlzIERlY2ltYWwsIHVubGVzcyBlaXRoZXIgdGhpcyBEZWNpbWFsXHJcbiAqIG9yIGB5YCBpcyBOYU4sIGluIHdoaWNoIGNhc2UgdGhlIHJldHVybiB2YWx1ZSB3aWxsIGJlIGFsc28gYmUgTmFOLlxyXG4gKlxyXG4gKiBUaGUgcmV0dXJuIHZhbHVlIGlzIG5vdCBhZmZlY3RlZCBieSB0aGUgdmFsdWUgb2YgYHByZWNpc2lvbmAuXHJcbiAqXHJcbiAqIHkge251bWJlcnxzdHJpbmd8RGVjaW1hbH0gVGhlIG1hZ25pdHVkZSB0byByb3VuZCB0byBhIG11bHRpcGxlIG9mLlxyXG4gKiBbcm1dIHtudW1iZXJ9IFJvdW5kaW5nIG1vZGUuIEludGVnZXIsIDAgdG8gOCBpbmNsdXNpdmUuXHJcbiAqXHJcbiAqICd0b05lYXJlc3QoKSByb3VuZGluZyBtb2RlIG5vdCBhbiBpbnRlZ2VyOiB7cm19J1xyXG4gKiAndG9OZWFyZXN0KCkgcm91bmRpbmcgbW9kZSBvdXQgb2YgcmFuZ2U6IHtybX0nXHJcbiAqXHJcbiAqL1xyXG5QLnRvTmVhcmVzdCA9IGZ1bmN0aW9uICh5LCBybSkge1xyXG4gIHZhciB4ID0gdGhpcyxcclxuICAgIEN0b3IgPSB4LmNvbnN0cnVjdG9yO1xyXG5cclxuICB4ID0gbmV3IEN0b3IoeCk7XHJcblxyXG4gIGlmICh5ID09IG51bGwpIHtcclxuXHJcbiAgICAvLyBJZiB4IGlzIG5vdCBmaW5pdGUsIHJldHVybiB4LlxyXG4gICAgaWYgKCF4LmQpIHJldHVybiB4O1xyXG5cclxuICAgIHkgPSBuZXcgQ3RvcigxKTtcclxuICAgIHJtID0gQ3Rvci5yb3VuZGluZztcclxuICB9IGVsc2Uge1xyXG4gICAgeSA9IG5ldyBDdG9yKHkpO1xyXG4gICAgaWYgKHJtID09PSB2b2lkIDApIHtcclxuICAgICAgcm0gPSBDdG9yLnJvdW5kaW5nO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgY2hlY2tJbnQzMihybSwgMCwgOCk7XHJcbiAgICB9XHJcblxyXG4gICAgLy8gSWYgeCBpcyBub3QgZmluaXRlLCByZXR1cm4geCBpZiB5IGlzIG5vdCBOYU4sIGVsc2UgTmFOLlxyXG4gICAgaWYgKCF4LmQpIHJldHVybiB5LnMgPyB4IDogeTtcclxuXHJcbiAgICAvLyBJZiB5IGlzIG5vdCBmaW5pdGUsIHJldHVybiBJbmZpbml0eSB3aXRoIHRoZSBzaWduIG9mIHggaWYgeSBpcyBJbmZpbml0eSwgZWxzZSBOYU4uXHJcbiAgICBpZiAoIXkuZCkge1xyXG4gICAgICBpZiAoeS5zKSB5LnMgPSB4LnM7XHJcbiAgICAgIHJldHVybiB5O1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgLy8gSWYgeSBpcyBub3QgemVybywgY2FsY3VsYXRlIHRoZSBuZWFyZXN0IG11bHRpcGxlIG9mIHkgdG8geC5cclxuICBpZiAoeS5kWzBdKSB7XHJcbiAgICBleHRlcm5hbCA9IGZhbHNlO1xyXG4gICAgeCA9IGRpdmlkZSh4LCB5LCAwLCBybSwgMSkudGltZXMoeSk7XHJcbiAgICBleHRlcm5hbCA9IHRydWU7XHJcbiAgICBmaW5hbGlzZSh4KTtcclxuXHJcbiAgLy8gSWYgeSBpcyB6ZXJvLCByZXR1cm4gemVybyB3aXRoIHRoZSBzaWduIG9mIHguXHJcbiAgfSBlbHNlIHtcclxuICAgIHkucyA9IHgucztcclxuICAgIHggPSB5O1xyXG4gIH1cclxuXHJcbiAgcmV0dXJuIHg7XHJcbn07XHJcblxyXG5cclxuLypcclxuICogUmV0dXJuIHRoZSB2YWx1ZSBvZiB0aGlzIERlY2ltYWwgY29udmVydGVkIHRvIGEgbnVtYmVyIHByaW1pdGl2ZS5cclxuICogWmVybyBrZWVwcyBpdHMgc2lnbi5cclxuICpcclxuICovXHJcblAudG9OdW1iZXIgPSBmdW5jdGlvbiAoKSB7XHJcbiAgcmV0dXJuICt0aGlzO1xyXG59O1xyXG5cclxuXHJcbi8qXHJcbiAqIFJldHVybiBhIHN0cmluZyByZXByZXNlbnRpbmcgdGhlIHZhbHVlIG9mIHRoaXMgRGVjaW1hbCBpbiBiYXNlIDgsIHJvdW5kIHRvIGBzZGAgc2lnbmlmaWNhbnRcclxuICogZGlnaXRzIHVzaW5nIHJvdW5kaW5nIG1vZGUgYHJtYC5cclxuICpcclxuICogSWYgdGhlIG9wdGlvbmFsIGBzZGAgYXJndW1lbnQgaXMgcHJlc2VudCB0aGVuIHJldHVybiBiaW5hcnkgZXhwb25lbnRpYWwgbm90YXRpb24uXHJcbiAqXHJcbiAqIFtzZF0ge251bWJlcn0gU2lnbmlmaWNhbnQgZGlnaXRzLiBJbnRlZ2VyLCAxIHRvIE1BWF9ESUdJVFMgaW5jbHVzaXZlLlxyXG4gKiBbcm1dIHtudW1iZXJ9IFJvdW5kaW5nIG1vZGUuIEludGVnZXIsIDAgdG8gOCBpbmNsdXNpdmUuXHJcbiAqXHJcbiAqL1xyXG5QLnRvT2N0YWwgPSBmdW5jdGlvbiAoc2QsIHJtKSB7XHJcbiAgcmV0dXJuIHRvU3RyaW5nQmluYXJ5KHRoaXMsIDgsIHNkLCBybSk7XHJcbn07XHJcblxyXG5cclxuLypcclxuICogUmV0dXJuIGEgbmV3IERlY2ltYWwgd2hvc2UgdmFsdWUgaXMgdGhlIHZhbHVlIG9mIHRoaXMgRGVjaW1hbCByYWlzZWQgdG8gdGhlIHBvd2VyIGB5YCwgcm91bmRlZFxyXG4gKiB0byBgcHJlY2lzaW9uYCBzaWduaWZpY2FudCBkaWdpdHMgdXNpbmcgcm91bmRpbmcgbW9kZSBgcm91bmRpbmdgLlxyXG4gKlxyXG4gKiBFQ01BU2NyaXB0IGNvbXBsaWFudC5cclxuICpcclxuICogICBwb3coeCwgTmFOKSAgICAgICAgICAgICAgICAgICAgICAgICAgID0gTmFOXHJcbiAqICAgcG93KHgsIFx1MDBCMTApICAgICAgICAgICAgICAgICAgICAgICAgICAgID0gMVxyXG5cclxuICogICBwb3coTmFOLCBub24temVybykgICAgICAgICAgICAgICAgICAgID0gTmFOXHJcbiAqICAgcG93KGFicyh4KSA+IDEsICtJbmZpbml0eSkgICAgICAgICAgICA9ICtJbmZpbml0eVxyXG4gKiAgIHBvdyhhYnMoeCkgPiAxLCAtSW5maW5pdHkpICAgICAgICAgICAgPSArMFxyXG4gKiAgIHBvdyhhYnMoeCkgPT0gMSwgXHUwMEIxSW5maW5pdHkpICAgICAgICAgICA9IE5hTlxyXG4gKiAgIHBvdyhhYnMoeCkgPCAxLCArSW5maW5pdHkpICAgICAgICAgICAgPSArMFxyXG4gKiAgIHBvdyhhYnMoeCkgPCAxLCAtSW5maW5pdHkpICAgICAgICAgICAgPSArSW5maW5pdHlcclxuICogICBwb3coK0luZmluaXR5LCB5ID4gMCkgICAgICAgICAgICAgICAgID0gK0luZmluaXR5XHJcbiAqICAgcG93KCtJbmZpbml0eSwgeSA8IDApICAgICAgICAgICAgICAgICA9ICswXHJcbiAqICAgcG93KC1JbmZpbml0eSwgb2RkIGludGVnZXIgPiAwKSAgICAgICA9IC1JbmZpbml0eVxyXG4gKiAgIHBvdygtSW5maW5pdHksIGV2ZW4gaW50ZWdlciA+IDApICAgICAgPSArSW5maW5pdHlcclxuICogICBwb3coLUluZmluaXR5LCBvZGQgaW50ZWdlciA8IDApICAgICAgID0gLTBcclxuICogICBwb3coLUluZmluaXR5LCBldmVuIGludGVnZXIgPCAwKSAgICAgID0gKzBcclxuICogICBwb3coKzAsIHkgPiAwKSAgICAgICAgICAgICAgICAgICAgICAgID0gKzBcclxuICogICBwb3coKzAsIHkgPCAwKSAgICAgICAgICAgICAgICAgICAgICAgID0gK0luZmluaXR5XHJcbiAqICAgcG93KC0wLCBvZGQgaW50ZWdlciA+IDApICAgICAgICAgICAgICA9IC0wXHJcbiAqICAgcG93KC0wLCBldmVuIGludGVnZXIgPiAwKSAgICAgICAgICAgICA9ICswXHJcbiAqICAgcG93KC0wLCBvZGQgaW50ZWdlciA8IDApICAgICAgICAgICAgICA9IC1JbmZpbml0eVxyXG4gKiAgIHBvdygtMCwgZXZlbiBpbnRlZ2VyIDwgMCkgICAgICAgICAgICAgPSArSW5maW5pdHlcclxuICogICBwb3coZmluaXRlIHggPCAwLCBmaW5pdGUgbm9uLWludGVnZXIpID0gTmFOXHJcbiAqXHJcbiAqIEZvciBub24taW50ZWdlciBvciB2ZXJ5IGxhcmdlIGV4cG9uZW50cyBwb3coeCwgeSkgaXMgY2FsY3VsYXRlZCB1c2luZ1xyXG4gKlxyXG4gKiAgIHheeSA9IGV4cCh5KmxuKHgpKVxyXG4gKlxyXG4gKiBBc3N1bWluZyB0aGUgZmlyc3QgMTUgcm91bmRpbmcgZGlnaXRzIGFyZSBlYWNoIGVxdWFsbHkgbGlrZWx5IHRvIGJlIGFueSBkaWdpdCAwLTksIHRoZVxyXG4gKiBwcm9iYWJpbGl0eSBvZiBhbiBpbmNvcnJlY3RseSByb3VuZGVkIHJlc3VsdFxyXG4gKiBQKFs0OV05ezE0fSB8IFs1MF0wezE0fSkgPSAyICogMC4yICogMTBeLTE0ID0gNGUtMTUgPSAxLzIuNWUrMTRcclxuICogaS5lLiAxIGluIDI1MCwwMDAsMDAwLDAwMCwwMDBcclxuICpcclxuICogSWYgYSByZXN1bHQgaXMgaW5jb3JyZWN0bHkgcm91bmRlZCB0aGUgbWF4aW11bSBlcnJvciB3aWxsIGJlIDEgdWxwICh1bml0IGluIGxhc3QgcGxhY2UpLlxyXG4gKlxyXG4gKiB5IHtudW1iZXJ8c3RyaW5nfERlY2ltYWx9IFRoZSBwb3dlciB0byB3aGljaCB0byByYWlzZSB0aGlzIERlY2ltYWwuXHJcbiAqXHJcbiAqL1xyXG5QLnRvUG93ZXIgPSBQLnBvdyA9IGZ1bmN0aW9uICh5KSB7XHJcbiAgdmFyIGUsIGssIHByLCByLCBybSwgcyxcclxuICAgIHggPSB0aGlzLFxyXG4gICAgQ3RvciA9IHguY29uc3RydWN0b3IsXHJcbiAgICB5biA9ICsoeSA9IG5ldyBDdG9yKHkpKTtcclxuXHJcbiAgLy8gRWl0aGVyIFx1MDBCMUluZmluaXR5LCBOYU4gb3IgXHUwMEIxMD9cclxuICBpZiAoIXguZCB8fCAheS5kIHx8ICF4LmRbMF0gfHwgIXkuZFswXSkgcmV0dXJuIG5ldyBDdG9yKG1hdGhwb3coK3gsIHluKSk7XHJcblxyXG4gIHggPSBuZXcgQ3Rvcih4KTtcclxuXHJcbiAgaWYgKHguZXEoMSkpIHJldHVybiB4O1xyXG5cclxuICBwciA9IEN0b3IucHJlY2lzaW9uO1xyXG4gIHJtID0gQ3Rvci5yb3VuZGluZztcclxuXHJcbiAgaWYgKHkuZXEoMSkpIHJldHVybiBmaW5hbGlzZSh4LCBwciwgcm0pO1xyXG5cclxuICAvLyB5IGV4cG9uZW50XHJcbiAgZSA9IG1hdGhmbG9vcih5LmUgLyBMT0dfQkFTRSk7XHJcblxyXG4gIC8vIElmIHkgaXMgYSBzbWFsbCBpbnRlZ2VyIHVzZSB0aGUgJ2V4cG9uZW50aWF0aW9uIGJ5IHNxdWFyaW5nJyBhbGdvcml0aG0uXHJcbiAgaWYgKGUgPj0geS5kLmxlbmd0aCAtIDEgJiYgKGsgPSB5biA8IDAgPyAteW4gOiB5bikgPD0gTUFYX1NBRkVfSU5URUdFUikge1xyXG4gICAgciA9IGludFBvdyhDdG9yLCB4LCBrLCBwcik7XHJcbiAgICByZXR1cm4geS5zIDwgMCA/IG5ldyBDdG9yKDEpLmRpdihyKSA6IGZpbmFsaXNlKHIsIHByLCBybSk7XHJcbiAgfVxyXG5cclxuICBzID0geC5zO1xyXG5cclxuICAvLyBpZiB4IGlzIG5lZ2F0aXZlXHJcbiAgaWYgKHMgPCAwKSB7XHJcblxyXG4gICAgLy8gaWYgeSBpcyBub3QgYW4gaW50ZWdlclxyXG4gICAgaWYgKGUgPCB5LmQubGVuZ3RoIC0gMSkgcmV0dXJuIG5ldyBDdG9yKE5hTik7XHJcblxyXG4gICAgLy8gUmVzdWx0IGlzIHBvc2l0aXZlIGlmIHggaXMgbmVnYXRpdmUgYW5kIHRoZSBsYXN0IGRpZ2l0IG9mIGludGVnZXIgeSBpcyBldmVuLlxyXG4gICAgaWYgKCh5LmRbZV0gJiAxKSA9PSAwKSBzID0gMTtcclxuXHJcbiAgICAvLyBpZiB4LmVxKC0xKVxyXG4gICAgaWYgKHguZSA9PSAwICYmIHguZFswXSA9PSAxICYmIHguZC5sZW5ndGggPT0gMSkge1xyXG4gICAgICB4LnMgPSBzO1xyXG4gICAgICByZXR1cm4geDtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIC8vIEVzdGltYXRlIHJlc3VsdCBleHBvbmVudC5cclxuICAvLyB4XnkgPSAxMF5lLCAgd2hlcmUgZSA9IHkgKiBsb2cxMCh4KVxyXG4gIC8vIGxvZzEwKHgpID0gbG9nMTAoeF9zaWduaWZpY2FuZCkgKyB4X2V4cG9uZW50XHJcbiAgLy8gbG9nMTAoeF9zaWduaWZpY2FuZCkgPSBsbih4X3NpZ25pZmljYW5kKSAvIGxuKDEwKVxyXG4gIGsgPSBtYXRocG93KCt4LCB5bik7XHJcbiAgZSA9IGsgPT0gMCB8fCAhaXNGaW5pdGUoaylcclxuICAgID8gbWF0aGZsb29yKHluICogKE1hdGgubG9nKCcwLicgKyBkaWdpdHNUb1N0cmluZyh4LmQpKSAvIE1hdGguTE4xMCArIHguZSArIDEpKVxyXG4gICAgOiBuZXcgQ3RvcihrICsgJycpLmU7XHJcblxyXG4gIC8vIEV4cG9uZW50IGVzdGltYXRlIG1heSBiZSBpbmNvcnJlY3QgZS5nLiB4OiAwLjk5OTk5OTk5OTk5OTk5OTk5OSwgeTogMi4yOSwgZTogMCwgci5lOiAtMS5cclxuXHJcbiAgLy8gT3ZlcmZsb3cvdW5kZXJmbG93P1xyXG4gIGlmIChlID4gQ3Rvci5tYXhFICsgMSB8fCBlIDwgQ3Rvci5taW5FIC0gMSkgcmV0dXJuIG5ldyBDdG9yKGUgPiAwID8gcyAvIDAgOiAwKTtcclxuXHJcbiAgZXh0ZXJuYWwgPSBmYWxzZTtcclxuICBDdG9yLnJvdW5kaW5nID0geC5zID0gMTtcclxuXHJcbiAgLy8gRXN0aW1hdGUgdGhlIGV4dHJhIGd1YXJkIGRpZ2l0cyBuZWVkZWQgdG8gZW5zdXJlIGZpdmUgY29ycmVjdCByb3VuZGluZyBkaWdpdHMgZnJvbVxyXG4gIC8vIG5hdHVyYWxMb2dhcml0aG0oeCkuIEV4YW1wbGUgb2YgZmFpbHVyZSB3aXRob3V0IHRoZXNlIGV4dHJhIGRpZ2l0cyAocHJlY2lzaW9uOiAxMCk6XHJcbiAgLy8gbmV3IERlY2ltYWwoMi4zMjQ1NikucG93KCcyMDg3OTg3NDM2NTM0NTY2LjQ2NDExJylcclxuICAvLyBzaG91bGQgYmUgMS4xNjIzNzc4MjNlKzc2NDkxNDkwNTE3MzgxNSwgYnV0IGlzIDEuMTYyMzU1ODIzZSs3NjQ5MTQ5MDUxNzM4MTVcclxuICBrID0gTWF0aC5taW4oMTIsIChlICsgJycpLmxlbmd0aCk7XHJcblxyXG4gIC8vIHIgPSB4XnkgPSBleHAoeSpsbih4KSlcclxuICByID0gbmF0dXJhbEV4cG9uZW50aWFsKHkudGltZXMobmF0dXJhbExvZ2FyaXRobSh4LCBwciArIGspKSwgcHIpO1xyXG5cclxuICAvLyByIG1heSBiZSBJbmZpbml0eSwgZS5nLiAoMC45OTk5OTk5OTk5OTk5OTk5KS5wb3coLTFlKzQwKVxyXG4gIGlmIChyLmQpIHtcclxuXHJcbiAgICAvLyBUcnVuY2F0ZSB0byB0aGUgcmVxdWlyZWQgcHJlY2lzaW9uIHBsdXMgZml2ZSByb3VuZGluZyBkaWdpdHMuXHJcbiAgICByID0gZmluYWxpc2UociwgcHIgKyA1LCAxKTtcclxuXHJcbiAgICAvLyBJZiB0aGUgcm91bmRpbmcgZGlnaXRzIGFyZSBbNDldOTk5OSBvciBbNTBdMDAwMCBpbmNyZWFzZSB0aGUgcHJlY2lzaW9uIGJ5IDEwIGFuZCByZWNhbGN1bGF0ZVxyXG4gICAgLy8gdGhlIHJlc3VsdC5cclxuICAgIGlmIChjaGVja1JvdW5kaW5nRGlnaXRzKHIuZCwgcHIsIHJtKSkge1xyXG4gICAgICBlID0gcHIgKyAxMDtcclxuXHJcbiAgICAgIC8vIFRydW5jYXRlIHRvIHRoZSBpbmNyZWFzZWQgcHJlY2lzaW9uIHBsdXMgZml2ZSByb3VuZGluZyBkaWdpdHMuXHJcbiAgICAgIHIgPSBmaW5hbGlzZShuYXR1cmFsRXhwb25lbnRpYWwoeS50aW1lcyhuYXR1cmFsTG9nYXJpdGhtKHgsIGUgKyBrKSksIGUpLCBlICsgNSwgMSk7XHJcblxyXG4gICAgICAvLyBDaGVjayBmb3IgMTQgbmluZXMgZnJvbSB0aGUgMm5kIHJvdW5kaW5nIGRpZ2l0ICh0aGUgZmlyc3Qgcm91bmRpbmcgZGlnaXQgbWF5IGJlIDQgb3IgOSkuXHJcbiAgICAgIGlmICgrZGlnaXRzVG9TdHJpbmcoci5kKS5zbGljZShwciArIDEsIHByICsgMTUpICsgMSA9PSAxZTE0KSB7XHJcbiAgICAgICAgciA9IGZpbmFsaXNlKHIsIHByICsgMSwgMCk7XHJcbiAgICAgIH1cclxuICAgIH1cclxuICB9XHJcblxyXG4gIHIucyA9IHM7XHJcbiAgZXh0ZXJuYWwgPSB0cnVlO1xyXG4gIEN0b3Iucm91bmRpbmcgPSBybTtcclxuXHJcbiAgcmV0dXJuIGZpbmFsaXNlKHIsIHByLCBybSk7XHJcbn07XHJcblxyXG5cclxuLypcclxuICogUmV0dXJuIGEgc3RyaW5nIHJlcHJlc2VudGluZyB0aGUgdmFsdWUgb2YgdGhpcyBEZWNpbWFsIHJvdW5kZWQgdG8gYHNkYCBzaWduaWZpY2FudCBkaWdpdHNcclxuICogdXNpbmcgcm91bmRpbmcgbW9kZSBgcm91bmRpbmdgLlxyXG4gKlxyXG4gKiBSZXR1cm4gZXhwb25lbnRpYWwgbm90YXRpb24gaWYgYHNkYCBpcyBsZXNzIHRoYW4gdGhlIG51bWJlciBvZiBkaWdpdHMgbmVjZXNzYXJ5IHRvIHJlcHJlc2VudFxyXG4gKiB0aGUgaW50ZWdlciBwYXJ0IG9mIHRoZSB2YWx1ZSBpbiBub3JtYWwgbm90YXRpb24uXHJcbiAqXHJcbiAqIFtzZF0ge251bWJlcn0gU2lnbmlmaWNhbnQgZGlnaXRzLiBJbnRlZ2VyLCAxIHRvIE1BWF9ESUdJVFMgaW5jbHVzaXZlLlxyXG4gKiBbcm1dIHtudW1iZXJ9IFJvdW5kaW5nIG1vZGUuIEludGVnZXIsIDAgdG8gOCBpbmNsdXNpdmUuXHJcbiAqXHJcbiAqL1xyXG5QLnRvUHJlY2lzaW9uID0gZnVuY3Rpb24gKHNkLCBybSkge1xyXG4gIHZhciBzdHIsXHJcbiAgICB4ID0gdGhpcyxcclxuICAgIEN0b3IgPSB4LmNvbnN0cnVjdG9yO1xyXG5cclxuICBpZiAoc2QgPT09IHZvaWQgMCkge1xyXG4gICAgc3RyID0gZmluaXRlVG9TdHJpbmcoeCwgeC5lIDw9IEN0b3IudG9FeHBOZWcgfHwgeC5lID49IEN0b3IudG9FeHBQb3MpO1xyXG4gIH0gZWxzZSB7XHJcbiAgICBjaGVja0ludDMyKHNkLCAxLCBNQVhfRElHSVRTKTtcclxuXHJcbiAgICBpZiAocm0gPT09IHZvaWQgMCkgcm0gPSBDdG9yLnJvdW5kaW5nO1xyXG4gICAgZWxzZSBjaGVja0ludDMyKHJtLCAwLCA4KTtcclxuXHJcbiAgICB4ID0gZmluYWxpc2UobmV3IEN0b3IoeCksIHNkLCBybSk7XHJcbiAgICBzdHIgPSBmaW5pdGVUb1N0cmluZyh4LCBzZCA8PSB4LmUgfHwgeC5lIDw9IEN0b3IudG9FeHBOZWcsIHNkKTtcclxuICB9XHJcblxyXG4gIHJldHVybiB4LmlzTmVnKCkgJiYgIXguaXNaZXJvKCkgPyAnLScgKyBzdHIgOiBzdHI7XHJcbn07XHJcblxyXG5cclxuLypcclxuICogUmV0dXJuIGEgbmV3IERlY2ltYWwgd2hvc2UgdmFsdWUgaXMgdGhlIHZhbHVlIG9mIHRoaXMgRGVjaW1hbCByb3VuZGVkIHRvIGEgbWF4aW11bSBvZiBgc2RgXHJcbiAqIHNpZ25pZmljYW50IGRpZ2l0cyB1c2luZyByb3VuZGluZyBtb2RlIGBybWAsIG9yIHRvIGBwcmVjaXNpb25gIGFuZCBgcm91bmRpbmdgIHJlc3BlY3RpdmVseSBpZlxyXG4gKiBvbWl0dGVkLlxyXG4gKlxyXG4gKiBbc2RdIHtudW1iZXJ9IFNpZ25pZmljYW50IGRpZ2l0cy4gSW50ZWdlciwgMSB0byBNQVhfRElHSVRTIGluY2x1c2l2ZS5cclxuICogW3JtXSB7bnVtYmVyfSBSb3VuZGluZyBtb2RlLiBJbnRlZ2VyLCAwIHRvIDggaW5jbHVzaXZlLlxyXG4gKlxyXG4gKiAndG9TRCgpIGRpZ2l0cyBvdXQgb2YgcmFuZ2U6IHtzZH0nXHJcbiAqICd0b1NEKCkgZGlnaXRzIG5vdCBhbiBpbnRlZ2VyOiB7c2R9J1xyXG4gKiAndG9TRCgpIHJvdW5kaW5nIG1vZGUgbm90IGFuIGludGVnZXI6IHtybX0nXHJcbiAqICd0b1NEKCkgcm91bmRpbmcgbW9kZSBvdXQgb2YgcmFuZ2U6IHtybX0nXHJcbiAqXHJcbiAqL1xyXG5QLnRvU2lnbmlmaWNhbnREaWdpdHMgPSBQLnRvU0QgPSBmdW5jdGlvbiAoc2QsIHJtKSB7XHJcbiAgdmFyIHggPSB0aGlzLFxyXG4gICAgQ3RvciA9IHguY29uc3RydWN0b3I7XHJcblxyXG4gIGlmIChzZCA9PT0gdm9pZCAwKSB7XHJcbiAgICBzZCA9IEN0b3IucHJlY2lzaW9uO1xyXG4gICAgcm0gPSBDdG9yLnJvdW5kaW5nO1xyXG4gIH0gZWxzZSB7XHJcbiAgICBjaGVja0ludDMyKHNkLCAxLCBNQVhfRElHSVRTKTtcclxuXHJcbiAgICBpZiAocm0gPT09IHZvaWQgMCkgcm0gPSBDdG9yLnJvdW5kaW5nO1xyXG4gICAgZWxzZSBjaGVja0ludDMyKHJtLCAwLCA4KTtcclxuICB9XHJcblxyXG4gIHJldHVybiBmaW5hbGlzZShuZXcgQ3Rvcih4KSwgc2QsIHJtKTtcclxufTtcclxuXHJcblxyXG4vKlxyXG4gKiBSZXR1cm4gYSBzdHJpbmcgcmVwcmVzZW50aW5nIHRoZSB2YWx1ZSBvZiB0aGlzIERlY2ltYWwuXHJcbiAqXHJcbiAqIFJldHVybiBleHBvbmVudGlhbCBub3RhdGlvbiBpZiB0aGlzIERlY2ltYWwgaGFzIGEgcG9zaXRpdmUgZXhwb25lbnQgZXF1YWwgdG8gb3IgZ3JlYXRlciB0aGFuXHJcbiAqIGB0b0V4cFBvc2AsIG9yIGEgbmVnYXRpdmUgZXhwb25lbnQgZXF1YWwgdG8gb3IgbGVzcyB0aGFuIGB0b0V4cE5lZ2AuXHJcbiAqXHJcbiAqL1xyXG5QLnRvU3RyaW5nID0gZnVuY3Rpb24gKCkge1xyXG4gIHZhciB4ID0gdGhpcyxcclxuICAgIEN0b3IgPSB4LmNvbnN0cnVjdG9yLFxyXG4gICAgc3RyID0gZmluaXRlVG9TdHJpbmcoeCwgeC5lIDw9IEN0b3IudG9FeHBOZWcgfHwgeC5lID49IEN0b3IudG9FeHBQb3MpO1xyXG5cclxuICByZXR1cm4geC5pc05lZygpICYmICF4LmlzWmVybygpID8gJy0nICsgc3RyIDogc3RyO1xyXG59O1xyXG5cclxuXHJcbi8qXHJcbiAqIFJldHVybiBhIG5ldyBEZWNpbWFsIHdob3NlIHZhbHVlIGlzIHRoZSB2YWx1ZSBvZiB0aGlzIERlY2ltYWwgdHJ1bmNhdGVkIHRvIGEgd2hvbGUgbnVtYmVyLlxyXG4gKlxyXG4gKi9cclxuUC50cnVuY2F0ZWQgPSBQLnRydW5jID0gZnVuY3Rpb24gKCkge1xyXG4gIHJldHVybiBmaW5hbGlzZShuZXcgdGhpcy5jb25zdHJ1Y3Rvcih0aGlzKSwgdGhpcy5lICsgMSwgMSk7XHJcbn07XHJcblxyXG5cclxuLypcclxuICogUmV0dXJuIGEgc3RyaW5nIHJlcHJlc2VudGluZyB0aGUgdmFsdWUgb2YgdGhpcyBEZWNpbWFsLlxyXG4gKiBVbmxpa2UgYHRvU3RyaW5nYCwgbmVnYXRpdmUgemVybyB3aWxsIGluY2x1ZGUgdGhlIG1pbnVzIHNpZ24uXHJcbiAqXHJcbiAqL1xyXG5QLnZhbHVlT2YgPSBQLnRvSlNPTiA9IGZ1bmN0aW9uICgpIHtcclxuICB2YXIgeCA9IHRoaXMsXHJcbiAgICBDdG9yID0geC5jb25zdHJ1Y3RvcixcclxuICAgIHN0ciA9IGZpbml0ZVRvU3RyaW5nKHgsIHguZSA8PSBDdG9yLnRvRXhwTmVnIHx8IHguZSA+PSBDdG9yLnRvRXhwUG9zKTtcclxuXHJcbiAgcmV0dXJuIHguaXNOZWcoKSA/ICctJyArIHN0ciA6IHN0cjtcclxufTtcclxuXHJcblxyXG4vLyBIZWxwZXIgZnVuY3Rpb25zIGZvciBEZWNpbWFsLnByb3RvdHlwZSAoUCkgYW5kL29yIERlY2ltYWwgbWV0aG9kcywgYW5kIHRoZWlyIGNhbGxlcnMuXHJcblxyXG5cclxuLypcclxuICogIGRpZ2l0c1RvU3RyaW5nICAgICAgICAgICBQLmN1YmVSb290LCBQLmxvZ2FyaXRobSwgUC5zcXVhcmVSb290LCBQLnRvRnJhY3Rpb24sIFAudG9Qb3dlcixcclxuICogICAgICAgICAgICAgICAgICAgICAgICAgICBmaW5pdGVUb1N0cmluZywgbmF0dXJhbEV4cG9uZW50aWFsLCBuYXR1cmFsTG9nYXJpdGhtXHJcbiAqICBjaGVja0ludDMyICAgICAgICAgICAgICAgUC50b0RlY2ltYWxQbGFjZXMsIFAudG9FeHBvbmVudGlhbCwgUC50b0ZpeGVkLCBQLnRvTmVhcmVzdCxcclxuICogICAgICAgICAgICAgICAgICAgICAgICAgICBQLnRvUHJlY2lzaW9uLCBQLnRvU2lnbmlmaWNhbnREaWdpdHMsIHRvU3RyaW5nQmluYXJ5LCByYW5kb21cclxuICogIGNoZWNrUm91bmRpbmdEaWdpdHMgICAgICBQLmxvZ2FyaXRobSwgUC50b1Bvd2VyLCBuYXR1cmFsRXhwb25lbnRpYWwsIG5hdHVyYWxMb2dhcml0aG1cclxuICogIGNvbnZlcnRCYXNlICAgICAgICAgICAgICB0b1N0cmluZ0JpbmFyeSwgcGFyc2VPdGhlclxyXG4gKiAgY29zICAgICAgICAgICAgICAgICAgICAgIFAuY29zXHJcbiAqICBkaXZpZGUgICAgICAgICAgICAgICAgICAgUC5hdGFuaCwgUC5jdWJlUm9vdCwgUC5kaXZpZGVkQnksIFAuZGl2aWRlZFRvSW50ZWdlckJ5LFxyXG4gKiAgICAgICAgICAgICAgICAgICAgICAgICAgIFAubG9nYXJpdGhtLCBQLm1vZHVsbywgUC5zcXVhcmVSb290LCBQLnRhbiwgUC50YW5oLCBQLnRvRnJhY3Rpb24sXHJcbiAqICAgICAgICAgICAgICAgICAgICAgICAgICAgUC50b05lYXJlc3QsIHRvU3RyaW5nQmluYXJ5LCBuYXR1cmFsRXhwb25lbnRpYWwsIG5hdHVyYWxMb2dhcml0aG0sXHJcbiAqICAgICAgICAgICAgICAgICAgICAgICAgICAgdGF5bG9yU2VyaWVzLCBhdGFuMiwgcGFyc2VPdGhlclxyXG4gKiAgZmluYWxpc2UgICAgICAgICAgICAgICAgIFAuYWJzb2x1dGVWYWx1ZSwgUC5hdGFuLCBQLmF0YW5oLCBQLmNlaWwsIFAuY29zLCBQLmNvc2gsXHJcbiAqICAgICAgICAgICAgICAgICAgICAgICAgICAgUC5jdWJlUm9vdCwgUC5kaXZpZGVkVG9JbnRlZ2VyQnksIFAuZmxvb3IsIFAubG9nYXJpdGhtLCBQLm1pbnVzLFxyXG4gKiAgICAgICAgICAgICAgICAgICAgICAgICAgIFAubW9kdWxvLCBQLm5lZ2F0ZWQsIFAucGx1cywgUC5yb3VuZCwgUC5zaW4sIFAuc2luaCwgUC5zcXVhcmVSb290LFxyXG4gKiAgICAgICAgICAgICAgICAgICAgICAgICAgIFAudGFuLCBQLnRpbWVzLCBQLnRvRGVjaW1hbFBsYWNlcywgUC50b0V4cG9uZW50aWFsLCBQLnRvRml4ZWQsXHJcbiAqICAgICAgICAgICAgICAgICAgICAgICAgICAgUC50b05lYXJlc3QsIFAudG9Qb3dlciwgUC50b1ByZWNpc2lvbiwgUC50b1NpZ25pZmljYW50RGlnaXRzLFxyXG4gKiAgICAgICAgICAgICAgICAgICAgICAgICAgIFAudHJ1bmNhdGVkLCBkaXZpZGUsIGdldExuMTAsIGdldFBpLCBuYXR1cmFsRXhwb25lbnRpYWwsXHJcbiAqICAgICAgICAgICAgICAgICAgICAgICAgICAgbmF0dXJhbExvZ2FyaXRobSwgY2VpbCwgZmxvb3IsIHJvdW5kLCB0cnVuY1xyXG4gKiAgZmluaXRlVG9TdHJpbmcgICAgICAgICAgIFAudG9FeHBvbmVudGlhbCwgUC50b0ZpeGVkLCBQLnRvUHJlY2lzaW9uLCBQLnRvU3RyaW5nLCBQLnZhbHVlT2YsXHJcbiAqICAgICAgICAgICAgICAgICAgICAgICAgICAgdG9TdHJpbmdCaW5hcnlcclxuICogIGdldEJhc2UxMEV4cG9uZW50ICAgICAgICBQLm1pbnVzLCBQLnBsdXMsIFAudGltZXMsIHBhcnNlT3RoZXJcclxuICogIGdldExuMTAgICAgICAgICAgICAgICAgICBQLmxvZ2FyaXRobSwgbmF0dXJhbExvZ2FyaXRobVxyXG4gKiAgZ2V0UGkgICAgICAgICAgICAgICAgICAgIFAuYWNvcywgUC5hc2luLCBQLmF0YW4sIHRvTGVzc1RoYW5IYWxmUGksIGF0YW4yXHJcbiAqICBnZXRQcmVjaXNpb24gICAgICAgICAgICAgUC5wcmVjaXNpb24sIFAudG9GcmFjdGlvblxyXG4gKiAgZ2V0WmVyb1N0cmluZyAgICAgICAgICAgIGRpZ2l0c1RvU3RyaW5nLCBmaW5pdGVUb1N0cmluZ1xyXG4gKiAgaW50UG93ICAgICAgICAgICAgICAgICAgIFAudG9Qb3dlciwgcGFyc2VPdGhlclxyXG4gKiAgaXNPZGQgICAgICAgICAgICAgICAgICAgIHRvTGVzc1RoYW5IYWxmUGlcclxuICogIG1heE9yTWluICAgICAgICAgICAgICAgICBtYXgsIG1pblxyXG4gKiAgbmF0dXJhbEV4cG9uZW50aWFsICAgICAgIFAubmF0dXJhbEV4cG9uZW50aWFsLCBQLnRvUG93ZXJcclxuICogIG5hdHVyYWxMb2dhcml0aG0gICAgICAgICBQLmFjb3NoLCBQLmFzaW5oLCBQLmF0YW5oLCBQLmxvZ2FyaXRobSwgUC5uYXR1cmFsTG9nYXJpdGhtLFxyXG4gKiAgICAgICAgICAgICAgICAgICAgICAgICAgIFAudG9Qb3dlciwgbmF0dXJhbEV4cG9uZW50aWFsXHJcbiAqICBub25GaW5pdGVUb1N0cmluZyAgICAgICAgZmluaXRlVG9TdHJpbmcsIHRvU3RyaW5nQmluYXJ5XHJcbiAqICBwYXJzZURlY2ltYWwgICAgICAgICAgICAgRGVjaW1hbFxyXG4gKiAgcGFyc2VPdGhlciAgICAgICAgICAgICAgIERlY2ltYWxcclxuICogIHNpbiAgICAgICAgICAgICAgICAgICAgICBQLnNpblxyXG4gKiAgdGF5bG9yU2VyaWVzICAgICAgICAgICAgIFAuY29zaCwgUC5zaW5oLCBjb3MsIHNpblxyXG4gKiAgdG9MZXNzVGhhbkhhbGZQaSAgICAgICAgIFAuY29zLCBQLnNpblxyXG4gKiAgdG9TdHJpbmdCaW5hcnkgICAgICAgICAgIFAudG9CaW5hcnksIFAudG9IZXhhZGVjaW1hbCwgUC50b09jdGFsXHJcbiAqICB0cnVuY2F0ZSAgICAgICAgICAgICAgICAgaW50UG93XHJcbiAqXHJcbiAqICBUaHJvd3M6ICAgICAgICAgICAgICAgICAgUC5sb2dhcml0aG0sIFAucHJlY2lzaW9uLCBQLnRvRnJhY3Rpb24sIGNoZWNrSW50MzIsIGdldExuMTAsIGdldFBpLFxyXG4gKiAgICAgICAgICAgICAgICAgICAgICAgICAgIG5hdHVyYWxMb2dhcml0aG0sIGNvbmZpZywgcGFyc2VPdGhlciwgcmFuZG9tLCBEZWNpbWFsXHJcbiAqL1xyXG5cclxuXHJcbmZ1bmN0aW9uIGRpZ2l0c1RvU3RyaW5nKGQpIHtcclxuICB2YXIgaSwgaywgd3MsXHJcbiAgICBpbmRleE9mTGFzdFdvcmQgPSBkLmxlbmd0aCAtIDEsXHJcbiAgICBzdHIgPSAnJyxcclxuICAgIHcgPSBkWzBdO1xyXG5cclxuICBpZiAoaW5kZXhPZkxhc3RXb3JkID4gMCkge1xyXG4gICAgc3RyICs9IHc7XHJcbiAgICBmb3IgKGkgPSAxOyBpIDwgaW5kZXhPZkxhc3RXb3JkOyBpKyspIHtcclxuICAgICAgd3MgPSBkW2ldICsgJyc7XHJcbiAgICAgIGsgPSBMT0dfQkFTRSAtIHdzLmxlbmd0aDtcclxuICAgICAgaWYgKGspIHN0ciArPSBnZXRaZXJvU3RyaW5nKGspO1xyXG4gICAgICBzdHIgKz0gd3M7XHJcbiAgICB9XHJcblxyXG4gICAgdyA9IGRbaV07XHJcbiAgICB3cyA9IHcgKyAnJztcclxuICAgIGsgPSBMT0dfQkFTRSAtIHdzLmxlbmd0aDtcclxuICAgIGlmIChrKSBzdHIgKz0gZ2V0WmVyb1N0cmluZyhrKTtcclxuICB9IGVsc2UgaWYgKHcgPT09IDApIHtcclxuICAgIHJldHVybiAnMCc7XHJcbiAgfVxyXG5cclxuICAvLyBSZW1vdmUgdHJhaWxpbmcgemVyb3Mgb2YgbGFzdCB3LlxyXG4gIGZvciAoOyB3ICUgMTAgPT09IDA7KSB3IC89IDEwO1xyXG5cclxuICByZXR1cm4gc3RyICsgdztcclxufVxyXG5cclxuXHJcbmZ1bmN0aW9uIGNoZWNrSW50MzIoaSwgbWluLCBtYXgpIHtcclxuICBpZiAoaSAhPT0gfn5pIHx8IGkgPCBtaW4gfHwgaSA+IG1heCkge1xyXG4gICAgdGhyb3cgRXJyb3IoaW52YWxpZEFyZ3VtZW50ICsgaSk7XHJcbiAgfVxyXG59XHJcblxyXG5cclxuLypcclxuICogQ2hlY2sgNSByb3VuZGluZyBkaWdpdHMgaWYgYHJlcGVhdGluZ2AgaXMgbnVsbCwgNCBvdGhlcndpc2UuXHJcbiAqIGByZXBlYXRpbmcgPT0gbnVsbGAgaWYgY2FsbGVyIGlzIGBsb2dgIG9yIGBwb3dgLFxyXG4gKiBgcmVwZWF0aW5nICE9IG51bGxgIGlmIGNhbGxlciBpcyBgbmF0dXJhbExvZ2FyaXRobWAgb3IgYG5hdHVyYWxFeHBvbmVudGlhbGAuXHJcbiAqL1xyXG5mdW5jdGlvbiBjaGVja1JvdW5kaW5nRGlnaXRzKGQsIGksIHJtLCByZXBlYXRpbmcpIHtcclxuICB2YXIgZGksIGssIHIsIHJkO1xyXG5cclxuICAvLyBHZXQgdGhlIGxlbmd0aCBvZiB0aGUgZmlyc3Qgd29yZCBvZiB0aGUgYXJyYXkgZC5cclxuICBmb3IgKGsgPSBkWzBdOyBrID49IDEwOyBrIC89IDEwKSAtLWk7XHJcblxyXG4gIC8vIElzIHRoZSByb3VuZGluZyBkaWdpdCBpbiB0aGUgZmlyc3Qgd29yZCBvZiBkP1xyXG4gIGlmICgtLWkgPCAwKSB7XHJcbiAgICBpICs9IExPR19CQVNFO1xyXG4gICAgZGkgPSAwO1xyXG4gIH0gZWxzZSB7XHJcbiAgICBkaSA9IE1hdGguY2VpbCgoaSArIDEpIC8gTE9HX0JBU0UpO1xyXG4gICAgaSAlPSBMT0dfQkFTRTtcclxuICB9XHJcblxyXG4gIC8vIGkgaXMgdGhlIGluZGV4ICgwIC0gNikgb2YgdGhlIHJvdW5kaW5nIGRpZ2l0LlxyXG4gIC8vIEUuZy4gaWYgd2l0aGluIHRoZSB3b3JkIDM0ODc1NjMgdGhlIGZpcnN0IHJvdW5kaW5nIGRpZ2l0IGlzIDUsXHJcbiAgLy8gdGhlbiBpID0gNCwgayA9IDEwMDAsIHJkID0gMzQ4NzU2MyAlIDEwMDAgPSA1NjNcclxuICBrID0gbWF0aHBvdygxMCwgTE9HX0JBU0UgLSBpKTtcclxuICByZCA9IGRbZGldICUgayB8IDA7XHJcblxyXG4gIGlmIChyZXBlYXRpbmcgPT0gbnVsbCkge1xyXG4gICAgaWYgKGkgPCAzKSB7XHJcbiAgICAgIGlmIChpID09IDApIHJkID0gcmQgLyAxMDAgfCAwO1xyXG4gICAgICBlbHNlIGlmIChpID09IDEpIHJkID0gcmQgLyAxMCB8IDA7XHJcbiAgICAgIHIgPSBybSA8IDQgJiYgcmQgPT0gOTk5OTkgfHwgcm0gPiAzICYmIHJkID09IDQ5OTk5IHx8IHJkID09IDUwMDAwIHx8IHJkID09IDA7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICByID0gKHJtIDwgNCAmJiByZCArIDEgPT0gayB8fCBybSA+IDMgJiYgcmQgKyAxID09IGsgLyAyKSAmJlxyXG4gICAgICAgIChkW2RpICsgMV0gLyBrIC8gMTAwIHwgMCkgPT0gbWF0aHBvdygxMCwgaSAtIDIpIC0gMSB8fFxyXG4gICAgICAgICAgKHJkID09IGsgLyAyIHx8IHJkID09IDApICYmIChkW2RpICsgMV0gLyBrIC8gMTAwIHwgMCkgPT0gMDtcclxuICAgIH1cclxuICB9IGVsc2Uge1xyXG4gICAgaWYgKGkgPCA0KSB7XHJcbiAgICAgIGlmIChpID09IDApIHJkID0gcmQgLyAxMDAwIHwgMDtcclxuICAgICAgZWxzZSBpZiAoaSA9PSAxKSByZCA9IHJkIC8gMTAwIHwgMDtcclxuICAgICAgZWxzZSBpZiAoaSA9PSAyKSByZCA9IHJkIC8gMTAgfCAwO1xyXG4gICAgICByID0gKHJlcGVhdGluZyB8fCBybSA8IDQpICYmIHJkID09IDk5OTkgfHwgIXJlcGVhdGluZyAmJiBybSA+IDMgJiYgcmQgPT0gNDk5OTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIHIgPSAoKHJlcGVhdGluZyB8fCBybSA8IDQpICYmIHJkICsgMSA9PSBrIHx8XHJcbiAgICAgICghcmVwZWF0aW5nICYmIHJtID4gMykgJiYgcmQgKyAxID09IGsgLyAyKSAmJlxyXG4gICAgICAgIChkW2RpICsgMV0gLyBrIC8gMTAwMCB8IDApID09IG1hdGhwb3coMTAsIGkgLSAzKSAtIDE7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICByZXR1cm4gcjtcclxufVxyXG5cclxuXHJcbi8vIENvbnZlcnQgc3RyaW5nIG9mIGBiYXNlSW5gIHRvIGFuIGFycmF5IG9mIG51bWJlcnMgb2YgYGJhc2VPdXRgLlxyXG4vLyBFZy4gY29udmVydEJhc2UoJzI1NScsIDEwLCAxNikgcmV0dXJucyBbMTUsIDE1XS5cclxuLy8gRWcuIGNvbnZlcnRCYXNlKCdmZicsIDE2LCAxMCkgcmV0dXJucyBbMiwgNSwgNV0uXHJcbmZ1bmN0aW9uIGNvbnZlcnRCYXNlKHN0ciwgYmFzZUluLCBiYXNlT3V0KSB7XHJcbiAgdmFyIGosXHJcbiAgICBhcnIgPSBbMF0sXHJcbiAgICBhcnJMLFxyXG4gICAgaSA9IDAsXHJcbiAgICBzdHJMID0gc3RyLmxlbmd0aDtcclxuXHJcbiAgZm9yICg7IGkgPCBzdHJMOykge1xyXG4gICAgZm9yIChhcnJMID0gYXJyLmxlbmd0aDsgYXJyTC0tOykgYXJyW2FyckxdICo9IGJhc2VJbjtcclxuICAgIGFyclswXSArPSBOVU1FUkFMUy5pbmRleE9mKHN0ci5jaGFyQXQoaSsrKSk7XHJcbiAgICBmb3IgKGogPSAwOyBqIDwgYXJyLmxlbmd0aDsgaisrKSB7XHJcbiAgICAgIGlmIChhcnJbal0gPiBiYXNlT3V0IC0gMSkge1xyXG4gICAgICAgIGlmIChhcnJbaiArIDFdID09PSB2b2lkIDApIGFycltqICsgMV0gPSAwO1xyXG4gICAgICAgIGFycltqICsgMV0gKz0gYXJyW2pdIC8gYmFzZU91dCB8IDA7XHJcbiAgICAgICAgYXJyW2pdICU9IGJhc2VPdXQ7XHJcbiAgICAgIH1cclxuICAgIH1cclxuICB9XHJcblxyXG4gIHJldHVybiBhcnIucmV2ZXJzZSgpO1xyXG59XHJcblxyXG5cclxuLypcclxuICogY29zKHgpID0gMSAtIHheMi8yISArIHheNC80ISAtIC4uLlxyXG4gKiB8eHwgPCBwaS8yXHJcbiAqXHJcbiAqL1xyXG5mdW5jdGlvbiBjb3NpbmUoQ3RvciwgeCkge1xyXG4gIHZhciBrLCBsZW4sIHk7XHJcblxyXG4gIGlmICh4LmlzWmVybygpKSByZXR1cm4geDtcclxuXHJcbiAgLy8gQXJndW1lbnQgcmVkdWN0aW9uOiBjb3MoNHgpID0gOCooY29zXjQoeCkgLSBjb3NeMih4KSkgKyAxXHJcbiAgLy8gaS5lLiBjb3MoeCkgPSA4Kihjb3NeNCh4LzQpIC0gY29zXjIoeC80KSkgKyAxXHJcblxyXG4gIC8vIEVzdGltYXRlIHRoZSBvcHRpbXVtIG51bWJlciBvZiB0aW1lcyB0byB1c2UgdGhlIGFyZ3VtZW50IHJlZHVjdGlvbi5cclxuICBsZW4gPSB4LmQubGVuZ3RoO1xyXG4gIGlmIChsZW4gPCAzMikge1xyXG4gICAgayA9IE1hdGguY2VpbChsZW4gLyAzKTtcclxuICAgIHkgPSAoMSAvIHRpbnlQb3coNCwgaykpLnRvU3RyaW5nKCk7XHJcbiAgfSBlbHNlIHtcclxuICAgIGsgPSAxNjtcclxuICAgIHkgPSAnMi4zMjgzMDY0MzY1Mzg2OTYyODkwNjI1ZS0xMCc7XHJcbiAgfVxyXG5cclxuICBDdG9yLnByZWNpc2lvbiArPSBrO1xyXG5cclxuICB4ID0gdGF5bG9yU2VyaWVzKEN0b3IsIDEsIHgudGltZXMoeSksIG5ldyBDdG9yKDEpKTtcclxuXHJcbiAgLy8gUmV2ZXJzZSBhcmd1bWVudCByZWR1Y3Rpb25cclxuICBmb3IgKHZhciBpID0gazsgaS0tOykge1xyXG4gICAgdmFyIGNvczJ4ID0geC50aW1lcyh4KTtcclxuICAgIHggPSBjb3MyeC50aW1lcyhjb3MyeCkubWludXMoY29zMngpLnRpbWVzKDgpLnBsdXMoMSk7XHJcbiAgfVxyXG5cclxuICBDdG9yLnByZWNpc2lvbiAtPSBrO1xyXG5cclxuICByZXR1cm4geDtcclxufVxyXG5cclxuXHJcbi8qXHJcbiAqIFBlcmZvcm0gZGl2aXNpb24gaW4gdGhlIHNwZWNpZmllZCBiYXNlLlxyXG4gKi9cclxudmFyIGRpdmlkZSA9IChmdW5jdGlvbiAoKSB7XHJcblxyXG4gIC8vIEFzc3VtZXMgbm9uLXplcm8geCBhbmQgaywgYW5kIGhlbmNlIG5vbi16ZXJvIHJlc3VsdC5cclxuICBmdW5jdGlvbiBtdWx0aXBseUludGVnZXIoeCwgaywgYmFzZSkge1xyXG4gICAgdmFyIHRlbXAsXHJcbiAgICAgIGNhcnJ5ID0gMCxcclxuICAgICAgaSA9IHgubGVuZ3RoO1xyXG5cclxuICAgIGZvciAoeCA9IHguc2xpY2UoKTsgaS0tOykge1xyXG4gICAgICB0ZW1wID0geFtpXSAqIGsgKyBjYXJyeTtcclxuICAgICAgeFtpXSA9IHRlbXAgJSBiYXNlIHwgMDtcclxuICAgICAgY2FycnkgPSB0ZW1wIC8gYmFzZSB8IDA7XHJcbiAgICB9XHJcblxyXG4gICAgaWYgKGNhcnJ5KSB4LnVuc2hpZnQoY2FycnkpO1xyXG5cclxuICAgIHJldHVybiB4O1xyXG4gIH1cclxuXHJcbiAgZnVuY3Rpb24gY29tcGFyZShhLCBiLCBhTCwgYkwpIHtcclxuICAgIHZhciBpLCByO1xyXG5cclxuICAgIGlmIChhTCAhPSBiTCkge1xyXG4gICAgICByID0gYUwgPiBiTCA/IDEgOiAtMTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIGZvciAoaSA9IHIgPSAwOyBpIDwgYUw7IGkrKykge1xyXG4gICAgICAgIGlmIChhW2ldICE9IGJbaV0pIHtcclxuICAgICAgICAgIHIgPSBhW2ldID4gYltpXSA/IDEgOiAtMTtcclxuICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiByO1xyXG4gIH1cclxuXHJcbiAgZnVuY3Rpb24gc3VidHJhY3QoYSwgYiwgYUwsIGJhc2UpIHtcclxuICAgIHZhciBpID0gMDtcclxuXHJcbiAgICAvLyBTdWJ0cmFjdCBiIGZyb20gYS5cclxuICAgIGZvciAoOyBhTC0tOykge1xyXG4gICAgICBhW2FMXSAtPSBpO1xyXG4gICAgICBpID0gYVthTF0gPCBiW2FMXSA/IDEgOiAwO1xyXG4gICAgICBhW2FMXSA9IGkgKiBiYXNlICsgYVthTF0gLSBiW2FMXTtcclxuICAgIH1cclxuXHJcbiAgICAvLyBSZW1vdmUgbGVhZGluZyB6ZXJvcy5cclxuICAgIGZvciAoOyAhYVswXSAmJiBhLmxlbmd0aCA+IDE7KSBhLnNoaWZ0KCk7XHJcbiAgfVxyXG5cclxuICByZXR1cm4gZnVuY3Rpb24gKHgsIHksIHByLCBybSwgZHAsIGJhc2UpIHtcclxuICAgIHZhciBjbXAsIGUsIGksIGssIGxvZ0Jhc2UsIG1vcmUsIHByb2QsIHByb2RMLCBxLCBxZCwgcmVtLCByZW1MLCByZW0wLCBzZCwgdCwgeGksIHhMLCB5ZDAsXHJcbiAgICAgIHlMLCB5eixcclxuICAgICAgQ3RvciA9IHguY29uc3RydWN0b3IsXHJcbiAgICAgIHNpZ24gPSB4LnMgPT0geS5zID8gMSA6IC0xLFxyXG4gICAgICB4ZCA9IHguZCxcclxuICAgICAgeWQgPSB5LmQ7XHJcblxyXG4gICAgLy8gRWl0aGVyIE5hTiwgSW5maW5pdHkgb3IgMD9cclxuICAgIGlmICgheGQgfHwgIXhkWzBdIHx8ICF5ZCB8fCAheWRbMF0pIHtcclxuXHJcbiAgICAgIHJldHVybiBuZXcgQ3RvcigvLyBSZXR1cm4gTmFOIGlmIGVpdGhlciBOYU4sIG9yIGJvdGggSW5maW5pdHkgb3IgMC5cclxuICAgICAgICAheC5zIHx8ICF5LnMgfHwgKHhkID8geWQgJiYgeGRbMF0gPT0geWRbMF0gOiAheWQpID8gTmFOIDpcclxuXHJcbiAgICAgICAgLy8gUmV0dXJuIFx1MDBCMTAgaWYgeCBpcyAwIG9yIHkgaXMgXHUwMEIxSW5maW5pdHksIG9yIHJldHVybiBcdTAwQjFJbmZpbml0eSBhcyB5IGlzIDAuXHJcbiAgICAgICAgeGQgJiYgeGRbMF0gPT0gMCB8fCAheWQgPyBzaWduICogMCA6IHNpZ24gLyAwKTtcclxuICAgIH1cclxuXHJcbiAgICBpZiAoYmFzZSkge1xyXG4gICAgICBsb2dCYXNlID0gMTtcclxuICAgICAgZSA9IHguZSAtIHkuZTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIGJhc2UgPSBCQVNFO1xyXG4gICAgICBsb2dCYXNlID0gTE9HX0JBU0U7XHJcbiAgICAgIGUgPSBtYXRoZmxvb3IoeC5lIC8gbG9nQmFzZSkgLSBtYXRoZmxvb3IoeS5lIC8gbG9nQmFzZSk7XHJcbiAgICB9XHJcblxyXG4gICAgeUwgPSB5ZC5sZW5ndGg7XHJcbiAgICB4TCA9IHhkLmxlbmd0aDtcclxuICAgIHEgPSBuZXcgQ3RvcihzaWduKTtcclxuICAgIHFkID0gcS5kID0gW107XHJcblxyXG4gICAgLy8gUmVzdWx0IGV4cG9uZW50IG1heSBiZSBvbmUgbGVzcyB0aGFuIGUuXHJcbiAgICAvLyBUaGUgZGlnaXQgYXJyYXkgb2YgYSBEZWNpbWFsIGZyb20gdG9TdHJpbmdCaW5hcnkgbWF5IGhhdmUgdHJhaWxpbmcgemVyb3MuXHJcbiAgICBmb3IgKGkgPSAwOyB5ZFtpXSA9PSAoeGRbaV0gfHwgMCk7IGkrKyk7XHJcblxyXG4gICAgaWYgKHlkW2ldID4gKHhkW2ldIHx8IDApKSBlLS07XHJcblxyXG4gICAgaWYgKHByID09IG51bGwpIHtcclxuICAgICAgc2QgPSBwciA9IEN0b3IucHJlY2lzaW9uO1xyXG4gICAgICBybSA9IEN0b3Iucm91bmRpbmc7XHJcbiAgICB9IGVsc2UgaWYgKGRwKSB7XHJcbiAgICAgIHNkID0gcHIgKyAoeC5lIC0geS5lKSArIDE7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICBzZCA9IHByO1xyXG4gICAgfVxyXG5cclxuICAgIGlmIChzZCA8IDApIHtcclxuICAgICAgcWQucHVzaCgxKTtcclxuICAgICAgbW9yZSA9IHRydWU7XHJcbiAgICB9IGVsc2Uge1xyXG5cclxuICAgICAgLy8gQ29udmVydCBwcmVjaXNpb24gaW4gbnVtYmVyIG9mIGJhc2UgMTAgZGlnaXRzIHRvIGJhc2UgMWU3IGRpZ2l0cy5cclxuICAgICAgc2QgPSBzZCAvIGxvZ0Jhc2UgKyAyIHwgMDtcclxuICAgICAgaSA9IDA7XHJcblxyXG4gICAgICAvLyBkaXZpc29yIDwgMWU3XHJcbiAgICAgIGlmICh5TCA9PSAxKSB7XHJcbiAgICAgICAgayA9IDA7XHJcbiAgICAgICAgeWQgPSB5ZFswXTtcclxuICAgICAgICBzZCsrO1xyXG5cclxuICAgICAgICAvLyBrIGlzIHRoZSBjYXJyeS5cclxuICAgICAgICBmb3IgKDsgKGkgPCB4TCB8fCBrKSAmJiBzZC0tOyBpKyspIHtcclxuICAgICAgICAgIHQgPSBrICogYmFzZSArICh4ZFtpXSB8fCAwKTtcclxuICAgICAgICAgIHFkW2ldID0gdCAvIHlkIHwgMDtcclxuICAgICAgICAgIGsgPSB0ICUgeWQgfCAwO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgbW9yZSA9IGsgfHwgaSA8IHhMO1xyXG5cclxuICAgICAgLy8gZGl2aXNvciA+PSAxZTdcclxuICAgICAgfSBlbHNlIHtcclxuXHJcbiAgICAgICAgLy8gTm9ybWFsaXNlIHhkIGFuZCB5ZCBzbyBoaWdoZXN0IG9yZGVyIGRpZ2l0IG9mIHlkIGlzID49IGJhc2UvMlxyXG4gICAgICAgIGsgPSBiYXNlIC8gKHlkWzBdICsgMSkgfCAwO1xyXG5cclxuICAgICAgICBpZiAoayA+IDEpIHtcclxuICAgICAgICAgIHlkID0gbXVsdGlwbHlJbnRlZ2VyKHlkLCBrLCBiYXNlKTtcclxuICAgICAgICAgIHhkID0gbXVsdGlwbHlJbnRlZ2VyKHhkLCBrLCBiYXNlKTtcclxuICAgICAgICAgIHlMID0geWQubGVuZ3RoO1xyXG4gICAgICAgICAgeEwgPSB4ZC5sZW5ndGg7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB4aSA9IHlMO1xyXG4gICAgICAgIHJlbSA9IHhkLnNsaWNlKDAsIHlMKTtcclxuICAgICAgICByZW1MID0gcmVtLmxlbmd0aDtcclxuXHJcbiAgICAgICAgLy8gQWRkIHplcm9zIHRvIG1ha2UgcmVtYWluZGVyIGFzIGxvbmcgYXMgZGl2aXNvci5cclxuICAgICAgICBmb3IgKDsgcmVtTCA8IHlMOykgcmVtW3JlbUwrK10gPSAwO1xyXG5cclxuICAgICAgICB5eiA9IHlkLnNsaWNlKCk7XHJcbiAgICAgICAgeXoudW5zaGlmdCgwKTtcclxuICAgICAgICB5ZDAgPSB5ZFswXTtcclxuXHJcbiAgICAgICAgaWYgKHlkWzFdID49IGJhc2UgLyAyKSArK3lkMDtcclxuXHJcbiAgICAgICAgZG8ge1xyXG4gICAgICAgICAgayA9IDA7XHJcblxyXG4gICAgICAgICAgLy8gQ29tcGFyZSBkaXZpc29yIGFuZCByZW1haW5kZXIuXHJcbiAgICAgICAgICBjbXAgPSBjb21wYXJlKHlkLCByZW0sIHlMLCByZW1MKTtcclxuXHJcbiAgICAgICAgICAvLyBJZiBkaXZpc29yIDwgcmVtYWluZGVyLlxyXG4gICAgICAgICAgaWYgKGNtcCA8IDApIHtcclxuXHJcbiAgICAgICAgICAgIC8vIENhbGN1bGF0ZSB0cmlhbCBkaWdpdCwgay5cclxuICAgICAgICAgICAgcmVtMCA9IHJlbVswXTtcclxuICAgICAgICAgICAgaWYgKHlMICE9IHJlbUwpIHJlbTAgPSByZW0wICogYmFzZSArIChyZW1bMV0gfHwgMCk7XHJcblxyXG4gICAgICAgICAgICAvLyBrIHdpbGwgYmUgaG93IG1hbnkgdGltZXMgdGhlIGRpdmlzb3IgZ29lcyBpbnRvIHRoZSBjdXJyZW50IHJlbWFpbmRlci5cclxuICAgICAgICAgICAgayA9IHJlbTAgLyB5ZDAgfCAwO1xyXG5cclxuICAgICAgICAgICAgLy8gIEFsZ29yaXRobTpcclxuICAgICAgICAgICAgLy8gIDEuIHByb2R1Y3QgPSBkaXZpc29yICogdHJpYWwgZGlnaXQgKGspXHJcbiAgICAgICAgICAgIC8vICAyLiBpZiBwcm9kdWN0ID4gcmVtYWluZGVyOiBwcm9kdWN0IC09IGRpdmlzb3IsIGstLVxyXG4gICAgICAgICAgICAvLyAgMy4gcmVtYWluZGVyIC09IHByb2R1Y3RcclxuICAgICAgICAgICAgLy8gIDQuIGlmIHByb2R1Y3Qgd2FzIDwgcmVtYWluZGVyIGF0IDI6XHJcbiAgICAgICAgICAgIC8vICAgIDUuIGNvbXBhcmUgbmV3IHJlbWFpbmRlciBhbmQgZGl2aXNvclxyXG4gICAgICAgICAgICAvLyAgICA2LiBJZiByZW1haW5kZXIgPiBkaXZpc29yOiByZW1haW5kZXIgLT0gZGl2aXNvciwgaysrXHJcblxyXG4gICAgICAgICAgICBpZiAoayA+IDEpIHtcclxuICAgICAgICAgICAgICBpZiAoayA+PSBiYXNlKSBrID0gYmFzZSAtIDE7XHJcblxyXG4gICAgICAgICAgICAgIC8vIHByb2R1Y3QgPSBkaXZpc29yICogdHJpYWwgZGlnaXQuXHJcbiAgICAgICAgICAgICAgcHJvZCA9IG11bHRpcGx5SW50ZWdlcih5ZCwgaywgYmFzZSk7XHJcbiAgICAgICAgICAgICAgcHJvZEwgPSBwcm9kLmxlbmd0aDtcclxuICAgICAgICAgICAgICByZW1MID0gcmVtLmxlbmd0aDtcclxuXHJcbiAgICAgICAgICAgICAgLy8gQ29tcGFyZSBwcm9kdWN0IGFuZCByZW1haW5kZXIuXHJcbiAgICAgICAgICAgICAgY21wID0gY29tcGFyZShwcm9kLCByZW0sIHByb2RMLCByZW1MKTtcclxuXHJcbiAgICAgICAgICAgICAgLy8gcHJvZHVjdCA+IHJlbWFpbmRlci5cclxuICAgICAgICAgICAgICBpZiAoY21wID09IDEpIHtcclxuICAgICAgICAgICAgICAgIGstLTtcclxuXHJcbiAgICAgICAgICAgICAgICAvLyBTdWJ0cmFjdCBkaXZpc29yIGZyb20gcHJvZHVjdC5cclxuICAgICAgICAgICAgICAgIHN1YnRyYWN0KHByb2QsIHlMIDwgcHJvZEwgPyB5eiA6IHlkLCBwcm9kTCwgYmFzZSk7XHJcbiAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG5cclxuICAgICAgICAgICAgICAvLyBjbXAgaXMgLTEuXHJcbiAgICAgICAgICAgICAgLy8gSWYgayBpcyAwLCB0aGVyZSBpcyBubyBuZWVkIHRvIGNvbXBhcmUgeWQgYW5kIHJlbSBhZ2FpbiBiZWxvdywgc28gY2hhbmdlIGNtcCB0byAxXHJcbiAgICAgICAgICAgICAgLy8gdG8gYXZvaWQgaXQuIElmIGsgaXMgMSB0aGVyZSBpcyBhIG5lZWQgdG8gY29tcGFyZSB5ZCBhbmQgcmVtIGFnYWluIGJlbG93LlxyXG4gICAgICAgICAgICAgIGlmIChrID09IDApIGNtcCA9IGsgPSAxO1xyXG4gICAgICAgICAgICAgIHByb2QgPSB5ZC5zbGljZSgpO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBwcm9kTCA9IHByb2QubGVuZ3RoO1xyXG4gICAgICAgICAgICBpZiAocHJvZEwgPCByZW1MKSBwcm9kLnVuc2hpZnQoMCk7XHJcblxyXG4gICAgICAgICAgICAvLyBTdWJ0cmFjdCBwcm9kdWN0IGZyb20gcmVtYWluZGVyLlxyXG4gICAgICAgICAgICBzdWJ0cmFjdChyZW0sIHByb2QsIHJlbUwsIGJhc2UpO1xyXG5cclxuICAgICAgICAgICAgLy8gSWYgcHJvZHVjdCB3YXMgPCBwcmV2aW91cyByZW1haW5kZXIuXHJcbiAgICAgICAgICAgIGlmIChjbXAgPT0gLTEpIHtcclxuICAgICAgICAgICAgICByZW1MID0gcmVtLmxlbmd0aDtcclxuXHJcbiAgICAgICAgICAgICAgLy8gQ29tcGFyZSBkaXZpc29yIGFuZCBuZXcgcmVtYWluZGVyLlxyXG4gICAgICAgICAgICAgIGNtcCA9IGNvbXBhcmUoeWQsIHJlbSwgeUwsIHJlbUwpO1xyXG5cclxuICAgICAgICAgICAgICAvLyBJZiBkaXZpc29yIDwgbmV3IHJlbWFpbmRlciwgc3VidHJhY3QgZGl2aXNvciBmcm9tIHJlbWFpbmRlci5cclxuICAgICAgICAgICAgICBpZiAoY21wIDwgMSkge1xyXG4gICAgICAgICAgICAgICAgaysrO1xyXG5cclxuICAgICAgICAgICAgICAgIC8vIFN1YnRyYWN0IGRpdmlzb3IgZnJvbSByZW1haW5kZXIuXHJcbiAgICAgICAgICAgICAgICBzdWJ0cmFjdChyZW0sIHlMIDwgcmVtTCA/IHl6IDogeWQsIHJlbUwsIGJhc2UpO1xyXG4gICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgcmVtTCA9IHJlbS5sZW5ndGg7XHJcbiAgICAgICAgICB9IGVsc2UgaWYgKGNtcCA9PT0gMCkge1xyXG4gICAgICAgICAgICBrKys7XHJcbiAgICAgICAgICAgIHJlbSA9IFswXTtcclxuICAgICAgICAgIH0gICAgLy8gaWYgY21wID09PSAxLCBrIHdpbGwgYmUgMFxyXG5cclxuICAgICAgICAgIC8vIEFkZCB0aGUgbmV4dCBkaWdpdCwgaywgdG8gdGhlIHJlc3VsdCBhcnJheS5cclxuICAgICAgICAgIHFkW2krK10gPSBrO1xyXG5cclxuICAgICAgICAgIC8vIFVwZGF0ZSB0aGUgcmVtYWluZGVyLlxyXG4gICAgICAgICAgaWYgKGNtcCAmJiByZW1bMF0pIHtcclxuICAgICAgICAgICAgcmVtW3JlbUwrK10gPSB4ZFt4aV0gfHwgMDtcclxuICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHJlbSA9IFt4ZFt4aV1dO1xyXG4gICAgICAgICAgICByZW1MID0gMTtcclxuICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgfSB3aGlsZSAoKHhpKysgPCB4TCB8fCByZW1bMF0gIT09IHZvaWQgMCkgJiYgc2QtLSk7XHJcblxyXG4gICAgICAgIG1vcmUgPSByZW1bMF0gIT09IHZvaWQgMDtcclxuICAgICAgfVxyXG5cclxuICAgICAgLy8gTGVhZGluZyB6ZXJvP1xyXG4gICAgICBpZiAoIXFkWzBdKSBxZC5zaGlmdCgpO1xyXG4gICAgfVxyXG5cclxuICAgIC8vIGxvZ0Jhc2UgaXMgMSB3aGVuIGRpdmlkZSBpcyBiZWluZyB1c2VkIGZvciBiYXNlIGNvbnZlcnNpb24uXHJcbiAgICBpZiAobG9nQmFzZSA9PSAxKSB7XHJcbiAgICAgIHEuZSA9IGU7XHJcbiAgICAgIGluZXhhY3QgPSBtb3JlO1xyXG4gICAgfSBlbHNlIHtcclxuXHJcbiAgICAgIC8vIFRvIGNhbGN1bGF0ZSBxLmUsIGZpcnN0IGdldCB0aGUgbnVtYmVyIG9mIGRpZ2l0cyBvZiBxZFswXS5cclxuICAgICAgZm9yIChpID0gMSwgayA9IHFkWzBdOyBrID49IDEwOyBrIC89IDEwKSBpKys7XHJcbiAgICAgIHEuZSA9IGkgKyBlICogbG9nQmFzZSAtIDE7XHJcblxyXG4gICAgICBmaW5hbGlzZShxLCBkcCA/IHByICsgcS5lICsgMSA6IHByLCBybSwgbW9yZSk7XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIHE7XHJcbiAgfTtcclxufSkoKTtcclxuXHJcblxyXG4vKlxyXG4gKiBSb3VuZCBgeGAgdG8gYHNkYCBzaWduaWZpY2FudCBkaWdpdHMgdXNpbmcgcm91bmRpbmcgbW9kZSBgcm1gLlxyXG4gKiBDaGVjayBmb3Igb3Zlci91bmRlci1mbG93LlxyXG4gKi9cclxuIGZ1bmN0aW9uIGZpbmFsaXNlKHgsIHNkLCBybSwgaXNUcnVuY2F0ZWQpIHtcclxuICB2YXIgZGlnaXRzLCBpLCBqLCBrLCByZCwgcm91bmRVcCwgdywgeGQsIHhkaSxcclxuICAgIEN0b3IgPSB4LmNvbnN0cnVjdG9yO1xyXG5cclxuICAvLyBEb24ndCByb3VuZCBpZiBzZCBpcyBudWxsIG9yIHVuZGVmaW5lZC5cclxuICBvdXQ6IGlmIChzZCAhPSBudWxsKSB7XHJcbiAgICB4ZCA9IHguZDtcclxuXHJcbiAgICAvLyBJbmZpbml0eS9OYU4uXHJcbiAgICBpZiAoIXhkKSByZXR1cm4geDtcclxuXHJcbiAgICAvLyByZDogdGhlIHJvdW5kaW5nIGRpZ2l0LCBpLmUuIHRoZSBkaWdpdCBhZnRlciB0aGUgZGlnaXQgdGhhdCBtYXkgYmUgcm91bmRlZCB1cC5cclxuICAgIC8vIHc6IHRoZSB3b3JkIG9mIHhkIGNvbnRhaW5pbmcgcmQsIGEgYmFzZSAxZTcgbnVtYmVyLlxyXG4gICAgLy8geGRpOiB0aGUgaW5kZXggb2YgdyB3aXRoaW4geGQuXHJcbiAgICAvLyBkaWdpdHM6IHRoZSBudW1iZXIgb2YgZGlnaXRzIG9mIHcuXHJcbiAgICAvLyBpOiB3aGF0IHdvdWxkIGJlIHRoZSBpbmRleCBvZiByZCB3aXRoaW4gdyBpZiBhbGwgdGhlIG51bWJlcnMgd2VyZSA3IGRpZ2l0cyBsb25nIChpLmUuIGlmXHJcbiAgICAvLyB0aGV5IGhhZCBsZWFkaW5nIHplcm9zKVxyXG4gICAgLy8gajogaWYgPiAwLCB0aGUgYWN0dWFsIGluZGV4IG9mIHJkIHdpdGhpbiB3IChpZiA8IDAsIHJkIGlzIGEgbGVhZGluZyB6ZXJvKS5cclxuXHJcbiAgICAvLyBHZXQgdGhlIGxlbmd0aCBvZiB0aGUgZmlyc3Qgd29yZCBvZiB0aGUgZGlnaXRzIGFycmF5IHhkLlxyXG4gICAgZm9yIChkaWdpdHMgPSAxLCBrID0geGRbMF07IGsgPj0gMTA7IGsgLz0gMTApIGRpZ2l0cysrO1xyXG4gICAgaSA9IHNkIC0gZGlnaXRzO1xyXG5cclxuICAgIC8vIElzIHRoZSByb3VuZGluZyBkaWdpdCBpbiB0aGUgZmlyc3Qgd29yZCBvZiB4ZD9cclxuICAgIGlmIChpIDwgMCkge1xyXG4gICAgICBpICs9IExPR19CQVNFO1xyXG4gICAgICBqID0gc2Q7XHJcbiAgICAgIHcgPSB4ZFt4ZGkgPSAwXTtcclxuXHJcbiAgICAgIC8vIEdldCB0aGUgcm91bmRpbmcgZGlnaXQgYXQgaW5kZXggaiBvZiB3LlxyXG4gICAgICByZCA9IHcgLyBtYXRocG93KDEwLCBkaWdpdHMgLSBqIC0gMSkgJSAxMCB8IDA7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICB4ZGkgPSBNYXRoLmNlaWwoKGkgKyAxKSAvIExPR19CQVNFKTtcclxuICAgICAgayA9IHhkLmxlbmd0aDtcclxuICAgICAgaWYgKHhkaSA+PSBrKSB7XHJcbiAgICAgICAgaWYgKGlzVHJ1bmNhdGVkKSB7XHJcblxyXG4gICAgICAgICAgLy8gTmVlZGVkIGJ5IGBuYXR1cmFsRXhwb25lbnRpYWxgLCBgbmF0dXJhbExvZ2FyaXRobWAgYW5kIGBzcXVhcmVSb290YC5cclxuICAgICAgICAgIGZvciAoOyBrKysgPD0geGRpOykgeGQucHVzaCgwKTtcclxuICAgICAgICAgIHcgPSByZCA9IDA7XHJcbiAgICAgICAgICBkaWdpdHMgPSAxO1xyXG4gICAgICAgICAgaSAlPSBMT0dfQkFTRTtcclxuICAgICAgICAgIGogPSBpIC0gTE9HX0JBU0UgKyAxO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICBicmVhayBvdXQ7XHJcbiAgICAgICAgfVxyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIHcgPSBrID0geGRbeGRpXTtcclxuXHJcbiAgICAgICAgLy8gR2V0IHRoZSBudW1iZXIgb2YgZGlnaXRzIG9mIHcuXHJcbiAgICAgICAgZm9yIChkaWdpdHMgPSAxOyBrID49IDEwOyBrIC89IDEwKSBkaWdpdHMrKztcclxuXHJcbiAgICAgICAgLy8gR2V0IHRoZSBpbmRleCBvZiByZCB3aXRoaW4gdy5cclxuICAgICAgICBpICU9IExPR19CQVNFO1xyXG5cclxuICAgICAgICAvLyBHZXQgdGhlIGluZGV4IG9mIHJkIHdpdGhpbiB3LCBhZGp1c3RlZCBmb3IgbGVhZGluZyB6ZXJvcy5cclxuICAgICAgICAvLyBUaGUgbnVtYmVyIG9mIGxlYWRpbmcgemVyb3Mgb2YgdyBpcyBnaXZlbiBieSBMT0dfQkFTRSAtIGRpZ2l0cy5cclxuICAgICAgICBqID0gaSAtIExPR19CQVNFICsgZGlnaXRzO1xyXG5cclxuICAgICAgICAvLyBHZXQgdGhlIHJvdW5kaW5nIGRpZ2l0IGF0IGluZGV4IGogb2Ygdy5cclxuICAgICAgICByZCA9IGogPCAwID8gMCA6IHcgLyBtYXRocG93KDEwLCBkaWdpdHMgLSBqIC0gMSkgJSAxMCB8IDA7XHJcbiAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICAvLyBBcmUgdGhlcmUgYW55IG5vbi16ZXJvIGRpZ2l0cyBhZnRlciB0aGUgcm91bmRpbmcgZGlnaXQ/XHJcbiAgICBpc1RydW5jYXRlZCA9IGlzVHJ1bmNhdGVkIHx8IHNkIDwgMCB8fFxyXG4gICAgICB4ZFt4ZGkgKyAxXSAhPT0gdm9pZCAwIHx8IChqIDwgMCA/IHcgOiB3ICUgbWF0aHBvdygxMCwgZGlnaXRzIC0gaiAtIDEpKTtcclxuXHJcbiAgICAvLyBUaGUgZXhwcmVzc2lvbiBgdyAlIG1hdGhwb3coMTAsIGRpZ2l0cyAtIGogLSAxKWAgcmV0dXJucyBhbGwgdGhlIGRpZ2l0cyBvZiB3IHRvIHRoZSByaWdodFxyXG4gICAgLy8gb2YgdGhlIGRpZ2l0IGF0IChsZWZ0LXRvLXJpZ2h0KSBpbmRleCBqLCBlLmcuIGlmIHcgaXMgOTA4NzE0IGFuZCBqIGlzIDIsIHRoZSBleHByZXNzaW9uXHJcbiAgICAvLyB3aWxsIGdpdmUgNzE0LlxyXG5cclxuICAgIHJvdW5kVXAgPSBybSA8IDRcclxuICAgICAgPyAocmQgfHwgaXNUcnVuY2F0ZWQpICYmIChybSA9PSAwIHx8IHJtID09ICh4LnMgPCAwID8gMyA6IDIpKVxyXG4gICAgICA6IHJkID4gNSB8fCByZCA9PSA1ICYmIChybSA9PSA0IHx8IGlzVHJ1bmNhdGVkIHx8IHJtID09IDYgJiZcclxuXHJcbiAgICAgICAgLy8gQ2hlY2sgd2hldGhlciB0aGUgZGlnaXQgdG8gdGhlIGxlZnQgb2YgdGhlIHJvdW5kaW5nIGRpZ2l0IGlzIG9kZC5cclxuICAgICAgICAoKGkgPiAwID8gaiA+IDAgPyB3IC8gbWF0aHBvdygxMCwgZGlnaXRzIC0gaikgOiAwIDogeGRbeGRpIC0gMV0pICUgMTApICYgMSB8fFxyXG4gICAgICAgICAgcm0gPT0gKHgucyA8IDAgPyA4IDogNykpO1xyXG5cclxuICAgIGlmIChzZCA8IDEgfHwgIXhkWzBdKSB7XHJcbiAgICAgIHhkLmxlbmd0aCA9IDA7XHJcbiAgICAgIGlmIChyb3VuZFVwKSB7XHJcblxyXG4gICAgICAgIC8vIENvbnZlcnQgc2QgdG8gZGVjaW1hbCBwbGFjZXMuXHJcbiAgICAgICAgc2QgLT0geC5lICsgMTtcclxuXHJcbiAgICAgICAgLy8gMSwgMC4xLCAwLjAxLCAwLjAwMSwgMC4wMDAxIGV0Yy5cclxuICAgICAgICB4ZFswXSA9IG1hdGhwb3coMTAsIChMT0dfQkFTRSAtIHNkICUgTE9HX0JBU0UpICUgTE9HX0JBU0UpO1xyXG4gICAgICAgIHguZSA9IC1zZCB8fCAwO1xyXG4gICAgICB9IGVsc2Uge1xyXG5cclxuICAgICAgICAvLyBaZXJvLlxyXG4gICAgICAgIHhkWzBdID0geC5lID0gMDtcclxuICAgICAgfVxyXG5cclxuICAgICAgcmV0dXJuIHg7XHJcbiAgICB9XHJcblxyXG4gICAgLy8gUmVtb3ZlIGV4Y2VzcyBkaWdpdHMuXHJcbiAgICBpZiAoaSA9PSAwKSB7XHJcbiAgICAgIHhkLmxlbmd0aCA9IHhkaTtcclxuICAgICAgayA9IDE7XHJcbiAgICAgIHhkaS0tO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgeGQubGVuZ3RoID0geGRpICsgMTtcclxuICAgICAgayA9IG1hdGhwb3coMTAsIExPR19CQVNFIC0gaSk7XHJcblxyXG4gICAgICAvLyBFLmcuIDU2NzAwIGJlY29tZXMgNTYwMDAgaWYgNyBpcyB0aGUgcm91bmRpbmcgZGlnaXQuXHJcbiAgICAgIC8vIGogPiAwIG1lYW5zIGkgPiBudW1iZXIgb2YgbGVhZGluZyB6ZXJvcyBvZiB3LlxyXG4gICAgICB4ZFt4ZGldID0gaiA+IDAgPyAodyAvIG1hdGhwb3coMTAsIGRpZ2l0cyAtIGopICUgbWF0aHBvdygxMCwgaikgfCAwKSAqIGsgOiAwO1xyXG4gICAgfVxyXG5cclxuICAgIGlmIChyb3VuZFVwKSB7XHJcbiAgICAgIGZvciAoOzspIHtcclxuXHJcbiAgICAgICAgLy8gSXMgdGhlIGRpZ2l0IHRvIGJlIHJvdW5kZWQgdXAgaW4gdGhlIGZpcnN0IHdvcmQgb2YgeGQ/XHJcbiAgICAgICAgaWYgKHhkaSA9PSAwKSB7XHJcblxyXG4gICAgICAgICAgLy8gaSB3aWxsIGJlIHRoZSBsZW5ndGggb2YgeGRbMF0gYmVmb3JlIGsgaXMgYWRkZWQuXHJcbiAgICAgICAgICBmb3IgKGkgPSAxLCBqID0geGRbMF07IGogPj0gMTA7IGogLz0gMTApIGkrKztcclxuICAgICAgICAgIGogPSB4ZFswXSArPSBrO1xyXG4gICAgICAgICAgZm9yIChrID0gMTsgaiA+PSAxMDsgaiAvPSAxMCkgaysrO1xyXG5cclxuICAgICAgICAgIC8vIGlmIGkgIT0gayB0aGUgbGVuZ3RoIGhhcyBpbmNyZWFzZWQuXHJcbiAgICAgICAgICBpZiAoaSAhPSBrKSB7XHJcbiAgICAgICAgICAgIHguZSsrO1xyXG4gICAgICAgICAgICBpZiAoeGRbMF0gPT0gQkFTRSkgeGRbMF0gPSAxO1xyXG4gICAgICAgICAgfVxyXG5cclxuICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICB4ZFt4ZGldICs9IGs7XHJcbiAgICAgICAgICBpZiAoeGRbeGRpXSAhPSBCQVNFKSBicmVhaztcclxuICAgICAgICAgIHhkW3hkaS0tXSA9IDA7XHJcbiAgICAgICAgICBrID0gMTtcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICAvLyBSZW1vdmUgdHJhaWxpbmcgemVyb3MuXHJcbiAgICBmb3IgKGkgPSB4ZC5sZW5ndGg7IHhkWy0taV0gPT09IDA7KSB4ZC5wb3AoKTtcclxuICB9XHJcblxyXG4gIGlmIChleHRlcm5hbCkge1xyXG5cclxuICAgIC8vIE92ZXJmbG93P1xyXG4gICAgaWYgKHguZSA+IEN0b3IubWF4RSkge1xyXG5cclxuICAgICAgLy8gSW5maW5pdHkuXHJcbiAgICAgIHguZCA9IG51bGw7XHJcbiAgICAgIHguZSA9IE5hTjtcclxuXHJcbiAgICAvLyBVbmRlcmZsb3c/XHJcbiAgICB9IGVsc2UgaWYgKHguZSA8IEN0b3IubWluRSkge1xyXG5cclxuICAgICAgLy8gWmVyby5cclxuICAgICAgeC5lID0gMDtcclxuICAgICAgeC5kID0gWzBdO1xyXG4gICAgICAvLyBDdG9yLnVuZGVyZmxvdyA9IHRydWU7XHJcbiAgICB9IC8vIGVsc2UgQ3Rvci51bmRlcmZsb3cgPSBmYWxzZTtcclxuICB9XHJcblxyXG4gIHJldHVybiB4O1xyXG59XHJcblxyXG5cclxuZnVuY3Rpb24gZmluaXRlVG9TdHJpbmcoeCwgaXNFeHAsIHNkKSB7XHJcbiAgaWYgKCF4LmlzRmluaXRlKCkpIHJldHVybiBub25GaW5pdGVUb1N0cmluZyh4KTtcclxuICB2YXIgayxcclxuICAgIGUgPSB4LmUsXHJcbiAgICBzdHIgPSBkaWdpdHNUb1N0cmluZyh4LmQpLFxyXG4gICAgbGVuID0gc3RyLmxlbmd0aDtcclxuXHJcbiAgaWYgKGlzRXhwKSB7XHJcbiAgICBpZiAoc2QgJiYgKGsgPSBzZCAtIGxlbikgPiAwKSB7XHJcbiAgICAgIHN0ciA9IHN0ci5jaGFyQXQoMCkgKyAnLicgKyBzdHIuc2xpY2UoMSkgKyBnZXRaZXJvU3RyaW5nKGspO1xyXG4gICAgfSBlbHNlIGlmIChsZW4gPiAxKSB7XHJcbiAgICAgIHN0ciA9IHN0ci5jaGFyQXQoMCkgKyAnLicgKyBzdHIuc2xpY2UoMSk7XHJcbiAgICB9XHJcblxyXG4gICAgc3RyID0gc3RyICsgKHguZSA8IDAgPyAnZScgOiAnZSsnKSArIHguZTtcclxuICB9IGVsc2UgaWYgKGUgPCAwKSB7XHJcbiAgICBzdHIgPSAnMC4nICsgZ2V0WmVyb1N0cmluZygtZSAtIDEpICsgc3RyO1xyXG4gICAgaWYgKHNkICYmIChrID0gc2QgLSBsZW4pID4gMCkgc3RyICs9IGdldFplcm9TdHJpbmcoayk7XHJcbiAgfSBlbHNlIGlmIChlID49IGxlbikge1xyXG4gICAgc3RyICs9IGdldFplcm9TdHJpbmcoZSArIDEgLSBsZW4pO1xyXG4gICAgaWYgKHNkICYmIChrID0gc2QgLSBlIC0gMSkgPiAwKSBzdHIgPSBzdHIgKyAnLicgKyBnZXRaZXJvU3RyaW5nKGspO1xyXG4gIH0gZWxzZSB7XHJcbiAgICBpZiAoKGsgPSBlICsgMSkgPCBsZW4pIHN0ciA9IHN0ci5zbGljZSgwLCBrKSArICcuJyArIHN0ci5zbGljZShrKTtcclxuICAgIGlmIChzZCAmJiAoayA9IHNkIC0gbGVuKSA+IDApIHtcclxuICAgICAgaWYgKGUgKyAxID09PSBsZW4pIHN0ciArPSAnLic7XHJcbiAgICAgIHN0ciArPSBnZXRaZXJvU3RyaW5nKGspO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgcmV0dXJuIHN0cjtcclxufVxyXG5cclxuXHJcbi8vIENhbGN1bGF0ZSB0aGUgYmFzZSAxMCBleHBvbmVudCBmcm9tIHRoZSBiYXNlIDFlNyBleHBvbmVudC5cclxuZnVuY3Rpb24gZ2V0QmFzZTEwRXhwb25lbnQoZGlnaXRzLCBlKSB7XHJcbiAgdmFyIHcgPSBkaWdpdHNbMF07XHJcblxyXG4gIC8vIEFkZCB0aGUgbnVtYmVyIG9mIGRpZ2l0cyBvZiB0aGUgZmlyc3Qgd29yZCBvZiB0aGUgZGlnaXRzIGFycmF5LlxyXG4gIGZvciAoIGUgKj0gTE9HX0JBU0U7IHcgPj0gMTA7IHcgLz0gMTApIGUrKztcclxuICByZXR1cm4gZTtcclxufVxyXG5cclxuXHJcbmZ1bmN0aW9uIGdldExuMTAoQ3Rvciwgc2QsIHByKSB7XHJcbiAgaWYgKHNkID4gTE4xMF9QUkVDSVNJT04pIHtcclxuXHJcbiAgICAvLyBSZXNldCBnbG9iYWwgc3RhdGUgaW4gY2FzZSB0aGUgZXhjZXB0aW9uIGlzIGNhdWdodC5cclxuICAgIGV4dGVybmFsID0gdHJ1ZTtcclxuICAgIGlmIChwcikgQ3Rvci5wcmVjaXNpb24gPSBwcjtcclxuICAgIHRocm93IEVycm9yKHByZWNpc2lvbkxpbWl0RXhjZWVkZWQpO1xyXG4gIH1cclxuICByZXR1cm4gZmluYWxpc2UobmV3IEN0b3IoTE4xMCksIHNkLCAxLCB0cnVlKTtcclxufVxyXG5cclxuXHJcbmZ1bmN0aW9uIGdldFBpKEN0b3IsIHNkLCBybSkge1xyXG4gIGlmIChzZCA+IFBJX1BSRUNJU0lPTikgdGhyb3cgRXJyb3IocHJlY2lzaW9uTGltaXRFeGNlZWRlZCk7XHJcbiAgcmV0dXJuIGZpbmFsaXNlKG5ldyBDdG9yKFBJKSwgc2QsIHJtLCB0cnVlKTtcclxufVxyXG5cclxuXHJcbmZ1bmN0aW9uIGdldFByZWNpc2lvbihkaWdpdHMpIHtcclxuICB2YXIgdyA9IGRpZ2l0cy5sZW5ndGggLSAxLFxyXG4gICAgbGVuID0gdyAqIExPR19CQVNFICsgMTtcclxuXHJcbiAgdyA9IGRpZ2l0c1t3XTtcclxuXHJcbiAgLy8gSWYgbm9uLXplcm8uLi5cclxuICBpZiAodykge1xyXG5cclxuICAgIC8vIFN1YnRyYWN0IHRoZSBudW1iZXIgb2YgdHJhaWxpbmcgemVyb3Mgb2YgdGhlIGxhc3Qgd29yZC5cclxuICAgIGZvciAoOyB3ICUgMTAgPT0gMDsgdyAvPSAxMCkgbGVuLS07XHJcblxyXG4gICAgLy8gQWRkIHRoZSBudW1iZXIgb2YgZGlnaXRzIG9mIHRoZSBmaXJzdCB3b3JkLlxyXG4gICAgZm9yICh3ID0gZGlnaXRzWzBdOyB3ID49IDEwOyB3IC89IDEwKSBsZW4rKztcclxuICB9XHJcblxyXG4gIHJldHVybiBsZW47XHJcbn1cclxuXHJcblxyXG5mdW5jdGlvbiBnZXRaZXJvU3RyaW5nKGspIHtcclxuICB2YXIgenMgPSAnJztcclxuICBmb3IgKDsgay0tOykgenMgKz0gJzAnO1xyXG4gIHJldHVybiB6cztcclxufVxyXG5cclxuXHJcbi8qXHJcbiAqIFJldHVybiBhIG5ldyBEZWNpbWFsIHdob3NlIHZhbHVlIGlzIHRoZSB2YWx1ZSBvZiBEZWNpbWFsIGB4YCB0byB0aGUgcG93ZXIgYG5gLCB3aGVyZSBgbmAgaXMgYW5cclxuICogaW50ZWdlciBvZiB0eXBlIG51bWJlci5cclxuICpcclxuICogSW1wbGVtZW50cyAnZXhwb25lbnRpYXRpb24gYnkgc3F1YXJpbmcnLiBDYWxsZWQgYnkgYHBvd2AgYW5kIGBwYXJzZU90aGVyYC5cclxuICpcclxuICovXHJcbmZ1bmN0aW9uIGludFBvdyhDdG9yLCB4LCBuLCBwcikge1xyXG4gIHZhciBpc1RydW5jYXRlZCxcclxuICAgIHIgPSBuZXcgQ3RvcigxKSxcclxuXHJcbiAgICAvLyBNYXggbiBvZiA5MDA3MTk5MjU0NzQwOTkxIHRha2VzIDUzIGxvb3AgaXRlcmF0aW9ucy5cclxuICAgIC8vIE1heGltdW0gZGlnaXRzIGFycmF5IGxlbmd0aDsgbGVhdmVzIFsyOCwgMzRdIGd1YXJkIGRpZ2l0cy5cclxuICAgIGsgPSBNYXRoLmNlaWwocHIgLyBMT0dfQkFTRSArIDQpO1xyXG5cclxuICBleHRlcm5hbCA9IGZhbHNlO1xyXG5cclxuICBmb3IgKDs7KSB7XHJcbiAgICBpZiAobiAlIDIpIHtcclxuICAgICAgciA9IHIudGltZXMoeCk7XHJcbiAgICAgIGlmICh0cnVuY2F0ZShyLmQsIGspKSBpc1RydW5jYXRlZCA9IHRydWU7XHJcbiAgICB9XHJcblxyXG4gICAgbiA9IG1hdGhmbG9vcihuIC8gMik7XHJcbiAgICBpZiAobiA9PT0gMCkge1xyXG5cclxuICAgICAgLy8gVG8gZW5zdXJlIGNvcnJlY3Qgcm91bmRpbmcgd2hlbiByLmQgaXMgdHJ1bmNhdGVkLCBpbmNyZW1lbnQgdGhlIGxhc3Qgd29yZCBpZiBpdCBpcyB6ZXJvLlxyXG4gICAgICBuID0gci5kLmxlbmd0aCAtIDE7XHJcbiAgICAgIGlmIChpc1RydW5jYXRlZCAmJiByLmRbbl0gPT09IDApICsrci5kW25dO1xyXG4gICAgICBicmVhaztcclxuICAgIH1cclxuXHJcbiAgICB4ID0geC50aW1lcyh4KTtcclxuICAgIHRydW5jYXRlKHguZCwgayk7XHJcbiAgfVxyXG5cclxuICBleHRlcm5hbCA9IHRydWU7XHJcblxyXG4gIHJldHVybiByO1xyXG59XHJcblxyXG5cclxuZnVuY3Rpb24gaXNPZGQobikge1xyXG4gIHJldHVybiBuLmRbbi5kLmxlbmd0aCAtIDFdICYgMTtcclxufVxyXG5cclxuXHJcbi8qXHJcbiAqIEhhbmRsZSBgbWF4YCBhbmQgYG1pbmAuIGBsdGd0YCBpcyAnbHQnIG9yICdndCcuXHJcbiAqL1xyXG5mdW5jdGlvbiBtYXhPck1pbihDdG9yLCBhcmdzLCBsdGd0KSB7XHJcbiAgdmFyIHksXHJcbiAgICB4ID0gbmV3IEN0b3IoYXJnc1swXSksXHJcbiAgICBpID0gMDtcclxuXHJcbiAgZm9yICg7ICsraSA8IGFyZ3MubGVuZ3RoOykge1xyXG4gICAgeSA9IG5ldyBDdG9yKGFyZ3NbaV0pO1xyXG4gICAgaWYgKCF5LnMpIHtcclxuICAgICAgeCA9IHk7XHJcbiAgICAgIGJyZWFrO1xyXG4gICAgfSBlbHNlIGlmICh4W2x0Z3RdKHkpKSB7XHJcbiAgICAgIHggPSB5O1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgcmV0dXJuIHg7XHJcbn1cclxuXHJcblxyXG4vKlxyXG4gKiBSZXR1cm4gYSBuZXcgRGVjaW1hbCB3aG9zZSB2YWx1ZSBpcyB0aGUgbmF0dXJhbCBleHBvbmVudGlhbCBvZiBgeGAgcm91bmRlZCB0byBgc2RgIHNpZ25pZmljYW50XHJcbiAqIGRpZ2l0cy5cclxuICpcclxuICogVGF5bG9yL01hY2xhdXJpbiBzZXJpZXMuXHJcbiAqXHJcbiAqIGV4cCh4KSA9IHheMC8wISArIHheMS8xISArIHheMi8yISArIHheMy8zISArIC4uLlxyXG4gKlxyXG4gKiBBcmd1bWVudCByZWR1Y3Rpb246XHJcbiAqICAgUmVwZWF0IHggPSB4IC8gMzIsIGsgKz0gNSwgdW50aWwgfHh8IDwgMC4xXHJcbiAqICAgZXhwKHgpID0gZXhwKHggLyAyXmspXigyXmspXHJcbiAqXHJcbiAqIFByZXZpb3VzbHksIHRoZSBhcmd1bWVudCB3YXMgaW5pdGlhbGx5IHJlZHVjZWQgYnlcclxuICogZXhwKHgpID0gZXhwKHIpICogMTBeayAgd2hlcmUgciA9IHggLSBrICogbG4xMCwgayA9IGZsb29yKHggLyBsbjEwKVxyXG4gKiB0byBmaXJzdCBwdXQgciBpbiB0aGUgcmFuZ2UgWzAsIGxuMTBdLCBiZWZvcmUgZGl2aWRpbmcgYnkgMzIgdW50aWwgfHh8IDwgMC4xLCBidXQgdGhpcyB3YXNcclxuICogZm91bmQgdG8gYmUgc2xvd2VyIHRoYW4ganVzdCBkaXZpZGluZyByZXBlYXRlZGx5IGJ5IDMyIGFzIGFib3ZlLlxyXG4gKlxyXG4gKiBNYXggaW50ZWdlciBhcmd1bWVudDogZXhwKCcyMDcyMzI2NTgzNjk0NjQxMycpID0gNi4zZSs5MDAwMDAwMDAwMDAwMDAwXHJcbiAqIE1pbiBpbnRlZ2VyIGFyZ3VtZW50OiBleHAoJy0yMDcyMzI2NTgzNjk0NjQxMScpID0gMS4yZS05MDAwMDAwMDAwMDAwMDAwXHJcbiAqIChNYXRoIG9iamVjdCBpbnRlZ2VyIG1pbi9tYXg6IE1hdGguZXhwKDcwOSkgPSA4LjJlKzMwNywgTWF0aC5leHAoLTc0NSkgPSA1ZS0zMjQpXHJcbiAqXHJcbiAqICBleHAoSW5maW5pdHkpICA9IEluZmluaXR5XHJcbiAqICBleHAoLUluZmluaXR5KSA9IDBcclxuICogIGV4cChOYU4pICAgICAgID0gTmFOXHJcbiAqICBleHAoXHUwMEIxMCkgICAgICAgID0gMVxyXG4gKlxyXG4gKiAgZXhwKHgpIGlzIG5vbi10ZXJtaW5hdGluZyBmb3IgYW55IGZpbml0ZSwgbm9uLXplcm8geC5cclxuICpcclxuICogIFRoZSByZXN1bHQgd2lsbCBhbHdheXMgYmUgY29ycmVjdGx5IHJvdW5kZWQuXHJcbiAqXHJcbiAqL1xyXG5mdW5jdGlvbiBuYXR1cmFsRXhwb25lbnRpYWwoeCwgc2QpIHtcclxuICB2YXIgZGVub21pbmF0b3IsIGd1YXJkLCBqLCBwb3csIHN1bSwgdCwgd3ByLFxyXG4gICAgcmVwID0gMCxcclxuICAgIGkgPSAwLFxyXG4gICAgayA9IDAsXHJcbiAgICBDdG9yID0geC5jb25zdHJ1Y3RvcixcclxuICAgIHJtID0gQ3Rvci5yb3VuZGluZyxcclxuICAgIHByID0gQ3Rvci5wcmVjaXNpb247XHJcblxyXG4gIC8vIDAvTmFOL0luZmluaXR5P1xyXG4gIGlmICgheC5kIHx8ICF4LmRbMF0gfHwgeC5lID4gMTcpIHtcclxuXHJcbiAgICByZXR1cm4gbmV3IEN0b3IoeC5kXHJcbiAgICAgID8gIXguZFswXSA/IDEgOiB4LnMgPCAwID8gMCA6IDEgLyAwXHJcbiAgICAgIDogeC5zID8geC5zIDwgMCA/IDAgOiB4IDogMCAvIDApO1xyXG4gIH1cclxuXHJcbiAgaWYgKHNkID09IG51bGwpIHtcclxuICAgIGV4dGVybmFsID0gZmFsc2U7XHJcbiAgICB3cHIgPSBwcjtcclxuICB9IGVsc2Uge1xyXG4gICAgd3ByID0gc2Q7XHJcbiAgfVxyXG5cclxuICB0ID0gbmV3IEN0b3IoMC4wMzEyNSk7XHJcblxyXG4gIC8vIHdoaWxlIGFicyh4KSA+PSAwLjFcclxuICB3aGlsZSAoeC5lID4gLTIpIHtcclxuXHJcbiAgICAvLyB4ID0geCAvIDJeNVxyXG4gICAgeCA9IHgudGltZXModCk7XHJcbiAgICBrICs9IDU7XHJcbiAgfVxyXG5cclxuICAvLyBVc2UgMiAqIGxvZzEwKDJeaykgKyA1IChlbXBpcmljYWxseSBkZXJpdmVkKSB0byBlc3RpbWF0ZSB0aGUgaW5jcmVhc2UgaW4gcHJlY2lzaW9uXHJcbiAgLy8gbmVjZXNzYXJ5IHRvIGVuc3VyZSB0aGUgZmlyc3QgNCByb3VuZGluZyBkaWdpdHMgYXJlIGNvcnJlY3QuXHJcbiAgZ3VhcmQgPSBNYXRoLmxvZyhtYXRocG93KDIsIGspKSAvIE1hdGguTE4xMCAqIDIgKyA1IHwgMDtcclxuICB3cHIgKz0gZ3VhcmQ7XHJcbiAgZGVub21pbmF0b3IgPSBwb3cgPSBzdW0gPSBuZXcgQ3RvcigxKTtcclxuICBDdG9yLnByZWNpc2lvbiA9IHdwcjtcclxuXHJcbiAgZm9yICg7Oykge1xyXG4gICAgcG93ID0gZmluYWxpc2UocG93LnRpbWVzKHgpLCB3cHIsIDEpO1xyXG4gICAgZGVub21pbmF0b3IgPSBkZW5vbWluYXRvci50aW1lcygrK2kpO1xyXG4gICAgdCA9IHN1bS5wbHVzKGRpdmlkZShwb3csIGRlbm9taW5hdG9yLCB3cHIsIDEpKTtcclxuXHJcbiAgICBpZiAoZGlnaXRzVG9TdHJpbmcodC5kKS5zbGljZSgwLCB3cHIpID09PSBkaWdpdHNUb1N0cmluZyhzdW0uZCkuc2xpY2UoMCwgd3ByKSkge1xyXG4gICAgICBqID0gaztcclxuICAgICAgd2hpbGUgKGotLSkgc3VtID0gZmluYWxpc2Uoc3VtLnRpbWVzKHN1bSksIHdwciwgMSk7XHJcblxyXG4gICAgICAvLyBDaGVjayB0byBzZWUgaWYgdGhlIGZpcnN0IDQgcm91bmRpbmcgZGlnaXRzIGFyZSBbNDldOTk5LlxyXG4gICAgICAvLyBJZiBzbywgcmVwZWF0IHRoZSBzdW1tYXRpb24gd2l0aCBhIGhpZ2hlciBwcmVjaXNpb24sIG90aGVyd2lzZVxyXG4gICAgICAvLyBlLmcuIHdpdGggcHJlY2lzaW9uOiAxOCwgcm91bmRpbmc6IDFcclxuICAgICAgLy8gZXhwKDE4LjQwNDI3MjQ2MjU5NTAzNDA4MzU2Nzc5MzkxOTg0Mzc2MSkgPSA5ODM3MjU2MC4xMjI5OTk5OTk5IChzaG91bGQgYmUgOTgzNzI1NjAuMTIzKVxyXG4gICAgICAvLyBgd3ByIC0gZ3VhcmRgIGlzIHRoZSBpbmRleCBvZiBmaXJzdCByb3VuZGluZyBkaWdpdC5cclxuICAgICAgaWYgKHNkID09IG51bGwpIHtcclxuXHJcbiAgICAgICAgaWYgKHJlcCA8IDMgJiYgY2hlY2tSb3VuZGluZ0RpZ2l0cyhzdW0uZCwgd3ByIC0gZ3VhcmQsIHJtLCByZXApKSB7XHJcbiAgICAgICAgICBDdG9yLnByZWNpc2lvbiA9IHdwciArPSAxMDtcclxuICAgICAgICAgIGRlbm9taW5hdG9yID0gcG93ID0gdCA9IG5ldyBDdG9yKDEpO1xyXG4gICAgICAgICAgaSA9IDA7XHJcbiAgICAgICAgICByZXArKztcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgcmV0dXJuIGZpbmFsaXNlKHN1bSwgQ3Rvci5wcmVjaXNpb24gPSBwciwgcm0sIGV4dGVybmFsID0gdHJ1ZSk7XHJcbiAgICAgICAgfVxyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIEN0b3IucHJlY2lzaW9uID0gcHI7XHJcbiAgICAgICAgcmV0dXJuIHN1bTtcclxuICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHN1bSA9IHQ7XHJcbiAgfVxyXG59XHJcblxyXG5cclxuLypcclxuICogUmV0dXJuIGEgbmV3IERlY2ltYWwgd2hvc2UgdmFsdWUgaXMgdGhlIG5hdHVyYWwgbG9nYXJpdGhtIG9mIGB4YCByb3VuZGVkIHRvIGBzZGAgc2lnbmlmaWNhbnRcclxuICogZGlnaXRzLlxyXG4gKlxyXG4gKiAgbG4oLW4pICAgICAgICA9IE5hTlxyXG4gKiAgbG4oMCkgICAgICAgICA9IC1JbmZpbml0eVxyXG4gKiAgbG4oLTApICAgICAgICA9IC1JbmZpbml0eVxyXG4gKiAgbG4oMSkgICAgICAgICA9IDBcclxuICogIGxuKEluZmluaXR5KSAgPSBJbmZpbml0eVxyXG4gKiAgbG4oLUluZmluaXR5KSA9IE5hTlxyXG4gKiAgbG4oTmFOKSAgICAgICA9IE5hTlxyXG4gKlxyXG4gKiAgbG4obikgKG4gIT0gMSkgaXMgbm9uLXRlcm1pbmF0aW5nLlxyXG4gKlxyXG4gKi9cclxuZnVuY3Rpb24gbmF0dXJhbExvZ2FyaXRobSh5LCBzZCkge1xyXG4gIHZhciBjLCBjMCwgZGVub21pbmF0b3IsIGUsIG51bWVyYXRvciwgcmVwLCBzdW0sIHQsIHdwciwgeDEsIHgyLFxyXG4gICAgbiA9IDEsXHJcbiAgICBndWFyZCA9IDEwLFxyXG4gICAgeCA9IHksXHJcbiAgICB4ZCA9IHguZCxcclxuICAgIEN0b3IgPSB4LmNvbnN0cnVjdG9yLFxyXG4gICAgcm0gPSBDdG9yLnJvdW5kaW5nLFxyXG4gICAgcHIgPSBDdG9yLnByZWNpc2lvbjtcclxuXHJcbiAgLy8gSXMgeCBuZWdhdGl2ZSBvciBJbmZpbml0eSwgTmFOLCAwIG9yIDE/XHJcbiAgaWYgKHgucyA8IDAgfHwgIXhkIHx8ICF4ZFswXSB8fCAheC5lICYmIHhkWzBdID09IDEgJiYgeGQubGVuZ3RoID09IDEpIHtcclxuICAgIHJldHVybiBuZXcgQ3Rvcih4ZCAmJiAheGRbMF0gPyAtMSAvIDAgOiB4LnMgIT0gMSA/IE5hTiA6IHhkID8gMCA6IHgpO1xyXG4gIH1cclxuXHJcbiAgaWYgKHNkID09IG51bGwpIHtcclxuICAgIGV4dGVybmFsID0gZmFsc2U7XHJcbiAgICB3cHIgPSBwcjtcclxuICB9IGVsc2Uge1xyXG4gICAgd3ByID0gc2Q7XHJcbiAgfVxyXG5cclxuICBDdG9yLnByZWNpc2lvbiA9IHdwciArPSBndWFyZDtcclxuICBjID0gZGlnaXRzVG9TdHJpbmcoeGQpO1xyXG4gIGMwID0gYy5jaGFyQXQoMCk7XHJcblxyXG4gIGlmIChNYXRoLmFicyhlID0geC5lKSA8IDEuNWUxNSkge1xyXG5cclxuICAgIC8vIEFyZ3VtZW50IHJlZHVjdGlvbi5cclxuICAgIC8vIFRoZSBzZXJpZXMgY29udmVyZ2VzIGZhc3RlciB0aGUgY2xvc2VyIHRoZSBhcmd1bWVudCBpcyB0byAxLCBzbyB1c2luZ1xyXG4gICAgLy8gbG4oYV5iKSA9IGIgKiBsbihhKSwgICBsbihhKSA9IGxuKGFeYikgLyBiXHJcbiAgICAvLyBtdWx0aXBseSB0aGUgYXJndW1lbnQgYnkgaXRzZWxmIHVudGlsIHRoZSBsZWFkaW5nIGRpZ2l0cyBvZiB0aGUgc2lnbmlmaWNhbmQgYXJlIDcsIDgsIDksXHJcbiAgICAvLyAxMCwgMTEsIDEyIG9yIDEzLCByZWNvcmRpbmcgdGhlIG51bWJlciBvZiBtdWx0aXBsaWNhdGlvbnMgc28gdGhlIHN1bSBvZiB0aGUgc2VyaWVzIGNhblxyXG4gICAgLy8gbGF0ZXIgYmUgZGl2aWRlZCBieSB0aGlzIG51bWJlciwgdGhlbiBzZXBhcmF0ZSBvdXQgdGhlIHBvd2VyIG9mIDEwIHVzaW5nXHJcbiAgICAvLyBsbihhKjEwXmIpID0gbG4oYSkgKyBiKmxuKDEwKS5cclxuXHJcbiAgICAvLyBtYXggbiBpcyAyMSAoZ2l2ZXMgMC45LCAxLjAgb3IgMS4xKSAoOWUxNSAvIDIxID0gNC4yZTE0KS5cclxuICAgIC8vd2hpbGUgKGMwIDwgOSAmJiBjMCAhPSAxIHx8IGMwID09IDEgJiYgYy5jaGFyQXQoMSkgPiAxKSB7XHJcbiAgICAvLyBtYXggbiBpcyA2IChnaXZlcyAwLjcgLSAxLjMpXHJcbiAgICB3aGlsZSAoYzAgPCA3ICYmIGMwICE9IDEgfHwgYzAgPT0gMSAmJiBjLmNoYXJBdCgxKSA+IDMpIHtcclxuICAgICAgeCA9IHgudGltZXMoeSk7XHJcbiAgICAgIGMgPSBkaWdpdHNUb1N0cmluZyh4LmQpO1xyXG4gICAgICBjMCA9IGMuY2hhckF0KDApO1xyXG4gICAgICBuKys7XHJcbiAgICB9XHJcblxyXG4gICAgZSA9IHguZTtcclxuXHJcbiAgICBpZiAoYzAgPiAxKSB7XHJcbiAgICAgIHggPSBuZXcgQ3RvcignMC4nICsgYyk7XHJcbiAgICAgIGUrKztcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIHggPSBuZXcgQ3RvcihjMCArICcuJyArIGMuc2xpY2UoMSkpO1xyXG4gICAgfVxyXG4gIH0gZWxzZSB7XHJcblxyXG4gICAgLy8gVGhlIGFyZ3VtZW50IHJlZHVjdGlvbiBtZXRob2QgYWJvdmUgbWF5IHJlc3VsdCBpbiBvdmVyZmxvdyBpZiB0aGUgYXJndW1lbnQgeSBpcyBhIG1hc3NpdmVcclxuICAgIC8vIG51bWJlciB3aXRoIGV4cG9uZW50ID49IDE1MDAwMDAwMDAwMDAwMDAgKDllMTUgLyA2ID0gMS41ZTE1KSwgc28gaW5zdGVhZCByZWNhbGwgdGhpc1xyXG4gICAgLy8gZnVuY3Rpb24gdXNpbmcgbG4oeCoxMF5lKSA9IGxuKHgpICsgZSpsbigxMCkuXHJcbiAgICB0ID0gZ2V0TG4xMChDdG9yLCB3cHIgKyAyLCBwcikudGltZXMoZSArICcnKTtcclxuICAgIHggPSBuYXR1cmFsTG9nYXJpdGhtKG5ldyBDdG9yKGMwICsgJy4nICsgYy5zbGljZSgxKSksIHdwciAtIGd1YXJkKS5wbHVzKHQpO1xyXG4gICAgQ3Rvci5wcmVjaXNpb24gPSBwcjtcclxuXHJcbiAgICByZXR1cm4gc2QgPT0gbnVsbCA/IGZpbmFsaXNlKHgsIHByLCBybSwgZXh0ZXJuYWwgPSB0cnVlKSA6IHg7XHJcbiAgfVxyXG5cclxuICAvLyB4MSBpcyB4IHJlZHVjZWQgdG8gYSB2YWx1ZSBuZWFyIDEuXHJcbiAgeDEgPSB4O1xyXG5cclxuICAvLyBUYXlsb3Igc2VyaWVzLlxyXG4gIC8vIGxuKHkpID0gbG4oKDEgKyB4KS8oMSAtIHgpKSA9IDIoeCArIHheMy8zICsgeF41LzUgKyB4XjcvNyArIC4uLilcclxuICAvLyB3aGVyZSB4ID0gKHkgLSAxKS8oeSArIDEpICAgICh8eHwgPCAxKVxyXG4gIHN1bSA9IG51bWVyYXRvciA9IHggPSBkaXZpZGUoeC5taW51cygxKSwgeC5wbHVzKDEpLCB3cHIsIDEpO1xyXG4gIHgyID0gZmluYWxpc2UoeC50aW1lcyh4KSwgd3ByLCAxKTtcclxuICBkZW5vbWluYXRvciA9IDM7XHJcblxyXG4gIGZvciAoOzspIHtcclxuICAgIG51bWVyYXRvciA9IGZpbmFsaXNlKG51bWVyYXRvci50aW1lcyh4MiksIHdwciwgMSk7XHJcbiAgICB0ID0gc3VtLnBsdXMoZGl2aWRlKG51bWVyYXRvciwgbmV3IEN0b3IoZGVub21pbmF0b3IpLCB3cHIsIDEpKTtcclxuXHJcbiAgICBpZiAoZGlnaXRzVG9TdHJpbmcodC5kKS5zbGljZSgwLCB3cHIpID09PSBkaWdpdHNUb1N0cmluZyhzdW0uZCkuc2xpY2UoMCwgd3ByKSkge1xyXG4gICAgICBzdW0gPSBzdW0udGltZXMoMik7XHJcblxyXG4gICAgICAvLyBSZXZlcnNlIHRoZSBhcmd1bWVudCByZWR1Y3Rpb24uIENoZWNrIHRoYXQgZSBpcyBub3QgMCBiZWNhdXNlLCBiZXNpZGVzIHByZXZlbnRpbmcgYW5cclxuICAgICAgLy8gdW5uZWNlc3NhcnkgY2FsY3VsYXRpb24sIC0wICsgMCA9ICswIGFuZCB0byBlbnN1cmUgY29ycmVjdCByb3VuZGluZyAtMCBuZWVkcyB0byBzdGF5IC0wLlxyXG4gICAgICBpZiAoZSAhPT0gMCkgc3VtID0gc3VtLnBsdXMoZ2V0TG4xMChDdG9yLCB3cHIgKyAyLCBwcikudGltZXMoZSArICcnKSk7XHJcbiAgICAgIHN1bSA9IGRpdmlkZShzdW0sIG5ldyBDdG9yKG4pLCB3cHIsIDEpO1xyXG5cclxuICAgICAgLy8gSXMgcm0gPiAzIGFuZCB0aGUgZmlyc3QgNCByb3VuZGluZyBkaWdpdHMgNDk5OSwgb3Igcm0gPCA0IChvciB0aGUgc3VtbWF0aW9uIGhhc1xyXG4gICAgICAvLyBiZWVuIHJlcGVhdGVkIHByZXZpb3VzbHkpIGFuZCB0aGUgZmlyc3QgNCByb3VuZGluZyBkaWdpdHMgOTk5OT9cclxuICAgICAgLy8gSWYgc28sIHJlc3RhcnQgdGhlIHN1bW1hdGlvbiB3aXRoIGEgaGlnaGVyIHByZWNpc2lvbiwgb3RoZXJ3aXNlXHJcbiAgICAgIC8vIGUuZy4gd2l0aCBwcmVjaXNpb246IDEyLCByb3VuZGluZzogMVxyXG4gICAgICAvLyBsbigxMzU1MjAwMjguNjEyNjA5MTcxNDI2NTM4MTUzMykgPSAxOC43MjQ2Mjk5OTk5IHdoZW4gaXQgc2hvdWxkIGJlIDE4LjcyNDYzLlxyXG4gICAgICAvLyBgd3ByIC0gZ3VhcmRgIGlzIHRoZSBpbmRleCBvZiBmaXJzdCByb3VuZGluZyBkaWdpdC5cclxuICAgICAgaWYgKHNkID09IG51bGwpIHtcclxuICAgICAgICBpZiAoY2hlY2tSb3VuZGluZ0RpZ2l0cyhzdW0uZCwgd3ByIC0gZ3VhcmQsIHJtLCByZXApKSB7XHJcbiAgICAgICAgICBDdG9yLnByZWNpc2lvbiA9IHdwciArPSBndWFyZDtcclxuICAgICAgICAgIHQgPSBudW1lcmF0b3IgPSB4ID0gZGl2aWRlKHgxLm1pbnVzKDEpLCB4MS5wbHVzKDEpLCB3cHIsIDEpO1xyXG4gICAgICAgICAgeDIgPSBmaW5hbGlzZSh4LnRpbWVzKHgpLCB3cHIsIDEpO1xyXG4gICAgICAgICAgZGVub21pbmF0b3IgPSByZXAgPSAxO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICByZXR1cm4gZmluYWxpc2Uoc3VtLCBDdG9yLnByZWNpc2lvbiA9IHByLCBybSwgZXh0ZXJuYWwgPSB0cnVlKTtcclxuICAgICAgICB9XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgQ3Rvci5wcmVjaXNpb24gPSBwcjtcclxuICAgICAgICByZXR1cm4gc3VtO1xyXG4gICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgc3VtID0gdDtcclxuICAgIGRlbm9taW5hdG9yICs9IDI7XHJcbiAgfVxyXG59XHJcblxyXG5cclxuLy8gXHUwMEIxSW5maW5pdHksIE5hTi5cclxuZnVuY3Rpb24gbm9uRmluaXRlVG9TdHJpbmcoeCkge1xyXG4gIC8vIFVuc2lnbmVkLlxyXG4gIHJldHVybiBTdHJpbmcoeC5zICogeC5zIC8gMCk7XHJcbn1cclxuXHJcblxyXG4vKlxyXG4gKiBQYXJzZSB0aGUgdmFsdWUgb2YgYSBuZXcgRGVjaW1hbCBgeGAgZnJvbSBzdHJpbmcgYHN0cmAuXHJcbiAqL1xyXG5mdW5jdGlvbiBwYXJzZURlY2ltYWwoeCwgc3RyKSB7XHJcbiAgdmFyIGUsIGksIGxlbjtcclxuXHJcbiAgLy8gRGVjaW1hbCBwb2ludD9cclxuICBpZiAoKGUgPSBzdHIuaW5kZXhPZignLicpKSA+IC0xKSBzdHIgPSBzdHIucmVwbGFjZSgnLicsICcnKTtcclxuXHJcbiAgLy8gRXhwb25lbnRpYWwgZm9ybT9cclxuICBpZiAoKGkgPSBzdHIuc2VhcmNoKC9lL2kpKSA+IDApIHtcclxuXHJcbiAgICAvLyBEZXRlcm1pbmUgZXhwb25lbnQuXHJcbiAgICBpZiAoZSA8IDApIGUgPSBpO1xyXG4gICAgZSArPSArc3RyLnNsaWNlKGkgKyAxKTtcclxuICAgIHN0ciA9IHN0ci5zdWJzdHJpbmcoMCwgaSk7XHJcbiAgfSBlbHNlIGlmIChlIDwgMCkge1xyXG5cclxuICAgIC8vIEludGVnZXIuXHJcbiAgICBlID0gc3RyLmxlbmd0aDtcclxuICB9XHJcblxyXG4gIC8vIERldGVybWluZSBsZWFkaW5nIHplcm9zLlxyXG4gIGZvciAoaSA9IDA7IHN0ci5jaGFyQ29kZUF0KGkpID09PSA0ODsgaSsrKTtcclxuXHJcbiAgLy8gRGV0ZXJtaW5lIHRyYWlsaW5nIHplcm9zLlxyXG4gIGZvciAobGVuID0gc3RyLmxlbmd0aDsgc3RyLmNoYXJDb2RlQXQobGVuIC0gMSkgPT09IDQ4OyAtLWxlbik7XHJcbiAgc3RyID0gc3RyLnNsaWNlKGksIGxlbik7XHJcblxyXG4gIGlmIChzdHIpIHtcclxuICAgIGxlbiAtPSBpO1xyXG4gICAgeC5lID0gZSA9IGUgLSBpIC0gMTtcclxuICAgIHguZCA9IFtdO1xyXG5cclxuICAgIC8vIFRyYW5zZm9ybSBiYXNlXHJcblxyXG4gICAgLy8gZSBpcyB0aGUgYmFzZSAxMCBleHBvbmVudC5cclxuICAgIC8vIGkgaXMgd2hlcmUgdG8gc2xpY2Ugc3RyIHRvIGdldCB0aGUgZmlyc3Qgd29yZCBvZiB0aGUgZGlnaXRzIGFycmF5LlxyXG4gICAgaSA9IChlICsgMSkgJSBMT0dfQkFTRTtcclxuICAgIGlmIChlIDwgMCkgaSArPSBMT0dfQkFTRTtcclxuXHJcbiAgICBpZiAoaSA8IGxlbikge1xyXG4gICAgICBpZiAoaSkgeC5kLnB1c2goK3N0ci5zbGljZSgwLCBpKSk7XHJcbiAgICAgIGZvciAobGVuIC09IExPR19CQVNFOyBpIDwgbGVuOykgeC5kLnB1c2goK3N0ci5zbGljZShpLCBpICs9IExPR19CQVNFKSk7XHJcbiAgICAgIHN0ciA9IHN0ci5zbGljZShpKTtcclxuICAgICAgaSA9IExPR19CQVNFIC0gc3RyLmxlbmd0aDtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIGkgLT0gbGVuO1xyXG4gICAgfVxyXG5cclxuICAgIGZvciAoOyBpLS07KSBzdHIgKz0gJzAnO1xyXG4gICAgeC5kLnB1c2goK3N0cik7XHJcblxyXG4gICAgaWYgKGV4dGVybmFsKSB7XHJcblxyXG4gICAgICAvLyBPdmVyZmxvdz9cclxuICAgICAgaWYgKHguZSA+IHguY29uc3RydWN0b3IubWF4RSkge1xyXG5cclxuICAgICAgICAvLyBJbmZpbml0eS5cclxuICAgICAgICB4LmQgPSBudWxsO1xyXG4gICAgICAgIHguZSA9IE5hTjtcclxuXHJcbiAgICAgIC8vIFVuZGVyZmxvdz9cclxuICAgICAgfSBlbHNlIGlmICh4LmUgPCB4LmNvbnN0cnVjdG9yLm1pbkUpIHtcclxuXHJcbiAgICAgICAgLy8gWmVyby5cclxuICAgICAgICB4LmUgPSAwO1xyXG4gICAgICAgIHguZCA9IFswXTtcclxuICAgICAgICAvLyB4LmNvbnN0cnVjdG9yLnVuZGVyZmxvdyA9IHRydWU7XHJcbiAgICAgIH0gLy8gZWxzZSB4LmNvbnN0cnVjdG9yLnVuZGVyZmxvdyA9IGZhbHNlO1xyXG4gICAgfVxyXG4gIH0gZWxzZSB7XHJcblxyXG4gICAgLy8gWmVyby5cclxuICAgIHguZSA9IDA7XHJcbiAgICB4LmQgPSBbMF07XHJcbiAgfVxyXG5cclxuICByZXR1cm4geDtcclxufVxyXG5cclxuXHJcbi8qXHJcbiAqIFBhcnNlIHRoZSB2YWx1ZSBvZiBhIG5ldyBEZWNpbWFsIGB4YCBmcm9tIGEgc3RyaW5nIGBzdHJgLCB3aGljaCBpcyBub3QgYSBkZWNpbWFsIHZhbHVlLlxyXG4gKi9cclxuZnVuY3Rpb24gcGFyc2VPdGhlcih4LCBzdHIpIHtcclxuICB2YXIgYmFzZSwgQ3RvciwgZGl2aXNvciwgaSwgaXNGbG9hdCwgbGVuLCBwLCB4ZCwgeGU7XHJcblxyXG4gIGlmIChzdHIuaW5kZXhPZignXycpID4gLTEpIHtcclxuICAgIHN0ciA9IHN0ci5yZXBsYWNlKC8oXFxkKV8oPz1cXGQpL2csICckMScpO1xyXG4gICAgaWYgKGlzRGVjaW1hbC50ZXN0KHN0cikpIHJldHVybiBwYXJzZURlY2ltYWwoeCwgc3RyKTtcclxuICB9IGVsc2UgaWYgKHN0ciA9PT0gJ0luZmluaXR5JyB8fCBzdHIgPT09ICdOYU4nKSB7XHJcbiAgICBpZiAoIStzdHIpIHgucyA9IE5hTjtcclxuICAgIHguZSA9IE5hTjtcclxuICAgIHguZCA9IG51bGw7XHJcbiAgICByZXR1cm4geDtcclxuICB9XHJcblxyXG4gIGlmIChpc0hleC50ZXN0KHN0cikpICB7XHJcbiAgICBiYXNlID0gMTY7XHJcbiAgICBzdHIgPSBzdHIudG9Mb3dlckNhc2UoKTtcclxuICB9IGVsc2UgaWYgKGlzQmluYXJ5LnRlc3Qoc3RyKSkgIHtcclxuICAgIGJhc2UgPSAyO1xyXG4gIH0gZWxzZSBpZiAoaXNPY3RhbC50ZXN0KHN0cikpICB7XHJcbiAgICBiYXNlID0gODtcclxuICB9IGVsc2Uge1xyXG4gICAgdGhyb3cgRXJyb3IoaW52YWxpZEFyZ3VtZW50ICsgc3RyKTtcclxuICB9XHJcblxyXG4gIC8vIElzIHRoZXJlIGEgYmluYXJ5IGV4cG9uZW50IHBhcnQ/XHJcbiAgaSA9IHN0ci5zZWFyY2goL3AvaSk7XHJcblxyXG4gIGlmIChpID4gMCkge1xyXG4gICAgcCA9ICtzdHIuc2xpY2UoaSArIDEpO1xyXG4gICAgc3RyID0gc3RyLnN1YnN0cmluZygyLCBpKTtcclxuICB9IGVsc2Uge1xyXG4gICAgc3RyID0gc3RyLnNsaWNlKDIpO1xyXG4gIH1cclxuXHJcbiAgLy8gQ29udmVydCBgc3RyYCBhcyBhbiBpbnRlZ2VyIHRoZW4gZGl2aWRlIHRoZSByZXN1bHQgYnkgYGJhc2VgIHJhaXNlZCB0byBhIHBvd2VyIHN1Y2ggdGhhdCB0aGVcclxuICAvLyBmcmFjdGlvbiBwYXJ0IHdpbGwgYmUgcmVzdG9yZWQuXHJcbiAgaSA9IHN0ci5pbmRleE9mKCcuJyk7XHJcbiAgaXNGbG9hdCA9IGkgPj0gMDtcclxuICBDdG9yID0geC5jb25zdHJ1Y3RvcjtcclxuXHJcbiAgaWYgKGlzRmxvYXQpIHtcclxuICAgIHN0ciA9IHN0ci5yZXBsYWNlKCcuJywgJycpO1xyXG4gICAgbGVuID0gc3RyLmxlbmd0aDtcclxuICAgIGkgPSBsZW4gLSBpO1xyXG5cclxuICAgIC8vIGxvZ1sxMF0oMTYpID0gMS4yMDQxLi4uICwgbG9nWzEwXSg4OCkgPSAxLjk0NDQuLi4uXHJcbiAgICBkaXZpc29yID0gaW50UG93KEN0b3IsIG5ldyBDdG9yKGJhc2UpLCBpLCBpICogMik7XHJcbiAgfVxyXG5cclxuICB4ZCA9IGNvbnZlcnRCYXNlKHN0ciwgYmFzZSwgQkFTRSk7XHJcbiAgeGUgPSB4ZC5sZW5ndGggLSAxO1xyXG5cclxuICAvLyBSZW1vdmUgdHJhaWxpbmcgemVyb3MuXHJcbiAgZm9yIChpID0geGU7IHhkW2ldID09PSAwOyAtLWkpIHhkLnBvcCgpO1xyXG4gIGlmIChpIDwgMCkgcmV0dXJuIG5ldyBDdG9yKHgucyAqIDApO1xyXG4gIHguZSA9IGdldEJhc2UxMEV4cG9uZW50KHhkLCB4ZSk7XHJcbiAgeC5kID0geGQ7XHJcbiAgZXh0ZXJuYWwgPSBmYWxzZTtcclxuXHJcbiAgLy8gQXQgd2hhdCBwcmVjaXNpb24gdG8gcGVyZm9ybSB0aGUgZGl2aXNpb24gdG8gZW5zdXJlIGV4YWN0IGNvbnZlcnNpb24/XHJcbiAgLy8gbWF4RGVjaW1hbEludGVnZXJQYXJ0RGlnaXRDb3VudCA9IGNlaWwobG9nWzEwXShiKSAqIG90aGVyQmFzZUludGVnZXJQYXJ0RGlnaXRDb3VudClcclxuICAvLyBsb2dbMTBdKDIpID0gMC4zMDEwMywgbG9nWzEwXSg4KSA9IDAuOTAzMDksIGxvZ1sxMF0oMTYpID0gMS4yMDQxMlxyXG4gIC8vIEUuZy4gY2VpbCgxLjIgKiAzKSA9IDQsIHNvIHVwIHRvIDQgZGVjaW1hbCBkaWdpdHMgYXJlIG5lZWRlZCB0byByZXByZXNlbnQgMyBoZXggaW50IGRpZ2l0cy5cclxuICAvLyBtYXhEZWNpbWFsRnJhY3Rpb25QYXJ0RGlnaXRDb3VudCA9IHtIZXg6NHxPY3Q6M3xCaW46MX0gKiBvdGhlckJhc2VGcmFjdGlvblBhcnREaWdpdENvdW50XHJcbiAgLy8gVGhlcmVmb3JlIHVzaW5nIDQgKiB0aGUgbnVtYmVyIG9mIGRpZ2l0cyBvZiBzdHIgd2lsbCBhbHdheXMgYmUgZW5vdWdoLlxyXG4gIGlmIChpc0Zsb2F0KSB4ID0gZGl2aWRlKHgsIGRpdmlzb3IsIGxlbiAqIDQpO1xyXG5cclxuICAvLyBNdWx0aXBseSBieSB0aGUgYmluYXJ5IGV4cG9uZW50IHBhcnQgaWYgcHJlc2VudC5cclxuICBpZiAocCkgeCA9IHgudGltZXMoTWF0aC5hYnMocCkgPCA1NCA/IG1hdGhwb3coMiwgcCkgOiBEZWNpbWFsLnBvdygyLCBwKSk7XHJcbiAgZXh0ZXJuYWwgPSB0cnVlO1xyXG5cclxuICByZXR1cm4geDtcclxufVxyXG5cclxuXHJcbi8qXHJcbiAqIHNpbih4KSA9IHggLSB4XjMvMyEgKyB4XjUvNSEgLSAuLi5cclxuICogfHh8IDwgcGkvMlxyXG4gKlxyXG4gKi9cclxuZnVuY3Rpb24gc2luZShDdG9yLCB4KSB7XHJcbiAgdmFyIGssXHJcbiAgICBsZW4gPSB4LmQubGVuZ3RoO1xyXG5cclxuICBpZiAobGVuIDwgMykge1xyXG4gICAgcmV0dXJuIHguaXNaZXJvKCkgPyB4IDogdGF5bG9yU2VyaWVzKEN0b3IsIDIsIHgsIHgpO1xyXG4gIH1cclxuXHJcbiAgLy8gQXJndW1lbnQgcmVkdWN0aW9uOiBzaW4oNXgpID0gMTYqc2luXjUoeCkgLSAyMCpzaW5eMyh4KSArIDUqc2luKHgpXHJcbiAgLy8gaS5lLiBzaW4oeCkgPSAxNipzaW5eNSh4LzUpIC0gMjAqc2luXjMoeC81KSArIDUqc2luKHgvNSlcclxuICAvLyBhbmQgIHNpbih4KSA9IHNpbih4LzUpKDUgKyBzaW5eMih4LzUpKDE2c2luXjIoeC81KSAtIDIwKSlcclxuXHJcbiAgLy8gRXN0aW1hdGUgdGhlIG9wdGltdW0gbnVtYmVyIG9mIHRpbWVzIHRvIHVzZSB0aGUgYXJndW1lbnQgcmVkdWN0aW9uLlxyXG4gIGsgPSAxLjQgKiBNYXRoLnNxcnQobGVuKTtcclxuICBrID0gayA+IDE2ID8gMTYgOiBrIHwgMDtcclxuXHJcbiAgeCA9IHgudGltZXMoMSAvIHRpbnlQb3coNSwgaykpO1xyXG4gIHggPSB0YXlsb3JTZXJpZXMoQ3RvciwgMiwgeCwgeCk7XHJcblxyXG4gIC8vIFJldmVyc2UgYXJndW1lbnQgcmVkdWN0aW9uXHJcbiAgdmFyIHNpbjJfeCxcclxuICAgIGQ1ID0gbmV3IEN0b3IoNSksXHJcbiAgICBkMTYgPSBuZXcgQ3RvcigxNiksXHJcbiAgICBkMjAgPSBuZXcgQ3RvcigyMCk7XHJcbiAgZm9yICg7IGstLTspIHtcclxuICAgIHNpbjJfeCA9IHgudGltZXMoeCk7XHJcbiAgICB4ID0geC50aW1lcyhkNS5wbHVzKHNpbjJfeC50aW1lcyhkMTYudGltZXMoc2luMl94KS5taW51cyhkMjApKSkpO1xyXG4gIH1cclxuXHJcbiAgcmV0dXJuIHg7XHJcbn1cclxuXHJcblxyXG4vLyBDYWxjdWxhdGUgVGF5bG9yIHNlcmllcyBmb3IgYGNvc2AsIGBjb3NoYCwgYHNpbmAgYW5kIGBzaW5oYC5cclxuZnVuY3Rpb24gdGF5bG9yU2VyaWVzKEN0b3IsIG4sIHgsIHksIGlzSHlwZXJib2xpYykge1xyXG4gIHZhciBqLCB0LCB1LCB4MixcclxuICAgIGkgPSAxLFxyXG4gICAgcHIgPSBDdG9yLnByZWNpc2lvbixcclxuICAgIGsgPSBNYXRoLmNlaWwocHIgLyBMT0dfQkFTRSk7XHJcblxyXG4gIGV4dGVybmFsID0gZmFsc2U7XHJcbiAgeDIgPSB4LnRpbWVzKHgpO1xyXG4gIHUgPSBuZXcgQ3Rvcih5KTtcclxuXHJcbiAgZm9yICg7Oykge1xyXG4gICAgdCA9IGRpdmlkZSh1LnRpbWVzKHgyKSwgbmV3IEN0b3IobisrICogbisrKSwgcHIsIDEpO1xyXG4gICAgdSA9IGlzSHlwZXJib2xpYyA/IHkucGx1cyh0KSA6IHkubWludXModCk7XHJcbiAgICB5ID0gZGl2aWRlKHQudGltZXMoeDIpLCBuZXcgQ3RvcihuKysgKiBuKyspLCBwciwgMSk7XHJcbiAgICB0ID0gdS5wbHVzKHkpO1xyXG5cclxuICAgIGlmICh0LmRba10gIT09IHZvaWQgMCkge1xyXG4gICAgICBmb3IgKGogPSBrOyB0LmRbal0gPT09IHUuZFtqXSAmJiBqLS07KTtcclxuICAgICAgaWYgKGogPT0gLTEpIGJyZWFrO1xyXG4gICAgfVxyXG5cclxuICAgIGogPSB1O1xyXG4gICAgdSA9IHk7XHJcbiAgICB5ID0gdDtcclxuICAgIHQgPSBqO1xyXG4gICAgaSsrO1xyXG4gIH1cclxuXHJcbiAgZXh0ZXJuYWwgPSB0cnVlO1xyXG4gIHQuZC5sZW5ndGggPSBrICsgMTtcclxuXHJcbiAgcmV0dXJuIHQ7XHJcbn1cclxuXHJcblxyXG4vLyBFeHBvbmVudCBlIG11c3QgYmUgcG9zaXRpdmUgYW5kIG5vbi16ZXJvLlxyXG5mdW5jdGlvbiB0aW55UG93KGIsIGUpIHtcclxuICB2YXIgbiA9IGI7XHJcbiAgd2hpbGUgKC0tZSkgbiAqPSBiO1xyXG4gIHJldHVybiBuO1xyXG59XHJcblxyXG5cclxuLy8gUmV0dXJuIHRoZSBhYnNvbHV0ZSB2YWx1ZSBvZiBgeGAgcmVkdWNlZCB0byBsZXNzIHRoYW4gb3IgZXF1YWwgdG8gaGFsZiBwaS5cclxuZnVuY3Rpb24gdG9MZXNzVGhhbkhhbGZQaShDdG9yLCB4KSB7XHJcbiAgdmFyIHQsXHJcbiAgICBpc05lZyA9IHgucyA8IDAsXHJcbiAgICBwaSA9IGdldFBpKEN0b3IsIEN0b3IucHJlY2lzaW9uLCAxKSxcclxuICAgIGhhbGZQaSA9IHBpLnRpbWVzKDAuNSk7XHJcblxyXG4gIHggPSB4LmFicygpO1xyXG5cclxuICBpZiAoeC5sdGUoaGFsZlBpKSkge1xyXG4gICAgcXVhZHJhbnQgPSBpc05lZyA/IDQgOiAxO1xyXG4gICAgcmV0dXJuIHg7XHJcbiAgfVxyXG5cclxuICB0ID0geC5kaXZUb0ludChwaSk7XHJcblxyXG4gIGlmICh0LmlzWmVybygpKSB7XHJcbiAgICBxdWFkcmFudCA9IGlzTmVnID8gMyA6IDI7XHJcbiAgfSBlbHNlIHtcclxuICAgIHggPSB4Lm1pbnVzKHQudGltZXMocGkpKTtcclxuXHJcbiAgICAvLyAwIDw9IHggPCBwaVxyXG4gICAgaWYgKHgubHRlKGhhbGZQaSkpIHtcclxuICAgICAgcXVhZHJhbnQgPSBpc09kZCh0KSA/IChpc05lZyA/IDIgOiAzKSA6IChpc05lZyA/IDQgOiAxKTtcclxuICAgICAgcmV0dXJuIHg7XHJcbiAgICB9XHJcblxyXG4gICAgcXVhZHJhbnQgPSBpc09kZCh0KSA/IChpc05lZyA/IDEgOiA0KSA6IChpc05lZyA/IDMgOiAyKTtcclxuICB9XHJcblxyXG4gIHJldHVybiB4Lm1pbnVzKHBpKS5hYnMoKTtcclxufVxyXG5cclxuXHJcbi8qXHJcbiAqIFJldHVybiB0aGUgdmFsdWUgb2YgRGVjaW1hbCBgeGAgYXMgYSBzdHJpbmcgaW4gYmFzZSBgYmFzZU91dGAuXHJcbiAqXHJcbiAqIElmIHRoZSBvcHRpb25hbCBgc2RgIGFyZ3VtZW50IGlzIHByZXNlbnQgaW5jbHVkZSBhIGJpbmFyeSBleHBvbmVudCBzdWZmaXguXHJcbiAqL1xyXG5mdW5jdGlvbiB0b1N0cmluZ0JpbmFyeSh4LCBiYXNlT3V0LCBzZCwgcm0pIHtcclxuICB2YXIgYmFzZSwgZSwgaSwgaywgbGVuLCByb3VuZFVwLCBzdHIsIHhkLCB5LFxyXG4gICAgQ3RvciA9IHguY29uc3RydWN0b3IsXHJcbiAgICBpc0V4cCA9IHNkICE9PSB2b2lkIDA7XHJcblxyXG4gIGlmIChpc0V4cCkge1xyXG4gICAgY2hlY2tJbnQzMihzZCwgMSwgTUFYX0RJR0lUUyk7XHJcbiAgICBpZiAocm0gPT09IHZvaWQgMCkgcm0gPSBDdG9yLnJvdW5kaW5nO1xyXG4gICAgZWxzZSBjaGVja0ludDMyKHJtLCAwLCA4KTtcclxuICB9IGVsc2Uge1xyXG4gICAgc2QgPSBDdG9yLnByZWNpc2lvbjtcclxuICAgIHJtID0gQ3Rvci5yb3VuZGluZztcclxuICB9XHJcblxyXG4gIGlmICgheC5pc0Zpbml0ZSgpKSB7XHJcbiAgICBzdHIgPSBub25GaW5pdGVUb1N0cmluZyh4KTtcclxuICB9IGVsc2Uge1xyXG4gICAgc3RyID0gZmluaXRlVG9TdHJpbmcoeCk7XHJcbiAgICBpID0gc3RyLmluZGV4T2YoJy4nKTtcclxuXHJcbiAgICAvLyBVc2UgZXhwb25lbnRpYWwgbm90YXRpb24gYWNjb3JkaW5nIHRvIGB0b0V4cFBvc2AgYW5kIGB0b0V4cE5lZ2A/IE5vLCBidXQgaWYgcmVxdWlyZWQ6XHJcbiAgICAvLyBtYXhCaW5hcnlFeHBvbmVudCA9IGZsb29yKChkZWNpbWFsRXhwb25lbnQgKyAxKSAqIGxvZ1syXSgxMCkpXHJcbiAgICAvLyBtaW5CaW5hcnlFeHBvbmVudCA9IGZsb29yKGRlY2ltYWxFeHBvbmVudCAqIGxvZ1syXSgxMCkpXHJcbiAgICAvLyBsb2dbMl0oMTApID0gMy4zMjE5MjgwOTQ4ODczNjIzNDc4NzAzMTk0Mjk0ODkzOTAxNzU4NjRcclxuXHJcbiAgICBpZiAoaXNFeHApIHtcclxuICAgICAgYmFzZSA9IDI7XHJcbiAgICAgIGlmIChiYXNlT3V0ID09IDE2KSB7XHJcbiAgICAgICAgc2QgPSBzZCAqIDQgLSAzO1xyXG4gICAgICB9IGVsc2UgaWYgKGJhc2VPdXQgPT0gOCkge1xyXG4gICAgICAgIHNkID0gc2QgKiAzIC0gMjtcclxuICAgICAgfVxyXG4gICAgfSBlbHNlIHtcclxuICAgICAgYmFzZSA9IGJhc2VPdXQ7XHJcbiAgICB9XHJcblxyXG4gICAgLy8gQ29udmVydCB0aGUgbnVtYmVyIGFzIGFuIGludGVnZXIgdGhlbiBkaXZpZGUgdGhlIHJlc3VsdCBieSBpdHMgYmFzZSByYWlzZWQgdG8gYSBwb3dlciBzdWNoXHJcbiAgICAvLyB0aGF0IHRoZSBmcmFjdGlvbiBwYXJ0IHdpbGwgYmUgcmVzdG9yZWQuXHJcblxyXG4gICAgLy8gTm9uLWludGVnZXIuXHJcbiAgICBpZiAoaSA+PSAwKSB7XHJcbiAgICAgIHN0ciA9IHN0ci5yZXBsYWNlKCcuJywgJycpO1xyXG4gICAgICB5ID0gbmV3IEN0b3IoMSk7XHJcbiAgICAgIHkuZSA9IHN0ci5sZW5ndGggLSBpO1xyXG4gICAgICB5LmQgPSBjb252ZXJ0QmFzZShmaW5pdGVUb1N0cmluZyh5KSwgMTAsIGJhc2UpO1xyXG4gICAgICB5LmUgPSB5LmQubGVuZ3RoO1xyXG4gICAgfVxyXG5cclxuICAgIHhkID0gY29udmVydEJhc2Uoc3RyLCAxMCwgYmFzZSk7XHJcbiAgICBlID0gbGVuID0geGQubGVuZ3RoO1xyXG5cclxuICAgIC8vIFJlbW92ZSB0cmFpbGluZyB6ZXJvcy5cclxuICAgIGZvciAoOyB4ZFstLWxlbl0gPT0gMDspIHhkLnBvcCgpO1xyXG5cclxuICAgIGlmICgheGRbMF0pIHtcclxuICAgICAgc3RyID0gaXNFeHAgPyAnMHArMCcgOiAnMCc7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICBpZiAoaSA8IDApIHtcclxuICAgICAgICBlLS07XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgeCA9IG5ldyBDdG9yKHgpO1xyXG4gICAgICAgIHguZCA9IHhkO1xyXG4gICAgICAgIHguZSA9IGU7XHJcbiAgICAgICAgeCA9IGRpdmlkZSh4LCB5LCBzZCwgcm0sIDAsIGJhc2UpO1xyXG4gICAgICAgIHhkID0geC5kO1xyXG4gICAgICAgIGUgPSB4LmU7XHJcbiAgICAgICAgcm91bmRVcCA9IGluZXhhY3Q7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIC8vIFRoZSByb3VuZGluZyBkaWdpdCwgaS5lLiB0aGUgZGlnaXQgYWZ0ZXIgdGhlIGRpZ2l0IHRoYXQgbWF5IGJlIHJvdW5kZWQgdXAuXHJcbiAgICAgIGkgPSB4ZFtzZF07XHJcbiAgICAgIGsgPSBiYXNlIC8gMjtcclxuICAgICAgcm91bmRVcCA9IHJvdW5kVXAgfHwgeGRbc2QgKyAxXSAhPT0gdm9pZCAwO1xyXG5cclxuICAgICAgcm91bmRVcCA9IHJtIDwgNFxyXG4gICAgICAgID8gKGkgIT09IHZvaWQgMCB8fCByb3VuZFVwKSAmJiAocm0gPT09IDAgfHwgcm0gPT09ICh4LnMgPCAwID8gMyA6IDIpKVxyXG4gICAgICAgIDogaSA+IGsgfHwgaSA9PT0gayAmJiAocm0gPT09IDQgfHwgcm91bmRVcCB8fCBybSA9PT0gNiAmJiB4ZFtzZCAtIDFdICYgMSB8fFxyXG4gICAgICAgICAgcm0gPT09ICh4LnMgPCAwID8gOCA6IDcpKTtcclxuXHJcbiAgICAgIHhkLmxlbmd0aCA9IHNkO1xyXG5cclxuICAgICAgaWYgKHJvdW5kVXApIHtcclxuXHJcbiAgICAgICAgLy8gUm91bmRpbmcgdXAgbWF5IG1lYW4gdGhlIHByZXZpb3VzIGRpZ2l0IGhhcyB0byBiZSByb3VuZGVkIHVwIGFuZCBzbyBvbi5cclxuICAgICAgICBmb3IgKDsgKyt4ZFstLXNkXSA+IGJhc2UgLSAxOykge1xyXG4gICAgICAgICAgeGRbc2RdID0gMDtcclxuICAgICAgICAgIGlmICghc2QpIHtcclxuICAgICAgICAgICAgKytlO1xyXG4gICAgICAgICAgICB4ZC51bnNoaWZ0KDEpO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG5cclxuICAgICAgLy8gRGV0ZXJtaW5lIHRyYWlsaW5nIHplcm9zLlxyXG4gICAgICBmb3IgKGxlbiA9IHhkLmxlbmd0aDsgIXhkW2xlbiAtIDFdOyAtLWxlbik7XHJcblxyXG4gICAgICAvLyBFLmcuIFs0LCAxMSwgMTVdIGJlY29tZXMgNGJmLlxyXG4gICAgICBmb3IgKGkgPSAwLCBzdHIgPSAnJzsgaSA8IGxlbjsgaSsrKSBzdHIgKz0gTlVNRVJBTFMuY2hhckF0KHhkW2ldKTtcclxuXHJcbiAgICAgIC8vIEFkZCBiaW5hcnkgZXhwb25lbnQgc3VmZml4P1xyXG4gICAgICBpZiAoaXNFeHApIHtcclxuICAgICAgICBpZiAobGVuID4gMSkge1xyXG4gICAgICAgICAgaWYgKGJhc2VPdXQgPT0gMTYgfHwgYmFzZU91dCA9PSA4KSB7XHJcbiAgICAgICAgICAgIGkgPSBiYXNlT3V0ID09IDE2ID8gNCA6IDM7XHJcbiAgICAgICAgICAgIGZvciAoLS1sZW47IGxlbiAlIGk7IGxlbisrKSBzdHIgKz0gJzAnO1xyXG4gICAgICAgICAgICB4ZCA9IGNvbnZlcnRCYXNlKHN0ciwgYmFzZSwgYmFzZU91dCk7XHJcbiAgICAgICAgICAgIGZvciAobGVuID0geGQubGVuZ3RoOyAheGRbbGVuIC0gMV07IC0tbGVuKTtcclxuXHJcbiAgICAgICAgICAgIC8vIHhkWzBdIHdpbGwgYWx3YXlzIGJlIGJlIDFcclxuICAgICAgICAgICAgZm9yIChpID0gMSwgc3RyID0gJzEuJzsgaSA8IGxlbjsgaSsrKSBzdHIgKz0gTlVNRVJBTFMuY2hhckF0KHhkW2ldKTtcclxuICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHN0ciA9IHN0ci5jaGFyQXQoMCkgKyAnLicgKyBzdHIuc2xpY2UoMSk7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBzdHIgPSAgc3RyICsgKGUgPCAwID8gJ3AnIDogJ3ArJykgKyBlO1xyXG4gICAgICB9IGVsc2UgaWYgKGUgPCAwKSB7XHJcbiAgICAgICAgZm9yICg7ICsrZTspIHN0ciA9ICcwJyArIHN0cjtcclxuICAgICAgICBzdHIgPSAnMC4nICsgc3RyO1xyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIGlmICgrK2UgPiBsZW4pIGZvciAoZSAtPSBsZW47IGUtLSA7KSBzdHIgKz0gJzAnO1xyXG4gICAgICAgIGVsc2UgaWYgKGUgPCBsZW4pIHN0ciA9IHN0ci5zbGljZSgwLCBlKSArICcuJyArIHN0ci5zbGljZShlKTtcclxuICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHN0ciA9IChiYXNlT3V0ID09IDE2ID8gJzB4JyA6IGJhc2VPdXQgPT0gMiA/ICcwYicgOiBiYXNlT3V0ID09IDggPyAnMG8nIDogJycpICsgc3RyO1xyXG4gIH1cclxuXHJcbiAgcmV0dXJuIHgucyA8IDAgPyAnLScgKyBzdHIgOiBzdHI7XHJcbn1cclxuXHJcblxyXG4vLyBEb2VzIG5vdCBzdHJpcCB0cmFpbGluZyB6ZXJvcy5cclxuZnVuY3Rpb24gdHJ1bmNhdGUoYXJyLCBsZW4pIHtcclxuICBpZiAoYXJyLmxlbmd0aCA+IGxlbikge1xyXG4gICAgYXJyLmxlbmd0aCA9IGxlbjtcclxuICAgIHJldHVybiB0cnVlO1xyXG4gIH1cclxufVxyXG5cclxuXHJcbi8vIERlY2ltYWwgbWV0aG9kc1xyXG5cclxuXHJcbi8qXHJcbiAqICBhYnNcclxuICogIGFjb3NcclxuICogIGFjb3NoXHJcbiAqICBhZGRcclxuICogIGFzaW5cclxuICogIGFzaW5oXHJcbiAqICBhdGFuXHJcbiAqICBhdGFuaFxyXG4gKiAgYXRhbjJcclxuICogIGNicnRcclxuICogIGNlaWxcclxuICogIGNsYW1wXHJcbiAqICBjbG9uZVxyXG4gKiAgY29uZmlnXHJcbiAqICBjb3NcclxuICogIGNvc2hcclxuICogIGRpdlxyXG4gKiAgZXhwXHJcbiAqICBmbG9vclxyXG4gKiAgaHlwb3RcclxuICogIGxuXHJcbiAqICBsb2dcclxuICogIGxvZzJcclxuICogIGxvZzEwXHJcbiAqICBtYXhcclxuICogIG1pblxyXG4gKiAgbW9kXHJcbiAqICBtdWxcclxuICogIHBvd1xyXG4gKiAgcmFuZG9tXHJcbiAqICByb3VuZFxyXG4gKiAgc2V0XHJcbiAqICBzaWduXHJcbiAqICBzaW5cclxuICogIHNpbmhcclxuICogIHNxcnRcclxuICogIHN1YlxyXG4gKiAgc3VtXHJcbiAqICB0YW5cclxuICogIHRhbmhcclxuICogIHRydW5jXHJcbiAqL1xyXG5cclxuXHJcbi8qXHJcbiAqIFJldHVybiBhIG5ldyBEZWNpbWFsIHdob3NlIHZhbHVlIGlzIHRoZSBhYnNvbHV0ZSB2YWx1ZSBvZiBgeGAuXHJcbiAqXHJcbiAqIHgge251bWJlcnxzdHJpbmd8RGVjaW1hbH1cclxuICpcclxuICovXHJcbmZ1bmN0aW9uIGFicyh4KSB7XHJcbiAgcmV0dXJuIG5ldyB0aGlzKHgpLmFicygpO1xyXG59XHJcblxyXG5cclxuLypcclxuICogUmV0dXJuIGEgbmV3IERlY2ltYWwgd2hvc2UgdmFsdWUgaXMgdGhlIGFyY2Nvc2luZSBpbiByYWRpYW5zIG9mIGB4YC5cclxuICpcclxuICogeCB7bnVtYmVyfHN0cmluZ3xEZWNpbWFsfVxyXG4gKlxyXG4gKi9cclxuZnVuY3Rpb24gYWNvcyh4KSB7XHJcbiAgcmV0dXJuIG5ldyB0aGlzKHgpLmFjb3MoKTtcclxufVxyXG5cclxuXHJcbi8qXHJcbiAqIFJldHVybiBhIG5ldyBEZWNpbWFsIHdob3NlIHZhbHVlIGlzIHRoZSBpbnZlcnNlIG9mIHRoZSBoeXBlcmJvbGljIGNvc2luZSBvZiBgeGAsIHJvdW5kZWQgdG9cclxuICogYHByZWNpc2lvbmAgc2lnbmlmaWNhbnQgZGlnaXRzIHVzaW5nIHJvdW5kaW5nIG1vZGUgYHJvdW5kaW5nYC5cclxuICpcclxuICogeCB7bnVtYmVyfHN0cmluZ3xEZWNpbWFsfSBBIHZhbHVlIGluIHJhZGlhbnMuXHJcbiAqXHJcbiAqL1xyXG5mdW5jdGlvbiBhY29zaCh4KSB7XHJcbiAgcmV0dXJuIG5ldyB0aGlzKHgpLmFjb3NoKCk7XHJcbn1cclxuXHJcblxyXG4vKlxyXG4gKiBSZXR1cm4gYSBuZXcgRGVjaW1hbCB3aG9zZSB2YWx1ZSBpcyB0aGUgc3VtIG9mIGB4YCBhbmQgYHlgLCByb3VuZGVkIHRvIGBwcmVjaXNpb25gIHNpZ25pZmljYW50XHJcbiAqIGRpZ2l0cyB1c2luZyByb3VuZGluZyBtb2RlIGByb3VuZGluZ2AuXHJcbiAqXHJcbiAqIHgge251bWJlcnxzdHJpbmd8RGVjaW1hbH1cclxuICogeSB7bnVtYmVyfHN0cmluZ3xEZWNpbWFsfVxyXG4gKlxyXG4gKi9cclxuZnVuY3Rpb24gYWRkKHgsIHkpIHtcclxuICByZXR1cm4gbmV3IHRoaXMoeCkucGx1cyh5KTtcclxufVxyXG5cclxuXHJcbi8qXHJcbiAqIFJldHVybiBhIG5ldyBEZWNpbWFsIHdob3NlIHZhbHVlIGlzIHRoZSBhcmNzaW5lIGluIHJhZGlhbnMgb2YgYHhgLCByb3VuZGVkIHRvIGBwcmVjaXNpb25gXHJcbiAqIHNpZ25pZmljYW50IGRpZ2l0cyB1c2luZyByb3VuZGluZyBtb2RlIGByb3VuZGluZ2AuXHJcbiAqXHJcbiAqIHgge251bWJlcnxzdHJpbmd8RGVjaW1hbH1cclxuICpcclxuICovXHJcbmZ1bmN0aW9uIGFzaW4oeCkge1xyXG4gIHJldHVybiBuZXcgdGhpcyh4KS5hc2luKCk7XHJcbn1cclxuXHJcblxyXG4vKlxyXG4gKiBSZXR1cm4gYSBuZXcgRGVjaW1hbCB3aG9zZSB2YWx1ZSBpcyB0aGUgaW52ZXJzZSBvZiB0aGUgaHlwZXJib2xpYyBzaW5lIG9mIGB4YCwgcm91bmRlZCB0b1xyXG4gKiBgcHJlY2lzaW9uYCBzaWduaWZpY2FudCBkaWdpdHMgdXNpbmcgcm91bmRpbmcgbW9kZSBgcm91bmRpbmdgLlxyXG4gKlxyXG4gKiB4IHtudW1iZXJ8c3RyaW5nfERlY2ltYWx9IEEgdmFsdWUgaW4gcmFkaWFucy5cclxuICpcclxuICovXHJcbmZ1bmN0aW9uIGFzaW5oKHgpIHtcclxuICByZXR1cm4gbmV3IHRoaXMoeCkuYXNpbmgoKTtcclxufVxyXG5cclxuXHJcbi8qXHJcbiAqIFJldHVybiBhIG5ldyBEZWNpbWFsIHdob3NlIHZhbHVlIGlzIHRoZSBhcmN0YW5nZW50IGluIHJhZGlhbnMgb2YgYHhgLCByb3VuZGVkIHRvIGBwcmVjaXNpb25gXHJcbiAqIHNpZ25pZmljYW50IGRpZ2l0cyB1c2luZyByb3VuZGluZyBtb2RlIGByb3VuZGluZ2AuXHJcbiAqXHJcbiAqIHgge251bWJlcnxzdHJpbmd8RGVjaW1hbH1cclxuICpcclxuICovXHJcbmZ1bmN0aW9uIGF0YW4oeCkge1xyXG4gIHJldHVybiBuZXcgdGhpcyh4KS5hdGFuKCk7XHJcbn1cclxuXHJcblxyXG4vKlxyXG4gKiBSZXR1cm4gYSBuZXcgRGVjaW1hbCB3aG9zZSB2YWx1ZSBpcyB0aGUgaW52ZXJzZSBvZiB0aGUgaHlwZXJib2xpYyB0YW5nZW50IG9mIGB4YCwgcm91bmRlZCB0b1xyXG4gKiBgcHJlY2lzaW9uYCBzaWduaWZpY2FudCBkaWdpdHMgdXNpbmcgcm91bmRpbmcgbW9kZSBgcm91bmRpbmdgLlxyXG4gKlxyXG4gKiB4IHtudW1iZXJ8c3RyaW5nfERlY2ltYWx9IEEgdmFsdWUgaW4gcmFkaWFucy5cclxuICpcclxuICovXHJcbmZ1bmN0aW9uIGF0YW5oKHgpIHtcclxuICByZXR1cm4gbmV3IHRoaXMoeCkuYXRhbmgoKTtcclxufVxyXG5cclxuXHJcbi8qXHJcbiAqIFJldHVybiBhIG5ldyBEZWNpbWFsIHdob3NlIHZhbHVlIGlzIHRoZSBhcmN0YW5nZW50IGluIHJhZGlhbnMgb2YgYHkveGAgaW4gdGhlIHJhbmdlIC1waSB0byBwaVxyXG4gKiAoaW5jbHVzaXZlKSwgcm91bmRlZCB0byBgcHJlY2lzaW9uYCBzaWduaWZpY2FudCBkaWdpdHMgdXNpbmcgcm91bmRpbmcgbW9kZSBgcm91bmRpbmdgLlxyXG4gKlxyXG4gKiBEb21haW46IFstSW5maW5pdHksIEluZmluaXR5XVxyXG4gKiBSYW5nZTogWy1waSwgcGldXHJcbiAqXHJcbiAqIHkge251bWJlcnxzdHJpbmd8RGVjaW1hbH0gVGhlIHktY29vcmRpbmF0ZS5cclxuICogeCB7bnVtYmVyfHN0cmluZ3xEZWNpbWFsfSBUaGUgeC1jb29yZGluYXRlLlxyXG4gKlxyXG4gKiBhdGFuMihcdTAwQjEwLCAtMCkgICAgICAgICAgICAgICA9IFx1MDBCMXBpXHJcbiAqIGF0YW4yKFx1MDBCMTAsICswKSAgICAgICAgICAgICAgID0gXHUwMEIxMFxyXG4gKiBhdGFuMihcdTAwQjEwLCAteCkgICAgICAgICAgICAgICA9IFx1MDBCMXBpIGZvciB4ID4gMFxyXG4gKiBhdGFuMihcdTAwQjEwLCB4KSAgICAgICAgICAgICAgICA9IFx1MDBCMTAgZm9yIHggPiAwXHJcbiAqIGF0YW4yKC15LCBcdTAwQjEwKSAgICAgICAgICAgICAgID0gLXBpLzIgZm9yIHkgPiAwXHJcbiAqIGF0YW4yKHksIFx1MDBCMTApICAgICAgICAgICAgICAgID0gcGkvMiBmb3IgeSA+IDBcclxuICogYXRhbjIoXHUwMEIxeSwgLUluZmluaXR5KSAgICAgICAgPSBcdTAwQjFwaSBmb3IgZmluaXRlIHkgPiAwXHJcbiAqIGF0YW4yKFx1MDBCMXksICtJbmZpbml0eSkgICAgICAgID0gXHUwMEIxMCBmb3IgZmluaXRlIHkgPiAwXHJcbiAqIGF0YW4yKFx1MDBCMUluZmluaXR5LCB4KSAgICAgICAgID0gXHUwMEIxcGkvMiBmb3IgZmluaXRlIHhcclxuICogYXRhbjIoXHUwMEIxSW5maW5pdHksIC1JbmZpbml0eSkgPSBcdTAwQjEzKnBpLzRcclxuICogYXRhbjIoXHUwMEIxSW5maW5pdHksICtJbmZpbml0eSkgPSBcdTAwQjFwaS80XHJcbiAqIGF0YW4yKE5hTiwgeCkgPSBOYU5cclxuICogYXRhbjIoeSwgTmFOKSA9IE5hTlxyXG4gKlxyXG4gKi9cclxuZnVuY3Rpb24gYXRhbjIoeSwgeCkge1xyXG4gIHkgPSBuZXcgdGhpcyh5KTtcclxuICB4ID0gbmV3IHRoaXMoeCk7XHJcbiAgdmFyIHIsXHJcbiAgICBwciA9IHRoaXMucHJlY2lzaW9uLFxyXG4gICAgcm0gPSB0aGlzLnJvdW5kaW5nLFxyXG4gICAgd3ByID0gcHIgKyA0O1xyXG5cclxuICAvLyBFaXRoZXIgTmFOXHJcbiAgaWYgKCF5LnMgfHwgIXgucykge1xyXG4gICAgciA9IG5ldyB0aGlzKE5hTik7XHJcblxyXG4gIC8vIEJvdGggXHUwMEIxSW5maW5pdHlcclxuICB9IGVsc2UgaWYgKCF5LmQgJiYgIXguZCkge1xyXG4gICAgciA9IGdldFBpKHRoaXMsIHdwciwgMSkudGltZXMoeC5zID4gMCA/IDAuMjUgOiAwLjc1KTtcclxuICAgIHIucyA9IHkucztcclxuXHJcbiAgLy8geCBpcyBcdTAwQjFJbmZpbml0eSBvciB5IGlzIFx1MDBCMTBcclxuICB9IGVsc2UgaWYgKCF4LmQgfHwgeS5pc1plcm8oKSkge1xyXG4gICAgciA9IHgucyA8IDAgPyBnZXRQaSh0aGlzLCBwciwgcm0pIDogbmV3IHRoaXMoMCk7XHJcbiAgICByLnMgPSB5LnM7XHJcblxyXG4gIC8vIHkgaXMgXHUwMEIxSW5maW5pdHkgb3IgeCBpcyBcdTAwQjEwXHJcbiAgfSBlbHNlIGlmICgheS5kIHx8IHguaXNaZXJvKCkpIHtcclxuICAgIHIgPSBnZXRQaSh0aGlzLCB3cHIsIDEpLnRpbWVzKDAuNSk7XHJcbiAgICByLnMgPSB5LnM7XHJcblxyXG4gIC8vIEJvdGggbm9uLXplcm8gYW5kIGZpbml0ZVxyXG4gIH0gZWxzZSBpZiAoeC5zIDwgMCkge1xyXG4gICAgdGhpcy5wcmVjaXNpb24gPSB3cHI7XHJcbiAgICB0aGlzLnJvdW5kaW5nID0gMTtcclxuICAgIHIgPSB0aGlzLmF0YW4oZGl2aWRlKHksIHgsIHdwciwgMSkpO1xyXG4gICAgeCA9IGdldFBpKHRoaXMsIHdwciwgMSk7XHJcbiAgICB0aGlzLnByZWNpc2lvbiA9IHByO1xyXG4gICAgdGhpcy5yb3VuZGluZyA9IHJtO1xyXG4gICAgciA9IHkucyA8IDAgPyByLm1pbnVzKHgpIDogci5wbHVzKHgpO1xyXG4gIH0gZWxzZSB7XHJcbiAgICByID0gdGhpcy5hdGFuKGRpdmlkZSh5LCB4LCB3cHIsIDEpKTtcclxuICB9XHJcblxyXG4gIHJldHVybiByO1xyXG59XHJcblxyXG5cclxuLypcclxuICogUmV0dXJuIGEgbmV3IERlY2ltYWwgd2hvc2UgdmFsdWUgaXMgdGhlIGN1YmUgcm9vdCBvZiBgeGAsIHJvdW5kZWQgdG8gYHByZWNpc2lvbmAgc2lnbmlmaWNhbnRcclxuICogZGlnaXRzIHVzaW5nIHJvdW5kaW5nIG1vZGUgYHJvdW5kaW5nYC5cclxuICpcclxuICogeCB7bnVtYmVyfHN0cmluZ3xEZWNpbWFsfVxyXG4gKlxyXG4gKi9cclxuZnVuY3Rpb24gY2JydCh4KSB7XHJcbiAgcmV0dXJuIG5ldyB0aGlzKHgpLmNicnQoKTtcclxufVxyXG5cclxuXHJcbi8qXHJcbiAqIFJldHVybiBhIG5ldyBEZWNpbWFsIHdob3NlIHZhbHVlIGlzIGB4YCByb3VuZGVkIHRvIGFuIGludGVnZXIgdXNpbmcgYFJPVU5EX0NFSUxgLlxyXG4gKlxyXG4gKiB4IHtudW1iZXJ8c3RyaW5nfERlY2ltYWx9XHJcbiAqXHJcbiAqL1xyXG5mdW5jdGlvbiBjZWlsKHgpIHtcclxuICByZXR1cm4gZmluYWxpc2UoeCA9IG5ldyB0aGlzKHgpLCB4LmUgKyAxLCAyKTtcclxufVxyXG5cclxuXHJcbi8qXHJcbiAqIFJldHVybiBhIG5ldyBEZWNpbWFsIHdob3NlIHZhbHVlIGlzIGB4YCBjbGFtcGVkIHRvIHRoZSByYW5nZSBkZWxpbmVhdGVkIGJ5IGBtaW5gIGFuZCBgbWF4YC5cclxuICpcclxuICogeCB7bnVtYmVyfHN0cmluZ3xEZWNpbWFsfVxyXG4gKiBtaW4ge251bWJlcnxzdHJpbmd8RGVjaW1hbH1cclxuICogbWF4IHtudW1iZXJ8c3RyaW5nfERlY2ltYWx9XHJcbiAqXHJcbiAqL1xyXG5mdW5jdGlvbiBjbGFtcCh4LCBtaW4sIG1heCkge1xyXG4gIHJldHVybiBuZXcgdGhpcyh4KS5jbGFtcChtaW4sIG1heCk7XHJcbn1cclxuXHJcblxyXG4vKlxyXG4gKiBDb25maWd1cmUgZ2xvYmFsIHNldHRpbmdzIGZvciBhIERlY2ltYWwgY29uc3RydWN0b3IuXHJcbiAqXHJcbiAqIGBvYmpgIGlzIGFuIG9iamVjdCB3aXRoIG9uZSBvciBtb3JlIG9mIHRoZSBmb2xsb3dpbmcgcHJvcGVydGllcyxcclxuICpcclxuICogICBwcmVjaXNpb24gIHtudW1iZXJ9XHJcbiAqICAgcm91bmRpbmcgICB7bnVtYmVyfVxyXG4gKiAgIHRvRXhwTmVnICAge251bWJlcn1cclxuICogICB0b0V4cFBvcyAgIHtudW1iZXJ9XHJcbiAqICAgbWF4RSAgICAgICB7bnVtYmVyfVxyXG4gKiAgIG1pbkUgICAgICAge251bWJlcn1cclxuICogICBtb2R1bG8gICAgIHtudW1iZXJ9XHJcbiAqICAgY3J5cHRvICAgICB7Ym9vbGVhbnxudW1iZXJ9XHJcbiAqICAgZGVmYXVsdHMgICB7dHJ1ZX1cclxuICpcclxuICogRS5nLiBEZWNpbWFsLmNvbmZpZyh7IHByZWNpc2lvbjogMjAsIHJvdW5kaW5nOiA0IH0pXHJcbiAqXHJcbiAqL1xyXG5mdW5jdGlvbiBjb25maWcob2JqKSB7XHJcbiAgaWYgKCFvYmogfHwgdHlwZW9mIG9iaiAhPT0gJ29iamVjdCcpIHRocm93IEVycm9yKGRlY2ltYWxFcnJvciArICdPYmplY3QgZXhwZWN0ZWQnKTtcclxuICB2YXIgaSwgcCwgdixcclxuICAgIHVzZURlZmF1bHRzID0gb2JqLmRlZmF1bHRzID09PSB0cnVlLFxyXG4gICAgcHMgPSBbXHJcbiAgICAgICdwcmVjaXNpb24nLCAxLCBNQVhfRElHSVRTLFxyXG4gICAgICAncm91bmRpbmcnLCAwLCA4LFxyXG4gICAgICAndG9FeHBOZWcnLCAtRVhQX0xJTUlULCAwLFxyXG4gICAgICAndG9FeHBQb3MnLCAwLCBFWFBfTElNSVQsXHJcbiAgICAgICdtYXhFJywgMCwgRVhQX0xJTUlULFxyXG4gICAgICAnbWluRScsIC1FWFBfTElNSVQsIDAsXHJcbiAgICAgICdtb2R1bG8nLCAwLCA5XHJcbiAgICBdO1xyXG5cclxuICBmb3IgKGkgPSAwOyBpIDwgcHMubGVuZ3RoOyBpICs9IDMpIHtcclxuICAgIGlmIChwID0gcHNbaV0sIHVzZURlZmF1bHRzKSB0aGlzW3BdID0gREVGQVVMVFNbcF07XHJcbiAgICBpZiAoKHYgPSBvYmpbcF0pICE9PSB2b2lkIDApIHtcclxuICAgICAgaWYgKG1hdGhmbG9vcih2KSA9PT0gdiAmJiB2ID49IHBzW2kgKyAxXSAmJiB2IDw9IHBzW2kgKyAyXSkgdGhpc1twXSA9IHY7XHJcbiAgICAgIGVsc2UgdGhyb3cgRXJyb3IoaW52YWxpZEFyZ3VtZW50ICsgcCArICc6ICcgKyB2KTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIGlmIChwID0gJ2NyeXB0bycsIHVzZURlZmF1bHRzKSB0aGlzW3BdID0gREVGQVVMVFNbcF07XHJcbiAgaWYgKCh2ID0gb2JqW3BdKSAhPT0gdm9pZCAwKSB7XHJcbiAgICBpZiAodiA9PT0gdHJ1ZSB8fCB2ID09PSBmYWxzZSB8fCB2ID09PSAwIHx8IHYgPT09IDEpIHtcclxuICAgICAgaWYgKHYpIHtcclxuICAgICAgICBpZiAodHlwZW9mIGNyeXB0byAhPSAndW5kZWZpbmVkJyAmJiBjcnlwdG8gJiZcclxuICAgICAgICAgIChjcnlwdG8uZ2V0UmFuZG9tVmFsdWVzIHx8IGNyeXB0by5yYW5kb21CeXRlcykpIHtcclxuICAgICAgICAgIHRoaXNbcF0gPSB0cnVlO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICB0aHJvdyBFcnJvcihjcnlwdG9VbmF2YWlsYWJsZSk7XHJcbiAgICAgICAgfVxyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIHRoaXNbcF0gPSBmYWxzZTtcclxuICAgICAgfVxyXG4gICAgfSBlbHNlIHtcclxuICAgICAgdGhyb3cgRXJyb3IoaW52YWxpZEFyZ3VtZW50ICsgcCArICc6ICcgKyB2KTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIHJldHVybiB0aGlzO1xyXG59XHJcblxyXG5cclxuLypcclxuICogUmV0dXJuIGEgbmV3IERlY2ltYWwgd2hvc2UgdmFsdWUgaXMgdGhlIGNvc2luZSBvZiBgeGAsIHJvdW5kZWQgdG8gYHByZWNpc2lvbmAgc2lnbmlmaWNhbnRcclxuICogZGlnaXRzIHVzaW5nIHJvdW5kaW5nIG1vZGUgYHJvdW5kaW5nYC5cclxuICpcclxuICogeCB7bnVtYmVyfHN0cmluZ3xEZWNpbWFsfSBBIHZhbHVlIGluIHJhZGlhbnMuXHJcbiAqXHJcbiAqL1xyXG5mdW5jdGlvbiBjb3MoeCkge1xyXG4gIHJldHVybiBuZXcgdGhpcyh4KS5jb3MoKTtcclxufVxyXG5cclxuXHJcbi8qXHJcbiAqIFJldHVybiBhIG5ldyBEZWNpbWFsIHdob3NlIHZhbHVlIGlzIHRoZSBoeXBlcmJvbGljIGNvc2luZSBvZiBgeGAsIHJvdW5kZWQgdG8gcHJlY2lzaW9uXHJcbiAqIHNpZ25pZmljYW50IGRpZ2l0cyB1c2luZyByb3VuZGluZyBtb2RlIGByb3VuZGluZ2AuXHJcbiAqXHJcbiAqIHgge251bWJlcnxzdHJpbmd8RGVjaW1hbH0gQSB2YWx1ZSBpbiByYWRpYW5zLlxyXG4gKlxyXG4gKi9cclxuZnVuY3Rpb24gY29zaCh4KSB7XHJcbiAgcmV0dXJuIG5ldyB0aGlzKHgpLmNvc2goKTtcclxufVxyXG5cclxuXHJcbi8qXHJcbiAqIENyZWF0ZSBhbmQgcmV0dXJuIGEgRGVjaW1hbCBjb25zdHJ1Y3RvciB3aXRoIHRoZSBzYW1lIGNvbmZpZ3VyYXRpb24gcHJvcGVydGllcyBhcyB0aGlzIERlY2ltYWxcclxuICogY29uc3RydWN0b3IuXHJcbiAqXHJcbiAqL1xyXG5mdW5jdGlvbiBjbG9uZShvYmopIHtcclxuICB2YXIgaSwgcCwgcHM7XHJcblxyXG4gIC8qXHJcbiAgICogVGhlIERlY2ltYWwgY29uc3RydWN0b3IgYW5kIGV4cG9ydGVkIGZ1bmN0aW9uLlxyXG4gICAqIFJldHVybiBhIG5ldyBEZWNpbWFsIGluc3RhbmNlLlxyXG4gICAqXHJcbiAgICogdiB7bnVtYmVyfHN0cmluZ3xEZWNpbWFsfSBBIG51bWVyaWMgdmFsdWUuXHJcbiAgICpcclxuICAgKi9cclxuICBmdW5jdGlvbiBEZWNpbWFsKHYpIHtcclxuICAgIHZhciBlLCBpLCB0LFxyXG4gICAgICB4ID0gdGhpcztcclxuXHJcbiAgICAvLyBEZWNpbWFsIGNhbGxlZCB3aXRob3V0IG5ldy5cclxuICAgIGlmICghKHggaW5zdGFuY2VvZiBEZWNpbWFsKSkgcmV0dXJuIG5ldyBEZWNpbWFsKHYpO1xyXG5cclxuICAgIC8vIFJldGFpbiBhIHJlZmVyZW5jZSB0byB0aGlzIERlY2ltYWwgY29uc3RydWN0b3IsIGFuZCBzaGFkb3cgRGVjaW1hbC5wcm90b3R5cGUuY29uc3RydWN0b3JcclxuICAgIC8vIHdoaWNoIHBvaW50cyB0byBPYmplY3QuXHJcbiAgICB4LmNvbnN0cnVjdG9yID0gRGVjaW1hbDtcclxuXHJcbiAgICAvLyBEdXBsaWNhdGUuXHJcbiAgICBpZiAoaXNEZWNpbWFsSW5zdGFuY2UodikpIHtcclxuICAgICAgeC5zID0gdi5zO1xyXG5cclxuICAgICAgaWYgKGV4dGVybmFsKSB7XHJcbiAgICAgICAgaWYgKCF2LmQgfHwgdi5lID4gRGVjaW1hbC5tYXhFKSB7XHJcblxyXG4gICAgICAgICAgLy8gSW5maW5pdHkuXHJcbiAgICAgICAgICB4LmUgPSBOYU47XHJcbiAgICAgICAgICB4LmQgPSBudWxsO1xyXG4gICAgICAgIH0gZWxzZSBpZiAodi5lIDwgRGVjaW1hbC5taW5FKSB7XHJcblxyXG4gICAgICAgICAgLy8gWmVyby5cclxuICAgICAgICAgIHguZSA9IDA7XHJcbiAgICAgICAgICB4LmQgPSBbMF07XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgIHguZSA9IHYuZTtcclxuICAgICAgICAgIHguZCA9IHYuZC5zbGljZSgpO1xyXG4gICAgICAgIH1cclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICB4LmUgPSB2LmU7XHJcbiAgICAgICAgeC5kID0gdi5kID8gdi5kLnNsaWNlKCkgOiB2LmQ7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIHJldHVybjtcclxuICAgIH1cclxuXHJcbiAgICB0ID0gdHlwZW9mIHY7XHJcblxyXG4gICAgaWYgKHQgPT09ICdudW1iZXInKSB7XHJcbiAgICAgIGlmICh2ID09PSAwKSB7XHJcbiAgICAgICAgeC5zID0gMSAvIHYgPCAwID8gLTEgOiAxO1xyXG4gICAgICAgIHguZSA9IDA7XHJcbiAgICAgICAgeC5kID0gWzBdO1xyXG4gICAgICAgIHJldHVybjtcclxuICAgICAgfVxyXG5cclxuICAgICAgaWYgKHYgPCAwKSB7XHJcbiAgICAgICAgdiA9IC12O1xyXG4gICAgICAgIHgucyA9IC0xO1xyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIHgucyA9IDE7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIC8vIEZhc3QgcGF0aCBmb3Igc21hbGwgaW50ZWdlcnMuXHJcbiAgICAgIGlmICh2ID09PSB+fnYgJiYgdiA8IDFlNykge1xyXG4gICAgICAgIGZvciAoZSA9IDAsIGkgPSB2OyBpID49IDEwOyBpIC89IDEwKSBlKys7XHJcblxyXG4gICAgICAgIGlmIChleHRlcm5hbCkge1xyXG4gICAgICAgICAgaWYgKGUgPiBEZWNpbWFsLm1heEUpIHtcclxuICAgICAgICAgICAgeC5lID0gTmFOO1xyXG4gICAgICAgICAgICB4LmQgPSBudWxsO1xyXG4gICAgICAgICAgfSBlbHNlIGlmIChlIDwgRGVjaW1hbC5taW5FKSB7XHJcbiAgICAgICAgICAgIHguZSA9IDA7XHJcbiAgICAgICAgICAgIHguZCA9IFswXTtcclxuICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHguZSA9IGU7XHJcbiAgICAgICAgICAgIHguZCA9IFt2XTtcclxuICAgICAgICAgIH1cclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgeC5lID0gZTtcclxuICAgICAgICAgIHguZCA9IFt2XTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybjtcclxuXHJcbiAgICAgIC8vIEluZmluaXR5LCBOYU4uXHJcbiAgICAgIH0gZWxzZSBpZiAodiAqIDAgIT09IDApIHtcclxuICAgICAgICBpZiAoIXYpIHgucyA9IE5hTjtcclxuICAgICAgICB4LmUgPSBOYU47XHJcbiAgICAgICAgeC5kID0gbnVsbDtcclxuICAgICAgICByZXR1cm47XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIHJldHVybiBwYXJzZURlY2ltYWwoeCwgdi50b1N0cmluZygpKTtcclxuXHJcbiAgICB9IGVsc2UgaWYgKHQgIT09ICdzdHJpbmcnKSB7XHJcbiAgICAgIHRocm93IEVycm9yKGludmFsaWRBcmd1bWVudCArIHYpO1xyXG4gICAgfVxyXG5cclxuICAgIC8vIE1pbnVzIHNpZ24/XHJcbiAgICBpZiAoKGkgPSB2LmNoYXJDb2RlQXQoMCkpID09PSA0NSkge1xyXG4gICAgICB2ID0gdi5zbGljZSgxKTtcclxuICAgICAgeC5zID0gLTE7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICAvLyBQbHVzIHNpZ24/XHJcbiAgICAgIGlmIChpID09PSA0MykgdiA9IHYuc2xpY2UoMSk7XHJcbiAgICAgIHgucyA9IDE7XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIGlzRGVjaW1hbC50ZXN0KHYpID8gcGFyc2VEZWNpbWFsKHgsIHYpIDogcGFyc2VPdGhlcih4LCB2KTtcclxuICB9XHJcblxyXG4gIERlY2ltYWwucHJvdG90eXBlID0gUDtcclxuXHJcbiAgRGVjaW1hbC5ST1VORF9VUCA9IDA7XHJcbiAgRGVjaW1hbC5ST1VORF9ET1dOID0gMTtcclxuICBEZWNpbWFsLlJPVU5EX0NFSUwgPSAyO1xyXG4gIERlY2ltYWwuUk9VTkRfRkxPT1IgPSAzO1xyXG4gIERlY2ltYWwuUk9VTkRfSEFMRl9VUCA9IDQ7XHJcbiAgRGVjaW1hbC5ST1VORF9IQUxGX0RPV04gPSA1O1xyXG4gIERlY2ltYWwuUk9VTkRfSEFMRl9FVkVOID0gNjtcclxuICBEZWNpbWFsLlJPVU5EX0hBTEZfQ0VJTCA9IDc7XHJcbiAgRGVjaW1hbC5ST1VORF9IQUxGX0ZMT09SID0gODtcclxuICBEZWNpbWFsLkVVQ0xJRCA9IDk7XHJcblxyXG4gIERlY2ltYWwuY29uZmlnID0gRGVjaW1hbC5zZXQgPSBjb25maWc7XHJcbiAgRGVjaW1hbC5jbG9uZSA9IGNsb25lO1xyXG4gIERlY2ltYWwuaXNEZWNpbWFsID0gaXNEZWNpbWFsSW5zdGFuY2U7XHJcblxyXG4gIERlY2ltYWwuYWJzID0gYWJzO1xyXG4gIERlY2ltYWwuYWNvcyA9IGFjb3M7XHJcbiAgRGVjaW1hbC5hY29zaCA9IGFjb3NoOyAgICAgICAgLy8gRVM2XHJcbiAgRGVjaW1hbC5hZGQgPSBhZGQ7XHJcbiAgRGVjaW1hbC5hc2luID0gYXNpbjtcclxuICBEZWNpbWFsLmFzaW5oID0gYXNpbmg7ICAgICAgICAvLyBFUzZcclxuICBEZWNpbWFsLmF0YW4gPSBhdGFuO1xyXG4gIERlY2ltYWwuYXRhbmggPSBhdGFuaDsgICAgICAgIC8vIEVTNlxyXG4gIERlY2ltYWwuYXRhbjIgPSBhdGFuMjtcclxuICBEZWNpbWFsLmNicnQgPSBjYnJ0OyAgICAgICAgICAvLyBFUzZcclxuICBEZWNpbWFsLmNlaWwgPSBjZWlsO1xyXG4gIERlY2ltYWwuY2xhbXAgPSBjbGFtcDtcclxuICBEZWNpbWFsLmNvcyA9IGNvcztcclxuICBEZWNpbWFsLmNvc2ggPSBjb3NoOyAgICAgICAgICAvLyBFUzZcclxuICBEZWNpbWFsLmRpdiA9IGRpdjtcclxuICBEZWNpbWFsLmV4cCA9IGV4cDtcclxuICBEZWNpbWFsLmZsb29yID0gZmxvb3I7XHJcbiAgRGVjaW1hbC5oeXBvdCA9IGh5cG90OyAgICAgICAgLy8gRVM2XHJcbiAgRGVjaW1hbC5sbiA9IGxuO1xyXG4gIERlY2ltYWwubG9nID0gbG9nO1xyXG4gIERlY2ltYWwubG9nMTAgPSBsb2cxMDsgICAgICAgIC8vIEVTNlxyXG4gIERlY2ltYWwubG9nMiA9IGxvZzI7ICAgICAgICAgIC8vIEVTNlxyXG4gIERlY2ltYWwubWF4ID0gbWF4O1xyXG4gIERlY2ltYWwubWluID0gbWluO1xyXG4gIERlY2ltYWwubW9kID0gbW9kO1xyXG4gIERlY2ltYWwubXVsID0gbXVsO1xyXG4gIERlY2ltYWwucG93ID0gcG93O1xyXG4gIERlY2ltYWwucmFuZG9tID0gcmFuZG9tO1xyXG4gIERlY2ltYWwucm91bmQgPSByb3VuZDtcclxuICBEZWNpbWFsLnNpZ24gPSBzaWduOyAgICAgICAgICAvLyBFUzZcclxuICBEZWNpbWFsLnNpbiA9IHNpbjtcclxuICBEZWNpbWFsLnNpbmggPSBzaW5oOyAgICAgICAgICAvLyBFUzZcclxuICBEZWNpbWFsLnNxcnQgPSBzcXJ0O1xyXG4gIERlY2ltYWwuc3ViID0gc3ViO1xyXG4gIERlY2ltYWwuc3VtID0gc3VtO1xyXG4gIERlY2ltYWwudGFuID0gdGFuO1xyXG4gIERlY2ltYWwudGFuaCA9IHRhbmg7ICAgICAgICAgIC8vIEVTNlxyXG4gIERlY2ltYWwudHJ1bmMgPSB0cnVuYzsgICAgICAgIC8vIEVTNlxyXG5cclxuICBpZiAob2JqID09PSB2b2lkIDApIG9iaiA9IHt9O1xyXG4gIGlmIChvYmopIHtcclxuICAgIGlmIChvYmouZGVmYXVsdHMgIT09IHRydWUpIHtcclxuICAgICAgcHMgPSBbJ3ByZWNpc2lvbicsICdyb3VuZGluZycsICd0b0V4cE5lZycsICd0b0V4cFBvcycsICdtYXhFJywgJ21pbkUnLCAnbW9kdWxvJywgJ2NyeXB0byddO1xyXG4gICAgICBmb3IgKGkgPSAwOyBpIDwgcHMubGVuZ3RoOykgaWYgKCFvYmouaGFzT3duUHJvcGVydHkocCA9IHBzW2krK10pKSBvYmpbcF0gPSB0aGlzW3BdO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgRGVjaW1hbC5jb25maWcob2JqKTtcclxuXHJcbiAgcmV0dXJuIERlY2ltYWw7XHJcbn1cclxuXHJcblxyXG4vKlxyXG4gKiBSZXR1cm4gYSBuZXcgRGVjaW1hbCB3aG9zZSB2YWx1ZSBpcyBgeGAgZGl2aWRlZCBieSBgeWAsIHJvdW5kZWQgdG8gYHByZWNpc2lvbmAgc2lnbmlmaWNhbnRcclxuICogZGlnaXRzIHVzaW5nIHJvdW5kaW5nIG1vZGUgYHJvdW5kaW5nYC5cclxuICpcclxuICogeCB7bnVtYmVyfHN0cmluZ3xEZWNpbWFsfVxyXG4gKiB5IHtudW1iZXJ8c3RyaW5nfERlY2ltYWx9XHJcbiAqXHJcbiAqL1xyXG5mdW5jdGlvbiBkaXYoeCwgeSkge1xyXG4gIHJldHVybiBuZXcgdGhpcyh4KS5kaXYoeSk7XHJcbn1cclxuXHJcblxyXG4vKlxyXG4gKiBSZXR1cm4gYSBuZXcgRGVjaW1hbCB3aG9zZSB2YWx1ZSBpcyB0aGUgbmF0dXJhbCBleHBvbmVudGlhbCBvZiBgeGAsIHJvdW5kZWQgdG8gYHByZWNpc2lvbmBcclxuICogc2lnbmlmaWNhbnQgZGlnaXRzIHVzaW5nIHJvdW5kaW5nIG1vZGUgYHJvdW5kaW5nYC5cclxuICpcclxuICogeCB7bnVtYmVyfHN0cmluZ3xEZWNpbWFsfSBUaGUgcG93ZXIgdG8gd2hpY2ggdG8gcmFpc2UgdGhlIGJhc2Ugb2YgdGhlIG5hdHVyYWwgbG9nLlxyXG4gKlxyXG4gKi9cclxuZnVuY3Rpb24gZXhwKHgpIHtcclxuICByZXR1cm4gbmV3IHRoaXMoeCkuZXhwKCk7XHJcbn1cclxuXHJcblxyXG4vKlxyXG4gKiBSZXR1cm4gYSBuZXcgRGVjaW1hbCB3aG9zZSB2YWx1ZSBpcyBgeGAgcm91bmQgdG8gYW4gaW50ZWdlciB1c2luZyBgUk9VTkRfRkxPT1JgLlxyXG4gKlxyXG4gKiB4IHtudW1iZXJ8c3RyaW5nfERlY2ltYWx9XHJcbiAqXHJcbiAqL1xyXG5mdW5jdGlvbiBmbG9vcih4KSB7XHJcbiAgcmV0dXJuIGZpbmFsaXNlKHggPSBuZXcgdGhpcyh4KSwgeC5lICsgMSwgMyk7XHJcbn1cclxuXHJcblxyXG4vKlxyXG4gKiBSZXR1cm4gYSBuZXcgRGVjaW1hbCB3aG9zZSB2YWx1ZSBpcyB0aGUgc3F1YXJlIHJvb3Qgb2YgdGhlIHN1bSBvZiB0aGUgc3F1YXJlcyBvZiB0aGUgYXJndW1lbnRzLFxyXG4gKiByb3VuZGVkIHRvIGBwcmVjaXNpb25gIHNpZ25pZmljYW50IGRpZ2l0cyB1c2luZyByb3VuZGluZyBtb2RlIGByb3VuZGluZ2AuXHJcbiAqXHJcbiAqIGh5cG90KGEsIGIsIC4uLikgPSBzcXJ0KGFeMiArIGJeMiArIC4uLilcclxuICpcclxuICogYXJndW1lbnRzIHtudW1iZXJ8c3RyaW5nfERlY2ltYWx9XHJcbiAqXHJcbiAqL1xyXG5mdW5jdGlvbiBoeXBvdCgpIHtcclxuICB2YXIgaSwgbixcclxuICAgIHQgPSBuZXcgdGhpcygwKTtcclxuXHJcbiAgZXh0ZXJuYWwgPSBmYWxzZTtcclxuXHJcbiAgZm9yIChpID0gMDsgaSA8IGFyZ3VtZW50cy5sZW5ndGg7KSB7XHJcbiAgICBuID0gbmV3IHRoaXMoYXJndW1lbnRzW2krK10pO1xyXG4gICAgaWYgKCFuLmQpIHtcclxuICAgICAgaWYgKG4ucykge1xyXG4gICAgICAgIGV4dGVybmFsID0gdHJ1ZTtcclxuICAgICAgICByZXR1cm4gbmV3IHRoaXMoMSAvIDApO1xyXG4gICAgICB9XHJcbiAgICAgIHQgPSBuO1xyXG4gICAgfSBlbHNlIGlmICh0LmQpIHtcclxuICAgICAgdCA9IHQucGx1cyhuLnRpbWVzKG4pKTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIGV4dGVybmFsID0gdHJ1ZTtcclxuXHJcbiAgcmV0dXJuIHQuc3FydCgpO1xyXG59XHJcblxyXG5cclxuLypcclxuICogUmV0dXJuIHRydWUgaWYgb2JqZWN0IGlzIGEgRGVjaW1hbCBpbnN0YW5jZSAod2hlcmUgRGVjaW1hbCBpcyBhbnkgRGVjaW1hbCBjb25zdHJ1Y3RvciksXHJcbiAqIG90aGVyd2lzZSByZXR1cm4gZmFsc2UuXHJcbiAqXHJcbiAqL1xyXG5mdW5jdGlvbiBpc0RlY2ltYWxJbnN0YW5jZShvYmopIHtcclxuICByZXR1cm4gb2JqIGluc3RhbmNlb2YgRGVjaW1hbCB8fCBvYmogJiYgb2JqLnRvU3RyaW5nVGFnID09PSB0YWcgfHwgZmFsc2U7XHJcbn1cclxuXHJcblxyXG4vKlxyXG4gKiBSZXR1cm4gYSBuZXcgRGVjaW1hbCB3aG9zZSB2YWx1ZSBpcyB0aGUgbmF0dXJhbCBsb2dhcml0aG0gb2YgYHhgLCByb3VuZGVkIHRvIGBwcmVjaXNpb25gXHJcbiAqIHNpZ25pZmljYW50IGRpZ2l0cyB1c2luZyByb3VuZGluZyBtb2RlIGByb3VuZGluZ2AuXHJcbiAqXHJcbiAqIHgge251bWJlcnxzdHJpbmd8RGVjaW1hbH1cclxuICpcclxuICovXHJcbmZ1bmN0aW9uIGxuKHgpIHtcclxuICByZXR1cm4gbmV3IHRoaXMoeCkubG4oKTtcclxufVxyXG5cclxuXHJcbi8qXHJcbiAqIFJldHVybiBhIG5ldyBEZWNpbWFsIHdob3NlIHZhbHVlIGlzIHRoZSBsb2cgb2YgYHhgIHRvIHRoZSBiYXNlIGB5YCwgb3IgdG8gYmFzZSAxMCBpZiBubyBiYXNlXHJcbiAqIGlzIHNwZWNpZmllZCwgcm91bmRlZCB0byBgcHJlY2lzaW9uYCBzaWduaWZpY2FudCBkaWdpdHMgdXNpbmcgcm91bmRpbmcgbW9kZSBgcm91bmRpbmdgLlxyXG4gKlxyXG4gKiBsb2dbeV0oeClcclxuICpcclxuICogeCB7bnVtYmVyfHN0cmluZ3xEZWNpbWFsfSBUaGUgYXJndW1lbnQgb2YgdGhlIGxvZ2FyaXRobS5cclxuICogeSB7bnVtYmVyfHN0cmluZ3xEZWNpbWFsfSBUaGUgYmFzZSBvZiB0aGUgbG9nYXJpdGhtLlxyXG4gKlxyXG4gKi9cclxuZnVuY3Rpb24gbG9nKHgsIHkpIHtcclxuICByZXR1cm4gbmV3IHRoaXMoeCkubG9nKHkpO1xyXG59XHJcblxyXG5cclxuLypcclxuICogUmV0dXJuIGEgbmV3IERlY2ltYWwgd2hvc2UgdmFsdWUgaXMgdGhlIGJhc2UgMiBsb2dhcml0aG0gb2YgYHhgLCByb3VuZGVkIHRvIGBwcmVjaXNpb25gXHJcbiAqIHNpZ25pZmljYW50IGRpZ2l0cyB1c2luZyByb3VuZGluZyBtb2RlIGByb3VuZGluZ2AuXHJcbiAqXHJcbiAqIHgge251bWJlcnxzdHJpbmd8RGVjaW1hbH1cclxuICpcclxuICovXHJcbmZ1bmN0aW9uIGxvZzIoeCkge1xyXG4gIHJldHVybiBuZXcgdGhpcyh4KS5sb2coMik7XHJcbn1cclxuXHJcblxyXG4vKlxyXG4gKiBSZXR1cm4gYSBuZXcgRGVjaW1hbCB3aG9zZSB2YWx1ZSBpcyB0aGUgYmFzZSAxMCBsb2dhcml0aG0gb2YgYHhgLCByb3VuZGVkIHRvIGBwcmVjaXNpb25gXHJcbiAqIHNpZ25pZmljYW50IGRpZ2l0cyB1c2luZyByb3VuZGluZyBtb2RlIGByb3VuZGluZ2AuXHJcbiAqXHJcbiAqIHgge251bWJlcnxzdHJpbmd8RGVjaW1hbH1cclxuICpcclxuICovXHJcbmZ1bmN0aW9uIGxvZzEwKHgpIHtcclxuICByZXR1cm4gbmV3IHRoaXMoeCkubG9nKDEwKTtcclxufVxyXG5cclxuXHJcbi8qXHJcbiAqIFJldHVybiBhIG5ldyBEZWNpbWFsIHdob3NlIHZhbHVlIGlzIHRoZSBtYXhpbXVtIG9mIHRoZSBhcmd1bWVudHMuXHJcbiAqXHJcbiAqIGFyZ3VtZW50cyB7bnVtYmVyfHN0cmluZ3xEZWNpbWFsfVxyXG4gKlxyXG4gKi9cclxuZnVuY3Rpb24gbWF4KCkge1xyXG4gIHJldHVybiBtYXhPck1pbih0aGlzLCBhcmd1bWVudHMsICdsdCcpO1xyXG59XHJcblxyXG5cclxuLypcclxuICogUmV0dXJuIGEgbmV3IERlY2ltYWwgd2hvc2UgdmFsdWUgaXMgdGhlIG1pbmltdW0gb2YgdGhlIGFyZ3VtZW50cy5cclxuICpcclxuICogYXJndW1lbnRzIHtudW1iZXJ8c3RyaW5nfERlY2ltYWx9XHJcbiAqXHJcbiAqL1xyXG5mdW5jdGlvbiBtaW4oKSB7XHJcbiAgcmV0dXJuIG1heE9yTWluKHRoaXMsIGFyZ3VtZW50cywgJ2d0Jyk7XHJcbn1cclxuXHJcblxyXG4vKlxyXG4gKiBSZXR1cm4gYSBuZXcgRGVjaW1hbCB3aG9zZSB2YWx1ZSBpcyBgeGAgbW9kdWxvIGB5YCwgcm91bmRlZCB0byBgcHJlY2lzaW9uYCBzaWduaWZpY2FudCBkaWdpdHNcclxuICogdXNpbmcgcm91bmRpbmcgbW9kZSBgcm91bmRpbmdgLlxyXG4gKlxyXG4gKiB4IHtudW1iZXJ8c3RyaW5nfERlY2ltYWx9XHJcbiAqIHkge251bWJlcnxzdHJpbmd8RGVjaW1hbH1cclxuICpcclxuICovXHJcbmZ1bmN0aW9uIG1vZCh4LCB5KSB7XHJcbiAgcmV0dXJuIG5ldyB0aGlzKHgpLm1vZCh5KTtcclxufVxyXG5cclxuXHJcbi8qXHJcbiAqIFJldHVybiBhIG5ldyBEZWNpbWFsIHdob3NlIHZhbHVlIGlzIGB4YCBtdWx0aXBsaWVkIGJ5IGB5YCwgcm91bmRlZCB0byBgcHJlY2lzaW9uYCBzaWduaWZpY2FudFxyXG4gKiBkaWdpdHMgdXNpbmcgcm91bmRpbmcgbW9kZSBgcm91bmRpbmdgLlxyXG4gKlxyXG4gKiB4IHtudW1iZXJ8c3RyaW5nfERlY2ltYWx9XHJcbiAqIHkge251bWJlcnxzdHJpbmd8RGVjaW1hbH1cclxuICpcclxuICovXHJcbmZ1bmN0aW9uIG11bCh4LCB5KSB7XHJcbiAgcmV0dXJuIG5ldyB0aGlzKHgpLm11bCh5KTtcclxufVxyXG5cclxuXHJcbi8qXHJcbiAqIFJldHVybiBhIG5ldyBEZWNpbWFsIHdob3NlIHZhbHVlIGlzIGB4YCByYWlzZWQgdG8gdGhlIHBvd2VyIGB5YCwgcm91bmRlZCB0byBwcmVjaXNpb25cclxuICogc2lnbmlmaWNhbnQgZGlnaXRzIHVzaW5nIHJvdW5kaW5nIG1vZGUgYHJvdW5kaW5nYC5cclxuICpcclxuICogeCB7bnVtYmVyfHN0cmluZ3xEZWNpbWFsfSBUaGUgYmFzZS5cclxuICogeSB7bnVtYmVyfHN0cmluZ3xEZWNpbWFsfSBUaGUgZXhwb25lbnQuXHJcbiAqXHJcbiAqL1xyXG5mdW5jdGlvbiBwb3coeCwgeSkge1xyXG4gIHJldHVybiBuZXcgdGhpcyh4KS5wb3coeSk7XHJcbn1cclxuXHJcblxyXG4vKlxyXG4gKiBSZXR1cm5zIGEgbmV3IERlY2ltYWwgd2l0aCBhIHJhbmRvbSB2YWx1ZSBlcXVhbCB0byBvciBncmVhdGVyIHRoYW4gMCBhbmQgbGVzcyB0aGFuIDEsIGFuZCB3aXRoXHJcbiAqIGBzZGAsIG9yIGBEZWNpbWFsLnByZWNpc2lvbmAgaWYgYHNkYCBpcyBvbWl0dGVkLCBzaWduaWZpY2FudCBkaWdpdHMgKG9yIGxlc3MgaWYgdHJhaWxpbmcgemVyb3NcclxuICogYXJlIHByb2R1Y2VkKS5cclxuICpcclxuICogW3NkXSB7bnVtYmVyfSBTaWduaWZpY2FudCBkaWdpdHMuIEludGVnZXIsIDAgdG8gTUFYX0RJR0lUUyBpbmNsdXNpdmUuXHJcbiAqXHJcbiAqL1xyXG5mdW5jdGlvbiByYW5kb20oc2QpIHtcclxuICB2YXIgZCwgZSwgaywgbixcclxuICAgIGkgPSAwLFxyXG4gICAgciA9IG5ldyB0aGlzKDEpLFxyXG4gICAgcmQgPSBbXTtcclxuXHJcbiAgaWYgKHNkID09PSB2b2lkIDApIHNkID0gdGhpcy5wcmVjaXNpb247XHJcbiAgZWxzZSBjaGVja0ludDMyKHNkLCAxLCBNQVhfRElHSVRTKTtcclxuXHJcbiAgayA9IE1hdGguY2VpbChzZCAvIExPR19CQVNFKTtcclxuXHJcbiAgaWYgKCF0aGlzLmNyeXB0bykge1xyXG4gICAgZm9yICg7IGkgPCBrOykgcmRbaSsrXSA9IE1hdGgucmFuZG9tKCkgKiAxZTcgfCAwO1xyXG5cclxuICAvLyBCcm93c2VycyBzdXBwb3J0aW5nIGNyeXB0by5nZXRSYW5kb21WYWx1ZXMuXHJcbiAgfSBlbHNlIGlmIChjcnlwdG8uZ2V0UmFuZG9tVmFsdWVzKSB7XHJcbiAgICBkID0gY3J5cHRvLmdldFJhbmRvbVZhbHVlcyhuZXcgVWludDMyQXJyYXkoaykpO1xyXG5cclxuICAgIGZvciAoOyBpIDwgazspIHtcclxuICAgICAgbiA9IGRbaV07XHJcblxyXG4gICAgICAvLyAwIDw9IG4gPCA0Mjk0OTY3Mjk2XHJcbiAgICAgIC8vIFByb2JhYmlsaXR5IG4gPj0gNC4yOWU5LCBpcyA0OTY3Mjk2IC8gNDI5NDk2NzI5NiA9IDAuMDAxMTYgKDEgaW4gODY1KS5cclxuICAgICAgaWYgKG4gPj0gNC4yOWU5KSB7XHJcbiAgICAgICAgZFtpXSA9IGNyeXB0by5nZXRSYW5kb21WYWx1ZXMobmV3IFVpbnQzMkFycmF5KDEpKVswXTtcclxuICAgICAgfSBlbHNlIHtcclxuXHJcbiAgICAgICAgLy8gMCA8PSBuIDw9IDQyODk5OTk5OTlcclxuICAgICAgICAvLyAwIDw9IChuICUgMWU3KSA8PSA5OTk5OTk5XHJcbiAgICAgICAgcmRbaSsrXSA9IG4gJSAxZTc7XHJcbiAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgLy8gTm9kZS5qcyBzdXBwb3J0aW5nIGNyeXB0by5yYW5kb21CeXRlcy5cclxuICB9IGVsc2UgaWYgKGNyeXB0by5yYW5kb21CeXRlcykge1xyXG5cclxuICAgIC8vIGJ1ZmZlclxyXG4gICAgZCA9IGNyeXB0by5yYW5kb21CeXRlcyhrICo9IDQpO1xyXG5cclxuICAgIGZvciAoOyBpIDwgazspIHtcclxuXHJcbiAgICAgIC8vIDAgPD0gbiA8IDIxNDc0ODM2NDhcclxuICAgICAgbiA9IGRbaV0gKyAoZFtpICsgMV0gPDwgOCkgKyAoZFtpICsgMl0gPDwgMTYpICsgKChkW2kgKyAzXSAmIDB4N2YpIDw8IDI0KTtcclxuXHJcbiAgICAgIC8vIFByb2JhYmlsaXR5IG4gPj0gMi4xNGU5LCBpcyA3NDgzNjQ4IC8gMjE0NzQ4MzY0OCA9IDAuMDAzNSAoMSBpbiAyODYpLlxyXG4gICAgICBpZiAobiA+PSAyLjE0ZTkpIHtcclxuICAgICAgICBjcnlwdG8ucmFuZG9tQnl0ZXMoNCkuY29weShkLCBpKTtcclxuICAgICAgfSBlbHNlIHtcclxuXHJcbiAgICAgICAgLy8gMCA8PSBuIDw9IDIxMzk5OTk5OTlcclxuICAgICAgICAvLyAwIDw9IChuICUgMWU3KSA8PSA5OTk5OTk5XHJcbiAgICAgICAgcmQucHVzaChuICUgMWU3KTtcclxuICAgICAgICBpICs9IDQ7XHJcbiAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBpID0gayAvIDQ7XHJcbiAgfSBlbHNlIHtcclxuICAgIHRocm93IEVycm9yKGNyeXB0b1VuYXZhaWxhYmxlKTtcclxuICB9XHJcblxyXG4gIGsgPSByZFstLWldO1xyXG4gIHNkICU9IExPR19CQVNFO1xyXG5cclxuICAvLyBDb252ZXJ0IHRyYWlsaW5nIGRpZ2l0cyB0byB6ZXJvcyBhY2NvcmRpbmcgdG8gc2QuXHJcbiAgaWYgKGsgJiYgc2QpIHtcclxuICAgIG4gPSBtYXRocG93KDEwLCBMT0dfQkFTRSAtIHNkKTtcclxuICAgIHJkW2ldID0gKGsgLyBuIHwgMCkgKiBuO1xyXG4gIH1cclxuXHJcbiAgLy8gUmVtb3ZlIHRyYWlsaW5nIHdvcmRzIHdoaWNoIGFyZSB6ZXJvLlxyXG4gIGZvciAoOyByZFtpXSA9PT0gMDsgaS0tKSByZC5wb3AoKTtcclxuXHJcbiAgLy8gWmVybz9cclxuICBpZiAoaSA8IDApIHtcclxuICAgIGUgPSAwO1xyXG4gICAgcmQgPSBbMF07XHJcbiAgfSBlbHNlIHtcclxuICAgIGUgPSAtMTtcclxuXHJcbiAgICAvLyBSZW1vdmUgbGVhZGluZyB3b3JkcyB3aGljaCBhcmUgemVybyBhbmQgYWRqdXN0IGV4cG9uZW50IGFjY29yZGluZ2x5LlxyXG4gICAgZm9yICg7IHJkWzBdID09PSAwOyBlIC09IExPR19CQVNFKSByZC5zaGlmdCgpO1xyXG5cclxuICAgIC8vIENvdW50IHRoZSBkaWdpdHMgb2YgdGhlIGZpcnN0IHdvcmQgb2YgcmQgdG8gZGV0ZXJtaW5lIGxlYWRpbmcgemVyb3MuXHJcbiAgICBmb3IgKGsgPSAxLCBuID0gcmRbMF07IG4gPj0gMTA7IG4gLz0gMTApIGsrKztcclxuXHJcbiAgICAvLyBBZGp1c3QgdGhlIGV4cG9uZW50IGZvciBsZWFkaW5nIHplcm9zIG9mIHRoZSBmaXJzdCB3b3JkIG9mIHJkLlxyXG4gICAgaWYgKGsgPCBMT0dfQkFTRSkgZSAtPSBMT0dfQkFTRSAtIGs7XHJcbiAgfVxyXG5cclxuICByLmUgPSBlO1xyXG4gIHIuZCA9IHJkO1xyXG5cclxuICByZXR1cm4gcjtcclxufVxyXG5cclxuXHJcbi8qXHJcbiAqIFJldHVybiBhIG5ldyBEZWNpbWFsIHdob3NlIHZhbHVlIGlzIGB4YCByb3VuZGVkIHRvIGFuIGludGVnZXIgdXNpbmcgcm91bmRpbmcgbW9kZSBgcm91bmRpbmdgLlxyXG4gKlxyXG4gKiBUbyBlbXVsYXRlIGBNYXRoLnJvdW5kYCwgc2V0IHJvdW5kaW5nIHRvIDcgKFJPVU5EX0hBTEZfQ0VJTCkuXHJcbiAqXHJcbiAqIHgge251bWJlcnxzdHJpbmd8RGVjaW1hbH1cclxuICpcclxuICovXHJcbmZ1bmN0aW9uIHJvdW5kKHgpIHtcclxuICByZXR1cm4gZmluYWxpc2UoeCA9IG5ldyB0aGlzKHgpLCB4LmUgKyAxLCB0aGlzLnJvdW5kaW5nKTtcclxufVxyXG5cclxuXHJcbi8qXHJcbiAqIFJldHVyblxyXG4gKiAgIDEgICAgaWYgeCA+IDAsXHJcbiAqICAtMSAgICBpZiB4IDwgMCxcclxuICogICAwICAgIGlmIHggaXMgMCxcclxuICogIC0wICAgIGlmIHggaXMgLTAsXHJcbiAqICAgTmFOICBvdGhlcndpc2VcclxuICpcclxuICogeCB7bnVtYmVyfHN0cmluZ3xEZWNpbWFsfVxyXG4gKlxyXG4gKi9cclxuZnVuY3Rpb24gc2lnbih4KSB7XHJcbiAgeCA9IG5ldyB0aGlzKHgpO1xyXG4gIHJldHVybiB4LmQgPyAoeC5kWzBdID8geC5zIDogMCAqIHgucykgOiB4LnMgfHwgTmFOO1xyXG59XHJcblxyXG5cclxuLypcclxuICogUmV0dXJuIGEgbmV3IERlY2ltYWwgd2hvc2UgdmFsdWUgaXMgdGhlIHNpbmUgb2YgYHhgLCByb3VuZGVkIHRvIGBwcmVjaXNpb25gIHNpZ25pZmljYW50IGRpZ2l0c1xyXG4gKiB1c2luZyByb3VuZGluZyBtb2RlIGByb3VuZGluZ2AuXHJcbiAqXHJcbiAqIHgge251bWJlcnxzdHJpbmd8RGVjaW1hbH0gQSB2YWx1ZSBpbiByYWRpYW5zLlxyXG4gKlxyXG4gKi9cclxuZnVuY3Rpb24gc2luKHgpIHtcclxuICByZXR1cm4gbmV3IHRoaXMoeCkuc2luKCk7XHJcbn1cclxuXHJcblxyXG4vKlxyXG4gKiBSZXR1cm4gYSBuZXcgRGVjaW1hbCB3aG9zZSB2YWx1ZSBpcyB0aGUgaHlwZXJib2xpYyBzaW5lIG9mIGB4YCwgcm91bmRlZCB0byBgcHJlY2lzaW9uYFxyXG4gKiBzaWduaWZpY2FudCBkaWdpdHMgdXNpbmcgcm91bmRpbmcgbW9kZSBgcm91bmRpbmdgLlxyXG4gKlxyXG4gKiB4IHtudW1iZXJ8c3RyaW5nfERlY2ltYWx9IEEgdmFsdWUgaW4gcmFkaWFucy5cclxuICpcclxuICovXHJcbmZ1bmN0aW9uIHNpbmgoeCkge1xyXG4gIHJldHVybiBuZXcgdGhpcyh4KS5zaW5oKCk7XHJcbn1cclxuXHJcblxyXG4vKlxyXG4gKiBSZXR1cm4gYSBuZXcgRGVjaW1hbCB3aG9zZSB2YWx1ZSBpcyB0aGUgc3F1YXJlIHJvb3Qgb2YgYHhgLCByb3VuZGVkIHRvIGBwcmVjaXNpb25gIHNpZ25pZmljYW50XHJcbiAqIGRpZ2l0cyB1c2luZyByb3VuZGluZyBtb2RlIGByb3VuZGluZ2AuXHJcbiAqXHJcbiAqIHgge251bWJlcnxzdHJpbmd8RGVjaW1hbH1cclxuICpcclxuICovXHJcbmZ1bmN0aW9uIHNxcnQoeCkge1xyXG4gIHJldHVybiBuZXcgdGhpcyh4KS5zcXJ0KCk7XHJcbn1cclxuXHJcblxyXG4vKlxyXG4gKiBSZXR1cm4gYSBuZXcgRGVjaW1hbCB3aG9zZSB2YWx1ZSBpcyBgeGAgbWludXMgYHlgLCByb3VuZGVkIHRvIGBwcmVjaXNpb25gIHNpZ25pZmljYW50IGRpZ2l0c1xyXG4gKiB1c2luZyByb3VuZGluZyBtb2RlIGByb3VuZGluZ2AuXHJcbiAqXHJcbiAqIHgge251bWJlcnxzdHJpbmd8RGVjaW1hbH1cclxuICogeSB7bnVtYmVyfHN0cmluZ3xEZWNpbWFsfVxyXG4gKlxyXG4gKi9cclxuZnVuY3Rpb24gc3ViKHgsIHkpIHtcclxuICByZXR1cm4gbmV3IHRoaXMoeCkuc3ViKHkpO1xyXG59XHJcblxyXG5cclxuLypcclxuICogUmV0dXJuIGEgbmV3IERlY2ltYWwgd2hvc2UgdmFsdWUgaXMgdGhlIHN1bSBvZiB0aGUgYXJndW1lbnRzLCByb3VuZGVkIHRvIGBwcmVjaXNpb25gXHJcbiAqIHNpZ25pZmljYW50IGRpZ2l0cyB1c2luZyByb3VuZGluZyBtb2RlIGByb3VuZGluZ2AuXHJcbiAqXHJcbiAqIE9ubHkgdGhlIHJlc3VsdCBpcyByb3VuZGVkLCBub3QgdGhlIGludGVybWVkaWF0ZSBjYWxjdWxhdGlvbnMuXHJcbiAqXHJcbiAqIGFyZ3VtZW50cyB7bnVtYmVyfHN0cmluZ3xEZWNpbWFsfVxyXG4gKlxyXG4gKi9cclxuZnVuY3Rpb24gc3VtKCkge1xyXG4gIHZhciBpID0gMCxcclxuICAgIGFyZ3MgPSBhcmd1bWVudHMsXHJcbiAgICB4ID0gbmV3IHRoaXMoYXJnc1tpXSk7XHJcblxyXG4gIGV4dGVybmFsID0gZmFsc2U7XHJcbiAgZm9yICg7IHgucyAmJiArK2kgPCBhcmdzLmxlbmd0aDspIHggPSB4LnBsdXMoYXJnc1tpXSk7XHJcbiAgZXh0ZXJuYWwgPSB0cnVlO1xyXG5cclxuICByZXR1cm4gZmluYWxpc2UoeCwgdGhpcy5wcmVjaXNpb24sIHRoaXMucm91bmRpbmcpO1xyXG59XHJcblxyXG5cclxuLypcclxuICogUmV0dXJuIGEgbmV3IERlY2ltYWwgd2hvc2UgdmFsdWUgaXMgdGhlIHRhbmdlbnQgb2YgYHhgLCByb3VuZGVkIHRvIGBwcmVjaXNpb25gIHNpZ25pZmljYW50XHJcbiAqIGRpZ2l0cyB1c2luZyByb3VuZGluZyBtb2RlIGByb3VuZGluZ2AuXHJcbiAqXHJcbiAqIHgge251bWJlcnxzdHJpbmd8RGVjaW1hbH0gQSB2YWx1ZSBpbiByYWRpYW5zLlxyXG4gKlxyXG4gKi9cclxuZnVuY3Rpb24gdGFuKHgpIHtcclxuICByZXR1cm4gbmV3IHRoaXMoeCkudGFuKCk7XHJcbn1cclxuXHJcblxyXG4vKlxyXG4gKiBSZXR1cm4gYSBuZXcgRGVjaW1hbCB3aG9zZSB2YWx1ZSBpcyB0aGUgaHlwZXJib2xpYyB0YW5nZW50IG9mIGB4YCwgcm91bmRlZCB0byBgcHJlY2lzaW9uYFxyXG4gKiBzaWduaWZpY2FudCBkaWdpdHMgdXNpbmcgcm91bmRpbmcgbW9kZSBgcm91bmRpbmdgLlxyXG4gKlxyXG4gKiB4IHtudW1iZXJ8c3RyaW5nfERlY2ltYWx9IEEgdmFsdWUgaW4gcmFkaWFucy5cclxuICpcclxuICovXHJcbmZ1bmN0aW9uIHRhbmgoeCkge1xyXG4gIHJldHVybiBuZXcgdGhpcyh4KS50YW5oKCk7XHJcbn1cclxuXHJcblxyXG4vKlxyXG4gKiBSZXR1cm4gYSBuZXcgRGVjaW1hbCB3aG9zZSB2YWx1ZSBpcyBgeGAgdHJ1bmNhdGVkIHRvIGFuIGludGVnZXIuXHJcbiAqXHJcbiAqIHgge251bWJlcnxzdHJpbmd8RGVjaW1hbH1cclxuICpcclxuICovXHJcbmZ1bmN0aW9uIHRydW5jKHgpIHtcclxuICByZXR1cm4gZmluYWxpc2UoeCA9IG5ldyB0aGlzKHgpLCB4LmUgKyAxLCAxKTtcclxufVxyXG5cclxuXHJcblBbU3ltYm9sLmZvcignbm9kZWpzLnV0aWwuaW5zcGVjdC5jdXN0b20nKV0gPSBQLnRvU3RyaW5nO1xyXG5QW1N5bWJvbC50b1N0cmluZ1RhZ10gPSAnRGVjaW1hbCc7XHJcblxyXG4vLyBDcmVhdGUgYW5kIGNvbmZpZ3VyZSBpbml0aWFsIERlY2ltYWwgY29uc3RydWN0b3IuXHJcbmV4cG9ydCB2YXIgRGVjaW1hbCA9IFAuY29uc3RydWN0b3IgPSBjbG9uZShERUZBVUxUUyk7XHJcblxyXG4vLyBDcmVhdGUgdGhlIGludGVybmFsIGNvbnN0YW50cyBmcm9tIHRoZWlyIHN0cmluZyB2YWx1ZXMuXHJcbkxOMTAgPSBuZXcgRGVjaW1hbChMTjEwKTtcclxuUEkgPSBuZXcgRGVjaW1hbChQSSk7XHJcblxyXG5leHBvcnQgZGVmYXVsdCBEZWNpbWFsO1xyXG4iLCAiLypcbk5vdGFibGUgY2hhbmdlcyBtYWRlIChhbmQgbm90ZXMpOlxuLSBOdW1iZXIgY2xhc3NlcyByZWdpc3RlcmVkIGFmdGVyIHRoZXkgYXJlIGRlZmluZWRcbi0gRmxvYXQgaXMgaGFuZGVsZWQgZW50aXJlbHkgYnkgZGVjaW1hbC5qcywgYW5kIG5vdyBvbmx5IHRha2VzIHByZWNpc2lvbiBpblxuICAjIG9mIGRlY2ltYWwgcG9pbnRzXG4tIE5vdGU6IG9ubHkgbWV0aG9kcyBuZWNlc3NhcnkgZm9yIGFkZCwgbXVsLCBhbmQgcG93IGhhdmUgYmVlbiBpbXBsZW1lbnRlZFxuKi9cblxuLy8gYmFzaWMgaW1wbGVtZW50YXRpb25zIG9ubHkgLSBubyB1dGlsaXR5IGFkZGVkIHlldFxuaW1wb3J0IHtfQXRvbWljRXhwcn0gZnJvbSBcIi4vZXhwci5qc1wiO1xuaW1wb3J0IHtOdW1iZXJLaW5kfSBmcm9tIFwiLi9raW5kLmpzXCI7XG5pbXBvcnQge01hbmFnZWRQcm9wZXJ0aWVzfSBmcm9tIFwiLi9hc3N1bXB0aW9ucy5qc1wiO1xuaW1wb3J0IHtnbG9iYWxfcGFyYW1ldGVyc30gZnJvbSBcIi4vcGFyYW1ldGVycy5qc1wiO1xuaW1wb3J0IHtBZGR9IGZyb20gXCIuL2FkZC5qc1wiO1xuaW1wb3J0IHtTLCBTaW5nbGV0b259IGZyb20gXCIuL3NpbmdsZXRvbi5qc1wiO1xuaW1wb3J0IERlY2ltYWwgZnJvbSBcImRlY2ltYWwuanNcIjtcbmltcG9ydCB7YXNfaW50fSBmcm9tIFwiLi4vdXRpbGl0aWVzL21pc2MuanNcIjtcbmltcG9ydCB7UG93fSBmcm9tIFwiLi9wb3dlci5qc1wiO1xuaW1wb3J0IHtHbG9iYWx9IGZyb20gXCIuL2dsb2JhbC5qc1wiO1xuaW1wb3J0IHtkaXZtb2QsIGZhY3RvcmludCwgZmFjdG9ycmF0LCBwZXJmZWN0X3Bvd2VyfSBmcm9tIFwiLi4vbnRoZW9yeS9mYWN0b3JfLmpzXCI7XG5pbXBvcnQge0hhc2hEaWN0fSBmcm9tIFwiLi91dGlsaXR5LmpzXCI7XG5pbXBvcnQge011bH0gZnJvbSBcIi4vbXVsLmpzXCI7XG5cbi8qXG51dGlsaXR5IGZ1bmN0aW9uc1xuXG5UaGVzZSBhcmUgc29tZXdoYXQgd3JpdHRlbiBkaWZmZXJlbnRseSB0aGFuIGluIHN5bXB5ICh3aGljaCBkZXBlbmRzIG9uIG1wbWF0aClcbmJ1dCB0aGV5IHByb3ZpZGUgdGhlIHNhbWUgZnVuY3Rpb25hbGl0eVxuKi9cblxuZnVuY3Rpb24gaWdjZCh4OiBudW1iZXIsIHk6IG51bWJlcikge1xuICAgIHdoaWxlICh5KSB7XG4gICAgICAgIGNvbnN0IHQgPSB5O1xuICAgICAgICB5ID0geCAlIHk7XG4gICAgICAgIHggPSB0O1xuICAgIH1cbiAgICByZXR1cm4geDtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGludF9udGhyb290KHk6IG51bWJlciwgbjogbnVtYmVyKSB7XG4gICAgY29uc3QgeCA9IE1hdGguZmxvb3IoeSoqKDEvbikpO1xuICAgIGNvbnN0IGlzZXhhY3QgPSB4KipuID09PSB5O1xuICAgIHJldHVybiBbeCwgaXNleGFjdF07XG59XG5cbi8vIHR1cm4gYSBmbG9hdCB0byBhIHJhdGlvbmFsIC0+IHJlcGxpYWNhdGVzIG1wbWF0aCBmdW5jdGlvbmFsaXR5IGJ1dCB3ZSBzaG91bGRcbi8vIHByb2JhYmx5IGZpbmQgYSBsaWJyYXJ5IHRvIGRvIHRoaXMgZXZlbnR1YWxseVxuZnVuY3Rpb24gdG9SYXRpbyhuOiBhbnksIGVwczogbnVtYmVyKSB7XG4gICAgY29uc3QgZ2NkZSA9IChlOiBudW1iZXIsIHg6IG51bWJlciwgeTogbnVtYmVyKSA9PiB7XG4gICAgICAgIGNvbnN0IF9nY2Q6IGFueSA9IChhOiBudW1iZXIsIGI6IG51bWJlcikgPT4gKGIgPCBlID8gYSA6IF9nY2QoYiwgYSAlIGIpKTtcbiAgICAgICAgcmV0dXJuIF9nY2QoTWF0aC5hYnMoeCksIE1hdGguYWJzKHkpKTtcbiAgICB9O1xuICAgIGNvbnN0IGMgPSBnY2RlKEJvb2xlYW4oZXBzKSA/IGVwcyA6ICgxIC8gMTAwMDApLCAxLCBuKTtcbiAgICByZXR1cm4gW01hdGguZmxvb3IobiAvIGMpLCBNYXRoLmZsb29yKDEgLyBjKV07XG59XG5cbmZ1bmN0aW9uIGlnY2RleChhOiBudW1iZXIgPSB1bmRlZmluZWQsIGI6IG51bWJlciA9IHVuZGVmaW5lZCkge1xuICAgIGlmICh0eXBlb2YgYSA9PT0gXCJ1bmRlZmluZWRcIiAmJiB0eXBlb2YgYiA9PT0gXCJ1bmRlZmluZWRcIikge1xuICAgICAgICByZXR1cm4gWzAsIDEsIDBdO1xuICAgIH1cblxuICAgIGlmICh0eXBlb2YgYSA9PT0gXCJ1bmRlZmluZWRcIikge1xuICAgICAgICByZXR1cm4gWzAsIE1hdGguZmxvb3IoYiAvIE1hdGguYWJzKGIpKSwgTWF0aC5hYnMoYildO1xuICAgIH1cblxuICAgIGlmICh0eXBlb2YgYiA9PT0gXCJ1bmRlZmluZWRcIikge1xuICAgICAgICByZXR1cm4gW01hdGguZmxvb3IoYSAvIE1hdGguYWJzKGEpKSwgMCwgTWF0aC5hYnMoYSldO1xuICAgIH1cbiAgICBsZXQgeF9zaWduO1xuICAgIGxldCB5X3NpZ247XG4gICAgaWYgKGEgPCAwKSB7XG4gICAgICAgIGEgPSAtMTtcbiAgICAgICAgeF9zaWduID0gLTE7XG4gICAgfSBlbHNlIHtcbiAgICAgICAgeF9zaWduID0gMTtcbiAgICB9XG4gICAgaWYgKGIgPCAwKSB7XG4gICAgICAgIGIgPSAtYjtcbiAgICAgICAgeV9zaWduID0gLTE7XG4gICAgfSBlbHNlIHtcbiAgICAgICAgeV9zaWduID0gMTtcbiAgICB9XG5cbiAgICBsZXQgW3gsIHksIHIsIHNdID0gWzEsIDAsIDAsIDFdO1xuICAgIGxldCBjOyBsZXQgcTtcbiAgICB3aGlsZSAoYikge1xuICAgICAgICBbYywgcV0gPSBbYSAlIGIsIE1hdGguZmxvb3IoYSAvIGIpXTtcbiAgICAgICAgW2EsIGIsIHIsIHMsIHgsIHldID0gW2IsIGMsIHggLSBxICogciwgeSAtIHEgKiBzLCByLCBzXTtcbiAgICB9XG4gICAgcmV0dXJuIFt4ICogeF9zaWduLCB5ICogeV9zaWduLCBhXTtcbn1cblxuZnVuY3Rpb24gbW9kX2ludmVyc2UoYTogYW55LCBtOiBhbnkpIHtcbiAgICBsZXQgYyA9IHVuZGVmaW5lZDtcbiAgICBbYSwgbV0gPSBbYXNfaW50KGEpLCBhc19pbnQobSldO1xuICAgIGlmIChtICE9PSAxICYmIG0gIT09IC0xKSB7XG4gICAgICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBuby11bnVzZWQtdmFyc1xuICAgICAgICBjb25zdCBbeCwgYiwgZ10gPSBpZ2NkZXgoYSwgbSk7XG4gICAgICAgIGlmIChnID09PSAxKSB7XG4gICAgICAgICAgICBjID0geCAmIG07XG4gICAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIGM7XG59XG5cbkdsb2JhbC5yZWdpc3RlcmZ1bmMoXCJtb2RfaW52ZXJzZVwiLCBtb2RfaW52ZXJzZSk7XG5cbmNsYXNzIF9OdW1iZXJfIGV4dGVuZHMgX0F0b21pY0V4cHIge1xuICAgIC8qXG4gICAgUmVwcmVzZW50cyBhdG9taWMgbnVtYmVycyBpbiBTeW1QeS5cbiAgICBFeHBsYW5hdGlvblxuICAgID09PT09PT09PT09XG4gICAgRmxvYXRpbmcgcG9pbnQgbnVtYmVycyBhcmUgcmVwcmVzZW50ZWQgYnkgdGhlIEZsb2F0IGNsYXNzLlxuICAgIFJhdGlvbmFsIG51bWJlcnMgKG9mIGFueSBzaXplKSBhcmUgcmVwcmVzZW50ZWQgYnkgdGhlIFJhdGlvbmFsIGNsYXNzLlxuICAgIEludGVnZXIgbnVtYmVycyAob2YgYW55IHNpemUpIGFyZSByZXByZXNlbnRlZCBieSB0aGUgSW50ZWdlciBjbGFzcy5cbiAgICBGbG9hdCBhbmQgUmF0aW9uYWwgYXJlIHN1YmNsYXNzZXMgb2YgTnVtYmVyOyBJbnRlZ2VyIGlzIGEgc3ViY2xhc3NcbiAgICBvZiBSYXRpb25hbC5cbiAgICBGb3IgZXhhbXBsZSwgYGAyLzNgYCBpcyByZXByZXNlbnRlZCBhcyBgYFJhdGlvbmFsKDIsIDMpYGAgd2hpY2ggaXNcbiAgICBhIGRpZmZlcmVudCBvYmplY3QgZnJvbSB0aGUgZmxvYXRpbmcgcG9pbnQgbnVtYmVyIG9idGFpbmVkIHdpdGhcbiAgICBQeXRob24gZGl2aXNpb24gYGAyLzNgYC4gRXZlbiBmb3IgbnVtYmVycyB0aGF0IGFyZSBleGFjdGx5XG4gICAgcmVwcmVzZW50ZWQgaW4gYmluYXJ5LCB0aGVyZSBpcyBhIGRpZmZlcmVuY2UgYmV0d2VlbiBob3cgdHdvIGZvcm1zLFxuICAgIHN1Y2ggYXMgYGBSYXRpb25hbCgxLCAyKWBgIGFuZCBgYEZsb2F0KDAuNSlgYCwgYXJlIHVzZWQgaW4gU3ltUHkuXG4gICAgVGhlIHJhdGlvbmFsIGZvcm0gaXMgdG8gYmUgcHJlZmVycmVkIGluIHN5bWJvbGljIGNvbXB1dGF0aW9ucy5cbiAgICBPdGhlciBraW5kcyBvZiBudW1iZXJzLCBzdWNoIGFzIGFsZ2VicmFpYyBudW1iZXJzIGBgc3FydCgyKWBgIG9yXG4gICAgY29tcGxleCBudW1iZXJzIGBgMyArIDQqSWBgLCBhcmUgbm90IGluc3RhbmNlcyBvZiBOdW1iZXIgY2xhc3MgYXNcbiAgICB0aGV5IGFyZSBub3QgYXRvbWljLlxuICAgIFNlZSBBbHNvXG4gICAgPT09PT09PT1cbiAgICBGbG9hdCwgSW50ZWdlciwgUmF0aW9uYWxcbiAgICAqL1xuICAgIHN0YXRpYyBpc19jb21tdXRhdGl2ZSA9IHRydWU7XG4gICAgc3RhdGljIGlzX251bWJlciA9IHRydWU7XG4gICAgc3RhdGljIGlzX051bWJlciA9IHRydWU7XG4gICAgc3RhdGljIGtpbmQgPSBOdW1iZXJLaW5kO1xuXG4gICAgc3RhdGljIG5ldyguLi5vYmo6IGFueSkge1xuICAgICAgICBpZiAob2JqLmxlbmd0aCA9PT0gMSkge1xuICAgICAgICAgICAgb2JqID0gb2JqWzBdO1xuICAgICAgICB9XG4gICAgICAgIGlmIChvYmogaW5zdGFuY2VvZiBfTnVtYmVyXykge1xuICAgICAgICAgICAgcmV0dXJuIG9iajtcbiAgICAgICAgfSBlbHNlIGlmICh0eXBlb2Ygb2JqID09PSBcIm51bWJlclwiICYmICFOdW1iZXIuaXNJbnRlZ2VyKG9iaikgfHwgb2JqIGluc3RhbmNlb2YgRGVjaW1hbCB8fCB0eXBlb2Ygb2JqID09PSBcInN0cmluZ1wiKSB7XG4gICAgICAgICAgICByZXR1cm4gbmV3IEZsb2F0KG9iaik7XG4gICAgICAgIH0gZWxzZSBpZiAoTnVtYmVyLmlzSW50ZWdlcihvYmopKSB7XG4gICAgICAgICAgICByZXR1cm4gbmV3IEludGVnZXIob2JqKTtcbiAgICAgICAgfSBlbHNlIGlmIChvYmoubGVuZ3RoID09PSAyKSB7XG4gICAgICAgICAgICByZXR1cm4gbmV3IFJhdGlvbmFsKG9ialswXSwgb2JqWzFdKTtcbiAgICAgICAgfSBlbHNlIGlmICh0eXBlb2Ygb2JqID09PSBcInN0cmluZ1wiKSB7XG4gICAgICAgICAgICBjb25zdCBfb2JqID0gb2JqLnRvTG93ZXJDYXNlKCk7XG4gICAgICAgICAgICBpZiAoX29iaiA9PT0gXCJuYW5cIikge1xuICAgICAgICAgICAgICAgIHJldHVybiBTLk5hTjtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoX29iaiA9PT0gXCJpbmZcIikge1xuICAgICAgICAgICAgICAgIHJldHVybiBTLkluZmluaXR5O1xuICAgICAgICAgICAgfSBlbHNlIGlmIChfb2JqID09PSBcIitpbmZcIikge1xuICAgICAgICAgICAgICAgIHJldHVybiBTLkluZmluaXR5O1xuICAgICAgICAgICAgfSBlbHNlIGlmIChfb2JqID09PSBcIi1pbmZcIikge1xuICAgICAgICAgICAgICAgIHJldHVybiBTLk5lZ2F0aXZlSW5maW5pdHk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcImFyZ3VtZW50IGZvciBudW1iZXIgaXMgaW52YWxpZFwiKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJhcmd1bWVudCBmb3IgbnVtYmVyIGlzIGludmFsaWRcIik7XG4gICAgfVxuXG4gICAgYXNfY29lZmZfTXVsKHJhdGlvbmFsOiBib29sZWFuID0gZmFsc2UpIHtcbiAgICAgICAgaWYgKHJhdGlvbmFsICYmICF0aGlzLmlzX1JhdGlvbmFsKSB7XG4gICAgICAgICAgICByZXR1cm4gW1MuT25lLCB0aGlzXTtcbiAgICAgICAgfVxuICAgICAgICBpZiAodGhpcykge1xuICAgICAgICAgICAgcmV0dXJuIFt0aGlzLCBTLk9uZV07XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gW1MuT25lLCB0aGlzXTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGFzX2NvZWZmX0FkZCgpIHtcbiAgICAgICAgcmV0dXJuIFt0aGlzLCBTLlplcm9dO1xuICAgIH1cblxuICAgIC8vIE5PVEU6IFRIRVNFIE1FVEhPRFMgQVJFIE5PVCBZRVQgSU1QTEVNRU5URUQgSU4gVEhFIFNVUEVSQ0xBU1NcblxuICAgIF9fYWRkX18ob3RoZXI6IGFueSkge1xuICAgICAgICBpZiAob3RoZXIgaW5zdGFuY2VvZiBfTnVtYmVyXyAmJiBnbG9iYWxfcGFyYW1ldGVycy5ldmFsdWF0ZSkge1xuICAgICAgICAgICAgaWYgKG90aGVyID09PSBTLk5hTikge1xuICAgICAgICAgICAgICAgIHJldHVybiBTLk5hTjtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAob3RoZXIgPT09IFMuSW5maW5pdHkpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gUy5JbmZpbml0eTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAob3RoZXIgPT09IFMuTmVnYXRpdmVJbmZpbml0eSkge1xuICAgICAgICAgICAgICAgIHJldHVybiBTLk5lZ2F0aXZlSW5maW5pdHk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHN1cGVyLl9fYWRkX18ob3RoZXIpO1xuICAgIH1cblxuICAgIF9fc3ViX18ob3RoZXI6IGFueSkge1xuICAgICAgICBpZiAob3RoZXIgaW5zdGFuY2VvZiBfTnVtYmVyXyAmJiBnbG9iYWxfcGFyYW1ldGVycy5ldmFsdWF0ZSkge1xuICAgICAgICAgICAgaWYgKG90aGVyID09PSBTLk5hTikge1xuICAgICAgICAgICAgICAgIHJldHVybiBTLk5hTjtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAob3RoZXIgPT09IFMuSW5maW5pdHkpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gUy5OZWdhdGl2ZUluZmluaXR5O1xuICAgICAgICAgICAgfSBlbHNlIGlmIChvdGhlciA9PT0gUy5OZWdhdGl2ZUluZmluaXR5KSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIFMuSW5maW5pdHk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHN1cGVyLl9fc3ViX18ob3RoZXIpO1xuICAgIH1cblxuICAgIF9fbXVsX18ob3RoZXI6IGFueSkge1xuICAgICAgICBpZiAob3RoZXIgaW5zdGFuY2VvZiBfTnVtYmVyXyAmJiBnbG9iYWxfcGFyYW1ldGVycy5ldmFsdWF0ZSkge1xuICAgICAgICAgICAgY29uc3QgY2xzOiBhbnkgPSB0aGlzLmNvbnN0cnVjdG9yO1xuICAgICAgICAgICAgaWYgKG90aGVyID09PSBTLk5hbikge1xuICAgICAgICAgICAgICAgIHJldHVybiBTLk5hbjtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAob3RoZXIgPT09IFMuSW5maW5pdHkpIHtcbiAgICAgICAgICAgICAgICBpZiAoY2xzLmlzX3plcm8pIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFMuTmFOO1xuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoY2xzLmlzX3Bvc2l0aXZlKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBTLkluZmluaXR5O1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBTLk5lZ2F0aXZlSW5maW5pdHk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSBlbHNlIGlmIChvdGhlciA9PT0gUy5OZWdhdGl2ZUluZmluaXR5KSB7XG4gICAgICAgICAgICAgICAgaWYgKGNscy5pc196ZXJvKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBTLk5hTjtcbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKGNscy5pc19wb3NpdGl2ZSkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gUy5OZWdhdGl2ZUluZmluaXR5O1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBTLkluZmluaXR5O1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gc3VwZXIuX19tdWxfXyhvdGhlcik7XG4gICAgfVxuICAgIF9fdHJ1ZWRpdl9fKG90aGVyOiBhbnkpIHtcbiAgICAgICAgaWYgKG90aGVyIGluc3RhbmNlb2YgX051bWJlcl8gJiYgZ2xvYmFsX3BhcmFtZXRlcnMuZXZhbHVhdGUpIHtcbiAgICAgICAgICAgIGlmIChvdGhlciA9PT0gUy5OYU4pIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gUy5OYU47XG4gICAgICAgICAgICB9IGVsc2UgaWYgKG90aGVyID09PSBTLkluZmluaXR5IHx8IG90aGVyID09PSBTLk5lZ2F0aXZlSW5maW5pdHkpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gUy5aZXJvO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBzdXBlci5fX3RydWVkaXZfXyhvdGhlcik7XG4gICAgfVxuXG4gICAgZXZhbF9ldmFsZihwcmVjOiBudW1iZXIpIHtcbiAgICAgICAgcmV0dXJuIG5ldyBGbG9hdCh0aGlzLl9mbG9hdF92YWwocHJlYyksIHByZWMpO1xuICAgIH1cblxuICAgIF9mbG9hdF92YWwocHJlYzogbnVtYmVyKTogYW55IHtcbiAgICAgICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgICB9XG59O1xuXG4vLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbmV3LWNhcFxuTWFuYWdlZFByb3BlcnRpZXMucmVnaXN0ZXIoX051bWJlcl8pO1xuR2xvYmFsLnJlZ2lzdGVyKFwiX051bWJlcl9cIiwgX051bWJlcl8ubmV3KTtcblxuY2xhc3MgRmxvYXQgZXh0ZW5kcyBfTnVtYmVyXyB7XG4gICAgLypcbiAgICAobm90IGNvcHlpbmcgc3ltcHkgY29tbWVudCBiZWNhdXNlIHRoaXMgaW1wbGVtZW50YXRpb24gaXMgdmVyeSBkaWZmZXJlbnQpXG4gICAgc2VlIGhlYWRlciBjb21tZW50IGZvciBjaGFuZ2VzXG4gICAgKi9cbiAgICBfX3Nsb3RzX186IGFueVtdID0gW1wiX21wZl9cIiwgXCJfcHJlY1wiXTtcbiAgICBfbXBmXzogW251bWJlciwgbnVtYmVyLCBudW1iZXIsIG51bWJlcl07XG4gICAgc3RhdGljIGlzX3JhdGlvbmFsOiBhbnkgPSB1bmRlZmluZWQ7XG4gICAgc3RhdGljIGlzX2lycmF0aW9uYWw6IGFueSA9IHVuZGVmaW5lZDtcbiAgICBzdGF0aWMgaXNfbnVtYmVyID0gdHJ1ZTtcbiAgICBzdGF0aWMgaXNfcmVhbCA9IHRydWU7XG4gICAgc3RhdGljIGlzX2V4dGVuZGVkX3JlYWwgPSB0cnVlO1xuICAgIHN0YXRpYyBpc19GbG9hdCA9IHRydWU7XG4gICAgZGVjaW1hbDogRGVjaW1hbDtcbiAgICBwcmVjOiBudW1iZXI7XG5cbiAgICBjb25zdHJ1Y3RvcihudW06IGFueSwgcHJlYzogYW55ID0gMTUpIHtcbiAgICAgICAgc3VwZXIoKTtcbiAgICAgICAgdGhpcy5wcmVjID0gcHJlYztcbiAgICAgICAgaWYgKHR5cGVvZiBudW0gIT09IFwidW5kZWZpbmVkXCIpIHtcbiAgICAgICAgICAgIGlmIChudW0gaW5zdGFuY2VvZiBGbG9hdCkge1xuICAgICAgICAgICAgICAgIHRoaXMuZGVjaW1hbCA9IG51bS5kZWNpbWFsO1xuICAgICAgICAgICAgfSBlbHNlIGlmIChudW0gaW5zdGFuY2VvZiBEZWNpbWFsKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5kZWNpbWFsID0gbnVtO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICB0aGlzLmRlY2ltYWwgPSBuZXcgRGVjaW1hbChudW0pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgX19hZGRfXyhvdGhlcjogYW55KSB7XG4gICAgICAgIGlmIChnbG9iYWxfcGFyYW1ldGVycy5ldmFsdWF0ZSAmJiBvdGhlciBpbnN0YW5jZW9mIF9OdW1iZXJfKSB7XG4gICAgICAgICAgICBjb25zdCB2YWwgPSBvdGhlci5fZmxvYXRfdmFsKHRoaXMucHJlYyk7XG4gICAgICAgICAgICByZXR1cm4gbmV3IEZsb2F0KERlY2ltYWwuc2V0KHtwcmVjaXNpb246IHRoaXMucHJlY30pLmFkZCh0aGlzLmRlY2ltYWwsIHZhbC5kZWNpbWFsKSwgdGhpcy5wcmVjKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gc3VwZXIuX19hZGRfXyhvdGhlcik7XG4gICAgfVxuXG4gICAgX19zdWJfXyhvdGhlcjogYW55KSB7XG4gICAgICAgIGlmIChnbG9iYWxfcGFyYW1ldGVycy5ldmFsdWF0ZSAmJiBvdGhlciBpbnN0YW5jZW9mIF9OdW1iZXJfKSB7XG4gICAgICAgICAgICBjb25zdCB2YWwgPSBvdGhlci5fZmxvYXRfdmFsKHRoaXMucHJlYyk7XG4gICAgICAgICAgICByZXR1cm4gbmV3IEZsb2F0KERlY2ltYWwuc2V0KHtwcmVjaXNpb246IHRoaXMucHJlY30pLnN1Yih0aGlzLmRlY2ltYWwsIHZhbC5kZWNpbWFsKSwgdGhpcy5wcmVjKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gc3VwZXIuX19zdWJfXyhvdGhlcik7XG4gICAgfVxuXG4gICAgX19tdWxfXyhvdGhlcjogYW55KSB7XG4gICAgICAgIGlmIChnbG9iYWxfcGFyYW1ldGVycy5ldmFsdWF0ZSAmJiBvdGhlciBpbnN0YW5jZW9mIF9OdW1iZXJfKSB7XG4gICAgICAgICAgICBjb25zdCB2YWwgPSBvdGhlci5fZmxvYXRfdmFsKHRoaXMucHJlYyk7XG4gICAgICAgICAgICByZXR1cm4gbmV3IEZsb2F0KERlY2ltYWwuc2V0KHtwcmVjaXNpb246IHRoaXMucHJlY30pLm11bCh0aGlzLmRlY2ltYWwsIHZhbC5kZWNpbWFsKSwgdGhpcy5wcmVjKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gc3VwZXIuX19tdWxfXyhvdGhlcik7XG4gICAgfVxuXG4gICAgX190cnVlZGl2X18ob3RoZXI6IGFueSkge1xuICAgICAgICBpZiAoZ2xvYmFsX3BhcmFtZXRlcnMuZXZhbHVhdGUgJiYgb3RoZXIgaW5zdGFuY2VvZiBfTnVtYmVyXykge1xuICAgICAgICAgICAgY29uc3QgdmFsID0gb3RoZXIuX2Zsb2F0X3ZhbCh0aGlzLnByZWMpO1xuICAgICAgICAgICAgcmV0dXJuIG5ldyBGbG9hdChEZWNpbWFsLnNldCh7cHJlY2lzaW9uOiB0aGlzLnByZWN9KS5kaXYodGhpcy5kZWNpbWFsLCB2YWwuZGVjaW1hbCksIHRoaXMucHJlYyk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHN1cGVyLl9fZGl2X18ob3RoZXIpO1xuICAgIH1cblxuICAgIF9ldmFsX2lzX25lZ2F0aXZlKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5kZWNpbWFsLmxlc3NUaGFuKDApO1xuICAgIH1cblxuICAgIF9ldmFsX2lzX3Bvc2l0aXZlKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5kZWNpbWFsLmdyZWF0ZXJUaGFuKDApO1xuICAgIH1cblxuICAgIC8vIHJldHVybiBuZXcgRmxvYXQoRGVjaW1hbC5zZXQoe3ByZWNpc2lvbjogdGhpcy5wcmVjfSkucG93KHRoaXMuZGVjaW1hbCwgb3RoZXIuZXZhbF9ldmFsZih0aGlzLnByZWMpLmRlY2ltYWwpLCB0aGlzLnByZWMpO1xuXG4gICAgX2V2YWxfcG93ZXIoZXhwdDogYW55KSB7XG4gICAgICAgIGlmICh0aGlzID09PSBTLlplcm8pIHtcbiAgICAgICAgICAgIGlmIChleHB0LmlzX2V4dGVuZGVkX3Bvc2l0aXZlKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICAgICAgICB9IGlmIChleHB0LmlzX2V4dGVuZGVkX25lZ2F0aXZlKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIFMuQ29tcGxleEluZmluaXR5O1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGlmIChleHB0IGluc3RhbmNlb2YgX051bWJlcl8pIHtcbiAgICAgICAgICAgIGlmIChleHB0IGluc3RhbmNlb2YgSW50ZWdlcikge1xuICAgICAgICAgICAgICAgIGNvbnN0IHByZWMgPSB0aGlzLnByZWM7XG4gICAgICAgICAgICAgICAgcmV0dXJuIG5ldyBGbG9hdChEZWNpbWFsLnNldCh7cHJlY2lzaW9uOiB0aGlzLnByZWN9KS5wb3codGhpcy5kZWNpbWFsLCBleHB0LnApLCBwcmVjKTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoZXhwdCBpbnN0YW5jZW9mIFJhdGlvbmFsICYmXG4gICAgICAgICAgICAgICAgZXhwdC5wID09PSAxICYmIGV4cHQucSAlIDIgIT09IDAgJiYgdGhpcy5pc19uZWdhdGl2ZSgpKSB7XG4gICAgICAgICAgICAgICAgY29uc3QgbmVncGFydCA9ICh0aGlzLl9fbXVsX18oUy5OZWdhdGl2ZU9uZSkpLl9ldmFsX3Bvd2VyKGV4cHQpO1xuICAgICAgICAgICAgICAgIHJldHVybiBuZXcgTXVsKHRydWUsIHRydWUsIG5lZ3BhcnQsIG5ldyBQb3coUy5OZWdhdGl2ZU9uZSwgZXhwdCwgZmFsc2UpKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGNvbnN0IHZhbCA9IGV4cHQuX2Zsb2F0X3ZhbCh0aGlzLnByZWMpLmRlY2ltYWw7XG4gICAgICAgICAgICBjb25zdCByZXMgPSBEZWNpbWFsLnNldCh7cHJlY2lzaW9uOiB0aGlzLnByZWN9KS5wb3codGhpcy5kZWNpbWFsLCB2YWwpO1xuICAgICAgICAgICAgaWYgKHJlcy5pc05hTigpKSB7XG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiY29tcGxleCBhbmQgaW1hZ2luYXJ5IG51bWJlcnMgbm90IHlldCBpbXBsZW1lbnRlZFwiKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiBuZXcgRmxvYXQocmVzKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIF9mbG9hdF92YWwocHJlYzogbnVtYmVyKTogYW55IHtcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuXG4gICAgaW52ZXJzZSgpIHtcbiAgICAgICAgcmV0dXJuIG5ldyBGbG9hdCgxLyh0aGlzLmRlY2ltYWwgYXMgYW55KSk7XG4gICAgfVxuXG4gICAgX2V2YWxfaXNfZmluaXRlKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5kZWNpbWFsLmlzRmluaXRlKCk7XG4gICAgfVxufVxuXG5NYW5hZ2VkUHJvcGVydGllcy5yZWdpc3RlcihGbG9hdCk7XG5cblxuY2xhc3MgUmF0aW9uYWwgZXh0ZW5kcyBfTnVtYmVyXyB7XG4gICAgc3RhdGljIGlzX3JlYWwgPSB0cnVlO1xuICAgIHN0YXRpYyBpc19pbnRlZ2VyID0gZmFsc2U7XG4gICAgc3RhdGljIGlzX3JhdGlvbmFsID0gdHJ1ZTtcbiAgICBzdGF0aWMgaXNfbnVtYmVyID0gdHJ1ZTtcbiAgICBwOiBudW1iZXI7XG4gICAgcTogbnVtYmVyO1xuICAgIF9fc2xvdHNfXzogYW55W10gPSBbXCJwXCIsIFwicVwiXTtcblxuICAgIHN0YXRpYyBpc19SYXRpb25hbCA9IHRydWU7XG5cblxuICAgIGNvbnN0cnVjdG9yKHA6IGFueSwgcTogYW55ID0gdW5kZWZpbmVkLCBnY2Q6IG51bWJlciA9IHVuZGVmaW5lZCwgc2ltcGxpZnk6IGJvb2xlYW4gPSB0cnVlKSB7XG4gICAgICAgIHN1cGVyKCk7XG4gICAgICAgIGlmICh0eXBlb2YgcSA9PT0gXCJ1bmRlZmluZWRcIikge1xuICAgICAgICAgICAgaWYgKHAgaW5zdGFuY2VvZiBSYXRpb25hbCkge1xuICAgICAgICAgICAgICAgIHJldHVybiBwO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBpZiAodHlwZW9mIHAgPT09IFwibnVtYmVyXCIgJiYgcCAlIDEgIT09IDApIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIG5ldyBSYXRpb25hbCh0b1JhdGlvKHAsIDAuMDAwMSkpO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7fVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcSA9IDE7XG4gICAgICAgICAgICBnY2QgPSAxO1xuICAgICAgICB9XG4gICAgICAgIGlmICghTnVtYmVyLmlzSW50ZWdlcihwKSkge1xuICAgICAgICAgICAgcCA9IG5ldyBSYXRpb25hbChwKTtcbiAgICAgICAgICAgIHEgKj0gcC5xO1xuICAgICAgICAgICAgcCA9IHAucDtcbiAgICAgICAgfVxuICAgICAgICBpZiAoIU51bWJlci5pc0ludGVnZXIocSkpIHtcbiAgICAgICAgICAgIHEgPSBuZXcgUmF0aW9uYWwocSk7XG4gICAgICAgICAgICBwICo9IHEucTtcbiAgICAgICAgICAgIHEgPSBxLnA7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHEgPT09IDApIHtcbiAgICAgICAgICAgIGlmIChwID09PSAwKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIFMuTmFuO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIFMuQ29tcGxleEluZmluaXR5O1xuICAgICAgICB9XG4gICAgICAgIGlmIChxIDwgMCkge1xuICAgICAgICAgICAgcSA9IC1xO1xuICAgICAgICAgICAgcCA9IC1wO1xuICAgICAgICB9XG4gICAgICAgIGlmICh0eXBlb2YgZ2NkID09PSBcInVuZGVmaW5lZFwiKSB7XG4gICAgICAgICAgICBnY2QgPSBpZ2NkKE1hdGguYWJzKHApLCBxKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoZ2NkID4gMSkge1xuICAgICAgICAgICAgcCA9IHAvZ2NkO1xuICAgICAgICAgICAgcSA9IHEvZ2NkO1xuICAgICAgICB9XG4gICAgICAgIGlmIChxID09PSAxICYmIHNpbXBsaWZ5KSB7XG4gICAgICAgICAgICByZXR1cm4gbmV3IEludGVnZXIocCk7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5wID0gcDtcbiAgICAgICAgdGhpcy5xID0gcTtcbiAgICB9XG5cbiAgICBoYXNoS2V5KCkge1xuICAgICAgICByZXR1cm4gdGhpcy5jb25zdHJ1Y3Rvci5uYW1lICsgdGhpcy5wICsgdGhpcy5xO1xuICAgIH1cblxuICAgIF9fYWRkX18ob3RoZXI6IGFueSkge1xuICAgICAgICBpZiAoZ2xvYmFsX3BhcmFtZXRlcnMuZXZhbHVhdGUpIHtcbiAgICAgICAgICAgIGlmIChvdGhlciBpbnN0YW5jZW9mIEludGVnZXIpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gbmV3IFJhdGlvbmFsKHRoaXMucCArIHRoaXMucSAqIG90aGVyLnAsIHRoaXMucSwgMSk7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKG90aGVyIGluc3RhbmNlb2YgUmF0aW9uYWwpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gbmV3IFJhdGlvbmFsKHRoaXMucCAqIG90aGVyLnEgKyB0aGlzLnEgKiBvdGhlci5wLCB0aGlzLnEgKiBvdGhlci5xKTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAob3RoZXIgaW5zdGFuY2VvZiBGbG9hdCkge1xuICAgICAgICAgICAgICAgIHJldHVybiBvdGhlci5fX2FkZF9fKHRoaXMpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gc3VwZXIuX19hZGRfXyhvdGhlcik7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHN1cGVyLl9fYWRkX18ob3RoZXIpO1xuICAgIH1cblxuICAgIF9fcmFkZF9fKG90aGVyOiBhbnkpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX19hZGRfXyhvdGhlcik7XG4gICAgfVxuXG4gICAgX19zdWJfXyhvdGhlcjogYW55KSB7XG4gICAgICAgIGlmIChnbG9iYWxfcGFyYW1ldGVycy5ldmFsdWF0ZSkge1xuICAgICAgICAgICAgaWYgKG90aGVyIGluc3RhbmNlb2YgSW50ZWdlcikge1xuICAgICAgICAgICAgICAgIHJldHVybiBuZXcgUmF0aW9uYWwodGhpcy5xICogb3RoZXIucCAtIHRoaXMucCwgdGhpcy5xLCAxKTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAob3RoZXIgaW5zdGFuY2VvZiBSYXRpb25hbCkge1xuICAgICAgICAgICAgICAgIHJldHVybiBuZXcgUmF0aW9uYWwodGhpcy5wICogb3RoZXIucSAtIHRoaXMucSAqIG90aGVyLnAsIHRoaXMucSAqIG90aGVyLnEpO1xuICAgICAgICAgICAgfSBlbHNlIGlmIChvdGhlciBpbnN0YW5jZW9mIEZsb2F0KSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuX19tdWxfXyhTLk5lZ2F0aXZlT25lKS5fX2FkZF9fKG90aGVyKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHN1cGVyLl9fc3ViX18ob3RoZXIpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBzdXBlci5fX3N1Yl9fKG90aGVyKTtcbiAgICB9XG5cbiAgICBfX3JzdWJfXyhvdGhlcjogYW55KSB7XG4gICAgICAgIGlmIChnbG9iYWxfcGFyYW1ldGVycy5ldmFsdWF0ZSkge1xuICAgICAgICAgICAgaWYgKG90aGVyIGluc3RhbmNlb2YgSW50ZWdlcikge1xuICAgICAgICAgICAgICAgIHJldHVybiBuZXcgUmF0aW9uYWwodGhpcy5wIC0gdGhpcy5xICogb3RoZXIucCwgdGhpcy5xLCAxKTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAob3RoZXIgaW5zdGFuY2VvZiBSYXRpb25hbCkge1xuICAgICAgICAgICAgICAgIHJldHVybiBuZXcgUmF0aW9uYWwodGhpcy5xICogb3RoZXIucCAtIHRoaXMucCAqIG90aGVyLnEsIHRoaXMucSAqIG90aGVyLnEpO1xuICAgICAgICAgICAgfSBlbHNlIGlmIChvdGhlciBpbnN0YW5jZW9mIEZsb2F0KSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIG90aGVyLl9fbXVsX18oUy5OZWdhdGl2ZU9uZSkuX19hZGRfXyh0aGlzKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHN1cGVyLl9fcnN1Yl9fKG90aGVyKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gc3VwZXIuX19yc3ViX18ob3RoZXIpO1xuICAgIH1cblxuICAgIF9fbXVsX18ob3RoZXI6IGFueSkge1xuICAgICAgICBpZiAoZ2xvYmFsX3BhcmFtZXRlcnMuZXZhbHVhdGUpIHtcbiAgICAgICAgICAgIGlmIChvdGhlciBpbnN0YW5jZW9mIEludGVnZXIpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gbmV3IFJhdGlvbmFsKHRoaXMucCAqIG90aGVyLnAsIHRoaXMucSwgaWdjZChvdGhlci5wLCB0aGlzLnEpKTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAob3RoZXIgaW5zdGFuY2VvZiBSYXRpb25hbCkge1xuICAgICAgICAgICAgICAgIHJldHVybiBuZXcgUmF0aW9uYWwodGhpcy5wICogb3RoZXIucCwgdGhpcy5xICogb3RoZXIucSwgaWdjZCh0aGlzLnAsIG90aGVyLnEpICogaWdjZCh0aGlzLnEsIG90aGVyLnApKTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAob3RoZXIgaW5zdGFuY2VvZiBGbG9hdCkge1xuICAgICAgICAgICAgICAgIHJldHVybiBvdGhlci5fX211bF9fKHRoaXMpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gc3VwZXIuX19tdWxfXyhvdGhlcik7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHN1cGVyLl9fbXVsX18ob3RoZXIpO1xuICAgIH1cblxuICAgIF9fcm11bF9fKG90aGVyOiBhbnkpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX19tdWxfXyhvdGhlcik7XG4gICAgfVxuXG4gICAgX190cnVlZGl2X18ob3RoZXI6IGFueSkge1xuICAgICAgICBpZiAoZ2xvYmFsX3BhcmFtZXRlcnMuZXZhbHVhdGUpIHtcbiAgICAgICAgICAgIGlmIChvdGhlciBpbnN0YW5jZW9mIEludGVnZXIpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gbmV3IFJhdGlvbmFsKHRoaXMucCwgdGhpcy5xICogb3RoZXIucCwgaWdjZCh0aGlzLnAsIG90aGVyLnApKTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAob3RoZXIgaW5zdGFuY2VvZiBSYXRpb25hbCkge1xuICAgICAgICAgICAgICAgIHJldHVybiBuZXcgUmF0aW9uYWwodGhpcy5wICogb3RoZXIucSwgdGhpcy5xICogb3RoZXIucCwgaWdjZCh0aGlzLnAsIG90aGVyLnApICogaWdjZCh0aGlzLnEsIG90aGVyLnEpKTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAob3RoZXIgaW5zdGFuY2VvZiBGbG9hdCkge1xuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLl9fbXVsX18ob3RoZXIuaW52ZXJzZSgpKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHN1cGVyLl9fdHJ1ZWRpdl9fKG90aGVyKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gc3VwZXIuX190cnVlZGl2X18ob3RoZXIpO1xuICAgIH1cblxuICAgIF9fcnRydWVkaXZfXyhvdGhlcjogYW55KSB7XG4gICAgICAgIGlmIChnbG9iYWxfcGFyYW1ldGVycy5ldmFsdWF0ZSkge1xuICAgICAgICAgICAgaWYgKG90aGVyIGluc3RhbmNlb2YgSW50ZWdlcikge1xuICAgICAgICAgICAgICAgIHJldHVybiBuZXcgUmF0aW9uYWwob3RoZXIucCAqIHRoaXMucSwgdGhpcy5wLCBpZ2NkKHRoaXMucCwgb3RoZXIucCkpO1xuICAgICAgICAgICAgfSBlbHNlIGlmIChvdGhlciBpbnN0YW5jZW9mIFJhdGlvbmFsKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIG5ldyBSYXRpb25hbChvdGhlci5wICogdGhpcy5xLCBvdGhlci5xICogdGhpcy5wLCBpZ2NkKHRoaXMucCwgb3RoZXIucCkgKiBpZ2NkKHRoaXMucSwgb3RoZXIucSkpO1xuICAgICAgICAgICAgfSBlbHNlIGlmIChvdGhlciBpbnN0YW5jZW9mIEZsb2F0KSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIG90aGVyLl9fbXVsX18oUy5PbmUuX190cnVlZGl2X18odGhpcykpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gc3VwZXIuX19ydHJ1ZWRpdl9fKG90aGVyKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gc3VwZXIuX19ydHJ1ZWRpdl9fKG90aGVyKTtcbiAgICB9XG5cblxuICAgIF9ldmFsX3Bvd2VyKGV4cHQ6IGFueSkge1xuICAgICAgICBpZiAoZXhwdCBpbnN0YW5jZW9mIF9OdW1iZXJfKSB7XG4gICAgICAgICAgICBpZiAoZXhwdCBpbnN0YW5jZW9mIEZsb2F0KSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuZXZhbF9ldmFsZihleHB0LnByZWMpLl9ldmFsX3Bvd2VyKGV4cHQpO1xuICAgICAgICAgICAgfSBlbHNlIGlmIChleHB0IGluc3RhbmNlb2YgSW50ZWdlcikge1xuICAgICAgICAgICAgICAgIHJldHVybiBuZXcgUmF0aW9uYWwodGhpcy5wICoqIGV4cHQucCwgdGhpcy5xICoqIGV4cHQucCwgMSk7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKGV4cHQgaW5zdGFuY2VvZiBSYXRpb25hbCkge1xuICAgICAgICAgICAgICAgIGxldCBpbnRwYXJ0ID0gTWF0aC5mbG9vcihleHB0LnAgLyBleHB0LnEpO1xuICAgICAgICAgICAgICAgIGlmIChpbnRwYXJ0KSB7XG4gICAgICAgICAgICAgICAgICAgIGludHBhcnQrKztcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgcmVtZnJhY3BhcnQgPSBpbnRwYXJ0ICogZXhwdC5xIC0gZXhwdC5wO1xuICAgICAgICAgICAgICAgICAgICBjb25zdCByYXRmcmFjcGFydCA9IG5ldyBSYXRpb25hbChyZW1mcmFjcGFydCwgZXhwdC5xKTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXMucCAhPT0gMSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG1heC1sZW5cbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBuZXcgSW50ZWdlcih0aGlzLnApLl9ldmFsX3Bvd2VyKGV4cHQpLl9fbXVsX18obmV3IEludGVnZXIodGhpcy5xKSkuX2V2YWxfcG93ZXIocmF0ZnJhY3BhcnQpLl9fbXVsX18obmV3IFJhdGlvbmFsKDEsIHRoaXMucSAqKiBpbnRwYXJ0LCAxKSk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIG5ldyBJbnRlZ2VyKHRoaXMucSkuX2V2YWxfcG93ZXIocmF0ZnJhY3BhcnQpLl9fbXVsX18obmV3IFJhdGlvbmFsKDEsIHRoaXMucSAqKiBpbnRwYXJ0LCAxKSk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgcmVtZnJhY3BhcnQgPSBleHB0LnEgLSBleHB0LnA7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHJhdGZyYWNwYXJ0ID0gbmV3IFJhdGlvbmFsKHJlbWZyYWNwYXJ0LCBleHB0LnEpO1xuICAgICAgICAgICAgICAgICAgICBpZiAodGhpcy5wICE9PSAxKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbWF4LWxlblxuICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgcDEgPSBuZXcgSW50ZWdlcih0aGlzLnApLl9ldmFsX3Bvd2VyKGV4cHQpO1xuICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgcDIgPSBuZXcgSW50ZWdlcih0aGlzLnEpLl9ldmFsX3Bvd2VyKHJhdGZyYWNwYXJ0KTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBwMS5fX211bF9fKHAyKS5fX211bF9fKG5ldyBSYXRpb25hbCgxLCB0aGlzLnEsIDEpKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gbmV3IEludGVnZXIodGhpcy5xKS5fZXZhbF9wb3dlcihyYXRmcmFjcGFydCkuX19tdWxfXyhuZXcgUmF0aW9uYWwoMSwgdGhpcy5xLCAxKSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgYXNfY29lZmZfQWRkKCkge1xuICAgICAgICByZXR1cm4gW3RoaXMsIFMuWmVyb107XG4gICAgfVxuXG4gICAgX2Zsb2F0X3ZhbChwcmVjOiBudW1iZXIpOiBhbnkge1xuICAgICAgICBjb25zdCBhID0gbmV3IERlY2ltYWwodGhpcy5wKTtcbiAgICAgICAgY29uc3QgYiA9IG5ldyBEZWNpbWFsKHRoaXMucSk7XG4gICAgICAgIHJldHVybiBuZXcgRmxvYXQoRGVjaW1hbC5zZXQoe3ByZWNpc2lvbjogcHJlY30pLmRpdihhLCBiKSk7XG4gICAgfVxuICAgIF9hc19udW1lcl9kZW5vbSgpIHtcbiAgICAgICAgcmV0dXJuIFtuZXcgSW50ZWdlcih0aGlzLnApLCBuZXcgSW50ZWdlcih0aGlzLnEpXTtcbiAgICB9XG5cbiAgICBmYWN0b3JzKGxpbWl0OiBhbnkgPSB1bmRlZmluZWQpIHtcbiAgICAgICAgcmV0dXJuIGZhY3RvcnJhdCh0aGlzLCBsaW1pdCk7XG4gICAgfVxuXG4gICAgX2V2YWxfaXNfbmVnYXRpdmUoKSB7XG4gICAgICAgIGlmICh0aGlzLnAgPCAwICYmIHRoaXMucSA+IDApIHtcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgX2V2YWxfaXNfcG9zaXRpdmUoKSB7XG4gICAgICAgIHJldHVybiAhdGhpcy5fZXZhbF9pc19uZWdhdGl2ZTtcbiAgICB9XG5cbiAgICBfZXZhbF9pc19vZGQoKSB7XG4gICAgICAgIGNvbnNvbGUubG9nKFwiaGVsbG9cIik7XG4gICAgICAgIGNvbnNvbGUubG9nKHRoaXMpO1xuICAgICAgICByZXR1cm4gdGhpcy5wICUgMiAhPT0gMDtcbiAgICB9XG5cbiAgICBfZXZhbF9pc19ldmVuKCkge1xuICAgICAgICBjb25zb2xlLmxvZyhcImV2YWwgZXZlblwiKVxuICAgICAgICByZXR1cm4gdGhpcy5wICUgMiA9PT0gMDtcbiAgICB9XG5cbiAgICBfZXZhbF9pc19maW5pdGUoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLnAgPT09IFMuSW5maW5pdHkgfHwgdGhpcy5wID09PSBTLk5lZ2F0aXZlSW5maW5pdHk7XG4gICAgfVxuXG4gICAgZXEob3RoZXI6IFJhdGlvbmFsKSB7XG4gICAgICAgIHJldHVybiB0aGlzLnAgPT09IG90aGVyLnAgJiYgdGhpcy5xID09PSBvdGhlci5xO1xuICAgIH1cbn07XG5cbi8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBuZXctY2FwXG5NYW5hZ2VkUHJvcGVydGllcy5yZWdpc3RlcihSYXRpb25hbCk7XG5cbmNsYXNzIEludGVnZXIgZXh0ZW5kcyBSYXRpb25hbCB7XG4gICAgLypcbiAgICBSZXByZXNlbnRzIGludGVnZXIgbnVtYmVycyBvZiBhbnkgc2l6ZS5cbiAgICBFeGFtcGxlc1xuICAgID09PT09PT09XG4gICAgPj4+IGZyb20gc3ltcHkgaW1wb3J0IEludGVnZXJcbiAgICA+Pj4gSW50ZWdlcigzKVxuICAgIDNcbiAgICBJZiBhIGZsb2F0IG9yIGEgcmF0aW9uYWwgaXMgcGFzc2VkIHRvIEludGVnZXIsIHRoZSBmcmFjdGlvbmFsIHBhcnRcbiAgICB3aWxsIGJlIGRpc2NhcmRlZDsgdGhlIGVmZmVjdCBpcyBvZiByb3VuZGluZyB0b3dhcmQgemVyby5cbiAgICA+Pj4gSW50ZWdlcigzLjgpXG4gICAgM1xuICAgID4+PiBJbnRlZ2VyKC0zLjgpXG4gICAgLTNcbiAgICBBIHN0cmluZyBpcyBhY2NlcHRhYmxlIGlucHV0IGlmIGl0IGNhbiBiZSBwYXJzZWQgYXMgYW4gaW50ZWdlcjpcbiAgICA+Pj4gSW50ZWdlcihcIjlcIiAqIDIwKVxuICAgIDk5OTk5OTk5OTk5OTk5OTk5OTk5XG4gICAgSXQgaXMgcmFyZWx5IG5lZWRlZCB0byBleHBsaWNpdGx5IGluc3RhbnRpYXRlIGFuIEludGVnZXIsIGJlY2F1c2VcbiAgICBQeXRob24gaW50ZWdlcnMgYXJlIGF1dG9tYXRpY2FsbHkgY29udmVydGVkIHRvIEludGVnZXIgd2hlbiB0aGV5XG4gICAgYXJlIHVzZWQgaW4gU3ltUHkgZXhwcmVzc2lvbnMuXG4gICAgXCJcIlwiXG4gICAgKi9cbiAgICBzdGF0aWMgaXNfaW50ZWdlciA9IHRydWU7XG4gICAgc3RhdGljIGlzX0ludGVnZXIgPSB0cnVlO1xuICAgIF9fc2xvdHNfXzogYW55W10gPSBbXTtcbiAgICBjb25zdHJ1Y3RvcihwOiBudW1iZXIpIHtcbiAgICAgICAgc3VwZXIocCwgdW5kZWZpbmVkLCB1bmRlZmluZWQsIGZhbHNlKTtcbiAgICAgICAgdGhpcy5wID0gcDtcbiAgICAgICAgaWYgKHAgPT09IDEpIHtcbiAgICAgICAgICAgIHJldHVybiBTLk9uZTtcbiAgICAgICAgfSBlbHNlIGlmIChwID09PSAwKSB7XG4gICAgICAgICAgICByZXR1cm4gUy5aZXJvO1xuICAgICAgICB9IGVsc2UgaWYgKHAgPT09IC0xKSB7XG4gICAgICAgICAgICByZXR1cm4gUy5OZWdhdGl2ZU9uZTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGZhY3RvcnMobGltaXQ6IGFueSA9IHVuZGVmaW5lZCkge1xuICAgICAgICByZXR1cm4gZmFjdG9yaW50KHRoaXMucCwgbGltaXQpO1xuICAgIH1cblxuICAgIF9fYWRkX18ob3RoZXI6IGFueSk6IGFueSB7XG4gICAgICAgIGlmIChnbG9iYWxfcGFyYW1ldGVycy5ldmFsdWF0ZSkge1xuICAgICAgICAgICAgaWYgKE51bWJlci5pc0ludGVnZXIob3RoZXIpKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIG5ldyBJbnRlZ2VyKHRoaXMucCArIG90aGVyKTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAob3RoZXIgaW5zdGFuY2VvZiBJbnRlZ2VyKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIG5ldyBJbnRlZ2VyKHRoaXMucCArIG90aGVyLnApO1xuICAgICAgICAgICAgfSBlbHNlIGlmIChvdGhlciBpbnN0YW5jZW9mIFJhdGlvbmFsKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIG5ldyBSYXRpb25hbCh0aGlzLnAgKiBvdGhlci5xICsgb3RoZXIucCwgb3RoZXIucSwgMSk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHJldHVybiBzdXBlci5fX2FkZF9fKG90aGVyKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiBuZXcgQWRkKHRydWUsIHRydWUsIHRoaXMsIG90aGVyKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIF9fcmFkZF9fKG90aGVyOiBhbnkpOiBhbnkge1xuICAgICAgICBpZiAoZ2xvYmFsX3BhcmFtZXRlcnMuZXZhbHVhdGUpIHtcbiAgICAgICAgICAgIGlmIChOdW1iZXIuaXNJbnRlZ2VyKG90aGVyKSkge1xuICAgICAgICAgICAgICAgIHJldHVybiBuZXcgSW50ZWdlcihvdGhlciArIHRoaXMucCk7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKG90aGVyIGluc3RhbmNlb2YgUmF0aW9uYWwpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gbmV3IFJhdGlvbmFsKG90aGVyLnAgKyB0aGlzLnAgKiBvdGhlci5xLCBvdGhlci5xLCAxKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHN1cGVyLl9fcmFkZF9fKG90aGVyKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiBzdXBlci5fX3JhZGRfXyhvdGhlcik7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBfX3N1Yl9fKG90aGVyOiBhbnkpOiBhbnkge1xuICAgICAgICBpZiAoZ2xvYmFsX3BhcmFtZXRlcnMuZXZhbHVhdGUpIHtcbiAgICAgICAgICAgIGlmIChOdW1iZXIuaXNJbnRlZ2VyKG90aGVyKSkge1xuICAgICAgICAgICAgICAgIHJldHVybiBuZXcgSW50ZWdlcih0aGlzLnAgLSBvdGhlcik7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKG90aGVyIGluc3RhbmNlb2YgSW50ZWdlcikge1xuICAgICAgICAgICAgICAgIHJldHVybiBuZXcgSW50ZWdlcih0aGlzLnAgLSBvdGhlci5wKTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAob3RoZXIgaW5zdGFuY2VvZiBSYXRpb25hbCkge1xuICAgICAgICAgICAgICAgIHJldHVybiBuZXcgUmF0aW9uYWwodGhpcy5wICogb3RoZXIucSAtIG90aGVyLnAsIG90aGVyLnEsIDEpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gc3VwZXIuX19zdWJfXyhvdGhlcik7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gc3VwZXIuX19zdWJfXyhvdGhlcik7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBfX3JzdWJfXyhvdGhlcjogYW55KTogYW55IHtcbiAgICAgICAgaWYgKGdsb2JhbF9wYXJhbWV0ZXJzLmV2YWx1YXRlKSB7XG4gICAgICAgICAgICBpZiAoTnVtYmVyLmlzSW50ZWdlcihvdGhlcikpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gbmV3IEludGVnZXIodGhpcy5wIC0gb3RoZXIpO1xuICAgICAgICAgICAgfSBlbHNlIGlmIChvdGhlciBpbnN0YW5jZW9mIFJhdGlvbmFsKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIG5ldyBSYXRpb25hbChvdGhlci5wIC0gdGhpcy5wICogb3RoZXIucSwgb3RoZXIucSwgMSk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHJldHVybiBzdXBlci5fX3JzdWJfXyhvdGhlcik7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gc3VwZXIuX19yc3ViX18ob3RoZXIpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgX19tdWxfXyhvdGhlcjogYW55KTogYW55IHtcbiAgICAgICAgaWYgKGdsb2JhbF9wYXJhbWV0ZXJzLmV2YWx1YXRlKSB7XG4gICAgICAgICAgICBpZiAoTnVtYmVyLmlzSW50ZWdlcihvdGhlcikgKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIG5ldyBJbnRlZ2VyKHRoaXMucCAqIG90aGVyKTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAob3RoZXIgaW5zdGFuY2VvZiBJbnRlZ2VyKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIG5ldyBJbnRlZ2VyKHRoaXMucCAqIG90aGVyLnApO1xuICAgICAgICAgICAgfSBlbHNlIGlmIChvdGhlciBpbnN0YW5jZW9mIFJhdGlvbmFsKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIG5ldyBSYXRpb25hbCh0aGlzLnAgKiBvdGhlci5wLCBvdGhlci5xLCBpZ2NkKHRoaXMucCwgb3RoZXIucSkpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gc3VwZXIuX19tdWxfXyhvdGhlcik7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gc3VwZXIuX19tdWxfXyhvdGhlcik7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBfX3JtdWxfXyhvdGhlcjogYW55KTogYW55IHtcbiAgICAgICAgaWYgKGdsb2JhbF9wYXJhbWV0ZXJzLmV2YWx1YXRlKSB7XG4gICAgICAgICAgICBpZiAoTnVtYmVyLmlzSW50ZWdlcihvdGhlcikgKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIG5ldyBJbnRlZ2VyKG90aGVyICogdGhpcy5wKTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAob3RoZXIgaW5zdGFuY2VvZiBSYXRpb25hbCkge1xuICAgICAgICAgICAgICAgIHJldHVybiBuZXcgUmF0aW9uYWwob3RoZXIucCAqIHRoaXMucCwgb3RoZXIucSwgaWdjZCh0aGlzLnAsIG90aGVyLnEpKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHN1cGVyLl9fcm11bF9fKG90aGVyKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiBzdXBlci5fX3JtdWxfXyhvdGhlcik7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBfZXZhbF9pc19uZWdhdGl2ZSgpIHtcbiAgICAgICAgY29uc29sZS5sb2coXCJldmFsIG5lZ2F0aXZlXCIpXG4gICAgICAgIHJldHVybiB0aGlzLnAgPCAwO1xuICAgIH1cblxuICAgIF9ldmFsX2lzX3Bvc2l0aXZlKCkge1xuICAgICAgICBjb25zb2xlLmxvZyhcImV2YWwgcG9zaXRpdmVcIilcbiAgICAgICAgcmV0dXJuIHRoaXMucCA+IDA7XG4gICAgfVxuXG4gICAgX2V2YWxfaXNfb2RkKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5wICUgMiA9PT0gMTtcbiAgICB9XG5cbiAgICBfZXZhbF9wb3dlcihleHB0OiBhbnkpOiBhbnkge1xuICAgICAgICBpZiAoZXhwdCA9PT0gUy5JbmZpbml0eSkge1xuICAgICAgICAgICAgaWYgKHRoaXMucCA+IDEpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gUy5JbmZpbml0eTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBpZiAoZXhwdCA9PT0gUy5OZWdhdGl2ZUluZmluaXR5KSB7XG4gICAgICAgICAgICByZXR1cm4gbmV3IFJhdGlvbmFsKDEsIHRoaXMsIDEpLl9ldmFsX3Bvd2VyKFMuSW5maW5pdHkpO1xuICAgICAgICB9XG4gICAgICAgIGlmICghKGV4cHQgaW5zdGFuY2VvZiBfTnVtYmVyXykpIHtcbiAgICAgICAgICAgIGlmICh0aGlzLmlzX25lZ2F0aXZlICYmIGV4cHQuaXNfZXZlbikge1xuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLl9fbXVsX18oUy5OZWdhdGl2ZU9uZSkuX2V2YWxfcG93ZXIoZXhwdCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGV4cHQgaW5zdGFuY2VvZiBGbG9hdCkge1xuICAgICAgICAgICAgcmV0dXJuIHN1cGVyLl9ldmFsX3Bvd2VyKGV4cHQpO1xuICAgICAgICB9XG4gICAgICAgIGlmICghKGV4cHQgaW5zdGFuY2VvZiBSYXRpb25hbCkpIHtcbiAgICAgICAgICAgIHJldHVybiB1bmRlZmluZWQ7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGV4cHQuaXNfbmVnYXRpdmUoKSkge1xuICAgICAgICAgICAgY29uc3QgbmUgPSBleHB0Ll9fbXVsX18oUy5OZWdhdGl2ZU9uZSk7XG4gICAgICAgICAgICBpZiAodGhpcy5pc19uZWdhdGl2ZSgpKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIFMuTmVnYXRpdmVPbmUuX2V2YWxfcG93ZXIoZXhwdCkuX19tdWxfXyhuZXcgUmF0aW9uYWwoMSwgdGhpcy5fX211bF9fKFMuTmVnYXRpdmVPbmUpLCAxKSkuX2V2YWxfcG93ZXIobmUpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gbmV3IFJhdGlvbmFsKDEsIHRoaXMucCwgMSkuX2V2YWxfcG93ZXIobmUpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGNvbnN0IFt4LCB4ZXhhY3RdID0gaW50X250aHJvb3QoTWF0aC5hYnModGhpcy5wKSwgZXhwdC5xKTtcbiAgICAgICAgaWYgKHhleGFjdCkge1xuICAgICAgICAgICAgbGV0IHJlc3VsdCA9IG5ldyBJbnRlZ2VyKCh4IGFzIG51bWJlcikqKk1hdGguYWJzKGV4cHQucCkpO1xuICAgICAgICAgICAgaWYgKHRoaXMuaXNfbmVnYXRpdmUoKSkge1xuICAgICAgICAgICAgICAgIHJlc3VsdCA9IHJlc3VsdC5fX211bF9fKFMuTmVnYXRpdmVPbmUuX2V2YWxfcG93ZXIoZXhwdCkpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICAgICAgfVxuICAgICAgICBjb25zdCBiX3BvcyA9IE1hdGguYWJzKHRoaXMucCk7XG4gICAgICAgIGNvbnN0IHAgPSBwZXJmZWN0X3Bvd2VyKGJfcG9zKTtcbiAgICAgICAgbGV0IGRpY3QgPSBuZXcgSGFzaERpY3QoKTtcbiAgICAgICAgaWYgKHAgIT09IGZhbHNlKSB7XG4gICAgICAgICAgICBkaWN0LmFkZChwWzBdLCBwWzFdKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGRpY3QgPSBuZXcgSW50ZWdlcihiX3BvcykuZmFjdG9ycygyKioxNSk7XG4gICAgICAgIH1cblxuICAgICAgICBsZXQgb3V0X2ludCA9IDE7XG4gICAgICAgIGxldCBvdXRfcmFkOiBJbnRlZ2VyID0gUy5PbmU7XG4gICAgICAgIGxldCBzcXJfaW50ID0gMTtcbiAgICAgICAgbGV0IHNxcl9nY2QgPSAwO1xuICAgICAgICBjb25zdCBzcXJfZGljdCA9IG5ldyBIYXNoRGljdCgpO1xuICAgICAgICBsZXQgcHJpbWU7IGxldCBleHBvbmVudDtcbiAgICAgICAgZm9yIChbcHJpbWUsIGV4cG9uZW50XSBvZiBkaWN0LmVudHJpZXMoKSkge1xuICAgICAgICAgICAgZXhwb25lbnQgKj0gZXhwdC5wO1xuICAgICAgICAgICAgY29uc3QgW2Rpdl9lLCBkaXZfbV0gPSBkaXZtb2QoZXhwb25lbnQsIGV4cHQucSk7XG4gICAgICAgICAgICBpZiAoZGl2X2UgPiAwKSB7XG4gICAgICAgICAgICAgICAgb3V0X2ludCAqPSBwcmltZSoqZGl2X2U7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoZGl2X20gPiAwKSB7XG4gICAgICAgICAgICAgICAgY29uc3QgZyA9IGlnY2QoZGl2X20sIGV4cHQucSk7XG4gICAgICAgICAgICAgICAgaWYgKGcgIT09IDEpIHtcbiAgICAgICAgICAgICAgICAgICAgb3V0X3JhZCA9IG91dF9yYWQuX19tdWxfXyhuZXcgUG93KHByaW1lLCBuZXcgUmF0aW9uYWwoTWF0aC5mbG9vcihkaXZfbS9nKSwgTWF0aC5mbG9vcihleHB0LnEvZyksIDEpKSk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgc3FyX2RpY3QuYWRkKHByaW1lLCBkaXZfbSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGZvciAoY29uc3QgWywgZXhdIG9mIHNxcl9kaWN0LmVudHJpZXMoKSkge1xuICAgICAgICAgICAgaWYgKHNxcl9nY2QgPT09IDApIHtcbiAgICAgICAgICAgICAgICBzcXJfZ2NkID0gZXg7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHNxcl9nY2QgPSBpZ2NkKHNxcl9nY2QsIGV4KTtcbiAgICAgICAgICAgICAgICBpZiAoc3FyX2djZCA9PT0gMSkge1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgZm9yIChjb25zdCBbaywgdl0gb2Ygc3FyX2RpY3QuZW50cmllcygpKSB7XG4gICAgICAgICAgICBzcXJfaW50ICo9IGsqKihNYXRoLmZsb29yKHYvc3FyX2djZCkpO1xuICAgICAgICB9XG4gICAgICAgIGxldCByZXN1bHQ6IGFueTtcbiAgICAgICAgaWYgKHNxcl9pbnQgPT09IGJfcG9zICYmIG91dF9pbnQgPT09IDEgJiYgb3V0X3JhZCA9PT0gUy5PbmUpIHtcbiAgICAgICAgICAgIHJlc3VsdCA9IHVuZGVmaW5lZDtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGNvbnN0IHAxID0gb3V0X3JhZC5fX211bF9fKG5ldyBJbnRlZ2VyKG91dF9pbnQpKTtcbiAgICAgICAgICAgIGNvbnN0IHAyID0gbmV3IFBvdyhuZXcgSW50ZWdlcihzcXJfaW50KSwgbmV3IFJhdGlvbmFsKHNxcl9nY2QsIGV4cHQucSkpO1xuICAgICAgICAgICAgcmVzdWx0ID0gbmV3IE11bCh0cnVlLCB0cnVlLCBwMSwgcDIpO1xuICAgICAgICAgICAgaWYgKHRoaXMuaXNfbmVnYXRpdmUoKSkge1xuICAgICAgICAgICAgICAgIHJlc3VsdCA9IHJlc3VsdC5fX211bF9fKG5ldyBQb3coUy5OZWdhdGl2ZU9uZSwgZXhwdCkpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgfVxufTtcblxuTWFuYWdlZFByb3BlcnRpZXMucmVnaXN0ZXIoSW50ZWdlcik7XG5cblxuY2xhc3MgSW50ZWdlckNvbnN0YW50IGV4dGVuZHMgSW50ZWdlciB7XG4gICAgX19zbG90c19fOiBhbnlbXSA9IFtdO1xufTtcblxuTWFuYWdlZFByb3BlcnRpZXMucmVnaXN0ZXIoSW50ZWdlckNvbnN0YW50KTtcblxuY2xhc3MgWmVybyBleHRlbmRzIEludGVnZXJDb25zdGFudCB7XG4gICAgLypcbiAgICBUaGUgbnVtYmVyIHplcm8uXG4gICAgWmVybyBpcyBhIHNpbmdsZXRvbiwgYW5kIGNhbiBiZSBhY2Nlc3NlZCBieSBgYFMuWmVyb2BgXG4gICAgRXhhbXBsZXNcbiAgICA9PT09PT09PVxuICAgID4+PiBmcm9tIHN5bXB5IGltcG9ydCBTLCBJbnRlZ2VyXG4gICAgPj4+IEludGVnZXIoMCkgaXMgUy5aZXJvXG4gICAgVHJ1ZVxuICAgID4+PiAxL1MuWmVyb1xuICAgIHpvb1xuICAgIFJlZmVyZW5jZXNcbiAgICA9PT09PT09PT09XG4gICAgLi4gWzFdIGh0dHBzOi8vZW4ud2lraXBlZGlhLm9yZy93aWtpL1plcm9cbiAgICAqL1xuICAgIF9fc2xvdHNfXzogYW55W10gPSBbXTtcbiAgICBzdGF0aWMgaXNfcG9zaXRpdmUgPSBmYWxzZTtcbiAgICBzdGF0aWMgc3RhdGljID0gZmFsc2U7XG4gICAgc3RhdGljIGlzX3plcm8gPSB0cnVlO1xuICAgIHN0YXRpYyBpc19udW1iZXIgPSB0cnVlO1xuICAgIHN0YXRpYyBpc19jb21wYXJhYmxlID0gdHJ1ZTtcbiAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICAgICAgc3VwZXIoMCk7XG4gICAgfVxufTtcblxuTWFuYWdlZFByb3BlcnRpZXMucmVnaXN0ZXIoWmVybyk7XG5cblxuY2xhc3MgT25lIGV4dGVuZHMgSW50ZWdlckNvbnN0YW50IHtcbiAgICAvKlxuICAgIFRoZSBudW1iZXIgb25lLlxuICAgIE9uZSBpcyBhIHNpbmdsZXRvbiwgYW5kIGNhbiBiZSBhY2Nlc3NlZCBieSBgYFMuT25lYGAuXG4gICAgRXhhbXBsZXNcbiAgICA9PT09PT09PVxuICAgID4+PiBmcm9tIHN5bXB5IGltcG9ydCBTLCBJbnRlZ2VyXG4gICAgPj4+IEludGVnZXIoMSkgaXMgUy5PbmVcbiAgICBUcnVlXG4gICAgUmVmZXJlbmNlc1xuICAgID09PT09PT09PT1cbiAgICAuLiBbMV0gaHR0cHM6Ly9lbi53aWtpcGVkaWEub3JnL3dpa2kvMV8lMjhudW1iZXIlMjlcbiAgICAqL1xuICAgIHN0YXRpYyBpc19udW1iZXIgPSB0cnVlO1xuICAgIHN0YXRpYyBpc19wb3NpdGl2ZSA9IHRydWU7XG4gICAgc3RhdGljIGlzX3plcm8gPSBmYWxzZTtcbiAgICBfX3Nsb3RzX186IGFueVtdID0gW107XG4gICAgY29uc3RydWN0b3IoKSB7XG4gICAgICAgIHN1cGVyKDEpO1xuICAgIH1cbn07XG5cbk1hbmFnZWRQcm9wZXJ0aWVzLnJlZ2lzdGVyKE9uZSk7XG5cblxuY2xhc3MgTmVnYXRpdmVPbmUgZXh0ZW5kcyBJbnRlZ2VyQ29uc3RhbnQge1xuICAgIC8qXG4gICAgVGhlIG51bWJlciBuZWdhdGl2ZSBvbmUuXG4gICAgTmVnYXRpdmVPbmUgaXMgYSBzaW5nbGV0b24sIGFuZCBjYW4gYmUgYWNjZXNzZWQgYnkgYGBTLk5lZ2F0aXZlT25lYGAuXG4gICAgRXhhbXBsZXNcbiAgICA9PT09PT09PVxuICAgID4+PiBmcm9tIHN5bXB5IGltcG9ydCBTLCBJbnRlZ2VyXG4gICAgPj4+IEludGVnZXIoLTEpIGlzIFMuTmVnYXRpdmVPbmVcbiAgICBUcnVlXG4gICAgU2VlIEFsc29cbiAgICA9PT09PT09PVxuICAgIE9uZVxuICAgIFJlZmVyZW5jZXNcbiAgICA9PT09PT09PT09XG4gICAgLi4gWzFdIGh0dHBzOi8vZW4ud2lraXBlZGlhLm9yZy93aWtpLyVFMiU4OCU5MjFfJTI4bnVtYmVyJTI5XG4gICAgKi9cbiAgICBzdGF0aWMgaXNfbnVtYmVyID0gdHJ1ZTtcbiAgICBfX3Nsb3RzX186IGFueVtdID0gW107XG4gICAgY29uc3RydWN0b3IoKSB7XG4gICAgICAgIHN1cGVyKC0xKTtcbiAgICB9XG5cbiAgICBfZXZhbF9wb3dlcihleHB0OiBhbnkpIHtcbiAgICAgICAgaWYgKGV4cHQuaXNfb2RkKSB7XG4gICAgICAgICAgICByZXR1cm4gUy5OZWdhdGl2ZU9uZTtcbiAgICAgICAgfSBlbHNlIGlmIChleHB0LmlzX2V2ZW4pIHtcbiAgICAgICAgICAgIHJldHVybiBTLk9uZTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoZXhwdCBpbnN0YW5jZW9mIF9OdW1iZXJfKSB7XG4gICAgICAgICAgICBpZiAoZXhwdCBpbnN0YW5jZW9mIEZsb2F0KSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIG5ldyBGbG9hdCgtMS4wKS5fZXZhbF9wb3dlcihleHB0KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChleHB0ID09PSBTLk5hTikge1xuICAgICAgICAgICAgICAgIHJldHVybiBTLk5hTjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChleHB0ID09PSBTLkluZmluaXR5IHx8IGV4cHQgPT09IFMuTmVnYXRpdmVJbmZpbml0eSkge1xuICAgICAgICAgICAgICAgIHJldHVybiBTLk5hTjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm47XG4gICAgfVxufTtcblxuTWFuYWdlZFByb3BlcnRpZXMucmVnaXN0ZXIoTmVnYXRpdmVPbmUpO1xuXG5jbGFzcyBOYU4gZXh0ZW5kcyBfTnVtYmVyXyB7XG4gICAgLypcbiAgICBOb3QgYSBOdW1iZXIuXG4gICAgRXhwbGFuYXRpb25cbiAgICA9PT09PT09PT09PVxuICAgIFRoaXMgc2VydmVzIGFzIGEgcGxhY2UgaG9sZGVyIGZvciBudW1lcmljIHZhbHVlcyB0aGF0IGFyZSBpbmRldGVybWluYXRlLlxuICAgIE1vc3Qgb3BlcmF0aW9ucyBvbiBOYU4sIHByb2R1Y2UgYW5vdGhlciBOYU4uICBNb3N0IGluZGV0ZXJtaW5hdGUgZm9ybXMsXG4gICAgc3VjaCBhcyBgYDAvMGBgIG9yIGBgb28gLSBvb2AgcHJvZHVjZSBOYU4uICBUd28gZXhjZXB0aW9ucyBhcmUgYGAwKiowYGBcbiAgICBhbmQgYGBvbyoqMGBgLCB3aGljaCBhbGwgcHJvZHVjZSBgYDFgYCAodGhpcyBpcyBjb25zaXN0ZW50IHdpdGggUHl0aG9uJ3NcbiAgICBmbG9hdCkuXG4gICAgTmFOIGlzIGxvb3NlbHkgcmVsYXRlZCB0byBmbG9hdGluZyBwb2ludCBuYW4sIHdoaWNoIGlzIGRlZmluZWQgaW4gdGhlXG4gICAgSUVFRSA3NTQgZmxvYXRpbmcgcG9pbnQgc3RhbmRhcmQsIGFuZCBjb3JyZXNwb25kcyB0byB0aGUgUHl0aG9uXG4gICAgYGBmbG9hdCgnbmFuJylgYC4gIERpZmZlcmVuY2VzIGFyZSBub3RlZCBiZWxvdy5cbiAgICBOYU4gaXMgbWF0aGVtYXRpY2FsbHkgbm90IGVxdWFsIHRvIGFueXRoaW5nIGVsc2UsIGV2ZW4gTmFOIGl0c2VsZi4gIFRoaXNcbiAgICBleHBsYWlucyB0aGUgaW5pdGlhbGx5IGNvdW50ZXItaW50dWl0aXZlIHJlc3VsdHMgd2l0aCBgYEVxYGAgYW5kIGBgPT1gYCBpblxuICAgIHRoZSBleGFtcGxlcyBiZWxvdy5cbiAgICBOYU4gaXMgbm90IGNvbXBhcmFibGUgc28gaW5lcXVhbGl0aWVzIHJhaXNlIGEgVHlwZUVycm9yLiAgVGhpcyBpcyBpblxuICAgIGNvbnRyYXN0IHdpdGggZmxvYXRpbmcgcG9pbnQgbmFuIHdoZXJlIGFsbCBpbmVxdWFsaXRpZXMgYXJlIGZhbHNlLlxuICAgIE5hTiBpcyBhIHNpbmdsZXRvbiwgYW5kIGNhbiBiZSBhY2Nlc3NlZCBieSBgYFMuTmFOYGAsIG9yIGNhbiBiZSBpbXBvcnRlZFxuICAgIGFzIGBgbmFuYGAuXG4gICAgRXhhbXBsZXNcbiAgICA9PT09PT09PVxuICAgID4+PiBmcm9tIHN5bXB5IGltcG9ydCBuYW4sIFMsIG9vLCBFcVxuICAgID4+PiBuYW4gaXMgUy5OYU5cbiAgICBUcnVlXG4gICAgPj4+IG9vIC0gb29cbiAgICBuYW5cbiAgICA+Pj4gbmFuICsgMVxuICAgIG5hblxuICAgID4+PiBFcShuYW4sIG5hbikgICAjIG1hdGhlbWF0aWNhbCBlcXVhbGl0eVxuICAgIEZhbHNlXG4gICAgPj4+IG5hbiA9PSBuYW4gICAgICMgc3RydWN0dXJhbCBlcXVhbGl0eVxuICAgIFRydWVcbiAgICBSZWZlcmVuY2VzXG4gICAgPT09PT09PT09PVxuICAgIC4uIFsxXSBodHRwczovL2VuLndpa2lwZWRpYS5vcmcvd2lraS9OYU5cbiAgICAqL1xuICAgIHN0YXRpYyBpc19jb21tdXRhdGl2ZSA9IHRydWU7XG4gICAgc3RhdGljIGlzX2V4dGVuZGVkX3JlYWw6IGFueSA9IHVuZGVmaW5lZDtcbiAgICBzdGF0aWMgaXNfcmVhbDogYW55ID0gdW5kZWZpbmVkO1xuICAgIHN0YXRpYyBpc19yYXRpb25hOiBhbnkgPSB1bmRlZmluZWQ7XG4gICAgc3RhdGljIGlzX2FsZ2VicmFpYzogYW55ID0gdW5kZWZpbmVkO1xuICAgIHN0YXRpYyBpc190cmFuc2NlbmRlbnRhbDogYW55ID0gdW5kZWZpbmVkO1xuICAgIHN0YXRpYyBpc19pbnRlZ2VyOiBhbnkgPSB1bmRlZmluZWQ7XG4gICAgc3RhdGljIGlzX2NvbXBhcmFibGUgPSBmYWxzZTtcbiAgICBzdGF0aWMgaXNfZmluaXRlOiBhbnkgPSB1bmRlZmluZWQ7XG4gICAgc3RhdGljIGlzX3plcm86IGFueSA9IHVuZGVmaW5lZDtcbiAgICBzdGF0aWMgaXNfcHJpbWU6IGFueSA9IHVuZGVmaW5lZDtcbiAgICBzdGF0aWMgaXNfcG9zaXRpdmU6IGFueSA9IHVuZGVmaW5lZDtcbiAgICBzdGF0aWMgaXNfbmVnYXRpdmU6IGFueSA9IHVuZGVmaW5lZDtcbiAgICBzdGF0aWMgaXNfbnVtYmVyID0gdHJ1ZTtcbiAgICBfX3Nsb3RzX186IGFueSA9IFtdO1xufVxuXG5NYW5hZ2VkUHJvcGVydGllcy5yZWdpc3RlcihOYU4pO1xuXG4vLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbmV3LWNhcFxuY2xhc3MgQ29tcGxleEluZmluaXR5IGV4dGVuZHMgX0F0b21pY0V4cHIge1xuICAgIC8qXG4gICAgQ29tcGxleCBpbmZpbml0eS5cbiAgICBFeHBsYW5hdGlvblxuICAgID09PT09PT09PT09XG4gICAgSW4gY29tcGxleCBhbmFseXNpcyB0aGUgc3ltYm9sIGBcXHRpbGRlXFxpbmZ0eWAsIGNhbGxlZCBcImNvbXBsZXhcbiAgICBpbmZpbml0eVwiLCByZXByZXNlbnRzIGEgcXVhbnRpdHkgd2l0aCBpbmZpbml0ZSBtYWduaXR1ZGUsIGJ1dFxuICAgIHVuZGV0ZXJtaW5lZCBjb21wbGV4IHBoYXNlLlxuICAgIENvbXBsZXhJbmZpbml0eSBpcyBhIHNpbmdsZXRvbiwgYW5kIGNhbiBiZSBhY2Nlc3NlZCBieVxuICAgIGBgUy5Db21wbGV4SW5maW5pdHlgYCwgb3IgY2FuIGJlIGltcG9ydGVkIGFzIGBgem9vYGAuXG4gICAgRXhhbXBsZXNcbiAgICA9PT09PT09PVxuICAgID4+PiBmcm9tIHN5bXB5IGltcG9ydCB6b29cbiAgICA+Pj4gem9vICsgNDJcbiAgICB6b29cbiAgICA+Pj4gNDIvem9vXG4gICAgMFxuICAgID4+PiB6b28gKyB6b29cbiAgICBuYW5cbiAgICA+Pj4gem9vKnpvb1xuICAgIHpvb1xuICAgIFNlZSBBbHNvXG4gICAgPT09PT09PT1cbiAgICBJbmZpbml0eVxuICAgICovXG4gICAgc3RhdGljIGlzX2NvbW11dGF0aXZlID0gdHJ1ZTtcbiAgICBzdGF0aWMgaXNfaW5maW5pdGUgPSB0cnVlO1xuICAgIHN0YXRpYyBpc19udW1iZXIgPSB0cnVlO1xuICAgIHN0YXRpYyBpc19wcmltZSA9IGZhbHNlO1xuICAgIHN0YXRpYyBpc19jb21wbGV4ID0gZmFsc2U7XG4gICAgc3RhdGljIGlzX2V4dGVuZGVkX3JlYWwgPSBmYWxzZTtcbiAgICBraW5kID0gTnVtYmVyS2luZDtcbiAgICBfX3Nsb3RzX186IGFueSA9IFtdO1xuXG4gICAgY29uc3RydWN0b3IoKSB7XG4gICAgICAgIHN1cGVyKCk7XG4gICAgfVxufVxuXG5NYW5hZ2VkUHJvcGVydGllcy5yZWdpc3RlcihDb21wbGV4SW5maW5pdHkpO1xuXG5jbGFzcyBJbmZpbml0eSBleHRlbmRzIF9OdW1iZXJfIHtcbiAgICAvKlxuICAgIFBvc2l0aXZlIGluZmluaXRlIHF1YW50aXR5LlxuICAgIEV4cGxhbmF0aW9uXG4gICAgPT09PT09PT09PT1cbiAgICBJbiByZWFsIGFuYWx5c2lzIHRoZSBzeW1ib2wgYFxcaW5mdHlgIGRlbm90ZXMgYW4gdW5ib3VuZGVkXG4gICAgbGltaXQ6IGB4XFx0b1xcaW5mdHlgIG1lYW5zIHRoYXQgYHhgIGdyb3dzIHdpdGhvdXQgYm91bmQuXG4gICAgSW5maW5pdHkgaXMgb2Z0ZW4gdXNlZCBub3Qgb25seSB0byBkZWZpbmUgYSBsaW1pdCBidXQgYXMgYSB2YWx1ZVxuICAgIGluIHRoZSBhZmZpbmVseSBleHRlbmRlZCByZWFsIG51bWJlciBzeXN0ZW0uICBQb2ludHMgbGFiZWxlZCBgK1xcaW5mdHlgXG4gICAgYW5kIGAtXFxpbmZ0eWAgY2FuIGJlIGFkZGVkIHRvIHRoZSB0b3BvbG9naWNhbCBzcGFjZSBvZiB0aGUgcmVhbCBudW1iZXJzLFxuICAgIHByb2R1Y2luZyB0aGUgdHdvLXBvaW50IGNvbXBhY3RpZmljYXRpb24gb2YgdGhlIHJlYWwgbnVtYmVycy4gIEFkZGluZ1xuICAgIGFsZ2VicmFpYyBwcm9wZXJ0aWVzIHRvIHRoaXMgZ2l2ZXMgdXMgdGhlIGV4dGVuZGVkIHJlYWwgbnVtYmVycy5cbiAgICBJbmZpbml0eSBpcyBhIHNpbmdsZXRvbiwgYW5kIGNhbiBiZSBhY2Nlc3NlZCBieSBgYFMuSW5maW5pdHlgYCxcbiAgICBvciBjYW4gYmUgaW1wb3J0ZWQgYXMgYGBvb2BgLlxuICAgIEV4YW1wbGVzXG4gICAgPT09PT09PT1cbiAgICA+Pj4gZnJvbSBzeW1weSBpbXBvcnQgb28sIGV4cCwgbGltaXQsIFN5bWJvbFxuICAgID4+PiAxICsgb29cbiAgICBvb1xuICAgID4+PiA0Mi9vb1xuICAgIDBcbiAgICA+Pj4geCA9IFN5bWJvbCgneCcpXG4gICAgPj4+IGxpbWl0KGV4cCh4KSwgeCwgb28pXG4gICAgb29cbiAgICBTZWUgQWxzb1xuICAgID09PT09PT09XG4gICAgTmVnYXRpdmVJbmZpbml0eSwgTmFOXG4gICAgUmVmZXJlbmNlc1xuICAgID09PT09PT09PT1cbiAgICAuLiBbMV0gaHR0cHM6Ly9lbi53aWtpcGVkaWEub3JnL3dpa2kvSW5maW5pdHlcbiAgICAqL1xuICAgIHN0YXRpYyBpc19jb21tdXRhdGl2ZSA9IHRydWU7XG4gICAgc3RhdGljIGlzX251bWJlciA9IHRydWU7XG4gICAgc3RhdGljIGlzX2NvbXBsZXggPSBmYWxzZTtcbiAgICBzdGF0aWMgaXNfZXh0ZW5kZWRfcmVhbCA9IHRydWU7XG4gICAgc3RhdGljIGlzX2luZmluaXRlID0gdHJ1ZTtcbiAgICBzdGF0aWMgaXNfY29tcGFyYWJsZSA9IHRydWU7XG4gICAgc3RhdGljIGlzX2V4dGVuZGVkX3Bvc2l0aXZlID0gdHJ1ZTtcbiAgICBzdGF0aWMgaXNfcHJpbWUgPSBmYWxzZTtcbiAgICBfX3Nsb3RzX186IGFueSA9IFtdO1xuXG4gICAgY29uc3RydWN0b3IoKSB7XG4gICAgICAgIHN1cGVyKCk7XG4gICAgfVxuXG4gICAgLy8gTk9URTogbW9yZSBhcml0aG1ldGljIG1ldGhvZHMgc2hvdWxkIGJlIGltcGxlbWVudGVkIGJ1dCBJIGhhdmUgb25seVxuICAgIC8vIGRvbmUgZW5vdWdoIHN1Y2ggdGhhdCBhZGQgYW5kIG11bCBjYW4gaGFuZGxlIGluZmluaXR5IGFzIGFuIGFyZ3VtZW50XG4gICAgX19hZGRfXyhvdGhlcjogYW55KSB7XG4gICAgICAgIGlmIChvdGhlciBpbnN0YW5jZW9mIF9OdW1iZXJfICYmIGdsb2JhbF9wYXJhbWV0ZXJzLmV2YWx1YXRlKSB7XG4gICAgICAgICAgICBpZiAob3RoZXIgPT09IFMuSW5maW5pdHkgfHwgb3RoZXIgPT09IFMuTmFOKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIFMuTmFOO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHN1cGVyLl9fYWRkX18ob3RoZXIpO1xuICAgIH1cblxuICAgIF9fbXVsX18ob3RoZXI6IGFueSkge1xuICAgICAgICBpZiAob3RoZXIgaW5zdGFuY2VvZiBfTnVtYmVyXyAmJiBnbG9iYWxfcGFyYW1ldGVycy5ldmFsdWF0ZSkge1xuICAgICAgICAgICAgaWYgKG90aGVyID09PSBTLlplcm8gfHwgb3RoZXIgPT09IFMuTmFOKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIFMuTmFOO1xuICAgICAgICAgICAgfSBlbHNlIGlmIChvdGhlci5pc19leHRlbmRlZF9wb3NpdGl2ZSkge1xuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIFMuTmVnYXRpdmVJbmZpbml0eTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gc3VwZXIuX19tdWxfXyhvdGhlcik7XG4gICAgfVxufVxuXG5jbGFzcyBOZWdhdGl2ZUluZmluaXR5IGV4dGVuZHMgX051bWJlcl8ge1xuICAgIC8qXG4gICAgXCJOZWdhdGl2ZSBpbmZpbml0ZSBxdWFudGl0eS5cbiAgICBOZWdhdGl2ZUluZmluaXR5IGlzIGEgc2luZ2xldG9uLCBhbmQgY2FuIGJlIGFjY2Vzc2VkXG4gICAgYnkgYGBTLk5lZ2F0aXZlSW5maW5pdHlgYC5cbiAgICBTZWUgQWxzb1xuICAgID09PT09PT09XG4gICAgSW5maW5pdHlcbiAgICAqL1xuICAgIHN0YXRpYyBpc19leHRlbmRlZF9yZWFsID0gdHJ1ZTtcbiAgICBzdGF0aWMgaXNfY29tcGxleCA9IGZhbHNlO1xuICAgIHN0YXRpYyBpc19jb21tdXRhdGl2ZSA9IHRydWU7XG4gICAgc3RhdGljIGlzX2luZmluaXRlID0gdHJ1ZTtcbiAgICBzdGF0aWMgaXNfY29tcGFyYWJsZSA9IHRydWU7XG4gICAgc3RhdGljIGlzX2V4dGVuZGVkX25lZ2F0aXZlID0gdHJ1ZTtcbiAgICBzdGF0aWMgaXNfbnVtYmVyID0gdHJ1ZTtcbiAgICBzdGF0aWMgaXNfcHJpbWUgPSBmYWxzZTtcbiAgICBfX3Nsb3RzX186IGFueSA9IFtdO1xuXG4gICAgY29uc3RydWN0b3IoKSB7XG4gICAgICAgIHN1cGVyKCk7XG4gICAgfVxuXG4gICAgLy8gTk9URTogbW9yZSBhcml0aG1ldGljIG1ldGhvZHMgc2hvdWxkIGJlIGltcGxlbWVudGVkIGJ1dCBJIGhhdmUgb25seVxuICAgIC8vIGRvbmUgZW5vdWdoIHN1Y2ggdGhhdCBhZGQgYW5kIG11bCBjYW4gaGFuZGxlIG5lZ2F0aXZlaW5maW5pdHkgYXMgYW4gYXJndW1lbnRcbiAgICBfX2FkZF9fKG90aGVyOiBhbnkpIHtcbiAgICAgICAgaWYgKG90aGVyIGluc3RhbmNlb2YgX051bWJlcl8gJiYgZ2xvYmFsX3BhcmFtZXRlcnMuZXZhbHVhdGUpIHtcbiAgICAgICAgICAgIGlmIChvdGhlciA9PT0gUy5OZWdhdGl2ZUluZmluaXR5IHx8IG90aGVyID09PSBTLk5hTikge1xuICAgICAgICAgICAgICAgIHJldHVybiBTLk5hTjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBzdXBlci5fX2FkZF9fKG90aGVyKTtcbiAgICB9XG5cbiAgICBfX211bF9fKG90aGVyOiBhbnkpIHtcbiAgICAgICAgaWYgKG90aGVyIGluc3RhbmNlb2YgX051bWJlcl8gJiYgZ2xvYmFsX3BhcmFtZXRlcnMuZXZhbHVhdGUpIHtcbiAgICAgICAgICAgIGlmIChvdGhlciA9PT0gUy5aZXJvIHx8IG90aGVyID09PSBTLk5hTikge1xuICAgICAgICAgICAgICAgIHJldHVybiBTLk5hTjtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAob3RoZXIuaXNfZXh0ZW5kZWRfcG9zaXRpdmUpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiBTLkluZmluaXR5O1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBzdXBlci5fX211bF9fKG90aGVyKTtcbiAgICB9XG59XG5cbi8vIFJlZ2lzdGVyaW5nIHNpbmdsZXRvbnMgKHNlZSBzaW5nbGV0b24gY2xhc3MpXG5TaW5nbGV0b24ucmVnaXN0ZXIoXCJaZXJvXCIsIFplcm8pO1xuUy5aZXJvID0gU2luZ2xldG9uLnJlZ2lzdHJ5W1wiWmVyb1wiXTtcblxuU2luZ2xldG9uLnJlZ2lzdGVyKFwiT25lXCIsIE9uZSk7XG5TLk9uZSA9IFNpbmdsZXRvbi5yZWdpc3RyeVtcIk9uZVwiXTtcblxuU2luZ2xldG9uLnJlZ2lzdGVyKFwiTmVnYXRpdmVPbmVcIiwgTmVnYXRpdmVPbmUpO1xuUy5OZWdhdGl2ZU9uZSA9IFNpbmdsZXRvbi5yZWdpc3RyeVtcIk5lZ2F0aXZlT25lXCJdO1xuXG5TaW5nbGV0b24ucmVnaXN0ZXIoXCJOYU5cIiwgTmFOKTtcblMuTmFOID0gU2luZ2xldG9uLnJlZ2lzdHJ5W1wiTmFOXCJdO1xuXG5TaW5nbGV0b24ucmVnaXN0ZXIoXCJDb21wbGV4SW5maW5pdHlcIiwgQ29tcGxleEluZmluaXR5KTtcblMuQ29tcGxleEluZmluaXR5ID0gU2luZ2xldG9uLnJlZ2lzdHJ5W1wiQ29tcGxleEluZmluaXR5XCJdO1xuXG5TaW5nbGV0b24ucmVnaXN0ZXIoXCJJbmZpbml0eVwiLCBJbmZpbml0eSk7XG5TLkluZmluaXR5ID0gU2luZ2xldG9uLnJlZ2lzdHJ5W1wiSW5maW5pdHlcIl07XG5cblNpbmdsZXRvbi5yZWdpc3RlcihcIk5lZ2F0aXZlSW5maW5pdHlcIiwgTmVnYXRpdmVJbmZpbml0eSk7XG5TLk5lZ2F0aXZlSW5maW5pdHkgPSBTaW5nbGV0b24ucmVnaXN0cnlbXCJOZWdhdGl2ZUluZmluaXR5XCJdO1xuXG5leHBvcnQge1JhdGlvbmFsLCBfTnVtYmVyXywgRmxvYXQsIEludGVnZXIsIFplcm8sIE9uZX07XG4iLCAiLypcbkludGVnZXIgYW5kIHJhdGlvbmFsIGZhY3Rvcml6YXRpb25cblxuTm90YWJsZSBjaGFuZ2VzIG1hZGVcbi0gQSBmZXcgZnVuY3Rpb25zIGluIC5nZW5lcmF0b3IgYW5kIC5ldmFsZiBoYXZlIGJlZW4gbW92ZWQgaGVyZSBmb3Igc2ltcGxpY2l0eVxuLSBOb3RlOiBtb3N0IHBhcmFtZXRlcnMgZm9yIGZhY3RvcmludCBhbmQgZmFjdG9ycmF0IGhhdmUgbm90IGJlZW4gaW1wbGVtZW50ZWRcbi0gU2VlIG5vdGVzIHdpdGhpbiBwZXJmZWN0X3Bvd2VyIGZvciBzcGVjaWZpYyBjaGFuZ2VzXG4tIEFsbCBmYWN0b3IgZnVuY3Rpb25zIHJldHVybiBoYXNoZGljdGlvbmFyaWVzXG4tIEFkdmFuY2VkIGZhY3RvcmluZyBhbGdvcml0aG1zIGZvciBmYWN0b3JpbnQgYXJlIG5vdCB5ZXQgaW1wbGVtZW50ZWRcbiovXG5cbmltcG9ydCB7UmF0aW9uYWwsIGludF9udGhyb290LCBJbnRlZ2VyfSBmcm9tIFwiLi4vY29yZS9udW1iZXJzLmpzXCI7XG5pbXBvcnQge1N9IGZyb20gXCIuLi9jb3JlL3NpbmdsZXRvbi5qc1wiO1xuaW1wb3J0IHtIYXNoRGljdCwgVXRpbH0gZnJvbSBcIi4uL2NvcmUvdXRpbGl0eS5qc1wiO1xuaW1wb3J0IHthc19pbnR9IGZyb20gXCIuLi91dGlsaXRpZXMvbWlzYy5qc1wiO1xuXG5jb25zdCBzbWFsbF90cmFpbGluZyA9IG5ldyBBcnJheSgyNTYpLmZpbGwoMCk7XG5mb3IgKGxldCBqID0gMTsgaiA8IDg7IGorKykge1xuICAgIFV0aWwuYXNzaWduRWxlbWVudHMoc21hbGxfdHJhaWxpbmcsIG5ldyBBcnJheSgoMTw8KDctaikpKS5maWxsKGopLCAxPDxqLCAxPDwoaisxKSk7XG59XG5cbmZ1bmN0aW9uIGJpdGNvdW50KG46IG51bWJlcikge1xuICAgIC8vIFJldHVybiBzbWFsbGVzdCBpbnRlZ2VyLCBiLCBzdWNoIHRoYXQgfG58LzIqKmIgPCAxXG4gICAgbGV0IGJpdHMgPSAwO1xuICAgIHdoaWxlIChuICE9PSAwKSB7XG4gICAgICAgIGJpdHMgKz0gYml0Q291bnQzMihuIHwgMCk7XG4gICAgICAgIG4gLz0gMHgxMDAwMDAwMDA7XG4gICAgfVxuICAgIHJldHVybiBiaXRzO1xufVxuXG4vLyBzbWFsbCBiaXRjb3VudCB1c2VkIHRvIGZhY2lsaWF0ZSBsYXJnZXIgb25lXG5mdW5jdGlvbiBiaXRDb3VudDMyKG46IG51bWJlcikge1xuICAgIG4gPSBuIC0gKChuID4+IDEpICYgMHg1NTU1NTU1NSk7XG4gICAgbiA9IChuICYgMHgzMzMzMzMzMykgKyAoKG4gPj4gMikgJiAweDMzMzMzMzMzKTtcbiAgICByZXR1cm4gKChuICsgKG4gPj4gNCkgJiAweEYwRjBGMEYpICogMHgxMDEwMTAxKSA+PiAyNDtcbn1cblxuZnVuY3Rpb24gdHJhaWxpbmcobjogbnVtYmVyKSB7XG4gICAgLypcbiAgICBDb3VudCB0aGUgbnVtYmVyIG9mIHRyYWlsaW5nIHplcm8gZGlnaXRzIGluIHRoZSBiaW5hcnlcbiAgICByZXByZXNlbnRhdGlvbiBvZiBuLCBpLmUuIGRldGVybWluZSB0aGUgbGFyZ2VzdCBwb3dlciBvZiAyXG4gICAgdGhhdCBkaXZpZGVzIG4uXG4gICAgRXhhbXBsZXNcbiAgICA9PT09PT09PVxuICAgID4+PiBmcm9tIHN5bXB5IGltcG9ydCB0cmFpbGluZ1xuICAgID4+PiB0cmFpbGluZygxMjgpXG4gICAgN1xuICAgID4+PiB0cmFpbGluZyg2MylcbiAgICAwXG4gICAgKi9cbiAgICBuID0gTWF0aC5mbG9vcihNYXRoLmFicyhuKSk7XG4gICAgY29uc3QgbG93X2J5dGUgPSBuICYgMHhmZjtcbiAgICBpZiAobG93X2J5dGUpIHtcbiAgICAgICAgcmV0dXJuIHNtYWxsX3RyYWlsaW5nW2xvd19ieXRlXTtcbiAgICB9XG4gICAgY29uc3QgeiA9IGJpdGNvdW50KG4pIC0gMTtcbiAgICBpZiAoTnVtYmVyLmlzSW50ZWdlcih6KSkge1xuICAgICAgICBpZiAobiA9PT0gMSA8PCB6KSB7XG4gICAgICAgICAgICByZXR1cm4gejtcbiAgICAgICAgfVxuICAgIH1cbiAgICBpZiAoeiA8IDMwMCkge1xuICAgICAgICBsZXQgdCA9IDg7XG4gICAgICAgIG4gPj49IDg7XG4gICAgICAgIHdoaWxlICghKG4gJiAweGZmKSkge1xuICAgICAgICAgICAgbiA+Pj0gODtcbiAgICAgICAgICAgIHQgKz0gODtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdCArIHNtYWxsX3RyYWlsaW5nW24gJiAweGZmXTtcbiAgICB9XG4gICAgbGV0IHQgPSAwO1xuICAgIGxldCBwID0gODtcbiAgICB3aGlsZSAoIShuICYgMSkpIHtcbiAgICAgICAgd2hpbGUgKCEobiAmICgoMSA8PCBwKSAtIDEpKSkge1xuICAgICAgICAgICAgbiA+Pj0gcDtcbiAgICAgICAgICAgIHQgKz0gcDtcbiAgICAgICAgICAgIHAgKj0gMjtcbiAgICAgICAgfVxuICAgICAgICBwID0gTWF0aC5mbG9vcihwLzIpO1xuICAgIH1cbiAgICByZXR1cm4gdDtcbn1cblxuLy8gbm90ZTogdGhpcyBpcyBkaWZmZXJlbnQgdGhhbiB0aGUgb3JpZ2luYWwgc3ltcHkgdmVyc2lvbiAtIGltcGxlbWVudCBsYXRlclxuZnVuY3Rpb24gaXNwcmltZShudW06IG51bWJlcikge1xuICAgIGZvciAobGV0IGkgPSAyLCBzID0gTWF0aC5zcXJ0KG51bSk7IGkgPD0gczsgaSsrKSB7XG4gICAgICAgIGlmIChudW0gJSBpID09PSAwKSB7XG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIChudW0gPiAxKTtcbn1cblxuZnVuY3Rpb24qIHByaW1lcmFuZ2UoYTogbnVtYmVyLCBiOiBudW1iZXIgPSB1bmRlZmluZWQpIHtcbiAgICAvKlxuICAgIEdlbmVyYXRlIGFsbCBwcmltZSBudW1iZXJzIGluIHRoZSByYW5nZSBbMiwgYSkgb3IgW2EsIGIpLlxuICAgIEV4YW1wbGVzXG4gICAgPT09PT09PT1cbiAgICA+Pj4gZnJvbSBzeW1weSBpbXBvcnQgc2lldmUsIHByaW1lXG4gICAgQWxsIHByaW1lcyBsZXNzIHRoYW4gMTk6XG4gICAgPj4+IHByaW50KFtpIGZvciBpIGluIHNpZXZlLnByaW1lcmFuZ2UoMTkpXSlcbiAgICBbMiwgMywgNSwgNywgMTEsIDEzLCAxN11cbiAgICBBbGwgcHJpbWVzIGdyZWF0ZXIgdGhhbiBvciBlcXVhbCB0byA3IGFuZCBsZXNzIHRoYW4gMTk6XG4gICAgPj4+IHByaW50KFtpIGZvciBpIGluIHNpZXZlLnByaW1lcmFuZ2UoNywgMTkpXSlcbiAgICBbNywgMTEsIDEzLCAxN11cbiAgICBBbGwgcHJpbWVzIHRocm91Z2ggdGhlIDEwdGggcHJpbWVcbiAgICA+Pj4gbGlzdChzaWV2ZS5wcmltZXJhbmdlKHByaW1lKDEwKSArIDEpKVxuICAgIFsyLCAzLCA1LCA3LCAxMSwgMTMsIDE3LCAxOSwgMjMsIDI5XVxuICAgICovXG4gICAgaWYgKHR5cGVvZiBiID09PSBcInVuZGVmaW5lZFwiKSB7XG4gICAgICAgIFthLCBiXSA9IFsyLCBhXTtcbiAgICB9XG4gICAgaWYgKGEgPj0gYikge1xuICAgICAgICByZXR1cm47XG4gICAgfVxuICAgIGEgPSBNYXRoLmNlaWwoYSkgLSAxO1xuICAgIGIgPSBNYXRoLmZsb29yKGIpO1xuXG4gICAgd2hpbGUgKDEpIHtcbiAgICAgICAgYSA9IG5leHRwcmltZShhKTtcbiAgICAgICAgaWYgKGEgPCBiKSB7XG4gICAgICAgICAgICB5aWVsZCBhO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgfVxufVxuXG5mdW5jdGlvbiBuZXh0cHJpbWUobjogbnVtYmVyLCBpdGg6IG51bWJlciA9IDEpIHtcbiAgICAvKlxuICAgIFJldHVybiB0aGUgaXRoIHByaW1lIGdyZWF0ZXIgdGhhbiBuLlxuICAgIGkgbXVzdCBiZSBhbiBpbnRlZ2VyLlxuICAgIE5vdGVzXG4gICAgPT09PT1cbiAgICBQb3RlbnRpYWwgcHJpbWVzIGFyZSBsb2NhdGVkIGF0IDYqaiArLy0gMS4gVGhpc1xuICAgIHByb3BlcnR5IGlzIHVzZWQgZHVyaW5nIHNlYXJjaGluZy5cbiAgICA+Pj4gZnJvbSBzeW1weSBpbXBvcnQgbmV4dHByaW1lXG4gICAgPj4+IFsoaSwgbmV4dHByaW1lKGkpKSBmb3IgaSBpbiByYW5nZSgxMCwgMTUpXVxuICAgIFsoMTAsIDExKSwgKDExLCAxMyksICgxMiwgMTMpLCAoMTMsIDE3KSwgKDE0LCAxNyldXG4gICAgPj4+IG5leHRwcmltZSgyLCBpdGg9MikgIyB0aGUgMm5kIHByaW1lIGFmdGVyIDJcbiAgICA1XG4gICAgU2VlIEFsc29cbiAgICA9PT09PT09PVxuICAgIHByZXZwcmltZSA6IFJldHVybiB0aGUgbGFyZ2VzdCBwcmltZSBzbWFsbGVyIHRoYW4gblxuICAgIHByaW1lcmFuZ2UgOiBHZW5lcmF0ZSBhbGwgcHJpbWVzIGluIGEgZ2l2ZW4gcmFuZ2VcbiAgICAqL1xuICAgIG4gPSBNYXRoLmZsb29yKG4pO1xuICAgIGNvbnN0IGkgPSBhc19pbnQoaXRoKTtcbiAgICBpZiAoaSA+IDEpIHtcbiAgICAgICAgbGV0IHByID0gbjtcbiAgICAgICAgbGV0IGogPSAxO1xuICAgICAgICB3aGlsZSAoMSkge1xuICAgICAgICAgICAgcHIgPSBuZXh0cHJpbWUocHIpO1xuICAgICAgICAgICAgaisrO1xuICAgICAgICAgICAgaWYgKGogPiAxKSB7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHByO1xuICAgIH1cbiAgICBpZiAobiA8IDIpIHtcbiAgICAgICAgcmV0dXJuIDI7XG4gICAgfVxuICAgIGlmIChuIDwgNykge1xuICAgICAgICByZXR1cm4gezI6IDMsIDM6IDUsIDQ6IDUsIDU6IDcsIDY6IDd9W25dO1xuICAgIH1cbiAgICBjb25zdCBubiA9IDYgKiBNYXRoLmZsb29yKG4vNik7XG4gICAgaWYgKG5uID09PSBuKSB7XG4gICAgICAgIG4rKztcbiAgICAgICAgaWYgKGlzcHJpbWUobikpIHtcbiAgICAgICAgICAgIHJldHVybiBuO1xuICAgICAgICB9XG4gICAgICAgIG4gKz0gNDtcbiAgICB9IGVsc2UgaWYgKG4gLSBubiA9PT0gNSkge1xuICAgICAgICBuICs9IDI7XG4gICAgICAgIGlmIChpc3ByaW1lKG4pKSB7XG4gICAgICAgICAgICByZXR1cm4gbjtcbiAgICAgICAgfVxuICAgICAgICBuICs9IDQ7XG4gICAgfSBlbHNlIHtcbiAgICAgICAgbiA9IG5uICsgNTtcbiAgICB9XG4gICAgd2hpbGUgKDEpIHtcbiAgICAgICAgaWYgKGlzcHJpbWUobikpIHtcbiAgICAgICAgICAgIHJldHVybiBuO1xuICAgICAgICB9XG4gICAgICAgIG4gKz0gMjtcbiAgICAgICAgaWYgKGlzcHJpbWUobikpIHtcbiAgICAgICAgICAgIHJldHVybiBuO1xuICAgICAgICB9XG4gICAgICAgIG4gKz0gNDtcbiAgICB9XG59XG5cbmV4cG9ydCBjb25zdCBkaXZtb2QgPSAoYTogbnVtYmVyLCBiOiBudW1iZXIpID0+IFtNYXRoLmZsb29yKGEvYiksIGElYl07XG5cbmZ1bmN0aW9uIG11bHRpcGxpY2l0eShwOiBhbnksIG46IGFueSk6IGFueSB7XG4gICAgLypcbiAgICBGaW5kIHRoZSBncmVhdGVzdCBpbnRlZ2VyIG0gc3VjaCB0aGF0IHAqKm0gZGl2aWRlcyBuLlxuICAgIEV4YW1wbGVzXG4gICAgPT09PT09PT1cbiAgICA+Pj4gZnJvbSBzeW1weSBpbXBvcnQgbXVsdGlwbGljaXR5LCBSYXRpb25hbFxuICAgID4+PiBbbXVsdGlwbGljaXR5KDUsIG4pIGZvciBuIGluIFs4LCA1LCAyNSwgMTI1LCAyNTBdXVxuICAgIFswLCAxLCAyLCAzLCAzXVxuICAgID4+PiBtdWx0aXBsaWNpdHkoMywgUmF0aW9uYWwoMSwgOSkpXG4gICAgLTJcbiAgICBOb3RlOiB3aGVuIGNoZWNraW5nIGZvciB0aGUgbXVsdGlwbGljaXR5IG9mIGEgbnVtYmVyIGluIGFcbiAgICBsYXJnZSBmYWN0b3JpYWwgaXQgaXMgbW9zdCBlZmZpY2llbnQgdG8gc2VuZCBpdCBhcyBhbiB1bmV2YWx1YXRlZFxuICAgIGZhY3RvcmlhbCBvciB0byBjYWxsIGBgbXVsdGlwbGljaXR5X2luX2ZhY3RvcmlhbGBgIGRpcmVjdGx5OlxuICAgID4+PiBmcm9tIHN5bXB5Lm50aGVvcnkgaW1wb3J0IG11bHRpcGxpY2l0eV9pbl9mYWN0b3JpYWxcbiAgICA+Pj4gZnJvbSBzeW1weSBpbXBvcnQgZmFjdG9yaWFsXG4gICAgPj4+IHAgPSBmYWN0b3JpYWwoMjUpXG4gICAgPj4+IG4gPSAyKioxMDBcbiAgICA+Pj4gbmZhYyA9IGZhY3RvcmlhbChuLCBldmFsdWF0ZT1GYWxzZSlcbiAgICA+Pj4gbXVsdGlwbGljaXR5KHAsIG5mYWMpXG4gICAgNTI4MTg3NzUwMDk1MDk1NTgzOTU2OTU5NjY4ODdcbiAgICA+Pj4gXyA9PSBtdWx0aXBsaWNpdHlfaW5fZmFjdG9yaWFsKHAsIG4pXG4gICAgVHJ1ZVxuICAgICovXG4gICAgdHJ5IHtcbiAgICAgICAgW3AsIG5dID0gW2FzX2ludChwKSwgYXNfaW50KG4pXTtcbiAgICB9IGNhdGNoIChFcnJvcikge1xuICAgICAgICBpZiAoTnVtYmVyLmlzSW50ZWdlcihwKSB8fCBwIGluc3RhbmNlb2YgUmF0aW9uYWwgJiYgTnVtYmVyLmlzSW50ZWdlcihuKSB8fCBuIGluc3RhbmNlb2YgUmF0aW9uYWwpIHtcbiAgICAgICAgICAgIHAgPSBuZXcgUmF0aW9uYWwocCk7XG4gICAgICAgICAgICBuID0gbmV3IFJhdGlvbmFsKG4pO1xuICAgICAgICAgICAgaWYgKHAucSA9PT0gMSkge1xuICAgICAgICAgICAgICAgIGlmIChuLnAgPT09IDEpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIC1tdWx0aXBsaWNpdHkocC5wLCBuLnEpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICByZXR1cm4gbXVsdGlwbGljaXR5KHAucCwgbi5wKSAtIG11bHRpcGxpY2l0eShwLnAsIG4ucSk7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKHAucCA9PT0gMSkge1xuICAgICAgICAgICAgICAgIHJldHVybiBtdWx0aXBsaWNpdHkocC5xLCBuLnEpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBjb25zdCBsaWtlID0gTWF0aC5taW4obXVsdGlwbGljaXR5KHAucCwgbi5wKSwgbXVsdGlwbGljaXR5KHAucSwgbi5xKSk7XG4gICAgICAgICAgICAgICAgY29uc3QgY3Jvc3MgPSBNYXRoLm1pbihtdWx0aXBsaWNpdHkocC5xLCBuLnApLCBtdWx0aXBsaWNpdHkocC5wLCBuLnEpKTtcbiAgICAgICAgICAgICAgICByZXR1cm4gbGlrZSAtIGNyb3NzO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuICAgIGlmIChuID09PSAwKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcihcIm5vIGludCBleGlzdHNcIik7XG4gICAgfVxuICAgIGlmIChwID09PSAyKSB7XG4gICAgICAgIHJldHVybiB0cmFpbGluZyhuKTtcbiAgICB9XG4gICAgaWYgKHAgPCAyKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcihcInAgbXVzdCBiZSBpbnRcIik7XG4gICAgfVxuICAgIGlmIChwID09PSBuKSB7XG4gICAgICAgIHJldHVybiAxO1xuICAgIH1cblxuICAgIGxldCBtID0gMDtcbiAgICBuID0gTWF0aC5mbG9vcihuL3ApO1xuICAgIGxldCByZW0gPSBuICUgcDtcbiAgICB3aGlsZSAoIXJlbSkge1xuICAgICAgICBtKys7XG4gICAgICAgIGlmIChtID4gNSkge1xuICAgICAgICAgICAgbGV0IGUgPSAyO1xuICAgICAgICAgICAgd2hpbGUgKDEpIHtcbiAgICAgICAgICAgICAgICBjb25zdCBwcG93ID0gcCoqZTtcbiAgICAgICAgICAgICAgICBpZiAocHBvdyA8IG4pIHtcbiAgICAgICAgICAgICAgICAgICAgY29uc3Qgbm5ldyA9IE1hdGguZmxvb3Iobi9wcG93KTtcbiAgICAgICAgICAgICAgICAgICAgcmVtID0gbiAlIHBwb3c7XG4gICAgICAgICAgICAgICAgICAgIGlmICghKHJlbSkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIG0gKz0gZTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGUgKj0gMjtcbiAgICAgICAgICAgICAgICAgICAgICAgIG4gPSBubmV3O1xuICAgICAgICAgICAgICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgcmV0dXJuIG0gKyBtdWx0aXBsaWNpdHkocCwgbik7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgW24sIHJlbV0gPSBkaXZtb2QobiwgcCk7XG4gICAgfVxuICAgIHJldHVybiBtO1xufVxuXG5mdW5jdGlvbiBkaXZpc29ycyhuOiBudW1iZXIsIGdlbmVyYXRvcjogYm9vbGVhbiA9IGZhbHNlLCBwcm9wZXI6IGJvb2xlYW4gPSBmYWxzZSkge1xuICAgIC8qXG4gICAgUmV0dXJuIGFsbCBkaXZpc29ycyBvZiBuIHNvcnRlZCBmcm9tIDEuLm4gYnkgZGVmYXVsdC5cbiAgICBJZiBnZW5lcmF0b3IgaXMgYGBUcnVlYGAgYW4gdW5vcmRlcmVkIGdlbmVyYXRvciBpcyByZXR1cm5lZC5cbiAgICBUaGUgbnVtYmVyIG9mIGRpdmlzb3JzIG9mIG4gY2FuIGJlIHF1aXRlIGxhcmdlIGlmIHRoZXJlIGFyZSBtYW55XG4gICAgcHJpbWUgZmFjdG9ycyAoY291bnRpbmcgcmVwZWF0ZWQgZmFjdG9ycykuIElmIG9ubHkgdGhlIG51bWJlciBvZlxuICAgIGZhY3RvcnMgaXMgZGVzaXJlZCB1c2UgZGl2aXNvcl9jb3VudChuKS5cbiAgICBFeGFtcGxlc1xuICAgID09PT09PT09XG4gICAgPj4+IGZyb20gc3ltcHkgaW1wb3J0IGRpdmlzb3JzLCBkaXZpc29yX2NvdW50XG4gICAgPj4+IGRpdmlzb3JzKDI0KVxuICAgIFsxLCAyLCAzLCA0LCA2LCA4LCAxMiwgMjRdXG4gICAgPj4+IGRpdmlzb3JfY291bnQoMjQpXG4gICAgOFxuICAgID4+PiBsaXN0KGRpdmlzb3JzKDEyMCwgZ2VuZXJhdG9yPVRydWUpKVxuICAgIFsxLCAyLCA0LCA4LCAzLCA2LCAxMiwgMjQsIDUsIDEwLCAyMCwgNDAsIDE1LCAzMCwgNjAsIDEyMF1cbiAgICBOb3Rlc1xuICAgID09PT09XG4gICAgVGhpcyBpcyBhIHNsaWdodGx5IG1vZGlmaWVkIHZlcnNpb24gb2YgVGltIFBldGVycyByZWZlcmVuY2VkIGF0OlxuICAgIGh0dHBzOi8vc3RhY2tvdmVyZmxvdy5jb20vcXVlc3Rpb25zLzEwMTAzODEvcHl0aG9uLWZhY3Rvcml6YXRpb25cbiAgICBTZWUgQWxzb1xuICAgID09PT09PT09XG4gICAgcHJpbWVmYWN0b3JzLCBmYWN0b3JpbnQsIGRpdmlzb3JfY291bnRcbiAgICAqL1xuICAgIG4gPSBhc19pbnQoTWF0aC5hYnMobikpO1xuICAgIGlmIChpc3ByaW1lKG4pKSB7XG4gICAgICAgIGlmIChwcm9wZXIpIHtcbiAgICAgICAgICAgIHJldHVybiBbMV07XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIFsxLCBuXTtcbiAgICB9XG4gICAgaWYgKG4gPT09IDEpIHtcbiAgICAgICAgaWYgKHByb3Blcikge1xuICAgICAgICAgICAgcmV0dXJuIFtdO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBbMV07XG4gICAgfVxuICAgIGlmIChuID09PSAwKSB7XG4gICAgICAgIHJldHVybiBbXTtcbiAgICB9XG4gICAgY29uc3QgcnYgPSBfZGl2aXNvcnMobiwgcHJvcGVyKTtcbiAgICBpZiAoIWdlbmVyYXRvcikge1xuICAgICAgICBjb25zdCB0ZW1wID0gW107XG4gICAgICAgIGZvciAoY29uc3QgaSBvZiBydikge1xuICAgICAgICAgICAgdGVtcC5wdXNoKGkpO1xuICAgICAgICB9XG4gICAgICAgIHRlbXAuc29ydCgpO1xuICAgICAgICByZXR1cm4gdGVtcDtcbiAgICB9XG4gICAgcmV0dXJuIHJ2O1xufVxuXG5mdW5jdGlvbiogX2Rpdmlzb3JzKG46IG51bWJlciwgZ2VuZXJhdG9yOiBib29sZWFuID0gZmFsc2UsIHByb3BlcjogYm9vbGVhbiA9IGZhbHNlKSB7XG4gICAgLy8gSGVscGVyIGZ1bmN0aW9uIGZvciBkaXZpc29ycyB3aGljaCBnZW5lcmF0ZXMgdGhlIGRpdmlzb3JzLlxuICAgIGNvbnN0IGZhY3RvcmRpY3QgPSBmYWN0b3JpbnQobik7XG4gICAgY29uc3QgcHMgPSBmYWN0b3JkaWN0LmtleXMoKS5zb3J0KCk7XG5cbiAgICBmdW5jdGlvbiogcmVjX2dlbihuOiBudW1iZXIgPSAwKTogYW55IHtcbiAgICAgICAgaWYgKG4gPT09IHBzLmxlbmd0aCkge1xuICAgICAgICAgICAgeWllbGQgMTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGNvbnN0IHBvd3MgPSBbMV07XG4gICAgICAgICAgICBmb3IgKGxldCBqID0gMDsgaiA8IGZhY3RvcmRpY3QuZ2V0KHBzW25dKTsgaisrKSB7XG4gICAgICAgICAgICAgICAgcG93cy5wdXNoKHBvd3NbcG93cy5sZW5ndGggLSAxXSAqIHBzW25dKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGZvciAoY29uc3QgcSBvZiByZWNfZ2VuKG4gKyAxKSkge1xuICAgICAgICAgICAgICAgIGZvciAoY29uc3QgcCBvZiBwb3dzKSB7XG4gICAgICAgICAgICAgICAgICAgIHlpZWxkIHAgKiBxO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cbiAgICBpZiAocHJvcGVyKSB7XG4gICAgICAgIGZvciAoY29uc3QgcCBvZiByZWNfZ2VuKCkpIHtcbiAgICAgICAgICAgIGlmIChwICE9IG4pIHtcbiAgICAgICAgICAgICAgICB5aWVsZCBwO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgICAgZm9yIChjb25zdCBwIG9mIHJlY19nZW4oKSkge1xuICAgICAgICAgICAgeWllbGQgcDtcbiAgICAgICAgfVxuICAgIH1cbn1cblxuXG5mdW5jdGlvbiBfY2hlY2tfdGVybWluYXRpb24oZmFjdG9yczogYW55LCBuOiBudW1iZXIsIGxpbWl0cDE6IGFueSkge1xuICAgIC8qXG4gICAgSGVscGVyIGZ1bmN0aW9uIGZvciBpbnRlZ2VyIGZhY3Rvcml6YXRpb24uIENoZWNrcyBpZiBgYG5gYFxuICAgIGlzIGEgcHJpbWUgb3IgYSBwZXJmZWN0IHBvd2VyLCBhbmQgaW4gdGhvc2UgY2FzZXMgdXBkYXRlc1xuICAgIHRoZSBmYWN0b3JpemF0aW9uIGFuZCByYWlzZXMgYGBTdG9wSXRlcmF0aW9uYGAuXG4gICAgKi9cbiAgICBjb25zdCBwID0gcGVyZmVjdF9wb3dlcihuLCB1bmRlZmluZWQsIHRydWUsIGZhbHNlKTtcbiAgICBpZiAocCAhPT0gZmFsc2UpIHtcbiAgICAgICAgY29uc3QgW2Jhc2UsIGV4cF0gPSBwO1xuICAgICAgICBsZXQgbGltaXQ7XG4gICAgICAgIGlmIChsaW1pdHAxKSB7XG4gICAgICAgICAgICBsaW1pdCA9IGxpbWl0cDEgPSAxO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgbGltaXQgPSBsaW1pdHAxO1xuICAgICAgICB9XG4gICAgICAgIGNvbnN0IGZhY3MgPSBmYWN0b3JpbnQoYmFzZSwgbGltaXQpO1xuICAgICAgICBmb3IgKGNvbnN0IFtiLCBlXSBvZiBmYWNzLmVudHJpZXMoKSkge1xuICAgICAgICAgICAgZmFjdG9yc1tiXSA9IGV4cCplO1xuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgaWYgKGlzcHJpbWUobikpIHtcbiAgICAgICAgZmFjdG9ycy5hZGQobiwgMSk7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcigpO1xuICAgIH1cbiAgICBpZiAobiA9PT0gMSkge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoKTtcbiAgICB9XG59XG5cbmZ1bmN0aW9uIF90cmlhbChmYWN0b3JzOiBhbnksIG46IG51bWJlciwgY2FuZGlkYXRlczogYW55KSB7XG4gICAgLypcbiAgICBIZWxwZXIgZnVuY3Rpb24gZm9yIGludGVnZXIgZmFjdG9yaXphdGlvbi4gVHJpYWwgZmFjdG9ycyBgYG5gXG4gICAgYWdhaW5zdCBhbGwgaW50ZWdlcnMgZ2l2ZW4gaW4gdGhlIHNlcXVlbmNlIGBgY2FuZGlkYXRlc2BgXG4gICAgYW5kIHVwZGF0ZXMgdGhlIGRpY3QgYGBmYWN0b3JzYGAgaW4tcGxhY2UuIFJldHVybnMgdGhlIHJlZHVjZWRcbiAgICB2YWx1ZSBvZiBgYG5gYCBhbmQgYSBmbGFnIGluZGljYXRpbmcgd2hldGhlciBhbnkgZmFjdG9ycyB3ZXJlIGZvdW5kLlxuICAgICovXG4gICAgY29uc3QgbmZhY3RvcnMgPSBmYWN0b3JzLmxlbmd0aDtcbiAgICBmb3IgKGNvbnN0IGQgb2YgY2FuZGlkYXRlcykge1xuICAgICAgICBpZiAobiAlIGQgPT09IDApIHtcbiAgICAgICAgICAgIGNvbnN0IG0gPSBtdWx0aXBsaWNpdHkoZCwgbik7XG4gICAgICAgICAgICBuID0gTWF0aC5mbG9vcihuLyhkKiptKSk7XG4gICAgICAgICAgICBmYWN0b3JzW2RdID0gbTtcbiAgICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gW24sIGZhY3RvcnMubGVuZ3RoICE9PSBuZmFjdG9yc107XG59XG5cbmZ1bmN0aW9uIF9mYWN0b3JpbnRfc21hbGwoZmFjdG9yczogSGFzaERpY3QsIG46IGFueSwgbGltaXQ6IGFueSwgZmFpbF9tYXg6IGFueSkge1xuICAgIC8qXG4gICAgUmV0dXJuIHRoZSB2YWx1ZSBvZiBuIGFuZCBlaXRoZXIgYSAwIChpbmRpY2F0aW5nIHRoYXQgZmFjdG9yaXphdGlvbiB1cFxuICAgIHRvIHRoZSBsaW1pdCB3YXMgY29tcGxldGUpIG9yIGVsc2UgdGhlIG5leHQgbmVhci1wcmltZSB0aGF0IHdvdWxkIGhhdmVcbiAgICBiZWVuIHRlc3RlZC5cbiAgICBGYWN0b3Jpbmcgc3RvcHMgaWYgdGhlcmUgYXJlIGZhaWxfbWF4IHVuc3VjY2Vzc2Z1bCB0ZXN0cyBpbiBhIHJvdy5cbiAgICBJZiBmYWN0b3JzIG9mIG4gd2VyZSBmb3VuZCB0aGV5IHdpbGwgYmUgaW4gdGhlIGZhY3RvcnMgZGljdGlvbmFyeSBhc1xuICAgIHtmYWN0b3I6IG11bHRpcGxpY2l0eX0gYW5kIHRoZSByZXR1cm5lZCB2YWx1ZSBvZiBuIHdpbGwgaGF2ZSBoYWQgdGhvc2VcbiAgICBmYWN0b3JzIHJlbW92ZWQuIFRoZSBmYWN0b3JzIGRpY3Rpb25hcnkgaXMgbW9kaWZpZWQgaW4tcGxhY2UuXG4gICAgKi9cbiAgICBmdW5jdGlvbiBkb25lKG46IG51bWJlciwgZDogbnVtYmVyKSB7XG4gICAgICAgIC8qXG4gICAgICAgIHJldHVybiBuLCBkIGlmIHRoZSBzcXJ0KG4pIHdhcyBub3QgcmVhY2hlZCB5ZXQsIGVsc2VcbiAgICAgICAgbiwgMCBpbmRpY2F0aW5nIHRoYXQgZmFjdG9yaW5nIGlzIGRvbmUuXG4gICAgICAgICovXG4gICAgICAgIGlmIChkKmQgPD0gbikge1xuICAgICAgICAgICAgcmV0dXJuIFtuLCBkXTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gW24sIDBdO1xuICAgIH1cbiAgICBsZXQgZCA9IDI7XG4gICAgbGV0IG0gPSB0cmFpbGluZyhuKTtcbiAgICBpZiAobSkge1xuICAgICAgICBmYWN0b3JzLmFkZChkLCBtKTtcbiAgICAgICAgbiA+Pj0gbTtcbiAgICB9XG4gICAgZCA9IDM7XG4gICAgaWYgKGxpbWl0IDwgZCkge1xuICAgICAgICBpZiAobiA+IDEpIHtcbiAgICAgICAgICAgIGZhY3RvcnMuYWRkKG4sIDEpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBkb25lKG4sIGQpO1xuICAgIH1cbiAgICBtID0gMDtcbiAgICB3aGlsZSAobiAlIGQgPT09IDApIHtcbiAgICAgICAgbiA9IE1hdGguZmxvb3Iobi9kKTtcbiAgICAgICAgbSsrO1xuICAgICAgICBpZiAobSA9PT0gMjApIHtcbiAgICAgICAgICAgIGNvbnN0IG1tID0gbXVsdGlwbGljaXR5KGQsIG4pO1xuICAgICAgICAgICAgbSArPSBtbTtcbiAgICAgICAgICAgIG4gPSBNYXRoLmZsb29yKG4vKGQqKm1tKSk7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuICAgIH1cbiAgICBpZiAobSkge1xuICAgICAgICBmYWN0b3JzLmFkZChkLCBtKTtcbiAgICB9XG4gICAgbGV0IG1heHg7XG4gICAgaWYgKGxpbWl0ICogbGltaXQgPiBuKSB7XG4gICAgICAgIG1heHggPSAwO1xuICAgIH0gZWxzZSB7XG4gICAgICAgIG1heHggPSBsaW1pdCpsaW1pdDtcbiAgICB9XG4gICAgbGV0IGRkID0gbWF4eCB8fCBuO1xuICAgIGQgPSA1O1xuICAgIGxldCBmYWlscyA9IDA7XG4gICAgd2hpbGUgKGZhaWxzIDwgZmFpbF9tYXgpIHtcbiAgICAgICAgaWYgKGQqZCA+IGRkKSB7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuICAgICAgICBtID0gMDtcbiAgICAgICAgd2hpbGUgKG4gJSBkID09PSAwKSB7XG4gICAgICAgICAgICBuID0gTWF0aC5mbG9vcihuL2QpO1xuICAgICAgICAgICAgbSsrO1xuICAgICAgICAgICAgaWYgKG0gPT09IDIwKSB7XG4gICAgICAgICAgICAgICAgY29uc3QgbW0gPSBtdWx0aXBsaWNpdHkoZCwgbik7XG4gICAgICAgICAgICAgICAgbSArPSBtbTtcbiAgICAgICAgICAgICAgICBuID0gTWF0aC5mbG9vcihuIC8gKGQqKm1tKSk7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgaWYgKG0pIHtcbiAgICAgICAgICAgIGZhY3RvcnMuYWRkKGQsIG0pO1xuICAgICAgICAgICAgZGQgPSBtYXh4IHx8IG47XG4gICAgICAgICAgICBmYWlscyA9IDA7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBmYWlscysrO1xuICAgICAgICB9XG4gICAgICAgIGQgKz0gMjtcbiAgICAgICAgaWYgKGQqZD4gZGQpIHtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG4gICAgICAgIG0gPSAwO1xuICAgICAgICB3aGlsZSAobiAlIGQgPT09IDApIHtcbiAgICAgICAgICAgIG4gPSBNYXRoLmZsb29yKG4gLyBkKTtcbiAgICAgICAgICAgIG0rKztcbiAgICAgICAgICAgIGlmIChtID09PSAyMCkge1xuICAgICAgICAgICAgICAgIGNvbnN0IG1tID0gbXVsdGlwbGljaXR5KGQsIG4pO1xuICAgICAgICAgICAgICAgIG0gKz0gbW07XG4gICAgICAgICAgICAgICAgbiA9IE1hdGguZmxvb3Iobi8oZCoqbW0pKTtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBpZiAobSkge1xuICAgICAgICAgICAgZmFjdG9ycy5hZGQoZCwgbSk7XG4gICAgICAgICAgICBkZCA9IG1heHggfHwgbjtcbiAgICAgICAgICAgIGZhaWxzID0gMDtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGZhaWxzKys7XG4gICAgICAgIH1cbiAgICAgICAgZCArPTQ7XG4gICAgfVxuICAgIHJldHVybiBkb25lKG4sIGQpO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gZmFjdG9yaW50KG46IGFueSwgbGltaXQ6IGFueSA9IHVuZGVmaW5lZCk6IEhhc2hEaWN0IHtcbiAgICAvKlxuICAgIEdpdmVuIGEgcG9zaXRpdmUgaW50ZWdlciBgYG5gYCwgYGBmYWN0b3JpbnQobilgYCByZXR1cm5zIGEgZGljdCBjb250YWluaW5nXG4gICAgdGhlIHByaW1lIGZhY3RvcnMgb2YgYGBuYGAgYXMga2V5cyBhbmQgdGhlaXIgcmVzcGVjdGl2ZSBtdWx0aXBsaWNpdGllc1xuICAgIGFzIHZhbHVlcy4gRm9yIGV4YW1wbGU6XG4gICAgPj4+IGZyb20gc3ltcHkubnRoZW9yeSBpbXBvcnQgZmFjdG9yaW50XG4gICAgPj4+IGZhY3RvcmludCgyMDAwKSAgICAjIDIwMDAgPSAoMioqNCkgKiAoNSoqMylcbiAgICB7MjogNCwgNTogM31cbiAgICA+Pj4gZmFjdG9yaW50KDY1NTM3KSAgICMgVGhpcyBudW1iZXIgaXMgcHJpbWVcbiAgICB7NjU1Mzc6IDF9XG4gICAgRm9yIGlucHV0IGxlc3MgdGhhbiAyLCBmYWN0b3JpbnQgYmVoYXZlcyBhcyBmb2xsb3dzOlxuICAgICAgICAtIGBgZmFjdG9yaW50KDEpYGAgcmV0dXJucyB0aGUgZW1wdHkgZmFjdG9yaXphdGlvbiwgYGB7fWBgXG4gICAgICAgIC0gYGBmYWN0b3JpbnQoMClgYCByZXR1cm5zIGBgezA6MX1gYFxuICAgICAgICAtIGBgZmFjdG9yaW50KC1uKWBgIGFkZHMgYGAtMToxYGAgdG8gdGhlIGZhY3RvcnMgYW5kIHRoZW4gZmFjdG9ycyBgYG5gYFxuICAgIFBhcnRpYWwgRmFjdG9yaXphdGlvbjpcbiAgICBJZiBgYGxpbWl0YGAgKD4gMykgaXMgc3BlY2lmaWVkLCB0aGUgc2VhcmNoIGlzIHN0b3BwZWQgYWZ0ZXIgcGVyZm9ybWluZ1xuICAgIHRyaWFsIGRpdmlzaW9uIHVwIHRvIChhbmQgaW5jbHVkaW5nKSB0aGUgbGltaXQgKG9yIHRha2luZyBhXG4gICAgY29ycmVzcG9uZGluZyBudW1iZXIgb2YgcmhvL3AtMSBzdGVwcykuIFRoaXMgaXMgdXNlZnVsIGlmIG9uZSBoYXNcbiAgICBhIGxhcmdlIG51bWJlciBhbmQgb25seSBpcyBpbnRlcmVzdGVkIGluIGZpbmRpbmcgc21hbGwgZmFjdG9ycyAoaWZcbiAgICBhbnkpLiBOb3RlIHRoYXQgc2V0dGluZyBhIGxpbWl0IGRvZXMgbm90IHByZXZlbnQgbGFyZ2VyIGZhY3RvcnNcbiAgICBmcm9tIGJlaW5nIGZvdW5kIGVhcmx5OyBpdCBzaW1wbHkgbWVhbnMgdGhhdCB0aGUgbGFyZ2VzdCBmYWN0b3IgbWF5XG4gICAgYmUgY29tcG9zaXRlLiBTaW5jZSBjaGVja2luZyBmb3IgcGVyZmVjdCBwb3dlciBpcyByZWxhdGl2ZWx5IGNoZWFwLCBpdCBpc1xuICAgIGRvbmUgcmVnYXJkbGVzcyBvZiB0aGUgbGltaXQgc2V0dGluZy5cbiAgICBUaGlzIG51bWJlciwgZm9yIGV4YW1wbGUsIGhhcyB0d28gc21hbGwgZmFjdG9ycyBhbmQgYSBodWdlXG4gICAgc2VtaS1wcmltZSBmYWN0b3IgdGhhdCBjYW5ub3QgYmUgcmVkdWNlZCBlYXNpbHk6XG4gICAgPj4+IGZyb20gc3ltcHkubnRoZW9yeSBpbXBvcnQgaXNwcmltZVxuICAgID4+PiBhID0gMTQwNzYzMzcxNzI2MjMzODk1NzQzMDY5NzkyMTQ0Njg4M1xuICAgID4+PiBmID0gZmFjdG9yaW50KGEsIGxpbWl0PTEwMDAwKVxuICAgID4+PiBmID09IHs5OTE6IDEsIGludCgyMDI5MTY3ODIwNzYxNjI0NTYwMjI4NzcwMjQ4NTkpOiAxLCA3OiAxfVxuICAgIFRydWVcbiAgICA+Pj4gaXNwcmltZShtYXgoZikpXG4gICAgRmFsc2VcbiAgICBUaGlzIG51bWJlciBoYXMgYSBzbWFsbCBmYWN0b3IgYW5kIGEgcmVzaWR1YWwgcGVyZmVjdCBwb3dlciB3aG9zZVxuICAgIGJhc2UgaXMgZ3JlYXRlciB0aGFuIHRoZSBsaW1pdDpcbiAgICA+Pj4gZmFjdG9yaW50KDMqMTAxKio3LCBsaW1pdD01KVxuICAgIHszOiAxLCAxMDE6IDd9XG4gICAgTGlzdCBvZiBGYWN0b3JzOlxuICAgIElmIGBgbXVsdGlwbGVgYCBpcyBzZXQgdG8gYGBUcnVlYGAgdGhlbiBhIGxpc3QgY29udGFpbmluZyB0aGVcbiAgICBwcmltZSBmYWN0b3JzIGluY2x1ZGluZyBtdWx0aXBsaWNpdGllcyBpcyByZXR1cm5lZC5cbiAgICA+Pj4gZmFjdG9yaW50KDI0LCBtdWx0aXBsZT1UcnVlKVxuICAgIFsyLCAyLCAyLCAzXVxuICAgIFZpc3VhbCBGYWN0b3JpemF0aW9uOlxuICAgIElmIGBgdmlzdWFsYGAgaXMgc2V0IHRvIGBgVHJ1ZWBgLCB0aGVuIGl0IHdpbGwgcmV0dXJuIGEgdmlzdWFsXG4gICAgZmFjdG9yaXphdGlvbiBvZiB0aGUgaW50ZWdlci4gIEZvciBleGFtcGxlOlxuICAgID4+PiBmcm9tIHN5bXB5IGltcG9ydCBwcHJpbnRcbiAgICA+Pj4gcHByaW50KGZhY3RvcmludCg0MjAwLCB2aXN1YWw9VHJ1ZSkpXG4gICAgIDMgIDEgIDIgIDFcbiAgICAyICozICo1ICo3XG4gICAgTm90ZSB0aGF0IHRoaXMgaXMgYWNoaWV2ZWQgYnkgdXNpbmcgdGhlIGV2YWx1YXRlPUZhbHNlIGZsYWcgaW4gTXVsXG4gICAgYW5kIFBvdy4gSWYgeW91IGRvIG90aGVyIG1hbmlwdWxhdGlvbnMgd2l0aCBhbiBleHByZXNzaW9uIHdoZXJlXG4gICAgZXZhbHVhdGU9RmFsc2UsIGl0IG1heSBldmFsdWF0ZS4gIFRoZXJlZm9yZSwgeW91IHNob3VsZCB1c2UgdGhlXG4gICAgdmlzdWFsIG9wdGlvbiBvbmx5IGZvciB2aXN1YWxpemF0aW9uLCBhbmQgdXNlIHRoZSBub3JtYWwgZGljdGlvbmFyeVxuICAgIHJldHVybmVkIGJ5IHZpc3VhbD1GYWxzZSBpZiB5b3Ugd2FudCB0byBwZXJmb3JtIG9wZXJhdGlvbnMgb24gdGhlXG4gICAgZmFjdG9ycy5cbiAgICBZb3UgY2FuIGVhc2lseSBzd2l0Y2ggYmV0d2VlbiB0aGUgdHdvIGZvcm1zIGJ5IHNlbmRpbmcgdGhlbSBiYWNrIHRvXG4gICAgZmFjdG9yaW50OlxuICAgID4+PiBmcm9tIHN5bXB5IGltcG9ydCBNdWxcbiAgICA+Pj4gcmVndWxhciA9IGZhY3RvcmludCgxNzY0KTsgcmVndWxhclxuICAgIHsyOiAyLCAzOiAyLCA3OiAyfVxuICAgID4+PiBwcHJpbnQoZmFjdG9yaW50KHJlZ3VsYXIpKVxuICAgICAyICAyICAyXG4gICAgMiAqMyAqN1xuICAgID4+PiB2aXN1YWwgPSBmYWN0b3JpbnQoMTc2NCwgdmlzdWFsPVRydWUpOyBwcHJpbnQodmlzdWFsKVxuICAgICAyICAyICAyXG4gICAgMiAqMyAqN1xuICAgID4+PiBwcmludChmYWN0b3JpbnQodmlzdWFsKSlcbiAgICB7MjogMiwgMzogMiwgNzogMn1cbiAgICBJZiB5b3Ugd2FudCB0byBzZW5kIGEgbnVtYmVyIHRvIGJlIGZhY3RvcmVkIGluIGEgcGFydGlhbGx5IGZhY3RvcmVkIGZvcm1cbiAgICB5b3UgY2FuIGRvIHNvIHdpdGggYSBkaWN0aW9uYXJ5IG9yIHVuZXZhbHVhdGVkIGV4cHJlc3Npb246XG4gICAgPj4+IGZhY3RvcmludChmYWN0b3JpbnQoezQ6IDIsIDEyOiAzfSkpICMgdHdpY2UgdG8gdG9nZ2xlIHRvIGRpY3QgZm9ybVxuICAgIHsyOiAxMCwgMzogM31cbiAgICA+Pj4gZmFjdG9yaW50KE11bCg0LCAxMiwgZXZhbHVhdGU9RmFsc2UpKVxuICAgIHsyOiA0LCAzOiAxfVxuICAgIFRoZSB0YWJsZSBvZiB0aGUgb3V0cHV0IGxvZ2ljIGlzOlxuICAgICAgICA9PT09PT0gPT09PT09ID09PT09PT0gPT09PT09PVxuICAgICAgICAgICAgICAgICAgICAgICBWaXN1YWxcbiAgICAgICAgLS0tLS0tIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAgICAgSW5wdXQgIFRydWUgICBGYWxzZSAgIG90aGVyXG4gICAgICAgID09PT09PSA9PT09PT0gPT09PT09PSA9PT09PT09XG4gICAgICAgIGRpY3QgICAgbXVsICAgIGRpY3QgICAgbXVsXG4gICAgICAgIG4gICAgICAgbXVsICAgIGRpY3QgICAgZGljdFxuICAgICAgICBtdWwgICAgIG11bCAgICBkaWN0ICAgIGRpY3RcbiAgICAgICAgPT09PT09ID09PT09PSA9PT09PT09ID09PT09PT1cbiAgICBOb3Rlc1xuICAgID09PT09XG4gICAgQWxnb3JpdGhtOlxuICAgIFRoZSBmdW5jdGlvbiBzd2l0Y2hlcyBiZXR3ZWVuIG11bHRpcGxlIGFsZ29yaXRobXMuIFRyaWFsIGRpdmlzaW9uXG4gICAgcXVpY2tseSBmaW5kcyBzbWFsbCBmYWN0b3JzIChvZiB0aGUgb3JkZXIgMS01IGRpZ2l0cyksIGFuZCBmaW5kc1xuICAgIGFsbCBsYXJnZSBmYWN0b3JzIGlmIGdpdmVuIGVub3VnaCB0aW1lLiBUaGUgUG9sbGFyZCByaG8gYW5kIHAtMVxuICAgIGFsZ29yaXRobXMgYXJlIHVzZWQgdG8gZmluZCBsYXJnZSBmYWN0b3JzIGFoZWFkIG9mIHRpbWU7IHRoZXlcbiAgICB3aWxsIG9mdGVuIGZpbmQgZmFjdG9ycyBvZiB0aGUgb3JkZXIgb2YgMTAgZGlnaXRzIHdpdGhpbiBhIGZld1xuICAgIHNlY29uZHM6XG4gICAgPj4+IGZhY3RvcnMgPSBmYWN0b3JpbnQoMTIzNDU2Nzg5MTAxMTEyMTMxNDE1MTYpXG4gICAgPj4+IGZvciBiYXNlLCBleHAgaW4gc29ydGVkKGZhY3RvcnMuaXRlbXMoKSk6XG4gICAgLi4uICAgICBwcmludCgnJXMgJXMnICUgKGJhc2UsIGV4cCkpXG4gICAgLi4uXG4gICAgMiAyXG4gICAgMjUwNzE5MTY5MSAxXG4gICAgMTIzMTAyNjYyNTc2OSAxXG4gICAgQW55IG9mIHRoZXNlIG1ldGhvZHMgY2FuIG9wdGlvbmFsbHkgYmUgZGlzYWJsZWQgd2l0aCB0aGUgZm9sbG93aW5nXG4gICAgYm9vbGVhbiBwYXJhbWV0ZXJzOlxuICAgICAgICAtIGBgdXNlX3RyaWFsYGA6IFRvZ2dsZSB1c2Ugb2YgdHJpYWwgZGl2aXNpb25cbiAgICAgICAgLSBgYHVzZV9yaG9gYDogVG9nZ2xlIHVzZSBvZiBQb2xsYXJkJ3MgcmhvIG1ldGhvZFxuICAgICAgICAtIGBgdXNlX3BtMWBgOiBUb2dnbGUgdXNlIG9mIFBvbGxhcmQncyBwLTEgbWV0aG9kXG4gICAgYGBmYWN0b3JpbnRgYCBhbHNvIHBlcmlvZGljYWxseSBjaGVja3MgaWYgdGhlIHJlbWFpbmluZyBwYXJ0IGlzXG4gICAgYSBwcmltZSBudW1iZXIgb3IgYSBwZXJmZWN0IHBvd2VyLCBhbmQgaW4gdGhvc2UgY2FzZXMgc3RvcHMuXG4gICAgRm9yIHVuZXZhbHVhdGVkIGZhY3RvcmlhbCwgaXQgdXNlcyBMZWdlbmRyZSdzIGZvcm11bGEodGhlb3JlbSkuXG4gICAgSWYgYGB2ZXJib3NlYGAgaXMgc2V0IHRvIGBgVHJ1ZWBgLCBkZXRhaWxlZCBwcm9ncmVzcyBpcyBwcmludGVkLlxuICAgIFNlZSBBbHNvXG4gICAgPT09PT09PT1cbiAgICBzbW9vdGhuZXNzLCBzbW9vdGhuZXNzX3AsIGRpdmlzb3JzXG4gICAgKi9cbiAgICBpZiAobiBpbnN0YW5jZW9mIEludGVnZXIpIHtcbiAgICAgICAgbiA9IG4ucDtcbiAgICB9XG4gICAgbiA9IGFzX2ludChuKTtcbiAgICBpZiAobGltaXQpIHtcbiAgICAgICAgbGltaXQgPSBsaW1pdCBhcyBudW1iZXI7XG4gICAgfVxuICAgIGlmIChuIDwgMCkge1xuICAgICAgICBjb25zdCBmYWN0b3JzID0gZmFjdG9yaW50KC1uLCBsaW1pdCk7XG4gICAgICAgIGZhY3RvcnMuYWRkKGZhY3RvcnMuc2l6ZSAtIDEsIDEpO1xuICAgICAgICByZXR1cm4gZmFjdG9ycztcbiAgICB9XG4gICAgaWYgKGxpbWl0ICYmIGxpbWl0IDwgMikge1xuICAgICAgICBpZiAobiA9PT0gMSkge1xuICAgICAgICAgICAgcmV0dXJuIG5ldyBIYXNoRGljdCgpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBuZXcgSGFzaERpY3Qoe246IDF9KTtcbiAgICB9IGVsc2UgaWYgKG4gPCAxMCkge1xuICAgICAgICByZXR1cm4gbmV3IEhhc2hEaWN0KFt7MDogMX0sIHt9LCB7MjogMX0sIHszOiAxfSwgezI6IDJ9LCB7NTogMX0sXG4gICAgICAgICAgICB7MjogMSwgMzogMX0sIHs3OiAxfSwgezI6IDN9LCB7MzogMn1dW25dKTtcbiAgICB9XG5cbiAgICBjb25zdCBmYWN0b3JzID0gbmV3IEhhc2hEaWN0KCk7XG4gICAgbGV0IHNtYWxsID0gMioqMTU7XG4gICAgY29uc3QgZmFpbF9tYXggPSA2MDA7XG4gICAgc21hbGwgPSBNYXRoLm1pbihzbWFsbCwgbGltaXQgfHwgc21hbGwpO1xuICAgIGxldCBuZXh0X3A7XG4gICAgW24sIG5leHRfcF0gPSBfZmFjdG9yaW50X3NtYWxsKGZhY3RvcnMsIG4sIHNtYWxsLCBmYWlsX21heCk7XG4gICAgbGV0IHNxcnRfbjogYW55O1xuICAgIHRyeSB7XG4gICAgICAgIGlmIChsaW1pdCAmJiBuZXh0X3AgPiBsaW1pdCkge1xuICAgICAgICAgICAgX2NoZWNrX3Rlcm1pbmF0aW9uKGZhY3RvcnMsIG4sIGxpbWl0KTtcbiAgICAgICAgICAgIGlmIChuID4gMSkge1xuICAgICAgICAgICAgICAgIGZhY3RvcnMuYWRkKG4sIDEpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIGZhY3RvcnM7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBzcXJ0X24gPSBpbnRfbnRocm9vdChuLCAyKVswXTtcbiAgICAgICAgICAgIGxldCBhID0gc3FydF9uICsgMTtcbiAgICAgICAgICAgIGNvbnN0IGEyID0gYSoqMjtcbiAgICAgICAgICAgIGxldCBiMiA9IGEyIC0gbjtcbiAgICAgICAgICAgIGxldCBiOiBhbnk7IGxldCBmZXJtYXQ6IGFueTtcbiAgICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgMzsgaSsrKSB7XG4gICAgICAgICAgICAgICAgW2IsIGZlcm1hdF0gPSBpbnRfbnRocm9vdChiMiwgMik7XG4gICAgICAgICAgICAgICAgaWYgKGZlcm1hdCkge1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgYjIgKz0gMiphICsgMTtcbiAgICAgICAgICAgICAgICBhKys7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoZmVybWF0KSB7XG4gICAgICAgICAgICAgICAgaWYgKGxpbWl0KSB7XG4gICAgICAgICAgICAgICAgICAgIGxpbWl0IC09IDE7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGZvciAoY29uc3QgciBvZiBbYSAtIGIsIGEgKyBiXSkge1xuICAgICAgICAgICAgICAgICAgICBjb25zdCBmYWNzID0gZmFjdG9yaW50KHIsIGxpbWl0KTtcbiAgICAgICAgICAgICAgICAgICAgZm9yIChjb25zdCBbaywgdl0gb2YgZmFjcy5lbnRyaWVzKCkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGZhY3RvcnMuYWRkKGssIGZhY3RvcnMuZ2V0KGssIDApICsgdik7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBfY2hlY2tfdGVybWluYXRpb24oZmFjdG9ycywgbiwgbGltaXQpO1xuICAgICAgICB9XG4gICAgfSBjYXRjaCAoRXJyb3IpIHtcbiAgICAgICAgcmV0dXJuIGZhY3RvcnM7XG4gICAgfVxuXG4gICAgbGV0IFtsb3csIGhpZ2hdID0gW25leHRfcCwgMiAqIG5leHRfcF07XG4gICAgbGltaXQgPSAobGltaXQgfHwgc3FydF9uKSBhcyBudW1iZXI7XG4gICAgbGltaXQrKztcbiAgICB3aGlsZSAoMSkge1xuICAgICAgICB0cnkge1xuICAgICAgICAgICAgbGV0IGhpZ2hfID0gaGlnaDtcbiAgICAgICAgICAgIGlmIChsaW1pdCA8IGhpZ2hfKSB7XG4gICAgICAgICAgICAgICAgaGlnaF8gPSBsaW1pdDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGNvbnN0IHBzID0gcHJpbWVyYW5nZShsb3csIGhpZ2hfKTtcbiAgICAgICAgICAgIGxldCBmb3VuZF90cmlhbDtcbiAgICAgICAgICAgIFtuLCBmb3VuZF90cmlhbF0gPSBfdHJpYWwoZmFjdG9ycywgbiwgcHMpO1xuICAgICAgICAgICAgaWYgKGZvdW5kX3RyaWFsKSB7XG4gICAgICAgICAgICAgICAgX2NoZWNrX3Rlcm1pbmF0aW9uKGZhY3RvcnMsIG4sIGxpbWl0KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChoaWdoID4gbGltaXQpIHtcbiAgICAgICAgICAgICAgICBpZiAobiA+IDEpIHtcbiAgICAgICAgICAgICAgICAgICAgZmFjdG9ycy5hZGQobiwgMSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcigpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKCFmb3VuZF90cmlhbCkge1xuICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcImFkdmFuY2VkIGZhY3RvcmluZyBtZXRob2RzIGFyZSBub3QgeWV0IGltcGxlbWVudGVkXCIpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9IGNhdGNoIChFcnJvcikge1xuICAgICAgICAgICAgcmV0dXJuIGZhY3RvcnM7XG4gICAgICAgIH1cbiAgICAgICAgW2xvdywgaGlnaF0gPSBbaGlnaCwgaGlnaCoyXTtcbiAgICB9XG4gICAgbGV0IEIxID0gMTAwMDA7XG4gICAgbGV0IEIyID0gMTAwKkIxO1xuICAgIGxldCBudW1fY3VydmVzID0gNTA7XG4gICAgd2hpbGUgKDEpIHtcbiAgICAgICAgd2hpbGUgKDEpIHtcbiAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiZWNtIG9uZSBmYWN0b3Igbm90IHlldCBpbXBsZW1lbnRlZFwiKTtcbiAgICAgICAgICAgICAgICAvLyBfY2hlY2tfdGVybWluYXRpb24oZmFjdG9ycywgbiwgbGltaXQpO1xuICAgICAgICAgICAgfSBjYXRjaCAoRXJyb3IpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gZmFjdG9ycztcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBCMSAqPSA1O1xuICAgICAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tdW51c2VkLXZhcnNcbiAgICAgICAgQjIgPSAxMDAqQjE7XG4gICAgICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBuby11bnVzZWQtdmFyc1xuICAgICAgICBudW1fY3VydmVzICo9IDQ7XG4gICAgfVxufVxuXG5leHBvcnQgZnVuY3Rpb24gcGVyZmVjdF9wb3dlcihuOiBhbnksIGNhbmRpZGF0ZXM6IGFueSA9IHVuZGVmaW5lZCwgYmlnOiBib29sZWFuID0gdHJ1ZSxcbiAgICBmYWN0b3I6IGJvb2xlYW4gPSB0cnVlLCBudW1faXRlcmF0aW9uczogbnVtYmVyID0gMTUpOiBhbnkge1xuICAgIC8qXG4gICAgUmV0dXJuIGBgKGIsIGUpYGAgc3VjaCB0aGF0IGBgbmBgID09IGBgYioqZWBgIGlmIGBgbmBgIGlzIGEgdW5pcXVlXG4gICAgcGVyZmVjdCBwb3dlciB3aXRoIGBgZSA+IDFgYCwgZWxzZSBgYEZhbHNlYGAgKGUuZy4gMSBpcyBub3QgYVxuICAgIHBlcmZlY3QgcG93ZXIpLiBBIFZhbHVlRXJyb3IgaXMgcmFpc2VkIGlmIGBgbmBgIGlzIG5vdCBSYXRpb25hbC5cbiAgICBCeSBkZWZhdWx0LCB0aGUgYmFzZSBpcyByZWN1cnNpdmVseSBkZWNvbXBvc2VkIGFuZCB0aGUgZXhwb25lbnRzXG4gICAgY29sbGVjdGVkIHNvIHRoZSBsYXJnZXN0IHBvc3NpYmxlIGBgZWBgIGlzIHNvdWdodC4gSWYgYGBiaWc9RmFsc2VgYFxuICAgIHRoZW4gdGhlIHNtYWxsZXN0IHBvc3NpYmxlIGBgZWBgICh0aHVzIHByaW1lKSB3aWxsIGJlIGNob3Nlbi5cbiAgICBJZiBgYGZhY3Rvcj1UcnVlYGAgdGhlbiBzaW11bHRhbmVvdXMgZmFjdG9yaXphdGlvbiBvZiBgYG5gYCBpc1xuICAgIGF0dGVtcHRlZCBzaW5jZSBmaW5kaW5nIGEgZmFjdG9yIGluZGljYXRlcyB0aGUgb25seSBwb3NzaWJsZSByb290XG4gICAgZm9yIGBgbmBgLiBUaGlzIGlzIFRydWUgYnkgZGVmYXVsdCBzaW5jZSBvbmx5IGEgZmV3IHNtYWxsIGZhY3RvcnMgd2lsbFxuICAgIGJlIHRlc3RlZCBpbiB0aGUgY291cnNlIG9mIHNlYXJjaGluZyBmb3IgdGhlIHBlcmZlY3QgcG93ZXIuXG4gICAgVGhlIHVzZSBvZiBgYGNhbmRpZGF0ZXNgYCBpcyBwcmltYXJpbHkgZm9yIGludGVybmFsIHVzZTsgaWYgcHJvdmlkZWQsXG4gICAgRmFsc2Ugd2lsbCBiZSByZXR1cm5lZCBpZiBgYG5gYCBjYW5ub3QgYmUgd3JpdHRlbiBhcyBhIHBvd2VyIHdpdGggb25lXG4gICAgb2YgdGhlIGNhbmRpZGF0ZXMgYXMgYW4gZXhwb25lbnQgYW5kIGZhY3RvcmluZyAoYmV5b25kIHRlc3RpbmcgZm9yXG4gICAgYSBmYWN0b3Igb2YgMikgd2lsbCBub3QgYmUgYXR0ZW1wdGVkLlxuICAgIEV4YW1wbGVzXG4gICAgPT09PT09PT1cbiAgICA+Pj4gZnJvbSBzeW1weSBpbXBvcnQgcGVyZmVjdF9wb3dlciwgUmF0aW9uYWxcbiAgICA+Pj4gcGVyZmVjdF9wb3dlcigxNilcbiAgICAoMiwgNClcbiAgICA+Pj4gcGVyZmVjdF9wb3dlcigxNiwgYmlnPUZhbHNlKVxuICAgICg0LCAyKVxuICAgIE5lZ2F0aXZlIG51bWJlcnMgY2FuIG9ubHkgaGF2ZSBvZGQgcGVyZmVjdCBwb3dlcnM6XG4gICAgPj4+IHBlcmZlY3RfcG93ZXIoLTQpXG4gICAgRmFsc2VcbiAgICA+Pj4gcGVyZmVjdF9wb3dlcigtOClcbiAgICAoLTIsIDMpXG4gICAgUmF0aW9uYWxzIGFyZSBhbHNvIHJlY29nbml6ZWQ6XG4gICAgPj4+IHBlcmZlY3RfcG93ZXIoUmF0aW9uYWwoMSwgMikqKjMpXG4gICAgKDEvMiwgMylcbiAgICA+Pj4gcGVyZmVjdF9wb3dlcihSYXRpb25hbCgtMywgMikqKjMpXG4gICAgKC0zLzIsIDMpXG4gICAgTm90ZXNcbiAgICA9PT09PVxuICAgIFRvIGtub3cgd2hldGhlciBhbiBpbnRlZ2VyIGlzIGEgcGVyZmVjdCBwb3dlciBvZiAyIHVzZVxuICAgICAgICA+Pj4gaXMycG93ID0gbGFtYmRhIG46IGJvb2wobiBhbmQgbm90IG4gJiAobiAtIDEpKVxuICAgICAgICA+Pj4gWyhpLCBpczJwb3coaSkpIGZvciBpIGluIHJhbmdlKDUpXVxuICAgICAgICBbKDAsIEZhbHNlKSwgKDEsIFRydWUpLCAoMiwgVHJ1ZSksICgzLCBGYWxzZSksICg0LCBUcnVlKV1cbiAgICBJdCBpcyBub3QgbmVjZXNzYXJ5IHRvIHByb3ZpZGUgYGBjYW5kaWRhdGVzYGAuIFdoZW4gcHJvdmlkZWRcbiAgICBpdCB3aWxsIGJlIGFzc3VtZWQgdGhhdCB0aGV5IGFyZSBpbnRzLiBUaGUgZmlyc3Qgb25lIHRoYXQgaXNcbiAgICBsYXJnZXIgdGhhbiB0aGUgY29tcHV0ZWQgbWF4aW11bSBwb3NzaWJsZSBleHBvbmVudCB3aWxsIHNpZ25hbFxuICAgIGZhaWx1cmUgZm9yIHRoZSByb3V0aW5lLlxuICAgICAgICA+Pj4gcGVyZmVjdF9wb3dlcigzKio4LCBbOV0pXG4gICAgICAgIEZhbHNlXG4gICAgICAgID4+PiBwZXJmZWN0X3Bvd2VyKDMqKjgsIFsyLCA0LCA4XSlcbiAgICAgICAgKDMsIDgpXG4gICAgICAgID4+PiBwZXJmZWN0X3Bvd2VyKDMqKjgsIFs0LCA4XSwgYmlnPUZhbHNlKVxuICAgICAgICAoOSwgNClcbiAgICBTZWUgQWxzb1xuICAgID09PT09PT09XG4gICAgc3ltcHkuY29yZS5wb3dlci5pbnRlZ2VyX250aHJvb3RcbiAgICBzeW1weS5udGhlb3J5LnByaW1ldGVzdC5pc19zcXVhcmVcbiAgICAqL1xuICAgIGxldCBwcDtcbiAgICBpZiAobiBpbnN0YW5jZW9mIFJhdGlvbmFsICYmICEobi5pc19pbnRlZ2VyKSkge1xuICAgICAgICBjb25zdCBbcCwgcV0gPSBuLl9hc19udW1lcl9kZW5vbSgpO1xuICAgICAgICBpZiAocCA9PT0gUy5PbmUpIHtcbiAgICAgICAgICAgIHBwID0gcGVyZmVjdF9wb3dlcihxKTtcbiAgICAgICAgICAgIGlmIChwcCkge1xuICAgICAgICAgICAgICAgIHBwID0gW24uY29uc3RydWN0b3IoMSwgcHBbMF0pLCBwcFsxXV07XG4gICAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBwcCA9IHBlcmZlY3RfcG93ZXIocCk7XG4gICAgICAgICAgICBpZiAocHApIHtcbiAgICAgICAgICAgICAgICBjb25zdCBbbnVtLCBlXSA9IHBwO1xuICAgICAgICAgICAgICAgIGNvbnN0IHBxID0gcGVyZmVjdF9wb3dlcihxLCBbZV0pO1xuICAgICAgICAgICAgICAgIGlmIChwcSkge1xuICAgICAgICAgICAgICAgICAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tdW51c2VkLXZhcnNcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgW2RlbiwgYmxhbmtdID0gcHE7XG4gICAgICAgICAgICAgICAgICAgIHBwID0gW24uY29uc3RydWN0b3IobnVtLCBkZW4pLCBlXTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHBwO1xuICAgIH1cblxuICAgIG4gPSBhc19pbnQobik7XG4gICAgaWYgKG4gPCAwKSB7XG4gICAgICAgIHBwID0gcGVyZmVjdF9wb3dlcigtbik7XG4gICAgICAgIGlmIChwcCkge1xuICAgICAgICAgICAgY29uc3QgW2IsIGVdID0gcHA7XG4gICAgICAgICAgICBpZiAoZSAlIDIgIT09IDApIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gWy1iLCBlXTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuXG4gICAgaWYgKG4gPD0gMykge1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuXG4gICAgY29uc3QgbG9nbiA9IE1hdGgubG9nMihuKTtcbiAgICBjb25zdCBtYXhfcG9zc2libGUgPSBNYXRoLmZsb29yKGxvZ24pICsgMjtcbiAgICBjb25zdCBub3Rfc3F1YXJlID0gWzIsIDMsIDcsIDhdLmluY2x1ZGVzKG4gJSAxMCk7XG4gICAgY29uc3QgbWluX3Bvc3NpYmxlID0gMiArIChub3Rfc3F1YXJlIGFzIGFueSBhcyBudW1iZXIpO1xuICAgIGlmICh0eXBlb2YgY2FuZGlkYXRlcyA9PT0gXCJ1bmRlZmluZWRcIikge1xuICAgICAgICBjYW5kaWRhdGVzID0gcHJpbWVyYW5nZShtaW5fcG9zc2libGUsIG1heF9wb3NzaWJsZSk7XG4gICAgfSBlbHNlIHtcbiAgICAgICAgY29uc3QgdGVtcCA9IFtdO1xuICAgICAgICBjYW5kaWRhdGVzLnNvcnQoKTtcbiAgICAgICAgZm9yIChjb25zdCBpIG9mIGNhbmRpZGF0ZXMpIHtcbiAgICAgICAgICAgIGlmIChtaW5fcG9zc2libGUgPD0gaSAmJiBpIDw9IG1heF9wb3NzaWJsZSkge1xuICAgICAgICAgICAgICAgIHRlbXAucHVzaChpKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBjYW5kaWRhdGVzID0gdGVtcDtcbiAgICAgICAgaWYgKG4gJSAyID09PSAwKSB7XG4gICAgICAgICAgICBjb25zdCBlID0gdHJhaWxpbmcobik7XG4gICAgICAgICAgICBjb25zdCB0ZW1wMiA9IFtdO1xuICAgICAgICAgICAgZm9yIChjb25zdCBpIG9mIGNhbmRpZGF0ZXMpIHtcbiAgICAgICAgICAgICAgICBpZiAoZSAlIGkgPT09IDApIHtcbiAgICAgICAgICAgICAgICAgICAgdGVtcDIucHVzaChpKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBjYW5kaWRhdGVzID0gdGVtcDI7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGJpZykge1xuICAgICAgICAgICAgY2FuZGlkYXRlcy5yZXZlcnNlKCk7XG4gICAgICAgIH1cbiAgICAgICAgZm9yIChjb25zdCBlIG9mIGNhbmRpZGF0ZXMpIHtcbiAgICAgICAgICAgIGNvbnN0IFtyLCBva10gPSBpbnRfbnRocm9vdChuLCBlKTtcbiAgICAgICAgICAgIGlmIChvaykge1xuICAgICAgICAgICAgICAgIHJldHVybiBbciwgZV07XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgICBmdW5jdGlvbiogX2ZhY3RvcnMobGVuZ3RoOiBudW1iZXIpIHtcbiAgICAgICAgbGV0IHJ2ID0gMiArIG4gJSAyO1xuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICB5aWVsZCBydjtcbiAgICAgICAgICAgIHJ2ID0gbmV4dHByaW1lKHJ2KTtcbiAgICAgICAgfVxuICAgIH1cbiAgICAvLyBvcmlnaW5hbCBhbGdvcml0aG0gZ2VuZXJhdGVzIGluZmluaXRlIHNlcXVlbmNlcyBvZiB0aGUgZm9sbG93aW5nXG4gICAgLy8gZm9yIG5vdyB3ZSB3aWxsIGdlbmVyYXRlIGxpbWl0ZWQgc2l6ZWQgYXJyYXlzIGFuZCB1c2UgdGhvc2VcbiAgICBjb25zdCBfY2FuZGlkYXRlcyA9IFtdO1xuICAgIGZvciAoY29uc3QgaSBvZiBjYW5kaWRhdGVzKSB7XG4gICAgICAgIF9jYW5kaWRhdGVzLnB1c2goaSk7XG4gICAgfVxuICAgIGNvbnN0IF9mYWN0b3JzXyA9IFtdO1xuICAgIGZvciAoY29uc3QgaSBvZiBfZmFjdG9ycyhfY2FuZGlkYXRlcy5sZW5ndGgpKSB7XG4gICAgICAgIF9mYWN0b3JzXy5wdXNoKGkpO1xuICAgIH1cbiAgICBmb3IgKGNvbnN0IGl0ZW0gb2YgVXRpbC56aXAoX2ZhY3RvcnNfLCBfY2FuZGlkYXRlcykpIHtcbiAgICAgICAgY29uc3QgZmFjID0gaXRlbVswXTtcbiAgICAgICAgbGV0IGUgPSBpdGVtWzFdO1xuICAgICAgICBsZXQgcjtcbiAgICAgICAgbGV0IGV4YWN0O1xuICAgICAgICBpZiAoZmFjdG9yICYmIG4gJSBmYWMgPT09IDApIHtcbiAgICAgICAgICAgIGlmIChmYWMgPT09IDIpIHtcbiAgICAgICAgICAgICAgICBlID0gdHJhaWxpbmcobik7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGUgPSBtdWx0aXBsaWNpdHkoZmFjLCBuKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChlID09PSAxKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBbciwgZXhhY3RdID0gaW50X250aHJvb3QobiwgZSk7XG4gICAgICAgICAgICBpZiAoIShleGFjdCkpIHtcbiAgICAgICAgICAgICAgICBjb25zdCBtID0gTWF0aC5mbG9vcihuIC8gZmFjKSAqKiBlO1xuICAgICAgICAgICAgICAgIGNvbnN0IHJFID0gcGVyZmVjdF9wb3dlcihtLCBkaXZpc29ycyhlLCB0cnVlKSk7XG4gICAgICAgICAgICAgICAgaWYgKCEockUpKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBsZXQgW3IsIEVdID0gckU7XG4gICAgICAgICAgICAgICAgICAgIFtyLCBlXSA9IFtmYWMqKihNYXRoLmZsb29yKGUvRSkqciksIEVdO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiBbciwgZV07XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGxvZ24vZSA8IDQwKSB7XG4gICAgICAgICAgICBjb25zdCBiID0gMi4wKioobG9nbi9lKTtcbiAgICAgICAgICAgIGlmIChNYXRoLmFicyhNYXRoLmZsb29yKGIgKyAwLjUpIC0gYikgPiAwLjAxKSB7XG4gICAgICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgW3IsIGV4YWN0XSA9IGludF9udGhyb290KG4sIGUpO1xuICAgICAgICBpZiAoZXhhY3QpIHtcbiAgICAgICAgICAgIGNvbnN0IG0gPSBwZXJmZWN0X3Bvd2VyKHIsIHVuZGVmaW5lZCwgYmlnLCBmYWN0b3IpO1xuICAgICAgICAgICAgaWYgKG0pIHtcbiAgICAgICAgICAgICAgICBbciwgZV0gPSBbbVswXSwgZSAqIG1bMV1dO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIFtNYXRoLmZsb29yKHIpLCBlXTtcbiAgICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gZmFsc2U7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBmYWN0b3JyYXQocmF0OiBhbnksIGxpbWl0OiBudW1iZXIgPSB1bmRlZmluZWQpIHtcbiAgICAvKlxuICAgIEdpdmVuIGEgUmF0aW9uYWwgYGByYGAsIGBgZmFjdG9ycmF0KHIpYGAgcmV0dXJucyBhIGRpY3QgY29udGFpbmluZ1xuICAgIHRoZSBwcmltZSBmYWN0b3JzIG9mIGBgcmBgIGFzIGtleXMgYW5kIHRoZWlyIHJlc3BlY3RpdmUgbXVsdGlwbGljaXRpZXNcbiAgICBhcyB2YWx1ZXMuIEZvciBleGFtcGxlOlxuICAgID4+PiBmcm9tIHN5bXB5IGltcG9ydCBmYWN0b3JyYXQsIFNcbiAgICA+Pj4gZmFjdG9ycmF0KFMoOCkvOSkgICAgIyA4LzkgPSAoMioqMykgKiAoMyoqLTIpXG4gICAgezI6IDMsIDM6IC0yfVxuICAgID4+PiBmYWN0b3JyYXQoUygtMSkvOTg3KSAgICAjIC0xLzc4OSA9IC0xICogKDMqKi0xKSAqICg3KiotMSkgKiAoNDcqKi0xKVxuICAgIHstMTogMSwgMzogLTEsIDc6IC0xLCA0NzogLTF9XG4gICAgUGxlYXNlIHNlZSB0aGUgZG9jc3RyaW5nIGZvciBgYGZhY3RvcmludGBgIGZvciBkZXRhaWxlZCBleHBsYW5hdGlvbnNcbiAgICBhbmQgZXhhbXBsZXMgb2YgdGhlIGZvbGxvd2luZyBrZXl3b3JkczpcbiAgICAgICAgLSBgYGxpbWl0YGA6IEludGVnZXIgbGltaXQgdXAgdG8gd2hpY2ggdHJpYWwgZGl2aXNpb24gaXMgZG9uZVxuICAgICAgICAtIGBgdXNlX3RyaWFsYGA6IFRvZ2dsZSB1c2Ugb2YgdHJpYWwgZGl2aXNpb25cbiAgICAgICAgLSBgYHVzZV9yaG9gYDogVG9nZ2xlIHVzZSBvZiBQb2xsYXJkJ3MgcmhvIG1ldGhvZFxuICAgICAgICAtIGBgdXNlX3BtMWBgOiBUb2dnbGUgdXNlIG9mIFBvbGxhcmQncyBwLTEgbWV0aG9kXG4gICAgICAgIC0gYGB2ZXJib3NlYGA6IFRvZ2dsZSBkZXRhaWxlZCBwcmludGluZyBvZiBwcm9ncmVzc1xuICAgICAgICAtIGBgbXVsdGlwbGVgYDogVG9nZ2xlIHJldHVybmluZyBhIGxpc3Qgb2YgZmFjdG9ycyBvciBkaWN0XG4gICAgICAgIC0gYGB2aXN1YWxgYDogVG9nZ2xlIHByb2R1Y3QgZm9ybSBvZiBvdXRwdXRcbiAgICAqL1xuICAgIGNvbnN0IGYgPSBmYWN0b3JpbnQocmF0LnAsIGxpbWl0KTtcbiAgICBmb3IgKGNvbnN0IGl0ZW0gb2YgZmFjdG9yaW50KHJhdC5xLCBsaW1pdCkuZW50cmllcygpKSB7XG4gICAgICAgIGNvbnN0IHAgPSBpdGVtWzBdO1xuICAgICAgICBjb25zdCBlID0gaXRlbVsxXTtcbiAgICAgICAgZi5hZGQocCwgZi5nZXQocCwgMCkgLSBlKTtcbiAgICB9XG4gICAgaWYgKGYuc2l6ZSA+IDEgJiYgZi5oYXMoMSkpIHtcbiAgICAgICAgZi5yZW1vdmUoMSk7XG4gICAgfVxuICAgIHJldHVybiBmO1xufVxuIiwgIi8qXG5Ob3RhYmxlIGNoYW5nZXMgbWFkZSAoYW5kIG5vdGVzKTpcbi0gQmFyZWJvbmVzIGltcGxlbWVudGF0aW9uIC0gb25seSBlbm91Z2ggYXMgbmVlZGVkIGZvciBzeW1ib2xcbiovXG5cbmltcG9ydCB7X0Jhc2ljfSBmcm9tIFwiLi9iYXNpYy5qc1wiO1xuaW1wb3J0IHtCb29sZWFuS2luZH0gZnJvbSBcIi4va2luZC5qc1wiO1xuaW1wb3J0IHtiYXNlLCBtaXh9IGZyb20gXCIuL3V0aWxpdHkuanNcIjtcbmltcG9ydCB7TWFuYWdlZFByb3BlcnRpZXN9IGZyb20gXCIuL2Fzc3VtcHRpb25zLmpzXCI7XG5cbmNvbnN0IEJvb2xlYW4gPSAoc3VwZXJjbGFzczogYW55KSA9PiBjbGFzcyBCb29sZWFuIGV4dGVuZHMgbWl4KGJhc2UpLndpdGgoX0Jhc2ljKSB7XG4gICAgX19zbG90c19fOiBhbnlbXSA9IFtdO1xuXG4gICAgc3RhdGljIGtpbmQgPSBCb29sZWFuS2luZDtcbn07XG5cbk1hbmFnZWRQcm9wZXJ0aWVzLnJlZ2lzdGVyKEJvb2xlYW4oT2JqZWN0KSk7XG5cbmV4cG9ydCB7Qm9vbGVhbn07XG4iLCAiLypcbk5vdGFibGUgY2hhbmdlc1xuLSBTdGlsbCBhIHdvcmsgaW4gcHJvZ3Jlc3MgKG5vdCBhbGwgbWV0aG9kcyBpbXBsZW1lbnRlZClcbi0gQ2xhc3Mgc3RydWN0dXJlIHJld29ya2VkIGJhc2VkIG9uIGEgY29uc3RydWN0b3Igc3lzdGVtICh2aWV3IHNvdXJjZSlcbiovXG5cbmltcG9ydCB7bWl4LCBiYXNlLCBIYXNoRGljdH0gZnJvbSBcIi4vdXRpbGl0eS5qc1wiO1xuaW1wb3J0IHtBdG9taWNFeHByfSBmcm9tIFwiLi9leHByLmpzXCI7XG5pbXBvcnQge0Jvb2xlYW59IGZyb20gXCIuL2Jvb2xhbGcuanNcIjtcbmltcG9ydCB7TnVtYmVyS2luZCwgVW5kZWZpbmVkS2luZH0gZnJvbSBcIi4va2luZC5qc1wiO1xuaW1wb3J0IHtmdXp6eV9ib29sX3YyfSBmcm9tIFwiLi9sb2dpYy5qc1wiO1xuaW1wb3J0IHtTdGRGYWN0S0J9IGZyb20gXCIuL2Fzc3VtcHRpb25zLmpzXCI7XG5pbXBvcnQge01hbmFnZWRQcm9wZXJ0aWVzfSBmcm9tIFwiLi9hc3N1bXB0aW9ucy5qc1wiO1xuXG5cbmNsYXNzIFN5bWJvbCBleHRlbmRzIG1peChiYXNlKS53aXRoKEJvb2xlYW4sIEF0b21pY0V4cHIpIHtcbiAgICAvKlxuICAgIEFzc3VtcHRpb25zOlxuICAgICAgIGNvbW11dGF0aXZlID0gVHJ1ZVxuICAgIFlvdSBjYW4gb3ZlcnJpZGUgdGhlIGRlZmF1bHQgYXNzdW1wdGlvbnMgaW4gdGhlIGNvbnN0cnVjdG9yLlxuICAgIEV4YW1wbGVzXG4gICAgPT09PT09PT1cbiAgICA+Pj4gZnJvbSBzeW1weSBpbXBvcnQgc3ltYm9sc1xuICAgID4+PiBBLEIgPSBzeW1ib2xzKCdBLEInLCBjb21tdXRhdGl2ZSA9IEZhbHNlKVxuICAgID4+PiBib29sKEEqQiAhPSBCKkEpXG4gICAgVHJ1ZVxuICAgID4+PiBib29sKEEqQioyID09IDIqQSpCKSA9PSBUcnVlICMgbXVsdGlwbGljYXRpb24gYnkgc2NhbGFycyBpcyBjb21tdXRhdGl2ZVxuICAgIFRydWVcbiAgICAqL1xuXG4gICAgc3RhdGljIGlzX2NvbXBhcmFibGUgPSBmYWxzZTtcblxuICAgIF9fc2xvdHNfXyA9IFtcIm5hbWVcIl07XG5cbiAgICBuYW1lOiBzdHJpbmc7XG5cbiAgICBzdGF0aWMgaXNfU3ltYm9sID0gdHJ1ZTtcblxuICAgIHN0YXRpYyBpc19zeW1ib2wgPSB0cnVlO1xuXG4gICAgc3RhdGljIGlzX2NvbW11dGF0aXZlID0gdHJ1ZTtcblxuICAgIGFyZ3M6IGFueVtdO1xuXG4gICAga2luZCgpIHtcbiAgICAgICAgaWYgKCh0aGlzLmNvbnN0cnVjdG9yIGFzIGFueSkuaXNfY29tbXV0YXRpdmUpIHtcbiAgICAgICAgICAgIHJldHVybiBOdW1iZXJLaW5kO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBVbmRlZmluZWRLaW5kO1xuICAgIH1cblxuICAgIF9kaWZmX3dydCgpIHtcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuXG4gICAgaGFzaEtleSgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMubmFtZSArIHRoaXMuYXJncztcbiAgICB9XG5cbiAgICBjb25zdHJ1Y3RvcihuYW1lOiBhbnksIHByb3BlcnRpZXM6IFJlY29yZDxhbnksIGFueT4gPSB1bmRlZmluZWQpIHtcbiAgICAgICAgc3VwZXIoKTtcbiAgICAgICAgY29uc3QgYXNzdW1wdGlvbnMgPSBuZXcgSGFzaERpY3QocHJvcGVydGllcyk7XG4gICAgICAgIFN5bWJvbC5fc2FuaXRpemUoYXNzdW1wdGlvbnMpO1xuICAgICAgICB0aGlzLm5hbWUgPSBuYW1lO1xuICAgICAgICBjb25zdCB0bXBfYXNtX2NvcHkgPSBhc3N1bXB0aW9ucy5jb3B5KCk7XG4gICAgICAgIGNvbnN0IGlzX2NvbW11dGF0aXZlID0gZnV6enlfYm9vbF92Mihhc3N1bXB0aW9ucy5nZXQoXCJjb21tdXRhdGl2ZVwiLCB0cnVlKSk7XG4gICAgICAgIGFzc3VtcHRpb25zLmFkZChcImNvbW11dGF0aXZlXCIsIGlzX2NvbW11dGF0aXZlKTtcbiAgICAgICAgdGhpcy5fYXNzdW1wdGlvbnMgPSBuZXcgU3RkRmFjdEtCKGFzc3VtcHRpb25zKTtcbiAgICAgICAgdGhpcy5fYXNzdW1wdGlvbnMuX2dlbmVyYXRvciA9IHRtcF9hc21fY29weTtcbiAgICB9XG5cbiAgICBlcXVhbHMob3RoZXI6IFN5bWJvbCkge1xuICAgICAgICBpZiAodGhpcy5uYW1lID0gb3RoZXIubmFtZSkge1xuICAgICAgICAgICAgaWYgKHRoaXMuX2Fzc3VtcHRpb25zLmlzU2FtZShvdGhlci5fYXNzdW1wdGlvbnMpKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cblxuICAgIHN0YXRpYyBfc2FuaXRpemUoYXNzdW1wdGlvbnM6IEhhc2hEaWN0ID0gbmV3IEhhc2hEaWN0KCkpIHtcbiAgICAgICAgLy8gcmVtb3ZlIG5vbmUsIGNvbnZlcnQgdmFsdWVzIHRvIGJvb2wsIGNoZWNrIGNvbW11dGF0aXZpdHkgKmluIHBsYWNlKlxuXG4gICAgICAgIC8vIGJlIHN0cmljdCBhYm91dCBjb21tdXRhdGl2aXR5OiBjYW5ub3QgYmUgdW5kZWZpbmVkXG4gICAgICAgIGNvbnN0IGlzX2NvbW11dGF0aXZlID0gZnV6enlfYm9vbF92Mihhc3N1bXB0aW9ucy5nZXQoXCJjb21tdXRhdGl2ZVwiLCB0cnVlKSk7XG4gICAgICAgIGlmICh0eXBlb2YgaXNfY29tbXV0YXRpdmUgPT09IFwidW5kZWZpbmVkXCIpIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcImNvbW11dGF0aXZpdHkgbXVzdCBiZSB0cnVlIG9yIGZhbHNlXCIpO1xuICAgICAgICB9XG4gICAgICAgIGZvciAoY29uc3Qga2V5IG9mIGFzc3VtcHRpb25zLmtleXMoKSkge1xuICAgICAgICAgICAgY29uc3QgdiA9IGFzc3VtcHRpb25zLmdldChrZXkpO1xuICAgICAgICAgICAgaWYgKHR5cGVvZiB2ID09PSBcInVuZGVmaW5lZFwiKSB7XG4gICAgICAgICAgICAgICAgYXNzdW1wdGlvbnMuZGVsZXRlKGtleSk7XG4gICAgICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBhc3N1bXB0aW9ucy5hZGQoa2V5LCB2IGFzIGJvb2xlYW4pO1xuICAgICAgICB9XG4gICAgfVxufVxuXG4vLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbmV3LWNhcFxuTWFuYWdlZFByb3BlcnRpZXMucmVnaXN0ZXIoU3ltYm9sKTtcblxuZXhwb3J0IHtTeW1ib2x9O1xuIiwgImltcG9ydCB7ZmFjdG9yaW50LCBmYWN0b3JyYXR9IGZyb20gXCIuL250aGVvcnkvZmFjdG9yXy5qc1wiO1xuaW1wb3J0IHtBZGR9IGZyb20gXCIuL2NvcmUvYWRkLmpzXCI7XG5pbXBvcnQge011bH0gZnJvbSBcIi4vY29yZS9tdWwuanNcIjtcbmltcG9ydCB7X051bWJlcl99IGZyb20gXCIuL2NvcmUvbnVtYmVycy5qc1wiO1xuaW1wb3J0IHtQb3d9IGZyb20gXCIuL2NvcmUvcG93ZXIuanNcIjtcbmltcG9ydCB7U30gZnJvbSBcIi4vY29yZS9zaW5nbGV0b24uanNcIjtcbmltcG9ydCB7U3ltYm9sfSBmcm9tIFwiLi9jb3JlL3N5bWJvbC5qc1wiO1xuXG4vLyBEZWZpbmUgaW50ZWdlcnMsIHJhdGlvbmFscywgZmxvYXRzLCBhbmQgc3ltYm9sc1xubGV0IG4gPSBfTnVtYmVyXy5uZXcoNCk7XG5sZXQgeDphbnkgPSBuZXcgU3ltYm9sKFwieFwiKTtcbnggPSBuZXcgQWRkKHRydWUsIHRydWUsIG4sIG4sIHgpO1xueCA9IG5ldyBNdWwodHJ1ZSwgdHJ1ZSwgbiwgbiwgeCk7XG54ID0gbmV3IFBvdyhuLCBuKTtcbmNvbnN0IGJpZ2ludCA9IF9OdW1iZXJfLm5ldygyODUpO1xueCA9IGZhY3RvcmludChiaWdpbnQpO1xuY29uc3QgYmlncmF0ID0gX051bWJlcl8ubmV3KDI3MSwgOTMyKTtcbnggPSBmYWN0b3JyYXQoYmlncmF0KTtcblxueCA9IG5ldyBQb3cobiwgUy5OYU4pO1xuXG4iXSwKICAibWFwcGluZ3MiOiAiOztBQU1BLE1BQU0sT0FBTixNQUFXO0FBQUEsSUFHUCxPQUFPLFFBQVFBLElBQWdCO0FBQzNCLFVBQUksT0FBT0EsT0FBTSxhQUFhO0FBQzFCLGVBQU87QUFBQSxNQUNYO0FBQ0EsVUFBSUEsR0FBRSxTQUFTO0FBQ1gsZUFBT0EsR0FBRSxRQUFRO0FBQUEsTUFDckI7QUFDQSxVQUFJLE1BQU0sUUFBUUEsRUFBQyxHQUFHO0FBQ2xCLGVBQU9BLEdBQUUsSUFBSSxD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SUFBSSxHQUFHO0FBQzdCLFlBQUksT0FBTyxNQUFNLGFBQWE7QUFDMUIsc0JBQVksT0FBTyxHQUFHO0FBQ3RCO0FBQUEsUUFDSjtBQUNBLG9CQUFZLElBQUksS0FBSyxDQUFZO0FBQUEsTUFDckM7QUFBQSxJQUNKO0FBQUEsRUFDSjtBQWxGQSxNQUFNQyxVQUFOO0FBZUksRUFmRUEsUUFlSyxnQkFBZ0I7QUFNdkIsRUFyQkVBLFFBcUJLLFlBQVk7QUFFbkIsRUF2QkVBLFFBdUJLLFlBQVk7QUFFbkIsRUF6QkVBLFFBeUJLLGlCQUFpQjtBQTRENUIsb0JBQWtCLFNBQVNBLE9BQU07OztBQzNGakMsTUFBSSxJQUFJLFNBQVMsSUFBSSxDQUFDO0FBQ3RCLE1BQUksSUFBUSxJQUFJQyxRQUFPLEdBQUc7QUFDMUIsTUFBSSxJQUFJLElBQUksTUFBTSxNQUFNLEdBQUcsR0FBRyxDQUFDO0FBQy9CLE1BQUksSUFBSSxJQUFJLE1BQU0sTUFBTSxHQUFHLEdBQUcsQ0FBQztBQUMvQixNQUFJLElBQUksSUFBSSxHQUFHLENBQUM7QUFDaEIsTUFBTSxTQUFTLFNBQVMsSUFBSSxHQUFHO0FBQy9CLE1BQUksVUFBVSxNQUFNO0FBQ3BCLE1BQU0sU0FBUyxTQUFTLElBQUksS0FBSyxHQUFHO0FBQ3BDLE1BQUksVUFBVSxNQUFNO0FBRXBCLE1BQUksSUFBSSxJQUFJLEdBQUcsRUFBRSxHQUFHOyIsCiAgIm5hbWVzIjogWyJ4IiwgIm4iLCAieCIsICJ4IiwgImltcGwiLCAiaXRlbSIsICJQIiwgInNlbGYiLCAiY2xzIiwgInN1cGVyY2xhc3MiLCAic2VsZiIsICJvbGQiLCAiX25ldyIsICJydiIsICJuIiwgIm1vZCIsICJFcnJvciIsICJjc2V0IiwgIngiLCAibiIsICJfQXRvbWljRXhwciIsICJvYmoiLCAiY19wb3dlcnMiLCAiaSIsICJuIiwgImNfcGFydCIsICJjb2VmZl9zaWduIiwgInNpZ24iLCAieCIsICJtaW4iLCAibWF4IiwgIm4iLCAiYmFzZSIsICJzaWduIiwgInBvdyIsICJzdW0iLCAieDIiLCAiRGVjaW1hbCIsICJpIiwgIngiLCAibiIsICJfQXRvbWljRXhwciIsICJ4IiwgInJlc3VsdCIsICJOYU4iLCAiX0F0b21pY0V4cHIiLCAibiIsICJ0IiwgIkVycm9yIiwgImJhc2UiLCAiZXhwIiwgImQiLCAiZmFjdG9ycyIsICJyIiwgIkJvb2xlYW4iLCAiQm9vbGVhbiIsICJTeW1ib2wiLCAiU3ltYm9sIl0KfQo=
