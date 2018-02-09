import Validator from '../../../src/validation/validator/Validator';
import RequiredRule from '../../../src/validation/rules/RequiredRule';
import NumberRule from '../../../src/validation/rules/NumberRule';
import Rule from '../../../src/validation/Rule';

class SlowRejectRule extends Rule {
    validateValue() {
        return new Promise((resolve, reject) => {
            setTimeout(2000, reject);
        });
    }
}

describe('vlidates a value given a rule configuration', () => {
    describe('for simple single priority rule set', () => {
        it('returns a resolved promise for valid value', () => {
            const ruleConfig = [
                {
                    rule: new RequiredRule(),
                    message: 'This is required',
                    priority: 0
                }
            ];
            return expect(Validator.validate('a', ruleConfig)).resolves.toEqual({
                invalidElements: 0,
                isAllValid: true,
                message: null,
                rulesViolated: 0
            });
        });

        it('returns a resolved promise for invalid value', () => {
            const ruleConfig = [
                {
                    rule: new RequiredRule(),
                    message: 'This is required',
                    priority: 0
                }
            ];
            return expect(Validator.validate('', ruleConfig)).rejects.toEqual({
                invalidElements: 1,
                isAllValid: false,
                message: 'This is required',
                rulesViolated: 1
            });
        });

        it('when message is a function it invokes it to get message value', () => {
            const ruleConfig = [
                {
                    rule: new NumberRule(),
                    message: (value) => `${value} is not a number`,
                    priority: 0
                }
            ];
            return expect(Validator.validate('ABC', ruleConfig)).rejects.toEqual({
                invalidElements: 1,
                isAllValid: false,
                message: 'ABC is not a number',
                rulesViolated: 1
            });
        });

        it('validates all rules in the rule set even if the first fails', () => {
            const ruleConfig = [
                {
                    rule: new RequiredRule(),
                    message: 'This is required',
                    priority: 0
                },
                {
                    rule: new SlowRejectRule(),
                    message: 'This is a reject rule',
                    priority: 0
                }
            ];
            return expect(Validator.validate('', ruleConfig)).rejects.toEqual({
                invalidElements: 1,
                isAllValid: false,
                message: 'This is required',
                rulesViolated: 2
            });
        });

        it('will fail if any rule fails', () => {
            const ruleConfig = [
                {
                    rule: new RequiredRule(),
                    message: 'This is required',
                    priority: 0
                },
                {
                    rule: new SlowRejectRule(),
                    message: 'This is a reject rule',
                    priority: 0
                }
            ];
            return expect(Validator.validate('a', ruleConfig)).rejects.toEqual({
                invalidElements: 1,
                isAllValid: false,
                message: 'This is a reject rule',
                rulesViolated: 1
            });
        });

        it('returns message of 1st failed rule in config despte execution order', () => {
            const ruleConfig = [
                {
                    rule: new SlowRejectRule(),
                    message: 'This is a reject rule',
                    priority: 0
                },
                {
                    rule: new RequiredRule(),
                    message: 'This is required',
                    priority: 0
                }
            ];
            return expect(Validator.validate('', ruleConfig)).rejects.toEqual({
                invalidElements: 1,
                isAllValid: false,
                message: 'This is a reject rule',
                rulesViolated: 2
            });
        });
    });

    describe('with rules of varying priority', () => {
        let slowRule;
        beforeEach(() => {
            slowRule = new SlowRejectRule();
            jest.spyOn(slowRule, 'validate');
        });
        afterEach(() => {
            jest.restoreAllMocks();
        });
        it('returns resolved promise if all rules pass', () => {
            const ruleConfig = [
                {
                    rule: new RequiredRule(),
                    message: 'This is required',
                    priority: 0
                },
                {
                    rule: new RequiredRule(),
                    message: 'This is a reject rule',
                    priority: 1
                }
            ];
            return expect(Validator.validate('a', ruleConfig)).resolves.toEqual({
                invalidElements: 0,
                isAllValid: true,
                message: null,
                rulesViolated: 0
            });
        });
        it('does not evaluate rules of lower priority if rules of higher priority fail (fail fast)', async () => {
            const ruleConfig = [
                {
                    rule: new RequiredRule(),
                    message: 'This is required',
                    priority: 0
                },
                {
                    rule: new SlowRejectRule(),
                    message: 'This is a reject rule',
                    priority: 1
                }
            ];
            await expect(Validator.validate('', ruleConfig)).rejects.toEqual({
                invalidElements: 1,
                isAllValid: false,
                message: 'This is required',
                rulesViolated: 1
            });
            expect(slowRule.validate).not.toBeCalled();
        });
    });
});
