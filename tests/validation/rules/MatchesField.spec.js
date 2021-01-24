import MatchesFieldRule from '../../../src/validation/rules/MatchesFieldRule';

describe('MatchesFieldRule', () => {
  it('exported as a type', () => {
    expect(typeof MatchesFieldRule).toEqual('function');
  });

  it('has a name', () => {
    expect(MatchesFieldRule.ruleName).toEqual('matches-field');
  });

  it('has lowest priority', () => {
    expect(MatchesFieldRule.priority).toEqual(Number.MAX_SAFE_INTEGER);
  });

  it('throws an error when trying to construct with no args', () => {
    const create = () => new MatchesFieldRule();
    expect(create).toThrow();
  });

  it('throws an error when trying to construct with null, boolean, or non', () => {
    let create = () => new MatchesFieldRule(8);
    expect(create).toThrow();
    create = () => new MatchesFieldRule(true);
    expect(create).toThrow();
    create = () => new MatchesFieldRule({});
    expect(create).toThrow();
    create = () => new MatchesFieldRule();
    expect(create).toThrow();
  });

  it('successfully constructs rule with valid arguments', () => {
    let create = () => new MatchesFieldRule('field1');
    expect(create).not.toThrow();
    create = () => new MatchesFieldRule(['field1']);
    expect(create).not.toThrow();
  });

  describe('with valid instance', () => {
    let rule;
    beforeEach(() => {
      rule = new MatchesFieldRule('field1');
    });
    it('has correct error message', () => {
      expect(rule.getDefaultMessage()).toEqual('Value should match field field1');
    });
    describe('when value matches target field', () => {
      it('is a valid value', async () => {
        await rule.validate('1', { field1: '1' });
      });
      it('resolves when field doesnt exist and value is undefined', async () => {
        await rule.validate(undefined, {});
      });
    });

    describe('when value doesnt match field', () => {
      it('rejects', async () => {
        try {
          await rule.validate('1', { field1: 1 });
        } catch (err) {
          return;
        }
        throw new Error('expected failure');
      });
      it('rejects when field doesnt exist', async () => {
        try {
          await rule.validate('1', {});
        } catch (err) {
          return;
        }
        throw new Error('expected failure');
      });
      it('rejects when field doesnt exist and value is null', async () => {
        try {
          await rule.validate(null, {});
        } catch (err) {
          return;
        }
        throw new Error('expected failure');
      });
    });
  });
});
