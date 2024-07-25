import { KissSerializableData } from "../kiss-serializable-data.js"


export function IsNumber() {
    return function <T extends KissSerializableData, V>(
        accessor: any | ClassAccessorDecoratorTarget<T, V>,
        context: ClassFieldDecoratorContext<T, V> | ClassAccessorDecoratorContext<T, V>
    ) {
        context.addInitializer(
            function () {
                const value = this[context.name]
                if (typeof value !== 'number') throw new Error(`Field <${String(context.name)}> is not a number`)
            }
        )
        if (context.kind === 'field') {
            return function (this: T) {
                return this[context.name];
            } as any
        } else {
            return {
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