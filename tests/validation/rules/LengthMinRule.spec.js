import LengthMinRule from '../../../src/validation/rules/LengthMinRule';
import InvalidValueError from '../../../src/validation/errors/InvalidValueError';

describe.only('LengthMinRule', () => {

  it('exported as a type', () => {
    expect(typeof LengthMinRule).toEqual('function');
  });

  it('throws an error when trying to construct with no args', () => {
    const create = () => new LengthMinRule();
    expect(create).toThrow('Expected integer for min length but found undefined');
  });

  it('throws an error when trying to construct with invalid number', () => {
    let create = () => new LengthMinRule("abc");
    expect(create).toThrow('Expected integer for min length but found abc');
    create = () => new LengthMinRule(true);
    expect(create).toThrow('Expected integer for min length but found true');
    create = () => new LengthMinRule({});
    expect(create).toThrow('Expected integer for min length but found [object Object]');
  });

  it('throws an error when trying to construct with illegal value', () => {
    let create = () => new LengthMinRule("-1");
    expect(create).toThrow('Invalid min length -1. Length must be at least 0');
    create = () => new LengthMinRule(-1);
    expect(create).toThrow('Invalid min length -1. Length must be at least 0');
  });

  it('successfully constructs rule with valid arguments', () => {
    let create = () => new LengthMinRule([0]);
    expect(create).not.toThrow();
    create = () => new LengthMinRule([5,8]);//should ignore 2nd value
    expect(create).not.toThrow()
  });

  describe("with valid instance", ()=>{
    let rule;
    beforeEach(()=>{
      rule = new LengthMinRule([6])
    })
    it('has a name', () => {
      expect(rule.name).toEqual('min-length');
    });


    it('has an implementation of validate', () => {
      expect(typeof rule.validate).toEqual('function');
    });

    it('returns a resolved promise on successfull validation (non empty value)', async () => {
      return rule.validate("Hello!").then(()=>{
        return rule.validate(123456);
      });
    });

    it('returns a rejected promise if length is less than min length', async () => {
      let validation = rule.validate("");
      const testStrings=["1","12","123","1234","12345"];
      testStrings.forEach(()=>{
        validation=validation.catch((e)=>{
          expect(e).toBeInstanceOf(InvalidValueError);
        })
      });
      return validation;
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

  })

});
