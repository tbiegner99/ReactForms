import Rule from '../Rule';
import InvalidValueError from '../errors/InvalidValueError';
import Assert from '../../utils/Assert';

export default class LengthMinRule extends Rule {
  constructor(args) {
    super();
    const lengthArg = Array.isArray() ? args[0] : args;
    this.minLength = Assert.toBeInteger(lengthArg, `Expected integer for min length but found ${lengthArg}`);
    Assert.that(this.minLength >= 0, `Invalid min length ${lengthArg}. Length must be at least 0.`);
  }
  get name() {
    return 'min-length';
  }
  validate(value) {
    const length = !value ? 0 : value.toString().length;
    return length < this.minLength ? Promise.reject(new InvalidValueError()) : Promise.resolve();
  }
}
