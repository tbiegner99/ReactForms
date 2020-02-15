import { ValidationRuleManager } from '../../../src/validation/ValidationRuleManager';
import Validator from '../../../src/validation/validator/Validator';

export default () => {
  describe('validates with approprite configuration', () => {
    let ruleManager;
    beforeEach(() => {
      ruleManager = new ValidationRuleManager();
      jest.spyOn(ruleManager, 'createRuleConfigurationFromProps');
      jest.spyOn(Validator, 'validate');
    });
    afterEach(() => {
      jest.restoreAllMocks();
    });
    it('does not create configuration if  props argument is already rule configuration', async () => {
      await expect(ruleManager.validate('value', [])).resolves.toEqual({
        valid: true,
        message: null,
        ruleName: null,
        numberOfRulesViolated: 0,
        numberOfInvalidElements: 0
      });
      expect(ruleManager.createRuleConfigurationFromProps).not.toHaveBeenCalled();
    });
    it('creates configuration if  props argument is rule configuration', async () => {
      await expect(ruleManager.validate('value', {})).resolves.toEqual({
        valid: true,
        message: null,
        ruleName: null,
        numberOfRulesViolated: 0,
        numberOfInvalidElements: 0
      });
      expect(ruleManager.createRuleConfigurationFromProps).toHaveBeenCalled();
    });
  });
};
