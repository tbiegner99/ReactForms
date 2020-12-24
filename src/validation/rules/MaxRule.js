import Rule from '../Rule';
import InvalidValueError from '../errors/InvalidValueError';
import Assert from '../../utils/Assert';

const expectValidArgumentType = (arg, msg) => {
  Assert.toNotBeNullOrUndefined(arg, msg);
  Assert.toBeOneOfType(arg, ['string', 'function', 'number', 'object'], msg);
  if (typeof arg === 'object') {
    Assert.toBeInstanceOf(arg, Date, msg);
  }
};

export default class MaxRule extends Rule {
  constructor(args) {
    super();
    const maxArg = Array.isArray(args) ? args[0] : args;

    expectValidArgumentType(maxArg, 'Expected string, function, number, or date for rule argument');
    // allow strings, numbers,comparisonFunctions, or dates
    if (maxArg instanceof Date) {
      this.limitArg = maxArg.getTime();
    } else {
      this.limitArg = maxArg;
    }
  }

  static get ruleName() {
    return 'max';
  }

  valueExceedsLimit(value, limit) {
    return value > limit;
  }

  getValueForComparison(value) {
    let comparisonValue = value;
    // special case for date,functions objects

    if (value instanceof Date) {
      comparisonValue = value.getTime();
    }

    return comparisonValue;
  }

  performChecks(value) {
    if (value == null || typeof value === 'undefined') {
      return Promise.resolve();
    } else if (typeof this.limitArg === 'function') {
      return this.limitArg(value) ? Promise.resolve() : Promise.reject(new InvalidValueError());
    }

    return null;
  }

  async validate(value) {
    const checkResult = this.performChecks(value);
    const comparisonValue = this.getValueForComparison(value);

    if (checkResult) return checkResult;

    if (this.valueExceedsLimit(comparisonValue, this.limitArg)) {
      throw new InvalidValueError();
    }
    return undefined;
  }
}
