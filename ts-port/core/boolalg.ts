/*
Notable changes made (and notes):
- Barebones implementation - only enough as needed for symbol
*/

import {_Basic} from "./basic";
import {BooleanKind} from "./kind";
import {base, mix} from "./utility";
import {ManagedProperties} from "./assumptions";

const Boolean = (superclass: any) => class Boolean extends mix(base).with(_Basic) {
    __slots__: any[] = [];

    static kind = BooleanKind;
};

ManagedProperties.register(Boolean(Object));

export {Boolean};
