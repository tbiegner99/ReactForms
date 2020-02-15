import LengthMaxRule from '../../../src/validation/rules/LengthMaxRule';
import InvalidValueError from '../../../src/validation/errors/InvalidValueError';

describe('LengthMaxRule', () => {
    it('exported as a type', () => {
        expect(typeof LengthMaxRule).toEqual('function');
    });

    it('has a name', () => {
        expect(LengthMaxRule.ruleName).toEqual('max-length');
    });

    it('throws an error when trying to construct with no args', () => {
        const create = () => new LengthMaxRule();
        expect(create).toThrow('Expected integer for max length but found undefined');
    });

    it('throws an error when trying to construct with invalid number', () => {
        let create = () => new LengthMaxRule('abc');
        expect(create).toThrow('Expected integer for max length but found abc');
        create = () => new LengthMaxRule(true);
        expect(create).toThrow('Expected integer for max length but found true');
        create = () => new LengthMaxRule({});
        expect(create).toThrow('Expected integer for max length but found [object Object]');
    });

    it('throws an error when trying to construct with illegal value', () => {
        let create = () => new LengthMaxRule('-1');
        expect(create).toThrow('Invalid max length -1. Length must be greater than 0');
        create = () => new LengthMaxRule(-1);
        expect(create).toThrow('Invalid max length -1. Length must be greater than 0');
    });

    it('successfully constructs rule with valid arguments', () => {
        let create = () => new LengthMaxRule([1]);
        expect(create).not.toThrow();
        create = () => new LengthMaxRule([5, 8]); // should ignore 2nd value
        expect(create).not.toThrow();
    });

    describe('with valid instance', async () => {
        let rule;
        beforeEach(() => {
            rule = new LengthMaxRule([5]);
        });

        it('has an implementation of validate', async () => {
            await expect(typeof rule.validate).toEqual('function');
        });

        it('returns a rejected promise on string greater than max length', async () => {
            await expect(rule.validate(123456)).rejects.toBeInstanceOf(InvalidValueError);
        });

        it('returns a successfull promise if length is less than or equal to max length', async () => {
            const testStrings = ['', '1', '12', '123', '1234', '12345'];
            await testStrings.forEach(async (str) => {
                await expect(rule.validate(str)).resolves.toBeUndefined();
            });
        });

        it('returns a resolved promise on empty string', async () => {
            await expect(rule.validate('')).resolves.toBeUndefined();
        });

        it('returns a resolved promise on null', async () => {
            await expect(rule.validate(null)).resolves.toBeUndefined();
        });

        it('returns a rejected promise on undefined', async () => {
            await expect(rule.validate(undefined)).resolves.toBeUndefined();
        });
    });
});
