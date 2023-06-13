import { _Basic } from "./basic.js";
import { BooleanKind } from "./kind.js";
import { base, mix } from "./utility.js";
import { ManagedProperties } from "./assumptions.js";
const Boolean = (superclass) => { var _a; return _a = class Boolean extends mix(base).with(_Basic) {
        constructor() {
            super(...arguments);
            this.__slots__ = [];
        }
    },
    _a.kind = BooleanKind,
    _a; };
ManagedProperties.register(Boolean(Object));
export { Boolean };
//# sourceMappingURL=boolalg.js.map