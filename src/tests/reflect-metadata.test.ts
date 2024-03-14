import { ConstructorOrFunction, assert, metadata } from "../index.js";
import { expect, it, describe } from "../index.js";

// Lifecycle: AccessorDecorator -> MethodDecorator -> FieldDecorator -> ClassDecorator -> Fields Assignments -> Constructor -> Method Calls
function ClassDecorator() {
    return function (target: ConstructorOrFunction<any>, context: ClassDecoratorContext) {
        const testValue = metadata.get(context, 'metaNum', { answer: 42 }) as { answer: number };
        assert(testValue, `metadata not defined for ${target.name}`)
        testValue.answer++;
        // console.debug("ClassDecorator", testValue); // 46
    }
}

function FieldDecorator() {
    return function <This, Value>(target: undefined, context: ClassFieldDecoratorContext<This, Value>) {
        const testValue = metadata.get<{ answer: number }>(context, 'metaNum', { answer: 42 }) as { answer: number };
        assert(testValue, `metadata not defined for ${String(context.name)}`)
        testValue.answer++;
        // console.debug("FieldDecorator", testValue); // 45
        return function (args: Value) {
            return args;
        }
    }
}

function AccessorDecorator() {
    return function <This, Value>(accessor: ClassAccessorDecoratorTarget<This, Value>, context: ClassAccessorDecoratorContext<This, Value>) {
        const testValue = metadata.get<{ answer: number }>(context, 'metaNum', { answer: 42 }) as { answer: number };
        assert(testValue, `metadata not defined for ${String(context.name)}`)
        testValue.answer++;
        // console.debug("AccessorDecorator", testValue); // 43
        return {
            get: function (this: This) {
                return accessor.get.call(this);
            },
            set: function (this: This, value: Value) {
                accessor.set.call(this, value);
            }
        }
    }
}

function MethodDecoratorFirst() {
    return function <This, F extends (this: This, ...args: any) => any>(method: F, context: ClassMethodDecoratorContext<This, F>) {
        const testValue = metadata.get<{ answer: number }>(context, 'metaNum') as { answer: number };
        assert(testValue, `metadata not defined for ${String(context.name)}`)
        testValue.answer++;
        // console.debug("First MethodDecorator", testValue); // 44
        return function (this: This, ...args: any) {
            return method.call(this, args);
        }
    }
}

function MethodDecoratorSecond() {
    return function <This, F extends (this: This, ...args: any) => any>(method: F, context: ClassMethodDecoratorContext<This, F>) {
        const testValue = metadata.get<{ answer: number }>(context, 'metaNum') as { answer: number };
        assert(testValue, `metadata not defined for ${String(context.name)}`)
        testValue.answer++;
        // console.debug("Second MethodDecorator", testValue); // 44
        return function (this: This, ...args: any) {
            return method.call(this, args);
        }
    }
}

@ClassDecorator()
class TestClass {
    constructor() {
        // console.debug("TestClass constructor", metadata.get(this, 'metaNum'));
    }

    @FieldDecorator()
    testField: string;

    @AccessorDecorator()
    accessor testAccessor: string;
    
    @MethodDecoratorSecond()
    @MethodDecoratorFirst()
    testMethod() {
        // console.debug("testMethod metaNum", metadata.get(this, 'metaNum'));
    }
}

describe('reflect-metadata', () => {
    it('decorators can define metadata', () => {
        const metaNum = (<any>metadata.get<{ answer: string }>(TestClass, 'metaNum')).answer;
        expect(metaNum).toBeGreaterThan(45);
    });
    it('constructor can read metadata', () => {
        const testClass = new TestClass();
        const metaNum = (<any>metadata.get<{ answer: string }>(testClass, 'metaNum')).answer;
        expect(metaNum).toBeGreaterThan(42);
    });
    it('methods can access metadata', () => {
        const testClass = new TestClass();
        const metaNum = (<any>metadata.get<{ answer: string }>(testClass, 'metaNum')).answer;
        testClass.testMethod();
        expect(metaNum).toBeGreaterThan(42);
    });
});