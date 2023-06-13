class Util {
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
            if (!(arr2.includes(e))) {
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
                    }
                    else {
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
    static *permutations(iterable, r = undefined) {
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
            if (Util.arrEq(indices.sort(function (a, b) {
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
            if (Util.arrEq(indices.sort(function (a, b) {
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
        const res = arr1.map(function (e, i) {
            return [e, arr2[i]];
        });
        res.forEach((zip) => {
            if (zip.includes(undefined)) {
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
        return undefined;
    }
    static getSupers(obj) {
        const res = [];
        let s = Object.getPrototypeOf(Object.getPrototypeOf(obj));
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
}
class HashSet {
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
        return this.toArray()
            .map((e) => Util.hashKey(e))
            .sort()
            .join(",");
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
    sort(keyfunc = ((a, b) => a - b), reverse = true) {
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
        }
        else {
            return undefined;
        }
    }
    difference(other) {
        const res = new HashSet();
        for (const i of this.toArray()) {
            if (!(other.has(i))) {
                res.add(i);
            }
        }
        return res;
    }
}
class HashDict {
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
        }
        else {
            this.add(key, value);
            return this.get(key);
        }
    }
    get(key, def = undefined) {
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
            if (!(Util.arrEq(arr1[i], arr2[i]))) {
                return false;
            }
        }
        return true;
    }
}
class SetDefaultDict extends HashDict {
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
}
class IntDefaultDict extends HashDict {
    constructor() {
        super();
    }
    increment(key, val) {
        const keyHash = Util.hashKey(key);
        if (keyHash in this.dict) {
            this.dict[keyHash] += val;
        }
        else {
            this.dict[keyHash] = 0;
            this.dict[keyHash] += val;
        }
    }
}
class ArrDefaultDict extends HashDict {
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
}
class Implication {
    constructor(p, q) {
        this.p = p;
        this.q = q;
    }
    hashKey() {
        return this.p + this.q;
    }
}
class LRUCache {
    constructor(capacity) {
        this.capacity = capacity;
        this.map = new HashDict();
        this.head = {};
        this.tail = {};
        this.head.next = this.head;
        this.tail.prev = this.head;
    }
    get(key) {
        if (this.map.has(key)) {
            const c = this.map.get(key);
            c.prev.next = c.next;
            c.next.prev = c.prev;
            this.tail.prev.next = c;
            c.prev = this.tail.prev;
            c.next = this.tail;
            this.tail.prev = c;
            return c.value;
        }
        else {
            return undefined;
        }
    }
    put(key, value) {
        if (typeof this.get(key) !== "undefined") {
            this.tail.prev.value = value;
        }
        else {
            if (this.map.size === this.capacity) {
                this.map.delete(this.head.next.key);
                this.head.next = this.head.next.next;
                this.head.next.prev = this.head;
            }
        }
        const newNode = {
            value,
            key,
            prev: null,
            next: null,
        };
        this.map.add(key, newNode);
        this.tail.prev.next = newNode;
        newNode.prev = this.tail.prev;
        newNode.next = this.tail;
        this.tail.prev = newNode;
    }
}
class Iterator {
    constructor(arr) {
        this.arr = arr;
        this.counter = 0;
    }
    next() {
        if (this.counter >= this.arr.length) {
            return undefined;
        }
        this.counter++;
        return this.arr[this.counter - 1];
    }
}
class MixinBuilder {
    constructor(superclass) {
        this.superclass = superclass;
    }
    with(...mixins) {
        return mixins.reduce((c, mixin) => mixin(c), this.superclass);
    }
}
class base {
}
const mix = (superclass) => new MixinBuilder(superclass);
export { Util, HashSet, SetDefaultDict, HashDict, Implication, LRUCache, Iterator, IntDefaultDict, ArrDefaultDict, mix, base };
//# sourceMappingURL=utility.js.map