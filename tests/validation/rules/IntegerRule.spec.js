import IntegerRule from '../../../src/validation/rules/IntegerRule';
import Rule from '../../../src/validation/Rule';

describe.only('IntegerRule', () => {
    it('exported as a type', () => {
        expect(typeof IntegerRule).toEqual('function');
    });

    it('has a name', () => {
        expect(IntegerRule.ruleName).toEqual('integer');
    });

    describe('when instantiated successully', () => {
        let rule = null;
        beforeEach(() => {
            rule = new IntegerRule();
        });
        it('is a rule type', () => {
            expect(rule).toBeInstanceOf(Rule);
        });

        it('has an implementation of validate', () => {
            expect(typeof rule.validate).toEqual('function');
        });

        it('returns a resoved promise for decimal numbers stripping decimals', () =>
            expect(rule.validate('34.56')).resolves.toBe(34));

        it('returns a resolved promise for integers', () =>
            expect(rule.validate('34')).resolves.toEqual(34));

        it('returns a resolved promise for negative numbers', () =>
            expect(rule.validate('-34')).resolves.toEqual(-34));

        it('returns a rejected promise for invalid number string', () =>
            expect(rule.validate('a9a')).rejects.toBeDefined());

        it('returns a resolved promise for partial number string', () =>
            expect(rule.validate('14.')).resolves.toBe(14));

        it('returns a rejected promise for invalid partial number string2', () =>
            expect(rule.validate('-')).rejects.toBeDefined());

        describe('for different bases', () => {
            let hexRule = null;
            beforeEach(() => {
                hexRule = new IntegerRule([16]);
            });

            it('returns a resolved promise for hex numbers', () =>
                expect(hexRule.validate('9A')).resolves.toBe(154));

            it('resolves with expected value', () =>
                hexRule.validate('A').then((value) => {
                    expect(value).toEqual(10);
                }));
        });
    });
});
