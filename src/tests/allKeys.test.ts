import { allKeys, describe, expect, it } from "../index.js";

class Parent {
    age: 100;
    accessor experience = '10 years';
    get name() {
        return 'John Doe';
    }
}

class Child extends Parent {

    trauma = 'none';

    badHabits = 'many';

    accessor skills = 'arguing';

    get name() {
        return 'Jane Doe';
    }
}

describe('allKeys', () => {
    it('should return all keys including non-enumerable and accessors', () => {
        const obj = Object.create(
            { inherited: 'inherited' },
            {
                prop: { value: 'prop', enumerable: true },
                nonEnum: { value: 'nonEnum', enumerable: false },
                accessor: {
                    get() { return 'accessor'; },
                    enumerable: true,
                },
            }
        );

        const keys = allKeys(obj);
        expect(keys).toContain('prop');
        expect(keys).toContain('accessor');
        expect(keys).toContain('inherited');
    });
    it('should work with inherited properties', () => {
        const child = new Child();
        const keys = allKeys(child);
        expect(keys).toContain('age');
        expect(keys).toContain('experience');
        expect(keys).toContain('name');
        expect(keys).toContain('trauma');
        expect(keys).toContain('badHabits');
        expect(keys).toContain('skills');
    });
});