export function allKeys(obj) {
    let methods = <any>[];
    while (obj = Reflect.getPrototypeOf(obj)) {
        let keys = Reflect.ownKeys(obj)
        keys.forEach((k) => {
            // Skip private properties
            if (typeof k === 'string' && k.startsWith('#')) {
                return;
            }
            let descriptor = Object.getOwnPropertyDescriptor(obj, k);
            // for accessors the descriptor is {get: ƒ, set: ƒ, enumerable: false, configurable: true}
            if (descriptor && (descriptor.get || descriptor.set) && descriptor.enumerable) {
                methods.push(k);
            } 
        });
    }
    return methods;
}