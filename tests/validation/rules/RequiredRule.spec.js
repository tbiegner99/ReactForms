import RequiredRule from '../../../src/validation/rules/RequiredRule';
import InvalidValueError from '../../../src/validation/errors/InvalidValueError';

describe.only('RequiredRule', () => {
  let rule = null;
  beforeEach(() => {
    rule = new RequiredRule();
  });
  it('exported as a type', () => {
    expect(typeof RequiredRule).toEqual('function');
  });

  it('has a name', () => {
    expect(rule.name).toEqual('required');
  });

  it('has an implementation of validate', () => {
    expect(typeof rule.validate).toEqual('function');
  });

  it('returns a resolved promise on successfull validation (non empty value)', async () => {
    return rule.validate("Hello").then(()=>{
      return rule.validate(6);
    });
  });

  it('returns a rejected promise on empty string', async () => {
    return rule.validate("").catch((e)=> {
      expect(e).toBeInstanceOf(InvalidValueError);
    });
  });

  it('returns a rejected promise on null', async () => {
    return rule.validate(null).catch((e)=> {
      expect(e).toBeInstanceOf(InvalidValueError);
    });
  });

  it('returns a rejected promise on undefined', async () => {
    return rule.validate(null).catch((e)=> {
      expect(e).toBeInstanceOf(InvalidValueError);
    });
  });

});
