/* global expect */

"use strict";

import {Add} from "../ts-port/core/add";
import {Mul} from "../ts-port/core/mul";
import {_Number_} from "../ts-port/core/numbers";
import {S} from "../ts-port/core/singleton";
import {Pow} from "../ts-port/core/power";
import {Symbol} from "../ts-port/core/symbol";
import {factorint, factorrat} from "../ts-port/ntheory/factor_";


describe("Core", function () {

    it("should create objects and produce the correct properties", function () {
        // test out an int
        const n = _Number_.new(4);
        expect(n.is_even()).toBeTrue();
        expect(n.is_odd()).toBeFalse();
        expect(n.is_infinite()).toBeFalse();
        expect(n.is_Rational()).toBeTrue();
        expect(n.is_complex()).toBeTrue();
        expect(n.is_Add()).toBeFalse();
        expect(n.is_extended_nonnegative()).toBeTrue();
        // test out a rational
        const n2 = _Number_.new(4, 9);
        expect(n2.is_even()).toBeFalse();
        expect(n2.is_commutative()).toBeTrue();
        expect(n2.is_finite()).toBeTrue();
        expect(n2.is_Rational()).toBeTrue();
        expect(n2.is_hermitian()).toBeTrue();
        expect(n2.is_negative()).toBeFalse();
        // test out a float
        const n3 = _Number_.new(-1.5);
        expect(n3.is_commutative()).toBeTrue();
        expect(n3.is_finite()).toBeTrue();
        expect(n3.is_Rational()).toBeFalse();
        expect(n3.is_Float()).toBeTrue();
        expect(n3.is_scalar()).toBeTrue();
        expect(n3.is_antihermitian()).toBeUndefined();  
        // test out a symbol
        const x = new Symbol("x");
        expect(x.is_commutative()).toBeTrue();
        expect(x.is_Symbol()).toBeTrue();
        expect(x.is_even()).toBeUndefined();
        expect(x.is_real()).toBeUndefined();
        expect(x.is_Pow()).toBeFalse();
        // test out a symbol with user-defined properties
        const y = new Symbol("y", {"commutative":false, "real":false});
        expect(y.is_commutative()).toBeFalse();
        expect(y.is_Symbol()).toBeTrue();
        expect(y.is_even()).toBeFalse();
        expect(y.is_rational()).toBeFalse();
        expect(y.is_Pow()).toBeFalse();
    });

    it("should add symtype objects correctly and handle weird addition cases", function () {
        const n = _Number_.new(4);
        const n2 = _Number_.new(4, 9);
        const n3 = _Number_.new(-1.5);
        const x = new Symbol("x");
        // handle multiple number types
        expect(new Add(true, true, n, n2).toString()).toBe("40/9");
        expect(new Add(true, true, n, n2, x).toString()).toBe("40/9 + x");
        expect(new Add(true, true, n, n3, x).toString()).toBe("2.5 + x");
        expect(new Add(false, true, n, n2, x).toString()).toBe("4 + 4/9 + x");
        expect(new Add(true, true, x, x, x).toString()).toBe("3*x");
        expect(new Add(true, true, x, x, new Add(true, true, n, n3, x)).toString()).toBe("2.5 + 3*x");
        expect(new Add(true, true, x, n3, new Mul(true, true, n3, x)).toString()).toBe("-1.5 + -0.5*x");
        expect(new Add(true, true, x, n2, new Pow(n, x)).toString()).toBe("4/9 + 4^(x) + x");
        // handle weird inputs
        expect(new Add(true, true, n, x, S.ComplexInfinity).toString()).toBe("ComplexInfinity + x")
        expect(new Add(true, true, n, x, S.Infinity).toString()).toBe("Infinity + x")
        expect(new Add(true, true, n, x, S.NegativeInfinity).toString()).toBe("NegInfinity + x")
        expect(new Add(true, true, n, x, S.Infinity, S.NegativeInfinity).toString()).toBe("NAN")
        expect(new Add(true, true, n, x, S.ComplexInfinity, S.Infinity).toString()).toBe("NAN")
        expect(new Add(true, true, n, x, S.NaN, S.Infinity).toString()).toBe("NAN")
    });

    it("should multiply/divide symtype objects correctly and handle weird cases", function () {
        const n = _Number_.new(4);
        const n2 = _Number_.new(4, 9);
        const n3 = _Number_.new(-1.5);
        const x = new Symbol("x");
        // handles multiple types of inputs
        expect(new Mul(true, true, n, n2, n3, x).toString()).toBe("-2.66666666666667*x");
        expect(new Mul(true, true, n3, n3).toString()).toBe("2.25");
        expect(new Mul(true, true, n, _Number_.new(1, 2)).toString()).toBe("2");
        expect(new Mul(false, true, n, n2, x).toString()).toBe("4*4/9*x");
        expect(new Mul(true, true, x, x, x).toString()).toBe("x^(3)");
        expect(new Mul(true, true, x, x, new Mul(true, true, n, n2, x)).toString()).toBe("16/9*x^(3)");
        expect(new Mul(true, true, x, new Pow(n, x)).toString()).toBe("4^(x)*x");
        expect(new Mul(true, true, new Pow(n, x), new Pow(n, x)).toString()).toBe("4^(2*x)");
        expect(new Mul(true, true, n, new Add(true, true, x, n)).toString()).toBe("16 + 4*x");
        // handle weird cases
        expect(new Mul(true, true, n, x, S.ComplexInfinity).toString()).toBe("ComplexInfinity*x");
        expect(new Mul(true, true, n, x, S.Infinity).toString()).toBe("Infinity*x");
        expect(new Mul(true, true, n, x, S.NegativeInfinity).toString()).toBe("NegInfinity*x");
        expect(new Mul(true, true, n, x, S.Infinity, S.NegativeInfinity).toString()).toBe("NegInfinity*x");
        expect(new Mul(true, true, n, x, S.ComplexInfinity, S.Infinity).toString()).toBe("ComplexInfinity*x");
        expect(new Mul(true, true, n, x, S.NaN, S.Infinity).toString()).toBe("NAN");
        // simplify expressions (basic)
        expect(new Mul(true, true, n, x).__truediv__(new Mul(true, true, n, x)).toString()).toBe("1");
        expect(new Pow(n, x).__truediv__(new Pow(n, x)).toString()).toBe("1");
        expect(new Mul(true, true, new Mul(true, true, x, n), new Mul(true, true, x, n2)).toString()).toBe("16/9*x^(2)");
        expect(new Pow(n, n.__mul__(x)).__truediv__(new Pow(n, x)).toString()).toBe("4^(3*x)");
    });

    it("should compute exponents with symtype objects correctly and handle weird cases", function () {
        const n = _Number_.new(4);
        const nneg = _Number_.new(-2);
        const n2 = _Number_.new(4, 9);
        const n2neg = _Number_.new(-4, 9);
        const n3 = _Number_.new(-1.5);
        const x = new Symbol("x")
        // handle multiple number types
        expect(new Pow(n, n).toString()).toBe("256");
        expect(new Pow(n, n2).toString()).toBe("2^(8/9)");
        expect(new Pow(n, n3).toString()).toBe("0.125");
        expect(new Pow(n2, n).toString()).toBe("256/6561");
        expect(new Pow(n2, n2).toString()).toBe("1/3*2^(8/9)*3^(1/9)");
        expect(new Pow(n2, n3).toString()).toBe("3.37500000000001");
        expect(new Pow(n3, n).toString()).toBe("5.0625");
        expect(new Pow(_Number_.new(1.5), n2).toString()).toBe("1.1974648711484");
        expect(new Pow(_Number_.new(1.5), _Number_.new(1.5)).toString()).toBe("1.83711730708738");
        // handle weird inputx
        expect(new Pow(nneg, S.NegativeInfinity).toString()).toBe("0");
        expect(new Pow(n2neg, S.NegativeInfinity).toString()).toBe("NAN");
        expect(new Pow(nneg, S.Infinity).toString()).toBe("ComplexInfinity");
        expect(new Pow(n2neg, S.Infinity).toString()).toBe("0");
        expect(new Pow(n, S.NegativeInfinity).toString()).toBe("0");
        expect(new Pow(n2, S.NegativeInfinity).toString()).toBe("Infinity");
        expect(new Pow(n, S.Infinity).toString()).toBe("Infinity");
        expect(new Pow(n2, S.Infinity).toString()).toBe("0");
        expect(new Pow(n, S.ComplexInfinity).toString()).toBe("NAN");
        expect(new Pow(n2, S.ComplexInfinity).toString()).toBe("NAN");
        expect(new Pow(n, S.ComplexInfinity).toString()).toBe("NAN");
        expect(new Pow(n2, S.ComplexInfinity).toString()).toBe("NAN");
        expect(new Pow(S.NegativeInfinity, nneg).toString()).toBe("0");
        expect(new Pow(S.NegativeInfinity, n2neg).toString()).toBe("0");
        expect(new Pow(S.Infinity, nneg).toString()).toBe("0");
        expect(new Pow(S.Infinity, n2neg).toString()).toBe("0");
        expect(new Pow(S.NegativeInfinity, n).toString()).toBe("Infinity");
        expect(new Pow(S.NegativeInfinity, _Number_.new(1, 2)).toString()).toBe("Infinity*-1^(1/2)");
        expect(new Pow(S.Infinity, n).toString()).toBe("Infinity");
        expect(new Pow(S.Infinity, _Number_.new(1, 2)).toString()).toBe("Infinity");
        expect(new Pow(S.ComplexInfinity, nneg).toString()).toBe("0");
        expect(new Pow(S.ComplexInfinity, n2neg).toString()).toBe("0");
        expect(new Pow(S.ComplexInfinity, n).toString()).toBe("ComplexInfinity");
        expect(new Pow(S.ComplexInfinity, n2).toString()).toBe("ComplexInfinity");
        expect(new Pow(S.Infinity, S.Infinity).toString()).toBe("Infinity");
        expect(new Pow(S.Infinity, S.NegativeInfinity).toString()).toBe("0");
        expect(new Pow(S.Infinity, S.ComplexInfinity).toString()).toBe("NAN");
        expect(new Pow(S.NegativeInfinity, S.Infinity).toString()).toBe("NAN");
        expect(new Pow(S.NegativeInfinity, S.NegativeInfinity).toString()).toBe("NAN");
        expect(new Pow(S.NegativeInfinity, S.ComplexInfinity).toString()).toBe("NAN");
        expect(new Pow(S.ComplexInfinity, S.Infinity).toString()).toBe("0");
        expect(new Pow(S.ComplexInfinity, S.NegativeInfinity).toString()).toBe("0");
        expect(new Pow(S.ComplexInfinity, S.ComplexInfinity).toString()).toBe("NAN");
        // handle nested pow
        expect(new Pow(new Pow(x, new Add(true, true, x, n)), n).toString()).toBe("x^(16 + 4*x)");
    });

    it("should substitute values for symbols and evaluate the expressions correctly", function () {
        const n = _Number_.new(4);
        const n2 = _Number_.new(4, 9);
        const n3 = _Number_.new(-1.5);
        const n4 = _Number_.new(1, 3);
        const x = new Symbol("x");
        expect(new Pow(n, x).subs(x, n3).toString()).toBe("0.125");
        expect(new Mul(false, true, n, n2, n3, x, x).subs(x, n2).toString()).toBe("-0.526748971193417");
        expect(new Add(false, true, n, n2, x, x).subs(x, n).toString()).toBe("112/9");
        expect(new Mul(true, true, n, new Add(true, true, x, n)).subs(x, n).toString()).toBe("32")
        expect(new Pow(n, new Mul(true, true, n, x)).subs(x, n3).toString()).toBe("0.000244140625");
        expect(new Mul(true, true, n, new Add(true, true, x, n)).subs(x, n3).toString()).toBe("10");
    });

    it("should factor large ints and rationals correctly", function () {
        expect(factorint(_Number_.new(256)).factorsToString()).toBe("2*2*2*2*2*2*2*2");
        expect(factorint(_Number_.new(58302)).factorsToString()).toBe("2*3*3*41*79");
        expect(factorint(_Number_.new(13)).factorsToString()).toBe("13");
        expect(factorrat(_Number_.new(32, 4634)).factorsToString()).toBe("2*2*2*2/7*331");
        expect(factorrat(_Number_.new(6877, 123)).factorsToString()).toBe("13*23*23/3*41");
        expect(factorrat(_Number_.new(3, 13)).factorsToString()).toBe("3/13");
    });
});


