import { FIELD_METADATA, KissSerializableData } from "../kiss-serializable-data.js";

/**
 * If the field with @Optional decorator it will be 
 * serialized to JSON when toJSON() is called, unlike
 * other fields that are serialized only if they are
 * marked with @Required decorator.
 * 
 * @returns does not modify the field or accessor
 */
export function Optional<T extends KissSerializableData, V>() {
    return function (
        accessor: any | ClassAccessorDecoratorTarget<T, V>,
        context: ClassFieldDecoratorContext<T, V> | ClassAccessorDecoratorContext<T, V>
    ) {
        // const afterConstructor = metadata.getMap<string | symbol, Function>(context, RUN_AFTER_INIT)
        // afterConstructor.set(context.name, function (dis: T) {
        //     const optional = dis[context.name]
        //     if (optional) {
        //         // dis.constructor.prototype[SERIALIZE_METADATA] ??= new Set<string | symbol>();
        //         // dis.constructor.prototype[SERIALIZE_METADATA].add(context.name)
        //         dis[SERIALIZE_METADATA].add(context.name)
        //     }
        // })

        // if (context.kind === 'field') {
        //     return function (args: V) {
        //         return args;
        //     }
        // } else {
        //     return {
        //         get: function (this: T) {
        //             return <ClassAccessorDecoratorTarget<T, V>>accessor.get.call(this);
        //         },
        //         set: function (this: T, value: V) {
        //             return <ClassAccessorDecoratorTarget<T, V>>accessor.set.call(this, value);
        //         }
        //     } as any
        // }
        if (context.kind === 'field') {
            return function (this: T, args: V) {
                const fieldMeta = this[FIELD_METADATA].get(context.name) ?? {};
                // console.debug(`----- Optional ${fieldMeta.initialized ? 'accessing' : 'initializing'} field ${this['constructor']?.prototype?.constructor?.name}.${String(context.name)} = ${args}`)
                if (!fieldMeta.optional) {
                    fieldMeta.optional = true;
                    this[FIELD_METADATA].set(context.name, fieldMeta);
                }
                return args;
            }
        } else {
            return {
                init(this: T, args: V) {
                    const fieldMeta = this[FIELD_METADATA].get(context.name) ?? {};
                    if (!fieldMeta.optional) {
                        fieldMeta.optional = true;
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