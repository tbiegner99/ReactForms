import Rule from '../Rule';
import InvalidValueError from '../errors/InvalidValueError';

export default class RequiredRule extends Rule {
  static get ruleName() {
    return 'required';
  }

  // this should be first in rule list be default
  get defaultPriority() {
    return 0;
  }

  getDefaultMessage() {
    return 'Field is required.';
  }

  async validate(value) {
    if (!value) throw new InvalidValueError();
  }
}
