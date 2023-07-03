/*
A file with utility classes and functions to help with porting
Developd by WB and GM
*/

// general util functions
class Util {
    // hashkey function
    // should be able to handle multiple types of inputs
    static hashKey(x: any): string {
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

    // check if arr1 is a subset of arr2
    static isSubset(arr1: any[], arr2: any[]): boolean {
        const temparr = arr2.map((i: any) => Util.hashKey(i))
        for (const e of arr1) {
            if (!temparr.includes(Util.hashKey(e))) {
                return false;
            }
        }
        return true;
    }

    // convert an integer to binary
    // functional for negative numbers
    static bin(num: number) {
        return (num >>> 0).toString(2);
    }

    static* product(repeat: number = 1, ...args: any[]) {
        const toAdd: any[] = [];
        for (const a of args) {
            toAdd.push([a]);
        }
        const pools: any[] = [];
        for (let i = 0; i < repeat; i++) {
            toAdd.forEach((e: any) => pools.push(e[0]));
        }
        let res: any[][] = [[]];
        for (const pool of pools) {
            const res_temp: any[] = [];
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

    static* permutations(iterable: any, r: any = undefined) {
        const n = iterable.length;
        if (typeof r === "undefined") {
            r = n;
        }
        const range = this.range(n);
        for (const indices of Util.product(r, range)) {
            if (indices.length === r) {
                const y: any[] = [];
                for (const i of indices) {
                    y.push(iterable[i]);
                }
                yield y;
            }
        }
    }

    static* from_iterable(iterables: any) {
        for (const it of iterables) {
            for (const element of it) {
                yield element;
            }
        }
    }

    static arrEq(arr1: any[], arr2: any) {
        if (arr1.length !== arr2.length) {
            return false;
        }
        for (let i = 0; i < arr1.length; i++) {
            if (!(arr1[i] === arr2[i])) {
                if (arr1[i].__eq__) {
                    if (!arr1[i].__eq__(arr2[i])) {
                        return false;
                    }
                }
                return false;
            }
        }
        return true;
    }

    static* combinations(iterable: any, r: any) {
        const n = iterable.length;
        const range = this.range(n);
        for (const indices of Util.permutations(range, r)) {
            if (Util.arrEq(indices.sort(function(a, b) {
                return a - b;
            }), indices)) {
                const res: any[] = [];
                for (const i of indices) {
                    res.push(iterable[i]);
                }
                yield res;
            }
        }
    }

    static* combinations_with_replacement(iterable: any, r: any) {
        const n = iterable.length;
        const range = this.range(n);
        for (const indices of Util.product(r, range)) {
            if (Util.arrEq(indices.sort(function(a, b) {
                return a - b;
            }), indices)) {
                const res: any[] = [];
                for (const i of indices) {
                    res.push(iterable[i]);
                }
                yield res;
            }
        }
    }

    static zip(arr1: any[], arr2: any[], fillvalue: string = "-") {
        const res = arr1.map(function(e, i) {
            return [e, arr2[i]];
        });
        res.forEach((zip: any) => {
            if (zip.includes(undefined)) {
                zip.splice(1, 1, fillvalue);
            }
        });
        return res;
    }

    static range(n: number) {
        return new Array(n).fill(0).map((_, idx) => idx);
    }

    static getArrIndex(arr2d: any[][], arr: any[]) {
        for (let i = 0; i < arr2d.length; i++) {
            if (Util.arrEq(arr2d[i], arr)) {
                return i;
            }
        }
        return undefined;
    }

    static getSupers(cls: any): any[] {
        const sprs = [];
        const supercls = Object.getPrototypeOf(cls);
      
        if ( supercls !== Object.prototype && supercls !== null) {
            sprs.push(supercls);
            const parents = Util.getSupers(supercls);
            sprs.push(...parents);
        }
      
        return sprs;
    }

    static shuffleArray(arr: any[]) {
        for (let i = arr.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            const temp = arr[i];
            arr[i] = arr[j];
            arr[j] = temp;
        }
    }

    static arrMul(arr: any[], n: number) {
        const res = [];
        for (let i = 0; i < n; i++) {
            res.push(arr);
        }
        return res;
    }

    static assignElements(arr: any[], newvals: any[], start: number, step: number) {
        let count = 0;
        for (let i = start; i < arr.length; i+=step) {
            arr[i] = newvals[count];
            count++;
        }
    }

    static splitLogicStr(s:string): any[] {
        const match = s.match(/^(.+?)\s+(.+?)\s+(.*)/);
        return match?.slice(1);
    }

    static abs(val: any) {
        if (val._float_val) {
            return Math.abs(val._float_val())
        } else {
            throw new Error("abs not supported for this object type")
        }
    }
}

// custom version of the Set class
// needed since sympy relies on item tuples with equal contents being mapped
// to the same entry
class HashSet {
    dict: Record<string, any>;
    size: number;
    sortedArr: any[];

    constructor(arr?: any[]) {
        this.size = 0;
        this.dict = {};
        if (arr) {
            Array.from(arr).forEach((element) => {
                this.add(element);
            });
        }
    }

    clone(): HashSet {
        const newset: HashSet = new HashSet();
        for (const item of Object.values(this.dict)) {
            newset.add(item);
        }
        return newset;
    }

    encode(item: any): string {
        return Util.hashKey(item);
    }

    add(item: any) {
        const key = this.encode(item);
        if (!(key in this.dict)) {
            this.size++;
        };
        this.dict[key] = item;
    }

    addArr(arr: any[]) {
        for (const e of arr) {
            this.add(e);
        }
    }

    has(item: any) {
        return this.encode(item) in this.dict;
    }

    toArray() {
        return Object.values(this.dict);
    }

    // get the hashkey for this set (e.g., in a dictionary)
    hashKey() {
        return this.toArray()
            .map((e) => Util.hashKey(e))
            .sort()
            .join(",");
    }

    isEmpty() {
        return this.size === 0;
    }

    remove(item: any) {
        this.size--;
        delete this.dict[this.encode(item)];
    }

    get(key: any) {
        return this.dict[Util.hashKey(key)];
    }

    set(key: any, val: any) {
        this.dict[Util.hashKey(key)] = val;
    }

    sort(keyfunc: any = ((a: any, b: any) => a - b), reverse: boolean = true) {
        this.sortedArr = this.toArray();
        this.sortedArr.sort(keyfunc);
        if (reverse) {
            this.sortedArr.reverse();
        }
    }

    pop() {
        this.sort(); // !!! slow but I don't see a work around
        if (this.sortedArr.length >= 1) {
            const temp = this.sortedArr[this.sortedArr.length - 1];
            this.remove(temp);
            return temp;
        } else {
            return undefined;
        }
    }

    difference(other: HashSet) {
        const res = new HashSet();
        for (const i of this.toArray()) {
            if (!(other.has(i))) {
                res.add(i);
            }
        }
        return res;
    }

    intersects(other: HashSet) {
        for (const i of this.toArray()) {
            if (other.has(i)) {
                return true;
            }
        }
        return false;
    }
}

// a hashdict class replacing the dict class in python
class HashDict {
    size: number;
    dict: Record<any, any>;

    constructor(d: Record<any, any> = {}) {
        this.size = 0;
        this.dict = {};
        for (const item of Object.entries(d)) {
            this.dict[Util.hashKey(item[0])] = [item[0], item[1]];
        }
    }

    clone() {
        return new HashDict(this.dict);
    }

    remove(item: any) {
        this.size--;
        delete this.dict[Util.hashKey(item)];
    }

    setdefault(key: any, value: any) {
        if (this.has(key)) {
            return this.get(key);
        } else {
            this.add(key, value);
            return this.get(key);
        }
    }

    get(key: any, def: any = undefined): any {
        const hash = Util.hashKey(key);
        if (hash in this.dict) {
            return this.dict[hash][1];
        }
        return def;
    }

    has(key: any): boolean {
        const hashKey = Util.hashKey(key);
        return hashKey in this.dict;
    }

    add(key: any, value: any) {
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

    addArr(arr: any[]) {
        const keyHash = Util.hashKey(arr[0]);
        this.dict[keyHash] = arr;
    }

    delete(key: any) {
        const keyhash = Util.hashKey(key);
        if (keyhash in this.dict) {
            this.size--;
            delete this.dict[keyhash];
        }
    }

    merge(other: HashDict) {
        for (const item of other.entries()) {
            this.add(item[0], item[1]);
        }
    }

    copy() {
        const res: HashDict = new HashDict();
        for (const item of this.entries()) {
            res.add(item[0], item[1]);
        }
        return res;
    }

    isSame(other: HashDict) {
        const arr1 = this.entries().sort();
        const arr2 = other.entries().sort();
        for (let i = 0; i < arr1.length; i++) {
            if (!(Util.arrEq(arr1[i], arr2[i]))) {
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
                    denominator += (factor.toString() + "*")
                } else {
                    numerator += (factor.toString() + "*")
                }
            }
        }
        if (denominator.length == 0) {
            return numerator.slice(0, -1);
        } else {
            return numerator.slice(0, -1) + "/" + denominator.slice(0, -1);
        }
    }
}


// sympy often uses defaultdict(set) which is not available in ts
// we create a replacement dictionary class which returns an empty set
// if the key used is not in the dictionary
class SetDefaultDict extends HashDict {
    constructor() {
        super();
    }

    get(key: any) {
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

    increment(key: any, val: any) {
        const keyHash = Util.hashKey(key);
        if (keyHash in this.dict) {
            this.dict[keyHash] += val;
        } else {
            this.dict[keyHash] = 0;
            this.dict[keyHash] += val;
        }
    }
}

class ArrDefaultDict extends HashDict {
    constructor() {
        super();
    }

    get(key: any) {
        const keyHash = Util.hashKey(key);
        if (keyHash in this.dict) {
            return this.dict[keyHash][1];
        }
        return [];
    }
}


// an implication class used as an alternative to tuples in sympy
class Implication {
    p;
    q;

    constructor(p: any, q: any) {
        this.p = p;
        this.q = q;
    }

    hashKey() {
        return (this.p as string) + (this.q as string);
    }
}


// an LRU cache implementation used for cache.ts

interface Node {
    key: any;
    value: any;
    prev: any;
    next: any;
}

class LRUCache {
    capacity: number;
    map: HashDict;
    head: any;
    tail: any;

    constructor(capacity: number) {
        this.capacity = capacity;
        this.map = new HashDict();

        // these are boundaries for the double linked list
        this.head = {};
        this.tail = {};

        this.head.next = this.head;
        this.tail.prev = this.head;
    }

    get(key: any) {
        if (this.map.has(key)) {
            // remove element from the current position
            const c = this.map.get(key);
            c.prev.next = c.next;
            c.next.prev = c.prev;

            this.tail.prev.next = c; // insert after last element
            c.prev = this.tail.prev;
            c.next = this.tail;
            this.tail.prev = c;

            return c.value;
        } else {
            return undefined; // invalid key
        }
    }

    put(key: any, value: any) {
        if (typeof this.get(key) !== "undefined") { // the key is invalid
            this.tail.prev.value = value;
        } else {
            // check for capacity
            if (this.map.size === this.capacity) {
                this.map.delete(this.head.next.key); // delete first element
                this.head.next = this.head.next.next; // replace with next
                this.head.next.prev = this.head;
            }
        }
        const newNode: Node = {
            value,
            key,
            prev: null,
            next: null,
        }; // each node is a hash entry

        // when adding a new node, we need to update both map and DLL
        this.map.add(key, newNode); // add the current node
        this.tail.prev.next = newNode; // add node to the end
        newNode.prev = this.tail.prev;
        newNode.next = this.tail;
        this.tail.prev = newNode;
    }
}

class Iterator {
    arr: any[];
    counter;

    constructor(arr: any[]) {
        this.arr = arr;
        this.counter = 0;
    }

    next() {
        if (this.counter >= this.arr.length) {
            return undefined;
        }
        this.counter++;
        return this.arr[this.counter-1];
    }
}

// mixin class used to replicate multiple inheritance

class MixinBuilder {
    superclass;
    constructor(superclass: any) {
        this.superclass = superclass;
    }
    with(...mixins: any[]) {
        return mixins.reduce((c, mixin) => mixin(c), this.superclass);
    }
}

class base {}

const mix = (superclass: any) => new MixinBuilder(superclass);


export {Util, HashSet, SetDefaultDict, HashDict, Implication, LRUCache, Iterator, IntDefaultDict, ArrDefaultDict, mix, base};

