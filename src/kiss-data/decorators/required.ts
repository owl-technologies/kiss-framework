import { FIELD_METADATA, KissData } from "../kiss-data.js";



/**
 * If the field with @Required decorator is not set after constructor is called,
 * an error will be thrown. All the fields with @Required decorator will be 
 * serialized to JSON when toJSON() is called.
 * 
 * @returns does not modify the field or accessor
 */
export function Required<T extends KissData, V>() {
    return function (
        accessor: any | ClassAccessorDecoratorTarget<T, V>,
        context: ClassFieldDecoratorContext<T, V> | ClassAccessorDecoratorContext<T, V>
    ) {
        if (context.kind === 'field') {
            return function (this: T, args: V) {
                const fieldMeta = this[FIELD_METADATA].get(context.name) ?? {};
                // console.debug(`----- Required ${fieldMeta.initialized ? 'accessing' : 'initializing'} field ${this['constructor']?.prototype?.constructor?.name}.${String(context.name)} = ${args}`)
                if (args === undefined && this[context.name] === undefined) {
                    throw new Error(`Required field ${this.constructor?.name}.${String(context.name)} is not set`)
                }
                if (!fieldMeta.required) {
                    fieldMeta.required = true;
                    this[FIELD_METADATA].set(context.name, fieldMeta);
                }
                return args;
            }
        } else {
            return {
                init(this: T, args: V) {
                    if (args === undefined) {
                        throw new Error(`Required field <${this.constructor?.name}>.${String(context.name)} is not set`)
                    } else {
                        const fieldMeta = this[FIELD_METADATA].get(context.name) ?? {};
                        fieldMeta.required = true;
                        this[FIELD_METADATA].set(context.name, fieldMeta);
                    }
                    return args;
                },
                get: function (this: T) {
                    return <ClassAccessorDecoratorTarget<T, V>>accessor.get.call(this);
                },
                set: function (this: T, value: V) {
                    return <ClassAccessorDecoratorTarget<T, V>>accessor.set.call(this, value);
                }
            } as any
        }
    }
}

