import RuleManager from '../../src/validation/ValidationRuleManager';
import testAddRule from './ValidationRuleManager/testRegisterRule';
import testCreateRuleConfigurationFromProps from './ValidationRuleManager/testCreateRuleConfigurationFromProps';
import testValidate from './ValidationRuleManager/testValidate';

describe('ValidationRuleManger', () => {
    it('exports a singleton Object', () => {
        expect(typeof RuleManager).toEqual('object');
    });
    it('has an immutable property rules', () => {
        expect(typeof RuleManager.rules).toEqual('object');
        expect(RuleManager.rules).not.toBeNull();
        const changeRules = () => {
            RuleManager.rules = 'newRule';
        };
        expect(changeRules).toThrowError();
        const addRule = () => {
            RuleManager.rules.newRule = 'newRule';
        };
        expect(addRule).toThrowError();
    });
    testAddRule();
    testCreateRuleConfigurationFromProps();
    testValidate();
});
