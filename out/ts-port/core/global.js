export class Global {
    static construct(classname, ...args) {
        const constructor = Global.constructors[classname];
        return constructor(...args);
    }
    static register(cls, constructor) {
        Global.constructors[cls] = constructor;
    }
    static registerfunc(name, func) {
        Global.functions[name] = func;
    }
    static evalfunc(name, ...args) {
        const func = Global.functions[name];
        return func(...args);
    }
}
Global.constructors = {};
Global.functions = {};
//# sourceMappingURL=global.js.map