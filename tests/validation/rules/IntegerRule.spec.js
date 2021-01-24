import IntegerRule from '../../../src/validation/rules/IntegerRule';
import Rule from '../../../src/validation/Rule';

describe('IntegerRule', () => {
  it('exported as a type', async () => {
    expect(typeof IntegerRule).toEqual('function');
  });

  it('has a name', async () => {
    expect(IntegerRule.ruleName).toEqual('integer');
  });

  describe('when instantiated successully', () => {
    let rule = null;
    beforeEach(() => {
      rule = new IntegerRule();
    });
    it('is a rule type', async () => {
      expect(rule).toBeInstanceOf(Rule);
    });

    it('has an implementation of validate', async () => {
      expect(typeof rule.validate).toEqual('function');
    });

    it('returns a resoved promise for decimal numbers stripping decimals', async () =>
      expect(rule.validate('34.56')).resolves.toBe(34));

    it('returns a resolved promise for integers', async () =>
      expect(rule.validate('34')).resolves.toEqual(34));

    it('returns a resolved promise for negative numbers', async () =>
      expect(rule.validate('-34')).resolves.toEqual(-34));

    it('returns a rejected promise for invalid number string', async () =>
      expect(rule.validate('a9a')).rejects.toBeDefined());

    it('returns a resolved promise for partial number string', async () =>
      expect(rule.validate('14.')).resolves.toBe(14));

    it('returns a rejected promise for invalid partial number string2', async () =>
      expect(rule.validate('-')).rejects.toBeDefined());

    describe('for different bases', () => {
      let hexRule = null;
      beforeEach(() => {
        hexRule = new IntegerRule([16]);
      });

      it('returns a resolved promise for hex numbers', async () =>
        expect(hexRule.validate('9A')).resolves.toBe(154));

      it('resolves with expected value', async () =>
        hexRule.validate('A').then((value) => {
          expect(value).toEqual(10);
        }));
    });
  });
});
