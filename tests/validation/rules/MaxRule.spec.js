import MaxRule from '../../../src/validation/rules/MaxRule';

describe('MaxRule', () => {
  it('exported as a type', () => {
    expect(typeof MaxRule).toEqual('function');
  });

  it('has a name', () => {
    expect(MaxRule.ruleName).toEqual('max');
  });

  it('throws an error when trying to construct with no args', () => {
    const create = () => new MaxRule();
    expect(create).toThrow('Expected string, function, number, or date for rule argument');
  });

  it('throws an error when trying to construct with null, boolean, or non', () => {
    let create = () => new MaxRule(null);
    expect(create).toThrow('Expected string, function, number, or date for rule argument');
    create = () => new MaxRule(true);
    expect(create).toThrow('Expected string, function, number, or date for rule argument');
    create = () => new MaxRule({});
    expect(create).toThrow('Expected string, function, number, or date for rule argument');
  });

  it('successfully constructs rule with valid arguments', () => {
    let create = () => new MaxRule(1);
    expect(create).not.toThrow();
    create = () => new MaxRule([1]);
    expect(create).not.toThrow();
    create = () => new MaxRule(() => true);
    expect(create).not.toThrow();
    create = () => new MaxRule(new Date());
    expect(create).not.toThrow();
    create = () => new MaxRule('');
    expect(create).not.toThrow();
  });

  describe('with valid instance', () => {
    let rule;
    beforeEach(() => {
      rule = new MaxRule([-1]);
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
      rule = new MaxRule([5]);
    });
    it('returns a  resolved promise if value is less than or equal to argument', () => {
      expect(rule.validate(-1)).resolves.toBeUndefined();
      expect(rule.validate(5)).resolves.toBeUndefined();
    });

    it('returns a  rejected promise if value is not less than or equal to argument', () => {
      expect(rule.validate('-1')).rejects.toBeDefined();
      expect(rule.validate(6)).rejects.toBeDefined();
    });
  });

  describe('with string as max value comparison', () => {
    let rule;
    beforeEach(() => {
      rule = new MaxRule(['cherry']);
    });
    it('returns a  resolved promise if value is less than or equal to argument', () => {
      expect(rule.validate('apple')).resolves.toBeUndefined();
      expect(rule.validate('c')).resolves.toBeUndefined();
    });

    it('returns a  rejected promise if value is not less than or equal to argument', () => {
      expect(rule.validate(5)).rejects.toBeDefined();
      expect(rule.validate('pear')).rejects.toBeDefined();
    });
  });

  describe('with function as max value comparison', () => {
    let rule;
    beforeEach(() => {
      rule = new MaxRule(value => value.field > 1);
    });
    it('returns a  resolved promise if value is less than or equal to argument', () => {
      expect(rule.validate({ field: 2 })).rejects.toBeDefined();
    });

    it('returns a  rejected promise if value is not less than or equal to argument', () => {
      expect(rule.validate({ field: 0 })).rejects.toBeDefined();
    });
  });

  describe('with date as max value comparison', () => {
    let rule;
    beforeEach(() => {
      rule = new MaxRule(new Date());
    });
    it('returns a  resolved promise if value is less than or equal to argument', () => {
      expect(rule.validate(new Date(0))).resolves.toBeDefined();
    });

    it('returns a  rejected promise if value is not less than or equal to argument', () => {
      expect(rule.validate(new Date(Number.MAX_VALUE))).rejects.toBeDefined();
    });
  });
});
