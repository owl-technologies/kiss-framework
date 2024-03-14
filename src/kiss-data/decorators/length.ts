import { FIELD_METADATA, KissData } from "../kiss-data.js";


export function Length(min: number, max: number) {
    return function <T extends KissData, V>(
        accessor: any | ClassAccessorDecoratorTarget<T, V>,
        context: ClassFieldDecoratorContext<T, V> | ClassAccessorDecoratorContext<T, V>
    ) {
        const chkLength = function(this: T, args: V) {
            const fieldMeta = this[FIELD_METADATA].get(context.name) ?? {};
            // console.debug(`----- Length test accessor ${this['constructor']?.prototype?.constructor?.name}.${String(context.name)} = ${args}`)
            const length = args? args["length"] : undefined
            switch (true) {
                case (length === undefined && fieldMeta.required):
                    throw new Error(`Required field <${String(context.name)}> has no length property`)
                case (length === undefined && !fieldMeta.required):
                    // If the property is not required and not set, do not throw an error if length is undefined
                    return args;
                case (length < min):
                    throw new Error(`Field <${String(context.name)}> length ${length} is lower than ${min}`)
                case (length > max):
                    throw new Error(`Field <${String(context.name)}> length ${length} is higher than ${max}`)
            }
            return args;
        }
        if (context.kind === 'field') {
            return function (this: T, args: V) {
                return chkLength.call(this, args);
            }
        } else {
            return {
                init(this: T, args: V) {
                    return chkLength.call(this, args);
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

