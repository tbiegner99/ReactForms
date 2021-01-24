import Rule from '../Rule';
import InvalidValueError from '../errors/InvalidValueError';
import Assert from '../../utils/Assert';

export default class MatchesFieldRule extends Rule {
  constructor(args) {
    super();
    const name = Array.isArray(args) ? args[0] : args;
    Assert.toBeType(name, 'string', `Expected argument to be name of field as string`);
    this.nameArg = name;
  }

  static get ruleName() {
    return 'matches-field';
  }

  static get priority() {
    return Number.MAX_SAFE_INTEGER;
  }

  getDefaultMessage() {
    return `Value should match field ${this.nameArg}`;
  }

  async validate(value, formValues) {
    if (formValues[this.nameArg] !== value) {
      throw new InvalidValueError('Fields do not match');
    }
  }
}
