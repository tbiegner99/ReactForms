import EmailRule from '../../../src/validation/rules/EmailRule';
import Rule from '../../../src/validation/Rule';

describe('EmailRule', () => {
  it('exported as a type', async () => {
    expect(typeof EmailRule).toEqual('function');
  });

  it('has a name', async () => {
    expect(EmailRule.ruleName).toEqual('email');
  });

  describe('when instantiated successully', () => {
    let rule = null;
    beforeEach(() => {
      rule = new EmailRule();
    });
    it('is a rule type', async () => {
      expect(rule).toBeInstanceOf(Rule);
    });
    it('has correct default message', () => {
      expect(rule.getDefaultMessage('value')).toEqual('value is not a valid email.');
    });
    describe('valid values', () => {
      ['tbiegner99@gmail.com', 'tj@test.example.com', 'a@a.ac'].forEach((validValue) => {
        it(`validates  ${validValue} as a valid value`, async () => {
          await expect(rule.validate(validValue)).resolves.toBeUndefined();
        });
      });
    });

    describe('invalid values', () => {
      ['@', 'test', 'test@email'].forEach((invalidValue) => {
        it(`validates  ${invalidValue} as an invalid value`, async () => {
          await expect(rule.validate(invalidValue)).rejects.toBeDefined();
        });
      });
    });
  });
});
