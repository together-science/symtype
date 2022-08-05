/*
Notable changes made (and notes)
- Reworked Singleton to use a registry system using a static dictionary
- Registers number objects as they are used
*/

/* eslint-disable new-cap */
import {ManagedProperties} from "./assumptions.js";
import {One, Zero} from "./numbers.js";

class Singleton {
    static registry: Record<any, any> = {};

    static register(name: string, cls: any) {
        ManagedProperties.register(cls);
        // eslint-disable-next-line new-cap
        Singleton.registry[name] = new cls();
    }
}

const S: any = new Singleton();

Singleton.register("Zero", Zero);
S.Zero = Singleton.registry["Zero"];

Singleton.register("One", One);
S.One = Singleton.registry["One"];


export {S};
