export function RejectAfter(timeout, message) {
  return function <T, V extends (...args: any) => Promise<any>>(method: V, context: ClassMethodDecoratorContext<T, V>) {
    return async function (this: T, ...args: any) {
      const timer = setTimeout(() => {
        throw new Error(message);
      }, timeout);

      const promise = method.apply(this, args);

      return promise.then(result => {
        clearTimeout(timer);
        return result;
      }).catch(error => {
        clearTimeout(timer);
        throw error;
      });
    } as V;
  }
}


// class Test {
//   @RejectAfter(1000, 'Timeout')
//   async test() {
//       return await new Promise(resolve => setTimeout(resolve, 2000));
//   }
// }