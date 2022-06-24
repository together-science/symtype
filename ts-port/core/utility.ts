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
    dict: Record<string, any>
    constructor(arr?: any[]) {
        this.dict = {};
        if (arr) {
            arr.forEach(element => {
                this.add(element);
            });
        }
    }

    encode(item: any): string {
        return Util.hashKey(item);
    }

    add(item: any) {
        this.dict[this.encode(item)] = item;
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

}

// sympy often uses defaultdict(set) which is not available in ts
// we create a replacement dictionary class which returns an empty set
// if the key used is not in the dictionary
class SetDefaultDict {
    dict: Record<any, any>;

    constructor() {
        this.dict = {};
    }

    get(key: any) {
        let keyHash = Util.hashKey(key);
        if (keyHash in this.dict) {
            return this.dict[keyHash];
        } 
        return new HashSet();
        /*
        other way to write this:

        let res = this.dict[key];
        if (typeof res === "undefined") {
            return SetDefaultDict.emptySet;
        }
        return res;
        */
    }

    has(key: any): boolean {
        return Util.hashKey(key) in this.dict;
    }

    add(key: any, value: any) {
        let keyHash = Util.hashKey(value);
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

}

export { Util, HashSet, SetDefaultDict };