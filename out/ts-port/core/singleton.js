import { ManagedProperties } from "./assumptions.js";
class Singleton {
    static register(name, cls) {
        ManagedProperties.register(cls);
        Singleton.registry[name] = new cls();
    }
}
Singleton.registry = {};
const S = new Singleton();
export { S, Singleton };
//# sourceMappingURL=singleton.js.map