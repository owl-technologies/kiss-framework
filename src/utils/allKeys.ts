/**
 * Similar to Object.keys, but also includes accessors
 * @param obj 
 */
export function allKeys(obj) {
    let methods = <any>[];
    while (obj = Reflect.getPrototypeOf(obj)) {
        let keys = Reflect.ownKeys(obj)
        keys.forEach((k) => {
            // Skip private properties
            // if (typeof k === 'string' && k.startsWith('#')) {
            //     return;
            // }
            const descriptor = Object.getOwnPropertyDescriptor(obj, k);
            // for accessors the descriptor is {get: ƒ, set: ƒ, enumerable: false, configurable: true}
            if (descriptor && (descriptor.get || descriptor.set)) {
                methods.push(k);
            } else if (descriptor?.enumerable) {
                methods.push(k);
            }
        });
    }
    return methods;
}