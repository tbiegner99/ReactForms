import ValueEnforcer from '../../src/utils/ValueEnforcer';

describe('Validation enforcer', () => {
    it('uses default value if value is not of type', () => {
        expect(ValueEnforcer.toBeType(4, 'string', 'a')).toBe('a');
        expect(ValueEnforcer.toBeType('b', 'string', 'a')).toBe('b');
    });

    it('uses default value if value is not one of supplied types', () => {
        const func = () => {};
        expect(ValueEnforcer.toBeOneOfType(4, ['string', 'function'], 'a')).toBe('a');
        expect(ValueEnforcer.toBeOneOfType('b', ['string', 'function'], 'a')).toBe('b');
        expect(ValueEnforcer.toBeOneOfType(func, ['string', 'function'], 'a')).toBe(func);
    });

    it('uses default value if value is not object', () => {
        expect(ValueEnforcer.toBeObject(4, {})).toEqual({});
        expect(ValueEnforcer.toBeObject({ a: 'b' }, 'a')).toEqual({ a: 'b' });
    });

    it('uses default value if value is not string', () => {
        expect(ValueEnforcer.toBeString(4, {})).toEqual({});
        expect(ValueEnforcer.toBeString('b', 'a')).toEqual('b');
    });

    it('uses default value if value is not func', () => {
        const func = () => {};
        expect(ValueEnforcer.toBeFunction(4, 3)).toEqual(3);
        expect(ValueEnforcer.toBeFunction(func, 'a')).toEqual(func);
    });

    it('uses default value if value is not null or undefined', () => {
        expect(ValueEnforcer.toNotBeNullOrUndefined(4, 3)).toEqual(4);
        expect(ValueEnforcer.toNotBeNullOrUndefined(null, 3)).toEqual(3);
        expect(ValueEnforcer.toNotBeNullOrUndefined(undefined, 3)).toEqual(3);
    });
    it('uses default value if value is not truthy', () => {
        expect(ValueEnforcer.toBeTruthy('false', 3)).toEqual('false');
        expect(ValueEnforcer.toBeTruthy('', 3)).toEqual(3);
        expect(ValueEnforcer.toBeTruthy(false, 3)).toEqual(3);
        expect(ValueEnforcer.toBeTruthy(0, 3)).toEqual(3);
        expect(ValueEnforcer.toBeTruthy(null, 3)).toEqual(3);
        expect(ValueEnforcer.toBeTruthy(undefined, 3)).toEqual(3);
    });
});
