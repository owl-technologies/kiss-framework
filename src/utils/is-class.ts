//  Possibly a better way to check if a function is a class
// if (typeof transform === 'function') {
//     if (transform.prototype && transform.prototype.constructor) {
//         // It's a class
// }

export const isClass = (obj: any) => {
    const isPrototypeCtorClass = obj.constructor
        && obj.constructor.toString
        && obj.constructor.toString().substring(0, 5) === 'class';
    return isPrototypeCtorClass;
}