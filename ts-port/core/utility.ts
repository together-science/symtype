/*
A file with utility classes and functions to help with porting
Developd by WB and GM
*/

// general util functions
class Util {
    // hashkey function 
    // should be able to handle multiple types of inputs
    static hashKey(x: any): string {
        if (Array.isArray(x)) {
            return x.map((e) => Util.hashKey(e)).join(',');
        }
        if (x === null) {
            return "null";
        }
        if (x.hashKey) {
            return x.hashKey();
        }
        return x.toString();
    }

    // check if arr1 is a subset of arr2
    static isSubset(arr1: any[], arr2: any[]): boolean {

        for (let e of arr1) {
            if (!(arr2.includes(e))) {
                return false;
            }
        }
        return true;
    }
}



// custom version of the Set class
// needed since sympy relies on item tuples with equal contents being mapped
// to the same entry
class HashSet {
    dict: Record<string, any>;
    size: number;
    constructor(arr?: any[]) {
        this.size = 0;
        this.dict = {};
        if (arr) {
            Array.from(arr).forEach(element => {
                this.add(element);
            });
        }
    }

    clone(): HashSet {
        let newset: HashSet = new HashSet();
        for (let item of this.dict.entries()) {
            newset.add(item);
        }
        return newset;
    }

    encode(item: any): string {
        return Util.hashKey(item);
    }

    add(item: any) {
        let key = this.encode(item);
        if (!(key in this.dict)) {
            this.size++;
        };
        this.dict[key] = item;

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
            .join(',');
    }

    isEmpty() {
        return this.size === 0;
    }

    remove(item: any) {
        delete this.dict[this.encode(item)];
    }

    get(key: any) {
        return this.dict[Util.hashKey(key)];
    }

    set(key: any, val: any) {
        this.dict[Util.hashKey(key)] = val;
    }

}

// a hashdict class replacing the dict class in python
class HashDict {
    size: number;
    dict: Record<any, any>;

    constructor() {
        this.size = 0;
        this.dict = {};
    }

    get(key: any): any {
        let hash = Util.hashKey(key);
        return this.dict[hash][1];
    }

    has(key: any): boolean {
        let hashKey = Util.hashKey(key);
        return hashKey in this.dict;
    }

    add(key: any, value: any) {
        let keyHash = Util.hashKey(key);
        if (!(keyHash in Object.keys(this.dict))) {
            this.size++;
        } 
        this.dict[keyHash] = [key, value];
    }

    keys() {
        let vals = Object.values(this.dict);
        return vals.map((e) => e[0]);
    }

    values() {
        let vals = Object.values(this.dict);
        return vals.map((e) => e[1]);
    }

    entries() {
        return Object.values(this.dict);
    }
    
    addArr(arr: any[]) {
        let keyHash = Util.hashKey(arr[0]);
        this.dict[keyHash] = arr;
    }

    delete(key: any) {
        let keyhash = Util.hashKey(key);
        if (keyhash in this.dict) {
            this.size--;
            delete this.dict[keyhash];
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
        let keyHash = Util.hashKey(key);
        if (keyHash in this.dict) {
            return this.dict[keyHash][1];
        } 
        return new HashSet();
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
            let c = this.map.get(key);
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
        let newNode: Node = {
            value, 
            key,
            prev : null,
            next : null,
        }; // each node is a hash entry

        // when adding a new node, we need to update both map and DLL
        this.map.add(key, newNode); // add the current node
        this.tail.prev.next = newNode; // add node to the end
        newNode.prev = this.tail.prev; 
        newNode.next = this.tail; 
        this.tail.prev = newNode;
    }
}

export { Util, HashSet, SetDefaultDict, HashDict, Implication, LRUCache };

