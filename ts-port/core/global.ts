/*
New class global
Helps to avoid cyclical imports by storing constructors and functions which
can be accessed anywhere

Note: static new methods are created in the classes to be registered, and those
methods are added here
*/

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
