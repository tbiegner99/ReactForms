import Rule from '../Rule';
import InvalidValueError from '../errors/InvalidValueError';

export default class NumberRule extends Rule {
  static get ruleName() {
    return 'number';
  }

  async validate(value) {
    const parsed = parseFloat(value);

    if (Number.isNaN(parsed)) {
      throw new InvalidValueError();
    }
    return parsed;
  }
}
