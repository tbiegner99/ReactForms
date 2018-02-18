import RegexRule from '../../../src/validation/rules/RegexRule';
import Rule from '../../../src/validation/Rule';

describe.only('RegexRule', () => {
    it('exported as a type', () => {
        expect(typeof RegexRule).toEqual('function');
    });

    it('has a name', () => {
        expect(RegexRule.ruleName).toEqual('regex');
    });

    it('throws an error if no regex or string supplied', () => {
        const create = () => new RegexRule();
        expect(create).toThrow('a');
        const create2 = () => new RegexRule(2);
        expect(create2).toThrow('a');
    });

    it('throws an error if no invalid regex string supplied', () => {
        const create = () => new RegexRule('[');
        expect(create).toThrow();
    });

    it('creates rule with valid regex string', () => {
        const create = () => new RegexRule('(a|b|c)');
        expect(create).not.toThrow();
    });

    it('creates rule with regex object', () => {
        const create = () => new RegexRule(/(a|b|c)/);
        expect(create).not.toThrow();
    });

    describe('when instantiated successully', () => {
        let rule = null;
        beforeEach(() => {
            rule = new RegexRule([/^(works|ok|go)$/]);
        });
        it('is a rule type', () => {
            expect(rule).toBeInstanceOf(Rule);
        });

        it('has an implementation of validate', () => {
            expect(typeof rule.validate).toEqual('function');
        });

        it('returns a resolved promise when regex matches', async () =>
            expect(rule.validate('works')).resolves.toBeUndefined());

        it('returns a rejected promise when regex fails to match', async () =>
            expect(rule.validate('itworks')).rejects.toBeDefined());
    });
});
