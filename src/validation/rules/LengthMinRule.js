import Rule from '../Rule';
import InvalidValueError from '../errors/InvalidValueError';
import Assert from '../../utils/Assert';

export default class LengthMinRule extends Rule {
  constructor(args) {
    super();
    const lengthArg = Array.isArray(args) ? args[0] : args;
    this.minLength = Assert.toBeInteger(
      lengthArg,
      `Expected integer for min length but found ${lengthArg}`
    );
    Assert.that(this.minLength >= 0, `Invalid min length ${lengthArg}. Length must be at least 0.`);
  }

  static get ruleName() {
    return 'min-length';
  }

  async validate(value) {
    const length = !value ? 0 : value.toString().length;

    if (length < this.minLength) throw new InvalidValueError();
  }
}
