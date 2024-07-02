export function RejectAfter(timeout: number, message: string) {
  return function ( method, context: ClassMethodDecoratorContext) {
      return function (this, ...args) {
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
      }
  }
}

// class Test {
//   @RejectAfter(1000, 'Timeout')
//   async test() {
//       await new Promise(resolve => setTimeout(resolve, 2000));
//   }
// }