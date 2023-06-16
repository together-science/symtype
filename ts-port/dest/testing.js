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
      const n5 = iterable.length;
      if (typeof r === "undefined") {
        r = n5;
      }
      const range = this.range(n5);
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
      const n5 = iterable.length;
      const range = this.range(n5);
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
      const n5 = iterable.length;
      const range = this.range(n5);
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
    static range(n5) {
      return new Array(n5).fill(0).map((_, idx) => idx);
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
    static arrMul(arr, n5) {
      const res = [];
      for (let i = 0; i < n5; i++) {
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
      const n22 = other.constructor.name;
      if (ordering_of_classes.has(n1) && ordering_of_classes.has(n22)) {
        const idx1 = ordering_of_classes[n1];
        const idx2 = ordering_of_classes[n22];
        return Math.sign(idx1 - idx2);
      }
      if (n1 > n22) {
        return 1;
      } else if (n1 === n22) {
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
      for (const k of _assume_defined.toArray()) {
        const attrname = as_property(k);
        if (attrname in cls) {
          let v = cls[attrname];
          if (typeof v === "number" && Number.isInteger(v) || typeof v === "boolean" || typeof v === "undefined") {
            if (typeof v !== "undefined") {
              v = !!v;
            }
            local_defs.add(attrname, v);
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
      const s = new HashSet();
      s.addArr(cls.default_assumptions.keys());
      const alldefs = new HashSet(Object.getOwnPropertyNames(cls).filter((prop) => prop.includes("is_")));
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
        const n22 = other.constructor.name;
        if (n1 && n22) {
          return (n1 > n22) - (n1 < n22);
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
  function as_int(n5) {
    if (!Number.isInteger(n5)) {
      throw new Error(n5 + " is not int");
    }
    return n5;
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
      _eval_nseries(x2, n5, logx, cdor = 0) {
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
    var e, m, n5, r, rep, s, sd, t, t3, t3plusx, x2 = this, Ctor = x2.constructor;
    if (!x2.isFinite() || x2.isZero())
      return new Ctor(x2);
    external = false;
    s = x2.s * mathpow(x2.s * x2, 1 / 3);
    if (!s || Math.abs(s) == 1 / 0) {
      n5 = digitsToString(x2.d);
      e = x2.e;
      if (s = (e - n5.length + 1) % 3)
        n5 += s == 1 || s == -2 ? "0" : "00";
      s = mathpow(n5, 1 / 3);
      e = mathfloor((e + 1) / 3) - (e % 3 == (e < 0 ? -1 : 2));
      if (s == 1 / 0) {
        n5 = "5e" + e;
      } else {
        n5 = s.toExponential();
        n5 = n5.slice(0, n5.indexOf("e") + 1) + e;
      }
      r = new Ctor(n5);
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
      if (digitsToString(t.d).slice(0, sd) === (n5 = digitsToString(r.d)).slice(0, sd)) {
        n5 = n5.slice(sd - 3, sd + 1);
        if (n5 == "9999" || !rep && n5 == "4999") {
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
          if (!+n5 || !+n5.slice(1) && n5.charAt(0) == "5") {
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
    var w, d = this.d, n5 = NaN;
    if (d) {
      w = d.length - 1;
      n5 = (w - mathfloor(this.e / LOG_BASE)) * LOG_BASE;
      w = d[w];
      if (w)
        for (; w % 10 == 0; w /= 10)
          n5--;
      if (n5 < 0)
        n5 = 0;
    }
    return n5;
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
    var k, n5, pr, rm, len, x2 = this, Ctor = x2.constructor, one = new Ctor(1);
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
      n5 = (1 / tinyPow(4, k)).toString();
    } else {
      k = 16;
      n5 = "2.3283064365386962890625e-10";
    }
    x2 = taylorSeries(Ctor, 1, x2.times(n5), new Ctor(1), true);
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
    var i, j, k, n5, px, t, r, wpr, x2, x3 = this, Ctor = x3.constructor, pr = Ctor.precision, rm = Ctor.rounding;
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
    n5 = 1;
    x2 = x3.times(x3);
    r = new Ctor(x3);
    px = x3;
    for (; i !== -1; ) {
      px = px.times(x2);
      t = r.minus(px.div(n5 += 2));
      px = px.times(x2);
      r = t.plus(px.div(n5 += 2));
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
    var m, n5, sd, r, rep, t, x2 = this, d = x2.d, e = x2.e, s = x2.s, Ctor = x2.constructor;
    if (s !== 1 || !d || !d[0]) {
      return new Ctor(!s || s < 0 && (!d || d[0]) ? NaN : d ? x2 : 1 / 0);
    }
    external = false;
    s = Math.sqrt(+x2);
    if (s == 0 || s == 1 / 0) {
      n5 = digitsToString(d);
      if ((n5.length + e) % 2 == 0)
        n5 += "0";
      s = Math.sqrt(n5);
      e = mathfloor((e + 1) / 2) - (e < 0 || e % 2);
      if (s == 1 / 0) {
        n5 = "5e" + e;
      } else {
        n5 = s.toExponential();
        n5 = n5.slice(0, n5.indexOf("e") + 1) + e;
      }
      r = new Ctor(n5);
    } else {
      r = new Ctor(s.toString());
    }
    sd = (e = Ctor.precision) + 3;
    for (; ; ) {
      t = r;
      r = t.plus(divide(x2, t, sd + 2, 1)).times(0.5);
      if (digitsToString(t.d).slice(0, sd) === (n5 = digitsToString(r.d)).slice(0, sd)) {
        n5 = n5.slice(sd - 3, sd + 1);
        if (n5 == "9999" || !rep && n5 == "4999") {
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
          if (!+n5 || !+n5.slice(1) && n5.charAt(0) == "5") {
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
    var d, d0, d1, d2, e, k, n5, n0, n1, pr, q, r, x2 = this, xd = x2.d, Ctor = x2.constructor;
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
      n5 = new Ctor(maxD);
      if (!n5.isInt() || n5.lt(n1))
        throw Error(invalidArgument + n5);
      maxD = n5.gt(d) ? e > 0 ? d : n1 : n5;
    }
    external = false;
    n5 = new Ctor(digitsToString(xd));
    pr = Ctor.precision;
    Ctor.precision = e = xd.length * LOG_BASE * 2;
    for (; ; ) {
      q = divide(n5, d, 0, 1, 1);
      d2 = d0.plus(q.times(d1));
      if (d2.cmp(maxD) == 1)
        break;
      d0 = d1;
      d1 = d2;
      d2 = n1;
      n1 = n0.plus(q.times(d2));
      n0 = d2;
      d2 = d;
      d = n5.minus(q.times(d2));
      n5 = d2;
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
  function intPow(Ctor, x2, n5, pr) {
    var isTruncated, r = new Ctor(1), k = Math.ceil(pr / LOG_BASE + 4);
    external = false;
    for (; ; ) {
      if (n5 % 2) {
        r = r.times(x2);
        if (truncate(r.d, k))
          isTruncated = true;
      }
      n5 = mathfloor(n5 / 2);
      if (n5 === 0) {
        n5 = r.d.length - 1;
        if (isTruncated && r.d[n5] === 0)
          ++r.d[n5];
        break;
      }
      x2 = x2.times(x2);
      truncate(x2.d, k);
    }
    external = true;
    return r;
  }
  function isOdd(n5) {
    return n5.d[n5.d.length - 1] & 1;
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
    var c, c0, denominator, e, numerator, rep, sum2, t, wpr, x1, x2, n5 = 1, guard = 10, x3 = y, xd = x3.d, Ctor = x3.constructor, rm = Ctor.rounding, pr = Ctor.precision;
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
        n5++;
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
        sum2 = divide(sum2, new Ctor(n5), wpr, 1);
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
  function taylorSeries(Ctor, n5, x2, y, isHyperbolic) {
    var j, t, u, x22, i = 1, pr = Ctor.precision, k = Math.ceil(pr / LOG_BASE);
    external = false;
    x22 = x2.times(x2);
    u = new Ctor(y);
    for (; ; ) {
      t = divide(u.times(x22), new Ctor(n5++ * n5++), pr, 1);
      u = isHyperbolic ? y.plus(t) : y.minus(t);
      y = divide(t.times(x22), new Ctor(n5++ * n5++), pr, 1);
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
    var n5 = b;
    while (--e)
      n5 *= b;
    return n5;
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
    var i, n5, t = new this(0);
    external = false;
    for (i = 0; i < arguments.length; ) {
      n5 = new this(arguments[i++]);
      if (!n5.d) {
        if (n5.s) {
          external = true;
          return new this(1 / 0);
        }
        t = n5;
      } else if (t.d) {
        t = t.plus(n5.times(n5));
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
    var d, e, k, n5, i = 0, r = new this(1), rd = [];
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
        n5 = d[i];
        if (n5 >= 429e7) {
          d[i] = crypto.getRandomValues(new Uint32Array(1))[0];
        } else {
          rd[i++] = n5 % 1e7;
        }
      }
    } else if (crypto.randomBytes) {
      d = crypto.randomBytes(k *= 4);
      for (; i < k; ) {
        n5 = d[i] + (d[i + 1] << 8) + (d[i + 2] << 16) + ((d[i + 3] & 127) << 24);
        if (n5 >= 214e7) {
          crypto.randomBytes(4).copy(d, i);
        } else {
          rd.push(n5 % 1e7);
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
      n5 = mathpow(10, LOG_BASE - sd);
      rd[i] = (k / n5 | 0) * n5;
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
      for (k = 1, n5 = rd[0]; n5 >= 10; n5 /= 10)
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
  function int_nthroot(y, n5) {
    const x2 = Math.floor(y ** (1 / n5));
    const isexact = x2 ** n5 === y;
    return [x2, isexact];
  }
  function toRatio(n5, eps) {
    const gcde = (e, x2, y) => {
      const _gcd = (a, b) => b < e ? a : _gcd(b, a % b);
      return _gcd(Math.abs(x2), Math.abs(y));
    };
    const c = gcde(Boolean(eps) ? eps : 1 / 1e4, 1, n5);
    return [Math.floor(n5 / c), Math.floor(1 / c)];
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
  Singleton.register("NegativeInfinity", NegativeInfinity);
  S.NegativeInfinity = Singleton.registry["NegativeInfinity"];

  // ts-port/ntheory/factor_.ts
  var small_trailing = new Array(256).fill(0);
  for (let j = 1; j < 8; j++) {
    Util.assignElements(small_trailing, new Array(1 << 7 - j).fill(j), 1 << j, 1 << j + 1);
  }
  function bitcount(n5) {
    let bits = 0;
    while (n5 !== 0) {
      bits += bitCount32(n5 | 0);
      n5 /= 4294967296;
    }
    return bits;
  }
  function bitCount32(n5) {
    n5 = n5 - (n5 >> 1 & 1431655765);
    n5 = (n5 & 858993459) + (n5 >> 2 & 858993459);
    return (n5 + (n5 >> 4) & 252645135) * 16843009 >> 24;
  }
  function trailing(n5) {
    n5 = Math.floor(Math.abs(n5));
    const low_byte = n5 & 255;
    if (low_byte) {
      return small_trailing[low_byte];
    }
    const z = bitcount(n5) - 1;
    if (Number.isInteger(z)) {
      if (n5 === 1 << z) {
        return z;
      }
    }
    if (z < 300) {
      let t2 = 8;
      n5 >>= 8;
      while (!(n5 & 255)) {
        n5 >>= 8;
        t2 += 8;
      }
      return t2 + small_trailing[n5 & 255];
    }
    let t = 0;
    let p = 8;
    while (!(n5 & 1)) {
      while (!(n5 & (1 << p) - 1)) {
        n5 >>= p;
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
  function nextprime(n5, ith = 1) {
    n5 = Math.floor(n5);
    const i = as_int(ith);
    if (i > 1) {
      let pr = n5;
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
    if (n5 < 2) {
      return 2;
    }
    if (n5 < 7) {
      return { 2: 3, 3: 5, 4: 5, 5: 7, 6: 7 }[n5];
    }
    const nn = 6 * Math.floor(n5 / 6);
    if (nn === n5) {
      n5++;
      if (isprime(n5)) {
        return n5;
      }
      n5 += 4;
    } else if (n5 - nn === 5) {
      n5 += 2;
      if (isprime(n5)) {
        return n5;
      }
      n5 += 4;
    } else {
      n5 = nn + 5;
    }
    while (1) {
      if (isprime(n5)) {
        return n5;
      }
      n5 += 2;
      if (isprime(n5)) {
        return n5;
      }
      n5 += 4;
    }
  }
  var divmod = (a, b) => [Math.floor(a / b), a % b];
  function multiplicity(p, n5) {
    try {
      [p, n5] = [as_int(p), as_int(n5)];
    } catch (Error2) {
      if (Number.isInteger(p) || p instanceof Rational && Number.isInteger(n5) || n5 instanceof Rational) {
        p = new Rational(p);
        n5 = new Rational(n5);
        if (p.q === 1) {
          if (n5.p === 1) {
            return -multiplicity(p.p, n5.q);
          }
          return multiplicity(p.p, n5.p) - multiplicity(p.p, n5.q);
        } else if (p.p === 1) {
          return multiplicity(p.q, n5.q);
        } else {
          const like = Math.min(multiplicity(p.p, n5.p), multiplicity(p.q, n5.q));
          const cross = Math.min(multiplicity(p.q, n5.p), multiplicity(p.p, n5.q));
          return like - cross;
        }
      }
    }
    if (n5 === 0) {
      throw new Error("no int exists");
    }
    if (p === 2) {
      return trailing(n5);
    }
    if (p < 2) {
      throw new Error("p must be int");
    }
    if (p === n5) {
      return 1;
    }
    let m = 0;
    n5 = Math.floor(n5 / p);
    let rem = n5 % p;
    while (!rem) {
      m++;
      if (m > 5) {
        let e = 2;
        while (1) {
          const ppow = p ** e;
          if (ppow < n5) {
            const nnew = Math.floor(n5 / ppow);
            rem = n5 % ppow;
            if (!rem) {
              m += e;
              e *= 2;
              n5 = nnew;
              continue;
            }
          }
          return m + multiplicity(p, n5);
        }
      }
      [n5, rem] = divmod(n5, p);
    }
    return m;
  }
  function divisors(n5, generator = false, proper = false) {
    n5 = as_int(Math.abs(n5));
    if (isprime(n5)) {
      if (proper) {
        return [1];
      }
      return [1, n5];
    }
    if (n5 === 1) {
      if (proper) {
        return [];
      }
      return [1];
    }
    if (n5 === 0) {
      return [];
    }
    const rv = _divisors(n5, proper);
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
  function* _divisors(n5, generator = false, proper = false) {
    const factordict = factorint(n5);
    const ps = factordict.keys().sort();
    function* rec_gen(n6 = 0) {
      if (n6 === ps.length) {
        yield 1;
      } else {
        const pows = [1];
        for (let j = 0; j < factordict.get(ps[n6]); j++) {
          pows.push(pows[pows.length - 1] * ps[n6]);
        }
        for (const q of rec_gen(n6 + 1)) {
          for (const p of pows) {
            yield p * q;
          }
        }
      }
    }
    if (proper) {
      for (const p of rec_gen()) {
        if (p != n5) {
          yield p;
        }
      }
    } else {
      for (const p of rec_gen()) {
        yield p;
      }
    }
  }
  function _check_termination(factors, n5, limitp1) {
    const p = perfect_power(n5, void 0, true, false);
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
    if (isprime(n5)) {
      factors.add(n5, 1);
      throw new Error();
    }
    if (n5 === 1) {
      throw new Error();
    }
  }
  function _trial(factors, n5, candidates) {
    const nfactors = factors.length;
    for (const d of candidates) {
      if (n5 % d === 0) {
        const m = multiplicity(d, n5);
        n5 = Math.floor(n5 / d ** m);
        factors[d] = m;
      }
    }
    return [n5, factors.length !== nfactors];
  }
  function _factorint_small(factors, n5, limit, fail_max) {
    function done(n6, d2) {
      if (d2 * d2 <= n6) {
        return [n6, d2];
      }
      return [n6, 0];
    }
    let d = 2;
    let m = trailing(n5);
    if (m) {
      factors.add(d, m);
      n5 >>= m;
    }
    d = 3;
    if (limit < d) {
      if (n5 > 1) {
        factors.add(n5, 1);
      }
      return done(n5, d);
    }
    m = 0;
    while (n5 % d === 0) {
      n5 = Math.floor(n5 / d);
      m++;
      if (m === 20) {
        const mm = multiplicity(d, n5);
        m += mm;
        n5 = Math.floor(n5 / d ** mm);
        break;
      }
    }
    if (m) {
      factors.add(d, m);
    }
    let maxx;
    if (limit * limit > n5) {
      maxx = 0;
    } else {
      maxx = limit * limit;
    }
    let dd = maxx || n5;
    d = 5;
    let fails = 0;
    while (fails < fail_max) {
      if (d * d > dd) {
        break;
      }
      m = 0;
      while (n5 % d === 0) {
        n5 = Math.floor(n5 / d);
        m++;
        if (m === 20) {
          const mm = multiplicity(d, n5);
          m += mm;
          n5 = Math.floor(n5 / d ** mm);
          break;
        }
      }
      if (m) {
        factors.add(d, m);
        dd = maxx || n5;
        fails = 0;
      } else {
        fails++;
      }
      d += 2;
      if (d * d > dd) {
        break;
      }
      m = 0;
      while (n5 % d === 0) {
        n5 = Math.floor(n5 / d);
        m++;
        if (m === 20) {
          const mm = multiplicity(d, n5);
          m += mm;
          n5 = Math.floor(n5 / d ** mm);
          break;
        }
      }
      if (m) {
        factors.add(d, m);
        dd = maxx || n5;
        fails = 0;
      } else {
        fails++;
      }
      d += 4;
    }
    return done(n5, d);
  }
  function factorint(n5, limit = void 0) {
    if (n5 instanceof Integer) {
      n5 = n5.p;
    }
    n5 = as_int(n5);
    if (limit) {
      limit = limit;
    }
    if (n5 < 0) {
      const factors2 = factorint(-n5, limit);
      factors2.add(factors2.size - 1, 1);
      return factors2;
    }
    if (limit && limit < 2) {
      if (n5 === 1) {
        return new HashDict();
      }
      return new HashDict({ n: 1 });
    } else if (n5 < 10) {
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
      ][n5]);
    }
    const factors = new HashDict();
    let small = 2 ** 15;
    const fail_max = 600;
    small = Math.min(small, limit || small);
    let next_p;
    [n5, next_p] = _factorint_small(factors, n5, small, fail_max);
    let sqrt_n;
    try {
      if (limit && next_p > limit) {
        _check_termination(factors, n5, limit);
        if (n5 > 1) {
          factors.add(n5, 1);
        }
        return factors;
      } else {
        sqrt_n = int_nthroot(n5, 2)[0];
        let a = sqrt_n + 1;
        const a2 = a ** 2;
        let b2 = a2 - n5;
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
        _check_termination(factors, n5, limit);
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
        [n5, found_trial] = _trial(factors, n5, ps);
        if (found_trial) {
          _check_termination(factors, n5, limit);
        }
        if (high > limit) {
          if (n5 > 1) {
            factors.add(n5, 1);
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
  function perfect_power(n5, candidates = void 0, big = true, factor = true, num_iterations = 15) {
    let pp;
    if (n5 instanceof Rational && !n5.is_integer) {
      const [p, q] = n5._as_numer_denom();
      if (p === S.One) {
        pp = perfect_power(q);
        if (pp) {
          pp = [n5.constructor(1, pp[0]), pp[1]];
        }
      } else {
        pp = perfect_power(p);
        if (pp) {
          const [num, e] = pp;
          const pq = perfect_power(q, [e]);
          if (pq) {
            const [den, blank] = pq;
            pp = [n5.constructor(num, den), e];
          }
        }
      }
      return pp;
    }
    n5 = as_int(n5);
    if (n5 < 0) {
      pp = perfect_power(-n5);
      if (pp) {
        const [b, e] = pp;
        if (e % 2 !== 0) {
          return [-b, e];
        }
      }
      return false;
    }
    if (n5 <= 3) {
      return false;
    }
    const logn = Math.log2(n5);
    const max_possible = Math.floor(logn) + 2;
    const not_square = [2, 3, 7, 8].includes(n5 % 10);
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
      if (n5 % 2 === 0) {
        const e = trailing(n5);
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
        const [r, ok] = int_nthroot(n5, e);
        if (ok) {
          return [r, e];
        }
      }
      return false;
    }
    function* _factors(length) {
      let rv = 2 + n5 % 2;
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
      if (factor && n5 % fac === 0) {
        if (fac === 2) {
          e = trailing(n5);
        } else {
          e = multiplicity(fac, n5);
        }
        if (e === 1) {
          return false;
        }
        [r, exact] = int_nthroot(n5, e);
        if (!exact) {
          const m = Math.floor(n5 / fac) ** e;
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
      [r, exact] = int_nthroot(n5, e);
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
        let n5;
        let q;
        let p;
        [p, q] = neg1e._as_numer_denom();
        [n5, p] = divmod(p.p, q.p);
        if (n5 % 2 !== 0) {
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

  // ts-port/testing.ts
  var n = _Number_.new(4);
  var n2 = _Number_.new(4, 9);
  var n3 = _Number_.new(-1.5);
  var n4 = _Number_.new(1, 3);
  var x = new Symbol2("x");
  console.log(new Pow(n, x).subs(x, n4).toString());
  console.log(new Mul(false, true, n, n2, x).subs(x, n2).toString());
  console.log(new Add(false, true, n, n2, x).subs(x, n).toString());
})();
/*!
 *  decimal.js v10.4.3
 *  An arbitrary-precision Decimal type for JavaScript.
 *  https://github.com/MikeMcl/decimal.js
 *  Copyright (c) 2022 Michael Mclaughlin <M8ch88l@gmail.com>
 *  MIT Licence
 */
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsiLi4vY29yZS91dGlsaXR5LnRzIiwgIi4uL2NvcmUvbG9naWMudHMiLCAiLi4vY29yZS9mYWN0cy50cyIsICIuLi9jb3JlL2NvcmUudHMiLCAiLi4vY29yZS9hc3N1bXB0aW9ucy50cyIsICIuLi9jb3JlL2tpbmQudHMiLCAiLi4vY29yZS90cmF2ZXJzYWwudHMiLCAiLi4vY29yZS9iYXNpYy50cyIsICIuLi9jb3JlL3NpbmdsZXRvbi50cyIsICIuLi9jb3JlL2dsb2JhbC50cyIsICIuLi91dGlsaXRpZXMvbWlzYy50cyIsICIuLi9jb3JlL2V4cHIudHMiLCAiLi4vY29yZS9wYXJhbWV0ZXJzLnRzIiwgIi4uL2NvcmUvb3BlcmF0aW9ucy50cyIsICIuLi8uLi9ub2RlX21vZHVsZXMvZGVjaW1hbC5qcy9kZWNpbWFsLm1qcyIsICIuLi9jb3JlL3Bvd2VyLnRzIiwgIi4uL2NvcmUvbnVtYmVycy50cyIsICIuLi9udGhlb3J5L2ZhY3Rvcl8udHMiLCAiLi4vY29yZS9tdWwudHMiLCAiLi4vY29yZS9hZGQudHMiLCAiLi4vY29yZS9ib29sYWxnLnRzIiwgIi4uL2NvcmUvc3ltYm9sLnRzIiwgIi4uL3Rlc3RpbmcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbIi8qXG5BIGZpbGUgd2l0aCB1dGlsaXR5IGNsYXNzZXMgYW5kIGZ1bmN0aW9ucyB0byBoZWxwIHdpdGggcG9ydGluZ1xuRGV2ZWxvcGQgYnkgV0IgYW5kIEdNXG4qL1xuXG4vLyBnZW5lcmFsIHV0aWwgZnVuY3Rpb25zXG5jbGFzcyBVdGlsIHtcbiAgICAvLyBoYXNoa2V5IGZ1bmN0aW9uXG4gICAgLy8gc2hvdWxkIGJlIGFibGUgdG8gaGFuZGxlIG11bHRpcGxlIHR5cGVzIG9mIGlucHV0c1xuICAgIHN0YXRpYyBoYXNoS2V5KHg6IGFueSk6IHN0cmluZyB7XG4gICAgICAgIGlmICh0eXBlb2YgeCA9PT0gXCJ1bmRlZmluZWRcIikge1xuICAgICAgICAgICAgcmV0dXJuIFwidW5kZWZpbmVkXCI7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHguaGFzaEtleSkge1xuICAgICAgICAgICAgcmV0dXJuIHguaGFzaEtleSgpO1xuICAgICAgICB9XG4gICAgICAgIGlmIChBcnJheS5pc0FycmF5KHgpKSB7XG4gICAgICAgICAgICByZXR1cm4geC5tYXAoKGUpID0+IFV0aWwuaGFzaEtleShlKSkuam9pbihcIixcIik7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHggPT09IG51bGwpIHtcbiAgICAgICAgICAgIHJldHVybiBcIm51bGxcIjtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4geC50b1N0cmluZygpO1xuICAgIH1cblxuICAgIC8vIGNoZWNrIGlmIGFycjEgaXMgYSBzdWJzZXQgb2YgYXJyMlxuICAgIHN0YXRpYyBpc1N1YnNldChhcnIxOiBhbnlbXSwgYXJyMjogYW55W10pOiBib29sZWFuIHtcbiAgICAgICAgZm9yIChjb25zdCBlIG9mIGFycjEpIHtcbiAgICAgICAgICAgIGlmICghKGFycjIuaW5jbHVkZXMoZSkpKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cblxuICAgIC8vIGNvbnZlcnQgYW4gaW50ZWdlciB0byBiaW5hcnlcbiAgICAvLyBmdW5jdGlvbmFsIGZvciBuZWdhdGl2ZSBudW1iZXJzXG4gICAgc3RhdGljIGJpbihudW06IG51bWJlcikge1xuICAgICAgICByZXR1cm4gKG51bSA+Pj4gMCkudG9TdHJpbmcoMik7XG4gICAgfVxuXG4gICAgc3RhdGljKiBwcm9kdWN0KHJlcGVhdDogbnVtYmVyID0gMSwgLi4uYXJnczogYW55W10pIHtcbiAgICAgICAgY29uc3QgdG9BZGQ6IGFueVtdID0gW107XG4gICAgICAgIGZvciAoY29uc3QgYSBvZiBhcmdzKSB7XG4gICAgICAgICAgICB0b0FkZC5wdXNoKFthXSk7XG4gICAgICAgIH1cbiAgICAgICAgY29uc3QgcG9vbHM6IGFueVtdID0gW107XG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgcmVwZWF0OyBpKyspIHtcbiAgICAgICAgICAgIHRvQWRkLmZvckVhY2goKGU6IGFueSkgPT4gcG9vbHMucHVzaChlWzBdKSk7XG4gICAgICAgIH1cbiAgICAgICAgbGV0IHJlczogYW55W11bXSA9IFtbXV07XG4gICAgICAgIGZvciAoY29uc3QgcG9vbCBvZiBwb29scykge1xuICAgICAgICAgICAgY29uc3QgcmVzX3RlbXA6IGFueVtdID0gW107XG4gICAgICAgICAgICBmb3IgKGNvbnN0IHggb2YgcmVzKSB7XG4gICAgICAgICAgICAgICAgZm9yIChjb25zdCB5IG9mIHBvb2wpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHR5cGVvZiB4WzBdID09PSBcInVuZGVmaW5lZFwiKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXNfdGVtcC5wdXNoKFt5XSk7XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXNfdGVtcC5wdXNoKHguY29uY2F0KHkpKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJlcyA9IHJlc190ZW1wO1xuICAgICAgICB9XG4gICAgICAgIGZvciAoY29uc3QgcHJvZCBvZiByZXMpIHtcbiAgICAgICAgICAgIHlpZWxkIHByb2Q7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBzdGF0aWMqIHBlcm11dGF0aW9ucyhpdGVyYWJsZTogYW55LCByOiBhbnkgPSB1bmRlZmluZWQpIHtcbiAgICAgICAgY29uc3QgbiA9IGl0ZXJhYmxlLmxlbmd0aDtcbiAgICAgICAgaWYgKHR5cGVvZiByID09PSBcInVuZGVmaW5lZFwiKSB7XG4gICAgICAgICAgICByID0gbjtcbiAgICAgICAgfVxuICAgICAgICBjb25zdCByYW5nZSA9IHRoaXMucmFuZ2Uobik7XG4gICAgICAgIGZvciAoY29uc3QgaW5kaWNlcyBvZiBVdGlsLnByb2R1Y3QociwgcmFuZ2UpKSB7XG4gICAgICAgICAgICBpZiAoaW5kaWNlcy5sZW5ndGggPT09IHIpIHtcbiAgICAgICAgICAgICAgICBjb25zdCB5OiBhbnlbXSA9IFtdO1xuICAgICAgICAgICAgICAgIGZvciAoY29uc3QgaSBvZiBpbmRpY2VzKSB7XG4gICAgICAgICAgICAgICAgICAgIHkucHVzaChpdGVyYWJsZVtpXSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHlpZWxkIHk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBzdGF0aWMqIGZyb21faXRlcmFibGUoaXRlcmFibGVzOiBhbnkpIHtcbiAgICAgICAgZm9yIChjb25zdCBpdCBvZiBpdGVyYWJsZXMpIHtcbiAgICAgICAgICAgIGZvciAoY29uc3QgZWxlbWVudCBvZiBpdCkge1xuICAgICAgICAgICAgICAgIHlpZWxkIGVsZW1lbnQ7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBzdGF0aWMgYXJyRXEoYXJyMTogYW55W10sIGFycjI6IGFueSkge1xuICAgICAgICBpZiAoYXJyMS5sZW5ndGggIT09IGFycjIubGVuZ3RoKSB7XG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH1cbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBhcnIxLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBpZiAoIShhcnIxW2ldID09PSBhcnIyW2ldKSkge1xuICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG5cbiAgICBzdGF0aWMqIGNvbWJpbmF0aW9ucyhpdGVyYWJsZTogYW55LCByOiBhbnkpIHtcbiAgICAgICAgY29uc3QgbiA9IGl0ZXJhYmxlLmxlbmd0aDtcbiAgICAgICAgY29uc3QgcmFuZ2UgPSB0aGlzLnJhbmdlKG4pO1xuICAgICAgICBmb3IgKGNvbnN0IGluZGljZXMgb2YgVXRpbC5wZXJtdXRhdGlvbnMocmFuZ2UsIHIpKSB7XG4gICAgICAgICAgICBpZiAoVXRpbC5hcnJFcShpbmRpY2VzLnNvcnQoZnVuY3Rpb24oYSwgYikge1xuICAgICAgICAgICAgICAgIHJldHVybiBhIC0gYjtcbiAgICAgICAgICAgIH0pLCBpbmRpY2VzKSkge1xuICAgICAgICAgICAgICAgIGNvbnN0IHJlczogYW55W10gPSBbXTtcbiAgICAgICAgICAgICAgICBmb3IgKGNvbnN0IGkgb2YgaW5kaWNlcykge1xuICAgICAgICAgICAgICAgICAgICByZXMucHVzaChpdGVyYWJsZVtpXSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHlpZWxkIHJlcztcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgIHN0YXRpYyogY29tYmluYXRpb25zX3dpdGhfcmVwbGFjZW1lbnQoaXRlcmFibGU6IGFueSwgcjogYW55KSB7XG4gICAgICAgIGNvbnN0IG4gPSBpdGVyYWJsZS5sZW5ndGg7XG4gICAgICAgIGNvbnN0IHJhbmdlID0gdGhpcy5yYW5nZShuKTtcbiAgICAgICAgZm9yIChjb25zdCBpbmRpY2VzIG9mIFV0aWwucHJvZHVjdChyLCByYW5nZSkpIHtcbiAgICAgICAgICAgIGlmIChVdGlsLmFyckVxKGluZGljZXMuc29ydChmdW5jdGlvbihhLCBiKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGEgLSBiO1xuICAgICAgICAgICAgfSksIGluZGljZXMpKSB7XG4gICAgICAgICAgICAgICAgY29uc3QgcmVzOiBhbnlbXSA9IFtdO1xuICAgICAgICAgICAgICAgIGZvciAoY29uc3QgaSBvZiBpbmRpY2VzKSB7XG4gICAgICAgICAgICAgICAgICAgIHJlcy5wdXNoKGl0ZXJhYmxlW2ldKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgeWllbGQgcmVzO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgc3RhdGljIHppcChhcnIxOiBhbnlbXSwgYXJyMjogYW55W10sIGZpbGx2YWx1ZTogc3RyaW5nID0gXCItXCIpIHtcbiAgICAgICAgY29uc3QgcmVzID0gYXJyMS5tYXAoZnVuY3Rpb24oZSwgaSkge1xuICAgICAgICAgICAgcmV0dXJuIFtlLCBhcnIyW2ldXTtcbiAgICAgICAgfSk7XG4gICAgICAgIHJlcy5mb3JFYWNoKCh6aXA6IGFueSkgPT4ge1xuICAgICAgICAgICAgaWYgKHppcC5pbmNsdWRlcyh1bmRlZmluZWQpKSB7XG4gICAgICAgICAgICAgICAgemlwLnNwbGljZSgxLCAxLCBmaWxsdmFsdWUpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgICAgcmV0dXJuIHJlcztcbiAgICB9XG5cbiAgICBzdGF0aWMgcmFuZ2UobjogbnVtYmVyKSB7XG4gICAgICAgIHJldHVybiBuZXcgQXJyYXkobikuZmlsbCgwKS5tYXAoKF8sIGlkeCkgPT4gaWR4KTtcbiAgICB9XG5cbiAgICBzdGF0aWMgZ2V0QXJySW5kZXgoYXJyMmQ6IGFueVtdW10sIGFycjogYW55W10pIHtcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBhcnIyZC5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgaWYgKFV0aWwuYXJyRXEoYXJyMmRbaV0sIGFycikpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gaTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdW5kZWZpbmVkO1xuICAgIH1cblxuICAgIHN0YXRpYyBnZXRTdXBlcnMoY2xzOiBhbnkpOiBhbnlbXSB7XG4gICAgICAgIGNvbnN0IHN1cGVyY2xhc3NlcyA9IFtdO1xuICAgICAgICBjb25zdCBzdXBlcmNsYXNzID0gT2JqZWN0LmdldFByb3RvdHlwZU9mKGNscyk7XG4gICAgICBcbiAgICAgICAgaWYgKHN1cGVyY2xhc3MgIT09IG51bGwgJiYgc3VwZXJjbGFzcyAhPT0gT2JqZWN0LnByb3RvdHlwZSkge1xuICAgICAgICAgICAgc3VwZXJjbGFzc2VzLnB1c2goc3VwZXJjbGFzcyk7XG4gICAgICAgICAgICBjb25zdCBwYXJlbnRTdXBlcmNsYXNzZXMgPSBVdGlsLmdldFN1cGVycyhzdXBlcmNsYXNzKTtcbiAgICAgICAgICAgIHN1cGVyY2xhc3Nlcy5wdXNoKC4uLnBhcmVudFN1cGVyY2xhc3Nlcyk7XG4gICAgICAgIH1cbiAgICAgIFxuICAgICAgICByZXR1cm4gc3VwZXJjbGFzc2VzO1xuICAgIH1cblxuICAgIHN0YXRpYyBzaHVmZmxlQXJyYXkoYXJyOiBhbnlbXSkge1xuICAgICAgICBmb3IgKGxldCBpID0gYXJyLmxlbmd0aCAtIDE7IGkgPiAwOyBpLS0pIHtcbiAgICAgICAgICAgIGNvbnN0IGogPSBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiAoaSArIDEpKTtcbiAgICAgICAgICAgIGNvbnN0IHRlbXAgPSBhcnJbaV07XG4gICAgICAgICAgICBhcnJbaV0gPSBhcnJbal07XG4gICAgICAgICAgICBhcnJbal0gPSB0ZW1wO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgc3RhdGljIGFyck11bChhcnI6IGFueVtdLCBuOiBudW1iZXIpIHtcbiAgICAgICAgY29uc3QgcmVzID0gW107XG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgbjsgaSsrKSB7XG4gICAgICAgICAgICByZXMucHVzaChhcnIpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiByZXM7XG4gICAgfVxuXG4gICAgc3RhdGljIGFzc2lnbkVsZW1lbnRzKGFycjogYW55W10sIG5ld3ZhbHM6IGFueVtdLCBzdGFydDogbnVtYmVyLCBzdGVwOiBudW1iZXIpIHtcbiAgICAgICAgbGV0IGNvdW50ID0gMDtcbiAgICAgICAgZm9yIChsZXQgaSA9IHN0YXJ0OyBpIDwgYXJyLmxlbmd0aDsgaSs9c3RlcCkge1xuICAgICAgICAgICAgYXJyW2ldID0gbmV3dmFsc1tjb3VudF07XG4gICAgICAgICAgICBjb3VudCsrO1xuICAgICAgICB9XG4gICAgfVxufVxuXG4vLyBjdXN0b20gdmVyc2lvbiBvZiB0aGUgU2V0IGNsYXNzXG4vLyBuZWVkZWQgc2luY2Ugc3ltcHkgcmVsaWVzIG9uIGl0ZW0gdHVwbGVzIHdpdGggZXF1YWwgY29udGVudHMgYmVpbmcgbWFwcGVkXG4vLyB0byB0aGUgc2FtZSBlbnRyeVxuY2xhc3MgSGFzaFNldCB7XG4gICAgZGljdDogUmVjb3JkPHN0cmluZywgYW55PjtcbiAgICBzaXplOiBudW1iZXI7XG4gICAgc29ydGVkQXJyOiBhbnlbXTtcblxuICAgIGNvbnN0cnVjdG9yKGFycj86IGFueVtdKSB7XG4gICAgICAgIHRoaXMuc2l6ZSA9IDA7XG4gICAgICAgIHRoaXMuZGljdCA9IHt9O1xuICAgICAgICBpZiAoYXJyKSB7XG4gICAgICAgICAgICBBcnJheS5mcm9tKGFycikuZm9yRWFjaCgoZWxlbWVudCkgPT4ge1xuICAgICAgICAgICAgICAgIHRoaXMuYWRkKGVsZW1lbnQpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBjbG9uZSgpOiBIYXNoU2V0IHtcbiAgICAgICAgY29uc3QgbmV3c2V0OiBIYXNoU2V0ID0gbmV3IEhhc2hTZXQoKTtcbiAgICAgICAgZm9yIChjb25zdCBpdGVtIG9mIE9iamVjdC52YWx1ZXModGhpcy5kaWN0KSkge1xuICAgICAgICAgICAgbmV3c2V0LmFkZChpdGVtKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gbmV3c2V0O1xuICAgIH1cblxuICAgIGVuY29kZShpdGVtOiBhbnkpOiBzdHJpbmcge1xuICAgICAgICByZXR1cm4gVXRpbC5oYXNoS2V5KGl0ZW0pO1xuICAgIH1cblxuICAgIGFkZChpdGVtOiBhbnkpIHtcbiAgICAgICAgY29uc3Qga2V5ID0gdGhpcy5lbmNvZGUoaXRlbSk7XG4gICAgICAgIGlmICghKGtleSBpbiB0aGlzLmRpY3QpKSB7XG4gICAgICAgICAgICB0aGlzLnNpemUrKztcbiAgICAgICAgfTtcbiAgICAgICAgdGhpcy5kaWN0W2tleV0gPSBpdGVtO1xuICAgIH1cblxuICAgIGFkZEFycihhcnI6IGFueVtdKSB7XG4gICAgICAgIGZvciAoY29uc3QgZSBvZiBhcnIpIHtcbiAgICAgICAgICAgIHRoaXMuYWRkKGUpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgaGFzKGl0ZW06IGFueSkge1xuICAgICAgICByZXR1cm4gdGhpcy5lbmNvZGUoaXRlbSkgaW4gdGhpcy5kaWN0O1xuICAgIH1cblxuICAgIHRvQXJyYXkoKSB7XG4gICAgICAgIHJldHVybiBPYmplY3QudmFsdWVzKHRoaXMuZGljdCk7XG4gICAgfVxuXG4gICAgLy8gZ2V0IHRoZSBoYXNoa2V5IGZvciB0aGlzIHNldCAoZS5nLiwgaW4gYSBkaWN0aW9uYXJ5KVxuICAgIGhhc2hLZXkoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLnRvQXJyYXkoKVxuICAgICAgICAgICAgLm1hcCgoZSkgPT4gVXRpbC5oYXNoS2V5KGUpKVxuICAgICAgICAgICAgLnNvcnQoKVxuICAgICAgICAgICAgLmpvaW4oXCIsXCIpO1xuICAgIH1cblxuICAgIGlzRW1wdHkoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLnNpemUgPT09IDA7XG4gICAgfVxuXG4gICAgcmVtb3ZlKGl0ZW06IGFueSkge1xuICAgICAgICB0aGlzLnNpemUtLTtcbiAgICAgICAgZGVsZXRlIHRoaXMuZGljdFt0aGlzLmVuY29kZShpdGVtKV07XG4gICAgfVxuXG4gICAgZ2V0KGtleTogYW55KSB7XG4gICAgICAgIHJldHVybiB0aGlzLmRpY3RbVXRpbC5oYXNoS2V5KGtleSldO1xuICAgIH1cblxuICAgIHNldChrZXk6IGFueSwgdmFsOiBhbnkpIHtcbiAgICAgICAgdGhpcy5kaWN0W1V0aWwuaGFzaEtleShrZXkpXSA9IHZhbDtcbiAgICB9XG5cbiAgICBzb3J0KGtleWZ1bmM6IGFueSA9ICgoYTogYW55LCBiOiBhbnkpID0+IGEgLSBiKSwgcmV2ZXJzZTogYm9vbGVhbiA9IHRydWUpIHtcbiAgICAgICAgdGhpcy5zb3J0ZWRBcnIgPSB0aGlzLnRvQXJyYXkoKTtcbiAgICAgICAgdGhpcy5zb3J0ZWRBcnIuc29ydChrZXlmdW5jKTtcbiAgICAgICAgaWYgKHJldmVyc2UpIHtcbiAgICAgICAgICAgIHRoaXMuc29ydGVkQXJyLnJldmVyc2UoKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHBvcCgpIHtcbiAgICAgICAgdGhpcy5zb3J0KCk7IC8vICEhISBzbG93IGJ1dCBJIGRvbid0IHNlZSBhIHdvcmsgYXJvdW5kXG4gICAgICAgIGlmICh0aGlzLnNvcnRlZEFyci5sZW5ndGggPj0gMSkge1xuICAgICAgICAgICAgY29uc3QgdGVtcCA9IHRoaXMuc29ydGVkQXJyW3RoaXMuc29ydGVkQXJyLmxlbmd0aCAtIDFdO1xuICAgICAgICAgICAgdGhpcy5yZW1vdmUodGVtcCk7XG4gICAgICAgICAgICByZXR1cm4gdGVtcDtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiB1bmRlZmluZWQ7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBkaWZmZXJlbmNlKG90aGVyOiBIYXNoU2V0KSB7XG4gICAgICAgIGNvbnN0IHJlcyA9IG5ldyBIYXNoU2V0KCk7XG4gICAgICAgIGZvciAoY29uc3QgaSBvZiB0aGlzLnRvQXJyYXkoKSkge1xuICAgICAgICAgICAgaWYgKCEob3RoZXIuaGFzKGkpKSkge1xuICAgICAgICAgICAgICAgIHJlcy5hZGQoaSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHJlcztcbiAgICB9XG59XG5cbi8vIGEgaGFzaGRpY3QgY2xhc3MgcmVwbGFjaW5nIHRoZSBkaWN0IGNsYXNzIGluIHB5dGhvblxuY2xhc3MgSGFzaERpY3Qge1xuICAgIHNpemU6IG51bWJlcjtcbiAgICBkaWN0OiBSZWNvcmQ8YW55LCBhbnk+O1xuXG4gICAgY29uc3RydWN0b3IoZDogUmVjb3JkPGFueSwgYW55PiA9IHt9KSB7XG4gICAgICAgIHRoaXMuc2l6ZSA9IDA7XG4gICAgICAgIHRoaXMuZGljdCA9IHt9O1xuICAgICAgICBmb3IgKGNvbnN0IGl0ZW0gb2YgT2JqZWN0LmVudHJpZXMoZCkpIHtcbiAgICAgICAgICAgIHRoaXMuZGljdFtVdGlsLmhhc2hLZXkoaXRlbVswXSldID0gW2l0ZW1bMF0sIGl0ZW1bMV1dO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgY2xvbmUoKSB7XG4gICAgICAgIHJldHVybiBuZXcgSGFzaERpY3QodGhpcy5kaWN0KTtcbiAgICB9XG5cbiAgICByZW1vdmUoaXRlbTogYW55KSB7XG4gICAgICAgIHRoaXMuc2l6ZS0tO1xuICAgICAgICBkZWxldGUgdGhpcy5kaWN0W1V0aWwuaGFzaEtleShpdGVtKV07XG4gICAgfVxuXG4gICAgc2V0ZGVmYXVsdChrZXk6IGFueSwgdmFsdWU6IGFueSkge1xuICAgICAgICBpZiAodGhpcy5oYXMoa2V5KSkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuZ2V0KGtleSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aGlzLmFkZChrZXksIHZhbHVlKTtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmdldChrZXkpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgZ2V0KGtleTogYW55LCBkZWY6IGFueSA9IHVuZGVmaW5lZCk6IGFueSB7XG4gICAgICAgIGNvbnN0IGhhc2ggPSBVdGlsLmhhc2hLZXkoa2V5KTtcbiAgICAgICAgaWYgKGhhc2ggaW4gdGhpcy5kaWN0KSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5kaWN0W2hhc2hdWzFdO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBkZWY7XG4gICAgfVxuXG4gICAgaGFzKGtleTogYW55KTogYm9vbGVhbiB7XG4gICAgICAgIGNvbnN0IGhhc2hLZXkgPSBVdGlsLmhhc2hLZXkoa2V5KTtcbiAgICAgICAgcmV0dXJuIGhhc2hLZXkgaW4gdGhpcy5kaWN0O1xuICAgIH1cblxuICAgIGFkZChrZXk6IGFueSwgdmFsdWU6IGFueSkge1xuICAgICAgICBjb25zdCBrZXlIYXNoID0gVXRpbC5oYXNoS2V5KGtleSk7XG4gICAgICAgIGlmICghKGtleUhhc2ggaW4gT2JqZWN0LmtleXModGhpcy5kaWN0KSkpIHtcbiAgICAgICAgICAgIHRoaXMuc2l6ZSsrO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuZGljdFtrZXlIYXNoXSA9IFtrZXksIHZhbHVlXTtcbiAgICB9XG5cbiAgICBrZXlzKCkge1xuICAgICAgICBjb25zdCB2YWxzID0gT2JqZWN0LnZhbHVlcyh0aGlzLmRpY3QpO1xuICAgICAgICByZXR1cm4gdmFscy5tYXAoKGUpID0+IGVbMF0pO1xuICAgIH1cblxuICAgIHZhbHVlcygpIHtcbiAgICAgICAgY29uc3QgdmFscyA9IE9iamVjdC52YWx1ZXModGhpcy5kaWN0KTtcbiAgICAgICAgcmV0dXJuIHZhbHMubWFwKChlKSA9PiBlWzFdKTtcbiAgICB9XG5cbiAgICBlbnRyaWVzKCkge1xuICAgICAgICByZXR1cm4gT2JqZWN0LnZhbHVlcyh0aGlzLmRpY3QpO1xuICAgIH1cblxuICAgIGFkZEFycihhcnI6IGFueVtdKSB7XG4gICAgICAgIGNvbnN0IGtleUhhc2ggPSBVdGlsLmhhc2hLZXkoYXJyWzBdKTtcbiAgICAgICAgdGhpcy5kaWN0W2tleUhhc2hdID0gYXJyO1xuICAgIH1cblxuICAgIGRlbGV0ZShrZXk6IGFueSkge1xuICAgICAgICBjb25zdCBrZXloYXNoID0gVXRpbC5oYXNoS2V5KGtleSk7XG4gICAgICAgIGlmIChrZXloYXNoIGluIHRoaXMuZGljdCkge1xuICAgICAgICAgICAgdGhpcy5zaXplLS07XG4gICAgICAgICAgICBkZWxldGUgdGhpcy5kaWN0W2tleWhhc2hdO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgbWVyZ2Uob3RoZXI6IEhhc2hEaWN0KSB7XG4gICAgICAgIGZvciAoY29uc3QgaXRlbSBvZiBvdGhlci5lbnRyaWVzKCkpIHtcbiAgICAgICAgICAgIHRoaXMuYWRkKGl0ZW1bMF0sIGl0ZW1bMV0pO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgY29weSgpIHtcbiAgICAgICAgY29uc3QgcmVzOiBIYXNoRGljdCA9IG5ldyBIYXNoRGljdCgpO1xuICAgICAgICBmb3IgKGNvbnN0IGl0ZW0gb2YgdGhpcy5lbnRyaWVzKCkpIHtcbiAgICAgICAgICAgIHJlcy5hZGQoaXRlbVswXSwgaXRlbVsxXSk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHJlcztcbiAgICB9XG5cbiAgICBpc1NhbWUob3RoZXI6IEhhc2hEaWN0KSB7XG4gICAgICAgIGNvbnN0IGFycjEgPSB0aGlzLmVudHJpZXMoKS5zb3J0KCk7XG4gICAgICAgIGNvbnN0IGFycjIgPSBvdGhlci5lbnRyaWVzKCkuc29ydCgpO1xuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGFycjEubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIGlmICghKFV0aWwuYXJyRXEoYXJyMVtpXSwgYXJyMltpXSkpKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cbn1cblxuXG4vLyBzeW1weSBvZnRlbiB1c2VzIGRlZmF1bHRkaWN0KHNldCkgd2hpY2ggaXMgbm90IGF2YWlsYWJsZSBpbiB0c1xuLy8gd2UgY3JlYXRlIGEgcmVwbGFjZW1lbnQgZGljdGlvbmFyeSBjbGFzcyB3aGljaCByZXR1cm5zIGFuIGVtcHR5IHNldFxuLy8gaWYgdGhlIGtleSB1c2VkIGlzIG5vdCBpbiB0aGUgZGljdGlvbmFyeVxuY2xhc3MgU2V0RGVmYXVsdERpY3QgZXh0ZW5kcyBIYXNoRGljdCB7XG4gICAgY29uc3RydWN0b3IoKSB7XG4gICAgICAgIHN1cGVyKCk7XG4gICAgfVxuXG4gICAgZ2V0KGtleTogYW55KSB7XG4gICAgICAgIGNvbnN0IGtleUhhc2ggPSBVdGlsLmhhc2hLZXkoa2V5KTtcbiAgICAgICAgaWYgKGtleUhhc2ggaW4gdGhpcy5kaWN0KSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5kaWN0W2tleUhhc2hdWzFdO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBuZXcgSGFzaFNldCgpO1xuICAgIH1cbn1cblxuY2xhc3MgSW50RGVmYXVsdERpY3QgZXh0ZW5kcyBIYXNoRGljdCB7XG4gICAgY29uc3RydWN0b3IoKSB7XG4gICAgICAgIHN1cGVyKCk7XG4gICAgfVxuXG4gICAgaW5jcmVtZW50KGtleTogYW55LCB2YWw6IGFueSkge1xuICAgICAgICBjb25zdCBrZXlIYXNoID0gVXRpbC5oYXNoS2V5KGtleSk7XG4gICAgICAgIGlmIChrZXlIYXNoIGluIHRoaXMuZGljdCkge1xuICAgICAgICAgICAgdGhpcy5kaWN0W2tleUhhc2hdICs9IHZhbDtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMuZGljdFtrZXlIYXNoXSA9IDA7XG4gICAgICAgICAgICB0aGlzLmRpY3Rba2V5SGFzaF0gKz0gdmFsO1xuICAgICAgICB9XG4gICAgfVxufVxuXG5jbGFzcyBBcnJEZWZhdWx0RGljdCBleHRlbmRzIEhhc2hEaWN0IHtcbiAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICAgICAgc3VwZXIoKTtcbiAgICB9XG5cbiAgICBnZXQoa2V5OiBhbnkpIHtcbiAgICAgICAgY29uc3Qga2V5SGFzaCA9IFV0aWwuaGFzaEtleShrZXkpO1xuICAgICAgICBpZiAoa2V5SGFzaCBpbiB0aGlzLmRpY3QpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmRpY3Rba2V5SGFzaF1bMV07XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIFtdO1xuICAgIH1cbn1cblxuXG4vLyBhbiBpbXBsaWNhdGlvbiBjbGFzcyB1c2VkIGFzIGFuIGFsdGVybmF0aXZlIHRvIHR1cGxlcyBpbiBzeW1weVxuY2xhc3MgSW1wbGljYXRpb24ge1xuICAgIHA7XG4gICAgcTtcblxuICAgIGNvbnN0cnVjdG9yKHA6IGFueSwgcTogYW55KSB7XG4gICAgICAgIHRoaXMucCA9IHA7XG4gICAgICAgIHRoaXMucSA9IHE7XG4gICAgfVxuXG4gICAgaGFzaEtleSgpIHtcbiAgICAgICAgcmV0dXJuICh0aGlzLnAgYXMgc3RyaW5nKSArICh0aGlzLnEgYXMgc3RyaW5nKTtcbiAgICB9XG59XG5cblxuLy8gYW4gTFJVIGNhY2hlIGltcGxlbWVudGF0aW9uIHVzZWQgZm9yIGNhY2hlLnRzXG5cbmludGVyZmFjZSBOb2RlIHtcbiAgICBrZXk6IGFueTtcbiAgICB2YWx1ZTogYW55O1xuICAgIHByZXY6IGFueTtcbiAgICBuZXh0OiBhbnk7XG59XG5cbmNsYXNzIExSVUNhY2hlIHtcbiAgICBjYXBhY2l0eTogbnVtYmVyO1xuICAgIG1hcDogSGFzaERpY3Q7XG4gICAgaGVhZDogYW55O1xuICAgIHRhaWw6IGFueTtcblxuICAgIGNvbnN0cnVjdG9yKGNhcGFjaXR5OiBudW1iZXIpIHtcbiAgICAgICAgdGhpcy5jYXBhY2l0eSA9IGNhcGFjaXR5O1xuICAgICAgICB0aGlzLm1hcCA9IG5ldyBIYXNoRGljdCgpO1xuXG4gICAgICAgIC8vIHRoZXNlIGFyZSBib3VuZGFyaWVzIGZvciB0aGUgZG91YmxlIGxpbmtlZCBsaXN0XG4gICAgICAgIHRoaXMuaGVhZCA9IHt9O1xuICAgICAgICB0aGlzLnRhaWwgPSB7fTtcblxuICAgICAgICB0aGlzLmhlYWQubmV4dCA9IHRoaXMuaGVhZDtcbiAgICAgICAgdGhpcy50YWlsLnByZXYgPSB0aGlzLmhlYWQ7XG4gICAgfVxuXG4gICAgZ2V0KGtleTogYW55KSB7XG4gICAgICAgIGlmICh0aGlzLm1hcC5oYXMoa2V5KSkge1xuICAgICAgICAgICAgLy8gcmVtb3ZlIGVsZW1lbnQgZnJvbSB0aGUgY3VycmVudCBwb3NpdGlvblxuICAgICAgICAgICAgY29uc3QgYyA9IHRoaXMubWFwLmdldChrZXkpO1xuICAgICAgICAgICAgYy5wcmV2Lm5leHQgPSBjLm5leHQ7XG4gICAgICAgICAgICBjLm5leHQucHJldiA9IGMucHJldjtcblxuICAgICAgICAgICAgdGhpcy50YWlsLnByZXYubmV4dCA9IGM7IC8vIGluc2VydCBhZnRlciBsYXN0IGVsZW1lbnRcbiAgICAgICAgICAgIGMucHJldiA9IHRoaXMudGFpbC5wcmV2O1xuICAgICAgICAgICAgYy5uZXh0ID0gdGhpcy50YWlsO1xuICAgICAgICAgICAgdGhpcy50YWlsLnByZXYgPSBjO1xuXG4gICAgICAgICAgICByZXR1cm4gYy52YWx1ZTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiB1bmRlZmluZWQ7IC8vIGludmFsaWQga2V5XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBwdXQoa2V5OiBhbnksIHZhbHVlOiBhbnkpIHtcbiAgICAgICAgaWYgKHR5cGVvZiB0aGlzLmdldChrZXkpICE9PSBcInVuZGVmaW5lZFwiKSB7IC8vIHRoZSBrZXkgaXMgaW52YWxpZFxuICAgICAgICAgICAgdGhpcy50YWlsLnByZXYudmFsdWUgPSB2YWx1ZTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIC8vIGNoZWNrIGZvciBjYXBhY2l0eVxuICAgICAgICAgICAgaWYgKHRoaXMubWFwLnNpemUgPT09IHRoaXMuY2FwYWNpdHkpIHtcbiAgICAgICAgICAgICAgICB0aGlzLm1hcC5kZWxldGUodGhpcy5oZWFkLm5leHQua2V5KTsgLy8gZGVsZXRlIGZpcnN0IGVsZW1lbnRcbiAgICAgICAgICAgICAgICB0aGlzLmhlYWQubmV4dCA9IHRoaXMuaGVhZC5uZXh0Lm5leHQ7IC8vIHJlcGxhY2Ugd2l0aCBuZXh0XG4gICAgICAgICAgICAgICAgdGhpcy5oZWFkLm5leHQucHJldiA9IHRoaXMuaGVhZDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBjb25zdCBuZXdOb2RlOiBOb2RlID0ge1xuICAgICAgICAgICAgdmFsdWUsXG4gICAgICAgICAgICBrZXksXG4gICAgICAgICAgICBwcmV2OiBudWxsLFxuICAgICAgICAgICAgbmV4dDogbnVsbCxcbiAgICAgICAgfTsgLy8gZWFjaCBub2RlIGlzIGEgaGFzaCBlbnRyeVxuXG4gICAgICAgIC8vIHdoZW4gYWRkaW5nIGEgbmV3IG5vZGUsIHdlIG5lZWQgdG8gdXBkYXRlIGJvdGggbWFwIGFuZCBETExcbiAgICAgICAgdGhpcy5tYXAuYWRkKGtleSwgbmV3Tm9kZSk7IC8vIGFkZCB0aGUgY3VycmVudCBub2RlXG4gICAgICAgIHRoaXMudGFpbC5wcmV2Lm5leHQgPSBuZXdOb2RlOyAvLyBhZGQgbm9kZSB0byB0aGUgZW5kXG4gICAgICAgIG5ld05vZGUucHJldiA9IHRoaXMudGFpbC5wcmV2O1xuICAgICAgICBuZXdOb2RlLm5leHQgPSB0aGlzLnRhaWw7XG4gICAgICAgIHRoaXMudGFpbC5wcmV2ID0gbmV3Tm9kZTtcbiAgICB9XG59XG5cbmNsYXNzIEl0ZXJhdG9yIHtcbiAgICBhcnI6IGFueVtdO1xuICAgIGNvdW50ZXI7XG5cbiAgICBjb25zdHJ1Y3RvcihhcnI6IGFueVtdKSB7XG4gICAgICAgIHRoaXMuYXJyID0gYXJyO1xuICAgICAgICB0aGlzLmNvdW50ZXIgPSAwO1xuICAgIH1cblxuICAgIG5leHQoKSB7XG4gICAgICAgIGlmICh0aGlzLmNvdW50ZXIgPj0gdGhpcy5hcnIubGVuZ3RoKSB7XG4gICAgICAgICAgICByZXR1cm4gdW5kZWZpbmVkO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuY291bnRlcisrO1xuICAgICAgICByZXR1cm4gdGhpcy5hcnJbdGhpcy5jb3VudGVyLTFdO1xuICAgIH1cbn1cblxuLy8gbWl4aW4gY2xhc3MgdXNlZCB0byByZXBsaWNhdGUgbXVsdGlwbGUgaW5oZXJpdGFuY2VcblxuY2xhc3MgTWl4aW5CdWlsZGVyIHtcbiAgICBzdXBlcmNsYXNzO1xuICAgIGNvbnN0cnVjdG9yKHN1cGVyY2xhc3M6IGFueSkge1xuICAgICAgICB0aGlzLnN1cGVyY2xhc3MgPSBzdXBlcmNsYXNzO1xuICAgIH1cbiAgICB3aXRoKC4uLm1peGluczogYW55W10pIHtcbiAgICAgICAgcmV0dXJuIG1peGlucy5yZWR1Y2UoKGMsIG1peGluKSA9PiBtaXhpbihjKSwgdGhpcy5zdXBlcmNsYXNzKTtcbiAgICB9XG59XG5cbmNsYXNzIGJhc2Uge31cblxuY29uc3QgbWl4ID0gKHN1cGVyY2xhc3M6IGFueSkgPT4gbmV3IE1peGluQnVpbGRlcihzdXBlcmNsYXNzKTtcblxuXG5leHBvcnQge1V0aWwsIEhhc2hTZXQsIFNldERlZmF1bHREaWN0LCBIYXNoRGljdCwgSW1wbGljYXRpb24sIExSVUNhY2hlLCBJdGVyYXRvciwgSW50RGVmYXVsdERpY3QsIEFyckRlZmF1bHREaWN0LCBtaXgsIGJhc2V9O1xuXG4iLCAiLyogZXNsaW50LWRpc2FibGUgbmV3LWNhcCAqL1xuLyogZXNsaW50LWRpc2FibGUgbm8tdW51c2VkLXZhcnMgKi9cbi8qXG5cbk5vdGFibGUgY2huYWdlcyBtYWRlIChXQiAmIEdNKTpcbi0gTnVsbCBpcyBiZWluZyB1c2VkIGFzIGEgdGhpcmQgYm9vbGVhbiB2YWx1ZSBpbnN0ZWFkIG9mICdub25lJ1xuLSBBcnJheXMgYXJlIGJlaW5nIHVzZWQgaW5zdGVhZCBvZiB0dXBsZXNcbi0gVGhlIG1ldGhvZHMgaGFzaEtleSgpIGFuZCB0b1N0cmluZygpIGFyZSBhZGRlZCB0byBMb2dpYyBmb3IgaGFzaGluZy4gVGhlXG4gIHN0YXRpYyBtZXRob2QgaGFzaEtleSgpIGlzIGFsc28gYWRkZWQgdG8gTG9naWMgYW5kIGhhc2hlcyBkZXBlbmRpbmcgb24gdGhlIGlucHV0LlxuLSBUaGUgYXJyYXkgYXJncyBpbiB0aGUgQW5kT3JfQmFzZSBjb25zdHJ1Y3RvciBpcyBub3Qgc29ydGVkIG9yIHB1dCBpbiBhIHNldFxuICBzaW5jZSB3ZSBkaWQndCBzZWUgd2h5IHRoaXMgd291bGQgYmUgbmVjZXNhcnlcbi0gQSBjb25zdHJ1Y3RvciBpcyBhZGRlZCB0byB0aGUgbG9naWMgY2xhc3MsIHdoaWNoIGlzIHVzZWQgYnkgTG9naWMgYW5kIGl0c1xuICBzdWJjbGFzc2VzIChBbmRPcl9CYXNlLCBBbmQsIE9yLCBOb3QpXG4tIEluIHRoZSBmbGF0dGVuIG1ldGhvZCBvZiBBbmRPcl9CYXNlIHdlIHJlbW92ZWQgdGhlIHRyeSBjYXRjaCBhbmQgY2hhbmdlZCB0aGVcbiAgd2hpbGUgbG9vcCB0byBkZXBlbmQgb24gdGhlIGxlZ250aCBvZiB0aGUgYXJncyBhcnJheVxuLSBBZGRlZCBleHBhbmQoKSBhbmQgZXZhbF9wcm9wYWdhdGVfbm90IGFzIGFic3RyYWN0IG1ldGhvZHMgdG8gdGhlIExvZ2ljIGNsYXNzXG4tIEFkZGVkIHN0YXRpYyBOZXcgbWV0aG9kcyB0byBOb3QsIEFuZCwgYW5kIE9yIHdoaWNoIGZ1bmN0aW9uIGFzIGNvbnN0cnVjdG9yc1xuLSBSZXBsYWNlbWQgbm9ybWFsIGJvb2xlYW5zIHdpdGggTG9naWMuVHJ1ZSBhbmQgTG9naWMuRmFsc2Ugc2luY2UgaXQgaXMgc29tZXRpbWVzXG5uZWNlc2FyeSB0byBmaW5kIGlmIGEgZ2l2ZW4gYXJndW1lbmV0IGlzIGEgYm9vbGVhblxuLSBBZGRlZCBzb21lIHYyIG1ldGhvZHMgd2hpY2ggcmV0dXJuIHRydWUsIGZhbHNlLCBhbmQgdW5kZWZpbmVkLCB3aGljaCB3b3Jrc1xuICB3aXRoIHRoZSByZXN0IG9mIHRoZSBjb2RlXG5cbiovXG5cbmltcG9ydCB7VXRpbH0gZnJvbSBcIi4vdXRpbGl0eVwiO1xuXG5cbmZ1bmN0aW9uIF90b3JmKGFyZ3M6IGFueVtdKTogTG9naWMgfCBudWxsIHtcbiAgICAvKiBSZXR1cm4gVHJ1ZSBpZiBhbGwgYXJncyBhcmUgVHJ1ZSwgRmFsc2UgaWYgdGhleVxuICAgIGFyZSBhbGwgRmFsc2UsIGVsc2UgTm9uZVxuICAgID4+PiBmcm9tIHN5bXB5LmNvcmUubG9naWMgaW1wb3J0IF90b3JmXG4gICAgPj4+IF90b3JmKChUcnVlLCBUcnVlKSlcbiAgICBUcnVlXG4gICAgPj4+IF90b3JmKChGYWxzZSwgRmFsc2UpKVxuICAgIEZhbHNlXG4gICAgPj4+IF90b3JmKChUcnVlLCBGYWxzZSkpXG4gICAgKi9cbiAgICBsZXQgc2F3VCA9IExvZ2ljLkZhbHNlO1xuICAgIGxldCBzYXdGID0gTG9naWMuRmFsc2U7XG4gICAgZm9yIChjb25zdCBhIG9mIGFyZ3MpIHtcbiAgICAgICAgaWYgKGEgPT09IExvZ2ljLlRydWUpIHtcbiAgICAgICAgICAgIGlmIChzYXdGIGluc3RhbmNlb2YgVHJ1ZSkge1xuICAgICAgICAgICAgICAgIHJldHVybiBudWxsO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgc2F3VCA9IExvZ2ljLlRydWU7XG4gICAgICAgIH0gZWxzZSBpZiAoYSA9PT0gTG9naWMuRmFsc2UpIHtcbiAgICAgICAgICAgIGlmIChzYXdUIGluc3RhbmNlb2YgVHJ1ZSkge1xuICAgICAgICAgICAgICAgIHJldHVybiBudWxsO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgc2F3RiA9IExvZ2ljLlRydWU7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gc2F3VDtcbn1cblxuZnVuY3Rpb24gX2Z1enp5X2dyb3VwKGFyZ3M6IGFueVtdLCBxdWlja19leGl0ID0gTG9naWMuRmFsc2UpOiBMb2dpYyB8IG51bGwge1xuICAgIC8qIFJldHVybiBUcnVlIGlmIGFsbCBhcmdzIGFyZSBUcnVlLCBOb25lIGlmIHRoZXJlIGlzIGFueSBOb25lIGVsc2UgRmFsc2VcbiAgICB1bmxlc3MgYGBxdWlja19leGl0YGAgaXMgVHJ1ZSAodGhlbiByZXR1cm4gTm9uZSBhcyBzb29uIGFzIGEgc2Vjb25kIEZhbHNlXG4gICAgaXMgc2Vlbi5cbiAgICAgYGBfZnV6enlfZ3JvdXBgYCBpcyBsaWtlIGBgZnV6enlfYW5kYGAgZXhjZXB0IHRoYXQgaXQgaXMgbW9yZVxuICAgIGNvbnNlcnZhdGl2ZSBpbiByZXR1cm5pbmcgYSBGYWxzZSwgd2FpdGluZyB0byBtYWtlIHN1cmUgdGhhdCBhbGxcbiAgICBhcmd1bWVudHMgYXJlIFRydWUgb3IgRmFsc2UgYW5kIHJldHVybmluZyBOb25lIGlmIGFueSBhcmd1bWVudHMgYXJlXG4gICAgTm9uZS4gSXQgYWxzbyBoYXMgdGhlIGNhcGFiaWxpdHkgb2YgcGVybWl0aW5nIG9ubHkgYSBzaW5nbGUgRmFsc2UgYW5kXG4gICAgcmV0dXJuaW5nIE5vbmUgaWYgbW9yZSB0aGFuIG9uZSBpcyBzZWVuLiBGb3IgZXhhbXBsZSwgdGhlIHByZXNlbmNlIG9mIGFcbiAgICBzaW5nbGUgdHJhbnNjZW5kZW50YWwgYW1vbmdzdCByYXRpb25hbHMgd291bGQgaW5kaWNhdGUgdGhhdCB0aGUgZ3JvdXAgaXNcbiAgICBubyBsb25nZXIgcmF0aW9uYWw7IGJ1dCBhIHNlY29uZCB0cmFuc2NlbmRlbnRhbCBpbiB0aGUgZ3JvdXAgd291bGQgbWFrZSB0aGVcbiAgICBkZXRlcm1pbmF0aW9uIGltcG9zc2libGUuXG4gICAgRXhhbXBsZXNcbiAgICA9PT09PT09PVxuICAgID4+PiBmcm9tIHN5bXB5LmNvcmUubG9naWMgaW1wb3J0IF9mdXp6eV9ncm91cFxuICAgIEJ5IGRlZmF1bHQsIG11bHRpcGxlIEZhbHNlcyBtZWFuIHRoZSBncm91cCBpcyBicm9rZW46XG4gICAgPj4+IF9mdXp6eV9ncm91cChbRmFsc2UsIEZhbHNlLCBUcnVlXSlcbiAgICBGYWxzZVxuICAgIElmIG11bHRpcGxlIEZhbHNlcyBtZWFuIHRoZSBncm91cCBzdGF0dXMgaXMgdW5rbm93biB0aGVuIHNldFxuICAgIGBxdWlja19leGl0YCB0byBUcnVlIHNvIE5vbmUgY2FuIGJlIHJldHVybmVkIHdoZW4gdGhlIDJuZCBGYWxzZSBpcyBzZWVuOlxuICAgID4+PiBfZnV6enlfZ3JvdXAoW0ZhbHNlLCBGYWxzZSwgVHJ1ZV0sIHF1aWNrX2V4aXQ9VHJ1ZSlcbiAgICBCdXQgaWYgb25seSBhIHNpbmdsZSBGYWxzZSBpcyBzZWVuIHRoZW4gdGhlIGdyb3VwIGlzIGtub3duIHRvXG4gICAgYmUgYnJva2VuOlxuICAgID4+PiBfZnV6enlfZ3JvdXAoW0ZhbHNlLCBUcnVlLCBUcnVlXSwgcXVpY2tfZXhpdD1UcnVlKVxuICAgIEZhbHNlXG4gICAgKi9cbiAgICBsZXQgc2F3X290aGVyID0gTG9naWMuRmFsc2U7XG4gICAgZm9yIChjb25zdCBhIG9mIGFyZ3MpIHtcbiAgICAgICAgaWYgKGEgPT09IExvZ2ljLlRydWUpIHtcbiAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICB9IGlmIChhID09IG51bGwpIHtcbiAgICAgICAgICAgIHJldHVybiBudWxsO1xuICAgICAgICB9IGlmIChxdWlja19leGl0IGluc3RhbmNlb2YgVHJ1ZSAmJiBzYXdfb3RoZXIgaW5zdGFuY2VvZiBUcnVlKSB7XG4gICAgICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgICAgfVxuICAgICAgICBzYXdfb3RoZXIgPSBMb2dpYy5UcnVlO1xuICAgIH1cbiAgICBpZiAoc2F3X290aGVyIGluc3RhbmNlb2YgVHJ1ZSkge1xuICAgICAgICByZXR1cm4gTG9naWMuRmFsc2U7XG4gICAgfVxuICAgIHJldHVybiBMb2dpYy5UcnVlO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gX2Z1enp5X2dyb3VwdjIoYXJnczogYW55W10pIHtcbiAgICBjb25zdCByZXMgPSBfZnV6enlfZ3JvdXAoYXJncyk7XG4gICAgaWYgKHJlcyA9PT0gTG9naWMuVHJ1ZSkge1xuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9IGVsc2UgaWYgKHJlcyA9PT0gTG9naWMuRmFsc2UpIHtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgICByZXR1cm4gdW5kZWZpbmVkO1xufVxuXG5cbmZ1bmN0aW9uIGZ1enp5X2Jvb2woeDogTG9naWMpOiBMb2dpYyB8IG51bGwge1xuICAgIC8qIFJldHVybiBUcnVlLCBGYWxzZSBvciBOb25lIGFjY29yZGluZyB0byB4LlxuICAgIFdoZXJlYXMgYm9vbCh4KSByZXR1cm5zIFRydWUgb3IgRmFsc2UsIGZ1enp5X2Jvb2wgYWxsb3dzXG4gICAgZm9yIHRoZSBOb25lIHZhbHVlIGFuZCBub24gLSBmYWxzZSB2YWx1ZXMod2hpY2ggYmVjb21lIE5vbmUpLCB0b28uXG4gICAgRXhhbXBsZXNcbiAgICA9PT09PT09PVxuICAgID4+PiBmcm9tIHN5bXB5LmNvcmUubG9naWMgaW1wb3J0IGZ1enp5X2Jvb2xcbiAgICA+Pj4gZnJvbSBzeW1weS5hYmMgaW1wb3J0IHhcbiAgICA+Pj4gZnV6enlfYm9vbCh4KSwgZnV6enlfYm9vbChOb25lKVxuICAgIChOb25lLCBOb25lKVxuICAgID4+PiBib29sKHgpLCBib29sKE5vbmUpXG4gICAgICAgIChUcnVlLCBGYWxzZSlcbiAgICAqL1xuICAgIGlmICh4ID09IG51bGwpIHtcbiAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuICAgIGlmICh4IGluc3RhbmNlb2YgVHJ1ZSkge1xuICAgICAgICByZXR1cm4gTG9naWMuVHJ1ZTtcbiAgICB9XG4gICAgaWYgKHggaW5zdGFuY2VvZiBGYWxzZSkge1xuICAgICAgICByZXR1cm4gTG9naWMuRmFsc2U7XG4gICAgfVxufVxuXG5mdW5jdGlvbiBmdXp6eV9ib29sX3YyKHg6IGJvb2xlYW4pIHtcbiAgICAvKiBSZXR1cm4gVHJ1ZSwgRmFsc2Ugb3IgTm9uZSBhY2NvcmRpbmcgdG8geC5cbiAgICBXaGVyZWFzIGJvb2woeCkgcmV0dXJucyBUcnVlIG9yIEZhbHNlLCBmdXp6eV9ib29sIGFsbG93c1xuICAgIGZvciB0aGUgTm9uZSB2YWx1ZSBhbmQgbm9uIC0gZmFsc2UgdmFsdWVzKHdoaWNoIGJlY29tZSBOb25lKSwgdG9vLlxuICAgIEV4YW1wbGVzXG4gICAgPT09PT09PT1cbiAgICA+Pj4gZnJvbSBzeW1weS5jb3JlLmxvZ2ljIGltcG9ydCBmdXp6eV9ib29sXG4gICAgPj4+IGZyb20gc3ltcHkuYWJjIGltcG9ydCB4XG4gICAgPj4+IGZ1enp5X2Jvb2woeCksIGZ1enp5X2Jvb2woTm9uZSlcbiAgICAoTm9uZSwgTm9uZSlcbiAgICA+Pj4gYm9vbCh4KSwgYm9vbChOb25lKVxuICAgICAgICAoVHJ1ZSwgRmFsc2UpXG4gICAgKi9cbiAgICBpZiAodHlwZW9mIHggPT09IFwidW5kZWZpbmVkXCIpIHtcbiAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuICAgIGlmICh4ID09PSB0cnVlKSB7XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cbiAgICBpZiAoeCA9PT0gZmFsc2UpIHtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbn1cblxuZnVuY3Rpb24gZnV6enlfYW5kKGFyZ3M6IGFueVtdKTogTG9naWMgfCBudWxsIHtcbiAgICAvKiBSZXR1cm4gVHJ1ZSAoYWxsIFRydWUpLCBGYWxzZSAoYW55IEZhbHNlKSBvciBOb25lLlxuICAgIEV4YW1wbGVzXG4gICAgPT09PT09PT1cbiAgICA+Pj4gZnJvbSBzeW1weS5jb3JlLmxvZ2ljIGltcG9ydCBmdXp6eV9hbmRcbiAgICA+Pj4gZnJvbSBzeW1weSBpbXBvcnQgRHVtbXlcbiAgICBJZiB5b3UgaGFkIGEgbGlzdCBvZiBvYmplY3RzIHRvIHRlc3QgdGhlIGNvbW11dGl2aXR5IG9mXG4gICAgYW5kIHlvdSB3YW50IHRoZSBmdXp6eV9hbmQgbG9naWMgYXBwbGllZCwgcGFzc2luZyBhblxuICAgIGl0ZXJhdG9yIHdpbGwgYWxsb3cgdGhlIGNvbW11dGF0aXZpdHkgdG8gb25seSBiZSBjb21wdXRlZFxuICAgIGFzIG1hbnkgdGltZXMgYXMgbmVjZXNzYXJ5LldpdGggdGhpcyBsaXN0LCBGYWxzZSBjYW4gYmVcbiAgICByZXR1cm5lZCBhZnRlciBhbmFseXppbmcgdGhlIGZpcnN0IHN5bWJvbDpcbiAgICA+Pj4gc3ltcyA9W0R1bW15KGNvbW11dGF0aXZlID0gRmFsc2UpLCBEdW1teSgpXVxuICAgID4+PiBmdXp6eV9hbmQocy5pc19jb21tdXRhdGl2ZSBmb3IgcyBpbiBzeW1zKVxuICAgIEZhbHNlXG4gICAgVGhhdCBGYWxzZSB3b3VsZCByZXF1aXJlIGxlc3Mgd29yayB0aGFuIGlmIGEgbGlzdCBvZiBwcmUgLSBjb21wdXRlZFxuICAgIGl0ZW1zIHdhcyBzZW50OlxuICAgID4+PiBmdXp6eV9hbmQoW3MuaXNfY29tbXV0YXRpdmUgZm9yIHMgaW4gc3ltc10pXG4gICAgRmFsc2VcbiAgICAqL1xuXG4gICAgbGV0IHJ2ID0gTG9naWMuVHJ1ZTtcbiAgICBmb3IgKGxldCBhaSBvZiBhcmdzKSB7XG4gICAgICAgIGFpID0gZnV6enlfYm9vbChhaSk7XG4gICAgICAgIGlmIChhaSBpbnN0YW5jZW9mIEZhbHNlKSB7XG4gICAgICAgICAgICByZXR1cm4gTG9naWMuRmFsc2U7XG4gICAgICAgIH0gaWYgKHJ2IGluc3RhbmNlb2YgVHJ1ZSkgeyAvLyB0aGlzIHdpbGwgc3RvcCB1cGRhdGluZyBpZiBhIE5vbmUgaXMgZXZlciB0cmFwcGVkXG4gICAgICAgICAgICBydiA9IGFpO1xuICAgICAgICB9XG4gICAgfVxuICAgIHJldHVybiBydjtcbn1cblxuZnVuY3Rpb24gZnV6enlfYW5kX3YyKGFyZ3M6IGFueVtdKSB7XG4gICAgbGV0IHJ2ID0gdHJ1ZTtcbiAgICBmb3IgKGxldCBhaSBvZiBhcmdzKSB7XG4gICAgICAgIGFpID0gZnV6enlfYm9vbF92MihhaSk7XG4gICAgICAgIGlmIChhaSA9PT0gZmFsc2UpIHtcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfSBpZiAocnYgPT09IHRydWUpIHtcbiAgICAgICAgICAgIHJ2ID0gYWk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIHJ2O1xufVxuXG5mdW5jdGlvbiBmdXp6eV9ub3QodjogYW55KTogTG9naWMgfCBudWxsIHtcbiAgICAvKlxuICAgIE5vdCBpbiBmdXp6eSBsb2dpY1xuICAgICAgICBSZXR1cm4gTm9uZSBpZiBgdmAgaXMgTm9uZSBlbHNlIGBub3QgdmAuXG4gICAgICAgIEV4YW1wbGVzXG4gICAgICAgID09PT09PT09XG4gICAgICAgID4+PiBmcm9tIHN5bXB5LmNvcmUubG9naWMgaW1wb3J0IGZ1enp5X25vdFxuICAgICAgICA+Pj4gZnV6enlfbm90KFRydWUpXG4gICAgRmFsc2VcbiAgICAgICAgPj4+IGZ1enp5X25vdChOb25lKVxuICAgICAgICA+Pj4gZnV6enlfbm90KEZhbHNlKVxuICAgIFRydWVcbiAgICAqL1xuICAgIGlmICh2ID09IG51bGwpIHtcbiAgICAgICAgcmV0dXJuIHY7XG4gICAgfSBlbHNlIGlmICh2IGluc3RhbmNlb2YgVHJ1ZSkge1xuICAgICAgICByZXR1cm4gTG9naWMuRmFsc2U7XG4gICAgfVxuICAgIHJldHVybiBMb2dpYy5UcnVlO1xufVxuXG5cbmV4cG9ydCBmdW5jdGlvbiBmdXp6eV9ub3R2Mih2OiBhbnkpIHtcbiAgICAvKlxuICAgIE5vdCBpbiBmdXp6eSBsb2dpY1xuICAgICAgICBSZXR1cm4gTm9uZSBpZiBgdmAgaXMgTm9uZSBlbHNlIGBub3QgdmAuXG4gICAgICAgIEV4YW1wbGVzXG4gICAgICAgID09PT09PT09XG4gICAgICAgID4+PiBmcm9tIHN5bXB5LmNvcmUubG9naWMgaW1wb3J0IGZ1enp5X25vdFxuICAgICAgICA+Pj4gZnV6enlfbm90KFRydWUpXG4gICAgRmFsc2VcbiAgICAgICAgPj4+IGZ1enp5X25vdChOb25lKVxuICAgICAgICA+Pj4gZnV6enlfbm90KEZhbHNlKVxuICAgIFRydWVcbiAgICAqL1xuICAgIGlmICh2ID09IHVuZGVmaW5lZCkge1xuICAgICAgICByZXR1cm4gdW5kZWZpbmVkO1xuICAgIH0gZWxzZSBpZiAodiA9PT0gdHJ1ZSkge1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICAgIHJldHVybiB0cnVlO1xufVxuXG5cbmZ1bmN0aW9uIGZ1enp5X29yKGFyZ3M6IGFueVtdKTogTG9naWMge1xuICAgIC8qXG4gICAgT3IgaW4gZnV6enkgbG9naWMuUmV0dXJucyBUcnVlKGFueSBUcnVlKSwgRmFsc2UoYWxsIEZhbHNlKSwgb3IgTm9uZVxuICAgICAgICBTZWUgdGhlIGRvY3N0cmluZ3Mgb2YgZnV6enlfYW5kIGFuZCBmdXp6eV9ub3QgZm9yIG1vcmUgaW5mby5mdXp6eV9vciBpc1xuICAgICAgICByZWxhdGVkIHRvIHRoZSB0d28gYnkgdGhlIHN0YW5kYXJkIERlIE1vcmdhbidzIGxhdy5cbiAgICAgICAgPj4+IGZyb20gc3ltcHkuY29yZS5sb2dpYyBpbXBvcnQgZnV6enlfb3JcbiAgICAgICAgPj4+IGZ1enp5X29yKFtUcnVlLCBGYWxzZV0pXG4gICAgVHJ1ZVxuICAgICAgICA+Pj4gZnV6enlfb3IoW1RydWUsIE5vbmVdKVxuICAgIFRydWVcbiAgICAgICAgPj4+IGZ1enp5X29yKFtGYWxzZSwgRmFsc2VdKVxuICAgIEZhbHNlXG4gICAgICAgID4+PiBwcmludChmdXp6eV9vcihbRmFsc2UsIE5vbmVdKSlcbiAgICBOb25lXG4gICAgKi9cbiAgICBsZXQgcnYgPSBMb2dpYy5GYWxzZTtcblxuICAgIGZvciAobGV0IGFpIG9mIGFyZ3MpIHtcbiAgICAgICAgYWkgPSBmdXp6eV9ib29sKGFpKTtcbiAgICAgICAgaWYgKGFpIGluc3RhbmNlb2YgVHJ1ZSkge1xuICAgICAgICAgICAgcmV0dXJuIExvZ2ljLlRydWU7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHJ2IGluc3RhbmNlb2YgRmFsc2UpIHsgLy8gdGhpcyB3aWxsIHN0b3AgdXBkYXRpbmcgaWYgYSBOb25lIGlzIGV2ZXIgdHJhcHBlZFxuICAgICAgICAgICAgcnYgPSBhaTtcbiAgICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gcnY7XG59XG5cbmZ1bmN0aW9uIGZ1enp5X3hvcihhcmdzOiBhbnlbXSk6IExvZ2ljIHwgbnVsbCB7XG4gICAgLyogUmV0dXJuIE5vbmUgaWYgYW55IGVsZW1lbnQgb2YgYXJncyBpcyBub3QgVHJ1ZSBvciBGYWxzZSwgZWxzZVxuICAgIFRydWUoaWYgdGhlcmUgYXJlIGFuIG9kZCBudW1iZXIgb2YgVHJ1ZSBlbGVtZW50cyksIGVsc2UgRmFsc2UuICovXG4gICAgbGV0IHQgPSAwO1xuICAgIGxldCBmID0gMDtcbiAgICBmb3IgKGNvbnN0IGEgb2YgYXJncykge1xuICAgICAgICBjb25zdCBhaSA9IGZ1enp5X2Jvb2woYSk7XG4gICAgICAgIGlmIChhaSBpbnN0YW5jZW9mIFRydWUpIHtcbiAgICAgICAgICAgIHQgKz0gMTtcbiAgICAgICAgfSBlbHNlIGlmIChhaSBpbnN0YW5jZW9mIEZhbHNlKSB7XG4gICAgICAgICAgICBmICs9IDE7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgICAgfVxuICAgIH1cbiAgICBpZiAodCAlIDIgPT0gMSkge1xuICAgICAgICByZXR1cm4gTG9naWMuVHJ1ZTtcbiAgICB9XG4gICAgcmV0dXJuIExvZ2ljLkZhbHNlO1xufVxuXG5mdW5jdGlvbiBmdXp6eV9uYW5kKGFyZ3M6IGFueVtdKTogTG9naWMgfCBudWxsIHtcbiAgICAvKiBSZXR1cm4gRmFsc2UgaWYgYWxsIGFyZ3MgYXJlIFRydWUsIFRydWUgaWYgdGhleSBhcmUgYWxsIEZhbHNlLFxuICAgIGVsc2UgTm9uZS4gKi9cbiAgICByZXR1cm4gZnV6enlfbm90KGZ1enp5X2FuZChhcmdzKSk7XG59XG5cblxuY2xhc3MgTG9naWMge1xuICAgIHN0YXRpYyBUcnVlOiBMb2dpYztcbiAgICBzdGF0aWMgRmFsc2U6IExvZ2ljO1xuXG4gICAgc3RhdGljIG9wXzJjbGFzczogUmVjb3JkPHN0cmluZywgKC4uLmFyZ3M6IGFueVtdKSA9PiBMb2dpYz4gPSB7XG4gICAgICAgIFwiJlwiOiAoLi4uYXJncykgPT4ge1xuICAgICAgICAgICAgcmV0dXJuIEFuZC5fX25ld19fKEFuZC5wcm90b3R5cGUsIC4uLmFyZ3MpO1xuICAgICAgICB9LFxuICAgICAgICBcInxcIjogKC4uLmFyZ3MpID0+IHtcbiAgICAgICAgICAgIHJldHVybiBPci5fX25ld19fKE9yLnByb3RvdHlwZSwgLi4uYXJncyk7XG4gICAgICAgIH0sXG4gICAgICAgIFwiIVwiOiAoYXJnKSA9PiB7XG4gICAgICAgICAgICByZXR1cm4gTm90Ll9fbmV3X18oTm90LnByb3RvdHlwZSwgYXJnKTtcbiAgICAgICAgfSxcbiAgICB9O1xuXG4gICAgYXJnczogYW55W107XG5cbiAgICBjb25zdHJ1Y3RvciguLi5hcmdzOiBhbnlbXSkge1xuICAgICAgICB0aGlzLmFyZ3MgPSBhcmdzO1xuICAgIH1cblxuICAgIF9ldmFsX3Byb3BhZ2F0ZV9ub3QoKTogYW55IHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiRXZhbCBwcm9wYWdhdGUgbm90IGlzIGFic3RyYWN0IGluIExvZ2ljXCIpO1xuICAgIH1cblxuICAgIGV4cGFuZCgpOiBhbnkge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJFeHBhbmQgaXMgYWJzdHJhY3QgaW4gTG9naWNcIik7XG4gICAgfVxuXG4gICAgc3RhdGljIF9fbmV3X18oY2xzOiBhbnksIC4uLmFyZ3M6IGFueVtdKTogYW55IHtcbiAgICAgICAgaWYgKGNscyA9PT0gTm90KSB7XG4gICAgICAgICAgICByZXR1cm4gbmV3IE5vdChhcmdzWzBdKTtcbiAgICAgICAgfSBlbHNlIGlmIChjbHMgPT09IEFuZCkge1xuICAgICAgICAgICAgcmV0dXJuIG5ldyBBbmQoYXJncyk7XG4gICAgICAgIH0gZWxzZSBpZiAoY2xzID09PSBPcikge1xuICAgICAgICAgICAgcmV0dXJuIG5ldyBPcihhcmdzKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGdldF9vcF94X25vdHgoKTogYW55IHtcbiAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuXG4gICAgaGFzaEtleSgpOiBzdHJpbmcge1xuICAgICAgICByZXR1cm4gdGhpcy50b1N0cmluZygpO1xuICAgIH1cblxuICAgIHRvU3RyaW5nKCkge1xuICAgICAgICByZXR1cm4gXCJMb2dpYyBcIiArIHRoaXMuYXJncy50b1N0cmluZygpO1xuICAgIH1cblxuICAgIGdldE5ld0FyZ3MoKTogYW55W10ge1xuICAgICAgICByZXR1cm4gdGhpcy5hcmdzO1xuICAgIH1cblxuICAgIHN0YXRpYyBlcXVhbHMoYTogYW55LCBiOiBhbnkpOiBMb2dpYyB7XG4gICAgICAgIGlmICghKGIgaW5zdGFuY2VvZiBhLmNvbnN0cnVjdG9yKSkge1xuICAgICAgICAgICAgcmV0dXJuIExvZ2ljLkZhbHNlO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgaWYgKGEuYXJncyA9PSBiLmFyZ3MpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gTG9naWMuVHJ1ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiBMb2dpYy5GYWxzZTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHN0YXRpYyBub3RFcXVhbHMoYTogYW55LCBiOiBhbnkpOiBMb2dpYyB7XG4gICAgICAgIGlmICghKGIgaW5zdGFuY2VvZiBhLmNvbnN0cnVjdG9yKSkge1xuICAgICAgICAgICAgcmV0dXJuIExvZ2ljLlRydWU7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBpZiAoYS5hcmdzID09IGIuYXJncykge1xuICAgICAgICAgICAgICAgIHJldHVybiBMb2dpYy5GYWxzZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiBMb2dpYy5UcnVlO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgbGVzc1RoYW4ob3RoZXI6IE9iamVjdCk6IExvZ2ljIHtcbiAgICAgICAgaWYgKHRoaXMuY29tcGFyZShvdGhlcikgPT0gLTEpIHtcbiAgICAgICAgICAgIHJldHVybiBMb2dpYy5UcnVlO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBMb2dpYy5GYWxzZTtcbiAgICB9XG5cbiAgICBjb21wYXJlKG90aGVyOiBhbnkpOiBudW1iZXIge1xuICAgICAgICBsZXQgYTsgbGV0IGI7XG4gICAgICAgIGlmICh0eXBlb2YgdGhpcyAhPSB0eXBlb2Ygb3RoZXIpIHtcbiAgICAgICAgICAgIGNvbnN0IHVua1NlbGY6IHVua25vd24gPSA8dW5rbm93bj4gdGhpcy5jb25zdHJ1Y3RvcjtcbiAgICAgICAgICAgIGNvbnN0IHVua090aGVyOiB1bmtub3duID0gPHVua25vd24+IG90aGVyLmNvbnN0cnVjdG9yO1xuICAgICAgICAgICAgYSA9IDxzdHJpbmc+IHVua1NlbGY7XG4gICAgICAgICAgICBiID0gPHN0cmluZz4gdW5rT3RoZXI7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBhID0gdGhpcy5hcmdzO1xuICAgICAgICAgICAgYiA9IG90aGVyLmFyZ3M7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGEgPiBiKSB7XG4gICAgICAgICAgICByZXR1cm4gMTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiAwO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgc3RhdGljIGZyb21zdHJpbmcodGV4dDogc3RyaW5nKSB7XG4gICAgICAgIC8qIExvZ2ljIGZyb20gc3RyaW5nIHdpdGggc3BhY2UgYXJvdW5kICYgYW5kIHwgYnV0IG5vbmUgYWZ0ZXIgIS5cbiAgICAgICAgICAgZS5nLlxuICAgICAgICAgICAhYSAmIGIgfCBjXG4gICAgICAgICovXG4gICAgICAgIGxldCBsZXhwciA9IG51bGw7IC8vIGN1cnJlbnQgbG9naWNhbCBleHByZXNzaW9uXG4gICAgICAgIGxldCBzY2hlZG9wID0gbnVsbDsgLy8gc2NoZWR1bGVkIG9wZXJhdGlvblxuICAgICAgICBmb3IgKGNvbnN0IHRlcm0gb2YgdGV4dC5zcGxpdChcIiBcIikpIHtcbiAgICAgICAgICAgIGxldCBmbGV4VGVybTogc3RyaW5nIHwgTG9naWMgPSB0ZXJtO1xuICAgICAgICAgICAgLy8gb3BlcmF0aW9uIHN5bWJvbFxuICAgICAgICAgICAgaWYgKFwiJnxcIi5pbmNsdWRlcyhmbGV4VGVybSkpIHtcbiAgICAgICAgICAgICAgICBpZiAoc2NoZWRvcCAhPSBudWxsKSB7XG4gICAgICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcImRvdWJsZSBvcCBmb3JiaWRkZW4gXCIgKyBmbGV4VGVybSArIFwiIFwiICsgc2NoZWRvcCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGlmIChsZXhwciA9PSBudWxsKSB7XG4gICAgICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihmbGV4VGVybSArIFwiIGNhbm5vdCBiZSBpbiB0aGUgYmVnaW5uaW5nIG9mIGV4cHJlc3Npb25cIik7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHNjaGVkb3AgPSBmbGV4VGVybTtcbiAgICAgICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChmbGV4VGVybS5pbmNsdWRlcyhcInxcIikgfHwgZmxleFRlcm0uaW5jbHVkZXMoXCImXCIpKSB7XG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiJiBhbmQgfCBtdXN0IGhhdmUgc3BhY2UgYXJvdW5kIHRoZW1cIik7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoZmxleFRlcm1bMF0gPT0gXCIhXCIpIHtcbiAgICAgICAgICAgICAgICBpZiAoZmxleFRlcm0ubGVuZ3RoID09IDEpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiZG8gbm90IGluY2x1ZGUgc3BhY2UgYWZ0ZXIgIVwiKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZmxleFRlcm0gPSBOb3QuTmV3KGZsZXhUZXJtLnN1YnN0cmluZygxKSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICAvLyBhbHJlYWR5IHNjaGVkdWxlZCBvcGVyYXRpb24sIGUuZy4gJyYnXG4gICAgICAgICAgICBpZiAoc2NoZWRvcCkge1xuICAgICAgICAgICAgICAgIGxleHByID0gTG9naWMub3BfMmNsYXNzW3NjaGVkb3BdKGxleHByLCBmbGV4VGVybSk7XG4gICAgICAgICAgICAgICAgc2NoZWRvcCA9IG51bGw7XG4gICAgICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICAvLyB0aGlzIHNob3VsZCBiZSBhdG9tXG4gICAgICAgICAgICBpZiAobGV4cHIgIT0gbnVsbCkge1xuICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcIm1pc3Npbmcgb3AgYmV0d2VlbiBcIiArIGxleHByICsgXCIgYW5kIFwiICsgZmxleFRlcm0gKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGxleHByID0gZmxleFRlcm07XG4gICAgICAgIH1cblxuICAgICAgICAvLyBsZXQncyBjaGVjayB0aGF0IHdlIGVuZGVkIHVwIGluIGNvcnJlY3Qgc3RhdGVcbiAgICAgICAgaWYgKHNjaGVkb3AgIT0gbnVsbCkge1xuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwicHJlbWF0dXJlIGVuZC1vZi1leHByZXNzaW9uIGluIFwiICsgdGV4dCk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGxleHByID09IG51bGwpIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcih0ZXh0ICsgXCIgaXMgZW1wdHlcIik7XG4gICAgICAgIH1cbiAgICAgICAgLy8gZXZlcnl0aGluZyBsb29rcyBnb29kIG5vd1xuICAgICAgICByZXR1cm4gbGV4cHI7XG4gICAgfVxufVxuXG5jbGFzcyBUcnVlIGV4dGVuZHMgTG9naWMge1xuICAgIF9ldmFsX3Byb3BhZ2F0ZV9ub3QoKTogYW55IHtcbiAgICAgICAgcmV0dXJuIEZhbHNlLkZhbHNlO1xuICAgIH1cblxuICAgIGV4cGFuZCgpOiBhbnkge1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9XG59XG5cbmNsYXNzIEZhbHNlIGV4dGVuZHMgTG9naWMge1xuICAgIF9ldmFsX3Byb3BhZ2F0ZV9ub3QoKTogYW55IHtcbiAgICAgICAgcmV0dXJuIFRydWUuVHJ1ZTtcbiAgICB9XG5cbiAgICBleHBhbmQoKTogYW55IHtcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxufVxuXG5cbmNsYXNzIEFuZE9yX0Jhc2UgZXh0ZW5kcyBMb2dpYyB7XG4gICAgc3RhdGljIF9fbmV3X18oY2xzOiBhbnksIC4uLmFyZ3M6IGFueVtdKSB7XG4gICAgICAgIGNvbnN0IGJhcmdzOiBhbnlbXSA9IFtdO1xuICAgICAgICBmb3IgKGNvbnN0IGEgb2YgYXJncykge1xuICAgICAgICAgICAgaWYgKGEgPT0gY2xzLmdldF9vcF94X25vdHgoKSkge1xuICAgICAgICAgICAgICAgIHJldHVybiBhO1xuICAgICAgICAgICAgfSBlbHNlIGlmIChhID09ICEoY2xzLmdldF9vcF94X25vdHgoKSkpIHtcbiAgICAgICAgICAgICAgICBjb250aW51ZTsgLy8gc2tpcCB0aGlzIGFyZ3VtZW50XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBiYXJncy5wdXNoKGEpO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gcHJldiB2ZXJzaW9uOiBhcmdzID0gc29ydGVkKHNldCh0aGlzLmZsYXR0ZW4oYmFyZ3MpKSwga2V5PWhhc2gpXG4gICAgICAgIC8vIHdlIHRoaW5rIHdlIGRvbid0IG5lZWQgdGhlIHNvcnQgYW5kIHNldFxuICAgICAgICBhcmdzID0gQW5kT3JfQmFzZS5mbGF0dGVuKGJhcmdzKTtcblxuICAgICAgICAvLyBjcmVhdGluZyBhIHNldCB3aXRoIGhhc2gga2V5cyBmb3IgYXJnc1xuICAgICAgICBjb25zdCBhcmdzX3NldCA9IG5ldyBTZXQoYXJncy5tYXAoKGUpID0+IFV0aWwuaGFzaEtleShlKSkpO1xuXG4gICAgICAgIGZvciAoY29uc3QgYSBvZiBhcmdzKSB7XG4gICAgICAgICAgICBpZiAoYXJnc19zZXQuaGFzKChOb3QuTmV3KGEpKS5oYXNoS2V5KCkpKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGNscy5nZXRfb3BfeF9ub3R4KCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoYXJncy5sZW5ndGggPT0gMSkge1xuICAgICAgICAgICAgcmV0dXJuIGFyZ3MucG9wKCk7XG4gICAgICAgIH0gZWxzZSBpZiAoYXJncy5sZW5ndGggPT0gMCkge1xuICAgICAgICAgICAgaWYgKGNscy5nZXRfb3BfeF9ub3R4KCkgaW5zdGFuY2VvZiBUcnVlKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIExvZ2ljLkZhbHNlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIExvZ2ljLlRydWU7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gc3VwZXIuX19uZXdfXyhjbHMsIC4uLmFyZ3MpO1xuICAgIH1cblxuICAgIHN0YXRpYyBmbGF0dGVuKGFyZ3M6IGFueVtdKTogYW55W10ge1xuICAgICAgICAvLyBxdWljay1uLWRpcnR5IGZsYXR0ZW5pbmcgZm9yIEFuZCBhbmQgT3JcbiAgICAgICAgY29uc3QgYXJnc19xdWV1ZTogYW55W10gPSBbLi4uYXJnc107XG4gICAgICAgIGNvbnN0IHJlcyA9IFtdO1xuICAgICAgICB3aGlsZSAoYXJnc19xdWV1ZS5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICBjb25zdCBhcmc6IGFueSA9IGFyZ3NfcXVldWUucG9wKCk7XG4gICAgICAgICAgICBpZiAoYXJnIGluc3RhbmNlb2YgTG9naWMpIHtcbiAgICAgICAgICAgICAgICBpZiAoYXJnIGluc3RhbmNlb2YgdGhpcykge1xuICAgICAgICAgICAgICAgICAgICBhcmdzX3F1ZXVlLnB1c2goYXJnLmFyZ3MpO1xuICAgICAgICAgICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXMucHVzaChhcmcpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiByZXM7XG4gICAgfVxufVxuXG5jbGFzcyBBbmQgZXh0ZW5kcyBBbmRPcl9CYXNlIHtcbiAgICBzdGF0aWMgTmV3KC4uLmFyZ3M6IGFueVtdKSB7XG4gICAgICAgIHJldHVybiBzdXBlci5fX25ld19fKEFuZCwgYXJncyk7XG4gICAgfVxuXG4gICAgZ2V0X29wX3hfbm90eCgpOiBMb2dpYyB7XG4gICAgICAgIHJldHVybiBMb2dpYy5GYWxzZTtcbiAgICB9XG5cbiAgICBfZXZhbF9wcm9wYWdhdGVfbm90KCk6IE9yIHtcbiAgICAgICAgLy8gISAoYSZiJmMgLi4uKSA9PSAhYSB8ICFiIHwgIWMgLi4uXG4gICAgICAgIGNvbnN0IHBhcmFtOiBhbnlbXSA9IFtdO1xuICAgICAgICBmb3IgKGNvbnN0IGEgb2YgcGFyYW0pIHtcbiAgICAgICAgICAgIHBhcmFtLnB1c2goTm90Lk5ldyhhKSk7IC8vID8/XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIE9yLk5ldyguLi5wYXJhbSk7IC8vID8/P1xuICAgIH1cblxuICAgIC8vIChhfGJ8Li4uKSAmIGMgPT0gKGEmYykgfCAoYiZjKSB8IC4uLlxuICAgIGV4cGFuZCgpOiBhbnkge1xuICAgICAgICAvLyBmaXJzdCBsb2NhdGUgT3JcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLmFyZ3MubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIGNvbnN0IGFyZyA9IHRoaXMuYXJnc1tpXTtcbiAgICAgICAgICAgIGlmIChhcmcgaW5zdGFuY2VvZiBPcikge1xuICAgICAgICAgICAgICAgIC8vIGNvcHkgb2YgdGhpcy5hcmdzIHdpdGggYXJnIGF0IHBvc2l0aW9uIGkgcmVtb3ZlZFxuXG4gICAgICAgICAgICAgICAgY29uc3QgYXJlc3QgPSBbLi4udGhpcy5hcmdzXS5zcGxpY2UoaSwgMSk7XG5cbiAgICAgICAgICAgICAgICAvLyBzdGVwIGJ5IHN0ZXAgdmVyc2lvbiBvZiB0aGUgbWFwIGJlbG93XG4gICAgICAgICAgICAgICAgLypcbiAgICAgICAgICAgICAgICBsZXQgb3J0ZXJtcyA9IFtdO1xuICAgICAgICAgICAgICAgIGZvciAobGV0IGEgb2YgYXJnLmFyZ3MpIHtcbiAgICAgICAgICAgICAgICAgICAgb3J0ZXJtcy5wdXNoKG5ldyBBbmQoLi4uYXJlc3QuY29uY2F0KFthXSkpKVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAqL1xuXG4gICAgICAgICAgICAgICAgY29uc3Qgb3J0ZXJtcyA9IGFyZy5hcmdzLm1hcCgoZSkgPT4gQW5kLk5ldyguLi5hcmVzdC5jb25jYXQoW2VdKSkpO1xuXG5cbiAgICAgICAgICAgICAgICBmb3IgKGxldCBqID0gMDsgaiA8IG9ydGVybXMubGVuZ3RoOyBqKyspIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKG9ydGVybXNbal0gaW5zdGFuY2VvZiBMb2dpYykge1xuICAgICAgICAgICAgICAgICAgICAgICAgb3J0ZXJtc1tqXSA9IG9ydGVybXNbal0uZXhwYW5kKCk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgY29uc3QgcmVzID0gT3IuTmV3KC4uLm9ydGVybXMpO1xuICAgICAgICAgICAgICAgIHJldHVybiByZXM7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxufVxuXG5jbGFzcyBPciBleHRlbmRzIEFuZE9yX0Jhc2Uge1xuICAgIHN0YXRpYyBOZXcoLi4uYXJnczogYW55W10pIHtcbiAgICAgICAgcmV0dXJuIHN1cGVyLl9fbmV3X18oT3IsIGFyZ3MpO1xuICAgIH1cblxuICAgIGdldF9vcF94X25vdHgoKTogTG9naWMge1xuICAgICAgICByZXR1cm4gTG9naWMuVHJ1ZTtcbiAgICB9XG5cbiAgICBfZXZhbF9wcm9wYWdhdGVfbm90KCk6IEFuZCB7XG4gICAgICAgIC8vICEgKGEmYiZjIC4uLikgPT0gIWEgfCAhYiB8ICFjIC4uLlxuICAgICAgICBjb25zdCBwYXJhbTogYW55W10gPSBbXTtcbiAgICAgICAgZm9yIChjb25zdCBhIG9mIHBhcmFtKSB7XG4gICAgICAgICAgICBwYXJhbS5wdXNoKE5vdC5OZXcoYSkpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBBbmQuTmV3KC4uLnBhcmFtKTtcbiAgICB9XG59XG5cbmNsYXNzIE5vdCBleHRlbmRzIExvZ2ljIHtcbiAgICBzdGF0aWMgTmV3KGFyZ3M6IGFueSkge1xuICAgICAgICByZXR1cm4gTm90Ll9fbmV3X18oTm90LCBhcmdzKTtcbiAgICB9XG5cbiAgICBzdGF0aWMgX19uZXdfXyhjbHM6IGFueSwgYXJnOiBhbnkpIHtcbiAgICAgICAgaWYgKHR5cGVvZiBhcmcgPT09IFwic3RyaW5nXCIpIHtcbiAgICAgICAgICAgIHJldHVybiBzdXBlci5fX25ld19fKGNscywgYXJnKTtcbiAgICAgICAgfSBlbHNlIGlmIChhcmcgaW5zdGFuY2VvZiBUcnVlKSB7XG4gICAgICAgICAgICByZXR1cm4gTG9naWMuRmFsc2U7XG4gICAgICAgIH0gZWxzZSBpZiAoYXJnIGluc3RhbmNlb2YgRmFsc2UpIHtcbiAgICAgICAgICAgIHJldHVybiBMb2dpYy5UcnVlO1xuICAgICAgICB9IGVsc2UgaWYgKGFyZyBpbnN0YW5jZW9mIE5vdCkge1xuICAgICAgICAgICAgcmV0dXJuIGFyZy5hcmdzWzBdO1xuICAgICAgICB9IGVsc2UgaWYgKGFyZyBpbnN0YW5jZW9mIExvZ2ljKSB7XG4gICAgICAgICAgICAvLyBYWFggdGhpcyBpcyBhIGhhY2sgdG8gZXhwYW5kIHJpZ2h0IGZyb20gdGhlIGJlZ2lubmluZ1xuICAgICAgICAgICAgYXJnID0gYXJnLl9ldmFsX3Byb3BhZ2F0ZV9ub3QoKTtcbiAgICAgICAgICAgIHJldHVybiBhcmc7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJOb3Q6IHVua25vd24gYXJndW1lbnQgXCIgKyBhcmcpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgYXJnKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5hcmdzWzBdO1xuICAgIH1cbn1cblxuTG9naWMuVHJ1ZSA9IG5ldyBUcnVlKCk7XG5Mb2dpYy5GYWxzZSA9IG5ldyBGYWxzZSgpO1xuXG5leHBvcnQge0xvZ2ljLCBUcnVlLCBGYWxzZSwgQW5kLCBPciwgTm90LCBmdXp6eV9ib29sLCBmdXp6eV9hbmQsIGZ1enp5X2Jvb2xfdjIsIGZ1enp5X2FuZF92Mn07XG5cblxuIiwgIi8qIGVzbGludC1kaXNhYmxlIG5ldy1jYXAgKi9cbi8qIFRoaXMgaXMgcnVsZS1iYXNlZCBkZWR1Y3Rpb24gc3lzdGVtIGZvciBTeW1QeVxuVGhlIHdob2xlIHRoaW5nIGlzIHNwbGl0IGludG8gdHdvIHBhcnRzXG4gLSBydWxlcyBjb21waWxhdGlvbiBhbmQgcHJlcGFyYXRpb24gb2YgdGFibGVzXG4gLSBydW50aW1lIGluZmVyZW5jZVxuRm9yIHJ1bGUtYmFzZWQgaW5mZXJlbmNlIGVuZ2luZXMsIHRoZSBjbGFzc2ljYWwgd29yayBpcyBSRVRFIGFsZ29yaXRobSBbMV0sXG5bMl0gQWx0aG91Z2ggd2UgYXJlIG5vdCBpbXBsZW1lbnRpbmcgaXQgaW4gZnVsbCAob3IgZXZlbiBzaWduaWZpY2FudGx5KVxuaXQncyBzdGlsbCB3b3J0aCBhIHJlYWQgdG8gdW5kZXJzdGFuZCB0aGUgdW5kZXJseWluZyBpZGVhcy5cbkluIHNob3J0LCBldmVyeSBydWxlIGluIGEgc3lzdGVtIG9mIHJ1bGVzIGlzIG9uZSBvZiB0d28gZm9ybXM6XG4gLSBhdG9tICAgICAgICAgICAgICAgICAgICAgLT4gLi4uICAgICAgKGFscGhhIHJ1bGUpXG4gLSBBbmQoYXRvbTEsIGF0b20yLCAuLi4pICAgLT4gLi4uICAgICAgKGJldGEgcnVsZSlcblRoZSBtYWpvciBjb21wbGV4aXR5IGlzIGluIGVmZmljaWVudCBiZXRhLXJ1bGVzIHByb2Nlc3NpbmcgYW5kIHVzdWFsbHkgZm9yIGFuXG5leHBlcnQgc3lzdGVtIGEgbG90IG9mIGVmZm9ydCBnb2VzIGludG8gY29kZSB0aGF0IG9wZXJhdGVzIG9uIGJldGEtcnVsZXMuXG5IZXJlIHdlIHRha2UgbWluaW1hbGlzdGljIGFwcHJvYWNoIHRvIGdldCBzb21ldGhpbmcgdXNhYmxlIGZpcnN0LlxuIC0gKHByZXBhcmF0aW9uKSAgICBvZiBhbHBoYS0gYW5kIGJldGEtIG5ldHdvcmtzLCBldmVyeXRoaW5nIGV4Y2VwdFxuIC0gKHJ1bnRpbWUpICAgICAgICBGYWN0UnVsZXMuZGVkdWNlX2FsbF9mYWN0c1xuICAgICAgICAgICAgIF9fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19cbiAgICAgICAgICAgICggS2lycjogSSd2ZSBuZXZlciB0aG91Z2h0IHRoYXQgZG9pbmcgKVxuICAgICAgICAgICAgKCBsb2dpYyBzdHVmZiBpcyB0aGF0IGRpZmZpY3VsdC4uLiAgICApXG4gICAgICAgICAgICAgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgICAgICAgICAgICAgICAgICBvICAgXl9fXlxuICAgICAgICAgICAgICAgICAgICAgbyAgKG9vKVxcX19fX19fX1xuICAgICAgICAgICAgICAgICAgICAgICAgKF9fKVxcICAgICAgIClcXC9cXFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHx8LS0tLXcgfFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHx8ICAgICB8fFxuU29tZSByZWZlcmVuY2VzIG9uIHRoZSB0b3BpY1xuLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuWzFdIGh0dHBzOi8vZW4ud2lraXBlZGlhLm9yZy93aWtpL1JldGVfYWxnb3JpdGhtXG5bMl0gaHR0cDovL3JlcG9ydHMtYXJjaGl2ZS5hZG0uY3MuY211LmVkdS9hbm9uLzE5OTUvQ01VLUNTLTk1LTExMy5wZGZcbmh0dHBzOi8vZW4ud2lraXBlZGlhLm9yZy93aWtpL1Byb3Bvc2l0aW9uYWxfZm9ybXVsYVxuaHR0cHM6Ly9lbi53aWtpcGVkaWEub3JnL3dpa2kvSW5mZXJlbmNlX3J1bGVcbmh0dHBzOi8vZW4ud2lraXBlZGlhLm9yZy93aWtpL0xpc3Rfb2ZfcnVsZXNfb2ZfaW5mZXJlbmNlXG4qL1xuXG4vKlxuXG5TaWduaWZpY2FudCBjaGFuZ2VzIG1hZGUgKFdCIGFuZCBHTSk6XG4tIENyZWF0ZWQgdGhlIEltcGxpY2F0aW9uIGNsYXNzLCB1c2UgdG8gcmVwcmVzZW50IHRoZSBpbXBsaWNhdGlvbiBwIC0+IHEgd2hpY2hcbiAgaXMgc3RvcmVkIGFzIGEgdHVwbGUgaW4gc3ltcHlcbi0gQ3JlYXRlZCB0aGUgU2V0RGVmYXVsdERpY3QsIEhhc2hEaWN0IGFuZCBIYXNoU2V0IGNsYXNzZXMuIFNldERlZmF1bHREaWN0IGFjdHNcbiAgYXMgYSByZXBsY2FjZW1lbnQgZGVmYXVsdGRpY3Qoc2V0KSwgYW5kIEhhc2hEaWN0IGFuZCBIYXNoU2V0IHJlcGxhY2UgdGhlXG4gIGRpY3QgYW5kIHNldCBjbGFzc2VzLlxuLSBBZGRlZCBpc1N1YnNldCgpIHRvIHRoZSB1dGlsaXR5IGNsYXNzIHRvIGhlbHAgd2l0aCB0aGlzIHByb2dyYW1cblxuKi9cblxuXG5pbXBvcnQge1N0ZEZhY3RLQn0gZnJvbSBcIi4vYXNzdW1wdGlvbnNcIjtcbmltcG9ydCB7TG9naWMsIFRydWUsIEZhbHNlLCBBbmQsIE9yLCBOb3R9IGZyb20gXCIuL2xvZ2ljXCI7XG5cbmltcG9ydCB7VXRpbCwgSGFzaFNldCwgU2V0RGVmYXVsdERpY3QsIEhhc2hEaWN0LCBJbXBsaWNhdGlvbn0gZnJvbSBcIi4vdXRpbGl0eVwiO1xuXG5cbmZ1bmN0aW9uIF9iYXNlX2ZhY3QoYXRvbTogYW55KSB7XG4gICAgLyogIFJldHVybiB0aGUgbGl0ZXJhbCBmYWN0IG9mIGFuIGF0b20uXG4gICAgRWZmZWN0aXZlbHksIHRoaXMgbWVyZWx5IHN0cmlwcyB0aGUgTm90IGFyb3VuZCBhIGZhY3QuXG4gICAgKi9cbiAgICBpZiAoYXRvbSBpbnN0YW5jZW9mIE5vdCkge1xuICAgICAgICByZXR1cm4gYXRvbS5hcmcoKTtcbiAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4gYXRvbTtcbiAgICB9XG59XG5cblxuZnVuY3Rpb24gX2FzX3BhaXIoYXRvbTogYW55KSB7XG4gICAgLyogIFJldHVybiB0aGUgbGl0ZXJhbCBmYWN0IG9mIGFuIGF0b20uXG4gICAgRWZmZWN0aXZlbHksIHRoaXMgbWVyZWx5IHN0cmlwcyB0aGUgTm90IGFyb3VuZCBhIGZhY3QuXG4gICAgKi9cbiAgICBpZiAoYXRvbSBpbnN0YW5jZW9mIE5vdCkge1xuICAgICAgICByZXR1cm4gbmV3IEltcGxpY2F0aW9uKGF0b20uYXJnKCksIExvZ2ljLkZhbHNlKTtcbiAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4gbmV3IEltcGxpY2F0aW9uKGF0b20sIExvZ2ljLlRydWUpO1xuICAgIH1cbn1cblxuLy8gWFhYIHRoaXMgcHJlcGFyZXMgZm9yd2FyZC1jaGFpbmluZyBydWxlcyBmb3IgYWxwaGEtbmV0d29ya1xuXG5mdW5jdGlvbiB0cmFuc2l0aXZlX2Nsb3N1cmUoaW1wbGljYXRpb25zOiBJbXBsaWNhdGlvbltdKSB7XG4gICAgLypcbiAgICBDb21wdXRlcyB0aGUgdHJhbnNpdGl2ZSBjbG9zdXJlIG9mIGEgbGlzdCBvZiBpbXBsaWNhdGlvbnNcbiAgICBVc2VzIFdhcnNoYWxsJ3MgYWxnb3JpdGhtLCBhcyBkZXNjcmliZWQgYXRcbiAgICBodHRwOi8vd3d3LmNzLmhvcGUuZWR1L35jdXNhY2svTm90ZXMvTm90ZXMvRGlzY3JldGVNYXRoL1dhcnNoYWxsLnBkZi5cbiAgICAqL1xuXG4gICAgY29uc3QgZnVsbF9pbXBsaWNhdGlvbnMgPSBuZXcgSGFzaFNldChpbXBsaWNhdGlvbnMpO1xuICAgIGNvbnN0IGxpdGVyYWxzID0gbmV3IFNldChpbXBsaWNhdGlvbnMuZmxhdCgpKTtcblxuICAgIGZvciAoY29uc3QgayBvZiBsaXRlcmFscykge1xuICAgICAgICBmb3IgKGNvbnN0IGkgb2YgbGl0ZXJhbHMpIHtcbiAgICAgICAgICAgIGlmIChmdWxsX2ltcGxpY2F0aW9ucy5oYXMobmV3IEltcGxpY2F0aW9uKGksIGspKSkge1xuICAgICAgICAgICAgICAgIGZvciAoY29uc3QgaiBvZiBsaXRlcmFscykge1xuICAgICAgICAgICAgICAgICAgICBpZiAoZnVsbF9pbXBsaWNhdGlvbnMuaGFzKG5ldyBJbXBsaWNhdGlvbihrLCBqKSkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGZ1bGxfaW1wbGljYXRpb25zLmFkZChuZXcgSW1wbGljYXRpb24oaSwgaikpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuICAgIHJldHVybiBmdWxsX2ltcGxpY2F0aW9ucztcbn1cblxuXG5mdW5jdGlvbiBkZWR1Y2VfYWxwaGFfaW1wbGljYXRpb25zKGltcGxpY2F0aW9uczogSW1wbGljYXRpb25bXSkge1xuICAgIC8qIGRlZHVjZSBhbGwgaW1wbGljYXRpb25zXG4gICAgICAgRGVzY3JpcHRpb24gYnkgZXhhbXBsZVxuICAgICAgIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAgICBnaXZlbiBzZXQgb2YgbG9naWMgcnVsZXM6XG4gICAgICAgICBhIC0+IGJcbiAgICAgICAgIGIgLT4gY1xuICAgICAgIHdlIGRlZHVjZSBhbGwgcG9zc2libGUgcnVsZXM6XG4gICAgICAgICBhIC0+IGIsIGNcbiAgICAgICAgIGIgLT4gY1xuICAgICAgIGltcGxpY2F0aW9uczogW10gb2YgKGEsYilcbiAgICAgICByZXR1cm46ICAgICAgIHt9IG9mIGEgLT4gc2V0KFtiLCBjLCAuLi5dKVxuICAgICAgICovXG4gICAgY29uc3QgbmV3X2FycjogYW55W10gPSBbXTtcbiAgICBmb3IgKGNvbnN0IGltcGwgb2YgaW1wbGljYXRpb25zKSB7XG4gICAgICAgIG5ld19hcnIucHVzaChuZXcgSW1wbGljYXRpb24oTm90Lk5ldyhpbXBsLnEpLCBOb3QuTmV3KGltcGwucCkpKTtcbiAgICB9XG4gICAgaW1wbGljYXRpb25zID0gaW1wbGljYXRpb25zLmNvbmNhdChuZXdfYXJyKTtcbiAgICBjb25zdCByZXMgPSBuZXcgU2V0RGVmYXVsdERpY3QoKTtcbiAgICBjb25zdCBmdWxsX2ltcGxpY2F0aW9ucyA9IHRyYW5zaXRpdmVfY2xvc3VyZShpbXBsaWNhdGlvbnMpO1xuICAgIGZvciAoY29uc3QgaW1wbCBvZiBmdWxsX2ltcGxpY2F0aW9ucy50b0FycmF5KCkpIHtcbiAgICAgICAgaWYgKGltcGwucCA9PT0gaW1wbC5xKSB7XG4gICAgICAgICAgICBjb250aW51ZTsgLy8gc2tpcCBhLT5hIGN5Y2xpYyBpbnB1dFxuICAgICAgICB9XG4gICAgICAgIGNvbnN0IGN1cnJTZXQgPSByZXMuZ2V0KGltcGwucCk7XG4gICAgICAgIGN1cnJTZXQuYWRkKGltcGwucSk7XG4gICAgICAgIHJlcy5hZGQoaW1wbC5wLCBjdXJyU2V0KTtcbiAgICB9XG4gICAgLy8gQ2xlYW4gdXAgdGF1dG9sb2dpZXMgYW5kIGNoZWNrIGNvbnNpc3RlbmN5XG4gICAgLy8gaW1wbCBpcyB0aGUgc2V0XG4gICAgZm9yIChjb25zdCBpdGVtIG9mIHJlcy5lbnRyaWVzKCkpIHtcbiAgICAgICAgY29uc3QgYSA9IGl0ZW1bMF07XG4gICAgICAgIGNvbnN0IGltcGw6IEhhc2hTZXQgPSBpdGVtWzFdO1xuICAgICAgICBpbXBsLnJlbW92ZShhKTtcbiAgICAgICAgY29uc3QgbmEgPSBOb3QuTmV3KGEpO1xuICAgICAgICBpZiAoaW1wbC5oYXMobmEpKSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJpbXBsaWNhdGlvbnMgYXJlIGluY29uc2lzdGVudDogXCIgKyBhICsgXCIgLT4gXCIgKyBuYSArIFwiIFwiICsgaW1wbCk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIHJlcztcbn1cblxuZnVuY3Rpb24gYXBwbHlfYmV0YV90b19hbHBoYV9yb3V0ZShhbHBoYV9pbXBsaWNhdGlvbnM6IEhhc2hEaWN0LCBiZXRhX3J1bGVzOiBhbnlbXSkge1xuICAgIC8qIGFwcGx5IGFkZGl0aW9uYWwgYmV0YS1ydWxlcyAoQW5kIGNvbmRpdGlvbnMpIHRvIGFscmVhZHktYnVpbHRcbiAgICBhbHBoYSBpbXBsaWNhdGlvbiB0YWJsZXNcbiAgICAgICBUT0RPOiB3cml0ZSBhYm91dFxuICAgICAgIC0gc3RhdGljIGV4dGVuc2lvbiBvZiBhbHBoYS1jaGFpbnNcbiAgICAgICAtIGF0dGFjaGluZyByZWZzIHRvIGJldGEtbm9kZXMgdG8gYWxwaGEgY2hhaW5zXG4gICAgICAgZS5nLlxuICAgICAgIGFscGhhX2ltcGxpY2F0aW9uczpcbiAgICAgICBhICAtPiAgW2IsICFjLCBkXVxuICAgICAgIGIgIC0+ICBbZF1cbiAgICAgICAuLi5cbiAgICAgICBiZXRhX3J1bGVzOlxuICAgICAgICYoYixkKSAtPiBlXG4gICAgICAgdGhlbiB3ZSdsbCBleHRlbmQgYSdzIHJ1bGUgdG8gdGhlIGZvbGxvd2luZ1xuICAgICAgIGEgIC0+ICBbYiwgIWMsIGQsIGVdXG4gICAgKi9cblxuICAgIC8vIGlzIGJldGFfcnVsZXMgYW4gYXJyYXkgb3IgYSBkaWN0aW9uYXJ5P1xuXG4gICAgY29uc3QgeF9pbXBsOiBIYXNoRGljdCA9IG5ldyBIYXNoRGljdCgpO1xuICAgIGZvciAoY29uc3QgeCBvZiBhbHBoYV9pbXBsaWNhdGlvbnMua2V5cygpKSB7XG4gICAgICAgIGNvbnN0IG5ld3NldCA9IG5ldyBIYXNoU2V0KCk7XG4gICAgICAgIG5ld3NldC5hZGQoYWxwaGFfaW1wbGljYXRpb25zLmdldCh4KSk7XG4gICAgICAgIGNvbnN0IGltcCA9IG5ldyBJbXBsaWNhdGlvbihuZXdzZXQsIFtdKTtcbiAgICAgICAgeF9pbXBsLmFkZCh4LCBpbXApO1xuICAgIH1cbiAgICBmb3IgKGNvbnN0IGl0ZW0gb2YgYmV0YV9ydWxlcykge1xuICAgICAgICBjb25zdCBiY29uZCA9IGl0ZW1bMF07XG4gICAgICAgIGZvciAoY29uc3QgYmsgb2YgYmNvbmQuYXJncykge1xuICAgICAgICAgICAgaWYgKHhfaW1wbC5oYXMoYmspKSB7XG4gICAgICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBjb25zdCBpbXAgPSBuZXcgSW1wbGljYXRpb24obmV3IEhhc2hTZXQoKSwgW10pO1xuICAgICAgICAgICAgeF9pbXBsLmFkZChpbXAucCwgaW1wLnEpO1xuICAgICAgICB9XG4gICAgfVxuICAgIC8vIHN0YXRpYyBleHRlbnNpb25zIHRvIGFscGhhIHJ1bGVzOlxuICAgIC8vIEE6IHggLT4gYSxiICAgQjogJihhLGIpIC0+IGMgID09PiAgQTogeCAtPiBhLGIsY1xuXG4gICAgbGV0IHNlZW5fc3RhdGljX2V4dGVuc2lvbjogTG9naWMgPSBMb2dpYy5UcnVlO1xuICAgIHdoaWxlIChzZWVuX3N0YXRpY19leHRlbnNpb24gaW5zdGFuY2VvZiBUcnVlKSB7XG4gICAgICAgIHNlZW5fc3RhdGljX2V4dGVuc2lvbiA9IExvZ2ljLkZhbHNlO1xuXG4gICAgICAgIGZvciAoY29uc3QgaW1wbCBvZiBiZXRhX3J1bGVzKSB7XG4gICAgICAgICAgICBjb25zdCBiY29uZCA9IGltcGwucDtcbiAgICAgICAgICAgIGNvbnN0IGJpbXBsID0gaW1wbC5xO1xuICAgICAgICAgICAgaWYgKCEoYmNvbmQgaW5zdGFuY2VvZiBBbmQpKSB7XG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiQ29uZCBpcyBub3QgQW5kXCIpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgY29uc3QgYmFyZ3MgPSBuZXcgSGFzaFNldChiY29uZC5hcmdzKTtcbiAgICAgICAgICAgIGZvciAoY29uc3QgaXRlbSBvZiB4X2ltcGwuZW50cmllcygpKSB7XG4gICAgICAgICAgICAgICAgY29uc3QgeCA9IGl0ZW1bMF07XG4gICAgICAgICAgICAgICAgY29uc3QgaW1wbCA9IGl0ZW1bMV07XG4gICAgICAgICAgICAgICAgbGV0IHhpbXBscyA9IGltcGwucDtcbiAgICAgICAgICAgICAgICBjb25zdCB4X2FsbCA9IHhpbXBscy5jbG9uZSgpLmFkZCh4KTtcbiAgICAgICAgICAgICAgICAvLyBBOiAuLi4gLT4gYSAgIEI6ICYoLi4uKSAtPiBhICBpcyBub24taW5mb3JtYXRpdmVcbiAgICAgICAgICAgICAgICBpZiAoISh4X2FsbC5pbmNsdWRlcyhiaW1wbCkpICYmIFV0aWwuaXNTdWJzZXQoYmFyZ3MudG9BcnJheSgpLCB4X2FsbCkpIHtcbiAgICAgICAgICAgICAgICAgICAgeGltcGxzLmFkZChiaW1wbCk7XG5cbiAgICAgICAgICAgICAgICAgICAgLy8gd2UgaW50cm9kdWNlZCBuZXcgaW1wbGljYXRpb24gLSBub3cgd2UgaGF2ZSB0byByZXN0b3JlXG4gICAgICAgICAgICAgICAgICAgIC8vIGNvbXBsZXRlbmVzcyBvZiB0aGUgd2hvbGUgc2V0LlxuXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGJpbXBsX2ltcGwgPSB4X2ltcGwuZ2V0KGJpbXBsKTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGJpbXBsX2ltcGwgIT0gbnVsbCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgeGltcGxzIHw9IGJpbXBsX2ltcGxbMF07XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgc2Vlbl9zdGF0aWNfZXh0ZW5zaW9uID0gTG9naWMuVHJ1ZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG4gICAgLy8gYXR0YWNoIGJldGEtbm9kZXMgd2hpY2ggY2FuIGJlIHBvc3NpYmx5IHRyaWdnZXJlZCBieSBhbiBhbHBoYS1jaGFpblxuICAgIGZvciAobGV0IGJpZHggPSAwOyBiaWR4IDwgYmV0YV9ydWxlcy5sZW5ndGg7IGJpZHgrKykge1xuICAgICAgICBjb25zdCBpbXBsID0gYmV0YV9ydWxlc1tiaWR4XTtcbiAgICAgICAgY29uc3QgYmNvbmQgPSBpbXBsLnA7XG4gICAgICAgIGNvbnN0IGJpbXBsID0gaW1wbC5xO1xuICAgICAgICBjb25zdCBiYXJncyA9IG5ldyBIYXNoU2V0KGJjb25kLmFyZ3MpO1xuICAgICAgICBmb3IgKGNvbnN0IGl0ZW0gb2YgeF9pbXBsLmVudHJpZXMoKSkge1xuICAgICAgICAgICAgY29uc3QgeCA9IGl0ZW1bMF07XG4gICAgICAgICAgICBjb25zdCB2YWx1ZTogSW1wbGljYXRpb24gPSBpdGVtWzFdO1xuICAgICAgICAgICAgY29uc3QgeGltcGxzID0gdmFsdWUucDtcbiAgICAgICAgICAgIGNvbnN0IGJiID0gdmFsdWUucTtcbiAgICAgICAgICAgIGNvbnN0IHhfYWxsID0geGltcGxzLmNsb25lKCkuYWRkKHgpO1xuICAgICAgICAgICAgaWYgKHhfYWxsLmhhcyhiaW1wbCkpIHtcbiAgICAgICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIC8vIEE6IHggLT4gYS4uLiAgQjogJighYSwuLi4pIC0+IC4uLiAod2lsbCBuZXZlciB0cmlnZ2VyKVxuICAgICAgICAgICAgLy8gQTogeCAtPiBhLi4uICBCOiAmKC4uLikgLT4gIWEgICAgICh3aWxsIG5ldmVyIHRyaWdnZXIpXG4gICAgICAgICAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbmV3LWNhcFxuICAgICAgICAgICAgaWYgKHhfYWxsLnNvbWUoKGU6IGFueSkgPT4gKGJhcmdzLmhhcyhOb3QuTmV3KGUpKSB8fCBOb3QuTmV3KGUpID09PSBiaW1wbCkpKSB7XG4gICAgICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoYmFyZ3MgJiYgeF9hbGwpIHtcbiAgICAgICAgICAgICAgICBiYi5wdXNoKGJpZHgpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuICAgIHJldHVybiB4X2ltcGw7XG59XG5cblxuZnVuY3Rpb24gcnVsZXNfMnByZXJlcShydWxlczogU2V0RGVmYXVsdERpY3QpIHtcbiAgICAvKiBidWlsZCBwcmVyZXF1aXNpdGVzIHRhYmxlIGZyb20gcnVsZXNcbiAgICAgICBEZXNjcmlwdGlvbiBieSBleGFtcGxlXG4gICAgICAgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgICAgIGdpdmVuIHNldCBvZiBsb2dpYyBydWxlczpcbiAgICAgICAgIGEgLT4gYiwgY1xuICAgICAgICAgYiAtPiBjXG4gICAgICAgd2UgYnVpbGQgcHJlcmVxdWlzaXRlcyAoZnJvbSB3aGF0IHBvaW50cyBzb21ldGhpbmcgY2FuIGJlIGRlZHVjZWQpOlxuICAgICAgICAgYiA8LSBhXG4gICAgICAgICBjIDwtIGEsIGJcbiAgICAgICBydWxlczogICB7fSBvZiBhIC0+IFtiLCBjLCAuLi5dXG4gICAgICAgcmV0dXJuOiAge30gb2YgYyA8LSBbYSwgYiwgLi4uXVxuICAgICAgIE5vdGUgaG93ZXZlciwgdGhhdCB0aGlzIHByZXJlcXVpc2l0ZXMgbWF5IGJlICpub3QqIGVub3VnaCB0byBwcm92ZSBhXG4gICAgICAgZmFjdC4gQW4gZXhhbXBsZSBpcyAnYSAtPiBiJyBydWxlLCB3aGVyZSBwcmVyZXEoYSkgaXMgYiwgYW5kIHByZXJlcShiKVxuICAgICAgIGlzIGEuIFRoYXQncyBiZWNhdXNlIGE9VCAtPiBiPVQsIGFuZCBiPUYgLT4gYT1GLCBidXQgYT1GIC0+IGI9P1xuICAgICovXG5cbiAgICBjb25zdCBwcmVyZXEgPSBuZXcgU2V0RGVmYXVsdERpY3QoKTtcbiAgICBmb3IgKGNvbnN0IGl0ZW0gb2YgcnVsZXMuZW50cmllcygpKSB7XG4gICAgICAgIGxldCBhID0gaXRlbVswXS5wO1xuICAgICAgICBjb25zdCBpbXBsID0gaXRlbVsxXTtcbiAgICAgICAgaWYgKGEgaW5zdGFuY2VvZiBOb3QpIHtcbiAgICAgICAgICAgIGEgPSBhLmFyZ3NbMF07XG4gICAgICAgIH1cbiAgICAgICAgZm9yIChjb25zdCBpdGVtIG9mIGltcGwudG9BcnJheSgpKSB7XG4gICAgICAgICAgICBsZXQgaSA9IGl0ZW0ucDtcbiAgICAgICAgICAgIGlmIChpIGluc3RhbmNlb2YgTm90KSB7XG4gICAgICAgICAgICAgICAgaSA9IGkuYXJnc1swXTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHByZXJlcS5nZXQoaSkuYWRkKGEpO1xuICAgICAgICB9XG4gICAgfVxuICAgIHJldHVybiBwcmVyZXE7XG59XG5cblxuLy8gLy8vLy8vLy8vLy8vLy8vL1xuLy8gUlVMRVMgUFJPVkVSIC8vXG4vLyAvLy8vLy8vLy8vLy8vLy8vXG5cbmNsYXNzIFRhdXRvbG9neURldGVjdGVkIGV4dGVuZHMgRXJyb3Ige1xuICAgIGFyZ3M7XG5cbiAgICBjb25zdHJ1Y3RvciguLi5hcmdzOiBhbnlbXSkge1xuICAgICAgICBzdXBlcigpO1xuICAgICAgICB0aGlzLmFyZ3MgPSBhcmdzO1xuICAgIH1cbiAgICAvLyAoaW50ZXJuYWwpIFByb3ZlciB1c2VzIGl0IGZvciByZXBvcnRpbmcgZGV0ZWN0ZWQgdGF1dG9sb2d5XG59XG5cbmNsYXNzIFByb3ZlciB7XG4gICAgLyogYWkgLSBwcm92ZXIgb2YgbG9naWMgcnVsZXNcbiAgICAgICBnaXZlbiBhIHNldCBvZiBpbml0aWFsIHJ1bGVzLCBQcm92ZXIgdHJpZXMgdG8gcHJvdmUgYWxsIHBvc3NpYmxlIHJ1bGVzXG4gICAgICAgd2hpY2ggZm9sbG93IGZyb20gZ2l2ZW4gcHJlbWlzZXMuXG4gICAgICAgQXMgYSByZXN1bHQgcHJvdmVkX3J1bGVzIGFyZSBhbHdheXMgZWl0aGVyIGluIG9uZSBvZiB0d28gZm9ybXM6IGFscGhhIG9yXG4gICAgICAgYmV0YTpcbiAgICAgICBBbHBoYSBydWxlc1xuICAgICAgIC0tLS0tLS0tLS0tXG4gICAgICAgVGhpcyBhcmUgcnVsZXMgb2YgdGhlIGZvcm06OlxuICAgICAgICAgYSAtPiBiICYgYyAmIGQgJiAuLi5cbiAgICAgICBCZXRhIHJ1bGVzXG4gICAgICAgLS0tLS0tLS0tLVxuICAgICAgIFRoaXMgYXJlIHJ1bGVzIG9mIHRoZSBmb3JtOjpcbiAgICAgICAgICYoYSxiLC4uLikgLT4gYyAmIGQgJiAuLi5cbiAgICAgICBpLmUuIGJldGEgcnVsZXMgYXJlIGpvaW4gY29uZGl0aW9ucyB0aGF0IHNheSB0aGF0IHNvbWV0aGluZyBmb2xsb3dzIHdoZW5cbiAgICAgICAqc2V2ZXJhbCogZmFjdHMgYXJlIHRydWUgYXQgdGhlIHNhbWUgdGltZS5cbiAgICAqL1xuXG4gICAgcHJvdmVkX3J1bGVzOiBhbnlbXTtcbiAgICBfcnVsZXNfc2VlbjtcblxuICAgIGNvbnN0cnVjdG9yKCkge1xuICAgICAgICB0aGlzLnByb3ZlZF9ydWxlcyA9IFtdO1xuICAgICAgICB0aGlzLl9ydWxlc19zZWVuID0gbmV3IEhhc2hTZXQoKTtcbiAgICB9XG5cbiAgICBzcGxpdF9hbHBoYV9iZXRhKCkge1xuICAgICAgICAvLyBzcGxpdCBwcm92ZWQgcnVsZXMgaW50byBhbHBoYSBhbmQgYmV0YSBjaGFpbnNcbiAgICAgICAgY29uc3QgcnVsZXNfYWxwaGEgPSBbXTsgLy8gYSAgICAgIC0+IGJcbiAgICAgICAgY29uc3QgcnVsZXNfYmV0YSA9IFtdOyAvLyAmKC4uLikgLT4gYlxuICAgICAgICBmb3IgKGNvbnN0IGltcGwgb2YgdGhpcy5wcm92ZWRfcnVsZXMpIHtcbiAgICAgICAgICAgIGNvbnN0IGEgPSBpbXBsLnA7XG4gICAgICAgICAgICBjb25zdCBiID0gaW1wbC5xO1xuICAgICAgICAgICAgaWYgKGEgaW5zdGFuY2VvZiBBbmQpIHtcbiAgICAgICAgICAgICAgICBydWxlc19iZXRhLnB1c2gobmV3IEltcGxpY2F0aW9uKGEsIGIpKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgcnVsZXNfYWxwaGEucHVzaChuZXcgSW1wbGljYXRpb24oYSwgYikpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBbcnVsZXNfYWxwaGEsIHJ1bGVzX2JldGFdO1xuICAgIH1cblxuICAgIHJ1bGVzX2FscGhhKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5zcGxpdF9hbHBoYV9iZXRhKClbMF07XG4gICAgfVxuXG4gICAgcnVsZXNfYmV0YSgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuc3BsaXRfYWxwaGFfYmV0YSgpWzFdO1xuICAgIH1cblxuICAgIHByb2Nlc3NfcnVsZShhOiBhbnksIGI6IGFueSkge1xuICAgICAgICAvLyBwcm9jZXNzIGEgLT4gYiBydWxlICAtPiAgVE9ETyB3cml0ZSBtb3JlP1xuICAgICAgICBpZiAoYiBpbnN0YW5jZW9mIFRydWUgfHwgYiBpbnN0YW5jZW9mIEZhbHNlKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGEgaW5zdGFuY2VvZiBUcnVlIHx8IGEgaW5zdGFuY2VvZiBGYWxzZSkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIGlmICh0aGlzLl9ydWxlc19zZWVuLmhhcyhuZXcgSW1wbGljYXRpb24oYSwgYikpKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aGlzLl9ydWxlc19zZWVuLmFkZChuZXcgSW1wbGljYXRpb24oYSwgYikpO1xuICAgICAgICB9XG4gICAgICAgIC8vIHRoaXMgaXMgdGhlIGNvcmUgb2YgdGhlIHByb2Nlc3NpbmdcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIHRoaXMuX3Byb2Nlc3NfcnVsZShhLCBiKTtcbiAgICAgICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgICAgICAgIGlmICghKGVycm9yIGluc3RhbmNlb2YgVGF1dG9sb2d5RGV0ZWN0ZWQpKSB7XG4gICAgICAgICAgICAgICAgdGhyb3cgRXJyb3I7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBfcHJvY2Vzc19ydWxlKGE6IGFueSwgYjogYW55KSB7XG4gICAgICAgIC8vIHJpZ2h0IHBhcnQgZmlyc3RcblxuICAgICAgICAvLyBhIC0+IGIgJiBjICAgLS0+ICAgIGEtPiBiICA7ICBhIC0+IGNcblxuICAgICAgICAvLyAgKD8pIEZJWE1FIHRoaXMgaXMgb25seSBjb3JyZWN0IHdoZW4gYiAmIGMgIT0gbnVsbCAhXG5cbiAgICAgICAgaWYgKGIgaW5zdGFuY2VvZiBBbmQpIHtcbiAgICAgICAgICAgIGZvciAoY29uc3QgYmFyZyBvZiBiLmFyZ3MpIHtcbiAgICAgICAgICAgICAgICB0aGlzLnByb2Nlc3NfcnVsZShhLCBiYXJnKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIGlmIChiIGluc3RhbmNlb2YgT3IpIHtcbiAgICAgICAgICAgIC8vIGRldGVjdCB0YXV0b2xvZ3kgZmlyc3RcbiAgICAgICAgICAgIGlmICghKGEgaW5zdGFuY2VvZiBMb2dpYykpIHsgLy8gYXRvbVxuICAgICAgICAgICAgICAgIC8vIHRhdXRvbG9neTogIGEgLT4gYXxjfC4uLlxuICAgICAgICAgICAgICAgIGlmIChiLmFyZ3MuaW5jbHVkZXMoYSkpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhyb3cgbmV3IFRhdXRvbG9neURldGVjdGVkKGEsIGIsIFwiYSAtPiBhfGN8Li4uXCIpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGNvbnN0IG5vdF9iYXJnczogYW55W10gPSBbXTtcbiAgICAgICAgICAgIGZvciAoY29uc3QgYmFyZyBvZiBiLmFyZ3MpIHtcbiAgICAgICAgICAgICAgICBub3RfYmFyZ3MucHVzaChOb3QuTmV3KGJhcmcpKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHRoaXMucHJvY2Vzc19ydWxlKEFuZC5OZXcoLi4ubm90X2JhcmdzKSwgTm90Lk5ldyhhKSk7XG5cbiAgICAgICAgICAgIGZvciAobGV0IGJpZHggPSAwOyBiaWR4IDwgYi5hcmdzLmxlbmd0aDsgYmlkeCsrKSB7XG4gICAgICAgICAgICAgICAgY29uc3QgYmFyZyA9IGIuYXJnc1tiaWR4XTtcbiAgICAgICAgICAgICAgICBjb25zdCBicmVzdCA9IFsuLi5iLmFyZ3NdLnNwbGljZShiaWR4LCAxKTtcbiAgICAgICAgICAgICAgICB0aGlzLnByb2Nlc3NfcnVsZShBbmQuTmV3KGEsIE5vdC5OZXcoYmFyZykpLCBPci5OZXcoLi4uYnJlc3QpKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIGlmIChhIGluc3RhbmNlb2YgQW5kKSB7XG4gICAgICAgICAgICBpZiAoYS5hcmdzLmluY2x1ZGVzKGIpKSB7XG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IFRhdXRvbG9neURldGVjdGVkKGEsIGIsIFwiYSAmIGIgLT4gYVwiKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHRoaXMucHJvdmVkX3J1bGVzLnB1c2gobmV3IEltcGxpY2F0aW9uKGEsIGIpKTtcbiAgICAgICAgICAgIC8vIFhYWCBOT1RFIGF0IHByZXNlbnQgd2UgaWdub3JlICAhYyAtPiAhYSB8ICFiXG4gICAgICAgIH0gZWxzZSBpZiAoYSBpbnN0YW5jZW9mIE9yKSB7XG4gICAgICAgICAgICBpZiAoYS5hcmdzLmluY2x1ZGVzKGIpKSB7XG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IFRhdXRvbG9neURldGVjdGVkKGEsIGIsIFwiYSAmIGIgLT4gYVwiKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGZvciAoY29uc3QgYWFyZyBvZiBhLmFyZ3MpIHtcbiAgICAgICAgICAgICAgICB0aGlzLnByb2Nlc3NfcnVsZShhYXJnLCBiKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIC8vIGJvdGggJ2EnIGFuZCAnYicgYXJlIGF0b21zXG4gICAgICAgICAgICB0aGlzLnByb3ZlZF9ydWxlcy5wdXNoKG5ldyBJbXBsaWNhdGlvbihhLCBiKSk7IC8vIGEgLT4gYlxuICAgICAgICAgICAgdGhpcy5wcm92ZWRfcnVsZXMucHVzaChuZXcgSW1wbGljYXRpb24oTm90Lk5ldyhiKSwgTm90Lk5ldyhhKSkpO1xuICAgICAgICB9XG4gICAgfVxufVxuXG4vLyAvLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xuXG5jbGFzcyBGYWN0UnVsZXMge1xuICAgIC8qIFJ1bGVzIHRoYXQgZGVzY3JpYmUgaG93IHRvIGRlZHVjZSBmYWN0cyBpbiBsb2dpYyBzcGFjZVxuICAgIFdoZW4gZGVmaW5lZCwgdGhlc2UgcnVsZXMgYWxsb3cgaW1wbGljYXRpb25zIHRvIHF1aWNrbHkgYmUgZGV0ZXJtaW5lZFxuICAgIGZvciBhIHNldCBvZiBmYWN0cy4gRm9yIHRoaXMgcHJlY29tcHV0ZWQgZGVkdWN0aW9uIHRhYmxlcyBhcmUgdXNlZC5cbiAgICBzZWUgYGRlZHVjZV9hbGxfZmFjdHNgICAgKGZvcndhcmQtY2hhaW5pbmcpXG4gICAgQWxzbyBpdCBpcyBwb3NzaWJsZSB0byBnYXRoZXIgcHJlcmVxdWlzaXRlcyBmb3IgYSBmYWN0LCB3aGljaCBpcyB0cmllZFxuICAgIHRvIGJlIHByb3Zlbi4gICAgKGJhY2t3YXJkLWNoYWluaW5nKVxuICAgIERlZmluaXRpb24gU3ludGF4XG4gICAgLS0tLS0tLS0tLS0tLS0tLS1cbiAgICBhIC0+IGIgICAgICAgLS0gYT1UIC0+IGI9VCAgKGFuZCBhdXRvbWF0aWNhbGx5IGI9RiAtPiBhPUYpXG4gICAgYSAtPiAhYiAgICAgIC0tIGE9VCAtPiBiPUZcbiAgICBhID09IGIgICAgICAgLS0gYSAtPiBiICYgYiAtPiBhXG4gICAgYSAtPiBiICYgYyAgIC0tIGE9VCAtPiBiPVQgJiBjPVRcbiAgICAjIFRPRE8gYiB8IGNcbiAgICBJbnRlcm5hbHNcbiAgICAtLS0tLS0tLS1cbiAgICAuZnVsbF9pbXBsaWNhdGlvbnNbaywgdl06IGFsbCB0aGUgaW1wbGljYXRpb25zIG9mIGZhY3Qgaz12XG4gICAgLmJldGFfdHJpZ2dlcnNbaywgdl06IGJldGEgcnVsZXMgdGhhdCBtaWdodCBiZSB0cmlnZ2VyZWQgd2hlbiBrPXZcbiAgICAucHJlcmVxICAtLSB7fSBrIDwtIFtdIG9mIGsncyBwcmVyZXF1aXNpdGVzXG4gICAgLmRlZmluZWRfZmFjdHMgLS0gc2V0IG9mIGRlZmluZWQgZmFjdCBuYW1lc1xuICAgICovXG5cbiAgICBiZXRhX3J1bGVzOiBhbnlbXTtcbiAgICBkZWZpbmVkX2ZhY3RzO1xuICAgIGZ1bGxfaW1wbGljYXRpb25zO1xuICAgIGJldGFfdHJpZ2dlcnM7XG4gICAgcHJlcmVxO1xuXG4gICAgY29uc3RydWN0b3IocnVsZXM6IGFueVtdIHwgc3RyaW5nKSB7XG4gICAgICAgIC8vIENvbXBpbGUgcnVsZXMgaW50byBpbnRlcm5hbCBsb29rdXAgdGFibGVzXG4gICAgICAgIGlmICh0eXBlb2YgcnVsZXMgPT09IFwic3RyaW5nXCIpIHtcbiAgICAgICAgICAgIHJ1bGVzID0gcnVsZXMuc3BsaXQoXCJcXG5cIik7XG4gICAgICAgIH1cbiAgICAgICAgLy8gLS0tIHBhcnNlIGFuZCBwcm9jZXNzIHJ1bGVzIC0tLVxuICAgICAgICBjb25zdCBQOiBQcm92ZXIgPSBuZXcgUHJvdmVyO1xuXG4gICAgICAgIGZvciAoY29uc3QgcnVsZSBvZiBydWxlcykge1xuICAgICAgICAgICAgLy8gWFhYIGBhYCBpcyBoYXJkY29kZWQgdG8gYmUgYWx3YXlzIGF0b21cbiAgICAgICAgICAgIGxldCBbYSwgb3AsIGJdID0gcnVsZS5zcGxpdChcIiBcIiwgMyk7XG4gICAgICAgICAgICBhID0gTG9naWMuZnJvbXN0cmluZyhhKTtcbiAgICAgICAgICAgIGIgPSBMb2dpYy5mcm9tc3RyaW5nKGIpO1xuXG4gICAgICAgICAgICBpZiAob3AgPT09IFwiLT5cIikge1xuICAgICAgICAgICAgICAgIFAucHJvY2Vzc19ydWxlKGEsIGIpO1xuICAgICAgICAgICAgfSBlbHNlIGlmIChvcCA9PT0gXCI9PVwiKSB7XG4gICAgICAgICAgICAgICAgUC5wcm9jZXNzX3J1bGUoYSwgYik7XG4gICAgICAgICAgICAgICAgUC5wcm9jZXNzX3J1bGUoYiwgYSk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcInVua25vd24gb3AgXCIgKyBvcCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgLy8gLS0tIGJ1aWxkIGRlZHVjdGlvbiBuZXR3b3JrcyAtLS1cblxuICAgICAgICB0aGlzLmJldGFfcnVsZXMgPSBbXTtcbiAgICAgICAgZm9yIChjb25zdCBpdGVtIG9mIFAucnVsZXNfYmV0YSgpKSB7XG4gICAgICAgICAgICBjb25zdCBiY29uZCA9IGl0ZW0ucDtcbiAgICAgICAgICAgIGNvbnN0IGJpbXBsID0gaXRlbS5xO1xuICAgICAgICAgICAgY29uc3QgcGFpcnM6IEhhc2hTZXQgPSBuZXcgSGFzaFNldCgpO1xuICAgICAgICAgICAgYmNvbmQuYXJncy5mb3JFYWNoKChhOiBhbnkpID0+IHBhaXJzLmFkZChfYXNfcGFpcihhKSkpO1xuICAgICAgICAgICAgdGhpcy5iZXRhX3J1bGVzLnB1c2gobmV3IEltcGxpY2F0aW9uKHBhaXJzLCBfYXNfcGFpcihiaW1wbCkpKTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIGRlZHVjZSBhbHBoYSBpbXBsaWNhdGlvbnNcbiAgICAgICAgY29uc3QgaW1wbF9hID0gZGVkdWNlX2FscGhhX2ltcGxpY2F0aW9ucyhQLnJ1bGVzX2FscGhhKCkpO1xuXG4gICAgICAgIC8vIG5vdzpcbiAgICAgICAgLy8gLSBhcHBseSBiZXRhIHJ1bGVzIHRvIGFscGhhIGNoYWlucyAgKHN0YXRpYyBleHRlbnNpb24pLCBhbmRcbiAgICAgICAgLy8gLSBmdXJ0aGVyIGFzc29jaWF0ZSBiZXRhIHJ1bGVzIHRvIGFscGhhIGNoYWluIChmb3IgaW5mZXJlbmNlXG4gICAgICAgIC8vIGF0IHJ1bnRpbWUpXG5cbiAgICAgICAgY29uc3QgaW1wbF9hYiA9IGFwcGx5X2JldGFfdG9fYWxwaGFfcm91dGUoaW1wbF9hLCBQLnJ1bGVzX2JldGEoKSk7XG5cbiAgICAgICAgLy8gZXh0cmFjdCBkZWZpbmVkIGZhY3QgbmFtZXNcbiAgICAgICAgdGhpcy5kZWZpbmVkX2ZhY3RzID0gbmV3IEhhc2hTZXQoKTtcblxuXG4gICAgICAgIGZvciAoY29uc3QgayBvZiBpbXBsX2FiLmtleXMoKSkge1xuICAgICAgICAgICAgdGhpcy5kZWZpbmVkX2ZhY3RzLmFkZChfYmFzZV9mYWN0KGspKTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIGJ1aWxkIHJlbHMgKGZvcndhcmQgY2hhaW5zKVxuXG4gICAgICAgIGNvbnN0IGZ1bGxfaW1wbGljYXRpb25zID0gbmV3IFNldERlZmF1bHREaWN0KCk7XG4gICAgICAgIGNvbnN0IGJldGFfdHJpZ2dlcnMgPSBuZXcgU2V0RGVmYXVsdERpY3QoKTtcbiAgICAgICAgZm9yIChjb25zdCBpdGVtIG9mIGltcGxfYWIuZW50cmllcygpKSB7XG4gICAgICAgICAgICBjb25zdCBrID0gaXRlbVswXTtcbiAgICAgICAgICAgIGNvbnN0IHZhbCA9IGl0ZW1bMV07XG4gICAgICAgICAgICBjb25zdCBpbXBsOiBIYXNoU2V0ID0gdmFsLnA7XG4gICAgICAgICAgICBjb25zdCBiZXRhaWR4cyA9IHZhbC5xO1xuICAgICAgICAgICAgY29uc3Qgc2V0VG9BZGQgPSBuZXcgSGFzaFNldCgpO1xuICAgICAgICAgICAgaW1wbC50b0FycmF5KCkuZm9yRWFjaCgoZTogYW55KSA9PiBzZXRUb0FkZC5hZGQoX2FzX3BhaXIoZSkpKTtcbiAgICAgICAgICAgIGZ1bGxfaW1wbGljYXRpb25zLmFkZChfYXNfcGFpcihrKSwgc2V0VG9BZGQpO1xuICAgICAgICAgICAgYmV0YV90cmlnZ2Vycy5hZGQoX2FzX3BhaXIoayksIGJldGFpZHhzKTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLmZ1bGxfaW1wbGljYXRpb25zID0gZnVsbF9pbXBsaWNhdGlvbnM7XG5cbiAgICAgICAgdGhpcy5iZXRhX3RyaWdnZXJzID0gYmV0YV90cmlnZ2VycztcblxuICAgICAgICAvLyBidWlsZCBwcmVyZXEgKGJhY2t3YXJkIGNoYWlucylcbiAgICAgICAgY29uc3QgcHJlcmVxID0gbmV3IFNldERlZmF1bHREaWN0KCk7XG4gICAgICAgIGNvbnN0IHJlbF9wcmVyZXEgPSBydWxlc18ycHJlcmVxKGZ1bGxfaW1wbGljYXRpb25zKTtcbiAgICAgICAgZm9yIChjb25zdCBpdGVtIG9mIHJlbF9wcmVyZXEuZW50cmllcygpKSB7XG4gICAgICAgICAgICBjb25zdCBrID0gaXRlbVswXTtcbiAgICAgICAgICAgIGNvbnN0IHBpdGVtcyA9IGl0ZW1bMV07XG4gICAgICAgICAgICBwcmVyZXEuZ2V0KGspLmFkZChwaXRlbXMpO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMucHJlcmVxID0gcHJlcmVxO1xuICAgIH1cbn1cblxuXG5jbGFzcyBJbmNvbnNpc3RlbnRBc3N1bXB0aW9ucyBleHRlbmRzIEVycm9yIHtcbiAgICBhcmdzO1xuXG4gICAgY29uc3RydWN0b3IoLi4uYXJnczogYW55W10pIHtcbiAgICAgICAgc3VwZXIoKTtcbiAgICAgICAgdGhpcy5hcmdzID0gYXJncztcbiAgICB9XG5cbiAgICBzdGF0aWMgX19zdHJfXyguLi5hcmdzOiBhbnlbXSkge1xuICAgICAgICBjb25zdCBba2IsIGZhY3QsIHZhbHVlXSA9IGFyZ3M7XG4gICAgICAgIHJldHVybiBrYiArIFwiLCBcIiArIGZhY3QgKyBcIj1cIiArIHZhbHVlO1xuICAgIH1cbn1cblxuY2xhc3MgRmFjdEtCIGV4dGVuZHMgSGFzaERpY3Qge1xuICAgIC8qXG4gICAgQSBzaW1wbGUgcHJvcG9zaXRpb25hbCBrbm93bGVkZ2UgYmFzZSByZWx5aW5nIG9uIGNvbXBpbGVkIGluZmVyZW5jZSBydWxlcy5cbiAgICAqL1xuXG4gICAgcnVsZXM7XG5cbiAgICBjb25zdHJ1Y3RvcihydWxlczogYW55KSB7XG4gICAgICAgIHN1cGVyKCk7XG4gICAgICAgIHRoaXMucnVsZXMgPSBydWxlcztcbiAgICB9XG5cbiAgICBfdGVsbChrOiBhbnksIHY6IGFueSkge1xuICAgICAgICAvKiBBZGQgZmFjdCBrPXYgdG8gdGhlIGtub3dsZWRnZSBiYXNlLlxuICAgICAgICBSZXR1cm5zIFRydWUgaWYgdGhlIEtCIGhhcyBhY3R1YWxseSBiZWVuIHVwZGF0ZWQsIEZhbHNlIG90aGVyd2lzZS5cbiAgICAgICAgKi9cbiAgICAgICAgaWYgKGsgaW4gdGhpcy5kaWN0ICYmIHR5cGVvZiB0aGlzLmdldChrKSAhPT0gXCJ1bmRlZmluZWRcIikge1xuICAgICAgICAgICAgaWYgKHRoaXMuZ2V0KGspID09PSB2KSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIExvZ2ljLkZhbHNlO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgSW5jb25zaXN0ZW50QXNzdW1wdGlvbnModGhpcywgaywgdik7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aGlzLmFkZChrLCB2KTtcbiAgICAgICAgICAgIHJldHVybiBMb2dpYy5UcnVlO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgLy8gLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xuICAgIC8vKiBUaGlzIGlzIHRoZSB3b3JraG9yc2UsIHNvIGtlZXAgaXQgKmZhc3QqLiAvL1xuICAgIC8vIC8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cblxuICAgIGRlZHVjZV9hbGxfZmFjdHMoZmFjdHM6IGFueSkge1xuICAgICAgICAvKlxuICAgICAgICBVcGRhdGUgdGhlIEtCIHdpdGggYWxsIHRoZSBpbXBsaWNhdGlvbnMgb2YgYSBsaXN0IG9mIGZhY3RzLlxuICAgICAgICBGYWN0cyBjYW4gYmUgc3BlY2lmaWVkIGFzIGEgZGljdGlvbmFyeSBvciBhcyBhIGxpc3Qgb2YgKGtleSwgdmFsdWUpXG4gICAgICAgIHBhaXJzLlxuICAgICAgICAqL1xuICAgICAgICAvLyBrZWVwIGZyZXF1ZW50bHkgdXNlZCBhdHRyaWJ1dGVzIGxvY2FsbHksIHNvIHdlJ2xsIGF2b2lkIGV4dHJhXG4gICAgICAgIC8vIGF0dHJpYnV0ZSBhY2Nlc3Mgb3ZlcmhlYWRcblxuICAgICAgICBjb25zdCBmdWxsX2ltcGxpY2F0aW9uczogU2V0RGVmYXVsdERpY3QgPSB0aGlzLnJ1bGVzLmZ1bGxfaW1wbGljYXRpb25zO1xuICAgICAgICBjb25zdCBiZXRhX3RyaWdnZXJzOiBTZXREZWZhdWx0RGljdCA9IHRoaXMucnVsZXMuYmV0YV90cmlnZ2VycztcbiAgICAgICAgY29uc3QgYmV0YV9ydWxlczogYW55W10gPSB0aGlzLnJ1bGVzLmJldGFfcnVsZXM7XG5cbiAgICAgICAgaWYgKGZhY3RzIGluc3RhbmNlb2YgSGFzaERpY3QgfHwgZmFjdHMgaW5zdGFuY2VvZiBTdGRGYWN0S0IpIHtcbiAgICAgICAgICAgIGZhY3RzID0gZmFjdHMuZW50cmllcygpO1xuICAgICAgICB9XG5cbiAgICAgICAgd2hpbGUgKGZhY3RzLmxlbmd0aCAhPSAwKSB7XG4gICAgICAgICAgICBjb25zdCBiZXRhX21heXRyaWdnZXIgPSBuZXcgSGFzaFNldCgpO1xuXG4gICAgICAgICAgICAvLyAtLS0gYWxwaGEgY2hhaW5zIC0tLVxuICAgICAgICAgICAgZm9yIChjb25zdCBpdGVtIG9mIGZhY3RzKSB7XG4gICAgICAgICAgICAgICAgY29uc3QgayA9IGl0ZW1bMF07XG4gICAgICAgICAgICAgICAgY29uc3QgdiA9IGl0ZW1bMV07XG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuX3RlbGwoaywgdikgaW5zdGFuY2VvZiBGYWxzZSB8fCAodHlwZW9mIHYgPT09IFwidW5kZWZpbmVkXCIpKSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIC8vIGxvb2t1cCByb3V0aW5nIHRhYmxlc1xuICAgICAgICAgICAgICAgIGNvbnN0IGFyciA9IGZ1bGxfaW1wbGljYXRpb25zLmdldChuZXcgSW1wbGljYXRpb24oaywgdikpLnRvQXJyYXkoKTtcbiAgICAgICAgICAgICAgICBmb3IgKGNvbnN0IGl0ZW0gb2YgYXJyKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX3RlbGwoaXRlbVswXSwgaXRlbVsxXSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGNvbnN0IGN1cnJpbXAgPSBiZXRhX3RyaWdnZXJzLmdldChuZXcgSW1wbGljYXRpb24oaywgdikpO1xuICAgICAgICAgICAgICAgIGlmICghKGN1cnJpbXAuaXNFbXB0eSgpKSkge1xuICAgICAgICAgICAgICAgICAgICBiZXRhX21heXRyaWdnZXIuYWRkKGJldGFfdHJpZ2dlcnMuZ2V0KG5ldyBJbXBsaWNhdGlvbihrLCB2KSkpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIC8vIC0tLSBiZXRhIGNoYWlucyAtLS1cbiAgICAgICAgICAgIGZhY3RzID0gW107XG4gICAgICAgICAgICBmb3IgKGNvbnN0IGJpZHggb2YgYmV0YV9tYXl0cmlnZ2VyLnRvQXJyYXkoKSkge1xuICAgICAgICAgICAgICAgIGNvbnN0IFtiY29uZCwgYmltcGxdID0gYmV0YV9ydWxlc1tiaWR4XTtcbiAgICAgICAgICAgICAgICBmb3IgKGNvbnN0IGl0ZW0gb2YgYmNvbmQpIHtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgayA9IGl0ZW1bMF07XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHYgPSBpdGVtWzFdO1xuICAgICAgICAgICAgICAgICAgICBpZiAodGhpcy5nZXQoaykgIT09IHYpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGZhY3RzLnB1c2goYmltcGwpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cbn1cblxuZXhwb3J0IHtGYWN0S0IsIEZhY3RSdWxlc307XG4iLCAiLyogVGhlIGNvcmUncyBjb3JlLiAqL1xuXG4vKlxuTm90YWJsZSBjaGFuZ2VzIG1hZGUgKFdCIGFuZCBHTSlcbi0gUmVwbGFjZWQgYXJyYXkgb2YgY2xhc3NlcyB3aXRoIGRpY3Rpb25hcnkgZm9yIHF1aWNrZXIgaW5kZXggcmV0cmlldmFsc1xuLSBJbXBsZW1lbnRlZCBhIGNvbnN0cnVjdG9yIHN5c3RlbSBmb3IgYmFzaWNtZXRhIHJhdGhlciB0aGFuIF9fbmV3X19cbiovXG5cblxuaW1wb3J0IHtIYXNoU2V0fSBmcm9tIFwiLi91dGlsaXR5XCI7XG5cbi8vIHVzZWQgZm9yIGNhbm9uaWNhbCBvcmRlcmluZyBvZiBzeW1ib2xpYyBzZXF1ZW5jZXNcbi8vIHZpYSBfX2NtcF9fIG1ldGhvZDpcbi8vIEZJWE1FIHRoaXMgaXMgKnNvKiBpcnJlbGV2YW50IGFuZCBvdXRkYXRlZCFcblxuY29uc3Qgb3JkZXJpbmdfb2ZfY2xhc3NlczogUmVjb3JkPGFueSwgYW55PiA9IHtcbiAgICAvLyBzaW5nbGV0b24gbnVtYmVyc1xuICAgIFplcm86IDAsIE9uZTogMSwgSGFsZjogMiwgSW5maW5pdHk6IDMsIE5hTjogNCwgTmVnYXRpdmVPbmU6IDUsIE5lZ2F0aXZlSW5maW5pdHk6IDYsXG4gICAgLy8gbnVtYmVyc1xuICAgIEludGVnZXI6IDcsIFJhdGlvbmFsOiA4LCBGbG9hdDogOSxcbiAgICAvLyBzaW5nbGV0b24gbnVtYmVyc1xuICAgIEV4cDE6IDEwLCBQaTogMTEsIEltYWdpbmFyeVVuaXQ6IDEyLFxuICAgIC8vIHN5bWJvbHNcbiAgICBTeW1ib2w6IDEzLCBXaWxkOiAxNCwgVGVtcG9yYXJ5OiAxNSxcbiAgICAvLyBhcml0aG1ldGljIG9wZXJhdGlvbnNcbiAgICBQb3c6IDE2LCBNdWw6IDE3LCBBZGQ6IDE4LFxuICAgIC8vIGZ1bmN0aW9uIHZhbHVlc1xuICAgIERlcml2YXRpdmU6IDE5LCBJbnRlZ3JhbDogMjAsXG4gICAgLy8gZGVmaW5lZCBzaW5nbGV0b24gZnVuY3Rpb25zXG4gICAgQWJzOiAyMSwgU2lnbjogMjIsIFNxcnQ6IDIzLCBGbG9vcjogMjQsIENlaWxpbmc6IDI1LCBSZTogMjYsIEltOiAyNyxcbiAgICBBcmc6IDI4LCBDb25qdWdhdGU6IDI5LCBFeHA6IDMwLCBMb2c6IDMxLCBTaW46IDMyLCBDb3M6IDMzLCBUYW46IDM0LFxuICAgIENvdDogMzUsIEFTaW46IDM2LCBBQ29zOiAzNywgQVRhbjogMzgsIEFDb3Q6IDM5LCBTaW5oOiA0MCwgQ29zaDogNDEsXG4gICAgVGFuaDogNDIsIEFTaW5oOiA0MywgQUNvc2g6IDQ0LCBBVGFuaDogNDUsIEFDb3RoOiA0NixcbiAgICBSaXNpbmdGYWN0b3JpYWw6IDQ3LCBGYWxsaW5nRmFjdG9yaWFsOiA0OCwgZmFjdG9yaWFsOiA0OSwgYmlub21pYWw6IDUwLFxuICAgIEdhbW1hOiA1MSwgTG93ZXJHYW1tYTogNTIsIFVwcGVyR2FtYTogNTMsIFBvbHlHYW1tYTogNTQsIEVyZjogNTUsXG4gICAgLy8gc3BlY2lhbCBwb2x5bm9taWFsc1xuICAgIENoZWJ5c2hldjogNTYsIENoZWJ5c2hldjI6IDU3LFxuICAgIC8vIHVuZGVmaW5lZCBmdW5jdGlvbnNcbiAgICBGdW5jdGlvbjogNTgsIFdpbGRGdW5jdGlvbjogNTksXG4gICAgLy8gYW5vbnltb3VzIGZ1bmN0aW9uc1xuICAgIExhbWJkYTogNjAsXG4gICAgLy8gTGFuZGF1IE8gc3ltYm9sXG4gICAgT3JkZXI6IDYxLFxuICAgIC8vIHJlbGF0aW9uYWwgb3BlcmF0aW9uc1xuICAgIEVxdWFsbGl0eTogNjIsIFVuZXF1YWxpdHk6IDYzLCBTdHJpY3RHcmVhdGVyVGhhbjogNjQsIFN0cmljdExlc3NUaGFuOiA2NSxcbiAgICBHcmVhdGVyVGhhbjogNjYsIExlc3NUaGFuOiA2Nixcbn07XG5cblxuY2xhc3MgUmVnaXN0cnkge1xuICAgIC8qXG4gICAgQmFzZSBjbGFzcyBmb3IgcmVnaXN0cnkgb2JqZWN0cy5cblxuICAgIFJlZ2lzdHJpZXMgbWFwIGEgbmFtZSB0byBhbiBvYmplY3QgdXNpbmcgYXR0cmlidXRlIG5vdGF0aW9uLiBSZWdpc3RyeVxuICAgIGNsYXNzZXMgYmVoYXZlIHNpbmdsZXRvbmljYWxseTogYWxsIHRoZWlyIGluc3RhbmNlcyBzaGFyZSB0aGUgc2FtZSBzdGF0ZSxcbiAgICB3aGljaCBpcyBzdG9yZWQgaW4gdGhlIGNsYXNzIG9iamVjdC5cblxuICAgIEFsbCBzdWJjbGFzc2VzIHNob3VsZCBzZXQgYF9fc2xvdHNfXyA9ICgpYC5cbiAgICAqL1xuXG4gICAgc3RhdGljIGRpY3Q6IFJlY29yZDxhbnksIGFueT47XG5cbiAgICBhZGRBdHRyKG5hbWU6IGFueSwgb2JqOiBhbnkpIHtcbiAgICAgICAgUmVnaXN0cnkuZGljdFtuYW1lXSA9IG9iajtcbiAgICB9XG5cbiAgICBkZWxBdHRyKG5hbWU6IGFueSkge1xuICAgICAgICBkZWxldGUgUmVnaXN0cnkuZGljdFtuYW1lXTtcbiAgICB9XG59XG5cbi8vIEEgc2V0IGNvbnRhaW5pbmcgYWxsIFN5bVB5IGNsYXNzIG9iamVjdHNcbmNvbnN0IGFsbF9jbGFzc2VzID0gbmV3IEhhc2hTZXQoKTtcblxuY2xhc3MgQmFzaWNNZXRhIHtcbiAgICBfX3N5bXB5X186IGFueTtcblxuICAgIHN0YXRpYyByZWdpc3RlcihjbHM6IGFueSkge1xuICAgICAgICBhbGxfY2xhc3Nlcy5hZGQoY2xzKTtcbiAgICAgICAgY2xzLl9fc3ltcHlfXyA9IHRydWU7XG4gICAgfVxuXG4gICAgc3RhdGljIGNvbXBhcmUoc2VsZjogYW55LCBvdGhlcjogYW55KSB7XG4gICAgICAgIC8vIElmIHRoZSBvdGhlciBvYmplY3QgaXMgbm90IGEgQmFzaWMgc3ViY2xhc3MsIHRoZW4gd2UgYXJlIG5vdCBlcXVhbCB0b1xuICAgICAgICAvLyBpdC5cbiAgICAgICAgaWYgKCEob3RoZXIgaW5zdGFuY2VvZiBCYXNpY01ldGEpKSB7XG4gICAgICAgICAgICByZXR1cm4gLTE7XG4gICAgICAgIH1cbiAgICAgICAgY29uc3QgbjEgPSBzZWxmLmNvbnN0cnVjdG9yLm5hbWU7XG4gICAgICAgIGNvbnN0IG4yID0gb3RoZXIuY29uc3RydWN0b3IubmFtZTtcbiAgICAgICAgLy8gY2hlY2sgaWYgYm90aCBhcmUgaW4gdGhlIGNsYXNzZXMgZGljdGlvbmFyeVxuICAgICAgICBpZiAob3JkZXJpbmdfb2ZfY2xhc3Nlcy5oYXMobjEpICYmIG9yZGVyaW5nX29mX2NsYXNzZXMuaGFzKG4yKSkge1xuICAgICAgICAgICAgY29uc3QgaWR4MSA9IG9yZGVyaW5nX29mX2NsYXNzZXNbbjFdO1xuICAgICAgICAgICAgY29uc3QgaWR4MiA9IG9yZGVyaW5nX29mX2NsYXNzZXNbbjJdO1xuICAgICAgICAgICAgLy8gdGhlIGNsYXNzIHdpdGggdGhlIGxhcmdlciBpbmRleCBpcyBncmVhdGVyXG4gICAgICAgICAgICByZXR1cm4gTWF0aC5zaWduKGlkeDEgLSBpZHgyKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAobjEgPiBuMikge1xuICAgICAgICAgICAgcmV0dXJuIDE7XG4gICAgICAgIH0gZWxzZSBpZiAobjEgPT09IG4yKSB7XG4gICAgICAgICAgICByZXR1cm4gMDtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gLTE7XG4gICAgfVxuXG4gICAgbGVzc1RoYW4ob3RoZXI6IGFueSkge1xuICAgICAgICBpZiAoQmFzaWNNZXRhLmNvbXBhcmUoc2VsZiwgb3RoZXIpID09PSAtMSkge1xuICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cblxuICAgIGdyZWF0ZXJUaGFuKG90aGVyOiBhbnkpIHtcbiAgICAgICAgaWYgKEJhc2ljTWV0YS5jb21wYXJlKHNlbGYsIG90aGVyKSA9PT0gMSkge1xuICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbn1cblxuXG5leHBvcnQge0Jhc2ljTWV0YSwgUmVnaXN0cnl9O1xuXG4iLCAiLypcbk5vdGFibGUgY2hhbmdlcyBtYWRlIChhbmQgbm90ZXMpOlxuLSBNYW5hZ2VkUHJvcGVydGllcyByZXdvcmtlZCBhcyBub3JtYWwgY2xhc3MgLSBlYWNoIGNsYXNzIGlzIHJlZ2lzdGVyZWQgZGlyZWN0bHlcbiAgYWZ0ZXIgZGVmaW5lZFxuLSBNYW5hZ2VkUHJvcGVydGllcyB0cmFja3MgcHJvcGVydGllcyBvZiBiYXNlIGNsYXNzZXMgYnkgdHJhY2tpbmcgYWxsIHByb3BlcnRpZXNcbiAgKHNlZSBjb21tZW50cyB3aXRoaW4gY2xhc3MpXG4tIENsYXNzIHByb3BlcnRpZXMgZnJvbSBfZXZhbF9pcyBtZXRob2RzIGFyZSBhc3NpZ25lZCB0byBlYWNoIG9iamVjdCBpdHNlbGYgaW5cbiAgdGhlIEJhc2ljIGNvbnN0cnVjdG9yXG4tIENob29zaW5nIHRvIHJ1biBnZXRpdCgpIG9uIG1ha2VfcHJvcGVydHkgdG8gYWRkIGNvbnNpc3RlbmN5IGluIGFjY2Vzc2luZ1xuLSBUby1kbzogbWFrZSBhY2Nlc3NpbmcgcHJvcGVydGllcyBtb3JlIGNvbnNpc3RlbnQgKGkuZS4sIHNhbWUgc3ludGF4IGZvclxuICBhY2Vzc2luZyBzdGF0aWMgYW5kIG5vbi1zdGF0aWMgcHJvcGVydGllcylcbiovXG5cbmltcG9ydCB7RmFjdEtCLCBGYWN0UnVsZXN9IGZyb20gXCIuL2ZhY3RzXCI7XG5pbXBvcnQge0Jhc2ljTWV0YX0gZnJvbSBcIi4vY29yZVwiO1xuaW1wb3J0IHtIYXNoRGljdCwgSGFzaFNldCwgVXRpbH0gZnJvbSBcIi4vdXRpbGl0eVwiO1xuXG5cbmNvbnN0IF9hc3N1bWVfcnVsZXMgPSBuZXcgRmFjdFJ1bGVzKFtcbiAgICBcImludGVnZXIgLT4gcmF0aW9uYWxcIixcbiAgICBcInJhdGlvbmFsIC0+IHJlYWxcIixcbiAgICBcInJhdGlvbmFsIC0+IGFsZ2VicmFpY1wiLFxuICAgIFwiYWxnZWJyYWljIC0+IGNvbXBsZXhcIixcbiAgICBcInRyYW5zY2VuZGVudGFsID09IGNvbXBsZXggJiAhYWxnZWJyYWljXCIsXG4gICAgXCJyZWFsIC0+IGhlcm1pdGlhblwiLFxuICAgIFwiaW1hZ2luYXJ5IC0+IGNvbXBsZXhcIixcbiAgICBcImltYWdpbmFyeSAtPiBhbnRpaGVybWl0aWFuXCIsXG4gICAgXCJleHRlbmRlZF9yZWFsIC0+IGNvbW11dGF0aXZlXCIsXG4gICAgXCJjb21wbGV4IC0+IGNvbW11dGF0aXZlXCIsXG4gICAgXCJjb21wbGV4IC0+IGZpbml0ZVwiLFxuXG4gICAgXCJvZGQgPT0gaW50ZWdlciAmICFldmVuXCIsXG4gICAgXCJldmVuID09IGludGVnZXIgJiAhb2RkXCIsXG5cbiAgICBcInJlYWwgLT4gY29tcGxleFwiLFxuICAgIFwiZXh0ZW5kZWRfcmVhbCAtPiByZWFsIHwgaW5maW5pdGVcIixcbiAgICBcInJlYWwgPT0gZXh0ZW5kZWRfcmVhbCAmIGZpbml0ZVwiLFxuXG4gICAgXCJleHRlbmRlZF9yZWFsID09IGV4dGVuZGVkX25lZ2F0aXZlIHwgemVybyB8IGV4dGVuZGVkX3Bvc2l0aXZlXCIsXG4gICAgXCJleHRlbmRlZF9uZWdhdGl2ZSA9PSBleHRlbmRlZF9ub25wb3NpdGl2ZSAmIGV4dGVuZGVkX25vbnplcm9cIixcbiAgICBcImV4dGVuZGVkX3Bvc2l0aXZlID09IGV4dGVuZGVkX25vbm5lZ2F0aXZlICYgZXh0ZW5kZWRfbm9uemVyb1wiLFxuXG4gICAgXCJleHRlbmRlZF9ub25wb3NpdGl2ZSA9PSBleHRlbmRlZF9yZWFsICYgIWV4dGVuZGVkX3Bvc2l0aXZlXCIsXG4gICAgXCJleHRlbmRlZF9ub25uZWdhdGl2ZSA9PSBleHRlbmRlZF9yZWFsICYgIWV4dGVuZGVkX25lZ2F0aXZlXCIsXG5cbiAgICBcInJlYWwgPT0gbmVnYXRpdmUgfCB6ZXJvIHwgcG9zaXRpdmVcIixcbiAgICBcIm5lZ2F0aXZlID09IG5vbnBvc2l0aXZlICYgbm9uemVyb1wiLFxuICAgIFwicG9zaXRpdmUgPT0gbm9ubmVnYXRpdmUgJiBub256ZXJvXCIsXG5cbiAgICBcIm5vbnBvc2l0aXZlID09IHJlYWwgJiAhcG9zaXRpdmVcIixcbiAgICBcIm5vbm5lZ2F0aXZlID09IHJlYWwgJiAhbmVnYXRpdmVcIixcblxuICAgIFwicG9zaXRpdmUgPT0gZXh0ZW5kZWRfcG9zaXRpdmUgJiBmaW5pdGVcIixcbiAgICBcIm5lZ2F0aXZlID09IGV4dGVuZGVkX25lZ2F0aXZlICYgZmluaXRlXCIsXG4gICAgXCJub25wb3NpdGl2ZSA9PSBleHRlbmRlZF9ub25wb3NpdGl2ZSAmIGZpbml0ZVwiLFxuICAgIFwibm9ubmVnYXRpdmUgPT0gZXh0ZW5kZWRfbm9ubmVnYXRpdmUgJiBmaW5pdGVcIixcbiAgICBcIm5vbnplcm8gPT0gZXh0ZW5kZWRfbm9uemVybyAmIGZpbml0ZVwiLFxuXG4gICAgXCJ6ZXJvIC0+IGV2ZW4gJiBmaW5pdGVcIixcbiAgICBcInplcm8gPT0gZXh0ZW5kZWRfbm9ubmVnYXRpdmUgJiBleHRlbmRlZF9ub25wb3NpdGl2ZVwiLFxuICAgIFwiemVybyA9PSBub25uZWdhdGl2ZSAmIG5vbnBvc2l0aXZlXCIsXG4gICAgXCJub256ZXJvIC0+IHJlYWxcIixcblxuICAgIFwicHJpbWUgLT4gaW50ZWdlciAmIHBvc2l0aXZlXCIsXG4gICAgXCJjb21wb3NpdGUgLT4gaW50ZWdlciAmIHBvc2l0aXZlICYgIXByaW1lXCIsXG4gICAgXCIhY29tcG9zaXRlIC0+ICFwb3NpdGl2ZSB8ICFldmVuIHwgcHJpbWVcIixcblxuICAgIFwiaXJyYXRpb25hbCA9PSByZWFsICYgIXJhdGlvbmFsXCIsXG5cbiAgICBcImltYWdpbmFyeSAtPiAhZXh0ZW5kZWRfcmVhbFwiLFxuXG4gICAgXCJpbmZpbml0ZSA9PSAhZmluaXRlXCIsXG4gICAgXCJub25pbnRlZ2VyID09IGV4dGVuZGVkX3JlYWwgJiAhaW50ZWdlclwiLFxuICAgIFwiZXh0ZW5kZWRfbm9uemVybyA9PSBleHRlbmRlZF9yZWFsICYgIXplcm9cIixcbl0pO1xuXG5cbmV4cG9ydCBjb25zdCBfYXNzdW1lX2RlZmluZWQgPSBfYXNzdW1lX3J1bGVzLmRlZmluZWRfZmFjdHMuY2xvbmUoKTtcblxuY2xhc3MgU3RkRmFjdEtCIGV4dGVuZHMgRmFjdEtCIHtcbiAgICAvKiBBIEZhY3RLQiBzcGVjaWFsaXplZCBmb3IgdGhlIGJ1aWx0LWluIHJ1bGVzXG4gICAgVGhpcyBpcyB0aGUgb25seSBraW5kIG9mIEZhY3RLQiB0aGF0IEJhc2ljIG9iamVjdHMgc2hvdWxkIHVzZS5cbiAgICAqL1xuXG4gICAgX2dlbmVyYXRvcjtcblxuICAgIGNvbnN0cnVjdG9yKGZhY3RzOiBhbnkgPSB1bmRlZmluZWQpIHtcbiAgICAgICAgc3VwZXIoX2Fzc3VtZV9ydWxlcyk7XG4gICAgICAgIC8vIHNhdmUgYSBjb3B5IG9mIGZhY3RzIGRpY3RcbiAgICAgICAgaWYgKHR5cGVvZiBmYWN0cyA9PT0gXCJ1bmRlZmluZWRcIikge1xuICAgICAgICAgICAgdGhpcy5fZ2VuZXJhdG9yID0ge307XG4gICAgICAgIH0gZWxzZSBpZiAoIShmYWN0cyBpbnN0YW5jZW9mIEZhY3RLQikpIHtcbiAgICAgICAgICAgIHRoaXMuX2dlbmVyYXRvciA9IGZhY3RzLmNvcHkoKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMuX2dlbmVyYXRvciA9IChmYWN0cyBhcyBhbnkpLmdlbmVyYXRvcjsgLy8gISEhXG4gICAgICAgIH1cbiAgICAgICAgaWYgKGZhY3RzKSB7XG4gICAgICAgICAgICB0aGlzLmRlZHVjZV9hbGxfZmFjdHMoZmFjdHMpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgc3RkY2xvbmUoKSB7XG4gICAgICAgIHJldHVybiBuZXcgU3RkRmFjdEtCKHRoaXMpO1xuICAgIH1cblxuICAgIGdlbmVyYXRvcigpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX2dlbmVyYXRvci5jb3B5KCk7XG4gICAgfVxufVxuXG5leHBvcnQgZnVuY3Rpb24gYXNfcHJvcGVydHkoZmFjdDogYW55KSB7XG4gICAgcmV0dXJuIFwiaXNfXCIgKyBmYWN0O1xufVxuXG5leHBvcnQgZnVuY3Rpb24gbWFrZV9wcm9wZXJ0eShvYmo6IGFueSwgZmFjdDogYW55KSB7XG4gICAgLy8gY2hvb3NpbmcgdG8gcnVuIGdldGl0KCkgb24gbWFrZV9wcm9wZXJ0eSB0byBhZGQgY29uc2lzdGVuY3kgaW4gYWNjZXNzaW5nXG4gICAgLy8gcHJvcG9lcnRpZXMgb2Ygc3ltdHlwZSBvYmplY3RzLiB0aGlzIG1heSBzbG93IGRvd24gc3ltdHlwZSBzbGlnaHRseVxuICAgIGlmICghZmFjdC5pbmNsdWRlcyhcImlzX1wiKSkge1xuICAgICAgICBvYmpbYXNfcHJvcGVydHkoZmFjdCldID0gZ2V0aXRcbiAgICB9IGVsc2Uge1xuICAgICAgICBvYmpbZmFjdF0gPSBnZXRpdDtcbiAgICB9XG4gICAgZnVuY3Rpb24gZ2V0aXQoKSB7XG4gICAgICAgIGlmICh0eXBlb2Ygb2JqLl9hc3N1bXB0aW9uc1tmYWN0XSAhPT0gXCJ1bmRlZmluZWRcIikge1xuICAgICAgICAgICAgcmV0dXJuIG9iai5fYXNzdW1wdGlvbnMuZ2V0KGZhY3QpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuIF9hc2soZmFjdCwgb2JqKTtcbiAgICAgICAgfVxuICAgIH1cbn1cblxuXG4vLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tdW51c2VkLXZhcnNcbmZ1bmN0aW9uIF9hc2soZmFjdDogYW55LCBvYmo6IGFueSkge1xuICAgIC8qXG4gICAgRmluZCB0aGUgdHJ1dGggdmFsdWUgZm9yIGEgcHJvcGVydHkgb2YgYW4gb2JqZWN0LlxuICAgIFRoaXMgZnVuY3Rpb24gaXMgY2FsbGVkIHdoZW4gYSByZXF1ZXN0IGlzIG1hZGUgdG8gc2VlIHdoYXQgYSBmYWN0XG4gICAgdmFsdWUgaXMuXG4gICAgRm9yIHRoaXMgd2UgdXNlIHNldmVyYWwgdGVjaG5pcXVlczpcbiAgICBGaXJzdCwgdGhlIGZhY3QtZXZhbHVhdGlvbiBmdW5jdGlvbiBpcyB0cmllZCwgaWYgaXQgZXhpc3RzIChmb3JcbiAgICBleGFtcGxlIF9ldmFsX2lzX2ludGVnZXIpLiBUaGVuIHdlIHRyeSByZWxhdGVkIGZhY3RzLiBGb3IgZXhhbXBsZVxuICAgICAgICByYXRpb25hbCAgIC0tPiAgIGludGVnZXJcbiAgICBhbm90aGVyIGV4YW1wbGUgaXMgam9pbmVkIHJ1bGU6XG4gICAgICAgIGludGVnZXIgJiAhb2RkICAtLT4gZXZlblxuICAgIHNvIGluIHRoZSBsYXR0ZXIgY2FzZSBpZiB3ZSBhcmUgbG9va2luZyBhdCB3aGF0ICdldmVuJyB2YWx1ZSBpcyxcbiAgICAnaW50ZWdlcicgYW5kICdvZGQnIGZhY3RzIHdpbGwgYmUgYXNrZWQuXG4gICAgSW4gYWxsIGNhc2VzLCB3aGVuIHdlIHNldHRsZSBvbiBzb21lIGZhY3QgdmFsdWUsIGl0cyBpbXBsaWNhdGlvbnMgYXJlXG4gICAgZGVkdWNlZCwgYW5kIHRoZSByZXN1bHQgaXMgY2FjaGVkIGluIC5fYXNzdW1wdGlvbnMuXG4gICAgKi9cblxuICAgIC8vIEZhY3RLQiB3aGljaCBpcyBkaWN0LWxpa2UgYW5kIG1hcHMgZmFjdHMgdG8gdGhlaXIga25vd24gdmFsdWVzOlxuICAgIGNvbnN0IGFzc3VtcHRpb25zOiBTdGRGYWN0S0IgPSBvYmouX2Fzc3VtcHRpb25zO1xuXG4gICAgLy8gQSBkaWN0IHRoYXQgbWFwcyBmYWN0cyB0byB0aGVpciBoYW5kbGVyczpcbiAgICBjb25zdCBoYW5kbGVyX21hcDogSGFzaERpY3QgPSBvYmouX3Byb3BfaGFuZGxlcjtcblxuICAgIC8vIFRoaXMgaXMgb3VyIHF1ZXVlIG9mIGZhY3RzIHRvIGNoZWNrOlxuICAgIGNvbnN0IGZhY3RzX3RvX2NoZWNrID0gbmV3IEFycmF5KGZhY3QpO1xuICAgIGNvbnN0IGZhY3RzX3F1ZXVlZCA9IG5ldyBIYXNoU2V0KFtmYWN0XSk7XG5cbiAgICBjb25zdCBjbHMgPSBvYmouY29uc3RydWN0b3I7XG5cbiAgICBmb3IgKGNvbnN0IGZhY3RfaSBvZiBmYWN0c190b19jaGVjaykge1xuICAgICAgICBpZiAodHlwZW9mIGFzc3VtcHRpb25zLmdldChmYWN0X2kpICE9PSBcInVuZGVmaW5lZFwiKSB7XG4gICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgfSBlbHNlIGlmIChjbHNbYXNfcHJvcGVydHkoZmFjdCldKSB7XG4gICAgICAgICAgICByZXR1cm4gKGNsc1thc19wcm9wZXJ0eShmYWN0KV0pO1xuICAgICAgICB9XG4gICAgICAgIGxldCBmYWN0X2lfdmFsdWUgPSB1bmRlZmluZWQ7XG4gICAgICAgIGxldCBoYW5kbGVyX2kgPSBoYW5kbGVyX21hcC5nZXQoZmFjdF9pKTtcbiAgICAgICAgaWYgKHR5cGVvZiBoYW5kbGVyX2kgIT09IFwidW5kZWZpbmVkXCIpIHtcbiAgICAgICAgICAgIGZhY3RfaV92YWx1ZSA9IG9ialtoYW5kbGVyX2kubmFtZV0oKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICh0eXBlb2YgZmFjdF9pX3ZhbHVlICE9PSBcInVuZGVmaW5lZFwiKSB7XG4gICAgICAgICAgICBhc3N1bXB0aW9ucy5kZWR1Y2VfYWxsX2ZhY3RzKFtbZmFjdF9pLCBmYWN0X2lfdmFsdWVdXSk7XG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCBmYWN0X3ZhbHVlID0gYXNzdW1wdGlvbnMuZ2V0KGZhY3QpO1xuICAgICAgICBpZiAodHlwZW9mIGZhY3RfdmFsdWUgIT09IFwidW5kZWZpbmVkXCIpIHtcbiAgICAgICAgICAgIHJldHVybiBmYWN0X3ZhbHVlO1xuICAgICAgICB9XG4gICAgICAgIGNvbnN0IGZhY3RzZXQgPSBfYXNzdW1lX3J1bGVzLnByZXJlcS5nZXQoZmFjdF9pKS5kaWZmZXJlbmNlKGZhY3RzX3F1ZXVlZCk7XG4gICAgICAgIGlmIChmYWN0c2V0LnNpemUgIT09IDApIHtcbiAgICAgICAgICAgIGNvbnN0IG5ld19mYWN0c190b19jaGVjayA9IG5ldyBBcnJheShfYXNzdW1lX3J1bGVzLnByZXJlcS5nZXQoZmFjdF9pKS5kaWZmZXJlbmNlKGZhY3RzX3F1ZXVlZCkpO1xuICAgICAgICAgICAgVXRpbC5zaHVmZmxlQXJyYXkobmV3X2ZhY3RzX3RvX2NoZWNrKTtcbiAgICAgICAgICAgIGZhY3RzX3RvX2NoZWNrLnB1c2gobmV3X2ZhY3RzX3RvX2NoZWNrKTtcbiAgICAgICAgICAgIGZhY3RzX3RvX2NoZWNrLmZsYXQoKTtcbiAgICAgICAgICAgIGZhY3RzX3F1ZXVlZC5hZGRBcnIobmV3X2ZhY3RzX3RvX2NoZWNrKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgaWYgKGFzc3VtcHRpb25zLmhhcyhmYWN0KSkge1xuICAgICAgICByZXR1cm4gYXNzdW1wdGlvbnMuZ2V0KGZhY3QpO1xuICAgIH1cblxuICAgIGFzc3VtcHRpb25zLl90ZWxsKGZhY3QsIHVuZGVmaW5lZCk7XG4gICAgcmV0dXJuIHVuZGVmaW5lZDtcbn1cblxuXG5jbGFzcyBNYW5hZ2VkUHJvcGVydGllcyB7XG4gICAgc3RhdGljIGFsbF9leHBsaWNpdF9hc3N1bXB0aW9uczogSGFzaERpY3QgPSBuZXcgSGFzaERpY3QoKTtcbiAgICBzdGF0aWMgYWxsX2RlZmF1bHRfYXNzdW1wdGlvbnM6IEhhc2hTZXQgPSBuZXcgSGFzaFNldCgpO1xuXG5cbiAgICBzdGF0aWMgcmVnaXN0ZXIoY2xzOiBhbnkpIHtcbiAgICAgICAgLy8gcmVnaXN0ZXIgd2l0aCBCYXNpY01ldGEgKHJlY29yZCBjbGFzcyBuYW1lKVxuICAgICAgICBCYXNpY01ldGEucmVnaXN0ZXIoY2xzKTtcblxuICAgICAgICAvLyBGb3IgYWxsIHByb3BlcnRpZXMgd2Ugd2FudCB0byBkZWZpbmUsIGRldGVybWluZSBpZiB0aGV5IGFyZSBkZWZpbmVkXG4gICAgICAgIC8vIGJ5IHRoZSBjbGFzcyBvciBpZiB3ZSBzZXQgdGhlbSBhcyB1bmRlZmluZWQuXG4gICAgICAgIC8vIEFkZCB0aGVzZSBwcm9wZXJ0aWVzIHRvIGEgZGljdCBjYWxsZWQgbG9jYWxfZGVmc1xuICAgICAgICBjb25zdCBsb2NhbF9kZWZzID0gbmV3IEhhc2hEaWN0KCk7XG4gICAgICAgIGZvciAoY29uc3QgayBvZiBfYXNzdW1lX2RlZmluZWQudG9BcnJheSgpKSB7XG4gICAgICAgICAgICBjb25zdCBhdHRybmFtZSA9IGFzX3Byb3BlcnR5KGspO1xuICAgICAgICAgICAgaWYgKGF0dHJuYW1lIGluIGNscykge1xuICAgICAgICAgICAgICAgIGxldCB2ID0gY2xzW2F0dHJuYW1lXTtcbiAgICAgICAgICAgICAgICBpZiAoKHR5cGVvZiB2ID09PSBcIm51bWJlclwiICYmIE51bWJlci5pc0ludGVnZXIodikpIHx8IHR5cGVvZiB2ID09PSBcImJvb2xlYW5cIiB8fCB0eXBlb2YgdiA9PT0gXCJ1bmRlZmluZWRcIikge1xuICAgICAgICAgICAgICAgICAgICBpZiAodHlwZW9mIHYgIT09IFwidW5kZWZpbmVkXCIpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHYgPSAhIXY7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgbG9jYWxfZGVmcy5hZGQoYXR0cm5hbWUsIHYpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IGFsbF9kZWZzID0gbmV3IEhhc2hEaWN0KClcbiAgICAgICAgZm9yIChjb25zdCBiYXNlIG9mIFV0aWwuZ2V0U3VwZXJzKGNscykucmV2ZXJzZSgpKSB7XG4gICAgICAgICAgICBjb25zdCBhc3N1bXB0aW9ucyA9IGJhc2UuX2V4cGxpY2l0X2NsYXNzX2Fzc3VtcHRpb25zO1xuICAgICAgICAgICAgaWYgKHR5cGVvZiBhc3N1bXB0aW9ucyAhPT0gXCJ1bmRlZmluZWRcIikge1xuICAgICAgICAgICAgICAgIGFsbF9kZWZzLm1lcmdlKGFzc3VtcHRpb25zKVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgYWxsX2RlZnMubWVyZ2UobG9jYWxfZGVmcyk7XG5cbiAgICAgICAgLy8gU2V0IGNsYXNzIHByb3BlcnRpZXNcbiAgICAgICAgY2xzLl9leHBsaWNpdF9jbGFzc19hc3N1bXB0aW9ucyA9IGFsbF9kZWZzXG4gICAgICAgIGNscy5kZWZhdWx0X2Fzc3VtcHRpb25zID0gbmV3IFN0ZEZhY3RLQihhbGxfZGVmcyk7XG5cbiAgICAgICAgLy8gQWRkIGRlZmF1bHQgYXNzdW1wdGlvbnMgYXMgY2xhc3MgcHJvcGVydGllc1xuICAgICAgICBmb3IgKGNvbnN0IGl0ZW0gb2YgY2xzLmRlZmF1bHRfYXNzdW1wdGlvbnMuZW50cmllcygpKSB7XG4gICAgICAgICAgICBpZiAoaXRlbVswXS5pbmNsdWRlcyhcImlzXCIpKSB7XG4gICAgICAgICAgICAgICAgY2xzW2l0ZW1bMF1dID0gaXRlbVsxXTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgY2xzW2FzX3Byb3BlcnR5KGl0ZW1bMF0pXSA9IGl0ZW1bMV07XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICAvLyBDcmVhdGUgdHdvIHNldHM6IG9uZSBvZiB0aGUgZGVmYXVsdCBhc3N1bXB0aW9uIGtleXMgZm9yIHRoaXMgY2xhc3NcbiAgICAgICAgLy8gYW5vdGhlciBmb3IgdGhlIGJhc2UgY2xhc3Nlc1xuICAgICAgICBjb25zdCBzID0gbmV3IEhhc2hTZXQoKTtcbiAgICAgICAgcy5hZGRBcnIoY2xzLmRlZmF1bHRfYXNzdW1wdGlvbnMua2V5cygpKTtcblxuXG4gICAgICAgIGNvbnN0IGFsbGRlZnMgPSBuZXcgSGFzaFNldChPYmplY3QuZ2V0T3duUHJvcGVydHlOYW1lcyhjbHMpLmZpbHRlcihwcm9wID0+IHByb3AuaW5jbHVkZXMoXCJpc19cIikpKTtcbiAgICAgICAgZm9yIChjb25zdCBmYWN0IG9mIGFsbGRlZnMuZGlmZmVyZW5jZShjbHMuZGVmYXVsdF9hc3N1bXB0aW9ucykudG9BcnJheSgpKSB7XG4gICAgICAgICAgICBjbHMuZGVmYXVsdF9hc3N1bXB0aW9ucy5hZGQoZmFjdCwgY2xzW2ZhY3RdKTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIGdldCB0aGUgc3RhdGljIHZhcmlhYmxlcyBvZiBhbGwgc3VwZXJjbGFzc2VzIGFuZCBhc3NpZ24gdG8gY2xhc3NcbiAgICAgICAgLy8gbm90ZSB0aGF0IHdlIG9ubHkgYXNzaWduIHRoZSBwcm9wZXJ0aWVzIGlmIHRoZXkgYXJlIHVuZGVmaW5lZCBcbiAgICAgICAgY29uc3Qgc3VwZXJzOiBhbnlbXSA9IFV0aWwuZ2V0U3VwZXJzKGNscyk7XG4gICAgICAgIGZvciAoY29uc3Qgc3VwZXJjbHMgb2Ygc3VwZXJzKSB7XG4gICAgICAgICAgICBjb25zdCBhbGxQcm9wcyA9IG5ldyBIYXNoU2V0KE9iamVjdC5nZXRPd25Qcm9wZXJ0eU5hbWVzKHN1cGVyY2xzKS5maWx0ZXIocHJvcCA9PiBwcm9wLmluY2x1ZGVzKFwiaXNfXCIpKSk7XG4gICAgICAgICAgICBjb25zdCB1bmlxdWVQcm9wcyA9IGFsbFByb3BzLmRpZmZlcmVuY2UoY2xzLmRlZmF1bHRfYXNzdW1wdGlvbnMpLnRvQXJyYXkoKVxuICAgICAgICAgICAgZm9yIChjb25zdCBmYWN0IG9mIHVuaXF1ZVByb3BzKSB7XG4gICAgICAgICAgICAgICAgY2xzLmRlZmF1bHRfYXNzdW1wdGlvbnMuYWRkKGZhY3QsIHN1cGVyY2xzW2ZhY3RdKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cbn1cblxuZXhwb3J0IHtTdGRGYWN0S0IsIE1hbmFnZWRQcm9wZXJ0aWVzfTtcbiIsICIvKlxuTm90YWJsZSBjaGFuZ2VzIG1hZGUgKGFuZCBub3Rlcyk6XG4tIFZlcnkgYmFyZWJvbmVzIHZlcnNpb25zIG9mIGNsYXNzZXMgaW1wbGVtZW50ZWQgc28gZmFyXG4tIFNhbWUgcmVnaXN0cnkgc3lzdGVtIGFzIFNpbmdsZXRvbiAtIHVzaW5nIHN0YXRpYyBkaWN0aW9uYXJ5XG4qL1xuXG4vKiBlc2xpbnQtZGlzYWJsZSBuZXctY2FwICovXG5jbGFzcyBLaW5kUmVnaXN0cnkge1xuICAgIHN0YXRpYyByZWdpc3RyeTogUmVjb3JkPGFueSwgYW55PiA9IHt9O1xuXG4gICAgc3RhdGljIHJlZ2lzdGVyKG5hbWU6IHN0cmluZywgY2xzOiBhbnkpIHtcbiAgICAgICAgS2luZFJlZ2lzdHJ5LnJlZ2lzdHJ5W25hbWVdID0gbmV3IGNscygpO1xuICAgIH1cbn1cblxuY2xhc3MgS2luZCB7IC8vICEhISBtZXRhY2xhc3Mgc2l0dWF0aW9uXG4gICAgLypcbiAgICBCYXNlIGNsYXNzIGZvciBraW5kcy5cbiAgICBLaW5kIG9mIHRoZSBvYmplY3QgcmVwcmVzZW50cyB0aGUgbWF0aGVtYXRpY2FsIGNsYXNzaWZpY2F0aW9uIHRoYXRcbiAgICB0aGUgZW50aXR5IGZhbGxzIGludG8uIEl0IGlzIGV4cGVjdGVkIHRoYXQgZnVuY3Rpb25zIGFuZCBjbGFzc2VzXG4gICAgcmVjb2duaXplIGFuZCBmaWx0ZXIgdGhlIGFyZ3VtZW50IGJ5IGl0cyBraW5kLlxuICAgIEtpbmQgb2YgZXZlcnkgb2JqZWN0IG11c3QgYmUgY2FyZWZ1bGx5IHNlbGVjdGVkIHNvIHRoYXQgaXQgc2hvd3MgdGhlXG4gICAgaW50ZW50aW9uIG9mIGRlc2lnbi4gRXhwcmVzc2lvbnMgbWF5IGhhdmUgZGlmZmVyZW50IGtpbmQgYWNjb3JkaW5nXG4gICAgdG8gdGhlIGtpbmQgb2YgaXRzIGFyZ3VlbWVudHMuIEZvciBleGFtcGxlLCBhcmd1ZW1lbnRzIG9mIGBgQWRkYGBcbiAgICBtdXN0IGhhdmUgY29tbW9uIGtpbmQgc2luY2UgYWRkaXRpb24gaXMgZ3JvdXAgb3BlcmF0b3IsIGFuZCB0aGVcbiAgICByZXN1bHRpbmcgYGBBZGQoKWBgIGhhcyB0aGUgc2FtZSBraW5kLlxuICAgIEZvciB0aGUgcGVyZm9ybWFuY2UsIGVhY2gga2luZCBpcyBhcyBicm9hZCBhcyBwb3NzaWJsZSBhbmQgaXMgbm90XG4gICAgYmFzZWQgb24gc2V0IHRoZW9yeS4gRm9yIGV4YW1wbGUsIGBgTnVtYmVyS2luZGBgIGluY2x1ZGVzIG5vdCBvbmx5XG4gICAgY29tcGxleCBudW1iZXIgYnV0IGV4cHJlc3Npb24gY29udGFpbmluZyBgYFMuSW5maW5pdHlgYCBvciBgYFMuTmFOYGBcbiAgICB3aGljaCBhcmUgbm90IHN0cmljdGx5IG51bWJlci5cbiAgICBLaW5kIG1heSBoYXZlIGFyZ3VtZW50cyBhcyBwYXJhbWV0ZXIuIEZvciBleGFtcGxlLCBgYE1hdHJpeEtpbmQoKWBgXG4gICAgbWF5IGJlIGNvbnN0cnVjdGVkIHdpdGggb25lIGVsZW1lbnQgd2hpY2ggcmVwcmVzZW50cyB0aGUga2luZCBvZiBpdHNcbiAgICBlbGVtZW50cy5cbiAgICBgYEtpbmRgYCBiZWhhdmVzIGluIHNpbmdsZXRvbi1saWtlIGZhc2hpb24uIFNhbWUgc2lnbmF0dXJlIHdpbGxcbiAgICByZXR1cm4gdGhlIHNhbWUgb2JqZWN0LlxuICAgICovXG5cbiAgICBzdGF0aWMgbmV3KGNsczogYW55LCAuLi5hcmdzOiBhbnkpIHtcbiAgICAgICAgbGV0IGluc3Q7XG4gICAgICAgIGlmIChhcmdzIGluIEtpbmRSZWdpc3RyeS5yZWdpc3RyeSkge1xuICAgICAgICAgICAgaW5zdCA9IEtpbmRSZWdpc3RyeS5yZWdpc3RyeVthcmdzXTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIEtpbmRSZWdpc3RyeS5yZWdpc3RlcihjbHMubmFtZSwgY2xzKTtcbiAgICAgICAgICAgIGluc3QgPSBuZXcgY2xzKCk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGluc3Q7XG4gICAgfVxufVxuXG5jbGFzcyBfVW5kZWZpbmVkS2luZCBleHRlbmRzIEtpbmQge1xuICAgIC8qXG4gICAgRGVmYXVsdCBraW5kIGZvciBhbGwgU3ltUHkgb2JqZWN0LiBJZiB0aGUga2luZCBpcyBub3QgZGVmaW5lZCBmb3JcbiAgICB0aGUgb2JqZWN0LCBvciBpZiB0aGUgb2JqZWN0IGNhbm5vdCBpbmZlciB0aGUga2luZCBmcm9tIGl0c1xuICAgIGFyZ3VtZW50cywgdGhpcyB3aWxsIGJlIHJldHVybmVkLlxuICAgIEV4YW1wbGVzXG4gICAgPT09PT09PT1cbiAgICA+Pj4gZnJvbSBzeW1weSBpbXBvcnQgRXhwclxuICAgID4+PiBFeHByKCkua2luZFxuICAgIFVuZGVmaW5lZEtpbmRcbiAgICAqL1xuXG4gICAgY29uc3RydWN0b3IoKSB7XG4gICAgICAgIHN1cGVyKCk7XG4gICAgfVxuXG4gICAgc3RhdGljIG5ldygpIHtcbiAgICAgICAgcmV0dXJuIEtpbmQubmV3KF9VbmRlZmluZWRLaW5kKTtcbiAgICB9XG5cbiAgICB0b1N0cmluZygpIHtcbiAgICAgICAgcmV0dXJuIFwiVW5kZWZpbmVkS2luZFwiO1xuICAgIH1cbn1cblxuY29uc3QgVW5kZWZpbmVkS2luZCA9IF9VbmRlZmluZWRLaW5kLm5ldygpO1xuXG5jbGFzcyBfTnVtYmVyS2luZCBleHRlbmRzIEtpbmQge1xuICAgIC8qXG4gICAgS2luZCBmb3IgYWxsIG51bWVyaWMgb2JqZWN0LlxuICAgIFRoaXMga2luZCByZXByZXNlbnRzIGV2ZXJ5IG51bWJlciwgaW5jbHVkaW5nIGNvbXBsZXggbnVtYmVycyxcbiAgICBpbmZpbml0eSBhbmQgYGBTLk5hTmBgLiBPdGhlciBvYmplY3RzIHN1Y2ggYXMgcXVhdGVybmlvbnMgZG8gbm90XG4gICAgaGF2ZSB0aGlzIGtpbmQuXG4gICAgTW9zdCBgYEV4cHJgYCBhcmUgaW5pdGlhbGx5IGRlc2lnbmVkIHRvIHJlcHJlc2VudCB0aGUgbnVtYmVyLCBzb1xuICAgIHRoaXMgd2lsbCBiZSB0aGUgbW9zdCBjb21tb24ga2luZCBpbiBTeW1QeSBjb3JlLiBGb3IgZXhhbXBsZVxuICAgIGBgU3ltYm9sKClgYCwgd2hpY2ggcmVwcmVzZW50cyBhIHNjYWxhciwgaGFzIHRoaXMga2luZCBhcyBsb25nIGFzIGl0XG4gICAgaXMgY29tbXV0YXRpdmUuXG4gICAgTnVtYmVycyBmb3JtIGEgZmllbGQuIEFueSBvcGVyYXRpb24gYmV0d2VlbiBudW1iZXIta2luZCBvYmplY3RzIHdpbGxcbiAgICByZXN1bHQgdGhpcyBraW5kIGFzIHdlbGwuXG4gICAgRXhhbXBsZXNcbiAgICA9PT09PT09PVxuICAgID4+PiBmcm9tIHN5bXB5IGltcG9ydCBTLCBvbywgU3ltYm9sXG4gICAgPj4+IFMuT25lLmtpbmRcbiAgICBOdW1iZXJLaW5kXG4gICAgPj4+ICgtb28pLmtpbmRcbiAgICBOdW1iZXJLaW5kXG4gICAgPj4+IFMuTmFOLmtpbmRcbiAgICBOdW1iZXJLaW5kXG4gICAgQ29tbXV0YXRpdmUgc3ltYm9sIGFyZSB0cmVhdGVkIGFzIG51bWJlci5cbiAgICA+Pj4geCA9IFN5bWJvbCgneCcpXG4gICAgPj4+IHgua2luZFxuICAgIE51bWJlcktpbmRcbiAgICA+Pj4gU3ltYm9sKCd5JywgY29tbXV0YXRpdmU9RmFsc2UpLmtpbmRcbiAgICBVbmRlZmluZWRLaW5kXG4gICAgT3BlcmF0aW9uIGJldHdlZW4gbnVtYmVycyByZXN1bHRzIG51bWJlci5cbiAgICA+Pj4gKHgrMSkua2luZFxuICAgIE51bWJlcktpbmRcbiAgICBTZWUgQWxzb1xuICAgID09PT09PT09XG4gICAgc3ltcHkuY29yZS5leHByLkV4cHIuaXNfTnVtYmVyIDogY2hlY2sgaWYgdGhlIG9iamVjdCBpcyBzdHJpY3RseVxuICAgIHN1YmNsYXNzIG9mIGBgTnVtYmVyYGAgY2xhc3MuXG4gICAgc3ltcHkuY29yZS5leHByLkV4cHIuaXNfbnVtYmVyIDogY2hlY2sgaWYgdGhlIG9iamVjdCBpcyBudW1iZXJcbiAgICB3aXRob3V0IGFueSBmcmVlIHN5bWJvbC5cbiAgICAqL1xuXG4gICAgY29uc3RydWN0b3IoKSB7XG4gICAgICAgIHN1cGVyKCk7XG4gICAgfVxuXG4gICAgc3RhdGljIG5ldygpIHtcbiAgICAgICAgcmV0dXJuIEtpbmQubmV3KF9OdW1iZXJLaW5kKTtcbiAgICB9XG5cbiAgICB0b1N0cmluZygpIHtcbiAgICAgICAgcmV0dXJuIFwiTnVtYmVyS2luZFwiO1xuICAgIH1cbn1cblxuY29uc3QgTnVtYmVyS2luZCA9IF9OdW1iZXJLaW5kLm5ldygpO1xuXG5jbGFzcyBfQm9vbGVhbktpbmQgZXh0ZW5kcyBLaW5kIHtcbiAgICAvKlxuICAgIEtpbmQgZm9yIGJvb2xlYW4gb2JqZWN0cy5cbiAgICBTeW1QeSdzIGBgUy50cnVlYGAsIGBgUy5mYWxzZWBgLCBhbmQgYnVpbHQtaW4gYGBUcnVlYGAgYW5kIGBgRmFsc2VgYFxuICAgIGhhdmUgdGhpcyBraW5kLiBCb29sZWFuIG51bWJlciBgYDFgYCBhbmQgYGAwYGAgYXJlIG5vdCByZWxldmVudC5cbiAgICBFeGFtcGxlc1xuICAgID09PT09PT09XG4gICAgPj4+IGZyb20gc3ltcHkgaW1wb3J0IFMsIFFcbiAgICA+Pj4gUy50cnVlLmtpbmRcbiAgICBCb29sZWFuS2luZFxuICAgID4+PiBRLmV2ZW4oMykua2luZFxuICAgIEJvb2xlYW5LaW5kXG4gICAgKi9cblxuICAgIGNvbnN0cnVjdG9yKCkge1xuICAgICAgICBzdXBlcigpO1xuICAgIH1cblxuICAgIHN0YXRpYyBuZXcoKSB7XG4gICAgICAgIHJldHVybiBLaW5kLm5ldyhfQm9vbGVhbktpbmQpO1xuICAgIH1cblxuICAgIHRvU3RyaW5nKCkge1xuICAgICAgICByZXR1cm4gXCJCb29sZWFuS2luZFwiO1xuICAgIH1cbn1cblxuY29uc3QgQm9vbGVhbktpbmQgPSBfQm9vbGVhbktpbmQubmV3KCk7XG5cblxuZXhwb3J0IHtVbmRlZmluZWRLaW5kLCBOdW1iZXJLaW5kLCBCb29sZWFuS2luZH07XG4iLCAiY2xhc3MgcHJlb3JkZXJfdHJhdmVyc2FsIHtcbiAgICAvKlxuICAgIERvIGEgcHJlLW9yZGVyIHRyYXZlcnNhbCBvZiBhIHRyZWUuXG4gICAgVGhpcyBpdGVyYXRvciByZWN1cnNpdmVseSB5aWVsZHMgbm9kZXMgdGhhdCBpdCBoYXMgdmlzaXRlZCBpbiBhIHByZS1vcmRlclxuICAgIGZhc2hpb24uIFRoYXQgaXMsIGl0IHlpZWxkcyB0aGUgY3VycmVudCBub2RlIHRoZW4gZGVzY2VuZHMgdGhyb3VnaCB0aGVcbiAgICB0cmVlIGJyZWFkdGgtZmlyc3QgdG8geWllbGQgYWxsIG9mIGEgbm9kZSdzIGNoaWxkcmVuJ3MgcHJlLW9yZGVyXG4gICAgdHJhdmVyc2FsLlxuICAgIEZvciBhbiBleHByZXNzaW9uLCB0aGUgb3JkZXIgb2YgdGhlIHRyYXZlcnNhbCBkZXBlbmRzIG9uIHRoZSBvcmRlciBvZlxuICAgIC5hcmdzLCB3aGljaCBpbiBtYW55IGNhc2VzIGNhbiBiZSBhcmJpdHJhcnkuXG4gICAgUGFyYW1ldGVyc1xuICAgID09PT09PT09PT1cbiAgICBub2RlIDogU3ltUHkgZXhwcmVzc2lvblxuICAgICAgICBUaGUgZXhwcmVzc2lvbiB0byB0cmF2ZXJzZS5cbiAgICBrZXlzIDogKGRlZmF1bHQgTm9uZSkgc29ydCBrZXkocylcbiAgICAgICAgVGhlIGtleShzKSB1c2VkIHRvIHNvcnQgYXJncyBvZiBCYXNpYyBvYmplY3RzLiBXaGVuIE5vbmUsIGFyZ3Mgb2YgQmFzaWNcbiAgICAgICAgb2JqZWN0cyBhcmUgcHJvY2Vzc2VkIGluIGFyYml0cmFyeSBvcmRlci4gSWYga2V5IGlzIGRlZmluZWQsIGl0IHdpbGxcbiAgICAgICAgYmUgcGFzc2VkIGFsb25nIHRvIG9yZGVyZWQoKSBhcyB0aGUgb25seSBrZXkocykgdG8gdXNlIHRvIHNvcnQgdGhlXG4gICAgICAgIGFyZ3VtZW50czsgaWYgYGBrZXlgYCBpcyBzaW1wbHkgVHJ1ZSB0aGVuIHRoZSBkZWZhdWx0IGtleXMgb2Ygb3JkZXJlZFxuICAgICAgICB3aWxsIGJlIHVzZWQuXG4gICAgWWllbGRzXG4gICAgPT09PT09XG4gICAgc3VidHJlZSA6IFN5bVB5IGV4cHJlc3Npb25cbiAgICAgICAgQWxsIG9mIHRoZSBzdWJ0cmVlcyBpbiB0aGUgdHJlZS5cbiAgICBFeGFtcGxlc1xuICAgID09PT09PT09XG4gICAgPj4+IGZyb20gc3ltcHkgaW1wb3J0IHByZW9yZGVyX3RyYXZlcnNhbCwgc3ltYm9sc1xuICAgID4+PiB4LCB5LCB6ID0gc3ltYm9scygneCB5IHonKVxuICAgIFRoZSBub2RlcyBhcmUgcmV0dXJuZWQgaW4gdGhlIG9yZGVyIHRoYXQgdGhleSBhcmUgZW5jb3VudGVyZWQgdW5sZXNzIGtleVxuICAgIGlzIGdpdmVuOyBzaW1wbHkgcGFzc2luZyBrZXk9VHJ1ZSB3aWxsIGd1YXJhbnRlZSB0aGF0IHRoZSB0cmF2ZXJzYWwgaXNcbiAgICB1bmlxdWUuXG4gICAgPj4+IGxpc3QocHJlb3JkZXJfdHJhdmVyc2FsKCh4ICsgeSkqeiwga2V5cz1Ob25lKSkgIyBkb2N0ZXN0OiArU0tJUFxuICAgIFt6Kih4ICsgeSksIHosIHggKyB5LCB5LCB4XVxuICAgID4+PiBsaXN0KHByZW9yZGVyX3RyYXZlcnNhbCgoeCArIHkpKnosIGtleXM9VHJ1ZSkpXG4gICAgW3oqKHggKyB5KSwgeiwgeCArIHksIHgsIHldXG4gICAgKi9cblxuICAgIF9za2lwX2ZsYWc6IGFueTtcbiAgICBfcHQ6IGFueTtcbiAgICBjb25zdHJ1Y3Rvcihub2RlOiBhbnkpIHtcbiAgICAgICAgdGhpcy5fc2tpcF9mbGFnID0gZmFsc2U7XG4gICAgICAgIHRoaXMuX3B0ID0gdGhpcy5fcHJlb3JkZXJfdHJhdmVyc2FsKG5vZGUpO1xuICAgIH1cblxuICAgICogX3ByZW9yZGVyX3RyYXZlcnNhbChub2RlOiBhbnkpOiBhbnkge1xuICAgICAgICB5aWVsZCBub2RlO1xuICAgICAgICBpZiAodGhpcy5fc2tpcF9mbGFnKSB7XG4gICAgICAgICAgICB0aGlzLl9za2lwX2ZsYWcgPSBmYWxzZTtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICBpZiAobm9kZS5pbnN0YW5jZW9mQmFzaWMpIHtcbiAgICAgICAgICAgIGxldCBhcmdzO1xuICAgICAgICAgICAgaWYgKG5vZGUuX2FyZ3NldCkge1xuICAgICAgICAgICAgICAgIGFyZ3MgPSBub2RlLl9hcmdzZXQ7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGFyZ3MgPSBub2RlLl9hcmdzO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZm9yIChjb25zdCBhcmcgb2YgYXJncykge1xuICAgICAgICAgICAgICAgIGZvciAoY29uc3QgdmFsIG9mIHRoaXMuX3ByZW9yZGVyX3RyYXZlcnNhbChhcmcpKSB7XG4gICAgICAgICAgICAgICAgICAgIHlpZWxkIHZhbDtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSBpZiAoU3ltYm9sLml0ZXJhdG9yIGluIE9iamVjdChub2RlKSkge1xuICAgICAgICAgICAgZm9yIChjb25zdCBpdGVtIG9mIG5vZGUpIHtcbiAgICAgICAgICAgICAgICBmb3IgKGNvbnN0IHZhbCBvZiB0aGlzLl9wcmVvcmRlcl90cmF2ZXJzYWwoaXRlbSkpIHtcbiAgICAgICAgICAgICAgICAgICAgeWllbGQgdmFsO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgIGFzSXRlcigpIHtcbiAgICAgICAgY29uc3QgcmVzOiBhbnlbXSA9IFtdO1xuICAgICAgICBmb3IgKGNvbnN0IGl0ZW0gb2YgdGhpcy5fcHQpIHtcbiAgICAgICAgICAgIHJlcy5wdXNoKGl0ZW0pO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiByZXM7XG4gICAgfVxufVxuXG5leHBvcnQge3ByZW9yZGVyX3RyYXZlcnNhbH07XG4iLCAiLypcbk5vdGFibGUgY2hhbmdlcyBtYWRlIChhbmQgbm90ZXMpOlxuLSBCYXNpYyByZXdvcmtlZCB3aXRoIGNvbnN0cnVjdG9yIHN5c3RlbVxuLSBCYXNpYyBoYW5kbGVzIE9CSkVDVCBwcm9wZXJ0aWVzLCBNYW5hZ2VkUHJvcGVydGllcyBoYW5kbGVzIENMQVNTIHByb3BlcnRpZXNcbi0gX2V2YWxfaXMgcHJvcGVydGllcyAoZGVwZW5kZW50IG9uIG9iamVjdCkgYXJlIG5vdyBhc3NpZ25lZCBpbiBCYXNpY1xuLSBTb21lIHByb3BlcnRpZXMgb2YgQmFzaWMgKGFuZCBzdWJjbGFzc2VzKSBhcmUgc3RhdGljXG4qL1xuXG5pbXBvcnQge2FzX3Byb3BlcnR5LCBtYWtlX3Byb3BlcnR5LCBNYW5hZ2VkUHJvcGVydGllcywgX2Fzc3VtZV9kZWZpbmVkLCBTdGRGYWN0S0J9IGZyb20gXCIuL2Fzc3VtcHRpb25zXCI7XG5pbXBvcnQge1V0aWwsIEhhc2hEaWN0LCBtaXgsIGJhc2UsIEhhc2hTZXR9IGZyb20gXCIuL3V0aWxpdHlcIjtcbmltcG9ydCB7VW5kZWZpbmVkS2luZH0gZnJvbSBcIi4va2luZFwiO1xuaW1wb3J0IHtwcmVvcmRlcl90cmF2ZXJzYWx9IGZyb20gXCIuL3RyYXZlcnNhbFwiO1xuXG5cbmNvbnN0IF9CYXNpYyA9IChzdXBlcmNsYXNzOiBhbnkpID0+IGNsYXNzIF9CYXNpYyBleHRlbmRzIHN1cGVyY2xhc3Mge1xuICAgIC8qXG4gICAgQmFzZSBjbGFzcyBmb3IgYWxsIFN5bVB5IG9iamVjdHMuXG4gICAgTm90ZXMgYW5kIGNvbnZlbnRpb25zXG4gICAgPT09PT09PT09PT09PT09PT09PT09XG4gICAgMSkgQWx3YXlzIHVzZSBgYC5hcmdzYGAsIHdoZW4gYWNjZXNzaW5nIHBhcmFtZXRlcnMgb2Ygc29tZSBpbnN0YW5jZTpcbiAgICA+Pj4gZnJvbSBzeW1weSBpbXBvcnQgY290XG4gICAgPj4+IGZyb20gc3ltcHkuYWJjIGltcG9ydCB4LCB5XG4gICAgPj4+IGNvdCh4KS5hcmdzXG4gICAgKHgsKVxuICAgID4+PiBjb3QoeCkuYXJnc1swXVxuICAgIHhcbiAgICA+Pj4gKHgqeSkuYXJnc1xuICAgICh4LCB5KVxuICAgID4+PiAoeCp5KS5hcmdzWzFdXG4gICAgeVxuICAgIDIpIE5ldmVyIHVzZSBpbnRlcm5hbCBtZXRob2RzIG9yIHZhcmlhYmxlcyAodGhlIG9uZXMgcHJlZml4ZWQgd2l0aCBgYF9gYCk6XG4gICAgPj4+IGNvdCh4KS5fYXJncyAgICAjIGRvIG5vdCB1c2UgdGhpcywgdXNlIGNvdCh4KS5hcmdzIGluc3RlYWRcbiAgICAoeCwpXG4gICAgMykgIEJ5IFwiU3ltUHkgb2JqZWN0XCIgd2UgbWVhbiBzb21ldGhpbmcgdGhhdCBjYW4gYmUgcmV0dXJuZWQgYnlcbiAgICAgICAgYGBzeW1waWZ5YGAuICBCdXQgbm90IGFsbCBvYmplY3RzIG9uZSBlbmNvdW50ZXJzIHVzaW5nIFN5bVB5IGFyZVxuICAgICAgICBzdWJjbGFzc2VzIG9mIEJhc2ljLiAgRm9yIGV4YW1wbGUsIG11dGFibGUgb2JqZWN0cyBhcmUgbm90OlxuICAgICAgICA+Pj4gZnJvbSBzeW1weSBpbXBvcnQgQmFzaWMsIE1hdHJpeCwgc3ltcGlmeVxuICAgICAgICA+Pj4gQSA9IE1hdHJpeChbWzEsIDJdLCBbMywgNF1dKS5hc19tdXRhYmxlKClcbiAgICAgICAgPj4+IGlzaW5zdGFuY2UoQSwgQmFzaWMpXG4gICAgICAgIEZhbHNlXG4gICAgICAgID4+PiBCID0gc3ltcGlmeShBKVxuICAgICAgICA+Pj4gaXNpbnN0YW5jZShCLCBCYXNpYylcbiAgICAgICAgVHJ1ZVxuICAgICovXG5cbiAgICBfX3Nsb3RzX18gPSBbXCJfbWhhc2hcIiwgXCJfYXJnc1wiLCBcIl9hc3N1bXB0aW9uc1wiXTtcbiAgICBfYXJnczogYW55W107XG4gICAgX21oYXNoOiBOdW1iZXIgfCB1bmRlZmluZWQ7XG4gICAgX2Fzc3VtcHRpb25zOiBTdGRGYWN0S0I7XG5cbiAgICAvLyBUbyBiZSBvdmVycmlkZGVuIHdpdGggVHJ1ZSBpbiB0aGUgYXBwcm9wcmlhdGUgc3ViY2xhc3Nlc1xuICAgIHN0YXRpYyBpc19udW1iZXIgPSBmYWxzZTtcbiAgICBzdGF0aWMgaXNfQXRvbSA9IGZhbHNlO1xuICAgIHN0YXRpYyBpc19TeW1ib2wgPSBmYWxzZTtcbiAgICBzdGF0aWMgaXNfc3ltYm9sID0gZmFsc2U7XG4gICAgc3RhdGljIGlzX0luZGV4ZWQgPSBmYWxzZTtcbiAgICBzdGF0aWMgaXNfRHVtbXkgPSBmYWxzZTtcbiAgICBzdGF0aWMgaXNfV2lsZCA9IGZhbHNlO1xuICAgIHN0YXRpYyBpc19GdW5jdGlvbiA9IGZhbHNlO1xuICAgIHN0YXRpYyBpc19BZGQgPSBmYWxzZTtcbiAgICBzdGF0aWMgaXNfTXVsID0gZmFsc2U7XG4gICAgc3RhdGljIGlzX1BvdyA9IGZhbHNlO1xuICAgIHN0YXRpYyBpc19OdW1iZXIgPSBmYWxzZTtcbiAgICBzdGF0aWMgaXNfRmxvYXQgPSBmYWxzZTtcbiAgICBzdGF0aWMgaXNfUmF0aW9uYWwgPSBmYWxzZTtcbiAgICBzdGF0aWMgaXNfSW50ZWdlciA9IGZhbHNlO1xuICAgIHN0YXRpYyBpc19OdW1iZXJTeW1ib2wgPSBmYWxzZTtcbiAgICBzdGF0aWMgaXNfT3JkZXIgPSBmYWxzZTtcbiAgICBzdGF0aWMgaXNfRGVyaXZhdGl2ZSA9IGZhbHNlO1xuICAgIHN0YXRpYyBpc19QaWVjZXdpc2UgPSBmYWxzZTtcbiAgICBzdGF0aWMgaXNfUG9seSA9IGZhbHNlO1xuICAgIHN0YXRpYyBpc19BbGdlYnJhaWNOdW1iZXIgPSBmYWxzZTtcbiAgICBzdGF0aWMgaXNfUmVsYXRpb25hbCA9IGZhbHNlO1xuICAgIHN0YXRpYyBpc19FcXVhbGl0eSA9IGZhbHNlO1xuICAgIHN0YXRpYyBpc19Cb29sZWFuID0gZmFsc2U7XG4gICAgc3RhdGljIGlzX05vdCA9IGZhbHNlO1xuICAgIHN0YXRpYyBpc19NYXRyaXggPSBmYWxzZTtcbiAgICBzdGF0aWMgaXNfVmVjdG9yID0gZmFsc2U7XG4gICAgc3RhdGljIGlzX1BvaW50ID0gZmFsc2U7XG4gICAgc3RhdGljIGlzX01hdEFkZCA9IGZhbHNlO1xuICAgIHN0YXRpYyBpc19NYXRNdWwgPSBmYWxzZTtcbiAgICBzdGF0aWMgaXNfbmVnYXRpdmU6IGJvb2xlYW4gfCB1bmRlZmluZWQ7XG4gICAgc3RhdGljIGlzX2NvbW11dGF0aXZlOiBib29sZWFuIHwgdW5kZWZpbmVkO1xuXG4gICAgc3RhdGljIGtpbmQgPSBVbmRlZmluZWRLaW5kO1xuICAgIHN0YXRpYyBhbGxfdW5pcXVlX3Byb3BzOiBIYXNoU2V0ID0gbmV3IEhhc2hTZXQoKTtcblxuICAgIGNvbnN0cnVjdG9yKC4uLmFyZ3M6IGFueSkge1xuICAgICAgICBzdXBlcigpO1xuICAgICAgICBjb25zdCBjbHM6IGFueSA9IHRoaXMuY29uc3RydWN0b3I7XG4gICAgICAgIHRoaXMuX2Fzc3VtcHRpb25zID0gY2xzLmRlZmF1bHRfYXNzdW1wdGlvbnMuc3RkY2xvbmUoKTtcbiAgICAgICAgdGhpcy5fbWhhc2ggPSB1bmRlZmluZWQ7XG4gICAgICAgIHRoaXMuX2FyZ3MgPSBhcmdzO1xuICAgICAgICB0aGlzLmFzc2lnblByb3BzKCk7XG4gICAgfVxuXG4gICAgYXNzaWduUHJvcHMoKSB7XG4gICAgICAgIGNvbnN0IGNsczogYW55ID0gdGhpcy5jb25zdHJ1Y3RvcjtcbiAgICAgICAgLy8gQ3JlYXRlIGEgZGljdGlvbmFyeSB0byBoYW5kbGUgdGhlIGN1cnJlbnQgcHJvcGVydGllcyBvZiB0aGUgY2xhc3NcbiAgICAgICAgLy8gT25seSBldnVhdGVkIG9uY2UgcGVyIGNsYXNzXG4gICAgICAgIGlmICh0eXBlb2YgY2xzLl9wcm9wX2hhbmRsZXIgPT09IFwidW5kZWZpbmVkXCIpIHtcbiAgICAgICAgICAgIGNscy5fcHJvcF9oYW5kbGVyID0gbmV3IEhhc2hEaWN0KCk7XG4gICAgICAgICAgICBmb3IgKGNvbnN0IGsgb2YgX2Fzc3VtZV9kZWZpbmVkLnRvQXJyYXkoKSkge1xuICAgICAgICAgICAgICAgIGNvbnN0IG1ldGgxID0gXCJfZXZhbF9pc19cIiArIGs7XG4gICAgICAgICAgICAgICAgaWYgKHRoaXNbbWV0aDFdKSB7XG4gICAgICAgICAgICAgICAgICAgIGNscy5fcHJvcF9oYW5kbGVyLmFkZChrLCB0aGlzW21ldGgxXSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIC8vIEFkZCBhbGwgZGVmaW5lZCBwcm9wZXJ0aWVzIGZyb20gYXNzdW1lIGRlZmluZWRcbiAgICAgICAgdGhpcy5fcHJvcF9oYW5kbGVyID0gY2xzLl9wcm9wX2hhbmRsZXIuY29weSgpO1xuICAgICAgICBmb3IgKGNvbnN0IGZhY3Qgb2YgX2Fzc3VtZV9kZWZpbmVkLnRvQXJyYXkoKSkge1xuICAgICAgICAgICAgbWFrZV9wcm9wZXJ0eSh0aGlzLCBmYWN0KTtcbiAgICAgICAgfVxuICAgICAgICAvLyBBZGQgcmVtYWluaW5nIHByb3BlcnRpZXMgZnJvbSBkZWZhdWx0IGFzc3VtcHRpb25zXG4gICAgICAgIGZvciAoY29uc3QgZmFjdCBvZiB0aGlzLl9hc3N1bXB0aW9ucy5rZXlzKCkpIHtcbiAgICAgICAgICAgIG1ha2VfcHJvcGVydHkodGhpcywgZmFjdCk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBfX2dldG5ld2FyZ3NfXygpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX2FyZ3M7XG4gICAgfVxuXG4gICAgX19nZXRzdGF0ZV9fKCk6IGFueSB7XG4gICAgICAgIHJldHVybiB1bmRlZmluZWQ7XG4gICAgfVxuXG4gICAgaGFzaCgpIHtcbiAgICAgICAgaWYgKHR5cGVvZiB0aGlzLl9taGFzaCA9PT0gXCJ1bmRlZmluZWRcIikge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuY29uc3RydWN0b3IubmFtZSArIHRoaXMuaGFzaEtleSgpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0aGlzLl9taGFzaDtcbiAgICB9XG5cbiAgICAvLyBiYW5kYWlkIHNvbHV0aW9uIGZvciBpbnN0YW5jZW9mIGlzc3VlIC0gc3RpbGwgbmVlZCB0byBmaXhcbiAgICBpbnN0YW5jZW9mQmFzaWMoKSB7XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cblxuICAgIGFzc3VtcHRpb25zMCgpIHtcbiAgICAgICAgLypcbiAgICAgICAgUmV0dXJuIG9iamVjdCBgdHlwZWAgYXNzdW1wdGlvbnMuXG4gICAgICAgIEZvciBleGFtcGxlOlxuICAgICAgICAgIFN5bWJvbCgneCcsIHJlYWw9VHJ1ZSlcbiAgICAgICAgICBTeW1ib2woJ3gnLCBpbnRlZ2VyPVRydWUpXG4gICAgICAgIGFyZSBkaWZmZXJlbnQgb2JqZWN0cy4gSW4gb3RoZXIgd29yZHMsIGJlc2lkZXMgUHl0aG9uIHR5cGUgKFN5bWJvbCBpblxuICAgICAgICB0aGlzIGNhc2UpLCB0aGUgaW5pdGlhbCBhc3N1bXB0aW9ucyBhcmUgYWxzbyBmb3JtaW5nIHRoZWlyIHR5cGVpbmZvLlxuICAgICAgICBFeGFtcGxlc1xuICAgICAgICA9PT09PT09PVxuICAgICAgICA+Pj4gZnJvbSBzeW1weSBpbXBvcnQgU3ltYm9sXG4gICAgICAgID4+PiBmcm9tIHN5bXB5LmFiYyBpbXBvcnQgeFxuICAgICAgICA+Pj4geC5hc3N1bXB0aW9uczBcbiAgICAgICAgeydjb21tdXRhdGl2ZSc6IFRydWV9XG4gICAgICAgID4+PiB4ID0gU3ltYm9sKFwieFwiLCBwb3NpdGl2ZT1UcnVlKVxuICAgICAgICA+Pj4geC5hc3N1bXB0aW9uczBcbiAgICAgICAgeydjb21tdXRhdGl2ZSc6IFRydWUsICdjb21wbGV4JzogVHJ1ZSwgJ2V4dGVuZGVkX25lZ2F0aXZlJzogRmFsc2UsXG4gICAgICAgICAnZXh0ZW5kZWRfbm9ubmVnYXRpdmUnOiBUcnVlLCAnZXh0ZW5kZWRfbm9ucG9zaXRpdmUnOiBGYWxzZSxcbiAgICAgICAgICdleHRlbmRlZF9ub256ZXJvJzogVHJ1ZSwgJ2V4dGVuZGVkX3Bvc2l0aXZlJzogVHJ1ZSwgJ2V4dGVuZGVkX3JlYWwnOlxuICAgICAgICAgVHJ1ZSwgJ2Zpbml0ZSc6IFRydWUsICdoZXJtaXRpYW4nOiBUcnVlLCAnaW1hZ2luYXJ5JzogRmFsc2UsXG4gICAgICAgICAnaW5maW5pdGUnOiBGYWxzZSwgJ25lZ2F0aXZlJzogRmFsc2UsICdub25uZWdhdGl2ZSc6IFRydWUsXG4gICAgICAgICAnbm9ucG9zaXRpdmUnOiBGYWxzZSwgJ25vbnplcm8nOiBUcnVlLCAncG9zaXRpdmUnOiBUcnVlLCAncmVhbCc6XG4gICAgICAgICBUcnVlLCAnemVybyc6IEZhbHNlfVxuICAgICAgICAqL1xuICAgICAgICByZXR1cm4ge307XG4gICAgfVxuXG4gICAgaGFzaEtleSgpIHtcbiAgICAgICAgLyogUmV0dXJuIGEgdHVwbGUgb2YgaW5mb3JtYXRpb24gYWJvdXQgc2VsZiB0aGF0IGNhbiBiZSB1c2VkIHRvXG4gICAgICAgIGNvbXB1dGUgdGhlIGhhc2guIElmIGEgY2xhc3MgZGVmaW5lcyBhZGRpdGlvbmFsIGF0dHJpYnV0ZXMsXG4gICAgICAgIGxpa2UgYGBuYW1lYGAgaW4gU3ltYm9sLCB0aGVuIHRoaXMgbWV0aG9kIHNob3VsZCBiZSB1cGRhdGVkXG4gICAgICAgIGFjY29yZGluZ2x5IHRvIHJldHVybiBzdWNoIHJlbGV2YW50IGF0dHJpYnV0ZXMuXG4gICAgICAgIERlZmluaW5nIG1vcmUgdGhhbiBfaGFzaGFibGVfY29udGVudCBpcyBuZWNlc3NhcnkgaWYgX19lcV9fIGhhc1xuICAgICAgICBiZWVuIGRlZmluZWQgYnkgYSBjbGFzcy4gU2VlIG5vdGUgYWJvdXQgdGhpcyBpbiBCYXNpYy5fX2VxX18uKi9cblxuICAgICAgICByZXR1cm4gdGhpcy5fYXJncztcbiAgICB9XG5cbiAgICBzdGF0aWMgY21wKHNlbGY6IGFueSwgb3RoZXI6IGFueSk6IGFueSB7XG4gICAgICAgIC8qXG4gICAgICAgIFJldHVybiAtMSwgMCwgMSBpZiB0aGUgb2JqZWN0IGlzIHNtYWxsZXIsIGVxdWFsLCBvciBncmVhdGVyIHRoYW4gb3RoZXIuXG4gICAgICAgIE5vdCBpbiB0aGUgbWF0aGVtYXRpY2FsIHNlbnNlLiBJZiB0aGUgb2JqZWN0IGlzIG9mIGEgZGlmZmVyZW50IHR5cGVcbiAgICAgICAgZnJvbSB0aGUgXCJvdGhlclwiIHRoZW4gdGhlaXIgY2xhc3NlcyBhcmUgb3JkZXJlZCBhY2NvcmRpbmcgdG9cbiAgICAgICAgdGhlIHNvcnRlZF9jbGFzc2VzIGxpc3QuXG4gICAgICAgIEV4YW1wbGVzXG4gICAgICAgID09PT09PT09XG4gICAgICAgID4+PiBmcm9tIHN5bXB5LmFiYyBpbXBvcnQgeCwgeVxuICAgICAgICA+Pj4geC5jb21wYXJlKHkpXG4gICAgICAgIC0xXG4gICAgICAgID4+PiB4LmNvbXBhcmUoeClcbiAgICAgICAgMFxuICAgICAgICA+Pj4geS5jb21wYXJlKHgpXG4gICAgICAgIDFcbiAgICAgICAgKi9cbiAgICAgICAgaWYgKHNlbGYgPT09IG90aGVyKSB7XG4gICAgICAgICAgICByZXR1cm4gMDtcbiAgICAgICAgfVxuICAgICAgICBjb25zdCBuMSA9IHNlbGYuY29uc3RydWN0b3IubmFtZTtcbiAgICAgICAgY29uc3QgbjIgPSBvdGhlci5jb25zdHJ1Y3Rvci5uYW1lO1xuICAgICAgICBpZiAobjEgJiYgbjIpIHtcbiAgICAgICAgICAgIHJldHVybiAobjEgPiBuMiBhcyB1bmtub3duIGFzIG51bWJlcikgLSAobjEgPCBuMiBhcyB1bmtub3duIGFzIG51bWJlcik7XG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCBzdCA9IHNlbGYuX2hhc2hhYmxlX2NvbnRlbnQoKTtcbiAgICAgICAgY29uc3Qgb3QgPSBvdGhlci5faGFzaGFibGVfY29udGVudCgpO1xuICAgICAgICBpZiAoc3QgJiYgb3QpIHtcbiAgICAgICAgICAgIHJldHVybiAoc3QubGVuZ3RoID4gb3QubGVuZ3RoIGFzIHVua25vd24gYXMgbnVtYmVyKSAtIChzdC5sZW5ndGggPCBvdC5sZW5ndGggYXMgdW5rbm93biBhcyBudW1iZXIpO1xuICAgICAgICB9XG4gICAgICAgIGZvciAoY29uc3QgZWxlbSBvZiBVdGlsLnppcChzdCwgb3QpKSB7XG4gICAgICAgICAgICBjb25zdCBsID0gZWxlbVswXTtcbiAgICAgICAgICAgIGNvbnN0IHIgPSBlbGVtWzFdO1xuICAgICAgICAgICAgLy8gISEhIHNraXBwaW5nIGZyb3plbnNldCBzdHVmZlxuICAgICAgICAgICAgbGV0IGM7XG4gICAgICAgICAgICBpZiAobCBpbnN0YW5jZW9mIEJhc2ljKSB7XG4gICAgICAgICAgICAgICAgYyA9IGwuY21wKHIpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBjID0gKGwgPiByIGFzIHVua25vd24gYXMgbnVtYmVyKSAtIChsIDwgciBhcyB1bmtub3duIGFzIG51bWJlcik7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoYykge1xuICAgICAgICAgICAgICAgIHJldHVybiBjO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiAwO1xuICAgIH1cblxuICAgIF9jb25zdHJ1Y3Rvcl9wb3N0cHJvY2Vzc29yX21hcHBpbmc6IFJlY29yZDxhbnksIGFueT4gPSB7fTtcblxuICAgIF9leGVjX2NvbnN0cnVjdG9yX3Bvc3Rwcm9jZXNzb3JzKG9iajogYW55KSB7XG4gICAgICAgIGNvbnN0IGNsc25hbWUgPSB0aGlzLmNvbnN0cnVjdG9yLm5hbWU7XG4gICAgICAgIGNvbnN0IHBvc3Rwcm9jZXNzb3JzID0gbmV3IEhhc2hEaWN0KCk7XG4gICAgICAgIC8vICEhISBmb3IgbG9vcCBub3QgaW1wbGVtZW50ZWQgLSBjb21wbGljYXRlZCB0byByZWNyZWF0ZVxuICAgICAgICBmb3IgKGNvbnN0IGYgb2YgcG9zdHByb2Nlc3NvcnMuZ2V0KGNsc25hbWUsIFtdKSkge1xuICAgICAgICAgICAgb2JqID0gZihvYmopO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBvYmo7XG4gICAgfVxuXG4gICAgX2V2YWxfc3VicyhvbGQ6IGFueSwgX25ldzogYW55KTogYW55IHtcbiAgICAgICAgLy8gZG9uJ3QgbmVlZCBhbnkgb3RoZXIgdXRpbGl0aWVzIHVudGlsIHdlIGRvIG1vcmUgY29tcGxpY2F0ZWQgc3Vic1xuICAgICAgICByZXR1cm4gdW5kZWZpbmVkO1xuICAgIH1cblxuICAgIF9hcmVzYW1lKGE6IGFueSwgYjogYW55KSB7XG4gICAgICAgIGlmIChhLmlzX051bWJlciAmJiBiLmlzX051bWJlcikge1xuICAgICAgICAgICAgcmV0dXJuIGEgPT09IGIgJiYgYS5jb25zdHJ1Y3Rvci5uYW1lID09PSBiLmNvbnN0cnVjdG9yLm5hbWU7XG4gICAgICAgIH1cbiAgICAgICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5ldy1jYXBcbiAgICAgICAgZm9yIChjb25zdCBpdGVtIG9mIFV0aWwuemlwKG5ldyBwcmVvcmRlcl90cmF2ZXJzYWwoYSkuYXNJdGVyKCksIG5ldyBwcmVvcmRlcl90cmF2ZXJzYWwoYikuYXNJdGVyKCkpKSB7XG4gICAgICAgICAgICBjb25zdCBpID0gaXRlbVswXTtcbiAgICAgICAgICAgIGNvbnN0IGogPSBpdGVtWzFdO1xuICAgICAgICAgICAgaWYgKGkgIT09IGogfHwgdHlwZW9mIGkgIT09IHR5cGVvZiBqKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cblxuICAgIHN1YnMoLi4uYXJnczogYW55KSB7XG4gICAgICAgIGxldCBzZXF1ZW5jZTtcbiAgICAgICAgaWYgKGFyZ3MubGVuZ3RoID09PSAxKSB7XG4gICAgICAgICAgICBzZXF1ZW5jZSA9IGFyZ3NbMF07XG4gICAgICAgICAgICBpZiAoc2VxdWVuY2UgaW5zdGFuY2VvZiBIYXNoU2V0KSB7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKHNlcXVlbmNlIGluc3RhbmNlb2YgSGFzaERpY3QpIHtcbiAgICAgICAgICAgICAgICBzZXF1ZW5jZSA9IHNlcXVlbmNlLmVudHJpZXMoKTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoU3ltYm9sLml0ZXJhdG9yIGluIE9iamVjdChzZXF1ZW5jZSkpIHtcbiAgICAgICAgICAgICAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbWF4LWxlblxuICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcIldoZW4gYSBzaW5nbGUgYXJndW1lbnQgaXMgcGFzc2VkIHRvIHN1YnMgaXQgc2hvdWxkIGJlIGEgZGljdGlvbmFyeSBvZiBvbGQ6IG5ldyBwYWlycyBvciBhbiBpdGVyYWJsZSBvZiAob2xkLCBuZXcpIHR1cGxlc1wiKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIGlmIChhcmdzLmxlbmd0aCA9PT0gMikge1xuICAgICAgICAgICAgc2VxdWVuY2UgPSBbYXJnc107XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJzdWIgYWNjZXB0cyAxIG9yIDIgYXJnc1wiKTtcbiAgICAgICAgfVxuICAgICAgICBsZXQgcnYgPSB0aGlzO1xuICAgICAgICBmb3IgKGNvbnN0IGl0ZW0gb2Ygc2VxdWVuY2UpIHtcbiAgICAgICAgICAgIGNvbnN0IG9sZCA9IGl0ZW1bMF07XG4gICAgICAgICAgICBjb25zdCBfbmV3ID0gaXRlbVsxXTtcbiAgICAgICAgICAgIHJ2ID0gcnYuX3N1YnMob2xkLCBfbmV3KTtcbiAgICAgICAgICAgIGlmICghKHJ2IGluc3RhbmNlb2YgQmFzaWMpKSB7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHJ2O1xuICAgIH1cblxuICAgIF9zdWJzKG9sZDogYW55LCBfbmV3OiBhbnkpIHtcbiAgICAgICAgZnVuY3Rpb24gZmFsbGJhY2soY2xzOiBhbnksIG9sZDogYW55LCBfbmV3OiBhbnkpIHtcbiAgICAgICAgICAgIGxldCBoaXQgPSBmYWxzZTtcbiAgICAgICAgICAgIGNvbnN0IGFyZ3MgPSBjbHMuX2FyZ3M7XG4gICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGFyZ3MubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgICBsZXQgYXJnID0gYXJnc1tpXTtcbiAgICAgICAgICAgICAgICBpZiAoIShhcmcuX2V2YWxfc3VicykpIHtcbiAgICAgICAgICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGFyZyA9IGFyZy5fc3VicyhvbGQsIF9uZXcpO1xuICAgICAgICAgICAgICAgIGlmICghKGNscy5fYXJlc2FtZShhcmcsIGFyZ3NbaV0pKSkge1xuICAgICAgICAgICAgICAgICAgICBoaXQgPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICBhcmdzW2ldID0gYXJnO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChoaXQpIHtcbiAgICAgICAgICAgICAgICBsZXQgcnY7XG4gICAgICAgICAgICAgICAgaWYgKGNscy5jb25zdHJ1Y3Rvci5uYW1lID09PSBcIk11bFwiIHx8IGNscy5jb25zdHJ1Y3Rvci5uYW1lID09PSBcIkFkZFwiKSB7XG4gICAgICAgICAgICAgICAgICAgIHJ2ID0gbmV3IGNscy5jb25zdHJ1Y3Rvcih0cnVlLCB0cnVlLCAuLi5hcmdzKTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBydiA9IG5ldyBjbHMuY29uc3RydWN0b3IoLi4uYXJncyk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHJldHVybiBydjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiBjbHM7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHRoaXMuX2FyZXNhbWUodGhpcywgb2xkKSkge1xuICAgICAgICAgICAgcmV0dXJuIF9uZXc7XG4gICAgICAgIH1cblxuICAgICAgICBsZXQgcnYgPSB0aGlzLl9ldmFsX3N1YnMob2xkLCBfbmV3KTtcbiAgICAgICAgaWYgKHR5cGVvZiBydiA9PT0gXCJ1bmRlZmluZWRcIikge1xuICAgICAgICAgICAgcnYgPSBmYWxsYmFjayh0aGlzLCBvbGQsIF9uZXcpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBydjtcbiAgICB9XG59O1xuXG4vLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbmV3LWNhcFxuY29uc3QgQmFzaWMgPSBfQmFzaWMoT2JqZWN0KTtcbk1hbmFnZWRQcm9wZXJ0aWVzLnJlZ2lzdGVyKEJhc2ljKTtcblxuY29uc3QgQXRvbSA9IChzdXBlcmNsYXNzOiBhbnkpID0+IGNsYXNzIEF0b20gZXh0ZW5kcyBtaXgoYmFzZSkud2l0aChfQmFzaWMpIHtcbiAgICAvKlxuICAgIEEgcGFyZW50IGNsYXNzIGZvciBhdG9taWMgdGhpbmdzLiBBbiBhdG9tIGlzIGFuIGV4cHJlc3Npb24gd2l0aCBubyBzdWJleHByZXNzaW9ucy5cbiAgICBFeGFtcGxlc1xuICAgID09PT09PT09XG4gICAgU3ltYm9sLCBOdW1iZXIsIFJhdGlvbmFsLCBJbnRlZ2VyLCAuLi5cbiAgICBCdXQgbm90OiBBZGQsIE11bCwgUG93LCAuLi5cbiAgICAqL1xuXG4gICAgc3RhdGljIGlzX0F0b20gPSB0cnVlO1xuXG4gICAgX19zbG90c19fOiBhbnlbXSA9IFtdO1xuXG4gICAgbWF0Y2hlcyhleHByOiBhbnksIHJlcGxfZGljdDogSGFzaERpY3QgPSB1bmRlZmluZWQsIG9sZDogYW55ID0gZmFsc2UpIHtcbiAgICAgICAgaWYgKHRoaXMgPT09IGV4cHIpIHtcbiAgICAgICAgICAgIGlmICh0eXBlb2YgcmVwbF9kaWN0ID09PSBcInVuZGVmaW5lZFwiKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIG5ldyBIYXNoRGljdCgpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIHJlcGxfZGljdC5jb3B5KCk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICB4cmVwbGFjZShydWxlOiBhbnksIGhhY2syOiBhbnkgPSBmYWxzZSkge1xuICAgICAgICByZXR1cm4gcnVsZS5nZXQodGhpcyk7XG4gICAgfVxuXG4gICAgZG9pdCguLi5oaW50czogYW55KSB7XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cbn07XG5cbi8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBuZXctY2FwXG5jb25zdCBfQXRvbWljRXhwciA9IEF0b20oT2JqZWN0KTtcbk1hbmFnZWRQcm9wZXJ0aWVzLnJlZ2lzdGVyKF9BdG9taWNFeHByKTtcblxuZXhwb3J0IHtfQmFzaWMsIEJhc2ljLCBBdG9tLCBfQXRvbWljRXhwcn07XG4iLCAiLypcbk5vdGFibGUgY2hhbmdlcyBtYWRlIChhbmQgbm90ZXMpXG4tIFJld29ya2VkIFNpbmdsZXRvbiB0byB1c2UgYSByZWdpc3RyeSBzeXN0ZW0gdXNpbmcgYSBzdGF0aWMgZGljdGlvbmFyeVxuLSBSZWdpc3RlcnMgbnVtYmVyIG9iamVjdHMgYXMgdGhleSBhcmUgdXNlZFxuKi9cblxuLyogZXNsaW50LWRpc2FibGUgbmV3LWNhcCAqL1xuaW1wb3J0IHtNYW5hZ2VkUHJvcGVydGllc30gZnJvbSBcIi4vYXNzdW1wdGlvbnNcIjtcblxuY2xhc3MgU2luZ2xldG9uIHtcbiAgICBzdGF0aWMgcmVnaXN0cnk6IFJlY29yZDxhbnksIGFueT4gPSB7fTtcblxuICAgIHN0YXRpYyByZWdpc3RlcihuYW1lOiBzdHJpbmcsIGNsczogYW55KSB7XG4gICAgICAgIE1hbmFnZWRQcm9wZXJ0aWVzLnJlZ2lzdGVyKGNscyk7XG4gICAgICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBuZXctY2FwXG4gICAgICAgIFNpbmdsZXRvbi5yZWdpc3RyeVtuYW1lXSA9IG5ldyBjbHMoKTtcbiAgICB9XG59XG5cbmNvbnN0IFM6IGFueSA9IG5ldyBTaW5nbGV0b24oKTtcblxuXG5leHBvcnQge1MsIFNpbmdsZXRvbn07XG4iLCAiLypcbk5ldyBjbGFzcyBnbG9iYWxcbkhlbHBzIHRvIGF2b2lkIGN5Y2xpY2FsIGltcG9ydHMgYnkgc3RvcmluZyBjb25zdHJ1Y3RvcnMgYW5kIGZ1bmN0aW9ucyB3aGljaFxuY2FuIGJlIGFjY2Vzc2VkIGFueXdoZXJlXG5cbk5vdGU6IHN0YXRpYyBuZXcgbWV0aG9kcyBhcmUgY3JlYXRlZCBpbiB0aGUgY2xhc3NlcyB0byBiZSByZWdpc3RlcmVkLCBhbmQgdGhvc2Vcbm1ldGhvZHMgYXJlIGFkZGVkIGhlcmVcbiovXG5cbmV4cG9ydCBjbGFzcyBHbG9iYWwge1xuICAgIHN0YXRpYyBjb25zdHJ1Y3RvcnM6IFJlY29yZDxzdHJpbmcsIGFueT4gPSB7fTtcbiAgICBzdGF0aWMgZnVuY3Rpb25zOiBSZWNvcmQ8c3RyaW5nLCBhbnk+ID0ge307XG5cbiAgICBzdGF0aWMgY29uc3RydWN0KGNsYXNzbmFtZTogc3RyaW5nLCAuLi5hcmdzOiBhbnlbXSkge1xuICAgICAgICBjb25zdCBjb25zdHJ1Y3RvciA9IEdsb2JhbC5jb25zdHJ1Y3RvcnNbY2xhc3NuYW1lXTtcbiAgICAgICAgcmV0dXJuIGNvbnN0cnVjdG9yKC4uLmFyZ3MpO1xuICAgIH1cblxuICAgIHN0YXRpYyByZWdpc3RlcihjbHM6IHN0cmluZywgY29uc3RydWN0b3I6IGFueSkge1xuICAgICAgICBHbG9iYWwuY29uc3RydWN0b3JzW2Nsc10gPSBjb25zdHJ1Y3RvcjtcbiAgICB9XG5cbiAgICBzdGF0aWMgcmVnaXN0ZXJmdW5jKG5hbWU6IHN0cmluZywgZnVuYzogYW55KSB7XG4gICAgICAgIEdsb2JhbC5mdW5jdGlvbnNbbmFtZV0gPSBmdW5jO1xuICAgIH1cblxuICAgIHN0YXRpYyBldmFsZnVuYyhuYW1lOiBzdHJpbmcsIC4uLmFyZ3M6IGFueVtdKSB7XG4gICAgICAgIGNvbnN0IGZ1bmMgPSBHbG9iYWwuZnVuY3Rpb25zW25hbWVdO1xuICAgICAgICByZXR1cm4gZnVuYyguLi5hcmdzKTtcbiAgICB9XG59XG4iLCAiLyogZXNsaW50LWRpc2FibGUgbm8tdW51c2VkLXZhcnMgKi9cbi8qIE1pc2NlbGxhbmVvdXMgc3R1ZmYgdGhhdCBkb2VzIG5vdCByZWFsbHkgZml0IGFueXdoZXJlIGVsc2UgKi9cblxuLypcblxuTm90YWJsZSBjaGFuZ2VzIG1hZGUgKFdCIGFuZCBHTSk6XG4tIEZpbGxkZWRlbnQgYW5kIGFzX2ludCBhcmUgcmV3cml0dGVuIHRvIGluY2x1ZGUgdGhlIHNhbWUgZnVuY3Rpb25hbGl0eSB3aXRoXG4gIGRpZmZlcmVudCBtZXRob2RvbG9neVxuLSBNYW55IGZ1bmN0aW9ucyBhcmUgbm90IHlldCBpbXBsZW1lbnRlZCBhbmQgd2lsbCBiZSBjb21wbGV0ZWQgYXMgd2UgZmluZCB0aGVtXG4gIG5lY2Vzc2FyeVxufVxuXG4qL1xuXG5cbmNsYXNzIFVuZGVjaWRhYmxlIGV4dGVuZHMgRXJyb3Ige1xuICAgIC8vIGFuIGVycm9yIHRvIGJlIHJhaXNlZCB3aGVuIGEgZGVjaXNpb24gY2Fubm90IGJlIG1hZGUgZGVmaW5pdGl2ZWx5XG4gICAgLy8gd2hlcmUgYSBkZWZpbml0aXZlIGFuc3dlciBpcyBuZWVkZWRcbn1cblxuLypcbmZ1bmN0aW9uIGZpbGxkZWRlbnQoczogc3RyaW5nLCB3OiBudW1iZXIgPSA3MCk6IHN0cmluZyB7XG5cbiAgICAvLyByZW1vdmUgZW1wdHkgYmxhbmsgbGluZXNcbiAgICBsZXQgc3RyID0gcy5yZXBsYWNlKC9eXFxzKlxcbi9nbSwgXCJcIik7XG4gICAgLy8gZGVkZW50XG4gICAgc3RyID0gZGVkZW50KHN0cik7XG4gICAgLy8gd3JhcFxuICAgIGNvbnN0IGFyciA9IHN0ci5zcGxpdChcIiBcIik7XG4gICAgbGV0IHJlcyA9IFwiXCI7XG4gICAgbGV0IGxpbmVsZW5ndGggPSAwO1xuICAgIGZvciAoY29uc3Qgd29yZCBvZiBhcnIpIHtcbiAgICAgICAgaWYgKGxpbmVsZW5ndGggPD0gdyArIHdvcmQubGVuZ3RoKSB7XG4gICAgICAgICAgICByZXMgKz0gd29yZDtcbiAgICAgICAgICAgIGxpbmVsZW5ndGggKz0gd29yZC5sZW5ndGg7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXMgKz0gXCJcXG5cIjtcbiAgICAgICAgICAgIGxpbmVsZW5ndGggPSAwO1xuICAgICAgICB9XG4gICAgfVxuICAgIHJldHVybiByZXM7XG59XG4qL1xuXG5cbmZ1bmN0aW9uIHN0cmxpbmVzKHM6IHN0cmluZywgYzogbnVtYmVyID0gNjQsIHNob3J0PWZhbHNlKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKFwic3RybGluZXMgaXMgbm90IHlldCBpbXBsZW1lbnRlZFwiKTtcbn1cblxuZnVuY3Rpb24gcmF3bGluZXMoczogc3RyaW5nKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKFwicmF3bGluZXMgaXMgbm90IHlldCBpbXBsZW1lbnRlZFwiKTtcbn1cblxuZnVuY3Rpb24gZGVidWdfZGVjb3JhdG9yKGZ1bmM6IGFueSkge1xuICAgIHRocm93IG5ldyBFcnJvcihcImRlYnVnX2RlY29yYXRvciBpcyBub3QgeWV0IGltcGxlbWVudGVkXCIpO1xufVxuXG5mdW5jdGlvbiBkZWJ1ZyguLi5hcmdzOiBhbnkpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoXCJkZWJ1ZyBpcyBub3QgeWV0IGltcGxlbWVudGVkXCIpO1xufVxuXG5mdW5jdGlvbiBmaW5kX2V4ZWN1dGFibGUoZXhlY3V0YWJsZTogYW55LCBwYXRoOiBhbnk9dW5kZWZpbmVkKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKFwiZmluZF9leGVjdXRhYmxlIGlzIG5vdCB5ZXQgaW1wbGVtZW50ZWRcIik7XG59XG5cbmZ1bmN0aW9uIGZ1bmNfbmFtZSh4OiBhbnksIHNob3J0OiBhbnk9ZmFsc2UpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoXCJmdW5jX25hbWUgaXMgbm90IHlldCBpbXBsZW1lbnRlZFwiKTtcbn1cblxuZnVuY3Rpb24gX3JlcGxhY2UocmVwczogYW55KSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKFwiX3JlcGxhY2UgaXMgbm90IHlldCBpbXBsZW1lbnRlZFwiKTtcbn1cblxuZnVuY3Rpb24gcmVwbGFjZShzdHI6IHN0cmluZywgLi4ucmVwczogYW55KSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKFwicmVwbGFjZSBpcyBub3QgeWV0IGltcGxlbWVudGVkXCIpO1xufVxuXG5mdW5jdGlvbiB0cmFuc2xhdGUoczogYW55LCBhOiBhbnksIGI6IGFueT11bmRlZmluZWQsIGM6IGFueT11bmRlZmluZWQpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoXCJ0cmFuc2xhdGUgaXMgbm90IHlldCBpbXBsZW1lbnRlZFwiKTtcbn1cblxuZnVuY3Rpb24gb3JkaW5hbChudW06IGFueSkge1xuICAgIHRocm93IG5ldyBFcnJvcihcIm9yZGluYWwgaXMgbm90IHlldCBpbXBsZW1lbnRlZFwiKTtcbn1cblxuZnVuY3Rpb24gYXNfaW50KG46IGFueSkge1xuICAgIGlmICghTnVtYmVyLmlzSW50ZWdlcihuKSkgeyAvLyAhISEgLSBtaWdodCBuZWVkIHRvIHVwZGF0ZSB0aGlzXG4gICAgICAgIHRocm93IG5ldyBFcnJvcihuICsgXCIgaXMgbm90IGludFwiKTtcbiAgICB9XG4gICAgcmV0dXJuIG47XG59XG5cbmV4cG9ydCB7YXNfaW50fTtcbiIsICIvKlxuTm90YWJsZSBjaGFuZ2VzIG1hZGUgKGFuZCBub3Rlcyk6XG4tIFZlcnkgYmFyZWJvbmVzIHZlcnNpb25zIG9mIEV4cHIgaW1wbGVtZW50ZWQgc28gZmFyIC0gdmVyeSBmZXcgdXRpbCBtZXRob2RzXG4tIE5vdGUgdGhhdCBleHByZXNzaW9uIHVzZXMgZ2xvYmFsLnRzIHRvIGNvbnN0cnVjdCBhZGQgYW5kIG11bCBvYmplY3RzLCB3aGljaFxuICBhdm9pZHMgY3ljbGljYWwgaW1wb3J0c1xuKi9cblxuaW1wb3J0IHtfQmFzaWMsIEF0b219IGZyb20gXCIuL2Jhc2ljXCI7XG5pbXBvcnQge0hhc2hTZXQsIG1peH0gZnJvbSBcIi4vdXRpbGl0eVwiO1xuaW1wb3J0IHtNYW5hZ2VkUHJvcGVydGllc30gZnJvbSBcIi4vYXNzdW1wdGlvbnNcIjtcbmltcG9ydCB7U30gZnJvbSBcIi4vc2luZ2xldG9uXCI7XG5pbXBvcnQge0dsb2JhbH0gZnJvbSBcIi4vZ2xvYmFsXCI7XG5pbXBvcnQge2FzX2ludH0gZnJvbSBcIi4uL3V0aWxpdGllcy9taXNjXCI7XG5cblxuY29uc3QgRXhwciA9IChzdXBlcmNsYXNzOiBhbnkpID0+IGNsYXNzIEV4cHIgZXh0ZW5kcyBtaXgoc3VwZXJjbGFzcykud2l0aChfQmFzaWMpIHtcbiAgICAvKlxuICAgIEJhc2UgY2xhc3MgZm9yIGFsZ2VicmFpYyBleHByZXNzaW9ucy5cbiAgICBFeHBsYW5hdGlvblxuICAgID09PT09PT09PT09XG4gICAgRXZlcnl0aGluZyB0aGF0IHJlcXVpcmVzIGFyaXRobWV0aWMgb3BlcmF0aW9ucyB0byBiZSBkZWZpbmVkXG4gICAgc2hvdWxkIHN1YmNsYXNzIHRoaXMgY2xhc3MsIGluc3RlYWQgb2YgQmFzaWMgKHdoaWNoIHNob3VsZCBiZVxuICAgIHVzZWQgb25seSBmb3IgYXJndW1lbnQgc3RvcmFnZSBhbmQgZXhwcmVzc2lvbiBtYW5pcHVsYXRpb24sIGkuZS5cbiAgICBwYXR0ZXJuIG1hdGNoaW5nLCBzdWJzdGl0dXRpb25zLCBldGMpLlxuICAgIElmIHlvdSB3YW50IHRvIG92ZXJyaWRlIHRoZSBjb21wYXJpc29ucyBvZiBleHByZXNzaW9uczpcbiAgICBTaG91bGQgdXNlIF9ldmFsX2lzX2dlIGZvciBpbmVxdWFsaXR5LCBvciBfZXZhbF9pc19lcSwgd2l0aCBtdWx0aXBsZSBkaXNwYXRjaC5cbiAgICBfZXZhbF9pc19nZSByZXR1cm4gdHJ1ZSBpZiB4ID49IHksIGZhbHNlIGlmIHggPCB5LCBhbmQgTm9uZSBpZiB0aGUgdHdvIHR5cGVzXG4gICAgYXJlIG5vdCBjb21wYXJhYmxlIG9yIHRoZSBjb21wYXJpc29uIGlzIGluZGV0ZXJtaW5hdGVcbiAgICBTZWUgQWxzb1xuICAgID09PT09PT09XG4gICAgc3ltcHkuY29yZS5iYXNpYy5CYXNpY1xuICAgICovXG5cbiAgICBfX3Nsb3RzX186IGFueVtdID0gW107XG4gICAgc3RhdGljIGlzX3NjYWxhciA9IHRydWU7XG5cbiAgICBjb25zdHJ1Y3RvciguLi5hcmdzOiBhbnkpIHtcbiAgICAgICAgc3VwZXIoLi4uYXJncyk7XG4gICAgfVxuXG4gICAgYXNfYmFzZV9leHAoKSB7XG4gICAgICAgIHJldHVybiBbdGhpcywgUy5PbmVdO1xuICAgIH1cblxuICAgIGFzX2NvZWZmX011bChyYXRpb25hbDogYm9vbGVhbiA9IGZhbHNlKSB7XG4gICAgICAgIHJldHVybiBbUy5PbmUsIHRoaXNdO1xuICAgIH1cblxuICAgIGFzX2NvZWZmX0FkZCgpIHtcbiAgICAgICAgcmV0dXJuIFtTLlplcm8sIHRoaXNdO1xuICAgIH1cblxuICAgIF9fYWRkX18ob3RoZXI6IGFueSkge1xuICAgICAgICByZXR1cm4gR2xvYmFsLmNvbnN0cnVjdChcIkFkZFwiLCB0cnVlLCB0cnVlLCB0aGlzLCBvdGhlcik7XG4gICAgfVxuXG4gICAgX19yYWRkX18ob3RoZXI6IGFueSkge1xuICAgICAgICByZXR1cm4gR2xvYmFsLmNvbnN0cnVjdChcIkFkZFwiLCB0cnVlLCB0cnVlLCBvdGhlciwgdGhpcyk7XG4gICAgfVxuXG4gICAgX19zdWJfXyhvdGhlcjogYW55KSB7XG4gICAgICAgIHJldHVybiBHbG9iYWwuY29uc3RydWN0KFwiQWRkXCIsIHRydWUsIHRydWUsIHRoaXMsIG90aGVyLl9fbXVsX18oUy5OZWdhdGl2ZU9uZSkpO1xuICAgIH1cblxuICAgIF9fcnN1Yl9fKG90aGVyOiBhbnkpIHtcbiAgICAgICAgcmV0dXJuIEdsb2JhbC5jb25zdHJ1Y3QoXCJBZGRcIiwgdHJ1ZSwgdHJ1ZSwgb3RoZXIsIHRoaXMuX19tdWxfXyhTLk5lZ2F0aXZlT25lKSk7XG4gICAgfVxuXG4gICAgX19tdWxfXyhvdGhlcjogYW55KSB7XG4gICAgICAgIHJldHVybiBHbG9iYWwuY29uc3RydWN0KFwiTXVsXCIsIHRydWUsIHRydWUsIHRoaXMsIG90aGVyKTtcbiAgICB9XG5cbiAgICBfX3JtdWxfXyhvdGhlcjogYW55KSB7XG4gICAgICAgIHJldHVybiBHbG9iYWwuY29uc3RydWN0KFwiTXVsXCIsIHRydWUsIHRydWUsIG90aGVyLCB0aGlzKTtcbiAgICB9XG5cbiAgICBfcG93KG90aGVyOiBhbnkpIHtcbiAgICAgICAgcmV0dXJuIEdsb2JhbC5jb25zdHJ1Y3QoXCJQb3dcIiwgdGhpcywgb3RoZXIpO1xuICAgIH1cblxuICAgIF9fcG93X18ob3RoZXI6IGFueSwgbW9kOiBib29sZWFuID0gdW5kZWZpbmVkKSB7XG4gICAgICAgIGlmICh0eXBlb2YgbW9kID09PSBcInVuZGVmaW5lZFwiKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fcG93KG90aGVyKTtcbiAgICAgICAgfVxuICAgICAgICBsZXQgX3NlbGY7IGxldCBfb3RoZXI7IGxldCBfbW9kO1xuICAgICAgICB0cnkge1xuICAgICAgICAgICAgW19zZWxmLCBfb3RoZXIsIF9tb2RdID0gW2FzX2ludCh0aGlzKSwgYXNfaW50KG90aGVyKSwgYXNfaW50KG1vZCldO1xuICAgICAgICAgICAgaWYgKG90aGVyID49IDApIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gR2xvYmFsLmNvbnN0cnVjdChcIl9OdW1iZXJfXCIsIF9zZWxmKipfb3RoZXIgJSBfbW9kKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIEdsb2JhbC5jb25zdHJ1Y3QoXCJfTnVtYmVyX1wiLCBHbG9iYWwuZXZhbGZ1bmMoXCJtb2RfaW52ZXJzZVwiLCAoX3NlbGYgKiogKF9vdGhlcikgJSAobW9kIGFzIGFueSkpLCBtb2QpKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSBjYXRjaCAoRXJyb3IpIHtcbiAgICAgICAgICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBuby11bnVzZWQtdmFyc1xuICAgICAgICAgICAgY29uc3QgcG93ZXIgPSB0aGlzLl9wb3coX290aGVyKTtcbiAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgLy8gcmV0dXJuIHBvd2VyLl9fbW9kX18obW9kKTtcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJtb2QgY2xhc3Mgbm90IHlldCBpbXBsZW1lbnRlZFwiKTtcbiAgICAgICAgICAgIH0gY2F0Y2ggKEVycm9yKSB7XG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwibm90IGltcGxlbWVudGVkXCIpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgX19ycG93X18ob3RoZXI6IGFueSkge1xuICAgICAgICByZXR1cm4gR2xvYmFsLmNvbnN0cnVjdChcIlBvd1wiLCBvdGhlciwgdGhpcyk7XG4gICAgfVxuXG4gICAgX190cnVlZGl2X18ob3RoZXI6IGFueSkge1xuICAgICAgICBjb25zdCBkZW5vbSA9IEdsb2JhbC5jb25zdHJ1Y3QoXCJQb3dcIiwgb3RoZXIsIFMuTmVnYXRpdmVPbmUpO1xuICAgICAgICBpZiAodGhpcyA9PT0gUy5PbmUpIHtcbiAgICAgICAgICAgIHJldHVybiBkZW5vbTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiBHbG9iYWwuY29uc3RydWN0KFwiTXVsXCIsIHRydWUsIHRydWUsIHRoaXMsIGRlbm9tKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIF9fcnRydWVkaXZfXyhvdGhlcjogYW55KSB7XG4gICAgICAgIGNvbnN0IGRlbm9tID0gR2xvYmFsLmNvbnN0cnVjdChcIlBvd1wiLCB0aGlzLCBTLk5lZ2F0aXZlT25lKTtcbiAgICAgICAgaWYgKG90aGVyID09PSBTLk9uZSkge1xuICAgICAgICAgICAgcmV0dXJuIGRlbm9tO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuIEdsb2JhbC5jb25zdHJ1Y3QoXCJNdWxcIiwgdHJ1ZSwgdHJ1ZSwgb3RoZXIsIGRlbm9tKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIF9ldmFsX3Bvd2VyKG90aGVyOiBhbnkpOiBhbnkge1xuICAgICAgICByZXR1cm4gdW5kZWZpbmVkO1xuICAgIH1cblxuICAgIGFyZ3NfY25jKGNzZXQ6IGJvb2xlYW4gPSBmYWxzZSwgd2FybjogYm9vbGVhbiA9IHRydWUsIHNwbGl0XzE6IGJvb2xlYW4gPSB0cnVlKSB7XG4gICAgICAgIGxldCBhcmdzO1xuICAgICAgICBpZiAoKHRoaXMuY29uc3RydWN0b3IgYXMgYW55KS5pc19NdWwpIHtcbiAgICAgICAgICAgIGFyZ3MgPSB0aGlzLl9hcmdzO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgYXJncyA9IFt0aGlzXTtcbiAgICAgICAgfVxuICAgICAgICBsZXQgYzsgbGV0IG5jO1xuICAgICAgICBsZXQgbG9vcDIgPSB0cnVlO1xuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGFyZ3MubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIGNvbnN0IG1pID0gYXJnc1tpXTtcbiAgICAgICAgICAgIGlmICghKG1pLmlzX2NvbW11dGF0aXZlKSkge1xuICAgICAgICAgICAgICAgIGMgPSBhcmdzLnNsaWNlKDAsIGkpO1xuICAgICAgICAgICAgICAgIG5jID0gYXJncy5zbGljZShpKTtcbiAgICAgICAgICAgICAgICBsb29wMiA9IGZhbHNlO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgfVxuICAgICAgICB9IGlmIChsb29wMikge1xuICAgICAgICAgICAgYyA9IGFyZ3M7XG4gICAgICAgICAgICBuYyA9IFtdO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGMgJiYgc3BsaXRfMSAmJlxuICAgICAgICAgICAgY1swXS5pc19OdW1iZXIgJiZcbiAgICAgICAgICAgIGNbMF0uaXNfZXh0ZW5kZWRfbmVnYXRpdmUgJiZcbiAgICAgICAgICAgIGNbMF0gIT09IFMuTmVnYXRpdmVPbmUpIHtcbiAgICAgICAgICAgIGMuc3BsaWNlKDAsIDEsIFMuTmVnYXRpdmVPbmUsIGNbMF0uX19tdWxfXyhTLk5lZ2F0aXZlT25lKSk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoY3NldCkge1xuICAgICAgICAgICAgY29uc3QgY2xlbiA9IGMubGVuZ3RoO1xuICAgICAgICAgICAgY29uc3QgY3NldCA9IG5ldyBIYXNoU2V0KCk7XG4gICAgICAgICAgICBjc2V0LmFkZEFycihjKTtcbiAgICAgICAgICAgIGlmIChjbGVuICYmIHdhcm4gJiYgY3NldC5zaXplICE9PSBjbGVuKSB7XG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwicmVwZWF0ZWQgY29tbXV0YXRpdmUgYXJnc1wiKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gW2MsIG5jXTtcbiAgICB9XG59O1xuXG4vLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbmV3LWNhcFxuY29uc3QgX0V4cHIgPSBFeHByKE9iamVjdCk7XG5NYW5hZ2VkUHJvcGVydGllcy5yZWdpc3RlcihfRXhwcik7XG5cbmNvbnN0IEF0b21pY0V4cHIgPSAoc3VwZXJjbGFzczogYW55KSA9PiBjbGFzcyBBdG9taWNFeHByIGV4dGVuZHMgbWl4KHN1cGVyY2xhc3MpLndpdGgoQXRvbSwgRXhwcikge1xuICAgIC8qXG4gICAgQSBwYXJlbnQgY2xhc3MgZm9yIG9iamVjdCB3aGljaCBhcmUgYm90aCBhdG9tcyBhbmQgRXhwcnMuXG4gICAgRm9yIGV4YW1wbGU6IFN5bWJvbCwgTnVtYmVyLCBSYXRpb25hbCwgSW50ZWdlciwgLi4uXG4gICAgQnV0IG5vdDogQWRkLCBNdWwsIFBvdywgLi4uXG4gICAgKi9cbiAgICBzdGF0aWMgaXNfbnVtYmVyID0gZmFsc2U7XG4gICAgc3RhdGljIGlzX0F0b20gPSB0cnVlO1xuXG4gICAgX19zbG90c19fOiBhbnlbXSA9IFtdO1xuXG4gICAgY29uc3RydWN0b3IoLi4uYXJnczogYW55KSB7XG4gICAgICAgIHN1cGVyKEF0b21pY0V4cHIsIGFyZ3MpO1xuICAgIH1cblxuICAgIF9ldmFsX2lzX3BvbHlub21pYWwoc3ltczogYW55KSB7XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cblxuICAgIF9ldmFsX2lzX3JhdGlvbmFsX2Z1bmN0aW9uKHN5bXM6IGFueSkge1xuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG5cbiAgICBldmFsX2lzX2FsZ2VicmFpY19leHByKHN5bXM6IGFueSkge1xuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG5cbiAgICBfZXZhbF9uc2VyaWVzKHg6IGFueSwgbjogYW55LCBsb2d4OiBhbnksIGNkb3I6IGFueSA9IDApIHtcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxufTtcblxuLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5ldy1jYXBcbmNvbnN0IF9BdG9taWNFeHByID0gQXRvbWljRXhwcihPYmplY3QpO1xuTWFuYWdlZFByb3BlcnRpZXMucmVnaXN0ZXIoX0F0b21pY0V4cHIpO1xuXG5leHBvcnQge0F0b21pY0V4cHIsIF9BdG9taWNFeHByLCBFeHByLCBfRXhwcn07XG4iLCAiLypcbk5vdGFibGUgY2hhbmdlcyBtYWRlOlxuLSBEaWN0aW9uYXJ5IHN5c3RlbSByZXdvcmtlZCBhcyBjbGFzcyBwcm9wZXJ0aWVzXG4qL1xuXG5jbGFzcyBfZ2xvYmFsX3BhcmFtZXRlcnMge1xuICAgIC8qXG4gICAgVGhyZWFkLWxvY2FsIGdsb2JhbCBwYXJhbWV0ZXJzLlxuICAgIEV4cGxhbmF0aW9uXG4gICAgPT09PT09PT09PT1cbiAgICBUaGlzIGNsYXNzIGdlbmVyYXRlcyB0aHJlYWQtbG9jYWwgY29udGFpbmVyIGZvciBTeW1QeSdzIGdsb2JhbCBwYXJhbWV0ZXJzLlxuICAgIEV2ZXJ5IGdsb2JhbCBwYXJhbWV0ZXJzIG11c3QgYmUgcGFzc2VkIGFzIGtleXdvcmQgYXJndW1lbnQgd2hlbiBnZW5lcmF0aW5nXG4gICAgaXRzIGluc3RhbmNlLlxuICAgIEEgdmFyaWFibGUsIGBnbG9iYWxfcGFyYW1ldGVyc2AgaXMgcHJvdmlkZWQgYXMgZGVmYXVsdCBpbnN0YW5jZSBmb3IgdGhpcyBjbGFzcy5cbiAgICBXQVJOSU5HISBBbHRob3VnaCB0aGUgZ2xvYmFsIHBhcmFtZXRlcnMgYXJlIHRocmVhZC1sb2NhbCwgU3ltUHkncyBjYWNoZSBpcyBub3RcbiAgICBieSBub3cuXG4gICAgVGhpcyBtYXkgbGVhZCB0byB1bmRlc2lyZWQgcmVzdWx0IGluIG11bHRpLXRocmVhZGluZyBvcGVyYXRpb25zLlxuICAgIEV4YW1wbGVzXG4gICAgPT09PT09PT1cbiAgICA+Pj4gZnJvbSBzeW1weS5hYmMgaW1wb3J0IHhcbiAgICA+Pj4gZnJvbSBzeW1weS5jb3JlLmNhY2hlIGltcG9ydCBjbGVhcl9jYWNoZVxuICAgID4+PiBmcm9tIHN5bXB5LmNvcmUucGFyYW1ldGVycyBpbXBvcnQgZ2xvYmFsX3BhcmFtZXRlcnMgYXMgZ3BcbiAgICA+Pj4gZ3AuZXZhbHVhdGVcbiAgICBUcnVlXG4gICAgPj4+IHgreFxuICAgIDIqeFxuICAgID4+PiBsb2cgPSBbXVxuICAgID4+PiBkZWYgZigpOlxuICAgIC4uLiAgICAgY2xlYXJfY2FjaGUoKVxuICAgIC4uLiAgICAgZ3AuZXZhbHVhdGUgPSBGYWxzZVxuICAgIC4uLiAgICAgbG9nLmFwcGVuZCh4K3gpXG4gICAgLi4uICAgICBjbGVhcl9jYWNoZSgpXG4gICAgPj4+IGltcG9ydCB0aHJlYWRpbmdcbiAgICA+Pj4gdGhyZWFkID0gdGhyZWFkaW5nLlRocmVhZCh0YXJnZXQ9ZilcbiAgICA+Pj4gdGhyZWFkLnN0YXJ0KClcbiAgICA+Pj4gdGhyZWFkLmpvaW4oKVxuICAgID4+PiBwcmludChsb2cpXG4gICAgW3ggKyB4XVxuICAgID4+PiBncC5ldmFsdWF0ZVxuICAgIFRydWVcbiAgICA+Pj4geCt4XG4gICAgMip4XG4gICAgUmVmZXJlbmNlc1xuICAgID09PT09PT09PT1cbiAgICAuLiBbMV0gaHR0cHM6Ly9kb2NzLnB5dGhvbi5vcmcvMy9saWJyYXJ5L3RocmVhZGluZy5odG1sXG4gICAgKi9cblxuICAgIGRpY3Q6IFJlY29yZDxhbnksIGFueT4gPSB7fTtcblxuICAgIGV2YWx1YXRlO1xuICAgIGRpc3RyaWJ1dGU7XG4gICAgZXhwX2lzX3BvdztcblxuICAgIGNvbnN0cnVjdG9yKGRpY3Q6IFJlY29yZDxzdHJpbmcsIGFueT4pIHtcbiAgICAgICAgdGhpcy5kaWN0ID0gZGljdDtcbiAgICAgICAgdGhpcy5ldmFsdWF0ZSA9IHRoaXMuZGljdFtcImV2YWx1YXRlXCJdO1xuICAgICAgICB0aGlzLmRpc3RyaWJ1dGUgPSB0aGlzLmRpY3RbXCJkaXN0cmlidXRlXCJdO1xuICAgICAgICB0aGlzLmV4cF9pc19wb3cgPSB0aGlzLmRpY3RbXCJleHBfaXNfcG93XCJdO1xuICAgIH1cbn1cblxuY29uc3QgZ2xvYmFsX3BhcmFtZXRlcnMgPSBuZXcgX2dsb2JhbF9wYXJhbWV0ZXJzKHtcImV2YWx1YXRlXCI6IHRydWUsIFwiZGlzdHJpYnV0ZVwiOiB0cnVlLCBcImV4cF9pc19wb3dcIjogZmFsc2V9KTtcblxuZXhwb3J0IHtnbG9iYWxfcGFyYW1ldGVyc307XG4iLCAiLypcbk5vdGFibGUgY2hhbmdlcyBtYWRlIGFuZCBub3Rlczpcbi0gT3JkZXItc3ltYm9scyBhbmQgcmVsYXRlZCBjb21wb25lbnRlZCBub3QgeWV0IGltcGxlbWVudGVkXG4tIE1vc3QgbWV0aG9kcyBub3QgeWV0IGltcGxlbWVudGVkIChidXQgZW5vdWdoIHRvIGV2YWx1YXRlIGFkZCBpbiB0aGVvcnkpXG4tIFNpbXBsaWZ5IGFyZ3VtZW50IGFkZGVkIHRvIGNvbnN0cnVjdG9yIHRvIHByZXZlbnQgaW5maW5pdGUgcmVjdXJzaW9uXG4qL1xuXG5pbXBvcnQge19CYXNpY30gZnJvbSBcIi4vYmFzaWNcIjtcbmltcG9ydCB7bWl4fSBmcm9tIFwiLi91dGlsaXR5XCI7XG5pbXBvcnQge2dsb2JhbF9wYXJhbWV0ZXJzfSBmcm9tIFwiLi9wYXJhbWV0ZXJzXCI7XG5pbXBvcnQge2Z1enp5X2FuZF92Mn0gZnJvbSBcIi4vbG9naWNcIjtcbmltcG9ydCB7TWFuYWdlZFByb3BlcnRpZXN9IGZyb20gXCIuL2Fzc3VtcHRpb25zXCI7XG5pbXBvcnQge1N9IGZyb20gXCIuL3NpbmdsZXRvblwiO1xuXG5cbmNvbnN0IEFzc29jT3AgPSAoc3VwZXJjbGFzczogYW55KSA9PiBjbGFzcyBBc3NvY09wIGV4dGVuZHMgbWl4KHN1cGVyY2xhc3MpLndpdGgoX0Jhc2ljKSB7XG4gICAgLyogQXNzb2NpYXRpdmUgb3BlcmF0aW9ucywgY2FuIHNlcGFyYXRlIG5vbmNvbW11dGF0aXZlIGFuZFxuICAgIGNvbW11dGF0aXZlIHBhcnRzLlxuICAgIChhIG9wIGIpIG9wIGMgPT0gYSBvcCAoYiBvcCBjKSA9PSBhIG9wIGIgb3AgYy5cbiAgICBCYXNlIGNsYXNzIGZvciBBZGQgYW5kIE11bC5cbiAgICBUaGlzIGlzIGFuIGFic3RyYWN0IGJhc2UgY2xhc3MsIGNvbmNyZXRlIGRlcml2ZWQgY2xhc3NlcyBtdXN0IGRlZmluZVxuICAgIHRoZSBhdHRyaWJ1dGUgYGlkZW50aXR5YC5cbiAgICAuLiBkZXByZWNhdGVkOjogMS43XG4gICAgICAgVXNpbmcgYXJndW1lbnRzIHRoYXQgYXJlbid0IHN1YmNsYXNzZXMgb2YgOmNsYXNzOmB+LkV4cHJgIGluIGNvcmVcbiAgICAgICBvcGVyYXRvcnMgKDpjbGFzczpgfi5NdWxgLCA6Y2xhc3M6YH4uQWRkYCwgYW5kIDpjbGFzczpgfi5Qb3dgKSBpc1xuICAgICAgIGRlcHJlY2F0ZWQuIFNlZSA6cmVmOmBub24tZXhwci1hcmdzLWRlcHJlY2F0ZWRgIGZvciBkZXRhaWxzLlxuICAgIFBhcmFtZXRlcnNcbiAgICA9PT09PT09PT09XG4gICAgKmFyZ3MgOlx1MDE5MlxuICAgICAgICBBcmd1bWVudHMgd2hpY2ggYXJlIG9wZXJhdGVkXG4gICAgZXZhbHVhdGUgOiBib29sLCBvcHRpb25hbFxuICAgICAgICBFdmFsdWF0ZSB0aGUgb3BlcmF0aW9uLiBJZiBub3QgcGFzc2VkLCByZWZlciB0byBgYGdsb2JhbF9wYXJhbWV0ZXJzLmV2YWx1YXRlYGAuXG4gICAgKi9cblxuICAgIC8vIGZvciBwZXJmb3JtYW5jZSByZWFzb24sIHdlIGRvbid0IGxldCBpc19jb21tdXRhdGl2ZSBnbyB0byBhc3N1bXB0aW9ucyxcbiAgICAvLyBhbmQga2VlcCBpdCByaWdodCBoZXJlXG5cbiAgICBfX3Nsb3RzX186IGFueVtdID0gW1wiaXNfY29tbXV0YXRpdmVcIl07XG4gICAgc3RhdGljIF9hcmdzX3R5cGU6IGFueSA9IHVuZGVmaW5lZDtcblxuICAgIGNvbnN0cnVjdG9yKGNsczogYW55LCBldmFsdWF0ZTogYW55LCBzaW1wbGlmeTogYm9vbGVhbiwgLi4uYXJnczogYW55KSB7XG4gICAgICAgIC8vIGlkZW50aXR5IHdhc24ndCB3b3JraW5nIGZvciBzb21lIHJlYXNvbiwgc28gaGVyZSBpcyBhIGJhbmRhaWQgZml4XG4gICAgICAgIGlmIChjbHMubmFtZSA9PT0gXCJNdWxcIikge1xuICAgICAgICAgICAgY2xzLmlkZW50aXR5ID0gUy5PbmU7XG4gICAgICAgIH0gZWxzZSBpZiAoY2xzLm5hbWUgPT09IFwiQWRkXCIpIHtcbiAgICAgICAgICAgIGNscy5pZGVudGl0eSA9IFMuWmVybztcbiAgICAgICAgfVxuICAgICAgICBzdXBlciguLi5hcmdzKTtcbiAgICAgICAgaWYgKHNpbXBsaWZ5KSB7XG4gICAgICAgICAgICBpZiAodHlwZW9mIGV2YWx1YXRlID09PSBcInVuZGVmaW5lZFwiKSB7XG4gICAgICAgICAgICAgICAgZXZhbHVhdGUgPSBnbG9iYWxfcGFyYW1ldGVycy5ldmFsdWF0ZTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoZXZhbHVhdGUgPT09IGZhbHNlKSB7XG4gICAgICAgICAgICAgICAgbGV0IG9iaiA9IHRoaXMuX2Zyb21fYXJncyhjbHMsIHVuZGVmaW5lZCwgLi4uYXJncyk7XG4gICAgICAgICAgICAgICAgb2JqID0gdGhpcy5fZXhlY19jb25zdHJ1Y3Rvcl9wb3N0cHJvY2Vzc29ycyhvYmopO1xuICAgICAgICAgICAgICAgIHJldHVybiBvYmo7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBjb25zdCBhcmdzVGVtcDogYW55W10gPSBbXTtcbiAgICAgICAgICAgIGZvciAoY29uc3QgYSBvZiBhcmdzKSB7XG4gICAgICAgICAgICAgICAgaWYgKGEgIT09IGNscy5pZGVudGl0eSkge1xuICAgICAgICAgICAgICAgICAgICBhcmdzVGVtcC5wdXNoKGEpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGFyZ3MgPSBhcmdzVGVtcDtcbiAgICAgICAgICAgIGlmIChhcmdzLmxlbmd0aCA9PT0gMCkge1xuICAgICAgICAgICAgICAgIHJldHVybiBjbHMuaWRlbnRpdHk7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKGFyZ3MubGVuZ3RoID09PSAxKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGFyZ3NbMF07XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tdW51c2VkLXZhcnNcbiAgICAgICAgICAgIGNvbnN0IFtjX3BhcnQsIG5jX3BhcnQsIG9yZGVyX3N5bWJvbHNdID0gdGhpcy5mbGF0dGVuKGFyZ3MpO1xuICAgICAgICAgICAgY29uc3QgaXNfY29tbXV0YXRpdmU6IGJvb2xlYW4gPSBuY19wYXJ0Lmxlbmd0aCA9PT0gMDtcbiAgICAgICAgICAgIGxldCBvYmo6IGFueSA9IHRoaXMuX2Zyb21fYXJncyhjbHMsIGlzX2NvbW11dGF0aXZlLCAuLi5jX3BhcnQuY29uY2F0KG5jX3BhcnQpKTtcbiAgICAgICAgICAgIG9iaiA9IHRoaXMuX2V4ZWNfY29uc3RydWN0b3JfcG9zdHByb2Nlc3NvcnMob2JqKTtcbiAgICAgICAgICAgIC8vICEhISBvcmRlciBzeW1ib2xzIG5vdCB5ZXQgaW1wbGVtZW50ZWRcbiAgICAgICAgICAgIHJldHVybiBvYmo7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBfZnJvbV9hcmdzKGNsczogYW55LCBpc19jb21tdXRhdGl2ZTogYW55LCAuLi5hcmdzOiBhbnkpIHtcbiAgICAgICAgLyogXCJDcmVhdGUgbmV3IGluc3RhbmNlIHdpdGggYWxyZWFkeS1wcm9jZXNzZWQgYXJncy5cbiAgICAgICAgSWYgdGhlIGFyZ3MgYXJlIG5vdCBpbiBjYW5vbmljYWwgb3JkZXIsIHRoZW4gYSBub24tY2Fub25pY2FsXG4gICAgICAgIHJlc3VsdCB3aWxsIGJlIHJldHVybmVkLCBzbyB1c2Ugd2l0aCBjYXV0aW9uLiBUaGUgb3JkZXIgb2ZcbiAgICAgICAgYXJncyBtYXkgY2hhbmdlIGlmIHRoZSBzaWduIG9mIHRoZSBhcmdzIGlzIGNoYW5nZWQuICovXG4gICAgICAgIGlmIChhcmdzLmxlbmd0aCA9PT0gMCkge1xuICAgICAgICAgICAgcmV0dXJuIGNscy5pZGVudGl0eTtcbiAgICAgICAgfSBlbHNlIGlmIChhcmdzLmxlbmd0aCA9PT0gMSkge1xuICAgICAgICAgICAgcmV0dXJuIGFyZ3NbMF07XG4gICAgICAgIH1cbiAgICAgICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5ldy1jYXBcbiAgICAgICAgY29uc3Qgb2JqOiBhbnkgPSBuZXcgY2xzKHRydWUsIGZhbHNlLCAuLi5hcmdzKTtcbiAgICAgICAgaWYgKHR5cGVvZiBpc19jb21tdXRhdGl2ZSA9PT0gXCJ1bmRlZmluZWRcIikge1xuICAgICAgICAgICAgY29uc3QgaW5wdXQ6IGFueVtdID0gW107XG4gICAgICAgICAgICBmb3IgKGNvbnN0IGEgb2YgYXJncykge1xuICAgICAgICAgICAgICAgIGlucHV0LnB1c2goYS5pc19jb21tdXRhdGl2ZSgpKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlzX2NvbW11dGF0aXZlID0gZnV6enlfYW5kX3YyKGlucHV0KTtcbiAgICAgICAgfVxuICAgICAgICBvYmouaXNfY29tbXV0YXRpdmUgPSAoKSA9PiBpc19jb21tdXRhdGl2ZTtcbiAgICAgICAgcmV0dXJuIG9iajtcbiAgICB9XG5cbiAgICBfbmV3X3Jhd2FyZ3MocmVldmFsOiBib29sZWFuLCAuLi5hcmdzOiBhbnkpIHtcbiAgICAgICAgbGV0IGlzX2NvbW11dGF0aXZlO1xuICAgICAgICBpZiAocmVldmFsICYmIHRoaXMuaXNfY29tbXV0YXRpdmUgPT09IGZhbHNlKSB7XG4gICAgICAgICAgICBpc19jb21tdXRhdGl2ZSA9IHVuZGVmaW5lZDtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGlzX2NvbW11dGF0aXZlID0gdGhpcy5pc19jb21tdXRhdGl2ZTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdGhpcy5fZnJvbV9hcmdzKHRoaXMuY29uc3RydWN0b3IsIGlzX2NvbW11dGF0aXZlLCAuLi5hcmdzKTtcbiAgICB9XG5cbiAgICBtYWtlX2FyZ3MoY2xzOiBhbnksIGV4cHI6IGFueSkge1xuICAgICAgICBpZiAoZXhwciBpbnN0YW5jZW9mIGNscykge1xuICAgICAgICAgICAgcmV0dXJuIGV4cHIuX2FyZ3M7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gW2V4cHJdO1xuICAgICAgICB9XG4gICAgfVxufTtcblxuLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5ldy1jYXBcbk1hbmFnZWRQcm9wZXJ0aWVzLnJlZ2lzdGVyKEFzc29jT3AoT2JqZWN0KSk7XG5cbmV4cG9ydCB7QXNzb2NPcH07XG4iLCAiLyohXHJcbiAqICBkZWNpbWFsLmpzIHYxMC40LjNcclxuICogIEFuIGFyYml0cmFyeS1wcmVjaXNpb24gRGVjaW1hbCB0eXBlIGZvciBKYXZhU2NyaXB0LlxyXG4gKiAgaHR0cHM6Ly9naXRodWIuY29tL01pa2VNY2wvZGVjaW1hbC5qc1xyXG4gKiAgQ29weXJpZ2h0IChjKSAyMDIyIE1pY2hhZWwgTWNsYXVnaGxpbiA8TThjaDg4bEBnbWFpbC5jb20+XHJcbiAqICBNSVQgTGljZW5jZVxyXG4gKi9cclxuXHJcblxyXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSAgRURJVEFCTEUgREVGQVVMVFMgIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSAvL1xyXG5cclxuXHJcbiAgLy8gVGhlIG1heGltdW0gZXhwb25lbnQgbWFnbml0dWRlLlxyXG4gIC8vIFRoZSBsaW1pdCBvbiB0aGUgdmFsdWUgb2YgYHRvRXhwTmVnYCwgYHRvRXhwUG9zYCwgYG1pbkVgIGFuZCBgbWF4RWAuXHJcbnZhciBFWFBfTElNSVQgPSA5ZTE1LCAgICAgICAgICAgICAgICAgICAgICAvLyAwIHRvIDllMTVcclxuXHJcbiAgLy8gVGhlIGxpbWl0IG9uIHRoZSB2YWx1ZSBvZiBgcHJlY2lzaW9uYCwgYW5kIG9uIHRoZSB2YWx1ZSBvZiB0aGUgZmlyc3QgYXJndW1lbnQgdG9cclxuICAvLyBgdG9EZWNpbWFsUGxhY2VzYCwgYHRvRXhwb25lbnRpYWxgLCBgdG9GaXhlZGAsIGB0b1ByZWNpc2lvbmAgYW5kIGB0b1NpZ25pZmljYW50RGlnaXRzYC5cclxuICBNQVhfRElHSVRTID0gMWU5LCAgICAgICAgICAgICAgICAgICAgICAgIC8vIDAgdG8gMWU5XHJcblxyXG4gIC8vIEJhc2UgY29udmVyc2lvbiBhbHBoYWJldC5cclxuICBOVU1FUkFMUyA9ICcwMTIzNDU2Nzg5YWJjZGVmJyxcclxuXHJcbiAgLy8gVGhlIG5hdHVyYWwgbG9nYXJpdGhtIG9mIDEwICgxMDI1IGRpZ2l0cykuXHJcbiAgTE4xMCA9ICcyLjMwMjU4NTA5Mjk5NDA0NTY4NDAxNzk5MTQ1NDY4NDM2NDIwNzYwMTEwMTQ4ODYyODc3Mjk3NjAzMzMyNzkwMDk2NzU3MjYwOTY3NzM1MjQ4MDIzNTk5NzIwNTA4OTU5ODI5ODM0MTk2Nzc4NDA0MjI4NjI0ODYzMzQwOTUyNTQ2NTA4MjgwNjc1NjY2NjI4NzM2OTA5ODc4MTY4OTQ4MjkwNzIwODMyNTU1NDY4MDg0Mzc5OTg5NDgyNjIzMzE5ODUyODM5MzUwNTMwODk2NTM3NzczMjYyODg0NjE2MzM2NjIyMjI4NzY5ODIxOTg4Njc0NjU0MzY2NzQ3NDQwNDI0MzI3NDM2NTE1NTA0ODkzNDMxNDkzOTM5MTQ3OTYxOTQwNDQwMDIyMjEwNTEwMTcxNDE3NDgwMDM2ODgwODQwMTI2NDcwODA2ODU1Njc3NDMyMTYyMjgzNTUyMjAxMTQ4MDQ2NjM3MTU2NTkxMjEzNzM0NTA3NDc4NTY5NDc2ODM0NjM2MTY3OTIxMDE4MDY0NDUwNzA2NDgwMDAyNzc1MDI2ODQ5MTY3NDY1NTA1ODY4NTY5MzU2NzM0MjA2NzA1ODExMzY0MjkyMjQ1NTQ0MDU3NTg5MjU3MjQyMDgyNDEzMTQ2OTU2ODkwMTY3NTg5NDAyNTY3NzYzMTEzNTY5MTkyOTIwMzMzNzY1ODcxNDE2NjAyMzAxMDU3MDMwODk2MzQ1NzIwNzU0NDAzNzA4NDc0Njk5NDAxNjgyNjkyODI4MDg0ODExODQyODkzMTQ4NDg1MjQ5NDg2NDQ4NzE5Mjc4MDk2NzYyNzEyNzU3NzUzOTcwMjc2Njg2MDU5NTI0OTY3MTY2NzQxODM0ODU3MDQ0MjI1MDcxOTc5NjUwMDQ3MTQ5NTEwNTA0OTIyMTQ3NzY1Njc2MzY5Mzg2NjI5NzY5Nzk1MjIxMTA3MTgyNjQ1NDk3MzQ3NzI2NjI0MjU3MDk0MjkzMjI1ODI3OTg1MDI1ODU1MDk3ODUyNjUzODMyMDc2MDY3MjYzMTcxNjQzMDk1MDU5OTUwODc4MDc1MjM3MTAzMzMxMDExOTc4NTc1NDczMzE1NDE0MjE4MDg0Mjc1NDM4NjM1OTE3NzgxMTcwNTQzMDk4Mjc0ODIzODUwNDU2NDgwMTkwOTU2MTAyOTkyOTE4MjQzMTgyMzc1MjUzNTc3MDk3NTA1Mzk1NjUxODc2OTc1MTAzNzQ5NzA4ODg2OTIxODAyMDUxODkzMzk1MDcyMzg1MzkyMDUxNDQ2MzQxOTcyNjUyODcyODY5NjUxMTA4NjI1NzE0OTIxOTg4NDk5Nzg3NDg4NzM3NzEzNDU2ODYyMDkxNjcwNTgnLFxyXG5cclxuICAvLyBQaSAoMTAyNSBkaWdpdHMpLlxyXG4gIFBJID0gJzMuMTQxNTkyNjUzNTg5NzkzMjM4NDYyNjQzMzgzMjc5NTAyODg0MTk3MTY5Mzk5Mzc1MTA1ODIwOTc0OTQ0NTkyMzA3ODE2NDA2Mjg2MjA4OTk4NjI4MDM0ODI1MzQyMTE3MDY3OTgyMTQ4MDg2NTEzMjgyMzA2NjQ3MDkzODQ0NjA5NTUwNTgyMjMxNzI1MzU5NDA4MTI4NDgxMTE3NDUwMjg0MTAyNzAxOTM4NTIxMTA1NTU5NjQ0NjIyOTQ4OTU0OTMwMzgxOTY0NDI4ODEwOTc1NjY1OTMzNDQ2MTI4NDc1NjQ4MjMzNzg2NzgzMTY1MjcxMjAxOTA5MTQ1NjQ4NTY2OTIzNDYwMzQ4NjEwNDU0MzI2NjQ4MjEzMzkzNjA3MjYwMjQ5MTQxMjczNzI0NTg3MDA2NjA2MzE1NTg4MTc0ODgxNTIwOTIwOTYyODI5MjU0MDkxNzE1MzY0MzY3ODkyNTkwMzYwMDExMzMwNTMwNTQ4ODIwNDY2NTIxMzg0MTQ2OTUxOTQxNTExNjA5NDMzMDU3MjcwMzY1NzU5NTkxOTUzMDkyMTg2MTE3MzgxOTMyNjExNzkzMTA1MTE4NTQ4MDc0NDYyMzc5OTYyNzQ5NTY3MzUxODg1NzUyNzI0ODkxMjI3OTM4MTgzMDExOTQ5MTI5ODMzNjczMzYyNDQwNjU2NjQzMDg2MDIxMzk0OTQ2Mzk1MjI0NzM3MTkwNzAyMTc5ODYwOTQzNzAyNzcwNTM5MjE3MTc2MjkzMTc2NzUyMzg0Njc0ODE4NDY3NjY5NDA1MTMyMDAwNTY4MTI3MTQ1MjYzNTYwODI3Nzg1NzcxMzQyNzU3Nzg5NjA5MTczNjM3MTc4NzIxNDY4NDQwOTAxMjI0OTUzNDMwMTQ2NTQ5NTg1MzcxMDUwNzkyMjc5Njg5MjU4OTIzNTQyMDE5OTU2MTEyMTI5MDIxOTYwODY0MDM0NDE4MTU5ODEzNjI5Nzc0NzcxMzA5OTYwNTE4NzA3MjExMzQ5OTk5OTk4MzcyOTc4MDQ5OTUxMDU5NzMxNzMyODE2MDk2MzE4NTk1MDI0NDU5NDU1MzQ2OTA4MzAyNjQyNTIyMzA4MjUzMzQ0Njg1MDM1MjYxOTMxMTg4MTcxMDEwMDAzMTM3ODM4NzUyODg2NTg3NTMzMjA4MzgxNDIwNjE3MTc3NjY5MTQ3MzAzNTk4MjUzNDkwNDI4NzU1NDY4NzMxMTU5NTYyODYzODgyMzUzNzg3NTkzNzUxOTU3NzgxODU3NzgwNTMyMTcxMjI2ODA2NjEzMDAxOTI3ODc2NjExMTk1OTA5MjE2NDIwMTk4OTM4MDk1MjU3MjAxMDY1NDg1ODYzMjc4OScsXHJcblxyXG5cclxuICAvLyBUaGUgaW5pdGlhbCBjb25maWd1cmF0aW9uIHByb3BlcnRpZXMgb2YgdGhlIERlY2ltYWwgY29uc3RydWN0b3IuXHJcbiAgREVGQVVMVFMgPSB7XHJcblxyXG4gICAgLy8gVGhlc2UgdmFsdWVzIG11c3QgYmUgaW50ZWdlcnMgd2l0aGluIHRoZSBzdGF0ZWQgcmFuZ2VzIChpbmNsdXNpdmUpLlxyXG4gICAgLy8gTW9zdCBvZiB0aGVzZSB2YWx1ZXMgY2FuIGJlIGNoYW5nZWQgYXQgcnVuLXRpbWUgdXNpbmcgdGhlIGBEZWNpbWFsLmNvbmZpZ2AgbWV0aG9kLlxyXG5cclxuICAgIC8vIFRoZSBtYXhpbXVtIG51bWJlciBvZiBzaWduaWZpY2FudCBkaWdpdHMgb2YgdGhlIHJlc3VsdCBvZiBhIGNhbGN1bGF0aW9uIG9yIGJhc2UgY29udmVyc2lvbi5cclxuICAgIC8vIEUuZy4gYERlY2ltYWwuY29uZmlnKHsgcHJlY2lzaW9uOiAyMCB9KTtgXHJcbiAgICBwcmVjaXNpb246IDIwLCAgICAgICAgICAgICAgICAgICAgICAgICAvLyAxIHRvIE1BWF9ESUdJVFNcclxuXHJcbiAgICAvLyBUaGUgcm91bmRpbmcgbW9kZSB1c2VkIHdoZW4gcm91bmRpbmcgdG8gYHByZWNpc2lvbmAuXHJcbiAgICAvL1xyXG4gICAgLy8gUk9VTkRfVVAgICAgICAgICAwIEF3YXkgZnJvbSB6ZXJvLlxyXG4gICAgLy8gUk9VTkRfRE9XTiAgICAgICAxIFRvd2FyZHMgemVyby5cclxuICAgIC8vIFJPVU5EX0NFSUwgICAgICAgMiBUb3dhcmRzICtJbmZpbml0eS5cclxuICAgIC8vIFJPVU5EX0ZMT09SICAgICAgMyBUb3dhcmRzIC1JbmZpbml0eS5cclxuICAgIC8vIFJPVU5EX0hBTEZfVVAgICAgNCBUb3dhcmRzIG5lYXJlc3QgbmVpZ2hib3VyLiBJZiBlcXVpZGlzdGFudCwgdXAuXHJcbiAgICAvLyBST1VORF9IQUxGX0RPV04gIDUgVG93YXJkcyBuZWFyZXN0IG5laWdoYm91ci4gSWYgZXF1aWRpc3RhbnQsIGRvd24uXHJcbiAgICAvLyBST1VORF9IQUxGX0VWRU4gIDYgVG93YXJkcyBuZWFyZXN0IG5laWdoYm91ci4gSWYgZXF1aWRpc3RhbnQsIHRvd2FyZHMgZXZlbiBuZWlnaGJvdXIuXHJcbiAgICAvLyBST1VORF9IQUxGX0NFSUwgIDcgVG93YXJkcyBuZWFyZXN0IG5laWdoYm91ci4gSWYgZXF1aWRpc3RhbnQsIHRvd2FyZHMgK0luZmluaXR5LlxyXG4gICAgLy8gUk9VTkRfSEFMRl9GTE9PUiA4IFRvd2FyZHMgbmVhcmVzdCBuZWlnaGJvdXIuIElmIGVxdWlkaXN0YW50LCB0b3dhcmRzIC1JbmZpbml0eS5cclxuICAgIC8vXHJcbiAgICAvLyBFLmcuXHJcbiAgICAvLyBgRGVjaW1hbC5yb3VuZGluZyA9IDQ7YFxyXG4gICAgLy8gYERlY2ltYWwucm91bmRpbmcgPSBEZWNpbWFsLlJPVU5EX0hBTEZfVVA7YFxyXG4gICAgcm91bmRpbmc6IDQsICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gMCB0byA4XHJcblxyXG4gICAgLy8gVGhlIG1vZHVsbyBtb2RlIHVzZWQgd2hlbiBjYWxjdWxhdGluZyB0aGUgbW9kdWx1czogYSBtb2Qgbi5cclxuICAgIC8vIFRoZSBxdW90aWVudCAocSA9IGEgLyBuKSBpcyBjYWxjdWxhdGVkIGFjY29yZGluZyB0byB0aGUgY29ycmVzcG9uZGluZyByb3VuZGluZyBtb2RlLlxyXG4gICAgLy8gVGhlIHJlbWFpbmRlciAocikgaXMgY2FsY3VsYXRlZCBhczogciA9IGEgLSBuICogcS5cclxuICAgIC8vXHJcbiAgICAvLyBVUCAgICAgICAgIDAgVGhlIHJlbWFpbmRlciBpcyBwb3NpdGl2ZSBpZiB0aGUgZGl2aWRlbmQgaXMgbmVnYXRpdmUsIGVsc2UgaXMgbmVnYXRpdmUuXHJcbiAgICAvLyBET1dOICAgICAgIDEgVGhlIHJlbWFpbmRlciBoYXMgdGhlIHNhbWUgc2lnbiBhcyB0aGUgZGl2aWRlbmQgKEphdmFTY3JpcHQgJSkuXHJcbiAgICAvLyBGTE9PUiAgICAgIDMgVGhlIHJlbWFpbmRlciBoYXMgdGhlIHNhbWUgc2lnbiBhcyB0aGUgZGl2aXNvciAoUHl0aG9uICUpLlxyXG4gICAgLy8gSEFMRl9FVkVOICA2IFRoZSBJRUVFIDc1NCByZW1haW5kZXIgZnVuY3Rpb24uXHJcbiAgICAvLyBFVUNMSUQgICAgIDkgRXVjbGlkaWFuIGRpdmlzaW9uLiBxID0gc2lnbihuKSAqIGZsb29yKGEgLyBhYnMobikpLiBBbHdheXMgcG9zaXRpdmUuXHJcbiAgICAvL1xyXG4gICAgLy8gVHJ1bmNhdGVkIGRpdmlzaW9uICgxKSwgZmxvb3JlZCBkaXZpc2lvbiAoMyksIHRoZSBJRUVFIDc1NCByZW1haW5kZXIgKDYpLCBhbmQgRXVjbGlkaWFuXHJcbiAgICAvLyBkaXZpc2lvbiAoOSkgYXJlIGNvbW1vbmx5IHVzZWQgZm9yIHRoZSBtb2R1bHVzIG9wZXJhdGlvbi4gVGhlIG90aGVyIHJvdW5kaW5nIG1vZGVzIGNhbiBhbHNvXHJcbiAgICAvLyBiZSB1c2VkLCBidXQgdGhleSBtYXkgbm90IGdpdmUgdXNlZnVsIHJlc3VsdHMuXHJcbiAgICBtb2R1bG86IDEsICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyAwIHRvIDlcclxuXHJcbiAgICAvLyBUaGUgZXhwb25lbnQgdmFsdWUgYXQgYW5kIGJlbmVhdGggd2hpY2ggYHRvU3RyaW5nYCByZXR1cm5zIGV4cG9uZW50aWFsIG5vdGF0aW9uLlxyXG4gICAgLy8gSmF2YVNjcmlwdCBudW1iZXJzOiAtN1xyXG4gICAgdG9FeHBOZWc6IC03LCAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gMCB0byAtRVhQX0xJTUlUXHJcblxyXG4gICAgLy8gVGhlIGV4cG9uZW50IHZhbHVlIGF0IGFuZCBhYm92ZSB3aGljaCBgdG9TdHJpbmdgIHJldHVybnMgZXhwb25lbnRpYWwgbm90YXRpb24uXHJcbiAgICAvLyBKYXZhU2NyaXB0IG51bWJlcnM6IDIxXHJcbiAgICB0b0V4cFBvczogIDIxLCAgICAgICAgICAgICAgICAgICAgICAgICAvLyAwIHRvIEVYUF9MSU1JVFxyXG5cclxuICAgIC8vIFRoZSBtaW5pbXVtIGV4cG9uZW50IHZhbHVlLCBiZW5lYXRoIHdoaWNoIHVuZGVyZmxvdyB0byB6ZXJvIG9jY3Vycy5cclxuICAgIC8vIEphdmFTY3JpcHQgbnVtYmVyczogLTMyNCAgKDVlLTMyNClcclxuICAgIG1pbkU6IC1FWFBfTElNSVQsICAgICAgICAgICAgICAgICAgICAgIC8vIC0xIHRvIC1FWFBfTElNSVRcclxuXHJcbiAgICAvLyBUaGUgbWF4aW11bSBleHBvbmVudCB2YWx1ZSwgYWJvdmUgd2hpY2ggb3ZlcmZsb3cgdG8gSW5maW5pdHkgb2NjdXJzLlxyXG4gICAgLy8gSmF2YVNjcmlwdCBudW1iZXJzOiAzMDggICgxLjc5NzY5MzEzNDg2MjMxNTdlKzMwOClcclxuICAgIG1heEU6IEVYUF9MSU1JVCwgICAgICAgICAgICAgICAgICAgICAgIC8vIDEgdG8gRVhQX0xJTUlUXHJcblxyXG4gICAgLy8gV2hldGhlciB0byB1c2UgY3J5cHRvZ3JhcGhpY2FsbHktc2VjdXJlIHJhbmRvbSBudW1iZXIgZ2VuZXJhdGlvbiwgaWYgYXZhaWxhYmxlLlxyXG4gICAgY3J5cHRvOiBmYWxzZSAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gdHJ1ZS9mYWxzZVxyXG4gIH0sXHJcblxyXG5cclxuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0gRU5EIE9GIEVESVRBQkxFIERFRkFVTFRTIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0gLy9cclxuXHJcblxyXG4gIGluZXhhY3QsIHF1YWRyYW50LFxyXG4gIGV4dGVybmFsID0gdHJ1ZSxcclxuXHJcbiAgZGVjaW1hbEVycm9yID0gJ1tEZWNpbWFsRXJyb3JdICcsXHJcbiAgaW52YWxpZEFyZ3VtZW50ID0gZGVjaW1hbEVycm9yICsgJ0ludmFsaWQgYXJndW1lbnQ6ICcsXHJcbiAgcHJlY2lzaW9uTGltaXRFeGNlZWRlZCA9IGRlY2ltYWxFcnJvciArICdQcmVjaXNpb24gbGltaXQgZXhjZWVkZWQnLFxyXG4gIGNyeXB0b1VuYXZhaWxhYmxlID0gZGVjaW1hbEVycm9yICsgJ2NyeXB0byB1bmF2YWlsYWJsZScsXHJcbiAgdGFnID0gJ1tvYmplY3QgRGVjaW1hbF0nLFxyXG5cclxuICBtYXRoZmxvb3IgPSBNYXRoLmZsb29yLFxyXG4gIG1hdGhwb3cgPSBNYXRoLnBvdyxcclxuXHJcbiAgaXNCaW5hcnkgPSAvXjBiKFswMV0rKFxcLlswMV0qKT98XFwuWzAxXSspKHBbKy1dP1xcZCspPyQvaSxcclxuICBpc0hleCA9IC9eMHgoWzAtOWEtZl0rKFxcLlswLTlhLWZdKik/fFxcLlswLTlhLWZdKykocFsrLV0/XFxkKyk/JC9pLFxyXG4gIGlzT2N0YWwgPSAvXjBvKFswLTddKyhcXC5bMC03XSopP3xcXC5bMC03XSspKHBbKy1dP1xcZCspPyQvaSxcclxuICBpc0RlY2ltYWwgPSAvXihcXGQrKFxcLlxcZCopP3xcXC5cXGQrKShlWystXT9cXGQrKT8kL2ksXHJcblxyXG4gIEJBU0UgPSAxZTcsXHJcbiAgTE9HX0JBU0UgPSA3LFxyXG4gIE1BWF9TQUZFX0lOVEVHRVIgPSA5MDA3MTk5MjU0NzQwOTkxLFxyXG5cclxuICBMTjEwX1BSRUNJU0lPTiA9IExOMTAubGVuZ3RoIC0gMSxcclxuICBQSV9QUkVDSVNJT04gPSBQSS5sZW5ndGggLSAxLFxyXG5cclxuICAvLyBEZWNpbWFsLnByb3RvdHlwZSBvYmplY3RcclxuICBQID0geyB0b1N0cmluZ1RhZzogdGFnIH07XHJcblxyXG5cclxuLy8gRGVjaW1hbCBwcm90b3R5cGUgbWV0aG9kc1xyXG5cclxuXHJcbi8qXHJcbiAqICBhYnNvbHV0ZVZhbHVlICAgICAgICAgICAgIGFic1xyXG4gKiAgY2VpbFxyXG4gKiAgY2xhbXBlZFRvICAgICAgICAgICAgICAgICBjbGFtcFxyXG4gKiAgY29tcGFyZWRUbyAgICAgICAgICAgICAgICBjbXBcclxuICogIGNvc2luZSAgICAgICAgICAgICAgICAgICAgY29zXHJcbiAqICBjdWJlUm9vdCAgICAgICAgICAgICAgICAgIGNicnRcclxuICogIGRlY2ltYWxQbGFjZXMgICAgICAgICAgICAgZHBcclxuICogIGRpdmlkZWRCeSAgICAgICAgICAgICAgICAgZGl2XHJcbiAqICBkaXZpZGVkVG9JbnRlZ2VyQnkgICAgICAgIGRpdlRvSW50XHJcbiAqICBlcXVhbHMgICAgICAgICAgICAgICAgICAgIGVxXHJcbiAqICBmbG9vclxyXG4gKiAgZ3JlYXRlclRoYW4gICAgICAgICAgICAgICBndFxyXG4gKiAgZ3JlYXRlclRoYW5PckVxdWFsVG8gICAgICBndGVcclxuICogIGh5cGVyYm9saWNDb3NpbmUgICAgICAgICAgY29zaFxyXG4gKiAgaHlwZXJib2xpY1NpbmUgICAgICAgICAgICBzaW5oXHJcbiAqICBoeXBlcmJvbGljVGFuZ2VudCAgICAgICAgIHRhbmhcclxuICogIGludmVyc2VDb3NpbmUgICAgICAgICAgICAgYWNvc1xyXG4gKiAgaW52ZXJzZUh5cGVyYm9saWNDb3NpbmUgICBhY29zaFxyXG4gKiAgaW52ZXJzZUh5cGVyYm9saWNTaW5lICAgICBhc2luaFxyXG4gKiAgaW52ZXJzZUh5cGVyYm9saWNUYW5nZW50ICBhdGFuaFxyXG4gKiAgaW52ZXJzZVNpbmUgICAgICAgICAgICAgICBhc2luXHJcbiAqICBpbnZlcnNlVGFuZ2VudCAgICAgICAgICAgIGF0YW5cclxuICogIGlzRmluaXRlXHJcbiAqICBpc0ludGVnZXIgICAgICAgICAgICAgICAgIGlzSW50XHJcbiAqICBpc05hTlxyXG4gKiAgaXNOZWdhdGl2ZSAgICAgICAgICAgICAgICBpc05lZ1xyXG4gKiAgaXNQb3NpdGl2ZSAgICAgICAgICAgICAgICBpc1Bvc1xyXG4gKiAgaXNaZXJvXHJcbiAqICBsZXNzVGhhbiAgICAgICAgICAgICAgICAgIGx0XHJcbiAqICBsZXNzVGhhbk9yRXF1YWxUbyAgICAgICAgIGx0ZVxyXG4gKiAgbG9nYXJpdGhtICAgICAgICAgICAgICAgICBsb2dcclxuICogIFttYXhpbXVtXSAgICAgICAgICAgICAgICAgW21heF1cclxuICogIFttaW5pbXVtXSAgICAgICAgICAgICAgICAgW21pbl1cclxuICogIG1pbnVzICAgICAgICAgICAgICAgICAgICAgc3ViXHJcbiAqICBtb2R1bG8gICAgICAgICAgICAgICAgICAgIG1vZFxyXG4gKiAgbmF0dXJhbEV4cG9uZW50aWFsICAgICAgICBleHBcclxuICogIG5hdHVyYWxMb2dhcml0aG0gICAgICAgICAgbG5cclxuICogIG5lZ2F0ZWQgICAgICAgICAgICAgICAgICAgbmVnXHJcbiAqICBwbHVzICAgICAgICAgICAgICAgICAgICAgIGFkZFxyXG4gKiAgcHJlY2lzaW9uICAgICAgICAgICAgICAgICBzZFxyXG4gKiAgcm91bmRcclxuICogIHNpbmUgICAgICAgICAgICAgICAgICAgICAgc2luXHJcbiAqICBzcXVhcmVSb290ICAgICAgICAgICAgICAgIHNxcnRcclxuICogIHRhbmdlbnQgICAgICAgICAgICAgICAgICAgdGFuXHJcbiAqICB0aW1lcyAgICAgICAgICAgICAgICAgICAgIG11bFxyXG4gKiAgdG9CaW5hcnlcclxuICogIHRvRGVjaW1hbFBsYWNlcyAgICAgICAgICAgdG9EUFxyXG4gKiAgdG9FeHBvbmVudGlhbFxyXG4gKiAgdG9GaXhlZFxyXG4gKiAgdG9GcmFjdGlvblxyXG4gKiAgdG9IZXhhZGVjaW1hbCAgICAgICAgICAgICB0b0hleFxyXG4gKiAgdG9OZWFyZXN0XHJcbiAqICB0b051bWJlclxyXG4gKiAgdG9PY3RhbFxyXG4gKiAgdG9Qb3dlciAgICAgICAgICAgICAgICAgICBwb3dcclxuICogIHRvUHJlY2lzaW9uXHJcbiAqICB0b1NpZ25pZmljYW50RGlnaXRzICAgICAgIHRvU0RcclxuICogIHRvU3RyaW5nXHJcbiAqICB0cnVuY2F0ZWQgICAgICAgICAgICAgICAgIHRydW5jXHJcbiAqICB2YWx1ZU9mICAgICAgICAgICAgICAgICAgIHRvSlNPTlxyXG4gKi9cclxuXHJcblxyXG4vKlxyXG4gKiBSZXR1cm4gYSBuZXcgRGVjaW1hbCB3aG9zZSB2YWx1ZSBpcyB0aGUgYWJzb2x1dGUgdmFsdWUgb2YgdGhpcyBEZWNpbWFsLlxyXG4gKlxyXG4gKi9cclxuUC5hYnNvbHV0ZVZhbHVlID0gUC5hYnMgPSBmdW5jdGlvbiAoKSB7XHJcbiAgdmFyIHggPSBuZXcgdGhpcy5jb25zdHJ1Y3Rvcih0aGlzKTtcclxuICBpZiAoeC5zIDwgMCkgeC5zID0gMTtcclxuICByZXR1cm4gZmluYWxpc2UoeCk7XHJcbn07XHJcblxyXG5cclxuLypcclxuICogUmV0dXJuIGEgbmV3IERlY2ltYWwgd2hvc2UgdmFsdWUgaXMgdGhlIHZhbHVlIG9mIHRoaXMgRGVjaW1hbCByb3VuZGVkIHRvIGEgd2hvbGUgbnVtYmVyIGluIHRoZVxyXG4gKiBkaXJlY3Rpb24gb2YgcG9zaXRpdmUgSW5maW5pdHkuXHJcbiAqXHJcbiAqL1xyXG5QLmNlaWwgPSBmdW5jdGlvbiAoKSB7XHJcbiAgcmV0dXJuIGZpbmFsaXNlKG5ldyB0aGlzLmNvbnN0cnVjdG9yKHRoaXMpLCB0aGlzLmUgKyAxLCAyKTtcclxufTtcclxuXHJcblxyXG4vKlxyXG4gKiBSZXR1cm4gYSBuZXcgRGVjaW1hbCB3aG9zZSB2YWx1ZSBpcyB0aGUgdmFsdWUgb2YgdGhpcyBEZWNpbWFsIGNsYW1wZWQgdG8gdGhlIHJhbmdlXHJcbiAqIGRlbGluZWF0ZWQgYnkgYG1pbmAgYW5kIGBtYXhgLlxyXG4gKlxyXG4gKiBtaW4ge251bWJlcnxzdHJpbmd8RGVjaW1hbH1cclxuICogbWF4IHtudW1iZXJ8c3RyaW5nfERlY2ltYWx9XHJcbiAqXHJcbiAqL1xyXG5QLmNsYW1wZWRUbyA9IFAuY2xhbXAgPSBmdW5jdGlvbiAobWluLCBtYXgpIHtcclxuICB2YXIgayxcclxuICAgIHggPSB0aGlzLFxyXG4gICAgQ3RvciA9IHguY29uc3RydWN0b3I7XHJcbiAgbWluID0gbmV3IEN0b3IobWluKTtcclxuICBtYXggPSBuZXcgQ3RvcihtYXgpO1xyXG4gIGlmICghbWluLnMgfHwgIW1heC5zKSByZXR1cm4gbmV3IEN0b3IoTmFOKTtcclxuICBpZiAobWluLmd0KG1heCkpIHRocm93IEVycm9yKGludmFsaWRBcmd1bWVudCArIG1heCk7XHJcbiAgayA9IHguY21wKG1pbik7XHJcbiAgcmV0dXJuIGsgPCAwID8gbWluIDogeC5jbXAobWF4KSA+IDAgPyBtYXggOiBuZXcgQ3Rvcih4KTtcclxufTtcclxuXHJcblxyXG4vKlxyXG4gKiBSZXR1cm5cclxuICogICAxICAgIGlmIHRoZSB2YWx1ZSBvZiB0aGlzIERlY2ltYWwgaXMgZ3JlYXRlciB0aGFuIHRoZSB2YWx1ZSBvZiBgeWAsXHJcbiAqICAtMSAgICBpZiB0aGUgdmFsdWUgb2YgdGhpcyBEZWNpbWFsIGlzIGxlc3MgdGhhbiB0aGUgdmFsdWUgb2YgYHlgLFxyXG4gKiAgIDAgICAgaWYgdGhleSBoYXZlIHRoZSBzYW1lIHZhbHVlLFxyXG4gKiAgIE5hTiAgaWYgdGhlIHZhbHVlIG9mIGVpdGhlciBEZWNpbWFsIGlzIE5hTi5cclxuICpcclxuICovXHJcblAuY29tcGFyZWRUbyA9IFAuY21wID0gZnVuY3Rpb24gKHkpIHtcclxuICB2YXIgaSwgaiwgeGRMLCB5ZEwsXHJcbiAgICB4ID0gdGhpcyxcclxuICAgIHhkID0geC5kLFxyXG4gICAgeWQgPSAoeSA9IG5ldyB4LmNvbnN0cnVjdG9yKHkpKS5kLFxyXG4gICAgeHMgPSB4LnMsXHJcbiAgICB5cyA9IHkucztcclxuXHJcbiAgLy8gRWl0aGVyIE5hTiBvciBcdTAwQjFJbmZpbml0eT9cclxuICBpZiAoIXhkIHx8ICF5ZCkge1xyXG4gICAgcmV0dXJuICF4cyB8fCAheXMgPyBOYU4gOiB4cyAhPT0geXMgPyB4cyA6IHhkID09PSB5ZCA/IDAgOiAheGQgXiB4cyA8IDAgPyAxIDogLTE7XHJcbiAgfVxyXG5cclxuICAvLyBFaXRoZXIgemVybz9cclxuICBpZiAoIXhkWzBdIHx8ICF5ZFswXSkgcmV0dXJuIHhkWzBdID8geHMgOiB5ZFswXSA/IC15cyA6IDA7XHJcblxyXG4gIC8vIFNpZ25zIGRpZmZlcj9cclxuICBpZiAoeHMgIT09IHlzKSByZXR1cm4geHM7XHJcblxyXG4gIC8vIENvbXBhcmUgZXhwb25lbnRzLlxyXG4gIGlmICh4LmUgIT09IHkuZSkgcmV0dXJuIHguZSA+IHkuZSBeIHhzIDwgMCA/IDEgOiAtMTtcclxuXHJcbiAgeGRMID0geGQubGVuZ3RoO1xyXG4gIHlkTCA9IHlkLmxlbmd0aDtcclxuXHJcbiAgLy8gQ29tcGFyZSBkaWdpdCBieSBkaWdpdC5cclxuICBmb3IgKGkgPSAwLCBqID0geGRMIDwgeWRMID8geGRMIDogeWRMOyBpIDwgajsgKytpKSB7XHJcbiAgICBpZiAoeGRbaV0gIT09IHlkW2ldKSByZXR1cm4geGRbaV0gPiB5ZFtpXSBeIHhzIDwgMCA/IDEgOiAtMTtcclxuICB9XHJcblxyXG4gIC8vIENvbXBhcmUgbGVuZ3Rocy5cclxuICByZXR1cm4geGRMID09PSB5ZEwgPyAwIDogeGRMID4geWRMIF4geHMgPCAwID8gMSA6IC0xO1xyXG59O1xyXG5cclxuXHJcbi8qXHJcbiAqIFJldHVybiBhIG5ldyBEZWNpbWFsIHdob3NlIHZhbHVlIGlzIHRoZSBjb3NpbmUgb2YgdGhlIHZhbHVlIGluIHJhZGlhbnMgb2YgdGhpcyBEZWNpbWFsLlxyXG4gKlxyXG4gKiBEb21haW46IFstSW5maW5pdHksIEluZmluaXR5XVxyXG4gKiBSYW5nZTogWy0xLCAxXVxyXG4gKlxyXG4gKiBjb3MoMCkgICAgICAgICA9IDFcclxuICogY29zKC0wKSAgICAgICAgPSAxXHJcbiAqIGNvcyhJbmZpbml0eSkgID0gTmFOXHJcbiAqIGNvcygtSW5maW5pdHkpID0gTmFOXHJcbiAqIGNvcyhOYU4pICAgICAgID0gTmFOXHJcbiAqXHJcbiAqL1xyXG5QLmNvc2luZSA9IFAuY29zID0gZnVuY3Rpb24gKCkge1xyXG4gIHZhciBwciwgcm0sXHJcbiAgICB4ID0gdGhpcyxcclxuICAgIEN0b3IgPSB4LmNvbnN0cnVjdG9yO1xyXG5cclxuICBpZiAoIXguZCkgcmV0dXJuIG5ldyBDdG9yKE5hTik7XHJcblxyXG4gIC8vIGNvcygwKSA9IGNvcygtMCkgPSAxXHJcbiAgaWYgKCF4LmRbMF0pIHJldHVybiBuZXcgQ3RvcigxKTtcclxuXHJcbiAgcHIgPSBDdG9yLnByZWNpc2lvbjtcclxuICBybSA9IEN0b3Iucm91bmRpbmc7XHJcbiAgQ3Rvci5wcmVjaXNpb24gPSBwciArIE1hdGgubWF4KHguZSwgeC5zZCgpKSArIExPR19CQVNFO1xyXG4gIEN0b3Iucm91bmRpbmcgPSAxO1xyXG5cclxuICB4ID0gY29zaW5lKEN0b3IsIHRvTGVzc1RoYW5IYWxmUGkoQ3RvciwgeCkpO1xyXG5cclxuICBDdG9yLnByZWNpc2lvbiA9IHByO1xyXG4gIEN0b3Iucm91bmRpbmcgPSBybTtcclxuXHJcbiAgcmV0dXJuIGZpbmFsaXNlKHF1YWRyYW50ID09IDIgfHwgcXVhZHJhbnQgPT0gMyA/IHgubmVnKCkgOiB4LCBwciwgcm0sIHRydWUpO1xyXG59O1xyXG5cclxuXHJcbi8qXHJcbiAqXHJcbiAqIFJldHVybiBhIG5ldyBEZWNpbWFsIHdob3NlIHZhbHVlIGlzIHRoZSBjdWJlIHJvb3Qgb2YgdGhlIHZhbHVlIG9mIHRoaXMgRGVjaW1hbCwgcm91bmRlZCB0b1xyXG4gKiBgcHJlY2lzaW9uYCBzaWduaWZpY2FudCBkaWdpdHMgdXNpbmcgcm91bmRpbmcgbW9kZSBgcm91bmRpbmdgLlxyXG4gKlxyXG4gKiAgY2JydCgwKSAgPSAgMFxyXG4gKiAgY2JydCgtMCkgPSAtMFxyXG4gKiAgY2JydCgxKSAgPSAgMVxyXG4gKiAgY2JydCgtMSkgPSAtMVxyXG4gKiAgY2JydChOKSAgPSAgTlxyXG4gKiAgY2JydCgtSSkgPSAtSVxyXG4gKiAgY2JydChJKSAgPSAgSVxyXG4gKlxyXG4gKiBNYXRoLmNicnQoeCkgPSAoeCA8IDAgPyAtTWF0aC5wb3coLXgsIDEvMykgOiBNYXRoLnBvdyh4LCAxLzMpKVxyXG4gKlxyXG4gKi9cclxuUC5jdWJlUm9vdCA9IFAuY2JydCA9IGZ1bmN0aW9uICgpIHtcclxuICB2YXIgZSwgbSwgbiwgciwgcmVwLCBzLCBzZCwgdCwgdDMsIHQzcGx1c3gsXHJcbiAgICB4ID0gdGhpcyxcclxuICAgIEN0b3IgPSB4LmNvbnN0cnVjdG9yO1xyXG5cclxuICBpZiAoIXguaXNGaW5pdGUoKSB8fCB4LmlzWmVybygpKSByZXR1cm4gbmV3IEN0b3IoeCk7XHJcbiAgZXh0ZXJuYWwgPSBmYWxzZTtcclxuXHJcbiAgLy8gSW5pdGlhbCBlc3RpbWF0ZS5cclxuICBzID0geC5zICogbWF0aHBvdyh4LnMgKiB4LCAxIC8gMyk7XHJcblxyXG4gICAvLyBNYXRoLmNicnQgdW5kZXJmbG93L292ZXJmbG93P1xyXG4gICAvLyBQYXNzIHggdG8gTWF0aC5wb3cgYXMgaW50ZWdlciwgdGhlbiBhZGp1c3QgdGhlIGV4cG9uZW50IG9mIHRoZSByZXN1bHQuXHJcbiAgaWYgKCFzIHx8IE1hdGguYWJzKHMpID09IDEgLyAwKSB7XHJcbiAgICBuID0gZGlnaXRzVG9TdHJpbmcoeC5kKTtcclxuICAgIGUgPSB4LmU7XHJcblxyXG4gICAgLy8gQWRqdXN0IG4gZXhwb25lbnQgc28gaXQgaXMgYSBtdWx0aXBsZSBvZiAzIGF3YXkgZnJvbSB4IGV4cG9uZW50LlxyXG4gICAgaWYgKHMgPSAoZSAtIG4ubGVuZ3RoICsgMSkgJSAzKSBuICs9IChzID09IDEgfHwgcyA9PSAtMiA/ICcwJyA6ICcwMCcpO1xyXG4gICAgcyA9IG1hdGhwb3cobiwgMSAvIDMpO1xyXG5cclxuICAgIC8vIFJhcmVseSwgZSBtYXkgYmUgb25lIGxlc3MgdGhhbiB0aGUgcmVzdWx0IGV4cG9uZW50IHZhbHVlLlxyXG4gICAgZSA9IG1hdGhmbG9vcigoZSArIDEpIC8gMykgLSAoZSAlIDMgPT0gKGUgPCAwID8gLTEgOiAyKSk7XHJcblxyXG4gICAgaWYgKHMgPT0gMSAvIDApIHtcclxuICAgICAgbiA9ICc1ZScgKyBlO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgbiA9IHMudG9FeHBvbmVudGlhbCgpO1xyXG4gICAgICBuID0gbi5zbGljZSgwLCBuLmluZGV4T2YoJ2UnKSArIDEpICsgZTtcclxuICAgIH1cclxuXHJcbiAgICByID0gbmV3IEN0b3Iobik7XHJcbiAgICByLnMgPSB4LnM7XHJcbiAgfSBlbHNlIHtcclxuICAgIHIgPSBuZXcgQ3RvcihzLnRvU3RyaW5nKCkpO1xyXG4gIH1cclxuXHJcbiAgc2QgPSAoZSA9IEN0b3IucHJlY2lzaW9uKSArIDM7XHJcblxyXG4gIC8vIEhhbGxleSdzIG1ldGhvZC5cclxuICAvLyBUT0RPPyBDb21wYXJlIE5ld3RvbidzIG1ldGhvZC5cclxuICBmb3IgKDs7KSB7XHJcbiAgICB0ID0gcjtcclxuICAgIHQzID0gdC50aW1lcyh0KS50aW1lcyh0KTtcclxuICAgIHQzcGx1c3ggPSB0My5wbHVzKHgpO1xyXG4gICAgciA9IGRpdmlkZSh0M3BsdXN4LnBsdXMoeCkudGltZXModCksIHQzcGx1c3gucGx1cyh0MyksIHNkICsgMiwgMSk7XHJcblxyXG4gICAgLy8gVE9ETz8gUmVwbGFjZSB3aXRoIGZvci1sb29wIGFuZCBjaGVja1JvdW5kaW5nRGlnaXRzLlxyXG4gICAgaWYgKGRpZ2l0c1RvU3RyaW5nKHQuZCkuc2xpY2UoMCwgc2QpID09PSAobiA9IGRpZ2l0c1RvU3RyaW5nKHIuZCkpLnNsaWNlKDAsIHNkKSkge1xyXG4gICAgICBuID0gbi5zbGljZShzZCAtIDMsIHNkICsgMSk7XHJcblxyXG4gICAgICAvLyBUaGUgNHRoIHJvdW5kaW5nIGRpZ2l0IG1heSBiZSBpbiBlcnJvciBieSAtMSBzbyBpZiB0aGUgNCByb3VuZGluZyBkaWdpdHMgYXJlIDk5OTkgb3IgNDk5OVxyXG4gICAgICAvLyAsIGkuZS4gYXBwcm9hY2hpbmcgYSByb3VuZGluZyBib3VuZGFyeSwgY29udGludWUgdGhlIGl0ZXJhdGlvbi5cclxuICAgICAgaWYgKG4gPT0gJzk5OTknIHx8ICFyZXAgJiYgbiA9PSAnNDk5OScpIHtcclxuXHJcbiAgICAgICAgLy8gT24gdGhlIGZpcnN0IGl0ZXJhdGlvbiBvbmx5LCBjaGVjayB0byBzZWUgaWYgcm91bmRpbmcgdXAgZ2l2ZXMgdGhlIGV4YWN0IHJlc3VsdCBhcyB0aGVcclxuICAgICAgICAvLyBuaW5lcyBtYXkgaW5maW5pdGVseSByZXBlYXQuXHJcbiAgICAgICAgaWYgKCFyZXApIHtcclxuICAgICAgICAgIGZpbmFsaXNlKHQsIGUgKyAxLCAwKTtcclxuXHJcbiAgICAgICAgICBpZiAodC50aW1lcyh0KS50aW1lcyh0KS5lcSh4KSkge1xyXG4gICAgICAgICAgICByID0gdDtcclxuICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBzZCArPSA0O1xyXG4gICAgICAgIHJlcCA9IDE7XHJcbiAgICAgIH0gZWxzZSB7XHJcblxyXG4gICAgICAgIC8vIElmIHRoZSByb3VuZGluZyBkaWdpdHMgYXJlIG51bGwsIDB7MCw0fSBvciA1MHswLDN9LCBjaGVjayBmb3IgYW4gZXhhY3QgcmVzdWx0LlxyXG4gICAgICAgIC8vIElmIG5vdCwgdGhlbiB0aGVyZSBhcmUgZnVydGhlciBkaWdpdHMgYW5kIG0gd2lsbCBiZSB0cnV0aHkuXHJcbiAgICAgICAgaWYgKCErbiB8fCAhK24uc2xpY2UoMSkgJiYgbi5jaGFyQXQoMCkgPT0gJzUnKSB7XHJcblxyXG4gICAgICAgICAgLy8gVHJ1bmNhdGUgdG8gdGhlIGZpcnN0IHJvdW5kaW5nIGRpZ2l0LlxyXG4gICAgICAgICAgZmluYWxpc2UociwgZSArIDEsIDEpO1xyXG4gICAgICAgICAgbSA9ICFyLnRpbWVzKHIpLnRpbWVzKHIpLmVxKHgpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgYnJlYWs7XHJcbiAgICAgIH1cclxuICAgIH1cclxuICB9XHJcblxyXG4gIGV4dGVybmFsID0gdHJ1ZTtcclxuXHJcbiAgcmV0dXJuIGZpbmFsaXNlKHIsIGUsIEN0b3Iucm91bmRpbmcsIG0pO1xyXG59O1xyXG5cclxuXHJcbi8qXHJcbiAqIFJldHVybiB0aGUgbnVtYmVyIG9mIGRlY2ltYWwgcGxhY2VzIG9mIHRoZSB2YWx1ZSBvZiB0aGlzIERlY2ltYWwuXHJcbiAqXHJcbiAqL1xyXG5QLmRlY2ltYWxQbGFjZXMgPSBQLmRwID0gZnVuY3Rpb24gKCkge1xyXG4gIHZhciB3LFxyXG4gICAgZCA9IHRoaXMuZCxcclxuICAgIG4gPSBOYU47XHJcblxyXG4gIGlmIChkKSB7XHJcbiAgICB3ID0gZC5sZW5ndGggLSAxO1xyXG4gICAgbiA9ICh3IC0gbWF0aGZsb29yKHRoaXMuZSAvIExPR19CQVNFKSkgKiBMT0dfQkFTRTtcclxuXHJcbiAgICAvLyBTdWJ0cmFjdCB0aGUgbnVtYmVyIG9mIHRyYWlsaW5nIHplcm9zIG9mIHRoZSBsYXN0IHdvcmQuXHJcbiAgICB3ID0gZFt3XTtcclxuICAgIGlmICh3KSBmb3IgKDsgdyAlIDEwID09IDA7IHcgLz0gMTApIG4tLTtcclxuICAgIGlmIChuIDwgMCkgbiA9IDA7XHJcbiAgfVxyXG5cclxuICByZXR1cm4gbjtcclxufTtcclxuXHJcblxyXG4vKlxyXG4gKiAgbiAvIDAgPSBJXHJcbiAqICBuIC8gTiA9IE5cclxuICogIG4gLyBJID0gMFxyXG4gKiAgMCAvIG4gPSAwXHJcbiAqICAwIC8gMCA9IE5cclxuICogIDAgLyBOID0gTlxyXG4gKiAgMCAvIEkgPSAwXHJcbiAqICBOIC8gbiA9IE5cclxuICogIE4gLyAwID0gTlxyXG4gKiAgTiAvIE4gPSBOXHJcbiAqICBOIC8gSSA9IE5cclxuICogIEkgLyBuID0gSVxyXG4gKiAgSSAvIDAgPSBJXHJcbiAqICBJIC8gTiA9IE5cclxuICogIEkgLyBJID0gTlxyXG4gKlxyXG4gKiBSZXR1cm4gYSBuZXcgRGVjaW1hbCB3aG9zZSB2YWx1ZSBpcyB0aGUgdmFsdWUgb2YgdGhpcyBEZWNpbWFsIGRpdmlkZWQgYnkgYHlgLCByb3VuZGVkIHRvXHJcbiAqIGBwcmVjaXNpb25gIHNpZ25pZmljYW50IGRpZ2l0cyB1c2luZyByb3VuZGluZyBtb2RlIGByb3VuZGluZ2AuXHJcbiAqXHJcbiAqL1xyXG5QLmRpdmlkZWRCeSA9IFAuZGl2ID0gZnVuY3Rpb24gKHkpIHtcclxuICByZXR1cm4gZGl2aWRlKHRoaXMsIG5ldyB0aGlzLmNvbnN0cnVjdG9yKHkpKTtcclxufTtcclxuXHJcblxyXG4vKlxyXG4gKiBSZXR1cm4gYSBuZXcgRGVjaW1hbCB3aG9zZSB2YWx1ZSBpcyB0aGUgaW50ZWdlciBwYXJ0IG9mIGRpdmlkaW5nIHRoZSB2YWx1ZSBvZiB0aGlzIERlY2ltYWxcclxuICogYnkgdGhlIHZhbHVlIG9mIGB5YCwgcm91bmRlZCB0byBgcHJlY2lzaW9uYCBzaWduaWZpY2FudCBkaWdpdHMgdXNpbmcgcm91bmRpbmcgbW9kZSBgcm91bmRpbmdgLlxyXG4gKlxyXG4gKi9cclxuUC5kaXZpZGVkVG9JbnRlZ2VyQnkgPSBQLmRpdlRvSW50ID0gZnVuY3Rpb24gKHkpIHtcclxuICB2YXIgeCA9IHRoaXMsXHJcbiAgICBDdG9yID0geC5jb25zdHJ1Y3RvcjtcclxuICByZXR1cm4gZmluYWxpc2UoZGl2aWRlKHgsIG5ldyBDdG9yKHkpLCAwLCAxLCAxKSwgQ3Rvci5wcmVjaXNpb24sIEN0b3Iucm91bmRpbmcpO1xyXG59O1xyXG5cclxuXHJcbi8qXHJcbiAqIFJldHVybiB0cnVlIGlmIHRoZSB2YWx1ZSBvZiB0aGlzIERlY2ltYWwgaXMgZXF1YWwgdG8gdGhlIHZhbHVlIG9mIGB5YCwgb3RoZXJ3aXNlIHJldHVybiBmYWxzZS5cclxuICpcclxuICovXHJcblAuZXF1YWxzID0gUC5lcSA9IGZ1bmN0aW9uICh5KSB7XHJcbiAgcmV0dXJuIHRoaXMuY21wKHkpID09PSAwO1xyXG59O1xyXG5cclxuXHJcbi8qXHJcbiAqIFJldHVybiBhIG5ldyBEZWNpbWFsIHdob3NlIHZhbHVlIGlzIHRoZSB2YWx1ZSBvZiB0aGlzIERlY2ltYWwgcm91bmRlZCB0byBhIHdob2xlIG51bWJlciBpbiB0aGVcclxuICogZGlyZWN0aW9uIG9mIG5lZ2F0aXZlIEluZmluaXR5LlxyXG4gKlxyXG4gKi9cclxuUC5mbG9vciA9IGZ1bmN0aW9uICgpIHtcclxuICByZXR1cm4gZmluYWxpc2UobmV3IHRoaXMuY29uc3RydWN0b3IodGhpcyksIHRoaXMuZSArIDEsIDMpO1xyXG59O1xyXG5cclxuXHJcbi8qXHJcbiAqIFJldHVybiB0cnVlIGlmIHRoZSB2YWx1ZSBvZiB0aGlzIERlY2ltYWwgaXMgZ3JlYXRlciB0aGFuIHRoZSB2YWx1ZSBvZiBgeWAsIG90aGVyd2lzZSByZXR1cm5cclxuICogZmFsc2UuXHJcbiAqXHJcbiAqL1xyXG5QLmdyZWF0ZXJUaGFuID0gUC5ndCA9IGZ1bmN0aW9uICh5KSB7XHJcbiAgcmV0dXJuIHRoaXMuY21wKHkpID4gMDtcclxufTtcclxuXHJcblxyXG4vKlxyXG4gKiBSZXR1cm4gdHJ1ZSBpZiB0aGUgdmFsdWUgb2YgdGhpcyBEZWNpbWFsIGlzIGdyZWF0ZXIgdGhhbiBvciBlcXVhbCB0byB0aGUgdmFsdWUgb2YgYHlgLFxyXG4gKiBvdGhlcndpc2UgcmV0dXJuIGZhbHNlLlxyXG4gKlxyXG4gKi9cclxuUC5ncmVhdGVyVGhhbk9yRXF1YWxUbyA9IFAuZ3RlID0gZnVuY3Rpb24gKHkpIHtcclxuICB2YXIgayA9IHRoaXMuY21wKHkpO1xyXG4gIHJldHVybiBrID09IDEgfHwgayA9PT0gMDtcclxufTtcclxuXHJcblxyXG4vKlxyXG4gKiBSZXR1cm4gYSBuZXcgRGVjaW1hbCB3aG9zZSB2YWx1ZSBpcyB0aGUgaHlwZXJib2xpYyBjb3NpbmUgb2YgdGhlIHZhbHVlIGluIHJhZGlhbnMgb2YgdGhpc1xyXG4gKiBEZWNpbWFsLlxyXG4gKlxyXG4gKiBEb21haW46IFstSW5maW5pdHksIEluZmluaXR5XVxyXG4gKiBSYW5nZTogWzEsIEluZmluaXR5XVxyXG4gKlxyXG4gKiBjb3NoKHgpID0gMSArIHheMi8yISArIHheNC80ISArIHheNi82ISArIC4uLlxyXG4gKlxyXG4gKiBjb3NoKDApICAgICAgICAgPSAxXHJcbiAqIGNvc2goLTApICAgICAgICA9IDFcclxuICogY29zaChJbmZpbml0eSkgID0gSW5maW5pdHlcclxuICogY29zaCgtSW5maW5pdHkpID0gSW5maW5pdHlcclxuICogY29zaChOYU4pICAgICAgID0gTmFOXHJcbiAqXHJcbiAqICB4ICAgICAgICB0aW1lIHRha2VuIChtcykgICByZXN1bHRcclxuICogMTAwMCAgICAgIDkgICAgICAgICAgICAgICAgIDkuODUwMzU1NTcwMDg1MjM0OTY5NGUrNDMzXHJcbiAqIDEwMDAwICAgICAyNSAgICAgICAgICAgICAgICA0LjQwMzQwOTExMjgzMTQ2MDc5MzZlKzQzNDJcclxuICogMTAwMDAwICAgIDE3MSAgICAgICAgICAgICAgIDEuNDAzMzMxNjgwMjEzMDYxNTg5N2UrNDM0MjlcclxuICogMTAwMDAwMCAgIDM4MTcgICAgICAgICAgICAgIDEuNTE2NjA3Njk4NDAxMDQzNzcyNWUrNDM0Mjk0XHJcbiAqIDEwMDAwMDAwICBhYmFuZG9uZWQgYWZ0ZXIgMiBtaW51dGUgd2FpdFxyXG4gKlxyXG4gKiBUT0RPPyBDb21wYXJlIHBlcmZvcm1hbmNlIG9mIGNvc2goeCkgPSAwLjUgKiAoZXhwKHgpICsgZXhwKC14KSlcclxuICpcclxuICovXHJcblAuaHlwZXJib2xpY0Nvc2luZSA9IFAuY29zaCA9IGZ1bmN0aW9uICgpIHtcclxuICB2YXIgaywgbiwgcHIsIHJtLCBsZW4sXHJcbiAgICB4ID0gdGhpcyxcclxuICAgIEN0b3IgPSB4LmNvbnN0cnVjdG9yLFxyXG4gICAgb25lID0gbmV3IEN0b3IoMSk7XHJcblxyXG4gIGlmICgheC5pc0Zpbml0ZSgpKSByZXR1cm4gbmV3IEN0b3IoeC5zID8gMSAvIDAgOiBOYU4pO1xyXG4gIGlmICh4LmlzWmVybygpKSByZXR1cm4gb25lO1xyXG5cclxuICBwciA9IEN0b3IucHJlY2lzaW9uO1xyXG4gIHJtID0gQ3Rvci5yb3VuZGluZztcclxuICBDdG9yLnByZWNpc2lvbiA9IHByICsgTWF0aC5tYXgoeC5lLCB4LnNkKCkpICsgNDtcclxuICBDdG9yLnJvdW5kaW5nID0gMTtcclxuICBsZW4gPSB4LmQubGVuZ3RoO1xyXG5cclxuICAvLyBBcmd1bWVudCByZWR1Y3Rpb246IGNvcyg0eCkgPSAxIC0gOGNvc14yKHgpICsgOGNvc140KHgpICsgMVxyXG4gIC8vIGkuZS4gY29zKHgpID0gMSAtIGNvc14yKHgvNCkoOCAtIDhjb3NeMih4LzQpKVxyXG5cclxuICAvLyBFc3RpbWF0ZSB0aGUgb3B0aW11bSBudW1iZXIgb2YgdGltZXMgdG8gdXNlIHRoZSBhcmd1bWVudCByZWR1Y3Rpb24uXHJcbiAgLy8gVE9ETz8gRXN0aW1hdGlvbiByZXVzZWQgZnJvbSBjb3NpbmUoKSBhbmQgbWF5IG5vdCBiZSBvcHRpbWFsIGhlcmUuXHJcbiAgaWYgKGxlbiA8IDMyKSB7XHJcbiAgICBrID0gTWF0aC5jZWlsKGxlbiAvIDMpO1xyXG4gICAgbiA9ICgxIC8gdGlueVBvdyg0LCBrKSkudG9TdHJpbmcoKTtcclxuICB9IGVsc2Uge1xyXG4gICAgayA9IDE2O1xyXG4gICAgbiA9ICcyLjMyODMwNjQzNjUzODY5NjI4OTA2MjVlLTEwJztcclxuICB9XHJcblxyXG4gIHggPSB0YXlsb3JTZXJpZXMoQ3RvciwgMSwgeC50aW1lcyhuKSwgbmV3IEN0b3IoMSksIHRydWUpO1xyXG5cclxuICAvLyBSZXZlcnNlIGFyZ3VtZW50IHJlZHVjdGlvblxyXG4gIHZhciBjb3NoMl94LFxyXG4gICAgaSA9IGssXHJcbiAgICBkOCA9IG5ldyBDdG9yKDgpO1xyXG4gIGZvciAoOyBpLS07KSB7XHJcbiAgICBjb3NoMl94ID0geC50aW1lcyh4KTtcclxuICAgIHggPSBvbmUubWludXMoY29zaDJfeC50aW1lcyhkOC5taW51cyhjb3NoMl94LnRpbWVzKGQ4KSkpKTtcclxuICB9XHJcblxyXG4gIHJldHVybiBmaW5hbGlzZSh4LCBDdG9yLnByZWNpc2lvbiA9IHByLCBDdG9yLnJvdW5kaW5nID0gcm0sIHRydWUpO1xyXG59O1xyXG5cclxuXHJcbi8qXHJcbiAqIFJldHVybiBhIG5ldyBEZWNpbWFsIHdob3NlIHZhbHVlIGlzIHRoZSBoeXBlcmJvbGljIHNpbmUgb2YgdGhlIHZhbHVlIGluIHJhZGlhbnMgb2YgdGhpc1xyXG4gKiBEZWNpbWFsLlxyXG4gKlxyXG4gKiBEb21haW46IFstSW5maW5pdHksIEluZmluaXR5XVxyXG4gKiBSYW5nZTogWy1JbmZpbml0eSwgSW5maW5pdHldXHJcbiAqXHJcbiAqIHNpbmgoeCkgPSB4ICsgeF4zLzMhICsgeF41LzUhICsgeF43LzchICsgLi4uXHJcbiAqXHJcbiAqIHNpbmgoMCkgICAgICAgICA9IDBcclxuICogc2luaCgtMCkgICAgICAgID0gLTBcclxuICogc2luaChJbmZpbml0eSkgID0gSW5maW5pdHlcclxuICogc2luaCgtSW5maW5pdHkpID0gLUluZmluaXR5XHJcbiAqIHNpbmgoTmFOKSAgICAgICA9IE5hTlxyXG4gKlxyXG4gKiB4ICAgICAgICB0aW1lIHRha2VuIChtcylcclxuICogMTAgICAgICAgMiBtc1xyXG4gKiAxMDAgICAgICA1IG1zXHJcbiAqIDEwMDAgICAgIDE0IG1zXHJcbiAqIDEwMDAwICAgIDgyIG1zXHJcbiAqIDEwMDAwMCAgIDg4NiBtcyAgICAgICAgICAgIDEuNDAzMzMxNjgwMjEzMDYxNTg5N2UrNDM0MjlcclxuICogMjAwMDAwICAgMjYxMyBtc1xyXG4gKiAzMDAwMDAgICA1NDA3IG1zXHJcbiAqIDQwMDAwMCAgIDg4MjQgbXNcclxuICogNTAwMDAwICAgMTMwMjYgbXMgICAgICAgICAgOC43MDgwNjQzNjEyNzE4MDg0MTI5ZSsyMTcxNDZcclxuICogMTAwMDAwMCAgNDg1NDMgbXNcclxuICpcclxuICogVE9ETz8gQ29tcGFyZSBwZXJmb3JtYW5jZSBvZiBzaW5oKHgpID0gMC41ICogKGV4cCh4KSAtIGV4cCgteCkpXHJcbiAqXHJcbiAqL1xyXG5QLmh5cGVyYm9saWNTaW5lID0gUC5zaW5oID0gZnVuY3Rpb24gKCkge1xyXG4gIHZhciBrLCBwciwgcm0sIGxlbixcclxuICAgIHggPSB0aGlzLFxyXG4gICAgQ3RvciA9IHguY29uc3RydWN0b3I7XHJcblxyXG4gIGlmICgheC5pc0Zpbml0ZSgpIHx8IHguaXNaZXJvKCkpIHJldHVybiBuZXcgQ3Rvcih4KTtcclxuXHJcbiAgcHIgPSBDdG9yLnByZWNpc2lvbjtcclxuICBybSA9IEN0b3Iucm91bmRpbmc7XHJcbiAgQ3Rvci5wcmVjaXNpb24gPSBwciArIE1hdGgubWF4KHguZSwgeC5zZCgpKSArIDQ7XHJcbiAgQ3Rvci5yb3VuZGluZyA9IDE7XHJcbiAgbGVuID0geC5kLmxlbmd0aDtcclxuXHJcbiAgaWYgKGxlbiA8IDMpIHtcclxuICAgIHggPSB0YXlsb3JTZXJpZXMoQ3RvciwgMiwgeCwgeCwgdHJ1ZSk7XHJcbiAgfSBlbHNlIHtcclxuXHJcbiAgICAvLyBBbHRlcm5hdGl2ZSBhcmd1bWVudCByZWR1Y3Rpb246IHNpbmgoM3gpID0gc2luaCh4KSgzICsgNHNpbmheMih4KSlcclxuICAgIC8vIGkuZS4gc2luaCh4KSA9IHNpbmgoeC8zKSgzICsgNHNpbmheMih4LzMpKVxyXG4gICAgLy8gMyBtdWx0aXBsaWNhdGlvbnMgYW5kIDEgYWRkaXRpb25cclxuXHJcbiAgICAvLyBBcmd1bWVudCByZWR1Y3Rpb246IHNpbmgoNXgpID0gc2luaCh4KSg1ICsgc2luaF4yKHgpKDIwICsgMTZzaW5oXjIoeCkpKVxyXG4gICAgLy8gaS5lLiBzaW5oKHgpID0gc2luaCh4LzUpKDUgKyBzaW5oXjIoeC81KSgyMCArIDE2c2luaF4yKHgvNSkpKVxyXG4gICAgLy8gNCBtdWx0aXBsaWNhdGlvbnMgYW5kIDIgYWRkaXRpb25zXHJcblxyXG4gICAgLy8gRXN0aW1hdGUgdGhlIG9wdGltdW0gbnVtYmVyIG9mIHRpbWVzIHRvIHVzZSB0aGUgYXJndW1lbnQgcmVkdWN0aW9uLlxyXG4gICAgayA9IDEuNCAqIE1hdGguc3FydChsZW4pO1xyXG4gICAgayA9IGsgPiAxNiA/IDE2IDogayB8IDA7XHJcblxyXG4gICAgeCA9IHgudGltZXMoMSAvIHRpbnlQb3coNSwgaykpO1xyXG4gICAgeCA9IHRheWxvclNlcmllcyhDdG9yLCAyLCB4LCB4LCB0cnVlKTtcclxuXHJcbiAgICAvLyBSZXZlcnNlIGFyZ3VtZW50IHJlZHVjdGlvblxyXG4gICAgdmFyIHNpbmgyX3gsXHJcbiAgICAgIGQ1ID0gbmV3IEN0b3IoNSksXHJcbiAgICAgIGQxNiA9IG5ldyBDdG9yKDE2KSxcclxuICAgICAgZDIwID0gbmV3IEN0b3IoMjApO1xyXG4gICAgZm9yICg7IGstLTspIHtcclxuICAgICAgc2luaDJfeCA9IHgudGltZXMoeCk7XHJcbiAgICAgIHggPSB4LnRpbWVzKGQ1LnBsdXMoc2luaDJfeC50aW1lcyhkMTYudGltZXMoc2luaDJfeCkucGx1cyhkMjApKSkpO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgQ3Rvci5wcmVjaXNpb24gPSBwcjtcclxuICBDdG9yLnJvdW5kaW5nID0gcm07XHJcblxyXG4gIHJldHVybiBmaW5hbGlzZSh4LCBwciwgcm0sIHRydWUpO1xyXG59O1xyXG5cclxuXHJcbi8qXHJcbiAqIFJldHVybiBhIG5ldyBEZWNpbWFsIHdob3NlIHZhbHVlIGlzIHRoZSBoeXBlcmJvbGljIHRhbmdlbnQgb2YgdGhlIHZhbHVlIGluIHJhZGlhbnMgb2YgdGhpc1xyXG4gKiBEZWNpbWFsLlxyXG4gKlxyXG4gKiBEb21haW46IFstSW5maW5pdHksIEluZmluaXR5XVxyXG4gKiBSYW5nZTogWy0xLCAxXVxyXG4gKlxyXG4gKiB0YW5oKHgpID0gc2luaCh4KSAvIGNvc2goeClcclxuICpcclxuICogdGFuaCgwKSAgICAgICAgID0gMFxyXG4gKiB0YW5oKC0wKSAgICAgICAgPSAtMFxyXG4gKiB0YW5oKEluZmluaXR5KSAgPSAxXHJcbiAqIHRhbmgoLUluZmluaXR5KSA9IC0xXHJcbiAqIHRhbmgoTmFOKSAgICAgICA9IE5hTlxyXG4gKlxyXG4gKi9cclxuUC5oeXBlcmJvbGljVGFuZ2VudCA9IFAudGFuaCA9IGZ1bmN0aW9uICgpIHtcclxuICB2YXIgcHIsIHJtLFxyXG4gICAgeCA9IHRoaXMsXHJcbiAgICBDdG9yID0geC5jb25zdHJ1Y3RvcjtcclxuXHJcbiAgaWYgKCF4LmlzRmluaXRlKCkpIHJldHVybiBuZXcgQ3Rvcih4LnMpO1xyXG4gIGlmICh4LmlzWmVybygpKSByZXR1cm4gbmV3IEN0b3IoeCk7XHJcblxyXG4gIHByID0gQ3Rvci5wcmVjaXNpb247XHJcbiAgcm0gPSBDdG9yLnJvdW5kaW5nO1xyXG4gIEN0b3IucHJlY2lzaW9uID0gcHIgKyA3O1xyXG4gIEN0b3Iucm91bmRpbmcgPSAxO1xyXG5cclxuICByZXR1cm4gZGl2aWRlKHguc2luaCgpLCB4LmNvc2goKSwgQ3Rvci5wcmVjaXNpb24gPSBwciwgQ3Rvci5yb3VuZGluZyA9IHJtKTtcclxufTtcclxuXHJcblxyXG4vKlxyXG4gKiBSZXR1cm4gYSBuZXcgRGVjaW1hbCB3aG9zZSB2YWx1ZSBpcyB0aGUgYXJjY29zaW5lIChpbnZlcnNlIGNvc2luZSkgaW4gcmFkaWFucyBvZiB0aGUgdmFsdWUgb2ZcclxuICogdGhpcyBEZWNpbWFsLlxyXG4gKlxyXG4gKiBEb21haW46IFstMSwgMV1cclxuICogUmFuZ2U6IFswLCBwaV1cclxuICpcclxuICogYWNvcyh4KSA9IHBpLzIgLSBhc2luKHgpXHJcbiAqXHJcbiAqIGFjb3MoMCkgICAgICAgPSBwaS8yXHJcbiAqIGFjb3MoLTApICAgICAgPSBwaS8yXHJcbiAqIGFjb3MoMSkgICAgICAgPSAwXHJcbiAqIGFjb3MoLTEpICAgICAgPSBwaVxyXG4gKiBhY29zKDEvMikgICAgID0gcGkvM1xyXG4gKiBhY29zKC0xLzIpICAgID0gMipwaS8zXHJcbiAqIGFjb3MofHh8ID4gMSkgPSBOYU5cclxuICogYWNvcyhOYU4pICAgICA9IE5hTlxyXG4gKlxyXG4gKi9cclxuUC5pbnZlcnNlQ29zaW5lID0gUC5hY29zID0gZnVuY3Rpb24gKCkge1xyXG4gIHZhciBoYWxmUGksXHJcbiAgICB4ID0gdGhpcyxcclxuICAgIEN0b3IgPSB4LmNvbnN0cnVjdG9yLFxyXG4gICAgayA9IHguYWJzKCkuY21wKDEpLFxyXG4gICAgcHIgPSBDdG9yLnByZWNpc2lvbixcclxuICAgIHJtID0gQ3Rvci5yb3VuZGluZztcclxuXHJcbiAgaWYgKGsgIT09IC0xKSB7XHJcbiAgICByZXR1cm4gayA9PT0gMFxyXG4gICAgICAvLyB8eHwgaXMgMVxyXG4gICAgICA/IHguaXNOZWcoKSA/IGdldFBpKEN0b3IsIHByLCBybSkgOiBuZXcgQ3RvcigwKVxyXG4gICAgICAvLyB8eHwgPiAxIG9yIHggaXMgTmFOXHJcbiAgICAgIDogbmV3IEN0b3IoTmFOKTtcclxuICB9XHJcblxyXG4gIGlmICh4LmlzWmVybygpKSByZXR1cm4gZ2V0UGkoQ3RvciwgcHIgKyA0LCBybSkudGltZXMoMC41KTtcclxuXHJcbiAgLy8gVE9ETz8gU3BlY2lhbCBjYXNlIGFjb3MoMC41KSA9IHBpLzMgYW5kIGFjb3MoLTAuNSkgPSAyKnBpLzNcclxuXHJcbiAgQ3Rvci5wcmVjaXNpb24gPSBwciArIDY7XHJcbiAgQ3Rvci5yb3VuZGluZyA9IDE7XHJcblxyXG4gIHggPSB4LmFzaW4oKTtcclxuICBoYWxmUGkgPSBnZXRQaShDdG9yLCBwciArIDQsIHJtKS50aW1lcygwLjUpO1xyXG5cclxuICBDdG9yLnByZWNpc2lvbiA9IHByO1xyXG4gIEN0b3Iucm91bmRpbmcgPSBybTtcclxuXHJcbiAgcmV0dXJuIGhhbGZQaS5taW51cyh4KTtcclxufTtcclxuXHJcblxyXG4vKlxyXG4gKiBSZXR1cm4gYSBuZXcgRGVjaW1hbCB3aG9zZSB2YWx1ZSBpcyB0aGUgaW52ZXJzZSBvZiB0aGUgaHlwZXJib2xpYyBjb3NpbmUgaW4gcmFkaWFucyBvZiB0aGVcclxuICogdmFsdWUgb2YgdGhpcyBEZWNpbWFsLlxyXG4gKlxyXG4gKiBEb21haW46IFsxLCBJbmZpbml0eV1cclxuICogUmFuZ2U6IFswLCBJbmZpbml0eV1cclxuICpcclxuICogYWNvc2goeCkgPSBsbih4ICsgc3FydCh4XjIgLSAxKSlcclxuICpcclxuICogYWNvc2goeCA8IDEpICAgICA9IE5hTlxyXG4gKiBhY29zaChOYU4pICAgICAgID0gTmFOXHJcbiAqIGFjb3NoKEluZmluaXR5KSAgPSBJbmZpbml0eVxyXG4gKiBhY29zaCgtSW5maW5pdHkpID0gTmFOXHJcbiAqIGFjb3NoKDApICAgICAgICAgPSBOYU5cclxuICogYWNvc2goLTApICAgICAgICA9IE5hTlxyXG4gKiBhY29zaCgxKSAgICAgICAgID0gMFxyXG4gKiBhY29zaCgtMSkgICAgICAgID0gTmFOXHJcbiAqXHJcbiAqL1xyXG5QLmludmVyc2VIeXBlcmJvbGljQ29zaW5lID0gUC5hY29zaCA9IGZ1bmN0aW9uICgpIHtcclxuICB2YXIgcHIsIHJtLFxyXG4gICAgeCA9IHRoaXMsXHJcbiAgICBDdG9yID0geC5jb25zdHJ1Y3RvcjtcclxuXHJcbiAgaWYgKHgubHRlKDEpKSByZXR1cm4gbmV3IEN0b3IoeC5lcSgxKSA/IDAgOiBOYU4pO1xyXG4gIGlmICgheC5pc0Zpbml0ZSgpKSByZXR1cm4gbmV3IEN0b3IoeCk7XHJcblxyXG4gIHByID0gQ3Rvci5wcmVjaXNpb247XHJcbiAgcm0gPSBDdG9yLnJvdW5kaW5nO1xyXG4gIEN0b3IucHJlY2lzaW9uID0gcHIgKyBNYXRoLm1heChNYXRoLmFicyh4LmUpLCB4LnNkKCkpICsgNDtcclxuICBDdG9yLnJvdW5kaW5nID0gMTtcclxuICBleHRlcm5hbCA9IGZhbHNlO1xyXG5cclxuICB4ID0geC50aW1lcyh4KS5taW51cygxKS5zcXJ0KCkucGx1cyh4KTtcclxuXHJcbiAgZXh0ZXJuYWwgPSB0cnVlO1xyXG4gIEN0b3IucHJlY2lzaW9uID0gcHI7XHJcbiAgQ3Rvci5yb3VuZGluZyA9IHJtO1xyXG5cclxuICByZXR1cm4geC5sbigpO1xyXG59O1xyXG5cclxuXHJcbi8qXHJcbiAqIFJldHVybiBhIG5ldyBEZWNpbWFsIHdob3NlIHZhbHVlIGlzIHRoZSBpbnZlcnNlIG9mIHRoZSBoeXBlcmJvbGljIHNpbmUgaW4gcmFkaWFucyBvZiB0aGUgdmFsdWVcclxuICogb2YgdGhpcyBEZWNpbWFsLlxyXG4gKlxyXG4gKiBEb21haW46IFstSW5maW5pdHksIEluZmluaXR5XVxyXG4gKiBSYW5nZTogWy1JbmZpbml0eSwgSW5maW5pdHldXHJcbiAqXHJcbiAqIGFzaW5oKHgpID0gbG4oeCArIHNxcnQoeF4yICsgMSkpXHJcbiAqXHJcbiAqIGFzaW5oKE5hTikgICAgICAgPSBOYU5cclxuICogYXNpbmgoSW5maW5pdHkpICA9IEluZmluaXR5XHJcbiAqIGFzaW5oKC1JbmZpbml0eSkgPSAtSW5maW5pdHlcclxuICogYXNpbmgoMCkgICAgICAgICA9IDBcclxuICogYXNpbmgoLTApICAgICAgICA9IC0wXHJcbiAqXHJcbiAqL1xyXG5QLmludmVyc2VIeXBlcmJvbGljU2luZSA9IFAuYXNpbmggPSBmdW5jdGlvbiAoKSB7XHJcbiAgdmFyIHByLCBybSxcclxuICAgIHggPSB0aGlzLFxyXG4gICAgQ3RvciA9IHguY29uc3RydWN0b3I7XHJcblxyXG4gIGlmICgheC5pc0Zpbml0ZSgpIHx8IHguaXNaZXJvKCkpIHJldHVybiBuZXcgQ3Rvcih4KTtcclxuXHJcbiAgcHIgPSBDdG9yLnByZWNpc2lvbjtcclxuICBybSA9IEN0b3Iucm91bmRpbmc7XHJcbiAgQ3Rvci5wcmVjaXNpb24gPSBwciArIDIgKiBNYXRoLm1heChNYXRoLmFicyh4LmUpLCB4LnNkKCkpICsgNjtcclxuICBDdG9yLnJvdW5kaW5nID0gMTtcclxuICBleHRlcm5hbCA9IGZhbHNlO1xyXG5cclxuICB4ID0geC50aW1lcyh4KS5wbHVzKDEpLnNxcnQoKS5wbHVzKHgpO1xyXG5cclxuICBleHRlcm5hbCA9IHRydWU7XHJcbiAgQ3Rvci5wcmVjaXNpb24gPSBwcjtcclxuICBDdG9yLnJvdW5kaW5nID0gcm07XHJcblxyXG4gIHJldHVybiB4LmxuKCk7XHJcbn07XHJcblxyXG5cclxuLypcclxuICogUmV0dXJuIGEgbmV3IERlY2ltYWwgd2hvc2UgdmFsdWUgaXMgdGhlIGludmVyc2Ugb2YgdGhlIGh5cGVyYm9saWMgdGFuZ2VudCBpbiByYWRpYW5zIG9mIHRoZVxyXG4gKiB2YWx1ZSBvZiB0aGlzIERlY2ltYWwuXHJcbiAqXHJcbiAqIERvbWFpbjogWy0xLCAxXVxyXG4gKiBSYW5nZTogWy1JbmZpbml0eSwgSW5maW5pdHldXHJcbiAqXHJcbiAqIGF0YW5oKHgpID0gMC41ICogbG4oKDEgKyB4KSAvICgxIC0geCkpXHJcbiAqXHJcbiAqIGF0YW5oKHx4fCA+IDEpICAgPSBOYU5cclxuICogYXRhbmgoTmFOKSAgICAgICA9IE5hTlxyXG4gKiBhdGFuaChJbmZpbml0eSkgID0gTmFOXHJcbiAqIGF0YW5oKC1JbmZpbml0eSkgPSBOYU5cclxuICogYXRhbmgoMCkgICAgICAgICA9IDBcclxuICogYXRhbmgoLTApICAgICAgICA9IC0wXHJcbiAqIGF0YW5oKDEpICAgICAgICAgPSBJbmZpbml0eVxyXG4gKiBhdGFuaCgtMSkgICAgICAgID0gLUluZmluaXR5XHJcbiAqXHJcbiAqL1xyXG5QLmludmVyc2VIeXBlcmJvbGljVGFuZ2VudCA9IFAuYXRhbmggPSBmdW5jdGlvbiAoKSB7XHJcbiAgdmFyIHByLCBybSwgd3ByLCB4c2QsXHJcbiAgICB4ID0gdGhpcyxcclxuICAgIEN0b3IgPSB4LmNvbnN0cnVjdG9yO1xyXG5cclxuICBpZiAoIXguaXNGaW5pdGUoKSkgcmV0dXJuIG5ldyBDdG9yKE5hTik7XHJcbiAgaWYgKHguZSA+PSAwKSByZXR1cm4gbmV3IEN0b3IoeC5hYnMoKS5lcSgxKSA/IHgucyAvIDAgOiB4LmlzWmVybygpID8geCA6IE5hTik7XHJcblxyXG4gIHByID0gQ3Rvci5wcmVjaXNpb247XHJcbiAgcm0gPSBDdG9yLnJvdW5kaW5nO1xyXG4gIHhzZCA9IHguc2QoKTtcclxuXHJcbiAgaWYgKE1hdGgubWF4KHhzZCwgcHIpIDwgMiAqIC14LmUgLSAxKSByZXR1cm4gZmluYWxpc2UobmV3IEN0b3IoeCksIHByLCBybSwgdHJ1ZSk7XHJcblxyXG4gIEN0b3IucHJlY2lzaW9uID0gd3ByID0geHNkIC0geC5lO1xyXG5cclxuICB4ID0gZGl2aWRlKHgucGx1cygxKSwgbmV3IEN0b3IoMSkubWludXMoeCksIHdwciArIHByLCAxKTtcclxuXHJcbiAgQ3Rvci5wcmVjaXNpb24gPSBwciArIDQ7XHJcbiAgQ3Rvci5yb3VuZGluZyA9IDE7XHJcblxyXG4gIHggPSB4LmxuKCk7XHJcblxyXG4gIEN0b3IucHJlY2lzaW9uID0gcHI7XHJcbiAgQ3Rvci5yb3VuZGluZyA9IHJtO1xyXG5cclxuICByZXR1cm4geC50aW1lcygwLjUpO1xyXG59O1xyXG5cclxuXHJcbi8qXHJcbiAqIFJldHVybiBhIG5ldyBEZWNpbWFsIHdob3NlIHZhbHVlIGlzIHRoZSBhcmNzaW5lIChpbnZlcnNlIHNpbmUpIGluIHJhZGlhbnMgb2YgdGhlIHZhbHVlIG9mIHRoaXNcclxuICogRGVjaW1hbC5cclxuICpcclxuICogRG9tYWluOiBbLUluZmluaXR5LCBJbmZpbml0eV1cclxuICogUmFuZ2U6IFstcGkvMiwgcGkvMl1cclxuICpcclxuICogYXNpbih4KSA9IDIqYXRhbih4LygxICsgc3FydCgxIC0geF4yKSkpXHJcbiAqXHJcbiAqIGFzaW4oMCkgICAgICAgPSAwXHJcbiAqIGFzaW4oLTApICAgICAgPSAtMFxyXG4gKiBhc2luKDEvMikgICAgID0gcGkvNlxyXG4gKiBhc2luKC0xLzIpICAgID0gLXBpLzZcclxuICogYXNpbigxKSAgICAgICA9IHBpLzJcclxuICogYXNpbigtMSkgICAgICA9IC1waS8yXHJcbiAqIGFzaW4ofHh8ID4gMSkgPSBOYU5cclxuICogYXNpbihOYU4pICAgICA9IE5hTlxyXG4gKlxyXG4gKiBUT0RPPyBDb21wYXJlIHBlcmZvcm1hbmNlIG9mIFRheWxvciBzZXJpZXMuXHJcbiAqXHJcbiAqL1xyXG5QLmludmVyc2VTaW5lID0gUC5hc2luID0gZnVuY3Rpb24gKCkge1xyXG4gIHZhciBoYWxmUGksIGssXHJcbiAgICBwciwgcm0sXHJcbiAgICB4ID0gdGhpcyxcclxuICAgIEN0b3IgPSB4LmNvbnN0cnVjdG9yO1xyXG5cclxuICBpZiAoeC5pc1plcm8oKSkgcmV0dXJuIG5ldyBDdG9yKHgpO1xyXG5cclxuICBrID0geC5hYnMoKS5jbXAoMSk7XHJcbiAgcHIgPSBDdG9yLnByZWNpc2lvbjtcclxuICBybSA9IEN0b3Iucm91bmRpbmc7XHJcblxyXG4gIGlmIChrICE9PSAtMSkge1xyXG5cclxuICAgIC8vIHx4fCBpcyAxXHJcbiAgICBpZiAoayA9PT0gMCkge1xyXG4gICAgICBoYWxmUGkgPSBnZXRQaShDdG9yLCBwciArIDQsIHJtKS50aW1lcygwLjUpO1xyXG4gICAgICBoYWxmUGkucyA9IHgucztcclxuICAgICAgcmV0dXJuIGhhbGZQaTtcclxuICAgIH1cclxuXHJcbiAgICAvLyB8eHwgPiAxIG9yIHggaXMgTmFOXHJcbiAgICByZXR1cm4gbmV3IEN0b3IoTmFOKTtcclxuICB9XHJcblxyXG4gIC8vIFRPRE8/IFNwZWNpYWwgY2FzZSBhc2luKDEvMikgPSBwaS82IGFuZCBhc2luKC0xLzIpID0gLXBpLzZcclxuXHJcbiAgQ3Rvci5wcmVjaXNpb24gPSBwciArIDY7XHJcbiAgQ3Rvci5yb3VuZGluZyA9IDE7XHJcblxyXG4gIHggPSB4LmRpdihuZXcgQ3RvcigxKS5taW51cyh4LnRpbWVzKHgpKS5zcXJ0KCkucGx1cygxKSkuYXRhbigpO1xyXG5cclxuICBDdG9yLnByZWNpc2lvbiA9IHByO1xyXG4gIEN0b3Iucm91bmRpbmcgPSBybTtcclxuXHJcbiAgcmV0dXJuIHgudGltZXMoMik7XHJcbn07XHJcblxyXG5cclxuLypcclxuICogUmV0dXJuIGEgbmV3IERlY2ltYWwgd2hvc2UgdmFsdWUgaXMgdGhlIGFyY3RhbmdlbnQgKGludmVyc2UgdGFuZ2VudCkgaW4gcmFkaWFucyBvZiB0aGUgdmFsdWVcclxuICogb2YgdGhpcyBEZWNpbWFsLlxyXG4gKlxyXG4gKiBEb21haW46IFstSW5maW5pdHksIEluZmluaXR5XVxyXG4gKiBSYW5nZTogWy1waS8yLCBwaS8yXVxyXG4gKlxyXG4gKiBhdGFuKHgpID0geCAtIHheMy8zICsgeF41LzUgLSB4XjcvNyArIC4uLlxyXG4gKlxyXG4gKiBhdGFuKDApICAgICAgICAgPSAwXHJcbiAqIGF0YW4oLTApICAgICAgICA9IC0wXHJcbiAqIGF0YW4oMSkgICAgICAgICA9IHBpLzRcclxuICogYXRhbigtMSkgICAgICAgID0gLXBpLzRcclxuICogYXRhbihJbmZpbml0eSkgID0gcGkvMlxyXG4gKiBhdGFuKC1JbmZpbml0eSkgPSAtcGkvMlxyXG4gKiBhdGFuKE5hTikgICAgICAgPSBOYU5cclxuICpcclxuICovXHJcblAuaW52ZXJzZVRhbmdlbnQgPSBQLmF0YW4gPSBmdW5jdGlvbiAoKSB7XHJcbiAgdmFyIGksIGosIGssIG4sIHB4LCB0LCByLCB3cHIsIHgyLFxyXG4gICAgeCA9IHRoaXMsXHJcbiAgICBDdG9yID0geC5jb25zdHJ1Y3RvcixcclxuICAgIHByID0gQ3Rvci5wcmVjaXNpb24sXHJcbiAgICBybSA9IEN0b3Iucm91bmRpbmc7XHJcblxyXG4gIGlmICgheC5pc0Zpbml0ZSgpKSB7XHJcbiAgICBpZiAoIXgucykgcmV0dXJuIG5ldyBDdG9yKE5hTik7XHJcbiAgICBpZiAocHIgKyA0IDw9IFBJX1BSRUNJU0lPTikge1xyXG4gICAgICByID0gZ2V0UGkoQ3RvciwgcHIgKyA0LCBybSkudGltZXMoMC41KTtcclxuICAgICAgci5zID0geC5zO1xyXG4gICAgICByZXR1cm4gcjtcclxuICAgIH1cclxuICB9IGVsc2UgaWYgKHguaXNaZXJvKCkpIHtcclxuICAgIHJldHVybiBuZXcgQ3Rvcih4KTtcclxuICB9IGVsc2UgaWYgKHguYWJzKCkuZXEoMSkgJiYgcHIgKyA0IDw9IFBJX1BSRUNJU0lPTikge1xyXG4gICAgciA9IGdldFBpKEN0b3IsIHByICsgNCwgcm0pLnRpbWVzKDAuMjUpO1xyXG4gICAgci5zID0geC5zO1xyXG4gICAgcmV0dXJuIHI7XHJcbiAgfVxyXG5cclxuICBDdG9yLnByZWNpc2lvbiA9IHdwciA9IHByICsgMTA7XHJcbiAgQ3Rvci5yb3VuZGluZyA9IDE7XHJcblxyXG4gIC8vIFRPRE8/IGlmICh4ID49IDEgJiYgcHIgPD0gUElfUFJFQ0lTSU9OKSBhdGFuKHgpID0gaGFsZlBpICogeC5zIC0gYXRhbigxIC8geCk7XHJcblxyXG4gIC8vIEFyZ3VtZW50IHJlZHVjdGlvblxyXG4gIC8vIEVuc3VyZSB8eHwgPCAwLjQyXHJcbiAgLy8gYXRhbih4KSA9IDIgKiBhdGFuKHggLyAoMSArIHNxcnQoMSArIHheMikpKVxyXG5cclxuICBrID0gTWF0aC5taW4oMjgsIHdwciAvIExPR19CQVNFICsgMiB8IDApO1xyXG5cclxuICBmb3IgKGkgPSBrOyBpOyAtLWkpIHggPSB4LmRpdih4LnRpbWVzKHgpLnBsdXMoMSkuc3FydCgpLnBsdXMoMSkpO1xyXG5cclxuICBleHRlcm5hbCA9IGZhbHNlO1xyXG5cclxuICBqID0gTWF0aC5jZWlsKHdwciAvIExPR19CQVNFKTtcclxuICBuID0gMTtcclxuICB4MiA9IHgudGltZXMoeCk7XHJcbiAgciA9IG5ldyBDdG9yKHgpO1xyXG4gIHB4ID0geDtcclxuXHJcbiAgLy8gYXRhbih4KSA9IHggLSB4XjMvMyArIHheNS81IC0geF43LzcgKyAuLi5cclxuICBmb3IgKDsgaSAhPT0gLTE7KSB7XHJcbiAgICBweCA9IHB4LnRpbWVzKHgyKTtcclxuICAgIHQgPSByLm1pbnVzKHB4LmRpdihuICs9IDIpKTtcclxuXHJcbiAgICBweCA9IHB4LnRpbWVzKHgyKTtcclxuICAgIHIgPSB0LnBsdXMocHguZGl2KG4gKz0gMikpO1xyXG5cclxuICAgIGlmIChyLmRbal0gIT09IHZvaWQgMCkgZm9yIChpID0gajsgci5kW2ldID09PSB0LmRbaV0gJiYgaS0tOyk7XHJcbiAgfVxyXG5cclxuICBpZiAoaykgciA9IHIudGltZXMoMiA8PCAoayAtIDEpKTtcclxuXHJcbiAgZXh0ZXJuYWwgPSB0cnVlO1xyXG5cclxuICByZXR1cm4gZmluYWxpc2UociwgQ3Rvci5wcmVjaXNpb24gPSBwciwgQ3Rvci5yb3VuZGluZyA9IHJtLCB0cnVlKTtcclxufTtcclxuXHJcblxyXG4vKlxyXG4gKiBSZXR1cm4gdHJ1ZSBpZiB0aGUgdmFsdWUgb2YgdGhpcyBEZWNpbWFsIGlzIGEgZmluaXRlIG51bWJlciwgb3RoZXJ3aXNlIHJldHVybiBmYWxzZS5cclxuICpcclxuICovXHJcblAuaXNGaW5pdGUgPSBmdW5jdGlvbiAoKSB7XHJcbiAgcmV0dXJuICEhdGhpcy5kO1xyXG59O1xyXG5cclxuXHJcbi8qXHJcbiAqIFJldHVybiB0cnVlIGlmIHRoZSB2YWx1ZSBvZiB0aGlzIERlY2ltYWwgaXMgYW4gaW50ZWdlciwgb3RoZXJ3aXNlIHJldHVybiBmYWxzZS5cclxuICpcclxuICovXHJcblAuaXNJbnRlZ2VyID0gUC5pc0ludCA9IGZ1bmN0aW9uICgpIHtcclxuICByZXR1cm4gISF0aGlzLmQgJiYgbWF0aGZsb29yKHRoaXMuZSAvIExPR19CQVNFKSA+IHRoaXMuZC5sZW5ndGggLSAyO1xyXG59O1xyXG5cclxuXHJcbi8qXHJcbiAqIFJldHVybiB0cnVlIGlmIHRoZSB2YWx1ZSBvZiB0aGlzIERlY2ltYWwgaXMgTmFOLCBvdGhlcndpc2UgcmV0dXJuIGZhbHNlLlxyXG4gKlxyXG4gKi9cclxuUC5pc05hTiA9IGZ1bmN0aW9uICgpIHtcclxuICByZXR1cm4gIXRoaXMucztcclxufTtcclxuXHJcblxyXG4vKlxyXG4gKiBSZXR1cm4gdHJ1ZSBpZiB0aGUgdmFsdWUgb2YgdGhpcyBEZWNpbWFsIGlzIG5lZ2F0aXZlLCBvdGhlcndpc2UgcmV0dXJuIGZhbHNlLlxyXG4gKlxyXG4gKi9cclxuUC5pc05lZ2F0aXZlID0gUC5pc05lZyA9IGZ1bmN0aW9uICgpIHtcclxuICByZXR1cm4gdGhpcy5zIDwgMDtcclxufTtcclxuXHJcblxyXG4vKlxyXG4gKiBSZXR1cm4gdHJ1ZSBpZiB0aGUgdmFsdWUgb2YgdGhpcyBEZWNpbWFsIGlzIHBvc2l0aXZlLCBvdGhlcndpc2UgcmV0dXJuIGZhbHNlLlxyXG4gKlxyXG4gKi9cclxuUC5pc1Bvc2l0aXZlID0gUC5pc1BvcyA9IGZ1bmN0aW9uICgpIHtcclxuICByZXR1cm4gdGhpcy5zID4gMDtcclxufTtcclxuXHJcblxyXG4vKlxyXG4gKiBSZXR1cm4gdHJ1ZSBpZiB0aGUgdmFsdWUgb2YgdGhpcyBEZWNpbWFsIGlzIDAgb3IgLTAsIG90aGVyd2lzZSByZXR1cm4gZmFsc2UuXHJcbiAqXHJcbiAqL1xyXG5QLmlzWmVybyA9IGZ1bmN0aW9uICgpIHtcclxuICByZXR1cm4gISF0aGlzLmQgJiYgdGhpcy5kWzBdID09PSAwO1xyXG59O1xyXG5cclxuXHJcbi8qXHJcbiAqIFJldHVybiB0cnVlIGlmIHRoZSB2YWx1ZSBvZiB0aGlzIERlY2ltYWwgaXMgbGVzcyB0aGFuIGB5YCwgb3RoZXJ3aXNlIHJldHVybiBmYWxzZS5cclxuICpcclxuICovXHJcblAubGVzc1RoYW4gPSBQLmx0ID0gZnVuY3Rpb24gKHkpIHtcclxuICByZXR1cm4gdGhpcy5jbXAoeSkgPCAwO1xyXG59O1xyXG5cclxuXHJcbi8qXHJcbiAqIFJldHVybiB0cnVlIGlmIHRoZSB2YWx1ZSBvZiB0aGlzIERlY2ltYWwgaXMgbGVzcyB0aGFuIG9yIGVxdWFsIHRvIGB5YCwgb3RoZXJ3aXNlIHJldHVybiBmYWxzZS5cclxuICpcclxuICovXHJcblAubGVzc1RoYW5PckVxdWFsVG8gPSBQLmx0ZSA9IGZ1bmN0aW9uICh5KSB7XHJcbiAgcmV0dXJuIHRoaXMuY21wKHkpIDwgMTtcclxufTtcclxuXHJcblxyXG4vKlxyXG4gKiBSZXR1cm4gdGhlIGxvZ2FyaXRobSBvZiB0aGUgdmFsdWUgb2YgdGhpcyBEZWNpbWFsIHRvIHRoZSBzcGVjaWZpZWQgYmFzZSwgcm91bmRlZCB0byBgcHJlY2lzaW9uYFxyXG4gKiBzaWduaWZpY2FudCBkaWdpdHMgdXNpbmcgcm91bmRpbmcgbW9kZSBgcm91bmRpbmdgLlxyXG4gKlxyXG4gKiBJZiBubyBiYXNlIGlzIHNwZWNpZmllZCwgcmV0dXJuIGxvZ1sxMF0oYXJnKS5cclxuICpcclxuICogbG9nW2Jhc2VdKGFyZykgPSBsbihhcmcpIC8gbG4oYmFzZSlcclxuICpcclxuICogVGhlIHJlc3VsdCB3aWxsIGFsd2F5cyBiZSBjb3JyZWN0bHkgcm91bmRlZCBpZiB0aGUgYmFzZSBvZiB0aGUgbG9nIGlzIDEwLCBhbmQgJ2FsbW9zdCBhbHdheXMnXHJcbiAqIG90aGVyd2lzZTpcclxuICpcclxuICogRGVwZW5kaW5nIG9uIHRoZSByb3VuZGluZyBtb2RlLCB0aGUgcmVzdWx0IG1heSBiZSBpbmNvcnJlY3RseSByb3VuZGVkIGlmIHRoZSBmaXJzdCBmaWZ0ZWVuXHJcbiAqIHJvdW5kaW5nIGRpZ2l0cyBhcmUgWzQ5XTk5OTk5OTk5OTk5OTk5IG9yIFs1MF0wMDAwMDAwMDAwMDAwMC4gSW4gdGhhdCBjYXNlLCB0aGUgbWF4aW11bSBlcnJvclxyXG4gKiBiZXR3ZWVuIHRoZSByZXN1bHQgYW5kIHRoZSBjb3JyZWN0bHkgcm91bmRlZCByZXN1bHQgd2lsbCBiZSBvbmUgdWxwICh1bml0IGluIHRoZSBsYXN0IHBsYWNlKS5cclxuICpcclxuICogbG9nWy1iXShhKSAgICAgICA9IE5hTlxyXG4gKiBsb2dbMF0oYSkgICAgICAgID0gTmFOXHJcbiAqIGxvZ1sxXShhKSAgICAgICAgPSBOYU5cclxuICogbG9nW05hTl0oYSkgICAgICA9IE5hTlxyXG4gKiBsb2dbSW5maW5pdHldKGEpID0gTmFOXHJcbiAqIGxvZ1tiXSgwKSAgICAgICAgPSAtSW5maW5pdHlcclxuICogbG9nW2JdKC0wKSAgICAgICA9IC1JbmZpbml0eVxyXG4gKiBsb2dbYl0oLWEpICAgICAgID0gTmFOXHJcbiAqIGxvZ1tiXSgxKSAgICAgICAgPSAwXHJcbiAqIGxvZ1tiXShJbmZpbml0eSkgPSBJbmZpbml0eVxyXG4gKiBsb2dbYl0oTmFOKSAgICAgID0gTmFOXHJcbiAqXHJcbiAqIFtiYXNlXSB7bnVtYmVyfHN0cmluZ3xEZWNpbWFsfSBUaGUgYmFzZSBvZiB0aGUgbG9nYXJpdGhtLlxyXG4gKlxyXG4gKi9cclxuUC5sb2dhcml0aG0gPSBQLmxvZyA9IGZ1bmN0aW9uIChiYXNlKSB7XHJcbiAgdmFyIGlzQmFzZTEwLCBkLCBkZW5vbWluYXRvciwgaywgaW5mLCBudW0sIHNkLCByLFxyXG4gICAgYXJnID0gdGhpcyxcclxuICAgIEN0b3IgPSBhcmcuY29uc3RydWN0b3IsXHJcbiAgICBwciA9IEN0b3IucHJlY2lzaW9uLFxyXG4gICAgcm0gPSBDdG9yLnJvdW5kaW5nLFxyXG4gICAgZ3VhcmQgPSA1O1xyXG5cclxuICAvLyBEZWZhdWx0IGJhc2UgaXMgMTAuXHJcbiAgaWYgKGJhc2UgPT0gbnVsbCkge1xyXG4gICAgYmFzZSA9IG5ldyBDdG9yKDEwKTtcclxuICAgIGlzQmFzZTEwID0gdHJ1ZTtcclxuICB9IGVsc2Uge1xyXG4gICAgYmFzZSA9IG5ldyBDdG9yKGJhc2UpO1xyXG4gICAgZCA9IGJhc2UuZDtcclxuXHJcbiAgICAvLyBSZXR1cm4gTmFOIGlmIGJhc2UgaXMgbmVnYXRpdmUsIG9yIG5vbi1maW5pdGUsIG9yIGlzIDAgb3IgMS5cclxuICAgIGlmIChiYXNlLnMgPCAwIHx8ICFkIHx8ICFkWzBdIHx8IGJhc2UuZXEoMSkpIHJldHVybiBuZXcgQ3RvcihOYU4pO1xyXG5cclxuICAgIGlzQmFzZTEwID0gYmFzZS5lcSgxMCk7XHJcbiAgfVxyXG5cclxuICBkID0gYXJnLmQ7XHJcblxyXG4gIC8vIElzIGFyZyBuZWdhdGl2ZSwgbm9uLWZpbml0ZSwgMCBvciAxP1xyXG4gIGlmIChhcmcucyA8IDAgfHwgIWQgfHwgIWRbMF0gfHwgYXJnLmVxKDEpKSB7XHJcbiAgICByZXR1cm4gbmV3IEN0b3IoZCAmJiAhZFswXSA/IC0xIC8gMCA6IGFyZy5zICE9IDEgPyBOYU4gOiBkID8gMCA6IDEgLyAwKTtcclxuICB9XHJcblxyXG4gIC8vIFRoZSByZXN1bHQgd2lsbCBoYXZlIGEgbm9uLXRlcm1pbmF0aW5nIGRlY2ltYWwgZXhwYW5zaW9uIGlmIGJhc2UgaXMgMTAgYW5kIGFyZyBpcyBub3QgYW5cclxuICAvLyBpbnRlZ2VyIHBvd2VyIG9mIDEwLlxyXG4gIGlmIChpc0Jhc2UxMCkge1xyXG4gICAgaWYgKGQubGVuZ3RoID4gMSkge1xyXG4gICAgICBpbmYgPSB0cnVlO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgZm9yIChrID0gZFswXTsgayAlIDEwID09PSAwOykgayAvPSAxMDtcclxuICAgICAgaW5mID0gayAhPT0gMTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIGV4dGVybmFsID0gZmFsc2U7XHJcbiAgc2QgPSBwciArIGd1YXJkO1xyXG4gIG51bSA9IG5hdHVyYWxMb2dhcml0aG0oYXJnLCBzZCk7XHJcbiAgZGVub21pbmF0b3IgPSBpc0Jhc2UxMCA/IGdldExuMTAoQ3Rvciwgc2QgKyAxMCkgOiBuYXR1cmFsTG9nYXJpdGhtKGJhc2UsIHNkKTtcclxuXHJcbiAgLy8gVGhlIHJlc3VsdCB3aWxsIGhhdmUgNSByb3VuZGluZyBkaWdpdHMuXHJcbiAgciA9IGRpdmlkZShudW0sIGRlbm9taW5hdG9yLCBzZCwgMSk7XHJcblxyXG4gIC8vIElmIGF0IGEgcm91bmRpbmcgYm91bmRhcnksIGkuZS4gdGhlIHJlc3VsdCdzIHJvdW5kaW5nIGRpZ2l0cyBhcmUgWzQ5XTk5OTkgb3IgWzUwXTAwMDAsXHJcbiAgLy8gY2FsY3VsYXRlIDEwIGZ1cnRoZXIgZGlnaXRzLlxyXG4gIC8vXHJcbiAgLy8gSWYgdGhlIHJlc3VsdCBpcyBrbm93biB0byBoYXZlIGFuIGluZmluaXRlIGRlY2ltYWwgZXhwYW5zaW9uLCByZXBlYXQgdGhpcyB1bnRpbCBpdCBpcyBjbGVhclxyXG4gIC8vIHRoYXQgdGhlIHJlc3VsdCBpcyBhYm92ZSBvciBiZWxvdyB0aGUgYm91bmRhcnkuIE90aGVyd2lzZSwgaWYgYWZ0ZXIgY2FsY3VsYXRpbmcgdGhlIDEwXHJcbiAgLy8gZnVydGhlciBkaWdpdHMsIHRoZSBsYXN0IDE0IGFyZSBuaW5lcywgcm91bmQgdXAgYW5kIGFzc3VtZSB0aGUgcmVzdWx0IGlzIGV4YWN0LlxyXG4gIC8vIEFsc28gYXNzdW1lIHRoZSByZXN1bHQgaXMgZXhhY3QgaWYgdGhlIGxhc3QgMTQgYXJlIHplcm8uXHJcbiAgLy9cclxuICAvLyBFeGFtcGxlIG9mIGEgcmVzdWx0IHRoYXQgd2lsbCBiZSBpbmNvcnJlY3RseSByb3VuZGVkOlxyXG4gIC8vIGxvZ1sxMDQ4NTc2XSg0NTAzNTk5NjI3MzcwNTAyKSA9IDIuNjAwMDAwMDAwMDAwMDAwMDk2MTAyNzk1MTE0NDQ3NDYuLi5cclxuICAvLyBUaGUgYWJvdmUgcmVzdWx0IGNvcnJlY3RseSByb3VuZGVkIHVzaW5nIFJPVU5EX0NFSUwgdG8gMSBkZWNpbWFsIHBsYWNlIHNob3VsZCBiZSAyLjcsIGJ1dCBpdFxyXG4gIC8vIHdpbGwgYmUgZ2l2ZW4gYXMgMi42IGFzIHRoZXJlIGFyZSAxNSB6ZXJvcyBpbW1lZGlhdGVseSBhZnRlciB0aGUgcmVxdWVzdGVkIGRlY2ltYWwgcGxhY2UsIHNvXHJcbiAgLy8gdGhlIGV4YWN0IHJlc3VsdCB3b3VsZCBiZSBhc3N1bWVkIHRvIGJlIDIuNiwgd2hpY2ggcm91bmRlZCB1c2luZyBST1VORF9DRUlMIHRvIDEgZGVjaW1hbFxyXG4gIC8vIHBsYWNlIGlzIHN0aWxsIDIuNi5cclxuICBpZiAoY2hlY2tSb3VuZGluZ0RpZ2l0cyhyLmQsIGsgPSBwciwgcm0pKSB7XHJcblxyXG4gICAgZG8ge1xyXG4gICAgICBzZCArPSAxMDtcclxuICAgICAgbnVtID0gbmF0dXJhbExvZ2FyaXRobShhcmcsIHNkKTtcclxuICAgICAgZGVub21pbmF0b3IgPSBpc0Jhc2UxMCA/IGdldExuMTAoQ3Rvciwgc2QgKyAxMCkgOiBuYXR1cmFsTG9nYXJpdGhtKGJhc2UsIHNkKTtcclxuICAgICAgciA9IGRpdmlkZShudW0sIGRlbm9taW5hdG9yLCBzZCwgMSk7XHJcblxyXG4gICAgICBpZiAoIWluZikge1xyXG5cclxuICAgICAgICAvLyBDaGVjayBmb3IgMTQgbmluZXMgZnJvbSB0aGUgMm5kIHJvdW5kaW5nIGRpZ2l0LCBhcyB0aGUgZmlyc3QgbWF5IGJlIDQuXHJcbiAgICAgICAgaWYgKCtkaWdpdHNUb1N0cmluZyhyLmQpLnNsaWNlKGsgKyAxLCBrICsgMTUpICsgMSA9PSAxZTE0KSB7XHJcbiAgICAgICAgICByID0gZmluYWxpc2UociwgcHIgKyAxLCAwKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGJyZWFrO1xyXG4gICAgICB9XHJcbiAgICB9IHdoaWxlIChjaGVja1JvdW5kaW5nRGlnaXRzKHIuZCwgayArPSAxMCwgcm0pKTtcclxuICB9XHJcblxyXG4gIGV4dGVybmFsID0gdHJ1ZTtcclxuXHJcbiAgcmV0dXJuIGZpbmFsaXNlKHIsIHByLCBybSk7XHJcbn07XHJcblxyXG5cclxuLypcclxuICogUmV0dXJuIGEgbmV3IERlY2ltYWwgd2hvc2UgdmFsdWUgaXMgdGhlIG1heGltdW0gb2YgdGhlIGFyZ3VtZW50cyBhbmQgdGhlIHZhbHVlIG9mIHRoaXMgRGVjaW1hbC5cclxuICpcclxuICogYXJndW1lbnRzIHtudW1iZXJ8c3RyaW5nfERlY2ltYWx9XHJcbiAqXHJcblAubWF4ID0gZnVuY3Rpb24gKCkge1xyXG4gIEFycmF5LnByb3RvdHlwZS5wdXNoLmNhbGwoYXJndW1lbnRzLCB0aGlzKTtcclxuICByZXR1cm4gbWF4T3JNaW4odGhpcy5jb25zdHJ1Y3RvciwgYXJndW1lbnRzLCAnbHQnKTtcclxufTtcclxuICovXHJcblxyXG5cclxuLypcclxuICogUmV0dXJuIGEgbmV3IERlY2ltYWwgd2hvc2UgdmFsdWUgaXMgdGhlIG1pbmltdW0gb2YgdGhlIGFyZ3VtZW50cyBhbmQgdGhlIHZhbHVlIG9mIHRoaXMgRGVjaW1hbC5cclxuICpcclxuICogYXJndW1lbnRzIHtudW1iZXJ8c3RyaW5nfERlY2ltYWx9XHJcbiAqXHJcblAubWluID0gZnVuY3Rpb24gKCkge1xyXG4gIEFycmF5LnByb3RvdHlwZS5wdXNoLmNhbGwoYXJndW1lbnRzLCB0aGlzKTtcclxuICByZXR1cm4gbWF4T3JNaW4odGhpcy5jb25zdHJ1Y3RvciwgYXJndW1lbnRzLCAnZ3QnKTtcclxufTtcclxuICovXHJcblxyXG5cclxuLypcclxuICogIG4gLSAwID0gblxyXG4gKiAgbiAtIE4gPSBOXHJcbiAqICBuIC0gSSA9IC1JXHJcbiAqICAwIC0gbiA9IC1uXHJcbiAqICAwIC0gMCA9IDBcclxuICogIDAgLSBOID0gTlxyXG4gKiAgMCAtIEkgPSAtSVxyXG4gKiAgTiAtIG4gPSBOXHJcbiAqICBOIC0gMCA9IE5cclxuICogIE4gLSBOID0gTlxyXG4gKiAgTiAtIEkgPSBOXHJcbiAqICBJIC0gbiA9IElcclxuICogIEkgLSAwID0gSVxyXG4gKiAgSSAtIE4gPSBOXHJcbiAqICBJIC0gSSA9IE5cclxuICpcclxuICogUmV0dXJuIGEgbmV3IERlY2ltYWwgd2hvc2UgdmFsdWUgaXMgdGhlIHZhbHVlIG9mIHRoaXMgRGVjaW1hbCBtaW51cyBgeWAsIHJvdW5kZWQgdG8gYHByZWNpc2lvbmBcclxuICogc2lnbmlmaWNhbnQgZGlnaXRzIHVzaW5nIHJvdW5kaW5nIG1vZGUgYHJvdW5kaW5nYC5cclxuICpcclxuICovXHJcblAubWludXMgPSBQLnN1YiA9IGZ1bmN0aW9uICh5KSB7XHJcbiAgdmFyIGQsIGUsIGksIGosIGssIGxlbiwgcHIsIHJtLCB4ZCwgeGUsIHhMVHksIHlkLFxyXG4gICAgeCA9IHRoaXMsXHJcbiAgICBDdG9yID0geC5jb25zdHJ1Y3RvcjtcclxuXHJcbiAgeSA9IG5ldyBDdG9yKHkpO1xyXG5cclxuICAvLyBJZiBlaXRoZXIgaXMgbm90IGZpbml0ZS4uLlxyXG4gIGlmICgheC5kIHx8ICF5LmQpIHtcclxuXHJcbiAgICAvLyBSZXR1cm4gTmFOIGlmIGVpdGhlciBpcyBOYU4uXHJcbiAgICBpZiAoIXgucyB8fCAheS5zKSB5ID0gbmV3IEN0b3IoTmFOKTtcclxuXHJcbiAgICAvLyBSZXR1cm4geSBuZWdhdGVkIGlmIHggaXMgZmluaXRlIGFuZCB5IGlzIFx1MDBCMUluZmluaXR5LlxyXG4gICAgZWxzZSBpZiAoeC5kKSB5LnMgPSAteS5zO1xyXG5cclxuICAgIC8vIFJldHVybiB4IGlmIHkgaXMgZmluaXRlIGFuZCB4IGlzIFx1MDBCMUluZmluaXR5LlxyXG4gICAgLy8gUmV0dXJuIHggaWYgYm90aCBhcmUgXHUwMEIxSW5maW5pdHkgd2l0aCBkaWZmZXJlbnQgc2lnbnMuXHJcbiAgICAvLyBSZXR1cm4gTmFOIGlmIGJvdGggYXJlIFx1MDBCMUluZmluaXR5IHdpdGggdGhlIHNhbWUgc2lnbi5cclxuICAgIGVsc2UgeSA9IG5ldyBDdG9yKHkuZCB8fCB4LnMgIT09IHkucyA/IHggOiBOYU4pO1xyXG5cclxuICAgIHJldHVybiB5O1xyXG4gIH1cclxuXHJcbiAgLy8gSWYgc2lnbnMgZGlmZmVyLi4uXHJcbiAgaWYgKHgucyAhPSB5LnMpIHtcclxuICAgIHkucyA9IC15LnM7XHJcbiAgICByZXR1cm4geC5wbHVzKHkpO1xyXG4gIH1cclxuXHJcbiAgeGQgPSB4LmQ7XHJcbiAgeWQgPSB5LmQ7XHJcbiAgcHIgPSBDdG9yLnByZWNpc2lvbjtcclxuICBybSA9IEN0b3Iucm91bmRpbmc7XHJcblxyXG4gIC8vIElmIGVpdGhlciBpcyB6ZXJvLi4uXHJcbiAgaWYgKCF4ZFswXSB8fCAheWRbMF0pIHtcclxuXHJcbiAgICAvLyBSZXR1cm4geSBuZWdhdGVkIGlmIHggaXMgemVybyBhbmQgeSBpcyBub24temVyby5cclxuICAgIGlmICh5ZFswXSkgeS5zID0gLXkucztcclxuXHJcbiAgICAvLyBSZXR1cm4geCBpZiB5IGlzIHplcm8gYW5kIHggaXMgbm9uLXplcm8uXHJcbiAgICBlbHNlIGlmICh4ZFswXSkgeSA9IG5ldyBDdG9yKHgpO1xyXG5cclxuICAgIC8vIFJldHVybiB6ZXJvIGlmIGJvdGggYXJlIHplcm8uXHJcbiAgICAvLyBGcm9tIElFRUUgNzU0ICgyMDA4KSA2LjM6IDAgLSAwID0gLTAgLSAtMCA9IC0wIHdoZW4gcm91bmRpbmcgdG8gLUluZmluaXR5LlxyXG4gICAgZWxzZSByZXR1cm4gbmV3IEN0b3Iocm0gPT09IDMgPyAtMCA6IDApO1xyXG5cclxuICAgIHJldHVybiBleHRlcm5hbCA/IGZpbmFsaXNlKHksIHByLCBybSkgOiB5O1xyXG4gIH1cclxuXHJcbiAgLy8geCBhbmQgeSBhcmUgZmluaXRlLCBub24temVybyBudW1iZXJzIHdpdGggdGhlIHNhbWUgc2lnbi5cclxuXHJcbiAgLy8gQ2FsY3VsYXRlIGJhc2UgMWU3IGV4cG9uZW50cy5cclxuICBlID0gbWF0aGZsb29yKHkuZSAvIExPR19CQVNFKTtcclxuICB4ZSA9IG1hdGhmbG9vcih4LmUgLyBMT0dfQkFTRSk7XHJcblxyXG4gIHhkID0geGQuc2xpY2UoKTtcclxuICBrID0geGUgLSBlO1xyXG5cclxuICAvLyBJZiBiYXNlIDFlNyBleHBvbmVudHMgZGlmZmVyLi4uXHJcbiAgaWYgKGspIHtcclxuICAgIHhMVHkgPSBrIDwgMDtcclxuXHJcbiAgICBpZiAoeExUeSkge1xyXG4gICAgICBkID0geGQ7XHJcbiAgICAgIGsgPSAtaztcclxuICAgICAgbGVuID0geWQubGVuZ3RoO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgZCA9IHlkO1xyXG4gICAgICBlID0geGU7XHJcbiAgICAgIGxlbiA9IHhkLmxlbmd0aDtcclxuICAgIH1cclxuXHJcbiAgICAvLyBOdW1iZXJzIHdpdGggbWFzc2l2ZWx5IGRpZmZlcmVudCBleHBvbmVudHMgd291bGQgcmVzdWx0IGluIGEgdmVyeSBoaWdoIG51bWJlciBvZlxyXG4gICAgLy8gemVyb3MgbmVlZGluZyB0byBiZSBwcmVwZW5kZWQsIGJ1dCB0aGlzIGNhbiBiZSBhdm9pZGVkIHdoaWxlIHN0aWxsIGVuc3VyaW5nIGNvcnJlY3RcclxuICAgIC8vIHJvdW5kaW5nIGJ5IGxpbWl0aW5nIHRoZSBudW1iZXIgb2YgemVyb3MgdG8gYE1hdGguY2VpbChwciAvIExPR19CQVNFKSArIDJgLlxyXG4gICAgaSA9IE1hdGgubWF4KE1hdGguY2VpbChwciAvIExPR19CQVNFKSwgbGVuKSArIDI7XHJcblxyXG4gICAgaWYgKGsgPiBpKSB7XHJcbiAgICAgIGsgPSBpO1xyXG4gICAgICBkLmxlbmd0aCA9IDE7XHJcbiAgICB9XHJcblxyXG4gICAgLy8gUHJlcGVuZCB6ZXJvcyB0byBlcXVhbGlzZSBleHBvbmVudHMuXHJcbiAgICBkLnJldmVyc2UoKTtcclxuICAgIGZvciAoaSA9IGs7IGktLTspIGQucHVzaCgwKTtcclxuICAgIGQucmV2ZXJzZSgpO1xyXG5cclxuICAvLyBCYXNlIDFlNyBleHBvbmVudHMgZXF1YWwuXHJcbiAgfSBlbHNlIHtcclxuXHJcbiAgICAvLyBDaGVjayBkaWdpdHMgdG8gZGV0ZXJtaW5lIHdoaWNoIGlzIHRoZSBiaWdnZXIgbnVtYmVyLlxyXG5cclxuICAgIGkgPSB4ZC5sZW5ndGg7XHJcbiAgICBsZW4gPSB5ZC5sZW5ndGg7XHJcbiAgICB4TFR5ID0gaSA8IGxlbjtcclxuICAgIGlmICh4TFR5KSBsZW4gPSBpO1xyXG5cclxuICAgIGZvciAoaSA9IDA7IGkgPCBsZW47IGkrKykge1xyXG4gICAgICBpZiAoeGRbaV0gIT0geWRbaV0pIHtcclxuICAgICAgICB4TFR5ID0geGRbaV0gPCB5ZFtpXTtcclxuICAgICAgICBicmVhaztcclxuICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGsgPSAwO1xyXG4gIH1cclxuXHJcbiAgaWYgKHhMVHkpIHtcclxuICAgIGQgPSB4ZDtcclxuICAgIHhkID0geWQ7XHJcbiAgICB5ZCA9IGQ7XHJcbiAgICB5LnMgPSAteS5zO1xyXG4gIH1cclxuXHJcbiAgbGVuID0geGQubGVuZ3RoO1xyXG5cclxuICAvLyBBcHBlbmQgemVyb3MgdG8gYHhkYCBpZiBzaG9ydGVyLlxyXG4gIC8vIERvbid0IGFkZCB6ZXJvcyB0byBgeWRgIGlmIHNob3J0ZXIgYXMgc3VidHJhY3Rpb24gb25seSBuZWVkcyB0byBzdGFydCBhdCBgeWRgIGxlbmd0aC5cclxuICBmb3IgKGkgPSB5ZC5sZW5ndGggLSBsZW47IGkgPiAwOyAtLWkpIHhkW2xlbisrXSA9IDA7XHJcblxyXG4gIC8vIFN1YnRyYWN0IHlkIGZyb20geGQuXHJcbiAgZm9yIChpID0geWQubGVuZ3RoOyBpID4gazspIHtcclxuXHJcbiAgICBpZiAoeGRbLS1pXSA8IHlkW2ldKSB7XHJcbiAgICAgIGZvciAoaiA9IGk7IGogJiYgeGRbLS1qXSA9PT0gMDspIHhkW2pdID0gQkFTRSAtIDE7XHJcbiAgICAgIC0teGRbal07XHJcbiAgICAgIHhkW2ldICs9IEJBU0U7XHJcbiAgICB9XHJcblxyXG4gICAgeGRbaV0gLT0geWRbaV07XHJcbiAgfVxyXG5cclxuICAvLyBSZW1vdmUgdHJhaWxpbmcgemVyb3MuXHJcbiAgZm9yICg7IHhkWy0tbGVuXSA9PT0gMDspIHhkLnBvcCgpO1xyXG5cclxuICAvLyBSZW1vdmUgbGVhZGluZyB6ZXJvcyBhbmQgYWRqdXN0IGV4cG9uZW50IGFjY29yZGluZ2x5LlxyXG4gIGZvciAoOyB4ZFswXSA9PT0gMDsgeGQuc2hpZnQoKSkgLS1lO1xyXG5cclxuICAvLyBaZXJvP1xyXG4gIGlmICgheGRbMF0pIHJldHVybiBuZXcgQ3RvcihybSA9PT0gMyA/IC0wIDogMCk7XHJcblxyXG4gIHkuZCA9IHhkO1xyXG4gIHkuZSA9IGdldEJhc2UxMEV4cG9uZW50KHhkLCBlKTtcclxuXHJcbiAgcmV0dXJuIGV4dGVybmFsID8gZmluYWxpc2UoeSwgcHIsIHJtKSA6IHk7XHJcbn07XHJcblxyXG5cclxuLypcclxuICogICBuICUgMCA9ICBOXHJcbiAqICAgbiAlIE4gPSAgTlxyXG4gKiAgIG4gJSBJID0gIG5cclxuICogICAwICUgbiA9ICAwXHJcbiAqICAtMCAlIG4gPSAtMFxyXG4gKiAgIDAgJSAwID0gIE5cclxuICogICAwICUgTiA9ICBOXHJcbiAqICAgMCAlIEkgPSAgMFxyXG4gKiAgIE4gJSBuID0gIE5cclxuICogICBOICUgMCA9ICBOXHJcbiAqICAgTiAlIE4gPSAgTlxyXG4gKiAgIE4gJSBJID0gIE5cclxuICogICBJICUgbiA9ICBOXHJcbiAqICAgSSAlIDAgPSAgTlxyXG4gKiAgIEkgJSBOID0gIE5cclxuICogICBJICUgSSA9ICBOXHJcbiAqXHJcbiAqIFJldHVybiBhIG5ldyBEZWNpbWFsIHdob3NlIHZhbHVlIGlzIHRoZSB2YWx1ZSBvZiB0aGlzIERlY2ltYWwgbW9kdWxvIGB5YCwgcm91bmRlZCB0b1xyXG4gKiBgcHJlY2lzaW9uYCBzaWduaWZpY2FudCBkaWdpdHMgdXNpbmcgcm91bmRpbmcgbW9kZSBgcm91bmRpbmdgLlxyXG4gKlxyXG4gKiBUaGUgcmVzdWx0IGRlcGVuZHMgb24gdGhlIG1vZHVsbyBtb2RlLlxyXG4gKlxyXG4gKi9cclxuUC5tb2R1bG8gPSBQLm1vZCA9IGZ1bmN0aW9uICh5KSB7XHJcbiAgdmFyIHEsXHJcbiAgICB4ID0gdGhpcyxcclxuICAgIEN0b3IgPSB4LmNvbnN0cnVjdG9yO1xyXG5cclxuICB5ID0gbmV3IEN0b3IoeSk7XHJcblxyXG4gIC8vIFJldHVybiBOYU4gaWYgeCBpcyBcdTAwQjFJbmZpbml0eSBvciBOYU4sIG9yIHkgaXMgTmFOIG9yIFx1MDBCMTAuXHJcbiAgaWYgKCF4LmQgfHwgIXkucyB8fCB5LmQgJiYgIXkuZFswXSkgcmV0dXJuIG5ldyBDdG9yKE5hTik7XHJcblxyXG4gIC8vIFJldHVybiB4IGlmIHkgaXMgXHUwMEIxSW5maW5pdHkgb3IgeCBpcyBcdTAwQjEwLlxyXG4gIGlmICgheS5kIHx8IHguZCAmJiAheC5kWzBdKSB7XHJcbiAgICByZXR1cm4gZmluYWxpc2UobmV3IEN0b3IoeCksIEN0b3IucHJlY2lzaW9uLCBDdG9yLnJvdW5kaW5nKTtcclxuICB9XHJcblxyXG4gIC8vIFByZXZlbnQgcm91bmRpbmcgb2YgaW50ZXJtZWRpYXRlIGNhbGN1bGF0aW9ucy5cclxuICBleHRlcm5hbCA9IGZhbHNlO1xyXG5cclxuICBpZiAoQ3Rvci5tb2R1bG8gPT0gOSkge1xyXG5cclxuICAgIC8vIEV1Y2xpZGlhbiBkaXZpc2lvbjogcSA9IHNpZ24oeSkgKiBmbG9vcih4IC8gYWJzKHkpKVxyXG4gICAgLy8gcmVzdWx0ID0geCAtIHEgKiB5ICAgIHdoZXJlICAwIDw9IHJlc3VsdCA8IGFicyh5KVxyXG4gICAgcSA9IGRpdmlkZSh4LCB5LmFicygpLCAwLCAzLCAxKTtcclxuICAgIHEucyAqPSB5LnM7XHJcbiAgfSBlbHNlIHtcclxuICAgIHEgPSBkaXZpZGUoeCwgeSwgMCwgQ3Rvci5tb2R1bG8sIDEpO1xyXG4gIH1cclxuXHJcbiAgcSA9IHEudGltZXMoeSk7XHJcblxyXG4gIGV4dGVybmFsID0gdHJ1ZTtcclxuXHJcbiAgcmV0dXJuIHgubWludXMocSk7XHJcbn07XHJcblxyXG5cclxuLypcclxuICogUmV0dXJuIGEgbmV3IERlY2ltYWwgd2hvc2UgdmFsdWUgaXMgdGhlIG5hdHVyYWwgZXhwb25lbnRpYWwgb2YgdGhlIHZhbHVlIG9mIHRoaXMgRGVjaW1hbCxcclxuICogaS5lLiB0aGUgYmFzZSBlIHJhaXNlZCB0byB0aGUgcG93ZXIgdGhlIHZhbHVlIG9mIHRoaXMgRGVjaW1hbCwgcm91bmRlZCB0byBgcHJlY2lzaW9uYFxyXG4gKiBzaWduaWZpY2FudCBkaWdpdHMgdXNpbmcgcm91bmRpbmcgbW9kZSBgcm91bmRpbmdgLlxyXG4gKlxyXG4gKi9cclxuUC5uYXR1cmFsRXhwb25lbnRpYWwgPSBQLmV4cCA9IGZ1bmN0aW9uICgpIHtcclxuICByZXR1cm4gbmF0dXJhbEV4cG9uZW50aWFsKHRoaXMpO1xyXG59O1xyXG5cclxuXHJcbi8qXHJcbiAqIFJldHVybiBhIG5ldyBEZWNpbWFsIHdob3NlIHZhbHVlIGlzIHRoZSBuYXR1cmFsIGxvZ2FyaXRobSBvZiB0aGUgdmFsdWUgb2YgdGhpcyBEZWNpbWFsLFxyXG4gKiByb3VuZGVkIHRvIGBwcmVjaXNpb25gIHNpZ25pZmljYW50IGRpZ2l0cyB1c2luZyByb3VuZGluZyBtb2RlIGByb3VuZGluZ2AuXHJcbiAqXHJcbiAqL1xyXG5QLm5hdHVyYWxMb2dhcml0aG0gPSBQLmxuID0gZnVuY3Rpb24gKCkge1xyXG4gIHJldHVybiBuYXR1cmFsTG9nYXJpdGhtKHRoaXMpO1xyXG59O1xyXG5cclxuXHJcbi8qXHJcbiAqIFJldHVybiBhIG5ldyBEZWNpbWFsIHdob3NlIHZhbHVlIGlzIHRoZSB2YWx1ZSBvZiB0aGlzIERlY2ltYWwgbmVnYXRlZCwgaS5lLiBhcyBpZiBtdWx0aXBsaWVkIGJ5XHJcbiAqIC0xLlxyXG4gKlxyXG4gKi9cclxuUC5uZWdhdGVkID0gUC5uZWcgPSBmdW5jdGlvbiAoKSB7XHJcbiAgdmFyIHggPSBuZXcgdGhpcy5jb25zdHJ1Y3Rvcih0aGlzKTtcclxuICB4LnMgPSAteC5zO1xyXG4gIHJldHVybiBmaW5hbGlzZSh4KTtcclxufTtcclxuXHJcblxyXG4vKlxyXG4gKiAgbiArIDAgPSBuXHJcbiAqICBuICsgTiA9IE5cclxuICogIG4gKyBJID0gSVxyXG4gKiAgMCArIG4gPSBuXHJcbiAqICAwICsgMCA9IDBcclxuICogIDAgKyBOID0gTlxyXG4gKiAgMCArIEkgPSBJXHJcbiAqICBOICsgbiA9IE5cclxuICogIE4gKyAwID0gTlxyXG4gKiAgTiArIE4gPSBOXHJcbiAqICBOICsgSSA9IE5cclxuICogIEkgKyBuID0gSVxyXG4gKiAgSSArIDAgPSBJXHJcbiAqICBJICsgTiA9IE5cclxuICogIEkgKyBJID0gSVxyXG4gKlxyXG4gKiBSZXR1cm4gYSBuZXcgRGVjaW1hbCB3aG9zZSB2YWx1ZSBpcyB0aGUgdmFsdWUgb2YgdGhpcyBEZWNpbWFsIHBsdXMgYHlgLCByb3VuZGVkIHRvIGBwcmVjaXNpb25gXHJcbiAqIHNpZ25pZmljYW50IGRpZ2l0cyB1c2luZyByb3VuZGluZyBtb2RlIGByb3VuZGluZ2AuXHJcbiAqXHJcbiAqL1xyXG5QLnBsdXMgPSBQLmFkZCA9IGZ1bmN0aW9uICh5KSB7XHJcbiAgdmFyIGNhcnJ5LCBkLCBlLCBpLCBrLCBsZW4sIHByLCBybSwgeGQsIHlkLFxyXG4gICAgeCA9IHRoaXMsXHJcbiAgICBDdG9yID0geC5jb25zdHJ1Y3RvcjtcclxuXHJcbiAgeSA9IG5ldyBDdG9yKHkpO1xyXG5cclxuICAvLyBJZiBlaXRoZXIgaXMgbm90IGZpbml0ZS4uLlxyXG4gIGlmICgheC5kIHx8ICF5LmQpIHtcclxuXHJcbiAgICAvLyBSZXR1cm4gTmFOIGlmIGVpdGhlciBpcyBOYU4uXHJcbiAgICBpZiAoIXgucyB8fCAheS5zKSB5ID0gbmV3IEN0b3IoTmFOKTtcclxuXHJcbiAgICAvLyBSZXR1cm4geCBpZiB5IGlzIGZpbml0ZSBhbmQgeCBpcyBcdTAwQjFJbmZpbml0eS5cclxuICAgIC8vIFJldHVybiB4IGlmIGJvdGggYXJlIFx1MDBCMUluZmluaXR5IHdpdGggdGhlIHNhbWUgc2lnbi5cclxuICAgIC8vIFJldHVybiBOYU4gaWYgYm90aCBhcmUgXHUwMEIxSW5maW5pdHkgd2l0aCBkaWZmZXJlbnQgc2lnbnMuXHJcbiAgICAvLyBSZXR1cm4geSBpZiB4IGlzIGZpbml0ZSBhbmQgeSBpcyBcdTAwQjFJbmZpbml0eS5cclxuICAgIGVsc2UgaWYgKCF4LmQpIHkgPSBuZXcgQ3Rvcih5LmQgfHwgeC5zID09PSB5LnMgPyB4IDogTmFOKTtcclxuXHJcbiAgICByZXR1cm4geTtcclxuICB9XHJcblxyXG4gICAvLyBJZiBzaWducyBkaWZmZXIuLi5cclxuICBpZiAoeC5zICE9IHkucykge1xyXG4gICAgeS5zID0gLXkucztcclxuICAgIHJldHVybiB4Lm1pbnVzKHkpO1xyXG4gIH1cclxuXHJcbiAgeGQgPSB4LmQ7XHJcbiAgeWQgPSB5LmQ7XHJcbiAgcHIgPSBDdG9yLnByZWNpc2lvbjtcclxuICBybSA9IEN0b3Iucm91bmRpbmc7XHJcblxyXG4gIC8vIElmIGVpdGhlciBpcyB6ZXJvLi4uXHJcbiAgaWYgKCF4ZFswXSB8fCAheWRbMF0pIHtcclxuXHJcbiAgICAvLyBSZXR1cm4geCBpZiB5IGlzIHplcm8uXHJcbiAgICAvLyBSZXR1cm4geSBpZiB5IGlzIG5vbi16ZXJvLlxyXG4gICAgaWYgKCF5ZFswXSkgeSA9IG5ldyBDdG9yKHgpO1xyXG5cclxuICAgIHJldHVybiBleHRlcm5hbCA/IGZpbmFsaXNlKHksIHByLCBybSkgOiB5O1xyXG4gIH1cclxuXHJcbiAgLy8geCBhbmQgeSBhcmUgZmluaXRlLCBub24temVybyBudW1iZXJzIHdpdGggdGhlIHNhbWUgc2lnbi5cclxuXHJcbiAgLy8gQ2FsY3VsYXRlIGJhc2UgMWU3IGV4cG9uZW50cy5cclxuICBrID0gbWF0aGZsb29yKHguZSAvIExPR19CQVNFKTtcclxuICBlID0gbWF0aGZsb29yKHkuZSAvIExPR19CQVNFKTtcclxuXHJcbiAgeGQgPSB4ZC5zbGljZSgpO1xyXG4gIGkgPSBrIC0gZTtcclxuXHJcbiAgLy8gSWYgYmFzZSAxZTcgZXhwb25lbnRzIGRpZmZlci4uLlxyXG4gIGlmIChpKSB7XHJcblxyXG4gICAgaWYgKGkgPCAwKSB7XHJcbiAgICAgIGQgPSB4ZDtcclxuICAgICAgaSA9IC1pO1xyXG4gICAgICBsZW4gPSB5ZC5sZW5ndGg7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICBkID0geWQ7XHJcbiAgICAgIGUgPSBrO1xyXG4gICAgICBsZW4gPSB4ZC5sZW5ndGg7XHJcbiAgICB9XHJcblxyXG4gICAgLy8gTGltaXQgbnVtYmVyIG9mIHplcm9zIHByZXBlbmRlZCB0byBtYXgoY2VpbChwciAvIExPR19CQVNFKSwgbGVuKSArIDEuXHJcbiAgICBrID0gTWF0aC5jZWlsKHByIC8gTE9HX0JBU0UpO1xyXG4gICAgbGVuID0gayA+IGxlbiA/IGsgKyAxIDogbGVuICsgMTtcclxuXHJcbiAgICBpZiAoaSA+IGxlbikge1xyXG4gICAgICBpID0gbGVuO1xyXG4gICAgICBkLmxlbmd0aCA9IDE7XHJcbiAgICB9XHJcblxyXG4gICAgLy8gUHJlcGVuZCB6ZXJvcyB0byBlcXVhbGlzZSBleHBvbmVudHMuIE5vdGU6IEZhc3RlciB0byB1c2UgcmV2ZXJzZSB0aGVuIGRvIHVuc2hpZnRzLlxyXG4gICAgZC5yZXZlcnNlKCk7XHJcbiAgICBmb3IgKDsgaS0tOykgZC5wdXNoKDApO1xyXG4gICAgZC5yZXZlcnNlKCk7XHJcbiAgfVxyXG5cclxuICBsZW4gPSB4ZC5sZW5ndGg7XHJcbiAgaSA9IHlkLmxlbmd0aDtcclxuXHJcbiAgLy8gSWYgeWQgaXMgbG9uZ2VyIHRoYW4geGQsIHN3YXAgeGQgYW5kIHlkIHNvIHhkIHBvaW50cyB0byB0aGUgbG9uZ2VyIGFycmF5LlxyXG4gIGlmIChsZW4gLSBpIDwgMCkge1xyXG4gICAgaSA9IGxlbjtcclxuICAgIGQgPSB5ZDtcclxuICAgIHlkID0geGQ7XHJcbiAgICB4ZCA9IGQ7XHJcbiAgfVxyXG5cclxuICAvLyBPbmx5IHN0YXJ0IGFkZGluZyBhdCB5ZC5sZW5ndGggLSAxIGFzIHRoZSBmdXJ0aGVyIGRpZ2l0cyBvZiB4ZCBjYW4gYmUgbGVmdCBhcyB0aGV5IGFyZS5cclxuICBmb3IgKGNhcnJ5ID0gMDsgaTspIHtcclxuICAgIGNhcnJ5ID0gKHhkWy0taV0gPSB4ZFtpXSArIHlkW2ldICsgY2FycnkpIC8gQkFTRSB8IDA7XHJcbiAgICB4ZFtpXSAlPSBCQVNFO1xyXG4gIH1cclxuXHJcbiAgaWYgKGNhcnJ5KSB7XHJcbiAgICB4ZC51bnNoaWZ0KGNhcnJ5KTtcclxuICAgICsrZTtcclxuICB9XHJcblxyXG4gIC8vIFJlbW92ZSB0cmFpbGluZyB6ZXJvcy5cclxuICAvLyBObyBuZWVkIHRvIGNoZWNrIGZvciB6ZXJvLCBhcyAreCArICt5ICE9IDAgJiYgLXggKyAteSAhPSAwXHJcbiAgZm9yIChsZW4gPSB4ZC5sZW5ndGg7IHhkWy0tbGVuXSA9PSAwOykgeGQucG9wKCk7XHJcblxyXG4gIHkuZCA9IHhkO1xyXG4gIHkuZSA9IGdldEJhc2UxMEV4cG9uZW50KHhkLCBlKTtcclxuXHJcbiAgcmV0dXJuIGV4dGVybmFsID8gZmluYWxpc2UoeSwgcHIsIHJtKSA6IHk7XHJcbn07XHJcblxyXG5cclxuLypcclxuICogUmV0dXJuIHRoZSBudW1iZXIgb2Ygc2lnbmlmaWNhbnQgZGlnaXRzIG9mIHRoZSB2YWx1ZSBvZiB0aGlzIERlY2ltYWwuXHJcbiAqXHJcbiAqIFt6XSB7Ym9vbGVhbnxudW1iZXJ9IFdoZXRoZXIgdG8gY291bnQgaW50ZWdlci1wYXJ0IHRyYWlsaW5nIHplcm9zOiB0cnVlLCBmYWxzZSwgMSBvciAwLlxyXG4gKlxyXG4gKi9cclxuUC5wcmVjaXNpb24gPSBQLnNkID0gZnVuY3Rpb24gKHopIHtcclxuICB2YXIgayxcclxuICAgIHggPSB0aGlzO1xyXG5cclxuICBpZiAoeiAhPT0gdm9pZCAwICYmIHogIT09ICEheiAmJiB6ICE9PSAxICYmIHogIT09IDApIHRocm93IEVycm9yKGludmFsaWRBcmd1bWVudCArIHopO1xyXG5cclxuICBpZiAoeC5kKSB7XHJcbiAgICBrID0gZ2V0UHJlY2lzaW9uKHguZCk7XHJcbiAgICBpZiAoeiAmJiB4LmUgKyAxID4gaykgayA9IHguZSArIDE7XHJcbiAgfSBlbHNlIHtcclxuICAgIGsgPSBOYU47XHJcbiAgfVxyXG5cclxuICByZXR1cm4gaztcclxufTtcclxuXHJcblxyXG4vKlxyXG4gKiBSZXR1cm4gYSBuZXcgRGVjaW1hbCB3aG9zZSB2YWx1ZSBpcyB0aGUgdmFsdWUgb2YgdGhpcyBEZWNpbWFsIHJvdW5kZWQgdG8gYSB3aG9sZSBudW1iZXIgdXNpbmdcclxuICogcm91bmRpbmcgbW9kZSBgcm91bmRpbmdgLlxyXG4gKlxyXG4gKi9cclxuUC5yb3VuZCA9IGZ1bmN0aW9uICgpIHtcclxuICB2YXIgeCA9IHRoaXMsXHJcbiAgICBDdG9yID0geC5jb25zdHJ1Y3RvcjtcclxuXHJcbiAgcmV0dXJuIGZpbmFsaXNlKG5ldyBDdG9yKHgpLCB4LmUgKyAxLCBDdG9yLnJvdW5kaW5nKTtcclxufTtcclxuXHJcblxyXG4vKlxyXG4gKiBSZXR1cm4gYSBuZXcgRGVjaW1hbCB3aG9zZSB2YWx1ZSBpcyB0aGUgc2luZSBvZiB0aGUgdmFsdWUgaW4gcmFkaWFucyBvZiB0aGlzIERlY2ltYWwuXHJcbiAqXHJcbiAqIERvbWFpbjogWy1JbmZpbml0eSwgSW5maW5pdHldXHJcbiAqIFJhbmdlOiBbLTEsIDFdXHJcbiAqXHJcbiAqIHNpbih4KSA9IHggLSB4XjMvMyEgKyB4XjUvNSEgLSAuLi5cclxuICpcclxuICogc2luKDApICAgICAgICAgPSAwXHJcbiAqIHNpbigtMCkgICAgICAgID0gLTBcclxuICogc2luKEluZmluaXR5KSAgPSBOYU5cclxuICogc2luKC1JbmZpbml0eSkgPSBOYU5cclxuICogc2luKE5hTikgICAgICAgPSBOYU5cclxuICpcclxuICovXHJcblAuc2luZSA9IFAuc2luID0gZnVuY3Rpb24gKCkge1xyXG4gIHZhciBwciwgcm0sXHJcbiAgICB4ID0gdGhpcyxcclxuICAgIEN0b3IgPSB4LmNvbnN0cnVjdG9yO1xyXG5cclxuICBpZiAoIXguaXNGaW5pdGUoKSkgcmV0dXJuIG5ldyBDdG9yKE5hTik7XHJcbiAgaWYgKHguaXNaZXJvKCkpIHJldHVybiBuZXcgQ3Rvcih4KTtcclxuXHJcbiAgcHIgPSBDdG9yLnByZWNpc2lvbjtcclxuICBybSA9IEN0b3Iucm91bmRpbmc7XHJcbiAgQ3Rvci5wcmVjaXNpb24gPSBwciArIE1hdGgubWF4KHguZSwgeC5zZCgpKSArIExPR19CQVNFO1xyXG4gIEN0b3Iucm91bmRpbmcgPSAxO1xyXG5cclxuICB4ID0gc2luZShDdG9yLCB0b0xlc3NUaGFuSGFsZlBpKEN0b3IsIHgpKTtcclxuXHJcbiAgQ3Rvci5wcmVjaXNpb24gPSBwcjtcclxuICBDdG9yLnJvdW5kaW5nID0gcm07XHJcblxyXG4gIHJldHVybiBmaW5hbGlzZShxdWFkcmFudCA+IDIgPyB4Lm5lZygpIDogeCwgcHIsIHJtLCB0cnVlKTtcclxufTtcclxuXHJcblxyXG4vKlxyXG4gKiBSZXR1cm4gYSBuZXcgRGVjaW1hbCB3aG9zZSB2YWx1ZSBpcyB0aGUgc3F1YXJlIHJvb3Qgb2YgdGhpcyBEZWNpbWFsLCByb3VuZGVkIHRvIGBwcmVjaXNpb25gXHJcbiAqIHNpZ25pZmljYW50IGRpZ2l0cyB1c2luZyByb3VuZGluZyBtb2RlIGByb3VuZGluZ2AuXHJcbiAqXHJcbiAqICBzcXJ0KC1uKSA9ICBOXHJcbiAqICBzcXJ0KE4pICA9ICBOXHJcbiAqICBzcXJ0KC1JKSA9ICBOXHJcbiAqICBzcXJ0KEkpICA9ICBJXHJcbiAqICBzcXJ0KDApICA9ICAwXHJcbiAqICBzcXJ0KC0wKSA9IC0wXHJcbiAqXHJcbiAqL1xyXG5QLnNxdWFyZVJvb3QgPSBQLnNxcnQgPSBmdW5jdGlvbiAoKSB7XHJcbiAgdmFyIG0sIG4sIHNkLCByLCByZXAsIHQsXHJcbiAgICB4ID0gdGhpcyxcclxuICAgIGQgPSB4LmQsXHJcbiAgICBlID0geC5lLFxyXG4gICAgcyA9IHgucyxcclxuICAgIEN0b3IgPSB4LmNvbnN0cnVjdG9yO1xyXG5cclxuICAvLyBOZWdhdGl2ZS9OYU4vSW5maW5pdHkvemVybz9cclxuICBpZiAocyAhPT0gMSB8fCAhZCB8fCAhZFswXSkge1xyXG4gICAgcmV0dXJuIG5ldyBDdG9yKCFzIHx8IHMgPCAwICYmICghZCB8fCBkWzBdKSA/IE5hTiA6IGQgPyB4IDogMSAvIDApO1xyXG4gIH1cclxuXHJcbiAgZXh0ZXJuYWwgPSBmYWxzZTtcclxuXHJcbiAgLy8gSW5pdGlhbCBlc3RpbWF0ZS5cclxuICBzID0gTWF0aC5zcXJ0KCt4KTtcclxuXHJcbiAgLy8gTWF0aC5zcXJ0IHVuZGVyZmxvdy9vdmVyZmxvdz9cclxuICAvLyBQYXNzIHggdG8gTWF0aC5zcXJ0IGFzIGludGVnZXIsIHRoZW4gYWRqdXN0IHRoZSBleHBvbmVudCBvZiB0aGUgcmVzdWx0LlxyXG4gIGlmIChzID09IDAgfHwgcyA9PSAxIC8gMCkge1xyXG4gICAgbiA9IGRpZ2l0c1RvU3RyaW5nKGQpO1xyXG5cclxuICAgIGlmICgobi5sZW5ndGggKyBlKSAlIDIgPT0gMCkgbiArPSAnMCc7XHJcbiAgICBzID0gTWF0aC5zcXJ0KG4pO1xyXG4gICAgZSA9IG1hdGhmbG9vcigoZSArIDEpIC8gMikgLSAoZSA8IDAgfHwgZSAlIDIpO1xyXG5cclxuICAgIGlmIChzID09IDEgLyAwKSB7XHJcbiAgICAgIG4gPSAnNWUnICsgZTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIG4gPSBzLnRvRXhwb25lbnRpYWwoKTtcclxuICAgICAgbiA9IG4uc2xpY2UoMCwgbi5pbmRleE9mKCdlJykgKyAxKSArIGU7XHJcbiAgICB9XHJcblxyXG4gICAgciA9IG5ldyBDdG9yKG4pO1xyXG4gIH0gZWxzZSB7XHJcbiAgICByID0gbmV3IEN0b3Iocy50b1N0cmluZygpKTtcclxuICB9XHJcblxyXG4gIHNkID0gKGUgPSBDdG9yLnByZWNpc2lvbikgKyAzO1xyXG5cclxuICAvLyBOZXd0b24tUmFwaHNvbiBpdGVyYXRpb24uXHJcbiAgZm9yICg7Oykge1xyXG4gICAgdCA9IHI7XHJcbiAgICByID0gdC5wbHVzKGRpdmlkZSh4LCB0LCBzZCArIDIsIDEpKS50aW1lcygwLjUpO1xyXG5cclxuICAgIC8vIFRPRE8/IFJlcGxhY2Ugd2l0aCBmb3ItbG9vcCBhbmQgY2hlY2tSb3VuZGluZ0RpZ2l0cy5cclxuICAgIGlmIChkaWdpdHNUb1N0cmluZyh0LmQpLnNsaWNlKDAsIHNkKSA9PT0gKG4gPSBkaWdpdHNUb1N0cmluZyhyLmQpKS5zbGljZSgwLCBzZCkpIHtcclxuICAgICAgbiA9IG4uc2xpY2Uoc2QgLSAzLCBzZCArIDEpO1xyXG5cclxuICAgICAgLy8gVGhlIDR0aCByb3VuZGluZyBkaWdpdCBtYXkgYmUgaW4gZXJyb3IgYnkgLTEgc28gaWYgdGhlIDQgcm91bmRpbmcgZGlnaXRzIGFyZSA5OTk5IG9yXHJcbiAgICAgIC8vIDQ5OTksIGkuZS4gYXBwcm9hY2hpbmcgYSByb3VuZGluZyBib3VuZGFyeSwgY29udGludWUgdGhlIGl0ZXJhdGlvbi5cclxuICAgICAgaWYgKG4gPT0gJzk5OTknIHx8ICFyZXAgJiYgbiA9PSAnNDk5OScpIHtcclxuXHJcbiAgICAgICAgLy8gT24gdGhlIGZpcnN0IGl0ZXJhdGlvbiBvbmx5LCBjaGVjayB0byBzZWUgaWYgcm91bmRpbmcgdXAgZ2l2ZXMgdGhlIGV4YWN0IHJlc3VsdCBhcyB0aGVcclxuICAgICAgICAvLyBuaW5lcyBtYXkgaW5maW5pdGVseSByZXBlYXQuXHJcbiAgICAgICAgaWYgKCFyZXApIHtcclxuICAgICAgICAgIGZpbmFsaXNlKHQsIGUgKyAxLCAwKTtcclxuXHJcbiAgICAgICAgICBpZiAodC50aW1lcyh0KS5lcSh4KSkge1xyXG4gICAgICAgICAgICByID0gdDtcclxuICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBzZCArPSA0O1xyXG4gICAgICAgIHJlcCA9IDE7XHJcbiAgICAgIH0gZWxzZSB7XHJcblxyXG4gICAgICAgIC8vIElmIHRoZSByb3VuZGluZyBkaWdpdHMgYXJlIG51bGwsIDB7MCw0fSBvciA1MHswLDN9LCBjaGVjayBmb3IgYW4gZXhhY3QgcmVzdWx0LlxyXG4gICAgICAgIC8vIElmIG5vdCwgdGhlbiB0aGVyZSBhcmUgZnVydGhlciBkaWdpdHMgYW5kIG0gd2lsbCBiZSB0cnV0aHkuXHJcbiAgICAgICAgaWYgKCErbiB8fCAhK24uc2xpY2UoMSkgJiYgbi5jaGFyQXQoMCkgPT0gJzUnKSB7XHJcblxyXG4gICAgICAgICAgLy8gVHJ1bmNhdGUgdG8gdGhlIGZpcnN0IHJvdW5kaW5nIGRpZ2l0LlxyXG4gICAgICAgICAgZmluYWxpc2UociwgZSArIDEsIDEpO1xyXG4gICAgICAgICAgbSA9ICFyLnRpbWVzKHIpLmVxKHgpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgYnJlYWs7XHJcbiAgICAgIH1cclxuICAgIH1cclxuICB9XHJcblxyXG4gIGV4dGVybmFsID0gdHJ1ZTtcclxuXHJcbiAgcmV0dXJuIGZpbmFsaXNlKHIsIGUsIEN0b3Iucm91bmRpbmcsIG0pO1xyXG59O1xyXG5cclxuXHJcbi8qXHJcbiAqIFJldHVybiBhIG5ldyBEZWNpbWFsIHdob3NlIHZhbHVlIGlzIHRoZSB0YW5nZW50IG9mIHRoZSB2YWx1ZSBpbiByYWRpYW5zIG9mIHRoaXMgRGVjaW1hbC5cclxuICpcclxuICogRG9tYWluOiBbLUluZmluaXR5LCBJbmZpbml0eV1cclxuICogUmFuZ2U6IFstSW5maW5pdHksIEluZmluaXR5XVxyXG4gKlxyXG4gKiB0YW4oMCkgICAgICAgICA9IDBcclxuICogdGFuKC0wKSAgICAgICAgPSAtMFxyXG4gKiB0YW4oSW5maW5pdHkpICA9IE5hTlxyXG4gKiB0YW4oLUluZmluaXR5KSA9IE5hTlxyXG4gKiB0YW4oTmFOKSAgICAgICA9IE5hTlxyXG4gKlxyXG4gKi9cclxuUC50YW5nZW50ID0gUC50YW4gPSBmdW5jdGlvbiAoKSB7XHJcbiAgdmFyIHByLCBybSxcclxuICAgIHggPSB0aGlzLFxyXG4gICAgQ3RvciA9IHguY29uc3RydWN0b3I7XHJcblxyXG4gIGlmICgheC5pc0Zpbml0ZSgpKSByZXR1cm4gbmV3IEN0b3IoTmFOKTtcclxuICBpZiAoeC5pc1plcm8oKSkgcmV0dXJuIG5ldyBDdG9yKHgpO1xyXG5cclxuICBwciA9IEN0b3IucHJlY2lzaW9uO1xyXG4gIHJtID0gQ3Rvci5yb3VuZGluZztcclxuICBDdG9yLnByZWNpc2lvbiA9IHByICsgMTA7XHJcbiAgQ3Rvci5yb3VuZGluZyA9IDE7XHJcblxyXG4gIHggPSB4LnNpbigpO1xyXG4gIHgucyA9IDE7XHJcbiAgeCA9IGRpdmlkZSh4LCBuZXcgQ3RvcigxKS5taW51cyh4LnRpbWVzKHgpKS5zcXJ0KCksIHByICsgMTAsIDApO1xyXG5cclxuICBDdG9yLnByZWNpc2lvbiA9IHByO1xyXG4gIEN0b3Iucm91bmRpbmcgPSBybTtcclxuXHJcbiAgcmV0dXJuIGZpbmFsaXNlKHF1YWRyYW50ID09IDIgfHwgcXVhZHJhbnQgPT0gNCA/IHgubmVnKCkgOiB4LCBwciwgcm0sIHRydWUpO1xyXG59O1xyXG5cclxuXHJcbi8qXHJcbiAqICBuICogMCA9IDBcclxuICogIG4gKiBOID0gTlxyXG4gKiAgbiAqIEkgPSBJXHJcbiAqICAwICogbiA9IDBcclxuICogIDAgKiAwID0gMFxyXG4gKiAgMCAqIE4gPSBOXHJcbiAqICAwICogSSA9IE5cclxuICogIE4gKiBuID0gTlxyXG4gKiAgTiAqIDAgPSBOXHJcbiAqICBOICogTiA9IE5cclxuICogIE4gKiBJID0gTlxyXG4gKiAgSSAqIG4gPSBJXHJcbiAqICBJICogMCA9IE5cclxuICogIEkgKiBOID0gTlxyXG4gKiAgSSAqIEkgPSBJXHJcbiAqXHJcbiAqIFJldHVybiBhIG5ldyBEZWNpbWFsIHdob3NlIHZhbHVlIGlzIHRoaXMgRGVjaW1hbCB0aW1lcyBgeWAsIHJvdW5kZWQgdG8gYHByZWNpc2lvbmAgc2lnbmlmaWNhbnRcclxuICogZGlnaXRzIHVzaW5nIHJvdW5kaW5nIG1vZGUgYHJvdW5kaW5nYC5cclxuICpcclxuICovXHJcblAudGltZXMgPSBQLm11bCA9IGZ1bmN0aW9uICh5KSB7XHJcbiAgdmFyIGNhcnJ5LCBlLCBpLCBrLCByLCByTCwgdCwgeGRMLCB5ZEwsXHJcbiAgICB4ID0gdGhpcyxcclxuICAgIEN0b3IgPSB4LmNvbnN0cnVjdG9yLFxyXG4gICAgeGQgPSB4LmQsXHJcbiAgICB5ZCA9ICh5ID0gbmV3IEN0b3IoeSkpLmQ7XHJcblxyXG4gIHkucyAqPSB4LnM7XHJcblxyXG4gICAvLyBJZiBlaXRoZXIgaXMgTmFOLCBcdTAwQjFJbmZpbml0eSBvciBcdTAwQjEwLi4uXHJcbiAgaWYgKCF4ZCB8fCAheGRbMF0gfHwgIXlkIHx8ICF5ZFswXSkge1xyXG5cclxuICAgIHJldHVybiBuZXcgQ3RvcigheS5zIHx8IHhkICYmICF4ZFswXSAmJiAheWQgfHwgeWQgJiYgIXlkWzBdICYmICF4ZFxyXG5cclxuICAgICAgLy8gUmV0dXJuIE5hTiBpZiBlaXRoZXIgaXMgTmFOLlxyXG4gICAgICAvLyBSZXR1cm4gTmFOIGlmIHggaXMgXHUwMEIxMCBhbmQgeSBpcyBcdTAwQjFJbmZpbml0eSwgb3IgeSBpcyBcdTAwQjEwIGFuZCB4IGlzIFx1MDBCMUluZmluaXR5LlxyXG4gICAgICA/IE5hTlxyXG5cclxuICAgICAgLy8gUmV0dXJuIFx1MDBCMUluZmluaXR5IGlmIGVpdGhlciBpcyBcdTAwQjFJbmZpbml0eS5cclxuICAgICAgLy8gUmV0dXJuIFx1MDBCMTAgaWYgZWl0aGVyIGlzIFx1MDBCMTAuXHJcbiAgICAgIDogIXhkIHx8ICF5ZCA/IHkucyAvIDAgOiB5LnMgKiAwKTtcclxuICB9XHJcblxyXG4gIGUgPSBtYXRoZmxvb3IoeC5lIC8gTE9HX0JBU0UpICsgbWF0aGZsb29yKHkuZSAvIExPR19CQVNFKTtcclxuICB4ZEwgPSB4ZC5sZW5ndGg7XHJcbiAgeWRMID0geWQubGVuZ3RoO1xyXG5cclxuICAvLyBFbnN1cmUgeGQgcG9pbnRzIHRvIHRoZSBsb25nZXIgYXJyYXkuXHJcbiAgaWYgKHhkTCA8IHlkTCkge1xyXG4gICAgciA9IHhkO1xyXG4gICAgeGQgPSB5ZDtcclxuICAgIHlkID0gcjtcclxuICAgIHJMID0geGRMO1xyXG4gICAgeGRMID0geWRMO1xyXG4gICAgeWRMID0gckw7XHJcbiAgfVxyXG5cclxuICAvLyBJbml0aWFsaXNlIHRoZSByZXN1bHQgYXJyYXkgd2l0aCB6ZXJvcy5cclxuICByID0gW107XHJcbiAgckwgPSB4ZEwgKyB5ZEw7XHJcbiAgZm9yIChpID0gckw7IGktLTspIHIucHVzaCgwKTtcclxuXHJcbiAgLy8gTXVsdGlwbHkhXHJcbiAgZm9yIChpID0geWRMOyAtLWkgPj0gMDspIHtcclxuICAgIGNhcnJ5ID0gMDtcclxuICAgIGZvciAoayA9IHhkTCArIGk7IGsgPiBpOykge1xyXG4gICAgICB0ID0gcltrXSArIHlkW2ldICogeGRbayAtIGkgLSAxXSArIGNhcnJ5O1xyXG4gICAgICByW2stLV0gPSB0ICUgQkFTRSB8IDA7XHJcbiAgICAgIGNhcnJ5ID0gdCAvIEJBU0UgfCAwO1xyXG4gICAgfVxyXG5cclxuICAgIHJba10gPSAocltrXSArIGNhcnJ5KSAlIEJBU0UgfCAwO1xyXG4gIH1cclxuXHJcbiAgLy8gUmVtb3ZlIHRyYWlsaW5nIHplcm9zLlxyXG4gIGZvciAoOyAhclstLXJMXTspIHIucG9wKCk7XHJcblxyXG4gIGlmIChjYXJyeSkgKytlO1xyXG4gIGVsc2Ugci5zaGlmdCgpO1xyXG5cclxuICB5LmQgPSByO1xyXG4gIHkuZSA9IGdldEJhc2UxMEV4cG9uZW50KHIsIGUpO1xyXG5cclxuICByZXR1cm4gZXh0ZXJuYWwgPyBmaW5hbGlzZSh5LCBDdG9yLnByZWNpc2lvbiwgQ3Rvci5yb3VuZGluZykgOiB5O1xyXG59O1xyXG5cclxuXHJcbi8qXHJcbiAqIFJldHVybiBhIHN0cmluZyByZXByZXNlbnRpbmcgdGhlIHZhbHVlIG9mIHRoaXMgRGVjaW1hbCBpbiBiYXNlIDIsIHJvdW5kIHRvIGBzZGAgc2lnbmlmaWNhbnRcclxuICogZGlnaXRzIHVzaW5nIHJvdW5kaW5nIG1vZGUgYHJtYC5cclxuICpcclxuICogSWYgdGhlIG9wdGlvbmFsIGBzZGAgYXJndW1lbnQgaXMgcHJlc2VudCB0aGVuIHJldHVybiBiaW5hcnkgZXhwb25lbnRpYWwgbm90YXRpb24uXHJcbiAqXHJcbiAqIFtzZF0ge251bWJlcn0gU2lnbmlmaWNhbnQgZGlnaXRzLiBJbnRlZ2VyLCAxIHRvIE1BWF9ESUdJVFMgaW5jbHVzaXZlLlxyXG4gKiBbcm1dIHtudW1iZXJ9IFJvdW5kaW5nIG1vZGUuIEludGVnZXIsIDAgdG8gOCBpbmNsdXNpdmUuXHJcbiAqXHJcbiAqL1xyXG5QLnRvQmluYXJ5ID0gZnVuY3Rpb24gKHNkLCBybSkge1xyXG4gIHJldHVybiB0b1N0cmluZ0JpbmFyeSh0aGlzLCAyLCBzZCwgcm0pO1xyXG59O1xyXG5cclxuXHJcbi8qXHJcbiAqIFJldHVybiBhIG5ldyBEZWNpbWFsIHdob3NlIHZhbHVlIGlzIHRoZSB2YWx1ZSBvZiB0aGlzIERlY2ltYWwgcm91bmRlZCB0byBhIG1heGltdW0gb2YgYGRwYFxyXG4gKiBkZWNpbWFsIHBsYWNlcyB1c2luZyByb3VuZGluZyBtb2RlIGBybWAgb3IgYHJvdW5kaW5nYCBpZiBgcm1gIGlzIG9taXR0ZWQuXHJcbiAqXHJcbiAqIElmIGBkcGAgaXMgb21pdHRlZCwgcmV0dXJuIGEgbmV3IERlY2ltYWwgd2hvc2UgdmFsdWUgaXMgdGhlIHZhbHVlIG9mIHRoaXMgRGVjaW1hbC5cclxuICpcclxuICogW2RwXSB7bnVtYmVyfSBEZWNpbWFsIHBsYWNlcy4gSW50ZWdlciwgMCB0byBNQVhfRElHSVRTIGluY2x1c2l2ZS5cclxuICogW3JtXSB7bnVtYmVyfSBSb3VuZGluZyBtb2RlLiBJbnRlZ2VyLCAwIHRvIDggaW5jbHVzaXZlLlxyXG4gKlxyXG4gKi9cclxuUC50b0RlY2ltYWxQbGFjZXMgPSBQLnRvRFAgPSBmdW5jdGlvbiAoZHAsIHJtKSB7XHJcbiAgdmFyIHggPSB0aGlzLFxyXG4gICAgQ3RvciA9IHguY29uc3RydWN0b3I7XHJcblxyXG4gIHggPSBuZXcgQ3Rvcih4KTtcclxuICBpZiAoZHAgPT09IHZvaWQgMCkgcmV0dXJuIHg7XHJcblxyXG4gIGNoZWNrSW50MzIoZHAsIDAsIE1BWF9ESUdJVFMpO1xyXG5cclxuICBpZiAocm0gPT09IHZvaWQgMCkgcm0gPSBDdG9yLnJvdW5kaW5nO1xyXG4gIGVsc2UgY2hlY2tJbnQzMihybSwgMCwgOCk7XHJcblxyXG4gIHJldHVybiBmaW5hbGlzZSh4LCBkcCArIHguZSArIDEsIHJtKTtcclxufTtcclxuXHJcblxyXG4vKlxyXG4gKiBSZXR1cm4gYSBzdHJpbmcgcmVwcmVzZW50aW5nIHRoZSB2YWx1ZSBvZiB0aGlzIERlY2ltYWwgaW4gZXhwb25lbnRpYWwgbm90YXRpb24gcm91bmRlZCB0b1xyXG4gKiBgZHBgIGZpeGVkIGRlY2ltYWwgcGxhY2VzIHVzaW5nIHJvdW5kaW5nIG1vZGUgYHJvdW5kaW5nYC5cclxuICpcclxuICogW2RwXSB7bnVtYmVyfSBEZWNpbWFsIHBsYWNlcy4gSW50ZWdlciwgMCB0byBNQVhfRElHSVRTIGluY2x1c2l2ZS5cclxuICogW3JtXSB7bnVtYmVyfSBSb3VuZGluZyBtb2RlLiBJbnRlZ2VyLCAwIHRvIDggaW5jbHVzaXZlLlxyXG4gKlxyXG4gKi9cclxuUC50b0V4cG9uZW50aWFsID0gZnVuY3Rpb24gKGRwLCBybSkge1xyXG4gIHZhciBzdHIsXHJcbiAgICB4ID0gdGhpcyxcclxuICAgIEN0b3IgPSB4LmNvbnN0cnVjdG9yO1xyXG5cclxuICBpZiAoZHAgPT09IHZvaWQgMCkge1xyXG4gICAgc3RyID0gZmluaXRlVG9TdHJpbmcoeCwgdHJ1ZSk7XHJcbiAgfSBlbHNlIHtcclxuICAgIGNoZWNrSW50MzIoZHAsIDAsIE1BWF9ESUdJVFMpO1xyXG5cclxuICAgIGlmIChybSA9PT0gdm9pZCAwKSBybSA9IEN0b3Iucm91bmRpbmc7XHJcbiAgICBlbHNlIGNoZWNrSW50MzIocm0sIDAsIDgpO1xyXG5cclxuICAgIHggPSBmaW5hbGlzZShuZXcgQ3Rvcih4KSwgZHAgKyAxLCBybSk7XHJcbiAgICBzdHIgPSBmaW5pdGVUb1N0cmluZyh4LCB0cnVlLCBkcCArIDEpO1xyXG4gIH1cclxuXHJcbiAgcmV0dXJuIHguaXNOZWcoKSAmJiAheC5pc1plcm8oKSA/ICctJyArIHN0ciA6IHN0cjtcclxufTtcclxuXHJcblxyXG4vKlxyXG4gKiBSZXR1cm4gYSBzdHJpbmcgcmVwcmVzZW50aW5nIHRoZSB2YWx1ZSBvZiB0aGlzIERlY2ltYWwgaW4gbm9ybWFsIChmaXhlZC1wb2ludCkgbm90YXRpb24gdG9cclxuICogYGRwYCBmaXhlZCBkZWNpbWFsIHBsYWNlcyBhbmQgcm91bmRlZCB1c2luZyByb3VuZGluZyBtb2RlIGBybWAgb3IgYHJvdW5kaW5nYCBpZiBgcm1gIGlzXHJcbiAqIG9taXR0ZWQuXHJcbiAqXHJcbiAqIEFzIHdpdGggSmF2YVNjcmlwdCBudW1iZXJzLCAoLTApLnRvRml4ZWQoMCkgaXMgJzAnLCBidXQgZS5nLiAoLTAuMDAwMDEpLnRvRml4ZWQoMCkgaXMgJy0wJy5cclxuICpcclxuICogW2RwXSB7bnVtYmVyfSBEZWNpbWFsIHBsYWNlcy4gSW50ZWdlciwgMCB0byBNQVhfRElHSVRTIGluY2x1c2l2ZS5cclxuICogW3JtXSB7bnVtYmVyfSBSb3VuZGluZyBtb2RlLiBJbnRlZ2VyLCAwIHRvIDggaW5jbHVzaXZlLlxyXG4gKlxyXG4gKiAoLTApLnRvRml4ZWQoMCkgaXMgJzAnLCBidXQgKC0wLjEpLnRvRml4ZWQoMCkgaXMgJy0wJy5cclxuICogKC0wKS50b0ZpeGVkKDEpIGlzICcwLjAnLCBidXQgKC0wLjAxKS50b0ZpeGVkKDEpIGlzICctMC4wJy5cclxuICogKC0wKS50b0ZpeGVkKDMpIGlzICcwLjAwMCcuXHJcbiAqICgtMC41KS50b0ZpeGVkKDApIGlzICctMCcuXHJcbiAqXHJcbiAqL1xyXG5QLnRvRml4ZWQgPSBmdW5jdGlvbiAoZHAsIHJtKSB7XHJcbiAgdmFyIHN0ciwgeSxcclxuICAgIHggPSB0aGlzLFxyXG4gICAgQ3RvciA9IHguY29uc3RydWN0b3I7XHJcblxyXG4gIGlmIChkcCA9PT0gdm9pZCAwKSB7XHJcbiAgICBzdHIgPSBmaW5pdGVUb1N0cmluZyh4KTtcclxuICB9IGVsc2Uge1xyXG4gICAgY2hlY2tJbnQzMihkcCwgMCwgTUFYX0RJR0lUUyk7XHJcblxyXG4gICAgaWYgKHJtID09PSB2b2lkIDApIHJtID0gQ3Rvci5yb3VuZGluZztcclxuICAgIGVsc2UgY2hlY2tJbnQzMihybSwgMCwgOCk7XHJcblxyXG4gICAgeSA9IGZpbmFsaXNlKG5ldyBDdG9yKHgpLCBkcCArIHguZSArIDEsIHJtKTtcclxuICAgIHN0ciA9IGZpbml0ZVRvU3RyaW5nKHksIGZhbHNlLCBkcCArIHkuZSArIDEpO1xyXG4gIH1cclxuXHJcbiAgLy8gVG8gZGV0ZXJtaW5lIHdoZXRoZXIgdG8gYWRkIHRoZSBtaW51cyBzaWduIGxvb2sgYXQgdGhlIHZhbHVlIGJlZm9yZSBpdCB3YXMgcm91bmRlZCxcclxuICAvLyBpLmUuIGxvb2sgYXQgYHhgIHJhdGhlciB0aGFuIGB5YC5cclxuICByZXR1cm4geC5pc05lZygpICYmICF4LmlzWmVybygpID8gJy0nICsgc3RyIDogc3RyO1xyXG59O1xyXG5cclxuXHJcbi8qXHJcbiAqIFJldHVybiBhbiBhcnJheSByZXByZXNlbnRpbmcgdGhlIHZhbHVlIG9mIHRoaXMgRGVjaW1hbCBhcyBhIHNpbXBsZSBmcmFjdGlvbiB3aXRoIGFuIGludGVnZXJcclxuICogbnVtZXJhdG9yIGFuZCBhbiBpbnRlZ2VyIGRlbm9taW5hdG9yLlxyXG4gKlxyXG4gKiBUaGUgZGVub21pbmF0b3Igd2lsbCBiZSBhIHBvc2l0aXZlIG5vbi16ZXJvIHZhbHVlIGxlc3MgdGhhbiBvciBlcXVhbCB0byB0aGUgc3BlY2lmaWVkIG1heGltdW1cclxuICogZGVub21pbmF0b3IuIElmIGEgbWF4aW11bSBkZW5vbWluYXRvciBpcyBub3Qgc3BlY2lmaWVkLCB0aGUgZGVub21pbmF0b3Igd2lsbCBiZSB0aGUgbG93ZXN0XHJcbiAqIHZhbHVlIG5lY2Vzc2FyeSB0byByZXByZXNlbnQgdGhlIG51bWJlciBleGFjdGx5LlxyXG4gKlxyXG4gKiBbbWF4RF0ge251bWJlcnxzdHJpbmd8RGVjaW1hbH0gTWF4aW11bSBkZW5vbWluYXRvci4gSW50ZWdlciA+PSAxIGFuZCA8IEluZmluaXR5LlxyXG4gKlxyXG4gKi9cclxuUC50b0ZyYWN0aW9uID0gZnVuY3Rpb24gKG1heEQpIHtcclxuICB2YXIgZCwgZDAsIGQxLCBkMiwgZSwgaywgbiwgbjAsIG4xLCBwciwgcSwgcixcclxuICAgIHggPSB0aGlzLFxyXG4gICAgeGQgPSB4LmQsXHJcbiAgICBDdG9yID0geC5jb25zdHJ1Y3RvcjtcclxuXHJcbiAgaWYgKCF4ZCkgcmV0dXJuIG5ldyBDdG9yKHgpO1xyXG5cclxuICBuMSA9IGQwID0gbmV3IEN0b3IoMSk7XHJcbiAgZDEgPSBuMCA9IG5ldyBDdG9yKDApO1xyXG5cclxuICBkID0gbmV3IEN0b3IoZDEpO1xyXG4gIGUgPSBkLmUgPSBnZXRQcmVjaXNpb24oeGQpIC0geC5lIC0gMTtcclxuICBrID0gZSAlIExPR19CQVNFO1xyXG4gIGQuZFswXSA9IG1hdGhwb3coMTAsIGsgPCAwID8gTE9HX0JBU0UgKyBrIDogayk7XHJcblxyXG4gIGlmIChtYXhEID09IG51bGwpIHtcclxuXHJcbiAgICAvLyBkIGlzIDEwKiplLCB0aGUgbWluaW11bSBtYXgtZGVub21pbmF0b3IgbmVlZGVkLlxyXG4gICAgbWF4RCA9IGUgPiAwID8gZCA6IG4xO1xyXG4gIH0gZWxzZSB7XHJcbiAgICBuID0gbmV3IEN0b3IobWF4RCk7XHJcbiAgICBpZiAoIW4uaXNJbnQoKSB8fCBuLmx0KG4xKSkgdGhyb3cgRXJyb3IoaW52YWxpZEFyZ3VtZW50ICsgbik7XHJcbiAgICBtYXhEID0gbi5ndChkKSA/IChlID4gMCA/IGQgOiBuMSkgOiBuO1xyXG4gIH1cclxuXHJcbiAgZXh0ZXJuYWwgPSBmYWxzZTtcclxuICBuID0gbmV3IEN0b3IoZGlnaXRzVG9TdHJpbmcoeGQpKTtcclxuICBwciA9IEN0b3IucHJlY2lzaW9uO1xyXG4gIEN0b3IucHJlY2lzaW9uID0gZSA9IHhkLmxlbmd0aCAqIExPR19CQVNFICogMjtcclxuXHJcbiAgZm9yICg7OykgIHtcclxuICAgIHEgPSBkaXZpZGUobiwgZCwgMCwgMSwgMSk7XHJcbiAgICBkMiA9IGQwLnBsdXMocS50aW1lcyhkMSkpO1xyXG4gICAgaWYgKGQyLmNtcChtYXhEKSA9PSAxKSBicmVhaztcclxuICAgIGQwID0gZDE7XHJcbiAgICBkMSA9IGQyO1xyXG4gICAgZDIgPSBuMTtcclxuICAgIG4xID0gbjAucGx1cyhxLnRpbWVzKGQyKSk7XHJcbiAgICBuMCA9IGQyO1xyXG4gICAgZDIgPSBkO1xyXG4gICAgZCA9IG4ubWludXMocS50aW1lcyhkMikpO1xyXG4gICAgbiA9IGQyO1xyXG4gIH1cclxuXHJcbiAgZDIgPSBkaXZpZGUobWF4RC5taW51cyhkMCksIGQxLCAwLCAxLCAxKTtcclxuICBuMCA9IG4wLnBsdXMoZDIudGltZXMobjEpKTtcclxuICBkMCA9IGQwLnBsdXMoZDIudGltZXMoZDEpKTtcclxuICBuMC5zID0gbjEucyA9IHgucztcclxuXHJcbiAgLy8gRGV0ZXJtaW5lIHdoaWNoIGZyYWN0aW9uIGlzIGNsb3NlciB0byB4LCBuMC9kMCBvciBuMS9kMT9cclxuICByID0gZGl2aWRlKG4xLCBkMSwgZSwgMSkubWludXMoeCkuYWJzKCkuY21wKGRpdmlkZShuMCwgZDAsIGUsIDEpLm1pbnVzKHgpLmFicygpKSA8IDFcclxuICAgICAgPyBbbjEsIGQxXSA6IFtuMCwgZDBdO1xyXG5cclxuICBDdG9yLnByZWNpc2lvbiA9IHByO1xyXG4gIGV4dGVybmFsID0gdHJ1ZTtcclxuXHJcbiAgcmV0dXJuIHI7XHJcbn07XHJcblxyXG5cclxuLypcclxuICogUmV0dXJuIGEgc3RyaW5nIHJlcHJlc2VudGluZyB0aGUgdmFsdWUgb2YgdGhpcyBEZWNpbWFsIGluIGJhc2UgMTYsIHJvdW5kIHRvIGBzZGAgc2lnbmlmaWNhbnRcclxuICogZGlnaXRzIHVzaW5nIHJvdW5kaW5nIG1vZGUgYHJtYC5cclxuICpcclxuICogSWYgdGhlIG9wdGlvbmFsIGBzZGAgYXJndW1lbnQgaXMgcHJlc2VudCB0aGVuIHJldHVybiBiaW5hcnkgZXhwb25lbnRpYWwgbm90YXRpb24uXHJcbiAqXHJcbiAqIFtzZF0ge251bWJlcn0gU2lnbmlmaWNhbnQgZGlnaXRzLiBJbnRlZ2VyLCAxIHRvIE1BWF9ESUdJVFMgaW5jbHVzaXZlLlxyXG4gKiBbcm1dIHtudW1iZXJ9IFJvdW5kaW5nIG1vZGUuIEludGVnZXIsIDAgdG8gOCBpbmNsdXNpdmUuXHJcbiAqXHJcbiAqL1xyXG5QLnRvSGV4YWRlY2ltYWwgPSBQLnRvSGV4ID0gZnVuY3Rpb24gKHNkLCBybSkge1xyXG4gIHJldHVybiB0b1N0cmluZ0JpbmFyeSh0aGlzLCAxNiwgc2QsIHJtKTtcclxufTtcclxuXHJcblxyXG4vKlxyXG4gKiBSZXR1cm5zIGEgbmV3IERlY2ltYWwgd2hvc2UgdmFsdWUgaXMgdGhlIG5lYXJlc3QgbXVsdGlwbGUgb2YgYHlgIGluIHRoZSBkaXJlY3Rpb24gb2Ygcm91bmRpbmdcclxuICogbW9kZSBgcm1gLCBvciBgRGVjaW1hbC5yb3VuZGluZ2AgaWYgYHJtYCBpcyBvbWl0dGVkLCB0byB0aGUgdmFsdWUgb2YgdGhpcyBEZWNpbWFsLlxyXG4gKlxyXG4gKiBUaGUgcmV0dXJuIHZhbHVlIHdpbGwgYWx3YXlzIGhhdmUgdGhlIHNhbWUgc2lnbiBhcyB0aGlzIERlY2ltYWwsIHVubGVzcyBlaXRoZXIgdGhpcyBEZWNpbWFsXHJcbiAqIG9yIGB5YCBpcyBOYU4sIGluIHdoaWNoIGNhc2UgdGhlIHJldHVybiB2YWx1ZSB3aWxsIGJlIGFsc28gYmUgTmFOLlxyXG4gKlxyXG4gKiBUaGUgcmV0dXJuIHZhbHVlIGlzIG5vdCBhZmZlY3RlZCBieSB0aGUgdmFsdWUgb2YgYHByZWNpc2lvbmAuXHJcbiAqXHJcbiAqIHkge251bWJlcnxzdHJpbmd8RGVjaW1hbH0gVGhlIG1hZ25pdHVkZSB0byByb3VuZCB0byBhIG11bHRpcGxlIG9mLlxyXG4gKiBbcm1dIHtudW1iZXJ9IFJvdW5kaW5nIG1vZGUuIEludGVnZXIsIDAgdG8gOCBpbmNsdXNpdmUuXHJcbiAqXHJcbiAqICd0b05lYXJlc3QoKSByb3VuZGluZyBtb2RlIG5vdCBhbiBpbnRlZ2VyOiB7cm19J1xyXG4gKiAndG9OZWFyZXN0KCkgcm91bmRpbmcgbW9kZSBvdXQgb2YgcmFuZ2U6IHtybX0nXHJcbiAqXHJcbiAqL1xyXG5QLnRvTmVhcmVzdCA9IGZ1bmN0aW9uICh5LCBybSkge1xyXG4gIHZhciB4ID0gdGhpcyxcclxuICAgIEN0b3IgPSB4LmNvbnN0cnVjdG9yO1xyXG5cclxuICB4ID0gbmV3IEN0b3IoeCk7XHJcblxyXG4gIGlmICh5ID09IG51bGwpIHtcclxuXHJcbiAgICAvLyBJZiB4IGlzIG5vdCBmaW5pdGUsIHJldHVybiB4LlxyXG4gICAgaWYgKCF4LmQpIHJldHVybiB4O1xyXG5cclxuICAgIHkgPSBuZXcgQ3RvcigxKTtcclxuICAgIHJtID0gQ3Rvci5yb3VuZGluZztcclxuICB9IGVsc2Uge1xyXG4gICAgeSA9IG5ldyBDdG9yKHkpO1xyXG4gICAgaWYgKHJtID09PSB2b2lkIDApIHtcclxuICAgICAgcm0gPSBDdG9yLnJvdW5kaW5nO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgY2hlY2tJbnQzMihybSwgMCwgOCk7XHJcbiAgICB9XHJcblxyXG4gICAgLy8gSWYgeCBpcyBub3QgZmluaXRlLCByZXR1cm4geCBpZiB5IGlzIG5vdCBOYU4sIGVsc2UgTmFOLlxyXG4gICAgaWYgKCF4LmQpIHJldHVybiB5LnMgPyB4IDogeTtcclxuXHJcbiAgICAvLyBJZiB5IGlzIG5vdCBmaW5pdGUsIHJldHVybiBJbmZpbml0eSB3aXRoIHRoZSBzaWduIG9mIHggaWYgeSBpcyBJbmZpbml0eSwgZWxzZSBOYU4uXHJcbiAgICBpZiAoIXkuZCkge1xyXG4gICAgICBpZiAoeS5zKSB5LnMgPSB4LnM7XHJcbiAgICAgIHJldHVybiB5O1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgLy8gSWYgeSBpcyBub3QgemVybywgY2FsY3VsYXRlIHRoZSBuZWFyZXN0IG11bHRpcGxlIG9mIHkgdG8geC5cclxuICBpZiAoeS5kWzBdKSB7XHJcbiAgICBleHRlcm5hbCA9IGZhbHNlO1xyXG4gICAgeCA9IGRpdmlkZSh4LCB5LCAwLCBybSwgMSkudGltZXMoeSk7XHJcbiAgICBleHRlcm5hbCA9IHRydWU7XHJcbiAgICBmaW5hbGlzZSh4KTtcclxuXHJcbiAgLy8gSWYgeSBpcyB6ZXJvLCByZXR1cm4gemVybyB3aXRoIHRoZSBzaWduIG9mIHguXHJcbiAgfSBlbHNlIHtcclxuICAgIHkucyA9IHgucztcclxuICAgIHggPSB5O1xyXG4gIH1cclxuXHJcbiAgcmV0dXJuIHg7XHJcbn07XHJcblxyXG5cclxuLypcclxuICogUmV0dXJuIHRoZSB2YWx1ZSBvZiB0aGlzIERlY2ltYWwgY29udmVydGVkIHRvIGEgbnVtYmVyIHByaW1pdGl2ZS5cclxuICogWmVybyBrZWVwcyBpdHMgc2lnbi5cclxuICpcclxuICovXHJcblAudG9OdW1iZXIgPSBmdW5jdGlvbiAoKSB7XHJcbiAgcmV0dXJuICt0aGlzO1xyXG59O1xyXG5cclxuXHJcbi8qXHJcbiAqIFJldHVybiBhIHN0cmluZyByZXByZXNlbnRpbmcgdGhlIHZhbHVlIG9mIHRoaXMgRGVjaW1hbCBpbiBiYXNlIDgsIHJvdW5kIHRvIGBzZGAgc2lnbmlmaWNhbnRcclxuICogZGlnaXRzIHVzaW5nIHJvdW5kaW5nIG1vZGUgYHJtYC5cclxuICpcclxuICogSWYgdGhlIG9wdGlvbmFsIGBzZGAgYXJndW1lbnQgaXMgcHJlc2VudCB0aGVuIHJldHVybiBiaW5hcnkgZXhwb25lbnRpYWwgbm90YXRpb24uXHJcbiAqXHJcbiAqIFtzZF0ge251bWJlcn0gU2lnbmlmaWNhbnQgZGlnaXRzLiBJbnRlZ2VyLCAxIHRvIE1BWF9ESUdJVFMgaW5jbHVzaXZlLlxyXG4gKiBbcm1dIHtudW1iZXJ9IFJvdW5kaW5nIG1vZGUuIEludGVnZXIsIDAgdG8gOCBpbmNsdXNpdmUuXHJcbiAqXHJcbiAqL1xyXG5QLnRvT2N0YWwgPSBmdW5jdGlvbiAoc2QsIHJtKSB7XHJcbiAgcmV0dXJuIHRvU3RyaW5nQmluYXJ5KHRoaXMsIDgsIHNkLCBybSk7XHJcbn07XHJcblxyXG5cclxuLypcclxuICogUmV0dXJuIGEgbmV3IERlY2ltYWwgd2hvc2UgdmFsdWUgaXMgdGhlIHZhbHVlIG9mIHRoaXMgRGVjaW1hbCByYWlzZWQgdG8gdGhlIHBvd2VyIGB5YCwgcm91bmRlZFxyXG4gKiB0byBgcHJlY2lzaW9uYCBzaWduaWZpY2FudCBkaWdpdHMgdXNpbmcgcm91bmRpbmcgbW9kZSBgcm91bmRpbmdgLlxyXG4gKlxyXG4gKiBFQ01BU2NyaXB0IGNvbXBsaWFudC5cclxuICpcclxuICogICBwb3coeCwgTmFOKSAgICAgICAgICAgICAgICAgICAgICAgICAgID0gTmFOXHJcbiAqICAgcG93KHgsIFx1MDBCMTApICAgICAgICAgICAgICAgICAgICAgICAgICAgID0gMVxyXG5cclxuICogICBwb3coTmFOLCBub24temVybykgICAgICAgICAgICAgICAgICAgID0gTmFOXHJcbiAqICAgcG93KGFicyh4KSA+IDEsICtJbmZpbml0eSkgICAgICAgICAgICA9ICtJbmZpbml0eVxyXG4gKiAgIHBvdyhhYnMoeCkgPiAxLCAtSW5maW5pdHkpICAgICAgICAgICAgPSArMFxyXG4gKiAgIHBvdyhhYnMoeCkgPT0gMSwgXHUwMEIxSW5maW5pdHkpICAgICAgICAgICA9IE5hTlxyXG4gKiAgIHBvdyhhYnMoeCkgPCAxLCArSW5maW5pdHkpICAgICAgICAgICAgPSArMFxyXG4gKiAgIHBvdyhhYnMoeCkgPCAxLCAtSW5maW5pdHkpICAgICAgICAgICAgPSArSW5maW5pdHlcclxuICogICBwb3coK0luZmluaXR5LCB5ID4gMCkgICAgICAgICAgICAgICAgID0gK0luZmluaXR5XHJcbiAqICAgcG93KCtJbmZpbml0eSwgeSA8IDApICAgICAgICAgICAgICAgICA9ICswXHJcbiAqICAgcG93KC1JbmZpbml0eSwgb2RkIGludGVnZXIgPiAwKSAgICAgICA9IC1JbmZpbml0eVxyXG4gKiAgIHBvdygtSW5maW5pdHksIGV2ZW4gaW50ZWdlciA+IDApICAgICAgPSArSW5maW5pdHlcclxuICogICBwb3coLUluZmluaXR5LCBvZGQgaW50ZWdlciA8IDApICAgICAgID0gLTBcclxuICogICBwb3coLUluZmluaXR5LCBldmVuIGludGVnZXIgPCAwKSAgICAgID0gKzBcclxuICogICBwb3coKzAsIHkgPiAwKSAgICAgICAgICAgICAgICAgICAgICAgID0gKzBcclxuICogICBwb3coKzAsIHkgPCAwKSAgICAgICAgICAgICAgICAgICAgICAgID0gK0luZmluaXR5XHJcbiAqICAgcG93KC0wLCBvZGQgaW50ZWdlciA+IDApICAgICAgICAgICAgICA9IC0wXHJcbiAqICAgcG93KC0wLCBldmVuIGludGVnZXIgPiAwKSAgICAgICAgICAgICA9ICswXHJcbiAqICAgcG93KC0wLCBvZGQgaW50ZWdlciA8IDApICAgICAgICAgICAgICA9IC1JbmZpbml0eVxyXG4gKiAgIHBvdygtMCwgZXZlbiBpbnRlZ2VyIDwgMCkgICAgICAgICAgICAgPSArSW5maW5pdHlcclxuICogICBwb3coZmluaXRlIHggPCAwLCBmaW5pdGUgbm9uLWludGVnZXIpID0gTmFOXHJcbiAqXHJcbiAqIEZvciBub24taW50ZWdlciBvciB2ZXJ5IGxhcmdlIGV4cG9uZW50cyBwb3coeCwgeSkgaXMgY2FsY3VsYXRlZCB1c2luZ1xyXG4gKlxyXG4gKiAgIHheeSA9IGV4cCh5KmxuKHgpKVxyXG4gKlxyXG4gKiBBc3N1bWluZyB0aGUgZmlyc3QgMTUgcm91bmRpbmcgZGlnaXRzIGFyZSBlYWNoIGVxdWFsbHkgbGlrZWx5IHRvIGJlIGFueSBkaWdpdCAwLTksIHRoZVxyXG4gKiBwcm9iYWJpbGl0eSBvZiBhbiBpbmNvcnJlY3RseSByb3VuZGVkIHJlc3VsdFxyXG4gKiBQKFs0OV05ezE0fSB8IFs1MF0wezE0fSkgPSAyICogMC4yICogMTBeLTE0ID0gNGUtMTUgPSAxLzIuNWUrMTRcclxuICogaS5lLiAxIGluIDI1MCwwMDAsMDAwLDAwMCwwMDBcclxuICpcclxuICogSWYgYSByZXN1bHQgaXMgaW5jb3JyZWN0bHkgcm91bmRlZCB0aGUgbWF4aW11bSBlcnJvciB3aWxsIGJlIDEgdWxwICh1bml0IGluIGxhc3QgcGxhY2UpLlxyXG4gKlxyXG4gKiB5IHtudW1iZXJ8c3RyaW5nfERlY2ltYWx9IFRoZSBwb3dlciB0byB3aGljaCB0byByYWlzZSB0aGlzIERlY2ltYWwuXHJcbiAqXHJcbiAqL1xyXG5QLnRvUG93ZXIgPSBQLnBvdyA9IGZ1bmN0aW9uICh5KSB7XHJcbiAgdmFyIGUsIGssIHByLCByLCBybSwgcyxcclxuICAgIHggPSB0aGlzLFxyXG4gICAgQ3RvciA9IHguY29uc3RydWN0b3IsXHJcbiAgICB5biA9ICsoeSA9IG5ldyBDdG9yKHkpKTtcclxuXHJcbiAgLy8gRWl0aGVyIFx1MDBCMUluZmluaXR5LCBOYU4gb3IgXHUwMEIxMD9cclxuICBpZiAoIXguZCB8fCAheS5kIHx8ICF4LmRbMF0gfHwgIXkuZFswXSkgcmV0dXJuIG5ldyBDdG9yKG1hdGhwb3coK3gsIHluKSk7XHJcblxyXG4gIHggPSBuZXcgQ3Rvcih4KTtcclxuXHJcbiAgaWYgKHguZXEoMSkpIHJldHVybiB4O1xyXG5cclxuICBwciA9IEN0b3IucHJlY2lzaW9uO1xyXG4gIHJtID0gQ3Rvci5yb3VuZGluZztcclxuXHJcbiAgaWYgKHkuZXEoMSkpIHJldHVybiBmaW5hbGlzZSh4LCBwciwgcm0pO1xyXG5cclxuICAvLyB5IGV4cG9uZW50XHJcbiAgZSA9IG1hdGhmbG9vcih5LmUgLyBMT0dfQkFTRSk7XHJcblxyXG4gIC8vIElmIHkgaXMgYSBzbWFsbCBpbnRlZ2VyIHVzZSB0aGUgJ2V4cG9uZW50aWF0aW9uIGJ5IHNxdWFyaW5nJyBhbGdvcml0aG0uXHJcbiAgaWYgKGUgPj0geS5kLmxlbmd0aCAtIDEgJiYgKGsgPSB5biA8IDAgPyAteW4gOiB5bikgPD0gTUFYX1NBRkVfSU5URUdFUikge1xyXG4gICAgciA9IGludFBvdyhDdG9yLCB4LCBrLCBwcik7XHJcbiAgICByZXR1cm4geS5zIDwgMCA/IG5ldyBDdG9yKDEpLmRpdihyKSA6IGZpbmFsaXNlKHIsIHByLCBybSk7XHJcbiAgfVxyXG5cclxuICBzID0geC5zO1xyXG5cclxuICAvLyBpZiB4IGlzIG5lZ2F0aXZlXHJcbiAgaWYgKHMgPCAwKSB7XHJcblxyXG4gICAgLy8gaWYgeSBpcyBub3QgYW4gaW50ZWdlclxyXG4gICAgaWYgKGUgPCB5LmQubGVuZ3RoIC0gMSkgcmV0dXJuIG5ldyBDdG9yKE5hTik7XHJcblxyXG4gICAgLy8gUmVzdWx0IGlzIHBvc2l0aXZlIGlmIHggaXMgbmVnYXRpdmUgYW5kIHRoZSBsYXN0IGRpZ2l0IG9mIGludGVnZXIgeSBpcyBldmVuLlxyXG4gICAgaWYgKCh5LmRbZV0gJiAxKSA9PSAwKSBzID0gMTtcclxuXHJcbiAgICAvLyBpZiB4LmVxKC0xKVxyXG4gICAgaWYgKHguZSA9PSAwICYmIHguZFswXSA9PSAxICYmIHguZC5sZW5ndGggPT0gMSkge1xyXG4gICAgICB4LnMgPSBzO1xyXG4gICAgICByZXR1cm4geDtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIC8vIEVzdGltYXRlIHJlc3VsdCBleHBvbmVudC5cclxuICAvLyB4XnkgPSAxMF5lLCAgd2hlcmUgZSA9IHkgKiBsb2cxMCh4KVxyXG4gIC8vIGxvZzEwKHgpID0gbG9nMTAoeF9zaWduaWZpY2FuZCkgKyB4X2V4cG9uZW50XHJcbiAgLy8gbG9nMTAoeF9zaWduaWZpY2FuZCkgPSBsbih4X3NpZ25pZmljYW5kKSAvIGxuKDEwKVxyXG4gIGsgPSBtYXRocG93KCt4LCB5bik7XHJcbiAgZSA9IGsgPT0gMCB8fCAhaXNGaW5pdGUoaylcclxuICAgID8gbWF0aGZsb29yKHluICogKE1hdGgubG9nKCcwLicgKyBkaWdpdHNUb1N0cmluZyh4LmQpKSAvIE1hdGguTE4xMCArIHguZSArIDEpKVxyXG4gICAgOiBuZXcgQ3RvcihrICsgJycpLmU7XHJcblxyXG4gIC8vIEV4cG9uZW50IGVzdGltYXRlIG1heSBiZSBpbmNvcnJlY3QgZS5nLiB4OiAwLjk5OTk5OTk5OTk5OTk5OTk5OSwgeTogMi4yOSwgZTogMCwgci5lOiAtMS5cclxuXHJcbiAgLy8gT3ZlcmZsb3cvdW5kZXJmbG93P1xyXG4gIGlmIChlID4gQ3Rvci5tYXhFICsgMSB8fCBlIDwgQ3Rvci5taW5FIC0gMSkgcmV0dXJuIG5ldyBDdG9yKGUgPiAwID8gcyAvIDAgOiAwKTtcclxuXHJcbiAgZXh0ZXJuYWwgPSBmYWxzZTtcclxuICBDdG9yLnJvdW5kaW5nID0geC5zID0gMTtcclxuXHJcbiAgLy8gRXN0aW1hdGUgdGhlIGV4dHJhIGd1YXJkIGRpZ2l0cyBuZWVkZWQgdG8gZW5zdXJlIGZpdmUgY29ycmVjdCByb3VuZGluZyBkaWdpdHMgZnJvbVxyXG4gIC8vIG5hdHVyYWxMb2dhcml0aG0oeCkuIEV4YW1wbGUgb2YgZmFpbHVyZSB3aXRob3V0IHRoZXNlIGV4dHJhIGRpZ2l0cyAocHJlY2lzaW9uOiAxMCk6XHJcbiAgLy8gbmV3IERlY2ltYWwoMi4zMjQ1NikucG93KCcyMDg3OTg3NDM2NTM0NTY2LjQ2NDExJylcclxuICAvLyBzaG91bGQgYmUgMS4xNjIzNzc4MjNlKzc2NDkxNDkwNTE3MzgxNSwgYnV0IGlzIDEuMTYyMzU1ODIzZSs3NjQ5MTQ5MDUxNzM4MTVcclxuICBrID0gTWF0aC5taW4oMTIsIChlICsgJycpLmxlbmd0aCk7XHJcblxyXG4gIC8vIHIgPSB4XnkgPSBleHAoeSpsbih4KSlcclxuICByID0gbmF0dXJhbEV4cG9uZW50aWFsKHkudGltZXMobmF0dXJhbExvZ2FyaXRobSh4LCBwciArIGspKSwgcHIpO1xyXG5cclxuICAvLyByIG1heSBiZSBJbmZpbml0eSwgZS5nLiAoMC45OTk5OTk5OTk5OTk5OTk5KS5wb3coLTFlKzQwKVxyXG4gIGlmIChyLmQpIHtcclxuXHJcbiAgICAvLyBUcnVuY2F0ZSB0byB0aGUgcmVxdWlyZWQgcHJlY2lzaW9uIHBsdXMgZml2ZSByb3VuZGluZyBkaWdpdHMuXHJcbiAgICByID0gZmluYWxpc2UociwgcHIgKyA1LCAxKTtcclxuXHJcbiAgICAvLyBJZiB0aGUgcm91bmRpbmcgZGlnaXRzIGFyZSBbNDldOTk5OSBvciBbNTBdMDAwMCBpbmNyZWFzZSB0aGUgcHJlY2lzaW9uIGJ5IDEwIGFuZCByZWNhbGN1bGF0ZVxyXG4gICAgLy8gdGhlIHJlc3VsdC5cclxuICAgIGlmIChjaGVja1JvdW5kaW5nRGlnaXRzKHIuZCwgcHIsIHJtKSkge1xyXG4gICAgICBlID0gcHIgKyAxMDtcclxuXHJcbiAgICAgIC8vIFRydW5jYXRlIHRvIHRoZSBpbmNyZWFzZWQgcHJlY2lzaW9uIHBsdXMgZml2ZSByb3VuZGluZyBkaWdpdHMuXHJcbiAgICAgIHIgPSBmaW5hbGlzZShuYXR1cmFsRXhwb25lbnRpYWwoeS50aW1lcyhuYXR1cmFsTG9nYXJpdGhtKHgsIGUgKyBrKSksIGUpLCBlICsgNSwgMSk7XHJcblxyXG4gICAgICAvLyBDaGVjayBmb3IgMTQgbmluZXMgZnJvbSB0aGUgMm5kIHJvdW5kaW5nIGRpZ2l0ICh0aGUgZmlyc3Qgcm91bmRpbmcgZGlnaXQgbWF5IGJlIDQgb3IgOSkuXHJcbiAgICAgIGlmICgrZGlnaXRzVG9TdHJpbmcoci5kKS5zbGljZShwciArIDEsIHByICsgMTUpICsgMSA9PSAxZTE0KSB7XHJcbiAgICAgICAgciA9IGZpbmFsaXNlKHIsIHByICsgMSwgMCk7XHJcbiAgICAgIH1cclxuICAgIH1cclxuICB9XHJcblxyXG4gIHIucyA9IHM7XHJcbiAgZXh0ZXJuYWwgPSB0cnVlO1xyXG4gIEN0b3Iucm91bmRpbmcgPSBybTtcclxuXHJcbiAgcmV0dXJuIGZpbmFsaXNlKHIsIHByLCBybSk7XHJcbn07XHJcblxyXG5cclxuLypcclxuICogUmV0dXJuIGEgc3RyaW5nIHJlcHJlc2VudGluZyB0aGUgdmFsdWUgb2YgdGhpcyBEZWNpbWFsIHJvdW5kZWQgdG8gYHNkYCBzaWduaWZpY2FudCBkaWdpdHNcclxuICogdXNpbmcgcm91bmRpbmcgbW9kZSBgcm91bmRpbmdgLlxyXG4gKlxyXG4gKiBSZXR1cm4gZXhwb25lbnRpYWwgbm90YXRpb24gaWYgYHNkYCBpcyBsZXNzIHRoYW4gdGhlIG51bWJlciBvZiBkaWdpdHMgbmVjZXNzYXJ5IHRvIHJlcHJlc2VudFxyXG4gKiB0aGUgaW50ZWdlciBwYXJ0IG9mIHRoZSB2YWx1ZSBpbiBub3JtYWwgbm90YXRpb24uXHJcbiAqXHJcbiAqIFtzZF0ge251bWJlcn0gU2lnbmlmaWNhbnQgZGlnaXRzLiBJbnRlZ2VyLCAxIHRvIE1BWF9ESUdJVFMgaW5jbHVzaXZlLlxyXG4gKiBbcm1dIHtudW1iZXJ9IFJvdW5kaW5nIG1vZGUuIEludGVnZXIsIDAgdG8gOCBpbmNsdXNpdmUuXHJcbiAqXHJcbiAqL1xyXG5QLnRvUHJlY2lzaW9uID0gZnVuY3Rpb24gKHNkLCBybSkge1xyXG4gIHZhciBzdHIsXHJcbiAgICB4ID0gdGhpcyxcclxuICAgIEN0b3IgPSB4LmNvbnN0cnVjdG9yO1xyXG5cclxuICBpZiAoc2QgPT09IHZvaWQgMCkge1xyXG4gICAgc3RyID0gZmluaXRlVG9TdHJpbmcoeCwgeC5lIDw9IEN0b3IudG9FeHBOZWcgfHwgeC5lID49IEN0b3IudG9FeHBQb3MpO1xyXG4gIH0gZWxzZSB7XHJcbiAgICBjaGVja0ludDMyKHNkLCAxLCBNQVhfRElHSVRTKTtcclxuXHJcbiAgICBpZiAocm0gPT09IHZvaWQgMCkgcm0gPSBDdG9yLnJvdW5kaW5nO1xyXG4gICAgZWxzZSBjaGVja0ludDMyKHJtLCAwLCA4KTtcclxuXHJcbiAgICB4ID0gZmluYWxpc2UobmV3IEN0b3IoeCksIHNkLCBybSk7XHJcbiAgICBzdHIgPSBmaW5pdGVUb1N0cmluZyh4LCBzZCA8PSB4LmUgfHwgeC5lIDw9IEN0b3IudG9FeHBOZWcsIHNkKTtcclxuICB9XHJcblxyXG4gIHJldHVybiB4LmlzTmVnKCkgJiYgIXguaXNaZXJvKCkgPyAnLScgKyBzdHIgOiBzdHI7XHJcbn07XHJcblxyXG5cclxuLypcclxuICogUmV0dXJuIGEgbmV3IERlY2ltYWwgd2hvc2UgdmFsdWUgaXMgdGhlIHZhbHVlIG9mIHRoaXMgRGVjaW1hbCByb3VuZGVkIHRvIGEgbWF4aW11bSBvZiBgc2RgXHJcbiAqIHNpZ25pZmljYW50IGRpZ2l0cyB1c2luZyByb3VuZGluZyBtb2RlIGBybWAsIG9yIHRvIGBwcmVjaXNpb25gIGFuZCBgcm91bmRpbmdgIHJlc3BlY3RpdmVseSBpZlxyXG4gKiBvbWl0dGVkLlxyXG4gKlxyXG4gKiBbc2RdIHtudW1iZXJ9IFNpZ25pZmljYW50IGRpZ2l0cy4gSW50ZWdlciwgMSB0byBNQVhfRElHSVRTIGluY2x1c2l2ZS5cclxuICogW3JtXSB7bnVtYmVyfSBSb3VuZGluZyBtb2RlLiBJbnRlZ2VyLCAwIHRvIDggaW5jbHVzaXZlLlxyXG4gKlxyXG4gKiAndG9TRCgpIGRpZ2l0cyBvdXQgb2YgcmFuZ2U6IHtzZH0nXHJcbiAqICd0b1NEKCkgZGlnaXRzIG5vdCBhbiBpbnRlZ2VyOiB7c2R9J1xyXG4gKiAndG9TRCgpIHJvdW5kaW5nIG1vZGUgbm90IGFuIGludGVnZXI6IHtybX0nXHJcbiAqICd0b1NEKCkgcm91bmRpbmcgbW9kZSBvdXQgb2YgcmFuZ2U6IHtybX0nXHJcbiAqXHJcbiAqL1xyXG5QLnRvU2lnbmlmaWNhbnREaWdpdHMgPSBQLnRvU0QgPSBmdW5jdGlvbiAoc2QsIHJtKSB7XHJcbiAgdmFyIHggPSB0aGlzLFxyXG4gICAgQ3RvciA9IHguY29uc3RydWN0b3I7XHJcblxyXG4gIGlmIChzZCA9PT0gdm9pZCAwKSB7XHJcbiAgICBzZCA9IEN0b3IucHJlY2lzaW9uO1xyXG4gICAgcm0gPSBDdG9yLnJvdW5kaW5nO1xyXG4gIH0gZWxzZSB7XHJcbiAgICBjaGVja0ludDMyKHNkLCAxLCBNQVhfRElHSVRTKTtcclxuXHJcbiAgICBpZiAocm0gPT09IHZvaWQgMCkgcm0gPSBDdG9yLnJvdW5kaW5nO1xyXG4gICAgZWxzZSBjaGVja0ludDMyKHJtLCAwLCA4KTtcclxuICB9XHJcblxyXG4gIHJldHVybiBmaW5hbGlzZShuZXcgQ3Rvcih4KSwgc2QsIHJtKTtcclxufTtcclxuXHJcblxyXG4vKlxyXG4gKiBSZXR1cm4gYSBzdHJpbmcgcmVwcmVzZW50aW5nIHRoZSB2YWx1ZSBvZiB0aGlzIERlY2ltYWwuXHJcbiAqXHJcbiAqIFJldHVybiBleHBvbmVudGlhbCBub3RhdGlvbiBpZiB0aGlzIERlY2ltYWwgaGFzIGEgcG9zaXRpdmUgZXhwb25lbnQgZXF1YWwgdG8gb3IgZ3JlYXRlciB0aGFuXHJcbiAqIGB0b0V4cFBvc2AsIG9yIGEgbmVnYXRpdmUgZXhwb25lbnQgZXF1YWwgdG8gb3IgbGVzcyB0aGFuIGB0b0V4cE5lZ2AuXHJcbiAqXHJcbiAqL1xyXG5QLnRvU3RyaW5nID0gZnVuY3Rpb24gKCkge1xyXG4gIHZhciB4ID0gdGhpcyxcclxuICAgIEN0b3IgPSB4LmNvbnN0cnVjdG9yLFxyXG4gICAgc3RyID0gZmluaXRlVG9TdHJpbmcoeCwgeC5lIDw9IEN0b3IudG9FeHBOZWcgfHwgeC5lID49IEN0b3IudG9FeHBQb3MpO1xyXG5cclxuICByZXR1cm4geC5pc05lZygpICYmICF4LmlzWmVybygpID8gJy0nICsgc3RyIDogc3RyO1xyXG59O1xyXG5cclxuXHJcbi8qXHJcbiAqIFJldHVybiBhIG5ldyBEZWNpbWFsIHdob3NlIHZhbHVlIGlzIHRoZSB2YWx1ZSBvZiB0aGlzIERlY2ltYWwgdHJ1bmNhdGVkIHRvIGEgd2hvbGUgbnVtYmVyLlxyXG4gKlxyXG4gKi9cclxuUC50cnVuY2F0ZWQgPSBQLnRydW5jID0gZnVuY3Rpb24gKCkge1xyXG4gIHJldHVybiBmaW5hbGlzZShuZXcgdGhpcy5jb25zdHJ1Y3Rvcih0aGlzKSwgdGhpcy5lICsgMSwgMSk7XHJcbn07XHJcblxyXG5cclxuLypcclxuICogUmV0dXJuIGEgc3RyaW5nIHJlcHJlc2VudGluZyB0aGUgdmFsdWUgb2YgdGhpcyBEZWNpbWFsLlxyXG4gKiBVbmxpa2UgYHRvU3RyaW5nYCwgbmVnYXRpdmUgemVybyB3aWxsIGluY2x1ZGUgdGhlIG1pbnVzIHNpZ24uXHJcbiAqXHJcbiAqL1xyXG5QLnZhbHVlT2YgPSBQLnRvSlNPTiA9IGZ1bmN0aW9uICgpIHtcclxuICB2YXIgeCA9IHRoaXMsXHJcbiAgICBDdG9yID0geC5jb25zdHJ1Y3RvcixcclxuICAgIHN0ciA9IGZpbml0ZVRvU3RyaW5nKHgsIHguZSA8PSBDdG9yLnRvRXhwTmVnIHx8IHguZSA+PSBDdG9yLnRvRXhwUG9zKTtcclxuXHJcbiAgcmV0dXJuIHguaXNOZWcoKSA/ICctJyArIHN0ciA6IHN0cjtcclxufTtcclxuXHJcblxyXG4vLyBIZWxwZXIgZnVuY3Rpb25zIGZvciBEZWNpbWFsLnByb3RvdHlwZSAoUCkgYW5kL29yIERlY2ltYWwgbWV0aG9kcywgYW5kIHRoZWlyIGNhbGxlcnMuXHJcblxyXG5cclxuLypcclxuICogIGRpZ2l0c1RvU3RyaW5nICAgICAgICAgICBQLmN1YmVSb290LCBQLmxvZ2FyaXRobSwgUC5zcXVhcmVSb290LCBQLnRvRnJhY3Rpb24sIFAudG9Qb3dlcixcclxuICogICAgICAgICAgICAgICAgICAgICAgICAgICBmaW5pdGVUb1N0cmluZywgbmF0dXJhbEV4cG9uZW50aWFsLCBuYXR1cmFsTG9nYXJpdGhtXHJcbiAqICBjaGVja0ludDMyICAgICAgICAgICAgICAgUC50b0RlY2ltYWxQbGFjZXMsIFAudG9FeHBvbmVudGlhbCwgUC50b0ZpeGVkLCBQLnRvTmVhcmVzdCxcclxuICogICAgICAgICAgICAgICAgICAgICAgICAgICBQLnRvUHJlY2lzaW9uLCBQLnRvU2lnbmlmaWNhbnREaWdpdHMsIHRvU3RyaW5nQmluYXJ5LCByYW5kb21cclxuICogIGNoZWNrUm91bmRpbmdEaWdpdHMgICAgICBQLmxvZ2FyaXRobSwgUC50b1Bvd2VyLCBuYXR1cmFsRXhwb25lbnRpYWwsIG5hdHVyYWxMb2dhcml0aG1cclxuICogIGNvbnZlcnRCYXNlICAgICAgICAgICAgICB0b1N0cmluZ0JpbmFyeSwgcGFyc2VPdGhlclxyXG4gKiAgY29zICAgICAgICAgICAgICAgICAgICAgIFAuY29zXHJcbiAqICBkaXZpZGUgICAgICAgICAgICAgICAgICAgUC5hdGFuaCwgUC5jdWJlUm9vdCwgUC5kaXZpZGVkQnksIFAuZGl2aWRlZFRvSW50ZWdlckJ5LFxyXG4gKiAgICAgICAgICAgICAgICAgICAgICAgICAgIFAubG9nYXJpdGhtLCBQLm1vZHVsbywgUC5zcXVhcmVSb290LCBQLnRhbiwgUC50YW5oLCBQLnRvRnJhY3Rpb24sXHJcbiAqICAgICAgICAgICAgICAgICAgICAgICAgICAgUC50b05lYXJlc3QsIHRvU3RyaW5nQmluYXJ5LCBuYXR1cmFsRXhwb25lbnRpYWwsIG5hdHVyYWxMb2dhcml0aG0sXHJcbiAqICAgICAgICAgICAgICAgICAgICAgICAgICAgdGF5bG9yU2VyaWVzLCBhdGFuMiwgcGFyc2VPdGhlclxyXG4gKiAgZmluYWxpc2UgICAgICAgICAgICAgICAgIFAuYWJzb2x1dGVWYWx1ZSwgUC5hdGFuLCBQLmF0YW5oLCBQLmNlaWwsIFAuY29zLCBQLmNvc2gsXHJcbiAqICAgICAgICAgICAgICAgICAgICAgICAgICAgUC5jdWJlUm9vdCwgUC5kaXZpZGVkVG9JbnRlZ2VyQnksIFAuZmxvb3IsIFAubG9nYXJpdGhtLCBQLm1pbnVzLFxyXG4gKiAgICAgICAgICAgICAgICAgICAgICAgICAgIFAubW9kdWxvLCBQLm5lZ2F0ZWQsIFAucGx1cywgUC5yb3VuZCwgUC5zaW4sIFAuc2luaCwgUC5zcXVhcmVSb290LFxyXG4gKiAgICAgICAgICAgICAgICAgICAgICAgICAgIFAudGFuLCBQLnRpbWVzLCBQLnRvRGVjaW1hbFBsYWNlcywgUC50b0V4cG9uZW50aWFsLCBQLnRvRml4ZWQsXHJcbiAqICAgICAgICAgICAgICAgICAgICAgICAgICAgUC50b05lYXJlc3QsIFAudG9Qb3dlciwgUC50b1ByZWNpc2lvbiwgUC50b1NpZ25pZmljYW50RGlnaXRzLFxyXG4gKiAgICAgICAgICAgICAgICAgICAgICAgICAgIFAudHJ1bmNhdGVkLCBkaXZpZGUsIGdldExuMTAsIGdldFBpLCBuYXR1cmFsRXhwb25lbnRpYWwsXHJcbiAqICAgICAgICAgICAgICAgICAgICAgICAgICAgbmF0dXJhbExvZ2FyaXRobSwgY2VpbCwgZmxvb3IsIHJvdW5kLCB0cnVuY1xyXG4gKiAgZmluaXRlVG9TdHJpbmcgICAgICAgICAgIFAudG9FeHBvbmVudGlhbCwgUC50b0ZpeGVkLCBQLnRvUHJlY2lzaW9uLCBQLnRvU3RyaW5nLCBQLnZhbHVlT2YsXHJcbiAqICAgICAgICAgICAgICAgICAgICAgICAgICAgdG9TdHJpbmdCaW5hcnlcclxuICogIGdldEJhc2UxMEV4cG9uZW50ICAgICAgICBQLm1pbnVzLCBQLnBsdXMsIFAudGltZXMsIHBhcnNlT3RoZXJcclxuICogIGdldExuMTAgICAgICAgICAgICAgICAgICBQLmxvZ2FyaXRobSwgbmF0dXJhbExvZ2FyaXRobVxyXG4gKiAgZ2V0UGkgICAgICAgICAgICAgICAgICAgIFAuYWNvcywgUC5hc2luLCBQLmF0YW4sIHRvTGVzc1RoYW5IYWxmUGksIGF0YW4yXHJcbiAqICBnZXRQcmVjaXNpb24gICAgICAgICAgICAgUC5wcmVjaXNpb24sIFAudG9GcmFjdGlvblxyXG4gKiAgZ2V0WmVyb1N0cmluZyAgICAgICAgICAgIGRpZ2l0c1RvU3RyaW5nLCBmaW5pdGVUb1N0cmluZ1xyXG4gKiAgaW50UG93ICAgICAgICAgICAgICAgICAgIFAudG9Qb3dlciwgcGFyc2VPdGhlclxyXG4gKiAgaXNPZGQgICAgICAgICAgICAgICAgICAgIHRvTGVzc1RoYW5IYWxmUGlcclxuICogIG1heE9yTWluICAgICAgICAgICAgICAgICBtYXgsIG1pblxyXG4gKiAgbmF0dXJhbEV4cG9uZW50aWFsICAgICAgIFAubmF0dXJhbEV4cG9uZW50aWFsLCBQLnRvUG93ZXJcclxuICogIG5hdHVyYWxMb2dhcml0aG0gICAgICAgICBQLmFjb3NoLCBQLmFzaW5oLCBQLmF0YW5oLCBQLmxvZ2FyaXRobSwgUC5uYXR1cmFsTG9nYXJpdGhtLFxyXG4gKiAgICAgICAgICAgICAgICAgICAgICAgICAgIFAudG9Qb3dlciwgbmF0dXJhbEV4cG9uZW50aWFsXHJcbiAqICBub25GaW5pdGVUb1N0cmluZyAgICAgICAgZmluaXRlVG9TdHJpbmcsIHRvU3RyaW5nQmluYXJ5XHJcbiAqICBwYXJzZURlY2ltYWwgICAgICAgICAgICAgRGVjaW1hbFxyXG4gKiAgcGFyc2VPdGhlciAgICAgICAgICAgICAgIERlY2ltYWxcclxuICogIHNpbiAgICAgICAgICAgICAgICAgICAgICBQLnNpblxyXG4gKiAgdGF5bG9yU2VyaWVzICAgICAgICAgICAgIFAuY29zaCwgUC5zaW5oLCBjb3MsIHNpblxyXG4gKiAgdG9MZXNzVGhhbkhhbGZQaSAgICAgICAgIFAuY29zLCBQLnNpblxyXG4gKiAgdG9TdHJpbmdCaW5hcnkgICAgICAgICAgIFAudG9CaW5hcnksIFAudG9IZXhhZGVjaW1hbCwgUC50b09jdGFsXHJcbiAqICB0cnVuY2F0ZSAgICAgICAgICAgICAgICAgaW50UG93XHJcbiAqXHJcbiAqICBUaHJvd3M6ICAgICAgICAgICAgICAgICAgUC5sb2dhcml0aG0sIFAucHJlY2lzaW9uLCBQLnRvRnJhY3Rpb24sIGNoZWNrSW50MzIsIGdldExuMTAsIGdldFBpLFxyXG4gKiAgICAgICAgICAgICAgICAgICAgICAgICAgIG5hdHVyYWxMb2dhcml0aG0sIGNvbmZpZywgcGFyc2VPdGhlciwgcmFuZG9tLCBEZWNpbWFsXHJcbiAqL1xyXG5cclxuXHJcbmZ1bmN0aW9uIGRpZ2l0c1RvU3RyaW5nKGQpIHtcclxuICB2YXIgaSwgaywgd3MsXHJcbiAgICBpbmRleE9mTGFzdFdvcmQgPSBkLmxlbmd0aCAtIDEsXHJcbiAgICBzdHIgPSAnJyxcclxuICAgIHcgPSBkWzBdO1xyXG5cclxuICBpZiAoaW5kZXhPZkxhc3RXb3JkID4gMCkge1xyXG4gICAgc3RyICs9IHc7XHJcbiAgICBmb3IgKGkgPSAxOyBpIDwgaW5kZXhPZkxhc3RXb3JkOyBpKyspIHtcclxuICAgICAgd3MgPSBkW2ldICsgJyc7XHJcbiAgICAgIGsgPSBMT0dfQkFTRSAtIHdzLmxlbmd0aDtcclxuICAgICAgaWYgKGspIHN0ciArPSBnZXRaZXJvU3RyaW5nKGspO1xyXG4gICAgICBzdHIgKz0gd3M7XHJcbiAgICB9XHJcblxyXG4gICAgdyA9IGRbaV07XHJcbiAgICB3cyA9IHcgKyAnJztcclxuICAgIGsgPSBMT0dfQkFTRSAtIHdzLmxlbmd0aDtcclxuICAgIGlmIChrKSBzdHIgKz0gZ2V0WmVyb1N0cmluZyhrKTtcclxuICB9IGVsc2UgaWYgKHcgPT09IDApIHtcclxuICAgIHJldHVybiAnMCc7XHJcbiAgfVxyXG5cclxuICAvLyBSZW1vdmUgdHJhaWxpbmcgemVyb3Mgb2YgbGFzdCB3LlxyXG4gIGZvciAoOyB3ICUgMTAgPT09IDA7KSB3IC89IDEwO1xyXG5cclxuICByZXR1cm4gc3RyICsgdztcclxufVxyXG5cclxuXHJcbmZ1bmN0aW9uIGNoZWNrSW50MzIoaSwgbWluLCBtYXgpIHtcclxuICBpZiAoaSAhPT0gfn5pIHx8IGkgPCBtaW4gfHwgaSA+IG1heCkge1xyXG4gICAgdGhyb3cgRXJyb3IoaW52YWxpZEFyZ3VtZW50ICsgaSk7XHJcbiAgfVxyXG59XHJcblxyXG5cclxuLypcclxuICogQ2hlY2sgNSByb3VuZGluZyBkaWdpdHMgaWYgYHJlcGVhdGluZ2AgaXMgbnVsbCwgNCBvdGhlcndpc2UuXHJcbiAqIGByZXBlYXRpbmcgPT0gbnVsbGAgaWYgY2FsbGVyIGlzIGBsb2dgIG9yIGBwb3dgLFxyXG4gKiBgcmVwZWF0aW5nICE9IG51bGxgIGlmIGNhbGxlciBpcyBgbmF0dXJhbExvZ2FyaXRobWAgb3IgYG5hdHVyYWxFeHBvbmVudGlhbGAuXHJcbiAqL1xyXG5mdW5jdGlvbiBjaGVja1JvdW5kaW5nRGlnaXRzKGQsIGksIHJtLCByZXBlYXRpbmcpIHtcclxuICB2YXIgZGksIGssIHIsIHJkO1xyXG5cclxuICAvLyBHZXQgdGhlIGxlbmd0aCBvZiB0aGUgZmlyc3Qgd29yZCBvZiB0aGUgYXJyYXkgZC5cclxuICBmb3IgKGsgPSBkWzBdOyBrID49IDEwOyBrIC89IDEwKSAtLWk7XHJcblxyXG4gIC8vIElzIHRoZSByb3VuZGluZyBkaWdpdCBpbiB0aGUgZmlyc3Qgd29yZCBvZiBkP1xyXG4gIGlmICgtLWkgPCAwKSB7XHJcbiAgICBpICs9IExPR19CQVNFO1xyXG4gICAgZGkgPSAwO1xyXG4gIH0gZWxzZSB7XHJcbiAgICBkaSA9IE1hdGguY2VpbCgoaSArIDEpIC8gTE9HX0JBU0UpO1xyXG4gICAgaSAlPSBMT0dfQkFTRTtcclxuICB9XHJcblxyXG4gIC8vIGkgaXMgdGhlIGluZGV4ICgwIC0gNikgb2YgdGhlIHJvdW5kaW5nIGRpZ2l0LlxyXG4gIC8vIEUuZy4gaWYgd2l0aGluIHRoZSB3b3JkIDM0ODc1NjMgdGhlIGZpcnN0IHJvdW5kaW5nIGRpZ2l0IGlzIDUsXHJcbiAgLy8gdGhlbiBpID0gNCwgayA9IDEwMDAsIHJkID0gMzQ4NzU2MyAlIDEwMDAgPSA1NjNcclxuICBrID0gbWF0aHBvdygxMCwgTE9HX0JBU0UgLSBpKTtcclxuICByZCA9IGRbZGldICUgayB8IDA7XHJcblxyXG4gIGlmIChyZXBlYXRpbmcgPT0gbnVsbCkge1xyXG4gICAgaWYgKGkgPCAzKSB7XHJcbiAgICAgIGlmIChpID09IDApIHJkID0gcmQgLyAxMDAgfCAwO1xyXG4gICAgICBlbHNlIGlmIChpID09IDEpIHJkID0gcmQgLyAxMCB8IDA7XHJcbiAgICAgIHIgPSBybSA8IDQgJiYgcmQgPT0gOTk5OTkgfHwgcm0gPiAzICYmIHJkID09IDQ5OTk5IHx8IHJkID09IDUwMDAwIHx8IHJkID09IDA7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICByID0gKHJtIDwgNCAmJiByZCArIDEgPT0gayB8fCBybSA+IDMgJiYgcmQgKyAxID09IGsgLyAyKSAmJlxyXG4gICAgICAgIChkW2RpICsgMV0gLyBrIC8gMTAwIHwgMCkgPT0gbWF0aHBvdygxMCwgaSAtIDIpIC0gMSB8fFxyXG4gICAgICAgICAgKHJkID09IGsgLyAyIHx8IHJkID09IDApICYmIChkW2RpICsgMV0gLyBrIC8gMTAwIHwgMCkgPT0gMDtcclxuICAgIH1cclxuICB9IGVsc2Uge1xyXG4gICAgaWYgKGkgPCA0KSB7XHJcbiAgICAgIGlmIChpID09IDApIHJkID0gcmQgLyAxMDAwIHwgMDtcclxuICAgICAgZWxzZSBpZiAoaSA9PSAxKSByZCA9IHJkIC8gMTAwIHwgMDtcclxuICAgICAgZWxzZSBpZiAoaSA9PSAyKSByZCA9IHJkIC8gMTAgfCAwO1xyXG4gICAgICByID0gKHJlcGVhdGluZyB8fCBybSA8IDQpICYmIHJkID09IDk5OTkgfHwgIXJlcGVhdGluZyAmJiBybSA+IDMgJiYgcmQgPT0gNDk5OTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIHIgPSAoKHJlcGVhdGluZyB8fCBybSA8IDQpICYmIHJkICsgMSA9PSBrIHx8XHJcbiAgICAgICghcmVwZWF0aW5nICYmIHJtID4gMykgJiYgcmQgKyAxID09IGsgLyAyKSAmJlxyXG4gICAgICAgIChkW2RpICsgMV0gLyBrIC8gMTAwMCB8IDApID09IG1hdGhwb3coMTAsIGkgLSAzKSAtIDE7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICByZXR1cm4gcjtcclxufVxyXG5cclxuXHJcbi8vIENvbnZlcnQgc3RyaW5nIG9mIGBiYXNlSW5gIHRvIGFuIGFycmF5IG9mIG51bWJlcnMgb2YgYGJhc2VPdXRgLlxyXG4vLyBFZy4gY29udmVydEJhc2UoJzI1NScsIDEwLCAxNikgcmV0dXJucyBbMTUsIDE1XS5cclxuLy8gRWcuIGNvbnZlcnRCYXNlKCdmZicsIDE2LCAxMCkgcmV0dXJucyBbMiwgNSwgNV0uXHJcbmZ1bmN0aW9uIGNvbnZlcnRCYXNlKHN0ciwgYmFzZUluLCBiYXNlT3V0KSB7XHJcbiAgdmFyIGosXHJcbiAgICBhcnIgPSBbMF0sXHJcbiAgICBhcnJMLFxyXG4gICAgaSA9IDAsXHJcbiAgICBzdHJMID0gc3RyLmxlbmd0aDtcclxuXHJcbiAgZm9yICg7IGkgPCBzdHJMOykge1xyXG4gICAgZm9yIChhcnJMID0gYXJyLmxlbmd0aDsgYXJyTC0tOykgYXJyW2FyckxdICo9IGJhc2VJbjtcclxuICAgIGFyclswXSArPSBOVU1FUkFMUy5pbmRleE9mKHN0ci5jaGFyQXQoaSsrKSk7XHJcbiAgICBmb3IgKGogPSAwOyBqIDwgYXJyLmxlbmd0aDsgaisrKSB7XHJcbiAgICAgIGlmIChhcnJbal0gPiBiYXNlT3V0IC0gMSkge1xyXG4gICAgICAgIGlmIChhcnJbaiArIDFdID09PSB2b2lkIDApIGFycltqICsgMV0gPSAwO1xyXG4gICAgICAgIGFycltqICsgMV0gKz0gYXJyW2pdIC8gYmFzZU91dCB8IDA7XHJcbiAgICAgICAgYXJyW2pdICU9IGJhc2VPdXQ7XHJcbiAgICAgIH1cclxuICAgIH1cclxuICB9XHJcblxyXG4gIHJldHVybiBhcnIucmV2ZXJzZSgpO1xyXG59XHJcblxyXG5cclxuLypcclxuICogY29zKHgpID0gMSAtIHheMi8yISArIHheNC80ISAtIC4uLlxyXG4gKiB8eHwgPCBwaS8yXHJcbiAqXHJcbiAqL1xyXG5mdW5jdGlvbiBjb3NpbmUoQ3RvciwgeCkge1xyXG4gIHZhciBrLCBsZW4sIHk7XHJcblxyXG4gIGlmICh4LmlzWmVybygpKSByZXR1cm4geDtcclxuXHJcbiAgLy8gQXJndW1lbnQgcmVkdWN0aW9uOiBjb3MoNHgpID0gOCooY29zXjQoeCkgLSBjb3NeMih4KSkgKyAxXHJcbiAgLy8gaS5lLiBjb3MoeCkgPSA4Kihjb3NeNCh4LzQpIC0gY29zXjIoeC80KSkgKyAxXHJcblxyXG4gIC8vIEVzdGltYXRlIHRoZSBvcHRpbXVtIG51bWJlciBvZiB0aW1lcyB0byB1c2UgdGhlIGFyZ3VtZW50IHJlZHVjdGlvbi5cclxuICBsZW4gPSB4LmQubGVuZ3RoO1xyXG4gIGlmIChsZW4gPCAzMikge1xyXG4gICAgayA9IE1hdGguY2VpbChsZW4gLyAzKTtcclxuICAgIHkgPSAoMSAvIHRpbnlQb3coNCwgaykpLnRvU3RyaW5nKCk7XHJcbiAgfSBlbHNlIHtcclxuICAgIGsgPSAxNjtcclxuICAgIHkgPSAnMi4zMjgzMDY0MzY1Mzg2OTYyODkwNjI1ZS0xMCc7XHJcbiAgfVxyXG5cclxuICBDdG9yLnByZWNpc2lvbiArPSBrO1xyXG5cclxuICB4ID0gdGF5bG9yU2VyaWVzKEN0b3IsIDEsIHgudGltZXMoeSksIG5ldyBDdG9yKDEpKTtcclxuXHJcbiAgLy8gUmV2ZXJzZSBhcmd1bWVudCByZWR1Y3Rpb25cclxuICBmb3IgKHZhciBpID0gazsgaS0tOykge1xyXG4gICAgdmFyIGNvczJ4ID0geC50aW1lcyh4KTtcclxuICAgIHggPSBjb3MyeC50aW1lcyhjb3MyeCkubWludXMoY29zMngpLnRpbWVzKDgpLnBsdXMoMSk7XHJcbiAgfVxyXG5cclxuICBDdG9yLnByZWNpc2lvbiAtPSBrO1xyXG5cclxuICByZXR1cm4geDtcclxufVxyXG5cclxuXHJcbi8qXHJcbiAqIFBlcmZvcm0gZGl2aXNpb24gaW4gdGhlIHNwZWNpZmllZCBiYXNlLlxyXG4gKi9cclxudmFyIGRpdmlkZSA9IChmdW5jdGlvbiAoKSB7XHJcblxyXG4gIC8vIEFzc3VtZXMgbm9uLXplcm8geCBhbmQgaywgYW5kIGhlbmNlIG5vbi16ZXJvIHJlc3VsdC5cclxuICBmdW5jdGlvbiBtdWx0aXBseUludGVnZXIoeCwgaywgYmFzZSkge1xyXG4gICAgdmFyIHRlbXAsXHJcbiAgICAgIGNhcnJ5ID0gMCxcclxuICAgICAgaSA9IHgubGVuZ3RoO1xyXG5cclxuICAgIGZvciAoeCA9IHguc2xpY2UoKTsgaS0tOykge1xyXG4gICAgICB0ZW1wID0geFtpXSAqIGsgKyBjYXJyeTtcclxuICAgICAgeFtpXSA9IHRlbXAgJSBiYXNlIHwgMDtcclxuICAgICAgY2FycnkgPSB0ZW1wIC8gYmFzZSB8IDA7XHJcbiAgICB9XHJcblxyXG4gICAgaWYgKGNhcnJ5KSB4LnVuc2hpZnQoY2FycnkpO1xyXG5cclxuICAgIHJldHVybiB4O1xyXG4gIH1cclxuXHJcbiAgZnVuY3Rpb24gY29tcGFyZShhLCBiLCBhTCwgYkwpIHtcclxuICAgIHZhciBpLCByO1xyXG5cclxuICAgIGlmIChhTCAhPSBiTCkge1xyXG4gICAgICByID0gYUwgPiBiTCA/IDEgOiAtMTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIGZvciAoaSA9IHIgPSAwOyBpIDwgYUw7IGkrKykge1xyXG4gICAgICAgIGlmIChhW2ldICE9IGJbaV0pIHtcclxuICAgICAgICAgIHIgPSBhW2ldID4gYltpXSA/IDEgOiAtMTtcclxuICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiByO1xyXG4gIH1cclxuXHJcbiAgZnVuY3Rpb24gc3VidHJhY3QoYSwgYiwgYUwsIGJhc2UpIHtcclxuICAgIHZhciBpID0gMDtcclxuXHJcbiAgICAvLyBTdWJ0cmFjdCBiIGZyb20gYS5cclxuICAgIGZvciAoOyBhTC0tOykge1xyXG4gICAgICBhW2FMXSAtPSBpO1xyXG4gICAgICBpID0gYVthTF0gPCBiW2FMXSA/IDEgOiAwO1xyXG4gICAgICBhW2FMXSA9IGkgKiBiYXNlICsgYVthTF0gLSBiW2FMXTtcclxuICAgIH1cclxuXHJcbiAgICAvLyBSZW1vdmUgbGVhZGluZyB6ZXJvcy5cclxuICAgIGZvciAoOyAhYVswXSAmJiBhLmxlbmd0aCA+IDE7KSBhLnNoaWZ0KCk7XHJcbiAgfVxyXG5cclxuICByZXR1cm4gZnVuY3Rpb24gKHgsIHksIHByLCBybSwgZHAsIGJhc2UpIHtcclxuICAgIHZhciBjbXAsIGUsIGksIGssIGxvZ0Jhc2UsIG1vcmUsIHByb2QsIHByb2RMLCBxLCBxZCwgcmVtLCByZW1MLCByZW0wLCBzZCwgdCwgeGksIHhMLCB5ZDAsXHJcbiAgICAgIHlMLCB5eixcclxuICAgICAgQ3RvciA9IHguY29uc3RydWN0b3IsXHJcbiAgICAgIHNpZ24gPSB4LnMgPT0geS5zID8gMSA6IC0xLFxyXG4gICAgICB4ZCA9IHguZCxcclxuICAgICAgeWQgPSB5LmQ7XHJcblxyXG4gICAgLy8gRWl0aGVyIE5hTiwgSW5maW5pdHkgb3IgMD9cclxuICAgIGlmICgheGQgfHwgIXhkWzBdIHx8ICF5ZCB8fCAheWRbMF0pIHtcclxuXHJcbiAgICAgIHJldHVybiBuZXcgQ3RvcigvLyBSZXR1cm4gTmFOIGlmIGVpdGhlciBOYU4sIG9yIGJvdGggSW5maW5pdHkgb3IgMC5cclxuICAgICAgICAheC5zIHx8ICF5LnMgfHwgKHhkID8geWQgJiYgeGRbMF0gPT0geWRbMF0gOiAheWQpID8gTmFOIDpcclxuXHJcbiAgICAgICAgLy8gUmV0dXJuIFx1MDBCMTAgaWYgeCBpcyAwIG9yIHkgaXMgXHUwMEIxSW5maW5pdHksIG9yIHJldHVybiBcdTAwQjFJbmZpbml0eSBhcyB5IGlzIDAuXHJcbiAgICAgICAgeGQgJiYgeGRbMF0gPT0gMCB8fCAheWQgPyBzaWduICogMCA6IHNpZ24gLyAwKTtcclxuICAgIH1cclxuXHJcbiAgICBpZiAoYmFzZSkge1xyXG4gICAgICBsb2dCYXNlID0gMTtcclxuICAgICAgZSA9IHguZSAtIHkuZTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIGJhc2UgPSBCQVNFO1xyXG4gICAgICBsb2dCYXNlID0gTE9HX0JBU0U7XHJcbiAgICAgIGUgPSBtYXRoZmxvb3IoeC5lIC8gbG9nQmFzZSkgLSBtYXRoZmxvb3IoeS5lIC8gbG9nQmFzZSk7XHJcbiAgICB9XHJcblxyXG4gICAgeUwgPSB5ZC5sZW5ndGg7XHJcbiAgICB4TCA9IHhkLmxlbmd0aDtcclxuICAgIHEgPSBuZXcgQ3RvcihzaWduKTtcclxuICAgIHFkID0gcS5kID0gW107XHJcblxyXG4gICAgLy8gUmVzdWx0IGV4cG9uZW50IG1heSBiZSBvbmUgbGVzcyB0aGFuIGUuXHJcbiAgICAvLyBUaGUgZGlnaXQgYXJyYXkgb2YgYSBEZWNpbWFsIGZyb20gdG9TdHJpbmdCaW5hcnkgbWF5IGhhdmUgdHJhaWxpbmcgemVyb3MuXHJcbiAgICBmb3IgKGkgPSAwOyB5ZFtpXSA9PSAoeGRbaV0gfHwgMCk7IGkrKyk7XHJcblxyXG4gICAgaWYgKHlkW2ldID4gKHhkW2ldIHx8IDApKSBlLS07XHJcblxyXG4gICAgaWYgKHByID09IG51bGwpIHtcclxuICAgICAgc2QgPSBwciA9IEN0b3IucHJlY2lzaW9uO1xyXG4gICAgICBybSA9IEN0b3Iucm91bmRpbmc7XHJcbiAgICB9IGVsc2UgaWYgKGRwKSB7XHJcbiAgICAgIHNkID0gcHIgKyAoeC5lIC0geS5lKSArIDE7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICBzZCA9IHByO1xyXG4gICAgfVxyXG5cclxuICAgIGlmIChzZCA8IDApIHtcclxuICAgICAgcWQucHVzaCgxKTtcclxuICAgICAgbW9yZSA9IHRydWU7XHJcbiAgICB9IGVsc2Uge1xyXG5cclxuICAgICAgLy8gQ29udmVydCBwcmVjaXNpb24gaW4gbnVtYmVyIG9mIGJhc2UgMTAgZGlnaXRzIHRvIGJhc2UgMWU3IGRpZ2l0cy5cclxuICAgICAgc2QgPSBzZCAvIGxvZ0Jhc2UgKyAyIHwgMDtcclxuICAgICAgaSA9IDA7XHJcblxyXG4gICAgICAvLyBkaXZpc29yIDwgMWU3XHJcbiAgICAgIGlmICh5TCA9PSAxKSB7XHJcbiAgICAgICAgayA9IDA7XHJcbiAgICAgICAgeWQgPSB5ZFswXTtcclxuICAgICAgICBzZCsrO1xyXG5cclxuICAgICAgICAvLyBrIGlzIHRoZSBjYXJyeS5cclxuICAgICAgICBmb3IgKDsgKGkgPCB4TCB8fCBrKSAmJiBzZC0tOyBpKyspIHtcclxuICAgICAgICAgIHQgPSBrICogYmFzZSArICh4ZFtpXSB8fCAwKTtcclxuICAgICAgICAgIHFkW2ldID0gdCAvIHlkIHwgMDtcclxuICAgICAgICAgIGsgPSB0ICUgeWQgfCAwO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgbW9yZSA9IGsgfHwgaSA8IHhMO1xyXG5cclxuICAgICAgLy8gZGl2aXNvciA+PSAxZTdcclxuICAgICAgfSBlbHNlIHtcclxuXHJcbiAgICAgICAgLy8gTm9ybWFsaXNlIHhkIGFuZCB5ZCBzbyBoaWdoZXN0IG9yZGVyIGRpZ2l0IG9mIHlkIGlzID49IGJhc2UvMlxyXG4gICAgICAgIGsgPSBiYXNlIC8gKHlkWzBdICsgMSkgfCAwO1xyXG5cclxuICAgICAgICBpZiAoayA+IDEpIHtcclxuICAgICAgICAgIHlkID0gbXVsdGlwbHlJbnRlZ2VyKHlkLCBrLCBiYXNlKTtcclxuICAgICAgICAgIHhkID0gbXVsdGlwbHlJbnRlZ2VyKHhkLCBrLCBiYXNlKTtcclxuICAgICAgICAgIHlMID0geWQubGVuZ3RoO1xyXG4gICAgICAgICAgeEwgPSB4ZC5sZW5ndGg7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB4aSA9IHlMO1xyXG4gICAgICAgIHJlbSA9IHhkLnNsaWNlKDAsIHlMKTtcclxuICAgICAgICByZW1MID0gcmVtLmxlbmd0aDtcclxuXHJcbiAgICAgICAgLy8gQWRkIHplcm9zIHRvIG1ha2UgcmVtYWluZGVyIGFzIGxvbmcgYXMgZGl2aXNvci5cclxuICAgICAgICBmb3IgKDsgcmVtTCA8IHlMOykgcmVtW3JlbUwrK10gPSAwO1xyXG5cclxuICAgICAgICB5eiA9IHlkLnNsaWNlKCk7XHJcbiAgICAgICAgeXoudW5zaGlmdCgwKTtcclxuICAgICAgICB5ZDAgPSB5ZFswXTtcclxuXHJcbiAgICAgICAgaWYgKHlkWzFdID49IGJhc2UgLyAyKSArK3lkMDtcclxuXHJcbiAgICAgICAgZG8ge1xyXG4gICAgICAgICAgayA9IDA7XHJcblxyXG4gICAgICAgICAgLy8gQ29tcGFyZSBkaXZpc29yIGFuZCByZW1haW5kZXIuXHJcbiAgICAgICAgICBjbXAgPSBjb21wYXJlKHlkLCByZW0sIHlMLCByZW1MKTtcclxuXHJcbiAgICAgICAgICAvLyBJZiBkaXZpc29yIDwgcmVtYWluZGVyLlxyXG4gICAgICAgICAgaWYgKGNtcCA8IDApIHtcclxuXHJcbiAgICAgICAgICAgIC8vIENhbGN1bGF0ZSB0cmlhbCBkaWdpdCwgay5cclxuICAgICAgICAgICAgcmVtMCA9IHJlbVswXTtcclxuICAgICAgICAgICAgaWYgKHlMICE9IHJlbUwpIHJlbTAgPSByZW0wICogYmFzZSArIChyZW1bMV0gfHwgMCk7XHJcblxyXG4gICAgICAgICAgICAvLyBrIHdpbGwgYmUgaG93IG1hbnkgdGltZXMgdGhlIGRpdmlzb3IgZ29lcyBpbnRvIHRoZSBjdXJyZW50IHJlbWFpbmRlci5cclxuICAgICAgICAgICAgayA9IHJlbTAgLyB5ZDAgfCAwO1xyXG5cclxuICAgICAgICAgICAgLy8gIEFsZ29yaXRobTpcclxuICAgICAgICAgICAgLy8gIDEuIHByb2R1Y3QgPSBkaXZpc29yICogdHJpYWwgZGlnaXQgKGspXHJcbiAgICAgICAgICAgIC8vICAyLiBpZiBwcm9kdWN0ID4gcmVtYWluZGVyOiBwcm9kdWN0IC09IGRpdmlzb3IsIGstLVxyXG4gICAgICAgICAgICAvLyAgMy4gcmVtYWluZGVyIC09IHByb2R1Y3RcclxuICAgICAgICAgICAgLy8gIDQuIGlmIHByb2R1Y3Qgd2FzIDwgcmVtYWluZGVyIGF0IDI6XHJcbiAgICAgICAgICAgIC8vICAgIDUuIGNvbXBhcmUgbmV3IHJlbWFpbmRlciBhbmQgZGl2aXNvclxyXG4gICAgICAgICAgICAvLyAgICA2LiBJZiByZW1haW5kZXIgPiBkaXZpc29yOiByZW1haW5kZXIgLT0gZGl2aXNvciwgaysrXHJcblxyXG4gICAgICAgICAgICBpZiAoayA+IDEpIHtcclxuICAgICAgICAgICAgICBpZiAoayA+PSBiYXNlKSBrID0gYmFzZSAtIDE7XHJcblxyXG4gICAgICAgICAgICAgIC8vIHByb2R1Y3QgPSBkaXZpc29yICogdHJpYWwgZGlnaXQuXHJcbiAgICAgICAgICAgICAgcHJvZCA9IG11bHRpcGx5SW50ZWdlcih5ZCwgaywgYmFzZSk7XHJcbiAgICAgICAgICAgICAgcHJvZEwgPSBwcm9kLmxlbmd0aDtcclxuICAgICAgICAgICAgICByZW1MID0gcmVtLmxlbmd0aDtcclxuXHJcbiAgICAgICAgICAgICAgLy8gQ29tcGFyZSBwcm9kdWN0IGFuZCByZW1haW5kZXIuXHJcbiAgICAgICAgICAgICAgY21wID0gY29tcGFyZShwcm9kLCByZW0sIHByb2RMLCByZW1MKTtcclxuXHJcbiAgICAgICAgICAgICAgLy8gcHJvZHVjdCA+IHJlbWFpbmRlci5cclxuICAgICAgICAgICAgICBpZiAoY21wID09IDEpIHtcclxuICAgICAgICAgICAgICAgIGstLTtcclxuXHJcbiAgICAgICAgICAgICAgICAvLyBTdWJ0cmFjdCBkaXZpc29yIGZyb20gcHJvZHVjdC5cclxuICAgICAgICAgICAgICAgIHN1YnRyYWN0KHByb2QsIHlMIDwgcHJvZEwgPyB5eiA6IHlkLCBwcm9kTCwgYmFzZSk7XHJcbiAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG5cclxuICAgICAgICAgICAgICAvLyBjbXAgaXMgLTEuXHJcbiAgICAgICAgICAgICAgLy8gSWYgayBpcyAwLCB0aGVyZSBpcyBubyBuZWVkIHRvIGNvbXBhcmUgeWQgYW5kIHJlbSBhZ2FpbiBiZWxvdywgc28gY2hhbmdlIGNtcCB0byAxXHJcbiAgICAgICAgICAgICAgLy8gdG8gYXZvaWQgaXQuIElmIGsgaXMgMSB0aGVyZSBpcyBhIG5lZWQgdG8gY29tcGFyZSB5ZCBhbmQgcmVtIGFnYWluIGJlbG93LlxyXG4gICAgICAgICAgICAgIGlmIChrID09IDApIGNtcCA9IGsgPSAxO1xyXG4gICAgICAgICAgICAgIHByb2QgPSB5ZC5zbGljZSgpO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBwcm9kTCA9IHByb2QubGVuZ3RoO1xyXG4gICAgICAgICAgICBpZiAocHJvZEwgPCByZW1MKSBwcm9kLnVuc2hpZnQoMCk7XHJcblxyXG4gICAgICAgICAgICAvLyBTdWJ0cmFjdCBwcm9kdWN0IGZyb20gcmVtYWluZGVyLlxyXG4gICAgICAgICAgICBzdWJ0cmFjdChyZW0sIHByb2QsIHJlbUwsIGJhc2UpO1xyXG5cclxuICAgICAgICAgICAgLy8gSWYgcHJvZHVjdCB3YXMgPCBwcmV2aW91cyByZW1haW5kZXIuXHJcbiAgICAgICAgICAgIGlmIChjbXAgPT0gLTEpIHtcclxuICAgICAgICAgICAgICByZW1MID0gcmVtLmxlbmd0aDtcclxuXHJcbiAgICAgICAgICAgICAgLy8gQ29tcGFyZSBkaXZpc29yIGFuZCBuZXcgcmVtYWluZGVyLlxyXG4gICAgICAgICAgICAgIGNtcCA9IGNvbXBhcmUoeWQsIHJlbSwgeUwsIHJlbUwpO1xyXG5cclxuICAgICAgICAgICAgICAvLyBJZiBkaXZpc29yIDwgbmV3IHJlbWFpbmRlciwgc3VidHJhY3QgZGl2aXNvciBmcm9tIHJlbWFpbmRlci5cclxuICAgICAgICAgICAgICBpZiAoY21wIDwgMSkge1xyXG4gICAgICAgICAgICAgICAgaysrO1xyXG5cclxuICAgICAgICAgICAgICAgIC8vIFN1YnRyYWN0IGRpdmlzb3IgZnJvbSByZW1haW5kZXIuXHJcbiAgICAgICAgICAgICAgICBzdWJ0cmFjdChyZW0sIHlMIDwgcmVtTCA/IHl6IDogeWQsIHJlbUwsIGJhc2UpO1xyXG4gICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgcmVtTCA9IHJlbS5sZW5ndGg7XHJcbiAgICAgICAgICB9IGVsc2UgaWYgKGNtcCA9PT0gMCkge1xyXG4gICAgICAgICAgICBrKys7XHJcbiAgICAgICAgICAgIHJlbSA9IFswXTtcclxuICAgICAgICAgIH0gICAgLy8gaWYgY21wID09PSAxLCBrIHdpbGwgYmUgMFxyXG5cclxuICAgICAgICAgIC8vIEFkZCB0aGUgbmV4dCBkaWdpdCwgaywgdG8gdGhlIHJlc3VsdCBhcnJheS5cclxuICAgICAgICAgIHFkW2krK10gPSBrO1xyXG5cclxuICAgICAgICAgIC8vIFVwZGF0ZSB0aGUgcmVtYWluZGVyLlxyXG4gICAgICAgICAgaWYgKGNtcCAmJiByZW1bMF0pIHtcclxuICAgICAgICAgICAgcmVtW3JlbUwrK10gPSB4ZFt4aV0gfHwgMDtcclxuICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHJlbSA9IFt4ZFt4aV1dO1xyXG4gICAgICAgICAgICByZW1MID0gMTtcclxuICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgfSB3aGlsZSAoKHhpKysgPCB4TCB8fCByZW1bMF0gIT09IHZvaWQgMCkgJiYgc2QtLSk7XHJcblxyXG4gICAgICAgIG1vcmUgPSByZW1bMF0gIT09IHZvaWQgMDtcclxuICAgICAgfVxyXG5cclxuICAgICAgLy8gTGVhZGluZyB6ZXJvP1xyXG4gICAgICBpZiAoIXFkWzBdKSBxZC5zaGlmdCgpO1xyXG4gICAgfVxyXG5cclxuICAgIC8vIGxvZ0Jhc2UgaXMgMSB3aGVuIGRpdmlkZSBpcyBiZWluZyB1c2VkIGZvciBiYXNlIGNvbnZlcnNpb24uXHJcbiAgICBpZiAobG9nQmFzZSA9PSAxKSB7XHJcbiAgICAgIHEuZSA9IGU7XHJcbiAgICAgIGluZXhhY3QgPSBtb3JlO1xyXG4gICAgfSBlbHNlIHtcclxuXHJcbiAgICAgIC8vIFRvIGNhbGN1bGF0ZSBxLmUsIGZpcnN0IGdldCB0aGUgbnVtYmVyIG9mIGRpZ2l0cyBvZiBxZFswXS5cclxuICAgICAgZm9yIChpID0gMSwgayA9IHFkWzBdOyBrID49IDEwOyBrIC89IDEwKSBpKys7XHJcbiAgICAgIHEuZSA9IGkgKyBlICogbG9nQmFzZSAtIDE7XHJcblxyXG4gICAgICBmaW5hbGlzZShxLCBkcCA/IHByICsgcS5lICsgMSA6IHByLCBybSwgbW9yZSk7XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIHE7XHJcbiAgfTtcclxufSkoKTtcclxuXHJcblxyXG4vKlxyXG4gKiBSb3VuZCBgeGAgdG8gYHNkYCBzaWduaWZpY2FudCBkaWdpdHMgdXNpbmcgcm91bmRpbmcgbW9kZSBgcm1gLlxyXG4gKiBDaGVjayBmb3Igb3Zlci91bmRlci1mbG93LlxyXG4gKi9cclxuIGZ1bmN0aW9uIGZpbmFsaXNlKHgsIHNkLCBybSwgaXNUcnVuY2F0ZWQpIHtcclxuICB2YXIgZGlnaXRzLCBpLCBqLCBrLCByZCwgcm91bmRVcCwgdywgeGQsIHhkaSxcclxuICAgIEN0b3IgPSB4LmNvbnN0cnVjdG9yO1xyXG5cclxuICAvLyBEb24ndCByb3VuZCBpZiBzZCBpcyBudWxsIG9yIHVuZGVmaW5lZC5cclxuICBvdXQ6IGlmIChzZCAhPSBudWxsKSB7XHJcbiAgICB4ZCA9IHguZDtcclxuXHJcbiAgICAvLyBJbmZpbml0eS9OYU4uXHJcbiAgICBpZiAoIXhkKSByZXR1cm4geDtcclxuXHJcbiAgICAvLyByZDogdGhlIHJvdW5kaW5nIGRpZ2l0LCBpLmUuIHRoZSBkaWdpdCBhZnRlciB0aGUgZGlnaXQgdGhhdCBtYXkgYmUgcm91bmRlZCB1cC5cclxuICAgIC8vIHc6IHRoZSB3b3JkIG9mIHhkIGNvbnRhaW5pbmcgcmQsIGEgYmFzZSAxZTcgbnVtYmVyLlxyXG4gICAgLy8geGRpOiB0aGUgaW5kZXggb2YgdyB3aXRoaW4geGQuXHJcbiAgICAvLyBkaWdpdHM6IHRoZSBudW1iZXIgb2YgZGlnaXRzIG9mIHcuXHJcbiAgICAvLyBpOiB3aGF0IHdvdWxkIGJlIHRoZSBpbmRleCBvZiByZCB3aXRoaW4gdyBpZiBhbGwgdGhlIG51bWJlcnMgd2VyZSA3IGRpZ2l0cyBsb25nIChpLmUuIGlmXHJcbiAgICAvLyB0aGV5IGhhZCBsZWFkaW5nIHplcm9zKVxyXG4gICAgLy8gajogaWYgPiAwLCB0aGUgYWN0dWFsIGluZGV4IG9mIHJkIHdpdGhpbiB3IChpZiA8IDAsIHJkIGlzIGEgbGVhZGluZyB6ZXJvKS5cclxuXHJcbiAgICAvLyBHZXQgdGhlIGxlbmd0aCBvZiB0aGUgZmlyc3Qgd29yZCBvZiB0aGUgZGlnaXRzIGFycmF5IHhkLlxyXG4gICAgZm9yIChkaWdpdHMgPSAxLCBrID0geGRbMF07IGsgPj0gMTA7IGsgLz0gMTApIGRpZ2l0cysrO1xyXG4gICAgaSA9IHNkIC0gZGlnaXRzO1xyXG5cclxuICAgIC8vIElzIHRoZSByb3VuZGluZyBkaWdpdCBpbiB0aGUgZmlyc3Qgd29yZCBvZiB4ZD9cclxuICAgIGlmIChpIDwgMCkge1xyXG4gICAgICBpICs9IExPR19CQVNFO1xyXG4gICAgICBqID0gc2Q7XHJcbiAgICAgIHcgPSB4ZFt4ZGkgPSAwXTtcclxuXHJcbiAgICAgIC8vIEdldCB0aGUgcm91bmRpbmcgZGlnaXQgYXQgaW5kZXggaiBvZiB3LlxyXG4gICAgICByZCA9IHcgLyBtYXRocG93KDEwLCBkaWdpdHMgLSBqIC0gMSkgJSAxMCB8IDA7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICB4ZGkgPSBNYXRoLmNlaWwoKGkgKyAxKSAvIExPR19CQVNFKTtcclxuICAgICAgayA9IHhkLmxlbmd0aDtcclxuICAgICAgaWYgKHhkaSA+PSBrKSB7XHJcbiAgICAgICAgaWYgKGlzVHJ1bmNhdGVkKSB7XHJcblxyXG4gICAgICAgICAgLy8gTmVlZGVkIGJ5IGBuYXR1cmFsRXhwb25lbnRpYWxgLCBgbmF0dXJhbExvZ2FyaXRobWAgYW5kIGBzcXVhcmVSb290YC5cclxuICAgICAgICAgIGZvciAoOyBrKysgPD0geGRpOykgeGQucHVzaCgwKTtcclxuICAgICAgICAgIHcgPSByZCA9IDA7XHJcbiAgICAgICAgICBkaWdpdHMgPSAxO1xyXG4gICAgICAgICAgaSAlPSBMT0dfQkFTRTtcclxuICAgICAgICAgIGogPSBpIC0gTE9HX0JBU0UgKyAxO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICBicmVhayBvdXQ7XHJcbiAgICAgICAgfVxyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIHcgPSBrID0geGRbeGRpXTtcclxuXHJcbiAgICAgICAgLy8gR2V0IHRoZSBudW1iZXIgb2YgZGlnaXRzIG9mIHcuXHJcbiAgICAgICAgZm9yIChkaWdpdHMgPSAxOyBrID49IDEwOyBrIC89IDEwKSBkaWdpdHMrKztcclxuXHJcbiAgICAgICAgLy8gR2V0IHRoZSBpbmRleCBvZiByZCB3aXRoaW4gdy5cclxuICAgICAgICBpICU9IExPR19CQVNFO1xyXG5cclxuICAgICAgICAvLyBHZXQgdGhlIGluZGV4IG9mIHJkIHdpdGhpbiB3LCBhZGp1c3RlZCBmb3IgbGVhZGluZyB6ZXJvcy5cclxuICAgICAgICAvLyBUaGUgbnVtYmVyIG9mIGxlYWRpbmcgemVyb3Mgb2YgdyBpcyBnaXZlbiBieSBMT0dfQkFTRSAtIGRpZ2l0cy5cclxuICAgICAgICBqID0gaSAtIExPR19CQVNFICsgZGlnaXRzO1xyXG5cclxuICAgICAgICAvLyBHZXQgdGhlIHJvdW5kaW5nIGRpZ2l0IGF0IGluZGV4IGogb2Ygdy5cclxuICAgICAgICByZCA9IGogPCAwID8gMCA6IHcgLyBtYXRocG93KDEwLCBkaWdpdHMgLSBqIC0gMSkgJSAxMCB8IDA7XHJcbiAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICAvLyBBcmUgdGhlcmUgYW55IG5vbi16ZXJvIGRpZ2l0cyBhZnRlciB0aGUgcm91bmRpbmcgZGlnaXQ/XHJcbiAgICBpc1RydW5jYXRlZCA9IGlzVHJ1bmNhdGVkIHx8IHNkIDwgMCB8fFxyXG4gICAgICB4ZFt4ZGkgKyAxXSAhPT0gdm9pZCAwIHx8IChqIDwgMCA/IHcgOiB3ICUgbWF0aHBvdygxMCwgZGlnaXRzIC0gaiAtIDEpKTtcclxuXHJcbiAgICAvLyBUaGUgZXhwcmVzc2lvbiBgdyAlIG1hdGhwb3coMTAsIGRpZ2l0cyAtIGogLSAxKWAgcmV0dXJucyBhbGwgdGhlIGRpZ2l0cyBvZiB3IHRvIHRoZSByaWdodFxyXG4gICAgLy8gb2YgdGhlIGRpZ2l0IGF0IChsZWZ0LXRvLXJpZ2h0KSBpbmRleCBqLCBlLmcuIGlmIHcgaXMgOTA4NzE0IGFuZCBqIGlzIDIsIHRoZSBleHByZXNzaW9uXHJcbiAgICAvLyB3aWxsIGdpdmUgNzE0LlxyXG5cclxuICAgIHJvdW5kVXAgPSBybSA8IDRcclxuICAgICAgPyAocmQgfHwgaXNUcnVuY2F0ZWQpICYmIChybSA9PSAwIHx8IHJtID09ICh4LnMgPCAwID8gMyA6IDIpKVxyXG4gICAgICA6IHJkID4gNSB8fCByZCA9PSA1ICYmIChybSA9PSA0IHx8IGlzVHJ1bmNhdGVkIHx8IHJtID09IDYgJiZcclxuXHJcbiAgICAgICAgLy8gQ2hlY2sgd2hldGhlciB0aGUgZGlnaXQgdG8gdGhlIGxlZnQgb2YgdGhlIHJvdW5kaW5nIGRpZ2l0IGlzIG9kZC5cclxuICAgICAgICAoKGkgPiAwID8gaiA+IDAgPyB3IC8gbWF0aHBvdygxMCwgZGlnaXRzIC0gaikgOiAwIDogeGRbeGRpIC0gMV0pICUgMTApICYgMSB8fFxyXG4gICAgICAgICAgcm0gPT0gKHgucyA8IDAgPyA4IDogNykpO1xyXG5cclxuICAgIGlmIChzZCA8IDEgfHwgIXhkWzBdKSB7XHJcbiAgICAgIHhkLmxlbmd0aCA9IDA7XHJcbiAgICAgIGlmIChyb3VuZFVwKSB7XHJcblxyXG4gICAgICAgIC8vIENvbnZlcnQgc2QgdG8gZGVjaW1hbCBwbGFjZXMuXHJcbiAgICAgICAgc2QgLT0geC5lICsgMTtcclxuXHJcbiAgICAgICAgLy8gMSwgMC4xLCAwLjAxLCAwLjAwMSwgMC4wMDAxIGV0Yy5cclxuICAgICAgICB4ZFswXSA9IG1hdGhwb3coMTAsIChMT0dfQkFTRSAtIHNkICUgTE9HX0JBU0UpICUgTE9HX0JBU0UpO1xyXG4gICAgICAgIHguZSA9IC1zZCB8fCAwO1xyXG4gICAgICB9IGVsc2Uge1xyXG5cclxuICAgICAgICAvLyBaZXJvLlxyXG4gICAgICAgIHhkWzBdID0geC5lID0gMDtcclxuICAgICAgfVxyXG5cclxuICAgICAgcmV0dXJuIHg7XHJcbiAgICB9XHJcblxyXG4gICAgLy8gUmVtb3ZlIGV4Y2VzcyBkaWdpdHMuXHJcbiAgICBpZiAoaSA9PSAwKSB7XHJcbiAgICAgIHhkLmxlbmd0aCA9IHhkaTtcclxuICAgICAgayA9IDE7XHJcbiAgICAgIHhkaS0tO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgeGQubGVuZ3RoID0geGRpICsgMTtcclxuICAgICAgayA9IG1hdGhwb3coMTAsIExPR19CQVNFIC0gaSk7XHJcblxyXG4gICAgICAvLyBFLmcuIDU2NzAwIGJlY29tZXMgNTYwMDAgaWYgNyBpcyB0aGUgcm91bmRpbmcgZGlnaXQuXHJcbiAgICAgIC8vIGogPiAwIG1lYW5zIGkgPiBudW1iZXIgb2YgbGVhZGluZyB6ZXJvcyBvZiB3LlxyXG4gICAgICB4ZFt4ZGldID0gaiA+IDAgPyAodyAvIG1hdGhwb3coMTAsIGRpZ2l0cyAtIGopICUgbWF0aHBvdygxMCwgaikgfCAwKSAqIGsgOiAwO1xyXG4gICAgfVxyXG5cclxuICAgIGlmIChyb3VuZFVwKSB7XHJcbiAgICAgIGZvciAoOzspIHtcclxuXHJcbiAgICAgICAgLy8gSXMgdGhlIGRpZ2l0IHRvIGJlIHJvdW5kZWQgdXAgaW4gdGhlIGZpcnN0IHdvcmQgb2YgeGQ/XHJcbiAgICAgICAgaWYgKHhkaSA9PSAwKSB7XHJcblxyXG4gICAgICAgICAgLy8gaSB3aWxsIGJlIHRoZSBsZW5ndGggb2YgeGRbMF0gYmVmb3JlIGsgaXMgYWRkZWQuXHJcbiAgICAgICAgICBmb3IgKGkgPSAxLCBqID0geGRbMF07IGogPj0gMTA7IGogLz0gMTApIGkrKztcclxuICAgICAgICAgIGogPSB4ZFswXSArPSBrO1xyXG4gICAgICAgICAgZm9yIChrID0gMTsgaiA+PSAxMDsgaiAvPSAxMCkgaysrO1xyXG5cclxuICAgICAgICAgIC8vIGlmIGkgIT0gayB0aGUgbGVuZ3RoIGhhcyBpbmNyZWFzZWQuXHJcbiAgICAgICAgICBpZiAoaSAhPSBrKSB7XHJcbiAgICAgICAgICAgIHguZSsrO1xyXG4gICAgICAgICAgICBpZiAoeGRbMF0gPT0gQkFTRSkgeGRbMF0gPSAxO1xyXG4gICAgICAgICAgfVxyXG5cclxuICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICB4ZFt4ZGldICs9IGs7XHJcbiAgICAgICAgICBpZiAoeGRbeGRpXSAhPSBCQVNFKSBicmVhaztcclxuICAgICAgICAgIHhkW3hkaS0tXSA9IDA7XHJcbiAgICAgICAgICBrID0gMTtcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICAvLyBSZW1vdmUgdHJhaWxpbmcgemVyb3MuXHJcbiAgICBmb3IgKGkgPSB4ZC5sZW5ndGg7IHhkWy0taV0gPT09IDA7KSB4ZC5wb3AoKTtcclxuICB9XHJcblxyXG4gIGlmIChleHRlcm5hbCkge1xyXG5cclxuICAgIC8vIE92ZXJmbG93P1xyXG4gICAgaWYgKHguZSA+IEN0b3IubWF4RSkge1xyXG5cclxuICAgICAgLy8gSW5maW5pdHkuXHJcbiAgICAgIHguZCA9IG51bGw7XHJcbiAgICAgIHguZSA9IE5hTjtcclxuXHJcbiAgICAvLyBVbmRlcmZsb3c/XHJcbiAgICB9IGVsc2UgaWYgKHguZSA8IEN0b3IubWluRSkge1xyXG5cclxuICAgICAgLy8gWmVyby5cclxuICAgICAgeC5lID0gMDtcclxuICAgICAgeC5kID0gWzBdO1xyXG4gICAgICAvLyBDdG9yLnVuZGVyZmxvdyA9IHRydWU7XHJcbiAgICB9IC8vIGVsc2UgQ3Rvci51bmRlcmZsb3cgPSBmYWxzZTtcclxuICB9XHJcblxyXG4gIHJldHVybiB4O1xyXG59XHJcblxyXG5cclxuZnVuY3Rpb24gZmluaXRlVG9TdHJpbmcoeCwgaXNFeHAsIHNkKSB7XHJcbiAgaWYgKCF4LmlzRmluaXRlKCkpIHJldHVybiBub25GaW5pdGVUb1N0cmluZyh4KTtcclxuICB2YXIgayxcclxuICAgIGUgPSB4LmUsXHJcbiAgICBzdHIgPSBkaWdpdHNUb1N0cmluZyh4LmQpLFxyXG4gICAgbGVuID0gc3RyLmxlbmd0aDtcclxuXHJcbiAgaWYgKGlzRXhwKSB7XHJcbiAgICBpZiAoc2QgJiYgKGsgPSBzZCAtIGxlbikgPiAwKSB7XHJcbiAgICAgIHN0ciA9IHN0ci5jaGFyQXQoMCkgKyAnLicgKyBzdHIuc2xpY2UoMSkgKyBnZXRaZXJvU3RyaW5nKGspO1xyXG4gICAgfSBlbHNlIGlmIChsZW4gPiAxKSB7XHJcbiAgICAgIHN0ciA9IHN0ci5jaGFyQXQoMCkgKyAnLicgKyBzdHIuc2xpY2UoMSk7XHJcbiAgICB9XHJcblxyXG4gICAgc3RyID0gc3RyICsgKHguZSA8IDAgPyAnZScgOiAnZSsnKSArIHguZTtcclxuICB9IGVsc2UgaWYgKGUgPCAwKSB7XHJcbiAgICBzdHIgPSAnMC4nICsgZ2V0WmVyb1N0cmluZygtZSAtIDEpICsgc3RyO1xyXG4gICAgaWYgKHNkICYmIChrID0gc2QgLSBsZW4pID4gMCkgc3RyICs9IGdldFplcm9TdHJpbmcoayk7XHJcbiAgfSBlbHNlIGlmIChlID49IGxlbikge1xyXG4gICAgc3RyICs9IGdldFplcm9TdHJpbmcoZSArIDEgLSBsZW4pO1xyXG4gICAgaWYgKHNkICYmIChrID0gc2QgLSBlIC0gMSkgPiAwKSBzdHIgPSBzdHIgKyAnLicgKyBnZXRaZXJvU3RyaW5nKGspO1xyXG4gIH0gZWxzZSB7XHJcbiAgICBpZiAoKGsgPSBlICsgMSkgPCBsZW4pIHN0ciA9IHN0ci5zbGljZSgwLCBrKSArICcuJyArIHN0ci5zbGljZShrKTtcclxuICAgIGlmIChzZCAmJiAoayA9IHNkIC0gbGVuKSA+IDApIHtcclxuICAgICAgaWYgKGUgKyAxID09PSBsZW4pIHN0ciArPSAnLic7XHJcbiAgICAgIHN0ciArPSBnZXRaZXJvU3RyaW5nKGspO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgcmV0dXJuIHN0cjtcclxufVxyXG5cclxuXHJcbi8vIENhbGN1bGF0ZSB0aGUgYmFzZSAxMCBleHBvbmVudCBmcm9tIHRoZSBiYXNlIDFlNyBleHBvbmVudC5cclxuZnVuY3Rpb24gZ2V0QmFzZTEwRXhwb25lbnQoZGlnaXRzLCBlKSB7XHJcbiAgdmFyIHcgPSBkaWdpdHNbMF07XHJcblxyXG4gIC8vIEFkZCB0aGUgbnVtYmVyIG9mIGRpZ2l0cyBvZiB0aGUgZmlyc3Qgd29yZCBvZiB0aGUgZGlnaXRzIGFycmF5LlxyXG4gIGZvciAoIGUgKj0gTE9HX0JBU0U7IHcgPj0gMTA7IHcgLz0gMTApIGUrKztcclxuICByZXR1cm4gZTtcclxufVxyXG5cclxuXHJcbmZ1bmN0aW9uIGdldExuMTAoQ3Rvciwgc2QsIHByKSB7XHJcbiAgaWYgKHNkID4gTE4xMF9QUkVDSVNJT04pIHtcclxuXHJcbiAgICAvLyBSZXNldCBnbG9iYWwgc3RhdGUgaW4gY2FzZSB0aGUgZXhjZXB0aW9uIGlzIGNhdWdodC5cclxuICAgIGV4dGVybmFsID0gdHJ1ZTtcclxuICAgIGlmIChwcikgQ3Rvci5wcmVjaXNpb24gPSBwcjtcclxuICAgIHRocm93IEVycm9yKHByZWNpc2lvbkxpbWl0RXhjZWVkZWQpO1xyXG4gIH1cclxuICByZXR1cm4gZmluYWxpc2UobmV3IEN0b3IoTE4xMCksIHNkLCAxLCB0cnVlKTtcclxufVxyXG5cclxuXHJcbmZ1bmN0aW9uIGdldFBpKEN0b3IsIHNkLCBybSkge1xyXG4gIGlmIChzZCA+IFBJX1BSRUNJU0lPTikgdGhyb3cgRXJyb3IocHJlY2lzaW9uTGltaXRFeGNlZWRlZCk7XHJcbiAgcmV0dXJuIGZpbmFsaXNlKG5ldyBDdG9yKFBJKSwgc2QsIHJtLCB0cnVlKTtcclxufVxyXG5cclxuXHJcbmZ1bmN0aW9uIGdldFByZWNpc2lvbihkaWdpdHMpIHtcclxuICB2YXIgdyA9IGRpZ2l0cy5sZW5ndGggLSAxLFxyXG4gICAgbGVuID0gdyAqIExPR19CQVNFICsgMTtcclxuXHJcbiAgdyA9IGRpZ2l0c1t3XTtcclxuXHJcbiAgLy8gSWYgbm9uLXplcm8uLi5cclxuICBpZiAodykge1xyXG5cclxuICAgIC8vIFN1YnRyYWN0IHRoZSBudW1iZXIgb2YgdHJhaWxpbmcgemVyb3Mgb2YgdGhlIGxhc3Qgd29yZC5cclxuICAgIGZvciAoOyB3ICUgMTAgPT0gMDsgdyAvPSAxMCkgbGVuLS07XHJcblxyXG4gICAgLy8gQWRkIHRoZSBudW1iZXIgb2YgZGlnaXRzIG9mIHRoZSBmaXJzdCB3b3JkLlxyXG4gICAgZm9yICh3ID0gZGlnaXRzWzBdOyB3ID49IDEwOyB3IC89IDEwKSBsZW4rKztcclxuICB9XHJcblxyXG4gIHJldHVybiBsZW47XHJcbn1cclxuXHJcblxyXG5mdW5jdGlvbiBnZXRaZXJvU3RyaW5nKGspIHtcclxuICB2YXIgenMgPSAnJztcclxuICBmb3IgKDsgay0tOykgenMgKz0gJzAnO1xyXG4gIHJldHVybiB6cztcclxufVxyXG5cclxuXHJcbi8qXHJcbiAqIFJldHVybiBhIG5ldyBEZWNpbWFsIHdob3NlIHZhbHVlIGlzIHRoZSB2YWx1ZSBvZiBEZWNpbWFsIGB4YCB0byB0aGUgcG93ZXIgYG5gLCB3aGVyZSBgbmAgaXMgYW5cclxuICogaW50ZWdlciBvZiB0eXBlIG51bWJlci5cclxuICpcclxuICogSW1wbGVtZW50cyAnZXhwb25lbnRpYXRpb24gYnkgc3F1YXJpbmcnLiBDYWxsZWQgYnkgYHBvd2AgYW5kIGBwYXJzZU90aGVyYC5cclxuICpcclxuICovXHJcbmZ1bmN0aW9uIGludFBvdyhDdG9yLCB4LCBuLCBwcikge1xyXG4gIHZhciBpc1RydW5jYXRlZCxcclxuICAgIHIgPSBuZXcgQ3RvcigxKSxcclxuXHJcbiAgICAvLyBNYXggbiBvZiA5MDA3MTk5MjU0NzQwOTkxIHRha2VzIDUzIGxvb3AgaXRlcmF0aW9ucy5cclxuICAgIC8vIE1heGltdW0gZGlnaXRzIGFycmF5IGxlbmd0aDsgbGVhdmVzIFsyOCwgMzRdIGd1YXJkIGRpZ2l0cy5cclxuICAgIGsgPSBNYXRoLmNlaWwocHIgLyBMT0dfQkFTRSArIDQpO1xyXG5cclxuICBleHRlcm5hbCA9IGZhbHNlO1xyXG5cclxuICBmb3IgKDs7KSB7XHJcbiAgICBpZiAobiAlIDIpIHtcclxuICAgICAgciA9IHIudGltZXMoeCk7XHJcbiAgICAgIGlmICh0cnVuY2F0ZShyLmQsIGspKSBpc1RydW5jYXRlZCA9IHRydWU7XHJcbiAgICB9XHJcblxyXG4gICAgbiA9IG1hdGhmbG9vcihuIC8gMik7XHJcbiAgICBpZiAobiA9PT0gMCkge1xyXG5cclxuICAgICAgLy8gVG8gZW5zdXJlIGNvcnJlY3Qgcm91bmRpbmcgd2hlbiByLmQgaXMgdHJ1bmNhdGVkLCBpbmNyZW1lbnQgdGhlIGxhc3Qgd29yZCBpZiBpdCBpcyB6ZXJvLlxyXG4gICAgICBuID0gci5kLmxlbmd0aCAtIDE7XHJcbiAgICAgIGlmIChpc1RydW5jYXRlZCAmJiByLmRbbl0gPT09IDApICsrci5kW25dO1xyXG4gICAgICBicmVhaztcclxuICAgIH1cclxuXHJcbiAgICB4ID0geC50aW1lcyh4KTtcclxuICAgIHRydW5jYXRlKHguZCwgayk7XHJcbiAgfVxyXG5cclxuICBleHRlcm5hbCA9IHRydWU7XHJcblxyXG4gIHJldHVybiByO1xyXG59XHJcblxyXG5cclxuZnVuY3Rpb24gaXNPZGQobikge1xyXG4gIHJldHVybiBuLmRbbi5kLmxlbmd0aCAtIDFdICYgMTtcclxufVxyXG5cclxuXHJcbi8qXHJcbiAqIEhhbmRsZSBgbWF4YCBhbmQgYG1pbmAuIGBsdGd0YCBpcyAnbHQnIG9yICdndCcuXHJcbiAqL1xyXG5mdW5jdGlvbiBtYXhPck1pbihDdG9yLCBhcmdzLCBsdGd0KSB7XHJcbiAgdmFyIHksXHJcbiAgICB4ID0gbmV3IEN0b3IoYXJnc1swXSksXHJcbiAgICBpID0gMDtcclxuXHJcbiAgZm9yICg7ICsraSA8IGFyZ3MubGVuZ3RoOykge1xyXG4gICAgeSA9IG5ldyBDdG9yKGFyZ3NbaV0pO1xyXG4gICAgaWYgKCF5LnMpIHtcclxuICAgICAgeCA9IHk7XHJcbiAgICAgIGJyZWFrO1xyXG4gICAgfSBlbHNlIGlmICh4W2x0Z3RdKHkpKSB7XHJcbiAgICAgIHggPSB5O1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgcmV0dXJuIHg7XHJcbn1cclxuXHJcblxyXG4vKlxyXG4gKiBSZXR1cm4gYSBuZXcgRGVjaW1hbCB3aG9zZSB2YWx1ZSBpcyB0aGUgbmF0dXJhbCBleHBvbmVudGlhbCBvZiBgeGAgcm91bmRlZCB0byBgc2RgIHNpZ25pZmljYW50XHJcbiAqIGRpZ2l0cy5cclxuICpcclxuICogVGF5bG9yL01hY2xhdXJpbiBzZXJpZXMuXHJcbiAqXHJcbiAqIGV4cCh4KSA9IHheMC8wISArIHheMS8xISArIHheMi8yISArIHheMy8zISArIC4uLlxyXG4gKlxyXG4gKiBBcmd1bWVudCByZWR1Y3Rpb246XHJcbiAqICAgUmVwZWF0IHggPSB4IC8gMzIsIGsgKz0gNSwgdW50aWwgfHh8IDwgMC4xXHJcbiAqICAgZXhwKHgpID0gZXhwKHggLyAyXmspXigyXmspXHJcbiAqXHJcbiAqIFByZXZpb3VzbHksIHRoZSBhcmd1bWVudCB3YXMgaW5pdGlhbGx5IHJlZHVjZWQgYnlcclxuICogZXhwKHgpID0gZXhwKHIpICogMTBeayAgd2hlcmUgciA9IHggLSBrICogbG4xMCwgayA9IGZsb29yKHggLyBsbjEwKVxyXG4gKiB0byBmaXJzdCBwdXQgciBpbiB0aGUgcmFuZ2UgWzAsIGxuMTBdLCBiZWZvcmUgZGl2aWRpbmcgYnkgMzIgdW50aWwgfHh8IDwgMC4xLCBidXQgdGhpcyB3YXNcclxuICogZm91bmQgdG8gYmUgc2xvd2VyIHRoYW4ganVzdCBkaXZpZGluZyByZXBlYXRlZGx5IGJ5IDMyIGFzIGFib3ZlLlxyXG4gKlxyXG4gKiBNYXggaW50ZWdlciBhcmd1bWVudDogZXhwKCcyMDcyMzI2NTgzNjk0NjQxMycpID0gNi4zZSs5MDAwMDAwMDAwMDAwMDAwXHJcbiAqIE1pbiBpbnRlZ2VyIGFyZ3VtZW50OiBleHAoJy0yMDcyMzI2NTgzNjk0NjQxMScpID0gMS4yZS05MDAwMDAwMDAwMDAwMDAwXHJcbiAqIChNYXRoIG9iamVjdCBpbnRlZ2VyIG1pbi9tYXg6IE1hdGguZXhwKDcwOSkgPSA4LjJlKzMwNywgTWF0aC5leHAoLTc0NSkgPSA1ZS0zMjQpXHJcbiAqXHJcbiAqICBleHAoSW5maW5pdHkpICA9IEluZmluaXR5XHJcbiAqICBleHAoLUluZmluaXR5KSA9IDBcclxuICogIGV4cChOYU4pICAgICAgID0gTmFOXHJcbiAqICBleHAoXHUwMEIxMCkgICAgICAgID0gMVxyXG4gKlxyXG4gKiAgZXhwKHgpIGlzIG5vbi10ZXJtaW5hdGluZyBmb3IgYW55IGZpbml0ZSwgbm9uLXplcm8geC5cclxuICpcclxuICogIFRoZSByZXN1bHQgd2lsbCBhbHdheXMgYmUgY29ycmVjdGx5IHJvdW5kZWQuXHJcbiAqXHJcbiAqL1xyXG5mdW5jdGlvbiBuYXR1cmFsRXhwb25lbnRpYWwoeCwgc2QpIHtcclxuICB2YXIgZGVub21pbmF0b3IsIGd1YXJkLCBqLCBwb3csIHN1bSwgdCwgd3ByLFxyXG4gICAgcmVwID0gMCxcclxuICAgIGkgPSAwLFxyXG4gICAgayA9IDAsXHJcbiAgICBDdG9yID0geC5jb25zdHJ1Y3RvcixcclxuICAgIHJtID0gQ3Rvci5yb3VuZGluZyxcclxuICAgIHByID0gQ3Rvci5wcmVjaXNpb247XHJcblxyXG4gIC8vIDAvTmFOL0luZmluaXR5P1xyXG4gIGlmICgheC5kIHx8ICF4LmRbMF0gfHwgeC5lID4gMTcpIHtcclxuXHJcbiAgICByZXR1cm4gbmV3IEN0b3IoeC5kXHJcbiAgICAgID8gIXguZFswXSA/IDEgOiB4LnMgPCAwID8gMCA6IDEgLyAwXHJcbiAgICAgIDogeC5zID8geC5zIDwgMCA/IDAgOiB4IDogMCAvIDApO1xyXG4gIH1cclxuXHJcbiAgaWYgKHNkID09IG51bGwpIHtcclxuICAgIGV4dGVybmFsID0gZmFsc2U7XHJcbiAgICB3cHIgPSBwcjtcclxuICB9IGVsc2Uge1xyXG4gICAgd3ByID0gc2Q7XHJcbiAgfVxyXG5cclxuICB0ID0gbmV3IEN0b3IoMC4wMzEyNSk7XHJcblxyXG4gIC8vIHdoaWxlIGFicyh4KSA+PSAwLjFcclxuICB3aGlsZSAoeC5lID4gLTIpIHtcclxuXHJcbiAgICAvLyB4ID0geCAvIDJeNVxyXG4gICAgeCA9IHgudGltZXModCk7XHJcbiAgICBrICs9IDU7XHJcbiAgfVxyXG5cclxuICAvLyBVc2UgMiAqIGxvZzEwKDJeaykgKyA1IChlbXBpcmljYWxseSBkZXJpdmVkKSB0byBlc3RpbWF0ZSB0aGUgaW5jcmVhc2UgaW4gcHJlY2lzaW9uXHJcbiAgLy8gbmVjZXNzYXJ5IHRvIGVuc3VyZSB0aGUgZmlyc3QgNCByb3VuZGluZyBkaWdpdHMgYXJlIGNvcnJlY3QuXHJcbiAgZ3VhcmQgPSBNYXRoLmxvZyhtYXRocG93KDIsIGspKSAvIE1hdGguTE4xMCAqIDIgKyA1IHwgMDtcclxuICB3cHIgKz0gZ3VhcmQ7XHJcbiAgZGVub21pbmF0b3IgPSBwb3cgPSBzdW0gPSBuZXcgQ3RvcigxKTtcclxuICBDdG9yLnByZWNpc2lvbiA9IHdwcjtcclxuXHJcbiAgZm9yICg7Oykge1xyXG4gICAgcG93ID0gZmluYWxpc2UocG93LnRpbWVzKHgpLCB3cHIsIDEpO1xyXG4gICAgZGVub21pbmF0b3IgPSBkZW5vbWluYXRvci50aW1lcygrK2kpO1xyXG4gICAgdCA9IHN1bS5wbHVzKGRpdmlkZShwb3csIGRlbm9taW5hdG9yLCB3cHIsIDEpKTtcclxuXHJcbiAgICBpZiAoZGlnaXRzVG9TdHJpbmcodC5kKS5zbGljZSgwLCB3cHIpID09PSBkaWdpdHNUb1N0cmluZyhzdW0uZCkuc2xpY2UoMCwgd3ByKSkge1xyXG4gICAgICBqID0gaztcclxuICAgICAgd2hpbGUgKGotLSkgc3VtID0gZmluYWxpc2Uoc3VtLnRpbWVzKHN1bSksIHdwciwgMSk7XHJcblxyXG4gICAgICAvLyBDaGVjayB0byBzZWUgaWYgdGhlIGZpcnN0IDQgcm91bmRpbmcgZGlnaXRzIGFyZSBbNDldOTk5LlxyXG4gICAgICAvLyBJZiBzbywgcmVwZWF0IHRoZSBzdW1tYXRpb24gd2l0aCBhIGhpZ2hlciBwcmVjaXNpb24sIG90aGVyd2lzZVxyXG4gICAgICAvLyBlLmcuIHdpdGggcHJlY2lzaW9uOiAxOCwgcm91bmRpbmc6IDFcclxuICAgICAgLy8gZXhwKDE4LjQwNDI3MjQ2MjU5NTAzNDA4MzU2Nzc5MzkxOTg0Mzc2MSkgPSA5ODM3MjU2MC4xMjI5OTk5OTk5IChzaG91bGQgYmUgOTgzNzI1NjAuMTIzKVxyXG4gICAgICAvLyBgd3ByIC0gZ3VhcmRgIGlzIHRoZSBpbmRleCBvZiBmaXJzdCByb3VuZGluZyBkaWdpdC5cclxuICAgICAgaWYgKHNkID09IG51bGwpIHtcclxuXHJcbiAgICAgICAgaWYgKHJlcCA8IDMgJiYgY2hlY2tSb3VuZGluZ0RpZ2l0cyhzdW0uZCwgd3ByIC0gZ3VhcmQsIHJtLCByZXApKSB7XHJcbiAgICAgICAgICBDdG9yLnByZWNpc2lvbiA9IHdwciArPSAxMDtcclxuICAgICAgICAgIGRlbm9taW5hdG9yID0gcG93ID0gdCA9IG5ldyBDdG9yKDEpO1xyXG4gICAgICAgICAgaSA9IDA7XHJcbiAgICAgICAgICByZXArKztcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgcmV0dXJuIGZpbmFsaXNlKHN1bSwgQ3Rvci5wcmVjaXNpb24gPSBwciwgcm0sIGV4dGVybmFsID0gdHJ1ZSk7XHJcbiAgICAgICAgfVxyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIEN0b3IucHJlY2lzaW9uID0gcHI7XHJcbiAgICAgICAgcmV0dXJuIHN1bTtcclxuICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHN1bSA9IHQ7XHJcbiAgfVxyXG59XHJcblxyXG5cclxuLypcclxuICogUmV0dXJuIGEgbmV3IERlY2ltYWwgd2hvc2UgdmFsdWUgaXMgdGhlIG5hdHVyYWwgbG9nYXJpdGhtIG9mIGB4YCByb3VuZGVkIHRvIGBzZGAgc2lnbmlmaWNhbnRcclxuICogZGlnaXRzLlxyXG4gKlxyXG4gKiAgbG4oLW4pICAgICAgICA9IE5hTlxyXG4gKiAgbG4oMCkgICAgICAgICA9IC1JbmZpbml0eVxyXG4gKiAgbG4oLTApICAgICAgICA9IC1JbmZpbml0eVxyXG4gKiAgbG4oMSkgICAgICAgICA9IDBcclxuICogIGxuKEluZmluaXR5KSAgPSBJbmZpbml0eVxyXG4gKiAgbG4oLUluZmluaXR5KSA9IE5hTlxyXG4gKiAgbG4oTmFOKSAgICAgICA9IE5hTlxyXG4gKlxyXG4gKiAgbG4obikgKG4gIT0gMSkgaXMgbm9uLXRlcm1pbmF0aW5nLlxyXG4gKlxyXG4gKi9cclxuZnVuY3Rpb24gbmF0dXJhbExvZ2FyaXRobSh5LCBzZCkge1xyXG4gIHZhciBjLCBjMCwgZGVub21pbmF0b3IsIGUsIG51bWVyYXRvciwgcmVwLCBzdW0sIHQsIHdwciwgeDEsIHgyLFxyXG4gICAgbiA9IDEsXHJcbiAgICBndWFyZCA9IDEwLFxyXG4gICAgeCA9IHksXHJcbiAgICB4ZCA9IHguZCxcclxuICAgIEN0b3IgPSB4LmNvbnN0cnVjdG9yLFxyXG4gICAgcm0gPSBDdG9yLnJvdW5kaW5nLFxyXG4gICAgcHIgPSBDdG9yLnByZWNpc2lvbjtcclxuXHJcbiAgLy8gSXMgeCBuZWdhdGl2ZSBvciBJbmZpbml0eSwgTmFOLCAwIG9yIDE/XHJcbiAgaWYgKHgucyA8IDAgfHwgIXhkIHx8ICF4ZFswXSB8fCAheC5lICYmIHhkWzBdID09IDEgJiYgeGQubGVuZ3RoID09IDEpIHtcclxuICAgIHJldHVybiBuZXcgQ3Rvcih4ZCAmJiAheGRbMF0gPyAtMSAvIDAgOiB4LnMgIT0gMSA/IE5hTiA6IHhkID8gMCA6IHgpO1xyXG4gIH1cclxuXHJcbiAgaWYgKHNkID09IG51bGwpIHtcclxuICAgIGV4dGVybmFsID0gZmFsc2U7XHJcbiAgICB3cHIgPSBwcjtcclxuICB9IGVsc2Uge1xyXG4gICAgd3ByID0gc2Q7XHJcbiAgfVxyXG5cclxuICBDdG9yLnByZWNpc2lvbiA9IHdwciArPSBndWFyZDtcclxuICBjID0gZGlnaXRzVG9TdHJpbmcoeGQpO1xyXG4gIGMwID0gYy5jaGFyQXQoMCk7XHJcblxyXG4gIGlmIChNYXRoLmFicyhlID0geC5lKSA8IDEuNWUxNSkge1xyXG5cclxuICAgIC8vIEFyZ3VtZW50IHJlZHVjdGlvbi5cclxuICAgIC8vIFRoZSBzZXJpZXMgY29udmVyZ2VzIGZhc3RlciB0aGUgY2xvc2VyIHRoZSBhcmd1bWVudCBpcyB0byAxLCBzbyB1c2luZ1xyXG4gICAgLy8gbG4oYV5iKSA9IGIgKiBsbihhKSwgICBsbihhKSA9IGxuKGFeYikgLyBiXHJcbiAgICAvLyBtdWx0aXBseSB0aGUgYXJndW1lbnQgYnkgaXRzZWxmIHVudGlsIHRoZSBsZWFkaW5nIGRpZ2l0cyBvZiB0aGUgc2lnbmlmaWNhbmQgYXJlIDcsIDgsIDksXHJcbiAgICAvLyAxMCwgMTEsIDEyIG9yIDEzLCByZWNvcmRpbmcgdGhlIG51bWJlciBvZiBtdWx0aXBsaWNhdGlvbnMgc28gdGhlIHN1bSBvZiB0aGUgc2VyaWVzIGNhblxyXG4gICAgLy8gbGF0ZXIgYmUgZGl2aWRlZCBieSB0aGlzIG51bWJlciwgdGhlbiBzZXBhcmF0ZSBvdXQgdGhlIHBvd2VyIG9mIDEwIHVzaW5nXHJcbiAgICAvLyBsbihhKjEwXmIpID0gbG4oYSkgKyBiKmxuKDEwKS5cclxuXHJcbiAgICAvLyBtYXggbiBpcyAyMSAoZ2l2ZXMgMC45LCAxLjAgb3IgMS4xKSAoOWUxNSAvIDIxID0gNC4yZTE0KS5cclxuICAgIC8vd2hpbGUgKGMwIDwgOSAmJiBjMCAhPSAxIHx8IGMwID09IDEgJiYgYy5jaGFyQXQoMSkgPiAxKSB7XHJcbiAgICAvLyBtYXggbiBpcyA2IChnaXZlcyAwLjcgLSAxLjMpXHJcbiAgICB3aGlsZSAoYzAgPCA3ICYmIGMwICE9IDEgfHwgYzAgPT0gMSAmJiBjLmNoYXJBdCgxKSA+IDMpIHtcclxuICAgICAgeCA9IHgudGltZXMoeSk7XHJcbiAgICAgIGMgPSBkaWdpdHNUb1N0cmluZyh4LmQpO1xyXG4gICAgICBjMCA9IGMuY2hhckF0KDApO1xyXG4gICAgICBuKys7XHJcbiAgICB9XHJcblxyXG4gICAgZSA9IHguZTtcclxuXHJcbiAgICBpZiAoYzAgPiAxKSB7XHJcbiAgICAgIHggPSBuZXcgQ3RvcignMC4nICsgYyk7XHJcbiAgICAgIGUrKztcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIHggPSBuZXcgQ3RvcihjMCArICcuJyArIGMuc2xpY2UoMSkpO1xyXG4gICAgfVxyXG4gIH0gZWxzZSB7XHJcblxyXG4gICAgLy8gVGhlIGFyZ3VtZW50IHJlZHVjdGlvbiBtZXRob2QgYWJvdmUgbWF5IHJlc3VsdCBpbiBvdmVyZmxvdyBpZiB0aGUgYXJndW1lbnQgeSBpcyBhIG1hc3NpdmVcclxuICAgIC8vIG51bWJlciB3aXRoIGV4cG9uZW50ID49IDE1MDAwMDAwMDAwMDAwMDAgKDllMTUgLyA2ID0gMS41ZTE1KSwgc28gaW5zdGVhZCByZWNhbGwgdGhpc1xyXG4gICAgLy8gZnVuY3Rpb24gdXNpbmcgbG4oeCoxMF5lKSA9IGxuKHgpICsgZSpsbigxMCkuXHJcbiAgICB0ID0gZ2V0TG4xMChDdG9yLCB3cHIgKyAyLCBwcikudGltZXMoZSArICcnKTtcclxuICAgIHggPSBuYXR1cmFsTG9nYXJpdGhtKG5ldyBDdG9yKGMwICsgJy4nICsgYy5zbGljZSgxKSksIHdwciAtIGd1YXJkKS5wbHVzKHQpO1xyXG4gICAgQ3Rvci5wcmVjaXNpb24gPSBwcjtcclxuXHJcbiAgICByZXR1cm4gc2QgPT0gbnVsbCA/IGZpbmFsaXNlKHgsIHByLCBybSwgZXh0ZXJuYWwgPSB0cnVlKSA6IHg7XHJcbiAgfVxyXG5cclxuICAvLyB4MSBpcyB4IHJlZHVjZWQgdG8gYSB2YWx1ZSBuZWFyIDEuXHJcbiAgeDEgPSB4O1xyXG5cclxuICAvLyBUYXlsb3Igc2VyaWVzLlxyXG4gIC8vIGxuKHkpID0gbG4oKDEgKyB4KS8oMSAtIHgpKSA9IDIoeCArIHheMy8zICsgeF41LzUgKyB4XjcvNyArIC4uLilcclxuICAvLyB3aGVyZSB4ID0gKHkgLSAxKS8oeSArIDEpICAgICh8eHwgPCAxKVxyXG4gIHN1bSA9IG51bWVyYXRvciA9IHggPSBkaXZpZGUoeC5taW51cygxKSwgeC5wbHVzKDEpLCB3cHIsIDEpO1xyXG4gIHgyID0gZmluYWxpc2UoeC50aW1lcyh4KSwgd3ByLCAxKTtcclxuICBkZW5vbWluYXRvciA9IDM7XHJcblxyXG4gIGZvciAoOzspIHtcclxuICAgIG51bWVyYXRvciA9IGZpbmFsaXNlKG51bWVyYXRvci50aW1lcyh4MiksIHdwciwgMSk7XHJcbiAgICB0ID0gc3VtLnBsdXMoZGl2aWRlKG51bWVyYXRvciwgbmV3IEN0b3IoZGVub21pbmF0b3IpLCB3cHIsIDEpKTtcclxuXHJcbiAgICBpZiAoZGlnaXRzVG9TdHJpbmcodC5kKS5zbGljZSgwLCB3cHIpID09PSBkaWdpdHNUb1N0cmluZyhzdW0uZCkuc2xpY2UoMCwgd3ByKSkge1xyXG4gICAgICBzdW0gPSBzdW0udGltZXMoMik7XHJcblxyXG4gICAgICAvLyBSZXZlcnNlIHRoZSBhcmd1bWVudCByZWR1Y3Rpb24uIENoZWNrIHRoYXQgZSBpcyBub3QgMCBiZWNhdXNlLCBiZXNpZGVzIHByZXZlbnRpbmcgYW5cclxuICAgICAgLy8gdW5uZWNlc3NhcnkgY2FsY3VsYXRpb24sIC0wICsgMCA9ICswIGFuZCB0byBlbnN1cmUgY29ycmVjdCByb3VuZGluZyAtMCBuZWVkcyB0byBzdGF5IC0wLlxyXG4gICAgICBpZiAoZSAhPT0gMCkgc3VtID0gc3VtLnBsdXMoZ2V0TG4xMChDdG9yLCB3cHIgKyAyLCBwcikudGltZXMoZSArICcnKSk7XHJcbiAgICAgIHN1bSA9IGRpdmlkZShzdW0sIG5ldyBDdG9yKG4pLCB3cHIsIDEpO1xyXG5cclxuICAgICAgLy8gSXMgcm0gPiAzIGFuZCB0aGUgZmlyc3QgNCByb3VuZGluZyBkaWdpdHMgNDk5OSwgb3Igcm0gPCA0IChvciB0aGUgc3VtbWF0aW9uIGhhc1xyXG4gICAgICAvLyBiZWVuIHJlcGVhdGVkIHByZXZpb3VzbHkpIGFuZCB0aGUgZmlyc3QgNCByb3VuZGluZyBkaWdpdHMgOTk5OT9cclxuICAgICAgLy8gSWYgc28sIHJlc3RhcnQgdGhlIHN1bW1hdGlvbiB3aXRoIGEgaGlnaGVyIHByZWNpc2lvbiwgb3RoZXJ3aXNlXHJcbiAgICAgIC8vIGUuZy4gd2l0aCBwcmVjaXNpb246IDEyLCByb3VuZGluZzogMVxyXG4gICAgICAvLyBsbigxMzU1MjAwMjguNjEyNjA5MTcxNDI2NTM4MTUzMykgPSAxOC43MjQ2Mjk5OTk5IHdoZW4gaXQgc2hvdWxkIGJlIDE4LjcyNDYzLlxyXG4gICAgICAvLyBgd3ByIC0gZ3VhcmRgIGlzIHRoZSBpbmRleCBvZiBmaXJzdCByb3VuZGluZyBkaWdpdC5cclxuICAgICAgaWYgKHNkID09IG51bGwpIHtcclxuICAgICAgICBpZiAoY2hlY2tSb3VuZGluZ0RpZ2l0cyhzdW0uZCwgd3ByIC0gZ3VhcmQsIHJtLCByZXApKSB7XHJcbiAgICAgICAgICBDdG9yLnByZWNpc2lvbiA9IHdwciArPSBndWFyZDtcclxuICAgICAgICAgIHQgPSBudW1lcmF0b3IgPSB4ID0gZGl2aWRlKHgxLm1pbnVzKDEpLCB4MS5wbHVzKDEpLCB3cHIsIDEpO1xyXG4gICAgICAgICAgeDIgPSBmaW5hbGlzZSh4LnRpbWVzKHgpLCB3cHIsIDEpO1xyXG4gICAgICAgICAgZGVub21pbmF0b3IgPSByZXAgPSAxO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICByZXR1cm4gZmluYWxpc2Uoc3VtLCBDdG9yLnByZWNpc2lvbiA9IHByLCBybSwgZXh0ZXJuYWwgPSB0cnVlKTtcclxuICAgICAgICB9XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgQ3Rvci5wcmVjaXNpb24gPSBwcjtcclxuICAgICAgICByZXR1cm4gc3VtO1xyXG4gICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgc3VtID0gdDtcclxuICAgIGRlbm9taW5hdG9yICs9IDI7XHJcbiAgfVxyXG59XHJcblxyXG5cclxuLy8gXHUwMEIxSW5maW5pdHksIE5hTi5cclxuZnVuY3Rpb24gbm9uRmluaXRlVG9TdHJpbmcoeCkge1xyXG4gIC8vIFVuc2lnbmVkLlxyXG4gIHJldHVybiBTdHJpbmcoeC5zICogeC5zIC8gMCk7XHJcbn1cclxuXHJcblxyXG4vKlxyXG4gKiBQYXJzZSB0aGUgdmFsdWUgb2YgYSBuZXcgRGVjaW1hbCBgeGAgZnJvbSBzdHJpbmcgYHN0cmAuXHJcbiAqL1xyXG5mdW5jdGlvbiBwYXJzZURlY2ltYWwoeCwgc3RyKSB7XHJcbiAgdmFyIGUsIGksIGxlbjtcclxuXHJcbiAgLy8gRGVjaW1hbCBwb2ludD9cclxuICBpZiAoKGUgPSBzdHIuaW5kZXhPZignLicpKSA+IC0xKSBzdHIgPSBzdHIucmVwbGFjZSgnLicsICcnKTtcclxuXHJcbiAgLy8gRXhwb25lbnRpYWwgZm9ybT9cclxuICBpZiAoKGkgPSBzdHIuc2VhcmNoKC9lL2kpKSA+IDApIHtcclxuXHJcbiAgICAvLyBEZXRlcm1pbmUgZXhwb25lbnQuXHJcbiAgICBpZiAoZSA8IDApIGUgPSBpO1xyXG4gICAgZSArPSArc3RyLnNsaWNlKGkgKyAxKTtcclxuICAgIHN0ciA9IHN0ci5zdWJzdHJpbmcoMCwgaSk7XHJcbiAgfSBlbHNlIGlmIChlIDwgMCkge1xyXG5cclxuICAgIC8vIEludGVnZXIuXHJcbiAgICBlID0gc3RyLmxlbmd0aDtcclxuICB9XHJcblxyXG4gIC8vIERldGVybWluZSBsZWFkaW5nIHplcm9zLlxyXG4gIGZvciAoaSA9IDA7IHN0ci5jaGFyQ29kZUF0KGkpID09PSA0ODsgaSsrKTtcclxuXHJcbiAgLy8gRGV0ZXJtaW5lIHRyYWlsaW5nIHplcm9zLlxyXG4gIGZvciAobGVuID0gc3RyLmxlbmd0aDsgc3RyLmNoYXJDb2RlQXQobGVuIC0gMSkgPT09IDQ4OyAtLWxlbik7XHJcbiAgc3RyID0gc3RyLnNsaWNlKGksIGxlbik7XHJcblxyXG4gIGlmIChzdHIpIHtcclxuICAgIGxlbiAtPSBpO1xyXG4gICAgeC5lID0gZSA9IGUgLSBpIC0gMTtcclxuICAgIHguZCA9IFtdO1xyXG5cclxuICAgIC8vIFRyYW5zZm9ybSBiYXNlXHJcblxyXG4gICAgLy8gZSBpcyB0aGUgYmFzZSAxMCBleHBvbmVudC5cclxuICAgIC8vIGkgaXMgd2hlcmUgdG8gc2xpY2Ugc3RyIHRvIGdldCB0aGUgZmlyc3Qgd29yZCBvZiB0aGUgZGlnaXRzIGFycmF5LlxyXG4gICAgaSA9IChlICsgMSkgJSBMT0dfQkFTRTtcclxuICAgIGlmIChlIDwgMCkgaSArPSBMT0dfQkFTRTtcclxuXHJcbiAgICBpZiAoaSA8IGxlbikge1xyXG4gICAgICBpZiAoaSkgeC5kLnB1c2goK3N0ci5zbGljZSgwLCBpKSk7XHJcbiAgICAgIGZvciAobGVuIC09IExPR19CQVNFOyBpIDwgbGVuOykgeC5kLnB1c2goK3N0ci5zbGljZShpLCBpICs9IExPR19CQVNFKSk7XHJcbiAgICAgIHN0ciA9IHN0ci5zbGljZShpKTtcclxuICAgICAgaSA9IExPR19CQVNFIC0gc3RyLmxlbmd0aDtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIGkgLT0gbGVuO1xyXG4gICAgfVxyXG5cclxuICAgIGZvciAoOyBpLS07KSBzdHIgKz0gJzAnO1xyXG4gICAgeC5kLnB1c2goK3N0cik7XHJcblxyXG4gICAgaWYgKGV4dGVybmFsKSB7XHJcblxyXG4gICAgICAvLyBPdmVyZmxvdz9cclxuICAgICAgaWYgKHguZSA+IHguY29uc3RydWN0b3IubWF4RSkge1xyXG5cclxuICAgICAgICAvLyBJbmZpbml0eS5cclxuICAgICAgICB4LmQgPSBudWxsO1xyXG4gICAgICAgIHguZSA9IE5hTjtcclxuXHJcbiAgICAgIC8vIFVuZGVyZmxvdz9cclxuICAgICAgfSBlbHNlIGlmICh4LmUgPCB4LmNvbnN0cnVjdG9yLm1pbkUpIHtcclxuXHJcbiAgICAgICAgLy8gWmVyby5cclxuICAgICAgICB4LmUgPSAwO1xyXG4gICAgICAgIHguZCA9IFswXTtcclxuICAgICAgICAvLyB4LmNvbnN0cnVjdG9yLnVuZGVyZmxvdyA9IHRydWU7XHJcbiAgICAgIH0gLy8gZWxzZSB4LmNvbnN0cnVjdG9yLnVuZGVyZmxvdyA9IGZhbHNlO1xyXG4gICAgfVxyXG4gIH0gZWxzZSB7XHJcblxyXG4gICAgLy8gWmVyby5cclxuICAgIHguZSA9IDA7XHJcbiAgICB4LmQgPSBbMF07XHJcbiAgfVxyXG5cclxuICByZXR1cm4geDtcclxufVxyXG5cclxuXHJcbi8qXHJcbiAqIFBhcnNlIHRoZSB2YWx1ZSBvZiBhIG5ldyBEZWNpbWFsIGB4YCBmcm9tIGEgc3RyaW5nIGBzdHJgLCB3aGljaCBpcyBub3QgYSBkZWNpbWFsIHZhbHVlLlxyXG4gKi9cclxuZnVuY3Rpb24gcGFyc2VPdGhlcih4LCBzdHIpIHtcclxuICB2YXIgYmFzZSwgQ3RvciwgZGl2aXNvciwgaSwgaXNGbG9hdCwgbGVuLCBwLCB4ZCwgeGU7XHJcblxyXG4gIGlmIChzdHIuaW5kZXhPZignXycpID4gLTEpIHtcclxuICAgIHN0ciA9IHN0ci5yZXBsYWNlKC8oXFxkKV8oPz1cXGQpL2csICckMScpO1xyXG4gICAgaWYgKGlzRGVjaW1hbC50ZXN0KHN0cikpIHJldHVybiBwYXJzZURlY2ltYWwoeCwgc3RyKTtcclxuICB9IGVsc2UgaWYgKHN0ciA9PT0gJ0luZmluaXR5JyB8fCBzdHIgPT09ICdOYU4nKSB7XHJcbiAgICBpZiAoIStzdHIpIHgucyA9IE5hTjtcclxuICAgIHguZSA9IE5hTjtcclxuICAgIHguZCA9IG51bGw7XHJcbiAgICByZXR1cm4geDtcclxuICB9XHJcblxyXG4gIGlmIChpc0hleC50ZXN0KHN0cikpICB7XHJcbiAgICBiYXNlID0gMTY7XHJcbiAgICBzdHIgPSBzdHIudG9Mb3dlckNhc2UoKTtcclxuICB9IGVsc2UgaWYgKGlzQmluYXJ5LnRlc3Qoc3RyKSkgIHtcclxuICAgIGJhc2UgPSAyO1xyXG4gIH0gZWxzZSBpZiAoaXNPY3RhbC50ZXN0KHN0cikpICB7XHJcbiAgICBiYXNlID0gODtcclxuICB9IGVsc2Uge1xyXG4gICAgdGhyb3cgRXJyb3IoaW52YWxpZEFyZ3VtZW50ICsgc3RyKTtcclxuICB9XHJcblxyXG4gIC8vIElzIHRoZXJlIGEgYmluYXJ5IGV4cG9uZW50IHBhcnQ/XHJcbiAgaSA9IHN0ci5zZWFyY2goL3AvaSk7XHJcblxyXG4gIGlmIChpID4gMCkge1xyXG4gICAgcCA9ICtzdHIuc2xpY2UoaSArIDEpO1xyXG4gICAgc3RyID0gc3RyLnN1YnN0cmluZygyLCBpKTtcclxuICB9IGVsc2Uge1xyXG4gICAgc3RyID0gc3RyLnNsaWNlKDIpO1xyXG4gIH1cclxuXHJcbiAgLy8gQ29udmVydCBgc3RyYCBhcyBhbiBpbnRlZ2VyIHRoZW4gZGl2aWRlIHRoZSByZXN1bHQgYnkgYGJhc2VgIHJhaXNlZCB0byBhIHBvd2VyIHN1Y2ggdGhhdCB0aGVcclxuICAvLyBmcmFjdGlvbiBwYXJ0IHdpbGwgYmUgcmVzdG9yZWQuXHJcbiAgaSA9IHN0ci5pbmRleE9mKCcuJyk7XHJcbiAgaXNGbG9hdCA9IGkgPj0gMDtcclxuICBDdG9yID0geC5jb25zdHJ1Y3RvcjtcclxuXHJcbiAgaWYgKGlzRmxvYXQpIHtcclxuICAgIHN0ciA9IHN0ci5yZXBsYWNlKCcuJywgJycpO1xyXG4gICAgbGVuID0gc3RyLmxlbmd0aDtcclxuICAgIGkgPSBsZW4gLSBpO1xyXG5cclxuICAgIC8vIGxvZ1sxMF0oMTYpID0gMS4yMDQxLi4uICwgbG9nWzEwXSg4OCkgPSAxLjk0NDQuLi4uXHJcbiAgICBkaXZpc29yID0gaW50UG93KEN0b3IsIG5ldyBDdG9yKGJhc2UpLCBpLCBpICogMik7XHJcbiAgfVxyXG5cclxuICB4ZCA9IGNvbnZlcnRCYXNlKHN0ciwgYmFzZSwgQkFTRSk7XHJcbiAgeGUgPSB4ZC5sZW5ndGggLSAxO1xyXG5cclxuICAvLyBSZW1vdmUgdHJhaWxpbmcgemVyb3MuXHJcbiAgZm9yIChpID0geGU7IHhkW2ldID09PSAwOyAtLWkpIHhkLnBvcCgpO1xyXG4gIGlmIChpIDwgMCkgcmV0dXJuIG5ldyBDdG9yKHgucyAqIDApO1xyXG4gIHguZSA9IGdldEJhc2UxMEV4cG9uZW50KHhkLCB4ZSk7XHJcbiAgeC5kID0geGQ7XHJcbiAgZXh0ZXJuYWwgPSBmYWxzZTtcclxuXHJcbiAgLy8gQXQgd2hhdCBwcmVjaXNpb24gdG8gcGVyZm9ybSB0aGUgZGl2aXNpb24gdG8gZW5zdXJlIGV4YWN0IGNvbnZlcnNpb24/XHJcbiAgLy8gbWF4RGVjaW1hbEludGVnZXJQYXJ0RGlnaXRDb3VudCA9IGNlaWwobG9nWzEwXShiKSAqIG90aGVyQmFzZUludGVnZXJQYXJ0RGlnaXRDb3VudClcclxuICAvLyBsb2dbMTBdKDIpID0gMC4zMDEwMywgbG9nWzEwXSg4KSA9IDAuOTAzMDksIGxvZ1sxMF0oMTYpID0gMS4yMDQxMlxyXG4gIC8vIEUuZy4gY2VpbCgxLjIgKiAzKSA9IDQsIHNvIHVwIHRvIDQgZGVjaW1hbCBkaWdpdHMgYXJlIG5lZWRlZCB0byByZXByZXNlbnQgMyBoZXggaW50IGRpZ2l0cy5cclxuICAvLyBtYXhEZWNpbWFsRnJhY3Rpb25QYXJ0RGlnaXRDb3VudCA9IHtIZXg6NHxPY3Q6M3xCaW46MX0gKiBvdGhlckJhc2VGcmFjdGlvblBhcnREaWdpdENvdW50XHJcbiAgLy8gVGhlcmVmb3JlIHVzaW5nIDQgKiB0aGUgbnVtYmVyIG9mIGRpZ2l0cyBvZiBzdHIgd2lsbCBhbHdheXMgYmUgZW5vdWdoLlxyXG4gIGlmIChpc0Zsb2F0KSB4ID0gZGl2aWRlKHgsIGRpdmlzb3IsIGxlbiAqIDQpO1xyXG5cclxuICAvLyBNdWx0aXBseSBieSB0aGUgYmluYXJ5IGV4cG9uZW50IHBhcnQgaWYgcHJlc2VudC5cclxuICBpZiAocCkgeCA9IHgudGltZXMoTWF0aC5hYnMocCkgPCA1NCA/IG1hdGhwb3coMiwgcCkgOiBEZWNpbWFsLnBvdygyLCBwKSk7XHJcbiAgZXh0ZXJuYWwgPSB0cnVlO1xyXG5cclxuICByZXR1cm4geDtcclxufVxyXG5cclxuXHJcbi8qXHJcbiAqIHNpbih4KSA9IHggLSB4XjMvMyEgKyB4XjUvNSEgLSAuLi5cclxuICogfHh8IDwgcGkvMlxyXG4gKlxyXG4gKi9cclxuZnVuY3Rpb24gc2luZShDdG9yLCB4KSB7XHJcbiAgdmFyIGssXHJcbiAgICBsZW4gPSB4LmQubGVuZ3RoO1xyXG5cclxuICBpZiAobGVuIDwgMykge1xyXG4gICAgcmV0dXJuIHguaXNaZXJvKCkgPyB4IDogdGF5bG9yU2VyaWVzKEN0b3IsIDIsIHgsIHgpO1xyXG4gIH1cclxuXHJcbiAgLy8gQXJndW1lbnQgcmVkdWN0aW9uOiBzaW4oNXgpID0gMTYqc2luXjUoeCkgLSAyMCpzaW5eMyh4KSArIDUqc2luKHgpXHJcbiAgLy8gaS5lLiBzaW4oeCkgPSAxNipzaW5eNSh4LzUpIC0gMjAqc2luXjMoeC81KSArIDUqc2luKHgvNSlcclxuICAvLyBhbmQgIHNpbih4KSA9IHNpbih4LzUpKDUgKyBzaW5eMih4LzUpKDE2c2luXjIoeC81KSAtIDIwKSlcclxuXHJcbiAgLy8gRXN0aW1hdGUgdGhlIG9wdGltdW0gbnVtYmVyIG9mIHRpbWVzIHRvIHVzZSB0aGUgYXJndW1lbnQgcmVkdWN0aW9uLlxyXG4gIGsgPSAxLjQgKiBNYXRoLnNxcnQobGVuKTtcclxuICBrID0gayA+IDE2ID8gMTYgOiBrIHwgMDtcclxuXHJcbiAgeCA9IHgudGltZXMoMSAvIHRpbnlQb3coNSwgaykpO1xyXG4gIHggPSB0YXlsb3JTZXJpZXMoQ3RvciwgMiwgeCwgeCk7XHJcblxyXG4gIC8vIFJldmVyc2UgYXJndW1lbnQgcmVkdWN0aW9uXHJcbiAgdmFyIHNpbjJfeCxcclxuICAgIGQ1ID0gbmV3IEN0b3IoNSksXHJcbiAgICBkMTYgPSBuZXcgQ3RvcigxNiksXHJcbiAgICBkMjAgPSBuZXcgQ3RvcigyMCk7XHJcbiAgZm9yICg7IGstLTspIHtcclxuICAgIHNpbjJfeCA9IHgudGltZXMoeCk7XHJcbiAgICB4ID0geC50aW1lcyhkNS5wbHVzKHNpbjJfeC50aW1lcyhkMTYudGltZXMoc2luMl94KS5taW51cyhkMjApKSkpO1xyXG4gIH1cclxuXHJcbiAgcmV0dXJuIHg7XHJcbn1cclxuXHJcblxyXG4vLyBDYWxjdWxhdGUgVGF5bG9yIHNlcmllcyBmb3IgYGNvc2AsIGBjb3NoYCwgYHNpbmAgYW5kIGBzaW5oYC5cclxuZnVuY3Rpb24gdGF5bG9yU2VyaWVzKEN0b3IsIG4sIHgsIHksIGlzSHlwZXJib2xpYykge1xyXG4gIHZhciBqLCB0LCB1LCB4MixcclxuICAgIGkgPSAxLFxyXG4gICAgcHIgPSBDdG9yLnByZWNpc2lvbixcclxuICAgIGsgPSBNYXRoLmNlaWwocHIgLyBMT0dfQkFTRSk7XHJcblxyXG4gIGV4dGVybmFsID0gZmFsc2U7XHJcbiAgeDIgPSB4LnRpbWVzKHgpO1xyXG4gIHUgPSBuZXcgQ3Rvcih5KTtcclxuXHJcbiAgZm9yICg7Oykge1xyXG4gICAgdCA9IGRpdmlkZSh1LnRpbWVzKHgyKSwgbmV3IEN0b3IobisrICogbisrKSwgcHIsIDEpO1xyXG4gICAgdSA9IGlzSHlwZXJib2xpYyA/IHkucGx1cyh0KSA6IHkubWludXModCk7XHJcbiAgICB5ID0gZGl2aWRlKHQudGltZXMoeDIpLCBuZXcgQ3RvcihuKysgKiBuKyspLCBwciwgMSk7XHJcbiAgICB0ID0gdS5wbHVzKHkpO1xyXG5cclxuICAgIGlmICh0LmRba10gIT09IHZvaWQgMCkge1xyXG4gICAgICBmb3IgKGogPSBrOyB0LmRbal0gPT09IHUuZFtqXSAmJiBqLS07KTtcclxuICAgICAgaWYgKGogPT0gLTEpIGJyZWFrO1xyXG4gICAgfVxyXG5cclxuICAgIGogPSB1O1xyXG4gICAgdSA9IHk7XHJcbiAgICB5ID0gdDtcclxuICAgIHQgPSBqO1xyXG4gICAgaSsrO1xyXG4gIH1cclxuXHJcbiAgZXh0ZXJuYWwgPSB0cnVlO1xyXG4gIHQuZC5sZW5ndGggPSBrICsgMTtcclxuXHJcbiAgcmV0dXJuIHQ7XHJcbn1cclxuXHJcblxyXG4vLyBFeHBvbmVudCBlIG11c3QgYmUgcG9zaXRpdmUgYW5kIG5vbi16ZXJvLlxyXG5mdW5jdGlvbiB0aW55UG93KGIsIGUpIHtcclxuICB2YXIgbiA9IGI7XHJcbiAgd2hpbGUgKC0tZSkgbiAqPSBiO1xyXG4gIHJldHVybiBuO1xyXG59XHJcblxyXG5cclxuLy8gUmV0dXJuIHRoZSBhYnNvbHV0ZSB2YWx1ZSBvZiBgeGAgcmVkdWNlZCB0byBsZXNzIHRoYW4gb3IgZXF1YWwgdG8gaGFsZiBwaS5cclxuZnVuY3Rpb24gdG9MZXNzVGhhbkhhbGZQaShDdG9yLCB4KSB7XHJcbiAgdmFyIHQsXHJcbiAgICBpc05lZyA9IHgucyA8IDAsXHJcbiAgICBwaSA9IGdldFBpKEN0b3IsIEN0b3IucHJlY2lzaW9uLCAxKSxcclxuICAgIGhhbGZQaSA9IHBpLnRpbWVzKDAuNSk7XHJcblxyXG4gIHggPSB4LmFicygpO1xyXG5cclxuICBpZiAoeC5sdGUoaGFsZlBpKSkge1xyXG4gICAgcXVhZHJhbnQgPSBpc05lZyA/IDQgOiAxO1xyXG4gICAgcmV0dXJuIHg7XHJcbiAgfVxyXG5cclxuICB0ID0geC5kaXZUb0ludChwaSk7XHJcblxyXG4gIGlmICh0LmlzWmVybygpKSB7XHJcbiAgICBxdWFkcmFudCA9IGlzTmVnID8gMyA6IDI7XHJcbiAgfSBlbHNlIHtcclxuICAgIHggPSB4Lm1pbnVzKHQudGltZXMocGkpKTtcclxuXHJcbiAgICAvLyAwIDw9IHggPCBwaVxyXG4gICAgaWYgKHgubHRlKGhhbGZQaSkpIHtcclxuICAgICAgcXVhZHJhbnQgPSBpc09kZCh0KSA/IChpc05lZyA/IDIgOiAzKSA6IChpc05lZyA/IDQgOiAxKTtcclxuICAgICAgcmV0dXJuIHg7XHJcbiAgICB9XHJcblxyXG4gICAgcXVhZHJhbnQgPSBpc09kZCh0KSA/IChpc05lZyA/IDEgOiA0KSA6IChpc05lZyA/IDMgOiAyKTtcclxuICB9XHJcblxyXG4gIHJldHVybiB4Lm1pbnVzKHBpKS5hYnMoKTtcclxufVxyXG5cclxuXHJcbi8qXHJcbiAqIFJldHVybiB0aGUgdmFsdWUgb2YgRGVjaW1hbCBgeGAgYXMgYSBzdHJpbmcgaW4gYmFzZSBgYmFzZU91dGAuXHJcbiAqXHJcbiAqIElmIHRoZSBvcHRpb25hbCBgc2RgIGFyZ3VtZW50IGlzIHByZXNlbnQgaW5jbHVkZSBhIGJpbmFyeSBleHBvbmVudCBzdWZmaXguXHJcbiAqL1xyXG5mdW5jdGlvbiB0b1N0cmluZ0JpbmFyeSh4LCBiYXNlT3V0LCBzZCwgcm0pIHtcclxuICB2YXIgYmFzZSwgZSwgaSwgaywgbGVuLCByb3VuZFVwLCBzdHIsIHhkLCB5LFxyXG4gICAgQ3RvciA9IHguY29uc3RydWN0b3IsXHJcbiAgICBpc0V4cCA9IHNkICE9PSB2b2lkIDA7XHJcblxyXG4gIGlmIChpc0V4cCkge1xyXG4gICAgY2hlY2tJbnQzMihzZCwgMSwgTUFYX0RJR0lUUyk7XHJcbiAgICBpZiAocm0gPT09IHZvaWQgMCkgcm0gPSBDdG9yLnJvdW5kaW5nO1xyXG4gICAgZWxzZSBjaGVja0ludDMyKHJtLCAwLCA4KTtcclxuICB9IGVsc2Uge1xyXG4gICAgc2QgPSBDdG9yLnByZWNpc2lvbjtcclxuICAgIHJtID0gQ3Rvci5yb3VuZGluZztcclxuICB9XHJcblxyXG4gIGlmICgheC5pc0Zpbml0ZSgpKSB7XHJcbiAgICBzdHIgPSBub25GaW5pdGVUb1N0cmluZyh4KTtcclxuICB9IGVsc2Uge1xyXG4gICAgc3RyID0gZmluaXRlVG9TdHJpbmcoeCk7XHJcbiAgICBpID0gc3RyLmluZGV4T2YoJy4nKTtcclxuXHJcbiAgICAvLyBVc2UgZXhwb25lbnRpYWwgbm90YXRpb24gYWNjb3JkaW5nIHRvIGB0b0V4cFBvc2AgYW5kIGB0b0V4cE5lZ2A/IE5vLCBidXQgaWYgcmVxdWlyZWQ6XHJcbiAgICAvLyBtYXhCaW5hcnlFeHBvbmVudCA9IGZsb29yKChkZWNpbWFsRXhwb25lbnQgKyAxKSAqIGxvZ1syXSgxMCkpXHJcbiAgICAvLyBtaW5CaW5hcnlFeHBvbmVudCA9IGZsb29yKGRlY2ltYWxFeHBvbmVudCAqIGxvZ1syXSgxMCkpXHJcbiAgICAvLyBsb2dbMl0oMTApID0gMy4zMjE5MjgwOTQ4ODczNjIzNDc4NzAzMTk0Mjk0ODkzOTAxNzU4NjRcclxuXHJcbiAgICBpZiAoaXNFeHApIHtcclxuICAgICAgYmFzZSA9IDI7XHJcbiAgICAgIGlmIChiYXNlT3V0ID09IDE2KSB7XHJcbiAgICAgICAgc2QgPSBzZCAqIDQgLSAzO1xyXG4gICAgICB9IGVsc2UgaWYgKGJhc2VPdXQgPT0gOCkge1xyXG4gICAgICAgIHNkID0gc2QgKiAzIC0gMjtcclxuICAgICAgfVxyXG4gICAgfSBlbHNlIHtcclxuICAgICAgYmFzZSA9IGJhc2VPdXQ7XHJcbiAgICB9XHJcblxyXG4gICAgLy8gQ29udmVydCB0aGUgbnVtYmVyIGFzIGFuIGludGVnZXIgdGhlbiBkaXZpZGUgdGhlIHJlc3VsdCBieSBpdHMgYmFzZSByYWlzZWQgdG8gYSBwb3dlciBzdWNoXHJcbiAgICAvLyB0aGF0IHRoZSBmcmFjdGlvbiBwYXJ0IHdpbGwgYmUgcmVzdG9yZWQuXHJcblxyXG4gICAgLy8gTm9uLWludGVnZXIuXHJcbiAgICBpZiAoaSA+PSAwKSB7XHJcbiAgICAgIHN0ciA9IHN0ci5yZXBsYWNlKCcuJywgJycpO1xyXG4gICAgICB5ID0gbmV3IEN0b3IoMSk7XHJcbiAgICAgIHkuZSA9IHN0ci5sZW5ndGggLSBpO1xyXG4gICAgICB5LmQgPSBjb252ZXJ0QmFzZShmaW5pdGVUb1N0cmluZyh5KSwgMTAsIGJhc2UpO1xyXG4gICAgICB5LmUgPSB5LmQubGVuZ3RoO1xyXG4gICAgfVxyXG5cclxuICAgIHhkID0gY29udmVydEJhc2Uoc3RyLCAxMCwgYmFzZSk7XHJcbiAgICBlID0gbGVuID0geGQubGVuZ3RoO1xyXG5cclxuICAgIC8vIFJlbW92ZSB0cmFpbGluZyB6ZXJvcy5cclxuICAgIGZvciAoOyB4ZFstLWxlbl0gPT0gMDspIHhkLnBvcCgpO1xyXG5cclxuICAgIGlmICgheGRbMF0pIHtcclxuICAgICAgc3RyID0gaXNFeHAgPyAnMHArMCcgOiAnMCc7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICBpZiAoaSA8IDApIHtcclxuICAgICAgICBlLS07XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgeCA9IG5ldyBDdG9yKHgpO1xyXG4gICAgICAgIHguZCA9IHhkO1xyXG4gICAgICAgIHguZSA9IGU7XHJcbiAgICAgICAgeCA9IGRpdmlkZSh4LCB5LCBzZCwgcm0sIDAsIGJhc2UpO1xyXG4gICAgICAgIHhkID0geC5kO1xyXG4gICAgICAgIGUgPSB4LmU7XHJcbiAgICAgICAgcm91bmRVcCA9IGluZXhhY3Q7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIC8vIFRoZSByb3VuZGluZyBkaWdpdCwgaS5lLiB0aGUgZGlnaXQgYWZ0ZXIgdGhlIGRpZ2l0IHRoYXQgbWF5IGJlIHJvdW5kZWQgdXAuXHJcbiAgICAgIGkgPSB4ZFtzZF07XHJcbiAgICAgIGsgPSBiYXNlIC8gMjtcclxuICAgICAgcm91bmRVcCA9IHJvdW5kVXAgfHwgeGRbc2QgKyAxXSAhPT0gdm9pZCAwO1xyXG5cclxuICAgICAgcm91bmRVcCA9IHJtIDwgNFxyXG4gICAgICAgID8gKGkgIT09IHZvaWQgMCB8fCByb3VuZFVwKSAmJiAocm0gPT09IDAgfHwgcm0gPT09ICh4LnMgPCAwID8gMyA6IDIpKVxyXG4gICAgICAgIDogaSA+IGsgfHwgaSA9PT0gayAmJiAocm0gPT09IDQgfHwgcm91bmRVcCB8fCBybSA9PT0gNiAmJiB4ZFtzZCAtIDFdICYgMSB8fFxyXG4gICAgICAgICAgcm0gPT09ICh4LnMgPCAwID8gOCA6IDcpKTtcclxuXHJcbiAgICAgIHhkLmxlbmd0aCA9IHNkO1xyXG5cclxuICAgICAgaWYgKHJvdW5kVXApIHtcclxuXHJcbiAgICAgICAgLy8gUm91bmRpbmcgdXAgbWF5IG1lYW4gdGhlIHByZXZpb3VzIGRpZ2l0IGhhcyB0byBiZSByb3VuZGVkIHVwIGFuZCBzbyBvbi5cclxuICAgICAgICBmb3IgKDsgKyt4ZFstLXNkXSA+IGJhc2UgLSAxOykge1xyXG4gICAgICAgICAgeGRbc2RdID0gMDtcclxuICAgICAgICAgIGlmICghc2QpIHtcclxuICAgICAgICAgICAgKytlO1xyXG4gICAgICAgICAgICB4ZC51bnNoaWZ0KDEpO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG5cclxuICAgICAgLy8gRGV0ZXJtaW5lIHRyYWlsaW5nIHplcm9zLlxyXG4gICAgICBmb3IgKGxlbiA9IHhkLmxlbmd0aDsgIXhkW2xlbiAtIDFdOyAtLWxlbik7XHJcblxyXG4gICAgICAvLyBFLmcuIFs0LCAxMSwgMTVdIGJlY29tZXMgNGJmLlxyXG4gICAgICBmb3IgKGkgPSAwLCBzdHIgPSAnJzsgaSA8IGxlbjsgaSsrKSBzdHIgKz0gTlVNRVJBTFMuY2hhckF0KHhkW2ldKTtcclxuXHJcbiAgICAgIC8vIEFkZCBiaW5hcnkgZXhwb25lbnQgc3VmZml4P1xyXG4gICAgICBpZiAoaXNFeHApIHtcclxuICAgICAgICBpZiAobGVuID4gMSkge1xyXG4gICAgICAgICAgaWYgKGJhc2VPdXQgPT0gMTYgfHwgYmFzZU91dCA9PSA4KSB7XHJcbiAgICAgICAgICAgIGkgPSBiYXNlT3V0ID09IDE2ID8gNCA6IDM7XHJcbiAgICAgICAgICAgIGZvciAoLS1sZW47IGxlbiAlIGk7IGxlbisrKSBzdHIgKz0gJzAnO1xyXG4gICAgICAgICAgICB4ZCA9IGNvbnZlcnRCYXNlKHN0ciwgYmFzZSwgYmFzZU91dCk7XHJcbiAgICAgICAgICAgIGZvciAobGVuID0geGQubGVuZ3RoOyAheGRbbGVuIC0gMV07IC0tbGVuKTtcclxuXHJcbiAgICAgICAgICAgIC8vIHhkWzBdIHdpbGwgYWx3YXlzIGJlIGJlIDFcclxuICAgICAgICAgICAgZm9yIChpID0gMSwgc3RyID0gJzEuJzsgaSA8IGxlbjsgaSsrKSBzdHIgKz0gTlVNRVJBTFMuY2hhckF0KHhkW2ldKTtcclxuICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHN0ciA9IHN0ci5jaGFyQXQoMCkgKyAnLicgKyBzdHIuc2xpY2UoMSk7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBzdHIgPSAgc3RyICsgKGUgPCAwID8gJ3AnIDogJ3ArJykgKyBlO1xyXG4gICAgICB9IGVsc2UgaWYgKGUgPCAwKSB7XHJcbiAgICAgICAgZm9yICg7ICsrZTspIHN0ciA9ICcwJyArIHN0cjtcclxuICAgICAgICBzdHIgPSAnMC4nICsgc3RyO1xyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIGlmICgrK2UgPiBsZW4pIGZvciAoZSAtPSBsZW47IGUtLSA7KSBzdHIgKz0gJzAnO1xyXG4gICAgICAgIGVsc2UgaWYgKGUgPCBsZW4pIHN0ciA9IHN0ci5zbGljZSgwLCBlKSArICcuJyArIHN0ci5zbGljZShlKTtcclxuICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHN0ciA9IChiYXNlT3V0ID09IDE2ID8gJzB4JyA6IGJhc2VPdXQgPT0gMiA/ICcwYicgOiBiYXNlT3V0ID09IDggPyAnMG8nIDogJycpICsgc3RyO1xyXG4gIH1cclxuXHJcbiAgcmV0dXJuIHgucyA8IDAgPyAnLScgKyBzdHIgOiBzdHI7XHJcbn1cclxuXHJcblxyXG4vLyBEb2VzIG5vdCBzdHJpcCB0cmFpbGluZyB6ZXJvcy5cclxuZnVuY3Rpb24gdHJ1bmNhdGUoYXJyLCBsZW4pIHtcclxuICBpZiAoYXJyLmxlbmd0aCA+IGxlbikge1xyXG4gICAgYXJyLmxlbmd0aCA9IGxlbjtcclxuICAgIHJldHVybiB0cnVlO1xyXG4gIH1cclxufVxyXG5cclxuXHJcbi8vIERlY2ltYWwgbWV0aG9kc1xyXG5cclxuXHJcbi8qXHJcbiAqICBhYnNcclxuICogIGFjb3NcclxuICogIGFjb3NoXHJcbiAqICBhZGRcclxuICogIGFzaW5cclxuICogIGFzaW5oXHJcbiAqICBhdGFuXHJcbiAqICBhdGFuaFxyXG4gKiAgYXRhbjJcclxuICogIGNicnRcclxuICogIGNlaWxcclxuICogIGNsYW1wXHJcbiAqICBjbG9uZVxyXG4gKiAgY29uZmlnXHJcbiAqICBjb3NcclxuICogIGNvc2hcclxuICogIGRpdlxyXG4gKiAgZXhwXHJcbiAqICBmbG9vclxyXG4gKiAgaHlwb3RcclxuICogIGxuXHJcbiAqICBsb2dcclxuICogIGxvZzJcclxuICogIGxvZzEwXHJcbiAqICBtYXhcclxuICogIG1pblxyXG4gKiAgbW9kXHJcbiAqICBtdWxcclxuICogIHBvd1xyXG4gKiAgcmFuZG9tXHJcbiAqICByb3VuZFxyXG4gKiAgc2V0XHJcbiAqICBzaWduXHJcbiAqICBzaW5cclxuICogIHNpbmhcclxuICogIHNxcnRcclxuICogIHN1YlxyXG4gKiAgc3VtXHJcbiAqICB0YW5cclxuICogIHRhbmhcclxuICogIHRydW5jXHJcbiAqL1xyXG5cclxuXHJcbi8qXHJcbiAqIFJldHVybiBhIG5ldyBEZWNpbWFsIHdob3NlIHZhbHVlIGlzIHRoZSBhYnNvbHV0ZSB2YWx1ZSBvZiBgeGAuXHJcbiAqXHJcbiAqIHgge251bWJlcnxzdHJpbmd8RGVjaW1hbH1cclxuICpcclxuICovXHJcbmZ1bmN0aW9uIGFicyh4KSB7XHJcbiAgcmV0dXJuIG5ldyB0aGlzKHgpLmFicygpO1xyXG59XHJcblxyXG5cclxuLypcclxuICogUmV0dXJuIGEgbmV3IERlY2ltYWwgd2hvc2UgdmFsdWUgaXMgdGhlIGFyY2Nvc2luZSBpbiByYWRpYW5zIG9mIGB4YC5cclxuICpcclxuICogeCB7bnVtYmVyfHN0cmluZ3xEZWNpbWFsfVxyXG4gKlxyXG4gKi9cclxuZnVuY3Rpb24gYWNvcyh4KSB7XHJcbiAgcmV0dXJuIG5ldyB0aGlzKHgpLmFjb3MoKTtcclxufVxyXG5cclxuXHJcbi8qXHJcbiAqIFJldHVybiBhIG5ldyBEZWNpbWFsIHdob3NlIHZhbHVlIGlzIHRoZSBpbnZlcnNlIG9mIHRoZSBoeXBlcmJvbGljIGNvc2luZSBvZiBgeGAsIHJvdW5kZWQgdG9cclxuICogYHByZWNpc2lvbmAgc2lnbmlmaWNhbnQgZGlnaXRzIHVzaW5nIHJvdW5kaW5nIG1vZGUgYHJvdW5kaW5nYC5cclxuICpcclxuICogeCB7bnVtYmVyfHN0cmluZ3xEZWNpbWFsfSBBIHZhbHVlIGluIHJhZGlhbnMuXHJcbiAqXHJcbiAqL1xyXG5mdW5jdGlvbiBhY29zaCh4KSB7XHJcbiAgcmV0dXJuIG5ldyB0aGlzKHgpLmFjb3NoKCk7XHJcbn1cclxuXHJcblxyXG4vKlxyXG4gKiBSZXR1cm4gYSBuZXcgRGVjaW1hbCB3aG9zZSB2YWx1ZSBpcyB0aGUgc3VtIG9mIGB4YCBhbmQgYHlgLCByb3VuZGVkIHRvIGBwcmVjaXNpb25gIHNpZ25pZmljYW50XHJcbiAqIGRpZ2l0cyB1c2luZyByb3VuZGluZyBtb2RlIGByb3VuZGluZ2AuXHJcbiAqXHJcbiAqIHgge251bWJlcnxzdHJpbmd8RGVjaW1hbH1cclxuICogeSB7bnVtYmVyfHN0cmluZ3xEZWNpbWFsfVxyXG4gKlxyXG4gKi9cclxuZnVuY3Rpb24gYWRkKHgsIHkpIHtcclxuICByZXR1cm4gbmV3IHRoaXMoeCkucGx1cyh5KTtcclxufVxyXG5cclxuXHJcbi8qXHJcbiAqIFJldHVybiBhIG5ldyBEZWNpbWFsIHdob3NlIHZhbHVlIGlzIHRoZSBhcmNzaW5lIGluIHJhZGlhbnMgb2YgYHhgLCByb3VuZGVkIHRvIGBwcmVjaXNpb25gXHJcbiAqIHNpZ25pZmljYW50IGRpZ2l0cyB1c2luZyByb3VuZGluZyBtb2RlIGByb3VuZGluZ2AuXHJcbiAqXHJcbiAqIHgge251bWJlcnxzdHJpbmd8RGVjaW1hbH1cclxuICpcclxuICovXHJcbmZ1bmN0aW9uIGFzaW4oeCkge1xyXG4gIHJldHVybiBuZXcgdGhpcyh4KS5hc2luKCk7XHJcbn1cclxuXHJcblxyXG4vKlxyXG4gKiBSZXR1cm4gYSBuZXcgRGVjaW1hbCB3aG9zZSB2YWx1ZSBpcyB0aGUgaW52ZXJzZSBvZiB0aGUgaHlwZXJib2xpYyBzaW5lIG9mIGB4YCwgcm91bmRlZCB0b1xyXG4gKiBgcHJlY2lzaW9uYCBzaWduaWZpY2FudCBkaWdpdHMgdXNpbmcgcm91bmRpbmcgbW9kZSBgcm91bmRpbmdgLlxyXG4gKlxyXG4gKiB4IHtudW1iZXJ8c3RyaW5nfERlY2ltYWx9IEEgdmFsdWUgaW4gcmFkaWFucy5cclxuICpcclxuICovXHJcbmZ1bmN0aW9uIGFzaW5oKHgpIHtcclxuICByZXR1cm4gbmV3IHRoaXMoeCkuYXNpbmgoKTtcclxufVxyXG5cclxuXHJcbi8qXHJcbiAqIFJldHVybiBhIG5ldyBEZWNpbWFsIHdob3NlIHZhbHVlIGlzIHRoZSBhcmN0YW5nZW50IGluIHJhZGlhbnMgb2YgYHhgLCByb3VuZGVkIHRvIGBwcmVjaXNpb25gXHJcbiAqIHNpZ25pZmljYW50IGRpZ2l0cyB1c2luZyByb3VuZGluZyBtb2RlIGByb3VuZGluZ2AuXHJcbiAqXHJcbiAqIHgge251bWJlcnxzdHJpbmd8RGVjaW1hbH1cclxuICpcclxuICovXHJcbmZ1bmN0aW9uIGF0YW4oeCkge1xyXG4gIHJldHVybiBuZXcgdGhpcyh4KS5hdGFuKCk7XHJcbn1cclxuXHJcblxyXG4vKlxyXG4gKiBSZXR1cm4gYSBuZXcgRGVjaW1hbCB3aG9zZSB2YWx1ZSBpcyB0aGUgaW52ZXJzZSBvZiB0aGUgaHlwZXJib2xpYyB0YW5nZW50IG9mIGB4YCwgcm91bmRlZCB0b1xyXG4gKiBgcHJlY2lzaW9uYCBzaWduaWZpY2FudCBkaWdpdHMgdXNpbmcgcm91bmRpbmcgbW9kZSBgcm91bmRpbmdgLlxyXG4gKlxyXG4gKiB4IHtudW1iZXJ8c3RyaW5nfERlY2ltYWx9IEEgdmFsdWUgaW4gcmFkaWFucy5cclxuICpcclxuICovXHJcbmZ1bmN0aW9uIGF0YW5oKHgpIHtcclxuICByZXR1cm4gbmV3IHRoaXMoeCkuYXRhbmgoKTtcclxufVxyXG5cclxuXHJcbi8qXHJcbiAqIFJldHVybiBhIG5ldyBEZWNpbWFsIHdob3NlIHZhbHVlIGlzIHRoZSBhcmN0YW5nZW50IGluIHJhZGlhbnMgb2YgYHkveGAgaW4gdGhlIHJhbmdlIC1waSB0byBwaVxyXG4gKiAoaW5jbHVzaXZlKSwgcm91bmRlZCB0byBgcHJlY2lzaW9uYCBzaWduaWZpY2FudCBkaWdpdHMgdXNpbmcgcm91bmRpbmcgbW9kZSBgcm91bmRpbmdgLlxyXG4gKlxyXG4gKiBEb21haW46IFstSW5maW5pdHksIEluZmluaXR5XVxyXG4gKiBSYW5nZTogWy1waSwgcGldXHJcbiAqXHJcbiAqIHkge251bWJlcnxzdHJpbmd8RGVjaW1hbH0gVGhlIHktY29vcmRpbmF0ZS5cclxuICogeCB7bnVtYmVyfHN0cmluZ3xEZWNpbWFsfSBUaGUgeC1jb29yZGluYXRlLlxyXG4gKlxyXG4gKiBhdGFuMihcdTAwQjEwLCAtMCkgICAgICAgICAgICAgICA9IFx1MDBCMXBpXHJcbiAqIGF0YW4yKFx1MDBCMTAsICswKSAgICAgICAgICAgICAgID0gXHUwMEIxMFxyXG4gKiBhdGFuMihcdTAwQjEwLCAteCkgICAgICAgICAgICAgICA9IFx1MDBCMXBpIGZvciB4ID4gMFxyXG4gKiBhdGFuMihcdTAwQjEwLCB4KSAgICAgICAgICAgICAgICA9IFx1MDBCMTAgZm9yIHggPiAwXHJcbiAqIGF0YW4yKC15LCBcdTAwQjEwKSAgICAgICAgICAgICAgID0gLXBpLzIgZm9yIHkgPiAwXHJcbiAqIGF0YW4yKHksIFx1MDBCMTApICAgICAgICAgICAgICAgID0gcGkvMiBmb3IgeSA+IDBcclxuICogYXRhbjIoXHUwMEIxeSwgLUluZmluaXR5KSAgICAgICAgPSBcdTAwQjFwaSBmb3IgZmluaXRlIHkgPiAwXHJcbiAqIGF0YW4yKFx1MDBCMXksICtJbmZpbml0eSkgICAgICAgID0gXHUwMEIxMCBmb3IgZmluaXRlIHkgPiAwXHJcbiAqIGF0YW4yKFx1MDBCMUluZmluaXR5LCB4KSAgICAgICAgID0gXHUwMEIxcGkvMiBmb3IgZmluaXRlIHhcclxuICogYXRhbjIoXHUwMEIxSW5maW5pdHksIC1JbmZpbml0eSkgPSBcdTAwQjEzKnBpLzRcclxuICogYXRhbjIoXHUwMEIxSW5maW5pdHksICtJbmZpbml0eSkgPSBcdTAwQjFwaS80XHJcbiAqIGF0YW4yKE5hTiwgeCkgPSBOYU5cclxuICogYXRhbjIoeSwgTmFOKSA9IE5hTlxyXG4gKlxyXG4gKi9cclxuZnVuY3Rpb24gYXRhbjIoeSwgeCkge1xyXG4gIHkgPSBuZXcgdGhpcyh5KTtcclxuICB4ID0gbmV3IHRoaXMoeCk7XHJcbiAgdmFyIHIsXHJcbiAgICBwciA9IHRoaXMucHJlY2lzaW9uLFxyXG4gICAgcm0gPSB0aGlzLnJvdW5kaW5nLFxyXG4gICAgd3ByID0gcHIgKyA0O1xyXG5cclxuICAvLyBFaXRoZXIgTmFOXHJcbiAgaWYgKCF5LnMgfHwgIXgucykge1xyXG4gICAgciA9IG5ldyB0aGlzKE5hTik7XHJcblxyXG4gIC8vIEJvdGggXHUwMEIxSW5maW5pdHlcclxuICB9IGVsc2UgaWYgKCF5LmQgJiYgIXguZCkge1xyXG4gICAgciA9IGdldFBpKHRoaXMsIHdwciwgMSkudGltZXMoeC5zID4gMCA/IDAuMjUgOiAwLjc1KTtcclxuICAgIHIucyA9IHkucztcclxuXHJcbiAgLy8geCBpcyBcdTAwQjFJbmZpbml0eSBvciB5IGlzIFx1MDBCMTBcclxuICB9IGVsc2UgaWYgKCF4LmQgfHwgeS5pc1plcm8oKSkge1xyXG4gICAgciA9IHgucyA8IDAgPyBnZXRQaSh0aGlzLCBwciwgcm0pIDogbmV3IHRoaXMoMCk7XHJcbiAgICByLnMgPSB5LnM7XHJcblxyXG4gIC8vIHkgaXMgXHUwMEIxSW5maW5pdHkgb3IgeCBpcyBcdTAwQjEwXHJcbiAgfSBlbHNlIGlmICgheS5kIHx8IHguaXNaZXJvKCkpIHtcclxuICAgIHIgPSBnZXRQaSh0aGlzLCB3cHIsIDEpLnRpbWVzKDAuNSk7XHJcbiAgICByLnMgPSB5LnM7XHJcblxyXG4gIC8vIEJvdGggbm9uLXplcm8gYW5kIGZpbml0ZVxyXG4gIH0gZWxzZSBpZiAoeC5zIDwgMCkge1xyXG4gICAgdGhpcy5wcmVjaXNpb24gPSB3cHI7XHJcbiAgICB0aGlzLnJvdW5kaW5nID0gMTtcclxuICAgIHIgPSB0aGlzLmF0YW4oZGl2aWRlKHksIHgsIHdwciwgMSkpO1xyXG4gICAgeCA9IGdldFBpKHRoaXMsIHdwciwgMSk7XHJcbiAgICB0aGlzLnByZWNpc2lvbiA9IHByO1xyXG4gICAgdGhpcy5yb3VuZGluZyA9IHJtO1xyXG4gICAgciA9IHkucyA8IDAgPyByLm1pbnVzKHgpIDogci5wbHVzKHgpO1xyXG4gIH0gZWxzZSB7XHJcbiAgICByID0gdGhpcy5hdGFuKGRpdmlkZSh5LCB4LCB3cHIsIDEpKTtcclxuICB9XHJcblxyXG4gIHJldHVybiByO1xyXG59XHJcblxyXG5cclxuLypcclxuICogUmV0dXJuIGEgbmV3IERlY2ltYWwgd2hvc2UgdmFsdWUgaXMgdGhlIGN1YmUgcm9vdCBvZiBgeGAsIHJvdW5kZWQgdG8gYHByZWNpc2lvbmAgc2lnbmlmaWNhbnRcclxuICogZGlnaXRzIHVzaW5nIHJvdW5kaW5nIG1vZGUgYHJvdW5kaW5nYC5cclxuICpcclxuICogeCB7bnVtYmVyfHN0cmluZ3xEZWNpbWFsfVxyXG4gKlxyXG4gKi9cclxuZnVuY3Rpb24gY2JydCh4KSB7XHJcbiAgcmV0dXJuIG5ldyB0aGlzKHgpLmNicnQoKTtcclxufVxyXG5cclxuXHJcbi8qXHJcbiAqIFJldHVybiBhIG5ldyBEZWNpbWFsIHdob3NlIHZhbHVlIGlzIGB4YCByb3VuZGVkIHRvIGFuIGludGVnZXIgdXNpbmcgYFJPVU5EX0NFSUxgLlxyXG4gKlxyXG4gKiB4IHtudW1iZXJ8c3RyaW5nfERlY2ltYWx9XHJcbiAqXHJcbiAqL1xyXG5mdW5jdGlvbiBjZWlsKHgpIHtcclxuICByZXR1cm4gZmluYWxpc2UoeCA9IG5ldyB0aGlzKHgpLCB4LmUgKyAxLCAyKTtcclxufVxyXG5cclxuXHJcbi8qXHJcbiAqIFJldHVybiBhIG5ldyBEZWNpbWFsIHdob3NlIHZhbHVlIGlzIGB4YCBjbGFtcGVkIHRvIHRoZSByYW5nZSBkZWxpbmVhdGVkIGJ5IGBtaW5gIGFuZCBgbWF4YC5cclxuICpcclxuICogeCB7bnVtYmVyfHN0cmluZ3xEZWNpbWFsfVxyXG4gKiBtaW4ge251bWJlcnxzdHJpbmd8RGVjaW1hbH1cclxuICogbWF4IHtudW1iZXJ8c3RyaW5nfERlY2ltYWx9XHJcbiAqXHJcbiAqL1xyXG5mdW5jdGlvbiBjbGFtcCh4LCBtaW4sIG1heCkge1xyXG4gIHJldHVybiBuZXcgdGhpcyh4KS5jbGFtcChtaW4sIG1heCk7XHJcbn1cclxuXHJcblxyXG4vKlxyXG4gKiBDb25maWd1cmUgZ2xvYmFsIHNldHRpbmdzIGZvciBhIERlY2ltYWwgY29uc3RydWN0b3IuXHJcbiAqXHJcbiAqIGBvYmpgIGlzIGFuIG9iamVjdCB3aXRoIG9uZSBvciBtb3JlIG9mIHRoZSBmb2xsb3dpbmcgcHJvcGVydGllcyxcclxuICpcclxuICogICBwcmVjaXNpb24gIHtudW1iZXJ9XHJcbiAqICAgcm91bmRpbmcgICB7bnVtYmVyfVxyXG4gKiAgIHRvRXhwTmVnICAge251bWJlcn1cclxuICogICB0b0V4cFBvcyAgIHtudW1iZXJ9XHJcbiAqICAgbWF4RSAgICAgICB7bnVtYmVyfVxyXG4gKiAgIG1pbkUgICAgICAge251bWJlcn1cclxuICogICBtb2R1bG8gICAgIHtudW1iZXJ9XHJcbiAqICAgY3J5cHRvICAgICB7Ym9vbGVhbnxudW1iZXJ9XHJcbiAqICAgZGVmYXVsdHMgICB7dHJ1ZX1cclxuICpcclxuICogRS5nLiBEZWNpbWFsLmNvbmZpZyh7IHByZWNpc2lvbjogMjAsIHJvdW5kaW5nOiA0IH0pXHJcbiAqXHJcbiAqL1xyXG5mdW5jdGlvbiBjb25maWcob2JqKSB7XHJcbiAgaWYgKCFvYmogfHwgdHlwZW9mIG9iaiAhPT0gJ29iamVjdCcpIHRocm93IEVycm9yKGRlY2ltYWxFcnJvciArICdPYmplY3QgZXhwZWN0ZWQnKTtcclxuICB2YXIgaSwgcCwgdixcclxuICAgIHVzZURlZmF1bHRzID0gb2JqLmRlZmF1bHRzID09PSB0cnVlLFxyXG4gICAgcHMgPSBbXHJcbiAgICAgICdwcmVjaXNpb24nLCAxLCBNQVhfRElHSVRTLFxyXG4gICAgICAncm91bmRpbmcnLCAwLCA4LFxyXG4gICAgICAndG9FeHBOZWcnLCAtRVhQX0xJTUlULCAwLFxyXG4gICAgICAndG9FeHBQb3MnLCAwLCBFWFBfTElNSVQsXHJcbiAgICAgICdtYXhFJywgMCwgRVhQX0xJTUlULFxyXG4gICAgICAnbWluRScsIC1FWFBfTElNSVQsIDAsXHJcbiAgICAgICdtb2R1bG8nLCAwLCA5XHJcbiAgICBdO1xyXG5cclxuICBmb3IgKGkgPSAwOyBpIDwgcHMubGVuZ3RoOyBpICs9IDMpIHtcclxuICAgIGlmIChwID0gcHNbaV0sIHVzZURlZmF1bHRzKSB0aGlzW3BdID0gREVGQVVMVFNbcF07XHJcbiAgICBpZiAoKHYgPSBvYmpbcF0pICE9PSB2b2lkIDApIHtcclxuICAgICAgaWYgKG1hdGhmbG9vcih2KSA9PT0gdiAmJiB2ID49IHBzW2kgKyAxXSAmJiB2IDw9IHBzW2kgKyAyXSkgdGhpc1twXSA9IHY7XHJcbiAgICAgIGVsc2UgdGhyb3cgRXJyb3IoaW52YWxpZEFyZ3VtZW50ICsgcCArICc6ICcgKyB2KTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIGlmIChwID0gJ2NyeXB0bycsIHVzZURlZmF1bHRzKSB0aGlzW3BdID0gREVGQVVMVFNbcF07XHJcbiAgaWYgKCh2ID0gb2JqW3BdKSAhPT0gdm9pZCAwKSB7XHJcbiAgICBpZiAodiA9PT0gdHJ1ZSB8fCB2ID09PSBmYWxzZSB8fCB2ID09PSAwIHx8IHYgPT09IDEpIHtcclxuICAgICAgaWYgKHYpIHtcclxuICAgICAgICBpZiAodHlwZW9mIGNyeXB0byAhPSAndW5kZWZpbmVkJyAmJiBjcnlwdG8gJiZcclxuICAgICAgICAgIChjcnlwdG8uZ2V0UmFuZG9tVmFsdWVzIHx8IGNyeXB0by5yYW5kb21CeXRlcykpIHtcclxuICAgICAgICAgIHRoaXNbcF0gPSB0cnVlO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICB0aHJvdyBFcnJvcihjcnlwdG9VbmF2YWlsYWJsZSk7XHJcbiAgICAgICAgfVxyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIHRoaXNbcF0gPSBmYWxzZTtcclxuICAgICAgfVxyXG4gICAgfSBlbHNlIHtcclxuICAgICAgdGhyb3cgRXJyb3IoaW52YWxpZEFyZ3VtZW50ICsgcCArICc6ICcgKyB2KTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIHJldHVybiB0aGlzO1xyXG59XHJcblxyXG5cclxuLypcclxuICogUmV0dXJuIGEgbmV3IERlY2ltYWwgd2hvc2UgdmFsdWUgaXMgdGhlIGNvc2luZSBvZiBgeGAsIHJvdW5kZWQgdG8gYHByZWNpc2lvbmAgc2lnbmlmaWNhbnRcclxuICogZGlnaXRzIHVzaW5nIHJvdW5kaW5nIG1vZGUgYHJvdW5kaW5nYC5cclxuICpcclxuICogeCB7bnVtYmVyfHN0cmluZ3xEZWNpbWFsfSBBIHZhbHVlIGluIHJhZGlhbnMuXHJcbiAqXHJcbiAqL1xyXG5mdW5jdGlvbiBjb3MoeCkge1xyXG4gIHJldHVybiBuZXcgdGhpcyh4KS5jb3MoKTtcclxufVxyXG5cclxuXHJcbi8qXHJcbiAqIFJldHVybiBhIG5ldyBEZWNpbWFsIHdob3NlIHZhbHVlIGlzIHRoZSBoeXBlcmJvbGljIGNvc2luZSBvZiBgeGAsIHJvdW5kZWQgdG8gcHJlY2lzaW9uXHJcbiAqIHNpZ25pZmljYW50IGRpZ2l0cyB1c2luZyByb3VuZGluZyBtb2RlIGByb3VuZGluZ2AuXHJcbiAqXHJcbiAqIHgge251bWJlcnxzdHJpbmd8RGVjaW1hbH0gQSB2YWx1ZSBpbiByYWRpYW5zLlxyXG4gKlxyXG4gKi9cclxuZnVuY3Rpb24gY29zaCh4KSB7XHJcbiAgcmV0dXJuIG5ldyB0aGlzKHgpLmNvc2goKTtcclxufVxyXG5cclxuXHJcbi8qXHJcbiAqIENyZWF0ZSBhbmQgcmV0dXJuIGEgRGVjaW1hbCBjb25zdHJ1Y3RvciB3aXRoIHRoZSBzYW1lIGNvbmZpZ3VyYXRpb24gcHJvcGVydGllcyBhcyB0aGlzIERlY2ltYWxcclxuICogY29uc3RydWN0b3IuXHJcbiAqXHJcbiAqL1xyXG5mdW5jdGlvbiBjbG9uZShvYmopIHtcclxuICB2YXIgaSwgcCwgcHM7XHJcblxyXG4gIC8qXHJcbiAgICogVGhlIERlY2ltYWwgY29uc3RydWN0b3IgYW5kIGV4cG9ydGVkIGZ1bmN0aW9uLlxyXG4gICAqIFJldHVybiBhIG5ldyBEZWNpbWFsIGluc3RhbmNlLlxyXG4gICAqXHJcbiAgICogdiB7bnVtYmVyfHN0cmluZ3xEZWNpbWFsfSBBIG51bWVyaWMgdmFsdWUuXHJcbiAgICpcclxuICAgKi9cclxuICBmdW5jdGlvbiBEZWNpbWFsKHYpIHtcclxuICAgIHZhciBlLCBpLCB0LFxyXG4gICAgICB4ID0gdGhpcztcclxuXHJcbiAgICAvLyBEZWNpbWFsIGNhbGxlZCB3aXRob3V0IG5ldy5cclxuICAgIGlmICghKHggaW5zdGFuY2VvZiBEZWNpbWFsKSkgcmV0dXJuIG5ldyBEZWNpbWFsKHYpO1xyXG5cclxuICAgIC8vIFJldGFpbiBhIHJlZmVyZW5jZSB0byB0aGlzIERlY2ltYWwgY29uc3RydWN0b3IsIGFuZCBzaGFkb3cgRGVjaW1hbC5wcm90b3R5cGUuY29uc3RydWN0b3JcclxuICAgIC8vIHdoaWNoIHBvaW50cyB0byBPYmplY3QuXHJcbiAgICB4LmNvbnN0cnVjdG9yID0gRGVjaW1hbDtcclxuXHJcbiAgICAvLyBEdXBsaWNhdGUuXHJcbiAgICBpZiAoaXNEZWNpbWFsSW5zdGFuY2UodikpIHtcclxuICAgICAgeC5zID0gdi5zO1xyXG5cclxuICAgICAgaWYgKGV4dGVybmFsKSB7XHJcbiAgICAgICAgaWYgKCF2LmQgfHwgdi5lID4gRGVjaW1hbC5tYXhFKSB7XHJcblxyXG4gICAgICAgICAgLy8gSW5maW5pdHkuXHJcbiAgICAgICAgICB4LmUgPSBOYU47XHJcbiAgICAgICAgICB4LmQgPSBudWxsO1xyXG4gICAgICAgIH0gZWxzZSBpZiAodi5lIDwgRGVjaW1hbC5taW5FKSB7XHJcblxyXG4gICAgICAgICAgLy8gWmVyby5cclxuICAgICAgICAgIHguZSA9IDA7XHJcbiAgICAgICAgICB4LmQgPSBbMF07XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgIHguZSA9IHYuZTtcclxuICAgICAgICAgIHguZCA9IHYuZC5zbGljZSgpO1xyXG4gICAgICAgIH1cclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICB4LmUgPSB2LmU7XHJcbiAgICAgICAgeC5kID0gdi5kID8gdi5kLnNsaWNlKCkgOiB2LmQ7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIHJldHVybjtcclxuICAgIH1cclxuXHJcbiAgICB0ID0gdHlwZW9mIHY7XHJcblxyXG4gICAgaWYgKHQgPT09ICdudW1iZXInKSB7XHJcbiAgICAgIGlmICh2ID09PSAwKSB7XHJcbiAgICAgICAgeC5zID0gMSAvIHYgPCAwID8gLTEgOiAxO1xyXG4gICAgICAgIHguZSA9IDA7XHJcbiAgICAgICAgeC5kID0gWzBdO1xyXG4gICAgICAgIHJldHVybjtcclxuICAgICAgfVxyXG5cclxuICAgICAgaWYgKHYgPCAwKSB7XHJcbiAgICAgICAgdiA9IC12O1xyXG4gICAgICAgIHgucyA9IC0xO1xyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIHgucyA9IDE7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIC8vIEZhc3QgcGF0aCBmb3Igc21hbGwgaW50ZWdlcnMuXHJcbiAgICAgIGlmICh2ID09PSB+fnYgJiYgdiA8IDFlNykge1xyXG4gICAgICAgIGZvciAoZSA9IDAsIGkgPSB2OyBpID49IDEwOyBpIC89IDEwKSBlKys7XHJcblxyXG4gICAgICAgIGlmIChleHRlcm5hbCkge1xyXG4gICAgICAgICAgaWYgKGUgPiBEZWNpbWFsLm1heEUpIHtcclxuICAgICAgICAgICAgeC5lID0gTmFOO1xyXG4gICAgICAgICAgICB4LmQgPSBudWxsO1xyXG4gICAgICAgICAgfSBlbHNlIGlmIChlIDwgRGVjaW1hbC5taW5FKSB7XHJcbiAgICAgICAgICAgIHguZSA9IDA7XHJcbiAgICAgICAgICAgIHguZCA9IFswXTtcclxuICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHguZSA9IGU7XHJcbiAgICAgICAgICAgIHguZCA9IFt2XTtcclxuICAgICAgICAgIH1cclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgeC5lID0gZTtcclxuICAgICAgICAgIHguZCA9IFt2XTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybjtcclxuXHJcbiAgICAgIC8vIEluZmluaXR5LCBOYU4uXHJcbiAgICAgIH0gZWxzZSBpZiAodiAqIDAgIT09IDApIHtcclxuICAgICAgICBpZiAoIXYpIHgucyA9IE5hTjtcclxuICAgICAgICB4LmUgPSBOYU47XHJcbiAgICAgICAgeC5kID0gbnVsbDtcclxuICAgICAgICByZXR1cm47XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIHJldHVybiBwYXJzZURlY2ltYWwoeCwgdi50b1N0cmluZygpKTtcclxuXHJcbiAgICB9IGVsc2UgaWYgKHQgIT09ICdzdHJpbmcnKSB7XHJcbiAgICAgIHRocm93IEVycm9yKGludmFsaWRBcmd1bWVudCArIHYpO1xyXG4gICAgfVxyXG5cclxuICAgIC8vIE1pbnVzIHNpZ24/XHJcbiAgICBpZiAoKGkgPSB2LmNoYXJDb2RlQXQoMCkpID09PSA0NSkge1xyXG4gICAgICB2ID0gdi5zbGljZSgxKTtcclxuICAgICAgeC5zID0gLTE7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICAvLyBQbHVzIHNpZ24/XHJcbiAgICAgIGlmIChpID09PSA0MykgdiA9IHYuc2xpY2UoMSk7XHJcbiAgICAgIHgucyA9IDE7XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIGlzRGVjaW1hbC50ZXN0KHYpID8gcGFyc2VEZWNpbWFsKHgsIHYpIDogcGFyc2VPdGhlcih4LCB2KTtcclxuICB9XHJcblxyXG4gIERlY2ltYWwucHJvdG90eXBlID0gUDtcclxuXHJcbiAgRGVjaW1hbC5ST1VORF9VUCA9IDA7XHJcbiAgRGVjaW1hbC5ST1VORF9ET1dOID0gMTtcclxuICBEZWNpbWFsLlJPVU5EX0NFSUwgPSAyO1xyXG4gIERlY2ltYWwuUk9VTkRfRkxPT1IgPSAzO1xyXG4gIERlY2ltYWwuUk9VTkRfSEFMRl9VUCA9IDQ7XHJcbiAgRGVjaW1hbC5ST1VORF9IQUxGX0RPV04gPSA1O1xyXG4gIERlY2ltYWwuUk9VTkRfSEFMRl9FVkVOID0gNjtcclxuICBEZWNpbWFsLlJPVU5EX0hBTEZfQ0VJTCA9IDc7XHJcbiAgRGVjaW1hbC5ST1VORF9IQUxGX0ZMT09SID0gODtcclxuICBEZWNpbWFsLkVVQ0xJRCA9IDk7XHJcblxyXG4gIERlY2ltYWwuY29uZmlnID0gRGVjaW1hbC5zZXQgPSBjb25maWc7XHJcbiAgRGVjaW1hbC5jbG9uZSA9IGNsb25lO1xyXG4gIERlY2ltYWwuaXNEZWNpbWFsID0gaXNEZWNpbWFsSW5zdGFuY2U7XHJcblxyXG4gIERlY2ltYWwuYWJzID0gYWJzO1xyXG4gIERlY2ltYWwuYWNvcyA9IGFjb3M7XHJcbiAgRGVjaW1hbC5hY29zaCA9IGFjb3NoOyAgICAgICAgLy8gRVM2XHJcbiAgRGVjaW1hbC5hZGQgPSBhZGQ7XHJcbiAgRGVjaW1hbC5hc2luID0gYXNpbjtcclxuICBEZWNpbWFsLmFzaW5oID0gYXNpbmg7ICAgICAgICAvLyBFUzZcclxuICBEZWNpbWFsLmF0YW4gPSBhdGFuO1xyXG4gIERlY2ltYWwuYXRhbmggPSBhdGFuaDsgICAgICAgIC8vIEVTNlxyXG4gIERlY2ltYWwuYXRhbjIgPSBhdGFuMjtcclxuICBEZWNpbWFsLmNicnQgPSBjYnJ0OyAgICAgICAgICAvLyBFUzZcclxuICBEZWNpbWFsLmNlaWwgPSBjZWlsO1xyXG4gIERlY2ltYWwuY2xhbXAgPSBjbGFtcDtcclxuICBEZWNpbWFsLmNvcyA9IGNvcztcclxuICBEZWNpbWFsLmNvc2ggPSBjb3NoOyAgICAgICAgICAvLyBFUzZcclxuICBEZWNpbWFsLmRpdiA9IGRpdjtcclxuICBEZWNpbWFsLmV4cCA9IGV4cDtcclxuICBEZWNpbWFsLmZsb29yID0gZmxvb3I7XHJcbiAgRGVjaW1hbC5oeXBvdCA9IGh5cG90OyAgICAgICAgLy8gRVM2XHJcbiAgRGVjaW1hbC5sbiA9IGxuO1xyXG4gIERlY2ltYWwubG9nID0gbG9nO1xyXG4gIERlY2ltYWwubG9nMTAgPSBsb2cxMDsgICAgICAgIC8vIEVTNlxyXG4gIERlY2ltYWwubG9nMiA9IGxvZzI7ICAgICAgICAgIC8vIEVTNlxyXG4gIERlY2ltYWwubWF4ID0gbWF4O1xyXG4gIERlY2ltYWwubWluID0gbWluO1xyXG4gIERlY2ltYWwubW9kID0gbW9kO1xyXG4gIERlY2ltYWwubXVsID0gbXVsO1xyXG4gIERlY2ltYWwucG93ID0gcG93O1xyXG4gIERlY2ltYWwucmFuZG9tID0gcmFuZG9tO1xyXG4gIERlY2ltYWwucm91bmQgPSByb3VuZDtcclxuICBEZWNpbWFsLnNpZ24gPSBzaWduOyAgICAgICAgICAvLyBFUzZcclxuICBEZWNpbWFsLnNpbiA9IHNpbjtcclxuICBEZWNpbWFsLnNpbmggPSBzaW5oOyAgICAgICAgICAvLyBFUzZcclxuICBEZWNpbWFsLnNxcnQgPSBzcXJ0O1xyXG4gIERlY2ltYWwuc3ViID0gc3ViO1xyXG4gIERlY2ltYWwuc3VtID0gc3VtO1xyXG4gIERlY2ltYWwudGFuID0gdGFuO1xyXG4gIERlY2ltYWwudGFuaCA9IHRhbmg7ICAgICAgICAgIC8vIEVTNlxyXG4gIERlY2ltYWwudHJ1bmMgPSB0cnVuYzsgICAgICAgIC8vIEVTNlxyXG5cclxuICBpZiAob2JqID09PSB2b2lkIDApIG9iaiA9IHt9O1xyXG4gIGlmIChvYmopIHtcclxuICAgIGlmIChvYmouZGVmYXVsdHMgIT09IHRydWUpIHtcclxuICAgICAgcHMgPSBbJ3ByZWNpc2lvbicsICdyb3VuZGluZycsICd0b0V4cE5lZycsICd0b0V4cFBvcycsICdtYXhFJywgJ21pbkUnLCAnbW9kdWxvJywgJ2NyeXB0byddO1xyXG4gICAgICBmb3IgKGkgPSAwOyBpIDwgcHMubGVuZ3RoOykgaWYgKCFvYmouaGFzT3duUHJvcGVydHkocCA9IHBzW2krK10pKSBvYmpbcF0gPSB0aGlzW3BdO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgRGVjaW1hbC5jb25maWcob2JqKTtcclxuXHJcbiAgcmV0dXJuIERlY2ltYWw7XHJcbn1cclxuXHJcblxyXG4vKlxyXG4gKiBSZXR1cm4gYSBuZXcgRGVjaW1hbCB3aG9zZSB2YWx1ZSBpcyBgeGAgZGl2aWRlZCBieSBgeWAsIHJvdW5kZWQgdG8gYHByZWNpc2lvbmAgc2lnbmlmaWNhbnRcclxuICogZGlnaXRzIHVzaW5nIHJvdW5kaW5nIG1vZGUgYHJvdW5kaW5nYC5cclxuICpcclxuICogeCB7bnVtYmVyfHN0cmluZ3xEZWNpbWFsfVxyXG4gKiB5IHtudW1iZXJ8c3RyaW5nfERlY2ltYWx9XHJcbiAqXHJcbiAqL1xyXG5mdW5jdGlvbiBkaXYoeCwgeSkge1xyXG4gIHJldHVybiBuZXcgdGhpcyh4KS5kaXYoeSk7XHJcbn1cclxuXHJcblxyXG4vKlxyXG4gKiBSZXR1cm4gYSBuZXcgRGVjaW1hbCB3aG9zZSB2YWx1ZSBpcyB0aGUgbmF0dXJhbCBleHBvbmVudGlhbCBvZiBgeGAsIHJvdW5kZWQgdG8gYHByZWNpc2lvbmBcclxuICogc2lnbmlmaWNhbnQgZGlnaXRzIHVzaW5nIHJvdW5kaW5nIG1vZGUgYHJvdW5kaW5nYC5cclxuICpcclxuICogeCB7bnVtYmVyfHN0cmluZ3xEZWNpbWFsfSBUaGUgcG93ZXIgdG8gd2hpY2ggdG8gcmFpc2UgdGhlIGJhc2Ugb2YgdGhlIG5hdHVyYWwgbG9nLlxyXG4gKlxyXG4gKi9cclxuZnVuY3Rpb24gZXhwKHgpIHtcclxuICByZXR1cm4gbmV3IHRoaXMoeCkuZXhwKCk7XHJcbn1cclxuXHJcblxyXG4vKlxyXG4gKiBSZXR1cm4gYSBuZXcgRGVjaW1hbCB3aG9zZSB2YWx1ZSBpcyBgeGAgcm91bmQgdG8gYW4gaW50ZWdlciB1c2luZyBgUk9VTkRfRkxPT1JgLlxyXG4gKlxyXG4gKiB4IHtudW1iZXJ8c3RyaW5nfERlY2ltYWx9XHJcbiAqXHJcbiAqL1xyXG5mdW5jdGlvbiBmbG9vcih4KSB7XHJcbiAgcmV0dXJuIGZpbmFsaXNlKHggPSBuZXcgdGhpcyh4KSwgeC5lICsgMSwgMyk7XHJcbn1cclxuXHJcblxyXG4vKlxyXG4gKiBSZXR1cm4gYSBuZXcgRGVjaW1hbCB3aG9zZSB2YWx1ZSBpcyB0aGUgc3F1YXJlIHJvb3Qgb2YgdGhlIHN1bSBvZiB0aGUgc3F1YXJlcyBvZiB0aGUgYXJndW1lbnRzLFxyXG4gKiByb3VuZGVkIHRvIGBwcmVjaXNpb25gIHNpZ25pZmljYW50IGRpZ2l0cyB1c2luZyByb3VuZGluZyBtb2RlIGByb3VuZGluZ2AuXHJcbiAqXHJcbiAqIGh5cG90KGEsIGIsIC4uLikgPSBzcXJ0KGFeMiArIGJeMiArIC4uLilcclxuICpcclxuICogYXJndW1lbnRzIHtudW1iZXJ8c3RyaW5nfERlY2ltYWx9XHJcbiAqXHJcbiAqL1xyXG5mdW5jdGlvbiBoeXBvdCgpIHtcclxuICB2YXIgaSwgbixcclxuICAgIHQgPSBuZXcgdGhpcygwKTtcclxuXHJcbiAgZXh0ZXJuYWwgPSBmYWxzZTtcclxuXHJcbiAgZm9yIChpID0gMDsgaSA8IGFyZ3VtZW50cy5sZW5ndGg7KSB7XHJcbiAgICBuID0gbmV3IHRoaXMoYXJndW1lbnRzW2krK10pO1xyXG4gICAgaWYgKCFuLmQpIHtcclxuICAgICAgaWYgKG4ucykge1xyXG4gICAgICAgIGV4dGVybmFsID0gdHJ1ZTtcclxuICAgICAgICByZXR1cm4gbmV3IHRoaXMoMSAvIDApO1xyXG4gICAgICB9XHJcbiAgICAgIHQgPSBuO1xyXG4gICAgfSBlbHNlIGlmICh0LmQpIHtcclxuICAgICAgdCA9IHQucGx1cyhuLnRpbWVzKG4pKTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIGV4dGVybmFsID0gdHJ1ZTtcclxuXHJcbiAgcmV0dXJuIHQuc3FydCgpO1xyXG59XHJcblxyXG5cclxuLypcclxuICogUmV0dXJuIHRydWUgaWYgb2JqZWN0IGlzIGEgRGVjaW1hbCBpbnN0YW5jZSAod2hlcmUgRGVjaW1hbCBpcyBhbnkgRGVjaW1hbCBjb25zdHJ1Y3RvciksXHJcbiAqIG90aGVyd2lzZSByZXR1cm4gZmFsc2UuXHJcbiAqXHJcbiAqL1xyXG5mdW5jdGlvbiBpc0RlY2ltYWxJbnN0YW5jZShvYmopIHtcclxuICByZXR1cm4gb2JqIGluc3RhbmNlb2YgRGVjaW1hbCB8fCBvYmogJiYgb2JqLnRvU3RyaW5nVGFnID09PSB0YWcgfHwgZmFsc2U7XHJcbn1cclxuXHJcblxyXG4vKlxyXG4gKiBSZXR1cm4gYSBuZXcgRGVjaW1hbCB3aG9zZSB2YWx1ZSBpcyB0aGUgbmF0dXJhbCBsb2dhcml0aG0gb2YgYHhgLCByb3VuZGVkIHRvIGBwcmVjaXNpb25gXHJcbiAqIHNpZ25pZmljYW50IGRpZ2l0cyB1c2luZyByb3VuZGluZyBtb2RlIGByb3VuZGluZ2AuXHJcbiAqXHJcbiAqIHgge251bWJlcnxzdHJpbmd8RGVjaW1hbH1cclxuICpcclxuICovXHJcbmZ1bmN0aW9uIGxuKHgpIHtcclxuICByZXR1cm4gbmV3IHRoaXMoeCkubG4oKTtcclxufVxyXG5cclxuXHJcbi8qXHJcbiAqIFJldHVybiBhIG5ldyBEZWNpbWFsIHdob3NlIHZhbHVlIGlzIHRoZSBsb2cgb2YgYHhgIHRvIHRoZSBiYXNlIGB5YCwgb3IgdG8gYmFzZSAxMCBpZiBubyBiYXNlXHJcbiAqIGlzIHNwZWNpZmllZCwgcm91bmRlZCB0byBgcHJlY2lzaW9uYCBzaWduaWZpY2FudCBkaWdpdHMgdXNpbmcgcm91bmRpbmcgbW9kZSBgcm91bmRpbmdgLlxyXG4gKlxyXG4gKiBsb2dbeV0oeClcclxuICpcclxuICogeCB7bnVtYmVyfHN0cmluZ3xEZWNpbWFsfSBUaGUgYXJndW1lbnQgb2YgdGhlIGxvZ2FyaXRobS5cclxuICogeSB7bnVtYmVyfHN0cmluZ3xEZWNpbWFsfSBUaGUgYmFzZSBvZiB0aGUgbG9nYXJpdGhtLlxyXG4gKlxyXG4gKi9cclxuZnVuY3Rpb24gbG9nKHgsIHkpIHtcclxuICByZXR1cm4gbmV3IHRoaXMoeCkubG9nKHkpO1xyXG59XHJcblxyXG5cclxuLypcclxuICogUmV0dXJuIGEgbmV3IERlY2ltYWwgd2hvc2UgdmFsdWUgaXMgdGhlIGJhc2UgMiBsb2dhcml0aG0gb2YgYHhgLCByb3VuZGVkIHRvIGBwcmVjaXNpb25gXHJcbiAqIHNpZ25pZmljYW50IGRpZ2l0cyB1c2luZyByb3VuZGluZyBtb2RlIGByb3VuZGluZ2AuXHJcbiAqXHJcbiAqIHgge251bWJlcnxzdHJpbmd8RGVjaW1hbH1cclxuICpcclxuICovXHJcbmZ1bmN0aW9uIGxvZzIoeCkge1xyXG4gIHJldHVybiBuZXcgdGhpcyh4KS5sb2coMik7XHJcbn1cclxuXHJcblxyXG4vKlxyXG4gKiBSZXR1cm4gYSBuZXcgRGVjaW1hbCB3aG9zZSB2YWx1ZSBpcyB0aGUgYmFzZSAxMCBsb2dhcml0aG0gb2YgYHhgLCByb3VuZGVkIHRvIGBwcmVjaXNpb25gXHJcbiAqIHNpZ25pZmljYW50IGRpZ2l0cyB1c2luZyByb3VuZGluZyBtb2RlIGByb3VuZGluZ2AuXHJcbiAqXHJcbiAqIHgge251bWJlcnxzdHJpbmd8RGVjaW1hbH1cclxuICpcclxuICovXHJcbmZ1bmN0aW9uIGxvZzEwKHgpIHtcclxuICByZXR1cm4gbmV3IHRoaXMoeCkubG9nKDEwKTtcclxufVxyXG5cclxuXHJcbi8qXHJcbiAqIFJldHVybiBhIG5ldyBEZWNpbWFsIHdob3NlIHZhbHVlIGlzIHRoZSBtYXhpbXVtIG9mIHRoZSBhcmd1bWVudHMuXHJcbiAqXHJcbiAqIGFyZ3VtZW50cyB7bnVtYmVyfHN0cmluZ3xEZWNpbWFsfVxyXG4gKlxyXG4gKi9cclxuZnVuY3Rpb24gbWF4KCkge1xyXG4gIHJldHVybiBtYXhPck1pbih0aGlzLCBhcmd1bWVudHMsICdsdCcpO1xyXG59XHJcblxyXG5cclxuLypcclxuICogUmV0dXJuIGEgbmV3IERlY2ltYWwgd2hvc2UgdmFsdWUgaXMgdGhlIG1pbmltdW0gb2YgdGhlIGFyZ3VtZW50cy5cclxuICpcclxuICogYXJndW1lbnRzIHtudW1iZXJ8c3RyaW5nfERlY2ltYWx9XHJcbiAqXHJcbiAqL1xyXG5mdW5jdGlvbiBtaW4oKSB7XHJcbiAgcmV0dXJuIG1heE9yTWluKHRoaXMsIGFyZ3VtZW50cywgJ2d0Jyk7XHJcbn1cclxuXHJcblxyXG4vKlxyXG4gKiBSZXR1cm4gYSBuZXcgRGVjaW1hbCB3aG9zZSB2YWx1ZSBpcyBgeGAgbW9kdWxvIGB5YCwgcm91bmRlZCB0byBgcHJlY2lzaW9uYCBzaWduaWZpY2FudCBkaWdpdHNcclxuICogdXNpbmcgcm91bmRpbmcgbW9kZSBgcm91bmRpbmdgLlxyXG4gKlxyXG4gKiB4IHtudW1iZXJ8c3RyaW5nfERlY2ltYWx9XHJcbiAqIHkge251bWJlcnxzdHJpbmd8RGVjaW1hbH1cclxuICpcclxuICovXHJcbmZ1bmN0aW9uIG1vZCh4LCB5KSB7XHJcbiAgcmV0dXJuIG5ldyB0aGlzKHgpLm1vZCh5KTtcclxufVxyXG5cclxuXHJcbi8qXHJcbiAqIFJldHVybiBhIG5ldyBEZWNpbWFsIHdob3NlIHZhbHVlIGlzIGB4YCBtdWx0aXBsaWVkIGJ5IGB5YCwgcm91bmRlZCB0byBgcHJlY2lzaW9uYCBzaWduaWZpY2FudFxyXG4gKiBkaWdpdHMgdXNpbmcgcm91bmRpbmcgbW9kZSBgcm91bmRpbmdgLlxyXG4gKlxyXG4gKiB4IHtudW1iZXJ8c3RyaW5nfERlY2ltYWx9XHJcbiAqIHkge251bWJlcnxzdHJpbmd8RGVjaW1hbH1cclxuICpcclxuICovXHJcbmZ1bmN0aW9uIG11bCh4LCB5KSB7XHJcbiAgcmV0dXJuIG5ldyB0aGlzKHgpLm11bCh5KTtcclxufVxyXG5cclxuXHJcbi8qXHJcbiAqIFJldHVybiBhIG5ldyBEZWNpbWFsIHdob3NlIHZhbHVlIGlzIGB4YCByYWlzZWQgdG8gdGhlIHBvd2VyIGB5YCwgcm91bmRlZCB0byBwcmVjaXNpb25cclxuICogc2lnbmlmaWNhbnQgZGlnaXRzIHVzaW5nIHJvdW5kaW5nIG1vZGUgYHJvdW5kaW5nYC5cclxuICpcclxuICogeCB7bnVtYmVyfHN0cmluZ3xEZWNpbWFsfSBUaGUgYmFzZS5cclxuICogeSB7bnVtYmVyfHN0cmluZ3xEZWNpbWFsfSBUaGUgZXhwb25lbnQuXHJcbiAqXHJcbiAqL1xyXG5mdW5jdGlvbiBwb3coeCwgeSkge1xyXG4gIHJldHVybiBuZXcgdGhpcyh4KS5wb3coeSk7XHJcbn1cclxuXHJcblxyXG4vKlxyXG4gKiBSZXR1cm5zIGEgbmV3IERlY2ltYWwgd2l0aCBhIHJhbmRvbSB2YWx1ZSBlcXVhbCB0byBvciBncmVhdGVyIHRoYW4gMCBhbmQgbGVzcyB0aGFuIDEsIGFuZCB3aXRoXHJcbiAqIGBzZGAsIG9yIGBEZWNpbWFsLnByZWNpc2lvbmAgaWYgYHNkYCBpcyBvbWl0dGVkLCBzaWduaWZpY2FudCBkaWdpdHMgKG9yIGxlc3MgaWYgdHJhaWxpbmcgemVyb3NcclxuICogYXJlIHByb2R1Y2VkKS5cclxuICpcclxuICogW3NkXSB7bnVtYmVyfSBTaWduaWZpY2FudCBkaWdpdHMuIEludGVnZXIsIDAgdG8gTUFYX0RJR0lUUyBpbmNsdXNpdmUuXHJcbiAqXHJcbiAqL1xyXG5mdW5jdGlvbiByYW5kb20oc2QpIHtcclxuICB2YXIgZCwgZSwgaywgbixcclxuICAgIGkgPSAwLFxyXG4gICAgciA9IG5ldyB0aGlzKDEpLFxyXG4gICAgcmQgPSBbXTtcclxuXHJcbiAgaWYgKHNkID09PSB2b2lkIDApIHNkID0gdGhpcy5wcmVjaXNpb247XHJcbiAgZWxzZSBjaGVja0ludDMyKHNkLCAxLCBNQVhfRElHSVRTKTtcclxuXHJcbiAgayA9IE1hdGguY2VpbChzZCAvIExPR19CQVNFKTtcclxuXHJcbiAgaWYgKCF0aGlzLmNyeXB0bykge1xyXG4gICAgZm9yICg7IGkgPCBrOykgcmRbaSsrXSA9IE1hdGgucmFuZG9tKCkgKiAxZTcgfCAwO1xyXG5cclxuICAvLyBCcm93c2VycyBzdXBwb3J0aW5nIGNyeXB0by5nZXRSYW5kb21WYWx1ZXMuXHJcbiAgfSBlbHNlIGlmIChjcnlwdG8uZ2V0UmFuZG9tVmFsdWVzKSB7XHJcbiAgICBkID0gY3J5cHRvLmdldFJhbmRvbVZhbHVlcyhuZXcgVWludDMyQXJyYXkoaykpO1xyXG5cclxuICAgIGZvciAoOyBpIDwgazspIHtcclxuICAgICAgbiA9IGRbaV07XHJcblxyXG4gICAgICAvLyAwIDw9IG4gPCA0Mjk0OTY3Mjk2XHJcbiAgICAgIC8vIFByb2JhYmlsaXR5IG4gPj0gNC4yOWU5LCBpcyA0OTY3Mjk2IC8gNDI5NDk2NzI5NiA9IDAuMDAxMTYgKDEgaW4gODY1KS5cclxuICAgICAgaWYgKG4gPj0gNC4yOWU5KSB7XHJcbiAgICAgICAgZFtpXSA9IGNyeXB0by5nZXRSYW5kb21WYWx1ZXMobmV3IFVpbnQzMkFycmF5KDEpKVswXTtcclxuICAgICAgfSBlbHNlIHtcclxuXHJcbiAgICAgICAgLy8gMCA8PSBuIDw9IDQyODk5OTk5OTlcclxuICAgICAgICAvLyAwIDw9IChuICUgMWU3KSA8PSA5OTk5OTk5XHJcbiAgICAgICAgcmRbaSsrXSA9IG4gJSAxZTc7XHJcbiAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgLy8gTm9kZS5qcyBzdXBwb3J0aW5nIGNyeXB0by5yYW5kb21CeXRlcy5cclxuICB9IGVsc2UgaWYgKGNyeXB0by5yYW5kb21CeXRlcykge1xyXG5cclxuICAgIC8vIGJ1ZmZlclxyXG4gICAgZCA9IGNyeXB0by5yYW5kb21CeXRlcyhrICo9IDQpO1xyXG5cclxuICAgIGZvciAoOyBpIDwgazspIHtcclxuXHJcbiAgICAgIC8vIDAgPD0gbiA8IDIxNDc0ODM2NDhcclxuICAgICAgbiA9IGRbaV0gKyAoZFtpICsgMV0gPDwgOCkgKyAoZFtpICsgMl0gPDwgMTYpICsgKChkW2kgKyAzXSAmIDB4N2YpIDw8IDI0KTtcclxuXHJcbiAgICAgIC8vIFByb2JhYmlsaXR5IG4gPj0gMi4xNGU5LCBpcyA3NDgzNjQ4IC8gMjE0NzQ4MzY0OCA9IDAuMDAzNSAoMSBpbiAyODYpLlxyXG4gICAgICBpZiAobiA+PSAyLjE0ZTkpIHtcclxuICAgICAgICBjcnlwdG8ucmFuZG9tQnl0ZXMoNCkuY29weShkLCBpKTtcclxuICAgICAgfSBlbHNlIHtcclxuXHJcbiAgICAgICAgLy8gMCA8PSBuIDw9IDIxMzk5OTk5OTlcclxuICAgICAgICAvLyAwIDw9IChuICUgMWU3KSA8PSA5OTk5OTk5XHJcbiAgICAgICAgcmQucHVzaChuICUgMWU3KTtcclxuICAgICAgICBpICs9IDQ7XHJcbiAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBpID0gayAvIDQ7XHJcbiAgfSBlbHNlIHtcclxuICAgIHRocm93IEVycm9yKGNyeXB0b1VuYXZhaWxhYmxlKTtcclxuICB9XHJcblxyXG4gIGsgPSByZFstLWldO1xyXG4gIHNkICU9IExPR19CQVNFO1xyXG5cclxuICAvLyBDb252ZXJ0IHRyYWlsaW5nIGRpZ2l0cyB0byB6ZXJvcyBhY2NvcmRpbmcgdG8gc2QuXHJcbiAgaWYgKGsgJiYgc2QpIHtcclxuICAgIG4gPSBtYXRocG93KDEwLCBMT0dfQkFTRSAtIHNkKTtcclxuICAgIHJkW2ldID0gKGsgLyBuIHwgMCkgKiBuO1xyXG4gIH1cclxuXHJcbiAgLy8gUmVtb3ZlIHRyYWlsaW5nIHdvcmRzIHdoaWNoIGFyZSB6ZXJvLlxyXG4gIGZvciAoOyByZFtpXSA9PT0gMDsgaS0tKSByZC5wb3AoKTtcclxuXHJcbiAgLy8gWmVybz9cclxuICBpZiAoaSA8IDApIHtcclxuICAgIGUgPSAwO1xyXG4gICAgcmQgPSBbMF07XHJcbiAgfSBlbHNlIHtcclxuICAgIGUgPSAtMTtcclxuXHJcbiAgICAvLyBSZW1vdmUgbGVhZGluZyB3b3JkcyB3aGljaCBhcmUgemVybyBhbmQgYWRqdXN0IGV4cG9uZW50IGFjY29yZGluZ2x5LlxyXG4gICAgZm9yICg7IHJkWzBdID09PSAwOyBlIC09IExPR19CQVNFKSByZC5zaGlmdCgpO1xyXG5cclxuICAgIC8vIENvdW50IHRoZSBkaWdpdHMgb2YgdGhlIGZpcnN0IHdvcmQgb2YgcmQgdG8gZGV0ZXJtaW5lIGxlYWRpbmcgemVyb3MuXHJcbiAgICBmb3IgKGsgPSAxLCBuID0gcmRbMF07IG4gPj0gMTA7IG4gLz0gMTApIGsrKztcclxuXHJcbiAgICAvLyBBZGp1c3QgdGhlIGV4cG9uZW50IGZvciBsZWFkaW5nIHplcm9zIG9mIHRoZSBmaXJzdCB3b3JkIG9mIHJkLlxyXG4gICAgaWYgKGsgPCBMT0dfQkFTRSkgZSAtPSBMT0dfQkFTRSAtIGs7XHJcbiAgfVxyXG5cclxuICByLmUgPSBlO1xyXG4gIHIuZCA9IHJkO1xyXG5cclxuICByZXR1cm4gcjtcclxufVxyXG5cclxuXHJcbi8qXHJcbiAqIFJldHVybiBhIG5ldyBEZWNpbWFsIHdob3NlIHZhbHVlIGlzIGB4YCByb3VuZGVkIHRvIGFuIGludGVnZXIgdXNpbmcgcm91bmRpbmcgbW9kZSBgcm91bmRpbmdgLlxyXG4gKlxyXG4gKiBUbyBlbXVsYXRlIGBNYXRoLnJvdW5kYCwgc2V0IHJvdW5kaW5nIHRvIDcgKFJPVU5EX0hBTEZfQ0VJTCkuXHJcbiAqXHJcbiAqIHgge251bWJlcnxzdHJpbmd8RGVjaW1hbH1cclxuICpcclxuICovXHJcbmZ1bmN0aW9uIHJvdW5kKHgpIHtcclxuICByZXR1cm4gZmluYWxpc2UoeCA9IG5ldyB0aGlzKHgpLCB4LmUgKyAxLCB0aGlzLnJvdW5kaW5nKTtcclxufVxyXG5cclxuXHJcbi8qXHJcbiAqIFJldHVyblxyXG4gKiAgIDEgICAgaWYgeCA+IDAsXHJcbiAqICAtMSAgICBpZiB4IDwgMCxcclxuICogICAwICAgIGlmIHggaXMgMCxcclxuICogIC0wICAgIGlmIHggaXMgLTAsXHJcbiAqICAgTmFOICBvdGhlcndpc2VcclxuICpcclxuICogeCB7bnVtYmVyfHN0cmluZ3xEZWNpbWFsfVxyXG4gKlxyXG4gKi9cclxuZnVuY3Rpb24gc2lnbih4KSB7XHJcbiAgeCA9IG5ldyB0aGlzKHgpO1xyXG4gIHJldHVybiB4LmQgPyAoeC5kWzBdID8geC5zIDogMCAqIHgucykgOiB4LnMgfHwgTmFOO1xyXG59XHJcblxyXG5cclxuLypcclxuICogUmV0dXJuIGEgbmV3IERlY2ltYWwgd2hvc2UgdmFsdWUgaXMgdGhlIHNpbmUgb2YgYHhgLCByb3VuZGVkIHRvIGBwcmVjaXNpb25gIHNpZ25pZmljYW50IGRpZ2l0c1xyXG4gKiB1c2luZyByb3VuZGluZyBtb2RlIGByb3VuZGluZ2AuXHJcbiAqXHJcbiAqIHgge251bWJlcnxzdHJpbmd8RGVjaW1hbH0gQSB2YWx1ZSBpbiByYWRpYW5zLlxyXG4gKlxyXG4gKi9cclxuZnVuY3Rpb24gc2luKHgpIHtcclxuICByZXR1cm4gbmV3IHRoaXMoeCkuc2luKCk7XHJcbn1cclxuXHJcblxyXG4vKlxyXG4gKiBSZXR1cm4gYSBuZXcgRGVjaW1hbCB3aG9zZSB2YWx1ZSBpcyB0aGUgaHlwZXJib2xpYyBzaW5lIG9mIGB4YCwgcm91bmRlZCB0byBgcHJlY2lzaW9uYFxyXG4gKiBzaWduaWZpY2FudCBkaWdpdHMgdXNpbmcgcm91bmRpbmcgbW9kZSBgcm91bmRpbmdgLlxyXG4gKlxyXG4gKiB4IHtudW1iZXJ8c3RyaW5nfERlY2ltYWx9IEEgdmFsdWUgaW4gcmFkaWFucy5cclxuICpcclxuICovXHJcbmZ1bmN0aW9uIHNpbmgoeCkge1xyXG4gIHJldHVybiBuZXcgdGhpcyh4KS5zaW5oKCk7XHJcbn1cclxuXHJcblxyXG4vKlxyXG4gKiBSZXR1cm4gYSBuZXcgRGVjaW1hbCB3aG9zZSB2YWx1ZSBpcyB0aGUgc3F1YXJlIHJvb3Qgb2YgYHhgLCByb3VuZGVkIHRvIGBwcmVjaXNpb25gIHNpZ25pZmljYW50XHJcbiAqIGRpZ2l0cyB1c2luZyByb3VuZGluZyBtb2RlIGByb3VuZGluZ2AuXHJcbiAqXHJcbiAqIHgge251bWJlcnxzdHJpbmd8RGVjaW1hbH1cclxuICpcclxuICovXHJcbmZ1bmN0aW9uIHNxcnQoeCkge1xyXG4gIHJldHVybiBuZXcgdGhpcyh4KS5zcXJ0KCk7XHJcbn1cclxuXHJcblxyXG4vKlxyXG4gKiBSZXR1cm4gYSBuZXcgRGVjaW1hbCB3aG9zZSB2YWx1ZSBpcyBgeGAgbWludXMgYHlgLCByb3VuZGVkIHRvIGBwcmVjaXNpb25gIHNpZ25pZmljYW50IGRpZ2l0c1xyXG4gKiB1c2luZyByb3VuZGluZyBtb2RlIGByb3VuZGluZ2AuXHJcbiAqXHJcbiAqIHgge251bWJlcnxzdHJpbmd8RGVjaW1hbH1cclxuICogeSB7bnVtYmVyfHN0cmluZ3xEZWNpbWFsfVxyXG4gKlxyXG4gKi9cclxuZnVuY3Rpb24gc3ViKHgsIHkpIHtcclxuICByZXR1cm4gbmV3IHRoaXMoeCkuc3ViKHkpO1xyXG59XHJcblxyXG5cclxuLypcclxuICogUmV0dXJuIGEgbmV3IERlY2ltYWwgd2hvc2UgdmFsdWUgaXMgdGhlIHN1bSBvZiB0aGUgYXJndW1lbnRzLCByb3VuZGVkIHRvIGBwcmVjaXNpb25gXHJcbiAqIHNpZ25pZmljYW50IGRpZ2l0cyB1c2luZyByb3VuZGluZyBtb2RlIGByb3VuZGluZ2AuXHJcbiAqXHJcbiAqIE9ubHkgdGhlIHJlc3VsdCBpcyByb3VuZGVkLCBub3QgdGhlIGludGVybWVkaWF0ZSBjYWxjdWxhdGlvbnMuXHJcbiAqXHJcbiAqIGFyZ3VtZW50cyB7bnVtYmVyfHN0cmluZ3xEZWNpbWFsfVxyXG4gKlxyXG4gKi9cclxuZnVuY3Rpb24gc3VtKCkge1xyXG4gIHZhciBpID0gMCxcclxuICAgIGFyZ3MgPSBhcmd1bWVudHMsXHJcbiAgICB4ID0gbmV3IHRoaXMoYXJnc1tpXSk7XHJcblxyXG4gIGV4dGVybmFsID0gZmFsc2U7XHJcbiAgZm9yICg7IHgucyAmJiArK2kgPCBhcmdzLmxlbmd0aDspIHggPSB4LnBsdXMoYXJnc1tpXSk7XHJcbiAgZXh0ZXJuYWwgPSB0cnVlO1xyXG5cclxuICByZXR1cm4gZmluYWxpc2UoeCwgdGhpcy5wcmVjaXNpb24sIHRoaXMucm91bmRpbmcpO1xyXG59XHJcblxyXG5cclxuLypcclxuICogUmV0dXJuIGEgbmV3IERlY2ltYWwgd2hvc2UgdmFsdWUgaXMgdGhlIHRhbmdlbnQgb2YgYHhgLCByb3VuZGVkIHRvIGBwcmVjaXNpb25gIHNpZ25pZmljYW50XHJcbiAqIGRpZ2l0cyB1c2luZyByb3VuZGluZyBtb2RlIGByb3VuZGluZ2AuXHJcbiAqXHJcbiAqIHgge251bWJlcnxzdHJpbmd8RGVjaW1hbH0gQSB2YWx1ZSBpbiByYWRpYW5zLlxyXG4gKlxyXG4gKi9cclxuZnVuY3Rpb24gdGFuKHgpIHtcclxuICByZXR1cm4gbmV3IHRoaXMoeCkudGFuKCk7XHJcbn1cclxuXHJcblxyXG4vKlxyXG4gKiBSZXR1cm4gYSBuZXcgRGVjaW1hbCB3aG9zZSB2YWx1ZSBpcyB0aGUgaHlwZXJib2xpYyB0YW5nZW50IG9mIGB4YCwgcm91bmRlZCB0byBgcHJlY2lzaW9uYFxyXG4gKiBzaWduaWZpY2FudCBkaWdpdHMgdXNpbmcgcm91bmRpbmcgbW9kZSBgcm91bmRpbmdgLlxyXG4gKlxyXG4gKiB4IHtudW1iZXJ8c3RyaW5nfERlY2ltYWx9IEEgdmFsdWUgaW4gcmFkaWFucy5cclxuICpcclxuICovXHJcbmZ1bmN0aW9uIHRhbmgoeCkge1xyXG4gIHJldHVybiBuZXcgdGhpcyh4KS50YW5oKCk7XHJcbn1cclxuXHJcblxyXG4vKlxyXG4gKiBSZXR1cm4gYSBuZXcgRGVjaW1hbCB3aG9zZSB2YWx1ZSBpcyBgeGAgdHJ1bmNhdGVkIHRvIGFuIGludGVnZXIuXHJcbiAqXHJcbiAqIHgge251bWJlcnxzdHJpbmd8RGVjaW1hbH1cclxuICpcclxuICovXHJcbmZ1bmN0aW9uIHRydW5jKHgpIHtcclxuICByZXR1cm4gZmluYWxpc2UoeCA9IG5ldyB0aGlzKHgpLCB4LmUgKyAxLCAxKTtcclxufVxyXG5cclxuXHJcblBbU3ltYm9sLmZvcignbm9kZWpzLnV0aWwuaW5zcGVjdC5jdXN0b20nKV0gPSBQLnRvU3RyaW5nO1xyXG5QW1N5bWJvbC50b1N0cmluZ1RhZ10gPSAnRGVjaW1hbCc7XHJcblxyXG4vLyBDcmVhdGUgYW5kIGNvbmZpZ3VyZSBpbml0aWFsIERlY2ltYWwgY29uc3RydWN0b3IuXHJcbmV4cG9ydCB2YXIgRGVjaW1hbCA9IFAuY29uc3RydWN0b3IgPSBjbG9uZShERUZBVUxUUyk7XHJcblxyXG4vLyBDcmVhdGUgdGhlIGludGVybmFsIGNvbnN0YW50cyBmcm9tIHRoZWlyIHN0cmluZyB2YWx1ZXMuXHJcbkxOMTAgPSBuZXcgRGVjaW1hbChMTjEwKTtcclxuUEkgPSBuZXcgRGVjaW1hbChQSSk7XHJcblxyXG5leHBvcnQgZGVmYXVsdCBEZWNpbWFsO1xyXG4iLCAiXG5pbXBvcnQge01hbmFnZWRQcm9wZXJ0aWVzfSBmcm9tIFwiLi9hc3N1bXB0aW9uc1wiO1xuaW1wb3J0IHtfRXhwcn0gZnJvbSBcIi4vZXhwclwiO1xuaW1wb3J0IHtHbG9iYWx9IGZyb20gXCIuL2dsb2JhbFwiO1xuaW1wb3J0IHtfTnVtYmVyX30gZnJvbSBcIi4vbnVtYmVyc1wiO1xuaW1wb3J0IHtnbG9iYWxfcGFyYW1ldGVyc30gZnJvbSBcIi4vcGFyYW1ldGVyc1wiO1xuaW1wb3J0IHtTfSBmcm9tIFwiLi9zaW5nbGV0b25cIjtcblxuZXhwb3J0IGNsYXNzIFBvdyBleHRlbmRzIF9FeHByIHtcbiAgICAvKlxuICAgIERlZmluZXMgdGhlIGV4cHJlc3Npb24geCoqeSBhcyBcInggcmFpc2VkIHRvIGEgcG93ZXIgeVwiXG4gICAgLi4gZGVwcmVjYXRlZDo6IDEuN1xuICAgICAgIFVzaW5nIGFyZ3VtZW50cyB0aGF0IGFyZW4ndCBzdWJjbGFzc2VzIG9mIDpjbGFzczpgfi5FeHByYCBpbiBjb3JlXG4gICAgICAgb3BlcmF0b3JzICg6Y2xhc3M6YH4uTXVsYCwgOmNsYXNzOmB+LkFkZGAsIGFuZCA6Y2xhc3M6YH4uUG93YCkgaXNcbiAgICAgICBkZXByZWNhdGVkLiBTZWUgOnJlZjpgbm9uLWV4cHItYXJncy1kZXByZWNhdGVkYCBmb3IgZGV0YWlscy5cbiAgICBTaW5nbGV0b24gZGVmaW5pdGlvbnMgaW52b2x2aW5nICgwLCAxLCAtMSwgb28sIC1vbywgSSwgLUkpOlxuICAgICstLS0tLS0tLS0tLS0tLSstLS0tLS0tLS0rLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0rXG4gICAgfCBleHByICAgICAgICAgfCB2YWx1ZSAgIHwgcmVhc29uICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHxcbiAgICArPT09PT09PT09PT09PT0rPT09PT09PT09Kz09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09K1xuICAgIHwgeioqMCAgICAgICAgIHwgMSAgICAgICB8IEFsdGhvdWdoIGFyZ3VtZW50cyBvdmVyIDAqKjAgZXhpc3QsIHNlZSBbMl0uICB8XG4gICAgKy0tLS0tLS0tLS0tLS0tKy0tLS0tLS0tLSstLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLStcbiAgICB8IHoqKjEgICAgICAgICB8IHogICAgICAgfCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfFxuICAgICstLS0tLS0tLS0tLS0tLSstLS0tLS0tLS0rLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0rXG4gICAgfCAoLW9vKSoqKC0xKSAgfCAwICAgICAgIHwgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHxcbiAgICArLS0tLS0tLS0tLS0tLS0rLS0tLS0tLS0tKy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tK1xuICAgIHwgKC0xKSoqLTEgICAgIHwgLTEgICAgICB8ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB8XG4gICAgKy0tLS0tLS0tLS0tLS0tKy0tLS0tLS0tLSstLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLStcbiAgICB8IFMuWmVybyoqLTEgICB8IHpvbyAgICAgfCBUaGlzIGlzIG5vdCBzdHJpY3RseSB0cnVlLCBhcyAwKiotMSBtYXkgYmUgICAgfFxuICAgIHwgICAgICAgICAgICAgIHwgICAgICAgICB8IHVuZGVmaW5lZCwgYnV0IGlzIGNvbnZlbmllbnQgaW4gc29tZSBjb250ZXh0cyB8XG4gICAgfCAgICAgICAgICAgICAgfCAgICAgICAgIHwgd2hlcmUgdGhlIGJhc2UgaXMgYXNzdW1lZCB0byBiZSBwb3NpdGl2ZS4gICAgIHxcbiAgICArLS0tLS0tLS0tLS0tLS0rLS0tLS0tLS0tKy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tK1xuICAgIHwgMSoqLTEgICAgICAgIHwgMSAgICAgICB8ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB8XG4gICAgKy0tLS0tLS0tLS0tLS0tKy0tLS0tLS0tLSstLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLStcbiAgICB8IG9vKiotMSAgICAgICB8IDAgICAgICAgfCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfFxuICAgICstLS0tLS0tLS0tLS0tLSstLS0tLS0tLS0rLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0rXG4gICAgfCAwKipvbyAgICAgICAgfCAwICAgICAgIHwgQmVjYXVzZSBmb3IgYWxsIGNvbXBsZXggbnVtYmVycyB6IG5lYXIgICAgICAgIHxcbiAgICB8ICAgICAgICAgICAgICB8ICAgICAgICAgfCAwLCB6KipvbyAtPiAwLiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfFxuICAgICstLS0tLS0tLS0tLS0tLSstLS0tLS0tLS0rLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0rXG4gICAgfCAwKiotb28gICAgICAgfCB6b28gICAgIHwgVGhpcyBpcyBub3Qgc3RyaWN0bHkgdHJ1ZSwgYXMgMCoqb28gbWF5IGJlICAgIHxcbiAgICB8ICAgICAgICAgICAgICB8ICAgICAgICAgfCBvc2NpbGxhdGluZyBiZXR3ZWVuIHBvc2l0aXZlIGFuZCBuZWdhdGl2ZSAgICAgfFxuICAgIHwgICAgICAgICAgICAgIHwgICAgICAgICB8IHZhbHVlcyBvciByb3RhdGluZyBpbiB0aGUgY29tcGxleCBwbGFuZS4gICAgICB8XG4gICAgfCAgICAgICAgICAgICAgfCAgICAgICAgIHwgSXQgaXMgY29udmVuaWVudCwgaG93ZXZlciwgd2hlbiB0aGUgYmFzZSAgICAgIHxcbiAgICB8ICAgICAgICAgICAgICB8ICAgICAgICAgfCBpcyBwb3NpdGl2ZS4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfFxuICAgICstLS0tLS0tLS0tLS0tLSstLS0tLS0tLS0rLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0rXG4gICAgfCAxKipvbyAgICAgICAgfCBuYW4gICAgIHwgQmVjYXVzZSB0aGVyZSBhcmUgdmFyaW91cyBjYXNlcyB3aGVyZSAgICAgICAgIHxcbiAgICB8IDEqKi1vbyAgICAgICB8ICAgICAgICAgfCBsaW0oeCh0KSx0KT0xLCBsaW0oeSh0KSx0KT1vbyAob3IgLW9vKSwgICAgICAgfFxuICAgIHwgICAgICAgICAgICAgIHwgICAgICAgICB8IGJ1dCBsaW0oIHgodCkqKnkodCksIHQpICE9IDEuICBTZWUgWzNdLiAgICAgICB8XG4gICAgKy0tLS0tLS0tLS0tLS0tKy0tLS0tLS0tLSstLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLStcbiAgICB8IGIqKnpvbyAgICAgICB8IG5hbiAgICAgfCBCZWNhdXNlIGIqKnogaGFzIG5vIGxpbWl0IGFzIHogLT4gem9vICAgICAgICAgfFxuICAgICstLS0tLS0tLS0tLS0tLSstLS0tLS0tLS0rLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0rXG4gICAgfCAoLTEpKipvbyAgICAgfCBuYW4gICAgIHwgQmVjYXVzZSBvZiBvc2NpbGxhdGlvbnMgaW4gdGhlIGxpbWl0LiAgICAgICAgIHxcbiAgICB8ICgtMSkqKigtb28pICB8ICAgICAgICAgfCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfFxuICAgICstLS0tLS0tLS0tLS0tLSstLS0tLS0tLS0rLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0rXG4gICAgfCBvbyoqb28gICAgICAgfCBvbyAgICAgIHwgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHxcbiAgICArLS0tLS0tLS0tLS0tLS0rLS0tLS0tLS0tKy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tK1xuICAgIHwgb28qKi1vbyAgICAgIHwgMCAgICAgICB8ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB8XG4gICAgKy0tLS0tLS0tLS0tLS0tKy0tLS0tLS0tLSstLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLStcbiAgICB8ICgtb28pKipvbyAgICB8IG5hbiAgICAgfCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfFxuICAgIHwgKC1vbykqKi1vbyAgIHwgICAgICAgICB8ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB8XG4gICAgKy0tLS0tLS0tLS0tLS0tKy0tLS0tLS0tLSstLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLStcbiAgICB8IG9vKipJICAgICAgICB8IG5hbiAgICAgfCBvbyoqZSBjb3VsZCBwcm9iYWJseSBiZSBiZXN0IHRob3VnaHQgb2YgYXMgICAgfFxuICAgIHwgKC1vbykqKkkgICAgIHwgICAgICAgICB8IHRoZSBsaW1pdCBvZiB4KiplIGZvciByZWFsIHggYXMgeCB0ZW5kcyB0byAgICB8XG4gICAgfCAgICAgICAgICAgICAgfCAgICAgICAgIHwgb28uIElmIGUgaXMgSSwgdGhlbiB0aGUgbGltaXQgZG9lcyBub3QgZXhpc3QgIHxcbiAgICB8ICAgICAgICAgICAgICB8ICAgICAgICAgfCBhbmQgbmFuIGlzIHVzZWQgdG8gaW5kaWNhdGUgdGhhdC4gICAgICAgICAgICAgfFxuICAgICstLS0tLS0tLS0tLS0tLSstLS0tLS0tLS0rLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0rXG4gICAgfCBvbyoqKDErSSkgICAgfCB6b28gICAgIHwgSWYgdGhlIHJlYWwgcGFydCBvZiBlIGlzIHBvc2l0aXZlLCB0aGVuIHRoZSAgIHxcbiAgICB8ICgtb28pKiooMStJKSB8ICAgICAgICAgfCBsaW1pdCBvZiBhYnMoeCoqZSkgaXMgb28uIFNvIHRoZSBsaW1pdCB2YWx1ZSAgfFxuICAgIHwgICAgICAgICAgICAgIHwgICAgICAgICB8IGlzIHpvby4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB8XG4gICAgKy0tLS0tLS0tLS0tLS0tKy0tLS0tLS0tLSstLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLStcbiAgICB8IG9vKiooLTErSSkgICB8IDAgICAgICAgfCBJZiB0aGUgcmVhbCBwYXJ0IG9mIGUgaXMgbmVnYXRpdmUsIHRoZW4gdGhlICAgfFxuICAgIHwgLW9vKiooLTErSSkgIHwgICAgICAgICB8IGxpbWl0IGlzIDAuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB8XG4gICAgKy0tLS0tLS0tLS0tLS0tKy0tLS0tLS0tLSstLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLStcbiAgICBCZWNhdXNlIHN5bWJvbGljIGNvbXB1dGF0aW9ucyBhcmUgbW9yZSBmbGV4aWJsZSB0aGFuIGZsb2F0aW5nIHBvaW50XG4gICAgY2FsY3VsYXRpb25zIGFuZCB3ZSBwcmVmZXIgdG8gbmV2ZXIgcmV0dXJuIGFuIGluY29ycmVjdCBhbnN3ZXIsXG4gICAgd2UgY2hvb3NlIG5vdCB0byBjb25mb3JtIHRvIGFsbCBJRUVFIDc1NCBjb252ZW50aW9ucy4gIFRoaXMgaGVscHNcbiAgICB1cyBhdm9pZCBleHRyYSB0ZXN0LWNhc2UgY29kZSBpbiB0aGUgY2FsY3VsYXRpb24gb2YgbGltaXRzLlxuICAgIFNlZSBBbHNvXG4gICAgPT09PT09PT1cbiAgICBzeW1weS5jb3JlLm51bWJlcnMuSW5maW5pdHlcbiAgICBzeW1weS5jb3JlLm51bWJlcnMuTmVnYXRpdmVJbmZpbml0eVxuICAgIHN5bXB5LmNvcmUubnVtYmVycy5OYU5cbiAgICBSZWZlcmVuY2VzXG4gICAgPT09PT09PT09PVxuICAgIC4uIFsxXSBodHRwczovL2VuLndpa2lwZWRpYS5vcmcvd2lraS9FeHBvbmVudGlhdGlvblxuICAgIC4uIFsyXSBodHRwczovL2VuLndpa2lwZWRpYS5vcmcvd2lraS9FeHBvbmVudGlhdGlvbiNaZXJvX3RvX3RoZV9wb3dlcl9vZl96ZXJvXG4gICAgLi4gWzNdIGh0dHBzOi8vZW4ud2lraXBlZGlhLm9yZy93aWtpL0luZGV0ZXJtaW5hdGVfZm9ybXNcbiAgICAqL1xuICAgIHN0YXRpYyBpc19Qb3cgPSB0cnVlO1xuICAgIF9fc2xvdHNfXyA9IFtcImlzX2NvbW11dGF0aXZlXCJdO1xuXG4gICAgLy8gdG8tZG86IG5lZWRzIHN1cHBvcnQgZm9yIGVeeFxuICAgIGNvbnN0cnVjdG9yKGI6IGFueSwgZTogYW55LCBldmFsdWF0ZTogYm9vbGVhbiA9IHVuZGVmaW5lZCwgc2ltcGxpZnk6IGJvb2xlYW4gPSB0cnVlKSB7XG4gICAgICAgIHN1cGVyKGIsIGUpO1xuICAgICAgICB0aGlzLl9hcmdzID0gW2IsIGVdO1xuICAgICAgICBpZiAodHlwZW9mIGV2YWx1YXRlID09PSBcInVuZGVmaW5lZFwiKSB7XG4gICAgICAgICAgICBldmFsdWF0ZSA9IGdsb2JhbF9wYXJhbWV0ZXJzLmV2YWx1YXRlO1xuICAgICAgICB9XG4gICAgICAgIGlmIChzaW1wbGlmeSkge1xuICAgICAgICAgICAgaWYgKGV2YWx1YXRlKSB7XG4gICAgICAgICAgICAgICAgaWYgKGUgPT09IFMuQ29tcGxleEluZmluaXR5KSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBTLk5hTjtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgaWYgKGUgPT09IFMuSW5maW5pdHkpIHtcbiAgICAgICAgICAgICAgICAgICAgLy8gdGhpcyBwYXJ0IGlzIG5vdCBmdWxseSBkb25lXG4gICAgICAgICAgICAgICAgICAgIC8vIHNob3VsZCBiZSB1cGRhdGVkIHRvIHVzZSByZWxhdGlvbmFsXG4gICAgICAgICAgICAgICAgICAgIGlmIChiLmlzX3Bvc2l0aXZlKCkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBTLkluZmluaXR5O1xuICAgICAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKGIuaXNfemVybygpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gUy5aZXJvO1xuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGIuaXNfZmluaXRlKCkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gUy5Db21wbGV4SW5maW5pdHk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBTLk5hTjtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBpZiAoZSA9PT0gUy5aZXJvKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBTLk9uZTtcbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKGUgPT09IFMuT25lKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBiO1xuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoZSA9PT0gUy5OZWdhdGl2ZU9uZSAmJiAhYikge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gUy5Db21wbGV4SW5maW5pdHk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmICgoZS5pc19TeW1ib2woKSAmJiBlLmlzX2ludGVnZXIoKSB8fFxuICAgICAgICAgICAgICAgICAgICBlLmlzX0ludGVnZXIoKSAmJiAoYi5pc19OdW1iZXIoKSAmJlxuICAgICAgICAgICAgICAgICAgICBiLmlzX011bCgpIHx8IGIuaXNfTnVtYmVyKCkpKSAmJiAoZS5pc19leHRlbmRlZF9uZWdhdGl2ZSA9PT0gdHJ1ZSkpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGUuaXNfZXZlbigpIHx8IGUuaXNfZXZlbigpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBiID0gYi5fX211bF9fKFMuTmVnYXRpdmVPbmUpO1xuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIG5ldyBQb3coYi5fX211bF9fKFMuTmVnYXRpdmVPbmUpLCBlKS5fX211bF9fKFMuTmVnYXRpdmVPbmUpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIDAuXG4gICAgICAgICAgICAgICAgaWYgKGIgPT09IFMuTmFOIHx8IGUgPT09IFMuTmFOKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBTLk5hTjtcbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKGIgPT09IFMuT25lKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChlLmlzX2luZmluaXRlKCkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBTLk5hTjtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gUy5PbmU7XG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmIChlLmlzX051bWJlcigpICYmIGIuaXNfTnVtYmVyKCkpIHtcbiAgICAgICAgICAgICAgICAgICAgLy8gYmFzZSBFIHN0dWZmIG5vdCB5ZXQgaW1wbGVtZW50ZWRcbiAgICAgICAgICAgICAgICAgICAgY29uc3Qgb2JqID0gYi5fZXZhbF9wb3dlcihlKTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHR5cGVvZiBvYmogIT09IFwidW5kZWZpbmVkXCIpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIG9iai5pc19jb21tdXRhdGl2ZSA9ICgpID0+IChiLmlzX2NvbW11dGF0aXZlKCkgJiYgZS5pc19jb21tdXRhdGl2ZSgpKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBvYmo7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5pc19jb21tdXRhdGl2ZSA9ICgpID0+IChiLmlzX2NvbW11dGF0aXZlKCkgJiYgZS5pc19jb21tdXRhdGl2ZSgpKTtcbiAgICB9XG5cbiAgICBhc19iYXNlX2V4cCgpIHtcbiAgICAgICAgY29uc3QgYiA9IHRoaXMuX2FyZ3NbMF07XG4gICAgICAgIGNvbnN0IGUgPSB0aGlzLl9hcmdzWzFdO1xuICAgICAgICBpZiAoYi5pc19SYXRpb25hbCAmJiBiLnAgPT09IDEgJiYgYi5xICE9PSAxKSB7XG4gICAgICAgICAgICBjb25zdCBwMSA9IF9OdW1iZXJfLm5ldyhiLnEpO1xuICAgICAgICAgICAgY29uc3QgcDIgPSBlLl9fbXVsX18oUy5OZWdhdGl2ZU9uZSk7XG4gICAgICAgICAgICByZXR1cm4gW3AxLCBwMl07XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIFtiLCBlXTtcbiAgICB9XG5cbiAgICBzdGF0aWMgX25ldyhiOiBhbnksIGU6IGFueSkge1xuICAgICAgICByZXR1cm4gbmV3IFBvdyhiLCBlKTtcbiAgICB9XG5cbiAgICAvLyBXQiBhZGRpdGlvbiBmb3IgamFzbWluZSB0ZXN0c1xuICAgIHRvU3RyaW5nKCkge1xuICAgICAgICBjb25zdCBiID0gdGhpcy5fYXJnc1swXS50b1N0cmluZygpO1xuICAgICAgICBjb25zdCBlID0gdGhpcy5fYXJnc1sxXS50b1N0cmluZygpO1xuICAgICAgICByZXR1cm4gYiArIFwiXlwiICsgZTtcbiAgICB9XG59XG5cbk1hbmFnZWRQcm9wZXJ0aWVzLnJlZ2lzdGVyKFBvdyk7XG5HbG9iYWwucmVnaXN0ZXIoXCJQb3dcIiwgUG93Ll9uZXcpO1xuXG4vLyBpbXBsZW1lbnRlZCBkaWZmZXJlbnQgdGhhbiBzeW1weSwgYnV0IGhhcyBzYW1lIGZ1bmN0aW9uYWxpdHkgKGZvciBub3cpXG5leHBvcnQgZnVuY3Rpb24gbnJvb3QoeTogbnVtYmVyLCBuOiBudW1iZXIpIHtcbiAgICBjb25zdCB4ID0gTWF0aC5mbG9vcih5ICoqICgxIC8gbikpO1xuICAgIHJldHVybiBbeCwgeCoqbiA9PT0geV07XG59XG4iLCAiLypcbk5vdGFibGUgY2hhbmdlcyBtYWRlIChhbmQgbm90ZXMpOlxuLSBOdW1iZXIgY2xhc3NlcyByZWdpc3RlcmVkIGFmdGVyIHRoZXkgYXJlIGRlZmluZWRcbi0gRmxvYXQgaXMgaGFuZGVsZWQgZW50aXJlbHkgYnkgZGVjaW1hbC5qcywgYW5kIG5vdyBvbmx5IHRha2VzIHByZWNpc2lvbiBpblxuICAjIG9mIGRlY2ltYWwgcG9pbnRzXG4tIE5vdGU6IG9ubHkgbWV0aG9kcyBuZWNlc3NhcnkgZm9yIGFkZCwgbXVsLCBhbmQgcG93IGhhdmUgYmVlbiBpbXBsZW1lbnRlZFxuKi9cblxuLy8gYmFzaWMgaW1wbGVtZW50YXRpb25zIG9ubHkgLSBubyB1dGlsaXR5IGFkZGVkIHlldFxuaW1wb3J0IHtfQXRvbWljRXhwcn0gZnJvbSBcIi4vZXhwclwiO1xuaW1wb3J0IHtOdW1iZXJLaW5kfSBmcm9tIFwiLi9raW5kXCI7XG5pbXBvcnQge01hbmFnZWRQcm9wZXJ0aWVzfSBmcm9tIFwiLi9hc3N1bXB0aW9uc1wiO1xuaW1wb3J0IHtnbG9iYWxfcGFyYW1ldGVyc30gZnJvbSBcIi4vcGFyYW1ldGVyc1wiO1xuaW1wb3J0IHtBZGR9IGZyb20gXCIuL2FkZFwiO1xuaW1wb3J0IHtTLCBTaW5nbGV0b259IGZyb20gXCIuL3NpbmdsZXRvblwiO1xuaW1wb3J0IERlY2ltYWwgZnJvbSBcImRlY2ltYWwuanNcIjtcbmltcG9ydCB7YXNfaW50fSBmcm9tIFwiLi4vdXRpbGl0aWVzL21pc2NcIjtcbmltcG9ydCB7UG93fSBmcm9tIFwiLi9wb3dlclwiO1xuaW1wb3J0IHtHbG9iYWx9IGZyb20gXCIuL2dsb2JhbFwiO1xuaW1wb3J0IHtkaXZtb2QsIGZhY3RvcmludCwgZmFjdG9ycmF0LCBwZXJmZWN0X3Bvd2VyfSBmcm9tIFwiLi4vbnRoZW9yeS9mYWN0b3JfXCI7XG5pbXBvcnQge0hhc2hEaWN0fSBmcm9tIFwiLi91dGlsaXR5XCI7XG5pbXBvcnQge011bH0gZnJvbSBcIi4vbXVsXCI7XG5cbi8qXG51dGlsaXR5IGZ1bmN0aW9uc1xuXG5UaGVzZSBhcmUgc29tZXdoYXQgd3JpdHRlbiBkaWZmZXJlbnRseSB0aGFuIGluIHN5bXB5ICh3aGljaCBkZXBlbmRzIG9uIG1wbWF0aClcbmJ1dCB0aGV5IHByb3ZpZGUgdGhlIHNhbWUgZnVuY3Rpb25hbGl0eVxuKi9cblxuZnVuY3Rpb24gaWdjZCh4OiBudW1iZXIsIHk6IG51bWJlcikge1xuICAgIHdoaWxlICh5KSB7XG4gICAgICAgIGNvbnN0IHQgPSB5O1xuICAgICAgICB5ID0geCAlIHk7XG4gICAgICAgIHggPSB0O1xuICAgIH1cbiAgICByZXR1cm4geDtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGludF9udGhyb290KHk6IG51bWJlciwgbjogbnVtYmVyKSB7XG4gICAgY29uc3QgeCA9IE1hdGguZmxvb3IoeSoqKDEvbikpO1xuICAgIGNvbnN0IGlzZXhhY3QgPSB4KipuID09PSB5O1xuICAgIHJldHVybiBbeCwgaXNleGFjdF07XG59XG5cbi8vIHR1cm4gYSBmbG9hdCB0byBhIHJhdGlvbmFsIC0+IHJlcGxpYWNhdGVzIG1wbWF0aCBmdW5jdGlvbmFsaXR5IGJ1dCB3ZSBzaG91bGRcbi8vIHByb2JhYmx5IGZpbmQgYSBsaWJyYXJ5IHRvIGRvIHRoaXMgZXZlbnR1YWxseVxuZnVuY3Rpb24gdG9SYXRpbyhuOiBhbnksIGVwczogbnVtYmVyKSB7XG4gICAgY29uc3QgZ2NkZSA9IChlOiBudW1iZXIsIHg6IG51bWJlciwgeTogbnVtYmVyKSA9PiB7XG4gICAgICAgIGNvbnN0IF9nY2Q6IGFueSA9IChhOiBudW1iZXIsIGI6IG51bWJlcikgPT4gKGIgPCBlID8gYSA6IF9nY2QoYiwgYSAlIGIpKTtcbiAgICAgICAgcmV0dXJuIF9nY2QoTWF0aC5hYnMoeCksIE1hdGguYWJzKHkpKTtcbiAgICB9O1xuICAgIGNvbnN0IGMgPSBnY2RlKEJvb2xlYW4oZXBzKSA/IGVwcyA6ICgxIC8gMTAwMDApLCAxLCBuKTtcbiAgICByZXR1cm4gW01hdGguZmxvb3IobiAvIGMpLCBNYXRoLmZsb29yKDEgLyBjKV07XG59XG5cbmZ1bmN0aW9uIGlnY2RleChhOiBudW1iZXIgPSB1bmRlZmluZWQsIGI6IG51bWJlciA9IHVuZGVmaW5lZCkge1xuICAgIGlmICh0eXBlb2YgYSA9PT0gXCJ1bmRlZmluZWRcIiAmJiB0eXBlb2YgYiA9PT0gXCJ1bmRlZmluZWRcIikge1xuICAgICAgICByZXR1cm4gWzAsIDEsIDBdO1xuICAgIH1cblxuICAgIGlmICh0eXBlb2YgYSA9PT0gXCJ1bmRlZmluZWRcIikge1xuICAgICAgICByZXR1cm4gWzAsIE1hdGguZmxvb3IoYiAvIE1hdGguYWJzKGIpKSwgTWF0aC5hYnMoYildO1xuICAgIH1cblxuICAgIGlmICh0eXBlb2YgYiA9PT0gXCJ1bmRlZmluZWRcIikge1xuICAgICAgICByZXR1cm4gW01hdGguZmxvb3IoYSAvIE1hdGguYWJzKGEpKSwgMCwgTWF0aC5hYnMoYSldO1xuICAgIH1cbiAgICBsZXQgeF9zaWduO1xuICAgIGxldCB5X3NpZ247XG4gICAgaWYgKGEgPCAwKSB7XG4gICAgICAgIGEgPSAtMTtcbiAgICAgICAgeF9zaWduID0gLTE7XG4gICAgfSBlbHNlIHtcbiAgICAgICAgeF9zaWduID0gMTtcbiAgICB9XG4gICAgaWYgKGIgPCAwKSB7XG4gICAgICAgIGIgPSAtYjtcbiAgICAgICAgeV9zaWduID0gLTE7XG4gICAgfSBlbHNlIHtcbiAgICAgICAgeV9zaWduID0gMTtcbiAgICB9XG5cbiAgICBsZXQgW3gsIHksIHIsIHNdID0gWzEsIDAsIDAsIDFdO1xuICAgIGxldCBjOyBsZXQgcTtcbiAgICB3aGlsZSAoYikge1xuICAgICAgICBbYywgcV0gPSBbYSAlIGIsIE1hdGguZmxvb3IoYSAvIGIpXTtcbiAgICAgICAgW2EsIGIsIHIsIHMsIHgsIHldID0gW2IsIGMsIHggLSBxICogciwgeSAtIHEgKiBzLCByLCBzXTtcbiAgICB9XG4gICAgcmV0dXJuIFt4ICogeF9zaWduLCB5ICogeV9zaWduLCBhXTtcbn1cblxuZnVuY3Rpb24gbW9kX2ludmVyc2UoYTogYW55LCBtOiBhbnkpIHtcbiAgICBsZXQgYyA9IHVuZGVmaW5lZDtcbiAgICBbYSwgbV0gPSBbYXNfaW50KGEpLCBhc19pbnQobSldO1xuICAgIGlmIChtICE9PSAxICYmIG0gIT09IC0xKSB7XG4gICAgICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBuby11bnVzZWQtdmFyc1xuICAgICAgICBjb25zdCBbeCwgYiwgZ10gPSBpZ2NkZXgoYSwgbSk7XG4gICAgICAgIGlmIChnID09PSAxKSB7XG4gICAgICAgICAgICBjID0geCAmIG07XG4gICAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIGM7XG59XG5cbkdsb2JhbC5yZWdpc3RlcmZ1bmMoXCJtb2RfaW52ZXJzZVwiLCBtb2RfaW52ZXJzZSk7XG5cbmNsYXNzIF9OdW1iZXJfIGV4dGVuZHMgX0F0b21pY0V4cHIge1xuICAgIC8qXG4gICAgUmVwcmVzZW50cyBhdG9taWMgbnVtYmVycyBpbiBTeW1QeS5cbiAgICBFeHBsYW5hdGlvblxuICAgID09PT09PT09PT09XG4gICAgRmxvYXRpbmcgcG9pbnQgbnVtYmVycyBhcmUgcmVwcmVzZW50ZWQgYnkgdGhlIEZsb2F0IGNsYXNzLlxuICAgIFJhdGlvbmFsIG51bWJlcnMgKG9mIGFueSBzaXplKSBhcmUgcmVwcmVzZW50ZWQgYnkgdGhlIFJhdGlvbmFsIGNsYXNzLlxuICAgIEludGVnZXIgbnVtYmVycyAob2YgYW55IHNpemUpIGFyZSByZXByZXNlbnRlZCBieSB0aGUgSW50ZWdlciBjbGFzcy5cbiAgICBGbG9hdCBhbmQgUmF0aW9uYWwgYXJlIHN1YmNsYXNzZXMgb2YgTnVtYmVyOyBJbnRlZ2VyIGlzIGEgc3ViY2xhc3NcbiAgICBvZiBSYXRpb25hbC5cbiAgICBGb3IgZXhhbXBsZSwgYGAyLzNgYCBpcyByZXByZXNlbnRlZCBhcyBgYFJhdGlvbmFsKDIsIDMpYGAgd2hpY2ggaXNcbiAgICBhIGRpZmZlcmVudCBvYmplY3QgZnJvbSB0aGUgZmxvYXRpbmcgcG9pbnQgbnVtYmVyIG9idGFpbmVkIHdpdGhcbiAgICBQeXRob24gZGl2aXNpb24gYGAyLzNgYC4gRXZlbiBmb3IgbnVtYmVycyB0aGF0IGFyZSBleGFjdGx5XG4gICAgcmVwcmVzZW50ZWQgaW4gYmluYXJ5LCB0aGVyZSBpcyBhIGRpZmZlcmVuY2UgYmV0d2VlbiBob3cgdHdvIGZvcm1zLFxuICAgIHN1Y2ggYXMgYGBSYXRpb25hbCgxLCAyKWBgIGFuZCBgYEZsb2F0KDAuNSlgYCwgYXJlIHVzZWQgaW4gU3ltUHkuXG4gICAgVGhlIHJhdGlvbmFsIGZvcm0gaXMgdG8gYmUgcHJlZmVycmVkIGluIHN5bWJvbGljIGNvbXB1dGF0aW9ucy5cbiAgICBPdGhlciBraW5kcyBvZiBudW1iZXJzLCBzdWNoIGFzIGFsZ2VicmFpYyBudW1iZXJzIGBgc3FydCgyKWBgIG9yXG4gICAgY29tcGxleCBudW1iZXJzIGBgMyArIDQqSWBgLCBhcmUgbm90IGluc3RhbmNlcyBvZiBOdW1iZXIgY2xhc3MgYXNcbiAgICB0aGV5IGFyZSBub3QgYXRvbWljLlxuICAgIFNlZSBBbHNvXG4gICAgPT09PT09PT1cbiAgICBGbG9hdCwgSW50ZWdlciwgUmF0aW9uYWxcbiAgICAqL1xuICAgIHN0YXRpYyBpc19jb21tdXRhdGl2ZSA9IHRydWU7XG4gICAgc3RhdGljIGlzX251bWJlciA9IHRydWU7XG4gICAgc3RhdGljIGlzX051bWJlciA9IHRydWU7XG4gICAgc3RhdGljIGtpbmQgPSBOdW1iZXJLaW5kO1xuXG4gICAgc3RhdGljIG5ldyguLi5vYmo6IGFueSkge1xuICAgICAgICBpZiAob2JqLmxlbmd0aCA9PT0gMSkge1xuICAgICAgICAgICAgb2JqID0gb2JqWzBdO1xuICAgICAgICB9XG4gICAgICAgIGlmIChvYmogaW5zdGFuY2VvZiBfTnVtYmVyXykge1xuICAgICAgICAgICAgcmV0dXJuIG9iajtcbiAgICAgICAgfSBlbHNlIGlmICh0eXBlb2Ygb2JqID09PSBcIm51bWJlclwiICYmICFOdW1iZXIuaXNJbnRlZ2VyKG9iaikgfHwgb2JqIGluc3RhbmNlb2YgRGVjaW1hbCB8fCB0eXBlb2Ygb2JqID09PSBcInN0cmluZ1wiKSB7XG4gICAgICAgICAgICByZXR1cm4gbmV3IEZsb2F0KG9iaik7XG4gICAgICAgIH0gZWxzZSBpZiAoTnVtYmVyLmlzSW50ZWdlcihvYmopKSB7XG4gICAgICAgICAgICByZXR1cm4gbmV3IEludGVnZXIob2JqKTtcbiAgICAgICAgfSBlbHNlIGlmIChvYmoubGVuZ3RoID09PSAyKSB7XG4gICAgICAgICAgICByZXR1cm4gbmV3IFJhdGlvbmFsKG9ialswXSwgb2JqWzFdKTtcbiAgICAgICAgfSBlbHNlIGlmICh0eXBlb2Ygb2JqID09PSBcInN0cmluZ1wiKSB7XG4gICAgICAgICAgICBjb25zdCBfb2JqID0gb2JqLnRvTG93ZXJDYXNlKCk7XG4gICAgICAgICAgICBpZiAoX29iaiA9PT0gXCJuYW5cIikge1xuICAgICAgICAgICAgICAgIHJldHVybiBTLk5hTjtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoX29iaiA9PT0gXCJpbmZcIikge1xuICAgICAgICAgICAgICAgIHJldHVybiBTLkluZmluaXR5O1xuICAgICAgICAgICAgfSBlbHNlIGlmIChfb2JqID09PSBcIitpbmZcIikge1xuICAgICAgICAgICAgICAgIHJldHVybiBTLkluZmluaXR5O1xuICAgICAgICAgICAgfSBlbHNlIGlmIChfb2JqID09PSBcIi1pbmZcIikge1xuICAgICAgICAgICAgICAgIHJldHVybiBTLk5lZ2F0aXZlSW5maW5pdHk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcImFyZ3VtZW50IGZvciBudW1iZXIgaXMgaW52YWxpZFwiKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJhcmd1bWVudCBmb3IgbnVtYmVyIGlzIGludmFsaWRcIik7XG4gICAgfVxuXG4gICAgYXNfY29lZmZfTXVsKHJhdGlvbmFsOiBib29sZWFuID0gZmFsc2UpIHtcbiAgICAgICAgaWYgKHJhdGlvbmFsICYmICF0aGlzLmlzX1JhdGlvbmFsKSB7XG4gICAgICAgICAgICByZXR1cm4gW1MuT25lLCB0aGlzXTtcbiAgICAgICAgfVxuICAgICAgICBpZiAodGhpcykge1xuICAgICAgICAgICAgcmV0dXJuIFt0aGlzLCBTLk9uZV07XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gW1MuT25lLCB0aGlzXTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGFzX2NvZWZmX0FkZCgpIHtcbiAgICAgICAgcmV0dXJuIFt0aGlzLCBTLlplcm9dO1xuICAgIH1cblxuICAgIC8vIE5PVEU6IFRIRVNFIE1FVEhPRFMgQVJFIE5PVCBZRVQgSU1QTEVNRU5URUQgSU4gVEhFIFNVUEVSQ0xBU1NcblxuICAgIF9fYWRkX18ob3RoZXI6IGFueSkge1xuICAgICAgICBpZiAob3RoZXIgaW5zdGFuY2VvZiBfTnVtYmVyXyAmJiBnbG9iYWxfcGFyYW1ldGVycy5ldmFsdWF0ZSkge1xuICAgICAgICAgICAgaWYgKG90aGVyID09PSBTLk5hTikge1xuICAgICAgICAgICAgICAgIHJldHVybiBTLk5hTjtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAob3RoZXIgPT09IFMuSW5maW5pdHkpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gUy5JbmZpbml0eTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAob3RoZXIgPT09IFMuTmVnYXRpdmVJbmZpbml0eSkge1xuICAgICAgICAgICAgICAgIHJldHVybiBTLk5lZ2F0aXZlSW5maW5pdHk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHN1cGVyLl9fYWRkX18ob3RoZXIpO1xuICAgIH1cblxuICAgIF9fc3ViX18ob3RoZXI6IGFueSkge1xuICAgICAgICBpZiAob3RoZXIgaW5zdGFuY2VvZiBfTnVtYmVyXyAmJiBnbG9iYWxfcGFyYW1ldGVycy5ldmFsdWF0ZSkge1xuICAgICAgICAgICAgaWYgKG90aGVyID09PSBTLk5hTikge1xuICAgICAgICAgICAgICAgIHJldHVybiBTLk5hTjtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAob3RoZXIgPT09IFMuSW5maW5pdHkpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gUy5OZWdhdGl2ZUluZmluaXR5O1xuICAgICAgICAgICAgfSBlbHNlIGlmIChvdGhlciA9PT0gUy5OZWdhdGl2ZUluZmluaXR5KSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIFMuSW5maW5pdHk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHN1cGVyLl9fc3ViX18ob3RoZXIpO1xuICAgIH1cblxuICAgIF9fbXVsX18ob3RoZXI6IGFueSkge1xuICAgICAgICBpZiAob3RoZXIgaW5zdGFuY2VvZiBfTnVtYmVyXyAmJiBnbG9iYWxfcGFyYW1ldGVycy5ldmFsdWF0ZSkge1xuICAgICAgICAgICAgY29uc3QgY2xzOiBhbnkgPSB0aGlzLmNvbnN0cnVjdG9yO1xuICAgICAgICAgICAgaWYgKG90aGVyID09PSBTLk5hbikge1xuICAgICAgICAgICAgICAgIHJldHVybiBTLk5hbjtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAob3RoZXIgPT09IFMuSW5maW5pdHkpIHtcbiAgICAgICAgICAgICAgICBpZiAoY2xzLmlzX3plcm8pIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFMuTmFOO1xuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoY2xzLmlzX3Bvc2l0aXZlKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBTLkluZmluaXR5O1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBTLk5lZ2F0aXZlSW5maW5pdHk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSBlbHNlIGlmIChvdGhlciA9PT0gUy5OZWdhdGl2ZUluZmluaXR5KSB7XG4gICAgICAgICAgICAgICAgaWYgKGNscy5pc196ZXJvKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBTLk5hTjtcbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKGNscy5pc19wb3NpdGl2ZSkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gUy5OZWdhdGl2ZUluZmluaXR5O1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBTLkluZmluaXR5O1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gc3VwZXIuX19tdWxfXyhvdGhlcik7XG4gICAgfVxuICAgIF9fdHJ1ZWRpdl9fKG90aGVyOiBhbnkpIHtcbiAgICAgICAgaWYgKG90aGVyIGluc3RhbmNlb2YgX051bWJlcl8gJiYgZ2xvYmFsX3BhcmFtZXRlcnMuZXZhbHVhdGUpIHtcbiAgICAgICAgICAgIGlmIChvdGhlciA9PT0gUy5OYU4pIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gUy5OYU47XG4gICAgICAgICAgICB9IGVsc2UgaWYgKG90aGVyID09PSBTLkluZmluaXR5IHx8IG90aGVyID09PSBTLk5lZ2F0aXZlSW5maW5pdHkpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gUy5aZXJvO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBzdXBlci5fX3RydWVkaXZfXyhvdGhlcik7XG4gICAgfVxuXG4gICAgZXZhbF9ldmFsZihwcmVjOiBudW1iZXIpIHtcbiAgICAgICAgcmV0dXJuIG5ldyBGbG9hdCh0aGlzLl9mbG9hdF92YWwocHJlYyksIHByZWMpO1xuICAgIH1cblxuICAgIF9mbG9hdF92YWwocHJlYzogbnVtYmVyKTogYW55IHtcbiAgICAgICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgICB9XG59O1xuXG4vLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbmV3LWNhcFxuTWFuYWdlZFByb3BlcnRpZXMucmVnaXN0ZXIoX051bWJlcl8pO1xuR2xvYmFsLnJlZ2lzdGVyKFwiX051bWJlcl9cIiwgX051bWJlcl8ubmV3KTtcblxuY2xhc3MgRmxvYXQgZXh0ZW5kcyBfTnVtYmVyXyB7XG4gICAgLypcbiAgICAobm90IGNvcHlpbmcgc3ltcHkgY29tbWVudCBiZWNhdXNlIHRoaXMgaW1wbGVtZW50YXRpb24gaXMgdmVyeSBkaWZmZXJlbnQpXG4gICAgc2VlIGhlYWRlciBjb21tZW50IGZvciBjaGFuZ2VzXG4gICAgKi9cbiAgICBfX3Nsb3RzX186IGFueVtdID0gW1wiX21wZl9cIiwgXCJfcHJlY1wiXTtcbiAgICBfbXBmXzogW251bWJlciwgbnVtYmVyLCBudW1iZXIsIG51bWJlcl07XG4gICAgc3RhdGljIGlzX3JhdGlvbmFsOiBhbnkgPSB1bmRlZmluZWQ7XG4gICAgc3RhdGljIGlzX2lycmF0aW9uYWw6IGFueSA9IHVuZGVmaW5lZDtcbiAgICBzdGF0aWMgaXNfbnVtYmVyID0gdHJ1ZTtcbiAgICBzdGF0aWMgaXNfcmVhbCA9IHRydWU7XG4gICAgc3RhdGljIGlzX2V4dGVuZGVkX3JlYWwgPSB0cnVlO1xuICAgIHN0YXRpYyBpc19GbG9hdCA9IHRydWU7XG4gICAgZGVjaW1hbDogRGVjaW1hbDtcbiAgICBwcmVjOiBudW1iZXI7XG5cbiAgICBjb25zdHJ1Y3RvcihudW06IGFueSwgcHJlYzogYW55ID0gMTUpIHtcbiAgICAgICAgc3VwZXIoKTtcbiAgICAgICAgdGhpcy5wcmVjID0gcHJlYztcbiAgICAgICAgaWYgKHR5cGVvZiBudW0gIT09IFwidW5kZWZpbmVkXCIpIHtcbiAgICAgICAgICAgIGlmIChudW0gaW5zdGFuY2VvZiBGbG9hdCkge1xuICAgICAgICAgICAgICAgIHRoaXMuZGVjaW1hbCA9IG51bS5kZWNpbWFsO1xuICAgICAgICAgICAgfSBlbHNlIGlmIChudW0gaW5zdGFuY2VvZiBEZWNpbWFsKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5kZWNpbWFsID0gbnVtO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICB0aGlzLmRlY2ltYWwgPSBuZXcgRGVjaW1hbChudW0pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgX19hZGRfXyhvdGhlcjogYW55KSB7XG4gICAgICAgIGlmIChnbG9iYWxfcGFyYW1ldGVycy5ldmFsdWF0ZSAmJiBvdGhlciBpbnN0YW5jZW9mIF9OdW1iZXJfKSB7XG4gICAgICAgICAgICBjb25zdCB2YWwgPSBvdGhlci5fZmxvYXRfdmFsKHRoaXMucHJlYyk7XG4gICAgICAgICAgICByZXR1cm4gbmV3IEZsb2F0KERlY2ltYWwuc2V0KHtwcmVjaXNpb246IHRoaXMucHJlY30pLmFkZCh0aGlzLmRlY2ltYWwsIHZhbC5kZWNpbWFsKSwgdGhpcy5wcmVjKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gc3VwZXIuX19hZGRfXyhvdGhlcik7XG4gICAgfVxuXG4gICAgX19zdWJfXyhvdGhlcjogYW55KSB7XG4gICAgICAgIGlmIChnbG9iYWxfcGFyYW1ldGVycy5ldmFsdWF0ZSAmJiBvdGhlciBpbnN0YW5jZW9mIF9OdW1iZXJfKSB7XG4gICAgICAgICAgICBjb25zdCB2YWwgPSBvdGhlci5fZmxvYXRfdmFsKHRoaXMucHJlYyk7XG4gICAgICAgICAgICByZXR1cm4gbmV3IEZsb2F0KERlY2ltYWwuc2V0KHtwcmVjaXNpb246IHRoaXMucHJlY30pLnN1Yih0aGlzLmRlY2ltYWwsIHZhbC5kZWNpbWFsKSwgdGhpcy5wcmVjKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gc3VwZXIuX19zdWJfXyhvdGhlcik7XG4gICAgfVxuXG4gICAgX19tdWxfXyhvdGhlcjogYW55KSB7XG4gICAgICAgIGlmIChnbG9iYWxfcGFyYW1ldGVycy5ldmFsdWF0ZSAmJiBvdGhlciBpbnN0YW5jZW9mIF9OdW1iZXJfKSB7XG4gICAgICAgICAgICBjb25zdCB2YWwgPSBvdGhlci5fZmxvYXRfdmFsKHRoaXMucHJlYyk7XG4gICAgICAgICAgICByZXR1cm4gbmV3IEZsb2F0KERlY2ltYWwuc2V0KHtwcmVjaXNpb246IHRoaXMucHJlY30pLm11bCh0aGlzLmRlY2ltYWwsIHZhbC5kZWNpbWFsKSwgdGhpcy5wcmVjKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gc3VwZXIuX19tdWxfXyhvdGhlcik7XG4gICAgfVxuXG4gICAgX190cnVlZGl2X18ob3RoZXI6IGFueSkge1xuICAgICAgICBpZiAoZ2xvYmFsX3BhcmFtZXRlcnMuZXZhbHVhdGUgJiYgb3RoZXIgaW5zdGFuY2VvZiBfTnVtYmVyXykge1xuICAgICAgICAgICAgY29uc3QgdmFsID0gb3RoZXIuX2Zsb2F0X3ZhbCh0aGlzLnByZWMpO1xuICAgICAgICAgICAgcmV0dXJuIG5ldyBGbG9hdChEZWNpbWFsLnNldCh7cHJlY2lzaW9uOiB0aGlzLnByZWN9KS5kaXYodGhpcy5kZWNpbWFsLCB2YWwuZGVjaW1hbCksIHRoaXMucHJlYyk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHN1cGVyLl9fZGl2X18ob3RoZXIpO1xuICAgIH1cblxuICAgIF9ldmFsX2lzX25lZ2F0aXZlKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5kZWNpbWFsLmxlc3NUaGFuKDApO1xuICAgIH1cblxuICAgIF9ldmFsX2lzX3Bvc2l0aXZlKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5kZWNpbWFsLmdyZWF0ZXJUaGFuKDApO1xuICAgIH1cblxuICAgIC8vIHJldHVybiBuZXcgRmxvYXQoRGVjaW1hbC5zZXQoe3ByZWNpc2lvbjogdGhpcy5wcmVjfSkucG93KHRoaXMuZGVjaW1hbCwgb3RoZXIuZXZhbF9ldmFsZih0aGlzLnByZWMpLmRlY2ltYWwpLCB0aGlzLnByZWMpO1xuXG4gICAgX2V2YWxfcG93ZXIoZXhwdDogYW55KSB7XG4gICAgICAgIGlmICh0aGlzID09PSBTLlplcm8pIHtcbiAgICAgICAgICAgIGlmIChleHB0LmlzX2V4dGVuZGVkX3Bvc2l0aXZlKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICAgICAgICB9IGlmIChleHB0LmlzX2V4dGVuZGVkX25lZ2F0aXZlKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIFMuQ29tcGxleEluZmluaXR5O1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGlmIChleHB0IGluc3RhbmNlb2YgX051bWJlcl8pIHtcbiAgICAgICAgICAgIGlmIChleHB0IGluc3RhbmNlb2YgSW50ZWdlcikge1xuICAgICAgICAgICAgICAgIGNvbnN0IHByZWMgPSB0aGlzLnByZWM7XG4gICAgICAgICAgICAgICAgcmV0dXJuIG5ldyBGbG9hdChEZWNpbWFsLnNldCh7cHJlY2lzaW9uOiB0aGlzLnByZWN9KS5wb3codGhpcy5kZWNpbWFsLCBleHB0LnApLCBwcmVjKTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoZXhwdCBpbnN0YW5jZW9mIFJhdGlvbmFsICYmXG4gICAgICAgICAgICAgICAgZXhwdC5wID09PSAxICYmIGV4cHQucSAlIDIgIT09IDAgJiYgdGhpcy5pc19uZWdhdGl2ZSgpKSB7XG4gICAgICAgICAgICAgICAgY29uc3QgbmVncGFydCA9ICh0aGlzLl9fbXVsX18oUy5OZWdhdGl2ZU9uZSkpLl9ldmFsX3Bvd2VyKGV4cHQpO1xuICAgICAgICAgICAgICAgIHJldHVybiBuZXcgTXVsKHRydWUsIHRydWUsIG5lZ3BhcnQsIG5ldyBQb3coUy5OZWdhdGl2ZU9uZSwgZXhwdCwgZmFsc2UpKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGNvbnN0IHZhbCA9IGV4cHQuX2Zsb2F0X3ZhbCh0aGlzLnByZWMpLmRlY2ltYWw7XG4gICAgICAgICAgICBjb25zdCByZXMgPSBEZWNpbWFsLnNldCh7cHJlY2lzaW9uOiB0aGlzLnByZWN9KS5wb3codGhpcy5kZWNpbWFsLCB2YWwpO1xuICAgICAgICAgICAgaWYgKHJlcy5pc05hTigpKSB7XG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiY29tcGxleCBhbmQgaW1hZ2luYXJ5IG51bWJlcnMgbm90IHlldCBpbXBsZW1lbnRlZFwiKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiBuZXcgRmxvYXQocmVzKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIF9mbG9hdF92YWwocHJlYzogbnVtYmVyKTogYW55IHtcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuXG4gICAgaW52ZXJzZSgpIHtcbiAgICAgICAgcmV0dXJuIG5ldyBGbG9hdCgxLyh0aGlzLmRlY2ltYWwgYXMgYW55KSk7XG4gICAgfVxuXG4gICAgX2V2YWxfaXNfZmluaXRlKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5kZWNpbWFsLmlzRmluaXRlKCk7XG4gICAgfVxuXG4gICAgdG9TdHJpbmcoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmRlY2ltYWwudG9TdHJpbmcoKVxuICAgIH1cbn1cblxuTWFuYWdlZFByb3BlcnRpZXMucmVnaXN0ZXIoRmxvYXQpO1xuXG5cbmNsYXNzIFJhdGlvbmFsIGV4dGVuZHMgX051bWJlcl8ge1xuICAgIHN0YXRpYyBpc19yZWFsID0gdHJ1ZTtcbiAgICBzdGF0aWMgaXNfaW50ZWdlciA9IGZhbHNlO1xuICAgIHN0YXRpYyBpc19yYXRpb25hbCA9IHRydWU7XG4gICAgc3RhdGljIGlzX251bWJlciA9IHRydWU7XG4gICAgcDogbnVtYmVyO1xuICAgIHE6IG51bWJlcjtcbiAgICBfX3Nsb3RzX186IGFueVtdID0gW1wicFwiLCBcInFcIl07XG5cbiAgICBzdGF0aWMgaXNfUmF0aW9uYWwgPSB0cnVlO1xuXG5cbiAgICBjb25zdHJ1Y3RvcihwOiBhbnksIHE6IGFueSA9IHVuZGVmaW5lZCwgZ2NkOiBudW1iZXIgPSB1bmRlZmluZWQsIHNpbXBsaWZ5OiBib29sZWFuID0gdHJ1ZSkge1xuICAgICAgICBzdXBlcigpO1xuICAgICAgICBpZiAodHlwZW9mIHEgPT09IFwidW5kZWZpbmVkXCIpIHtcbiAgICAgICAgICAgIGlmIChwIGluc3RhbmNlb2YgUmF0aW9uYWwpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gcDtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgaWYgKHR5cGVvZiBwID09PSBcIm51bWJlclwiICYmIHAgJSAxICE9PSAwKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBuZXcgUmF0aW9uYWwodG9SYXRpbyhwLCAwLjAwMDEpKTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge31cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHEgPSAxO1xuICAgICAgICAgICAgZ2NkID0gMTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoIU51bWJlci5pc0ludGVnZXIocCkpIHtcbiAgICAgICAgICAgIHAgPSBuZXcgUmF0aW9uYWwocCk7XG4gICAgICAgICAgICBxICo9IHAucTtcbiAgICAgICAgICAgIHAgPSBwLnA7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKCFOdW1iZXIuaXNJbnRlZ2VyKHEpKSB7XG4gICAgICAgICAgICBxID0gbmV3IFJhdGlvbmFsKHEpO1xuICAgICAgICAgICAgcCAqPSBxLnE7XG4gICAgICAgICAgICBxID0gcS5wO1xuICAgICAgICB9XG4gICAgICAgIGlmIChxID09PSAwKSB7XG4gICAgICAgICAgICBpZiAocCA9PT0gMCkge1xuICAgICAgICAgICAgICAgIHJldHVybiBTLk5hbjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiBTLkNvbXBsZXhJbmZpbml0eTtcbiAgICAgICAgfVxuICAgICAgICBpZiAocSA8IDApIHtcbiAgICAgICAgICAgIHEgPSAtcTtcbiAgICAgICAgICAgIHAgPSAtcDtcbiAgICAgICAgfVxuICAgICAgICBpZiAodHlwZW9mIGdjZCA9PT0gXCJ1bmRlZmluZWRcIikge1xuICAgICAgICAgICAgZ2NkID0gaWdjZChNYXRoLmFicyhwKSwgcSk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGdjZCA+IDEpIHtcbiAgICAgICAgICAgIHAgPSBwL2djZDtcbiAgICAgICAgICAgIHEgPSBxL2djZDtcbiAgICAgICAgfVxuICAgICAgICBpZiAocSA9PT0gMSAmJiBzaW1wbGlmeSkge1xuICAgICAgICAgICAgcmV0dXJuIG5ldyBJbnRlZ2VyKHApO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMucCA9IHA7XG4gICAgICAgIHRoaXMucSA9IHE7XG4gICAgfVxuXG4gICAgaGFzaEtleSgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuY29uc3RydWN0b3IubmFtZSArIHRoaXMucCArIHRoaXMucTtcbiAgICB9XG5cbiAgICBfX2FkZF9fKG90aGVyOiBhbnkpIHtcbiAgICAgICAgaWYgKGdsb2JhbF9wYXJhbWV0ZXJzLmV2YWx1YXRlKSB7XG4gICAgICAgICAgICBpZiAob3RoZXIgaW5zdGFuY2VvZiBJbnRlZ2VyKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIG5ldyBSYXRpb25hbCh0aGlzLnAgKyB0aGlzLnEgKiBvdGhlci5wLCB0aGlzLnEsIDEpO1xuICAgICAgICAgICAgfSBlbHNlIGlmIChvdGhlciBpbnN0YW5jZW9mIFJhdGlvbmFsKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIG5ldyBSYXRpb25hbCh0aGlzLnAgKiBvdGhlci5xICsgdGhpcy5xICogb3RoZXIucCwgdGhpcy5xICogb3RoZXIucSk7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKG90aGVyIGluc3RhbmNlb2YgRmxvYXQpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gb3RoZXIuX19hZGRfXyh0aGlzKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHN1cGVyLl9fYWRkX18ob3RoZXIpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBzdXBlci5fX2FkZF9fKG90aGVyKTtcbiAgICB9XG5cbiAgICBfX3JhZGRfXyhvdGhlcjogYW55KSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9fYWRkX18ob3RoZXIpO1xuICAgIH1cblxuICAgIF9fc3ViX18ob3RoZXI6IGFueSkge1xuICAgICAgICBpZiAoZ2xvYmFsX3BhcmFtZXRlcnMuZXZhbHVhdGUpIHtcbiAgICAgICAgICAgIGlmIChvdGhlciBpbnN0YW5jZW9mIEludGVnZXIpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gbmV3IFJhdGlvbmFsKHRoaXMucSAqIG90aGVyLnAgLSB0aGlzLnAsIHRoaXMucSwgMSk7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKG90aGVyIGluc3RhbmNlb2YgUmF0aW9uYWwpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gbmV3IFJhdGlvbmFsKHRoaXMucCAqIG90aGVyLnEgLSB0aGlzLnEgKiBvdGhlci5wLCB0aGlzLnEgKiBvdGhlci5xKTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAob3RoZXIgaW5zdGFuY2VvZiBGbG9hdCkge1xuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLl9fbXVsX18oUy5OZWdhdGl2ZU9uZSkuX19hZGRfXyhvdGhlcik7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHJldHVybiBzdXBlci5fX3N1Yl9fKG90aGVyKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gc3VwZXIuX19zdWJfXyhvdGhlcik7XG4gICAgfVxuXG4gICAgX19yc3ViX18ob3RoZXI6IGFueSkge1xuICAgICAgICBpZiAoZ2xvYmFsX3BhcmFtZXRlcnMuZXZhbHVhdGUpIHtcbiAgICAgICAgICAgIGlmIChvdGhlciBpbnN0YW5jZW9mIEludGVnZXIpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gbmV3IFJhdGlvbmFsKHRoaXMucCAtIHRoaXMucSAqIG90aGVyLnAsIHRoaXMucSwgMSk7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKG90aGVyIGluc3RhbmNlb2YgUmF0aW9uYWwpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gbmV3IFJhdGlvbmFsKHRoaXMucSAqIG90aGVyLnAgLSB0aGlzLnAgKiBvdGhlci5xLCB0aGlzLnEgKiBvdGhlci5xKTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAob3RoZXIgaW5zdGFuY2VvZiBGbG9hdCkge1xuICAgICAgICAgICAgICAgIHJldHVybiBvdGhlci5fX211bF9fKFMuTmVnYXRpdmVPbmUpLl9fYWRkX18odGhpcyk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHJldHVybiBzdXBlci5fX3JzdWJfXyhvdGhlcik7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHN1cGVyLl9fcnN1Yl9fKG90aGVyKTtcbiAgICB9XG5cbiAgICBfX211bF9fKG90aGVyOiBhbnkpIHtcbiAgICAgICAgaWYgKGdsb2JhbF9wYXJhbWV0ZXJzLmV2YWx1YXRlKSB7XG4gICAgICAgICAgICBpZiAob3RoZXIgaW5zdGFuY2VvZiBJbnRlZ2VyKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIG5ldyBSYXRpb25hbCh0aGlzLnAgKiBvdGhlci5wLCB0aGlzLnEsIGlnY2Qob3RoZXIucCwgdGhpcy5xKSk7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKG90aGVyIGluc3RhbmNlb2YgUmF0aW9uYWwpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gbmV3IFJhdGlvbmFsKHRoaXMucCAqIG90aGVyLnAsIHRoaXMucSAqIG90aGVyLnEsIGlnY2QodGhpcy5wLCBvdGhlci5xKSAqIGlnY2QodGhpcy5xLCBvdGhlci5wKSk7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKG90aGVyIGluc3RhbmNlb2YgRmxvYXQpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gb3RoZXIuX19tdWxfXyh0aGlzKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHN1cGVyLl9fbXVsX18ob3RoZXIpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBzdXBlci5fX211bF9fKG90aGVyKTtcbiAgICB9XG5cbiAgICBfX3JtdWxfXyhvdGhlcjogYW55KSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9fbXVsX18ob3RoZXIpO1xuICAgIH1cblxuICAgIF9fdHJ1ZWRpdl9fKG90aGVyOiBhbnkpIHtcbiAgICAgICAgaWYgKGdsb2JhbF9wYXJhbWV0ZXJzLmV2YWx1YXRlKSB7XG4gICAgICAgICAgICBpZiAob3RoZXIgaW5zdGFuY2VvZiBJbnRlZ2VyKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIG5ldyBSYXRpb25hbCh0aGlzLnAsIHRoaXMucSAqIG90aGVyLnAsIGlnY2QodGhpcy5wLCBvdGhlci5wKSk7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKG90aGVyIGluc3RhbmNlb2YgUmF0aW9uYWwpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gbmV3IFJhdGlvbmFsKHRoaXMucCAqIG90aGVyLnEsIHRoaXMucSAqIG90aGVyLnAsIGlnY2QodGhpcy5wLCBvdGhlci5wKSAqIGlnY2QodGhpcy5xLCBvdGhlci5xKSk7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKG90aGVyIGluc3RhbmNlb2YgRmxvYXQpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5fX211bF9fKG90aGVyLmludmVyc2UoKSk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHJldHVybiBzdXBlci5fX3RydWVkaXZfXyhvdGhlcik7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHN1cGVyLl9fdHJ1ZWRpdl9fKG90aGVyKTtcbiAgICB9XG5cbiAgICBfX3J0cnVlZGl2X18ob3RoZXI6IGFueSkge1xuICAgICAgICBpZiAoZ2xvYmFsX3BhcmFtZXRlcnMuZXZhbHVhdGUpIHtcbiAgICAgICAgICAgIGlmIChvdGhlciBpbnN0YW5jZW9mIEludGVnZXIpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gbmV3IFJhdGlvbmFsKG90aGVyLnAgKiB0aGlzLnEsIHRoaXMucCwgaWdjZCh0aGlzLnAsIG90aGVyLnApKTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAob3RoZXIgaW5zdGFuY2VvZiBSYXRpb25hbCkge1xuICAgICAgICAgICAgICAgIHJldHVybiBuZXcgUmF0aW9uYWwob3RoZXIucCAqIHRoaXMucSwgb3RoZXIucSAqIHRoaXMucCwgaWdjZCh0aGlzLnAsIG90aGVyLnApICogaWdjZCh0aGlzLnEsIG90aGVyLnEpKTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAob3RoZXIgaW5zdGFuY2VvZiBGbG9hdCkge1xuICAgICAgICAgICAgICAgIHJldHVybiBvdGhlci5fX211bF9fKFMuT25lLl9fdHJ1ZWRpdl9fKHRoaXMpKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHN1cGVyLl9fcnRydWVkaXZfXyhvdGhlcik7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHN1cGVyLl9fcnRydWVkaXZfXyhvdGhlcik7XG4gICAgfVxuXG5cbiAgICBfZXZhbF9wb3dlcihleHB0OiBhbnkpIHtcbiAgICAgICAgaWYgKGV4cHQgaW5zdGFuY2VvZiBfTnVtYmVyXykge1xuICAgICAgICAgICAgaWYgKGV4cHQgaW5zdGFuY2VvZiBGbG9hdCkge1xuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLmV2YWxfZXZhbGYoZXhwdC5wcmVjKS5fZXZhbF9wb3dlcihleHB0KTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoZXhwdCBpbnN0YW5jZW9mIEludGVnZXIpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gbmV3IFJhdGlvbmFsKHRoaXMucCAqKiBleHB0LnAsIHRoaXMucSAqKiBleHB0LnAsIDEpO1xuICAgICAgICAgICAgfSBlbHNlIGlmIChleHB0IGluc3RhbmNlb2YgUmF0aW9uYWwpIHtcbiAgICAgICAgICAgICAgICBsZXQgaW50cGFydCA9IE1hdGguZmxvb3IoZXhwdC5wIC8gZXhwdC5xKTtcbiAgICAgICAgICAgICAgICBpZiAoaW50cGFydCkge1xuICAgICAgICAgICAgICAgICAgICBpbnRwYXJ0Kys7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHJlbWZyYWNwYXJ0ID0gaW50cGFydCAqIGV4cHQucSAtIGV4cHQucDtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgcmF0ZnJhY3BhcnQgPSBuZXcgUmF0aW9uYWwocmVtZnJhY3BhcnQsIGV4cHQucSk7XG4gICAgICAgICAgICAgICAgICAgIGlmICh0aGlzLnAgIT09IDEpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBtYXgtbGVuXG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gbmV3IEludGVnZXIodGhpcy5wKS5fZXZhbF9wb3dlcihleHB0KS5fX211bF9fKG5ldyBJbnRlZ2VyKHRoaXMucSkpLl9ldmFsX3Bvd2VyKHJhdGZyYWNwYXJ0KS5fX211bF9fKG5ldyBSYXRpb25hbCgxLCB0aGlzLnEgKiogaW50cGFydCwgMSkpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBuZXcgSW50ZWdlcih0aGlzLnEpLl9ldmFsX3Bvd2VyKHJhdGZyYWNwYXJ0KS5fX211bF9fKG5ldyBSYXRpb25hbCgxLCB0aGlzLnEgKiogaW50cGFydCwgMSkpO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHJlbWZyYWNwYXJ0ID0gZXhwdC5xIC0gZXhwdC5wO1xuICAgICAgICAgICAgICAgICAgICBjb25zdCByYXRmcmFjcGFydCA9IG5ldyBSYXRpb25hbChyZW1mcmFjcGFydCwgZXhwdC5xKTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXMucCAhPT0gMSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG1heC1sZW5cbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IHAxID0gbmV3IEludGVnZXIodGhpcy5wKS5fZXZhbF9wb3dlcihleHB0KTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IHAyID0gbmV3IEludGVnZXIodGhpcy5xKS5fZXZhbF9wb3dlcihyYXRmcmFjcGFydCk7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gcDEuX19tdWxfXyhwMikuX19tdWxfXyhuZXcgUmF0aW9uYWwoMSwgdGhpcy5xLCAxKSk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIG5ldyBJbnRlZ2VyKHRoaXMucSkuX2V2YWxfcG93ZXIocmF0ZnJhY3BhcnQpLl9fbXVsX18obmV3IFJhdGlvbmFsKDEsIHRoaXMucSwgMSkpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgIGFzX2NvZWZmX0FkZCgpIHtcbiAgICAgICAgcmV0dXJuIFt0aGlzLCBTLlplcm9dO1xuICAgIH1cblxuICAgIF9mbG9hdF92YWwocHJlYzogbnVtYmVyKTogYW55IHtcbiAgICAgICAgY29uc3QgYSA9IG5ldyBEZWNpbWFsKHRoaXMucCk7XG4gICAgICAgIGNvbnN0IGIgPSBuZXcgRGVjaW1hbCh0aGlzLnEpO1xuICAgICAgICByZXR1cm4gbmV3IEZsb2F0KERlY2ltYWwuc2V0KHtwcmVjaXNpb246IHByZWN9KS5kaXYoYSwgYikpO1xuICAgIH1cbiAgICBfYXNfbnVtZXJfZGVub20oKSB7XG4gICAgICAgIHJldHVybiBbbmV3IEludGVnZXIodGhpcy5wKSwgbmV3IEludGVnZXIodGhpcy5xKV07XG4gICAgfVxuXG4gICAgZmFjdG9ycyhsaW1pdDogYW55ID0gdW5kZWZpbmVkKSB7XG4gICAgICAgIHJldHVybiBmYWN0b3JyYXQodGhpcywgbGltaXQpO1xuICAgIH1cblxuICAgIF9ldmFsX2lzX25lZ2F0aXZlKCkge1xuICAgICAgICBpZiAodGhpcy5wIDwgMCAmJiB0aGlzLnEgPiAwKSB7XG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIF9ldmFsX2lzX3Bvc2l0aXZlKCkge1xuICAgICAgICByZXR1cm4gIXRoaXMuX2V2YWxfaXNfbmVnYXRpdmUoKTtcbiAgICB9XG5cbiAgICBfZXZhbF9pc19vZGQoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLnAgJSAyICE9PSAwO1xuICAgIH1cblxuICAgIF9ldmFsX2lzX2V2ZW4oKSB7XG4gICAgICAgIHJldHVybiB0aGlzLnAgJSAyID09PSAwO1xuICAgIH1cblxuICAgIF9ldmFsX2lzX2Zpbml0ZSgpIHtcbiAgICAgICAgcmV0dXJuICEodGhpcy5wID09PSBTLkluZmluaXR5IHx8IHRoaXMucCA9PT0gUy5OZWdhdGl2ZUluZmluaXR5KTtcbiAgICB9XG5cbiAgICBlcShvdGhlcjogUmF0aW9uYWwpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMucCA9PT0gb3RoZXIucCAmJiB0aGlzLnEgPT09IG90aGVyLnE7XG4gICAgfVxuXG4gICAgdG9TdHJpbmcoKSB7XG4gICAgICAgIHJldHVybiBTdHJpbmcodGhpcy5wKSArIFwiL1wiICsgU3RyaW5nKHRoaXMucSlcbiAgICB9XG59O1xuXG4vLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbmV3LWNhcFxuTWFuYWdlZFByb3BlcnRpZXMucmVnaXN0ZXIoUmF0aW9uYWwpO1xuXG5jbGFzcyBJbnRlZ2VyIGV4dGVuZHMgUmF0aW9uYWwge1xuICAgIC8qXG4gICAgUmVwcmVzZW50cyBpbnRlZ2VyIG51bWJlcnMgb2YgYW55IHNpemUuXG4gICAgRXhhbXBsZXNcbiAgICA9PT09PT09PVxuICAgID4+PiBmcm9tIHN5bXB5IGltcG9ydCBJbnRlZ2VyXG4gICAgPj4+IEludGVnZXIoMylcbiAgICAzXG4gICAgSWYgYSBmbG9hdCBvciBhIHJhdGlvbmFsIGlzIHBhc3NlZCB0byBJbnRlZ2VyLCB0aGUgZnJhY3Rpb25hbCBwYXJ0XG4gICAgd2lsbCBiZSBkaXNjYXJkZWQ7IHRoZSBlZmZlY3QgaXMgb2Ygcm91bmRpbmcgdG93YXJkIHplcm8uXG4gICAgPj4+IEludGVnZXIoMy44KVxuICAgIDNcbiAgICA+Pj4gSW50ZWdlcigtMy44KVxuICAgIC0zXG4gICAgQSBzdHJpbmcgaXMgYWNjZXB0YWJsZSBpbnB1dCBpZiBpdCBjYW4gYmUgcGFyc2VkIGFzIGFuIGludGVnZXI6XG4gICAgPj4+IEludGVnZXIoXCI5XCIgKiAyMClcbiAgICA5OTk5OTk5OTk5OTk5OTk5OTk5OVxuICAgIEl0IGlzIHJhcmVseSBuZWVkZWQgdG8gZXhwbGljaXRseSBpbnN0YW50aWF0ZSBhbiBJbnRlZ2VyLCBiZWNhdXNlXG4gICAgUHl0aG9uIGludGVnZXJzIGFyZSBhdXRvbWF0aWNhbGx5IGNvbnZlcnRlZCB0byBJbnRlZ2VyIHdoZW4gdGhleVxuICAgIGFyZSB1c2VkIGluIFN5bVB5IGV4cHJlc3Npb25zLlxuICAgIFwiXCJcIlxuICAgICovXG4gICAgc3RhdGljIGlzX2ludGVnZXIgPSB0cnVlO1xuICAgIHN0YXRpYyBpc19JbnRlZ2VyID0gdHJ1ZTtcbiAgICBfX3Nsb3RzX186IGFueVtdID0gW107XG4gICAgY29uc3RydWN0b3IocDogbnVtYmVyKSB7XG4gICAgICAgIHN1cGVyKHAsIHVuZGVmaW5lZCwgdW5kZWZpbmVkLCBmYWxzZSk7XG4gICAgICAgIHRoaXMucCA9IHA7XG4gICAgICAgIGlmIChwID09PSAxKSB7XG4gICAgICAgICAgICByZXR1cm4gUy5PbmU7XG4gICAgICAgIH0gZWxzZSBpZiAocCA9PT0gMCkge1xuICAgICAgICAgICAgcmV0dXJuIFMuWmVybztcbiAgICAgICAgfSBlbHNlIGlmIChwID09PSAtMSkge1xuICAgICAgICAgICAgcmV0dXJuIFMuTmVnYXRpdmVPbmU7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBmYWN0b3JzKGxpbWl0OiBhbnkgPSB1bmRlZmluZWQpIHtcbiAgICAgICAgcmV0dXJuIGZhY3RvcmludCh0aGlzLnAsIGxpbWl0KTtcbiAgICB9XG5cbiAgICBfX2FkZF9fKG90aGVyOiBhbnkpOiBhbnkge1xuICAgICAgICBpZiAoZ2xvYmFsX3BhcmFtZXRlcnMuZXZhbHVhdGUpIHtcbiAgICAgICAgICAgIGlmIChOdW1iZXIuaXNJbnRlZ2VyKG90aGVyKSkge1xuICAgICAgICAgICAgICAgIHJldHVybiBuZXcgSW50ZWdlcih0aGlzLnAgKyBvdGhlcik7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKG90aGVyIGluc3RhbmNlb2YgSW50ZWdlcikge1xuICAgICAgICAgICAgICAgIHJldHVybiBuZXcgSW50ZWdlcih0aGlzLnAgKyBvdGhlci5wKTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAob3RoZXIgaW5zdGFuY2VvZiBSYXRpb25hbCkge1xuICAgICAgICAgICAgICAgIHJldHVybiBuZXcgUmF0aW9uYWwodGhpcy5wICogb3RoZXIucSArIG90aGVyLnAsIG90aGVyLnEsIDEpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gc3VwZXIuX19hZGRfXyhvdGhlcik7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gbmV3IEFkZCh0cnVlLCB0cnVlLCB0aGlzLCBvdGhlcik7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBfX3JhZGRfXyhvdGhlcjogYW55KTogYW55IHtcbiAgICAgICAgaWYgKGdsb2JhbF9wYXJhbWV0ZXJzLmV2YWx1YXRlKSB7XG4gICAgICAgICAgICBpZiAoTnVtYmVyLmlzSW50ZWdlcihvdGhlcikpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gbmV3IEludGVnZXIob3RoZXIgKyB0aGlzLnApO1xuICAgICAgICAgICAgfSBlbHNlIGlmIChvdGhlciBpbnN0YW5jZW9mIFJhdGlvbmFsKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIG5ldyBSYXRpb25hbChvdGhlci5wICsgdGhpcy5wICogb3RoZXIucSwgb3RoZXIucSwgMSk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHJldHVybiBzdXBlci5fX3JhZGRfXyhvdGhlcik7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gc3VwZXIuX19yYWRkX18ob3RoZXIpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgX19zdWJfXyhvdGhlcjogYW55KTogYW55IHtcbiAgICAgICAgaWYgKGdsb2JhbF9wYXJhbWV0ZXJzLmV2YWx1YXRlKSB7XG4gICAgICAgICAgICBpZiAoTnVtYmVyLmlzSW50ZWdlcihvdGhlcikpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gbmV3IEludGVnZXIodGhpcy5wIC0gb3RoZXIpO1xuICAgICAgICAgICAgfSBlbHNlIGlmIChvdGhlciBpbnN0YW5jZW9mIEludGVnZXIpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gbmV3IEludGVnZXIodGhpcy5wIC0gb3RoZXIucCk7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKG90aGVyIGluc3RhbmNlb2YgUmF0aW9uYWwpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gbmV3IFJhdGlvbmFsKHRoaXMucCAqIG90aGVyLnEgLSBvdGhlci5wLCBvdGhlci5xLCAxKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHN1cGVyLl9fc3ViX18ob3RoZXIpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuIHN1cGVyLl9fc3ViX18ob3RoZXIpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgX19yc3ViX18ob3RoZXI6IGFueSk6IGFueSB7XG4gICAgICAgIGlmIChnbG9iYWxfcGFyYW1ldGVycy5ldmFsdWF0ZSkge1xuICAgICAgICAgICAgaWYgKE51bWJlci5pc0ludGVnZXIob3RoZXIpKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIG5ldyBJbnRlZ2VyKHRoaXMucCAtIG90aGVyKTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAob3RoZXIgaW5zdGFuY2VvZiBSYXRpb25hbCkge1xuICAgICAgICAgICAgICAgIHJldHVybiBuZXcgUmF0aW9uYWwob3RoZXIucCAtIHRoaXMucCAqIG90aGVyLnEsIG90aGVyLnEsIDEpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gc3VwZXIuX19yc3ViX18ob3RoZXIpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuIHN1cGVyLl9fcnN1Yl9fKG90aGVyKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIF9fbXVsX18ob3RoZXI6IGFueSk6IGFueSB7XG4gICAgICAgIGlmIChnbG9iYWxfcGFyYW1ldGVycy5ldmFsdWF0ZSkge1xuICAgICAgICAgICAgaWYgKE51bWJlci5pc0ludGVnZXIob3RoZXIpICkge1xuICAgICAgICAgICAgICAgIHJldHVybiBuZXcgSW50ZWdlcih0aGlzLnAgKiBvdGhlcik7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKG90aGVyIGluc3RhbmNlb2YgSW50ZWdlcikge1xuICAgICAgICAgICAgICAgIHJldHVybiBuZXcgSW50ZWdlcih0aGlzLnAgKiBvdGhlci5wKTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAob3RoZXIgaW5zdGFuY2VvZiBSYXRpb25hbCkge1xuICAgICAgICAgICAgICAgIHJldHVybiBuZXcgUmF0aW9uYWwodGhpcy5wICogb3RoZXIucCwgb3RoZXIucSwgaWdjZCh0aGlzLnAsIG90aGVyLnEpKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHN1cGVyLl9fbXVsX18ob3RoZXIpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuIHN1cGVyLl9fbXVsX18ob3RoZXIpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgX19ybXVsX18ob3RoZXI6IGFueSk6IGFueSB7XG4gICAgICAgIGlmIChnbG9iYWxfcGFyYW1ldGVycy5ldmFsdWF0ZSkge1xuICAgICAgICAgICAgaWYgKE51bWJlci5pc0ludGVnZXIob3RoZXIpICkge1xuICAgICAgICAgICAgICAgIHJldHVybiBuZXcgSW50ZWdlcihvdGhlciAqIHRoaXMucCk7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKG90aGVyIGluc3RhbmNlb2YgUmF0aW9uYWwpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gbmV3IFJhdGlvbmFsKG90aGVyLnAgKiB0aGlzLnAsIG90aGVyLnEsIGlnY2QodGhpcy5wLCBvdGhlci5xKSk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHJldHVybiBzdXBlci5fX3JtdWxfXyhvdGhlcik7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gc3VwZXIuX19ybXVsX18ob3RoZXIpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgX2V2YWxfaXNfbmVnYXRpdmUoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLnAgPCAwO1xuICAgIH1cblxuICAgIF9ldmFsX2lzX3Bvc2l0aXZlKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5wID4gMDtcbiAgICB9XG5cbiAgICBfZXZhbF9pc19vZGQoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLnAgJSAyID09PSAxO1xuICAgIH1cblxuICAgIF9ldmFsX3Bvd2VyKGV4cHQ6IGFueSk6IGFueSB7XG4gICAgICAgIGlmIChleHB0ID09PSBTLkluZmluaXR5KSB7XG4gICAgICAgICAgICBpZiAodGhpcy5wID4gMSkge1xuICAgICAgICAgICAgICAgIHJldHVybiBTLkluZmluaXR5O1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGlmIChleHB0ID09PSBTLk5lZ2F0aXZlSW5maW5pdHkpIHtcbiAgICAgICAgICAgIHJldHVybiBuZXcgUmF0aW9uYWwoMSwgdGhpcywgMSkuX2V2YWxfcG93ZXIoUy5JbmZpbml0eSk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKCEoZXhwdCBpbnN0YW5jZW9mIF9OdW1iZXJfKSkge1xuICAgICAgICAgICAgaWYgKHRoaXMuaXNfbmVnYXRpdmUgJiYgZXhwdC5pc19ldmVuKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuX19tdWxfXyhTLk5lZ2F0aXZlT25lKS5fZXZhbF9wb3dlcihleHB0KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBpZiAoZXhwdCBpbnN0YW5jZW9mIEZsb2F0KSB7XG4gICAgICAgICAgICByZXR1cm4gc3VwZXIuX2V2YWxfcG93ZXIoZXhwdCk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKCEoZXhwdCBpbnN0YW5jZW9mIFJhdGlvbmFsKSkge1xuICAgICAgICAgICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgICAgICAgfVxuICAgICAgICBpZiAoZXhwdC5pc19uZWdhdGl2ZSgpKSB7XG4gICAgICAgICAgICBjb25zdCBuZSA9IGV4cHQuX19tdWxfXyhTLk5lZ2F0aXZlT25lKTtcbiAgICAgICAgICAgIGlmICh0aGlzLmlzX25lZ2F0aXZlKCkpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gUy5OZWdhdGl2ZU9uZS5fZXZhbF9wb3dlcihleHB0KS5fX211bF9fKG5ldyBSYXRpb25hbCgxLCB0aGlzLl9fbXVsX18oUy5OZWdhdGl2ZU9uZSksIDEpKS5fZXZhbF9wb3dlcihuZSk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHJldHVybiBuZXcgUmF0aW9uYWwoMSwgdGhpcy5wLCAxKS5fZXZhbF9wb3dlcihuZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgY29uc3QgW3gsIHhleGFjdF0gPSBpbnRfbnRocm9vdChNYXRoLmFicyh0aGlzLnApLCBleHB0LnEpO1xuICAgICAgICBpZiAoeGV4YWN0KSB7XG4gICAgICAgICAgICBsZXQgcmVzdWx0ID0gbmV3IEludGVnZXIoKHggYXMgbnVtYmVyKSoqTWF0aC5hYnMoZXhwdC5wKSk7XG4gICAgICAgICAgICBpZiAodGhpcy5pc19uZWdhdGl2ZSgpID09IHRydWUpIHtcbiAgICAgICAgICAgICAgICByZXN1bHQgPSByZXN1bHQuX19tdWxfXyhTLk5lZ2F0aXZlT25lLl9ldmFsX3Bvd2VyKGV4cHQpKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgICAgIH1cbiAgICAgICAgY29uc3QgYl9wb3MgPSBNYXRoLmFicyh0aGlzLnApO1xuICAgICAgICBjb25zdCBwID0gcGVyZmVjdF9wb3dlcihiX3Bvcyk7XG4gICAgICAgIGxldCBkaWN0ID0gbmV3IEhhc2hEaWN0KCk7XG4gICAgICAgIGlmIChwICE9PSBmYWxzZSkge1xuICAgICAgICAgICAgZGljdC5hZGQocFswXSwgcFsxXSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBkaWN0ID0gbmV3IEludGVnZXIoYl9wb3MpLmZhY3RvcnMoMioqMTUpO1xuICAgICAgICB9XG5cbiAgICAgICAgbGV0IG91dF9pbnQgPSAxO1xuICAgICAgICBsZXQgb3V0X3JhZDogSW50ZWdlciA9IFMuT25lO1xuICAgICAgICBsZXQgc3FyX2ludCA9IDE7XG4gICAgICAgIGxldCBzcXJfZ2NkID0gMDtcbiAgICAgICAgY29uc3Qgc3FyX2RpY3QgPSBuZXcgSGFzaERpY3QoKTtcbiAgICAgICAgbGV0IHByaW1lOyBsZXQgZXhwb25lbnQ7XG4gICAgICAgIGZvciAoW3ByaW1lLCBleHBvbmVudF0gb2YgZGljdC5lbnRyaWVzKCkpIHtcbiAgICAgICAgICAgIGV4cG9uZW50ICo9IGV4cHQucDtcbiAgICAgICAgICAgIGNvbnN0IFtkaXZfZSwgZGl2X21dID0gZGl2bW9kKGV4cG9uZW50LCBleHB0LnEpO1xuICAgICAgICAgICAgaWYgKGRpdl9lID4gMCkge1xuICAgICAgICAgICAgICAgIG91dF9pbnQgKj0gcHJpbWUqKmRpdl9lO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKGRpdl9tID4gMCkge1xuICAgICAgICAgICAgICAgIGNvbnN0IGcgPSBpZ2NkKGRpdl9tLCBleHB0LnEpO1xuICAgICAgICAgICAgICAgIGlmIChnICE9PSAxKSB7XG4gICAgICAgICAgICAgICAgICAgIG91dF9yYWQgPSBvdXRfcmFkLl9fbXVsX18obmV3IFBvdyhwcmltZSwgbmV3IFJhdGlvbmFsKE1hdGguZmxvb3IoZGl2X20vZyksIE1hdGguZmxvb3IoZXhwdC5xL2cpLCAxKSkpO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHNxcl9kaWN0LmFkZChwcmltZSwgZGl2X20pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBmb3IgKGNvbnN0IFssIGV4XSBvZiBzcXJfZGljdC5lbnRyaWVzKCkpIHtcbiAgICAgICAgICAgIGlmIChzcXJfZ2NkID09PSAwKSB7XG4gICAgICAgICAgICAgICAgc3FyX2djZCA9IGV4O1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBzcXJfZ2NkID0gaWdjZChzcXJfZ2NkLCBleCk7XG4gICAgICAgICAgICAgICAgaWYgKHNxcl9nY2QgPT09IDEpIHtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGZvciAoY29uc3QgW2ssIHZdIG9mIHNxcl9kaWN0LmVudHJpZXMoKSkge1xuICAgICAgICAgICAgc3FyX2ludCAqPSBrKiooTWF0aC5mbG9vcih2L3Nxcl9nY2QpKTtcbiAgICAgICAgfVxuICAgICAgICBsZXQgcmVzdWx0OiBhbnk7XG4gICAgICAgIGlmIChzcXJfaW50ID09PSBiX3BvcyAmJiBvdXRfaW50ID09PSAxICYmIG91dF9yYWQgPT09IFMuT25lKSB7XG4gICAgICAgICAgICByZXN1bHQgPSB1bmRlZmluZWQ7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBjb25zdCBwMSA9IG91dF9yYWQuX19tdWxfXyhuZXcgSW50ZWdlcihvdXRfaW50KSk7XG4gICAgICAgICAgICBjb25zdCBwMiA9IG5ldyBQb3cobmV3IEludGVnZXIoc3FyX2ludCksIG5ldyBSYXRpb25hbChzcXJfZ2NkLCBleHB0LnEpKTtcbiAgICAgICAgICAgIHJlc3VsdCA9IG5ldyBNdWwodHJ1ZSwgdHJ1ZSwgcDEsIHAyKTtcbiAgICAgICAgICAgIGlmICh0aGlzLmlzX25lZ2F0aXZlKCkpIHtcbiAgICAgICAgICAgICAgICByZXN1bHQgPSByZXN1bHQuX19tdWxfXyhuZXcgUG93KFMuTmVnYXRpdmVPbmUsIGV4cHQpKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gcmVzdWx0O1xuICAgIH1cblxuICAgIHRvU3RyaW5nKCkge1xuICAgICAgICByZXR1cm4gU3RyaW5nKHRoaXMucCk7XG4gICAgfVxufTtcblxuTWFuYWdlZFByb3BlcnRpZXMucmVnaXN0ZXIoSW50ZWdlcik7XG5cblxuY2xhc3MgSW50ZWdlckNvbnN0YW50IGV4dGVuZHMgSW50ZWdlciB7XG4gICAgX19zbG90c19fOiBhbnlbXSA9IFtdO1xufTtcblxuTWFuYWdlZFByb3BlcnRpZXMucmVnaXN0ZXIoSW50ZWdlckNvbnN0YW50KTtcblxuY2xhc3MgWmVybyBleHRlbmRzIEludGVnZXJDb25zdGFudCB7XG4gICAgLypcbiAgICBUaGUgbnVtYmVyIHplcm8uXG4gICAgWmVybyBpcyBhIHNpbmdsZXRvbiwgYW5kIGNhbiBiZSBhY2Nlc3NlZCBieSBgYFMuWmVyb2BgXG4gICAgRXhhbXBsZXNcbiAgICA9PT09PT09PVxuICAgID4+PiBmcm9tIHN5bXB5IGltcG9ydCBTLCBJbnRlZ2VyXG4gICAgPj4+IEludGVnZXIoMCkgaXMgUy5aZXJvXG4gICAgVHJ1ZVxuICAgID4+PiAxL1MuWmVyb1xuICAgIHpvb1xuICAgIFJlZmVyZW5jZXNcbiAgICA9PT09PT09PT09XG4gICAgLi4gWzFdIGh0dHBzOi8vZW4ud2lraXBlZGlhLm9yZy93aWtpL1plcm9cbiAgICAqL1xuICAgIF9fc2xvdHNfXzogYW55W10gPSBbXTtcbiAgICBzdGF0aWMgaXNfcG9zaXRpdmUgPSBmYWxzZTtcbiAgICBzdGF0aWMgc3RhdGljID0gZmFsc2U7XG4gICAgc3RhdGljIGlzX3plcm8gPSB0cnVlO1xuICAgIHN0YXRpYyBpc19udW1iZXIgPSB0cnVlO1xuICAgIHN0YXRpYyBpc19jb21wYXJhYmxlID0gdHJ1ZTtcbiAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICAgICAgc3VwZXIoMCk7XG4gICAgfVxufTtcblxuTWFuYWdlZFByb3BlcnRpZXMucmVnaXN0ZXIoWmVybyk7XG5cblxuY2xhc3MgT25lIGV4dGVuZHMgSW50ZWdlckNvbnN0YW50IHtcbiAgICAvKlxuICAgIFRoZSBudW1iZXIgb25lLlxuICAgIE9uZSBpcyBhIHNpbmdsZXRvbiwgYW5kIGNhbiBiZSBhY2Nlc3NlZCBieSBgYFMuT25lYGAuXG4gICAgRXhhbXBsZXNcbiAgICA9PT09PT09PVxuICAgID4+PiBmcm9tIHN5bXB5IGltcG9ydCBTLCBJbnRlZ2VyXG4gICAgPj4+IEludGVnZXIoMSkgaXMgUy5PbmVcbiAgICBUcnVlXG4gICAgUmVmZXJlbmNlc1xuICAgID09PT09PT09PT1cbiAgICAuLiBbMV0gaHR0cHM6Ly9lbi53aWtpcGVkaWEub3JnL3dpa2kvMV8lMjhudW1iZXIlMjlcbiAgICAqL1xuICAgIHN0YXRpYyBpc19udW1iZXIgPSB0cnVlO1xuICAgIHN0YXRpYyBpc19wb3NpdGl2ZSA9IHRydWU7XG4gICAgc3RhdGljIGlzX3plcm8gPSBmYWxzZTtcbiAgICBfX3Nsb3RzX186IGFueVtdID0gW107XG4gICAgY29uc3RydWN0b3IoKSB7XG4gICAgICAgIHN1cGVyKDEpO1xuICAgIH1cbn07XG5cbk1hbmFnZWRQcm9wZXJ0aWVzLnJlZ2lzdGVyKE9uZSk7XG5cblxuY2xhc3MgTmVnYXRpdmVPbmUgZXh0ZW5kcyBJbnRlZ2VyQ29uc3RhbnQge1xuICAgIC8qXG4gICAgVGhlIG51bWJlciBuZWdhdGl2ZSBvbmUuXG4gICAgTmVnYXRpdmVPbmUgaXMgYSBzaW5nbGV0b24sIGFuZCBjYW4gYmUgYWNjZXNzZWQgYnkgYGBTLk5lZ2F0aXZlT25lYGAuXG4gICAgRXhhbXBsZXNcbiAgICA9PT09PT09PVxuICAgID4+PiBmcm9tIHN5bXB5IGltcG9ydCBTLCBJbnRlZ2VyXG4gICAgPj4+IEludGVnZXIoLTEpIGlzIFMuTmVnYXRpdmVPbmVcbiAgICBUcnVlXG4gICAgU2VlIEFsc29cbiAgICA9PT09PT09PVxuICAgIE9uZVxuICAgIFJlZmVyZW5jZXNcbiAgICA9PT09PT09PT09XG4gICAgLi4gWzFdIGh0dHBzOi8vZW4ud2lraXBlZGlhLm9yZy93aWtpLyVFMiU4OCU5MjFfJTI4bnVtYmVyJTI5XG4gICAgKi9cbiAgICBzdGF0aWMgaXNfbnVtYmVyID0gdHJ1ZTtcbiAgICBfX3Nsb3RzX186IGFueVtdID0gW107XG4gICAgY29uc3RydWN0b3IoKSB7XG4gICAgICAgIHN1cGVyKC0xKTtcbiAgICB9XG5cbiAgICBfZXZhbF9wb3dlcihleHB0OiBhbnkpIHtcbiAgICAgICAgaWYgKGV4cHQuaXNfb2RkKSB7XG4gICAgICAgICAgICByZXR1cm4gUy5OZWdhdGl2ZU9uZTtcbiAgICAgICAgfSBlbHNlIGlmIChleHB0LmlzX2V2ZW4pIHtcbiAgICAgICAgICAgIHJldHVybiBTLk9uZTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoZXhwdCBpbnN0YW5jZW9mIF9OdW1iZXJfKSB7XG4gICAgICAgICAgICBpZiAoZXhwdCBpbnN0YW5jZW9mIEZsb2F0KSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIG5ldyBGbG9hdCgtMS4wKS5fZXZhbF9wb3dlcihleHB0KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChleHB0ID09PSBTLk5hTikge1xuICAgICAgICAgICAgICAgIHJldHVybiBTLk5hTjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChleHB0ID09PSBTLkluZmluaXR5IHx8IGV4cHQgPT09IFMuTmVnYXRpdmVJbmZpbml0eSkge1xuICAgICAgICAgICAgICAgIHJldHVybiBTLk5hTjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm47XG4gICAgfVxufTtcblxuTWFuYWdlZFByb3BlcnRpZXMucmVnaXN0ZXIoTmVnYXRpdmVPbmUpO1xuXG5jbGFzcyBOYU4gZXh0ZW5kcyBfTnVtYmVyXyB7XG4gICAgLypcbiAgICBOb3QgYSBOdW1iZXIuXG4gICAgRXhwbGFuYXRpb25cbiAgICA9PT09PT09PT09PVxuICAgIFRoaXMgc2VydmVzIGFzIGEgcGxhY2UgaG9sZGVyIGZvciBudW1lcmljIHZhbHVlcyB0aGF0IGFyZSBpbmRldGVybWluYXRlLlxuICAgIE1vc3Qgb3BlcmF0aW9ucyBvbiBOYU4sIHByb2R1Y2UgYW5vdGhlciBOYU4uICBNb3N0IGluZGV0ZXJtaW5hdGUgZm9ybXMsXG4gICAgc3VjaCBhcyBgYDAvMGBgIG9yIGBgb28gLSBvb2AgcHJvZHVjZSBOYU4uICBUd28gZXhjZXB0aW9ucyBhcmUgYGAwKiowYGBcbiAgICBhbmQgYGBvbyoqMGBgLCB3aGljaCBhbGwgcHJvZHVjZSBgYDFgYCAodGhpcyBpcyBjb25zaXN0ZW50IHdpdGggUHl0aG9uJ3NcbiAgICBmbG9hdCkuXG4gICAgTmFOIGlzIGxvb3NlbHkgcmVsYXRlZCB0byBmbG9hdGluZyBwb2ludCBuYW4sIHdoaWNoIGlzIGRlZmluZWQgaW4gdGhlXG4gICAgSUVFRSA3NTQgZmxvYXRpbmcgcG9pbnQgc3RhbmRhcmQsIGFuZCBjb3JyZXNwb25kcyB0byB0aGUgUHl0aG9uXG4gICAgYGBmbG9hdCgnbmFuJylgYC4gIERpZmZlcmVuY2VzIGFyZSBub3RlZCBiZWxvdy5cbiAgICBOYU4gaXMgbWF0aGVtYXRpY2FsbHkgbm90IGVxdWFsIHRvIGFueXRoaW5nIGVsc2UsIGV2ZW4gTmFOIGl0c2VsZi4gIFRoaXNcbiAgICBleHBsYWlucyB0aGUgaW5pdGlhbGx5IGNvdW50ZXItaW50dWl0aXZlIHJlc3VsdHMgd2l0aCBgYEVxYGAgYW5kIGBgPT1gYCBpblxuICAgIHRoZSBleGFtcGxlcyBiZWxvdy5cbiAgICBOYU4gaXMgbm90IGNvbXBhcmFibGUgc28gaW5lcXVhbGl0aWVzIHJhaXNlIGEgVHlwZUVycm9yLiAgVGhpcyBpcyBpblxuICAgIGNvbnRyYXN0IHdpdGggZmxvYXRpbmcgcG9pbnQgbmFuIHdoZXJlIGFsbCBpbmVxdWFsaXRpZXMgYXJlIGZhbHNlLlxuICAgIE5hTiBpcyBhIHNpbmdsZXRvbiwgYW5kIGNhbiBiZSBhY2Nlc3NlZCBieSBgYFMuTmFOYGAsIG9yIGNhbiBiZSBpbXBvcnRlZFxuICAgIGFzIGBgbmFuYGAuXG4gICAgRXhhbXBsZXNcbiAgICA9PT09PT09PVxuICAgID4+PiBmcm9tIHN5bXB5IGltcG9ydCBuYW4sIFMsIG9vLCBFcVxuICAgID4+PiBuYW4gaXMgUy5OYU5cbiAgICBUcnVlXG4gICAgPj4+IG9vIC0gb29cbiAgICBuYW5cbiAgICA+Pj4gbmFuICsgMVxuICAgIG5hblxuICAgID4+PiBFcShuYW4sIG5hbikgICAjIG1hdGhlbWF0aWNhbCBlcXVhbGl0eVxuICAgIEZhbHNlXG4gICAgPj4+IG5hbiA9PSBuYW4gICAgICMgc3RydWN0dXJhbCBlcXVhbGl0eVxuICAgIFRydWVcbiAgICBSZWZlcmVuY2VzXG4gICAgPT09PT09PT09PVxuICAgIC4uIFsxXSBodHRwczovL2VuLndpa2lwZWRpYS5vcmcvd2lraS9OYU5cbiAgICAqL1xuICAgIHN0YXRpYyBpc19jb21tdXRhdGl2ZSA9IHRydWU7XG4gICAgc3RhdGljIGlzX2V4dGVuZGVkX3JlYWw6IGFueSA9IHVuZGVmaW5lZDtcbiAgICBzdGF0aWMgaXNfcmVhbDogYW55ID0gdW5kZWZpbmVkO1xuICAgIHN0YXRpYyBpc19yYXRpb25hbDogYW55ID0gdW5kZWZpbmVkO1xuICAgIHN0YXRpYyBpc19hbGdlYnJhaWM6IGFueSA9IHVuZGVmaW5lZDtcbiAgICBzdGF0aWMgaXNfdHJhbnNjZW5kZW50YWw6IGFueSA9IHVuZGVmaW5lZDtcbiAgICBzdGF0aWMgaXNfaW50ZWdlcjogYW55ID0gdW5kZWZpbmVkO1xuICAgIHN0YXRpYyBpc19jb21wYXJhYmxlID0gZmFsc2U7XG4gICAgc3RhdGljIGlzX2Zpbml0ZTogYW55ID0gdW5kZWZpbmVkO1xuICAgIHN0YXRpYyBpc196ZXJvOiBhbnkgPSB1bmRlZmluZWQ7XG4gICAgc3RhdGljIGlzX3ByaW1lOiBhbnkgPSB1bmRlZmluZWQ7XG4gICAgc3RhdGljIGlzX3Bvc2l0aXZlOiBhbnkgPSB1bmRlZmluZWQ7XG4gICAgc3RhdGljIGlzX25lZ2F0aXZlOiBhbnkgPSB1bmRlZmluZWQ7XG4gICAgc3RhdGljIGlzX251bWJlciA9IHRydWU7XG4gICAgX19zbG90c19fOiBhbnkgPSBbXTtcbiAgICB0b1N0cmluZygpIHtcbiAgICAgICAgcmV0dXJuIFwiTkFOXCI7XG4gICAgfVxufVxuXG5NYW5hZ2VkUHJvcGVydGllcy5yZWdpc3RlcihOYU4pO1xuXG4vLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbmV3LWNhcFxuY2xhc3MgQ29tcGxleEluZmluaXR5IGV4dGVuZHMgX0F0b21pY0V4cHIge1xuICAgIC8qXG4gICAgQ29tcGxleCBpbmZpbml0eS5cbiAgICBFeHBsYW5hdGlvblxuICAgID09PT09PT09PT09XG4gICAgSW4gY29tcGxleCBhbmFseXNpcyB0aGUgc3ltYm9sIGBcXHRpbGRlXFxpbmZ0eWAsIGNhbGxlZCBcImNvbXBsZXhcbiAgICBpbmZpbml0eVwiLCByZXByZXNlbnRzIGEgcXVhbnRpdHkgd2l0aCBpbmZpbml0ZSBtYWduaXR1ZGUsIGJ1dFxuICAgIHVuZGV0ZXJtaW5lZCBjb21wbGV4IHBoYXNlLlxuICAgIENvbXBsZXhJbmZpbml0eSBpcyBhIHNpbmdsZXRvbiwgYW5kIGNhbiBiZSBhY2Nlc3NlZCBieVxuICAgIGBgUy5Db21wbGV4SW5maW5pdHlgYCwgb3IgY2FuIGJlIGltcG9ydGVkIGFzIGBgem9vYGAuXG4gICAgRXhhbXBsZXNcbiAgICA9PT09PT09PVxuICAgID4+PiBmcm9tIHN5bXB5IGltcG9ydCB6b29cbiAgICA+Pj4gem9vICsgNDJcbiAgICB6b29cbiAgICA+Pj4gNDIvem9vXG4gICAgMFxuICAgID4+PiB6b28gKyB6b29cbiAgICBuYW5cbiAgICA+Pj4gem9vKnpvb1xuICAgIHpvb1xuICAgIFNlZSBBbHNvXG4gICAgPT09PT09PT1cbiAgICBJbmZpbml0eVxuICAgICovXG4gICAgc3RhdGljIGlzX2NvbW11dGF0aXZlID0gdHJ1ZTtcbiAgICBzdGF0aWMgaXNfaW5maW5pdGUgPSB0cnVlO1xuICAgIHN0YXRpYyBpc19udW1iZXIgPSB0cnVlO1xuICAgIHN0YXRpYyBpc19wcmltZSA9IGZhbHNlO1xuICAgIHN0YXRpYyBpc19jb21wbGV4ID0gZmFsc2U7XG4gICAgc3RhdGljIGlzX2V4dGVuZGVkX3JlYWwgPSBmYWxzZTtcbiAgICBraW5kID0gTnVtYmVyS2luZDtcbiAgICBfX3Nsb3RzX186IGFueSA9IFtdO1xuXG4gICAgY29uc3RydWN0b3IoKSB7XG4gICAgICAgIHN1cGVyKCk7XG4gICAgfVxuXG4gICAgdG9TdHJpbmcoKSB7XG4gICAgICAgIHJldHVybiBcIkNvbXBsZXhJbmZpbml0eVwiO1xuICAgIH1cbn1cblxuTWFuYWdlZFByb3BlcnRpZXMucmVnaXN0ZXIoQ29tcGxleEluZmluaXR5KTtcblxuY2xhc3MgSW5maW5pdHkgZXh0ZW5kcyBfTnVtYmVyXyB7XG4gICAgLypcbiAgICBQb3NpdGl2ZSBpbmZpbml0ZSBxdWFudGl0eS5cbiAgICBFeHBsYW5hdGlvblxuICAgID09PT09PT09PT09XG4gICAgSW4gcmVhbCBhbmFseXNpcyB0aGUgc3ltYm9sIGBcXGluZnR5YCBkZW5vdGVzIGFuIHVuYm91bmRlZFxuICAgIGxpbWl0OiBgeFxcdG9cXGluZnR5YCBtZWFucyB0aGF0IGB4YCBncm93cyB3aXRob3V0IGJvdW5kLlxuICAgIEluZmluaXR5IGlzIG9mdGVuIHVzZWQgbm90IG9ubHkgdG8gZGVmaW5lIGEgbGltaXQgYnV0IGFzIGEgdmFsdWVcbiAgICBpbiB0aGUgYWZmaW5lbHkgZXh0ZW5kZWQgcmVhbCBudW1iZXIgc3lzdGVtLiAgUG9pbnRzIGxhYmVsZWQgYCtcXGluZnR5YFxuICAgIGFuZCBgLVxcaW5mdHlgIGNhbiBiZSBhZGRlZCB0byB0aGUgdG9wb2xvZ2ljYWwgc3BhY2Ugb2YgdGhlIHJlYWwgbnVtYmVycyxcbiAgICBwcm9kdWNpbmcgdGhlIHR3by1wb2ludCBjb21wYWN0aWZpY2F0aW9uIG9mIHRoZSByZWFsIG51bWJlcnMuICBBZGRpbmdcbiAgICBhbGdlYnJhaWMgcHJvcGVydGllcyB0byB0aGlzIGdpdmVzIHVzIHRoZSBleHRlbmRlZCByZWFsIG51bWJlcnMuXG4gICAgSW5maW5pdHkgaXMgYSBzaW5nbGV0b24sIGFuZCBjYW4gYmUgYWNjZXNzZWQgYnkgYGBTLkluZmluaXR5YGAsXG4gICAgb3IgY2FuIGJlIGltcG9ydGVkIGFzIGBgb29gYC5cbiAgICBFeGFtcGxlc1xuICAgID09PT09PT09XG4gICAgPj4+IGZyb20gc3ltcHkgaW1wb3J0IG9vLCBleHAsIGxpbWl0LCBTeW1ib2xcbiAgICA+Pj4gMSArIG9vXG4gICAgb29cbiAgICA+Pj4gNDIvb29cbiAgICAwXG4gICAgPj4+IHggPSBTeW1ib2woJ3gnKVxuICAgID4+PiBsaW1pdChleHAoeCksIHgsIG9vKVxuICAgIG9vXG4gICAgU2VlIEFsc29cbiAgICA9PT09PT09PVxuICAgIE5lZ2F0aXZlSW5maW5pdHksIE5hTlxuICAgIFJlZmVyZW5jZXNcbiAgICA9PT09PT09PT09XG4gICAgLi4gWzFdIGh0dHBzOi8vZW4ud2lraXBlZGlhLm9yZy93aWtpL0luZmluaXR5XG4gICAgKi9cbiAgICBzdGF0aWMgaXNfY29tbXV0YXRpdmUgPSB0cnVlO1xuICAgIHN0YXRpYyBpc19udW1iZXIgPSB0cnVlO1xuICAgIHN0YXRpYyBpc19jb21wbGV4ID0gZmFsc2U7XG4gICAgc3RhdGljIGlzX2V4dGVuZGVkX3JlYWwgPSB0cnVlO1xuICAgIHN0YXRpYyBpc19pbmZpbml0ZSA9IHRydWU7XG4gICAgc3RhdGljIGlzX2NvbXBhcmFibGUgPSB0cnVlO1xuICAgIHN0YXRpYyBpc19leHRlbmRlZF9wb3NpdGl2ZSA9IHRydWU7XG4gICAgc3RhdGljIGlzX3ByaW1lID0gZmFsc2U7XG4gICAgX19zbG90c19fOiBhbnkgPSBbXTtcblxuICAgIGNvbnN0cnVjdG9yKCkge1xuICAgICAgICBzdXBlcigpO1xuICAgIH1cblxuICAgIC8vIE5PVEU6IG1vcmUgYXJpdGhtZXRpYyBtZXRob2RzIHNob3VsZCBiZSBpbXBsZW1lbnRlZCBidXQgSSBoYXZlIG9ubHlcbiAgICAvLyBkb25lIGVub3VnaCBzdWNoIHRoYXQgYWRkIGFuZCBtdWwgY2FuIGhhbmRsZSBpbmZpbml0eSBhcyBhbiBhcmd1bWVudFxuICAgIF9fYWRkX18ob3RoZXI6IGFueSkge1xuICAgICAgICBpZiAob3RoZXIgaW5zdGFuY2VvZiBfTnVtYmVyXyAmJiBnbG9iYWxfcGFyYW1ldGVycy5ldmFsdWF0ZSkge1xuICAgICAgICAgICAgaWYgKG90aGVyID09PSBTLkluZmluaXR5IHx8IG90aGVyID09PSBTLk5hTikge1xuICAgICAgICAgICAgICAgIHJldHVybiBTLk5hTjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBzdXBlci5fX2FkZF9fKG90aGVyKTtcbiAgICB9XG5cbiAgICBfX211bF9fKG90aGVyOiBhbnkpIHtcbiAgICAgICAgaWYgKG90aGVyIGluc3RhbmNlb2YgX051bWJlcl8gJiYgZ2xvYmFsX3BhcmFtZXRlcnMuZXZhbHVhdGUpIHtcbiAgICAgICAgICAgIGlmIChvdGhlciA9PT0gUy5aZXJvIHx8IG90aGVyID09PSBTLk5hTikge1xuICAgICAgICAgICAgICAgIHJldHVybiBTLk5hTjtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAob3RoZXIuaXNfZXh0ZW5kZWRfcG9zaXRpdmUpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiBTLk5lZ2F0aXZlSW5maW5pdHk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHN1cGVyLl9fbXVsX18ob3RoZXIpO1xuICAgIH1cblxuICAgIHRvU3RyaW5nKCkge1xuICAgICAgICByZXR1cm4gXCJJbmZpbml0eVwiO1xuICAgIH1cbn1cblxuY2xhc3MgTmVnYXRpdmVJbmZpbml0eSBleHRlbmRzIF9OdW1iZXJfIHtcbiAgICAvKlxuICAgIFwiTmVnYXRpdmUgaW5maW5pdGUgcXVhbnRpdHkuXG4gICAgTmVnYXRpdmVJbmZpbml0eSBpcyBhIHNpbmdsZXRvbiwgYW5kIGNhbiBiZSBhY2Nlc3NlZFxuICAgIGJ5IGBgUy5OZWdhdGl2ZUluZmluaXR5YGAuXG4gICAgU2VlIEFsc29cbiAgICA9PT09PT09PVxuICAgIEluZmluaXR5XG4gICAgKi9cbiAgICBzdGF0aWMgaXNfZXh0ZW5kZWRfcmVhbCA9IHRydWU7XG4gICAgc3RhdGljIGlzX2NvbXBsZXggPSBmYWxzZTtcbiAgICBzdGF0aWMgaXNfY29tbXV0YXRpdmUgPSB0cnVlO1xuICAgIHN0YXRpYyBpc19pbmZpbml0ZSA9IHRydWU7XG4gICAgc3RhdGljIGlzX2NvbXBhcmFibGUgPSB0cnVlO1xuICAgIHN0YXRpYyBpc19leHRlbmRlZF9uZWdhdGl2ZSA9IHRydWU7XG4gICAgc3RhdGljIGlzX251bWJlciA9IHRydWU7XG4gICAgc3RhdGljIGlzX3ByaW1lID0gZmFsc2U7XG4gICAgX19zbG90c19fOiBhbnkgPSBbXTtcblxuICAgIGNvbnN0cnVjdG9yKCkge1xuICAgICAgICBzdXBlcigpO1xuICAgIH1cblxuICAgIC8vIE5PVEU6IG1vcmUgYXJpdGhtZXRpYyBtZXRob2RzIHNob3VsZCBiZSBpbXBsZW1lbnRlZCBidXQgSSBoYXZlIG9ubHlcbiAgICAvLyBkb25lIGVub3VnaCBzdWNoIHRoYXQgYWRkIGFuZCBtdWwgY2FuIGhhbmRsZSBuZWdhdGl2ZWluZmluaXR5IGFzIGFuIGFyZ3VtZW50XG4gICAgX19hZGRfXyhvdGhlcjogYW55KSB7XG4gICAgICAgIGlmIChvdGhlciBpbnN0YW5jZW9mIF9OdW1iZXJfICYmIGdsb2JhbF9wYXJhbWV0ZXJzLmV2YWx1YXRlKSB7XG4gICAgICAgICAgICBpZiAob3RoZXIgPT09IFMuTmVnYXRpdmVJbmZpbml0eSB8fCBvdGhlciA9PT0gUy5OYU4pIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gUy5OYU47XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gc3VwZXIuX19hZGRfXyhvdGhlcik7XG4gICAgfVxuXG4gICAgX19tdWxfXyhvdGhlcjogYW55KSB7XG4gICAgICAgIGlmIChvdGhlciBpbnN0YW5jZW9mIF9OdW1iZXJfICYmIGdsb2JhbF9wYXJhbWV0ZXJzLmV2YWx1YXRlKSB7XG4gICAgICAgICAgICBpZiAob3RoZXIgPT09IFMuWmVybyB8fCBvdGhlciA9PT0gUy5OYU4pIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gUy5OYU47XG4gICAgICAgICAgICB9IGVsc2UgaWYgKG90aGVyLmlzX2V4dGVuZGVkX3Bvc2l0aXZlKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gUy5JbmZpbml0eTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gc3VwZXIuX19tdWxfXyhvdGhlcik7XG4gICAgfVxuXG4gICAgdG9TdHJpbmcoKSB7XG4gICAgICAgIHJldHVybiBcIk5lZ0luZmluaXR5XCI7XG4gICAgfVxufVxuXG4vLyBSZWdpc3RlcmluZyBzaW5nbGV0b25zIChzZWUgc2luZ2xldG9uIGNsYXNzKVxuU2luZ2xldG9uLnJlZ2lzdGVyKFwiWmVyb1wiLCBaZXJvKTtcblMuWmVybyA9IFNpbmdsZXRvbi5yZWdpc3RyeVtcIlplcm9cIl07XG5cblNpbmdsZXRvbi5yZWdpc3RlcihcIk9uZVwiLCBPbmUpO1xuUy5PbmUgPSBTaW5nbGV0b24ucmVnaXN0cnlbXCJPbmVcIl07XG5cblNpbmdsZXRvbi5yZWdpc3RlcihcIk5lZ2F0aXZlT25lXCIsIE5lZ2F0aXZlT25lKTtcblMuTmVnYXRpdmVPbmUgPSBTaW5nbGV0b24ucmVnaXN0cnlbXCJOZWdhdGl2ZU9uZVwiXTtcblxuU2luZ2xldG9uLnJlZ2lzdGVyKFwiTmFOXCIsIE5hTik7XG5TLk5hTiA9IFNpbmdsZXRvbi5yZWdpc3RyeVtcIk5hTlwiXTtcblxuU2luZ2xldG9uLnJlZ2lzdGVyKFwiQ29tcGxleEluZmluaXR5XCIsIENvbXBsZXhJbmZpbml0eSk7XG5TLkNvbXBsZXhJbmZpbml0eSA9IFNpbmdsZXRvbi5yZWdpc3RyeVtcIkNvbXBsZXhJbmZpbml0eVwiXTtcblxuU2luZ2xldG9uLnJlZ2lzdGVyKFwiSW5maW5pdHlcIiwgSW5maW5pdHkpO1xuUy5JbmZpbml0eSA9IFNpbmdsZXRvbi5yZWdpc3RyeVtcIkluZmluaXR5XCJdO1xuXG5TaW5nbGV0b24ucmVnaXN0ZXIoXCJOZWdhdGl2ZUluZmluaXR5XCIsIE5lZ2F0aXZlSW5maW5pdHkpO1xuUy5OZWdhdGl2ZUluZmluaXR5ID0gU2luZ2xldG9uLnJlZ2lzdHJ5W1wiTmVnYXRpdmVJbmZpbml0eVwiXTtcblxuZXhwb3J0IHtSYXRpb25hbCwgX051bWJlcl8sIEZsb2F0LCBJbnRlZ2VyLCBaZXJvLCBPbmV9O1xuIiwgIi8qXG5JbnRlZ2VyIGFuZCByYXRpb25hbCBmYWN0b3JpemF0aW9uXG5cbk5vdGFibGUgY2hhbmdlcyBtYWRlXG4tIEEgZmV3IGZ1bmN0aW9ucyBpbiAuZ2VuZXJhdG9yIGFuZCAuZXZhbGYgaGF2ZSBiZWVuIG1vdmVkIGhlcmUgZm9yIHNpbXBsaWNpdHlcbi0gTm90ZTogbW9zdCBwYXJhbWV0ZXJzIGZvciBmYWN0b3JpbnQgYW5kIGZhY3RvcnJhdCBoYXZlIG5vdCBiZWVuIGltcGxlbWVudGVkXG4tIFNlZSBub3RlcyB3aXRoaW4gcGVyZmVjdF9wb3dlciBmb3Igc3BlY2lmaWMgY2hhbmdlc1xuLSBBbGwgZmFjdG9yIGZ1bmN0aW9ucyByZXR1cm4gaGFzaGRpY3Rpb25hcmllc1xuLSBBZHZhbmNlZCBmYWN0b3JpbmcgYWxnb3JpdGhtcyBmb3IgZmFjdG9yaW50IGFyZSBub3QgeWV0IGltcGxlbWVudGVkXG4qL1xuXG5pbXBvcnQge1JhdGlvbmFsLCBpbnRfbnRocm9vdCwgSW50ZWdlcn0gZnJvbSBcIi4uL2NvcmUvbnVtYmVyc1wiO1xuaW1wb3J0IHtTfSBmcm9tIFwiLi4vY29yZS9zaW5nbGV0b25cIjtcbmltcG9ydCB7SGFzaERpY3QsIFV0aWx9IGZyb20gXCIuLi9jb3JlL3V0aWxpdHlcIjtcbmltcG9ydCB7YXNfaW50fSBmcm9tIFwiLi4vdXRpbGl0aWVzL21pc2NcIjtcblxuY29uc3Qgc21hbGxfdHJhaWxpbmcgPSBuZXcgQXJyYXkoMjU2KS5maWxsKDApO1xuZm9yIChsZXQgaiA9IDE7IGogPCA4OyBqKyspIHtcbiAgICBVdGlsLmFzc2lnbkVsZW1lbnRzKHNtYWxsX3RyYWlsaW5nLCBuZXcgQXJyYXkoKDE8PCg3LWopKSkuZmlsbChqKSwgMTw8aiwgMTw8KGorMSkpO1xufVxuXG5mdW5jdGlvbiBiaXRjb3VudChuOiBudW1iZXIpIHtcbiAgICAvLyBSZXR1cm4gc21hbGxlc3QgaW50ZWdlciwgYiwgc3VjaCB0aGF0IHxufC8yKipiIDwgMVxuICAgIGxldCBiaXRzID0gMDtcbiAgICB3aGlsZSAobiAhPT0gMCkge1xuICAgICAgICBiaXRzICs9IGJpdENvdW50MzIobiB8IDApO1xuICAgICAgICBuIC89IDB4MTAwMDAwMDAwO1xuICAgIH1cbiAgICByZXR1cm4gYml0cztcbn1cblxuLy8gc21hbGwgYml0Y291bnQgdXNlZCB0byBmYWNpbGlhdGUgbGFyZ2VyIG9uZVxuZnVuY3Rpb24gYml0Q291bnQzMihuOiBudW1iZXIpIHtcbiAgICBuID0gbiAtICgobiA+PiAxKSAmIDB4NTU1NTU1NTUpO1xuICAgIG4gPSAobiAmIDB4MzMzMzMzMzMpICsgKChuID4+IDIpICYgMHgzMzMzMzMzMyk7XG4gICAgcmV0dXJuICgobiArIChuID4+IDQpICYgMHhGMEYwRjBGKSAqIDB4MTAxMDEwMSkgPj4gMjQ7XG59XG5cbmZ1bmN0aW9uIHRyYWlsaW5nKG46IG51bWJlcikge1xuICAgIC8qXG4gICAgQ291bnQgdGhlIG51bWJlciBvZiB0cmFpbGluZyB6ZXJvIGRpZ2l0cyBpbiB0aGUgYmluYXJ5XG4gICAgcmVwcmVzZW50YXRpb24gb2YgbiwgaS5lLiBkZXRlcm1pbmUgdGhlIGxhcmdlc3QgcG93ZXIgb2YgMlxuICAgIHRoYXQgZGl2aWRlcyBuLlxuICAgIEV4YW1wbGVzXG4gICAgPT09PT09PT1cbiAgICA+Pj4gZnJvbSBzeW1weSBpbXBvcnQgdHJhaWxpbmdcbiAgICA+Pj4gdHJhaWxpbmcoMTI4KVxuICAgIDdcbiAgICA+Pj4gdHJhaWxpbmcoNjMpXG4gICAgMFxuICAgICovXG4gICAgbiA9IE1hdGguZmxvb3IoTWF0aC5hYnMobikpO1xuICAgIGNvbnN0IGxvd19ieXRlID0gbiAmIDB4ZmY7XG4gICAgaWYgKGxvd19ieXRlKSB7XG4gICAgICAgIHJldHVybiBzbWFsbF90cmFpbGluZ1tsb3dfYnl0ZV07XG4gICAgfVxuICAgIGNvbnN0IHogPSBiaXRjb3VudChuKSAtIDE7XG4gICAgaWYgKE51bWJlci5pc0ludGVnZXIoeikpIHtcbiAgICAgICAgaWYgKG4gPT09IDEgPDwgeikge1xuICAgICAgICAgICAgcmV0dXJuIHo7XG4gICAgICAgIH1cbiAgICB9XG4gICAgaWYgKHogPCAzMDApIHtcbiAgICAgICAgbGV0IHQgPSA4O1xuICAgICAgICBuID4+PSA4O1xuICAgICAgICB3aGlsZSAoIShuICYgMHhmZikpIHtcbiAgICAgICAgICAgIG4gPj49IDg7XG4gICAgICAgICAgICB0ICs9IDg7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHQgKyBzbWFsbF90cmFpbGluZ1tuICYgMHhmZl07XG4gICAgfVxuICAgIGxldCB0ID0gMDtcbiAgICBsZXQgcCA9IDg7XG4gICAgd2hpbGUgKCEobiAmIDEpKSB7XG4gICAgICAgIHdoaWxlICghKG4gJiAoKDEgPDwgcCkgLSAxKSkpIHtcbiAgICAgICAgICAgIG4gPj49IHA7XG4gICAgICAgICAgICB0ICs9IHA7XG4gICAgICAgICAgICBwICo9IDI7XG4gICAgICAgIH1cbiAgICAgICAgcCA9IE1hdGguZmxvb3IocC8yKTtcbiAgICB9XG4gICAgcmV0dXJuIHQ7XG59XG5cbi8vIG5vdGU6IHRoaXMgaXMgZGlmZmVyZW50IHRoYW4gdGhlIG9yaWdpbmFsIHN5bXB5IHZlcnNpb24gLSBpbXBsZW1lbnQgbGF0ZXJcbmZ1bmN0aW9uIGlzcHJpbWUobnVtOiBudW1iZXIpIHtcbiAgICBmb3IgKGxldCBpID0gMiwgcyA9IE1hdGguc3FydChudW0pOyBpIDw9IHM7IGkrKykge1xuICAgICAgICBpZiAobnVtICUgaSA9PT0gMCkge1xuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9XG4gICAgfVxuICAgIHJldHVybiAobnVtID4gMSk7XG59XG5cbmZ1bmN0aW9uKiBwcmltZXJhbmdlKGE6IG51bWJlciwgYjogbnVtYmVyID0gdW5kZWZpbmVkKSB7XG4gICAgLypcbiAgICBHZW5lcmF0ZSBhbGwgcHJpbWUgbnVtYmVycyBpbiB0aGUgcmFuZ2UgWzIsIGEpIG9yIFthLCBiKS5cbiAgICBFeGFtcGxlc1xuICAgID09PT09PT09XG4gICAgPj4+IGZyb20gc3ltcHkgaW1wb3J0IHNpZXZlLCBwcmltZVxuICAgIEFsbCBwcmltZXMgbGVzcyB0aGFuIDE5OlxuICAgID4+PiBwcmludChbaSBmb3IgaSBpbiBzaWV2ZS5wcmltZXJhbmdlKDE5KV0pXG4gICAgWzIsIDMsIDUsIDcsIDExLCAxMywgMTddXG4gICAgQWxsIHByaW1lcyBncmVhdGVyIHRoYW4gb3IgZXF1YWwgdG8gNyBhbmQgbGVzcyB0aGFuIDE5OlxuICAgID4+PiBwcmludChbaSBmb3IgaSBpbiBzaWV2ZS5wcmltZXJhbmdlKDcsIDE5KV0pXG4gICAgWzcsIDExLCAxMywgMTddXG4gICAgQWxsIHByaW1lcyB0aHJvdWdoIHRoZSAxMHRoIHByaW1lXG4gICAgPj4+IGxpc3Qoc2lldmUucHJpbWVyYW5nZShwcmltZSgxMCkgKyAxKSlcbiAgICBbMiwgMywgNSwgNywgMTEsIDEzLCAxNywgMTksIDIzLCAyOV1cbiAgICAqL1xuICAgIGlmICh0eXBlb2YgYiA9PT0gXCJ1bmRlZmluZWRcIikge1xuICAgICAgICBbYSwgYl0gPSBbMiwgYV07XG4gICAgfVxuICAgIGlmIChhID49IGIpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBhID0gTWF0aC5jZWlsKGEpIC0gMTtcbiAgICBiID0gTWF0aC5mbG9vcihiKTtcblxuICAgIHdoaWxlICgxKSB7XG4gICAgICAgIGEgPSBuZXh0cHJpbWUoYSk7XG4gICAgICAgIGlmIChhIDwgYikge1xuICAgICAgICAgICAgeWllbGQgYTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgIH1cbn1cblxuZnVuY3Rpb24gbmV4dHByaW1lKG46IG51bWJlciwgaXRoOiBudW1iZXIgPSAxKSB7XG4gICAgLypcbiAgICBSZXR1cm4gdGhlIGl0aCBwcmltZSBncmVhdGVyIHRoYW4gbi5cbiAgICBpIG11c3QgYmUgYW4gaW50ZWdlci5cbiAgICBOb3Rlc1xuICAgID09PT09XG4gICAgUG90ZW50aWFsIHByaW1lcyBhcmUgbG9jYXRlZCBhdCA2KmogKy8tIDEuIFRoaXNcbiAgICBwcm9wZXJ0eSBpcyB1c2VkIGR1cmluZyBzZWFyY2hpbmcuXG4gICAgPj4+IGZyb20gc3ltcHkgaW1wb3J0IG5leHRwcmltZVxuICAgID4+PiBbKGksIG5leHRwcmltZShpKSkgZm9yIGkgaW4gcmFuZ2UoMTAsIDE1KV1cbiAgICBbKDEwLCAxMSksICgxMSwgMTMpLCAoMTIsIDEzKSwgKDEzLCAxNyksICgxNCwgMTcpXVxuICAgID4+PiBuZXh0cHJpbWUoMiwgaXRoPTIpICMgdGhlIDJuZCBwcmltZSBhZnRlciAyXG4gICAgNVxuICAgIFNlZSBBbHNvXG4gICAgPT09PT09PT1cbiAgICBwcmV2cHJpbWUgOiBSZXR1cm4gdGhlIGxhcmdlc3QgcHJpbWUgc21hbGxlciB0aGFuIG5cbiAgICBwcmltZXJhbmdlIDogR2VuZXJhdGUgYWxsIHByaW1lcyBpbiBhIGdpdmVuIHJhbmdlXG4gICAgKi9cbiAgICBuID0gTWF0aC5mbG9vcihuKTtcbiAgICBjb25zdCBpID0gYXNfaW50KGl0aCk7XG4gICAgaWYgKGkgPiAxKSB7XG4gICAgICAgIGxldCBwciA9IG47XG4gICAgICAgIGxldCBqID0gMTtcbiAgICAgICAgd2hpbGUgKDEpIHtcbiAgICAgICAgICAgIHByID0gbmV4dHByaW1lKHByKTtcbiAgICAgICAgICAgIGorKztcbiAgICAgICAgICAgIGlmIChqID4gMSkge1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBwcjtcbiAgICB9XG4gICAgaWYgKG4gPCAyKSB7XG4gICAgICAgIHJldHVybiAyO1xuICAgIH1cbiAgICBpZiAobiA8IDcpIHtcbiAgICAgICAgcmV0dXJuIHsyOiAzLCAzOiA1LCA0OiA1LCA1OiA3LCA2OiA3fVtuXTtcbiAgICB9XG4gICAgY29uc3Qgbm4gPSA2ICogTWF0aC5mbG9vcihuLzYpO1xuICAgIGlmIChubiA9PT0gbikge1xuICAgICAgICBuKys7XG4gICAgICAgIGlmIChpc3ByaW1lKG4pKSB7XG4gICAgICAgICAgICByZXR1cm4gbjtcbiAgICAgICAgfVxuICAgICAgICBuICs9IDQ7XG4gICAgfSBlbHNlIGlmIChuIC0gbm4gPT09IDUpIHtcbiAgICAgICAgbiArPSAyO1xuICAgICAgICBpZiAoaXNwcmltZShuKSkge1xuICAgICAgICAgICAgcmV0dXJuIG47XG4gICAgICAgIH1cbiAgICAgICAgbiArPSA0O1xuICAgIH0gZWxzZSB7XG4gICAgICAgIG4gPSBubiArIDU7XG4gICAgfVxuICAgIHdoaWxlICgxKSB7XG4gICAgICAgIGlmIChpc3ByaW1lKG4pKSB7XG4gICAgICAgICAgICByZXR1cm4gbjtcbiAgICAgICAgfVxuICAgICAgICBuICs9IDI7XG4gICAgICAgIGlmIChpc3ByaW1lKG4pKSB7XG4gICAgICAgICAgICByZXR1cm4gbjtcbiAgICAgICAgfVxuICAgICAgICBuICs9IDQ7XG4gICAgfVxufVxuXG5leHBvcnQgY29uc3QgZGl2bW9kID0gKGE6IG51bWJlciwgYjogbnVtYmVyKSA9PiBbTWF0aC5mbG9vcihhL2IpLCBhJWJdO1xuXG5mdW5jdGlvbiBtdWx0aXBsaWNpdHkocDogYW55LCBuOiBhbnkpOiBhbnkge1xuICAgIC8qXG4gICAgRmluZCB0aGUgZ3JlYXRlc3QgaW50ZWdlciBtIHN1Y2ggdGhhdCBwKiptIGRpdmlkZXMgbi5cbiAgICBFeGFtcGxlc1xuICAgID09PT09PT09XG4gICAgPj4+IGZyb20gc3ltcHkgaW1wb3J0IG11bHRpcGxpY2l0eSwgUmF0aW9uYWxcbiAgICA+Pj4gW211bHRpcGxpY2l0eSg1LCBuKSBmb3IgbiBpbiBbOCwgNSwgMjUsIDEyNSwgMjUwXV1cbiAgICBbMCwgMSwgMiwgMywgM11cbiAgICA+Pj4gbXVsdGlwbGljaXR5KDMsIFJhdGlvbmFsKDEsIDkpKVxuICAgIC0yXG4gICAgTm90ZTogd2hlbiBjaGVja2luZyBmb3IgdGhlIG11bHRpcGxpY2l0eSBvZiBhIG51bWJlciBpbiBhXG4gICAgbGFyZ2UgZmFjdG9yaWFsIGl0IGlzIG1vc3QgZWZmaWNpZW50IHRvIHNlbmQgaXQgYXMgYW4gdW5ldmFsdWF0ZWRcbiAgICBmYWN0b3JpYWwgb3IgdG8gY2FsbCBgYG11bHRpcGxpY2l0eV9pbl9mYWN0b3JpYWxgYCBkaXJlY3RseTpcbiAgICA+Pj4gZnJvbSBzeW1weS5udGhlb3J5IGltcG9ydCBtdWx0aXBsaWNpdHlfaW5fZmFjdG9yaWFsXG4gICAgPj4+IGZyb20gc3ltcHkgaW1wb3J0IGZhY3RvcmlhbFxuICAgID4+PiBwID0gZmFjdG9yaWFsKDI1KVxuICAgID4+PiBuID0gMioqMTAwXG4gICAgPj4+IG5mYWMgPSBmYWN0b3JpYWwobiwgZXZhbHVhdGU9RmFsc2UpXG4gICAgPj4+IG11bHRpcGxpY2l0eShwLCBuZmFjKVxuICAgIDUyODE4Nzc1MDA5NTA5NTU4Mzk1Njk1OTY2ODg3XG4gICAgPj4+IF8gPT0gbXVsdGlwbGljaXR5X2luX2ZhY3RvcmlhbChwLCBuKVxuICAgIFRydWVcbiAgICAqL1xuICAgIHRyeSB7XG4gICAgICAgIFtwLCBuXSA9IFthc19pbnQocCksIGFzX2ludChuKV07XG4gICAgfSBjYXRjaCAoRXJyb3IpIHtcbiAgICAgICAgaWYgKE51bWJlci5pc0ludGVnZXIocCkgfHwgcCBpbnN0YW5jZW9mIFJhdGlvbmFsICYmIE51bWJlci5pc0ludGVnZXIobikgfHwgbiBpbnN0YW5jZW9mIFJhdGlvbmFsKSB7XG4gICAgICAgICAgICBwID0gbmV3IFJhdGlvbmFsKHApO1xuICAgICAgICAgICAgbiA9IG5ldyBSYXRpb25hbChuKTtcbiAgICAgICAgICAgIGlmIChwLnEgPT09IDEpIHtcbiAgICAgICAgICAgICAgICBpZiAobi5wID09PSAxKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiAtbXVsdGlwbGljaXR5KHAucCwgbi5xKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgcmV0dXJuIG11bHRpcGxpY2l0eShwLnAsIG4ucCkgLSBtdWx0aXBsaWNpdHkocC5wLCBuLnEpO1xuICAgICAgICAgICAgfSBlbHNlIGlmIChwLnAgPT09IDEpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gbXVsdGlwbGljaXR5KHAucSwgbi5xKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgY29uc3QgbGlrZSA9IE1hdGgubWluKG11bHRpcGxpY2l0eShwLnAsIG4ucCksIG11bHRpcGxpY2l0eShwLnEsIG4ucSkpO1xuICAgICAgICAgICAgICAgIGNvbnN0IGNyb3NzID0gTWF0aC5taW4obXVsdGlwbGljaXR5KHAucSwgbi5wKSwgbXVsdGlwbGljaXR5KHAucCwgbi5xKSk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGxpa2UgLSBjcm9zcztcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cbiAgICBpZiAobiA9PT0gMCkge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJubyBpbnQgZXhpc3RzXCIpO1xuICAgIH1cbiAgICBpZiAocCA9PT0gMikge1xuICAgICAgICByZXR1cm4gdHJhaWxpbmcobik7XG4gICAgfVxuICAgIGlmIChwIDwgMikge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJwIG11c3QgYmUgaW50XCIpO1xuICAgIH1cbiAgICBpZiAocCA9PT0gbikge1xuICAgICAgICByZXR1cm4gMTtcbiAgICB9XG5cbiAgICBsZXQgbSA9IDA7XG4gICAgbiA9IE1hdGguZmxvb3Iobi9wKTtcbiAgICBsZXQgcmVtID0gbiAlIHA7XG4gICAgd2hpbGUgKCFyZW0pIHtcbiAgICAgICAgbSsrO1xuICAgICAgICBpZiAobSA+IDUpIHtcbiAgICAgICAgICAgIGxldCBlID0gMjtcbiAgICAgICAgICAgIHdoaWxlICgxKSB7XG4gICAgICAgICAgICAgICAgY29uc3QgcHBvdyA9IHAqKmU7XG4gICAgICAgICAgICAgICAgaWYgKHBwb3cgPCBuKSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IG5uZXcgPSBNYXRoLmZsb29yKG4vcHBvdyk7XG4gICAgICAgICAgICAgICAgICAgIHJlbSA9IG4gJSBwcG93O1xuICAgICAgICAgICAgICAgICAgICBpZiAoIShyZW0pKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBtICs9IGU7XG4gICAgICAgICAgICAgICAgICAgICAgICBlICo9IDI7XG4gICAgICAgICAgICAgICAgICAgICAgICBuID0gbm5ldztcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHJldHVybiBtICsgbXVsdGlwbGljaXR5KHAsIG4pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIFtuLCByZW1dID0gZGl2bW9kKG4sIHApO1xuICAgIH1cbiAgICByZXR1cm4gbTtcbn1cblxuZnVuY3Rpb24gZGl2aXNvcnMobjogbnVtYmVyLCBnZW5lcmF0b3I6IGJvb2xlYW4gPSBmYWxzZSwgcHJvcGVyOiBib29sZWFuID0gZmFsc2UpIHtcbiAgICAvKlxuICAgIFJldHVybiBhbGwgZGl2aXNvcnMgb2YgbiBzb3J0ZWQgZnJvbSAxLi5uIGJ5IGRlZmF1bHQuXG4gICAgSWYgZ2VuZXJhdG9yIGlzIGBgVHJ1ZWBgIGFuIHVub3JkZXJlZCBnZW5lcmF0b3IgaXMgcmV0dXJuZWQuXG4gICAgVGhlIG51bWJlciBvZiBkaXZpc29ycyBvZiBuIGNhbiBiZSBxdWl0ZSBsYXJnZSBpZiB0aGVyZSBhcmUgbWFueVxuICAgIHByaW1lIGZhY3RvcnMgKGNvdW50aW5nIHJlcGVhdGVkIGZhY3RvcnMpLiBJZiBvbmx5IHRoZSBudW1iZXIgb2ZcbiAgICBmYWN0b3JzIGlzIGRlc2lyZWQgdXNlIGRpdmlzb3JfY291bnQobikuXG4gICAgRXhhbXBsZXNcbiAgICA9PT09PT09PVxuICAgID4+PiBmcm9tIHN5bXB5IGltcG9ydCBkaXZpc29ycywgZGl2aXNvcl9jb3VudFxuICAgID4+PiBkaXZpc29ycygyNClcbiAgICBbMSwgMiwgMywgNCwgNiwgOCwgMTIsIDI0XVxuICAgID4+PiBkaXZpc29yX2NvdW50KDI0KVxuICAgIDhcbiAgICA+Pj4gbGlzdChkaXZpc29ycygxMjAsIGdlbmVyYXRvcj1UcnVlKSlcbiAgICBbMSwgMiwgNCwgOCwgMywgNiwgMTIsIDI0LCA1LCAxMCwgMjAsIDQwLCAxNSwgMzAsIDYwLCAxMjBdXG4gICAgTm90ZXNcbiAgICA9PT09PVxuICAgIFRoaXMgaXMgYSBzbGlnaHRseSBtb2RpZmllZCB2ZXJzaW9uIG9mIFRpbSBQZXRlcnMgcmVmZXJlbmNlZCBhdDpcbiAgICBodHRwczovL3N0YWNrb3ZlcmZsb3cuY29tL3F1ZXN0aW9ucy8xMDEwMzgxL3B5dGhvbi1mYWN0b3JpemF0aW9uXG4gICAgU2VlIEFsc29cbiAgICA9PT09PT09PVxuICAgIHByaW1lZmFjdG9ycywgZmFjdG9yaW50LCBkaXZpc29yX2NvdW50XG4gICAgKi9cbiAgICBuID0gYXNfaW50KE1hdGguYWJzKG4pKTtcbiAgICBpZiAoaXNwcmltZShuKSkge1xuICAgICAgICBpZiAocHJvcGVyKSB7XG4gICAgICAgICAgICByZXR1cm4gWzFdO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBbMSwgbl07XG4gICAgfVxuICAgIGlmIChuID09PSAxKSB7XG4gICAgICAgIGlmIChwcm9wZXIpIHtcbiAgICAgICAgICAgIHJldHVybiBbXTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gWzFdO1xuICAgIH1cbiAgICBpZiAobiA9PT0gMCkge1xuICAgICAgICByZXR1cm4gW107XG4gICAgfVxuICAgIGNvbnN0IHJ2ID0gX2Rpdmlzb3JzKG4sIHByb3Blcik7XG4gICAgaWYgKCFnZW5lcmF0b3IpIHtcbiAgICAgICAgY29uc3QgdGVtcCA9IFtdO1xuICAgICAgICBmb3IgKGNvbnN0IGkgb2YgcnYpIHtcbiAgICAgICAgICAgIHRlbXAucHVzaChpKTtcbiAgICAgICAgfVxuICAgICAgICB0ZW1wLnNvcnQoKTtcbiAgICAgICAgcmV0dXJuIHRlbXA7XG4gICAgfVxuICAgIHJldHVybiBydjtcbn1cblxuZnVuY3Rpb24qIF9kaXZpc29ycyhuOiBudW1iZXIsIGdlbmVyYXRvcjogYm9vbGVhbiA9IGZhbHNlLCBwcm9wZXI6IGJvb2xlYW4gPSBmYWxzZSkge1xuICAgIC8vIEhlbHBlciBmdW5jdGlvbiBmb3IgZGl2aXNvcnMgd2hpY2ggZ2VuZXJhdGVzIHRoZSBkaXZpc29ycy5cbiAgICBjb25zdCBmYWN0b3JkaWN0ID0gZmFjdG9yaW50KG4pO1xuICAgIGNvbnN0IHBzID0gZmFjdG9yZGljdC5rZXlzKCkuc29ydCgpO1xuXG4gICAgZnVuY3Rpb24qIHJlY19nZW4objogbnVtYmVyID0gMCk6IGFueSB7XG4gICAgICAgIGlmIChuID09PSBwcy5sZW5ndGgpIHtcbiAgICAgICAgICAgIHlpZWxkIDE7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBjb25zdCBwb3dzID0gWzFdO1xuICAgICAgICAgICAgZm9yIChsZXQgaiA9IDA7IGogPCBmYWN0b3JkaWN0LmdldChwc1tuXSk7IGorKykge1xuICAgICAgICAgICAgICAgIHBvd3MucHVzaChwb3dzW3Bvd3MubGVuZ3RoIC0gMV0gKiBwc1tuXSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBmb3IgKGNvbnN0IHEgb2YgcmVjX2dlbihuICsgMSkpIHtcbiAgICAgICAgICAgICAgICBmb3IgKGNvbnN0IHAgb2YgcG93cykge1xuICAgICAgICAgICAgICAgICAgICB5aWVsZCBwICogcTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG4gICAgaWYgKHByb3Blcikge1xuICAgICAgICBmb3IgKGNvbnN0IHAgb2YgcmVjX2dlbigpKSB7XG4gICAgICAgICAgICBpZiAocCAhPSBuKSB7XG4gICAgICAgICAgICAgICAgeWllbGQgcDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICAgIGZvciAoY29uc3QgcCBvZiByZWNfZ2VuKCkpIHtcbiAgICAgICAgICAgIHlpZWxkIHA7XG4gICAgICAgIH1cbiAgICB9XG59XG5cblxuZnVuY3Rpb24gX2NoZWNrX3Rlcm1pbmF0aW9uKGZhY3RvcnM6IGFueSwgbjogbnVtYmVyLCBsaW1pdHAxOiBhbnkpIHtcbiAgICAvKlxuICAgIEhlbHBlciBmdW5jdGlvbiBmb3IgaW50ZWdlciBmYWN0b3JpemF0aW9uLiBDaGVja3MgaWYgYGBuYGBcbiAgICBpcyBhIHByaW1lIG9yIGEgcGVyZmVjdCBwb3dlciwgYW5kIGluIHRob3NlIGNhc2VzIHVwZGF0ZXNcbiAgICB0aGUgZmFjdG9yaXphdGlvbiBhbmQgcmFpc2VzIGBgU3RvcEl0ZXJhdGlvbmBgLlxuICAgICovXG4gICAgY29uc3QgcCA9IHBlcmZlY3RfcG93ZXIobiwgdW5kZWZpbmVkLCB0cnVlLCBmYWxzZSk7XG4gICAgaWYgKHAgIT09IGZhbHNlKSB7XG4gICAgICAgIGNvbnN0IFtiYXNlLCBleHBdID0gcDtcbiAgICAgICAgbGV0IGxpbWl0O1xuICAgICAgICBpZiAobGltaXRwMSkge1xuICAgICAgICAgICAgbGltaXQgPSBsaW1pdHAxID0gMTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGxpbWl0ID0gbGltaXRwMTtcbiAgICAgICAgfVxuICAgICAgICBjb25zdCBmYWNzID0gZmFjdG9yaW50KGJhc2UsIGxpbWl0KTtcbiAgICAgICAgZm9yIChjb25zdCBbYiwgZV0gb2YgZmFjcy5lbnRyaWVzKCkpIHtcbiAgICAgICAgICAgIGZhY3RvcnNbYl0gPSBleHAqZTtcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcigpO1xuICAgICAgICB9XG4gICAgfVxuICAgIGlmIChpc3ByaW1lKG4pKSB7XG4gICAgICAgIGZhY3RvcnMuYWRkKG4sIDEpO1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoKTtcbiAgICB9XG4gICAgaWYgKG4gPT09IDEpIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKCk7XG4gICAgfVxufVxuXG5mdW5jdGlvbiBfdHJpYWwoZmFjdG9yczogYW55LCBuOiBudW1iZXIsIGNhbmRpZGF0ZXM6IGFueSkge1xuICAgIC8qXG4gICAgSGVscGVyIGZ1bmN0aW9uIGZvciBpbnRlZ2VyIGZhY3Rvcml6YXRpb24uIFRyaWFsIGZhY3RvcnMgYGBuYFxuICAgIGFnYWluc3QgYWxsIGludGVnZXJzIGdpdmVuIGluIHRoZSBzZXF1ZW5jZSBgYGNhbmRpZGF0ZXNgYFxuICAgIGFuZCB1cGRhdGVzIHRoZSBkaWN0IGBgZmFjdG9yc2BgIGluLXBsYWNlLiBSZXR1cm5zIHRoZSByZWR1Y2VkXG4gICAgdmFsdWUgb2YgYGBuYGAgYW5kIGEgZmxhZyBpbmRpY2F0aW5nIHdoZXRoZXIgYW55IGZhY3RvcnMgd2VyZSBmb3VuZC5cbiAgICAqL1xuICAgIGNvbnN0IG5mYWN0b3JzID0gZmFjdG9ycy5sZW5ndGg7XG4gICAgZm9yIChjb25zdCBkIG9mIGNhbmRpZGF0ZXMpIHtcbiAgICAgICAgaWYgKG4gJSBkID09PSAwKSB7XG4gICAgICAgICAgICBjb25zdCBtID0gbXVsdGlwbGljaXR5KGQsIG4pO1xuICAgICAgICAgICAgbiA9IE1hdGguZmxvb3Iobi8oZCoqbSkpO1xuICAgICAgICAgICAgZmFjdG9yc1tkXSA9IG07XG4gICAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIFtuLCBmYWN0b3JzLmxlbmd0aCAhPT0gbmZhY3RvcnNdO1xufVxuXG5mdW5jdGlvbiBfZmFjdG9yaW50X3NtYWxsKGZhY3RvcnM6IEhhc2hEaWN0LCBuOiBhbnksIGxpbWl0OiBhbnksIGZhaWxfbWF4OiBhbnkpIHtcbiAgICAvKlxuICAgIFJldHVybiB0aGUgdmFsdWUgb2YgbiBhbmQgZWl0aGVyIGEgMCAoaW5kaWNhdGluZyB0aGF0IGZhY3Rvcml6YXRpb24gdXBcbiAgICB0byB0aGUgbGltaXQgd2FzIGNvbXBsZXRlKSBvciBlbHNlIHRoZSBuZXh0IG5lYXItcHJpbWUgdGhhdCB3b3VsZCBoYXZlXG4gICAgYmVlbiB0ZXN0ZWQuXG4gICAgRmFjdG9yaW5nIHN0b3BzIGlmIHRoZXJlIGFyZSBmYWlsX21heCB1bnN1Y2Nlc3NmdWwgdGVzdHMgaW4gYSByb3cuXG4gICAgSWYgZmFjdG9ycyBvZiBuIHdlcmUgZm91bmQgdGhleSB3aWxsIGJlIGluIHRoZSBmYWN0b3JzIGRpY3Rpb25hcnkgYXNcbiAgICB7ZmFjdG9yOiBtdWx0aXBsaWNpdHl9IGFuZCB0aGUgcmV0dXJuZWQgdmFsdWUgb2YgbiB3aWxsIGhhdmUgaGFkIHRob3NlXG4gICAgZmFjdG9ycyByZW1vdmVkLiBUaGUgZmFjdG9ycyBkaWN0aW9uYXJ5IGlzIG1vZGlmaWVkIGluLXBsYWNlLlxuICAgICovXG4gICAgZnVuY3Rpb24gZG9uZShuOiBudW1iZXIsIGQ6IG51bWJlcikge1xuICAgICAgICAvKlxuICAgICAgICByZXR1cm4gbiwgZCBpZiB0aGUgc3FydChuKSB3YXMgbm90IHJlYWNoZWQgeWV0LCBlbHNlXG4gICAgICAgIG4sIDAgaW5kaWNhdGluZyB0aGF0IGZhY3RvcmluZyBpcyBkb25lLlxuICAgICAgICAqL1xuICAgICAgICBpZiAoZCpkIDw9IG4pIHtcbiAgICAgICAgICAgIHJldHVybiBbbiwgZF07XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIFtuLCAwXTtcbiAgICB9XG4gICAgbGV0IGQgPSAyO1xuICAgIGxldCBtID0gdHJhaWxpbmcobik7XG4gICAgaWYgKG0pIHtcbiAgICAgICAgZmFjdG9ycy5hZGQoZCwgbSk7XG4gICAgICAgIG4gPj49IG07XG4gICAgfVxuICAgIGQgPSAzO1xuICAgIGlmIChsaW1pdCA8IGQpIHtcbiAgICAgICAgaWYgKG4gPiAxKSB7XG4gICAgICAgICAgICBmYWN0b3JzLmFkZChuLCAxKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gZG9uZShuLCBkKTtcbiAgICB9XG4gICAgbSA9IDA7XG4gICAgd2hpbGUgKG4gJSBkID09PSAwKSB7XG4gICAgICAgIG4gPSBNYXRoLmZsb29yKG4vZCk7XG4gICAgICAgIG0rKztcbiAgICAgICAgaWYgKG0gPT09IDIwKSB7XG4gICAgICAgICAgICBjb25zdCBtbSA9IG11bHRpcGxpY2l0eShkLCBuKTtcbiAgICAgICAgICAgIG0gKz0gbW07XG4gICAgICAgICAgICBuID0gTWF0aC5mbG9vcihuLyhkKiptbSkpO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cbiAgICB9XG4gICAgaWYgKG0pIHtcbiAgICAgICAgZmFjdG9ycy5hZGQoZCwgbSk7XG4gICAgfVxuICAgIGxldCBtYXh4O1xuICAgIGlmIChsaW1pdCAqIGxpbWl0ID4gbikge1xuICAgICAgICBtYXh4ID0gMDtcbiAgICB9IGVsc2Uge1xuICAgICAgICBtYXh4ID0gbGltaXQqbGltaXQ7XG4gICAgfVxuICAgIGxldCBkZCA9IG1heHggfHwgbjtcbiAgICBkID0gNTtcbiAgICBsZXQgZmFpbHMgPSAwO1xuICAgIHdoaWxlIChmYWlscyA8IGZhaWxfbWF4KSB7XG4gICAgICAgIGlmIChkKmQgPiBkZCkge1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cbiAgICAgICAgbSA9IDA7XG4gICAgICAgIHdoaWxlIChuICUgZCA9PT0gMCkge1xuICAgICAgICAgICAgbiA9IE1hdGguZmxvb3Iobi9kKTtcbiAgICAgICAgICAgIG0rKztcbiAgICAgICAgICAgIGlmIChtID09PSAyMCkge1xuICAgICAgICAgICAgICAgIGNvbnN0IG1tID0gbXVsdGlwbGljaXR5KGQsIG4pO1xuICAgICAgICAgICAgICAgIG0gKz0gbW07XG4gICAgICAgICAgICAgICAgbiA9IE1hdGguZmxvb3IobiAvIChkKiptbSkpO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGlmIChtKSB7XG4gICAgICAgICAgICBmYWN0b3JzLmFkZChkLCBtKTtcbiAgICAgICAgICAgIGRkID0gbWF4eCB8fCBuO1xuICAgICAgICAgICAgZmFpbHMgPSAwO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgZmFpbHMrKztcbiAgICAgICAgfVxuICAgICAgICBkICs9IDI7XG4gICAgICAgIGlmIChkKmQ+IGRkKSB7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuICAgICAgICBtID0gMDtcbiAgICAgICAgd2hpbGUgKG4gJSBkID09PSAwKSB7XG4gICAgICAgICAgICBuID0gTWF0aC5mbG9vcihuIC8gZCk7XG4gICAgICAgICAgICBtKys7XG4gICAgICAgICAgICBpZiAobSA9PT0gMjApIHtcbiAgICAgICAgICAgICAgICBjb25zdCBtbSA9IG11bHRpcGxpY2l0eShkLCBuKTtcbiAgICAgICAgICAgICAgICBtICs9IG1tO1xuICAgICAgICAgICAgICAgIG4gPSBNYXRoLmZsb29yKG4vKGQqKm1tKSk7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgaWYgKG0pIHtcbiAgICAgICAgICAgIGZhY3RvcnMuYWRkKGQsIG0pO1xuICAgICAgICAgICAgZGQgPSBtYXh4IHx8IG47XG4gICAgICAgICAgICBmYWlscyA9IDA7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBmYWlscysrO1xuICAgICAgICB9XG4gICAgICAgIGQgKz00O1xuICAgIH1cbiAgICByZXR1cm4gZG9uZShuLCBkKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGZhY3RvcmludChuOiBhbnksIGxpbWl0OiBhbnkgPSB1bmRlZmluZWQpOiBIYXNoRGljdCB7XG4gICAgLypcbiAgICBHaXZlbiBhIHBvc2l0aXZlIGludGVnZXIgYGBuYGAsIGBgZmFjdG9yaW50KG4pYGAgcmV0dXJucyBhIGRpY3QgY29udGFpbmluZ1xuICAgIHRoZSBwcmltZSBmYWN0b3JzIG9mIGBgbmBgIGFzIGtleXMgYW5kIHRoZWlyIHJlc3BlY3RpdmUgbXVsdGlwbGljaXRpZXNcbiAgICBhcyB2YWx1ZXMuIEZvciBleGFtcGxlOlxuICAgID4+PiBmcm9tIHN5bXB5Lm50aGVvcnkgaW1wb3J0IGZhY3RvcmludFxuICAgID4+PiBmYWN0b3JpbnQoMjAwMCkgICAgIyAyMDAwID0gKDIqKjQpICogKDUqKjMpXG4gICAgezI6IDQsIDU6IDN9XG4gICAgPj4+IGZhY3RvcmludCg2NTUzNykgICAjIFRoaXMgbnVtYmVyIGlzIHByaW1lXG4gICAgezY1NTM3OiAxfVxuICAgIEZvciBpbnB1dCBsZXNzIHRoYW4gMiwgZmFjdG9yaW50IGJlaGF2ZXMgYXMgZm9sbG93czpcbiAgICAgICAgLSBgYGZhY3RvcmludCgxKWBgIHJldHVybnMgdGhlIGVtcHR5IGZhY3Rvcml6YXRpb24sIGBge31gYFxuICAgICAgICAtIGBgZmFjdG9yaW50KDApYGAgcmV0dXJucyBgYHswOjF9YGBcbiAgICAgICAgLSBgYGZhY3RvcmludCgtbilgYCBhZGRzIGBgLTE6MWBgIHRvIHRoZSBmYWN0b3JzIGFuZCB0aGVuIGZhY3RvcnMgYGBuYGBcbiAgICBQYXJ0aWFsIEZhY3Rvcml6YXRpb246XG4gICAgSWYgYGBsaW1pdGBgICg+IDMpIGlzIHNwZWNpZmllZCwgdGhlIHNlYXJjaCBpcyBzdG9wcGVkIGFmdGVyIHBlcmZvcm1pbmdcbiAgICB0cmlhbCBkaXZpc2lvbiB1cCB0byAoYW5kIGluY2x1ZGluZykgdGhlIGxpbWl0IChvciB0YWtpbmcgYVxuICAgIGNvcnJlc3BvbmRpbmcgbnVtYmVyIG9mIHJoby9wLTEgc3RlcHMpLiBUaGlzIGlzIHVzZWZ1bCBpZiBvbmUgaGFzXG4gICAgYSBsYXJnZSBudW1iZXIgYW5kIG9ubHkgaXMgaW50ZXJlc3RlZCBpbiBmaW5kaW5nIHNtYWxsIGZhY3RvcnMgKGlmXG4gICAgYW55KS4gTm90ZSB0aGF0IHNldHRpbmcgYSBsaW1pdCBkb2VzIG5vdCBwcmV2ZW50IGxhcmdlciBmYWN0b3JzXG4gICAgZnJvbSBiZWluZyBmb3VuZCBlYXJseTsgaXQgc2ltcGx5IG1lYW5zIHRoYXQgdGhlIGxhcmdlc3QgZmFjdG9yIG1heVxuICAgIGJlIGNvbXBvc2l0ZS4gU2luY2UgY2hlY2tpbmcgZm9yIHBlcmZlY3QgcG93ZXIgaXMgcmVsYXRpdmVseSBjaGVhcCwgaXQgaXNcbiAgICBkb25lIHJlZ2FyZGxlc3Mgb2YgdGhlIGxpbWl0IHNldHRpbmcuXG4gICAgVGhpcyBudW1iZXIsIGZvciBleGFtcGxlLCBoYXMgdHdvIHNtYWxsIGZhY3RvcnMgYW5kIGEgaHVnZVxuICAgIHNlbWktcHJpbWUgZmFjdG9yIHRoYXQgY2Fubm90IGJlIHJlZHVjZWQgZWFzaWx5OlxuICAgID4+PiBmcm9tIHN5bXB5Lm50aGVvcnkgaW1wb3J0IGlzcHJpbWVcbiAgICA+Pj4gYSA9IDE0MDc2MzM3MTcyNjIzMzg5NTc0MzA2OTc5MjE0NDY4ODNcbiAgICA+Pj4gZiA9IGZhY3RvcmludChhLCBsaW1pdD0xMDAwMClcbiAgICA+Pj4gZiA9PSB7OTkxOiAxLCBpbnQoMjAyOTE2NzgyMDc2MTYyNDU2MDIyODc3MDI0ODU5KTogMSwgNzogMX1cbiAgICBUcnVlXG4gICAgPj4+IGlzcHJpbWUobWF4KGYpKVxuICAgIEZhbHNlXG4gICAgVGhpcyBudW1iZXIgaGFzIGEgc21hbGwgZmFjdG9yIGFuZCBhIHJlc2lkdWFsIHBlcmZlY3QgcG93ZXIgd2hvc2VcbiAgICBiYXNlIGlzIGdyZWF0ZXIgdGhhbiB0aGUgbGltaXQ6XG4gICAgPj4+IGZhY3RvcmludCgzKjEwMSoqNywgbGltaXQ9NSlcbiAgICB7MzogMSwgMTAxOiA3fVxuICAgIExpc3Qgb2YgRmFjdG9yczpcbiAgICBJZiBgYG11bHRpcGxlYGAgaXMgc2V0IHRvIGBgVHJ1ZWBgIHRoZW4gYSBsaXN0IGNvbnRhaW5pbmcgdGhlXG4gICAgcHJpbWUgZmFjdG9ycyBpbmNsdWRpbmcgbXVsdGlwbGljaXRpZXMgaXMgcmV0dXJuZWQuXG4gICAgPj4+IGZhY3RvcmludCgyNCwgbXVsdGlwbGU9VHJ1ZSlcbiAgICBbMiwgMiwgMiwgM11cbiAgICBWaXN1YWwgRmFjdG9yaXphdGlvbjpcbiAgICBJZiBgYHZpc3VhbGBgIGlzIHNldCB0byBgYFRydWVgYCwgdGhlbiBpdCB3aWxsIHJldHVybiBhIHZpc3VhbFxuICAgIGZhY3Rvcml6YXRpb24gb2YgdGhlIGludGVnZXIuICBGb3IgZXhhbXBsZTpcbiAgICA+Pj4gZnJvbSBzeW1weSBpbXBvcnQgcHByaW50XG4gICAgPj4+IHBwcmludChmYWN0b3JpbnQoNDIwMCwgdmlzdWFsPVRydWUpKVxuICAgICAzICAxICAyICAxXG4gICAgMiAqMyAqNSAqN1xuICAgIE5vdGUgdGhhdCB0aGlzIGlzIGFjaGlldmVkIGJ5IHVzaW5nIHRoZSBldmFsdWF0ZT1GYWxzZSBmbGFnIGluIE11bFxuICAgIGFuZCBQb3cuIElmIHlvdSBkbyBvdGhlciBtYW5pcHVsYXRpb25zIHdpdGggYW4gZXhwcmVzc2lvbiB3aGVyZVxuICAgIGV2YWx1YXRlPUZhbHNlLCBpdCBtYXkgZXZhbHVhdGUuICBUaGVyZWZvcmUsIHlvdSBzaG91bGQgdXNlIHRoZVxuICAgIHZpc3VhbCBvcHRpb24gb25seSBmb3IgdmlzdWFsaXphdGlvbiwgYW5kIHVzZSB0aGUgbm9ybWFsIGRpY3Rpb25hcnlcbiAgICByZXR1cm5lZCBieSB2aXN1YWw9RmFsc2UgaWYgeW91IHdhbnQgdG8gcGVyZm9ybSBvcGVyYXRpb25zIG9uIHRoZVxuICAgIGZhY3RvcnMuXG4gICAgWW91IGNhbiBlYXNpbHkgc3dpdGNoIGJldHdlZW4gdGhlIHR3byBmb3JtcyBieSBzZW5kaW5nIHRoZW0gYmFjayB0b1xuICAgIGZhY3RvcmludDpcbiAgICA+Pj4gZnJvbSBzeW1weSBpbXBvcnQgTXVsXG4gICAgPj4+IHJlZ3VsYXIgPSBmYWN0b3JpbnQoMTc2NCk7IHJlZ3VsYXJcbiAgICB7MjogMiwgMzogMiwgNzogMn1cbiAgICA+Pj4gcHByaW50KGZhY3RvcmludChyZWd1bGFyKSlcbiAgICAgMiAgMiAgMlxuICAgIDIgKjMgKjdcbiAgICA+Pj4gdmlzdWFsID0gZmFjdG9yaW50KDE3NjQsIHZpc3VhbD1UcnVlKTsgcHByaW50KHZpc3VhbClcbiAgICAgMiAgMiAgMlxuICAgIDIgKjMgKjdcbiAgICA+Pj4gcHJpbnQoZmFjdG9yaW50KHZpc3VhbCkpXG4gICAgezI6IDIsIDM6IDIsIDc6IDJ9XG4gICAgSWYgeW91IHdhbnQgdG8gc2VuZCBhIG51bWJlciB0byBiZSBmYWN0b3JlZCBpbiBhIHBhcnRpYWxseSBmYWN0b3JlZCBmb3JtXG4gICAgeW91IGNhbiBkbyBzbyB3aXRoIGEgZGljdGlvbmFyeSBvciB1bmV2YWx1YXRlZCBleHByZXNzaW9uOlxuICAgID4+PiBmYWN0b3JpbnQoZmFjdG9yaW50KHs0OiAyLCAxMjogM30pKSAjIHR3aWNlIHRvIHRvZ2dsZSB0byBkaWN0IGZvcm1cbiAgICB7MjogMTAsIDM6IDN9XG4gICAgPj4+IGZhY3RvcmludChNdWwoNCwgMTIsIGV2YWx1YXRlPUZhbHNlKSlcbiAgICB7MjogNCwgMzogMX1cbiAgICBUaGUgdGFibGUgb2YgdGhlIG91dHB1dCBsb2dpYyBpczpcbiAgICAgICAgPT09PT09ID09PT09PSA9PT09PT09ID09PT09PT1cbiAgICAgICAgICAgICAgICAgICAgICAgVmlzdWFsXG4gICAgICAgIC0tLS0tLSAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgICAgIElucHV0ICBUcnVlICAgRmFsc2UgICBvdGhlclxuICAgICAgICA9PT09PT0gPT09PT09ID09PT09PT0gPT09PT09PVxuICAgICAgICBkaWN0ICAgIG11bCAgICBkaWN0ICAgIG11bFxuICAgICAgICBuICAgICAgIG11bCAgICBkaWN0ICAgIGRpY3RcbiAgICAgICAgbXVsICAgICBtdWwgICAgZGljdCAgICBkaWN0XG4gICAgICAgID09PT09PSA9PT09PT0gPT09PT09PSA9PT09PT09XG4gICAgTm90ZXNcbiAgICA9PT09PVxuICAgIEFsZ29yaXRobTpcbiAgICBUaGUgZnVuY3Rpb24gc3dpdGNoZXMgYmV0d2VlbiBtdWx0aXBsZSBhbGdvcml0aG1zLiBUcmlhbCBkaXZpc2lvblxuICAgIHF1aWNrbHkgZmluZHMgc21hbGwgZmFjdG9ycyAob2YgdGhlIG9yZGVyIDEtNSBkaWdpdHMpLCBhbmQgZmluZHNcbiAgICBhbGwgbGFyZ2UgZmFjdG9ycyBpZiBnaXZlbiBlbm91Z2ggdGltZS4gVGhlIFBvbGxhcmQgcmhvIGFuZCBwLTFcbiAgICBhbGdvcml0aG1zIGFyZSB1c2VkIHRvIGZpbmQgbGFyZ2UgZmFjdG9ycyBhaGVhZCBvZiB0aW1lOyB0aGV5XG4gICAgd2lsbCBvZnRlbiBmaW5kIGZhY3RvcnMgb2YgdGhlIG9yZGVyIG9mIDEwIGRpZ2l0cyB3aXRoaW4gYSBmZXdcbiAgICBzZWNvbmRzOlxuICAgID4+PiBmYWN0b3JzID0gZmFjdG9yaW50KDEyMzQ1Njc4OTEwMTExMjEzMTQxNTE2KVxuICAgID4+PiBmb3IgYmFzZSwgZXhwIGluIHNvcnRlZChmYWN0b3JzLml0ZW1zKCkpOlxuICAgIC4uLiAgICAgcHJpbnQoJyVzICVzJyAlIChiYXNlLCBleHApKVxuICAgIC4uLlxuICAgIDIgMlxuICAgIDI1MDcxOTE2OTEgMVxuICAgIDEyMzEwMjY2MjU3NjkgMVxuICAgIEFueSBvZiB0aGVzZSBtZXRob2RzIGNhbiBvcHRpb25hbGx5IGJlIGRpc2FibGVkIHdpdGggdGhlIGZvbGxvd2luZ1xuICAgIGJvb2xlYW4gcGFyYW1ldGVyczpcbiAgICAgICAgLSBgYHVzZV90cmlhbGBgOiBUb2dnbGUgdXNlIG9mIHRyaWFsIGRpdmlzaW9uXG4gICAgICAgIC0gYGB1c2VfcmhvYGA6IFRvZ2dsZSB1c2Ugb2YgUG9sbGFyZCdzIHJobyBtZXRob2RcbiAgICAgICAgLSBgYHVzZV9wbTFgYDogVG9nZ2xlIHVzZSBvZiBQb2xsYXJkJ3MgcC0xIG1ldGhvZFxuICAgIGBgZmFjdG9yaW50YGAgYWxzbyBwZXJpb2RpY2FsbHkgY2hlY2tzIGlmIHRoZSByZW1haW5pbmcgcGFydCBpc1xuICAgIGEgcHJpbWUgbnVtYmVyIG9yIGEgcGVyZmVjdCBwb3dlciwgYW5kIGluIHRob3NlIGNhc2VzIHN0b3BzLlxuICAgIEZvciB1bmV2YWx1YXRlZCBmYWN0b3JpYWwsIGl0IHVzZXMgTGVnZW5kcmUncyBmb3JtdWxhKHRoZW9yZW0pLlxuICAgIElmIGBgdmVyYm9zZWBgIGlzIHNldCB0byBgYFRydWVgYCwgZGV0YWlsZWQgcHJvZ3Jlc3MgaXMgcHJpbnRlZC5cbiAgICBTZWUgQWxzb1xuICAgID09PT09PT09XG4gICAgc21vb3RobmVzcywgc21vb3RobmVzc19wLCBkaXZpc29yc1xuICAgICovXG4gICAgaWYgKG4gaW5zdGFuY2VvZiBJbnRlZ2VyKSB7XG4gICAgICAgIG4gPSBuLnA7XG4gICAgfVxuICAgIG4gPSBhc19pbnQobik7XG4gICAgaWYgKGxpbWl0KSB7XG4gICAgICAgIGxpbWl0ID0gbGltaXQgYXMgbnVtYmVyO1xuICAgIH1cbiAgICBpZiAobiA8IDApIHtcbiAgICAgICAgY29uc3QgZmFjdG9ycyA9IGZhY3RvcmludCgtbiwgbGltaXQpO1xuICAgICAgICBmYWN0b3JzLmFkZChmYWN0b3JzLnNpemUgLSAxLCAxKTtcbiAgICAgICAgcmV0dXJuIGZhY3RvcnM7XG4gICAgfVxuICAgIGlmIChsaW1pdCAmJiBsaW1pdCA8IDIpIHtcbiAgICAgICAgaWYgKG4gPT09IDEpIHtcbiAgICAgICAgICAgIHJldHVybiBuZXcgSGFzaERpY3QoKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gbmV3IEhhc2hEaWN0KHtuOiAxfSk7XG4gICAgfSBlbHNlIGlmIChuIDwgMTApIHtcbiAgICAgICAgcmV0dXJuIG5ldyBIYXNoRGljdChbezA6IDF9LCB7fSwgezI6IDF9LCB7MzogMX0sIHsyOiAyfSwgezU6IDF9LFxuICAgICAgICAgICAgezI6IDEsIDM6IDF9LCB7NzogMX0sIHsyOiAzfSwgezM6IDJ9XVtuXSk7XG4gICAgfVxuXG4gICAgY29uc3QgZmFjdG9ycyA9IG5ldyBIYXNoRGljdCgpO1xuICAgIGxldCBzbWFsbCA9IDIqKjE1O1xuICAgIGNvbnN0IGZhaWxfbWF4ID0gNjAwO1xuICAgIHNtYWxsID0gTWF0aC5taW4oc21hbGwsIGxpbWl0IHx8IHNtYWxsKTtcbiAgICBsZXQgbmV4dF9wO1xuICAgIFtuLCBuZXh0X3BdID0gX2ZhY3RvcmludF9zbWFsbChmYWN0b3JzLCBuLCBzbWFsbCwgZmFpbF9tYXgpO1xuICAgIGxldCBzcXJ0X246IGFueTtcbiAgICB0cnkge1xuICAgICAgICBpZiAobGltaXQgJiYgbmV4dF9wID4gbGltaXQpIHtcbiAgICAgICAgICAgIF9jaGVja190ZXJtaW5hdGlvbihmYWN0b3JzLCBuLCBsaW1pdCk7XG4gICAgICAgICAgICBpZiAobiA+IDEpIHtcbiAgICAgICAgICAgICAgICBmYWN0b3JzLmFkZChuLCAxKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiBmYWN0b3JzO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgc3FydF9uID0gaW50X250aHJvb3QobiwgMilbMF07XG4gICAgICAgICAgICBsZXQgYSA9IHNxcnRfbiArIDE7XG4gICAgICAgICAgICBjb25zdCBhMiA9IGEqKjI7XG4gICAgICAgICAgICBsZXQgYjIgPSBhMiAtIG47XG4gICAgICAgICAgICBsZXQgYjogYW55OyBsZXQgZmVybWF0OiBhbnk7XG4gICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IDM7IGkrKykge1xuICAgICAgICAgICAgICAgIFtiLCBmZXJtYXRdID0gaW50X250aHJvb3QoYjIsIDIpO1xuICAgICAgICAgICAgICAgIGlmIChmZXJtYXQpIHtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGIyICs9IDIqYSArIDE7XG4gICAgICAgICAgICAgICAgYSsrO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKGZlcm1hdCkge1xuICAgICAgICAgICAgICAgIGlmIChsaW1pdCkge1xuICAgICAgICAgICAgICAgICAgICBsaW1pdCAtPSAxO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBmb3IgKGNvbnN0IHIgb2YgW2EgLSBiLCBhICsgYl0pIHtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgZmFjcyA9IGZhY3RvcmludChyLCBsaW1pdCk7XG4gICAgICAgICAgICAgICAgICAgIGZvciAoY29uc3QgW2ssIHZdIG9mIGZhY3MuZW50cmllcygpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBmYWN0b3JzLmFkZChrLCBmYWN0b3JzLmdldChrLCAwKSArIHYpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcigpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgX2NoZWNrX3Rlcm1pbmF0aW9uKGZhY3RvcnMsIG4sIGxpbWl0KTtcbiAgICAgICAgfVxuICAgIH0gY2F0Y2ggKEVycm9yKSB7XG4gICAgICAgIHJldHVybiBmYWN0b3JzO1xuICAgIH1cblxuICAgIGxldCBbbG93LCBoaWdoXSA9IFtuZXh0X3AsIDIgKiBuZXh0X3BdO1xuICAgIGxpbWl0ID0gKGxpbWl0IHx8IHNxcnRfbikgYXMgbnVtYmVyO1xuICAgIGxpbWl0Kys7XG4gICAgd2hpbGUgKDEpIHtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIGxldCBoaWdoXyA9IGhpZ2g7XG4gICAgICAgICAgICBpZiAobGltaXQgPCBoaWdoXykge1xuICAgICAgICAgICAgICAgIGhpZ2hfID0gbGltaXQ7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBjb25zdCBwcyA9IHByaW1lcmFuZ2UobG93LCBoaWdoXyk7XG4gICAgICAgICAgICBsZXQgZm91bmRfdHJpYWw7XG4gICAgICAgICAgICBbbiwgZm91bmRfdHJpYWxdID0gX3RyaWFsKGZhY3RvcnMsIG4sIHBzKTtcbiAgICAgICAgICAgIGlmIChmb3VuZF90cmlhbCkge1xuICAgICAgICAgICAgICAgIF9jaGVja190ZXJtaW5hdGlvbihmYWN0b3JzLCBuLCBsaW1pdCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoaGlnaCA+IGxpbWl0KSB7XG4gICAgICAgICAgICAgICAgaWYgKG4gPiAxKSB7XG4gICAgICAgICAgICAgICAgICAgIGZhY3RvcnMuYWRkKG4sIDEpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmICghZm91bmRfdHJpYWwpIHtcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJhZHZhbmNlZCBmYWN0b3JpbmcgbWV0aG9kcyBhcmUgbm90IHlldCBpbXBsZW1lbnRlZFwiKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSBjYXRjaCAoRXJyb3IpIHtcbiAgICAgICAgICAgIHJldHVybiBmYWN0b3JzO1xuICAgICAgICB9XG4gICAgICAgIFtsb3csIGhpZ2hdID0gW2hpZ2gsIGhpZ2gqMl07XG4gICAgfVxuICAgIGxldCBCMSA9IDEwMDAwO1xuICAgIGxldCBCMiA9IDEwMCpCMTtcbiAgICBsZXQgbnVtX2N1cnZlcyA9IDUwO1xuICAgIHdoaWxlICgxKSB7XG4gICAgICAgIHdoaWxlICgxKSB7XG4gICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcImVjbSBvbmUgZmFjdG9yIG5vdCB5ZXQgaW1wbGVtZW50ZWRcIik7XG4gICAgICAgICAgICAgICAgLy8gX2NoZWNrX3Rlcm1pbmF0aW9uKGZhY3RvcnMsIG4sIGxpbWl0KTtcbiAgICAgICAgICAgIH0gY2F0Y2ggKEVycm9yKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGZhY3RvcnM7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgQjEgKj0gNTtcbiAgICAgICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5vLXVudXNlZC12YXJzXG4gICAgICAgIEIyID0gMTAwKkIxO1xuICAgICAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tdW51c2VkLXZhcnNcbiAgICAgICAgbnVtX2N1cnZlcyAqPSA0O1xuICAgIH1cbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHBlcmZlY3RfcG93ZXIobjogYW55LCBjYW5kaWRhdGVzOiBhbnkgPSB1bmRlZmluZWQsIGJpZzogYm9vbGVhbiA9IHRydWUsXG4gICAgZmFjdG9yOiBib29sZWFuID0gdHJ1ZSwgbnVtX2l0ZXJhdGlvbnM6IG51bWJlciA9IDE1KTogYW55IHtcbiAgICAvKlxuICAgIFJldHVybiBgYChiLCBlKWBgIHN1Y2ggdGhhdCBgYG5gYCA9PSBgYGIqKmVgYCBpZiBgYG5gYCBpcyBhIHVuaXF1ZVxuICAgIHBlcmZlY3QgcG93ZXIgd2l0aCBgYGUgPiAxYGAsIGVsc2UgYGBGYWxzZWBgIChlLmcuIDEgaXMgbm90IGFcbiAgICBwZXJmZWN0IHBvd2VyKS4gQSBWYWx1ZUVycm9yIGlzIHJhaXNlZCBpZiBgYG5gYCBpcyBub3QgUmF0aW9uYWwuXG4gICAgQnkgZGVmYXVsdCwgdGhlIGJhc2UgaXMgcmVjdXJzaXZlbHkgZGVjb21wb3NlZCBhbmQgdGhlIGV4cG9uZW50c1xuICAgIGNvbGxlY3RlZCBzbyB0aGUgbGFyZ2VzdCBwb3NzaWJsZSBgYGVgYCBpcyBzb3VnaHQuIElmIGBgYmlnPUZhbHNlYGBcbiAgICB0aGVuIHRoZSBzbWFsbGVzdCBwb3NzaWJsZSBgYGVgYCAodGh1cyBwcmltZSkgd2lsbCBiZSBjaG9zZW4uXG4gICAgSWYgYGBmYWN0b3I9VHJ1ZWBgIHRoZW4gc2ltdWx0YW5lb3VzIGZhY3Rvcml6YXRpb24gb2YgYGBuYGAgaXNcbiAgICBhdHRlbXB0ZWQgc2luY2UgZmluZGluZyBhIGZhY3RvciBpbmRpY2F0ZXMgdGhlIG9ubHkgcG9zc2libGUgcm9vdFxuICAgIGZvciBgYG5gYC4gVGhpcyBpcyBUcnVlIGJ5IGRlZmF1bHQgc2luY2Ugb25seSBhIGZldyBzbWFsbCBmYWN0b3JzIHdpbGxcbiAgICBiZSB0ZXN0ZWQgaW4gdGhlIGNvdXJzZSBvZiBzZWFyY2hpbmcgZm9yIHRoZSBwZXJmZWN0IHBvd2VyLlxuICAgIFRoZSB1c2Ugb2YgYGBjYW5kaWRhdGVzYGAgaXMgcHJpbWFyaWx5IGZvciBpbnRlcm5hbCB1c2U7IGlmIHByb3ZpZGVkLFxuICAgIEZhbHNlIHdpbGwgYmUgcmV0dXJuZWQgaWYgYGBuYGAgY2Fubm90IGJlIHdyaXR0ZW4gYXMgYSBwb3dlciB3aXRoIG9uZVxuICAgIG9mIHRoZSBjYW5kaWRhdGVzIGFzIGFuIGV4cG9uZW50IGFuZCBmYWN0b3JpbmcgKGJleW9uZCB0ZXN0aW5nIGZvclxuICAgIGEgZmFjdG9yIG9mIDIpIHdpbGwgbm90IGJlIGF0dGVtcHRlZC5cbiAgICBFeGFtcGxlc1xuICAgID09PT09PT09XG4gICAgPj4+IGZyb20gc3ltcHkgaW1wb3J0IHBlcmZlY3RfcG93ZXIsIFJhdGlvbmFsXG4gICAgPj4+IHBlcmZlY3RfcG93ZXIoMTYpXG4gICAgKDIsIDQpXG4gICAgPj4+IHBlcmZlY3RfcG93ZXIoMTYsIGJpZz1GYWxzZSlcbiAgICAoNCwgMilcbiAgICBOZWdhdGl2ZSBudW1iZXJzIGNhbiBvbmx5IGhhdmUgb2RkIHBlcmZlY3QgcG93ZXJzOlxuICAgID4+PiBwZXJmZWN0X3Bvd2VyKC00KVxuICAgIEZhbHNlXG4gICAgPj4+IHBlcmZlY3RfcG93ZXIoLTgpXG4gICAgKC0yLCAzKVxuICAgIFJhdGlvbmFscyBhcmUgYWxzbyByZWNvZ25pemVkOlxuICAgID4+PiBwZXJmZWN0X3Bvd2VyKFJhdGlvbmFsKDEsIDIpKiozKVxuICAgICgxLzIsIDMpXG4gICAgPj4+IHBlcmZlY3RfcG93ZXIoUmF0aW9uYWwoLTMsIDIpKiozKVxuICAgICgtMy8yLCAzKVxuICAgIE5vdGVzXG4gICAgPT09PT1cbiAgICBUbyBrbm93IHdoZXRoZXIgYW4gaW50ZWdlciBpcyBhIHBlcmZlY3QgcG93ZXIgb2YgMiB1c2VcbiAgICAgICAgPj4+IGlzMnBvdyA9IGxhbWJkYSBuOiBib29sKG4gYW5kIG5vdCBuICYgKG4gLSAxKSlcbiAgICAgICAgPj4+IFsoaSwgaXMycG93KGkpKSBmb3IgaSBpbiByYW5nZSg1KV1cbiAgICAgICAgWygwLCBGYWxzZSksICgxLCBUcnVlKSwgKDIsIFRydWUpLCAoMywgRmFsc2UpLCAoNCwgVHJ1ZSldXG4gICAgSXQgaXMgbm90IG5lY2Vzc2FyeSB0byBwcm92aWRlIGBgY2FuZGlkYXRlc2BgLiBXaGVuIHByb3ZpZGVkXG4gICAgaXQgd2lsbCBiZSBhc3N1bWVkIHRoYXQgdGhleSBhcmUgaW50cy4gVGhlIGZpcnN0IG9uZSB0aGF0IGlzXG4gICAgbGFyZ2VyIHRoYW4gdGhlIGNvbXB1dGVkIG1heGltdW0gcG9zc2libGUgZXhwb25lbnQgd2lsbCBzaWduYWxcbiAgICBmYWlsdXJlIGZvciB0aGUgcm91dGluZS5cbiAgICAgICAgPj4+IHBlcmZlY3RfcG93ZXIoMyoqOCwgWzldKVxuICAgICAgICBGYWxzZVxuICAgICAgICA+Pj4gcGVyZmVjdF9wb3dlcigzKio4LCBbMiwgNCwgOF0pXG4gICAgICAgICgzLCA4KVxuICAgICAgICA+Pj4gcGVyZmVjdF9wb3dlcigzKio4LCBbNCwgOF0sIGJpZz1GYWxzZSlcbiAgICAgICAgKDksIDQpXG4gICAgU2VlIEFsc29cbiAgICA9PT09PT09PVxuICAgIHN5bXB5LmNvcmUucG93ZXIuaW50ZWdlcl9udGhyb290XG4gICAgc3ltcHkubnRoZW9yeS5wcmltZXRlc3QuaXNfc3F1YXJlXG4gICAgKi9cbiAgICBsZXQgcHA7XG4gICAgaWYgKG4gaW5zdGFuY2VvZiBSYXRpb25hbCAmJiAhKG4uaXNfaW50ZWdlcikpIHtcbiAgICAgICAgY29uc3QgW3AsIHFdID0gbi5fYXNfbnVtZXJfZGVub20oKTtcbiAgICAgICAgaWYgKHAgPT09IFMuT25lKSB7XG4gICAgICAgICAgICBwcCA9IHBlcmZlY3RfcG93ZXIocSk7XG4gICAgICAgICAgICBpZiAocHApIHtcbiAgICAgICAgICAgICAgICBwcCA9IFtuLmNvbnN0cnVjdG9yKDEsIHBwWzBdKSwgcHBbMV1dO1xuICAgICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcHAgPSBwZXJmZWN0X3Bvd2VyKHApO1xuICAgICAgICAgICAgaWYgKHBwKSB7XG4gICAgICAgICAgICAgICAgY29uc3QgW251bSwgZV0gPSBwcDtcbiAgICAgICAgICAgICAgICBjb25zdCBwcSA9IHBlcmZlY3RfcG93ZXIocSwgW2VdKTtcbiAgICAgICAgICAgICAgICBpZiAocHEpIHtcbiAgICAgICAgICAgICAgICAgICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5vLXVudXNlZC12YXJzXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IFtkZW4sIGJsYW5rXSA9IHBxO1xuICAgICAgICAgICAgICAgICAgICBwcCA9IFtuLmNvbnN0cnVjdG9yKG51bSwgZGVuKSwgZV07XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBwcDtcbiAgICB9XG5cbiAgICBuID0gYXNfaW50KG4pO1xuICAgIGlmIChuIDwgMCkge1xuICAgICAgICBwcCA9IHBlcmZlY3RfcG93ZXIoLW4pO1xuICAgICAgICBpZiAocHApIHtcbiAgICAgICAgICAgIGNvbnN0IFtiLCBlXSA9IHBwO1xuICAgICAgICAgICAgaWYgKGUgJSAyICE9PSAwKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIFstYiwgZV07XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cblxuICAgIGlmIChuIDw9IDMpIHtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cblxuICAgIGNvbnN0IGxvZ24gPSBNYXRoLmxvZzIobik7XG4gICAgY29uc3QgbWF4X3Bvc3NpYmxlID0gTWF0aC5mbG9vcihsb2duKSArIDI7XG4gICAgY29uc3Qgbm90X3NxdWFyZSA9IFsyLCAzLCA3LCA4XS5pbmNsdWRlcyhuICUgMTApO1xuICAgIGNvbnN0IG1pbl9wb3NzaWJsZSA9IDIgKyAobm90X3NxdWFyZSBhcyBhbnkgYXMgbnVtYmVyKTtcbiAgICBpZiAodHlwZW9mIGNhbmRpZGF0ZXMgPT09IFwidW5kZWZpbmVkXCIpIHtcbiAgICAgICAgY2FuZGlkYXRlcyA9IHByaW1lcmFuZ2UobWluX3Bvc3NpYmxlLCBtYXhfcG9zc2libGUpO1xuICAgIH0gZWxzZSB7XG4gICAgICAgIGNvbnN0IHRlbXAgPSBbXTtcbiAgICAgICAgY2FuZGlkYXRlcy5zb3J0KCk7XG4gICAgICAgIGZvciAoY29uc3QgaSBvZiBjYW5kaWRhdGVzKSB7XG4gICAgICAgICAgICBpZiAobWluX3Bvc3NpYmxlIDw9IGkgJiYgaSA8PSBtYXhfcG9zc2libGUpIHtcbiAgICAgICAgICAgICAgICB0ZW1wLnB1c2goaSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgY2FuZGlkYXRlcyA9IHRlbXA7XG4gICAgICAgIGlmIChuICUgMiA9PT0gMCkge1xuICAgICAgICAgICAgY29uc3QgZSA9IHRyYWlsaW5nKG4pO1xuICAgICAgICAgICAgY29uc3QgdGVtcDIgPSBbXTtcbiAgICAgICAgICAgIGZvciAoY29uc3QgaSBvZiBjYW5kaWRhdGVzKSB7XG4gICAgICAgICAgICAgICAgaWYgKGUgJSBpID09PSAwKSB7XG4gICAgICAgICAgICAgICAgICAgIHRlbXAyLnB1c2goaSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgY2FuZGlkYXRlcyA9IHRlbXAyO1xuICAgICAgICB9XG4gICAgICAgIGlmIChiaWcpIHtcbiAgICAgICAgICAgIGNhbmRpZGF0ZXMucmV2ZXJzZSgpO1xuICAgICAgICB9XG4gICAgICAgIGZvciAoY29uc3QgZSBvZiBjYW5kaWRhdGVzKSB7XG4gICAgICAgICAgICBjb25zdCBbciwgb2tdID0gaW50X250aHJvb3QobiwgZSk7XG4gICAgICAgICAgICBpZiAob2spIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gW3IsIGVdO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gICAgZnVuY3Rpb24qIF9mYWN0b3JzKGxlbmd0aDogbnVtYmVyKSB7XG4gICAgICAgIGxldCBydiA9IDIgKyBuICUgMjtcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBsZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgeWllbGQgcnY7XG4gICAgICAgICAgICBydiA9IG5leHRwcmltZShydik7XG4gICAgICAgIH1cbiAgICB9XG4gICAgLy8gb3JpZ2luYWwgYWxnb3JpdGhtIGdlbmVyYXRlcyBpbmZpbml0ZSBzZXF1ZW5jZXMgb2YgdGhlIGZvbGxvd2luZ1xuICAgIC8vIGZvciBub3cgd2Ugd2lsbCBnZW5lcmF0ZSBsaW1pdGVkIHNpemVkIGFycmF5cyBhbmQgdXNlIHRob3NlXG4gICAgY29uc3QgX2NhbmRpZGF0ZXMgPSBbXTtcbiAgICBmb3IgKGNvbnN0IGkgb2YgY2FuZGlkYXRlcykge1xuICAgICAgICBfY2FuZGlkYXRlcy5wdXNoKGkpO1xuICAgIH1cbiAgICBjb25zdCBfZmFjdG9yc18gPSBbXTtcbiAgICBmb3IgKGNvbnN0IGkgb2YgX2ZhY3RvcnMoX2NhbmRpZGF0ZXMubGVuZ3RoKSkge1xuICAgICAgICBfZmFjdG9yc18ucHVzaChpKTtcbiAgICB9XG4gICAgZm9yIChjb25zdCBpdGVtIG9mIFV0aWwuemlwKF9mYWN0b3JzXywgX2NhbmRpZGF0ZXMpKSB7XG4gICAgICAgIGNvbnN0IGZhYyA9IGl0ZW1bMF07XG4gICAgICAgIGxldCBlID0gaXRlbVsxXTtcbiAgICAgICAgbGV0IHI7XG4gICAgICAgIGxldCBleGFjdDtcbiAgICAgICAgaWYgKGZhY3RvciAmJiBuICUgZmFjID09PSAwKSB7XG4gICAgICAgICAgICBpZiAoZmFjID09PSAyKSB7XG4gICAgICAgICAgICAgICAgZSA9IHRyYWlsaW5nKG4pO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBlID0gbXVsdGlwbGljaXR5KGZhYywgbik7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoZSA9PT0gMSkge1xuICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgW3IsIGV4YWN0XSA9IGludF9udGhyb290KG4sIGUpO1xuICAgICAgICAgICAgaWYgKCEoZXhhY3QpKSB7XG4gICAgICAgICAgICAgICAgY29uc3QgbSA9IE1hdGguZmxvb3IobiAvIGZhYykgKiogZTtcbiAgICAgICAgICAgICAgICBjb25zdCByRSA9IHBlcmZlY3RfcG93ZXIobSwgZGl2aXNvcnMoZSwgdHJ1ZSkpO1xuICAgICAgICAgICAgICAgIGlmICghKHJFKSkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgbGV0IFtyLCBFXSA9IHJFO1xuICAgICAgICAgICAgICAgICAgICBbciwgZV0gPSBbZmFjKiooTWF0aC5mbG9vcihlL0UpKnIpLCBFXTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gW3IsIGVdO1xuICAgICAgICB9XG4gICAgICAgIGlmIChsb2duL2UgPCA0MCkge1xuICAgICAgICAgICAgY29uc3QgYiA9IDIuMCoqKGxvZ24vZSk7XG4gICAgICAgICAgICBpZiAoTWF0aC5hYnMoTWF0aC5mbG9vcihiICsgMC41KSAtIGIpID4gMC4wMSkge1xuICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIFtyLCBleGFjdF0gPSBpbnRfbnRocm9vdChuLCBlKTtcbiAgICAgICAgaWYgKGV4YWN0KSB7XG4gICAgICAgICAgICBjb25zdCBtID0gcGVyZmVjdF9wb3dlcihyLCB1bmRlZmluZWQsIGJpZywgZmFjdG9yKTtcbiAgICAgICAgICAgIGlmIChtKSB7XG4gICAgICAgICAgICAgICAgW3IsIGVdID0gW21bMF0sIGUgKiBtWzFdXTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiBbTWF0aC5mbG9vcihyKSwgZV07XG4gICAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIGZhbHNlO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gZmFjdG9ycmF0KHJhdDogYW55LCBsaW1pdDogbnVtYmVyID0gdW5kZWZpbmVkKSB7XG4gICAgLypcbiAgICBHaXZlbiBhIFJhdGlvbmFsIGBgcmBgLCBgYGZhY3RvcnJhdChyKWBgIHJldHVybnMgYSBkaWN0IGNvbnRhaW5pbmdcbiAgICB0aGUgcHJpbWUgZmFjdG9ycyBvZiBgYHJgYCBhcyBrZXlzIGFuZCB0aGVpciByZXNwZWN0aXZlIG11bHRpcGxpY2l0aWVzXG4gICAgYXMgdmFsdWVzLiBGb3IgZXhhbXBsZTpcbiAgICA+Pj4gZnJvbSBzeW1weSBpbXBvcnQgZmFjdG9ycmF0LCBTXG4gICAgPj4+IGZhY3RvcnJhdChTKDgpLzkpICAgICMgOC85ID0gKDIqKjMpICogKDMqKi0yKVxuICAgIHsyOiAzLCAzOiAtMn1cbiAgICA+Pj4gZmFjdG9ycmF0KFMoLTEpLzk4NykgICAgIyAtMS83ODkgPSAtMSAqICgzKiotMSkgKiAoNyoqLTEpICogKDQ3KiotMSlcbiAgICB7LTE6IDEsIDM6IC0xLCA3OiAtMSwgNDc6IC0xfVxuICAgIFBsZWFzZSBzZWUgdGhlIGRvY3N0cmluZyBmb3IgYGBmYWN0b3JpbnRgYCBmb3IgZGV0YWlsZWQgZXhwbGFuYXRpb25zXG4gICAgYW5kIGV4YW1wbGVzIG9mIHRoZSBmb2xsb3dpbmcga2V5d29yZHM6XG4gICAgICAgIC0gYGBsaW1pdGBgOiBJbnRlZ2VyIGxpbWl0IHVwIHRvIHdoaWNoIHRyaWFsIGRpdmlzaW9uIGlzIGRvbmVcbiAgICAgICAgLSBgYHVzZV90cmlhbGBgOiBUb2dnbGUgdXNlIG9mIHRyaWFsIGRpdmlzaW9uXG4gICAgICAgIC0gYGB1c2VfcmhvYGA6IFRvZ2dsZSB1c2Ugb2YgUG9sbGFyZCdzIHJobyBtZXRob2RcbiAgICAgICAgLSBgYHVzZV9wbTFgYDogVG9nZ2xlIHVzZSBvZiBQb2xsYXJkJ3MgcC0xIG1ldGhvZFxuICAgICAgICAtIGBgdmVyYm9zZWBgOiBUb2dnbGUgZGV0YWlsZWQgcHJpbnRpbmcgb2YgcHJvZ3Jlc3NcbiAgICAgICAgLSBgYG11bHRpcGxlYGA6IFRvZ2dsZSByZXR1cm5pbmcgYSBsaXN0IG9mIGZhY3RvcnMgb3IgZGljdFxuICAgICAgICAtIGBgdmlzdWFsYGA6IFRvZ2dsZSBwcm9kdWN0IGZvcm0gb2Ygb3V0cHV0XG4gICAgKi9cbiAgICBjb25zdCBmID0gZmFjdG9yaW50KHJhdC5wLCBsaW1pdCk7XG4gICAgZm9yIChjb25zdCBpdGVtIG9mIGZhY3RvcmludChyYXQucSwgbGltaXQpLmVudHJpZXMoKSkge1xuICAgICAgICBjb25zdCBwID0gaXRlbVswXTtcbiAgICAgICAgY29uc3QgZSA9IGl0ZW1bMV07XG4gICAgICAgIGYuYWRkKHAsIGYuZ2V0KHAsIDApIC0gZSk7XG4gICAgfVxuICAgIGlmIChmLnNpemUgPiAxICYmIGYuaGFzKDEpKSB7XG4gICAgICAgIGYucmVtb3ZlKDEpO1xuICAgIH1cbiAgICByZXR1cm4gZjtcbn1cbiIsICJpbXBvcnQge2Rpdm1vZH0gZnJvbSBcIi4uL250aGVvcnkvZmFjdG9yX1wiO1xuaW1wb3J0IHtBZGR9IGZyb20gXCIuL2FkZFwiO1xuaW1wb3J0IHtNYW5hZ2VkUHJvcGVydGllc30gZnJvbSBcIi4vYXNzdW1wdGlvbnNcIjtcbmltcG9ydCB7QmFzaWN9IGZyb20gXCIuL2Jhc2ljXCI7XG5pbXBvcnQge0V4cHJ9IGZyb20gXCIuL2V4cHJcIjtcbmltcG9ydCB7R2xvYmFsfSBmcm9tIFwiLi9nbG9iYWxcIjtcbmltcG9ydCB7ZnV6enlfbm90djIsIF9mdXp6eV9ncm91cHYyfSBmcm9tIFwiLi9sb2dpY1wiO1xuaW1wb3J0IHtJbnRlZ2VyLCBSYXRpb25hbH0gZnJvbSBcIi4vbnVtYmVyc1wiO1xuaW1wb3J0IHtBc3NvY09wfSBmcm9tIFwiLi9vcGVyYXRpb25zXCI7XG5pbXBvcnQge2dsb2JhbF9wYXJhbWV0ZXJzfSBmcm9tIFwiLi9wYXJhbWV0ZXJzXCI7XG5pbXBvcnQge1Bvd30gZnJvbSBcIi4vcG93ZXJcIjtcbmltcG9ydCB7U30gZnJvbSBcIi4vc2luZ2xldG9uXCI7XG5pbXBvcnQge21peCwgYmFzZSwgSGFzaERpY3QsIEhhc2hTZXQsIEFyckRlZmF1bHREaWN0fSBmcm9tIFwiLi91dGlsaXR5XCI7XG5cbi8vICMgaW50ZXJuYWwgbWFya2VyIHRvIGluZGljYXRlOlxuLy8gXCJ0aGVyZSBhcmUgc3RpbGwgbm9uLWNvbW11dGF0aXZlIG9iamVjdHMgLS0gZG9uJ3QgZm9yZ2V0IHRvIHByb2Nlc3MgdGhlbVwiXG5cbi8vIG5vdCBjdXJyZW50bHkgYmVpbmcgdXNlZFxuY2xhc3MgTkNfTWFya2VyIHtcbiAgICBpc19PcmRlciA9IGZhbHNlO1xuICAgIGlzX011bCA9IGZhbHNlO1xuICAgIGlzX051bWJlciA9IGZhbHNlO1xuICAgIGlzX1BvbHkgPSBmYWxzZTtcblxuICAgIGlzX2NvbW11dGF0aXZlID0gZmFsc2U7XG59XG5cbmZ1bmN0aW9uIF9tdWxzb3J0KGFyZ3M6IGFueVtdKSB7XG4gICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5ldy1jYXBcbiAgICBhcmdzLnNvcnQoKGEsIGIpID0+IEJhc2ljLmNtcChhLCBiKSk7XG59XG5cbmV4cG9ydCBjbGFzcyBNdWwgZXh0ZW5kcyBtaXgoYmFzZSkud2l0aChFeHByLCBBc3NvY09wKSB7XG4gICAgLypcbiAgICBFeHByZXNzaW9uIHJlcHJlc2VudGluZyBtdWx0aXBsaWNhdGlvbiBvcGVyYXRpb24gZm9yIGFsZ2VicmFpYyBmaWVsZC5cbiAgICAuLiBkZXByZWNhdGVkOjogMS43XG4gICAgICAgVXNpbmcgYXJndW1lbnRzIHRoYXQgYXJlbid0IHN1YmNsYXNzZXMgb2YgOmNsYXNzOmB+LkV4cHJgIGluIGNvcmVcbiAgICAgICBvcGVyYXRvcnMgKDpjbGFzczpgfi5NdWxgLCA6Y2xhc3M6YH4uQWRkYCwgYW5kIDpjbGFzczpgfi5Qb3dgKSBpc1xuICAgICAgIGRlcHJlY2F0ZWQuIFNlZSA6cmVmOmBub24tZXhwci1hcmdzLWRlcHJlY2F0ZWRgIGZvciBkZXRhaWxzLlxuICAgIEV2ZXJ5IGFyZ3VtZW50IG9mIGBgTXVsKClgYCBtdXN0IGJlIGBgRXhwcmBgLiBJbmZpeCBvcGVyYXRvciBgYCpgYFxuICAgIG9uIG1vc3Qgc2NhbGFyIG9iamVjdHMgaW4gU3ltUHkgY2FsbHMgdGhpcyBjbGFzcy5cbiAgICBBbm90aGVyIHVzZSBvZiBgYE11bCgpYGAgaXMgdG8gcmVwcmVzZW50IHRoZSBzdHJ1Y3R1cmUgb2YgYWJzdHJhY3RcbiAgICBtdWx0aXBsaWNhdGlvbiBzbyB0aGF0IGl0cyBhcmd1bWVudHMgY2FuIGJlIHN1YnN0aXR1dGVkIHRvIHJldHVyblxuICAgIGRpZmZlcmVudCBjbGFzcy4gUmVmZXIgdG8gZXhhbXBsZXMgc2VjdGlvbiBmb3IgdGhpcy5cbiAgICBgYE11bCgpYGAgZXZhbHVhdGVzIHRoZSBhcmd1bWVudCB1bmxlc3MgYGBldmFsdWF0ZT1GYWxzZWBgIGlzIHBhc3NlZC5cbiAgICBUaGUgZXZhbHVhdGlvbiBsb2dpYyBpbmNsdWRlczpcbiAgICAxLiBGbGF0dGVuaW5nXG4gICAgICAgIGBgTXVsKHgsIE11bCh5LCB6KSlgYCAtPiBgYE11bCh4LCB5LCB6KWBgXG4gICAgMi4gSWRlbnRpdHkgcmVtb3ZpbmdcbiAgICAgICAgYGBNdWwoeCwgMSwgeSlgYCAtPiBgYE11bCh4LCB5KWBgXG4gICAgMy4gRXhwb25lbnQgY29sbGVjdGluZyBieSBgYC5hc19iYXNlX2V4cCgpYGBcbiAgICAgICAgYGBNdWwoeCwgeCoqMilgYCAtPiBgYFBvdyh4LCAzKWBgXG4gICAgNC4gVGVybSBzb3J0aW5nXG4gICAgICAgIGBgTXVsKHksIHgsIDIpYGAgLT4gYGBNdWwoMiwgeCwgeSlgYFxuICAgIFNpbmNlIG11bHRpcGxpY2F0aW9uIGNhbiBiZSB2ZWN0b3Igc3BhY2Ugb3BlcmF0aW9uLCBhcmd1bWVudHMgbWF5XG4gICAgaGF2ZSB0aGUgZGlmZmVyZW50IDpvYmo6YHN5bXB5LmNvcmUua2luZC5LaW5kKClgLiBLaW5kIG9mIHRoZVxuICAgIHJlc3VsdGluZyBvYmplY3QgaXMgYXV0b21hdGljYWxseSBpbmZlcnJlZC5cbiAgICBFeGFtcGxlc1xuICAgID09PT09PT09XG4gICAgPj4+IGZyb20gc3ltcHkgaW1wb3J0IE11bFxuICAgID4+PiBmcm9tIHN5bXB5LmFiYyBpbXBvcnQgeCwgeVxuICAgID4+PiBNdWwoeCwgMSlcbiAgICB4XG4gICAgPj4+IE11bCh4LCB4KVxuICAgIHgqKjJcbiAgICBJZiBgYGV2YWx1YXRlPUZhbHNlYGAgaXMgcGFzc2VkLCByZXN1bHQgaXMgbm90IGV2YWx1YXRlZC5cbiAgICA+Pj4gTXVsKDEsIDIsIGV2YWx1YXRlPUZhbHNlKVxuICAgIDEqMlxuICAgID4+PiBNdWwoeCwgeCwgZXZhbHVhdGU9RmFsc2UpXG4gICAgeCp4XG4gICAgYGBNdWwoKWBgIGFsc28gcmVwcmVzZW50cyB0aGUgZ2VuZXJhbCBzdHJ1Y3R1cmUgb2YgbXVsdGlwbGljYXRpb25cbiAgICBvcGVyYXRpb24uXG4gICAgPj4+IGZyb20gc3ltcHkgaW1wb3J0IE1hdHJpeFN5bWJvbFxuICAgID4+PiBBID0gTWF0cml4U3ltYm9sKCdBJywgMiwyKVxuICAgID4+PiBleHByID0gTXVsKHgseSkuc3Vicyh7eTpBfSlcbiAgICA+Pj4gZXhwclxuICAgIHgqQVxuICAgID4+PiB0eXBlKGV4cHIpXG4gICAgPGNsYXNzICdzeW1weS5tYXRyaWNlcy5leHByZXNzaW9ucy5tYXRtdWwuTWF0TXVsJz5cbiAgICBTZWUgQWxzb1xuICAgID09PT09PT09XG4gICAgTWF0TXVsXG4gICAgKi9cbiAgICBfX3Nsb3RzX186IGFueVtdID0gW107XG4gICAgYXJnczogYW55W107XG4gICAgc3RhdGljIGlzX011bCA9IHRydWU7XG4gICAgX2FyZ3NfdHlwZSA9IEV4cHI7XG4gICAgc3RhdGljIGlkZW50aXR5ID0gUy5PbmU7XG5cbiAgICBjb25zdHJ1Y3RvcihldmFsdWF0ZTogYm9vbGVhbiwgc2ltcGxpZnk6IGJvb2xlYW4sIC4uLmFyZ3M6IGFueSkge1xuICAgICAgICBzdXBlcihNdWwsIGV2YWx1YXRlLCBzaW1wbGlmeSwgLi4uYXJncyk7XG4gICAgfVxuXG4gICAgZmxhdHRlbihzZXE6IGFueSkge1xuICAgICAgICAvKiBSZXR1cm4gY29tbXV0YXRpdmUsIG5vbmNvbW11dGF0aXZlIGFuZCBvcmRlciBhcmd1bWVudHMgYnlcbiAgICAgICAgY29tYmluaW5nIHJlbGF0ZWQgdGVybXMuXG4gICAgICAgIE5vdGVzXG4gICAgICAgID09PT09XG4gICAgICAgICAgICAqIEluIGFuIGV4cHJlc3Npb24gbGlrZSBgYGEqYipjYGAsIFB5dGhvbiBwcm9jZXNzIHRoaXMgdGhyb3VnaCBTeW1QeVxuICAgICAgICAgICAgICBhcyBgYE11bChNdWwoYSwgYiksIGMpYGAuIFRoaXMgY2FuIGhhdmUgdW5kZXNpcmFibGUgY29uc2VxdWVuY2VzLlxuICAgICAgICAgICAgICAtICBTb21ldGltZXMgdGVybXMgYXJlIG5vdCBjb21iaW5lZCBhcyBvbmUgd291bGQgbGlrZTpcbiAgICAgICAgICAgICAgICAge2MuZi4gaHR0cHM6Ly9naXRodWIuY29tL3N5bXB5L3N5bXB5L2lzc3Vlcy80NTk2fVxuICAgICAgICAgICAgICAgID4+PiBmcm9tIHN5bXB5IGltcG9ydCBNdWwsIHNxcnRcbiAgICAgICAgICAgICAgICA+Pj4gZnJvbSBzeW1weS5hYmMgaW1wb3J0IHgsIHksIHpcbiAgICAgICAgICAgICAgICA+Pj4gMiooeCArIDEpICMgdGhpcyBpcyB0aGUgMi1hcmcgTXVsIGJlaGF2aW9yXG4gICAgICAgICAgICAgICAgMip4ICsgMlxuICAgICAgICAgICAgICAgID4+PiB5Kih4ICsgMSkqMlxuICAgICAgICAgICAgICAgIDIqeSooeCArIDEpXG4gICAgICAgICAgICAgICAgPj4+IDIqKHggKyAxKSp5ICMgMi1hcmcgcmVzdWx0IHdpbGwgYmUgb2J0YWluZWQgZmlyc3RcbiAgICAgICAgICAgICAgICB5KigyKnggKyAyKVxuICAgICAgICAgICAgICAgID4+PiBNdWwoMiwgeCArIDEsIHkpICMgYWxsIDMgYXJncyBzaW11bHRhbmVvdXNseSBwcm9jZXNzZWRcbiAgICAgICAgICAgICAgICAyKnkqKHggKyAxKVxuICAgICAgICAgICAgICAgID4+PiAyKigoeCArIDEpKnkpICMgcGFyZW50aGVzZXMgY2FuIGNvbnRyb2wgdGhpcyBiZWhhdmlvclxuICAgICAgICAgICAgICAgIDIqeSooeCArIDEpXG4gICAgICAgICAgICAgICAgUG93ZXJzIHdpdGggY29tcG91bmQgYmFzZXMgbWF5IG5vdCBmaW5kIGEgc2luZ2xlIGJhc2UgdG9cbiAgICAgICAgICAgICAgICBjb21iaW5lIHdpdGggdW5sZXNzIGFsbCBhcmd1bWVudHMgYXJlIHByb2Nlc3NlZCBhdCBvbmNlLlxuICAgICAgICAgICAgICAgIFBvc3QtcHJvY2Vzc2luZyBtYXkgYmUgbmVjZXNzYXJ5IGluIHN1Y2ggY2FzZXMuXG4gICAgICAgICAgICAgICAge2MuZi4gaHR0cHM6Ly9naXRodWIuY29tL3N5bXB5L3N5bXB5L2lzc3Vlcy81NzI4fVxuICAgICAgICAgICAgICAgID4+PiBhID0gc3FydCh4KnNxcnQoeSkpXG4gICAgICAgICAgICAgICAgPj4+IGEqKjNcbiAgICAgICAgICAgICAgICAoeCpzcXJ0KHkpKSoqKDMvMilcbiAgICAgICAgICAgICAgICA+Pj4gTXVsKGEsYSxhKVxuICAgICAgICAgICAgICAgICh4KnNxcnQoeSkpKiooMy8yKVxuICAgICAgICAgICAgICAgID4+PiBhKmEqYVxuICAgICAgICAgICAgICAgIHgqc3FydCh5KSpzcXJ0KHgqc3FydCh5KSlcbiAgICAgICAgICAgICAgICA+Pj4gXy5zdWJzKGEuYmFzZSwgeikuc3Vicyh6LCBhLmJhc2UpXG4gICAgICAgICAgICAgICAgKHgqc3FydCh5KSkqKigzLzIpXG4gICAgICAgICAgICAgIC0gIElmIG1vcmUgdGhhbiB0d28gdGVybXMgYXJlIGJlaW5nIG11bHRpcGxpZWQgdGhlbiBhbGwgdGhlXG4gICAgICAgICAgICAgICAgIHByZXZpb3VzIHRlcm1zIHdpbGwgYmUgcmUtcHJvY2Vzc2VkIGZvciBlYWNoIG5ldyBhcmd1bWVudC5cbiAgICAgICAgICAgICAgICAgU28gaWYgZWFjaCBvZiBgYGFgYCwgYGBiYGAgYW5kIGBgY2BgIHdlcmUgOmNsYXNzOmBNdWxgXG4gICAgICAgICAgICAgICAgIGV4cHJlc3Npb24sIHRoZW4gYGBhKmIqY2BgIChvciBidWlsZGluZyB1cCB0aGUgcHJvZHVjdFxuICAgICAgICAgICAgICAgICB3aXRoIGBgKj1gYCkgd2lsbCBwcm9jZXNzIGFsbCB0aGUgYXJndW1lbnRzIG9mIGBgYWBgIGFuZFxuICAgICAgICAgICAgICAgICBgYGJgYCB0d2ljZTogb25jZSB3aGVuIGBgYSpiYGAgaXMgY29tcHV0ZWQgYW5kIGFnYWluIHdoZW5cbiAgICAgICAgICAgICAgICAgYGBjYGAgaXMgbXVsdGlwbGllZC5cbiAgICAgICAgICAgICAgICAgVXNpbmcgYGBNdWwoYSwgYiwgYylgYCB3aWxsIHByb2Nlc3MgYWxsIGFyZ3VtZW50cyBvbmNlLlxuICAgICAgICAgICAgKiBUaGUgcmVzdWx0cyBvZiBNdWwgYXJlIGNhY2hlZCBhY2NvcmRpbmcgdG8gYXJndW1lbnRzLCBzbyBmbGF0dGVuXG4gICAgICAgICAgICAgIHdpbGwgb25seSBiZSBjYWxsZWQgb25jZSBmb3IgYGBNdWwoYSwgYiwgYylgYC4gSWYgeW91IGNhblxuICAgICAgICAgICAgICBzdHJ1Y3R1cmUgYSBjYWxjdWxhdGlvbiBzbyB0aGUgYXJndW1lbnRzIGFyZSBtb3N0IGxpa2VseSB0byBiZVxuICAgICAgICAgICAgICByZXBlYXRzIHRoZW4gdGhpcyBjYW4gc2F2ZSB0aW1lIGluIGNvbXB1dGluZyB0aGUgYW5zd2VyLiBGb3JcbiAgICAgICAgICAgICAgZXhhbXBsZSwgc2F5IHlvdSBoYWQgYSBNdWwsIE0sIHRoYXQgeW91IHdpc2hlZCB0byBkaXZpZGUgYnkgYGBkW2ldYGBcbiAgICAgICAgICAgICAgYW5kIG11bHRpcGx5IGJ5IGBgbltpXWBgIGFuZCB5b3Ugc3VzcGVjdCB0aGVyZSBhcmUgbWFueSByZXBlYXRzXG4gICAgICAgICAgICAgIGluIGBgbmBgLiBJdCB3b3VsZCBiZSBiZXR0ZXIgdG8gY29tcHV0ZSBgYE0qbltpXS9kW2ldYGAgcmF0aGVyXG4gICAgICAgICAgICAgIHRoYW4gYGBNL2RbaV0qbltpXWBgIHNpbmNlIGV2ZXJ5IHRpbWUgbltpXSBpcyBhIHJlcGVhdCwgdGhlXG4gICAgICAgICAgICAgIHByb2R1Y3QsIGBgTSpuW2ldYGAgd2lsbCBiZSByZXR1cm5lZCB3aXRob3V0IGZsYXR0ZW5pbmcgLS0gdGhlXG4gICAgICAgICAgICAgIGNhY2hlZCB2YWx1ZSB3aWxsIGJlIHJldHVybmVkLiBJZiB5b3UgZGl2aWRlIGJ5IHRoZSBgYGRbaV1gYFxuICAgICAgICAgICAgICBmaXJzdCAoYW5kIHRob3NlIGFyZSBtb3JlIHVuaXF1ZSB0aGFuIHRoZSBgYG5baV1gYCkgdGhlbiB0aGF0IHdpbGxcbiAgICAgICAgICAgICAgY3JlYXRlIGEgbmV3IE11bCwgYGBNL2RbaV1gYCB0aGUgYXJncyBvZiB3aGljaCB3aWxsIGJlIHRyYXZlcnNlZFxuICAgICAgICAgICAgICBhZ2FpbiB3aGVuIGl0IGlzIG11bHRpcGxpZWQgYnkgYGBuW2ldYGAuXG4gICAgICAgICAgICAgIHtjLmYuIGh0dHBzOi8vZ2l0aHViLmNvbS9zeW1weS9zeW1weS9pc3N1ZXMvNTcwNn1cbiAgICAgICAgICAgICAgVGhpcyBjb25zaWRlcmF0aW9uIGlzIG1vb3QgaWYgdGhlIGNhY2hlIGlzIHR1cm5lZCBvZmYuXG4gICAgICAgICAgICBOQlxuICAgICAgICAgICAgLS1cbiAgICAgICAgICAgICAgVGhlIHZhbGlkaXR5IG9mIHRoZSBhYm92ZSBub3RlcyBkZXBlbmRzIG9uIHRoZSBpbXBsZW1lbnRhdGlvblxuICAgICAgICAgICAgICBkZXRhaWxzIG9mIE11bCBhbmQgZmxhdHRlbiB3aGljaCBtYXkgY2hhbmdlIGF0IGFueSB0aW1lLiBUaGVyZWZvcmUsXG4gICAgICAgICAgICAgIHlvdSBzaG91bGQgb25seSBjb25zaWRlciB0aGVtIHdoZW4geW91ciBjb2RlIGlzIGhpZ2hseSBwZXJmb3JtYW5jZVxuICAgICAgICAgICAgICBzZW5zaXRpdmUuXG4gICAgICAgICAgICAgIFJlbW92YWwgb2YgMSBmcm9tIHRoZSBzZXF1ZW5jZSBpcyBhbHJlYWR5IGhhbmRsZWQgYnkgQXNzb2NPcC5fX25ld19fLlxuICAgICAgICAqL1xuICAgICAgICBsZXQgcnYgPSB1bmRlZmluZWQ7XG4gICAgICAgIGlmIChzZXEubGVuZ3RoID09PSAyKSB7XG4gICAgICAgICAgICBsZXQgW2EsIGJdID0gc2VxO1xuICAgICAgICAgICAgaWYgKGIuaXNfUmF0aW9uYWwoKSkge1xuICAgICAgICAgICAgICAgIFthLCBiXSA9IFtiLCBhXTtcbiAgICAgICAgICAgICAgICBzZXEgPSBbYSwgYl07XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoIShhLmlzX3plcm8oKSAmJiBhLmlzX1JhdGlvbmFsKCkpKSB7XG4gICAgICAgICAgICAgICAgbGV0IHI7XG4gICAgICAgICAgICAgICAgW3IsIGJdID0gYi5hc19jb2VmZl9NdWwoKTtcbiAgICAgICAgICAgICAgICBpZiAoYi5pc19BZGQoKSkge1xuICAgICAgICAgICAgICAgICAgICBpZiAociAhPT0gUy5PbmUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGxldCBhcmI7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBhciA9IGEuX19tdWxfXyhyKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChhciA9PT0gUy5PbmUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBhcmIgPSBiO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBhcmIgPSB0aGlzLmNvbnN0cnVjdG9yKGZhbHNlLCB0cnVlLCBhLl9fbXVsX18ociksIGIpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgcnYgPSBbW2FyYl0sIFtdLCB1bmRlZmluZWRdO1xuICAgICAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKGdsb2JhbF9wYXJhbWV0ZXJzLmRpc3RyaWJ1dGUgJiYgYi5pc19jb21tdXRhdGl2ZSgpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBhcmc6IGFueSA9IFtdO1xuICAgICAgICAgICAgICAgICAgICAgICAgZm9yIChjb25zdCBiaSBvZiBiLl9hcmdzKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYXJnLnB1c2godGhpcy5fa2VlcF9jb2VmZihhLCBiaSkpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgbmV3YiA9IG5ldyBBZGQodHJ1ZSwgdHJ1ZSwgLi4uYXJnKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJ2ID0gW1tuZXdiXSwgW10sIHVuZGVmaW5lZF07XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAocnYpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gcnY7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBsZXQgY19wYXJ0OiBhbnkgPSBbXTtcbiAgICAgICAgY29uc3QgbmNfc2VxID0gW107XG4gICAgICAgIGxldCBuY19wYXJ0OiBhbnkgPSBbXTtcbiAgICAgICAgbGV0IGNvZWZmID0gUy5PbmU7XG4gICAgICAgIGxldCBjX3Bvd2VycyA9IFtdO1xuICAgICAgICBsZXQgbmVnMWUgPSBTLlplcm87IGxldCBudW1fZXhwID0gW107XG4gICAgICAgIGNvbnN0IHBudW1fcmF0ID0gbmV3IEhhc2hEaWN0KCk7XG4gICAgICAgIGNvbnN0IG9yZGVyX3N5bWJvbHM6IGFueVtdID0gW107XG5cbiAgICAgICAgZm9yIChsZXQgbyBvZiBzZXEpIHtcbiAgICAgICAgICAgIGlmIChvLmlzX011bCgpKSB7XG4gICAgICAgICAgICAgICAgaWYgKG8uaXNfY29tbXV0YXRpdmUoKSkge1xuICAgICAgICAgICAgICAgICAgICBzZXEucHVzaCguLi5vLl9hcmdzKTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBmb3IgKGNvbnN0IHEgb2Ygby5fYXJncykge1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHEuaXNfY29tbXV0YXRpdmUoKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNlcS5wdXNoKHEpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBuY19zZXEucHVzaChxKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoby5pc19OdW1iZXIoKSkge1xuICAgICAgICAgICAgICAgIGlmIChvID09PSBTLk5hTiB8fCBjb2VmZiA9PT0gUy5Db21wbGV4SW5maW5pdHkgJiYgby5pc196ZXJvKCkpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFtbUy5OYU5dLCBbXSwgdW5kZWZpbmVkXTtcbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKGNvZWZmLmlzX051bWJlcigpKSB7XG4gICAgICAgICAgICAgICAgICAgIGNvZWZmID0gY29lZmYuX19tdWxfXyhvKTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGNvZWZmID09PSBTLk5hTikge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFtbUy5OYU5dLCBbXSwgdW5kZWZpbmVkXTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAobyA9PT0gUy5Db21wbGV4SW5maW5pdHkpIHtcbiAgICAgICAgICAgICAgICBpZiAoIShjb2VmZikpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFtbUy5OYU5dLCBbXSwgdW5kZWZpbmVkXTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgY29lZmYgPSBTLkNvbXBsZXhJbmZpbml0eTtcbiAgICAgICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoby5pc19jb21tdXRhdGl2ZSgpKSB7XG4gICAgICAgICAgICAgICAgbGV0IGU7IGxldCBiO1xuICAgICAgICAgICAgICAgIFtiLCBlXSA9IG8uYXNfYmFzZV9leHAoKTtcbiAgICAgICAgICAgICAgICBpZiAoby5pc19Qb3coKSkge1xuICAgICAgICAgICAgICAgICAgICBpZiAoYi5pc19OdW1iZXIoKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGUuaXNfUmF0aW9uYWwoKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChlLmlzX0ludGVnZXIoKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb2VmZiA9IGNvZWZmLl9fbXVsX18obmV3IFBvdyhiLCBlKSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoZS5pc19uZWdhdGl2ZSgpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNlcS5wdXNoKG5ldyBQb3coYiwgZSkpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKGIuaXNfbmVnYXRpdmUoKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBuZWcxZSA9IG5lZzFlLl9fYWRkX18oZSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGIgPSBiLl9fbXVsX18oUy5OZWdhdGl2ZU9uZSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChiICE9PSBTLk9uZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBwbnVtX3JhdC5zZXRkZWZhdWx0KGIsIFtdKS5wdXNoKGUpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoYi5pc19wb3NpdGl2ZSgpIHx8IGIuaXNfaW50ZWdlcigpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbnVtX2V4cC5wdXNoKFtiLCBlXSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgY19wb3dlcnMucHVzaChbYiwgZV0pO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBpZiAobyAhPT0gTkNfTWFya2VyKSB7XG4gICAgICAgICAgICAgICAgICAgIG5jX3NlcS5wdXNoKG8pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB3aGlsZSAobmNfc2VxKSB7XG4gICAgICAgICAgICAgICAgICAgIG8gPSBuY19zZXEuc3BsaWNlKDAsIDEpO1xuICAgICAgICAgICAgICAgICAgICBpZiAoIShuY19wYXJ0KSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgbmNfcGFydC5wdXNoKG8pO1xuICAgICAgICAgICAgICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgY29uc3QgbzEgPSBuY19wYXJ0LnBvcCgpO1xuICAgICAgICAgICAgICAgICAgICBjb25zdCBbYjEsIGUxXSA9IG8xLmFzX2Jhc2VfZXhwKCk7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IFtiMiwgZTJdID0gby5hc19iYXNlX2V4cCgpO1xuICAgICAgICAgICAgICAgICAgICBjb25zdCBuZXdfZXhwID0gZTEuX19hZGRfXyhlMik7XG4gICAgICAgICAgICAgICAgICAgIGlmIChiMS5lcShiMikgJiYgIShuZXdfZXhwLmlzX0FkZCgpKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgbzEyID0gYjEuX2V2YWxfcG93ZXIobmV3X2V4cCk7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAobzEyLmlzX2NvbW11dGF0aXZlKCkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzZXEucHVzaChvMTIpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBuY19zZXEuc3BsaWNlKDAsIDAsIG8xMik7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBuY19wYXJ0LnB1c2gobzEpO1xuICAgICAgICAgICAgICAgICAgICAgICAgbmNfcGFydC5wdXNoKG8pO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgZnVuY3Rpb24gX2dhdGhlcihjX3Bvd2VyczogYW55W10pIHtcbiAgICAgICAgICAgIGNvbnN0IGNvbW1vbl9iID0gbmV3IEhhc2hEaWN0KCk7XG4gICAgICAgICAgICBmb3IgKGNvbnN0IFtiLCBlXSBvZiBjX3Bvd2Vycykge1xuICAgICAgICAgICAgICAgIGNvbnN0IGNvID0gZS5hc19jb2VmZl9NdWwoKTtcbiAgICAgICAgICAgICAgICBjb21tb25fYi5zZXRkZWZhdWx0KGIsIG5ldyBIYXNoRGljdCgpKS5zZXRkZWZhdWx0KGNvWzFdLCBbXSkucHVzaChjb1swXSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tdW51c2VkLXZhcnNcbiAgICAgICAgICAgIGZvciAoY29uc3QgW2IsIGRdIG9mIGNvbW1vbl9iLmVudHJpZXMoKSkge1xuICAgICAgICAgICAgICAgIGZvciAoY29uc3QgW2RpLCBsaV0gb2YgZC5lbnRyaWVzKCkpIHtcbiAgICAgICAgICAgICAgICAgICAgZC5hZGQoZGksIG5ldyBBZGQodHJ1ZSwgdHJ1ZSwgLi4ubGkpKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBjb25zdCBuZXdfY19wb3dlcnMgPSBbXTtcbiAgICAgICAgICAgIGZvciAoY29uc3QgW2IsIGVdIG9mIGNvbW1vbl9iLmVudHJpZXMoKSkge1xuICAgICAgICAgICAgICAgIGZvciAoY29uc3QgW3QsIGNdIG9mIGUuZW50cmllcygpKSB7XG4gICAgICAgICAgICAgICAgICAgIG5ld19jX3Bvd2Vycy5wdXNoKFtiLCBjLl9fbXVsX18odCldKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gbmV3X2NfcG93ZXJzO1xuICAgICAgICB9XG5cbiAgICAgICAgY19wb3dlcnMgPSBfZ2F0aGVyKGNfcG93ZXJzKTtcbiAgICAgICAgbnVtX2V4cCA9IF9nYXRoZXIobnVtX2V4cCk7XG5cbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCAyOyBpKyspIHtcbiAgICAgICAgICAgIGNvbnN0IG5ld19jX3Bvd2VyczogYW55W10gPSBbXTtcbiAgICAgICAgICAgIGxldCBjaGFuZ2VkID0gZmFsc2U7XG4gICAgICAgICAgICBmb3IgKGxldCBbYiwgZV0gb2YgY19wb3dlcnMpIHtcbiAgICAgICAgICAgICAgICBsZXQgcDogYW55O1xuICAgICAgICAgICAgICAgIGlmIChlLmlzX3plcm8oKSA9PT0gdHJ1ZSkge1xuICAgICAgICAgICAgICAgICAgICBpZiAoKGIuaXNfQWRkKCkgfHwgYi5pc19NdWwoKSAmJlxuICAgICAgICAgICAgICAgICAgICAgICAgYi5fYXJncy5pbmNsdWRlcyhTLkNvbXBsZXhJbmZpbml0eSwgUy5JbmZpbml0eSwgUy5OZWZhdGl2ZUluZmluaXR5KSkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBbW1MuTmFOXSwgW10sIHVuZGVmaW5lZF07XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGlmIChlID09PSBTLk9uZSkge1xuICAgICAgICAgICAgICAgICAgICBpZiAoYi5pc19OdW1iZXIoKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgY29lZmYgPSBjb2VmZi5fX211bF9fKGIpO1xuICAgICAgICAgICAgICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgcCA9IGI7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGlmIChlICE9PSBTLk9uZSkge1xuICAgICAgICAgICAgICAgICAgICBwID0gbmV3IFBvdyhiLCBlKTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHAuaXNfUG93KCkgJiYgIWIuaXNfUG93KCkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IGJpID0gYjtcbiAgICAgICAgICAgICAgICAgICAgICAgIFtiLCBlXSA9IHAuYXNfYmFzZV9leHAoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChiICE9PSBiaSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNoYW5nZWQgPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGNfcGFydC5wdXNoKHApO1xuICAgICAgICAgICAgICAgIG5ld19jX3Bvd2Vycy5wdXNoKFtiLCBlXSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBjb25zdCBhcmdzZXQgPSBuZXcgSGFzaFNldCgpO1xuICAgICAgICAgICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5vLXVudXNlZC12YXJzXG4gICAgICAgICAgICBmb3IgKGNvbnN0IFtiLCBlXSBvZiBuZXdfY19wb3dlcnMpIHtcbiAgICAgICAgICAgICAgICBhcmdzZXQuYWRkKGIpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKGNoYW5nZWQgJiYgYXJnc2V0LnNpemUgIT09IG5ld19jX3Bvd2Vycy5sZW5ndGgpIHtcbiAgICAgICAgICAgICAgICBjX3BhcnQgPSBbXTtcbiAgICAgICAgICAgICAgICBjX3Bvd2VycyA9IF9nYXRoZXIobmV3X2NfcG93ZXJzKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgY29uc3QgaW52X2V4cF9kaWN0ID0gbmV3IEhhc2hEaWN0KCk7XG4gICAgICAgIGZvciAoY29uc3QgW2IsIGVdIG9mIG51bV9leHApIHtcbiAgICAgICAgICAgIGludl9leHBfZGljdC5zZXRkZWZhdWx0KGUsIFtdKS5wdXNoKGIpO1xuICAgICAgICB9XG4gICAgICAgIGZvciAoY29uc3QgW2UsIGJdIG9mIGludl9leHBfZGljdC5lbnRyaWVzKCkpIHtcbiAgICAgICAgICAgIGludl9leHBfZGljdC5hZGQoZSwgbmV3IE11bCh0cnVlLCB0cnVlLCAuLi5iKSk7XG4gICAgICAgIH1cbiAgICAgICAgY29uc3QgY19wYXJ0X2FyZyA9IFtdO1xuICAgICAgICBmb3IgKGNvbnN0IFtlLCBiXSBvZiBpbnZfZXhwX2RpY3QuZW50cmllcygpKSB7XG4gICAgICAgICAgICBpZiAoZSkge1xuICAgICAgICAgICAgICAgIGNfcGFydF9hcmcucHVzaChuZXcgUG93KGIsIGUpKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBjX3BhcnQucHVzaCguLi5jX3BhcnRfYXJnKTtcblxuICAgICAgICBjb25zdCBjb21iX2UgPSBuZXcgSGFzaERpY3QoKTtcbiAgICAgICAgZm9yIChjb25zdCBbYiwgZV0gb2YgcG51bV9yYXQuZW50cmllcygpKSB7XG4gICAgICAgICAgICBjb21iX2Uuc2V0ZGVmYXVsdChuZXcgQWRkKHRydWUsIHRydWUsIC4uLmUpLCBbXSkucHVzaChiKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IG51bV9yYXQgPSBbXTtcbiAgICAgICAgZm9yIChsZXQgW2UsIGJdIG9mIGNvbWJfZS5lbnRyaWVzKCkpIHtcbiAgICAgICAgICAgIGIgPSBuZXcgTXVsKHRydWUsIHRydWUsIC4uLmIpO1xuICAgICAgICAgICAgaWYgKGUucSA9PT0gMSkge1xuICAgICAgICAgICAgICAgIGNvZWZmID0gY29lZmYuX19tdWxfXyhuZXcgUG93KGIsIGUpKTtcbiAgICAgICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChlLnAgPiBlLnEpIHtcbiAgICAgICAgICAgICAgICBjb25zdCBbZV9pLCBlcF0gPSBkaXZtb2QoZS5wLCBlLnEpO1xuICAgICAgICAgICAgICAgIGNvZWZmID0gY29lZmYuX19tdWxfXyhuZXcgUG93KGIsIGVfaSkpO1xuICAgICAgICAgICAgICAgIGUgPSBuZXcgUmF0aW9uYWwoZXAsIGUucSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBudW1fcmF0LnB1c2goW2IsIGVdKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IHBuZXcgPSBuZXcgQXJyRGVmYXVsdERpY3QoKTtcbiAgICAgICAgbGV0IGkgPSAwO1xuICAgICAgICB3aGlsZSAoaSA8IG51bV9yYXQubGVuZ3RoKSB7XG4gICAgICAgICAgICBsZXQgW2JpLCBlaV06IGFueSA9IG51bV9yYXRbaV07XG4gICAgICAgICAgICBjb25zdCBncm93ID0gW107XG4gICAgICAgICAgICBmb3IgKGxldCBqID0gaSArIDE7IGogPCBudW1fcmF0Lmxlbmd0aDsgaisrKSB7XG4gICAgICAgICAgICAgICAgY29uc3QgW2JqLCBlal06IGFueSA9IG51bV9yYXRbal07XG4gICAgICAgICAgICAgICAgY29uc3QgZyA9IGJpLmdjZChiaik7XG4gICAgICAgICAgICAgICAgaWYgKGcgIT09IFMuT25lKSB7XG4gICAgICAgICAgICAgICAgICAgIGxldCBlID0gZWkuX19hZGRfXyhlaik7XG4gICAgICAgICAgICAgICAgICAgIGlmIChlLnEgPT09IDEpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvZWZmID0gY29lZmYuX19tdWxfXyhuZXcgUG93KGcsIGUpKTtcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChlLnAgPiBlLnEpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBbZV9pLCBlcF0gPSBkaXZtb2QoZS5wLCBlLnEpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvZWZmID0gY29lZmYuX19tdWxfXyhuZXcgUG93KGcsIGVfaSkpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGUgPSBuZXcgUmF0aW9uYWwoZXAsIGUucSk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICBncm93LnB1c2goW2csIGVdKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBudW1fcmF0W2pdID0gW2JqL2csIGVqXTtcbiAgICAgICAgICAgICAgICAgICAgYmkgPSBiaS9nO1xuICAgICAgICAgICAgICAgICAgICBpZiAoYmkgPT09IFMuT25lKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChiaSAhPT0gUy5PbmUpIHtcbiAgICAgICAgICAgICAgICBjb25zdCBvYmo6IGFueSA9IG5ldyBQb3coYmksIGVpKTtcbiAgICAgICAgICAgICAgICBpZiAob2JqLmlzX051bWJlcigpKSB7XG4gICAgICAgICAgICAgICAgICAgIGNvZWZmID0gY29lZmYuX19tdWxfXyhvYmopO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIGZvciAoY29uc3QgaXRlbSBvZiB0aGlzLm1ha2VfYXJncyhNdWwsIG9iaikpIHsgLy8gISEhISEhXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoaXRlbS5pc19OdW1iZXIoKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvZWZmID0gY29lZmYuX19tdWxfXyhvYmopO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBbYmksIGVpXSA9IGl0ZW0uX2FyZ3M7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcG5ldy5hZGQoZWksIHBuZXcuZ2V0KGVpKS5jb25jYXQoYmkpKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIG51bV9yYXQucHVzaCguLi5ncm93KTtcbiAgICAgICAgICAgIGkrKztcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChuZWcxZSAhPT0gUy5aZXJvKSB7XG4gICAgICAgICAgICBsZXQgbjsgbGV0IHE7IGxldCBwO1xuICAgICAgICAgICAgW3AsIHFdID0gbmVnMWUuX2FzX251bWVyX2Rlbm9tKCk7XG4gICAgICAgICAgICBbbiwgcF0gPSBkaXZtb2QocC5wLCBxLnApO1xuICAgICAgICAgICAgaWYgKG4gJSAyICE9PSAwKSB7XG4gICAgICAgICAgICAgICAgY29lZmYgPSBjb2VmZi5fX211bF9fKFMuTmVnYXRpdmVPbmUpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKHEgPT09IDIpIHtcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJpbWFnaW5hcnkgbnVtYmVycyBub3QgeWV0IHN1cHBvcnRlZFwiKTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAocCkge1xuICAgICAgICAgICAgICAgIG5lZzFlID0gbmV3IFJhdGlvbmFsKHAsIHEpO1xuICAgICAgICAgICAgICAgIGxldCBlbnRlcmVsc2U6IGJvb2xlYW4gPSB0cnVlO1xuICAgICAgICAgICAgICAgIGZvciAoY29uc3QgW2UsIGJdIG9mIHBuZXcuZW50cmllcygpKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChlID09PSBuZWcxZSAmJiBiLmlzX3Bvc2l0aXZlKCkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHBuZXcuYWRkKGUsIHBuZXcuZ2V0KGUpIC0gYik7XG4gICAgICAgICAgICAgICAgICAgICAgICBlbnRlcmVsc2UgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGlmIChlbnRlcmVsc2UpIHtcbiAgICAgICAgICAgICAgICAgICAgY19wYXJ0LnB1c2gobmV3IFBvdyhTLk5lZ2F0aXZlT25lLCBuZWcxZSwgZmFsc2UpKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCBjX3BhcnRfYXJndjIgPSBbXTtcbiAgICAgICAgZm9yIChsZXQgW2UsIGJdIG9mIHBuZXcuZW50cmllcygpKSB7XG4gICAgICAgICAgICBpZiAoQXJyYXkuaXNBcnJheShiKSkge1xuICAgICAgICAgICAgICAgIGIgPSBiWzBdO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgY19wYXJ0X2FyZ3YyLnB1c2gobmV3IFBvdyhiLCBlKSk7XG4gICAgICAgIH1cbiAgICAgICAgY19wYXJ0LnB1c2goLi4uY19wYXJ0X2FyZ3YyKTtcblxuICAgICAgICBpZiAoY29lZmYgPT09IFMuSW5maW5pdHkgfHwgY29lZmYgPT09IFMuTmVnYXRpdmVJbmZpbml0eSkge1xuICAgICAgICAgICAgZnVuY3Rpb24gX2hhbmRsZV9mb3Jfb28oY19wYXJ0OiBhbnlbXSwgY29lZmZfc2lnbjogbnVtYmVyKSB7XG4gICAgICAgICAgICAgICAgY29uc3QgbmV3X2NfcGFydCA9IFtdO1xuICAgICAgICAgICAgICAgIGZvciAoY29uc3QgdCBvZiBjX3BhcnQpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHQuaXNfZXh0ZW5kZWRfcG9zaXRpdmUoKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgaWYgKHQuaXNfZXh0ZW5kZWRfbmVnYXRpdmUoKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgY29lZmZfc2lnbiA9IC0xO1xuICAgICAgICAgICAgICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgbmV3X2NfcGFydC5wdXNoKHQpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICByZXR1cm4gW25ld19jX3BhcnQsIGNvZWZmX3NpZ25dO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgbGV0IGNvZWZmX3NpZ246IGFueTtcbiAgICAgICAgICAgIFtjX3BhcnQsIGNvZWZmX3NpZ25dID0gX2hhbmRsZV9mb3Jfb28oY19wYXJ0LCAxKTtcbiAgICAgICAgICAgIFtuY19wYXJ0LCBjb2VmZl9zaWduXSA9IF9oYW5kbGVfZm9yX29vKG5jX3BhcnQsIGNvZWZmX3NpZ24pO1xuICAgICAgICAgICAgY29lZmYgPSBjb2VmZi5fX211bF9fKG5ldyBJbnRlZ2VyKGNvZWZmX3NpZ24pKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChjb2VmZiA9PT0gUy5Db21wbGV4SW5maW5pdHkpIHtcbiAgICAgICAgICAgIGNvbnN0IGN0ZW1wID0gW107XG4gICAgICAgICAgICBmb3IgKGNvbnN0IGMgb2YgY19wYXJ0KSB7XG4gICAgICAgICAgICAgICAgaWYgKCEoZnV6enlfbm90djIoYy5pc196ZXJvKCkpICYmIGMuaXNfZXh0ZW5kZWRfcmVhbCgpICE9PSBcInVuZGVmaW5lZFwiKSkge1xuICAgICAgICAgICAgICAgICAgICBjdGVtcC5wdXNoKGMpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGNfcGFydCA9IGN0ZW1wO1xuICAgICAgICAgICAgY29uc3QgbmN0ZW1wID0gW107XG4gICAgICAgICAgICBmb3IgKGNvbnN0IGMgb2YgbmNfcGFydCkge1xuICAgICAgICAgICAgICAgIGlmICghKGZ1enp5X25vdHYyKGMuaXNfemVybygpKSAmJiBjLmlzX2V4dGVuZGVkX3JlYWwoKSAhPT0gXCJ1bmRlZmluZWRcIikpIHtcbiAgICAgICAgICAgICAgICAgICAgbmN0ZW1wLnB1c2goYyk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgbmNfcGFydCA9IG5jdGVtcDtcbiAgICAgICAgfSBlbHNlIGlmIChjb2VmZi5pc196ZXJvKCkpIHtcbiAgICAgICAgICAgIGZvciAoY29uc3QgYyBvZiBjX3BhcnQpIHtcbiAgICAgICAgICAgICAgICBpZiAoYy5pc19maW5pdGUoKSA9PT0gZmFsc2UpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFtbUy5OYU5dLCBbXSwgb3JkZXJfc3ltYm9sc107XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgY29uc3QgX25ldyA9IFtdO1xuICAgICAgICBmb3IgKGNvbnN0IGkgb2YgY19wYXJ0KSB7XG4gICAgICAgICAgICBpZiAoaS5pc19OdW1iZXIoKSkge1xuICAgICAgICAgICAgICAgIGNvZWZmID0gY29lZmYuX19tdWxfXyhpKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgX25ldy5wdXNoKGkpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGNfcGFydCA9IF9uZXc7XG5cbiAgICAgICAgX211bHNvcnQoY19wYXJ0KTtcblxuICAgICAgICBpZiAoY29lZmYgIT09IFMuT25lKSB7XG4gICAgICAgICAgICBjX3BhcnQuc3BsaWNlKDAsIDAsIGNvZWZmKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChnbG9iYWxfcGFyYW1ldGVycy5kaXN0cmlidXRlICYmICFuY19wYXJ0ICYmIGNfcGFydC5sZW5ndGggPT09IDIgJiZcbiAgICAgICAgICAgIGNfcGFydFswXS5pc19OdW1iZXIoKSAmJiBjX3BhcnRbMF0uaXNfZmluaXRlKCkgJiYgY19wYXJ0WzFdLmlzX0FkZCgpKSB7XG4gICAgICAgICAgICBjb2VmZiA9IGNfcGFydFswXTtcbiAgICAgICAgICAgIGNvbnN0IGFkZGFyZyA9IFtdO1xuICAgICAgICAgICAgZm9yIChjb25zdCBmIG9mIGNfcGFydFsxXS5fYXJncykge1xuICAgICAgICAgICAgICAgIGFkZGFyZy5wdXNoKGNvZWZmLl9fbXVsX18oZikpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgY19wYXJ0ID0gbmV3IEFkZCh0cnVlLCB0cnVlLCAuLi5hZGRhcmcpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBbY19wYXJ0LCBuY19wYXJ0LCBvcmRlcl9zeW1ib2xzXTtcbiAgICB9XG5cbiAgICBhc19jb2VmZl9NdWwocmF0aW9uYWw6IGJvb2xlYW4gPSBmYWxzZSkge1xuICAgICAgICBjb25zdCBjb2VmZjogYW55ID0gdGhpcy5fYXJncy5zbGljZSgwLCAxKVswXTtcbiAgICAgICAgY29uc3QgYXJnczogYW55ID0gdGhpcy5fYXJncy5zbGljZSgxKTtcblxuICAgICAgICBpZiAoY29lZmYuaXNfTnVtYmVyKCkpIHtcbiAgICAgICAgICAgIGlmICghcmF0aW9uYWwgfHwgY29lZmYuaXNfUmF0aW9uYWwoKSkge1xuICAgICAgICAgICAgICAgIGlmIChhcmdzLmxlbmd0aCA9PT0gMSkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gW2NvZWZmLCBhcmdzWzBdXTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gW2NvZWZmLCB0aGlzLl9uZXdfcmF3YXJncyh0cnVlLCAuLi5hcmdzKV07XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSBlbHNlIGlmIChjb2VmZi5pc19leHRlbmRlZF9uZWdhdGl2ZSgpKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIFtTLk5lZ2F0aXZlT25lLCB0aGlzLl9uZXdfcmF3YXJncyh0cnVlLCAuLi5bLWNvZWZmXS5jb25jYXQoYXJncykpXTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gW1MuT25lLCB0aGlzXTtcbiAgICB9XG5cbiAgICBfZXZhbF9wb3dlcihlOiBhbnkpIHtcbiAgICAgICAgY29uc3QgW2NhcmdzLCBuY10gPSB0aGlzLmFyZ3NfY25jKGZhbHNlLCB0cnVlLCBmYWxzZSk7XG4gICAgICAgIGlmIChlLmlzX0ludGVnZXIoKSkge1xuICAgICAgICAgICAgY29uc3QgbXVsYXJncyA9IFtdO1xuICAgICAgICAgICAgZm9yIChjb25zdCBiIG9mIGNhcmdzKSB7XG4gICAgICAgICAgICAgICAgbXVsYXJncy5wdXNoKG5ldyBQb3coYiwgZSwgZmFsc2UpKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiBuZXcgTXVsKHRydWUsIHRydWUsIC4uLm11bGFyZ3MpLl9fbXVsX18oXG4gICAgICAgICAgICAgICAgbmV3IFBvdyh0aGlzLl9mcm9tX2FyZ3MoTXVsLCB1bmRlZmluZWQsIC4uLm5jKSwgZSwgZmFsc2UpKTtcbiAgICAgICAgfVxuICAgICAgICBjb25zdCBwID0gbmV3IFBvdyh0aGlzLCBlLCBmYWxzZSk7XG5cbiAgICAgICAgaWYgKGUuaXNfUmF0aW9uYWwoKSB8fCBlLmlzX0Zsb2F0KCkpIHtcbiAgICAgICAgICAgIHJldHVybiBwLl9ldmFsX2V4cGFuZF9wb3dlcl9iYXNlKCk7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gcDtcbiAgICB9XG5cbiAgICBfa2VlcF9jb2VmZihjb2VmZjogYW55LCBmYWN0b3JzOiBhbnksIGNsZWFyOiBib29sZWFuID0gdHJ1ZSwgc2lnbjogYm9vbGVhbiA9IGZhbHNlKTogYW55IHtcbiAgICAgICAgLyogUmV0dXJuIGBgY29lZmYqZmFjdG9yc2BgIHVuZXZhbHVhdGVkIGlmIG5lY2Vzc2FyeS5cbiAgICAgICAgSWYgYGBjbGVhcmBgIGlzIEZhbHNlLCBkbyBub3Qga2VlcCB0aGUgY29lZmZpY2llbnQgYXMgYSBmYWN0b3JcbiAgICAgICAgaWYgaXQgY2FuIGJlIGRpc3RyaWJ1dGVkIG9uIGEgc2luZ2xlIGZhY3RvciBzdWNoIHRoYXQgb25lIG9yXG4gICAgICAgIG1vcmUgdGVybXMgd2lsbCBzdGlsbCBoYXZlIGludGVnZXIgY29lZmZpY2llbnRzLlxuICAgICAgICBJZiBgYHNpZ25gYCBpcyBUcnVlLCBhbGxvdyBhIGNvZWZmaWNpZW50IG9mIC0xIHRvIHJlbWFpbiBmYWN0b3JlZCBvdXQuXG4gICAgICAgIEV4YW1wbGVzXG4gICAgICAgID09PT09PT09XG4gICAgICAgID4+PiBmcm9tIHN5bXB5LmNvcmUubXVsIGltcG9ydCBfa2VlcF9jb2VmZlxuICAgICAgICA+Pj4gZnJvbSBzeW1weS5hYmMgaW1wb3J0IHgsIHlcbiAgICAgICAgPj4+IGZyb20gc3ltcHkgaW1wb3J0IFNcbiAgICAgICAgPj4+IF9rZWVwX2NvZWZmKFMuSGFsZiwgeCArIDIpXG4gICAgICAgICh4ICsgMikvMlxuICAgICAgICA+Pj4gX2tlZXBfY29lZmYoUy5IYWxmLCB4ICsgMiwgY2xlYXI9RmFsc2UpXG4gICAgICAgIHgvMiArIDFcbiAgICAgICAgPj4+IF9rZWVwX2NvZWZmKFMuSGFsZiwgKHggKyAyKSp5LCBjbGVhcj1GYWxzZSlcbiAgICAgICAgeSooeCArIDIpLzJcbiAgICAgICAgPj4+IF9rZWVwX2NvZWZmKFMoLTEpLCB4ICsgeSlcbiAgICAgICAgLXggLSB5XG4gICAgICAgID4+PiBfa2VlcF9jb2VmZihTKC0xKSwgeCArIHksIHNpZ249VHJ1ZSlcbiAgICAgICAgLSh4ICsgeSlcbiAgICAgICAgKi9cbiAgICAgICAgaWYgKCEoY29lZmYuaXNfTnVtYmVyKCkpKSB7XG4gICAgICAgICAgICBpZiAoZmFjdG9ycy5pc19OdW1iZXIoKSkge1xuICAgICAgICAgICAgICAgIFtmYWN0b3JzLCBjb2VmZl0gPSBbY29lZmYsIGZhY3RvcnNdO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gY29lZmYuX19tdWxfXyhmYWN0b3JzKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBpZiAoZmFjdG9ycyA9PT0gUy5PbmUpIHtcbiAgICAgICAgICAgIHJldHVybiBjb2VmZjtcbiAgICAgICAgfVxuICAgICAgICBpZiAoY29lZmYgPT09IFMuT25lKSB7XG4gICAgICAgICAgICByZXR1cm4gZmFjdG9ycztcbiAgICAgICAgfSBlbHNlIGlmIChjb2VmZiA9PT0gUy5OZWdhdGl2ZU9uZSAmJiAhc2lnbikge1xuICAgICAgICAgICAgcmV0dXJuIGZhY3RvcnMuX19tdWxfXyhTLk5lZ2F0aXZlT25lKTtcbiAgICAgICAgfSBlbHNlIGlmIChmYWN0b3JzLmlzX0FkZCgpKSB7XG4gICAgICAgICAgICBpZiAoIWNsZWFyICYmIGNvZWZmLmlzX1JhdGlvbmFsKCkgJiYgY29lZmYucSAhPT0gMSkge1xuICAgICAgICAgICAgICAgIGxldCBhcmdzID0gW107XG4gICAgICAgICAgICAgICAgZm9yIChjb25zdCBpIG9mIGZhY3RvcnMuX2FyZ3MpIHtcbiAgICAgICAgICAgICAgICAgICAgYXJncy5wdXNoKGkuYXNfY29lZmZfTXVsKCkpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBjb25zdCB0ZW1wID0gW107XG4gICAgICAgICAgICAgICAgZm9yIChjb25zdCBbYywgbV0gb2YgYXJncykge1xuICAgICAgICAgICAgICAgICAgICB0ZW1wLnB1c2goW3RoaXMuX2tlZXBfY29lZmYoYywgY29lZmYpLCBtXSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGFyZ3MgPSB0ZW1wO1xuICAgICAgICAgICAgICAgIGZvciAoY29uc3QgW2NdIG9mIGFyZ3MpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGMuaXNfSW50ZWdlcigpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zdCB0ZW1wYXJnID0gW107XG4gICAgICAgICAgICAgICAgICAgICAgICBmb3IgKGNvbnN0IGkgb2YgYXJncykge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChpWzBdID09PSAxKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRlbXBhcmcucHVzaChpLnNsaWNlKDAsIDEpKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLl9mcm9tX2FyZ3MoQWRkLCB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLi4udGhpcy5fZnJvbV9hcmdzKE11bCwgdW5kZWZpbmVkLCAuLi50ZW1wYXJnKSk7XG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiBuZXcgTXVsKGZhbHNlLCB0cnVlLCBjb2VmZiwgZmFjdG9ycyk7XG4gICAgICAgIH0gZWxzZSBpZiAoZmFjdG9ycy5pc19NdWwoKSkge1xuICAgICAgICAgICAgY29uc3QgbWFyZ3M6IGFueVtdID0gZmFjdG9ycy5fYXJncztcbiAgICAgICAgICAgIGlmIChtYXJnc1swXS5pc19OdW1iZXIoKSkge1xuICAgICAgICAgICAgICAgIG1hcmdzWzBdID0gbWFyZ3NbMF0uX19tdWxfXyhjb2VmZik7XG4gICAgICAgICAgICAgICAgaWYgKG1hcmdzWzBdID09PSAxKSB7XG4gICAgICAgICAgICAgICAgICAgIG1hcmdzLnNwbGljZSgyLCAxKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIG1hcmdzLnNwbGljZSgwLCAwLCBjb2VmZik7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fZnJvbV9hcmdzKE11bCwgdW5kZWZpbmVkLCAuLi5tYXJncyk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBsZXQgbSA9IGNvZWZmLl9fbXVsX18oZmFjdG9ycyk7XG4gICAgICAgICAgICBpZiAobS5pc19OdW1iZXIoKSAmJiAhKGZhY3RvcnMuaXNfTnVtYmVyKCkpKSB7XG4gICAgICAgICAgICAgICAgbSA9IHRoaXMuX2Zyb21fYXJncyhNdWwsIHVuZGVmaW5lZCwgY29lZmYsIGZhY3RvcnMpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIG07XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBzdGF0aWMgX25ldyhldmFsdWF0ZTogYm9vbGVhbiwgc2ltcGxpZnk6IGJvb2xlYW4sIC4uLmFyZ3M6IGFueSkge1xuICAgICAgICByZXR1cm4gbmV3IE11bChldmFsdWF0ZSwgc2ltcGxpZnksIC4uLmFyZ3MpO1xuICAgIH1cblxuXG4gICAgX2V2YWxfaXNfY29tbXV0YXRpdmUoKSB7XG4gICAgICAgIGNvbnN0IGFsbGFyZ3MgPSBbXTtcbiAgICAgICAgZm9yIChjb25zdCBhIG9mIHRoaXMuX2FyZ3MpIHtcbiAgICAgICAgICAgIGFsbGFyZ3MucHVzaChhLmlzX2NvbW11dGF0aXZlKCkpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBfZnV6enlfZ3JvdXB2MihhbGxhcmdzKTtcbiAgICB9XG5cbiAgICAvLyBXQiBhZGRpdGlvbiBmb3IgamFzbWluZSB0ZXN0c1xuICAgIHRvU3RyaW5nKCkge1xuICAgICAgICBsZXQgcmVzdWx0ID0gXCJcIjtcbiAgICAgICAgY29uc3QgbnVtX2FyZ3MgPSB0aGlzLl9hcmdzLmxlbmd0aFxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IG51bV9hcmdzOyBpKyspIHtcbiAgICAgICAgICAgIGNvbnN0IGFyZyA9IHRoaXMuX2FyZ3NbaV07XG4gICAgICAgICAgICBsZXQgdGVtcDtcbiAgICAgICAgICAgIGlmIChpICE9IG51bV9hcmdzIC0gMSkge1xuICAgICAgICAgICAgICAgIHRlbXAgPSBhcmcudG9TdHJpbmcoKSArIFwiKlwiXG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHRlbXAgPSBhcmcudG9TdHJpbmcoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJlc3VsdCA9IHJlc3VsdC5jb25jYXQodGVtcClcbiAgICAgICAgfVxuICAgIFxuICAgICAgICByZXR1cm4gcmVzdWx0O1xuICAgIH1cbn1cblxuTWFuYWdlZFByb3BlcnRpZXMucmVnaXN0ZXIoTXVsKTtcbkdsb2JhbC5yZWdpc3RlcihcIk11bFwiLCBNdWwuX25ldyk7XG4iLCAiLypcbkNoYW5nZXMgbWFkZSAoV0IgYW5kIEdNKTpcbi0gQWRkZWQgY29uc3RydWN0b3IgdG8gZXhwbGljaXRseSBjYWxsIEFzc29jT3Agc3VwZXJjbGFzc1xuLSBBZGRlZCBcInNpbXBsaWZ5XCIgYXJndW1lbnQsIHdoaWNoIHByZXZlbnRzIGluZmluaXRlIHJlY3Vyc2lvbiBpbiBBc3NvY09wXG4tIE5vdGU6IE9yZGVyIG9iamVjdHMgaW4gQWRkIGFyZSBub3QgeWV0IGltcGxlbWVudGVkXG4qL1xuXG5pbXBvcnQge0V4cHJ9IGZyb20gXCIuL2V4cHJcIjtcbmltcG9ydCB7QXNzb2NPcH0gZnJvbSBcIi4vb3BlcmF0aW9uc1wiO1xuaW1wb3J0IHtiYXNlLCBtaXgsIEhhc2hEaWN0fSBmcm9tIFwiLi91dGlsaXR5XCI7XG5pbXBvcnQge1N9IGZyb20gXCIuL3NpbmdsZXRvblwiO1xuaW1wb3J0IHtCYXNpY30gZnJvbSBcIi4vYmFzaWNcIjtcbmltcG9ydCB7TWFuYWdlZFByb3BlcnRpZXN9IGZyb20gXCIuL2Fzc3VtcHRpb25zXCI7XG5pbXBvcnQge011bH0gZnJvbSBcIi4vbXVsXCI7XG5pbXBvcnQge0dsb2JhbH0gZnJvbSBcIi4vZ2xvYmFsXCI7XG5pbXBvcnQge19mdXp6eV9ncm91cHYyfSBmcm9tIFwiLi9sb2dpY1wiO1xuXG5mdW5jdGlvbiBfYWRkc29ydChhcmdzOiBhbnlbXSkge1xuICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBuZXctY2FwXG4gICAgYXJncy5zb3J0KChhLCBiKSA9PiBCYXNpYy5jbXAoYSwgYikpO1xufVxuXG5leHBvcnQgY2xhc3MgQWRkIGV4dGVuZHMgbWl4KGJhc2UpLndpdGgoRXhwciwgQXNzb2NPcCkge1xuICAgIC8qXG4gICAgXCJcIlwiXG4gICAgRXhwcmVzc2lvbiByZXByZXNlbnRpbmcgYWRkaXRpb24gb3BlcmF0aW9uIGZvciBhbGdlYnJhaWMgZ3JvdXAuXG4gICAgLi4gZGVwcmVjYXRlZDo6IDEuN1xuICAgICAgIFVzaW5nIGFyZ3VtZW50cyB0aGF0IGFyZW4ndCBzdWJjbGFzc2VzIG9mIDpjbGFzczpgfi5FeHByYCBpbiBjb3JlXG4gICAgICAgb3BlcmF0b3JzICg6Y2xhc3M6YH4uTXVsYCwgOmNsYXNzOmB+LkFkZGAsIGFuZCA6Y2xhc3M6YH4uUG93YCkgaXNcbiAgICAgICBkZXByZWNhdGVkLiBTZWUgOnJlZjpgbm9uLWV4cHItYXJncy1kZXByZWNhdGVkYCBmb3IgZGV0YWlscy5cbiAgICBFdmVyeSBhcmd1bWVudCBvZiBgYEFkZCgpYGAgbXVzdCBiZSBgYEV4cHJgYC4gSW5maXggb3BlcmF0b3IgYGArYGBcbiAgICBvbiBtb3N0IHNjYWxhciBvYmplY3RzIGluIFN5bVB5IGNhbGxzIHRoaXMgY2xhc3MuXG4gICAgQW5vdGhlciB1c2Ugb2YgYGBBZGQoKWBgIGlzIHRvIHJlcHJlc2VudCB0aGUgc3RydWN0dXJlIG9mIGFic3RyYWN0XG4gICAgYWRkaXRpb24gc28gdGhhdCBpdHMgYXJndW1lbnRzIGNhbiBiZSBzdWJzdGl0dXRlZCB0byByZXR1cm4gZGlmZmVyZW50XG4gICAgY2xhc3MuIFJlZmVyIHRvIGV4YW1wbGVzIHNlY3Rpb24gZm9yIHRoaXMuXG4gICAgYGBBZGQoKWBgIGV2YWx1YXRlcyB0aGUgYXJndW1lbnQgdW5sZXNzIGBgZXZhbHVhdGU9RmFsc2VgYCBpcyBwYXNzZWQuXG4gICAgVGhlIGV2YWx1YXRpb24gbG9naWMgaW5jbHVkZXM6XG4gICAgMS4gRmxhdHRlbmluZ1xuICAgICAgICBgYEFkZCh4LCBBZGQoeSwgeikpYGAgLT4gYGBBZGQoeCwgeSwgeilgYFxuICAgIDIuIElkZW50aXR5IHJlbW92aW5nXG4gICAgICAgIGBgQWRkKHgsIDAsIHkpYGAgLT4gYGBBZGQoeCwgeSlgYFxuICAgIDMuIENvZWZmaWNpZW50IGNvbGxlY3RpbmcgYnkgYGAuYXNfY29lZmZfTXVsKClgYFxuICAgICAgICBgYEFkZCh4LCAyKngpYGAgLT4gYGBNdWwoMywgeClgYFxuICAgIDQuIFRlcm0gc29ydGluZ1xuICAgICAgICBgYEFkZCh5LCB4LCAyKWBgIC0+IGBgQWRkKDIsIHgsIHkpYGBcbiAgICBJZiBubyBhcmd1bWVudCBpcyBwYXNzZWQsIGlkZW50aXR5IGVsZW1lbnQgMCBpcyByZXR1cm5lZC4gSWYgc2luZ2xlXG4gICAgZWxlbWVudCBpcyBwYXNzZWQsIHRoYXQgZWxlbWVudCBpcyByZXR1cm5lZC5cbiAgICBOb3RlIHRoYXQgYGBBZGQoKmFyZ3MpYGAgaXMgbW9yZSBlZmZpY2llbnQgdGhhbiBgYHN1bShhcmdzKWBgIGJlY2F1c2VcbiAgICBpdCBmbGF0dGVucyB0aGUgYXJndW1lbnRzLiBgYHN1bShhLCBiLCBjLCAuLi4pYGAgcmVjdXJzaXZlbHkgYWRkcyB0aGVcbiAgICBhcmd1bWVudHMgYXMgYGBhICsgKGIgKyAoYyArIC4uLikpYGAsIHdoaWNoIGhhcyBxdWFkcmF0aWMgY29tcGxleGl0eS5cbiAgICBPbiB0aGUgb3RoZXIgaGFuZCwgYGBBZGQoYSwgYiwgYywgZClgYCBkb2VzIG5vdCBhc3N1bWUgbmVzdGVkXG4gICAgc3RydWN0dXJlLCBtYWtpbmcgdGhlIGNvbXBsZXhpdHkgbGluZWFyLlxuICAgIFNpbmNlIGFkZGl0aW9uIGlzIGdyb3VwIG9wZXJhdGlvbiwgZXZlcnkgYXJndW1lbnQgc2hvdWxkIGhhdmUgdGhlXG4gICAgc2FtZSA6b2JqOmBzeW1weS5jb3JlLmtpbmQuS2luZCgpYC5cbiAgICBFeGFtcGxlc1xuICAgID09PT09PT09XG4gICAgPj4+IGZyb20gc3ltcHkgaW1wb3J0IEFkZCwgSVxuICAgID4+PiBmcm9tIHN5bXB5LmFiYyBpbXBvcnQgeCwgeVxuICAgID4+PiBBZGQoeCwgMSlcbiAgICB4ICsgMVxuICAgID4+PiBBZGQoeCwgeClcbiAgICAyKnhcbiAgICA+Pj4gMip4KioyICsgMyp4ICsgSSp5ICsgMip5ICsgMip4LzUgKyAxLjAqeSArIDFcbiAgICAyKngqKjIgKyAxNyp4LzUgKyAzLjAqeSArIEkqeSArIDFcbiAgICBJZiBgYGV2YWx1YXRlPUZhbHNlYGAgaXMgcGFzc2VkLCByZXN1bHQgaXMgbm90IGV2YWx1YXRlZC5cbiAgICA+Pj4gQWRkKDEsIDIsIGV2YWx1YXRlPUZhbHNlKVxuICAgIDEgKyAyXG4gICAgPj4+IEFkZCh4LCB4LCBldmFsdWF0ZT1GYWxzZSlcbiAgICB4ICsgeFxuICAgIGBgQWRkKClgYCBhbHNvIHJlcHJlc2VudHMgdGhlIGdlbmVyYWwgc3RydWN0dXJlIG9mIGFkZGl0aW9uIG9wZXJhdGlvbi5cbiAgICA+Pj4gZnJvbSBzeW1weSBpbXBvcnQgTWF0cml4U3ltYm9sXG4gICAgPj4+IEEsQiA9IE1hdHJpeFN5bWJvbCgnQScsIDIsMiksIE1hdHJpeFN5bWJvbCgnQicsIDIsMilcbiAgICA+Pj4gZXhwciA9IEFkZCh4LHkpLnN1YnMoe3g6QSwgeTpCfSlcbiAgICA+Pj4gZXhwclxuICAgIEEgKyBCXG4gICAgPj4+IHR5cGUoZXhwcilcbiAgICA8Y2xhc3MgJ3N5bXB5Lm1hdHJpY2VzLmV4cHJlc3Npb25zLm1hdGFkZC5NYXRBZGQnPlxuICAgIE5vdGUgdGhhdCB0aGUgcHJpbnRlcnMgZG8gbm90IGRpc3BsYXkgaW4gYXJncyBvcmRlci5cbiAgICA+Pj4gQWRkKHgsIDEpXG4gICAgeCArIDFcbiAgICA+Pj4gQWRkKHgsIDEpLmFyZ3NcbiAgICAoMSwgeClcbiAgICBTZWUgQWxzb1xuICAgID09PT09PT09XG4gICAgTWF0QWRkXG4gICAgXCJcIlwiXG4gICAgKi9cblxuICAgIF9fc2xvdHNfXzogYW55W10gPSBbXTtcbiAgICBhcmdzOiBhbnlbXTtcbiAgICBzdGF0aWMgaXNfQWRkOiBhbnkgPSB0cnVlOyBcbiAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbmV3LWNhcFxuICAgIHN0YXRpYyBfYXJnc190eXBlID0gRXhwcihPYmplY3QpO1xuICAgIHN0YXRpYyBpZGVudGl0eSA9IFMuWmVybzsgLy8gISEhIHVuc3VyZSBhYnQgdGhpc1xuXG4gICAgY29uc3RydWN0b3IoZXZhbHVhdGU6IGJvb2xlYW4sIHNpbXBsaWZ5OiBib29sZWFuLCAuLi5hcmdzOiBhbnkpIHtcbiAgICAgICAgc3VwZXIoQWRkLCBldmFsdWF0ZSwgc2ltcGxpZnksIC4uLmFyZ3MpO1xuICAgIH1cblxuICAgIGZsYXR0ZW4oc2VxOiBhbnlbXSkge1xuICAgICAgICAvKlxuICAgICAgICBUYWtlcyB0aGUgc2VxdWVuY2UgXCJzZXFcIiBvZiBuZXN0ZWQgQWRkcyBhbmQgcmV0dXJucyBhIGZsYXR0ZW4gbGlzdC5cbiAgICAgICAgUmV0dXJuczogKGNvbW11dGF0aXZlX3BhcnQsIG5vbmNvbW11dGF0aXZlX3BhcnQsIG9yZGVyX3N5bWJvbHMpXG4gICAgICAgIEFwcGxpZXMgYXNzb2NpYXRpdml0eSwgYWxsIHRlcm1zIGFyZSBjb21tdXRhYmxlIHdpdGggcmVzcGVjdCB0b1xuICAgICAgICBhZGRpdGlvbi5cbiAgICAgICAgTkI6IHRoZSByZW1vdmFsIG9mIDAgaXMgYWxyZWFkeSBoYW5kbGVkIGJ5IEFzc29jT3AuX19uZXdfX1xuICAgICAgICBTZWUgYWxzb1xuICAgICAgICA9PT09PT09PVxuICAgICAgICBzeW1weS5jb3JlLm11bC5NdWwuZmxhdHRlblxuICAgICAgICAqL1xuICAgICAgICBsZXQgcnYgPSB1bmRlZmluZWQ7XG4gICAgICAgIGlmIChzZXEubGVuZ3RoID09PSAyKSB7XG4gICAgICAgICAgICBsZXQgW2EsIGJdID0gc2VxO1xuICAgICAgICAgICAgaWYgKGIuaXNfUmF0aW9uYWwoKSkge1xuICAgICAgICAgICAgICAgIFthLCBiXSA9IFtiLCBhXTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChhLmlzX1JhdGlvbmFsKCkpIHtcbiAgICAgICAgICAgICAgICBpZiAoYi5pc19NdWwoKSkge1xuICAgICAgICAgICAgICAgICAgICBydiA9IFtbYSwgYl0sIFtdLCB1bmRlZmluZWRdO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChydikge1xuICAgICAgICAgICAgICAgIGxldCBhbGxjID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICBmb3IgKGNvbnN0IHMgb2YgcnZbMF0pIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHMuaXNfY29tbXV0YXRpdmUoKSA9PT0gZmFsc2UpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGFsbGMgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBpZiAoYWxsYykge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gcnY7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFtbXSwgcnZbMF0sIHVuZGVmaW5lZF07XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGNvbnN0IHRlcm1zOiBIYXNoRGljdCA9IG5ldyBIYXNoRGljdCgpO1xuICAgICAgICBsZXQgY29lZmYgPSBTLlplcm87XG4gICAgICAgIGNvbnN0IGV4dHJhOiBhbnlbXSA9IFtdO1xuICAgICAgICBmb3IgKGNvbnN0IG8gb2Ygc2VxKSB7XG4gICAgICAgICAgICBsZXQgYztcbiAgICAgICAgICAgIGxldCBzO1xuICAgICAgICAgICAgaWYgKG8uaXNfTnVtYmVyKCkpIHtcbiAgICAgICAgICAgICAgICBpZiAoKG8gPT09IFMuTmFOIHx8IChjb2VmZiA9PT0gUy5Db21wbGV4SW5maW5pdHkgJiYgby5pc19maW5pdGUoKSA9PT0gZmFsc2UpKSkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gW1tTLk5hTl0sIFtdLCB1bmRlZmluZWRdO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBpZiAoY29lZmYuaXNfTnVtYmVyKCkpIHtcbiAgICAgICAgICAgICAgICAgICAgY29lZmYgPSBjb2VmZi5fX2FkZF9fKG8pO1xuICAgICAgICAgICAgICAgICAgICBpZiAoY29lZmYgPT09IFMuTmFOIHx8ICFleHRyYSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFtbUy5OYU5dLCBbXSwgdW5kZWZpbmVkXTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAobyA9PT0gUy5Db21wbGV4SW5maW5pdHkpIHtcbiAgICAgICAgICAgICAgICBpZiAoY29lZmYuaXNfZmluaXRlKCkgPT09IGZhbHNlKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBbW1MuTmFOXSwgW10sIHVuZGVmaW5lZF07XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGNvZWZmID0gUy5Db21wbGV4SW5maW5pdHk7XG4gICAgICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKG8uaXNfQWRkKCkpIHtcbiAgICAgICAgICAgICAgICBzZXEucHVzaCguLi5vLl9hcmdzKTtcbiAgICAgICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoby5pc19NdWwoKSkge1xuICAgICAgICAgICAgICAgIFtjLCBzXSA9IG8uYXNfY29lZmZfTXVsKCk7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKG8uaXNfUG93KCkpIHtcbiAgICAgICAgICAgICAgICBjb25zdCBwYWlyID0gby5hc19iYXNlX2V4cCgpO1xuICAgICAgICAgICAgICAgIGNvbnN0IGIgPSBwYWlyWzBdO1xuICAgICAgICAgICAgICAgIGNvbnN0IGUgPSBwYWlyWzFdO1xuICAgICAgICAgICAgICAgIGlmIChiLmlzX051bWJlcigpICYmIChlLmlzX0ludGVnZXIoKSB8fCAoZS5pc19SYXRpb25hbCgpICYmIGUuaXNfbmVnYXRpdmUoKSkpKSB7XG4gICAgICAgICAgICAgICAgICAgIHNlcS5wdXNoKGIuX2V2YWxfcG93ZXIoZSkpO1xuICAgICAgICAgICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgW2MsIHNdID0gW1MuT25lLCBvXTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgYyA9IFMuT25lO1xuICAgICAgICAgICAgICAgIHMgPSBvO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKHRlcm1zLmhhcyhzKSkge1xuICAgICAgICAgICAgICAgIHRlcm1zLmFkZChzLCB0ZXJtcy5nZXQocykuX19hZGRfXyhjKSk7XG4gICAgICAgICAgICAgICAgaWYgKHRlcm1zLmdldChzKSA9PT0gUy5OYU4pIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFtbUy5OYU5dLCBbXSwgdW5kZWZpbmVkXTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHRlcm1zLmFkZChzLCBjKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBsZXQgbmV3c2VxOiBhbnlbXSA9IFtdO1xuICAgICAgICBsZXQgbm9uY29tbXV0YXRpdmU6IGJvb2xlYW4gPSBmYWxzZTtcbiAgICAgICAgZm9yIChjb25zdCBpdGVtIG9mIHRlcm1zLmVudHJpZXMoKSkge1xuICAgICAgICAgICAgY29uc3QgczogYW55ID0gaXRlbVswXTtcbiAgICAgICAgICAgIGNvbnN0IGM6IGFueSA9IGl0ZW1bMV07XG4gICAgICAgICAgICBpZiAoYy5pc196ZXJvKCkpIHtcbiAgICAgICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoYyA9PT0gUy5PbmUpIHtcbiAgICAgICAgICAgICAgICBuZXdzZXEucHVzaChzKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgaWYgKHMuaXNfTXVsKCkpIHtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgY3MgPSBzLl9uZXdfcmF3YXJncyh0cnVlLCAuLi5bY10uY29uY2F0KHMuX2FyZ3MpKTtcbiAgICAgICAgICAgICAgICAgICAgbmV3c2VxLnB1c2goY3MpO1xuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAocy5pc19BZGQoKSkge1xuICAgICAgICAgICAgICAgICAgICBuZXdzZXEucHVzaChuZXcgTXVsKGZhbHNlLCB0cnVlLCBjLCBzKSk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgbmV3c2VxLnB1c2gobmV3IE11bCh0cnVlLCB0cnVlLCBjLCBzKSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgbm9uY29tbXV0YXRpdmUgPSBub25jb21tdXRhdGl2ZSB8fCAhKHMuaXNfY29tbXV0YXRpdmUoKSk7XG4gICAgICAgIH1cbiAgICAgICAgY29uc3QgdGVtcCA9IFtdO1xuICAgICAgICBpZiAoY29lZmYgPT09IFMuSW5maW5pdHkpIHtcbiAgICAgICAgICAgIGZvciAoY29uc3QgZiBvZiBuZXdzZXEpIHtcbiAgICAgICAgICAgICAgICBpZiAoIShmLmlzX2V4dGVuZGVkX25vbm5lZ2F0aXZlKCkpKSB7XG4gICAgICAgICAgICAgICAgICAgIHRlbXAucHVzaChmKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBuZXdzZXEgPSB0ZW1wO1xuICAgICAgICB9IGVsc2UgaWYgKGNvZWZmID09PSBTLk5lZ2F0aXZlSW5maW5pdHkpIHtcbiAgICAgICAgICAgIGZvciAoY29uc3QgZiBvZiBuZXdzZXEpIHtcbiAgICAgICAgICAgICAgICBpZiAoIShmLmlzX2V4dGVuZGVkX25vbnBvc2l0aXZlKCkpKSB7XG4gICAgICAgICAgICAgICAgICAgIHRlbXAucHVzaChmKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBuZXdzZXEgPSB0ZW1wO1xuICAgICAgICB9XG4gICAgICAgIGNvbnN0IHRlbXAyID0gW107XG4gICAgICAgIGlmIChjb2VmZiA9PT0gUy5Db21wbGV4SW5maW5pdHkpIHtcbiAgICAgICAgICAgIGZvciAoY29uc3QgYyBvZiBuZXdzZXEpIHtcbiAgICAgICAgICAgICAgICBpZiAoIShjLmlzX2Zpbml0ZSgpIHx8IGMuaXNfZXh0ZW5kZWRfcmVhbCgpICE9PSBcInVuZGVmaW5lZFwiKSkge1xuICAgICAgICAgICAgICAgICAgICB0ZW1wMi5wdXNoKGMpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIG5ld3NlcSA9IHRlbXAyO1xuICAgICAgICB9XG4gICAgICAgIF9hZGRzb3J0KG5ld3NlcSk7XG4gICAgICAgIGlmIChjb2VmZiAhPT0gUy5aZXJvKSB7XG4gICAgICAgICAgICBuZXdzZXEuc3BsaWNlKDAsIDAsIGNvZWZmKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAobm9uY29tbXV0YXRpdmUpIHtcbiAgICAgICAgICAgIHJldHVybiBbW10sIG5ld3NlcSwgdW5kZWZpbmVkXTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiBbbmV3c2VxLCBbXSwgdW5kZWZpbmVkXTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIF9ldmFsX2lzX2NvbW11dGF0aXZlKCkge1xuICAgICAgICBjb25zdCBmdXp6eWFyZyA9IFtdO1xuICAgICAgICBmb3IgKGNvbnN0IGEgb2YgdGhpcy5fYXJncykge1xuICAgICAgICAgICAgZnV6enlhcmcucHVzaChhLmlzX2NvbW11dGF0aXZlKCkpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBfZnV6enlfZ3JvdXB2MihmdXp6eWFyZyk7XG4gICAgfVxuXG4gICAgYXNfY29lZmZfQWRkKCkge1xuICAgICAgICBjb25zdCBbY29lZmYsIGFyZ3NdID0gW3RoaXMuYXJnc1swXSwgdGhpcy5hcmdzLnNsaWNlKDEpXTtcbiAgICAgICAgaWYgKGNvZWZmLmlzX051bWJlcigpICYmIGNvZWZmLmlzX1JhdGlvbmFsKCkpIHtcbiAgICAgICAgICAgIHJldHVybiBbY29lZmYsIHRoaXMuX25ld19yYXdhcmdzKHRydWUsIC4uLmFyZ3MpXTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gW1MuWmVybywgdGhpc107XG4gICAgfVxuXG4gICAgc3RhdGljIF9uZXcoZXZhbHVhdGU6IGJvb2xlYW4sIHNpbXBsaWZ5OiBib29sZWFuLCAuLi5hcmdzOiBhbnkpIHtcbiAgICAgICAgcmV0dXJuIG5ldyBBZGQoZXZhbHVhdGUsIHNpbXBsaWZ5LCAuLi5hcmdzKTtcbiAgICB9XG5cbiAgICAvLyBXQiBhZGRpdGlvbiBmb3IgamFzbWluZSB0ZXN0c1xuICAgIHRvU3RyaW5nKCkge1xuICAgICAgICBsZXQgcmVzdWx0ID0gXCJcIjtcbiAgICAgICAgY29uc3QgbnVtX2FyZ3MgPSB0aGlzLl9hcmdzLmxlbmd0aFxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IG51bV9hcmdzOyBpKyspIHtcbiAgICAgICAgICAgIGNvbnN0IGFyZyA9IHRoaXMuX2FyZ3NbaV07XG4gICAgICAgICAgICBsZXQgdGVtcDtcbiAgICAgICAgICAgIGlmIChpICE9IG51bV9hcmdzIC0gMSkge1xuICAgICAgICAgICAgICAgIHRlbXAgPSBhcmcudG9TdHJpbmcoKSArIFwiICsgXCJcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgdGVtcCA9IGFyZy50b1N0cmluZygpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmVzdWx0ID0gcmVzdWx0LmNvbmNhdCh0ZW1wKVxuICAgICAgICB9XG4gXG4gICAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgfVxufVxuXG5NYW5hZ2VkUHJvcGVydGllcy5yZWdpc3RlcihBZGQpO1xuR2xvYmFsLnJlZ2lzdGVyKFwiQWRkXCIsIEFkZC5fbmV3KTtcbiIsICIvKlxuTm90YWJsZSBjaGFuZ2VzIG1hZGUgKGFuZCBub3Rlcyk6XG4tIEJhcmVib25lcyBpbXBsZW1lbnRhdGlvbiAtIG9ubHkgZW5vdWdoIGFzIG5lZWRlZCBmb3Igc3ltYm9sXG4qL1xuXG5pbXBvcnQge19CYXNpY30gZnJvbSBcIi4vYmFzaWNcIjtcbmltcG9ydCB7Qm9vbGVhbktpbmR9IGZyb20gXCIuL2tpbmRcIjtcbmltcG9ydCB7YmFzZSwgbWl4fSBmcm9tIFwiLi91dGlsaXR5XCI7XG5pbXBvcnQge01hbmFnZWRQcm9wZXJ0aWVzfSBmcm9tIFwiLi9hc3N1bXB0aW9uc1wiO1xuXG5jb25zdCBCb29sZWFuID0gKHN1cGVyY2xhc3M6IGFueSkgPT4gY2xhc3MgQm9vbGVhbiBleHRlbmRzIG1peChiYXNlKS53aXRoKF9CYXNpYykge1xuICAgIF9fc2xvdHNfXzogYW55W10gPSBbXTtcblxuICAgIHN0YXRpYyBraW5kID0gQm9vbGVhbktpbmQ7XG59O1xuXG5NYW5hZ2VkUHJvcGVydGllcy5yZWdpc3RlcihCb29sZWFuKE9iamVjdCkpO1xuXG5leHBvcnQge0Jvb2xlYW59O1xuIiwgIi8qXG5Ob3RhYmxlIGNoYW5nZXNcbi0gU3RpbGwgYSB3b3JrIGluIHByb2dyZXNzIChub3QgYWxsIG1ldGhvZHMgaW1wbGVtZW50ZWQpXG4tIENsYXNzIHN0cnVjdHVyZSByZXdvcmtlZCBiYXNlZCBvbiBhIGNvbnN0cnVjdG9yIHN5c3RlbSAodmlldyBzb3VyY2UpXG4qL1xuXG5pbXBvcnQge21peCwgYmFzZSwgSGFzaERpY3R9IGZyb20gXCIuL3V0aWxpdHlcIjtcbmltcG9ydCB7QXRvbWljRXhwcn0gZnJvbSBcIi4vZXhwclwiO1xuaW1wb3J0IHtCb29sZWFufSBmcm9tIFwiLi9ib29sYWxnXCI7XG5pbXBvcnQge051bWJlcktpbmQsIFVuZGVmaW5lZEtpbmR9IGZyb20gXCIuL2tpbmRcIjtcbmltcG9ydCB7ZnV6enlfYm9vbF92Mn0gZnJvbSBcIi4vbG9naWNcIjtcbmltcG9ydCB7U3RkRmFjdEtCfSBmcm9tIFwiLi9hc3N1bXB0aW9uc1wiO1xuaW1wb3J0IHtNYW5hZ2VkUHJvcGVydGllc30gZnJvbSBcIi4vYXNzdW1wdGlvbnNcIjtcblxuXG5jbGFzcyBTeW1ib2wgZXh0ZW5kcyBtaXgoYmFzZSkud2l0aChCb29sZWFuLCBBdG9taWNFeHByKSB7XG4gICAgLypcbiAgICBBc3N1bXB0aW9uczpcbiAgICAgICBjb21tdXRhdGl2ZSA9IFRydWVcbiAgICBZb3UgY2FuIG92ZXJyaWRlIHRoZSBkZWZhdWx0IGFzc3VtcHRpb25zIGluIHRoZSBjb25zdHJ1Y3Rvci5cbiAgICBFeGFtcGxlc1xuICAgID09PT09PT09XG4gICAgPj4+IGZyb20gc3ltcHkgaW1wb3J0IHN5bWJvbHNcbiAgICA+Pj4gQSxCID0gc3ltYm9scygnQSxCJywgY29tbXV0YXRpdmUgPSBGYWxzZSlcbiAgICA+Pj4gYm9vbChBKkIgIT0gQipBKVxuICAgIFRydWVcbiAgICA+Pj4gYm9vbChBKkIqMiA9PSAyKkEqQikgPT0gVHJ1ZSAjIG11bHRpcGxpY2F0aW9uIGJ5IHNjYWxhcnMgaXMgY29tbXV0YXRpdmVcbiAgICBUcnVlXG4gICAgKi9cblxuICAgIHN0YXRpYyBpc19jb21wYXJhYmxlID0gZmFsc2U7XG5cbiAgICBfX3Nsb3RzX18gPSBbXCJuYW1lXCJdO1xuXG4gICAgbmFtZTogc3RyaW5nO1xuXG4gICAgc3RhdGljIGlzX1N5bWJvbCA9IHRydWU7XG5cbiAgICBzdGF0aWMgaXNfc3ltYm9sID0gdHJ1ZTtcblxuICAgIHN0YXRpYyBpc19jb21tdXRhdGl2ZSA9IHRydWU7XG5cbiAgICBhcmdzOiBhbnlbXTtcblxuICAgIGtpbmQoKSB7XG4gICAgICAgIGlmICgodGhpcy5jb25zdHJ1Y3RvciBhcyBhbnkpLmlzX2NvbW11dGF0aXZlKSB7XG4gICAgICAgICAgICByZXR1cm4gTnVtYmVyS2luZDtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gVW5kZWZpbmVkS2luZDtcbiAgICB9XG5cbiAgICBfZGlmZl93cnQoKSB7XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cblxuICAgIGhhc2hLZXkoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLm5hbWUgKyB0aGlzLmFyZ3M7XG4gICAgfVxuXG4gICAgY29uc3RydWN0b3IobmFtZTogYW55LCBwcm9wZXJ0aWVzOiBSZWNvcmQ8YW55LCBhbnk+ID0gdW5kZWZpbmVkKSB7XG4gICAgICAgIHN1cGVyKCk7XG4gICAgICAgIHRoaXMubmFtZSA9IG5hbWU7XG5cbiAgICAgICAgLy8gYWRkIHVzZXIgYXNzdW1wdGlvbnNcbiAgICAgICAgY29uc3QgYXNzdW1wdGlvbnM6IEhhc2hEaWN0ID0gbmV3IEhhc2hEaWN0KHByb3BlcnRpZXMpO1xuICAgICAgICBTeW1ib2wuX3Nhbml0aXplKGFzc3VtcHRpb25zKTtcbiAgICAgICAgY29uc3QgdG1wX2FzbV9jb3B5ID0gYXNzdW1wdGlvbnMuY29weSgpO1xuXG4gICAgICAgIC8vIHN0cmljdCBjb21tdXRhdGl2aXR5XG4gICAgICAgIGNvbnN0IGlzX2NvbW11dGF0aXZlID0gZnV6enlfYm9vbF92Mihhc3N1bXB0aW9ucy5nZXQoXCJjb21tdXRhdGl2ZVwiLCB0cnVlKSk7XG4gICAgICAgIGFzc3VtcHRpb25zLmFkZChcImlzX2NvbW11dGF0aXZlXCIsIGlzX2NvbW11dGF0aXZlKTtcblxuICAgICAgICAvLyBNZXJnZSB3aXRoIG9iamVjdCBhc3N1bXB0aW9ucyBhbmQgcmVhc3NpZ24gb2JqZWN0IHByb3BlcnRpZXNcbiAgICAgICAgdGhpcy5fYXNzdW1wdGlvbnMubWVyZ2UoYXNzdW1wdGlvbnMpO1xuICAgICAgICB0aGlzLl9hc3N1bXB0aW9ucy5fZ2VuZXJhdG9yID0gdG1wX2FzbV9jb3B5O1xuICAgICAgICBzdXBlci5hc3NpZ25Qcm9wcygpO1xuICAgIH1cblxuICAgIGVxdWFscyhvdGhlcjogU3ltYm9sKSB7XG4gICAgICAgIGlmICh0aGlzLm5hbWUgPSBvdGhlci5uYW1lKSB7XG4gICAgICAgICAgICBpZiAodGhpcy5fYXNzdW1wdGlvbnMuaXNTYW1lKG90aGVyLl9hc3N1bXB0aW9ucykpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuXG4gICAgc3RhdGljIF9zYW5pdGl6ZShhc3N1bXB0aW9uczogSGFzaERpY3QgPSBuZXcgSGFzaERpY3QoKSkge1xuICAgICAgICAvLyByZW1vdmUgbm9uZSwgY29udmVydCB2YWx1ZXMgdG8gYm9vbCwgY2hlY2sgY29tbXV0YXRpdml0eSAqaW4gcGxhY2UqXG5cbiAgICAgICAgLy8gYmUgc3RyaWN0IGFib3V0IGNvbW11dGF0aXZpdHk6IGNhbm5vdCBiZSB1bmRlZmluZWRcbiAgICAgICAgY29uc3QgaXNfY29tbXV0YXRpdmUgPSBmdXp6eV9ib29sX3YyKGFzc3VtcHRpb25zLmdldChcImNvbW11dGF0aXZlXCIsIHRydWUpKTtcbiAgICAgICAgaWYgKHR5cGVvZiBpc19jb21tdXRhdGl2ZSA9PT0gXCJ1bmRlZmluZWRcIikge1xuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiY29tbXV0YXRpdml0eSBtdXN0IGJlIHRydWUgb3IgZmFsc2VcIik7XG4gICAgICAgIH1cbiAgICAgICAgZm9yIChjb25zdCBrZXkgb2YgYXNzdW1wdGlvbnMua2V5cygpKSB7XG4gICAgICAgICAgICBjb25zdCB2ID0gYXNzdW1wdGlvbnMuZ2V0KGtleSk7XG4gICAgICAgICAgICBpZiAodHlwZW9mIHYgPT09IFwidW5kZWZpbmVkXCIpIHtcbiAgICAgICAgICAgICAgICBhc3N1bXB0aW9ucy5kZWxldGUoa2V5KTtcbiAgICAgICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGFzc3VtcHRpb25zLmFkZChrZXksIHYgYXMgYm9vbGVhbik7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICB0b1N0cmluZygpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMubmFtZTtcbiAgICB9XG59XG5cbi8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBuZXctY2FwXG5NYW5hZ2VkUHJvcGVydGllcy5yZWdpc3RlcihTeW1ib2wpO1xuXG5leHBvcnQge1N5bWJvbH07XG4iLCAiaW1wb3J0IHtmYWN0b3JpbnQsIGZhY3RvcnJhdH0gZnJvbSBcIi4vbnRoZW9yeS9mYWN0b3JfLmpzXCI7XG5pbXBvcnQge0FkZH0gZnJvbSBcIi4vY29yZS9hZGQuanNcIjtcbmltcG9ydCB7TXVsfSBmcm9tIFwiLi9jb3JlL211bC5qc1wiO1xuaW1wb3J0IHtfTnVtYmVyXywgSW50ZWdlcn0gZnJvbSBcIi4vY29yZS9udW1iZXJzLmpzXCI7XG5pbXBvcnQge1V0aWx9IGZyb20gXCIuL2NvcmUvdXRpbGl0eS5qc1wiO1xuaW1wb3J0IHtQb3d9IGZyb20gXCIuL2NvcmUvcG93ZXIuanNcIjtcbmltcG9ydCB7U30gZnJvbSBcIi4vY29yZS9zaW5nbGV0b24uanNcIjtcbmltcG9ydCB7U3ltYm9sfSBmcm9tIFwiLi9jb3JlL3N5bWJvbC5qc1wiO1xuXG5cbi8vIERlZmluZSBpbnRlZ2VycywgcmF0aW9uYWxzLCBmbG9hdHMsIGFuZCBzeW1ib2xzXG5jb25zdCBuID0gX051bWJlcl8ubmV3KDQpO1xuY29uc3QgbjIgPSBfTnVtYmVyXy5uZXcoNCwgOSk7XG5jb25zdCBuMyA9IF9OdW1iZXJfLm5ldygtMS41KTtcbmNvbnN0IG40ID0gX051bWJlcl8ubmV3KDEsIDMpO1xuY29uc3QgeCA9IG5ldyBTeW1ib2woXCJ4XCIpO1xuXG5cbi8vIFN1YnN0aXR1dGlvblxuXG5jb25zb2xlLmxvZyhuZXcgUG93KG4sIHgpLnN1YnMoeCwgbjQpLnRvU3RyaW5nKCkpO1xuY29uc29sZS5sb2cobmV3IE11bChmYWxzZSwgdHJ1ZSwgbiwgbjIsIHgpLnN1YnMoeCwgbjIpLnRvU3RyaW5nKCkpO1xuY29uc29sZS5sb2cobmV3IEFkZChmYWxzZSwgdHJ1ZSwgbiwgbjIsIHgpLnN1YnMoeCwgbikudG9TdHJpbmcoKSk7XG5cblxuXG4vKlxuLy8gLy8gU3Vic3RpdHV0aW9uXG5cbi8vIGNvbnNvbGUubG9nKG5ldyBQb3cobiwgeCkuc3Vicyh4LCBuNCkudG9TdHJpbmcoKSk7XG4vLyBjb25zb2xlLmxvZyhuZXcgTXVsKGZhbHNlLCB0cnVlLCBuLCBuMiwgeCkuc3Vicyh4LCBuMikudG9TdHJpbmcoKSk7XG4vLyBjb25zb2xlLmxvZyhuZXcgQWRkKGZhbHNlLCB0cnVlLCBuLCBuMiwgeCkuc3Vicyh4LCBuKS50b1N0cmluZygpKTtcblxuLy8gLy8gRmFjdG9yaW5nXG5cbi8vIC8vIEZhY3RvciBhIGJpZyBpbnRlZ2VyXG4vLyBjb25zdCBiaWdpbnQgPSBfTnVtYmVyXy5uZXcoMjg1KTtcbi8vIGNvbnNvbGUubG9nKGZhY3RvcmludChiaWdpbnQpKTtcbi8vIC8vIEZhY3RvciBhIGNvbXBsaWNhdGVkIHJhdGlvbmFsXG4vLyBjb25zdCBiaWdyYXQgPSBfTnVtYmVyXy5uZXcoMjcxLCA5MzIpO1xuLy8gY29uc29sZS5sb2coZmFjdG9ycmF0KGJpZ3JhdCkpO1xuXG4vLyBUZXN0aW5nIHdlaXJkIGlucHV0c1xuXG4vLyBOT1RFOiBQb3cobiwgUy5OZWdhdGl2ZUluZmluaXR5KSBpcyBub3QgY3VycmVudGx5IHN1cHBvcnRlZCAtIF9ldmFsX3Bvd2VyIG5lZWRzXG4vLyB0byBiZSBhZGRlZCBhbmQgZGVidWdnZWQgZm9yIFMuSW5maW5pdHksIFMuTmVnYXRpdmVJbmZpbml0eSwgYW5kIFMuTmVnYXRpdmVPbmVcblxuY29uc29sZS5sb2cobmV3IE11bCh0cnVlLCB0cnVlLCBTLkNvbXBsZXhJbmZpbml0eSwgUy5OZWdhdGl2ZUluZmluaXR5LCB4KS50b1N0cmluZygpKTtcbmNvbnNvbGUubG9nKG5ldyBNdWwodHJ1ZSwgdHJ1ZSwgUy5JbmZpbml0eSwgbjIsIHgpLnRvU3RyaW5nKCkpOyBcbmNvbnNvbGUubG9nKG5ldyBBZGQodHJ1ZSwgdHJ1ZSwgUy5JbmZpbml0eSwgbjIsIHgpLnRvU3RyaW5nKCkpOyBcbmNvbnNvbGUubG9nKG5ldyBBZGQodHJ1ZSwgdHJ1ZSwgUy5Db21wbGV4SW5maW5pdHksIG4zLCB4KS50b1N0cmluZygpKTsgLy8gRE9FU05UIFdPUktcbmNvbnNvbGUubG9nKG5ldyBQb3cobiwgUy5OYU4pLnRvU3RyaW5nKCkpO1xuKi9cbiJdLAogICJtYXBwaW5ncyI6ICI7O0FBTUEsTUFBTSxPQUFOLE1BQVc7QUFBQSxJQUdQLE9BQU8sUUFBUUEsSUFBZ0I7QUFDM0IsVUFBSSxPQUFPQSxPQUFNLGFBQWE7QUFDMUIsZUFBTztBQUFBLE1BQ1g7QUFDQSxVQUFJQSxHQUFFLFNBQVM7QUFDWCxlQUFPQSxHQUFFLFFBQVE7QUFBQSxNQUNyQjtBQUNBLFVBQUksTUFBTSxRQUFRQSxFQUFDLEdBQUc7QUFDbEIsZUFBT0EsR0FBRSxJQUFJLENBQUMsTUFBTSxLQUFLLFFBQVEsQ0FBQyxDQUFDLEVBQUUsS0FBSyxHQUFHO0FBQUEsTUFDakQ7QUFDQSxVQUFJQSxPQUFNLE1BQU07QUFDWixlQUFPO0FBQUEsTUFDWDtBQUNBLGFBQU9BLEdBQUUsU0FBUztBQUFBLElBQ3RCO0FBQUEsSUFHQSxPQUFPLFNBQVMsTUFBYSxNQUFzQjtBQUMvQyxpQkFBVyxLQUFLLE1BQU07QUFDbEIsWUFBSSxDQUFFLEtBQUssU0FBUyxDQUFDLEdBQUk7QUFDckIsaUJBQU87QUFBQSxRQUNYO0FBQUEsTUFDSjtBQUNBLGFBQU87QUFBQSxJQUNYO0FBQUEsSUFJQSxPQUFPLElBQUksS0FBYTtBQUNwQixjQUFRLFFBQVEsR0FBRyxTQUFTLENBQUM7QUFBQSxJQUNqQztBQUFBLElBRUEsUUFBUSxRQUFRLFNBQWlCLE1BQU0sTUFBYTtBQUNoRCxZ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U0FBUyxJQUFJLEdBQUcsQ0FBQztBQUM1QixNQUFNLEtBQUssU0FBUyxJQUFJLElBQUk7QUFDNUIsTUFBTSxLQUFLLFNBQVMsSUFBSSxHQUFHLENBQUM7QUFDNUIsTUFBTSxJQUFJLElBQUlDLFFBQU8sR0FBRztBQUt4QixVQUFRLElBQUksSUFBSSxJQUFJLEdBQUcsQ0FBQyxFQUFFLEtBQUssR0FBRyxFQUFFLEVBQUUsU0FBUyxDQUFDO0FBQ2hELFVBQVEsSUFBSSxJQUFJLElBQUksT0FBTyxNQUFNLEdBQUcsSUFBSSxDQUFDLEVBQUUsS0FBSyxHQUFHLEVBQUUsRUFBRSxTQUFTLENBQUM7QUFDakUsVUFBUSxJQUFJLElBQUksSUFBSSxPQUFPLE1BQU0sR0FBRyxJQUFJLENBQUMsRUFBRSxLQUFLLEdBQUcsQ0FBQyxFQUFFLFNBQVMsQ0FBQzsiLAogICJuYW1lcyI6IFsieCIsICJuIiwgIngiLCAieCIsICJpbXBsIiwgIml0ZW0iLCAiUCIsICJzZWxmIiwgIm4yIiwgImJhc2UiLCAic2VsZiIsICJuMiIsICJvbGQiLCAiX25ldyIsICJydiIsICJuIiwgIm1vZCIsICJFcnJvciIsICJjc2V0IiwgIngiLCAibiIsICJfQXRvbWljRXhwciIsICJvYmoiLCAieCIsICJtaW4iLCAibWF4IiwgIm4iLCAiYmFzZSIsICJzaWduIiwgInBvdyIsICJzdW0iLCAieDIiLCAiRGVjaW1hbCIsICJpIiwgIngiLCAibiIsICJfQXRvbWljRXhwciIsICJ4IiwgInJlc3VsdCIsICJOYU4iLCAiX0F0b21pY0V4cHIiLCAibiIsICJ0IiwgIkVycm9yIiwgImJhc2UiLCAiZXhwIiwgImQiLCAiZmFjdG9ycyIsICJyIiwgImNfcG93ZXJzIiwgImkiLCAibiIsICJjX3BhcnQiLCAiY29lZmZfc2lnbiIsICJzaWduIiwgIkJvb2xlYW4iLCAiQm9vbGVhbiIsICJTeW1ib2wiLCAiU3ltYm9sIl0KfQo=
