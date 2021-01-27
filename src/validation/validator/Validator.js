import ArrayUtilities from '../../utils/ArrayUtilities';
import Assert from '../../utils/Assert';

// NOTE: to avoid fast failure and ensure all rules in a rule set
// get executed, always resolve rule evaluations,
// we determine rule set failure when merging results
const wrapRuleEvaluationInPromiseToEnforceAllRuleExecution = async (config, value, formValues) => {
  const ruleName = config.name || config.rule.ruleName;
  try {
    await config.rule.validate(value, formValues);
    return { ruleName, valid: true };
  } catch (err) {
    let { message } = config;
    if (typeof message === 'function') {
      message = message(value, config.rule, err);
    }
    const errObject = {
      ruleName,
      valid: false,
      message
    };
    return errObject;
  }
};
const combineErrors = (errs) => {
  const rulesViolated = errs.filter((err) => !err.valid);
  const numberOfRulesViolated = rulesViolated.length;
  const isAllValid = numberOfRulesViolated === 0;
  return {
    valid: isAllValid,
    message: isAllValid ? null : rulesViolated[0].message,
    ruleName: isAllValid ? null : rulesViolated[0].ruleName,
    results: errs,
    numberOfRulesViolated,
    numberOfInvalidElements: isAllValid ? 0 : 1
  };
};

const ruleSetToPromiseSet = (ruleSet, value, formValues) =>
  ruleSet.map((ruleConfig) =>
    wrapRuleEvaluationInPromiseToEnforceAllRuleExecution(ruleConfig, value, formValues)
  );

const evaluateRuleSet = async (value, formValues, ruleSet) => {
  const results = await Promise.all(ruleSetToPromiseSet(ruleSet, value, formValues));
  const errObject = combineErrors(results);
  if (!errObject.valid) {
    throw errObject;
  }
  return errObject;
};

const combineResults = (objects) => {
  let result = [];
  objects.forEach((obj) => {
    result = result.concat(obj.results);
  });
  return result;
};

const executeRuleSets = async (ruleSetsPromiseArray) => {
  if (!ruleSetsPromiseArray.length) {
    return {
      valid: true,
      ruleName: null,
      message: null,
      numberOfRulesViolated: 0,
      numberOfInvalidElements: 0
    };
  }
  const successObjects = await Promise.all(ruleSetsPromiseArray);
  return Object.assign(successObjects[0], {
    results: combineResults(successObjects)
  });
};

const validate = (value, config = [], formValues = {}) => {
  Assert.toBeArray(config, 'Expected configuration to be an array');
  // a config will be an array of rule configurations
  const rulesByPriority = ArrayUtilities.partitionBy(config, (item) => item.priority);
  // this will be an array of arrays sorted by the priority (key)
  const rulesSetsSortedByPriority = Object.keys(rulesByPriority)
    .sort()
    .map((key) => rulesByPriority[key]);
  const rulesSetsAsPromiseArray = rulesSetsSortedByPriority.map(
    evaluateRuleSet.bind(null, value, formValues)
  );
  // a success will only have one object in the array because of result merging
  return executeRuleSets(rulesSetsAsPromiseArray);
};

export default {
  validate
};
