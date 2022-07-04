/* The core's core. */

/*

Notable changes made (WB and GM)
- Replaced array of classes with dictionary for quicker index retrievals
- Implemented a constructor system for basicmeta rather than __new__ 

*/


import { HashSet } from "./utility.js"

// used for canonical ordering of symbolic sequences
// via __cmp__ method:
// FIXME this is *so* irrelevant and outdated!

let ordering_of_classes: Record<any, any> = {
    // singleton numbers
    Zero : 0, One : 1, Half : 2, Infinity : 3, NaN : 4, NegativeOne : 5, NegativeInfinity : 6,
    // numbers
    Integer: 7, Rational : 8, Float : 9,
    // singleton numbers
    Exp1 : 10, Pi : 11, ImaginaryUnit : 12,
    //symbols
    Symbol : 13, Wild : 14, Temporary : 15,
    // arithmetic operations
    Pow : 16, Mul : 17, Add : 18,
    // function values
    Derivative : 19, Integral : 20,
    // defined singleton functions
    Abs : 21, Sign : 22, Sqrt : 23, Floor : 24, Ceiling : 25, Re : 26, Im : 27,
    Arg : 28, Conjugate : 29, Exp : 30, Log : 31, Sin : 32, Cos : 33, Tan : 34,
    Cot : 35, ASin : 36, ACos : 37, ATan : 38, ACot : 39, Sinh : 40, Cosh : 41, 
    Tanh : 42, ASinh : 43, ACosh : 44, ATanh : 45, ACoth : 46, 
    RisingFactorial: 47, FallingFactorial : 48, factorial : 49, binomial : 50, 
    Gamma : 51, LowerGamma : 52, UpperGama : 53, PolyGamma : 54, Erf : 55,
    // special polynomials
    Chebyshev : 56, Chebyshev2 : 57,
    // undefined functions
    Function : 58, WildFunction : 59,
    // anonymous functions
    Lambda : 60,
    // Landau O symbol
    Order : 61,
    // relational operations
    Equallity : 62, Unequality : 63, StrictGreaterThan : 64, StrictLessThan : 65,
    GreaterThan : 66, LessThan: 66
}



class Registry {
    /*
    Base class for registry objects.
    
    Registries map a name to an object using attribute notation. Registry
    classes behave singletonically: all their instances share the same state,
    which is stored in the class object.

    All subclasses should set `__slots__ = ()`.
    */

    static dict: Record<any, any>; 

    addAttr(name: any, obj: any) {
        Registry.dict[name] = obj;
    }

    delAttr(name: any) {
        delete Registry.dict[name];
    }
}

// A set containing all SymPy class objects
let all_classes = new HashSet()

class BasicMeta { 

    __sympy__: any;

    constructor(...args: any[]) {
        all_classes.add(this.constructor.name)
        this.__sympy__ = true;
    }

    compare(other: any) {
        // If the other object is not a Basic subclass, then we are not equal to
        // it.
        if (!(other instanceof BasicMeta)) {
            return -1;
        }
        let n1 = this.constructor.name;
        let n2 = other.constructor.name;
        // check if both are in the classes dictionary
        if (ordering_of_classes.has(n1) && ordering_of_classes.has(n2)) {
            let idx1 = ordering_of_classes[n1]
            let idx2 = ordering_of_classes[n2]
            // the class with the larger index is greater
            return Math.sign(idx1 - idx2);
        }
        if (n1 > n2) {
            return 1;
        } else if (n1 === n2) {
            return 0;
        }
        return -1;
    }

    lessThan(other: any) {
        if (this.compare(other) === -1) {
            return true;
        }
        return false;
    }

    greaterThan(other: any) {
        if (this.compare(other) === 1) {
            return true;
        }
        return false;
    }
    
}



