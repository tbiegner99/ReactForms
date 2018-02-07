import MinRule from '../../../src/validation/rules/MinRule';
import InvalidValueError from '../../../src/validation/errors/InvalidValueError';

describe('MinRule', () => {
  it('exported as a type', () => {
    expect(typeof MinRule).toEqual('function');
  });

  it('has a name', () => {
    expect(MinRule.ruleName).toEqual('min');
  });

  it('throws an error when trying to construct with no args', () => {
    const create = () => new MinRule();
    expect(create).toThrow('Expected string, function, number, or date for rule argument');
  });

  it('throws an error when trying to construct with null, boolean, or non', () => {
    let create = () => new MinRule(null);
    expect(create).toThrow('Expected string, function, number, or date for rule argument');
    create = () => new MinRule(true);
    expect(create).toThrow('Expected string, function, number, or date for rule argument');
    create = () => new MinRule({});
    expect(create).toThrow('Expected string, function, number, or date for rule argument');
  });

  it('successfully constructs rule with valid arguments', () => {
    let create = () => new MinRule(1);
    expect(create).not.toThrow();
    create = () => new MinRule([1]);
    expect(create).not.toThrow();
    create = () => new MinRule(() => true);
    expect(create).not.toThrow();
    create = () => new MinRule(new Date());
    expect(create).not.toThrow();
    create = () => new MinRule('');
    expect(create).not.toThrow();
  });

  describe('with valid instance', () => {
    let rule;
    beforeEach(() => {
      rule = new MinRule([2]);
    });

    it('has an implementation of validate', () => {
      expect(typeof rule.validate).toEqual('function');
    });

    it('does not validate null value', () => {
      expect(rule.validate(null)).resolves.toBeUndefined();
      expect(rule.validate()).resolves.toBeUndefined();
      expect(rule.validate(0)).rejects.toBeDefined();
    });
  });

  describe('with number as max value comparison', () => {
    let rule;
    beforeEach(() => {
      rule = new MinRule([5]);
    });
    it('returns a  resolved promise if value is less than or equal to argument', () => {
      expect(rule.validate(8)).resolves.toBeUndefined();
      expect(rule.validate(5)).resolves.toBeUndefined();
    });

    it('returns a  rejected promise if value is not less than or equal to argument', () => {
      expect(rule.validate('-1')).rejects.toBeDefined();
      expect(rule.validate(3)).rejects.toBeDefined();
    });
  });

  describe('with string as max value comparison', () => {
    let rule;
    beforeEach(() => {
      rule = new MinRule(['cherry']);
    });
    it('returns a  resolved promise if value is less than or equal to argument', () => {
      expect(rule.validate('pear')).resolves.toBeDefined();
      expect(rule.validate('zebra')).resolves.toBeDefined();
    });

    it('returns a  rejected promise if value is not less than or equal to argument', () => {
      expect(rule.validate(5)).rejects.toBeDefined();
      expect(rule.validate('apple')).rejects.toBeUndefined();
      expect(rule.validate('c')).rejects.toBeUndefined();
    });
  });

  describe('with function as max value comparison', () => {
    let rule;
    beforeEach(() => {
      rule = new MinRule(value => value.field > 1);
    });
    it('returns a  resolved promise if value is less than or equal to argument', () => {
      expect(rule.validate({ field: 2 })).rejects.toBeDefined();
    });

    it('returns a  rejected promise if value is not less than or equal to argument', () => {
      expect(rule.validate({ field: 0 })).rejects.toBeDefined();
    });
  });

  describe('with function as max value comparison', () => {
    let rule;
    beforeEach(() => {
      rule = new MinRule(new Date());
    });
    it('returns a  resolved promise if value is less than or equal to argument', () => {
      expect(rule.validate(new Date(Number.MAX_VALUE))).resolves.toBeDefined();
    });

    it('returns a  rejected promise if value is not less than or equal to argument', () => {
      expect(rule.validate(new Date(0))).rejects.toBeDefined();
    });
  });
});
