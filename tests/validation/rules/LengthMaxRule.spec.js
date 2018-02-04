import LengthMaxRule from '../../../src/validation/rules/LengthMaxRule';
import InvalidValueError from '../../../src/validation/errors/InvalidValueError';

describe('LengthMaxRule', () => {

  it('exported as a type', () => {
    expect(typeof LengthMaxRule).toEqual('function');
  });

  it('throws an error when trying to construct with no args', () => {
    const create = () => new LengthMaxRule();
    expect(create).toThrow('Expected integer for max length but found undefined');
  });

  it('throws an error when trying to construct with invalid number', () => {
    let create = () => new LengthMaxRule("abc");
    expect(create).toThrow('Expected integer for max length but found abc');
    create = () => new LengthMaxRule(true);
    expect(create).toThrow('Expected integer for max length but found true');
    create = () => new LengthMaxRule({});
    expect(create).toThrow('Expected integer for max length but found [object Object]');
  });

  it('throws an error when trying to construct with illegal value', () => {
    let create = () => new LengthMaxRule("-1");
    expect(create).toThrow('Invalid max length -1. Length must be greater than 0');
    create = () => new LengthMaxRule(-1);
    expect(create).toThrow('Invalid max length -1. Length must be greater than 0');
  });

  it('successfully constructs rule with valid arguments', () => {
    let create = () => new LengthMaxRule([1]);
    expect(create).not.toThrow();
    create = () => new LengthMaxRule([5,8]);//should ignore 2nd value
    expect(create).not.toThrow()
  });

  describe("with valid instance", ()=>{
    let rule;
    beforeEach(()=>{
      rule = new LengthMaxRule([5])
    })
    it('has a name', () => {
      expect(rule.name).toEqual('max-length');
    });


    it('has an implementation of validate', () => {
      expect(typeof rule.validate).toEqual('function');
    });

    it('returns a rejected promise on string greater than max length', async () => {
      return rule.validate(123456).catch((e)=>{
        expect(e).toBeInstanceOf(InvalidValueError);
      })
    });

    it('returns a successfull promise if length is less than min length', async () => {
      let validation = rule.validate("");
      const testStrings=["1","12","123","1234","12345"];
      testStrings.forEach((str)=>{
        validation=validation.then((str)=>{
          return rule.validate(str)
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
