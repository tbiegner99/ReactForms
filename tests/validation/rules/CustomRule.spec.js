import CustomRule from '../../../src/validation/rules/CustomRule';
import Rule from '../../../src/validation/Rule';

describe('CustomRule', () => {
  it('exported as a type', async () => {
    expect(typeof CustomRule).toEqual('function');
  });

  it('has a name', async () => {
    expect(CustomRule.ruleName).toEqual('custom');
  });

  describe('when instantiated successully', () => {
    let rule = null;
    beforeEach(() => {
      rule = new CustomRule((value) => value === 'a');
    });
    it('is a rule type', async () => {
      expect(rule).toBeInstanceOf(Rule);
    });
    it('has correct default message', () => {
      expect(rule.getDefaultMessage('value')).toEqual(
        'Custom rule has failed validation on value.'
      );
    });
    describe('valid values', () => {
      [true, 1, 'a', {}, new Error()].forEach((validValue) => {
        it(`passes when function returns truthy value ${validValue}`, async () => {
          const func = jest.fn().mockReturnValue(validValue);
          rule = new CustomRule([func]);
          await rule.validate('some-value');
          expect(func).toHaveBeenCalledTimes(1);
        });

        it(`passes when function returns truthy promise resolve ${validValue}`, async () => {
          const func = jest.fn().mockResolvedValue(validValue);
          rule = new CustomRule(func);
          await rule.validate('some-value');
          expect(func).toHaveBeenCalledTimes(1);
        });
      });
    });

    describe('invalid values', () => {
      it('fails when function rejects', async () => {
        const func = jest.fn().mockRejectedValue(true);
        rule = new CustomRule(func);
        try {
          await rule.validate('some-value');
        } catch (err) {
          expect(func).toHaveBeenCalledTimes(1);
          return;
        }
        throw new Error('expected failure');
      });
      [false, 0, '', null, undefined].forEach((invalidValue) => {
        it(`fails when function returns falsy value ${invalidValue}`, async () => {
          const func = jest.fn().mockReturnValue(invalidValue);
          rule = new CustomRule(func);
          try {
            await rule.validate('some-value');
          } catch (err) {
            expect(func).toHaveBeenCalledTimes(1);
            return;
          }
          throw new Error('expected failure');
        });

        it(`passes when function returns falsy promise resolve ${invalidValue}`, async () => {
          const func = jest.fn().mockResolvedValue(invalidValue);
          rule = new CustomRule(func);
          try {
            await rule.validate('some-value');
          } catch (err) {
            expect(func).toHaveBeenCalledTimes(1);
            return;
          }
          throw new Error('expected failure');
        });
      });
    });
  });
});
