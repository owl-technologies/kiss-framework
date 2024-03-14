import { InitJson, Length, KissData, Optional, Required } from "../index.js";
import { describe, expect, it } from "../index.js";

const p1 = {
    "protocol-version": 0.2,
    "name": "John Doe",
    "age": 42
}

const p2 = {
    "protocol-version": 0.2,
    "name": "Jane Doe",
}

const p3 = {
    "protocol-version": 0.2,
    "name": "L",
}

const p4 = {
    "protocol-version": 0.2,
    "age": "42"
}

class TestPerson extends KissData {

    @InitJson()
    @Required()
    @Length(2, 32)
    name: string;

    @InitJson()
    @Optional()
    age: number;

}

describe('KissData', () => {

    it('should work with valid object', () => {
        const p = new TestPerson(p1);
        expect(p.name).toBe('John Doe');
        expect(p.age).toBe(42);
    });

    it('should work with valid object without optional field', () => {
        const p = new TestPerson(p2);
        expect(p.name).toBe('Jane Doe');
        expect(p.age).toBeUndefined();
    });

    it('should detect that length is wrong', () => {
        try {
            new TestPerson(p3);
        } catch (e) {
            expect(e).toBeInstanceOf(Error);
        }
    });

    it('should detect that name field is missing', () => {
        try {
            new TestPerson(p4);
        } catch (e) {
            expect(e).toBeInstanceOf(Error);
        }
    });

});