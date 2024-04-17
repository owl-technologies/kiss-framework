export function allKeys(obj) {
    let methods = <any>[];
    while (obj = Reflect.getPrototypeOf(obj)) {
        let keys = Reflect.ownKeys(obj)
        keys.forEach((k) => {
            if (typeof obj[k] === 'function') {
                methods.push(k);
            }
        });
    }
    return methods;
}