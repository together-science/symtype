class KindRegistry {
    static register(name, cls) {
        KindRegistry.registry[name] = new cls();
    }
}
KindRegistry.registry = {};
class Kind {
    static new(cls, ...args) {
        let inst;
        if (args in KindRegistry.registry) {
            inst = KindRegistry.registry[args];
        }
        else {
            KindRegistry.register(cls.name, cls);
            inst = new cls();
        }
        return inst;
    }
}
class _UndefinedKind extends Kind {
    constructor() {
        super();
    }
    static new() {
        return Kind.new(_UndefinedKind);
    }
    toString() {
        return "UndefinedKind";
    }
}
const UndefinedKind = _UndefinedKind.new();
class _NumberKind extends Kind {
    constructor() {
        super();
    }
    static new() {
        return Kind.new(_NumberKind);
    }
    toString() {
        return "NumberKind";
    }
}
const NumberKind = _NumberKind.new();
class _BooleanKind extends Kind {
    constructor() {
        super();
    }
    static new() {
        return Kind.new(_BooleanKind);
    }
    toString() {
        return "BooleanKind";
    }
}
const BooleanKind = _BooleanKind.new();
export { UndefinedKind, NumberKind, BooleanKind };
//# sourceMappingURL=kind.js.map