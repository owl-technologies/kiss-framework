import { colors } from './colors.js';

type TestFn = () => void | Promise<void>;

interface Test {
  name: string;
  fn: TestFn;
}

let currentDescribe = '';

const tests: Record<string, Test[]> = {};

export function describe(name: string, fn: () => void) {
  currentDescribe = name;
  tests[currentDescribe] = [];
  fn();
  currentDescribe = '';
  runTests();
}



export function it(name: string, fn: TestFn) {
  if (!currentDescribe) {
    throw new Error('it must be called within a describe block');
  }
  tests[currentDescribe].push({ name, fn });
}

export const test = it

export async function runTests() {
  for (const describeName in tests) {
    console.log(`\n${colors.yellow(describeName)}`);
    for (const test of tests[describeName]) {
      try {
        await test.fn();
        console.log(colors.green('    ✓ ') + test.name);
      } catch (error) {
        console.error(colors.red('    ✗ ') + test.name);
        console.error(colors.red((error as any).toString()));
      }
    }
  }
}



export function expect(actual: any) {
  return {
    toBe(expected: any) {
      if (actual !== expected) {
        throw new Error(colors.red(`Expected ${actual} to be ${expected}`));
      }
    },
    toEqual(expected: any) {
      if (JSON.stringify(actual) !== JSON.stringify(expected)) {
        throw new Error(colors.red(`Expected ${JSON.stringify(actual)} to equal ${JSON.stringify(expected)}`));
      }
    },
    toBeInstanceOf(expected: any) {
      if (!(actual instanceof expected)) {
        throw new Error(colors.red(`Expected ${actual} to be instance of ${expected}`));
      }
    },
    toBeGreaterThan(expected: any) {
      if (actual <= expected) {
        throw new Error(colors.red(`Expected ${actual} to be greater than ${expected}`));
      }
    },
    toBeLessThan(expected: any) {
      if (actual >= expected) {
        throw new Error(colors.red(`Expected ${actual} to be less than ${expected}`));
      }
    },
    toBeDefined() {
      if (actual === undefined) {
        throw new Error(colors.red(`Expected ${actual} to be defined`));
      }
    },
    // not(obj): typeof expect {
    //   return new Proxy(obj, {
    //     get(target, prop, receiver) {
    //       if (typeof target[prop] === 'function') {
    //         return function (this: any, ...args: any[]) {
    //           try {
    //             target[prop].apply(this, args);
    //           } catch (e) {
    //             return; // If the original function throws, this is the expected behavior
    //           }
    //           throw new Error(`Expected not ${String(prop)}`);
    //         };
    //       }
    //       return target[prop];
    //     },
    //   });
    // },
    toBeUndefined() {
      if (actual !== undefined) {
        throw new Error(colors.red(`Expected ${actual} to be undefined`));
      }
    },
    // toThrow() {
    //   if (typeof actual !== 'function') {
    //     throw new Error(colors.red(`Expected ${actual} to be a function`));
    //   }
    //   try {
    //     actual();
    //   } catch (e) {
    //     return;
    //   }
    //   throw new Error(colors.red(`Expected ${actual} to throw`));
    // }
  };
}