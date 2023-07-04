/*
Notable changes made (and notes):
- Barebones implementation - only enough as needed for symbol and relational
*/

import {_Basic} from "./basic";
import {BooleanKind} from "./kind";
import {base, mix} from "./utility";
import {ManagedProperties} from "./assumptions";

const Boolean = (superclass: any) => class Boolean extends mix(base).with(_Basic) {
    __slots__: any[] = [];

    static kind = BooleanKind;

    constructor(...args: any[]) {
        super(...args);
    }
};

const _Boolean = Boolean(Object)

ManagedProperties.register(_Boolean);

export {_Boolean, Boolean};
