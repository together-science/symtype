/* eslint-disable no-unused-vars */
/* Definitions of common exceptions for :mod:`sympy.core` module. */


class BaseCoreError extends Error {
    // Base class for core related exceptions.
}

class NonCommutativeExpression extends BaseCoreError {
    // Raised when expression didn't have commutative property.
}
