export function RejectAfter(timeout, message) {
  return function <T, V extends (...args: any) => Promise<any>>(method: V, context: ClassMethodDecoratorContext<T, V>) {
    return async function (this: T, ...args: any) {
      const timerPromise = new Promise<never>((_, reject) =>
        setTimeout(() => reject(new Error(message)), timeout)
      );
      const promise = method.apply(this, args);
      try {
        return await Promise.race([
          method.apply(this, args),
          timerPromise,
        ]);
      } catch (error) {
        clearTimeout(timerPromise as unknown as NodeJS.Timeout);
        throw error;
      }
    } as V;
  }
}
