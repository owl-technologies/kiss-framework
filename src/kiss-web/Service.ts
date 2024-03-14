import { Constructor } from "../kiss-data/decorators/types.js";

const SINGLETON_KEY = Symbol();

export const Service = <T extends Constructor<any>>(target: T, context: ClassDecoratorContext) => {
  return class extends (target as Constructor<any>) {
      constructor(...args: any) {
          if (!target.prototype[SINGLETON_KEY]) {
            //   console.log("Service constructor is a singleton");
              super(...args);
              target.prototype[SINGLETON_KEY] = this;
          }
          return target.prototype[SINGLETON_KEY] as T;
      }
  } as typeof target
};