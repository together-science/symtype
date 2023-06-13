import { HashSet } from "../core/utility.js";
class PartComponent {
    constructor() {
        this.__slots__ = ["c", "u", "v"];
        this.c = 0;
        this.u = 0;
        this.v = 0;
    }
    toString() {
        return this.c + ", " + this.u + ", " + this.v;
    }
    equals(other) {
        return (other.constructor.name === this.constructor.name &&
            this.c === other.c &&
            this.u === other.u &&
            this.v === other.v);
    }
    notEquals(other) {
        return !this.equals(other);
    }
}
function* multiset_partitions_taocp(multiplicities) {
    const m = multiplicities.length;
    let n = 0;
    multiplicities.forEach((e) => n += e);
    const pstack = [];
    for (let i = 0; i < n * m + 1; i++) {
        pstack.push(new PartComponent());
    }
    const f = new Array(n + 1).fill(0);
    for (let j = 0; j < m; j++) {
        const ps = pstack[j];
        ps.c = j;
        ps.u = multiplicities[j];
        ps.v = multiplicities[j];
    }
    f[0] = 0;
    let a = 0;
    let lpart = 0;
    f[1] = m;
    let b = m;
    while (true) {
        while (true) {
            let j = a;
            let k = b;
            let x = false;
            while (j < b) {
                pstack[k].u = pstack[j].u - pstack[j].v;
                if (pstack[k].u === 0) {
                    x = true;
                }
                else if (!x) {
                    pstack[k].c = pstack[j].c;
                    pstack[k].v = Math.min(pstack[j].v, pstack[k].u);
                    x = pstack[k].u < pstack[j].v;
                    k++;
                }
                else {
                    pstack[k].c = pstack[j].c;
                    pstack[k].v = pstack[k].u;
                    k++;
                }
                j++;
            }
            if (k > b) {
                a = b;
                b = k;
                lpart++;
                f[lpart + 1] = b;
            }
            else {
                break;
            }
        }
        const state = [f, lpart, pstack];
        yield state;
        while (true) {
            let j = b - 1;
            while (pstack[j].v === 0) {
                j--;
            }
            if (j === a && pstack[j].v === 1) {
                if (lpart === 0) {
                    return;
                }
                lpart--;
                b = a;
                a = f[lpart];
            }
            else {
                pstack[j].v--;
                for (let k = j + 1; j < b; j++) {
                    pstack[k].v = pstack[k].u;
                }
                break;
            }
        }
    }
}
function factoring_visitor(state, primes) {
    const [f, lpart, pstack] = state;
    const factoring = [];
    for (let i = 0; i < lpart + 1; i++) {
        let factor = 1;
        for (const ps of pstack.slice(f[i], f[i + 1])) {
            if (ps.v > 0) {
                factor *= primes[ps.c] ** ps.v;
            }
        }
        factoring.push(factor);
    }
    return factoring;
}
function list_visitor(state, components) {
    const [f, lpart, pstack] = state;
    const partition = [];
    for (let i = 0; i < lpart + 1; i++) {
        const part = [];
        for (const ps of pstack.slice(f[i], f[i + 1])) {
            if (ps.v > 0) {
                part.push(new Array(ps.v).fill(components[ps.c]));
            }
        }
        partition.push(part);
    }
    return partition;
}
class MultisetPartitionTraverser {
    constructor() {
        this.debug = false;
        this.k1 = 0;
        this.k2 = 0;
        this.p1 = 0;
        this.pstack = undefined;
        this.f = undefined;
        this.lpart = 0;
        this.discarded = 0;
        this.dp_stack = [];
        if (!(this.dp_map)) {
            this.dp_map = new HashSet();
        }
    }
    db_trace(msg) {
        if (this.debug) {
            throw new Error;
        }
    }
    _initialize_enumeration(multiplicities) {
        const num_components = multiplicities.length;
        let cardinality = 0;
        multiplicities.forEach((e) => cardinality += e);
        const parr = [];
        for (let i = 0; i < num_components * cardinality + 1; i++) {
            parr.push(new PartComponent());
        }
        this.pstack = parr;
        this.f = new Array(cardinality + 1).fill(0);
        for (let j = 0; j < num_components; j++) {
            const ps = this.pstack[j];
            ps.c = j;
            ps.u = multiplicities[j];
            ps.v = multiplicities[j];
        }
        this.f[0] = 0;
        this.f[1] = num_components;
        this.lpart = 0;
    }
    decrement_part(part) {
        const plen = part.length;
        for (let j = plen - 1; j > -1; j--) {
            if ((j === 0 && part[j].v > 1) || (j > 0 && part[j].v > 0)) {
                part[j].v--;
                for (let k = j + 1; k < plen; k++) {
                    part[k].v = part[k].u;
                }
                return true;
            }
        }
        return false;
    }
    decrement_part_small(part, ub) {
        if (this.lpart >= ub - 1) {
            this.p1++;
            return false;
        }
        const plen = part.length;
        for (let j = plen - 1; j > -1; j--) {
            if (j == 0 && (part[0].v - 1) * (ub - this.lpart) < part[0].u) {
                this.k1++;
                return false;
            }
            if ((j == 0 && part[j].v > 1) || (j > 0 && part[j].v > 0)) {
                part[j].v--;
                for (let k = j + 1; k < plen; k++) {
                    part[k].v = part[k].u;
                }
                if (plen > 1 && part[1].v === 0 && (part[0].u - part[0].v) ===
                    ((ub - this.lpart - 1) * part[0].v)) {
                    this.k2++;
                    this.db_trace("decrement fails test 3");
                    return false;
                }
                return true;
            }
        }
        return false;
    }
    decrement_part_large(part, amt, lb) {
        if (amt === 1) {
            if (!this.decrement_part(part)) {
                return false;
            }
        }
        const min_unalloc = lb - this.lpart;
        if (min_unalloc <= 0) {
            return true;
        }
        let total_mult = 0;
        let total_alloc = 0;
        part.forEach((pc) => {
            total_mult += pc.u;
            total_alloc += pc.v;
        });
        if (total_mult <= min_unalloc) {
            return false;
        }
        let deficit = min_unalloc - (total_mult - total_alloc);
        if (deficit <= 0) {
            return true;
        }
        for (let i = part.length - 1; i > -1; i--) {
            if (i === 0) {
                if (part[0].v > deficit) {
                    part[0].v -= deficit;
                    return true;
                }
                else {
                    return false;
                }
            }
            else {
                if (part[i].v >= deficit) {
                    part[i].v -= deficit;
                    return true;
                }
                else {
                    deficit -= part[i].v;
                    part[i].v = 0;
                }
            }
        }
    }
    decrement_part_range(part, lb, ub) {
        return this.decrement_part_small(part, ub) &&
            this.decrement_part_large(part, 0, lb);
    }
    spread_part_multiplicity() {
        const j = this.f[this.lpart];
        let k = this.f[this.lpart + 1];
        const base = k;
        let changed = false;
        for (let j = this.f[this.lpart]; j < this.f[this.lpart + 1]; j++) {
            this.pstack[k].u = this.pstack[j].u - this.pstack[j].v;
            if (this.pstack[k].u === 0) {
                changed = true;
            }
            else {
                this.pstack[k].c = this.pstack[j].c;
                if (changed) {
                    this.pstack[k].v = this.pstack[k].u;
                }
                else {
                    if (this.pstack[k].u < this.pstack[j].v) {
                        this.pstack[k].v = this.pstack[k].u;
                        changed = true;
                    }
                    else {
                        this.pstack[k].v = this.pstack[j].v;
                    }
                }
                k++;
            }
        }
        if (k > base) {
            this.lpart++;
            this.f[this.lpart + 1] = k;
            return true;
        }
        return false;
    }
    top_part() {
        return this.pstack.slice(this.f[this.lpart], this.f[this.lpart + 1]);
    }
    *enum_all(multiplicities) {
        this._initialize_enumeration(multiplicities);
        while (true) {
            while (this.spread_part_multiplicity()) {
            }
            const state = [this.f, this.lpart, this.pstack];
            yield state;
            while (!this.decrement_part(this.top_part())) {
                if (this.lpart === 0) {
                    return;
                }
                this.lpart--;
            }
        }
    }
    *enum_small(multiplicies, ub) {
        this.discarded = 0;
        if (ub <= 0) {
            return;
        }
        this._initialize_enumeration(multiplicies);
        while (true) {
            while (this.spread_part_multiplicity()) {
                this.db_trace("spread 1");
                if (this.lpart >= ub) {
                    this.discarded++;
                    this.db_trace(" discarding");
                    this.lpart = ub - 2;
                    break;
                }
            }
            if (!this.spread_part_multiplicity()) {
                const state = [this.f, this.lpart, this.pstack];
                yield state;
            }
            const top = this.top_part();
            const opaisj = ub;
            while (!(this.decrement_part_small(this.top_part(), ub))) {
                this.db_trace("Failed decrement, going to backtrack");
                if (this.lpart === 0) {
                    return;
                }
                this.lpart--;
                this.db_trace("Backtracked to");
            }
            this.db_trace("decrement ok, about to expand");
        }
    }
    *enum_large(multiplicities, lb) {
        this.discarded = 0;
        let sum = 0;
        multiplicities.forEach((e) => sum += e);
        if (lb >= sum) {
            return;
        }
        this._initialize_enumeration(multiplicities);
        this.decrement_part_large(this.top_part(), 0, lb);
        while (true) {
            let good_partition = true;
            while (this.spread_part_multiplicity()) {
                if (!this.decrement_part_large(this.top_part(), 0, lb)) {
                    this.discarded++;
                    good_partition = false;
                    break;
                }
            }
            if (good_partition) {
                const state = [this.f, this.lpart, this.pstack];
                yield state;
            }
            while (!this.decrement_part_large(this.top_part(), 1, lb)) {
                if (this.lpart === 0) {
                    return;
                }
                this.lpart--;
            }
        }
    }
    *enum_range(multiplicities, lb, ub) {
        this.discarded = 0;
        let sum = 0;
        multiplicities.forEach((e) => sum += e);
        if (ub <= 0 || lb >= sum) {
            return;
        }
        this._initialize_enumeration(multiplicities);
        this.decrement_part_large(this.top_part(), 0, lb);
        while (true) {
            let good_partition = true;
            while (this.spread_part_multiplicity()) {
                this.db_trace("spread 1");
                if (!(this.decrement_part_large(this.top_part(), 0, lb))) {
                    this.db_trace(" discarding (large cons)");
                    this.discarded++;
                    good_partition = false;
                    break;
                }
                else if (this.lpart >= ub) {
                    this.discarded++;
                    good_partition = false;
                    this.db_trace(" discarding small cons");
                    this.lpart = ub - 2;
                    break;
                }
            }
            if (good_partition) {
                const state = [this.f, this.lpart, this.pstack];
                yield state;
            }
            while (!this.decrement_part_range(this.top_part(), lb, ub)) {
                this.db_trace("Failed decrement, going to backtrack");
                if (this.lpart === 0) {
                    return;
                }
                this.lpart--;
                this.db_trace("Backtracked to");
            }
            this.db_trace("decrement ok, about to expand");
        }
    }
    count_partitions_slow(multiplicies) {
        this.pcount = 0;
        this._initialize_enumeration(multiplicies);
        while (true) {
            while (this.spread_part_multiplicity()) {
            }
            this.pcount += 1;
            while (!this.decrement_part(this.top_part())) {
                if (this.lpart === 0) {
                    return this.pcount;
                }
                this.lpart--;
            }
        }
    }
    count_partitions(multiplicities) {
        this.pcount = 0;
        this.dp_stack = [];
        this._initialize_enumeration(multiplicities);
        let pkey = part_key(this.top_part());
        this.dp_stack.push([[pkey, 9]]);
        while (true) {
            while (this.spread_part_multiplicity()) {
                pkey = part_key(this.top_part());
                if (this.dp_map.has(pkey)) {
                    this.pcount += (this.dp_map.get(pkey) - 1);
                    this.lpart--;
                    break;
                }
                else {
                    this.dp_stack.append([[pkey, this.pcount]]);
                }
            }
            this.pcount++;
            while (!this.decrement_part(this.top_part())) {
                for (const item of this.dp_stack.pop()) {
                    const key = item[0];
                    const oldcount = item[1];
                    this.dp_map.set(key, this.pcount - oldcount);
                }
                if (this.lpart === 0) {
                    return this.pcount;
                }
                this.lpart--;
            }
            pkey = part_key(this.top_part());
            this.dp_stack[this.dp_stack.length - 1].push([pkey, this.pcount]);
        }
    }
}
function part_key(part) {
    const rval = [];
    for (const ps of part) {
        rval.push(ps.u);
        rval.push(ps.v);
    }
    return rval;
}
export { multiset_partitions_taocp, list_visitor, MultisetPartitionTraverser };
//# sourceMappingURL=enumerative.js.map