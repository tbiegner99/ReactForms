import ObjectUtilities from '../utils/ObjectUtilities';
import ValueEnforcer from '../utils/ValueEnforcer';
import Rule from './Rule';
import Assert from '../utils/Assert';
import BuiltInRules from './BuiltInRules';
import Validator from './validator/Validator';

class PrivateFunctions {
    sortByPriority(rule1, rule2) {
        return rule1.priority - rule2.priority;
    }
}
let privates;
const _registeredRules = Symbol('registeredRules');

export class ValidationRuleManager {
    constructor() {
        privates = new PrivateFunctions(this);
        this[_registeredRules] = Object.assign({}, BuiltInRules);
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
        Assert.thatNot(
            this.doesRuleExst(rule.name),
            `Rule already exists. Please deregister the existing rule with the name ${
                rule.name
            } first`
        );
        Assert.toBeTruthy(rule.name, 'A valid name must be supplied for rule');
        this[_registeredRules][rule.name] = rule;

        return this;
    }

    validateSingleRuleConfiguration(rule, index) {
        if (rule instanceof Rule) {
            return;
        }
        Assert.toBeType(
            rule,
            'object',
            `RuleConfiguration at index ${index} must be instance of rule or object`
        );
        Assert.toBeInstanceOf(
            rule.rule,
            Rule,
            `RuleConfiguration at index ${index} must be have rule field of type Rule`
        );
    }

    normalizeRule(rule) {
        if (rule instanceof Rule) {
            return {
                rule,
                message: rule.getDefaultMessage,
                priority: rule.defaultPriority,
                name: rule.constructor.ruleName
            };
        }

        return Object.assign(
            {
                message: rule.rule.getDefaultMessage,
                priority: rule.rule.defaultPriority,
                name: rule.rule.constructor.ruleName
            },
            rule
        );
    }

    validateRuleConfiguration(config) {
        if (!Array.isArray(config)) {
            throw new Error('rule config object in data-validation-config must be an array');
        }
        config.forEach(this.validateSingleRuleConfiguration);
        const ruleConfig = config.map(this.normalizeRule);
        ruleConfig.sort(privates.sortByPriority);
        return ruleConfig;
    }

    createRuleConfigurationFromProps(props) {
        if (!props || typeof props !== 'object') {
            throw new Error('Props must be non null object');
        }
        const config = props['data-validation-config'];

        if (config) {
            return this.validateRuleConfiguration(config);
        }

        const ruleProps = ObjectUtilities.filter(
            props,
            (key, value) => key.startsWith('data-rule-') && value !== false
        );
        const msgProps = ObjectUtilities.filter(props, (key) => key.startsWith('data-msg-'));
        const priorityProps = ObjectUtilities.filter(props, (key) =>
            key.startsWith('data-priority-')
        );
        const rulesWithConfig = ObjectUtilities.filter(
            ruleProps,
            (key, value) => typeof value === 'object'
        );

        // special alias for html5 required attribute
        if (props.required) {
            ruleProps['data-rule-required'] = true;
        }

        const ruleObjects = ObjectUtilities.mapToArray(ruleProps, (value, key) => {
            const ruleConfig = rulesWithConfig[key] || {};
            const ruleName = key.substr('data-rule-'.length);
            let rule;
            if (value instanceof Rule) {
                rule = value;
            } else {
                const RuleType = this.rules[ruleName];

                if (!RuleType) throw new Error(`Rule not found with name ${ruleName}`);
                const ruleArgs = Array.isArray(value) ? value : [value];
                rule = new RuleType(...ruleArgs);
            }
            const defaultMessage = ValueEnforcer.toBeOneOfType(
                msgProps[`data-msg-${ruleName}`],
                ['string', 'function'],
                rule.getDefaultMessage
            );
            const defaultPriority = ValueEnforcer.toBeType(
                priorityProps[`data-priority-${ruleName}`],
                'number',
                rule.defaultPriority
            );

            return {
                rule,
                message: ValueEnforcer.toBeOneOfType(
                    ['string', 'function'],
                    ruleConfig.message,
                    defaultMessage
                ),
                priority: ValueEnforcer.toBeNumber(ruleConfig.priority, defaultPriority),
                name: ruleName
            };
        });
        ruleObjects.sort(privates.sortByPriority);

        return ruleObjects;
    }

    validate(value, props) {
        let config = props;
        if (!Array.isArray(props)) {
            config = this.createRuleConfigurationFromProps(props);
        }

        return Validator.validate(value, config);
    }
}
export default new ValidationRuleManager();
