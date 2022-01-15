/* eslint-disable max-classes-per-file */
import { ValidationRuleManager } from '../../../src/validation/ValidationRuleManager';
import Rule from '../../../src/validation/Rule';

const InvalidRule = class extends Rule {
  static get ruleName() {
    return '';
  }
};

const ValidRule = class extends Rule {
  static get ruleName() {
    return 'rule-a';
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
      expect(ruleManager.rules['rule-a']).toEqual(ValidRule);
    });
    describe('unregister rule', () => {
      it('does not fail if rule does not exsist', () => {
        expect(ruleManager.rules['rule-a']).toBeUndefined();
        ruleManager.deregisterRule(ValidRule);
        expect(ruleManager.rules['rule-a']).toBeUndefined();
      });
      it('removes rule if rule does  exsist', () => {
        ruleManager.registerRule(ValidRule);
        expect(ruleManager.rules['rule-a']).toEqual(ValidRule);
        ruleManager.deregisterRule(ValidRule);
        expect(ruleManager.rules['rule-a']).toBeUndefined();
      });
    });
  });
};
