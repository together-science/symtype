import { HashSet } from "./utility.js";
const ordering_of_classes = {
    Zero: 0, One: 1, Half: 2, Infinity: 3, NaN: 4, NegativeOne: 5, NegativeInfinity: 6,
    Integer: 7, Rational: 8, Float: 9,
    Exp1: 10, Pi: 11, ImaginaryUnit: 12,
    Symbol: 13, Wild: 14, Temporary: 15,
    Pow: 16, Mul: 17, Add: 18,
    Derivative: 19, Integral: 20,
    Abs: 21, Sign: 22, Sqrt: 23, Floor: 24, Ceiling: 25, Re: 26, Im: 27,
    Arg: 28, Conjugate: 29, Exp: 30, Log: 31, Sin: 32, Cos: 33, Tan: 34,
    Cot: 35, ASin: 36, ACos: 37, ATan: 38, ACot: 39, Sinh: 40, Cosh: 41,
    Tanh: 42, ASinh: 43, ACosh: 44, ATanh: 45, ACoth: 46,
    RisingFactorial: 47, FallingFactorial: 48, factorial: 49, binomial: 50,
    Gamma: 51, LowerGamma: 52, UpperGama: 53, PolyGamma: 54, Erf: 55,
    Chebyshev: 56, Chebyshev2: 57,
    Function: 58, WildFunction: 59,
    Lambda: 60,
    Order: 61,
    Equallity: 62, Unequality: 63, StrictGreaterThan: 64, StrictLessThan: 65,
    GreaterThan: 66, LessThan: 66,
};
class Registry {
    addAttr(name, obj) {
        Registry.dict[name] = obj;
    }
    delAttr(name) {
        delete Registry.dict[name];
    }
}
const all_classes = new HashSet();
class BasicMeta {
    static register(cls) {
        all_classes.add(cls);
        cls.__sympy__ = true;
    }
    static compare(self, other) {
        if (!(other instanceof BasicMeta)) {
            return -1;
        }
        const n1 = self.constructor.name;
        const n2 = other.constructor.name;
        if (ordering_of_classes.has(n1) && ordering_of_classes.has(n2)) {
            const idx1 = ordering_of_classes[n1];
            const idx2 = ordering_of_classes[n2];
            return Math.sign(idx1 - idx2);
        }
        if (n1 > n2) {
            return 1;
        }
        else if (n1 === n2) {
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
}
export { BasicMeta, Registry };
//# sourceMappingURL=core.js.map