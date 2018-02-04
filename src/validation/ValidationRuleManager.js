import ObjectUtilities from '../utils/ObjectUtilities';
import ValueEnforcer from '../utils/ValueEnforcer';
import Rule from './Rule';
import Assert from '../utils/Assert';
// Built in rules

class PrivateFunctions {
  sortByPriority(rule1, rule2) {
    return rule1.priority - rule2.priority;
  }
  loadBuiltInRules() {
    return {};
  }
}
let privates;
const _registeredRules = Symbol('registeredRules');
export class ValidationRuleManager {
  constructor() {
    privates = new PrivateFunctions(this);
    this[_registeredRules] = privates.loadBuiltInRules();
  }
  get rules() {
    return Object.freeze(this[_registeredRules]);
  }

  doesRuleExst(ruleName) {
    return !!this[_registeredRules][ruleName];
  }

  registerRule(rule) {
    Assert.toNotBeNullOrUndefined(rule, 'Cannot register null rule');
    Assert.toBeInstanceOf(rule, Rule, 'Rule must be of type Rule');
    Assert.thatNot(this.doesRuleExst(rule.name), `Rule already exists. Please deregister the existing rule with the name ${rule.name} first`);
    Assert.toBeTruthy(rule.name, 'A valid name must be supplied for rule');
    this[_registeredRules][rule.name] = rule;
    return this;
  }

  createRuleConfigurationFromProps(props) {
    const config = props['data-validation-config'];
    if (config && typeof config === 'object') {
      return config;
    }

    const ruleProps = ObjectUtilities.filter(props, (key, value) => key.startsWith('data-rule-') && value !== false);
    const msgProps = ObjectUtilities.filter(props, key => key.startsWith('data-msg-'));
    const priorityProps = ObjectUtilities.filter(props, key => key.startsWith('data-priority-'));
    const rulesWithConfig = ObjectUtilities.filter((key, value) => typeof value === 'object');

    const ruleObjects = ObjectUtilities.map(ruleProps, (key, value) => {
      const ruleConfig = rulesWithConfig[key] || {};
      const ruleName = key.substr('data-rule-'.length());
      const RuleType = this.rules[ruleName];
      if (!RuleType) throw new Error(`Rule not found with name ${ruleName}`);
      const ruleArgs = Array.isArray(value) ? value : [value];
      const rule = new RuleType(...ruleArgs);
      const defaultMessage = msgProps[`data-priority-${ruleName}`] || rule.getDefaultMessage;
      const defaultPriority = priorityProps[`data-priority-${ruleName}`] || rule.defaultPriority;

      return {
        rule,
        message: ValueEnforcer.toBeOneOfType(['string', 'function'], ruleConfig.message, defaultMessage),
        priority: ValueEnforcer.toBeNumber(ruleConfig.priority, defaultPriority),
      };
    });

    ruleObjects.sort(this.sortByPriority);
    return ruleObjects;
  }

  validateUsingConfiguration(config, value) {

  }

  validate(props, value) {
    const config = this.createRuleConfigurationFromProps(props);
    return this.validateUsingConfiguration(config, value);
  }
}
export default new ValidationRuleManager();
