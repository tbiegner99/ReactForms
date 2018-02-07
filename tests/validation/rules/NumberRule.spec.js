import NumberRule from '../../../src/validation/rules/NumberRule';
import Rule from '../../../src/validation/Rule';

describe.only('NumberRule', () => {
    it('exported as a type', () => {
        expect(typeof NumberRule).toEqual('function');
    });

    it('has a name', () => {
        expect(NumberRule.ruleName).toEqual('number');
    });

    describe('when instantiated successully', () => {
        let rule = null;
        beforeEach(() => {
            rule = new NumberRule();
        });
        it('is a rule type', () => {
            expect(rule).toBeInstanceOf(Rule);
        });

        it('has an implementation of validate', () => {
            expect(typeof rule.validate).toEqual('function');
        });

        it('returns a resolved promise for decimal numbers', () =>
            expect(rule.validate('34.56')).resolves.toBe(34.56));

        it('returns a resolved promise for integers', () =>
            expect(rule.validate('34')).resolves.toBe(34));

        it('returns a resolved promise for negative numbers', () =>
            expect(rule.validate('-34.56')).resolves.toBe(-34.56));

        it('returns a rejected promise for invalid number string', () =>
            expect(rule.validate('a9a')).rejects.toBeDefined());

        it('returns a rejected promise for valid partial number string', () =>
            expect(rule.validate('14.')).resolves.toBe(14));

        it('returns a rejected promise for invalid partial number string2', () =>
            expect(rule.validate('-')).rejects.toBeDefined());
    });
});
