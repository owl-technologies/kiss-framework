export function RejectAfter(timeout, message) {
    return function <T, V extends (...args: any) => Promise<any>,
    >(method: V, context: ClassMethodDecoratorContext<T, V>) {
      return function (this: T, ...args: any) {
        return new Promise((resolve, reject) => {
          const timer = setTimeout(() => {
            reject(new Error(message));
          }, timeout);
  
          const promise = method.apply(this, args);
  
          Promise.resolve(promise)
            .then(result => {
              clearTimeout(timer);
              resolve(result);
            })
            .catch(error => {
              clearTimeout(timer);
              reject(error);
            });
        })
      } as V;
    }
  }
  