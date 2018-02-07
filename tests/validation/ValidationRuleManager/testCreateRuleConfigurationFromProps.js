import { ValidationRuleManager } from '../../../src/validation/ValidationRuleManager';
import RequiredRule from '../../../src/validation/rules/RequiredRule';
import NumberRule from '../../../src/validation/rules/NumberRule';
import LengthRangeRule from '../../../src/validation/rules/LengthRangeRule';
import MinRule from '../../../src/validation/rules/MinRule';

export default () => {
    describe('creates a rule configuration from props object', () => {
        let ruleManager;
        beforeEach(() => {
            ruleManager = new ValidationRuleManager();
        });
        it('exists as a function', () => {
            expect(typeof ruleManager.createRuleConfigurationFromProps).toEqual('function');
        });
        describe('when config is passed in data-validation-config prop', () => {
            it('thows error if object is not an array', () => {
                const getConfig = () =>
                    ruleManager.createRuleConfigurationFromProps({
                        'data-validation-config': {}
                    });
                expect(getConfig).toThrow(
                    'rule config object in data-validation-config must be an array'
                );
            });

            it('validates that all items in config are a rule type', () => {
                const getConfig = () =>
                    ruleManager.createRuleConfigurationFromProps({
                        'data-validation-config': [
                            { rule: new RequiredRule() },
                            new RequiredRule(),
                            'string'
                        ]
                    });
                expect(getConfig).toThrow(
                    'RuleConfiguration at index 2 must be instance of rule or object'
                );
                const getConfig2 = () =>
                    ruleManager.createRuleConfigurationFromProps({
                        'data-validation-config': [
                            { rule: new RequiredRule() },
                            new RequiredRule(),
                            {}
                        ]
                    });
                expect(getConfig2).toThrow(
                    'RuleConfiguration at index 2 must be have rule field of type Rule'
                );
            });

            it('returns config object for all props sorted by priority if it is supplied by data-validation-config', () => {
                const expected = [
                    {
                        rule: new NumberRule(),
                        message: 'message',
                        priority: -1
                    },
                    {
                        rule: new RequiredRule(),
                        message: new RequiredRule().getDefaultMessage,
                        priority: new RequiredRule().defaultPriority
                    },
                    {
                        rule: new NumberRule(),
                        message: new NumberRule().getDefaultMessage,
                        priority: new NumberRule().defaultPriority
                    }
                ];
                const getConfig = () =>
                    ruleManager.createRuleConfigurationFromProps({
                        'data-validation-config': [
                            { rule: new NumberRule() },
                            new RequiredRule(),
                            {
                                rule: new NumberRule(),
                                message: 'message',
                                priority: -1
                            }
                        ]
                    });
                expect(getConfig()).toEqual(expected);
            });
        });
        describe('when config is passed as separate-props', () => {
          it("constructs correct object using defaults if no msg or priority supplied",() => {
            const config = ruleManager.createRuleConfigurationFromProps({
              "data-rule-required": true
            })
            const reqdRule = new RequiredRule();
            expect(config).toEqual([{rule: reqdRule, message:reqdRule.getDefaultMessage, priority: 0}])
          })

          it("constructs correct object using properties",() => {
            const config = ruleManager.createRuleConfigurationFromProps({
              "data-rule-required": true,
              "data-msg-required": "TEST REQUIRED MSG",
              "data-rule-number": true,
              "data-priority-number": -1,
            })
            const reqdRule = new RequiredRule();
            const numberRule = new NumberRule();
            const expected = [{rule: numberRule, message:numberRule.getDefaultMessage, priority: -1},
          {rule: reqdRule, message:"TEST REQUIRED MSG", priority: 0}]
            expect(config).toEqual(expected)
          })

          it("passes property value to rule constructor",() =>{
              const config = ruleManager.createRuleConfigurationFromProps({
                "data-rule-length-range":[5,7],
                "data-rule-min": 7
              })
              const rangeRule = new LengthRangeRule(5,7);
              const minRule = new MinRule(7);
              const expected = [{rule: rangeRule, message:rangeRule.getDefaultMessage, priority: 1},
            {rule: minRule, message:minRule.getDefaultMessage, priority: 1}]
              expect(config).toEqual(expected)
          })

          it("skips rules whose value is false boolean", ()=> {
            const config = ruleManager.createRuleConfigurationFromProps({
              "data-rule-required": "false",
              "data-rule-number":false
            });
            const reqdRule = new RequiredRule();
            expect(config).toEqual([{rule: reqdRule, message:reqdRule.getDefaultMessage, priority: 0}])
          })
          it("throws Error for unregisteredRule", ()=> {
            const getConfig = ()=> ruleManager.createRuleConfigurationFromProps({
              "data-rule-unreal-rule": "false",
              "data-rule-number":true
            });
            expect(getConfig).toThrow(`Rule not found with name unreal-rule`)
          })
          it("accepts required html5 alias",() => {
            const config = ruleManager.createRuleConfigurationFromProps({
              "required": true
            })
            const reqdRule = new RequiredRule();
            expect(config).toEqual([{rule: reqdRule, message:reqdRule.getDefaultMessage, priority: 0}])
          })
        });
    });
};
