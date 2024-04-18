/**
 * Similar to Object.keys, in a sence that it returns all the enumerable keys of an obj object, 
 * but it also includes accessors that might be not enumerable.
 * 
 * @param obj - object to get all keys from
 */
export function allKeys(obj) {
    let methods = <any>[];
    let keys = Reflect.ownKeys(obj);
    keys.forEach((k) => {
        processKey(obj, k, methods);
    });
    while (obj = Reflect.getPrototypeOf(obj)) {
        keys = Reflect.ownKeys(obj);
        keys.forEach((k) => {
            processKey(obj, k, methods);
        });
    }
    return methods;
}

function processKey(obj, k, methods) {
    const descriptor = Object.getOwnPropertyDescriptor(obj, k);
    if (descriptor && (descriptor.get || descriptor.set)) {
        methods.push(k);
    } else if (descriptor?.enumerable) {
        methods.push(k);
    }
}