/* global expect */

"use strict";

import {Add} from "../ts-port/core/add";
import {Mul} from "../ts-port/core/mul";
import {_Number_, igcd, ilcm, int_nthroot, toRatio, mod_inverse, igcdex} from "../ts-port/core/numbers";
import {S} from "../ts-port/core/singleton";
import {Pow} from "../ts-port/core/power";
import {Symbol} from "../ts-port/core/symbol";
import {Eq, Ne, Ge, Gt, Le, Lt} from "../ts-port/core/relational";
import {factorint, factorrat} from "../ts-port/ntheory/factor_";
import { Derivative, expand_mul, expand_power_exp } from "../ts-port/core/function";
import { fraction } from "../ts-port/simplify/radsimp";


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
        expect(new Pow(n, x).subs({}, x, n3).toString()).toBe("0.125");
        expect(new Mul(false, true, n, n2, n3, x, x).subs({}, x, n2).toString()).toBe("-0.526748971193417");
        expect(new Add(false, true, n, n2, x, x).subs({}, x, n).toString()).toBe("112/9");
        expect(new Mul(true, true, n, new Add(true, true, x, n)).subs({}, x, n).toString()).toBe("32")
        expect(new Pow(n, new Mul(true, true, n, x)).subs({}, x, n3).toString()).toBe("0.000244140625");
        expect(new Mul(true, true, n, new Add(true, true, x, n)).subs({}, x, n3).toString()).toBe("10");
    });

    it("should factor large ints and rationals correctly", function () {
        expect(factorint(_Number_.new(256)).factorsToString()).toBe("2*2*2*2*2*2*2*2");
        expect(factorint(_Number_.new(58302)).factorsToString()).toBe("2*3*3*41*79");
        expect(factorint(_Number_.new(13)).factorsToString()).toBe("13");
        expect(factorrat(_Number_.new(32, 4634)).factorsToString()).toBe("2*2*2*2/7*331");
        expect(factorrat(_Number_.new(6877, 123)).factorsToString()).toBe("13*23*23/3*41");
        expect(factorrat(_Number_.new(3, 13)).factorsToString()).toBe("3/13");
    });

    it("helper functions should produce the expected values", function () {
        expect(igcd(12, 24)).toBe(12);
        expect(igcd(100, 101)).toBe(1);
        expect(ilcm(5, 10)).toBe(10);
        expect(ilcm(8, 16)).toBe(16);
        expect(igcdex(2, 3)).toEqual([-1, 1, 1]);
        expect(igcdex(10, 12)).toEqual([-1, 1, 2]);
        expect(int_nthroot(27, 3)).toEqual([3, true]);
        expect(int_nthroot(10, 2)).toEqual([3, false]);
        expect(toRatio(1.2000, 0.0001)).toEqual([6, 5])
        expect(mod_inverse(3, 11)).toBe(4)
        expect(mod_inverse(-3, 11)).toBe(7)
    });

    it("should compare objects correctly (relational)", function () {
        const f = _Number_.new(1.5)
        const n = _Number_.new(2)
        const r = _Number_.new(-2, 3)
        const x = new Symbol("x");

        // Float
        expect(f.__eq__(f)).toBeTrue();
        expect(f.__ge__(f)).toBeTrue();
        expect(f.__gt__(f)).toBeFalse();
        expect(f.__le__(f)).toBeTrue();
        expect(f.__lt__(f)).toBeFalse();
        expect(f.__eq__(r)).toBeFalse();
        expect(f.__ge__(r)).toBeTrue();
        expect(f.__gt__(r)).toBeTrue();
        expect(f.__le__(r)).toBeFalse();
        expect(f.__lt__(r)).toBeFalse();
        expect(f.__eq__(n)).toBeFalse();
        expect(f.__ge__(n)).toBeFalse();
        expect(f.__gt__(n)).toBeFalse();
        expect(f.__le__(n)).toBeTrue();
        expect(f.__lt__(n)).toBeTrue();
        expect(f.__eq__(S.Infinity)).toBeFalse();
        expect(f.__ge__(S.Infinity)).toBeFalse();
        expect(f.__gt__(S.Infinity)).toBeFalse();
        expect(f.__le__(S.Infinity)).toBeTrue();
        expect(f.__lt__(S.Infinity)).toBeTrue();
        expect(f.__eq__(S.NegativeInfinity)).toBeFalse();
        expect(f.__ge__(S.NegativeInfinity)).toBeTrue();
        expect(f.__gt__(S.NegativeInfinity)).toBeTrue();
        expect(f.__le__(S.NegativeInfinity)).toBeFalse();
        expect(f.__lt__(S.NegativeInfinity)).toBeFalse();
        expect(f.__eq__(S.ComplexInfinity)).toBeFalse();
        // Rational
        expect(r.__eq__(f)).toBeFalse();
        expect(r.__ge__(f)).toBeFalse();
        expect(r.__gt__(f)).toBeFalse();
        expect(r.__le__(f)).toBeTrue();
        expect(r.__lt__(f)).toBeTrue();
        expect(r.__eq__(r)).toBeTrue();
        expect(r.__ge__(r)).toBeTrue();
        expect(r.__gt__(r)).toBeFalse();
        expect(r.__le__(r)).toBeTrue();
        expect(r.__lt__(r)).toBeFalse();
        expect(r.__eq__(n)).toBeFalse();
        expect(r.__ge__(n)).toBeFalse();
        expect(r.__gt__(n)).toBeFalse();
        expect(r.__le__(n)).toBeTrue();
        expect(r.__lt__(n)).toBeTrue();
        expect(f.__eq__(S.Infinity)).toBeFalse();
        expect(f.__ge__(S.Infinity)).toBeFalse();
        expect(f.__gt__(S.Infinity)).toBeFalse();
        expect(f.__le__(S.Infinity)).toBeTrue();
        expect(f.__lt__(S.Infinity)).toBeTrue();
        expect(f.__eq__(S.NegativeInfinity)).toBeFalse();
        expect(f.__ge__(S.NegativeInfinity)).toBeTrue();
        expect(f.__gt__(S.NegativeInfinity)).toBeTrue();
        expect(f.__le__(S.NegativeInfinity)).toBeFalse();
        expect(f.__lt__(S.NegativeInfinity)).toBeFalse();
        expect(f.__eq__(S.ComplexInfinity)).toBeFalse();
        // Integer
        expect(n.__eq__(f)).toBeFalse();
        expect(n.__ge__(f)).toBeTrue();
        expect(n.__gt__(f)).toBeTrue();
        expect(n.__le__(f)).toBeFalse();
        expect(n.__lt__(f)).toBeFalse();
        expect(n.__eq__(r)).toBeFalse();
        expect(n.__ge__(r)).toBeTrue();
        expect(n.__gt__(r)).toBeTrue();
        expect(n.__le__(r)).toBeFalse();
        expect(n.__lt__(r)).toBeFalse();
        expect(n.__eq__(n)).toBeTrue();
        expect(n.__ge__(n)).toBeTrue();
        expect(n.__gt__(n)).toBeFalse();
        expect(n.__le__(n)).toBeTrue();
        expect(n.__lt__(n)).toBeFalse();
        expect(f.__eq__(S.Infinity)).toBeFalse();
        expect(f.__ge__(S.Infinity)).toBeFalse();
        expect(f.__gt__(S.Infinity)).toBeFalse();
        expect(f.__le__(S.Infinity)).toBeTrue();
        expect(f.__lt__(S.Infinity)).toBeTrue();
        expect(f.__eq__(S.NegativeInfinity)).toBeFalse();
        expect(f.__ge__(S.NegativeInfinity)).toBeTrue();
        expect(f.__gt__(S.NegativeInfinity)).toBeTrue();
        expect(f.__le__(S.NegativeInfinity)).toBeFalse();
        expect(f.__lt__(S.NegativeInfinity)).toBeFalse();
        expect(f.__eq__(S.ComplexInfinity)).toBeFalse();
        // Singleton (only testing eq and ge cuz those are used to derive others)
        expect(S.ComplexInfinity.__eq__(n)).toBeFalse();
        expect(S.ComplexInfinity.__eq__(S.ComplexInfinity)).toBeTrue();
        expect(S.Infinity.__eq__(n)).toBeFalse();
        expect(S.Infinity.__ge__(n)).toBeTrue();
        expect(S.Infinity.__ge__(r)).toBeTrue();
        expect(S.Infinity.__ge__(f)).toBeTrue();
        expect(S.Infinity.__eq__(S.Infinity)).toBeTrue();
        expect(S.Infinity.__eq__(S.NegativeInfinity)).toBeFalse();
        expect(S.NegativeInfinity.__eq__(n)).toBeFalse();
        expect(S.NegativeInfinity.__ge__(n)).toBeFalse();
        expect(S.NegativeInfinity.__ge__(r)).toBeFalse();
        expect(S.NegativeInfinity.__ge__(f)).toBeFalse();
        expect(S.NegativeInfinity.__eq__(S.Infinity)).toBeFalse();
        expect(S.NegativeInfinity.__eq__(S.NegativeInfinity)).toBeTrue();

        // Eq (singletons already tested above, so no need to repeat)
        expect(Eq.new(new Add(true, true, x, r), n).toString()).toBe("-2/3 + x == 2");
        expect(Eq.new(f, f)).toBeTrue();
        expect(Eq.new(f, r)).toBeFalse();
        expect(Eq.new(f, n)).toBeFalse();
        expect(Eq.new(r, f)).toBeFalse();
        expect(Eq.new(r, r)).toBeTrue();
        expect(Eq.new(r, n)).toBeFalse();
        expect(Eq.new(n, f)).toBeFalse();
        expect(Eq.new(n, r)).toBeFalse();
        expect(Eq.new(n, n)).toBeTrue();
        // Ge (singletons already tested above)
        expect(Ge.new(new Add(true, true, x, r), n).toString()).toBe("-2/3 + x >= 2")
        expect(Ge.new(f, f)).toBeTrue();
        expect(Ge.new(f, r)).toBeTrue();
        expect(Ge.new(f, n)).toBeFalse();
        expect(Ge.new(r, f)).toBeFalse();
        expect(Ge.new(r, r)).toBeTrue();
        expect(Ge.new(r, n)).toBeFalse();
        expect(Ge.new(n, f)).toBeTrue();
        expect(Ge.new(n, r)).toBeTrue();
        expect(Ge.new(n, n)).toBeTrue();

        // We don't need to test the functionality of the others as they derive 
        // from these two, but we should still check simplification

        // Ne
        expect(Ne.new(new Add(true, true, x, r), n).toString()).toBe("-2/3 + x != 2");
        expect(Ne.new(r, f)).toBeTrue();
        // Le
        expect(Le.new(new Add(true, true, x, r), n).toString()).toBe("-2/3 + x <= 2")
        expect(Le.new(r, f)).toBeTrue();
        // Gt
        expect(Gt.new(new Add(true, true, x, r), n).toString()).toBe("-2/3 + x > 2");
        expect(Gt.new(r, f)).toBeFalse();
        // Lt
        expect(Lt.new(new Add(true, true, x, r), n).toString()).toBe("-2/3 + x < 2")
        expect(Le.new(r, f)).toBeTrue();
        
        
        // expressions

        // commutativity
        const a: any = new Symbol("a")
        const b: any = new Symbol("b")
        expect(new Mul(true, true, a, b).__eq__(new Mul(true, true, b, a))).toBeTrue();
        expect(new Add(true, true, a, b).__eq__(new Add(true, true, b, a))).toBeTrue();
        const c: any = new Symbol("c", {"commutative": false})
        const d: any = new Symbol("d", {"commutative": false})
        expect(new Mul(true, true, c, d).__eq__(new Mul(true, true, d, c))).toBeFalse();
        expect(new Add(true, true, c, d).__eq__(new Add(true, true, d, c))).toBeTrue();
    });

    it("should compute derivates accurately", function () { 
        // NOTE: POW IS NOT YET SUPPORTED, SO ONLY DEGREE ONE EXPRESSIONS WORK
        const f = _Number_.new(1.5)
        const n = _Number_.new(2)
        const r = _Number_.new(-2, 3)
        const x = new Symbol("x");
        const y =  new Symbol("y");
        const addexpr1 = new Add(true, true, x, f);
        const addexpr2 = new Add(true, true, x, x, y, n, r);
        const mulexpr1 = new Mul(true, true, x, f);
        const mulexpr2 = new Mul(true, true, x, y, n, r);

 
        // // test atoms
        // expect(new Derivative(f, true)).toBe(S.Zero);
        // expect(new Derivative(n, true)).toBe(S.Zero);
        // expect(new Derivative(r, true)).toBe(S.Zero);
        // expect(new Derivative(S.Infinity, true)).toBe(S.Zero);
        // expect(new Derivative(x, true)).toBe(S.One);
        expect(new Derivative(x, false).toString()).toBe("Derivative(x)");

        // test unevalulated
        expect(new Derivative(addexpr1, false).toString()).toBe("Derivative(1.5 + x)");
        expect(new Derivative(addexpr2, false, x).toString()).toBe("Derivative(4/3 + 2*x + y)");
        expect(new Derivative(mulexpr1, false).toString()).toBe("Derivative(1.5*x)");
        expect(new Derivative(mulexpr2, false, y).toString()).toBe("Derivative(-4/3*x*y)");


        // test evalulated 
        expect(new Derivative(addexpr1, true).toString()).toBe("1");
        expect(new Derivative(addexpr2, true, x).toString()).toBe("2");
        expect(new Derivative(mulexpr1, true).toString()).toBe("1.5");
        expect(new Derivative(mulexpr2, true, y).toString()).toBe("-4/3*x");

        // test doit
        expect(new Derivative(addexpr1, false).doit().toString()).toBe("1");
        expect(new Derivative(addexpr2, false, x).doit().toString()).toBe("2");
        expect(new Derivative(mulexpr1, false).doit().toString()).toBe("1.5");
        expect(new Derivative(mulexpr2, false, y).doit().toString()).toBe("-4/3*x");
        expect(new Derivative(mulexpr2, false, x).doit().toString()).toBe("-4/3*y");
    });

    it("should expand and simplify expressions correctly", function () { 
        const x = new Symbol("x");
        const y = new Symbol("y");
        const z = new Symbol("z");
        const f = fraction(x); // need to do this or global doesnt register
        
        // expand mul
        expect(expand_mul(new Mul(true, true, x, new Add(true, true, y, z))).toString()).toBe("x*y + x*z");
        // expand pow
        expect(expand_power_exp(new Pow(_Number_.new(2), new Add(true, true, x, y))).toString()).toBe("2^(x)*2^(y)");
    });
});