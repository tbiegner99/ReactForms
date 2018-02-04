import Rule from '../Rule';
import InvalidValueError from '../errors/InvalidValueError';

export default class RequiredRule extends Rule {
  get name() {
    return 'required';
  }
  validate(value) {
    return !value ? Promise.reject(new InvalidValueError()) : Promise.resolve();
  }
}
