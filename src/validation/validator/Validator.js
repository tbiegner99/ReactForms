import ArrayUtilities from '../../utils/ArrayUtilities';
import Assert from '../../utils/Assert';

// NOTE: to avoid fast failure and ensure all rules in a rule set
// get executed, always resolve rule evaluations,
// we determine rule set failure when merging results
const wrapRuleEvaluationInPromiseToEnforceAllRuleExecution = (config, value) =>
  new Promise((resolve) =>
    config.rule
      .validate(value)
      .then(() => resolve({ ruleName: config.name, isValid: true }))
      .catch(() => {
        let { message } = config;
        if (typeof message === 'function') {
          message = message(value, config.rule);
        }
        const errObject = {
          ruleName: config.name,
          valid: false,
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
    valid: isAllValid,
    message: isAllValid ? null : rulesViolated[0].message,
    numberOfRulesViolated,
    numberOfInvalidElements: isAllValid ? 0 : 1
  };
};

const ruleSetToPromiseSet = (ruleSet, value) =>
  ruleSet.map((ruleConfig) =>
    wrapRuleEvaluationInPromiseToEnforceAllRuleExecution(ruleConfig, value)
  );

const evaluateRuleSet = (value, ruleSet) =>
  new Promise((resolve, reject) => {
    Promise.all(ruleSetToPromiseSet(ruleSet, value))
      .then(combineErrors)
      .then((errObject) => {
        if (errObject.valid) {
          resolve(errObject);
        } else {
          reject(errObject);
        }
      });
  });

const executeRuleSets = (ruleSetsPromiseArray) => {
  if (!ruleSetsPromiseArray.length) {
    return Promise.resolve({
      valid: true,
      message: null,
      numberOfRulesViolated: 0,
      numberOfInvalidElements: 0
    });
  }
  return Promise.all(ruleSetsPromiseArray).then((successObjects) => successObjects[0]);
};

const validate = (value, config = []) => {
  Assert.toBeArray(config, 'Expected configuration to be an array');
  // a config will be an array of rule configurations
  const rulesByPriority = ArrayUtilities.partitionBy(config, (item) => item.priority);
  // this will be an array of arrays sorted by the priority (key)
  const rulesSetsSortedByPriority = Object.keys(rulesByPriority)
    .sort()
    .map((key) => rulesByPriority[key]);
  const rulesSetsAsPromiseArray = rulesSetsSortedByPriority.map(evaluateRuleSet.bind(null, value));
  // a success will only have one object in the array because of result merging
  return executeRuleSets(rulesSetsAsPromiseArray);
};

export default {
  validate
};
