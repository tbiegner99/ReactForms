import MaxFileSizeRule from '../../../src/validation/rules/MaxFileSizeRule';

describe('MatchesFieldRule', () => {
  it('exported as a type', () => {
    expect(typeof MaxFileSizeRule).toEqual('function');
  });

  it('has a name', () => {
    expect(MaxFileSizeRule.ruleName).toEqual('max-size');
  });

  it('throws an error when trying to construct with no args', () => {
    const create = () => new MaxFileSizeRule();
    expect(create).toThrow();
  });

  it('throws an error when trying to construct with null, boolean, or non', () => {
    let create = () => new MaxFileSizeRule(true);
    expect(create).toThrow();
    create = () => new MaxFileSizeRule({});
    expect(create).toThrow();
    create = () => new MaxFileSizeRule();
    expect(create).toThrow();
  });
  it('accepts single arg array', () => {
    const create = () => new MaxFileSizeRule(['4k']);
    expect(create).not.toThrow();
  });

  ['2Gb', 'g'].forEach((invalidArg) => {
    it(`throws on invalid string arg ${invalidArg}`, () => {
      const create = () => new MaxFileSizeRule(invalidArg);
      expect(create).toThrow();
    });
  });

  [468, '20', '2G', '2g', '2M', '20m', '14k', '1K', '6  g'].forEach((validArg) => {
    it(`successfully constructs rule with valid argument ${validArg}`, () => {
      const create = () => new MaxFileSizeRule(validArg);
      expect(create).not.toThrow();
    });
  });

  describe('with valid instance', () => {
    let rule;
    beforeEach(() => {
      rule = new MaxFileSizeRule(1024);
    });
    it('has correct error message', () => {
      expect(rule.getDefaultMessage({ name: 'file.jpg', size: 1025 })).toEqual(
        'Max size 1024 exceeded for file file.jpg. File size: 1025'
      );
    });

    it('passes validation when null value is passed', async () => {
      await rule.validate(null);
    });

    const generatePassedTest = (size, limit) => {
      it(`throws error when size ${size} exceeds limit ${limit}`, async () => {
        rule = new MaxFileSizeRule([limit]);
        await rule.validate({ size });
      });
    };

    generatePassedTest(450, 450);
    generatePassedTest(1024, '1k');
    generatePassedTest(1024 * 1024, '1M');
    generatePassedTest(1024 * 1024 * 1024, '1G');

    it('throws error when value  is not object', async () => {
      try {
        await rule.validate(3);
      } catch (err) {
        return;
      }
      throw new Error('expected error');
    });
    it('throws error when size  is not number', async () => {
      try {
        await rule.validate({ size: null });
      } catch (err) {
        return;
      }
      throw new Error('expected error');
    });

    const generateExceedTest = (size, limit) => {
      it(`throws error when size ${size} exceeds limit ${limit}`, async () => {
        try {
          rule = new MaxFileSizeRule([limit]);
          await rule.validate({ size });
        } catch (err) {
          return;
        }
        throw new Error('expected error');
      });
    };

    generateExceedTest(450, '449');
    generateExceedTest(1025, '1k');
    generateExceedTest(1024 * 1024 + 1, '1M');
    generateExceedTest(1024 * 1024 * 1024 + 1, '1G');
  });
});
