import Rule from '../Rule';
import InvalidValueError from '../errors/InvalidValueError';
import Assert from '../../utils/Assert';

export default class RegexRule extends Rule {
  constructor(args) {
    super();
    let regex = Array.isArray(args) ? args[0] : args;
    Assert.toNotBeNullOrUndefined(
      regex,
      'First argument to regex rule must be a string or regex object'
    );
    if (typeof regex === 'string') {
      regex = new RegExp(regex);
    }
    Assert.toBeInstanceOf(regex, RegExp, 'Expected argument for rule to be regex or string');
    this.regex = regex;
  }

  static get ruleName() {
    return 'regex';
  }

  async validate(value) {
    if (!this.regex.test(value)) throw new InvalidValueError();
  }
}
