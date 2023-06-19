/* global expect */

"use strict";

import {Add} from "../ts-port/core/add";
import {Mul} from "../ts-port/core/mul";
import {_Number_} from "../ts-port/core/numbers";
import {Pow} from "../ts-port/core/power";
import {Symbol} from "../ts-port/core/symbol";
import {factorint, factorrat} from "../ts-port/ntheory/factor_";


describe("Core", function () {

    it("should create objects and produce the correct properties", function () {
        // test out an int
        const n = _Number_.new(4);
        expect(n.is_even()).toBeTrue();
        expect(n.is_odd()).toBeFalse();
        expect(n.is_finite()).toBeTrue();
        expect(n.is_Rational()).toBeTrue();
        expect(n.is_real()).toBeTrue();
        expect(n.is_Add()).toBeFalse();
        // to-do: add _eval_is_nonnegative()
        expect(n.is_extended_nonnegative()).toBeUndefined();
        // test out a rational
        const n2 = _Number_.new(4, 9);
        expect(n2.is_even()).toBeTrue();
        expect(n2.is_commutative()).toBeTrue();
        expect(n2.is_finite()).toBeTrue();
        expect(n2.is_Rational()).toBeTrue();
        expect(n2.is_real()).toBeTrue();
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
        expect(y.is_even()).toBeUndefined();
        expect(y.is_real()).toBeFalse();
        expect(y.is_Pow()).toBeFalse();
    });

    it("should add symtype objects correctly and handle weird addition cases", function () {
        const n = _Number_.new(4);
        const n2 = _Number_.new(4, 9);
        const n3 = _Number_.new(-1.5);
        const x = new Symbol("x");
        expect(new Add(true, true, n, n2).toString()).toBe("40/9");
        expect(new Add(true, true, n, n2, x).toString()).toBe("40/9 + x");
        expect(new Add(true, true, n, n3, x).toString()).toBe("2.5 + x");
        expect(new Add(false, true, n, n2, x).toString()).toBe("4 + 4/9 + x");
        expect(new Add(true, true, x, x, x).toString()).toBe("3*x");
        expect(new Add(true, true, x, x, new Add(true, true, n, n3, x)).toString()).toBe("2.5 + 3*x");
        expect(new Add(true, true, x, n3, new Mul(true, true, n3, x)).toString()).toBe("-1.5 + -0.5*x");
        expect(new Add(true, true, x, n2, new Pow(n, x)).toString()).toBe("4/9 + 4^x + x");
    });

    it("should multiply/divide symtype objects correctly and handle weird cases", function () {
        const n = _Number_.new(4);
        const n2 = _Number_.new(4, 9);
        const n3 = _Number_.new(-1.5);
        const x = new Symbol("x");
        expect(new Mul(true, true, n, n2, n3, x).toString()).toBe("-2.66666666666667*x");
        expect(new Mul(true, true, n3, n3).toString()).toBe("2.25");
        expect(new Mul(true, true, n, _Number_.new(1, 2)).toString()).toBe("2");
        expect(new Mul(false, true, n, n2, x).toString()).toBe("4*4/9*x");
        expect(new Mul(true, true, x, x, x).toString()).toBe("x^3");
        expect(new Mul(true, true, x, x, new Mul(true, true, n, n2, x)).toString()).toBe("16/9*x^3");
        expect(new Mul(true, true, x, new Pow(n, x)).toString()).toBe("4^x*x");
        expect(new Mul(true, true, new Pow(n, x), new Pow(n, x)).toString()).toBe("4^2*x");
        expect(new Mul(true, true, n, new Add(true, true, x, n)).toString()).toBe("16 + 4*x");
    });

    it("should compute exponents with symtype objects correctly and handle weird cases", function () {
        // NOTE: POW HAS LIMITED FUNCTIONALITY COMPARED TO ADD AND MUL (ATM)
        const n = _Number_.new(4);
        const n2 = _Number_.new(4, 9);
        const n3 = _Number_.new(-1.5);
        const x = new Symbol("x");
        expect(new Pow(n, n).toString()).toBe("256");
        expect(new Pow(n, n2).toString()).toBe("2^8/9");
        expect(new Pow(n, n3).toString()).toBe("0.125");
        expect(new Pow(n2, n3).toString()).toBe("3.37500000000001");
        expect(new Pow(n, x).toString()).toBe("4^x");
        expect(new Pow(n, new Mul(true, true, n2, n3)).toString()).toBe("0.39685026299205");
        expect(new Pow(new Mul(true, true, n2, n), new Mul(true, true, n, n, x)).toString()).toBe("16/9^16*x");
        expect(new Pow(n, new Add(true, true, n, x)).toString()).toBe("4^4 + x");
        expect(new Pow(n, new Mul(true, true, n, x)).toString()).toBe("4^4*x");
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


