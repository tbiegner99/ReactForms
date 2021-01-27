import Validator from '../../../src/validation/validator/Validator';
import RequiredRule from '../../../src/validation/rules/RequiredRule';
import NumberRule from '../../../src/validation/rules/NumberRule';
import Rule from '../../../src/validation/Rule';

const EXPECTED_AN_ERROR = new Error('Expected an error');
class SlowRejectRule extends Rule {
  static get name() {
    return 'slow-reject';
  }

  validateValue() {
    return new Promise((resolve, reject) => {
      setTimeout(2000, reject);
    });
  }
}
describe('Validator', () => {
  describe('validates a value given a rule configuration', () => {
    it('returns valid response for empty configuration', async () => {
      expect(await Validator.validate()).toEqual({
        numberOfInvalidElements: 0,
        valid: true,
        message: null,
        ruleName: null,
        numberOfRulesViolated: 0
      });
    });
    describe('for simple single priority rule set', () => {
      it('returns a resolved promise for valid value', async () => {
        const ruleConfig = [
          {
            rule: new RequiredRule(),
            message: 'This is required',
            priority: 0
          }
        ];
        const result = await Validator.validate('a', ruleConfig);
        expect(result).toEqual({
          numberOfInvalidElements: 0,
          valid: true,
          results: [
            {
              ruleName: 'required',
              valid: true
            }
          ],
          message: null,
          ruleName: null,
          numberOfRulesViolated: 0
        });
      });

      it('returns a resolved promise for invalid value', async () => {
        const ruleConfig = [
          {
            rule: new RequiredRule(),
            message: 'This is required',
            priority: 0
          }
        ];
        try {
          await Validator.validate('', ruleConfig);
        } catch (err) {
          expect(err).toEqual({
            numberOfInvalidElements: 1,
            valid: false,
            results: [
              {
                message: 'This is required',
                ruleName: 'required',
                valid: false
              }
            ],
            message: 'This is required',
            ruleName: 'required',
            numberOfRulesViolated: 1
          });
          return;
        }
        throw EXPECTED_AN_ERROR;
      });

      it('when message is a function it invokes it to get message value', async () => {
        const ruleConfig = [
          {
            rule: new NumberRule(),
            message: (value) => `${value} is not a number`,
            priority: 0
          }
        ];
        try {
          await Validator.validate('ABC', ruleConfig);
        } catch (err) {
          expect(err).toEqual({
            numberOfInvalidElements: 1,
            valid: false,
            results: [
              {
                message: 'ABC is not a number',
                ruleName: 'number',
                valid: false
              }
            ],
            message: 'ABC is not a number',
            ruleName: 'number',
            numberOfRulesViolated: 1
          });
          return;
        }
        throw EXPECTED_AN_ERROR;
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
          numberOfInvalidElements: 1,
          valid: false,
          results: [
            {
              message: 'This is required',
              ruleName: 'required',
              valid: false
            },
            {
              message: 'This is a reject rule',
              ruleName: 'slow-reject',
              valid: false
            }
          ],
          message: 'This is required',
          ruleName: 'required',
          numberOfRulesViolated: 2
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
            name: 'custom-name',
            priority: 0
          }
        ];
        return expect(Validator.validate('a', ruleConfig)).rejects.toEqual({
          numberOfInvalidElements: 1,
          valid: false,
          ruleName: 'custom-name',
          results: [
            {
              ruleName: 'required',
              valid: true
            },
            {
              message: 'This is a reject rule',
              ruleName: 'custom-name',
              valid: false
            }
          ],
          message: 'This is a reject rule',
          numberOfRulesViolated: 1
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
          numberOfInvalidElements: 1,
          valid: false,
          ruleName: 'slow-reject',
          results: [
            {
              message: 'This is a reject rule',
              ruleName: 'slow-reject',
              valid: false
            },
            {
              message: 'This is required',
              ruleName: 'required',
              valid: false
            }
          ],
          message: 'This is a reject rule',
          numberOfRulesViolated: 2
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
            priority: 1,
            name: 'rule2'
          }
        ];
        return expect(Validator.validate('a', ruleConfig)).resolves.toEqual({
          numberOfInvalidElements: 0,
          valid: true,
          message: null,
          results: [
            {
              ruleName: 'required',
              valid: true
            }
          ],
          ruleName: null,
          numberOfRulesViolated: 0
        });
      });
      it('does not evaluate rules of lower priority if rules of higher priority fail (fail fast)', async () => {
        const ruleConfig = [
          {
            rule: new RequiredRule(),
            message: 'This is required',
            priority: 0,
            name: 'custom-name'
          },
          {
            rule: new SlowRejectRule(),
            message: 'This is a reject rule',
            priority: 1
          }
        ];
        await expect(Validator.validate('', ruleConfig)).rejects.toEqual({
          numberOfInvalidElements: 1,
          valid: false,
          message: 'This is required',
          results: [{ message: 'This is required', valid: false, ruleName: 'custom-name' }],
          numberOfRulesViolated: 1,
          ruleName: 'custom-name'
        });
        expect(slowRule.validate).not.toBeCalled();
      });
    });
  });
});
