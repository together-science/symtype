import { ArrDefaultDict } from "../core/utility.js";
export function sift(seq, keyfunc, binary = false) {
    if (!binary) {
        const m = new ArrDefaultDict();
        for (const i of seq) {
            m.get(keyfunc(i)).push(i);
        }
        return m;
    }
    const F = [];
    const T = [];
    const sift = [F, T];
    for (const i of seq) {
        try {
            sift[keyfunc(i)].push(i);
        }
        catch (Error) {
            throw new Error("keyfunc gave non-binary output");
        }
    }
    return [T, F];
}
//# sourceMappingURL=iterables.js.map