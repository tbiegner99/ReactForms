import RequiredRule from '../../../src/validation/rules/RequiredRule';
import InvalidValueError from '../../../src/validation/errors/InvalidValueError';

describe.only('RequiredRule', () => {
    let rule = null;
    beforeEach(() => {
        rule = new RequiredRule();
    });
    it('exported as a type', () => {
        expect(typeof RequiredRule).toEqual('function');
    });

    it('has a name', () => {
        expect(RequiredRule.ruleName).toEqual('required');
    });

    it('has an implementation of validate', () => {
        expect(typeof rule.validate).toEqual('function');
    });

    it('returns a resolved promise on successfull validation (non empty value)', () => {
        expect(rule.validate('Hello')).resolves.toBeUndefined();
        expect(rule.validate(6)).resolves.toBeUndefined();
    });

    it('returns a rejected promise on empty string', () => {
        expect(rule.validate('')).rejects.toBeInstanceOf(InvalidValueError);
    });

    it('returns a rejected promise on null', () => {
        expect(rule.validate(null)).rejects.toBeInstanceOf(InvalidValueError);
    });

    it('returns a rejected promise on undefined', () => {
        expect(rule.validate()).rejects.toBeInstanceOf(InvalidValueError);
    });
});
