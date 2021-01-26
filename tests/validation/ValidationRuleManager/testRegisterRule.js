import { ValidationRuleManager } from '../../../src/validation/ValidationRuleManager';
import Rule from '../../../src/validation/Rule';

const InvalidRule = class extends Rule {
  static get name() {
    return '';
  }
};

const ValidRule = class extends Rule {
  static get name() {
    return 'ruleA';
  }
};
export default () => {
  describe('register a rule', () => {
    let ruleManager;
    beforeEach(() => {
      ruleManager = new ValidationRuleManager();
    });
    it('exists as a function', () => {
      expect(typeof ruleManager.registerRule).toEqual('function');
    });
    it('throws an error if the rule to register is not a function', () => {
      const addIllegalRuleType = () => {
        ruleManager.registerRule('newRULE');
      };
      expect(addIllegalRuleType).toThrowError();
    });
    it('throws an error if you try to register an object that is not a rule', () => {
      const addIllegalRule = () => {
        ruleManager.registerRule({});
      };
      expect(addIllegalRule).toThrowError();
    });
    it('throws an error if a rule has an empty rule name', () => {
      const addIllegalRule = () => {
        ruleManager.registerRule(InvalidRule);
      };
      expect(addIllegalRule).toThrowError();
    });
    it('throws an error if the rule type already exists', () => {
      const addRule = () => {
        ruleManager.registerRule(ValidRule);
      };
      expect(addRule).not.toThrowError();
      expect(addRule).toThrowError();
    });

    it('throws an error if passed rule is not a class', () => {
      const addRule = () => {
        ruleManager.registerRule(new ValidRule());
      };
      expect(addRule).toThrowError();
    });
    it('returns the validation manager to allow chaining', () => {
      const ret = ruleManager.registerRule(ValidRule);
      expect(ret).toBe(ruleManager);
    });
  });
};
