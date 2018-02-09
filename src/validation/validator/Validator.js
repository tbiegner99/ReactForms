import ArrayUtilities from '../../utils/ArrayUtilities';

const wrapPromise = (config, value) =>
    new Promise((resolve) =>
        config.rule
            .validate(value)
            .then(() => resolve({ ruleName: config.name, isValid: true }))
            .catch(() => {
                let { message } = config;
                if (typeof message === 'function') {
                    message = message(value);
                }
                const errObject = {
                    ruleName: config.name,
                    isValid: false,
                    message
                };
                resolve(errObject);
            })
    );
const combineErrors = (errs) => {
    const rulesViolated = errs.filter((err) => !err.isValid);
    const numberOfRulesViolated = rulesViolated.length;
    const isAllValid = numberOfRulesViolated === 0;
    return {
        isAllValid,
        message: isAllValid ? null : rulesViolated[0].message,
        rulesViolated: numberOfRulesViolated,
        invalidElements: isAllValid ? 0 : 1
    };
};

const ruleSetToPromiseSet = (ruleSet, value) =>
    ruleSet.map((ruleConfig) => wrapPromise(ruleConfig, value));

const evaluateRuleSet = (value, ruleSet) =>
    new Promise((resolve, reject) => {
        Promise.all(ruleSetToPromiseSet(ruleSet, value))
            .then(combineErrors)
            .then((errObject) => {
                if (errObject.isAllValid) {
                    resolve(errObject);
                } else {
                    reject(errObject);
                }
            });
    });

export const privates = {};

const validate = (value, config) => {
    const rulesByPriority = ArrayUtilities.partitionBy(config, (item) => item.priority);
    // get sorted array of array of configurations orderd by priority
    const rulesSetsSortedByPriority = Object.keys(rulesByPriority)
        .sort()
        .map((key) => rulesByPriority[key]);
    const rulesSetsAsPromiseArray = rulesSetsSortedByPriority.map(
        evaluateRuleSet.bind(null, value)
    );
    return Promise.all(rulesSetsAsPromiseArray).then((successObjects) => successObjects[0]);
};

export default {
    validate
};
