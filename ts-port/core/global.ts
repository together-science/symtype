export class Global {
    static constructors: Record<string, any> = {};
    static functions: Record<string, any> = {};

    static construct(classname: string, ...args: any[]) {
        const constructor = Global.constructors[classname];
        return constructor(...args);
    }

    static register(cls: string, constructor: any) {
        Global.constructors[cls] = constructor;
    }

    static registerfunc(name: string, func: any) {
        Global.functions[name] = func;
    }

    static evalfunc(name: string, ...args: any[]) {
        const func = Global.functions[name];
        return func(...args);
    }
}
