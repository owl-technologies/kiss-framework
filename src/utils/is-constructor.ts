export const isConstructor = (obj: any) => {
    const isCtorClass = obj && obj.toString().substring(0, 5) === 'class';
    return isCtorClass;
}