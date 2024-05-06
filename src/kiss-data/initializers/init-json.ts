
import { assert } from "../../utils/assert.js";
import { isConstructor } from "../../utils/is-constructor.js";
import { Constructor, ConstructorOrFunction } from "../decorators/types.js";
import { FIELD_METADATA, KissData } from "../kiss-data.js";




export function InitJson<T extends KissData, V>(
    transform: ConstructorOrFunction<V> = (data: any) => data as V
) {
    return function (
        accessor: undefined,
        context: ClassFieldDecoratorContext<T, V>
    ) {
        return function (this: T, args: V) {
            const fieldMeta = this[FIELD_METADATA].get(context.name) ?? {};
            // console.debug(`----- InitJson ${fieldMeta.initialized ? 'accessing' : 'initializing'} field ${this['constructor']?.prototype?.constructor?.name}.${String(context.name)} = ${args} from ${JSON.stringify(this.from?.[context.name])}`)
            if (!fieldMeta.initialized) {
                fieldMeta.initialized = true;
                this[FIELD_METADATA].set(context.name, fieldMeta);
                const fromValue = this.from?.[context.name];
                let toValue: V;
                if (fromValue !== undefined && fromValue !== null) {
                    try {
                        if (isConstructor(transform)) {
                            toValue = new (transform as Constructor<V>)(fromValue);
                        } else {
                            toValue = (transform as Function)(fromValue);
                        }
                        return toValue
                    } catch (e : any) {
                        throw new Error(`Error initializing field ${String(context.name)} with value ${fromValue} - ${e.message}`)
                    }
                }
            }
            return args;
        }
    }
}


export function GetSetJson<T extends KissData, V>(
    transform: ConstructorOrFunction<V> = (data: any) => data as V
) {
    return function (
        accessor: ClassAccessorDecoratorTarget<T, V>,
        context: ClassAccessorDecoratorContext<T, V>
    ) {
        return {
            init: function (this: T, value: V): V {
                // To avoid calling transform function with undefined value,
                // initialize the field only if initial value is provided 
                if (!(context.name in this.from)) {
                    return value;
                }
                const fromValue = this.from?.[context.name];
                let toValue: V;
                // console.debug(`----- GetSetJson Initializing accessor ${this['constructor']?.prototype?.constructor?.name}.${String(context.name)} Ignoring provided initialization: ${value} from ${fromValue}`)
                if (isConstructor(transform)) {
                    toValue = new (transform as Constructor<V>)(fromValue);
                } else {
                    toValue = (transform as Function)(fromValue);
                }
                return toValue;
            },
            get: function (this: T) {
                return accessor.get.call(this);
            },
            set: function (this: T, value: V) {
                return accessor.set.call(this, value);
            }
        }
    }
}


export function InitJsonArray<T extends KissData, V>(
    transform: ConstructorOrFunction<V> = (data: any) => data as V
) {
    return function (
        accessor: undefined,
        context: ClassFieldDecoratorContext<T, V[]>
    ) {
        return function (this: T, value: V[]) {
            const fieldMeta = this[FIELD_METADATA].get(context.name) ?? {};
            // console.debug(`----- InitJsonArray ${fieldMeta.initialized ? 'accessing' : 'initializing'} field ${this['constructor']?.prototype?.constructor?.name}.${String(context.name)} = ${value} from ${JSON.stringify(this.link[context.name])}`)
            if (!fieldMeta.initialized) {
                fieldMeta.initialized = true;
                this[FIELD_METADATA].set(context.name, fieldMeta);
                const fromValue = this.from?.[context.name];
                if (fromValue) {
                    let toValue: V[];
                    assert(fromValue instanceof Array, `Expected ${String(context.name)} to be an array, got type:${typeof fromValue} - ${fromValue}`)
                    if (isConstructor(transform)) {
                        toValue = fromValue.map((link) => new (transform as any)(link));
                    } else {
                        toValue = fromValue.map((link) => (transform as Function)(link));
                    }
                    return toValue;
                }
            }
            return value;
        }
    }
}

export function GetSetJsonArray<T extends KissData, V>(
    transform: ConstructorOrFunction<V> = (data: any) => data as V
) {
    return function (
        accessor: ClassAccessorDecoratorTarget<T, V[]>,
        context: ClassAccessorDecoratorContext<T, V[]>
    ) {
        return {
            init: function (this: T, value: V[]) {
                const fromValue = this.from?.[context.name];
                if (fromValue === undefined) {
                    return value;
                }
                // console.debug(`----- GetSetJsonArray Initializing accessor ${this['constructor']?.prototype?.constructor?.name}.${String(context.name)} Ignoring provided initialization: ${value} from ${fromValue}`)
                let toValue: V[];

                assert(fromValue instanceof Array, `Expected accessor ${String(context.name)} to be an array,  got type:${typeof fromValue} - ${fromValue}`)
                if (isConstructor(transform)) {
                    toValue = fromValue.map((link) => new (transform as any)(link));
                } else {
                    toValue = fromValue.map((link) => (transform as Function)(link));
                }

                return toValue;
            },
            get: function (this: T) {
                return accessor.get.call(this);
            },
            set: function (this: T, value: V[]) {
                return accessor.set.call(this, value);
            }
        }
    }
}

