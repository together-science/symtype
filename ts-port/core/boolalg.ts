/*
Notable changes made (and notes):
- Barebones implementation - only enough as needed for symbol
*/

import {_Basic} from "./basic.js";
import {BooleanKind} from "./kind.js";
import {base, mix} from "./utility.js";
import {ManagedProperties} from "./assumptions.js";

const Boolean = (superclass: any) => class Boolean extends mix(base).with(_Basic) {
    __slots__: any[] = [];

    static kind = BooleanKind;
};

ManagedProperties.register(Boolean(Object));

export {Boolean};
