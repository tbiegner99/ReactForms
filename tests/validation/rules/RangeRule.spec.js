import RangeRule from '../../../src/validation/rules/RangeRule';

describe('RangeRule', () => {
  it('exported as a type', () => {
    expect(typeof RangeRule).toEqual('function');
  });

  it('has a name', () => {
    expect(RangeRule.ruleName).toEqual('range');
  });

  it('throws an error when trying to construct with no args', () => {
    const create = () => new RangeRule();
    expect(create).toThrow();
  });

  it('throws an error when trying to construct with null, boolean, or non', () => {
    let create = () => new RangeRule(8, null);
    expect(create).toThrow();
    create = () => new RangeRule(true, 5);
    expect(create).toThrow();
    create = () => new RangeRule({}, 8);
    expect(create).toThrow();
    create = () => new RangeRule([8, undefined]);
    expect(create).toThrow();
  });

  it('successfully constructs rule with valid arguments', () => {
    let create = () => new RangeRule(1, 7);
    expect(create).not.toThrow();
    create = () => new RangeRule([1, 9]);
    expect(create).not.toThrow();
    create = () => new RangeRule(() => true, () => true);
    expect(create).not.toThrow();
    create = () => new RangeRule(new Date(), new Date());
    expect(create).not.toThrow();
    create = () => new RangeRule('', '');
    expect(create).not.toThrow();
  });

  describe('with valid instance', () => {
    let rule;
    beforeEach(() => {
      rule = new RangeRule([2, 9]);
    });

    it('has an implementation of validate', () => {
      expect(typeof rule.validate).toEqual('function');
    });

    it('does not validate null value', async () => {
      await expect(rule.validate(null)).resolves.toBeUndefined();
      await expect(rule.validate()).resolves.toBeUndefined();
      await expect(rule.validate(0)).rejects.toBeDefined();
    });

    describe('with numeric values as limits', () => {
      describe('valid values', () => {
        beforeEach(() => {
          rule = new RangeRule(-3, 7);
        });
        [-3, 0.6, 0, 4.7, 6, 7].forEach((validNumber) => {
          it(`returns ${validNumber} as valid`, async () => {
            await rule.validate(validNumber);
          });
        });
      });

      describe('invalid values', () => {
        beforeEach(() => {
          rule = new RangeRule([-3, 7]);
        });
        [-3.1, 7.9].forEach((invalidNumber) => {
          it(`returns ${invalidNumber} as valid`, async () => {
            try {
              await rule.validate(invalidNumber);
            } catch (err) {
              return;
            }
            throw new Error();
          });
        });
      });
    });

    describe('with dates as limits', () => {
      describe('valid values', () => {
        beforeEach(() => {
          rule = new RangeRule(new Date(3000), new Date(5000));
        });
        [new Date(3000), new Date(4000), new Date(5000)].forEach((validNumber) => {
          it(`returns ${validNumber} as valid`, async () => {
            await rule.validate(validNumber);
          });
        });
      });

      describe('invalid values', () => {
        beforeEach(() => {
          rule = new RangeRule(new Date(3000), new Date(5000));
        });
        [new Date(2999), new Date(5001)].forEach((invalidNumber) => {
          it(`returns ${invalidNumber} as valid`, async () => {
            try {
              await rule.validate(invalidNumber);
            } catch (err) {
              return;
            }
            throw new Error();
          });
        });
      });
    });
  });
});
