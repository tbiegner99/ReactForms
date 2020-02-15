import LengthRangeRule from '../../../src/validation/rules/LengthRangeRule';
import InvalidValueError from '../../../src/validation/errors/InvalidValueError';

describe.only('LengthRangeRule', () => {
    it('exported as a type', () => {
        expect(typeof LengthRangeRule).toEqual('function');
    });

    it('has a name', () => {
        expect(LengthRangeRule.ruleName).toEqual('length-range');
    });

    it('can construct with no args', () => {
        const create = () => new LengthRangeRule();
        expect(create).not.toThrow();
        expect(create()).toBeInstanceOf(LengthRangeRule);
    });

    it('throws an error when trying to construct with illegal arguments', () => {
        let create = () => new LengthRangeRule('abc');
        expect(create).toThrow('Expected integer arg for min length but found abc');
        create = () => new LengthRangeRule(true);
        expect(create).toThrow('Expected integer arg for min length but found true');
        create = () => new LengthRangeRule({});
        expect(create).toThrow('Expected integer arg for min length but found [object Object]');
        create = () => new LengthRangeRule(1, 'abc');
        expect(create).toThrow('Expected integer arg for max length but found abc');
        create = () => new LengthRangeRule(1, true);
        expect(create).toThrow('Expected integer arg for max length but found true');
        create = () => new LengthRangeRule(1, {});
        expect(create).toThrow('Expected integer arg for max length but found [object Object]');
    });

    it('throws an error when trying to construct with illegal value', () => {
        let create = () => new LengthRangeRule(['-1']);
        expect(create).toThrow('Invalid min length -1. Length must be at least 0');
        create = () => new LengthRangeRule(5, 4);
        expect(create).toThrow(
            'Invalid length range passed to min length rule (5, 4). Max length must be greater than min length'
        );
    });

    it('successfully constructs rule with valid arguments', () => {
        let create = () => new LengthRangeRule(null, 1);
        expect(create).not.toThrow();
        create = () => new LengthRangeRule(5, 8); // should ignore 2nd value
        expect(create).not.toThrow();
        create = () => new LengthRangeRule(1, 3); // should ignore 2nd value
        expect(create).not.toThrow();
    });

    describe('with valid instance', () => {
        let rule;
        beforeEach(() => {
            rule = new LengthRangeRule(3, 5);
        });

        it('has an implementation of validate', () => {
            expect(typeof rule.validate).toEqual('function');
        });

        it('returns a resolved promise on successfull validation (non empty value)', async () => {
            await expect(rule.validate('Hell')).resolves;
            await expect(rule.validate(123)).resolves;
        });

        it('returns a rejected promise if length is less than min length', async () =>
            expect(rule.validate('12')).rejects.toBeInstanceOf(InvalidValueError));

        it('returns a rejected promise if length is greater than max length', async () =>
            expect(rule.validate('123456')).rejects.toBeInstanceOf(InvalidValueError));

        it('returns a rejected promise on empty string', async () =>
            expect(rule.validate('')).rejects.toBeInstanceOf(InvalidValueError));

        it('returns a rejected promise on null', async () =>
            expect(rule.validate(null)).rejects.toBeInstanceOf(InvalidValueError));

        it('returns a rejected promise on undefined', async () =>
            expect(rule.validate(null)).rejects.toBeInstanceOf(InvalidValueError));
    });
});
